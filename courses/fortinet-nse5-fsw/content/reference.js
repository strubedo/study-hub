// Cheat-sheet tables for the Reference page. Cells are inline markdown. FortiSwitchOS 7.6 / FortiOS 7.6.
// Verified 2026-10-29 against docs.fortinet.com, the 7.6.1 editions the exam page links:
// FortiLink Guide 7.6.1 (Introduction; FortiSwitch management; Zero-touch management; Configuring
// FortiLink; Optional FortiLink configuration required before discovering and authorizing; Discovering;
// Configuring STP settings; Configuring loop guard; Configuring DHCP blocking, STP, and loop guard;
// Configuring the DHCP trust setting; Configuring the DHCP server access list; Configuring dynamic ARP
// inspection (DAI); Configuring IPv4 source guard; Managing FortiSwitch units on VXLAN interfaces;
// Firmware upgrade pages; Synchronizing the FortiGate unit with the managed FortiSwitch units;
// Diagnostics and tools) and the FortiSwitchOS 7.6.1 Administration Guide (Packet capture, Port
// security, LLDP, STP/MSTP, MCLAG, ACL, DHCP snooping pages).
export default [
  {
    id: 'fortilink-setup', title: 'FortiLink setup facts (FortiGate side)', topic: '2.1',
    columns: ['Item', 'Detail'],
    rows: [
      ['Switch controller', 'GUI: System > Feature Visibility > **Switch Controller**; CLI `config system global` → `set switch-controller enable`. May already be on, depending on model and release'],
      ['FortiLink interface', 'Created automatically as an **aggregate** (hardware switch on models without aggregate support). Supported on all Ethernet ports except HA and MGMT. FortiLink is not supported in transparent mode'],
      ['Authorization', 'Automatic: `set auto-auth-extension-device enable` on the FortiLink interface (GUI "Automatically authorize devices"). Manual: `config switch-controller managed-switch` → `edit <serial>` → `set fsw-wan1-admin enable`'],
      ['FortiLink split interface', 'Enabled by default; aggregate of exactly two ports to two switches, only one link active. Must be enabled before MCLAG is enabled; disable it afterwards to make both links active'],
      ['Neighbor detection', '`set fortilink-neighbor-detect {fortilink | lldp}`; **LLDP by default starting in FortiOS 7.6.1** (needs `lldp-reception` / `lldp-transmission` enabled)'],
      ['Management VLAN and reserved network', '`set switch-controller-mgmt-vlan` default **4094** (1–4094); `switch-controller-reserved-network` default **10.255.0.0/16**'],
      ['VLAN interface templates', '`config switch-controller initial-config template` / `initial-config vlans` (default-vlan, quarantine, rspan, voice, video, nac, nac-segment). Only before any switch is authorized. Default IPs: quarantine 10.255.11.1/24, rspan 10.255.12.1/24, nac-segment 10.255.13.1/24'],
      ['Zero-touch management', 'FortiSwitchOS 7.2.0+ with FortiOS 7.2.0+: a new switch connects to the available manager (FortiGate, FortiLAN Cloud or FortiSwitch Manager); only one manager at a time'],
      ['Managed-switch limits', 'Per FortiGate model, e.g. FortiGate 40F / FortiGate-VM01: 8; FG-60F–91G family / FortiGate-VM02: 24; FortiGate 100F/101F: 32; FortiGate-VM04: 64'],
    ],
    note: 'Configure managed switches from the FortiGate: changes made directly on a managed FortiSwitch are unknown to the FortiGate and are lost when the switch restarts. Managed switches allow only HTTPS 443 for admin access.',
  },
  {
    id: 'stp-loop', title: 'STP and loop protection on managed FortiSwitch', topic: '1.5',
    columns: ['Feature (CLI)', 'Default and behaviour'],
    rows: [
      ['STP on ports (`set stp-state`)', 'Enabled by default on non-FortiLink ports. STP is **not** supported between the FortiGate and a FortiSwitch in FortiLink mode. STP and IGMP snooping are on for all ports by default'],
      ['Protocols', 'STP, RSTP and MSTP (multiple instances, each mapped to VLANs); interoperation with Rapid PVST+'],
      ['Global settings', '`config switch-controller stp-settings` (name, revision, hello-time, forward-time, max-age, max-hops); per switch `config stp-settings` → `set local-override enable`'],
      ['MSTP instances', '`config switch-controller stp-instance` → `config vlan-range`; per-switch `config stp-instance` → `set priority` in steps of 4096 (0–61440)'],
      ['Edge port (`set edge-port`)', 'Required before BPDU guard can be used on the port'],
      ['BPDU guard (`set stp-bpdu-guard`, `stp-bpdu-guard-timeout` 0–120 min, default 5)', 'Needs an edge port with STP enabled. Any BPDU received shuts the port for the set number of minutes; BPDUs are not forwarded. (The FortiLink Guide 7.6.1 example prints `stp-bpdu-guard-time`; the FortiOS 7.6.1 CLI Reference and FortiSwitchOS use `stp-bpdu-guard-timeout`)'],
      ['Root guard (`set stp-root-guard`)', 'Superior BPDUs received on the port are ignored or dropped, so it can\'t become the path to root'],
      ['Loop guard (`set loop-guard`, `loop-guard-timeout` 0–120 min)', '**Disabled by default** on all ports; the port watches its downstream network for loops'],
    ],
    note: 'Changing `auto-stp-priority` makes FortiLink go down temporarily. Check state with `diagnose switch-controller switch-info stp <serial> <instance>` (FortiGate) or `diagnose stp instance list` (FortiSwitch).',
  },
  {
    id: 'l2-antispoofing', title: 'DHCP snooping, DAI and IPv4 source guard', topic: '3.2',
    columns: ['Feature', 'How it works in FortiLink mode'],
    rows: [
      ['DHCP snooping', 'Enable on the VLAN interface: `set switch-controller-dhcp-snooping enable`. Mark ports with `set dhcp-snooping {trusted | untrusted}`; managed-switch ports are **untrusted by default**. DHCP blocking filters DHCP messages on untrusted ports (host ports, unknown DHCP servers)'],
      ['Dynamic ARP inspection', 'Needs DHCP snooping first. Off on all VLANs by default; enable per VLAN (`switch-controller-arp-inspection`) and set trusted ports (`arp-inspection-trust`). Only ARP with a valid IP-MAC binding is forwarded from untrusted ports. Stats: `diagnose switch-controller switch-info arp-inspection stats <serial>`. FortiOS 7.4.4+ adds an ARP monitor mode'],
      ['IPv4 source guard', 'Off by default; enable per port (`set ip-source-guard enable`). Allows only static IP-MAC entries (`config ip-source-guard` → `config binding-entry`) and entries learned by DHCP snooping. **Static entries win** over dynamic ones; discarded traffic is not logged; more than 2,048 entries from a FortiGate gives an error; model support per the feature matrix'],
    ],
    note: 'FortiSwitch-side checks: `get switch dhcp-snooping status` / `database-summary`, `diagnose switch arp-inspection stats`, `get switch ip-source-guard-violations all`.',
  },
  {
    id: 'fortilink-troubleshooting', title: 'FortiLink troubleshooting commands (FortiGate CLI)', topic: '4.2',
    columns: ['Command', 'Shows or does'],
    rows: [
      ['`execute switch-controller get-conn-status`', 'Per switch: SWITCH-ID, VERSION, STATUS (`Authorized/Up`, `Authorized/Down`, `Discovered/Down`), FLAG, ADDRESS, JOIN-TIME. Flags: C config sync, U upgrading, S staged, D delayed reboot pending, E config sync error, 2 / 3 L2 / L3, V VXLAN, T tunnel, X external. Ends with `Managed-Switches: n (UP: n DOWN: n MAX: n)`'],
      ['`execute switch-controller get-sync-status {all | serial <sn> | switch-id <name>}`', 'Checks each managed switch for configuration synchronization errors (`switch-id` takes the user-defined name)'],
      ['`diagnose switch-controller trigger config-sync <sn>`', 'Synchronizes the full FortiGate configuration to a managed switch'],
      ['`execute switch-controller get-physical-conn {dot | standard} <FortiLink_interface>`', 'Which FortiSwitch ports are authenticated, secured or restricted (FortiLink secure fabric view)'],
      ['`execute switch-controller get-upgrade-status`', 'Firmware upgrade progress of managed switches'],
      ['`diagnose switch-controller switch-info lldp neighbors-summary <sn>`', 'LLDP neighbors seen by a managed switch (also `neighbors-detail`, `stats <sn> <port>`)'],
      ['`diagnose switch-controller switch-info mclag list` / `icl`', 'MCLAG peer and ICL state'],
      ['`diagnose switch-controller switch-info port-stats <sn> <port>`', 'Port counters for a managed switch port'],
    ],
    note: 'If a switch doesn\'t come up, factory-reset it (`execute factoryreset` on the switch) before connecting: the FortiLink guide says a switch in factory default configuration is ready to be connected.',
  },
  {
    id: 'fsw-cli-tools', title: 'FortiSwitchOS CLI tools (standalone or on the switch)', topic: '4.3',
    columns: ['Command', 'Shows or does'],
    rows: [
      ['`get switch lldp neighbor-summary`', 'LLDP neighbors per port'],
      ['`diag switch mac-address list`', 'MAC address table'],
      ['`diagnose switch trunk list`', 'Trunk (LAG) members and state'],
      ['`diagnose switch mclag list` / `icl` / `peer-consistency-check`', 'MCLAG state on the switch'],
      ['`diagnose switch physical-ports list <port>` / `port-stats list` / `cable-diag <port>`', 'Port details (speed, FEC), counters, cable test'],
      ['`diagnose switch 802-1x status [<port>]`', '802.1X session state, including dynamic VLANs'],
      ['`get switch acl counters {all | egress | ingress | prelookup}`', 'ACL hit counters'],
      ['`config system sniffer-profile` + `execute system sniffer-profile start <profile>`', 'On-switch packet capture: filter, `max-pkt-count`, `max-pkt-len` (64–1534), one switch **or** system interface. Then `get system sniffer-profile capture <profile>` or `execute system sniffer-profile upload {ftp | tftp}`. Captures live on a RAM disk and are deleted on power cycle'],
    ],
    note: 'Packet-capture limits: 8 profiles on 1xx and 2xx models (20 MB and 50 MB RAM disk), 16 on 4xx and above. In FortiLink mode, port mirroring (SPAN, RSPAN, ERSPAN) and the FortiOS one-arm sniffer are configured from the FortiGate.',
  },
];
