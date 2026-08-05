# 24 · Appraisal-Oracle Prototype Spec (read-only, back-testable)

> The Phase-2 build ([doc 16](16-build-plan.md)): an **off-chain, read-only** appraisal engine that turns
> a card's identity into `{eligible?, appraised value, tier, max LTV, confidence, provenance}` by applying
> the proof-of-sale gate ([doc 21](21-liquidity-eligibility-proof-of-sale.md)) to real realized-sale feeds
> ([doc 22](22-realized-sales-venue-comp-data-map.md)). It **moves no funds, touches no chain, signs
> nothing** — it produces a valuation + an audit trail we can **back-test** against subsequent real sales
> and **red-team** before any on-chain program is built ([doc 6](06-architecture.md)). Cards first; the
> same interface generalizes to whisky/watches.

## 24.1 Inputs & output
**Input** — the exact instrument identity (from the tokenized-collateral metadata / [doc 20](20-tokenization-platforms-collateral-sources.md) issuer):
```
CardId = { grader, grade, cert_number, set, card_number, variant, language }
IssuerQuote = { platform, fmv_or_buyback, as_of } | null   # e.g. Courtyard FMV, CC insured value — a cross-check, NOT the value
```
**Output** — a deterministic, fully-explained appraisal:
```
Appraisal = {
  eligible: bool,
  reason_codes: [str],           # every gate that passed/failed (auditable)
  liquidity_tier: "L1"|"L2"|"L3"|null,
  appraised_value_usd: number|null,   # AV
  max_ltv_bps: int,              # 5000 / 4000 / 2500 per tier (doc 13/17)
  max_loan_usd: number|null,     # AV × max_ltv
  confidence: 1..5,              # Card-Ladder-style recency meter
  haircuts: { staleness, thin_index, divergence },
  provenance: [SaleRecord...],   # the exact comps used, per source, corpus-tagged
  as_of: timestamp
}
```

## 24.2 Data-source interface (pluggable, corpus-tagged)
Each feed implements one interface; the pipeline is source-agnostic. **`corpus` is the independence key,
not the brand** ([doc 22.2](22-realized-sales-venue-comp-data-map.md)).
```
interface RealizedSalesSource {
  id: str                       # "psa_apr" | "fanatics_pwcc" | "ppt"
  corpus: str                   # "multi" | "fanatics" | "ebay"  <-- independence keyed to THIS
  independent_of_ebay: bool     # psa_apr(non-ebay slice)=true, fanatics=true, ppt=false
  realizedSales(CardId, window) -> [SaleRecord]   # SOLD only, never asks
}
SaleRecord = { price_usd, sale_date, venue, seller_id?, corpus, matched_identity }
```
Launch adapters ([doc 22](22-realized-sales-venue-comp-data-map.md)): **`psa_apr`** (anchor, corpus=multi,
independent) · **`fanatics_pwcc`** (corroborator, corpus=fanatics, independent) · **`ppt`**
(PokemonPriceTracker, corpus=ebay, **cross-check only**). A source with no license yet returns empty →
the gate fails closed for cards that depend on it.

## 24.3 The pipeline (deterministic; every stage emits a reason_code)
```
appraise(cardId, issuerQuote):
  1. IDENTITY      normalize + validate cardId; require grader∈{PSA,CGC,BGS,SGC} + cert.  else INELIGIBLE("bad_identity")
  2. FETCH         sales = ⋃ source.realizedSales(cardId, window=12mo)   # SOLD only
  3. ARM'S-LENGTH  drop wash/round-number/same-party/sub-fee sales (PS-6)
  4. PROOF-OF-SALE  (doc 21 §21.2 — ALL must pass, else INELIGIBLE)
       PS-1 ≥5 sales/12mo AND ≥2/90d
       PS-2 ≥3 distinct sellers
       PS-3 ≥2 distinct venues
       PS-4 ≥1 sale from a corpus with independent_of_ebay=true   # corpus-keyed, not brand
       PS-5 exact-identity match on every comp
       PS-7 proven value ≥ $250 floor
  5. MARK          value = recency_weighted_trimmed_median(sales)         # NOT last-sale/mean/listing
                   reject outliers > 3·MAD, re-check PS-1..PS-3 on survivors
  6. LIQUIDITY     tier = classify(freq, recency, dispersion)  ->  L1|L2|L3|INELIGIBLE (doc 21 §21.3)
  7. HAIRCUTS      staleness (conf 5→0%,4→5%,3→15%,2→30%,1→exclude) + thin/index; value *= (1-haircuts)
  8. DIVERGENCE    if issuerQuote and issuerQuote.fmv > value*(1+0.15):  INELIGIBLE("unfairly_priced")   # hard-refuse >15%
                   else continuous haircut below 15%
  9. AV            AV = min(value, issuerQuote.fmv ?? value)             # origination min(); maintenance uses independent `value`
 10. SIZE          max_ltv = {L1:5000, L2:4000, L3:2500} bps; max_loan = AV × max_ltv
                   50% (L1) gated: require tier==L1 AND term ≤ short-band (doc 13.2)
 11. RETURN        Appraisal{...} with full provenance + reason_codes
```
**Fail-closed everywhere:** any missing/insufficient signal → `eligible=false` with the specific
`reason_code`. Never silently fall back to eBay-only comps (re-opens F-1).

