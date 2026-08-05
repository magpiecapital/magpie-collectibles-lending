// @ts-check
/**
 * Input-hardening tests: malformed / adversarial input is rejected or dropped, never
 * trusted, and never crashes the engine.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCardId, sanitizeSaleRecord } from '../src/util/validate.js';
import { appraise } from '../src/pipeline/appraise.js';
import { NOW, VALID_CARD, liquidBlueChipSources, throwingSource } from './helpers.js';

test('validateCardId accepts a well-formed identity and normalizes grader case', () => {
  const r = validateCardId({ ...VALID_CARD, grader: 'psa' });
  assert.equal(r.ok, true);
  if (r.ok) assert.equal(r.value.grader, 'PSA');
});

test('validateCardId rejects non-objects, arrays, and missing/invalid fields', () => {
  for (const bad of [null, undefined, 42, 'x', [], () => {}]) {
    assert.equal(validateCardId(bad).ok, false);
  }
  assert.equal(validateCardId({ ...VALID_CARD, grader: 'FAKEGRADER' }).ok, false);
  assert.equal(validateCardId({ ...VALID_CARD, certNumber: '' }).ok, false);
  const noSet = { ...VALID_CARD };
  delete noSet.set;
  assert.equal(validateCardId(noSet).ok, false);
});

test('validateCardId ignores prototype-pollution attempts', () => {
  const r = validateCardId(JSON.parse('{"grader":"PSA","grade":"10","certNumber":"1","set":"s","cardNumber":"4","__proto__":{"polluted":true}}'));
  assert.equal(r.ok, true);
  // nothing leaked onto Object.prototype
  assert.equal(/** @type {any} */ ({}).polluted, undefined);
});

test('sanitizeSaleRecord drops bad prices, dates, and missing venue', () => {
  const good = { priceCents: 1000, saleDateMs: NOW - 1000, venue: 'eBay', sellerId: 'a' };
  assert.notEqual(sanitizeSaleRecord(good, 'ebay', false, NOW), null);
  for (const bad of [
    { ...good, priceCents: -5 },
    { ...good, priceCents: 1.5 },
    { ...good, priceCents: 0 },
    { ...good, priceCents: Number.NaN },
    { ...good, priceCents: Number.POSITIVE_INFINITY },
    { ...good, priceCents: '1000' },
    { ...good, saleDateMs: NOW + 1_000_000 }, // future
    { ...good, saleDateMs: 1.5 },
    { ...good, venue: '' },
    { priceCents: 1000, saleDateMs: NOW - 1000, sellerId: 'a' }, // no venue
    null,
    [],
    42,
  ]) {
    assert.equal(sanitizeSaleRecord(bad, 'ebay', false, NOW), null, JSON.stringify(bad));
  }
});

test('appraise returns ineligible (not a throw) on a malformed card id', () => {
  const a = appraise({ garbage: true }, null, liquidBlueChipSources(), NOW);
  assert.equal(a.eligible, false);
  assert.ok(a.reasonCodes.some((c) => c.startsWith('identity_')));
});

test('a source that throws is contained — engine fails closed, does not crash', () => {
  const a = appraise(VALID_CARD, null, [throwingSource], NOW);
  assert.equal(a.eligible, false);
  assert.equal(a.appraisedValueCents, null);
});

test('a bad now timestamp is rejected', () => {
  for (const bad of [0, -1, 1.5, Number.NaN, 'now']) {
    const a = appraise(VALID_CARD, null, liquidBlueChipSources(), /** @type {any} */ (bad));
    assert.equal(a.eligible, false);
  }
});

test('a source returning a huge array is capped and still terminates', () => {
  const huge = {
    id: 'flood',
    corpus: 'ebay',
    independentOfEbay: false,
    realizedSales() {
      const out = [];
      for (let i = 0; i < 60_000; i++) out.push({ priceCents: 1000, saleDateMs: NOW - 1000, venue: 'eBay', sellerId: 'x' });
      return out;
    },
  };
  const a = appraise(VALID_CARD, null, [huge], NOW);
  // wash-filtered (same seller+price) → ineligible, but crucially it returns without hanging.
  assert.equal(typeof a.eligible, 'boolean');
});
