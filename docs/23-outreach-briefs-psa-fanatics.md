# 23 · Phase-1 Outreach Briefs — PSA (APR) & Fanatics Collect (PWCC)

> Ready-to-adapt outreach for the two data relationships that unlock the **independent, cert-native
> realized-sales oracle** ([doc 22](22-realized-sales-venue-comp-data-map.md)): a **PSA / Collectors
> Universe** license for *Auction Prices Realized (APR)*, and a **Fanatics Collect (PWCC)** sales-history
> data partnership. Both are commercial/licensing conversations, not self-serve APIs. Personalize the
> sender/contact before sending. Design-stage — we're scoping terms, not committing volume yet.

## 23.0 Shared framing (use in both)
- **Who we are:** Magpie ([magpie.capital](https://magpie.capital)) — a Solana lending protocol. We're
  building a product that lets owners of **tokenized, independently-authenticated graded cards** borrow
  against them **without selling**.
- **Why we're reaching out (the honest hook):** we value collateral **only off REAL realized sales, never
  listings** — so accurate, cert-keyed *sold* data is the core of our risk engine. We want to consume it
  the **right way: a paid license**, not scraping.
- **What we will and won't do with the data (say this plainly — it's the terms gate):** we compute and
  display a **derived appraised value** to a borrower (a single valuation number + eligibility), and use
  it internally for underwriting. We do **not** intend to **republish or resell your raw comp tables** or
  rebuild a competing public price guide. We'll attribute the source and honor caps.
- **Tone:** concise, specific, no over-promising. We're asking for a scoping call + terms, not pitching hype.

---

## 23.1 Brief A — PSA / Collectors Universe (Auction Prices Realized license)

**Goal:** license **APR** as our **primary independent realized-sales anchor** — it's multi-venue (eBay +
Heritage + Goldin + Memory Lane) and native to {grader, grade, cert}, the de-facto graded standard.

### Cover note (template)
> Subject: Data-license inquiry — PSA Auction Prices Realized (APR) for a collateral-valuation use case
>
> Hi [PSA data-licensing / business-development team],
>
> I'm reaching out from **Magpie** (magpie.capital), a Solana-based lending platform. We're building a
> product that lets collectors borrow against **tokenized, PSA-graded cards** without selling them, and
> our underwriting values each card **strictly off realized sales, not listings.**
>
> PSA's **Auction Prices Realized** is the authoritative, cert-and-grade-keyed record of what cards
> actually sell for, and we'd like to license it as a data feed rather than rely on scraping. We would
> use it to compute a **derived appraised value** shown to the borrower and used internally for
> eligibility/underwriting — **not** to republish or resell your raw APR data or build a competing price
> guide.
>
> Could we set up a short call to understand your **commercial data-license options, access method,
> pricing, and redistribution terms**? A short spec of exactly what we'd consume is below.
>
> Thanks, [name / role] · [contact] · magpie.capital

### Data we'd consume (spec)
Per realized sale, keyed to exact identity:
- `grader` (PSA), `grade`, `cert_number`
- `set`, `card_name`, `card_number`, `variant` (1st-ed / shadowless / holo / language, etc.)
- `sale_price`, `sale_date`, `source_venue` (eBay / Heritage / Goldin / Memory Lane / …)
- (optional) **population** by grade — for scarcity/liquidity context.
- **Scope:** Pokémon + TCG to start; full historical depth available + ongoing (daily or delta) updates.
- **Access:** a licensed **API or bulk/delta feed** (the public API today exposes cert-verify only, so
  this needs the commercial tier).

### The commercial/terms questions to get answered (the gate)
1. Is APR available under a **commercial data license**? What **tiers / pricing**?
2. **Redistribution/display rights:** may we display a **derived valuation** (not the raw comp table) to
   end users? Required **attribution**? Any cap on how many derived look-ups we surface?
3. **Access + limits:** API vs bulk feed; **rate limits**, volume tiers, update cadence, uptime/SLA.
4. **Coverage & depth:** Pokémon-by-cert completeness; how far back; how quickly new sales land.
5. **Use restrictions:** any prohibition on using APR for **lending / financial valuation** specifically.
6. **Exclusivity / term length / termination** for the license.

### Our commitments (offer)
Pay for the license; **display only derived valuations**, never resell raw APR; attribute PSA; honor
rate/volume caps; sign a DPA/redistribution addendum as needed.

---

## 23.2 Brief B — Fanatics Collect / PWCC (sales-history data partnership)

