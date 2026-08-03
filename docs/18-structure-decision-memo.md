# 18 · Structure Decision Memo (Phase 0 — blocking)

> **Decision-ready memo, NOT legal advice.** This consolidates the structure question that
> [doc 16 Phase 0](16-build-plan.md) says must be answered *first*, so it can be signed off in one
> sitting with qualified securities counsel. It pulls together the securities analysis
> ([doc 14.2](14-legal-regulatory.md)), the fixed-term launch model ([doc 10](10-fixed-term-v1-spec.md)),
> the competitive reality ([doc 11](11-competitive-landscape.md)), and the economics
> ([doc 13](13-economic-model.md)) into a single **choose-one** decision. Nothing here is deployed.

---

## 18.1 The decision, in one sentence

**Who sets the loan terms (rate / LTV / eligible collateral / liquidation) — the two counterparties,
or Magpie?** That single choice cascades into securities exposure, licensing, engineering, and UX. It
is the gate on everything downstream, so it is decided before any code.

Two sub-decisions, but #1 dominates:
1. **Capital & term-setting model:** P2P / offerbook **vs** curated pool. *(This memo.)*
2. **Liquidation model:** fixed-term, no price-liquidation (v1) **vs** mark-to-market. *(Already
   recommended fixed-term for v1 in [doc 10](10-fixed-term-v1-spec.md); reaffirmed in §18.6.)*

---

## 18.2 The options

### Option A — P2P / Offerbook (users set their own terms)
Magpie is **neutral infrastructure**: a lender posts an offer (amount, rate, term, eligible card
set / max LTV), a borrower accepts, the contract escrows the tokenized card and disburses. Magpie
never sets the price of a loan, never pools lender capital into a managed book, never runs a
strategy. This is **Jupiter Offerbook's live model** — which already accepts Collector Crypt slabs
([doc 11](11-competitive-landscape.md)).

- **Securities posture (best).** Removes the SEC-named triggers ([doc 14.2](14-legal-regulatory.md)):
  no operator-set rates, no operator-set LTV/eligibility, no operator-run yield pool, no
  operator-managed liquidation thresholds. Individually negotiated, matched loans look far less like
  *Reves* notes or a *Howey* yield product.
- **MSB/MTL:** still must be genuinely **non-custodial** (I-3) — contracts hold collateral, users
  self-custody — but that's already core to the design ([doc 14.4](14-legal-regulatory.md)).
- **Pawn/usury:** each loan is a private secured loan; Magpie isn't the lender-of-record, which
  softens (does not erase) state pawnbroker-licensing questions. Counsel per state.
- **Trade-offs:** thinner/less predictable liquidity (needs lenders present and posting); worse
  "instant quote" UX; Magpie earns only a protocol/matching fee, not spread. Curation/safety is
  offered as an **optional tool** (a screen lenders *may* use), never as Magpie setting terms.

### Option B — Curated pool (Magpie sets terms, lenders deposit for yield)
Lenders deposit USDC/SOL into a Magpie-run pool; Magpie sets rates, LTV bands, the eligible-card
screen, and (in any MtM layer) liquidation thresholds; borrowers draw against the pool at those terms.

- **Securities posture (worst) ⚠️.** This is **exactly** the "curator-managed yield-pooling lending
  vault" the July 2026 SEC guidance flagged ([doc 14.2](14-legal-regulatory.md)): appointing a
  curator, setting risk parameters, selecting collateral, setting rates/LTV. A yield-bearing deposit
  token can itself be a security (*Howey*). **Highest registration/exemption burden.**
- **MSB/pawn:** Magpie is closer to being the lender/operator of record → stronger licensing pull.
- **Trade-offs:** best UX and deepest, most predictable liquidity (instant quotes, term-matched
  book); Magpie earns spread. But it carries the heaviest legal load and concentrates counterparty
  and run risk on Magpie ([doc 4](04-liquidation-risk.md) BendDAO lesson; needs I-9 reserve +
  withdrawal controls).

### Option C — Decentralized-parameter / governance-set (later, not launch)
Parameters set by governance / an on-chain rule set rather than a discretionary operator, to blunt
the "operator decides" trigger while keeping pooled UX. Real but heavier: needs credible
decentralization to actually move the securities analysis, and doesn't remove the yield-token
*Howey* question. **Park as a maturation path, not a v1 option.**

---

## 18.3 Side-by-side

| Dimension | A · P2P / Offerbook | B · Curated pool | C · Governance-set |
|---|---|---|---|
| **Securities trigger (SEC Jul-2026)** | **Lowest** — users set terms | **Highest** — the flagged pattern | Medium, only if *credibly* decentralized |
| **Yield-token / Howey risk** | Low (no pool token) | High (yield-bearing deposit) | Medium–High |
| **MSB / MTL pull** | Lower (non-custodial, not lender-of-record) | Higher | Medium |
| **Pawn / state licensing** | Softer (private loans) | Stronger | Medium |
| **Liquidity / UX** | Weaker — needs lenders posting | **Best** — instant, deep, predictable | Good |
| **Magpie revenue** | Protocol/matching fee | Spread (largest) | Spread/fee |
| **Run / counterparty concentration** | Distributed across lenders | Concentrated on Magpie | Concentrated |
| **Precedent on CC cards** | **Live** (Jupiter Offerbook) | Loopscale-style order-book adjacent | — |
| **Time-to-launch (legal)** | Fastest | Slowest | Slow |

