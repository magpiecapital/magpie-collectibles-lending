// @ts-check
/**
 * Proof-of-Sale gate (doc 21 §21.2). Evaluated on the SURVIVOR set (post arms-length +
 * post outlier-rejection), so counts reflect only clean, in-window sales. ALL checks must
 * pass; the first failure short-circuits with a specific reason code (fail-closed).
 *
 * PS-5 (exact-identity match) is enforced upstream at the source/fetch layer — each source
 * returns comps for the requested identity — so it is asserted, not re-derived here.
 * PS-7 ($ floor) is checked against the final mark by the orchestrator.
 */
import PARAMS from '../params.js';

/**
 * @param {import('../types.js').SaleRecord[]} survivors  in-window, clean sales
 * @param {number} nowMs
 * @returns {{ passed: boolean, failCode: (string|null), stats: {
 *   sales12mo:number, sales90d:number, distinctSellers:number, distinctVenues:number, independentCorpusSales:number
 * } }}
 */
export function checkProofOfSale(survivors, nowMs) {
  const p = PARAMS.proofOfSale;
  const cut12 = nowMs - p.WINDOW_12MO_DAYS * PARAMS.DAY_MS;
  const cut90 = nowMs - p.WINDOW_90D_DAYS * PARAMS.DAY_MS;

  let sales12mo = 0;
  let sales90d = 0;
  const sellers = new Set();
  const venues = new Set();
  let independentCorpusSales = 0;

  for (const s of survivors) {
    if (s.saleDateMs >= cut12) sales12mo++;
    if (s.saleDateMs >= cut90) sales90d++;
    if (s.sellerId !== null) sellers.add(s.sellerId); // null seller adds no diversity (conservative)
    venues.add(s.venue);
    if (s.independentOfEbay) independentCorpusSales++;
  }

  const stats = {
    sales12mo,
    sales90d,
    distinctSellers: sellers.size,
    distinctVenues: venues.size,
    independentCorpusSales,
  };

  // ALL must pass — first failure wins (fail-closed).
  if (sales12mo < p.MIN_SALES_12MO) return { passed: false, failCode: 'PS1_too_few_sales_12mo', stats };
  if (sales90d < p.MIN_SALES_90D) return { passed: false, failCode: 'PS1_too_few_sales_90d', stats };
  if (sellers.size < p.MIN_DISTINCT_SELLERS) return { passed: false, failCode: 'PS2_too_few_sellers', stats };
  if (venues.size < p.MIN_DISTINCT_VENUES) return { passed: false, failCode: 'PS3_too_few_venues', stats };
  if (independentCorpusSales < p.MIN_INDEPENDENT_CORPUS_SALES) {
    return { passed: false, failCode: 'PS4_no_ebay_independent_source', stats };
  }
  return { passed: true, failCode: null, stats };
}
