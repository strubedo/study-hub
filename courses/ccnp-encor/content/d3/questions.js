// Domain 3 — Infrastructure. Original questions modelled on Cisco's public exam-topic wording; no recalled exam content. One array for the whole domain: each topic's writer appends a block under its own heading comment, and ids are assigned in array order (d3-001 onward).
// 3.1: IEEE facts checked against 802.1D/802.1Q path-cost tables, 802.1s and 802.1AX summaries; IOS XE keywords against the IOS XE 17.18.1 YANG models; output layouts modelled on real IOS XE output in Cisco's genieparser test files. All device output and log messages are documentation-based and listed in REVIEW-TODO.md for checking on lab gear.
const L31T = '3.1-trunking';
const L31E = '3.1-etherchannel';
const L31S = '3.1-stp-fundamentals';
const L31R = '3.1-rstp';
const L31M = '3.1-mst';
const L31G = '3.1-stp-enhancements';
// 3.2: RFC 7868 (EIGRP), 2328 (OSPFv2), 5340 (OSPFv3), 3101 (NSSA), 7166 and 4271 (BGP-4); IOS XE keywords and defaults against the IOS XE 17.18.1 YANG models; output layouts modelled on genieparser captures. Device output is documentation-based: see REVIEW-TODO.md.
const L32C = '3.2-eigrp-ospf-compared';
const L32P = '3.2-paths-ad-areas';
const L32N = '3.2-ospfv2-neighbors';
const L32M = '3.2-ospf-multiarea';
const L32V = '3.2-ospfv3';
const L32E = '3.2-ebgp';
const L32B = '3.2-bgp-bestpath';
const L32R = '3.2-pbr';
// 3.3: RFC 5905, 2281, 9568/5798, 3022, 1112, 2236, 3376/9776, 5771, 7761, 4607, 5015, 3618; IEEE 1588 summary; IOS XE 17.18.1 YANG models; output layouts modelled on genieparser captures. Every number (reach bits, virtual and multicast MACs, master-down intervals, tracked priorities) recomputed offline. Device output is documentation-based: see REVIEW-TODO.md.
const L33N = '3.3-ntp';
const L33P = '3.3-ptp';
const L33T = '3.3-nat';
const L33H = '3.3-hsrp';
const L33V = '3.3-vrrp';
const L33I = '3.3-multicast-igmp';
const L33M = '3.3-pim';

