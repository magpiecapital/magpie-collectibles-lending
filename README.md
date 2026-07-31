# Magpie Collectibles Lending — Strategy & Design

**Status: DESIGN ONLY — not built, not deployed. This repository is the complete
strategy, underwriting policy, valuation-oracle spec, liquidation design, and
threat model for lending against tokenized graded Pokémon cards (e.g. Collector
Crypt NFTs). Nothing here touches mainnet until every open question is closed and
the threat model is signed off.**

Magpie's invariant is **"collateral that can still sell itself."** This document set
exists to prove — before a line of on-chain code — that a card-backed loan can be
priced honestly, liquidated reliably, and defended against every attack we can
enumerate, while staying attractive to collectors.

## Read in this order

| # | Doc | What it answers |
|---|-----|-----------------|
| 0 | [Executive summary](docs/00-executive-summary.md) | The whole thing in one page |
| 1 | [Market analysis](docs/01-market-analysis.md) | How the graded-card market really works, and why it's dangerous |
| 2 | [Valuation oracle](docs/02-valuation-oracle.md) | How we value a card off **real sales, never listings** |
| 3 | [Underwriting & LTV](docs/03-underwriting-ltv.md) | Tiers, LTV bands, haircuts, mark-to-market |
| 4 | [Liquidation & risk](docs/04-liquidation-risk.md) | The waterfall, circuit-breakers, caps, reserve fund |
| 5 | [Threat model & security](docs/05-threat-model.md) | Every attack surface and its defense (the "no exploits" doc) |
| 6 | [Architecture](docs/06-architecture.md) | Components, invariants, custody, when it IS built |
| 7 | [Open questions & spikes](docs/07-open-questions.md) | Honest gaps that must close before mainnet |
| 8 | [Adversarial review](docs/08-adversarial-review.md) | Red-team findings (F-1…F-11) and how each is resolved |

## First principles (non-negotiable)

1. **Value only off realized sales.** Listings are aspirational and manipulable. Never lend against an asking price.
2. **The oracle is the #1 attack surface.** A mispriced card is a direct drain. Treat oracle manipulation as the primary threat, always.
3. **Permissionless ≠ liberal.** The *data-quality gate* decides eligibility, not a human whitelist. Cards without enough real comps are simply not borrowable (fail-closed).
4. **Size for the bear, not the boom.** LTV, caps, and reserves assume a downturn with no bidders. BendDAO died assuming otherwise.
5. **Never hard-peg liquidation to "make the protocol whole."** Allow graduated markdown to a real clearing price, or you sell nothing and take a total loss.
6. **The Collector Crypt buyback is a *soft floor*, not our oracle.** It's a useful, cheap exit we do not control; we cross-check it, monitor it, and can survive it disappearing.

## Provenance

Backed by an adversarially-verified research pass (24 verified claims, primary
sources cited inline in each doc). Key sources: Card Ladder valuation
methodology, PSA slab-security guidance, the eBay/PWCC shill-bidding action, the
BendDAO NFT-lending collapse, and Collector Crypt's buyback/vault mechanics. See
each doc's "Sources" section.
