// Domain 2 — Wireless network security and access. Lessons in recommended study order.
export default [
  {
    id: '2.1-traffic-modes-ssids',
    topic: '2.1',
    title: 'SSID Traffic Modes: Tunnel, Local Bridge and Mesh',
    minutes: 22,
    file: '2.1-traffic-modes-ssids.md',
    objectives: [
      'Explain how an SSID becomes a FortiOS interface',
      'Compare tunnel, local bridge and mesh traffic modes',
      'Build a mesh backhaul and preconfigure leaf FortiAPs',
      'Deploy multiple SSIDs with schedules, limits and selective radio assignment',
    ],
  },
  {
    id: '2.1-policies-data-channel',
    topic: '2.1',
    title: 'Firewall Policies, Security Profiles and Data Channel Security',
    minutes: 18,
    file: '2.1-policies-data-channel.md',
    objectives: [
      'Write firewall policies and apply security profiles to SSID traffic',
      'Isolate clients with intra-SSID privacy',
      'Choose between clear-text, DTLS and IPsec CAPWAP data channels',
      'Meet the requirements for CAPWAP offloading',
    ],
  },
  {
    id: '2.2-personal-wpa3-mpsk',
    topic: '2.2',
    title: 'WPA2/WPA3 Personal, OWE, MPSK and PMF',
    minutes: 22,
    file: '2.2-personal-wpa3-mpsk.md',
    objectives: [
      'List the FortiOS SSID security modes and their defaults',
      'Configure WPA3-SAE, SAE transition, H2E and SAE-PK',
      'Configure OWE and OWE transition',
      'Build MPSK profiles with per-group VLANs',
      'Apply the correct PMF setting for each mode',
    ],
  },
  {
    id: '2.2-enterprise-portal-mac',
    topic: '2.2',
    title: 'Enterprise 802.1X, Captive Portal, Guest Access and MAC Filtering',
    minutes: 22,
    file: '2.2-enterprise-portal-mac.md',
    objectives: [
      'Configure WPA2 and WPA3 Enterprise SSIDs with RADIUS or FortiGate user groups',
      'Choose a captive portal type that matches the SSID traffic mode',
      'Provide guest access with Guest Management',
      'Filter clients by MAC address and use RADIUS MAC authentication',
    ],
  },
  {
    id: '2.3-vlans-nac',
    topic: '2.3',
    title: 'Wireless VLANs, Dynamic VLANs, VLAN Pools and Wireless NAC',
    minutes: 24,
    file: '2.3-vlans-nac.md',
    objectives: [
      'Apply static VLANs to tunnel and local bridge SSIDs',
      'Assign VLANs dynamically from RADIUS attributes and MPSK groups',
      'Use VLAN pooling for load balancing and VLAN assignment by FortiAP group',
      'Configure FortiOS integrated wireless NAC and verify it',
    ],
  },
];
