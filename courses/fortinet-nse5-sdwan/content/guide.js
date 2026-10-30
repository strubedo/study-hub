// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-29): NSE 5 SD-WAN Core 7.6 Administrator exam page
// (training.fortinet.com/local/staticpage/view.php?page=sd-wan_core_administrator_exam), NSE 5 Secure
// Networking certification page, SD-WAN Core Administrator course page, training-policy page,
// helpdesk.training.fortinet.com fee and OnVUE notices, FortiOS 7.6.3 guide (SD-WAN Setup wizard).
// Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['NSE 4 FortiOS', 'Required first. NSE 5 Secure Networking needs the NSE 4 FortiOS certification.'],
  ['NSE 5 Secure Networking', 'NSE 4 + one of: FortiSwitch 7.6, Secure Wireless LAN 7.6 or **SD-WAN Core 7.6** (this course), passed within 2 years.'],
  ['NSE 7 Secure Networking', 'Active NSE 4 + active NSE 5 SN **or** NSE 6 SN, then the Secure Networking 7.6 Architect exam (test center only).'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit — no partial credit, no deduction for wrong answers. Question types: multiple choice and drag-and-drop.'],
  ['Retake after a fail', 'Wait **15 days**. You can\'t retake an exam you passed.'],
  ['Validity', 'Certifications are valid for **2 years**; earning NSE 7 Secure Networking also renews NSE 4/5/6.'],
  ['Delivery', 'Pearson VUE test center or **OnVUE** online proctoring (NSE 4–6 keep OnVUE; only NSE 7 is test center only).'],
  ['Fees', `${EXAM.price}.`],
];

const STRATEGY = [
  ['Read service4 like a table', 'Many items show `diagnose sys sdwan service4` or `health-check` output. Find the mode (manual, priority = Best Quality, sla = Lowest Cost), which members are alive, in SLA and `selected`, and in what order.'],
  ['Know the 7.4.1+ strategy names', 'Maximize Bandwidth (SLA) is now the load-balancing option inside a Manual or Lowest Cost (SLA) rule. Expect the 7.6 names and CLI on the exam.'],
  ['Routes before rules', 'Route lookup goes policy routes (your PBRs, SD-WAN rules, ISDB routes) and then the routing table. When a rule doesn\'t match, the implicit rule load-balances over the ECMP routes.'],
  ['Do the SLA arithmetic', 'Defaults: 500 ms interval, 5 failures to go inactive, 5 successes to recover, 5 ms latency and jitter targets, 0% loss. Work out how long a failover takes and why a link is in or out of SLA.'],
  ['Sessions outlive routes', 'Existing sessions don\'t always follow a new route: SNAT sessions keep their path until `snat-route-change` is enabled. Read session-list flags and route-change triggers carefully.'],
  ['Choose-two means exactly two', 'No partial credit: one wrong choice scores zero. The simulator here grades the same way.'],
  ['Lab inside the trial', 'FortiGate-VM trial: 3 interfaces, 3 policies, 3 routes, no FortiGuard (no ISDB updates; the Setup wizard needs an SD-WAN licence). One LAN + two WAN members is enough for zones, SLAs, rules and diagnose output. FortiManager-VM trial: 3 devices, 2 ADOMs.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 5 SD-WAN Core exam',
    intro: 'Format, where it sits on the Secure Networking path, Fortinet\'s policies, and how to approach the exam.',
    action: { label: 'Schedule with Pearson VUE', href: 'https://home.pearsonvue.com/fortinet' },
    stats: [
      [`${EXAM.minutesRange} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['Pass / fail', 'No published cut score · no partial credit'],
      [`${EXAM.validityYears} years`, 'Certification validity'],
    ],
    rows: [
      [{
        title: 'About this exam',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** (also written "SD-WAN 7.6 Core Administrator" on the same page) covers ${EXAM.product}. Fortinet says it tests applied knowledge of Secure SD-WAN configuration and operation: operational scenarios, monitoring and performance analysis, integration with FortiGate and centralized management, and troubleshooting of WAN connectivity, routing, application steering and SD-WAN performance. English only. The matching course is built on FortiOS 7.6.3 and FortiManager 7.6.3. No 8.0 version of this exam has been announced (checked 2026-10-29).` }],
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
        blocks: [{ type: 'domains', columns: ['NSE 5 SD-WAN Core 7.6', '%'] }],
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
