# 20 · Authenticated-Tokenization Platforms — Collateral-Source Diversification

> Where the collateral comes from. [Doc 11](11-competitive-landscape.md) mapped lending *rivals*;
> this maps the **issuers of the collateral itself** — platforms that tokenize *authenticated,
> vaulted physical collectibles*. Sourcing collateral from **several** vetted platforms (not just
> Collector Crypt) turns the [OQ-3](19-oq-closeout.md) single-counterparty risk into a *per-platform*
> risk we can cap and diversify. Design-only; nothing deployed. Research 2026-08-04 (primary + credible
> secondary sources; on-chain oracle readability and custody legal structure are the least-documented
> areas across every platform — flagged inline).

## 20.1 The eligibility principle (operator constraint, 2026-08-04)
Eligible collateral MUST be a **tokenized, independently-authenticated, vaulted physical collectible**
— the token is only the on-chain custody/redemption handle; the real collateral is the graded/verified
physical asset. This is platform-agnostic: any issuer that meets the bar (credible third-party
authentication + insured custody + enforceable redemption + acceptable counterparty) can be a source.
**No single-issuer lock-in.** Each platform is onboarded as its own risk lane with its own exposure cap.

**A vetted platform is necessary but NOT sufficient.** Being on Collector Crypt/Courtyard/Phygitals only
makes an item *authenticated + vaulted* — it does NOT make it *lendable*. Every individual item must
still clear the **proven-liquidity / proof-of-sale gate in [doc 21](21-liquidity-eligibility-proof-of-sale.md)**:
real, recent, multi-venue realized sales — not listings, not issuer FMV, not an index projection. The
platform supplies custody; doc 21 supplies the "does it actually sell, at a price we can prove" test.
Both must pass.

## 20.2 Card / general-collectible tokenizers (summary)

