// @ts-check
/**
 * Back-test harness demo (doc 24 §24.5). Historical replay: appraise a card as of a past
 * date `t` using only sales that cleared before `t`, then check whether the loan we would
 * have written recovers against (a) the next actual sale after `t` and (b) a simulated
 * graduated-resale liquidation at βᵣ. Deterministic; run with `npm run backtest`.
 */
import { appraise } from '../src/pipeline/appraise.js';
import { makeMockSource, sale, daysAgo } from '../src/sources/mockSource.js';

const T = 1_700_000_000_000; // "as of" date
const BETA_R = 0.75; // net resale recovery (doc 13)

const card = {
  grader: 'PSA', grade: '10', certNumber: '111', set: 'Base Set', cardNumber: '4', variant: '1st Edition',
};

// Sales BEFORE T (used for the appraisal) — a liquid ~$10k blue-chip.
const priorSales = [
  sale(10000, daysAgo(T, 3), 'Heritage', 'a'), sale(9900, daysAgo(T, 12), 'FanaticsCollect', 'b'),
  sale(10100, daysAgo(T, 24), 'eBay', 'c'), sale(9800, daysAgo(T, 40), 'Heritage', 'd'),
  sale(10200, daysAgo(T, 60), 'FanaticsCollect', 'e'), sale(10050, daysAgo(T, 85), 'MemoryLane', 'f'),
  sale(9950, daysAgo(T, 110), 'eBay', 'g'), sale(10150, daysAgo(T, 140), 'Heritage', 'h'),
  sale(9850, daysAgo(T, 170), 'FanaticsCollect', 'i'), sale(10000, daysAgo(T, 200), 'Heritage', 'j'),
  sale(10100, daysAgo(T, 250), 'MemoryLane', 'k'), sale(9900, daysAgo(T, 300), 'eBay', 'l'),
];

const sources = [
  makeMockSource({ id: 'psa_apr', corpus: 'multi', independentOfEbay: true, sales: priorSales.filter((s) => s.venue !== 'eBay') }),
  makeMockSource({ id: 'ppt', corpus: 'ebay', independentOfEbay: false, sales: priorSales.filter((s) => s.venue === 'eBay') }),
];

const a = appraise(card, null, sources, T);

console.log('── Back-test replay (as of T) ──');
console.log('eligible        :', a.eligible);
console.log('tier            :', a.liquidityTier);
console.log('appraised value : $' + ((a.appraisedValueCents ?? 0) / 100).toFixed(2));
console.log('max loan (LTV)  : $' + ((a.maxLoanCents ?? 0) / 100).toFixed(2), `(${a.maxLtvBps / 100}%)`);

if (a.eligible && a.maxLoanCents) {
  // The card's ACTUAL next sale after T, and a stressed −40% drawdown scenario.
  const nextSaleCents = 1_005_000; // $10,050 — actual subsequent realized sale
  const stressedValueCents = Math.round(nextSaleCents * 0.6); // −40% drawdown within the term
  for (const [label, valueCents] of [['next actual sale', nextSaleCents], ['−40% stressed', stressedValueCents]]) {
    const recovery = Math.round(BETA_R * valueCents);
    const covered = recovery >= a.maxLoanCents;
    console.log(
      `recovery @ ${label} : resale $${(recovery / 100).toFixed(2)} vs loan $${(a.maxLoanCents / 100).toFixed(2)} → ${covered ? 'COVERED' : 'SHORT (reserve)'}`,
    );
  }
}
console.log('reason codes    :', a.reasonCodes.join(', '));
