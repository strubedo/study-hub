// Official Fortinet "NSE 5 - Secure Wireless LAN 7.6 Administrator" exam topics.
// Source: training.fortinet.com/local/staticpage/view.php?page=secure_wireless_lan_administrator_exam
// (status Available, checked 2026-10-29). Product version "FortiGate 7.6, FortiAP 7.6, and
// FortiPresence 2.0". The four areas and twelve tasks below are Fortinet's list, verbatim.
// Fortinet publishes NO domain weights and NO sub-bullets for this exam. So:
// - `weight` is an equal 25 per domain (a site estimate, shown as "25% (est.)").
// - `sub` is a site study checklist, not Fortinet's: each item comes from the matching
//   Secure Wireless LAN 7.6 Administrator course agenda/objectives
//   (training.fortinet.com/local/staticpage/view.php?page=library_secure-wireless-lan-administrator,
//   product versions FortiOS 7.6, FortiAP 7.6, FortiAIOps 3.2) or from the exam description
//   (FortiEdge Cloud management, FortiAIOps), placed under the task it serves. RF basics in 1.1
//   come from the course prerequisite "Wireless Network Fundamentals" lesson.

export const EXAM = {
  code: 'NSE 5',
  name: 'Fortinet NSE 5 - Secure Wireless LAN 7.6 Administrator',
  certification: 'Counts toward Fortinet Certified NSE 5 Secure Networking',
  product: 'FortiGate 7.6, FortiAP 7.6 and FortiPresence 2.0',
  minutes: 70,
  questionsApprox: '30-40',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$210 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 25,
    weightRange: '25% (est.)',
    title: 'Wireless fundamentals and FortiAP management',
    short: 'Fundamentals & FortiAP',
    topics: [
      { id: '1.1', verb: 'Explain', title: 'wireless fundamentals and technology standards', sub: ['802.11 standards and Wi-Fi generations (Wi-Fi 4 to Wi-Fi 7)', 'RF bands, channels and channel width', 'DFS, regulatory domains and the country code', 'SSIDs, BSSIDs, beacons and the association process', 'Wireless security standards (WPA2, WPA3, 802.1X/EAP)'] },
      { id: '1.2', verb: 'Deploy', title: 'FortiAP devices using the FortiOS integrated wireless controller', keepCase: true, sub: ['Use the wireless controller (Managed FortiAP)', 'FortiAP discovery methods and authorization', 'CAPWAP control and data channels', 'Provision FortiAP on FortiEdge Cloud', 'FortiAP firmware management'] },
      { id: '1.3', verb: 'Use', title: 'custom access point profiles to configure FortiAP devices', sub: ['FortiAP profiles (wtp-profile) and per-AP overrides', 'Radio settings: mode, band, channels, channel width and transmit power', 'Distributed automatic radio resource provisioning (DARRP)', 'Assigning SSIDs to radios', 'FortiAP groups'] },
    ],
  },
  {
    id: 2,
    weight: 25,
    weightRange: '25% (est.)',
    title: 'Wireless network security and access',
    short: 'Security & access',
    topics: [
      { id: '2.1', verb: 'Describe', title: 'the implementation of a secure wireless LAN using FortiAP devices', sub: ['SSID traffic modes: tunnel, local bridge and mesh', 'Deploy multiple wireless SSIDs', 'Firewall policies and security profiles for SSID traffic', 'Data channel security (clear text, DTLS, IPsec)'] },
      { id: '2.2', verb: 'Configure', title: 'secure wireless access', sub: ['WPA2 and WPA3 personal modes (PSK, SAE, OWE, MPSK)', 'WPA2 and WPA3 Enterprise with 802.1X authentication (RADIUS or local user groups)', 'Deploy wireless security with WPA3', 'Captive portal and guest access', 'MAC filtering and protected management frames'] },
      { id: '2.3', verb: 'Deploy', title: 'VLANs and network access control (NAC) for wireless segmentation', sub: ['Deploy wireless networks with VLANs', 'Dynamic VLAN assignment by RADIUS', 'VLAN pooling and VLAN assignment by FortiAP group', 'FortiOS integrated wireless network access control (NAC)'] },
    ],
  },
  {
    id: 3,
    weight: 25,
    weightRange: '25% (est.)',
    title: 'Wireless monitoring and protection',
    short: 'Monitoring & protection',
    topics: [
      { id: '3.1', verb: 'Identify', title: 'wireless threats and malicious activities', sub: ['Stop hotspot hackers and rogue APs', 'Rogue AP scanning, on-wire detection and classification', 'Rogue AP suppression', 'Wireless intrusion detection (WIDS profiles)'] },
      { id: '3.2', verb: 'Monitor', title: 'access point health and performance', sub: ['Managed FortiAP, WiFi client and rogue AP monitors', 'Roaming (802.11r/k/v, OKC, L2 and L3 roaming)', 'Wireless client load balancing (frequency and AP handoff)', 'FortiAP RESTful API calls'] },
      { id: '3.3', verb: 'Explain', title: 'the integration of artificial intelligence for IT operations (AIOps) with FortiGate', sub: ['FortiAIOps solution overview', 'Configure the FortiAIOps solution (adding FortiGate controllers)', 'Wireless SLAs, insights and AI-ARRP'] },
    ],
  },
  {
    id: 4,
    weight: 25,
    weightRange: '25% (est.)',
    title: 'Wireless diagnostics and analytics',
    short: 'Diagnostics & analytics',
    topics: [
      { id: '4.1', verb: 'Interpret', title: 'information about clients and wireless components', sub: ['Network information collection and performance analysis', 'Client signal, SNR, channel and data-rate information', 'Controller CLI: get and diagnose wireless-controller', 'FortiAP CLI: cfg and cw_diag'] },
      { id: '4.2', verb: 'Troubleshoot', title: 'common wireless issues and apply remediation', sub: ['FortiAP discovery and CAPWAP join problems', 'Client connection and authentication failures', 'RF issues: signal strength, interference and throughput', 'Remediation steps'] },
      { id: '4.3', verb: 'Analyze', title: 'wireless logs and debugs', sub: ['Wireless event logs', 'CAPWAP debug (wtp_filter, cw_acd) and packet sniffer', 'Client debug (sta_filter): association, 4-way handshake, DHCP'] },
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
