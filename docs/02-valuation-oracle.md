# 2 · Valuation Oracle — pricing off real sales, never listings

The oracle is the heart of the system and its #1 attack surface. Its job: produce a
conservative, manipulation-resistant **Appraised Value (AV)** for one specific
graded card, or refuse.

## 2.1 Card identity resolution (before any pricing)
From the NFT metadata, resolve the exact key: **{grader, grade, set, card number,
variant, cert #}**. Then:
1. **Cert verification** — look up the cert on the grader (PSA/CGC) and confirm it
   matches the card and grade. Reject mismatch.
2. **Vault attestation** — confirm Collector Crypt / the physical vault (PWCC/ALT)
   attests the physical card is present and authenticated.
3. **Grader whitelist** — PSA and CGC only at launch (deepest comps, cleanest
   authentication). BGS/SGC later; never ungraded.

A card that fails identity resolution is **ineligible** — full stop.

## 2.2 The value model (Card Ladder methodology, adopted)
Professionals value a card as the **average price on the most recent day it
actually SOLD ("last sold"), anchored to a broader set/character index** so the
mark moves daily instead of freezing on a stale print. We adopt this exactly:

```
last_sold      = mean(realized sale prices on the most recent day the card sold)
index_ratio    = last_sold / index_value_on_that_day        # captured once
mark(today)    = index_ratio × index_value(today)           # moves daily with the category
```

- **Realized sales only.** Sold comps — never active listings. (eBay *sold*, PSA
  "Auction Prices Realized," PWCC/Goldin/Heritage realized, Card Ladder / Market
  Movers, 130point.)
- **Recency-weighted:** recent sales weigh more than old ones.
- **Nightly recompute** after the day's sales are validated.

## 2.3 The eligibility / liquidity gate (Card Ladder's rule, adopted verbatim)
A card carries a reliable index-based value only if:

> **≥ 2 realized sales in the trailing 12 months, AND ≥ 1 in the trailing 6 months.**

Below that threshold the card is **thin**: either **ineligible**, or (if we choose to
support it at all) valued via index-projection with a large extra haircut and a
lower LTV tier. We never rely on a projected figure for a thin card without that
penalty — the projection lags rapid repricing.

⚠️ **The 2-sale gate is a *floor*, not a lending standard (adversarial finding F-3).**
You cannot compute a median, reject an outlier, or require multi-seller from 2 comps —
so a card meeting only the bare gate is **Tier-C-max or ineligible**, never A/B. For any
loan above the $-floor, require **≥5 realized comps from ≥3 distinct sellers across ≥2
venues** (scaling up with loan size), and **multi-seller is mandatory** (not "where
possible"). A card that can only muster 2 hand-placed comps is exactly the cheap-to-
manipulate case, and gets the strictest treatment.

## 2.4 Robustness rules (anti-manipulation, applied to every mark)
1. **Median / trimmed-mean, not last-sale.** Compute the mark from a window of
   recent comps; use the median (or trimmed mean) so one shill/wash print can't move it.
2. **Outlier rejection.** Drop any comp deviating more than a set band from the
   median of the window.
3. **Multi-venue / multi-seller.** Require comps from more than one venue and more
   than one seller where possible. Distrust single-seller clusters (shill signal).
4. **Minimum comp count** per the gate above; more comps required for higher loan sizes.
5. **Staleness → confidence → haircut.** Adopt Card Ladder's 1–5 freshness meter and
   map it to a mandatory haircut:

   | Confidence | Last sale age | Haircut |
   |---|---|---|
   | 5 | ≤ 2 weeks | 0% |
   | 4 | 2 wk – 1 mo | 5% |
   | 3 | 1 – 3 mo | 15% |
   | 2 | 3 – 6 mo | 30% |
   | 1 | > 6 mo | **ineligible** (or Tier-C only, ≥50% haircut) |

6. **Thin/projected haircut.** If the mark is index-projected rather than backed by a
   fresh comp, add a further **10–20%** haircut.
7. **Monitor the INDEX itself (finding F-2).** The value model rides a set/character
   index daily, so a manipulated index inflates *every* card keyed to it while bypassing
   per-card checks. Apply the same outlier/velocity monitoring to the index series,
   **cross-check it against a second, independently-constructed index**, and **cap the
   contribution of pure index drift** to any card's borrowing power. Treat correlated
   index exposure as a single concentration bucket ([doc 4.4](04-liquidation-risk.md)).
8. **Asymmetric marking (findings F-8/F-9).** Down-marks apply **immediately** (protect
   the book). Up-marks that *increase borrowing power* require **fresh, card-specific,
   multi-seller comp support persisting across N recomputes / a cooldown** — never a
   single same-day print, never index drift alone — and are bounded **per-day AND
   cumulatively** over a trailing window (kills the slow-ramp of finding F-9). On an
   open loan, a stale/disagreeing feed **fails closed toward de-risking**, never toward
   a frozen favorable mark.

## 2.5 The Collector Crypt buyback: a soft floor, cross-checked — NOT the oracle
Collector Crypt publishes a standing on-chain buyback at ~85–90% of an eBay/ALT
reference. **We do not trust it as our valuation**, because that reference is:
- **CC-assigned at pull time, frozen, and self-indexed** — it can diverge from the
  live market, and it's a number we do not control.
- The 85/90% figures originate in CC's *Gacha-pack* product and may not equal the
  general graded-card **vault** buyback ([open question #3](07-open-questions.md)).

We use it two ways:
- **Divergence check — MUST be against a source structurally independent of eBay.**
  ⚠️ **Critical (adversarial finding F-1):** Collector Crypt's reference is *itself
  eBay/ALT-derived*, and our deepest comps are eBay-sold — they are **not independent**.
  A single eBay wash campaign moves both together, so a naive `comp_mark` vs `CC_buyback`
  check passes exactly when it should fire. Therefore the confirming leg of every
  divergence check must be a **non-eBay realized source** — auction-house hammer prices
  (PWCC/Heritage/Goldin) or a non-eBay index constituent. The divergence penalty is
  **continuous, not binary** (F-10): the haircut grows with divergence and hard-refuses
  at a tight cap (~15%), rather than accepting anything under a wide 25–30% band.
- **Liquidation floor:** it is the *primary exit* in the waterfall ([doc 4](04-liquidation-risk.md)),
  monitored live with a circuit-breaker. Note: `min(comp, buyback)` is used for
  **origination only** — the ongoing *maintenance* mark uses the independent comp so CC
  cannot walk its reference down to force-liquidate healthy loans (F-4, [doc 3.4](03-underwriting-ltv.md)).

## 2.6 Final appraised value
```
comp_mark   = value_model × (1 − staleness_haircut) × (1 − thin_haircut)
AV          = min( comp_mark , CC_buyback_quote )        # the lower, always
require( |comp_mark − implied_CC_reference| / comp_mark ≤ 0.25..0.30 )   # else refuse
```
The loan is then `LTV_tier × AV` (see [doc 3](03-underwriting-ltv.md)). AV is
recomputed **daily** for mark-to-market; buyback availability is re-checked each cycle.

## 2.7 Data sources & access (must be confirmed — see doc 7)
- **eBay sold comps:** the deepest realized data, but access is restricted (Marketplace
  Insights API is limited-access) — must be confirmed.
- **PSA "Auction Prices Realized" / population:** authoritative for graded prices; PSA's
  own API access terms are **unverified** (a specific claim about ~1 call/day was
  *refuted* in research — do not assume). Third-party (e.g. PokemonPriceTracker) exposes
  PSA price+population, with population gated to higher tiers.
- **Card Ladder / Market Movers / 130point:** realized-sales indices; confirm Pokémon
  (set/character index) coverage depth and API/licensing.
- **Multi-source is mandatory** — no single feed may be a single point of failure or
  a single point of manipulation.

## Sources
- Value model, min-comp gate, confidence meter: [Card Ladder — CL Value & index modeling](https://cardladder.zendesk.com/hc/en-us/articles/11943684520471--Card-Ladder-Value-The-Intersection-of-Player-Indexes-Price-Modeling), [What is Card Ladder Value](https://cardladder.zendesk.com/hc/en-us/articles/11943876265239-What-is-Card-Ladder-Value)
- Buyback mechanics: [Datawallet](https://www.datawallet.com/crypto/what-is-collector-crypt-cards), [Bitget Academy](https://web3.bitget.com/en/academy/what-is-collector-crypt-cards-and-how-to-trade-tokenized-pokemon-cards-on-solana)
