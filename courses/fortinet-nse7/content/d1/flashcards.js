// Domain 1 — System configuration and SD-WAN setup flashcards (FortiOS 7.6).
export default [
  // 1.1 Security Fabric
  { id: 'd1-f001', topic: '1.1', front: 'Two hard prerequisites for a Security Fabric root FortiGate?', back: 'NAT mode, and a logging component: FortiAnalyzer, FortiAnalyzer Cloud or FortiGate Cloud.' },
  { id: 'd1-f002', topic: '1.1', front: 'Default TCP port a downstream FortiGate uses to reach its upstream Fabric device?', back: '8013 (`upstream-port` under `config system csf`). The upstream interface needs Security Fabric Connection (`fabric`) in allowaccess.' },
  { id: 'd1-f003', topic: '1.1', front: 'Fabric connector vs external connector?', back: 'Fabric connectors join Fortinet devices to the Fabric and topology (FortiAnalyzer, EMS, FortiNAC, FortiNDR). External connectors pull data from SDN platforms, identity sources and threat feeds.' },
  { id: 'd1-f004', topic: '1.1', front: 'Which Fabric member can be the SAML IdP for Fabric SSO?', back: 'Only the root FortiGate. Downstream FortiGates are SPs and must already be Fabric members.' },
  { id: 'd1-f005', topic: '1.1', front: 'Fabric SSO redirect fails in the browser. First thing to check?', back: 'The IdP/SP Management IP/FQDN and port: they must be reachable from the administrator\'s device, not just from the FortiGates.' },
  { id: 'd1-f006', topic: '1.1', front: 'How does a FortiNAC tag dynamic address get its members?', back: 'FortiNAC sends device IPs, tags and groups through the REST API on logon/logoff; the root needs Allow downstream device REST API access.' },
  { id: 'd1-f007', topic: '1.1', front: 'FortiNDR inline scanning: which AV inspection mode?', back: 'Proxy-based only (flow mode not supported). Enable `config system fortindr`, then `set fortindr block` per protocol in the AV profile.' },
  { id: 'd1-f008', topic: '1.1', front: 'What does the default Incoming Webhook Quarantine stitch do?', back: 'Disabled by default. A webhook payload\'s `mac` goes to Access Layer Quarantine (FortiSwitch/FortiAP) and `fctuid` to FortiClient Quarantine (EMS). IP Ban and FortiNAC Quarantine are not part of it.' },
  { id: 'd1-f009', topic: '1.1', front: 'Why use a system action instead of a CLI script to reboot or back up?', back: 'System actions run even in conserve mode and bypass CLI confirmation prompts, which CLI scripts cannot answer.' },
  { id: 'd1-f010', topic: '1.1', front: 'Sequential vs parallel stitch execution?', back: 'Sequential (default): actions one after another with optional delays (max 3600 s); a failed action stops the chain. Parallel: all actions start at once.' },

  // 1.2 HA
  { id: 'd1-f011', topic: '1.2', front: 'FGCP election order with override disabled vs enabled?', back: 'Disabled: monitored interfaces, uptime, priority, serial. Enabled: monitored interfaces, priority, uptime, serial.' },
  { id: 'd1-f012', topic: '1.2', front: 'Default ha-uptime-diff-margin and when uptime resets?', back: '300 seconds. HA uptime resets when the unit reboots or one of its monitored interfaces fails.' },
  { id: 'd1-f013', topic: '1.2', front: 'FGCP settings that are not synchronized?', back: 'Host name, HA priority, vcluster priority, HA override, reserved management interface settings and its gateway, dashboard widgets, most licences.' },
  { id: 'd1-f014', topic: '1.2', front: 'FGCP EtherTypes 0x8890 / 0x8891 / 0x8892 / 0x8893?', back: 'Heartbeat / A-A traffic redistribution / session sync on session-sync-dev / HA Telnet and config sync. Change with ha-eth-type, hc-eth-type, l2ep-eth-type.' },
  { id: 'd1-f015', topic: '1.2', front: 'Default FGCP virtual MAC format (group ID < 256)?', back: '`00:09:0f:09:<group-id hex>:<vcluster bit + physical index>`. Example: group 10, vcluster 1, phyindex 2 → 00:09:0f:09:0a:02.' },
  { id: 'd1-f016', topic: '1.2', front: 'What does active-active load balance by default?', back: 'Proxy-based UTM sessions only. ICMP, multicast, flow inspection (IPS, app control), IPsec and SSL-inspected proxy HTTPS stay on the primary. `load-balance-all` adds TCP.' },
  { id: 'd1-f017', topic: '1.2', front: 'Two ways to cut session sync load on FGCP heartbeat links?', back: '`session-sync-dev` (dedicated sync links, 0x8892) and `session-pickup-delay` (only sessions older than 30 s). `sync-packet-balance` spreads sync processing over CPUs.' },
  { id: 'd1-f018', topic: '1.2', front: 'Virtual clustering limits in FortiOS 7.6?', back: 'Active-passive per vcluster, up to 30 vclusters (7.2.0+), group ID 0–7 (CLI Reference: when more than two vclusters), root and management VDOM only in vcluster 1.' },
  { id: 'd1-f019', topic: '1.2', front: 'FGSP: what is synchronized by default, and the peer limit?', back: 'TCP sessions (IPv4/IPv6) and IPsec tunnels; UDP/ICMP, expectation and NAT need session-pickup options. 2–16 standalone peers or FGCP clusters.' },
  { id: 'd1-f020', topic: '1.2', front: 'standalone-group-id vs group-member-id?', back: 'standalone-group-id (0–255) must match on all FGSP members; group-member-id (0–15) must be unique per peer or FGCP cluster.' },
  { id: 'd1-f021', topic: '1.2', front: 'FGSP asymmetric UTM: layer2-connection available vs unavailable?', back: 'Available: shared layer 2, traffic bounced to the owner\'s MAC. Unavailable (default): UDP-encapsulated to the owner over layer 3, for clouds. TCP only.' },
  { id: 'd1-f022', topic: '1.2', front: 'VRRP virtual MAC on FortiGate?', back: 'Off by default. With `vrrp-virtual-mac enable`: 00-00-5E-00-01-<VRID hex>. Enable on all members of the VRRP domain.' },

  // 1.3 VLANs and VDOMs
  { id: 'd1-f023', topic: '1.3', front: 'VLAN ID uniqueness rule on FortiGate?', back: 'Unique per parent interface. The same VLAN ID can be reused on a different physical interface.' },
  { id: 'd1-f024', topic: '1.3', front: 'Software switch vs hardware switch?', back: 'Software: CPU, supports SSIDs, no STP, no A-A load balancing. Hardware: switch chip, STP, no SSIDs.' },
  { id: 'd1-f025', topic: '1.3', front: 'What enables VLAN switch mode on supported FortiGates?', back: '`config system global` → `set virtual-switch-vlan enable`; then `config system virtual-switch` with `set vlan <id>` and `set trunk enable` on trunk ports.' },
  { id: 'd1-f026', topic: '1.3', front: 'VDOM types in FortiOS 7.6?', back: 'Traffic (normal), Admin (management only, cannot pass traffic, one per FortiGate) and LAN extension (CLI only).' },
  { id: 'd1-f027', topic: '1.3', front: 'What does the management VDOM do?', back: 'Sources local-out traffic: FortiGuard, remote logging, NTP. Root by default; one only. Move FortiGuard with `config system fortiguard` → `set vdom`.' },
  { id: 'd1-f028', topic: '1.3', front: 'Per-VDOM resource limits by default?', back: 'Unlimited: one VDOM can consume everything. Set maximums (and optional guarantees) in Global > System > VDOM.' },
  { id: 'd1-f029', topic: '1.3', front: 'VDOM link defaults and limits?', back: 'Creates <name>0 and <name>1, default type ppp (ethernet for layer 2 needs), name ≤ 11 characters, not hardware offloaded (use NPU VDOM links).' },
  { id: 'd1-f030', topic: '1.3', front: 'Internet-access VDOM: when does root need return routes to tenants?', back: 'Only when the tenant VDOM does not NAT. With NAT in the tenant policy, root only sees the tenant\'s VDOM link address.' },

  // 1.4 SD-WAN
  { id: 'd1-f031', topic: '1.4', front: 'What can a firewall policy reference: SD-WAN members or zones?', back: 'Zones only. Members are used in SD-WAN rules and health checks, never directly in policies.' },
  { id: 'd1-f032', topic: '1.4', front: 'SD-WAN member cost and priority defaults?', back: 'Cost 0 (0–4294967295) and priority 1 (1–65535); lower is preferred for both.' },
  { id: 'd1-f033', topic: '1.4', front: 'DIA vs RIA?', back: 'DIA: branch breaks out to the internet over its own underlays. RIA: internet traffic crosses the overlay and leaves through the hub\'s WAN.' },
  { id: 'd1-f034', topic: '1.4', front: 'Performance SLA link status defaults?', back: 'interval 500 ms, failtime 5, recoverytime 5. HTTP/HTTPS probes use a longer interval automatically.' },
  { id: 'd1-f035', topic: '1.4', front: 'SLA target defaults and sample windows?', back: 'Latency 5 ms, jitter 5 ms, packet loss 0%. Latency and jitter over the last 30 probes, loss over the last 100.' },
  { id: 'd1-f036', topic: '1.4', front: 'What does update-static-route do?', back: 'Enabled by default: removes all static routes through a member whose health check fails, and restores them on recovery.' },
  { id: 'd1-f037', topic: '1.4', front: 'Implicit rule default load-balance-mode and the alternatives?', back: 'source-ip-based (default); source-dest-ip-based, weight-based (sessions), measured-volume-based (volume), usage-based (spillover).' },
  { id: 'd1-f038', topic: '1.4', front: 'In diagnose sys sdwan health-check, state vs sla_map?', back: 'state(alive/dead) is link status. sla_map is a bitmap of SLA targets met: 0x1 meets target 1, 0x0 alive but out of SLA.' },
  { id: 'd1-f039', topic: '1.4', front: 'SD-WAN event log IDs?', back: '0113022923 SDWAN status, 0113022924 volume status, 0113022925 SLA information. Health-check route removal: system event 0100022921 "Routing information changed".' },
  { id: 'd1-f040', topic: '1.4', front: 'SD-WAN Zones tab charts?', back: 'Bandwidth (upload/download per interface), Volume (donut of sent/received bytes), Sessions (donut of active sessions per member).' },
];
