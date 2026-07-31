# 9 · Data Spike Results (OQ-1 … OQ-5)

Hands-on spike to close the open questions from [doc 7](07-open-questions.md).
Sources are cited inline. **Three findings materially change the strategy** — see §Strategic
implications. Status legend: ✅ closed · 🟡 partially closed · 🔴 blocker to resolve.

> **Framing (per [README](../README.md)):** the collateral is the **physical trading card** and its
> real market value; the Collector Crypt token is only the on-chain custody/redemption handle. All
> valuation and liquidation below is about the **physical card market** — NFT-market/floor dynamics
> are explicitly *not* our value or liquidity source.

---

## OQ-5 · Physical lien / lending feasibility — ✅ **closed, and it changes everything**
**Finding:** Collector Crypt **already supports lending against vaulted cards.** Holders
borrow stablecoins against a tokenized slab at **~7–8% interest**, keep ownership, and get
full rights back on repayment. It's live via **two integrations:**
- **Loopscale** — "Collectibles-Fi" collateralized loans against CC tokenized cards.
- **Jupiter (Gacha) Offerbook** (partnered June 2026) — borrow USDC against a tokenized
  slab, **fixed-term loans with NO price-based liquidations in the initial phase.**

**Implications:**
1. **The redemption-lock / physical-lien problem (F-5, OQ-5) is solved in practice** — a
   collateralized card demonstrably cannot be redeemed while it backs a loan on these
   protocols. Our invariant I-2 is achievable; verify the exact mechanism during build.
2. **Magpie would NOT be the first mover.** Loopscale and Jupiter Offerbook are incumbents.
   Positioning matters — see below.
3. **The incumbent model avoids the hardest problem we designed against.** Fixed-term /
   no-price-liquidation loans sidestep the live oracle-manipulation → liquidation attack
   surface entirely for the loan term (see Strategic implications).

