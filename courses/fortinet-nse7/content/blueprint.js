// Official Fortinet "NSE 7 - Secure Networking 7.6 Architect" exam topics.
// Source: training.fortinet.com/local/staticpage/view.php?page=secure_networking_architect_exam
// (status Available, checked 2026-10-29). Product version FortiGate 7.6, FortiManager 7.6, FortiAnalyzer 7.6.
// Sub-bullets are Fortinet's list (light capitalisation/punctuation fixes only: "―" became "—", and a
// missing separator was added in 5.3 "…with IBGP; dual hub-and-spoke…"). Fortinet repeats most of the
// 5.2 bullets under 5.1; both copies are kept as published. Fortinet publishes weight ranges; `weight`
// is the midpoint.

export const EXAM = {
  code: 'NSE 7',
  name: 'Fortinet NSE 7 - Secure Networking 7.6 Architect',
  certification: 'Earns Fortinet Certified NSE 7 Secure Networking (with an active NSE 4 and NSE 5 SN or NSE 6 SN)',
  product: 'FortiGate 7.6, FortiManager 7.6, FortiAnalyzer 7.6',
  minutes: 75,
  questionsApprox: '40-50',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$420 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 25,
    weightRange: '20-30%',
    title: 'System configuration and SD-WAN setup',
    short: 'System & SD-WAN setup',
    topics: [
      { id: '1.1', verb: 'Implement', title: 'the Fortinet Security Fabric', keepCase: true, sub: ['Fabric Connectors versus external connectors', 'Automation Stitches', 'Use cases—SAML single sign-on (SSO) in the Security Fabric, automated quarantine with Security Fabric and indicator of compromise (IoC) detection', 'Use cases—integrating FortiNAC with dynamic firewall addressing, adding FortiNDR (formerly FortiAI) to the Security Fabric', 'Use cases—FortiGate automation for configuration backups, running CLI scripts for high CPU scenarios'] },
      { id: '1.2', verb: 'Configure', title: 'different operation modes for a high availability (HA) cluster', sub: ['FortiGate Clustering Protocol (FGCP)', 'Active-active load balancing', 'Extension of FGCP—virtual clustering', 'Virtual MAC addresses', 'Ethernet types and sync optimization', 'Use cases—VDOM partitioning (high traffic volume)', 'FortiGate Session Life Support Protocol (FGSP)', 'Sample FGSP standalone sync', 'Standalone sync—coverage and limits', 'Use cases—session synchronization encryption using IPsec tunnels, inspection with asymmetric traffic—layer 2, inspection with asymmetric traffic for cloud environments', 'Effective HA: FGCP, FGSP, VRRP insights'] },
      { id: '1.3', verb: 'Implement', title: 'enterprise networks using VLANs and VDOMs', sub: ['VLANs on FortiGate', 'Virtual LAN switch', 'VDOM types', 'Use cases—segmentation through VLANs, internet access through inter-VDOM routing'] },
      { id: '1.4', verb: 'Deploy', title: 'an enterprise SD-WAN setup', sub: ['SD-WAN fundamentals', 'SD-WAN basic components', 'Architecture components', 'Use case identification', 'SD-WAN direct internet access (DIA): DIA topologies, DIA best practices and recommended settings', 'Use cases—basic SD-WAN DIA setup', 'SD-WAN basic monitoring', 'SD-WAN traffic distribution and member health', 'SD-WAN widgets', 'SD-WAN traffic logs and events'] },
    ],
  },
  {
    id: 2,
    weight: 20,
    weightRange: '15-25%',
    title: 'Central management',
    short: 'Central management',
    topics: [
      { id: '2.1', verb: 'Implement', title: 'branch configuration deployments', sub: ['Zero-touch provisioning (ZTP) of SD-WAN branches', 'ZTP basics', 'Device deployment with ZTP', 'Device blueprints and using CSV files to import devices'] },
      { id: '2.2', verb: 'Use', title: 'SD-WAN Manager and overlay orchestration', keepCase: true, sub: ['FortiManager features for SD-WAN', 'SD-WAN management on FortiManager', 'Metadata variable configuration and use', 'SD-WAN core settings on FortiManager', 'Planning SD-WAN deployment with FortiManager', 'Key deployment elements', 'New SD-WAN deployments with a dedicated FortiManager', 'Converting a topology for SD-WAN with FortiManager', 'Templates and template groups', 'IPsec configuration with FortiManager', 'Describing IPsec templates available on FortiManager', 'Using IPsec templates to configure hub-and-spoke IPsec VPNs', 'Configuring IPsec interfaces as SD-WAN members', 'SD-WAN overlay template—FortiManager SD-WAN overlay template', 'Use cases'] },
    ],
  },
  {
    id: 3,
    weight: 10,
    weightRange: '5-15%',
    title: 'Security profiles',
    short: 'Security profiles',
    topics: [
      { id: '3.1', verb: 'Manage', title: 'SSL/SSH inspection profiles', sub: ['Multiple clients connecting to multiple servers versus protecting SSL servers', 'SSL strategies—certificate inspection versus full inspection', 'Server certificate server name indication (SNI) check feature', 'Dealing with false positive events', 'HTTP and HTTPS code injection', 'Use cases—certificate errors on FortiGate'] },
      { id: '3.2', verb: 'Use', title: 'a combination of web filtering, application control, intrusion prevention system (IPS), and Internet Service Database (ISDB) to secure the network', sub: ['Impact on firewall performance', 'Security profiles—device performance', 'Use cases: protecting server and client targets, false positive events, HTTP and HTTPS code injection, IPS sensors using CVE patterns'] },
    ],
  },
  {
    id: 4,
    weight: 30,
    weightRange: '25-35%',
    title: 'Rules and routing',
    short: 'Rules & routing',
    topics: [
      { id: '4.1', verb: 'Implement', title: 'OSPF to route enterprise traffic', sub: ['OSPF overview, access lists, prefix lists, route maps, protocol redistribution', 'OSPF over IPsec, OSPF equal-cost multi-path (ECMP)', 'Use cases'] },
      { id: '4.2', verb: 'Implement', title: 'BGP to route enterprise traffic', sub: ['BGP overview', 'Access lists, prefix lists, route maps, protocol redistribution', 'ECMP with BGP routes', 'Loopback interfaces as BGP sources', 'The neighbor-group command', 'Optimizing BGP for rapid convergence: BGP convergence, route reflectors, BFD parameter, the graceful-restart command', 'Use cases'] },
      { id: '4.3', verb: 'Design', title: 'SD-WAN rules', sub: ['User-defined SD-WAN rules', 'SD-WAN rule lookup process', 'SD-WAN for local-out traffic', 'Implicit SD-WAN rule', 'Monitoring SD-WAN rule status', 'SD-WAN rule strategies', 'SD-WAN rule traffic matching criteria', 'Application steering and application learning phases', 'Internet services as destination criteria', 'Preferred member election based on strategy', 'Advantage given to higher priority members'] },
      { id: '4.4', verb: 'Configure', title: 'SD-WAN routing', sub: ['Key routing principles in SD-WAN', 'Policy routes', 'Route lookup process', 'Member static routes', 'Static routes for zones', 'Member probe routes', 'Session tables', 'Different protocol states', 'Common session flags', 'Session reevaluation and triggers', 'Routing changes in SNAT sessions', 'Routing designing for SD-WAN', 'Routing considerations', 'Determining which type of routing and routing protocols to use'] },
    ],
  },
  {
    id: 5,
    weight: 30,
    weightRange: '25-35%',
    title: 'Advanced IPsec',
    short: 'Advanced IPsec',
    topics: [
      { id: '5.1', verb: 'Implement', title: 'IPsec VPN IKE version 2', sub: ['Mastering IPsec topology design', 'Best practices—Dead Peer Detection (DPD) modes', 'Impact of outbound network address translation (NAT) for IPsec interfaces with no IP addresses', 'OpenSSL for IPsec VPNs', 'IPsec aggregate for redundancy and traffic load balancing', 'Overlapping routes in remote VPNs', 'Maximum transmission unit (MTU) issues in IPsec tunnels', 'Network performance optimization: MTU, TCP maximum segment size (MSS), and IPsec fragmentation', 'IPsec networks with FortiManager IPsec templates', 'IPsec templates', 'IPsec templates autorouting', 'Metadata variables in IPsec templates', 'IPsec template single and dual hub-and-spoke topology', 'The VPN manager and IPsec templates', 'Hardware offload with IPsec encryption and decryption, forward error correction (FEC), the session NPU-Flag field', 'Dual-hub topologies', 'SD-WAN with dual-hub topologies', 'Dual-hub options in the SD-WAN overlay template', 'Configuration specifics for large topologies', 'BGP routing and self-healing', 'BGP advanced options for SD-WAN', 'Routing options for dual-hub topologies', 'SD-WAN self-healing', 'Multiregion topologies and large deployments', 'Use cases for SD-WAN multiregion topologies', 'Routing specifics for multiregion topologies', 'MSSP deployments with SD-WAN', 'VRF-aware overlays', 'Use cases'] },
      { id: '5.2', verb: 'Configure', title: 'IPsec multihub, multiregion, and large deployments', sub: ['Dual-hub topologies and use cases', 'Dual-hub options in the SD-WAN overlay template', 'Configuration specifics for large topologies', 'BGP routing and self-healing', 'BGP advanced options for SD-WAN', 'Routing options for dual-hub topologies', 'SD-WAN self-healing', 'Multiregion topologies and large deployments', 'Use cases—SD-WAN multiregion topologies', 'Routing specifics for multiregion topologies', 'Common MSSP deployments with SD-WAN', 'VRF-aware overlays'] },
      { id: '5.3', verb: 'Implement', title: 'ADVPN to enable on-demand VPN tunnels between sites', sub: ['ADVPN operation and requirements', 'ADVPN in a hub-and-spoke network', 'ADVPN shortcut negotiation', 'ADVPN on FortiManager', 'Fortinet auto-discovery VPN (ADVPN) using FortiGate or FortiManager', 'Hub-and-spoke topologies using ADVPN with IBGP; dual hub-and-spoke topologies using ADVPN with IBGP and EBGP', 'ADVPN using the FortiManager VPN manager', 'ADVPN using FortiManager IPsec templates', 'SD-WAN support for ADVPN', 'ADVPN 2.0 overlay placeholders', 'Designing a network with SD-WAN and ADVPN', 'Shortcut timeout, delay for shortcut failback, dependent shortcuts', 'Alternative overlay and routing designs for ADVPN', 'BGP on loopback design', 'ADVPN without BGP route reflection', 'Dynamic BGP', 'Use cases—ADVPN 1.0 challenges, ADVPN 2.0'] },
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