**Goal:** a data partnership for **Fanatics Collect (PWCC) realized sales-history** — the richest
cert-level (grade + sub-grades + cert) **independent, non-eBay** realized source — as our **corroborating
independent leg** (satisfies the "≥1 realized source structurally independent of eBay" rule, [doc 22.2](22-realized-sales-venue-comp-data-map.md)).

### Cover note (template)
> Subject: Data partnership inquiry — Fanatics Collect / PWCC realized sales-history
>
> Hi [Fanatics Collect / PWCC data-partnerships team],
>
> I'm from **Magpie** (magpie.capital), a Solana lending platform building a way for collectors to borrow
> against **tokenized, graded cards** without selling. Our underwriting values cards **only off realized
> sales**, and Fanatics Collect / PWCC is one of the few **independent, high-integrity auction venues**
> with cert-level sold data — which makes it exactly the corroborating source we want alongside a licensed
> primary feed.
>
> We'd like to consume your **realized sales-history** (hammer/sale price + date, keyed to grade + cert)
> via a **licensed feed or data-sharing agreement**, to compute a derived appraised value for underwriting
> — **not** to republish your raw results. Could we scope your **data-partnership options, access, pricing,
> and redistribution terms** on a short call?
>
> Separately, we work with tokenization/custody platforms in this space and are happy to explore a broader
> relationship. Spec of what we'd consume below. Thanks — [name/role] · [contact] · magpie.capital

### Data we'd consume (spec)
Per realized auction/marketplace sale:
- `grader`, `grade`, `sub_grades` (where present), `cert_number`
- `set`, `card_name`, `card_number`, `variant`
- `sale_price` (hammer / final), `sale_date`, `lot/listing_id`
- **Scope:** Pokémon + TCG; historical + ongoing.
- **Access:** licensed **API / feed / data-sharing agreement** (Fanatics/PWCC has no public API today).

### The commercial/terms questions to get answered
1. Is realized sales-history available via a **commercial data license / partnership**? **Pricing**?
2. **Redistribution/display:** may we surface a **derived valuation** to end users? **Attribution**?
3. **Access + limits:** feed vs API; rate/volume; update cadence; SLA.
4. **Coverage & depth:** Pokémon-by-cert completeness; sub-grade availability; history depth.
5. **Use restrictions** for lending/financial valuation; any exclusivity.
6. **Broader relationship (optional):** Fanatics Collect is also a tokenization/custody player (via
   Phygitals). Interest in a two-sided relationship — **data feed + being a vetted collateral-source
   platform** ([doc 20](20-tokenization-platforms-collateral-sources.md))?

### Our commitments (offer)
Pay for the partnership; display only derived valuations, never resell raw results; attribute the source;
honor caps; formalize with a data agreement.

---

## 23.3 Why these two, and what "good" looks like
- **PSA APR + Fanatics/PWCC together satisfy independence** ([doc 22.2](22-realized-sales-venue-comp-data-map.md)):
  a multi-venue cert-native anchor + a genuinely non-eBay realized corroborator. (We deliberately do **not**
  pair PSA APR with Card Ladder — same parent — and treat the cheap PokemonPriceTracker API as an
  eBay-derived cross-check only, not an independent source.)
- **The single most important term to nail on each call = redistribution/display rights.** Availability
  isn't the blocker; the ToS is. We need explicit permission to show a **derived valuation** to users. If a
  provider forbids any public-facing/derived use (as PriceCharting's ToS does), it can't be a production
  leg — only an internal sanity check.
- **Success = a signed license/partnership with (a) cert-keyed realized data, (b) redistribution rights for
  a derived value, (c) workable rate/cost.** That closes the OQ-4 residual and unblocks the
  [Phase-2 oracle prototype](16-build-plan.md).

## 23.4 Fallbacks if terms don't work
- If PSA won't license APR for this use → lean on **Heritage prices-realized** (independent venue) +
  Fanatics as the two realized legs; or negotiate **Card Ladder enterprise** (multi-venue, but confirm it
  isn't just re-serving the same corpus).
- If neither independent venue will license a redistribution-cleared feed → **narrow launch scope** to the
  cards where **PokemonPriceTracker (licensed, commercial-OK) + a directly-owned data leg** (e.g. indexing
  a tokenization platform's own on-chain marketplace sales) give enough proven-sale coverage to satisfy
  [doc 21](21-liquidity-eligibility-proof-of-sale.md) — accepting a smaller eligible set rather than
  weakening the independence rule.
