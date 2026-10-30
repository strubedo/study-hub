// Domain 1 — Models, Ethernet and the IPv4 Header. Original content, checked against RFCs 791, 826, 894, 1122, 2474, 3168, 5227 and IANA registries.
export default [
  { id: '1.1-osi-tcpip-encapsulation', topic: '1.1', title: 'OSI and TCP/IP Models, PDUs and Encapsulation', minutes: 8, file: '1.1-osi-tcpip-encapsulation.md',
    objectives: ['Map the seven OSI layers to the four TCP/IP (RFC 1122) layers', 'Name the PDU at each layer', 'Describe encapsulation and what changes at each router hop', 'Place hubs, switches, routers and firewalls by layer'] },
  { id: '1.2-ethernet-frame-mac', topic: '1.2', title: 'Ethernet II Frames and MAC Addresses', minutes: 8, file: '1.2-ethernet-frame-mac.md',
    objectives: ['List the Ethernet II frame fields and size limits', 'Distinguish EtherType from 802.3 length', 'Decode the I/G and U/L bits and the OUI', 'Derive IPv4 multicast MAC addresses'] },
  { id: '1.2-switching-mtu-vlan-domains', topic: '1.2', title: 'Switch Forwarding, 802.1Q, MTU and Domains', minutes: 8, file: '1.2-switching-mtu-vlan-domains.md',
    objectives: ['Explain MAC learning, flooding, forwarding and filtering', 'Decode the 802.1Q tag and its effect on frame size', 'Contrast MTU with frame size and describe jumbo frames', 'Count collision and broadcast domains'] },
  { id: '1.3-arp', topic: '1.3', title: 'ARP: Resolution, Caches, Gratuitous ARP, Proxy ARP and Spoofing', minutes: 9, file: '1.3-arp.md',
    objectives: ['Decode an ARP request and reply', 'Explain which address a host ARPs for locally and remotely', 'Describe ARP probes, announcements and RFC 5227 timing', 'Mitigate ARP spoofing with DHCP snooping and DAI'] },
  { id: '1.4-ipv4-header-layout', topic: '1.4', title: 'The IPv4 Header: Layout, IHL, Options, DSCP and ECN', minutes: 9, file: '1.4-ipv4-header-layout.md',
    objectives: ['Name every IPv4 header field and its size', 'Compute header and payload length from IHL and total length', 'Decode the DSCP and ECN bits of the former ToS byte', 'Read a raw IPv4 header in hex'] },
  { id: '1.4-fragmentation-ttl-protocol-checksum', topic: '1.4', title: 'Fragmentation, TTL, Protocol Numbers and the Header Checksum', minutes: 9, file: '1.4-fragmentation-ttl-protocol-checksum.md',
    objectives: ['Fragment a datagram and compute offsets and MF flags', 'Explain TTL behaviour and typical OS defaults', 'Recall key IP protocol numbers', 'Compute the header checksum and explain why it changes per hop'] },
];
