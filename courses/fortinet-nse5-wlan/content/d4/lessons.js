// Domain 4 — Wireless diagnostics and analytics. Lessons in recommended study order.
// Sources: FortiWiFi and FortiAP 7.6.0 Configuration Guide (Troubleshooting, Debug commands, Packet sniffer,
// Extended logging, FortiAP CLI configuration and diagnostics commands, FortiAP shell command, Enabling spectrum
// analysis, Features for high-density deployments), FortiOS 7.6.3 CLI Reference (diagnose / execute
// wireless-controller, wireless-controller timers / log, log eventfilter), FortiOS 7.6.0 Administration Guide.
export default [
  {
    id: '4.1-controller-diagnostics',
    topic: '4.1',
    title: 'Controller Diagnostics: get, diagnose and execute wireless-controller',
    minutes: 18,
    file: '4.1-controller-diagnostics.md',
    objectives: [
      'Choose between wlac control-plane (-c) and data-plane (-d) views',
      'Interpret wlac -c vap, -c darrp and -d sta output',
      'Collect spectrum analysis data from the CLI',
      'Use execute wireless-controller actions safely',
    ],
  },
  {
    id: '4.1-client-rf-fortiap-cli',
    topic: '4.1',
    title: 'Client RF Data and the FortiAP CLI',
    minutes: 18,
    file: '4.1-client-rf-fortiap-cli.md',
    objectives: [
      'Interpret RSSI, noise floor, SNR and data rates for a client',
      'Collect network information to analyse wireless performance',
      'Access the FortiAP CLI and manage variables with cfg',
      'Use cw_diag and other FortiAP commands to read live AP state',
    ],
  },
  {
    id: '4.2-ap-join-troubleshooting',
    topic: '4.2',
    title: 'Troubleshooting FortiAP Discovery and CAPWAP Joins',
    minutes: 17,
    file: '4.2-ap-join-troubleshooting.md',
    objectives: [
      'Walk the FortiAP join sequence and its prerequisites',
      'Use the sniffer to locate CAPWAP reachability problems',
      'Read a CAPWAP wtp_filter debug and find the failing stage',
      'Fix intermittent disconnects caused by NAT, fragmentation or the controller',
    ],
  },
  {
    id: '4.2-client-rf-troubleshooting',
    topic: '4.2',
    title: 'Troubleshooting Clients, RF and Throughput',
    minutes: 17,
    file: '4.2-client-rf-troubleshooting.md',
    objectives: [
      'Map client connection symptoms to likely causes',
      'Diagnose asymmetric power and co-channel or non-Wi-Fi interference',
      'Work through throughput problems',
      'Choose the right remediation setting for each problem',
    ],
  },
  {
    id: '4.3-logs-debugs',
    topic: '4.3',
    title: 'Wireless Event Logs, CAPWAP and Client Debugs',
    minutes: 19,
    file: '4.3-logs-debugs.md',
    objectives: [
      'Configure and read wireless event logs, including extended client logs',
      'Interpret CAPWAP debug messages and choose a capture method',
      'Read a sta_filter client debug through association, the 4-way handshake and DHCP',
      'Locate the failing phase from a log or debug timeline',
    ],
  },
];