| Platform | Chain | What | Auth | Custody | Instant buyback | On-chain price oracle? | Existing lending | Suitability |
|---|---|---|---|---|---|---|---|---|
| **Collector Crypt** (ref) | Solana | Pokémon/TCG, sealed | PSA/BGS/SGC | PWCC / Delaware vault | 85–90% FMV (Gacha-only, 72h — see [19.2](19-oq-closeout.md)) | No canonical feed (Loopscale custom) | **Yes** — Loopscale Collectibles Vault | *(baseline)* |
| **Courtyard** | **Polygon** | Cards, coins, watches, comics | PSA/BGS-type | **Brink's**, free market-value insurance | 70–95% FMV | **No** — FMV "determined solely by Courtyard" (Card Ladder, off-chain) | Third-party: **Teller** (Polygon) | **HIGH** |
| **Phygitals** | **Solana** | Pokémon/TCG (graded+ungraded) | PSA / Alt / Fanatics | Insured US facilities (PSA/Alt/Fanatics) | up to **92%** FMV | Not on-chain | None found | **MEDIUM-HIGH** |
| **Beezie** | Flow→Base→**Solana** (Q2'26) | Cards, sealed, sneakers, memorabilia | PSA/BGS/CGC | Institutional vaults, insured | ~**90%** (15-min SWAP) | Not on-chain | None found | **MEDIUM** |
| **Americana** | Solana (reported) | Cars, sneakers, art, china | In-house + COA | Own climate-controlled vaults | Not confirmed | Not on-chain | None found | **LOW-MED** (unverified) |
| **BlockBar** | Ethereum | Wine & spirits (brand-direct) | Producer provenance | Bonded warehouse | Resale only | No | None found | **LOW** (off-thesis) |

## 20.3 Per-platform detail (card tokenizers)

### Courtyard — the #1 additional source (HIGH)
- **What/chain:** graded cards (Pokémon flagship) + coins, watches, comics, on **Polygon PoS**.
- **Custody (best in sector):** **Brink's** (US), 24/7 monitored, **insured free at market value** — the same
  operator that guards gold/fine art. Strongest named custodian we found.
- **Redemption:** burn-to-ship, KYC required, redeemer pays handling + shipping, ~1–2 wk.
- **Value:** instant buyback (~90% FMV; ~70% cards early / ~95% watches) **but FMV is off-chain and
  issuer-controlled** — terms say value is *"determined solely by Courtyard… not subject to negotiation"*
  (Card Ladder data). **No program-readable on-chain price feed.**
- **Liquidity:** deepest in segment — ~$78.4M/mo (Aug-2025), >$1B cumulative marketplace volume; public
  floor/volume on CoinGecko/CryptoSlam (rare semi-public pricing).
- **Existing lending:** **Teller (Polygon)** already accepts Courtyard NFTs as collateral (documented
  2023 loan + liquidation); GONDI/NFTfi handle bespoke high-value P2P.
- **Counterparty:** YC W22; **$37.5M raised** incl. **$30M Series A (Jul 2025)** led by **Forerunner**
  (NEA, ParaFi, Prelude, Burst, Operator Partners). Strongest cap table in the category.
- **Verdict — HIGH.** Best custody, best-funded, enforceable redemption, deepest liquidity, existing
  lending rail. **Engineer around:** it's **Polygon (cross-chain)**, and there's **no canonical on-chain
  oracle** — issuer FMV must not be trusted blindly (our cross-sourced oracle is required).

### Phygitals — strongest Solana-native alternative (MEDIUM-HIGH)
- **Solana-native**; ~60k cards tokenized (10k graded), ~$30M volume, AR "phygital" model.
- **Custody:** graded cards in **insured US facilities managed by PSA / Alt / Fanatics** — custody
  delegated to the graders/Fanatics (strong chain-of-custody).
- **Value:** instant **buyback up to 92% FMV** (highest quoted); no on-chain feed.
- **Distribution edge:** integrated tokenized cards into **Fanatics Collect** (Apr 2026) — a real
  web3→web2 liquidity/legitimacy bridge.
- **Verdict — MEDIUM-HIGH; #1 if Solana-native is a hard requirement** (no bridge, aligns with our
  stack). Weaker on funding transparency, on-chain price, volume; no lending rail yet.

### Beezie — multi-chain, arriving on Solana (MEDIUM, watch-list)
- Launched Flow → scaled on **Base** ($100M+ vol) → **Solana Q2 2026**. Graded slabs, sealed TCG,
  sneakers, memorabilia. **PSA/BGS/CGC**, institutional vaults, thousands redeemed.
- **Value:** **SWAP** ~90% FMV within a 15-min window; 530k+ swaps. No on-chain oracle.
- **Counterparty:** ~$142M ARR; backers incl. Dapper's Roham Gharegozlou, Moonrock, Techstars.
- **Verdict — MEDIUM.** Broadest inventory + strong revenue, but Solana book only launching; revisit
  once its Solana custody/redemption track record exists.

### Lower-priority / off-thesis
- **Americana** (Solana, high-end cars/sneakers/art) — heterogeneous one-of-one items are hard to
  price for an automated oracle; details unverified. **LOW-MED.**
- **BlockBar** (Ethereum, brand-direct wine/spirits) — no buyback floor, no oracle, thin liquidity. **LOW.**
- **Deadstock / Fidgetals / Bazaar / Kollect / Realm** — named as small Solana gacha-TCG tokenizers; no
  primary docs on custody/auth surfaced. **Unverified / LOW** until confirmed. DIBBS (fractional) not
  currently active.

## 20.4 The cross-cutting lending finding (why this matters for us)
**On-chain price readability is THE gate, and no platform solves it for a lender.** None publishes a
robust, cross-sourced, program-readable **NAV-per-card oracle**:
- **Collector Crypt** is the *only* one with live vaulted-card lending (**Loopscale Collectibles
  Vault**, ~7–10% APR) — but Loopscale uses **Pyth for the liquid $CARDS token** and a **custom/undisclosed
  oracle for card NAV**, not an open feed.
