# 19 · OQ-3 / OQ-4 Closeout (Phase-1 research)

> Phase-1 research results that advance the open questions in [doc 7](07-open-questions.md). Findings
> below are from primary-source research; items still needing a **sales/BD conversation** are marked
> **→ OUTREACH**. Design-only; nothing deployed.

---

## 19.1 OQ-4 — Is there a realized-sales source structurally independent of eBay?

**Verdict: FEASIBLE-WITH-COST (medium-high confidence).** A lender *can* get at least one realized-sales
signal that is structurally independent of eBay, keyed to exact grade/cert — but **none of the
independent sources is cheap self-serve.** Every self-serve API is eBay-derived; every eBay-independent
source needs a commercial-terms conversation. Budget for **outreach + a data-license fee**, not a
$99/mo credit-card signup.

### Correction to our own prior assumptions (important)
- **PWCC is Fanatics-owned, NOT eBay-owned** (acquired Mar 2023). Only **Goldin is eBay-owned**
  (acquisition completed 2024-05-16). So the eBay common-mode blast radius is **narrower** than
  [doc 12](12-data-sourcing.md)/[doc 9](09-data-spike-results.md) implied: **PWCC and Heritage sit
  OUTSIDE eBay's wash-trading radius.** This widens the independent-source set. *(Fix carried into
  doc 12.)*
- **PSA Public API does NOT expose APR/prices today** — the only live endpoint is **cert verification**
  (`GET /publicapi/cert/GetByCertNumber/{cert}`). The earlier "~1 call/day" claim is **refuted**: the
  free tier is **100 calls/day** (429 over limit). PSA markets "auction prices" as a data *category*,
  but it is **web-only**, not an API method.

### The three viable independence anchors (descending "clean but needs outreach")
| Anchor | Independence | Access reality | Pokémon depth |
|---|---|---|---|
| **Heritage Auctions** prices-realized | **Cleanest** — own auction house, independent price formation | Free web archive (back to 1997); official Azure developer API portal exists; **commercial terms not public → OUTREACH** | Thinner than eBay, but real (TCG Signature Auctions) |
| **PSA APR non-eBay slice** (Heritage + Memory Lane rows inside APR, keyed to cert/grade) | Good — multi-house within one dataset | **APR is web-only (no API)**; programmatic = scrape (ToS risk) or **PSA commercial data license → OUTREACH** | Deep + current (records back to 2019; Heritage results into Dec 2025) |
| **Card Ladder / Market Movers** | Good — aggregates ~14 venues incl. Heritage/PWCC/Mile High/REA (filter to non-eBay) | Public tier = personal/non-commercial only; **enterprise/dealer API exists, terms undisclosed → OUTREACH** | Deep (50M+ sales since 2002) |

### eBay-common-mode feeds — corroboration ONLY, never the independence anchor
- **PokemonPriceTracker** (TCGPlayer+eBay+CardMarket; PSA 8/9/10 sourced from eBay completed listings; $99/mo commercial, self-serve API).
- **PriceCharting** (eBay sold-listing data + algorithm; API exists).
- **eBay Marketplace Insights API** (the raw eBay realized feed — Limited-Release, business-approval-gated, **"not open to new users"**; unavailable *and* non-independent).

### Design consequence (fold into [doc 2](02-valuation-oracle.md) / [doc 12](12-data-sourcing.md))
1. The independence anchor (invariant **I-7**) must be a **non-eBay auction-house realized signal** —
   PSA-APR's non-eBay slice, Heritage prices-realized, or Card Ladder filtered to non-eBay venues.
2. **Coverage gap is the real risk:** non-eBay venues have far thinner Pokémon-by-cert liquidity, so
   the independent signal will often be **sparse or stale** for long-tail cards. The oracle must
   **degrade safely** — widen haircut / lower LTV / drop eligibility when the independent signal is
   missing or older than ~90 days — and must **never silently fall back to eBay-only comps** (that
   would re-open the F-1 circularity). This strengthens the fixed-term, fail-closed posture.
3. **GemRate** (pop data, Partner API) is useful for **exact-identity keying** across graders, not for value.

### OQ-4 status → 🟡 (was 🔴)
Independence is **achievable but not free**. Remaining to close (all **→ OUTREACH**, highest value first):
1. **PSA** — does the paid/enterprise tier expose APR programmatically, at what volume/price, with what
   redistribution license? *(If PSA licenses APR — which already contains the non-eBay slice keyed to
   cert/grade — OQ-4 is solved in one contract.)*
2. **Card Ladder enterprise API** — cost, rate limits, per-sale source tagging (to filter non-eBay), redistribution rights.
3. **Heritage** — register the Azure developer portal; confirm prices-realized queryable by grade/cert + commercial terms + Pokémon depth.
4. **eBay Marketplace Insights** — confirm denial to formally close it out; do not build on it.

---

## 19.2 OQ-3 — Collector Crypt vault buyback: exact terms + on-chain readability

**Verdict: the CC buyback is NOT a usable liquidation exit for our product, and NOT on-chain-readable.**
This **overturns a load-bearing assumption** carried in [doc 2](02-valuation-oracle.md),
[doc 4](04-liquidation-risk.md), and [doc 9](09-data-spike-results.md), which treated the buyback as a
"~85–90% standing on-chain soft floor / primary liquidation exit." That framing is **wrong** — it was
marketing looseness. The verified reality:

- **Buyback is Gacha-only and time-boxed to 72 hours from the pack pull.** The 85 / 90 / 93% tiers
  (Elite / Legendary / Grail) apply **only to a card just revealed from a Gacha pack**, within 72h,
  capped at 40,000 USDC, paid on CC's **insured value** (not realized market). "The buyback window
  cannot be extended or reopened." **There is NO standing bid for an ordinary vaulted card** a lender
  would hold as collateral for weeks/months. Once the window closes, there is **no buyback floor at
  all.**
