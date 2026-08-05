// @ts-check
/**
 * Liquidity classification (doc 21 §21.3). Survivors are already within the 12-month
 * window, so their count is the 12-month sale count. Returns the first (most-liquid) tier
 * whose gates ALL pass, or null (→ ineligible: below L3).
 */
import PARAMS from '../params.js';

/**
 * @param {import('../types.js').SaleRecord[]} survivors
 * @param {number} lastSaleAgeDays
 * @param {number} dispersion  iqr/median of survivor prices
 * @returns {{ tier: ('L1'|'L2'|'L3'|null), sales12mo: number }}
 */
export function classifyLiquidity(survivors, lastSaleAgeDays, dispersion) {
  const sales12mo = survivors.length;
  for (const t of PARAMS.liquidityTiers) {
    if (
      sales12mo >= t.minSales12mo &&
      lastSaleAgeDays <= t.maxLastSaleDays &&
      dispersion <= t.maxDispersion
    ) {
      return { tier: /** @type {'L1'|'L2'|'L3'} */ (t.tier), sales12mo };
    }
  }
  return { tier: null, sales12mo };
}