const bank = [
  // 3.1 Layer 2
  // ---------- 3.1.a 802.1Q trunking ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31T,
    stem: 'Refer to the exhibit. SW1 and SW2 are new Catalyst 9300 switches connected on Gi1/0/24 with default interface settings. Hosts in VLAN 20 on SW1 cannot reach hosts in VLAN 20 on SW2. The link must be negotiated with DTP. Which change makes the link a trunk?',
    exhibit: `SW1# show interfaces GigabitEthernet1/0/24 switchport
Name: Gi1/0/24
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)

SW2# show interfaces GigabitEthernet1/0/24 switchport
Name: Gi1/0/24
Switchport: Enabled
Administrative Mode: dynamic auto
Operational Mode: static access
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: native
Negotiation of Trunking: On
Access Mode VLAN: 1 (default)
Trunking Native Mode VLAN: 1 (default)

SW1# show interfaces trunk

SW1#`,
    options: ['Configure switchport mode dynamic desirable on Gi1/0/24 of either switch', 'Configure switchport nonegotiate on Gi1/0/24 of both switches', 'Configure switchport trunk allowed vlan add 20 on Gi1/0/24 of both switches', 'Configure switchport trunk native vlan 20 on Gi1/0/24 of both switches'],
    answer: [0],
    explanation: "Both ports are in the Catalyst 9000 default, dynamic auto: each answers DTP but neither asks for a trunk, so both settle on static access and `show interfaces trunk` lists nothing. Making one side dynamic desirable (it actively requests a trunk) gives desirable + auto = trunk while keeping DTP. `switchport nonegotiate` turns DTP off, which is the opposite of the requirement, and IOS rejects it on a dynamic port. The allowed VLAN list and the native VLAN only apply once the port is a trunk, so neither changes the operational mode." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31T,
    stem: 'Refer to the exhibit. SW2 is in VTP transparent mode. Frames for VLAN 30 arriving on Po1 are dropped by SW2. Enter the global configuration command on SW2 that fixes the problem.',
    exhibit: `SW2# show interfaces trunk

Port        Mode             Encapsulation  Status        Native vlan
Po1         on               802.1q         trunking      1

Port        Vlans allowed on trunk
Po1         10,20,30

Port        Vlans allowed and active in management domain
Po1         10,20

Port        Vlans in spanning tree forwarding state and not pruned
Po1         10,20

SW2# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi1/0/3, Gi1/0/4, Gi1/0/5
10   USERS                            active    Gi1/0/6, Gi1/0/7
20   VOICE                            active    Gi1/0/8
1002 fddi-default                     act/unsup
1003 token-ring-default               act/unsup
1004 fddinet-default                  act/unsup
1005 trnet-default                    act/unsup`,
    answer: ['vlan 30'],
    explanation: "VLAN 30 is in the allowed list but missing from \"allowed and active in management domain\", and `show vlan brief` confirms it does not exist on SW2. A switch drops frames for VLANs it does not have. In VTP transparent mode SW2 does not learn VLANs from VTP, so create it locally with `vlan 30` (optionally followed by `name ...`). Adding it to the allowed list would change nothing, because it is already allowed." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31T,
    stem: 'Refer to the exhibit. At 22:05 an engineer added the new camera VLAN 40 to the trunk toward the distribution switch. At 22:06 every user in VLANs 10 and 20 behind SW1 lost connectivity. What is the cause?',
    exhibit: `Change record CHG-0412 (SW1), executed 22:05:
  interface Port-channel1
   switchport trunk allowed vlan 40

SW1# show running-config interface Port-channel1
interface Port-channel1
 switchport trunk native vlan 99
 switchport trunk allowed vlan 40
 switchport mode trunk
 switchport nonegotiate
end`,
    options: ['The command replaced the allowed list with VLAN 40 only; it should have been switchport trunk allowed vlan add 40', 'VLAN 40 must be created before it can be added to a trunk, so the trunk went down', 'switchport nonegotiate stopped DTP from adding VLANs 10 and 20 back automatically', 'Native VLAN 99 is not in the allowed list, so the whole trunk stops forwarding'],
    answer: [0],
    explanation: "`switchport trunk allowed vlan 40` without a keyword sets the list to exactly VLAN 40, removing 10, 20 and 99. `switchport trunk allowed vlan add 40` appends instead. A VLAN can be allowed before it exists; it simply is not active. DTP negotiates the trunking mode, never the allowed list. Leaving the native VLAN out of the allowed list only stops native VLAN traffic, not the whole trunk; here it is a side effect of the same mistake." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31T,
    stem: 'Refer to the exhibit. Which action resolves the problem on the link between SW1 and SW2?',
    exhibit: `SW1#
%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet1/0/24 (99), with SW2 GigabitEthernet1/0/24 (1).
%SPANTREE-2-RECV_PVID_ERR: Received BPDU with inconsistent peer vlan id 1 on GigabitEthernet1/0/24 VLAN99.
%SPANTREE-2-BLOCK_PVID_PEER: Blocking GigabitEthernet1/0/24 on VLAN0001. Inconsistent peer vlan.
%SPANTREE-2-BLOCK_PVID_LOCAL: Blocking GigabitEthernet1/0/24 on VLAN0099. Inconsistent local vlan.

SW1# show spanning-tree vlan 99 | begin Interface
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Desg FWD 4         128.1    P2p Edge
Gi1/0/24            Desg BKN*4         128.24   P2p *PVID_Inc`,
    options: ['Configure the same native VLAN on both ends of the trunk, for example switchport trunk native vlan 99 on SW2 Gi1/0/24', 'Enter shutdown and then no shutdown on SW1 Gi1/0/24 to clear the err-disabled state', 'Disable CDP on Gi1/0/24 on both switches so that the mismatch is no longer detected', 'Enable spanning-tree portfast trunk on SW1 Gi1/0/24 so that the port forwards immediately'],
    answer: [0],
    explanation: "SW1 uses native VLAN 99 and SW2 native VLAN 1. CDP reports it, and because PVST+/Rapid PVST+ BPDUs carry the sending VLAN, spanning tree blocks the port for both VLANs (`BKN*`, `*PVID_Inc`). Matching the native VLAN removes the inconsistency and the port unblocks by itself. The port is blocked by STP, not err-disabled, so a bounce does nothing. Disabling CDP hides the symptom while VLANs 1 and 99 stay merged or blocked. PortFast does not override an inconsistency block and must not be used on a switch-to-switch trunk." },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L31T,
    stem: 'Match each trunk symptom to its most likely cause.',
    pairs: [
      ['Both ends show "Administrative Mode: dynamic auto" and "Operational Mode: static access"', 'Neither side initiates DTP negotiation'],
      ['CDP logs NATIVE_VLAN_MISMATCH and the port shows *PVID_Inc in show spanning-tree', 'Different native VLANs at the two ends'],
      ['VLAN 30 is in "Vlans allowed on trunk" but missing from "Vlans allowed and active in management domain"', 'VLAN 30 does not exist in the local VLAN database'],
      ['VLAN 30 is allowed and active but missing from "forwarding state and not pruned", while show spanning-tree vlan 30 shows the port designated forwarding', 'VTP pruning removed VLAN 30 from the trunk'],
      ['SW1 is switchport mode trunk with switchport nonegotiate; SW2 is dynamic desirable and stays access', 'One side sends no DTP frames'],
      ['Two switches in dynamic desirable mode never trunk and log a DTP domain mismatch message', 'Different VTP domain names'],
    ],
    explanation: "auto + auto never trunks because neither side asks. A native VLAN mismatch is reported by CDP and by PVST+ (port VLAN ID inconsistency). The \"allowed and active\" section only lists VLANs that exist locally. A VLAN that is active, not blocked by STP, yet missing from the last section has been pruned by VTP. `nonegotiate` stops DTP, so a dynamic peer never hears a trunk request and stays access. DTP frames carry the VTP domain name, and different names stop dynamic negotiation." },
  { topic: '3.1', type: 'multi', difficulty: 1, lesson: L31T,
    stem: 'Which two statements about DTP on Catalyst 9000 switches are true? (Choose two.)',
    options: ['Switchports default to dynamic auto, so two new switches cabled together do not form a trunk without configuration', 'switchport nonegotiate stops the port from sending DTP frames', 'A dynamic desirable port facing a dynamic auto port becomes an access port', 'DTP is defined in IEEE 802.1Q, so it also negotiates trunks with other vendors\' switches', 'A port in switchport mode trunk becomes a trunk only if the peer answers its DTP frames'],
    answer: [0, 1],
    explanation: "The default dynamic auto mode only answers DTP, so auto + auto stays access. `switchport nonegotiate` (on a trunk or access port) disables DTP, which is why the peer must be statically configured. desirable + auto forms a trunk. DTP is Cisco proprietary; 802.1Q defines only the tag. `switchport mode trunk` trunks unconditionally, whatever the peer says." },

  // ---------- 3.1.b EtherChannel ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31E,
    stem: 'Refer to the exhibit. Gi1/0/1 and Gi1/0/2 on SW1 are cabled to Gi1/0/1 and Gi1/0/2 on SW2, and both switches are configured the same way on both ports. Why is Po1 down?',
    exhibit: `SW1# show etherchannel summary
<legend omitted>
Number of channel-groups in use: 1
Number of aggregators:           1

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SD)         LACP      Gi1/0/1(I)      Gi1/0/2(I)

SW1# show running-config interface GigabitEthernet1/0/1
interface GigabitEthernet1/0/1
 switchport mode trunk
 channel-group 1 mode passive
end

SW2# show running-config interface GigabitEthernet1/0/1
interface GigabitEthernet1/0/1
 switchport mode trunk
 channel-group 1 mode passive
end`,
    options: ['Both ends are LACP passive, so neither sends LACPDUs to start negotiation', 'LACP cannot bundle ports that are configured as trunks', 'The channel-group number must be different on each switch', 'LACP requires lacp rate fast on at least one end before it bundles'],
    answer: [0],
    explanation: "A passive LACP port only responds to LACPDUs. With passive on both ends nobody starts, no partner is found, and the members stay stand-alone `(I)` while Po1 is `SD` (Layer 2, down); on a release where `port-channel standalone-disable` is in effect they would show suspended `(s)` instead, with the same cause. Set at least one side to `active`. Trunk ports bundle normally. The channel-group number is locally significant and may differ between switches. The LACP rate only changes how often LACPDUs are sent; slow is the default and works." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31E,
    stem: 'Refer to the exhibit. SW2 Gi1/0/10 and Gi1/0/11 connect to SW1 Gi1/0/10 and Gi1/0/11 and have no channel-group configured yet. The engineer must bundle them with SW1 so that SW2 never starts the negotiation itself but responds to SW1. Enter the keyword that completes the command channel-group 5 mode ____ on SW2.',
    exhibit: `SW1# show running-config | section interface GigabitEthernet1/0/1[01]
interface GigabitEthernet1/0/10
 switchport mode trunk
 channel-group 5 mode desirable
interface GigabitEthernet1/0/11
 switchport mode trunk
 channel-group 5 mode desirable

SW1# show etherchannel 5 summary
<legend omitted>
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
5      Po5(SD)         PAgP      Gi1/0/10(I)     Gi1/0/11(I)`,
    answer: ['auto'],
    explanation: "SW1 runs PAgP (`desirable`, and the summary shows the PAgP protocol). The PAgP mode that responds but never initiates is `auto`; desirable + auto bundles. `passive` is the LACP equivalent and never talks to PAgP, and `on` uses no protocol, so neither would bundle with a desirable port." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31E,
    stem: 'Refer to the exhibit. Po2 runs with only one active member. Which change brings Gi1/0/4 into the bundle?',
    exhibit: `DSW1# show etherchannel 2 summary
<legend omitted>
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
2      Po2(SU)         LACP      Gi1/0/3(P)      Gi1/0/4(s)

DSW1#
%EC-5-CANNOT_BUNDLE2: Gi1/0/4 is not compatible with Gi1/0/3 and will be suspended (native vlan of Gi1/0/4 is 1, Gi1/0/3 is 99)

DSW1# show running-config interface GigabitEthernet1/0/4
interface GigabitEthernet1/0/4
 switchport trunk allowed vlan 10,20,99
 switchport mode trunk
 channel-group 2 mode active
end`,
    options: ['Configure switchport trunk native vlan 99 on Gi1/0/4', 'Change Gi1/0/4 to channel-group 2 mode passive', 'Configure lacp port-priority 1 on Gi1/0/4', 'Enter shutdown and then no shutdown on Port-channel2'],
    answer: [0],
    explanation: "The `(s)` flag and the log show that Gi1/0/4 is suspended because its native VLAN (1, the default) differs from Gi1/0/3's (99). Members must match native and allowed VLANs, so set the native VLAN on Gi1/0/4 (configuring settings on the port channel interface keeps members consistent in future). The LACP mode is not the problem: active works with the partner, as Gi1/0/3 shows. Port priority only chooses active versus hot-standby members. Bouncing the port channel does not fix a configuration mismatch." },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31E,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `DSW1# show etherchannel 10 summary
<legend omitted>
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
10     Po10(SU)        LACP      Te1/0/1(P)      Te1/0/2(P)
                                 Te1/0/3(P)      Te1/0/4(P)
                                 Te1/0/5(H)      Te1/0/6(H)

DSW1# show running-config interface Port-channel10
interface Port-channel10
 switchport mode trunk
 lacp max-bundle 4
end`,
    options: ['Te1/0/5 and Te1/0/6 carry no data traffic now but are activated if a bundled member fails', 'Removing lacp max-bundle 4 allows all six members to be bundled at the same time', 'The H flag means Te1/0/5 and Te1/0/6 negotiated half duplex', 'The partner switch must also be configured with lacp max-bundle 4, or Po10 cannot come up', 'Te1/0/5 and Te1/0/6 are suspended because their configuration does not match the other members'],
    answer: [0, 1],
    explanation: "`(H)` is LACP hot standby: `lacp max-bundle 4` limits the active members to four, and the standby ports replace a failed member. Without the limit LACP bundles up to eight active members, so all six would be `(P)`. H has nothing to do with duplex. Po10 is already up (`SU`) with four bundled members and only DSW1's configuration shown, so the partner does not need the same command: a link is only bundled when both ends agree to aggregate it, so a limit on either end is enough. A suspended port would show `(s)`, not `(H)`." },
  { topic: '3.1', type: 'order', difficulty: 2, lesson: L31E,
    stem: 'TenGigabitEthernet1/1/1 and 1/1/2 on DSW1 are default Layer 2 switchports with no channel configuration. The engineer must build Layer 3 LACP port channel 10 with address 10.0.12.1/30 and verify it. Using each command once, put the commands in the order that works.',
    items: ['interface range TenGigabitEthernet1/1/1 - 2', 'no switchport', 'channel-group 10 mode active', 'interface Port-channel10', 'ip address 10.0.12.1 255.255.255.252', 'show etherchannel 10 summary'],
    explanation: "The members must become routed ports (`no switchport`) before `channel-group`, so that the port channel the switch creates automatically is also a Layer 3 interface. Then configure the address on `interface Port-channel10`, never on the members. If Port-channel10 were created first it would be a Layer 2 interface and `ip address` would be rejected without its own `no switchport`. Verify last: `show etherchannel 10 summary` should show `Po10(RU)` with both members `(P)`." },
  { topic: '3.1', type: 'fill', difficulty: 3, lesson: L31E,
    stem: 'Refer to the exhibit. How many seconds apart does SW1 send LACPDUs on Gi1/0/1? Enter a number.',
    exhibit: `SW1# show lacp neighbor
Flags:  S - Device is requesting Slow LACPDUs
        F - Device is requesting Fast LACPDUs
        A - Device is in Active mode       P - Device is in Passive mode

Channel group 1 neighbors

                  LACP port                        Admin  Oper   Port    Port
Port      Flags   Priority  Dev ID          Age    key    Key    Number  State
Gi1/0/1   FA      32768     aabb.cc00.0200   0s    0x0    0x1    0x101   0x3F
Gi1/0/2   FA      32768     aabb.cc00.0200   0s    0x0    0x1    0x102   0x3F`,
    answer: ['1', '1 second', '1 seconds', 'one'],
    explanation: "The neighbor flags are `FA`: the partner is active and requests fast LACPDUs (it has `lacp rate fast`). In LACP each side transmits at the rate its partner requests, so SW1 sends every 1 second on Gi1/0/1 and the partner times SW1 out after 3 seconds. How often the partner sends to SW1 depends on SW1's own `lacp rate` setting, which is not shown; the default slow rate would be 30 seconds with a 90-second timeout." },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L31E,
    stem: 'Refer to the exhibit. Shortly after Gi1/0/5 and Gi1/0/6 were cabled between SW1 and SW2, both ports on SW1 went down. What is the cause and the correct fix?',
    exhibit: `SW1# show running-config interface GigabitEthernet1/0/5
interface GigabitEthernet1/0/5
 switchport mode trunk
 channel-group 3 mode on
end
! Gi1/0/6 is configured identically

SW2# show running-config interface GigabitEthernet1/0/5
interface GigabitEthernet1/0/5
 switchport mode trunk
end
! Gi1/0/6 is configured identically

SW1#
%PM-4-ERR_DISABLE: channel-misconfig (STP) error detected on Po3, putting Gi1/0/5 in err-disable state
%PM-4-ERR_DISABLE: channel-misconfig (STP) error detected on Po3, putting Gi1/0/6 in err-disable state`,
    options: ['SW1 bundles the links statically while SW2 treats them as separate ports; configure a matching channel group on SW2 (preferably LACP active on both switches), then shut and no shut Po3 on SW1', 'SW2 needs channel-group 3 mode passive, because a static channel only bundles with a passive LACP partner', 'Spanning tree cannot run on port channels, so disable it in the trunk VLANs on SW1', 'Trunk ports cannot form a static EtherChannel; change both ports on SW1 to access ports'],
    answer: [0],
    explanation: "With `mode on` SW1 forwards over Po3 as one link, but SW2 has no channel, so it runs spanning tree on each port separately and SW1 receives BPDUs on its channel from two different ports (with different source MAC addresses). EtherChannel misconfig guard (on by default) detects this potential loop and err-disables the members with reason `channel-misconfig`. Configure the channel on SW2 too (LACP active on both sides avoids the problem altogether), then recover the err-disabled ports. `on` never negotiates, so it does not bundle with a passive LACP port. Spanning tree runs normally on port channels, treating them as one port, and trunks bundle normally." },
  { topic: '3.1', type: 'multi', difficulty: 1, lesson: L31E,
    stem: 'Which two settings must match on all member ports for an EtherChannel to bundle them? (Choose two.)',
    options: ['Speed and duplex', 'Native VLAN and allowed VLAN list on trunk members', 'Spanning-tree port cost', 'LACP port priority', 'Interface description'],
    answer: [0, 1],
    explanation: "Members must agree on speed and duplex and on the Layer 2 configuration: switchport mode, access VLAN, or native and allowed VLANs on trunks. A port that differs is suspended. Different spanning-tree port costs do not prevent bundling. LACP port priority is meant to differ between ports: it chooses active and hot-standby members. The description is cosmetic." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31E,
    stem: 'Refer to the exhibit. Every night a backup server at 10.10.5.20 copies data to a storage array at 10.20.8.40 over dozens of parallel TCP sessions, and all of them leave SW1 on Te1/0/1 of a four-member Po1. Which change spreads the sessions across the members?',
    exhibit: `SW1# show etherchannel load-balance
EtherChannel Load-Balancing Configuration:
        src-dst-ip

EtherChannel Load-Balancing Addresses Used Per-Protocol:
Non-IP: Source XOR Destination MAC address
  IPv4: Source XOR Destination IP address
  IPv6: Source XOR Destination IP address

SW1# show interfaces TenGigabitEthernet1/0/1 | include output rate
  5 minute output rate 8912000000 bits/sec, 742000 packets/sec
SW1# show interfaces TenGigabitEthernet1/0/2 | include output rate
  5 minute output rate 104000000 bits/sec, 9100 packets/sec`,
    options: ['port-channel load-balance src-dst-mixed-ip-port', 'port-channel load-balance src-dst-mac', 'lacp max-bundle 8 on Port-channel1', 'lacp rate fast on every member port'],
    answer: [0],
    explanation: "With `src-dst-ip` every packet between the same two IP addresses hashes to the same member, so all backup sessions share Te1/0/1. Adding Layer 4 ports to the hash (`src-dst-mixed-ip-port`) gives each TCP session a different hash input, so sessions spread (each single session still stays on one link). `src-dst-mac` is no better: the source and destination MAC pair is just as constant. Max-bundle limits active members and does not change hashing. The LACP rate only affects LACPDU timing." },

  // ---------- 3.1.c Spanning tree fundamentals ----------
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31S,
    stem: 'Refer to the exhibit. All three switches run Rapid PVST+ and are connected in a triangle. Which switch is the root bridge for VLAN 10? Enter its hostname.',
    exhibit: `DSW1# show spanning-tree vlan 10
<Root ID section omitted>
  Bridge ID  Priority    24586  (priority 24576 sys-id-ext 10)
             Address     aabb.cc00.0300
<interface table omitted>

DSW2# show spanning-tree vlan 10
<Root ID section omitted>
  Bridge ID  Priority    24586  (priority 24576 sys-id-ext 10)
             Address     aabb.cc00.0200
<interface table omitted>

ASW1# show spanning-tree vlan 10
<Root ID section omitted>
  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     aabb.cc00.0100
<interface table omitted>`,
    answer: ['DSW2'],
    explanation: "The lowest bridge ID wins: priority first, then MAC address. DSW1 and DSW2 tie on priority 24586 (24576 plus the extended system ID 10), so the lower MAC, aabb.cc00.0200, makes DSW2 the root. ASW1 has the lowest MAC of all, but the MAC is only compared when priorities are equal, and its priority 32778 is higher." },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L31S,
    stem: 'Refer to the exhibit. The engineer configures spanning-tree vlan 10 cost 1 on ASW1 Gi1/0/2. Which port is ASW1\'s root port for VLAN 10 afterwards, and what is its root path cost?',
    exhibit: `Topology (VLAN 10, Rapid PVST+, pathcost method short, all costs default unless stated)

  DSW1 (root) Te1/1/1 -------- 10 Gb/s -------- Te1/1/1 DSW2
  DSW1 Gi1/0/10 ----- 1 Gb/s ----- Gi1/0/1 ASW1
  DSW2 Gi1/0/10 ----- 1 Gb/s ----- Gi1/0/2 ASW1`,
    options: ['Gi1/0/2, with a root path cost of 3', 'Gi1/0/1, with a root path cost of 4', 'Gi1/0/2, with a root path cost of 1', 'Gi1/0/1, because a port connected directly to the root bridge is always preferred'],
    answer: [0],
    explanation: "Root path cost is the cost advertised by the upstream switch plus the receiving port's cost. Before the change: via Gi1/0/1 = 0 + 4 = 4; via Gi1/0/2 = 2 (DSW2's 10 Gb/s path to the root) + 4 = 6, so Gi1/0/1 was root port with cost 4. After the change, Gi1/0/2 costs 2 + 1 = 3, which beats 4, so Gi1/0/2 becomes root port with cost 3. A cost of 1 ignores DSW2's own cost to the root. STP has no rule favouring direct links; only the total cost and the tie-breakers count." },
  { topic: '3.1', type: 'order', difficulty: 2, lesson: L31S,
    stem: 'ASW1 receives BPDUs for VLAN 10 on several ports. Put the criteria ASW1 uses to choose its root port in order, from the first compared to the last.',
    items: ['Lowest root path cost (the advertised cost plus the receiving port\'s cost)', 'Lowest sender bridge ID', 'Lowest sender port priority', 'Lowest sender port number'],
    explanation: "The root port is the port with the best path to the root: lowest total root path cost first. On a tie, the BPDU from the neighbour with the lowest bridge ID wins, then the lowest sender port ID, which is compared as port priority first and port number second. The sender's port ID, not the receiving port's, breaks the last ties, which is why you change port priority on the upstream switch to steer a downstream switch's choice between two parallel links." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31S,
    stem: 'Refer to the exhibit. DSW1 must become the root bridge for VLAN 30. Which command achieves this?',
    exhibit: `DSW1# show spanning-tree vlan 30

VLAN0030
  Spanning tree enabled protocol rstp
  Root ID    Priority    24606
             Address     aabb.cc00.0500
             Cost        4
             Port        1 (GigabitEthernet1/0/1)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32798  (priority 32768 sys-id-ext 30)
             Address     aabb.cc00.0600
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec
<interface table omitted>`,
    options: ['spanning-tree vlan 30 priority 20480', 'spanning-tree vlan 30 priority 24576', 'spanning-tree vlan 30 priority 24000', 'spanning-tree vlan 30 root secondary'],
    answer: [0],
    explanation: "The current root advertises 24606, that is priority 24576 plus VLAN 30. 20480 (a multiple of 4096) gives DSW1 20510, which wins. 24576 would tie on priority, and the tie goes to the lower MAC, the current root's aabb.cc00.0500, so DSW1 would still lose. 24000 is rejected because priorities must be multiples of 4096. `root secondary` sets 28672, which is worse than the current root." },

  // ---------- 3.1.c RSTP ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31R,
    stem: 'Refer to the exhibit. The link on ASW1 Gi1/0/1 fails (loss of signal). What happens next on ASW1 for VLAN 20?',
    exhibit: `ASW1# show spanning-tree vlan 20

VLAN0020
  Spanning tree enabled protocol rstp
  Root ID    Priority    24596
             Address     aabb.cc00.0100
             Cost        4
             Port        1 (GigabitEthernet1/0/1)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32788  (priority 32768 sys-id-ext 20)
             Address     aabb.cc00.0300
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p
Gi1/0/2             Altn BLK 4         128.2    P2p
Gi1/0/15            Desg FWD 19        128.15   P2p Edge`,
    options: ['Gi1/0/2 becomes the root port and moves to forwarding immediately, without listening or learning', 'Gi1/0/2 goes through listening and learning and forwards after 30 seconds', 'ASW1 waits for max age (20 seconds) before it starts using Gi1/0/2', 'ASW1 becomes the root bridge for VLAN 20 because it lost its root port'],
    answer: [0],
    explanation: "The protocol is rstp (Rapid PVST+), and Gi1/0/2 is an alternate port: a pre-computed backup path to the root. When the root port fails, RSTP promotes the alternate port to root port and puts it straight into forwarding. Listening and learning for 2 x 15 s is 802.1D behaviour, and waiting for max age applies to 802.1D indirect failures. ASW1 still hears the root's BPDUs on Gi1/0/2, so it does not claim the root role." },
  { topic: '3.1', type: 'order', difficulty: 3, lesson: L31R,
    stem: 'A point-to-point link between DSW1 (closer to the root) and ASW1 comes up. Both switches run Rapid PVST+. Put the steps of the RSTP proposal and agreement exchange in order.',
    items: ['DSW1 sends a BPDU with the proposal flag set on its designated discarding port', 'ASW1 selects the port that received the superior proposal as its root port', 'ASW1 moves its non-edge designated ports to discarding (sync)', 'ASW1 sends a BPDU with the agreement flag on its root port', 'DSW1 moves its designated port to forwarding', 'ASW1 sends proposals on its own designated ports toward the next switch'],
    explanation: "The upstream designated port proposes. ASW1 recognises the better information and makes that port its root port, then syncs: it blocks its non-edge designated ports so that opening the new path cannot create a loop (edge ports stay forwarding). Only then does it agree, and the agreement lets DSW1 forward immediately instead of waiting two forward delays. The handshake then repeats on ASW1's downstream links, rippling outward one hop at a time." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31R,
    stem: 'Refer to the exhibit. Gi1/0/3 on ASW1 connects to downstream switch ASW5, which also runs Rapid PVST+. Every time this link flaps, users behind ASW5 lose connectivity for about 30 seconds, while failures on other links recover in about a second. What is the cause?',
    exhibit: `ASW1# show spanning-tree vlan 10 | begin Interface
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p
Gi1/0/3             Desg LRN 19        128.3    Shr

ASW1# show interfaces GigabitEthernet1/0/3 | include duplex
  Half-duplex, 100Mb/s, media type is 10/100/1000BaseTX`,
    options: ['The port runs half duplex, so RSTP treats the link as shared and falls back to timer-based transitions instead of proposal and agreement', 'Gi1/0/3 is missing spanning-tree portfast, which every RSTP designated port needs for fast transitions', 'ASW5 runs 802.1D, so RSTP must fall back to the 802.1D timers on this port', 'Root guard on Gi1/0/3 holds the port in learning until ASW5 stops sending BPDUs'],
    answer: [0],
    explanation: "The Type column shows `Shr`: RSTP derives the link type from duplex, and half duplex means shared. The proposal and agreement handshake only runs on point-to-point links, so this designated port goes discarding, learning, forwarding on forward-delay timers (2 x 15 s). Fix the duplex mismatch or misconfiguration (or set `spanning-tree link-type point-to-point` if the link really is point-to-point). PortFast belongs on host ports, not switch links. A legacy 802.1D neighbour would show `Peer(STP)`. Root guard would show `BKN*` with `*ROOT_Inc`." },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31R,
    stem: 'Which two statements describe topology change handling in RSTP? (Choose two.)',
    options: ['Only a non-edge port moving to the forwarding state generates a topology change', 'A switch that receives a BPDU with the TC flag flushes MAC addresses learned on all its ports except the port it received the BPDU on', 'The detecting switch sends a TCN BPDU toward the root and waits for an acknowledgement before the change is propagated', 'A port that goes down generates a topology change that is flooded to every switch in the VLAN', 'An edge port generates a topology change every time it comes up'],
    answer: [0, 1],
    explanation: "In RSTP only a non-edge port transitioning to forwarding is a topology change; the detecting switch itself sends TC BPDUs (for twice the hello time) and every receiver flushes MACs on its other ports and propagates the TC. The TCN-to-root-and-acknowledge sequence is 802.1D. A port going down flushes its own entries locally but is not flooded as a topology change. Edge (PortFast) ports never generate topology changes, which is why host ports should be edge ports." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31R,
    stem: 'Refer to the exhibit. Users in VLAN 20 report short bursts of flooding and poor performance throughout the day. Enter the interface command for Gi1/0/22 that stops this port from generating topology changes while spanning tree keeps running on it.',
    exhibit: `ASW1# show spanning-tree vlan 20 detail | include opology|from
  Topology change flag set, detected flag set
  Number of topology changes 388 last change occurred 00:00:09 ago
          from GigabitEthernet1/0/22

ASW1# show running-config interface GigabitEthernet1/0/22
interface GigabitEthernet1/0/22
 description Conference room PC
 switchport access vlan 20
 switchport mode access
end`,
    answer: ['spanning-tree portfast', 'spanning-tree portfast edge'],
    explanation: "388 topology changes, the latest from Gi1/0/22: a host port without PortFast generates a topology change every time the PC reboots or sleeps, and each one makes every switch in VLAN 20 flush MAC addresses, so unicast is flooded until the tables relearn. `spanning-tree portfast` (shown as `portfast edge` on some releases) makes it an edge port: it forwards at once and never generates topology changes, but it still runs spanning tree and loses edge status if a BPDU arrives. Adding BPDU guard as well is good practice." },

  // ---------- 3.1.c MST ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31M,
    stem: 'Refer to the exhibit. After a maintenance window, ASW1 no longer uses DSW2 as the root for VLANs 20–29, and its uplinks show as boundary ports. What is the cause?',
    exhibit: `DSW1# show spanning-tree mst configuration
Name      [CAMPUS]
Revision  2     Instances configured 3

Instance  Vlans mapped
--------  ---------------------------------------------------------------------
0         1-9,30-4094
1         10-19
2         20-29
-------------------------------------------------------------------------------

ASW1# show spanning-tree mst configuration
Name      [CAMPUS]
Revision  1     Instances configured 3

Instance  Vlans mapped
--------  ---------------------------------------------------------------------
0         1-9,30-4094
1         10-19
2         20-29
-------------------------------------------------------------------------------`,
    options: ['The revision numbers differ, so ASW1 is in a different MST region and instance 2 does not extend across the boundary', 'Instance 0 carries too many VLANs, so instance 2 cannot be elected on ASW1', 'The region name must be in lowercase to match the configuration digest', 'MST max hops was exceeded because instance 2 has its own root on DSW2'],
    answer: [0],
    explanation: "Two switches are in the same region only if name, revision and VLAN-to-instance mapping all match. Here the mappings and names match but DSW1 has revision 2 and ASW1 revision 1, so ASW1 forms its own region. MSTIs never cross a region boundary; only the CIST does, so the boundary port follows one CIST role for all VLANs and instance 2 no longer follows DSW2. Set the same revision on every switch. Instance 0 always carries unmapped VLANs; that is normal. The name is case sensitive but only has to match, and it does. Max hops (20 by default) is not an issue in a three-switch campus." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31M,
    stem: 'Refer to the exhibit. VLAN 50 will be created next week on every switch in the region, with no change to the MST configuration. Which MST instance will carry VLAN 50? Enter the instance number.',
    exhibit: `DSW1# show spanning-tree mst configuration
Name      [CORE]
Revision  4     Instances configured 3

Instance  Vlans mapped
--------  ---------------------------------------------------------------------
0         1-9,21-29,60-4094
1         10-20
2         30-59
-------------------------------------------------------------------------------`,
    answer: ['2', 'MST2', 'instance 2', 'MSTI 2'],
    explanation: "VLAN 50 falls in the range 30–59 that is already mapped to instance 2. The mapping does not depend on whether the VLAN exists, which is why mapping planned VLANs in advance is good practice: creating VLAN 50 does not change the configuration digest and does not split the region. Only VLANs not mapped elsewhere (here 1–9, 21–29 and 60–4094) fall into instance 0, the IST." },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L31M,
    stem: 'Refer to the exhibit. DSW1, in the same MST region as DSW2, is the CIST root with priority 24576. SW9, connected to DSW2 Gi1/0/24, is an older switch that runs Rapid PVST+. Which change resolves the blocked port while keeping the root inside the MST region?',
    exhibit: `DSW2#
%SPANTREE-2-PVSTSIM_FAIL: Blocking designated port Gi1/0/24: Inconsistent superior PVST BPDU received on VLAN 30, claiming root 4126:aabb.cc00.0900

DSW2# show spanning-tree mst 0 | begin Interface
Interface        Role Sts Cost      Prio.Nbr Type
---------------- ---- --- --------- -------- --------------------------------
Te1/1/1          Root FWD 2000      128.49   P2p
Gi1/0/24         Desg BKN*20000     128.24   P2p Bound(PVST) *PVST_Inc

SW9# show running-config | include spanning-tree
spanning-tree mode rapid-pvst
spanning-tree extend system-id
spanning-tree vlan 30 priority 4096`,
    options: ['Remove spanning-tree vlan 30 priority 4096 from SW9 so that its VLAN 30 BPDUs are inferior to the CIST root', 'Configure spanning-tree mst 1 priority 0 on DSW2 so that the MST region wins VLAN 30', 'Configure spanning-tree bpdufilter enable on DSW2 Gi1/0/24 so that the PVST BPDUs are ignored', 'Enter shutdown and then no shutdown on DSW2 Gi1/0/24 to clear the err-disabled state'],
    answer: [0],
    explanation: "With the CIST root inside the region, PVST simulation requires every PVST+ BPDU received on the boundary to be inferior to the CIST root, in every VLAN. SW9 claims root for VLAN 30 with 4126 (4096 + 30), which is superior to 24576, so DSW2 blocks the boundary port as PVST simulation inconsistent. Returning SW9 to the default priority (or any value worse than the CIST root) fixes it, and the port recovers by itself. MSTI priorities are invisible at a boundary, where only the CIST is used. BPDU filter would disable loop protection on the port. The port is blocked by STP, not err-disabled." },

  // ---------- 3.1.c Spanning-tree enhancements ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31G,
    stem: 'Refer to the exhibit. A user connected a small unmanaged switch with spanning tree to Gi1/0/15, then removed it after IT called and reconnected the PC directly. Ten minutes later the port is still down. What should the engineer do?',
    exhibit: `ASW1#
%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port GigabitEthernet1/0/15 with BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Gi1/0/15, putting Gi1/0/15 in err-disable state

ASW1# show interfaces status err-disabled

Port         Name               Status       Reason               Err-disabled Vlans
Gi1/0/15     Desk 3-14          err-disabled bpduguard

ASW1# show errdisable recovery | include bpduguard|interval
bpduguard                    Disabled
Timer interval: 300 seconds`,
    options: ['Enter shutdown and then no shutdown on Gi1/0/15', 'Wait for the 300-second recovery timer to re-enable the port', 'Remove spanning-tree bpduguard enable from Gi1/0/15 so that the port comes back up', 'Configure spanning-tree bpdufilter enable on Gi1/0/15 so that the BPDU is forgotten'],
    answer: [0],
    explanation: "BPDU guard err-disabled the port. Automatic recovery for the bpduguard cause is Disabled, so the 300-second timer does not apply to it, and the port stays down until it is bounced manually. With the switch gone, `shutdown` then `no shutdown` restores it. Removing BPDU guard does not re-enable an err-disabled port and would remove the protection. BPDU filter does not recover the port either, and on an interface it would disable spanning tree there." },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L31G,
    stem: 'Match each requirement to the spanning-tree feature that meets it.',
    pairs: [
      ['A user port must shut down immediately if anyone connects a switch to it', 'BPDU guard'],
      ['Distribution ports facing the access layer must block if they start receiving BPDUs that claim a better root bridge', 'Root guard'],
      ['Hosts must be able to send traffic as soon as their link comes up, and their reboots must not flush MAC tables', 'PortFast'],
      ['A fibre uplink whose transmit strand is cut must be shut down at the link level even though the link stays up', 'UDLD aggressive mode'],
      ['An alternate port that stops receiving BPDUs because of a fault on the upstream switch must not move to forwarding', 'Loop guard'],
      ['A port toward a service provider must neither send nor process BPDUs, by design', 'BPDU filter on the interface'],
    ],
    explanation: "BPDU guard err-disables a port on any BPDU. Root guard puts a port root-inconsistent when it receives a superior BPDU. PortFast makes a port an edge port: immediate forwarding and no topology changes. UDLD detects one-way links at Layer 2 and aggressive mode err-disables the port even when messages simply stop. Loop guard blocks a root or alternate port whose BPDUs stop instead of letting it become designated. The interface form of BPDU filter stops sending and ignores received BPDUs, which isolates the two spanning-tree domains (and removes loop protection on that port)." },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L31G,
    stem: 'Refer to the exhibit. A lab bench switch connected to Gi1/0/30 was also cabled to another access port by mistake, and a broadcast storm hit VLAN 40. Why did BPDU guard not shut down Gi1/0/30?',
    exhibit: `ASW1# show running-config interface GigabitEthernet1/0/30
interface GigabitEthernet1/0/30
 description Lab bench
 switchport access vlan 40
 switchport mode access
 spanning-tree portfast
 spanning-tree bpdufilter enable
 spanning-tree bpduguard enable
end

ASW1#
%SW_MATM-4-MACFLAP_NOTIF: Host aabb.cc00.4401 in vlan 40 is flapping between port Gi1/0/30 and port Gi1/0/1`,
    options: ['Interface-level BPDU filter ignores received BPDUs, so BPDU guard never sees one and spanning tree cannot block the loop', 'BPDU guard only works when it is enabled globally with spanning-tree portfast bpduguard default', 'PortFast disables BPDU guard on access ports', 'BPDU guard acts only on superior BPDUs, and the bench switch sent inferior ones'],
    answer: [0],
    explanation: "`spanning-tree bpdufilter enable` on an interface stops the port sending BPDUs and makes it ignore the BPDUs it receives, which effectively disables spanning tree on the port. When both are configured, filtering wins and BPDU guard never triggers. Remove the filter and keep BPDU guard. The interface form of BPDU guard works on any port; the global form is the one restricted to PortFast ports. PortFast and BPDU guard are designed to be used together. BPDU guard reacts to any BPDU; reacting to superior BPDUs is root guard." },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31G,
    stem: 'Refer to the exhibit. Policy requires ports shut down by BPDU guard to recover automatically, on the same interval that UDLD ports already use. Enter the global configuration command that implements this.',
    exhibit: `ASW1# show errdisable recovery
ErrDisable Reason            Timer Status
-----------------            --------------
arp-inspection               Disabled
bpduguard                    Disabled
channel-misconfig (STP)      Disabled
dhcp-rate-limit              Disabled
dtp-flap                     Disabled
link-flap                    Disabled
psecure-violation            Disabled
udld                         Enabled
<output omitted>

Timer interval: 300 seconds

Interfaces that will be enabled at the next timeout:

Interface      Errdisable reason      Time left(sec)
---------    ---------------------    --------------
  Te1/1/1                 udld          212

ASW1# show interfaces status err-disabled

Port         Name               Status       Reason               Err-disabled Vlans
Gi1/0/15     Desk 3-14          err-disabled bpduguard
Te1/1/1      Uplink DSW2        err-disabled udld`,
    answer: ['errdisable recovery cause bpduguard'],
    explanation: "Automatic recovery is enabled per cause: udld is Enabled, bpduguard is Disabled. `errdisable recovery cause bpduguard` enables it; the interval (300 seconds here, the default) is global with `errdisable recovery interval`, so the two causes share it. Gi1/0/15 will then come back after the next timeout, and err-disable again if a switch is still connected." },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31G,
    stem: 'Which two statements about UDLD are true? (Choose two.)',
    options: ['In aggressive mode, a port is err-disabled when UDLD messages stop arriving on a link that is still up and contact cannot be re-established', 'The global udld enable command applies only to fibre ports; copper ports must be enabled per interface', 'UDLD is defined in IEEE 802.1AX and runs inside LACPDUs', 'In normal mode, a port is err-disabled whenever UDLD messages stop arriving', 'UDLD needs to be enabled on only one end of a link'],
    answer: [0, 1],
    explanation: "Aggressive mode treats loss of UDLD messages on an up link as a failure and err-disables the port after trying to re-establish contact. The global `udld enable` and `udld aggressive` commands cover fibre ports only; use the interface command on copper. UDLD is a Cisco protocol, unrelated to LACP. Normal mode acts only when it positively detects a one-way or miswired link; if messages just stop, it marks the port undetermined. Both ends must run UDLD, because each relies on the other's echoes." },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31G,
    stem: 'Refer to the exhibit. Which statement explains the state of Gi1/0/2 on ASW1?',
    exhibit: `ASW1#
%SPANTREE-2-LOOPGUARD_BLOCK: Loop guard blocking port GigabitEthernet1/0/2 on VLAN0020.

ASW1# show spanning-tree inconsistentports

Name                 Interface                      Inconsistency
-------------------- ------------------------------ ------------------
VLAN0020             GigabitEthernet1/0/2           Loop Inconsistent

Number of inconsistent ports (segments) in the system : 1`,
    options: ['Gi1/0/2 stopped receiving BPDUs in VLAN 20 while its link stayed up; without loop guard it would have become designated and forwarding, and it unblocks automatically when BPDUs return', 'Gi1/0/2 is err-disabled and must be recovered with shutdown and no shutdown', 'Gi1/0/2 received a superior BPDU from a switch that tried to become the root bridge', 'Gi1/0/2 is a PortFast port that received a BPDU and lost its edge status'],
    answer: [0],
    explanation: "Loop guard watches root and alternate ports. When such a port stops receiving BPDUs, normal STP would age out the information and make it designated forwarding, which closes a loop if the cause is a one-way link or an upstream fault. Loop guard puts it into the loop-inconsistent (blocking) state for that VLAN instead and releases it as soon as BPDUs arrive again. It is a blocking state, not err-disable. A superior BPDU triggers root guard (Root Inconsistent). A PortFast port that receives a BPDU simply becomes a normal spanning-tree port." },

  // 3.2 Layer 3
  // ---------- 3.2.a EIGRP and OSPF compared ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32C,
    stem: 'Refer to the exhibit. Which statement about R1\'s paths to 10.60.0.0/24 is true?',
    exhibit: `R1# show ip eigrp topology all-links
EIGRP-IPv4 Topology Table for AS(100)/ID(10.255.0.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.60.0.0/24, 1 successors, FD is 156160, serno 87
        via 10.0.13.3 (156160/155904), GigabitEthernet0/0/2
        via 10.0.12.2 (181760/130816), GigabitEthernet0/0/1
        via 10.0.14.4 (156416/156160), GigabitEthernet0/0/3`,
    options: ['10.0.12.2 is a feasible successor because its reported distance (130816) is lower than the feasible distance (156160)', '10.0.14.4 is a feasible successor because its total metric (156416) is the second lowest', '10.0.12.2 cannot be a feasible successor because its total metric is higher than the feasible distance', 'If 10.0.13.3 fails, R1 must send queries before it can use any other path'],
    answer: [0],
    explanation: "Each `via` line reads (total metric / reported distance). The feasibility condition compares a neighbor's **reported distance** with the FD (156160): 10.0.12.2 reports 130816, which is lower, so it is a loop-free feasible successor whatever its total metric. 10.0.14.4 reports 156160, equal to the FD and therefore not lower, so it fails the condition even though its total is second best; plain `show ip eigrp topology` would not list it at all. Because a feasible successor exists, losing 10.0.13.3 makes R1 switch to 10.0.12.2 locally, with no queries." },
  { topic: '3.2', type: 'fill', difficulty: 3, lesson: L32C,
    stem: 'Refer to the exhibit. R1 reaches 10.50.0.0/24, which is on R5\'s Gi0/0/0, only through R2: R1 Gi0/0/1 to R2, then R2 Gi0/0/2 to R5. All three routers run classic-mode EIGRP AS 100 with default K values, and the interface values shown are in effect. Enter the feasible distance R1 computes for 10.50.0.0/24.',
    exhibit: `R1# show interfaces GigabitEthernet0/0/1 | include BW
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,

R2# show interfaces GigabitEthernet0/0/2 | include BW
  MTU 1500 bytes, BW 20000 Kbit/sec, DLY 1000 usec,

R5# show interfaces GigabitEthernet0/0/0 | include BW
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,`,
    answer: ['154112'],
    explanation: "With K1 = K3 = 1 and the other K values 0, metric = 256 x (10^7 / minimum bandwidth in kbps + sum of delays in tens of microseconds). The slowest outgoing interface on the path is R2's at 20,000 kbps: 10,000,000 / 20,000 = 500. The delays of the three outgoing interfaces (R1 Gi0/0/1, R2 Gi0/0/2 and R5's LAN interface) are 10 + 1000 + 10 = 1020 µs = 102 tens of microseconds. 256 x (500 + 102) = 256 x 602 = **154112**." },
  { topic: '3.2', type: 'fill', difficulty: 3, lesson: L32P,
    stem: 'Refer to the exhibit. The engineer wants R1 to load-share traffic to 10.90.0.0/24 over every path EIGRP allows. Enter the lowest variance value that achieves this.',
    exhibit: `R1# show ip eigrp topology all-links
EIGRP-IPv4 Topology Table for AS(100)/ID(10.255.0.1)
Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply,
       r - reply Status, s - sia Status

P 10.90.0.0/24, 1 successors, FD is 28672, serno 211
        via 10.0.12.2 (28672/28416), GigabitEthernet0/0/1
        via 10.0.13.3 (130816/28160), GigabitEthernet0/0/2
        via 10.0.14.4 (29184/28928), GigabitEthernet0/0/3`,
    answer: ['5', 'variance 5'],
    explanation: "Unequal-cost load balancing uses only **feasible successors**. 10.0.13.3 reports 28160, below the FD of 28672, so it qualifies; 10.0.14.4 reports 28928, above the FD, so it is never installed at any variance, even though its total is close to the successor's. 10.0.13.3's metric must be below variance x FD: 130816 / 28672 = 4.56, so variance 4 (114688) is too small and **5** (143360) is the lowest value that installs it alongside the successor." },
  { topic: '3.2', type: 'multi', difficulty: 1, lesson: L32C,
    stem: 'Which two statements about EIGRP and OSPF are true? (Choose two.)',
    options: ['EIGRP packets use IP protocol 88 and are multicast to 224.0.0.10', 'On a broadcast network, a DROTHER sends its link-state updates to 224.0.0.6, the address the DR and BDR listen on', 'OSPF runs over TCP port 89', 'EIGRP sends its full routing table to its neighbors every 30 seconds', 'OSPF supports unequal-cost load balancing with the variance command', 'EIGRP internal routes have an administrative distance of 110'],
    answer: [0, 1],
    explanation: "EIGRP is IP protocol 88 with multicast 224.0.0.10 (RFC 7868). On broadcast networks OSPF DROTHERs send updates to AllDRouters 224.0.0.6 and the DR refloods them to AllSPFRouters 224.0.0.5 (RFC 2328). OSPF is IP protocol 89 directly over IP, not TCP. EIGRP sends partial, bounded updates only when something changes. Unequal-cost load balancing with `variance` exists only in EIGRP. EIGRP internal routes have AD 90; 110 is OSPF." },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32P,
    stem: 'Match each OSPF area requirement to the area type that meets it.',
    pairs: [
      ['A branch area with one ABR and no redistribution must hold only its own intra-area routes plus a single default route', 'Totally stubby area'],
      ['A branch area must learn every inter-area prefix but none of the external routes redistributed at headquarters', 'Stub area'],
      ['A branch router redistributes a partner subnet; the area must keep every inter-area prefix but not receive headquarters external routes', 'NSSA'],
      ['A branch router redistributes a partner subnet; the area should hold only intra-area routes, its own external routes and a default route', 'Totally NSSA'],
      ['The data-center area must receive every LSA type, including the external routes from the Internet edge', 'Normal area'],
    ],
    explanation: "Stub areas block type 4 and 5 LSAs and receive a default route; totally stubby (`area N stub no-summary` on the ABR) also replaces the type 3 LSAs with a single default. A stub area cannot contain an ASBR, so an area that redistributes needs an NSSA, whose local ASBR originates type 7 LSAs; NSSA keeps the type 3 LSAs, and totally NSSA (`area N nssa no-summary`) reduces them to a default. A normal area accepts everything." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32P,
    stem: 'Refer to the exhibit. R1 also learns 10.20.0.0/16 from EIGRP AS 100 as an external route redistributed by another router. The engineer wants R1 to install the EIGRP route for 10.20.0.0/16. Which change achieves this?',
    exhibit: `R1# show ip route 10.20.0.0
Routing entry for 10.20.0.0/16
  Known via "ospf 1", distance 110, metric 3, type inter area
  Last update from 10.0.12.2 on GigabitEthernet0/0/1, 00:15:02 ago
  Routing Descriptor Blocks:
  * 10.0.12.2, from 10.255.0.2, 00:15:02 ago, via GigabitEthernet0/0/1
      Route metric is 3, traffic share count is 1

R1# show ip eigrp topology | include 10.20.0.0
P 10.20.0.0/16, 1 successors, FD is 2816, tag is 300

R1# show ip protocols | include Distance
  Distance: (default is 110)
  Distance: internal 90 external 170`,
    options: ['Configure distance eigrp 90 100 under router eigrp 100', 'Raise the bandwidth on R1\'s EIGRP interface so the EIGRP metric becomes lower than the OSPF metric', 'Configure distance ospf external 180 under router ospf 1', 'Configure variance 2 under router eigrp 100'],
    answer: [0],
    explanation: "For the same prefix and length, the router installs the source with the lower administrative distance and never compares metrics across protocols. OSPF (110) beats EIGRP external (170, shown in `show ip protocols`). `distance eigrp 90 100` sets EIGRP external routes to 100, below OSPF's 110, so the EIGRP route is installed and the OSPF route becomes the backup. Changing the EIGRP metric does nothing against a lower AD. The OSPF route is inter-area, not external, so raising the OSPF external distance does not affect it. `variance` only shares load among EIGRP feasible successors." },
  { topic: '3.2', type: 'fill', difficulty: 3, lesson: L32C,
    stem: 'Refer to the exhibit. All routers are in OSPF area 0 and use the same auto-cost setting as R1. Links: R1 Te0/1/0 to R2 (10 Gbps); R2 Gi0/0/1 to R3 (1 Gbps, no cost configured); R1 Gi0/0/0 to R3 (1 Gbps); R3 Gi0/0/2 is the 1 Gbps LAN 10.9.9.0/24. What metric does R1 show for 10.9.9.0/24 in its routing table? Enter a number.',
    exhibit: `R1# show running-config | section router ospf
router ospf 1
 router-id 10.255.0.1
 auto-cost reference-bandwidth 10000
 network 10.0.0.0 0.255.255.255 area 0

R1# show interfaces | include ^[A-Z]|BW
TenGigabitEthernet0/1/0 is up, line protocol is up
  MTU 1500 bytes, BW 10000000 Kbit/sec, DLY 10 usec,
GigabitEthernet0/0/0 is up, line protocol is up
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,

R1# show running-config interface GigabitEthernet0/0/0
interface GigabitEthernet0/0/0
 description to R3
 ip address 10.0.13.1 255.255.255.252
 ip ospf cost 15`,
    answer: ['21'],
    explanation: "With a 10,000 Mbps reference, cost = 10,000 / interface Mbps: 10 Gbps = 1, 1 Gbps = 10. The metric is the sum of outgoing interface costs including the destination LAN's interface on R3. Via R2: R1 Te0/1/0 (1) + R2 Gi0/0/1 (10) + R3 Gi0/0/2 (10) = **21**. Direct: R1 Gi0/0/0 has `ip ospf cost 15` instead of the calculated 10, so 15 + 10 = 25. OSPF installs the lower total, 21, via R2. The auto-cost setting matters: with the default 100 Mbps reference every calculated cost here would be 1, giving 3 via R2 against 15 + 1 = 16 direct, so the metric shown would be 3, not 21." },

  // ---------- 3.2.b OSPFv2 neighbors and network types ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32N,
    stem: 'Refer to the exhibit. The adjacency between R1 and R2 has been in this state for several minutes. What is the cause?',
    exhibit: `R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
10.255.0.2        1   EXSTART/DR      00:00:37    10.0.12.2       GigabitEthernet0/0/1

R1# show ip interface GigabitEthernet0/0/1 | include MTU
  MTU is 1400 bytes

R2# show ip interface GigabitEthernet0/0/1 | include MTU
  MTU is 1500 bytes`,
    options: ['The IP MTUs differ: R1 rejects R2\'s database description packets, which advertise a 1500-byte MTU, so the exchange never completes', 'The hello and dead intervals differ, so the routers cannot agree on the DR', 'The routers have the same router ID, so master and slave cannot be chosen', 'R1 has priority 0 and cannot complete an adjacency with the DR'],
    answer: [0],
    explanation: "Database description packets carry the sender's interface MTU, and RFC 2328 rejects a DBD that advertises a larger MTU than the receiving interface can accept. R1 (1400) therefore discards R2's DBDs and the neighbor stays in EXSTART (the other side typically shows EXCHANGE). Make `ip mtu` match on both ends; `ip ospf mtu-ignore` is only a workaround. A hello or dead mismatch would stop the neighbor appearing at all, long before EXSTART. The router IDs are different (R1's own RID is not 10.255.0.2). A priority-0 router still forms full adjacencies with the DR; it just cannot become DR." },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32N,
    stem: 'Match each OSPF symptom to its most likely cause.',
    pairs: [
      ['show ip ospf neighbor is empty on both routers; show ip ospf interface shows "Hello 10, Dead 40" on R1 and "Hello 5, Dead 20" on R2', 'Hello and dead interval mismatch'],
      ['The neighbor stays in EXSTART or EXCHANGE', 'IP MTU mismatch'],
      ['R1 lists R2 in INIT state, while R2 does not list R1 at all', 'R1\'s hellos are not reaching R2, for example an inbound ACL on R2 dropping OSPF'],
      ['R1 logs a duplicate router ID message for a neighbor on Gi0/0/1', 'Two routers have the same router ID'],
      ['Hellos arrive in both directions but no neighbor forms; R2 has area 1 stub configured and R1 does not', 'Stub area flag mismatch'],
      ['On a shared Ethernet segment, R3 and R4 show each other as 2WAY/DROTHER and FULL with R1 and R2', 'Normal operation between two DROTHERs'],
    ],
    explanation: "Hello and dead intervals, area ID, mask and the stub flag are checked in every hello; a mismatch drops the hello, so no neighbor appears. MTU is checked in DBD packets, after the neighbor is already 2-Way, so the adjacency stalls in EXSTART/EXCHANGE. INIT means R1 hears R2 but its own RID is not in R2's hellos, so R2 is not receiving R1. Duplicate RIDs are logged. DROTHERs deliberately stop at 2-Way with each other and go Full only with the DR and BDR." },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32N,
    stem: 'R1 and R2 are connected by a new point-to-point link with matching OSPF settings. Put the OSPF neighbor states R1 moves through for R2 in order.',
    items: ['Down: no hello has been received from R2', 'Init: R2\'s hello has arrived but does not list R1\'s router ID', '2-Way: R2\'s hello lists R1\'s router ID', 'ExStart: master and slave and the initial DBD sequence number are negotiated', 'Exchange: database description packets summarize each LSDB', 'Loading: link-state requests are answered with link-state updates', 'Full: the databases are synchronized'],
    explanation: "RFC 2328's neighbor state machine: Down, Init (one-way), 2-Way (bidirectional; DR election happens here on multiaccess networks), ExStart (the higher router ID becomes master), Exchange (DBDs), Loading (LSRs and LSUs for missing or newer LSAs) and Full. Attempt exists only for manually configured NBMA neighbors." },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32N,
    stem: 'Refer to the exhibit. R1, R2, R3 and R4 connect to the same VLAN on Gi0/0/0 with the default broadcast network type, and their OSPF processes start at the same moment. Which router becomes the DR? Enter its hostname.',
    exhibit: `R1# show running-config | include hostname|ip ospf priority|router-id
hostname R1
 ip ospf priority 100
 router-id 10.255.0.1

R2# show running-config | include hostname|ip ospf priority|router-id
hostname R2
 ip ospf priority 0
 router-id 10.255.0.200

R3# show running-config | include hostname|ip ospf priority|router-id
hostname R3
 ip ospf priority 100
 router-id 10.255.0.3

R4# show running-config | include hostname|ip ospf priority|router-id
hostname R4
 ip ospf priority 100
 router-id 10.255.0.12`,
    answer: ['R4'],
    explanation: "Priority is compared first: R2 has priority 0 and can never be DR or BDR, despite having the highest router ID. R1, R3 and R4 tie at 100, so the highest router ID wins, compared as a 32-bit number: 10.255.0.12 is higher than 10.255.0.3 (12 > 3 in the last octet). R4 becomes DR and R3 BDR. The election is not preemptive, which is why the stem says all processes start together." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32N,
    stem: 'Refer to the exhibit. R1 has just been reloaded with this configuration. Which OSPF router ID does it use?',
    exhibit: `R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   192.168.50.1    YES manual up                    up
GigabitEthernet0/0/1   10.0.12.1       YES manual up                    up
Loopback0              10.255.0.1      YES manual up                    up
Loopback1              10.255.0.7      YES manual up                    up
Loopback2              10.255.0.9      YES manual administratively down down

R1# show running-config | section router ospf
router ospf 1
 network 10.0.12.0 0.0.0.3 area 0
 network 10.255.0.1 0.0.0.0 area 0`,
    options: ['10.255.0.7', '10.255.0.9', '192.168.50.1', '10.255.0.1'],
    answer: [0],
    explanation: "With no `router-id` command, IOS takes the highest IPv4 address on a loopback interface that is up, whether or not OSPF runs on it: Loopback1, 10.255.0.7. Loopback2 has a higher address but is administratively down. A physical interface address (192.168.50.1, the highest overall) is used only if no loopback is up. Loopback0 is in OSPF but has a lower address. Configure `router-id` to avoid surprises like this." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32N,
    stem: 'Refer to the exhibit. Gi0/0/1 is a /30 Ethernet link between R1 and R2 with no other devices. The engineer wants OSPF to skip the DR/BDR election and the type 2 LSA on this link. Which change achieves this?',
    exhibit: `R1# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Lo0          1     0               10.255.0.1/32      1     LOOP  0/0
Gi0/0/1      1     0               10.0.12.1/30       1     BDR   1/1

R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
10.255.0.2        1   FULL/DR         00:00:34    10.0.12.2       GigabitEthernet0/0/1`,
    options: ['Configure ip ospf network point-to-point on Gi0/0/1 of both R1 and R2', 'Configure ip ospf priority 0 on Gi0/0/1 of both R1 and R2', 'Configure ip ospf network point-to-point on R1 Gi0/0/1 only', 'Configure passive-interface GigabitEthernet0/0/1 on both routers'],
    answer: [0],
    explanation: "Ethernet defaults to the broadcast network type, so R1 is BDR and R2 DR. The point-to-point type on both ends removes the election and the type 2 LSA; the neighbor then shows `FULL/  -` and the interface `P2P`. With priority 0 on both, no router can become DR and the neighbors stop at 2-Way, so no routes are exchanged. Changing only one end leaves a broadcast/point-to-point mismatch: the timers match so the adjacency can come up, but the two routers describe the link differently and routes across it fail. A passive interface sends no hellos, so the adjacency is lost." },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32N,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `DSW1# show running-config | section router ospf
router ospf 1
 router-id 10.255.0.11
 passive-interface default
 no passive-interface GigabitEthernet1/0/49
 network 10.0.0.0 0.255.255.255 area 0

DSW1# show ip interface brief | exclude unassigned
Interface              IP-Address      OK? Method Status                Protocol
Vlan10                 10.10.10.1      YES manual up                    up
Vlan20                 10.10.20.1      YES manual up                    up
GigabitEthernet1/0/49  10.0.11.2       YES manual up                    up
GigabitEthernet1/0/50  10.0.12.2       YES manual up                    up
Loopback0              10.255.0.11     YES manual up                    up`,
    options: ['DSW1 can form an OSPF adjacency on Gi1/0/49 but not on Gi1/0/50', 'The VLAN 10 and VLAN 20 subnets are advertised to DSW1\'s OSPF neighbor', 'The VLAN 10 and VLAN 20 subnets are not advertised because passive interfaces are excluded from OSPF', 'DSW1 sends hellos on VLAN 10 and VLAN 20 but ignores any replies', 'Loopback0 is not advertised because it is passive'],
    answer: [0, 1],
    explanation: "`passive-interface default` makes every interface passive, and only Gi1/0/49 is reopened, so the second uplink Gi1/0/50 sends no hellos and forms no adjacency (probably an oversight). Passive interfaces are still in OSPF: the `network` statement matches all five addresses, so the SVI and loopback subnets are advertised in DSW1's router LSA. Passive means no hellos are sent at all, not that replies are ignored." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32N,
    stem: 'Refer to the exhibit. R3\'s Gi0/0/1 (10.0.23.6/30) is in OSPF area 1. R2 has no OSPF neighbor on Gi0/0/2, and Gi0/0/2 is missing from show ip ospf interface brief on R2. Which command on R2 fixes the problem?',
    exhibit: `R2# show running-config | section interface GigabitEthernet0/0/2|router ospf
interface GigabitEthernet0/0/2
 ip address 10.0.23.5 255.255.255.252
router ospf 10
 router-id 10.255.0.2
 network 10.0.12.0 0.0.0.3 area 0
 network 10.0.23.0 0.0.0.3 area 1`,
    options: ['ip ospf 10 area 1 under interface GigabitEthernet0/0/2', 'network 10.0.23.4 0.0.0.3 area 0 under router ospf 10', 'no passive-interface GigabitEthernet0/0/2 under router ospf 10', 'ip ospf network point-to-point under interface GigabitEthernet0/0/2'],
    answer: [0],
    explanation: "`network 10.0.23.0 0.0.0.3` matches only addresses 10.0.23.0 to 10.0.23.3; Gi0/0/2 is 10.0.23.5, in 10.0.23.4/30, so OSPF is not enabled on it. `ip ospf 10 area 1` enables it explicitly in the right process and area (the process ID is local, but it must be R2's process, 10). A network statement for area 0 would match the interface but put it in the wrong area, so R3's area 1 hellos would be rejected. The interface is not passive, and the network type is irrelevant when OSPF is not running on the interface." },

  // ---------- 3.2.b multi-area OSPFv2, summarization and filtering ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32M,
    stem: 'Refer to the exhibit. R7 is an internal router in area 2. Which statement is true?',
    exhibit: `R7# show ip route ospf | begin Gateway
Gateway of last resort is 10.0.27.2 to network 0.0.0.0

O*E2  0.0.0.0/0 [110/1] via 10.0.27.2, 02:10:31, GigabitEthernet0/0/0
      10.0.0.0/8 is variably subnetted, 8 subnets, 5 masks
O        10.2.8.0/24 [110/2] via 10.0.78.8, 00:52:19, GigabitEthernet0/0/1
O IA     10.1.0.0/22 [110/3] via 10.0.27.2, 02:10:31, GigabitEthernet0/0/0
O E1     10.98.0.0/16 [110/23] via 10.0.27.2, 00:05:44, GigabitEthernet0/0/0
O E2     10.99.0.0/16 [110/20] via 10.0.27.2, 00:05:44, GigabitEthernet0/0/0`,
    options: ['The metric of 10.98.0.0/16 includes R7\'s internal cost to the ASBR, while the metric of 10.99.0.0/16 is only the external metric set at redistribution', '10.1.0.0/22 is a network inside area 2', '10.99.0.0/16 was redistributed by an ASBR inside an NSSA', 'If another ASBR advertised 10.98.0.0/16 as E2 with metric 5, R7 would prefer that route because its metric is lower'],
    answer: [0],
    explanation: "An E1 route's metric is the seed metric plus the internal cost to the ASBR (here 20 + 3 = 23 if the seed was the default 20); an E2 route keeps the seed metric (default 20) everywhere in the domain. `O IA` marks an inter-area route learned from a type 3 LSA, so 10.1.0.0/22 is outside area 2 (it looks like an ABR summary). NSSA externals appear as `O N1` / `O N2`. OSPF prefers E1 over E2 for the same prefix regardless of metric." },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32M,
    stem: 'Refer to the exhibit. R2 is the ABR between area 0 and area 1. Enter the command, under router ospf 1 on R2, that advertises one route into area 0 covering exactly the four networks shown instead of the four individual routes.',
    exhibit: `R2# show ip route ospf | include 10.1.
O        10.1.0.0/24 [110/2] via 10.0.25.5, 01:01:10, GigabitEthernet0/0/2
O        10.1.1.0/24 [110/2] via 10.0.25.5, 01:01:10, GigabitEthernet0/0/2
O        10.1.2.0/24 [110/2] via 10.0.25.5, 01:01:10, GigabitEthernet0/0/2
O        10.1.3.0/24 [110/2] via 10.0.25.5, 01:01:10, GigabitEthernet0/0/2

R2# show running-config | section router ospf
router ospf 1
 router-id 10.255.0.2
 network 10.0.12.0 0.0.0.3 area 0
 network 10.0.25.0 0.0.0.3 area 1`,
    answer: ['area 1 range 10.1.0.0 255.255.252.0', 'area 1 range 10.1.0.0 255.255.252.0 advertise'],
    explanation: "The routes are intra-area (`O`) routes of area 1, learned through Gi0/0/2, which the second network statement puts in area 1. Inter-area summarization is done on the ABR with `area AREA range ADDRESS MASK`, naming the area the components live in: 10.1.0.0/22 (mask 255.255.252.0) covers 10.1.0.0 to 10.1.3.255, exactly these four /24s. `summary-address` would be wrong: it summarizes external routes on an ASBR." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32M,
    stem: 'Refer to the exhibit. R2 is the ABR for area 1 and summarizes it as 10.1.0.0/22. A packet for 10.1.3.20 arrives at R2 from area 0. What does R2 do with it?',
    exhibit: `R2# show ip route 10.1.0.0 255.255.252.0 longer-prefixes | begin Gateway
Gateway of last resort is 10.0.12.1 to network 0.0.0.0

      10.0.0.0/8 is variably subnetted, 9 subnets, 4 masks
O        10.1.0.0/22 is a summary, 00:04:51, Null0
O        10.1.0.0/24 [110/2] via 10.0.25.5, 01:06:02, GigabitEthernet0/0/2
O        10.1.1.0/24 [110/2] via 10.0.25.5, 01:06:02, GigabitEthernet0/0/2
O        10.1.2.0/24 [110/2] via 10.0.25.5, 01:06:02, GigabitEthernet0/0/2`,
    options: ['Drops it, because the longest match is the summary\'s discard route to Null0', 'Forwards it to 10.0.25.5, because the /22 summary was learned from area 1', 'Forwards it along the default route to 10.0.12.1', 'Floods it to every OSPF neighbor in area 1'],
    answer: [0],
    explanation: "When `area 1 range` is active, the ABR installs the summary pointing to Null0. 10.1.3.20 matches no /24 here, so the longest match is the /22 discard route and the packet is dropped. Without it, the default route would send the packet back toward the core, which would return it to R2 because of the summary, looping until the TTL expires. The summary was created locally, not learned from area 1, and routers never flood unicast data packets." },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32M,
    stem: 'Refer to the exhibit. R6 is an internal router in area 2, and R3 is area 2\'s only ABR. The OSPF domain has about 40 inter-area prefixes and an ASBR in area 0 that redistributes external routes. Which area type is area 2?',
    exhibit: `R6# show ip ospf database

            OSPF Router with ID (10.255.0.6) (Process ID 1)

                Router Link States (Area 2)

Link ID         ADV Router      Age         Seq#       Checksum Link count
10.255.0.3      10.255.0.3      1210        0x80000011 0x003A71 2
10.255.0.6      10.255.0.6      1187        0x8000000E 0x00C52D 3

                Summary Net Link States (Area 2)

Link ID         ADV Router      Age         Seq#       Checksum
0.0.0.0         10.255.0.3      1210        0x80000002 0x0077A8`,
    options: ['Totally stubby', 'Stub', 'NSSA', 'Normal'],
    answer: [0],
    explanation: "Area 2 holds only type 1 LSAs and a single type 3 LSA for 0.0.0.0 from the ABR. No type 5 (or type 4) LSAs despite an ASBR in the domain rules out a normal area. A stub area would also carry the ~40 inter-area type 3 LSAs, and an NSSA keeps all type 3 LSAs too (and does not get a type 3 default automatically). Only `area 2 stub no-summary` on the ABR (totally stubby) leaves just the default. A totally NSSA area without a local ASBR would look the same, so on a real device confirm with `show ip ospf`, which names the area type." },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32M,
    stem: 'Refer to the exhibit. R5 and R6 are internal routers in area 1, and R6 reaches the rest of the network through R5. The engineer wanted to stop area 1 from using 10.77.0.0/16. Why does R6 still have the route?',
    exhibit: `R5# show running-config | section router ospf|prefix-list
router ospf 1
 router-id 10.255.0.5
 network 10.0.0.0 0.255.255.255 area 1
 distribute-list prefix BLOCK-LAB in
ip prefix-list BLOCK-LAB seq 5 deny 10.77.0.0/16
ip prefix-list BLOCK-LAB seq 10 permit 0.0.0.0/0 le 32

R5# show ip route 10.77.0.0
% Network not in table

R5# show ip ospf database summary 10.77.0.0 | include Link State ID|Advertising
  Link State ID: 10.77.0.0 (summary Network Number)
  Advertising Router: 10.255.0.2

R6# show ip route 10.77.0.0 | include Known
  Known via "ospf 1", distance 110, metric 3, type inter area`,
    options: ['distribute-list in only stops R5 from installing the route in its own routing table; the type 3 LSA is still in area 1\'s database and flooded to R6', 'Prefix list sequence 10 permits every prefix and overrides sequence 5', 'R6 learned 10.77.0.0/16 as an external route from another ASBR', 'distribute-list in takes effect only after the neighbors are reset with clear ip ospf process'],
    answer: [0],
    explanation: "In a link-state protocol every router in an area must have the same LSDB, so `distribute-list in` cannot remove an LSA: it only filters what R5 installs in its own RIB, as the exhibit shows (no route on R5, LSA still present). R6 runs SPF on the same LSDB and installs the route, and its traffic toward 10.77.0.0/16 now arrives at R5, which has no route for it. To keep the prefix out of area 1, filter the type 3 LSA on the ABR (10.255.0.2) with `area 1 filter-list prefix BLOCK-LAB in`. Prefix lists stop at the first match, R6's route is inter-area, and no reset is needed for the local effect." },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32M,
    stem: 'Refer to the exhibit. R1 must advertise a default route into OSPF at all times, even though its own default route comes and goes. Enter the router ospf command that replaces the last line of R1\'s OSPF configuration.',
    exhibit: `R1# show running-config | section router ospf
router ospf 1
 router-id 10.255.0.1
 network 10.0.0.0 0.255.255.255 area 0
 default-information originate

R1# show ip route | include Gateway
Gateway of last resort is not set

R3# show ip route 0.0.0.0
% Network not in table`,
    answer: ['default-information originate always'],
    explanation: "`default-information originate` creates the external (E2, metric 1 by default) default route only while R1 itself has a default route in its routing table, and R1 currently has none, so R3 has no default either. The `always` keyword removes that condition. Use it with care: other routers keep sending Internet traffic to R1 even when R1 has lost its own exit." },

  // ---------- 3.2.b OSPFv3 ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32V,
    stem: 'Refer to the exhibit. R6 is a new IPv6-only router. Its neighbor R5 is configured correctly, but R6 forms no OSPFv3 adjacency. What is the cause?',
    exhibit: `R6# show running-config | include ipv6 unicast-routing|ipv6 router ospf
ipv6 unicast-routing
ipv6 router ospf 1

R6# show running-config interface GigabitEthernet0/0/0
interface GigabitEthernet0/0/0
 no ip address
 ipv6 address FE80::6 link-local
 ipv6 address 2001:DB8:0:56::6/64
 ipv6 ospf 1 area 0

R6# show ip interface brief | exclude unassigned
Interface              IP-Address      OK? Method Status                Protocol

R6# show ipv6 ospf neighbor
R6#`,
    options: ['OSPFv3 still needs a 32-bit router ID, and R6 has no IPv4 address to take one from; configure router-id under ipv6 router ospf 1', 'OSPFv3 needs a network statement under ipv6 router ospf 1 to enable Gi0/0/0', 'The static link-local address FE80::6 prevents OSPFv3 from sending hellos', 'ipv6 ospf 1 area 0 is not valid on IOS XE; only ospfv3 1 ipv6 area 0 is accepted'],
    answer: [0],
    explanation: "The OSPFv3 router ID is a 32-bit value chosen from IPv4 addresses by the same rules as OSPFv2. With no IPv4 address on any interface, the process cannot pick one, so it never starts and no hellos are sent; IOS logs that it could not pick a router ID. `router-id 10.255.0.6` (any unique value) fixes it. OSPFv3 has no network statements, a manually set link-local address is fine (and makes output easier to read), and both `ipv6 ospf 1 area 0` and `ospfv3 1 ipv6 area 0` are valid." },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32V,
    stem: 'Which two statements about OSPFv3 are true? (Choose two.)',
    options: ['Hellos are sourced from the interface\'s link-local address and sent to FF02::5', 'The Link LSA (type 8) is flooded only on the local link and carries the router\'s link-local address and the IPv6 prefixes on that link', 'The OSPFv3 packet header carries an authentication type and key just as OSPFv2 does', 'OSPFv3 uses a 128-bit router ID', 'Router LSAs list the IPv6 prefixes configured on each of the router\'s interfaces', 'Two neighbors must have global addresses in the same /64 to form an adjacency'],
    answer: [0, 1],
    explanation: "OSPFv3 runs per link: hellos come from the link-local address to AllSPFRouters FF02::5, and the Link LSA (LS type 0x0008) has link-local flooding scope. RFC 5340 removed authentication from the header (protection comes from IPsec or the RFC 7166 authentication trailer). The router ID stays 32-bit. Router and network LSAs no longer carry prefixes; those moved to the Intra-Area-Prefix LSA (type 9). Neighbors need only link-local addresses, so their global prefixes may differ." },

  // ---------- 3.2.c eBGP ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32E,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `R1# show running-config | section router bgp
