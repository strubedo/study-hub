// Domain 4 — Rules and routing. Original flashcards for FortiOS 7.6 (generated data).
export default [
  {
    "id": "d4-f001",
    "topic": "4.1",
    "front": "FortiOS default OSPF `auto-cost-ref-bandwidth`?",
    "back": "**1000 Mbps** (IOS: 100 Mbps). A 100 Mbps link costs 10 on FortiOS and 1 on IOS. Align it in mixed networks."
  },
  {
    "id": "d4-f002",
    "topic": "4.1",
    "front": "What does `cost 0` mean on a FortiOS `ospf-interface`?",
    "back": "Auto-cost: reference bandwidth / interface speed (minimum 1). It does not make the interface passive."
  },
  {
    "id": "d4-f003",
    "topic": "4.1",
    "front": "Default metric and type of routes redistributed into OSPF with no metric set?",
    "back": "`default-metric` **10**, `metric-type` **2** (E2). IOS uses 20 for most sources."
  },
  {
    "id": "d4-f004",
    "topic": "4.1",
    "front": "OSPF distances on FortiOS?",
    "back": "`distance`, `distance-intra-area`, `distance-inter-area`, `distance-external`: all **110** by default."
  },
  {
    "id": "d4-f005",
    "topic": "4.1",
    "front": "Default `network-type` of an `ospf-interface`, even on IPsec tunnels?",
    "back": "**broadcast**, whatever the interface type. Set `point-to-point` on both ends of a tunnel. (A tunnel with no `ospf-interface` entry doesn't elect a DR.)"
  },
  {
    "id": "d4-f006",
    "topic": "4.1",
    "front": "`default-information-originate enable` vs `always`?",
    "back": "`enable` advertises a default only if one is in the routing table; `always` advertises it regardless. Default: `disable`."
  },
  {
    "id": "d4-f007",
    "topic": "4.1",
    "front": "OSPF neighbor stuck in ExStart/Exchange?",
    "back": "MTU mismatch in DD packets. Fix the MTU or `set mtu-ignore enable` on the `ospf-interface`."
  },
  {
    "id": "d4-f008",
    "topic": "4.1",
    "front": "FortiOS access list rule with `exact-match disable` (default) matches what?",
    "back": "The prefix **and every more-specific prefix** inside it. `exact-match enable` = that prefix only; `wildcard` = IOS-style."
  },
  {
    "id": "d4-f009",
    "topic": "4.1",
    "front": "What does OSPF `distribute-list-in` do?",
    "back": "Stops matching OSPF routes from being **installed** on this FortiGate. LSAs are still in the LSDB and still flooded."
  },
  {
    "id": "d4-f010",
    "topic": "4.1",
    "front": "OSPF over IPsec: what must the tunnel interface have?",
    "back": "An IP address (`set ip` + `set remote-ip`) inside a `config network` prefix; usually `network-type point-to-point` and an explicit `cost`."
  },
  {
    "id": "d4-f011",
    "topic": "4.2",
    "front": "FortiOS BGP distances?",
    "back": "eBGP **20** (`distance-external`), iBGP **200** (`distance-internal`), local **200** (`distance-local`)."
  },
  {
    "id": "d4-f012",
    "topic": "4.2",
    "front": "Default `send-community` on a FortiOS BGP neighbor?",
    "back": "**both** (standard and extended). IOS sends none by default."
  },
  {
    "id": "d4-f013",
    "topic": "4.2",
    "front": "Default neighbor `advertisement-interval`?",
    "back": "**30 s** for iBGP and eBGP (IOS iBGP: 0). Hubs often set 1 s."
  },
  {
    "id": "d4-f014",
    "topic": "4.2",
    "front": "What do `ebgp-multipath` / `ibgp-multipath` default to?",
    "back": "**disable**. Enable to install equal BGP paths (still capped by `ecmp-max-paths`, default 255)."
  },
  {
    "id": "d4-f015",
    "topic": "4.2",
    "front": "What does `network-import-check` (default enable) do?",
    "back": "A `config network` prefix is advertised only if the same prefix exists in the routing table."
  },
  {
    "id": "d4-f016",
    "topic": "4.2",
    "front": "What does `recursive-next-hop enable` allow?",
    "back": "Resolving a BGP next hop through **another BGP route** (one level). Default disable. Needed for spoke-to-spoke routes in BGP on loopback."
  },
  {
    "id": "d4-f017",
    "topic": "4.2",
    "front": "BGP best-path order on FortiOS (first six)?",
    "back": "Weight > local preference > locally originated > shortest AS path > lowest origin > lowest MED."
  },
  {
    "id": "d4-f018",
    "topic": "4.2",
    "front": "How do loopbacks become reachable in BGP on loopback?",
    "back": "Phase 1 `exchange-interface-ip enable` + `exchange-ip-addr4 <loopback>`: IKE installs routes to the peer loopback (distance **15**, priority **1**)."
  },
  {
    "id": "d4-f019",
    "topic": "4.2",
    "front": "Hub objects for dynamic BGP peers?",
    "back": "`config neighbor-group` (all neighbor settings) + `config neighbor-range` (source prefix → group). The range must cover the spokes' source addresses."
  },
  {
    "id": "d4-f020",
    "topic": "4.2",
    "front": "Why separate hub loopbacks for BGP and health checks?",
    "back": "Health checks install per-member kernel routes to their server that persist when probes fail; BGP to the same IP could follow a dead tunnel."
  },
  {
    "id": "d4-f021",
    "topic": "4.2",
    "front": "BFD defaults on FortiOS?",
    "back": "`bfd-desired-min-tx 250`, `bfd-required-min-rx 250`, `bfd-detect-mult 3`; BFD disabled by default. No echo mode."
  },
  {
    "id": "d4-f022",
    "topic": "4.2",
    "front": "BGP graceful restart settings?",
    "back": "`graceful-restart enable` + neighbor `capability-graceful-restart enable`. Restart time 120 s, stale path 360 s, update delay 120 s."
  },
  {
    "id": "d4-f023",
    "topic": "4.2",
    "front": "Does a FortiOS route reflector change the next hop of reflected routes?",
    "back": "No, unless `next-hop-self-rr enable`. Keeping the remote spoke as next hop is what ADVPN needs."
  },
  {
    "id": "d4-f024",
    "topic": "4.3",
    "front": "Policy route precedence in FortiOS 7.6?",
    "back": "`config router policy` > ISDB routes > SD-WAN rules; then the routing table (implicit rule)."
  },
  {
    "id": "d4-f025",
    "topic": "4.3",
    "front": "Two FIB checks before an SD-WAN rule uses a member?",
    "back": "Best FIB match for the destination is an SD-WAN member, **and** a route to the destination exists through that member."
  },
  {
    "id": "d4-f026",
    "topic": "4.3",
    "front": "Default implicit rule `load-balance-mode`?",
    "back": "**source-ip-based**. Others: weight-based, usage-based, source-dest-ip-based, measured-volume-based."
  },
  {
    "id": "d4-f027",
    "topic": "4.3",
    "front": "SD-WAN rule evaluation order?",
    "back": "Top-down, first match (GUI order / `move`), not by rule ID. Implicit rule always last."
  },
  {
    "id": "d4-f028",
    "topic": "4.3",
    "front": "Default `link-cost-threshold` and its effect?",
    "back": "**10**%: in best quality, the first configured member's metric is divided by 1.1, giving it an advantage."
  },
  {
    "id": "d4-f029",
    "topic": "4.3",
    "front": "Lowest cost (SLA) member election?",
    "back": "Members meeting the SLA first, then lowest `cost`, then tie-break/configured order."
  },
  {
    "id": "d4-f030",
    "topic": "4.3",
    "front": "CLI `mode` values for rule strategies?",
    "back": "Manual `manual` (default), Best quality `priority`, Lowest cost `sla`, Automatic `auto`; load balancing = `load-balance enable`."
  },
  {
    "id": "d4-f031",
    "topic": "4.3",
    "front": "Application steering learning phase?",
    "back": "First session doesn't match; IPS identifies the app and learns destination IP/protocol/port; entries expire after **8 h** without hits."
  },
  {
    "id": "d4-f032",
    "topic": "4.3",
    "front": "Command to see learned application 3-tuples?",
    "back": "`diagnose sys sdwan internet-service-app-ctrl-list [app-id]`"
  },
  {
    "id": "d4-f033",
    "topic": "4.3",
    "front": "Does local-out traffic use SD-WAN rules by default?",
    "back": "No, routing table (`interface-select-method auto`). Set `sdwan` or `specify` per service."
  },
  {
    "id": "d4-f034",
    "topic": "4.3",
    "front": "Default `hash-mode` for load-balancing rules?",
    "back": "**round-robin** (also source-ip-based, source-dest-ip-based, inbandwidth, outbandwidth, bibandwidth)."
  },
  {
    "id": "d4-f035",
    "topic": "4.4",
    "front": "Static route with `set sdwan-zone \"WAN1\" \"WAN2\"` and no dst?",
    "back": "Default route with one next hop per zone member, using each member's gateway."
  },
  {
    "id": "d4-f036",
    "topic": "4.4",
    "front": "What are SD-WAN probe routes?",
    "back": "Dedicated, source-specific kernel routes to each health-check server via each member, using the member IP or `source`. Not in the RIB (`get router info kernel`); persist when probes fail."
  },
  {
    "id": "d4-f037",
    "topic": "4.4",
    "front": "`update-static-route` default and effect?",
    "back": "**enable**: when a member is dead, static routes through it are removed."
  },
  {
    "id": "d4-f038",
    "topic": "4.4",
    "front": "SD-WAN rule `gateway enable` + `default enable`?",
    "back": "Bypasses FIB checks; traffic goes to the member's configured gateway (members need a gateway). Both default disable."
  },
  {
    "id": "d4-f039",
    "topic": "4.4",
    "front": "Route map field that SD-WAN route-tag addresses match?",
    "back": "`set-route-tag` (routing-table route tag), not `set-tag`. Address: `set type route-tag` + `set route-tag <n>`."
  },
  {
    "id": "d4-f040",
    "topic": "4.4",
    "front": "Command listing prefixes per route tag?",
    "back": "`diagnose sys sdwan route-tag-list`"
  },
  {
    "id": "d4-f041",
    "topic": "4.4",
    "front": "Default behaviour of SNAT sessions after a routing change?",
    "back": "Keep their outbound interface while the old route is active. `set snat-route-change enable` (global) forces re-lookup."
  },
  {
    "id": "d4-f042",
    "topic": "4.4",
    "front": "Keep non-SNAT sessions on their route after routing changes?",
    "back": "`config system interface` → `set preserve-session-route enable` (flag `route_preserve`)."
  },
  {
    "id": "d4-f043",
    "topic": "4.4",
    "front": "TCP `proto_state` digits?",
    "back": "One per direction: 0 NONE, 1 ESTABLISHED, 2 SYN_SENT, 3 SYN & SYN/ACK, 4 FIN_WAIT, 5 TIME_WAIT, 6 CLOSE, 7 CLOSE_WAIT, 8 LAST_ACK, 9 LISTEN."
  },
  {
    "id": "d4-f044",
    "topic": "4.4",
    "front": "`may_dirty` vs `dirty`?",
    "back": "`may_dirty`: session may be re-evaluated. `dirty`: it has been flagged and the next packet triggers a new lookup."
  },
  {
    "id": "d4-f045",
    "topic": "4.4",
    "front": "`config router policy` with `set action deny`?",
    "back": "\"Do not search policy route table\": skips remaining policy routes and SD-WAN rules, uses the routing table. Not a drop."
  }
];
