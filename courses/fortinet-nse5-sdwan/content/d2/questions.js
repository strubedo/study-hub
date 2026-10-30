// Domain 2 — SD-WAN traffic control, rules and routing. Original exam-style questions for FortiOS 7.6.
// Exhibit field layouts follow the FortiOS 7.6.3 Administration Guide ("SD-WAN related diagnose
// commands", "Understanding SD-WAN related logs", "Using a session table", "Policy routes").
// Lab names: FGT-Branch1; port1 203.0.113.2/29 (gw 203.0.113.1), port2 198.51.100.2/29 (gw 198.51.100.1),
// LAN port3 10.1.50.1/24; members 1 port1, 2 port2 (zone underlay), 3 HUB1-VPN1, 4 HUB1-VPN2 (zone overlay).
export default [
  // ---------------------------------------------------------------- 2.1 SD-WAN rules
  {
    id: 'd2-001',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: "An administrator creates an SD-WAN rule in the GUI with the Best Quality strategy. Which mode does the rule show in the CLI?",
    options: [
      "set mode priority",
      "set mode sla",
      "set mode auto",
      "set mode best-quality",
    ],
    answer: [0],
    explanation: "The GUI and CLI names differ: **Best Quality** is `mode priority`, **Lowest Cost (SLA)** is `mode sla`, **Manual** is `mode manual` (the default, so it never shows in `show` output). `auto` is the legacy Automatic strategy, which is CLI only. There is no `best-quality` keyword.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-002',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Both members are alive. Which member does rule 1 use for new sessions to 192.0.2.80?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    set status enable
    config zone
        edit "virtual-wan-link"
        next
        edit "underlay"
        next
    end
    config members
        edit 1
            set interface "port1"
            set zone "underlay"
            set gateway 203.0.113.1
            set cost 20
        next
        edit 2
            set interface "port2"
            set zone "underlay"
            set gateway 198.51.100.1
            set cost 5
        next
    end
    config health-check
        edit "Internet_HC"
            set server "198.51.100.10"
            set members 1 2
            config sla
                edit 1
                    set latency-threshold 100
                    set jitter-threshold 30
                    set packetloss-threshold 2
                next
            end
        next
    end
    config service
        edit 1
            set name "Critical-DIA"
            set mode sla
            set dst "SaaS-Net"
            config sla
                edit "Internet_HC"
                    set id 1
                next
            end
            set priority-members 1 2
        next
    end
end

FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(21.330), jitter(1.902) sla_map=0x1
Seq(2 port2): state(alive), packet-loss(0.000%) latency(35.871), jitter(3.115) sla_map=0x1`,
    options: [
      "port2, because both members meet SLA target 1 and port2 has the lower cost",
      "port1, because it is listed first in priority-members",
      "port1, because it has the lower latency",
      "Both members, because they both meet the SLA and the rule load-balances among them",
    ],
    answer: [0],
    explanation: "A Lowest Cost (SLA) rule (`mode sla`) first keeps the members that meet the required SLA target, then picks the lowest `cost`. Both have `sla_map=0x1`, which means both meet target 1, so port2 (cost 5) beats port1 (cost 20). Configured order only breaks a tie on cost. Latency isn't compared in `sla` mode (that's Best Quality). Load balancing would need `set load-balance enable`.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-003',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The SD-WAN configuration is the same as in the previous scenario: rule 1 is Lowest Cost (SLA) with SLA target Internet_HC ID 1 (packet loss threshold 2%), port1 cost 20, port2 cost 5, priority-members 1 2. Which member does rule 1 use for new sessions?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(22.004), jitter(1.776) sla_map=0x1
Seq(2 port2): state(alive), packet-loss(6.000%) latency(34.912), jitter(2.840) sla_map=0x0`,
    options: [
      "port1, because it is the only member that meets SLA target 1",
      "port2, because it still has the lowest cost and is alive",
      "Neither, because the rule is skipped when any member fails the SLA",
      "port2, because a member is only demoted when it is dead",
    ],
    answer: [0],
    explanation: "Port2 loses 6% of probes, over the 2% target, so its `sla_map` is 0x0. In `sla` mode, a member that meets the SLA always ranks above one that doesn't, whatever the cost, so port1 is used. Cost only decides among members in the same SLA state. The rule is skipped only when `minimum-sla-meet-members` isn't satisfied (default 0, so never). An out-of-SLA member isn't removed, just moved below the passing ones.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-004',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Rule 2 uses the Lowest Cost (SLA) strategy with SLA target Internet_HC ID 1, priority-members 1 2 and minimum-sla-meet-members left at its default. Member 1 (port1) has cost 10 and member 2 (port2) has cost 0. Which member does rule 2 use?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(3.000%) latency(48.220), jitter(9.413) sla_map=0x0
Seq(2 port2): state(alive), packet-loss(5.000%) latency(61.507), jitter(12.006) sla_map=0x0`,
    options: [
      "port2, because no member meets the SLA so the lowest-cost alive member is used",
      "port1, because it has the better measurements of the two",
      "port1, because it is first in priority-members and no member meets the SLA",
      "None. The rule doesn't apply and traffic follows the implicit rule",
    ],
    answer: [0],
    explanation: "When no member meets the SLA target, the members tie on SLA state and the election falls through to cost: port2 (cost 0) wins. Lowest Cost never compares raw measurements (that is Best Quality's job), and configured order only breaks a cost tie. The rule would be skipped only if `minimum-sla-meet-members` were set to 1 or more. The default is 0, so the rule still applies.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-005',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 3 uses the Best Quality strategy with link-cost-factor latency, the default link-cost-threshold, and priority-members 3 4. Which member carries new sessions?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check DC_HC
Health Check(DC_HC):
Seq(3 HUB1-VPN1): state(alive), packet-loss(0.000%) latency(44.010), jitter(1.220) sla_map=0x0
Seq(4 HUB1-VPN2): state(alive), packet-loss(0.000%) latency(41.360), jitter(1.051) sla_map=0x0`,
    options: [
      "HUB1-VPN1, because as the first-listed member its latency is evaluated as about 40 ms",
      "HUB1-VPN2, because it has the lower measured latency",
      "HUB1-VPN1, because it is the first member and Best Quality only moves traffic when a member is dead",
      "Neither, because sla_map=0x0 shows that no member meets the SLA",
    ],
    answer: [0],
    explanation: "Best Quality gives the first-listed member a `link-cost-threshold` advantage of 10% by default: 44.010 / 1.1 ≈ 40.0 ms, which is better than HUB1-VPN2's 41.36 ms, so HUB1-VPN1 keeps the traffic. Best Quality does move traffic on quality, not only on failure, but the bias has to be overcome first. `sla_map` is irrelevant here: Best Quality compares measurements and doesn't use SLA targets.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-006',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Rule 3 is unchanged (Best Quality, latency, default threshold, priority-members 3 4). An hour later the health check reports these values. What happens to rule 3's member order?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check DC_HC
Health Check(DC_HC):
Seq(3 HUB1-VPN1): state(alive), packet-loss(0.000%) latency(50.300), jitter(1.904) sla_map=0x0
Seq(4 HUB1-VPN2): state(alive), packet-loss(0.000%) latency(44.180), jitter(1.233) sla_map=0x0`,
    options: [
      "HUB1-VPN2 moves to the top, because 44.18 ms is better than HUB1-VPN1's biased value of about 45.7 ms",
      "HUB1-VPN1 stays on top, because the difference between the members is less than 10 ms",
      "HUB1-VPN1 stays on top, because the 10% bias is added to HUB1-VPN2's latency",
      "Both members are used equally, because their latencies are within 10% of each other",
    ],
    answer: [0],
    explanation: "The first-listed member's value is divided by 1.1: 50.3 / 1.1 ≈ 45.7 ms. HUB1-VPN2 measures 44.18 ms, which is better, so the order flips and an `0113022923` event with `seq=\"4,3\"` is logged. The threshold is a percentage, not milliseconds, and it applies to the first-listed member, not as a penalty on the other. Best Quality without load balancing never shares traffic between members.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-007',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about the Manual strategy in FortiOS 7.6 are true? (Choose two.)",
    options: [
      "Traffic uses the first member in the interface or zone preference list that can forward it",
      "Higher latency or jitter on the preferred member, while it stays alive and keeps its routes, doesn't move traffic to another member",
      "A Manual rule must reference a performance SLA",
      "Manual rules select the member with the lowest cost",
      "Load balancing can't be enabled in a Manual rule",
    ],
    answer: [0, 1],
    explanation: "Manual uses the configured preference order and no health check. Only losing the ability to forward (interface down, or its route withdrawn after a health check declares it dead) moves traffic to the next member, so degraded quality on a live member doesn't. Manual doesn't need or use a performance SLA, and cost is used only by `sla` mode. Since 7.4.1 load balancing **can** be enabled in a Manual rule (`set load-balance enable`), and it then balances without SLA targets.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-008',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: "An administrator wants a FortiOS 7.6 rule that behaves like the old Maximize Bandwidth (SLA) strategy: spread sessions over every member that meets an SLA target. How is this configured?",
    options: [
      "set mode sla with set load-balance enable and a required SLA target",
      "set mode load-balance with a required SLA target",
      "set mode priority with set link-cost-factor bibandwidth",
      "set load-balance-mode measured-volume-based under config system sdwan",
    ],
    answer: [0],
    explanation: "Since FortiOS 7.4.1, Maximize Bandwidth (SLA) is the load-balancing option inside a Lowest Cost (SLA) rule: `mode sla` + `load-balance enable` + `config sla`. It balances across all in-SLA members and ignores cost. There is no `mode load-balance` in 7.6 (only diagnose output prints `Mode(load-balance …)`). Best Quality on `bibandwidth` picks one best member. `load-balance-mode` configures the implicit rule, not a rule.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-009',
    topic: '2.1',
    type: 'match',
    difficulty: 1,
    stem: "Match each GUI strategy or option to its FortiOS 7.6 CLI configuration.",
    pairs: [
      ["Manual", "set mode manual (default)"],
      ["Best Quality", "set mode priority"],
      ["Lowest Cost (SLA)", "set mode sla"],
      ["Automatic (legacy, CLI only)", "set mode auto"],
      ["Load balancing toggle", "set load-balance enable"],
    ],
    explanation: "Manual is the default `mode manual`. Best Quality is `priority`, Lowest Cost (SLA) is `sla`, and the legacy Automatic strategy is `auto`, which only exists in the CLI. Since 7.4.1 load balancing is a separate `load-balance` toggle inside a `manual` or `sla` rule, replacing the old Maximize Bandwidth strategy.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-010',
    topic: '2.1',
    type: 'fill',
    difficulty: 2,
    stem: "On FortiOS 7.6, which diagnose command (without arguments) lists every IPv4 SD-WAN rule with its mode, member order and selected members?",
    answer: ["diagnose sys sdwan service4", "diag sys sdwan service4", "diagnose system sdwan service4", "diag system sdwan service4"],
    explanation: "`diagnose sys sdwan service4 [<id>]` shows each IPv4 rule. Since FortiOS 7.4.4 the older `diagnose sys sdwan service` is split into `service4` and `service6` (IPv6). The output shows `Mode(...)`, members in their current order of preference, `alive`/`dead`, `sla(0x…)` and `selected`.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-011',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 6 should send YouTube traffic over port2, but YouTube sessions keep following the implicit rule. diagnose sys sdwan internet-service-app-ctrl-list returns no entries. What is the most likely cause?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config service
        edit 6
            set name "YouTube-Steer"
            set internet-service enable
            set internet-service-app-ctrl 31077
            set priority-members 2 1
        next
    end
end

FGT-Branch1 # show firewall policy 1
config firewall policy
    edit 1
        set name "LAN-to-Internet"
        set srcintf "port3"
        set dstintf "underlay"
        set action accept
        set srcaddr "LAN-Net"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end`,
    options: [
      "The firewall policy has no application control profile, so FortiOS never learns the application's IP, protocol and port for the rule to match",
      "Application rules only work with the Lowest Cost (SLA) strategy",
      "The rule must reference port2 by name in the firewall policy instead of the underlay zone",
      "internet-service enable can't be combined with application signatures",
    ],
    answer: [0],
    explanation: "Application-based rules match learned 3-tuples (destination IP, protocol, port). Those are recorded when the IPS engine identifies the application on traffic accepted by a policy **with an application control profile** (`set application-list`, normally with SSL inspection too). Policy 1 has no profile, so the app-ctrl list stays empty and nothing matches. Any strategy works with application destinations. Firewall policies must use zones, not members. `internet-service enable` is exactly how application criteria are enabled.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-012',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "An application-based SD-WAN rule is configured correctly, and the matching firewall policy has application control. A user opens a session to a destination that the application has never used before. How is that first session routed?",
    options: [
      "It isn't matched by the application rule. It follows any later matching rule or the implicit rule, and subsequent sessions to that destination match once the application is learned",
      "It is held until the IPS engine identifies the application, then sent out of the rule's preferred member",
      "It is dropped, because SD-WAN can't route a session before the application is known",
      "It always uses the first member of the application rule, because application rules match on the domain name",
    ],
    answer: [0],
    explanation: "Routing is decided on the first packet, but the application is identified only after a few packets. FortiOS records the identified application's destination IP, protocol and port, and only **later** sessions to that 3-tuple match the rule. The first one takes whatever path the remaining rules or the implicit rule give it. Sessions aren't held or dropped, and application rules don't match on domain names.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-013',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two SD-WAN rule matching criteria can be configured only in the CLI? (Choose two.)",
    options: [
      "ToS/DSCP matching with tos and tos-mask",
      "BGP route tag with route-tag",
      "Internet Service destination",
      "Source address",
      "Zone preference",
      "User group",
    ],
    answer: [0, 1],
    explanation: "`tos`/`tos-mask` and `route-tag` are CLI-only rule fields (so are `input-device` and source ports). Internet Service, source address, user group and zone preference are all on the GUI rule page (**Network > SD-WAN > SD-WAN Rules**).",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-014',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "A collaboration application uses TCP 443 and UDP 3478–3481 to a known server range. The administrator wants one SD-WAN rule to steer all of it. What is the correct approach?",
    options: [
      "Create a custom Internet Service with both protocol/port entries and use it as the rule's destination",
      "Set protocol 6 and protocol 17 in the same rule with two port ranges",
      "Set protocol 0 and start-port 443 end-port 3481",
      "Create two address objects, one per protocol, and add both to dst",
    ],
    answer: [0],
    explanation: "An address-based rule accepts **one** protocol and **one** port range. To match several, the guide recommends a custom Internet Service, whose entries each carry their own protocol and ports. A rule can't hold two `protocol` values. Protocol 0 with 443–3481 would match far more ports than intended. Address objects carry no protocol or port.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-015',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "A FortiGate-VM running on a trial licence has an SD-WAN rule with internet-service-name \"Microsoft-Office365\". The rule shows hit_count=0 even though users are using Office 365. Everything else works. What is the most likely reason?",
    options: [
      "Without FortiGuard, the Internet Service Database doesn't hold the Office 365 address ranges, so the rule has nothing to match",
      "ISDB rules only match local-out traffic",
      "ISDB destinations require the Best Quality strategy",
      "The rule must also set dst to all for the Internet Service to be applied",
    ],
    answer: [0],
    explanation: "ISDB content comes from FortiGuard. The firmware carries only a small built-in package of Fortinet objects, so on a unit without FortiGuard (such as the FortiGate-VM trial) third-party services like Office 365 aren't populated and the rule never matches. ISDB rules apply to forwarded traffic with any strategy, and with `internet-service enable` the rule matches on the ISDB entries, not on `dst`.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-016',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 4 should send FortiGate logs to FortiAnalyzer (10.10.0.50) through the overlay. LAN traffic forwarded to 10.10.0.50 does follow rule 4, but the FortiGate's own log traffic leaves through port1 instead, following the routing table. What should the administrator change?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config service
        edit 4
            set name "To-FAZ"
            set dst "FAZ-Server"
            set priority-members 3 4
        next
    end
end

FGT-Branch1 # show full-configuration log fortianalyzer setting | grep interface-select-method
    set interface-select-method auto`,
    options: [
      "Set interface-select-method sdwan in config log fortianalyzer setting",
      "Move rule 4 above the implicit rule",
      "Add a firewall policy from port3 to the overlay zone for the FortiAnalyzer traffic",
      "Set the rule's input-device to port1",
    ],
    answer: [0],
    explanation: "Log traffic is **local-out** traffic. With the default `interface-select-method auto` it uses only the routing table, so SD-WAN rules don't apply. Setting `sdwan` makes the logging service use SD-WAN and policy-routing rules. (The GUI equivalent is **Network > Local Out Routing**.) The implicit rule is always last already. Local-out traffic isn't controlled by a port3 policy. An input-device match wouldn't help self-originated traffic.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-017',
    topic: '2.1',
    type: 'fill',
    difficulty: 2,
    stem: "Individual applications can't be selected as SD-WAN rule destinations in the GUI by default. Which config system global setting enables Application Detection Based SD-WAN in the GUI? (Give the attribute name.)",
    answer: ["gui-app-detection-sdwan", "set gui-app-detection-sdwan enable"],
    explanation: "`config system global` → `set gui-app-detection-sdwan enable` is the CLI form of **System > Feature Visibility > Application Detection Based SD-WAN**. After that the rule's Destination section offers Application, application group and category.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-018',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Health check Internet_HC defines SLA target 1 (latency 100 ms, jitter 30 ms, packet loss 2%) and SLA target 2 (latency 40 ms, jitter 5 ms, packet loss 1%). What does the output tell you about port1?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(19.517), jitter(1.208) sla_map=0x3
Seq(2 port2): state(alive), packet-loss(1.000%) latency(87.004), jitter(14.730) sla_map=0x1`,
    options: [
      "port1 meets both SLA target 1 and SLA target 2",
      "port1 meets only SLA target 3",
      "port1 has failed three SLA checks in a row",
      "port1 is the third-best member of the health check",
    ],
    answer: [0],
    explanation: "`sla_map` is a bitmap of the targets a member meets: bit 0 (0x1) = target 1, bit 1 (0x2) = target 2, bit 2 (0x4) = target 3. 0x3 = 0x1 + 0x2, so port1 meets targets 1 and 2, which its measurements (19.5 ms, 1.2 ms, 0% loss) confirm. Port2's 0x1 means it meets only target 1: 87 ms and 14.7 ms are inside target 1 but over target 2's 40 ms and 5 ms. The value isn't a counter or a rank, and there is no target 3 here.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-019',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Health check Internet_HC defines SLA target 1 (latency 100 ms, jitter 30 ms, packet loss 2%) and SLA target 2 (latency 40 ms, jitter 5 ms, packet loss 1%). Rule 7 is Lowest Cost (SLA) with the required SLA target Internet_HC ID 2 and priority-members 1 2. Member 1 (port1) has cost 0 and member 2 (port2) has cost 10. Which member does rule 7 use?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(1.000%) latency(64.882), jitter(8.020) sla_map=0x1
Seq(2 port2): state(alive), packet-loss(0.000%) latency(23.115), jitter(1.391) sla_map=0x3`,
    options: [
      "port2, because only port2 meets target 2",
      "port1, because it has the lowest cost and meets an SLA target",
      "port1, because it is listed first and both members are alive",
      "port2, because it has the lower latency",
    ],
    answer: [0],
    explanation: "The rule requires target **2**. Port1's map 0x1 has only bit 0 set (target 1): its 64.9 ms latency and 8 ms jitter are inside target 1 but over target 2's 40 ms and 5 ms, so it fails target 2. Port2's 0x3 includes target 2. A member in SLA beats one out of SLA regardless of cost, so port2 is used. Meeting some *other* target doesn't count. Order only breaks cost ties, and latency isn't compared directly in `sla` mode. Port2 happens to have lower latency, but that isn't why it wins.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-020',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. HUB1-VPN1 meets SLA target 1 and HUB1-VPN2 fails it. Both tunnels are alive and have routes to 10.10.0.0/16. What happens to traffic from the LAN to 10.10.1.20?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config service
        edit 1
            set name "DC-Apps"
            set mode sla
            set dst "DC-Net"
            config sla
                edit "DC_HC"
                    set id 1
                next
            end
            set priority-members 3 4
            set minimum-sla-meet-members 2
        next
        edit 2
            set name "DC-Backup"
            set dst "DC-Net"
            set priority-members 4 3
        next
    end
end`,
    options: [
      "Rule 1 doesn't take effect because fewer than two members meet the SLA, so the traffic matches rule 2 and uses HUB1-VPN2",
      "Rule 1 uses HUB1-VPN1, because it is the only member in SLA",
      "Rule 1 uses HUB1-VPN2, because minimum-sla-meet-members forces both members into use",
      "The traffic is dropped, because rule 1 matches but has no eligible member",
    ],
    answer: [0],
    explanation: "With `minimum-sla-meet-members 2`, rule 1 takes effect only when at least two members meet the SLA. Only one does, so the rule is skipped and evaluation continues to rule 2, a Manual rule that prefers member 4 (HUB1-VPN2). Without the setting (default 0), rule 1 would have used HUB1-VPN1. The setting never forces members into use, and a skipped rule doesn't drop traffic.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-021',
    topic: '2.1',
    type: 'multi',
    difficulty: 3,
    stem: "Refer to the exhibit. Both overlay tunnels are alive but out of SLA. Traffic from the LAN to 10.10.4.8 matches the destination of both rules. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config service
        edit 1
            set name "DC-Apps"
            set mode sla
            set dst "DC-Net"
            config sla
                edit "DC_HC"
                    set id 1
                next
            end
            set priority-members 3 4
            set minimum-sla-meet-members 1
        next
        edit 2
            set name "DC-via-Internet"
            set dst "DC-Net"
            set priority-members 1
        next
    end
end

FGT-Branch1 # diagnose sys sdwan health-check DC_HC
Health Check(DC_HC):
Seq(3 HUB1-VPN1): state(alive), packet-loss(8.000%) latency(212.400), jitter(40.112) sla_map=0x0
Seq(4 HUB1-VPN2): state(alive), packet-loss(11.000%) latency(240.019), jitter(51.880) sla_map=0x0`,
    options: [
      "Rule 1 is skipped because no member meets SLA target 1",
      "Traffic is evaluated against rule 2 next",
      "Rule 1 uses HUB1-VPN1, because it has the lowest cost and is listed first",
      "minimum-sla-meet-members 1 forces rule 1 to keep at least one member selected",
      "Traffic is dropped until a tunnel returns to SLA",
    ],
    answer: [0, 1],
    explanation: "`minimum-sla-meet-members 1` means rule 1 applies only if at least one member is in SLA. Both maps are 0x0, so the rule is skipped and the next rule, rule 2, is evaluated. Without that setting, rule 1 would have chosen among the out-of-SLA members by cost (equal at the default 0) and then order, so HUB1-VPN1. The setting is a threshold for the rule to apply, not a guarantee to keep a member, and skipping a rule never drops traffic by itself.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-022',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "An administrator wants a Lowest Cost (SLA) rule to step aside when its overlay members are out of SLA, and sets minimum-sla-meet-members 1 under config zone → edit \"overlay\". The rule still applies when both tunnels are out of SLA. Why?",
    options: [
      "The zone-level setting belongs to the SD-WAN BGP neighbor feature. The rule only steps aside with minimum-sla-meet-members set in config service",
      "minimum-sla-meet-members only works with the Best Quality strategy",
      "The value must be 0 to make the rule step aside",
      "The setting takes effect only after the hold-down-time expires",
    ],
    answer: [0],
    explanation: "In FortiOS 7.6.4, `minimum-sla-meet-members` exists in two places. Under `config service` (default 0) it decides whether a **rule** takes effect. Under `config zone` (range 1–255, default 1) it is the number of zone members that must meet SLA for an **SD-WAN neighbor** (BGP) to be preferred. It doesn't affect rules. The rule setting applies to SLA-based rules, 0 disables the check, and `hold-down-time` is about failback, not this check.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-023',
    topic: '2.1',
    type: 'order',
    difficulty: 2,
    stem: "Put the steps a Lowest Cost (SLA) rule uses to elect its preferred member in the correct order.",
    items: [
      "Exclude members that are dead",
      "Rank members that meet the required SLA target above members that don't",
      "Within the same SLA state, prefer the member with the lowest cost",
      "If costs are equal, prefer the member listed first in the interface/zone preference",
    ],
    explanation: "Dead members aren't candidates at all. Among the alive members, SLA state comes first: a passing member beats a failing member at any cost. Then cost (lower wins, default 0). Configured order (`cfg_order`) breaks the remaining tie. That is why a cheap member that fails the SLA loses to an expensive member that passes it.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-024',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: "What are the default values of an SD-WAN member's cost and priority in FortiOS 7.6?",
    options: [
      "cost 0, priority 1",
      "cost 1, priority 0",
      "cost 10, priority 1",
      "cost 0, priority 10",
    ],
    answer: [0],
    explanation: "`cost` ranges from 0 to 4294967295 with a default of **0**, and only `sla` mode rules use it. IPv4 `priority` ranges from 1 to 65535 with a default of **1** (IPv6 `priority6` defaults to 1024). It is used in the member's static route and in rules. For both, lower is preferred.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-025',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements about rule 5 are true? (Choose two.)",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config members
        edit 1
            set interface "port1"
            set zone "underlay"
            set gateway 203.0.113.1
            set cost 50
        next
        edit 2
            set interface "port2"
            set zone "underlay"
            set gateway 198.51.100.1
        next
    end
    config service
        edit 5
            set name "Bulk-Web"
            set mode sla
            set load-balance enable
            set dst "all"
            config sla
                edit "Internet_HC"
                    set id 1
                next
            end
            set priority-members 1 2
        next
    end
end`,
    options: [
      "When both members meet SLA target 1, sessions are spread across both, and the cost difference is ignored",
      "When only port2 meets SLA target 1, the rule's sessions use only port2",
      "Sessions are distributed by source IP, because no hash-mode is set",
      "When both members meet SLA target 1, all sessions use port2 because it has the lower cost",
      "The rule can't be edited in the GUI, because load balancing under sla is CLI only",
    ],
    answer: [0, 1],
    explanation: "`mode sla` + `load-balance enable` balances among all members that meet the SLA target, and member cost isn't considered. If only one member passes, only that member is used. With no `hash-mode` shown, the default `round-robin` applies, not source IP. The GUI supports this rule (Lowest Cost (SLA) with **Load balancing** enabled), though its only hash method is round-robin.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-026',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: "An administrator enables Load balancing on an SD-WAN rule in the GUI. Which hash method does the rule use?",
    options: [
      "round-robin",
      "source-ip-based",
      "source-dest-ip-based",
      "bibandwidth",
    ],
    answer: [0],
    explanation: "`round-robin` is the default `hash-mode` and the only one offered in the GUI. `source-ip-based`, `source-dest-ip-based`, `inbandwidth`, `outbandwidth` and `bibandwidth` can only be set in the CLI.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-027',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "After enabling load balancing on an SD-WAN rule for web traffic, users are repeatedly logged out of a banking portal that ties sessions to the client's public IP address. Both links SNAT to their own interface address. What is the best fix?",
    options: [
      "Set hash-mode source-ip-based on the rule so that each user always uses the same member",
      "Set link-cost-threshold 0 on the rule",
      "Change the implicit rule to source-dest-ip-based",
      "Enable snat-route-change so that sessions keep one SNAT address",
    ],
    answer: [0],
    explanation: "The default round-robin sends consecutive sessions from one user out of different members, so the portal sees changing public IPs. `source-ip-based` pins each source to one member while still spreading users. `link-cost-threshold` applies to Best Quality. The implicit rule doesn't handle traffic that matches the rule. `snat-route-change` makes sessions *change* paths on route changes, which is the opposite of what's needed.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-028',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "A load-balancing rule uses hash-mode outbandwidth over a 500 Mbps fibre link and a 20 Mbps DSL link, yet sessions behave as if both links were the same size. What is missing?",
    options: [
      "estimated-upstream-bandwidth on the member interfaces (or speed-test results)",
      "A health check with link-cost-factor outbandwidth",
      "set volume-ratio on each member",
      "set spillover-threshold on the DSL member",
    ],
    answer: [0],
    explanation: "The bandwidth hash modes compare each member's **available** bandwidth: the configured size (`estimated-upstream-bandwidth` / `estimated-downstream-bandwidth` on the interface, in kbps, or a speed test) minus what is measured in use. Without the configured size, the links look the same. `link-cost-factor` belongs to Best Quality. `volume-ratio` and `spillover-threshold` are implicit-rule settings.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-029',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: "No SD-WAN rule matches a session, and the default route is an ECMP route through two SD-WAN members. The administrator never changed the implicit rule. How is the session assigned to a member?",
    options: [
      "By a hash of the source IP address (source-ip-based)",
      "Round-robin, session by session",
      "By the number of sessions on each member (weight-based)",
      "By the member with the lowest cost",
    ],
    answer: [0],
    explanation: "The implicit rule uses `load-balance-mode`, which defaults to `source-ip-based`, so one source IP sticks to one member. Round-robin is a rule `hash-mode`, not an implicit-rule mode. `weight-based` is an option you must select. Cost is only used by Lowest Cost (SLA) rules.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-030',
    topic: '2.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each implicit rule load-balancing algorithm, as named in the GUI, to its load-balance-mode value.",
    pairs: [
      ["Source IP", "source-ip-based"],
      ["Sessions", "weight-based"],
      ["Spillover", "usage-based"],
      ["Source-Destination IP", "source-dest-ip-based"],
      ["Volume", "measured-volume-based"],
    ],
    explanation: "These are the five implicit-rule algorithms under `config system sdwan` → `set load-balance-mode`. Sessions uses member `weight`, Spillover uses `spillover-threshold`/`ingress-spillover-threshold`, and Volume uses `volume-ratio`. Source IP is the default. Volume exists only in SD-WAN, not in plain `v4-ecmp-mode`.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-031',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which implicit rule algorithm is configured?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan member
Member(1): interface: port1, gateway: 203.0.113.1, priority: 1 1024, weight: 80
  Session count: 1622
Member(2): interface: port2, gateway: 198.51.100.1, priority: 1 1024, weight: 20
  Session count: 401`,
    options: [
      "Sessions (weight-based)",
      "Volume (measured-volume-based)",
      "Spillover (usage-based)",
      "Source IP (source-ip-based)",
    ],
    answer: [0],
    explanation: "`diagnose sys sdwan member` prints extra lines for the mode in use. A per-member **Session count** alongside configured weights 80/20 is the `weight-based` (Sessions) output, and 1622:401 is roughly the 80:20 split. Volume mode prints `Config volume ratio` and volume room. Spillover prints the egress/ingress spillover thresholds and `overbps` state. Source IP prints no extra line.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-032',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "With weight-based implicit load balancing, an administrator wants the metered LTE member never to carry unmatched traffic while it remains available to an SD-WAN rule. What should they do?",
    options: [
      "Give the LTE member a higher priority value, so its route stays active but isn't part of the implicit ECMP set",
      "Set the LTE member's weight to 0",
      "Give the LTE member's static route a higher distance",
      "Set the LTE member's volume-ratio to 0",
    ],
    answer: [0],
    explanation: "You can't exclude a member from the implicit rule with weight or volume: both have a minimum of 1, and a 0 carried over from an older release is treated as 1. A higher `priority` value keeps the member's route in the routing table (usable by rules) but out of the lowest-priority ECMP set used by the implicit rule. A higher distance removes the route from the routing table altogether, so rules could no longer use LTE either.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-033',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The implicit rule uses usage-based (Spillover) mode. What does the output show?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan member
Member(1): interface: port1, gateway: 203.0.113.1, priority: 1 1024, weight: 255
  Egress-spillover-threshold: 2000kbit/s, ingress-spillover-threshold: 10000kbit/s
  Egress-overbps=1, ingress-overbps=0
Member(2): interface: port2, gateway: 198.51.100.1, priority: 1 1024, weight: 254
  Egress-spillover-threshold: 0kbit/s, ingress-spillover-threshold: 0kbit/s
  Egress-overbps=0, ingress-overbps=0`,
    options: [
      "port1's outbound traffic exceeds its 2000 kbit/s egress threshold, so new unmatched sessions spill over to port2",
      "port1's inbound traffic exceeds 10000 kbit/s, so port1 stops receiving packets",
      "port2 has no thresholds, so it can't receive spilled-over sessions",
      "Both members are over their thresholds, so sessions are distributed round-robin",
    ],
    answer: [0],
    explanation: "`Egress-overbps=1` means port1's egress has passed `spillover-threshold` (2000 kbit/s). Spillover then sends **new** sessions to the next member, port2. Ingress isn't over (`ingress-overbps=0`). Spillover affects new sessions and never drops packets. Port2's 0 thresholds simply mean no limit is configured on it, and it is the next member in line.",
    lesson: '2.1-load-balancing-implicit',
  },
  {
    id: 'd2-034',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "A rule configured in the CLI with set mode auto and set quality-link 3 is later opened in the GUI, adjusted and saved. What happens to its strategy?",
    options: [
      "The auto strategy is overwritten, because the GUI can't represent it",
      "The GUI keeps auto and displays it as Automatic",
      "The GUI converts it to Lowest Cost (SLA) with minimum-sla-meet-members 3",
      "The rule is disabled until it is reconfigured in the CLI",
    ],
    answer: [0],
    explanation: "Automatic (`auto`) is a legacy, CLI-only strategy. The guide warns that editing such a rule in the GUI overwrites the `auto` option, because the GUI can't select it. There is no automatic conversion to a specific `sla` setting, and the rule isn't disabled.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-035',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about link-cost-threshold in FortiOS 7.6 are true? (Choose two.)",
    options: [
      "Its default value is 10, meaning 10%",
      "It gives an advantage to the member listed first in a Best Quality rule, to reduce flapping",
      "It is the latency in milliseconds above which a member fails the SLA",
      "It is the minimum cost difference needed for a Lowest Cost (SLA) rule to switch members",
      "It defines how many members must meet the SLA for the rule to apply",
    ],
    answer: [0, 1],
    explanation: "`link-cost-threshold` is a percentage (default 10). In a Best Quality rule it biases the comparison in favour of the first-listed member, so near-identical links don't flap. SLA latency targets are `latency-threshold` in the health check's `config sla`. Lowest Cost compares `cost` directly with no threshold. The member count is `minimum-sla-meet-members`.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-036',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. port1 and port3 are in the virtual-wan-link zone, and port2 is the only member of Zone1. In what order does rule 8 prefer the members?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config members
        edit 1
            set interface "port1"
        next
        edit 2
            set interface "port2"
            set zone "Zone1"
        next
        edit 3
            set interface "port3"
        next
    end
    config service
        edit 8
            set name "Mixed-Pref"
            set dst "Partner-Net"
            set priority-members 3 1
            set priority-zone "Zone1"
        next
    end
end`,
    options: [
      "port3, port1, port2",
      "port2, port3, port1",
      "port1, port2, port3",
      "port3, port2, port1",
    ],
    answer: [0],
    explanation: "Members named in Interface preference (`priority-members 3 1`) come first, in their configured order. Members pulled in through Zone preference come after them. So the order is port3, port1, then Zone1's port2. Member sequence numbers don't set the order, and zone members never jump ahead of explicitly listed interfaces.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-037',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. HUB1-VPN1 went down and recovered at 10:00:00. Its health check reports it alive again at 10:00:05. When does rule 2 start sending new sessions to HUB1-VPN1 again?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config service
        edit 2
            set name "DC-Apps"
            set dst "DC-Net"
            set priority-members 3 4
            set hold-down-time 120
        next
    end
end`,
    options: [
      "About 10:02:05, after the 120-second hold-down time",
      "Immediately at 10:00:05",
      "Never, until an administrator clears the rule",
      "About 10:00:07, after the default 2-second hold-down",
    ],
    answer: [0],
    explanation: "`hold-down-time` is the wait, in seconds, before switching from the backup member back to the recovered primary. The default is 0 (immediate failback). Here new sessions keep using HUB1-VPN2 for 120 seconds after HUB1-VPN1 is usable again. There is no manual reset, and 2 seconds isn't a default.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-038',
    topic: '2.1',
    type: 'fill',
    difficulty: 2,
    stem: "In a Best Quality SD-WAN rule, which CLI attribute selects the measured metric (for example latency, jitter or packet-loss) that the rule compares? (Give the attribute name.)",
    answer: ["link-cost-factor", "set link-cost-factor"],
    explanation: "`set link-cost-factor` selects `latency` (default), `jitter`, `packet-loss`, `inbandwidth`, `outbandwidth`, `bibandwidth` or `custom-profile-1`. The GUI calls it **Quality criteria**.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-039',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 1 is a Lowest Cost (SLA) rule with priority-members 1 2, where member 2 has the lower cost. What does the log entry indicate?",
    exhibit: String.raw`date=2026-10-27 time=14:02:17 eventtime=1793127737112093050 tz="-0500" logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Service" serviceid=1 service="Critical-DIA" seq="2,1" msg="Service prioritized by SLA will be redirected in sequence order."`,
    options: [
      "Member 2 is now preferred over member 1 for rule 1 because the SLA state of the members changed",
      "Member 2 has gone dead and member 1 now carries all traffic",
      "Rule 1 was moved to position 2 in the rule list",
      "The rule now load-balances sessions between members 2 and 1",
    ],
    answer: [0],
    explanation: "`seq=\"2,1\"` is the rule's new member order after an SLA change. With member 2 cheaper, this is what you see when member 2 returns to SLA (or member 1 leaves it). The message for an SLA-mode rule says *prioritized by SLA*. A dead member produces \"Member link is unreachable or miss threshold. Stop forwarding traffic.\". Rule positions aren't logged this way, and a load-balancing rule logs \"Service will be load balanced among members with available routing.\".",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-040',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What do these two log entries tell the administrator?",
    exhibit: String.raw`logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Health Check" healthcheck="Internet_HC" slatargetid=1 oldvalue="2" newvalue="1" msg="Number of pass member changed."
logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Health Check" healthcheck="Internet_HC" slatargetid=1 member="2" msg="Member status changed. Member out-of-sla."`,
    options: [
      "Member 2 stopped meeting SLA target 1 of Internet_HC, so only one member now passes that target",
      "Member 2 is dead and its static routes were removed",
      "Two members were removed from health check Internet_HC",
      "SLA target 1 was reconfigured from 2 to 1 members",
    ],
    answer: [0],
    explanation: "Both entries are `0113022923` health-check events. The number of members passing target 1 went from 2 to 1, and member 2 is now **out-of-SLA**. Out of SLA isn't dead: when a health check detects a failure (the member goes dead), FortiOS logs the `0100022921` \"Routing information changed\" event (\"Static route on interface … may be removed by health-check …\"). Nothing was reconfigured.",
    lesson: '2.1-lowest-cost-sla-maps',
  },
  {
    id: 'd2-041',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "VoIP calls must always use whichever of the two overlay tunnels currently has the least delay variation, regardless of any SLA thresholds. Which rule configuration meets the requirement?",
    options: [
      "set mode priority, set health-check \"DC_HC\", set link-cost-factor jitter",
      "set mode sla with an SLA target that has jitter-threshold 30",
      "set mode manual with priority-members 3 4 and hold-down-time 30",
      "set mode sla, set load-balance enable, set hash-mode source-dest-ip-based",
    ],
    answer: [0],
    explanation: "\"Least delay variation right now, regardless of thresholds\" is Best Quality (`mode priority`) on `link-cost-factor jitter`. Lowest Cost (SLA) uses pass/fail thresholds and then cost, so the best-jitter member isn't necessarily chosen. Manual ignores quality. Load balancing spreads calls across all passing members.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-042',
    topic: '2.1',
    type: 'multi',
    difficulty: 1,
    stem: "Which two rule strategies use measurements from a performance SLA (health check) to decide the member order? (Choose two.)",
    options: [
      "Best Quality",
      "Lowest Cost (SLA)",
      "Manual",
      "Manual with load balancing enabled",
      "The implicit rule with source-ip-based",
    ],
    answer: [0, 1],
    explanation: "Best Quality compares one measured metric, and Lowest Cost (SLA) uses SLA targets as pass/fail. Manual, with or without load balancing, uses no SLA targets: the guide says load balancing under Manual doesn't use SLA targets. The implicit rule spreads sessions over the ECMP routes with no quality input.",
    lesson: '2.1-manual-best-quality',
  },
  {
    id: 'd2-043',
    topic: '2.1',
    type: 'fill',
    difficulty: 3,
    stem: "By default, a ping run from the FortiGate CLI uses the routing table only. Which execute command makes subsequent execute ping commands follow SD-WAN rules?",
    answer: ["execute ping-options use-sdwan yes", "exec ping-options use-sdwan yes"],
    explanation: "`execute ping-options use-sdwan yes` makes CLI pings use SD-WAN rules (and `execute traceroute-options use-sdwan yes` does the same for traceroute). It is part of the local-out routing options. Without it, the ping follows the routing table.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-044',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Office 365 traffic should use port2, but it leaves through port1. Why?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    ...
    config service
        edit 1
            set name "All-Web"
            set dst "all"
            set protocol 6
            set start-port 443
            set end-port 443
            set priority-members 1 2
        next
        edit 2
            set name "SaaS-O365"
            set internet-service enable
            set internet-service-name "Microsoft-Office365"
            set priority-members 2 1
        next
    end
end`,
    options: [
      "Rules are evaluated top-down and Office 365 traffic on TCP 443 already matches rule 1",
      "ISDB rules are always evaluated after address-based rules",
      "Rule 2 needs dst set to all to match",
      "Rule 2 only applies to local-out traffic",
    ],
    answer: [0],
    explanation: "SD-WAN rules are first match, top-down. Office 365 HTTPS is TCP 443 to some address, so rule 1 (any destination, TCP 443) matches first and sends it out of port1. Move rule 2 above rule 1. There is no automatic ordering by rule type (ISDB *static routes* sit before SD-WAN rules, but that's a different object). An Internet Service rule doesn't use `dst`, and it applies to forwarded traffic.",
    lesson: '2.1-sdwan-rules-matching',
  },
  {
    id: 'd2-045',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 2 is configured with priority-members 1 2. Why is port2 listed first?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan service4 2

Service(2): Address Mode(IPV4) flags=0x200
  Gen(4), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(manual)
  Members(2):
    1: Seq_num(2 port2), alive, selected
    2: Seq_num(1 port1), dead
  Dst address(1):
        10.20.30.0-10.20.30.255`,
    options: [
      "port1 is dead, so the rule moved it below port2, which now carries new sessions",
      "port2 has lower latency, so the Manual rule promoted it",
      "port2 has a lower cost than port1",
      "The rule is load-balancing and lists the members alphabetically",
    ],
    answer: [0],
    explanation: "`service4` lists members in their current order of preference. Port1 is `dead` and has no `selected` flag, so port2, the next configured member, is on top and carries new sessions. A Manual rule never reorders on latency or cost, and the header shows `Mode(manual)`, not load balancing.",
    lesson: '2.1-manual-best-quality',
  },
  // ---------------------------------------------------------------- 2.2 SD-WAN routing
  {
    id: 'd2-046',
    topic: '2.2',
    type: 'order',
    difficulty: 2,
    stem: "Put the stages FortiOS 7.6 uses to find the egress for a new session in the correct order.",
    items: [
      "Regular policy routes (config router policy)",
      "ISDB routes (static routes with an Internet Service destination)",
      "SD-WAN rules, top-down",
      "The FIB (kernel routing table), where the implicit SD-WAN rule applies",
    ],
    explanation: "The 7.6 guide gives the policy route precedence as policy-based routes > ISDB routes > SD-WAN routes. All three are checked before the FIB. If none matches (or all are skipped), the FIB decides, and for SD-WAN routes that means the implicit rule's `load-balance-mode`. A packet that matches nothing at all is dropped.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-047',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Traffic from 10.1.50.21 to 192.0.2.80 arrives on port3. Which interface does it leave from?",
    exhibit: String.raw`FGT-Branch1 # diagnose firewall proute list
list route policy info(vf=root):
id=1(0x01) dscp_tag=0xfc 0xfc flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 port=src(0->0):dst(0->0) iif=9(port3)
path(1): oif=4(port2) gwy=198.51.100.1
source wildcard(1): 10.1.50.0/255.255.255.0
destination wildcard(1): 0.0.0.0/0.0.0.0
hit_count=204 rule_last_used=2026-10-27 09:31:44

id=2131820545(0x7f110001) vwl_service=1(Critical-DIA) vwl_mbr_seq=1 2 dscp_tag=0xff 0xff flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 sport=0-65535 iif=0 dport=1-65535 path(2) oif=3(port1) oif=4(port2)
destination(1): 192.0.2.0-192.0.2.255
source wildcard(1): 0.0.0.0/0.0.0.0
hit_count=0 last_used=2026-10-25 17:02:09`,
    options: [
      "port2, because the regular policy route id=1 matches first",
      "port1, because SD-WAN rule 1 prefers member 1 for 192.0.2.0/24",
      "port1 or port2, according to the implicit rule's load-balance-mode",
      "port1, because the SD-WAN rule is more specific than the policy route",
    ],
    answer: [0],
    explanation: "Regular policy routes are checked before SD-WAN rules. Entry `id=1` (a low ID, no `vwl_service`) matches source 10.1.50.0/24 arriving on port3 for any destination, and forwards to port2 via 198.51.100.1. The SD-WAN rule's `hit_count=0` confirms it isn't being reached. Policy routes are first match in order, not longest match, so specificity doesn't matter.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-048',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A Manual SD-WAN rule sends traffic for 172.16.40.0/24 to member 2 (port2). Hosts in that subnet are still reached through port5, which isn't an SD-WAN member. Why?",
    exhibit: String.raw`FGT-Branch1 # get router info routing-table all
...
Routing table for VRF=0
S*      0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]
                  [1/0] via 198.51.100.1, port2, [1/0]
C       10.1.50.0/24 is directly connected, port3
C       10.1.99.0/24 is directly connected, port5
S       172.16.40.0/24 [10/0] via 10.1.99.254, port5, [1/0]
C       198.51.100.0/29 is directly connected, port2
C       203.0.113.0/29 is directly connected, port1`,
    options: [
      "The FIB best match for 172.16.40.0/24 points at port5, which isn't an SD-WAN member, so the rule isn't used",
      "The static route via port5 has a lower distance than the SD-WAN default route",
      "Manual rules only apply to the default route",
      "port2 has no route to 172.16.40.0/24, so the rule skips port2 and tries port1",
    ],
    answer: [0],
    explanation: "By default an SD-WAN rule may steer traffic only if the **FIB best match** for the destination is an SD-WAN member. The /24 through port5 is more specific than the default route, so it is the best match, and it isn't a member. The rule is ignored. The distance comparison is wrong (the /24 has distance 10, the default route 1): longest prefix wins before distance. Port2 does have a route (the default route), so check 2 would pass. Check 1 is what fails. `set default enable` + `set gateway enable` would bypass the checks.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-049',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Rule 2 (DC-Apps, Manual, priority-members 3 4) matches 10.10.0.0/16. Both tunnels are up, but traffic from the LAN to 10.10.1.20 leaves through port1 to the internet. What is the cause?",
    exhibit: String.raw`FGT-Branch1 # get router info routing-table all
...
Routing table for VRF=0
S*      0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]
                  [1/0] via 198.51.100.1, port2, [1/0]
C       10.1.50.0/24 is directly connected, port3
C       10.255.1.2/32 is directly connected, HUB1-VPN1
C       10.255.2.2/32 is directly connected, HUB1-VPN2
C       198.51.100.0/29 is directly connected, port2
C       203.0.113.0/29 is directly connected, port1

FGT-Branch1 # diagnose sys sdwan service4 2

Service(2): Address Mode(IPV4) flags=0x200
  Gen(3), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(manual)
  Members(2):
    1: Seq_num(3 HUB1-VPN1), alive, selected
    2: Seq_num(4 HUB1-VPN2), alive, selected
  Dst address(1):
        10.10.0.0-10.10.255.255`,
    options: [
      "Neither tunnel has a route to 10.10.0.0/16, so the rule can't use them and the traffic follows the default route through the implicit rule",
      "Manual rules require a health check to use IPsec members",
      "The implicit rule is evaluated before Manual rules",
      "The tunnels must be in the virtual-wan-link zone for the rule to work",
    ],
    answer: [0],
    explanation: "The FIB best match for 10.10.1.20 is the default route through port1 and port2, which are SD-WAN members, so check 1 passes. But check 2 requires a route to the destination **through the chosen member**, and no route to 10.10.0.0/16 exists via either tunnel. Both members fail, the rule is skipped, and the implicit rule sends the traffic out of the default route. Add a static route (or BGP) for 10.10.0.0/16 via the overlay. `service4` can still show the members alive and selected: it reflects member state, not per-destination route checks.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-050',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: "By default (default and gateway disabled on the rule), which two conditions must be met before an SD-WAN rule can send a matching packet out of a member? (Choose two.)",
    options: [
      "The FIB best match for the destination must be an SD-WAN member",
      "A route to the destination must exist through that member",
      "The member must be referenced directly in the firewall policy",
      "The rule must reference a performance SLA",
      "The member's cost must be lower than that of the other members",
    ],
    answer: [0, 1],
    explanation: "The guide lists two FIB lookups for every SD-WAN policy route: the best match for the destination must return an SD-WAN member, and a route to the destination must exist over the desired member. Firewall policies reference zones, never members. Manual rules use no SLA. Cost matters only to the election in `sla` mode, not to whether a member may be used.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-051',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "An administrator sets both set default enable and set gateway enable on an SD-WAN rule. What is the effect?",
    options: [
      "The rule bypasses both FIB checks and sends matching traffic to the chosen member's configured gateway, so every member needs a gateway",
      "The rule becomes the implicit rule for all unmatched traffic",
      "The rule is used only when the default route is missing from the routing table",
      "The rule uses the gateway learned from DHCP and ignores the member gateway",
    ],
    answer: [0],
    explanation: "With `default enable` and `gateway enable` together, FortiOS skips the two FIB checks and routes matching traffic to the chosen member using the member's configured `gateway`. The guide notes that members must have a gateway configured. It doesn't make the rule the implicit rule, and it doesn't depend on the default route being absent.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-052',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "A rule has set gateway enable but default left at disable. How does this change the FIB checks the rule performs?",
    options: [
      "The best-match check still applies, but the second check becomes: a route to the member's gateway IP must exist over any interface",
      "Both FIB checks are bypassed",
      "Only the second check applies, and the best-match check is skipped",
      "Nothing changes until load balancing is also enabled",
    ],
    answer: [0],
    explanation: "Per the 7.6 guide, `gateway enable` with `default disable` keeps the first rule (FIB best match must be an SD-WAN member) but changes the second to \"a FIB route to the gateway IP address must exist over any interface\". Traffic is then sent to the member's gateway. Bypassing both checks needs `default enable` as well. Load balancing is unrelated.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-053',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A Lowest Cost (SLA) rule prefers port2 for a destination on the internet, and port2 meets the SLA. Traffic still leaves through port1. Why?",
    exhibit: String.raw`FGT-Branch1 # show router static
config router static
    edit 1
        set gateway 203.0.113.1
        set device "port1"
    next
    edit 2
        set gateway 198.51.100.1
        set distance 15
        set device "port2"
    next
end

FGT-Branch1 # get router info routing-table database
...
S    *> 0.0.0.0/0 [10/0] via 203.0.113.1, port1
S       0.0.0.0/0 [15/0] via 198.51.100.1, port2`,
    options: [
      "port2's default route has a higher distance, so it isn't in the routing table and the rule can't use port2",
      "The rule needs set priority-members 2 1 to override distance",
      "Static routes through SD-WAN members must use sdwan-zone, so route 2 is ignored",
      "port2's route is in the FIB, but cost 0 on port1 beats it",
    ],
    answer: [0],
    explanation: "Only the lowest-distance route is installed. The `[15/0]` route via port2 has no `*>`: it exists only in the routing database, not in the routing table or FIB. With no active route through port2, the rule's second FIB check fails for port2 and traffic stays on port1. Use the same distance and a higher **priority** for a backup member instead. Routes through individual members are allowed. Cost doesn't influence which routes are installed.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-054',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which change makes port2 a backup for unmatched (implicit rule) traffic while keeping it usable by SD-WAN rules and by inbound sessions on port2?",
    exhibit: String.raw`FGT-Branch1 # show router static
config router static
    edit 1
        set distance 1
        set sdwan-zone "underlay"
    next
end

FGT-Branch1 # show system sdwan
config system sdwan
    set status enable
    ...
    config members
        edit 1
            set interface "port1"
            set zone "underlay"
            set gateway 203.0.113.1
        next
        edit 2
            set interface "port2"
            set zone "underlay"
            set gateway 198.51.100.1
        next
    end
    ...
end`,
    options: [
      "Set priority 10 on SD-WAN member 2",
      "Set cost 100 on SD-WAN member 2",
      "Replace the zone route with two member routes and give the port2 route distance 20",
      "Set weight 1 on member 2 and weight 255 on member 1",
    ],
    answer: [0],
    explanation: "The member `priority` is copied into the zone route's next hop via port2. With equal distance both routes stay active (rules and RPF still work), and the implicit rule's ECMP set uses only the lowest priority, port1. Cost affects only `sla` rules, not the implicit rule. A higher distance would remove port2's route from the routing table. Weights only change the ratio in `weight-based` mode, so port2 would still get sessions.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-055',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. No SD-WAN rule matches a new session to 192.0.2.15. Which statement is true?",
    exhibit: String.raw`FGT-Branch1 # get router info routing-table all
...
Routing table for VRF=0
S*      0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]
                  [1/0] via 198.51.100.1, port2, [10/0]
C       10.1.50.0/24 is directly connected, port3
C       198.51.100.0/29 is directly connected, port2
C       203.0.113.0/29 is directly connected, port1`,
    options: [
      "The session uses port1, because only the lowest-priority next hop forms the ECMP set used by the implicit rule",
      "The session is load-balanced between port1 and port2 by source IP",
      "The session uses port2, because it has the higher priority value",
      "The session is dropped, because the two next hops have different priorities",
    ],
    answer: [0],
    explanation: "The trailing `[1/0]` and `[10/0]` are each next hop's priority/weight. Both routes have distance 1, so both are in the table, but the lower priority (1, port1) is preferred. ECMP only spreads across routes that tie on distance **and** priority, so the implicit rule uses port1 alone. A higher priority value is *less* preferred. Different priorities don't make the route invalid.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-056',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about SD-WAN members and zones in FortiOS 7.6 are true? (Choose two.)",
    options: [
      "An individual SD-WAN member can be used as the interface of a static route",
      "Firewall policies reference SD-WAN zones, not individual members",
      "A member must be removed from SD-WAN before it can be used in an SD-WAN rule",
      "A static route to a zone needs a gateway IP configured on the route itself",
      "Each zone automatically creates a default route through all its members",
    ],
    answer: [0, 1],
    explanation: "Members and zones can both be used in static routes and SD-WAN rules. Individual members **can't** be used directly in firewall policies, which use zones (a member that needs its own policy goes into its own zone). A zone static route (`set sdwan-zone`) takes its next hops from the members' `gateway` settings, so no gateway is set on the route. Zones create no routes by themselves, so you still have to configure the default route.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-057',
    topic: '2.2',
    type: 'fill',
    difficulty: 1,
    stem: "In config router static, which attribute makes a route point at one or more SD-WAN zones instead of a single interface? (Give the attribute name.)",
    answer: ["sdwan-zone", "set sdwan-zone"],
    explanation: "`set sdwan-zone \"underlay\"` (one or more zone names) creates a route with one next hop per member of the zone, using each member's gateway and priority. It works in `config router static` and `config router static6`.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-058',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. SD-WAN rule 1 sends traffic from 10.1.50.0/24 to SaaS-Net out of port2. Which path does that traffic take?",
    exhibit: String.raw`FGT-Branch1 # show router policy
config router policy
    edit 1
        set input-device "port3"
        set src "10.1.50.0/255.255.255.0"
        set action deny
    next
end`,
    options: [
      "It skips the rest of the policy route table, including the SD-WAN rule, and is routed by the FIB and the implicit rule",
      "It is dropped, because the policy route action is deny",
      "It matches SD-WAN rule 1 and leaves through port2, because a deny policy route only blocks non-SD-WAN routes",
      "It is dropped, but only if no firewall policy allows it",
    ],
    answer: [0],
    explanation: "In `config router policy`, `action deny` (GUI **Stop Policy Routing**) means \"do not search the policy route table\". It doesn't drop traffic. The rest of the table, which includes the SD-WAN rules, is skipped, and the packet is routed by the FIB, where the implicit rule applies. Dropping is a firewall-policy decision, not a routing-policy one.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-059',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "A regular policy route specifies output-device port2 but no gateway. How does FortiOS treat it?",
    options: [
      "It looks up the routing table for a route through port2 to find the gateway. If none exists, the policy route doesn't match and the search continues",
      "It sends the traffic out of port2 and ARPs for every destination",
      "It rejects the configuration, because a gateway is mandatory",
      "It uses the SD-WAN member gateway of port2, even if port2 isn't an SD-WAN member",
    ],
    answer: [0],
    explanation: "A policy route needs enough information to route. With only an outgoing interface, FortiOS looks up the gateway in the routing table, filtered by that interface. If it can't find one, the policy route doesn't match and evaluation continues down the list, then to the routing table. The configuration is valid without a gateway, and SD-WAN member settings don't fill the gap for regular policy routes.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-060',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Health check Internet_HC (server 198.51.100.10) uses members 1 and 2. What are these two entries?",
    exhibit: String.raw`FGT-Branch1 # get router info kernel
...
tab=254 vf=0 scope=0 type=1 proto=17 prio=0 203.0.113.2/255.255.255.255/0->198.51.100.10/32 pref=0.0.0.0 gwy=203.0.113.1 dev=3(port1)
tab=254 vf=0 scope=0 type=1 proto=17 prio=0 198.51.100.2/255.255.255.255/0->198.51.100.10/32 pref=0.0.0.0 gwy=198.51.100.1 dev=4(port2)`,
    options: [
      "Dedicated kernel routes that SD-WAN adds so each member's probes to the health-check server leave through that member",
      "Static routes the administrator configured for the health-check server",
      "ECMP routes that load-balance user traffic to 198.51.100.10 across both members",
      "Policy routes generated from an SD-WAN rule for 198.51.100.10",
    ],
    answer: [0],
    explanation: "SD-WAN adds dedicated kernel routes (`proto=17`) for health checks, using the member's interface IP (or its `source` setting) as the source. Each entry matches source = member IP and destination = probe server, so port1's probes go via 203.0.113.1 and port2's via 198.51.100.1. They aren't user-configured statics and don't appear in `routing-table all`. Because they are tied to the member's source IP, they don't load-balance user traffic. Policy routes appear in `diagnose firewall proute list`, not in the kernel table.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-061',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "An SD-WAN rule (Manual, priority-members 2 1) matches destination 198.51.100.0/24, which includes the health-check server 198.51.100.10 used by members 1 and 2. Which member do port1's health-check probes use?",
    options: [
      "port1, because health-check probes use dedicated per-member kernel routes and aren't steered by SD-WAN rules",
      "port2, because the SD-WAN rule matches the probe destination",
      "Whichever member the implicit rule picks",
      "None. Probes to a destination covered by a rule are suppressed",
    ],
    answer: [0],
    explanation: "Each member's probes follow the dedicated kernel host route created for that member (source = member IP, destination = server, via the member's gateway). Measuring port1 through port2 would make the measurement meaningless, so SD-WAN rules don't redirect probes. The implicit rule doesn't apply to probes either, and they aren't suppressed.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-062',
    topic: '2.2',
    type: 'single',
    difficulty: 1,
    stem: "An administrator looks for the routes SD-WAN creates for health-check probes, but get router info routing-table all doesn't show them. Which command does show them?",
    options: [
      "get router info kernel",
      "get router info routing-table database",
      "diagnose sys sdwan service4",
      "diagnose firewall proute list",
    ],
    answer: [0],
    explanation: "Probe routes are kernel (FIB) entries with `proto=17`. They appear in `get router info kernel` (or `diagnose ip route list`), not in the routing table or the routing database. `service4` shows rules, and `proute list` shows policy routes and SD-WAN rules.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-063',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. The health check uses the default member state change action. Which two consequences follow? (Choose two.)",
    exhibit: String.raw`date=2026-10-28 time=08:15:02 eventtime=1793193302401827710 tz="-0500" logid="0100022921" type="event" subtype="system" level="critical" vd="root" logdesc="Routing information changed" name="Internet_HC" interface="port1" status="down" msg="Static route on interface port1 may be removed by health-check Internet_HC. Route:  (203.0.113.2->198.51.100.10 ping-down)"`,
    options: [
      "The port1 next hop is withdrawn from static routes such as the zone default route, so the implicit rule stops using port1",
      "SD-WAN rules skip port1 for destinations that no longer have a route through it",
      "port1 is removed from the SD-WAN configuration until an administrator re-adds it",
      "Best Quality rules keep port1 on top, because Best Quality ignores whether a member is dead",
      "The health check stops probing port1 until the interface is bounced",
    ],
    answer: [0, 1],
    explanation: "With `update-static-route enable` (the default), a dead member's static routes are withdrawn, which is what the `0100022921` event reports. The zone route loses the port1 next hop, so the implicit rule moves to port2, and rules fail FIB check 2 for port1. The member stays configured, and probing continues so the routes return on recovery (after `recoverytime`). Best Quality only compares **alive** members, so a dead member drops to the bottom of every rule.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-064',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Health check Internet_HC declares port1 dead. Which routes through port1 stay in the routing table?",
    exhibit: String.raw`FGT-Branch1 # show router static
config router static
    edit 1
        set distance 1
        set sdwan-zone "underlay"
    next
    edit 2
        set dst 192.0.2.0 255.255.255.0
        set gateway 203.0.113.1
        set device "port1"
        set link-monitor-exempt enable
    next
end`,
    options: [
      "Only route 2 to 192.0.2.0/24, because it is exempt from withdrawal by link monitors and health checks",
      "Both routes, because update-static-route only affects routes added by the SD-WAN wizard",
      "Neither route, because link-monitor-exempt only applies to config system link-monitor",
      "Only the port1 next hop of route 1, because zone routes are never withdrawn",
    ],
    answer: [0],
    explanation: "`link-monitor-exempt enable` stops a static route from being withdrawn when a link monitor **or health check** fails. The CLI reference describes it that way. Route 2 stays. The port1 next hop of the zone route (route 1) is withdrawn, since `update-static-route` applies to static routes on the member's interface, including zone routes.",
    lesson: '2.2-member-zone-probe-routes',
  },
  {
    id: 'd2-065',
    topic: '2.2',
    type: 'fill',
    difficulty: 1,
    stem: "Which diagnose command lists the policy route table, including regular policy routes, ISDB routes and SD-WAN rules with their member order and hit counts?",
    answer: ["diagnose firewall proute list", "diag firewall proute list", "diag fire proute list", "diagnose firewall proute list "],
    explanation: "`diagnose firewall proute list` (and `proute6` for IPv6) shows every policy route. SD-WAN rules appear with `vwl_service=<id>(<name>)`, `vwl_mbr_seq` and the `oif` list in current order. ISDB routes show `static_route=<id>`. User policy routes have low IDs. In the GUI, the routing monitor's **Policy** view lists the same set.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-066',
    topic: '2.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each field from a diagnose firewall proute list entry for an SD-WAN rule to its meaning.",
    pairs: [
      ["vwl_service=1(Critical-DIA)", "The SD-WAN rule ID and name"],
      ["vwl_mbr_seq=2 1", "Member sequence numbers in current order of preference"],
      ["oif=4(port2) oif=3(port1)", "Egress interfaces, in the same order as the members"],
      ["hit_count=388", "How many times the entry has matched"],
      ["destination(1): 192.0.2.0-192.0.2.255", "The rule's destination address range"],
    ],
    explanation: "An SD-WAN rule in the policy route table carries `vwl_service` (rule ID and name), `vwl_mbr_seq` (member order), the `oif` list (egress interfaces in that order), the address match lines, and `hit_count`/`last_used`. The order changes as strategies react to link quality, so this is a quick way to see the current preference.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-067',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FortiClient endpoints on the LAN contact FortiGuard. SD-WAN rule 3 matches Internet Service Fortinet-FortiGuard and prefers port2. Which interface does that forwarded traffic use?",
    exhibit: String.raw`FGT-Branch1 # show router static 5
config router static
    edit 5
        set gateway 203.0.113.1
        set device "port1"
        set internet-service 1245324
    next
end

FGT-Branch1 # diagnose firewall proute list
list route policy info(vf=root):
id=2113929221(0x7e000005) static_route=5 dscp_tag=0xfc 0xfc flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 port=src(0->0):dst(1->65535) iif=0(any)
path(1): oif=3(port1) gwy=203.0.113.1
source wildcard(1): 0.0.0.0/0.0.0.0
destination wildcard(1): 0.0.0.0/0.0.0.0
internet service(1): Fortinet-FortiGuard(1245324,0,0,0)
hit_count=57 rule_last_used=2026-10-28 08:15:02`,
    options: [
      "port1, because ISDB routes take precedence over SD-WAN rules",
      "port2, because SD-WAN rules take precedence over static routes",
      "port1 or port2, depending on load-balance-mode",
      "port2, because ISDB routes are only used when no SD-WAN member is available",
    ],
    answer: [0],
    explanation: "A static route with an Internet Service destination is an **ISDB route**, a special policy route (note `static_route=5` in `proute list`). The 7.6 precedence is policy-based routes > ISDB routes > SD-WAN routes, so the ISDB route sends the FortiGuard traffic out of port1 before the SD-WAN rule is considered. It isn't an ordinary FIB route, so the usual \"policy routes beat static routes\" reasoning doesn't apply.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-068',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "A VIP is published on port2's public address. The two default routes are port1 at distance 10 and port2 at distance 20. Inbound sessions to the VIP fail while port1 is up, and work only when port1 is down. What is the best fix?",
    options: [
      "Use the same distance on both routes and give port2 a higher priority, so port2's route stays active and passes the reverse-path check",
      "Enable asymroute so that the FortiGate ignores the routing table",
      "Add port2 to a separate zone and reference it in the VIP",
      "Set snat-route-change enable",
    ],
    answer: [0],
    explanation: "With distance 20, port2's route isn't in the routing table while port1 is up. The SYN arriving on port2 fails the RPF (reverse-path) check, because there is no active route back through port2. Equal distance with a higher priority keeps port2's route active (so RPF passes and replies go back out of port2) while outbound unmatched traffic still prefers port1. `asymroute` disables stateful inspection for those flows and is a last resort. VIPs don't reference zones. `snat-route-change` deals with existing SNAT sessions after route changes.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-069',
    topic: '2.2',
    type: 'order',
    difficulty: 2,
    stem: "FortiOS has several routes to the same destination. Put the criteria it applies, from first to last, when deciding which routes to install and prefer.",
    items: [
      "Longest prefix (most specific route)",
      "Lowest administrative distance",
      "Lowest priority (and cost) among the routes that tie on distance",
      "ECMP across the routes that tie on everything",
    ],
    explanation: "The most specific route always wins first. Among equally specific routes, the lowest distance is installed and the others stay in the routing database. Routes that tie on distance are all installed, and priority/cost decide which are preferred (lower wins). Any routes still tied form an ECMP set, which the SD-WAN implicit rule distributes with `load-balance-mode`.",
    lesson: '2.2-route-lookup-policy-routes',
  },
  {
    id: 'd2-070',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. A third member, port4 (gateway 203.0.113.9), is added to the underlay zone with priority 5. Which two statements about route 1 are true afterwards? (Choose two.)",
    exhibit: String.raw`FGT-Branch1 # show router static
config router static
    edit 1
        set distance 1
        set sdwan-zone "underlay"
    next
end

FGT-Branch1 # get router info routing-table all
...
S*      0.0.0.0/0 [1/0] via 203.0.113.1, port1, [1/0]
                  [1/0] via 198.51.100.1, port2, [1/0]`,
    options: [
      "Route 1 gains a next hop via 203.0.113.9 on port4 without any change to config router static",
      "The new next hop carries priority 5, so the implicit rule keeps using only port1 and port2",
      "The administrator must add a separate static route for port4 before it is used",
      "port4 immediately receives one third of the implicit-rule sessions",
      "Route 1's distance changes to 5 for every next hop",
    ],
    answer: [0, 1],
    explanation: "A zone route expands into one next hop per member, using each member's gateway and priority, so port4 joins route 1 automatically with `[1/0] via 203.0.113.9, port4, [5/0]`. Port1 and port2 keep priority 1, so they stay the preferred ECMP set for the implicit rule and port4 gets no implicit-rule sessions (rules can still use it). No extra route is needed. Member priority doesn't change the route's distance.",
    lesson: '2.2-member-zone-probe-routes',
  },
  // ---------------------------------------------------------------- 2.3 SD-WAN performance controls (sessions)
  {
    id: 'd2-071',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Interface index 3 is port1, 4 is port2 and 9 is port3. Which SD-WAN member is this session using?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys session list

session info: proto=6 proto_state=11 duration=96 expire=3599 timeout=3600 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3
origin-shaper=
reply-shaper=
per_ip_shaper=
class_id=0 ha_id=0 policy_dir=0 tunnel=/ vlan_cos=0/255
state=log may_dirty f00
statistic(bytes/packets/allow_err): org=8211/37/1 reply=96530/81/1 tuples=2
tx speed(Bps/kbps): 85/0 rx speed(Bps/kbps): 1005/8
orgin->sink: org pre->post, reply pre->post dev=9->3/3->9 gwy=203.0.113.1/10.1.50.21
hook=post dir=org act=snat 10.1.50.21:50112->192.0.2.80:443(203.0.113.2:50112)
hook=pre dir=reply act=dnat 192.0.2.80:443->203.0.113.2:50112(10.1.50.21:50112)
misc=0 policy_id=1 pol_uuid_idx=571 auth_info=0 chk_client_info=0 vd=0
...`,
    options: [
      "port1, NATed to 203.0.113.2 and sent to gateway 203.0.113.1",
      "port2, because the reply direction is 3->9",
      "port3, because the session entered on interface 9",
      "It can't be determined without diagnose sys sdwan service4",
    ],
    answer: [0],
    explanation: "`dev=9->3/3->9` reads original direction port3 → port1, reply port1 → port3. `gwy=203.0.113.1` is port1's ISP gateway, and `act=snat … (203.0.113.2:50112)` NATs to port1's address. The session table is the authoritative record of the member a session uses. `service4` only shows what a rule would choose for **new** sessions.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-072',
    topic: '2.3',
    type: 'single',
    difficulty: 1,
    stem: "In diagnose sys session list output, what does proto=6 proto_state=11 indicate?",
    options: [
      "A TCP session that is established in both directions",
      "A UDP session that has seen eleven replies",
      "A TCP session in the SYN_SENT state",
      "An ICMP session with type 11 (time exceeded)",
    ],
    answer: [0],
    explanation: "Protocol 6 is TCP. TCP `proto_state` has two digits because the FortiGate tracks both directions, and 1 is ESTABLISHED, so 11 is established both ways. UDP is protocol 17 and only uses 0 (reply not seen) and 1 (reply seen). SYN_SENT is state 2. ICMP sessions always show `proto_state=00`.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-073',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users on the LAN report slow DNS resolution through port2. What does the session show?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys session filter dport 53
FGT-Branch1 # diagnose sys session list

session info: proto=17 proto_state=00 duration=21 expire=159 timeout=180 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3
...
state=log may_dirty f00
statistic(bytes/packets/allow_err): org=264/4/1 reply=0/0/0 tuples=2
...
orgin->sink: org pre->post, reply pre->post dev=9->4/4->9 gwy=198.51.100.1/10.1.50.21
hook=post dir=org act=snat 10.1.50.21:61022->203.0.113.53:53(198.51.100.2:61022)
...
misc=0 policy_id=1 pol_uuid_idx=571 auth_info=0 chk_client_info=0 vd=0
...`,
    options: [
      "The firewall policy allowed the queries out of port2, but no reply has come back for this UDP session",
      "The firewall policy is blocking the replies, which is why proto_state is 00",
      "The session is an ICMP session, because proto_state is 00",
      "The FortiGate is still waiting for the TCP handshake to complete",
    ],
    answer: [0],
    explanation: "Protocol 17 is UDP. A UDP `proto_state` of 0 means the reply hasn't been seen, and `reply=0/0` confirms that nothing came back, while four queries left port2 (`dev=9->4`, SNAT to 198.51.100.2). Policy 1 accepted the session, and replies to an existing session don't need a policy. Look at the path beyond port2. ICMP is protocol 1, and DNS here isn't TCP.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-074',
    topic: '2.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each TCP proto_state digit value to its state.",
    pairs: [
      ["1", "ESTABLISHED"],
      ["2", "SYN_SENT"],
      ["3", "SYN & SYN/ACK"],
      ["5", "TIME_WAIT"],
      ["7", "CLOSE_WAIT"],
    ],
    explanation: "The 7.6 guide lists the TCP values: 0 NONE, 1 ESTABLISHED, 2 SYN_SENT, 3 SYN & SYN/ACK, 4 FIN_WAIT, 5 TIME_WAIT, 6 CLOSE, 7 CLOSE_WAIT, 8 LAST_ACK, 9 LISTEN. Each of the two digits in `proto_state` uses this table, one per direction.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-075',
    topic: '2.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each session state flag to its meaning.",
    pairs: [
      ["may_dirty", "Session details are allowed to change"],
      ["dirty", "The session has been marked for re-evaluation"],
      ["local", "The session is attached to the FortiGate's own IP stack"],
      ["npu", "The session is offloaded to an NP processor"],
      ["redir", "The session is redirected to an internal FortiGate proxy"],
      ["block", "The session was re-evaluated to block after a policy change"],
    ],
    explanation: "These are the session-table flags from the guide's table. `may_dirty` permits changes and `dirty` means a change has happened and the session is re-checked. `local` marks local-in/local-out sessions, `npu` hardware offload, `redir` proxy inspection, and `block` a session cut by a policy change. `dirty` and `block` are the ones that relate most directly to re-evaluation.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-076',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A Lowest Cost (SLA) rule used to prefer port2. Port2 has fallen out of SLA but is still alive, and the rule now prefers port1 for new sessions. A long-running UDP media session is still on port2 with poor quality. What should the administrator do so that such sessions move with the rule?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys session filter dst 192.0.2.80
FGT-Branch1 # diagnose sys session list

session info: proto=17 proto_state=01 duration=1430 expire=176 timeout=180 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3
...
state=log may_dirty f00
...
orgin->sink: org pre->post, reply pre->post dev=9->4/4->9 gwy=198.51.100.1/10.1.50.21
hook=post dir=org act=snat 10.1.50.21:5004->192.0.2.80:5004(198.51.100.2:5004)
...`,
    options: [
      "Enable snat-route-change under config system global",
      "Enable preserve-session-route on port2",
      "Set firewall-session-dirty check-new",
      "Increase the rule's hold-down-time",
    ],
    answer: [0],
    explanation: "The session is source-NATed. By default, SNAT sessions keep their outbound interface after a routing change as long as the old route is still active, and port2's route is still active because port2 is alive. `config system global` → `set snat-route-change enable` makes SNAT sessions take a new route lookup with new SNAT. `preserve-session-route` pins sessions even more firmly. `check-new` concerns firewall policy changes. `hold-down-time` only delays failback for new sessions.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-077',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Branch-to-DC traffic over the overlay isn't NATed. A Best Quality rule changes its order from HUB1-VPN1 to HUB1-VPN2. preserve-session-route is disabled on all interfaces. What happens to this existing TCP session?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys session filter dst 10.10.1.20
FGT-Branch1 # diagnose sys session list

session info: proto=6 proto_state=11 duration=842 expire=3598 timeout=3600 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3
...
state=log may_dirty f00
...
orgin->sink: org pre->post, reply pre->post dev=9->17/17->9 gwy=10.255.1.1/10.1.50.21
hook=pre dir=org act=noop 10.1.50.21:52311->10.10.1.20:443(0.0.0.0:0)
hook=post dir=reply act=noop 10.10.1.20:443->10.1.50.21:52311(0.0.0.0:0)
...`,
    options: [
      "Its route information is flushed, and its next packet is routed afresh, so it moves to HUB1-VPN2 without changing its addresses",
      "It stays on HUB1-VPN1 until it ends, because existing sessions are never re-routed",
      "It is dropped and the client must reconnect",
      "It stays on HUB1-VPN1 unless snat-route-change is enabled",
    ],
    answer: [0],
    explanation: "Without SNAT (`act=noop`), a routing change flushes routing information from sessions and the next packet triggers a new lookup. The rule's policy route is regenerated when its member order changes (Fortinet's `sla-stickiness` examples show existing overlay sessions switching members this way). The session moves to HUB1-VPN2, and since the source address doesn't change, TCP keeps working. Of the session settings, `preserve-session-route enable` is the one that would keep it on HUB1-VPN1. Existing sessions are re-routed, not dropped. `snat-route-change` affects only SNAT sessions.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-078',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about preserve-session-route are true? (Choose two.)",
    options: [
      "It is configured under config system interface",
      "With it enabled, existing sessions keep their route after a routing change, and only new sessions use the new route",
      "It is a global setting under config system global",
      "It forces SNAT sessions to take a new route lookup after a routing change",
      "It prevents health checks from withdrawing static routes",
    ],
    answer: [0, 1],
    explanation: "`set preserve-session-route enable` is an interface setting. The CLI describes it as preserving the session route when the session is dirty, and the guide says routing look-up then occurs only for new sessions. The global setting is `snat-route-change`, which does the opposite for SNAT sessions. Keeping routes from being withdrawn is `link-monitor-exempt` on the static route.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-079',
    topic: '2.3',
    type: 'fill',
    difficulty: 2,
    stem: "Under config system global, which command makes source-NATed sessions perform a new route lookup (and get new SNAT) when the routing changes? (Give the full set command.)",
    answer: ["set snat-route-change enable", "snat-route-change enable"],
    explanation: "`config system global` → `set snat-route-change enable` (default `disable`). Without it, SNAT sessions keep their outbound interface as long as the old route is still active.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-080',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "An administrator edits a firewall policy to remove a destination. The FortiGate uses the default firewall-session-dirty setting. What happens to existing sessions that the policy previously allowed to that destination?",
    options: [
      "They are re-evaluated against the new policy set, so they stop passing traffic unless another policy allows them",
      "They continue until they time out, and only new sessions see the change",
      "They are re-evaluated only if preserve-session-route is disabled",
      "Nothing happens until snat-route-change is enabled",
    ],
    answer: [0],
    explanation: "The default `firewall-session-dirty` is `check-all`: sessions affected by a policy change are flushed, and their next packets are re-evaluated by stateful inspection. A session now denied stops (the `block` flag). \"Only new sessions\" describes `check-new`. `preserve-session-route` and `snat-route-change` concern routing changes, not policy changes.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-081',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: "Which two events can cause FortiOS to re-evaluate existing sessions? (Choose two.)",
    options: [
      "A change to a firewall policy",
      "A routing change, such as a health check withdrawing a member's static routes",
      "A traffic log being written for the session",
      "An administrator logging in to the GUI",
      "A health-check probe being sent on the session's member",
    ],
    answer: [0, 1],
    explanation: "Policy changes (governed by `firewall-session-dirty`) and routing changes (governed by `preserve-session-route` and `snat-route-change`) mark sessions for re-evaluation. That includes SD-WAN route withdrawals and rule-order changes. Logging, admin logins and individual probes don't touch existing sessions. Only the state *change* that probes may cause does.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-082',
    topic: '2.3',
    type: 'order',
    difficulty: 1,
    stem: "An administrator wants to delete only the sessions sourced from 10.1.50.21, after checking which sessions those are. Put the commands in the correct order.",
    items: [
      "diagnose sys session filter clear",
      "diagnose sys session filter src 10.1.50.21",
      "diagnose sys session list",
      "diagnose sys session clear",
    ],
    explanation: "Clear any old filter first (filters persist and combine), set the new filter, list to verify what matches, and only then clear. `diagnose sys session clear` deletes every session that matches the current filter. Run it without a filter and it clears every session.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-083',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What do the timer fields tell you about this session?",
    exhibit: String.raw`session info: proto=6 proto_state=11 duration=3588 expire=12 timeout=3600 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3`,
    options: [
      "No packet has passed for about 3588 seconds, so the session will be removed in about 12 seconds unless traffic resumes",
      "The session has 12 seconds of its maximum lifetime left, whether or not traffic passes",
      "The session timed out 12 seconds ago and is waiting to be cleared",
      "The session has been re-evaluated 12 times",
    ],
    answer: [0],
    explanation: "`timeout` is how long the session may stay idle in its current state (3600 s), and `expire` counts down from that since the last packet. With `duration=3588` and `expire=12`, the session has been idle since it was established. Any new packet resets `expire` to the timeout. It isn't a hard lifetime limit, it hasn't expired yet, and no field counts re-evaluations.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-084',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Why does FortiOS, by default, leave existing source-NATed sessions on their original SD-WAN member after a routing change, as long as the old route is still active?",
    options: [
      "Moving them would change their public source IP address, which breaks TCP sessions at the far end",
      "SNAT sessions are always offloaded and can't be re-routed",
      "The session table can't store a second SNAT address",
      "SNAT sessions are exempt from firewall policy checks",
    ],
    answer: [0],
    explanation: "A different member means NAT to a different public address. The server sees packets from an unknown source mid-session, and TCP connections fail. Keeping the session on its member while the old route is still usable avoids breaking it, and `snat-route-change enable` overrides this when moving matters more. Offload, storage limits and policy exemptions have nothing to do with it.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-085',
    topic: '2.3',
    type: 'fill',
    difficulty: 2,
    stem: "A remote server administrator reports traffic from public address 198.51.100.2. Which diagnose sys session filter key matches sessions by their NAT'd source IP? (Give the keyword.)",
    answer: ["nsrc", "diagnose sys session filter nsrc"],
    explanation: "`diagnose sys session filter nsrc 198.51.100.2` matches the translated source address (`nport` matches the translated source port). `src` would match the original, pre-NAT client address.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-086',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Shortly after a health check withdrew port1's routes, an administrator sees this flag on a non-NAT session. What does it mean?",
    exhibit: String.raw`state=log may_dirty dirty f00`,
    options: [
      "The session has been marked as changed and will be re-evaluated, including a new route lookup, when its next packet arrives",
      "The session is corrupt and will be deleted",
      "The session has been offloaded to the NP processor",
      "The session failed RPF and is being dropped",
    ],
    answer: [0],
    explanation: "`dirty` means the session has been altered and must be re-checked. That requires `may_dirty`, which permits changes. After a routing change the next packet gets a fresh route lookup, so a non-NAT session moves to a remaining member. It isn't corruption or deletion. Offload is `npu`. RPF failures don't create a session at all.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-087',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "DIA traffic is source-NATed. Both underlay members are healthy. To move unmatched traffic to port2, an administrator raises the priority value of port1's member from 1 to 10. snat-route-change is disabled. What happens to existing NATed sessions on port1?",
    options: [
      "They keep using port1 until they end, because port1's route is still active",
      "They move to port2 on their next packet, NATed to port2's address",
      "They are deleted, and clients must reconnect",
      "They move to port2 but keep port1's NAT address",
    ],
    answer: [0],
    explanation: "This is the case the guide describes for SNAT sessions: after a routing change they keep using the same outbound interface **as long as the old route is still active**, and a priority change leaves port1's route active. Only new sessions use port2. `snat-route-change enable` would make them take a new lookup with new SNAT on port2. Sessions aren't deleted by a route change, and FortiOS doesn't send traffic out of port2 with port1's address.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-088',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Interface index 3 is port1 and 9 is port3. Which two statements about this session are true? (Choose two.)",
    exhibit: String.raw`session info: proto=6 proto_state=11 duration=33 expire=3597 timeout=3600 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3
origin-shaper=
reply-shaper=
per_ip_shaper=
class_id=0 ha_id=0 policy_dir=0 tunnel=/ vlan_cos=0/255
state=log may_dirty f00
statistic(bytes/packets/allow_err): org=1840/12/1 reply=20337/19/1 tuples=2
tx speed(Bps/kbps): 55/0 rx speed(Bps/kbps): 616/4
orgin->sink: org pre->post, reply pre->post dev=9->3/3->9 gwy=203.0.113.1/10.1.50.33
hook=post dir=org act=snat 10.1.50.33:40920->192.0.2.80:443(203.0.113.2:40920)
hook=pre dir=reply act=dnat 192.0.2.80:443->203.0.113.2:40920(10.1.50.33:40920)
misc=0 policy_id=1 pol_uuid_idx=571 auth_info=0 chk_client_info=0 vd=0
serial=0004c2e9 tos=ff/ff app_list=0 app=0 url_cat=0
...`,
    options: [
      "Firewall policy 1 accepted the session",
      "The session leaves port1 and is source-NATed to 203.0.113.2",
      "The session is offloaded to an NP processor",
      "The TCP handshake hasn't completed yet",
      "The session is logged both at its start and at its end",
    ],
    answer: [0, 1],
    explanation: "`policy_id=1` names the accepting policy. `dev=9->3`, `gwy=203.0.113.1` and the `snat` hook show egress through port1 with NAT to 203.0.113.2. There is no `npu` flag. `proto_state=11` is established both ways. Logging at start would add `log-start`, and only `log` is present.",
    lesson: '2.3-session-table-states-flags',
  },
  {
    id: 'd2-089',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "In a Lowest Cost (SLA) rule, an administrator enables set sla-stickiness enable. What is the effect?",
    options: [
      "Traffic stays on its original session path while that path is still within SLA, even if another member becomes preferred",
      "Members that fail the SLA are removed from the rule permanently",
      "SNAT sessions are re-routed whenever the rule's order changes",
      "The rule waits for the hold-down-time before applying any SLA result",
    ],
    answer: [0],
    explanation: "The 7.6.4 CLI describes `sla-stickiness` (default disable) as: \"Traffic remains in the original session path if the path is within the SLA\". With it disabled, traffic switches to the best path regardless of the SLA. It doesn't remove members, isn't the SNAT re-routing switch (`snat-route-change`), and isn't `hold-down-time`.",
    lesson: '2.3-session-reevaluation-snat',
  },
  {
    id: 'd2-090',
    topic: '2.3',
    type: 'fill',
    difficulty: 2,
    stem: "A session shows dev=9->4/4->9. Which diagnose command lists interfaces with their index numbers so you can identify interfaces 9 and 4?",
    answer: ["diagnose netlink interface list", "diag netlink interface list", "diagnose netlink interface list | grep index"],
    explanation: "`diagnose netlink interface list` prints each interface with its `index=`, for example `if=port2 … index=4`. The guide uses it, filtered with `grep \"index=4 \"`, to decode the `dev=` field of a session.",
    lesson: '2.3-session-table-states-flags',
  },
];
