// Domain 4 — Routing. Original questions for FortiOS 8.0 (generated data).
export default [
  {
    "id": "d4-001",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. A user at 10.0.1.25 opens a session to 10.20.5.7. Which route does the FortiGate use to forward the session?",
    "exhibit": "FGT-HQ # get router info routing-table all\nCodes: K - kernel, C - connected, S - static, R - RIP, B - BGP\n       O - OSPF, IA - OSPF inter area\n       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2\n       E1 - OSPF external type 1, E2 - OSPF external type 2\n       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area\n       * - candidate default\n\nRouting table for VRF=0\nS*      0.0.0.0/0 [10/0] via 203.0.113.1, port1\nC       10.0.1.0/24 is directly connected, port3\nS       10.20.0.0/16 [10/0] via 10.0.1.254, port3\nS       10.20.5.0/24 [20/0] via 198.51.100.1, port2\nC       198.51.100.0/24 is directly connected, port2\nC       203.0.113.0/24 is directly connected, port1",
    "options": [
      "10.20.5.0/24 via 198.51.100.1 on port2",
      "10.20.0.0/16 via 10.0.1.254 on port3, because it has the lower administrative distance",
      "0.0.0.0/0 via 203.0.113.1 on port1, because it is the candidate default",
      "Both 10.20.x routes, load-balanced with ECMP"
    ],
    "answer": [
      0
    ],
    "explanation": "**Longest prefix match comes first.** 10.20.5.7 matches both 10.20.0.0/16 and 10.20.5.0/24. The /24 is more specific, so it wins even though its distance (20) is higher.\n\n* **Lower distance on the /16**: distance only decides between routes to the *same* prefix. A /16 and a /24 are different prefixes, which is why both are installed.\n* **Default route**: it is used only when nothing more specific matches.\n* **ECMP**: ECMP needs the same prefix, distance and priority.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-002",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator notices that the static route to 10.50.0.0/16 through port2 is not shown in the output of get router info routing-table all. Which statement about that route is correct?",
    "exhibit": "FGT-HQ # get router info routing-table database\nCodes: K - kernel, C - connected, S - static, R - RIP, B - BGP\n       O - OSPF, IA - OSPF inter area\n       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2\n       E1 - OSPF external type 1, E2 - OSPF external type 2\n       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area\n       > - selected route, * - FIB route, p - stale info\n\nRouting table for VRF=0\nS    *> 0.0.0.0/0 [10/0] via 203.0.113.1, port1\nC    *> 10.0.1.0/24 is directly connected, port3\nS       10.50.0.0/16 [15/0] via 198.51.100.9, port2\nS    *> 10.50.0.0/16 [10/0] via 10.0.1.254, port3\nC    *> 198.51.100.0/24 is directly connected, port2\nC    *> 203.0.113.0/24 is directly connected, port1",
    "options": [
      "It is a standby route that FortiOS installs in the routing table if the route through port3 is withdrawn.",
      "It is inactive because port2 is down.",
      "It is in the routing table with a higher priority, and the routing-table all command hides higher-priority routes.",
      "It is part of an ECMP pair with the route through port3, and the database lists only one ECMP member as selected."
    ],
    "answer": [
      0
    ],
    "explanation": "Both routes are to 10.50.0.0/16. The port3 route has distance 10, so it is selected (`>`) and in the FIB (`*`). The port2 route has distance 15, so it loses and exists **only in the routing database**. It is a floating route: if the port3 route is withdrawn (port3 down, or a link monitor removes it), the port2 route becomes the best route and is installed.\n\n* **port2 down**: the connected route 198.51.100.0/24 on port2 is selected, so port2 is up.\n* **Priority**: routes that differ only in priority *do* appear in `routing-table all`. These routes differ in distance.\n* **ECMP**: ECMP needs equal distance, and 15 ≠ 10.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-003",
    "topic": "4.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Strict reverse path checking is disabled (default). Which two statements are true? (Choose two.)",
    "exhibit": "FGT-HQ # get router info routing-table all\nCodes: K - kernel, C - connected, S - static, R - RIP, B - BGP\n       O - OSPF, IA - OSPF inter area\n       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2\n       E1 - OSPF external type 1, E2 - OSPF external type 2\n       i - IS-IS, L1 - IS-IS level-1, L2 - IS-IS level-2, ia - IS-IS inter area\n       * - candidate default\n\nRouting table for VRF=0\nS*      0.0.0.0/0 [10/0] via 203.0.113.1, port1\n                  [10/0] via 198.51.100.1, port2, [10/0]\nC       10.0.1.0/24 is directly connected, port3\nC       198.51.100.0/24 is directly connected, port2\nC       203.0.113.0/24 is directly connected, port1",
    "options": [
      "Outbound internet sessions from 10.0.1.0/24 use port1.",
      "A new inbound session from 192.0.2.50 that arrives on port2 passes the RPF check.",
      "Outbound internet sessions are load-balanced between port1 and port2 by source IP.",
      "The route through port2 exists only in the routing database, not in the routing table.",
      "If port1 goes down, outbound traffic is dropped until the administrator lowers the priority of the port2 route."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Both default routes have distance 10, so both are installed in the routing table. The trailing `[10/0]` on the port2 entry is *[priority/weight]*: port2 has priority 10, port1 has the default priority 1. The lowest priority value forwards traffic, so **outbound sessions use port1**.\n\nBecause the port2 route is *in the routing table*, the default feasible-path RPF check finds an active route to 192.0.2.50 through port2, so **new inbound sessions on port2 pass**. This is the main advantage of priority-based backups over floating routes.\n\n* **ECMP**: ECMP requires equal priority as well as equal distance.\n* **Database only**: the route is shown by `routing-table all`, so it is in the table.\n* **Dropped on failure**: if port1 goes down, its route is withdrawn and port2's route takes over automatically.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-004",
    "topic": "4.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default administrative distance of a static route created under config router static? (Enter the number.)",
    "answer": [
      "10"
    ],
    "explanation": "Static routes default to **distance 10** and **priority 1**. Connected routes have distance 0, and a default route learned from DHCP or PPPoE has distance 5.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-005",
    "topic": "4.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "Interface wan1 is set to DHCP mode with \"Retrieve default gateway from server\" enabled. By default, what administrative distance does FortiOS give the default route learned from the DHCP server? (Enter the number.)",
    "answer": [
      "5"
    ],
    "explanation": "A default route learned from DHCP (and PPPoE) gets **distance 5** by default, which beats a manually configured static default route at distance 10. You can change the distance on the interface, or disable *Retrieve default gateway from server*.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-006",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Host 10.30.0.15 sits behind a router connected to port3 and cannot reach server 10.0.1.20. Why does the FortiGate drop the traffic?",
    "exhibit": "FGT-HQ # get router info routing-table all\n...\nRouting table for VRF=0\nS*      0.0.0.0/0 [10/0] via 203.0.113.1, port1\nC       10.0.1.0/24 is directly connected, port4\nC       10.0.2.0/24 is directly connected, port2\nC       10.0.3.0/24 is directly connected, port3\nS       10.30.0.0/24 [10/0] via 10.0.2.254, port2\nC       203.0.113.0/24 is directly connected, port1\n\nFGT-HQ # diagnose debug flow filter addr 10.30.0.15\nFGT-HQ # diagnose debug flow trace start 10\nFGT-HQ # diagnose debug enable\nid=65308 trace_id=1 func=print_pkt_detail line=6012 msg=\"vd-root:0 received a packet(proto=6, 10.30.0.15:51544->10.0.1.20:443) tun_id=0.0.0.0 from port3. flag [S], seq 2910344411, ack 0, win 64240\"\nid=65308 trace_id=1 func=init_ip_session_common line=6193 msg=\"allocate a new session-0003a1f2\"\nid=65308 trace_id=1 func=vf_ip_route_input_common line=2611 msg=\"reverse path check fail, drop\"\nid=65308 trace_id=1 func=ip_session_handle_no_dst line=6279 msg=\"trace\"",
    "options": [
      "The FortiGate has no active route to 10.30.0.0/24 through port3, the interface the packet arrived on.",
      "There is no firewall policy from port3 to port4.",
      "strict-src-check is enabled, and the best route to 10.30.0.15 is the default route.",
      "The server 10.0.1.20 has no route back to 10.30.0.0/24."
    ],
    "answer": [
      0
    ],
    "explanation": "The trace ends with `reverse path check fail, drop`. The RPF check runs on the first packet of a session, before policy lookup. The only routes that could match the source are 10.30.0.0/24 via **port2** and the default via **port1**. Neither uses **port3**, the incoming interface, so even the default feasible-path check fails.\n\nFix the routing: add a route to 10.30.0.0/24 through port3's router, or connect the host where the existing route points.\n\n* **No policy**: a policy failure would show `Denied by forward policy check`. Policy lookup is never reached here.\n* **strict-src-check**: it isn't needed for this drop. Feasible-path mode already fails, because no route via port3 exists at all.\n* **Server return route**: the packet is dropped on the way in. The server never sees it.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-007",
    "topic": "4.1",
    "type": "single",
    "difficulty": 3,
    "stem": "A FortiGate has two static routes to 10.40.0.0/16, both with distance 10: one through port2 with priority 1, and one through port3 with priority 10. A new TCP session from 10.40.1.1 arrives on port3. The administrator has run set strict-src-check enable under config system settings. What happens to the packet?",
    "options": [
      "It is dropped, because the best route back to 10.40.1.1 uses port2, not port3.",
      "It is accepted, because a route to 10.40.0.0/16 through port3 exists in the routing table.",
      "It is accepted, because RPF checks apply only to traffic that matches a policy route.",
      "It is dropped, because strict mode rejects any source address learned from a static route."
    ],
    "answer": [
      0
    ],
    "explanation": "In **strict** mode, the RPF check passes only if the **best** route to the source uses the incoming interface. The best route to 10.40.0.0/16 is via port2 (priority 1), so a packet from that range arriving on port3 fails.\n\n* **Route via port3 exists**: that is enough in the default *feasible-path* mode, which only needs an active route via the incoming interface. Strict mode requires the best route.\n* **Only policy routes**: RPF applies to every new session.\n* **Static routes rejected**: strict mode compares interfaces. It doesn't care how the route was learned.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-008",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The IPsec tunnel to-HQ goes down and its route is withdrawn. What happens to new sessions from the branch LAN to 10.0.5.10?",
    "exhibit": "FGT-Branch # show router static\nconfig router static\n    edit 1\n        set gateway 198.51.100.1\n        set device \"wan1\"\n    next\n    edit 2\n        set dst 10.0.0.0 255.255.0.0\n        set device \"to-HQ\"\n    next\n    edit 3\n        set dst 10.0.0.0 255.255.0.0\n        set blackhole enable\n        set distance 254\n    next\nend",
    "options": [
      "They are dropped, because the blackhole route becomes the best route to 10.0.0.0/16.",
      "They are forwarded out wan1 through the default route.",
      "They are held in a queue until the tunnel comes back up.",
      "They are load-balanced between routes 2 and 3 with ECMP."
    ],
    "answer": [
      0
    ],
    "explanation": "While the tunnel is up, route 2 (distance 10) beats the blackhole route (distance 254). When the tunnel goes down, route 2 is withdrawn. The blackhole route is now the most specific match for 10.0.5.10, so traffic is **silently dropped** instead of leaking out to the internet. The VPN wizard adds this route automatically.\n\n* **Default route**: this is what would happen *without* route 3. The /16 blackhole is more specific than 0.0.0.0/0.\n* **Queued**: FortiOS doesn't hold packets for a route that is down.\n* **ECMP**: the distances differ (10 and 254), and route 2 is gone anyway.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-009",
    "topic": "4.1",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the items in the order FortiOS consults them to route the first packet of a new session, first to last.",
    "items": [
      "Policy routes (config router policy)",
      "ISDB (Internet Service) static routes",
      "SD-WAN rules",
      "The forwarding information base (best routes from the routing table)"
    ],
    "explanation": "FortiOS documents the order of precedence among policy-type routes as **policy-based routes, then ISDB routes, then SD-WAN routes**. Only if none of these matches does the FortiGate use the FIB, which holds the routing table's best routes. In an SD-WAN setup, that FIB lookup is the *implicit rule*. If the FIB has no match either, the packet is dropped.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-010",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Policy route 1 matches destination 10.0.0.0/8 and has set action deny. It sits above policy route 2, which sends all traffic arriving on port3 to gateway 198.51.100.1 through port2. What happens to traffic from port3 to 10.1.1.1?",
    "options": [
      "It skips policy routing and is forwarded according to the routing table.",
      "It is dropped by policy route 1.",
      "It matches policy route 2 and is sent through port2.",
      "It is dropped, because a deny policy route also requires a matching firewall deny policy."
    ],
    "answer": [
      0
    ],
    "explanation": "On a policy route, `action deny` means *do not policy-route this traffic*. Matching traffic stops searching the policy route list and is routed by the FIB. This is how you exempt internal destinations from a broad policy route.\n\n* **Dropped**: a policy route never drops traffic. Firewall policies and blackhole routes drop traffic.\n* **Matches route 2**: evaluation is first match, and route 1 matched first.\n* **Requires a firewall deny policy**: policy routes and firewall policies are independent.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-011",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Host 10.0.1.200 on port3 opens an HTTPS session to 192.0.2.10. Both gateways are reachable. Which path does the session take?",
    "exhibit": "FGT-HQ # diagnose firewall proute list\nlist route policy info(vf=root):\nid=1(0x01) dscp_tag=0xfc 0xfc flags=0x0 tos=0x00 tos_mask=0x00 protocol=6 port=src(0->0):dst(443->443) iif=5(port3)\npath(1): oif=4(port2) gwy=198.51.100.1\nsource wildcard(1): 10.0.1.0/255.255.255.0\ndestination wildcard(1): 0.0.0.0/0.0.0.0\nhit_count=1842 rule_last_used=2026-10-28 09:14:52\n\nid=2(0x02) dscp_tag=0xfc 0xfc flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 port=src(0->0):dst(0->0) iif=5(port3)\npath(1): oif=6(port5) gwy=10.9.9.1\nsource wildcard(1): 10.0.1.128/255.255.255.128\ndestination wildcard(1): 0.0.0.0/0.0.0.0\nhit_count=77 rule_last_used=2026-10-28 09:10:03",
    "options": [
      "Out port2 to 198.51.100.1",
      "Out port5 to 10.9.9.1, because policy route 2 has the more specific source",
      "Through the routing table default route, because two policy routes match",
      "Load-balanced between port2 and port5"
    ],
    "answer": [
      0
    ],
    "explanation": "Policy routes are evaluated **top-down, first match**. They are not compared by specificity. Policy route 1 matches: incoming interface port3, source 10.0.1.0/24 (which includes .200), TCP, destination port 443. The session goes to 198.51.100.1 through port2.\n\n* **More specific source**: longest match applies to the routing table, not to the policy route list. Route 2 would catch .200's *non-HTTPS* traffic.\n* **Routing table because two match**: FortiOS stops at the first match.\n* **Load-balanced**: policy routes don't do ECMP across entries.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-012",
    "topic": "4.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each CLI command with what it displays.",
    "pairs": [
      [
        "get router info routing-table all",
        "Only the best routes per prefix (the routing table)"
      ],
      [
        "get router info routing-table database",
        "All candidate routes, including routes that lost on distance"
      ],
      [
        "get router info kernel",
        "Kernel forwarding table (FIB) entries"
      ],
      [
        "get router info routing-table details 10.20.5.7",
        "The routing entry that matches a single destination"
      ],
      [
        "diagnose firewall proute list",
        "Policy routes, ISDB routes and SD-WAN rules with hit counts"
      ]
    ],
    "explanation": "* `routing-table all` shows the RIB: best routes only.\n* `routing-table database` shows every learned route. `>` marks the selected route and `*` marks FIB routes.\n* `get router info kernel` shows the FIB the forwarding engine uses.\n* `routing-table details <ip>` is a lookup for one destination.\n* `diagnose firewall proute list` shows the policy-route-type entries consulted before the FIB.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-013",
    "topic": "4.1",
    "type": "order",
    "difficulty": 1,
    "stem": "Order the criteria FortiOS applies when choosing among static routes to a destination, from first applied to last.",
    "items": [
      "Longest prefix match",
      "Lowest administrative distance",
      "Lowest priority value",
      "ECMP load sharing across the remaining equal routes"
    ],
    "explanation": "The most specific prefix always wins. Among routes to the same prefix, the lowest distance is installed in the routing table. Among installed routes with equal distance, the lowest priority value forwards traffic. Only if prefix, distance and priority all match does FortiOS share sessions across the routes with ECMP.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-014",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator expects about 75% of new sessions to use port1. Instead, all sessions from a given client always use the same link, and the split between links does not follow the weights. What is the reason?",
    "exhibit": "FGT-HQ # show router static\nconfig router static\n    edit 1\n        set gateway 203.0.113.1\n        set device \"port1\"\n        set weight 75\n    next\n    edit 2\n        set gateway 198.51.100.1\n        set device \"port2\"\n        set weight 25\n    next\nend\n\nFGT-HQ # show full-configuration system settings | grep v4-ecmp\n    set v4-ecmp-mode source-ip-based",
    "options": [
      "Route weights are used only when v4-ecmp-mode is weight-based. The current mode hashes on source IP.",
      "Weights apply only to routes that point to IPsec tunnel interfaces.",
      "The two routes must also have different priorities for weights to take effect.",
      "Weights apply only after the administrator enables SD-WAN."
    ],
    "answer": [
      0
    ],
    "explanation": "Both routes are equal (distance 10, priority 1), so they form an ECMP set. With `v4-ecmp-mode source-ip-based` (the default), each source IP is hashed to one path and the `weight` values are ignored. To get the 75/25 split, set `v4-ecmp-mode weight-based` under `config system settings`.\n\n* **Tunnels only**: weights work on any static route.\n* **Different priorities**: that would break ECMP. Only the lower priority value would forward.\n* **SD-WAN**: weight-based ECMP works without SD-WAN. With SD-WAN, the equivalent setting is `load-balance-mode weight-based` with member weights.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-015",
    "topic": "4.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Port1 connects to an ISP modem that stays up when the ISP's upstream network fails, so traffic keeps using port1 during outages. Which two actions make the FortiGate fail over to the backup default route automatically? (Choose two.)",
    "options": [
      "Configure a link monitor on port1 that probes a server beyond the ISP's first hop.",
      "Make sure update-static-route is enabled on that link monitor.",
      "Increase the administrative distance of the port1 default route.",
      "Enable asymroute under config system settings.",
      "Disable src-check on port1."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "A static route is withdrawn automatically only when its interface goes **down**. When the modem link stays up, a **link monitor** (`config system link-monitor`) or an SD-WAN health check must detect the dead path. It must probe a target *beyond* the CPE, and `update-static-route` (enabled by default) is the setting that actually removes the routes.\n\n* **Higher distance on port1**: this makes port1 the backup all the time. It doesn't detect failure.\n* **asymroute / src-check**: these relax stateful and RPF checks. They have nothing to do with failure detection.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-016",
    "topic": "4.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator enables SD-WAN and can no longer find the v4-ecmp-mode setting. Where is the ECMP load-balancing algorithm configured now?",
    "options": [
      "config system sdwan, set load-balance-mode",
      "config router static, set ecmp-mode on each route",
      "config system settings, set sdwan-ecmp-mode",
      "It is fixed at source-ip-based once SD-WAN is enabled."
    ],
    "answer": [
      0
    ],
    "explanation": "With SD-WAN enabled, `v4-ecmp-mode` is no longer available. The algorithm for traffic that matches no SD-WAN rule (the implicit rule) is set with `load-balance-mode` under `config system sdwan`. It offers `source-ip-based` (default), `weight-based`, `usage-based`, `source-dest-ip-based` and `measured-volume-based`. The other two commands don't exist, and the mode isn't fixed.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-017",
    "topic": "4.1",
    "type": "single",
    "difficulty": 3,
    "stem": "A FortiGate has two default routes: port1 (priority 1) and port2 (priority 10). All internet traffic uses source NAT. Port1 failed, so sessions moved to port2. Port1 has now recovered and its route is back in the routing table, but long-lived existing sessions are still using port2. Which statement explains this?",
    "options": [
      "By default, sessions with SNAT keep their current egress while the route they use is still valid. Enabling snat-route-change forces a new route lookup.",
      "Sessions never move between interfaces until the FortiGate reboots.",
      "The port2 route has a higher priority value, so FortiOS marks its sessions as persistent.",
      "preserve-session-route is enabled by default on every interface."
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS treats NATed sessions differently after a routing change. To avoid changing the source IP mid-session, **sessions with SNAT keep using the same outbound interface while the old route is still active**. The port2 route is still installed, just less preferred. `config system global` → `set snat-route-change enable` makes such sessions do a new lookup (and get new SNAT). New sessions use port1 straight away.\n\n* **Until reboot**: sessions without SNAT are re-routed when the routing table changes.\n* **Persistent because of priority**: priority doesn't flag sessions.\n* **preserve-session-route**: it is *disabled* by default.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-018",
    "topic": "4.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which CLI command shows every route the FortiGate has learned, including routes not installed because a lower-distance route to the same prefix exists? (Enter the full command.)",
    "answer": [
      "get router info routing-table database"
    ],
    "explanation": "`get router info routing-table database` lists all candidate routes. Selected routes are marked `>` and FIB routes `*`. `get router info routing-table all` shows only the installed best routes.",
    "lesson": "4.1-static-routing-table"
  },
  {
    "id": "d4-019",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "To work around an asymmetric routing problem, an administrator runs set asymroute enable under config system settings. What is a consequence of this change?",
    "options": [
      "Packets that don't match an existing session, such as a SYN/ACK whose SYN bypassed the FortiGate, are routed without firewall policy or security inspection.",
      "The FortiGate drops all asymmetric TCP sessions but logs them.",
      "The FortiGate rewrites the source address of reply traffic so that it returns symmetrically.",
      "RPF checks become strict on every interface."
    ],
    "answer": [
      0
    ],
    "explanation": "With asymmetric routing permitted, a reply packet that matches no session is passed to the CPU and **forwarded by routing alone**, with no policy check and no security profiles. Fortinet recommends this only when the topology can't be fixed so that both directions cross the FortiGate.\n\n* **Drops and logs**: this is roughly the *default* behaviour (invalid packets are dropped).\n* **Rewrites source address**: asymroute does no NAT.\n* **Strict RPF**: that is `strict-src-check`, a separate setting.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-020",
    "topic": "4.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "A FortiGate has default route A through port1 at distance 10 and default route B through port2 at distance 20. Both interfaces are up. Which two statements are true? (Choose two.)",
    "options": [
      "Only route A appears in get router info routing-table all.",
      "New inbound sessions from internet hosts that arrive on port2 fail the RPF check.",
      "Route B is used for ECMP when port1 is congested.",
      "Route B is installed automatically when the ISP beyond port1 fails, even if port1 stays up and no link monitor is configured.",
      "Route B must have a lower priority value than route A to act as a backup."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Route B is a **floating** static route. It loses on distance, so it stays in the routing database but not in the routing table. While route A is installed, there is no route to arbitrary internet sources via port2 (only the connected subnet), so **new inbound sessions arriving on port2 fail RPF**.\n\n* **ECMP on congestion**: ECMP needs equal distance, and FortiOS doesn't fail over on congestion.\n* **Upstream failure with port1 up**: only interface-down, a link monitor or an SD-WAN health check withdraws route A.\n* **Priority**: priority only matters between routes with equal distance.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-021",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Both static routes to 10.70.0.0/16 use the default priority and weight, and v4-ecmp-mode is at its default. Which statement about traffic to 10.70.1.5 is true?",
    "exhibit": "FGT-HQ # get router info routing-table details 10.70.1.5\n\nRouting table for VRF=0\nRouting entry for 10.70.0.0/16\n  Known via \"static\", distance 10, metric 0, best\n  * vrf 0 10.0.2.254, via port2\n  * vrf 0 10.0.3.254, via port3",
    "options": [
      "Sessions are distributed between port2 and port3 according to the configured ECMP algorithm.",
      "All sessions use port2, because it is listed first.",
      "Port3 is a standby path that is used only if port2 fails.",
      "Each packet of a session alternates between port2 and port3."
    ],
    "answer": [
      0
    ],
    "explanation": "The entry has two active next hops (`*`) for the same prefix and distance, and the stem says both use the default priority. That is an **ECMP** route. New sessions are spread across port2 and port3 by the ECMP mode (`v4-ecmp-mode`, default source-IP based).\n\n* **First listed**: list order means nothing for ECMP.\n* **Standby**: a standby path would have a higher priority value or distance.\n* **Per packet**: ECMP load-shares **per session**, not per packet.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-022",
    "topic": "4.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Without a link monitor or SD-WAN health check, which two events cause FortiOS to remove a static route from the routing table? (Choose two.)",
    "options": [
      "The route's outgoing interface goes link-down.",
      "The route's outgoing interface is administratively set to down.",
      "The next-hop gateway stops responding to ARP while the link stays up.",
      "The upstream ISP network fails while the link stays up.",
      "The session table reaches its maximum size."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "A static route is tied to its interface state. If the interface loses link or is shut down (`set status down`), the route is withdrawn. If the interface stays up while the gateway or the upstream path dies, the route **stays** in the table, and traffic blackholes. Detecting that case is exactly what link monitors and SD-WAN performance SLAs are for. Session table size has no effect on routes.",
    "lesson": "4.1-route-redundancy-ecmp"
  },
  {
    "id": "d4-023",
    "topic": "4.2",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator adds wan1 and wan2 as SD-WAN members in a zone named \"underlay\". What should be used as the outgoing interface of the firewall policy that allows LAN users to reach the internet over both links?",
    "options": [
      "The underlay SD-WAN zone",
      "wan1 and wan2, selected together as outgoing interfaces",
      "The virtual-wan-link zone",
      "Two policies, one with wan1 and one with wan2"
    ],
    "answer": [
      0
    ],
    "explanation": "Firewall policies reference **SD-WAN zones**, not individual members. Members can't be selected in a policy at all once they belong to SD-WAN. Use the zone that holds the members, here `underlay`.\n\n* **wan1 and wan2**: SD-WAN members aren't available as policy interfaces.\n* **virtual-wan-link**: it is only the default zone. These members are in `underlay`, so a policy to `virtual-wan-link` wouldn't match their traffic.\n* **Two policies**: members can't be used directly, and one zone policy covers both links.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-024",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. When the wan1 cable is unplugged (link down), internet traffic does not fail over to wan2. What is the cause?",
    "exhibit": "FGT-Branch # show system sdwan\nconfig system sdwan\n    set status enable\n    config zone\n        edit \"virtual-wan-link\"\n        next\n        edit \"ISP\"\n        next\n    end\n    config members\n        edit 1\n            set interface \"wan1\"\n            set zone \"ISP\"\n            set gateway 203.0.113.1\n        next\n        edit 2\n            set interface \"wan2\"\n            set gateway 198.51.100.1\n        next\n    end\nend\n\nFGT-Branch # show router static\nconfig router static\n    edit 1\n        set sdwan-zone \"ISP\"\n    next\nend",
    "options": [
      "wan2 has no zone, so it is in virtual-wan-link, and the static route references only the ISP zone.",
      "wan2 needs a cost lower than wan1 before SD-WAN will use it.",
      "No performance SLA is configured, so SD-WAN can't detect that wan1 failed.",
      "The default load-balance-mode, source-ip-based, sends all traffic to the first member."
    ],
    "answer": [
      0
    ],
    "explanation": "A member with no `set zone` is placed in **virtual-wan-link**. The static route uses `sdwan-zone \"ISP\"`, so it creates a default route only through ISP's members, which is just wan1. There's no default route through wan2. (The firewall policy probably uses the ISP zone as well.) Put wan2 in the ISP zone, or reference both zones.\n\n* **Cost**: cost only matters to Lowest Cost (SLA) rules. It doesn't create routes.\n* **No SLA**: wan1 went link-down, which withdraws its route even without an SLA. The problem is that no route via wan2 exists to fail over to.\n* **load-balance-mode**: source-IP hashing spreads clients across all members with routes. It doesn't pin traffic to the first member.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-025",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 1,
    "stem": "Which three parts make up an SD-WAN performance SLA on FortiOS? (Choose three.)",
    "options": [
      "Health check: probe mode, protocol and server",
      "SLA targets: latency, jitter and packet-loss thresholds",
      "Link status: check interval, failures before inactive and restore link after",
      "Strategy: manual, best quality or lowest cost",
      "Member cost",
      "Implicit rule load-balancing mode"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explanation": "FortiOS describes a performance SLA as **health checks**, **SLA targets** and **link status** settings (`interval`, `failtime`, `recoverytime`).\n\n* **Strategy**: this belongs to SD-WAN *rules*, which reference SLAs.\n* **Member cost**: a member attribute used by Lowest Cost rules.\n* **Load-balancing mode**: a global SD-WAN setting for the implicit rule.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-026",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Health check DC_SLA has two SLA targets. ID 1: latency 60 ms, jitter 10 ms, packet loss 2%. ID 2: latency 150 ms, jitter 20 ms, packet loss 5%. Both use link-cost-factor latency, jitter and packet-loss. Which statement is correct?",
    "exhibit": "FGT-Branch # diagnose sys sdwan health-check DC_SLA\nHealth Check(DC_SLA):\nSeq(1 wan1): state(alive), packet-loss(0.000%) latency(42.118), jitter(1.204), mos(4.381), bandwidth-up(99012), bandwidth-dw(98114), bandwidth-bi(197126) sla_map=0x3\nSeq(2 wan2): state(alive), packet-loss(1.000%) latency(95.660), jitter(2.871), mos(4.214), bandwidth-up(49311), bandwidth-dw(49502), bandwidth-bi(98813) sla_map=0x2",
    "options": [
      "wan2 meets SLA target 2 but not SLA target 1.",
      "wan2 meets SLA target 1 but not SLA target 2.",
      "wan2 is out of SLA for both targets and will be marked dead.",
      "wan1 meets only SLA target 1."
    ],
    "answer": [
      0
    ],
    "explanation": "`sla_map` is a bitmap of the SLA IDs a member currently passes. Bit 0 (0x1) is ID 1 and bit 1 (0x2) is ID 2.\n\n* wan1, `0x3`: passes both (42 ms is below 60 and 150).\n* wan2, `0x2`: passes only ID 2. Its 95.66 ms latency exceeds ID 1's 60 ms but is within ID 2's 150 ms.\n\nBeing out of SLA doesn't make a member **dead**. Dead/alive depends only on whether probes get replies, and wan2 is `alive`.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-027",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "A performance SLA uses interval 1000 ms, failtime 3 and recoverytime 10. A member stops receiving any probe replies. About how long until the member is marked dead?",
    "options": [
      "3 seconds",
      "10 seconds",
      "1 second",
      "30 seconds"
    ],
    "answer": [
      0
    ],
    "explanation": "Alive to dead takes `failtime × interval`: 3 × 1000 ms = **3 s**. Dead to alive uses `recoverytime × interval`: 10 × 1000 ms = 10 s after replies return. Defaults are interval 500 ms with failtime and recoverytime of 5, so 2.5 s each way.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-028",
    "topic": "4.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default check interval of an SD-WAN performance SLA (health check), in milliseconds? (Enter the number.)",
    "answer": [
      "500",
      "500 ms",
      "500ms"
    ],
    "explanation": "The default `interval` is **500 ms**, with `failtime` 5 and `recoverytime` 5. For HTTP and HTTPS probes, FortiOS automatically raises the interval to 120,000 ms.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-029",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Rule 1 uses the default strategy, and member 1 is wan1, member 2 is wan2. Which interface carries new sessions to SIP_Provider?",
    "exhibit": "FGT-Branch # show system sdwan\nconfig system sdwan\n    ...\n    config service\n        edit 1\n            set name \"VoIP\"\n            set dst \"SIP_Provider\"\n            set priority-members 2 1\n        next\n    end\nend\n\nFGT-Branch # diagnose sys sdwan health-check Voice_SLA\nHealth Check(Voice_SLA):\nSeq(1 wan1): state(alive), packet-loss(0.000%) latency(18.330), jitter(0.912), mos(4.402), bandwidth-up(98211), bandwidth-dw(97004), bandwidth-bi(195215) sla_map=0x1\nSeq(2 wan2): state(alive), packet-loss(6.000%) latency(141.072), jitter(22.519), mos(3.611), bandwidth-up(48107), bandwidth-dw(48870), bandwidth-bi(96977) sla_map=0x0",
    "options": [
      "wan2",
      "wan1, because wan2 is out of SLA",
      "Both, load-balanced by source IP",
      "Neither. The rule is skipped and the implicit rule is used."
    ],
    "answer": [
      0
    ],
    "explanation": "The rule shows no `set mode`, so it uses the default **manual** strategy. Manual rules ignore SLA state and use the **first alive member** in `priority-members` order, here member 2 (wan2). wan2 is out of SLA (`sla_map=0x0`) but still alive, so it carries the VoIP traffic.\n\nTo steer away from a poor-quality link, use Lowest Cost (SLA), or Best Quality on a metric such as jitter.\n\n* **wan1**: SLA state matters only to SLA-based strategies.\n* **Load-balanced**: a manual rule without `load-balance enable` doesn't spread traffic.\n* **Skipped**: a rule is skipped only if none of its members is usable.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-030",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Rule 3 uses the Lowest Cost (SLA) strategy. Members: 1 = wan1 (cost 10), 2 = wan2 (cost 0), 3 = lte1 (cost 50). Which member carries new SaaS sessions?",
    "exhibit": "FGT-Branch # show system sdwan\n    ...\n    config service\n        edit 3\n            set name \"SaaS\"\n            set mode sla\n            set dst \"SaaS_Servers\"\n            config sla\n                edit \"SaaS_SLA\"\n                    set id 1\n                next\n            end\n            set priority-members 1 2 3\n        next\n    end\n\nFGT-Branch # diagnose sys sdwan health-check SaaS_SLA\nHealth Check(SaaS_SLA):\nSeq(1 wan1): state(alive), packet-loss(0.000%) latency(31.004), jitter(1.887), mos(4.390), bandwidth-up(97230), bandwidth-dw(98410), bandwidth-bi(195640) sla_map=0x1\nSeq(2 wan2): state(alive), packet-loss(8.000%) latency(210.551), jitter(35.102), mos(3.281), bandwidth-up(47012), bandwidth-dw(48990), bandwidth-bi(96002) sla_map=0x0\nSeq(3 lte1): state(alive), packet-loss(0.000%) latency(58.762), jitter(4.410), mos(4.341), bandwidth-up(19840), bandwidth-dw(29100), bandwidth-bi(48940) sla_map=0x1",
    "options": [
      "wan1",
      "wan2",
      "lte1",
      "wan1 and lte1, load-balanced"
    ],
    "answer": [
      0
    ],
    "explanation": "Lowest Cost (SLA) first keeps the members that **meet the SLA target**: wan1 and lte1 (`sla_map=0x1`). Among those, it picks the **lowest cost**: wan1 (10) beats lte1 (50).\n\n* **wan2**: it has the lowest cost overall, but it is out of SLA. SLA-passing members are preferred.\n* **lte1**: it meets the SLA, but its cost is higher.\n* **Load-balanced**: that would need `set load-balance enable`.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-031",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "A Lowest Cost (SLA) rule lists priority-members 1 2. Member 1 (wan1) has cost 10 and member 2 (wan2) has cost 5. Both members are alive, but neither meets the SLA target. Which member does the rule use?",
    "options": [
      "wan2",
      "wan1, because it is first in priority-members",
      "Neither. The rule is skipped and the implicit rule is used.",
      "Neither. The traffic is dropped."
    ],
    "answer": [
      0
    ],
    "explanation": "When no member meets the SLA, the members tie on SLA status, so FortiOS compares **cost**. Fortinet's documented example behaves exactly this way: with both links out of SLA, the lower-cost link (wan2) is used. The `priority-members` order breaks ties only between members with equal cost.\n\nThe rule isn't skipped, because its members are alive and have routes. Being out of SLA doesn't drop traffic.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-032",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "A Best Quality rule uses link-cost-factor latency, priority-members 1 2 (1 = wan1, 2 = wan2) and the default link-cost-threshold. The health check measures 100 ms on wan1 and 95 ms on wan2. Which member is selected?",
    "options": [
      "wan1, because its latency is evaluated as about 90.9 ms",
      "wan2, because it has the lower measured latency",
      "Both, because their latencies differ by less than 10%",
      "Whichever member has the lower jitter"
    ],
    "answer": [
      0
    ],
    "explanation": "Best Quality gives the **first-listed** member an advantage of `link-cost-threshold` (default **10**%) to prevent flapping between similar links. wan1's latency is compared as 100 / 1.1 ≈ **90.9 ms**, which beats wan2's 95 ms, so wan1 stays selected. wan2 would need latency below about 90.9 ms to take over.\n\n* **Lower measured latency wins**: that ignores the threshold.\n* **Both**: Best Quality picks one member. It isn't load balancing.\n* **Jitter**: the rule's factor is latency only.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-033",
    "topic": "4.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each SD-WAN rule strategy with its member selection behaviour.",
    "pairs": [
      [
        "Manual",
        "First alive member in the configured order. SLA targets are ignored."
      ],
      [
        "Best Quality",
        "Member with the best measured value for the chosen link-cost factor"
      ],
      [
        "Lowest Cost (SLA)",
        "Lowest-cost member among those that meet the SLA target"
      ],
      [
        "Lowest Cost (SLA) with load balancing",
        "Sessions distributed across all members that meet the SLA target"
      ]
    ],
    "explanation": "* **Manual** (`mode manual`) looks only at dead/alive.\n* **Best Quality** (`mode priority`) ranks members by latency, jitter, loss, bandwidth or a custom profile, with a 10% bias towards the first member.\n* **Lowest Cost (SLA)** (`mode sla`) filters members by SLA, then picks the lowest cost.\n* **With load balancing** (`mode sla` + `load-balance enable`, formerly *Maximize Bandwidth (SLA)*), traffic is shared across all SLA-passing members and cost is ignored.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-034",
    "topic": "4.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each implicit-rule load-balancing algorithm as shown in the GUI with its CLI load-balance-mode value.",
    "pairs": [
      [
        "Source IP",
        "source-ip-based"
      ],
      [
        "Sessions",
        "weight-based"
      ],
      [
        "Spillover",
        "usage-based"
      ],
      [
        "Source-Destination IP",
        "source-dest-ip-based"
      ],
      [
        "Volume",
        "measured-volume-based"
      ]
    ],
    "explanation": "`config system sdwan` → `set load-balance-mode`:\n\n* **Source IP** (default) hashes on source address.\n* **Sessions** uses member `weight`.\n* **Spillover** uses `spillover-threshold` and `ingress-spillover-threshold`.\n* **Source-Destination IP** hashes on the address pair.\n* **Volume** uses member `volume-ratio`.\n\nVolume mode exists only under SD-WAN. Plain ECMP (`v4-ecmp-mode`) doesn't offer it.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-035",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. SD-WAN rule 1 should send traffic for 192.0.2.0/24 through wan2, but the traffic leaves through port5. Why?",
    "exhibit": "FGT-Branch # get router info routing-table all\n...\nRouting table for VRF=0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, wan1\n                  [1/0] via 198.51.100.1, wan2\nC       10.1.1.0/24 is directly connected, port3\nC       10.1.9.0/24 is directly connected, port5\nS       192.0.2.0/24 [10/0] via 10.1.9.254, port5\nC       198.51.100.0/24 is directly connected, wan2\nC       203.0.113.0/24 is directly connected, wan1\n\nFGT-Branch # show system sdwan\n    ...\n    config service\n        edit 1\n            set name \"Partner\"\n            set dst \"Partner_Net\"\n            set priority-members 2\n        next\n    end\n(Partner_Net = 192.0.2.0/24, member 2 = wan2, port5 is not an SD-WAN member)",
    "options": [
      "The best route to 192.0.2.0/24 points to port5, a non-SD-WAN interface, so SD-WAN rules are not evaluated for this traffic.",
      "Rule 1 needs a performance SLA before it can select wan2.",
      "The port5 route has a lower administrative distance than the SD-WAN default route.",
      "Manual rules apply only to traffic that matches an ISDB Internet Service."
    ],
    "answer": [
      0
    ],
    "explanation": "By default, an SD-WAN rule is used only if the **FIB best route** for the destination resolves to an SD-WAN member. The /24 via port5 is more specific than the SD-WAN default route, and port5 isn't a member, so the rule isn't consulted and the FIB sends the traffic out port5. Fix it by removing or changing the port5 route, or by enabling `set default enable` on the rule. That option skips this check.\n\n* **SLA required**: manual rules don't need an SLA.\n* **Lower distance**: the opposite is true. The port5 route has distance 10 and the SD-WAN zone route has distance 1 (the default for SD-WAN zone routes). Longest prefix, not distance, is what makes the port5 route best.\n* **ISDB only**: rules can match plain address objects.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-036",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. SD-WAN rule 2 steers traffic for 10.100.0.0/16 to member HQ-VPN1 (overlay). The BGP session over the tunnel is down. Users report that data-centre traffic is leaving through wan1 to the internet. What explains this?",
    "exhibit": "FGT-Branch # get router info routing-table all\n...\nRouting table for VRF=0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, wan1\n                  [1/0] via 198.51.100.1, wan2\nC       10.1.1.0/24 is directly connected, port3\nC       172.31.0.0/24 is directly connected, HQ-VPN1\nC       198.51.100.0/24 is directly connected, wan2\nC       203.0.113.0/24 is directly connected, wan1\n\nFGT-Branch # diagnose sys sdwan service4 2\n\nService(2): Address Mode(IPV4) flags=0x200 use-shortcut-sla\n Tie break: cfg\n Gen(7), TOS(0x0/0x0), Protocol(0): src(1->65535):dst(1->65535), Mode(manual)\n Members(1):\n  1: Seq_num(3 HQ-VPN1 overlay), alive\n Dst address(1):\n       10.100.0.0-10.100.255.255",
    "options": [
      "HQ-VPN1 has no route to 10.100.0.0/16, so rule 2 is skipped and the traffic falls through to the implicit rule, which uses the default route.",
      "HQ-VPN1 is dead, so SD-WAN withdrew the overlay.",
      "Manual rules always fall back to underlay members when the overlay is in a different zone.",
      "The default route has a lower distance than the connected tunnel route."
    ],
    "answer": [
      0
    ],
    "explanation": "An SD-WAN rule may use a member only if that member has a **valid route** to the destination. With BGP down, the routing table has no route to 10.100.0.0/16 via HQ-VPN1 (only the connected 172.31.0.0/24), so the member fails the check and rule 2, which has no other member, is skipped. The traffic falls through to the implicit rule: the FIB best match, which is the default route via wan1/wan2.\n\nAdd a static route to 10.100.0.0/16 via the tunnel as a backup to BGP, plus a distance-254 blackhole route for the prefix so the traffic is dropped instead of leaking to the internet whenever the tunnel route is missing.\n\n* **Dead**: the member is shown `alive`.\n* **Zone fallback**: there's no such behaviour.\n* **Distance**: the connected route covers only 172.31.0.0/24, not 10.100.0.0/16.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-037",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. An SD-WAN rule sends Microsoft 365 traffic through wan2, but all Microsoft 365 sessions from port3 leave through wan1. Why?",
    "exhibit": "FGT-Branch # show router policy\nconfig router policy\n    edit 1\n        set input-device \"port3\"\n        set src \"10.1.1.0/255.255.255.0\"\n        set dst \"0.0.0.0/0.0.0.0\"\n        set gateway 203.0.113.1\n        set output-device \"wan1\"\n    next\nend",
    "options": [
      "Regular policy routes are evaluated before SD-WAN rules, and policy route 1 matches all traffic from 10.1.1.0/24 on port3.",
      "SD-WAN rules can't match ISDB Internet Services while a policy route exists.",
      "wan1 has a lower cost than wan2.",
      "The implicit rule always takes precedence over an ISDB-based SD-WAN rule."
    ],
    "answer": [
      0
    ],
    "explanation": "The documented precedence is **policy routes > ISDB routes > SD-WAN rules**. This leftover policy route matches everything from 10.1.1.0/24 arriving on port3, so the SD-WAN rule is never reached. Remove it, or narrow it, or add a policy route with `action deny` for the traffic SD-WAN should handle.\n\n* **Can't match ISDB**: SD-WAN rules can match ISDB services. They are simply evaluated later.\n* **Cost**: cost only matters inside Lowest Cost rules, and this rule is never reached.\n* **Implicit rule**: it applies only when no rule matches. It sits *after* explicit rules.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-038",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "In FortiOS 8.0, an administrator configures set bandwidth-type underlay in an SD-WAN rule. Which two statements about this option are true? (Choose two.)",
    "options": [
      "It applies to rules with load-balance enable and a hash-mode of inbandwidth, outbandwidth or bibandwidth.",
      "It makes overlays that share a busy underlay score lower available bandwidth, so new sessions prefer overlays on less-loaded underlays.",
      "It is the default for new SD-WAN rules.",
      "It measures underlay bandwidth by sending TWAMP probes to the hub.",
      "It changes how the implicit rule distributes sessions."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "The 8.0 feature *SD-WAN underlay bandwidth steers traffic* adds `bandwidth-type {overlay | underlay}` to load-balanced rules that use a bandwidth hash mode. With `underlay`, each overlay is scored by the available bandwidth of its **underlay**: estimated bandwidth minus measured use. Tunnels that share a saturated port then lose out to tunnels on a quieter port.\n\n* **Default**: the default is `overlay`.\n* **TWAMP**: the calculation uses configured or speed-test estimated bandwidth and measured interface usage, not probes.\n* **Implicit rule**: the option is per SD-WAN rule (`config service`). The implicit rule uses `load-balance-mode`.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-039",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. HQ1-T1 and HQ2-T1 run over underlay port1, and HQ1-T2 and HQ2-T2 run over underlay port2. The rule uses bandwidth-type underlay. Why do HQ1-T1 and HQ2-T1 show the same bibandwidth value?",
    "exhibit": "FGT-Branch # diagnose sys sdwan service4 1\n\nService(1): Address Mode(IPV4) flags=0xa4200 use-shortcut-sla use-shortcut load-balance\n Tie break: cfg\n Shortcut priority: 2\n Gen(4), TOS(0x0/0x0), Protocol(0): src(1->65535):dst(1->65535), Mode(sla hash-mode=bibandwidth)\n Members(4):\n  1: Seq_num(3 HQ1-T1 overlay), alive, sla(0x1), gid(2), num of pass(1), bibandwidth: 63220Kbps, selected\n  2: Seq_num(4 HQ2-T1 overlay), alive, sla(0x1), gid(2), num of pass(1), bibandwidth: 63220Kbps, selected\n  3: Seq_num(5 HQ1-T2 overlay), alive, sla(0x1), gid(2), num of pass(1), bibandwidth: 141870Kbps, selected\n  4: Seq_num(6 HQ2-T2 overlay), alive, sla(0x1), gid(2), num of pass(1), bibandwidth: 141870Kbps, selected\n Src address(1):\n       10.1.1.0-10.1.1.255\n Dst address(1):\n       10.100.0.0-10.100.255.255",
    "options": [
      "Both tunnels ride port1, and the rule scores each overlay by the available bandwidth of its underlay.",
      "The rule averages the available bandwidth of all overlays in the same zone.",
      "The two tunnels are members of an IPsec aggregate and share one SA.",
      "bibandwidth is calculated only for tunnels that currently carry no traffic."
    ],
    "answer": [
      0
    ],
    "explanation": "With `bandwidth-type underlay`, an overlay's score is its underlay's available bidirectional bandwidth. Both T1 tunnels use port1, so they get port1's value (63,220 kbps). Both T2 tunnels use port2, so they get port2's value. Port2 has more headroom, so new sessions prefer the T2 overlays.\n\n* **Zone average**: all four overlays are in the same zone but show two different values, so it can't be a zone average.\n* **Aggregate**: nothing indicates an IPsec aggregate. Members are separate tunnels.\n* **No traffic**: the calculation applies to every member and subtracts measured use.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-040",
    "topic": "4.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "In FortiOS 8.0, which set command, entered in a load-balanced SD-WAN rule that uses hash-mode bibandwidth, makes the rule use the shared underlay's available bandwidth instead of each overlay's? (Enter the full set command.)",
    "answer": [
      "set bandwidth-type underlay"
    ],
    "explanation": "`set bandwidth-type underlay` under `config system sdwan` → `config service` → `edit <id>`. The default is `overlay`. It takes effect with `load-balance enable` and `hash-mode` set to `inbandwidth`, `outbandwidth` or `bibandwidth`.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-041",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. A Lowest Cost (SLA) rule lists both members, both members meet the SLA, and wan2 has cost 50. On the 20th of the month, wan1's traffic for the billing period passes 500 GB. What happens?",
    "exhibit": "FGT-Branch # show system sdwan\nconfig system sdwan\n    ...\n    config members\n        edit 1\n            set interface \"wan1\"\n            set gateway 203.0.113.1\n            set quota-limit 500\n            set billing-start-day 1\n            set overage enable\n            set overage-cost 100\n        next\n        edit 2\n            set interface \"wan2\"\n            set gateway 198.51.100.1\n            set cost 50\n        next\n    end",
    "options": [
      "wan1's cost becomes 100, so the Lowest Cost rule prefers wan2 until the next billing day.",
      "wan1 is disabled as an SD-WAN member until an administrator re-enables it.",
      "Traffic on wan1 is dropped once the quota is exceeded.",
      "wan1's static route is withdrawn from the routing table."
    ],
    "answer": [
      0
    ],
    "explanation": "The FortiOS 8.0 monthly quota feature counts traffic per member over a billing period that starts on `billing-start-day`. Once `quota-limit` (GB) is reached with `overage enable`, the member's cost (here `overage-cost 100`), weight or volume ratio is swapped for the overage value. wan2 (cost 50) is now cheaper, so new sessions move to it. On the next billing day the counter and cost reset. Usage is shown by `diagnose sys sdwan bill member <id>`.\n\nThe feature only changes the steering inputs. It doesn't disable the member, drop traffic or withdraw routes.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-042",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about member 2 is correct?",
    "exhibit": "date=2026-10-27 time=14:02:11 eventtime=1793134931488812011 tz=\"-0700\" logid=\"0113022923\" type=\"event\" subtype=\"sdwan\" level=\"notice\" vd=\"root\" logdesc=\"SDWAN status\" eventtype=\"Health Check\" healthcheck=\"DC_SLA\" slatargetid=1 member=\"2\" msg=\"Member status changed. Member out-of-sla.\"",
    "options": [
      "Member 2 still answers probes but exceeds a threshold of SLA target 1. SLA-based rules that reference target 1 now treat it as failing the SLA.",
      "Member 2 stopped answering probes, and its static routes were withdrawn.",
      "Member 2 exceeded its monthly volume quota.",
      "Member 2 was removed from its SD-WAN zone."
    ],
    "answer": [
      0
    ],
    "explanation": "Log 0113022923 (*SDWAN status*) with `Member out-of-sla` reports a change in **SLA state** for target ID 1. The member is still alive, but a measured metric (latency, jitter or loss) crossed the threshold. Lowest Cost (SLA) and SLA load-balancing rules react. Manual and Best Quality rules don't use SLA state.\n\n* **Dead and routes withdrawn**: that produces messages such as *Member link is unreachable or miss threshold. Stop forwarding traffic.* and a *Routing information changed* event (0100022921).\n* **Quota and zone changes**: these aren't reported by this message.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-043",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator wants an SD-WAN rule to share traffic across every member that meets the SLA target, which older FortiOS versions called the Maximize Bandwidth (SLA) strategy. How is this configured in FortiOS 8.0?",
    "options": [
      "set mode sla together with set load-balance enable",
      "set mode load-balance",
      "set mode priority together with set hash-mode round-robin",
      "set load-balance-mode usage-based under config system sdwan"
    ],
    "answer": [
      0
    ],
    "explanation": "Since FortiOS 7.4.1, the former Maximize Bandwidth strategy is configured as **load balancing inside a Lowest Cost (SLA) rule**: `set mode sla` + `set load-balance enable`. Optionally add a `hash-mode` (round-robin by default). Load balancing can also be enabled in a manual rule, which then has no SLA targets.\n\n* **set mode load-balance**: legacy syntax from older releases.\n* **Best Quality (priority) + hash-mode**: Best Quality picks a single member.\n* **load-balance-mode usage-based**: this controls the implicit rule, not an explicit rule.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-044",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. On wan1, server 198.51.100.53 stops answering probes, while 192.0.2.53 keeps answering. What state does the health check report for wan1?",
    "exhibit": "FGT-Branch # show system sdwan\n    ...\n    config health-check\n        edit \"DNS_SLA\"\n            set server \"198.51.100.53\" \"192.0.2.53\"\n            set protocol dns\n            set members 1 2\n        next\n    end",
    "options": [
      "Alive, because a member is declared dead only when both servers fail",
      "Dead, because any failed server marks the member dead",
      "Dead after failtime probes, but its static routes stay installed",
      "Alive for the first server and dead for the second, reported as two separate entries"
    ],
    "answer": [
      0
    ],
    "explanation": "A health check can define up to **two servers**, and **both must fail** before the member is considered dead. That avoids declaring a link down because one remote server failed. The member stays alive and keeps forwarding, using the server that still answers for measurements.\n\n* **Any failed server**: this is the opposite of the documented behaviour.\n* **Dead but routes stay**: the member isn't dead. And when a member *is* dead, `update-static-route` (enabled by default) withdraws its routes.\n* **Separate entries**: the output shows one state per member.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-045",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Why is there no default route through wan2?",
    "exhibit": "FGT-Branch # diagnose sys sdwan health-check ISP_SLA\nHealth Check(ISP_SLA):\nSeq(1 wan1): state(alive), packet-loss(0.000%) latency(11.920), jitter(0.403), mos(4.404), bandwidth-up(98800), bandwidth-dw(97640), bandwidth-bi(196440) sla_map=0x1\nSeq(2 wan2): state(dead), packet-loss(100.000%), sla_map=0x0\n\nFGT-Branch # get router info routing-table all\n...\nRouting table for VRF=0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, wan1\nC       10.1.1.0/24 is directly connected, port3\nC       198.51.100.0/24 is directly connected, wan2\nC       203.0.113.0/24 is directly connected, wan1",
    "options": [
      "The health check marked wan2 dead, and with update-static-route enabled (the default) its static route was withdrawn.",
      "wan2 is link-down, so its connected and static routes were removed.",
      "The default load-balance-mode installs only one default route.",
      "wan2's route has a higher distance and appears only in the routing database."
    ],
    "answer": [
      0
    ],
    "explanation": "wan2 is `state(dead)` with 100% loss. A performance SLA with `update-static-route enable` (the default) **withdraws the static routes** of a dead member, so only wan1's default route remains. When probes recover for `recoverytime` intervals, the route comes back.\n\n* **Link-down**: wan2's connected route 198.51.100.0/24 is still present, so the interface is up. The upstream path is what failed.\n* **load-balance-mode**: it controls distribution. It doesn't limit routes.\n* **Higher distance**: SD-WAN member routes share the zone route's distance.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-046",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "A Lowest Cost (SLA) rule has load balancing disabled. Which two things does the rule evaluate before it falls back to the order of priority-members? (Choose two.)",
    "options": [
      "Whether each member meets the SLA target referenced by the rule",
      "Each member's cost value",
      "Each member's weight value",
      "Each member's volume-ratio value",
      "Each member's estimated-upstream-bandwidth value"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Lowest Cost (SLA) prefers members that **meet the SLA**, then the **lowest cost**. Only members tied on both are ordered by `priority-members`.\n\n`weight` and `volume-ratio` feed the implicit rule's weight-based and volume modes. Estimated bandwidth matters for bandwidth hash modes and Best Quality bandwidth factors, not for a plain Lowest Cost rule.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-047",
    "topic": "4.2",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator tries to add port2 as an SD-WAN member, but FortiOS rejects it because port2 is referenced by firewall policy 7 and static route 3. What should the administrator do?",
    "options": [
      "Remove or change the references to port2, add port2 as a member, then recreate the policy and route using the SD-WAN zone.",
      "Rename port2 so that the existing references no longer apply.",
      "Enable set allow-references enable under config system sdwan.",
      "Add port2 to the zone first. FortiOS converts the existing references automatically."
    ],
    "answer": [
      0
    ],
    "explanation": "An interface already referenced by policies or routes can't become an SD-WAN member. Delete or edit those references first. After adding the member, write the policy and route against the **zone**. FortiOS doesn't migrate references automatically, there is no `allow-references` option, and renaming a physical port isn't possible.",
    "lesson": "4.2-sdwan-members-sla"
  },
  {
    "id": "d4-048",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "In FortiOS 8.0, what does the SD-WAN member setting duplication-threshold-bibandwidth control?",
    "options": [
      "Packet duplication on that member stops when its measured bidirectional bandwidth exceeds the threshold, and resumes when usage falls below it.",
      "The member is marked out of SLA when its bandwidth exceeds the threshold.",
      "New sessions spill over to the next member when the threshold is exceeded.",
      "The member's monthly volume quota, in gigabytes."
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS 8.0 adds bandwidth checks for SD-WAN **packet duplication**. Below `duplication-threshold-upbandwidth`, `-dwbandwidth` or `-bibandwidth`, duplication runs. Above it, duplication stops, so the duplicate copies don't saturate the link. `duplication-threshold-bandwidth {overlay | underlay}` chooses whether the overlay's or the underlay's usage is measured.\n\n* **Out of SLA**: SLA state comes from health-check latency, jitter and loss.\n* **Spillover**: that uses `spillover-threshold`.\n* **Monthly quota**: that is `quota-limit`.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-049",
    "topic": "4.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which diagnose command lists the IPv4 SD-WAN rules with each rule's members in their current order of preference and their alive/SLA state? (Enter the command.)",
    "answer": [
      "diagnose sys sdwan service4",
      "diagnose sys sdwan service",
      "diag sys sdwan service4",
      "diag sys sdwan service"
    ],
    "explanation": "`diagnose sys sdwan service4 [id]` (or `service` for all rules) shows each rule's mode, members in preference order with `alive`/`dead`, `sla(0x…)` and `selected` flags, plus the matching addresses. Compare it with `diagnose sys sdwan health-check` and `diagnose sys sdwan member`.",
    "lesson": "4.2-sdwan-rules-steering"
  },
  {
    "id": "d4-050",
    "topic": "4.2",
    "type": "single",
    "difficulty": 1,
    "stem": "Which statement describes the SD-WAN implicit rule?",
    "options": [
      "When no SD-WAN rule matches, traffic follows the routing table, and sessions are spread across SD-WAN members by load-balance-mode.",
      "When no SD-WAN rule matches, the traffic is dropped.",
      "When no SD-WAN rule matches, the member with the best health-check latency is used.",
      "The implicit rule is evaluated before all other SD-WAN rules to catch management traffic."
    ],
    "answer": [
      0
    ],
    "explanation": "The implicit rule is the **last** entry, used when no explicit rule matches. It is ordinary FIB routing. The SD-WAN zone route is an ECMP set across member gateways, distributed by `load-balance-mode` (default `source-ip-based`). It doesn't drop traffic or use health-check quality, and it never comes first.",
    "lesson": "4.2-sdwan-rules-steering"
  }
];
