# 13 · Economic Model & Stress Test

Turns the strategy into numbers: do the LTV bands, the buyback backstop, and the reserve actually
keep the book solvent through a verified-magnitude drawdown? All figures are **illustrative model
inputs** for sizing, not forecasts — plug real data (OQ-1/OQ-3) before committing capital.

> Model applies to the [fixed-term v1](10-fixed-term-v1-spec.md): one appraisal at origination, no
> mid-loan liquidation, settle at maturity via buyback → physical resale.

## 13.1 Recovery math on a single defaulted loan
Notation: `AV` = appraised value at origination (already haircut, = min(independent comp, buyback)).
Loan = `LTV × AV`. Over the term the card's true value moves by `d` (a drawdown is `d<0`). At default
we recover through the CC buyback at ~`β` of *current* value (β ≈ 0.85–0.90), net of fees `f`
(buyback ~4% platform; marketplace ~2%; withdrawal 2%).

```
current_value   = AV × (1 + d)
recovery        ≈ β × current_value × (1 − f)
covered  ⇔  recovery ≥ Loan × (1 + r·t)         # principal + interest over term
```

**Worst-case per tier** (using the verified drawdowns from [doc 9](09-data-spike-results.md), β=0.87,
f≈6%, interest small over a 30–90d term):

| Tier | LTV | Modeled worst term-drawdown `d` | Recovery vs loan | Covered? |
|------|:---:|:---:|---|:---:|
| A | 50% | −45% (blue-chip ~halved in 2022–23) | `0.87·0.55·0.94·AV = 0.45·AV` vs `~0.50·AV` | **~break-even → thin loss** |
| A | **40%** (recommended launch) | −45% | `0.45·AV` vs `~0.40·AV` | ✅ **covered** |
| B | 40% | −55% | `0.87·0.45·0.94·AV = 0.37·AV` vs `~0.40·AV` | ⚠️ **short → reserve** |
| B | **35%** | −55% | `0.37·AV` vs `~0.35·AV` | ✅ **covered** |
| C | 25% | −70% | `0.87·0.30·0.94·AV = 0.245·AV` vs `~0.25·AV` | ⚠️ **razor-thin** |

**Key finding:** the doc-3 headline bands (A 50 / B 40 / C 25) are **too aggressive against the
*verified* worst-case drawdowns** once buyback fees are included. **Recommended launch bands are
one notch tighter: A ≤40%, B ≤35%, C ≤20% or exclude.** This is the single most important number in
the whole strategy — it's set by real drawdown history, not optimism. (The looser bands only work if
OQ-1 shows the specific tokenized cards are more liquid / less volatile than the market — prove it first.)

## 13.2 Why fixed-term + short duration matters here
The `d` above is the drawdown **over the loan term**, not peak-to-trough over years. A 30–90d term
caps `d` far below the multi-year −45%/−70% figures — those are the *absolute* worst case if a crash
lands entirely within one term. Short terms are what make even the tighter bands comfortable in the
median case while surviving the tail.

## 13.3 Book-level stress test (the BendDAO scenario, run against us)
Scenario: a hobby-wide crash lands, **all** collateral drops ~40–70% within a term, **and** the CC
buyback is degraded (paused or rate-cut → circuit-breaker halts new loans; recoveries route to slow
physical resale at a markdown).
- With launch LTVs (A40/B35/C20) and the buyback backstop, **most loans still self-cover**; losses
  concentrate in the thin tiers and in the buyback-off tail.
- **Reserve must cover the residual (invariant I-9).** Rough sizing: if modeled tail loss is `L%` of
  the book under the joint stress, `reserve ≥ L% × book`. Illustratively, a 5–10% reserve-to-book
  ratio is a starting hypothesis to validate with the real drawdown/liquidity data; **originations
  auto-halt if the ratio degrades**, and reserve exhaustion → orderly wind-down (never socialized loss).
- **Concentration caps** (per-card 2–5%, per-character, total lane) ensure no single position or
  correlated bucket can breach the reserve alone.

## 13.4 Revenue & break-even (does the book make money?)
Per loan: `revenue = r·t·Loan + any fees`; `cost = expected_default_rate × expected_loss_given_default
+ liquidation/recovery cost + capital cost + ops`.
- Because loans are **over-collateralized with a buyback backstop**, **loss-given-default is small**
  in the median case (recovery ≥ loan), so the book is profitable at modest rates *provided* LTVs are
  set per §13.1.
- **Rate benchmark:** competitors sit at ~9–10% (CC) with no origination fee; TradFi 13–15% + fees.
  A launch APR in the **~10–14%** range (tiered) beats TradFi, is competitive on-chain, and prices in
  the higher operational/appraisal cost of curated underwriting.
- **The margin is safety, not spread.** The book is designed so it makes steady interest in normal
  times and **survives** the tail — not to maximize yield by pushing LTV.

## 13.5 Parameters to calibrate with real data (before any capital)
| Parameter | Source to close it |
|---|---|
| Per-tier term-drawdown `d` | OQ-2 (have market-level; need term-window + per-tier distribution) |
| Buyback rate β, fees f, availability | OQ-3 (CC vault terms + divergence history) |
| Per-tier liquidity / time-to-sell (fallback recovery) | OQ-1 (CC native marketplace + PSA APR) |
| Expected default rate | pilot data; TradFi analog (pawn ~85% repay → ~15% forfeit, but forfeits are profitable at low LTV) |
| Reserve ratio (I-9) | run this model on real inputs |

## 13.6 Bottom line
The economics **work** under the fixed-term model **only with the tighter, drawdown-justified LTV
bands (A≤40 / B≤35 / C≤20)** and a live reserve invariant (I-9). The margin of safety comes from
three stacked buffers — **haircut appraisal, conservative LTV, and the ~85–90% buyback floor** — not
from any single one. Do not loosen any buffer to chase volume; the verified 40–70% drawdowns are the
reason each exists.
