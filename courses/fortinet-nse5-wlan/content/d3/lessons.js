// Domain 3 — Wireless monitoring and protection. Lessons in recommended study order.
// Sources: FortiWiFi and FortiAP 7.6.0 Configuration Guide, FortiOS 7.6.3 CLI Reference
// (wireless-controller wids-profile, vap, wtp-profile, ap-status, setting, timers, inter-controller, log),
// FortiOS 7.6.0 Administration Guide, FortiAIOps 3.2.0 User Guide.
export default [
  {
    id: '3.1-rogue-detection',
    topic: '3.1',
    title: 'Rogue AP Scanning, On-Wire Detection and Classification',
    minutes: 22,
    file: '3.1-rogue-detection.md',
    objectives: [
      'Distinguish neighbouring APs, rogue APs and evil-twin (hotspot hacker) APs',
      'Configure background scanning and dedicated monitor radios with a WIDS profile',
      'Explain exact MAC match and MAC adjacency on-wire detection and their limits',
      'Classify entries in the Rogue AP monitor and read wlac -c ap-rogue codes',
    ],
  },
  {
    id: '3.1-suppression-wids',
    topic: '3.1',
    title: 'Rogue Suppression, Phishing SSIDs and WIDS Profiles',
    minutes: 18,
    file: '3.1-suppression-wids.md',
    objectives: [
      'Explain how rogue AP suppression works and what it requires',
      'Detect and suppress fake and offending SSIDs',
      'Use PMF against spoofed deauthentication',
      'Enable WIDS detections and recognise each attack type',
    ],
  },
  {
    id: '3.2-monitoring',
    topic: '3.2',
    title: 'WiFi Monitors, Client Health and the FortiAP REST API',
    minutes: 16,
    file: '3.2-monitoring.md',
    objectives: [
      'Use the WiFi dashboard, Managed FortiAPs, Diagnostics and Tools and WiFi Clients monitors',
      'Interpret the client health assessment',
      'Monitor FortiAPs with SNMP, syslog profiles and temperature readings',
      'Call the FortiAP REST API endpoints',
    ],
  },
  {
    id: '3.2-roaming-load-balancing',
    topic: '3.2',
    title: 'Roaming and Wireless Client Load Balancing',
    minutes: 18,
    file: '3.2-roaming-load-balancing.md',
    objectives: [
      'Explain 802.11k, 802.11v, 802.11r and OKC and their FortiOS SSID settings',
      'Compare layer 2 and layer 3 roaming and configure inter-controller L3 roaming',
      'Configure frequency handoff and AP handoff',
      'Recognise documentation conflicts around handoff defaults',
    ],
  },
  {
    id: '3.3-fortiaiops',
    topic: '3.3',
    title: 'FortiAIOps: Setup, Wireless SLAs and AI-ARRP',
    minutes: 20,
    file: '3.3-fortiaiops.md',
    objectives: [
      'Describe what FortiAIOps adds to the FortiGate wireless controller',
      'Add a FortiGate controller and forward its logs to FortiAIOps',
      'Name the wireless SLAs and configure static or dynamic thresholds',
      'Enable AI-ARRP and explain the darrp / ai-darrp-support combinations',
    ],
  },
];
