// Domain 1 — Concepts and initial configuration. Lessons in recommended study order.
// Facts checked 2026-10-30 against the FortiNAC-F 7.6 Administration Guide, Deployment Guide,
// Configuration Wizard, Network Device Modeling, Appliance Installation, Configuring Traps for
// MAC Notification, Concept Guide and CLI Reference Manual on docs.fortinet.com.
export default [
  {
    id: '1.1-architecture-features',
    topic: '1.1',
    title: 'FortiNAC-F Architecture, Key Features and Licensing',
    minutes: 20,
    file: '1.1-architecture-features.md',
    objectives: [
      'Describe what FortiNAC-F does: visibility, control and automated response',
      'Distinguish the CA and Manager appliances and the FortiNAC-OS platform from legacy CentOS FortiNAC',
      'State what port1 and port2 are used for and why they must not share a network',
      'Explain Base, Plus and Pro licensing, perpetual keys versus subscriptions, and how endpoints are counted',
      'Use get system status and get hardware status to read basic appliance facts',
    ],
  },
  {
    id: '1.1-modeling-discovery',
    topic: '1.1',
    title: 'Modeling Infrastructure Devices: Inventory, Containers and Discovery',
    minutes: 22,
    file: '1.1-modeling-discovery.md',
    objectives: [
      'List the SNMP, CLI and reachability requirements for modeling a switch FortiNAC-F will control',
      'Add a device manually, add a RADIUS-only device (F 7.6.7) and run Discovery with or without CDP',
      'Organize devices with containers and know their limits',
      'Set the per-device VLAN values in Model Configuration',
      'Validate ports and handle Threshold Uplinks and the System Defined Uplink Count',
    ],
  },
  {
    id: '1.1-visibility-groups',
    topic: '1.1',
    title: 'Information Gathering, Network Visibility and Groups',
    minutes: 20,
    file: '1.1-visibility-groups.md',
    objectives: [
      'Explain how L2 polling, L3 polling, link traps, MAC notification traps and RADIUS tell FortiNAC-F where hosts are',
      'Populate the L3 (IP-->MAC) group and tune L2/L3 polling intervals and priority',
      'Configure a switch for MAC notification traps the way Fortinet recommends',
      'Create, nest and use groups, and recognize the important system groups',
    ],
  },
  {
    id: '1.2-config-wizard-isolation',
    topic: '1.2',
    title: 'Config Wizard, Network Types and Isolation Networks',
    minutes: 25,
    file: '1.2-config-wizard-isolation.md',
    objectives: [
      'Choose between the None, Layer 2 and Layer 3 network types and know their infrastructure requirements',
      'Configure port2, isolation scopes, lease pools, isolation IP subnets and additional routes',
      'Match each isolation scope or VLAN to the host state it serves',
      'Avoid reserved scope-label prefixes, reserved host names and DNS mistakes',
      'Relate appliance deployment configurations (standalone, HA, distributed) to the wizard choices',
    ],
  },
  {
    id: '1.2-initial-setup-admins',
    topic: '1.2',
    title: 'Initial Appliance Setup and Administrative Accounts',
    minutes: 20,
    file: '1.2-initial-setup-admins.md',
    objectives: [
      'Stage a new hardware appliance from the CLI and reach the Admin UI on port 8443',
      'Use config system interface, allowaccess and config system admin correctly',
      'Separate CLI admin accounts from Admin UI administrators',
      'Create administrators, assign administrator profiles and restrict them with groups',
    ],
  },
];