---

## 18.4 Recommendation

**Launch as Option A — P2P / Offerbook — paired with the fixed-term, no-price-liquidation v1.**

Rationale:
1. **It is the safest securities posture by construction**, and securities is our single biggest
   exposure ([doc 14.2](14-legal-regulatory.md)). We do not want the flagship RWA product to launch
   into the exact structure a sitting commissioner named.
2. **It composes with the fixed-term model** ([doc 10](10-fixed-term-v1-spec.md)) to remove *both* the
   "operator sets rates/LTV" trigger *and* the "operator adjusts liquidation thresholds" trigger — and
   simultaneously eliminates most of the Critical/High **oracle→liquidation** threats
   ([doc 9](09-data-spike-results.md) pivot). One structural choice buys down both legal and security
   risk.
3. **It has live precedent on the exact collateral** (Jupiter Offerbook already lends against CC
   slabs), so it's proven feasible, not speculative.
4. **It fits Magpie's brand** — neutral, non-custodial infrastructure and *safety*, not
   highest-LTV/most-aggressive-yield ([doc 15](15-collector-ux-gtm.md)).

Magpie's edge in Option A is **not** setting terms — it's the **value-add layer on top**: the
independent PSA-APR-anchored appraisal ([doc 12](12-data-sourcing.md)) offered as a *screen/oracle
lenders can opt into*, curation, execution reliability, and the buyback→physical-resale liquidation
rail. We compete on **trust and data quality**, which is exactly the moat we can defend.

**The pooled model (Option B) is deferred, not discarded.** If, after a securities opinion, counsel
finds a workable exemption / registration / geofence path *and* the liquidity case justifies it, a
term-matched pool can be a later layer — but it is not the launch structure.

---

## 18.5 What counsel must confirm before Gate 0 is green

Give counsel this memo + [doc 14](14-legal-regulatory.md) and get written answers to:
1. **Does the Option-A P2P/offerbook structure, as described, avoid the *Reves* "note = security"
   characterization** given users set their own rate/LTV/term and Magpie takes only a matching fee?
   What specific features would tip it back into a security (e.g., Magpie posting default offers,
   auto-matching, a standardized rate)?
2. **Does the optional Magpie appraisal/screen** (a tool lenders may use) reintroduce an
   "operator-sets-eligibility" trigger, or is an *opt-in advisory* screen safe? How must it be framed?
3. **Any pooled/aggregated liquidity feature** (even lender-side convenience) — where's the line
   before it becomes a "yield pool"?
4. **Non-custodial confirmation** for MSB/MTL/BitLicense/CA-DFAL across the actual fund flows
   ([doc 14.4](14-legal-regulatory.md)).
5. **Pawn/lending licensing** per target state for privately-matched secured loans; which states to
   geofence at launch ([doc 14.3](14-legal-regulatory.md)).
6. **UCC perfection + CC bailee/control** so a matched loan has an enforceable lien (ties to
   [OQ-5 / doc 14.6](14-legal-regulatory.md)).

---

## 18.6 Liquidation sub-decision (reaffirmed)

**v1 = fixed-term, keep-or-forfeit, NO mid-loan price-based liquidation** ([doc 10](10-fixed-term-v1-spec.md)).
It legally reads as a **pawn analog** (< 4-month terms often outside TILA; our ~10–14% APR well under
state caps), and it removes the "operator adjusts liquidation thresholds" securities trigger and the
live-oracle→liquidation attack surface. Mark-to-market/maintenance liquidation ([docs 2–5](02-valuation-oracle.md))
is an **optional later layer**, gated on its own oracle red-team and a fresh securities look.

---

## 18.7 Decision record (to complete with counsel)

| Field | Value |
|---|---|
| Structure chosen | ☐ A (P2P/offerbook, recommended)  ☐ B (pool)  ☐ C (governance) |
| Liquidation model | ☐ Fixed-term v1 (recommended)  ☐ MtM |
| Securities opinion obtained | ☐ Yes — counsel/date: __________ |
| Open **High** regulatory items | ☐ None (required to pass Gate 0) |
| Geofence at launch | States/jurisdictions: __________ |
| Decided by / date | __________ |

**Gate 0 passes only when:** structure chosen *with a written securities opinion*, v1 liquidation =
fixed-term, and no open High regulatory items. Then → [Phase 1](16-build-plan.md) (close OQ-1/3/4/5).

## Sources
Carried from [doc 14](14-legal-regulatory.md) (SEC Jul-2026 curator-vault guidance; MSB/MTL/BitLicense/CA-DFAL;
pawn/usury; UCC Art 9/12) and [doc 11](11-competitive-landscape.md) (Jupiter Offerbook / Loopscale / CC-native precedents).