router bgp 65001
 bgp router-id 10.255.0.1
 bgp log-neighbor-changes
 neighbor 10.0.12.2 remote-as 65020
 neighbor 10.0.13.3 remote-as 65003
 neighbor 10.0.14.4 remote-as 65004
 neighbor 10.0.14.4 shutdown

R1# show ip bgp summary | begin Neighbor
Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.0.12.2       4        65020       0       0        1    0    0 never    Idle
10.0.13.3       4        65003    1446    1439       23    0    0 21:41:07        3
10.0.14.4       4        65004       0       0        1    0    0 00:12:30 Idle (Admin)

R2# show ip bgp summary | include local AS
BGP router identifier 10.255.0.2, local AS number 65002`,
    options: ['The session to 10.0.12.2 cannot establish because R1 expects AS 65020 but R2\'s OPEN message carries AS 65002', 'The session to 10.0.14.4 is waiting for its TCP connection to complete', 'R1 has advertised three prefixes to 10.0.13.3', 'The session to 10.0.12.2 needs ebgp-multihop because the peer is not directly connected'],
    answer: [0],
    explanation: "R2 runs AS 65002 but R1's `remote-as` says 65020. When the OPEN arrives with the wrong AS, R1 sends a NOTIFICATION (bad peer AS) and closes the session, which cycles through Idle and Active and never establishes. `Idle (Admin)` means the neighbor is administratively shut down (`neighbor 10.0.14.4 shutdown`), not waiting for TCP. A number in State/PfxRcd means Established and counts prefixes **received**. 10.0.12.2 is on R1's directly connected /30, so no multihop is needed." },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32E,
    stem: 'Refer to the exhibit. The eBGP session to R2 is Established, but R2 does not receive 10.10.0.0/16 from R1. What is the cause, and what fixes it?',
    exhibit: `R1# show running-config | section router bgp
