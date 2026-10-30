// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-29): NSE 5 Secure Wireless LAN 7.6 Administrator exam page
// (training.fortinet.com/local/staticpage/view.php?page=secure_wireless_lan_administrator_exam), NSE 5 Secure
// Networking certification page (page=nse_5_secure_networking), Secure Wireless LAN Administrator course page
// (page=library_secure-wireless-lan-administrator), training-policy page (page=training_policies),
// helpdesk.training.fortinet.com fee and OnVUE notices, FortiWiFi and FortiAP 7.6.0 Configuration Guide
// (discovery, debug commands), FortiAIOps 3.2.0 User Guide.
// Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['NSE 4 FortiOS', 'Required first. NSE 5 Secure Networking needs the NSE 4 FortiOS certification.'],
  ['NSE 5 Secure Networking', 'NSE 4 + one of: FortiSwitch 7.6, **Secure Wireless LAN 7.6** (this course) or SD-WAN Core 7.6, passed within 2 years.'],
  ['NSE 7 Secure Networking', 'Active NSE 4 + active NSE 5 SN **or** NSE 6 SN, then the Secure Networking 7.6 Architect exam (test center only).'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit — no partial credit, no deduction for wrong answers. No cut score is published.'],
  ['Retake after a fail', 'Wait **15 days**. You can\'t retake an exam you passed.'],
  ['Validity', 'Certifications are valid for **2 years**; earning NSE 7 Secure Networking also renews NSE 4/5/6.'],
  ['Delivery', 'Pearson VUE test center or **OnVUE** online proctoring (NSE 4–6 keep OnVUE; only NSE 7 is test center only).'],
  ['Fees', `${EXAM.price}.`],
];

const STRATEGY = [
  ['Follow the AP through CAPWAP', 'Many items show a `wtp_filter` / `cw_acd` debug. Know the order: discovery request/response, DTLS setup, join, configuration, data channel check, RUN. Find the phase where it stops and you have the cause.'],
  ['Know the discovery order', 'Auto discovery tries static, DHCP (option 138), DNS, FortiManagement Cloud, then multicast (224.0.1.140) and broadcast. Broadcast only works in the same subnet; DHCP or static is how a remote AP finds the controller.'],
  ['Tunnel vs local bridge', 'Decide where client traffic leaves: tunnel SSIDs carry it in the CAPWAP data channel to the FortiGate (which then routes and inspects it); local-bridge SSIDs drop it onto the AP\'s Ethernet port. Many features (VLAN pooling load balancing, for one) depend on the mode.'],
  ['Match the security mode to the clients', 'WPA2-Personal vs WPA3-SAE vs SAE transition vs OWE vs Enterprise: know which needs PMF, which needs a RADIUS server, and which lets older clients connect. Captive portal is not available with Enterprise modes.'],
  ['Read sta_filter like a timeline', 'A client debug shows association, the 4-way handshake (EAPOL 1/4 to 4/4) and DHCP. Find the last good message to locate the failure: wrong PSK, RADIUS reject or no DHCP lease.'],
  ['Choose-two means exactly two', 'No partial credit: one wrong choice scores zero. The simulator here grades the same way.'],
  ['Lab what you can', 'FortiAP features need a real FortiAP (or a FortiWiFi). Without hardware, use the FortiGate-VM trial for the controller-side CLI and the course\'s on-demand labs for the rest.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 5 Secure Wireless LAN exam',
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
        blocks: [{ type: 'text', md: `**${EXAM.name}** covers ${EXAM.product}. Fortinet says it evaluates your knowledge of FortiAP "using the FortiGate integrated wireless controller and the FortiEdge Cloud management", and tests applied knowledge of wireless controller configuration, FortiEdge Cloud management, the FortiAIOps solution, operation and day-to-day administration, with operational scenarios, configuration extracts and troubleshooting captures. English only. The matching course lists FortiOS 7.6, FortiAP 7.6 and FortiAIOps 3.2. FortiPresence 2.0 is in the exam's product line but not in its topic list. Fortinet publishes **no domain weights**, so this site weights the four areas equally. The 7.4 version had its last delivery on August 31, 2026; no 8.0 version has been announced (checked 2026-10-29).` }],
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
        blocks: [{ type: 'domains', columns: ['NSE 5 Secure Wireless LAN 7.6', 'Weight'] }],
        note: 'Fortinet publishes no weights for this exam. The equal 25% split is this site\'s estimate.',
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
