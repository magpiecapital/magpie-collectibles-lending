# 14 · Legal & Regulatory Considerations

> **This is NOT legal advice.** It is a design-stage list of issues to raise with **qualified
> counsel** (securities, lending/consumer-finance, money-transmission, and UCC/commercial) before
> any mainnet launch. Nothing here should be relied on as a legal conclusion. The whole program is
> **design-only** and gated on a formal legal review with no unresolved High items — treat this doc
> the way [doc 5](05-threat-model.md) treats security: a checklist of exposures and mitigations.

## 14.1 What is this, legally? (it sits across several regimes at once)
A Magpie card loan is simultaneously: a **secured personal-property loan** (pawn-like), a **crypto
lending product** (USDC/SOL), and an **RWA custody arrangement** (a lien on a physical card held in
a third-party vault). Each regime below can apply independently. The **structure we choose changes
which ones bite** (§14.9).

## 14.2 Securities law — the biggest exposure ⚠️
- **July 2026 SEC guidance is directly on point.** A commissioner statement flagged that
  **curator-managed, yield-pooling lending vaults may require SEC registration or an exemption.** The
  specific trigger actions it named: **appointing curators / delegating strategy, setting risk
  parameters and liquidation thresholds, selecting eligible collateral, and setting interest rates
  and LTV limits.** Where an operator "decides rates, collateral, and liquidation terms," the loans
  "can have the characteristics of **notes that qualify as securities**" (a *Reves* analysis).
- **Our design does all of those things.** The pooled model ([doc 10.6](10-fixed-term-v1-spec.md))
  has Magpie setting LTV bands, eligible-collateral screening, interest rates, and (in the MtM layer)
  liquidation thresholds — **squarely the flagged pattern.** A **pooled lender vault earning yield**
  is exactly the "curator-managed yield pool" at issue.
- **Also:** a **yield-bearing pool/deposit token**, or fractionalized collateral, can itself be a
  security (Howey); retail yield-bearing crypto accounts are treated as securities.
