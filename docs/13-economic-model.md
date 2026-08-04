# 13 · Economic Model & Stress Test

Turns the strategy into numbers: do the LTV bands, the **resale recovery** rail, and the reserve keep
the book solvent through a verified-magnitude drawdown? All figures are **illustrative model inputs**
for sizing, not forecasts — plug real data (OQ-1) before committing capital.

> **Rebuilt 2026-08-04 for the OQ-3 reality ([doc 19.2](19-oq-closeout.md)):** the Collector Crypt
> buyback is NOT a reliable liquidation rail (Gacha-only, 72h, off-chain — no standing bid on a held
> card), so the earlier ~87% buyback assumption is **removed**. Recovery is now modeled on **graduated
> marketplace resale + burn-to-physical resale** of a **proven-liquid** item ([doc 21](21-liquidity-eligibility-proof-of-sale.md)),
> assuming **zero buyback**. Model applies to [fixed-term v1](10-fixed-term-v1-spec.md): one appraisal
> at origination, no mid-loan liquidation, settle at maturity via resale.

## 13.1 Recovery math on a single defaulted loan (no buyback)
Notation: `AV` = appraised value at origination (already haircut, = min(independent realized comp,
issuer quote)). Loan = `LTV × AV`. Over the term the item's value moves by `d` (drawdown = `d<0`). At
default we recover by **selling the proven-liquid item** — graduated marketplace markdown, or burn-to-
physical + consignment — netting a fraction `βᵣ` of *current* value after all costs.

```
current_value = AV × (1 + d)
recovery      ≈ βᵣ × current_value                 # βᵣ already net of resale/consignment/shipping fees
covered  ⇔  recovery ≥ Loan × (1 + r·t)            # principal + interest over term
```

**`βᵣ` (net resale recovery) is LOWER and slower than a buyback** — and it's what we must size against:
- **Marketplace graduated markdown:** ~2% platform fee, but a *stressed* thin book clears below the
  mark → **βᵣ ≈ 0.75–0.85** in normal conditions, **~0.65–0.75** in a bear/thin market.
- **Burn-to-physical + consignment:** nets ~**0.80–0.87** of realized value (eBay ~13% / Heritage
  ~15–20% fees) but takes **weeks** (redemption SLA + sale) — fine under fixed-term, but slow.
- **Base-case planning `βᵣ = 0.75`** (conservative blended), stressed to **0.65**. No buyback floor.

**Worst-case per tier** (verified drawdowns from [doc 9](09-data-spike-results.md); `βᵣ=0.75` base):

| Tier | LTV | Modeled worst term-drawdown `d` | Recovery `βᵣ·(1+d)·AV` | vs Loan | Covered? |
|------|:---:|:---:|:---:|:---:|:---:|
| **A** | **40%** | −45% (blue-chip ~halved 2022–23) | `0.75·0.55 = 0.41·AV` | ~0.40·AV | ✅ **thin cover** |
| A | 50% | −45% | `0.41·AV` | ~0.50·AV | ❌ **loss (−0.09 AV)** |
| A | **60%** | −45% | `0.41·AV` | ~0.60·AV | ❌ **big loss (−0.19 AV)** |
| A | 60% | **−20%** (moderate) | `0.75·0.80 = 0.60·AV` | ~0.60·AV | ⚠️ **break-even only** |
| **B** | **35%** | −55% | `0.75·0.45 = 0.34·AV` | ~0.35·AV | ✅ **~cover → reserve** |
| **C** | **20%** | −70% | `0.75·0.30 = 0.225·AV` | ~0.20·AV | ✅ **thin cover** |

## 13.2 The LTV decision — why the high end is ~40%, not 60% (operator Q, 2026-08-04)
**Recommendation: top-tier LTV ≤ 40% at launch. 60% is too aggressive; here's the math.**
- With **no buyback** and resale `βᵣ≈0.75`, a **60% LTV loan only survives a term-drawdown shallower
  than ~20%.** Pokémon blue-chips have verified peak-to-trough of **45–70%**, and even intra-term,
  influencer/hype reversals move prices **12–25% in 72h** ([doc 15](15-collector-ux-gtm.md)). 60%
  leaves no margin for the moves this asset class actually makes.
- **40% LTV survives a ~45% term-drawdown** with a thin cushion — matched to the *most liquid,
  best-comped* blue-chips (Tier A), on short terms.
- We **lost a safety buffer** (the buyback) vs the earlier model, so the correct move is *more*
  conservative, not less. The margin of safety now rests on: **(1) proven-liquidity gate
  ([doc 21](21-liquidity-eligibility-proof-of-sale.md)), (2) haircut appraisal, (3) conservative LTV,
  (4) short duration, (5) reserve.** Buyback is demoted to an *opportunistic* nicety, not a buffer.
