// Domain 4 — Routing. Original content for FortiOS 8.0.
export default [
  {
    id: '4.1-static-routing-table',
    topic: '4.1',
    title: 'Static Routes, the Routing Table and Route Lookup',
    minutes: 25,
    file: '4.1-static-routing-table.md',
    objectives: [
      'Apply FortiOS route selection: longest prefix, distance, priority, then ECMP',
      'Distinguish the routing table, the routing database and the kernel FIB, and read each output',
      'Configure static, blackhole and policy routes and explain where policy routes sit in the lookup order',
      'Predict reverse path forwarding (RPF) drops in feasible-path and strict modes',
    ],
  },
  {
    id: '4.1-route-redundancy-ecmp',
    topic: '4.1',
    title: 'Route Redundancy, Link Monitoring and ECMP',
    minutes: 20,
    file: '4.1-route-redundancy-ecmp.md',
    objectives: [
      'Choose between floating, priority-based and ECMP designs for two links',
      'Detect dead gateways with a link monitor that withdraws static routes',
      'Configure ECMP algorithms with v4-ecmp-mode and explain the SD-WAN equivalent',
      'Explain how route changes affect existing sessions with and without SNAT',
    ],
  },
  {
    id: '4.2-sdwan-members-sla',
    topic: '4.2',
    title: 'SD-WAN Concepts, Members, Zones and Performance SLAs',
    minutes: 25,
    file: '4.2-sdwan-members-sla.md',
    objectives: [
      'Describe SD-WAN components and its main use cases on FortiGate',
      'Configure SD-WAN members, zones, the zone static route and zone-based firewall policies',
      'Build performance SLAs with the right probe protocol, SLA targets and link-status timers',
      'Interpret dead/alive and in/out-of-SLA state with diagnose sys sdwan health-check and SD-WAN logs',
    ],
  },
  {
    id: '4.2-sdwan-rules-steering',
    topic: '4.2',
    title: 'SD-WAN Rules, Strategies and Bandwidth-Aware Steering',
    minutes: 30,
    file: '4.2-sdwan-rules-steering.md',
    objectives: [
      'Place SD-WAN rules correctly in the policy route and FIB lookup order',
      'Explain the FIB checks an SD-WAN rule needs and why rules get skipped',
      'Compare Manual, Best Quality, Lowest Cost (SLA) and load-balancing strategies',
      'Configure the implicit rule load-balancing modes',
      'Use the FortiOS 8.0 underlay bandwidth steering, duplication threshold and volume quota options',
    ],
  },
];
