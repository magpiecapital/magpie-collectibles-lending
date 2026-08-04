# 16 · Build & Pilot Plan

The execution sequence that ties every prior doc into a gated path from *design* to a *tightly-capped
pilot*. **Each phase has an explicit gate; you do not advance until it's green.** Nothing here is a
commitment to deploy — it's the ordered plan for *if/when* we decide to build.

## 16.1 Phasing (gated)

### Phase 0 — Decide the structure (blocking, do first)
Two decisions gate everything downstream:
1. **Capital model: P2P/offerbook vs curated pool.** This is now a **securities-law decision**
   ([doc 14.2](14-legal-regulatory.md)), not just UX ([doc 10.6](10-fixed-term-v1-spec.md)). Get a
   securities opinion; the safer default is **P2P (users set terms)**.
2. **Liquidation model: fixed-term no-liquidation (v1) confirmed**, mark-to-market deferred to a
   later layer ([doc 10](10-fixed-term-v1-spec.md)).
**Gate 0:** structure chosen with counsel input; v1 = fixed-term.

### Phase 1 — Close the open questions (research/data, no code)
Run the remaining spikes ([doc 7](07-open-questions.md) / [doc 9](09-data-spike-results.md)):
- **OQ-4:** confirm PSA Public API commercial terms/rate limits; stand up the PSA-APR ingestion +
  card-identity resolver ([doc 12](12-data-sourcing.md)).
- **OQ-1:** pull per-tier liquidity for the *specific* Collector-Crypt-tokenized cards (CC native
  marketplace + PSA APR) → real numbers for LTV bands/caps.
- **OQ-3:** confirm the CC *vault* buyback terms, on-chain readability, and reference-vs-realized
  divergence history.
- **OQ-5:** the CC bailee/control agreement so a collateralized card's physical can't be redeemed +
  our lien is honored (also a [doc 14.6](14-legal-regulatory.md) legal item).
**Gate 1:** OQ-1/3/4 have usable numbers; OQ-5 has a signed path; economics ([doc 13](13-economic-model.md))
re-run on real inputs confirm the LTV bands hold.

### Phase 2 — Oracle prototype (off-chain, read-only)
Build the appraisal engine per [doc 2](02-valuation-oracle.md) + [doc 12](12-data-sourcing.md):
identity resolve → PSA-APR (independent anchor) + eBay-derived corroboration + on-chain buyback
read → robustness rules (median/outlier/staleness) → AV with the independence + divergence checks.
- **Back-test:** run it over historical CC-listed cards; compare AV to subsequent real sale prices
  and to buyback outcomes; tune haircuts.
- **Red-team it:** attempt a wash/shill + shared-source (eBay) + index manipulation on test data
  ([T-1/T-12/T-13](05-threat-model.md)); confirm the independent PSA-APR anchor holds.
**Gate 2:** the appraiser is conservative and manipulation-resistant on historical + adversarial data.

### Phase 3 — Program + vault (on-chain), with the lock invariant proven
Build the lending program + NFT vault PDA reusing Magpie's non-custodial vault/delegation patterns.
- Enforce the invariants with **on-chain enforcement points**: I-1 (loan ≤ LTV×AV, origination),
  I-2 (lock — verify pNFT freeze/delegate + the CC physical-lien honoring), I-3 (no self-transfer),
  I-4 (eligibility), I-6 (caps, continuous), I-9 (reserve), oracle sanity bounds (T-11).
- Fixed-term settlement path: repay→unlock; default→waterfall (buyback → physical resale).
**Gate 3:** every invariant I-1…I-11 has an enforcement point; testnet proves the lock + settlement.

### Phase 4 — Audit + economic simulation
- **Independent smart-contract audit** (vault, borrow/repay/settle, oracle interface).
- **Economic stress simulation** ([doc 13.3](13-economic-model.md)): 40–70% drawdown + buyback-off +
  concurrent withdrawals + grief-liquidation bleed; confirm **I-9** (reserve ≥ worst-case shortfall).
- **Legal sign-off** ([doc 14.10](14-legal-regulatory.md)): no open High regulatory items.
- **Threat-model sign-off** ([doc 5](05-threat-model.md)): no open Critical/High findings.
**Gate 4:** audit clean, sim solvent, legal + security signed off.

### Phase 5 — Tightly-capped pilot
- **Small blue-chip allowlist** (Tier-A only at first — the most liquid, best-comped cards).
- **Launch LTV bands A≤50 / B≤40 / C≤25** ([doc 13](13-economic-model.md)); 50% gated to L1 Tier-A only; short terms (30–90d).
- **Small total lane cap**, per-card/per-character caps, full reserve (I-9), **kill-switch**, manual
  review on every high-value card.
- **Circuit-breaker** wired to the CC buyback rate/availability ([doc 4.3](04-liquidation-risk.md)).
- Invite-driven cohort via investor-minded TCG communities ([doc 15](15-collector-ux-gtm.md)).

## 16.2 Graduation criteria (pilot → broader)
Advance **only** after **all** of:
- ≥ N clean originations with no eligibility/appraisal defects.
- **≥ 1 clean liquidation through the buyback path** (proves the exit actually works).
- Reserve health (I-9) intact throughout; no cap breaches.
- Appraisal back-test error within tolerance vs realized sale prices.
- No open Critical/High security or High legal items.
Then: widen the eligible set (Tier B), raise caps incrementally, and *only then* consider adding the
optional mark-to-market layer (docs 2–5) if there's demand for longer/larger loans.

## 16.3 Team / workstreams
| Workstream | Owns |
|---|---|
| **Data/oracle** | PSA-APR pipeline, identity resolver, appraisal engine, back-test/red-team |
| **Protocol** | vault + lending program, invariant enforcement, settlement |
| **Liquidation/ops** | buyback + physical-resale waterfall, circuit-breaker, reserve monitoring |
| **Legal** | structure, securities/lending/MSB, CC bailee agreement, licensing/geofence |
| **Risk** | LTV/caps/reserve calibration, stress sim, parameter governance (timelock/multisig) |
| **Growth** | pilot cohort, community, trust/transparency UX |

## 16.4 The one-line status
**We are at Phase 0/1:** strategy + threat model + spike complete; the next real work is closing OQ-4
(PSA-APR pipeline) and the Phase-0 structure decision with counsel. **No code, no pool, no mainnet.**