Sources: [Solana Compass — CC on-chain capital markets](https://solanacompass.com/learn/Lightspeed/collector-crypt-onchain-capital-markets-on-solana-tuomas-holmberg), [origineight — tokenized Pokémon cards as loan collateral](https://origineight.six.network/tokenized-pokemon-cards-as-loan-collateral-en/), [Yahoo Finance — lending them is a different story](https://finance.yahoo.com/news/tokenized-pok-mon-cards-hot-142959364.html)

---

## OQ-2 · Per-tier drawdowns — ✅ **closed (verified; the earlier 40–70% is real)**
Concrete peak-to-trough through the 2021 peak → 2022–23 correction:

| Card | Peak | Trough | Drawdown |
|------|------|--------|----------|
| 1st-Ed Base Charizard **PSA 10** | ~$400k (Mar 2021), $420k cited | ~$200k–250k | **~40–52%** |
| Unlimited Base Charizard **PSA 10** | $150k+ | $50k–70k | **~53–67%** |
| Various vintage variants | — | — | **60–70%** |

Even the **single most liquid, most resilient blue-chip** (1st-Ed Charizard — first to
recover) still fell **~40–50%.** Causes: rate hikes, post-pandemic normalization, media fade.
**This validates the conservative posture: Tier-A ≤50% LTV is right — a blue-chip can halve —
and thinner tiers must be far lower.** No tier is safe from a ~40%+ drawdown.

Sources: [PokemonPriceTracker — Charizard price history](https://www.pokemonpricetracker.com/blog/posts/charizard-price-history-1999-2026-complete-analysis), [cardsnpacks — Charizard by grade](https://www.cardsnpacks.com/en/blog/evolution-prix-dracaufeu/)

---

## OQ-4 · Comp-data APIs & the independence problem — 🔴 **the real blocker**
| Source | Access | Independent of eBay? | Verdict |
|--------|--------|:--------------------:|---------|
| **eBay Marketplace Insights** | Limited Release, **Business approval required, "not open to new users"**, 90-day sold window | (it **is** eBay) | Hard to get; needs an eBay partnership |
| **PokemonPriceTracker API** | Free 100/day; **$99/mo Business for commercial**; PSA 8/9/10 prices + population (pop = Business+) | ❌ **graded prices sourced from eBay completed listings** | Usable + cheap, but eBay-derived |
| **PriceCharting API** | Official API (paid) | ❌ **sold data from eBay** (+ its own game marketplace) | Usable, but eBay-derived |
| **PWCC / Goldin realized** | **No official API** (scrapers only); Goldin is eBay-owned | Goldin ❌ (eBay-owned); PWCC ~ | Fragile / TOS risk |
| **PSA "Auction Prices Realized"** | **No official API** (scrape, e.g. Apify) | ✅ **aggregates multiple houses** (Goldin, Heritage, PWCC…) | Best independent candidate, but scraping |

**Critical (confirms adversarial finding F-1):** nearly every *readily-accessible* feed is
**eBay-derived**, and Collector Crypt's buyback reference is **also** eBay/ALT-derived. So the
"cross-check comps vs buyback" independence (invariant **I-7**) is **genuinely hard to source** —
the only real independent realized-sales signal (PSA APR, multi-house auction data) has **no
clean API** and would require scraping or a data-licensing deal. **This is a real cost/blocker,
not a checkbox** — and it's a strong argument for the fixed-term model (which needs far less of a
manipulation-resistant *live* oracle).

Sources: [eBay Developers — Marketplace Insights](https://developer.ebay.com/api-docs/buy/marketplace-insights/resources/item_sales/methods/search), [PokemonPriceTracker — PSA API](https://www.pokemonpricetracker.com/psa-pokemon-card-api), [PriceCharting methodology](https://www.pricecharting.com/page/methodology)

---

## OQ-3 · Collector Crypt buyback / vault terms — 🟡 **mostly closed**
- **Buyback:** standing on-chain quote, **~85–90%** of an eBay/ALT-indexed value (85% Elite /
  90% Legendary; some sources cite up to 93%). Applies to revealed/vaulted NFTs.
- **Fees:** ~**4% platform fee**; native marketplace **2% seller** (1% platform + 1% royalty) —
  far below eBay's ~13.25%.
- **Redemption:** burn the pNFT → card shipped from the **Delaware vault**; **2% vault-withdrawal
  fee + shipping + insurance.**
- **Still open:** the exact per-card buyback rate for the *general graded vault* (vs Gacha
  tiers), whether it's readable per-card on-chain for our contract, and the historical divergence
  between CC's frozen reference and realized market (needs CC's API/docs directly).

Sources: [CoinGecko — CC](https://www.coingecko.com/learn/what-is-collector-crypt-cards), [Datawallet](https://www.datawallet.com/crypto/what-is-collector-crypt-cards)

---

## OQ-1 · Liquidity — 🟡 **the right question is *physical-card* liquidity, not NFT-market**
**Framing correction:** we lend against the **physical card's value**, so the liquidity that
matters is **how readily the physical card sells** (the eBay/auction-house physical market) plus
**Collector Crypt's buyback** (which pays out the physical card's indexed value). The token's
NFT-market floor is **not** our liquidity source and we do not rely on it.
- **Physical-card liquidity is tiered** (from [doc 1](01-market-analysis.md)): blue-chip vintage
  (Charizard etc.) is the most liquid and "first to recover," while modern/long-tail can take
  weeks. Even blue-chips sell occasionally, not continuously → size for days-to-weeks to exit.
- **Cross-check on the token layer (don't rely on it):** a live pull of the Magic Eden
  `collector_crypt` collection showed **only 2 actual sales in the last 100 activities** (rest =
  AMM pool churn + listings), floor ~$16. This just **confirms** we must **not** treat NFT-market
  bids as a liquidation venue — the real exit is **buyback → physical resale**, exactly the
  physical framing above. CC's $1B+ headline volume is mostly **Gacha pack-opening**, not per-card
  resale.
- **Design impact:** liquidation is **buyback-primary** (pays physical value), with **physical
  auction/consignment** as the true fallback — *not* an NFT dump. Size the book to the **physical
  market's** bear-case absorption.
- **Still open:** granular per-tier physical sale-frequency / time-to-sell / spread (from PSA APR /
  auction-house data — see OQ-4) and CC's per-card buyback depth.

Data: Magic Eden API (pulled 2026-07-31, used only to confirm NFT-market liquidity is not our rail). Physical-market context: [PokemonPriceTracker — Charizard history](https://www.pokemonpricetracker.com/blog/posts/charizard-price-history-1999-2026-complete-analysis).

---

## Strategic implications (the spike changed the plan)

### 1. Strongly consider the **fixed-term / no-price-liquidation (offerbook/pawn) model** for v1
The incumbents (Jupiter Offerbook) launched with **fixed-term loans and no price-based
liquidations.** That model is a near-perfect fit for *everything the threat model struggled with*:
- **It removes the live-oracle-manipulation → liquidation attack surface** (T-1, T-7, T-14, F-1,
  F-4, F-6) **for the loan term.** With no mid-loan mark-to-market liquidation, an attacker can't
  wash-trade a card to force or dodge a liquidation.
- **It slashes oracle dependence** — you need one *conservative appraisal at origination*, not a
  continuously manipulation-resistant live oracle (which OQ-4 shows is hard/expensive to source
  independently).
- **The lender's protection becomes duration + a low origination LTV + the collateral itself**
  (repay or the lender keeps/sells the card at maturity), backstopped by the CC buyback.
- **Trade-off:** duration risk — the lender is exposed to a drawdown over the *full fixed term*
  with no early exit. Mitigate with **short terms, low LTV (validated by OQ-2's ~40–50% blue-chip
  drawdowns), and a maturity-time buyback/marketplace settlement.**

**Recommendation:** design v1 as **fixed-term, no mid-loan price-liquidation**, with an *optional*
mark-to-market/maintenance layer as a later upgrade — not the launch model. This inverts the
earlier design's default and removes most Critical/High threats by construction. (The full
mark-to-market design in docs 2–5 remains the reference for if/when we add that layer.)

### 2. We are entering a **competitive** market, not an empty one
Loopscale and Jupiter Offerbook already lend against CC cards at ~7–8%. Magpie's edge is **not
being first** — it's the **screening/eligibility discipline, cross-sourced valuation, execution
reliability (priority fees/rebroadcast/failover), and risk controls** (caps, reserve, circuit-
breakers). Position on **safety, honest valuation, and UX**, and/or a differentiated tier
(e.g., higher-value blue-chips with deeper underwriting). Benchmark rates against the ~7–8% incumbents.

### 3. Source-independence is a real, funded work item — not a checkbox
Because the cheap feeds are all eBay-derived (OQ-4), achieving I-7 independence requires a
**PSA-APR / auction-house data pipeline (scrape or license)**. Budget for it, or lean on the
fixed-term model (which needs it far less). Until an independent feed exists, do not rely on the
comps-vs-buyback divergence check as a manipulation defense (F-1).

---

## Updated open-question status
| OQ | Status | Residual |
|----|--------|----------|
| OQ-1 liquidity | 🟡 | per-tier granular via CC native API |
| OQ-2 drawdowns | ✅ | — (≤50% Tier-A LTV validated) |
| OQ-3 buyback terms | 🟡 | exact vault (non-Gacha) per-card rate + on-chain readability + divergence history |
| OQ-4 comp APIs | 🔴 | secure ≥1 **independent** feed (PSA APR/auction data) — cost/scrape/license |
| OQ-5 physical lien | ✅ | mechanism proven live (Loopscale/Jupiter); verify exact lock during build |
