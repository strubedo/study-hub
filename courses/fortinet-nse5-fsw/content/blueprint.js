// Official Fortinet "NSE 5 - FortiSwitch 7.6 Administrator" exam topics.
// Source: training.fortinet.com/local/staticpage/view.php?page=fortiswitch_administrator_exam
// (status Available, checked 2026-10-29). Product version "FortiSwitchOS 7.6, FortiOS 7.6".
// Domain names and task titles are Fortinet's, verbatim (verb + title = the task as written).
// Fortinet publishes NO domain weights and NO sub-bullets for this exam:
//   - `weightRange` says so; `weight` is this site's estimate, proportional to each domain's task
//     count (6/3/3/3 of 15 tasks -> 40/20/20/20). It only steers the simulator's question mix.
//   - `sub` lists are this site's scope notes for writers, NOT Fortinet exam text. Each item is a
//     chapter or feature title from the FortiLink Guide 7.6.1 or the FortiSwitchOS 7.6.1
//     Administration Guide (the versions the exam page links, docs.fortinet.com, checked 2026-10-29)
//     or an objective of the FortiSwitch 7.6 Administrator course
//     (training.fortinet.com/local/staticpage/view.php?page=library_fortiswitch-administrator).

export const EXAM = {
  code: 'NSE 5',
  name: 'Fortinet NSE 5 - FortiSwitch 7.6 Administrator',
  certification: 'Counts toward Fortinet Certified NSE 5 Secure Networking',
  product: 'FortiSwitchOS 7.6 and FortiOS 7.6',
  minutes: 70,
  minutesRange: '70',
  questionsApprox: '35–40',
  languages: 'English and Japanese',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$210 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 40,
    weightRange: 'Not published (site estimate 40%)',
    title: 'FortiSwitch concepts',
    short: 'Concepts',
    topics: [
      { id: '1.1', verb: 'Configure', title: 'VLANs using FortiSwitch', keepCase: true, sub: ['Native VLAN, allowed and untagged VLAN lists', 'FortiLink VLAN interfaces (default, quarantine, RSPAN, voice, video, NAC onboarding)', 'VLAN interface templates and the switch-controller reserved network', 'Private VLANs and VLAN stacking (QinQ)', 'MAC/IP/protocol-based VLANs', 'VLAN pruning'] },
      { id: '1.2', verb: 'Use', title: 'QoS and LLDP-MED on FortiSwitch', keepCase: true, sub: ['QoS classification, marking (802.1p and DSCP maps) and queuing', 'Rate limiting and egress queue policies', 'Voice QoS policy', 'LLDP profiles and LLDP-MED network policies', 'Voice device detection'] },
      { id: '1.3', verb: 'Configure', title: 'the ports required for stack deployment', sub: ['Inter-switch links (ISL) and auto-ISL', 'FortiLink split interface', 'MCLAG peer groups and the ICL', 'MCLAG requirements', 'Disabling stacking'] },
      { id: '1.4', verb: 'Configure', title: 'switching and routing on FortiSwitch', sub: ['Ethernet switching and dynamic MAC address learning', 'Link aggregation groups (802.3ad trunks)', 'Switch virtual interfaces and routed VLAN interfaces', 'Static and dynamic routing on a standalone FortiSwitch', 'Inter-VLAN routing through the FortiGate in FortiLink mode', 'IGMP snooping'] },
      { id: '1.5', verb: 'Configure', title: 'STP to prevent network loops', sub: ['STP, RSTP and MSTP instances', 'Global STP settings and per-switch override', 'Edge ports, BPDU guard and root guard', 'Loop guard', 'Interoperation with Rapid PVST+'] },
      { id: '1.6', verb: 'Configure', title: 'switch ports, split port, and available transceivers', sub: ['Port speed, status and PoE', 'Flap guard', 'Split ports (phy-mode) and forward error correction', 'Transceivers and module (DMI) status', 'Restricting frame types on 802.1Q ports'] },
    ],
  },
  {
    id: 2,
    weight: 20,
    weightRange: 'Not published (site estimate 20%)',
    title: 'Deployment and management',
    short: 'Deployment',
    topics: [
      { id: '2.1', verb: 'Configure and provision', title: 'FortiSwitch', keepCase: true, sub: ['Management modes: FortiLink (managed), standalone and cloud', 'Zero-touch management and provisioning', 'Switch controller and the FortiLink interface', 'Discovering and authorizing FortiSwitch units', 'Firmware provisioning and upgrades', 'Admin password and other optional FortiLink settings'] },
      { id: '2.2', verb: 'Deploy', title: 'FortiSwitch supported deployment topologies', keepCase: true, sub: ['Single FortiGate managing a single switch or a stack', 'HA-mode FortiGate units (single switch, stack, two-tier)', 'FortiLink on hardware or software switch interfaces', 'FortiLink over a layer-2 point-to-point or layer-3 network', 'FortiSwitch units on VXLAN interfaces', 'MCLAG topologies'] },
      { id: '2.3', verb: 'Deploy and configure', title: 'FortiSwitch in a multi-tenancy environment', keepCase: true, sub: ['FortiSwitch ports dedicated to VDOMs', 'Sharing ports between VDOMs (export-to, virtual port pools)', 'VLAN stacking (QinQ)'] },
    ],
  },
  {
    id: 3,
    weight: 20,
    weightRange: 'Not published (site estimate 20%)',
    title: 'Layer 2 control and security',
    short: 'L2 security',
    topics: [
      { id: '3.1', verb: 'Use', title: 'port security options on FortiSwitch', sub: ['802.1X port-based and MAC-based authentication', 'MAC authentication bypass (MAB)', 'Dynamic VLAN assignment, guest and auth-fail VLANs', 'FortiSwitch security policies', 'Dynamic port policies and FortiLink NAC', 'MAC learning limits and sticky MAC'] },
      { id: '3.2', verb: 'Use', title: 'filtering and antispoofing techniques on FortiSwitch', sub: ['DHCP snooping, trusted ports and the DHCP server access list', 'Option-82 data', 'Dynamic ARP inspection (DAI)', 'IPv4 source guard', 'Storm control'] },
      { id: '3.3', verb: 'Use', title: 'ACLs, security profiles, and VLAN security mechanisms on FortiSwitch', keepCase: true, sub: ['ACL policies (ingress, egress, prelookup)', 'Blocking intra-VLAN traffic', 'Quarantines', 'FortiGate security inspection of FortiSwitch VLAN traffic', 'FortiLink secure fabric'] },
    ],
  },
  {
    id: 4,
    weight: 20,
    weightRange: 'Not published (site estimate 20%)',
    title: 'Monitoring and troubleshooting',
    short: 'Troubleshooting',
    topics: [
      { id: '4.1', verb: 'Use', title: 'packet capturing methods to monitor and troubleshoot traffic issues', sub: ['FortiSwitch port mirroring (SPAN, RSPAN, ERSPAN)', 'FortiOS one-arm sniffer', 'Packet-capture profiles on FortiSwitchOS', 'Sniffing on the FortiGate FortiLink and VLAN interfaces'] },
      { id: '4.2', verb: 'Troubleshoot', title: 'FortiLink issues', keepCase: true, sub: ['Connection status (get-conn-status states and flags)', 'Discovery, authorization and FortiLink neighbor detection', 'Configuration synchronization', 'Physical connection and ISL/MCLAG state', 'Firmware compatibility and upgrades'] },
      { id: '4.3', verb: 'Use', title: 'tools to view and extract network information from FortiSwitch', sub: ['Managed FortiSwitch, ports and clients displays', 'Diagnostics and Tools pane (cable test, LED blink)', 'diagnose switch-controller switch-info commands', 'FortiSwitchOS get switch / diagnose switch commands', 'SNMP, sFlow and flow tracking', 'Logs and port statistics'] },
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
