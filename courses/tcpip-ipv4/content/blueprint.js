// TCP/IP IPv4 Fundamentals: a vendor-neutral course with no certification exam behind it.
// The outline is this site's own, built from the core RFCs (791 IPv4, 792 ICMP, 768 UDP, 9293 TCP, 826 ARP,
// 2131 DHCP, 1034/1035 DNS, 1918/6598/5737/3927 special addresses, 6890 special-purpose registry, 1812 router requirements).
// Domain `weight` sets how many questions the self-test draws from each domain.

export const EXAM = {
  code: 'Self-test',
  name: 'TCP/IP IPv4 final self-test',
  certification: 'None (skills course)',
  product: 'Vendor-neutral TCP/IP and IPv4',
  minutes: 60,
  questions: 50,
  scoring: 'Percent correct; 80% is this site\'s mastery mark.',
};

export const DOMAINS = [
  {
    id: 1, weight: 20, title: 'Models, Ethernet and the IPv4 Header', short: 'Models & header',
    topics: [
      { id: '1.1', verb: 'Explain', title: 'the OSI and TCP/IP models and encapsulation', sub: ['OSI seven layers vs the four-layer TCP/IP (RFC 1122) model', 'PDUs: frame, packet, segment, datagram', 'Encapsulation and decapsulation, headers and trailers', 'Where devices and protocols sit (hub, switch, router, firewall, host)'] },
      { id: '1.2', verb: 'Describe', title: 'Ethernet framing and MAC addressing', sub: ['Ethernet II frame fields, EtherType, FCS', 'MAC address format, OUI, unicast/multicast/broadcast bits, U/L bit', 'MAC learning, flooding and forwarding on a switch', 'MTU 1500, 802.1Q tag, jumbo frames', 'Collision vs broadcast domains'] },
      { id: '1.3', verb: 'Explain', title: 'ARP', keepCase: true, sub: ['ARP request/reply, frame format, EtherType 0x0806', 'ARP cache, aging, static entries', 'Local vs remote destination: ARP for the gateway', 'Gratuitous ARP, proxy ARP, ARP probes (duplicate address detection, RFC 5227)', 'ARP spoofing and mitigations'] },
      { id: '1.4', verb: 'Interpret', title: 'the IPv4 header', sub: ['Version, IHL, total length, options', 'DSCP and ECN (former ToS byte)', 'Identification, flags (DF, MF), fragment offset', 'TTL and hop limits', 'Protocol numbers (1 ICMP, 6 TCP, 17 UDP, 47 GRE, 50 ESP, 89 OSPF)', 'Header checksum, source and destination addresses'] },
    ],
  },
  {
    id: 2, weight: 30, title: 'IPv4 Addressing and Subnetting', short: 'Addressing',
    topics: [
      { id: '2.1', verb: 'Convert', title: 'between binary, decimal and dotted-decimal', sub: ['Binary place values and octets', 'Decimal/binary/hex conversion', 'Classful history (A–E) and why CIDR replaced it', 'Unicast, broadcast and multicast addresses'] },
      { id: '2.2', verb: 'Subnet', title: 'IPv4 networks with masks and CIDR', sub: ['Subnet masks and prefix lengths', 'Network, broadcast, first and last usable addresses', 'Hosts per subnet (2^h − 2) and subnets per block', 'The block-size (magic number) method', 'ANDing a host address with its mask'] },
      { id: '2.3', verb: 'Design', title: 'with VLSM and route summarization', sub: ['VLSM allocation largest-first', 'Avoiding overlaps', 'Summarization / supernetting and the longest common prefix', 'Wildcard masks as inverted masks'] },
      { id: '2.4', verb: 'Identify', title: 'special-purpose IPv4 addresses', sub: ['Private RFC 1918 ranges', 'Shared address space 100.64.0.0/10 (RFC 6598)', 'Loopback 127.0.0.0/8, link-local 169.254.0.0/16 (RFC 3927)', 'Documentation ranges (RFC 5737)', '0.0.0.0, limited and directed broadcast', 'Multicast 224.0.0.0/4, reserved 240.0.0.0/4', '/31 point-to-point (RFC 3021) and /32 host routes'] },
    ],
  },
  {
    id: 3, weight: 30, title: 'ICMP, UDP and TCP', short: 'Transport',
    topics: [
      { id: '3.1', verb: 'Use', title: 'ICMP, ping and traceroute', keepCase: true, sub: ['ICMP message types and codes (0, 3, 5, 8, 11, 12)', 'Ping: echo request/reply, TTL in replies', 'Traceroute: UDP probes (Unix) vs ICMP echo (Windows tracert), TTL exceeded, port unreachable', 'Redirects and why routers send them', 'ICMP filtering pitfalls'] },
      { id: '3.2', verb: 'Explain', title: 'MTU, fragmentation and path MTU discovery', keepCase: true, sub: ['MTU vs MSS', 'Fragmentation fields and reassembly at the destination', 'DF bit and ICMP type 3 code 4 (fragmentation needed)', 'PMTUD and PMTUD black holes', 'MSS clamping, tunnel overhead (GRE, IPsec, PPPoE)'] },
      { id: '3.3', verb: 'Explain', title: 'UDP, ports and sockets', keepCase: true, sub: ['UDP header and when to choose UDP', 'Well-known, registered and dynamic/ephemeral port ranges', 'Sockets and the 5-tuple', 'Common ports (DNS, DHCP, NTP, SNMP, syslog, TFTP, HTTP/S, SSH)'] },
      { id: '3.4', verb: 'Analyze', title: 'TCP connections', keepCase: true, sub: ['TCP header and flags', 'Three-way handshake, sequence and acknowledgment numbers', 'Connection teardown, RST, TIME_WAIT and the state machine', 'Sliding window, window scaling, flow control', 'Retransmission, duplicate ACKs, fast retransmit, SACK', 'Congestion control: slow start, congestion avoidance, ECN'] },
    ],
  },
  {
    id: 4, weight: 20, title: 'Routing, Services and Troubleshooting', short: 'Services & tools',
    topics: [
      { id: '4.1', verb: 'Explain', title: 'IPv4 routing fundamentals', sub: ['Default gateway and the local-vs-remote decision', 'Routing table entries, longest prefix match', 'Static, default and dynamic routes; administrative distance and metric', 'Packet forwarding: TTL decrement, checksum update, new L2 header'] },
      { id: '4.2', verb: 'Explain', title: 'DHCP', keepCase: true, sub: ['DORA exchange and UDP 67/68', 'Lease, renewal T1 (50%) and rebinding T2 (87.5%)', 'Common options (1, 3, 6, 15, 51, 66/67, 82)', 'DHCP relay (giaddr) and reservations', 'DHCP snooping and rogue servers'] },
      { id: '4.3', verb: 'Explain', title: 'DNS', keepCase: true, sub: ['Recursive vs iterative resolution, root and TLD servers', 'Record types (A, AAAA, CNAME, MX, NS, PTR, SOA, TXT, SRV)', 'TTLs and caching, negative caching', 'UDP and TCP 53, reverse lookups in in-addr.arpa', 'nslookup and dig'] },
      { id: '4.4', verb: 'Configure', title: 'NAT and PAT concepts', keepCase: true, sub: ['Static NAT, dynamic NAT and PAT (overload)', 'Inside/outside local/global terms', 'Port forwarding', 'CGNAT and its effects', 'Protocols that break through NAT'] },
      { id: '4.5', verb: 'Troubleshoot', title: 'IPv4 connectivity with standard tools', sub: ['ipconfig, ip addr/route, ifconfig, route print', 'arp -a, ip neigh', 'ss and netstat', 'tcpdump and Wireshark capture/display filters', 'A layered troubleshooting method'] },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

export function topicLabel(t) {
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}
