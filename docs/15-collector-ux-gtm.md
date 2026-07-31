# 15 · Collector UX & Go-to-Market

The other half of the mandate: **attractive to collectors** while protecting the bottom line. A
lending product only works if borrowers actually want it. This doc covers the borrower experience,
trust design, and how we reach collectors.

## 15.1 What collectors actually want (jobs-to-be-done)
1. **Liquidity without selling** — cash now, *keep the card and its upside.* This is the entire
   emotional core: a collector who loves a card doesn't want to sell it, but may need cash.
2. **Certainty their card is safe** — the #1 fear is losing a beloved card to a surprise or a
   manipulation-driven fire sale. Our **fixed-term, no-price-liquidation** model ([doc 10](10-fixed-term-v1-spec.md))
   is a *feature*, not just a risk choice: "your card can't be liquidated out from under you on a
   bad-print blip — repay by the date and it's yours."
3. **Fair, transparent value** — collectors know the real comps; a lowball or listing-based appraisal
   destroys trust instantly. Our **honest, published, real-sold-comp valuation** ([doc 2](02-valuation-oracle.md))
   is a differentiator in a market with a documented manipulation history.
4. **Speed & simplicity** — instant quote, minutes not days (vs TradFi's manual, insured, slow flow).
5. **Reasonable cost** — competitive rate, no surprise fees.

## 15.2 The borrow flow (target UX)
```
Connect wallet ─▶ Pick a vaulted card you own (or Collector-Crypt-held)
   ─▶ Instant eligibility + APPRAISAL shown transparently:
        "PSA 10 Base Charizard · cert #… · appraised $X (from N real sales, updated <date>)
         · you can borrow up to $Y (≤40% LTV) · fixed 60-day term · Z% APR · no liquidations"
   ─▶ Accept ─▶ card locks in vault, USDC to wallet (minutes)
   ─▶ Dashboard: due date, payoff amount, big clear "your card is safe until <date>" status
   ─▶ Repay ─▶ card unlocks. (Or extend / partial-repay before maturity.)
```
Design principles (from Magpie's UX bars): **instantly clear to a non-crypto-native collector**,
plain English (no "LTV/oracle" jargon in the primary flow — show "borrow up to $Y, keep your card"),
zero cosmetic defects on web + mobile, and the **card + its safety status front and center.**

## 15.3 Trust & transparency features (the moat)
- **Show the comps.** Display the actual recent sold prices the appraisal is built from, with dates
  and sources — "we value from real sales, not listings." Radical transparency vs the market.
- **"Your card is safe" guarantee, stated plainly** — no price-based liquidation during the term;
  the only way to lose the card is not repaying by the due date.
- **Non-custodial framing** — "your keys, your card; we only hold it in a locked vault for the loan,
  and we can never take it except on default." (Mirrors Magpie's core promise.)
- **Reminders before maturity** — proactive due-date reminders + easy extend/partial-repay so
  collectors don't accidentally forfeit. Accidental forfeiture is a trust-killer; prevent it.
- **Published methodology + audit/threat-model** — link the (public) strategy repo; sophisticated
  collectors reward rigor.

## 15.4 Go-to-market channels
The TCG community is concentrated and reachable:
- **X (Twitter)** — real-time TCG discourse; the primary announcement + community channel.
- **Reddit** — r/PokemonTCG, **r/PokeInvesting**, r/pokemoncards (the investor-minded subs are the
  bullseye for a lending product).
- **Discord / Facebook groups** — TCG trading communities; message velocity there leads market moves
  by 12–24h — good for community presence and sentiment listening.
- **YouTube / Twitch influencers** — mega-tier creators (e.g. UnlistedLeaf, 2.7M subs) and mid-tier
  investing-focused channels; sponsored explainers of "borrow against your slab, keep the card."
- **On-Solana funnel** — Collector Crypt already has ~40k daily users; meet collectors where the
  tokenized cards already live (integrations, co-marketing where sensible — while keeping our
  independent appraisal/rail so we're not captive to CC).

## 15.5 ⚠️ Influencer risk is also an underwriting input (cross-link to the oracle)
Research shows **influencers with 50k+ followers can move a card's price 12–25% within 72 hours.**
That cuts both ways:
- **Marketing:** influencer reach is powerful and cheap relative to the audience quality.
- **Risk:** a coordinated influencer pump can **bias comps upward right before someone borrows** — a
  softer, "legal" cousin of wash-trading (threat [T-1](05-threat-model.md), finding F-2/F-8). This is
  a concrete reason for the oracle's **anomaly/velocity monitor + cooldown after a recent spike**
  before a card's higher value unlocks borrowing power (invariant [I-11](05-threat-model.md)). GTM
  and underwriting must talk to each other: **the same hype that sells loans can inflate collateral.**

## 15.6 Positioning statement
> **"Unlock cash from your cards without giving them up — valued from real sales, safe from surprise
> liquidations, and back in your hands the day you repay."**

Compete on **safety, honesty, and keeping-your-card**, not on the highest LTV. In a market that's
been burned by manipulation and fire-sales, *trust is the product.*

## 15.7 Launch sequence (GTM, gated on the build)
1. Publish the (public) strategy + methodology → credibility with sophisticated collectors.
2. Tightly-capped pilot ([doc 16](16-build-plan.md)) with a hand-picked blue-chip allowlist and a
   small cohort — invite-driven via the investor-minded subs/Discords.
3. Collect testimonials + real liquidation performance data → case studies.
4. Broaden the eligible set and cohort as the data (OQ-1) and reserve health (I-9) allow.

## Sources
- [Community sentiment & price-tracking tools](https://cardchill.com/article/community-sentiment-and-pokemon-card-prices-tracking-tools-and-hype-cycle-analysis) · [Pokémon TCG YouTubers/influencers](https://videos.feedspot.com/pokemon_tcg_youtube_channels/) · [r/PokemonTCG Discord](https://discord.com/invite/pokemontcg)
