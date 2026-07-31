# 7 · Open Questions & Spikes (must close before mainnet)

> **UPDATE — a data spike has run against all five OQs; results + status in
> [doc 9](09-data-spike-results.md).** Headline: OQ-2 (drawdowns) and OQ-5 (physical lien) are
> ✅ closed; OQ-1/OQ-3 🟡 partially closed; **OQ-4 (an *independent* comp feed) is the 🔴 real
> blocker** because the cheap APIs are all eBay-derived. The spike also surfaced that **Collector
> Crypt already supports physical-card-backed lending** (Loopscale, Jupiter Offerbook) using a
> **fixed-term, no-price-liquidation** model — see doc 9's strategic implications.

The research proved the *risks* qualitatively and gave us the valuation/liquidation
*methodology*, but left four things unquantified. We do not fabricate these — each is
a spike with a definition of done. **No mainnet until all four are green and the
[threat model](05-threat-model.md) is signed off.**

## OQ-1 · Per-tier liquidity of the *specific* Collector-Crypt-tokenized cards
**Unknown:** actual trading volume, time-to-sell, and bid/ask spread by tier for the
cards CC actually tokenizes (not the market in the abstract).
**Why it matters:** sets the numeric LTV bands, the total lane cap, and the
marketplace-fallback window.
**Spike:** pull CC's tokenized-card inventory + recent sales; for a sample across
tiers, measure sale frequency and realized-vs-mark spread. **Done when:** we have a
liquidity score per tier that maps to LTV and caps.

## OQ-2 · Per-tier historical drawdowns
**Unknown:** precise peak-to-trough by tier through 2020–21→2022–23 (the 40–70% figure
is indicative, not verified).
**Why it matters:** calibrates the staleness/volatility haircuts and the maintenance
threshold; feeds the economic stress test.
**Spike:** build drawdown series from a realized-sales index (Card Ladder / PSA APR)
for representative cards per tier. **Done when:** each tier has a documented worst
drawdown that the LTV + duration design provably survives.

## OQ-3 · Exact Collector Crypt *vault* buyback terms + divergence history
**Unknown:** the verified 85–90% figures originate in CC's *Gacha-pack* product; the
general graded-card **vault** buyback rate/terms, and how far CC's frozen "reference
value" has historically diverged from real market prices, are not confirmed.
**Why it matters:** the buyback is our primary liquidation rail and our divergence
cross-check; its real terms set the circuit-breaker thresholds.
**Spike:** confirm vault buyback terms directly with CC docs/API; sample buyback
reference vs contemporaneous realized comps to measure divergence. **Done when:** we
have the real rate, the pull-time-freeze behavior, and a measured divergence
distribution.

## OQ-4 · Comp-data API access & terms
**Unknown:** which realized-comp sources we can actually consume programmatically
within their terms. eBay Marketplace Insights is access-restricted; **PSA's own API
terms are unverified** (a claim about a ~1-call/day limit was *refuted* in research —
do not assume it); Card Ladder / Market Movers licensing for Pokémon coverage is
unconfirmed; third-party aggregators (e.g. PokemonPriceTracker) exist but gate
population data to higher tiers.
**Why it matters:** the oracle needs ≥2 independent, license-clean realized-sales
feeds; without them the whole "real comps, not listings" guarantee is theoretical.
**Spike:** contact/verify eBay, PSA, Card Ladder access + rate limits + cost + TOS.
**Done when:** we have ≥2 confirmed, license-clean feeds with sufficient Pokémon
coverage and rate limits for daily mark-to-market.

## OQ-5 · Physical-lien enforcement by Collector Crypt (from adversarial finding F-5)
**Unknown:** our on-chain NFT lock cannot, by itself, stop the **physical** card from
being redeemed/withdrawn — that flow lives at Collector Crypt / the vault, off-chain.
**Why it matters:** if CC doesn't honor our lien, a borrower can pull the physical card
while the NFT stays "locked," leaving us a claim on an empty vault. Until this is
proven, the redemption-lock (**I-2**) is a *dependency, not an invariant*.
**Spike / done when:** CC's redemption path provably **reads and rejects** redemption of
a lien-flagged token (technical integration), backed by a **legal agreement**; verify on
testnet + in writing.

## Additional pre-build items
- Legal/regulatory posture of collectible-backed lending (flag for counsel; pilot-scope until clarified).
- Confirm pNFT freeze/delegate can enforce the NFT-side redemption-lock on Solana (I-2 technical half).
- Confirm the on-chain buyback quote is readable from a canonical CC program (T-3), and that the maintenance mark is decoupled from it (I-1/T-14).
- Wire ≥1 realized-sales source **structurally independent of eBay** into the divergence check before any lending (I-7/T-12).

## Decision gate
When OQ-1…OQ-4 are closed **and** the threat model has no open High findings, we
promote from *design* to *build phase 2 (oracle prototype)* — still not mainnet.
