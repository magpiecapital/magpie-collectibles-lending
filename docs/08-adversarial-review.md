# 8 · Adversarial Review (red-team) & Resolutions

A hostile red-team pass was run against the design (oracle × underwriting ×
liquidation × caps × counterparty). It surfaced **11 findings** — 2 Critical, 5 High,
4 Medium — that the original threat model missed or under-defended. **All are
resolved below**, with the fixes folded into docs 2–5 and captured as new
invariants/threats. This is a design-stage review; the [pre-mainnet checklist](05-threat-model.md)
still requires an independent smart-contract audit + live economic simulation.

> **Dominant theme:** three "independent" defenses — our eBay-derived comp mark,
> Collector Crypt's eBay-derived buyback reference, and the thin eBay-fed category
> index — are all downstream of the **same manipulable venue (eBay)**. One correlated
> eBay wash campaign moves all three together, so "defense-in-depth" and
> "cross-sourced" collapse unless we force *structural* source independence.

| ID | Severity | Finding | Resolution | Where |
|----|----------|---------|-----------|-------|
| **F-1** | Critical | **Divergence check is circular** — comp mark and CC buyback both derive from eBay, so a wash campaign moves both and the check passes when it should fire. | Require ≥1 realized-comp source **structurally independent of eBay** (auction-house hammer: PWCC/Heritage/Goldin, or a non-eBay index constituent). Divergence check must be against a non-eBay source. New **I-7** independence rule. | doc 2.5, T-12, I-7 |
| **F-2** | Critical | **Index-manipulation vector** — value rides a set/character index daily; per-card robustness rules never touch the index, so moving the (thin) index inflates *every* card keyed to it and bypasses per-card caps. | Monitor the index like a card (outlier/velocity), cross-check vs a 2nd independent index, **cap index-only drift** to borrowing power, and treat index exposure as one concentration bucket. New **T-13**, **I-10**. | doc 2.2/2.4, T-13 |
| **F-3** | High | **Min-comp gate (2 sales) is below what the robustness rules need** — can't take a median / outlier-reject / multi-seller from 2 comps; "where possible" is a loophole; the >6mo confidence row contradicts the 6mo gate. | Real loans require **≥5 comps from ≥3 sellers across ≥2 venues** (scales with size); multi-seller is **mandatory**. A 2-sale card is Tier-C-max/ineligible. Fixed the confidence-band contradiction. | doc 2.3/2.4 |
| **F-4** | High | **`AV=min(comp,buyback)` weaponizes the counterparty** — CC cutting its reference forces live-LTV over the maintenance trigger on healthy loans, dumping them into the (now-degraded) fallback. | `min(comp,buyback)` for **origination only**. **Maintenance mark uses the independent comp** (haircut); a buyback drop is an origination-halt/circuit-breaker signal, not an instant maintenance shock; hysteresis + independent confirmation before liquidating an existing loan. Split **I-1**. | doc 2.6, doc 3.4, T-14 |
| **F-5** | High | **Redemption-lock (I-2) isn't enforceable for the physical leg** — physical redemption is CC's off-chain process; our on-chain NFT lock doesn't bind it, so a card can be withdrawn while the NFT stays "locked" → claim on an empty vault. | Hard integration precondition: **CC's redemption path must read & honor our on-chain lien** (reject redeeming a lien-flagged token), backed by legal agreement. Until proven, **I-2 is downgraded from invariant to open dependency** (OQ). | T-15, doc 7 |
| **F-6** | High | **Third-party grief-liquidation + floorless Dutch snipe** — T-7 only removed the *borrower's* incentive; a third party can force a low mark and snipe the floorless fallback auction (which runs exactly when the buyback floor is absent). | Apply the same anti-manipulation + **confirmation lag to *down*-marks** that trigger liquidation; give the Dutch fallback a **non-make-whole reserve price** tied to independent comp (compatible with I-5, which forbids only a *make-whole* peg) + anti-snipe (commit-reveal). | doc 4.2, T-7/T-16 |
| **F-7** | High | **Reserve adequacy is asserted, not invariant** — nothing binds reserve ≥ modeled worst-case aggregate shortfall; reserve-exhaustion behavior (socialize? halt? run?) is undefined. | New **I-9**: `reserve ≥ modeled_worst_case_aggregate_shortfall`, recomputed continuously; **auto-halt originations** on degradation; explicit reserve-exhaustion = halt + orderly wind-down (never silent socialization). Monitor reserve-drawdown velocity (grief bleed). | doc 4.4/4.5, I-9 |
| **F-8** | Med-High | **Nightly symmetric marking** → wash-then-borrow before detection; and a borrower can induce feed-disagreement to freeze a favorable stale AV. | **Asymmetric marking:** down-marks apply immediately; **up-marks (more borrowing power) require persistence across N recomputes / cooldown**. Fail-closed on an open loan favors the **protocol** (stuck feed → review/de-risk, never a frozen favorable mark). Intraday spot-checks on high-value cards. | doc 2.4, T-11 |
| **F-9** | Med | **Per-day sanity bound defeated by a slow sub-threshold ramp**, camouflaged by index drift. | Add a **cumulative trailing-window bound** on borrowing-power appreciation; require **fresh card-specific multi-seller comp** (not index drift alone) to unlock the top of a card's AV. New **I-11**. | doc 2.4, T-11 |
| **F-10** | Med | **25–30% divergence band is huge and binary** — 29% overvaluation accepted at full AV; a cliff to sit under. | Replace binary flag/refuse with a **continuous haircut scaling with divergence**, hard-refuse at a tighter cap (~15%); tighten once OQ-3 measures real CC-vs-comp divergence. | doc 2.5/2.6 |
| **F-11** | Med | **Caps checked only at origination, denominated in a gameable dynamic book** — inflate the book to raise absolute ceilings; shrinking book silently breaches; undefined character/correlation taxonomy splits one exposure into many buckets. | Enforce caps **continuously** (re-check on repay/liquidation); cap against a **conservative/absolute denominator**, not a boom-inflatable book; specify the identity/correlation taxonomy, **defaulting ambiguous cases to the same (correlated) bucket**. | doc 4.4, I-6 |

## New / amended invariants (added to [doc 5](05-threat-model.md))
- **I-1 (split):** origination uses `min(comp, buyback)`; the **maintenance** mark uses the independent comp only.
- **I-2 (downgraded):** redemption-lock is an invariant **only once** CC honors the on-chain lien on the physical leg; until then it's an open dependency (OQ).
- **I-7 (strengthened):** cross-sourcing must be **structurally independent** — ≥1 confirming source not derived from the venue supplying the primary mark.
- **I-9 (new):** `reserve ≥ modeled worst-case aggregate shortfall`, enforced continuously; halt + wind-down on exhaustion.
- **I-10 (new):** the category index is itself manipulation-monitored and cross-checked; pure index drift has a capped contribution to borrowing power.
- **I-11 (new):** any increase in borrowing power requires fresh, card-specific, multi-seller comp support (not index drift, not a single print) and is bounded per-day **and** cumulatively.

## Status
Design hardened against F-1…F-11. Still required before mainnet: independent
smart-contract audit, live oracle red-team on testnet data, and the economic
stress simulation (40–70% drawdown + buyback-off + concurrent withdrawals) proving
**I-9** holds. See the [pre-mainnet checklist](05-threat-model.md).
