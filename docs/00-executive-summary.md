# 0 · Executive Summary

## The opportunity
Lend stablecoins/SOL against **tokenized graded Pokémon cards** (Collector Crypt
NFTs, ~18k+ cards tokenized on Solana). Collectors unlock liquidity without
selling and keep the upside; Magpie earns interest on over-collateralized loans
with a built-in liquidation venue (Collector Crypt's on-chain buyback).

## Why it can work (the enabler)
Collector Crypt already publishes a **standing on-chain buyback at ~85–90%** of an
eBay/ALT-derived value, and runs a cheap native marketplace (2% seller fee). That
gives us a fast liquidation rail — the missing piece for illiquid collateral.

## Why it's dangerous (and how we survive it)
1. **Thin, manipulable markets.** Single sales can be shill-inflated. → Value off
   *many* real sales, reject outliers, require a minimum comp count.
2. **Cards crash 40–70%.** → Conservative tiered LTV + short duration + daily
   mark-to-market + early liquidation trigger; survive on duration, not LTV alone.
3. **Illiquid in a downturn (the BendDAO failure).** → Graduated liquidation to a
   real clearing price, hard concentration caps, a reserve fund, small pilot size.
4. **Fake/tampered slabs.** → Cert-level verification + vault attestation, PSA/CGC only.
5. **Counterparty reliance on Collector Crypt's buyback.** → Treat it as a soft
   floor we monitor and can survive losing; never as the valuation oracle.

## The policy in one screen
- **Appraised Value (AV) = min( our haircut real-comp mark , the CC buyback quote )**,
  accepted only if the two agree within ~25–30%.
- **LTV on AV:** Tier A (blue-chip, dense fresh comps) ≤50% · Tier B (liquid) ≤40% ·
  Tier C (thin/volatile) ≤25% or exclude · else **ineligible**.
- **Eligibility gate:** ≥2 real sales in 12mo AND ≥1 in 6mo · PSA/CGC graded ·
  cert verified · live buyback · above a $ floor · not tamper-flagged.
- **Loans are short (30–90d), marked daily; a ~70% live-LTV breach triggers early liquidation.**
- **Liquidation waterfall:** CC buyback → (circuit-breaker if paused/cut) → marketplace
  graduated Dutch markdown → surplus to borrower, shortfall to reserve fund. **Never a make-whole floor peg.**
- **Caps:** per-card ~2–5% of book · per-character cap · small total lane cap sized to
  bear-market absorption · reserve buffer · withdrawal controls on the lender pool.

## Status & gate to build
Design-only. Four gaps must close first (see [doc 7](07-open-questions.md)): per-tier
liquidity/drawdown quantification for the specific tokenized cards, exact CC *vault*
buyback terms + divergence history, and confirmed comp-data API access. The
[threat model](05-threat-model.md) must be signed off with no open High findings.
