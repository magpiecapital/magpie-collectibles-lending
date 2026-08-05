// @ts-check
/**
 * The appraisal orchestrator — a pure, deterministic function implementing the doc-24
 * pipeline. Fail-closed at every gate: any missing/insufficient signal returns an
 * INELIGIBLE appraisal with a specific reason code and no value. `now` is injected (no
 * wall-clock), so the function is fully deterministic + back-testable.
 */
import PARAMS from '../params.js';
import { validateCardId, isPlainObject, isNonNegInt, cleanString } from '../util/validate.js';
import { clampInt } from '../util/number.js';
import { fetchAllSales } from '../sources/source.js';
import { filterArmsLength } from './armsLength.js';
import { selectSurvivors, computeMark } from './mark.js';
import { checkProofOfSale } from './proofOfSale.js';
import { classifyLiquidity } from './liquidity.js';
import { computeHaircuts } from './haircuts.js';
import { computeDivergence } from './divergence.js';

/** @param {unknown} raw @param {number} nowMs @returns {import('../types.js').IssuerQuote | null} */
function validateIssuerQuote(raw, nowMs) {
  if (!isPlainObject(raw)) return null; // absent or malformed → treated as "no cross-check"
  const platform = cleanString(raw, 'platform');
  const fmvCents = Object.hasOwn(raw, 'fmvCents') ? raw.fmvCents : undefined;
  const asOfMs = Object.hasOwn(raw, 'asOfMs') ? raw.asOfMs : undefined;
  if (platform === null) return null;
  if (!isNonNegInt(fmvCents) || fmvCents <= 0 || fmvCents > PARAMS.limits.MAX_PRICE_CENTS) return null;
  if (!isNonNegInt(asOfMs) || asOfMs > nowMs) return null;
  return Object.freeze(Object.assign(Object.create(null), { platform, fmvCents, asOfMs }));
}

/**
 * @param {string[]} reasonCodes
 * @param {string} failCode
 * @param {number} asOfMs
 * @param {('L1'|'L2'|'L3'|null)} [tier]
 * @returns {import('../types.js').Appraisal}
 */
function ineligible(reasonCodes, failCode, asOfMs, tier = null) {
  return Object.freeze({
    eligible: false,
    reasonCodes: Object.freeze([...reasonCodes, failCode]),
    liquidityTier: tier,
    appraisedValueCents: null,
    maxLtvBps: 0,
    maxLoanCents: null,
    confidence: null,
    haircuts: Object.freeze({ stalenessBps: 0, thinBps: 0, divergenceBps: 0 }),
    provenance: Object.freeze([]),
    asOfMs,
  });
}

/**
 * @param {unknown} rawCardId
 * @param {unknown} rawIssuerQuote  issuer FMV cross-check, or null/undefined
 * @param {import('../types.js').RealizedSalesSource[]} sources
 * @param {number} nowMs  epoch ms (injected)
 * @returns {import('../types.js').Appraisal}
 */
