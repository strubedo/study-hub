// Domain 1 — Models, Ethernet and the IPv4 Header. Original questions; facts checked against RFCs 791, 826, 894, 1122, 2474, 3168, 5227 and IANA registries.
const L11 = '1.1-osi-tcpip-encapsulation';
const L12A = '1.2-ethernet-frame-mac';
const L12B = '1.2-switching-mtu-vlan-domains';
const L13 = '1.3-arp';
const L14A = '1.4-ipv4-header-layout';
const L14B = '1.4-fragmentation-ttl-protocol-checksum';

const bank = [
  // ---------- 1.1 ----------
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11,
    stem: 'Which TCP/IP (RFC 1122) layer covers the functions of OSI layers 5, 6 and 7?',
    options: ['Transport', 'Internet', 'Application', 'Link'],
    answer: [2],
    explanation: 'The TCP/IP model has a single application layer that includes session, presentation and application functions. Transport is OSI 4, Internet is OSI 3, and Link covers OSI 1 and 2.' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11,
    stem: 'How many layers does the TCP/IP model described in RFC 1122 have (link, internet, transport and application)? Enter the number.',
    answer: ['4', 'four'],
    explanation: 'RFC 1122 describes a link layer, an internet (IP) layer, a transport layer and an application layer: four. Five-layer versions that split the link layer into physical and data link are a teaching convenience, and OSI has seven.' },
  { topic: '1.1', type: 'match', difficulty: 1, lesson: L11,
    stem: 'Match each layer or protocol to the usual name of its PDU.',
    pairs: [['Ethernet (layer 2)', 'Frame'], ['IPv4 (layer 3)', 'Packet'], ['TCP (layer 4)', 'Segment'], ['UDP (layer 4)', 'Datagram']],
    explanation: 'Layer 2 PDUs are frames, layer 3 PDUs are packets (RFC 791 formally says datagram), a TCP header plus data is a segment, and UDP carries user datagrams.' },
  { topic: '1.1', type: 'order', difficulty: 1, lesson: L11,
    stem: 'Put the stages of sending a web request in the order in which a host performs them (first stage at the top).',
    items: ['The application produces the HTTP request data', 'TCP adds its header, creating a segment', 'IPv4 adds its header, creating a packet', 'Ethernet adds a header and FCS, creating a frame', 'The NIC transmits the frame as bits'],
    explanation: 'Encapsulation proceeds down the stack: application data, then TCP segment, IP packet, Ethernet frame (the only layer that also adds a trailer, the FCS), and finally physical transmission.' },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L11,
    stem: 'A packet is routed across one router with no NAT. Which two values are the same on both sides of the router? (Choose two.)',
    options: ['IPv4 source address', 'Ethernet destination MAC address', 'IPv4 TTL', 'TCP destination port', 'Ethernet FCS'],
    answer: [0, 3],
    explanation: 'Without NAT the IP addresses and the TCP/UDP ports are end-to-end. The destination (and source) MAC, the FCS (recomputed for the new frame) and the TTL (decremented) all change at each hop.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Host 192.0.2.10 pings 198.51.100.7 on another network. Which device owns MAC address 00:50:56:aa:bb:cc?',
    exhibit: `$ ip route
default via 192.0.2.1 dev eth0
192.0.2.0/24 dev eth0 proto kernel scope link src 192.0.2.10

$ sudo tcpdump -nn -e -c 1 -i eth0 icmp
10:15:02.114 00:1a:2b:3c:4d:5e > 00:50:56:aa:bb:cc, ethertype IPv4 (0x0800), length 98:
    192.0.2.10 > 198.51.100.7: ICMP echo request, id 7, seq 1, length 64`,
    options: ['The destination host 198.51.100.7', 'The default gateway 192.0.2.1', 'A DNS server', 'The local switch'],
    answer: [1],
    explanation: 'The destination is off-link, so the frame is addressed to the next hop: the default gateway from the routing table. The IP destination stays 198.51.100.7, but the MAC is the router interface. The switch forwards frames without owning the MAC, and DNS is not involved in an IP ping.' },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11,
    stem: 'A conventional Ethernet switch makes its forwarding decision using which information?',
    options: ['The destination IPv4 address', 'The destination MAC address (and VLAN)', 'The TCP destination port', 'The IPv4 protocol field'],
    answer: [1],
    explanation: 'A layer 2 switch forwards on destination MAC address within a VLAN. IP addresses are used by routers or layer 3 switches, and ports and protocol numbers by firewalls and filters.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'A stateful packet-filtering firewall that tracks connections by addresses, protocol and ports mainly examines which OSI layers?',
    options: ['Layers 1 and 2', 'Layers 2 and 3', 'Layers 3 and 4', 'Layers 5 and 6'],
    answer: [2],
    explanation: 'Addresses are layer 3 and protocol, ports and connection state are layer 4. Application-aware (next-generation) firewalls go further up to layer 7, but a plain stateful filter does not.' },

  // ---------- 1.2 ----------
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12A,
    stem: 'What is the minimum size, in bytes, of an Ethernet frame including the FCS? Enter the number.',
    answer: ['64'],
    explanation: '14 bytes of header + 46 bytes of minimum payload + 4 bytes FCS = 64. Shorter payloads are padded. Captures often show 60 because the NIC strips the FCS.' },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12B,
    stem: 'What is the standard Ethernet MTU in bytes? Enter the number.',
    answer: ['1500'],
    explanation: 'The MTU is the largest layer 3 packet a link carries, which is the maximum Ethernet payload: 1500 bytes. The header and FCS are not counted in the MTU.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'What is the maximum size of a standard untagged Ethernet II frame, counting from the destination MAC through the FCS?',
    options: ['1500 bytes', '1514 bytes', '1518 bytes', '1522 bytes'],
    answer: [2],
    explanation: '14-byte header + 1500-byte payload + 4-byte FCS = 1518. 1514 is the same frame without the FCS (as many tools display it), 1500 is the payload limit (MTU), and 1522 is the maximum with one 802.1Q tag.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12B,
    stem: 'A frame on a trunk carries one 802.1Q tag. What is the maximum frame size, including the FCS, and what is the payload limit?',
    options: ['1518 bytes frame, 1496 bytes payload', '1522 bytes frame, 1500 bytes payload', '1522 bytes frame, 1496 bytes payload', '1526 bytes frame, 1500 bytes payload'],
    answer: [1],
    explanation: 'The 4-byte tag lengthens the frame to 1522 bytes; the payload limit (MTU) stays 1500. The tag does not reduce the MTU on 802.1Q-aware hardware.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. Which MAC address is a locally administered unicast address?',
    exhibit: `A  00:1a:2b:3c:4d:5e
B  02:42:ac:11:00:02
C  01:00:5e:00:00:fb
D  ff:ff:ff:ff:ff:ff`,
    options: ['A', 'B', 'C', 'D'],
    answer: [1],
    explanation: 'The first octet 0x02 = 0000 0010 has I/G = 0 (unicast) and U/L = 1 (locally administered). 0x00 is unicast and universal. 0x01 has the group bit set (IPv4 multicast). 0xff sets every bit, so it is the broadcast address (a group address, and also locally administered by bit value, but not unicast).' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12A,
    stem: 'What Ethernet destination MAC address does a host use to send to the IPv4 multicast group 224.0.0.251? (Colon-separated lowercase hex.)',
    answer: ['01:00:5e:00:00:fb', '01-00-5e-00-00-fb', '0100.5e00.00fb'],
    explanation: 'IPv4 multicast MACs are 01:00:5e followed by a zero bit and the low 23 bits of the group address. 224.0.0.251 ends in 0.0.251, and 251 = 0xfb, giving 01:00:5e:00:00:fb.' },
  { topic: '1.2', type: 'match', difficulty: 1, lesson: L12A,
    stem: 'Match each EtherType value to the protocol it identifies.',
    pairs: [['0x0800', 'IPv4'], ['0x0806', 'ARP'], ['0x86DD', 'IPv6'], ['0x8100', '802.1Q VLAN tag']],
    explanation: 'These are the IANA-assigned EtherTypes. Values of 0x0600 and above are types; values of 1500 or less in that field are 802.3 lengths.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12B,
    stem: 'Refer to the exhibit. VLAN 10 on the switch has the table shown. A frame to 0050.56aa.bbcc arrives on Gi1/0/3 in VLAN 10. What does the switch do?',
    exhibit: `Switch# show mac address-table vlan 10
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    001a.2b3c.4d5e    DYNAMIC     Gi1/0/3
  10    0050.56aa.bbcc    DYNAMIC     Gi1/0/24`,
    options: ['Floods the frame out all other ports in VLAN 10', 'Forwards the frame out Gi1/0/24 only', 'Drops the frame because the destination is on another port', 'Sends the frame back out Gi1/0/3'],
    answer: [1],
    explanation: 'The destination MAC is a known unicast entry on Gi1/0/24, so the frame is forwarded only there. Flooding is for unknown unicast and broadcast; a frame is filtered only when the destination is on the ingress port; a switch never sends a frame back out its ingress port.' },
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L12B,
    stem: 'A switch receives a unicast frame whose destination MAC is not in its table for that VLAN. What does it do?',
    options: ['Drops the frame', 'Sends an ARP request for the destination', 'Floods the frame out every other port in the VLAN', 'Sends the frame to the default gateway only'],
    answer: [2],
    explanation: 'Unknown unicast is flooded to all other ports in the VLAN. The switch does not drop it, does not send ARP (switches do not originate ARP for forwarding), and does not know about default gateways.' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12B,
    stem: 'A 24-port switch has every port in use by a host. Ports 1-8 are in VLAN 10, ports 9-16 in VLAN 20 and ports 17-24 in VLAN 30; none is trunked. How many broadcast domains exist on this switch? Enter the number.',
    answer: ['3', 'three'],
    explanation: 'Each VLAN is its own broadcast domain, so there are three. (There are also 24 collision domains, one per full-duplex switch port, but the question asks about broadcast domains.)' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12B,
    stem: 'Which two statements about the IEEE 802.1Q tag are true? (Choose two.)',
    options: ['It is 4 bytes and is inserted after the source MAC address', 'Its TPID value is 0x8100', 'Its VLAN ID field is 8 bits wide', 'It is appended after the FCS', 'It reduces the Ethernet MTU to 1496 bytes on all hardware'],
    answer: [0, 1],
    explanation: 'The tag is 4 bytes (TPID 0x8100, 3-bit PCP, 1-bit DEI, 12-bit VID) placed between the source MAC and the original EtherType. The VID is 12 bits, not 8. It is not placed after the FCS, and the MTU remains 1500 because the maximum frame grows to 1522.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12B,
    stem: 'A network team wants to use 9000-byte jumbo frames between two servers through three switches. What is required?',
    options: ['Nothing; IEEE 802.3 standardises 9000 bytes and all switches support it', 'Every interface and switch port in the path must be configured for the larger MTU', 'Only the two server NICs need changing', 'The IPv4 DF bit must be cleared on every packet'],
    answer: [1],
    explanation: 'Jumbo frames are a vendor-supported extension, not part of the IEEE standard, and any device in the path with a smaller MTU drops or fragments large packets. Changing only the NICs creates a black hole at the first smaller-MTU port; the DF bit is unrelated to enabling jumbo frames.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'A receiving NIC computes the CRC-32 of an arriving frame and it does not match the FCS. What happens?',
    options: ['Ethernet requests retransmission from the sender', 'The frame is silently discarded and an error counter increments', 'The frame is passed up with a warning flag', 'The NIC sends an ICMP error to the sender'],
    answer: [1],
    explanation: 'Ethernet has no retransmission. A bad frame is discarded and counted (CRC errors); higher layers such as TCP recover the loss. ICMP is a layer 3 protocol that a NIC does not generate.' },

  // ---------- 1.3 ----------
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13,
    stem: 'What is the ARP operation (opcode) value in an ARP reply? Enter the number.',
    answer: ['2'],
    explanation: 'RFC 826 defines opcode 1 for a request and 2 for a reply. Opcodes 3 and 4 belong to RARP.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13,
    stem: 'Which Linux iproute2 command lists the ARP (neighbour) cache? Enter the command.',
    answer: ['ip neigh', 'ip neighbor', 'ip neighbour', 'ip n'],
    explanation: '`ip neigh` (or `ip neighbor`) shows IPv4 ARP and IPv6 neighbour entries on Linux. The older net-tools equivalent is `arp -n`; Windows uses `arp -a`.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13,
    stem: 'What is the EtherType value used by ARP? Enter it in hexadecimal with the 0x prefix.',
    answer: ['0x0806', '0806', '806', '0x806'],
    explanation: 'ARP frames carry EtherType 0x0806. IPv4 is 0x0800 and IPv6 is 0x86DD.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13,
    stem: 'Refer to the exhibit. What is the host at 192.0.2.10 trying to learn?',
    exhibit: `Ethernet II, Src: 00:1a:2b:3c:4d:5e, Dst: ff:ff:ff:ff:ff:ff
Address Resolution Protocol (request)
    Hardware type: Ethernet (1)       Protocol type: IPv4 (0x0800)
    Hardware size: 6                  Protocol size: 4
    Opcode: request (1)
    Sender MAC address: 00:1a:2b:3c:4d:5e
    Sender IP address: 192.0.2.10
    Target MAC address: 00:00:00:00:00:00
    Target IP address: 192.0.2.1`,
    options: ['Its own MAC address', 'The IP address that belongs to 00:00:00:00:00:00', 'The MAC address of the host with IP 192.0.2.1', 'Whether 192.0.2.10 is already in use'],
    answer: [2],
    explanation: 'This is a normal request: the target MAC is an unused placeholder and the target IP is the address to resolve. A duplicate-address check would be a probe with sender IP 0.0.0.0, and ARP never maps a MAC back to an IP (that was RARP).' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13,
    stem: 'Refer to the exhibit. Host 192.0.2.10/24 (gateway 192.0.2.1) runs ping 198.51.100.7. Which IP address will appear in the Target IP field of its ARP request?',
    exhibit: `$ ip addr show eth0 | grep inet
    inet 192.0.2.10/24 brd 192.0.2.255 scope global eth0
$ ip route
default via 192.0.2.1 dev eth0`,
    options: ['198.51.100.7', '192.0.2.1', '192.0.2.255', '0.0.0.0'],
    answer: [1],
    explanation: 'The destination is outside 192.0.2.0/24, so the host resolves the next hop, the default gateway 192.0.2.1. ARP is link-local and cannot resolve a remote host. 192.0.2.255 is the subnet broadcast and 0.0.0.0 appears only as the sender IP of a probe.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13,
    stem: 'Refer to the exhibit. What does this ARP packet represent?',
    exhibit: `Opcode: request (1)
Sender MAC address: 00:1a:2b:3c:4d:5e
Sender IP address: 192.0.2.10
Target MAC address: 00:00:00:00:00:00
Target IP address: 192.0.2.10`,
    options: ['A reply to a previous request', 'An ARP probe checking for conflicts', 'A gratuitous ARP (RFC 5227 announcement)', 'A proxy ARP response'],
    answer: [2],
    explanation: 'Sender and target IP are the same address, so the host is announcing its own IP-to-MAC mapping. A probe would use sender IP 0.0.0.0. A reply would have opcode 2, and a proxy ARP response is a reply from a router.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13,
    stem: 'Refer to the exhibit. In this RFC 5227 ARP probe for 192.0.2.50, which value belongs in the blank (Sender IP address)?',
    exhibit: `Opcode: request (1)
Sender MAC address: 00:1a:2b:3c:4d:5e
Sender IP address: ______
Target MAC address: 00:00:00:00:00:00
Target IP address: 192.0.2.50`,
    options: ['The address being tested', '255.255.255.255', '0.0.0.0', 'The default gateway address'],
    answer: [2],
    explanation: 'The probe uses sender IP 0.0.0.0 so that no neighbour caches a mapping for the address that is still unproven, while the target IP is the address being tested.' },
  { topic: '1.3', type: 'order', difficulty: 3, lesson: L13,
    stem: 'Order the steps a host takes under RFC 5227 when it is assigned a new IPv4 address.',
    items: ['Wait a random delay of up to 1 second', 'Send 3 ARP probes with sender IP 0.0.0.0, spaced 1 to 2 seconds apart', 'Wait 2 seconds with no conflict seen', 'Send 2 ARP announcements 2 seconds apart', 'Use the address normally'],
    explanation: 'RFC 5227 uses PROBE_WAIT (1 s random), PROBE_NUM 3 with PROBE_MIN 1 s and PROBE_MAX 2 s, then ANNOUNCE_WAIT 2 s, then ANNOUNCE_NUM 2 at ANNOUNCE_INTERVAL 2 s. A conflict seen at any point means the address must not be used.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13,
    stem: 'A router has proxy ARP enabled. A misconfigured host with a /16 mask ARPs for a host on a different subnet that sits behind the router. What does the router answer?',
    options: ['Nothing, because ARP is never answered across subnets', 'An ARP reply giving the router\'s own MAC address', 'An ARP reply giving the remote host\'s real MAC address', 'An ICMP redirect only'],
    answer: [1],
    explanation: 'With proxy ARP the router replies on behalf of the remote host with its own MAC, so the host sends the frame to the router, which routes it. The router does not know the remote host\'s MAC on another link, and ICMP redirects are a separate mechanism.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13,
    stem: 'Which two measures help defend a LAN against ARP spoofing? (Choose two.)',
    options: ['Dynamic ARP Inspection with DHCP snooping bindings', 'Static ARP entries for critical hosts such as the gateway', 'Enabling proxy ARP on all router interfaces', 'Increasing the ARP cache timeout', 'Enabling BPDU guard'],
    answer: [0, 1],
    explanation: 'DAI drops ARP packets whose sender mapping does not match the snooping binding table, and static entries cannot be overwritten by forged replies. Proxy ARP creates more ARP replies, a longer timeout only makes bad entries last longer, and BPDU guard protects spanning tree.' },

  // ---------- 1.4 ----------
  { topic: '1.4', type: 'fill', difficulty: 1, lesson: L14A,
    stem: 'What is the value of the IHL field for an IPv4 header with no options? Enter the number.',
    answer: ['5'],
    explanation: 'IHL counts 32-bit words: 5 x 4 = 20 bytes, the minimum header. The maximum is 15 (60 bytes).' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. How many bytes of payload follow the IP header in this packet? Enter the number.',
    exhibit: `IPv4 header, first four bytes: 46 00 00 3c
(Version/IHL = 0x46, DSCP/ECN = 0x00, Total length = 0x003c)`,
    answer: ['36'],
    explanation: 'IHL 6 means a 6 x 4 = 24-byte header (4 bytes of options). Total length 0x3c = 60. Payload = 60 - 24 = 36 bytes.' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. What is the DSCP value, in decimal, of this packet?',
    exhibit: `10:20:41.003 IP (tos 0xb8, ttl 63, id 20118, offset 0, flags [DF], proto UDP (17), length 200)
    192.0.2.10.16384 > 203.0.113.5.16384: UDP, length 172`,
    answer: ['46'],
    explanation: '0xb8 = 1011 1000. The top six bits 101110 are DSCP = 46 (EF, used for voice), and the low two bits 00 mean Not-ECT.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14A,
    stem: 'Refer to the exhibit. What does the ToS byte indicate?',
    exhibit: `IP (tos 0x3, ttl 60, id 5521, offset 0, flags [DF], proto TCP (6), length 1500)
    203.0.113.5.443 > 192.0.2.10.51514: Flags [.], seq 1:1461, ack 1, win 501, length 1460`,
    options: ['DSCP 3, ECN not used', 'DSCP 0 and ECN 11: Congestion Experienced', 'DSCP 0 and ECN 01: ECT(1)', 'DSCP 0 and ECN 10: ECT(0)'],
    answer: [1],
    explanation: '0x03 has DSCP bits 000000 and ECN bits 11, which is CE: a router marked the packet instead of dropping it. ECT(1) is 01 and ECT(0) is 10; DSCP is the top six bits, not the low ones.' },
  { topic: '1.4', type: 'fill', difficulty: 3, lesson: L14B,
    stem: 'A host sends an IP datagram with a 20-byte header and 3980 bytes of data across a link with MTU 1500. What is the Fragment Offset field value (in 8-byte units) of the second fragment? Enter the number.',
    answer: ['185'],
    explanation: 'Each fragment can carry 1500 - 20 = 1480 data bytes, a multiple of 8. The second fragment starts at byte 1480, and 1480 / 8 = 185. The third fragment starts at 2960 (offset 370) with the last 1020 bytes.' },
  { topic: '1.4', type: 'single', difficulty: 3, lesson: L14B,
    stem: 'Refer to the exhibit. What kind of packet is this?',
    exhibit: `Internet Protocol Version 4, Src: 192.0.2.10, Dst: 203.0.113.5
    Identification: 0x4a21 (18977)
    Flags: More fragments set, Don't fragment not set
    Fragment offset: 185
    Time to live: 63
    Protocol: UDP (17)`,
    options: ['The first fragment of a datagram', 'A middle fragment starting at byte 1480 of the original data', 'The last fragment of a datagram', 'An unfragmented datagram'],
    answer: [1],
    explanation: 'MF is set, so more fragments follow, and the offset is non-zero, so it is not the first. Offset 185 x 8 = byte 1480. The last fragment would have MF clear, and an unfragmented datagram has MF = 0 and offset 0.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14B,
    stem: 'Refer to the exhibit. What does the router do with this transit packet (not addressed to the router)?',
    exhibit: `IP 192.0.2.10 > 198.51.100.7: ICMP echo request, ttl 1, length 84`,
    options: ['Forwards it with TTL 0', 'Discards it and sends ICMP time exceeded (type 11, code 0) to the source', 'Discards it silently', 'Forwards it and sends ICMP type 3 code 4'],
    answer: [1],
    explanation: 'A router must decrement TTL before forwarding; since that would reach 0, it drops the packet and returns Time Exceeded type 11 code 0. Traceroute relies on this. Type 3 code 4 is fragmentation needed with DF set.' },
  { topic: '1.4', type: 'match', difficulty: 2, lesson: L14B,
    stem: 'Match each IPv4 protocol number to the protocol it identifies.',
    pairs: [['6', 'TCP'], ['17', 'UDP'], ['47', 'GRE'], ['50', 'ESP'], ['89', 'OSPF']],
    explanation: 'IANA protocol numbers: TCP 6, UDP 17, GRE 47, ESP 50, OSPF 89. ICMP is 1. GRE, ESP and OSPF ride directly over IP and have no port numbers.' },
  { topic: '1.4', type: 'fill', difficulty: 1, lesson: L14B,
    stem: 'What IPv4 protocol number identifies ICMP? Enter the number.',
    answer: ['1'],
    explanation: 'ICMP is IP protocol 1. TCP is 6 and UDP is 17.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14B,
    stem: 'Refer to the exhibit. Assuming the sender used a common default initial TTL, which operating system most likely sent this reply, and roughly how many routers did it cross?',
    exhibit: `Reply from 203.0.113.9: bytes=32 time=21ms TTL=117`,
    options: ['Linux or macOS (64), crossing about 53 hops', 'Windows (128), crossing about 11 routers', 'A Cisco router (255), crossing about 138 hops', 'Windows (128), crossing about 117 routers'],
    answer: [1],
    explanation: 'The initial TTL must be at least 117, and the nearest common default above that is 128 (Windows), so about 128 - 117 = 11 routers decremented it. Linux defaults to 64, which cannot produce 117; the other options use impossible hop counts. This is an inference, not proof.' },
  { topic: '1.4', type: 'multi', difficulty: 2, lesson: L14B,
    stem: 'Which two IPv4 header fields must a router rewrite when it forwards a packet (with no NAT and no fragmentation)? (Choose two.)',
    options: ['TTL', 'Header checksum', 'Identification', 'Source address', 'Protocol'],
    answer: [0, 1],
    explanation: 'TTL is decremented, which changes the header checksum, so both are updated. Identification, addresses and protocol stay the same without NAT or fragmentation.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14B,
    stem: 'What does the IPv4 header checksum cover?',
    options: ['The IP header only', 'The IP header and the transport header', 'The entire IP packet including the payload', 'The Ethernet frame'],
    answer: [0],
    explanation: 'The IPv4 checksum protects only the IP header. TCP and UDP carry their own checksums over their data and a pseudo-header, and Ethernet has the FCS.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14B,
    stem: 'Refer to the exhibit. What does the router do with this packet?',
    exhibit: `Packet: IPv4 total length 1400, flags DF=1
Egress interface GigabitEthernet0/1: MTU 1300`,
    options: ['Fragments it into two packets', 'Drops it and sends ICMP type 3 code 4 (fragmentation needed and DF set)', 'Drops it silently', 'Clears DF and forwards it'],
    answer: [1],
    explanation: 'Routers must not fragment a packet with DF set. They drop it and return ICMP Destination Unreachable, code 4, which hosts use for path MTU discovery.' },
  { topic: '1.4', type: 'fill', difficulty: 1, lesson: L14A,
    stem: 'What is the maximum value of the IPv4 Total Length field, in bytes? Enter the number.',
    answer: ['65535'],
    explanation: 'The field is 16 bits wide, so the maximum is 2^16 - 1 = 65 535 bytes including the header.' },
  { topic: '1.4', type: 'single', difficulty: 1, lesson: L14A,
    stem: 'Which DSCP per-hop behaviour is conventionally used for voice traffic and is DSCP 46?',
    options: ['AF41', 'CS6', 'EF', 'CS1'],
    answer: [2],
    explanation: 'Expedited Forwarding is DSCP 46 (0xB8 as a whole ToS byte). AF41 is 34, CS6 is 48 (network control) and CS1 is 8 (scavenger).' },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
