// @ts-check
/**
 * The robust mark (doc 21 §21.4). Two steps, kept separate on purpose:
 *  - selectSurvivors(): age-filter (≤ MAX_SALE_AGE_DAYS) + MAD outlier rejection. This is
 *    an INTEGRITY filter — its output drives the proof-of-sale + liquidity counts.
 *  - computeMark(): trim the extreme decile, then a RECENCY-WEIGHTED median (never last-sale,
 *    never mean, never a listing). This is the VALUE, computed only from survivors.
 */
import PARAMS from '../params.js';
import { median, mad, iqr, weightedMedian, trimByFraction, clampInt } from '../util/number.js';

/**
 * Age-filter + MAD outlier rejection.
 * @param {import('../types.js').SaleRecord[]} sales
 * @param {number} nowMs
 * @returns {import('../types.js').SaleRecord[]}
 */
export function selectSurvivors(sales, nowMs) {
  const ageCut = nowMs - PARAMS.mark.MAX_SALE_AGE_DAYS * PARAMS.DAY_MS;
  const inWindow = sales.filter((s) => s.saleDateMs >= ageCut);
  if (inWindow.length === 0) return [];

  const prices = inWindow.map((s) => s.priceCents);
  const med = median(prices);
  const m = mad(prices, med);
  if (m <= 0) return inWindow; // all prices identical → nothing is an outlier

  const bound = PARAMS.mark.MAD_OUTLIER_MULTIPLIER * m;
  const kept = inWindow.filter((s) => Math.abs(s.priceCents - med) <= bound);
  return kept.length > 0 ? kept : inWindow; // never empty out on a pathological spread
}

/**
 * Trim the extreme decile by price, then take a recency-weighted median of the rest.
 * @param {import('../types.js').SaleRecord[]} survivors
 * @param {number} nowMs
 * @returns {{ markCents: number, dispersion: number, lastSaleAgeDays: (number|null),
 *   provenance: import('../types.js').SaleRecord[] }}
 */
export function computeMark(survivors, nowMs) {
  if (survivors.length === 0) {
    return { markCents: 0, dispersion: Number.POSITIVE_INFINITY, lastSaleAgeDays: null, provenance: [] };
  }
  const prices = survivors.map((s) => s.priceCents);

  // Trim by price to bounds; keep the survivor RECORDS whose price is within bounds
  // (so we retain each record's sale date for recency weighting).
  const trimmedPrices = trimByFraction(prices, PARAMS.mark.TRIM_FRACTION);
  const lo = Math.min(...trimmedPrices);
  const hi = Math.max(...trimmedPrices);
  let kept = survivors.filter((s) => s.priceCents >= lo && s.priceCents <= hi);
  if (kept.length === 0) kept = survivors;

  const tau = PARAMS.mark.RECENCY_TAU_DAYS;
  const weighted = kept.map((s) => {
    const ageDays = Math.max(0, (nowMs - s.saleDateMs) / PARAMS.DAY_MS);
    return { value: s.priceCents, weight: Math.exp(-ageDays / tau) };
  });
  const markCents = clampInt(weightedMedian(weighted), 0, PARAMS.limits.MAX_PRICE_CENTS);

  const keptPrices = kept.map((s) => s.priceCents);
  const medKept = median(keptPrices);
  const dispersion = medKept > 0 ? iqr(keptPrices) / medKept : Number.POSITIVE_INFINITY;

  const mostRecent = survivors.reduce((a, s) => (s.saleDateMs > a ? s.saleDateMs : a), 0);
  const lastSaleAgeDays = Math.floor((nowMs - mostRecent) / PARAMS.DAY_MS);

  return { markCents, dispersion, lastSaleAgeDays, provenance: kept };
}
