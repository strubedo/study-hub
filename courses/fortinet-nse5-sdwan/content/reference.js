// Cheat-sheet tables for the Reference page. Cells are inline markdown. FortiOS 7.6 / FortiManager 7.6.
// Verified 2026-10-29 against docs.fortinet.com: FortiOS 7.6.3 Administration Guide (SD-WAN chapter:
// Implicit rule, Manual / Best quality / Lowest cost (SLA) / Load balancing strategy, Performance SLA
// overview, Link health monitor, Passive WAN health measurement, SD-WAN members and zones, Routing
// concepts, SD-WAN related diagnose commands), FortiOS 7.6.4 CLI Reference (config system sdwan),
// FortiManager 7.6.1 Administration Guide (SD-WAN Manager, SD-WAN templates, SD-WAN overlay
// orchestration, ADOM-level metadata variables).
export default [
  {
    id: 'sla-defaults', title: 'Performance SLA (health-check) defaults', topic: '1.3',
    columns: ['Setting (CLI)', 'Default and behaviour'],
    rows: [
      ['Probe mode (`detect-mode`)', '`active` (default), `passive` (measures traffic of firewall policies with `passive-wan-health-measurement` enabled; the policy egress must be an SD-WAN zone, and the option disables `auto-asic-offload`), `prefer-passive` (probes only after 3 minutes with no traffic), `remote` (hub side of embedded SLA in ICMP probes), `agent-based`'],
      ['Protocol (`protocol`)', '`ping` (default); also tcp-echo, udp-echo, http, https, twamp, dns, tcp-connect, ftp. GUI offers only Ping, HTTP and DNS'],
      ['Check interval (`interval`)', '500 ms (20–3 600 000). HTTP/HTTPS health checks are raised to 120 000 ms automatically'],
      ['Failures before inactive (`failtime`)', '5 (1–3600)'],
      ['Restore link after (`recoverytime`)', '5 (1–3600)'],
      ['Probe timeout / window (`probe-timeout`, `probe-count`)', '500 ms; latency and jitter use the last `probe-count` probes (5–30, default 30)'],
      ['SLA target thresholds', 'Latency 5 ms and jitter 5 ms (last 30 probes); packet loss 0% (last 100 probes). `link-cost-factor` defaults to latency, jitter and packet loss (7.6.4 also lists `custom-profile-1`); a member meets the target only if every selected metric is within its threshold'],
      ['Servers', 'Up to two; the first is used and the second takes over if the first is unavailable; both must fail for the health check to fail. A server can be used in only one health check'],
      ['Update static route (`update-static-route`)', 'Enabled: when a member goes inactive, static routes on that interface are withdrawn, and restored on recovery. With several health checks on a member, all must fail'],
    ],
    note: 'Five predefined SLA profiles exist on new VDOMs or factory-reset units: DNS, FortiGuard, Gmail, Google Search, Office 365 (FortiGuard, Google Search and Office 365 use HTTPS).',
  },
  {
    id: 'rule-strategies', title: 'SD-WAN rule strategies and the implicit rule', topic: '2.1',
    columns: ['GUI name (CLI)', 'How it picks members'],
    rows: [
      ['Manual (`set mode manual`, default)', 'No health check. First member/zone in the preference order (`priority-members` / `priority-zone`) wins'],
      ['Best Quality (`set mode priority`)', 'Best `link-cost-factor` (latency, jitter, packet-loss, inbandwidth, outbandwidth, bibandwidth, custom-profile-1; default latency). First-listed member gets a `link-cost-threshold` advantage (default 10%)'],
      ['Lowest Cost (SLA) (`set mode sla`)', 'Lowest member `cost` (default 0) among members that meet the required SLA target; equal cost → interface preference order. `minimum-sla-meet-members` (default 0) sets how many must meet SLA for the rule to apply'],
      ['Load balancing (`set load-balance enable`)', 'Since 7.4.1 replaces Maximize Bandwidth (SLA). Under Manual: no SLA targets; under Lowest Cost (SLA): only in-SLA members, cost ignored. `hash-mode` round-robin (default, the only GUI choice), source-ip-based, source-dest-ip-based, inbandwidth, outbandwidth, bibandwidth'],
      ['Automatic (`set mode auto`)', 'Legacy, CLI only: ranks members with a health check and uses `quality-link` <rank>. Editing the rule in the GUI overwrites it'],
      ['Implicit rule (`load-balance-mode`)', 'Used when no SD-WAN rule matches: ECMP over the routes. `source-ip-based` (default), `weight-based` (Sessions), `usage-based` (Spillover), `source-dest-ip-based`, `measured-volume-based` (Volume)'],
    ],
    note: 'The implicit rule can\'t exclude a member: a weight or volume of 0 (carried over from an older version) is treated as 1. With dynamic routes, sessions are distributed equally regardless of weight.',
  },
  {
    id: 'routing', title: 'Routing, members and sessions', topic: '2.2',
    columns: ['Item', 'Detail'],
    rows: [
      ['Route lookup order', 'Policy routes first, in the precedence user policy routes (`config router policy`) > ISDB routes (Internet Service static routes) > SD-WAN rules; then the FIB (kernel routing table, where the implicit rule applies); no match = drop. A policy route with `action deny` (Stop Policy Routing) skips the rest of the policy route table, SD-WAN rules included'],
      ['SD-WAN rule FIB checks', 'By default (1) the FIB best match for the destination must be an SD-WAN member and (2) a route to the destination must exist through the chosen member. `set gateway enable`: check 2 becomes a route to the member gateway over any interface. `set default enable` + `set gateway enable`: both checks bypassed (members need a `gateway`)'],
      ['Routing table selection', 'Most specific prefix → lowest administrative distance (static default 10; higher-distance routes stay only in the routing database) → then priority and cost (lower wins; static route priority default 1) → ECMP when everything ties'],
      ['Member `priority`', 'Default 1 (1–65535). Used in the member\'s static route and in SD-WAN rules, including the implicit rule; lower is preferred'],
      ['Member `cost`', 'Default 0 (0–4294967295). Used only by Lowest Cost (SLA) rules; lower is preferred'],
      ['Zones', 'Members join the default `virtual-wan-link` zone unless set. Firewall policies reference zones, never individual members; static routes and SD-WAN rules can use zones or members'],
      ['Route change, no SNAT', 'Routing info is flushed from sessions and re-looked up; `set preserve-session-route enable` (interface) keeps existing sessions on their route'],
      ['Route change, SNAT sessions', 'Sessions keep their outbound interface while the old route is still active; `config system global` → `set snat-route-change enable` forces a new lookup (and new SNAT)'],
    ],
  },
  {
    id: 'diagnose', title: 'SD-WAN diagnose commands (FortiOS 7.6)', topic: '3.3',
    columns: ['Command', 'Shows'],
    rows: [
      ['`diagnose sys sdwan health-check [<name>]`', 'Per member: state (alive/dead), packet loss, latency, jitter and the `sla_map` (SLA target map)'],
      ['`diagnose sys sdwan member`', 'Member interface, gateway, priority, weight; plus session count, volume room or spillover state for the implicit load-balance mode in use'],
      ['`diagnose sys sdwan service4 [<id>]`', 'Each IPv4 rule: `Mode(manual)`, `Mode(priority)`, `Mode(sla)`, `Mode(auto)`, `Mode(load-balance hash-mode=...)` (SLA rule + load balancing) or `Mode(manual hash-mode=...)` (Manual + load balancing); members in current order with alive/dead, sla, cost, `selected`. (`service6` for IPv6; split from `service` in 7.4.4)'],
      ['`diagnose sys sdwan intf-sla-log <intf>`', 'Per-interface bandwidth history (in/out/bi bandwidth, tx/rx bytes), last 15 minutes'],
      ['`diagnose sys sdwan sla-log <health-check> <seq>`', 'Per-probe SLA history for one member (status, latency, jitter, loss), last 10 minutes'],
      ['`diagnose sys sdwan internet-service-app-ctrl-list`', 'Applications learned for application-based rules and their matching IP/protocol/port'],
      ['`diagnose firewall proute list`', 'Policy-route table, including SD-WAN rules (`vwl_service=<id>(<name>)`, member seq, oif list, hit count)'],
      ['`diagnose sys link-monitor-passive admin list by-interface`', 'Passive health measurements per interface'],
    ],
    note: 'SD-WAN event logs: logid 0100022921 "Routing information changed" (health check down/up), 0113022923 "SDWAN status" (SLA and rule member changes), 0113022924 "SDWAN volume status" (member over/under its session or volume ratio), 0113022925 "SDWAN SLA information" (periodic, per `sla-fail-log-period` / `sla-pass-log-period`).',
  },
  {
    id: 'fmg-sdwan', title: 'FortiManager 7.6 SD-WAN building blocks', topic: '3.1',
    columns: ['Item', 'What it does'],
    rows: [
      ['SD-WAN Manager pane', 'SD-WAN Network and Monitor views; **Templates** (template groups, IPsec tunnel, BGP, static route and CLI templates); **Overlay Orchestration**; **Rules** (SD-WAN templates)'],
      ['SD-WAN template (SD-WAN Manager > Rules)', 'Zones and members, SD-WAN rules, performance SLAs, optional neighbors and duplication; assigned to devices or device groups. Templates imported from a FortiGate get an `Import` prefix'],
      ['Template group', 'Groups provisioning templates for an SD-WAN configuration (one template per type; only AP profiles allow several); assigned to one or more devices or VDOMs, or to a device group; FortiManager installs and uninstalls the members in the correct order'],
      ['SD-WAN overlay template', 'Wizard that generates and assigns IPsec, BGP and CLI templates for hub and branch overlays and creates the `branch_id` metadata variable. Provides **no** SD-WAN intelligence: still needs an SD-WAN template'],
      ['ADOM-level metadata variables', 'Policy & Objects > Advanced > Metadata Variables: default value plus per-device or device-group mapping (a per-device value beats the group value; per-ADOM mapping only in the Global Database ADOM). Typing `$` in a supported field lists them'],
    ],
  },
];
