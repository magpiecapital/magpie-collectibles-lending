// @ts-check
/**
 * Frozen policy parameters — the single source of truth for the prototype.
 * Values track docs 21 (proof-of-sale / liquidity), 13 (economics/LTV), 17 (params).
 * All monetary values are INTEGER CENTS (USD). All durations are DAYS. All timestamps
 * passed into the engine are EPOCH MILLISECONDS (integer).
 *
 * Everything here is deep-frozen so no downstream code (or a malicious plugin source)
 * can mutate policy at runtime.
 */

const DAY_MS = 86_400_000;

const PARAMS = {
  DAY_MS,

  // ── Proof-of-Sale gate (doc 21 §21.2) — ALL must pass, else INELIGIBLE ──
  proofOfSale: {
    MIN_SALES_12MO: 5,
    MIN_SALES_90D: 2,
    MIN_DISTINCT_SELLERS: 3,
    MIN_DISTINCT_VENUES: 2,
    MIN_INDEPENDENT_CORPUS_SALES: 1, // ≥1 sale from an eBay-independent corpus (PS-4 / I-7)
    DOLLAR_FLOOR_CENTS: 25_000, // $250 minimum proven value (PS-7)
    WINDOW_12MO_DAYS: 365,
    WINDOW_90D_DAYS: 90,
  },

  // ── Robust mark (doc 21 §21.4) ──
  mark: {
    RECENCY_TAU_DAYS: 90, // exponential recency weight w = exp(-age/τ)
    TRIM_FRACTION: 0.1, // drop top/bottom decile before the weighted median
    MAD_OUTLIER_MULTIPLIER: 3, // reject sales > k·MAD from the median
    MAX_SALE_AGE_DAYS: 365, // sales older than this are not counted toward the mark
  },

  // ── Liquidity classification (doc 21 §21.3) → tier ──
  // Ordered most→least liquid; first tier whose gates ALL pass wins.
  liquidityTiers: [
    { tier: 'L1', minSales12mo: 12, maxLastSaleDays: 14, maxDispersion: 0.2 },
    { tier: 'L2', minSales12mo: 6, maxLastSaleDays: 30, maxDispersion: 0.3 },
    { tier: 'L3', minSales12mo: 4, maxLastSaleDays: 90, maxDispersion: 0.4 },
  ],

  // Anti tier-flip boundary buffer (T-17 / I-12): a card must clear a tier's DISPERSION
  // threshold by this margin to be granted the tier, so a borderline card defaults to the
  // more-conservative tier and a marginal manipulation of the non-independent corpus can't
  // step the LTV. (Full elimination of the step needs production hysteresis / continuous LTV.)
  LIQUIDITY_BOUNDARY_BUFFER_FRAC: 0.15,

  // ── Staleness / confidence haircut (doc 21 §21.4) ──
  // Applied to the mark by recency of the most recent qualifying sale.
  // haircutBps is basis points removed from value. confidence is the 1..5 meter.
  stalenessHaircut: [
    { maxDays: 14, confidence: 5, haircutBps: 0 },
    { maxDays: 30, confidence: 4, haircutBps: 500 },
    { maxDays: 90, confidence: 3, haircutBps: 1500 },
    { maxDays: 180, confidence: 2, haircutBps: 3000 },
    // > 180 days → excluded (handled as ineligible, not a haircut)
  ],

  // Extra haircut when the surviving comp set is at the thin end of its tier.
  thinHaircutBps: 1000, // +10% when comp count is within 1 of the tier minimum

  // ── Divergence / "unfairly priced" gate (doc 21 §21.4) ──
  divergence: {
    HARD_REFUSE_BPS: 1500, // refuse if issuer/listing > independent mark × (1 + 15%)
    // Below the hard line, a continuous haircut proportional to the overage:
    CONTINUOUS_HAIRCUT_SLOPE: 1.0, // haircutBps ≈ overageBps × slope (capped at HARD_REFUSE_BPS)
  },

  // ── LTV bands (doc 13.2 / 17) — operator-set 2026-08-04 ──
  // basis points; 50% top gated to L1 only (doc 13.2).
  ltvByTier: { L1: 5000, L2: 4000, L3: 2500 },
  // Which tiers each liquidity class is allowed to reach. 50% is L1-only.
  tierForLiquidity: { L1: 'L1', L2: 'L2', L3: 'L3' },

  // ── Accepted graders (doc 21 PS-5 / eligibility) ──
  ALLOWED_GRADERS: ['PSA', 'CGC', 'BGS', 'SGC'],

  // ── Defensive limits (DoS / input hardening) ──
  limits: {
    MAX_SALES_PER_SOURCE: 5_000, // cap records ingested per source
    MAX_TOTAL_SALES: 20_000, // cap across all sources
    MAX_STRING_LEN: 256, // cap any identity/venue/seller string
    MAX_PRICE_CENTS: 100_000_000_00, // $100M sanity ceiling on any single sale
  },
};

/**
 * Deep-freeze so policy can never be mutated at runtime.
 * @template T @param {T} obj @returns {T}
 */
function deepFreeze(obj) {
  if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    const rec = /** @type {Record<string, unknown>} */ (obj);
    for (const k of Object.keys(rec)) deepFreeze(rec[k]);
  }
  return obj;
}

export default deepFreeze(PARAMS);
