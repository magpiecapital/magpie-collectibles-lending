# 31 · Announcement Copy & Tweets — aligned messaging, ready to ship

> Operator (2026-08-06): *"craft a good tweet too when it's ready. Everything in the protocol must ALIGN."*
> This is the single source of truth for how we **talk about** collectibles lending — the pillars every
> surface already speaks (site, docs, oracle), the tweet drafts, and an alignment checklist so no claim
> outruns what's actually true. **Design-phase.** The launch tweet ships only when the pool is live; the
> teaser can ship now because it says *in design* plainly.

## 31.1 The one message (everything ladders to this)
**Magpie is becoming the one place to borrow against your tokenized collectibles — priced on what they
actually *sell* for, across every platform that vaults them.** The third head of the monster:
**Memecoins · Tokenized Stocks · Collectibles.** Slogan holds: *collateral that can still sell itself.*

## 31.2 Messaging pillars (each traces to a doc — never say more than these)
| Pillar | Say | Backed by |
|---|---|---|
| **Aggregated** | "Borrow against cards already vaulted on Collector Crypt, Courtyard, Phygitals & more — one place." | [doc 30](30-aggregated-collateral-model.md) |
| **Proven-liquid only** | "We only lend against cards with a real, recent, multi-venue *sold* record." | [doc 21](21-liquidity-eligibility-proof-of-sale.md)/[27](27-sold-comp-verification-runbook.md) |
| **Honest price** | "Valued on realized sold comps, cross-sourced, never listings — no single source can inflate a loan." | [doc 2](02-valuation-oracle.md)/[24](24-oracle-prototype-spec.md) |
| **Never force-liquidated** | "Fixed-term. Illiquid collateral is never dumped on a wick." | [doc 10](10-fixed-term-v1-spec.md) |
| **Safe by design** | "Conservative LTV (≤50% top), capped lanes, a reserve — sized for a bear market." | [doc 13](13-economic-model.md)/[26](26-launch-allowlist.md) |
| **Widest + safest** | "The only lender that's permissionless, cheap, fast AND safe on these assets." | [doc 29](29-winning-wedge-best-permissionless-provider.md) |

**Numbers that must match everywhere** (site, docs, prototype, tweets): LTV tiers **≤50 / ≤40 / ≤25**;
three collateral classes; *in design*, not live. Any surface showing a different number is a bug, not a variant.

## 31.3 Tweet — in-design teaser (SAFE TO POST NOW) — LOCKED COPY
The operator selected the simplified, high-level version (2026-08-06). **This is the copy to post** from
@MagpieLoans; the magpie.capital/collectibles link auto-loads the branded OG card as the preview:
> Memecoins. Tokenized stocks. And now — collectibles.
>
> Borrow against your graded cards without selling them.
>
> In design 👇
> magpie.capital/collectibles

*Why it's safe:* high-level and present-tense true; "in design" is stated, so it never implies a live
product. No unpublished numbers, no names, no over-claim. (Earlier wordier draft retired — keep it short.)

## 31.4 Tweet — launch announcement (HOLD until the pool is LIVE)
> Collateral that can still sell itself — now for collectibles.
>
> Borrow SOL against your tokenized graded cards from Collector Crypt, Courtyard, Phygitals & more — in
> one place. Valued on real sold comps across every marketplace. Fixed-term. Only the proven-liquid ones.
>
> Memecoins · Tokenized stocks · Collectibles. Live now 👇
> magpie.capital/collectibles

*Gate:* do NOT post until originations are live + audited. "Live now" must be literally true.

## 31.5 Thread — the "why we're different" story (launch companion, optional)
1. Everyone who tried to lend against collectibles either couldn't price them, or trusted one price source
   and got drained. It's a graveyard of the right idea with the wrong risk engine.
2. The fix isn't a fancier AI number — it's *proof*. We only lend against a card if it has actually SOLD,
   repeatedly and recently, across multiple independent marketplaces. No sold record → no loan.
3. And we price it off those real sales, cross-sourced — so no single venue can inflate your borrowing
   power. If the sources disagree, we don't lend.
4. Your card's already vaulted on Collector Crypt, Courtyard, Phygitals… Magpie lends against all of them
   in one place — each a capped lane, same honest bar.
5. Fixed-term, conservative LTV, a reserve sized for a bear market. Collateral that can still sell itself.

*Every line maps to §31.2. No APR/volume/return claims. No "institutional" hype (the [Pip incident]
lesson). No named individuals.*

## 31.6 Alignment checklist (run before any post)
- [ ] LTV shown = **≤50 / ≤40 / ≤25**, matching site + [doc 26](26-launch-allowlist.md) + prototype params.
- [ ] Status wording matches reality — "in design" until live; "live" only after audited originations.
- [ ] Names only of **platforms** (Collector Crypt/Courtyard/Phygitals/BAXUS…), never a person; no real names.
- [ ] No specific APR, volume, TVL, or return figures (none are published/true yet).
- [ ] No copyrighted character art or grader marks in the media (operator-owned photos only — [doc 14.8]).
- [ ] Slogan + three-class framing consistent with the homepage.
- [ ] Nothing forward-looking stated as fact ("will be the #1…"): aspiration is fine, certainty isn't.

## 31.7 Ties
The words here are downstream of the strategy — they never lead it. If a doc changes a number or a claim,
this file and the site change with it. Ties to [doc 15](15-collector-ux-gtm.md) (GTM), [doc 29](29-winning-wedge-best-permissionless-provider.md)
(positioning), [doc 30](30-aggregated-collateral-model.md) (the aggregation message).
