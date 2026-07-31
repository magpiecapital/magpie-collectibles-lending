# 3 · Underwriting & LTV

Underwriting turns an Appraised Value (from [doc 2](02-valuation-oracle.md)) into a
safe loan. The governing idea: **we do not survive a card crash on LTV alone — we
survive on short duration + daily mark-to-market + early liquidation.**

## 3.1 Collateral tiers
Cards are tiered by liquidity + volatility + reprint risk. The tier sets the max LTV
and the required comp depth.

| Tier | Description | Examples | Max LTV | Comp requirement |
|------|-------------|----------|:------:|------------------|
| **A** | Iconic vintage WOTC blue-chips, high grade, dense fresh comps, finite supply | Base Set Charizard PSA 9/10, 1st-ed/shadowless holos | **≤ 50%** | strong: multiple fresh comps |
| **B** | Established, regularly-traded graded cards | liquid vintage in mid grades, durable modern chase | **≤ 40%** | meets the ≥2/yr, ≥1/6mo gate comfortably |
| **C** | Thin, volatile, reprint-exposed, or index-projected value | low-pop modern, off-grade, sparse comps | **≤ 25%** or exclude | barely meets gate; extra haircut |
| **Ineligible** | Fails identity/eligibility | ungraded, non-PSA/CGC, no live buyback, tamper-flag, below $ floor, fails comp gate | **—** | — |

The **$ floor** (a minimum AV to be eligible, e.g. the lower bound where comps are
meaningful and liquidation is worth the gas/fees) is a launch parameter — small,
illiquid cards are excluded because their liquidation economics don't work.

## 3.2 Max loan
```
max_loan = LTV_tier × AV
```
AV already embeds the staleness/thin haircuts and the buyback cross-check. So the
effective advance rate against a card's *headline* market value is materially below
the LTV number — that double-conservatism (haircut the value AND cap the LTV) is
the first line of defense.

## 3.3 Loan terms (attractive, but bounded)
- **Duration: 30–90 days.** Short by design — it caps how far the market can move
  against us within a single loan. Renewals re-underwrite at the current AV.
- **Interest:** APR set by tier/risk; must clear expected loss + liquidation cost +
  reserve contribution. (Not a fixed number here — a parameter, sized so the book is
  profitable after realistic default/liquidation costs.)
- **No rehypothecation.** The physical card sits in the vault; the NFT sits locked in
  the loan vault. We never lend the collateral out.

## 3.4 Mark-to-market & the maintenance trigger (the real protection)
- The oracle recomputes the mark **daily** for every open loan.
- **Live LTV = outstanding (principal + accrued interest) / maintenance mark**, where the
  **maintenance mark is the independent comp value only** — *not* `min(comp, buyback)`.
  ⚠️ **Finding F-4:** using the `min()` for maintenance would let Collector Crypt (or a
  reference-manipulator) walk its buyback number down and force healthy loans over the
  trigger into a degraded fallback. So `min(comp, buyback)` gates **origination** (doc 3.2),
  while a **buyback drop only halts new originations** (circuit-breaker) and requires
  **independent-comp confirmation + hysteresis** before it can ever liquidate an open loan.
- **Maintenance threshold ~70%.** If live LTV breaches it (because the card fell, or
  a fresh comp repriced it down, or the value went stale), the loan enters the
  liquidation waterfall ([doc 4](04-liquidation-risk.md)) **immediately** — we sell
  before it goes underwater, not after.
- **Grace / margin-call option (collector-friendly):** a short cure window (e.g.
  24–48h) to top up or partially repay before liquidation, *only* if the buyback
  floor still comfortably covers the debt during the window. Never a grace window
  that risks the principal.

### Worked example
Tier-A card, headline market ~$10,000, last sale 3 weeks ago (confidence 4 → 5%
haircut). CC buyback quote ~$8,700.
- `comp_mark = 10,000 × 0.95 = 9,500`
- `AV = min(9,500, 8,700) = 8,700`
- `max_loan = 50% × 8,700 = 4,350`

The card would have to fall **~50% from headline** before the ~70% maintenance
trigger even approaches the debt — and the buyback floor recovers ~85–90% of
*current* value the whole way down. That is the cushion.

## 3.5 Why not higher LTV to attract more collectors?
Because the market drops 40–70% and can go no-bid. Every extra point of LTV is paid
for in tail losses. We compete on **certainty, speed, keeping-your-card, and honest
pricing** — not on the highest advance rate. A lender that offers 70% LTV on
Pokémon cards is advertising its future insolvency.