export function appraise(rawCardId, rawIssuerQuote, sources, nowMs) {
  /** @type {string[]} */
  const reasons = [];
  if (!isNonNegInt(nowMs) || nowMs <= 0) return ineligible(reasons, 'bad_now_timestamp', 0);

  // 1. Identity — strict validation (attacker-controlled).
  const idv = validateCardId(rawCardId);
  if (!idv.ok) return ineligible(reasons, `identity_${idv.error}`, nowMs);
  const cardId = idv.value;
  reasons.push('identity_ok');

  const issuer = validateIssuerQuote(rawIssuerQuote, nowMs);

  // 2. Fetch + sanitize realized sales (untrusted feed boundary).
  const window = PARAMS.proofOfSale.WINDOW_12MO_DAYS;
  const rawSales = fetchAllSales(sources, cardId, window, nowMs);
  if (rawSales.length === 0) return ineligible(reasons, 'no_sales', nowMs);

  // 3. Arm's-length filter (wash removal).
  const { kept, removedCount } = filterArmsLength(rawSales);
  if (removedCount > 0) reasons.push(`armslength_removed_${removedCount}`);

  // 4. Survivors = age-filter + MAD outlier rejection (integrity).
  const survivors = selectSurvivors(kept, nowMs);
  if (survivors.length === 0) return ineligible(reasons, 'no_qualifying_sales', nowMs);

  // 5. Proof-of-sale gate on the survivor set (fail-closed).
  const pos = checkProofOfSale(survivors, nowMs);
  if (!pos.passed) return ineligible(reasons, pos.failCode ?? 'proof_of_sale_failed', nowMs);
  reasons.push('proof_of_sale_ok');

  // 6. Robust mark (recency-weighted trimmed median).
  const mk = computeMark(survivors, nowMs);
  if (mk.lastSaleAgeDays === null) return ineligible(reasons, 'no_mark', nowMs);

  // 7. PS-7 dollar floor (checked against the mark).
  if (mk.markCents < PARAMS.proofOfSale.DOLLAR_FLOOR_CENTS) {
    return ineligible(reasons, 'PS7_below_dollar_floor', nowMs);
  }

  // 8. Liquidity classification → tier (or ineligible).
  const liq = classifyLiquidity(survivors, mk.lastSaleAgeDays, mk.dispersion);
  if (liq.tier === null) return ineligible(reasons, 'liquidity_below_L3', nowMs);
  reasons.push(`liquidity_${liq.tier}`);

  // 9. Staleness + thin haircuts (or exclude > 180d).
  const hc = computeHaircuts(mk.lastSaleAgeDays, liq.sales12mo, liq.tier);
  if (hc.excluded) return ineligible(reasons, 'stale_over_180d', nowMs, liq.tier);

  const haircutBps = hc.stalenessBps + hc.thinBps;
  const valueAfterHaircut = clampInt(
    (mk.markCents * (10_000 - haircutBps)) / 10_000,
    0,
    PARAMS.limits.MAX_PRICE_CENTS,
  );

  // 10. Divergence / unfairly-priced gate vs issuer cross-check.
  const dv = computeDivergence(valueAfterHaircut, issuer);
  if (dv.refuse) return ineligible(reasons, 'unfairly_priced_divergence', nowMs, liq.tier);
  const valueAfterDivergence = clampInt(
    (valueAfterHaircut * (10_000 - dv.divergenceBps)) / 10_000,
    0,
    PARAMS.limits.MAX_PRICE_CENTS,
  );

  // 11. AV = min(independent value, issuer quote) — origination min() (doc 21 §21.4).
  const appraisedValueCents = issuer
    ? Math.min(valueAfterDivergence, issuer.fmvCents)
    : valueAfterDivergence;

  if (appraisedValueCents < PARAMS.proofOfSale.DOLLAR_FLOOR_CENTS) {
    return ineligible(reasons, 'PS7_below_dollar_floor_after_haircut', nowMs, liq.tier);
  }

  // 12. Size the loan. 50% (L1) ceiling is intrinsic to the tier→LTV map (doc 13.2).
  const maxLtvBps = PARAMS.ltvByTier[liq.tier];
  const maxLoanCents = Math.floor((appraisedValueCents * maxLtvBps) / 10_000);
  reasons.push('eligible');

  return Object.freeze({
    eligible: true,
    reasonCodes: Object.freeze(reasons),
    liquidityTier: liq.tier,
    appraisedValueCents,
    maxLtvBps,
    maxLoanCents,
    confidence: hc.confidence,
    haircuts: Object.freeze({
      stalenessBps: hc.stalenessBps,
      thinBps: hc.thinBps,
      divergenceBps: dv.divergenceBps,
    }),
    provenance: Object.freeze(mk.provenance),
    asOfMs: nowMs,
  });
}
