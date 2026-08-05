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
  const buffer = PARAMS.LIQUIDITY_BOUNDARY_BUFFER_FRAC;
  for (const t of PARAMS.liquidityTiers) {
    // Boundary buffer on dispersion (T-17 / I-12): must clear the threshold by a margin,
    // so a borderline card falls to the more-conservative tier and a marginal manipulation
    // of the (manipulable) non-independent corpus cannot step the LTV up.
    if (
      sales12mo >= t.minSales12mo &&
      lastSaleAgeDays <= t.maxLastSaleDays &&
      dispersion <= t.maxDispersion * (1 - buffer)
    ) {
      return { tier: /** @type {'L1'|'L2'|'L3'} */ (t.tier), sales12mo };
    }
  }
  return { tier: null, sales12mo };
}
