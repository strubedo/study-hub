// Domain 4 — Routing flashcards (generated data).
export default [
  {
    "id": "d4-f001",
    "topic": "4.1",
    "front": "FortiOS route selection order between static routes?",
    "back": "Longest prefix → lowest distance → lowest priority value → ECMP across what is left."
  },
  {
    "id": "d4-f002",
    "topic": "4.1",
    "front": "Default static route distance and priority?",
    "back": "Distance **10**, priority **1**."
  },
  {
    "id": "d4-f003",
    "topic": "4.1",
    "front": "Default distance of a DHCP- or PPPoE-learned default route?",
    "back": "**5**, which beats a static default route at distance 10."
  },
  {
    "id": "d4-f004",
    "topic": "4.1",
    "front": "Route lost on distance vs lost on priority: where is it?",
    "back": "Lost on distance: only in `routing-table database`. Lost on priority: still in the routing table (and usable for RPF)."
  },
  {
    "id": "d4-f005",
    "topic": "4.1",
    "front": "What do `>` and `*` mean in `get router info routing-table database`?",
    "back": "`>` = selected route. `*` = installed in the FIB."
  },
  {
    "id": "d4-f006",
    "topic": "4.1",
    "front": "In `S* 0.0.0.0/0 [10/0] via 198.51.100.1, port2, [5/0]`, what is `[5/0]`?",
    "back": "*[priority/weight]*: priority 5, weight 0. `[10/0]` earlier in the line is *[distance/metric]*."
  },
  {
    "id": "d4-f007",
    "topic": "4.1",
    "front": "Command to see the kernel forwarding table?",
    "back": "`get router info kernel`"
  },
  {
    "id": "d4-f008",
    "topic": "4.1",
    "front": "Lookup order for a new session?",
    "back": "Policy routes → ISDB routes → SD-WAN rules → FIB (routing table). No match = drop."
  },
  {
    "id": "d4-f009",
    "topic": "4.1",
    "front": "Policy route `set action deny` does what?",
    "back": "Stops policy-route evaluation for matching traffic so it uses the routing table. It does **not** drop."
  },
  {
    "id": "d4-f010",
    "topic": "4.1",
    "front": "Policy route evaluation model?",
    "back": "Top-down, first match. Reorder with `move <id> before|after <id>`. An entry with no usable route is skipped."
  },
  {
    "id": "d4-f011",
    "topic": "4.1",
    "front": "Default RPF mode?",
    "back": "**Feasible path**: any active route to the source through the incoming interface passes, including the default route."
  },
  {
    "id": "d4-f012",
    "topic": "4.1",
    "front": "Enable strict RPF?",
    "back": "`config system settings` → `set strict-src-check enable`. The best route to the source must use the incoming interface."
  },
  {
    "id": "d4-f013",
    "topic": "4.1",
    "front": "Debug flow text for an RPF drop?",
    "back": "`reverse path check fail, drop`"
  },
  {
    "id": "d4-f014",
    "topic": "4.1",
    "front": "Why add a blackhole route for a VPN subnet?",
    "back": "When the tunnel route is withdrawn, traffic is dropped instead of leaking out the default route. The wizard uses distance **254**."
  },
  {
    "id": "d4-f015",
    "topic": "4.1",
    "front": "Requirements for ECMP between static routes?",
    "back": "Same prefix, same distance, same priority (and same protocol)."
  },
  {
    "id": "d4-f016",
    "topic": "4.1",
    "front": "Default `v4-ecmp-mode`?",
    "back": "`source-ip-based`. Others: `source-dest-ip-based`, `weight-based`, `usage-based` (spillover)."
  },
  {
    "id": "d4-f017",
    "topic": "4.1",
    "front": "What withdraws a static route when the ISP fails but the link stays up?",
    "back": "A link monitor (`config system link-monitor`) or SD-WAN health check with `update-static-route enable`."
  },
  {
    "id": "d4-f018",
    "topic": "4.1",
    "front": "Effect of `set asymroute enable`?",
    "back": "Reply packets with no matching session (TCP, ICMP) are forwarded by routing alone, with no security inspection. Use only as a last resort."
  },
  {
    "id": "d4-f019",
    "topic": "4.2",
    "front": "Four building blocks of FortiOS SD-WAN?",
    "back": "Members, zones, performance SLAs, SD-WAN rules (plus the implicit rule)."
  },
  {
    "id": "d4-f020",
    "topic": "4.2",
    "front": "Zone for a member with no `set zone`?",
    "back": "`virtual-wan-link`"
  },
  {
    "id": "d4-f021",
    "topic": "4.2",
    "front": "Can a firewall policy reference an SD-WAN member directly?",
    "back": "No. Policies reference **zones**. Put a special member in its own zone."
  },
  {
    "id": "d4-f022",
    "topic": "4.2",
    "front": "Static route to SD-WAN?",
    "back": "`config router static` → `set sdwan-zone \"<zone>\"`. It creates an ECMP route via every member gateway, with a default distance of **1** (not 10)."
  },
  {
    "id": "d4-f023",
    "topic": "4.2",
    "front": "Performance SLA defaults?",
    "back": "Interval 500 ms, failtime 5, recoverytime 5. Targets: latency 5 ms, jitter 5 ms, packet loss 0%."
  },
  {
    "id": "d4-f024",
    "topic": "4.2",
    "front": "Alive → dead timer?",
    "back": "`failtime × interval` (default 5 × 500 ms = 2.5 s)."
  },
  {
    "id": "d4-f025",
    "topic": "4.2",
    "front": "`sla_map=0x2` in `diagnose sys sdwan health-check` means?",
    "back": "The member passes SLA target ID 2 only (bit 1). 0x1 = ID 1, 0x3 = both."
  },
  {
    "id": "d4-f026",
    "topic": "4.2",
    "front": "Which strategies ignore SLA (in/out) state?",
    "back": "**Manual** and **Best Quality**. They use only dead/alive for eligibility."
  },
  {
    "id": "d4-f027",
    "topic": "4.2",
    "front": "Lowest Cost (SLA) logic?",
    "back": "Prefer members meeting the SLA, then lowest `cost`, then `priority-members` order."
  },
  {
    "id": "d4-f028",
    "topic": "4.2",
    "front": "Maximize Bandwidth (SLA) in 7.4.1+ / 8.0 CLI?",
    "back": "`set mode sla` + `set load-balance enable` (hash-mode default round-robin). Cost is ignored."
  },
  {
    "id": "d4-f029",
    "topic": "4.2",
    "front": "Best Quality `link-cost-threshold` default?",
    "back": "**10**%: the first-listed member's metric is divided by 1.1 to prevent flapping."
  },
  {
    "id": "d4-f030",
    "topic": "4.2",
    "front": "FortiOS 8.0 `bandwidth-type underlay`?",
    "back": "Bandwidth hash modes (in/out/bibandwidth) score each overlay by its underlay's available bandwidth. Default is `overlay`."
  }
];
