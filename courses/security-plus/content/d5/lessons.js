// Domain 5 — Security Program Management and Oversight. Original content, checked against NIST SP 800-12 Rev. 1
// (policy, standards, guidelines, procedures), SP 800-30 Rev. 1 (assessment steps; qualitative, quantitative,
// semi-quantitative), SP 800-37 Rev. 2 (RMF steps), SP 800-39 (frame/assess/respond/monitor; accept, avoid,
// mitigate, share, transfer), NIST IR 8286 and 8286A (risk register, risk owner, appetite vs tolerance, inherent and
// residual risk, SLE/ALE), SP 800-53 Rev. 5 (-1 controls, AT-1, AT-2, PL-4, CA-8, SR-6), SP 800-50 Rev. 1
// (learning program life cycle, phishing metrics), SP 800-115 (ROE, four-phase methodology, overt/covert, passive and
// active testing), SP 800-161 Rev. 1 (RFI, SOW, RFP/RFQ sequence, due diligence), NIST CSF 2.0 (Govern: GV.OC, GV.RM,
// GV.PO, GV.OV, GV.SC), the NIST CSRC glossary (SLA, MOU/MOA, SOW, NDA, audit, attestation, BIA, red/blue team, STIG),
// the GDPR (Articles 4, 5, 7, 12, 16, 17, 18, 21, 28, 83; Recital 32), the CCPA statute (1798.105, .106, .120, .121),
// FRCP Rule 37 and its advisory committee notes (litigation hold), MITRE ATT&CK v20 tactics, Lockheed Martin's kill
// chain paper, the Diamond Model paper, CISA BOD 20-01, the Google SRE book (SLI/SLO/SLA), PCI SSC and AICPA SOC
// pages (2026-11-22).
export default [
  { id: '5.1-governance-artifacts', topic: '5.1', title: 'Governance Artifacts: Policies, Standards, Guidelines, Procedures and Plans', minutes: 11, file: '5.1-governance-artifacts.md',
    objectives: ['Distinguish policies, standards, baselines, guidelines, procedures and plans by how binding and specific they are and who approves them', 'Recognize benchmarks, advisories, implementation guides and reference architectures as guidelines', 'Identify the kinds of standards: baselines, passwords, physical security, RFCs and encryption', 'Distinguish SOPs, runbooks and playbooks', 'State the purpose of each listed policy, from AUP to vulnerability disclosure'] },
  { id: '5.2-risk-identification-analysis', topic: '5.2', title: 'Risk Management 1: Identification, Assessment, Analysis and SLE/ALE/ARO', minutes: 11, file: '5.2-risk-identification-analysis.md',
    objectives: ['Identify assets and assign stakeholder ownership of risks', 'Score and categorize risks', 'Record impact, likelihood, owner and current mitigations', 'Compare qualitative, quantitative and semi-quantitative analysis', 'Calculate SLE, ARO and ALE and judge whether a control is cost-justified'] },
  { id: '5.2-register-treatment-business', topic: '5.2', title: 'Risk Management 2: Risk Register, Treatment and Business-Level Considerations', minutes: 11, file: '5.2-register-treatment-business.md',
    objectives: ['Use a risk register to communicate and review risks', 'Choose between transferring, accepting, avoiding and mitigating', 'Distinguish a business impact analysis from a risk assessment', 'Distinguish risk appetite, tolerance and threshold, and inherent from residual risk', 'Explain the roles of stakeholders, management oversight, regulation and law'] },
  { id: '5.3-third-party-risk', topic: '5.3', title: 'Third-Party Risk: Vendor Selection, Agreements, Monitoring and Rules of Engagement', minutes: 12, file: '5.3-third-party-risk.md',
    objectives: ['Sequence RFI, EOI, SOW, RFP and RFQ in vendor selection', 'Apply due diligence and manage conflicts of interest', 'Choose between SLA, SLO, MOU, MOA, NDA, MSA and SOW', 'Monitor vendors with right-to-audit clauses, service-level monitoring, a vendor registry, assessments, attestations and testing', 'Recognize the limitations of third-party oversight and the role of rules of engagement'] },
  { id: '5.4-security-compliance', topic: '5.4', title: 'Security Compliance: Training, Monitoring, Consequences, Privacy and Legal Holds', minutes: 11, file: '5.4-security-compliance.md',
    objectives: ['Describe data handling, AML/CTF and anti-bribery compliance training', 'Distinguish attestations from acknowledgements', 'List the consequences of non-compliance', 'Apply privacy rights: erasure, opt-in/opt-out, correction, restriction and objection; controller vs processor; ownership', 'Explain legal holds, legal orders and data retention requirements'] },
  { id: '5.5-audits-assessments', topic: '5.5', title: 'Audits and Assessments: Evidence, Reference Models, Engagement Types and Frameworks', minutes: 12, file: '5.5-audits-assessments.md',
    objectives: ['Distinguish audit, assessment, examination and attestation', 'Gather evidence by sampling, questionnaires, interviews and testing assertions', 'Use MITRE ATT&CK, the Cyber Kill Chain and the Diamond Model as reference sources', 'Scope engagements with an audit charter and frequency, and choose internal, external, gap analysis or benchmarking engagements', 'Classify frameworks as industry-based, international or region-specific, and distinguish functional from behavioral testing'] },
  { id: '5.5-penetration-testing', topic: '5.5', title: 'Penetration Testing: Environments, Team Types, Reconnaissance and Rules of Engagement', minutes: 10, file: '5.5-penetration-testing.md',
    objectives: ['Follow the SP 800-115 planning, discovery, attack and reporting phases', 'Choose known, partially known or unknown environment testing', 'Distinguish physical, offensive, defensive and integrated testing', 'Classify reconnaissance as passive or active', 'Write rules of engagement before testing'] },
  { id: '5.6-security-awareness', topic: '5.6', title: 'Security Awareness: Training Types, Delivery, Effectiveness Metrics and Topics', minutes: 11, file: '5.6-security-awareness.md',
    objectives: ['Choose onboarding, ongoing, targeted or corrective training for a situation', 'Select LMS, self-service, one-to-one or one-to-many delivery', 'Calculate and interpret phishing click and report rates', 'Use managerial reports and behavior risk scoring to direct effort', 'Cover the common training topics, from BEC to OPSEC'] },
];
