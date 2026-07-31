# 1 · Market Analysis — how the graded-card market really works

This is the ground truth an underwriter must internalize. Every design choice
downstream traces back to one of these realities.

## 1.1 Where cards trade, and how thin it is
Graded Pokémon cards trade across eBay (the deepest realized-sales venue),
PWCC/Fanatics Collect, Goldin, Heritage, Alt, TCGplayer (raw), and now Collector
Crypt. **Per-card liquidity is thin and tiered:**

- **Blue-chip vintage (WOTC holos — Base Set Charizard, 1st-edition/shadowless):**
  the most liquid tier, but "liquid" still means occasional sales, not a continuous
  order book. Prices are high and comps exist, but a given cert may sell only a few
  times a year.
- **Modern chase cards (high-grade hits from popular sets):** variable; some are
  liquid during a set's hype window and illiquid afterward.
- **Long tail (commons, off-grade, obscure sets):** effectively illiquid — days to
  weeks (or longer) to sell, wide bid/ask, sparse or zero recent comps.

**Underwriting implication:** we cannot assume a continuous market. We must assume
that at any moment a given card might take days–weeks to sell, and price/size
accordingly. *(Quantifying volumes/time-to-sell/spreads per tier for the specific
Collector-Crypt-tokenized cards is [open question #1](07-open-questions.md).)*

## 1.2 The market is demonstrably manipulable
In August 2021, **eBay restricted PWCC — its single largest trading-card seller
(~$200M/yr GMV) — and removed 71,000+ listings over shill bidding** (a seller
bidding on their own lots to inflate price). PWCC contested it, so we treat this as
*eBay's cited cause*, not adjudicated guilt — but the takeaway is unavoidable: **a
meaningful share of "sales" in this market can be fake.** A single print is not
evidence of value.

**Underwriting implication:** the oracle must reject outliers, require multiple
comps across multiple venues/sellers, and distrust single-seller clusters. See
[doc 2](02-valuation-oracle.md) and [threat T-2](05-threat-model.md).

## 1.3 Cards crash — hard
The 2020–21 boom saw vintage roughly **3.5×** in a year (a 1st-edition Base Set
Charizard PSA 9 went from ~$15k to ~$55k). The 2022–23 correction then took broad
categories down an estimated **40–70%** peak-to-trough. *(This magnitude is
indicative — sourced from market-commentary search results that did not survive
adversarial verification; quantifying per-tier drawdowns precisely is
[open question #2](07-open-questions.md).)*

**Underwriting implication:** collateral value can roughly halve inside a year.
LTV alone cannot absorb that — see the duration + mark-to-market design in
[doc 3](03-underwriting-ltv.md).

## 1.4 Grading is the value axis — and a fraud surface
Value is set by {**grader, grade, set, card number, variant, cert #**}. A PSA 10
can be worth multiples of a PSA 9 of the *same* card; PSA generally commands a
premium over CGC/BGS/SGC. This means:

- **Comps must key to the exact card AND grade AND grader**, never "a Charizard."
- **Slabs can be faked.** PSA states its holders are **tamper-evident, not
  tamper-proof**, and that it is actively targeted by counterfeiters/tamperers
  ("like Rolex or Louis Vuitton"). Detectable signs include edge frosting/cloudiness,
  fractures, and restored plastic flexibility after a broken sonic weld.

**Underwriting implication:** cert-number verification (PSA/CGC cert lookup) plus
the physical vault's authentication attestation is a **hard eligibility gate**, and
physical redemption must re-verify. See [threat T-4](05-threat-model.md).

## 1.5 What drives price (and reprint risk)
Scarcity signals (1st edition, shadowless, holo, low pop), iconography (Charizard,
Pikachu), nostalgia, influencer/hype cycles, and sealed-vs-singles dynamics. A
specific tail risk: **reprints / re-releases** (e.g., anniversary sets, Pokémon's
own reissues) can compress the premium on modern chase cards. Vintage WOTC is
largely immune (finite, decades-old print runs); modern is not.

**Underwriting implication:** vintage WOTC blue-chips are structurally better
collateral than modern chase cards. Tiering (doc 3) reflects this.

## Sources
- Card manipulation / PWCC: [Axios, 2021-08-20](https://www.axios.com/2021/08/20/ebay-suspends-pwcc-shill-bidding-trading-cards)
- Slab security: [PSA — A Buyer's Guide to Security](https://www.psacard.com/services/psasecurityabuyersguide)
- Boom/bust magnitude (indicative, unverified): market commentary (see doc 7).
