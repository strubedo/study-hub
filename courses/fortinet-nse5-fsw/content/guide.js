// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-29): NSE 5 FortiSwitch 7.6 Administrator exam page
// (training.fortinet.com/local/staticpage/view.php?page=fortiswitch_administrator_exam), NSE 5 Secure
// Networking certification page (…?page=nse_5_secure_networking), FortiSwitch 7.6 Administrator course
// page (…?page=library_fortiswitch-administrator), training-policy page (…?page=training_policies),
// helpdesk.training.fortinet.com fee notice (articles/73000672897) and OnVUE notice (articles/73000672931),
// FortiLink Guide 7.6.1 (Introduction: managed-switch limits per FortiGate model) and the FortiGate-VM
// permanent trial page (docs.fortinet.com/document/fortigate/7.6.8/administration-guide/441460).
// Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['NSE 4 FortiOS', 'Required first. NSE 5 Secure Networking needs the NSE 4 FortiOS certification.'],
  ['NSE 5 Secure Networking', 'NSE 4 + one of: **FortiSwitch 7.6** (this course), Secure Wireless LAN 7.6 or SD-WAN Core 7.6, passed within 2 years.'],
  ['NSE 7 Secure Networking', 'Active NSE 4 + active NSE 5 SN **or** NSE 6 SN, then the Secure Networking 7.6 Architect exam (test center only).'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit — no partial credit, no deduction for wrong answers. The score report shows per-topic grades for reference only.'],
  ['Retake after a fail', 'Wait **15 days**. You can\'t retake an exam you passed.'],
  ['Validity', 'Certifications are valid for **2 years**; earning NSE 7 Secure Networking also renews NSE 4/5/6.'],
  ['Delivery', 'Pearson VUE test center or **OnVUE** online proctoring (NSE 4–6 keep OnVUE; only NSE 7 is test center only).'],
  ['Fees', `${EXAM.price}.`],
];

const STRATEGY = [
  ['Know which box you are typing on', 'Most items are FortiLink mode: the switch is configured from the FortiGate (`config switch-controller managed-switch`, `edit <serial>`, `config ports`). Standalone items use FortiSwitchOS (`config switch interface`, `config switch physical-port`). A command on the wrong device is a classic distractor.'],
  ['Read get-conn-status like a table', '`execute switch-controller get-conn-status` shows each switch\'s version, `Authorized/Up` / `Discovered/Down` status, flags (C config sync, U upgrading, E config sync error, 2 / 3 layer-2 / layer-3, V VXLAN) and address. Start every FortiLink troubleshooting item there.'],
  ['Learn the defaults', 'Switch controller reserved network 10.255.0.0/16, management VLAN 4094, FortiLink split interface on by default, LLDP neighbor detection by default from FortiOS 7.6.1, STP on for non-FortiLink ports, loop guard off, DHCP-snooping ports untrusted, DAI and IPv4 source guard off.'],
  ['Order of dependencies', 'DAI and IPv4 source guard dynamic entries need DHCP snooping; BPDU guard needs an edge port; MCLAG needs the FortiLink split interface first; VLAN interface templates only work before any switch is authorized.'],
  ['Choose-two means exactly two', 'No partial credit: one wrong choice scores zero. The simulator here grades the same way.'],
  ['Lab what you can', 'There is no free FortiSwitch VM to our knowledge, so switch-side output is exhibit-reading practice. A FortiGate-VM trial still shows the whole switch-controller config tree and FortiLink interface setup (the FortiLink Guide lists FortiGate-VM01 as managing up to 8 switches).'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 5 FortiSwitch exam',
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
        blocks: [{ type: 'text', md: `**${EXAM.name}** covers ${EXAM.product}. Fortinet says it tests applied knowledge of the FortiSwitch management mode, provisioning over the FortiLink protocol, configuration, operation and day-to-day administration, including supported deployment topologies, operational scenarios, configuration extracts and troubleshooting captures, and also FortiSwitch in standalone mode. ${EXAM.languages}. Fortinet recommends about six months of hands-on FortiSwitch experience. It publishes four areas and 15 tasks but **no domain weights**; the weights on this site are an estimate. No 8.0 version of this exam has been announced (checked 2026-10-29).` }],
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
        title: 'Exam areas',
        blocks: [{ type: 'domains', columns: ['NSE 5 FortiSwitch 7.6', 'Weight'] }],
        note: 'Fortinet publishes no weights for this exam. This site weights the simulator by task count (6, 3, 3 and 3 of 15 tasks).',
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
