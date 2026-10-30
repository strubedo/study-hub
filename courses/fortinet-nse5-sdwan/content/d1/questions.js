// Domain 1 — SD-WAN architecture and concept. Original questions for FortiOS 7.6 (generated data).
export default [
  {
    "id": "d1-001",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Fortinet describes an SD-WAN solution in three layers. Which layer can be deployed only on a FortiGate?",
    "options": [
      "Control, data plane and security",
      "Management and orchestration",
      "Network access",
      "Logging and analytics"
    ],
    "answer": [
      0
    ],
    "explanation": "The **control, data plane and security** layer covers zones, routing, health checks, application-aware steering and NGFW policy. It runs only on a FortiGate, and it is the only layer that a minimal SD-WAN deployment needs.\n\n* **Management and orchestration** is FortiManager and FortiAnalyzer. It helps you scale but is optional.\n* **Network access** is FortiSwitch and FortiAP (SD-Branch).\n* **Logging and analytics** is not one of the three layers. It is a function inside management and orchestration (FortiAnalyzer).",
    "lesson": "1.1-sdwan-architecture-design"
  },
  {
    "id": "d1-002",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement describes how users at FGT-Branch1 reach the internet?",
    "exhibit": "Topology:\n  LAN 10.1.1.0/24 -- port3 [FGT-Branch1] port1 -- MPLS provider (private, no internet)\n                                 HUB1-VPN1 = IPsec tunnel over port1 to FGT-HQ\n  FGT-HQ has two ISP links and NATs branch traffic to the internet.\n\nFGT-Branch1 # show system sdwan\nconfig system sdwan\n    set status enable\n    config zone\n        edit \"virtual-wan-link\"\n        next\n        edit \"overlay\"\n        next\n    end\n    config members\n        edit 1\n            set interface \"HUB1-VPN1\"\n            set zone \"overlay\"\n        next\n    end\nend\n\nFGT-Branch1 # show firewall policy 2\nconfig firewall policy\n    edit 2\n        set name \"LAN-Internet\"\n        set srcintf \"port3\"\n        set dstintf \"overlay\"\n        set action accept\n        set srcaddr \"all\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"ALL\"\n    next\nend",
    "options": [
      "Remote internet access (RIA): internet traffic follows the overlay to FGT-HQ and breaks out there.",
      "Direct internet access (DIA): internet traffic leaves locally through the branch underlay.",
      "Cloud on-ramp: the IPsec tunnel terminates on a cloud provider gateway.",
      "SD-WAN is not involved, because a zone with a single member cannot carry internet traffic."
    ],
    "answer": [
      0
    ],
    "explanation": "The branch's only transport is MPLS, which has no internet access. The internet policy sends traffic to the **overlay** zone, and FGT-HQ breaks it out. That is **RIA**: internet traffic is backhauled across the overlay to the hub.\n\n* **DIA** would use a local internet underlay, with a policy to the underlay zone. This branch has no local internet link.\n* **Cloud on-ramp**: the tunnel goes to FGT-HQ, not to a cloud gateway.\n* **Single-member zone**: a zone with one member is valid. Fortinet recommends it when a link needs its own policy.",
    "lesson": "1.1-sdwan-architecture-design"
  },
  {
    "id": "d1-003",
    "topic": "1.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each pillar of Fortinet's five-pillar SD-WAN design approach to the question it answers.",
    "pairs": [
      [
        "Underlay",
        "Which WAN transports are available, and what bandwidth, cost and quality does each have?"
      ],
      [
        "Overlay",
        "Which tunnels interconnect the sites, and how will they scale as sites are added?"
      ],
      [
        "Routing",
        "How does each site learn every possible path to each destination?"
      ],
      [
        "Security",
        "Which zones, policies and inspection protect each path?"
      ],
      [
        "SD-WAN",
        "Which performance SLAs and rules steer each type of traffic?"
      ]
    ],
    "explanation": "The five pillars are **underlay** (links and their characteristics, which also become the SLA baselines), **overlay** (site-to-site tunnels: manual tunnels or ADVPN at scale), **routing** (static routes to zones for simple sites, dynamic routing across overlays for many sites), **security** (zones and policies, including the inspection on each path) and **SD-WAN** (the intelligence: health checks and rules that express business intent).",
    "lesson": "1.1-sdwan-architecture-design"
  },
  {
    "id": "d1-004",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. An administrator ran the SD-WAN Setup wizard on FGT-Branch1 and then created a firewall policy from port3 to the underlay zone with NAT enabled. `diagnose sys sdwan health-check` shows both members alive, but LAN users can't reach the internet. What is the cause?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    set status enable\n    config zone\n        edit \"virtual-wan-link\"\n        next\n        edit \"underlay\"\n        next\n    end\n    config members\n        edit 1\n            set interface \"port1\"\n            set zone \"underlay\"\n            set gateway 203.0.113.1\n        next\n        edit 2\n            set interface \"port2\"\n            set zone \"underlay\"\n            set gateway 198.51.100.1\n        next\n    end\n    config health-check\n        edit \"Internet_HC\"\n            set server \"198.51.100.10\"\n            set members 1 2\n        next\n    end\nend\n\nFGT-Branch1 # get router info routing-table all\n...\nRouting table for VRF=0\nC       10.1.1.0/24 is directly connected, port3\nC       198.51.100.0/29 is directly connected, port2\nC       203.0.113.0/29 is directly connected, port1",
    "options": [
      "There is no static route to the underlay zone. The wizard does not create one, so the FortiGate has no default route.",
      "The members must be in the virtual-wan-link zone before a firewall policy can use them.",
      "The health check has no SLA target, so both members are excluded from the implicit rule.",
      "The gateways must be learned through DHCP when the wizard is used."
    ],
    "answer": [
      0
    ],
    "explanation": "The routing table has only connected routes. SD-WAN members don't create routes on their own. You need a static route with `set sdwan-zone \"underlay\"` (0.0.0.0/0 by default, distance 1), which then lists one next hop per member. Fortinet's wizard instructions end with \"configure a default static route for the SD-WAN interface\". Health checks still work because SD-WAN sends probes through each member using dedicated probe routes.\n\n* **virtual-wan-link**: any zone works. Members in a custom zone are normal.\n* **No SLA target**: SLA targets are optional. Without them, members are still used (link monitoring only).\n* **DHCP**: the wizard lets you set the gateway as Dynamic or Specify, and static gateways are valid.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-005",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator logs in to a FortiGate running FortiOS 7.6 and can't find the SD-WAN Setup wizard on the Network > SD-WAN > SD-WAN Zones page. What is the most likely reason?",
    "options": [
      "The FortiGate doesn't have a valid SD-WAN Underlay and Application Monitoring licence.",
      "SD-WAN is still disabled, and the wizard appears only after `set status enable`.",
      "The wizard is available only on FortiManager.",
      "More than two physical interfaces are configured on the FortiGate."
    ],
    "answer": [
      0
    ],
    "explanation": "The 7.6 Administration Guide states that the FortiGate needs a valid **SD-WAN Underlay and Application Monitoring** licence before the SD-WAN Setup wizard is visible. The same licence is needed for the FortiGuard SLA database. This is why the wizard is missing on the FortiGate-VM permanent trial.\n\n* **SD-WAN disabled**: the wizard is meant to start a configuration from nothing (*Begin SD-WAN setup wizard*), so it doesn't depend on SD-WAN already being enabled.\n* **FortiManager**: FortiManager has its own SD-WAN templates and overlay wizard, but the Setup wizard is a FortiGate GUI feature.\n* **More than two interfaces**: the wizard accepts at most two interfaces, but having more ports on the unit doesn't hide it.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-006",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Refer to the exhibit. The administrator must create one firewall policy that allows LAN users to reach the internet through both ISPs. Which outgoing interface should the policy use?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    set status enable\n    config zone\n        edit \"virtual-wan-link\"\n        next\n        edit \"underlay\"\n        next\n    end\n    config members\n        edit 1\n            set interface \"port1\"\n            set zone \"underlay\"\n            set gateway 203.0.113.1\n        next\n        edit 2\n            set interface \"port2\"\n            set zone \"underlay\"\n            set gateway 198.51.100.1\n        next\n    end\nend",
    "options": [
      "underlay",
      "port1 and port2",
      "virtual-wan-link",
      "any"
    ],
    "answer": [
      0
    ],
    "explanation": "Firewall policies reference **SD-WAN zones, never individual members**. A policy to the zone `underlay` covers every member in it (port1 and port2), and the SD-WAN rules or implicit rule choose which member each session uses.\n\n* **port1 and port2**: SD-WAN members can't be used directly in policies.\n* **virtual-wan-link**: that is the default zone, but here it has no members, so the policy would match no traffic.\n* **any**: it would also match the members, but it is far broader than needed and isn't how SD-WAN policies are designed.",
    "lesson": "1.1-sdwan-architecture-design"
  },
  {
    "id": "d1-007",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator is designing DIA for branches that have two broadband ISPs each. Which two recommendations follow Fortinet's SD-WAN design guidance? (Choose two.)",
    "options": [
      "Give each member's default route the same distance and priority so that both are installed as ECMP routes, and let SD-WAN rules choose the link.",
      "Group both internet members into one underlay zone so that a single set of policies secures internet breakout.",
      "Use the default SLA targets (5 ms latency, 5 ms jitter, 0% loss), because they are Fortinet's recommended values for internet links.",
      "Place generic rules that match all destinations above application-specific SD-WAN rules.",
      "Use the same health-check server in two performance SLAs to compare different thresholds."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "For DIA, Fortinet's guidance is that each member's default route uses the **same distance and priority**, so both appear in the routing table and the **SD-WAN rules** make the decision. Members that need the same security should be **grouped into one zone** to keep the number of policies small.\n\n* **Default SLA targets**: 5/5/0 are deliberately strict placeholders. Tune targets to just below what the application tolerates.\n* **Generic rules first**: more specific rules (applications, internet services) must be above generic ones, because rules are evaluated top-down.\n* **Same server in two SLAs**: a server can be used in only one performance SLA. Use multiple SLA targets in one health check instead.",
    "lesson": "1.1-sdwan-architecture-design"
  },
  {
    "id": "d1-008",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about this session is correct?",
    "exhibit": "date=2026-10-27 time=10:42:18 eventtime=1793122938204511023 tz=\"-0700\" logid=\"0000000013\"\ntype=\"traffic\" subtype=\"forward\" level=\"notice\" vd=\"root\" srcip=10.1.1.25 srcport=51544\nsrcintf=\"port3\" srcintfrole=\"lan\" dstip=52.96.88.130 dstport=443 dstintf=\"port1\"\ndstintfrole=\"wan\" proto=6 action=\"close\" policyid=1 policyname=\"LAN-to-Internet\"\nservice=\"HTTPS\" vwlid=1 vwlname=\"Critical-DIA\"\nvwlquality=\"Seq_num(1 port1 underlay), alive, sla(0x1), gid(0), cfg_order(0), local cost(0), selected\"\nsentbyte=18342 rcvdbyte=402117",
    "options": [
      "It matched SD-WAN rule ID 1, Critical-DIA, which selected member 1 (port1) as the outgoing interface.",
      "It matched no SD-WAN rule, so the implicit rule hashed it to port1.",
      "It used firewall policy 1, and vwlid=1 shows that policy 1 is the first SD-WAN rule.",
      "port1 was out of SLA, so the session was forced through it as the last available member."
    ],
    "answer": [
      0
    ],
    "explanation": "In forward traffic logs, `vwlid` is the ID of the matched **SD-WAN rule** (service), `vwlname` is its name, and `vwlquality` gives the quality information the rule used, in the same form as a member line of `diagnose sys sdwan service4`. Here member sequence 1 (port1, zone underlay) was alive, met SLA target 1 (`sla(0x1)`) and was `selected`, which matches `dstintf=\"port1\"`.\n\n* **Implicit rule**: a named SD-WAN rule (Critical-DIA) matched the session.\n* **Policy vs rule**: `policyid` is the firewall policy. `vwlid` is an independent SD-WAN rule ID, and the two match here only by chance.\n* **Out of SLA**: `sla(0x1)` shows that port1 met SLA target 1, and the member is alive and selected.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-009",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What does this log message indicate?",
    "exhibit": "date=2026-10-27 time=08:03:51 eventtime=1793113431590008160 tz=\"-0700\" logid=\"0100022921\"\ntype=\"event\" subtype=\"system\" level=\"critical\" vd=\"root\" logdesc=\"Routing information changed\"\nname=\"Internet_HC\" interface=\"port2\" status=\"down\"\nmsg=\"Static route on interface port2 may be removed by health-check Internet_HC. Route: (198.51.100.2->198.51.100.10 ping-down)\"",
    "options": [
      "Internet_HC declared port2 dead, and because update-static-route is enabled, static routes through port2 are being withdrawn.",
      "port2 is alive but out of SLA, so its routes were moved to a higher priority.",
      "An administrator deleted the static route to the underlay zone.",
      "The physical link on port2 went down, and the health check has no effect on routing."
    ],
    "answer": [
      0
    ],
    "explanation": "Log ID **0100022921** (*Routing information changed*, subtype system, level critical) is written when a health check that has `update-static-route` enabled (the default) marks a member **dead** and removes the static routes on that interface. A matching `status=\"up\"` message (\"may be added by health-check\") follows on recovery.\n\n* **Out of SLA**: SLA failures are logged as 0113022923 *SDWAN status* events and never withdraw routes.\n* **Administrator deleted**: configuration changes produce configuration-change event logs, not health-check messages.\n* **Physical link down**: the message shows the probe (`ping-down`) failing. The cause could be anywhere along the path to 198.51.100.10, and the health check is what changes the routes.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-010",
    "topic": "1.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each FortiOS 7.6 log ID to the SD-WAN event it reports.",
    "pairs": [
      [
        "0113022923",
        "SDWAN status: a member's SLA state, the number of passing members, or a rule's member selection changed"
      ],
      [
        "0113022925",
        "SDWAN SLA information: periodic per-member latency, jitter and loss report"
      ],
      [
        "0113022924",
        "SDWAN volume status: a member enters or leaves conservative status under ratio-based balancing"
      ],
      [
        "0100022921",
        "Routing information changed: a health check removed or restored a member's static routes"
      ]
    ],
    "explanation": "* **0113022923** is the main *SDWAN status* event: messages such as `Member status changed. Member out-of-sla.`, `Number of pass member changed.`, `Service prioritized by SLA will be redirected...` and `Member link is unreachable or miss threshold. Stop forwarding traffic.`\n* **0113022925** is generated every `sla-fail-log-period` / `sla-pass-log-period` seconds (both default to 0, which means off).\n* **0113022924** reports volume or session-ratio balancing state.\n* **0100022921** is a *system* subtype event written when `update-static-route` withdraws or restores routes.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-011",
    "topic": "1.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default administrative distance of a static route whose interface is an SD-WAN zone (`set sdwan-zone`)? Enter the number.",
    "answer": [
      "1"
    ],
    "explanation": "A static route or default route through an SD-WAN zone gets **distance 1** by default, unlike an ordinary static route (10) or a DHCP-learned default route (5). You can change it with `set distance` in the route.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-012",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Which statement about the FortiOS 7.6 SD-WAN Setup wizard is correct?",
    "options": [
      "In the Interface step, you can add at most two underlay interfaces to the new or existing zone.",
      "In the Review step, it creates the default static route to the zone and a LAN firewall policy.",
      "It creates IPsec overlay tunnels to a hub and the matching SD-WAN rules.",
      "It is available on every FortiGate-VM, including the permanent trial licence."
    ],
    "answer": [
      0
    ],
    "explanation": "The wizard supports **a maximum of two interfaces**, added in the Interface step to a new or existing SD-WAN zone. Its steps are Interface, Networking, Performance SLA, Rule and Review.\n\n* **Static route and policy**: the wizard creates the zone, members, performance SLA and (optionally) a rule. You must add the default static route afterwards, and a policy.\n* **Overlays**: it configures underlays only. Overlay automation is the Fabric Overlay Orchestrator, or SD-WAN overlay templates on FortiManager.\n* **Trial**: it needs the SD-WAN Underlay and Application Monitoring licence, which the permanent trial doesn't have.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-013",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. One test PC (10.1.1.10) generates all the traffic in the lab. Both members are alive and the default route lists both members with [1/0]. No SD-WAN rules are configured. Why are all sessions using port1?",
    "exhibit": "Network > SD-WAN > SD-WAN Zones > Sessions (summary)\n  port1   100%   (37 sessions)\n  port2     0%   (0 sessions)\n\nFGT-Branch1 # show full-configuration system sdwan | grep load-balance-mode\n    set load-balance-mode source-ip-based",
    "options": [
      "The implicit rule hashes on source IP, so every session from one client is sent to the same member.",
      "port2 is out of SLA, so the implicit rule avoids it.",
      "port2 has a higher cost, so the implicit rule prefers port1.",
      "The implicit rule always uses the first member until its spillover threshold is reached."
    ],
    "answer": [
      0
    ],
    "explanation": "With no rules, traffic uses the **implicit rule**, whose default `load-balance-mode` is **source-ip-based**: sessions from the same source IP always take the same path. With a single client, one member gets 100%. Test with several source addresses, or change the mode, to see distribution.\n\n* **Out of SLA**: the implicit rule doesn't use SLA state. It balances across the members that have routes.\n* **Cost**: cost is used only by Lowest Cost (SLA) rules.\n* **Spillover**: that is `usage-based` mode, which isn't configured here.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-014",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Where does the default dashboard set of FortiOS 7.6 (Optimal template) place the widget that summarises SD-WAN status, including ADVPN shortcut information?",
    "options": [
      "Dashboard > Network",
      "Dashboard > Status",
      "Dashboard > Security",
      "Dashboard > Assets & Identities"
    ],
    "answer": [
      0
    ],
    "explanation": "The **Network** dashboard contains the Static & Dynamic Routing, DHCP, **SD-WAN**, IPsec and IP Pool Utilization widgets. The SD-WAN widget summarises SD-WAN status, including ADVPN shortcuts. Like the other Network dashboard widgets, it can be expanded to full screen and saved as a monitor.\n\n* **Status** shows system information, licences, CPU, memory and sessions.\n* **Security** shows compromised hosts and threats.\n* **Assets & Identities** shows users and devices.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-015",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 1,
    "stem": "An administrator has enabled SD-WAN and added port1 and port2 to the zone `underlay`. Besides the SD-WAN members and zone, which two objects are required before LAN traffic can be forwarded to the internet? (Choose two.)",
    "options": [
      "A static route whose interface is the SD-WAN zone",
      "A firewall policy from the LAN interface to the SD-WAN zone",
      "An SD-WAN rule that matches all destinations",
      "A performance SLA with at least one SLA target",
      "A FortiGuard SLA database subscription"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Traffic needs a **route** (`config router static` with `set sdwan-zone \"underlay\"`) and a **firewall policy** that allows it (LAN to `underlay`, normally with NAT).\n\n* **SD-WAN rule**: optional. Without rules, the implicit rule balances sessions across the ECMP routes.\n* **Performance SLA**: strongly recommended for failover, but not required for forwarding, and SLA targets are optional even in a health check.\n* **FortiGuard SLA database**: an optional, licensed source of probe targets.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-016",
    "topic": "1.1",
    "type": "order",
    "difficulty": 2,
    "stem": "Put the steps of the FortiOS 7.6 SD-WAN Setup wizard in the order the wizard presents them.",
    "items": [
      "Interface: choose or create the zone and add up to two underlay interfaces",
      "Networking: set each member's gateway, cost and fallback priority",
      "Performance SLA: choose a FortiGuard SLA database target or a manual server",
      "Rule: choose an interface selection strategy, or skip and use the implicit rule",
      "Review: check the zone, members, performance SLA and rule, then apply"
    ],
    "explanation": "The wizard goes **Interface → Networking → Performance SLA → Rule → Review**. After it finishes you still create the default static route to the zone (Network > Static Routes) and a firewall policy.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-017",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "A company replaces its MPLS circuits with IPsec tunnels built over local broadband links, and lets the FortiGate choose the best tunnel for each application. In SD-WAN terms, what are the IPsec tunnels?",
    "options": [
      "Overlays: virtual links built on top of the underlay transports",
      "Underlays: the physical transports that SD-WAN consolidates",
      "Performance SLAs: the objects that measure link quality",
      "Implicit rules: the default path when no SD-WAN rule matches"
    ],
    "answer": [
      0
    ],
    "explanation": "**Underlays** are the transports themselves (broadband, MPLS, LTE). **Overlays** are tunnels built on them for site-to-site traffic. Both become SD-WAN members and are usually grouped into `underlay` and `overlay` zones.\n\n* **Performance SLAs** measure members. They aren't links.\n* **The implicit rule** is a steering behaviour, not a link type.",
    "lesson": "1.1-sdwan-architecture-design"
  },
  {
    "id": "d1-018",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What can the administrator conclude about port2?",
    "exhibit": "Network > SD-WAN > Performance SLAs (summary)\nName         Detect Server    Packet Loss          Latency               Jitter\nInternet_HC  198.51.100.10    port1 [up]  0.00%    port1 [up]  18.20ms   port1 [up] 1.05ms\n                              port2 [up]  3.00%    port2 [up] 140.75ms   port2 [up] 9.33ms\nSLA target 1: latency 100 ms, jitter 30 ms, packet loss 1%\n[up] = green up arrow",
    "options": [
      "port2 answers the probes, so it is alive, but it doesn't meet SLA target 1 because its latency and packet loss are above the thresholds.",
      "port2 is dead, and its static routes have been withdrawn.",
      "port2 meets SLA target 1, because the green arrow shows that the SLA is met.",
      "port2 is out of SLA, so its static routes have been withdrawn by update-static-route."
    ],
    "answer": [
      0
    ],
    "explanation": "The green arrow shows that the member **responded at the last status check** (alive). It doesn't show whether SLA targets are met. port2's 140.75 ms is above 100 ms and its 3% loss is above 1%, so it is **alive but out of SLA** for target 1.\n\n* **Dead**: a dead member shows a red arrow.\n* **Arrow = SLA met**: Fortinet states explicitly that the arrow doesn't indicate whether the health checks are being met.\n* **Routes withdrawn**: `update-static-route` acts only on **dead** members. Out-of-SLA members keep their routes, and only SLA-aware rules avoid them.",
    "lesson": "1.1-basic-dia-setup-monitoring"
  },
  {
    "id": "d1-019",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Both IPsec tunnels are up, and `diagnose sys sdwan health-check DC_HC` shows HUB1-VPN1 and HUB1-VPN2 alive. Why does the route to the data centre use only HUB1-VPN1?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    set status enable\n    config zone\n        edit \"virtual-wan-link\"\n        next\n        edit \"underlay\"\n        next\n        edit \"overlay\"\n        next\n    end\n    config members\n        edit 1\n            set interface \"port1\"\n            set zone \"underlay\"\n            set gateway 203.0.113.1\n        next\n        edit 2\n            set interface \"port2\"\n            set zone \"underlay\"\n            set gateway 198.51.100.1\n        next\n        edit 3\n            set interface \"HUB1-VPN1\"\n            set zone \"overlay\"\n        next\n        edit 4\n            set interface \"HUB1-VPN2\"\n        next\n    end\nend\n\nFGT-Branch1 # show router static 2\nconfig router static\n    edit 2\n        set dst 10.100.0.0 255.255.0.0\n        set sdwan-zone \"overlay\"\n    next\nend\n\nFGT-Branch1 # get router info routing-table static\nRouting table for VRF=0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, port1\n                  [1/0] via 198.51.100.1, port2\nS       10.100.0.0/16 [1/0] via HUB1-VPN1 tunnel 172.16.1.1 vrf 0",
    "options": [
      "Member 4 has no zone configured, so it is in virtual-wan-link, and the route references only the overlay zone.",
      "An SD-WAN zone can install only one next hop per static route.",
      "IPsec members need `set gateway` before a zone route can use them.",
      "HUB1-VPN2 has a higher cost than HUB1-VPN1, so it is left out of the route."
    ],
    "answer": [
      0
    ],
    "explanation": "A member without `set zone` is placed in the default zone **virtual-wan-link**, and `show` hides that default. The static route uses `sdwan-zone \"overlay\"`, so it creates next hops only through overlay's members, which here is just HUB1-VPN1. Add `set zone \"overlay\"` to member 4, or reference both zones in the route.\n\n* **One next hop**: a zone route installs a next hop for every member of the zone (ECMP).\n* **Gateway on IPsec members**: tunnel members don't need a gateway, and member 3 works without one.\n* **Cost**: cost is used only by Lowest Cost (SLA) rules and never affects routes. No cost is configured anyway.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-020",
    "topic": "1.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the name of the default SD-WAN zone that FortiOS assigns to a member when no zone is specified?",
    "answer": [
      "virtual-wan-link"
    ],
    "explanation": "Members without `set zone` go to **virtual-wan-link**. You can create other zones (for example `underlay` and `overlay`) and move members between zones.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-021",
    "topic": "1.2",
    "type": "multi",
    "difficulty": 3,
    "stem": "Refer to the exhibit. No SD-WAN rules are configured, and Internet_HC (update-static-route enabled) shows both members alive. Which two statements are true? (Choose two.)",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    set status enable\n    config zone\n        edit \"virtual-wan-link\"\n        next\n        edit \"underlay\"\n        next\n    end\n    config members\n        edit 1\n            set interface \"port1\"\n            set zone \"underlay\"\n            set gateway 203.0.113.1\n        next\n        edit 2\n            set interface \"port2\"\n            set zone \"underlay\"\n            set gateway 198.51.100.1\n            set priority 10\n        next\n    end\n    ...\nend\n\nFGT-Branch1 # get router info routing-table all\n...\nRouting table for VRF=0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, port1\n                  [1/0] via 198.51.100.1, port2, [10/0]\nC       10.1.1.0/24 is directly connected, port3\nC       198.51.100.0/29 is directly connected, port2\nC       203.0.113.0/29 is directly connected, port1",
    "options": [
      "New internet sessions from the LAN use port1.",
      "If Internet_HC declares port1 dead, the route through port2 forwards new internet sessions.",
      "Sessions are balanced across port1 and port2 by source IP, because both routes have distance 1.",
      "port2's route exists only in the routing database, not in the routing table.",
      "To include port2 in ECMP, the administrator must give it a lower cost."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Member `priority` becomes the priority of the member's route. Both routes have distance 1, so both are in the routing table, but port2's has **priority 10** (the trailing `[10/0]`) against port1's default 1. Lower priority wins, so the implicit rule uses **port1**. If port1 is marked dead, its route is withdrawn and **port2's route takes over**.\n\n* **Source-IP balancing**: ECMP needs equal distance **and** priority.\n* **Database only**: the route is listed by `routing-table all`, so it is in the routing table, just not preferred.\n* **Cost**: cost is used only by Lowest Cost (SLA) rules and doesn't change routes. To restore ECMP, set the priorities equal.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-022",
    "topic": "1.2",
    "type": "single",
    "difficulty": 1,
    "stem": "What is the SD-WAN member `cost` setting used for?",
    "options": [
      "Choosing among members that meet the SLA in Lowest Cost (SLA) rules, where the lower cost is preferred",
      "Setting the priority of the member's static route in the routing table",
      "Setting the member's share of sessions in the weight-based implicit rule",
      "Setting the administrative distance of the zone static route"
    ],
    "answer": [
      0
    ],
    "explanation": "`cost` (0–4294967295, default 0) is used **only** by **Lowest Cost (SLA)** rules: among the members that meet the required SLA, the one with the lowest cost wins.\n\n* **Route priority**: that is `priority` (default 1).\n* **Session share**: that is `weight`, used by the weight-based (Sessions) implicit mode.\n* **Distance**: that is set on the static route itself (default 1 for zone routes).",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-023",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about traffic that matches no SD-WAN rule is correct?",
    "exhibit": "FGT-Branch1 # diagnose sys sdwan member\nMember(1): interface: port1, gateway: 203.0.113.1 2001:db8:a::1, priority: 1 1024, weight: 66\n  Session count: 1384\nMember(2): interface: port2, gateway: 198.51.100.1 2001:db8:b::1, priority: 1 1024, weight: 33\n  Session count: 690",
    "options": [
      "The implicit rule uses weight-based (Sessions) load balancing, and port1 receives about two thirds of new sessions.",
      "The implicit rule uses measured-volume-based balancing, and port1 carries two thirds of the bytes.",
      "The implicit rule uses usage-based (Spillover) balancing, and port2 is used only after port1 reaches its threshold.",
      "The implicit rule uses source-ip-based balancing, and the weights are ignored."
    ],
    "answer": [
      0
    ],
    "explanation": "The `Session count` lines appear when `load-balance-mode` is **weight-based**. Sessions are spread according to the weights. 66:33 is about 2:1, which matches the 1384:690 session counts.\n\n* **measured-volume-based**: the output would show `Config volume ratio`, `last reading` and `volume room`.\n* **usage-based**: the output would show spillover thresholds and `Egress-overbps` / `ingress-overbps`.\n* **source-ip-based**: the output shows only interface, gateway, priority and weight, with no session counters.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-024",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The implicit rule is configured with `load-balance-mode usage-based`. What happens to new sessions that match the implicit rule?",
    "exhibit": "FGT-Branch1 # diagnose sys sdwan member\nMember(1): interface: port1, gateway: 203.0.113.1 2001:db8:a::1, priority: 1 1024, weight: 255\n  Egress-spillover-threshold: 400000kbit/s, ingress-spillover-threshold: 400000kbit/s\n  Egress-overbps=1, ingress-overbps=0\nMember(2): interface: port2, gateway: 198.51.100.1 2001:db8:b::1, priority: 1 1024, weight: 254\n  Egress-spillover-threshold: 0kbit/s, ingress-spillover-threshold: 0kbit/s\n  Egress-overbps=0, ingress-overbps=0",
    "options": [
      "They are sent to port2, because port1 is over its egress spillover threshold.",
      "They stay on port1, because port1 is still under its ingress threshold.",
      "They are dropped until port1's egress traffic falls below 400 Mbps.",
      "They are split between port1 and port2 in a 255:254 ratio."
    ],
    "answer": [
      0
    ],
    "explanation": "In Spillover (`usage-based`) mode, traffic uses the first member until its bandwidth exceeds a threshold. `Egress-overbps=1` shows that port1 has exceeded its 400 Mbps **egress** threshold, so **new** sessions spill over to the next member, port2. Existing sessions stay where they are.\n\n* **Ingress under threshold**: exceeding either threshold is enough to trigger spillover.\n* **Dropped**: spillover redirects new sessions to another member. It doesn't drop them.\n* **255:254**: the weight values in usage-based output aren't a session ratio.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-025",
    "topic": "1.2",
    "type": "match",
    "difficulty": 1,
    "stem": "Match each implicit-rule load-balancing algorithm, as named in the GUI, to its `load-balance-mode` CLI keyword.",
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
    "explanation": "`config system sdwan` → `set load-balance-mode`: **source-ip-based** (default), **weight-based** (uses member `weight`), **usage-based** (uses `spillover-threshold` / `ingress-spillover-threshold`), **source-dest-ip-based** and **measured-volume-based** (uses `volume-ratio`).",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-026",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "FGT-Branch1 has two broadband members and an MPLS member. Internet traffic must get full security inspection, but DC traffic over MPLS must use a different security profile set. What is the recommended SD-WAN design?",
    "options": [
      "Put the broadband members in one zone and the MPLS member in its own zone, then create separate firewall policies for each zone.",
      "Put all three members in one zone and create one firewall policy per member.",
      "Put all three members in one zone and use an SD-WAN rule to apply the different security profiles.",
      "Leave MPLS outside SD-WAN. Members of the same FortiGate can't have different inspection."
    ],
    "answer": [
      0
    ],
    "explanation": "Firewall policies, and therefore security profiles, are applied **per zone**, and members can't be referenced in policies. A member that needs different treatment goes into **a zone of its own**. Fortinet's DIA design guidance gives MPLS needing different inspection from internet links as an example.\n\n* **One policy per member**: members aren't valid policy interfaces.\n* **SD-WAN rules**: rules choose the outgoing member. They don't apply security profiles.\n* **Leave MPLS outside SD-WAN**: there's no such restriction. Separate zones solve the problem and keep MPLS available to SD-WAN rules.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-027",
    "topic": "1.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two configuration objects can reference an SD-WAN zone directly? (Choose two.)",
    "options": [
      "A firewall policy, as its incoming or outgoing interface",
      "A static route, using `set sdwan-zone`",
      "The participants of a performance SLA (`set members` in `config health-check`)",
      "The `gateway` setting of an SD-WAN member",
      "The `interface` setting of an IPsec phase 1 interface"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Zones are used as **source or destination interfaces in policies** (and in local-in, DoS, multicast, TTL policies and central SNAT), in **static routes** with `set sdwan-zone`, and in SD-WAN rules (`priority-zone`).\n\n* **Health-check participants**: these are member sequence numbers, not zones (participants don't even need to be in the same zone).\n* **Member gateway**: this is an IP address.\n* **IPsec phase 1 `interface`**: the physical or underlying interface the tunnel is bound to, not an SD-WAN zone.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-028",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "On FGT-Branch1, overlay members HUB1-VPN1 and HUB1-VPN2 are configured with `set source 10.255.1.1`, the branch loopback address. What does this setting control?",
    "options": [
      "The source IP address of the health-check probes that SD-WAN sends through those members",
      "The source address used for all local-out traffic, such as DNS and FortiGuard queries, routed through those members",
      "The NAT address for LAN traffic leaving through the tunnels",
      "The BGP update-source of the neighbors reached through the tunnels"
    ],
    "answer": [
      0
    ],
    "explanation": "Member `source` sets the **source IP of health-check packets** sent on that member. On overlays it is set to an address, often a loopback, that the hub routes back through the same tunnel, so that probe replies return through the member being tested.\n\n* **Local-out traffic**: that is `preferred-source`, a separate member setting.\n* **NAT**: SNAT comes from the firewall policy (outgoing interface address or IP pool).\n* **BGP**: `update-source` is configured under `config router bgp` neighbors.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-029",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator wants port2 to carry no traffic from the implicit rule while port1 is healthy, and tries `set weight 0` on member 2 with `load-balance-mode weight-based`. What is the result?",
    "options": [
      "It doesn't work. Member weight ranges from 1 to 255, and a member can't be excluded from the implicit rule with a weight of 0. A higher priority value on port2 (for example 10) keeps it out of the ECMP set instead.",
      "port2 is removed from the implicit rule but is still used by SD-WAN rules.",
      "port2 becomes a standby member that is used only when port1 reaches its spillover threshold.",
      "port2 is disabled in SD-WAN, which has the same effect as `set status disable`."
    ],
    "answer": [
      0
    ],
    "explanation": "Weight and volume ratio both have a minimum of **1**, and Fortinet states that you can't exclude an interface from the implicit rule this way. A 0 carried over from an older version is treated as 1. To keep a member out of the ECMP set, give its route a **higher priority value**. Routes with a lower priority value are preferred, and the backup takes over when the others are withdrawn.\n\n* **Removed but still used by rules / standby / disabled**: none of these behaviours exist for weight 0.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-030",
    "topic": "1.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "Complete the command that makes static route 1 use every member of the SD-WAN zone `underlay` as a next hop: `config router static`, `edit 1`, `set ________ \"underlay\"`. Enter the missing keyword.",
    "answer": [
      "sdwan-zone"
    ],
    "explanation": "`set sdwan-zone <zone> [<zone> ...]` points a static route at one or more SD-WAN zones. With no `dst` the route is 0.0.0.0/0, and it installs a next hop through each member's gateway (distance 1 by default).",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-031",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The DC server 10.100.0.10 is reachable only through the IPsec tunnels. FGT-HQ doesn't publish it on the internet. Which participants should the administrator select for the `DC_HC` health check that probes 10.100.0.10?",
    "exhibit": "FGT-Branch1 SD-WAN members\nSeq  Interface   Zone      Transport\n1    port1       underlay  ISP-A broadband (gw 203.0.113.1)\n2    port2       underlay  ISP-B broadband (gw 198.51.100.1)\n3    HUB1-VPN1   overlay   IPsec to FGT-HQ over port1\n4    HUB1-VPN2   overlay   IPsec to FGT-HQ over port2",
    "options": [
      "Members 3 and 4 only",
      "Members 1 and 2 only",
      "All four members",
      "Members 1 and 3, one underlay and one overlay"
    ],
    "answer": [
      0
    ],
    "explanation": "Participants should be only the members the service traffic will use, and the probe must be able to reach the server through each of them. DC traffic uses the **overlays**, so `DC_HC` should use members 3 and 4.\n\n* **Underlay members**: probes sent directly out port1/port2 to 10.100.0.10 would fail, so the underlays would be declared dead. With `update-static-route` enabled (default) that would also **withdraw the internet routes**.\n* **All four** and **1 and 3** include underlay members, with the same problem.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-032",
    "topic": "1.2",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator tries to add port2 as an SD-WAN member, but port2 is already used as the outgoing interface of a firewall policy and of a static route. What must the administrator do?",
    "options": [
      "Remove the references to port2 from the firewall policy and the static route, then add it as a member.",
      "Nothing. The existing policy and route are automatically converted to use the zone.",
      "Create a VLAN on port2 and add the VLAN, because physical ports can't be members.",
      "Enable `set status enable` on the member, which overrides the existing references."
    ],
    "answer": [
      0
    ],
    "explanation": "An interface used as an SD-WAN member must not be referenced by other configuration, such as policies or static routes. Remove those references first, then add the interface to SD-WAN and rebuild the policy and route against the **zone**.\n\n* **Automatic conversion**: FortiOS doesn't convert references.\n* **VLAN**: physical ports, VLANs, LAGs, tunnels and more can all be members.\n* **status**: `status` only enables or disables the member and doesn't affect references.",
    "lesson": "1.2-members-zones"
  },
  {
    "id": "d1-033",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about HUB1-VPN2 is correct?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    ...\n    config health-check\n        edit \"DC_HC\"\n            set server \"10.100.0.10\"\n            set members 3 4\n            config sla\n                edit 1\n                    set latency-threshold 200\n                    set jitter-threshold 50\n                    set packetloss-threshold 5\n                next\n                edit 2\n                    set link-cost-factor latency\n                    set latency-threshold 80\n                next\n            end\n        next\n    end\nend\n\nFGT-Branch1 # diagnose sys sdwan health-check DC_HC\nHealth Check(DC_HC):\nSeq(3 HUB1-VPN1): state(alive), packet-loss(0.000%) latency(64.115), jitter(3.902) sla_map=0x3\nSeq(4 HUB1-VPN2): state(alive), packet-loss(7.000%) latency(71.468), jitter(4.217) sla_map=0x2",
    "options": [
      "It meets SLA target 2 but not SLA target 1, because its packet loss is above 5%.",
      "It meets SLA target 1 but not SLA target 2, because 0x2 marks a failure of target 2.",
      "It meets neither SLA target, because any packet loss fails every target.",
      "It meets both SLA targets, because it is alive."
    ],
    "answer": [
      0
    ],
    "explanation": "`sla_map` is a bitmask of the SLA targets the member **meets**: bit 0 (0x1) is ID 1 and bit 1 (0x2) is ID 2. HUB1-VPN2's 0x2 means it meets **only target 2**. Target 2 checks latency only (71.5 ms < 80 ms). Target 1 checks latency, jitter and loss, and 7% loss is above 5%. HUB1-VPN1's 0x3 means it meets both.\n\n* **0x2 marks a failure**: set bits are targets that are met, not failed.\n* **Any loss fails**: target 2 doesn't count loss, and target 1 allows up to 5%.\n* **Alive = in SLA**: alive/dead and SLA state are independent.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-034",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. ISP-B stops forwarding traffic at 10:00:00, and recovers at 10:05:00. Approximately when is port2 declared dead, and how long after recovery is it declared alive again?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    ...\n    config health-check\n        edit \"Internet_HC\"\n            set server \"198.51.100.10\"\n            set interval 1000\n            set failtime 3\n            set recoverytime 10\n            set members 1 2\n        next\n    end\nend",
    "options": [
      "Dead at about 10:00:03, and alive about 10 seconds after recovery",
      "Dead at about 10:00:10, and alive about 3 seconds after recovery",
      "Dead at about 10:00:02.5, and alive about 2.5 seconds after recovery",
      "Dead at about 10:00:13, and alive about 13 seconds after recovery"
    ],
    "answer": [
      0
    ],
    "explanation": "Alive → dead takes about `failtime × interval` = 3 × 1 s = **3 s**. Dead → alive takes `recoverytime × interval` = 10 × 1 s = **10 s** of consecutive successful probes.\n\n* **10 s / 3 s**: this swaps failtime and recoverytime.\n* **2.5 s / 2.5 s**: these are the default values (5 × 500 ms), which this health check has overridden.\n* **13 s**: the timers aren't added together.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-035",
    "topic": "1.3",
    "type": "fill",
    "difficulty": 2,
    "stem": "A member meets SLA targets 1 and 3 of a health check, but not target 2. What `sla_map` value does `diagnose sys sdwan health-check` show for it? Use hexadecimal, as the command prints it (for example 0x1).",
    "answer": [
      "0x5",
      "0x05",
      "0x00000005"
    ],
    "explanation": "Bit 0 = SLA ID 1 (0x1), bit 1 = ID 2 (0x2), bit 2 = ID 3 (0x4). Targets 1 and 3 give 0x1 + 0x4 = **0x5**.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-036",
    "topic": "1.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator changes the Internet_HC performance SLA to `set detect-mode passive`. Which two conditions are required so that passive measurements are collected for port1 and port2? (Choose two.)",
    "options": [
      "The firewall policy carrying the traffic has `set passive-wan-health-measurement enable`.",
      "The outgoing interface of that firewall policy is an SD-WAN zone that contains the members.",
      "The health check has two servers configured, so that measurements can be compared.",
      "The FortiGate has an SD-WAN Underlay and Application Monitoring licence.",
      "Probes are sent every `interval` milliseconds to confirm the passive results."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Passive mode derives latency, jitter and loss from real sessions in firewall policies that have **Passive Health Check** (`passive-wan-health-measurement`) enabled. That option can be enabled only when the policy's **outgoing interface is an SD-WAN zone**. Enabling it also disables `auto-asic-offload` for the policy.\n\n* **Servers**: passive mode doesn't need a server, because no probes are sent. Prefer-passive needs one for its fallback probes.\n* **Licence**: passive measurement isn't licensed. The Underlay and Application Monitoring licence is for the wizard and the FortiGuard SLA database.\n* **Probes**: in passive mode no probes are sent. Sending probes when there is no traffic is prefer-passive behaviour.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-037",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "A health check uses `set detect-mode prefer-passive`. A branch closes for the night and port2 carries no user traffic. How does the FortiGate measure port2's health?",
    "options": [
      "After about three minutes with no traffic on port2, it sends active probes to the configured server until traffic resumes.",
      "It keeps the last passive values until traffic resumes, because prefer-passive never sends probes.",
      "It marks port2 dead after three minutes without traffic.",
      "It copies the measurements from the other member of the health check."
    ],
    "answer": [
      0
    ],
    "explanation": "Prefer-passive measures with live traffic when there is some. If an SD-WAN member has **no traffic for three continuous minutes**, the FortiGate sends **active probes** to the configured server. That is why prefer-passive needs a server and protocol configured, unlike pure passive mode.\n\n* **Never probes**: that describes `passive`.\n* **Marked dead**: a lack of traffic isn't a failure, and the fallback probes decide the state.\n* **Copying measurements**: each member is measured on its own.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-038",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Server 198.51.100.10 is taken offline for maintenance. 192.0.2.10 is still reachable through both ISPs. What happens to port1 and port2 in Internet_HC?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    ...\n    config health-check\n        edit \"Internet_HC\"\n            set server \"198.51.100.10\" \"192.0.2.10\"\n            set update-static-route enable\n            set members 1 2\n        next\n    end\nend",
    "options": [
      "Both members stay alive. The health check moves to the second server, and it fails only if both servers fail.",
      "Both members are declared dead, and their static routes are withdrawn, because the first server is unreachable.",
      "Both members go out of SLA because half of all probes are lost, but they stay alive.",
      "The health check alternates probes between the servers, so the members flap between alive and dead."
    ],
    "answer": [
      0
    ],
    "explanation": "Up to two servers can be configured. The FortiGate probes the first and uses the second if the first is unavailable, and it keeps using the second until that one fails. **Both servers must fail** for the health check to fail. This design stops a single dead server from making a healthy link look dead.\n\n* **Declared dead**: that would require both servers to fail.\n* **Half of probes lost**: probes aren't split evenly between servers.\n* **Alternating probes / flapping**: the second server stays in use while it answers.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-039",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator already uses 8.8.8.8 in the performance SLA `DNS_HC` with a strict SLA target for DNS traffic. Now a second, looser SLA target is needed for other traffic that is also judged by probes to 8.8.8.8. What should the administrator do?",
    "options": [
      "Add a second SLA target (`config sla` > `edit 2`) to DNS_HC and reference that target in the second rule.",
      "Create a second performance SLA that also uses server 8.8.8.8 with the looser thresholds.",
      "Change DNS_HC to passive mode so that the server can be shared.",
      "Configure 8.8.8.8 twice in the `server` list of DNS_HC with different thresholds."
    ],
    "answer": [
      0
    ],
    "explanation": "A server can be used in **only one** performance SLA at a time. Fortinet's answer for one server that needs different acceptable performance values is **multiple SLA targets** in the same health check. Each rule then requires the target it needs, for example `DNS_HC#1` or `DNS_HC#2`. The GUI shows one target, and additional targets are added in the CLI.\n\n* **Second SLA with the same server**: not allowed.\n* **Passive mode**: this doesn't create a second set of thresholds. Passive mode uses no server at all.\n* **Same server twice**: the server list holds up to two different servers. Thresholds belong to SLA targets, not to servers.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-040",
    "topic": "1.3",
    "type": "multi",
    "difficulty": 3,
    "stem": "Refer to the exhibit. These are the only SD-WAN-related logs generated in the last 10 minutes. Which two statements are true? (Choose two.)",
    "exhibit": "date=2026-10-27 time=13:20:44 eventtime=1793132444388763760 tz=\"-0700\" logid=\"0113022923\"\ntype=\"event\" subtype=\"sdwan\" level=\"notice\" vd=\"root\" logdesc=\"SDWAN status\"\neventtype=\"Health Check\" healthcheck=\"Internet_HC\" slatargetid=1 oldvalue=\"2\" newvalue=\"1\"\nmsg=\"Number of pass member changed.\"\n\ndate=2026-10-27 time=13:20:44 eventtime=1793132444388751880 tz=\"-0700\" logid=\"0113022923\"\ntype=\"event\" subtype=\"sdwan\" level=\"notice\" vd=\"root\" logdesc=\"SDWAN status\"\neventtype=\"Health Check\" healthcheck=\"Internet_HC\" slatargetid=1 member=\"2\"\nmsg=\"Member status changed. Member out-of-sla.\"",
    "options": [
      "Member 2 is still alive, and its static routes remain installed.",
      "Lowest Cost (SLA) rules that require Internet_HC SLA target 1 now treat member 2 as not meeting the SLA.",
      "Member 2 was declared dead and its static routes were withdrawn.",
      "Manual-strategy SD-WAN rules stop using member 2.",
      "Internet_HC has no SLA target configured."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Member 2 failed **SLA target 1** (`Member out-of-sla`), and the number of members passing the target dropped from 2 to 1. No *Routing information changed* (0100022921) or *Stop forwarding traffic* event was logged, so member 2 is **alive and keeps its routes**. Only SLA-aware logic reacts: **Lowest Cost (SLA)** rules using `Internet_HC#1` now treat member 2 as out of SLA and prefer members that still pass.\n\n* **Dead and withdrawn**: that would produce 0100022921 and a `Member link is unreachable...` message.\n* **Manual rules**: Manual (and Best Quality) rules ignore SLA state and only skip dead members.\n* **No SLA target**: `slatargetid=1` shows that target 1 exists.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-041",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. No SD-WAN rules are configured. What is the effect on LAN users?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    ...\n    config health-check\n        edit \"Internet_HC\"\n            set server \"198.51.100.10\"\n            set update-static-route disable\n            set members 1 2\n        next\n    end\nend\n\nFGT-Branch1 # diagnose sys sdwan health-check Internet_HC\nHealth Check(Internet_HC):\nSeq(1 port1): state(alive), packet-loss(0.000%) latency(12.408), jitter(0.733) sla_map=0x0\nSeq(2 port2): state(dead), packet-loss(100.000%) sla_map=0x0\n\nFGT-Branch1 # get router info routing-table all | grep -A1 0.0.0.0/0\nS*      0.0.0.0/0 [1/0] via 203.0.113.1, port1\n                  [1/0] via 198.51.100.1, port2",
    "options": [
      "Some new sessions can still be hashed to port2 by the implicit rule and fail, because port2's route wasn't withdrawn.",
      "All new sessions use port1, because the implicit rule never selects a dead member.",
      "All sessions fail, because the default route is invalid while one next hop is dead.",
      "Sessions use port2 only after port1 reaches its spillover threshold."
    ],
    "answer": [
      0
    ],
    "explanation": "With `update-static-route disable`, a dead member's static routes are **not** withdrawn. The ECMP default route still has port2 as a next hop, and the implicit rule (source-IP hashing by default) keeps placing some clients on port2, where their sessions fail. SD-WAN rules would skip the dead member, but there are none. The remedy is to keep `update-static-route` enabled (the default).\n\n* **Implicit rule never selects dead members**: the implicit rule balances across the routes, and the route through port2 is still installed.\n* **All sessions fail**: port1's next hop still works.\n* **Spillover**: the mode here isn't usage-based, and spillover has nothing to do with dead members.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-042",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Both health checks have `update-static-route` enabled. What happens to the static routes through port1?",
    "exhibit": "FGT-Branch1 # diagnose sys sdwan health-check\nHealth Check(Internet_HC):\nSeq(1 port1): state(dead), packet-loss(100.000%) sla_map=0x0\nSeq(2 port2): state(alive), packet-loss(0.000%) latency(22.871), jitter(1.106) sla_map=0x0\nHealth Check(Cloud_HC):\nSeq(1 port1): state(alive), packet-loss(0.000%) latency(14.395), jitter(0.882) sla_map=0x0\nSeq(2 port2): state(alive), packet-loss(0.000%) latency(25.017), jitter(1.240) sla_map=0x0",
    "options": [
      "They remain installed, because a member's routes are removed only when all of the health checks it belongs to fail.",
      "They are withdrawn, because Internet_HC declared port1 dead.",
      "Only the default route through port1 is withdrawn, and other static routes on port1 stay.",
      "They are withdrawn and restored repeatedly while the two health checks disagree."
    ],
    "answer": [
      0
    ],
    "explanation": "When an SD-WAN member is a participant in **several** health checks, **all** of them must fail before its routes are removed from the load-balancing group. Cloud_HC still sees port1 as alive, so port1's routes stay. In SD-WAN rules, port1 is treated as dead only for rules that use Internet_HC.\n\n* **Withdrawn**: one failing health check out of two isn't enough.\n* **Only the default route**: when the withdrawal happens, it applies to all static routes on that interface.\n* **Flapping**: there's no alternating behaviour. The all-must-fail rule is deterministic.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-043",
    "topic": "1.3",
    "type": "order",
    "difficulty": 2,
    "stem": "ISP-A, behind port1, stops forwarding traffic. Internet_HC uses the default settings (active ping probes, interval 500 ms, failtime 5, recoverytime 5, update-static-route enabled). Put the events in the order they occur, through to full recovery.",
    "items": [
      "Ping probes sent out port1 to the server stop receiving replies.",
      "After 5 consecutive lost probes (about 2.5 s), Internet_HC marks port1 dead.",
      "The FortiGate withdraws the static routes through port1 and logs 0100022921 \"Routing information changed\".",
      "New sessions use the remaining default-route next hop through port2.",
      "ISP-A recovers, and after 5 consecutive successful probes port1 is marked alive.",
      "The static routes through port1 are restored, and port1 rejoins the ECMP default route."
    ],
    "explanation": "Failure: lost probes → `failtime` reached (5 × 500 ms ≈ 2.5 s) → member dead → `update-static-route` withdraws the member's static routes (event 0100022921, `status=\"down\"`) → only port2 remains in the default route. Recovery: `recoverytime` successful probes (5 × 500 ms) → member alive → routes re-added (0100022921 with `status=\"up\"`).",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-044",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-Branch1 embeds its SLA information in the ICMP probes it sends to FGT-HQ. It reports 140 ms latency on the overlay terminating on EDGE_VPN1 and 35 ms on the overlay terminating on EDGE_VPN2. BGP on FGT-HQ has `recursive-inherit-priority enable`. How does FGT-HQ route traffic to the branch LAN?",
    "exhibit": "FGT-HQ # show system sdwan\nconfig system sdwan\n    set status enable\n    config members\n        edit 1\n            set interface \"EDGE_VPN1\"\n        next\n        edit 2\n            set interface \"EDGE_VPN2\"\n        next\n    end\n    config health-check\n        edit \"HC_VPN1\"\n            set detect-mode remote\n            set sla-id-redistribute 1\n            set members 1\n            config sla\n                edit 1\n                    set link-cost-factor latency\n                    set latency-threshold 100\n                    set priority-in-sla 10\n                    set priority-out-sla 20\n                next\n            end\n        next\n        edit \"HC_VPN2\"\n            set detect-mode remote\n            set sla-id-redistribute 1\n            set members 2\n            config sla\n                edit 1\n                    set link-cost-factor latency\n                    set latency-threshold 100\n                    set priority-in-sla 15\n                    set priority-out-sla 25\n                next\n            end\n        next\n    end\nend",
    "options": [
      "Through EDGE_VPN2: the IKE routes over EDGE_VPN1 get priority 20 (out of SLA) and those over EDGE_VPN2 get 15 (in SLA), and the BGP routes inherit these priorities.",
      "Through EDGE_VPN1, because its in-SLA priority (10) is lower than EDGE_VPN2's (15).",
      "ECMP over both overlays, because `detect-mode remote` disables route priority changes.",
      "Through whichever overlay the hub's own probes measure as faster, because the hub ignores the embedded information."
    ],
    "answer": [
      0
    ],
    "explanation": "On the hub, `detect-mode remote` uses the SLA information the spoke embedded in its ICMP probes. Judged against SLA 1 (latency 100 ms), EDGE_VPN1 at 140 ms is **out of SLA**, so its IKE routes get `priority-out-sla 20`. EDGE_VPN2 at 35 ms is **in SLA** and gets `priority-in-sla 15`. `sla-id-redistribute 1` selects which SLA's priorities go into the routing table, and `recursive-inherit-priority` lets BGP routes resolved over these IKE routes inherit them. The lower priority value (15) wins, so return traffic follows EDGE_VPN2, symmetric with the spoke's choice.\n\n* **Priority 10**: that value applies only while EDGE_VPN1 is in SLA.\n* **ECMP**: remote mode exists precisely to set different priorities.\n* **Hub probes**: in remote mode the hub doesn't probe the spoke. It relies on the embedded information.",
    "lesson": "1.3-advanced-sla-embedded-probes"
  },
  {
    "id": "d1-045",
    "topic": "1.3",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which `config health-check` setting must a spoke enable so that its ICMP health-check probes carry its measured SLA information to the hub? Enter the CLI keyword.",
    "answer": [
      "embed-measured-health",
      "set embed-measured-health enable",
      "embed-measured-health enable"
    ],
    "explanation": "`set embed-measured-health enable` (default disable) embeds the measured health in the ICMP probes. The hub uses `detect-mode remote` with `priority-in-sla` / `priority-out-sla` and `sla-id-redistribute` to set route priorities for hub-to-spoke traffic.",
    "lesson": "1.3-advanced-sla-embedded-probes"
  },
  {
    "id": "d1-046",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Members of Internet_HC regularly fail the SLA, and the SD-WAN events show the 0113022923 status changes. However, the FortiAnalyzer SD-WAN reports show no per-member latency, jitter or packet-loss history. Which change gives FortiAnalyzer that data?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    ...\n    config health-check\n        edit \"Internet_HC\"\n            set server \"198.51.100.10\"\n            set members 1 2\n            config sla\n                edit 1\n                    set latency-threshold 100\n                    set jitter-threshold 30\n                    set packetloss-threshold 2\n                next\n            end\n        next\n    end\nend\n\nFGT-Branch1 # config system sdwan\nFGT-Branch1 (sdwan) # config health-check\nFGT-Branch1 (health-check) # edit \"Internet_HC\"\nFGT-Branch1 (Internet_HC) # get | grep log-period\nsla-fail-log-period : 0\nsla-pass-log-period : 0",
    "options": [
      "Set `sla-fail-log-period` and `sla-pass-log-period` to non-zero values so that periodic 0113022925 SDWAN SLA information logs are generated.",
      "Increase `interval` to 120000 ms so that each probe is logged.",
      "Change `detect-mode` to passive so that sessions carry SLA fields.",
      "Disable `update-static-route` so that SLA failures are logged rather than acted on."
    ],
    "answer": [
      0
    ],
    "explanation": "Periodic per-member SLA reports (log ID **0113022925**, *SDWAN SLA information*, with latency, jitter, packetloss, slamap and bandwidth fields) are generated every `sla-fail-log-period` seconds while a member fails and every `sla-pass-log-period` seconds while it passes. Both default to **0**, which means no periodic logs, so FortiAnalyzer has only the state-change events to work with.\n\n* **interval**: changes probe frequency. Probes aren't logged individually.\n* **Passive mode**: changes how health is measured, not what is logged.\n* **update-static-route**: controls route withdrawal for dead members and has nothing to do with SLA logging.",
    "lesson": "1.3-advanced-sla-embedded-probes"
  },
  {
    "id": "d1-047",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator wants latency and jitter to react faster to changes by averaging fewer recent probes. Which health-check setting should be changed, and what is its default?",
    "options": [
      "`probe-count`, default 30 (range 5–30)",
      "`failtime`, default 5",
      "`probe-timeout`, default 500 ms",
      "`packetloss-threshold`, default 0"
    ],
    "answer": [
      0
    ],
    "explanation": "`probe-count` is the number of most recent probes used to calculate **latency and jitter** (5–30, default 30). Packet loss is always calculated over the last 100 probes.\n\n* **failtime**: the number of consecutive failures before a member is dead. It doesn't affect averaging.\n* **probe-timeout**: how long to wait before a probe counts as lost.\n* **packetloss-threshold**: an SLA target threshold, not a window.",
    "lesson": "1.3-advanced-sla-embedded-probes"
  },
  {
    "id": "d1-048",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Both IPsec tunnels to FGT-HQ are up and carry user traffic from 10.1.1.0/24. A sniffer on FGT-HQ shows the DC_HC probes arriving through the tunnels with source addresses 203.0.113.2 and 198.51.100.2 (the branch's ISP addresses), and FGT-HQ routes those subnets out its own internet link. The branch loopback 10.255.1.1/32 is routed by FGT-HQ back through both tunnels. What should the administrator change?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    ...\n    config members\n        edit 3\n            set interface \"HUB1-VPN1\"\n            set zone \"overlay\"\n        next\n        edit 4\n            set interface \"HUB1-VPN2\"\n            set zone \"overlay\"\n        next\n    end\n    config health-check\n        edit \"DC_HC\"\n            set server \"10.255.0.1\"\n            set members 3 4\n        next\n    end\nend\n\nFGT-Branch1 # diagnose sys sdwan health-check DC_HC\nHealth Check(DC_HC):\nSeq(3 HUB1-VPN1): state(dead), packet-loss(100.000%) sla_map=0x0\nSeq(4 HUB1-VPN2): state(dead), packet-loss(100.000%) sla_map=0x0",
    "options": [
      "Set `source 10.255.1.1` on members 3 and 4 so that the hub sends the probe replies back through the tunnel each probe used.",
      "Add a static route on FGT-Branch1 to 10.255.0.1 through the overlay zone so that the probes are routed into the tunnels.",
      "Change the health-check protocol from ping to tcp-echo.",
      "Disable `update-static-route` in DC_HC so that the members are no longer reported dead."
    ],
    "answer": [
      0
    ],
    "explanation": "Probes already leave through each member being tested, because SD-WAN installs dedicated probe routes. The problem is the **return path**. The probes are sourced from the ISP addresses, and FGT-HQ sends those replies out its internet link instead of back into the tunnels, so no replies arrive through the tunnels. Setting member `source` to the loopback, which the hub routes back through the tunnels, fixes the return path.\n\n* **Static route**: the outbound path isn't the problem, and probe routing doesn't depend on the main routing table.\n* **tcp-echo**: the replies would still be routed the wrong way.\n* **update-static-route**: hides one consequence (route withdrawal), but the members are still dead to SD-WAN rules.",
    "lesson": "1.3-advanced-sla-embedded-probes"
  },
  {
    "id": "d1-049",
    "topic": "1.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about FortiOS 7.6 performance SLA health checks are true? (Choose two.)",
    "options": [
      "The GUI offers only the Ping, HTTP and DNS protocols. Others, such as TWAMP and tcp-connect, are configured in the CLI.",
      "A health check can have up to two servers.",
      "Every firmware upgrade re-creates the five predefined SLA profiles (DNS, FortiGuard, Gmail, Google Search, Office 365).",
      "The same server can be used in several performance SLAs if they have different protocols.",
      "SLA targets are mandatory. A health check without an SLA target can't detect dead members."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "The GUI exposes **Ping, HTTP and DNS**. tcp-echo, udp-echo, https, twamp, tcp-connect and ftp are CLI options. A health check accepts **up to two servers**, and both must fail for it to fail.\n\n* **Predefined profiles**: they exist on newly created VDOMs and factory-reset devices, not after every upgrade.\n* **Same server**: a server can be used in only one performance SLA at a time.\n* **Mandatory SLA targets**: SLA targets are optional for link monitoring. Dead detection and route withdrawal work without them.",
    "lesson": "1.3-performance-sla-health-checks"
  },
  {
    "id": "d1-050",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. port3 connects FGT-Branch1 to a downstream router that has a backup default route through another site's gateway. What happens to port3 if Internet_HC declares both port1 and port2 dead?",
    "exhibit": "FGT-Branch1 # show system sdwan\nconfig system sdwan\n    set status enable\n    set fail-detect enable\n    set fail-alert-interfaces \"port3\"\n    ...\n    config health-check\n        edit \"Internet_HC\"\n            set server \"198.51.100.10\"\n            set update-cascade-interface enable\n            set members 1 2\n        next\n    end\nend",
    "options": [
      "The FortiGate brings port3 down, so the downstream router fails over, and brings it back up when at least one member is alive again.",
      "port3 stays up, and only the static routes through port1 and port2 are withdrawn.",
      "The FortiGate brings port3 down as soon as either port1 or port2 is declared dead.",
      "port3 stays up, and the FortiGate sends an SNMP trap to the downstream router."
    ],
    "answer": [
      0
    ],
    "explanation": "With SD-WAN `fail-detect enable` and `fail-alert-interfaces \"port3\"`, the health check's `update-cascade-interface` (enabled by default) ties port3's link state to SD-WAN health. When **all** members of the health check are dead, the alert interface is brought down, and it comes back up when at least one member recovers. The downstream device then sees a link failure and can fail over.\n\n* **port3 stays up**: route withdrawal (`update-static-route`) also happens, but the cascade setting adds the interface action.\n* **Either member dead**: one dead member out of two leaves a working path, so port3 stays up.\n* **SNMP trap**: this isn't how the cascade feature works.",
    "lesson": "1.3-performance-sla-health-checks"
  }
];
