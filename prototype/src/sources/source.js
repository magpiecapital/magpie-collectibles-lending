// @ts-check
/**
 * The untrusted-feed boundary. `fetchAllSales` is where external, attacker-influenced
 * data enters the engine, so it is defensive by construction:
 *  - a source that throws or misbehaves yields ZERO records (fail-closed, never crashes);
 *  - every returned record is sanitized (util/validate) and stamped with the source's
 *    (trusted) corpus + independence — the feed cannot forge its own independence;
 *  - per-source and total record counts are hard-capped (DoS).
 */
import PARAMS from '../params.js';
import { sanitizeSaleRecord, isPlainObject } from '../util/validate.js';

/**
 * Validate a source descriptor shape (defensive — descriptors are caller-provided).
 * @param {unknown} s @returns {s is import('../types.js').RealizedSalesSource}
 */
export function isValidSource(s) {
  return (
    isPlainObject(s) &&
    typeof s.id === 'string' &&
    s.id.length > 0 &&
    typeof s.corpus === 'string' &&
    s.corpus.length > 0 &&
    typeof s.independentOfEbay === 'boolean' &&
    typeof s.realizedSales === 'function'
  );
}

/**
 * Fetch + sanitize realized sales across all sources. Returns clean, capped records.
 * @param {import('../types.js').RealizedSalesSource[]} sources
 * @param {import('../types.js').CardId} cardId
 * @param {number} windowDays
 * @param {number} nowMs
 * @returns {import('../types.js').SaleRecord[]}
 */
export function fetchAllSales(sources, cardId, windowDays, nowMs) {
  /** @type {import('../types.js').SaleRecord[]} */
  const out = [];
  if (!Array.isArray(sources)) return out;

  for (const src of sources) {
    if (out.length >= PARAMS.limits.MAX_TOTAL_SALES) break;
    if (!isValidSource(src)) continue; // skip malformed descriptor, don't trust it

    /** @type {unknown[]} */
    let raw;
    try {
      raw = src.realizedSales(cardId, windowDays, nowMs);
    } catch {
      continue; // a throwing/malicious source contributes nothing — fail closed
    }
    if (!Array.isArray(raw)) continue;

    let takenFromSource = 0;
    for (const r of raw) {
      if (takenFromSource >= PARAMS.limits.MAX_SALES_PER_SOURCE) break;
      if (out.length >= PARAMS.limits.MAX_TOTAL_SALES) break;
      const rec = sanitizeSaleRecord(r, src.corpus, src.independentOfEbay, nowMs);
      if (rec !== null) {
        out.push(rec);
        takenFromSource++;
      }
    }
  }
  return out;
}

/**
 * Count distinct independence corpora among sales (used for the PS-4 corpus-independence
 * check — independence is keyed to CORPUS, not brand; doc 22.2 / I-7).
 * @param {import('../types.js').SaleRecord[]} sales
 * @returns {{ distinctCorpora: Set<string>, independentSales: import('../types.js').SaleRecord[] }}
 */
export function corpusStats(sales) {
  const distinctCorpora = new Set();
  const independentSales = [];
  for (const s of sales) {
    distinctCorpora.add(s.corpus);
    if (s.independentOfEbay) independentSales.push(s);
  }
  return { distinctCorpora, independentSales };
}
