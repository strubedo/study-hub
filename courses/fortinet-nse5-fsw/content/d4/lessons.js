// Domain 4 — Monitoring and troubleshooting. Lessons in recommended study order.
// FortiOS 7.6 / FortiSwitchOS 7.6. Facts checked 2026-10-29/30 against docs.fortinet.com:
// FortiLink Guide 7.6.1 (port mirroring, one-arm sniffer, Configuring FortiLink, optional FortiLink
// configuration, firmware pages, MCLAG pages, FortiLink secure fabric, Diagnostics and tools, ports
// display, port statistics, clients, log settings, SNMP, sFlow, flow tracking, Internal Hubs, flap guard,
// replacing a managed switch, zero-touch management, defining names), FortiSwitchOS 7.6.1 Administration
// Guide (Packet capture, Mirror pages, Cable diagnostics, port statistics, LLDP, MCLAG, DMI module status,
// Log, Network monitoring, sFlow, LAGs), FortiOS 7.6.1 CLI Reference (diagnose / execute
// switch-controller) and the FortiOS 7.6 sample logs (FortiSwitch event logs).
export default [
  {
    id: '4.1-mirroring-one-arm-sniffer',
    topic: '4.1',
    title: 'Port Mirroring (SPAN, RSPAN, ERSPAN) and the FortiOS One-Arm Sniffer',
    minutes: 25,
    file: '4.1-mirroring-one-arm-sniffer.md',
    objectives: [
      'Configure port-based mirroring on a managed FortiSwitch from the FortiGate and know which fields are required',
      'Use the switch-controller traffic sniffer in RSPAN and ERSPAN mode and pick targets by MAC, IP or port',
      'Explain where RSPAN traffic lands (VLAN 4092, the rspan interface) and why the switch controller adds a sniffer policer',
      'Map the FortiSwitchOS standalone mirror modes (SPAN, RSPAN, ERSPAN-auto, ERSPAN-manual) to their settings',
      'Build a FortiOS one-arm sniffer (IDS) on mirrored switch traffic and read its sniffer logs',
    ],
  },
  {
    id: '4.1-packet-capture',
    topic: '4.1',
    title: 'Packet Capture: FortiSwitchOS Sniffer Profiles and FortiGate Sniffing',
    minutes: 20,
    file: '4.1-packet-capture.md',
    objectives: [
      'Create, start, pause, stop, display, upload and delete a FortiSwitchOS packet-capture profile',
      'Remember the packet-capture limits: profiles per platform, RAM disk, packet length, files lost on power cycle',
      'Sniff FortiLink and FortiLink VLAN interfaces on the FortiGate with the GUI packet capture and diagnose sniffer packet',
      'Choose the right capture point for a problem: switch CPU, FortiGate interface or a mirror session',
    ],
  },
  {
    id: '4.2-fortilink-status-discovery',
    topic: '4.2',
    title: 'FortiLink Connection Status, Discovery and Authorization',
    minutes: 25,
    file: '4.2-fortilink-status-discovery.md',
    objectives: [
      'Read execute switch-controller get-conn-status: columns, Authorized and Discovered states, flags and the summary line',
      'Work through a switch that never shows up, stays Discovered/Down or drops to Authorized/Down',
      'Explain FortiLink neighbor detection (LLDP by default from FortiOS 7.6.1) and its effect on the split interface',
      'Use FortiSwitch event logs, ping by serial number and the CAPUTP keepalive settings when FortiLink flaps',
    ],
  },
  {
    id: '4.2-sync-topology-firmware',
    topic: '4.2',
    title: 'Config Sync, ISL/MCLAG State and Firmware Troubleshooting',
    minutes: 30,
    file: '4.2-sync-topology-firmware.md',
    objectives: [
      'Check and force configuration synchronization with get-sync-status and trigger config-sync',
      'Verify the physical FortiLink topology, ISLs, the FortiLink secure fabric and MCLAG ICL state',
      'Upload, stage and push FortiSwitch firmware and read get-upgrade-status through a staged upgrade',
      'Use automatic firmware provisioning on authorization and know its limits',
      'Upgrade an MCLAG pair and replace a failed managed switch in the documented order',
    ],
  },
  {
    id: '4.3-gui-and-cli-tools',
    topic: '4.3',
    title: 'Viewing Switch, Port and Client Information',
    minutes: 25,
    file: '4.3-gui-and-cli-tools.md',
    objectives: [
      'Navigate the Managed FortiSwitch, FortiSwitch Ports and FortiSwitch Clients pages and the Diagnostics and Tools pane',
      'Run a cable test and LED blink and interpret the pair states',
      'Display, reset and restore managed-switch port statistics from the FortiGate',
      'Pick the right diagnose switch-controller switch-info keyword for a symptom',
      'Use FortiSwitchOS get switch and diagnose switch commands for ports, transceivers, trunks, MCLAG and MAC addresses',
    ],
  },
  {
    id: '4.3-snmp-sflow-logs',
    topic: '4.3',
    title: 'SNMP, sFlow, Flow Tracking and FortiSwitch Logs',
    minutes: 25,
    file: '4.3-snmp-sflow-logs.md',
    objectives: [
      'Configure SNMP for managed switches globally or per switch and allow it through the FortiGate',
      'Compare sFlow and flow tracking (NetFlow/IPFIX) and their sampling modes and defaults',
      'Enable the FortiView Internal Hubs monitor from flow-tracking data',
      'Export FortiSwitch logs to the FortiGate or to syslog and filter switch-controller event logs',
    ],
  },
];
