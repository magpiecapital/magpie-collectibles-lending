# 4 · Liquidation & Risk Management

This is where lenders die. The design here is written directly against the
**BendDAO** failure — the canonical NFT-lending collapse.

## 4.1 The BendDAO lesson (what NOT to do)
BendDAO lent against NFTs with a liquidation mechanism **hard-coded to make the
protocol whole**: an 85% liquidation threshold, a 48-hour auction, and a **minimum
bid pegged to 95% of the OpenSea floor**. When floors fell, **no one would bid at
95% of a falling floor**, so liquidations didn't execute, bad debt accrued, and a
weekend **bank run drained reserves from ~10,000 wETH to as little as 5–15 wETH**
against ~15,000 ETH lent out. The team admitted it *"underestimated how illiquid
NFTs could be in a bear market."* Their emergency fix pointed the way: liquidation
threshold 85%→70%, auction 48h→4h, **removed the 95%-floor min-bid**, rates 100%→20%.

> "They don't allow the DAO to take a loss on anything, which as a result makes them
> take a loss on everything." — DeepNFTValue

**The rule we take from this: never hard-peg liquidation to a make-whole / near-floor
minimum. Allow graduated markdown to a real clearing price. Size everything for a
bear market with no bidders.**

## 4.2 The liquidation waterfall (v1 = fixed-term; recover by RESELLING what we proved is liquid)
> **Correction (OQ-3, [doc 19.2](19-oq-closeout.md)):** earlier drafts made the Collector Crypt
> buyback the *primary* exit at ~85–90%. **That was wrong.** CC's buyback is **Gacha-only, 72h-from-pull,
> off-chain, with NO standing bid for a held card** — and no tokenization platform ([doc 20](20-tokenization-platforms-collateral-sources.md))
> hands a lender a reliable liquidation bid. So the rail is **resale into the market we already PROVED is
> liquid at origination ([doc 21](21-liquidity-eligibility-proof-of-sale.md))** — never a dependency on an
> issuer buyback.

In v1 ([doc 10](10-fixed-term-v1-spec.md)/[doc 18](18-structure-decision-memo.md): fixed-term, no
mid-loan price-liquidation), the trigger is **maturity default** — the borrower didn't repay — not a
live-price margin call. On default, recover in this order:

1. **Opportunistic issuer buyback — only if actually available.** If the item's platform has a *live,
   applicable* buyback at that moment (e.g., **Courtyard's** instant buyback; almost never CC, which is
   Gacha-only), take it — fast and cheap. **Never assumed** — it's checked, and skipped when absent (the
   common case). This is a first-check convenience, not the plan.
