// @ts-check
/**
 * Safe numeric helpers on arrays of finite numbers (integer cents). Callers must pass
 * already-validated finite numbers (see util/validate.js). Every function is pure and
 * total: it never throws on empty input, and never returns NaN/Infinity.
 */

/** @param {number[]} xs @returns {number[]} ascending copy */
function sortedAsc(xs) {
  return xs.slice().sort((a, b) => a - b);
}

/** Median of finite numbers. Empty → 0. @param {number[]} xs @returns {number} */
export function median(xs) {
  if (xs.length === 0) return 0;
  const s = sortedAsc(xs);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Weighted median. `items` = [{ value, weight }] with weight ≥ 0. Empty or all-zero
 * weight → falls back to the unweighted median of the values (never NaN).
 * @param {{ value: number, weight: number }[]} items
 * @returns {number}
 */
export function weightedMedian(items) {
  if (items.length === 0) return 0;
  const total = items.reduce((s, it) => s + (it.weight > 0 ? it.weight : 0), 0);
  if (!(total > 0)) return median(items.map((it) => it.value));
  const s = items.slice().sort((a, b) => a.value - b.value);
  let acc = 0;
  const half = total / 2;
  for (const it of s) {
    acc += it.weight > 0 ? it.weight : 0;
    if (acc >= half) return it.value;
  }
  return s[s.length - 1].value;
}

/** Median absolute deviation from a given center. @param {number[]} xs @param {number} center @returns {number} */
export function mad(xs, center) {
  if (xs.length === 0) return 0;
  return median(xs.map((x) => Math.abs(x - center)));
}

/**
 * Interquartile range (Q3 − Q1), simple nearest-rank. Empty/singleton → 0.
 * @param {number[]} xs @returns {number}
 */
export function iqr(xs) {
  if (xs.length < 2) return 0;
  const s = sortedAsc(xs);
  /** @param {number} p */
  const q = (p) => s[Math.min(s.length - 1, Math.max(0, Math.floor(p * (s.length - 1))))];
  return q(0.75) - q(0.25);
}

/**
 * Drop the top and bottom `frac` of values by magnitude. Never empties the array:
 * if trimming would remove everything, returns the single median-most value set.
 * @param {number[]} xs @param {number} frac 0..0.49
 * @returns {number[]}
 */
export function trimByFraction(xs, frac) {
  if (xs.length <= 2 || frac <= 0) return xs.slice();
  const s = sortedAsc(xs);
  const k = Math.floor(s.length * frac);
  const out = s.slice(k, s.length - k);
  return out.length > 0 ? out : [s[s.length >> 1]];
}

/** Clamp to an integer within [lo, hi]. @param {number} x @param {number} lo @param {number} hi @returns {number} */
export function clampInt(x, lo, hi) {
  const v = Math.round(x);
  return v < lo ? lo : v > hi ? hi : v;
}
