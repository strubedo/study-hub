// Domain 4 — Routing, Services and Troubleshooting. Original questions; facts checked against RFCs 1034, 1035, 1812, 2131, 2132, 2181, 2308, 3022, 3046, 3442, 4787, 5382, 6598, 6888, 7766 and the IANA DHCP/DNS registries.
const L41A = '4.1-gateway-routing-table-lpm';
const L41B = '4.1-routes-ad-forwarding';
const L42A = '4.2-dhcp-dora-lease-options';
const L42B = '4.2-dhcp-relay-snooping';
const L43A = '4.3-dns-resolution-records';
const L43B = '4.3-dns-caching-transport-tools';
const L44A = '4.4-nat-pat-terms';
const L44B = '4.4-port-forwarding-cgnat-breakage';
const L45A = '4.5-interface-route-arp-socket-tools';
const L45B = '4.5-capture-and-method';

const bank = [
  // ---------- 4.1 ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. Through which next hop does R1 forward a packet destined to 10.1.2.77?',
    exhibit: `R1# show ip route
Gateway of last resort is 198.51.100.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 198.51.100.1
S     10.0.0.0/8 [1/0] via 192.0.2.2
O     10.1.0.0/16 [110/20] via 192.0.2.3, 00:12:41, GigabitEthernet0/1
D     10.1.2.0/24 [90/3072] via 192.0.2.4, 00:03:10, GigabitEthernet0/2`,
    options: ['198.51.100.1', '192.0.2.2', '192.0.2.3', '192.0.2.4'],
    answer: [3],
    explanation: '10.1.2.77 matches the default route, the /8, the /16 and the /24. Longest prefix match is applied first, so the /24 (EIGRP, next hop 192.0.2.4) wins. Administrative distance would only matter between two routes with the same prefix length, and the static /8 having the lowest AD is irrelevant here.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41B,
    stem: 'What is the default administrative distance of OSPF on Cisco IOS? Enter the number.',
    answer: ['110'],
    explanation: 'OSPF is 110. For comparison: connected 0, static 1, external BGP 20, internal EIGRP 90, IS-IS 115, RIP 120, external EIGRP 170, internal BGP 200.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'A host is configured as 192.0.2.10/26 with default gateway 192.0.2.1. It sends a packet to 192.0.2.100. For which address does the host send an ARP request?',
    options: ['192.0.2.100, the destination', '192.0.2.1, the default gateway', '192.0.2.63, the subnet broadcast address', '192.0.2.255, the /24 broadcast address'],
    answer: [1],
    explanation: 'With a /26 mask the host\'s subnet is 192.0.2.0-192.0.2.63. 192.0.2.100 falls in 192.0.2.64/26, so the host treats it as remote and ARPs for its default gateway. It would ARP for the destination itself only if the address were on-link. The two broadcast addresses are not ARP targets.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. A Linux host sends a packet to 203.0.113.9. Which interface and next hop does it use?',
    exhibit: `$ ip route
default via 192.0.2.1 dev eth0 proto dhcp src 192.0.2.10 metric 100
default via 198.51.100.1 dev wlan0 proto dhcp src 198.51.100.20 metric 600
192.0.2.0/24 dev eth0 proto kernel scope link src 192.0.2.10 metric 100
198.51.100.0/24 dev wlan0 proto kernel scope link src 198.51.100.20 metric 600`,
    options: ['eth0 via 192.0.2.1', 'wlan0 via 198.51.100.1', 'Both, load-balanced per packet', 'Neither, because there are two defaults and the kernel drops the traffic'],
    answer: [0],
    explanation: 'Both default routes match with the same prefix length (/0), so the metric decides: 100 beats 600 and the packet leaves via eth0 to 192.0.2.1. The kernel does not drop traffic because there are two defaults, and it does not balance across routes of different metrics.' },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41B,
    stem: 'A static default route is meant as a backup that appears only when the OSPF-learned default route is missing. What is the lowest administrative distance you can give the static route to achieve that? Enter the number.',
    answer: ['111'],
    explanation: 'OSPF has AD 110, and the lower AD wins. The static route must therefore be strictly higher than 110. The lowest integer is 111. Routes with the same AD would be a tie, and the static default (AD 1) would otherwise override OSPF.' },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L41B,
    stem: 'Put the criteria a router uses to choose among routes to a destination in the order they are applied (first at the top).',
    items: ['Longest matching prefix', 'Lowest administrative distance (between sources for the same prefix)', 'Lowest metric (within the same protocol and prefix)'],
    explanation: 'Longest prefix match is applied first. Only among routes with an identical prefix do you compare AD, and only routes from the same source with equal AD are compared by metric.' },
  { topic: '4.1', type: 'match', difficulty: 1, lesson: L41B,
    stem: 'Match each Cisco IOS route source to its default administrative distance.',
    pairs: [['Static route', '1'], ['External BGP', '20'], ['Internal EIGRP', '90'], ['OSPF', '110'], ['RIP', '120']],
    explanation: 'These are the IOS defaults: static 1, eBGP 20, internal EIGRP 90, OSPF 110, RIP 120.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: 'A router receives a transit packet whose TTL is 1. What does it do?',
    options: ['Forwards it with TTL 0 and lets the next hop discard it', 'Discards it and sends ICMP Time Exceeded (type 11, code 0) to the source', 'Discards it silently without any ICMP message', 'Forwards it unchanged because TTL is checked only by hosts'],
    answer: [1],
    explanation: 'A router decrements TTL; a packet that would reach zero is dropped and the router returns ICMP type 11 code 0 (TTL exceeded in transit). Traceroute depends on this. A router never forwards a packet with TTL 0, and the check applies to routers, not only hosts.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41B,
    stem: 'Which two statements about administrative distance are true? (Choose two.)',
    options: ['It is local to the router and is not carried in routing updates', 'It chooses between routes to the same prefix learned from different sources', 'A route with a lower AD wins even when its prefix is shorter than another match', 'It is the value OSPF uses to compare the paths of one prefix', 'The default AD of a static route is 110'],
    answer: [0, 1],
    explanation: 'AD ranks the trustworthiness of the source and applies only between routes to the same prefix; it is configured per router and not advertised. Prefix length is evaluated before AD, so a shorter prefix never wins by AD. OSPF compares paths by cost (a metric), and a static route defaults to AD 1.' },

  // ---------- 4.2 ----------
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42A,
    stem: 'On which UDP port does a DHCP server listen? Enter the port number.',
    answer: ['67'],
    explanation: 'Servers (and relay agents) use UDP 67; clients use UDP 68 (RFC 2131).' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. Why is packet 3, the DHCPREQUEST, still sent from 0.0.0.0 to 255.255.255.255?',
    exhibit: `No.  Source      Destination      Proto  Info
1    0.0.0.0     255.255.255.255  DHCP   DHCP Discover - Transaction ID 0x3903f326
2    192.0.2.1   192.0.2.50       DHCP   DHCP Offer    - Transaction ID 0x3903f326
3    0.0.0.0     255.255.255.255  DHCP   DHCP Request  - Transaction ID 0x3903f326
4    192.0.2.1   192.0.2.50       DHCP   DHCP ACK      - Transaction ID 0x3903f326`,
    options: ['The client has no confirmed address yet, and the broadcast also tells other servers that their offers were not accepted', 'DHCPREQUEST is always a broadcast, even when renewing a lease at T1', 'The server in packet 2 forgot to include a server identifier', 'The client is rebinding after T2 and cannot reach its original server'],
    answer: [0],
    explanation: 'In the initial DORA exchange the client has not yet been acknowledged an address, so it uses 0.0.0.0 as source, and the REQUEST is broadcast so that every server that sent an offer sees the server identifier of the selected one. A T1 renewal is unicast, a T2 rebinding is a broadcast but carries ciaddr, and nothing in the exhibit indicates a missing server identifier.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42A,
    stem: 'A DHCP lease lasts 8 hours (28 800 s) and the server sends no options 58 or 59. At how many seconds after the lease starts does the client enter RENEWING (T1)? Enter the number of seconds.',
    answer: ['14400'],
    explanation: 'T1 defaults to 0.5 x lease time: 0.5 x 28 800 = 14 400 seconds (4 hours). T2 would be 0.875 x 28 800 = 25 200 seconds.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42A,
    stem: 'A DHCP lease lasts 24 hours and uses the default timers. After how many hours does the client enter REBINDING (T2)? Enter the number of hours.',
    answer: ['21', '21 hours', '21h'],
    explanation: 'T2 defaults to 0.875 x lease time: 0.875 x 24 h = 21 h. T1 is at 12 h. At T2 the client broadcasts its request to any server.' },
  { topic: '4.2', type: 'match', difficulty: 1, lesson: L42A,
    stem: 'Match each DHCP option code to what it carries.',
    pairs: [['3', 'Default gateway (router)'], ['6', 'DNS servers'], ['51', 'IP address lease time'], ['66', 'TFTP server name'], ['82', 'Relay agent information']],
    explanation: 'Option 3 Router, 6 Domain Name Server, 51 IP Address Lease Time, 66 TFTP Server Name (with 67 for the boot file) and 82 Relay Agent Information (RFC 3046).' },
  { topic: '4.2', type: 'order', difficulty: 1, lesson: L42A,
    stem: 'Put the messages of a successful initial DHCP exchange in order (first at the top).',
    items: ['DHCPDISCOVER', 'DHCPOFFER', 'DHCPREQUEST', 'DHCPACK'],
    explanation: 'DORA: Discover, Offer, Request, Acknowledge. The client broadcasts the discover and the request; the server answers each.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42B,
    stem: 'Refer to the exhibit. From which scope does the server allocate an address for this client?',
    exhibit: `DHCP server 192.0.2.5 scopes:
  10.10.10.0/24   range 10.10.10.100 - 10.10.10.200
  10.10.20.0/24   range 10.10.20.100 - 10.10.20.200
  192.0.2.0/24    range 192.0.2.50  - 192.0.2.90

Captured DHCPDISCOVER arriving at the server:
  ip.src 10.10.20.1   ip.dst 192.0.2.5   udp 67 > 67
  giaddr 10.10.20.1   chaddr 00:1a:2b:3c:4d:5e`,
    options: ['10.10.10.0/24', '10.10.20.0/24', '192.0.2.0/24', 'None, because the request is unicast'],
    answer: [1],
    explanation: 'giaddr is 10.10.20.1, so the server selects the scope containing it: 10.10.20.0/24. The IP source of the relayed packet is the relay, not the client. The server\'s own subnet is used only when giaddr is zero, and relayed requests are valid unicast DHCP.' },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L42B,
    stem: 'On an untrusted port with DHCP snooping enabled, which two messages does the switch drop? (Choose two.)',
    options: ['DHCPOFFER', 'DHCPACK', 'DHCPDISCOVER', 'DHCPREQUEST', 'ARP request'],
    answer: [0, 1],
    explanation: 'Snooping blocks server-originated messages (OFFER, ACK, NAK) arriving on untrusted ports, which stops rogue servers. DISCOVER and REQUEST are normal client messages (they are validated, rate-limited and used to build the binding table), and ARP is handled by Dynamic ARP Inspection, not DHCP snooping.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42B,
    stem: 'Refer to the exhibit. After snooping was enabled for VLAN 10, no client gets a lease. The DHCP server is reached through GigabitEthernet1/0/48. What fixes the problem?',
    exhibit: `SW1# show ip dhcp snooping
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs:
10
Insertion of option 82 is enabled
Interface                  Trusted    Allow option    Rate limit (pps)
-----------------------    -------    ------------    ----------------
GigabitEthernet1/0/1       no         no              15
GigabitEthernet1/0/2       no         no              15
GigabitEthernet1/0/48      no         no              unlimited`,
    options: ['Configure ip dhcp snooping trust on GigabitEthernet1/0/48', 'Remove the rate limit from the access ports', 'Disable option 82 insertion on VLAN 10 clients', 'Add ip helper-address on the access ports'],
    answer: [0],
    explanation: 'The uplink toward the server is untrusted, so the switch drops the server\'s OFFER and ACK messages. Trusting that port fixes it. A 15 pps limit is ordinary, option 82 insertion is a separate issue, and helper-address belongs on a layer 3 interface, not access ports.' },

  // ---------- 4.3 ----------
  { topic: '4.3', type: 'fill', difficulty: 3, lesson: L43B,
    stem: 'Refer to the exhibit. For how many seconds may a resolver cache this negative answer? Enter the number.',
    exhibit: `$ dig @ns1.example.com nosuch.example.com A

;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 5521
;; flags: qr aa rd; QUERY: 1, ANSWER: 0, AUTHORITY: 1, ADDITIONAL: 1

;; AUTHORITY SECTION:
example.com.   3600  IN  SOA  ns1.example.com. hostmaster.example.com. 2026103001 7200 900 1209600 300`,
    answer: ['300'],
    explanation: 'RFC 2308: the negative TTL is the smaller of the SOA record\'s TTL (3600) and its MINIMUM field (the last number, 300). The other numbers are serial 2026103001, refresh 7200, retry 900 and expire 1209600.' },
  { topic: '4.3', type: 'fill', difficulty: 1, lesson: L43A,
    stem: 'Which DNS resource record type maps an IPv4 address back to a name? Enter the type.',
    answer: ['PTR'],
    explanation: 'PTR (type 12) records live under in-addr.arpa for IPv4. A and AAAA map names to addresses, and CNAME creates an alias.' },
  { topic: '4.3', type: 'fill', difficulty: 2, lesson: L43B,
    stem: 'Write the reverse-lookup name queried for the address 198.51.100.77.',
    answer: ['77.100.51.198.in-addr.arpa', '77.100.51.198.in-addr.arpa.'],
    explanation: 'The four octets are reversed and in-addr.arpa is appended, because delegation follows the most-general-last order of DNS labels. The trailing dot (root) is optional in this answer.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43A,
    stem: 'Why can a CNAME record not be created at the zone apex (example.com itself)?',
    options: ['A CNAME cannot coexist with other record types at the same name, and the apex must carry SOA and NS records', 'CNAME records are only allowed for names below three labels', 'The apex must always have an A record, which a CNAME would replace with an IPv6 address', 'Resolvers refuse to follow a CNAME to a name in a different zone'],
    answer: [0],
    explanation: 'A name with a CNAME may not have any other data (RFC 1034, clarified in RFC 2181), yet the apex requires SOA and NS. There is no label-count rule, an apex does not require an A record, and CNAMEs may point to names in other zones.' },
  { topic: '4.3', type: 'match', difficulty: 1, lesson: L43A,
    stem: 'Match each DNS record type to its purpose.',
    pairs: [['MX', 'Mail exchanger with a preference value'], ['SRV', 'Service location with priority, weight, port and target'], ['TXT', 'Free-form text such as SPF or verification strings'], ['NS', 'Authoritative name server for a zone'], ['SOA', 'Zone parameters including serial and negative-caching TTL']],
    explanation: 'MX gives mail servers (lower preference first), SRV locates services with port numbers, TXT holds arbitrary strings, NS names the zone\'s authoritative servers and SOA holds the zone\'s start-of-authority data.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43A,
    stem: 'Refer to the exhibit. Which statement is supported by the output?',
    exhibit: `$ dig web1.example.com A

;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41122
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; ANSWER SECTION:
web1.example.com.   287  IN  A  198.51.100.80

;; Query time: 12 msec
;; SERVER: 192.0.2.53#53(192.0.2.53) (UDP)`,
    options: ['The responding server offers recursion and the answer did not come with the aa flag from an authoritative server', 'The zone owner configured a TTL of exactly 287 seconds', 'The name does not exist', 'The response was truncated and must be repeated over TCP'],
    answer: [0],
    explanation: 'ra shows the server offers recursion and there is no aa flag, so this is not an authoritative answer. A TTL of 287 could be a countdown from a larger configured value, so nothing proves it was configured as 287. The status is NOERROR with an answer, and there is no tc flag.' },
  { topic: '4.3', type: 'multi', difficulty: 2, lesson: L43B,
    stem: 'Which two situations make DNS use TCP port 53? (Choose two.)',
    options: ['A UDP response is truncated and the client retries', 'A zone transfer between a primary and a secondary server', 'Every query sent to a root server', 'Every response smaller than 512 bytes', 'Any query that sets the RD (recursion desired) bit'],
    answer: [0, 1],
    explanation: 'A set TC bit makes the client retry over TCP, and zone transfers (AXFR/IXFR) use TCP. Most ordinary queries, including those to root servers and small responses, use UDP, and RD only requests recursion; it does not select the transport. RFC 7766 requires TCP support from all implementations.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43A,
    stem: 'A workstation asks its configured resolver for www.example.com. Which description of the query types is correct?',
    options: ['The workstation sends a recursive query; the resolver then iterates through root, TLD and authoritative servers', 'The workstation iterates through the root, TLD and authoritative servers itself', 'The resolver sends recursive queries to the root servers, which forward them onward', 'Root servers answer with the final A record of the host'],
    answer: [0],
    explanation: 'The stub resolver delegates the work with a recursive query; the recursive resolver follows referrals iteratively. Root servers return a referral to the TLD servers (with glue), not the final record, and they do not perform recursion for others.' },
  { topic: '4.3', type: 'fill', difficulty: 1, lesson: L43A,
    stem: 'Refer to the exhibit. Which TCP port should a SIP client use for this service? Enter the number.',
    exhibit: `_sip._tcp.example.com.  3600  IN  SRV  10 60 5060 sip1.example.com.`,
    answer: ['5060'],
    explanation: 'SRV data is priority (10), weight (60), port (5060) and target (sip1.example.com). The _tcp label names the transport, not the port.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43A,
    stem: 'Refer to the exhibit. Which mail server does a sending MTA try first?',
    exhibit: `example.com.  3600  IN  MX  20 mail2.example.com.
example.com.  3600  IN  MX  10 mail1.example.com.
example.com.  3600  IN  MX  30 backup.example.net.`,
    options: ['mail1.example.com', 'mail2.example.com', 'backup.example.net', 'One chosen at random from all three'],
    answer: [0],
    explanation: 'The lowest MX preference value is tried first, so 10 (mail1) precedes 20 and 30. Equal preferences would be shuffled, which is not the case here; the order in which records are listed has no meaning.' },

  // ---------- 4.4 ----------
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44A,
    stem: 'Refer to the exhibit. What source IP address does the server at 198.51.100.10 see for the connection from 10.1.1.11? Enter the address only.',
    exhibit: `R1# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.2:1024   10.1.1.10:49152    198.51.100.10:80   198.51.100.10:80
tcp 203.0.113.2:1025   10.1.1.11:52311    198.51.100.10:80   198.51.100.10:80`,
    answer: ['203.0.113.2'],
    explanation: 'The inside global column shows how inside hosts appear to the outside: 203.0.113.2, with port 1025 for 10.1.1.11. 10.1.1.11 is the inside local address, and 198.51.100.10 is the server itself.' },
  { topic: '4.4', type: 'match', difficulty: 2, lesson: L44A,
    stem: 'Match each Cisco NAT term to its meaning.',
    pairs: [['Inside local', 'An inside host\'s address as configured on the inside network'], ['Inside global', 'An inside host\'s address as seen from the outside network'], ['Outside local', 'An outside host\'s address as seen from the inside network'], ['Outside global', 'An outside host\'s address as it exists on the outside network']],
    explanation: 'Inside/outside says which device is being described; local/global says from which network the address is viewed. For ordinary internet access the outside local and outside global are identical.' },
  { topic: '4.4', type: 'single', difficulty: 1, lesson: L44A,
    stem: 'How does PAT (NAT overload) tell the flows of different inside hosts apart when they share one public address?',
    options: ['By translating the source port (or ICMP identifier) to a unique value per flow', 'By giving each host a different MAC address', 'By using a different TTL for each host', 'By assigning a separate IP protocol number per host'],
    answer: [0],
    explanation: 'PAT adds the transport port (or the ICMP query ID) to the mapping, so one address can carry tens of thousands of flows. MAC addresses, TTL and protocol numbers are not used to distinguish flows.' },
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44B,
    stem: 'Which IPv4 prefix did RFC 6598 reserve as shared address space for carrier-grade NAT? Enter it in prefix notation.',
    answer: ['100.64.0.0/10', '100.64.0.0 /10', '100.64.0.0/255.192.0.0'],
    explanation: '100.64.0.0/10 (100.64.0.0-100.127.255.255) is shared address space for the link between a provider\'s CGN and the customer router. It is not RFC 1918 private space and is not globally routable.' },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L44B,
    stem: 'Which two protocols commonly need an ALG or a traversal technique to work through NAT? (Choose two.)',
    options: ['Active-mode FTP', 'SIP with SDP media negotiation', 'A plain HTTP GET to a web server', 'DNS over UDP to a public resolver', 'SSH to an outside server'],
    answer: [0, 1],
    explanation: 'FTP\'s PORT command and SIP/SDP carry IP addresses and ports inside the payload, which NAT does not rewrite unless an ALG helps. HTTP, DNS queries and SSH initiated from inside work with ordinary PAT because they carry no addresses in the payload.' },
  { topic: '4.4', type: 'single', difficulty: 3, lesson: L44A,
    stem: 'Refer to the exhibit. Hosts in 10.1.3.0/24, routed through Gi0/0, reach the internet with their private source addresses. Why?',
    exhibit: `interface GigabitEthernet0/0
 ip address 10.1.1.1 255.255.255.0
 ip nat inside
interface GigabitEthernet0/1
 ip address 203.0.113.2 255.255.255.0
 ip nat outside
ip nat inside source list 1 interface GigabitEthernet0/1 overload
access-list 1 permit 10.1.1.0 0.0.0.255`,
    options: ['Access list 1 selects only 10.1.1.0/24 for translation', 'The overload keyword restricts PAT to one subnet', 'Gi0/0 must be configured as ip nat outside', 'NAT cannot translate traffic that is routed through another router'],
    answer: [0],
    explanation: 'The ACL used by ip nat inside source list identifies which sources are translated; 10.1.3.0/24 is not matched. Adding permit 10.1.3.0 0.0.0.255 fixes it. Overload does not limit subnets, Gi0/0 is correctly inside, and routed traffic can be translated.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44B,
    stem: 'Refer to the exhibit. Which destination does an internet user connect to in order to reach the web server?',
    exhibit: `R1(config)# ip nat inside source static tcp 10.1.1.20 80 203.0.113.2 8080

R1# show ip nat translations
Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.2:8080   10.1.1.20:80       ---                ---`,
    options: ['203.0.113.2 TCP port 8080', '203.0.113.2 TCP port 80', '10.1.1.20 TCP port 8080', '10.1.1.20 TCP port 80'],
    answer: [0],
    explanation: 'The static entry maps inside local 10.1.1.20:80 to inside global 203.0.113.2:8080, so outside users use the public address and port 8080 and the router rewrites the destination to 10.1.1.20:80. The inside local address is not reachable from the internet.' },
  { topic: '4.4', type: 'single', difficulty: 3, lesson: L44B,
    stem: 'A web server at 10.1.1.20 is published through a port forward on 203.0.113.2. Internet users reach it, but an inside PC fails when it browses to the public address. What is the standard clean fix?',
    options: ['Use split-horizon DNS so inside clients resolve the name to 10.1.1.20 (or configure hairpin NAT)', 'Change the server\'s TTL to 255', 'Enable DHCP snooping on the inside VLAN', 'Move the server into 100.64.0.0/10'],
    answer: [0],
    explanation: 'Without hairpin NAT, the server sees the inside client\'s real address and replies directly, bypassing the NAT, so the flow breaks. Resolving the name to the private address (split DNS) or rewriting the source as well (hairpin NAT) fixes it. TTL, snooping and shared address space are irrelevant.' },
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44B,
    stem: 'After NAT traversal is detected, IPsec ESP is encapsulated in UDP. Which UDP port is used? Enter the number.',
    answer: ['4500'],
    explanation: 'NAT-T (RFC 3947 and 3948) moves IKE and UDP-encapsulated ESP to UDP 4500, because ESP (protocol 50) has no ports for PAT to map. IKE starts on UDP 500.' },

  // ---------- 4.5 ----------
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45A,
    stem: 'Refer to the exhibit. What does the output indicate?',
    exhibit: `$ ip link show eth0
2: eth0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN mode DEFAULT group default qlen 1000
    link/ether 00:1a:2b:3c:4d:5e brd ff:ff:ff:ff:ff:ff`,
    options: ['The interface is administratively up but no link is detected, so check the cable or switch port', 'The interface has been shut down by an administrator', 'DHCP failed and the host has a 169.254.0.0/16 address', 'The interface works but MTU is wrong'],
    answer: [0],
    explanation: 'UP is the administrative flag and NO-CARRIER with state DOWN means the physical layer has no link. An administrative shutdown would show state DOWN without UP in the flag list. DHCP and MTU problems occur above the link layer and do not produce NO-CARRIER.' },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45A,
    stem: 'Refer to the exhibit. Clients on other hosts get "connection refused" on port 8080 even though the firewall allows it. What is the cause?',
    exhibit: `$ ss -tlnp
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN 0      4096   0.0.0.0:22          0.0.0.0:*         users:(("sshd",pid=801,fd=3))
LISTEN 0      511    127.0.0.1:8080      0.0.0.0:*         users:(("nginx",pid=915,fd=6))`,
    options: ['nginx is bound to 127.0.0.1 only, so remote connections get a reset', 'Recv-Q is 0, which means the service is stopped', 'Port 8080 requires UDP, not TCP', 'sshd is blocking port 8080'],
    answer: [0],
    explanation: 'A socket bound to 127.0.0.1 accepts only local connections; remote SYNs find no listener on the external address and are answered with RST. Recv-Q 0 on a listening socket just means no connections are waiting. The socket is TCP, and sshd has nothing to do with 8080.' },
  { topic: '4.5', type: 'single', difficulty: 1, lesson: L45A,
    stem: 'Refer to the exhibit. What is the most likely problem?',
    exhibit: String.raw`C:\> ipconfig

Ethernet adapter Ethernet:
   Connection-specific DNS Suffix  . :
   Autoconfiguration IPv4 Address. . : 169.254.37.12
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :`,
    options: ['No DHCP server answered, so Windows self-assigned a link-local address', 'The DHCP lease expired and the server sent a DHCPNAK', 'The default gateway is down', 'A static address was configured with the wrong mask'],
    answer: [0],
    explanation: 'The label "Autoconfiguration IPv4 Address" with 169.254.x.x/16 is APIPA, used when DHCP gets no response. A NAK would be followed by a new DORA that normally succeeds, a down gateway would not change the host\'s own address, and a manual address would not be labelled autoconfiguration.' },
  { topic: '4.5', type: 'fill', difficulty: 1, lesson: L45A,
    stem: 'Which Linux command from the iproute2 suite has replaced netstat for listing sockets? Enter the command name.',
    answer: ['ss'],
    explanation: 'ss (socket statistics) reads kernel socket data directly and is faster and richer than netstat, which belongs to the deprecated net-tools package.' },
  { topic: '4.5', type: 'fill', difficulty: 2, lesson: L45A,
    stem: 'Enter the Windows netstat command line (command and flags) that lists all connections and listening ports numerically with the owning process ID.',
    answer: ['netstat -ano', 'netstat -aon', 'netstat -nao', 'netstat -noa', 'netstat -ona', 'netstat -oan'],
    explanation: '-a shows all connections and listeners, -n numeric addresses and ports, -o the owning PID. Add -b (administrator) to see executable names.' },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45B,
    stem: 'Which of these is a valid tcpdump (BPF) capture filter, as opposed to a Wireshark display filter?',
    options: ['host 192.0.2.10 and tcp port 443', 'ip.addr == 192.0.2.10 && tcp.port == 443', 'tcp.flags.syn == 1 && tcp.flags.ack == 0', 'dns.flags.rcode == 3'],
    answer: [0],
    explanation: 'BPF uses primitives such as host, port, net and tcp joined by and/or/not. The other three use Wireshark field names (ip.addr, tcp.flags.syn, dns.flags.rcode) and operators like == and &&, which are display-filter syntax.' },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45B,
    stem: 'Refer to the exhibit. What does the capture show?',
    exhibit: `10:41:02.120118 IP 192.0.2.10.50718 > 198.51.100.80.443: Flags [S], seq 3105121870, win 64240, length 0
10:41:03.141233 IP 192.0.2.10.50718 > 198.51.100.80.443: Flags [S], seq 3105121870, win 64240, length 0
10:41:05.157301 IP 192.0.2.10.50718 > 198.51.100.80.443: Flags [S], seq 3105121870, win 64240, length 0`,
    options: ['The SYN is retransmitted and nothing comes back, so a drop or dead path is likely', 'The server sent RST, so the port is closed', 'A successful three-way handshake', 'The host is sending data segments that the server never acknowledges'],
    answer: [0],
    explanation: 'Identical SYNs (same sequence number) at growing intervals with no SYN-ACK, RST or ICMP indicate silence from the far end: a firewall drop, routing/return-path fault or a dead host. A closed port would be answered with a reset, and a handshake would show SYN-ACK and ACK.' },
  { topic: '4.5', type: 'order', difficulty: 2, lesson: L45B,
    stem: 'Put these bottom-up troubleshooting checks in order (first at the top).',
    items: ['Confirm the interface has link and an IP address, mask and gateway', 'Ping the default gateway', 'Ping a remote IP address', 'Resolve a host name with dig or nslookup', 'Test the application port with nc or Test-NetConnection'],
    explanation: 'Work from the lower layers upward: link and addressing, local reachability, routing to a remote IP address, name resolution, and finally the transport port and application. Testing a remote IP before the name separates routing faults from DNS faults.' },
  { topic: '4.5', type: 'multi', difficulty: 2, lesson: L45B,
    stem: 'A user can ping 198.51.100.80 but cannot reach www.example.com by name. Which two causes are consistent with these symptoms? (Choose two.)',
    options: ['The DHCP lease gave the host a DNS server that is unreachable or wrong', 'The recursive resolver holds a negatively cached answer for the name', 'The host has no default gateway', 'The host has a duplicate IP address on the subnet', 'The host\'s TTL is too low for the path'],
    answer: [0, 1],
    explanation: 'Ping by IP working proves link, addressing, gateway and routing are fine, so the fault is in name resolution: a wrong or unreachable DNS server, or a stale negative cache entry. A missing gateway would break the remote ping, a duplicate address would cause intermittent local problems, and a low TTL would show as Time Exceeded.' },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
