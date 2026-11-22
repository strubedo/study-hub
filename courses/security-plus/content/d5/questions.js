// Domain 5 — Security Program Management and Oversight. Original questions, written to the SY0-801 objectives and
// checked against the sources listed in lessons.js (NIST SP 800-12 Rev. 1, 800-30 Rev. 1, 800-39, 800-50 Rev. 1,
// 800-53 Rev. 5, 800-115, 800-161 Rev. 1, IR 8286/8286A, CSF 2.0, the NIST glossary, GDPR, CCPA, FRCP 37,
// MITRE ATT&CK, the Lockheed Martin kill chain paper, the Diamond Model paper and the Google SRE book).
// Exhibits are hand-written from documentation (see REVIEW-TODO.md).
const L51 = '5.1-governance-artifacts';
const L52A = '5.2-risk-identification-analysis';
const L52B = '5.2-register-treatment-business';
const L53 = '5.3-third-party-risk';
const L54 = '5.4-security-compliance';
const L55A = '5.5-audits-assessments';
const L55B = '5.5-penetration-testing';
const L56 = '5.6-security-awareness';

const bank = [
  // ---------- 5.1 ----------
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51,
    stem: 'Refer to the exhibit. Which type of governance artifact is this?',
    exhibit: `Contoso document ISD-04, version 3.2   (approved by the CISO, 2026-06-01)
4.1  All company laptops MUST use full-disk encryption: BitLocker with
     XTS-AES 256 on Windows, FileVault on macOS.
4.2  Recovery keys MUST be escrowed in the corporate key vault.
4.3  Encryption status is checked daily by the MDM compliance policy.`,
    options: ['Policy', 'Guideline', 'Standard', 'Procedure'],
    answer: [2],
    explanation: 'NIST SP 800-12 Rev. 1 says organizational **standards** "specify uniform use of specific technologies, parameters, or procedures" and "are normally compulsory". This document is mandatory (MUST) and names specific products and an algorithm, and a CISO approval fits a standard issued under a policy. A **policy** would state the broad requirement ("data on portable devices must be protected by encryption") without naming products. A **guideline** is recommended, not mandatory. A **procedure** gives the step-by-step instructions for performing a task (how to enable BitLocker on a new laptop), not the required end state.' },
  { topic: '5.1', type: 'match', difficulty: 2, lesson: L51,
    stem: 'Match each Contoso document with the governance artifact it is.',
    pairs: [
      ['A two-page statement signed by the CEO that all company information must be protected according to its classification, naming the CISO as responsible', 'Policy'],
      ['A requirement that every public web server use TLS 1.2 or higher with a listed set of cipher suites', 'Standard'],
      ['A list of 180 specific settings every new Windows Server 2025 build must have before it joins the domain', 'Baseline'],
      ['Advice to developers on how to structure application logs, which teams may adapt to their framework', 'Guideline'],
      ['Numbered steps the service desk follows to verify a caller\'s identity and reset a locked-out password', 'Procedure'],
      ['What staff do, and in which order, to keep payroll running if the head office cannot be used', 'Business continuity plan'],
    ],
    explanation: 'Broad, mandatory, top-level and assigning responsibility: **policy**. Mandatory with specific technical values: **standard**. A per-system list of required settings: **baseline** (the minimum configuration under a standard). Recommended and adaptable ("may adapt"): **guideline**; SP 800-12 says guidelines can be implemented correctly in more than one way. Step-by-step instructions for one task: **procedure** (an SOP). Keeping a business function running during a disruption: **business continuity plan** (restoring IT systems would be the DRP).' },
  { topic: '5.1', type: 'single', difficulty: 1, lesson: L51,
    stem: "A security researcher finds a flaw in Contoso's customer portal. She looks on Contoso's website for how to report it, what testing Contoso permits, and whether Contoso will take legal action against good-faith research. Which document should answer all three questions?",
    options: ['Acceptable use policy', 'Incident response policy', 'Privacy policy', 'Vulnerability disclosure policy'],
    answer: [3],
    explanation: 'A **vulnerability disclosure policy** tells outside researchers how to report flaws, what research is authorized, and that good-faith research will not be pursued legally (CISA BOD 20-01 required U.S. federal agencies to publish one with exactly these elements). The **AUP** governs Contoso\'s own users of its systems. The **incident response policy** sets internal authority, roles and reporting duties for incidents. The **privacy policy** explains how personal data is collected and used.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51,
    stem: "Contoso's operations wiki holds a document for one system: the exact commands, checks and expected outputs to fail the order database over to the secondary site, written so the steps can later be scripted. Which artifact is this?",
    options: ['Playbook', 'Runbook', 'Business continuity plan', 'Reference architecture'],
    answer: [1],
    explanation: 'A **runbook** holds the detailed technical steps for a specific operational task on a specific system, often written to be automated. A **playbook** (Domain 4.7) is the response strategy for a type of event, with decisions and escalation, and it calls runbooks for technical steps. A **business continuity plan** covers keeping business functions running across the organization, not commands for one database. A **reference architecture** is a template design, not operating instructions.' },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: L51,
    stem: 'Which two of these Contoso documents are guidelines in the SY0-801 grouping of governance artifacts? (Choose two.)',
    options: ['A CIS Benchmark for Ubuntu 24.04, downloaded for reference and not adopted as a requirement', 'A CISA advisory describing a VPN product vulnerability and the recommended actions', 'The password standard requiring a 15-character minimum length', 'The SOP the service desk follows to unlock accounts', 'The acceptable use policy employees sign at onboarding'],
    answer: [0, 1],
    explanation: 'The objectives list **benchmarks, advisories**, implementation guides and reference architecture as guidelines: recommendations that bind no one until adopted. A benchmark Contoso has not adopted is still guidance; once required, it becomes a baseline. The **password standard** is a standard (mandatory, specific). The **SOP** is a procedure. The **AUP** is a policy.' },

  // ---------- 5.2 ----------
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Enter the annualized loss expectancy (ALE) for R-03, in US dollars, as a whole number.',
    exhibit: `Contoso risk register - quantitative extract            currency: USD
ID     Asset / scenario                  Asset value    EF     ARO
R-01   Web store outage (DDoS)              180,000    10%    2
R-02   Laptop theft (encrypted)               3,000   100%    8
R-03   Ransomware on file servers           250,000    40%    0.5
R-04   Data center fire                   1,500,000    70%    0.02`,
    answer: ['50000', '50,000', '$50,000', '$50000', '50000 USD', '50,000 USD', 'USD 50,000', 'USD 50000', '$50,000.00', '50,000.00', '50000.00', '$50k', '50k', '$50K', '50K'],
    explanation: 'SLE = asset value x exposure factor = $250,000 x 0.40 = $100,000. ALE = SLE x ARO = $100,000 x 0.5 = **$50,000** per year. Entering $100,000 gives the SLE, not the ALE. For comparison: R-01 = $18,000 x 2 = $36,000; R-02 = $3,000 x 8 = $24,000; R-04 = $1,050,000 x 0.02 = $21,000.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Enter the single loss expectancy (SLE) for R-09, in US dollars, as a whole number.',
    exhibit: `Insurance renewal worksheet - Contoso
Risk R-09: supplier payment fraud through business email compromise
Annualized loss expectancy (ALE):      $36,000
Annualized rate of occurrence (ARO):   3 per year (claims history 2023-2025)
Single loss expectancy (SLE):          ________`,
    answer: ['12000', '12,000', '$12,000', '$12000', '12000 USD', '12,000 USD', 'USD 12,000', 'USD 12000', '$12,000.00', '12,000.00', '12000.00', '$12k', '12k', '$12K', '12K'],
    explanation: 'ALE = SLE x ARO, so SLE = ALE / ARO = $36,000 / 3 = **$12,000** per occurrence. Multiplying instead ($108,000) or entering the ALE ($36,000) confuses the per-event and per-year figures.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Based on this history, enter the annualized rate of occurrence (ARO) for flooding of the server room, as a decimal.',
    exhibit: `Contoso incident history - flooding of the basement server room
Review period: 6 years (2020 to 2025 inclusive)
2021-03-14  burst pipe, two racks lost
2023-11-02  storm-drain backflow, UPS damaged
2025-07-19  burst pipe, cabling damaged`,
    answer: ['0.5', '.5', '0.50', '1/2', '0.5 per year', '0.5/year', '0.5 per yr'],
    explanation: 'ARO is the expected number of occurrences per year: 3 floods in 6 years = 3 / 6 = **0.5** (one every two years). Entering 3 ignores the period, and 2 is the interval between events in years, not the rate.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. On financial grounds alone, which option gives Contoso the greatest net annual benefit?',
    exhibit: `Risk R-12: ransomware on file servers            Current ALE: $60,000
Option  Control                                      Annual cost   ALE after control
A       Immutable backups plus EDR                   $25,000       $20,000
B       Managed detection and response service       $50,000       $0
C       Extra awareness training only                 $8,000       $45,000
D       Replace all file servers with a new platform $70,000       $0`,
    options: ['Immutable backups plus EDR (option A)', 'Managed detection and response service (option B)', 'Extra awareness training only (option C)', 'Replace all file servers with a new platform (option D)'],
    answer: [0],
    explanation: 'Net benefit = ALE before - ALE after - annual cost of the control. **A**: $60,000 - $20,000 - $25,000 = **$15,000**. B: $60,000 - $0 - $50,000 = $10,000. C: $60,000 - $45,000 - $8,000 = $7,000. D: $60,000 - $0 - $70,000 = -$10,000 (costs more than it saves). Driving the ALE to zero (B, D) is not the same as getting the best return.' },
  { topic: '5.2', type: 'match', difficulty: 2, lesson: L52B,
    stem: 'Match each Contoso decision with the risk treatment it represents.',
    pairs: [
      ['Contoso buys a cyber insurance policy that pays for incident response and business interruption after ransomware', 'Transferring'],
      ['Contoso shuts down a legacy partner FTP service instead of securing it, because no partner uses it any more', 'Avoiding'],
      ['Contoso enables phishing-resistant MFA on its VPN to reduce the likelihood of account takeover', 'Mitigating'],
      ['The risk owner signs off, for 12 months, a risk on an isolated kiosk that is within tolerance and would cost more to fix than the expected loss', 'Accepting'],
    ],
    explanation: 'Insurance shifts part of the financial consequences to another party: **transferring** (NIST IR 8286 gives cybersecurity insurance as its example). Stopping the activity that creates the risk is **avoiding**. Adding a control that lowers likelihood is **mitigating**. A documented, time-limited sign-off by the owner for a risk within tolerance is **accepting**.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: "Contoso's board approves this statement: \"We will take considered risks to grow our online services, but we are unwilling to accept any risk that could expose customer payment card data.\" What does the statement define?",
    options: ['Risk tolerance', 'Residual risk', 'Risk threshold', 'Risk appetite'],
    answer: [3],
    explanation: 'NIST (from COSO via IR 8286) defines **risk appetite** as "the types and amount of risk, on a broad level, [an organization] is willing to accept in its pursuit of value", set by senior leadership; this broad, board-level statement of which risks are and are not acceptable is exactly that. **Risk tolerance** is the measurable acceptable variance, usually set at program or system level ("no more than 2 hours of downtime a month"). **Residual risk** is the risk left after treatment. A **risk threshold** is a specific trigger value for escalation.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. The listed controls have been tested and work as recorded. What is the most appropriate next step for R-21?',
    exhibit: `Contoso risk register extract       score = likelihood x impact (1-25)
Tolerance for operational risks:    residual score of 10 or below
ID    Risk                        Inherent  Controls in place             Residual  Owner
R-21  Unauthorized building entry   20      badge readers, CCTV, guard       8      COO`,
    options: ['Add controls until the residual score reaches zero', 'Avoid the risk by closing the building to visitors', 'Accept the residual risk, record the owner\'s decision and keep monitoring it', 'Transfer the full inherent risk by buying insurance'],
    answer: [2],
    explanation: 'The **residual** score (8) is within the stated tolerance (10 or below), so the owner can **accept** it, record the decision in the register and keep monitoring; IR 8286 describes accept as "no additional risk response action is needed except for monitoring". Residual risk never reaches zero, so adding controls for that goal wastes money. Avoidance is for risks that cannot be brought within tolerance. Insurance would address the inherent score (20), which the existing controls have already reduced.' },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: L52B,
    stem: 'Contoso buys cyber insurance covering ransomware recovery costs and business interruption. Which two statements are true? (Choose two.)',
    options: ['The policy reduces the likelihood of a ransomware attack', 'The policy shifts part of the financial consequences of an attack to the insurer', 'Loss of customer trust after an attack remains with Contoso', 'Regulators will hold the insurer, not Contoso, accountable for a resulting data breach', 'Contoso no longer needs backups, because its losses are covered'],
    answer: [1, 2],
    explanation: 'Insurance **transfers part of the financial consequences**. IR 8286 adds that "there are often consequences that cannot be transferred, like loss of customer trust". SP 800-39 notes that transfer "reduces neither the likelihood of harmful events occurring nor the consequences" to operations, so likelihood is unchanged. Accountability to regulators stays with Contoso. Insurers usually require controls such as backups, and backups still determine how fast Contoso recovers.' },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: L52A,
    stem: 'Put the steps of a quantitative analysis for one risk in order, from identifying the asset to recording the decision.',
    items: [
      'Identify the asset at risk and its owner',
      'Determine the asset value',
      'Estimate the exposure factor and calculate the SLE',
      'Multiply the SLE by the ARO to calculate the ALE',
      'Compare the reduction in ALE with the annual cost of the proposed control',
      'Record the chosen treatment and the residual risk in the risk register',
    ],
    explanation: 'You cannot value an asset you have not identified, and a named owner makes the decision. SLE = asset value x exposure factor, so the asset value comes first. ALE = SLE x ARO, so the SLE must exist before the ALE. The cost-benefit comparison needs the ALE, and the result (treatment and residual risk) is recorded in the register for communication and review.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Before choosing controls, Contoso wants to know how long order processing can be unavailable before the damage becomes unacceptable, which systems and staff it depends on, and how quickly it must be restored, whatever the cause of the outage. Which activity provides this?',
    options: ['Business impact analysis', 'Risk assessment', 'Gap analysis', 'Penetration test'],
    answer: [0],
    explanation: 'A **business impact analysis** is the "process of analyzing operational functions and the effect that a disruption might have on them" (NIST glossary, from SP 800-34); it yields criticality, dependencies, MTD, RTO and RPO and does not depend on the cause. A **risk assessment** starts from threats and vulnerabilities and estimates likelihood and impact. A **gap analysis** compares current controls with a target standard. A **penetration test** exploits technical weaknesses.' },

  // ---------- 5.3 ----------
  { topic: '5.3', type: 'match', difficulty: 2, lesson: L53,
    stem: 'Match each situation with the agreement type that fits it.',
    pairs: [
      ['Contoso and a university sign a document stating their intent to share threat research; neither commits to deliver anything or to pay', 'MOU'],
      ['Two government agencies document exactly which staff, systems and duties each will provide to a joint monitoring center', 'MOA'],
      ['A consultant must keep Contoso\'s network diagrams confidential while preparing a bid', 'NDA'],
      ['Liability, data protection and audit-rights terms that will govern every project with a managed service provider', 'MSA'],
      ['The deliverables, schedule and acceptance criteria for migrating 300 mailboxes in phase 2 of that relationship', 'SOW'],
      ['A commitment to 99.95% monthly availability, with a 10% fee credit for each month it is missed', 'SLA'],
    ],
    explanation: 'CNSSI 4009 describes an **MOU** as a mutual understanding with no expectation of payment where the parties "do not rely on each other to execute or deliver on any responsibilities", and an **MOA** as documenting agreed support and responsibilities. An **NDA** delineates information the signatories agree not to divulge (SP 800-47 Rev. 1). The **MSA** holds the umbrella terms for all work; each project\'s specific work goes in a **SOW**. Measurable service commitments with consequences are an **SLA**.' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53,
    stem: 'Refer to the exhibit. Which statement is correct?',
    exhibit: `Monthly service report - Example Corp hosted CRM - October 2026
Availability measured (SLI):                     99.82%
Service-level objective (provider internal):     99.90%
Contractual commitment (SLA, schedule B):        99.50%   10% credit if missed
Incidents: 2   total downtime: 80 minutes`,
    options: ['Contoso is entitled to a 10% service credit for October', 'The provider missed its service-level objective but met its SLA commitment', 'The provider breached the SLA because availability was below 99.90%', 'The 99.82% figure is the contractual commitment Contoso negotiated'],
    answer: [1],
    explanation: 'The SLI (the measurement, 99.82%; 80 minutes of a 44,640-minute month) is below the **SLO** of 99.90%, the provider\'s internal target, but above the **SLA** commitment of 99.50%, the only figure with a consequence attached. So no credit is due and there is no SLA breach. The SRE book\'s test applies: if missing a target has no explicit consequence, it is an SLO. 99.82% is the measured indicator, not a commitment.' },
  { topic: '5.3', type: 'order', difficulty: 2, lesson: L53,
    stem: 'Contoso is sourcing a managed security service. Put the vendor selection steps in order, from market research to contract signature.',
    items: [
      'Issue a request for information (RFI) to learn what the market offers',
      'Use the responses to finalize requirements in a statement of work (SOW)',
      'Release a request for proposal (RFP) that includes the SOW',
      'Evaluate the proposals and select a preferred bidder',
      'Perform due diligence on the preferred bidder',
      'Sign the contract (MSA and SOW) with the selected provider',
    ],
    explanation: 'SP 800-161 Rev. 1 says enterprises may use RFIs, sources-sought notices and due diligence questionnaires for initial screening, then complete procurement "by releasing a statement of work (SOW) ... for the release of a request for proposal (RFP) or request for quotes (RFQ)", and that bidders responding to the RFP should then be evaluated. The SOW is built from what the RFI revealed, proposals can only be evaluated after the RFP, due diligence on the preferred bidder needs that bidder to exist (SP 800-161 also uses due diligence questionnaires during initial screening, but this step is the deeper check of the chosen bidder), and contracting comes last.' },
  { topic: '5.3', type: 'single', difficulty: 1, lesson: L53,
    stem: 'Contoso has chosen the exact model of FIDO2 security key it wants and needs 600 of them delivered by March. It wants prices and delivery terms from three resellers. Which document should it send?',
    options: ['Request for information (RFI)', 'Request for proposal (RFP)', 'Request for quote (RFQ)', 'Expression of interest (EOI)'],
    answer: [2],
    explanation: 'When the product and quantity are fully specified and only price and terms vary, use a **request for quote**. An **RFI** gathers market information while requirements are still forming. An **RFP** asks suppliers to propose a solution where the approach can vary. An **EOI** asks suppliers to signal interest and qualifications for a shortlist, before formal tendering.' },
  { topic: '5.3', type: 'single', difficulty: 1, lesson: L53,
    stem: 'Refer to the exhibit. Which vendor monitoring mechanism does this clause give Contoso?',
    exhibit: `Master Services Agreement - Schedule D, clause 14.2
Customer, or an independent auditor appointed by Customer and bound by
confidentiality, may on thirty (30) days' written notice inspect Provider's
facilities, systems, records and personnel relevant to the Services, no
more than once per contract year, and at any time following a Security
Incident.`,
    options: ['Right to audit', 'Compliance attestation', 'Service-level monitoring', 'Non-disclosure agreement'],
    answer: [0],
    explanation: 'A **right-to-audit** clause lets the customer, or an auditor it appoints, inspect the vendor\'s controls, records and facilities under agreed conditions. A **compliance attestation** is a statement or report the vendor provides (such as a SOC 2 report), not the customer\'s right to inspect. **Service-level monitoring** measures performance against the SLA. The confidentiality wording binds the auditor, but the clause is not an **NDA**.' },
  { topic: '5.3', type: 'multi', difficulty: 3, lesson: L53,
    stem: 'Refer to the exhibit. Contoso received this report during due diligence on a payroll provider. Which two conclusions does the exhibit support? (Choose two.)',
    exhibit: `Independent Service Auditor's Report (SOC 2 Type 2) - Example Corp Payroll Cloud
Period:    January 1, 2026 to September 30, 2026
Criteria:  Trust services criteria for security and availability
Carve-out: Example Corp uses a subservice organization for data center
           hosting. The subservice organization's controls are excluded
           from this report and from the auditor's testing.
Opinion:   Controls were suitably designed and operated effectively
           throughout the period, except for the exception noted in
           control 4.3 (quarterly user access reviews).`,
    options: ['The report gives assurance over the hosting provider\'s data center controls', 'The opinion covers operating effectiveness over a nine-month period, not just a single date', 'Contoso needs separate assurance for the subservice organization\'s controls', 'The report shows that Example Corp complies with the GDPR', 'The report covers the confidentiality and privacy criteria'],
    answer: [1, 2],
    explanation: 'The opinion addresses operation **throughout the period** January to September 2026 (nine months). The hosting provider is **carved out**, so its controls were not tested and Contoso must get assurance for them another way (that provider\'s own report, or contract terms). Carved-out controls are exactly the "assurance mechanism" limitation in 5.3. A SOC 2 report is not a GDPR compliance determination, and the criteria listed are security and availability only, not confidentiality or privacy.' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53,
    stem: "A member of Contoso's evaluation panel for a managed SOC contract discloses that her spouse is a senior manager at one of the bidders. What should Contoso do?",
    options: ['Disqualify that bidder from the competition', 'Let the panel member continue but give her scores half weight', 'Ask the bidder to sign an NDA covering the panel member', 'Record the disclosure and remove the panel member from evaluating and scoring the bids'],
    answer: [3],
    explanation: 'The standard control for a **conflict of interest** is disclosure and **recusal**: record it and keep the conflicted person out of evaluation and scoring. Disqualifying the bidder punishes it for Contoso\'s internal conflict and may be unfair or unlawful in procurement. Reduced weighting still lets a conflicted person influence the result. An NDA addresses confidentiality, not bias.' },
  { topic: '5.3', type: 'fill', difficulty: 1, lesson: L53,
    stem: 'Refer to the exhibit. Enter the three-letter acronym for this type of agreement.',
    exhibit: `THIS AGREEMENT is made between Contoso Ltd ("Customer") and Example Corp
("Supplier").
1.1  This Agreement sets out the terms and conditions that govern every
     Statement of Work the parties sign. Each Statement of Work describes
     specific services, deliverables, fees and timelines and is
     incorporated into this Agreement.
1.2  If a Statement of Work conflicts with this Agreement, this Agreement
     prevails unless the Statement of Work expressly states otherwise.`,
    answer: ['MSA', 'master services agreement', 'master service agreement'],
    explanation: 'An agreement that sets the terms governing every statement of work is a **master services agreement (MSA)**, the umbrella contract. The SOW holds the specific work, deliverables and price for each engagement. It is not an SLA (no service levels) or an MOU (it is a binding contract).' },

  // ---------- 5.4 ----------
  { topic: '5.4', type: 'match', difficulty: 2, lesson: L54,
    stem: 'Match each request Contoso receives from an EU customer with the GDPR right it exercises.',
    pairs: [
      ['"Close my account and delete everything you hold about me." Contoso has no legal reason to keep it', 'Erasure (right to be forgotten)'],
      ['"The delivery address on my profile is wrong; please fix it."', 'Rectification (data correction)'],
      ['"I dispute the accuracy of my credit notes. Do not use them while you check."', 'Restriction of processing'],
      ['"Stop using my data to send me marketing."', 'Objection (processing prevention)'],
    ],
    explanation: 'Article 17 is the **right to erasure ("right to be forgotten")**. Article 16 is **rectification** of inaccurate data. Article 18 gives **restriction** while accuracy is contested: the data may be stored but not otherwise used. Article 21 gives the **right to object**; for direct marketing, the controller must stop processing for that purpose. "Processing prevention" is not a GDPR heading; objection is the right that stops processing.' },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54,
    stem: 'Refer to the exhibit. What should IT operations do?',
    exhibit: `From:    legal@example.com
To:      it-ops@example.com
Subject: LEGAL HOLD - Contoso v. Example Supplies Ltd
Effective immediately, preserve all email, chat and files of custodians
alice and bob from 2025-01-01 onward. Do not delete, alter or overwrite.
This hold remains in effect until Legal releases it in writing.

Contoso retention standard RS-2 (excerpt): mailbox items older than
24 months are deleted automatically each night.`,
    options: ['Continue the nightly deletion, because the retention standard is approved policy', 'Suspend automatic deletion for the covered data of alice and bob, preserve it, and keep it until Legal releases the hold', 'Export the mailboxes to a file share, then let the nightly job delete the originals', 'Delete everything older than 24 months first, so that only compliant data is preserved'],
    answer: [1],
    explanation: 'A **legal hold suspends normal retention and disposal** for the covered information. The advisory committee notes to FRCP 37 describe "intervention in the routine operation of an information system" as part of a litigation hold, and Rule 37(e) allows sanctions when relevant electronically stored information is lost because a party failed to take reasonable steps to preserve it. Continuing deletion or deleting first destroys evidence. Exporting and then deleting the originals breaks the "do not delete, alter" instruction and risks losing metadata.' },
  { topic: '5.4', type: 'single', difficulty: 1, lesson: L54,
    stem: 'Each quarter, every Contoso department head signs a statement that all access reviews for their systems were completed and exceptions were resolved. What is this compliance monitoring activity?',
    options: ['Legal hold', 'Acknowledgement', 'Rules of engagement', 'Attestation'],
    answer: [3],
    explanation: 'An **attestation** is a formal statement, by someone accountable, that requirements are being met. An **acknowledgement** only confirms that a person has read and will follow a document (SP 800-53 PL-4\'s documented acknowledgment of rules of behavior). A legal hold preserves data for litigation. Rules of engagement govern testing.' },
  { topic: '5.4', type: 'multi', difficulty: 2, lesson: L54,
    stem: "Contoso adds a newsletter sign-up to its EU web store. Which two design choices meet the GDPR's conditions for consent? (Choose two.)",
    options: ['A marketing checkbox that is ticked by default', 'An unticked marketing checkbox, separate from acceptance of the terms of sale', 'A banner stating that continuing to browse the site counts as consent', 'Making acceptance of marketing email a condition of completing a purchase', 'An unsubscribe link in every newsletter that withdraws consent in one click'],
    answer: [1, 4],
    explanation: 'GDPR consent is opt-in: "a clear affirmative action" (Article 4(11)), presented "clearly distinguishable from the other matters" (Article 7(2)), and "it shall be as easy to withdraw as to give consent" (Article 7(3)). So an **unticked, separate checkbox** and a **one-click withdrawal** meet the conditions. Recital 32: "silence, pre-ticked boxes or inactivity should not therefore constitute consent", which rules out the pre-ticked box and "continuing to browse". Article 7(4): when assessing whether consent is freely given, "utmost account" is taken of whether a contract is made conditional on consent to processing that is not necessary for it, so tying marketing consent to a purchase fails the freely-given test.' },
  { topic: '5.4', type: 'single', difficulty: 3, lesson: L54,
    stem: "Contoso uses Example Corp's payroll SaaS under a GDPR Article 28 contract. Example Corp then starts using Contoso's employee salary data to build and sell its own salary-benchmarking product. How does the GDPR treat Example Corp for that new processing?",
    options: ['As a processor, because the Article 28 contract is still in force', 'As a joint controller with Contoso, so Contoso shares liability for the product', 'As a controller, because it now determines the purposes and means of that processing', 'As a data subject, because it holds the data'],
    answer: [2],
    explanation: 'Article 28(10): a processor that infringes the Regulation "by determining the purposes and means of processing ... shall be considered to be a controller in respect of that processing". The **controller** role follows who decides why and how data is processed (Article 4(7)), not what the contract says, so the contract does not keep Example Corp a processor for this. Contoso did not jointly decide the purposes, so it is not a joint controller. Data subjects are the employees, the people the data is about.' },

  // ---------- 5.5 ----------
  { topic: '5.5', type: 'match', difficulty: 2, lesson: L55A,
    stem: 'Match each engagement with its type.',
    pairs: [
      ['Before seeking ISO/IEC 27001 certification, Contoso compares its current controls with the standard\'s requirements to list what is missing', 'Gap analysis'],
      ['A CPA firm performs a SOC 2 attestation engagement and issues an opinion on a SaaS provider\'s controls over twelve months', 'Examination'],
      ['The national data protection authority inspects Contoso\'s processing after a customer complaint', 'Regulatory audit'],
      ['Control owners rate their own controls in a quarterly questionnaire', 'Self-assessment'],
      ['Contoso compares its mean time to patch with figures from an industry peer survey', 'Benchmarking'],
      ['An accredited certification body audits Contoso\'s ISMS in order to issue an ISO/IEC 27001 certificate', 'Independent third-party audit'],
    ],
    explanation: 'Comparing the current state with a target to find what is missing: **gap analysis**. A CPA opinion on controls (a SOC 2 report) is an attestation **examination**. An inspection by a regulator under its legal powers: **regulatory**. Owners rating their own controls: **self-assessment** (internal, not independent). Comparing metrics with peers: **benchmarking**. Certification by an accredited, independent body: **independent third-party audit**.' },
  { topic: '5.5', type: 'order', difficulty: 2, lesson: L55A,
    stem: 'Put these events from an intrusion at Contoso in the order of the Lockheed Martin Cyber Kill Chain phases they represent.',
    items: [
      'The attacker collects names and roles of Contoso finance staff from public social media (reconnaissance)',
      'The attacker couples an exploit with a remote access trojan in a document file (weaponization)',
      'The document is emailed to the finance team as an "invoice" (delivery)',
      'A finance user opens it and the exploit runs on ws01 (exploitation)',
      'A backdoor is installed on ws01 and set to start at boot (installation)',
      'ws01 beacons to an attacker-controlled domain for instructions (command and control)',
      'The attacker copies payroll files to an external server (actions on objectives)',
    ],
    explanation: 'The kill chain paper defines seven phases in this order: reconnaissance, weaponization, delivery, exploitation, installation, command and control, actions on objectives. Weaponization happens on the attacker\'s side before anything reaches the victim; installation follows exploitation; the C2 channel is what lets the intruder finally act on objectives.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55A,
    stem: 'An investigator finds that ws01 sent beacons to the domain update-check.example.net. Pivoting on that domain reveals hosts at three other organizations contacting it. In the Diamond Model of Intrusion Analysis, which core feature is the domain?',
    options: ['Adversary', 'Capability', 'Victim', 'Infrastructure'],
    answer: [3],
    explanation: 'The Diamond Model\'s four core features are adversary, capability, infrastructure and victim: an adversary uses a **capability over infrastructure** against a victim. A C2 domain is **infrastructure**, and pivoting from it to other victims is the model\'s characteristic analytic move. The adversary is the actor behind the activity; the capability is the malware or exploit; ws01 and the other organizations\' hosts are victims.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55A,
    stem: 'Refer to the exhibit. How should the auditor treat the management statement?',
    exhibit: `Audit workpaper AP-7 - joiner/mover/leaver controls
Management statement: "All leavers' accounts are disabled within 24 hours
of their termination date."  (signed: HR director, IT director)
Population: 640 terminations, 2026-01-01 to 2026-09-30 (HR system export)
Evidence source available: directory account-disable logs`,
    options: ['As sufficient evidence, because two directors signed it', 'As an assertion to be tested, for example by checking a random sample of the 640 terminations against the directory disable logs', 'As a questionnaire response that replaces the need for testing', 'As out of scope, because HR, not IT, owns terminations'],
    answer: [1],
    explanation: 'Management\'s statement is an **assertion**: a claim the auditor must support or refute with evidence. A **random sample** of the population, compared with an independent source (directory logs), lets the auditor conclude about all 640. Signatures do not make a claim evidence. A questionnaire is self-reported and weaker still. The control spans HR and IT, and access removal is squarely in scope.' },
  { topic: '5.5', type: 'match', difficulty: 2, lesson: L55B,
    stem: 'Match each test description with the penetration testing approach it describes.',
    pairs: [
      ['Testers receive source code, network diagrams and administrator credentials before they start', 'Known environment'],
      ['Testers receive only the company\'s name and must find everything else themselves', 'Unknown environment'],
      ['Testers receive a standard user account and the in-scope address ranges', 'Partially known environment'],
      ['Testers try to tailgate into the data center and plant a device in a network closet', 'Physical'],
      ['Attackers and SOC analysts sit together, replaying each technique until it is detected', 'Integrated'],
    ],
    explanation: 'Full information is a **known environment** test (formerly white box); no information is **unknown** (black box); some information, such as a user account, is **partially known** (gray box). Testing facility and personnel controls is **physical** testing. Red and blue teams working together in real time is **integrated** (purple team) testing.' },
  { topic: '5.5', type: 'order', difficulty: 2, lesson: L55B,
    stem: 'Put these penetration test activities in order, following the NIST SP 800-115 methodology.',
    items: [
      'Agree the scope and rules of engagement and obtain written management approval',
      'Gather information with DNS and WHOIS queries and scan for open ports and services',
      'Compare the discovered services and versions against vulnerability databases',
      'Attempt to exploit a likely vulnerability to gain access',
      'Escalate privileges on the compromised host and install additional tools',
      'Deliver the final report with findings, risk ratings and remediation advice',
    ],
    explanation: 'SP 800-115 has four phases. **Planning**: rules identified and management approval documented; no testing happens. **Discovery**: information gathering and scanning first, then vulnerability analysis. **Attack**: gaining access, then escalating privileges and installing tools (which loops back to discovery). **Reporting** runs throughout, but the final report comes at the end.' },
  { topic: '5.5', type: 'multi', difficulty: 2, lesson: L55B,
    stem: 'A tester preparing an unknown-environment test of Contoso wants to avoid detection during early reconnaissance. Which two activities are passive? (Choose two.)',
    options: ['Searching certificate transparency logs for subdomains of example.com', 'Reading Contoso\'s job postings to learn which technologies it uses', 'Running a TCP SYN scan of Contoso\'s public address range', 'Connecting to Contoso\'s mail server to grab its SMTP banner', 'Calling Contoso\'s help desk while posing as an employee'],
    answer: [0, 1],
    explanation: 'SP 800-115 defines passive testing as not involving "any direct interaction with the targets". **Certificate transparency logs** and **job postings** are public third-party sources. A SYN scan and banner grabbing send packets to Contoso\'s systems (active, and visible in its logs). Calling the help desk is direct interaction with Contoso staff, active social engineering.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55B,
    stem: 'Refer to the exhibit. On 2026-11-17 at 23:10, the tester sees from the earlier sweep that 203.0.113.50 appears to run an outdated, vulnerable web server version. What should the tester do?',
    exhibit: `Penetration test - scope and rules of engagement (excerpt)
Client: Contoso      Tester: Example Corp Security      Signed: 2026-11-02
In scope:      203.0.113.0/26 (public web and VPN)
Exclude list:  203.0.113.50 (payment gateway operated by a third party)
Window:        2026-11-16 to 2026-11-20, 20:00-06:00 local time
Prohibited:    denial of service; social engineering; changing production data
Stop testing:  on any service outage, and contact the Contoso POC at once
POC:           Contoso SOC, +1-555-0100`,
    options: ['Exploit it quickly to confirm the finding, because the address lies inside 203.0.113.0/26', 'Run a full vulnerability scan against it to gather evidence before reporting', 'Not test it further, and record the observation for the Contoso POC to pass to the system owner', 'Wait until after 06:00 and test it outside the window so production is not affected'],
    answer: [2],
    explanation: 'The address is on the **exclude list**, which overrides the in-scope range; SP 800-115 says it is "crucial to identify any system not authorized for testing". Testing it, by exploit or by scan, is unauthorized, and it belongs to a third party that never agreed to the test. Reporting the observation through the POC is the right course. Testing outside the agreed window breaks a second rule.' },

  // ---------- 5.6 ----------
  { topic: '5.6', type: 'fill', difficulty: 1, lesson: L56,
    stem: 'Refer to the exhibit. Enter the report rate for this simulation, as a percentage of emails delivered.',
    exhibit: `Phishing simulation PS-2026-10 - "Invoice overdue" lure (difficulty: moderate)
Emails delivered:                 640
Users who clicked the link:        80
Users who entered credentials:     16
Users who reported the email:     160
First report received:            4 minutes after delivery`,
    answer: ['25', '25%', '25 %', '25.0', '25.0%', '25.0 %', '25 percent'],
    explanation: 'Report rate = users who reported / emails delivered = 160 / 640 = **25%**. The click rate is 80 / 640 = 12.5% and the credential-submission rate 16 / 640 = 2.5%. Reporting is the behavior that lets the SOC pull a real campaign from every mailbox early, so it is the metric to drive up.' },
  { topic: '5.6', type: 'match', difficulty: 1, lesson: L56,
    stem: 'Match each Contoso training activity with its training type.',
    pairs: [
      ['A new engineer completes the AUP, incident-reporting and password-manager modules in her first week', 'Initial/onboarding'],
      ['All staff complete a refresher every year and a short module each month on current scams', 'Ongoing'],
      ['Accounts-payable staff get a module on verifying supplier bank-detail changes', 'Targeted'],
      ['A user who entered credentials in a simulation is shown a five-minute lesson on spotting that lure', 'Corrective'],
    ],
    explanation: 'Training at the start of employment or access is **onboarding** (SP 800-53 AT-2: "as part of initial training for new users"). Periodic refreshers are **ongoing**. Content aimed at a role with a specific exposure is **targeted** (role-based, AT-3). A lesson triggered by a specific failure is **corrective**; SP 800-50 Rev. 1 says such exercises should not be punitive.' },
  { topic: '5.6', type: 'single', difficulty: 2, lesson: L56,
    stem: 'Refer to the exhibit. Which conclusion is best supported?',
    exhibit: `Awareness metrics - Contoso                 Q2 2026    Q3 2026
Training completion (all staff)               97%        98%
Phishing simulation click rate                14%        11%
Phishing simulation report rate                9%        31%
Median time to first report                 38 min      5 min
Real phishing emails reported by staff          22         71
(simulations in both quarters rated "moderate" on the NIST Phish Scale)`,
    options: ['The near-100% completion rate proves the program changed behavior', 'Staff now recognize and report phishing far more often and much faster, giving the SOC earlier warning of real campaigns', 'Because the click rate is still above zero, the program has had no measurable effect', 'The rise in real phishing reports proves Contoso is being attacked three times as often'],
    answer: [1],
    explanation: 'With simulations of comparable difficulty, the report rate rose from 9% to 31%, the median time to first report fell from 38 to 5 minutes, and real reports tripled, which points to **behavior change** that helps responders contain campaigns early. Completion was already 97%, so it cannot explain the change and does not by itself show behavior. A non-zero click rate is normal; the 14% to 11% drop is an improvement. More real reports are best explained by more reporting, since the simulation data shows reporting tripled; they do not prove more attacks.' },
  { topic: '5.6', type: 'single', difficulty: 1, lesson: L56,
    stem: 'An accounts-payable clerk receives an email that appears to come from a long-standing supplier, asking for this month\'s payment to go to a new bank account and stressing that it is urgent. Following Contoso\'s business email compromise training, what should the clerk do?',
    options: ['Verify the change by calling the supplier on a phone number already on file, not one given in the email', 'Reply to the email and ask the supplier to confirm the new details', 'Make the payment, because the sender address matches the supplier\'s domain', 'Forward the email to a colleague for a second opinion, then pay'],
    answer: [0],
    explanation: 'BEC training teaches **out-of-band verification through a known channel** for any change of payment details. Replying goes to the attacker if the mailbox is compromised or the reply-to is spoofed. A matching sender domain proves nothing when the supplier\'s own mailbox has been taken over or the domain is a look-alike. A colleague\'s opinion of the same email adds no verification.' },

  // ---------- Added in review (performance-based) ----------
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Enter the net annual benefit of control C-1 (ALE before the control, minus ALE after it, minus the control\'s annual cost), in US dollars, as a whole number.',
    exhibit: `Contoso risk register - R-15 quantitative worksheet        currency: USD
Asset:      customer account database        asset value      500,000
Scenario:   credential-stuffing breach of the customer portal
Exposure factor (EF):                                          20%
ARO, current (incident history 2022-2025):                     0.5
Proposed control C-1: phishing-resistant MFA for customer logins
  Annual cost:                                              12,000
  Expected ARO with C-1:                                       0.1
  Expected EF with C-1:                                        20% (unchanged)`,
    answer: ['28000', '28,000', '$28,000', '$28000', '28000 USD', '28,000 USD', 'USD 28,000', 'USD 28000', '$28,000.00', '28,000.00', '28000.00', '$28k', '28k'],
    explanation: 'SLE = $500,000 x 0.20 = $100,000. ALE before = $100,000 x 0.5 = $50,000. ALE with C-1 = $100,000 x 0.1 = $10,000. Net benefit = $50,000 - $10,000 - $12,000 = **$28,000** per year, so the control is cost-justified. $40,000 is the reduction in ALE before subtracting the control\'s cost; $50,000 is the current ALE; $100,000 is the SLE.' },
  { topic: '5.3', type: 'match', difficulty: 2, lesson: L53,
    stem: 'Match each Contoso third-party oversight activity with the vendor monitoring mechanism it uses.',
    pairs: [
      ['During an incident, security looks up within minutes which suppliers hold customer data, their criticality tier and who owns each relationship', 'Vendor registry'],
      ['Contoso compares its own uptime probes with the provider\'s monthly report and files a claim for the service credit', 'Service-level monitoring'],
      ['After a breach at the provider, an auditor appointed by Contoso inspects the provider\'s facilities and records under clause 14.2 of the MSA', 'Right to audit'],
      ['The provider sends its current SOC 2 Type 2 report and its PCI DSS Attestation of Compliance', 'Compliance attestation'],
      ['Each year Contoso sends its security questionnaire to critical suppliers, reviews the evidence returned and re-rates each supplier\'s risk', 'Vendor assessment'],
      ['An independent firm, with the provider\'s written permission, tries to exploit weaknesses in the provider\'s customer portal', 'Penetration testing'],
    ],
    explanation: 'The **vendor registry** is the inventory of third parties, their data, access, criticality and owners. **Service-level monitoring** measures actual performance against the SLA. A **right-to-audit** clause lets the customer or its appointed auditor inspect the vendor. A **compliance attestation** is a formal statement or report that the vendor meets a standard (a SOC 2 report from a CPA firm, a PCI DSS AOC). A **vendor assessment** is Contoso\'s own periodic evaluation of the supplier (SP 800-53 SR-6, supplier assessments and reviews). **Penetration testing** exploits weaknesses, and testing a provider\'s service needs its written permission.' },
  { topic: '5.4', type: 'match', difficulty: 2, lesson: L54,
    stem: 'Contoso runs a loyalty program for EU customers on Example Corp\'s cloud CRM. Match each party with its role under the GDPR or in Contoso\'s data governance.',
    pairs: [
      ['Contoso, which decided to collect customers\' purchase histories and to use them to calculate loyalty discounts', 'Controller'],
      ['Example Corp, whose CRM stores and analyzes the purchase histories only on Contoso\'s documented instructions', 'Processor'],
      ['A hosting company that Example Corp engages, with Contoso\'s prior written authorization, to run the CRM servers', 'Sub-processor'],
      ['A customer whose purchase history is stored in the CRM', 'Data subject'],
      ['Contoso\'s head of sales, who decides how the purchase-history data set is classified and who may access it', 'Data owner'],
    ],
    explanation: 'The **controller** "determines the purposes and means of the processing" (Article 4(7)); Contoso decided why and how the data is used. The **processor** processes personal data on the controller\'s behalf (Article 4(8)) and, under Article 28(3)(a), "only on documented instructions from the controller". A processor may engage another processor, a **sub-processor**, only with the controller\'s "prior specific or general written authorisation" (Article 28(2)), and the same obligations pass down to it (Article 28(4)). The **data subject** is the natural person the data relates to (Article 4(1)). The **data owner** is the accountable business role inside the organization that decides classification and access (Domain 3.3); it is a governance role, not a GDPR one.' },
];

export default bank.map((item, i) => ({ id: `d5-${String(i + 1).padStart(3, '0')}`, ...item }));
