// Domain 3 - IP Routing (20%). Original questions; see CONTENT_SPEC.md.
// Topic split: 3.1 = d3-001..015, 3.2 = d3-016..029, 3.3 = d3-030..050, 3.4 = d3-051..060

const TABLE_A = `R1# show ip route
Codes: L - local, C - connected, S - static, O - OSPF, D - EIGRP,
       * - candidate default (legend shortened)

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 10 subnets, 6 masks
S        10.0.0.0/8 [1/0] via 10.0.12.2
C        10.0.12.0/24 is directly connected, GigabitEthernet0/0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/0/1
C        10.0.13.0/24 is directly connected, GigabitEthernet0/0/2
L        10.0.13.1/32 is directly connected, GigabitEthernet0/0/2
C        10.0.14.0/24 is directly connected, GigabitEthernet0/0/3
L        10.0.14.1/32 is directly connected, GigabitEthernet0/0/3
O        10.16.0.0/14 [110/3] via 10.0.13.3, 00:21:07, GigabitEthernet0/0/2
D        10.18.0.0/16 [90/3072] via 10.0.14.4, 00:21:07, GigabitEthernet0/0/3
O        10.18.32.0/20 [110/4] via 10.0.13.3, 00:21:07, GigabitEthernet0/0/2
      203.0.113.0/24 is variably subnetted, 2 subnets, 2 masks
C        203.0.113.0/30 is directly connected, GigabitEthernet0/0/0
L        203.0.113.2/32 is directly connected, GigabitEthernet0/0/0`;

const TABLE_B = `R2# show ip route
Codes: L - local, C - connected, S - static, O - OSPF (legend shortened)

Gateway of last resort is not set

      172.16.0.0/16 is variably subnetted, 8 subnets, 4 masks
C        172.16.1.0/24 is directly connected, GigabitEthernet0/0/0
L        172.16.1.1/32 is directly connected, GigabitEthernet0/0/0
S        172.16.8.0/22 [1/0] via 172.16.12.2
O        172.16.10.0/24 [110/3] via 172.16.13.2, 00:05:40, GigabitEthernet0/0/2
C        172.16.12.0/30 is directly connected, GigabitEthernet0/0/1
L        172.16.12.1/32 is directly connected, GigabitEthernet0/0/1
C        172.16.13.0/30 is directly connected, GigabitEthernet0/0/2
L        172.16.13.1/32 is directly connected, GigabitEthernet0/0/2`;

const TABLE_C = `R3# show ip route
Codes: L - local, C - connected, S - static, O - OSPF,
       E2 - OSPF external type 2, * - candidate default (legend shortened)

Gateway of last resort is 10.3.0.1 to network 0.0.0.0

O*E2  0.0.0.0/0 [110/1] via 10.3.0.1, 01:12:45, GigabitEthernet0/0/0
      10.0.0.0/8 is variably subnetted, 6 subnets, 3 masks
C        10.3.0.0/30 is directly connected, GigabitEthernet0/0/0
L        10.3.0.2/32 is directly connected, GigabitEthernet0/0/0
C        10.3.10.0/24 is directly connected, GigabitEthernet0/0/1
L        10.3.10.1/32 is directly connected, GigabitEthernet0/0/1
O        10.3.20.0/24 [110/2] via 10.3.0.1, 01:12:45, GigabitEthernet0/0/0
O E2     10.200.0.0/24 [110/20] via 10.3.0.1, 01:12:45, GigabitEthernet0/0/0`;

// Exhibits for the expansion set (d3-061..095)
const TABLE_D = `R5# show ip route
Codes: L - local, C - connected, S - static, O - OSPF, IA - OSPF inter area,
       * - candidate default (legend shortened)

Gateway of last resort is 192.0.2.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.0.2.1
      172.16.0.0/16 is variably subnetted, 9 subnets, 6 masks
S        172.16.0.0/16 is directly connected, Null0
C        172.16.0.0/30 is directly connected, GigabitEthernet0/0/1
L        172.16.0.1/32 is directly connected, GigabitEthernet0/0/1
C        172.16.0.4/30 is directly connected, GigabitEthernet0/0/2
L        172.16.0.5/32 is directly connected, GigabitEthernet0/0/2
O        172.16.32.0/19 [110/2] via 172.16.0.2, 00:08:14, GigabitEthernet0/0/1
O IA     172.16.48.0/21 [110/3] via 172.16.0.6, 00:08:14, GigabitEthernet0/0/2
O        172.16.52.64/27 [110/4] via 172.16.0.2, 00:08:14, GigabitEthernet0/0/1
S        172.16.52.77/32 [1/0] via 172.16.0.6
      192.0.2.0/24 is variably subnetted, 2 subnets, 2 masks
C        192.0.2.0/29 is directly connected, GigabitEthernet0/0/0
L        192.0.2.2/32 is directly connected, GigabitEthernet0/0/0`;

const TABLE_E = `R6# show ipv6 route
IPv6 Routing Table - default - 9 entries
Codes: C - Connected, L - Local, S - Static, O - OSPF Intra, OI - OSPF Inter,
       OE2 - OSPF ext 2 (legend shortened)
OE2 ::/0 [110/1]
     via FE80::1, GigabitEthernet0/0/0
C   2001:DB8:0:10::/64 [0/0]
     via GigabitEthernet0/0/0, directly connected
L   2001:DB8:0:10::6/128 [0/0]
     via GigabitEthernet0/0/0, receive
C   2001:DB8:0:20::/64 [0/0]
     via GigabitEthernet0/0/1, directly connected
L   2001:DB8:0:20::6/128 [0/0]
     via GigabitEthernet0/0/1, receive
O   2001:DB8:CAFE::/48 [110/2]
     via FE80::2, GigabitEthernet0/0/1
OI  2001:DB8:CAFE:100::/56 [110/3]
     via FE80::3, GigabitEthernet0/0/0
S   2001:DB8:CAFE:1A0::/60 [1/0]
     via 2001:DB8:0:20::9
L   FF00::/8 [0/0]
     via Null0, receive`;

