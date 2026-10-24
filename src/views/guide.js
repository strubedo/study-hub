// Exam guide: logistics, policies, v1.1 → v2.0 changes, and test-taking strategy.
// Policy facts: Cisco exam policies page. Topic diff: official v1.1 and v2.0 exam-topic PDFs.
import { html, raw, md, icon, todayIso } from '../ui.js';
import { EXAM, DOMAINS } from '../../content/blueprint.js';
import { daysBetween } from '../lib/plan.js';

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

const inline = (s) => raw(md(s, { inline: true }));

export async function render(root) {
  const daysToV2 = daysBetween(todayIso(), EXAM.liveFrom);
  root.innerHTML = String(html`
    <div class="page-header"><div><div class="eyebrow">Exam guide</div><h1>Everything about test day</h1>
      <p>Logistics, policies, what changed in v2.0, and how to pace the exam.</p></div>
      <a class="btn" href="https://home.pearsonvue.com/cisco" target="_blank" rel="noopener">${icon('external')} Schedule with Pearson VUE</a></div>

    <div class="grid grid-4">
      <div class="card stat"><span class="value">${EXAM.minutes} min</span><span class="label">Exam length</span></div>
      <div class="card stat"><span class="value">~${EXAM.questionsApprox}</span><span class="label">Items (count varies)</span></div>
      <div class="card stat"><span class="value">300–1000</span><span class="label">Score scale · cut score unpublished (~825 est.)</span></div>
      <div class="card stat"><span class="value">3 years</span><span class="label">Certification validity</span></div>
    </div>

    <div class="card mt" style="border-color:var(--accent)">
      <h3>Which version will you sit?</h3>
      <p class="mb0">v1.1 can be taken through <strong>${EXAM.previousVersionLastDay}</strong>. v2.0 (this site) is live from <strong>${EXAM.liveFrom}</strong>${daysToV2 > 0 ? `, ${daysToV2} days from today` : ''}. Same exam code (200-301), different blueprint. Book on or after ${EXAM.liveFrom} to sit v2.0.</p>
    </div>

    <div class="grid grid-2 mt" style="align-items:start">
      <div class="card">
        <h3>Weights: v1.1 → v2.0</h3>
        <div class="table-wrap"><table class="ref-table">
          <thead><tr><th>v1.1 (6 domains)</th><th>%</th></tr></thead>
          <tbody>${V11_WEIGHTS.map(([n, w]) => html`<tr><td>${n}</td><td>${w}</td></tr>`)}</tbody></table></div>
        <div class="table-wrap mt"><table class="ref-table">
          <thead><tr><th>v2.0 (5 domains)</th><th>%</th></tr></thead>
          <tbody>${DOMAINS.map((d) => html`<tr><td><span class="dom-tag dom-${d.id}">D${d.id}</span> ${d.title}</td><td>${d.weight}</td></tr>`)}</tbody></table></div>
      </div>
      <div class="card">
        <h3>Policies (Cisco associate-level exams)</h3>
        <div class="list">${POLICIES.map(([t, d]) => html`<div class="list-item"><span class="grow"><span class="title">${t}</span><span class="sub">${d}</span></span></div>`)}</div>
        <p class="small muted mb0 mt">Policies change. Confirm on <a href="https://www.cisco.com/site/us/en/learn/training-certifications/exams/policies.html" target="_blank" rel="noopener">Cisco's exam policies page</a> before booking.</p>
      </div>
    </div>

    <div class="grid grid-2 mt" style="align-items:start">
      <div class="card"><h3>New or expanded in v2.0</h3><div class="list">${ADDED.map(([t, d]) => html`
        <div class="list-item"><span class="badge badge-ok" style="min-width:84px;justify-content:center">${t}</span><span class="grow small">${inline(d)}</span></div>`)}</div></div>
      <div class="card"><h3>Dropped from the blueprint</h3>
        <p class="small muted">Still useful background (some are prerequisites), but no longer listed objectives.</p>
        <div class="list">${REMOVED.map((r) => html`<div class="list-item"><span class="badge badge-warn">Removed</span><span class="grow small">${r}</span></div>`)}</div>
        <p class="small muted mb0 mt">Compiled by comparing Cisco's official v1.1 and v2.0 exam-topic PDFs.</p></div>
    </div>

    <div class="card mt"><h3>Test-taking strategy</h3>
      <div class="grid grid-2">${STRATEGY.map(([t, d]) => html`<div><strong>${t}</strong><p class="small muted mb0">${inline(d)}</p></div>`)}</div></div>`);
}
