// Cheat-sheet tables for the Reference page. Cells are inline markdown. FortiNAC-F 7.6.
// Verified 2026-10-29 on docs.fortinet.com (FortiNAC-F 7.6): Configuration Wizard (Step 2 Select Network
// Type, Layer 3 Network, Accessing the GUI for the first time), POC Getting Started Guide (network and
// access requirements), Administration Guide (Security Incidents > Rules / Triggers / Actions, User/host
// profiles, Logical networks), High Availability (FortiNAC-OS) overview, N+1 Failover Group and Load
// Balancing ("What is N+1 High Availability"), CLI Reference Manual (get / execute / diagnose / HA),
// FortiNAC-F 7.6.7 release notes (What's new).
export default [
  {
    id: 'isolation', title: 'Config Wizard network types and isolation scopes', topic: '1.2',
    columns: ['Item', 'Detail'],
    rows: [
      ['Interfaces', '**port1** = management (GUI `https://<port1 IP>:8443/`); **port2** = FortiNAC service interface for isolation (DHCP, DNS, captive portal)'],
      ['Network type: None', 'No isolation networks; captive portal service is disabled'],
      ['Network type: Layer 3', 'port2 sits on one VLAN on an untagged port; traffic for each isolation subnet is routed to it; at least one DHCP scope'],
      ['Network type: Layer 2', 'Isolation VLANs are switched to port2 with 802.1Q tags; port2 has an address in each isolation network'],
      ['Registration', 'Unregistered (unknown) hosts, kept off production while they register'],
      ['Remediation', 'Hosts that failed an endpoint compliance (policy) scan'],
      ['Dead End', 'Disabled hosts: limited or no connectivity'],
      ['Authentication', 'Registered hosts while the user authenticates'],
      ['VPN', 'Clients connecting through VPN services'],
      ['Isolation', 'One scope for all isolated clients; the host\'s state decides which page it sees'],
    ],
    note: 'Layer 3 DHCP scope labels must not start with the reserved prefixes `REG_`, `REM_`, `AUTH_`, `DE_`, `ISOL_` or `VPN_` (the Configure scopes page also lists `HUB_`). First login to a new appliance is `root` / `YAMS`, and the CLI admin account is separate from the GUI accounts.',
  },
  {
    id: 'security-rules', title: 'Security automation chain', topic: '2.1',
    columns: ['Object', 'Role'],
    rows: [
      ['Security event', 'An alert from an integrated security device, normalized into a common format (custom security event parsers handle new syslog formats)'],
      ['Trigger', 'One or more filters on events, a **Time Limit** to satisfy them, and **Filter Match** Any (minimum count) or All'],
      ['Security rule', 'Trigger + optional user/host profile (= must match, ≠ must not match) + action. Rules are checked **by rank**; the first one that matches creates the security alarm'],
      ['Action', 'Ordered activities run automatically or manually; **Activity Failure** = continue or stop the remaining activities; **Secondary Task Delay** runs a follow-up (e.g. re-enable the host later)'],
      ['Notification', 'Per rule: **Rule Match Email Group** (alarm created) and **Action Taken Email Group** (action taken)'],
    ],
    note: 'Security Incidents (automated threat response) needs its licence; without it the views are not available. If no rule matches, no alarm is created.',
  },
  {
    id: 'access-policy', title: 'Network access policy building blocks', topic: '2.4',
    columns: ['Piece', 'What it does'],
    rows: [
      ['User/host profile', 'Where (location), Who/What by group, Who/What by attribute, When. Reused by network access, endpoint compliance, authentication, supplicant EasyConnect and portal policies, and security rules'],
      ['Which identity is matched', 'Logged-on user and host, then registered user and host, then registered host'],
      ['Network access policy', 'User/host profile + network access configuration. Checked top down; the **first** policy whose profile matches is used'],
      ['Network access configuration', 'What to apply: a VLAN, a CLI configuration or a VPN group (or a logical network)'],
      ['Logical network', 'A device-independent name whose access value is translated to each modeled device\'s physical value (VLAN ID, firewall tag …)'],
      ['Catch-all profile', 'Where Any, Who/What Any, When Always: matches everything, so every policy below it is ignored. Put it last'],
    ],
    note: 'Don\'t match on adapter status (Online/Offline) in network access policies: at RADIUS post-auth time the adapter is always offline. FortiNAC-F 7.6.7 adds a selector-based model and State Based Access Control Rules (Network > Configuration); check which workflow a question assumes.',
  },
  {
    id: 'ha', title: 'High availability: 1+1 vs N+1', topic: '2.3',
    columns: ['Item', '1+1 (primary / secondary)', 'N+1 failover group'],
    rows: [
      ['Layout', 'Active/passive pair: one secondary for each primary', 'One secondary CA for one or more primary CAs; groups managed by FortiNAC-M (new in 7.6)'],
      ['Health checking', 'Secondary pings the primary every 30 s; the primary also runs internal and system health checks', 'The secondary CA (not FortiNAC-M) checks each primary directly, then indirectly through another primary'],
      ['Fails over when', 'A required service can\'t be restarted, or the secondary loses contact with the primary', 'Both the direct and the indirect check fail'],
      ['Timing', 'Detection plus failover about 10–15 min before F 7.6.3, about 1–5 min from F 7.6.3', 'About 5 min; the secondary changes from Standby to **Promoted** on FortiNAC-M'],
      ['CLI', '`config system ha` · `get system ha status` · `execute ha failover`', '`get system ha status`; N+1 settings under the CLI Reference "N+1 High Availability Configurations"'],
    ],
    note: 'The exam topics contrast "hot standby mode" with "N+1". The docs describe 1+1 active/passive and N+1, and 7.6.7 adds a five-layer failover health check ("True Hot Standby") for both. Confirm the course\'s use of "hot standby" before relying on it.',
  },
  {
    id: 'cli', title: 'FortiNAC-F CLI for troubleshooting', topic: '4.3',
    columns: ['Command', 'Use'],
    rows: [
      ['`get system status`', 'Version, serial number, licence status and expiry, hostname, system time'],
      ['`get system ha status`', 'High availability status'],
      ['`diagnose host list mac=<mac>`', 'Is the host in the database, and what does FortiNAC hold for it'],
      ['`diagnose tail -F output.master`', 'Follow the main FortiNAC log in real time'],
      ['`diagnose debug plugin list` · `enable <name>`', 'List plugins and turn on plugin debug before tailing the log'],
      ['`diagnose debug logger list` · `set <level> <name>`', 'List loggers and set their log level'],
      ['`diagnose network device test-snmp ip=<ip>`', 'Test SNMP to a modeled infrastructure device'],
      ['`diagnose network mac-notification-stats all`', 'MAC notification trap statistics'],
      ['`diagnose host device-profiling rules scan mac <mac>`', 'Run the device profiling rules against one MAC'],
      ['`execute tcpdump -i=<port>`', 'Packet capture on an appliance interface'],
    ],
    note: 'The FortiNAC-F CLI is FortiOS-style: `config`, `get`, `show`, `diagnose` and `execute` from the base context. `execute enter-shell` opens a shell for direct appliance access.',
  },
];
