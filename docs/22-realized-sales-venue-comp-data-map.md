# 22 · Realized-Sales Venue & Comp-Data Map — where it actually sells, and how to pull SOLD prices

> Operator mandate (2026-08-04): *"find where they are actually selling like eBay to get fair price
> comps."* This is the concrete data-pipeline for the [doc 21](21-liquidity-eligibility-proof-of-sale.md)
> proof-of-sale gate and the [doc 2](02-valuation-oracle.md) oracle: the venues where transactions
> **actually clear**, which expose **SOLD** prices (not asks), and how we'd wire each in. Extends
> [doc 12](12-data-sourcing.md) + [doc 19.1](19-oq-closeout.md). `[V]` = verified from provider docs;
> `[U]` = uncertain / needs the outreach call. Design-only; nothing deployed.

## 22.1 The one finding that shapes every build decision
**No single source, in any class, gives all four of:** {realized SOLD + keyed to exact instrument
identity + official API + clean commercial-redistribution rights}. The trade-off has the same shape
everywhere:
- The sources with the **best identity + easiest API** are **derived from one dominant venue** (eBay for
  cards; the UK-auctioneer corpus for whisky; Chrono24/dealer listings for watches) → they **fail
  cross-source independence**, and several are **ask-contaminated**, not pure sold.
- The **genuinely independent, pure-realized** sources (Heritage & Fanatics/PWCC for cards; individual
  auction houses for whisky/watches) have **no official API** and **ToS that forbid scraping/redistribution**.

**So a defensible anti-drain oracle needs, per class: one LICENSED feed + one independently-sourced
realized feed whose access we've cleared legally.** Three "independent" indices sitting on one underlying
corpus count as **one source** — this is the F-1 shared-source failure mode, and it recurs in all three classes.

## 22.2 Independence is about the CORPUS, not the brand (correction to I-7)
Corporate-ownership + shared-corpus reality that collapses apparent independence `[V]`:
- **eBay owns eBay Marketplace + TCGplayer (acq. 2022) + Goldin (acq. 2024).** → these are **ONE** source.
- **PSA APR + Card Ladder share one parent (Collectors Universe).** → **ONE** source, not two.
- **WhiskyHunter, Whiskystats, Rare Whisky 101** all sit on the **same UK auction corpus** → correlated.
- **WatchCharts ingests Chrono24 dealer listings** → WatchCharts + Chrono24 are **not** independent.

**→ Amends invariant I-7 ([doc 8](08-adversarial-review.md)):** the cross-source independence check must key
to the **underlying transaction corpus / ultimate parent**, NOT the brand name. The only truly
eBay-independent card venues are **Heritage** and **Fanatics Collect (PWCC)**. *(This refines
[doc 19.1](19-oq-closeout.md), which listed PSA-APR and Card Ladder as if separable — they are not.)*

## 22.3 CLASS 1 — Graded Pokémon / trading cards (primary)

**Sale venues** (where cards actually clear):

| Venue | SOLD + dates | Cert/grade keyed | API | Redistribution | eBay-independent |
|---|---|---|---|---|---|
| eBay Marketplace Insights | Yes (90d) | No (free-text title) | **Approval-gated, "not open to new users"** | Only w/ eBay written consent | Is eBay |
| TCGplayer | ~100 txns/product | **Raw/ungraded only** | Closed to new devs `[U]` | Partner-only | No (eBay-owned) |
| Goldin | Yes (own auctions) | Yes (grade+cert) | None public | scrape=ToS risk | No (eBay-owned) |
| **Heritage Auctions** | **Yes — free public archive, 4M+ lots** | Yes | Portal, partner-gated `[U]` | archive public | **Yes** |
| **Fanatics Collect (PWCC)** | **Yes — public sales-history** | **Yes — grade+cert+sub-grades (richest)** | None public | scrape=ToS risk | **Yes** |

**Aggregators of sold comps:**