- **Context:** tokenized *stocks* (Magpie V3) run 50–70% LTV — but equities are deeper, faster to
  liquidate, and far less volatile than an individual graded card with a thin per-item market. Cards
  must sit **below** the RWA-equity band, not at/above it. TradFi card lenders quote 40–60% but with
  recourse, insurance, and 6–12mo terms we don't have.
- **Path to raise later (earn it, don't assume it):** once we have (a) real per-tier liquidity +
  term-drawdown data on the actual book (OQ-1), (b) ≥1 clean liquidation-through-resale proving `βᵣ`,
  and (c) demonstrated reserve adequacy, the Tier-A top could move toward **45–50%** for the very most
  liquid names on the shortest terms. **Not at launch, and not to 60%.**

**Launch bands: A ≤ 40% · B ≤ 35% · C ≤ 20% (or exclude).** The single most important number in the
strategy — set by real drawdown history + a weak liquidation rail, not optimism.

## 13.3 Why fixed-term + short duration matters here
`d` is the drawdown **over the loan term**, not peak-to-trough over years. A 30–90d term caps `d` far
below the multi-year −45%/−70% figures — those are the *absolute* worst case if a crash lands entirely
within one term. Short terms make even the tighter bands comfortable in the median case while surviving
the tail. (This is also why we can afford a *slow* physical-resale recovery: no mid-loan margin call
forces a fire-sale.)

## 13.4 Book-level stress test (the BendDAO scenario, run against us — with ZERO buyback)
Scenario: a hobby-wide crash, **all** collateral drops ~40–70% within a term, resale is thin (`βᵣ→0.65`),
**and there is no buyback at all** (our baseline assumption now, not a tail).
- With launch LTVs (A40/B35/C20), most Tier-A/B loans still **self-cover or land within a small
  shortfall**; losses concentrate in Tier C and the deepest drawdowns.
- **Reserve covers the residual (invariant I-9).** If modeled joint-stress tail loss is `L%` of the
  book, `reserve ≥ L% × book`. With the buyback removed and `βᵣ=0.65`, size the reserve **higher** than
  the old 5–10% hypothesis — **~10–15% of book** is the new starting hypothesis, validated on real data;
  originations auto-halt if the ratio degrades; reserve exhaustion → orderly wind-down (never socialized).
- **Concentration caps** (per-card ≤ a fraction of its trailing realized volume, per-character, total
  lane, per-platform — [doc 21](21-liquidity-eligibility-proof-of-sale.md) §21.5) ensure no single
  position or correlated bucket can breach the reserve alone.

## 13.5 Revenue & break-even
Per loan: `revenue = r·t·Loan + fees`; `cost = default_rate × loss_given_default + recovery cost +
capital + ops`.
- With conservative LTV on **proven-liquid** collateral, median-case recovery ≥ loan, so **loss-given-
  default is contained** even without a buyback — the book is profitable at modest rates.
- **Rate benchmark:** on-chain card lenders ~9–10% (Collector Crypt/Loopscale, no orig fee); TradFi
  13–15% + fees. Launch APR **~10–14%** (tiered) beats TradFi, is competitive on-chain, and prices in
  the higher appraisal/curation + slower-recovery cost.
- **The margin is safety, not spread.** Steady interest in normal times, *survives* the tail. Never
  loosen a buffer to chase volume.

## 13.6 Parameters to calibrate with real data (before any capital)
| Parameter | Source to close it |
|---|---|
| Per-tier term-drawdown `d` | OQ-2 (have market-level; need term-window + per-tier distribution) |
| **Net resale recovery `βᵣ` + time-to-clear** | OQ-1 (marketplace depth) + a real liquidation; whisky/watch analogs |
| Per-tier liquidity / time-to-sell | OQ-1 (CC/Courtyard/Phygitals marketplaces + PSA-APR realized) |
| Expected default/forfeit rate | pilot; pawn analog (~85% repay → ~15% forfeit; forfeits profitable at low LTV) |
| Reserve ratio (I-9) | run this model on real inputs (start ~10–15% hypothesis) |

## 13.7 Bottom line
The economics **work** under fixed-term v1 **only with the tighter, drawdown-justified bands
(A ≤ 40 / B ≤ 35 / C ≤ 20)** and a live, larger reserve invariant (I-9) — because the buyback buffer is
gone. The margin of safety is now **four stacked buffers — proven-liquidity gate, haircut appraisal,
conservative LTV, short duration — plus the reserve**, not a vendor's revocable buyback. **60% on the
high end would spend a safety margin this asset class demonstrably needs;** ~40% is the right launch
ceiling, with a data-earned path to 45–50% later.
