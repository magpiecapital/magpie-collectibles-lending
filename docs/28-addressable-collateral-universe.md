# 28 · Addressable Collateral Universe — the tokenized RWAs, ranked by what we can safely lend on

> Operator (2026-08-06): be the best permissionless liquidity provider for collectibles **and the
> tokenized RWAs that platforms like Collector Crypt vault.** This maps that whole universe — every asset
> type tokenized across Collector Crypt / Courtyard / Phygitals / Beezie / Fanatics / BAXUS — and ranks it
> by what a **safety-first** lender can actually underwrite. Research 2026-08-06 (primary + credible
> secondary, VERIFIED/UNCERTAIN flagged). Extends [doc 20](20-tokenization-platforms-collateral-sources.md).

## 28.1 The headline finding
**The tokenized-RWA-collectibles market is, in economic reality, one asset class wearing several
costumes: professionally graded trading cards.** Cards are ~90%+ of real on-chain volume and the **only**
category with the dense, cross-marketplace *realized-sales* data a permissionless lender needs to price
safely. Everything the platforms tout expanding into — sealed wax, watches, comics, wine, memorabilia — is
currently thin, data-poor, or forward-marketing, not underwritable inventory. Solana carries ~75% of
on-chain TCG volume; the tokenized-card market is ~**$1.6B cumulative** with ~**130K+ cards** vaulted on
Collector Crypt alone. **Concede nothing on cards; pilot whiskey small; treat the rest as watch-list, not collateral.**

## 28.2 Platform × asset-type matrix
✅ core/live · 🟡 minor/early · 🔬 announced/aspirational (vaporware-risk) · — none

| Asset type | Collector Crypt | Phygitals | Courtyard (Polygon) | Beezie | BAXUS |
|---|---|---|---|---|---|
| **Pokémon (graded singles)** | ✅ flagship | ✅ flagship | ✅ (~90% of vol) | ✅ | — |
| **Sports cards (graded)** | ✅ | ✅ | ✅ | ✅ | — |
| **Other TCG (One Piece, YuGiOh, MTG, Lorcana)** | ✅ One Piece; 🟡 rest | ✅ | 🟡 | ✅ One Piece | — |
| **Sealed product (boxes/packs)** | 🟡 (gacha "packs" ≠ vintage wax) | 🟡 | 🟡 | ✅ sealed TCG | — |
| **Comics (CGC)** | 🔬 | — | 🟡 | 🟡 | — |
| **Luxury watches** | 🔬 | — | — | 🟡 | — |
| **Wine / spirits / whiskey** | 🔬 | — | — | — | ✅ core |
| **Memorabilia / sneakers / Labubu** | 🟡 | 🟡 | — | ✅ | — |
| **Coins / bullion** | — | — | — | — | — |

**Traps flagged:** CC's "cards + wine + watches + comics" line is a *forward* marketing claim, not live
liquid inventory (treat those 🔬). **Fanatics Collect is NOT a chain** — it's a Web2 marketplace (Goldin
auction pedigree), but Phygitals bridged **50K+ tokenized cards into it (Apr 2026)**, making it the deepest
*price-discovery* venue on-chain collateral can cross-reference. "Sealed" on gacha platforms = digital
gacha packs revealing singles, **not** vaulted vintage wax.

## 28.3 The ranked addressable universe (for a safety-first permissionless lender)
Ranked by: proven on-chain liquidity × realized-sales data density × cross-source price defensibility
(our anti-drain moat).

### Tier A — READY NOW
1. **Graded Pokémon singles** — deepest liquidity, best data (PSA APR, Card Ladder, 130point, eBay sold,
   Fanatics/Goldin), on-chain buyback floors (85–93%) exist, and CC's own **7–8% APR lending** proves the
   market. Our flagship, correctly.
2. **Graded SPORTS cards** — data is *equal or deeper* than Pokémon (Fanatics/Goldin realized comps),
   **54% of card-market value.** The **immediate expansion beyond Pokémon** — and why the showcase already
   features a Fleer Jordan.
