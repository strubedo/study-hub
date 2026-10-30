// Domain 1 — SD-WAN architecture and concept. Original flashcards for FortiOS 7.6 (generated data).
export default [
  {
    "id": "d1-f001",
    "topic": "1.1",
    "front": "Which SD-WAN layer can only run on a FortiGate?",
    "back": "Control, data plane and security: zones, routing, health checks, steering and NGFW policy. Management (FortiManager/FortiAnalyzer) and network access (FortiSwitch/FortiAP) are optional."
  },
  {
    "id": "d1-f002",
    "topic": "1.1",
    "front": "The five pillars of Fortinet SD-WAN design?",
    "back": "Underlay, overlay, routing, security, SD-WAN."
  },
  {
    "id": "d1-f003",
    "topic": "1.1",
    "front": "DIA vs RIA?",
    "back": "DIA: local internet breakout through the branch underlays. RIA: internet traffic crosses the overlay and breaks out at the hub/DC."
  },
  {
    "id": "d1-f004",
    "topic": "1.1",
    "front": "Routing rule for DIA member default routes?",
    "back": "Same distance and priority on every member, so the routes form ECMP and SD-WAN rules, not the routing table, choose the link."
  },
  {
    "id": "d1-f005",
    "topic": "1.1",
    "front": "Licence needed for the SD-WAN Setup wizard?",
    "back": "SD-WAN Underlay and Application Monitoring (also needed for the FortiGuard SLA database). Missing on the FortiGate-VM trial."
  },
  {
    "id": "d1-f006",
    "topic": "1.1",
    "front": "What must you still create after the SD-WAN Setup wizard?",
    "back": "A default static route to the SD-WAN zone (and a firewall policy). The wizard handles at most two interfaces."
  },
  {
    "id": "d1-f007",
    "topic": "1.1",
    "front": "Default distance of a static route through an SD-WAN zone?",
    "back": "1 (ordinary static 10, DHCP default route 5). Change it with `set distance`."
  },
  {
    "id": "d1-f008",
    "topic": "1.1",
    "front": "GUI charts for SD-WAN traffic distribution?",
    "back": "Network > SD-WAN > SD-WAN Zones: Bandwidth, Volume and Sessions per member."
  },
  {
    "id": "d1-f009",
    "topic": "1.1",
    "front": "Traffic-log fields for the SD-WAN decision?",
    "back": "`vwlid` (rule ID), `vwlname` (rule name), `vwlquality` (member quality used by the rule)."
  },
  {
    "id": "d1-f010",
    "topic": "1.1",
    "front": "Log ID 0100022921?",
    "back": "\"Routing information changed\" (subtype system): a health check removed or restored a dead member's static routes."
  },
  {
    "id": "d1-f011",
    "topic": "1.1",
    "front": "Log ID 0113022925?",
    "back": "\"SDWAN SLA information\": periodic per-member SLA report, every `sla-fail-log-period` / `sla-pass-log-period` seconds (default 0 = off)."
  },
  {
    "id": "d1-f012",
    "topic": "1.2",
    "front": "Default SD-WAN zone?",
    "back": "`virtual-wan-link`. Members with no `set zone` are placed in it."
  },
  {
    "id": "d1-f013",
    "topic": "1.2",
    "front": "Can a firewall policy use an SD-WAN member as its interface?",
    "back": "No. Policies use zones. Put a member in its own zone if it needs its own policy."
  },
  {
    "id": "d1-f014",
    "topic": "1.2",
    "front": "Member `cost` vs `priority`?",
    "back": "`cost` (default 0) is used only by Lowest Cost (SLA) rules. `priority` (default 1) goes into the member route and SD-WAN rules, and a different value means no ECMP."
  },
  {
    "id": "d1-f015",
    "topic": "1.2",
    "front": "Member `source` vs `preferred-source`?",
    "back": "`source`: source IP of health-check probes on the member. `preferred-source`: source IP for local-out traffic routed through it."
  },
  {
    "id": "d1-f016",
    "topic": "1.2",
    "front": "Five implicit-rule `load-balance-mode` values?",
    "back": "`source-ip-based` (default), `weight-based`, `usage-based`, `source-dest-ip-based`, `measured-volume-based`."
  },
  {
    "id": "d1-f017",
    "topic": "1.2",
    "front": "Can weight 0 exclude a member from the implicit rule?",
    "back": "No. Weight and volume-ratio range 1–255 (an old 0 is treated as 1). Use a higher route priority instead."
  },
  {
    "id": "d1-f018",
    "topic": "1.3",
    "front": "Three parts of a performance SLA?",
    "back": "Health check (mode, protocol, servers, participants), SLA targets, link status (interval, failtime, recoverytime)."
  },
  {
    "id": "d1-f019",
    "topic": "1.3",
    "front": "Health-check timer defaults?",
    "back": "interval 500 ms, failtime 5, recoverytime 5: about 2.5 s to declare dead and 2.5 s to recover."
  },
  {
    "id": "d1-f020",
    "topic": "1.3",
    "front": "SLA target defaults and measurement windows?",
    "back": "Latency 5 ms, jitter 5 ms (last `probe-count` = 30 probes), packet loss 0% (last 100 probes)."
  },
  {
    "id": "d1-f021",
    "topic": "1.3",
    "front": "How many servers per health check, and when does it fail?",
    "back": "Up to two. The first is used and the second is the fallback. It fails only if both fail. A server can be in only one SLA."
  },
  {
    "id": "d1-f022",
    "topic": "1.3",
    "front": "Passive monitoring requirement?",
    "back": "Firewall policy with `passive-wan-health-measurement enable`, outgoing interface an SD-WAN zone (hardware offload disabled). Prefer-passive probes after 3 min without traffic."
  },
  {
    "id": "d1-f023",
    "topic": "1.3",
    "front": "Read `sla_map=0x5`",
    "back": "The member meets SLA targets 1 and 3 (bit 0 = ID 1, bit 2 = ID 3)."
  },
  {
    "id": "d1-f024",
    "topic": "1.3",
    "front": "Does out-of-SLA withdraw a member's routes?",
    "back": "No. Only a dead member loses its static routes (`update-static-route enable`, default). Out-of-SLA affects only SLA-aware rules."
  },
  {
    "id": "d1-f025",
    "topic": "1.3",
    "front": "Member in two health checks: when are its routes withdrawn?",
    "back": "Only when all of its health checks fail."
  },
  {
    "id": "d1-f026",
    "topic": "1.3",
    "front": "What do cascade interfaces do?",
    "back": "With `fail-detect` + `fail-alert-interfaces` and `update-cascade-interface enable`, the alert interfaces go down when all health-check members are dead."
  },
  {
    "id": "d1-f027",
    "topic": "1.3",
    "front": "Embedded SLA in ICMP probes: spoke and hub settings?",
    "back": "Spoke: `embed-measured-health enable`. Hub: `detect-mode remote`, `priority-in-sla` / `priority-out-sla`, `sla-id-redistribute`. BGP `recursive-inherit-priority`."
  },
  {
    "id": "d1-f028",
    "topic": "1.3",
    "front": "Which GUI protocols can a performance SLA use?",
    "back": "Ping, HTTP and DNS. tcp-echo, udp-echo, https, twamp, tcp-connect and ftp are CLI-only."
  }
];
