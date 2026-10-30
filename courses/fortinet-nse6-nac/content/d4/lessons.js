// Domain 4 — Network visibility and monitoring. Lessons in recommended study order.
// Verified against the FortiNAC-F 7.6 Administration Guide, CLI Reference Manual, Backup and Restore
// (FortiNAC-OS), FortiAnalyzer Device Integration and MAC Notification Traps guides on docs.fortinet.com (2026-10-30).
export default [
  {
    id: '4.1-guest-manager-setup',
    topic: '4.1',
    title: 'Guest Manager: Visitor Types, Templates and Sponsors',
    minutes: 20,
    file: '4.1-guest-manager-setup.md',
    objectives: [
      'Distinguish the Guest, Contractor, Conference and Self-Registered Guest visitor types',
      'Configure guest/contractor templates: role, Security & Access Value, authentication, duration and login availability',
      'Explain how account duration and end date combine, and how guest users and hosts expire',
      'Build guest manager, kiosk and self-registration sponsor profiles and scope them with the Manage Guests tab',
      'Recognise the F 7.6.7 Re-registration Period change',
    ],
  },
  {
    id: '4.1-guest-contractor-workflows',
    topic: '4.1',
    title: 'Guest and Contractor Accounts in Practice',
    minutes: 20,
    file: '4.1-guest-contractor-workflows.md',
    objectives: [
      'Create single, bulk, conference, self-registered and kiosk accounts',
      'Trace the self-registration request and approval flow',
      'Place guests and contractors with user/host profiles based on role or Security & Access Value',
      'Use guest events, the Guest Registrations report and CLI to audit guest accounts',
      'Troubleshoot common guest access problems',
    ],
  },
  {
    id: '4.2-device-profiler-rules',
    topic: '4.2',
    title: 'Device Profiler: Rogues, Classified Devices and Rules',
    minutes: 25,
    file: '4.2-device-profiler-rules.md',
    objectives: [
      'Differentiate rogues, classified (profiled) devices and registered hosts',
      'Describe how device profiler evaluates rogues against ranked rules',
      'Configure rule registration, placement, access availability and rule confirmation',
      'Choose and order identification methods, including those that need firewall session polling',
      'Re-evaluate rogues from the GUI and CLI and read device profiler events',
    ],
  },
  {
    id: '4.2-fingerprints-registration-recovery',
    topic: '4.2',
    title: 'Fingerprints, Host Registration, CSV Import and Recovery',
    minutes: 25,
    file: '4.2-fingerprints-registration-recovery.md',
    objectives: [
      'Read the Endpoint Fingerprints view and its sources',
      'Compare automated registration by rule with manual registration options',
      'Import host, device and user records from CSV files and with DeviceImport',
      'Identify what database, system and archive backups contain',
      'Schedule, copy off-box and restore backups from the GUI and CLI',
    ],
  },
  {
    id: '4.3-visibility-views-aging',
    topic: '4.3',
    title: 'Database, Visibility Views, FortiGate Sessions and Aging',
    minutes: 22,
    file: '4.3-visibility-views-aging.md',
    objectives: [
      'Describe what the FortiNAC-F database stores and how users, hosts and adapters relate',
      'Search and filter the Hosts and Adapters views, including wildcards',
      'Generate and schedule standard and custom reports',
      'Enable firewall session polling and use the Network Sessions view',
      'Configure global, group and per-record user/host aging and predict its effects',
    ],
  },
  {
    id: '4.3-troubleshooting-logging',
    topic: '4.3',
    title: 'Troubleshooting Hosts and Logging Options',
    minutes: 25,
    file: '4.3-troubleshooting-logging.md',
    objectives: [
      'Determine whether a host is in the database, a rogue or classified, from the GUI and CLI',
      'Troubleshoot a host connectivity issue with verified FortiNAC-F CLI commands',
      'Explain events, event management, alarms, network events, audit and authentication logs',
      'Use output.master with plugin and logger debug',
      'Forward events and alarms upstream to syslog, SNMP trap receivers and FortiAnalyzer',
    ],
  },
];
