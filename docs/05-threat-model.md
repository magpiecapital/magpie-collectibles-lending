# 5 · Threat Model & Security

**Purpose:** enumerate every way an attacker (or an honest accident) can extract
value or break the system, and specify the defense/invariant that closes it. This
doc must be signed off **with zero open High findings** before any mainnet code.

**Method:** Magpie discipline — *validate every attacker byte*, assume every input
is hostile, and treat the **oracle as the #1 attack surface**. Severity = worst-case
loss × ease.

## Assets to protect
- **Lender capital** (the loan principal).
- **Reserve/insurance fund.**
- **Borrower collateral** (the card NFT and its physical backing).
- **Protocol solvency** (no bad debt, no bank run).

## Trust boundaries
- On-chain: the lending program, the NFT vault PDA, the borrower, the liquidator.
- Off-chain (semi-trusted / untrusted): the valuation oracle service, comp-data
  providers (eBay/PSA/Card Ladder), Collector Crypt (buyback + vault + index), the
  grader (PSA/CGC), the physical vault (PWCC/ALT).

---

## T-1 · Oracle price manipulation (HIGHEST severity)
**Attacker:** wash-trades or shill-bids a specific card up, then borrows against the
inflated mark and walks (never repays); collateral is worth far less than the loan.
**Why it's the top threat:** a mispriced card is a *direct, immediate drain* — the
exact BendDAO-class failure but induced on purpose.
**Defenses (defense-in-depth):**
1. **Realized sales only**, never listings.
2. **Median / trimmed-mean over a comp window** — one print can't move the mark.
3. **Outlier rejection** — comps beyond a band from the median are dropped.
4. **Multi-venue, multi-seller minimum** — reject single-seller clusters (shill signature).
5. **Min-comp gate** (≥2/yr, ≥1/6mo); larger loans require deeper comp history.
6. **Buyback divergence check** — comp mark vs CC reference must agree within ~25–30%.
7. **Conservative AV (haircuts) + low LTV** — even a partial manipulation is absorbed.
8. **Velocity/anomaly monitor** — a card whose comps spiked recently gets flagged for
   manual review and a cooldown before it's borrowable.
9. **Per-card cap** — even a fully successful manipulation is bounded to a few % of the book.
**Residual:** a patient, multi-venue, multi-account wash campaign over months could
still bias a mark. → the low LTV + per-card cap + cooldown bound the damage; high-value
cards route to manual review.

## T-2 · Stale / poisoned data feed
**Attacker or accident:** a comp provider is down, returns stale data, or is spoofed
(MITM / compromised endpoint), so the mark is wrong.
**Defenses:** multi-source with no single point of failure; **staleness→haircut→
ineligible** ladder; signed/authenticated endpoints where available; cross-source
agreement required; if sources disagree beyond tolerance → **refuse** (fail-closed).
**Never** borrow against a single un-cross-checked feed.

## T-3 · Collector Crypt buyback / index attacks (counterparty)
**Vectors:** CC pauses or cuts the buyback after we've lent; CC's *self-indexed*
reference is stale or gamed and we over-value; a **spoofed buyback quote** is fed to
our contract.
**Defenses:**
- Buyback is a **soft floor, never the valuation** — comps are independent.
- **Read the buyback quote on-chain from Collector Crypt's canonical program/account
  only** (verify program id + account owner); never trust an off-chain-relayed quote.
- **Live rate/availability monitor + circuit-breaker** halts originations if it moves.
- **Exposure capped to survive the buyback disappearing entirely** (marketplace fallback).

## T-4 · Counterfeit / tampered slab (physical-digital gap)
**Attacker:** tokenizes a fake or tampered PSA/CGC slab, or swaps the physical card
after vaulting; the NFT points to a worthless/altered card.
**Defenses:** **cert-number verification** against the grader; **physical vault
authentication attestation** required at eligibility; PSA/CGC only; **tamper-flag
exclusion**; **physical re-verification on redemption**. Treat the grader + vault
attestations as trust anchors, and **key comps to the exact cert** so we can't be
shown a different card's price. *(This is a real, PSA-acknowledged risk.)*

