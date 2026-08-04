# 13 · Economic Model & Stress Test

Turns the strategy into numbers: do the LTV bands, the **resale recovery** rail, and the reserve keep
the book solvent through a verified-magnitude drawdown? All figures are **illustrative model inputs**
for sizing, not forecasts — plug real data (OQ-1) before committing capital.

> **Rebuilt 2026-08-04 for the OQ-3 reality ([doc 19.2](19-oq-closeout.md)):** the Collector Crypt
> buyback is NOT a reliable liquidation rail (Gacha-only, 72h, off-chain — no standing bid on a held
> card), so the earlier ~87% buyback assumption is **removed**. Recovery is modeled on **graduated
> marketplace resale + burn-to-physical resale** of a **proven-liquid** item ([doc 21](21-liquidity-eligibility-proof-of-sale.md)),
> assuming **zero buyback**. Model applies to [fixed-term v1](10-fixed-term-v1-spec.md).

## 13.1 Recovery math on a single defaulted loan (no buyback)
Notation: `AV` = appraised value at origination (already haircut, = min(independent realized comp,
issuer quote)). Loan = `LTV × AV`. Over the term the item's value moves by `d` (drawdown = `d<0`). At
default we recover by **selling the proven-liquid item**, netting a fraction `βᵣ` of *current* value
after all costs.

```
current_value = AV × (1 + d)
recovery      ≈ βᵣ × current_value                 # βᵣ already net of resale/consignment/shipping fees
covered  ⇔  recovery ≥ Loan × (1 + r·t)            # principal + interest over term
```

**`βᵣ` (net resale recovery)** — no buyback floor: marketplace graduated markdown ≈ **0.75–0.85** normal
/ **0.65–0.75** thin-bear; burn-to-physical + consignment ≈ **0.80–0.87** but slow (weeks). **Base-case
planning `βᵣ = 0.75`**, stressed to **0.65**.

**Per tier at the chosen bands** (verified drawdowns from [doc 9](09-data-spike-results.md); `βᵣ=0.75`):

| Tier | LTV | Worst term-drawdown `d` | Recovery `βᵣ·(1+d)·AV` | vs Loan | Self-covers to `d` = | Worst-case status |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| **A (chosen)** | **50%** | −45% | `0.75·0.55 = 0.41·AV` | ~0.50·AV | **−33%** | ⚠️ −0.09·AV → **reserve** |
| A (alt) | 40% | −45% | `0.41·AV` | ~0.40·AV | −47% | ✅ self-covers |
| A (rejected) | 60% | −45% | `0.41·AV` | ~0.60·AV | −20% | ❌ big loss |
| **B (chosen)** | **40%** | −55% | `0.75·0.45 = 0.34·AV` | ~0.40·AV | −47% | ⚠️ −0.06·AV → reserve |
| **C (chosen)** | **25%** | −70% | `0.75·0.30 = 0.225·AV` | ~0.25·AV | −67% | ⚠️ −0.025·AV → reserve |

## 13.2 The LTV decision (operator, 2026-08-04)
**Chosen launch bands: A ≤ 50% · B ≤ 40% · C ≤ 25%.** (Recommendation had been ≤40 top; operator set
the Tier-A ceiling at **50%** — a defensible middle between the ≤40 self-covering line and the ≤60 I
advised against.) What 50% means, honestly:
- **50% self-covers a term-drawdown down to ~−33%.** Beyond that — into the verified −45% blue-chip
  worst case — the ~9%-of-AV shortfall is **absorbed by the reserve (I-9)**, not self-covered. That is
  an acceptable, *deliberate* use of the reserve **provided** it's sized for it (§13.4) and 50% is
  **gated to only L1 highly-liquid Tier-A** (weekly-selling blue-chips, densest comps) on the
  **shortest terms** — never extended down-tier.
- **It stays well clear of 60%**, which only survives a <20% drawdown — untenable for an asset class
  with 45–70% peak-to-trough and 12–25%/72h hype reversals ([doc 15](15-collector-ux-gtm.md)).
