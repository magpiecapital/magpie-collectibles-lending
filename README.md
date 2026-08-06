# Magpie Collectibles Lending — Strategy & Design

**Status: DESIGN ONLY — not built, not deployed. This repository is the complete
strategy, underwriting policy, valuation-oracle spec, liquidation design, and
threat model for lending against **tokenized, authenticated, vaulted physical
collectibles — graded Pokémon cards first, sourced across multiple vetted platforms
(Collector Crypt, Courtyard, Phygitals…)**. Nothing here touches mainnet until every
open question is closed and the threat model is signed off.**

Magpie's invariant is **"collateral that can still sell itself."** This document set
exists to prove — before a line of on-chain code — that a card-backed loan can be
priced honestly, liquidated reliably, and defended against every attack we can
enumerate, while staying attractive to collectors.

## What this is — and is NOT
**The collateral is the *physical* graded trading card** (Pokémon and similar) and its
**real secondary-market value derived from actual sales.** This is a **physical-collateral
lending product**, not an NFT product. Collector Crypt's token is used **only as the
on-chain custody + redemption handle** — a redeemable claim on the physical card held in a
vault — so a Solana program can hold the collateral. We **do not** value or liquidate based
on NFT-market/floor dynamics (Magic Eden bids, PFP-style speculation); those are irrelevant.
Value comes from the physical card market (eBay sold, PSA Auction Prices Realized,
auction-house results); the exit is the card's physical value (Collector Crypt's buyback and
physical resale). Wherever this doc says "pNFT," read it as *the custody token wrapping a
physical card*, nothing more.

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
| 9 | [Data spike results](docs/09-data-spike-results.md) | OQ-1…OQ-5 findings: drawdowns verified, incumbents exist, the fixed-term model, the independent-feed blocker |
| 10 | [**Fixed-term v1 spec**](docs/10-fixed-term-v1-spec.md) | **The recommended launch model** — oracle-less, no price-liquidation, fixed-term |
| 11 | [Competitive landscape](docs/11-competitive-landscape.md) | Jupiter Offerbook, Collector Crypt, Loopscale, TradFi — and where Magpie wins |
| 12 | [Data sourcing](docs/12-data-sourcing.md) | Closing F-1/OQ-4: **PSA APR as the eBay-independent anchor** |
| 13 | [Economic model & stress test](docs/13-economic-model.md) | Recovery math, drawdown-justified LTV bands, reserve sizing, break-even |
| 14 | [Legal & regulatory](docs/14-legal-regulatory.md) | Flags for counsel: securities (the SEC curator-vault risk), pawn/usury, MSB, UCC lien perfection, AML/IP |
| 15 | [Collector UX & go-to-market](docs/15-collector-ux-gtm.md) | The borrow flow, trust design, channels — and why the same hype that sells loans inflates collateral |
| 16 | [Build & pilot plan](docs/16-build-plan.md) | Gated Phase 0→pilot execution sequence and graduation criteria |
| 17 | [Parameters reference](docs/17-parameters-reference.md) | Single source of truth for every tunable + the invariant index |
| 18 | [**Structure decision memo**](docs/18-structure-decision-memo.md) | **P2P/offerbook vs curated pool** — the securities-gated Phase-0 call (recommend P2P) |
| 19 | [OQ-3 / OQ-4 closeout](docs/19-oq-closeout.md) | Research verdicts: buyback is NOT a liquidation rail (🔴); data-independence is licensable (🟡) |
| 20 | [Tokenization platforms](docs/20-tokenization-platforms-collateral-sources.md) | Collateral-source diversification — Courtyard, Phygitals, BAXUS…; each a capped lane |
| 21 | [**Liquidity & proof-of-sale gate**](docs/21-liquidity-eligibility-proof-of-sale.md) | **The collateral-admission gate** — proven-liquid only, never unfairly-priced |
| 22 | [Realized-sales venue & comp map](docs/22-realized-sales-venue-comp-data-map.md) | Where it actually sells + how to pull SOLD comps; independence is by *corpus* |
| 23 | [Outreach briefs — PSA & Fanatics](docs/23-outreach-briefs-psa-fanatics.md) | Ready-to-send data-license/partnership packages |
| 24 | [**Oracle prototype spec**](docs/24-oracle-prototype-spec.md) | **The read-only, back-testable appraisal engine** (Phase-2) |
| 25 | [Outreach briefs — whisky (BAXUS)](docs/25-outreach-briefs-whisky-baxus.md) | BAXUS + Whiskystats + Rare Whisky 101 packages for the whisky class |
| 26 | [**Launch allowlist**](docs/26-launch-allowlist.md) | **The approved-collateral list** — vetting standard, the Tier-A pilot set, exclusions, caps |
| 27 | [**Sold-comp verification runbook**](docs/27-sold-comp-verification-runbook.md) | **The per-item due-diligence** — prove what EXACTLY sells across every marketplace before any loan |

The `prototype/` directory holds the **runnable, red-teamed** reference implementation of doc 24 (`cd prototype && npm test`).

## First principles (non-negotiable)

1. **Value only off realized sales.** Listings are aspirational and manipulable. Never lend against an asking price.
2. **The oracle is the #1 attack surface.** A mispriced card is a direct drain. Treat oracle manipulation as the primary threat, always.
3. **Permissionless ≠ liberal.** The *data-quality gate* decides eligibility, not a human whitelist. Cards without enough real comps are simply not borrowable (fail-closed).
4. **Size for the bear, not the boom.** LTV, caps, and reserves assume a downturn with no bidders. BendDAO died assuming otherwise.
5. **Never hard-peg liquidation to "make the protocol whole."** Allow graduated markdown to a real clearing price, or you sell nothing and take a total loss.
6. **No issuer buyback is a reliable liquidation rail (OQ-3).** Collector Crypt's is Gacha-only/72h/off-chain; recovery runs on marketplace + physical resale sized for *zero* buyback. Collateral is sourced across multiple **capped platform lanes** — no single custodian is a systemic dependency.

## Provenance

Backed by an adversarially-verified research pass (24 verified claims, primary
sources cited inline in each doc). Key sources: Card Ladder valuation
methodology, PSA slab-security guidance, the eBay/PWCC shill-bidding action, the
BendDAO NFT-lending collapse, and Collector Crypt's buyback/vault mechanics. See
each doc's "Sources" section.
