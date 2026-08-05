// @ts-check
/**
 * Divergence / "unfairly priced" gate (doc 21 §21.4). Compares an issuer's self-assigned
 * value (FMV / buyback / listing) to our independent realized mark. If the issuer sits more
 * than HARD_REFUSE_BPS above the mark, the item is deemed unfairly priced → refuse. Below
 * that, a continuous haircut shades the value down in proportion to the overage (extra
 * conservatism — we never lend UP toward the issuer's number).
 *
 * Direction that matters: only an issuer value ABOVE our mark is a concern. An issuer value
 * below the mark is handled by AV = min(mark, issuer) in the orchestrator.
 */
import PARAMS from '../params.js';

/**
 * @param {number} markCents  our independent (already staleness/thin-haircut) mark
 * @param {import('../types.js').IssuerQuote | null} issuer
 * @returns {{ refuse: boolean, divergenceBps: number, overageBps: number }}
 */
export function computeDivergence(markCents, issuer) {
  if (issuer === null || markCents <= 0) return { refuse: false, divergenceBps: 0, overageBps: 0 };
  const overage = issuer.fmvCents - markCents;
  if (overage <= 0) return { refuse: false, divergenceBps: 0, overageBps: 0 };

  const overageBps = Math.round((overage / markCents) * 10_000);
  if (overageBps > PARAMS.divergence.HARD_REFUSE_BPS) {
    return { refuse: true, divergenceBps: 0, overageBps };
  }
  // Continuous haircut below the hard line (capped at the hard-refuse level).
  const divergenceBps = Math.min(
    Math.round(overageBps * PARAMS.divergence.CONTINUOUS_HAIRCUT_SLOPE),
    PARAMS.divergence.HARD_REFUSE_BPS,
  );
  return { refuse: false, divergenceBps, overageBps };
}