- **It sits at/below the RWA-equity band** (Magpie V3 stocks 50–70%): a single graded card is more
  volatile and far thinner to liquidate than tokenized equities, so parity-at-the-top (50% vs equities'
  50% floor) is the ceiling, not a starting point.
- **Buyback is NOT a buffer** (OQ-3). The margin of safety is now four stacked buffers — **proven-
  liquidity gate ([doc 21](21-liquidity-eligibility-proof-of-sale.md)), haircut appraisal, conservative
  LTV, short duration — plus a larger reserve.** 50% spends a bit of the LTV buffer, so the reserve and
  the liquidity gate must be correspondingly strict.
- **Guardrail:** do not raise 50% further, and do not apply it below L1, until real book data (OQ-1) +
  ≥1 clean resale-liquidation proving `βᵣ` + demonstrated reserve adequacy are in hand.

## 13.3 Why fixed-term + short duration matters here
`d` is the drawdown **over the loan term**, not peak-to-trough over years. A 30–90d term caps `d` far
below the multi-year −45%/−70% figures. Short terms make the bands comfortable in the median case while
the reserve covers the tail — and because there's no mid-loan margin call, a *slow* physical-resale
recovery is fine (no forced fire-sale).

## 13.4 Book-level stress test (BendDAO scenario, run against us — ZERO buyback)
Scenario: hobby-wide crash, **all** collateral −40–70% within a term, resale thin (`βᵣ→0.65`), **no
buyback at all**.
- At A50/B40/C25 with `βᵣ=0.65`, **every tier leans partly on the reserve at the worst case** (50% is
  reserve-covered beyond −33%). This is by design — but it makes reserve sizing the load-bearing number.
- **Reserve (invariant I-9): start hypothesis ~10–15% of book** (raised from the old 5–10%, because the
  buyback buffer is gone AND the top tier is reserve-covered at the tail). Validate on real data;
  originations **auto-halt if the ratio degrades**; exhaustion → orderly wind-down (never socialized loss).
- **Concentration caps** (per-card ≤ a fraction of trailing realized volume, per-character, total lane,
  per-platform — [doc 21](21-liquidity-eligibility-proof-of-sale.md) §21.5) keep any single position or
  correlated bucket from breaching the reserve alone. With a 50% top tier, the **per-card and
  per-character caps get tighter**, not looser.

## 13.5 Revenue & break-even
Per loan: `revenue = r·t·Loan + fees`; `cost = default_rate × loss_given_default + recovery cost +
capital + ops`. Conservative LTV on **proven-liquid** collateral keeps median-case recovery ≥ loan, so
loss-given-default is contained even without a buyback. **Rate:** on-chain card lenders ~9–10%; TradFi
13–15%+fees. Launch APR **~10–14%** (tiered) beats TradFi and prices in appraisal + slower recovery.
**Margin is safety, not spread.**

## 13.6 Parameters to calibrate with real data (before any capital)
| Parameter | Source to close it |
|---|---|
| Per-tier term-drawdown `d` | OQ-2 (have market-level; need term-window + per-tier distribution) |
| **Net resale recovery `βᵣ` + time-to-clear** | OQ-1 (marketplace depth) + a real liquidation; whisky/watch analogs |
| Per-tier liquidity / time-to-sell | OQ-1 (CC/Courtyard/Phygitals marketplaces + PSA-APR realized) |
| Expected default/forfeit rate | pilot; pawn analog (~85% repay → ~15% forfeit; profitable at low LTV) |
| Reserve ratio (I-9) | run this model on real inputs (start ~10–15% hypothesis) |

## 13.7 Bottom line
The economics **work** under fixed-term v1 with the operator-chosen bands **A ≤ 50 / B ≤ 40 / C ≤ 25**
— but 50% is a deliberate spend of the LTV buffer, so it holds **only** with (a) 50% gated to L1
highly-liquid Tier-A, (b) a **larger reserve (~10–15%)** because the buyback buffer is gone and the top
tier is reserve-covered at the tail, and (c) the strict proven-liquidity gate. The margin of safety is
**proven-liquidity + haircut appraisal + conservative LTV + short duration + reserve** — not a vendor's
revocable buyback. Earn any increase above 50% with real data; never loosen a buffer to chase volume.