- **Courtyard** value is **issuer-controlled off-chain**; **Teller** lends against it on Polygon anyway.
- Practitioners name the exact risks our strategy already prioritizes: **custodian abscond risk**
  ("the physical custodian can theoretically abscond… and still represent it's on-chain"), grader
  tamper/value inflation, and liquidation volatility on low-value cards.

**Implication:** every platform is a *single-issuer custody + off-chain-price* dependency. Our documented
moat — **cross-sourced oracle + screen + in-vault conversion**, plus the memory disciplines
([[feedback_collateral_price_must_be_cross_sourced_jupiter_primary]], cap-to-attestation, reject >3×
divergence) — is precisely the differentiator, because **no issuer hands us a safe price.** We build the
valuation (independent realized comps per [19.1](19-oq-closeout.md): PSA-APR/Heritage/Card-Ladder +
eBay corroboration + marketplace floor), and treat each issuer's FMV/buyback only as a *skeptical,
haircut cross-check* — never the oracle.

## 20.5 Broader authenticated-collectible tokenizers (spirits / watches / luxury)

Two findings frame the whole non-card space:
- **The on-chain-oracle gap is universal — and it's our wedge.** No platform anywhere (BAXUS, Courtyard,
  Phygitals, Kettle, Collector Crypt) exposes a robust, program-readable, per-asset market value. Every
  one prices off-chain and single-source (Card Ladder / eBay / BoozApp / WatchCharts) or by discretionary
  company quote. General oracles (Pyth/Chainlink/RedStone) carry **zero** collectible/luxury feeds. So
  **whatever we lend against, we build the cross-sourced comps oracle ourselves** — exactly the moat.
- **Regulatory line (SEC/CFTC joint interpretation, 2026-03-17):** **1:1 whole-item redeemable collectible
  NFTs = non-securities** (clean for permissionless collateral) absent profit-sharing/fractionalization/
  investment marketing. Every **fractional-ownership** platform (Masterworks, Rally, Particle, Freeport,
  Arkefi) is an investment-contract security → KYC-gated, un-permissionless. **Rule: favor 1:1 vault NFTs;
  avoid all fractional tokens.** (Ties to [doc 14](14-legal-regulatory.md)/[doc 18](18-structure-decision-memo.md).)

| Platform | Class | Chain | Auth / custody | On-chain value? | Native lending | Verdict |
|---|---|---|---|---|---|---|
| **BAXUS** | Whisky/spirits | **Solana** | 360-scan + RFID, burn-on-redeem; own insured vault | No (BoozApp, 45+ sources off-chain) | **Yes, LIVE** (Bridgesplit, $500k+) | **MED-HIGH — #1 non-card** |
| **Kettle** | Luxury watches | Blast L2 | In-house + Watch Register; NYC vault, **Lloyd's-insured** | No (P2P negotiated) | Yes (P2P, ~$1.35M) | **LOW-MED — model, wrong chain** |
| **dVIN Labs** | Investment-grade wine | **Solana** | DePIN sensors + "Digital Cork" | No | No | **MED — right asset, early** |
| **Artifacte** | Cards/spirits/wine | **Solana** | PSA/CGC claimed; custody **undisclosed** | No | No | **MED-trust / HIGH-watch** |
| **BlockBar** | Wine/spirits | Ethereum | Brand-issued, Singapore vault | No | No | **LOW-MED** |
| **Mattereum** | Gold/whisky/art | EVM | **Expert warranties + arbitration** (asset passport) | No | No | **LOW source / HIGH model** |

