// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-29): NSE 6 FortiNAC-F 7.6 Administrator exam page
// (training.fortinet.com/local/staticpage/view.php?page=fortinac_administrator_exam), NSE 6 Secure Networking
// and NSE 7 Secure Networking certification pages, training-policies page, helpdesk.training.fortinet.com
// notices (exam fees, updated 2026-10-05; OnVUE delivery, 2026-10-13). Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['NSE 4 FortiOS', 'Required first. NSE 6 Secure Networking needs an active NSE 4.'],
  ['NSE 6 Secure Networking', 'NSE 4 + one of: FortiManager 7.6 or **FortiNAC-F 7.6** (this course). FortiAnalyzer and FortiVoice exams are listed as "coming soon".'],
  ['NSE 7 Secure Networking', 'Active NSE 4 + active NSE 5 SN or NSE 6 SN, then the Secure Networking 7.6 Architect exam. It includes a use case on integrating FortiNAC with dynamic firewall addressing.'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit — no partial credit, no deduction for wrong answers.'],
  ['Retake after a fail', 'Wait **15 days**. You can\'t retake an exam you passed.'],
  ['Validity', 'Certifications are valid for **2 years**; earning NSE 7 also renews NSE 4/5/6.'],
  ['Delivery', 'Pearson VUE test center or OnVUE online proctoring (OnVUE remains available for NSE 4–6).'],
  ['Fees', `${EXAM.price}.`],
];

const STRATEGY = [
  ['Follow one host', 'Most items turn on a host\'s state: rogue, registered, profiled device, at risk, disabled. Know what moves a host between states and which isolation network or VLAN it lands in at each step.'],
  ['Know the policy chain', 'User/host profile → network access policy → network access configuration (logical network → VLAN, CLI configuration or VPN group on each modeled device). Policies are evaluated top down; the first match wins.'],
  ['Security rules in order', 'Event → trigger → highest-ranked rule whose trigger and user/host profile match → alarm → action. Rank matters.'],
  ['HA: who checks whom', 'In 1+1, the secondary watches the primary. In N+1, the secondary CA checks each primary directly and then indirectly through another primary before it fails over.'],
  ['Choose-two means exactly two', 'No partial credit: one wrong choice scores zero. The simulator here grades the same way.'],
  ['Mind the version', 'The exam is FortiNAC-F 7.6 (FortiNAC-OS), not the legacy CentOS-based FortiNAC. 7.6 point releases changed some workflows (for example 7.6.7 enforcement); the lessons flag where.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 6 FortiNAC-F exam',
    intro: 'Format, where it sits on the Secure Networking path, Fortinet\'s policies, and how to approach the exam.',
    action: { label: 'Schedule with Pearson VUE', href: 'https://home.pearsonvue.com/fortinet' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['Pass / fail', 'No published cut score · no partial credit'],
      [`${EXAM.validityYears} years`, 'Certification validity'],
    ],
    rows: [
      [{
        title: 'About this exam',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** covers ${EXAM.product}. It tests applied knowledge of FortiNAC-F configuration, operation and day-to-day administration through operational scenarios, configuration extracts and troubleshooting captures, including FortiNAC-F HA and FortiNAC-F Manager. English only. Fortinet recommends six months of hands-on experience. No 8.0 version of this exam has been announced (checked 2026-10-29).` }],
      }],
      [{
        title: 'The Secure Networking path',
        blocks: [{ type: 'list', items: PATH }],
      }, {
        title: 'Fortinet exam policies',
        blocks: [{ type: 'list', items: POLICIES }],
        note: 'Policies change. Confirm on Fortinet\'s [training policies page](https://training.fortinet.com/local/staticpage/view.php?page=training_policies) before booking.',
      }],
      [{
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['NSE 6 FortiNAC-F 7.6', '%'] }],
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
