// Official Fortinet "NSE 5 - SD-WAN Core 7.6 Administrator" exam topics.
// Source: training.fortinet.com/local/staticpage/view.php?page=sd-wan_core_administrator_exam
// (status Available, checked 2026-10-29). Product version FortiOS 7.6 and FortiManager 7.6.
// The page writes the name two ways: "Fortinet NSE 5 - SD-WAN Core 7.6 Administrator" (header)
// and "Fortinet NSE 5 - SD-WAN 7.6 Core Administrator" (Exam name). Time is a range (60–70 min).
// Sub-bullets are Fortinet's list (light capitalisation fixes only, plus "Used cases" → "Use cases"
// in 3.1; Fortinet repeats some bullets across tasks). Fortinet publishes weight ranges; `weight`
// is the midpoint.

export const EXAM = {
  code: 'NSE 5',
  name: 'Fortinet NSE 5 - SD-WAN Core 7.6 Administrator',
  certification: 'Counts toward Fortinet Certified NSE 5 Secure Networking',
  product: 'FortiOS 7.6 and FortiManager 7.6',
  minutes: 65,
  minutesRange: '60–70',
  questionsApprox: '30–35',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$210 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 20,
    weightRange: '15-25%',
    title: 'SD-WAN architecture and concept',
    short: 'Architecture',
    topics: [
      { id: '1.1', verb: 'Design', title: 'enterprise SD-WAN basic architectures', sub: ['SD-WAN concepts', 'Architecture components', 'Use cases', 'Describe DIA topologies', 'Design recommendations', 'Best practices', 'SD-WAN basic components', 'Basic SD-WAN DIA setup', 'SD-WAN setup wizard', 'SD-WAN traffic distribution and member health', 'SD-WAN widgets', 'SD-WAN traffic logs and events'] },
      { id: '1.2', verb: 'Configure', title: 'SD-WAN members and zone with FortiGate', keepCase: true, sub: ['Underlay and overlay links', 'Members and zones', 'SD-WAN traffic distribution and member health', 'Use cases'] },
      { id: '1.3', verb: 'Configure', title: 'SD-WAN health checks', keepCase: true, sub: ['Performance SLAs', 'Active and passive monitoring', 'SLA targets', 'Member status and performance', 'Member state change actions', 'ICMP probes and SLA information', 'Advanced performance SLA settings', 'Use case'] },
    ],
  },
  {
    id: 2,
    weight: 40,
    weightRange: '35-45%',
    title: 'SD-WAN traffic control, rules and routing',
    short: 'Rules & routing',
    topics: [
      { id: '2.1', verb: 'Configure', title: 'SD-WAN rules', keepCase: true, sub: ['Objectives of SD-WAN rules', 'SD-WAN rule strategies', 'SD-WAN for local-out traffic', 'Implicit SD-WAN rule', 'SD-WAN rules with the FortiGate GUI', 'SD-WAN rule status', 'SD-WAN rule traffic matching criteria', 'Internet services as destination criteria', 'Preferred member selection with the manual strategy', 'Load balancing with SD-WAN rules', 'Quality metrics', 'Advantage given to higher priority members', 'Preferred member election with the lowest cost (SLA) strategy', 'SLA target maps', 'Impact of the minimum-SLA-meet-members parameter', 'Use cases'] },
      { id: '2.2', verb: 'Configure', title: 'SD-WAN routing', keepCase: true, sub: ['Key routing principles in SD-WAN', 'Policy routes', 'Route lookup process', 'Member static routes', 'Static routes for zones', 'Member probe routes', 'Use cases'] },
      { id: '2.3', verb: 'Implement and monitor', title: 'SD-WAN performance controls', keepCase: true, sub: ['Session table', 'Protocol states', 'Common session flags', 'Session reevaluation and triggers', 'Control routing changes in SNAT sessions'] },
    ],
  },
  {
    id: 3,
    weight: 40,
    weightRange: '35-45%',
    title: 'Centralized management, visibility and troubleshooting',
    short: 'Management & troubleshooting',
    topics: [
      { id: '3.1', verb: 'Explain', title: 'centralized management of SD-WAN', sub: ['FortiManager basics', 'FortiManager features for SD-WAN', 'SD-WAN management on FortiManager (SD-WAN template)', 'SD-WAN settings on FortiManager', 'Metadata variable configuration and use', 'Templates and groups', 'Use cases'] },
      { id: '3.2', verb: 'Analyze', title: 'traffic and security logs', sub: ['SD-WAN widgets', 'SD-WAN traffic logs and events'] },
      { id: '3.3', verb: 'Troubleshoot', title: 'connectivity and policy behavior', sub: ['General troubleshooting commands useful in an SD-WAN context', 'CLI command output to observe SD-WAN parameters and behavior'] },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

export function topicLabel(t) {
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}