2. **Primary — marketplace resale, graduated to a real clearing price.** Sell the tokenized card on its
   marketplace (CC / Magic Eden / Courtyard) starting near the independent realized mark and **stepping
   the price down over a bounded window until it clears.** This is viable *precisely because
   [doc 21](21-liquidity-eligibility-proof-of-sale.md) admitted only proven-liquid items* — things that
   demonstrably sell, repeatedly and recently. We accept a graduated markdown; we do **not** hold illiquid
   collateral hoping for a bid (BendDAO's fatal choice). **Not floorless (finding F-6):** a **non-make-whole
   reserve price** tied to the independent comp mark + **anti-snipe (commit-reveal)**; compatible with the
   BendDAO invariant (I-5), which forbids only a *make-whole* peg, not a sane reserve. Because a third party
   could grief-trigger, the down-mark gets the same confirmation lag as an up-mark.
3. **Secondary — burn-to-physical + physical resale.** If the on-chain marketplace is too thin to clear
   fairly, **redeem the token for the physical card** and sell it through the deep physical channels that
   [doc 21](21-liquidity-eligibility-proof-of-sale.md) already used as comps (eBay / Heritage / PWCC
   consignment). Slower (redemption SLA + consignment), which is exactly why v1 is **fixed-term + low LTV +
   reserve** — we can take our time instead of fire-selling.
4. **Settlement.** Proceeds repay principal + interest + cost. **Surplus → borrower.** Any **shortfall →
   reserve/insurance fund (I-9)** — never other borrowers' collateral, never socialized loss that triggers
   a run.

The whole waterfall is affordable because we lent **≤50% of an already-haircut AV** (top tier; less down-tier) on an item with
**proven, recent, multi-venue sales**. Even a graduated markdown or a physical-resale recovery clears
principal in the median case; the reserve covers the worst-case tail (the top tier is reserve-covered beyond a ~−33% term-drawdown — [doc 13](13-economic-model.md)). **Proven liquidity at origination IS the liquidation plan.**

## 4.3 The circuit-breaker (liquidity + counterparty defense)
We do **not** depend on any issuer buyback as a backstop (OQ-3). We monitor the **real
market's liquidity** and each **platform counterparty**, and we assume **zero buyback** in
sizing:
- **Segment-liquidity watch.** Track realized sales volume + time-to-sell for the segments
  we lend into. If a segment's liquidity falls below the [doc 21](21-liquidity-eligibility-proof-of-sale.md)
  proof-of-sale gate (frequency/recency collapse), **halt new originations** there; existing
  fixed-term loans ride to maturity and recover via resale/physical.
- **Per-platform counterparty watch.** Monitor each issuer ([doc 20](20-tokenization-platforms-collateral-sources.md)):
  custody-solvency signals, marketplace/redemption availability, admin-key or de-peg events
  (per [doc 19.2](19-oq-closeout.md)). Degradation at one platform → **pause that lane**; other
  lanes' caps unchanged. (No single custodian is a systemic dependency.)
- **Absorb-capacity sizing.** Total exposure is capped (below) so that **even with zero issuer
  buyback** — the realistic assumption — we can offload the whole book through marketplace +
  burn-to-physical resale over a bear-market window **without breaching the reserve**. This is
  the [doc 21](21-liquidity-eligibility-proof-of-sale.md) §21.5 absorb-capacity discipline applied
  at the book level.

## 4.4 Concentration & exposure caps
Sized so no single failure sinks the book (the bank-run defense). **Caps are enforced
continuously — re-checked on every origination, repay, and liquidation — not just at
origination (finding F-11):**
- **Per-card cap:** no single card (cert) exceeds ~**2–5%**, measured against a
  **conservative/absolute denominator** (or a floor book size), *not* a boom-inflatable
  live book an attacker can pump to raise the absolute ceiling.
- **Per-identity/character cap:** cap total exposure to any one card identity or
  character (all Base Set Charizards move together). The correlation taxonomy is
  **explicit**, and **ambiguous cases default to the same (correlated) bucket** — an
  attacker must not be able to split one Charizard exposure across grades/variants to
  dodge the cap (finding F-11). Correlated **index** exposure (finding F-2) is its own bucket.
- **Total lane cap:** a hard ceiling sized to **bear-market marketplace absorption
  capacity**, not boom liquidity. Starts **small** (pilot) and grows only as we
  observe real liquidation performance.
- **Reserve / insurance fund — INVARIANT I-9 (finding F-7):** `reserve ≥ modeled
  worst-case aggregate shortfall(current book)`, recomputed **continuously**;
  originations **auto-halt** when the ratio degrades. Reserve monitoring also tracks
  **drawdown velocity** so a stream of small grief-liquidations can't quietly bleed it.
  **Reserve exhaustion = halt + orderly wind-down, never silent socialized loss** (that
  socialization is what turned BendDAO's shortfall into a bank run).

## 4.5 Bank-run defense (if funded by a lender pool)
BendDAO's collapse was a **lender bank run**, not just bad collateral. If Magpie
funds these loans from a depositor pool:
- **Withdrawal controls:** utilization-based withdrawal limits / notice periods so
  depositors can't drain reserves faster than illiquid collateral can be liquidated.
- **Reserve targeting:** maintain a minimum liquid reserve ratio; pause new lending
  when it's breached.
- Prefer **protocol/operator-funded** or **term-matched** capital for the pilot to
  avoid the run vector entirely until liquidation is proven.

## 4.6 Risk register (top bottom-line risks → mitigations)

| # | Risk | Mitigation |
|---|------|-----------|
| R-1 | Illiquidity in a downturn (BendDAO) | short duration, low LTV sized to bear liquidity, graduated liquidation, caps, reserve |
| R-2 | Oracle manipulation (shill/wash) | multi-source realized comps, outlier reject, min-comp gate, buyback divergence check |
| R-3 | Counterfeit / tampered slab | PSA/CGC only, cert verify, vault attestation, redeem re-verify, tamper-flag exclude |
| R-4 | CC counterparty (buyback pulled/cut) | soft-floor treatment, live monitoring, circuit-breaker, marketplace fallback, capped exposure |
| R-5 | Concentration (whale card / character) | per-card & per-identity caps |
| R-6 | Correlated hobby-wide crash | total lane cap, reserve, conservative aggregate LTV |
| R-7 | Lender bank run | withdrawal controls, reserve targeting, term-matched capital |

## Sources
- BendDAO mechanics & collapse: [Atlantis Press case study](https://www.atlantis-press.com/proceedings/icedbc-25/126021740), [CoinDesk, 2022-08-22](https://www.coindesk.com/business/2022/08/22/bank-run-at-nft-lender-benddao-prompts-attempt-to-avert-another-liquidity-crisis), [Cointelegraph](https://cointelegraph.com/news/nft-lending-protocol-bend-dao-proposes-emergency-changes-amid-credit-crisis)
