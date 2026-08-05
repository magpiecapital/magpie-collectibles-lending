// @ts-check
/**
 * Shared typedefs for the appraisal prototype. (JSDoc-only; no runtime code.)
 */

/**
 * Exact instrument identity (validated + normalized by util/validate.validateCardId).
 * @typedef {Object} CardId
 * @property {string} grader     One of PARAMS.ALLOWED_GRADERS (uppercased).
 * @property {string} grade      Normalized grade token, e.g. "10", "9.5".
 * @property {string} certNumber Grading-service certificate number.
 * @property {string} set
 * @property {string} cardNumber
 * @property {string} variant    "" if none.
 * @property {string} language   Defaults "EN".
 */

/**
 * A single REALIZED sale (sanitized). corpus + independentOfEbay come from the source
 * descriptor; the numeric/string fields are validated from the (untrusted) feed.
 * @typedef {Object} SaleRecord
 * @property {number} priceCents        Positive integer cents.
 * @property {number} saleDateMs        Epoch ms, ≤ now.
 * @property {string} venue             Marketplace/auction house the sale cleared on.
 * @property {string|null} sellerId     Seller identity if known, else null.
 * @property {string} corpus            Independence key (e.g. "ebay", "fanatics", "multi").
 * @property {boolean} independentOfEbay
 */

/**
 * An issuer's self-assigned value (Courtyard FMV, Collector Crypt insured value, …).
 * A CROSS-CHECK ONLY — never the value. May be null.
 * @typedef {Object} IssuerQuote
 * @property {string} platform
 * @property {number} fmvCents
 * @property {number} asOfMs
 */

/**
 * A pluggable realized-sales feed. The engine trusts the descriptor (id/corpus/
 * independence) but NOT the returned records (each is sanitized).
 * @typedef {Object} RealizedSalesSource
 * @property {string} id
 * @property {string} corpus
 * @property {boolean} independentOfEbay
 * @property {(cardId: CardId, windowDays: number, nowMs: number) => unknown[]} realizedSales
 */

/**
 * @typedef {Object} Haircuts
 * @property {number} stalenessBps
 * @property {number} thinBps
 * @property {number} divergenceBps
 */

/**
 * The appraisal result — fully explained + auditable.
 * @typedef {Object} Appraisal
 * @property {boolean} eligible
 * @property {readonly string[]} reasonCodes  Every gate outcome (pass + the blocking fail).
 * @property {('L1'|'L2'|'L3'|null)} liquidityTier
 * @property {number|null} appraisedValueCents
 * @property {number} maxLtvBps
 * @property {number|null} maxLoanCents
 * @property {(1|2|3|4|5|null)} confidence
 * @property {Haircuts} haircuts
 * @property {readonly SaleRecord[]} provenance  The exact comps used for the mark.
 * @property {number} asOfMs
 */

export {};
