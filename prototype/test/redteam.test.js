// @ts-check
/**
 * RED-TEAM: the security proof. Each attack from doc 24 §24.6 / doc 5 must leave the
 * appraised value UNMOVED or make the card INELIGIBLE. If any of these fail, the oracle
 * is exploitable and must not ship.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appraise } from '../src/pipeline/appraise.js';
import { makeMockSource, sale, daysAgo } from '../src/sources/mockSource.js';
import { NOW, VALID_CARD, liquidBlueChipSources } from './helpers.js';

const clean = () => appraise(VALID_CARD, null, liquidBlueChipSources(), NOW);
const src = (id, corpus, indep, sales) => makeMockSource({ id, corpus, independentOfEbay: indep, sales });

test('baseline clean set is eligible (control)', () => {
  assert.equal(clean().eligible, true);
});

test('T-1 wash trading: same-seller same-price flood is removed; value unmoved', () => {
  const base = clean();
  const washer = src('wash', 'ebay', false, [
    sale(50000, daysAgo(NOW, 1), 'eBay', 'washer'),
    sale(50000, daysAgo(NOW, 1), 'eBay', 'washer'),
    sale(50000, daysAgo(NOW, 2), 'eBay', 'washer'),
    sale(50000, daysAgo(NOW, 2), 'eBay', 'washer'),
    sale(50000, daysAgo(NOW, 3), 'eBay', 'washer'),
  ]);
  const attacked = appraise(VALID_CARD, null, [...liquidBlueChipSources(), washer], NOW);
  assert.equal(attacked.eligible, true);
  assert.equal(attacked.appraisedValueCents, base.appraisedValueCents); // exactly unmoved
});

test('T-12 shill pump: distinct-seller high-price spikes are rejected as outliers; value unmoved', () => {
  const shill = src('shill', 'multi', true, [
    sale(50000, daysAgo(NOW, 1), 'ShillHouse', 'x'),
    sale(50000, daysAgo(NOW, 2), 'ShillHouse', 'y'),
    sale(50000, daysAgo(NOW, 3), 'ShillHouse', 'z'),
  ]);
  const attacked = appraise(VALID_CARD, null, [...liquidBlueChipSources(), shill], NOW);
  assert.equal(attacked.eligible, true);
  assert.ok(
    /** @type {number} */ (attacked.appraisedValueCents) >= 950_000 &&
      /** @type {number} */ (attacked.appraisedValueCents) <= 1_050_000,
    `value pulled by shill: ${attacked.appraisedValueCents}`,
  );
});

test('F-1 shared-source (eBay) pump: inflating ONLY the eBay corpus cannot move the value', () => {
  // Replace the eBay feed with a 3x-inflated one; independent (PSA/Fanatics) corpus is clean.
  const [psa, fanatics] = liquidBlueChipSources();
  const pumpedEbay = src('ppt', 'ebay', false, [
    sale(30000, daysAgo(NOW, 8), 'eBay', 'eA'),
    sale(30000, daysAgo(NOW, 30), 'eBay', 'eB'),
    sale(30000, daysAgo(NOW, 70), 'eBay', 'eC'),
    sale(30000, daysAgo(NOW, 220), 'eBay', 'eD'),
  ]);
  const attacked = appraise(VALID_CARD, null, [psa, fanatics, pumpedEbay], NOW);
  assert.equal(attacked.eligible, true);
  // anchored to the independent ~$10k cluster, NOT dragged toward $30k
  assert.ok(
    /** @type {number} */ (attacked.appraisedValueCents) >= 900_000 &&
      /** @type {number} */ (attacked.appraisedValueCents) <= 1_100_000,
    `eBay pump moved value: ${attacked.appraisedValueCents}`,
  );
});

test('thin/dispersed market: a wide spread is not eligible at Tier A', () => {
  const wide = src('psa_apr', 'multi', true, [
    sale(5000, daysAgo(NOW, 2), 'Heritage', 'a'),
    sale(15000, daysAgo(NOW, 6), 'Fanatics', 'b'),
    sale(5200, daysAgo(NOW, 12), 'MemoryLane', 'c'),
    sale(14800, daysAgo(NOW, 20), 'Heritage', 'd'),
    sale(9000, daysAgo(NOW, 30), 'Fanatics', 'e'),
    sale(11000, daysAgo(NOW, 45), 'MemoryLane', 'f'),
  ]);
  const a = appraise(VALID_CARD, null, [wide], NOW);
  assert.notEqual(a.liquidityTier, 'L1');
});

test('issuer-FMV inflation: an issuer value >15% above the mark → unfairly-priced refuse', () => {
  const issuer = { platform: 'CollectorCrypt', fmvCents: 2_000_000, asOfMs: NOW - 1000 }; // ~2x mark
  const a = appraise(VALID_CARD, issuer, liquidBlueChipSources(), NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.includes('unfairly_priced_divergence'));
});

test('no-realized-sales + high issuer FMV: never price off the issuer number → ineligible', () => {
  const issuer = { platform: 'CollectorCrypt', fmvCents: 5_000_000, asOfMs: NOW - 1000 };
  const a = appraise(VALID_CARD, issuer, [], NOW);
  assert.equal(a.eligible, false);
  assert.equal(a.appraisedValueCents, null);
});

test('future-dated sale injection: dropped at sanitization; value unmoved', () => {
  const base = clean();
  const future = src('psa_apr', 'multi', true, [
    { priceCents: 5_000_000, saleDateMs: NOW + 30 * 86_400_000, venue: 'Heritage', sellerId: 'ff' },
  ]);
  const attacked = appraise(VALID_CARD, null, [...liquidBlueChipSources(), future], NOW);
  assert.equal(attacked.appraisedValueCents, base.appraisedValueCents);
});