| Aggregator | SOLD | API | Independent | Cert/grade | Redistribution |
|---|---|---|---|---|---|
| **PSA APR** | Yes (eBay+Heritage+Goldin+Memory Lane, 5M+) | **None** (public API = cert-verify only) | **Multi-venue** | PSA-grade keyed | scrape ToS `[U]` |
| **Card Ladder** | Yes (100M+) | Enterprise/gated | Multi-venue *(same parent as PSA APR)* | exact grader+grade+set+variant | **forbids scraping** |
| **130point** | Yes (+ hidden best-offer-accepted) | None | **eBay-only** | free-text | — |
| **PriceCharting** | value-per-grade, **not dated comps** | **Yes, paid** (~$6/mo) | **eBay-only** | grade-tier, no cert | **ToS forbids any public-facing use** |
| **PokemonPriceTracker** | Yes (incl. eBay sold) | **Yes, REST** | **eBay-derived** | exact grade | **commercial OK on paid** |

**→ BUILD (cards):**
- **Primary independent anchor: PSA APR** via an **enterprise data license from PSA/Collectors** —
  multi-venue (incl. the independent Heritage/Goldin slices), cert-and-grade native, the de-facto graded
  standard. No public API → **outreach/commercial conversation.**
- **Corroborating realized #1 (independent): Fanatics Collect (PWCC) sales-history** — richest cert-level
  sold data + a genuinely independent venue. No API → **data partnership with Fanatics** (or a cleared
  scrape). Satisfies "≥1 non-eBay realized source keyed to cert."
- **Corroborating realized #2 (cheap, self-serve NOW): PokemonPriceTracker API** (~$99/mo, commercial
  OK, exact-grade) — **treat as eBay-derived → divergence cross-check, never sets value alone.**
- **Reference-only: 130point** (surfaces best-offer-accepted prices eBay hides) for manual dispute review.
- **Do NOT** count PSA APR + Card Ladder as two sources (same parent), nor eBay+Goldin+TCGplayer as three.

## 22.4 CLASS 2 — Fine whisky / spirits
Independent price-formation venues (real hammer + dates, mostly scrape-only, UK-centric): **Whisky
Auctioneer, Scotch Whisky Auctions, Just Whisky, Whisky Hammer, Unicorn Auctions (US), Whisky.Auction**;
**BAXUS** = the independent US/on-chain venue. Aggregators: **WhiskyHunter** (free public JSON API,
"only lots actually sold", aggregate-level), **Whiskystats** (paid "Whisky Data API", bottle-ID-keyed
hammer results `[V]`), **Rare Whisky 101** (hammer valuations since 2008, B2B feeds for banks/insurers).
Wine-Searcher = asks only (retail sanity check, not realized).

**→ BUILD (whisky):**
- **Primary realized backbone: Whiskystats "Whisky Data API"** — aggregated hammer results + exact
  bottle-ID keying, real documented API. Access = **paid + licensing conversation** (outreach).
- **Independent corroboration: Rare Whisky 101** hammer valuations (B2B agreement) + **WhiskyHunter free
  API** + **direct ingest of ≥2 auction houses' own hammer** (Whisky Auctioneer + Scotch Whisky Auctions).
- **Genuinely separate corpus: BAXUS on-chain sales** indexed directly from Solana (Helius) — verifiable,
  US-centric, native to our stack, diversifies away from the UK corpus.
- **Anti-drain caveat `[V]`:** WhiskyHunter/Whiskystats/RW101 all draw from the **same UK auction corpus**
  → correlated, NOT three confirmations. True independence = ≥2 separate venues' own hammer + BAXUS on-chain.

## 22.5 CLASS 3 — Luxury watches
- **Chrono24 ChronoPulse** — **transaction-based** (own escrow completed sales) but delivered as an
  **index (14 brands/140 models)**; per-sale records not exposed → trend signal only, not per-instrument.
