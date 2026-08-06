# 27 · Sold-Comp Verification Runbook — proving what EXACTLY sells, before any loan

> Operator mandate (2026-08-06): *"figure out what EXACTLY sells. Go through all the marketplaces
> like eBay, etc., and find successful sales of the same collectible before determining if it's good
> enough for a loan. We don't want to provide loans for stuff that isn't liquid."*
>
> This is the operational procedure that turns the [doc 21](21-liquidity-eligibility-proof-of-sale.md)
> proof-of-sale gate into a **step-by-step due-diligence check run on every item before every loan.**
> It is the [doc 24](24-oracle-prototype-spec.md) oracle's job in production; this doc is the human-
> readable SOP, the "what a careful underwriter actually does." Design-stage; the production version runs
> on the licensed feeds ([doc 22](22-realized-sales-venue-comp-data-map.md)/[doc 23](23-outreach-briefs-psa-fanatics.md)).

## 27.1 The rule, stated plainly
**No loan is originated against a collectible until we have verified — across multiple real marketplaces —
that the EXACT item (same card, same set, same variant, same grade, same grader) has SOLD, repeatedly and
recently, at prices that agree.** Not "is listed at." Not "book value." Not "a similar card." **Sold.**
If we can't prove it sells, we decline — every time.

## 27.2 What counts as a "successful sale" (precise definition)
A qualifying sale is a **completed, arm's-length, realized transaction** of the **exact-identity** item:
- ✅ A closed auction hammer or accepted best-offer with a recorded price + date, on a real marketplace.
- ❌ **NOT** an active listing / ask / "buy it now" that never sold.
- ❌ **NOT** a cancelled, returned, or unpaid sale.
- ❌ **NOT** a wash cluster (same seller printing the same price repeatedly) or a private, untraceable transfer.
- ❌ **NOT** a different grade or variant (a PSA 10 sale does not prove a PSA 9's value, and vice-versa).

## 27.3 The per-item procedure (run for EVERY loan)
```
1. IDENTITY      Resolve the exact {grader, grade, cert #, set, card #, variant, language}.
                 Verify the cert against the grader's population database.
2. PULL SOLD     From EACH marketplace/source (§27.4), pull REALIZED SOLD results ONLY, keyed to the
                 exact identity + grade. Never active listings.
3. NORMALIZE     Tag every sale: {price, date, venue, corpus, seller, source}. De-duplicate cross-posted sales.
4. CLEAN         Drop wash/round-number/same-party clusters + MAD outliers (doc 21 §21.4, PS-6).
5. GATE          Require ALL of (doc 21 §21.2):
                   • ≥ 5 realized sales in trailing 12 mo AND ≥ 2 in trailing 90 d
                   • ≥ 3 distinct sellers · ≥ 2 distinct venues
                   • ≥ 1 sale from an eBay-INDEPENDENT corpus (Heritage / Fanatics-PWCC / a non-eBay house)
                   • proven value ≥ the $ floor
                 ANY miss → DECLINE (record the reason).
6. MARK          Value = recency-weighted trimmed median of the clean sales. Dispersion = IQR/median.
7. TIER          Classify L1/L2/L3 by frequency + recency + dispersion (doc 21 §21.3), boundary-buffered
                 (T-17/I-12). Below L3 → DECLINE.
8. CROSS-CHECK   If an issuer FMV/quote exists, refuse if it sits > 15% above the independent mark.
9. DECIDE        APPROVE at the tier's LTV against the marked value, or DECLINE with a specific reason.
10. LOG          Store the exact comps used (venue/date/price) with the loan, for audit + re-review.
```
Fail-closed at every step: missing or thin evidence is a decline, not a "maybe."

## 27.4 Where to find SOLD data, per marketplace (and its independence tag)
| Source | Get the SOLD data by… | Corpus / independence |
|---|---|---|
| **eBay** | Filter **Sold / Completed** listings (not active); or Marketplace Insights API (licensed) | eBay (**not** independent) |
| **TCGplayer** | Sold / price-history per exact product | eBay-owned (not independent) |
| **130point** | Aggregated eBay sold incl. best-offer-accepted | eBay (not independent) |
| **PSA Auction Prices Realized (APR)** | Realized results by set/card/grade/cert | **Multi-house — independent slice usable** |
| **Card Ladder / Market Movers** | Sales history per exact card | Multi-house *(same parent as PSA APR — count once)* |
| **Heritage Auctions** | Prices-realized archive | **Independent (own auction house)** |
| **Fanatics Collect / PWCC** | Auction / sales-history results | **Independent (Fanatics-owned, non-eBay)** |
| **Goldin** | Auction results | eBay-owned (**not** independent) |

**Independence is by CORPUS, not brand** (I-7, [doc 22.2](22-realized-sales-venue-comp-data-map.md)): eBay
owns eBay + TCGplayer + Goldin (one source); PSA APR + Card Ladder share a parent (one source). The
independent realized legs are **Heritage** and **Fanatics/PWCC** (and PSA-APR's non-eBay rows).

## 27.5 The liquidity bar (what "good enough for a loan" means)
- **L1 (Tier A, ≤50% LTV):** sells ~weekly (≥12/yr), last sale ≤14 d, tight dispersion, dense independent comps.
- **L2 (Tier B, ≤40%):** ~monthly (≥6/yr), last ≤30 d.
- **L3 (Tier C, ≤25%):** ~quarterly (≥4/yr), last ≤90 d.
- **Below L3, or failing any §27.3 gate → DECLINE.** "Priced high but rarely sells" is the exact profile we refuse.

## 27.6 Re-verification (liquidity is not permanent)
Run the full check **at every origination** — a card that was liquid last quarter may be thin now. Cache
comps only briefly; never lend on stale proof. If a segment's realized volume collapses, pause new
originations in that segment (circuit-breaker, [doc 4](04-liquidation-risk.md)).

## 27.7 Worked examples — the method on real cards (2026-08-06)
*(Filled from live cross-marketplace research — demonstrating PASS on the flagships and a deliberate
FAIL on an illiquid control, so the bar is concrete, not theoretical.)*

## 27.8 Ties
Operationalizes [doc 21](21-liquidity-eligibility-proof-of-sale.md) (the gate) using [doc 22](22-realized-sales-venue-comp-data-map.md)
(the venues) and [doc 24](24-oracle-prototype-spec.md) (the engine that runs it automatically), feeding
[doc 26](26-launch-allowlist.md) (a type is on the allowlist only if it clears this) and enforcing I-4 / I-7 / I-12.
