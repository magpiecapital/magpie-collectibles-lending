# 26 · Launch Allowlist — Approved Collateral (Tier-A Pilot)

> The curated set of collateral the pool opens with, and the exact bar each item clears. Two gates,
> both mandatory: (1) an item's *type* must be on this **allowlist**; (2) the *specific* graded card
> (by cert #) must independently pass the live **proof-of-sale gate** ([doc 21](21-liquidity-eligibility-proof-of-sale.md))
> and receive an oracle appraisal ([doc 24](24-oracle-prototype-spec.md)) **at the moment of the loan**.
> Being a Charizard is not enough — *this* Charizard must prove it actually sells, right now.
>
> **Design-stage. No dollar figures are hardcoded here on purpose** — appraised values are set per-card
> by the licensed realized-sales feeds (PSA APR + Fanatics/PWCC, [doc 23](23-outreach-briefs-psa-fanatics.md))
> at onboarding, never asserted in advance. This document defines *what is eligible and why*, not what
> anything is "worth."

## 26.1 Vetting standard — every approved type must satisfy ALL of these
A card *type* earns a place on the allowlist only if it clears this checklist; a *specific* card then
re-clears the live gate at loan time.

| # | Criterion | Bar |
|---|---|---|
| V-1 | **Authentication** | Graded by **PSA / CGC / BGS / SGC**, cert-verified, held in a vetted vault ([doc 20](20-tokenization-platforms-collateral-sources.md)). No raw/ungraded. |
| V-2 | **Proven liquidity** | Clears [doc 21](21-liquidity-eligibility-proof-of-sale.md): ≥5 realized sales/12mo + ≥2/90d, ≥3 sellers, ≥2 venues, ≥1 **eBay-independent** corpus (PSA-APR/Heritage/Fanatics), keyed to exact {set, card #, variant, grade, cert}. |
| V-3 | **Realized-value integrity** | Value from the recency-weighted trimmed median of *real sales*, wash/outlier-rejected; no listing/index reliance; issuer FMV within the divergence band. |
| V-4 | **Drawdown-survivable** | Bear-market behavior known and priced into the LTV band ([doc 13](13-economic-model.md)); no card whose value is unproven through a downturn. |
| V-5 | **Finite / reprint-aware** | Vintage WOTC supply is fixed; explicit **reprint-risk** review (a card materially exposed to a re-release is excluded or down-tiered). |
| V-6 | **Not a one-of-one / trophy** | Must trade as a *population*, not a unique lot — uniqueness = no comps = uninsurable liquidation (see exclusions). |
| V-7 | **Above the $ floor** | Proven value ≥ the $250 floor after haircuts. |

## 26.2 Approved collateral — Launch set (candidate types; each cert re-gated at loan time)
Deliberately **small and vintage-WOTC-anchored** — the deepest, most-proven markets. English WOTC first;
Japanese equivalents and modern chase are **staged for later** (§26.4), not launch.

### Tier A — L1 (≤ 50% LTV): the most liquid vintage blue-chips, PSA/CGC/BGS **9–10**
| # | Card | Set (year) | Variants in scope | Eligible grades | Why it qualifies |
|---|------|-----------|-------------------|-----------------|------------------|
| A-1 | **Charizard #4/102** | Base Set (1999) | 1st Ed Shadowless · Shadowless · Unlimited | PSA/CGC/BGS 9–10 | The single most-traded vintage card; dense multi-venue realized comps in every grade. |
| A-2 | **Blastoise #2/102** | Base Set (1999) | 1st Ed Shadowless · Shadowless · Unlimited | 9–10 | Iconic starter holo; deep, regular sales. |
| A-3 | **Venusaur #15/102** | Base Set (1999) | 1st Ed Shadowless · Shadowless · Unlimited | 9–10 | Iconic starter holo; deep, regular sales. |
| A-4 | **Lugia #9/111** | Neo Genesis (2000) | 1st Ed · Unlimited | 9–10 | Blue-chip vintage chase with a consistent, liquid market. |

### Tier B — L2 (≤ 40% LTV): liquid, a notch thinner or more volatile
| # | Card | Set (year) | Variants | Eligible grades | Why it qualifies (and why B not A) |
|---|------|-----------|----------|-----------------|-----------------------------------|
| B-1 | **Base Set holo rares** (non-starter): Zapdos #16, Chansey #3, Mewtwo #10, Alakazam #1 | Base Set (1999) | 1st Ed Shadowless · Shadowless · Unlimited | 8–10 | Liquid, but thinner per-card than the starters → lower band. |
| B-2 | **Jungle / Fossil 1st Ed holos** (e.g., Scyther, Vaporeon, Gyarados, Lapras, Dragonite) | Jungle / Fossil (1999) | 1st Edition holo | 8–10 | Regular sales, but shallower + more grade-sensitive. |
| B-3 | **PSA/CGC/BGS 8** of any Tier-A card | — | as A-1..A-4 | 8 | Same iconic cards, lower grade = thinner comps + wider spread → down-tier. |

> **Grade discipline:** a card's *grade* sets its tier and its comps — a PSA 10 and a PSA 8 of the same
> card are two different collateral items, keyed and appraised separately. Below grade 8 → **excluded at
> launch** (comps too thin/volatile).

### Ready-now expansion — graded SPORTS cards (same V-1..V-7 standard)
Per [doc 28](28-addressable-collateral-universe.md), graded **sports cards** are the immediate #2 class:
realized-sales data is *equal or deeper* than Pokémon (PSA APR + Fanatics/Goldin auction results), and
sports is ~54% of the graded-card market. Verified in [doc 27.7](27-sold-comp-verification-runbook.md): a
**1986 Fleer Jordan #57 PSA 9** was the single strongest-liquidity card tested — dozens of realized sales/yr
across 6 venues with real eBay-independent auction comps. Iconic, densely-comped rookies first.

| # | Card | Year / set | Grades | Tier | Note |
|---|---|---|---|---|---|
| S-1 | **Michael Jordan #57 (RC)** | 1986 Fleer | 8–10 | A/B by grade | Benchmark modern RC; deepest multi-venue comps ([doc 27.7](27-sold-comp-verification-runbook.md)) |
| S-2 | **LeBron James #111 (RC)** | 2003-04 Topps Chrome | 9–10 | A/B | Iconic, densely-comped modern RC |
| S-3 | Other iconic densely-comped RCs (Brady, Trout, Kobe…) | — | 8–10 | B | Added only on demonstrated liquidity per the gate |

Independent realized-price venue for this class = **Fanatics Collect / Goldin** (deep, non-eBay).

> **Variant discipline — CRITICAL (a 10–50× value lever):** for vintage Pokémon the *printing* — **Unlimited
> < Shadowless < 1st Edition** — changes value by **10–50×** ([doc 27.7](27-sold-comp-verification-runbook.md):
> a 1st-Ed PSA 10 Charizard = $550k; the same-numbered *Unlimited* PSA 10 ≈ $15–29k). **Each variant is a
> SEPARATE collateral item**, keyed and appraised independently — the exact printing is read off the PSA
> cert before any loan. **Never** mark an Unlimited card off a 1st-Edition headline.

## 26.3 Explicitly EXCLUDED at launch (this is the close-vetting part)
| Excluded | Why |
|---|---|
| **Pikachu Illustrator, Trophy/No.1–3 Trainer, 1-of-a-kind promos** | Ultra-valuable but **one-of-few** — no population, no regular comps → cannot be reliably liquidated. **Value ≠ liquidity.** |
| **Ungraded / non-PSA-CGC-BGS-SGC** | No authentication anchor (V-1). |
| **Grades below 8** | Comp density + price spread too thin/volatile to underwrite. |
| **Modern chase & sealed** (e.g., Hidden Fates / Champion's Path Charizard, sealed boxes) | Liquid but **reprint- and hype-volatility-exposed** (V-5); staged for later, not launch. |
| **Long-tail / low-pop / sporadic-sale cards** | Fail the proof-of-sale gate (V-2) by construction. |
| **Cards with a divergent issuer FMV** or wash-flagged sales history | Fail V-3 integrity. |

## 26.4 Staged expansion (earned, not assumed)
Beyond the launch set, a type is added **only after it demonstrates sustained liquidity** and passes V-1..V-7
in review — governed by the automatic gate, not hand-added on request. Staging queue: **Japanese WOTC
equivalents** (Base "No Rarity"/Base Set Charizard, etc.) → **additional Neo/Gym vintage holos** → a
**closely-bounded set of modern chase** (only the most consistently liquid, at lower LTV, with reprint
monitoring). Each promotion is logged with its liquidity evidence.

## 26.5 Concentration caps at launch (correlated-risk control)
- **Per specific card (cert):** ≤ a small fraction of the book, and ≤ a fraction of *that card's* trailing
  realized volume ([doc 21 §21.5](21-liquidity-eligibility-proof-of-sale.md)).
- **Per character:** several approved types are **Charizards** (highly correlated) → a hard **aggregate
  Charizard cap**, plus per-character caps generally.
- **Per set / era:** cap Base-Set concentration so a single-set drawdown can't dominate the book.
- **Per platform:** each tokenization source is its own capped lane ([doc 20](20-tokenization-platforms-collateral-sources.md)).
- **Total lane:** a small pilot ceiling, sized to bear-market resale-absorption ([doc 13](13-economic-model.md)),
  behind the reserve (I-9).

## 26.6 Per-card onboarding flow (what "vetting closely" means operationally)
For **every** loan, even against an approved type:
1. **Identity + authentication** — cert verified, graded by an approved service, vaulted (V-1, I-4).
2. **Live proof-of-sale gate** — the *specific* card's own recent realized sales clear [doc 21](21-liquidity-eligibility-proof-of-sale.md) (V-2). No recent real sales → **declined**, even for an A-1 Charizard.
3. **Oracle appraisal** — conservative Appraised Value from licensed realized feeds, wash/outlier-rejected, staleness/thin/divergence-haircut ([doc 24](24-oracle-prototype-spec.md)).
4. **Tier + LTV** — assigned from the confirmed liquidity tier (50/40/25), with the boundary buffer (T-17/I-12).
5. **Caps check** — per-card / per-character / per-set / per-platform / total (§26.5).
6. **Originate** — fixed term; card locked in vault; no mid-loan liquidation.
A card is either **approved-type AND cert-gated-and-appraised**, or it is **declined**. There is no middle.

## 26.7 Governance & review
- **Monthly allowlist review:** re-verify each approved type still clears V-1..V-7 on fresh data; **down-tier
  or remove** any whose liquidity decays or that faces a reprint; add staged types only with logged evidence.
- **Reprint/market events:** an announced re-release or a structural liquidity shift triggers an
  **immediate review** of the affected types (originations can pause per-type without touching others).
- **Every change is logged** with its evidence, consistent with the protocol's transparency norm.

## 26.8 Honest caveats
- **Design-only; nothing deployed.** The allowlist is the *policy*; live eligibility + value are produced
  by the gate + oracle against **licensed realized data** at onboarding — not by any figure in this doc.
- The launch set is intentionally **small and conservative**; breadth is *earned* through demonstrated
  liquidity, never granted to chase volume. Picky by design.

## Sources
Vetting standard from [doc 21](21-liquidity-eligibility-proof-of-sale.md) (proof-of-sale) + [doc 24](24-oracle-prototype-spec.md)
(appraisal) + [doc 13](13-economic-model.md) (LTV/drawdown) + [doc 20](20-tokenization-platforms-collateral-sources.md)
(platforms) + [doc 9](09-data-spike-results.md) (verified vintage drawdowns). Card identities are public
catalogue facts; liquidity for each specific card is confirmed by the live gate, not asserted here.
