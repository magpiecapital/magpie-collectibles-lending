# Appraisal-Oracle Prototype

Reference implementation of the read-only appraisal engine specified in
[`../docs/24-oracle-prototype-spec.md`](../docs/24-oracle-prototype-spec.md), enforcing the
proof-of-sale / proven-liquidity gate ([doc 21](../docs/21-liquidity-eligibility-proof-of-sale.md))
against realized-sale feeds ([doc 22](../docs/22-realized-sales-venue-comp-data-map.md)).

## What this IS
- A **pure, deterministic function**: `appraise(cardId, issuerQuote, sources, now) → Appraisal`.
- It turns a card's identity into `{ eligible?, appraisedValueCents, tier, maxLtvBps, maxLoanCents,
  confidence, haircuts, reasonCodes, provenance }`.
- A **back-test harness** (replay vs. subsequent real sales) and a **red-team test suite** that proves
  the valuation is conservative and **manipulation-resistant**.

## What this is NOT (hard boundaries)
- **No chain, no funds, no signing, no custody, no borrower UI.** It computes a *valuation only*.
- **No network in the core.** Data sources are injected; the shipped sources are deterministic mocks.
  A real HTTP/licensed adapter would be a separate, individually-validated source module.
- Not a launch artifact — it exists to validate the *logic* before any on-chain program (Phase 2 of
  [doc 16](../docs/16-build-plan.md)).

## Security posture (the point of this prototype)
The appraisal oracle is the #1 drain surface, so security here means two things and both are tested:
1. **Manipulation-resistance.** Wash, shill, single-venue, shared-source (eBay), index-inflation,
   thin-dispersion, and issuer-FMV-inflation attacks must leave the appraised value **unmoved** or make
   the card **ineligible**. See [`test/redteam.test.js`](test/redteam.test.js).
2. **Defensive input handling.** Every sale record from a feed is attacker-influenced. All inputs are
   strictly validated (types, enums, finite non-negative integer-cent prices, sane dates); malformed
   records are **dropped, never trusted**; array sizes are capped (DoS); numbers use **integer cents**
   (no float drift). See [`src/util/validate.js`](src/util/validate.js) and
   [`test/validation.test.js`](test/validation.test.js).

Additional guarantees: **fail-closed** (any uncertainty → ineligible + a reason code), **deterministic**
(no wall-clock or randomness inside the logic — `now` is injected), and **zero dependencies** (no
supply-chain attack surface — runs on Node's standard library alone).

## Property-based fuzzing (`test/fuzz.test.js`)
Beyond the fixed red-team fixtures, a seeded (reproducible) fuzzer asserts the security
invariants across thousands of randomized + hostile inputs:
- **P1 total/robust** — for ANY input (garbage identity, adversarial records, throwing sources,
  junk `now`), `appraise` returns a well-formed result and **never throws** (5,000 cases).
- **P2 fail-closed** — ineligible ⇒ value + loan are null.
- **P3 bounds** — eligible ⇒ integer AV ≥ floor, 0 ≤ maxLoan ≤ AV, tier ∈ {L1,L2,L3}.
- **P4 determinism** — `appraise(x)` deep-equals `appraise(x)`.
- **P5 wash-invariance** — same-seller/same-price wash sales at any price never move AV.
- **P6 anchoring** — inflating ONLY the eBay corpus never drags the value toward the pump.

## Known limitation (found by the fuzzer): tier boundaries are a step function
Tier → LTV is discrete (L1 50% / L2 40% / L3 25%). A card sitting **exactly on a tier boundary**
(e.g. the L1/L2 dispersion threshold) can flip tiers on a tiny input change, stepping the max
**loan** by the LTV gap. The appraised *value* stays anchored (P6 holds) — this is not a
value-tracking flaw — but it is a **boundary-manipulation surface**: an actor able to nudge the
non-independent (eBay) corpus a couple percent could flip a borderline card up a tier.
**Mitigation for a production build (TODO, not in this prototype):** add **hysteresis / a boundary
buffer** — require the tighter classification to hold by a margin (and/or across a re-check window)
before granting the higher tier, so a marginal, manipulable input can't step the LTV. Tracked as a
threat-model item; the pure stateless prototype documents it rather than hides it.

## Run
```
cd prototype
npm test          # node --test — eligibility + validation + red-team
npm run backtest  # historical-replay harness demo
# optional static type-check (dev-only, not a runtime dep):
npx -y typescript@5 tsc -p jsconfig.json --noEmit
```

## Layout
```
src/
  params.js              frozen policy params (LTV bands, gate thresholds, haircuts) — docs 21/13/17
  types.js               JSDoc typedefs
  util/validate.js       strict input validation (security core)
  util/number.js         safe integer-cent math (median, MAD, trimmed mean)
  sources/source.js      RealizedSalesSource interface + corpus-independence helpers
  sources/mockSource.js  deterministic mock feeds (psa_apr, fanatics_pwcc, ppt) for tests/backtest
  pipeline/*.js          identity · armsLength · proofOfSale · mark · liquidity · haircuts · divergence
  pipeline/appraise.js   the orchestrator (pure)
  index.js               public exports
test/                    node:test suites + backtest harness
```
