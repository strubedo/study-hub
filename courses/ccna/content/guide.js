// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js:
// logistics, policies, v1.1 → v2.0 changes, and test-taking strategy.
// Policy facts: Cisco exam policies page. Topic diff: official v1.1 and v2.0 exam-topic PDFs.
// Strings are inline markdown. The default export receives { today, daysBetween } at render time.
import { EXAM } from './blueprint.js';

const V11_WEIGHTS = [
  ['Network Fundamentals', 20], ['Network Access', 20], ['IP Connectivity', 25], ['IP Services', 10], ['Security Fundamentals', 15], ['Automation and Programmability', 10],
];

const ADDED = [
  ['1.1', 'Diagnose cabling, including fiber signal levels, pinouts and distance (v1.1 only asked you to identify collision/duplex/speed issues)'],
  ['1.4 · 1.6 · 1.7', 'IPv6, client connectivity (wired **and** wireless) and DHCPv4 server/relay become **troubleshoot** objectives'],
  ['2.2', 'Edge-port profiles: PoE, IoT, APs (local vs FlexConnect), IP phones, virtualized hosts, appliances'],
  ['2.3', 'Use CDP/LLDP to **validate network documentation**'],
  ['2.4', 'Troubleshoot with show commands incl. logs, extended ping, traceroute and **packet-capture output**'],
  ['3.3', '**OSPFv3** for IPv6 alongside OSPFv2'],
  ['3.4', 'Interpret **HSRP and VRRP** operational status (was "describe FHRPs")'],
  ['4.1', 'Configure devices as **AAA clients** of TACACS+ / RADIUS'],
  ['4.2', '**SFTP / SCP** file management (replaces TFTP/FTP)'],
  ['4.3', 'NAT **and PAT** on IOS XE'],
  ['4.4', 'Diagnose **DNS record** problems (A, AAAA, CNAME, MX, NS, PTR)'],
  ['4.7', '**Storm control** and **IPv6 RA guard** join DHCP snooping, DAI and port security'],
  ['5.1 · 5.2', '**Agentic AI** in operations, and **choosing a prompt** for a generative AI system'],
  ['5.3', 'Management approaches incl. cloud, controller, automation and **infrastructure as code**'],
  ['5.6', '**Interpret** syslog content, severities and facilities'],
  ['Exam-wide', 'You may have to evaluate output and recommendations from agentic AI / digital network assistants'],
];

const REMOVED = [
  'Network topology architectures (two-tier, three-tier, spine-leaf, WAN, SOHO, on-prem vs cloud)',
  'Compare TCP to UDP; switching concepts (MAC learning, flooding) as standalone objectives',
  'Cisco wireless architectures and AP modes, WLC physical connections, WLAN GUI configuration (WPA2-PSK)',
  'NTP client/server configuration',
  'QoS per-hop behaviors (classification, marking, queuing, policing, shaping)',
  'TFTP/FTP capabilities (replaced by SFTP/SCP)',
  'Security program elements, threat/vulnerability definitions, password-policy elements',
  'SDN architecture detail (overlay/underlay/fabric, northbound/southbound APIs), REST API characteristics, JSON components',
  'BPDU filter (v2.0 lists root guard, loop guard and BPDU guard only); VRFs dropped from virtualization',
];

const STRATEGY = [
  ['Budget your time', `${EXAM.minutes} minutes for roughly ${EXAM.questionsApprox} items: about a minute per question, with labs taking several minutes each. Check the clock every 25 questions.`],
  ['You cannot go back', 'Once you submit an item it is final, so commit and move on. Practice exams here use this mode by default.'],
  ['Read the selection count', '"Choose two" means exactly two. Multi-answer items are all-or-nothing in this simulator; assume the same on the real exam.'],
  ['Labs: verify before you leave', 'Use `show` commands and `ping` to prove each task works. If a task asks you to save the configuration, save it.'],
  ['Troubleshooting items', 'v2.0 is built around troubleshoot/diagnose verbs. Read every line of an exhibit. The answer usually hides in one counter, state or mask.'],
  ['AI-assistant exhibits', 'Treat AI output like a junior engineer\'s ticket: check each claim against the show output, and watch for invented commands and unsafe "fixes".'],
  ['Subnetting speed', 'Basic subnet questions should take under 30 seconds. Run the 5-minute sprint until you average 15+.'],
];

const POLICIES = [
  ['Retake after a fail', 'Wait five calendar days, counted from the day after the failed attempt.'],
  ['Retake after a pass', 'At least 180 days before taking the same exam number again.'],
  ['ID at a test center', 'Two forms of ID, both signed; one must be a government-issued photo ID. A digital photo and signature are captured on site.'],
  ['Delivery', 'Pearson VUE test center, or online proctored from home/office. Run Pearson\'s system test before booking online.'],
  ['Recertify', 'Every 3 years, by passing an exam or earning continuing-education credits.'],
];

export default function guide({ today, daysBetween }) {
  const daysToV2 = daysBetween(today, EXAM.liveFrom);
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about test day',
    intro: 'Logistics, policies, what changed in v2.0, and how to pace the exam.',
    action: { label: 'Schedule with Pearson VUE', href: 'https://home.pearsonvue.com/cisco' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam length'],
      [`~${EXAM.questionsApprox}`, 'Items (count varies)'],
      ['300–1000', 'Score scale · cut score unpublished (~825 est.)'],
      ['3 years', 'Certification validity'],
    ],
    rows: [
      [{
        title: 'Which version will you sit?',
        accent: true,
        blocks: [{ type: 'text', md: `v1.1 can be taken through **${EXAM.previousVersionLastDay}**. v2.0 (this site) is live from **${EXAM.liveFrom}**${daysToV2 > 0 ? `, ${daysToV2} days from today` : ''}. Same exam code (200-301), different blueprint. Book on or after ${EXAM.liveFrom} to sit v2.0.` }],
      }],
      [{
        title: 'Weights: v1.1 → v2.0',
        blocks: [
          { type: 'table', columns: ['v1.1 (6 domains)', '%'], rows: V11_WEIGHTS.map(([n, w]) => [n, String(w)]) },
          { type: 'domains', columns: ['v2.0 (5 domains)', '%'] },
        ],
      }, {
        title: 'Policies (Cisco associate-level exams)',
        blocks: [{ type: 'list', items: POLICIES }],
        note: "Policies change. Confirm on [Cisco's exam policies page](https://www.cisco.com/site/us/en/learn/training-certifications/exams/policies.html) before booking.",
      }],
      [{
        title: 'New or expanded in v2.0',
        blocks: [{ type: 'badges', kind: 'ok', align: true, items: ADDED }],
      }, {
        title: 'Dropped from the blueprint',
        intro: 'Still useful background (some are prerequisites), but no longer listed objectives.',
        blocks: [{ type: 'badges', kind: 'warn', items: REMOVED.map((r) => ['Removed', r]) }],
        note: "Compiled by comparing Cisco's official v1.1 and v2.0 exam-topic PDFs.",
      }],
      [{
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
