// Domain 1 — Architecture. Original questions modeled on Cisco's public exam-topic wording; no recalled exam items.
// Standards facts: RFC 2281, 2474, 2597, 2698, 3246, 4594, 7348, 9301, 9568 and draft-smith-vxlan-group-policy.
// SD-WAN and SD-Access defaults: CiscoDevNet terraform-provider-sdwan / terraform-provider-catalystcenter docs.
// Output layouts follow Cisco genieparser captures; all device output is documentation-based (see REVIEW-TODO.md).
const L11A = '1.1-design-models';
const L11B = '1.1-high-availability';
const L12A = '1.2-sdwan-planes';
const L12B = '1.2-sdwan-benefits-limits';
const L13A = '1.3-sda-planes';
const L13B = '1.3-sda-traditional-interop';
const L14A = '1.4-qos-classification-marking';
const L14B = '1.4-qos-queuing-policing-output';

const bank = [
  // ---------- 1.1.a Design models ----------
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11A,
    stem: 'Refer to the exhibit. The campus is growing and two more buildings will be added next year. Which design change keeps the number of links between distribution blocks manageable as buildings are added?',
    exhibit: `Campus today (each building has one distribution pair):
  Building A: DSW1, DSW2      Building B: DSW3, DSW4
  Building C: DSW5, DSW6      Building D: DSW7, DSW8
  Data center: DSW9, DSW10
Every distribution pair has routed links to every other
distribution pair (full mesh between the five blocks).`,
    options: ['Add a pair of core switches and connect every distribution pair only to the core', 'Collapse all buildings onto the Building A distribution pair so that the campus becomes a two-tier design', 'Convert the inter-building links to Layer 2 trunks and let STP block the redundant paths', 'Connect each new building only to the distribution pair of the nearest existing building'],
    answer: [0],
    explanation: "A full mesh of n blocks needs n(n-1)/2 block-to-block connections, so adding blocks grows the link count quadratically (5 blocks need 10, 7 need 21). A dedicated core turns the mesh into a hub: each new block adds only its own links to the core, which is exactly when a three-tier design is justified. Collapsing every building onto one distribution pair overloads it and makes it a single failure domain for the whole campus. Layer 2 trunks between buildings stretch STP and broadcast domains across the campus, the opposite of good hierarchical design. Daisy-chaining new buildings through an existing block adds hops and makes that block a transit point for others' traffic." },
  { topic: '1.1', type: 'multi', difficulty: 1, lesson: L11A,
    stem: 'In a traditional three-tier campus with Layer 2 access, which two functions belong at the distribution layer? (Choose two.)',
    options: ['Providing the default gateway for access VLANs with a first hop redundancy protocol', 'Summarizing routes and applying policy toward the core', 'Supplying PoE to IP phones and access points', 'Authenticating users with 802.1X on their switch ports', 'Interconnecting the data center, WAN edge and all building blocks at the highest possible speed'],
    answer: [0, 1],
    explanation: 'The distribution layer aggregates access switches, is the Layer 2 to Layer 3 boundary (FHRP gateways for the access VLANs), and is where routes are summarized and policy such as ACLs and QoS is applied before the core. PoE and 802.1X are access-layer functions because they act on the port where the endpoint connects. Interconnecting all blocks as fast as possible with minimal policy is the core layer job.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11A,
    stem: 'Refer to the exhibit. Which statement about this access switch is true?',
    exhibit: `ASW1#show running-config | section interface Gi|interface Vlan|router ospf
interface GigabitEthernet1/0/49
 description Uplink to DSW1
 no switchport
 ip address 10.255.1.1 255.255.255.254
 ip ospf network point-to-point
interface GigabitEthernet1/0/50
 description Uplink to DSW2
 no switchport
 ip address 10.255.1.3 255.255.255.254
 ip ospf network point-to-point
interface Vlan10
 ip address 10.1.10.1 255.255.255.0
router ospf 1
 router-id 10.255.255.11
 passive-interface Vlan10
 network 10.1.10.0 0.0.0.255 area 0
 network 10.255.1.0 0.0.0.3 area 0`,
    options: ['Both uplinks forward traffic through equal-cost OSPF routes, and STP does not block either uplink', 'DSW1 and DSW2 must run HSRP to provide the default gateway for VLAN 10', 'VLAN 10 can be extended to ASW2 over the two uplinks', 'The /31 masks on the uplinks prevent OSPF adjacencies from forming'],
    answer: [0],
    explanation: 'This is routed access: the uplinks are routed ports (`no switchport`) and ASW1 owns the VLAN 10 gateway, so redundancy comes from two equal-cost OSPF paths (ECMP), not from STP. No FHRP is needed on the distribution switches because they are not the gateway for VLAN 10. Routed ports carry no VLANs, so VLAN 10 stays local to ASW1. /31 masks are valid on point-to-point links (RFC 3021) and OSPF forms adjacencies over them; `ip ospf network point-to-point` matches that design.' },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L11A,
    stem: 'Refer to the exhibit. The data center will add two more leaf switches and must keep following spine-leaf rules. How many leaf-to-spine links will the fabric have after the two leaves are added? Enter a number.',
    exhibit: `Spines: SW1  SW2  SW3  SW4
Leaves: SW5  SW6  SW7  SW8  SW9  SW10
Each leaf has exactly one 100G link to each spine.
No leaf-to-leaf or spine-to-spine links.`,
    answer: ['32'],
    explanation: 'In a spine-leaf fabric every leaf connects to every spine. With 4 spines, each leaf has 4 uplinks. After the change there are 6 + 2 = 8 leaves, so 8 x 4 = 32 leaf-to-spine links. Leaves never connect to each other and spines never connect to each other, which keeps every leaf exactly two hops (leaf-spine-leaf) from any other leaf.' },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11A,
    stem: 'Refer to the exhibit. Which cloud service model describes workload 2?',
    exhibit: `Workload inventory
1. Email and calendaring: subscription service; the provider runs
   and patches the whole application.
2. Branch VPN hub: a Catalyst 8000V router and two Linux VMs that
   the network team installs, patches and configures inside a
   public cloud virtual network.
3. Order database: a provider-managed database engine; the team
   only creates schemas and tables.`,
    options: ['Infrastructure as a service (IaaS)', 'Platform as a service (PaaS)', 'Software as a service (SaaS)', 'Private cloud'],
    answer: [0],
    explanation: 'In IaaS the provider runs the physical hosts, hypervisor and network fabric, and the customer runs the operating systems, virtual routers and applications, which is workload 2. Workload 3 is PaaS (the provider also runs the database platform). Workload 1 is SaaS (the provider runs the entire application). A private cloud is a deployment model on infrastructure dedicated to one organization, usually on premises; workload 2 runs in a public cloud.' },

  // ---------- 1.1.b High availability ----------
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'Refer to the exhibit. DSW1 has been the HSRP active router for VLAN 10 with the default priority. An engineer configured priority 120 on DSW2 so that DSW2 would become active, but DSW2 stays in standby. What is the cause?',
    exhibit: `DSW2#show standby brief
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Vl10        10   120   Standby 10.1.10.2       local           10.1.10.1`,
    options: ['Preemption is not configured on DSW2 for group 10', 'DSW1 has the higher interface IP address, which wins over priority', 'The HSRP versions on DSW1 and DSW2 do not match', 'HSRP priority cannot be set higher than 100'],
    answer: [0],
    explanation: 'The `P` column is empty for DSW2, so `standby 10 preempt` is missing. Without preemption, a router with a higher priority does not take over from an existing active router; it waits until the active fails. The IP address only breaks a tie when priorities are equal, and 120 beats DSW1\'s default 100. A version mismatch would prevent the routers from seeing each other, but DSW2 lists 10.1.10.2 as the active peer. HSRP priority ranges from 0 to 255.' },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L11B,
    stem: 'Refer to the exhibit. GigabitEthernet1/0/48, DSW1\'s only uplink, has just gone down. Enter the HSRP priority DSW1 now advertises for group 10.',
    exhibit: `DSW1#show running-config | section track 1|interface Vlan10
track 1 interface GigabitEthernet1/0/48 line-protocol
interface Vlan10
 ip address 10.1.10.2 255.255.255.0
 standby version 2
 standby 10 ip 10.1.10.1
 standby 10 priority 110
 standby 10 preempt
 standby 10 track 1 decrement 15`,
    answer: ['95'],
    explanation: 'Track object 1 follows the line protocol of GigabitEthernet1/0/48. When it goes down, HSRP subtracts the configured decrement from the configured priority: 110 - 15 = 95. If DSW2 runs the default priority 100 with `preempt`, it now takes over as active; without preemption on DSW2 the lowered priority would not move the role.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'Refer to the exhibit. R1 has two route processors and runs OSPF with graceful restart (`nsf ietf`); its OSPF neighbors support graceful restart helper mode. The active route processor fails. What is the expected result?',
    exhibit: `R1#show redundancy states
       my state = 13 -ACTIVE
     peer state = 8  -STANDBY HOT
           Mode = Duplex
           Unit = Primary
        Unit ID = 48

Redundancy Mode (Operational) = sso
Redundancy Mode (Configured)  = sso
Redundancy State              = sso
     Maintenance Mode = Disabled
    Manual Swact = enabled
 Communications = Up`,
    options: ['The standby takes over without reloading the interfaces, forwarding continues on the existing FIB, and the neighbors keep R1\'s routes while OSPF resynchronizes', 'The standby must finish booting IOS XE and reload the line cards before forwarding resumes', 'All OSPF neighbors immediately flush R1\'s routes until new adjacencies reach FULL', 'R1 stays down until an administrator runs redundancy force-switchover'],
    answer: [0],
    explanation: 'The peer is `STANDBY HOT` and the operational mode is `sso`, so the standby already holds the synchronized configuration and state and takes over without resetting interfaces. NSF keeps hardware forwarding on the last FIB, and NSF-aware (graceful restart helper) neighbors keep R1\'s routes while the new active rebuilds OSPF. Finishing a boot and reloading line cards describes RPR. Neighbors flushing routes is what happens without graceful restart. Switchover after a failure is automatic; `redundancy force-switchover` is for a planned manual switchover.' },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L11B,
    stem: 'Match each failure scenario to the high availability technique that addresses it.',
    pairs: [
      ['DSW1, the default gateway for VLAN 10, loses power and hosts must keep using the same gateway address', 'First hop redundancy protocol (HSRP or VRRP)'],
      ['One of four parallel links between ASW1 and DSW1 fails and STP must not reconverge', 'EtherChannel'],
      ['The active supervisor of a Catalyst 9400 crashes and the line cards must keep forwarding without a reload', 'SSO with NSF'],
      ['The StackWise Virtual link fails and both chassis try to become active', 'Dual-active detection'],
      ['A dead neighbor on a routed uplink must be detected in well under a second', 'BFD'],
    ],
    explanation: 'An FHRP moves the virtual gateway IP and MAC to the surviving router, so hosts change nothing. EtherChannel presents four links as one logical port to STP, so losing a member only reduces bandwidth. SSO keeps a hot standby supervisor, and NSF keeps the hardware forwarding on the existing FIB through the switchover. Dual-active detection (DAD) links detect that both StackWise Virtual chassis are active after an SVL failure and put one into recovery mode. BFD (RFC 5880) detects a failed forwarding path in milliseconds and notifies the routing protocol.' },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L11B,
    stem: 'Which two statements about VRRPv3 (RFC 9568) are true? (Choose two.)',
    options: ['IPv4 advertisements are sent to 224.0.0.18 using IP protocol 112', 'A backup router with a higher priority preempts the active router by default', 'Advertisements are sent over UDP port 1985', 'The IPv4 virtual MAC address is 0000.0c07.acXX, where XX is the group', 'A single VRRP group load-balances hosts across several active routers'],
    answer: [0, 1],
    explanation: 'RFC 9568 uses multicast 224.0.0.18 and IP protocol 112 for IPv4, and its `Preempt_Mode` default is True, so a higher-priority backup takes over. UDP 1985 is HSRP (both versions) and the `0000.0c07.acXX` MAC is HSRP version 1 (RFC 2281); the VRRP IPv4 virtual MAC is `0000.5e00.01XX` (XX = VRID). A VRRP group has one active router; per-host load sharing inside one group is a GLBP feature.' },
  { topic: '1.1', type: 'order', difficulty: 3, lesson: L11B,
    stem: 'A router with dual route processors runs SSO, and OSPF is configured for graceful restart with NSF-aware neighbors. Put the events after a failure of the active route processor in the order they occur.',
    items: [
      'The active route processor fails',
      'The standby detects the loss of the active and becomes active, already holding the synchronized configuration and SSO state',
      'The new active restarts OSPF and signals a graceful restart to its neighbors, while the hardware keeps forwarding on the existing FIB',
      'The NSF-aware neighbors keep the restarting router\'s routes and resend their link-state information',
      'The new active rebuilds its routing table, updates the FIB and removes stale entries',
    ],
    explanation: 'SSO first: the standby detects the failure and takes over with state it already has, so interfaces are not reset. NSF keeps forwarding on the existing FIB while the new active restarts the routing protocol and signals graceful restart (RFC 3623 for OSPF). Helper neighbors keep the restarting router in their SPF calculations and resynchronize their databases with it. Only then does the router rebuild its RIB, refresh the FIB and flush stale entries; doing that earlier would drop traffic during convergence.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'Refer to the exhibit. What is the purpose of the interfaces listed?',
    exhibit: `DSW1#show stackwise-virtual dual-active-detection
In dual-active recovery mode: No
Recovery Reload: Enabled

Dual-Active-Detection Configuration:
-------------------------------------
Switch  Dad port                        Status
------  ------------                    ---------
1       HundredGigE1/0/7                up
        HundredGigE1/0/8                up
2       HundredGigE2/0/7                up
        HundredGigE2/0/8                up`,
    options: ['They detect that both chassis have become active after a StackWise Virtual link failure, so that one chassis enters recovery mode', 'They form the StackWise Virtual link that carries control and data traffic between the two chassis', 'They are multichassis EtherChannel members toward the access switches', 'They carry HSRP hellos between the two chassis'],
    answer: [0],
    explanation: 'The output is `show stackwise-virtual dual-active-detection`, so these are DAD ports. If the StackWise Virtual link (SVL) fails, both chassis could act as active with the same configuration; DAD detects this and one chassis goes into recovery mode (shutting down its interfaces) to avoid two devices with the same addresses and identity. The SVL ports are shown by `show stackwise-virtual`. MEC members connect downstream switches. A StackWise Virtual pair is one logical switch, so no HSRP runs between the chassis.' },

  // ---------- 1.2 Catalyst SD-WAN ----------
  { topic: '1.2', type: 'match', difficulty: 2, lesson: L12A,
    stem: 'Match each Catalyst SD-WAN symptom to the most likely cause.',
    pairs: [
      ['A new WAN Edge never learns the controller addresses; its first DTLS attempt toward the orchestrator times out', 'SD-WAN Validator unreachable'],
      ['Control connections are up, but BFD sessions to every remote TLOC stay down', 'IPsec data-plane traffic blocked between TLOCs'],
      ['User traffic forwards normally, but a configuration change cannot be pushed to the edge', 'Connection to SD-WAN Manager lost'],
      ['Edges keep forwarding on old routes, but prefixes added at other sites never appear', 'OMP sessions to the SD-WAN Controllers down'],
    ],
    explanation: 'The Validator is the first point of contact: an edge that cannot reach it never learns where the Managers and Controllers are. BFD runs inside the IPsec tunnels, so up control connections with down BFD means the data plane (UDP from the TLOC ports) is blocked or mis-NATed between sites. SD-WAN Manager is the management plane; losing it stops configuration and monitoring but not forwarding. Controllers carry OMP; with OMP graceful restart edges keep using cached routes and keys, but no new routes arrive until OMP is back.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. Which statement describes the control connections of this WAN Edge?',
    exhibit: `R1#show sdwan control connections
                                                                                       PEER                                          PEER                                          CONTROLLER
PEER    PEER PEER            SITE       DOMAIN PEER                                    PRIV  PEER                                    PUB                                           GROUP
TYPE    PROT SYSTEM IP       ID         ID     PRIVATE IP                              PORT  PUBLIC IP                               PORT  ORGANIZATION            LOCAL COLOR     PROXY STATE UPTIME      ID
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
vsmart  dtls 10.255.0.3      100        1      192.0.2.30                              12346 192.0.2.30                              12346 EXAMPLE-ORG             biz-internet    No    up     3:04:11:52  0
vsmart  dtls 10.255.0.4      100        1      192.0.2.31                              12346 192.0.2.31                              12346 EXAMPLE-ORG             biz-internet    No    up     3:04:11:50  0
vmanage dtls 10.255.0.2      100        0      192.0.2.25                              12446 192.0.2.25                              12446 EXAMPLE-ORG             biz-internet    No    up     3:04:11:47  0`,
    options: ['The edge has DTLS control connections to two SD-WAN Controllers and one SD-WAN Manager over its biz-internet TLOC', 'The edge is still connected to the SD-WAN Validator, which is listed as vmanage', 'The edge runs OMP with all three peers, including the vmanage peer', 'The control connections use TLS over TCP, as shown by the 12346 and 12446 ports'],
    answer: [0],
    explanation: 'CLI output still uses the former names: `vsmart` is an SD-WAN Controller and `vmanage` is the SD-WAN Manager, all with protocol `dtls` on the biz-internet color. The Validator (`vbond`) connection from a WAN Edge is transient and is not listed once the edge has joined. OMP runs only with the Controllers, not with the Manager. DTLS is UDP; 12346 is the base DTLS port and 12446 is the next per-core port. TLS would show `tls` and the 23456 range.' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. How many seconds without BFD hellos must pass before R1 declares the mpls tunnel to site 200 down? Enter a number.',
    exhibit: `R1#show sdwan bfd sessions
                                      SOURCE TLOC      REMOTE TLOC                       DST PUBLIC       DST PUBLIC         DETECT      TX
SYSTEM IP        SITE ID  STATE       COLOR            COLOR            SOURCE IP        IP               PORT        ENCAP  MULTIPLIER  INTERVAL(msec)  UPTIME        TRANSITIONS
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
10.255.1.2       200      up          biz-internet     biz-internet     198.51.100.10    203.0.113.20     12346       ipsec  7           1000           0:01:46:50      0
10.255.1.2       200      up          mpls             mpls             172.16.10.1      172.16.20.1      12346       ipsec  7           1000           0:01:46:51      0`,
    answer: ['7', '7 seconds', '7 s', '7s'],
    explanation: 'BFD declares a session down after the detect multiplier times the hello interval passes without a hello: 7 x 1,000 ms = 7,000 ms, or 7 seconds. These are the default BFD values for a color in the SD-WAN BFD template (hello 1,000 ms, multiplier 7). Path quality for application-aware routing is measured separately over the poll interval.' },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12A,
    stem: 'Enter the default base UDP port that Catalyst SD-WAN devices use for DTLS control connections (before any port offset).',
    answer: ['12346', 'udp 12346'],
    explanation: 'DTLS control connections use UDP 12346 as the base port. Controllers with several cores also use ports in steps of 100 (12446, 12546 ...), and a WAN Edge can shift its base with a port offset. TLS control connections use TCP 23456 as the base.' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12A,
    stem: 'Which three route types does OMP advertise between WAN Edges and SD-WAN Controllers? (Choose three.)',
    options: ['OMP routes for service-side prefixes', 'TLOC routes', 'Service routes', 'BFD path-quality probes', 'NETCONF configuration from SD-WAN Manager', 'Encapsulated user traffic'],
    answer: [0, 1, 2],
    explanation: 'OMP carries OMP routes (prefixes learned on the service side, with their TLOCs), TLOC routes (each transport attachment with its addresses, color and encapsulation) and service routes (services such as firewalls for service chaining); it also distributes the data-plane IPsec keys. BFD probes run inside the IPsec tunnels between edges, not in OMP. Configuration is pushed by SD-WAN Manager over NETCONF. User traffic travels in the IPsec data plane, never through the Controllers.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. New branch WAN Edges, which reach the data center only over the internet, cannot join the overlay. Which addressing problem prevents it?',
    exhibit: `Data center controllers
  SD-WAN Manager     10.10.0.10   static NAT 203.0.113.10
  SD-WAN Controller  10.10.0.20   static NAT 203.0.113.20
  SD-WAN Validator   10.10.0.30   no NAT, no public address
Branch WAN Edges: one biz-internet TLOC each, DHCP addressing`,
    options: ['The SD-WAN Validator has no public or one-to-one NAT address, so the edges cannot reach their first point of contact', 'SD-WAN Manager must not be behind NAT, because the edges contact it first', 'The SD-WAN Controller needs a second public address for OMP', 'Branch edges need the mpls color to reach controllers across the internet'],
    answer: [0],
    explanation: 'Every WAN Edge first authenticates to the Validator, which then tells it where the Managers and Controllers are and helps with NAT traversal. That requires the Validator to be reachable at a public address or a one-to-one NAT, and here it has neither. Managers and Controllers can sit behind one-to-one NAT; the edges learn their addresses from the Validator, so the Manager is not contacted first. OMP runs inside the existing control connection, not on a separate address. Colors are labels for transports; an internet TLOC normally uses a public color such as biz-internet.' },
  { topic: '1.2', type: 'order', difficulty: 2, lesson: L12A,
    stem: 'Put the steps of zero-touch onboarding of a new WAN Edge in order.',
    items: [
      'The WAN Edge boots, gets an address on its transport interface and contacts Cisco Plug and Play to learn its Validator address and organization name',
      'The WAN Edge authenticates to the SD-WAN Validator over DTLS',
      'The Validator sends the addresses of the SD-WAN Managers and Controllers, and the transient connection to the Validator closes',
      'The WAN Edge builds control connections to SD-WAN Manager and the Controllers, and the Manager pushes its configuration',
      'OMP sessions with the Controllers exchange OMP routes, TLOC routes and data-plane keys',
      'IPsec tunnels with BFD come up to the remote WAN Edges',
    ],
    explanation: 'The edge first needs to know where its Validator is (Plug and Play provides it), then authenticates to the Validator, the orchestration plane, which hands out the Manager and Controller addresses. Control connections to the Manager (configuration) and Controllers follow, and OMP over the Controller connections delivers the TLOCs and keys needed to build tunnels. Tunnels and BFD can only come up after the edge knows the remote TLOCs and keys.' },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L12B,
    stem: 'Refer to the exhibit. Which tunnel does the WAN Edge use for traffic marked DSCP 46?',
    exhibit: `SLA class VOICE-SLA: loss <= 1 %, latency <= 150 ms, jitter <= 30 ms
App-route policy: match DSCP 46 -> SLA class VOICE-SLA, preferred color mpls

Tunnel (local -> remote color)   Loss   Latency   Jitter
mpls -> mpls                     2 %    40 ms     5 ms
biz-internet -> biz-internet     0 %    60 ms     12 ms
lte -> lte                       0 %    180 ms    25 ms`,
    options: ['biz-internet, because it is the only tunnel that meets every VOICE-SLA threshold', 'mpls, because the preferred color is always used when the tunnel is up', 'lte, because it has the lowest loss and jitter combined', 'All three tunnels, load-shared equally, because DSCP 46 is never steered'],
    answer: [0],
    explanation: 'Application-aware routing compares the BFD-measured loss, latency and jitter of each tunnel with the SLA class. mpls fails the loss threshold (2 % > 1 %) and lte fails latency (180 ms > 150 ms); only biz-internet meets all three, so voice uses it. The preferred color applies only among tunnels that meet the SLA; it does not override the SLA. lte has the same 0 % loss as biz-internet but misses the latency limit. The policy explicitly matches DSCP 46, so it is steered rather than load-shared.' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12B,
    stem: 'Which two are limitations of the Catalyst SD-WAN solution? (Choose two.)',
    options: ['New sites cannot join and policy cannot change while the controllers are unreachable', 'A large full mesh adds IPsec and BFD overhead on every tunnel, so big overlays usually use hub-and-spoke or regional designs', 'Traffic over internet transports cannot be encrypted', 'Every WAN Edge must be configured individually from its CLI', 'Only MPLS transports can carry application-aware routing traffic'],
    answer: [0, 1],
    explanation: 'The control and management planes are centralized: graceful restart keeps edges forwarding for a while, but onboarding and policy changes need the controllers. Every tunnel carries IPsec overhead and runs BFD, which grows quickly in a full mesh. Encryption on every tunnel is a benefit, not a limitation. SD-WAN Manager configures edges centrally with templates or configuration groups. Application-aware routing works over any transport color, including internet and LTE.' },

  // ---------- 1.3 SD-Access ----------
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L13A,
    stem: 'Which encapsulation does Cisco SD-Access use in its data plane?',
    options: ['VXLAN with the Group Policy Option, carrying the VNI and the source SGT', 'LISP data-plane encapsulation on UDP port 4341', 'IPsec ESP between edge nodes', 'MPLS labels assigned by the control plane node'],
    answer: [0],
    explanation: 'SD-Access uses LISP only as its control plane; the data plane is VXLAN with the Group Policy extension, so each packet carries the virtual network (VNI) and the source scalable group tag. Native LISP encapsulation (UDP 4341, RFC 9300) is not used for SD-Access user traffic. IPsec is the Catalyst SD-WAN data plane, not SD-Access. The control plane node maps EIDs to RLOCs; it does not assign MPLS labels.' },
  { topic: '1.3', type: 'match', difficulty: 1, lesson: L13A,
    stem: 'Match each description to the SD-Access fabric role.',
    pairs: [
      ['Answers Map-Requests from edge nodes with the RLOC of an endpoint', 'Control plane node'],
      ['Authenticates a laptop and acts as its anycast default gateway', 'Edge node'],
      ['Routes VXLAN packets between loopbacks with no knowledge of VNs or endpoints', 'Intermediate node'],
      ['Connects the fabric to the WAN and is the gateway of last resort for unknown destinations', 'External border node'],
    ],
    explanation: 'The control plane node is the LISP Map-Server/Map-Resolver and host tracking database. The edge node is the access switch: it authenticates endpoints, registers them, hosts the anycast gateway and is the VTEP. Intermediate nodes are underlay-only routers between fabric devices. An external border is the default exit from the fabric toward unknown destinations such as the WAN and internet.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13A,
    stem: 'Host A connects to edge node ASW1, and host B on edge node ASW2 later sends traffic to host A. Put the SD-Access control and data plane events in order.',
    items: [
      'Host A authenticates on ASW1 and is placed in a VN with an SGT',
      'ASW1 sends a LISP Map-Register for host A\'s EID to the control plane node',
      'ASW2 has no map-cache entry for host A and sends a Map-Request to the control plane node',
      'ASW2 receives a Map-Reply with ASW1\'s RLOC and caches it',
      'ASW2 encapsulates host B\'s traffic in VXLAN with the VNI and host B\'s SGT and sends it to ASW1\'s RLOC',
      'ASW1 decapsulates the packet and applies the SGACL before delivering it to host A',
    ],
    explanation: 'Registration happens when the endpoint is onboarded: authentication assigns VN and SGT, then the edge registers the EID with the control plane node (Map-Register, RFC 9301). A remote edge resolves the EID only when it has traffic for it (Map-Request, Map-Reply) and caches the RLOC. It then encapsulates in VXLAN-GPO with the VNI and the source SGT. Policy is enforced at the egress edge, which knows the source SGT from the header and the destination SGT locally.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. A packet captured on an underlay link between two fabric switches is decoded as shown (trimmed). Which statement is true?',
    exhibit: `Internet Protocol Version 4, Src: 192.168.255.11, Dst: 192.168.255.12
User Datagram Protocol, Src Port: 65012, Dst Port: 4789
Virtual eXtensible Local Area Network
    Flags: G (Group Based Policy) = 1, I (VNI present) = 1
    Group Policy ID: 17
    VXLAN Network Identifier (VNI): 4099
Ethernet II
Internet Protocol Version 4, Src: 10.10.10.21, Dst: 10.10.20.33`,
    options: ['Host 10.10.10.21 belongs to scalable group tag 17, and the switch with RLOC 192.168.255.12 can enforce group policy on the packet', 'Host 10.10.10.21 is in VLAN 17 and VN 4099 on every edge node', 'VNI 4099 is the SGT and the Group Policy ID identifies the VN', 'The packet is LISP data-plane encapsulation sent to the control plane node for policy enforcement'],
    answer: [0],
    explanation: 'With the G bit set, the VXLAN-GPO header carries the 16-bit Group Policy ID, which SD-Access uses for the source SGT (17). The outer destination 192.168.255.12 is the egress edge RLOC, which knows the destination group locally and applies the SGACL. The Group Policy ID is not a VLAN, and the VNI (24 bits) identifies the virtual network or Layer 2 segment, not the group. UDP 4789 is VXLAN, not LISP (4341), and user traffic never goes through the control plane node.' },
  { topic: '1.3', type: 'fill', difficulty: 3, lesson: L13A,
    stem: 'Refer to the exhibit. The inner IPv4 packet is 1500 bytes, and the underlay carries it as shown with an IPv4 outer header and no outer 802.1Q tag. Enter the Total Length, in bytes, of the outer IPv4 header.',
    exhibit: `Outer: Ethernet II | IPv4 (Total Length: ?) | UDP dst 4789 | VXLAN (8 bytes)
Inner: Ethernet II (14 bytes, no 802.1Q tag) | IPv4 (Total Length: 1500)`,
    answer: ['1550'],
    explanation: 'The outer IPv4 Total Length counts the outer IP header and everything it carries: outer IPv4 header 20 + UDP 8 + VXLAN 8 + inner Ethernet header 14 + inner IP packet 1500 = 1550 bytes. That is the usual "VXLAN adds 50 bytes" (the outer Ethernet header is not part of the outer IP packet, but the inner one is). The underlay IP MTU must therefore be at least 1550 to carry 1500-byte host packets without fragmentation, which is why fabric underlays run jumbo MTUs.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13A,
    stem: 'Which two statements about the SD-Access underlay are true? (Choose two.)',
    options: ['Catalyst Center LAN automation builds the underlay with IS-IS', 'Intermediate nodes route between RLOC loopbacks without LISP or VN configuration', 'STP blocks redundant links between fabric devices in the underlay', 'Each VN\'s endpoint subnets are advertised in the underlay IGP', 'The underlay MTU must equal the endpoints\' 1500-byte MTU'],
    answer: [0, 1],
    explanation: 'LAN automation discovers and configures underlay devices with IS-IS (its settings include an IS-IS domain password). Intermediate nodes only route the outer packets between loopbacks. The underlay is a routed design, so there is no STP between fabric devices; redundancy comes from ECMP. Endpoint subnets live in the overlay (registered in LISP and carried in VXLAN), not in the underlay IGP. VXLAN adds 50 bytes, so the underlay MTU must be larger than the endpoint MTU.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit. R2 is the fusion router on an IP transit; the DHCP server 10.99.99.10 is in VRF SHARED. Endpoints in fabric VN CAMPUS cannot obtain addresses. What is the cause?',
    exhibit: `R2#show ip route vrf CAMPUS | begin Gateway
Gateway of last resort is not set

      10.0.0.0/24 is subnetted, 2 subnets
B        10.10.10.0 [20/0] via 172.16.255.1, 2d03h
B        10.10.20.0 [20/0] via 172.16.255.1, 2d03h
      172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C        172.16.255.0/30 is directly connected, GigabitEthernet0/0/1.3001
L        172.16.255.2/32 is directly connected, GigabitEthernet0/0/1.3001

R2#show ip route vrf SHARED | begin Gateway
Gateway of last resort is not set

      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.99.99.0/24 is directly connected, GigabitEthernet0/0/2
L        10.99.99.1/32 is directly connected, GigabitEthernet0/0/2`,
    options: ['R2 does not leak routes between VRF CAMPUS and VRF SHARED', 'The eBGP session between the border and R2 in VRF CAMPUS is down', 'The border node is not advertising the fabric subnets of VN CAMPUS', 'DHCP servers must be inside the fabric because DHCP cannot cross a border node'],
    answer: [0],
    explanation: 'VRF CAMPUS has the fabric subnets but no route to 10.99.99.0/24, and VRF SHARED has no route back to 10.10.10.0/24 or 10.10.20.0/24, so nothing is leaked between them on the fusion router. Leaking (for example with route-target import and export or a route policy) gives each VN reach to shared services. The BGP session is up, since the `B` routes learned from 172.16.255.1 are present, which also shows that the border advertises the fabric subnets. Shared services outside the fabric are the normal design; reaching them is the job of the border and fusion device.' },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L13B,
    stem: 'Refer to the exhibit. During migration, a Layer 2 handoff on the border maps the fabric subnet 10.10.20.0/24 (anycast gateway 10.10.20.1) to VLAN 20 on DSW1\'s trunk. Hosts on VLAN 20 now see two different MAC addresses answering ARP for 10.10.20.1. What must the engineer do?',
    exhibit: `DSW1#show running-config interface Vlan20
interface Vlan20
 ip address 10.10.20.2 255.255.255.0
 standby 20 ip 10.10.20.1
 standby 20 priority 110
 standby 20 preempt`,
    options: ['Shut down the Vlan20 gateway (SVI and HSRP group) on the traditional distribution switches so that the fabric anycast gateway is the only gateway', 'Change the external VLAN ID so that it matches the internal fabric VLAN ID', 'Configure HSRP on the border node for 10.10.20.1', 'Add a second Layer 2 handoff on another border for redundancy'],
    answer: [0],
    explanation: 'With a Layer 2 handoff the traditional VLAN and the fabric subnet are one broadcast domain that uses the fabric anycast gateway. DSW1 still answers for 10.10.20.1 with the HSRP virtual MAC, so there are two gateways for the same address; the old SVI and HSRP group must be removed. The internal and external VLAN IDs may differ by design. Fabric edges provide the gateway, not an FHRP on the border. A second Layer 2 handoff for the same VLAN creates a Layer 2 loop between the fabric and the traditional network.' },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13B,
    stem: 'A firewall outside the fabric cannot read inline SGTs but must enforce rules by scalable group. Enter the acronym of the TCP-based protocol that sends IP-to-SGT bindings to such devices.',
    answer: ['SXP', 'SGT Exchange Protocol'],
    explanation: 'SXP (SGT Exchange Protocol) sends IP-to-SGT bindings over a TCP connection to devices that cannot carry the tag inline in hardware. Inline tagging (Cisco Meta Data in the Ethernet frame) is the alternative when both ends support it; inside the fabric the SGT rides in the VXLAN Group Policy ID.' },

  // ---------- 1.4 QoS ----------
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. Enter the DSCP name (for example, af11 or cs3) of the packets in this flow record.',
    exhibit: `R1#show flow monitor FNF-MON cache format record
  IPV4 SOURCE ADDRESS:       10.1.10.25
  IPV4 DESTINATION ADDRESS:  10.2.20.40
  TRNS SOURCE PORT:          50122
  TRNS DESTINATION PORT:     5004
  IP TOS:                    0x88
  IP PROTOCOL:               17
  counter bytes:             1840220`,
    answer: ['af41', 'dscp af41'],
    explanation: 'The ToS byte is 0x88 = 136 = binary 1000 1000. The DSCP is the upper six bits, 100010 = 34 (136 / 4), which RFC 2597 defines as AF41; the low two ECN bits are 00. AF41 is the RFC 4594 marking for multimedia conferencing, which fits an RTP flow on UDP.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. Video endpoints send traffic marked AF41 and CS4 through R1, but the VIDEO class counts no packets. Why?',
    exhibit: `class-map match-all VIDEO
 match dscp af41
 match dscp cs4
!
R1#show policy-map interface GigabitEthernet0/0/1 output | section VIDEO
    Class-map: VIDEO (match-all)
      0 packets, 0 bytes
      30 second offered rate 0000 bps, drop rate 0000 bps
      Match:  dscp af41 (34)
      Match:  dscp cs4 (32)
      Queueing
      queue limit 64 packets
      (queue depth/total drops/no-buffer drops) 0/0/0
      (pkts output/bytes output) 0/0
      bandwidth remaining 30%`,
    options: ['match-all requires a packet to match both lines, and a packet cannot carry AF41 and CS4 at the same time', 'The policy is applied in the output direction, where classification is not possible', 'DSCP cs4 is not a valid match value on IOS XE', 'bandwidth remaining requires a priority class in the same policy-map'],
    answer: [0],
    explanation: 'With `match-all` every `match` statement must be true for the same packet. A packet has one DSCP, so it cannot be both AF41 (34) and CS4 (32), and the class matches nothing. `class-map match-any VIDEO` (or one line `match dscp af41 cs4`) fixes it. Output policies classify normally. CS4 is a valid class selector value. `bandwidth remaining` works with or without a priority class.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. Branch IP phones use addresses in 10.20.0.0/16 and mark voice EF. Voice from the branches is not getting priority on R1. Why?',
    exhibit: `ip access-list extended BRANCH-NETS
 permit ip 10.20.0.0 0.0.255.255 any
class-map match-any BRANCH-DATA
 match access-group name BRANCH-NETS
class-map match-any VOICE
 match dscp ef
policy-map WAN-OUT
 class BRANCH-DATA
  bandwidth percent 40
 class VOICE
  priority percent 10
!
interface GigabitEthernet0/0/1
 service-policy output WAN-OUT`,
    options: ['Classes are evaluated in order and the first match wins, so branch voice matches BRANCH-DATA before VOICE is checked', 'A priority class must be configured under class-default', 'match-any in VOICE allows voice packets to skip the priority queue', 'bandwidth percent and priority percent cannot be used in the same policy-map'],
    answer: [0],
    explanation: 'A packet is placed in the first class it matches. Branch phones are inside 10.20.0.0/16, so their EF packets match BRANCH-DATA and get a CBWFQ share instead of the priority queue. Moving VOICE above BRANCH-DATA fixes it. Priority is configured in a user-defined class, not class-default. `match-any` with one line behaves the same as `match-all`. Mixing `priority percent` with `bandwidth percent` is the normal LLQ design.' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14B,
    stem: 'Refer to the exhibit. Enter the shaper\'s Tc (time interval) in milliseconds.',
    exhibit: `      Queueing
      queue limit 83 packets
      (queue depth/total drops/no-buffer drops) 0/0/0
      (pkts output/bytes output) 4471220/2895011400
      shape (average) cir 20000000, bc 80000, be 80000
      target shape rate 20000000`,
    answer: ['4', '4 ms', '4ms'],
    explanation: 'Tc = Bc / CIR. A shaper\'s Bc is in bits: 80,000 bits / 20,000,000 bps = 0.004 s = 4 ms. The shaper may send Bc bits in every 4 ms interval (plus Be after idle intervals).' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14B,
    stem: 'Refer to the exhibit. Users report choppy audio during the busy hour on the WAN link. What is the cause?',
    exhibit: `R1#show policy-map interface GigabitEthernet0/0/1 output | section VOICE
        Class-map: VOICE (match-any)
          1844290 packets, 368858000 bytes
          30 second offered rate 3150000 bps, drop rate 1150000 bps
          Match:  dscp ef (46)
          Priority: 2000 kbps, burst bytes 50000, b/w exceed drops: 412877`,
    options: ['The priority class is limited to 2,000 kbps during congestion, but about 3.15 Mbps of voice is offered, so the excess is dropped', 'Voice packets are not being classified, because DSCP EF does not match RTP', 'WRED in the VOICE class is dropping packets early', 'The priority queue has no bandwidth guarantee, so voice waits behind the other classes'],
    answer: [0],
    explanation: 'A `priority` with a rate includes a conditional policer that is active during congestion. The class is offered 3.15 Mbps but allowed 2 Mbps, and the `b/w exceed drops` counter and 1.15 Mbps drop rate show the excess being discarded. Increase the priority rate (or use call admission control). The packet counters prove voice is classified. No WRED is configured in the class (WRED should never be used on voice). The priority queue is served before every other queue, so voice does not wait behind them.' },
  { topic: '1.4', type: 'multi', difficulty: 2, lesson: L14B,
    stem: 'Which two statements correctly compare policing and shaping on IOS XE? (Choose two.)',
    options: ['Shaping buffers excess traffic and sends it later, which adds delay', 'Policing can be applied in the input direction', 'Shaping can be applied in the input direction to slow down received traffic', 'Policing buffers excess traffic until tokens become available', 'Shaping re-marks excess traffic with a lower DSCP by default'],
    answer: [0, 1],
    explanation: 'A shaper queues excess packets and releases them as tokens allow, smoothing the rate at the cost of delay; it works only on output. A policer acts immediately (transmit, drop or re-mark) and can be applied on input or output. A policer has no buffer. Re-marking is a policer action (`set-dscp-transmit`), not something a shaper does.' },
  { topic: '1.4', type: 'order', difficulty: 2, lesson: L14B,
    stem: 'An engineer must give voice strict priority inside a 50 Mbps WAN service delivered on a 1 Gbps port. Put the configuration and verification steps in order.',
    items: [
      'Create class-maps VOICE and VIDEO that match dscp ef and dscp af41',
      'Create policy-map WAN-CHILD with priority for VOICE and bandwidth remaining for VIDEO and class-default',
      'Create policy-map WAN-PARENT with class class-default, shape average 50000000 and service-policy WAN-CHILD',
      'Apply service-policy output WAN-PARENT to the WAN interface',
      'Run show policy-map interface to confirm the shaper and the child class counters',
    ],
    explanation: 'MQC builds from the bottom up: the classes a policy references must exist first, the child policy must exist before the parent nests it with `service-policy`, and only the top-level parent is attached to the interface in the output direction. Verification comes last. The parent shaper is what creates congestion at 50 Mbps, so the child queuing has something to act on.' },
  { topic: '1.4', type: 'match', difficulty: 3, lesson: L14B,
    stem: 'Match each observation in show policy-map interface to its most likely cause.',
    pairs: [
      ['Class VIDEO counts 0 packets while video calls are active; it is match-all with match dscp af41 and match dscp cs4', 'Mutually exclusive criteria in a match-all class'],
      ['The VOICE priority class shows b/w exceed drops climbing during the busy hour', 'Priority rate too low for the offered voice load'],
      ['BULK shows many random drops and almost no tail drops', 'WRED dropping early between its thresholds'],
      ['Only Service-policy input appears for the interface', 'No policy attached in the output direction'],
      ['A policer shows many exceeded packets and users report sawtooth TCP throughput', 'Policing drops bursts that shaping would buffer'],
    ],
    explanation: 'A match-all class with two different DSCP values can never match. Exceed drops in a priority class come from its conditional policer when more traffic arrives than the configured rate. Random drops are WRED working as designed while the average queue depth is between the minimum and maximum thresholds; tail drops would mean the queue is full. If no output policy is listed, none is attached in that direction, so no queuing happens on egress. Policers drop excess immediately, which makes TCP back off repeatedly; a shaper would buffer and smooth the bursts.' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14B,
    stem: 'Refer to the exhibit. During congestion, what rate in kbps does the conditional policer of the VOICE priority class allow? Enter a number.',
    exhibit: `policy-map WAN-CHILD
 class VOICE
  priority percent 20
 class class-default
  fair-queue
!
policy-map WAN-PARENT
 class class-default
  shape average 30000000
  service-policy WAN-CHILD
!
interface GigabitEthernet0/0/1
 service-policy output WAN-PARENT`,
    answer: ['6000', '6000 kbps'],
    explanation: 'In a child policy under a shaper, percentages are taken from the parent shape rate: 20 % of 30,000,000 bps = 6,000,000 bps = 6,000 kbps. `show policy-map interface` would show it as `Priority: 20% (6000 kbps)`. The 1 Gbps (or other) physical rate of the interface is not the reference once the parent shapes.' },
  { topic: '1.4', type: 'single', difficulty: 3, lesson: L14B,
    stem: 'Refer to the exhibit. A video stream arrives on the interface at a steady 15 Mbps, all marked AF41. What happens to it?',
    exhibit: `policy-map VIDEO-IN
 class VIDEO
  police cir 10000000 pir 20000000
   conform-action transmit
   exceed-action set-dscp-transmit af42
   violate-action drop
!
interface GigabitEthernet1/0/1
 service-policy input VIDEO-IN`,
    options: ['About 10 Mbps is sent unchanged as AF41 and about 5 Mbps is re-marked AF42 and sent; nothing is dropped', 'About 10 Mbps is sent and about 5 Mbps is dropped', 'All 15 Mbps is re-marked AF42 because the stream exceeds the CIR', 'The stream is buffered and sent at 10 Mbps'],
    answer: [0],
    explanation: 'This is a two-rate three-color policer (RFC 2698). Traffic up to the CIR (10 Mbps) conforms and is transmitted unchanged; traffic above the CIR but within the PIR (20 Mbps) exceeds and is re-marked AF42 (higher drop precedence in the same AF class) and transmitted; only traffic above the PIR violates and is dropped. At 15 Mbps nothing reaches the PIR, so nothing is dropped. Policers never buffer; that would be shaping, which is output-only anyway.' },
  { topic: '1.4', type: 'multi', difficulty: 1, lesson: L14A,
    stem: 'Which two statements about DSCP values are true? (Choose two.)',
    options: ['AF31 has the decimal value 26', 'Within the AF2x class, AF23 packets are dropped before AF21 packets during congestion', 'EF has the decimal value 40', 'AF41 has a higher drop precedence than AF43', 'CS3 is binary 011010'],
    answer: [0, 1],
    explanation: 'AFxy = 8x + 2y, so AF31 = 24 + 2 = 26. RFC 2597 drop precedence rises with y, so AF23 is dropped before AF22 and AF21. EF is 46 (101110, RFC 3246); 40 is CS5. AF41 has the lowest drop precedence in its class and AF43 the highest. CS3 is 011000 (24); 011010 is AF31.' },
  { topic: '1.4', type: 'single', difficulty: 3, lesson: L14B,
    stem: 'Refer to the exhibit. The class uses DSCP-based WRED. The average queue depth is currently 26 packets. Which traffic is subject to random drops?',
    exhibit: `            dscp       Transmitted         Random drop      Tail drop          Minimum        Maximum     Mark
                    pkts/bytes            pkts/bytes       pkts/bytes          thresh         thresh     prob
            af11      220145/220145000        0/0              0/0                 32             40        1/10
            af12       98340/98340000         0/0              0/0                 28             40        1/10
            af13       51022/51022000      1043/1043000        0/0                 24             40        1/10`,
    options: ['Only AF13, because 26 is above its minimum threshold and below the AF11 and AF12 minimum thresholds', 'AF11, AF12 and AF13 equally, because they share one queue', 'Only AF11, because it has the highest minimum threshold', 'None, because the average depth is below every maximum threshold'],
    answer: [0],
    explanation: 'WRED does not drop a given DSCP while the average depth is below that DSCP\'s minimum threshold; between minimum and maximum it drops randomly with increasing probability. At 26 packets only AF13 (minimum 24) is in its random-drop range; AF12 (28) and AF11 (32) are not yet. That is how DSCP-based WRED implements AF drop precedence: AF13 is dropped first. They share a queue but not thresholds. Random drops happen between the thresholds, so being below the maximum does not prevent them.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. Where should the trust boundary be placed?',
    exhibit: `PC --- Cisco IP phone --- Gi1/0/5 ASW1 --- DSW1 --- R1 --- WAN
The phone marks voice EF and call signaling CS3.
Some applications on the PC also mark their traffic EF.`,
    options: ['On ASW1 Gi1/0/5, trusting the phone\'s markings when a Cisco phone is detected and re-marking traffic from the PC', 'On R1\'s WAN interface, where congestion occurs', 'On DSW1, so that the access switch does not need a QoS policy', 'On the PC, by trusting all markings that applications set'],
    answer: [0],
    explanation: 'Classify and mark as close to the source as possible, and do not trust endpoints that users control. The access port is the first device the network controls; it can extend trust to a detected Cisco phone and re-mark PC traffic, so PC applications cannot claim EF. Trusting at R1 or DSW1 means untrusted EF from the PC has already crossed the access and distribution links. Trusting the PC is exactly the abuse the trust boundary prevents.' },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
