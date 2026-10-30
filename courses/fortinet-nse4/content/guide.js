// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js:
// exam facts, the Secure Networking path, Fortinet policies, 7.6 → 8.0 changes and strategy.
// Sources (checked 2026-10-29): NSE 4 FortiOS 8.0 and 7.6 exam pages, Fortinet certification
// program and training-policy pages, helpdesk.training.fortinet.com notices. Strings are inline markdown.
import { EXAM } from './blueprint.js';

const WEIGHTS_76 = [
  ['Deployment and system configuration', '20–25'], ['Firewall policies and authentication', '20–25'],
  ['Content inspection', '25–30'], ['Routing', '10–15'], ['VPNs', '10–15'],
];

const ADDED = [
  ['1.1', '**FortiAI and GenAI on the CLI**'],
  ['1.2', 'Session helper statistics, improved telemetry, and FortiAnalyzer registration / log-viewing use cases'],
  ['1.5', 'Automation-ready configurations and the telemetry address for cloud FortiGate-VMs (FortiGate CNF dropped)'],
  ['1.6', 'FortiSASE: ZTNA integration, identity and tagging, DLP for GenAI chatbots, FortiData labels, OCR on DLP'],
  ['2.1', '**Tagging** for addresses and policies, dynamic tagging, colour/tag-based policy organisation'],
  ['2.4', 'Position **FSSO vs ZTNA identity**; FortiIdentity Cloud (FIC) and SSO'],
  ['3.1 · 5.1', '**TLS 1.3**-based VPN key negotiation'],
  ['3.2 · 3.4 · 3.5', '**DLP blocking GenAI chatbots**, AI/ML DNS-tunnelling detection, FortiGuard Extended SaaS DB'],
  ['4.2', 'SD-WAN based on **underlay bandwidth utilisation**'],
  ['5.1', '"IPsec v2" and **quantum-safe IPsec**'],
];

const PATH = [
  ['NSE 4 FortiOS', 'This course. Pass the FortiOS Administrator exam (8.0 when it launches, 7.6 until it retires).'],
  ['NSE 5 Secure Networking', 'NSE 4 + one of: FortiSwitch 7.6, Secure Wireless LAN 7.6, SD-WAN Core 7.6.'],
  ['NSE 6 Secure Networking', 'NSE 4 + one of: FortiManager 7.6, FortiNAC-F 7.6 (FortiAnalyzer and FortiVoice exams are "coming soon").'],
  ['NSE 7 Secure Networking', 'Active NSE 4 + active NSE 5 SN **or** NSE 6 SN, then the Secure Networking 7.6 Architect exam (test center only).'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit — no partial credit, no deduction for wrong answers. Your report shows per-topic grades for reference only.'],
  ['Retake after a fail', 'Wait **15 days**. No yearly attempt cap is published. You can\'t retake an exam you passed.'],
  ['Validity', 'Fortinet certifications are valid for **2 years** and can be renewed any time before they expire. Earning NSE 7 also renews NSE 4/5/6. Expired = start again.'],
  ['Recertification', 'Paid recertification assessments (self-paced course + online test, three attempts) exist for NSE 4 FortiOS Administrator once a newer exam version is out.'],
  ['Delivery', 'Pearson VUE test center or OnVUE online proctoring for NSE 4–6. NSE 7 is **test center only** since 2026-09-21.'],
  ['Fees', `${EXAM.price}. NSE 7 rises to US$420 on the same date.`],
];

const STRATEGY = [
  ['Read the exhibit first', 'Fortinet questions are built on configuration extracts and debug captures. Find the one line that decides it: the policy ID, the NAT flag, the route distance, the HA priority, the SLA state.'],
  ['Know the packet flow', 'Many troubleshooting items are really "where in the FortiOS packet flow does this happen?" — ingress, DNAT/VIP, routing, policy lookup, inspection, SNAT, egress.'],
  ['Choose-two means exactly two', 'No partial credit: a multi-select item with one wrong choice scores zero. The simulator here grades the same way.'],
  ['Flow vs proxy', 'Expect at least one item that hinges on which features or behaviours need proxy-based inspection.'],
  ['Learn the diagnose commands cold', '`diagnose debug flow`, `diagnose sniffer packet`, `get router info routing-table`, `get system ha status`, `diagnose vpn ike gateway list`. Recognise their output at a glance.'],
  ['Lab inside the trial limits', 'The free FortiGate-VM trial allows 3 interfaces, 3 policies and 3 routes and has no FortiGuard. Use it for CLI fluency, NAT, routing, SD-WAN, IPsec and debug practice; read the security-profile lessons for what FortiGuard adds.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 4 FortiOS exam',
    intro: 'Format, where NSE 4 sits on the Secure Networking path, Fortinet\'s policies, what changed in 8.0, and how to approach the exam.',
    action: { label: 'Schedule with Pearson VUE', href: 'https://home.pearsonvue.com/fortinet' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['Pass / fail', 'No published cut score · no partial credit'],
      [`${EXAM.validityYears} years`, 'Certification validity'],
    ],
    rows: [
      [{
        title: 'Which version will you sit?',
        accent: true,
        blocks: [{ type: 'text', md: `This site targets **${EXAM.name}** (product ${EXAM.product}). On 2026-10-29 Fortinet listed it as **Coming Soon**: the topics and the free self-paced course are published, the exam isn't bookable yet. The **FortiOS 7.6** version stays bookable until Fortinet retires it — typically about four months after the new version launches. The two versions share most material; the lists below show what 8.0 adds.` }],
      }],
      [{
        title: 'The Secure Networking path',
        blocks: [{ type: 'list', items: PATH }],
        note: 'The certifications are not tied to a FortiOS version, so NSE 4 on 8.0 followed by NSE 5/6/7 on 7.6 is a valid path.',
      }, {
        title: 'Fortinet exam policies',
        blocks: [{ type: 'list', items: POLICIES }],
        note: 'Policies change. Confirm on Fortinet\'s [training policies page](https://training.fortinet.com/local/staticpage/view.php?page=training_policies) before booking.',
      }],
      [{
        title: 'Weights: 7.6 → 8.0',
        blocks: [
          { type: 'table', columns: ['FortiOS 7.6 exam', '%'], rows: WEIGHTS_76 },
          { type: 'domains', columns: ['FortiOS 8.0 exam', '%'] },
        ],
        note: 'Deployment and system configuration grows from 20–25% to 25–35%; the others are unchanged.',
      }, {
        title: 'New in the 8.0 topic list',
        blocks: [{ type: 'badges', kind: 'ok', align: true, items: ADDED }],
        note: 'Compiled by comparing Fortinet\'s official 7.6 and 8.0 exam topic lists.',
      }],
      [{
        title: 'Test-taking strategy',
        intro: 'Fortinet uses multiple choice and drag-and-drop only — no labs. A Pearson Global Retake Offer gives a free retake (Jan 4 – Apr 7, 2027, current exam versions only) to candidates who sit an NSE exam between Sept 29 and Nov 17, 2026 and don\'t pass.',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