## 24.4 Key functions (precise)
- `recency_weighted_trimmed_median(sales)`: sort by date; weight `w = exp(-age_days / τ)` (τ≈90d); drop
  top/bottom decile by price; return weighted median of the rest. **Down-weight, never ignore, older sales.**
- `classify(...)` → **L1**: ≥12 sales/12mo, last ≤14d, dispersion(IQR/median) ≤20%. **L2**: ≥6, ≤30d, ≤30%.
  **L3**: ≥4, ≤90d, ≤40%. Else INELIGIBLE. Dispersion over-threshold drops one tier.
- `arms_length_filter(sales)`: remove same seller↔buyer loops, ≥3 identical round-number prints from one
  seller, and prices below the resale-fee floor.
- **Asymmetry (F-8):** for a *maintenance* re-appraisal (if a later MtM layer ships), a value **drop**
  applies immediately; a value **rise** requires persistence across N re-appraisals before it counts.

## 24.5 Back-test harness (how we validate before trusting it)
1. **Historical replay:** for a sample of cards at past dates `t`, run `appraise()` using only sales
   *before* `t`; compare `AV(t)` to the **actual next realized sale** after `t` and to a **simulated
   liquidation** (graduated-markdown resale at `βᵣ`, [doc 13](13-economic-model.md)).
2. **Metrics:** appraisal error distribution; **% of loans that would have recovered principal** at
   A50/B40/C25 across the sample's drawdowns; false-eligible rate (admitted a card that then proved
   illiquid); false-ineligible rate (excluded a genuinely liquid card).
3. **Tune:** thresholds (PS counts, τ, dispersion bands, haircut curve, 15% divergence) to **minimize
   loss-given-default first, eligible-set size second.** Safety over coverage.
4. **Gate:** the appraiser is "good" only when, on out-of-sample data, conservative AV + the bands keep
   modeled recovery ≥ loan in the median and reserve-covered in the tail ([doc 13.4](13-economic-model.md)).

## 24.6 Red-team hooks (must resist on adversarial test data — [doc 5](05-threat-model.md))
Each attack is a fixture the prototype must survive:
- **T-1 wash trading:** inject same-seller round-number sales → arms-length filter + PS-2/PS-6 reject; value unmoved.
- **T-12 shill / single-venue pump:** sales all from one venue → PS-3 fails; value unmoved.
- **F-1 shared-source (eBay):** move only eBay-corpus prices → PS-4 (needs independent corpus) + divergence
  gate hold; independent mark unmoved.
- **T-13 index inflation:** push the set/character index → we don't price off index (index-projection
  ineligible, §21.4); no effect.
- **thin-dispersion:** wide realized spread → dispersion gate drops tier / excludes.
- **issuer-FMV inflation:** issuer posts a high FMV → divergence hard-refuse >15%; AV = independent mark.

## 24.7 Explicitly OUT of scope for the prototype
No on-chain program, no vault/custody, no fund movement, no live liquidation, no borrower UI — those are
Phase 3+ ([doc 16](16-build-plan.md)). The prototype is a **pure function + back-test + red-team fixtures**
that proves the *valuation* is conservative and manipulation-resistant **before** any capital or code
touches mainnet. Its outputs are advisory only.

## 24.8 Ties
Implements [doc 21](21-liquidity-eligibility-proof-of-sale.md) (the gate), consumes [doc 22](22-realized-sales-venue-comp-data-map.md)
(the feeds), produces the AV that [doc 3](03-underwriting-ltv.md)/[doc 13](13-economic-model.md) size loans
against, and is the artifact **Gate 2** ([doc 16](16-build-plan.md)) requires (conservative + manipulation-
resistant on historical + adversarial data). Enforces invariants I-1, I-4, I-6, I-7 (corpus-keyed), I-10/I-11.
