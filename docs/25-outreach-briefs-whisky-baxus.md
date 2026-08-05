# 25 · Phase-1 Outreach Briefs — Whisky: BAXUS + Whiskystats + Rare Whisky 101

> Ready-to-adapt outreach for the **whisky/spirits** collateral class ([doc 20 §20.5](20-tokenization-platforms-collateral-sources.md)),
> the natural first expansion beyond cards. Three counterparties: **BAXUS** (the Solana-native
> tokenization *platform* + on-chain sales corpus — a two-sided data + collateral relationship),
> **Whiskystats** (the primary realized-hammer data feed), and **Rare Whisky 101** (independent hammer
> valuations, already a B2B feed to banks/insurers). Same discipline as the card briefs
> ([doc 23](23-outreach-briefs-psa-fanatics.md)): a licensed feed + an independently-sourced realized
> feed, and the whole thing gated on the same [doc 21](21-liquidity-eligibility-proof-of-sale.md)
> proof-of-sale rules. Personalize the sender before sending. Design-stage — scoping terms, not committing.

## 25.0 Shared framing (use in all three)
- **Who we are:** Magpie ([magpie.capital](https://magpie.capital)) — a Solana lending protocol. We're
  extending our *tokenized, authenticated, vaulted collectible* lending to **fine whisky/spirits**.
- **Why we're reaching out (honest hook):** we value collateral **only off REAL realized auction hammer
  prices, never listings/asks** — so accurate, bottle-identity-keyed *sold* data is the core of our risk
  engine. We want it the right way: a **paid license/partnership**, not scraping.
- **What we will / won't do (the terms gate):** compute + display a **derived appraised value** to a
  borrower and use it internally for underwriting; we do **not** republish or resell raw hammer data or
  rebuild a public price index. Attribution + caps honored.
- **Whisky identity key:** `{ distillery, bottling/expression, vintage/age, bottle size (cl), cask/batch #
  where present, ABV, condition/fill-level }`.
- **Independence caveat we're explicitly managing** ([doc 22.4](22-realized-sales-venue-comp-data-map.md)):
  most UK whisky feeds sit on the **same underlying auction corpus**, so we need **per-venue-tagged data**
  (to filter to independent venues) and a **genuinely separate corpus** (BAXUS on-chain US sales) — three
  indices on one corpus is one source.

---

## 25.1 Brief A — BAXUS (two-sided: collateral-source platform + data + on-chain corpus)

**Goal:** a relationship covering (1) BAXUS as a **vetted collateral-source platform** (Solana-native
tokenized whisky, RFID+360-scan authentication, own insured vault, burn-on-redeem — [doc 20 §20.5](20-tokenization-platforms-collateral-sources.md)),
(2) access to its **pricing data** (BoozApp, 45+ sources, 75k+ bottles), and (3) its **on-chain sales** as
a genuinely separate realized corpus. BAXUS already runs on-Solana lending (via Bridgesplit), so a data/
integration relationship is well-precedented.

### Cover note (template)
> Subject: Partnership inquiry — Magpie lending against BAXUS-tokenized whisky (data + collateral)
>
> Hi [BAXUS partnerships team],
>
> I'm from **Magpie** (magpie.capital), a Solana lending protocol. We let owners of tokenized,
> authenticated collectibles borrow against them **without selling**, valuing collateral **only off real
> realized sales.** BAXUS is the clearest Solana-native fit in spirits — RFID+scan authentication, your
> own vault, and an existing on-Solana lending market — so we'd love to explore a two-sided relationship:
>
> 1. **Collateral source:** treat BAXUS-tokenized bottles as an eligible, capped collateral lane.
> 2. **Data:** license your **BoozApp** pricing / realized-sale data for our appraisal engine (derived
>    valuation shown to borrowers — not a republished price index).
> 3. **On-chain sales:** confirm we can index BAXUS on-chain trades directly as an independent realized
>    corpus.
>
> Could we scope **data terms, redemption/lien mechanics for a lender, and integration** on a short call?
> Spec below. Thanks — [name/role] · [contact] · magpie.capital

### What we'd consume / confirm (spec)
- **Realized-sale + valuation data:** per bottle-identity — `sale/valuation price`, `date`, `source`,
  bottle-identity fields; via **BoozApp API or a licensed feed** (confirm the API is available to external
  protocols with auth/SLA/rate limits).
- **On-chain sales readability:** the BAXUS marketplace program / sale events we can index directly
  (Helius) as an independent corpus — program IDs / event shapes if documented.
- **Custody + redemption + lien:** vault custodian + insurance; burn-to-redeem mechanics + timing; and
  critically **whether a lender can hold an enforceable claim / control while a loan is open** (the
  whisky analog of OQ-5 / the [doc 14.6](14-legal-regulatory.md) bailee question).
- **Authentication:** how RFID/scan binds to the token; proof-of-reserves status.

### Terms questions
1. Is BoozApp/realized data available under a **commercial license**, with **derived-value display**
   rights, pricing, rate limits, SLA?
2. Are BAXUS sale prices/valuations **readable on-chain**, or off-chain API only?
3. **Bailee/lien:** can a third-party lender perfect a claim on the vaulted bottle during a loan?
4. **Collateral-source terms:** any partnership to treat BAXUS bottles as an eligible lane; custody/
   insurance limits; proof-of-reserves.

---

## 25.2 Brief B — Whiskystats (realized-hammer data license — the primary backbone)

**Goal:** license the **Whiskystats "Whisky Data API"** — aggregated **auction hammer results** keyed to a
unique bottle ID — as the **primary realized-sales feed** for whisky ([doc 22.4](22-realized-sales-venue-comp-data-map.md)).

### Cover note (template)
> Subject: Data-license inquiry — Whiskystats Whisky Data API for a collateral-valuation use case
>
> Hi [Whiskystats team],
>
> I'm from **Magpie** (magpie.capital), a Solana lending platform building a way to borrow against fine
> whisky **without selling**, valuing bottles **strictly off realized auction hammer prices.** Your
> Whisky Data API — aggregated hammer results keyed to a unique whisky ID — is exactly the realized
> backbone we need. We'd compute a **derived appraised value** for underwriting, **not** republish your
> data or rebuild a public index. Could we scope **pricing, access, rate limits, and redistribution
> terms**? Spec below. Thanks — [name/role] · [contact] · magpie.capital

### Data we'd consume (spec)
- Per realized auction result: `hammer_price`, `sale_date`, `auction_house/venue`, unique **whisky ID** +
  identity fields `{ distillery, expression, vintage/age, bottle size, ABV }`.
- **Per-venue tagging** so we can filter to venues independent of any single corpus (independence rule).
- Scope: full history + ongoing (daily/delta). Access: the documented **Whisky Data API**.

### Terms questions
1. **Commercial license** + pricing tiers (public pricing isn't exposed → this is the scoping call).
2. **Redistribution/display:** may we show a **derived valuation** to end users? Attribution? Caps?
3. **Access:** API rate limits, volume, update cadence, SLA.
4. **Coverage/keying:** completeness + whether results carry the source venue (for independence filtering).
5. Any restriction on **lending/financial-valuation** use.

---

## 25.3 Brief C — Rare Whisky 101 (independent hammer valuations — the corroborator)

**Goal:** a **B2B data feed** from **Rare Whisky 101** — hammer-based valuations + indices since 2008,
already consumed by **banks and insurers** — as the **independent corroborating** realized source.

### Cover note (template)
> Subject: B2B data-feed inquiry — Rare Whisky 101 valuations for collateral underwriting
>
> Hi [Rare Whisky 101 data team],
>
> I'm from **Magpie** (magpie.capital), a Solana lending platform underwriting loans against fine whisky
> off **realized hammer prices**. You already provide hammer-based valuation feeds to banks and insurers
> for exactly this kind of asset-backed use — we'd like to consume your data the same way, as the
> **independent corroborating source** alongside a primary feed, to compute a derived appraised value
> (not to republish your indices). Could we scope a **B2B data agreement** — coverage, access, pricing,
> and redistribution terms? Thanks — [name/role] · [contact] · magpie.capital

### Data we'd consume (spec)
- Per-bottle hammer valuations/history + relevant indices, keyed to bottle identity; ideally with the
  **contributing venue** tagged (independence).
- Access: B2B feed / API per your standard bank/insurer arrangement.

### Terms questions
1. **B2B data-agreement** terms + pricing for a lending/valuation use.
2. **Redistribution/display** of a **derived value** to end users; attribution; caps.
3. **Coverage/depth** + how far back; update cadence.
4. **Independence:** which underlying auction houses feed the valuations (so we can confirm it's a
   distinct corpus from our primary feed, not the same UK auction pool).

---

## 25.4 Self-serve / no-outreach legs (wire these directly)
- **WhiskyHunter** — free public JSON API ("only lots actually sold") — an aggregate cross-check
  (confirm commercial-use terms, but no license needed to start).
- **Direct auction houses** (Whisky Auctioneer, Scotch Whisky Auctions) — ingest their own published
  hammer results for ≥1 venue-native realized leg (respect ToS; prefer a data arrangement over scraping
  for production).
- **BAXUS on-chain sales** — index directly from Solana (Helius): a genuinely separate US corpus we own
  the data leg for (no third-party redistribution gate).

## 25.5 Why these, and what "good" looks like
- **Whiskystats (primary) + Rare Whisky 101 or a direct auction house (independent) + BAXUS on-chain
  (separate corpus)** satisfies the [doc 21](21-liquidity-eligibility-proof-of-sale.md) proof-of-sale gate
  with genuine cross-corpus independence — the same shape as cards (PSA APR + Fanatics), tuned for whisky.
- **The gate on every call is the same as cards: redistribution/display rights for a DERIVED value.**
  Availability isn't the blocker; the ToS is.
- **Success = a licensed realized-hammer feed + an independent corroborator + the BAXUS relationship
  (data + collateral-source + a lender-lien answer)** — which opens the whisky lane against the same
  [doc 24](24-oracle-prototype-spec.md) engine (a WhiskySalesSource adapter behind the same interface).

## 25.6 Fallbacks
- If Whiskystats/RW101 terms don't work → lean on **direct auction-house hammer ingest (≥2 venues) +
  WhiskyHunter + BAXUS on-chain** as the realized legs (more engineering, fewer licenses).
- If no lender-lien answer from BAXUS (OQ-5 analog) → keep whisky **fixed-term, low-LTV, small-cap** and
  gate hard until custody/lien is enforceable — same posture as cards.

## Sources
Carried from [doc 20 §20.5](20-tokenization-platforms-collateral-sources.md) + [doc 22.4](22-realized-sales-venue-comp-data-map.md)
(BAXUS/BoozApp; Whiskystats Whisky Data API; Rare Whisky 101 B2B feeds; WhiskyHunter free API; Whisky
Auctioneer / Scotch Whisky Auctions). License pricing + redistribution terms are the outreach items.
