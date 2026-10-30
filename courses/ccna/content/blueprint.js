// Official Cisco 200-301 CCNA v2.0 exam topics (published 2026-05-20, live 2027-02-03).
// Source: learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf

export const EXAM = {
  code: '200-301',
  version: 'v2.0',
  name: 'Implementing and Administering Cisco Solutions (CCNA)',
  minutes: 120,
  questionsApprox: '100-120',
  liveFrom: '2027-02-03',
  previousVersionLastDay: '2027-02-02',
  passingScoreNote: 'Cisco does not publish a passing score; ~825/1000 is a commonly cited community estimate.',
};

export const DOMAINS = [
  {
    id: 1,
    weight: 25,
    title: 'Network Infrastructure and Connectivity',
    short: 'Infrastructure',
    topics: [
      { id: '1.1', verb: 'Diagnose', title: 'Interface and cable (copper and fiber) issues such as collisions, errors, mismatched duplex, speed, distance, interface, signal levels, pin out, and cable types' },
      { id: '1.2', verb: 'Describe', title: 'The role and function of hypervisors, virtual machines, and containers' },
      { id: '1.3', verb: 'Troubleshoot', title: 'IPv4 address configuration, assignment, and subnetting (public and private)' },
      { id: '1.4', verb: 'Troubleshoot', title: 'IPv6 address configuration, assignment, and prefix sizing (unicast and modified EUI 64)' },
      { id: '1.5', verb: 'Describe', title: 'Wireless principles', sub: ['Band and channel selection', 'RF characteristics', 'Security protocols', 'Cause of interference'] },
      { id: '1.6', verb: 'Troubleshoot', title: 'Wired and wireless client connectivity (IP configuration, network reachability, and wireless security parameters on Windows, MacOS, and Linux)' },
      { id: '1.7', verb: 'Troubleshoot', title: 'DHCPv4 client, server, and relay on IOS devices' },
    ],
  },
  {
    id: 2,
    weight: 25,
    title: 'Switching and Network Access',
    short: 'Switching',
    topics: [
      { id: '2.1', verb: 'Configure', title: 'Network infrastructure connectivity (switch-to-switch and switch-to-router)', sub: ['Layer 2/Layer 3 physical interfaces', 'Layer 2 802.1Q trunk interfaces', 'Layer 2/Layer 3 LACP port-channel/EtherChannel', 'Switch virtual interface (SVI)'] },
      { id: '2.2', verb: 'Configure', title: 'Layer 2 switch port attributes for edge-host connectivity (VLAN, PoE, port channel, and LACP)', sub: ['Desktop, printer, and IOT appliances', 'Wireless access points (standalone and controller based)', 'Voice over IP phone', 'Virtualized hosts', 'Network appliances'] },
      { id: '2.3', verb: 'Validate', title: 'The accuracy of network documentation using CDP and LLDP' },
      { id: '2.4', verb: 'Troubleshoot', title: 'Basic Layer 2/Layer 3 connectivity and device operations using show commands (including show logs), ping, extended ping, traceroute, and packet capture output' },
      { id: '2.5', verb: 'Configure', title: 'Operations of the Rapid Per VLAN Spanning Tree Protocol (Rapid PVST+)', sub: ['Root port, root bridge (primary/secondary), and other port names', 'Port states and roles', 'PortFast', 'Root guard, loop guard, and BPDU guard'] },
    ],
  },
  {
    id: 3,
    weight: 20,
    title: 'IP Routing',
    short: 'Routing',
    topics: [
      { id: '3.1', verb: 'Interpret', title: 'A routing table to identify the next hop for a packet (routing protocol, prefix/mask, administrative distance, metric, and default route)' },
      { id: '3.2', verb: 'Troubleshoot', title: 'IPv4 and IPv6 static routing', sub: ['Default route', 'Network route', 'Host route', 'Floating static'] },
      { id: '3.3', verb: 'Configure', title: 'Single area OSPFv2 for IPv4 and OSPFv3 for IPv6', sub: ['Neighbor adjacencies (excluding authentication)', 'Point-to-point', 'Broadcast (DR/BDR selection)', 'Router ID'] },
      { id: '3.4', verb: 'Interpret', title: 'The operational status of First Hop Redundancy Protocols (HSRP and VRRP)' },
    ],
  },
  {
    id: 4,
    weight: 20,
    title: 'Network Services and Security',
    short: 'Services & Security',
    topics: [
      { id: '4.1', verb: 'Configure', title: 'Network devices with local usernames and as an AAA client (TACACS+ and RADIUS) for management' },
      { id: '4.2', verb: 'Manage', title: 'Device configuration and software files using secure file transfer operations with SFTP/SCP' },
      { id: '4.3', verb: 'Configure', title: 'NAT/PAT on IOS XE routers' },
      { id: '4.4', verb: 'Diagnose', title: 'Issues with DNS records (A, AAAA, CNAME, MX, NS, and PTR) to support host, web application, and mail server access by name' },
      { id: '4.5', verb: 'Describe', title: 'IPsec remote access and site-to-site VPNs (protocols and transport modes)' },
      { id: '4.6', verb: 'Configure', title: 'IPv4 access control lists (standard, extended, numbered, and named ACLs)' },
      { id: '4.7', verb: 'Configure', title: 'Layer 2 security features', sub: ['DHCP snooping', 'Dynamic ARP inspection', 'Storm control', 'RA guard', 'Port security'] },
    ],
  },
  {
    id: 5,
    weight: 10,
    title: 'AI, and Network Operations and Management',
    short: 'AI & Operations',
    topics: [
      { id: '5.1', verb: 'Describe', title: 'The role of agentic AI in network operations' },
      { id: '5.2', verb: 'Select', title: 'A prompt to send to a generative AI system to support network operations considering prompt components such as data classification, output format, persona, and instructions' },
      { id: '5.3', verb: 'Describe', title: 'Network management approaches (device-based, cloud-based, controller-based, automation-based, and infrastructure as code)' },
      { id: '5.4', verb: 'Describe', title: 'The function of SNMP in network operations' },
      { id: '5.5', verb: 'Use', title: 'Configuration management mechanisms such as Ansible to execute commands' },
      { id: '5.6', verb: 'Interpret', title: 'Syslog message content, severity levels, and facilities' },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

/** "Diagnose interface and cable…": verb + title, lower-casing the first word unless it is an acronym (IPv4, DHCPv4). */
export function topicLabel(t) {
  const keepCase = /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id) ?? null;
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === Number(id)) ?? null;
}
