// Domain 2 — Deployment and provisioning (30–40%). Lessons in recommended study order.
// Facts checked 2026-10-30 against docs.fortinet.com FortiNAC-F 7.6: Administration Guide
// (Security Incidents, User/host profiles, Network access, Logical networks, Model configuration,
// Hosts, Portal policy, State Based Access Control Rules, Configuration Selectors, Security Fabric
// Connection), Configure Security Incidents, High Availability (FortiNAC-OS), N+1 Failover Group and
// Load Balancing, CLI Reference Manual (HA, N+1, Failover Health Check, VIP, interface), IoT
// Deployment Guide, Enforcement Groups, Security Fabric/SSO Integration (F 7.x PDF), FortiGate
// Endpoint Management Integration, and the F 7.6.0 / 7.6.3 / 7.6.7 "What's new" pages.
export default [
  {
    id: '2.1-security-event-integration',
    topic: '2.1',
    title: 'Security Automation: Integrating Security Devices and Parsing Events',
    minutes: 20,
    file: '2.1-security-event-integration.md',
    objectives: [
      'Explain what the Security Incidents feature does and which licence it needs',
      'Model a security device (for example FortiAnalyzer) as a pingable device that sends security events',
      'Build a custom security event parser (CSV, TAG/VALUE or CEF) and map vendor severities',
      'Open port1 for syslog and prove that events arrive with execute tcpdump and the Events view',
    ],
  },
  {
    id: '2.1-security-rules-actions',
    topic: '2.1',
    title: 'Security Rules, Triggers, Actions and Alarms',
    minutes: 22,
    file: '2.1-security-rules-actions.md',
    objectives: [
      'Describe how triggers, security rules, user/host profiles and actions combine into a security alarm',
      'Set a trigger time limit and Filter Match (Any or All) correctly',
      'Order security rules by rank and use = / ≠ user/host profile matching',
      'Build actions from ranked activities with Activity Failure and secondary tasks',
      'Validate a rule with a catch-all trigger and email notifications',
    ],
  },
  {
    id: '2.2-access-control-enforcement',
    topic: '2.2',
    title: 'Access Control Concepts and Enforcement',
    minutes: 24,
    file: '2.2-access-control-enforcement.md',
    objectives: [
      'Relate host states (rogue, registered, at risk, disabled, unauthenticated) to isolation and production access',
      'Explain the enforcement groups and the 7.6.7 State Based Access Control Rules that replace them in the selector model',
      'Read a device model configuration: Access Enforcement Deny, Bypass or Enforce per host state',
      'Compare the enforcement methods: VLAN switching over SNMP/CLI, RADIUS attributes with CoA, CLI configurations and FortiGate firewall policies',
    ],
  },
  {
    id: '2.2-host-inventory-portals',
    topic: '2.2',
    title: 'Host Inventory Management and Portal Pages',
    minutes: 20,
    file: '2.2-host-inventory-portals.md',
    objectives: [
      'Navigate the Hosts and Adapters views and their hierarchy of users, hosts and adapters',
      'Register a rogue as a device and choose Host View, Topology or both',
      'Enable and disable hosts, including hosts disabled by a security alarm',
      'Use Policy Details and the policy simulator to see which policy a host matches',
      'Select the portal a host sees with portal policies, the default portal and the portal selector',
    ],
  },
  {
    id: '2.2-logical-networks',
    topic: '2.2',
    title: 'Logical Networks and Device Access Values',
    minutes: 18,
    file: '2.2-logical-networks.md',
    objectives: [
      'Explain why logical networks separate policy from per-device VLAN IDs and firewall tags',
      'Assign access values and CLI configurations per logical network in a model configuration',
      'Use network device roles for devices managed in Inventory',
      'Recognise the 7.6.7 selector-based Logical VLAN Mapping Configuration',
    ],
  },
  {
    id: '2.3-ha-1plus1',
    topic: '2.3',
    title: 'High Availability 1+1: Primary/Secondary Hot Standby',
    minutes: 26,
    file: '2.3-ha-1plus1.md',
    objectives: [
      'Describe the 1+1 active/passive design, the management process and the Idle state',
      'List the required services and the conditions that trigger a failover',
      'Trace the secondary\'s ping, retry and gateway logic and the 7.6.3 FortiNAC-M check',
      'Configure a pair: SSH keys, nac-ipc, allowed serial numbers, L2 with or without VIP, L3',
      'Validate replication, test failover and resume control manually',
      'Place the 7.6.3 failover-time change and the 7.6.7 five-layer health check ("True Hot Standby")',
    ],
  },
  {
    id: '2.3-ha-nplus1',
    topic: '2.3',
    title: 'N+1 Failover Groups and Load Balancing',
    minutes: 22,
    file: '2.3-ha-nplus1.md',
    objectives: [
      'Explain an N+1 failover group managed from FortiNAC-M CA Management (new in 7.6)',
      'Describe the secondary CA\'s direct and indirect health checks and the Standby → Promoted change',
      'Choose between FortiADC load balancing and backup IP (independent or shared)',
      'Configure the group in the right order and resume control after a failover',
      'Use custom health checks and the RunClient FailoverConsole commands',
    ],
  },
  {
    id: '2.4-profiles-access-policies',
    topic: '2.4',
    title: 'User/Host Profiles and Network Access Policies',
    minutes: 24,
    file: '2.4-profiles-access-policies.md',
    objectives: [
      'Build user/host profiles from Where, Who/What by group, Who/What by attribute and When',
      'Predict which identity a profile evaluates (logged-on user, registered user, registered host)',
      'Order network access policies top down and place the catch-all last',
      'Design policies for card readers and IP cameras, and for contractors',
    ],
  },
  {
    id: '2.4-firewall-tags-fabric',
    topic: '2.4',
    title: 'Firewall Tags, FortiGate Integration and the Security Fabric',
    minutes: 24,
    file: '2.4-firewall-tags-fabric.md',
    objectives: [
      'Compare Connector Based FSSO Tag (port 8000) with Dynamic Address Tag (Security Fabric, port 8013)',
      'Send user/host groups and firewall tags to FortiGate from network access configurations or from the FortiGate model configuration',
      'Map a logical network to a firewall tag on a FortiGate VDOM',
      'Join FortiNAC-F to the Security Fabric and use the Quarantine via FortiNAC automation action',
    ],
  },
];
