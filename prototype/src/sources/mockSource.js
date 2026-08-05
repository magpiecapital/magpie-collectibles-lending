// @ts-check
/**
 * Deterministic in-memory sources for tests + the back-test harness. No network, no
 * randomness, no wall-clock. A real licensed adapter (PSA APR / Fanatics / PPT) would
 * implement the same RealizedSalesSource interface and match on card identity; the mock
 * simply returns its fixed sales that fall inside the requested window.
 */
import PARAMS from '../params.js';

/**
 * @param {{ id: string, corpus: string, independentOfEbay: boolean,
 *   sales: Array<{ priceCents:number, saleDateMs:number, venue:string, sellerId?:string|null }> }} cfg
 * @returns {import('../types.js').RealizedSalesSource}
 */
export function makeMockSource(cfg) {
  const fixed = cfg.sales.slice();
  return {
    id: cfg.id,
    corpus: cfg.corpus,
    independentOfEbay: cfg.independentOfEbay,
    realizedSales(_cardId, windowDays, nowMs) {
      const cutoff = nowMs - windowDays * PARAMS.DAY_MS;
      return fixed.filter((s) => s.saleDateMs >= cutoff && s.saleDateMs <= nowMs);
    },
  };
}

/** Convenience: epoch ms `n` days before `nowMs`. @param {number} nowMs @param {number} n @returns {number} */
export function daysAgo(nowMs, n) {
  return nowMs - n * PARAMS.DAY_MS;
}

/**
 * Build a raw sale record. Price in whole dollars for readability → converted to cents.
 * @param {number} priceDollars @param {number} saleDateMs @param {string} venue @param {string|null} [sellerId]
 */
export function sale(priceDollars, saleDateMs, venue, sellerId = null) {
  return { priceCents: Math.round(priceDollars * 100), saleDateMs, venue, sellerId };
}