3. **Graded One Piece + major modern TCG (Yu-Gi-Oh)** — liquid on-chain, gradable, comp-able. Add with
   modestly higher haircuts than Pokémon/sports.

*All three share the moat-friendly property: **dense cross-marketplace SOLD data**, so our cross-sourced
oracle can reject a manipulated single-venue print — the exact defense the single-source drains (Loopscale-
class) lacked.*

### Tier B — PROMISING (pilot cautiously, low LTV)
4. **Whiskey / rare spirits (BAXUS)** — the **only** credible non-card category: a live tokenization+vault
   platform, real secondary feeds (Whiskystats, auction houses), and **$500K+ loans already originated**.
   Bottle-as-SKU is more fungible than a 1-of-1 card. Underwrite conservatively; **ignore the "$1.5B barrel
   pipeline" hype** (aspirational, not realized).
5. **Long-tail graded TCG (MTG, Lorcana) + fine wine** — real data but thinner/more volatile → low LTV only.

### Tier C — AVOID (too thin / data-poor / vaporware)
6. **Sealed product (vintage wax)** — record single sales mask genuine illiquidity + authentication risk +
   violent corrections. Lumpy, wrong-way collateral.
7. **Graded comics** — post-boom correction, thinner comps, immature grading competition.
8. **Luxury watches** — structurally opaque, 30%+ new/used spreads, condition-unique, concentrated
   liquidity — a single-source price here is precisely the drain vector to avoid.
9. **Memorabilia / sneakers / Labubu / fossils** — entertainment/hype-grade, no dense comps, fashion risk.
10. **Coins / bullion** — either not tokenized on these rails, or a different commodity product (spot-priced,
    Kamino-adjacent), not the collectibles thesis.

## 28.4 Collector Crypt specifics (the reference platform)
VERIFIED: ~130K+ cards vaulted; **~$1.6B cumulative volume**; ~$64M cumulative revenue (Jun 2026); **PWCC
custody**; **lending LIVE at 7–8% APR** against vaulted cards; $CARDS token powers gacha + marketplace +
**instant buyback at 85–93%** of a real-time market reference (revenue-funded). Powers white-label gacha +
a fixed-term **loan Offerbook** across Solflare / Jupiter / Rarible. Its live liquid business is **graded
cards + gacha** — the wine/watches/comics expansion is forward marketing (🔬).

## 28.5 Strategic implication
- **Card-shaped is a feature, not a limit.** The categories that are liquid are exactly the categories with
  the cross-sourced realized-sales data our oracle needs — so the *addressable* universe and the
  *safely-underwritable* universe are the same set. That alignment is the whole game.
- **Sequence:** Pokémon (live focus) → **sports cards (immediate #2)** → One Piece/top TCG → **whiskey
  (the one non-card pilot)**. Everything else is watch-list.
- **This is the moat, restated:** every incumbent prices off a single source or a vendor number; we lend
  across the widest set of *proven-liquid* tokenized RWAs, priced off *cross-sourced real sales*, screened
  fail-closed. Widest **safe** breadth wins — not widest breadth.

## Sources
Solana Media (tokenized cards $1.6B / 130K cards / 75% TCG) · CryptoBriefing + AInvest (CC volume/revenue,
$CARDS) · Gate/CoinGecko (CC asset span, 7–8% lending) · Polygon + Token Dispatch (Courtyard) · Genfinity +
soladex (Phygitals × Fanatics) · Decrypt + GlobeNewswire (Beezie) · Solana Compass + The Block (BAXUS) ·
Fanatics/Goldin · PSA APR / PokemonPriceTracker · PokéViews/Misprint (sealed) · GoCollect (comics) · SJX/
WatchPro (watches) · Whiskystats/Alts.co (whiskey). Full URLs in the research thread; forward-marketing
claims flagged 🔬.