export default [
  // ───────────────────────── 3.1 Interpret the routing table ─────────────────────────
  {
    id: 'd3-001',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 receives a packet destined for 10.18.47.9. To which next-hop address does R1 forward it?',
    exhibit: TABLE_A,
    options: [
      '10.0.13.3, using the OSPF route 10.18.32.0/20',
      '10.0.14.4, using the EIGRP route 10.18.0.0/16 because EIGRP has a lower AD than OSPF',
      '10.0.12.2, using the static route 10.0.0.0/8 because static routes have the lowest AD',
      '203.0.113.1, using the default route',
    ],
    answer: [0],
    explanation: "Forwarding uses the **longest prefix match**. 10.18.32.0/20 covers third-octet values 32-47 (block size 16), so 10.18.47.9 is inside it. Other matches are 10.16.0.0/14 (10.16-10.19), 10.18.0.0/16, 10.0.0.0/8 and 0.0.0.0/0, but /20 is the longest, so the packet goes to **10.0.13.3**.\n\n- The EIGRP /16 does match, but AD is only compared between routes to the *same* prefix; a /16 never beats a /20.\n- The static /8 matches too, yet its low AD is irrelevant for the same reason.\n- The default route is used only when nothing more specific matches.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-002',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R1 receives a packet destined for 10.20.1.1. To which next-hop address does R1 forward it?',
    exhibit: TABLE_A,
    options: [
      '10.0.13.3, using 10.16.0.0/14',
      '10.0.12.2, using 10.0.0.0/8',
      '10.0.14.4, using 10.18.0.0/16',
      '203.0.113.1, using the default route',
    ],
    answer: [1],
    explanation: "A /14 in the second octet has a block size of 4, so 10.16.0.0/14 covers only 10.16.0.0-10.19.255.255. 10.20.1.1 is outside it, and outside 10.18.0.0/16 and 10.18.32.0/20 as well. The longest remaining match is the static **10.0.0.0/8 via 10.0.12.2**.\n\n- 10.0.13.3 would be correct only if the /14 included 10.20; it does not (10.20.0.0 starts the next /14 block).\n- 10.18.0.0/16 covers only 10.18.x.x.\n- The default route (/0) is less specific than the /8, so it loses.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-003',
    topic: '3.1',
    type: 'match',
    difficulty: 1,
    stem: 'Match each IPv4 routing table code to its meaning.',
    pairs: [
      ['L', "One of the router's own interface addresses, installed as a /32"],
      ['C', 'The subnet of an interface that is up/up'],
      ['S*', 'A static route that is also the candidate default'],
      ['O IA', 'An OSPF route to a subnet in a different area'],
      ['O E2', 'A route redistributed into OSPF whose metric does not add internal cost'],
      ['D', 'An internal EIGRP route'],
    ],
    explanation: "`L` (local) routes are the router's own addresses as /32 host routes; `C` is the connected subnet. `S*` is a static route flagged as candidate default (typically 0.0.0.0/0). `O IA` is OSPF inter-area (learned through an ABR). `O E2` is an external route injected by an ASBR; its metric stays at the seed value across the domain. `D` is internal EIGRP (external EIGRP shows `D EX`).",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-004',
    topic: '3.1',
    type: 'order',
    difficulty: 1,
    stem: 'Order these route sources from most preferred (lowest default administrative distance) to least preferred.',
    items: [
      'Connected interface',
      'Static route',
      'eBGP',
      'EIGRP (internal)',
      'OSPF',
      'IS-IS',
      'RIP',
    ],
    explanation: 'Default ADs: connected 0, static 1, eBGP 20, internal EIGRP 90, OSPF 110, IS-IS 115, RIP 120. (Not in this list: external EIGRP 170, iBGP 200, unusable 255.) Lower AD means the source is more trusted when two sources offer the *same* prefix.',
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-005',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'R1 runs OSPF, EIGRP and RIP with default settings. It learns 172.20.0.0/16 from all three: OSPF cost 2, EIGRP metric 3072, and RIP 1 hop. Which entry appears in the routing table?',
    options: [
      'D    172.20.0.0/16 [90/3072]',
      'O    172.20.0.0/16 [110/2]',
      'R    172.20.0.0/16 [120/1]',
      'All three, load-shared across the three next hops',
    ],
    answer: [0],
    explanation: "All three offers are for the **identical prefix** 172.20.0.0/16, so the router compares administrative distance: EIGRP 90 beats OSPF 110 and RIP 120. The EIGRP route is installed as `[90/3072]`.\n\n- Metrics from different protocols are not comparable; OSPF's cost of 2 and RIP's single hop do not matter.\n- Load sharing happens only across equal-cost paths from the *same* routing source, never across protocols.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-006',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Refer to the exhibit. R2 receives a packet destined for 172.16.10.77. Enter the IPv4 address of the next hop R2 uses.',
    exhibit: TABLE_B,
    answer: ['172.16.13.2'],
    explanation: "Two routes contain 172.16.10.77: the static summary 172.16.8.0/22 (172.16.8.0-172.16.11.255) and the OSPF route 172.16.10.0/24. The /24 is longer, so R2 uses **172.16.13.2** out Gi0/0/2. The static route's lower AD (1 versus 110) does not matter because the two routes are different prefixes.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-007',
    topic: '3.1',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. A host on 10.3.10.0/24 sends a packet to 192.0.2.10. What does R3 do with it?',
    exhibit: TABLE_C,
    options: [
      'Forwards it to 10.3.0.1 out GigabitEthernet0/0/0 using the OSPF-learned default route',
      'Drops it because 192.0.2.0/24 is not in the routing table',
      'Forwards it to 10.3.0.1 using the O E2 route 10.200.0.0/24',
      'Floods it out every OSPF-enabled interface',
    ],
    answer: [0],
    explanation: "No specific route contains 192.0.2.10, so the default route is used. The table shows `Gateway of last resort is 10.3.0.1` and `O*E2 0.0.0.0/0 [110/1] via 10.3.0.1`, so R3 forwards to 10.3.0.1 out Gi0/0/0.\n\n- A packet is dropped only when nothing, including a default, matches.\n- 10.200.0.0/24 does not contain 192.0.2.10.\n- Routers never flood unicast packets for unknown destinations; that is switch behavior for unknown MACs.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-008',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R2 receives a packet destined for 172.16.12.6. What happens to it?',
    exhibit: TABLE_B,
    options: [
      'R2 delivers it directly out GigabitEthernet0/0/1 because 172.16.12.0 is a connected network',
      'R2 forwards it to 172.16.12.2 using the static route 172.16.8.0/22',
      'R2 forwards it to 172.16.13.2 using the OSPF route',
      'R2 drops it and can send an ICMP destination unreachable to the source',
    ],
    answer: [3],
    explanation: "Check every candidate. 172.16.12.0/30 covers only .0-.3, so .6 is outside it. 172.16.8.0/22 covers 172.16.8.0-172.16.11.255, so third octet 12 is outside it. 172.16.10.0/24 obviously does not match, and `Gateway of last resort is not set`. With no match at all, R2 **drops** the packet (and may return ICMP unreachable).\n\n- Gi0/0/1's connected route is a /30, not a /24; looking only at the third octet is the trap.\n- The /22 block ends at 172.16.11.255.\n- The OSPF /24 is for 172.16.10.0 only.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-009',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which two statements about R3 are true? (Choose two.)',
    exhibit: TABLE_C,
    options: [
      'R3 learned its default route from OSPF, and it points to 10.3.0.1.',
      '10.3.10.1 is an address configured on R3 GigabitEthernet0/0/1.',
      'The cost of 20 for 10.200.0.0/24 is the sum of the OSPF link costs between R3 and that network.',
      'The route to 10.3.20.0/24 is chosen over the default route because it has a lower administrative distance.',
      'R3 has no gateway of last resort, so traffic to the internet is dropped.',
      'R3 is the router that originates the default route into OSPF.',
    ],
    answer: [0, 1],
    explanation: "`O*E2 0.0.0.0/0 ... via 10.3.0.1` is an OSPF external default pointing at 10.3.0.1, and the `L 10.3.10.1/32` entry is R3's own address on Gi0/0/1.\n\n- For an `O E2` route the metric (20 here, the usual redistribution seed) does **not** include internal link costs.\n- 10.3.20.0/24 and the default both have AD 110; the /24 is used for its destinations because it is a longer prefix, not because of AD.\n- The gateway of last resort is set (10.3.0.1).\n- An originating router would have its own default (for example a static) rather than an `O*E2` learned from a neighbor.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-010',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 must forward a packet to 2001:DB8:A:B1:20C:29FF:FE3A:1. Which next hop does it use?',
    exhibit: `R1# show ipv6 route
IPv6 Routing Table - default - 10 entries
Codes: C - Connected, L - Local, S - Static, O - OSPF Intra (legend shortened)
S   ::/0 [1/0]
     via 2001:DB8:FFFF::1
C   2001:DB8:0:12::/64 [0/0]
     via GigabitEthernet0/0/1, directly connected
L   2001:DB8:0:12::1/128 [0/0]
     via GigabitEthernet0/0/1, receive
C   2001:DB8:0:13::/64 [0/0]
     via GigabitEthernet0/0/2, directly connected
L   2001:DB8:0:13::1/128 [0/0]
     via GigabitEthernet0/0/2, receive
S   2001:DB8:A::/48 [1/0]
     via 2001:DB8:0:12::2
O   2001:DB8:A:B1::/64 [110/2]
     via FE80::3, GigabitEthernet0/0/2
C   2001:DB8:FFFF::/64 [0/0]
     via GigabitEthernet0/0/0, directly connected
L   2001:DB8:FFFF::2/128 [0/0]
     via GigabitEthernet0/0/0, receive
L   FF00::/8 [0/0]
     via Null0, receive`,
    options: [
      'FE80::3 out GigabitEthernet0/0/2',
      '2001:DB8:0:12::2, because the static route has AD 1',
      '2001:DB8:FFFF::1, the default route',
      'None; the packet is dropped because FE80::3 is not a routable address',
    ],
    answer: [0],
    explanation: "The destination's first 64 bits are 2001:DB8:A:B1, which matches the OSPF route **2001:DB8:A:B1::/64**. It also matches the static /48 and ::/0, but /64 is the longest match, so R1 forwards to **FE80::3 out Gi0/0/2**.\n\n- AD (static 1 versus OSPF 110) is compared only for identical prefixes; /48 and /64 are different prefixes.\n- The default route is the least specific match.\n- Link-local next hops are normal for OSPFv3-learned routes; the router resolves FE80::3 on Gi0/0/2 with Neighbor Discovery. Only the packet's *destination* must be routable.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-011',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement describes how R1 forwards traffic to 10.50.0.0/16?',
    exhibit: `R1# show ip route ospf | begin 10.50
O        10.50.0.0/16 [110/3] via 10.0.13.3, 00:02:11, GigabitEthernet0/0/2
                      [110/3] via 10.0.12.2, 00:02:11, GigabitEthernet0/0/1`,
    options: [
      'Both paths are installed with equal cost, and CEF load-shares across them, by default per flow (source/destination pair)',
      'Only 10.0.13.3 is used; the second line is a backup route that is used if the first next hop fails',
      'R1 alternates every packet between the two next hops in strict round-robin order by default',
      'The route is unusable because a prefix may not have two next hops',
    ],
    answer: [0],
    explanation: "One prefix with two `via` lines and identical `[110/3]` values means **equal-cost multipath**. OSPF installs up to 4 equal-cost paths by default (`maximum-paths`), and CEF shares the load. The default CEF mode is per-destination, which hashes source and destination addresses so each flow stays on one path.\n\n- A backup path would not be in the routing table at all; only best routes are installed.\n- Per-packet round-robin is possible but is not the default.\n- Multiple next hops per prefix are perfectly valid.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-012',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An engineer asks an AI network assistant which path R1 uses for traffic to 10.40.1.25. How should the engineer judge the response?',
    exhibit: `R1# show ip route | include 10.40
D        10.40.0.0/16 [90/3072] via 10.0.13.3, 00:31:02, GigabitEthernet0/0/2
O        10.40.1.0/24 [110/3] via 10.0.12.2, 00:30:55, GigabitEthernet0/0/1

--- AI network assistant response ---
R1 forwards traffic for 10.40.1.25 to 10.0.13.3. Both routes match
the destination, and the EIGRP route wins because its administrative
distance (90) is lower than OSPF's (110).
Recommended action: none; routing is optimal.`,
    options: [
      'The response is correct: lower administrative distance always wins.',
      'The response is wrong: R1 uses 10.0.12.2 because the /24 is the longest prefix match, and AD only breaks ties between routes to the same prefix.',
      'The response is wrong: R1 uses 10.0.12.2 because the OSPF metric (3) is lower than the EIGRP metric (3072).',
      'The response is wrong: R1 load-shares between 10.0.12.2 and 10.0.13.3 because both routes match.',
    ],
    answer: [1],
    explanation: "Both routes are installed because they are **different prefixes** (/16 and /24). For each packet the router uses the longest matching prefix, so 10.40.1.25 goes to **10.0.12.2** via the OSPF /24. The assistant applied AD, which is only used when building the table to choose between sources offering the *same* prefix.\n\n- Metric comparison across protocols is meaningless, so the metric-based reasoning is also wrong even though it lands on the right next hop.\n- Load sharing applies only to equal-cost paths for the same prefix from the same source.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-013',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The ASBR that redistributes 10.99.0.0/16 is four OSPF hops away from R1. What does [110/20] tell you?',
    exhibit: `R1# show ip route ospf | include 10.99
O E2    10.99.0.0/16 [110/20] via 10.0.12.2, 00:44:10, GigabitEthernet0/0/1`,
    options: [
      'AD 110 and metric 20; for an E2 route the metric is the external cost set at the ASBR and does not include the internal cost to reach the ASBR',
      'AD 110 and metric 20, where 20 is the sum of the costs of the four links between R1 and the ASBR',
      'Metric 110 and AD 20, because external routes are trusted more than internal ones',
      'AD 110 and a hop count of 20 inherited from RIP',
    ],
    answer: [0],
    explanation: "Brackets are always `[AD/metric]`. An **E2** (external type 2) route carries the seed metric assigned at redistribution (20 by default for most sources) unchanged across the OSPF domain, so every router shows 20 regardless of distance. (Among several E2 paths with the same metric, OSPF breaks the tie by the internal cost to the ASBR, but that cost is not added to the displayed metric.)\n\n- E1 routes would add internal cost; E2 does not.\n- The order is AD first, metric second.\n- OSPF metrics are costs, never hop counts, even for routes that originally came from RIP.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-014',
    topic: '3.1',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default administrative distance of an external EIGRP route (code D EX)? Enter the number only.',
    answer: ['170'],
    explanation: 'External EIGRP routes (redistributed into EIGRP) have AD **170**, compared with 90 for internal EIGRP routes. That is why an OSPF route (110) to the same prefix is preferred over an external EIGRP route.',
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-015',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Which statement is correct?',
    exhibit: `R1# show ip route 10.77.5.9
Routing entry for 10.77.4.0/22
  Known via "ospf 1", distance 110, metric 21, type intra area
  Last update from 10.0.12.2 on GigabitEthernet0/0/1, 00:12:44 ago
  Routing Descriptor Blocks:
  * 10.0.12.2, from 4.4.4.4, 00:12:44 ago, via GigabitEthernet0/0/1
      Route metric is 21, traffic share count is 1`,
    options: [
      'The most specific route R1 has for 10.77.5.9 is 10.77.4.0/22; packets are forwarded to 10.0.12.2, and the router with RID 4.4.4.4 originated the route',
      'R1 has a host route for 10.77.5.9 learned from 10.0.12.2',
      'The router at 10.0.12.2 originated the route, and 4.4.4.4 is the next hop',
      'The destination is 21 router hops away from R1',
    ],
    answer: [0],
    explanation: "`show ip route <address>` performs a real lookup and prints the entry that would be used: **10.77.4.0/22** (10.77.4.0-10.77.7.255), learned by OSPF with AD 110 and cost 21. In the descriptor block, the first address (10.0.12.2) is the **next hop** and `from 4.4.4.4` is the **router ID that advertised** the route.\n\n- There is no /32 host route; the entry is a /22.\n- The next hop and the originator are reversed in that option.\n- OSPF metrics are cumulative costs, not hop counts.",
    lesson: '3.1-routing-table',
  },

  // ───────────────────────── 3.2 Static routing ─────────────────────────
  {
    id: 'd3-016',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: 'Which command creates a static route to 192.168.50.0/26 through the next-hop router 10.0.12.2?',
    options: [
      'ip route 192.168.50.0 255.255.255.192 10.0.12.2',
      'ip route 192.168.50.0 0.0.0.63 10.0.12.2',
      'ip route 192.168.50.0/26 10.0.12.2',
      'ip route 10.0.12.2 255.255.255.192 192.168.50.0',
    ],
    answer: [0],
    explanation: "IPv4 static routes take a **subnet mask** (not a wildcard and not a prefix length): `ip route <network> <mask> <next-hop>`. /26 = 255.255.255.192.\n\n- 0.0.0.63 is a wildcard mask, used by ACLs and OSPF `network` statements, not `ip route`.\n- Slash notation is used by `ipv6 route`, not by IPv4 `ip route`.\n- The last option reverses destination and next hop.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-017',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1's only OSPF neighbor, reached through GigabitEthernet0/0/1, fails and the adjacency goes down. Which default route does R1 then use?",
    exhibit: `R1# show running-config | include ip route
ip route 0.0.0.0 0.0.0.0 198.51.100.1 130

R1# show ip route | begin Gateway
Gateway of last resort is 10.0.12.2 to network 0.0.0.0

O*E2  0.0.0.0/0 [110/1] via 10.0.12.2, 02:10:33, GigabitEthernet0/0/1
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.0.12.0/30 is directly connected, GigabitEthernet0/0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/0/1
      198.51.100.0/24 is variably subnetted, 2 subnets, 2 masks
C        198.51.100.0/30 is directly connected, GigabitEthernet0/0/0
L        198.51.100.2/32 is directly connected, GigabitEthernet0/0/0`,
    options: [
      'S*  0.0.0.0/0 [130/0] via 198.51.100.1',
      'S*  0.0.0.0/0 [1/0] via 198.51.100.1, because a static route reverts to AD 1 once it is installed',
      'O*E2  0.0.0.0/0 [110/1] via 10.0.12.2, until the external LSA reaches its maximum age',
      'None; the static route must be re-entered because IOS rejected it while the OSPF default existed',
    ],
    answer: [0],
    explanation: "The static default has AD 130, higher than OSPF's 110, so it is a **floating static**: configured but kept out of the table while the OSPF default exists. When the adjacency drops, SPF runs again, the ASBR is unreachable, the `O*E2` route is removed, and the static route is installed as **`S* 0.0.0.0/0 [130/0] via 198.51.100.1`** (198.51.100.1 resolves through the connected /30 on Gi0/0/0).\n\n- The configured AD is kept; the table shows 130.\n- OSPF stops using a route as soon as the advertising router is unreachable in the SPF tree; it does not wait for the LSA to age out.\n- IOS accepts the command and keeps it in the configuration; it simply is not installed until it is the best route.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-018',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An engineer asks an AI assistant for a backup default route. How should the engineer respond to the output?',
    exhibit: `Prompt:
  R1 learns its default route from OSPF over the MPLS link. Add a backup
  default route to the LTE router at 192.168.99.1 (reached via
  GigabitEthernet0/0/2) that is used ONLY if the OSPF default disappears.

AI assistant output:
  R1(config)# ip route 0.0.0.0 0.0.0.0 192.168.99.1 100
  "AD 100 is a high value, so this route stays inactive while OSPF works."`,
    options: [
      'Accept it; the command creates a correct floating static route.',
      'Reject it; AD 100 is lower than OSPF\'s 110, so the static route would replace the OSPF default immediately. Use an AD above 110, for example: ip route 0.0.0.0 0.0.0.0 192.168.99.1 130',
      'Reject it; a backup default must use the default AD: ip route 0.0.0.0 0.0.0.0 192.168.99.1',
      'Reject it; a floating static route must specify only the exit interface: ip route 0.0.0.0 0.0.0.0 GigabitEthernet0/0/2 100',
      'Reject it; the AD must be 255 so the route is never preferred: ip route 0.0.0.0 0.0.0.0 192.168.99.1 255',
    ],
    answer: [1],
    explanation: "A floating static route works only if its AD is **higher** than the AD of the route it backs up. OSPF routes have AD 110, so AD 100 makes the static default *more* preferred and LTE becomes the primary path immediately. Any value from 111 to 254 works; 130 is a common choice.\n\n- AD 1 would also override OSPF permanently.\n- Exit-interface-only routes on Ethernet rely on proxy ARP and would still have the wrong AD.\n- AD 255 marks a route as unusable: it is never installed, so it could not act as a backup.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-019',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: 'R1 already routes 10.9.9.0/24 through 10.0.12.2. Traffic to the single server 10.9.9.9 must instead go through 10.0.13.3, while the rest of 10.9.9.0/24 keeps its current path. Which command achieves this?',
    options: [
      'ip route 10.9.9.9 255.255.255.255 10.0.13.3',
      'ip route 10.9.9.9 0.0.0.0 10.0.13.3',
      'ip route 10.9.9.0 255.255.255.0 10.0.13.3',
      'ip host 10.9.9.9 10.0.13.3',
    ],
    answer: [0],
    explanation: "A **host route** uses the mask 255.255.255.255 (/32). Being the longest possible IPv4 prefix, it beats the /24 for that one address, so only 10.9.9.9 is redirected.\n\n- Mask 0.0.0.0 with a non-zero network address is inconsistent; IOS rejects it (0.0.0.0 0.0.0.0 is only meaningful for the default route).\n- A second /24 route via 10.0.13.3 would move the whole subnet (both routes would be equal-cost with AD 1 and load-share).\n- `ip host` creates a static name-to-address mapping for DNS resolution; it does not route anything.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-020',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. R1's GigabitEthernet0/0/1 connects to R2's GigabitEthernet0/0/0. Which two commands on R1 correctly route 2001:DB8:5::/64 to R2? (Choose two.)",
    exhibit: `R2# show ipv6 interface brief
GigabitEthernet0/0/0   [up/up]
    FE80::2
    2001:DB8:0:12::2
GigabitEthernet0/0/1   [up/up]
    FE80::2
    2001:DB8:5::1`,
    options: [
      'ipv6 route 2001:DB8:5::/64 GigabitEthernet0/0/1 FE80::2',
      'ipv6 route 2001:DB8:5::/64 2001:DB8:0:12::2',
      'ipv6 route 2001:DB8:5::/64 FE80::2',
      'ipv6 route 2001:DB8:5::/64 2001:DB8:5::1',
      'ipv6 route 2001:DB8:5::/64 GigabitEthernet0/0/0 FE80::2',
    ],
    answer: [0, 1],
    explanation: "R2's address on the shared link is 2001:DB8:0:12::2 (global) / FE80::2 (link-local). A **global next hop** works on its own (recursive lookup through R1's connected 2001:DB8:0:12::/64). A **link-local next hop** must be paired with R1's own exit interface toward R2, which is Gi0/0/1.\n\n- A link-local next hop without an interface is rejected by IOS: FE80::2 exists on every link of R2 in this exhibit, which is exactly why IOS needs the interface.\n- 2001:DB8:5::1 is R2's address *inside* the destination prefix; R1 has no route to it, so the recursive lookup fails.\n- Gi0/0/0 is R2's interface name, not R1's exit interface.",
    lesson: '3.2-static-ipv6',
  },
  {
    id: 'd3-021',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. PC1 (10.1.1.10/24, gateway 10.1.1.1 on R1) cannot ping the server at 10.2.2.20 (gateway 10.2.2.1 on R2). R1 and R2 connect through 10.0.12.0/30. Which change restores connectivity?',
    exhibit: `R1# show ip route static
      10.0.0.0/8 is variably subnetted, 5 subnets, 3 masks
S        10.2.2.0/24 [1/0] via 10.0.12.2

R2# show ip route | begin Gateway
Gateway of last resort is not set

      10.0.0.0/8 is variably subnetted, 4 subnets, 3 masks
C        10.0.12.0/30 is directly connected, GigabitEthernet0/0/1
L        10.0.12.2/32 is directly connected, GigabitEthernet0/0/1
C        10.2.2.0/24 is directly connected, GigabitEthernet0/0/0
L        10.2.2.1/32 is directly connected, GigabitEthernet0/0/0

PC1> ping 10.2.2.20
Request timed out.
Request timed out.`,
    options: [
      'On R2: ip route 10.1.1.0 255.255.255.0 10.0.12.1',
      'On R1: ip route 10.2.2.0 255.255.255.0 10.0.12.1',
      'On R1: ip route 10.1.1.0 255.255.255.0 10.0.12.2',
      'On R2: ip route 10.2.2.0 255.255.255.0 10.0.12.1',
    ],
    answer: [0],
    explanation: "The echo requests reach the server: R1 has a valid route to 10.2.2.0/24, and R2 is directly connected to it. The **replies** fail: R2 has no route to 10.1.1.0/24 and no default route. Adding `ip route 10.1.1.0 255.255.255.0 10.0.12.1` on R2 provides the **return route**.\n\n- R1's existing route via 10.0.12.2 is correct; 10.0.12.1 is R1's own address.\n- 10.1.1.0/24 is directly connected on R1; a static route there is unnecessary and points the wrong way.\n- R2 is directly connected to 10.2.2.0/24 already.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-022',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R1 connects only to R2 (10.0.12.2). R2 connects to R3 over 10.0.23.0/24, and 10.30.0.0/16 is behind R3. R1 runs no routing protocol. Why is the configured static route not in the routing table?',
    exhibit: `R1# show running-config | include ip route
ip route 10.30.0.0 255.255.0.0 10.0.23.3

R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   10.1.1.1        YES manual up                    up
GigabitEthernet0/0/1   10.0.12.1       YES manual up                    up

R1# show ip route 10.30.0.0
% Subnet not in table

R1# show ip route 10.0.23.3
% Subnet not in table`,
    options: [
      "The next hop 10.0.23.3 is not reachable from R1, so the recursive lookup fails and IOS does not install the route; the next hop should be R2's address, 10.0.12.2",
      "The mask 255.255.0.0 does not match the /24 used on R3's links, so IOS rejects the route",
      'Static routes are shown only by show ip route static, not by show ip route <prefix>',
      'Static routes are installed only after the first packet to the destination is received',
    ],
    answer: [0],
    explanation: "A next-hop-only static route needs a route to its next hop. 10.0.23.3 is on the R2-R3 link, which R1 has no route to (`% Subnet not in table`), so the route stays in the configuration but is **not installed**. The next hop must be a directly reachable neighbor, here **10.0.12.2**. (Adding a route to 10.0.23.0/24 via R2 would also make the lookup resolve, but pointing at the directly connected neighbor is the clean fix.)\n\n- A static route's mask is independent of the masks used elsewhere.\n- `show ip route <prefix>` shows routes from any source.\n- Static routes are installed as soon as they are valid; no traffic is needed.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-023',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Users behind R1 cannot reach 10.2.2.0/24, which is behind R2. What is the problem?',
    exhibit: `R1# show ip route static
      10.0.0.0/8 is variably subnetted, 5 subnets, 2 masks
S        10.2.2.0/24 [1/0] via 10.0.12.3

R1# show ip arp
Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  10.0.12.1               -   00a3.d14f.2201  ARPA   GigabitEthernet0/0/1
Internet  10.0.12.2              14   00a3.d14f.3302  ARPA   GigabitEthernet0/0/1
Internet  10.0.12.3               0   Incomplete      ARPA
Internet  10.1.1.1                -   00a3.d14f.2200  ARPA   GigabitEthernet0/0/0

R1# show cdp neighbors detail
-------------------------
Device ID: R2
Entry address(es):
  IP address: 10.0.12.2
Platform: cisco ISR4331/K9,  Capabilities: Router Switch IGMP
Interface: GigabitEthernet0/0/1,  Port ID (outgoing port): GigabitEthernet0/0/1`,
    options: [
      'The static route uses the wrong next hop; 10.0.12.3 does not answer ARP, and R2 is 10.0.12.2',
      'The static route is not installed because 10.0.12.3 is not in a connected subnet',
      'R2 has proxy ARP disabled, so R1 cannot resolve 10.0.12.3',
      'The static route needs an exit interface because the ARP entry is incomplete',
    ],
    answer: [0],
    explanation: "The route *is* installed (10.0.12.3 resolves through the connected 10.0.12.0/24), so R1 tries to forward to 10.0.12.3 and ARPs for it. Nothing answers (`Incomplete`). CDP shows the real neighbor R2 at **10.0.12.2**. Fix: `no ip route 10.2.2.0 255.255.255.0 10.0.12.3` and `ip route 10.2.2.0 255.255.255.0 10.0.12.2`.\n\n- The route is in the table, so the recursive lookup succeeded.\n- Proxy ARP only matters when a router ARPs for an address that is *not* on the segment; 10.0.12.3 is on-link and simply does not exist.\n- Adding an exit interface would not create a device at 10.0.12.3.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-024',
    topic: '3.2',
    type: 'fill',
    difficulty: 2,
    stem: 'Enter the global configuration command that creates an IPv6 default route with next hop 2001:DB8:0:1::1 (default AD).',
    answer: [
      'ipv6 route ::/0 2001:db8:0:1::1',
      'ipv6 route ::/0 2001:db8:0:1:0:0:0:1',
      'ipv6 route ::0/0 2001:db8:0:1::1',
      'ipv6 route 0::/0 2001:db8:0:1::1',
      'ipv6 route ::/0 2001:0db8:0000:0001:0000:0000:0000:0001',
    ],
    explanation: 'The IPv6 default route is `::/0`: `ipv6 route ::/0 2001:DB8:0:1::1`. Unlike IPv4, there is no separate mask argument; the prefix length is written after a slash.',
    lesson: '3.2-static-ipv6',
  },
  {
    id: 'd3-025',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. R1's internet traffic stopped working right after the ISP replaced its router at 203.0.113.1. R1's GigabitEthernet0/0/0 is 203.0.113.2/30 and is up/up. What is the most likely cause?",
    exhibit: `R1# show running-config | include ip route
ip route 0.0.0.0 0.0.0.0 GigabitEthernet0/0/0

R1# show ip arp | include Incomplete
Internet  192.0.2.80              0   Incomplete      ARPA
Internet  198.51.100.25           0   Incomplete      ARPA
Internet  198.51.100.140          0   Incomplete      ARPA`,
    options: [
      'The default route names only an Ethernet exit interface, so R1 ARPs for every destination; the new ISP router does not answer with proxy ARP. Use ip route 0.0.0.0 0.0.0.0 203.0.113.1 instead',
      'R1 must enable ip proxy-arp on GigabitEthernet0/0/0 so that it can resolve remote addresses',
      'The ARP cache holds stale entries for the old ISP router; clear arp-cache will fix it permanently',
      'The default route should be written as ip route 0.0.0.0 255.255.255.255 GigabitEthernet0/0/0',
    ],
    answer: [0],
    explanation: "With an exit-interface-only route on Ethernet, R1 treats every destination as on-link and sends an ARP request for the **final destination IP** (192.0.2.80 and so on). That works only if the upstream router answers with **proxy ARP**. The old ISP router did; the new one evidently does not, so every entry stays `Incomplete`. Pointing the route at the next hop 203.0.113.1 means R1 ARPs only for the ISP router.\n\n- `ip proxy-arp` on R1 controls whether *R1 answers* ARP for others; it does nothing for R1's own requests.\n- The incomplete entries are for remote hosts, not the ISP router; clearing the cache just repeats the failure.\n- 255.255.255.255 would make it a host route for 0.0.0.0, not a default route.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-026',
    topic: '3.2',
    type: 'match',
    difficulty: 1,
    stem: 'Match each static route type to the command that creates it.',
    pairs: [
      ['IPv4 default route', 'ip route 0.0.0.0 0.0.0.0 203.0.113.1'],
      ['Network route', 'ip route 172.16.32.0 255.255.240.0 10.0.12.2'],
      ['Host route', 'ip route 172.16.40.7 255.255.255.255 10.0.13.3'],
      ['Floating static route', 'ip route 172.16.32.0 255.255.240.0 10.0.14.4 130'],
      ['IPv6 default route', 'ipv6 route ::/0 2001:DB8:0:12::2'],
    ],
    explanation: "Default routes use an all-zeros prefix (`0.0.0.0 0.0.0.0` or `::/0`). A network route names a subnet or summary (here 172.16.32.0/20). A host route uses a /32 mask. The floating static is the one with a raised AD (130), which keeps it out of the table while a better route to 172.16.32.0/20 exists. Note that the host route 172.16.40.7/32 sits inside 172.16.32.0/20 and wins for that one address by longest match.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-027',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. Which command produced this routing table entry?',
    exhibit: `S        10.9.0.0/16 is directly connected, GigabitEthernet0/0/1`,
    options: [
      'ip route 10.9.0.0 255.255.0.0 GigabitEthernet0/0/1',
      'ip route 10.9.0.0 255.255.0.0 10.0.12.2',
      'ip route 10.9.0.0 255.255.0.0 GigabitEthernet0/0/1 10.0.12.2',
      'ip address 10.9.0.1 255.255.0.0 on interface GigabitEthernet0/0/1',
    ],
    answer: [0],
    explanation: "An `S` route described as \"directly connected\" with no `via` address is an **exit-interface-only** static route. Its AD is still 1 even though no brackets are shown.\n\n- A next-hop route displays `[1/0] via 10.0.12.2`.\n- A fully specified route displays `[1/0] via 10.0.12.2, GigabitEthernet0/0/1`.\n- An interface address creates `C` and `L` entries, not `S`.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-028',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 reaches R2 through GigabitEthernet0/0/1, and FE80::2 is the link-local address of R2 on that link. How should the engineer judge the AI assistant\'s diagnosis and fix?',
    exhibit: `R1(config)# ipv6 route 2001:DB8:20::/48 FE80::2
% Interface has to be specified for a link-local nexthop

--- AI network assistant ---
Diagnosis: FE80::2 is a link-local address. Link-local addresses are
only unique on a single link, so IOS must be told which interface to
use to reach it.
Fix:
  R1(config)# ipv6 route 2001:DB8:20::/48 GigabitEthernet0/0/1 FE80::2`,
    options: [
      'The diagnosis and fix are correct.',
      'Wrong: IPv6 static routes cannot use link-local next hops at all; only a global next hop works.',
      'Wrong: the real problem is that ipv6 unicast-routing is disabled.',
      'Wrong: IPv6 static routes must use a /64 prefix length.',
    ],
    answer: [0],
    explanation: "The assistant is right. A link-local next hop is only meaningful together with its interface, so IOS requires the exit interface (`ipv6 route <prefix> <interface> <link-local>`). Naming Gi0/0/1, R1's interface toward R2, makes the route valid.\n\n- Link-local next hops are fully supported (and are what IGPs use); they just need the interface.\n- `ipv6 unicast-routing` affects forwarding, and the error message points specifically at the missing interface.\n- Static routes can use any prefix length (/48 here, /128 for host routes, /0 for default).",
    lesson: '3.2-static-ipv6',
  },
  {
    id: 'd3-029',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about floating static routes are true? (Choose two.)',
    options: [
      'A floating static route is configured with an administrative distance higher than that of the route it backs up.',
      'While the primary route is present, the floating static route appears in the running configuration but not in the routing table.',
      'A floating static route must use an exit interface instead of a next-hop address.',
      'A floating static route with AD 90 is a suitable backup for an OSPF-learned route.',
      'A floating static route is installed alongside the primary route and shares the load with it.',
      'Once installed, a floating static route is shown with AD 1 in the routing table.',
    ],
    answer: [0, 1],
    explanation: "A floating static route is an ordinary static route with a raised AD. While a route to the same prefix with lower AD exists, the static is not installed (visible only in the config). When the primary disappears, the static is installed with its configured AD.\n\n- Any static route form (next hop, interface, or both) can float.\n- AD 90 is lower than OSPF's 110, so it would *replace* the OSPF route.\n- Routes from different sources are never load-shared; only the lowest-AD route to a prefix is installed.\n- The table shows the configured AD, for example `[130/0]`.",
    lesson: '3.2-static-ipv4',
  },

  // ───────────────────────── 3.3 OSPFv2 / OSPFv3 ─────────────────────────
  {
    id: 'd3-030',
    topic: '3.3',
    type: 'order',
    difficulty: 1,
    stem: 'Order the OSPF neighbor states a router passes through on a broadcast network, from first to last, when forming a full adjacency with the DR.',
    items: ['Down', 'Init', '2-Way', 'ExStart', 'Exchange', 'Loading', 'Full'],
    explanation: "**Down** (no hellos heard) -> **Init** (hello received, but our RID is not in it) -> **2-Way** (each sees itself in the other's hello; DR/BDR election happens here) -> **ExStart** (master/slave and DBD sequence number agreed) -> **Exchange** (DBDs describe the LSDBs) -> **Loading** (LSR/LSU for missing LSAs) -> **Full** (databases synchronized). Attempt exists only on NBMA networks with manually configured neighbors.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-031',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 Gi0/0/1 and R2 Gi0/0/0 are on the same Ethernet segment, but they never become OSPF neighbors. What is the cause?',
    exhibit: `R1# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Lo0          1     0               1.1.1.1/32         1     LOOP  0/0
Gi0/0/1      1     0               10.0.12.1/24       1     DR    0/0

R2# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Lo0          1     0               2.2.2.2/32         1     LOOP  0/0
Gi0/0/0      1     1               10.0.12.2/24       1     DR    0/0`,
    options: [
      'R2 Gi0/0/0 is in area 1 while R1 Gi0/0/1 is in area 0; the area ID in the hellos must match',
      'Both routers elected themselves DR, and two DRs on one segment block the adjacency',
      'The interface costs are equal, so OSPF cannot choose a path',
      'Both routers use process ID 1, which must be unique on each router in the domain',
    ],
    answer: [0],
    explanation: "The `Area` column shows the mismatch: area 0 on R1, area 1 on R2. The area ID is carried in every hello and must match, so each router ignores the other's hellos. Fix R2 with `ip ospf 1 area 0` on Gi0/0/0 (or the matching `network ... area 0` statement).\n\n- Each router shows itself as DR with 0 neighbors because it never heard a valid hello; that is a *symptom*, not the cause.\n- Interface cost has nothing to do with forming an adjacency.\n- Process IDs are locally significant; matching or different values are both fine.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-032',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Two routers are connected to the same Ethernet segment with OSPFv2 enabled (broadcast network type, no authentication). Which three parameters must match for them to become neighbors? (Choose three.)',
    options: [
      'Area ID',
      'Hello and dead intervals',
      'Subnet and subnet mask',
      'OSPF process ID',
      'Router ID',
      'Interface priority',
    ],
    answer: [0, 1, 2],
    explanation: "Hello packets carry the area ID, hello/dead intervals and network mask (also authentication data and the stub flag); a mismatch means the hello is discarded.\n\n- The process ID is local to each router (`router ospf 1` and `router ospf 99` neighbor happily).\n- Router IDs must be **unique**, not equal.\n- Priority only influences the DR/BDR election and can differ freely.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-033',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R4 has just been reloaded. No router-id command is configured. Which OSPF router ID does R4 use?',
    exhibit: `R4# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   192.168.200.4   YES manual up                    up
GigabitEthernet0/0/1   10.0.34.4       YES manual up                    up
GigabitEthernet0/0/2   172.31.255.254  YES manual administratively down down
Loopback0              10.255.0.4      YES manual up                    up
Loopback1              10.4.4.4        YES manual up                    up

R4# show running-config | section router ospf
router ospf 1
 network 10.0.34.0 0.0.0.255 area 0
 network 192.168.200.0 0.0.0.255 area 0`,
    options: ['10.255.0.4', '192.168.200.4', '10.4.4.4', '10.0.34.4'],
    answer: [0],
    explanation: "With no `router-id`, IOS takes the **highest IPv4 address on an up loopback**: 10.255.0.4 is higher than 10.4.4.4 (compare the second octet, 255 > 4). The loopbacks do not need to be enabled for OSPF to be used for the RID.\n\n- 192.168.200.4 is the highest *physical* address, but physical interfaces are considered only if no loopback is up.\n- 10.4.4.4 looks like a typical hand-picked RID, but it is the lower loopback address.\n- 10.0.34.4 being OSPF-enabled is irrelevant to RID selection.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-034',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. All four routers are connected to the same VLAN, run OSPF area 0 on it with the broadcast network type, and start their OSPF processes at the same moment. Which routers become DR and BDR?',
    exhibit: `Router   Router ID      OSPF priority on the VLAN interface
R1       10.0.0.1       50
R2       10.0.0.22      50
R3       99.99.99.99    0
R4       4.4.4.4        10`,
    options: [
      'R2 is DR and R1 is BDR',
      'R1 is DR and R2 is BDR',
      'R3 is DR and R2 is BDR',
      'R2 is DR and R4 is BDR',
    ],
    answer: [0],
    explanation: "Highest priority wins first. R1 and R2 tie at 50, so the higher router ID decides: 10.0.0.22 > 10.0.0.1, making **R2 the DR**. The BDR is the best of the rest: **R1** (priority 50) beats R4 (10).\n\n- R1 only wins if you compare RIDs as text or ignore the last octet.\n- R3 has the highest RID, but priority 0 makes it ineligible for both roles.\n- R4's priority of 10 is lower than R1's 50.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-035',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R5 (RID 5.5.5.5, priority 200) was just connected to an existing segment where R1 is DR and R2 is BDR. Which statement is correct?',
    exhibit: `R5# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1          10   FULL/DR         00:00:37    10.100.0.1      GigabitEthernet0/0/0
2.2.2.2           5   FULL/BDR        00:00:31    10.100.0.2      GigabitEthernet0/0/0`,
    options: [
      'R5 is a DROTHER; if R1 later fails, R2 becomes DR and R5 is elected BDR',
      'R5 becomes the DR as soon as its adjacencies are Full because it has the highest priority',
      'R5 is a DROTHER; if R1 later fails, R5 becomes DR directly because it has the highest priority',
      'R5 immediately becomes the BDR and R2 becomes a DROTHER',
    ],
    answer: [0],
    explanation: "DR/BDR election is **non-preemptive**. A router joining a segment that already has a DR and BDR accepts them, so R5 is a DROTHER despite priority 200 (it is Full with both, as the exhibit shows). If the DR fails, the **BDR is promoted** to DR and a new BDR election runs among the remaining eligible routers, which R5 wins.\n\n- Higher priority does not take over an existing DR or BDR role.\n- The BDR, not the highest-priority router, replaces a failed DR; that is the purpose of the BDR.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-036',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A junior engineer opens a ticket saying R4 is "stuck in 2WAY" with R3. Which response is correct?',
    exhibit: `R4# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1         100   FULL/DR         00:00:34    10.50.0.1       GigabitEthernet0/0/0
2.2.2.2          50   FULL/BDR        00:00:37    10.50.0.2       GigabitEthernet0/0/0
3.3.3.3           1   2WAY/DROTHER    00:00:31    10.50.0.3       GigabitEthernet0/0/0`,
    options: [
      'This is normal: two DROTHERs stay in 2-Way with each other and exchange LSAs through the DR and BDR',
      'R3 and R4 have an MTU mismatch, which stops them at 2-Way',
      'R3 and R4 have mismatched hello timers',
      'R4 should be given priority 0 so that it can reach Full with R3',
    ],
    answer: [0],
    explanation: "On a broadcast segment, routers form Full adjacencies only with the DR and BDR. R4 (a DROTHER, since R1 and R2 hold the roles) and R3 (also DROTHER) correctly remain **2WAY/DROTHER**. All LSAs still reach both via the DR.\n\n- An MTU mismatch shows up as ExStart/Exchange, and only between routers that try to go Full.\n- Mismatched hello timers would prevent the neighbor from appearing at all.\n- Priority 0 only removes DR/BDR eligibility; it never creates a Full adjacency between DROTHERs.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-037',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. show ip ospf neighbor on both routers returns no entries. Interface addresses, masks and areas are correct. Which change fixes the problem?',
    exhibit: `R1# show ip ospf interface GigabitEthernet0/0/1 | include Network Type|Timer
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5

R2# show ip ospf interface GigabitEthernet0/0/0 | include Network Type|Timer
  Process ID 1, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 1
  Timer intervals configured, Hello 5, Dead 20, Wait 20, Retransmit 5`,
    options: [
      'On R2 Gi0/0/0, restore the defaults so hello is 10 and dead is 40 (ip ospf hello-interval 10 and ip ospf dead-interval 40)',
      'On both interfaces, configure ip ospf network point-to-point',
      'On R1, configure ip ospf priority 0',
      'On both interfaces, configure ip ospf mtu-ignore',
    ],
    answer: [0],
    explanation: "Hello and dead intervals are carried in hellos and must match exactly. R1 uses 10/40 and R2 uses 5/20, so each discards the other's hellos and no neighbor appears. Setting R2 back to 10/40 (or removing its custom timers) fixes it.\n\n- Point-to-point network type keeps the same 10/40 defaults *only if* no custom timers are set; R2's explicit 5/20 would still mismatch.\n- Priority affects only DR/BDR election.\n- `mtu-ignore` addresses ExStart/Exchange problems, which require hellos to work first.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-038',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'R1 has three interfaces: Gi0/0/0 10.1.20.5/27, Gi0/0/1 10.1.20.40/27 and Gi0/0/2 10.1.20.70/27. Which single OSPF statement enables OSPF on Gi0/0/0 and Gi0/0/1 but not on Gi0/0/2?',
    options: [
      'network 10.1.20.0 0.0.0.63 area 0',
      'network 10.1.20.0 0.0.0.31 area 0',
      'network 10.1.20.0 0.0.0.127 area 0',
      'network 10.1.20.32 0.0.0.31 area 0',
      'network 10.1.20.64 0.0.0.63 area 0',
    ],
    answer: [0],
    explanation: "A `network` statement matches **interface addresses**. Wildcard 0.0.0.63 from 10.1.20.0 matches .0-.63: it includes .5 and .40 but not .70. The wildcard does not have to equal the interfaces' /27 mask.\n\n- 0.0.0.31 from .0 covers .0-.31: only Gi0/0/0.\n- 0.0.0.127 covers .0-.127: all three interfaces.\n- 10.1.20.32 0.0.0.31 covers .32-.63: only Gi0/0/1.\n- 10.1.20.64 0.0.0.63 covers .64-.127: only Gi0/0/2.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-039',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Every router in the area is configured with auto-cost reference-bandwidth 10000. What OSPF cost does a 100 Mbps interface get, assuming no bandwidth or ip ospf cost commands? Enter the number only.',
    answer: ['100'],
    explanation: 'Cost = reference bandwidth / interface bandwidth = 10,000 Mbps / 100 Mbps = **100**. (With the default 100 Mbps reference it would be 1, the same as a 1 Gbps or 10 Gbps link.)',
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-040',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 reaches 10.9.9.0/24 (behind R4) through R2 or R3. The R1-R3 link negotiated 100 Mbps; every other link is 1 Gbps. All routers use default OSPF settings. Why does R1 load-share across both paths, and what is the best fix?',
    exhibit: `R1# show ip route 10.9.9.0
Routing entry for 10.9.9.0/24
  Known via "ospf 1", distance 110, metric 2, type intra area
  Last update from 10.0.13.3 on GigabitEthernet0/0/2, 00:03:52 ago
  Routing Descriptor Blocks:
  * 10.0.12.2, from 4.4.4.4, 00:03:52 ago, via GigabitEthernet0/0/1
      Route metric is 2, traffic share count is 1
    10.0.13.3, from 4.4.4.4, 00:03:52 ago, via GigabitEthernet0/0/2
      Route metric is 2, traffic share count is 1

R1# show interfaces GigabitEthernet0/0/1 | include BW
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,
R1# show interfaces GigabitEthernet0/0/2 | include BW
  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec,`,
    options: [
      'With the default 100 Mbps reference bandwidth, 100 Mbps and 1 Gbps links both cost 1, so both paths cost 2. Configure auto-cost reference-bandwidth 10000 (or higher) on every OSPF router',
      'OSPF always load-shares across all available paths. Configure maximum-paths 1 so only the fastest path is used',
      'Gi0/0/2 has the wrong bandwidth value. Configure bandwidth 1000000 on Gi0/0/2',
      'The paths tie because both neighbors have the same router ID. Change the router ID on R3',
    ],
    answer: [0],
    explanation: "Default cost = 100 Mbps / bandwidth, minimum 1, so a 100 Mbps link and a 1 Gbps link both cost 1. Each path totals 1 + 1 = 2, creating ECMP. With `auto-cost reference-bandwidth 10000` on all routers, the R2 path costs 10 + 10 = 20 and the R3 path costs 100 + 10 = 110, so only the R2 path is used.\n\n- `maximum-paths 1` keeps just one of the tied paths, with no guarantee it is the faster one; it hides the cost problem instead of fixing it.\n- Setting `bandwidth 1000000` on the 100 Mbps link would lie to OSPF and make the slow link look fast.\n- The routes come from the same originator (4.4.4.4); neighbors R2 and R3 have different RIDs, and RIDs play no part in cost.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-041',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R2 is Full with R3 on Gi0/0/2 but never forms a neighbor relationship with R1, which is connected to Gi0/0/0. Gi0/0/1 is a user LAN with no routers. What is the cause?',
    exhibit: `R2# show ip protocols | section ospf
Routing Protocol is "ospf 1"
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Router ID 2.2.2.2
  Number of areas in this router is 1. 1 normal 0 stub 0 nssa
  Maximum path: 4
  Routing for Networks:
    10.0.0.0 0.255.255.255 area 0
  Passive Interface(s):
    GigabitEthernet0/0/0
    GigabitEthernet0/0/1
  Routing Information Sources:
    Gateway         Distance      Last Update
    3.3.3.3              110      00:22:16
  Distance: (default is 110)

R2# show ip interface brief | include Gig
GigabitEthernet0/0/0   10.0.12.2       YES manual up                    up
GigabitEthernet0/0/1   10.20.1.1       YES manual up                    up
GigabitEthernet0/0/2   10.0.23.2       YES manual up                    up`,
    options: [
      'Gi0/0/0 is a passive interface, so R2 sends no hellos on it; configure no passive-interface GigabitEthernet0/0/0',
      'The network statement does not include 10.0.12.2, so OSPF is not enabled on Gi0/0/0',
      'Gi0/0/1 should not be passive, because passive interfaces block all OSPF adjacencies on the router',
      'R1 is filtered by an incoming distribute list, as shown by the update filter lines',
    ],
    answer: [0],
    explanation: "`Passive Interface(s)` lists Gi0/0/0, the link to R1. A passive interface's subnet is still advertised, but no hellos are sent or processed on it, so no neighbor can form. Gi0/0/1 being passive is correct for a host-only LAN.\n\n- `network 10.0.0.0 0.255.255.255` matches 10.0.12.2, so OSPF *is* enabled there (just passive).\n- Passive affects only the interfaces listed; R2 is clearly Full with R3.\n- Both filter lines say \"is not set\".",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-042',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 is the internet edge router. R2 and R3 are Full with R1 but have no default route. What is the cause?',
    exhibit: `R1# show running-config | section router ospf
router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.255.255.255 area 0
 default-information originate

R1# show running-config | include ip route
R1#

R1# show ip route 0.0.0.0
% Network not in table`,
    options: [
      'R1 has no default route of its own; without the always keyword, default-information originate advertises a default only while one is in R1\'s routing table. Add one, for example ip route 0.0.0.0 0.0.0.0 203.0.113.1',
      'default-information originate must also be configured on R2 and R3 so that they accept the default route',
      'R1 needs network 0.0.0.0 255.255.255.255 area 0 to advertise the default route',
      'R2 and R3 need ip default-gateway 1.1.1.1 because OSPF cannot carry default routes',
    ],
    answer: [0],
    explanation: "`default-information originate` is conditional: R1 originates the external default (seen elsewhere as `O*E2 0.0.0.0/0`) only if R1 itself has a default route. Here it has none (`% Network not in table`, no `ip route`). Adding the ISP-facing static default fixes it. (`default-information originate always` would also advertise it, but would attract traffic even when R1 has no way out.)\n\n- The command is needed only on the router that injects the default.\n- `network 0.0.0.0 255.255.255.255` enables OSPF on all interfaces; it does not create a default route.\n- OSPF carries default routes fine; `ip default-gateway` is for devices with IP routing disabled.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-043',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `R1# show ip ospf interface GigabitEthernet0/0/1
GigabitEthernet0/0/1 is up, line protocol is up
  Internet Address 10.0.12.1/30, Area 0, Attached via Interface Enable
  Process ID 1, Router ID 1.1.1.1, Network Type POINT_TO_POINT, Cost: 10
  Topology-MTID    Cost    Disabled    Shutdown      Topology Name
        0           10        no          no            Base
  Enabled by interface config, including secondary ip addresses
  Transmit Delay is 1 sec, State POINT_TO_POINT
  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5
    oob-resync timeout 40
    Hello due in 00:00:06
  Supports Link-local Signaling (LLS)
  Index 1/2/2, flood queue length 0
  Next 0x0(0)/0x0(0)/0x0(0)
  Last flood scan length is 1, maximum is 1
  Last flood scan time is 0 msec, maximum is 0 msec
  Neighbor Count is 1, Adjacent neighbor count is 1
    Adjacent with neighbor 2.2.2.2
  Suppress hello for 0 neighbor(s)`,
    options: [
      'No DR or BDR is elected on this link.',
      'OSPF was enabled with the ip ospf 1 area 0 interface command rather than a network statement.',
      'The cost of 10 shows that the reference bandwidth is still the default 100 Mbps.',
      'R1 sends hellos on this interface every 40 seconds.',
      'In show ip ospf neighbor, 2.2.2.2 appears as FULL/DR.',
    ],
    answer: [0, 1],
    explanation: "`Network Type POINT_TO_POINT` and `State POINT_TO_POINT` mean no DR/BDR election (the neighbor shows as `FULL/  -`). `Attached via Interface Enable` and `Enabled by interface config` show the `ip ospf 1 area 0` method.\n\n- With a 100 Mbps reference, a gigabit link costs 1; a cost of 10 points to a raised reference bandwidth (or a manual `ip ospf cost`).\n- Hello is 10 seconds; 40 is the dead interval.\n- There is no DR on a point-to-point network, so FULL/DR is impossible.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-044',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R7 has no IPv4 addresses on any interface. ipv6 unicast-routing is enabled, but OSPFv3 never starts and R7 logs that it cannot select a router ID. Which change fixes the problem?',
    exhibit: `R7# show running-config | section ipv6 router ospf|interface Gig
interface GigabitEthernet0/0/0
 no ip address
 ipv6 address 2001:DB8:0:17::7/64
 ipv6 ospf 1 area 0
interface GigabitEthernet0/0/1
 no ip address
 ipv6 address 2001:DB8:7::1/64
 ipv6 ospf 1 area 0
ipv6 router ospf 1`,
    options: [
      'Configure router-id 7.7.7.7 under ipv6 router ospf 1',
      'Add network 2001:DB8:0:17::/64 area 0 under ipv6 router ospf 1',
      'Add an IPv6 loopback interface so OSPFv3 can derive its router ID from the highest IPv6 address',
      'Configure ipv6 ospf network point-to-point on both interfaces',
    ],
    answer: [0],
    explanation: "OSPFv3 still uses a **32-bit, dotted-decimal router ID**, chosen from IPv4 addresses just as in OSPFv2. With no IPv4 address on the router, it cannot pick one, so it must be set manually with `router-id`. (Adding any IPv4 address, such as a loopback, would also work, but the explicit RID is the standard fix.)\n\n- OSPFv3 has no `network` command; interfaces are enabled with `ipv6 ospf 1 area 0`, which R7 already has.\n- A 128-bit IPv6 address cannot be used as a 32-bit router ID.\n- The network type has nothing to do with RID selection.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-045',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Why do the OSPFv3 routes on R1 use FE80:: addresses as next hops?',
    exhibit: `R1# show ipv6 route ospf
IPv6 Routing Table - default - 9 entries
Codes: O - OSPF Intra, OI - OSPF Inter (legend shortened)
O   2001:DB8:20::/64 [110/2]
     via FE80::2, GigabitEthernet0/0/1
O   2001:DB8:30::/64 [110/2]
     via FE80::3, GigabitEthernet0/0/2

R1# show ipv6 ospf neighbor

            OSPFv3 Router with ID (1.1.1.1) (Process ID 1)

Neighbor ID     Pri   State           Dead Time   Interface ID    Interface
3.3.3.3           1   FULL/DR         00:00:38    5               GigabitEthernet0/0/2
2.2.2.2           1   FULL/BDR        00:00:32    4               GigabitEthernet0/0/1`,
    options: [
      "OSPFv3 neighbors communicate using link-local addresses, so each route's next hop is the neighbor's link-local address on the outgoing interface",
      'R1 has no global IPv6 addresses on Gi0/0/1 and Gi0/0/2, so it has to fall back to link-local next hops',
      'The routes are unusable until static routes with global next hops are added',
      'FE80::2 and FE80::3 are the neighbors\' router IDs written in IPv6 format',
    ],
    answer: [0],
    explanation: "OSPFv3 sends its packets from link-local source addresses (to FF02::5/FF02::6), so the address R1 learns for each neighbor, and therefore the next hop, is the neighbor's **link-local** address, always paired with the exit interface. This is normal and fully functional.\n\n- Link-local next hops are used even when global addresses exist on the links.\n- The routes forward traffic as they are; no static routes are needed.\n- Router IDs are 32-bit values (2.2.2.2, 3.3.3.3), shown in the Neighbor ID column.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-046',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The R1-R2 adjacency has not come up for ten minutes. An AI assistant analyzed the outputs. How should the engineer judge the assistant's conclusion?",
    exhibit: `R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   EXSTART/DR      00:00:36    10.0.12.2       GigabitEthernet0/0/1

R1# show ip interface GigabitEthernet0/0/1 | include MTU
  MTU is 1500 bytes
R2# show ip interface GigabitEthernet0/0/0 | include MTU
  MTU is 1400 bytes

--- AI network assistant analysis ---
Root cause: OSPF hello/dead timer mismatch between R1 and R2.
Evidence: neighbor has not reached FULL after 10 minutes.
Recommended fix (R2):
  interface GigabitEthernet0/0/0
   ip ospf hello-interval 10
   ip ospf dead-interval 40`,
    options: [
      'The conclusion is correct; timer mismatches leave neighbors in ExStart.',
      'The conclusion is wrong: reaching ExStart proves the hello parameters already match. The IP MTU mismatch (1500 versus 1400) stalls the DBD exchange; make the IP MTUs match (ip ospf mtu-ignore is a workaround).',
      'The conclusion is wrong: R1 must be the DR. Raise R1\'s OSPF priority and clear the OSPF process.',
      'The conclusion is wrong: ExStart indicates an area mismatch; move R2 Gi0/0/0 into area 0.',
    ],
    answer: [1],
    explanation: "Hello/dead, area and mask mismatches stop routers *before* 2-Way, because hellos are discarded. These routers have reached **ExStart**, so hellos match and the DR/BDR election has already happened. Being stuck in ExStart/Exchange is the classic **IP MTU mismatch** symptom: the DBD exchange fails when one side advertises a larger MTU than the other accepts. Align the IP MTU (preferred) or configure `ip ospf mtu-ignore` on both sides.\n\n- The assistant used a weak inference (not Full) and ignored the state and MTU evidence.\n- Which router is DR does not affect whether an adjacency can reach Full.\n- An area mismatch would prevent the neighbor from appearing at all.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-047',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which two statements about R3 are true? (Choose two.)',
    exhibit: `R3# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Lo0          1     0               3.3.3.3/32         1     LOOP  0/0
Gi0/0/0      1     0               10.50.0.3/24       1     DROTH 2/3
Gi0/0/1      1     0               10.0.34.3/30       1     P2P   1/1`,
    options: [
      'R3 has three OSPF neighbors on Gi0/0/0 and is fully adjacent with two of them, the DR and the BDR.',
      'R3 remains in the 2-Way state with one other DROTHER on Gi0/0/0.',
      'R3 is failing to form a full adjacency with one neighbor on Gi0/0/0 because of a parameter mismatch.',
      'R3 is the DR on Gi0/0/1 because it has one fully adjacent neighbor.',
      'Lo0 shows no neighbors because it was configured as a passive interface.',
    ],
    answer: [0, 1],
    explanation: "`Nbrs F/C 2/3` means 2 Full adjacencies out of 3 neighbors. As a DROTHER (`DROTH`), R3 goes Full with the DR and BDR and stays 2-Way with the remaining DROTHER, which is expected.\n\n- 2-Way between DROTHERs is normal, not a mismatch.\n- `P2P` means the point-to-point network type: no DR exists on Gi0/0/1.\n- Loopbacks never form neighbors (OSPF advertises them as host routes); `LOOP` says nothing about passive configuration.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-048',
    topic: '3.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each OSPF command to its effect.',
    pairs: [
      ['ip ospf priority 0', 'The interface can never be elected DR or BDR'],
      ['ip ospf network point-to-point', 'Removes the DR/BDR election on an Ethernet link between two routers'],
      ['passive-interface GigabitEthernet0/0/2', 'Advertises the subnet but sends no hellos on that interface'],
      ['ip ospf mtu-ignore', 'Skips the MTU check during the database description exchange'],
      ['auto-cost reference-bandwidth 10000', 'Lets OSPF give 1 Gbps and 10 Gbps links different costs'],
      ['default-information originate', 'Injects the local default route into OSPF as an external route'],
    ],
    explanation: "Priority 0 removes DR/BDR eligibility. The point-to-point network type skips the election entirely. A passive interface is advertised but silent. `mtu-ignore` works around ExStart/Exchange stalls caused by MTU mismatches. Raising the reference bandwidth to 10,000 Mbps gives 1 Gbps a cost of 10 and 10 Gbps a cost of 1 (both are 1 at the default reference). `default-information originate` advertises a default route (as `O*E2`) when the router has one.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-049',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R1 and R2 share one Ethernet segment but are not OSPF neighbors. How should the engineer judge the AI assistant\'s recommendation?',
    exhibit: `R1# show ip ospf interface GigabitEthernet0/0/1 | include Internet|Process
  Internet Address 10.0.12.1/24, Area 0, Attached via Network Statement
  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1

R2# show ip ospf interface GigabitEthernet0/0/0 | include Internet|Process
  Internet Address 10.0.12.2/25, Area 0, Attached via Network Statement
  Process ID 10, Router ID 2.2.2.2, Network Type BROADCAST, Cost: 1

--- AI network assistant analysis ---
Root cause: OSPF process ID mismatch (R1 uses 1, R2 uses 10).
Routers in different OSPF processes cannot become neighbors.
Recommended fix (R2):
  no router ospf 10
  router ospf 1
   network 10.0.12.0 0.0.0.255 area 0`,
    options: [
      'Correct: process IDs must match for an adjacency to form.',
      'Wrong: the process ID is locally significant. The real problem is the subnet mask mismatch (/24 on R1, /25 on R2) on a broadcast network; correct the mask on R2.',
      'Wrong: the routers need router IDs in the same subnet as the link.',
      'Wrong: the routers need ip ospf network point-to-point because only two routers share the segment.',
    ],
    answer: [1],
    explanation: "OSPF process IDs never appear in OSPF packets, so 1 and 10 can neighbor. The exhibit shows the real fault: R1 uses a /24 and R2 a /25 on the same broadcast segment. The network mask is carried in the hello and must match on broadcast networks, so the hellos are rejected. Set R2 to 255.255.255.0. The assistant's fix would also tear down R2's entire OSPF configuration for nothing.\n\n- Router IDs are identifiers, not addresses; they need not be in any subnet.\n- Changing the network type to point-to-point would make IOS skip the mask check and could bring the adjacency up, but it hides the inconsistent addressing instead of correcting it.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-050',
    topic: '3.3',
    type: 'fill',
    difficulty: 1,
    stem: 'Enter the interface configuration command that prevents a router from ever becoming the OSPFv2 DR or BDR on that interface.',
    answer: ['ip ospf priority 0'],
    explanation: '`ip ospf priority 0` makes the interface ineligible for DR/BDR. Priority ranges from 0 to 255, default 1; the highest priority (then the highest RID) wins the election.',
    lesson: '3.3-ospf-config',
  },

  // ───────────────────────── 3.4 FHRP ─────────────────────────
  {
    id: 'd3-051',
    topic: '3.4',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. DSW1 uses 10.10.10.2 in VLAN 10 and 10.10.20.2 in VLAN 20. Which statement is correct?',
    exhibit: `DSW1# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vl10        10   90    Standby 10.10.10.3      local           10.10.10.1
Vl20        20   110 P Active  local           10.10.20.3      10.10.20.1`,
    options: [
      'DSW1 forwards traffic that VLAN 20 hosts send to 10.10.20.1, and the device at 10.10.10.3 forwards traffic for VLAN 10 hosts',
      'DSW1 forwards traffic for both VLANs because it has the highest priority in VLAN 20',
      'VLAN 10 hosts should be configured with 10.10.10.3 as their default gateway',
      'VLAN 10 is misconfigured because DSW1 has no P flag for group 10',
    ],
    answer: [0],
    explanation: "Read each row from DSW1's point of view. In group 20 DSW1 is **Active** (`local`) for 10.10.20.1. In group 10 DSW1 is **Standby** and the active router is 10.10.10.3. Splitting active roles across VLANs is a normal way to use both distribution switches.\n\n- Priority is per group; 110 in group 20 says nothing about group 10.\n- Hosts must use the **virtual IP** (10.10.10.1), never a physical router address, or they lose redundancy.\n- Preemption is optional; without it DSW1 simply will not reclaim a role, which is irrelevant here because DSW1 is not meant to be active in VLAN 10.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-052',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement is correct?',
    exhibit: `DSW2# show standby Vlan20
Vlan20 - Group 20 (version 2)
  State is Standby
    4 state changes, last state change 01:02:44
  Virtual IP address is 10.10.20.1
  Active virtual MAC address is 0000.0c9f.f014 (MAC Not In Use)
    Local virtual MAC address is 0000.0c9f.f014 (v2 default)
  Hello time 3 sec, hold time 10 sec
    Next hello sent in 0.912 secs
  Preemption disabled
  Active router is 10.10.20.2, priority 110 (expires in 8.416 sec)
  Standby router is local
  Priority 100 (default 100)
  Group name is "hsrp-Vl20-20" (default)`,
    options: [
      'The group runs HSRPv2 (group 20 = 0x014 in the MAC), hellos go to 224.0.0.102, and DSW2 becomes active if it hears no hello from 10.10.20.2 for 10 seconds',
      'The group runs HSRPv1 because the group number is below 256, and hellos go to 224.0.0.2',
      'DSW2 will become active as soon as its priority is raised to 120',
      'When hosts ARP for 10.10.20.1, DSW2 replies with its burned-in MAC address',
    ],
    answer: [0],
    explanation: "`(version 2)` and the `0000.0c9f.fXXX` MAC format identify **HSRPv2**; 0x014 = 20 is the group. HSRPv2 hellos go to 224.0.0.102 (UDP 1985). With a 10-second hold time, the standby takes over if the active router's hellos stop for 10 seconds.\n\n- Version is configured (`standby version 2`), not derived from the group number; v2 supports groups 0-4095, including low numbers.\n- `Preemption disabled` on DSW2 means a higher priority alone would not let it take over from a working active router.\n- ARP replies for the virtual IP always carry the **virtual MAC**, and only the active router sends them.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-053',
    topic: '3.4',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FHRP item to its value.',
    pairs: [
      ['HSRPv1 hello destination', '224.0.0.2'],
      ['HSRPv2 hello destination', '224.0.0.102'],
      ['VRRP advertisement destination', '224.0.0.18'],
      ['HSRPv1 virtual MAC format', '0000.0c07.acXX'],
      ['HSRPv2 virtual MAC format', '0000.0c9f.fXXX'],
      ['VRRP virtual MAC format', '0000.5e00.01XX'],
    ],
    explanation: "HSRPv1 uses 224.0.0.2 and `0000.0c07.acXX` (2 hex digits, groups 0-255). HSRPv2 uses 224.0.0.102 and `0000.0c9f.fXXX` (3 hex digits, groups 0-4095); both HSRP versions use UDP 1985. VRRP uses 224.0.0.18 (IP protocol 112) and the IANA range `0000.5e00.01XX`, where XX is the VRID in hex. (GLBP also sends to 224.0.0.102, but on UDP 3222.)",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-054',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The design says DSW1 should be the active gateway for VLAN 30 whenever it is up. How should the engineer judge the AI assistant\'s recommendation?',
    exhibit: `DSW1# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vl30        30   150   Standby 10.30.0.3       local           10.30.0.1

DSW2# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vl30        30   100 P Active  local           10.30.0.2       10.30.0.1

--- AI network assistant recommendation ---
Finding: DSW1's priority (150) is not high enough to win the election.
Fix (DSW1):
  interface Vlan30
   standby 30 priority 255`,
    options: [
      'Correct: 255 is the highest HSRP priority, so DSW1 will become active.',
      'Wrong: DSW1 already has the higher priority but has no preempt configured, so it cannot take the active role from DSW2. Configure standby 30 preempt on DSW1.',
      'Wrong: remove preemption from DSW2, which is what keeps DSW2 active.',
      'Wrong: lower DSW2\'s priority to 50; that alone will make DSW1 active.',
    ],
    answer: [1],
    explanation: "DSW1 (150) already outranks DSW2 (100), yet it is Standby and has no `P` flag. HSRP preemption is **off by default**, so a higher-priority router that comes up after another router became active stays standby. `standby 30 preempt` on DSW1 lets it take over (and take it back after future failures).\n\n- Raising priority further changes nothing without preempt.\n- DSW2's preempt only matters if DSW2 had the higher priority; removing it does not make DSW1 active.\n- Lowering DSW2's priority also does nothing while DSW1 cannot preempt.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-055',
    topic: '3.4',
    type: 'order',
    difficulty: 2,
    stem: 'Order the HSRP states in the sequence a router passes through on its way to becoming the active router.',
    items: ['Initial', 'Learn', 'Listen', 'Speak', 'Standby', 'Active'],
    explanation: "**Initial** (HSRP starting) -> **Learn** (virtual IP not yet known, no hello from the active router heard) -> **Listen** (virtual IP known; neither active nor standby) -> **Speak** (sending hellos, taking part in the election) -> **Standby** (next in line) -> **Active** (forwarding for the virtual IP/MAC). A third router in a group normally rests in Listen.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-056',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 Gi0/0/0 is 192.168.5.1/24 and R2 Gi0/0/0 is 192.168.5.2/24. Which statement is correct?',
    exhibit: `R1# show vrrp brief
Interface          Grp Pri Time  Own Pre State   Master addr     Group addr
Gi0/0/0            5   255 3003   Y   Y  Master  192.168.5.1     192.168.5.1

R2# show vrrp brief
Interface          Grp Pri Time  Own Pre State   Master addr     Group addr
Gi0/0/0            5   100 3609       Y  Backup  192.168.5.1     192.168.5.1`,
    options: [
      'R1 owns the virtual IP (it is R1\'s real address), so its priority is 255; if R1 fails, R2 becomes master, and R1 takes the master role back when it recovers',
      'R2 can never become master because R1 has priority 255',
      'When R1 recovers from a failure, R2 stays master because VRRP preemption is disabled by default',
      'Hosts reach the gateway at virtual MAC 0000.0c07.ac05',
    ],
    answer: [0],
    explanation: "The group address 192.168.5.1 equals R1's interface address, so R1 is the **address owner** (`Own Y`): priority 255, always master when up, always preempts. R2 (default 100, preempt shown as `Y`) becomes master if R1's advertisements stop for the master-down interval (about 3.6 s, the `Time` column in ms).\n\n- 255 means R1 wins whenever it is alive; it does not stop R2 from taking over when R1 is down.\n- VRRP preemption is **enabled** by default (unlike HSRP), and owners always preempt.\n- `0000.0c07.acXX` is HSRPv1; VRRP group 5 uses `0000.5e00.0105`.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-057',
    topic: '3.4',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements correctly compare VRRP with HSRP? (Choose two.)',
    options: [
      'VRRP is an IETF open standard, while HSRP is Cisco proprietary.',
      'VRRP enables preemption by default, while HSRP does not.',
      'VRRP sends advertisements to 224.0.0.102, while HSRPv1 uses 224.0.0.18.',
      'VRRP uses a default priority of 110, while HSRP uses 100.',
      'VRRP load-balances hosts across several forwarding routers in a single group by using an AVG.',
      'VRRP calls its forwarding router the Active router and its backup the Standby router.',
    ],
    answer: [0, 1],
    explanation: "VRRP is standardized by the IETF (VRRPv3 is RFC 5798) and preempts by default; HSRP is Cisco's protocol and has preemption off unless `standby <group> preempt` is configured.\n\n- The addresses are swapped: VRRP uses 224.0.0.18; HSRPv1 uses 224.0.0.2 (and HSRPv2 224.0.0.102).\n- Both default to priority 100.\n- AVG/AVF load balancing within one group is **GLBP**.\n- VRRP's roles are Master and Backup; Active/Standby are HSRP terms.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-058',
    topic: '3.4',
    type: 'fill',
    difficulty: 2,
    stem: 'What virtual MAC address does HSRP version 1 use for group 25? Enter it in Cisco dotted format (xxxx.xxxx.xxxx).',
    answer: ['0000.0c07.ac19', '00:00:0c:07:ac:19', '00-00-0c-07-ac-19'],
    explanation: 'HSRPv1 virtual MACs are `0000.0c07.acXX`, where XX is the group number in hex. 25 decimal = 0x19, so the MAC is **0000.0c07.ac19**. (HSRPv2 group 25 would be 0000.0c9f.f019.)',
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-059',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Three distribution switches participate in HSRP group 40. Which statement describes DSW3?',
    exhibit: `DSW3# show standby Vlan40
Vlan40 - Group 40
  State is Listen
    2 state changes, last state change 00:15:09
  Virtual IP address is 10.40.0.1
  Active virtual MAC address is 0000.0c07.ac28 (MAC Not In Use)
    Local virtual MAC address is 0000.0c07.ac28 (v1 default)
  Hello time 3 sec, hold time 10 sec
  Preemption disabled
  Active router is 10.40.0.2, priority 120 (expires in 9.104 sec)
  Standby router is 10.40.0.3, priority 110 (expires in 8.880 sec)
  Priority 100 (default 100)
  Group name is "hsrp-Vl40-40" (default)`,
    options: [
      'DSW3 knows the virtual IP and hears both the active and standby routers; it is neither, and would compete for the standby role if the current standby router failed',
      'DSW3 cannot hear hellos from the other routers, so it is stuck in Listen',
      'DSW3 forwards a share of the traffic sent to 10.40.0.1',
      'DSW3 has no virtual IP configured and is waiting to learn it from the active router',
    ],
    answer: [0],
    explanation: "In a three-router group, one router is Active, one Standby, and the rest sit in **Listen**: they know the virtual IP and monitor hellos but do not forward. If the standby disappears (or becomes active), DSW3 moves through Speak to compete for standby.\n\n- DSW3 clearly hears both peers: it lists their addresses, priorities and hold-timer countdowns.\n- Only the active router forwards for the virtual MAC; HSRP does not load-share within a group.\n- A router without the virtual IP that has not heard the active router would be in **Learn**; DSW3 already shows the virtual IP.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-060',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. DSW1 and DSW2 are connected by a working trunk that carries VLAN 60, yet both report Active for group 60. What is the cause?',
    exhibit: `DSW1# show standby Vlan60 | include Group|State is|virtual MAC|Standby router
Vlan60 - Group 60 (version 2)
  State is Active
  Active virtual MAC address is 0000.0c9f.f03c (MAC In Use)
    Local virtual MAC address is 0000.0c9f.f03c (v2 default)
  Standby router is unknown
  Group name is "hsrp-Vl60-60" (default)

DSW2# show standby Vlan60 | include Group|State is|virtual MAC|Standby router
Vlan60 - Group 60
  State is Active
  Active virtual MAC address is 0000.0c07.ac3c (MAC In Use)
    Local virtual MAC address is 0000.0c07.ac3c (v1 default)
  Standby router is unknown
  Group name is "hsrp-Vl60-60" (default)`,
    options: [
      'DSW1 runs HSRPv2 and DSW2 runs HSRPv1, so neither hears the other\'s hellos; configure standby version 2 on DSW2',
      'Both switches have preemption enabled, which lets both claim the active role',
      'The two switches are configured with different HSRP group numbers',
      'DSW2 must be given a higher priority than DSW1 so that one of them can win the election',
    ],
    answer: [0],
    explanation: "DSW1 shows `(version 2)` and a `0000.0c9f.f03c` MAC; DSW2 shows no version tag and a `0000.0c07.ac3c` MAC (`v1 default`). HSRPv1 hellos go to 224.0.0.2 and v2 hellos to 224.0.0.102 in a different format, so the switches never hear each other: `Standby router is unknown` on both, and each declares itself Active (a split-brain where hosts see two MACs for one gateway). Configure the same version on both.\n\n- Preemption decides who takes over between routers that *can* hear each other; it cannot make two routers active.\n- Both outputs show group 60 (0x3c in both MACs).\n- Priority is meaningless when hellos are not exchanged.",
    lesson: '3.4-fhrp',
  },

  // ═════════════════════ Expansion set d3-061..095 ═════════════════════
  // 3.1 = d3-061..069, 3.2 = d3-070..077, 3.3 = d3-078..089, 3.4 = d3-090..095

  // ───────────────────────── 3.1 Interpret the routing table ─────────────────────────
  {
    id: 'd3-061',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R5 receives a packet destined for 172.16.52.100. Which next hop does R5 use?',
    exhibit: TABLE_D,
    options: [
      '172.16.0.2, using 172.16.52.64/27',
      '172.16.0.6, using 172.16.48.0/21',
      '172.16.0.2, using 172.16.32.0/19',
      'None; the Null0 route 172.16.0.0/16 discards it',
    ],
    answer: [1],
    explanation: "Check each candidate from longest to shortest. A /27 has a block size of 32 in the last octet, so 172.16.52.64/27 covers only .64-.95; .100 is outside it. A /21 has a block size of 8 in the third octet, so 172.16.48.0/21 covers 172.16.48.0-172.16.55.255, which includes 172.16.52.100. That is the longest match, so R5 forwards to **172.16.0.6** out Gi0/0/2.\n\n- The /27 is the trap: the third octet matches, but .100 is past the end of the block.\n- 172.16.32.0/19 (172.16.32-63) does match, but /19 is shorter than /21.\n- The Null0 /16 also matches, but it is used only when nothing longer matches.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-062',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Refer to the exhibit. R5 receives a packet destined for 172.16.52.80. Enter the IPv4 address of the next hop that R5 uses.',
    exhibit: TABLE_D,
    answer: ['172.16.0.2'],
    explanation: "172.16.52.80 falls inside 172.16.52.64/27 (.64-.95), and also inside 172.16.48.0/21, 172.16.32.0/19, 172.16.0.0/16 and the default. The /27 is the longest match, so the next hop is **172.16.0.2**. The static host route 172.16.52.77/32 points to 172.16.0.6, but it matches only the single address .77, not .80.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-063',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R5 receives a packet destined for 172.16.70.5. What does R5 do with it?',
    exhibit: TABLE_D,
    options: [
      'Forwards it to 192.0.2.1, because no OSPF route covers the address and the default route applies',
      'Discards it, because the longest matching route is the static 172.16.0.0/16 to Null0',
      'Forwards it to 172.16.0.2, because the OSPF route 172.16.32.0/19 includes the address',
      'Forwards it to 172.16.0.6, because the O IA route 172.16.48.0/21 includes the address',
    ],
    answer: [1],
    explanation: "Only two routes contain 172.16.70.5: the static **172.16.0.0/16 to Null0** and the default 0.0.0.0/0. The /16 is longer, so the packet is sent to Null0 and **discarded** (IOS can return an ICMP unreachable). This is a deliberate *discard route*: it keeps traffic for unused parts of the company's 172.16.0.0/16 block from leaking out the default route, while every more specific route inside the block still wins by longest match.\n\n- The default route would be used only if the Null0 /16 did not exist.\n- 172.16.32.0/19 covers third-octet values 32-63; 70 is outside it.\n- 172.16.48.0/21 covers 48-55 only.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-064',
    topic: '3.1',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. R5 receives packets for the destinations listed below. Which two of them does R5 forward to 192.0.2.1 by using the default route? (Choose two.)',
    exhibit: TABLE_D,
    options: [
      '172.16.64.1',
      '172.17.0.1',
      '172.16.0.6',
      '192.0.2.9',
      '172.16.55.200',
      '172.16.31.255',
    ],
    answer: [1, 3],
    explanation: "Only destinations that match **nothing except 0.0.0.0/0** use the default route.\n\n- **172.17.0.1** is outside 172.16.0.0/16, and no other route covers it.\n- **192.0.2.9** is outside the connected 192.0.2.0/29 (.0-.7). The line `192.0.2.0/24 is variably subnetted` is only a grouping header, not a route, so the default applies.\n- 172.16.64.1 and 172.16.31.255 sit just outside 172.16.32.0/19 (32-63), so their longest match is the Null0 /16 and they are discarded.\n- 172.16.0.6 is inside the connected 172.16.0.4/30 and is delivered directly out Gi0/0/2.\n- 172.16.55.200 is inside 172.16.48.0/21 (48-55) and goes to 172.16.0.6.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-065',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R6 must forward a packet to 2001:DB8:CAFE:1B7::10. Which next hop does it use?',
    exhibit: TABLE_E,
    options: [
      'FE80::3 out GigabitEthernet0/0/0, using 2001:DB8:CAFE:100::/56',
      '2001:DB8:0:20::9, using 2001:DB8:CAFE:1A0::/60',
      'FE80::2 out GigabitEthernet0/0/1, using 2001:DB8:CAFE::/48, which has the lowest metric',
      'FE80::1 out GigabitEthernet0/0/0, using the default route',
    ],
    answer: [0],
    explanation: "Work in the fourth hextet, which is **01B7** for this destination. A /56 fixes the first 8 bits of that hextet (`01`), so 2001:DB8:CAFE:100::/56 covers 0100-01FF and matches. A /60 fixes the first 12 bits (`01A`), so 2001:DB8:CAFE:1A0::/60 covers only 01A0-01AF and does not match. The /56 is the longest match: **FE80::3 out Gi0/0/0**.\n\n- The /60 is the trap: 1B7 shares the leading `01` but not `01A`.\n- The /48 matches, but metric is compared only between paths to the *same* prefix; a /48 never beats a /56.\n- The default route is the least specific match.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-066',
    topic: '3.1',
    type: 'fill',
    difficulty: 3,
    stem: 'Refer to the exhibit. R6 forwards a packet destined for 2001:DB8:CAFE:1AC::1. What is the prefix length of the route it uses? Enter it in the form /nn.',
    exhibit: TABLE_E,
    answer: ['/60', '60'],
    explanation: "The fourth hextet is **01AC**, inside 01A0-01AF, so the static **2001:DB8:CAFE:1A0::/60** matches. The /56 (0100-01FF), the /48 and ::/0 also match, but /60 is the longest. The packet goes to 2001:DB8:0:20::9, which R6 resolves through its connected 2001:DB8:0:20::/64 on Gi0/0/1. The static route's AD of 1 plays no part, because the competing routes are different prefixes.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-067',
    topic: '3.1',
    type: 'match',
    difficulty: 1,
    stem: 'Refer to the exhibit. Match each field of the route entry to its meaning.',
    exhibit: `R5# show ip route | include 172.16.48.0
O IA     172.16.48.0/21 [110/3] via 172.16.0.6, 00:08:14, GigabitEthernet0/0/2`,
    pairs: [
      ['O IA', 'OSPF route to a prefix in another area, learned through an ABR'],
      ['/21', 'Prefix length used in the longest-match comparison'],
      ['110', 'Administrative distance of the route source'],
      ['3', 'Total OSPF cost from R5 to the destination'],
      ['172.16.0.6', 'Address of the next-hop router'],
      ['00:08:14', 'Time since the route was learned or last changed'],
    ],
    explanation: "`O IA` is an OSPF inter-area route. `/21` is the prefix length. Inside the brackets, the first number is the **administrative distance** (110 for OSPF) and the second is the **metric** (the cumulative OSPF cost, 3). `via 172.16.0.6` is the next-hop address, `00:08:14` is the route's age, and the final field is the outgoing interface.",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-068',
    topic: '3.1',
    type: 'order',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 receives a packet destined for 10.50.4.4. Order the steps R1 takes to forward it, from first to last.',
    exhibit: `R1# show ip route | include 10.50|10.0.12
S        10.50.0.0/16 [1/0] via 10.0.12.2
C        10.0.12.0/24 is directly connected, GigabitEthernet0/0/1
L        10.0.12.1/32 is directly connected, GigabitEthernet0/0/1`,
    items: [
      'Find the longest match for 10.50.4.4: the static route 10.50.0.0/16 via 10.0.12.2',
      'Look up the next hop 10.0.12.2, which falls in the connected subnet on GigabitEthernet0/0/1',
      'Get the MAC address of 10.0.12.2 from the ARP cache, sending an ARP request if it is missing',
      'Build a new Ethernet frame addressed to that MAC and send it out GigabitEthernet0/0/1',
    ],
    explanation: "The destination lookup comes first and yields only a next-hop IP. Because that next hop is not an interface, the router does a **recursive lookup** to find which connected subnet (and therefore which exit interface) contains it. Only then can it resolve the next hop's **MAC address** with ARP, and finally rewrite the Layer 2 header and transmit. The destination IP in the packet never changes; only the frame does. (CEF precomputes these results into its FIB and adjacency table, but the logical order is the same.)",
    lesson: '3.1-routing-table',
  },
  {
    id: 'd3-069',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Users behind R1 report they cannot reach a partner server at 198.51.100.77. An AI assistant analyzed two outputs. How should the engineer judge its analysis?',
    exhibit: `R1# show ip route | include Gateway
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

R1# show ip route 198.51.100.77
% Network not in table

--- AI network assistant ---
Analysis: R1 has no route that matches 198.51.100.77 ("Network not in
table"), so R1 drops this traffic and returns ICMP unreachable.
Recommended fix:
  R1(config)# ip route 198.51.100.0 255.255.255.0 203.0.113.1`,
    options: [
      'Correct: "Network not in table" proves that R1 has no usable route to the server, so the recommended static route is required.',
      'Wrong: show ip route <address> ignores the default route; R1 forwards this traffic to 203.0.113.1, so the fault lies elsewhere.',
      'Wrong: R1 floods packets for unknown destinations out every interface, so the traffic still arrives at the partner server anyway.',
      'Partly wrong: R1 does drop the traffic, but the fix should be a new default route through 203.0.113.1 rather than a /24 route.',
    ],
    answer: [1],
    explanation: "`show ip route <address>` searches for a specific entry and does **not** fall back to the default route, so it prints `% Network not in table` even though forwarding would use 0.0.0.0/0. The gateway of last resort is set, so R1 forwards the traffic to **203.0.113.1**. `show ip cef 198.51.100.77` shows the entry actually used (0.0.0.0/0 via 203.0.113.1). The assistant's static route would change nothing, because it uses the same next hop, so the engineer should look further along the path (for example with traceroute).\n\n- The \"not in table\" message is the trap; it is not proof of a drop.\n- Routers never flood unicast packets.\n- R1 already has a default route; adding another one changes nothing.",
    lesson: '3.1-routing-table',
  },

  // ───────────────────────── 3.2 Static routing ─────────────────────────
  {
    id: 'd3-070',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. PC1 (10.1.1.50) sits on R1\'s LAN. Network 10.77.0.0/16 is behind R3, which connects to R2 at 10.0.23.3 and already has a route back to 10.1.1.0/24. R1 connects only to R2. Which change fixes the problem?',
    exhibit: `C:\\> tracert -d 10.77.7.7

Tracing route to 10.77.7.7 over a maximum of 30 hops

  1    <1 ms    <1 ms    <1 ms  10.1.1.1
  2     1 ms     1 ms     1 ms  10.0.12.2
  3     1 ms     1 ms     1 ms  10.0.12.1
  4     2 ms     1 ms     1 ms  10.0.12.2
  5     2 ms     2 ms     2 ms  10.0.12.1
  6     2 ms     2 ms     2 ms  10.0.12.2
^C

R1# show ip route static | begin Gateway
Gateway of last resort is 10.0.12.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 10.0.12.2

R2# show ip route static | begin Gateway
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 5 subnets, 3 masks
S        10.0.0.0/8 [1/0] via 10.0.12.1`,
    options: [
      'On R2: ip route 10.77.0.0 255.255.0.0 10.0.23.3',
      'On R1: ip route 10.77.0.0 255.255.0.0 10.0.12.2',
      'On R2: replace the 10.0.0.0/8 route with ip route 10.0.0.0 255.0.0.0 10.0.23.3',
      'On R1: ip route 10.77.0.0 255.255.0.0 10.0.23.3',
    ],
    answer: [0],
    explanation: "The traceroute bounces between 10.0.12.2 (R2) and 10.0.12.1 (R1): a **routing loop**. R1 sends 10.77.7.7 to R2 by its default route. On R2, the longest match for 10.77.7.7 is the static 10.0.0.0/8 *back to R1*, which beats R2's default. The packet ping-pongs until its TTL expires. A more specific route on R2, **10.77.0.0/16 via 10.0.23.3**, wins by longest match and breaks the loop.\n\n- R1 already sends the traffic to R2; another route on R1 pointing to R2 changes nothing on R2.\n- Pointing R2's whole 10.0.0.0/8 at R3 would break R2's path back to R1's LAN (10.1.1.0/24).\n- 10.0.23.3 is not on any R1 subnet. R1 would still hand the packet to R2, and R2 would still return it.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-071',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The circuit on GigabitEthernet0/0/1 has just failed. Which entry for 10.80.0.0/16 does R1 now have in its routing table?',
    exhibit: `R1# show running-config | include ip route
ip route 10.80.0.0 255.255.0.0 GigabitEthernet0/0/1 10.0.12.2
ip route 10.80.0.0 255.255.0.0 10.0.13.3 5

R1# show ip interface brief | include 0/0/[12]
GigabitEthernet0/0/1   10.0.12.1       YES manual down                  down
GigabitEthernet0/0/2   10.0.13.1       YES manual up                    up`,
    options: [
      'S 10.80.0.0/16 [1/0] via 10.0.12.2, GigabitEthernet0/0/1',
      'S 10.80.0.0/16 [5/0] via 10.0.13.3',
      'S 10.80.0.0/16 [1/0] via 10.0.13.3',
      'No entry, because a floating static route can back up only a dynamically learned route',
    ],
    answer: [1],
    explanation: "The primary route is **fully specified** (exit interface plus next hop). A static route whose exit interface goes down is removed from the routing table. The second route has AD 5, so it was floating behind the AD-1 primary; with the primary gone, it is installed and displayed with its configured distance: **`[5/0] via 10.0.13.3`** (10.0.13.3 resolves through the up/up Gi0/0/2).\n\n- The fully specified route cannot stay installed while Gi0/0/1 is down.\n- The table shows the configured AD (5), not 1.\n- A floating static can back up any route with a lower AD, including another static route.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-072',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'R2 (10.0.12.2) hosts four LANs: 172.16.4.0/24, 172.16.5.0/24, 172.16.6.0/24 and 172.16.7.0/24. R1 must reach all four through R2 using one static route that covers no other addresses. Which command should be entered on R1?',
    options: [
      'ip route 172.16.0.0 255.255.248.0 10.0.12.2',
      'ip route 172.16.4.0 255.255.254.0 10.0.12.2',
      'ip route 172.16.4.0 255.255.252.0 10.0.12.2',
      'ip route 172.16.4.0 0.0.3.255 10.0.12.2',
      'ip route 172.16.4.0 255.255.248.0 10.0.12.2',
    ],
    answer: [2],
    explanation: "Third-octet values 4-7 form a block of four that starts on a multiple of four, so they summarize exactly to **172.16.4.0/22** (mask 255.255.252.0).\n\n- 172.16.0.0/21 covers 0-7, which adds four subnets that are not on R2.\n- 255.255.254.0 (/23) covers only 4-5.\n- `ip route` takes a subnet mask, not a wildcard mask.\n- 172.16.4.0 is not a valid network address for a /21 (the /21 block starts at 172.16.0.0), so IOS rejects that command with an inconsistent address and mask error.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-073',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. How should the engineer judge the AI assistant's output?",
    exhibit: `R4# show ipv6 route ospf | begin ::/0
OE2 ::/0 [110/1]
     via FE80::1, GigabitEthernet0/0/0

Prompt:
  R4 learns its IPv6 default route from OSPFv3. Add a backup IPv6
  default route through the LTE router, whose link-local address on
  R4's GigabitEthernet0/0/2 link is FE80::99. Use it ONLY if the
  OSPFv3 default disappears.

AI assistant output:
  R4(config)# ipv6 route ::/0 GigabitEthernet0/0/2 FE80::99 200
  "AD 200 keeps this route out of the table while the OSPFv3 default
  (AD 110) exists. The interface is required because FE80::99 is a
  link-local address."`,
    options: [
      'Reject it: IPv6 static routes do not accept a distance value, so this route would replace the OSPFv3 default.',
      'Accept it: AD 200 floats the route above OSPFv3, and the link-local next hop is correctly paired with its interface.',
      'Reject it: a static route cannot use a link-local next hop; use the LTE router\'s global address with no interface.',
      'Reject it: the AD must be lower than 110, or the backup will never be installed when the OSPFv3 default disappears.',
    ],
    answer: [1],
    explanation: "The assistant is right. `ipv6 route` accepts an administrative distance as its last argument, just like `ip route`. AD 200 is higher than OSPFv3's 110, so this is a **floating static default**: configured, but installed only when the `OE2 ::/0` route disappears. Because FE80::99 is link-local, IOS requires the exit interface, and Gi0/0/2 is R4's interface on that link.\n\n- IPv6 static routes do support a distance.\n- Link-local next hops are valid (and common) as long as the interface is given.\n- An AD below 110 would make the LTE path preferred immediately, which is the opposite of a backup.",
    lesson: '3.2-static-ipv6',
  },
  {
    id: 'd3-074',
    topic: '3.2',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `R1# show running-config | include ip route
ip route 0.0.0.0 0.0.0.0 203.0.113.1
ip route 0.0.0.0 0.0.0.0 198.51.100.1 10
ip route 10.40.0.0 255.255.0.0 GigabitEthernet0/0/3 10.0.14.4
ip route 10.40.7.0 255.255.255.0 10.0.12.2

R1# show ip interface brief | include GigabitEthernet
GigabitEthernet0/0/0   203.0.113.2     YES manual up                    up
GigabitEthernet0/0/1   10.0.12.1       YES manual up                    up
GigabitEthernet0/0/2   198.51.100.2    YES manual up                    up
GigabitEthernet0/0/3   10.0.14.1       YES manual administratively down down

R1# show ip route static | begin Gateway
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
      10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks
S        10.40.7.0/24 [1/0] via 10.0.12.2`,
    options: [
      'Packets to 10.40.9.1 are forwarded to 10.0.12.2.',
      'The default route via 198.51.100.1 is a floating static route and is not installed while the route via 203.0.113.1 exists.',
      'R1 load-shares default-routed traffic between 203.0.113.1 and 198.51.100.1.',
      'The route to 10.40.0.0/16 is not installed because its exit interface, GigabitEthernet0/0/3, is down.',
      'Packets to 10.40.9.1 are dropped because the route to 10.40.0.0/16 is not available.',
      'Packets to 10.40.7.20 are forwarded to 203.0.113.1 because the default route has the same AD as the /24.',
    ],
    answer: [1, 3],
    explanation: "The AD-10 default is a **floating** backup: only the AD-1 default via 203.0.113.1 is installed. The 10.40.0.0/16 route names Gi0/0/3 as its exit interface, and Gi0/0/3 is administratively down, so that route is **withdrawn** from the table (the header's 3 subnets, 2 masks are Gi0/0/1's connected 10.0.12.0/24, its local /32 and the static /24).\n\n- 10.40.9.1 is outside 10.40.7.0/24, so it does not go to 10.0.12.2.\n- It is not dropped either: with the /16 gone, the default route sends it to 203.0.113.1.\n- Routes with different ADs never load-share; only the lowest-AD default is installed.\n- 10.40.7.20 uses the /24 by longest match; AD never decides between a /24 and a /0.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-075',
    topic: '3.2',
    type: 'fill',
    difficulty: 2,
    stem: 'Enter the global configuration command that creates an IPv6 static host route to 2001:DB8:9::9 with next hop 2001:DB8:0:12::2 (default AD).',
    answer: [
      'ipv6 route 2001:db8:9::9/128 2001:db8:0:12::2',
      'ipv6 route 2001:db8:9:0:0:0:0:9/128 2001:db8:0:12::2',
      'ipv6 route 2001:db8:9::9/128 2001:db8:0:12:0:0:0:2',
      'ipv6 route 2001:db8:9:0:0:0:0:9/128 2001:db8:0:12:0:0:0:2',
      'ipv6 route 2001:0db8:0009:0000:0000:0000:0000:0009/128 2001:0db8:0000:0012:0000:0000:0000:0002',
    ],
    explanation: "An IPv6 host route uses the full 128-bit prefix length: `ipv6 route 2001:DB8:9::9/128 2001:DB8:0:12::2`. It is the IPv6 equivalent of an IPv4 /32 (mask 255.255.255.255) and wins by longest match over any shorter route that also contains the address.",
    lesson: '3.2-static-ipv6',
  },
  {
    id: 'd3-076',
    topic: '3.2',
    type: 'match',
    difficulty: 2,
    stem: 'Match each static-routing symptom to its most likely explanation.',
    pairs: [
      ['The route is in the running-config but not the routing table, and show ip route <next hop> returns "not in table"', 'The recursive lookup for the next hop fails'],
      ['The route is installed, but show ip arp lists the next-hop address as Incomplete', 'No device on the segment owns the configured next-hop address'],
      ['Traceroute alternates between the same two router addresses until it is stopped', 'Two routers each send the destination to the other (a routing loop)'],
      ['A capture on the remote server shows echo requests arriving and replies sent to its gateway, yet pings time out', 'The far-end router has no route back to the source subnet'],
      ['A backup static route appears in the table only after the OSPF route to the same prefix disappears', 'Expected behavior of a static route configured with an AD above 110'],
    ],
    explanation: "An uninstalled route with an unreachable next hop means the **recursive lookup** failed. An installed route with an *Incomplete* ARP entry means the next-hop IP is wrong (nobody answers ARP). Alternating hops in a traceroute are the signature of a **routing loop**. Requests arriving while replies never return point to a **missing return route** on the far side. A route that appears only when the OSPF route is lost is a **floating static** working as designed.",
    lesson: '3.2-static-ipv4',
  },
  {
    id: 'd3-077',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The 203.0.113.1 circuit is the fast primary internet link, and 198.51.100.1 is a slow backup that should carry traffic only if the primary route is lost. Users report that some sessions use the backup link. Which change meets the design?',
    exhibit: `R1# show running-config | include ip route
ip route 0.0.0.0 0.0.0.0 203.0.113.1
ip route 0.0.0.0 0.0.0.0 198.51.100.1

R1# show ip route | begin Gateway
Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
                [1/0] via 198.51.100.1
      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0/1
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0/1
      198.51.100.0/24 is variably subnetted, 2 subnets, 2 masks
C        198.51.100.0/30 is directly connected, GigabitEthernet0/0/2
L        198.51.100.2/32 is directly connected, GigabitEthernet0/0/2
      203.0.113.0/24 is variably subnetted, 2 subnets, 2 masks
C        203.0.113.0/30 is directly connected, GigabitEthernet0/0/0
L        203.0.113.2/32 is directly connected, GigabitEthernet0/0/0`,
    options: [
      'Reconfigure the second route as ip route 0.0.0.0 0.0.0.0 198.51.100.1 5',
      'Reconfigure the first route as ip route 0.0.0.0 0.0.0.0 203.0.113.1 5',
      'Reconfigure the first route as ip route 0.0.0.0 0.0.0.0 203.0.113.1 0',
      'No change; IOS sends default traffic only to the next hop on the faster interface',
    ],
    answer: [0],
    explanation: "Both defaults have AD 1, so both are installed as **equal-cost paths** (two `via` lines under one `S*` entry) and CEF shares flows across them. Raising the backup's AD (for example, remove the old line with `no ip route 0.0.0.0 0.0.0.0 198.51.100.1`, then add it with AD 5) makes it a **floating static** that is installed only if the primary route is withdrawn.\n\n- Raising the *primary's* AD makes the slow link the only installed default, which is the reverse of the design.\n- 0 is not a valid static route distance (the range is 1-255).\n- Static routes have no bandwidth-based metric; equal-AD defaults always load-share.",
    lesson: '3.2-static-ipv4',
  },

  // ───────────────────────── 3.3 OSPFv2 / OSPFv3 ─────────────────────────
  {
    id: 'd3-078',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. R1 Gi0/0/1 (10.0.12.1) and R2 Gi0/0/0 (10.0.12.2) share a link. How should the engineer judge the AI assistant's analysis?",
    exhibit: `R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   INIT/DROTHER    00:00:35    10.0.12.2       GigabitEthernet0/0/1

R2# show ip ospf neighbor
R2#

R2# show running-config interface GigabitEthernet0/0/0 | include access-group
 ip access-group EDGE-IN in

R2# show ip access-lists EDGE-IN
Extended IP access list EDGE-IN
    10 permit tcp 10.0.12.0 0.0.0.255 any eq 22 (14 matches)
    20 permit icmp any any (52 matches)

--- AI network assistant analysis ---
Root cause: R1 and R2 are in different OSPF areas, which leaves the
neighbor in INIT.
Recommended fix (R2):
  interface GigabitEthernet0/0/0
   ip ospf 1 area 0`,
    options: [
      "Correct: an area mismatch leaves the neighbor stuck in INIT, so R2's Gi0/0/0 must be moved into the same area that R1 uses.",
      "Wrong: an area mismatch would hide R2 from R1 entirely. INIT means R2 misses R1's hellos; EDGE-IN's implicit deny drops them, so permit OSPF.",
      'Wrong: INIT is the classic symptom of an IP MTU mismatch, so the MTUs must be matched or ip ospf mtu-ignore configured on both routers.',
      'Wrong: EDGE-IN is blocking the hellos that R2 itself sends, so the access group should be moved to the outbound direction on Gi0/0/0.',
    ],
    answer: [1],
    explanation: "R1 shows R2 in **INIT**: R1 accepts R2's hellos, but those hellos do not list R1's router ID, so R2 is not hearing R1. R2's inbound ACL EDGE-IN permits only SSH and ICMP; OSPF (IP protocol 89) hits the **implicit deny**, so R1's hellos to 224.0.0.5 are dropped. Add an entry such as `5 permit ospf any any` to EDGE-IN.\n\n- An area mismatch makes each router *discard* the other's hellos, so no neighbor entry appears at all, and R1 accepting R2's hellos shows the hello parameters match.\n- MTU problems appear in ExStart/Exchange, after 2-Way.\n- The ACL is inbound and is dropping R1's hellos; outbound ACLs do not filter packets the router generates itself, and R2's own hellos are already reaching R1.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-079',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R3 Gi0/0/1 (10.0.34.3) connects to R4 Gi0/0/1 (10.0.34.4). The two routers never become OSPF neighbors. What is the cause, and what fixes it?',
    exhibit: `R3#
%OSPF-4-DUP_RTRID_NBR: OSPF detected duplicate router-id 3.3.3.3 from 10.0.34.4 on interface GigabitEthernet0/0/1

R3# show ip ospf neighbor
R3#`,
    options: [
      'R4 uses the same router ID as R3; give R4 a unique router-id, then clear ip ospf process on R4',
      'R3 and R4 use the same IP address on the link; readdress R4 Gi0/0/1 to a free address in the subnet',
      'R3 and R4 use the same OSPF process ID; change the process ID on R4 to a different value',
      'R4 is in a different area; IOS reports an area mismatch with the duplicate router-id message',
    ],
    answer: [0],
    explanation: "The log says hellos arriving **from 10.0.34.4** (R4) carry router ID **3.3.3.3**, which is R3's own RID. Router IDs must be unique, so R3 refuses the adjacency. Configure a unique `router-id` on R4 (for example 4.4.4.4) and run `clear ip ospf process` there; a changed RID does not take effect until the process restarts or the router reloads.\n\n- The addresses differ (.3 and .4); the duplicate is the RID, not the IP address.\n- Process IDs are local and may match or differ freely.\n- An area mismatch produces a different symptom (hellos ignored) and is never reported as a duplicate router ID.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-080',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Ten minutes after the change, R2\'s neighbors still list it with router ID 10.0.23.2. Why?',
    exhibit: `R2(config)# router ospf 1
R2(config-router)# router-id 2.2.2.2
% OSPF: Reload or use "clear ip ospf process" command, for this to take effect
R2(config-router)# end

R2# show ip protocols | include Router ID
  Router ID 10.0.23.2`,
    options: [
      'A router ID must match an address on a loopback interface, so IOS rejected 2.2.2.2',
      'A new router ID takes effect only after the OSPF process restarts; run clear ip ospf process or reload',
      'OSPF reads the router ID from the startup configuration, so the running configuration must be saved first',
      'While any physical interface is up, OSPF keeps using the highest physical interface address as its ID',
    ],
    answer: [1],
    explanation: "IOS accepts the command but keeps the current RID until the OSPF process restarts, as the console message says. `clear ip ospf process` (confirm the prompt) or a reload applies **2.2.2.2**. Plan it for a maintenance window, because clearing the process resets every adjacency on R2.\n\n- The RID is any unique 32-bit value; it does not have to exist on an interface.\n- OSPF uses the running configuration; saving it does not restart the process.\n- A manually configured `router-id` overrides automatic selection once the process restarts.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-081',
    topic: '3.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. All routers run single-area OSPF, and the only multiaccess segment in the area is 10.50.0.0/24. Which two statements are true? (Choose two.)',
    exhibit: `R1# show ip ospf database

            OSPF Router with ID (1.1.1.1) (Process ID 1)

                Router Link States (Area 0)

Link ID         ADV Router      Age         Seq#       Checksum Link count
1.1.1.1         1.1.1.1         412         0x80000006 0x00A1B2 3
2.2.2.2         2.2.2.2         398         0x80000005 0x00C3D4 2
3.3.3.3         3.3.3.3         1210        0x80000004 0x0051E6 2
4.4.4.4         4.4.4.4         87          0x80000009 0x00F2A8 1

                Net Link States (Area 0)

Link ID         ADV Router      Age         Seq#       Checksum
10.50.0.3       3.3.3.3         1205        0x80000002 0x003C7F`,
    options: [
      'R1 is the DR on 10.50.0.0/24, because the database is displayed from R1\'s point of view.',
      'Four routers are in area 0.',
      'The router with RID 3.3.3.3 is the DR on 10.50.0.0/24, and its address on that segment is 10.50.0.3.',
      'The router with RID 4.4.4.4 is unstable, because its LSA has the lowest age.',
      'Each router in area 0 holds a different set of LSAs, built only from its own neighbors.',
      'Five routers are in area 0, because the Net Link States entry represents another router.',
    ],
    answer: [1, 2],
    explanation: "Every router originates one **Router LSA** (type 1) in its area, so four Router Link States entries mean **four routers**. A **Network LSA** (type 2) is originated by the **DR** of a multiaccess segment: its Link ID is the DR's interface address (10.50.0.3) and its ADV Router is the DR's RID (3.3.3.3).\n\n- The local router's view says nothing about who is DR; the Net LSA does.\n- Age only counts seconds since the LSA was originated or refreshed (refresh every 30 minutes); a low age is normal.\n- All routers in an area synchronize an identical LSDB; that is how link-state routing works.\n- A Network LSA describes a segment, not a router.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-082',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. R1 can reach 10.9.9.0/24, the LAN on R4 Gi0/0/2, through R2 or through R3. Which next hop and metric does R1 install for 10.9.9.0/24?',
    exhibit: `R1# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0/1      1     0               10.0.12.1/30       10    P2P   1/1
Gi0/0/2      1     0               10.0.13.1/30       4     P2P   1/1

R2# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0/0      1     0               10.0.12.2/30       10    P2P   1/1
Gi0/0/1      1     0               10.0.24.2/30       10    P2P   1/1

R3# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0/0      1     0               10.0.13.3/30       4     P2P   1/1
Gi0/0/1      1     0               10.0.34.3/30       20    P2P   1/1

R4# show ip ospf interface brief
Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0/0      1     0               10.0.24.4/30       10    P2P   1/1
Gi0/0/1      1     0               10.0.34.4/30       20    P2P   1/1
Gi0/0/2      1     0               10.9.9.1/24        1     DR    0/0`,
    options: [
      '10.0.13.3, because R1\'s interface toward R3 has the lower cost (4)',
      '10.0.12.2, with a total cost of 20',
      '10.0.12.2, with a total cost of 21',
      'Both next hops, because each path crosses the same number of routers',
    ],
    answer: [2],
    explanation: "OSPF cost is the sum of the **outgoing** interface costs from R1 to the destination network, including the cost of the destination LAN interface itself.\n\n- Via R2: R1 Gi0/0/1 (10) + R2 Gi0/0/1 (10) + R4 Gi0/0/2 (1) = **21**.\n- Via R3: R1 Gi0/0/2 (4) + R3 Gi0/0/1 (20) + R4 Gi0/0/2 (1) = 25.\n\nSo R1 installs `[110/21] via 10.0.12.2`.\n\n- The cheaper first hop toward R3 is outweighed by the cost-20 R3-R4 link.\n- A total of 20 leaves out the cost of the stub LAN, which is part of the metric.\n- OSPF ignores hop count; the paths cost 21 and 25, so there is no ECMP.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-083',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Refer to the exhibit. GigabitEthernet0/0/3 is enabled for OSPF, and no ip ospf cost command is configured on it. What OSPF cost does the interface have? Enter the number only.',
    exhibit: `R1# show interfaces GigabitEthernet0/0/3 | include BW
  MTU 1500 bytes, BW 50000 Kbit/sec, DLY 10 usec,

R1# show running-config | section router ospf
router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.255.255.255 area 0`,
    answer: ['2'],
    explanation: "The interface has been given `bandwidth 50000` (kbps), matching a 50 Mbps circuit. No `auto-cost reference-bandwidth` command is configured, so the reference is the default 100 Mbps: 100,000 kbps / 50,000 kbps = **2**. OSPF uses the configured `bandwidth` value, not the physical port speed.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-084',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: 'On an IOS-XE router, an engineer enters ip ospf hello-interval 5 on a broadcast interface and does not configure a dead interval. What dead interval, in seconds, does the interface now use? Enter the number only.',
    answer: ['20'],
    explanation: "When only the hello interval is changed, IOS automatically sets the dead interval to **four times the hello**: 4 x 5 = 20 seconds. The neighbor must use the same 5/20 values, or hellos are rejected. An explicitly configured `ip ospf dead-interval` overrides the automatic value.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-085',
    topic: '3.3',
    type: 'order',
    difficulty: 1,
    stem: 'Starting in global configuration mode, order the commands that enable IPv6 routing, create OSPFv3 process 1 with router ID 6.6.6.6, and then enable OSPFv3 area 0 on GigabitEthernet0/0/0.',
    items: [
      'ipv6 unicast-routing',
      'ipv6 router ospf 1',
      'router-id 6.6.6.6',
      'interface GigabitEthernet0/0/0',
      'ipv6 ospf 1 area 0',
    ],
    explanation: "`ipv6 unicast-routing` turns on IPv6 forwarding. `ipv6 router ospf 1` enters the OSPFv3 process, where `router-id` sets the 32-bit RID (essential on a router with no IPv4 addresses). `interface GigabitEthernet0/0/0` then enters interface mode, where `ipv6 ospf 1 area 0` enables OSPFv3 on that link. OSPFv3 has no `network` command; interfaces are always enabled individually.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-086',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. How should the engineer judge the AI assistant's configuration?",
    exhibit: `Request to AI assistant:
  Enable OSPFv3 process 1, area 0, on R5. Gi0/0/0 (2001:DB8:0:56::5/64)
  connects to R6. Gi0/0/1 (2001:DB8:5::1/64) is a user LAN with no
  routers: advertise its prefix but send no OSPF packets there. R5 has
  no IPv4 addresses, and IPv6 routing is not yet enabled.

AI assistant output:
  ipv6 unicast-routing
  !
  ipv6 router ospf 1
   router-id 5.5.5.5
   passive-interface GigabitEthernet0/0/1
  !
  interface GigabitEthernet0/0/0
   ipv6 ospf 1 area 0
  !
  interface GigabitEthernet0/0/1
   ipv6 ospf 1 area 0`,
    options: [
      'Accept it: the configuration meets every requirement as written.',
      'Reject it: OSPFv3 needs network 2001:DB8:0:56::/64 area 0 and network 2001:DB8:5::/64 area 0 under the process.',
      'Reject it: an OSPFv3 router ID must be an IPv6 address, for example router-id 2001:DB8:5::1.',
      'Reject it: Gi0/0/1 must not have ipv6 ospf 1 area 0, because a passive interface is configured only under the process.',
    ],
    answer: [0],
    explanation: "The assistant got it right. IPv6 routing is enabled; the process has a manual 32-bit RID, which is **required** here because R5 has no IPv4 address to derive one from; both interfaces are enabled with the interface command `ipv6 ospf 1 area 0`; and `passive-interface` under `ipv6 router ospf 1` stops hellos on the user LAN while its prefix is still advertised.\n\n- OSPFv3 has no `network` command.\n- The OSPFv3 RID is a 32-bit dotted-decimal value, as in OSPFv2.\n- A passive interface must still be enabled for OSPF, or its prefix would not be advertised at all.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-087',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. In a lab, R2 Loopback1 represents a /24 user LAN. R1 should learn 192.168.50.0/24, but it learns something else. What explains this, and what fixes it?',
    exhibit: `R2# show running-config interface Loopback1
interface Loopback1
 ip address 192.168.50.1 255.255.255.0
 ip ospf 1 area 0

R1# show ip route ospf | include 192.168.50
O        192.168.50.1/32 [110/2] via 10.0.12.2, 00:04:19, GigabitEthernet0/0/1`,
    options: [
      'R2 auto-summarizes the loopback into a host route; configure no auto-summary under router ospf 1',
      'OSPF advertises a loopback as a /32 host route; configure ip ospf network point-to-point on Loopback1',
      'The mask on R1 Gi0/0/1 differs from R2, so R1 can install only the host address of the remote network',
      'Loopback1 is only partly enabled; replace ip ospf 1 area 0 with network 192.168.50.0 0.0.0.255 area 0',
    ],
    answer: [1],
    explanation: "Loopbacks use the OSPF **LOOPBACK** network type, which always advertises the interface as a **/32 host route**, whatever mask is configured. Configuring `ip ospf network point-to-point` on Loopback1 makes R2 advertise the configured mask, so R1 learns 192.168.50.0/24. The metric of 2 is R1 Gi0/0/1 (cost 1) plus the loopback (cost 1).\n\n- OSPF has no automatic summarization.\n- A mask mismatch on the R1-R2 link would stop the adjacency entirely; the route would not appear at all.\n- A `network` statement enables OSPF the same way as the interface command, and the loopback would still be advertised as /32.",
    lesson: '3.3-ospf-config',
  },
  {
    id: 'd3-088',
    topic: '3.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. All Ethernet segments use the default broadcast network type unless the output shows otherwise. Which two statements about R1 are true? (Choose two.)',
    exhibit: `R1# show ip ospf neighbor

Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/DROTHER    00:00:33    10.10.0.2       GigabitEthernet0/0/0
3.3.3.3           1   FULL/DROTHER    00:00:39    10.10.0.3       GigabitEthernet0/0/0
4.4.4.4         100   FULL/BDR        00:00:31    10.10.0.4       GigabitEthernet0/0/0
5.5.5.5           0   FULL/  -        00:00:36    10.0.15.5       GigabitEthernet0/0/1
6.6.6.6           1   FULL/DR         00:00:38    10.20.0.6       GigabitEthernet0/0/2
7.7.7.7           1   2WAY/DROTHER    00:00:35    10.20.0.7       GigabitEthernet0/0/2
8.8.8.8           1   FULL/BDR        00:00:32    10.20.0.8       GigabitEthernet0/0/2`,
    options: [
      'R1 is the DR on the Gi0/0/0 segment.',
      'R1 is the BDR on the Gi0/0/0 segment.',
      'R1 is a DROTHER on the Gi0/0/2 segment.',
      'The 2WAY state with 7.7.7.7 indicates an MTU mismatch on Gi0/0/2.',
      'Gi0/0/1 uses the broadcast network type, and its DR election has not finished yet.',
      'Raising R1\'s priority on Gi0/0/2 to 255 would immediately make R1 the DR there.',
    ],
    answer: [0, 2],
    explanation: "A DROTHER goes Full only with the DR and BDR. On Gi0/0/0, R1 is Full with two DROTHERs, so R1 must be the DR or the BDR, and the BDR is 4.4.4.4, so **R1 is the DR**. On Gi0/0/2, R1 stays 2-Way with DROTHER 7.7.7.7 and is Full with the DR and BDR (6.6.6.6 and 8.8.8.8), which is exactly the pattern of a **DROTHER**.\n\n- The BDR role on Gi0/0/0 belongs to 4.4.4.4.\n- 2-Way between DROTHERs is normal; MTU problems show up as ExStart/Exchange.\n- `FULL/  -` means no DR/BDR exists on that link (point-to-point network type), not an unfinished election.\n- DR election is non-preemptive; a higher priority takes effect only at the next election.",
    lesson: '3.3-ospf-fundamentals',
  },
  {
    id: 'd3-089',
    topic: '3.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each State value from show ip ospf neighbor to what it tells you.',
    pairs: [
      ['FULL/DR', 'Databases are synchronized, and the neighbor is the designated router'],
      ['FULL/  -', 'Databases are synchronized on a link with no DR/BDR election, such as point-to-point'],
      ['2WAY/DROTHER', 'Normal steady state between two DROTHERs on a broadcast segment'],
      ['INIT/DROTHER', "The neighbor's hellos arrive, but they do not yet list this router's RID"],
      ['EXSTART/BDR', 'The database exchange cannot get started, often because of an IP MTU mismatch'],
    ],
    explanation: "The part before the slash is the adjacency state; the part after it is the **neighbor's** role on that segment. FULL means the LSDBs are synchronized; a dash means no DR/BDR exists on the link. 2WAY/DROTHER is expected between DROTHERs. INIT means one-way communication (for example an ACL dropping this router's hellos on the neighbor). A neighbor stuck in EXSTART/EXCHANGE usually has an MTU mismatch.",
    lesson: '3.3-ospf-fundamentals',
  },

  // ───────────────────────── 3.4 FHRP ─────────────────────────
  {
    id: 'd3-090',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. DSW1 is designed to be the active gateway for VLAN 10, and DSW2 (10.10.10.3) is its peer. Which statement explains the output?',
    exhibit: `DSW1# show standby Vlan10
Vlan10 - Group 10 (version 2)
  State is Standby
    5 state changes, last state change 00:02:51
  Virtual IP address is 10.10.10.1
  Active virtual MAC address is 0000.0c9f.f00a (MAC Not In Use)
    Local virtual MAC address is 0000.0c9f.f00a (v2 default)
  Hello time 3 sec, hold time 10 sec
    Next hello sent in 1.204 secs
  Preemption enabled
  Active router is 10.10.10.3, priority 100 (expires in 9.840 sec)
  Standby router is local
  Priority 80 (configured 110)
    Track object 1 state Down decrement 30
  Group name is "hsrp-Vl10-10" (default)`,
    options: [
      'DSW1 stopped receiving hellos from DSW2 and fell back to the Standby state until its hold timer is reset',
      'Tracked object 1 is down, cutting DSW1 from 110 to 80, below DSW2\'s 100, so DSW2 preempted it',
      'DSW1\'s priority was manually set to 80, and its own preempt setting then forced it into Standby',
      'DSW1 will stay Standby after object 1 recovers, because HSRP preemption can occur only once per failure',
    ],
    answer: [1],
    explanation: "`Priority 80 (configured 110)` with `Track object 1 state Down decrement 30` means a tracked object (typically an uplink) failed and HSRP lowered DSW1's priority by 30. At 80, DSW1 is below DSW2's 100, and DSW2 took the active role. That takeover implies **preempt on DSW2**, because an active router does not step down just because its own priority drops. When object 1 comes back up, DSW1 returns to 110 and, with `Preemption enabled`, takes the active role back.\n\n- DSW1 clearly hears DSW2: it shows DSW2's priority and a running hold timer.\n- The configured priority is 110; 80 is the tracked, effective value.\n- Preemption works every time the priority comparison changes.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-091',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 (192.168.8.2) should be the VRRP master for group 8 whenever it is up. R1 reloaded 15 minutes ago and is running normally. Why is R2 (192.168.8.3) still the master?',
    exhibit: `R1# show vrrp brief
Interface          Grp Pri Time  Own Pre State   Master addr     Group addr
Gi0/0/0            8   120 3531          Backup  192.168.8.3     192.168.8.1

R2# show vrrp brief
Interface          Grp Pri Time  Own Pre State   Master addr     Group addr
Gi0/0/0            8   100 3609       Y  Master  192.168.8.3     192.168.8.1`,
    options: [
      'R2 owns the virtual IP, so it has priority 255 and always remains the master while it is up and running',
      'Preemption is disabled on R1, so it cannot reclaim the master role; configure vrrp 8 preempt on R1',
      'VRRP never preempts by default, so R2 must be configured to hand the master role back to R1 when it returns',
      'R1 needs a priority of 255 before it is allowed to replace an existing master in a VRRP group',
    ],
    answer: [1],
    explanation: "R1 has the higher priority (120 versus 100), but its `Pre` column is blank: someone configured `no vrrp 8 preempt`. A backup without preemption never takes over from a working master, so R2 kept the role it gained while R1 was reloading. `vrrp 8 preempt` on R1 restores the design.\n\n- The virtual IP is 192.168.8.1, which is neither router's address, and R2's `Own` column is blank; R2's priority is 100, not 255.\n- VRRP preempts **by default**; the blank `Pre` on R1 means it was turned off.\n- Any priority higher than the master's is enough when preemption is enabled; 255 is reserved for the address owner.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-092',
    topic: '3.4',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. DSW2's address in VLAN 50 is 10.50.0.3. Which two statements are true? (Choose two.)",
    exhibit: `DSW2# show standby Vlan50
Vlan50 - Group 50
  State is Active
    2 state changes, last state change 03:14:22
  Virtual IP address is 10.50.0.1
  Active virtual MAC address is 0000.0c07.ac32 (MAC In Use)
    Local virtual MAC address is 0000.0c07.ac32 (v1 default)
  Hello time 3 sec, hold time 10 sec
    Next hello sent in 2.016 secs
  Preemption disabled
  Active router is local
  Standby router is 10.50.0.2, priority 120 (expires in 8.732 sec)
  Priority 100 (default 100)
  Group name is "hsrp-Vl50-50" (default)`,
    options: [
      'Hosts that use 10.50.0.1 as their default gateway send their off-subnet frames to DSW2.',
      'The group runs HSRP version 2.',
      'DSW2 is active because it has the higher priority in the group.',
      'If DSW2 fails, 10.50.0.2 becomes active after about 10 seconds without hellos from DSW2.',
      '10.50.0.2 will take the active role when the current hold time expires, because its priority is higher.',
      "Hosts that ARP for 10.50.0.1 receive DSW2's burned-in MAC address.",
    ],
    answer: [0, 3],
    explanation: "DSW2 is **Active**, so it owns virtual MAC 0000.0c07.ac32 and forwards everything hosts send to the gateway 10.50.0.1. The standby (10.50.0.2) takes over when the **10-second hold time** passes without hellos from DSW2.\n\n- The `0000.0c07.acXX` MAC and `v1 default` mean HSRPv1 (0x32 = group 50).\n- DSW2 (100) has the *lower* priority; it holds the active role only because 10.50.0.2 does not preempt.\n- 10.50.0.2 has evidently not preempted in more than three hours, so it has no preempt configured; a higher priority alone never takes over a working active router.\n- ARP replies for the virtual IP carry the virtual MAC, never a burned-in MAC.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-093',
    topic: '3.4',
    type: 'fill',
    difficulty: 2,
    stem: 'What virtual MAC address does VRRP use for group (VRID) 12? Enter it in Cisco dotted format (xxxx.xxxx.xxxx).',
    answer: ['0000.5e00.010c', '00:00:5e:00:01:0c', '00-00-5e-00-01-0c'],
    explanation: "VRRP (IPv4) virtual MACs are `0000.5e00.01XX`, where XX is the VRID in hex. 12 decimal = 0x0C, so the MAC is **0000.5e00.010c**. Compare HSRPv1 group 12 (0000.0c07.ac0c) and HSRPv2 group 12 (0000.0c9f.f00c).",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-094',
    topic: '3.4',
    type: 'order',
    difficulty: 2,
    stem: 'DSW1 is the HSRP active router for VLAN 10 and DSW2 is standby, with default timers. DSW1 suddenly loses power. Order the events from first to last.',
    items: [
      'DSW1 stops sending HSRP hellos',
      'The hold timer for the active router expires on DSW2 after 10 seconds',
      'DSW2 moves to the Active state',
      'DSW2 sends a gratuitous ARP for the virtual IP, so switches learn the virtual MAC on its port',
      'Host frames sent to the unchanged virtual MAC now reach DSW2',
    ],
    explanation: "With hello 3 s and hold 10 s, DSW2 declares the active router dead only when **10 seconds** pass without a hello. It then becomes **Active** and sends a **gratuitous ARP** so the Layer 2 switches move the virtual MAC's MAC table entry to DSW2's port. Hosts change nothing: their gateway IP and its MAC stay the same, which is the whole point of an FHRP.",
    lesson: '3.4-fhrp',
  },
  {
    id: 'd3-095',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. How should the engineer judge the AI assistant's summary?",
    exhibit: `DSW1# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vl70        70   120 P Active  local           10.70.0.3       10.70.0.1
Vl80        80   100   Standby 10.80.0.3       local           10.80.0.1

DSW2# show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vl70        70   100   Standby 10.70.0.2       local           10.70.0.1
Vl80        80   120   Active  local           10.80.0.2       10.80.0.1

--- AI network assistant summary ---
Load is split: DSW1 forwards for VLAN 70 and DSW2 forwards for VLAN 80.
Failover is symmetric: if either switch reloads, the other takes over
its VLAN, and the original switch reclaims its VLAN when it comes back.`,
    options: [
      'The summary is correct in every respect, including the claim about reclaiming roles, so no change is needed.',
      'Partly wrong: DSW2 lacks preempt in group 80, so after a reload DSW1 keeps VLAN 80; add standby 80 preempt on DSW2.',
      'Partly wrong: DSW1 lacks preempt in group 80, so DSW1 would be unable to take over VLAN 80 if DSW2 failed.',
      'Wrong: both switches forward for both VLANs, because HSRP shares the load among all routers in a group.',
    ],
    answer: [1],
    explanation: "The load split is right: DSW1 is Active for group 70 and DSW2 is Active for group 80. Failover is also right in both directions, because a standby takes over when hellos stop whether or not it preempts. The **reclaim** claim is wrong for VLAN 80: DSW2 has priority 120 but no `P` flag, so after it reloads it returns as Standby and DSW1 stays active for VLAN 80. `standby 80 preempt` on DSW2 makes the design symmetric (DSW1 already preempts in group 70).\n\n- Preemption is needed only to *take back* the role, not to take over from a failed active router.\n- HSRP has one forwarding router per group; the load split comes from using two groups.",
    lesson: '3.4-fhrp',
  },
];
