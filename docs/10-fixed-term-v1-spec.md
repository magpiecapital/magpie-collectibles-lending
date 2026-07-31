# 10 · Fixed-Term v1 Spec (the recommended launch model)

**This is the recommended v1.** The [data spike](09-data-spike-results.md) showed the live
incumbents (Jupiter Offerbook, Collector Crypt's own lending) launched with **fixed-term,
oracle-less, no-price-liquidation** loans against physical graded cards — and that model
**removes most of the Critical/High attack surface** the [threat model](05-threat-model.md)
defends. The full mark-to-market design (docs 2–5) becomes an *optional later layer*, not launch.

> **Reminder ([README](../README.md)):** the collateral is the **physical card**; the Collector
> Crypt token is only the custody handle. We underwrite the physical card's value.

## 10.1 The model in one paragraph
A borrower locks a tokenized physical card as collateral and takes a **fixed-term USDC/SOL loan**
(fixed rate, fixed duration, fixed LTV set at origination). **There is no mid-loan mark-to-market
and no price-based liquidation.** The terms hold for the life of the loan. At maturity the borrower
**repays and reclaims the card, or defaults and the lender takes the collateral** and recovers via
the Collector Crypt buyback → physical resale. Simple, oracle-light, and immune to the
wash-trade-to-force/dodge-liquidation attacks.

## 10.2 Why fixed-term is the right v1 (threats it neutralizes by construction)
| Threat (from doc 5) | Status under fixed-term |
|---|---|
| T-1 oracle wash/shill → borrow inflated | **Bounded** — only a *single origination appraisal* matters, done conservatively with review; no repeated live mark to game |
| T-7 / T-16 liquidation gaming, grief-liquidation, Dutch snipe | **Eliminated for the term** — there is no mid-loan liquidation to trigger |
| T-14 counterparty walks buyback down to force liquidation | **Eliminated** — no maintenance trigger to hit |
| F-1 circular (eBay) divergence check driving liquidations | **Downgraded** — independence still matters for the origination appraisal, but a bad mark can't cascade into a forced sale |
| F-4 `min(comp,buyback)` maintenance weaponization | **N/A** — no maintenance mark |
| T-5 / F-5 redemption-while-locked | **Still required** (lock the token for the term) — proven live by incumbents |
| **New exposure: duration risk** | The lender holds a fixed-term claim through a possible drawdown with no early exit → **managed by short terms + low LTV + the buyback backstop** (below) |

Net: we trade a large, hard-to-defend live-oracle/liquidation surface for a **single, bounded
duration risk** we control with conservative parameters. That is a very good trade for v1.

## 10.3 Origination
1. **Eligibility** ([doc 2.1](02-valuation-oracle.md), [doc 3.1](03-underwriting-ltv.md)): PSA/CGC
   graded, cert-verified, vault-attested, not tamper-flagged, above the $-floor, and meeting the
   **real-comp depth gate** (≥5 realized comps / ≥3 sellers / ≥2 venues for a real loan; see F-3).
2. **Appraisal (one-time, conservative):** `AV = min( independent realized-comp mark , CC buyback
   quote )`. The comp mark **must include ≥1 source structurally independent of eBay** — **PSA
   Auction Prices Realized** (multi-house) is the anchor (see [doc 12](12-data-sourcing.md)),
   cross-checked against eBay-derived feeds and the buyback. Apply the staleness + thin haircuts.
3. **Max loan = LTV_tier × AV** (bands below), with the origination-time caps ([doc 4.4](04-liquidation-risk.md)).
4. **Lock:** the token is locked in the vault PDA for the full term; the physical card cannot be
   redeemed until repayment (invariant I-2 / open dependency OQ-5, proven live by incumbents).

## 10.4 Terms
- **Duration:** short, fixed. Launch range **30–90 days** (incumbent Offerbook allows 1–30d; we
  favor slightly longer to be collector-friendly while capping drawdown exposure). Renewals
  **re-appraise** at the current AV — a renewal is a new origination, not an automatic rollover.
- **Rate:** fixed for the term, **no origination fee**, benchmarked to the market (Collector Crypt
  targets ~9–10%; web2 collectible lenders charge 13–15% with fees — see [doc 11](11-competitive-landscape.md)).
  Set per tier so the book clears expected loss + recovery cost + reserve contribution ([doc 13](13-economic-model.md)).
- **LTV bands** (on AV; validated by the verified ~40–70% drawdowns, where even blue-chips ~halved):
  | Tier | Max LTV | Rationale |
  |------|:------:|-----------|
  | A (blue-chip vintage, dense comps) | **≤50%** | a blue-chip can fall ~40–50% over a term; 50% + buyback backstop still recovers |
  | B (liquid graded) | **≤40%** | thinner + more volatile |
  | C (thin/modern/reprint-exposed) | **≤25% or exclude** | can fall 60–70%; only lend low or not at all |

  These sit at/below the TradFi card-loan market (typically 40–60% LTV) — we compete on safety,
  speed, keeping-your-card, and honest pricing, not on the highest advance rate.

  > ⚠️ **The [economic model](13-economic-model.md) recommends launching one notch tighter —
  > A ≤40% · B ≤35% · C ≤20%** — because against the *verified* worst-case drawdowns (blue-chip
  > ~−45%, thin ~−70%) plus buyback fees, the 50/40/25 bands only break even. Use the tighter
  > bands at launch; loosen only if OQ-1 proves the specific tokenized cards are more liquid/less
  > volatile than the market.

## 10.5 Maturity & settlement (no mid-loan liquidation)
- **Repay in full → card unlocked and returned.** The normal, desired path.
- **Default at maturity (or a short grace):** the lender takes the collateral and recovers via the
  **liquidation waterfall** ([doc 4](04-liquidation-risk.md)) — **CC buyback primary**, then
  **physical auction/consignment** fallback (never a floorless NFT dump; the buyback pays physical
  value). Because we lent ≤50% of a haircut AV, buyback proceeds (~85–90% of current value) almost
  always clear the debt with cushion **even after a drawdown over the term**.
- **Surplus → borrower; shortfall → reserve fund** ([I-9](05-threat-model.md)). No socialized loss.
- **Optional soft protection (collector-friendly, still no forced liquidation):** an at-maturity
  cure window and partial-repay/extend option, priced so the buyback floor always covers the debt.

## 10.6 Capital model — P2P vs pooled
- **Incumbent pattern = P2P offerbook** (lender and borrower match on amount/rate/LTV/term). Pros:
  no protocol liquidity risk, no bank-run vector (each loan is a matched term claim). Cons: liquidity
  depends on lenders showing up; UX is a marketplace.
- **Magpie option = pooled/term-matched lender capital** with the **withdrawal controls + reserve
  (I-9)** from [doc 4.5](04-liquidation-risk.md), giving instant borrow UX. Because loans are
  **fixed-term**, the pool is naturally **term-matched** (no on-demand redemption of illiquid
  collateral → the BendDAO run vector is structurally weaker than in a mark-to-market pool).
- **Recommendation:** launch **term-matched pooled** for UX, keep total lane cap small, and require
  the reserve invariant I-9. Consider a P2P/offerbook option later for large/bespoke cards.

## 10.7 What v1 deliberately does NOT do
- No mid-loan mark-to-market or price liquidations (that's the optional later layer).
- No long-tail cards (comp-gate + tiering exclude them).
- No reliance on NFT-market floors for value or exit.
- No high LTV to win volume — safety first.

## 10.8 Differentiation vs incumbents
Not first to market → win on: **curated, screened eligibility** (fail-closed data-quality gate),
**conservative multi-source appraisal with a genuinely independent (PSA APR) anchor**, **execution
reliability** (Magpie's priority-fee/rebroadcast/RPC-failover stack for settlement), **transparent
honest valuations**, and **instant pooled UX** vs a pure P2P orderbook. See [doc 11](11-competitive-landscape.md).

## Sources
- [Jupiter Offerbook docs](https://docs.jup.ag/user-docs/earn/offerbook) · [Phemex — Offerbook P2P, no oracles, 1–30d](https://phemex.com/news/article/jupiter-exchange-launches-offerbook-p2p-lending-platform-on-solana-85958)
- [Loopscale — fixed-rate order-book lending](https://solanacompass.com/projects/loopscale)
- [Collector Crypt on-chain lending (~9–10%, no origination fee)](https://solanacompass.com/learn/Lightspeed/collector-crypt-onchain-capital-markets-on-solana-tuomas-holmberg)
