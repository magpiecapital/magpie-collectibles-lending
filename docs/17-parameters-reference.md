# 17 · Parameters Reference (single source of truth)

Every tunable parameter in the strategy, consolidated. **Launch values are conservative starting
points** to be calibrated with real data (OQ-1/2/3) before any capital — they are *design defaults,
not final*. Where a later doc tightened an earlier one, the tighter value wins (noted).

## 17.1 Eligibility gates
| Parameter | Launch value | Source |
|---|---|---|
| Graders accepted | PSA, CGC only (BGS/SGC later; never ungraded) | [doc 2.1](02-valuation-oracle.md) |
| Cert verification | required (grader cert lookup) | doc 2.1 |
| Vault authentication attestation | required | doc 2.1 |
| Min realized comps (bare gate) | ≥2 in 12mo AND ≥1 in 6mo | doc 2.3 |
| Min comps for a real loan | **≥5 comps / ≥3 sellers / ≥2 venues** (scales with size) | doc 2.3 (F-3) |
| Independent source required | **≥1 non-eBay (PSA APR)** | [doc 12.3](12-data-sourcing.md) (I-7) |
| Tamper-flag | excludes | doc 2.1 (T-4) |
| $ floor (min appraised value) | TBD (set where liquidation economics work) | doc 3.1 |

## 17.2 Valuation / oracle
| Parameter | Launch value | Source |
|---|---|---|
| Value model | Card-Ladder-style: last-sold × index ratio, recency-weighted | [doc 2.2](02-valuation-oracle.md) |
| Central tendency | median / trimmed-mean of comp window | doc 2.4 |
| Staleness haircut | 5:0% · 4:5% · 3:15% · 2:30% · 1:ineligible | doc 2.4 |
| Thin/index-projected haircut | +10–20% | doc 2.4 |
| Divergence (comp vs buyback) | **continuous haircut; hard-refuse ~15%** (not a 25–30% band) | doc 2.5 (F-10) |
| Appraised Value (origination) | `min(haircut independent-comp mark, CC buyback quote)` | doc 2.6 |
| Marking cadence (fixed-term v1) | **origination + renewal only** (no live MtM) | [doc 12.4](12-data-sourcing.md) |
| Up-mark rule (if MtM layer) | requires fresh card-specific multi-seller comp, persistence, per-day + cumulative cap | doc 2.4 (I-11) |
| Down-mark rule (if MtM layer) | applies immediately; confirmation lag before triggering liquidation | doc 2.4 (F-8/F-6) |

## 17.3 Underwriting / LTV / terms
| Parameter | Launch value | Source |
|---|---|---|
| **LTV — Tier A** (blue-chip vintage, dense comps, L1 only) | **≤50%** (operator-set 2026-08-04; reserve-covered at the tail) | [doc 13.2](13-economic-model.md) |
| **LTV — Tier B** (liquid graded, L2) | **≤40%** (operator-set 2026-08-04) | [doc 13.2](13-economic-model.md) |
| **LTV — Tier C** (thin/modern/reprint, L3) | **≤25% or exclude** (operator-set 2026-08-04) | [doc 13.2](13-economic-model.md) |
| **Liquidity boundary buffer** (anti tier-flip) | dispersion must be ≤ tier threshold × (1 − **0.15**) to grant the tier; borderline → conservative tier | T-17 / I-12 ([prototype](../prototype/README.md)) |
| Loan duration | 30–90 days, fixed | [doc 10.4](10-fixed-term-v1-spec.md) |
| Interest (APR) | ~10–14%, tiered, no origination fee | doc 13.4 |
| Maintenance/liquidation trigger (MtM layer only) | ~70% live LTV, independent-comp mark | doc 3.4 (I-1/F-4) |
| Renewal | re-appraise (new origination), no auto-rollover | doc 10.4 |
| Cure/grace window | short (24–48h), only if buyback covers debt | doc 3.4 / 10.5 |

## 17.4 Liquidation
| Parameter | Launch value | Source |
|---|---|---|
| Primary exit | CC buyback (~85–90% of reference) | [doc 4.2](04-liquidation-risk.md) |
| Fallback | marketplace/physical **graduated Dutch, non-make-whole reserve price + anti-snipe** | doc 4.2 (I-5/F-6) |
| Circuit-breaker | halt originations if buyback rate/availability drops or diverges | doc 4.3 (T-3) |
| Settlement | surplus→borrower; shortfall→reserve; never socialized | doc 4.2 (I-9) |

## 17.5 Caps & reserve
| Parameter | Launch value | Source |
|---|---|---|
| Per-card cap | ~2–5% of book (conservative/absolute denominator) | [doc 4.4](04-liquidation-risk.md) (I-6/F-11) |
| Per-identity/character cap | enforced; ambiguous → same (correlated) bucket | doc 4.4 (F-11) |
| Total lane cap | small (pilot), grows with observed performance | doc 4.4 |
| Cap enforcement | continuous (origination + repay + liquidation) | doc 4.4 (I-6) |
| Reserve (I-9) | ≥ modeled worst-case aggregate shortfall; ~5–10% book hypothesis | [doc 13.3](13-economic-model.md) |
| Reserve-exhaustion behavior | halt + orderly wind-down (never socialized loss) | doc 4.4 (I-9) |
| Withdrawal controls (if pooled) | utilization-based limits / notice periods | doc 4.5 |

## 17.6 Structure decisions (gate Phase 0)
| Decision | Recommended default | Source |
|---|---|---|
| Capital model | **P2P/offerbook** (securities-safer) vs curated pool | [doc 14.2](14-legal-regulatory.md) / 10.6 |
| Liquidation model (v1) | **fixed-term, no price-liquidation** | [doc 10](10-fixed-term-v1-spec.md) |
| Custody | non-custodial (contracts hold collateral) | doc 14.4 (I-3) |
| Legal structure | SPV/trust + perfected liens (UCC Art 9 + 12) | doc 14.6 |

## 17.7 Governance of parameters
- Risk-parameter changes go through **timelock + multisig** (T-10); no privileged change to an
  existing loan's terms without explicit logged authorization.
- All values above are **calibration targets** — the real numbers come from Phase 1 data
  ([doc 16](16-build-plan.md)); do not treat any as final until re-run on live inputs.

## 17.8 Invariants (enforced always) — quick index
I-1 loan ≤ LTV×AV (origination) / maintenance uses independent comp · I-2 collateral locked
(conditional on CC lien) · I-3 no self-transfer · I-4 eligibility · I-5 no make-whole liquidation peg
· I-6 caps continuous · I-7 structural source independence + fail-closed favors protocol · I-8
validate every input · I-9 reserve ≥ worst-case shortfall · I-10 index manipulation-monitored · I-11
borrowing-power increases need fresh card-specific comps, bounded. Full text: [doc 5](05-threat-model.md).