router bgp 65001
 bgp router-id 10.255.0.1
 bgp log-neighbor-changes
 neighbor 10.0.12.2 remote-as 65002
 !
 address-family ipv4
  network 10.10.0.0 mask 255.255.0.0
  neighbor 10.0.12.2 activate
 exit-address-family

R1# show ip route 10.10.0.0 255.255.0.0 longer-prefixes | begin Gateway
Gateway of last resort is not set

      10.0.0.0/8 is variably subnetted, 6 subnets, 3 masks
C        10.10.1.0/24 is directly connected, GigabitEthernet0/0/2
L        10.10.1.1/32 is directly connected, GigabitEthernet0/0/2
C        10.10.2.0/24 is directly connected, GigabitEthernet0/0/3
L        10.10.2.1/32 is directly connected, GigabitEthernet0/0/3

R1# show ip bgp | include 10.10.
R1#`,
    options: ['The network command needs an exact match for 10.10.0.0/16 in the routing table; add ip route 10.10.0.0 255.255.0.0 Null0 or advertise the two /24 networks', 'BGP network statements use wildcard masks, so the mask should be 0.0.255.255', 'The neighbor must also be activated under address-family ipv4 unicast with a second activate command', 'eBGP never advertises connected networks unless redistribute connected is configured'],
    answer: [0],
    explanation: "`network PREFIX mask MASK` advertises a prefix only if the same prefix and mask exist in the routing table. R1 has 10.10.1.0/24 and 10.10.2.0/24 but no 10.10.0.0/16, so nothing enters the BGP table. A static route to Null0 creates the /16 (the usual way to originate an aggregate); listing the /24s also works. BGP uses subnet masks, not wildcards. The neighbor is already activated in the IPv4 address family. `network` works for connected routes as long as the match is exact." },
  { topic: '3.2', type: 'fill', difficulty: 3, lesson: L32E,
    stem: 'Refer to the exhibit. R1 and R2 are joined by two parallel links and peer between their loopbacks so that the session survives the loss of either link. R2 is configured correctly, including for multihop. Enter the command R1 needs under router bgp 65001 to bring the session up.',
    exhibit: `R1# show running-config | section router bgp|ip route
router bgp 65001
 bgp router-id 10.255.0.1
 bgp log-neighbor-changes
 neighbor 10.255.0.2 remote-as 65002
 neighbor 10.255.0.2 update-source Loopback0
ip route 10.255.0.2 255.255.255.255 10.0.12.2
ip route 10.255.0.2 255.255.255.255 10.0.21.2

R1# show ip bgp summary | begin Neighbor
Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.255.0.2      4        65002       0       0        1    0    0 never    Idle

R1# show ip bgp neighbors 10.255.0.2 | include External|state
  BGP state = Idle
  External BGP neighbor not directly connected.`,
    answer: ['neighbor 10.255.0.2 ebgp-multihop 2', 'neighbor 10.255.0.2 ebgp-multihop', 'neighbor 10.255.0.2 ebgp-multihop 255', 'neighbor 10.255.0.2 disable-connected-check'],
    explanation: "R1 has a route to R2's loopback and sources the session from Loopback0, but eBGP by default expects a directly connected peer and sends with TTL 1, so a loopback peer stays Idle (\"External BGP neighbor not directly connected\"). `neighbor 10.255.0.2 ebgp-multihop 2` (or more; without a value the TTL is 255) lifts both limits. For directly connected routers peering on loopbacks, `neighbor 10.255.0.2 disable-connected-check` is an accepted alternative that keeps TTL 1." },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32E,
    stem: 'An eBGP neighbor is configured on R1 and the peer is reachable and correctly configured. Put the BGP neighbor states R1 passes through in order.',
    items: ['Idle: BGP starts the session and its ConnectRetry timer', 'Connect: R1 waits for the TCP connection to port 179 to complete', 'OpenSent: TCP is up and R1 has sent an OPEN message', 'OpenConfirm: R1 has received a valid OPEN and sent a KEEPALIVE', 'Established: R1 has received a KEEPALIVE and exchanges UPDATE messages'],
    explanation: "RFC 4271's finite state machine on a successful attempt: Idle, Connect (TCP in progress), OpenSent (OPEN sent, waiting for the peer's), OpenConfirm (OPEN accepted, KEEPALIVE sent, waiting for the peer's KEEPALIVE), Established. Active appears only when a TCP attempt fails and the router retries and listens; a neighbor stuck in Active cannot complete TCP." },

  // ---------- 3.2.c BGP best-path selection ----------
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32B,
    stem: 'Refer to the exhibit. R1 in AS 65001 has three eBGP peers, all on directly connected links, and no routing policy is configured. Which attribute decided that the path via 10.0.12.2 is the best path to 10.75.0.0/16?',
    exhibit: `R1# show ip bgp
BGP table version is 41, local router ID is 10.255.0.1
Status codes: s suppressed, d damped, h history, * valid, > best, i - internal,
              r RIB-failure, S Stale, m multipath, b backup-path, f RT-Filter,
              x best-external, a additional-path, c RIB-compressed,
              t secondary path, L long-lived-stale,
Origin codes: i - IGP, e - EGP, ? - incomplete
RPKI validation codes: V valid, I invalid, N Not found

     Network          Next Hop            Metric LocPrf Weight Path
 *   10.75.0.0/16     10.0.13.3                0             0 65003 64510 ?
 *>                   10.0.12.2              100             0 65002 64510 i
 *                    10.0.15.5                              0 65005 65050 64510 i`,
    options: ['Origin', 'MED', 'AS_PATH length', 'Oldest eBGP path', 'Lowest router ID'],
    answer: [0],
    explanation: "Walk the list: weight is 0 on all three; local preference is the default 100 on all; none is locally originated. AS_PATH length eliminates 10.0.15.5 (three ASes against two). The remaining two differ in origin: `i` (IGP) via 10.0.12.2 beats `?` (incomplete) via 10.0.13.3, so origin decides before MED is reached. MED would not have helped 10.0.13.3 anyway: it is compared only between paths from the same neighboring AS, and these come from 65002 and 65003. Oldest path and router ID come after a tie at every earlier step." },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32B,
    stem: 'Refer to the exhibit. The engineer then configures neighbor 10.0.13.3 weight 10 under router bgp 65001 and runs clear ip bgp 10.0.13.3 soft in. Which next hop does R1 then use for 10.85.0.0/16?',
    exhibit: `R1# show ip bgp | begin Network
     Network          Next Hop            Metric LocPrf Weight Path
 *>  10.85.0.0/16     10.0.12.2                0    150      0 65002 65085 i
 *                    10.0.13.3                0             0 65003 65085 i
 * i                  10.255.0.4               0    100      0 65085 i`,
    options: ['10.0.13.3, because weight is compared before every other attribute', '10.0.12.2, because its local preference of 150 is still the highest', '10.255.0.4, because its AS_PATH is the shortest', '10.0.12.2, because a weight change applies only after a hard reset of the session'],
    answer: [0],
    explanation: "Before the change all paths have weight 0, so local preference decides: 150 (set by an inbound policy on the 10.0.12.2 session) beats the default 100, even though the iBGP path via 10.255.0.4 has the shortest AS_PATH. `neighbor 10.0.13.3 weight 10` gives that path weight 10, and weight is step 1, so it wins regardless of local preference or AS_PATH length. The soft inbound clear re-applies inbound processing without resetting the session. Weight is local to R1, so the rest of AS 65001 is unaffected." },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32B,
    stem: 'All paths to a prefix on a Cisco router have reachable next hops. Put the first eight BGP best-path comparisons in the order the router applies them.',
    items: ['Highest weight', 'Highest local preference', 'Locally originated path', 'Shortest AS_PATH', 'Lowest origin type (IGP, then EGP, then incomplete)', 'Lowest MED', 'eBGP path over iBGP path', 'Lowest IGP metric to the next hop'],
    explanation: "Cisco's order starts with two Cisco-relevant preferences (weight, local to the router; local preference, shared in the AS), then locally originated paths, then RFC 4271's tie-breakers: AS_PATH length, origin, MED (only between paths from the same neighboring AS by default), eBGP over iBGP, IGP cost to the next hop. If still tied: oldest eBGP path, lowest router ID, shortest cluster list, lowest neighbor address." },

  // ---------- 3.2.d Policy-based routing ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32R,
    stem: 'Refer to the exhibit. Guest HTTPS traffic from 10.20.0.0/16 must leave through ISP-A (198.51.100.1), but it still follows R1\'s default route through ISP-B on Gi0/0/1. What is wrong?',
    exhibit: `R1# show running-config | section interface GigabitEthernet0/0/[02]|GUEST
interface GigabitEthernet0/0/0
 description ISP-A
 ip address 198.51.100.2 255.255.255.252
 ip policy route-map PBR-GUEST
interface GigabitEthernet0/0/2
 description Guest LAN
 ip address 10.20.0.1 255.255.0.0
ip access-list extended GUEST-WEB
 10 permit tcp 10.20.0.0 0.0.255.255 any eq 443
route-map PBR-GUEST permit 10
 match ip address GUEST-WEB
 set ip next-hop 198.51.100.1

R1# show route-map PBR-GUEST | include matches
  Policy routing matches: 0 packets, 0 bytes`,
    options: ['The policy is applied to Gi0/0/0, but PBR acts on packets as they arrive; apply ip policy route-map PBR-GUEST to Gi0/0/2 instead', 'set ip next-hop is ignored while a default route exists; use set ip default next-hop', 'The ACL must deny the guest traffic for the route-map to select it', 'Transit traffic is policy routed only when ip local policy route-map PBR-GUEST is configured'],
    answer: [0],
    explanation: "`ip policy route-map` is evaluated for packets received on the interface where it is applied. The guest packets arrive on Gi0/0/2, which has no policy, so they are routed normally; the zero match counter confirms the route-map never sees them. Moving the policy to Gi0/0/2 fixes it. `set ip next-hop` acts before the routing table, so a default route does not block it, whereas `set ip default next-hop` would only act when no explicit route exists. In the ACL, permit selects traffic for the route-map entry. `ip local policy` is for packets the router originates." },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32R,
    stem: 'Match each policy-based routing requirement on R1 to the configuration that meets it.',
    pairs: [
      ['Guest traffic must use 198.51.100.1 instead of whatever the routing table would choose', 'set ip next-hop 198.51.100.1'],
      ['Guest traffic follows the routing table, except traffic for which only the default route matches, which must use 198.51.100.1', 'set ip default next-hop 198.51.100.1'],
      ['Guest traffic must use 198.51.100.1 only while tracked object 10, an IP SLA probe through ISP-A, is up', 'set ip next-hop verify-availability 198.51.100.1 10 track 10'],
      ['Syslog messages generated by R1 itself must leave through ISP-A', 'ip local policy route-map PBR-MGMT'],
      ['The policy must apply to traffic arriving from the guest LAN on Gi0/0/2', 'ip policy route-map PBR-GUEST under interface GigabitEthernet0/0/2'],
    ],
    explanation: "`set ip next-hop` overrides the routing table for matched packets (if the next hop is reachable). `set ip default next-hop` is consulted only when the routing table has no explicit route; the default route does not count as one. `verify-availability ... track` withdraws the policy when the tracked object goes down, so traffic falls back to normal routing. Router-originated traffic is policy routed only by `ip local policy route-map`, and transit traffic by `ip policy route-map` on the ingress interface." },

  // 3.3 IP services
  // ---------- 3.3.a NTP and PTP ----------
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L33N,
    stem: 'Refer to the exhibit. Which two statements about R2 are true? (Choose two.)',
    exhibit: `R2# show ntp associations

  address         ref clock       st   when   poll reach  delay  offset   disp
*~10.10.1.1       .GNSS.           1     22     64   377  0.734   0.118  0.952
+~10.10.1.2       .GNSS.           1     41     64   377  0.811   0.207  0.987
x~10.10.1.3       10.200.0.9       2     17     64   377  1.902 1288.33  1.044
 ~10.10.1.4       .INIT.          16      -   1024     0  0.000   0.000 15937.
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured`,
    options: ['R2 is synchronized to 10.10.1.1 and is itself at stratum 2', '10.10.1.3 answers every poll, but its time disagrees with the other sources, so R2 discards it', '10.10.1.4 answered its last poll, but its stratum is too high for it to be selected', '10.10.1.2 cannot be used because only the source marked with an asterisk is valid', 'The tilde shows that all four addresses are symmetric peers configured with ntp peer'],
    answer: [0, 1],
    explanation: "`*` marks the system peer, 10.10.1.1, a stratum 1 server, so R2 runs at stratum 2. 10.10.1.3 has reach 377 (it answers) but an offset of about 1.3 seconds against about 0.1 to 0.2 ms for the others, so the selection algorithm marks it `x`, a falseticker. 10.10.1.4 has reach 0, `.INIT.` and stratum 16: it has never answered. `+` on 10.10.1.2 means candidate: acceptable and ready to take over. `~` only means the association was configured (by `ntp server` or `ntp peer`); it says nothing about the mode." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33N,
    stem: 'Refer to the exhibit. Which statement describes the last eight polls R1 sent to 10.10.1.2?',
    exhibit: `R1# show ntp associations

  address         ref clock       st   when   poll reach  delay  offset   disp
*~10.10.1.1       .GNSS.           1     30     64   377  0.702   0.091  0.938
+~10.10.1.2       .GNSS.           1     12     64   175  0.845   0.164  1.977
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured`,
    options: ['Six were answered; the second most recent poll and the oldest of the eight got no reply', 'Seven were answered; only the most recent poll got no reply', 'Five were answered, because reach is a decimal count of replies out of the last 255 polls', 'All eight were answered, because the server is still marked as a candidate'],
    answer: [0],
    explanation: "Reach is an 8-bit shift register shown in **octal**: 175 = 001 111 101 = 01111101 in eight bits. Reading from the oldest (left) to the newest (right) poll: the oldest failed, the next five succeeded, the second most recent failed and the most recent succeeded, so six of eight were answered. Seven of eight with only the newest missing would be 376 (11111110); all eight would be 377. A source with a few missed polls can still be a `+` candidate." },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33N,
    stem: 'Refer to the exhibit. Server 10.10.1.1 is reachable, synchronized at stratum 1 and configured with the same key 1 as R2. Enter the global configuration command that lets R2 synchronize to it.',
    exhibit: `R2# show running-config | include ntp
ntp authentication-key 1 md5 <SECRET>
ntp authenticate
ntp server 10.10.1.1 key 1

R2# show ntp status
Clock is unsynchronized, stratum 16, no reference clock`,
    answer: ['ntp trusted-key 1'],
    explanation: "With `ntp authenticate` enabled, R2 synchronizes only to a source that authenticates with a **trusted** key. Key 1 is defined and used toward the server, but it is not trusted, so R2 never selects the server and stays at stratum 16. `ntp trusted-key 1` completes the client side; the server only needs the same key number and string to sign its replies." },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L33N,
    stem: 'R1 is the NTP source for the campus. Match each requirement to the ntp access-group command that meets it (each ACL permits only the hosts named).',
    pairs: [
      ['R1 may synchronize to the GPS appliance 10.10.1.1, which may also query R1', 'ntp access-group peer 11'],
      ['Distribution switches may get time from R1 and read its NTP status, but R1 must never synchronize to them', 'ntp access-group serve 12'],
      ['Hosts in 10.30.0.0/16 may get time from R1 and nothing else', 'ntp access-group serve-only 13'],
      ['The monitoring server may read R1\'s NTP status but must not get time from it', 'ntp access-group query-only 14'],
    ],
    explanation: "`peer` is the most permissive: time requests, control queries and synchronizing to the source. `serve` allows time requests and control queries without synchronizing to the source. `serve-only` allows time requests only. `query-only` allows control queries only. Once any access group exists, a source gets only what a matching group grants, so R1's own upstream server must be permitted by `peer`." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33N,
    stem: 'Refer to the exhibit. Access switches use DSW1 as their only NTP server. Which statement is true?',
    exhibit: `DSW1# show running-config | include ntp
ntp master
ntp server 10.10.1.1

DSW1# show ntp associations

  address         ref clock       st   when   poll reach  delay  offset   disp
*~127.127.1.1     .LOCL.           7     11     16   377  0.000   0.000  0.233
 ~10.10.1.1       .INIT.          16      -   1024     0  0.000   0.000 15937.
 * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured`,
    options: ['DSW1 serves its own clock at stratum 8, because 10.10.1.1 has never answered', 'DSW1 serves time at stratum 16, so the access switches will not synchronize', 'DSW1 serves time at stratum 7, the value shown for 127.127.1.1', 'DSW1 relays the time of 10.10.1.1 to the access switches at stratum 2'],
    answer: [0],
    explanation: "`ntp master` without a number makes DSW1 an authoritative source at stratum 8, using its own clock. Its local reference clock appears as 127.127.1.1 `.LOCL.` one stratum lower (7), and it is the system peer because 10.10.1.1 has reach 0 and stratum 16. The access switches therefore synchronize to DSW1 at stratum 8 and then run at stratum 9, with time that is only as good as DSW1's own clock. If 10.10.1.1 starts answering at a better stratum, DSW1 synchronizes to it instead." },
  { topic: '3.3', type: 'single', difficulty: 3, lesson: L33P,
    stem: 'Refer to the exhibit. SW1 is a PTP boundary clock in domain 0 and receives Announce messages describing three clocks. All other attributes are equal. Which clock does the BMCA select as grandmaster?',
    exhibit: `Clock  priority1  clockClass  clockAccuracy   offsetScaledLogVariance  priority2  clockIdentity
GM-A   128        6           Within 100 ns   0x4E5D                   128        0x00:1D:C1:FF:FE:00:00:0A
GM-B   128        6           Within 100 ns   0x4E5D                   100        0x00:1D:C1:FF:FE:00:00:0B
GM-C   100        7           Within 250 ns   0x4E5D                   128        0x00:1D:C1:FF:FE:00:00:0C`,
    options: ['GM-C, because priority1 is compared first and 100 is lower than 128', 'GM-A, because its clock identity is the lowest', 'GM-B, because its priority2 of 100 is the lowest', 'GM-A or GM-B, whichever SW1 heard first, because both have the best clock class and accuracy'],
    answer: [0],
    explanation: "The BMCA compares priority1, clockClass, clockAccuracy, offsetScaledLogVariance, priority2 and clockIdentity in that order, lowest wins, and stops at the first difference. GM-C's priority1 of 100 beats 128 before clock class (7, holdover, against 6) or accuracy is considered, so the administratively preferred clock wins even though its quality is worse. Without that priority1, GM-A and GM-B tie down to priority2, where GM-B's 100 wins; clockIdentity would only decide a tie at every earlier step. Arrival order plays no part." },
  { topic: '3.3', type: 'order', difficulty: 2, lesson: L33P,
    stem: 'Put the attributes the PTP Best Master Clock Algorithm (IEEE 1588-2008) compares, lowest value winning, in the order it compares them.',
    items: ['priority1', 'clockClass', 'clockAccuracy', 'offsetScaledLogVariance', 'priority2', 'clockIdentity'],
    explanation: "priority1 lets an administrator override clock quality; clockClass (traceability, for example 6 for a GNSS-locked clock), clockAccuracy and offsetScaledLogVariance (stability) describe quality; priority2 is an administrative tiebreaker between otherwise equal clocks (primary and backup grandmasters); clockIdentity, derived from the MAC address, guarantees a unique result." },

  // ---------- 3.3.b NAT and PAT ----------
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33T,
    stem: 'Refer to the exhibit. Only four of the 60 users in 10.1.20.0/24 can reach the internet at any one time. Enter the global configuration command that lets every user share the PUBLIC pool.',
    exhibit: `R1# show running-config | include ip nat
 ip nat outside
 ip nat inside
ip nat pool PUBLIC 203.0.113.3 203.0.113.6 prefix-length 29
ip nat inside source list NAT-USERS pool PUBLIC

R1# show ip nat statistics
Total active translations: 17 (0 static, 17 dynamic; 13 extended)
Outside interfaces:
  GigabitEthernet0/0/0
Inside interfaces:
  GigabitEthernet0/0/1
Hits: 5120  Misses: 41
Expired translations: 2
Dynamic mappings:
-- Inside Source
[Id: 1] access-list NAT-USERS pool PUBLIC refcount 17
pool PUBLIC: netmask 255.255.255.248
        start 203.0.113.3 end 203.0.113.6
        type generic, total addresses 4, allocated 4 (100%), misses 37`,
    answer: ['ip nat inside source list NAT-USERS pool PUBLIC overload'],
    explanation: "Without `overload`, dynamic NAT gives each inside host a whole pool address: four addresses, four hosts at a time (`allocated 4 (100%)`), and every other host's first packet is a miss. Adding `overload` turns on PAT, so hosts share the pool addresses and are told apart by port. IOS may ask to remove the existing dynamic entries when the mapping changes; afterwards `clear ip nat translation *` removes any that remain." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33T,
    stem: 'Refer to the exhibit. PAT is configured on R1, but no translations are created. What must the engineer change?',
    exhibit: `R1# show ip nat statistics
Total active translations: 0 (0 static, 0 dynamic; 0 extended)
Outside interfaces:
  GigabitEthernet0/0/0, GigabitEthernet0/0/1
Inside interfaces:

Hits: 0  Misses: 0
Expired translations: 0
Dynamic mappings:
-- Inside Source
[Id: 1] access-list NAT-USERS interface GigabitEthernet0/0/0 refcount 0

R1# show running-config interface GigabitEthernet0/0/1
interface GigabitEthernet0/0/1
 description LAN 10.1.20.0/24
 ip address 10.1.20.1 255.255.255.0
 ip nat outside`,
    options: ['Replace ip nat outside with ip nat inside on GigabitEthernet0/0/1', 'Add overload to the dynamic mapping, because interface mappings require it to start translating', 'Replace the ACL with a route-map, because ACL-based mappings cannot use an interface address', 'Run clear ip nat translation * so that the mapping takes effect'],
    answer: [0],
    explanation: "Translation happens only for traffic moving between an `ip nat inside` and an `ip nat outside` interface. The statistics list no inside interface, and the LAN interface Gi0/0/1 is marked outside, so packets from 10.1.20.0/24 never cross from inside to outside. No mapping, with or without `overload`, can translate while no interface is marked inside; ACL-based mappings work with an interface address, and clearing translations does nothing when none exist." },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L33T,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `R1# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
---  203.0.113.3           10.1.10.20            ---                   ---
tcp  203.0.113.4:8443      10.1.10.21:443        ---                   ---
tcp  203.0.113.4:8443      10.1.10.21:443        198.51.100.70:50112   198.51.100.70:50112
tcp  203.0.113.2:49731     10.1.20.15:49731      192.0.2.80:443        192.0.2.80:443
Total number of translations: 4`,
    options: ['A host at 198.51.100.70 has a session to the server 10.1.10.21, which it reached by connecting to 203.0.113.4 port 8443', 'R1 translates traffic for 203.0.113.3 on any port to 10.1.10.20', '10.1.20.15 is translated by a static entry', 'R1 also translates the address of the outside host 192.0.2.80', 'Internet users reach 10.1.10.21 at 203.0.113.4 port 443'],
    answer: [0, 1],
    explanation: "The line with `---` and no ports is a static one-to-one entry: 203.0.113.3 maps to 10.1.10.20 for all traffic. The `tcp 203.0.113.4:8443 ... 10.1.10.21:443` line without outside addresses is a static port-forwarding entry, and the line below it is a live session from 198.51.100.70 that used it, so outside users connect to port 8443, not 443. 10.1.20.15's line has all four columns and a port: a dynamic PAT flow. Outside local equals outside global (192.0.2.80), so the outside address is not translated." },
  { topic: '3.3', type: 'order', difficulty: 2, lesson: L33T,
    stem: 'R1 runs PAT on GigabitEthernet0/0/0 (ip nat outside) for hosts on GigabitEthernet0/0/1 (ip nat inside), and both interfaces have ACLs applied. Put the steps R1 takes for a packet from 10.1.20.15 to 192.0.2.80 in order.',
    items: ['The packet arrives on Gi0/0/1 and the inbound ACL there is checked against the inside local source 10.1.20.15', 'R1 looks up 192.0.2.80 in the routing table and selects Gi0/0/0', 'NAT matches the source in its ACL, translates it to 203.0.113.2 with a port and creates a translation entry', 'The outbound ACL on Gi0/0/0 is checked against the packet, which now carries the inside global source', 'R1 sends the packet to the ISP next hop'],
    explanation: "Inside to outside, IOS routes first and translates second: the inbound ACL on the inside interface sees the original (inside local) address, the routing decision picks the outside interface, NAT translates on the way out, and an outbound ACL on the outside interface sees the translated (inside global) address. Outside to inside the order is reversed: NAT translates the destination before routing, so an inbound ACL on the outside interface must be written with inside global addresses." },
  { topic: '3.3', type: 'single', difficulty: 3, lesson: L33T,
    stem: 'Refer to the exhibit. Internet users cannot reach the HTTPS server published at 203.0.113.4. The server works from inside, and its default gateway is R1. What is the cause?',
    exhibit: `R1# show running-config | section interface GigabitEthernet0/0/0|source static|OUTSIDE-IN
interface GigabitEthernet0/0/0
 description ISP
 ip address 203.0.113.2 255.255.255.248
 ip access-group OUTSIDE-IN in
 ip nat outside
ip nat inside source static tcp 10.1.10.20 443 203.0.113.4 443 extendable
ip access-list extended OUTSIDE-IN
 10 permit tcp any host 10.1.10.20 eq 443
 20 deny ip any any log`,
    options: ['OUTSIDE-IN is applied before NAT translates the destination, so it must permit tcp any host 203.0.113.4 eq 443', 'A static port-forwarding entry needs the overload keyword to accept connections from outside', 'The extendable keyword limits the entry to connections that the inside server opens', 'Static NAT entries translate only traffic that starts on the inside, so a dynamic pool is needed'],
    answer: [0],
    explanation: "Outside to inside, the inbound ACL on the outside interface runs before NAT translates the destination from the inside global 203.0.113.4 to the inside local 10.1.10.20. The packets still carry 203.0.113.4, match nothing in line 10 and are dropped by line 20 (the log would show it). Static entries work in both directions and need no `overload`; `extendable` only allows the same inside local address in several static entries." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33T,
    stem: 'Refer to the exhibit. The web server 198.51.100.25 logs a connection from 203.0.113.2 with source port 1024. Which inside host opened it?',
    exhibit: `R1# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
tcp  203.0.113.2:1024      10.1.20.31:51200      198.51.100.25:443     198.51.100.25:443
tcp  203.0.113.2:51200     10.1.20.15:51200      198.51.100.25:443     198.51.100.25:443
udp  203.0.113.2:53172     10.1.20.16:53172      198.51.100.53:53      198.51.100.53:53
Total number of translations: 3`,
    options: ['10.1.20.31', '10.1.20.15', '10.1.20.16', 'It cannot be determined, because PAT hides which inside host used the port'],
    answer: [0],
    explanation: "The server sees the inside global address and port, 203.0.113.2:1024. The translation table maps that pair to the inside local 10.1.20.31:51200: both 10.1.20.15 and 10.1.20.31 used source port 51200 toward the same server, 10.1.20.15 kept it, and PAT moved 10.1.20.31 to port 1024 to keep the global address and port unique. 10.1.20.16 has a DNS flow to another server. The table is exactly what lets R1, and you, map a global port back to a host." },

  // ---------- 3.3.c HSRP and VRRP ----------
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33H,
    stem: 'Refer to the exhibit. DSW1 and DSW2 both claim the gateway role for VLAN 10. Which change fixes the problem?',
    exhibit: `DSW1# show standby Vlan10 | include Vlan10|State is|virtual MAC|router is
Vlan10 - Group 10 (version 2)
  State is Active
  Active virtual MAC address is 0000.0c9f.f00a (MAC In Use)
    Local virtual MAC address is 0000.0c9f.f00a (v2 default)
  Active router is local
  Standby router is unknown

DSW2# show standby Vlan10 | include Vlan10|State is|virtual MAC|router is
Vlan10 - Group 10
  State is Active
  Active virtual MAC address is 0000.0c07.ac0a (MAC In Use)
    Local virtual MAC address is 0000.0c07.ac0a (v1 default)
  Active router is local
  Standby router is unknown`,
    options: ['Configure standby version 2 on DSW2 interface Vlan10', 'Configure standby 10 preempt on DSW2', 'Give DSW1 a higher priority so that it wins the election', 'Configure the same virtual MAC on both with standby 10 mac-address'],
    answer: [0],
    explanation: "DSW1 runs version 2 (`(version 2)`, MAC `0000.0c9f.f00a`, hellos to 224.0.0.102) and DSW2 version 1 (no version shown, MAC `0000.0c07.ac0a`, hellos to 224.0.0.2). The versions do not interoperate, so neither hears the other (`Standby router is unknown`) and both go active. Preemption and priority only matter once the routers hear each other, and forcing a common MAC would hide the symptom without making the routers communicate." },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33H,
    stem: 'Refer to the exhibit. Enter the HSRP priority that DSW1 now advertises for group 10.',
    exhibit: `DSW1# show running-config interface Vlan10 | include standby
 standby version 2
 standby 10 ip 10.1.10.1
 standby 10 priority 120
 standby 10 preempt
 standby 10 track 1 decrement 15
 standby 10 track 2 decrement 25
 standby 10 track 3 decrement 10

DSW1# show track brief
Track Type        Instance                   Parameter        State Last Change
1     interface   GigabitEthernet1/0/47      line-protocol    Down  00:00:41
2     interface   GigabitEthernet1/0/48      line-protocol    Up    3d04h
3     ip route    0.0.0.0/0                  reachability     Down  00:00:38`,
    answer: ['95'],
    explanation: "HSRP subtracts the decrement of every tracked object that is down from the configured priority: 120 − 15 (object 1) − 10 (object 3) = 95. Object 2 is up, so its 25 is not subtracted. If DSW2 has the default priority 100 and `standby 10 preempt`, it takes over as active; DSW1 returns to 120 and preempts back once both objects are up." },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33H,
    stem: 'Refer to the exhibit. A host in VLAN 300 sends an ARP request for its default gateway 10.3.0.1, and DSW1 is the active router. Enter the MAC address in the ARP reply, in Cisco dotted format.',
    exhibit: `DSW1# show running-config interface Vlan300
interface Vlan300
 ip address 10.3.0.2 255.255.255.0
 standby version 2
 standby 300 ip 10.3.0.1
 standby 300 priority 110
 standby 300 preempt`,
    answer: ['0000.0c9f.f12c', '00:00:0c:9f:f1:2c', '00-00-0c-9f-f1-2c', '00000c9ff12c'],
    explanation: "HSRPv2 virtual MACs are `0000.0c9f.fXXX`, where XXX is the group number in hexadecimal: 300 = 0x12C, so `0000.0c9f.f12c`. Group 300 is only possible with version 2 (version 1 allows groups 0 to 255 and uses `0000.0c07.acXX`). The active router answers ARP for the virtual IP with the virtual MAC, so hosts keep the same gateway MAC after a failover." },
  { topic: '3.3', type: 'order', difficulty: 2, lesson: L33H,
    stem: 'DSW1 has standby 10 ip 10.1.10.1 configured and is the only HSRP router on VLAN 10. Put the HSRP states it passes through after its SVI comes up in order.',
    items: ['Initial', 'Listen', 'Speak', 'Standby', 'Active'],
    explanation: "RFC 2281's state machine: from Initial, a router with the virtual IP configured goes to Listen (without it, to Learn, waiting to learn the address from the active router). When the active timer expires without a hello it moves to Speak and sends hellos; when the standby timer expires without hearing a better router it becomes Standby; when the active timer expires again it becomes Active, sends a gratuitous ARP for the virtual IP and starts forwarding. With default timers this takes about one or two hold times." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33V,
    stem: 'Refer to the exhibit. DSW1 was the VRRP master for VLAN 10. Which statement is true?',
    exhibit: `DSW1# show vrrp
Vlan10 - Group 10 - Address-Family IPv4
  State is BACKUP
  State duration 4 mins 12.340 secs
  Virtual IP address is 10.1.10.1
  Virtual MAC address is 0000.5E00.010A
  Advertisement interval is 1000 msec
  Preemption enabled
  Priority is 90 (Configured 120)
  State change reason is VRRP_PREEMPT
    Track object 1 state DOWN decrement 30
  Master Router is 10.1.10.3, priority is 100
  Master Advertisement interval is 1000 msec (learned)
  Master Down interval is 3648 msec (expires in 3302 msec)
  FLAGS: 0/1`,
    options: ['Tracked object 1 is down, lowering DSW1 to 90, below the master\'s 100; DSW1 becomes master again when the object recovers, because preemption is enabled', 'DSW1 is backup because 10.1.10.3 has the higher interface address, which VRRP compares before priority', 'DSW1 stays backup after object 1 recovers, because VRRP does not preempt unless preempt is configured', '10.1.10.3 is the address owner of 10.1.10.1, so it always wins'],
    answer: [0],
    explanation: "`Priority is 90 (Configured 120)` and `Track object 1 state DOWN decrement 30` show the tracking: 120 − 30 = 90, which is below the master's 100, so 10.1.10.3 preempted (VRRP preempts by default). When the object comes back, DSW1 returns to 120 and, with preemption enabled, takes the role back. Priority is compared before the IP address. An address owner would advertise priority 255, not 100, and its interface address would equal the virtual IP." },
  { topic: '3.3', type: 'fill', difficulty: 3, lesson: L33V,
    stem: 'Refer to the exhibit. Enter the Master Down interval, in milliseconds, that DSW3 shows for this group.',
    exhibit: `DSW3# show vrrp | exclude Down interval
Vlan10 - Group 10 - Address-Family IPv4
  State is BACKUP
  State duration 2 hours 3 mins 41 secs
  Virtual IP address is 10.1.10.1
  Virtual MAC address is 0000.5E00.010A
  Advertisement interval is 1000 msec
  Preemption enabled
  Priority is 150
  Master Router is 10.1.10.2, priority is 200
  Master Advertisement interval is 1000 msec (learned)
  FLAGS: 0/1`,
    answer: ['3414', '3414 msec', '3414 ms', '3414ms'],
    explanation: "Master down interval = 3 x advertisement interval + skew time, and skew time = (256 − priority) x advertisement interval / 256, using the **backup's own** priority. DSW3: (256 − 150) x 1000 / 256 = 414.06 ms, so 3000 + 414 = 3414 ms. The master's priority (200) does not enter the calculation. Higher-priority backups get a shorter skew and therefore time out first." },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L33V,
    stem: 'Which two statements about VRRPv3 on IOS XE are true? (Choose two.)',
    options: ['A router whose interface address equals the virtual address uses priority 255 and becomes master whenever it is up', 'A backup with a higher priority takes over from the master without any preempt command being configured', 'Advertisements are sent to UDP port 1985 at 224.0.0.18', 'Advertisements are authenticated with an MD5 key string configured under the address family', 'The master and every backup send advertisements every second', 'The IPv4 virtual MAC address for group 20 is 0000.0c9f.f014'],
    answer: [0, 1],
    explanation: "RFC 9568 reserves priority 255 for the IP address owner, which always takes the master role, and sets `Preempt_Mode` to True by default. VRRP uses IP protocol 112 to 224.0.0.18 (UDP 1985 is HSRP); VRRPv3 has no authentication; only the master sends advertisements; and the IPv4 virtual MAC for VRID 20 is `0000.5e00.0114` (`0000.0c9f.f014` would be HSRPv2 group 20)." },

  // ---------- 3.3.d Multicast ----------
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33I,
    stem: 'Refer to the exhibit. Enter the destination MAC address of the frames R1 sends on Vlan40 for the group a host has joined there, in Cisco dotted format.',
    exhibit: `R1# show ip igmp groups
IGMP Connected Group Membership
Group Address    Interface                Uptime    Expires   Last Reporter   Group Accounted
239.200.17.3     Vlan40                   00:12:51  00:02:34  10.1.40.22
239.1.1.1        Vlan20                   02:10:05  00:02:39  10.1.20.15
224.0.1.40       Loopback0                5d03h     00:02:11  10.255.0.1`,
    answer: ['0100.5e48.1103', '01:00:5e:48:11:03', '01-00-5e-48-11-03', '01005e481103'],
    explanation: "The group on Vlan40 is 239.200.17.3. The MAC is 01-00-5E followed by the low 23 bits of the group: the second octet 200 = 1100 1000 loses its top bit, leaving 100 1000 = 0x48; 17 = 0x11 and 3 = 0x03. So `0100.5e48.1103`. Because five bits are dropped, 31 other groups (for example 239.72.17.3 and 224.200.17.3) share this MAC." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33I,
    stem: 'Refer to the exhibit. R1, R2 and R3 share VLAN 20, run PIM sparse mode and IGMPv2. Which router is the IGMP querier and which is the PIM designated router?',
    exhibit: `R1# show running-config interface Vlan20
interface Vlan20
 ip address 10.1.20.2 255.255.255.0
 ip pim sparse-mode

R2# show running-config interface Vlan20
interface Vlan20
 ip address 10.1.20.3 255.255.255.0
 ip pim dr-priority 50
 ip pim sparse-mode

R3# show running-config interface Vlan20
interface Vlan20
 ip address 10.1.20.4 255.255.255.0
 ip pim sparse-mode`,
    options: ['Querier R1, DR R2', 'Querier R3, DR R3', 'Querier R2, DR R2', 'Querier R1, DR R3'],
    answer: [0],
    explanation: "The IGMPv2 querier is the router with the **lowest** IP address on the segment (RFC 2236): R1, 10.1.20.2. The PIM DR is the router with the **highest DR priority**, then the highest IP address: R2's priority 50 beats the default 1 on R1 and R3, so R2 is DR even though R3 has the highest address. The two roles are elected independently and are often on different routers." },
  { topic: '3.3', type: 'single', difficulty: 3, lesson: L33I,
    stem: 'Refer to the exhibit. The provider link Gi0/0/1 does not carry multicast, so R1 sends the stream from source 10.50.1.10 to R2 over Tunnel0, where PIM runs. Receivers behind R2 get nothing. What is the cause?',
    exhibit: `R2# show ip pim neighbor
PIM Neighbor Table
Mode: B - Bidir Capable, DR - Designated Router, N - Default DR Priority,
      P - Proxy Capable, S - State Refresh Capable, G - GenID Capable,
      L - DR Load-balancing Capable
Neighbor          Interface                Uptime/Expires    Ver   DR
Address                                                            Prio/Mode
172.16.0.1        Tunnel0                  2d01h/00:01:31    v2    1 / S P G

R2# show ip route 10.50.1.10 | include Known|via
  Known via "ospf 1", distance 110, metric 2, type intra area
  * 10.0.12.1, from 10.255.0.1, 2d01h ago, via GigabitEthernet0/0/1`,
    options: ['The RPF interface for 10.50.1.10 is Gi0/0/1, so packets arriving on Tunnel0 fail the RPF check; a static mroute pointing to the tunnel fixes it', 'R2 is not the PIM DR on Tunnel0, so it cannot forward multicast to the receivers', 'IGMP snooping on R2 drops the stream because the receivers use IGMPv2', 'Multicast cannot be sent over GRE tunnels, so the provider link must be enabled for PIM'],
    answer: [0],
    explanation: "R2 accepts multicast from 10.50.1.10 only on the interface it would use to reach that source by unicast. OSPF points to Gi0/0/1, where there is no PIM neighbor, so the stream arriving on Tunnel0 fails the RPF check and is dropped (and R2's joins go nowhere useful). `ip mroute 10.50.1.0 255.255.255.0 172.16.0.1` makes Tunnel0 the RPF interface for that source without changing unicast routing. Tunnels carry multicast well, and the DR role only matters on segments with hosts or sources." },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L33M,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `R4# show ip mroute 239.10.10.10 | begin \\(
(*, 239.10.10.10), 00:31:07/stopped, RP 10.255.0.3, flags: SJC
  Incoming interface: GigabitEthernet0/0/1, RPF nbr 10.0.34.3
  Outgoing interface list:
    Vlan40, Forward/Sparse, 00:31:07/00:02:44

(10.50.1.10, 239.10.10.10), 00:30:59/00:02:58, flags: JT
  Incoming interface: GigabitEthernet0/0/2, RPF nbr 10.0.24.2
  Outgoing interface list:
    Vlan40, Forward/Sparse, 00:30:59/00:02:44`,
    options: ['A host on Vlan40 has joined 239.10.10.10 with IGMP', 'R4 receives traffic from 10.50.1.10 on the shortest-path tree through 10.0.24.2', 'R4 is the rendezvous point for 239.10.10.10', '239.10.10.10 is an SSM group because an (S,G) entry exists', 'R4 is the first-hop router registering 10.50.1.10 to the RP'],
    answer: [0, 1],
    explanation: "The `C` flag and Vlan40 in the outgoing list show a directly connected receiver. The (S,G) entry has the `T` flag (traffic on the SPT) with its incoming interface toward the source through 10.0.24.2, a different path from the shared tree toward the RP through 10.0.34.3. The RP is 10.255.0.3, and an RP would show the (\\*,G) incoming interface as Null. SSM entries carry the `s` flag and use 232/8; sparse-mode routers create (S,G) entries on any SPT switchover. A first-hop router would show the `F` flag and `Registering`." },
  { topic: '3.3', type: 'match', difficulty: 3, lesson: L33M,
    stem: 'Match each multicast problem to the cause or solution that fits it.',
    pairs: [
      ['Hosts send IGMPv2 reports for 232.1.1.1 and receive nothing, although the source is sending', 'Group is in the SSM range: hosts need IGMPv3 INCLUDE reports, or the router needs SSM mapping'],
      ['In a Layer 2-only VLAN with no multicast router, receivers lose the stream a few minutes after joining', 'No IGMP querier: enable the IGMP snooping querier on the switch'],
      ['The RPF-failure counter for a source climbs in show ip mroute count on R2', 'Unicast route to the source uses another interface: fix routing or add a static mroute'],
      ['Receivers in a partner\'s PIM-SM domain must get sources registered at your RP', 'MSDP peering between the two RPs'],
      ['400 hosts all send and receive on one group, and (S,G) state is exhausting router memory', 'Bidirectional PIM'],
      ['Losing the single static RP broke every shared tree; routers must keep using one RP address', 'Anycast RP: several RPs share one address and peer with MSDP'],
    ],
    explanation: "232/8 is SSM: routers create only (S,G) state from source-specific (IGMPv3) reports, so v2 reports for that range are not acted on without SSM mapping. IGMP snooping entries age out when no querier prompts reports; the snooping querier replaces the missing router. RPF failures mean multicast arrives on an interface other than the unicast path to the source. MSDP carries Source-Active messages between RPs of different domains. Bidir PIM uses only (\\*,G) state, ideal for many-to-many groups. Anycast RP gives redundancy with one RP address, with MSDP (or RFC 4610 PIM registers) keeping the RPs' source lists in step." },
  { topic: '3.3', type: 'order', difficulty: 2, lesson: L33M,
    stem: 'A receiver joins 239.10.10.10 in a PIM sparse-mode network with a static RP, and then a source starts sending. Put the events in order.',
    items: ['The receiver sends an IGMP membership report for 239.10.10.10 to its last-hop router', 'The last-hop DR sends a (*,G) Join hop by hop toward the RP', "The source's first-hop DR encapsulates the first packets in PIM Register messages to the RP", 'The RP decapsulates the packets, forwards them down the shared tree and sends an (S,G) Join toward the source', 'Having received the first packets down the shared tree, the last-hop router sends an (S,G) Join toward the source and moves to the shortest-path tree'],
    explanation: "The receiver side builds the shared tree first: IGMP report, then a (\\*,G) Join toward the RP. When the source starts, its DR registers the packets to the RP by unicast encapsulation; the RP decapsulates them, forwards them down the shared tree and joins the source tree. Only after the first packets have come down the shared tree does the last-hop router know the source address, so it joins the SPT (by default after the first packet on IOS) and then prunes the source off the shared tree. The RP's Register-Stop is left out of the sequence on purpose: it is sent once native (S,G) traffic reaches the RP, which can happen before or after the last-hop router's SPT join." },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33M,
    stem: 'Refer to the exhibit. Which RP does R5 use for group 239.10.10.10, and how did it learn it?',
    exhibit: `R5# show ip pim rp mapping
PIM Group-to-RP Mappings

Group(s) 224.0.0.0/4
  RP 10.255.0.1 (?), v2
    Info source: 10.255.0.9 (?), via bootstrap, priority 0, holdtime 150
     Uptime: 1d02h, expires: 00:02:21

Group(s) 239.10.0.0/16
  RP 10.255.0.2 (?), v2
    Info source: 10.255.0.9 (?), via bootstrap, priority 0, holdtime 150
     Uptime: 1d02h, expires: 00:02:21`,
    options: ['10.255.0.2, learned from the bootstrap router 10.255.0.9, because 239.10.0.0/16 is the longest matching range', '10.255.0.1, because 224.0.0.0/4 covers every multicast group', '10.255.0.9, because it is the source of the mapping information', '10.255.0.2, learned from an Auto-RP mapping agent'],
    answer: [0],
    explanation: "With several group-to-RP mappings, PIM first takes the longest matching group range (RFC 7761), then the best RP priority, then the hash. 239.10.10.10 matches both ranges, and /16 is longer than /4, so the RP is 10.255.0.2. `via bootstrap` means BSR: 10.255.0.9 is the bootstrap router that distributed the candidate-RP set, not an RP itself. Auto-RP mappings show `via Auto-RP`." },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));
