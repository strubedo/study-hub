// Domain 4 — Monitoring and troubleshooting flashcards. FortiOS 7.6 / FortiSwitchOS 7.6.
export default [
  // 4.1
  { id: 'd4-f001', topic: '4.1', front: 'Where is port-based mirroring (SPAN) configured for a managed FortiSwitch?', back: 'On the FortiGate: `config switch-controller managed-switch` → `edit <switch>` → `config mirror`. `status` and `dst` are required.' },
  { id: 'd4-f002', topic: '4.1', front: 'What does `set switching-packet enable` do in a mirror?', back: 'Lets the mirror destination port keep switching normal traffic, for example a laptop that captures and still needs network access.' },
  { id: 'd4-f003', topic: '4.1', front: 'Which VLAN carries RSPAN copies to the FortiGate in FortiLink mode?', back: 'VLAN **4092**. Capture them on the **rspan** interface in Network > Diagnostics > Packet Capture.' },
  { id: 'd4-f004', topic: '4.1', front: 'Traffic-sniffer targets: `in-ports` vs `out-ports`?', back: '`in-ports`: traffic sent to (received on) the port. `out-ports`: traffic sent from (transmitted out of) the port. `target-mac`/`target-ip` match the source.' },
  { id: 'd4-f005', topic: '4.1', front: 'ERSPAN encapsulation and requirement?', back: 'Ethernet + IPv4 + GRE to `erspan-ip`. The collector must answer ping from the switch (a FortiGate policy may be needed). No collector IP = nothing mirrored.' },
  { id: 'd4-f006', topic: '4.1', front: 'ERSPAN session limits in FortiLink mode?', back: 'One ERSPAN session, and ERSPAN can\'t be used together with SPAN or RSPAN.' },
  { id: 'd4-f007', topic: '4.1', front: 'What does the switch controller add automatically for RSPAN/ERSPAN?', back: 'A traffic policy named `sniffer` (policer, `guaranteed-bandwidth 50000`, CoS queue 0) applied to the rspan interface.' },
  { id: 'd4-f008', topic: '4.1', front: 'FortiOS one-arm sniffer: what does it do and since when?', back: 'IDS on mirrored switch traffic (FortiOS/FortiSwitchOS 7.4.1+): `ips-sniffer-mode enable` + `config firewall sniffer`. Logs only; never blocks.' },
  { id: 'd4-f009', topic: '4.1', front: 'Default state of profiles in `config firewall sniffer`?', back: 'All security profiles are disabled by default; enable each `*-status` and pick a profile. Logs: Log & Report > Sniffer Traffic.' },
  { id: 'd4-f010', topic: '4.1', front: 'FortiSwitchOS packet-capture command sequence?', back: '`config system sniffer-profile`, then `execute system sniffer-profile start | pause | stop | upload {ftp|tftp} | delete-capture`; view with `get system sniffer-profile capture`.' },
  { id: 'd4-f011', topic: '4.1', front: 'Packet-capture profile limits?', back: 'One switch interface or one system interface (not both); `max-pkt-len` 64–1534; 8 profiles on 1xx/2xx, 16 on 4xx and up.' },
  { id: 'd4-f012', topic: '4.1', front: 'When can a .pcap be deleted, and when is it lost?', back: 'Only after the capture is stopped (not running or paused). All captures are deleted when the switch is power cycled (RAM disk).' },

  // 4.2
  { id: 'd4-f013', topic: '4.2', front: '`get-conn-status` columns (FortiOS 7.6)?', back: 'SWITCH-ID, VERSION, STATUS, FLAG, ADDRESS, JOIN-TIME, SERIAL, then `Managed-Switches: n (UP: n DOWN: n MAX: n)`.' },
  { id: 'd4-f014', topic: '4.2', front: '`Discovered/Down` vs `Authorized/Down`?', back: 'Discovered/Down: seen but not authorized (authorize it). Authorized/Down: authorized but not connected (rebooting, cable/path, firmware).' },
  { id: 'd4-f015', topic: '4.2', front: '`get-conn-status` flags?', back: 'C config sync, U upgrading, S staged, D delayed reboot pending, E config sync error, 2 L2, 3 L3, V VXLAN, T tunnel, X external.' },
  { id: 'd4-f016', topic: '4.2', front: 'Commands to check and force config sync?', back: '`execute switch-controller get-sync-status {all | group | serial <sn> | switch-id <name>}`; `diagnose switch-controller trigger config-sync <switch>`.' },
  { id: 'd4-f017', topic: '4.2', front: 'Default FortiLink neighbor detection in FortiOS 7.6.1?', back: '`set fortilink-neighbor-detect lldp` (was `fortilink`). Needs `lldp-reception` and `lldp-transmission` enabled on the FortiLink interface.' },
  { id: 'd4-f018', topic: '4.2', front: 'Split interface standby link with LLDP vs FortiLink detection?', back: 'FortiLink detection: standby link down. LLDP detection: standby link up, LACP inactive.' },
  { id: 'd4-f019', topic: '4.2', front: 'A used switch won\'t join FortiLink. First step?', back: '`execute factoryreset` on the switch, then reconnect. Factory-default switches are ready for FortiLink.' },
  { id: 'd4-f020', topic: '4.2', front: '`get-upgrade-status` Status triplet?', back: 'Download % / erase % / save %. Next-boot with the new build and `(Idle)` = staged, waiting for restart.' },
  { id: 'd4-f021', topic: '4.2', front: 'What does `restart delay all` do?', back: 'Restarts all managed switches after a 2-minute delay; `get-conn-status` shows the D flag until they reboot.' },
  { id: 'd4-f022', topic: '4.2', front: 'Firmware images for provisioning: disk vs no disk?', back: 'FortiGate with a hard disk: up to 4 images per FortiSwitch model. Without: 1 image per model.' },
  { id: 'd4-f023', topic: '4.2', front: 'What does `firmware-provision-on-authorization enable` do?', back: 'Sets the switch\'s `firmware-provision-latest once` at authorization; when Authorized/Up it upgrades to the latest supported FortiSwitchOS from FortiGuard, then resets to disable.' },
  { id: 'd4-f024', topic: '4.2', front: 'MCLAG upgrade: which peer restarts first?', back: 'The peer with the lower MAC address (`diagnose switch mclag icl`), after disabling split-brain protection and staging both.' },
  { id: 'd4-f025', topic: '4.2', front: 'Secure fabric `relax` vs `strict` when authentication fails?', back: '`relax`: restricted ISL with no user VLANs. `strict`: no ISL. Default `legacy` = no authentication.' },

  // 4.3
  { id: 'd4-f026', topic: '4.3', front: 'Cable test pair states and the no-cable result?', back: 'Open, Short, Ok, Open_Short, Unknown, Crosstalk. No cable = Open, 0 m. A live link loses traffic for several seconds.' },
  { id: 'd4-f027', topic: '4.3', front: 'Flow-tracking sample modes?', back: '`local` (one port), `perimeter` (all data ports except ISL/ICL), `device-ingress` (all data ports, hop-by-hop). Default rate 1/512.' },
  { id: 'd4-f028', topic: '4.3', front: 'Managed FortiSwitch log export defaults?', back: '`config switch-controller switch-log`: enabled, severity information, user field `fortiswitch-syslog`. Syslog via `remote-log` (port 514).' },
];
