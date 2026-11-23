// Official Cisco exam topics: Implementing Cisco Enterprise Network Core Technologies v1.2 (350-401 ENCOR).
// Source: Cisco exam topics PDF (350-401-ENCORE-v1.2.pdf) and the Cisco exam page (checked 2026-11-22).
// v1.2 differs from v1.1: there is no wireless section, and the last domain is "Automation and
// Artificial Intelligence". Topics are Cisco's numbered exam topics; `sub` holds the lettered sub-topics.

export const EXAM = {
  code: '350-401',
  name: 'Implementing Cisco Enterprise Network Core Technologies v1.2 (350-401 ENCOR)',
  certification: 'CCNP Enterprise (core exam); also the CCIE Enterprise qualifying exam',
  product: 'Cisco enterprise networks',
  minutes: 120,
  questions: 100,
  questionsApprox: 'about 100',
  passingScore: 825,
  passingScoreNote: 'Cisco does not publish a passing score or question count; ~825/1000 is a commonly cited community estimate.',
  scoring: 'Scaled 300–1000; Cisco does not publish the passing score.',
};

export const DOMAINS = [
  {
    id: 1, weight: 15, title: 'Architecture', short: 'Architecture',
    topics: [
      { id: '1.1', verb: 'Explain', title: 'the different design principles used in an enterprise network', sub: ['High-level enterprise network design such as 2-tier, 3-tier, fabric and cloud', 'High availability techniques such as redundancy, FHRP and SSO'] },
      { id: '1.2', verb: 'Explain', title: 'the working principles of the Cisco Catalyst SD-WAN solution', keepCase: true, sub: ['SD-WAN control and data plane elements', 'Benefits and limitations of the Catalyst SD-WAN solution'] },
      { id: '1.3', verb: 'Explain', title: 'the working principles of the Cisco SD-Access solution', keepCase: true, sub: ['SD-Access control and data plane elements', 'Traditional campus interoperating with SD-Access'] },
      { id: '1.4', verb: 'Interpret', title: 'QoS configurations', keepCase: true, sub: ['QoS configurations'] },
    ],
  },
  {
    id: 2, weight: 10, title: 'Virtualization', short: 'Virtualization',
    topics: [
      { id: '2.1', verb: 'Describe', title: 'device virtualization technologies', sub: ['Hypervisor type 1 and 2', 'Virtual machine', 'Virtual switching'] },
      { id: '2.2', verb: 'Configure', title: 'and verify data path virtualization technologies', sub: ['VRF', 'GRE and IPsec tunneling'] },
      { id: '2.3', verb: 'Describe', title: 'network virtualization concepts', sub: ['LISP', 'VXLAN'] },
    ],
  },
  {
    id: 3, weight: 30, title: 'Infrastructure', short: 'Infrastructure',
    topics: [
      { id: '3.1', verb: 'Configure', title: 'and troubleshoot Layer 2', sub: ['Troubleshoot static and dynamic 802.1q trunking protocols', 'Troubleshoot static and dynamic EtherChannels', 'Configure and verify common Spanning Tree Protocols (RSTP, MST) and Spanning Tree enhancements such as root guard and BPDU guard'] },
      { id: '3.2', verb: 'Configure', title: 'and verify Layer 3', sub: ['Compare routing concepts of EIGRP and OSPF (advanced distance vector vs. link state, load balancing, path selection, path operations, metrics and area types)', 'Configure simple OSPFv2/v3 environments, including multiple normal areas, summarization and filtering (neighbor adjacency, point-to-point and broadcast network types, and passive-interface)', 'Configure and verify eBGP between directly connected neighbors (best path selection algorithm and neighbor relationships)', 'Describe policy-based routing'] },
      { id: '3.3', verb: 'Configure', title: 'and describe IP services', keepCase: true, sub: ['Interpret network time protocol configurations such as NTP and PTP', 'Configure NAT/PAT', 'Configure first hop redundancy protocols, such as HSRP and VRRP', 'Describe multicast protocols, such as RPF check, PIM SM, IGMP v2/v3, SSM, bidir and MSDP'] },
    ],
  },
  {
    id: 4, weight: 10, title: 'Network Assurance', short: 'Network assurance',
    topics: [
      { id: '4.1', verb: 'Diagnose', title: 'network problems using tools such as debugs, conditional debugs, traceroute, ping, SNMP and syslog', sub: ['Debugs and conditional debugs', 'Traceroute and ping', 'SNMP', 'Syslog'] },
      { id: '4.2', verb: 'Configure', title: 'and verify Flexible NetFlow', keepCase: true, sub: ['Flexible NetFlow'] },
      { id: '4.3', verb: 'Configure', title: 'SPAN/RSPAN/ERSPAN', keepCase: true, sub: ['SPAN', 'RSPAN', 'ERSPAN'] },
      { id: '4.4', verb: 'Configure', title: 'and verify IPSLA', keepCase: true, sub: ['IP SLA'] },
      { id: '4.5', verb: 'Describe', title: 'how Cisco Catalyst Center is used to apply network configuration, monitoring and management', keepCase: true, sub: ['Catalyst Center (formerly Cisco DNA Center)', 'Traditional workflows', 'AI-powered workflows'] },
      { id: '4.6', verb: 'Configure', title: 'and verify NETCONF and RESTCONF', keepCase: true, sub: ['NETCONF', 'RESTCONF'] },
    ],
  },
  {
    id: 5, weight: 20, title: 'Security', short: 'Security',
    topics: [
      { id: '5.1', verb: 'Configure', title: 'and verify device access control', sub: ['Lines and local user authentication', 'Authentication and authorization using AAA'] },
      { id: '5.2', verb: 'Configure', title: 'and verify infrastructure security features', sub: ['ACLs', 'CoPP'] },
      { id: '5.3', verb: 'Describe', title: 'REST API security', keepCase: true, sub: ['REST API security'] },
      { id: '5.4', verb: 'Describe', title: 'the components of network security design', sub: ['Threat defense', 'Endpoint security', 'Next-generation firewall', 'TrustSec and MACsec'] },
    ],
  },
  {
    id: 6, weight: 15, title: 'Automation and Artificial Intelligence', short: 'Automation & AI',
    topics: [
      { id: '6.1', verb: 'Interpret', title: 'basic Python components and scripts', keepCase: true, sub: ['Python components and scripts'] },
      { id: '6.2', verb: 'Construct', title: 'valid JSON-encoded files', keepCase: true, sub: ['JSON-encoded files'] },
      { id: '6.3', verb: 'Describe', title: 'the high-level principles and benefits of a data modeling language, such as YANG', keepCase: true, sub: ['YANG'] },
      { id: '6.4', verb: 'Describe', title: 'APIs for Cisco Catalyst Center and SD-WAN Manager', keepCase: true, sub: ['Catalyst Center APIs', 'SD-WAN Manager APIs'] },
      { id: '6.5', verb: 'Interpret', title: 'REST API response codes and results in payload using Cisco Catalyst Center and RESTCONF', keepCase: true, sub: ['Catalyst Center responses', 'RESTCONF responses'] },
      { id: '6.6', verb: 'Construct', title: 'an EEM applet to automate configuration, troubleshooting or data collection', keepCase: true, sub: ['EEM applet for configuration', 'EEM applet for troubleshooting', 'EEM applet for data collection'] },
      { id: '6.7', verb: 'Compare', title: 'agent vs. agentless orchestration tools', sub: ['Agent-based tools', 'Agentless tools'] },
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
