# 6 · Architecture (for when it's built)

Design-only. This maps the strategy to components and shows where each invariant
([doc 5](05-threat-model.md)) is enforced. Reuses Magpie's existing patterns
(screening, non-custodial vaults, delegated liquidation, bot execution).

## 6.1 Components

```
                    ┌─────────────────────────────────────────────┐
                    │  Valuation Oracle Service (off-chain)        │
   comp providers → │  • card identity resolve {grader,grade,...}  │
   (eBay/PSA/       │  • realized-comp mark (Card Ladder method)   │ ──signed AV──┐
    Card Ladder)    │  • staleness/thin haircuts, outlier reject   │              │
                    │  • buyback divergence cross-check            │              │
                    └─────────────────────────────────────────────┘              │
   Collector Crypt ─── on-chain buyback quote (read from canonical program) ──────┤
                                                                                  ▼
  ┌────────────┐    borrow/repay     ┌───────────────────────────────────────────────┐
  │  Borrower  │ ──────────────────▶ │  Lending Program (on-chain, Solana)           │
  │ (collector)│ ◀────────────────── │  • enforces I-1…I-8                            │
  └────────────┘    card returned    │  • NFT Vault PDA (locks collateral, I-2/I-3)   │
                                     │  • origination caps (I-6), sanity bounds (T-11)│
                                     └───────────────────────────────────────────────┘
                                                    │ liquidation trigger
                                                    ▼
                    ┌─────────────────────────────────────────────┐
   Liquidation Bot │ waterfall: CC buyback → marketplace Dutch     │ → proceeds → repay,
   (off-chain,     │ markdown; circuit-breaker; reserve settlement │   surplus→borrower,
    Magpie stack)  │                                              │   shortfall→reserve
                    └─────────────────────────────────────────────┘
```

## 6.2 Where invariants live
- **NFT Vault PDA** enforces **I-2 (lock)** and **I-3 (no self-transfer)** — collateral
  cannot leave except via a valid liquidation. Verify pNFT freeze/delegate.
- **Lending Program** enforces **I-1 (loan ≤ LTV×AV)**, **I-4 (eligibility)**,
  **I-6 (caps)**, and **T-11 sanity bounds** on the oracle-posted AV.
- **Oracle Service** produces AV but is **semi-trusted**: the program bounds it, and
  it's cross-sourced (**I-7**) and validates inputs (**I-8**).
- **Liquidation Bot** implements the **non-make-whole waterfall (I-5)** and the
  circuit-breaker; reuses Magpie's priority-fee/rebroadcast/RPC-failover reliability.

## 6.3 Reused Magpie infrastructure
- **Screening philosophy** → the card eligibility gate (fail-closed on inclusion).
- **Cross-sourced pricing / divergence-reject** → the comp oracle + buyback cross-check.
- **Non-custodial vault + delegated (liquidation-only) authority** → the NFT vault.
- **Liquidation/exit engine, priority fees, rebroadcast, RPC failover** → the liquidation bot.
- **Exploit/defense catalog + adversarial review discipline** → the threat model gate.

## 6.4 What's genuinely new (and needs building/auditing)
1. **NFT (pNFT) custody + redemption-lock** — Magpie has only custodied fungible SPL.
2. **The comp-oracle service** — realized-sales ingestion, identity resolution,
   robustness rules; the hardest and most security-critical new piece.
3. **On-chain read of the Collector Crypt buyback** and the marketplace-fallback path.
4. **Per-identity/character concentration accounting** (correlated collateral).

## 6.5 Build phases (gated)
1. **Spikes** — close the four open questions ([doc 7](07-open-questions.md)).
2. **Oracle prototype** — off-chain, read-only; back-test valuations vs actual CC
   sales; red-team a manipulation.
3. **Program + vault** — with the redemption-lock invariant proven on testnet.
4. **Audit + economic simulation** — [pre-mainnet checklist](05-threat-model.md).
5. **Tightly-capped pilot** — small total cap, blue-chip allowlist, kill-switch,
   manual review on high-value cards; graduate only after clean originations AND at
   least one clean buyback-path liquidation.
