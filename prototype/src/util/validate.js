// @ts-check
/**
 * Strict input validation + sanitization. This is the security core: every card
 * identity and every sale record is treated as attacker-influenced. Malformed input
 * is REJECTED (identity) or DROPPED (individual sale records) — never trusted, never
 * coerced into a plausible-but-wrong value.
 *
 * Hardening choices:
 *  - Prototype-pollution safe: we only read a fixed set of OWN keys via Object.hasOwn,
 *    and never assign a user-supplied key onto any object.
 *  - Numbers must be finite; prices are non-negative integer CENTS with a sanity ceiling.
 *  - Strings are length-capped (DoS) and must be non-empty where required.
 *  - Fail-closed: a record that fails any check returns null and is dropped upstream.
 */
import PARAMS from '../params.js';

/** @param {unknown} x @returns {x is number} */
export function isFiniteNumber(x) {
  return typeof x === 'number' && Number.isFinite(x);
}

/** @param {unknown} x @returns {x is number} */
export function isNonNegInt(x) {
  return typeof x === 'number' && Number.isInteger(x) && x >= 0;
}

/** @param {unknown} x @returns {x is Record<string, unknown>} */
export function isPlainObject(x) {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

/**
 * Read an OWN string property, trim, enforce a max length. Returns null unless it is a
 * non-empty string within the cap. (Ignores inherited/prototype props by design.)
 * @param {Record<string, unknown>} obj
 * @param {string} key
 * @returns {string | null}
 */
export function cleanString(obj, key) {
  if (!Object.hasOwn(obj, key)) return null;
  const v = obj[key];
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (t.length === 0 || t.length > PARAMS.limits.MAX_STRING_LEN) return null;
  return t;
}

/**
 * Validate + normalize a card identity. Returns `{ ok: true, value }` with a frozen,
 * null-prototype identity, or `{ ok: false, error }`.
 * @param {unknown} raw
 * @returns {{ ok: true, value: import('../types.js').CardId } | { ok: false, error: string }}
 */
export function validateCardId(raw) {
  if (!isPlainObject(raw)) return { ok: false, error: 'card_id_not_object' };

  const graderRaw = cleanString(raw, 'grader');
  if (graderRaw === null) return { ok: false, error: 'grader_missing' };
  const grader = graderRaw.toUpperCase();
  if (!PARAMS.ALLOWED_GRADERS.includes(grader)) return { ok: false, error: 'grader_not_allowed' };

  // grade: accept a short string ("10", "9.5", "PSA 10"); normalize to a trimmed string.
  const grade = cleanString(raw, 'grade');
  if (grade === null) return { ok: false, error: 'grade_missing' };

  const certNumber = cleanString(raw, 'certNumber');
  if (certNumber === null) return { ok: false, error: 'cert_missing' };

  const set = cleanString(raw, 'set');
  if (set === null) return { ok: false, error: 'set_missing' };

  const cardNumber = cleanString(raw, 'cardNumber');
  if (cardNumber === null) return { ok: false, error: 'card_number_missing' };

  // Optional fields.
  const variant = cleanString(raw, 'variant') ?? '';
  const language = cleanString(raw, 'language') ?? 'EN';

  /** @type {import('../types.js').CardId} */
  const value = Object.freeze(
    Object.assign(Object.create(null), {
      grader,
      grade,
      certNumber,
      set,
      cardNumber,
      variant,
      language,
    }),
  );
  return { ok: true, value };
}

/**
 * Sanitize ONE raw sale record from a feed. Returns a clean SaleRecord or null (drop).
 * `corpus` + `independentOfEbay` come from the (trusted) source descriptor, not the feed.
 * @param {unknown} raw
 * @param {string} corpus
 * @param {boolean} independentOfEbay
 * @param {number} nowMs
 * @returns {import('../types.js').SaleRecord | null}
 */
export function sanitizeSaleRecord(raw, corpus, independentOfEbay, nowMs) {
  if (!isPlainObject(raw)) return null;

  // Price: non-negative integer cents, strictly positive, under the sanity ceiling.
  const priceCents = Object.hasOwn(raw, 'priceCents') ? raw.priceCents : undefined;
  if (!isNonNegInt(priceCents) || priceCents <= 0 || priceCents > PARAMS.limits.MAX_PRICE_CENTS) {
    return null;
  }

  // Sale date: integer epoch ms, not in the future, not absurdly old (>50y).
  const saleDateMs = Object.hasOwn(raw, 'saleDateMs') ? raw.saleDateMs : undefined;
  if (!isNonNegInt(saleDateMs)) return null;
  if (saleDateMs > nowMs) return null; // future-dated sale → drop (manipulation/typo guard)
  if (saleDateMs < nowMs - 50 * 365 * PARAMS.DAY_MS) return null;

  const venue = cleanString(raw, 'venue');
  if (venue === null) return null; // venue is required for the venue-diversity gate

  // Seller id optional; if present must be a clean string, else treated as unknown.
  const sellerId = cleanString(raw, 'sellerId');

  /** @type {import('../types.js').SaleRecord} */
  const rec = Object.freeze(
    Object.assign(Object.create(null), {
      priceCents,
      saleDateMs,
      venue,
      sellerId, // string | null
      corpus,
      independentOfEbay: independentOfEbay === true,
    }),
  );
  return rec;
}
