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

## 4.2 The liquidation waterfall
Triggered by any of: **maturity default**, **maintenance-LTV breach (~70%)**, or
**eligibility loss** (value went stale, cert flagged, buyback pulled).

1. **Primary — Collector Crypt buyback.** Execute the standing on-chain buyback
   (~85–90% of CC reference, ~2% fee). Fast, cheap, deterministic. Because we lent
   ≤50% of an already-haircut AV, buyback proceeds almost always cover principal +
   interest with cushion. This is the base case and it should be the vast majority
   of liquidations.
2. **Fallback — marketplace, graduated Dutch markdown with a reserve.** If the buyback
   is unavailable (paused, rate-cut below a floor, or the card is ineligible for
   buyback), list on Collector Crypt's marketplace / Magic Eden starting near the mark
   and **stepping the price down over a short, bounded window until it clears.** We
   accept a graduated markdown; we do **not** hold illiquid collateral hoping for a bid
   (BendDAO's fatal choice). **But not floorless (finding F-6):** the auction carries a
   **non-make-whole reserve price tied to the independent comp mark** (e.g. floor at a
   defined fraction of independent AV) plus **anti-snipe protection (commit-reveal)**. This
   is fully compatible with the BendDAO invariant (I-5), which forbids only a *make-whole*
   peg — not a sane reserve. And because a **third party** can grief-trigger a
   liquidation to snipe the auction, the down-mark that triggers liquidation gets the
   same anti-manipulation + **confirmation lag** as an up-mark (finding F-6).
3. **Settlement.** Proceeds repay principal + interest + liquidation cost. **Surplus
   returns to the borrower.** Any **shortfall is absorbed by the reserve/insurance
   fund** — never by other borrowers' collateral, never by socialized loss that
   triggers a run.

## 4.3 The circuit-breaker (counterparty defense)
The buyback is Collector Crypt's, not ours. We monitor it **live**:
- Track the published buyback **rate** and **availability** per card / globally.
- If the rate drops below a threshold, buybacks pause, or CC's reference diverges
  hard from independent comps → **halt new originations immediately** (existing loans
  continue, liquidations route to the marketplace fallback).
- Total exposure is capped (below) so that **even if the buyback disappears entirely**,
  we can offload the whole book through the marketplace over a reasonable window
  without breaching the reserve.

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
