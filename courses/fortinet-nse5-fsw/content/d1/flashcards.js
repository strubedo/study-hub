// Domain 1 — FortiSwitch concepts flashcards. FortiSwitchOS 7.6 / FortiOS 7.6.
export default [
  // 1.1 VLANs
  { id: 'd1-f001', topic: '1.1', front: 'Three VLAN attributes of every FortiSwitch port?', back: 'Native VLAN (untagged ingress, untagged egress), allowed VLAN list (tagged VLANs carried), untagged VLAN list (egress-only, VLANs sent untagged; must also be allowed).' },
  { id: 'd1-f002', topic: '1.1', front: 'Ingress rule for tagged frames on a FortiSwitch port?', back: 'Accepted only if the tag matches the native VLAN or a VLAN in the allowed list; otherwise dropped.' },
  { id: 'd1-f003', topic: '1.1', front: 'Managed-switch port VLAN commands on the FortiGate take IDs or names?', back: 'VLAN interface **names**: `set vlan "vlan10-data"`, `set allowed-vlans …`, `set untagged-vlans …`. FortiSwitchOS (`config switch interface`) uses VLAN IDs.' },
  { id: 'd1-f004', topic: '1.1', front: 'Default switch-controller reserved network and template IPs?', back: '`10.255.0.0/16`. Quarantine `10.255.11.1/24`, RSPAN `10.255.12.1/24`, NAC segment `10.255.13.1/24`.' },
  { id: 'd1-f005', topic: '1.1', front: 'When can VLAN interface templates be created?', back: 'Only before the FortiGate has authorized any FortiSwitch unit. Objects: `initial-config template` and `initial-config vlans`.' },
  { id: 'd1-f006', topic: '1.1', front: 'Seven traffic types in `initial-config vlans`?', back: '`default-vlan`, `quarantine`, `rspan`, `voice`, `video`, `nac` (onboarding), `nac-segment`.' },
  { id: 'd1-f007', topic: '1.1', front: 'Default FortiLink management VLAN?', back: '4094 (`set switch-controller-mgmt-vlan`, 1–4094, per FortiLink interface).' },
  { id: 'd1-f008', topic: '1.1', front: '`vlan-optimization` options in FortiOS 7.6.1?', back: '`configured` (default: ISLs carry only FortiLink-defined VLANs), `prune` (dynamic VLAN pruning, new in 7.6.1), `none`.' },
  { id: 'd1-f009', topic: '1.1', front: 'PVLAN: isolated vs community?', back: 'One isolated VLAN per PVLAN domain; its hosts reach only promiscuous ports. Many community VLANs; hosts reach their community and promiscuous ports.' },
  { id: 'd1-f010', topic: '1.1', front: 'QinQ: which settings are C-VLAN and which S-VLAN?', back: 'Everything under `config qnq` = customer (inner) VLANs. `native-vlan`, `allowed-vlans`, `vlan-tpid` = service (outer) VLANs. Max four TPID profiles incl. fixed 0x8100.' },

  // 1.2 QoS and LLDP-MED
  { id: 'd1-f011', topic: '1.2', front: 'How many egress queues per FortiSwitch port, and which is highest in strict mode?', back: 'Eight. Strict serves queue 7 first, queue 0 last. Avoid using queue 7 for data (network control uses it).' },
  { id: 'd1-f012', topic: '1.2', front: 'Port trusts both 802.1p and DSCP — which wins?', back: 'DSCP, whenever the packet carries one. Dot1p map only for packets without DSCP. Fortinet recommends trusting only one.' },
  { id: 'd1-f013', topic: '1.2', front: 'Queue for traffic on a port that trusts nothing?', back: 'Queue 0. Unlisted priorities in a dot1p map also go to queue 0.' },
  { id: 'd1-f014', topic: '1.2', front: 'Weight 0 in a weighted queue policy?', back: 'That queue is served strictly, ahead of all non-zero-weight queues. `voice-egress` gives queue 1 (DSCP 46) weight 0.' },
  { id: 'd1-f015', topic: '1.2', front: 'FortiGate QoS object chain?', back: '`dot1p-map` + `ip-dscp-map` + `queue-policy` → `qos-policy` → port `set qos-policy`. Predefined voice set: voice-dot1p, voice-dscp, voice-egress, voice-qos.' },
  { id: 'd1-f016', topic: '1.2', front: 'Does ACL remarking change the local egress queue?', back: 'No. Queuing uses trust maps and the original CoS/DSCP; the new marking matters downstream.' },
  { id: 'd1-f017', topic: '1.2', front: 'LLDP defaults: tx-interval, tx-hold, fast-start?', back: '30 s, 4 (TTL 120 s), 2 s. Auto-ISL ports transmit every `auto-isl-hello-timer` (3 s) but keep the same TTL.' },
  { id: 'd1-f018', topic: '1.2', front: 'Two conditions to advertise an LLDP-MED voice VLAN?', back: '`med-tlvs` includes `network-policy` and the policy entry is enabled; the VLAN must be native or allowed on the port.' },
  { id: 'd1-f019', topic: '1.2', front: 'What does a dynamic port policy apply to a detected FortiFone?', back: 'An LLDP profile (e.g. `fortivoice.fortilink`), a QoS policy (e.g. `voice-qos`) and a VLAN policy. Port needs `access-mode dynamic` + `port-policy`.' },

  // 1.3 Stack ports
  { id: 'd1-f020', topic: '1.3', front: 'FortiLink split interface rules?', back: 'Enabled by default; exactly two aggregate members to two switches; one link active; LACP active. Disable it when all members go to one switch.' },
  { id: 'd1-f021', topic: '1.3', front: 'Split interface and MCLAG: order of operations?', back: 'Split interface enabled **before** MCLAG; after the ICL forms, disable it so both FortiLink links are active. Re-enable it if the ICL is removed.' },
  { id: 'd1-f022', topic: '1.3', front: 'How is the ICL formed from the FortiGate?', back: 'Assign LLDP profile `default-auto-mclag-icl` to the ICL ports on both core switches (or GUI topology: Create MC-LAG pair).' },
  { id: 'd1-f023', topic: '1.3', front: 'MCLAG requirements (top four)?', back: 'Max two peers; same model and firmware recommended; ≥2 ICL links; same MCLAG trunk name on both peers (ports may differ).' },
  { id: 'd1-f024', topic: '1.3', front: 'Which MCLAG peer goes dormant in a split brain?', back: 'Lowest `mclag-split-brain-priority` (0–100, default 50); tie → lowest MAC. Detection is off by default and must be on both peers.' },
  { id: 'd1-f025', topic: '1.3', front: 'How do auto-ISLs form?', back: 'Connect a FortiSwitch to any port of a discovered managed switch; LLDP auto-ISL builds the trunk and the new switch is discovered. FortiSwitchOS 7.2.0+: all ports do auto-discovery.' },
  { id: 'd1-f026', topic: '1.3', front: 'How to stop auto-created ISLs/ICLs being deleted?', back: 'Static ISL (`set static-isl enable` on the trunk) or GUI **Lockdown ISL** on the FortiLink Interface page.' },
  { id: 'd1-f027', topic: '1.3', front: 'Split interface + neighbor detection: standby link state?', back: '`fortilink` detection: standby link down. `lldp` (default from FortiOS 7.6.1): standby link up, LACP inactive.' },

  // 1.4 Switching and routing
  { id: 'd1-f028', topic: '1.4', front: 'MAC aging default and how to disable aging?', back: '300 s (10–1,000,000). Set `mac-aging-interval 0` to disable.' },
  { id: 'd1-f029', topic: '1.4', front: 'Learning limit range and do static MACs count?', back: '1–128 (0 = no limit, default). Static MAC addresses are not counted.' },
  { id: 'd1-f030', topic: '1.4', front: 'Sticky MAC persistence?', back: 'Survives link down/up; lost at reboot unless saved with `execute switch-controller switch-action sticky-mac save`.' },
  { id: 'd1-f031', topic: '1.4', front: 'LAG `aggregator-mode`?', back: 'When members negotiate different speeds, one aggregator is used: `bandwidth` (default) = largest bandwidth, `count` = most ports.' },
  { id: 'd1-f032', topic: '1.4', front: 'LACP fallback timing and requirements?', back: '`lacp-active` only; starts after 90 s (slow) or 30 s (fast) without LACPDUs; no min/max bundle; one MCLAG peer only.' },
  { id: 'd1-f033', topic: '1.4', front: 'SVI vs RVI on FortiSwitchOS?', back: 'SVI: VLAN interface on `internal` (`set vlanid`). RVI: routed port (`set type physical`, `set l2-interface`), VLAN 4095, most L2 features disabled.' },
  { id: 'd1-f034', topic: '1.4', front: 'Inter-VLAN routing in FortiLink mode?', back: 'Done by the FortiGate VLAN interfaces; needs a firewall policy. Routing offload (7.4.1+, advanced license) routes trusted traffic on the switch without inspection.' },
  { id: 'd1-f035', topic: '1.4', front: 'IGMP snooping `flood-unknown-multicast` disabled means?', back: 'Unregistered multicast goes only to mrouter ports (default). Enabled: flooded to all VLAN ports. Aging 300 s, query interval 125 s.' },

  // 1.5 STP
  { id: 'd1-f036', topic: '1.5', front: 'STP between FortiGate and FortiSwitch in FortiLink mode?', back: 'Not supported. STP runs on managed switches (on by default on non-FortiLink ports); the FortiLink port shows STP disabled.' },
  { id: 'd1-f037', topic: '1.5', front: 'Global STP defaults on the switch controller?', back: 'hello 2 s, forward-time 15 s, max-age 20 s, max-hops 20, revision 0. Per switch: `config stp-settings` → `set local-override enable`.' },
  { id: 'd1-f038', topic: '1.5', front: 'What defines an MST region?', back: 'Same region name, revision number and VLAN-to-instance mapping. FortiSwitch supports 15 MST instances; instance 0 (IST) alone sends BPDUs.' },
  { id: 'd1-f039', topic: '1.5', front: 'BPDU guard prerequisites and default timeout?', back: 'Edge port + STP enabled on the port. Shuts the port for 5 min by default (0–120).' },
  { id: 'd1-f040', topic: '1.5', front: 'Root guard behaviour?', back: 'Superior BPDUs on the port are ignored/dropped so it cannot become the path to root. Never enable on the root port.' },
  { id: 'd1-f041', topic: '1.5', front: 'Fortinet loop guard vs STP loop protection?', back: 'Loop guard: LGDP packets detect downstream loops, port shut (timeout default 45 min, 0 = manual). STP loop protection: keeps a BPDU-starved blocking port blocked (Cisco Loop Guard).' },
  { id: 'd1-f042', topic: '1.5', front: 'RPVST+ rule when the CIST root is in the MSTP region?', back: 'RPVST+ VLANs other than VLAN 1 must have worse (numerically higher) priority than the CIST root. Violations: `IC` flag, port Discarding.' },
  { id: 'd1-f043', topic: '1.5', front: 'RPVST+ rule when the CIST root is in the RPVST+ domain?', back: 'FortiSwitch processes only VLAN 1 BPDUs; other VLANs\' root priority must be better (lower) than VLAN 1\'s.' },
  { id: 'd1-f044', topic: '1.5', front: 'Command to view STP for a managed switch from the FortiGate?', back: '`diagnose switch-controller switch-info stp <serial> <instance>`. On the switch: `diagnose stp instance list`.' },

  // 1.6 Ports
  { id: 'd1-f045', topic: '1.6', front: 'Flap guard defaults?', back: 'Disabled. `flap-rate` 5 (1–30), `flap-duration` 30 s (5–300), `flap-timeout` 0 = no timeout (manual reset).' },
  { id: 'd1-f046', topic: '1.6', front: 'PoE priority order and default?', back: 'critical > high > medium (some models) > low. Default `poe-port-priority` is low.' },
  { id: 'd1-f047', topic: '1.6', front: 'How are split ports configured and activated?', back: 'On the switch: `config switch phy-mode` (`<port>-phy-mode 4x10G` …), then restart. FortiOS 7.2.0+ updates the managed port list automatically.' },
  { id: 'd1-f048', topic: '1.6', front: 'FEC values for `fec-state`?', back: '`detect-by-module` (default), `cl74` (25G), `cl91` (100G RS-FEC), `disabled`.' },
  { id: 'd1-f049', topic: '1.6', front: 'What does DMI module status show?', back: 'Temperature, voltage, laser bias, TX and RX power (per lane) and alarm/warning flags: `get switch modules status <port>` or `diagnose switch-controller switch-info modules status <sn> <port>`.' },
  { id: 'd1-f050', topic: '1.6', front: '`discard-mode` values?', back: '`none` (default, accept all), `all-tagged` (drop tagged), `all-untagged` (drop untagged).' },
];
