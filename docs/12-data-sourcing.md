# 12 · Price-Data Sourcing Plan (closing the F-1 / OQ-4 blocker)

The adversarial review's most dangerous finding (F-1) and the spike's hardest open question
(OQ-4) are the same problem: **our comps and the Collector Crypt buyback are both eBay-derived,
so they aren't independent, and a single eBay wash campaign moves both.** This doc specifies a
sourcing stack that gives a **genuinely independent realized-sales anchor** and therefore lets
invariant **I-7** actually hold.

## 12.1 The key unlock: PSA "Auction Prices Realized" is independent of eBay
- **PSA APR** aggregates **realized auction results across multiple houses** (Heritage, Goldin,
  PWCC, Mile High, etc.), keyed to the exact card + grade + cert. Because it is **multi-house and
  not eBay-only**, it is the **structurally-independent realized-sales anchor** F-1/I-7 requires.
- **Access:** APR is **free to browse** (psacard.com/AuctionPrices), and **PSA offers an official
  Public API** (REST, JSON/XML, requires a PSA account). A third-party scraper (Apify) exists as a
  fallback. *(Note: an earlier research claim that PSA's API is throttled to ~1 call/day was
  **refuted**; confirm the real rate limits/commercial terms directly with PSA — [OQ-4 residual](07-open-questions.md).)*

## 12.2 The feed stack (multi-source, with independence built in)
| Feed | Role | Realized sales? | Independent of eBay? | Access |
|------|------|:---------------:|:--------------------:|--------|
| **PSA Auction Prices Realized** | **Primary independent anchor** | ✅ | ✅ **multi-house** | Official PSA Public API (+ scrape fallback) |
| **eBay Marketplace Insights** | Depth / recency corroboration | ✅ | ❌ (is eBay) | Business approval req'd — pursue as partnership |
| **PokemonPriceTracker / PriceCharting** | Cheap corroboration + liquidity signal | ✅ (eBay-sourced) | ❌ | $99/mo commercial (PPT); PriceCharting API |
| **Collector Crypt buyback quote** | Liquidation floor + a cross-check (NOT a valuation) | n/a | ❌ (eBay/ALT) | on-chain read from canonical CC program |
| **Auction-house results (Goldin/Heritage/PWCC)** | Deepen the independent set for high-value cards | ✅ | ~ (Goldin is eBay-owned) | scrape / license; mostly folded into PSA APR |

## 12.3 How independence is enforced (invariant I-7 in practice)
- The **appraisal's confirming leg must come from PSA APR (independent)** — never eBay-vs-eBay.
- The **divergence check** is `independent_comp (PSA APR)` vs `CC buyback reference`, with a
  **continuous haircut scaling with divergence** and a hard refuse at ~15% (finding F-10), *not* a
  wide binary band.
- eBay-derived feeds are used for **recency/depth corroboration and the liquidity signal**, but
  **cannot alone certify an AV** — at least one independent (PSA APR) confirmation is mandatory.
- **Manipulation cost:** to move our mark now, an attacker must fake sales across **multiple
  auction houses** (PSA APR) *and* eBay *and* the CC index simultaneously — vastly harder and more
  expensive than a single-venue eBay wash. That is the whole point.

## 12.4 The fixed-term model slashes the data burden
Under the [fixed-term v1](10-fixed-term-v1-spec.md) there is **no continuous mark-to-market** — we
need a **conservative appraisal only at origination (and at renewal)**, not a manipulation-resistant
*live daily* oracle. That converts OQ-4 from a hard real-time-infrastructure blocker into a
**tractable origination-time data pull**:
- Daily/near-real-time feeds are *nice-to-have* (for the optional MtM layer), not *required* for v1.
- A per-origination PSA APR lookup + eBay-corroboration + on-chain buyback read is sufficient.
- Rate limits that would kill a live-oracle (e.g. per-card daily marks across the whole book) are
  fine for origination-time lookups.

## 12.5 Card identity → comp lookup keying
Resolve the collateral to **{grader, grade, set, card #, variant, cert #}** from the token/vault
metadata, then:
- **Cert #** → PSA/CGC cert-verification lookup (authenticity + exact card/grade).
- **{set, #, variant, grade}** → PSA APR query for the exact card+grade realized-sales series
  (never "a Charizard" — a PSA 10 ≠ PSA 9).
- Population (PSA pop report) → informs scarcity/liquidity tier; note pop endpoints are
  higher-tier/commercial on third-party APIs.

## 12.6 Build/ops plan & cost
1. **Confirm PSA Public API commercial terms + rate limits** (direct to PSA) — the last residual on OQ-4.
2. **Build a normalized card-identity resolver** (token/vault metadata → PSA APR key + cert lookup).
3. **Ingest PSA APR** (official API primary; Apify scraper as resilience fallback) with the
   robustness rules from [doc 2.4](02-valuation-oracle.md) (median/trim, outlier reject, staleness).
4. **Corroborate** with a cheap eBay-derived feed (PokemonPriceTracker $99/mo) + the on-chain CC
   buyback read; enforce the independence rule (§12.3).
5. **Back-test:** run the appraisal engine over historical CC-listed cards; compare our AV to actual
   subsequent sale prices and to CC buyback outcomes; tune haircuts.
6. **Budget:** modest for v1 (PSA API + ~$99/mo PPT + scraper infra). An eBay Marketplace Insights
   partnership and direct auction-house licensing are later, larger investments if we add the live
   MtM layer.

## 12.7 Status update to OQ-4
**Downgraded from 🔴 blocker to 🟡 tractable.** PSA APR (official Public API, multi-house,
eBay-independent) resolves the *independence* requirement in principle; the only residual is
confirming PSA's **commercial API terms/rate limits** in writing and building the ingestion +
identity-resolver. The fixed-term model removes the live-oracle pressure that made this hard.

## Sources
- [PSA — Auction Prices Realized (free database)](https://www.psacard.com/articles/articleview/9416/massive-database-auction-results-unlocked-free-collectors) · [PSA Public API docs](https://www.psacard.com/publicapi/documentation)
- [PSA APR scraper (fallback)](https://apify.com/jungle_synthesizer/psa-auction-prices-realized-scraper)
- [PokemonPriceTracker PSA API (eBay-sourced, $99/mo commercial)](https://www.pokemonpricetracker.com/psa-pokemon-card-api) · [PriceCharting methodology (eBay-sourced)](https://www.pricecharting.com/page/methodology)
