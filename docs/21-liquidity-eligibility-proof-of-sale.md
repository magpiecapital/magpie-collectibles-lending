# 21 · Liquidity Eligibility & Proof-of-Sale — the collateral-admission gate

> **The single most important gate in the whole strategy.** We lend ONLY against collateral with a
> demonstrated, recent, real **sales** record — proven liquidity. Never against listings/asks, a thin
> index *projection*, or an issuer's self-assigned "fair value." If an item doesn't actually sell, or
> it's priced off offers that never clear, it is **ineligible — fail-closed.** This doc turns that
> principle into precise, testable rules. It sharpens and consolidates the liquidity logic in
> [doc 2](02-valuation-oracle.md), [doc 3](03-underwriting-ltv.md), [doc 7 OQ-1](07-open-questions.md),
> [doc 13](13-economic-model.md), and the independence anchor in [doc 19.1](19-oq-closeout.md).
> Operator mandate (2026-08-04): *"proven liquid collectibles and Pokémon cards — not ones that are
> unfairly priced and don't actually sell."* Design-only; nothing deployed.

## 21.1 The principle (non-negotiable)
1. **Realized sales only.** Value and eligibility derive from **prices things actually SOLD for**, never
   listing/ask prices, never an issuer FMV/buyback quote on its own, never a last-sale outlier.
2. **Proven liquidity, or no loan.** The item must clear the market **repeatedly and recently**. Sparse,
   stale, or one-print-a-year items are **excluded**, not just haircut.
3. **Fail-closed.** Missing/insufficient proof of sale → ineligible. Permissionless *within* the proven
   set; the oracle gates, not a human whitelist. (Opposite of the borrow-side "fail-open" rule —
   [[feedback_borrow_liquidity_must_be_aggregate_never_block_legit]] — because here inclusion is the risk.)
4. **Unfairly-priced items are rejected, not lent against.** If the marked price can't be corroborated by
   independent real sales, we don't lend on the inflated number — we refuse or mark to the lower proven value.

## 21.2 Proof-of-Sale requirement (hard gate — ALL must pass)
An item is **admissible** only if, at origination, its exact identity clears every check:

| # | Check | Threshold | Why |
|---|---|---|---|
| PS-1 | **Realized-sale count** | ≥ **5** arm's-length realized sales in trailing **12 mo**, AND ≥ **2** in trailing **90 d** | Enough to compute a robust central tendency + prove it *still* trades (tightens Card Ladder's ≥2/12mo+≥1/6mo baseline per red-team F-3) |
| PS-2 | **Seller diversity** | ≥ **3** distinct sellers | Defeats single-seller wash/shill (eBay pulled 71k+ PWCC listings over shill bidding) |
| PS-3 | **Venue diversity** | ≥ **2** distinct venues | No single-marketplace manipulation moves the whole signal |
| PS-4 | **eBay-independence** | ≥ **1** realized comp from a source **structurally independent of eBay** (PSA-APR non-eBay slice / Heritage prices-realized) | Closes the F-1 circularity ([19.1](19-oq-closeout.md), invariant I-7); every cheap feed + CC's buyback ref are eBay-common-mode |
| PS-5 | **Exact-identity match** | Comps keyed to **{grader, grade, set, card #, variant}** (+ cert # where available) | PSA 10 ≠ PSA 9 ≠ CGC 9.5; never comp "a Charizard" |
| PS-6 | **Arm's-length filter** | Exclude same-buyer/seller loops, round-number wash patterns, sub-fee nominal sales, and private/untraceable transfers | Wash trades are "sales" that aren't liquidity |
| PS-7 | **Dollar floor** | Proven value ≥ **$250** (calibration target) | Below the floor, liquidation economics (fees + shipping on physical recovery) don't work |

**Any failure → INELIGIBLE.** No overrides. (Long-tail cards with a single yearly sale, a hot new
release with no sales history, or a card that only has *listings* all fail here — by design.)

## 21.3 Liquidity classification (sets the tier)
For items that pass §21.2, classify by how *often* and how *recently* they actually sell:

| Tier | Sale frequency (trailing 12mo) | Recency of last sale | Realized-price dispersion | → Max LTV band |
|---|---|---|---|---|
| **L1 — Highly liquid** | ≥ **12** sales (~weekly) | ≤ **14 d** | tight (IQR/median ≤ ~20%) | Tier A (≤50%) |
| **L2 — Liquid** | ≥ **6** (~monthly) | ≤ **30 d** | ≤ ~30% | Tier B (≤35%) |
| **L3 — Marginally liquid** | ≥ **4** (~quarterly) | ≤ **90 d** | ≤ ~40% | Tier C (≤20%) |
| **Below L3** | — | — | — | **INELIGIBLE** |

Recency maps to the Card-Ladder-style confidence meter (5=≤2wk … 1=>6mo→exclude), which *also* sets a
staleness haircut on the marked value (§21.4). Dispersion is a first-class gate: a wide spread of
realized prices signals a thin or manipulated market → drop a tier or exclude, even if the count passes.
LTV bands are the bear-sized launch numbers from [doc 13](13-economic-model.md)/[doc 17](17-parameters-reference.md),
justified against verified 40–70% drawdowns.

## 21.4 Price integrity — the "unfairly priced" exclusion
Passing the liquidity gate isn't enough; the *marked value* must be a defensible product of real sales:

1. **Mark = robust central tendency of realized sales.** Recency-weighted **trimmed median** of the last
   N qualifying sales (drop top/bottom outliers) — NOT last-sale, NOT mean, NOT listing, NOT issuer FMV.
2. **Outlier / wash rejection.** Discard sales beyond ~**3× MAD** from the median; require the surviving
   set to still satisfy PS-1..PS-3. A cluster of same-seller or round-number sales is treated as suspect
   and excluded before marking.
3. **Divergence gate (the core "unfairly priced" test).** Compare the independent realized-comp mark to
   the issuer's FMV/buyback/listing/index. If the issuer/listing number exceeds the independent realized
   mark by more than a band → **hard-refuse at ~15%**; a **continuous haircut** applies below that. We
   NEVER lend on the higher inflated number — we mark to the lower *proven* value or refuse. (Mirrors
   Magpie's reject->3× cross-source divergence discipline, tuned; [[feedback_collateral_price_must_be_cross_sourced_jupiter_primary]].)
4. **Index-projection distrust.** A card priced by holding a "last-sold ÷ index" ratio × today's index
   (i.e., *no recent actual sale*, value inferred from a set/character index) is **not proven-liquid** →
   ineligible at launch, or if ever allowed, capped to L3 with an extra haircut and a hard per-item cap.
   This is exactly the "unfairly priced, doesn't actually sell" case the mandate excludes.
5. **Staleness haircut.** Apply the confidence-meter haircut to the mark (5→0%, 4→5%, 3→15%, 2→30%,
   1→exclude), stacked with the thin/index haircut. Haircut widens as the last real sale ages.

**Appraised Value (AV) = min( staleness-&-thin-haircut-adjusted independent realized mark , issuer buyback
quote )**, accepted only if the independent mark and the issuer quote agree within the divergence band —
else refuse. LTV is applied to **AV**, not to the issuer's number. (Origination uses `min()`; the
maintenance mark, if a later MtM layer ships, uses the INDEPENDENT mark so an issuer can't force-liquidate
a healthy loan — split invariant I-1, [doc 8](08-adversarial-review.md).)

## 21.5 Absorb-capacity caps (liquidity sizing, not just liquidity gating)
Proven liquidity also *bounds size* — we can only lend what the real market can absorb on the way out:
- **Per-item cap:** loan principal ≤ a fraction of the item's **trailing realized $-volume** (so a single
  loan can't exceed what that card actually clears in a reasonable liquidation window).
- **Per-identity/character cap:** Charizards (and one set/character) correlate — cap aggregate exposure to
  a single character/set so a hobby-segment drawdown can't concentrate loss.
- **Total lane cap:** sized to **bear-market marketplace-absorb capacity** (start small pilot), with the
  reserve fund (I-9) covering modeled worst-case shortfall.
- **Issuer/platform cap:** each tokenization platform ([doc 20](20-tokenization-platforms-collateral-sources.md))
  is its own capped lane (Collector Crypt / Courtyard / Phygitals …) so no single custodian is a
  concentration or a single point of failure.

## 21.6 Ongoing liquidity monitoring (the book stays clean)
- **Re-verify on every origination** (proof is point-in-time; a card that was liquid last quarter may be
  thin now). Cache comps briefly; never lend on stale proof.
- **Liquidity decay → no new loans** on that item/identity; existing **fixed-term** loans
  ([doc 10](10-fixed-term-v1-spec.md)) ride to maturity (recovery = resell over time — we don't force-sell
  into a thin book, the BendDAO lesson).
- **Segment-wide liquidity watch:** if a whole segment's realized volume collapses, pause new originations
  in that segment (circuit-breaker), independent of any single card.

## 21.7 Worked examples
- **✅ Base Set Charizard, PSA 10:** dozens of realized sales/yr across eBay + Heritage + PWCC, last sale
  days ago, tight dispersion, PSA-APR (non-eBay) corroborates. → **L1, Tier A ≤50% of AV.**
- **✅ Modern chase card, PSA 10, hot but real:** ≥6 sales/yr, last ≤30d, multi-seller/venue, comps agree.
  → **L2, Tier B ≤35%.**
- **⚠️ Semi-liquid vintage, PSA 8:** 4 sales/yr, last 70d, wider dispersion. → **L3, Tier C ≤20%**, extra
  staleness haircut.
- **❌ Long-tail card listed at $3,000 with ZERO sales in 12mo (only asks):** fails PS-1. → **INELIGIBLE.**
- **❌ Thin card "worth $1,500" per a set-index projection, last real sale 8 months ago at $600:** fails
  recency + index-projection distrust; if marked, divergence gate refuses the inflated number. → **INELIGIBLE**
  (this is precisely the "unfairly priced, doesn't actually sell" case).
- **❌ Card with 6 sales but all from one seller at round numbers:** fails PS-2/PS-6 (wash pattern). → **INELIGIBLE.**

## 21.8 How this ties to the invariants
Feeds/uses: **I-1** (LTV×AV origination; independent maintenance mark), **I-4** (eligibility = this gate),
**I-6** (continuous caps, §21.5), **I-7** (eBay-independent anchor, PS-4), **I-9** (reserve ≥ worst-case),
**I-10/I-11** (index-manipulation cross-check + anomaly cooldown, §21.4). Every check in §21.2–21.4 is a
checkable predicate the Phase-2 oracle prototype ([doc 16](16-build-plan.md)) must implement and the
red-team must try to bypass (wash / shill / shared-source / index-inflation / thin-dispersion attacks).

## 21.9 One-line summary
**We lend on what the market has repeatedly and recently been willing to PAY — proven by independent,
multi-venue, real sales — and on nothing else.** Liquidity is the gate; realized sales are the proof;
the inflated, the illiquid, and the unproven are excluded by construction.
