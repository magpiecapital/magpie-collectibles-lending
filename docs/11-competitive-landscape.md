# 11 · Competitive Landscape & Positioning

The [spike](09-data-spike-results.md) established Magpie would **not** be first to lend against
physical graded cards. This doc maps who's already here, on what terms, and where Magpie wins.

## 11.1 On-chain incumbents (Solana, same collateral)

### Jupiter — Offerbook (the direct blueprint)
- **Model:** permissionless **P2P** money market; borrow/lend USDC at **fixed rates**, **user-defined
  1–30 day** terms, **no price-based liquidations, no price oracles.** Borrower + lender agree on
  amount, collateral, rate, LTV, term; terms hold for the loan's life.
- **Cards:** accepts **Collector Crypt** (+ Phygitals) **tokenized graded slabs** as collateral
  since June 2026 — fixed-term, no price-based liquidation in the initial phase.
- **Takeaway:** validates our [fixed-term v1](10-fixed-term-v1-spec.md). Their weakness = pure P2P
  liquidity depends on lenders showing up; UX is a marketplace, not instant borrow.

### Collector Crypt — native lending
- **Model:** lending against its own vaulted cards; targets **~9–10% interest, no origination fees,
  enter/exit at will** (flexible, not locked into terms).
- **Positioning claim:** explicitly undercuts web2 collectible lending (which it cites at **40–50%
  LTV, 6–12 month terms, 13–15% interest**).
- **Takeaway:** CC is both the **rail** (buyback/vault) and a **competitor**. Rate bar to beat/match
  ≈ **9–10%**, no origination fee. CC controls the vault + buyback → a structural advantage we must
  design around (counterparty risk, [T-3](05-threat-model.md)).

### Loopscale — generalized fixed-rate order-book lending
- **Model:** Solana **order-book**, fixed-rate loans, customizable terms, **any tokenized asset**;
  ~$480M beta volume; up to **80% LTV for stablecoins** (asset-dependent, lower for volatile/illiquid).
- **Takeaway:** infrastructure that *could* list card markets; a fixed-rate matching venue. Not
  card-specialized on underwriting — our edge is card-specific screening/appraisal.

## 11.2 TradFi / web2 collectible lenders (the incumbents being disrupted)
| Lender type | LTV | Term | Rate | Notes |
|---|---|---|---|---|
| Trading-card loans (Qollateral, JM Bullion, Vault Netwrk) | **40–60%** (some 40%) | 6–12 mo | **13–15%** + origination fees | Lloyd's-insured custody; manual appraisal |
| Luxury watches (Borro, Beverly Loan) | 50–80% (modern 65–75%, vintage 55–65%) | months | varies | mature asset-backed market |
| Designer handbags | Hermès 65–75%, Chanel 40–60% | months | varies | brand-tiered |
| Pawn (general) | item-dependent | short | **60–240% APR** | 85% national repayment rate; the true "no-liquidation, keep-or-forfeit" analog |

**Read:** the physical card-loan market clears at **~40–60% LTV** — our **≤50% Tier-A / ≤40% Tier-B /
≤25% Tier-C** bands are **at/below market and conservative**, which is the point. On-chain lenders
(CC ~9–10%, no fees) already **beat TradFi's 13–15% + fees** — so rate competitiveness is table
stakes, and safety/curation is the real differentiator.

## 11.3 Where Magpie wins (positioning)
1. **Underwriting discipline, not just a venue.** Loopscale/Offerbook are neutral matching rails;
   Magpie brings **card-specific screening + a conservative, multi-source appraisal with a genuinely
   independent (PSA APR) anchor** ([doc 12](12-data-sourcing.md)). We say *no* to the long tail on
   purpose — that curation is the product.
2. **Instant, pooled UX** (term-matched) vs pure P2P orderbook liquidity that depends on a
   counterparty showing up ([doc 10.6](10-fixed-term-v1-spec.md)).
3. **Execution reliability.** Magpie's priority-fee / rebroadcast / RPC-failover settlement stack
   makes repayment/settlement/liquidation robust under congestion — a real edge for time-sensitive
   maturity settlement.
4. **Honest, transparent valuations.** Real sold-comps, published methodology, no listing-based
   fantasy pricing — trust as a moat in a market with a documented manipulation history.
5. **Safety as the brand.** Conservative LTV + reserve + caps + the hardened threat model, positioned
   for collectors who want liquidity **without** risking their card to a manipulation-driven fire sale.
6. **Reliance-on-CC hedge.** Because CC is both rail and rival, Magpie's independent PSA-APR appraisal
   + physical-resale fallback reduce dependence on CC's buyback/index — a differentiator *and* a risk
   control.

## 11.4 Risks to the competitive thesis
- **CC vertical integration:** CC owns the vault, buyback, and a lending product — it can favor its
  own rail. Mitigate via independent appraisal + physical fallback + capped counterparty exposure.
- **Commoditization:** if fixed-term card lending becomes a race to highest LTV / lowest rate, margins
  compress. Compete on curation/safety/UX, not on out-lending on LTV (that path is future insolvency).
- **Liquidity fragmentation:** multiple venues split lender liquidity. Pooled term-matched capital
  and a good borrower funnel matter.

## Sources
- [Jupiter Offerbook — Phemex](https://phemex.com/news/article/jupiter-exchange-launches-offerbook-p2p-lending-platform-on-solana-85958) · [Jupiter docs](https://docs.jup.ag/user-docs/earn/offerbook)
- [Collector Crypt lending ~9–10%, no origination fee](https://solanacompass.com/learn/Lightspeed/collector-crypt-onchain-capital-markets-on-solana-tuomas-holmberg)
- [Loopscale — order-book fixed-rate, up to 80% stables](https://solanacompass.com/projects/loopscale)
- [TradFi card loans 40–60% LTV](https://qollateral.com/luxury-collateral-loans/rare-collectibles/trading-cards/) · [luxury asset LTVs](https://borro.com/what-can-you-borrow-against-luxury-asset-class-guide-2026/)
