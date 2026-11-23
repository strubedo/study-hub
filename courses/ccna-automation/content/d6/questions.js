// Domain 6 — Network Fundamentals. Original questions. Ports follow the IANA port registry; MAC structure follows RFC 9542; 802.1Q facts follow the IEEE EtherType registry and IEEE 802.1Q-2005 clause 9.6 as cited by Wikipedia and the Wireshark VLAN page; addressing follows RFC 1918, 3021, 4291, 4632, 5737 and 8200; route selection follows RFC 1812; DHCP follows RFC 2131; DNS follows RFC 1034/1035 and 7766; NAT follows RFC 2663, 3022 and 4787; SNMP follows RFC 3411, 3416 and 3417; NTP follows RFC 5905; TCP reset behaviour follows RFC 9293; PMTUD follows RFC 1191 and 8201; 407 follows RFC 9110; proxy variables follow the requests and curl documentation. Python exception lines were built offline from the requests 2.34 / urllib3 2.8 exception classes (no network traffic), with the object address replaced by a fixed value; IOS and other device output is written in the documented format, not captured. Every subnet value was checked with Python's ipaddress module.
const L61 = '6.1-mac-vlans';
const L62 = '6.2-ip-routing';
const L63 = '6.3-network-components';
const L64 = '6.4-topology-diagrams';
const L65 = '6.5-device-planes';
const L66 = '6.6-ip-services';
const L67 = '6.7-port-values';
const L68 = '6.8-connectivity-issues';
const L69 = '6.9-network-constraints';

const RT = `rtr01# show ip route
Codes: L - local, C - connected, S - static, O - OSPF, * - candidate default
       (legend shortened)

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 9 subnets, 5 masks
C        10.0.12.0/30 is directly connected, GigabitEthernet0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/1
C        10.0.13.0/30 is directly connected, GigabitEthernet0/2
L        10.0.13.1/32 is directly connected, GigabitEthernet0/2
C        10.1.10.0/24 is directly connected, GigabitEthernet0/3
L        10.1.10.1/32 is directly connected, GigabitEthernet0/3
O        10.10.0.0/16 [110/20] via 10.0.12.2, 00:14:02, GigabitEthernet0/1
S        10.10.20.0/24 [1/0] via 10.0.13.2
O        10.10.20.128/25 [110/30] via 10.0.12.2, 00:14:02, GigabitEthernet0/1
      203.0.113.0/24 is variably subnetted, 2 subnets, 2 masks
C        203.0.113.0/30 is directly connected, GigabitEthernet0/0
L        203.0.113.2/32 is directly connected, GigabitEthernet0/0`;

const TOPO = `                              Internet
                                 |
                        ISP router 203.0.113.1
                                 |
            outside 203.0.113.2/29
     +------------------------------+   NAT: inside users -> PAT to 203.0.113.2
     |  fw01  (stateful firewall)   |   NAT: static 203.0.113.5 <-> 172.16.50.10
     +------------------------------+
       inside 10.0.1.1/30     dmz 172.16.50.1/24
            |                        |
            |                  +-------------------------------+
            |                  | lb01  VIP 172.16.50.10 tcp/443 |  TLS terminated here
            |                  | SNAT to 172.16.50.5            |  health check GET /health
            |                  +-------------------------------+
            |                        |  pool tcp/8443
            |              +---------+---------+
            |           web01 172.16.50.21  web02 172.16.50.22
            |
     Gi1/0/1 10.0.1.2/30
     +------------------------------+
     |  core01  (Layer 3 switch)    |   SVI Vlan10 10.1.10.1/24 (users)
     |  default route -> 10.0.1.1   |   SVI Vlan20 10.1.20.1/24 (servers)
     +------------------------------+
       Gi1/0/48 trunk: allowed 10,20  native 99
            |
     +------------------------------+
     |  acc01  (access switch)      |
     +------------------------------+
       Gi1/0/5  access vlan 10 -- dev-pc   10.1.10.25/24  gw 10.1.10.1
       Gi1/0/12 access vlan 20 -- inv-api  10.1.20.30/24  gw 10.1.20.1  listens tcp/5000`;

