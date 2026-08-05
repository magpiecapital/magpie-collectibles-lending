// @ts-check
/**
 * Happy-path + eligibility-gate tests. Each gate must fail closed with its reason code.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appraise } from '../src/pipeline/appraise.js';
import { classifyLiquidity } from '../src/pipeline/liquidity.js';
import { makeMockSource, sale, daysAgo } from '../src/sources/mockSource.js';
import { NOW, VALID_CARD, liquidBlueChipSources } from './helpers.js';

const src = (id, corpus, independentOfEbay, sales) => makeMockSource({ id, corpus, independentOfEbay, sales });

test('happy path: a clean liquid blue-chip is eligible at Tier A (50%)', () => {
  const a = appraise(VALID_CARD, null, liquidBlueChipSources(), NOW);
  assert.equal(a.eligible, true);
  assert.equal(a.liquidityTier, 'L1');
  assert.equal(a.maxLtvBps, 5000);
  assert.equal(a.confidence, 5);
  assert.ok(a.appraisedValueCents !== null && a.appraisedValueCents >= 950_000 && a.appraisedValueCents <= 1_050_000, `AV ${a.appraisedValueCents}`);
  assert.equal(a.maxLoanCents, Math.floor(/** @type {number} */ (a.appraisedValueCents) / 2));
  assert.ok(a.provenance.length > 0);
  assert.ok(a.reasonCodes.includes('eligible'));
});

test('PS-1: too few sales → ineligible', () => {
  const s = [src('psa_apr', 'multi', true, [
    sale(10000, daysAgo(NOW, 2), 'Heritage', 'a'),
    sale(10100, daysAgo(NOW, 5), 'Heritage', 'b'),
    sale(9900, daysAgo(NOW, 9), 'MemoryLane', 'c'),
  ])];
  const a = appraise(VALID_CARD, null, s, NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.some((c) => c.startsWith('PS1')));
});

test('PS-2: too few distinct sellers → ineligible', () => {
  const s = [src('psa_apr', 'multi', true, [
    sale(10000, daysAgo(NOW, 2), 'Heritage', 'a'),
    sale(10100, daysAgo(NOW, 6), 'Fanatics', 'a'),
    sale(10200, daysAgo(NOW, 12), 'Heritage', 'a'),
    sale(9900, daysAgo(NOW, 20), 'Fanatics', 'b'),
    sale(9800, daysAgo(NOW, 30), 'Heritage', 'b'),
    sale(9700, daysAgo(NOW, 45), 'Fanatics', 'b'),
  ])];
  const a = appraise(VALID_CARD, null, s, NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.includes('PS2_too_few_sellers'));
});

test('PS-3: too few distinct venues → ineligible', () => {
  const s = [src('psa_apr', 'multi', true, [
    sale(10000, daysAgo(NOW, 2), 'Heritage', 'a'),
    sale(10100, daysAgo(NOW, 6), 'Heritage', 'b'),
    sale(10200, daysAgo(NOW, 12), 'Heritage', 'c'),
    sale(9900, daysAgo(NOW, 20), 'Heritage', 'd'),
    sale(9800, daysAgo(NOW, 30), 'Heritage', 'e'),
  ])];
  const a = appraise(VALID_CARD, null, s, NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.includes('PS3_too_few_venues'));
});

test('PS-4: no eBay-independent corpus → ineligible', () => {
  const s = [src('ppt', 'ebay', false, [
    sale(10000, daysAgo(NOW, 2), 'eBay', 'a'),
    sale(10100, daysAgo(NOW, 6), 'eBayUK', 'b'),
    sale(10200, daysAgo(NOW, 12), 'eBay', 'c'),
    sale(9900, daysAgo(NOW, 20), 'eBayUK', 'd'),
    sale(9800, daysAgo(NOW, 30), 'eBay', 'e'),
  ])];
  const a = appraise(VALID_CARD, null, s, NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.includes('PS4_no_ebay_independent_source'));
});

test('PS-7: below the $250 floor → ineligible', () => {
  const s = [src('psa_apr', 'multi', true, [
    sale(1, daysAgo(NOW, 2), 'Heritage', 'a'),
    sale(1, daysAgo(NOW, 6), 'Fanatics', 'b'),
    sale(1, daysAgo(NOW, 12), 'MemoryLane', 'c'),
    sale(1, daysAgo(NOW, 20), 'Heritage', 'd'),
    sale(1, daysAgo(NOW, 30), 'Fanatics', 'e'),
  ])];
  const a = appraise(VALID_CARD, null, s, NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.some((c) => c.startsWith('PS7')));
});

test('liquidity: wide price dispersion → below L3 → ineligible', () => {
  const s = [src('psa_apr', 'multi', true, [
    sale(5000, daysAgo(NOW, 2), 'Heritage', 'a'),
    sale(5500, daysAgo(NOW, 6), 'Fanatics', 'b'),
    sale(9000, daysAgo(NOW, 12), 'MemoryLane', 'c'),
    sale(10000, daysAgo(NOW, 20), 'Heritage', 'd'),
    sale(14500, daysAgo(NOW, 30), 'Fanatics', 'e'),
    sale(15000, daysAgo(NOW, 45), 'MemoryLane', 'f'),
  ])];
  const a = appraise(VALID_CARD, null, s, NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.includes('liquidity_below_L3'));
});

test('boundary buffer (T-17/I-12): dispersion inside the raw L1 threshold falls to the conservative tier', () => {
  const dummy = /** @type {any} */ (Array.from({ length: 15 }, () => ({})));
  // L1 raw threshold 0.20 → buffered 0.17. 0.18 is inside the raw threshold but past the
  // buffer → must NOT be granted L1 (falls to L2). 0.15 clears the buffer → L1.
  assert.equal(classifyLiquidity(dummy, 5, 0.18).tier, 'L2');
  assert.equal(classifyLiquidity(dummy, 5, 0.15).tier, 'L1');
});

test('issuer quote BELOW the mark → AV = min(mark, issuer)', () => {
  const issuer = { platform: 'CollectorCrypt', fmvCents: 800_000, asOfMs: NOW - 1000 };
  const a = appraise(VALID_CARD, issuer, liquidBlueChipSources(), NOW);
  assert.equal(a.eligible, true);
  assert.equal(a.appraisedValueCents, 800_000);
  assert.equal(a.maxLoanCents, 400_000);
});
