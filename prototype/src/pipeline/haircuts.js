// @ts-check
/**
 * Staleness + thin haircuts (doc 21 §21.4). Staleness maps the recency of the most-recent
 * qualifying sale to the Card-Ladder-style confidence meter (5..1) and a haircut; > 180 days
 * is excluded entirely (not a haircut). Thin adds a haircut when the surviving comp count is
 * within one of the classified tier's minimum.
 */
import PARAMS from '../params.js';

/**
 * @param {number} lastSaleAgeDays
 * @param {number} sales12mo
 * @param {('L1'|'L2'|'L3')} tier
 * @returns {{ excluded: true } | { excluded: false, stalenessBps: number, thinBps: number, confidence: (1|2|3|4|5) }}
 */
export function computeHaircuts(lastSaleAgeDays, sales12mo, tier) {
  let bracket = null;
  for (const b of PARAMS.stalenessHaircut) {
    if (lastSaleAgeDays <= b.maxDays) {
      bracket = b;
      break;
    }
  }
  if (bracket === null) return { excluded: true }; // > 180 days → ineligible

  const tierDef = PARAMS.liquidityTiers.find((t) => t.tier === tier);
  const tierMin = tierDef ? tierDef.minSales12mo : 0;
  const thinBps = sales12mo <= tierMin + 1 ? PARAMS.thinHaircutBps : 0;

  return {
    excluded: false,
    stalenessBps: bracket.haircutBps,
    thinBps,
    confidence: /** @type {1|2|3|4|5} */ (bracket.confidence),
  };
}
