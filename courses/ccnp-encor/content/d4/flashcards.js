// Domain 4 — Network Assurance. Original flashcards (facts checked against RFC 792/1812, 3411-3418, 5424/5426, 3954, 7011, 6241/6242, 8040, draft-foschiano-erspan and the IOS XE 17.18.1 YANG models; Cisco-specific details marked in REVIEW-TODO.md).
let n = 0;
const c = (topic, front, back) => ({ id: `d4-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('4.1', 'Make debugging safe on a production router?', 'Check CPU; `logging console warnings` (or off); `logging buffered <size> debugging`; `service timestamps debug datetime msec`; narrow with an ACL or `debug condition`; stop with `undebug all`.'),
  c('4.1', 'IOS ping characters?', '`!` reply, `.` timeout, `U` unreachable, `M` could not fragment (DF set), `Q` source quench, `&` TTL expired, `?` unknown.'),
  c('4.1', 'How does IOS traceroute work?', 'UDP probes to high ports (from 33434) with TTL 1, 2, 3 ...; 3 probes per hop; hops reply ICMP time exceeded (type 11); the destination replies port unreachable (type 3 code 3).'),
  c('4.1', 'SNMPv3 security levels and IOS keywords?', 'noAuthNoPriv `noauth`; authNoPriv `auth` (HMAC MD5/SHA); authPriv `priv` (authentication plus DES/3DES/AES encryption).'),
  c('4.1', 'Trap vs inform?', 'Trap: unacknowledged, sent once (v1, v2c, v3). Inform: acknowledged with a Response PDU and retransmitted (v2c, v3). Both to UDP 162; agent listens on UDP 161.'),
  c('4.1', 'SNMPv3 configuration order on IOS XE?', '`snmp-server view` → `snmp-server group NAME v3 priv read VIEW` → `snmp-server user U NAME v3 auth sha ... priv aes 128 ...` → `snmp-server host ... version 3 priv U`. Users are not shown in running-config.'),
  c('4.1', 'Syslog severities 0 to 7?', 'emergencies, alerts, critical, errors, warnings, notifications, informational, debugging. A threshold includes its level and all lower numbers.'),
  c('4.1', 'Syslog message format and defaults?', '`seq: *time: %FACILITY-SEVERITY-MNEMONIC: text`; `*` = clock not authoritative. `logging host` UDP 514, `logging trap` default informational, protocol facility `local7`.'),
  c('4.2', 'Flexible NetFlow building blocks?', '`flow record` (`match` key, `collect` non-key) + `flow exporter` (destination, source, `transport udp`, `export-protocol`) + `flow monitor` (record, exporter, cache) → `ip flow monitor NAME input|output`.'),
  c('4.2', 'FNF cache timeouts and export formats?', 'Inactive default 15 s, active default 1800 s (often set to 60). Export NetFlow v9 (RFC 3954, IOS XE default, UDP 9995 default) or IPFIX (RFC 7011, v10, port 4739).'),
  c('4.3', 'Local SPAN commands?', '`monitor session N source interface X [rx|tx|both]` (default both) or `source vlan V`; `filter vlan` for trunks; `monitor session N destination interface Y [encapsulation replicate]`.'),
  c('4.3', 'RSPAN essentials?', 'VLAN with `remote-span` on every switch, allowed on trunks. Source switch: `destination remote vlan V`. Destination switch: `source remote vlan V` + `destination interface`.'),
  c('4.3', 'ERSPAN essentials?', 'GRE (IP 47, type 0x88BE for type II); 50 bytes overhead. `monitor session N type erspan-source`, `destination` → `erspan-id`, `ip address` (to), `origin ip address` (from); `no shutdown`.'),
  c('4.4', 'IP SLA defaults and timer rule?', 'Frequency 60 s, timeout 5000 ms, threshold 5000 ms, life 3600 s. Keep threshold ≤ timeout ≤ frequency. Schedule: `ip sla schedule N life forever start-time now`.'),
  c('4.4', 'Track `reachability` vs `state`?', 'Reachability: Up on OK or Over threshold. State: Up only on OK. Use `delay down/up` to damp; tie to `ip route ... track N` or `standby G track N decrement D`.'),
  c('4.5', 'Catalyst Center workflow areas?', 'Design (hierarchy, settings, pools, images), Policy (group-based access, VNs, app policy), Provision (discover, assign, templates, PnP, SWIM), Assurance (health, issues, 360, path trace), Platform (APIs, integrations).'),
  c('4.5', 'AI-powered workflows in Catalyst Center?', 'AI Network Analytics (learned baselines, AI-driven issues), Machine Reasoning Engine (codified root-cause workflows), AI Assistant (natural language), AI Endpoint Analytics (ML endpoint classification).'),
  c('4.6', 'Enable NETCONF on IOS XE?', '`aaa new-model`, local or AAA login and exec authorization, a privilege 15 user, SSH keys, `netconf-yang` (TCP 830); optional `netconf-yang feature candidate-datastore`.'),
  c('4.6', 'NETCONF edit-config operations?', '`merge` (default), `replace`, `create` (error `data-exists`), `delete` (error `data-missing`), `remove` (silently ignored if absent).'),
  c('4.6', 'RESTCONF URI, media types and enable commands?', '`https://host/restconf/data/<module>:<container>/...`, list `=key`; `application/yang-data+json` or `+xml`; IOS XE `restconf` + `ip http secure-server`.'),
];
