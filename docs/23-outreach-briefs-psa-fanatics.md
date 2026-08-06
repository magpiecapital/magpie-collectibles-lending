# 23 · Phase-1 Outreach Briefs — PSA (APR) & Fanatics Collect (PWCC)

> **Send-ready** outreach for the two data relationships that unlock the **independent, cert-native
> realized-sales oracle** ([doc 22](22-realized-sales-venue-comp-data-map.md)): a **PSA / Collectors
> Universe** license for *Auction Prices Realized (APR)*, and a **Fanatics Collect (PWCC)** sales-history
> data partnership. Both cover notes below are complete, copy-paste prose — the **only** thing to fill is
> the signature (§23.0.1). Both are commercial/licensing conversations, not self-serve APIs. Design-stage:
> we're scoping terms, not committing volume yet — say so, and never over-promise.

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
- **Credibility hook (use in both):** our **full design, valuation methodology, and threat model are
  public** — [github.com/magpiecapital/magpie-collectibles-lending](https://github.com/magpiecapital/magpie-collectibles-lending),
  overview at [magpie.capital/collectibles](https://magpie.capital/collectibles). A data partner can see
  *exactly* how the feed would be used before signing anything. Transparency is the pitch.
- **Tone:** concise, specific, no over-promising. We're asking for a scoping call + terms, not pitching hype.

## 23.0.1 Send-ready pack — do this before hitting send
**Who to send to** *(confirm the current route on their site — do NOT invent an address):*
- **PSA / Collectors:** there's no published data-licensing inbox — open via the **business/API inquiry
  form on psacard.com**, or a warm **LinkedIn intro to PSA/Collectors business-development / data-licensing**.
  The APR commercial tier is a BD conversation, not self-serve.
- **Fanatics Collect / PWCC:** route through **Fanatics Collect partnerships/support (collect.fanatics.com)**,
  or a **LinkedIn intro to Fanatics Collect BD / former PWCC data leads.**

**From address:** send from a **Magpie-domain address** (e.g. `partnerships@magpie.capital`), never a
personal one — brand consistency + deliverability.

**Signature block** *(fill in before sending — use a Magpie identity, never a personal/third-party one):*
```
— [Your name]
[Title], Magpie
[you@magpie.capital] · magpie.capital/collectibles
github.com/magpiecapital/magpie-collectibles-lending
```

**Attach / link:** the public design repo + the /collectibles overview (credibility). Nothing confidential.

**Pre-send checklist:**
- [ ] Correct recipient/route confirmed on their live site (not a guessed address)
- [ ] Subject is specific (not "partnership opportunity")
- [ ] No over-promising, **no volume/revenue commitment** — we're scoping terms
- [ ] "**Derived value only, never resell raw comps**" stated plainly
- [ ] Links resolve; signature filled with a **Magpie** identity
- [ ] Counsel CC'd if you want legal engaged from the first call

**Follow-up** *(send ~5–7 business days later if no reply):*
> **Subject:** Re: [original subject]
>
> Hi — floating this back to the top of your inbox. Happy to keep it to a 20-minute call to see whether a
> data license is a fit; our full design is public if it's easier to skim async first. Either way, thanks
> for taking a look.
>
> [signature]

---

## 23.1 Brief A — PSA / Collectors Universe (Auction Prices Realized license)

**Goal:** license **APR** as our **primary independent realized-sales anchor** — it's multi-venue (eBay +
Heritage + Goldin + Memory Lane) and native to {grader, grade, cert}, the de-facto graded standard.

### Cover note (send-ready — fill only the signature)
> **Subject:** Data-license inquiry — licensing PSA Auction Prices Realized (APR) for card-collateral valuation
>
> Hello,
>
> I'm reaching out from **Magpie** ([magpie.capital](https://magpie.capital)), a Solana-based lending
> platform. We're building a product that lets collectors borrow against their **PSA-graded, vault-held
> cards without selling them** — and our underwriting values each card **strictly off realized sales,
> never listings.**
>
> That makes PSA **Auction Prices Realized** the single most important data source for us: it's the
> authoritative, cert- and grade-keyed record of what cards actually sell for. We'd like to **license it
> as a proper data feed** rather than scrape it, and use it to compute a **derived appraised value** shown
> to a borrower and used internally for eligibility. To be clear up front: we would **not** republish or
> resell your raw APR tables, or build a competing public price guide — we'd surface only a single derived
> valuation, with attribution to PSA.
>
> So you can see exactly how the data would be used before any agreement, our full underwriting design,
> valuation methodology, and threat model are public
> (github.com/magpiecapital/magpie-collectibles-lending), with a product overview at
> magpie.capital/collectibles.
>
> Could we set up a short call to understand your commercial data-license options — access method,
> pricing, and redistribution/display terms? A precise spec of exactly what we'd consume is below.
>
> Thanks very much,
>
> — [signature]

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

### Cover note (send-ready — fill only the signature)
> **Subject:** Data partnership inquiry — licensing Fanatics Collect / PWCC realized sales-history
>
> Hello,
>
> I'm reaching out from **Magpie** ([magpie.capital](https://magpie.capital)), a Solana-based lending
> platform. We're building a way for collectors to borrow against their **tokenized, graded cards without
> selling them**, and our underwriting values every card **only off realized sales.**
>
> Fanatics Collect — with PWCC's auction history — is one of the very few **high-integrity, non-eBay
> venues** with cert-level sold data, which makes it exactly the **independent corroborating source** we
> want alongside a licensed primary feed. We'd like to **license your realized sales-history** (final /
> hammer price + date, keyed to grade and cert) via a data feed or data-sharing agreement, and use it to
> compute a **derived appraised value** for underwriting — **not** to republish your raw results.
>
> Two things that may be relevant: (1) our full design and methodology are **public**
> (github.com/magpiecapital/magpie-collectibles-lending; overview at magpie.capital/collectibles), so you
> can see precisely how the data is used; and (2) because Fanatics Collect also sits on the
> tokenization/custody side of this market, we'd be glad to explore a **two-sided relationship** — a data
> feed *and* Fanatics-vaulted cards as a vetted collateral source on Magpie.
>
> Could we scope your data-partnership options — access, pricing, and redistribution terms — on a short
> call? A precise spec of what we'd consume is below.
>
> Thanks very much,
>
> — [signature]

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
