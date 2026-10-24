// Domain 2 — Switching and Network Access question bank (original questions).
export default [
  // ---------------------------------------------------------------- 2.1
  {
    id: 'd2-001',
    topic: '2.1',
    type: 'fill',
    difficulty: 1,
    stem: "A Catalyst 9300 port GigabitEthernet1/0/48 will become a routed point-to-point link to a router. Which interface configuration command converts the port from a Layer 2 switchport to a Layer 3 routed port so it can accept an IP address?",
    answer: ['no switchport'],
    explanation: "`no switchport` turns a Catalyst switchport into a routed port: it gets its own IP address, belongs to no VLAN, and stops running STP and DTP. Entering `switchport` reverses it. Commands such as `ip routing` enable routing between interfaces but do not change a port from Layer 2 to Layer 3.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-002',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An engineer is configuring a trunk on an older Catalyst 3560 that supports both ISL and 802.1Q. What must be done before the trunk command is accepted?",
    exhibit: `SW3(config)# interface GigabitEthernet0/1
SW3(config-if)# switchport mode trunk
Command rejected: An interface whose trunk encapsulation is "Auto" can not be configured to "trunk" mode.`,
    options: [
      "Configure `switchport trunk encapsulation dot1q` on the interface",
      "Configure `switchport nonegotiate` on the interface",
      "Configure `switchport trunk native vlan 1` on the interface",
      "Configure `no switchport` and then reapply `switchport mode trunk`",
    ],
    answer: [0],
    explanation: "ISL-capable platforms default to `switchport trunk encapsulation negotiate` (shown as Auto) and will not accept a static trunk until an encapsulation is chosen, so `switchport trunk encapsulation dot1q` is required first. This is a platform caveat: Catalyst 9000 and 2960-family switches support only 802.1Q, so the step is not needed there. `switchport nonegotiate` only stops DTP frames and does not set the encapsulation. Setting the native VLAN does not resolve the encapsulation state. `no switchport` would make the port a routed port, which cannot be a trunk at all.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-003',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement correctly describes the problem?",
    exhibit: `SW1# show logging | include NATIVE
%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet1/0/24 (1), with SW2 GigabitEthernet1/0/24 (99).`,
    options: [
      "SW1 Gi1/0/24 uses native VLAN 1 and SW2 Gi1/0/24 uses native VLAN 99; the native VLAN must be set to the same value on both ends",
      "SW1 Gi1/0/24 uses native VLAN 99 and SW2 Gi1/0/24 uses native VLAN 1; SW1 must be changed to VLAN 1",
      "VLAN 99 is missing from the allowed VLAN list on SW1; adding it with `switchport trunk allowed vlan add 99` resolves the message",
      "The trunk cannot form, so both ports remain access ports until the native VLANs match",
    ],
    answer: [0],
    explanation: "In this CDP message the first interface and VLAN in parentheses are local (SW1 Gi1/0/24, native VLAN 1) and the second pair is the neighbor's (SW2 Gi1/0/24, native VLAN 99). The fix is to configure the same native VLAN on both ends. Swapping the two values reads the message backward. The allowed VLAN list does not cause a native VLAN mismatch. The trunk still comes up with a mismatch; the risk is untagged frames landing in the wrong VLAN, and Rapid PVST+ blocks the affected VLANs on the port as PVID-inconsistent.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-004',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Hosts in VLAN 30 on SW2 cannot reach hosts in VLAN 30 on SW1 across trunk Gi1/0/1. VLAN 30 exists on both switches. Which command on SW1 Gi1/0/1 fixes the problem without interrupting VLANs 10 and 20?",
    exhibit: `SW1# show interfaces trunk

Port        Mode             Encapsulation  Status        Native vlan
Gi1/0/1     on               802.1q         trunking      1

Port        Vlans allowed on trunk
Gi1/0/1     10,20

Port        Vlans allowed and active in management domain
Gi1/0/1     10,20

Port        Vlans in spanning tree forwarding state and not pruned
Gi1/0/1     10,20`,
    options: [
      "switchport trunk allowed vlan add 30",
      "switchport trunk allowed vlan 30",
      "switchport trunk allowed vlan except 30",
      "switchport trunk native vlan 30",
    ],
    answer: [0],
    explanation: "The allowed list is 10,20, so VLAN 30 frames are not carried. `switchport trunk allowed vlan add 30` appends VLAN 30 and keeps 10 and 20. `switchport trunk allowed vlan 30` replaces the list with only VLAN 30, cutting off VLANs 10 and 20 (the classic outage). `except 30` allows every VLAN except 30 — the opposite of what is needed. Changing the native VLAN to 30 does not add it to the allowed list and would create a native VLAN mismatch with SW2.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-005',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Two Catalyst switches are connected with one link and use DTP. Which two combinations of administrative modes result in an operational 802.1Q trunk? (Choose two.)",
    options: [
      "dynamic auto on both ends",
      "dynamic auto on one end and dynamic desirable on the other",
      "trunk on one end and dynamic auto on the other",
      "access on one end and dynamic desirable on the other",
      "trunk with switchport nonegotiate on one end and dynamic auto on the other",
      "dynamic desirable on one end and access on the other",
    ],
    answer: [1, 2],
    explanation: "A trunk forms when at least one side actively asks for it (desirable or trunk, which sends DTP) and the other side is willing (auto, desirable or trunk). So auto + desirable and trunk + auto both trunk. Auto + auto never forms a trunk because neither side initiates. An access port never trunks, regardless of the peer. With `nonegotiate`, the trunk side sends no DTP, so the auto side never hears a request and stays an access port — a mismatch, not a working trunk.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-006',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: "Two Catalyst 9300 switches with factory-default interface configuration are cabled GigabitEthernet1/0/48 to GigabitEthernet1/0/48. How does the link operate?",
    options: [
      "As an access link in VLAN 1, because both ports default to dynamic auto",
      "As an 802.1Q trunk, because both ports default to dynamic desirable",
      "As an 802.1Q trunk, because both ports default to trunk mode",
      "As a routed link, because Catalyst 9000 ports default to no switchport",
    ],
    answer: [0],
    explanation: "Catalyst 9000 switchports default to `switchport mode dynamic auto`. Auto only responds to a DTP request; with auto on both ends nobody asks, so both ports operate as access ports in VLAN 1. Dynamic desirable was the default on some much older Catalyst models, not on the 9000 series. Ports are not static trunks by default, and Catalyst 9000 front-panel ports are Layer 2 switchports by default, not routed ports.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-007',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the operational result on the link between SW1 and SW2?",
    exhibit: `SW1# show running-config interface GigabitEthernet1/0/1
interface GigabitEthernet1/0/1
 switchport mode trunk
 switchport nonegotiate
end

SW2# show running-config interface GigabitEthernet1/0/1
interface GigabitEthernet1/0/1
 switchport mode dynamic desirable
end`,
    options: [
      "SW1 operates as a trunk and SW2 operates as an access port, so the link is mismatched",
      "Both ports operate as 802.1Q trunks because SW2 actively negotiates",
      "Both ports operate as access ports in VLAN 1",
      "SW1 rejects `switchport nonegotiate` because it cannot be combined with trunk mode",
    ],
    answer: [0],
    explanation: "SW1 is a static trunk that sends no DTP frames and ignores negotiation. SW2 (desirable) sends DTP requests but never receives a DTP reply, so it falls back to access mode. Result: one side tags, the other doesn't — a mismatch. Desirable cannot form a trunk without hearing DTP from the peer. SW1 is a trunk, so both being access ports is wrong. `switchport nonegotiate` is valid with `switchport mode trunk` or `switchport mode access`; it is rejected only on dynamic ports.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-008',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An AI network assistant reviewed the output and posted its diagnosis. How should the engineer evaluate the assistant's recommendation?",
    exhibit: `DSW1# show ip interface brief | include Vlan
Vlan10                 10.1.10.1       YES manual up                    up
Vlan20                 10.1.20.1       YES manual up                    up
Vlan30                 10.1.30.1       YES manual up                    down

DSW1# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi1/0/3, Gi1/0/4
10   USERS                            active    Gi1/0/5, Gi1/0/6
20   PRINTERS                         active    Gi1/0/7
1002 fddi-default                     act/unsup
1003 token-ring-default               act/unsup
1004 fddinet-default                  act/unsup
1005 trnet-default                    act/unsup

AI assistant: "Interface Vlan30 is up/down because IP routing is disabled.
Run 'ip routing' in global configuration mode to bring Vlan30 up."`,
    options: [
      "The recommendation is wrong; VLAN 30 does not exist on DSW1, so the SVI stays down until `vlan 30` is created and a port in VLAN 30 is up and forwarding",
      "The recommendation is correct; an SVI cannot reach up/up until `ip routing` is enabled",
      "The recommendation is wrong; the SVI is administratively shut down and needs `no shutdown`",
      "The recommendation is wrong; Vlan30 needs a different IP subnet because it overlaps with Vlan20",
    ],
    answer: [0],
    explanation: "Vlan10 and Vlan20 are up/up, which already proves `ip routing` has nothing to do with SVI state — the assistant's reasoning is wrong. `show vlan brief` has no VLAN 30, and an SVI is up/up only when its VLAN exists, the SVI is not shut, and at least one port in the VLAN is up and STP-forwarding. Creating VLAN 30 (and assigning a port or allowing it on a forwarding trunk) brings it up. The status column says `up`, not `administratively down`, so `no shutdown` is not the fix. Nothing in the output points to an address overlap, and IOS rejects an overlapping address at configuration time rather than leaving the SVI up/down.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-009',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "With default autostate behavior, which three conditions must all be true for interface Vlan40 on a Catalyst switch to be up/up? (Choose three.)",
    options: [
      "VLAN 40 exists and is active in the VLAN database",
      "Interface Vlan40 is not administratively shut down",
      "At least one Layer 2 port in VLAN 40 is up and in the STP forwarding state for VLAN 40",
      "`ip routing` is enabled globally",
      "VLAN 40 is configured as the native VLAN on at least one trunk",
      "An IP address is configured on interface Vlan40",
    ],
    answer: [0, 1, 2],
    explanation: "The autostate rule: the VLAN exists and is active, the SVI is not shut, and at least one access port in the VLAN or trunk carrying it is up and forwarding for that VLAN. `ip routing` controls routing between interfaces, not SVI state. The VLAN does not need to be a native VLAN — a tagged VLAN on a forwarding trunk counts. An SVI can be up/up with no IP address configured.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-010',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 performs router-on-a-stick routing for VLANs 10 and 20. The switch port facing R1 is a working 802.1Q trunk allowing VLANs 10 and 20. Hosts cannot ping their default gateways. What is the cause?",
    exhibit: `R1# show running-config | section GigabitEthernet0/0/1
interface GigabitEthernet0/0/1
 no ip address
 shutdown
 negotiation auto
interface GigabitEthernet0/0/1.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface GigabitEthernet0/0/1.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0`,
    options: [
      "The physical interface GigabitEthernet0/0/1 is shut down, so both subinterfaces are down",
      "Each subinterface needs its own `no shutdown` command before it can come up",
      "R1 needs the `ip routing` command before subinterfaces can route",
      "R1 needs `switchport mode trunk` on GigabitEthernet0/0/1",
    ],
    answer: [0],
    explanation: "Subinterfaces depend on the parent interface; with `shutdown` on Gi0/0/1, both Gi0/0/1.10 and Gi0/0/1.20 are down. `no shutdown` on the physical interface fixes it. The subinterfaces show no `shutdown` line, so they are not individually shut. `ip routing` is enabled by default on IOS-XE routers. Router interfaces are Layer 3 and have no `switchport` commands; the `encapsulation dot1Q` lines are what make the router speak 802.1Q.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-011',
    topic: '2.1',
    type: 'fill',
    difficulty: 1,
    stem: "On router R1, complete the subinterface command so that Gi0/0/1.20 processes frames tagged with 802.1Q VLAN 20.\n\nR1(config)# interface GigabitEthernet0/0/1.20\nR1(config-subif)# ________________",
    answer: ['encapsulation dot1q 20', 'encap dot1q 20'],
    explanation: "`encapsulation dot1Q 20` binds the subinterface to VLAN 20. It must be configured before an IP address can be assigned to the subinterface. The subinterface number (.20) is only a label; the VLAN comes from the encapsulation command.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-012',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "A switch trunk toward R1 uses native VLAN 99, and the management subnet 192.168.99.0/24 lives in VLAN 99. Which configuration on R1 correctly terminates the untagged VLAN 99 traffic on a subinterface?",
    options: [
      "`interface GigabitEthernet0/0/1.99` with `encapsulation dot1Q 99 native` and an IP address in 192.168.99.0/24",
      "`interface GigabitEthernet0/0/1.99` with `switchport trunk native vlan 99` and an IP address in 192.168.99.0/24",
      "`interface GigabitEthernet0/0/1.99` with `encapsulation untagged 99` and an IP address in 192.168.99.0/24",
      "`interface GigabitEthernet0/0/1.99` with `encapsulation dot1Q 99` only; routers automatically treat the lowest VLAN as native",
    ],
    answer: [0],
    explanation: "The `native` keyword tells the subinterface to send and receive VLAN 99 frames untagged, matching the switch's native VLAN. (Configuring the IP address on the physical interface is the other valid approach.) `switchport trunk native vlan` is a switch command that does not exist on a router subinterface. `encapsulation untagged` is not how a router-on-a-stick subinterface is configured. Without `native`, the subinterface expects VLAN 99 frames to be tagged, and routers do not pick a native VLAN automatically.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-013',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Why is GigabitEthernet1/0/3 not carrying traffic for Port-channel1?",
    exhibit: `SW1# show etherchannel summary | begin Group
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP        Gi1/0/1(P)  Gi1/0/2(P)  Gi1/0/3(s)

SW1# show logging | include 1/0/3
%EC-5-CANNOT_BUNDLE2: Gi1/0/3 is not compatible with Po1 and will be suspended (vlan mask is different)

SW1# show running-config interface GigabitEthernet1/0/1
interface GigabitEthernet1/0/1
 switchport trunk allowed vlan 10,20,30
 switchport mode trunk
 channel-group 1 mode active
end

SW1# show running-config interface GigabitEthernet1/0/3
interface GigabitEthernet1/0/3
 switchport trunk allowed vlan 10,20
 switchport mode trunk
 channel-group 1 mode active
end`,
    options: [
      "Its allowed VLAN list differs from the port channel's, so it is suspended until the configuration matches",
      "It is a hot-standby member because LACP allows only two active ports",
      "It is physically down; the flag indicates no link",
      "Port-channel1 is a Layer 3 channel and Gi1/0/3 is a Layer 2 port",
    ],
    answer: [0],
    explanation: "The `(s)` flag means suspended, and the log states the reason: the VLAN mask (allowed VLAN list) of Gi1/0/3 (10,20) differs from the bundle (10,20,30). Setting the same allowed list lets it bundle. Hot-standby is flag `H`, and LACP allows up to 8 active members (platform-dependent), not 2. A physically down member shows `D`. `Po1(SU)` means a Layer 2 channel in use; a Layer 3 channel would show `R`.",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-014',
    topic: '2.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each EtherChannel mode combination (one end + other end) to its result.",
    pairs: [
      ['active + passive', 'Bundles using LACP'],
      ['passive + passive', 'No bundle: neither side initiates negotiation'],
      ['desirable + auto', 'Bundles using PAgP'],
      ['on + on', 'Bundles with no negotiation protocol'],
      ['on + active', 'No bundle: the static side sends no LACPDUs'],
    ],
    explanation: "LACP needs at least one `active` side; two `passive` sides just listen. PAgP needs at least one `desirable` side. `on` forces a channel without any protocol and only works against another `on`. Pairing `on` with `active` fails because the `on` side never sends LACPDUs; the EtherChannel misconfiguration guard may err-disable the `on` side to prevent a loop.",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-015',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Port-channel5 between SW1 and SW2 stays down (`show etherchannel summary` shows Po5(SD)). An AI assistant proposed a fix. Which response is correct?",
    exhibit: `SW1# show running-config | section interface GigabitEthernet1/0/4[78]
interface GigabitEthernet1/0/47
 switchport mode trunk
 channel-group 5 mode passive
interface GigabitEthernet1/0/48
 switchport mode trunk
 channel-group 5 mode passive

SW2# show running-config | section interface GigabitEthernet1/0/4[78]
interface GigabitEthernet1/0/47
 switchport mode trunk
 channel-group 5 mode passive
interface GigabitEthernet1/0/48
 switchport mode trunk
 channel-group 5 mode passive

AI assistant: "Both sides are LACP passive. Change SW1's member ports to
'channel-group 5 mode desirable' so SW1 starts the negotiation."`,
    options: [
      "Reject it: desirable is a PAgP mode and will not negotiate with LACP; instead set one side (or both) to `channel-group 5 mode active`",
      "Accept it: desirable on one side and passive on the other forms an LACP channel",
      "Reject it: the fix is `lacp rate fast` on both sides so the LACPDUs are exchanged quickly enough",
      "Reject it: the fix is `channel-protocol lacp` on both sides, because the protocol was never set",
    ],
    answer: [0],
    explanation: "LACP passive + passive never forms, because neither side sends LACPDUs to start negotiation. The right fix is LACP `active` on at least one side. The assistant correctly identified the cause but picked a PAgP mode (`desirable`), which cannot pair with LACP `passive` — the two protocols never interoperate. `lacp rate fast` only changes how often LACPDUs are requested once LACP is running. The `passive` keyword already selects LACP, so adding `channel-protocol lacp` changes nothing.",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-016',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which three settings must be consistent across all member ports for them to bundle into one Layer 2 EtherChannel? (Choose three.)",
    options: [
      "Speed and duplex",
      "Switchport mode and VLAN settings (access VLAN, or native VLAN and allowed VLAN list on trunks)",
      "Interface type: all Layer 2 switchports or all Layer 3 routed ports",
      "Interface descriptions",
      "Consecutive physical port numbers on the same switch",
      "Spanning-tree port priority",
    ],
    answer: [0, 1, 2],
    explanation: "Members must share speed/duplex, switchport mode and VLAN configuration, and the same L2/L3 type, otherwise they are suspended or rejected. Descriptions are cosmetic. Members can be any ports, including ports on different members of a switch stack. STP port cost and priority do not have to match; STP treats the port channel as one logical port.",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-017',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The engineer wants a Layer 3 port channel with IP address 10.10.10.1/30. Why was the IP address rejected, and what is the correct approach?",
    exhibit: `DSW1(config)# interface range GigabitEthernet1/0/47 - 48
DSW1(config-if-range)# channel-group 10 mode active
Creating a port-channel interface Port-channel 10
DSW1(config-if-range)# exit
DSW1(config)# interface Port-channel10
DSW1(config-if)# ip address 10.10.10.1 255.255.255.252
% IP addresses may not be configured on L2 links.`,
    options: [
      "The members were switchports, so Port-channel10 was created as Layer 2; remove the channel group, configure `no switchport` on the members, then re-add `channel-group 10 mode active` and put the IP on Port-channel10",
      "`ip routing` is disabled; enabling it allows IP addresses on port-channel interfaces",
      "LACP does not support Layer 3 channels; use `channel-group 10 mode on` instead",
      "Layer 3 EtherChannels carry the IP address on each member port; configure 10.10.10.1 on GigabitEthernet1/0/47 and 10.10.10.2 on GigabitEthernet1/0/48",
    ],
    answer: [0],
    explanation: "A port channel inherits its type from its members. Because Gi1/0/47-48 were switchports when they joined, Port-channel10 is Layer 2 and refuses an IP address. Make the members routed (`no switchport`) before `channel-group`, then configure the address on Port-channel10 (it will show `RU` in `show etherchannel summary`). `ip routing` doesn't control whether an interface accepts an IP address. LACP fully supports Layer 3 channels. The IP lives on the port-channel interface, never on the members.",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-018',
    topic: '2.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each flag from `show etherchannel summary` to its meaning.",
    pairs: [
      ['P', 'Member is bundled in the port channel'],
      ['s', 'Member is suspended because its configuration is incompatible'],
      ['I', 'Member is running stand-alone with no negotiated partner'],
      ['H', 'LACP hot-standby member waiting to replace an active link'],
      ['D', 'Member is down'],
      ['R', 'Port channel is Layer 3'],
    ],
    explanation: "`P` is the healthy member state. `s` (lowercase) is suspended, usually due to a configuration mismatch. `I` means the port found no LACP/PAgP partner and runs as an individual link. `H` is LACP-only, used when more members are configured than can be active. `D` is down. On the port-channel line, `R` = Layer 3 and `S` = Layer 2, combined with `U` (in use).",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-019',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "An engineer assigns ten 10-Gigabit ports on each of two Catalyst 9500 switches to LACP channel-group 1 in active mode. All ports are configured identically and all links are up. Assuming the platform's limit of eight active members per LACP channel, what does `show etherchannel summary` show?",
    options: [
      "Eight members flagged P and two members flagged H",
      "All ten members flagged P",
      "Eight members flagged P and two members flagged s",
      "The channel-group command is rejected on the ninth and tenth ports",
    ],
    answer: [0],
    explanation: "LACP allows up to 16 ports in a group with up to 8 active (bundled, `P`); the rest wait as hot-standby (`H`) and take over if an active member fails. Port priority and system priority decide which ones are active. Ten bundled members would exceed the active limit. `s` indicates a configuration incompatibility, and these ports are identical. IOS accepts up to 16 ports in an LACP group, so the command is not rejected. (Maximums vary by platform, which is why the stem states the limit.)",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-020',
    topic: '2.1',
    type: 'order',
    difficulty: 2,
    stem: "Using the member-first method, put the commands in order to build a Layer 3 LACP port channel with IP address 10.10.10.1/30 on DSW1.",
    items: [
      "interface range GigabitEthernet1/0/47 - 48",
      "no switchport",
      "channel-group 10 mode active",
      "interface Port-channel10",
      "ip address 10.10.10.1 255.255.255.252",
    ],
    explanation: "The members must be routed ports (`no switchport`) before they join the channel group, so the port channel is created as Layer 3. Only then can the IP address go on Port-channel10 — the logical interface, not the members. Joining the group first would create a Layer 2 port channel that rejects the IP address.",
    lesson: '2.1-etherchannel',
  },

  // ---------------------------------------------------------------- 2.2
  {
    id: 'd2-021',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A Cisco IP phone is connected to Gi1/0/12 and a PC is connected to the phone's PC port. How are the frames from the two devices handled?",
    exhibit: `interface GigabitEthernet1/0/12
 switchport access vlan 10
 switchport mode access
 switchport voice vlan 110
 spanning-tree portfast`,
    options: [
      "The phone tags voice frames with VLAN 110 after learning it via CDP; the PC sends untagged frames that the switch places in VLAN 10",
      "The port becomes an 802.1Q trunk with native VLAN 10 and appears in `show interfaces trunk`",
      "The phone tags the PC's frames with VLAN 10 and sends its own voice frames untagged in VLAN 110",
      "Both devices send untagged frames, and the switch separates them by MAC address OUI",
    ],
    answer: [0],
    explanation: "With a voice VLAN, the switch advertises VLAN 110 to the phone (CDP for Cisco phones, LLDP-MED for others). The phone tags voice with 110, and the PC's untagged traffic lands in the access VLAN 10. The port stays an access port and does not appear in `show interfaces trunk`. The phone does not tag the PC's frames, and voice is the tagged VLAN, not the untagged one. The switch separates the traffic by the 802.1Q tag, not by MAC OUI.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-022',
    topic: '2.2',
    type: 'fill',
    difficulty: 1,
    stem: "Access port Gi1/0/8 is in data VLAN 20. Which interface command places a connected IP phone's voice traffic in VLAN 150?",
    answer: ['switchport voice vlan 150'],
    explanation: "`switchport voice vlan 150` adds a voice VLAN to the access port. The switch advertises VLAN 150 to the phone via CDP or LLDP-MED, the phone tags its voice traffic with VLAN 150, and the data VLAN (20) still carries untagged PC traffic.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-023',
    topic: '2.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each PoE standard to the maximum power it can deliver at the switch (PSE) port.",
    pairs: [
      ['IEEE 802.3af (PoE, Type 1)', '15.4 W'],
      ['IEEE 802.3at (PoE+, Type 2)', '30 W'],
      ['IEEE 802.3bt Type 3', '60 W'],
      ['IEEE 802.3bt Type 4', '90 W'],
    ],
    explanation: "802.3af delivers 15.4 W at the PSE (12.95 W guaranteed at the device), 802.3at 30 W (25.5 W at the device), 802.3bt Type 3 60 W (51 W) and Type 4 90 W (71.3 W). The difference between PSE and PD values is the allowance for cable loss. Cisco UPOE and UPOE+ cover the 60 W and 90 W ranges respectively.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-024',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A newly installed access point on Gi1/0/24 does not power on. What is the most likely cause?",
    exhibit: `SW1# show power inline

Module   Available     Used     Remaining
          (Watts)     (Watts)    (Watts)
------   ---------   --------   ---------
1           370.0      362.1         7.9
Interface Admin  Oper       Power   Device              Class Max
                            (Watts)
--------- ------ ---------- ------- ------------------- ----- ----
Gi1/0/1   auto   on         30.0    C9130AXI-B          4     30.0
Gi1/0/2   auto   on         6.3     IP Phone 8845       2     30.0
<output omitted>
Gi1/0/24  auto   power-deny 0.0     Ieee PD             4     30.0`,
    options: [
      "The switch's PoE budget has only 7.9 W remaining, which is not enough for a class 4 device",
      "The port is configured with `power inline never`",
      "The device is not PoE-capable, so the switch did not detect it",
      "The AP needs 802.3bt, but the port only supports 802.3af",
    ],
    answer: [0],
    explanation: "`power-deny` means the switch detected a valid PD (class 4, up to 30 W) but could not allocate power: only 7.9 W of the 370 W budget remains. Freeing budget, adding a power supply or moving the AP fixes it. A port with `power inline never` would show Admin `never` and Oper `off`. A non-PoE device would not be detected or classified, yet the switch reports an IEEE PD with a class. The port's Max of 30.0 W shows PoE+ capability, and class 4 is a PoE+ (802.3at) class, not an 802.3bt class.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-025',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "A lightweight AP operates in local mode and joins a WLC that maps three WLANs to VLANs 20, 30 and 40. The AP's management IP is in VLAN 50. How should the access switch port for the AP be configured?",
    options: [
      "As an access port in VLAN 50",
      "As a trunk allowing VLANs 20, 30, 40 and 50 with native VLAN 50",
      "As an access port in VLAN 20 with voice VLAN 50",
      "As a trunk allowing only VLANs 20, 30 and 40",
    ],
    answer: [0],
    explanation: "In local mode, the AP tunnels all client traffic to the WLC inside CAPWAP, sourced from its management IP. The switch only ever sees the AP's management traffic, so an access port in the management VLAN (50) is correct; the WLC maps WLANs to VLANs 20, 30 and 40 on its own uplink. A trunk with client VLANs is needed for FlexConnect local switching or autonomous APs, not local mode. A voice VLAN is for IP phones. A trunk without VLAN 50 would cut the AP off from its management network.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-026',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "A FlexConnect AP uses local switching: SSID CORP maps to VLAN 20, SSID GUEST to VLAN 30, and the AP sends its own management traffic untagged in VLAN 50. Which switch port configuration supports this?",
    options: [
      "switchport mode trunk / switchport trunk native vlan 50 / switchport trunk allowed vlan 20,30,50",
      "switchport mode access / switchport access vlan 50",
      "switchport mode trunk / switchport trunk native vlan 20 / switchport trunk allowed vlan 20,30",
      "switchport mode access / switchport access vlan 50 / switchport voice vlan 20",
    ],
    answer: [0],
    explanation: "With local switching, client frames leave the AP tagged in their SSID's VLAN (20 and 30), while untagged management traffic must land in VLAN 50, so the port is a trunk with native VLAN 50 allowing 20, 30 and 50. An access port only carries VLAN 50, so locally switched client traffic would be lost. Native VLAN 20 without VLAN 50 would put the AP's management traffic in the wrong VLAN. A voice VLAN is for phones and carries only one extra tagged VLAN, not both client VLANs.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-027',
    topic: '2.2',
    type: 'multi',
    difficulty: 3,
    stem: "An ESXi host uses a vSphere Standard Switch with two uplinks to SW1 (Gi1/0/20-21). Port groups tag VLANs 10, 20 and 30, and the uplink teaming policy is 'Route based on IP hash'. Which two switch-side configurations are required? (Choose two.)",
    options: [
      "Configure both ports as 802.1Q trunks allowing VLANs 10, 20 and 30",
      "Bundle both ports with `channel-group 2 mode on`",
      "Bundle both ports with `channel-group 2 mode active`",
      "Configure both ports with `switchport mode dynamic desirable` so the host can negotiate trunking",
      "Configure both ports as access ports in VLAN 10",
      "Configure both ports with `switchport voice vlan 20`",
    ],
    answer: [0, 1],
    explanation: "The vSwitch tags frames for three VLANs, so the switch ports must be trunks carrying them. IP-hash teaming on a vSphere Standard Switch requires a static EtherChannel (`mode on`) because the standard switch does not run LACP; LACP requires a vSphere Distributed Switch. Hypervisors do not speak DTP, so desirable mode cannot negotiate anything. An access port carries one VLAN only. A voice VLAN is for IP phones.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-028',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "A Linux server uses an 802.3ad (LACP) bond across two NICs connected to SW1 Gi1/0/45-46. The server needs only VLAN 100. Which switch configuration is correct?",
    options: [
      "Both ports: switchport mode access / switchport access vlan 100 / channel-group 3 mode active",
      "Both ports: switchport mode access / switchport access vlan 100 / channel-group 3 mode desirable",
      "Both ports: switchport mode access / switchport access vlan 100 / channel-group 3 mode on",
      "Both ports: switchport mode trunk / switchport trunk allowed vlan 100 / channel-group 3 mode auto",
    ],
    answer: [0],
    explanation: "An 802.3ad bond speaks LACP, so the switch side must be an LACP mode; `active` always works (passive would also work against a Linux bond, which sends LACPDUs by default). With only one VLAN, an access port channel is appropriate. `desirable` and `auto` are PAgP modes, which a Linux bond does not support. `on` sends no LACPDUs, so the bond never sees a partner and will not aggregate properly.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-029',
    topic: '2.2',
    type: 'single',
    difficulty: 1,
    stem: "A network printer connects to Gi1/0/5. Requirements: the port must never become a trunk, the printer must be in VLAN 40, and the port must forward immediately when the link comes up. Which configuration meets all requirements?",
    options: [
      "switchport mode access / switchport access vlan 40 / spanning-tree portfast",
      "switchport access vlan 40 / spanning-tree portfast",
      "switchport mode trunk / switchport trunk native vlan 40 / spanning-tree portfast trunk",
      "switchport mode access / switchport access vlan 40 / spanning-tree bpdufilter enable",
    ],
    answer: [0],
    explanation: "Static access mode prevents trunk negotiation, the access VLAN places the printer in VLAN 40, and PortFast makes the port forward at link-up. Without `switchport mode access` the port stays in the default dynamic auto mode and could trunk if a device sends DTP desirable. A trunk violates the first requirement. BPDU filter stops sending and processing BPDUs but does not make the port an edge port, so it doesn't provide immediate forwarding (and is risky).",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-030',
    topic: '2.2',
    type: 'fill',
    difficulty: 1,
    stem: "Port Gi1/0/30 on a PoE switch feeds a lobby kiosk. Security policy says the port must never supply PoE, even if a powered device is connected. Which interface command enforces this?",
    answer: ['power inline never'],
    explanation: "`power inline never` disables PoE detection and power on the port; `show power inline` then shows Admin `never` and Oper `off`. The default is `power inline auto`, which detects and powers any valid PD within the budget.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-031',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After last night's VLAN cleanup change, the IP phone on Gi1/0/12 works but the PC connected behind the phone cannot get a DHCP address. What is the cause?",
    exhibit: `SW1# show interfaces GigabitEthernet1/0/12 switchport
Name: Gi1/0/12
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: Off
Access Mode VLAN: 10 (Inactive)
Trunking Native Mode VLAN: 1 (default)
Administrative Native VLAN tagging: enabled
Voice VLAN: 110 (VOICE)
<output omitted>`,
    options: [
      "VLAN 10 no longer exists in the VLAN database, so the PC's untagged traffic has no active VLAN to use",
      "The voice VLAN and access VLAN must be the same number for the PC to work",
      "The port must be a trunk to carry both PC and phone traffic",
      "CDP is disabled, so the phone cannot pass the PC's traffic",
    ],
    answer: [0],
    explanation: "`Access Mode VLAN: 10 (Inactive)` means the port is assigned to VLAN 10 but VLAN 10 is not in the VLAN database — it was deleted during the cleanup. The phone still works because voice VLAN 110 exists. Recreating VLAN 10 fixes the PC. (When you first assign a non-existent access VLAN in VTP server/transparent mode, IOS creates it automatically; deleting it later leaves the port inactive.) The data and voice VLANs are meant to be different. A voice VLAN port is an access port and does not need to be a trunk. The phone has its voice VLAN, which proves CDP or LLDP-MED delivered it; the PC's frames are untagged regardless.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-032',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A Cisco IP phone on Gi1/0/20 receives an IP address from the data subnet (VLAN 10) instead of the voice subnet (VLAN 110). VLAN 110 exists on SW1. Evaluate the AI assistant's recommendation.",
    exhibit: `SW1# show running-config interface GigabitEthernet1/0/20
interface GigabitEthernet1/0/20
 switchport access vlan 10
 switchport mode access
 spanning-tree portfast
end

SW1# show cdp neighbors GigabitEthernet1/0/20
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
SEP00AABB112233  Gig 1/0/20        153            H P M   IP Phone  Port 1

AI assistant: "The phone cannot learn its voice VLAN because LLDP is not
running. Enter 'lldp run' globally and the phone will move to VLAN 110."`,
    options: [
      "The recommendation is wrong; CDP is already exchanging information with the phone, but the port has no `switchport voice vlan 110`, so there is no voice VLAN to advertise",
      "The recommendation is correct; Cisco phones learn the voice VLAN only through LLDP-MED",
      "The recommendation is wrong; the port must be converted to a trunk allowing VLANs 10 and 110",
      "The recommendation is wrong; PortFast prevents the phone from learning the voice VLAN and must be removed",
    ],
    answer: [0],
    explanation: "The phone appears in `show cdp neighbors`, so CDP — the protocol Cisco phones use to learn the voice VLAN — is working. The port simply has no voice VLAN configured, so the phone stays in the access VLAN and gets a data-subnet address. Adding `switchport voice vlan 110` fixes it. Cisco phones support CDP and LLDP-MED; LLDP is only required for phones that rely on LLDP-MED. A trunk is not the standard or necessary approach. PortFast is recommended on phone ports and does not block CDP.",
    lesson: '2.2-edge-ports',
  },

  // ---------------------------------------------------------------- 2.3
  {
    id: 'd2-033',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The network diagram shows SW1 Gi1/0/1 connected to SW2 Gi1/0/1. What does the CDP output prove?",
    exhibit: `SW1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone,
                  D - Remote, C - CVTA, M - Two-port Mac Relay

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
SW2.lab.local    Gig 1/0/1         152             R S I  C9300-48P Gig 1/0/24
R1               Gig 1/0/48        167              R B   ISR4331/K Gig 0/0/1

Total cdp entries displayed : 2`,
    options: [
      "SW1 Gi1/0/1 connects to SW2 Gi1/0/24; the diagram's SW2 port is wrong",
      "SW1 Gi1/0/24 connects to SW2 Gi1/0/1; the diagram's SW1 port is wrong",
      "The diagram is correct; Port ID shows the local port and Local Intrfce shows the remote port",
      "Nothing can be concluded until LLDP is enabled on both switches",
    ],
    answer: [0],
    explanation: "`Local Intrfce` is the port on the device where the command was run (SW1 Gi1/0/1); `Port ID` is the neighbor's sending port (SW2 Gi1/0/24). So the diagram has the wrong SW2 port. Reading it as SW1 Gi1/0/24 swaps the columns — the classic trap. CDP alone is sufficient; LLDP is not needed to read a Cisco neighbor.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-034',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is accurate?",
    exhibit: `SW1# show lldp neighbors
Capability codes:
    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device
    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other

Device ID           Local Intf     Hold-time  Capability      Port ID
AP-Lobby            Gi1/0/10       120        B,W,R           Gi0
SEP00AABB112233     Gi1/0/11       120        B,T             Port 1
linux-host01        Gi1/0/12       120        S               a4bb.6d11.2233

Total entries displayed: 3`,
    options: [
      "A wireless access point is connected to SW1 Gi1/0/10 through the AP's Gi0 interface",
      "The IP phone is connected to SW1 port 1",
      "linux-host01 is a switch connected to SW1 Gi1/0/12",
      "AP-Lobby's own interface toward SW1 is Gi1/0/10",
    ],
    answer: [0],
    explanation: "`Local Intf` is SW1's port and `Port ID` is the neighbor's, so AP-Lobby (capability W = WLAN access point) uses its Gi0 interface toward SW1 Gi1/0/10. The phone is on SW1 Gi1/0/11; `Port 1` is the phone's own switch port. linux-host01 advertises `S` (station), an end host, and its Port ID is a MAC address, which is common for Linux lldpd. Gi1/0/10 is SW1's port, not the AP's.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-035',
    topic: '2.3',
    type: 'match',
    difficulty: 1,
    stem: "Match each item to its default value or standard.",
    pairs: [
      ['CDP advertisement interval', '60 seconds'],
      ['CDP holdtime', '180 seconds'],
      ['LLDP advertisement interval', '30 seconds'],
      ['LLDP holdtime', '120 seconds'],
      ['LLDP standard', 'IEEE 802.1AB'],
    ],
    explanation: "CDP sends every 60 s and neighbors keep the entry for 180 s. LLDP sends every 30 s with a 120 s holdtime (4 × the interval). LLDP is defined in IEEE 802.1AB; CDP is Cisco proprietary.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-036',
    topic: '2.3',
    type: 'fill',
    difficulty: 1,
    stem: "LLDP is disabled by default on a Catalyst switch. Which global configuration command enables it?",
    answer: ['lldp run'],
    explanation: "`lldp run` enables LLDP globally; every interface then transmits and receives LLDP by default unless `no lldp transmit` or `no lldp receive` is configured on it. The CDP equivalent is `cdp run`, which is enabled by default.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-037',
    topic: '2.3',
    type: 'multi',
    difficulty: 1,
    stem: "Which two statements about CDP and LLDP on Cisco IOS-XE devices are true? (Choose two.)",
    options: [
      "CDP is enabled by default",
      "LLDP is disabled globally by default",
      "CDP is defined by IEEE 802.1AB",
      "LLDP requires an IP address on the interface to send advertisements",
      "CDP can discover neighbors several hops away through routers",
      "`no cdp enable` in global configuration disables CDP on the whole device",
    ],
    answer: [0, 1],
    explanation: "CDP runs by default; LLDP must be enabled with `lldp run`. IEEE 802.1AB defines LLDP, while CDP is Cisco proprietary. Both are Layer 2 protocols that need no IP address, and both see only directly connected neighbors. `no cdp enable` is an interface command; the global command is `no cdp run`.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-038',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The diagram shows DSW1 Te1/1/2 to ASW3 Te1/1/1 and DSW1 Te1/1/3 to ASW4 Te1/1/1. An AI assistant built a link table from DSW1's CDP output and recommended a diagram change. How should the engineer respond?",
    exhibit: `DSW1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone,
                  D - Remote, C - CVTA, M - Two-port Mac Relay

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
ASW3             Ten 1/1/2         141              S I   C9200L-48 Ten 1/1/1
ASW4             Ten 1/1/3         128              S I   C9200L-48 Ten 1/1/1

AI assistant:
  Link table
    DSW1 Te1/1/1  <->  ASW3 Te1/1/2
    DSW1 Te1/1/1  <->  ASW4 Te1/1/3
  "The diagram is wrong: both access switches connect to DSW1 Te1/1/1.
   Update the diagram."`,
    options: [
      "Reject it: the assistant swapped the local and remote columns; the output confirms DSW1 Te1/1/2 to ASW3 Te1/1/1 and DSW1 Te1/1/3 to ASW4 Te1/1/1, so the diagram is correct",
      "Accept it: both neighbors list Ten 1/1/1, so both are connected to DSW1 Te1/1/1 through an unmanaged switch",
      "Reject it: the diagram is wrong, but only because ASW3 and ASW4 are swapped",
      "Reject it: CDP cannot validate 10-Gigabit links; LLDP must be used instead",
    ],
    answer: [0],
    explanation: "`Ten 1/1/1` appears in the Port ID column, which is each neighbor's port. DSW1's own ports are in Local Intrfce (Te1/1/2 and Te1/1/3). Read correctly, the output matches the diagram exactly. The assistant reversed the columns, so its conclusion is wrong — an example of why AI output must be checked against the raw data. The unmanaged-switch explanation would require multiple neighbors on the same local port, which is not the case. ASW3 and ASW4 appear on the documented ports, so they are not swapped. CDP works on any Ethernet speed.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-039',
    topic: '2.3',
    type: 'single',
    difficulty: 1,
    stem: "An engineer finds an undocumented Cisco router connected to a switch and needs its IP address and IOS-XE version to log in and update the documentation. Which command run on the switch provides both?",
    options: [
      "show cdp neighbors detail",
      "show cdp neighbors",
      "show cdp interface",
      "show cdp traffic",
    ],
    answer: [0],
    explanation: "`show cdp neighbors detail` (or `show cdp entry <name>`) shows each neighbor's entry addresses, platform, full software version, both port IDs, native VLAN and duplex. The plain `show cdp neighbors` summary omits IP addresses and software versions. `show cdp interface` shows local CDP status and timers per interface. `show cdp traffic` shows packet counters.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-040',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. LLDP is enabled globally on SW1 and SW2. SW1 lists SW2 in `show lldp neighbors`, but SW2 does not list SW1. What explains this?",
    exhibit: `SW1# show running-config interface GigabitEthernet1/0/1
interface GigabitEthernet1/0/1
 switchport mode trunk
 no lldp transmit
end`,
    options: [
      "SW1 Gi1/0/1 still receives LLDP but no longer sends it, so only SW1 learns about its neighbor",
      "`lldp run` is missing on SW1, so SW1 cannot send LLDP frames",
      "LLDP is not supported on trunk ports",
      "CDP is also enabled on the link and suppresses LLDP in one direction",
    ],
    answer: [0],
    explanation: "LLDP transmit and receive are independent per interface. With `no lldp transmit`, SW1 keeps listening (so it learns SW2) but sends nothing (so SW2 never learns SW1). If `lldp run` were missing on SW1, SW1 would not list SW2 either, and the stem says LLDP is enabled globally. LLDP works on access, trunk and routed ports. CDP and LLDP operate independently.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-041',
    topic: '2.3',
    type: 'single',
    difficulty: 1,
    stem: "Router R1's GigabitEthernet0/0/0 faces the ISP. The security team wants CDP stopped on that interface only, while CDP keeps running toward internal switches. Which command meets the requirement?",
    options: [
      "`no cdp enable` under interface GigabitEthernet0/0/0",
      "`no cdp run` in global configuration mode",
      "`no cdp advertise-v2` in global configuration mode",
      "`cdp holdtime 10` under interface GigabitEthernet0/0/0",
    ],
    answer: [0],
    explanation: "`no cdp enable` disables CDP on one interface. `no cdp run` turns CDP off on the whole router, breaking the internal requirement. `no cdp advertise-v2` makes the device send CDPv1 instead of v2 but still advertises. `cdp holdtime` is a global command that changes how long neighbors keep entries; it does not stop advertisements.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-042',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The diagram shows SW1 Gi1/0/30 connected directly to R5 Gi0/0/0. What is the most likely explanation for the CDP output?",
    exhibit: `SW1# show cdp neighbors | begin Device
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R5               Gig 1/0/30        151              R B   ISR4321/K Gig 0/0/0
SEP0011AABBCCDD  Gig 1/0/30        139            H P M   IP Phone  Port 1`,
    options: [
      "An undocumented unmanaged switch or hub sits between SW1 Gi1/0/30 and both R5 and the phone, passing their CDP advertisements through",
      "SW1 Gi1/0/30 is a trunk, and CDP lists one neighbor entry per VLAN carried on a trunk",
      "R5 has two interfaces connected to SW1 Gi1/0/30",
      "The output is invalid; CDP never shows two neighbors on one interface",
    ],
    answer: [0],
    explanation: "Two different neighbors on the same local port means something between them is flooding CDP multicasts — typically an unmanaged switch or hub, which doesn't consume CDP the way a Cisco switch does. The diagram is missing that device. CDP does not create per-VLAN entries on trunks; one neighbor sends one advertisement per interface, and the entries here have different device IDs and platforms. One Ethernet port can't connect directly to two router interfaces. Multiple CDP neighbors per interface are possible on shared segments, so the output is not invalid.",
    lesson: '2.3-cdp-lldp',
  },

  // ---------------------------------------------------------------- 2.4
  {
    id: 'd2-043',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. On multilayer switch DSW1, SVIs Vlan10 (10.1.10.1/24) and Vlan20 (10.1.20.1/24) are up/up. Hosts in VLAN 10 can ping 10.1.10.1 but cannot reach hosts in VLAN 20. Which command fixes the problem?",
    exhibit: `DSW1# show ip route
Default gateway is not set

Host               Gateway           Last Use    Total Uses  Interface
ICMP redirect cache is empty`,
    options: [
      "ip routing",
      "ip default-gateway 10.1.10.254",
      "vlan 20",
      "no switchport on interface Vlan20",
    ],
    answer: [0],
    explanation: "Host-style `show ip route` output (default gateway and ICMP redirect cache instead of a routing table) means IP routing is disabled, so the switch will not route between its SVIs. `ip routing` enables it, and the connected routes then appear. `ip default-gateway` is used only when routing is disabled and doesn't route between VLANs. VLAN 20 already exists — its SVI is up/up. `no switchport` applies to physical ports, not SVIs.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-044',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An engineer needs to find the access port where host 0050.7966.6804 is connected. What should the engineer conclude?",
    exhibit: `SW1# show mac address-table address 0050.7966.6804
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  20    0050.7966.6804    DYNAMIC     Gi1/0/24
Total Mac Addresses for this criterion: 1

SW1# show cdp neighbors GigabitEthernet1/0/24
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
SW3              Gig 1/0/24        162             S I    C9200L-24 Gig 1/1/1`,
    options: [
      "The host is not directly connected to SW1; it is reached through SW3, so the search should continue on SW3",
      "The host is directly connected to SW1 Gi1/0/24 in VLAN 20",
      "The host is connected to SW3 Gi1/0/24",
      "The host is connected to SW3 Gi1/1/1",
    ],
    answer: [0],
    explanation: "SW1 learned the MAC on Gi1/0/24, but CDP shows that port connects to another switch (SW3), so the host is somewhere behind SW3. Repeat `show mac address-table address 0050.7966.6804` on SW3 to find the actual access port. Gi1/0/24 is an uplink, not the host port. Gi1/0/24 is SW1's port, not SW3's. SW3 Gi1/1/1 is SW3's uplink back to SW1, where SW3 would learn SW1-side MACs, not this host.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-045',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Pings from R1 to 10.1.10.50 fail. What does the output indicate?",
    exhibit: `R1# ping 10.1.10.50
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.10.50, timeout is 2 seconds:
.....
Success rate is 0 percent (0/5)

R1# show ip arp | include 10.1.10.
Internet  10.1.10.1               -   0c1a.2b3c.4d01  ARPA   GigabitEthernet0/0/1.10
Internet  10.1.10.25              3   0050.7966.6801  ARPA   GigabitEthernet0/0/1.10
Internet  10.1.10.50              0   Incomplete      ARPA`,
    options: [
      "R1 is sending ARP requests for 10.1.10.50 but receiving no reply, so the problem is at Layer 2 or on the host itself",
      "R1 has no route to 10.1.10.50",
      "An ACL on R1 is blocking ICMP to 10.1.10.50",
      "10.1.10.50 is R1's own interface address",
    ],
    answer: [0],
    explanation: "`Incomplete` means R1 knows the target is on a connected subnet and is ARPing for it, but no ARP reply arrives — the host may be off, in the wrong VLAN, misaddressed, or the Layer 2 path is broken. Another host in the same subnet (10.1.10.25) resolved fine, so the subinterface works. R1 clearly has a connected route, otherwise it wouldn't ARP. An outbound ACL would not prevent ARP resolution. R1's own address is 10.1.10.1, shown with age `-`.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-046',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "A ping from R1 shows the result `U.U.U`. What is the best interpretation?",
    options: [
      "A device in the path is returning ICMP destination unreachable messages; the dots appear because IOS rate-limits the unreachables it generates",
      "Half of the echo requests are lost because of a duplex mismatch",
      "The destination replied to every echo, but the replies arrived out of order",
      "The echo requests were too large and had to be fragmented",
    ],
    answer: [0],
    explanation: "`U` is an ICMP destination unreachable received. IOS rate-limits ICMP unreachables (by default one per 500 ms), so probes in between get no message and time out (`.`), producing the alternating pattern. The real signal is the unreachable. Random loss from a duplex mismatch doesn't produce a strict alternating U/. pattern, and lost packets would show `.` only. Out-of-order replies still show `!`. A fragmentation problem with DF set shows `M`, and without DF, packets are simply fragmented.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-047',
    topic: '2.4',
    type: 'match',
    difficulty: 1,
    stem: "Match each Cisco IOS ping result character to its meaning.",
    pairs: [
      ['!', 'Echo reply received'],
      ['.', 'Timed out waiting for a reply'],
      ['U', 'ICMP destination unreachable received'],
      ['M', 'Could not fragment: DF bit set and the packet exceeds a link MTU'],
    ],
    explanation: "`!` = success. `.` = no response within the timeout (2 seconds by default). `U` = a device returned destination unreachable. `M` = a router needed to fragment the packet but the DF bit was set, which is how an extended ping with `df-bit` exposes MTU problems.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-048',
    topic: '2.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. What can the engineer conclude?",
    exhibit: `R1# ping 10.9.9.9 source Loopback0 size 1500 df-bit repeat 5
Type escape sequence to abort.
Sending 5, 1500-byte ICMP Echos to 10.9.9.9, timeout is 2 seconds:
Packet sent with a source address of 1.1.1.1
Packet sent with the DF bit set
M.M.M
Success rate is 0 percent (0/5)

R1# ping 10.9.9.9 source Loopback0 size 1400 df-bit repeat 5
Type escape sequence to abort.
Sending 5, 1400-byte ICMP Echos to 10.9.9.9, timeout is 2 seconds:
Packet sent with a source address of 1.1.1.1
Packet sent with the DF bit set
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 2/3/4 ms`,
    options: [
      "Some link on the path to 10.9.9.9 has an IP MTU smaller than 1500 bytes but at least 1400 bytes",
      "The remote network has no route back to 1.1.1.1",
      "An ACL in the path blocks ICMP packets larger than 1400 bytes",
      "10.9.9.9 is unreachable; the 1400-byte replies came from a different host",
    ],
    answer: [0],
    explanation: "`M` means a device could not forward the packet without fragmenting it while DF was set. Since 1400-byte packets succeed end to end and 1500-byte packets get `M`, an interface on the path has an MTU between 1400 and 1499 bytes (a tunnel or provider link, for example). The alternating dots come from ICMP unreachable rate-limiting. The 1400-byte pings sourced from 1.1.1.1 succeed, proving the return route exists. An ACL drop would show timeouts or `U`, not `M` (fragmentation-needed). Echo replies come from the pinged address.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-049',
    topic: '2.4',
    type: 'fill',
    difficulty: 1,
    stem: "By default, how many probes does Cisco IOS traceroute send for each TTL value (hop)? Enter a number.",
    answer: ['3', 'three'],
    explanation: "IOS traceroute sends three UDP probes per hop by default, which is why each hop line shows three round-trip times (or three `*` when nothing answers). The probe count can be changed in extended traceroute.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-050',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users report that 10.50.1.10 is reachable. What is the best interpretation of hop 3?",
    exhibit: `R1# traceroute 10.50.1.10
Type escape sequence to abort.
Tracing the route to 10.50.1.10
VRF info: (vrf in name/id, vrf out name/id)
  1 10.0.12.2 1 msec 1 msec 1 msec
  2 10.0.23.3 2 msec 1 msec 2 msec
  3 * * *
  4 10.50.1.10 3 msec 3 msec 4 msec`,
    options: [
      "The hop-3 device forwards traffic but does not send ICMP time-exceeded messages (filtered, disabled or rate-limited)",
      "The hop-3 device is down and traffic is being rerouted",
      "Hop 3 is dropping 100% of all traffic, so 10.50.1.10 is actually unreachable",
      "Hop 3 is a Layer 2 switch, which always appears as * * * in traceroute",
    ],
    answer: [0],
    explanation: "Hop 4 (the destination) answers, so the probes with TTL 4 passed through hop 3 successfully. Hop 3 simply didn't return time-exceeded messages, typically because of an ACL, a policy of not generating ICMP, or rate limiting. A down device or a total drop would prevent hop 4 from ever answering. Layer 2 switches don't decrement TTL, so they never appear as a hop at all — they don't consume a hop number.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-051',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What does the output indicate?",
    exhibit: `R1# traceroute 10.50.1.10
Type escape sequence to abort.
Tracing the route to 10.50.1.10
VRF info: (vrf in name/id, vrf out name/id)
  1 10.0.12.2 1 msec 1 msec 1 msec
  2 10.0.23.3 !H  *  !H`,
    options: [
      "The router at 10.0.23.3 received the probes but returned ICMP host unreachable, so troubleshooting should continue at that router's route and ARP entries for 10.50.1.10",
      "10.0.23.3 is the destination host and the trace completed successfully",
      "The router at 10.0.12.2 has no route to 10.50.1.10",
      "All probes to the second hop timed out",
    ],
    answer: [0],
    explanation: "`!H` means the hop sent back an ICMP host unreachable instead of forwarding the probe. The router at 10.0.23.3 could not deliver the packet (for example, no usable route or no ARP reply for the destination), so that's where to look next. (The `*` between the two `!H` results is IOS rate-limiting its ICMP unreachables, the same reason ping shows `U.U.U`.) The destination is 10.50.1.10, not 10.0.23.3, and a successful trace ends with the destination's address and times. Hop 1 (10.0.12.2) forwarded the probes to hop 2, so it had a route. If every probe had timed out, the hop would show `* * *` with no `!H` at all.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-052',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user at 10.1.10.25 cannot open https://10.2.20.80. What does the capture indicate?",
    exhibit: `No. Time      Source        Destination   Proto Info
1   0.000000  10.1.10.25    10.2.20.80    TCP   51544 → 443 [SYN] Seq=0 Win=64240 Len=0 MSS=1460
2   0.000812  10.2.20.80    10.1.10.25    TCP   443 → 51544 [RST, ACK] Seq=1 Ack=1 Win=0 Len=0`,
    options: [
      "IP routing works in both directions, but nothing is accepting connections on TCP port 443 at 10.2.20.80 (or a device in the path is resetting the connection on its behalf)",
      "There is no route from 10.1.10.25 to 10.2.20.80",
      "ARP for the default gateway failed on the client",
      "A firewall is silently dropping the SYN",
    ],
    answer: [0],
    explanation: "An immediate RST/ACK in reply to the SYN proves packets reach the target and return, so Layer 3 is fine; the port is closed (service down or listening on another port), or a firewall is configured to reject with a reset. No route or a failed ARP would produce no TCP reply at all. A silent drop shows SYN retransmissions with no response, not a reset.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-053',
    topic: '2.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Host 10.1.10.25 (default gateway 10.1.10.1) tries to SSH to 10.3.30.5. What is the most likely cause of the failure?",
    exhibit: `No. Time      Source        Destination   Proto Info
1   0.000000  10.1.10.25    10.3.30.5     TCP   50122 → 22 [SYN] Seq=0 Win=64240 Len=0 MSS=1460
2   0.001090  10.1.10.1     10.1.10.25    ICMP  Destination unreachable (Communication administratively filtered)`,
    options: [
      "An ACL on the default gateway is denying the SSH traffic",
      "The SSH server 10.3.30.5 is not listening on TCP 22",
      "The client could not resolve the default gateway's MAC address",
      "The server is down, so the gateway reports it as unreachable",
    ],
    answer: [0],
    explanation: "The ICMP message comes from 10.1.10.1 (the gateway) and says 'communication administratively filtered' (type 3, code 13), which IOS sends when an ACL denies a packet. A closed port on the server would return a TCP RST from 10.3.30.5. The SYN was sent to the gateway and the gateway answered, so ARP to the gateway worked. A down server would cause timeouts or a host unreachable, not an administrative filter message.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-054',
    topic: '2.4',
    type: 'multi',
    difficulty: 1,
    stem: "Which two commands display whether access port Gi1/0/5 is assigned to VLAN 30? (Choose two.)",
    options: [
      "show vlan brief",
      "show interfaces GigabitEthernet1/0/5 switchport",
      "show interfaces trunk",
      "show ip interface brief",
      "show cdp neighbors",
      "show spanning-tree summary",
    ],
    answer: [0, 1],
    explanation: "`show vlan brief` lists access ports under each VLAN, and `show interfaces ... switchport` shows the port's `Access Mode VLAN`. `show interfaces trunk` lists only trunk ports. `show ip interface brief` shows interface status and IP addresses, not VLAN membership. `show cdp neighbors` shows neighbors, and `show spanning-tree summary` shows global STP counts and settings.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-055',
    topic: '2.4',
    type: 'order',
    difficulty: 2,
    stem: "PC1 (VLAN 10) pings PC2 (VLAN 20) for the first time. Both use the same router as their default gateway, and all ARP caches are empty. Put the events in order up to the moment the echo request reaches PC2.",
    items: [
      "PC1 compares PC2's address with its own subnet and decides to send to its default gateway",
      "PC1 broadcasts an ARP request for the default gateway's IP address",
      "The gateway replies with its MAC address",
      "PC1 sends the ICMP echo request to the gateway's MAC with PC2's IP as the destination",
      "The gateway broadcasts an ARP request for PC2's IP address in VLAN 20",
      "PC2 replies with its MAC and the gateway forwards the echo request to PC2",
    ],
    explanation: "A host first decides local vs remote using its mask. For a remote destination it needs the gateway's MAC (ARP), then sends the packet with the gateway's MAC and the final destination IP. The router then ARPs for PC2 on the egress VLAN before it can rewrite the frame and forward it. On IOS, the packet that triggered the router's ARP is usually dropped, which is why a first ping often shows `.!!!!`.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-056',
    topic: '2.4',
    type: 'multi',
    difficulty: 1,
    stem: "Refer to the exhibit. Which two interfaces were shut down by configuration? (Choose two.)",
    exhibit: `SW1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
Vlan1                  unassigned      YES unset  administratively down down
Vlan10                 10.1.10.2       YES manual up                    up
GigabitEthernet1/0/1   unassigned      YES unset  up                    up
GigabitEthernet1/0/2   unassigned      YES unset  down                  down
GigabitEthernet1/0/3   unassigned      YES unset  administratively down down`,
    options: [
      "Vlan1",
      "Vlan10",
      "GigabitEthernet1/0/1",
      "GigabitEthernet1/0/2",
      "GigabitEthernet1/0/3",
    ],
    answer: [0, 4],
    explanation: "`administratively down` means the `shutdown` command is applied, which is true for Vlan1 and Gi1/0/3. Gi1/0/2 is down/down without the administrative keyword: no link (cable, far end) or err-disabled, which `show interfaces` would reveal. Vlan10 and Gi1/0/1 are up/up.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-057',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 had never communicated with 10.1.20.50 before this ping. Evaluate the AI assistant's conclusion.",
    exhibit: `R1# ping 10.1.20.50
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.20.50, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/1/2 ms

AI assistant: "The 80% success rate shows 20% packet loss on the path to
10.1.20.50, which is typical of a duplex mismatch. Recommendation: hard-code
speed 1000 and duplex full on GigabitEthernet0/0/1 and on the connected
switch port."`,
    options: [
      "The conclusion is wrong; the first echo was lost while R1 resolved ARP for the destination, which is normal, and repeating the ping should show !!!!!",
      "The conclusion is correct; any loss in a five-packet ping indicates a duplex mismatch",
      "The conclusion is wrong; the first dot means an ACL blocked the first echo request",
      "The conclusion is wrong; the first dot means the destination was briefly unreachable because of an STP topology change",
    ],
    answer: [0],
    explanation: "A single leading dot on the first ping to a new destination is the classic ARP-resolution delay: IOS drops the packet that triggers ARP, then the remaining echoes succeed. Rerunning the ping should give 100%. A duplex mismatch causes errors and late collisions under load, not a single loss on the first packet, so hard-coding speed/duplex based on this is a bad change. An ACL would block every echo, not just the first. Nothing in the output suggests an STP event, and the pattern is fully explained by ARP.",
    lesson: '2.4-troubleshooting-tools',
  },

  // ---------------------------------------------------------------- 2.5
  {
    id: 'd2-058',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is correct?",
    exhibit: `SW3# show spanning-tree vlan 10

VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586
             Address     a0b4.3c11.0a00
             Cost        4
             Port        1 (GigabitEthernet1/0/1)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     a0b4.3c33.0c00
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p
Gi1/0/2             Altn BLK 4         128.2    P2p
Gi1/0/10            Desg FWD 4         128.10   P2p Edge`,
    options: [
      "The root bridge has a configured priority of 24576, and SW3 reaches it through Gi1/0/1 with a root path cost of 4",
      "SW3 is the root bridge for VLAN 10",
      "The root bridge is configured with priority 24586",
      "Gi1/0/2 is forwarding as a backup root port",
    ],
    answer: [0],
    explanation: "The displayed root priority 24586 is the configured priority plus the extended system ID (VLAN 10): 24576 + 10. The root ID address differs from SW3's bridge address and SW3 has a root port, so SW3 is not root. 24586 can't be configured because priorities must be multiples of 4096. Gi1/0/2 is an alternate port in the discarding state (displayed as `BLK`), not forwarding.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-059',
    topic: '2.5',
    type: 'fill',
    difficulty: 1,
    stem: "A switch uses the default spanning-tree priority. What bridge priority value does `show spanning-tree vlan 30` display for this switch's Bridge ID? Enter a number.",
    answer: ['32798'],
    explanation: "Default priority 32768 plus the extended system ID, which equals the VLAN number: 32768 + 30 = 32798. The output also shows the breakdown, `(priority 32768 sys-id-ext 30)`.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-060',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. All three switches run Rapid PVST+ and share VLANs 10 and 20. Which switch is the root bridge for VLAN 20?",
    exhibit: `Switch  Spanning-tree configuration               Base MAC address
SW1     spanning-tree vlan 20 priority 28672       70f3.5a01.0300
SW2     (default priority)                         70f3.5a01.0100
SW3     spanning-tree vlan 10 priority 4096        70f3.5a01.0200`,
    options: [
      "SW1",
      "SW2",
      "SW3",
      "SW2 and SW3 tie, so the election repeats until one switch is reconfigured",
    ],
    answer: [0],
    explanation: "For VLAN 20, SW1 has priority 28672 (28692 with the VLAN), while SW2 and SW3 both use the default 32768 (32788) in VLAN 20 — SW3's 4096 applies to VLAN 10 only. Lowest priority wins before MAC is considered, so SW1 is root. SW2 would win only if all priorities tied (it has the lowest MAC). SW3 is root for VLAN 10, not VLAN 20. Ties on priority are always broken by MAC address, so the election never stalls.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-061',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. SW1 is the root bridge for VLAN 10. Port costs shown are the configured spanning-tree costs. Which port does SW4 select as its root port for VLAN 10?",
    exhibit: `Link                                  Port cost (each end)
SW4 Gi1/0/1  <->  SW1 Gi1/0/11        19
SW4 Gi1/0/2  <->  SW2 Gi1/0/12        4
SW2 Gi1/0/1  <->  SW1 Gi1/0/1         4`,
    options: [
      "Gi1/0/2, with a root path cost of 8",
      "Gi1/0/1, because it is directly connected to the root bridge",
      "Gi1/0/1, because it has the lower port number",
      "Gi1/0/2, with a root path cost of 4",
    ],
    answer: [0],
    explanation: "Root path cost is the sum of the costs of the ports a BPDU enters on the way from the root. Via Gi1/0/1: 19. Via Gi1/0/2: SW2's root port cost 4 (SW2 advertises 4) + SW4's Gi1/0/2 cost 4 = 8. The lowest total wins, so Gi1/0/2 is the root port. Being directly connected to the root doesn't matter if the cost is higher. Port number is only a late tie-breaker and doesn't apply when costs differ. The cost via Gi1/0/2 is 8, not 4, because SW2's own cost to the root is included.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-062',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "SW2 connects to root bridge SW1 with two parallel 1-Gbps links: SW2 Gi1/0/23 to SW1 Gi1/0/5, and SW2 Gi1/0/24 to SW1 Gi1/0/4. All port costs and port priorities are default. Which SW2 port becomes the root port?",
    options: [
      "Gi1/0/24, because it receives BPDUs from SW1's lower port ID (128.4)",
      "Gi1/0/23, because SW2's own lower port number wins",
      "Gi1/0/23, because it receives BPDUs from SW1's higher port ID (128.5)",
      "Both ports become root ports and load-share",
    ],
    answer: [0],
    explanation: "Root path cost ties (4 on both links) and the sender bridge ID ties (both BPDUs come from SW1), so the next tie-breaker is the lowest sender port ID: SW1's port priority, then port number. SW1 Gi1/0/4 (128.4) beats Gi1/0/5 (128.5), so SW2's Gi1/0/24 — connected to Gi1/0/4 — becomes the root port. SW2's own port number is used only if the sender port IDs also tie. Lower port IDs win, not higher. A switch has exactly one root port per VLAN; the other link's port becomes an alternate port.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-063',
    topic: '2.5',
    type: 'match',
    difficulty: 2,
    stem: "Match each Rapid PVST+ port role to its description.",
    pairs: [
      ['Root port', 'The non-root switch port with the best path to the root bridge'],
      ['Designated port', 'The forwarding port that offers the best path to the root for a segment'],
      ['Alternate port', 'Discarding port that receives a better BPDU from another switch; a ready replacement root port'],
      ['Backup port', 'Discarding port that receives a better BPDU from its own switch on a shared segment'],
      ['Disabled port', 'Port that is shut down or has no link and takes no part in spanning tree'],
    ],
    explanation: "Each non-root switch has one root port per VLAN. Each segment has one designated port (all root bridge ports are designated). Alternate ports back up the root port via a different switch, which is why RSTP can fail over without timers. Backup ports only exist when two ports of the same switch share a segment (a hub). Disabled ports are not operational.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-064',
    topic: '2.5',
    type: 'multi',
    difficulty: 1,
    stem: "Which three are port states used by Rapid PVST+ (802.1w)? (Choose three.)",
    options: [
      "Discarding",
      "Learning",
      "Forwarding",
      "Listening",
      "Blocking",
      "Err-disabled",
    ],
    answer: [0, 1, 2],
    explanation: "RSTP uses three states: discarding, learning and forwarding. Listening and blocking are 802.1D states that RSTP folds into discarding (Cisco's `show spanning-tree` still prints a discarding port as `BLK`). Err-disabled is an interface state set by features such as BPDU guard, not a spanning-tree port state.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-065',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. An engineer enters `spanning-tree vlan 10 root primary` on DSW1. Which bridge priority does `show spanning-tree vlan 10` then display for DSW1's Bridge ID?",
    exhibit: `DSW1# show spanning-tree vlan 10 | begin Root ID
  Root ID    Priority    16394
             Address     0c75.bd22.1180
             Cost        4
             Port        1 (GigabitEthernet1/0/1)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0c75.bd22.3300`,
    options: [
      "12298",
      "24586",
      "28682",
      "16394",
    ],
    answer: [0],
    explanation: "The current root's priority is 16384 (16394 − 10), which is already below 24576. The root primary macro therefore sets DSW1's priority to 4096 less than the root's: 16384 − 4096 = 12288, displayed as 12298 with VLAN 10. 24586 is what you'd get if the existing root were above 24576. 28682 corresponds to root secondary (28672). 16394 would only tie the current root's priority, leaving the MAC to decide — the macro avoids that.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-066',
    topic: '2.5',
    type: 'fill',
    difficulty: 1,
    stem: "In a network where every switch uses the default priority, what priority value does `spanning-tree vlan 20 root secondary` configure? Enter the configured priority (not including the VLAN number).",
    answer: ['28672'],
    explanation: "`root secondary` sets 28672 — lower than the default 32768 so the switch takes over if the primary root fails, but higher than the 24576 set by `root primary`. It is displayed as 28692 for VLAN 20.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-067',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Port Gi1/0/9 has `spanning-tree portfast` but no BPDU guard or BPDU filter. A user connects a small managed switch that sends BPDUs. What happens on Gi1/0/9?",
    options: [
      "The port loses its edge (PortFast) status and continues as a normal spanning-tree port",
      "The port is placed in the err-disabled state",
      "The port ignores the BPDUs and keeps forwarding as an edge port",
      "The port is placed in the root-inconsistent state",
    ],
    answer: [0],
    explanation: "An edge port that receives a BPDU immediately reverts to normal Rapid PVST+ operation and takes a role (designated, root or alternate) like any other port, which prevents a lasting loop. Err-disabling is BPDU guard's action, and it isn't configured. Ignoring BPDUs is BPDU filter behavior. Root-inconsistent is root guard's action and only happens for superior BPDUs.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-068',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The unauthorized switch has been removed from Gi1/0/18. Which action restores the port without changing its protection?",
    exhibit: `%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port GigabitEthernet1/0/18 with BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Gi1/0/18, putting Gi1/0/18 in err-disable state

SW1# show interfaces GigabitEthernet1/0/18 | include line protocol
GigabitEthernet1/0/18 is down, line protocol is down (err-disabled)`,
    options: [
      "Enter `shutdown` and then `no shutdown` on GigabitEthernet1/0/18",
      "Enter `no spanning-tree bpduguard enable` on GigabitEthernet1/0/18",
      "Enter `clear spanning-tree detected-protocols`",
      "Wait for the port to recover automatically when BPDUs stop arriving",
    ],
    answer: [0],
    explanation: "BPDU guard err-disables the port; it stays down until an administrator bounces it with `shutdown`/`no shutdown` (or until errdisable recovery, if `errdisable recovery cause bpduguard` is configured — it is not by default). Removing BPDU guard would change the protection. `clear spanning-tree detected-protocols` restarts protocol migration and doesn't clear err-disable. Automatic recovery when BPDUs stop is how root guard and loop guard behave, not BPDU guard.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-069',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. DSW1 is the intended root bridge for all VLANs. An AI assistant proposes a change to stop a newly connected switch with priority 0 from taking over as root. How should the engineer evaluate it?",
    exhibit: `Topology: DSW1 (root primary) and DSW2 (root secondary) connect down to
access switches ASW1-ASW8. Each access switch has two uplinks, one to DSW1
and one to DSW2.

AI assistant: "Apply 'spanning-tree guard root' to the uplink ports on every
access switch (the ports facing DSW1 and DSW2). Any superior BPDU will then
be blocked before it reaches the access layer."`,
    options: [
      "Reject it: root guard belongs on the distribution switches' downlink ports facing the access switches; on access-switch uplinks it would block the real root's BPDUs and isolate the access switches",
      "Accept it: root guard on access uplinks is the recommended placement",
      "Reject it: BPDU guard on the access-switch uplinks is the correct feature for this requirement",
      "Reject it: loop guard on the distribution downlinks is the correct feature for this requirement",
    ],
    answer: [0],
    explanation: "Root guard puts a port into root-inconsistent whenever a superior BPDU arrives. An access switch's uplink is its path to the real root, and DSW1's BPDUs are superior by definition, so those uplinks would block and cut the access switches off. Root guard goes on ports where the root must never appear: the distribution downlinks. BPDU guard on uplinks would err-disable them as soon as DSW1's BPDUs arrived. Loop guard reacts to missing BPDUs, not superior ones, so it doesn't stop a rogue root.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-070',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Gi1/0/2 on SW2 was an alternate port for VLAN 10 on a fiber link. What happened?",
    exhibit: `SW2# show logging | include LOOPGUARD
%SPANTREE-2-LOOPGUARD_BLOCK: Loop guard blocking port GigabitEthernet1/0/2 on VLAN0010.`,
    options: [
      "Gi1/0/2 stopped receiving BPDUs (for example, a unidirectional fiber fault), and loop guard kept it discarding instead of letting it become designated and forwarding",
      "Gi1/0/2 received a superior BPDU from a switch trying to become root",
      "Gi1/0/2 received a BPDU while configured as a PortFast edge port",
      "A native VLAN mismatch was detected on Gi1/0/2",
    ],
    answer: [0],
    explanation: "Loop guard watches non-designated ports (root and alternate). If their BPDUs stop, normal STP would age out the information and make the port designated and forwarding, creating a loop if the link is actually one-way. Loop guard puts the port in loop-inconsistent instead, and it recovers automatically when BPDUs return. A superior BPDU triggers root guard (ROOTGUARD_BLOCK). A BPDU on a protected edge port triggers BPDU guard (err-disable). A native VLAN mismatch produces CDP and PVID-inconsistent messages.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-071',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The switch on the far side of Gi1/0/24 had its priority set to 0 by mistake. After that switch's priority is corrected to 32768, what must be done to restore Gi1/0/24?",
    exhibit: `DSW1# show logging | include ROOTGUARD
%SPANTREE-2-ROOTGUARD_BLOCK: Root guard blocking port GigabitEthernet1/0/24 on VLAN0010.

DSW1# show spanning-tree inconsistentports

Name                 Interface                Inconsistency
-------------------- ------------------------ ------------------
VLAN0010             GigabitEthernet1/0/24    Root Inconsistent

Number of inconsistent ports (segments) in the system : 1`,
    options: [
      "Nothing; the port leaves the root-inconsistent state automatically once superior BPDUs stop arriving",
      "Enter `shutdown` and `no shutdown` on Gi1/0/24",
      "Configure `errdisable recovery cause root-guard`",
      "Reload DSW1 to clear the inconsistency",
    ],
    answer: [0],
    explanation: "Root guard blocks the port for the affected VLAN (root-inconsistent) only while superior BPDUs keep arriving. Once the neighbor stops advertising a better root, the port recovers on its own (`%SPANTREE-2-ROOTGUARD_UNBLOCK`) and goes through normal role selection. The port is not err-disabled, so bouncing it or configuring errdisable recovery isn't required. A reload is never needed.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-072',
    topic: '2.5',
    type: 'match',
    difficulty: 2,
    stem: "Match each spanning-tree feature to its behavior.",
    pairs: [
      ['PortFast', 'Port moves straight to forwarding when the link comes up'],
      ['BPDU guard', 'Port is err-disabled when any BPDU is received'],
      ['Root guard', 'Port becomes root-inconsistent when a superior BPDU is received'],
      ['Loop guard', 'Port becomes loop-inconsistent when expected BPDUs stop arriving'],
      ['BPDU filter (interface level)', 'Port stops sending BPDUs and ignores received BPDUs'],
    ],
    explanation: "PortFast makes an edge port. BPDU guard shuts a port that should never hear a BPDU. Root guard protects root placement against superior BPDUs. Loop guard protects root/alternate ports against unidirectional failures. Interface-level BPDU filter effectively disables STP on the port, which is why it is used sparingly.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-073',
    topic: '2.5',
    type: 'multi',
    difficulty: 2,
    stem: "Which two placements follow Cisco best practice? (Choose two.)",
    options: [
      "BPDU guard on access ports connected to end hosts",
      "Root guard on distribution switch ports that connect down to access switches",
      "PortFast on trunk links between two access switches",
      "Root guard on an access switch's uplink toward the root bridge",
      "BPDU guard on the trunk between the two distribution switches",
      "Loop guard on every designated port of the root bridge",
    ],
    answer: [0, 1],
    explanation: "Host ports should never receive BPDUs, so BPDU guard (with PortFast) belongs there. Root guard belongs where the root must never appear: distribution downlinks. PortFast on inter-switch links risks temporary loops. Root guard on an uplink toward the root blocks the legitimate root's BPDUs. BPDU guard on an inter-switch trunk err-disables it immediately. Loop guard protects root and alternate ports; the root bridge's ports are all designated, so it has nothing to protect there.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-074',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. If the link on Gi1/0/1 fails, what does Rapid PVST+ do with Gi1/0/2 for VLAN 10?",
    exhibit: `SW3# show spanning-tree vlan 10 | begin Interface
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p
Gi1/0/2             Altn BLK 4         128.2    P2p
Gi1/0/10            Desg FWD 4         128.10   P2p Edge`,
    options: [
      "It becomes the new root port and moves to forwarding immediately, without waiting for forward-delay timers",
      "It moves through listening and learning for 15 seconds each before forwarding",
      "It waits for the 20-second max age timer to expire before changing role",
      "It becomes a designated port, and SW3 elects itself root",
    ],
    answer: [0],
    explanation: "An alternate port is a pre-computed replacement for the root port. When the root port loses link, RSTP promotes the alternate to root port and puts it straight into forwarding. The 15-second listening/learning sequence and the 20-second max age wait are 802.1D behaviors. Gi1/0/2 still receives the root's BPDUs, so SW3 still has a path to the root and doesn't claim root itself.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-075',
    topic: '2.5',
    type: 'order',
    difficulty: 2,
    stem: "Put the criteria a non-root switch uses to choose its root port in order, from first considered to last.",
    items: [
      "Lowest root path cost",
      "Lowest sender (neighbor) bridge ID",
      "Lowest sender port priority",
      "Lowest sender port number",
    ],
    explanation: "Cost to the root is compared first. If equal, the BPDU from the neighbor with the lowest bridge ID wins. If the same neighbor is reached over several links, the neighbor's port ID decides: port priority first (default 128), then port number. These sender values come from the received BPDU, which is why the upstream switch's port numbering decides a parallel-link tie.",
    lesson: '2.5-rapid-pvst',
  },
  // ---------------------------------------------------------------- 2.1 (expansion)
  {
    id: 'd2-076',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Yesterday VLAN 40 was added to the allowed list on both ends of the ASW2–DSW1 uplink, but VLAN 40 traffic still does not cross it. What does ASW2's output indicate?",
    exhibit: `ASW2# show interfaces trunk

Port        Mode             Encapsulation  Status        Native vlan
Te1/1/1     on               802.1q         trunking      99

Port        Vlans allowed on trunk
Te1/1/1     10,20,40,99

Port        Vlans allowed and active in management domain
Te1/1/1     10,20,99

Port        Vlans in spanning tree forwarding state and not pruned
Te1/1/1     10,20,99`,
    options: [
      "Spanning tree is blocking VLAN 40 on Te1/1/1, which is why it is missing from both of the lower VLAN lists",
      "VLAN 40 is allowed but not active on ASW2, most likely because it was never created there",
      "VLAN 40 must also be made the native VLAN before it can be carried untagged across the uplink",
      "DSW1 has not added VLAN 40 to its own allowed list, which removes it from ASW2's active list",
    ],
    answer: [1],
    explanation: "The second section lists allowed VLANs that also exist and are active in the local VLAN database. VLAN 40 is in the allowed list but drops out at that step, so ASW2 does not have an active VLAN 40 (usually it was never created, or it is shut down or suspended). Creating it with `vlan 40` fixes it. Spanning tree acts on the third section, and a VLAN that never became active is never handed to STP, so blocking does not explain its absence from the second line. The native VLAN is unrelated; tagged VLANs cross trunks normally. Each switch builds these lists from its own configuration, so the peer's allowed list cannot remove a VLAN from ASW2's active list.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-077',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The camera in VLAN 30 will connect later to access switch ASW2 through DSW1's uplink Te1/1/1. Interface Vlan30 on DSW1 must come up now. Which change brings Vlan30 up/up without plugging anything into Gi1/0/30?",
    exhibit: `DSW1# show ip interface brief | include Vlan30
Vlan30                 10.1.30.1       YES manual up                    down

DSW1# show vlan brief | include ^30
30   CAMERAS                          active    Gi1/0/30

DSW1# show interfaces status | include Gi1/0/30|Te1/1/1
Gi1/0/30                        notconnect   30           auto   auto 10/100/1000BaseTX
Te1/1/1      Uplink-ASW2        connected    trunk        full    10G SFP-10GBase-SR

DSW1# show interfaces trunk | begin allowed on trunk
Port        Vlans allowed on trunk
Te1/1/1     10,20`,
    options: [
      "Enable `ip routing` globally so the SVI has a reason to come up",
      "Enter `no shutdown` under interface Vlan30 so the SVI is no longer administratively down",
      "Add VLAN 30 to the trunk with `switchport trunk allowed vlan add 30` on Te1/1/1",
      "Enable `spanning-tree portfast` on Gi1/0/30 so it forwards without delay",
    ],
    answer: [2],
    explanation: "By default (autostate) an SVI is up/up only when its VLAN exists and is active, the SVI is not shut, and at least one port in that VLAN is up and STP-forwarding for it. VLAN 30 exists, but its only access port is notconnect and the up trunk does not carry VLAN 30. Adding VLAN 30 to Te1/1/1's allowed list gives the VLAN a forwarding port, so Vlan30 comes up. `ip routing` controls routing between interfaces, not SVI state. The Status column already says `up`, so the SVI is not shut down. PortFast only speeds up a port that has link; Gi1/0/30 has none.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-078',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 routes for VLANs 10 and 20 using subinterfaces on Gi0/0/1, which connects to SW1 Gi1/0/48. Hosts in both VLANs on SW1 cannot ping their gateways. What is the cause?",
    exhibit: `SW1# show interfaces GigabitEthernet1/0/48 switchport
Name: Gi1/0/48
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: Off
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)
<output omitted>

R1# show ip interface brief | include 0/0/1
GigabitEthernet0/0/1   unassigned      YES unset  up                    up
GigabitEthernet0/0/1.10 192.168.10.1   YES manual up                    up
GigabitEthernet0/0/1.20 192.168.20.1   YES manual up                    up`,
    options: [
      "R1's subinterfaces are administratively down, and each one needs its own `no shutdown` before it can pass traffic",
      "SW1 Gi1/0/48 is an access port in VLAN 1, so R1's tagged VLAN 10 and 20 frames are not carried; it must be a trunk",
      "R1 needs `switchport trunk native vlan 1` on Gi0/0/1 to match SW1",
      "SW1 Gi1/0/48 needs `switchport nonegotiate`, because R1 does not run DTP and the port is waiting for a DTP reply",
    ],
    answer: [1],
    explanation: "Router-on-a-stick needs the switch port to be an 802.1Q trunk carrying the subinterface VLANs. Gi1/0/48 is a static access port in VLAN 1, so it neither sends VLAN 10/20 frames tagged toward R1 nor accepts R1's tagged frames. `switchport mode trunk` (with VLANs 10 and 20 allowed) fixes it. R1's subinterfaces are already up/up. `switchport` commands do not exist on router interfaces. `switchport nonegotiate` only stops DTP; it does not turn an access port into a trunk.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-079',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. VLANs 10 and 20 route correctly through R1. Hosts in VLAN 30 cannot ping 192.168.30.1. The switch trunk to R1 uses native VLAN 1 and allows VLANs 10, 20 and 30, and VLAN 30 exists on the switch. Which change fixes VLAN 30?",
    exhibit: `R1# show running-config | section GigabitEthernet0/0/1.30
interface GigabitEthernet0/0/1.30
 description VLAN30-GUEST
 encapsulation dot1Q 3
 ip address 192.168.30.1 255.255.255.0`,
    options: [
      "Change the subinterface's encapsulation to `encapsulation dot1Q 30`",
      "Delete the subinterface and recreate it as GigabitEthernet0/0/1.3",
      "Add VLAN 3 to the allowed VLAN list on the switch trunk",
      "Change the subinterface's encapsulation to `encapsulation dot1Q 30 native`",
    ],
    answer: [0],
    explanation: "The subinterface number (.30) is only a label; the `encapsulation dot1Q` value decides which VLAN tag the subinterface uses. It is set to 3, so R1 ignores VLAN 30 frames and tags its replies as VLAN 3. Setting `encapsulation dot1Q 30` fixes it. Renumbering the subinterface to .3 changes only the name. Allowing VLAN 3 on the trunk would carry frames for VLAN 3, but the hosts are in VLAN 30. The `native` keyword makes the router send and expect VLAN 30 untagged, while the switch tags VLAN 30 (its native VLAN is 1), so the two ends would still disagree.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-080',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. ASW1 connects to DSW1, the default gateway for all user VLANs, over LACP Port-channel1 (Te1/1/1 and Te1/1/2). Users' upstream traffic saturates Te1/1/1 while Te1/1/2 carries almost nothing outbound. Which global command on ASW1 best spreads the upstream load?",
    exhibit: `ASW1# show etherchannel load-balance
EtherChannel Load-Balancing Configuration:
        dst-mac

EtherChannel Load-Balancing Addresses Used Per-Protocol:
Non-IP: Destination MAC address
  IPv4: Destination MAC address
  IPv6: Destination MAC address

ASW1# show interfaces TenGigabitEthernet1/1/1 | include minute
  5 minute input rate 1200000000 bits/sec, 140000 packets/sec
  5 minute output rate 9421000000 bits/sec, 812000 packets/sec
ASW1# show interfaces TenGigabitEthernet1/1/2 | include minute
  5 minute input rate 1150000000 bits/sec, 133000 packets/sec
  5 minute output rate 51000 bits/sec, 60 packets/sec`,
    options: [
      "lacp rate fast",
      "port-channel load-balance src-dst-ip",
      "lacp max-bundle 1",
      "port-channel min-links 2",
      "port-channel load-balance dst-mac",
    ],
    answer: [1],
    explanation: "Every frame users send off their subnet is addressed to one destination MAC — DSW1's gateway MAC — so a destination-MAC hash puts all of it on the same member. Hashing on source and destination IP (`port-channel load-balance src-dst-ip`, a global command) gives many different results and spreads the flows. Te1/1/2's healthy input rate shows the link itself works; DSW1's hash is already spreading downstream traffic. Re-entering `port-channel load-balance dst-mac` changes nothing, because that is the problem. `lacp rate fast` only changes how often LACPDUs are exchanged. `lacp max-bundle 1` would leave just one active member. `port-channel min-links 2` sets how many members must be up for the channel to stay up and does not change hashing. The default hash differs by platform, which is why `show etherchannel load-balance` is the first thing to check.",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-081',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Gi1/0/4 on each switch is configured exactly like Gi1/0/3. Which two changes, applied to both Gi1/0/3 and Gi1/0/4 on SW2, would bring Port-channel2 up? (Choose two.)",
    exhibit: `SW1# show etherchannel summary | begin Group
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
2      Po2(SD)         LACP        Gi1/0/3(I)  Gi1/0/4(I)

SW1# show running-config interface GigabitEthernet1/0/3
interface GigabitEthernet1/0/3
 switchport mode trunk
 channel-group 2 mode active
end

SW2# show running-config interface GigabitEthernet1/0/3
interface GigabitEthernet1/0/3
 switchport mode trunk
end`,
    options: [
      "channel-group 2 mode passive",
      "channel-group 2 mode on",
      "channel-group 2 mode desirable",
      "channel-group 2 mode active",
      "channel-group 2 mode auto",
      "lacp port-priority 100",
    ],
    answer: [0, 3],
    explanation: "SW1's members show `I` (stand-alone): they are sending LACPDUs but hear no LACP partner, because SW2's ports are not in a channel group at all. Putting SW2's ports into an LACP mode, either `active` or `passive`, completes negotiation because SW1 is already active. (The channel-group number is locally significant; SW2 could use any number.) `on` sends no LACPDUs, so it never pairs with an LACP `active` port. `desirable` and `auto` are PAgP modes and never interoperate with LACP. `lacp port-priority` only ranks ports inside an LACP bundle; it does not enable LACP. On IOS-XE, LACP ports with no partner typically run as individual (`I`) links; `port-channel standalone-disable` on the port channel suspends them (`s`) instead. (Cisco's documentation of this default is inconsistent across releases, so confirm with `show etherchannel summary` on your platform.)",
    lesson: '2.1-etherchannel',
  },
  {
    id: 'd2-082',
    topic: '2.1',
    type: 'fill',
    difficulty: 1,
    stem: "On a Catalyst switch, what word appears in the Vlan column of `show interfaces status` for a port configured with `no switchport`?",
    answer: ['routed'],
    explanation: "A routed (Layer 3) port belongs to no VLAN, so `show interfaces status` prints `routed` in the Vlan column. Trunk ports show `trunk`, and access ports show their access VLAN number. `show interfaces <port> switchport` on a routed port reports `Switchport: Disabled`.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-083',
    topic: '2.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each part of `show interfaces trunk` output to what it tells you.",
    pairs: [
      ['Vlans allowed on trunk', 'The list set by `switchport trunk allowed vlan`'],
      ['Vlans allowed and active in management domain', 'Allowed VLANs that also exist and are active on this switch'],
      ['Vlans in spanning tree forwarding state and not pruned', 'Active allowed VLANs the port is forwarding right now'],
      ['Native vlan', 'The VLAN whose frames cross the trunk untagged'],
      ['Mode: on', 'The trunk was configured statically with `switchport mode trunk`'],
    ],
    explanation: "The three VLAN lists narrow down step by step: what configuration allows, then what also exists locally, then what spanning tree is forwarding (and VTP has not pruned). A VLAN missing from the second list usually does not exist on the switch; a VLAN missing only from the third is usually STP-discarding on that port. `Native vlan` is the untagged VLAN. In the Mode column, `on` means a static trunk, while `desirable` or `auto` means the trunk was negotiated with DTP.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-084',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. ASW1 has uplinks to DSW1 (Gi1/0/1) and DSW2 (Gi1/0/2). By design, DSW1 is root for VLANs 10 and 99 and DSW2 is root for VLAN 20, each acting as secondary root for the other's VLANs. How should the engineer respond to the AI assistant?",
    exhibit: `ASW1# show interfaces trunk | begin forwarding
Port        Vlans in spanning tree forwarding state and not pruned
Gi1/0/1     10,99
Gi1/0/2     20

ASW1# show spanning-tree vlan 20 | begin Interface
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Altn BLK 4         128.1    P2p
Gi1/0/2             Root FWD 4         128.2    P2p

AI assistant: "VLAN 20 is missing from the forwarding list on Gi1/0/1, so it has
been pruned from that trunk. Run 'switchport trunk allowed vlan add 20' on Gi1/0/1
to restore redundancy for VLAN 20."`,
    options: [
      "Accept it: adding VLAN 20 to Gi1/0/1's allowed list makes both uplinks forward VLAN 20 and doubles its bandwidth",
      "Reject it: VLAN 20 does not exist on ASW1, so it must be created first",
      "Reject it: Gi1/0/1 is the expected alternate port for VLAN 20 and takes over if Gi1/0/2 fails",
      "Reject it: ASW1 should be made root for VLAN 20 so both uplinks forward",
    ],
    answer: [2],
    explanation: "VLAN 20 is absent only from the last list, and `show spanning-tree vlan 20` shows why: Gi1/0/1 is an alternate (discarding) port. With DSW2 as root for VLAN 20, ASW1's root port is Gi1/0/2, and its other uplink must discard for VLAN 20 to prevent a loop — exactly the per-VLAN load sharing the design intends. If Gi1/0/2 fails, Rapid PVST+ promotes Gi1/0/1 immediately. The assistant misread STP blocking as pruning. A trunk port appears in `show spanning-tree vlan 20` only if VLAN 20 is allowed and active on it, so VLAN 20 is already allowed on Gi1/0/1 and adding it changes nothing. ASW1 is forwarding VLAN 20 on Gi1/0/2, which proves the VLAN exists there. Making an access switch root would break the design and still leave one uplink discarding.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-085',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements about SW2 Gi1/0/24 are true? (Choose two.)",
    exhibit: `SW2# show interfaces GigabitEthernet1/0/24 switchport
Name: Gi1/0/24
Switchport: Enabled
Administrative Mode: dynamic desirable
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 99 (VLAN0099)
<output omitted>
Trunking VLANs Enabled: 10,20,99
<output omitted>`,
    options: [
      "The port is a static trunk that does not send DTP frames",
      "The trunk was formed through DTP, so the neighbor port is in trunk, dynamic desirable or dynamic auto mode",
      "Untagged frames received on the port are placed in VLAN 99",
      "VLAN 1 frames cross this link untagged",
      "The neighbor port must also be dynamic desirable for this result",
      "Hosts in VLAN 30 can send traffic across this link",
    ],
    answer: [1, 2],
    explanation: "Administrative mode `dynamic desirable` with operational mode `trunk` and `Negotiation of Trunking: On` means DTP negotiated the trunk; a desirable port trunks with a neighbor in trunk, desirable or auto mode. The native VLAN is 99, so untagged frames go into VLAN 99. The port actively negotiates, so it is not a static non-negotiating trunk. VLAN 1 is neither native nor allowed here. Auto or trunk on the neighbor also works, so desirable is not required. The allowed list is 10,20,99, so VLAN 30 is not carried.",
    lesson: '2.1-interfaces-trunks-svi',
  },
  {
    id: 'd2-086',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: "DSW1 Gi1/0/48 and DSW2 Gi1/0/48 are both configured with `no switchport` and an address from 10.0.0.0/30, and `ip routing` is enabled on both switches. Which two statements about this link are true? (Choose two.)",
    options: [
      "The ports belong to no VLAN and do not take part in spanning tree",
      "Each port also needs `switchport mode trunk` so routed traffic can cross the link",
      "The IP address is configured directly on the physical interface",
      "An SVI for a transit VLAN must exist before the addresses can be used",
      "The ports negotiate with DTP before they pass IP traffic",
      "Spanning tree blocks one link if a second routed link is added in parallel",
    ],
    answer: [0, 2],
    explanation: "A routed port is a Layer 3 interface: it has its own IP address on the physical interface, belongs to no VLAN, and runs neither STP nor DTP. That is why routed point-to-point links between multilayer switches avoid STP blocking and converge with the routing protocol. `switchport` commands are not valid on a routed port. No SVI or transit VLAN is needed. Parallel routed links are not blocked by spanning tree; a routing protocol can load-share across them (equal-cost paths).",
    lesson: '2.1-interfaces-trunks-svi',
  },

  // ---------------------------------------------------------------- 2.2 (expansion)
  {
    id: 'd2-087',
    topic: '2.2',
    type: 'fill',
    difficulty: 2,
    stem: "Refer to the exhibit. Six new 802.3at (PoE+) class 4 access points will be connected to SW1. Assume the switch allocates the full 30 W class 4 maximum to each AP and nothing else changes. How many of the new APs can be powered? Enter a number.",
    exhibit: `SW1# show power inline

Module   Available     Used     Remaining
          (Watts)     (Watts)    (Watts)
------   ---------   --------   ---------
1           740.0      652.5        87.5
<output omitted>`,
    answer: ['2', 'two'],
    explanation: "87.5 W remaining ÷ 30 W per AP = 2.9, so only two APs can be powered (60 W, leaving 27.5 W). The third would need 30 W that is not available, so its port would show `power-deny`. Adding a power supply, lowering what other ports are allocated, or moving APs to another switch would raise the number. (When a powered device negotiates its real needs through CDP or LLDP, the switch can allocate less than the class maximum; the question rules that out.)",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-088',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A third-party SIP phone that does not support CDP is connected to Gi1/0/15 and keeps getting an address from the data subnet (VLAN 10). VLAN 110 exists on SW1. Evaluate the AI assistant's recommendation.",
    exhibit: `SW1# show running-config interface GigabitEthernet1/0/15
interface GigabitEthernet1/0/15
 switchport access vlan 10
 switchport mode access
 switchport voice vlan 110
 spanning-tree portfast
end

SW1# show lldp neighbors
% LLDP is not enabled

AI assistant: "The phone cannot use CDP, so it is waiting for an LLDP-MED network
policy that never arrives because LLDP is off. Enter 'lldp run' globally; SW1 will
then advertise voice VLAN 110 to the phone."`,
    options: [
      "Wrong: the port must be converted to an 802.1Q trunk that allows VLANs 10 and 110",
      "Correct: once LLDP runs, SW1 advertises voice VLAN 110 to the phone in an LLDP-MED network policy",
      "Wrong: `lldp transmit` must be configured on Gi1/0/15 instead, because the global command alone does not advertise on access ports",
      "Wrong: the voice VLAN must be the same as the access VLAN for non-Cisco phones",
    ],
    answer: [1],
    explanation: "The port is configured correctly with `switchport voice vlan 110`, but the switch has only two ways to tell a phone that VLAN: CDP (which this phone doesn't support) and LLDP-MED. LLDP is disabled globally, so no network policy is sent. After `lldp run`, the switch advertises the voice VLAN in the LLDP-MED network policy TLV, and the phone moves to VLAN 110 (it may need to restart to renew its address). A voice VLAN port stays an access port; no trunk is needed. Interface-level `lldp transmit` is already the default and does nothing while LLDP is off globally. Voice and data VLANs are meant to be different.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-089',
    topic: '2.2',
    type: 'order',
    difficulty: 2,
    stem: "Gi1/0/12 is configured with `switchport access vlan 10`, `switchport voice vlan 110` and the default `power inline auto`. A Cisco IP phone that relies on PoE is plugged in. Put the events in order, from first to last.",
    items: [
      "The switch detects a valid PoE signature and classifies the phone",
      "The switch applies power and the phone boots",
      "The phone receives a CDP message from the switch that advertises voice VLAN 110",
      "The phone sends a DHCP Discover tagged with VLAN 110",
      "The phone receives an IP address from the voice subnet",
    ],
    explanation: "Power comes first: the switch detects the PD signature, classifies it, then delivers power so the phone can boot. Once running, the phone listens for CDP (or LLDP-MED), learns voice VLAN 110, and only then sends tagged DHCP requests in that VLAN, ending with an address from the voice subnet. If the phone never learns the voice VLAN, it sends DHCP untagged and ends up in the data VLAN instead.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-090',
    topic: '2.2',
    type: 'fill',
    difficulty: 2,
    stem: "SW1 Gi1/0/20 is an 802.1Q trunk to an ESXi host whose virtual switch does not run spanning tree. Which interface command makes this trunk an edge port so it forwards as soon as the link comes up?",
    answer: ['spanning-tree portfast trunk', 'spanning-tree portfast edge trunk'],
    explanation: "Plain `spanning-tree portfast` has no effect on a port that is trunking; the `trunk` keyword is required for trunk ports toward hypervisors and servers. Some IOS releases write it `spanning-tree portfast edge trunk`. Pairing it with BPDU guard protects against a VM or misconfigured host bridging BPDUs back into the network.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-091',
    topic: '2.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each connected device to the switch port configuration that suits it.",
    pairs: [
      ['Desktop PC', 'Access port in the user VLAN with PortFast and BPDU guard'],
      ['Cisco IP phone with a PC behind it', 'Access port with a data VLAN plus a voice VLAN'],
      ['Lightweight AP in local mode', 'Access port in the AP management VLAN'],
      ['Autonomous AP bridging three SSIDs to three VLANs', 'Trunk carrying the SSID VLANs, with the AP management VLAN as native'],
      ['Linux server with an 802.3ad bond in a single VLAN', 'Access ports bundled with `channel-group 1 mode active`'],
    ],
    explanation: "A desktop gets a plain access port that forwards immediately and err-disables if a switch is plugged in. A phone port is still an access port, with voice tagged and PC traffic untagged. A local-mode AP tunnels client traffic to the WLC in CAPWAP, so the switch only sees the management VLAN. An autonomous AP bridges each SSID to its own VLAN, which needs a trunk. An 802.3ad bond speaks LACP, so the switch side is an LACP port channel; with one VLAN it can be an access channel.",
    lesson: '2.2-edge-ports',
  },
  {
    id: 'd2-092',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Last night the teaming policy on host ESX01's vSphere Standard Switch was changed to 'Route based on IP hash'. Gi1/0/21 (vmnic1) is configured exactly like Gi1/0/20. What switch-side change matches the new policy?",
    exhibit: `SW1# show logging | include MACFLAP
%SW_MATM-4-MACFLAP_NOTIF: Host 0050.56a1.3c07 in vlan 20 is flapping between port Gi1/0/21 and port Gi1/0/20
%SW_MATM-4-MACFLAP_NOTIF: Host 0050.56a1.3c11 in vlan 30 is flapping between port Gi1/0/20 and port Gi1/0/21

SW1# show running-config interface GigabitEthernet1/0/20
interface GigabitEthernet1/0/20
 description ESX01-vmnic0
 switchport trunk allowed vlan 10,20,30
 switchport mode trunk
 spanning-tree portfast trunk
end`,
    options: [
      "Bundle Gi1/0/20 and Gi1/0/21 with `channel-group 5 mode active`",
      "Enable BPDU guard on both ports, because the flapping shows a Layer 2 loop through the host",
      "Bundle Gi1/0/20 and Gi1/0/21 with `channel-group 5 mode on`",
      "Convert both ports to access ports in VLAN 20",
    ],
    answer: [2],
    explanation: "With IP-hash teaming, the host sends a VM's frames out whichever uplink the hash picks for each destination, so the same VM MAC arrives on both switch ports and SW1 logs MAC flapping. IP hash expects the two switch ports to be one EtherChannel, and a vSphere Standard Switch has no LACP, so a static `mode on` channel (trunking the same VLANs) is the matching configuration. LACP `active` would find no partner because only a Distributed Switch runs LACP. A hypervisor's virtual switch does not forward frames between its uplinks, so this is not a loop, and BPDU guard would not stop the flapping. Access ports would cut off VLANs 10 and 30.",
    lesson: '2.2-edge-ports',
  },

  // ---------------------------------------------------------------- 2.3 (expansion)
  {
    id: 'd2-093',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two fields in the documentation record must be corrected? (Choose two.)",
    exhibit: `Documentation record (SW1 uplink):
  Neighbor: R1    Mgmt IP: 10.0.0.1    Platform: ISR4331
  Link: SW1 Gi1/0/48 <-> R1 Gi0/0/0

SW1# show cdp neighbors GigabitEthernet1/0/48 detail
-------------------------
Device ID: R1.corp.local
Entry address(es):
  IP address: 10.0.0.11
Platform: cisco ISR4331/K9,  Capabilities: Router Switch IGMP
Interface: GigabitEthernet1/0/48,  Port ID (outgoing port): GigabitEthernet0/0/1
Holdtime : 143 sec

Version :
Cisco IOS Software [Dublin], ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 17.12.4, RELEASE SOFTWARE (fc1)
<output omitted>

advertisement version: 2
Duplex: full
Management address(es):
  IP address: 10.0.0.11`,
    options: [
      "R1's management IP address",
      "SW1's interface on the link",
      "R1's interface on the link",
      "R1's platform",
      "The neighbor's name, because CDP reports a different device",
    ],
    answer: [0, 2],
    explanation: "CDP reports R1's address as 10.0.0.11, not 10.0.0.1, and R1's sending port (`Port ID (outgoing port)`) as Gi0/0/1, not Gi0/0/0. `Interface:` is the local port, Gi1/0/48, which matches the record. The platform (ISR4331) matches. The Device ID is R1 with its domain name appended, the same device, not a different one.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-094',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The network documentation describes IDF2-SW as a Layer 3 switch that routes for the IDF2 VLANs, connected from its port 1/1/24 to SW1 Gi1/0/40. Which conclusion does the LLDP output support?",
    exhibit: `SW1# show lldp neighbors GigabitEthernet1/0/40 detail
------------------------------------------------
Local Intf: Gi1/0/40
Chassis id: 9c8e.99aa.1200
Port id: 1/1/24
Port Description: 1/1/24
System Name: IDF2-SW

System Description:
ExampleOS 10.13 48-port Gigabit switch

Time remaining: 104 seconds
System Capabilities: B,R
Enabled Capabilities: B
Management Addresses:
    IP: 10.20.0.42
Auto Negotiation - supported, enabled
Physical media capabilities:
    1000baseT(FD)
Media Attachment Unit type: 30
Vlan ID: 1

Total entries displayed: 1`,
    options: [
      "IDF2-SW can route but advertises only bridging as enabled, so its routing role needs checking",
      "The cabling is wrong: SW1's port is 1/1/24 and IDF2-SW's port is Gi1/0/40, so the documented ports are swapped",
      "IDF2-SW is routing, because R appears in System Capabilities",
      "10.20.0.42 is SW1's own management address, sent to the neighbor",
    ],
    answer: [0],
    explanation: "`System Capabilities` lists what the device can do (bridge and router); `Enabled Capabilities` lists what is turned on, and only B (bridge) is enabled. That contradicts the documentation's claim that IDF2-SW routes, so check its configuration before trusting the diagram. The link itself matches: `Local Intf` Gi1/0/40 is SW1's port and `Port id` 1/1/24 is the neighbor's. A capability in the System list alone doesn't prove the function is active. The management address in a neighbor entry is the neighbor's own address.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-095',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A nightly documentation script on SW1 sometimes finds R2 on Gi1/0/5 and sometimes does not. The two outputs were taken 40 seconds apart, and the link never went down. What is the cause?",
    exhibit: `SW1# show cdp neighbors | begin Device
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R2               Gig 1/0/5         22               R B   ISR4321/K Gig 0/0/1

Total cdp entries displayed : 1

SW1# show cdp neighbors | begin Device
Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID

Total cdp entries displayed : 0

R2# show running-config | include cdp
cdp timer 60
cdp holdtime 30`,
    options: [
      "SW1's own CDP holdtime is too short, so SW1 deletes R2's entry before R2's next advertisement can arrive",
      "R2 advertises a 30-second holdtime but only sends every 60 seconds, so the entry expires",
      "R2 and SW1 are running different CDP versions, so every second advertisement is rejected",
      "A second device behind Gi1/0/5 is replacing R2's entry in SW1's table",
    ],
    answer: [1],
    explanation: "The holdtime is carried inside each CDP advertisement, so SW1 keeps R2's entry for the holdtime R2 sends: 30 seconds. R2 only sends every 60 seconds, so the entry expires and stays missing for about 30 seconds of every minute. The fix is on R2: make the holdtime longer than the timer (the defaults are 60 s timer, 180 s holdtime). SW1's own holdtime setting is what SW1 tells its neighbors and doesn't affect how long SW1 keeps R2. CDPv1 and CDPv2 interoperate. Another device would show up as an extra entry with a different Device ID, not as R2 disappearing.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-096',
    topic: '2.3',
    type: 'fill',
    difficulty: 1,
    stem: "LLDP is running on SW1 with default timers. Which global configuration command makes SW1 send LLDP advertisements every 10 seconds?",
    answer: ['lldp timer 10'],
    explanation: "`lldp timer 10` sets the advertisement interval (default 30 seconds). The related `lldp holdtime` command sets how long neighbors keep SW1's information (default 120 seconds). The CDP equivalents are `cdp timer` and `cdp holdtime`.",
    lesson: '2.3-cdp-lldp',
  },
  {
    id: 'd2-097',
    topic: '2.3',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. The documentation shows a third-party firewall on SW1 Gi1/0/44. The firewall supports only LLDP, and LLDP is enabled on it. Gi1/0/44 has no CDP or LLDP interface commands. Which two statements are true? (Choose two.)",
    exhibit: `SW1# show cdp neighbors GigabitEthernet1/0/44
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone,
                  D - Remote, C - CVTA, M - Two-port Mac Relay

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID

Total cdp entries displayed : 0

SW1# show lldp neighbors
% LLDP is not enabled`,
    options: [
      "The empty CDP output is expected, whatever SW1's CDP configuration",
      "Entering `cdp enable` on Gi1/0/44 will make the firewall appear in `show cdp neighbors`",
      "Entering `lldp run` on SW1 is enough for SW1 to learn the firewall as a neighbor",
      "LLDP needs an IP address on Gi1/0/44 before it can discover the firewall",
      "Enabling LLDP on SW1 disables CDP on all of its interfaces",
      "The firewall cannot be discovered because Gi1/0/44 is in a different VLAN from the firewall's management interface",
    ],
    answer: [0, 2],
    explanation: "A device that runs only LLDP never sends CDP, so no CDP configuration on SW1 can produce an entry. LLDP is off globally on SW1; `lldp run` turns it on, and because every interface transmits and receives LLDP by default, the firewall appears without further changes. CDP is already enabled on interfaces by default, and `cdp enable` cannot create advertisements the firewall never sends. CDP and LLDP are Layer 2 protocols that need no IP address or matching VLAN. The two protocols run independently, so enabling LLDP leaves CDP alone.",
    lesson: '2.3-cdp-lldp',
  },

  // ---------------------------------------------------------------- 2.4 (expansion)
  {
    id: 'd2-098',
    topic: '2.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. R1's Gi0/0/0 (10.0.12.1/30) faces R2, and Gi0/0/1 (10.1.10.1/24) is the LAN gateway. Users in 10.1.10.0/24 cannot reach server 172.16.50.10 behind R2. What is the most likely cause?",
    exhibit: `R1# ping 172.16.50.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 172.16.50.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/3 ms

R1# ping
Protocol [ip]:
Target IP address: 172.16.50.10
Repeat count [5]:
Datagram size [100]:
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: 10.1.10.1
<remaining prompts left at their defaults>
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 172.16.50.10, timeout is 2 seconds:
Packet sent with a source address of 10.1.10.1
.....
Success rate is 0 percent (0/5)`,
    options: [
      "R1 has no route to 172.16.50.0, so only directly connected sources work",
      "The server at 172.16.50.10 is powered off",
      "The routers beyond R1 have no route back to 10.1.10.0/24, so replies to LAN-sourced packets are lost",
      "The extended ping is invalid because the source must be entered as an interface name, not an IP address",
    ],
    answer: [2],
    explanation: "The first ping is sourced from R1's exit interface (10.0.12.1) and succeeds, so the forward path and a return path to 10.0.12.0/30 both work. The same ping sourced from the LAN address 10.1.10.1 fails, so the far side cannot return traffic to 10.1.10.0/24 — typically a missing route (or a filter on that source) beyond R1. R1 clearly has a route to the server, and the server answered the first ping, so it is up. The extended ping prompt accepts either an IP address or an interface name, and the output confirms the packets were sent from 10.1.10.1.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-099',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 connects to R2 over 10.0.12.0/30, and R2 connects to R3 over 10.0.23.0/30. What does the traceroute show?",
    exhibit: `R1# traceroute 172.16.80.20
Type escape sequence to abort.
Tracing the route to 172.16.80.20
VRF info: (vrf in name/id, vrf out name/id)
  1 10.0.12.2 1 msec 1 msec 1 msec
  2 10.0.23.3 2 msec 1 msec 2 msec
  3 10.0.23.2 2 msec 2 msec 2 msec
  4 10.0.23.3 3 msec 2 msec 3 msec
  5 10.0.23.2 3 msec 3 msec 3 msec
  6 10.0.23.3 4 msec 4 msec 4 msec`,
    options: [
      "R2 and R3 load-share across two equal-cost paths to 172.16.80.20",
      "The trace reached 172.16.80.20 at hop 2 and the remaining lines are retries",
      "R3 is rate-limiting ICMP, so R2 answers on its behalf",
      "A routing loop between R2 and R3 for 172.16.80.20",
    ],
    answer: [3],
    explanation: "After hop 2 the trace bounces between R3 (10.0.23.3) and R2 (10.0.23.2) and never reaches 172.16.80.20 — the signature of a routing loop. Each router's route for the destination points at the other, so packets circle until TTL expires. Next step: compare `show ip route 172.16.80.20` on R2 and R3 (often a static route or default route in both directions). Equal-cost load sharing would show different next hops at the same hop number, not the same two addresses taking turns. The destination address never appears, so the trace did not complete. Routers don't answer traceroute on behalf of other routers.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-100',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The printer on Gi1/0/7 went offline this morning. What is the best next step?",
    exhibit: `SW1# show logging | include LINK-3|ERR_DISABLE
*Oct 24 08:14:02.118: %LINK-3-UPDOWN: Interface GigabitEthernet1/0/7, changed state to down
*Oct 24 08:14:03.902: %LINK-3-UPDOWN: Interface GigabitEthernet1/0/7, changed state to up
<6 similar UPDOWN messages within the next 7 seconds omitted>
*Oct 24 08:14:10.640: %PM-4-ERR_DISABLE: link-flap error detected on Gi1/0/7, putting Gi1/0/7 in err-disable state
*Oct 24 08:14:10.642: %LINK-3-UPDOWN: Interface GigabitEthernet1/0/7, changed state to down

SW1# show interfaces status err-disabled

Port         Name               Status       Reason               Err-disabled Vlans
Gi1/0/7      Floor2-Printer     err-disabled link-flap`,
    options: [
      "Wait five minutes; err-disabled ports recover automatically by default",
      "Remove BPDU guard from Gi1/0/7, because the printer sent a BPDU that triggered the err-disable action",
      "Fix the cabling or NIC fault, then bounce the port with `shutdown` and `no shutdown`",
      "Raise the port-security maximum on Gi1/0/7, because a violation shut it down",
    ],
    answer: [2],
    explanation: "The reason is `link-flap`: the link went up and down repeatedly in a few seconds, so the switch err-disabled the port. That points to Layer 1 — a damaged cable or jack, a failing NIC or an autonegotiation problem — so fix the physical cause, then bounce the port. Err-disable recovery is off by default unless `errdisable recovery cause ...` is configured. A BPDU would show the reason `bpduguard`, and a port-security violation would show `psecure-violation`.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-101',
    topic: '2.4',
    type: 'match',
    difficulty: 2,
    stem: "Refer to the exhibit. Match each port to the best interpretation of its line.",
    exhibit: `SW1# show interfaces status

Port         Name               Status       Vlan       Duplex  Speed Type
Gi1/0/1      PC-101             connected    10         a-full a-1000 10/100/1000BaseTX
Gi1/0/2      PC-102             notconnect   10           auto   auto 10/100/1000BaseTX
Gi1/0/3      Spare              disabled     1            auto   auto 10/100/1000BaseTX
Gi1/0/4      Kiosk              err-disabled 10           auto   auto 10/100/1000BaseTX
Gi1/0/5      Printer-2F         connected    40         a-half  a-100 10/100/1000BaseTX`,
    pairs: [
      ['Gi1/0/1', 'Link up; speed and duplex were autonegotiated to 1000/full'],
      ['Gi1/0/2', 'No link: cable unplugged or the device is off'],
      ['Gi1/0/3', 'Shut down with the `shutdown` command'],
      ['Gi1/0/4', 'Shut down by a protection feature; check the reason before re-enabling'],
      ['Gi1/0/5', 'Link up at 100/half, a sign the far end may be hard-coded'],
    ],
    explanation: "`connected` means link is up, and the `a-` prefix means the value was autonegotiated. `notconnect` means no link. `disabled` is the `show interfaces status` term for an administratively shut port. `err-disabled` means a feature such as BPDU guard, port security or link-flap detection shut the port; `show interfaces status err-disabled` shows the reason. Autonegotiated half duplex at 100 Mbps often happens when the far end is hard-coded to 100/full: the switch can detect the speed but not the duplex, falls back to half, and a duplex mismatch follows.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-102',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A PC with static address 10.1.10.57/24 and gateway 10.1.10.1 (VLAN 10 according to the documentation) cannot ping its gateway. The PC's MAC address is 3c52.8211.9a0e. Evaluate the AI assistant's conclusion.",
    exhibit: `ASW1# show mac address-table address 3c52.8211.9a0e
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  20    3c52.8211.9a0e    DYNAMIC     Gi1/0/14
Total Mac Addresses for this criterion: 1

ASW1# show interfaces status | include Gi1/0/14
Gi1/0/14     Desk-214           connected    20         a-full a-1000 10/100/1000BaseTX

AI assistant: "The PC's MAC is learned on Gi1/0/14, an access port in VLAN 20.
The PC is addressed for VLAN 10, so its ARP requests for 10.1.10.1 never reach
the gateway. Set 'switchport access vlan 10' on Gi1/0/14."`,
    options: [
      "Wrong: `clear mac address-table dynamic` must be run, or the PC stays in VLAN 20",
      "Wrong: the PC is tagging its frames with VLAN 20, so the PC's NIC must be fixed",
      "Wrong: the gateway must be moved into VLAN 20 instead",
      "Correct: Gi1/0/14 is in the wrong VLAN, and moving it to VLAN 10 fixes the PC",
    ],
    answer: [3],
    explanation: "The MAC table shows the PC learned in VLAN 20 on Gi1/0/14, and `show interfaces status` confirms Gi1/0/14 is an access port in VLAN 20. The PC is addressed for VLAN 10, so its broadcasts (including ARP for 10.1.10.1) stay in VLAN 20 and never reach the gateway. The assistant's reasoning and fix are correct. Clearing the MAC table is unnecessary; the entry is relearned in VLAN 10 as soon as the PC sends a frame. An access port sees untagged frames from a normal PC; the VLAN comes from the switch port, not the PC. Moving the gateway would break every other VLAN 10 host and contradict the documentation.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-103',
    topic: '2.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users report intermittent connectivity to the printer at 10.1.10.60. The capture was taken on the gateway's VLAN 10 interface (MAC 00:1a:2b:3a:91:40). What does it indicate?",
    exhibit: `No. Time      Source             Destination        Proto Info
1   0.000000  00:1a:2b:3a:91:40  ff:ff:ff:ff:ff:ff  ARP   Who has 10.1.10.60? Tell 10.1.10.1
2   0.000412  54:bf:64:5e:21:07  00:1a:2b:3a:91:40  ARP   10.1.10.60 is at 54:bf:64:5e:21:07
3   0.000655  30:e1:71:c2:0a:9b  00:1a:2b:3a:91:40  ARP   10.1.10.60 is at 30:e1:71:c2:0a:9b`,
    options: [
      "Two different devices are answering for 10.1.10.60: a duplicate IP address",
      "The switch flooded one ARP reply, so the gateway received the same reply twice",
      "The printer is in a different VLAN from the gateway, so the reply had to be proxied",
      "The gateway received no ARP reply, so its entry for 10.1.10.60 stays Incomplete",
    ],
    answer: [0],
    explanation: "One ARP request produced two replies with different MAC addresses claiming the same IP. The gateway's ARP entry ends up with whichever reply it processes last, and that can change, so traffic for 10.1.10.60 goes to one device and then the other — classic duplicate-address behavior. Find both MACs with `show mac address-table address` and readdress one device. A flooded copy of one reply would carry the same sender MAC, not two different MACs. Nothing suggests a VLAN problem; both replies arrived in VLAN 10. The gateway clearly received replies, so the entry is not Incomplete. (A host with two NICs on one subnet can also answer twice, but that is the rarer case.)",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-104',
    topic: '2.4',
    type: 'order',
    difficulty: 2,
    stem: "R1 runs `traceroute` to a host several routers away. Put the events in order, from first to last.",
    items: [
      "R1 sends UDP probes with TTL 1, and the first router decrements the TTL to 0 and returns ICMP time exceeded",
      "R1 sends probes with TTL 2, and the second router returns ICMP time exceeded",
      "R1 keeps increasing the TTL by one for each new set of probes",
      "Probes reach the destination host, which returns ICMP port unreachable",
      "R1 recognizes that the destination has answered and ends the trace",
    ],
    explanation: "Traceroute discovers each hop by forcing it to expire the probe: TTL 1 reveals the first router, TTL 2 the second, and so on. IOS sends three UDP probes per TTL to high port numbers that are unlikely to be open. When probes finally reach the destination, the host answers with ICMP port unreachable instead of time exceeded, which tells R1 the trace is complete. (Windows `tracert` uses ICMP echo probes, so the destination answers with an echo reply.)",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-105',
    topic: '2.4',
    type: 'fill',
    difficulty: 1,
    stem: "By default, how many seconds does a Catalyst switch keep a dynamically learned MAC address that has received no frames before aging it out? Enter a number.",
    answer: ['300'],
    explanation: "The default MAC aging time is 300 seconds (5 minutes), shown as `Aging Time 300 sec` in `show spanning-tree` and changed with `mac address-table aging-time`. A host that stays silent longer than this disappears from `show mac address-table`, and frames to it are flooded until it sends again — keep that in mind when a MAC lookup comes back empty.",
    lesson: '2.4-troubleshooting-tools',
  },
  {
    id: 'd2-106',
    topic: '2.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Users on ASW3 report a very slow network starting a few minutes ago. Gi1/0/1 is ASW3's uplink trunk to DSW1, which owns the VLAN 10 gateway MAC 0c75.bd22.3301. What is the most likely problem?",
    exhibit: `ASW3# show logging | include MACFLAP
%SW_MATM-4-MACFLAP_NOTIF: Host 0c75.bd22.3301 in vlan 10 is flapping between port Gi1/0/1 and port Gi1/0/23
%SW_MATM-4-MACFLAP_NOTIF: Host 0050.7966.6812 in vlan 10 is flapping between port Gi1/0/23 and port Gi1/0/1
%SW_MATM-4-MACFLAP_NOTIF: Host a4bb.6d40.1c22 in vlan 10 is flapping between port Gi1/0/1 and port Gi1/0/23

ASW3# show running-config interface GigabitEthernet1/0/23
interface GigabitEthernet1/0/23
 description Desk-323
 switchport access vlan 10
 switchport mode access
 spanning-tree portfast
 spanning-tree bpdufilter enable
end`,
    options: [
      "A host on Gi1/0/23 has a duplicate IP address with the gateway",
      "A Layer 2 loop through Gi1/0/23 that BPDU filter keeps spanning tree from blocking",
      "The MAC aging time is too short, so entries are relearned on random ports",
      "A hypervisor on Gi1/0/23 is using IP-hash NIC teaming without a matching port channel on ASW3",
    ],
    answer: [1],
    explanation: "Many unrelated MACs, including the gateway's, which should only ever arrive on the uplink, are also arriving on a desk port. Frames are circulating back into ASW3 through Gi1/0/23 (for example a desk switch cabled to two wall jacks), which is a loop. Interface-level `spanning-tree bpdufilter enable` stops the port sending and processing BPDUs, so STP never sees the loop and never blocks it. Shut the port, remove BPDU filter and use BPDU guard. A duplicate IP address causes ARP conflicts, not MAC flapping between ports. Aging time does not make a MAC appear on a port it never arrived on. IP-hash teaming makes a host's own VM MACs flap between that host's two ports, not the gateway MAC between an uplink and a desk port.",
    lesson: '2.4-troubleshooting-tools',
  },

  // ---------------------------------------------------------------- 2.5 (expansion)
  {
    id: 'd2-107',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. All switches run Rapid PVST+, and the port costs shown are the configured spanning-tree costs. Which port is the alternate (discarding) port for VLAN 10?",
    exhibit: `VLAN 10 bridge IDs
SW1  priority 24586  MAC 0011.2201.0001   (root bridge)
SW2  priority 32778  MAC 0011.2201.0002
SW3  priority 32778  MAC 0011.2201.0003

Link                              Port cost (each end)
SW1 Gi1/0/1  <->  SW2 Gi1/0/1     4
SW1 Gi1/0/2  <->  SW3 Gi1/0/1     19
SW2 Gi1/0/2  <->  SW3 Gi1/0/2     4`,
    options: [
      "SW3 Gi1/0/2",
      "SW2 Gi1/0/2",
      "SW3 Gi1/0/1",
      "SW1 Gi1/0/2",
    ],
    answer: [2],
    explanation: "SW2's root port is Gi1/0/1 (cost 4). SW3 can reach the root directly for 19, or through SW2 for 4 + 4 = 8, so SW3's root port is Gi1/0/2. On the SW2–SW3 link, SW2 advertises a root path cost of 4 and SW3 has 8, so SW2 Gi1/0/2 is designated (and SW3 Gi1/0/2 is SW3's root port). On the SW1–SW3 link, SW1 is the root, so SW1 Gi1/0/2 is designated, and SW3 Gi1/0/1 — the direct link to the root — is the alternate port. A direct connection to the root loses whenever the cost through another switch is lower. A root bridge port is always designated.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-108',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. DSW1 is root for VLAN 30 with priority 24576. All access switches use the default priority. DSW2 must take over as root if DSW1 fails, but must never win while DSW1 is up. Which command should the engineer enter on DSW2?",
    exhibit: `DSW2(config)# spanning-tree vlan 30 priority 30000
% Bridge Priority must be in increments of 4096.
% Allowed values are:
  0     4096  8192  12288 16384 20480 24576 28672
  32768 36864 40960 45056 49152 53248 57344 61440`,
    options: [
      "spanning-tree vlan 30 priority 24576",
      "spanning-tree vlan 30 priority 28672",
      "spanning-tree vlan 30 priority 32768",
      "spanning-tree vlan 30 priority 20480",
      "spanning-tree vlan 30 priority 32798",
    ],
    answer: [1],
    explanation: "28672 is a valid multiple of 4096 that sits between DSW1 (24576) and the access switches (32768), so DSW2 loses to DSW1 but beats every access switch when DSW1 is gone — the same value `root secondary` sets. 24576 ties DSW1, leaving the MAC address to decide, so DSW2 might become root. 32768 ties the access switches, so an access switch with a lower MAC could win when DSW1 fails. 20480 beats DSW1. 32798 is the displayed value for 32768 in VLAN 30 (priority plus VLAN ID); it isn't a multiple of 4096 and would be rejected.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-109',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Whenever the link from SW2 Gi1/0/3 to SW5 comes up, it takes about 30 seconds to forward, while SW2's other inter-switch links converge in about a second. What explains the delay?",
    exhibit: `SW2# show spanning-tree vlan 10 | begin Interface
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p
Gi1/0/3             Desg LRN 19        128.3    Shr
Gi1/0/10            Desg FWD 4         128.10   P2p Edge

SW2# show interfaces GigabitEthernet1/0/3 status

Port         Name               Status       Vlan       Duplex  Speed Type
Gi1/0/3      To-SW5            connected    trunk      a-half  a-100 10/100/1000BaseTX`,
    options: [
      "Gi1/0/3 is half duplex, so RSTP treats it as a shared link and falls back to timers",
      "Gi1/0/3 lacks PortFast, which every inter-switch link needs in order to skip the discarding and learning states",
      "The cost of 19 is too high, so the port must wait for the max age timer before forwarding",
      "SW2 is the root bridge, so its designated ports always wait for forward delay",
    ],
    answer: [0],
    explanation: "Rapid convergence relies on the proposal/agreement handshake, which runs only on point-to-point links. The Type column shows `Shr` because the port negotiated half duplex, so RSTP falls back to timers: forward delay in discarding plus forward delay in learning, about 30 seconds (the exhibit catches it in `LRN`). Fix the duplex (full duplex is detected as point-to-point), or force it with `spanning-tree link-type point-to-point`. PortFast is for edge ports, not links to other switches. Cost decides roles, not transition speed, and max age is not involved here. SW2 has a root port, so it is not the root bridge.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-110',
    topic: '2.5',
    type: 'multi',
    difficulty: 2,
    stem: "Design: DSW1 is root for VLAN 10 and backup root for VLAN 20; DSW2 is root for VLAN 20 and backup root for VLAN 10. DSW2 already has `spanning-tree vlan 20 root primary` and `spanning-tree vlan 10 root secondary`. All other switches use default priorities. Which two commands complete the design on DSW1? (Choose two.)",
    options: [
      "spanning-tree vlan 10 root primary",
      "spanning-tree vlan 10,20 root primary",
      "spanning-tree vlan 20 root secondary",
      "spanning-tree vlan 20 priority 24576",
      "spanning-tree vlan 10 priority 32768",
      "spanning-tree mode pvst",
    ],
    answer: [0, 2],
    explanation: "`root primary` for VLAN 10 sets 24576, below DSW2's 28672, so DSW1 becomes root for VLAN 10. `root secondary` for VLAN 20 sets 28672, above DSW2's 24576 and below the default 32768, so DSW1 is the backup root for VLAN 20. `root primary` for VLANs 10 and 20 would also make DSW1 root for VLAN 20 (it sets 20480, 4096 below DSW2's 24576), undoing the load sharing. Priority 24576 for VLAN 20 ties DSW2 and lets the MAC address decide. Priority 32768 for VLAN 10 is just the default. `spanning-tree mode pvst` would downgrade the switch from Rapid PVST+ to legacy PVST+.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-111',
    topic: '2.5',
    type: 'fill',
    difficulty: 1,
    stem: "Which interface configuration command enables root guard on a distribution switch port that connects down to an access switch?",
    answer: ['spanning-tree guard root'],
    explanation: "`spanning-tree guard root` puts the port into the root-inconsistent state for any VLAN where a superior BPDU arrives, so a downstream switch can never become root through that port. The port recovers automatically when the superior BPDUs stop. The loop guard equivalent is `spanning-tree guard loop`.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-112',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The engineer plans to add `spanning-tree portfast bpduguard default` on ASW2. ASW2's access ports have no per-port spanning-tree commands, and its uplinks Te1/1/1 and Te1/1/2 are static trunks to DSW1 and DSW2. Evaluate the AI assistant's warning.",
    exhibit: `ASW2# show running-config | include spanning-tree
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree extend system-id

AI assistant: "Do not add 'spanning-tree portfast bpduguard default'. It would
err-disable the uplink trunks Te1/1/1 and Te1/1/2 as soon as DSW1 and DSW2 send
BPDUs. Configure 'spanning-tree bpduguard enable' on each access port instead."`,
    options: [
      "Correct: global BPDU guard applies to every switchport, including trunks",
      "Correct, but only Te1/1/1 is affected, because DSW1 is the root bridge",
      "Wrong: BPDU guard only puts ports into the root-inconsistent state, so the uplinks would keep forwarding",
      "Wrong: global BPDU guard covers only PortFast edge ports, and the trunk uplinks are not edge ports",
    ],
    answer: [3],
    explanation: "`spanning-tree portfast bpduguard default` enables BPDU guard only on ports that are operating as PortFast edge ports. `spanning-tree portfast default` makes access ports edge ports but never trunks, so the uplinks keep running normal STP and are not touched. The global command is a safe and common way to protect every host port; the per-port alternative works too, but it is not required, and the reason the assistant gave is wrong. Root position has nothing to do with BPDU guard. BPDU guard err-disables a port; root-inconsistent is root guard's state.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-113',
    topic: '2.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. SW2 has two parallel 1-Gbps links to root bridge SW1: SW2 Gi1/0/1 to SW1 Gi1/0/1, and SW2 Gi1/0/2 to SW1 Gi1/0/2. To make Gi1/0/2 the root port, the engineer lowered its port priority on SW2, but nothing changed. Which change would make SW2 Gi1/0/2 the root port?",
    exhibit: `SW2# show running-config interface GigabitEthernet1/0/2
interface GigabitEthernet1/0/2
 switchport mode trunk
 spanning-tree port-priority 64
end

SW2# show spanning-tree vlan 10 | begin Interface
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p
Gi1/0/2             Altn BLK 4         64.2     P2p`,
    options: [
      "Configure `spanning-tree port-priority 64` on SW1 Gi1/0/2 instead",
      "Configure `spanning-tree port-priority 192` on SW2 Gi1/0/2, because a higher port priority is preferred",
      "Configure `spanning-tree cost 2` on SW2 Gi1/0/1",
      "Shut and re-enable SW2 Gi1/0/2 so the new port priority takes effect",
    ],
    answer: [0],
    explanation: "Both links have the same root path cost (4) and the same sender bridge ID (SW1), so SW2 breaks the tie with the sender port ID — the priority and number of SW1's port carried in the BPDU. SW2's own port ID would be compared only if the sender port IDs also tied, which they don't (128.1 vs 128.2). Setting priority 64 on SW1 Gi1/0/2 makes it advertise 64.2, which beats 128.1, so SW2 Gi1/0/2 becomes the root port. (Lowering the cost on SW2 Gi1/0/2 would also work.) Lower priority values win, not higher. Lowering the cost of Gi1/0/1 makes it even more preferred. The new priority already shows as 64.2, so it has taken effect; it just isn't a value that SW2's own root port selection uses.",
    lesson: '2.5-rapid-pvst',
  },
  {
    id: 'd2-114',
    topic: '2.5',
    type: 'order',
    difficulty: 2,
    stem: "Gi1/0/5 has `spanning-tree portfast` and `spanning-tree bpduguard enable`, and the switch has `errdisable recovery cause bpduguard` with the default recovery interval. A user connects a switch that sends BPDUs and leaves it connected. Put the events in order, from first to last.",
    items: [
      "The link comes up and Gi1/0/5 starts forwarding immediately as an edge port",
      "A BPDU from the user's switch arrives on Gi1/0/5",
      "BPDU guard puts Gi1/0/5 into the err-disabled state",
      "The 300-second errdisable recovery interval expires",
      "The switch re-enables Gi1/0/5, and it is err-disabled again when the next BPDU arrives",
    ],
    explanation: "PortFast lets the port forward at link-up. The first BPDU triggers BPDU guard, which err-disables the port. With `errdisable recovery cause bpduguard` configured, the switch re-enables the port after the recovery interval (300 seconds by default). Because the offending switch is still attached, the next BPDU err-disables it again, so the port cycles until the device is removed. Without the recovery command, the port would stay err-disabled until an administrator entered `shutdown`/`no shutdown`.",
    lesson: '2.5-stp-protection',
  },
  {
    id: 'd2-115',
    topic: '2.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. ASW7 is an older access switch in a wiring closet. The design calls for DSW1 to be the root bridge, but nobody has configured spanning-tree priorities on any switch. Why is ASW7 the root, and what is the best fix?",
    exhibit: `ASW7# show spanning-tree vlan 1

VLAN0001
  Spanning tree enabled protocol rstp
  Root ID    Priority    32769
             Address     0019.e7a4.1b00
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32769  (priority 32768 sys-id-ext 1)
             Address     0019.e7a4.1b00
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Desg FWD 4         128.25   P2p
Gi0/2               Desg FWD 4         128.26   P2p`,
    options: [
      "ASW7's uplinks have the lowest cost, so it wins; raise their cost with `spanning-tree cost`",
      "ASW7 was powered on first and keeps the root role; reload ASW7 to trigger a new election",
      "Every switch ties on priority, so the lowest MAC wins; run `spanning-tree vlan 1 root primary` on DSW1",
      "ASW7 runs a different STP mode and ignores the distribution switches' BPDUs; configure root guard on ASW7's uplinks",
    ],
    answer: [2],
    explanation: "With every switch at the default 32768 (32769 in VLAN 1), the lowest MAC address breaks the tie, and older hardware often has the lowest MAC. Lowering DSW1's priority (root primary, or an explicit value such as 24576) makes it win, ideally with DSW2 set as root secondary and the same done for every VLAN. Port cost decides root ports, not which bridge is root. Election is not based on boot order; reloading ASW7 would only cause an outage, and it would win again. The output shows RSTP, and root guard on ASW7's uplinks would block the legitimate root's BPDUs once DSW1 is fixed.",
    lesson: '2.5-rapid-pvst',
  },
];
