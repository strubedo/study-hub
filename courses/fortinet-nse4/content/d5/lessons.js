// Domain 5 — VPNs. Original content for FortiOS 8.0.
export default [
  {
    id: '5.1-ipsec-concepts',
    topic: '5.1',
    title: 'IPsec Concepts: IKE Phases, IKEv1 vs IKEv2, Route-Based VPNs',
    minutes: 25,
    file: '5.1-ipsec-concepts.md',
    objectives: [
      'Explain what IKE, ESP and SAs do and which ports and protocols they use, including NAT-T',
      'Describe what phase 1 and phase 2 negotiate and which mismatches break each one',
      'Compare IKEv1 main and aggressive mode with IKEv2, the FortiOS 8.0 default',
      'Choose route-based over policy-based VPNs and configure key phase 1 options such as DPD and NAT-T',
      'Handle the FortiOS 8.0 recommended-only IKE proposal visibility',
    ],
  },
  {
    id: '5.1-ipsec-wizard-site-dialup',
    topic: '5.1',
    title: 'The VPN Wizard, Site-to-Site and Dial-Up VPNs',
    minutes: 25,
    file: '5.1-ipsec-wizard-site-dialup.md',
    objectives: [
      'List every object the VPN wizard creates for a site-to-site tunnel',
      'Build a manual route-based site-to-site VPN including blackhole route and policies',
      'Configure dial-up VPNs for FortiGate and FortiClient clients using add-route and mode-cfg',
      'Explain the removal of SSL VPN tunnel mode and the Agentless VPN rename',
    ],
  },
  {
    id: '5.1-ipsec-redundant-meshed',
    topic: '5.1',
    title: 'Redundant and Meshed IPsec VPNs',
    minutes: 20,
    file: '5.1-ipsec-redundant-meshed.md',
    objectives: [
      'Compare full mesh, partial mesh and hub-and-spoke designs, and say where ADVPN fits',
      'Build a fully or partially redundant VPN between two FortiGates with distance, priority and DPD',
      'Explain why backup tunnel routes should usually differ by priority rather than distance (RPF)',
      'Use monitor, dynamic routing or SD-WAN overlays for tunnel failover',
    ],
  },
  {
    id: '5.1-ipsec-troubleshooting-80',
    topic: '5.1',
    title: 'IPsec Logs, Troubleshooting and FortiOS 8.0 VPN Features',
    minutes: 30,
    file: '5.1-ipsec-troubleshooting-80.md',
    objectives: [
      'Troubleshoot tunnels with get vpn ipsec tunnel summary, diagnose vpn ike gateway list, diagnose vpn tunnel list and IKE debug',
      'Recognise PSK, proposal and selector mismatches in debug output and VPN event logs',
      'Read VPN event log IDs and the 8.0.1 reason field',
      'Configure and verify TLS 1.3-based VPN negotiation over TCP',
      'Describe quantum-safe IPsec in FortiOS: RFC 9370 ML-KEM key exchange, ML-DSA/SLH-DSA signatures, PPK and QKD',
    ],
  },
];