- **WatchCharts API** — best granularity {brand, ref#, condition} + real API, **BUT market value is partly
  ask-derived** (uses txn price if known, else last asking price) and its dealer pool **overlaps Chrono24**;
  license **forbids redistribution/derived-results/index-building** without a resale deal.
- **Auction houses** (Sotheby's/Christie's/Phillips/Bonhams) — pure realized, but **no API**, sparse/rare-
  skewed, ToS personal-use-only (auction-scraping treated as breach — Collectrium v. Heritage).
- **Bob's Watches** — pure realized, Rolex-only, single-dealer, display-only.

**→ BUILD (watches):** **WatchCharts API** (negotiated resale license) as the per-reference feed, **haircut
for ask-contamination**; **auction prices realized** (via Invaluable/LiveAuctioneers data agreement) as the
independent pure-SOLD anchor; **ChronoPulse** as a free transaction-grounded trend check; **Bob's** for Rolex.
Watches are a **later target** ([doc 20](20-tokenization-platforms-collateral-sources.md)) — no clean on-chain
token source yet — so this is design guidance, not a launch integration.

## 22.6 Cross-class build summary

| Class | Primary independent anchor | Corroborating feed(s) | Needs outreach/$$ |
|---|---|---|---|
| **Cards** | **PSA APR** (multi-venue, cert-native) | Fanatics/PWCC (independent) + PokemonPriceTracker (eBay-derived cross-check) | PSA/Collectors license; Fanatics partnership |
| **Whisky** | **Whiskystats API** (bottle-ID hammer) | RW101 (B2B) + WhiskyHunter (free) + ≥2 auction houses direct + BAXUS on-chain | Whiskystats + RW101 licenses |
| **Watches** | **WatchCharts** (per-ref, ask-haircut) | Auction realized (Invaluable/direct) + ChronoPulse trend + Bob's (Rolex) | WatchCharts resale license; auction data agreement |

## 22.7 Universal design rules (fell out of the research)
1. **Never treat co-owned / shared-corpus sources as independent** — key the [I-7](08-adversarial-review.md)
   independence check to the **underlying transaction corpus / parent**, not the brand (§22.2).
2. **Prefer venue-native realized data over indices** for ≥1 leg per class (Fanatics; direct auction houses;
   BAXUS on-chain) — so we're anchored to raw clearing prices, not a re-processed index.
3. **Redistribution ToS is the real gate, not availability.** PriceCharting, WatchCharts, Card Ladder, and
   the auction houses all **forbid** the public-facing/redistributed use a lending front-end implies. Every
   production path needs a **written license OR a data leg we own** (BAXUS on-chain, or a licensed feed).

## 22.8 Outreach list (Phase-1, before any lane goes live)
- **Cards:** PSA / Collectors Universe data license (APR); Fanatics Collect data partnership. *(PokemonPriceTracker = self-serve now.)*
- **Whisky:** Whiskystats API license; Rare Whisky 101 B2B feed; WhiskyHunter commercial-use confirmation; BAXUS API terms.
- **Watches:** WatchCharts resale/redistribution license; auction-results data agreement (Invaluable/LiveAuctioneers).
Feeds [Gate 1](16-build-plan.md) (OQ-4) and the [doc 2](02-valuation-oracle.md) oracle prototype.

## Sources
Per-provider docs/ToS (eBay Marketplace Insights, TCGplayer, PSA APR, Card Ladder, PriceCharting,
PokemonPriceTracker, Heritage, Fanatics Collect, 130point; Whiskystats, WhiskyHunter, Rare Whisky 101,
Whisky Auctioneer/SWA, Wine-Searcher, BAXUS; Chrono24/ChronoPulse, WatchCharts, auction houses, Bob's
Watches). License pricing + redistribution terms for PSA APR / Fanatics / Whiskystats / RW101 / WatchCharts
are the `[U]` outreach items.
