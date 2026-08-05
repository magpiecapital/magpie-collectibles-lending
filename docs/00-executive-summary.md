# 0 · Executive Summary

## The opportunity
Lend stablecoins/SOL against **tokenized, independently-authenticated, vaulted physical collectibles** —
**graded Pokémon cards first**, sourced across *multiple* vetted platforms (Collector Crypt, Courtyard,
Phygitals, …; [doc 20](20-tokenization-platforms-collateral-sources.md)), with adjacent proven-liquidity
classes to follow (fine whisky via BAXUS). The token is only the on-chain custody/redemption handle; the
collateral is the **real physical card and its realized-sale value.** Collectors unlock liquidity without
selling and keep the upside; Magpie earns interest on conservative, over-collateralized loans.

## The one rule that defines the product
**We lend only against PROVEN-LIQUID items — things with real, recent, multi-venue *sales* — priced off
what they actually SOLD for, never listings, never an issuer's self-assigned value, never an index
projection ([doc 21](21-liquidity-eligibility-proof-of-sale.md)).** "Collateral that can still sell itself."

## Why it's hard — and how we survive it
1. **Thin, manipulable markets.** → Value off *many* real sales; proof-of-sale gate; outlier/wash rejection;
   ≥1 realized source independent of eBay (**keyed to the transaction corpus, not the brand** — [doc 22](22-realized-sales-venue-comp-data-map.md)).
2. **Cards crash 40–70%.** → Conservative tiered LTV + **short fixed terms** + a real reserve; survive on
   duration + liquidity, not LTV alone.
3. **Illiquid in a downturn (the BendDAO failure).** → Graduated resale to a real clearing price, hard
   concentration caps, a reserve fund, small pilot. Never a make-whole floor peg.
4. **Fake/tampered slabs.** → Cert-level verification + vault attestation; PSA/CGC/BGS/SGC only.
5. **No reliable liquidation *bid* (OQ-3).** The Collector Crypt "buyback" is Gacha-only/72h/off-chain — it
   does **not** backstop a held card ([doc 19.2](19-oq-closeout.md)). → Recovery runs on **marketplace
   resale + burn-to-physical resale**, sized assuming **zero buyback**; issuer buybacks are opportunistic only.
6. **Single-platform counterparty risk.** → Source across **several vetted issuers, each a capped lane**;
   no custodian is a systemic dependency.

## The policy in one screen
- **Appraised Value (AV) = min( haircut *independent realized-comp* mark , issuer quote )** — accepted only
  if they agree; **hard-refuse if the issuer/listing sits >15% above the independent mark** ("unfairly priced").
- **Proof-of-sale gate (fail-closed):** ≥5 realized sales/12mo AND ≥2/90d · ≥3 sellers · ≥2 venues · ≥1
  eBay-independent corpus · exact-identity {grader,grade,set,#,variant} · arm's-length · ≥ $250 floor.
- **LTV on AV:** Tier A (L1 highly-liquid blue-chips) **≤50%** · Tier B **≤40%** · Tier C **≤25%** · else ineligible.
- **Loans are short, fixed-term (30–90d), with NO mid-loan price-liquidation (v1).** Recover at maturity default.
- **Liquidation waterfall:** opportunistic issuer buyback *if live* → **marketplace graduated markdown**
  (reserve price, anti-snipe) → **burn-to-physical resale** → surplus to borrower, shortfall to the reserve.
- **Caps + reserve:** per-card ≤ a fraction of its trailing realized volume · per-character · total-lane ·
  per-platform · **reserve ~10–15% of book** (larger, because there's no buyback buffer and 50% is
  reserve-covered at the tail).

## Structure & v1 (securities-aware)
Launch as **P2P / offerbook** (users set terms — the safest securities posture; [doc 18](18-structure-decision-memo.md))
with **1:1 whole-item redeemable NFTs** (non-securities per the 2026 SEC/CFTC line; avoid fractional), on the
**fixed-term, no-price-liquidation** model ([doc 10](10-fixed-term-v1-spec.md)) — which removes most of the
Critical/High oracle→liquidation attack surface by construction. Mark-to-market is an optional later layer.

## The oracle (our moat)
No platform hands a lender a safe on-chain price — that gap *is* the moat. We build a **cross-sourced,
realized-comp appraisal** ([doc 24](24-oracle-prototype-spec.md)): **PSA Auction Prices Realized** (anchor)
+ **Fanatics/PWCC** (independent corroborator) + PokemonPriceTracker (eBay-derived cross-check only) → a
conservative Appraised Value, back-tested against subsequent real sales and red-teamed against wash/shill/
shared-source/index attacks **before** any capital.

## Status & gate to build
**Design-only; nothing deployed.** Open questions: OQ-2 (drawdowns) & OQ-5 (physical lien) ✅; **OQ-4 🟡**
(independence is achievable via a data license — [doc 22](22-realized-sales-venue-comp-data-map.md));
**OQ-3 🔴** (buyback is not a liquidation rail → rebuilt on resale). **Next:** data-license outreach (PSA +
Fanatics, [doc 23](23-outreach-briefs-psa-fanatics.md)) → read-only oracle prototype + back-test/red-team
([doc 24](24-oracle-prototype-spec.md)) → structure/securities sign-off ([doc 18](18-structure-decision-memo.md)/[doc 14](14-legal-regulatory.md))
→ audit + economic sim → tightly-capped pilot. No capital until the threat model + legal have **no open
Critical/High items**.
