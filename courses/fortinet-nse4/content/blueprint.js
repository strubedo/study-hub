// Official Fortinet "NSE 4 - FortiOS 8.0 Administrator" exam topics.
// Source: training.fortinet.com NSE 4 FortiOS 8.0 Administrator exam page (status "Coming Soon",
// checked 2026-10-29). Product version FortiOS 8.0.0. Sub-bullets are Fortinet's list (light
// capitalisation fixes only). Fortinet publishes weight ranges; `weight` is the midpoint.

export const EXAM = {
  code: 'NSE 4',
  name: 'Fortinet NSE 4 - FortiOS 8.0 Administrator',
  certification: 'Fortinet Certified NSE 4 FortiOS',
  product: 'FortiOS 8.0.0',
  status: 'Coming Soon (the FortiOS 7.6 version remains bookable until Fortinet retires it)',
  minutes: 100,
  questionsApprox: '50-60',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$210 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 30,
    weightRange: '25-35%',
    title: 'Deployment and system configuration',
    short: 'Deployment & system',
    topics: [
      { id: '1.1', verb: 'Perform', title: 'initial configuration', sub: ['FortiGate factory default settings', 'FortiGuard licenses', 'FortiGate administrative access', 'FortiGate as a DHCP server', 'System configuration file backup and restore', 'FortiGate firmware upgrades', 'FortiAI and Gen AI on CLI integration', 'Use cases'] },
      { id: '1.2', verb: 'Configure', title: 'log settings and diagnose problems using the logs', sub: ['Log workflow', 'Log storage options', 'Device registration on FortiAnalyzer', 'Log message viewing and searching', 'Session helper statistics visibility', 'Improved telemetry / visibility hooks', 'Use cases: registering a device on FortiAnalyzer', 'Use cases: view logs on FortiAnalyzer'] },
      { id: '1.3', verb: 'Configure', title: 'FortiGate Clustering Protocol (FGCP) high-availability (HA) cluster', keepCase: true, sub: ['FortiGate HA', 'HA setting modifications', 'Session synchronization for seamless failover', 'HA management interface', 'Typical operation of an HA cluster', 'HA cluster firmware upgrade', 'Use cases'] },
      { id: '1.4', verb: 'Diagnose', title: 'resource and connectivity issues', sub: ['Abnormal behavior monitoring', 'Physical and network layer issues', 'Connectivity issues—sniffer and debug flow', 'Resource problems—high CPU and memory usage', 'Memory conserve mode', 'Use cases—troubleshooting resource and connectivity issues'] },
      { id: '1.5', verb: 'Describe', title: 'FortiGate VM and FortiGate in AWS and Azure cloud', keepCase: true, sub: ['Threats and challenges in the public cloud', 'Fortinet public cloud solutions', 'FortiGate VMs in the cloud', 'Automation-ready configurations', 'Telemetry address'] },
      { id: '1.6', verb: 'Explain', title: 'FortiSASE administration and user onboarding methods', keepCase: true, sub: ['Challenges with remote work', 'Secure access service edge (SASE) architecture', 'FortiSASE components', 'Security features', 'ZTNA integration improvements', 'Identity and tagging enhancements', 'DLP for GenAI chatbots', 'FortiData labels', 'OCR on DLP', 'Identity/tag-based enhancements tied to ZTNA', 'Use cases—FortiSASE'] },
    ],
  },
  {
    id: 2,
    weight: 22.5,
    weightRange: '20-25%',
    title: 'Firewall policies and authentication',
    short: 'Policies & auth',
    topics: [
      { id: '2.1', verb: 'Configure', title: 'firewall policies', sub: ['Firewall policies', 'Inspection modes for firewall policies', 'Firewall policy traffic logs', 'Tagging support for addresses and policies', 'Dynamic tagging enhancements', 'Policy organization improvements (color/tag-based)', 'Use cases'] },
      { id: '2.2', verb: 'Configure', title: 'source NAT (SNAT) and destination NAT (DNAT) options in firewall policies', sub: ['SNAT configuration', 'Firewall policy to perform DNAT using virtual IP (VIP) addresses', 'Use cases', 'DNAT settings using a VIP'] },
      { id: '2.3', verb: 'Configure', title: 'different methods of firewall authentication', sub: ['Remote LDAP authentication server on FortiGate', 'Remote RADIUS authentication server on FortiGate', 'Active and passive authentication', 'Firewall user monitoring on the FortiGate GUI', 'Use cases'] },
      { id: '2.4', verb: 'Explain', title: 'how to deploy and configure Fortinet Single Sign-On (FSSO)', sub: ['FSSO in domain controller (DC) agent mode', 'Collector agent', 'FSSO login issues', 'Position FSSO vs ZTNA identity', 'FortiIdentity Cloud (FIC) and SSO', 'Use cases—FortiGate FSSO authentication'] },
    ],
  },
  {
    id: 3,
    weight: 27.5,
    weightRange: '25-30%',
    title: 'Content inspection',
    short: 'Content inspection',
    topics: [
      { id: '3.1', verb: 'Explain and inspect', title: 'encrypted traffic using certificates', sub: ['Full SSL/SSH inspection for outbound traffic', 'Private certificate authority (CA) certificates on endpoints', 'Certificate issues', 'TLS 1.3 VPN key negotiation', 'Use cases'] },
      { id: '3.2', verb: 'Identify', title: 'FortiGate inspection modes and configure web filtering', keepCase: true, sub: ['Inspection mode (flow or proxy) based on security needs', 'Certificate inspection for web filtering', 'Web filter profiles in flow-based and proxy-based inspection modes', 'FortiGuard categories', 'URL filters', 'Web filtering issues', 'DLP blocking GenAI chatbots', 'Use cases'] },
      { id: '3.3', verb: 'Configure', title: 'application control to monitor and control network applications', sub: ['Application control in profile mode', 'Application control event monitoring', 'Traffic matching with application control profile issues', 'Use cases—application traffic controlling'] },
      { id: '3.4', verb: 'Configure', title: 'antivirus scanning modes to neutralize malware threats', sub: ['Antivirus profiles in flow-based and proxy-based inspection modes', 'Protocol options', 'Antivirus events—log and monitor', 'Common antivirus issues', 'DLP blocking GenAI chatbots', 'Use cases'] },
      { id: '3.5', verb: 'Configure', title: 'an intrusion prevention system (IPS) to protect a network from threats and vulnerabilities', sub: ['IPS sensors', 'IPS high-CPU usage issues', 'DLP and GenAI awareness', 'AI/ML for DNS tunneling detection', 'FortiGuard Extended SaaS DB', 'Use cases—blocking known exploits'] },
    ],
  },
  {
    id: 4,
    weight: 12.5,
    weightRange: '10-15%',
    title: 'Routing',
    short: 'Routing',
    topics: [
      { id: '4.1', verb: 'Configure and route', title: 'packets using static routes', sub: ['Static routing', 'Routing table on FortiGate', 'Route redundancy and load balancing', 'Use cases'] },
      { id: '4.2', verb: 'Configure', title: 'SD-WAN to load balance traffic between multiple WAN links effectively', keepCase: true, sub: ['SD-WAN concepts', 'Main use cases for SD-WAN', 'SD-WAN on FortiGate', 'Routing behavior in an SD-WAN context', 'SD-WAN behavior, link usage, and quality status', 'SD-WAN based on underlay bandwidth utilization', 'Use cases'] },
    ],
  },
  {
    id: 5,
    weight: 12.5,
    weightRange: '10-15%',
    title: 'VPNs',
    short: 'VPNs',
    topics: [
      { id: '5.1', verb: 'Implement', title: 'a meshed or partially redundant IPsec VPN', sub: ['IPsec VPN concepts', 'IPsec v2', 'IPsec VPN using the IPsec wizard', 'Redundant VPN between two FortiGate devices', 'IPsec VPNs and review logs', 'IPsec VPN issues', 'TLS 1.3-based VPN negotiation', 'Quantum safe for IPsec', 'Use cases'] },
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
