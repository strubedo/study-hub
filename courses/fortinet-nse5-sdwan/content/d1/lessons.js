// Domain 1 — SD-WAN architecture and concept. Original content for FortiOS 7.6 / FortiManager 7.6.
export default [
  {
    id: '1.1-sdwan-architecture-design',
    topic: '1.1',
    title: 'SD-WAN Concepts, Architecture and DIA Design',
    minutes: 20,
    file: '1.1-sdwan-architecture-design.md',
    objectives: [
      'Explain what SD-WAN adds to FortiOS routing and define underlay and overlay',
      'Name the three architecture layers and the SD-WAN building blocks on a FortiGate',
      'Match common SD-WAN use cases to designs, and tell DIA and RIA topologies apart',
      'Apply the five-pillar design approach and SD-WAN best practices',
    ],
  },
  {
    id: '1.1-basic-dia-setup-monitoring',
    topic: '1.1',
    title: 'Basic DIA Setup, the Setup Wizard, Widgets and Logs',
    minutes: 25,
    file: '1.1-basic-dia-setup-monitoring.md',
    objectives: [
      'Build a working dual-ISP DIA configuration in the right order (members, zone, route, policy, SLA)',
      'Describe what the SD-WAN Setup wizard configures, its licence requirement and its limits',
      'Check traffic distribution and member health in the GUI and CLI',
      'Use the SD-WAN dashboard widgets, traffic-log fields and SD-WAN event log IDs',
    ],
  },
  {
    id: '1.2-members-zones',
    topic: '1.2',
    title: 'SD-WAN Members and Zones',
    minutes: 25,
    file: '1.2-members-zones.md',
    objectives: [
      'Configure underlay and overlay interfaces as SD-WAN members with the right attributes',
      'Explain member defaults: zone, cost, priority, weight, volume-ratio, source',
      'Use zones in firewall policies and static routes, and design single-member zones',
      'Predict implicit-rule traffic distribution from load-balance-mode and member settings',
    ],
  },
  {
    id: '1.3-performance-sla-health-checks',
    topic: '1.3',
    title: 'Performance SLAs: Health Checks, SLA Targets and Member State',
    minutes: 30,
    file: '1.3-performance-sla-health-checks.md',
    objectives: [
      'Configure health checks with the right probe mode, protocol, servers and participants',
      'Compare active, passive and prefer-passive monitoring',
      'Define SLA targets and read the sla_map bitmask',
      'Distinguish alive/dead from in/out of SLA and calculate failover timing',
      'Explain the member state change actions: update static route and cascade interfaces',
    ],
  },
  {
    id: '1.3-advanced-sla-embedded-probes',
    topic: '1.3',
    title: 'Advanced Performance SLA Settings and Embedded SLA in ICMP Probes',
    minutes: 20,
    file: '1.3-advanced-sla-embedded-probes.md',
    objectives: [
      'Use advanced health-check settings: probe-count, probe-timeout, DSCP, class-id, MOS and log periods',
      'Explain how probes leave through the tested member and why source addresses matter on overlays',
      'Describe how spokes embed SLA information in ICMP probes and how the hub uses it',
      'Choose advanced SLA settings for typical use cases',
    ],
  },
];
