// @ts-check
/**
 * Public surface of the appraisal-oracle prototype.
 * Everything is read-only + pure; nothing here touches a chain, funds, or the network.
 */
export { appraise } from './pipeline/appraise.js';
export { makeMockSource, sale, daysAgo } from './sources/mockSource.js';
export { default as PARAMS } from './params.js';
export { validateCardId } from './util/validate.js';