## T-5 · Redemption / collateral-swap while collateralized
**Attacker:** borrows against the NFT, then **redeems the physical card** (burning
or withdrawing it) or transfers the NFT out, leaving the vault empty.
**Defenses (INVARIANT):** while a loan is open, the collateral NFT is **program-locked
in the vault PDA and cannot be transferred, burned, or redeemed-to-physical.** Verify
the pNFT freeze/delegate semantics actually enforce this on Solana **before** any real
funds — this is a hard gate, not a UI check. Redemption is only possible after full
repayment and unlock.

## T-6 · NFT-custody / program exploits (on-chain)
**Vectors:** re-entrancy or instruction-ordering bugs in borrow/repay/liquidate;
**fake mint / spoofed metadata** (an NFT that mimics a real card's mint); PDA seed
collisions or missing owner checks; delegate/authority escalation; a liquidation that
can be front-run or replayed.
**Defenses / invariants:**
- **Collateral must be a verified Collector-Crypt-minted pNFT** — check mint authority /
  collection / program provenance; reject look-alikes. (Analog of Magpie's "validate
  the mint" rule.)
- **The vault/delegation authority can NEVER transfer collateral to itself** outside a
  valid, triggered liquidation — the same non-custodial invariant as the core protocol.
- Strict owner/signer checks on every instruction; no unchecked CPI; idempotent,
  replay-safe liquidation; pre-flight simulation before firing (Magpie standard).
- **Every program change adversarially reviewed** and added to the exploit/defense
  catalog before ship; no same-id redeploy that breaks existing loans.

## T-7 · Liquidation gaming / griefing / MEV
**Vectors:** a borrower or third party manipulates the mark down to trigger an unfair
liquidation and buys the collateral cheap; an attacker front-runs/sandwiches a
marketplace liquidation; self-liquidation to capture the borrower's card below value.
**Defenses:** the same anti-manipulation oracle rules apply to the *downside* mark
(median, outlier reject, cross-check) so a single low print can't force liquidation;
**graduated Dutch markdown with a floor** rather than an instant dump; buyback-primary
means most liquidations don't even hit an open market; surplus always returns to the
borrower (removes the incentive to grief for a windfall).

## T-8 · Borrow-and-tank / adverse selection
**Attacker:** borrows against a card they know is about to drop (imminent reprint,
pending pop-report surge, insider bad news), intending to default and keep the loan.
**Defenses:** **reprint/pop-report risk baked into tiering** (modern chase → Tier C
or excluded); short duration limits the window; maintenance mark-to-market catches
the drop and liquidates early; the buyback floor still recovers most of *current*
value. Adverse selection is priced into interest by tier.

## T-9 · Concentration / correlated-crash economic attack
**Vector:** an attacker (or the market) concentrates risk in one card/character, then
crashes it; or a hobby-wide drawdown hits the whole book at once.
**Defenses:** per-card + per-identity caps, total lane cap sized to bear liquidity,
reserve fund, conservative aggregate LTV. The book must survive a simultaneous
40–70% drawdown across all collateral without breaching the reserve.

## T-10 · Governance / admin-key & parameter risk
**Vectors:** a compromised admin key changes LTV/oracle/caps maliciously; a bad
parameter push (e.g., LTV too high) creates instant insolvency.
**Defenses:** least-privilege keys, timelock on risk-parameter changes, multi-sig for
oracle/whitelist/cap changes, and **no privileged change to an existing loan's terms
without an explicit, logged authorization** (Magpie carve-out rule). Parameter changes
go through the same review as code.

## T-11 · Off-chain oracle service compromise
**Vector:** the oracle *service* (which computes AV and posts it on-chain) is
compromised and posts arbitrary values.
**Defenses:** the on-chain program treats the oracle as **semi-trusted** — it enforces
**sanity bounds** (AV can't jump more than X%/day without extra confirmation; AV can't
exceed the on-chain-read buyback reference by more than the divergence band); signed
oracle updates; multiple independent signers for large moves; and the low LTV means a
single bad post can't fully drain a loan before the daily bound + review catch it.

---

## T-12 · Shared-source correlation defeats the cross-check (from adversarial review F-1)
**Attacker:** wash-trades on **eBay**, which is both our deepest comp source AND the
basis of Collector Crypt's buyback reference. Both "independent" legs move together,
so the divergence check ([doc 2.5](02-valuation-oracle.md)) passes exactly when it
should fire. **This was the single most dangerous gap.**
**Defenses:** the divergence check must be against a source **structurally independent
of eBay** — auction-house hammer prices (PWCC/Heritage/Goldin) or a non-eBay index
constituent. See amended **I-7**.

## T-13 · Category-index manipulation (from F-2)
**Attacker:** moves the thin **set/character index** the value model rides, inflating
*every* card keyed to it at once — bypassing per-card caps and needing no fresh
card-specific comp.
**Defenses:** monitor the index like a card (outlier/velocity), cross-check vs a second
independent index, **cap index-only drift's contribution to borrowing power** (**I-10**,
**I-11**), and treat correlated index exposure as one concentration bucket.

## T-14 · Counterparty-induced maintenance liquidation (from F-4)
**Attacker (or CC):** walks down the buyback reference so `AV = min(comp, buyback)`
drops, forcing healthy loans over the maintenance trigger and into the degraded
fallback.
**Defenses:** `min()` is **origination-only**; the **maintenance mark uses the
independent comp**; a buyback drop is an origination-halt signal with hysteresis, never
an instant maintenance shock. See split **I-1**.

## T-15 · Physical-redemption gap (from F-5)
**Attacker:** redeems the **physical** card (CC's off-chain process) while the NFT stays
on-chain "locked" — the lien then secures a claim on an empty vault.
**Defenses:** CC's redemption path must **read and honor our on-chain lien** (reject
redeeming a lien-flagged token), backed by a legal agreement. Until proven, the
redemption-lock is an **open dependency, not an invariant** (see amended **I-2**, OQ).

## T-16 · Third-party grief-liquidation & floorless-auction snipe (from F-6)
**Attacker (third party):** forces a low mark to trigger liquidation, then snipes the
floorless Dutch fallback (which runs precisely when the buyback floor is absent).
**Defenses:** anti-manipulation + **confirmation lag on down-marks** that trigger
liquidation; the Dutch fallback gets a **non-make-whole reserve price** tied to the
independent comp (compatible with I-5) plus anti-snipe (commit-reveal).

## T-17 · Tier-boundary manipulation (found by prototype property-fuzzing, 2026-08-05)
**Attacker:** a card sitting *exactly* on a liquidity-tier boundary (e.g. the L1/L2 dispersion
threshold) is flipped up a tier by a **small (~2%) nudge to the manipulable non-independent (eBay)
corpus** — stepping the LTV, and thus the borrowable loan, by the tier gap (40%↔50%). The appraised
*value* stays anchored to the independent cluster (this is **not** a value-tracking flaw); the surface
is the **discrete tier→LTV step function**.
**Defenses:** a **liquidity boundary buffer** — a borderline card must clear the tighter tier's
thresholds **by a margin**, so borderline cards default to the *conservative* tier and a marginal
manipulation can't step the LTV (implemented in the [prototype](../prototype/README.md)). For
production: **hysteresis** (the higher tier must persist across a re-check window before it grants a
higher LTV) and/or making LTV a **continuous** function of the liquidity metrics to remove the step
entirely. New **I-12**. *(surfaced by fuzzing the appraisal engine — the value of red-teaming in code.)*

---

## Security invariants (must always hold)
- **I-1 (split)** Origination: a loan never exceeds `LTV_tier × AV`, `AV = min(haircut comp mark, on-chain buyback ref)`. **Maintenance:** the ongoing mark that can trigger liquidation uses the **independent comp mark only** (a counterparty-controlled buyback drop can halt originations but must not, by itself, liquidate a healthy loan). *(F-4)*
- **I-2 (conditional)** Collateral is locked on-chain for the loan's life. This is a true invariant **only once Collector Crypt honors the on-chain lien on the physical card**; until proven it is an **open dependency** ([doc 7](07-open-questions.md)), not a guarantee. *(F-5)*
- **I-3** The protocol authority can **never** move collateral to itself except via a validly-triggered liquidation.
- **I-4** No loan originates against a card failing identity/cert/vault/comp-gate/tamper checks.
- **I-5** Liquidation is **never** hard-pegged to a make-whole minimum bid (BendDAO); the Dutch fallback still carries a non-make-whole reserve price tied to independent comp. *(F-6)*
- **I-6** Total, per-card, and per-identity caps are enforced **continuously** (not just at origination), against a conservative/absolute denominator, with ambiguous correlations defaulting to the **same** bucket. *(F-11)*
- **I-7 (strengthened)** The oracle is cross-sourced with **structural independence**: ≥1 confirming realized-sales source not derived from the venue supplying the primary mark (i.e. not eBay-for-eBay). The system **fails closed** — and on an open loan, fail-closed favors the **protocol**, never a frozen favorable mark. *(F-1, F-8)*
- **I-8** Every external input (metadata, cert, comp, buyback quote, oracle post, **index value**) is validated before use.
- **I-9 (new)** `reserve ≥ modeled worst-case aggregate shortfall(book)`, recomputed continuously; originations auto-halt on degradation; reserve exhaustion = halt + orderly wind-down, **never** silent socialized loss. *(F-7)*
- **I-10 (new)** The category index is itself manipulation-monitored and cross-checked against a second independent index; pure index drift has a **capped** contribution to any card's borrowing power. *(F-2)*
- **I-11 (new)** Any **increase** in borrowing power requires fresh, **card-specific, multi-seller** comp support (never index drift or a single print alone) and is bounded **per-day and cumulatively** over a trailing window. *(F-2, F-8, F-9)*
- **I-12 (new)** Tier→LTV must not be flippable by a marginal, manipulable-corpus input: a borderline card must clear each liquidity tier by a **boundary buffer** (defaults to the conservative tier), with production **hysteresis / continuous LTV** to remove the step. *(T-17, prototype fuzz finding)*

## Pre-mainnet security checklist
- [ ] Third-party smart-contract audit (NFT vault, borrow/repay/liquidate, oracle interface).
- [ ] Oracle red-team: attempt a wash/shill manipulation end-to-end on testnet data — **including a shared-source (eBay) campaign that moves comps AND the CC reference together (T-12).**
- [ ] Confirm ≥1 realized-sales source **structurally independent of eBay** is wired into the divergence check (I-7, T-12).
- [ ] Confirm index inputs are manipulation-monitored and cross-checked vs a 2nd index (I-10, T-13).
- [ ] Verify pNFT freeze/delegate prevents NFT redemption while locked **AND** that CC honors the on-chain lien on the **physical** card (I-2, T-15).
- [ ] Verify on-chain read of the CC buyback quote from the canonical program (T-3); confirm maintenance mark is decoupled from it (I-1, T-14).
- [ ] Confirm asymmetric marking (down immediate, up requires persistence) and cumulative borrowing-power bound (I-11, F-8/F-9).
- [ ] Confirm the Dutch fallback carries a non-make-whole reserve price + anti-snipe (I-5, T-16).
- [ ] Economic simulation: 40–70% drawdown + buyback-off + concurrent withdrawals + a grief-liquidation bleed; confirm **I-9** (reserve ≥ worst-case shortfall) holds and define reserve-exhaustion behavior.
- [ ] Confirm every invariant I-1…I-11 has an enforcement point (on-chain where it must be, monitored off-chain where it can't).
- [ ] Add all findings (incl. F-1…F-11) to the Magpie exploit/defense catalog.
- [ ] Re-run adversarial design review — **no open Critical/High findings.**
