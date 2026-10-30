// Domain 2 — Deployment and management. Lessons in recommended study order.
// Target: FortiOS 7.6 / FortiSwitchOS 7.6 (FortiLink Guide 7.6.1, FortiOS 7.6.1 CLI Reference).
export default [
  {
    id: '2.1-management-modes-fortilink',
    topic: '2.1',
    title: 'Management Modes, Zero-Touch and the FortiLink Interface',
    minutes: 22,
    file: '2.1-management-modes-fortilink.md',
    objectives: [
      'Compare FortiLink (managed), standalone and cloud management of FortiSwitch',
      'Describe zero-touch management defaults and the one-manager-at-a-time rule',
      'Enable the switch controller and build the FortiLink interface (aggregate, split interface, LLDP neighbor detection)',
      'Set the management VLAN, reserved network and VLAN interface templates before the first authorization',
    ],
  },
  {
    id: '2.1-authorization-firmware',
    topic: '2.1',
    title: 'Authorizing FortiSwitch Units, Optional Settings and Firmware',
    minutes: 24,
    file: '2.1-authorization-firmware.md',
    objectives: [
      'Authorize switches automatically, manually or by pre-authorization (including wildcard serials)',
      'Interpret get-conn-status statuses and flags and check configuration synchronization',
      'Control the FortiSwitch admin password, console login and deauthorization behaviour from the FortiGate',
      'Provision and upgrade FortiSwitchOS firmware (provision on authorization, stage, restart, federated upgrade)',
      'Describe zero-touch provisioning automation triggers',
    ],
  },
  {
    id: '2.2-deployment-topologies',
    topic: '2.2',
    title: 'FortiLink Deployment Topologies: HA, Hardware Switch, Layer 2, Layer 3 and VXLAN',
    minutes: 22,
    file: '2.2-deployment-topologies.md',
    objectives: [
      'List the supported single-FortiGate and HA-mode FortiGate topologies and their rules',
      'Explain when a hardware or software switch FortiLink interface is used and its limits',
      'Configure FortiLink over a point-to-point layer-2 network',
      'Deploy FortiLink over a layer-3 network and over VXLAN, including discovery and limitations',
    ],
  },
  {
    id: '2.2-mclag-topologies',
    topic: '2.2',
    title: 'MCLAG Peer Groups and Multi-Tier Topologies',
    minutes: 20,
    file: '2.2-mclag-topologies.md',
    objectives: [
      'State the MCLAG requirements (peers, ICL, STP, IGMP snooping)',
      'Transition from a FortiLink split interface to a FortiLink MCLAG in the right order',
      'Build multi-tier MCLAG with auto-ISL port groups and interconnect FortiLink fabrics',
      'Verify MCLAG state from the FortiGate and the FortiSwitch',
    ],
  },
  {
    id: '2.3-multi-tenancy-vdoms',
    topic: '2.3',
    title: 'Multi-Tenancy: Exported Ports, Virtual Port Pools and QinQ',
    minutes: 20,
    file: '2.3-multi-tenancy-vdoms.md',
    objectives: [
      'Dedicate FortiSwitch ports to a tenant VDOM with export-to',
      'Use virtual port pools and the request command to let tenants claim ports',
      'List the features supported and not supported on shared ports',
      'Configure VLAN stacking (QinQ) for per-customer VDOMs',
    ],
  },
];
