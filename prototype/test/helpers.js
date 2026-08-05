// @ts-check
/**
 * Deterministic test fixtures. Fixed NOW (no wall-clock) so every assertion is stable.
 */
import { makeMockSource, sale, daysAgo } from '../src/sources/mockSource.js';

export const NOW = 1_700_000_000_000; // fixed epoch ms

export const VALID_CARD = {
  grader: 'PSA',
  grade: '10',
  certNumber: '12345678',
  set: 'Base Set',
  cardNumber: '4',
  variant: '1st Edition',
  language: 'EN',
};

/**
 * A clean, L1-eligible blue-chip: 15 tight (~$10k) realized sales across 3 sources
 * (2 eBay-independent: PSA-APR multi + Fanatics; 1 eBay: PPT), many sellers, several
 * venues, most recent 2 days ago. Prices in $9,600–$10,400 → tight dispersion.
 * @param {number} [now]
 */
export function liquidBlueChipSources(now = NOW) {
  const psa = makeMockSource({
    id: 'psa_apr',
    corpus: 'multi',
    independentOfEbay: true,
    sales: [
      sale(10000, daysAgo(now, 2), 'Heritage', 'sA'),
      sale(9800, daysAgo(now, 25), 'Heritage', 'sB'),
      sale(10200, daysAgo(now, 60), 'MemoryLane', 'sC'),
      sale(9900, daysAgo(now, 120), 'Heritage', 'sD'),
      sale(10100, daysAgo(now, 200), 'MemoryLane', 'sE'),
      sale(10000, daysAgo(now, 300), 'Heritage', 'sF'),
    ],
  });
  const fanatics = makeMockSource({
    id: 'fanatics_pwcc',
    corpus: 'fanatics',
    independentOfEbay: true,
    sales: [
      sale(9950, daysAgo(now, 5), 'FanaticsCollect', 'fA'),
      sale(10150, daysAgo(now, 40), 'FanaticsCollect', 'fB'),
      sale(9700, daysAgo(now, 90), 'FanaticsCollect', 'fC'),
      sale(10300, daysAgo(now, 150), 'FanaticsCollect', 'fD'),
      sale(9850, daysAgo(now, 250), 'FanaticsCollect', 'fE'),
    ],
  });
  const ppt = makeMockSource({
    id: 'ppt',
    corpus: 'ebay',
    independentOfEbay: false,
    sales: [
      sale(10050, daysAgo(now, 8), 'eBay', 'eA'),
      sale(9750, daysAgo(now, 30), 'eBay', 'eB'),
      sale(10250, daysAgo(now, 70), 'eBay', 'eC'),
      sale(9900, daysAgo(now, 220), 'eBay', 'eD'),
    ],
  });
  return [psa, fanatics, ppt];
}

/** A source that throws, to prove fail-closed handling. */
export const throwingSource = {
  id: 'evil',
  corpus: 'ebay',
  independentOfEbay: false,
  realizedSales() {
    throw new Error('boom');
  },
};
