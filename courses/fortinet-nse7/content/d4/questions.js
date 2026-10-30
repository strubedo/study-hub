// Domain 4 — Rules and routing. Original questions for FortiOS 7.6 (generated data).
export default [
  {
    "id": "d4-001",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Hub and the Cisco router R1 share a 100 Mbps segment and both run OSPF with default settings. Why do the two routers report different costs for the same link?",
    "exhibit": "FGT-Hub # get router info ospf interface port4\nport4 is up, line protocol is up\n  Internet Address 10.0.4.254/24, Area 0.0.0.0, MTU 1500\n  Process ID 0, VRF 0, Router ID 172.16.0.254, Network Type BROADCAST, Cost: 10\n\nR1# show ip ospf interface GigabitEthernet0/1 | include Process ID\n  Process ID 1, Router ID 10.255.0.1, Network Type BROADCAST, Cost: 1",
    "options": [
      "FortiOS uses a default reference bandwidth of 1000 Mbps, while IOS uses 100 Mbps",
      "FortiOS adds the default-metric of 10 to every interface cost",
      "FortiOS uses an interface cost of 0, which is displayed as 10 when auto-cost is disabled",
      "IOS divides the reference bandwidth by the interface MTU instead of the speed"
    ],
    "answer": [
      0
    ],
    "explanation": "**Reference bandwidth.** FortiOS `auto-cost-ref-bandwidth` defaults to **1000** Mbps, so a 100 Mbps link costs 1000/100 = 10. IOS uses 100 Mbps by default, so the same link costs 1. Set the same reference bandwidth on every router (or explicit costs) in a mixed network.\n\n* **default-metric 10**: that value applies to redistributed external routes, not to interface costs.\n* **Cost 0 shown as 10**: `cost 0` on an `ospf-interface` means *auto-cost*; the 10 here is the auto-cost result.\n* **MTU**: OSPF cost is derived from bandwidth, never from MTU, on both platforms.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-002",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The neighbor on the IPsec tunnel never reaches Full. Hellos are received in both directions. What is the most likely cause?",
    "exhibit": "FGT-Spoke1 # get router info ospf neighbor\nOSPF process 0, VRF 0:\nNeighbor ID     Pri   State           Dead Time   Address         Interface\n172.16.0.254      1   ExStart/ -      00:00:35    10.10.1.254     HUB1-VPN1",
    "options": [
      "The two ends of the tunnel advertise different interface MTUs in their Database Description packets",
      "The area IDs on the two ends of the tunnel are different",
      "The hello and dead intervals on the two ends of the tunnel are different",
      "OSPF authentication is configured on only one end of the tunnel"
    ],
    "answer": [
      0
    ],
    "explanation": "A neighbor that is listed and stuck in **ExStart** (or Exchange) has passed hello checks and is failing the Database Description exchange. The classic cause is an **MTU mismatch**. Fix the MTU or set `mtu-ignore enable` on the `ospf-interface`.\n\n* **Area mismatch**, **hello/dead mismatch** and **authentication mismatch** are all checked on hello packets. The routers would not list each other as neighbors at all (or not beyond Init), so you would not see ExStart.\n* `Full/ -` vs `ExStart/ -`: the dash means no DR/BDR, consistent with a point-to-point network type on the tunnel.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-003",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. On the ASBR, the static redistribution entry contains only `set status enable`. Why does FGT-Spoke1 show a metric of 10 for the redistributed route?",
    "exhibit": "FGT-Spoke1 # get router info routing-table ospf\nRouting table for VRF=0\nO       10.0.1.0/24 [110/2] via 10.1.10.254, port3, 01:12:40\nO E2    10.50.0.0/16 [110/10] via 10.1.10.254, port3, 00:41:05",
    "options": [
      "The ASBR copied the static route's administrative distance of 10 into the OSPF metric",
      "The ASBR used the OSPF default-metric of 10 because no metric was set on the redistribute entry or in a route map",
      "FGT-Spoke1 added its own interface cost to an external metric of 0",
      "E2 routes always carry the cost to the ASBR, which is 10 here"
    ],
    "answer": [
      1
    ],
    "explanation": "With `metric 0` (unset) on `config redistribute \"static\"` and no route map, FortiOS uses `default-metric`, which defaults to **10**, and the default `metric-type 2` (E2). That is different from IOS, where most redistributed routes default to metric 20.\n\n* **Distance copied**: administrative distance is never copied into an OSPF metric.\n* **Own interface cost added**: that happens for **E1** routes; an E2 metric is the external metric only.\n* **Cost to the ASBR**: an E2 metric never includes the internal cost to the ASBR (that cost only breaks ties between equal E2 routes), so the 10 can't be a cost to the ASBR.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-004",
    "topic": "4.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about FortiOS 7.6 OSPF defaults are correct? (Choose two.)",
    "options": [
      "The reference bandwidth used for auto-cost is 1000 Mbps",
      "An `ospf-interface` entry for an IPsec tunnel defaults to network type broadcast",
      "The distance for OSPF external routes defaults to 170",
      "An `ospf-interface` cost of 0 makes the interface passive",
      "`default-information-originate` is enabled, so an ASBR always injects a default route",
      "`mtu-ignore` is enabled by default on tunnel interfaces"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **1000 Mbps reference bandwidth**: correct (`auto-cost-ref-bandwidth 1000`).\n* **broadcast network type**: correct. The `network-type` default of an `ospf-interface` entry is broadcast whatever the interface type, so set `point-to-point` yourself on tunnel entries. (A tunnel with no `ospf-interface` entry at all doesn't elect a DR: Fortinet's ADVPN-with-OSPF example, which has none, shows its tunnel neighbors as `Full/ -`.)\n* **170**: wrong. `distance`, `distance-intra-area`, `distance-inter-area` and `distance-external` all default to 110.\n* **cost 0 = passive**: wrong. Cost 0 means auto-cost; passive interfaces are listed with `set passive-interface`.\n* **default-information-originate**: wrong. It defaults to `disable`.\n* **mtu-ignore**: wrong. It defaults to `disable` on every interface.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-005",
    "topic": "4.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which FortiOS CLI command displays the OSPF neighbor table, including neighbor state, dead time and interface?",
    "answer": [
      "get router info ospf neighbor",
      "get router info ospf neighbors"
    ],
    "explanation": "`get router info ospf neighbor` lists each neighbor's router ID, priority, state (for example `Full/DR`), dead time, address and interface, under a header such as `OSPF process 0, VRF 0:`. Related commands: `get router info ospf interface`, `get router info ospf status`, `get router info ospf database ...`.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-006",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The core switch peers with FGT-Hub over OSPF but never receives a default route from it. What should the administrator change?",
    "exhibit": "FGT-Hub # show router ospf\nconfig router ospf\n    set default-information-originate enable\n    set router-id 172.16.0.254\n    config area\n        edit 0.0.0.0\n        next\n    end\n    config network\n        edit 1\n            set prefix 10.0.1.0 255.255.255.0\n        next\n    end\nend\n\nFGT-Hub # get router info routing-table all | grep 0.0.0.0/0\nFGT-Hub #",
    "options": [
      "Set `default-information-metric-type 1`, because type 2 default routes are not flooded into area 0",
      "Enable `config redistribute \"static\"`, because the default route is originated only as part of static redistribution",
      "Add a default route to FGT-Hub's routing table, or set `default-information-originate always`",
      "Configure area 0.0.0.0 as an NSSA so that it accepts a default route"
    ],
    "answer": [
      2
    ],
    "explanation": "With `default-information-originate enable`, FortiOS advertises a default route only if one exists in its routing table, just like `default-information originate` without `always` on IOS. The `grep` shows no default route on FGT-Hub, so nothing is injected. Add one (static, BGP ...) or use `always`.\n\n* **Metric type**: E1 vs E2 changes how the metric is calculated, not whether the LSA is flooded.\n* **Redistribute static**: default route origination is a separate setting; it doesn't depend on static redistribution.\n* **NSSA**: area 0 can't be an NSSA, and the area type has nothing to do with a missing default route.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-007",
    "topic": "4.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Router R1 advertises three external routes into area 0: 10.50.0.0/16, 10.50.8.0/24 and 10.60.0.0/16. Which statement about FGT-Hub is correct?",
    "exhibit": "FGT-Hub # show router access-list AL-NO-LAB\nconfig router access-list\n    edit \"AL-NO-LAB\"\n        config rule\n            edit 1\n                set action deny\n                set prefix 10.50.0.0 255.255.0.0\n            next\n            edit 2\n                set prefix any\n            next\n        end\n    next\nend\n\nFGT-Hub # show router ospf | grep distribute\n    set distribute-list-in \"AL-NO-LAB\"",
    "options": [
      "FGT-Hub installs only 10.60.0.0/16 and still floods all three LSAs to its other OSPF neighbors",
      "FGT-Hub installs 10.50.8.0/24 and 10.60.0.0/16, because access list rules match the exact prefix by default",
      "FGT-Hub installs only 10.60.0.0/16 and stops flooding the two 10.50 LSAs to its other neighbors",
      "FGT-Hub installs no external routes, because rule 2 has no action configured"
    ],
    "answer": [
      0
    ],
    "explanation": "**Access list semantics**: `exact-match` defaults to **disable**, so rule 1 matches 10.50.0.0/16 **and every more specific prefix** inside it, including 10.50.8.0/24. Rule 2 (`prefix any`, default action **permit**) allows the rest, so only 10.60.0.0/16 is installed.\n\n**distribute-list-in** filters what OSPF installs in this FortiGate's routing table. OSPF is link state: the LSAs stay in the LSDB and are flooded normally, so other routers still learn all three routes.\n\n* **Exact prefix by default**: wrong, that's `exact-match enable`.\n* **Stops flooding**: wrong, filtering inside an area never removes LSAs.\n* **No action on rule 2**: the default action of an access-list rule is permit.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-008",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which prefix is permitted by the prefix list?",
    "exhibit": "config router prefix-list\n    edit \"PL-LAN-24S\"\n        config rule\n            edit 1\n                set prefix 10.1.0.0 255.255.0.0\n                set ge 24\n                set le 24\n            next\n        end\n    next\nend",
    "options": [
      "10.1.0.0/16",
      "10.1.7.0/24",
      "10.1.7.128/25",
      "10.2.7.0/24"
    ],
    "answer": [
      1
    ],
    "explanation": "The rule matches prefixes **inside 10.1.0.0/16** whose length is **at least 24 and at most 24**, i.e. only /24s inside 10.1.0.0/16. The semantics are the same as IOS `ip prefix-list ... 10.1.0.0/16 ge 24 le 24`.\n\n* **10.1.0.0/16**: inside the range but length 16, outside ge 24.\n* **10.1.7.128/25**: length 25, above le 24.\n* **10.2.7.0/24**: correct length but outside 10.1.0.0/16.\n* Anything not matched is denied by the implicit deny.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-009",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Spoke1 has three connected networks: 10.1.1.0/24 on port3, 172.16.0.1/32 on Branch-Lo and 203.0.113.0/24 on port1. Which result does this configuration produce?",
    "exhibit": "config router prefix-list\n    edit \"PL-LAN\"\n        config rule\n            edit 1\n                set prefix 10.1.0.0 255.255.0.0\n                set ge 24\n                set le 24\n            next\n        end\n    next\nend\nconfig router route-map\n    edit \"RM-CONN\"\n        config rule\n            edit 10\n                set match-ip-address \"PL-LAN\"\n                set set-metric 50\n            next\n        end\n    next\nend\nconfig router ospf\n    config redistribute \"connected\"\n        set status enable\n        set routemap \"RM-CONN\"\n    end\nend",
    "options": [
      "Only 10.1.1.0/24 is redistributed, as an E2 route with metric 50",
      "10.1.1.0/24 is redistributed with metric 50; the other two networks are redistributed with the default metric of 10",
      "All three networks are redistributed with metric 50, because the route map only sets attributes",
      "Nothing is redistributed, because route maps can't match connected routes with a prefix list"
    ],
    "answer": [
      0
    ],
    "explanation": "A route map is an ordered list with an **implicit deny** at the end. Rule 10 matches only /24s inside 10.1.0.0/16 (10.1.1.0/24) and sets metric 50. The loopback /32 and the WAN /24 match no rule and are **not** redistributed. The metric type stays at the redistribute entry's default, **2** (E2), because the route map doesn't set `set-metric-type`.\n\n* **Default metric for the others**: a route map on the redistribute entry filters as well as modifies; unmatched routes are dropped.\n* **All three**: same reason.\n* **Can't match connected**: `match-ip-address` accepts an access list or a prefix list and works for any redistributed source.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-010",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Hub forms OSPF adjacencies on its LAN, but no OSPF neighbor ever appears on the site-to-site tunnel to FGT-Spoke1. FGT-Hub's side of the tunnel is configured correctly. What is the cause on FGT-Spoke1?",
    "exhibit": "FGT-Spoke1 # show system interface HUB1-VPN1\nconfig system interface\n    edit \"HUB1-VPN1\"\n        set vdom \"root\"\n        set type tunnel\n        set interface \"port1\"\n    next\nend\n\nFGT-Spoke1 # show router ospf\nconfig router ospf\n    set router-id 172.16.0.1\n    config area\n        edit 0.0.0.0\n        next\n    end\n    config ospf-interface\n        edit \"to-hub\"\n            set interface \"HUB1-VPN1\"\n            set network-type point-to-point\n            set cost 10\n        next\n    end\n    config network\n        edit 1\n            set prefix 10.10.1.0 255.255.255.0\n        next\n        edit 2\n            set prefix 10.1.1.0 255.255.255.0\n        next\n    end\nend",
    "options": [
      "The `ospf-interface` entry must be named after the interface it configures",
      "The tunnel interface has no IP address, so no interface on FGT-Spoke1 matches the 10.10.1.0/24 network prefix",
      "A point-to-point network type can't be used on IPsec interfaces",
      "OSPF over IPsec requires a firewall policy from the tunnel to the FortiGate itself"
    ],
    "answer": [
      1
    ],
    "explanation": "OSPF runs on interfaces whose **address falls inside a `config network` prefix**. `HUB1-VPN1` has no `set ip`/`set remote-ip`, so it has no address in 10.10.1.0/24 and OSPF never sends hellos on it. The `ospf-interface` entry only tunes an interface that OSPF already runs on. Fix: `set ip 10.10.1.1 255.255.255.255` and `set remote-ip 10.10.1.254 255.255.255.0` (or a /32).\n\n* **Entry name**: `ospf-interface` entries can have any name; `set interface` binds them.\n* **Point-to-point on IPsec**: it is the recommended network type for tunnels (Fortinet's OSPF-over-IPsec example uses it).\n* **Firewall policy**: OSPF to the FortiGate is local-in traffic; no firewall policy is needed for the adjacency.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-011",
    "topic": "4.1",
    "type": "order",
    "difficulty": 1,
    "stem": "Place the OSPF neighbor states in the order a FortiGate goes through when it forms a full adjacency with a new neighbor on a point-to-point tunnel.",
    "items": [
      "Down",
      "Init",
      "2-Way",
      "ExStart",
      "Exchange",
      "Loading",
      "Full"
    ],
    "explanation": "FortiOS uses the standard RFC 2328 neighbor state machine: **Down → Init** (hello received) **→ 2-Way** (own router ID seen in the neighbor's hello) **→ ExStart** (master/slave and DD sequence negotiated) **→ Exchange** (DD packets) **→ Loading** (LS requests/updates) **→ Full**. A neighbor stuck in ExStart/Exchange usually points to an MTU mismatch.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-012",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "FGT-Spoke1 has two route-based IPsec tunnels to FGT-Hub, HUB1-VPN1 over ISP1 and HUB1-VPN2 over ISP2, and runs OSPF over both. HUB1-VPN1 must carry all traffic while it is up, and HUB1-VPN2 must take over automatically. What should the administrator configure?",
    "options": [
      "`set priority 255` on the `ospf-interface` for HUB1-VPN1 and `set priority 0` on the one for HUB1-VPN2",
      "A lower `cost` on the `ospf-interface` for HUB1-VPN1 than on the one for HUB1-VPN2, on both FortiGates",
      "`set ecmp-max-paths 1` under `config system settings`, so only the first tunnel is used",
      "`set distance 100` under `config router ospf` on FGT-Spoke1"
    ],
    "answer": [
      1
    ],
    "explanation": "OSPF chooses paths by **cost**. Fortinet's \"OSPF with IPsec VPN for network redundancy\" example sets cost 10 on the primary tunnel and 20 on the secondary; equal costs would give ECMP. Set it on both FortiGates so traffic is symmetric in both directions.\n\n* **priority**: interface priority only affects DR/BDR election (and there is none on point-to-point links).\n* **ecmp-max-paths 1**: disables ECMP but doesn't define which equal-cost path wins, so the result is not deterministic.\n* **distance**: changes OSPF's administrative distance against other protocols, not the choice between two OSPF paths.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-013",
    "topic": "4.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Users at 10.1.1.20 and 10.1.1.21 open many sessions to servers in 10.0.1.0/24. SD-WAN is not enabled on FGT-Spoke1. Which statement describes how FGT-Spoke1 uses the two tunnels?",
    "exhibit": "FGT-Spoke1 # get router info routing-table ospf\nRouting table for VRF=0\nO       10.0.1.0/24 [110/11] via 10.10.1.254, HUB1-VPN1, 00:20:13\n                    [110/11] via 10.10.2.254, HUB1-VPN2, 00:20:13\n\nFGT-Spoke1 # get system settings | grep ecmp\nv4-ecmp-mode        : source-ip-based\necmp-max-paths      : 255",
    "options": [
      "Each session is sent over the tunnel with the lowest current latency",
      "All sessions from one source IP use the same tunnel; different source IPs can use different tunnels",
      "Sessions alternate between the two tunnels in round-robin order, regardless of source",
      "Only HUB1-VPN1 is used, because OSPF installs the first path learned and keeps the second as backup"
    ],
    "answer": [
      1
    ],
    "explanation": "Both OSPF paths have the same prefix, distance (110) and metric (11), so both are installed as **ECMP** routes (well below `ecmp-max-paths 255`). The hash is `v4-ecmp-mode source-ip-based` (the default): every session from the same source IP takes the same path.\n\n* **Lowest latency**: that's SD-WAN best quality behaviour, not routing-table ECMP.\n* **Round-robin**: not one of the `v4-ecmp-mode` algorithms (round-robin is an SD-WAN rule `hash-mode`).\n* **First path only**: both next hops are in the routing table; that is ECMP.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-014",
    "topic": "4.1",
    "type": "match",
    "difficulty": 1,
    "stem": "Match each FortiOS routing object to what it matches.",
    "pairs": [
      [
        "Access list",
        "A prefix (and, unless exact-match is enabled, everything more specific), or a Cisco-style wildcard"
      ],
      [
        "Prefix list",
        "A prefix with optional ge and le prefix-length bounds"
      ],
      [
        "Route map",
        "Ordered rules that combine match conditions with set actions"
      ],
      [
        "AS path list",
        "A regular expression applied to the BGP AS_PATH attribute"
      ],
      [
        "Community list",
        "Standard or expanded BGP community values"
      ]
    ],
    "explanation": "All five live under `config router` and are shared by OSPF, BGP and RIP. Access lists and prefix lists are referenced by distribute lists, BGP `distribute-list-*` / `prefix-list-*` and route-map `match-ip-address`; AS path lists by `filter-list-*` and `match-as-path`; community lists by `match-community`. Route maps are used for redistribution, BGP `route-map-in/out` and network entries.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-015",
    "topic": "4.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "An administrator is designing a dial-up hub with dynamic spokes and is comparing the FortiOS 7.6 example configurations for ADVPN with OSPF and ADVPN with BGP. Which two statements are correct? (Choose two.)",
    "options": [
      "The ADVPN with OSPF example requires `net-device enable` on the hub phase 1",
      "The ADVPN with BGP example requires `net-device disable` on the hub phase 1",
      "With `net-device disable`, the hub creates one kernel interface per dial-up tunnel",
      "OSPF over a dial-up hub requires `mode-cfg enable` so that OSPF can learn the spoke addresses",
      "With OSPF, each spoke learns other spokes' LAN routes without receiving their LSAs"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **OSPF example, net-device enable**: correct. The 7.6 \"ADVPN with OSPF as the routing protocol\" example states that the hub must run `net-device enable`.\n* **BGP example, net-device disable**: correct. With `net-device disable` each dynamic tunnel gets a tunnel ID (an IP address) that is used as the gateway of routes to it, which is what the BGP example relies on.\n* **One kernel interface per tunnel with net-device disable**: wrong, that's what `net-device enable` does.\n* **mode-cfg**: not an OSPF requirement; tunnel interface addressing can be static.\n* **No LSAs**: within an OSPF area every router receives every LSA, which is exactly why OSPF scales poorly over many spokes.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-016",
    "topic": "4.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which `ospf-interface` option lets a FortiGate form an OSPF adjacency even though the neighbor reports a different interface MTU? Give the option name.",
    "answer": [
      "mtu-ignore",
      "set mtu-ignore enable"
    ],
    "explanation": "`set mtu-ignore enable` under `config router ospf` → `config ospf-interface` → `edit <name>` makes the FortiGate ignore the MTU field in received DD packets (default `disable`). Fixing the MTU itself is usually better; on tunnels the MTU is often lower than on the LAN side.",
    "lesson": "4.1-ospf-fortigate"
  },
  {
    "id": "d4-017",
    "topic": "4.1",
    "type": "single",
    "difficulty": 3,
    "stem": "A data-center FortiGate peers with the core switches over OSPF area 0 and with 400 SD-WAN spokes over iBGP. The core must reach every branch through the FortiGate, but its OSPF database must stay small. Which design meets the requirement?",
    "options": [
      "Redistribute BGP into OSPF and set `distribute-list-in` on the FortiGate to block the branch prefixes",
      "Don't redistribute BGP; set `default-information-originate` on the FortiGate (`enable` if it has a default route, `always` if not)",
      "Redistribute BGP into OSPF with `metric-type 1` so the core prefers the FortiGate",
      "Configure area 0.0.0.0 as a stub area on the FortiGate only"
    ],
    "answer": [
      1
    ],
    "explanation": "Injecting a single default route gives the core reachability to every branch through the FortiGate with **one** external LSA instead of 400. Use `always` if the FortiGate doesn't itself hold a default route (`enable` only advertises one that exists). A summary (`config summary-address` on the ASBR) is the alternative if the core needs a more specific route.\n\n* **distribute-list-in on the FortiGate**: it filters routes the FortiGate installs from OSPF; it doesn't stop its own redistributed LSAs from reaching the core.\n* **metric-type 1**: changes how the metric is computed, not how many LSAs exist.\n* **Stub on one side**: area type must match on both neighbors (the stub flag is checked in hellos), and the backbone can't be a stub area.",
    "lesson": "4.1-ospf-filtering-ipsec-ecmp"
  },
  {
    "id": "d4-018",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The eBGP session to the partner router never comes up. The partner's loopback 192.0.2.10 is reachable through a static route via a directly connected router, and TCP/179 is not filtered. What should the administrator change on FGT-Hub?",
    "exhibit": "FGT-Hub # get router info bgp summary\nVRF 0 BGP router identifier 172.16.0.254, local AS number 65000\nBGP table version is 9\n2 BGP AS-PATH entries\n0 BGP community entries\n\nNeighbor     V      AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd\n172.16.0.1   4   65000     812     830        9    0    0 06:44:10        1\n172.16.0.2   4   65000     805     819        9    0    0 06:43:58        1\n192.0.2.10   4   64520       0       0        0    0    0    never Idle\n\nTotal number of neighbors 3\n\nFGT-Hub # show router bgp | grep -A4 192.0.2.10\n        edit \"192.0.2.10\"\n            set remote-as 64520\n            set update-source \"BGP-Lo\"\n        next",
    "options": [
      "Enable `ebgp-enforce-multihop` on the neighbor, because the eBGP peer is not directly connected",
      "Add the partner to a `neighbor-range`, because eBGP neighbors must be dynamic",
      "Set `send-community disable`, because the partner rejects communities in OPEN messages",
      "Lower the `holdtime-timer`, because the session times out before it is established"
    ],
    "answer": [
      0
    ],
    "explanation": "The peer address is a **loopback behind another router**, so the session is multihop eBGP. Without `ebgp-enforce-multihop enable` (default disable), FortiOS doesn't start the session; the Fortinet troubleshooting table explains an **Idle** state with exactly this example. Keep `update-source` so the session is sourced from the local loopback; the partner needs the matching configuration.\n\n* **neighbor-range**: dynamic neighbors are optional and unrelated to the multihop check.\n* **send-community**: communities travel in UPDATE messages, not OPEN, and wouldn't prevent the session from starting.\n* **holdtime-timer**: the session never reached OpenSent, so the hold timer is irrelevant.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-019",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "A Cisco engineer is reviewing FortiOS 7.6 BGP neighbor behaviour with default settings. Which two defaults differ from Cisco IOS defaults? (Choose two.)",
    "options": [
      "Standard and extended communities are sent to every neighbor",
      "The minimum advertisement interval is 30 seconds for iBGP neighbors as well as eBGP neighbors",
      "iBGP routes have an administrative distance of 200",
      "Keepalive and hold timers are 60 and 180 seconds",
      "Only one best path is installed per prefix",
      "Synchronization is disabled"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **Communities sent**: FortiOS neighbor `send-community` defaults to **both**; `get router info bgp neighbors` shows \"Community attribute sent to this neighbor (both)\". IOS sends no communities unless `neighbor send-community` is configured.\n* **30 s for iBGP**: FortiOS `advertisement-interval` defaults to 30 s for every neighbor. IOS uses 30 s for eBGP and 0 for iBGP.\n* **iBGP distance 200**, **60/180 timers**, **single best path** (`ibgp-multipath`/`ebgp-multipath` disabled vs IOS `maximum-paths 1`) and **synchronization disabled** are the same on both platforms.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-020",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Spoke1 peers with both hubs on their loopbacks. Both hubs advertise the shared data-center prefix 10.0.1.0/24, but the routing table shows only one next hop. Which setting on FGT-Spoke1 installs both paths?",
    "exhibit": "FGT-Spoke1 # get router info bgp network 10.0.1.0\nVRF 0 BGP routing table entry for 10.0.1.0/24\nPaths: (2 available, best #1, table Default-IP-Routing-Table)\n  Not advertised to any peer\n  Original VRF 0\n  Local\n    172.16.0.254 from 172.16.0.254 (172.16.0.254)\n      Origin IGP metric 0, localpref 100, valid, internal, best\n      Last update: Wed Oct 28 08:14:02 2026\n  Original VRF 0\n  Local\n    172.16.1.254 from 172.16.1.254 (172.16.1.254)\n      Origin IGP metric 0, localpref 100, valid, internal\n      Last update: Wed Oct 28 08:14:05 2026\n\nFGT-Spoke1 # get router info routing-table bgp | grep -A1 10.0.1.0\nB       10.0.1.0/24 [200/0] via 172.16.0.254 (recursive via HUB1-VPN1 tunnel 192.0.2.101), 01:02:11",
    "options": [
      "`set ebgp-multipath enable`",
      "`set ibgp-multipath enable`",
      "`set recursive-next-hop enable`",
      "`set ecmp-max-paths 2` under `config system settings`"
    ],
    "answer": [
      1
    ],
    "explanation": "Both paths are **internal** (iBGP) and tie on every attribute up to the IGP metric, so they are multipath candidates. Without multipath, the lowest-router-ID tie-breaker alone picks FGT-Hub1's path (172.16.0.254). FortiOS installs only the best path unless **`ibgp-multipath enable`** is set (default disable).\n\n* **ebgp-multipath**: applies to eBGP paths only.\n* **recursive-next-hop**: lets BGP routes resolve BGP next hops; the next hops here already resolve (the route is installed).\n* **ecmp-max-paths**: defaults to 255 already; it caps ECMP but doesn't make BGP select more than one path.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-021",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The ISP reports that it receives communities from FGT-Hub that the network team never meant to send. No community-related setting was configured on this neighbor. What explains it, and how can it be stopped?",
    "exhibit": "FGT-Hub # get router info bgp neighbors 198.51.100.9\nVRF 0 neighbor table:\nBGP neighbor is 198.51.100.9, remote AS 64512, local AS 65000, external link\n  BGP version 4, remote router ID 198.51.100.9\n  BGP state = Established, up for 2d03h\n  ...\n For address family: IPv4 Unicast\n  BGP table version 41, neighbor version 41\n  Community attribute sent to this neighbor (both)\n  Outbound path policy configured\n  Route map for outgoing advertisements is *RM-TO-ISP\n  0 accepted prefixes, 0 prefixes in rib\n  2 announced prefixes",
    "options": [
      "Routes inherit communities from the outbound route map's `set-community-additive` setting; remove the route map",
      "FortiOS sends standard and extended communities by default; set `send-community disable` on the neighbor or strip them in RM-TO-ISP",
      "eBGP neighbors always receive the `no-export` community; set `remove-private-as enable`",
      "The ISP has `soft-reconfiguration` enabled, which makes it display communities that were never sent"
    ],
    "answer": [
      1
    ],
    "explanation": "The FortiOS neighbor default is **`send-community both`**, confirmed by \"Community attribute sent to this neighbor (both)\". Unlike IOS, communities attached to the routes (for example by internal route maps) leave the AS unless you set `send-community disable` (or `standard`/`extended` to limit them) or delete them with `set-community-delete` in the outbound route map.\n\n* **set-community-additive**: only controls whether a route map appends or replaces when it *sets* communities.\n* **no-export always added**: no such default.\n* **soft-reconfiguration on the ISP**: stores received routes, it doesn't invent attributes.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-022",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Spoke1 is supposed to advertise its server VLAN 10.1.9.0/24 to the hub, but the hub never receives it. What is the cause?",
    "exhibit": "FGT-Spoke1 # show router bgp | grep -A10 \"config network\"\n    config network\n        edit 1\n            set prefix 10.1.1.0 255.255.255.0\n        next\n        edit 2\n            set prefix 10.1.9.0 255.255.255.0\n        next\n    end\n\nFGT-Spoke1 # get router info routing-table all | grep 10.1.\nC       10.1.1.0/24 is directly connected, port3\nC       10.1.9.0/25 is directly connected, port4",
    "options": [
      "BGP `config network` entries are advertised only if a matching route exists, and only 10.1.9.0/25 is in the routing table",
      "A spoke can advertise only one `config network` entry per neighbor",
      "Connected routes must be redistributed; `config network` works only for static routes",
      "The hub's neighbor-range doesn't include 10.1.9.0/24"
    ],
    "answer": [
      0
    ],
    "explanation": "`network-import-check` is **enabled** by default, so a `config network` prefix is advertised only if the **same prefix** exists in the routing table, like the IOS `network` statement. Port4 is configured as a /25, so 10.1.9.0/24 has no matching route. Fix the interface mask, add a matching route (for example a blackhole /24), set `network-import-check disable` on that entry, or advertise the /25.\n\n* **One entry per neighbor**: there's no such limit.\n* **Only static**: `config network` works with any route type in the routing table, including connected.\n* **neighbor-range**: defines which peers may connect, not which prefixes they may advertise.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-023",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Spoke1 advertises 10.1.1.0/24 with community 65000:500. After the hub applies RM-FROM-SPOKES inbound, the route carries only 65000:10. What explains this?",
    "exhibit": "FGT-Hub # show router route-map RM-FROM-SPOKES\nconfig router route-map\n    edit \"RM-FROM-SPOKES\"\n        config rule\n            edit 10\n                set match-ip-address \"PL-BRANCH-LANS\"\n                set set-community \"65000:10\"\n            next\n        end\n    next\nend\n\nFGT-Hub # get router info bgp network 10.1.1.0 | grep Community\n      Community: 65000:10",
    "options": [
      "The hub never receives communities from iBGP peers unless `soft-reconfiguration` is enabled",
      "`set-community` replaces the existing communities unless `set-community-additive` is enabled",
      "Community values above 65000:100 are reserved and dropped automatically",
      "The prefix list strips all communities that don't match it"
    ],
    "answer": [
      1
    ],
    "explanation": "By default a route map's `set-community` **replaces** the route's community list. To keep 65000:500 and add 65000:10, enable `set set-community-additive enable` in the same rule. (The spoke did send the community: `send-community both` is the default.)\n\n* **soft-reconfiguration**: only stores a copy of received routes; it doesn't affect attributes.\n* **Reserved values**: no such rule. Only the well-known communities (no-export, no-advertise, local-AS, internet) have special meaning.\n* **Prefix list**: matches prefixes only; it never touches attributes.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-024",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-Hub has two eBGP paths to 10.200.0.0/16. Which path does it select as best, and why?",
    "exhibit": "FGT-Hub # get router info bgp network 10.200.0.0/16\nVRF 0 BGP routing table entry for 10.200.0.0/16\nPaths: (2 available, best #1, table Default-IP-Routing-Table)\n  Advertised to non peer-group peers:\n   172.16.0.1 172.16.0.2\n  Original VRF 0\n  64512 64600\n    198.51.100.9 from 198.51.100.9 (198.51.100.9)\n      Origin IGP metric 0, localpref 100, weight 200, valid, external, best\n      Last update: Wed Oct 28 07:55:31 2026\n  Original VRF 0\n  64513\n    192.0.2.9 from 192.0.2.9 (192.0.2.9)\n      Origin IGP metric 0, localpref 100, valid, external\n      Last update: Wed Oct 28 07:51:02 2026",
    "options": [
      "The path via 198.51.100.9, because a higher weight is compared before AS path length",
      "The path via 192.0.2.9, because its AS path is shorter; the output marks the wrong path",
      "The path via 198.51.100.9, because it is the newer path",
      "The path via 198.51.100.9, because its neighbor IP address is higher"
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS compares **weight first** (highest wins; it's local to the FortiGate and typically set with an inbound route map `set-weight`). The path via 198.51.100.9 has weight 200 against 0, so it wins before local preference, AS path length or anything else is considered, even though its AS path is longer.\n\n* **Shorter AS path**: AS path is step 4, after weight, local preference and locally originated.\n* **Newer path**: for eBGP, the *oldest* path is preferred, and only near the end of the list.\n* **Higher neighbor IP**: the last tie-breaker prefers the *lowest* neighbor address.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-025",
    "topic": "4.2",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the first six FortiOS BGP best-path selection criteria in the order they are evaluated.",
    "items": [
      "Highest weight",
      "Highest local preference",
      "Route originated by the local router",
      "Shortest AS path",
      "Lowest origin code (IGP, then EGP, then incomplete)",
      "Lowest MED"
    ],
    "explanation": "After discarding paths with AS loops or an invalid next hop, FortiOS evaluates: weight → local preference → locally originated → AS path length → origin → MED → eBGP over iBGP → closest IGP neighbor → oldest eBGP path → lowest router ID → lowest neighbor IP. This is the same relative order as Cisco IOS, which inserts a few extra steps (for example AIGP and cluster-list length).",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-026",
    "topic": "4.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "FGT-Hub learns Internet routes from an eBGP ISP and passes them to an iBGP peer that has no route to the ISP's next hop. Which neighbor option should be enabled on the iBGP neighbor so FGT-Hub advertises itself as the next hop? Give the option name.",
    "answer": [
      "next-hop-self",
      "set next-hop-self enable"
    ],
    "explanation": "iBGP doesn't change the next hop, so the iBGP peer sees the ISP's address. `set next-hop-self enable` on the iBGP neighbor (default disable) rewrites it to FGT-Hub's address, which the peer can reach. On a route reflector, `next-hop-self-rr` does the same for reflected routes.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-027",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Each spoke has three overlays to FGT-Hub1 and three overlays to FGT-Hub2. With a BGP on loopback design, how many BGP sessions does each spoke maintain?",
    "options": [
      "1",
      "2",
      "3",
      "6"
    ],
    "answer": [
      1
    ],
    "explanation": "With BGP on loopback, a spoke forms **one iBGP session per hub**, between its loopback and the hub's BGP loopback, however many overlays exist. Two hubs means **2** sessions. The routes then resolve recursively over every overlay that reaches the hub loopback.\n\n* **6** is the BGP-per-overlay count (one session per tunnel).\n* **3** would be per overlay to one hub.\n* **1** would require a single hub (or a single session to a shared address).",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-028",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The spokes use BGP on loopback and source their sessions from Branch-Lo (172.16.0.1, 172.16.0.2 ...). The IKE routes to the spoke loopbacks are present on FGT-Hub, but `get router info bgp summary` lists no spoke neighbors. What is the cause?",
    "exhibit": "FGT-Hub # show router bgp\nconfig router bgp\n    set as 65000\n    set router-id 172.16.0.254\n    set ibgp-multipath enable\n    config neighbor-group\n        edit \"EDGE\"\n            set remote-as 65000\n            set interface \"BGP-Lo\"\n            set update-source \"BGP-Lo\"\n            set route-reflector-client enable\n        next\n    end\n    config neighbor-range\n        edit 1\n            set prefix 10.10.0.0 255.255.0.0\n            set neighbor-group \"EDGE\"\n        next\n    end\nend",
    "options": [
      "The neighbor-range prefix covers the overlay subnets, not the spoke loopbacks the sessions come from",
      "Dynamic neighbors can't be route reflector clients",
      "The neighbor group needs `set passive enable` before it accepts sessions",
      "`ibgp-multipath` must be disabled on a route reflector"
    ],
    "answer": [
      0
    ],
    "explanation": "A neighbor range accepts a peer only if the session's **source address** is inside the range. The spokes peer from their loopbacks in 172.16.0.0/16, but the range is 10.10.0.0/16 (the overlay subnet, which would be right for BGP per overlay). Change the range to cover the spoke loopbacks, for example 172.16.0.0 255.255.255.0.\n\n* **RR clients**: neighbor groups support `route-reflector-client enable`; Fortinet's hub examples use exactly that.\n* **passive**: range peers are accepted without it; the hub waits for the spokes to connect.\n* **ibgp-multipath**: unrelated to accepting sessions, and commonly enabled on hubs.",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-029",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-Spoke1 receives 10.1.2.0/24 (Spoke2's LAN) from the hub route reflector with next hop 172.16.0.2, but the route is not in the routing table. Which change fixes it?",
    "exhibit": "FGT-Spoke1 # get router info routing-table details 172.16.0.2\nRouting table for VRF=0\nRouting entry for 172.16.0.0/24\n  Known via \"bgp\", distance 200, metric 0, best\n  Last update 00:12:41 ago\n  * 172.16.0.254 (recursive via HUB1-VPN1 tunnel 192.0.2.101)\n                 (recursive via HUB1-VPN2 tunnel 192.0.2.102)\n\nFGT-Spoke1 # show router bgp\nconfig router bgp\n    set as 65000\n    set router-id 172.16.0.1\n    set ibgp-multipath enable\n    config neighbor\n        edit \"172.16.0.254\"\n            set remote-as 65000\n            set interface \"Branch-Lo\"\n            set update-source \"Branch-Lo\"\n        next\n    end\nend",
    "options": [
      "`set recursive-next-hop enable` under `config router bgp`",
      "`set next-hop-self enable` on the neighbor 172.16.0.254",
      "`set ebgp-enforce-multihop enable` on the neighbor 172.16.0.254",
      "`set exchange-ip-addr4 172.16.0.2` on HUB1-VPN1"
    ],
    "answer": [
      0
    ],
    "explanation": "The next hop 172.16.0.2 is reachable **only through another BGP route** (the hub's loopback summary 172.16.0.0/24). By default (`recursive-next-hop disable`) BGP routes aren't used to resolve a BGP next hop, so 10.1.2.0/24 can't be installed. `recursive-next-hop enable` allows one level of recursion through BGP routes, as Fortinet's BGP-on-loopback designs require.\n\n* **next-hop-self on the spoke's neighbor**: affects what the spoke advertises, not how it resolves received routes. (On the hub, rewriting the next hop would break the ADVPN design.)\n* **ebgp-enforce-multihop**: the session is iBGP and already up.\n* **exchange-ip-addr4 172.16.0.2**: that option advertises the *local* device's address to the IKE peer; Spoke1 must use its own loopback, 172.16.0.1.",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-030",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about BGP `neighbor-group` and `neighbor-range` on a FortiGate hub are correct? (Choose two.)",
    "options": [
      "A peer is accepted if the source address of its BGP session falls inside a neighbor-range prefix",
      "Peers that match a neighbor range get all their settings, such as remote AS, update source and route maps, from the associated neighbor group",
      "Each spoke still needs its own `config neighbor` entry on the hub for the range to work",
      "A neighbor group can't be configured as a route reflector client",
      "`remote-as` and `remote-as-filter` can both be set in the same neighbor group to accept several ASs"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **Source inside the range**: correct, that's how a dynamic peer is matched.\n* **Settings from the group**: correct. `neighbor-group` holds everything a neighbor can hold; the range only maps prefixes to the group (plus `max-neighbor-num`).\n* **Per-spoke neighbor entries**: wrong; avoiding them is the whole point.\n* **No RR client**: wrong; `route-reflector-client enable` in the group is the standard hub configuration.\n* **remote-as and remote-as-filter together**: wrong; the 7.6 guide states they are mutually exclusive in a neighbor group.",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-031",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "In Fortinet's BGP on loopback design, why does the hub use one loopback (HUB-Lo) as the spokes' health-check server and a different loopback (BGP-Lo) for BGP peering?",
    "options": [
      "SD-WAN health checks install dedicated kernel routes to the server over each member, and those routes stay even when a probe fails, so BGP to the same address could keep using a failed tunnel",
      "A loopback interface can't accept both ICMP and TCP traffic at the same time",
      "BGP sessions to the health-check address would be counted as SLA probes and distort latency measurements",
      "The neighbor-range prefix can't contain an address that is also a health-check server"
    ],
    "answer": [
      0
    ],
    "explanation": "Health checks must leave through **each** member, so SD-WAN installs dedicated kernel routes to the health-check server per member. They are not removed when a probe fails. If BGP peered with that same address, its traffic could follow one of those probe routes over a dead tunnel instead of the routing table's best path. A separate BGP loopback avoids the interaction.\n\n* **ICMP and TCP on one loopback**: a loopback can serve both; that isn't the reason.\n* **BGP counted as probes**: health checks measure their own probe packets only.\n* **neighbor-range restriction**: there is no such rule; the range is about the spokes' source addresses anyway.",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-032",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Where does the administrative distance of 15 for the route to the hub's BGP loopback come from?",
    "exhibit": "FGT-Spoke1 # get router info routing-table all | grep -A1 172.16.0.254/32\nS       172.16.0.254/32 [15/0] via HUB1-VPN1 tunnel 192.0.2.101, [1/0]\n                        [15/0] via HUB1-VPN2 tunnel 192.0.2.102, [1/0]",
    "options": [
      "It is the default `distance` of routes added by IKE in `config vpn ipsec phase1-interface`; the hub's `exchange-ip-addr4` triggered the route",
      "It is the default distance of BGP routes learned over IPsec tunnels",
      "It is a static route configured by the administrator with a custom distance",
      "It is the distance of SD-WAN health-check probe routes"
    ],
    "answer": [
      0
    ],
    "explanation": "When the hub's phase 1 sets `exchange-ip-addr4 172.16.0.254`, IKE on the spoke installs a route to that address over each tunnel. Such IKE routes use the phase 1 `distance` (default **15**) and `priority` (default **1**, shown as `[1/0]`), and appear as `S` routes.\n\n* **BGP over IPsec**: iBGP routes have distance 200 regardless of the interface.\n* **Manual static route**: static routes default to distance 10; nothing in the exhibit suggests a manual route, and the two tunnel next hops match the IKE behaviour.\n* **Probe routes**: those are kernel routes and don't appear in `get router info routing-table all`.",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-033",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator enabled BFD for the eBGP neighbor 198.51.100.9 on FGT-Hub. The BGP session is Established, but BFD stays down. What is the most likely reason?",
    "exhibit": "FGT-Hub # get router info bfd requests\nBFD Peer Requests:\n    client types(ct in 0x): 01=external 02=static\n        04=ospf 08=bgp 10=pim-sm\nsrc=198.51.100.2     dst=198.51.100.9     ct=08 ifi=5\n\nFGT-Hub # get router info bfd neighbor\nOurAddress      NeighAddress      State      Interface   LDesc/RDesc\n198.51.100.2    198.51.100.9      DOWN       port2       1/0",
    "options": [
      "The ISP router has no BFD session configured for this peering; both ends must run BFD",
      "FortiOS requires BFD echo mode for eBGP neighbors, which is disabled",
      "BFD authentication must be configured on single-hop sessions before they come up",
      "BFD can't be used with BGP; it only works for static routes"
    ],
    "answer": [
      0
    ],
    "explanation": "The request (`ct=08`, BGP) shows the FortiGate side is asking for a BFD session, and the remote discriminator is 0: the peer never answered. BFD needs **both ends** configured (the 7.6 guide: \"Both units must be configured with BFD\").\n\n* **Echo mode**: not supported on FortiGate BFD at all.\n* **Authentication**: not supported for (single-hop) FortiGate BFD; multihop templates offer MD5.\n* **Static only**: BFD works with BGP, OSPF and static routes.",
    "lesson": "4.2-bgp-convergence"
  },
  {
    "id": "d4-034",
    "topic": "4.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default value, in milliseconds, of `bfd-desired-min-tx` under `config system settings` in FortiOS 7.6?",
    "answer": [
      "250",
      "250 ms",
      "250ms"
    ],
    "explanation": "BFD defaults are `bfd-desired-min-tx 250`, `bfd-required-min-rx 250` and `bfd-detect-mult 3`, so a neighbor is declared down after about 750 ms without BFD packets. BFD itself is disabled by default (`set bfd disable`).",
    "lesson": "4.2-bgp-convergence"
  },
  {
    "id": "d4-035",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "An FGCP cluster peers with a data-center router over eBGP. During a failover, the router must keep forwarding on the routes learned from the cluster while the new primary re-establishes BGP. Which two settings are needed on the FortiGate? (Choose two.)",
    "options": [
      "`set graceful-restart enable` under `config router bgp`",
      "`set capability-graceful-restart enable` on the neighbor",
      "`set bfd enable` on the neighbor with a 50 ms interval",
      "`set restart-mode graceful-restart` under `config router bgp`",
      "`set soft-reconfiguration enable` on the neighbor"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "FortiOS BGP graceful restart needs the global **`graceful-restart enable`** (default disable) and the per-neighbor **`capability-graceful-restart enable`** (default disable) so the capability is advertised. The router must support GR as a helper.\n\n* **Aggressive BFD**: works against GR; BFD would declare the neighbor down during the failover and flush routes.\n* **restart-mode**: that's the OSPF setting (`config router ospf`), not BGP.\n* **soft-reconfiguration**: stores received routes for inbound policy changes; it isn't part of GR.",
    "lesson": "4.2-bgp-convergence"
  },
  {
    "id": "d4-036",
    "topic": "4.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each FortiOS 7.6 BGP setting to its default value in seconds.",
    "pairs": [
      [
        "keepalive-timer",
        "60"
      ],
      [
        "holdtime-timer",
        "180"
      ],
      [
        "Neighbor advertisement-interval",
        "30"
      ],
      [
        "graceful-restart-time",
        "120"
      ],
      [
        "graceful-stalepath-time",
        "360"
      ]
    ],
    "explanation": "From the 7.6.0 CLI Reference: keepalive 60 s and hold time 180 s (global, per-neighbor values override), neighbor advertisement interval 30 s (for iBGP and eBGP), graceful restart time 120 s, stale-path time 360 s (and graceful update delay 120 s).",
    "lesson": "4.2-bgp-convergence"
  },
  {
    "id": "d4-037",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit from a hub with 150 spokes. When a spoke LAN is added or withdrawn, other spokes sometimes take up to half a minute to learn the change, even though the BGP sessions are stable. What should the administrator change?",
    "exhibit": "FGT-Hub # get router info bgp neighbors 172.16.0.7\nVRF 0 neighbor table:\nBGP neighbor is 172.16.0.7, remote AS 65000, local AS 65000, internal link\n  BGP version 4, remote router ID 172.16.0.7\n  BGP state = Established, up for 5d02h\n  Last read 00:00:21, hold time is 180, keepalive interval is 60 seconds\n  Configured hold time is 180, keepalive interval is 60 seconds\n  ...\n  Minimum time between advertisement runs is 30 seconds\n  Update source is BGP-Lo\n For address family: IPv4 Unicast\n  Route-Reflector Client\n  Community attribute sent to this neighbor (both)",
    "options": [
      "Lower `advertisement-interval` in the hub's neighbor group, for example to 1 second",
      "Lower `keepalive-timer` and `holdtime-timer` to 10 and 30 seconds",
      "Enable BFD on the neighbor group",
      "Enable `graceful-restart` on the hub"
    ],
    "answer": [
      0
    ],
    "explanation": "The sessions are up; the delay is **update pacing**. \"Minimum time between advertisement runs is 30 seconds\" is the FortiOS default `advertisement-interval` (30 s, also for iBGP). Fortinet's SD-WAN hub examples lower it in the neighbor group (for example `set advertisement-interval 1`) so reflected changes reach spokes quickly.\n\n* **Keepalive/hold timers** and **BFD** speed up *failure detection* of a peer, not the propagation of routes over a healthy session.\n* **Graceful restart** keeps forwarding during a control-plane restart; it doesn't change update timing.",
    "lesson": "4.2-bgp-convergence"
  },
  {
    "id": "d4-038",
    "topic": "4.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about BGP route reflection on a FortiGate hub are correct? (Choose two.)",
    "options": [
      "Without route reflection, the hub doesn't advertise a route learned from one iBGP spoke to another iBGP spoke",
      "A route reflector keeps the original next hop of reflected routes unless `next-hop-self-rr` is enabled",
      "Route reflection works only between eBGP peers",
      "`client-to-client-reflection` is disabled by default and must be enabled",
      "Route reflector clients must be configured individually; neighbor groups can't be clients"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **iBGP split horizon**: correct. An iBGP route isn't sent to other iBGP peers unless the router is a reflector for them (`route-reflector-client enable`).\n* **Next hop kept**: correct. That is what ADVPN designs rely on (the remote spoke's loopback stays the next hop). `next-hop-self-rr enable` changes it to the hub.\n* **eBGP only**: wrong; reflection is an iBGP mechanism.\n* **client-to-client-reflection**: defaults to **enable**.\n* **Neighbor groups**: hub neighbor groups are commonly RR clients.",
    "lesson": "4.2-bgp-convergence"
  },
  {
    "id": "d4-039",
    "topic": "4.2",
    "type": "single",
    "difficulty": 3,
    "stem": "A single-hub SD-WAN uses ADVPN and BGP on loopback. When Spoke1 sends traffic to Spoke2's LAN, the traffic must initially go through the hub and then move to a shortcut once it exists, without any BGP change. How should the hub advertise spoke LAN routes?",
    "options": [
      "Reflect them as route reflector, keeping the originating spoke's loopback as the next hop",
      "Advertise only a summary of all spoke LANs with the hub's loopback as next hop",
      "Reflect them with `next-hop-self-rr enable` so all next hops point to the hub",
      "Redistribute them into OSPF and run OSPF over the shortcuts"
    ],
    "answer": [
      0
    ],
    "explanation": "With reflected routes, Spoke1 sees `10.1.2.0/24 via 172.16.0.2` (Spoke2's loopback). Before the shortcut exists, 172.16.0.2 resolves through the hub's loopback summary over the hub tunnels. When the shortcut comes up, IKE installs a more specific route to 172.16.0.2 over it and the same BGP route now resolves over the shortcut, with no BGP update needed.\n\n* **Summary via the hub**: traffic can still trigger a shortcut, but the BGP next hop stays the hub, so Spoke1 needs another mechanism (such as dynamic BGP over the shortcut) to learn the specific route.\n* **next-hop-self-rr**: forces all traffic toward the hub's address, so the shortcut is never used by these routes.\n* **OSPF over shortcuts**: possible in other designs, but not \"without any BGP change\", and it doesn't scale.",
    "lesson": "4.2-bgp-loopback-neighbor-groups"
  },
  {
    "id": "d4-040",
    "topic": "4.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Hub peers with ISP-A (198.51.100.9) and ISP-B (192.0.2.9) and applies RM-PREPEND outbound to ISP-B only. What does this achieve?",
    "exhibit": "config router route-map\n    edit \"RM-PREPEND\"\n        config rule\n            edit 1\n                set set-aspath \"65000\" \"65000\"\n                set set-aspath-action prepend\n            next\n        end\n    next\nend\nconfig router bgp\n    config neighbor\n        edit \"192.0.2.9\"\n            set remote-as 64513\n            set route-map-out \"RM-PREPEND\"\n        next\n    end\nend",
    "options": [
      "Traffic from FGT-Hub to the Internet prefers ISP-A",
      "Traffic from the Internet to FGT-Hub's prefixes tends to prefer ISP-A, because ISP-B's path looks longer",
      "ISP-B rejects FGT-Hub's prefixes because they contain the local AS twice",
      "FGT-Hub's own routes via ISP-B get a lower local preference"
    ],
    "answer": [
      1
    ],
    "explanation": "Prepending lengthens the **AS path the rest of the Internet sees** through ISP-B (65000 65000 65000), so remote networks tend to prefer the shorter path via ISP-A for traffic **toward** FGT-Hub. It's a hint, not a guarantee (other ASs may use local preference).\n\n* **Outbound traffic**: route-map-out only changes what FGT-Hub advertises; FGT-Hub's own path choice depends on what it receives (use local preference or weight inbound for that).\n* **Rejected**: a repeated AS is normal prepending; loop prevention only rejects paths containing the *receiver's* AS.\n* **Local preference**: not touched by this route map.",
    "lesson": "4.2-bgp-fortigate"
  },
  {
    "id": "d4-041",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. SD-WAN rule 1 (CORP) should send traffic from the branch LAN (10.1.1.0/24 on port3) to 10.0.0.0/8 over the HUB1 overlays. Users report that this traffic leaves through port1 to the Internet instead. Why?",
    "exhibit": "FGT-Spoke1 # diagnose firewall proute list\nlist route policy info(vf=root):\n\nid=1(0x01) dscp_tag=0xff 0xff flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 port=src(0->0):dst(0->0) iif=5(port3)\npath(1): oif=3(port1) gwy=203.0.113.1\nsource wildcard(1): 0.0.0.0/0.0.0.0\ndestination wildcard(1): 10.0.0.0/255.0.0.0\nhit_count=1520 last_used=2026-10-28 09:12:44\n\nid=2131034113(0x7f050001) vwl_service=1(CORP) vwl_mbr_seq=3 4 dscp_tag=0xff 0xff flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 sport=0-65535 iif=0 dport=1-65535 oif=19(HUB1-VPN1) oif=20(HUB1-VPN2)\nsource(1): 10.1.1.0-10.1.1.255\ndestination(1): 10.0.0.0-10.255.255.255\nhit_count=0 last_used=2026-10-21 16:02:10",
    "options": [
      "A regular policy route (`config router policy`) matches the same traffic, and policy routes are evaluated before SD-WAN rules",
      "The SD-WAN rule has no health check, so it is skipped",
      "SD-WAN rules apply only when `input-device` is configured",
      "The implicit rule is evaluated before user-defined SD-WAN rules when the destination is a supernet"
    ],
    "answer": [
      0
    ],
    "explanation": "Entry `id=1` has no `vwl_service` field: it's a regular policy route from `config router policy` (iif port3, destination 10.0.0.0/8, out port1), and its hit count is climbing. FortiOS evaluates **policy routes > ISDB routes > SD-WAN rules**, so the SD-WAN rule (`vwl_service=1(CORP)`, hit count 0) never gets the traffic. Delete or narrow the policy route.\n\n* **No health check**: a manual-mode rule doesn't need one.\n* **input-device**: optional; the rule matches by source address here.\n* **Implicit rule first**: the implicit rule is always last.",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-042",
    "topic": "4.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Rule 2 prefers HUB1-VPN2 for traffic to the data center, and both overlays are alive and within SLA. Sessions to 10.0.1.10 still leave through HUB1-VPN1. What is the reason?",
    "exhibit": "FGT-Spoke1 # show system sdwan | grep -A8 \"edit 2\"\n        edit 2\n            set name \"DC-VIA-VPN2\"\n            set dst \"DC_NET\"\n            set priority-members 4 3\n        next\n\nFGT-Spoke1 # get router info routing-table all | grep 10.0.1.0\nB       10.0.1.0/24 [200/0] via 10.10.1.254, HUB1-VPN1, 00:33:20\n\nFGT-Spoke1 # diagnose sys sdwan member | grep HUB1\nMember(3): interface: HUB1-VPN1, flags=0x0 , gateway: 0.0.0.0, priority: 1 1024, weight: 0\nMember(4): interface: HUB1-VPN2, flags=0x0 , gateway: 0.0.0.0, priority: 1 1024, weight: 0",
    "options": [
      "Manual rules ignore `priority-members` order and use the member with the lowest sequence number",
      "There is no route to 10.0.1.0/24 through HUB1-VPN2, so the rule can't use that member",
      "IPsec members need a gateway configured before an SD-WAN rule can use them",
      "Member HUB1-VPN2 has a higher `priority` value than HUB1-VPN1"
    ],
    "answer": [
      1
    ],
    "explanation": "An SD-WAN rule can only use a member that has a **route to the destination through it** (FIB check). BGP per overlay installed 10.0.1.0/24 only via HUB1-VPN1, so member 4 isn't eligible and the rule uses member 3. Fix the routing: `ibgp-multipath enable` so both overlay paths are installed, or BGP on loopback so the route resolves over both tunnels.\n\n* **Lowest sequence number**: manual rules use `priority-members` order.\n* **Gateway on IPsec members**: not required; tunnels are point-to-point.\n* **priority**: both members show priority 1; member priority affects routes, not this rule's order.",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-043",
    "topic": "4.3",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the route lookup stages in the order FortiOS 7.6 evaluates them for the first packet of a new session.",
    "items": [
      "Policy routes configured under config router policy",
      "ISDB routes (static routes with an Internet service destination)",
      "User-defined SD-WAN rules, top to bottom",
      "Routing table (FIB), including the SD-WAN implicit rule"
    ],
    "explanation": "The 7.6 Administration Guide states the precedence **policy-based routes > ISDB routes > SD-WAN routes**, and that route lookup checks policy routes first and then the FIB. The SD-WAN implicit rule is not a policy route; it is the routing table with ECMP over the members (`load-balance-mode`). If nothing matches, the packet is dropped.",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-044",
    "topic": "4.3",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default `load-balance-mode` of the SD-WAN implicit rule in FortiOS 7.6? Give the CLI value.",
    "answer": [
      "source-ip-based",
      "source ip based"
    ],
    "explanation": "`config system sdwan` → `set load-balance-mode` defaults to **source-ip-based**: sessions from the same source IP use the same member. The other modes are weight-based, usage-based (spillover), source-dest-ip-based and measured-volume-based (SD-WAN only).",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-045",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Why is HUB1-VPN1 still the preferred member for rule 2, although its latency is higher than HUB1-VPN2's?",
    "exhibit": "FGT-Spoke1 # diagnose sys sdwan service4 2\n\nService(2): Address Mode(IPV4) flags=0x200 use-shortcut-sla\n Tie break: cfg\n  Gen(17), TOS(0x0/0x0), Protocol(0): src(1->65535):dst(1->65535), Mode(priority), link-cost-factor(latency), link-cost-threshold(10), health-check(HUB_HC)\n  Members(2):\n    1: Seq_num(3 HUB1-VPN1 HUB1), alive, latency: 44.120, selected\n    2: Seq_num(4 HUB1-VPN2 HUB1), alive, latency: 41.385, selected\n  Dst address(1):\n        10.0.1.0-10.0.1.255\n\nFGT-Spoke1 # show system sdwan | grep -A9 \"edit 2\"\n        edit 2\n            set name \"VOICE-DC\"\n            set mode priority\n            set dst \"DC_NET\"\n            set health-check \"HUB_HC\"\n            set priority-members 3 4\n        next",
    "options": [
      "Best quality rules give the first configured member an advantage defined by `link-cost-threshold` (10% by default)",
      "Best quality rules re-sort members only when the health check marks a member dead",
      "HUB1-VPN1 has the lower sequence number, which wins in best quality mode",
      "Latency is averaged with jitter and packet loss, and HUB1-VPN1 has less packet loss"
    ],
    "answer": [
      0
    ],
    "explanation": "In best quality (`priority`) mode, the first member in `priority-members` (member 3, HUB1-VPN1) is given an advantage: its measured value is divided by 1.10 with the default `link-cost-threshold 10`. 44.12 / 1.1 ≈ 40.1 ms, which is still lower than HUB1-VPN2's 41.385 ms, so VPN1 stays first.\n\n* **Only on dead**: best quality re-sorts members whenever the metric comparison changes.\n* **Lower sequence number**: the advantage goes to the first *configured* member in `priority-members`, not to the lowest sequence number (here they happen to coincide).\n* **Averaged metrics**: `link-cost-factor(latency)` compares latency only; combinations need `custom-profile-1`.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-046",
    "topic": "4.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. HUB1-VPN1 keeps measuring 44 ms. Below which HUB1-VPN2 latency does HUB1-VPN2 become the preferred member of rule 2?",
    "exhibit": "FGT-Spoke1 # diagnose sys sdwan service4 2\n\nService(2): Address Mode(IPV4) flags=0x200 use-shortcut-sla\n Tie break: cfg\n  Gen(17), TOS(0x0/0x0), Protocol(0): src(1->65535):dst(1->65535), Mode(priority), link-cost-factor(latency), link-cost-threshold(10), health-check(HUB_HC)\n  Members(2):\n    1: Seq_num(3 HUB1-VPN1 HUB1), alive, latency: 44.120, selected\n    2: Seq_num(4 HUB1-VPN2 HUB1), alive, latency: 41.385, selected\n  Dst address(1):\n        10.0.1.0-10.0.1.255\n\nFGT-Spoke1 # show system sdwan | grep -A9 \"edit 2\"\n        edit 2\n            set name \"VOICE-DC\"\n            set mode priority\n            set dst \"DC_NET\"\n            set health-check \"HUB_HC\"\n            set priority-members 3 4\n        next",
    "options": [
      "40 ms",
      "39.6 ms",
      "44 ms",
      "48.4 ms"
    ],
    "answer": [
      0
    ],
    "explanation": "The first configured member's value is divided by (1 + 10%): 44 / 1.1 = **40 ms**. HUB1-VPN2 is compared unchanged, so it must measure **less than 40 ms** to win.\n\n* **39.6 ms** is 44 × 0.9, a 10% reduction rather than the documented division by 1.1.\n* **44 ms** ignores the advantage.\n* **48.4 ms** applies the threshold in the wrong direction (44 × 1.1).",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-047",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Rule 1 uses the lowest cost (SLA) strategy. HUB1-VPN1 has `cost 0` and HUB1-VPN2 has `cost 10`. Which member carries new sessions for rule 1, and why?",
    "exhibit": "FGT-Spoke1 # diagnose sys sdwan health-check HUB_HC\nHealth Check(HUB_HC):\nSeq(3 HUB1-VPN1): state(alive), packet-loss(4.000%) latency(212.413), jitter(35.902) sla_map=0x0\nSeq(4 HUB1-VPN2): state(alive), packet-loss(0.000%) latency(38.770), jitter(2.114) sla_map=0x1\n\nFGT-Spoke1 # diagnose sys sdwan service4 1\n\nService(1): Address Mode(IPV4) flags=0x200 use-shortcut-sla\n Tie break: cfg\n  Gen(23), TOS(0x0/0x0), Protocol(0): src(1->65535):dst(1->65535), Mode(sla), sla-compare-order\n  Members(2):\n    1: Seq_num(4 HUB1-VPN2 HUB1), alive, sla(0x1), gid(0), cfg_order(1), local cost(10), selected\n    2: Seq_num(3 HUB1-VPN1 HUB1), alive, sla(0x0), gid(0), cfg_order(0), local cost(0), selected\n  Src address(1):\n        10.1.1.0-10.1.1.255\n\n  Dst address(1):\n        10.0.0.0-10.255.255.255",
    "options": [
      "HUB1-VPN1, because it has the lowest cost",
      "HUB1-VPN2, because only members that meet the SLA are ranked by cost, and HUB1-VPN1 fails the SLA",
      "Both members, because lowest cost rules always load balance across alive members",
      "Neither member; the rule is skipped because one member fails the SLA"
    ],
    "answer": [
      1
    ],
    "explanation": "Lowest cost (SLA) first separates members that **meet the SLA** (`sla(0x1)`) from those that don't, and only then prefers the lowest cost. HUB1-VPN1 fails (`sla_map=0x0`, 212 ms, 4% loss), so HUB1-VPN2 is listed first and carries new sessions despite its higher cost. HUB1-VPN1 stays `selected` (alive), so it is still a fallback.\n\n* **Lowest cost wins**: only among members that meet the SLA.\n* **Always load balance**: only with `set load-balance enable`.\n* **Rule skipped**: an SLA rule becomes ineffective only when fewer members meet the SLA than `minimum-sla-meet-members` requires (default 0 on a rule); here one member meets it.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-048",
    "topic": "4.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about application-based SD-WAN rules (`internet-service-app-ctrl`) in FortiOS 7.6 are correct? (Choose two.)",
    "options": [
      "The first session of an application doesn't match the rule, because the application isn't identified yet",
      "A learned application entry is removed after eight hours without hits",
      "No security profile is needed on the firewall policy; SD-WAN identifies applications on its own",
      "Rules based on ISDB internet services need the same learning phase before they match",
      "Learned entries are keyed by the client's source IP address"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **First session doesn't match**: correct. The IPS engine has to identify the application first; that session is routed by another rule or the implicit rule.\n* **Eight hours**: correct. The learned destination IP, protocol and port stay in the application control list until there are no hits for eight hours.\n* **No security profile**: wrong. Application control must be enabled in the firewall policy for application steering.\n* **ISDB learning**: wrong. ISDB entries are IP/protocol/port lists, so they match from the first packet.\n* **Source IP**: wrong. The learned 3-tuple is the **destination** IP, protocol and port.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-049",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What does this entry mean for SD-WAN rules that match Microsoft.Teams?",
    "exhibit": "FGT-Spoke1 # diagnose sys sdwan internet-service-app-ctrl-list 43541\nMicrosoft.Teams(43541 4294837333): 203.0.113.80 17 3478 Wed Oct 28 10:41:09 2026",
    "options": [
      "New sessions to 203.0.113.80, UDP port 3478 now match rules for Microsoft.Teams from their first packet",
      "Client 203.0.113.80 has been identified as a Teams user, and all of its sessions now match the Teams rule",
      "The rule will match Teams traffic to any IP address on UDP 3478",
      "The entry is a static ISDB definition downloaded from FortiGuard and never expires"
    ],
    "answer": [
      0
    ],
    "explanation": "After the IPS engine identified Teams, FortiOS recorded the **destination** 3-tuple (IP 203.0.113.80, protocol 17 = UDP, port 3478) against the application. New sessions to that tuple match application rules for Teams immediately. The entry ages out after 8 hours without hits; other Teams server IPs need their own learning.\n\n* **Client identified**: the tuple is the server side, not the client.\n* **Any IP on UDP 3478**: the match is on IP, protocol and port together.\n* **Static ISDB entry**: ISDB objects are separate; this list is learned from traffic and expires.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-050",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Spoke1 sends its logs to FAZ-HQ (10.0.1.50) in the data center. SD-WAN rule 1 sends all traffic to 10.0.0.0/8 over the HUB1 overlays, but the log traffic leaves through port1 toward the Internet default route instead. What should the administrator change?",
    "exhibit": "FGT-Spoke1 # show log fortianalyzer setting\nconfig log fortianalyzer setting\n    set status enable\n    set server \"10.0.1.50\"\nend\n\nFGT-Spoke1 # get router info routing-table all | grep -A3 \"0.0.0.0/0\"\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]\n                  [1/0] via 198.51.100.1, port2, [1/0]\n                  [1/0] via 10.10.1.254, HUB1-VPN1, [10/0]\n                  [1/0] via 10.10.2.254, HUB1-VPN2, [10/0]",
    "options": [
      "Nothing; local-out traffic always uses SD-WAN rules once SD-WAN is enabled",
      "Set `interface-select-method sdwan` in `config log fortianalyzer setting`",
      "Add the log traffic's source IP to rule 1 with `set src`",
      "Enable `use-sdwan` with `execute ping-options` so that local-out traffic follows SD-WAN"
    ],
    "answer": [
      1
    ],
    "explanation": "Local-out traffic uses the **routing table** by default (`interface-select-method auto`). The only route to 10.0.1.50 is the default route, and its preferred next hops are port1/port2 (priority 1); the overlay next hops have priority 10, so the routing table never picks them and the logs go to the Internet. LAN traffic still uses the overlays because rule 1's FIB check only needs *a* route to the destination through the member, and the priority-10 default via HUB1-VPN1/VPN2 is in the FIB. Setting `interface-select-method sdwan` makes the log traffic use the SD-WAN rules too, so rule 1 steers it to the overlays.\n\n* **Always uses SD-WAN**: wrong; it's per service and defaults to auto.\n* **set src**: doesn't help while the service uses plain routing-table lookups.\n* **ping-options use-sdwan**: affects only the `execute ping` diagnostic.",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-051",
    "topic": "4.3",
    "type": "fill",
    "difficulty": 2,
    "stem": "An administrator wants `execute ping` from the FortiGate to follow SD-WAN rules instead of the routing table. Which command must be run before the ping?",
    "answer": [
      "execute ping-options use-sdwan yes",
      "exec ping-options use-sdwan yes"
    ],
    "explanation": "`execute ping-options use-sdwan yes` makes subsequent `execute ping` commands use SD-WAN rules (for IPv6, `execute ping6-options use-sdwan yes`; for traceroute, `execute traceroute-options use-sdwan yes`). Pings are local-out traffic and use the routing table by default.",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-052",
    "topic": "4.3",
    "type": "match",
    "difficulty": 1,
    "stem": "Match each SD-WAN rule strategy (GUI name) to its FortiOS 7.6 CLI configuration.",
    "pairs": [
      [
        "Manual",
        "set mode manual (the default)"
      ],
      [
        "Best Quality",
        "set mode priority"
      ],
      [
        "Lowest Cost (SLA)",
        "set mode sla"
      ],
      [
        "Automatic (legacy)",
        "set mode auto"
      ],
      [
        "Load balancing",
        "set load-balance enable under manual or sla mode"
      ]
    ],
    "explanation": "`mode` controls how the rule ranks members: `manual` (configured order, no health checks), `priority` (best `link-cost-factor`), `sla` (members meeting SLA targets, then lowest cost), `auto` (legacy quality rank, CLI only). Load balancing, called maximize bandwidth (SLA) before 7.4.1, is `set load-balance enable` inside a manual or sla rule.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-053",
    "topic": "4.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about the load balancing strategy for SD-WAN rules in FortiOS 7.6 are correct? (Choose two.)",
    "options": [
      "Under the manual strategy, load balancing spreads traffic over the configured members without SLA targets",
      "Under the lowest cost (SLA) strategy, load balancing uses every member that meets the SLA and ignores member cost",
      "The default `hash-mode` is source-ip-based",
      "It is configured with `set mode load-balance`",
      "It sends all traffic to the first member until its spillover threshold is reached"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **Manual + load balancing**: correct, no SLA targets are used.\n* **SLA + load balancing**: correct; the 7.6 guide says interface cost is not considered when load balancing is used.\n* **Default hash-mode**: wrong, it's **round-robin** (the only method in the GUI).\n* **mode load-balance**: wrong; since 7.4.1 it's `set load-balance enable` in a manual or sla rule. (`Mode(load-balance)` can still appear in diagnose output.)\n* **Spillover**: that's the implicit rule's `usage-based` mode.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-054",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Traffic from the branch LAN to the data center (`DC_NET`) leaves through port1 instead of the overlays. What should the administrator do?",
    "exhibit": "FGT-Spoke1 # show system sdwan | grep -A20 \"config service\"\n    config service\n        edit 1\n            set name \"INTERNET\"\n            set dst \"all\"\n            set src \"BRANCH_LAN\"\n            set priority-members 1 2\n        next\n        edit 2\n            set name \"DC\"\n            set mode sla\n            set dst \"DC_NET\"\n            set src \"BRANCH_LAN\"\n            config sla\n                edit \"HUB_HC\"\n                    set id 1\n                next\n            end\n            set priority-members 3 4\n        next\n    end",
    "options": [
      "Move rule 2 above rule 1, because SD-WAN rules are evaluated top-down and rule 1 matches all destinations",
      "Lower the sequence numbers of members 3 and 4 so they rank above port1",
      "Add a health check to rule 1 so it is skipped for DC destinations",
      "Change rule 1 to `mode sla`, because manual rules are always evaluated before SLA rules"
    ],
    "answer": [
      0
    ],
    "explanation": "Rules are evaluated **top-down, first match**. Rule 1 matches every destination from BRANCH_LAN, and port1 has a route to the DC prefixes through the default route, so rule 2 is never reached. Put specific rules first (`move 2 before 1` in `config service`, or drag it in the GUI).\n\n* **Sequence numbers**: member order inside a rule is irrelevant if the rule is never matched.\n* **Health check on rule 1**: a manual rule doesn't use one, and it wouldn't make rule 1 skip DC traffic.\n* **Manual before SLA**: rule order doesn't depend on the strategy.",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-055",
    "topic": "4.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about SD-WAN rule traffic matching criteria in FortiOS 7.6 are correct? (Choose two.)",
    "options": [
      "A rule can combine one protocol and one port range with its destination address objects; more combinations need a custom internet service",
      "Internet service (ISDB) destinations match from the first packet of a session",
      "The source interface (`input-device`) can only be set in the GUI",
      "A BGP route tag is matched by putting a route-tag address object in `set src`",
      "TOS matching uses `set tos` only; the mask is fixed at 0xff"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **One protocol and one port range**: correct, per the 7.6 guide's destination field table.\n* **ISDB from the first packet**: correct; ISDB entries are IP/protocol/port definitions, no application identification is needed.\n* **input-device GUI only**: wrong, it's **CLI only** (with `input-device-negate`).\n* **Route tag in src**: wrong; route tags are a **destination** criterion (`set dst` with a `type route-tag` address).\n* **TOS mask fixed**: wrong; `set tos-mask` selects which bits are compared.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-056",
    "topic": "4.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Rule 5 uses lowest cost (SLA) with `tie-break fib-best-match` over four members, and all four meet the SLA. Which members can carry sessions to 10.1.100.22?",
    "exhibit": "FGT-Hub # get router info routing-table all\n...\nS*      0.0.0.0/0 [1/0] via 172.16.11.1, port11, [1/0]\n                  [1/0] via 172.16.12.1, port12, [1/0]\n                  [1/0] via 172.16.15.1, port15, [1/0]\n                  [1/0] via 172.16.16.1, port16, [1/0]\nS       10.1.100.0/24 [1/0] via 172.16.15.1, port15, [1/0]\n                      [1/0] via 172.16.16.1, port16, [1/0]",
    "options": [
      "Only port15 and port16, because fib-best-match limits the choice to members on the longest-match route",
      "All four members, because they all have a valid route (the default route) to the destination",
      "Only port11, because it is the first configured member",
      "Only port16, because the last ECMP next hop is preferred"
    ],
    "answer": [
      0
    ],
    "explanation": "By default SD-WAN considers every member with a **valid** route to the destination, which here includes all four through the default route. With `tie-break fib-best-match`, only members on the **longest-match** route (10.1.100.0/24 via port15 and port16) are chosen among those meeting the SLA. The rule's mode then picks between them (for SLA mode: the first configured or lower-cost member in SLA).\n\n* **All four**: that would be the default tie-break behaviour.\n* **port11**: not on the best-match route.\n* **Last ECMP next hop**: there is no such preference.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-057",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "A lowest cost (SLA) rule has `set minimum-sla-meet-members 2` and two members. Only one member currently meets the SLA. What happens to traffic that matches the rule's criteria?",
    "options": [
      "The rule doesn't take effect, so the traffic is evaluated against the next rules and finally the implicit rule",
      "The traffic is load balanced over both members to protect the one that meets the SLA",
      "The traffic is dropped until both members meet the SLA",
      "The traffic uses the member that meets the SLA, and an event log entry is raised"
    ],
    "answer": [
      0
    ],
    "explanation": "`minimum-sla-meet-members` sets how many members must meet the SLA for the rule to take effect. With fewer members in SLA, the rule is not applied, so the session continues to the following rules and, if none match, the implicit rule (routing table).\n\n* **Load balancing**: requires `load-balance enable`, and isn't triggered by SLA failures.\n* **Dropped**: an ineffective rule doesn't drop traffic.\n* **Uses the member in SLA**: that's the behaviour without the minimum (the rule default is 0).",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-058",
    "topic": "4.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Rule 1 is a manual rule with `priority-members 1 2`. Which statement describes new sessions that match rule 1 while this output is current?",
    "exhibit": "FGT-Spoke1 # diagnose sys sdwan health-check INET_HC\nHealth Check(INET_HC):\nSeq(1 port1): state(dead), packet-loss(100.000%) sla_map=0x0\nSeq(2 port2): state(alive), packet-loss(0.000%) latency(18.402), jitter(1.077) sla_map=0x1\n\nFGT-Spoke1 # diagnose sys sdwan service4 1\n\nService(1): Address Mode(IPV4) flags=0x200 use-shortcut-sla\n Tie break: cfg\n  Gen(9), TOS(0x0/0x0), Protocol(0): src(1->65535):dst(1->65535), Mode(manual)\n  Members(2):\n    1: Seq_num(2 port2 WAN2), alive, selected\n    2: Seq_num(1 port1 WAN1), dead\n  Src address(1):\n        10.1.1.0-10.1.1.255\n\n  Dst address(1):\n        0.0.0.0-255.255.255.255",
    "options": [
      "They use port2, because port1 is dead and is no longer selected",
      "They use port1, because manual rules ignore health checks and always follow `priority-members`",
      "They are dropped, because the first member of a manual rule is down",
      "They are load balanced over both members using source-ip-based hashing"
    ],
    "answer": [
      0
    ],
    "explanation": "Manual rules don't use SLA targets, but a member that a health check declares **dead** is no longer usable: it loses `selected`, and with `update-static-route` (default enable) its static routes are removed too. New sessions use the next member in `priority-members`, port2.\n\n* **Ignore health checks**: manual rules don't compare quality, but they do avoid dead members.\n* **Dropped**: the rule still has an alive, selected member.\n* **Load balanced**: only with `load-balance enable` (and it uses `hash-mode`, not source-ip-based by default).",
    "lesson": "4.3-sdwan-rule-lookup"
  },
  {
    "id": "d4-059",
    "topic": "4.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Voice traffic to the data center must use the MPLS overlay while it meets an SLA of 150 ms latency and 30 ms jitter, move to the Internet overlay only if MPLS fails that SLA, and must not move just because the Internet overlay is momentarily a little faster. Which rule design meets these requirements?",
    "options": [
      "Lowest cost (SLA) with the SLA target, with MPLS given a lower member cost (or placed first among equal costs)",
      "Best quality on latency with MPLS first in `priority-members`",
      "Manual with MPLS first in `priority-members`",
      "Lowest cost (SLA) with `load-balance enable`"
    ],
    "answer": [
      0
    ],
    "explanation": "Lowest cost (SLA) is **pass/fail**: as long as MPLS meets the SLA it stays preferred, and the rule moves only when MPLS fails it. A lower cost (or first position at equal cost) makes MPLS the choice among members in SLA.\n\n* **Best quality**: reorders members whenever one is better by more than `link-cost-threshold`, which is exactly the movement the requirement forbids.\n* **Manual**: reacts only to a member being dead, not to an SLA violation.\n* **Load balancing**: spreads voice over both overlays whenever both meet the SLA.",
    "lesson": "4.3-sdwan-strategies-matching"
  },
  {
    "id": "d4-060",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What does static route 1 install?",
    "exhibit": "FGT-Spoke1 # show router static 1\nconfig router static\n    edit 1\n        set distance 1\n        set sdwan-zone \"WAN1\" \"WAN2\"\n    next\nend\n\nFGT-Spoke1 # show system sdwan | grep -B1 -A3 \"set interface \\\"port\"\n        edit 1\n            set interface \"port1\"\n            set zone \"WAN1\"\n            set gateway 203.0.113.1\n        next\n        edit 2\n            set interface \"port2\"\n            set zone \"WAN2\"\n            set gateway 198.51.100.1\n        next",
    "options": [
      "A default route with one next hop per member of WAN1 and WAN2, each using the member's configured gateway",
      "A default route through a virtual interface called virtual-wan-link, resolved later by the SD-WAN rules",
      "A route only through the first member of the first zone; the second zone is a backup",
      "Nothing, because a static route to an SD-WAN zone must also set `gateway`"
    ],
    "answer": [
      0
    ],
    "explanation": "A static route with `sdwan-zone` and no `dst` is a default route that expands to **one next hop per member** of the listed zones, using each member's `gateway` (or dynamic gateway). With equal distance and priority the two next hops are ECMP, used by the implicit rule; SD-WAN rules can then pick either member because both have a route.\n\n* **virtual-wan-link interface**: in 7.6 routes reference zones; the next hops are the real members.\n* **First member only**: both members get next hops.\n* **gateway required**: the members' gateways are used; the route itself doesn't set one.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-061",
    "topic": "4.4",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Rule 7 must send traffic for a partner network out of port2 even though FGT-Spoke1 has no route to 192.0.2.128/25 through port2. With this configuration, which FIB check does FortiOS apply before rule 7 can use member 2?",
    "exhibit": "config system sdwan\n    config members\n        edit 2\n            set interface \"port2\"\n            set zone \"WAN2\"\n            set gateway 198.51.100.1\n        next\n    end\n    config service\n        edit 7\n            set name \"PARTNER\"\n            set dst \"PARTNER_NET\"\n            set priority-members 2\n            set gateway enable\n        next\n    end\nend",
    "options": [
      "None; with `gateway enable` the rule always sends matching traffic to 198.51.100.1",
      "The best FIB match for the destination must be an SD-WAN member, and a route to the member's gateway 198.51.100.1 must exist over any interface",
      "A route to 192.0.2.128/25 must exist through port2, exactly as without the option",
      "The member must have a static route with `sdwan-zone \"WAN2\"` and distance 1"
    ],
    "answer": [
      1
    ],
    "explanation": "Normally both checks apply: best match is an SD-WAN member **and** a route to the destination exists through the chosen member. With `set gateway enable` and `default` left at **disable**, the second check changes to \"a route to the **member's gateway IP** exists over any interface\" (the first check stays).\n\n* **No checks at all**: requires `set gateway enable` **and** `set default enable` (then members must have a gateway).\n* **Same as without the option**: that's the default behaviour the option changes.\n* **Zone static route requirement**: not a condition of these checks.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-062",
    "topic": "4.4",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about the routes that SD-WAN installs for performance SLA health checks are correct? (Choose two.)",
    "options": [
      "They are dedicated kernel routes to the health-check server through each member, using the member's interface IP or `source`",
      "They don't appear in `get router info routing-table all`; you see them with `get router info kernel` or `diagnose ip route list`",
      "They are removed as soon as a probe fails, which stops the probes on that member",
      "They are installed only through the member that currently has the best SLA",
      "They are BGP routes with a route tag that SD-WAN rules can match"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **Kernel routes per member**: correct. `get router info kernel` shows one source-specific route per member to the server (for example `172.16.0.1/255.255.255.255/0->172.16.255.251/32 ... dev=20(advpn)`), sourced from the member IP or its `source` address. The `proto=` value differs between the 7.6 guide's examples (17 and 18), so don't rely on the number.\n* **Kernel only**: correct; they aren't RIB routes.\n* **Removed on failure**: wrong; the 7.6 guide says these kernel routes \"will not be removed even when the health check fails\" (probes must keep running to detect recovery), which is why Fortinet uses a separate hub loopback for health checks and BGP.\n* **Best member only**: wrong; every member in the health check gets one.\n* **BGP routes with tags**: unrelated.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-063",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. `update-static-route` is left at its default on health check INET_HC. Which statement is correct?",
    "exhibit": "FGT-Spoke1 # diagnose sys sdwan health-check INET_HC\nHealth Check(INET_HC):\nSeq(1 port1): state(dead), packet-loss(100.000%) sla_map=0x0\nSeq(2 port2): state(alive), packet-loss(0.000%) latency(17.904), jitter(0.988) sla_map=0x1\n\nFGT-Spoke1 # get router info routing-table static\nRouting table for VRF=0\nS*      0.0.0.0/0 [1/0] via 198.51.100.1, port2, [1/0]",
    "options": [
      "The static route through port1 was removed because port1 is dead, so the implicit rule and all SD-WAN rules can only use port2 for Internet destinations",
      "The static route through port1 is still active but hidden, and the implicit rule keeps load balancing over both members",
      "The health check removed every static route on the FortiGate, so port2's route is a kernel route",
      "`update-static-route` removes routes only when a member is out of SLA, not when it is dead"
    ],
    "answer": [
      0
    ],
    "explanation": "`update-static-route` defaults to **enable**: when the health check marks a member dead, static routes through that member are withdrawn. The zone default route now has only the port2 next hop, so the implicit rule (ECMP) and SD-WAN rules (FIB check) can only use port2. When port1 recovers, its route returns.\n\n* **Hidden route**: the route is removed from the routing table, not hidden.\n* **All static routes removed**: only routes through the dead member.\n* **Out of SLA**: route withdrawal is tied to the member being dead; SLA failure only changes rule ranking.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-064",
    "topic": "4.4",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The hub advertises the data-center prefixes with community 65000:100. Rule 3 never matches DC traffic, and `diagnose sys sdwan route-tag-list` shows no prefixes for tag 100. What is wrong?",
    "exhibit": "config router route-map\n    edit \"RM-HUB-IN\"\n        config rule\n            edit 1\n                set match-community \"CL-DC\"\n                set set-tag 100\n            next\n            edit 2\n            next\n        end\n    next\nend\nconfig firewall address\n    edit \"DC_TAG_100\"\n        set type route-tag\n        set route-tag 100\n    next\nend\nconfig system sdwan\n    config service\n        edit 3\n            set name \"DC-APPS\"\n            set dst \"DC_TAG_100\"\n            set priority-members 3 4\n        next\n    end\nend",
    "options": [
      "Rule 1 uses `set-tag`; the routing-table route tag that route-tag address objects match is set with `set-route-tag`",
      "Rule 2 has no match condition and permits everything, which overwrites the tag",
      "Route-tag address objects can't be used as the destination of an SD-WAN rule",
      "Route tags only work with OSPF routes, not BGP routes"
    ],
    "answer": [
      0
    ],
    "explanation": "`set-tag` sets the protocol tag value; `set-route-tag` sets the **route tag in the FortiOS routing table**, which is what a `type route-tag` address (and therefore the SD-WAN rule) matches. Fortinet's \"Using BGP tags with SD-WAN rules\" example uses `set set-route-tag 15`. Change rule 1 to `set set-route-tag 100`, then soft-clear the session to re-apply the inbound map.\n\n* **Rule 2**: it only permits routes that didn't match rule 1 (without it, the implicit deny would drop them); it doesn't touch rule 1's routes.\n* **Not usable in rules**: route-tag addresses are exactly the SD-WAN rule destination for BGP tags (and can be used in firewall policies).\n* **OSPF only**: the documented use case is BGP.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-065",
    "topic": "4.4",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the events in order, from the hub advertising a data-center prefix to a branch session being steered by a route-tag-based SD-WAN rule.",
    "items": [
      "The hub advertises 10.0.1.0/24 with community 65000:100",
      "The spoke's inbound route map matches the community list and sets route tag 100",
      "The route is installed in the spoke's routing table carrying route tag 100",
      "The route-tag address object for tag 100 resolves to 10.0.1.0/24",
      "A new session to 10.0.1.10 matches the SD-WAN rule whose destination is that address object"
    ],
    "explanation": "The tag travels as a **community** in BGP, is converted into a **routing-table route tag** by the receiving FortiGate's inbound route map (`match-community` + `set-route-tag`), and the `type route-tag` address object follows the routing table (`diagnose sys sdwan route-tag-list` shows the resolved prefixes). The SD-WAN rule's policy route then lists those prefixes as its destination (`diagnose firewall proute list`).",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-066",
    "topic": "4.4",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which diagnose command lists the prefixes currently resolved for each route tag and the SD-WAN rules that read them?",
    "answer": [
      "diagnose sys sdwan route-tag-list",
      "diag sys sdwan route-tag-list"
    ],
    "explanation": "`diagnose sys sdwan route-tag-list` prints each route tag with its IPv4/IPv6 address count, the SD-WAN service(s) that read it, and the resolved prefixes with their outgoing interfaces. Pair it with `get router info bgp network <prefix>` (shows `route tag`) and `diagnose firewall proute list`.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-067",
    "topic": "4.4",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. port1 (member 1) recovered ten minutes ago and is preferred again by the routing table, but this Internet session is still on port2. No user-defined SD-WAN rule matches this traffic (it uses the implicit rule), and `snat-route-change` is at its default. Why?",
    "exhibit": "FGT-Spoke1 # get router info routing-table all | grep -A1 0.0.0.0/0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]\n                  [1/0] via 198.51.100.1, port2, [10/0]\n\nFGT-Spoke1 # diagnose sys session list\nsession info: proto=6 proto_state=01 duration=1904 expire=3597 timeout=3600 flags=00000000 socktype=0 sockport=0 av_idx=0 use=3\n...\nstate=log may_dirty f00\n...\norgin->sink: org pre->post, reply pre->post dev=5->4/4->5 gwy=198.51.100.1/10.1.1.20\nhook=post dir=org act=snat 10.1.1.20:49822->192.0.2.80:443(198.51.100.2:49822)\nhook=pre dir=reply act=dnat 192.0.2.80:443->198.51.100.2:49822(10.1.1.20:49822)\nmisc=0 policy_id=1 pol_uuid_idx=518 auth_info=0 chk_client_info=0 vd=0\nserial=00031a7e tos=ff/ff app_list=0 app=0 url_cat=0\nsdwan_mbr_seq=2 sdwan_service_id=0",
    "options": [
      "SNAT sessions keep their outbound interface after a routing change as long as the old route is still active, which it is here (port2 is only lower priority)",
      "The session is offloaded to an NPU, so it can never be re-routed",
      "The session matched an SD-WAN rule with `sla-stickiness` enabled",
      "`preserve-session-route` is enabled on port2"
    ],
    "answer": [
      0
    ],
    "explanation": "The session is **SNATed** (`act=snat ... (198.51.100.2:49822)`), and the route via port2 still exists (priority 10 instead of 1). By default FortiOS keeps SNAT sessions on their outbound interface after a routing change while the old route remains active, because moving them would change their source IP and break them. `config system global` → `set snat-route-change enable` forces a new lookup (and a new SNAT).\n\n* **NPU offload**: the state flags don't show `npu`, and offload doesn't prevent re-evaluation.\n* **sla-stickiness**: a per-rule option (`config service`); this traffic follows the implicit rule (the routing table), which has no such setting.\n* **preserve-session-route**: disabled by default, and it is the knob for routing changes in sessions *without* SNAT; it would also show `route_preserve` in the state flags.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-068",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Inter-site traffic over the overlays is not NATed. An administrator raises the priority value of a static route so that new sessions move to another tunnel, but existing sessions must stay on their current tunnel. No SD-WAN rule is involved. Which setting achieves this?",
    "options": [
      "`set preserve-session-route enable` on the interface the existing sessions use",
      "`set snat-route-change enable` under `config system global`",
      "`set sla-stickiness enable` on the implicit rule",
      "`set firewall-session-dirty check-new` under `config system settings`"
    ],
    "answer": [
      0
    ],
    "explanation": "Without SNAT, FortiOS flushes the routing information of existing sessions after a routing change and looks them up again. `preserve-session-route enable` on the interface marks existing sessions' routing information as persistent, so only new sessions use the new route.\n\n* **snat-route-change**: concerns SNAT sessions, and does the opposite (forces re-lookup).\n* **sla-stickiness**: an SD-WAN rule option for SLA mode; the implicit rule has no such setting, and no rule is involved here.\n* **firewall-session-dirty check-new**: controls the reaction to **firewall policy** changes, not routing changes.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-069",
    "topic": "4.4",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each session state flag shown by `diagnose sys session list` to its meaning.",
    "pairs": [
      [
        "may_dirty",
        "The session may be re-evaluated if something changes"
      ],
      [
        "dirty",
        "The session has been flagged for re-evaluation on its next packet"
      ],
      [
        "npu",
        "The session is offloaded to an NPU"
      ],
      [
        "synced",
        "The session has been synchronized to HA peers"
      ],
      [
        "route_preserve",
        "Existing routing information is kept after routing changes"
      ],
      [
        "local",
        "The session is attached to the FortiGate's own IP stack"
      ]
    ],
    "explanation": "From the 7.6 guide's session state table: `may_dirty` (details allowed to be altered), `dirty` (has been altered; requires may_dirty), `npu` (through an acceleration chip), `synced` (synced to HA peers on a session-pickup primary), `local` (attached to the local IP stack: traffic to or from the FortiGate itself, and also sessions redirected to a FortiGate proxy, which show `redir local`). `route_preserve` appears with `preserve-session-route enable` on the interface.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-070",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about the two sessions is correct?",
    "exhibit": "FGT-Spoke1 # diagnose sys session list | grep \"session info\"\nsession info: proto=6 proto_state=01 duration=38 expire=3591 timeout=3600 flags=00000000 socktype=0 sockport=0 av_idx=0 use=3\nsession info: proto=17 proto_state=00 duration=12 expire=168 timeout=180 flags=00000000 socktype=0 sockport=0 av_idx=0 use=3",
    "options": [
      "The TCP session is established in one direction and in state NONE in the other; the UDP session has not seen a reply yet",
      "The TCP session is in SYN_SENT; the UDP session is established in both directions",
      "Both sessions are closed and waiting for their expire timers",
      "The UDP session's proto_state 00 means it is a broadcast session"
    ],
    "answer": [
      0
    ],
    "explanation": "TCP `proto_state` has **two digits, one per direction**: 0 = NONE, 1 = ESTABLISHED (2 = SYN_SENT, 3 = SYN & SYN/ACK, 4 = FIN_WAIT, 5 = TIME_WAIT ...), so `01` is NONE/ESTABLISHED, which is what an ordinary established flow-mode TCP session typically shows (proxy-inspected sessions can show `11`, as in the 7.6 guide's example). For UDP, 0 = reply not seen and 1 = reply seen, so `00` means no reply has been seen yet (one-way so far). ICMP always shows `00`.\n\n* **SYN_SENT**: would be a 2.\n* **Closed**: close states are 5-8 for TCP.\n* **Broadcast**: proto_state doesn't encode the destination type.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-071",
    "topic": "4.4",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about session re-evaluation in FortiOS 7.6 are correct? (Choose two.)",
    "options": [
      "With the default `firewall-session-dirty check-all`, sessions affected by a firewall policy change are flushed and re-evaluated against the new policy",
      "`snat-route-change` is disabled by default",
      "`preserve-session-route` is configured under `config system global`",
      "The `dirty` flag means the session is offloaded and can no longer be re-evaluated",
      "SNAT sessions are always moved to the new best route immediately after any routing change"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **check-all**: correct (7.6 CLI Reference: all sessions affected by a policy change are flushed and re-evaluated when new packets arrive). `check-new` lets established sessions continue; `check-policy-option` decides per policy.\n* **snat-route-change disable**: correct.\n* **preserve-session-route location**: wrong; it's per interface under `config system interface`.\n* **dirty = offloaded**: wrong; `dirty` means flagged for re-evaluation; `npu` indicates offload.\n* **SNAT always moved**: wrong; SNAT sessions keep their route while the old route is active unless `snat-route-change` is enabled.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-072",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "A company is building an SD-WAN with one hub, 200 spokes and two overlays per spoke. It wants the smallest number of routing sessions, automatic use of both overlays by SD-WAN rules, and a later migration to ADVPN. Which routing design should the architect choose?",
    "options": [
      "iBGP on loopback, with the hub as route reflector using a neighbor group and a neighbor range for the spoke loopbacks",
      "OSPF area 0 over all tunnels, with `point-to-multipoint` interfaces on the hub",
      "iBGP per overlay with one `config neighbor` entry per spoke tunnel on the hub",
      "Static routes on every spoke for every other spoke LAN, using `sdwan-zone` for the overlays"
    ],
    "answer": [
      0
    ],
    "explanation": "BGP on loopback gives **one session per spoke** (200 instead of 400 for BGP per overlay), resolves routes recursively over both overlays (so SD-WAN rules can use either), and is the design Fortinet pairs with ADVPN (reflected routes keep the remote spoke's loopback as next hop). Neighbor groups and a neighbor range avoid 200 neighbor entries.\n\n* **OSPF**: floods every spoke's LSAs to every spoke and doesn't carry communities/route tags; it's the LAN-side protocol in Fortinet designs.\n* **BGP per overlay with static neighbors**: twice the sessions and hundreds of neighbor entries.\n* **Static routes**: thousands of routes to maintain and no dynamic failover.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-073",
    "topic": "4.4",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Rule 4 should send Internet traffic from the guest VLAN to the hub over HUB1-VPN1 (`priority-members 3`). The hub advertises a default route over iBGP. Guest traffic still leaves through port1 and port2. Why?",
    "exhibit": "FGT-Spoke1 # get router info routing-table database | grep -A3 \"0.0.0.0/0\"\nS    *> 0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]\n     *>           [1/0] via 198.51.100.1, port2, [1/0]\nB       0.0.0.0/0 [200/0] via 172.16.0.254 (recursive via HUB1-VPN1 tunnel 192.0.2.101), 00:52:10",
    "options": [
      "The iBGP default route loses to the static default (distance 200 vs 1) and isn't in the FIB, so no route to the destination exists through HUB1-VPN1 and rule 4 can't use it",
      "SD-WAN rules can't send Internet traffic over IPsec members",
      "Recursive BGP routes are never eligible for SD-WAN rules",
      "Rule 4 needs `set mode sla` because manual rules ignore BGP routes"
    ],
    "answer": [
      0
    ],
    "explanation": "The routing **database** holds both defaults, but only the selected (`>`) and FIB (`*`) static routes are installed; the BGP default (distance 200) isn't. The FIB check for rule 4 needs a route to the destination **through HUB1-VPN1**, which doesn't exist, so the rule is skipped and the implicit rule uses port1/port2. Fixes: a static route for the guest destinations (or a default) through the HUB1 zone with matching distance/priority, a lower BGP distance, or `gateway`/`default` options as a last resort.\n\n* **No Internet over IPsec**: SD-WAN rules can steer any traffic over any member that has a route.\n* **Recursive routes ineligible**: recursive BGP routes are normal in BGP-on-loopback designs once they are in the FIB.\n* **mode sla**: the strategy doesn't change the FIB check.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-074",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What happens to traffic from 10.1.1.0/24 to 10.0.1.10 on FGT-Spoke1?",
    "exhibit": "FGT-Spoke1 # show router policy\nconfig router policy\n    edit 1\n        set input-device \"port3\"\n        set src \"10.1.1.0/255.255.255.0\"\n        set dst \"10.0.0.0/255.0.0.0\"\n        set action deny\n    next\nend\n\nFGT-Spoke1 # show system sdwan | grep -A6 \"edit 1\"\n        edit 1\n            set name \"CORP\"\n            set mode sla\n            set dst \"DC_NET\"\n            set src \"BRANCH_LAN\"\n            set priority-members 3 4",
    "options": [
      "It is routed by the routing table, because a policy route with `action deny` stops the policy route search, so SD-WAN rule 1 is never evaluated",
      "It is dropped, because the policy route denies it",
      "It matches SD-WAN rule 1, because SD-WAN rules are evaluated before policy routes",
      "It matches SD-WAN rule 1, because `action deny` only skips the policy route itself"
    ],
    "answer": [
      0
    ],
    "explanation": "In `config router policy`, `action deny` means **\"do not search the policy route table\"** (CLI Reference). Matching traffic skips the remaining policy routes, ISDB routes and SD-WAN rules and goes straight to the routing table. It is not a firewall deny.\n\n* **Dropped**: policy routes never drop traffic; firewall policies do.\n* **SD-WAN first**: policy routes are evaluated before SD-WAN rules.\n* **Skips only itself**: the whole policy route table, including SD-WAN rules, is skipped for matching traffic.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-075",
    "topic": "4.4",
    "type": "single",
    "difficulty": 3,
    "stem": "A spoke's SD-WAN rule moves corporate traffic from HUB1-VPN1 to HUB1-VPN2 when VPN1 fails the SLA, but the hub keeps sending the replies over HUB1-VPN1, which is now degraded. Which design change addresses the root cause?",
    "options": [
      "Make the hub's routes back to the spoke follow overlay health, for example with embedded SLA information in the spokes' probes and `priority-in-sla`/`priority-out-sla` on the hub",
      "Enable asymmetric routing on both FortiGates so the replies can arrive on any tunnel",
      "Enable `snat-route-change` on the hub",
      "Increase `link-cost-threshold` on the spoke's rule so it moves less often"
    ],
    "answer": [
      0
    ],
    "explanation": "The problem is **return-path symmetry**: the spoke's SD-WAN decision isn't known to the hub, whose routing still prefers VPN1. Fortinet's mechanisms make the hub's routes reflect the spoke's view of each overlay: embedded SLA in ICMP probes (`embed-measured-health` on the spoke, `detect-mode remote` with `priority-in-sla`/`priority-out-sla` on the hub), or BGP communities with `route-map-out-preferable` via `config system sdwan` → `config neighbor`.\n\n* **Asymmetric routing**: removes stateful protection and doesn't stop replies using the degraded tunnel.\n* **snat-route-change**: overlay traffic isn't NATed, and the hub's route doesn't change anyway.\n* **link-cost-threshold**: applies to best quality rules and only reduces how often the spoke moves.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-076",
    "topic": "4.4",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which `config system global` option makes existing SNAT sessions perform a new route lookup (and get a new SNAT) when the routing table changes? Give the option name.",
    "answer": [
      "snat-route-change",
      "set snat-route-change enable"
    ],
    "explanation": "`set snat-route-change enable` (default disable). Without it, SNAT sessions keep using their outbound interface after a routing change as long as the old route is still active. The non-SNAT counterpart is per interface: `preserve-session-route enable` keeps routes instead of re-evaluating them.",
    "lesson": "4.4-sessions-routing-design"
  },
  {
    "id": "d4-077",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Traffic from port3 that matches policy route 2 still follows the routing table. Why?",
    "exhibit": "FGT-Spoke1 # show router policy 2\nconfig router policy\n    edit 2\n        set input-device \"port3\"\n        set src \"10.1.3.0/255.255.255.0\"\n        set dst \"0.0.0.0/0.0.0.0\"\n        set gateway 192.0.2.1\n        set output-device \"port2\"\n    next\nend\n\nFGT-Spoke1 # get router info routing-table all | grep port2\nC       198.51.100.0/24 is directly connected, port2",
    "options": [
      "The gateway 192.0.2.1 isn't routable over port2, so the policy route doesn't match and the FortiGate continues to the routing table",
      "Policy routes need `set action permit` to be configured explicitly",
      "A policy route can't use `0.0.0.0/0.0.0.0` as destination",
      "Policy routes apply only to traffic that doesn't match an SD-WAN rule"
    ],
    "answer": [
      0
    ],
    "explanation": "Even with both `gateway` and `output-device` set, FortiOS must find a route showing the gateway is reachable over that interface. port2 only has 198.51.100.0/24 connected, and 192.0.2.1 is not in it, so the policy route is skipped and lookup continues down the list, then to the routing table.\n\n* **action permit**: it is the default (`permit` = use this policy route for forwarding).\n* **0.0.0.0/0 destination**: valid; it's the default in the GUI example.\n* **After SD-WAN rules**: policy routes come **before** SD-WAN rules.",
    "lesson": "4.4-sdwan-routing-principles"
  },
  {
    "id": "d4-078",
    "topic": "4.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which SD-WAN rule and member did FortiOS choose for this session?",
    "exhibit": "FGT-Spoke1 # diagnose sys session list\nsession info: proto=6 proto_state=01 duration=412 expire=3598 timeout=3600 flags=00000000 socktype=0 sockport=0 av_idx=0 use=4\n...\nclass_id=0 ha_id=0 policy_dir=0 tunnel=HUB1-VPN2/ vlan_cos=0/255\nstate=log may_dirty f00\n...\norgin->sink: org pre->post, reply pre->post dev=5->20/20->5 gwy=0.0.0.0/10.1.1.20\nhook=pre dir=org act=noop 10.1.1.20:51544->10.0.1.10:443(0.0.0.0:0)\nhook=post dir=reply act=noop 10.0.1.10:443->10.1.1.20:51544(0.0.0.0:0)\nmisc=0 policy_id=2 pol_uuid_idx=531 auth_info=0 chk_client_info=0 vd=0\nsdwan_mbr_seq=4 sdwan_service_id=1\n\nFGT-Spoke1 # diagnose sys sdwan member | grep HUB1\nMember(3): interface: HUB1-VPN1, flags=0x0 , gateway: 0.0.0.0, priority: 1 1024, weight: 0\nMember(4): interface: HUB1-VPN2, flags=0x0 , gateway: 0.0.0.0, priority: 1 1024, weight: 0",
    "options": [
      "SD-WAN rule 1, member 4 (HUB1-VPN2), without NAT",
      "SD-WAN rule 4, member 1 (port1), with SNAT",
      "The implicit rule, member 2, because sdwan_service_id counts from 0",
      "Firewall policy 1, member 4, with destination NAT"
    ],
    "answer": [
      0
    ],
    "explanation": "`sdwan_service_id=1` is the SD-WAN **rule ID** and `sdwan_mbr_seq=4` the **member sequence number**, which `diagnose sys sdwan member` maps to HUB1-VPN2. The egress index 20 and `tunnel=HUB1-VPN2/` agree. Both hooks are `act=noop`, so no NAT is applied. The firewall policy is 2 (`policy_id=2`).\n\n* **Rule 4, member 1**: swaps the two fields.\n* **Implicit rule**: `sdwan_service_id` carries the rule ID itself (rule IDs are 1-4000), not a zero-based index, so 1 is rule 1; and member 2 contradicts `sdwan_mbr_seq=4`.\n* **Policy 1, DNAT**: the policy is 2 and there is no dnat action.",
    "lesson": "4.4-sessions-routing-design"
  }
];
