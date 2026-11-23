// Domain 4 — Network Assurance. Original questions modelled on Cisco's public exam-topic wording; no recalled exam content. Protocol facts checked against RFC 792/1812, 3411-3418, 5424/5426, 3954, 7011, 6241/6242, 8040 and draft-foschiano-erspan; IOS XE keywords and defaults against the IOS XE 17.18.1 YANG models; output layouts modelled on real IOS XE output in Cisco's genieparser test files. All device output is documentation-based and listed in REVIEW-TODO.md for checking on lab gear.
const L41D = '4.1-debugs';
const L41P = '4.1-ping-traceroute';
const L41S = '4.1-snmp';
const L41L = '4.1-syslog';
const L42 = '4.2-flexible-netflow';
const L43S = '4.3-span';
const L43R = '4.3-rspan';
const L43E = '4.3-erspan';
const L44 = '4.4-ip-sla';
const L45C = '4.5-catalyst-center';
const L45T = '4.5-traditional-workflows';
const L45A = '4.5-ai-workflows';
const L46N = '4.6-netconf';
const L46R = '4.6-restconf';

const bank = [
  // ---------- 4.1 Debugs ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41D,
    stem: 'Refer to the exhibit. An engineer connected to R1 over SSH enables the debug shown and then resets the OSPF neighbor on R2. The adjacency goes down and comes back, but no debug messages appear in the SSH session. What should the engineer do to see the messages in this session?',
    exhibit: `R1# debug ip ospf adj
OSPF adjacency debugging is on
R1# show logging | include logging:
Syslog logging: enabled (0 messages dropped, 0 messages rate-limited, 0 flushes, 0 overruns, xml disabled, filtering disabled)
    Console logging: disabled
    Monitor logging: level debugging, 0 messages logged, xml disabled,
    Buffer logging:  level warnings, 41 messages logged, xml disabled,
    Trap logging: level informational, 212 message lines logged`,
    options: ['Enter terminal monitor in the SSH session', 'Configure logging console debugging', 'Configure logging trap debugging', 'Configure logging monitor debugging'],
    answer: [0],
    explanation: "Debug messages are copied to VTY sessions only when the session has `terminal monitor` enabled; `logging monitor` is already at debugging, so the threshold is not the problem, and `terminal monitor` is the missing per-session switch. `logging console debugging` would send the output to the console line, not to the SSH session (and is the riskiest place for debugs). `logging trap debugging` sends to syslog servers. `logging monitor debugging` is already in effect, as the exhibit shows." },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41D,
    stem: 'An engineer must troubleshoot OSPF adjacency problems with one neighbor on GigabitEthernet0/0/1 of a busy production router. Which two actions reduce the risk that the debugging affects the router? (Choose two.)',
    options: ['Set debug condition interface GigabitEthernet0/0/1 before enabling debug ip ospf adj', 'Set logging console warnings (or disable console logging) and store debug output with logging buffered <size> debugging', 'Enable debug all and filter what is displayed with show logging | include GigabitEthernet0/0/1', 'Set logging console debugging so the output is visible immediately', 'Use debug ip packet without an access list so that every packet is examined once'],
    answer: [0, 1],
    explanation: "A condition limits debug output to events on that interface, and keeping debug output off the slow console while buffering it avoids the CPU cost of printing every message at 9600 baud. `debug all` generates every message regardless of a later `| include` filter, which only hides output on screen. Console logging at debugging is exactly what makes a debug dangerous. `debug ip packet` without an ACL prints every process-switched packet and is one of the most dangerous debugs." },

  // ---------- 4.1 Ping and traceroute ----------
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41P,
    stem: 'Refer to the exhibit. Users cannot reach 10.40.4.10. Enter the IP address of the hop that reports that its access list rejects the probes.',
    exhibit: `R1# traceroute 10.40.4.10 source Loopback0 numeric
Type escape sequence to abort.
Tracing the route to 10.40.4.10
VRF info: (vrf in name/id, vrf out name/id)
  1 10.1.12.2 1 msec 1 msec 1 msec
  2 10.1.23.3 1 msec 2 msec 1 msec
  3 10.1.34.4 !A  *  !A`,
    answer: ['10.1.34.4'],
    explanation: "`!A` means an ICMP destination unreachable with code 13, communication administratively prohibited (RFC 1812): the router that sent it, identified by 10.1.34.4 at hop 3, has an ACL that denies the UDP probes and returns unreachables. The `*` between the two `!A` results is the IOS default rate limit on ICMP unreachables (about one per 500 ms), not a separate fault. Hops 1 and 2 answered normally with time exceeded messages." },
  { topic: '4.1', type: 'fill', difficulty: 3, lesson: L41P,
    stem: 'Refer to the exhibit. Based on the sweep, enter the largest IP packet size in bytes that crosses the path to 10.2.2.2 unfragmented.',
    exhibit: `R1# ping
Protocol [ip]:
Target IP address: 10.2.2.2
Repeat count [5]: 1
Datagram size [100]:
Timeout in seconds [2]:
Extended commands [n]: y
Source address or interface: Loopback0
Type of service [0]:
Set DF bit in IP header? [no]: yes
Validate reply data? [no]:
Data pattern [0x0000ABCD]:
Loose, Strict, Record, Timestamp, Verbose[none]:
Sweep range of sizes [n]: y
Sweep min size [36]: 1396
Sweep max size [18024]: 1404
Sweep interval [1]: 1
Type escape sequence to abort.
Sending 9, [1396..1404]-byte ICMP Echos to 10.2.2.2, timeout is 2 seconds:
Packet sent with a source address of 10.255.0.1
Packet sent with the DF bit set
!!!!!MMMM
Success rate is 55 percent (5/9), round-trip min/avg/max = 1/1/2 ms`,
    answer: ['1400', '1400 bytes'],
    explanation: "With the DF bit set, sizes 1396 through 1400 succeed (five `!`) and 1401 through 1404 fail with `M`, which means a router returned ICMP type 3 code 4, fragmentation needed and DF set. The path MTU is therefore 1400 bytes; on IOS the ping size is the whole IP datagram, headers included. A value such as 1400 is typical of an IPsec or tunnel interface with `ip mtu 1400` in the path." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41P,
    stem: 'Refer to the exhibit. What is the most likely reason the second ping fails?',
    exhibit: `R1# ping 10.40.4.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.40.4.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms
R1# ping 10.40.4.10 source Loopback0
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.40.4.10, timeout is 2 seconds:
Packet sent with a source address of 10.255.0.1
.....
Success rate is 0 percent (0/5)
R1# show ip interface brief | include Loopback0
Loopback0              10.255.0.1      YES manual up                    up`,
    options: ['The routers between R1 and 10.40.4.10 have no route back to 10.255.0.1, so the replies are not delivered', 'Loopback0 is administratively down, so R1 cannot source packets from it', 'An inbound access list on Loopback0 blocks the outgoing echo requests', 'The destination discards echo requests larger than 100 bytes'],
    answer: [0],
    explanation: "The same destination answers when R1 sources the echo from its egress interface, so the forward path works. With `source Loopback0` the replies must be routed back to 10.255.0.1, and the dots (timeouts, not `U`) point to replies that never return, typically because the loopback is not advertised in the routing protocol. Loopback0 is up/up in the exhibit. An inbound ACL on a loopback does not filter packets the router originates. Both pings use 100-byte packets, so size cannot explain the difference." },

  // ---------- 4.1 SNMP ----------
  { topic: '4.1', type: 'single', difficulty: 3, lesson: L41S,
    stem: 'Refer to the exhibit. The NMS at 10.10.10.50 polls R1 as user nocuser with authPriv (SHA authentication and AES-128 encryption), and every request is rejected. What is the cause?',
    exhibit: `R1# show running-config | include snmp-server
snmp-server view NOC-VIEW iso included
snmp-server group NOC-GRP v3 priv read NOC-VIEW access SNMP-MGRS
snmp-server host 10.10.10.50 version 3 priv nocuser
R1# show snmp user

User name: nocuser
Engine ID: 800000090300AABBCC000100
storage-type: nonvolatile        active
Authentication Protocol: SHA
Privacy Protocol: None
Group-name: NOC-GRP`,
    options: ['nocuser was created without a privacy protocol and password, so it cannot use authPriv; re-create it with priv aes 128 <PRIV-PASSWORD>', 'nocuser has been deleted, because it does not appear in the running configuration', 'The view NOC-VIEW includes only the iso subtree, so MIB-2 objects are excluded', 'An SNMPv3 group cannot reference an access list, so the group never matches'],
    answer: [0],
    explanation: "`show snmp user` reports `Privacy Protocol: None`: the user was configured with authentication only. It cannot take part in authPriv exchanges, and the group requires `priv`. The fix is `snmp-server user nocuser NOC-GRP v3 auth sha <AUTH-PASSWORD> priv aes 128 <PRIV-PASSWORD>`. SNMPv3 users are never shown in the running configuration, so their absence there is normal; `show snmp user` proves the user exists. `iso` (1) is the root of the whole OID tree, so the view includes MIB-2. `access` on an SNMPv3 group is valid and simply limits which managers can use it." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41S,
    stem: 'Match each SNMP symptom to its most likely cause.',
    pairs: [
      ['show snmp shows SNMP packets input rising together with Unknown community name', 'The NMS is using the wrong community string'],
      ['Gets succeed, but every Set fails and Illegal operation for community name supplied rises', 'The community is configured RO'],
      ['The NMS times out and the SNMP packets input counter on the switch never changes', 'UDP 161 is filtered between the NMS and the switch'],
      ['SNMPv3 polls fail for every user right after snmp-server engineID local was changed', 'The localized user keys no longer match, so the users must be configured again'],
      ['Traps arrive from the uplink address and the NMS discards them because it expects the loopback address', 'snmp-server trap-source Loopback0 is missing'],
    ],
    explanation: "A rising input counter with `Unknown community name` means requests arrive with a string the agent does not know. `Illegal operation for community name supplied` counts Sets sent with an RO community. If the input counter never moves, the requests never reach the agent (filter, routing or VRF). SNMPv3 keys are localized to the engine ID (RFC 3414), so changing it invalidates every user. Without `snmp-server trap-source`, notifications are sourced from the egress interface." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41S,
    stem: 'Refer to the exhibit. Which statement about access through group OPS is true?',
    exhibit: `R1# show snmp group
groupname: OPS                              security model:v3 auth
contextname: <no context specified>         storage-type: nonvolatile
readview : OPS-VIEW                         writeview: <no writeview specified>
notifyview: <no notifyview specified>
row status: active`,
    options: ['Members must authenticate (authNoPriv or authPriv); encryption is not required, and they can read but not write', 'Members must use authPriv; requests without encryption are rejected', 'Members can send unauthenticated (noAuthNoPriv) requests because the group has no write view', 'Managers can use OPS as an SNMPv2c community string to read OPS-VIEW'],
    answer: [0],
    explanation: "`security model:v3 auth` sets the minimum security level to authNoPriv (RFC 3415: the access entry's level is the minimum required), so authenticated requests are accepted with or without privacy, and noAuthNoPriv requests are rejected. A read view is defined but no write view, so Gets are allowed and Sets are not. A group requiring encryption would show `v3 priv`. The missing write view affects Sets, not the security level. A v3 group name is not a v2c community string." },

  // ---------- 4.1 Syslog ----------
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41L,
    stem: 'Refer to the exhibit. Only the LINK message reaches the syslog server. Enter the logging trap severity keyword that delivers both messages while sending as few other messages as possible.',
    exhibit: `R1(config)# logging host 10.10.10.60
R1(config)# logging trap warnings

Messages that must reach 10.10.10.60:
%LINK-3-UPDOWN: Interface GigabitEthernet0/0/1, changed state to down
%OSPF-5-ADJCHG: Process 10, Nbr 10.255.0.2 on GigabitEthernet0/0/1 from FULL to DOWN, Neighbor Down: Interface down or detached`,
    answer: ['notifications', '5', 'logging trap notifications', 'logging trap 5'],
    explanation: "The number between the dashes is the severity: LINK-3 is errors (3) and OSPF-5 is notifications (5). `logging trap warnings` (4) sends levels 0 to 4, so the level 5 message is dropped. `logging trap notifications` (5) sends levels 0 to 5, which includes both messages and nothing less severe than notifications; `informational` (6) or `debugging` (7) would also work but send more." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41L,
    stem: 'Refer to the exhibit. The syslog server accepts messages only from 10.255.0.1, the address of R1 Loopback0, but R1 messages arrive from 10.1.12.1 and are discarded. Which command fixes the problem?',
    exhibit: `R1# show logging | section Trap
    Trap logging: level informational, 1204 message lines logged
        Logging to 10.10.10.60  (udp port 514, audit disabled,
              link up),
              1204 message lines logged,
              0 message lines rate-limited,
              0 message lines dropped-by-MD,
              xml disabled, sequence number disabled
              filtering disabled
        Logging Source-Interface:       VRF Name:`,
    options: ['logging source-interface Loopback0', 'logging host 10.255.0.1', 'logging origin-id ip', 'snmp-server trap-source Loopback0'],
    answer: [0],
    explanation: "The `Logging Source-Interface:` line is empty, so messages are sourced from the egress interface (10.1.12.1). `logging source-interface Loopback0` makes every syslog message use the loopback address. `logging host 10.255.0.1` would add R1's own loopback as a destination. `logging origin-id` adds an identifier inside the message text but does not change the IP source address the server filters on. `snmp-server trap-source` affects SNMP notifications, not syslog." },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41L,
    stem: 'Refer to the exhibit. Which two statements about this message are true? (Choose two.)',
    exhibit: `000412: *Nov 23 14:02:11.317 UTC: %SEC-6-IPACCESSLOGP: list WEB-IN denied tcp 198.51.100.23(51544) -> 10.20.0.15(22), 1 packet`,
    options: ['The message has severity 6, informational', 'The asterisk before the timestamp means the device clock is not authoritative, for example not synchronized by NTP', 'SEC is the syslog protocol facility that the server uses to sort the message into a file', 'The message is sent to a syslog server configured with logging trap warnings', '000412 is the line number of the ACL entry that matched'],
    answer: [0, 1],
    explanation: "In `%SEC-6-IPACCESSLOGP`, 6 is the severity (informational). A leading `*` marks a time that is not authoritative. SEC is the IOS facility (the component that raised the message); the syslog protocol facility on the wire is set separately (`local7` by default, `logging facility`). `logging trap warnings` sends only levels 0 to 4, so this level 6 message is not sent. 000412 is the message sequence number from `service sequence-numbers`." },

  // ---------- 4.2 Flexible NetFlow ----------
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42,
    stem: 'Refer to the exhibit. Traffic received on GigabitEthernet0/0/0 from the ISP must be recorded and exported, but the cache stays empty. Enter the interface configuration command that is missing.',
    exhibit: `R1# show running-config | section flow|interface GigabitEthernet0/0/0
flow record REC-WAN
 match ipv4 protocol
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 collect counter bytes long
 collect counter packets long
flow exporter EXP-NOC
 destination 10.10.10.70
 source Loopback0
 transport udp 2055
flow monitor MON-WAN
 exporter EXP-NOC
 record REC-WAN
interface GigabitEthernet0/0/0
 description WAN to ISP1
 ip address 203.0.113.2 255.255.255.252
R1# show flow interface GigabitEthernet0/0/0
R1#`,
    answer: ['ip flow monitor MON-WAN input'],
    explanation: "The record, exporter and monitor are complete, but no monitor is attached to the interface, which is why `show flow interface` prints nothing. Traffic received from the ISP is input traffic on Gi0/0/0, so the missing command is `ip flow monitor MON-WAN input`. An `output` monitor would record traffic sent to the ISP instead." },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42,
    stem: 'Refer to the exhibit. One RTP voice stream between two IP phones produces the two cache entries shown. Why?',
    exhibit: `R1# show flow record REC-VOICE
flow record REC-VOICE:
  Description:        User defined
  No. of users:       1
  Total field space:  30 bytes
  Fields:
    match ipv4 tos
    match ipv4 protocol
    match ipv4 source address
    match ipv4 destination address
    match transport source-port
    match transport destination-port
    collect counter bytes long
    collect counter packets long

R1# show flow monitor MON-VOICE cache format record
<cache header omitted>
IPV4 SOURCE ADDRESS:       10.1.30.21
IPV4 DESTINATION ADDRESS:  10.2.30.40
TRNS SOURCE PORT:          16384
TRNS DESTINATION PORT:     24580
IP TOS:                    0xB8
IP PROTOCOL:               17
counter bytes long:        480000
counter packets long:      2400

IPV4 SOURCE ADDRESS:       10.1.30.21
IPV4 DESTINATION ADDRESS:  10.2.30.40
TRNS SOURCE PORT:          16384
TRNS DESTINATION PORT:     24580
IP TOS:                    0x00
IP PROTOCOL:               17
counter bytes long:        40000
counter packets long:      200`,
    options: ['ToS is a key field (match ipv4 tos), so packets of the stream that arrive with ToS 0xB8 and with 0x00 form separate flows', 'The inactive timeout split the stream into two flows', 'collect counter bytes long creates one entry per DSCP value', 'Each entry is one direction of the call, because NetFlow records conversations in both directions as one record'],
    answer: [0],
    explanation: "Every `match` field is part of the flow key. The two entries share the 5-tuple and differ only in ToS: 0xB8 is DSCP 46 (EF) and 0x00 is best effort, so some packets of the stream are arriving unmarked (for example re-marked by an untrusted switch port), which is itself a useful QoS finding. A timeout exports and removes an entry; it does not create two simultaneous entries with different key values. `collect` fields are non-key and never split flows. Both entries have the same source and destination, so they are the same direction; NetFlow flows are unidirectional." },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L42,
    stem: 'Refer to the exhibit. The collector at 10.10.10.70 accepts only IPFIX on UDP port 4739. Which two exporter changes are required? (Choose two.)',
    exhibit: `R1# show flow exporter EXP-NOC
Flow Exporter EXP-NOC:
  Description:              User defined
  Export protocol:          NetFlow Version 9
  Transport Configuration:
    Destination type:       IP
    Destination IP address: 10.10.10.70
    Source IP address:      10.255.0.1
    Transport Protocol:     UDP
    Destination Port:       2055
    Source Port:            53124
    DSCP:                   0x0
    TTL:                    255
    Output Features:        Used`,
    options: ['export-protocol ipfix', 'transport udp 4739', 'transport tcp 4739', 'template data timeout 4739', 'ip flow monitor MON-WAN input ipfix'],
    answer: [0, 1],
    explanation: "The exporter sends NetFlow v9 to UDP 2055. IPFIX (RFC 7011, version 10) is selected with `export-protocol ipfix` and the port with `transport udp 4739` (the IANA IPFIX port). Flexible NetFlow exporters on IOS XE use UDP transport, so `transport tcp` is not the answer. `template data timeout` sets how often templates are re-sent, in seconds. The export format is a property of the exporter, not of the interface command." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42,
    stem: 'Refer to the exhibit. A 40-minute backup transfer appears in the collector as one large burst at the 30-minute mark and another when it ends, so the bandwidth graphs are misleading. Which change gives per-minute visibility of long-lived flows?',
    exhibit: `R1# show flow monitor MON-WAN
Flow Monitor MON-WAN:
  Description:       User defined
  Flow Record:       REC-WAN
  Flow Exporter:     EXP-NOC
  Cache:
    Type:                 normal (Platform cache)
    Status:               allocated
    Size:                 200000 entries
    Inactive Timeout:     15 secs
    Active Timeout:       1800 secs`,
    options: ['cache timeout active 60 under flow monitor MON-WAN', 'cache timeout inactive 60 under flow monitor MON-WAN', 'template data timeout 60 under flow exporter EXP-NOC', 'cache entries 60 under flow monitor MON-WAN'],
    answer: [0],
    explanation: "The active timeout exports a flow that is still active after that many seconds and starts a new record for it; at 1800 seconds a long transfer is reported only every 30 minutes. `cache timeout active 60` reports it every minute. The inactive timeout only applies when a flow stops sending, which does not help an active transfer. The template timeout controls how often templates are re-sent, not data. `cache entries` sets the cache size (and 60 entries would cause constant emergency aging)." },

  // ---------- 4.3 SPAN / RSPAN / ERSPAN ----------
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43E,
    stem: 'Refer to the exhibit. The analyzer at 10.50.0.10 receives no ERSPAN traffic, and R1 has a route to 10.50.0.10. What must the engineer do?',
    exhibit: `R1# show monitor session 10
Session 10
----------
Type                   : ERSPAN Source Session
Status                 : Admin Disabled
Source Ports           :
    Both               : Gi0/0/1
Destination IP Address : 10.50.0.10
MTU                    : 1464
Destination ERSPAN ID  : 110
Origin IP Address      : 10.255.0.1`,
    options: ['Enter no shutdown in monitor session 10', 'Swap the destination and origin IP addresses', 'Create a remote-span VLAN for the session', 'Change the session to type erspan-destination'],
    answer: [0],
    explanation: "`Status : Admin Disabled` shows the session is shut down; IOS XE creates ERSPAN sessions in the shutdown state, so `no shutdown` inside `monitor session 10 type erspan-source` is required. The destination (10.50.0.10, the analyzer) and origin (R1's loopback) are correct as shown. Remote-span VLANs belong to RSPAN, not ERSPAN. An erspan-destination session is configured on a receiving Cisco device, not on the source." },
  { topic: '4.3', type: 'fill', difficulty: 2, lesson: L43E,
    stem: 'Refer to the exhibit. R5 must decapsulate the ERSPAN traffic from SW1 and send the original frames out of GigabitEthernet0/0/2. Enter the command that is missing in the source submode of monitor session 20 on R5.',
    exhibit: `SW1# show running-config | section monitor session
monitor session 10 type erspan-source
 source interface GigabitEthernet1/0/5 both
 no shutdown
 destination
  erspan-id 210
  ip address 10.50.0.10
  origin ip address 10.255.0.11

R5# show running-config | section monitor session
monitor session 20 type erspan-destination
 destination interface GigabitEthernet0/0/2
 no shutdown
 source
  ip address 10.50.0.10`,
    answer: ['erspan-id 210'],
    explanation: "The destination session must accept the same session ID that the source puts in the ERSPAN header. SW1 sends with ERSPAN ID 210 to 10.50.0.10, R5's own address, which is already configured in R5's `source` submode. The missing line is `erspan-id 210`; local session numbers (10 and 20) do not have to match." },
  { topic: '4.3', type: 'match', difficulty: 2, lesson: L43S,
    stem: 'Match each monitoring requirement to the tool that fits it best.',
    pairs: [
      ['An IDS sensor is cabled to Gi1/0/48 on the same access switch as the monitored server', 'Local SPAN'],
      ['The analyzer is on a distribution switch two trunk hops away in the same switched campus, and the copies must stay at Layer 2', 'RSPAN'],
      ['The analyzer is in the data center and is reachable from the branch switch only through the routed WAN', 'ERSPAN'],
      ['A branch router has no spare port, and the engineer wants a short capture stored on the router and exported as a pcap file', 'Embedded Packet Capture'],
    ],
    explanation: "Local SPAN copies to a port on the same switch. RSPAN carries copies in a remote-span VLAN across trunks inside one Layer 2 domain. ERSPAN wraps the copies in GRE so they can be routed anywhere. Embedded Packet Capture (`monitor capture`) stores the packets in a buffer on the device itself and can export them as a pcap file, with no analyzer port needed." },
  { topic: '4.3', type: 'single', difficulty: 3, lesson: L43R,
    stem: 'Refer to the exhibit. SW1 connects to DSW1 Te1/1/1, and DSW1 Te1/1/2 connects to SW3. The analyzer on SW3 Gi1/0/24 receives nothing. What is the cause?',
    exhibit: `SW1# show monitor session 1
Session 1
---------
Type                     : Remote Source Session
Source Ports             :
    Both                 : Gi1/0/5
Dest RSPAN VLAN          : 900

DSW1# show interfaces trunk | begin allowed and active
Port        Vlans allowed and active in management domain
Te1/1/1     1,10,20,900
Te1/1/2     1,10,20

SW3# show monitor session 5
Session 5
---------
Type                     : Remote Destination Session
Source RSPAN VLAN        : 900
Destination Ports        : Gi1/0/24
    Encapsulation        : Native
          Ingress        : Disabled`,
    options: ['VLAN 900 is not allowed or not active on the DSW1 trunk toward SW3 (Te1/1/2)', 'The session numbers on SW1 and SW3 must be the same', 'SW3 needs monitor session 5 destination remote vlan 900 instead of source remote vlan 900', 'The SW3 destination port needs encapsulation replicate to receive RSPAN traffic'],
    answer: [0],
    explanation: "RSPAN copies travel in VLAN 900, which reaches DSW1 on Te1/1/1 but is missing from the allowed and active list on Te1/1/2, so the copies never reach SW3. Add VLAN 900 to the trunk's allowed list (and make sure it exists with `remote-span` on DSW1). Session numbers are local to each switch. `source remote vlan` is correct on the destination switch; `destination remote vlan` belongs on the source switch. `encapsulation replicate` only preserves tags on the copies and does not stop them arriving." },

  // ---------- 4.4 IP SLA ----------
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. Enter the next-hop address that R1 uses for its default route at this moment.',
    exhibit: `R1# show running-config | include ^ip route|^track
ip route 0.0.0.0 0.0.0.0 203.0.113.1 track 1
ip route 0.0.0.0 0.0.0.0 198.51.100.1 10
track 1 ip sla 10 reachability
R1# show track 1
Track 1
  IP SLA 10 reachability
  Reachability is Down
    3 changes, last change 00:00:42
  Delay up 30 secs, down 15 secs
  Latest operation return code: Timeout
  Tracked by:
    Static IP Routing 0`,
    answer: ['198.51.100.1'],
    explanation: "Track 1 is Down, so the static default route that depends on it (via 203.0.113.1, administrative distance 1) is removed from the routing table. The floating static default route via 198.51.100.1 with administrative distance 10 is then the best default route and is installed. It will be replaced again when track 1 has been Up for the 30-second up delay." },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. An IP SLA tracked default route worked after deployment, but about an hour later the track object stopped reacting to failures of the ISP gateway. What is the cause?',
    exhibit: `R1# show ip sla summary
IPSLAs Latest Operation Summary
Codes: * active, ^ inactive, ~ pending
All Stats are in milliseconds. Stats with u are in microseconds

ID           Type        Destination       Stats       ReturnCode  LastRun
-----------------------------------------------------------------------
^10          icmp-echo   203.0.113.1       RTT=3       OK          4 minutes ago

R1# show ip sla configuration 10 | include Life|Next
   Next Scheduled Start Time: Start Time already passed
   Life (seconds): 3600`,
    options: ['The operation was scheduled without life forever, so it stopped after the default life of 3600 seconds', 'The operation is still pending because no start time was given', 'The threshold is lower than the RTT, so the operation stopped', 'The IP SLA responder on 203.0.113.1 stopped answering'],
    answer: [0],
    explanation: "The `^` code marks the operation inactive, and the configuration shows a life of 3600 seconds: the default when `life forever` is omitted. After an hour the operation stops running, so the track object keeps its last state. Reschedule with `ip sla schedule 10 life forever start-time now` (removing the old schedule first). A pending operation would show `~`, and the start time has already passed. Exceeding the threshold produces an Over threshold return code; it does not stop an operation. An icmp-echo operation needs no responder, and the last run returned OK." },
  { topic: '4.4', type: 'order', difficulty: 2, lesson: L44,
    stem: 'R1 tracks the ISP1 gateway with IP SLA 10, track 1 (reachability, delay down 15) and a tracked static default route via 203.0.113.1, with a floating static default route via 198.51.100.1 at distance 10. Put the events of a failover in the order in which they happen.',
    items: ['Probes from GigabitEthernet0/0/0 to 203.0.113.1 stop receiving echo replies', 'The latest return code of operation 10 changes to Timeout', 'Failures continue for the 15-second down delay and track 1 changes to Down', 'The static default route via 203.0.113.1 is removed from the routing table', 'The floating static default route via 198.51.100.1 is installed'],
    explanation: "The operation detects the failure first (no replies within the timeout, return code Timeout). The track object follows the operation but waits for `delay down 15` before changing to Down. Only the state change of track 1 removes the tracked static route, and once it is gone the floating static with distance 10 is the best remaining default route and is installed." },
  { topic: '4.4', type: 'multi', difficulty: 3, lesson: L44,
    stem: 'Refer to the exhibit. Track 2 is configured with track 2 ip sla 20 reachability and track 3 with track 3 ip sla 20 state. Which two statements are true at this moment? (Choose two.)',
    exhibit: `R1# show ip sla configuration 20 | include Threshold|timeout
Operation timeout (milliseconds): 1000
Threshold (milliseconds): 500
R1# show ip sla statistics 20
IPSLAs Latest Operation Statistics

IPSLA operation id: 20
        Latest RTT: 620 milliseconds
Latest operation start time: 11:40:05 UTC Mon Nov 23 2026
Latest operation return code: Over threshold
Number of successes: 1210
Number of failures: 0
Operation time to live: Forever`,
    options: ['Track 2 is Up', 'Track 3 is Down', 'Track 2 is Down because the RTT exceeded the threshold', 'Track 3 is Up because the target answered within the timeout', 'Raising the timeout to 2000 ms would bring track 3 Up'],
    answer: [0, 1],
    explanation: "The reply arrived in 620 ms: inside the 1000 ms timeout but above the 500 ms threshold, so the return code is Over threshold. A `reachability` track is Up for OK or Over threshold, so track 2 is Up. A `state` track is Up only for OK, so track 3 is Down. The timeout does not affect the threshold comparison; only raising the threshold above the RTT (or a faster path) would return OK." },

  // ---------- 4.5 Catalyst Center ----------
  { topic: '4.5', type: 'match', difficulty: 2, lesson: L45T,
    stem: 'Match each requirement to the Catalyst Center capability that fulfils it.',
    pairs: [
      ['Thirty new Catalyst 9300 switches will be cabled in a new building and must get their first configuration without anyone connecting a console cable', 'Plug and Play onboarding'],
      ['Every Catalyst 9300 must run the release the team approved, upgraded in a maintenance window with pre- and post-checks', 'Software Image Management (SWIM) with a golden image'],
      ['The same uplink, VLAN and QoS lines, with per-site variables, must be pushed to every access switch', 'Configuration templates'],
      ['A user cannot reach an application server and the engineer wants the hop-by-hop path with the ACLs along it', 'Path trace'],
      ['NTP and syslog servers must be defined once for a building and applied to every device assigned to it', 'Network settings in the site hierarchy'],
    ],
    explanation: "Plug and Play onboards unconfigured devices (DHCP option 43, DNS or PnP Connect, then a claim with a Day-0 template). SWIM marks a golden image and distributes and activates it with readiness, pre- and post-checks. Templates (Velocity or Jinja2) carry CLI with variables. Path trace, an Assurance tool, computes the path and shows ACLs on it. Network settings defined at a level of the Global > Area > Building > Floor hierarchy are inherited by the devices assigned below it." },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45A,
    stem: 'Refer to the exhibit. Client onboarding time at Branch-12 rose from a typical 2 seconds to 6 seconds. No onboarding threshold was crossed, yet Catalyst Center raised the issue summarised in the exhibit. Which capability raised it?',
    exhibit: `GET /dna/intent/api/v1/issues?siteId=<SITE-ID>&aiDriven=YES

Issue summary (from the response):
  Name:       Onboarding time higher than baseline at Branch-12
  Priority:   P3
  Status:     Active
  AI driven:  Yes`,
    options: ['AI Network Analytics, which compares KPIs with dynamic baselines learned for each site', 'The Machine Reasoning Engine, which raises an issue whenever a configured threshold is crossed', 'Configuration compliance, which detects drift between the running configuration and the intended settings', 'Path trace, which measures onboarding time hop by hop'],
    answer: [0],
    explanation: "An AI-driven issue (filterable with the `aiDriven` parameter of the issues API) comes from AI Network Analytics: machine-learning models learn what is normal for that site and time and flag significant deviations, even when no static threshold is crossed. The Machine Reasoning Engine runs knowledge-based troubleshooting workflows; it does not raise threshold issues. Compliance compares configuration and images with intent. Path trace computes a path between two endpoints; it does not measure onboarding." },
  { topic: '4.5', type: 'multi', difficulty: 2, lesson: L45C,
    stem: 'Which two statements describe the Catalyst Center Intent API? (Choose two.)',
    options: ['It is a northbound REST API that uses HTTPS and JSON', 'Clients obtain a token from /dna/system/api/v1/auth/token with HTTP basic authentication and send it with later requests', 'It is the southbound NETCONF interface on TCP 830 that devices use to download templates', 'Every request must be authenticated with an SNMPv3 user', 'It supports only GET, because configuration changes are possible only in the GUI'],
    answer: [0, 1],
    explanation: "The Intent API is the northbound interface for applications: REST over HTTPS with JSON and standard verbs (GET, POST, PUT, DELETE). Authentication uses a token obtained by a POST with basic authentication to `/dna/system/api/v1/auth/token`, then sent in the `X-Auth-Token` header. Catalyst Center uses NETCONF, SSH and SNMP southbound toward devices; that is not the Intent API. SNMPv3 is a device management protocol, not API authentication. The API also creates and changes objects (POST, PUT, DELETE), for example provisioning and templates." },
  { topic: '4.5', type: 'order', difficulty: 2, lesson: L45T,
    stem: 'A new Catalyst 9300 is unboxed and cabled at a branch. Put the Plug and Play onboarding steps in order.',
    items: ['The switch boots with no startup configuration and starts its PnP agent', 'It obtains an IP address and DHCP option 43 pointing to Catalyst Center', 'It contacts Catalyst Center and appears as an unclaimed device', 'An administrator claims it to a site with a Day-0 template and golden image', 'Catalyst Center upgrades the image if needed and applies the Day-0 configuration', 'The switch is listed in inventory as a managed device'],
    explanation: "PnP starts only on a device with no configuration. The agent needs an IP address and a way to find the PnP server (here DHCP option 43; DNS or PnP Connect also work). The device then contacts Catalyst Center and waits as unclaimed until someone, or a rule, claims it to a site with a template and image. Catalyst Center then provisions it, and the finished device is added to inventory as managed." },

  // ---------- 4.6 NETCONF and RESTCONF ----------
  { topic: '4.6', type: 'order', difficulty: 2, lesson: L46N,
    stem: 'A script must change R1 through the NETCONF candidate datastore and keep other sessions from changing the candidate until the change is active. Put the steps in order.',
    items: ['Open an SSH session to TCP port 830 and request the netconf subsystem', 'Exchange <hello> messages and confirm that the candidate capability is advertised', '<lock> the candidate datastore', 'Send <edit-config> with target candidate', 'Send <commit>', '<unlock> the candidate datastore', 'Send <close-session>'],
    explanation: "NETCONF runs as an SSH subsystem on port 830, and both sides must send their hello and capabilities before any RPC. The candidate datastore is used only if `:candidate` is advertised. Locking first prevents other sessions from editing the candidate; the edit is staged, then committed to running, and only then is the lock released, so nobody can interfere before the change is active. `<close-session>` ends the session cleanly." },
  { topic: '4.6', type: 'fill', difficulty: 2, lesson: L46N,
    stem: 'Refer to the exhibit. The script fails when it sends edit-config with target candidate. Enter the IOS XE global configuration command that makes the candidate datastore available.',
    exhibit: `R1# show netconf-yang status
netconf-yang: enabled
netconf-yang candidate-datastore: disabled
netconf-yang side-effect-sync: enabled
netconf-yang ssh port: 830

Client log, capabilities in the server hello (protocol capabilities only):
  urn:ietf:params:netconf:base:1.0
  urn:ietf:params:netconf:base:1.1
  urn:ietf:params:netconf:capability:writable-running:1.0
  urn:ietf:params:netconf:capability:xpath:1.0
  urn:ietf:params:netconf:capability:validate:1.1
  urn:ietf:params:netconf:capability:rollback-on-error:1.0`,
    answer: ['netconf-yang feature candidate-datastore'],
    explanation: "`netconf-yang candidate-datastore: disabled` and the absence of `urn:ietf:params:netconf:capability:candidate:1.0` in the hello show that only the running datastore can be edited. `netconf-yang feature candidate-datastore` enables the candidate datastore, after which the server advertises `:candidate` and accepts edit-config to candidate followed by commit. Reconnect the session afterwards so a new hello is received." },
  { topic: '4.6', type: 'fill', difficulty: 2, lesson: L46N,
    stem: 'Refer to the exhibit. The automation must delete Loopback200 when it exists and do nothing, without an error, when it does not. Enter the value of the operation attribute that does this.',
    exhibit: `<rpc message-id="101" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <edit-config>
    <target><running/></target>
    <config>
      <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
        <interface>
          <Loopback xmlns:nc="urn:ietf:params:xml:ns:netconf:base:1.0" nc:operation="delete">
            <name>200</name>
          </Loopback>
        </interface>
      </native>
    </config>
  </edit-config>
</rpc>

<rpc-reply message-id="101" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <rpc-error>
    <error-type>application</error-type>
    <error-tag>data-missing</error-tag>
    <error-severity>error</error-severity>
  </rpc-error>
</rpc-reply>`,
    answer: ['remove', 'nc:operation="remove"', 'operation="remove"'],
    explanation: "Loopback200 does not exist, and `delete` is strict: RFC 6241 returns an rpc-error with error-tag `data-missing` when the data is absent. `remove` deletes the data when it exists and is silently ignored when it does not, which is what idempotent automation needs." },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46R,
    stem: 'Refer to the exhibit. After the script runs, Loopback100 has lost its IP address. Why?',
    exhibit: `Before:
interface Loopback100
 description Managed by RESTCONF
 ip address 10.100.100.1 255.255.255.255

Script:
url = BASE + "/Cisco-IOS-XE-native:native/interface/Loopback=100"
body = {"Cisco-IOS-XE-native:Loopback": {"name": 100, "description": "Customer A test"}}
r = requests.put(url, auth=AUTH, headers=HEADERS, json=body, verify=False)
print(r.status_code)

Output:
204

After:
interface Loopback100
 description Customer A test
 no ip address`,
    options: ['PUT replaces the whole Loopback100 resource with the body, which contains no IP address; PATCH would have merged only the description', 'JSON encoding cannot carry IP addresses, so they are always removed', 'verify=False makes the device apply the request in replace mode', 'The 204 status code means the request failed and the device rolled back the interface'],
    answer: [0],
    explanation: "A RESTCONF PUT creates or replaces the target resource: everything under Loopback=100 that is not in the body is removed. A PATCH (plain patch) merges the body into the existing resource, changing only the description. JSON can carry any YANG data, including `ip/address/primary`. `verify=False` only disables TLS certificate checking on the client. 204 No Content is the success code for a PUT that replaced an existing resource." },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46R,
    stem: 'Refer to the exhibit. Why does the request fail?',
    exhibit: `POST /restconf/data/Cisco-IOS-XE-native:native/interface HTTP/1.1
Host: 192.0.2.10
Authorization: Basic <BASE64-CREDENTIALS>
Content-Type: application/yang-data+json
Accept: application/yang-data+json

{"Cisco-IOS-XE-native:Loopback": {"name": 100, "description": "Lab"}}

HTTP/1.1 409 Conflict
Content-Type: application/yang-data+json

{
  "ietf-restconf:errors": {
    "error": [
      {
        "error-type": "application",
        "error-tag": "data-exists"
      }
    ]
  }
}`,
    options: ['Loopback100 already exists, and POST only creates new resources; use PUT or PATCH on .../interface/Loopback=100 instead', 'The Content-Type must be application/json for IOS XE', 'The user is not authorized at privilege level 15', 'A POST must target the new resource itself, .../interface/Loopback=100, not its parent'],
    answer: [0],
    explanation: "RFC 8040 POST creates a child resource and must fail with 409 Conflict and error-tag `data-exists` if it already exists; that is this response. PUT (create or replace) or PATCH (merge) on the resource URI changes an existing loopback. `application/yang-data+json` is the correct RESTCONF media type; a wrong type would give 400 or 415. An authorization problem gives 401 or 403, not 409. POST is sent to the parent of the resource being created, as in the exhibit." },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46R,
    stem: 'Refer to the exhibit. RESTCONF requests to R1 fail. Which command fixes the problem?',
    exhibit: `R1# show running-config | include restconf|ip http
no ip http server
no ip http secure-server
restconf
R1# show platform software yang-management process | include nginx
nginx            : Not Running

$ curl -k -u netops:ExamplePass123 https://192.0.2.10/restconf/data/Cisco-IOS-XE-native:native/hostname
curl: (7) Failed to connect to 192.0.2.10 port 443: Connection refused`,
    options: ['ip http secure-server', 'netconf-yang', 'ip http server', 'netconf-yang ssh port 443'],
    answer: [0],
    explanation: "RESTCONF is served by the HTTPS server (nginx in the yang-management processes), so `restconf` alone is not enough: with `no ip http secure-server` nothing listens on TCP 443 and curl gets connection refused. `ip http secure-server` fixes it. `netconf-yang` enables NETCONF over SSH, a different service. `ip http server` enables plain HTTP, which is not what the https:// request uses. The NETCONF SSH port has nothing to do with RESTCONF. The credentials in the exhibit are examples." },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