- **Mitigations (for counsel):** favor the **P2P / order-book (offerbook) structure** where
  **borrower and lender set their own rate/LTV/term** and Magpie is neutral infrastructure (Jupiter
  Offerbook's model) — this removes most "operator decides terms" triggers; and/or register/exempt,
  restrict to accredited/non-US users, or decentralize parameter-setting. **This is a real reason to
  prefer P2P over a curated pool** — it cuts against doc 10.6's UX-driven pooled recommendation and
  must be weighed by counsel.

## 14.3 Lending / pawnbroker licensing & usury (state)
- The **fixed-term, keep-or-forfeit, no-price-liquidation** model ([doc 10](10-fixed-term-v1-spec.md))
  is legally a **pawn analog** (a loan secured by pledged personal property). That's the closest
  existing regime.
- **Pawn loans on personal property, typically < 4 months, are usually OUTSIDE the Truth in Lending
  Act** — helpful, but **state pawnbroker licensing** likely applies in many states, and pawn is
  regulated by state banking/consumer-protection divisions.
- **Usury / rate caps (state):** ~40 states cap pawn rates (e.g. **CA 2.5%/mo ≈ 30% APR**, CO/IL 3%/mo
  ≈ 36% APR; some 20–25%/mo; ~10 states no cap). **Our proposed ~10–14% APR is well below these
  caps**, so rate-usury is a low risk — but **licensing per state** is the live question.
- **Counsel items:** whether the model is "pawnbroking" per each target state; whether a licensed
  lender / bank-partnership / SPV is needed; which states to geofence at launch.

## 14.4 Money transmission / MSB (federal + state)
- **Custody or transmission of virtual assets** generally makes a business a **FinCEN Money Services
  Business** (registration + BSA program) and requires **state money transmitter licenses (MTLs)**,
  plus **NY BitLicense** and **California's DFAL** (DFPI license, effective **July 1, 2026**). NY/CA/TX
  have issued cease-and-desists against unlicensed crypto lenders.
- **Mitigation:** a **genuinely non-custodial** design (Magpie never controls user funds; smart
  contracts hold collateral; users self-custody) materially reduces MSB/MTL exposure — the same
  non-custodial invariant ([I-3](05-threat-model.md)) that's already core to the design. Counsel to
  confirm the specific flows don't constitute transmission.

## 14.5 AML / KYC / BSA / sanctions
- If any MSB nexus exists: **KYC**, **suspicious-activity reporting**, **CTRs > $10k**, and **OFAC
  wallet screening**. Emerging **ZK-KYC** lets users prove they passed KYC without doxxing on-chain —
  worth evaluating for a compliant-but-private funnel.
- **Counsel items:** whether the protocol needs a KYC gate, geofencing sanctioned jurisdictions, and
  a sanctions-screening step at origination.

## 14.6 RWA custody & lien perfection (UCC) — ties to OQ-5
- To have an enforceable claim on default we must **perfect a security interest**:
  - **UCC Article 9** — perfecting a security interest in the **physical card** (goods) held in the
    CC/PWCC vault. Requires the **vault/custodian to recognize and honor our lien** (a control /
    bailee-acknowledgment arrangement). **This is the same dependency as [F-5 / OQ-5](07-open-questions.md)** —
    a legal + technical precondition, not just code.
  - **UCC Article 12 & amended Article 9** — states have adopted frameworks for **perfection by
    control** of **digital assets / controllable electronic records** (the token). Perfecting control
    of the token is the on-chain half.
- **Structure:** an **SPV / trust** holding the collateral with **bankruptcy remoteness** protects
  lenders' claims from Magpie's (or CC's) insolvency and from other creditors — a common RWA pattern.
- **Counsel items:** the exact perfection mechanics (physical + digital), a vault bailee/control
  agreement with Collector Crypt, and whether an SPV/trust is warranted for lender protection.

## 14.7 Consumer protection
- If borrowers are **individual consumers**, **UDAAP**, fair-lending, and state consumer-lending
  rules can apply even where TILA doesn't. Clear, honest disclosure of rate/term/forfeiture is both a
  compliance and a trust matter. (Marketing must not overstate — consistent with Magpie's "never
  overpromise" norm.)

## 14.8 Intellectual property (Pokémon / grader marks)
- Lending against **genuine physical cards** implicates the **first-sale doctrine** (we're not
  reproducing IP), so IP risk is **low** — but marketing must **not imply endorsement** by Nintendo /
  The Pokémon Company / PSA / CGC, and must use their marks only nominatively.

## 14.9 How the design choices change the legal exposure (summary)
| Design choice | Legal effect |
|---|---|
| **P2P / offerbook** (users set rate/LTV/term) vs **curated pool** | P2P **reduces the SEC "operator-sets-terms" securities trigger** (§14.2) — a real reason to prefer it |
| **No price-based liquidation** (fixed-term) | Removes "adjusting liquidation thresholds" — one of the named SEC triggers |
| **Non-custodial** (contracts hold collateral, users self-custody) | Reduces **MSB / MTL** exposure (§14.4) |
| **Conservative ~10–14% APR** | Well under state usury/pawn caps (§14.3) |
| **SPV / trust + perfected liens** | Protects lenders in insolvency; addresses OQ-5 (§14.6) |
| **KYC/geofence option** | Manages MSB/AML + state-by-state licensing gaps |

## 14.10 Pre-mainnet legal checklist (no open High items before launch)
- [ ] **Securities opinion** on the chosen structure (P2P vs pool; token; Reves/Howey analysis) — the top item.
- [ ] **Lending/pawnbroker + usury analysis** per target state; decide licensing / bank-partner / geofence.
- [ ] **Money-transmission / MSB / MTL / BitLicense / CA-DFAL** analysis of the actual fund flows; confirm non-custodial status.
- [ ] **BSA/AML/OFAC** program design (KYC gate? ZK-KYC? sanctions screening?).
- [ ] **UCC perfection** plan (Art 9 physical + Art 12 token) + **Collector Crypt bailee/control agreement** (also closes OQ-5).
- [ ] **Entity/structuring** (US vs offshore, SPV/trust, which jurisdiction, geofencing).
- [ ] **Consumer-protection / disclosures** review; marketing/IP review (no implied endorsement).
- [ ] Sign-off: qualified counsel, **no open High regulatory items**, before any capital or mainnet.

## Sources
- [SEC July 2026 — curator-managed lending vaults may owe securities compliance](https://www.spotedcrypto.com/defi-vault-sec-warning-curator-2026/) · [DeFi SEC/CFTC 2025 overview](https://www.calibraint.com/blog/defi-regulatory-compliance-sec-cftc-2025)
- [US crypto regulation 2026 (MSB/MTL/BitLicense/CA-DFAL)](https://sumsub.com/blog/us-crypto-regulations/) · [state crypto licensing map](https://astraea.law/insights/state-by-state-crypto-licensing-map-2025)
- [RWA tokenization legal (UCC Art 9/12, SPV, perfection)](https://www.fenwick.com/insights/publications/tokenized-real-world-assets-pathways-to-sec-registration) · [DLx Law — trust structures](https://dlxlaw.com/leaderships_blog/from-paper-to-protocol-how-trust-companies-became-the-backbone-of-rwa-tokenization/)
- [Pawn licensing & usury caps by state](https://pawn-software.com/pawn-licensing-us.htm) · [pawn <4mo outside TILA / rate caps](https://collateral.finance/interest-rate-regulations-in-the-united-states-pawnbroking-industry/)