- **The quote is OFF-CHAIN.** The insured value is a CC server-side API/DB field; the buyback runs
  through CC's `/api/buyback` endpoint (server computes the quote, constructs the tx). The Marketplace
  V2 program (`Ccm…SQUr`) stores listings/offers/escrow but is **not a price oracle**. CC's "AI pricing
  oracle" is explicitly *in development*, with no commitment to post prices on-chain. **A Solana lending
  program cannot read a CC buyback/index price on-chain today** (high confidence, from CC's own docs).
- **The insured value is a counterparty-set soft reference.** CC sets both the insured value AND the
  buyback rate, derives value from eBay/ALT comps, updates it only "periodically," and warns it "may
  differ from marketplace prices." Realized edges (3–11%) accrue to CC by design. Usable at most as
  **one skeptical, heavily-haircut, off-chain cross-check input** — never a primary or on-chain price.
- **Fees:** marketplace seller 2% (1% platform + 1% royalty); physical redemption = 2% of insured
  value + shipping + insurance; buyback haircut 7–15%.
- **Custody (flag for outreach):** likely CC-run Delaware intake/authentication + **PWCC (Fanatics) /
  ALT** partner storage. *(Correction: Brink's is NOT CC — that's competitor Courtyard.)* **No
  bailee/lien mechanism for a third-party lender is documented** — the on-chain interest would be over
  the pNFT only; the physical is controlled by CC/partners. Ties directly to **F-5 / OQ-5**.
- **Counterparty yellow flags:** ~98% of CC revenue is **Gacha wagering, not per-card resale** (the
  "$1B+" is Gacha turnover, not secondary-market liquidity); ~72% of CARDS supply to insiders; gross
  margin compressed 10–12%→5.9%; regulatory gray zone (US/UK/China restricted); admin keys can disable
  sales / alter fees / mint; **no public security audit or proof-of-reserves surfaced.**

### OQ-3 status → 🔴 (materially worse than assumed)
The buyback is not the backstop the earlier docs assumed. **Remaining unknowns (→ OUTREACH to CC):**
(1) any standing bid for non-Gacha held cards? (2) will insured value / a signed quote ever be
on-chain or API-available to external protocols with an SLA? (3) insured-value update cadence + can CC
unilaterally mark it down? (4) a bailee/control agreement so a lender can perfect a lien on the
physical while a loan is open? (5) custody ground truth + insurance limits + proof-of-reserves;
(6) admin-key interference risk with seizing/selling pNFT collateral.

---

## 19.3 Net effect on the plan (this changes the design)

1. **Liquidation rail must be rebuilt.** [Doc 4](04-liquidation-risk.md)'s waterfall (buyback primary →
   marketplace fallback) is **inverted by reality**: the buyback does **not** backstop held collateral.
   The real rail is **open-marketplace resale of the pNFT** (Magic Eden / CC marketplace) → and, if
   needed, **burn-to-physical + physical resale** — both of which [OQ-1](09-data-spike-results.md)
   already flagged as **THIN** (Magic Eden `collector_crypt` ≈ 2 sales / 100 activities, ~$16 floor).
   *Action: revise doc 4 to make marketplace + physical-redemption the primary rail, sized for thin,
   slow liquidity; delete the buyback-as-soft-floor claim from docs 2/4/9.*
2. **This strongly reinforces the fixed-term, no-price-liquidation v1** ([doc 10](10-fixed-term-v1-spec.md),
   [doc 18](18-structure-decision-memo.md)). With no fast, reliable liquidation bid, a
   mark-to-market/auto-liquidation model would be trying to sell into a market that can't absorb it —
   exactly the BendDAO failure ([doc 4](04-liquidation-risk.md)). Keep-or-forfeit + short duration +
   **lower LTV** + reserve is the safe posture; default recovery is *hold the card and resell over
   time*, not *instant liquidate*.
3. **Counterparty (CC) risk is elevated**, not a side note. No proof-of-reserves, broad admin keys, and
   no lender-lien path make **OQ-5 / the bailee-control agreement a hard precondition**, and mean
   **total lane exposure must be capped to what we can absorb via slow physical resale if CC
   cooperation degrades** ([doc 13](13-economic-model.md) reserve I-9 sizing gets stricter).
4. **Valuation:** CC insured value = optional, heavily-haircut, off-chain cross-check ONLY. The real
   value engine is the independent realized-comp oracle from §19.1 (non-eBay anchor + eBay
   corroboration), degrading safely when signal is sparse.

- **OQ-4 🟡:** independence solvable via a data-license conversation (PSA/Heritage/Card Ladder) — a
  budget line + Phase-1 outreach task, not a design blocker; reinforces fail-closed/degrade-safely.
- **OQ-3 🔴:** buyback is not a liquidation backstop or on-chain oracle → rebuild the liquidation rail
  around thin-market resale + physical redemption; reinforces fixed-term v1; elevates CC counterparty
  + bailee-lien (OQ-5) to hard preconditions.
- Feeds [Gate 1](16-build-plan.md): OQ-4 has a usable (paid) path; **OQ-3 changes the design and must
  be reflected in docs 4/13 before Gate 1 can be green.**

## Sources
PSA Public API docs (api.psacard.com/publicapi) · PSA APR (multi-house: eBay/Heritage/Memory Lane) ·
Card Ladder platforms + terms · Heritage auction archives + Azure developer portal · eBay
Marketplace Insights (limited-release) · PokemonPriceTracker / PriceCharting (eBay-derived) ·
Goldin = eBay-owned (2024) · PWCC = Fanatics-owned (2023) · GemRate Partner API (pop, not price).
