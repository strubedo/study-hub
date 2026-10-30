// Domain 1 — Models, Ethernet and the IPv4 Header. Original flashcards.
let n = 0;
const c = (topic, front, back) => ({ id: `d1-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('1.1', 'How many layers in the RFC 1122 TCP/IP model?', 'Four: link, internet, transport, application. OSI layers 5-7 collapse into the application layer.'),
  c('1.1', 'PDU names by layer?', 'Layer 2 frame, layer 3 packet (IPv4 datagram in RFC 791), layer 4 TCP segment or UDP datagram.'),
  c('1.1', 'Which fields change at each router hop (no NAT)?', 'Source and destination MAC, FCS, TTL and the IPv4 header checksum. IP addresses and ports stay the same.'),
  c('1.1', 'Which layers does a switch, router and stateful firewall use to forward or decide?', 'Switch: layer 2 (MAC). Router: layer 3 (destination IP). Stateful firewall: layers 3 and 4; next-generation firewalls up to layer 7.'),
  c('1.2', 'Ethernet II frame fields and sizes?', 'Dst MAC 6, src MAC 6, EtherType 2, payload 46-1500, FCS 4 bytes.'),
  c('1.2', 'Minimum and maximum Ethernet frame sizes?', '64 bytes minimum, 1518 bytes maximum untagged (1522 with an 802.1Q tag), FCS included.'),
  c('1.2', 'EtherType versus length field?', 'A value of 0x0600 (1536) or more is an EtherType; 1500 or less is an 802.3 length.'),
  c('1.2', 'EtherTypes: IPv4, ARP, IPv6, 802.1Q?', '0x0800, 0x0806, 0x86DD, 0x8100.'),
  c('1.2', 'What do the I/G and U/L bits of a MAC mean?', 'First octet bit 0 (0x01): I/G, 1 = group (multicast/broadcast). Bit 1 (0x02): U/L, 1 = locally administered.'),
  c('1.2', 'IPv4 multicast to MAC mapping?', '`01:00:5e` plus a 0 bit and the low 23 bits of the group address. 224.0.0.5 -> `01:00:5e:00:00:05`.'),
  c('1.2', 'How does a switch treat unknown unicast and broadcast?', 'Floods out all other ports in the VLAN. Known unicast goes to one port; a frame whose destination is on the ingress port is filtered.'),
  c('1.2', 'Default MAC address table aging on Cisco switches?', '300 seconds. Entries refresh when the source MAC is seen again.'),
  c('1.2', 'What is in an 802.1Q tag?', '4 bytes: TPID 0x8100, PCP 3 bits, DEI 1 bit, VID 12 bits (usable VLANs 1-4094).'),
  c('1.2', 'What does MTU 1500 mean?', 'Largest layer 3 packet per frame, equal to the maximum Ethernet payload. It excludes the 14-byte header, FCS and VLAN tag.'),
  c('1.3', 'ARP message for IPv4 over Ethernet?', '28 bytes: HTYPE 1, PTYPE 0x0800, HLEN 6, PLEN 4, opcode 1 request / 2 reply, then sender and target MAC and IP. EtherType 0x0806.'),
  c('1.3', 'Which address does a host ARP for when the destination is remote?', 'The default gateway. The frame carries the gateway MAC while the IP destination stays the remote host.'),
  c('1.3', 'ARP probe versus announcement (RFC 5227)?', 'Probe: sender IP 0.0.0.0, target the candidate address. Announcement: sender IP and target IP both the new address.'),
  c('1.3', 'RFC 5227 timing?', 'Up to 1 s random delay, 3 probes 1-2 s apart, wait 2 s, 2 announcements 2 s apart; defend at most every 10 s.'),
  c('1.3', 'What is proxy ARP?', 'A router answers ARP requests for off-link hosts using its own MAC address. Enabled by default on Cisco IOS interfaces (`ip proxy-arp`).'),
  c('1.3', 'How do you mitigate ARP spoofing?', 'DHCP snooping plus Dynamic ARP Inspection, port security, 802.1X, and static entries for critical hosts.'),
  c('1.4', 'IHL meaning and range?', 'Header length in 32-bit words: 5 (20 bytes) to 15 (60 bytes). Options are at most 40 bytes.'),
  c('1.4', 'How is the old ToS byte divided now?', 'Top 6 bits DSCP (RFC 2474), low 2 bits ECN (RFC 3168). EF = 46 = 0xB8 as a byte.'),
  c('1.4', 'ECN codepoints?', '00 Not-ECT, 01 ECT(1), 10 ECT(0), 11 CE (Congestion Experienced).'),
  c('1.4', 'Flags and fragment offset layout?', 'Flags 3 bits (reserved, DF, MF), offset 13 bits in 8-byte units. `0x4000` = DF set, not fragmented.'),
  c('1.4', 'IP protocol numbers to know?', '1 ICMP, 6 TCP, 17 UDP, 47 GRE, 50 ESP, 89 OSPF.'),
  c('1.4', 'TTL basics and OS defaults?', 'Decremented per router; expiry gives ICMP type 11 code 0. Defaults: Linux 64, Windows 128, Cisco IOS 255.'),
  c('1.4', 'What does the IPv4 header checksum cover?', 'The header only. It is recomputed at every hop because TTL changes.'),
];
