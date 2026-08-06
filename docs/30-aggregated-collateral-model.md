# 30 · The Aggregated Collateral Model — one liquidity layer across every tokenization platform

> Operator (2026-08-06): *"be the best lending protocol for collectibles in the entire world… do the ones
> already tokenized on the collectible protocols like Collector Crypt and their biggest competitors,
> aggregated."* This is the core positioning: **Magpie tokenizes nothing itself. It is the permissionless
> liquidity layer that lends against the assets ALREADY tokenized + vaulted across every vetted
> platform — aggregated into one collateral universe.** Directly fills the #1 gap the teardown found
> ([doc 29 §29.4](29-winning-wedge-best-permissionless-provider.md)): *everyone lends only against their
> own single vault; nobody aggregates.* Being the aggregator is the wedge. Design-only.

## 30.1 The thesis in one line
Every incumbent is single-source — **Collector Crypt lends only against Collector Crypt cards.** We lend
against **all of them at once**: a borrower holding a tokenized, vaulted, graded asset on *any* vetted
platform gets liquidity from one venue, priced by one honest cross-sourced oracle, screened by one
proof-of-sale gate. **The widest *safe* collateral book in the world — because it's the union of everyone's
inventory, not any single vault's.**

## 30.2 What "aggregated" means, precisely
Our lendable universe = the **union of already-tokenized, insured-vault-held, third-party-graded inventory**
across the vetted platforms, each onboarded as its own **capped risk lane**, all unified under **one gate
+ one oracle**:

| Platform | Chain | Already-tokenized inventory (approx) | Lane role |
|---|---|---|---|
| **Collector Crypt** | Solana | ~130K+ cards; ~$1.6B cum. volume; PWCC custody | Anchor lane (deepest) |
| **Phygitals** | Solana | ~100K+ cards; PSA/Alt/Fanatics custody; Fanatics Collect bridge | Deep Solana-native lane |
| **Courtyard** | Polygon | graded cards + coins/watches/comics; Brink's; >$1B cum. | Cross-chain lane (bridge/read) |
| **Beezie** | Solana/Base | cards, sealed TCG, sneakers, memorabilia | Watch-list lane (as its Solana record matures) |
| **BAXUS** | Solana | tokenized whiskey/spirits; ~$20M traded | Non-card (whiskey) lane |

We do **not** custody or tokenize — the platforms do that. We add the missing layer: **credit, priced
honestly and screened for liquidity, across all of them.**

## 30.3 Why aggregation makes us the best (the diligence)
1. **Breadth no single-vault lender can match.** CC lending sees only CC's cards; we see CC + Phygitals +
   Courtyard + BAXUS. The same borrower, the same card, more places it's accepted → we're the default
   liquidity venue for the whole tokenized-collectible market, not one silo.
2. **A *stronger* oracle, because we aggregate the data too.** Each platform's marketplace is another
   realized-sales feed. Aggregating sold data across platforms (+ the independent PSA-APR/Fanatics/Heritage
   corpora) makes our cross-sourced mark **harder to manipulate** than any single platform's own index —
   the exact anti-drain property ([doc 22](22-realized-sales-venue-comp-data-map.md)/[24](24-oracle-prototype-spec.md)).
3. **Safety scales with aggregation, not against it — via capped lanes.** Each platform is an independent
   lane with its own exposure cap, counterparty monitoring, and custody/redemption verification, so no
   single custodian failure is systemic ([doc 20 §20.5](20-tokenization-platforms-collateral-sources.md)).
   Aggregation *diversifies* the off-chain enforcers rather than concentrating on one.
4. **Neutral infrastructure, not a rival.** We're the P2P/offerbook liquidity layer *on top of* the
   platforms ([doc 18](18-structure-decision-memo.md)) — we make their tokenized assets more useful
   (borrow without selling), so the platforms are partners/data sources, not competitors. That alignment
   is why they'll share the licensed price data ([doc 23](23-outreach-briefs-psa-fanatics.md)).

## 30.4 How the aggregation actually works (unified gate + oracle, per-platform lanes)
```
Any tokenized item, any vetted platform
        │
        ▼
1. PLATFORM LANE      Is the source platform vetted + within its exposure cap? Verify its custody,
                      redemption, and cert-binding for this lane (doc 20). Else decline.
2. IDENTITY           Resolve the exact underlying asset {grader, grade, cert, set, #, variant} —
                      the SAME physical card is the same collateral whether it's a CC token or a
                      Courtyard token (cross-platform identity resolution; price it identically).
3. UNIFIED GATE       Run the ONE proof-of-sale gate (doc 27) — realized sales across ALL marketplaces,
                      ≥5/12mo + ≥2/90d + ≥3 sellers + ≥2 venues + ≥1 eBay-independent. Same bar for
                      every platform. Fail-closed.
4. UNIFIED ORACLE     One cross-sourced mark (doc 24), built from realized sales aggregated across every
                      platform's marketplace + the independent corpora.
5. SIZE + CAPS        Tier LTV × mark, checked against per-item / per-character / per-platform / total caps.
6. ORIGINATE          Fixed-term, non-custodial, on Solana (cross-chain read for Polygon lanes).
```
**One standard, applied uniformly to everyone's inventory.** A card doesn't get easier terms because it's
on platform X — it gets the same honest, cross-sourced, liquidity-gated treatment everywhere.

## 30.5 Aggregation-specific risks + mitigations
- **Cross-platform double-count / wash:** the same underlying card could be listed/sold across platforms →
  the oracle keys to the **underlying asset identity + corpus**, dedupes cross-posted sales, and counts a
  venue once (per [doc 22.2](22-realized-sales-venue-comp-data-map.md) corpus rule) so aggregation can't be
  gamed into false liquidity.
- **Per-platform counterparty risk:** the token is only as good as the off-chain enforcer → **hard
  per-platform exposure caps**, live custody/solvency monitoring, and a bailee/lien answer per lane
  (OQ-5); degrade or pause a lane without touching the others.
- **Cross-chain (Courtyard = Polygon):** a lane that isn't Solana-native needs a verified cross-chain read
  of the token's state; treat as a distinct, smaller-capped lane until the bridge/read is proven.
- **Uneven data quality per platform:** the unified gate is the equalizer — a platform with thin sold data
  simply produces fewer eligible items, not looser terms.

## 30.6 Sequencing (deepest-inventory first)
1. **Collector Crypt + Phygitals (Solana, cards)** — the two deepest already-tokenized card inventories;
   Solana-native, our anchor lanes.
2. **Courtyard (Polygon, cards)** — add once the cross-chain read is proven; large inventory, Brink's custody.
3. **BAXUS (Solana, whiskey)** — the one non-card lane, small-capped.
4. **Beezie + others** — watch-list, added as their track record matures.
Each lane opens only after its custody/redemption/lien + data path clears the same bar.

## 30.7 The positioning payoff
This is what makes the claim credible — *the best collectibles lending protocol in the world*:
- **Widest book:** the aggregate of every vetted platform's tokenized inventory, not one vault's.
- **Safest book:** one proof-of-sale gate + one cross-sourced oracle + capped per-platform lanes + a reserve.
- **Only one of its kind:** no incumbent aggregates — they each lend against their own silo, priced by
  their own number. We are the neutral, permissionless liquidity layer for **all** of them.
Widest **safe** breadth, by construction. Ties to [doc 20](20-tokenization-platforms-collateral-sources.md),
[doc 27](27-sold-comp-verification-runbook.md), [doc 28](28-addressable-collateral-universe.md), [doc 29](29-winning-wedge-best-permissionless-provider.md).