const bank = [
  // ---------- 6.1 MAC addresses and VLANs ----------
  { topic: '6.1', type: 'single', difficulty: 2, lesson: L61,
    stem: 'Refer to the exhibit. Ports Gi1/0/1 to Gi1/0/4 are access ports in VLAN 10, and Gi1/0/48 is a trunk that carries VLAN 10. A frame arrives on Gi1/0/1 with source MAC 0000.5e00.5311 and destination MAC 0000.5e00.5399. What does sw01 do with the frame?',
    exhibit: `sw01# show mac address-table vlan 10
          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    0000.5e00.5311    DYNAMIC     Gi1/0/1
  10    0000.5e00.5312    DYNAMIC     Gi1/0/2
  10    0000.5e00.5313    DYNAMIC     Gi1/0/3
Total Mac Addresses for this criterion: 3`,
    options: [
      'Drops it, because the destination MAC address is not in the table',
      'Sends it only out Gi1/0/48, because unknown destinations are always sent to the trunk',
      'Sends an ARP request for 0000.5e00.5399 and holds the frame until a reply arrives',
      'Floods it out Gi1/0/2, Gi1/0/3, Gi1/0/4 and Gi1/0/48, because the destination is unknown unicast in VLAN 10',
    ],
    answer: [3],
    explanation: 'The switch refreshes its entry for the **source** MAC on Gi1/0/1, then looks up the **destination**. 0000.5e00.5399 is not in the VLAN 10 table, so this is **unknown unicast**, which a switch **floods** out every port in the same VLAN except the ingress port: Gi1/0/2, Gi1/0/3, Gi1/0/4 and the trunk Gi1/0/48 (tagged VLAN 10). Switches do not drop unknown unicast. There is no rule that unknown destinations go only to a trunk. ARP resolves IP addresses to MACs and is done by hosts and routers, not by a Layer 2 switch forwarding a frame.' },
  { topic: '6.1', type: 'multi', difficulty: 2, lesson: L61,
    stem: 'An inventory script reads the MAC address `02:00:5e:00:53:2a` from a client table. Which two statements about this address are true? (Choose two.)',
    options: [
      'It is a multicast address',
      'It is locally administered, so its first three octets do not identify the manufacturer',
      'It is a unicast address',
      'It is the Ethernet broadcast address',
      'It is a globally unique address burned in by the manufacturer under its OUI',
    ],
    answer: [1, 2],
    explanation: 'The first octet is `0x02` = `0000 0010`. The **group bit** (`0x01`) is 0, so it is **unicast**. The **local bit** (`0x02`) is 1, so it is **locally administered** (for example a randomised Wi-Fi privacy address or a software-assigned virtual MAC); RFC 9542 says the OUI holder has no authority over such addresses, so the first octets say nothing about the vendor. It is not multicast (that needs the group bit set). Broadcast is `ff:ff:ff:ff:ff:ff`. A globally unique burned-in address has the local bit 0.' },
  { topic: '6.1', type: 'fill', difficulty: 2, lesson: L61,
    stem: 'Refer to the exhibit. A script configured this Meraki switch port with the Dashboard API. The connected switch sends an untagged frame on this link. In which VLAN does the Meraki switch place the frame? Enter the VLAN ID.',
    exhibit: `PUT /api/v1/devices/Q2XX-EXAM-0001/switch/ports/24
{
  "name": "Uplink to acc01",
  "type": "trunk",
  "vlan": 99,
  "allowedVlans": "10,20,30,99"
}`,
    answer: ['99', 'vlan 99'],
    explanation: 'For a trunk port, the Meraki API reference states that `vlan` is the **native VLAN**. Untagged frames received on an 802.1Q trunk belong to the native VLAN, so the frame is placed in **VLAN 99**. `allowedVlans` lists which VLANs may cross the trunk; the tagged ones (10, 20, 30) arrive with their VLAN ID in the 802.1Q tag.' },
  { topic: '6.1', type: 'single', difficulty: 2, lesson: L61,
    stem: 'Refer to the exhibit. A developer validates VLAN IDs before sending them to a switch API. Which change makes the check accept exactly the VLAN IDs that can be configured under IEEE 802.1Q?',
    exhibit: `def valid_vlan(vid: int) -> bool:
    return 0 <= vid <= 4095`,
    options: [
      'return 1 <= vid <= 4096',
      'return 0 <= vid <= 4094',
      'return 1 <= vid <= 1005',
      'return 1 <= vid <= 4094',
    ],
    answer: [3],
    explanation: 'The 802.1Q VID is **12 bits** (0 to 4095), and the values **0 and 4095 are reserved**: 0 marks a priority-tagged frame with no VLAN, 4095 is reserved for implementation use. Usable VLANs are **1 to 4094**. 4096 does not fit in 12 bits. Allowing 0 accepts a reserved value. 1 to 1005 is only the Cisco normal range and wrongly rejects the extended range 1006 to 4094.' },

  // ---------- 6.2 IP addresses, routes, masks, gateways ----------
  { topic: '6.2', type: 'fill', difficulty: 2, lesson: L62,
    stem: 'Refer to the exhibit. Enter the broadcast address of the subnet this host is in.',
    exhibit: `C:\\> ipconfig

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . : corp.example.com
   IPv4 Address. . . . . . . . . . . : 192.168.10.77
   Subnet Mask . . . . . . . . . . . : 255.255.255.192
   Default Gateway . . . . . . . . . : 192.168.10.65`,
    answer: ['192.168.10.127'],
    explanation: 'Mask 255.255.255.192 is **/26**, so the block size in the last octet is 256 − 192 = 64. The blocks start at 0, 64, 128 and 192; 77 is in the **64** block. Network 192.168.10.64, usable hosts .65 to .126 (62 hosts, which includes the gateway .65), broadcast **192.168.10.127**.' },
  { topic: '6.2', type: 'fill', difficulty: 2, lesson: L62,
    stem: 'Refer to the exhibit. rtr01 receives a packet for 10.10.20.200. Enter the next-hop IP address it forwards the packet to.',
    exhibit: RT,
    answer: ['10.0.12.2'],
    explanation: 'Four routes contain 10.10.20.200: `0.0.0.0/0`, `10.10.0.0/16`, `10.10.20.0/24` and `10.10.20.128/25` (which covers .128 to .255). **Longest prefix match** chooses the **/25**, learned by OSPF via **10.0.12.2** out GigabitEthernet0/1. The static /24 has a better administrative distance (1 versus 110), but distance is only compared between routes to the *same* prefix, so it does not matter here.' },
  { topic: '6.2', type: 'single', difficulty: 3, lesson: L62,
    stem: 'Refer to the exhibit. rtr01 receives a packet for 10.10.20.50. Out of which interface does it leave?',
    exhibit: RT,
    options: [
      'GigabitEthernet0/1, via 10.0.12.2, because OSPF routes are preferred for subnets learned by OSPF',
      'GigabitEthernet0/2, because the static 10.10.20.0/24 is the longest match and its next hop 10.0.13.2 is on the connected 10.0.13.0/30',
      'GigabitEthernet0/0, because static routes without an interface use the default route',
      'GigabitEthernet0/1, because 10.10.20.128/25 is the most specific route in the 10.10.20.0 range',
    ],
    answer: [1],
    explanation: '10.10.20.50 is in `10.10.0.0/16` and `10.10.20.0/24` (and the default) but **not** in `10.10.20.128/25`, which covers only .128 to .255. The longest match is the static **/24** via 10.0.13.2. The router then resolves that next hop: 10.0.13.2 is in the connected **10.0.13.0/30** on **GigabitEthernet0/2**. OSPF has no preference over static for different prefixes; the /16 via Gi0/1 is shorter. A static route with a next-hop address is resolved through the routing table, here the connected route, not the default route. The /25 does not contain .50.' },
  { topic: '6.2', type: 'single', difficulty: 1, lesson: L62,
    stem: 'Refer to the exhibit. The network team must choose the smallest IPv4 prefix for the new camera VLAN. Which prefix should they use?',
    exhibit: `Address plan request
VLAN 40  CAMERAS
  Cameras now:            48
  Expected growth:        +8
  Gateway (SVI):          1 address
  Total addresses needed: 57 usable`,
    options: ['/25', '/27', '/26', '/28'],
    answer: [2],
    explanation: 'A **/26** has 64 addresses and **62 usable** hosts, which covers 57. A **/27** has only 30 usable and a /28 only 14. A /25 (126 usable) works but is not the smallest that fits.' },
  { topic: '6.2', type: 'multi', difficulty: 2, lesson: L62,
    stem: 'A host is configured as 10.40.8.100/23. Which two addresses can be assigned to other hosts in the same subnet? (Choose two.)',
    options: ['10.40.7.250', '10.40.9.20', '10.40.8.0', '10.40.8.1', '10.40.9.255', '10.40.10.1'],
    answer: [1, 3],
    explanation: 'A /23 has a block size of 2 in the third octet, so 10.40.8.100 is in **10.40.8.0/23**: network 10.40.8.0, broadcast 10.40.9.255, hosts 10.40.8.1 to 10.40.9.254 (510 usable). **10.40.9.20** and **10.40.8.1** are usable hosts in it. 10.40.8.0 is the network address and 10.40.9.255 the broadcast address, so neither can be assigned to a host. 10.40.7.250 is in 10.40.6.0/23 and 10.40.10.1 in 10.40.10.0/23.' },
  { topic: '6.2', type: 'single', difficulty: 2, lesson: L62,
    stem: 'Refer to the exhibit. A Linux automation server can reach other hosts in its own subnet, but every request to devices in other subnets fails. What is the cause?',
    exhibit: `$ ip -4 addr show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    inet 10.1.10.25/24 brd 10.1.10.255 scope global eth0
       valid_lft forever preferred_lft forever
$ ip route
default via 10.1.20.1 dev eth0 onlink
10.1.10.0/24 dev eth0 proto kernel scope link src 10.1.10.25`,
    options: [
      'The default gateway 10.1.20.1 is not in the host\'s subnet 10.1.10.0/24, so the host cannot reach it',
      'The subnet mask is too long; a /24 cannot reach other subnets',
      'The connected route for 10.1.10.0/24 is preferred over the default route for all destinations',
      'The broadcast address 10.1.10.255 blocks routed traffic',
    ],
    answer: [0],
    explanation: 'A host sends non-local packets to its **default gateway**, which it must reach directly by ARP, so the gateway has to be **in the host\'s own subnet**. 10.1.20.1 is outside 10.1.10.0/24 (the gateway should be 10.1.10.1 or another address in that subnet). Linux accepts such a gateway only with the `onlink` flag, as here, which makes the host ARP for 10.1.20.1 on eth0 anyway; nothing in this VLAN answers for that address, so every off-subnet packet is lost. Local traffic works because it uses the connected route. Any mask can reach other subnets through a gateway. The connected route is used only for destinations inside 10.1.10.0/24 (longest match); everything else matches the default. The broadcast address has nothing to do with routing unicast traffic.' },
  { topic: '6.2', type: 'single', difficulty: 2, lesson: L62,
    stem: 'Which is a valid shortened form of the IPv6 address 2001:0db8:0000:0000:0010:0000:0000:0025?',
    options: ['2001:db8::10::25', '2001:db8:0:0:1:0:0:25', '2001:db8::10:0:0:25', '2001:db8::1:25'],
    answer: [2],
    explanation: 'Leading zeros may be dropped in each group (`0db8` to `db8`, `0010` to `10`, `0025` to `25`), and **one** run of consecutive all-zero groups may be replaced by `::`. `2001:db8::10:0:0:25` replaces the first run and keeps the second as `0:0`, which is valid (RFC 5952 also prefers this form, since both runs are the same length and the first is shortened). Using `::` twice is ambiguous and invalid. `1` is not the same group as `0010` (only *leading* zeros can be dropped, giving `10`). `2001:db8::1:25` both loses a group and changes `10` to `1`.' },
  { topic: '6.2', type: 'multi', difficulty: 2, lesson: L62,
    stem: 'Refer to the exhibit. The same packet is captured on rtr01\'s inbound interface and on its outbound interface. rtr01 routes the packet and performs no NAT. Which three fields have different values in the second capture? (Choose three.)',
    exhibit: `Capture 1 (arriving at rtr01 Gi0/3 from dev-pc)
  Ethernet  src 00:00:5e:00:53:25  dst 00:00:5e:00:53:01
  IPv4      src 10.1.10.25  dst 198.51.100.20  TTL 64
  TCP       src port 51012  dst port 443  flags SYN`,
    options: [
      'Ethernet source MAC',
      'Ethernet destination MAC',
      'IPv4 source address',
      'IPv4 destination address',
      'IPv4 TTL',
      'TCP destination port',
    ],
    answer: [0, 1, 4],
    explanation: 'A router builds a **new Layer 2 header** for the next link: the source MAC becomes the outbound interface\'s MAC and the destination MAC becomes the next hop\'s MAC. It also **decrements the TTL** (64 to 63). Without NAT the **IP source and destination stay the same** end to end, and routers do not change TCP ports.' },

  // ---------- 6.3 Network components ----------
  { topic: '6.3', type: 'single', difficulty: 2, lesson: L63,
    stem: 'Refer to the exhibit. The edge router performs PAT for inside users to 203.0.113.2. After this ACL is applied, inside users can no longer open HTTPS sessions to internet APIs, while internet clients can still reach the server at 203.0.113.5. Why?',
    exhibit: `ip access-list extended FROM-INTERNET
 permit tcp any host 203.0.113.5 eq 443
 deny   ip any any log
!
interface GigabitEthernet0/0
 description to ISP
 ip access-group FROM-INTERNET in`,
    options: [
      'The ACL blocks outbound packets from inside users, because an inbound ACL filters both directions',
      'The ACL is a stateless filter: replies from internet servers to 203.0.113.2 arrive inbound on Gi0/0, match no permit and are denied',
      'PAT cannot be used on an interface that has an ACL applied',
      'The deny statement must come before the permit statement for return traffic to work',
    ],
    answer: [1],
    explanation: 'A router ACL is a **stateless** packet filter: each packet is checked on its own and it keeps no record of the outbound connections. The users\' outbound SYNs leave freely (the ACL is only applied **in**), but the replies from servers such as 198.51.100.20:443 to 203.0.113.2 arrive inbound on Gi0/0, match only the final deny, and are dropped. A **stateful** firewall would permit them automatically as part of a known session. An inbound ACL does not filter outbound packets. PAT and ACLs work together on the same interface. Putting the deny first would block everything, including the published server.' },
  { topic: '6.3', type: 'match', difficulty: 2, lesson: L63,
    stem: 'Match each requirement to the network component whose function it describes.',
    pairs: [
      ['Send HTTPS requests for one virtual IP to four web servers and stop using a server that fails its health check', 'Load balancer'],
      ['Forward a frame only out the port where its destination MAC address was learned in that VLAN', 'Switch'],
      ['Choose the next hop for packets to 10.30.0.0/16 from routes learned with OSPF', 'Router'],
      ['Allow the reply to an inside user\'s outbound connection because it matches an entry in the connection table', 'Stateful firewall'],
      ['Block a file-sharing application whatever port it uses while allowing Webex', 'Next-generation firewall'],
    ],
    explanation: 'Spreading requests for a **VIP** across a pool with **health checks** is a load balancer. Forwarding by **destination MAC** learned per port and VLAN is a switch. Choosing a next hop from a **routing table** is a router. Permitting return traffic from a **session/connection table** is the defining behaviour of a stateful firewall. Policy by **application identity** rather than port needs a next-generation firewall; a plain stateful firewall sees only addresses, protocols and ports.' },
  { topic: '6.3', type: 'single', difficulty: 2, lesson: L63,
    stem: 'Refer to the exhibit. fw01 is a stateful firewall whose only rule permits TCP from 10.1.10.0/24 to any destination on port 443. Which arriving packet does fw01 permit?',
    exhibit: `fw01 session table (simplified)
Proto  Inside                Outside               State        Idle
tcp    10.1.10.25:51012      198.51.100.20:443     ESTABLISHED  0:00:03
tcp    10.1.10.31:50877      198.51.100.44:443     ESTABLISHED  0:01:10`,
    options: [
      'From 198.51.100.20:443 to 10.1.10.25:51013',
      'From 198.51.100.20:8443 to 10.1.10.25:51012',
      'From 198.51.100.20:443 to 10.1.10.25:51012',
      'From 198.51.100.44:443 to 10.1.10.25:50877',
    ],
    answer: [2],
    explanation: 'Return traffic is permitted only when it matches an existing session\'s 5-tuple. **198.51.100.20:443 to 10.1.10.25:51012** is the reply direction of the first session. The packet to port 51013 has no session. The packet from port 8443 does not match the session\'s server port. The last packet uses the second session\'s ports and server but the wrong inside host (10.1.10.25 instead of 10.1.10.31). None of the non-matching packets is permitted by the rule either, because the rule only allows connections from the inside to port 443.' },

  // ---------- 6.4 Topology diagrams ----------
  { topic: '6.4', type: 'fill', difficulty: 2, lesson: L64,
    stem: 'Refer to the exhibit. A customer opens https://shop.example.com, which resolves to 203.0.113.5. Enter the destination TCP port of the connection that web01 receives.',
    exhibit: TOPO,
    answer: ['8443', 'tcp/8443', 'tcp 8443'],
    explanation: 'The customer connects to 203.0.113.5:**443**. fw01\'s static NAT changes the destination to the VIP 172.16.50.10:443. lb01 terminates TLS there and opens a **new** connection to a pool member on the pool port, **8443**. The firewall rule therefore needs TCP 443 to the VIP, while web01 listens on 8443.' },
  { topic: '6.4', type: 'single', difficulty: 2, lesson: L64,
    stem: 'Refer to the exhibit. The developers of the web application say every request in web01\'s access log comes from the same client address. Which address is it, and why?',
    exhibit: TOPO,
    options: [
      '203.0.113.5, because fw01 translates the customer\'s source address to the public NAT address',
      '172.16.50.1, because the firewall\'s DMZ interface is the web servers\' gateway',
      '172.16.50.5, because lb01 source-NATs its connections to the pool',
      '172.16.50.10, because the VIP is the source of health checks and requests',
    ],
    answer: [2],
    explanation: 'The diagram labels lb01 **SNAT to 172.16.50.5**, so lb01 opens its backend connections from 172.16.50.5 and that is the client address web01 logs. The real customer address can only be passed in a header such as `X-Forwarded-For`. fw01\'s static NAT translates the **destination** 203.0.113.5 to 172.16.50.10; it does not change the customer\'s source to 203.0.113.5. 172.16.50.1 is the firewall\'s DMZ interface and is not the source of requests. 172.16.50.10 is the VIP that clients connect to, not lb01\'s SNAT source.' },
  { topic: '6.4', type: 'single', difficulty: 2, lesson: L64,
    stem: 'Refer to the exhibit. dev-pc cannot connect to inv-api on TCP 5000. The firewall team finds no log entries on fw01 for this flow. What should the developer conclude?',
    exhibit: TOPO,
    options: [
      'fw01 is dropping the flow without logging; a rule for TCP 5000 must be added on fw01',
      'The trunk does not carry VLAN 20, so inv-api is unreachable',
      'dev-pc must use the PAT address 203.0.113.2 to reach inv-api',
      'The flow is routed between VLAN 10 and VLAN 20 on core01 and never reaches fw01, so the cause is on core01, the access ports or inv-api itself',
    ],
    answer: [3],
    explanation: 'Both hosts use core01 SVIs as their gateways (10.1.10.1 and 10.1.20.1), so core01 **routes between the two VLANs itself**; the path never crosses fw01, and no fw01 log entry is expected. Next places to check: an ACL on the SVIs, the access port and VLAN for inv-api, a host firewall on inv-api, and whether the service is listening on TCP 5000. Adding a rule on fw01 would change nothing. The trunk label shows VLAN 20 is allowed. NAT applies only to traffic leaving through fw01\'s outside interface.' },
  { topic: '6.4', type: 'order', difficulty: 2, lesson: L64,
    stem: 'Refer to the exhibit. dev-pc sends the first packet of an HTTPS connection to an internet API. Put the devices in the order the packet passes through them.',
    exhibit: TOPO,
    items: [
      'acc01: switches the frame in VLAN 10 and sends it tagged over trunk Gi1/0/48',
      'core01: receives it on SVI Vlan10 and routes it with its default route to 10.0.1.1',
      'fw01: permits it by rule, creates a session and applies PAT to 203.0.113.2',
      'ISP router 203.0.113.1: forwards it towards the internet',
    ],
    explanation: 'dev-pc\'s gateway is 10.1.10.1 on core01, so the frame is first switched by **acc01** (access VLAN 10, then the trunk). **core01** routes it out its default route to fw01 inside. **fw01** applies its policy and the PAT rule for inside users. The **ISP router** then forwards the translated packet. The return traffic follows the same path in reverse, matched to fw01\'s session.' },

  // ---------- 6.5 Planes ----------
  { topic: '6.5', type: 'match', difficulty: 2, lesson: L65,
    stem: 'Match each event on a Cisco router to the plane that handles it.',
    pairs: [
      ['An Ansible playbook sets the NTP server through a NETCONF edit-config', 'Management plane'],
      ['The router exchanges OSPF LSAs with a neighbour and recalculates its routing table', 'Control plane'],
      ['A user\'s HTTPS packet is looked up in the FIB, matched against an egress ACL and sent out the next interface', 'Data plane'],
    ],
    explanation: 'Configuring the device over **NETCONF** (or SSH, RESTCONF, SNMP) is **management plane**. Exchanging routing protocol information and building the RIB is **control plane**. Forwarding transit traffic and applying per-packet features such as ACLs is **data plane**.' },
  { topic: '6.5', type: 'single', difficulty: 2, lesson: L65,
    stem: 'In Cisco Catalyst SD-WAN, which component provides the centralised control plane, distributing routes and policy to the WAN Edge routers with OMP?',
    options: [
      'SD-WAN Manager (formerly vManage)',
      'SD-WAN Validator (formerly vBond)',
      'SD-WAN Controller (formerly vSmart)',
      'The WAN Edge routers themselves',
    ],
    answer: [2],
    explanation: 'The **SD-WAN Controller** (formerly vSmart) is the centralised **control plane**: it peers with WAN Edges over OMP and distributes routes and policy. **SD-WAN Manager** (formerly vManage) is the **management plane** with the GUI and REST API that automation uses. The **SD-WAN Validator** (formerly vBond) authenticates and orchestrates devices joining the fabric. The **WAN Edge** routers form the **data plane** that forwards user traffic.' },
  { topic: '6.5', type: 'single', difficulty: 3, lesson: L65,
    stem: 'Refer to the exhibit. A monitoring script polls interface counters with SNMP on 300 routers. When it polls 50 routers at once with several requests each, many polls time out, while user traffic through the routers is unaffected and a single poll always succeeds. Which explanation fits best?',
    exhibit: `poll run 14:02:10  workers=50  requests/device=40  burst
  ok: 231   timeout: 69
poll run 14:20:00  workers=5   requests/device=40  paced
  ok: 300   timeout: 0
routers: CPU 12%, no interface drops, no routing changes`,
    options: [
      'Control Plane Policing (or a similar CPU protection policy) is rate-limiting the burst of management traffic punted to the CPU',
      'The data plane is congested, so the routers drop the SNMP packets in hardware queues',
      'The routers\' OSPF control plane is unstable and removes the route to the monitoring server',
      'SNMP uses TCP, and the routers reset the extra connections',
    ],
    answer: [0],
    explanation: 'SNMP requests addressed to the router are processed by its CPU, the shared resource for the control and management planes. A CPU protection policy such as **CoPP** rate-limits packets punted to the CPU, so a **burst** exceeds the rate and is dropped while a **paced** run succeeds, with no effect on transit traffic. The exhibit shows no interface drops (no data-plane congestion) and no routing changes (no control-plane instability). SNMP runs over **UDP**, not TCP.' },

  // ---------- 6.6 IP services ----------
  { topic: '6.6', type: 'order', difficulty: 2, lesson: L66,
    stem: 'A laptop joins VLAN 40, whose gateway SVI relays DHCP to a central server with `ip helper-address`. Put the steps in order, from connecting to having a lease.',
    items: [
      'The client broadcasts a DHCPDISCOVER from 0.0.0.0 to 255.255.255.255, UDP port 67',
      'The relay on the VLAN 40 SVI writes its address in giaddr and forwards the message to the server by unicast',
      'The server picks an address from the scope that matches giaddr and returns a DHCPOFFER through the relay',
      'The client broadcasts a DHCPREQUEST naming the server whose offer it accepts',
      'The server sends a DHCPACK and the client starts using the address for the lease time',
    ],
    explanation: 'DHCP is **DORA**: Discover, Offer, Request, Acknowledge (RFC 2131). The client has no address, so the Discover is a broadcast to UDP 67. Broadcasts do not cross routers, so the **relay** (the `ip helper-address` on the SVI) forwards it as unicast and records its interface address in **giaddr**, which the server uses to choose the right scope. The offer comes back through the relay; the client then broadcasts its Request (so any other offering servers know they were not chosen) and the server confirms with an ACK.' },
  { topic: '6.6', type: 'order', difficulty: 2, lesson: L66,
    stem: 'A Python script calls `requests.get("https://api.example.com/v1/sites")` on a laptop with an empty DNS cache. Put the name resolution steps in order.',
    items: [
      'The application asks the operating system resolver (getaddrinfo) for api.example.com',
      'The OS checks its hosts file and local cache and finds nothing',
      'The OS sends the query to the recursive resolver it learned from DHCP',
      'The recursive resolver asks a root server and is referred to the .com TLD servers',
      'The .com servers refer it to the authoritative servers for example.com, which return the A record',
      'The recursive resolver caches the answer for its TTL and returns it to the laptop',
    ],
    explanation: 'Resolution starts locally (application, then the stub resolver with its hosts file and cache), goes to the **recursive resolver**, which resolves **iteratively** from the **root** to the **TLD** to the **authoritative** servers, then **caches** the answer for the record\'s TTL and replies. Only then does the script open a TCP connection to the returned address.' },
  { topic: '6.6', type: 'fill', difficulty: 2, lesson: L66,
    stem: 'Refer to the exhibit. For at most how many more seconds may this resolver keep returning the cached A record for web.example.net before it must query again? Enter the number.',
    exhibit: `$ dig www.example.com A

;; QUESTION SECTION:
;www.example.com.               IN      A

;; ANSWER SECTION:
www.example.com.        1730    IN      CNAME   web.example.net.
web.example.net.        287     IN      A       198.51.100.20

;; Query time: 2 msec
;; SERVER: 10.50.0.53#53(10.50.0.53) (UDP)`,
    answer: ['287', '287 seconds'],
    explanation: 'Each record carries its own **TTL**, the second column. The **A** record for web.example.net has **287** seconds left in this resolver\'s cache. The CNAME (1730 seconds) is a separate record with its own TTL. The exhibit also shows the query went to 10.50.0.53 on port 53 over UDP.' },
  { topic: '6.6', type: 'fill', difficulty: 2, lesson: L66,
    stem: 'Refer to the exhibit. Enter the inside global address and port used by inside host 10.1.10.26 for its connection, in the form address:port.',
    exhibit: `rtr01# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
tcp  203.0.113.2:51012     10.1.10.25:51012      198.51.100.20:443     198.51.100.20:443
tcp  203.0.113.2:1024      10.1.10.26:51012      198.51.100.20:443     198.51.100.20:443
---  203.0.113.5           172.16.50.10          ---                   ---`,
    answer: ['203.0.113.2:1024'],
    explanation: '**Inside local** is the host\'s real address (10.1.10.26:51012); **inside global** is how it appears outside: **203.0.113.2:1024**. Both hosts share 203.0.113.2 (PAT, "overload"); because 10.1.10.25 already uses source port 51012 on that address, the second host\'s connection is given a different port, 1024, so replies can be told apart. The last line is a static one-to-one NAT entry for a server.' },
  { topic: '6.6', type: 'single', difficulty: 1, lesson: L66,
    stem: 'An internal web server must accept connections that internet clients start, always at the same public address, while hundreds of office PCs share a different public address for outbound browsing. Which NAT types meet the two needs?',
    options: [
      'PAT for the server and static NAT for the PCs',
      'Static NAT for the server and PAT for the PCs',
      'Dynamic NAT for both',
      'PAT for both, on the same public address',
    ],
    answer: [1],
    explanation: '**Static NAT** gives the server a fixed one-to-one mapping that exists before any connection, so inbound connections can be started from outside. **PAT** lets many PCs share one public address, distinguished by source port, and only creates mappings for outbound flows. PAT on the server would give inbound clients no mapping to use. Dynamic NAT assigns pool addresses one-to-one as needed, which is neither fixed for the server nor efficient for hundreds of PCs. Sharing one PAT address for both still leaves the server without an inbound mapping.' },
  { topic: '6.6', type: 'multi', difficulty: 2, lesson: L66,
    stem: 'Refer to the exhibit. Which three statements about this SNMP configuration are true? (Choose three.)',
    exhibit: `snmp-server community example-ro-not-real RO
snmp-server host 10.50.0.30 version 2c example-ro-not-real
snmp-server enable traps snmp linkdown linkup`,
    options: [
      'The monitoring system polls the router\'s agent on UDP port 161',
      'Link-down traps are sent to 10.50.0.30 on UDP port 162',
      'The community string crosses the network in clear text',
      'Each trap is acknowledged by 10.50.0.30 and resent until it is confirmed',
      'Messages are authenticated and encrypted with SNMPv3 authPriv',
      'The router polls 10.50.0.30 for its MIB on UDP port 162',
    ],
    answer: [0, 1, 2],
    explanation: 'The agent listens for Get and GetBulk requests on **UDP 161** (RFC 3417) and sends notifications to the configured manager on **UDP 162**. Version **2c** uses a community string that is sent **in clear text**. Traps are **unacknowledged**; acknowledged notifications are **informs** (`snmp-server host ... informs`). Authentication and encryption require **SNMPv3** with `authPriv`. The manager polls the agent, not the other way round.' },
  { topic: '6.6', type: 'single', difficulty: 2, lesson: L66,
    stem: 'Refer to the exhibit. A container that runs a nightly API job suddenly fails on its first HTTPS call. The certificate on api.example.com is valid until next year. What is the most likely cause?',
    exhibit: `$ date -u
Thu Jan  1 00:04:12 UTC 1970
$ python3 job.py
...
requests.exceptions.SSLError: HTTPSConnectionPool(host='api.example.com', port=443): Max retries exceeded with url: /v1/token (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate is not yet valid (_ssl.c:1032)')))`,
    options: [
      'A TLS-inspecting proxy is presenting its own certificate',
      'The API server\'s certificate has expired',
      'TCP port 443 is blocked by a firewall',
      'The host has no time synchronisation, so its clock is earlier than the certificate\'s "not before" date',
    ],
    answer: [3],
    explanation: 'The clock reads **1970**, so every real certificate is "**not yet valid**". Certificate checks compare the validity dates with the local clock, which is why **NTP** (UDP 123) matters for TLS, logs and token expiry. A TLS-inspecting proxy causes a chain error such as "self-signed certificate in certificate chain" or "unable to get local issuer certificate". An expired certificate would say "certificate has expired", and the stem says it is valid. A blocked port would give a connect timeout, not a certificate verification error, which only happens after TCP connects.' },
  { topic: '6.6', type: 'single', difficulty: 2, lesson: L66,
    stem: 'Which statement describes model-driven telemetry compared with SNMP polling?',
    options: [
      'The device streams data defined by YANG models to a collector, periodically or when values change, under a subscription',
      'The collector polls OIDs from the device MIB more often than SNMP can',
      'It replaces YANG with MIBs so that existing SNMP tools can read the data',
      'It only works over UDP 162, the same as SNMP traps',
    ],
    answer: [0],
    explanation: 'Model-driven telemetry is **push**: the device streams data described by **YANG** models to a collector under a subscription (periodic or **on change**), over transports such as gRPC/gNMI or NETCONF. That avoids per-poll requests and scales better than SNMP polling. It does not poll OIDs, it uses YANG rather than MIBs, and it is not tied to the SNMP trap port.' },
  { topic: '6.6', type: 'single', difficulty: 2, lesson: L66,
    stem: 'Refer to the exhibit. A new VLAN 60 was added on the core switch yesterday. Every laptop in VLAN 60 shows output like this, while laptops in other VLANs work normally and use the same central DHCP server. What is the most likely cause?',
    exhibit: `C:\\> ipconfig /all
Ethernet adapter Ethernet:
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Autoconfiguration IPv4 Address. . : 169.254.83.17(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :`,
    options: [
      'The DHCP server\'s UDP port 68 is blocked for all VLANs',
      'The VLAN 60 SVI has no ip helper-address, so DHCP broadcasts never reach the central server',
      'The laptops have a static address configured',
      'The DNS server option is missing from the VLAN 60 scope',
    ],
    answer: [1],
    explanation: 'A `169.254.x.x` **autoconfiguration** address means the client asked DHCP and got **no answer**. Only the new VLAN is affected and the server works for others, so the missing piece is the **relay**: the SVI needs `ip helper-address <server>` to forward the broadcasts. Blocking the client port for all VLANs would break every VLAN. "DHCP Enabled: Yes" rules out a static address. A missing DNS option would still give the laptops an address, mask and gateway.' },

  // ---------- 6.7 Ports ----------
  { topic: '6.7', type: 'match', difficulty: 2, lesson: L67,
    stem: 'A firewall request lists the flows an automation server needs. Match each task to the destination port and transport it uses (default ports).',
    pairs: [
      ['ncclient opens a NETCONF session to an IOS XE router', 'TCP 830'],
      ['A requests script sends GET /restconf/data/ietf-interfaces:interfaces', 'TCP 443'],
      ['Netmiko runs show commands on a switch', 'TCP 22'],
      ['The script resolves sw01.example.com before connecting', 'UDP 53 (TCP 53 for large answers)'],
      ['The monitoring server receives linkDown traps', 'UDP 162'],
    ],
    explanation: 'NETCONF runs over SSH on **TCP 830** (RFC 6242, IANA `netconf-ssh`). RESTCONF runs over **HTTPS**, normally **TCP 443**; it has no dedicated port. Netmiko uses the device CLI over **SSH, TCP 22**. DNS queries use **UDP 53**, falling back to TCP 53 for truncated answers. SNMP traps go to the manager on **UDP 162**.' },
  { topic: '6.7', type: 'fill', difficulty: 1, lesson: L67,
    stem: 'Refer to the exhibit. Enter the destination port that must be filled in for the second flow.',
    exhibit: `Firewall change request FW-2291
Source              Destination        Protocol  Port   Purpose
10.1.10.0/24        10.30.0.0/24       TCP       22     Netmiko CLI backups
10.1.10.0/24        10.30.0.0/24       TCP       ____   ncclient NETCONF get-config / edit-config (default port)
10.1.10.0/24        10.30.0.0/24       TCP       443    RESTCONF`,
    answer: ['830', 'tcp/830', 'tcp 830'],
    explanation: 'NETCONF over SSH uses **TCP 830** (RFC 6242), which is also ncclient\'s default port. NETCONF over TLS would be 6513, which IOS XE does not use; port 22 is the CLI, and 443 is RESTCONF.' },
  { topic: '6.7', type: 'multi', difficulty: 1, lesson: L67,
    stem: 'Which two of these protocols normally run over UDP? (Choose two.)',
    options: ['SSH', 'NTP', 'NETCONF', 'SNMP', 'HTTPS', 'Telnet'],
    answer: [1, 3],
    explanation: '**NTP** (UDP 123) and **SNMP** (UDP 161 for polling, 162 for traps) use UDP. SSH (22), NETCONF (830, over SSH), HTTPS (443) and Telnet (23) are TCP. HTTP/3 does run over QUIC on UDP 443, but HTTPS as used by REST APIs and RESTCONF is normally HTTP/1.1 or HTTP/2 over TCP.' },

  // ---------- 6.8 Diagnosing connectivity ----------
  { topic: '6.8', type: 'single', difficulty: 2, lesson: L68,
    stem: 'Refer to the exhibit. From the same automation server, `ssh alice@sw01.example.com` works. What is the most likely cause of the failure?',
    exhibit: `Traceback (most recent call last):
  File "/home/alice/inv/get_intf.py", line 11, in <module>
    r = requests.get(URL, auth=AUTH, headers=HDRS, timeout=5)
  ...
requests.exceptions.ConnectTimeout: HTTPSConnectionPool(host='sw01.example.com', port=443): Max retries exceeded with url: /restconf/data/ietf-interfaces:interfaces (Caused by ConnectTimeoutError(<HTTPSConnection(host='sw01.example.com', port=443) at 0x7f2b9c4d1e50>, 'Connection to sw01.example.com timed out. (connect timeout=5)'))`,
    options: [
      'RESTCONF is not enabled on sw01, so nothing listens on TCP 443',
      'sw01.example.com does not resolve in DNS',
      'A firewall or ACL in the path silently drops TCP 443 to sw01',
      'The switch presents a self-signed certificate',
    ],
    answer: [2],
    explanation: 'A **connect timeout** means the SYNs got no reply at all, which is what a **dropping** firewall or ACL produces. SSH to the same host works, so DNS, routing and the host are fine, and only TCP 443 is affected. If nothing listened on 443, the switch would answer with a TCP reset and the error would be "**Connection refused**" immediately. A DNS failure raises a `ConnectionError` caused by `NameResolutionError` before any connection is attempted. A certificate problem raises `SSLError`, which needs a completed TCP connection first.' },
  { topic: '6.8', type: 'single', difficulty: 2, lesson: L68,
    stem: 'Refer to the exhibit. The error appears less than a second after the script starts. What is the most likely cause?',
    exhibit: `requests.exceptions.ConnectionError: HTTPSConnectionPool(host='rtr02.example.com', port=443): Max retries exceeded with url: /restconf/data/Cisco-IOS-XE-native:native/hostname (Caused by NewConnectionError("HTTPSConnection(host='rtr02.example.com', port=443): Failed to establish a new connection: [Errno 111] Connection refused"))`,
    options: [
      'The router is reachable but nothing accepts connections on TCP 443, for example because the HTTPS server and RESTCONF are not enabled, or a device in the path rejects the connection with a reset',
      'A firewall is silently dropping the SYN packets',
      'The proxy requires authentication',
      'The router\'s clock is wrong, so its certificate is rejected',
    ],
    answer: [0],
    explanation: '"**Connection refused**" (Errno 111 on Linux) means a **TCP RST** came back. RFC 9293 has a host answer a connection attempt for a port with no listener with a reset, so the usual cause is that the service is not running (on IOS XE RESTCONF needs `ip http secure-server` and `restconf`), or that a firewall **rejects** rather than drops. A silent drop gives a timeout after the connect timeout, not an instant refusal. A proxy authentication problem is a `ProxyError` with 407. A clock or certificate problem is an `SSLError` after the TCP connection succeeds.' },
  { topic: '6.8', type: 'match', difficulty: 3, lesson: L68,
    stem: 'Match each symptom to its most likely cause.',
    pairs: [
      ['On the office network only, requests raises SSLError CERTIFICATE_VERIFY_FAILED; the browser is fine; curl -v shows the issuer "Example Corp Inspection CA"', 'TLS inspection by the proxy or firewall'],
      ['requests raises ProxyError: Tunnel connection failed: 407 Proxy Authentication Required', 'The proxy requires credentials'],
      ['On VPN from home, sw01.corp.example.com fails with NameResolutionError, but its address 10.30.0.10 answers', 'DNS is not following the VPN tunnel'],
      ['Inside users time out on shop.example.com, which resolves to the server\'s static NAT public address; outside customers are fine', 'The firewall does not hairpin NAT for inside clients'],
      ['Over the VPN, an SSH session logs in, but show running-config hangs and the API GET of the full configuration ends in ReadTimeout', 'MTU black hole: path MTU discovery is failing'],
    ],
    explanation: 'An issuer that is the company\'s **inspection CA** means a device decrypted the session and presented its own certificate; the browser trusts that CA from the OS store but Python\'s certifi bundle does not. **407** is the proxy asking for `Proxy-Authorization`. Working by IP but failing by name only on VPN is **VPN DNS**. Failing only from inside, to the public address of an inside server, is **hairpin** NAT. Small exchanges working and large transfers stalling is the classic **PMTUD black hole** in a tunnel.' },
  { topic: '6.8', type: 'fill', difficulty: 2, lesson: L68,
    stem: 'Refer to the exhibit. The server 10.30.0.10 runs services on all three ports. Enter the port that a firewall in the path is silently dropping.',
    exhibit: `$ python3 probe.py
443  open
22   ConnectionRefusedError [Errno 111] Connection refused
8443 TimeoutError timed out

# probe.py
import socket
for port in (443, 22, 8443):
    try:
        socket.create_connection(("10.30.0.10", port), timeout=5).close()
        print(f"{port:<4} open")
    except OSError as e:
        print(f"{port:<4} {type(e).__name__} {e}")`,
    answer: ['8443', 'tcp/8443', 'tcp 8443'],
    explanation: 'A silent **drop** produces no reply, so the connect attempt ends in a **timeout**: port **8443**. Port 22 was **refused**: a TCP reset came back. Because the stem says the service runs on all three ports, that reset came from a firewall **rejecting** the connection, not from a closed port. Port 443 connected.' },
  { topic: '6.8', type: 'single', difficulty: 3, lesson: L68,
    stem: 'Refer to the exhibit. The script runs on a laptop in the office, where internet access requires the proxy. Calls to cloud APIs work. Calls to the internal switch fail as shown. What is the best fix?',
    exhibit: `> Get-ChildItem Env: | Where-Object Name -like '*proxy*'
Name           Value
----           -----
HTTPS_PROXY    http://proxy.example.com:3128
NO_PROXY       localhost,127.0.0.1

requests.exceptions.ProxyError: HTTPSConnectionPool(host='sw01.corp.example.com', port=443): Max retries exceeded with url: /restconf/data/ietf-interfaces:interfaces (Caused by ProxyError('Unable to connect to proxy', OSError('Tunnel connection failed: 502 Bad Gateway')))`,
    options: [
      'Add the proxy user name and password to HTTPS_PROXY',
      'Add .corp.example.com (and the internal address ranges if IP addresses are used) to NO_PROXY so internal requests bypass the proxy',
      'Pass verify=False so the proxy\'s certificate is accepted',
      'Rename HTTPS_PROXY to http_proxy so requests reads it',
    ],
    answer: [1],
    explanation: 'requests sent the internal request to the proxy (`CONNECT sw01.corp.example.com:443`), and the proxy, which cannot reach internal devices, answered **502 Bad Gateway**. Internal destinations should **bypass** the proxy: add them to **NO_PROXY** (in requests, CIDR entries such as `10.0.0.0/8` only match URLs that use an IP address). Credentials would fix a **407**, not a 502. `verify=False` changes certificate checking, which never started because the tunnel failed (and disabling verification is not a fix). `http_proxy` applies to `http://` URLs, not to this HTTPS request.' },
  { topic: '6.8', type: 'single', difficulty: 3, lesson: L68,
    stem: 'Refer to the exhibit. A second WAN link and router rtr-b were added at the branch yesterday. Since then, automation calls from 10.2.10.0/24 to the data-centre API at 10.30.5.20 time out on connect, while calls from 10.2.20.0/24 still work. Nothing changed on the API server, and no NAT is used between the branch and the data centre. What is the most likely cause?',
    exhibit: `                  +----------+   WAN-A
          +-------| fw-a     |-----------+
          |       | stateful |           |
 10.2.10.0/24     +----------+       DC core ---- API server 10.30.5.20
 10.2.20.0/24     +----------+           |
          |       | rtr-b    |-----------+
          +-------| (new)    |   WAN-B (new)
                  +----------+
 Branch routing:  10.2.10.0/24 -> DC  via rtr-b (changed yesterday)
                  10.2.20.0/24 -> DC  via fw-a
 DC routing:      10.2.0.0/16  -> branch via WAN-A (fw-a)`,
    options: [
      'The API server\'s host firewall blocks the 10.2.10.0/24 range',
      'DNS for the API now resolves to an address that 10.2.10.0/24 cannot reach',
      'rtr-b drops the SYNs because a router without a session table cannot forward TCP connections',
      'The path is asymmetric: SYNs leave through rtr-b but the SYN-ACKs return through fw-a, which has no session for them and drops them',
    ],
    answer: [3],
    explanation: 'For 10.2.10.0/24 the SYN now leaves through **rtr-b**, but the data centre still routes the whole branch back through **WAN-A and fw-a**. fw-a never saw the SYN, so the arriving **SYN-ACK** matches no session and is not a new connection its rules allow; a stateful firewall drops it, and the client **times out on connect**. 10.2.20.0/24 uses fw-a in both directions, so its sessions are complete. The fix is symmetric routing (send 10.2.10.0/24 back via rtr-b, or send it out via fw-a). The stem says the API server did not change. A DNS change would affect both subnets. A router forwards packets by its routing table and needs no session state, so rtr-b passes the SYNs.' },
  { topic: '6.8', type: 'order', difficulty: 2, lesson: L68,
    stem: 'A script that calls a controller API fails with a connection error. Put the troubleshooting steps in the order of a bottom-up layered method, starting from the error itself.',
    items: [
      'Read the exception class and its "Caused by" message exactly',
      'Check that the controller\'s name resolves to the expected address',
      'Check which route and interface the traffic uses, including any VPN',
      'Test whether a TCP connection to the API port opens, times out or is refused',
      'Inspect the TLS certificate the client receives and its issuer',
      'Check the HTTP status code and response body',
    ],
    explanation: 'The method works up the layers and stops at the first one that fails: the **exact error** tells you where to start; **DNS** must give the right address before anything else; the **route** decides whether traffic goes direct, through a VPN or a proxy path; the **TCP** test separates drops (timeout) from refusals; **TLS** comes after TCP; **HTTP** status and body come last, because they only exist once everything below works.' },
  { topic: '6.8', type: 'single', difficulty: 2, lesson: L68,
    stem: 'Refer to the exhibit. An engineer on the corporate VPN can manage devices in 10.30.0.0/24 but cannot reach the lab controller at 172.20.1.10; the connection times out. What is the cause?',
    exhibit: `$ ip route
default via 192.168.1.1 dev wlan0 proto dhcp metric 600
10.0.0.0/8 dev tun0 scope link
192.168.1.0/24 dev wlan0 proto kernel scope link src 192.168.1.50 metric 600
$ ip route get 172.20.1.10
172.20.1.10 via 192.168.1.1 dev wlan0 src 192.168.1.50 uid 1000
    cache`,
    options: [
      'The VPN is a full tunnel, so all traffic goes through tun0',
      'The VPN uses split tunnelling and only pushes 10.0.0.0/8, so traffic to 172.20.1.10 follows the default route to the home router',
      'The home LAN 192.168.1.0/24 overlaps the lab subnet',
      'The tun0 MTU is too small for the TCP handshake',
    ],
    answer: [1],
    explanation: '`ip route get` shows 172.20.1.10 leaving via **wlan0** to the home router: the VPN pushed only **10.0.0.0/8** (a **split tunnel**), so the lab prefix 172.20.0.0/16 is missing from the tunnel routes and the traffic goes to the internet, where the private address is unreachable. A full tunnel would replace or override the default route with tun0. 192.168.1.0/24 does not overlap 172.20.1.10. MTU problems affect large packets, not the small handshake packets, and the traffic does not even use tun0.' },

  // ---------- 6.9 Network constraints ----------
  { topic: '6.9', type: 'single', difficulty: 2, lesson: L69,
    stem: 'Refer to the exhibit. The script collects one small JSON object from each of 500 routers at remote sites. Which change reduces its run time the most?',
    exhibit: `for host in routers:                      # 500 hosts, RTT about 80 ms each
    r = requests.get(f"https://{host}/restconf/data/Cisco-IOS-XE-native:native/hostname",
                     auth=AUTH, headers=HDRS, verify=CA, timeout=(5, 30))
    results[host] = r.json()

$ time python3 collect.py
real    2m01.7s
Average response body: 180 bytes`,
    options: [
      'Upgrade the data-centre internet link from 1 Gbit/s to 10 Gbit/s',
      'Enable gzip compression of the responses',
      'Run the requests concurrently, for example 20 at a time with a thread pool',
      'Increase the read timeout from 30 to 60 seconds',
    ],
    answer: [2],
    explanation: 'The run is dominated by **latency**: about 500 × 3 round trips (TCP handshake, TLS handshake, request) × 80 ms ≈ 120 s, matching the 2 minutes measured. Each host is a different server, so keep-alive alone does not help across hosts, but running requests **concurrently** overlaps the waiting and cuts the time roughly by the number of workers. More bandwidth does nothing for 180-byte responses, and compression saves almost nothing on them. A longer read timeout only changes when a stuck request gives up.' },
  { topic: '6.9', type: 'multi', difficulty: 2, lesson: L69,
    stem: 'A script calls a controller API across an unreliable WAN and sometimes receives 503 or 429 responses or connection timeouts. Which two practices handle this correctly? (Choose two.)',
    options: [
      'Retry idempotent requests such as GET with exponential backoff and random jitter, up to a limit',
      'Retry every POST automatically, as often as needed, until it succeeds',
      'On 429 or 503, wait for the time given in the Retry-After header before retrying',
      'Remove timeouts so that slow responses are never abandoned',
      'Retry immediately in a tight loop so the job finishes sooner',
    ],
    answer: [0, 2],
    explanation: 'Transient failures are handled with **bounded retries** of **idempotent** requests, waiting **exponentially longer** with **jitter** so many clients do not retry in lockstep, and by honouring **Retry-After** on 429 and 503 (urllib3\'s `Retry` does this by default). Automatically retrying a **POST** can create duplicates, because POST is not idempotent. Without timeouts, a lost response hangs the script forever (requests has no default timeout). Immediate retries add load to a server that is already overloaded or rate limiting.' },
  { topic: '6.9', type: 'single', difficulty: 2, lesson: L69,
    stem: 'Refer to the exhibit. A 200 MB IOS XE image must be copied to the branch router before a change window. Ignoring protocol overhead, what is the minimum time the transfer takes?',
    exhibit: `Branch link: 20 Mbit/s, RTT 40 ms, loss 0%
Image size: 200 MB (200 x 10^6 bytes)`,
    options: ['10 seconds', '8 seconds', '80 seconds', '800 seconds'],
    answer: [2],
    explanation: '200 MB = 200 × 10^6 × 8 = 1,600 × 10^6 bits. At 20 × 10^6 bit/s that is **80 seconds** at best; overhead, other traffic and TCP behaviour make it longer. 10 seconds and 8 seconds forget the 8 bits per byte or mix up the units; 800 seconds is ten times too long. The 40 ms RTT adds little to one large transfer but would dominate many small requests.' },
];

export default bank.map((item, i) => ({ id: `d6-${String(i + 1).padStart(3, '0')}`, ...item }));