### The picks beyond trading cards
1. **Fine spirits / whisky via BAXUS — the clear #1 additional class.** Only non-card platform that is
   **Solana-native**, has strong **serial + RFID** authentication, exposes a **dense realized-price
   dataset** (BoozApp, 75k+ bottles), and **already runs a live on-Solana lending market** (Bridgesplit,
   $500k+ originated — proving borrower demand + a liquidation rail exist). Bottle-serial auth is clean
   and, like graded cards, spirits have **dense realized-sales comps** — the two easiest classes to
   underwrite under [doc 21](21-liquidity-eligibility-proof-of-sale.md). Gaps to engineer: off-chain value
   (our oracle bridge, cross-sourced vs external whisky indices) + thin per-bottle liquidity (→ conservative
   LTV, recover via marketplace/redemption, never open-market dumping). **Natural first expansion beyond CC cards.**
2. **Luxury watches — best asset class by comp density, no viable on-chain token source yet.**
   WatchCharts/Chrono24 give the deepest realized-sales data of any luxury vertical and watches liquidate
   better than one-of-a-kind items — but the only live custody+lending operator (Kettle) is on Blast, tiny,
   and prices bilaterally. **Strong future target if we custody/partner ourselves**, sourcing comps directly.
3. **Sports memorabilia via Phygitals (Solana)** — adjacent to cards, multi-vault custody, Fanatics
   distribution; lending is roadmap. A near-term Solana partner to watch (an extension of the card thesis).

### Anti-patterns to encode in the risk model
- **USDR / Tangible (Oct 2023):** illiquid-RWA backing + on-demand redemption + reflexive collateral = bank
  run. Never let redemption/liquidation assume liquidity the underlying doesn't have.
- **Particle:** a "no financial interest / no redemption" token has **no enforceable claim → un-lendable.**
  We require a **hard, on-chain-enforceable liquidation claim** on the authenticated asset, marked at
  **discounted realized-comp value** ([doc 21](21-liquidity-eligibility-proof-of-sale.md)) — never floor/listing.
- **Single-vault custody is universal** (PWCC / Brink's / Lloyd's / PSA-Alt-Fanatics); only Phygitals is
  building proof-of-reserves (not live). Underwrite **platform-insolvency / orphaned-token** risk explicitly.

### Deprioritized / avoid
- **Fine art** (one-of-a-kind → no comps, no liquidation rail; mostly fractional-securities or defunct) and
  **handbags** (sparse comps, compressing premiums, trademark risk) — off the proven-liquidity thesis.
- **Defunct/vaporware — do NOT chase:** 4K, Arkefi, Particle, RTFKT/Nike, StockX Vault NFTs, Dibbs, Otis,
  Maecenas, WiV, SYKY; "Tialabs" has no verifiable footprint; no "Privé/LVMH" watch-tokenizer exists
  (Aura = passports only); Masterworks/Rally are off-chain Reg-A+ securities.

## 20.6 Recommendation
Diversify beyond Collector Crypt onto a **short allowlist of vetted issuers**, each its own capped lane:
1. **Courtyard (HIGH)** — pursue despite cross-chain (Polygon) + issuer FMV, for its Brink's custody,
   funding credibility, liquidity, and existing Teller lending precedent; requires a cross-chain read +
   our own oracle.
2. **Phygitals (MEDIUM-HIGH)** — the cleanest **Solana-native** second source (PSA/Alt/Fanatics custody,
   Fanatics Collect distribution).
3. **Beezie (MEDIUM)** — watch-list; onboard after its Solana custody/redemption record matures.
Baseline **Collector Crypt** stays in, but **de-risked**: capped exposure, buyback treated per [19.2](19-oq-closeout.md).
Before onboarding ANY issuer: verify **custody legal terms (bailment vs. title), redemption SLA, and
cert-to-token binding** from primary docs — all under-documented publicly today.

## Sources
Courtyard (docs, Polygon blog, Series-A announcement, Teller case) · Phygitals (docs, Fanatics Collect
integration) · Beezie (Decrypt launch) · Collector Crypt / Loopscale Collectibles Vault · practitioner
risk commentary (Dialectic/Zurrer). Full URLs captured in the research thread; verify custody legal
structure per-issuer before onboarding.
