// Official Fortinet "NSE 6 - FortiNAC-F 7.6 Administrator" exam topics.
// Source: training.fortinet.com/local/staticpage/view.php?page=fortinac_administrator_exam
// (status Available, checked 2026-10-29). Product version "FortiNAC-F 7.6, FortiOS 7.6".
// Sub-bullets are Fortinet's list. The published page drops letters in several bullets
// ("organiz", "ailover", "N+", "abric", "ecurity", "hird-party", "integrat", "managment",
// "evice", "Us the … generat", "etermin", "Explor"); they are restored here, and "N+" is
// written "N+1" as the FortiNAC-F 7.6 docs name it ("N+1 Failover Group and Load Balancing").
// Fortinet publishes weight ranges; `weight` is the midpoint.

export const EXAM = {
  code: 'NSE 6',
  name: 'Fortinet NSE 6 - FortiNAC-F 7.6 Administrator',
  certification: 'Counts toward Fortinet Certified NSE 6 Secure Networking',
  product: 'FortiNAC-F 7.6, FortiOS 7.6',
  minutes: 60,
  questionsApprox: '30-35',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$210 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 15,
    weightRange: '10-20%',
    title: 'Concepts and initial configuration',
    short: 'Concepts & setup',
    topics: [
      { id: '1.1', verb: 'Model and organize', title: 'infrastructure devices', sub: ['Key features of FortiNAC-F', 'FortiNAC-F architecture', 'Model and organize infrastructure devices', 'Information gathering and network visibility', 'Groups for the logical organization of elements', 'Use cases—network device discovery, group creation and population'] },
      { id: '1.2', verb: 'Explain', title: 'isolation networks and the configuration wizard', sub: ['Different device and deployment configurations', 'Device deployment configurations and captive networks', 'Administrative user creation and management', 'Initial device configuration settings', 'Use cases—initial configuration, administrative account creation and management'] },
    ],
  },
  {
    id: 2,
    weight: 35,
    weightRange: '30-40%',
    title: 'Deployment and provisioning',
    short: 'Deployment',
    topics: [
      { id: '2.1', verb: 'Configure', title: 'security automation', sub: ['Security automation', 'Security device integration', 'Security rules', 'Use cases—security rules for automated threat response, custom security event parser, security rule validation'] },
      { id: '2.2', verb: 'Configure', title: 'access control on FortiNAC-F', sub: ['Access control concepts', 'Enforcement', 'Modeled devices for enforcement', 'Portal pages', 'Host inventory management', 'Logical networks', 'Use cases'] },
      { id: '2.3', verb: 'Configure and monitor', title: 'high availability (HA)', sub: ['HA functions with FortiNAC-F—hot standby mode', 'HA—hot standby mode configuration', 'Failover—hot standby mode', 'HA functions with FortiNAC-F—N+1', 'HA—N+1', 'Failover—N+1', 'Use cases—N+1 load balancing, FortiNAC-F for HA', 'HA status and successful failover'] },
      { id: '2.4', verb: 'Configure', title: 'FortiNAC-F security policies', keepCase: true, sub: ['FortiNAC-F security policies', 'Use cases—user/host profiles and network access policies for card readers and cameras', 'Use cases—user/host profiles and network access policies for contractors', 'FortiNAC-F as a Fabric connector', 'Group and tag information is passed to FortiGate', 'Firewall tags', 'Use cases—firewall tags through network access configurations', 'Use cases—firewall tags through FortiGate model configurations', 'Use cases—logical networks and creating a firewall tag', 'FortiNAC-F integration into the Security Fabric'] },
    ],
  },
  {
    id: 3,
    weight: 20,
    weightRange: '15-25%',
    title: 'Integration',
    short: 'Integration',
    topics: [
      { id: '3.1', verb: 'Integrate with', title: 'third-party devices using syslog and SNMP trap input', sub: ['Third-party device using syslog and SNMP trap input', 'Administrative group for alarm notification', 'FortiNAC-F syslog messages for automated response', 'Use cases'] },
      { id: '3.2', verb: 'Configure and use', title: 'FortiNAC-F Manager', keepCase: true, sub: ['FortiNAC-F Manager integration in a distributed deployment', 'FortiNAC-F Manager in a distributed environment', 'Use cases—managing FortiNAC-F with FortiNAC-F Manager'] },
      { id: '3.3', verb: 'Configure', title: 'FortiGate VPN integration with FortiNAC-F', keepCase: true, sub: ['FortiNAC-F management for FortiGate VPN sessions', 'Use cases—FortiNAC-F configuration to manage FortiGate VPN sessions'] },
      { id: '3.4', verb: 'Explain and configure', title: 'MDM integration', sub: ['Vendor OUI tables', 'Device profiling rules', 'Use cases'] },
    ],
  },
  {
    id: 4,
    weight: 30,
    weightRange: '25-35%',
    title: 'Network visibility and monitoring',
    short: 'Visibility & monitoring',
    topics: [
      { id: '4.1', verb: 'Configure', title: 'guests and contractors', sub: ['Guest and contractor administration', 'Use cases'] },
      { id: '4.2', verb: 'Explain and configure', title: 'device profiling', sub: ['Classified devices and rogues', 'Device profiling rule concepts', 'Device profiling rule', 'Endpoint fingerprints', 'Automated host registration', 'Manual host registration', 'Host and device records from CSV files', 'Data preservation and system recovery'] },
      { id: '4.3', verb: 'Troubleshoot', title: 'network devices and device status', sub: ['Information stored in the database', 'Use the administrative visibility views and generate reports', 'Access enhanced visibility information using FortiGate sessions', 'Set user and host aging and management settings', 'Determine if a host is in the database', 'Determine if a host is a rogue', 'Determine if a host is classified', 'Understanding logging', 'Explore different logging options and views', 'Use cases—filters on the hosts page, troubleshooting a host connectivity issue, upstream logging for FortiNAC-F events'] },
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
