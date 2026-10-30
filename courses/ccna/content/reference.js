// Cheat-sheet tables for the Reference page. Cells are inline markdown.
export default [
  {
    id: 'ad', title: 'Administrative distance', topic: '3.1',
    columns: ['Route source', 'Default AD'],
    rows: [
      ['Connected interface', '0'], ['Static route', '1'], ['EIGRP summary route', '5'], ['External BGP (eBGP)', '20'],
      ['Internal EIGRP', '90'], ['OSPF', '110'], ['IS-IS', '115'], ['RIP', '120'], ['External EIGRP', '170'],
      ['Internal BGP (iBGP)', '200'], ['DHCP-learned default route (IOS)', '254'], ['Unknown / unusable', '255 (never installed)'],
    ],
    note: 'Route selection order: longest prefix match first, then lowest AD among equal prefixes, then lowest metric within one protocol. A floating static route uses an AD higher than the dynamic protocol it backs up (e.g. `ip route 0.0.0.0 0.0.0.0 203.0.113.1 115` behind OSPF).',
  },
  {
    id: 'ports', title: 'Well-known ports', topic: '4.4',
    columns: ['Protocol', 'Transport / port'],
    rows: [
      ['FTP (data / control)', 'TCP 20 / 21'], ['SSH, SCP, SFTP', 'TCP 22'], ['Telnet', 'TCP 23'], ['SMTP', 'TCP 25'], ['TACACS+', 'TCP 49'],
      ['DNS', 'UDP 53 (TCP 53 for zone transfers and large responses)'], ['DHCP server / client', 'UDP 67 / 68'], ['TFTP', 'UDP 69'], ['HTTP', 'TCP 80'],
      ['POP3', 'TCP 110'], ['NTP', 'UDP 123'], ['IMAP', 'TCP 143'], ['SNMP agent / traps & informs', 'UDP 161 / 162'], ['BGP', 'TCP 179'],
      ['LDAP / LDAPS', 'TCP 389 / 636'], ['HTTPS', 'TCP 443'], ['IKE (IPsec)', 'UDP 500'], ['Syslog', 'UDP 514'], ['NETCONF over SSH', 'TCP 830'],
      ['RADIUS auth / accounting', 'UDP 1812 / 1813 (legacy 1645 / 1646)'], ['RDP', 'TCP 3389'], ['IPsec NAT-T', 'UDP 4500'], ['CAPWAP control / data', 'UDP 5246 / 5247'],
    ],
  },
  {
    id: 'protocols', title: 'IP protocol numbers', topic: '4.6',
    columns: ['Protocol', 'IP protocol #'],
    rows: [['ICMP', '1'], ['TCP', '6'], ['UDP', '17'], ['GRE', '47'], ['ESP (IPsec)', '50'], ['AH (IPsec)', '51'], ['ICMPv6', '58'], ['EIGRP', '88'], ['OSPF', '89'], ['VRRP', '112']],
  },
  {
    id: 'ipv4', title: 'IPv4 special ranges', topic: '1.3',
    columns: ['Range', 'Purpose'],
    rows: [
      ['`10.0.0.0/8`', 'Private (RFC 1918)'], ['`172.16.0.0/12`', 'Private (RFC 1918): 172.16.0.0 – 172.31.255.255'], ['`192.168.0.0/16`', 'Private (RFC 1918)'],
      ['`100.64.0.0/10`', 'Shared address space for carrier-grade NAT (RFC 6598)'], ['`127.0.0.0/8`', 'Loopback'], ['`169.254.0.0/16`', 'Link-local / APIPA (DHCP failed)'],
      ['`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`', 'Documentation (TEST-NET-1/2/3)'], ['`224.0.0.0/4`', 'Multicast (class D)'], ['`240.0.0.0/4`', 'Reserved (class E)'],
      ['`0.0.0.0/8`', '"This network"; `0.0.0.0/0` is the default route'], ['`255.255.255.255`', 'Limited broadcast'],
    ],
    note: 'Classful first-octet ranges (still asked): A 1–126, B 128–191, C 192–223, D 224–239, E 240–255 (127 is loopback).',
  },
  {
    id: 'ipv6', title: 'IPv6 address types', topic: '1.4',
    columns: ['Prefix', 'Type'],
    rows: [
      ['`::/128`', 'Unspecified'], ['`::1/128`', 'Loopback'], ['`2000::/3`', 'Global unicast (GUA)'], ['`FC00::/7` (`FD00::/8` used)', 'Unique local (ULA), private'],
      ['`FE80::/10`', 'Link-local, auto-generated on every IPv6 interface'], ['`FF00::/8`', 'Multicast'], ['`FF02::1` / `FF02::2`', 'All nodes / all routers (link-local scope)'],
      ['`FF02::5` / `FF02::6`', 'OSPFv3 all routers / DRs'], ['`FF02::1:FF00:0/104`', 'Solicited-node multicast (last 24 bits of the unicast address)'], ['`2001:DB8::/32`', 'Documentation'],
    ],
    note: 'Modified EUI-64: split the 48-bit MAC, insert `FFFE` in the middle, flip the 7th bit (U/L) of the first byte. `0050.56AB.CDEF` → `0250:56FF:FEAB:CDEF`. IPv6 has no broadcast; standard LAN prefix is /64.',
  },
  {
    id: 'ospf', title: 'OSPF essentials', topic: '3.3',
    columns: ['Item', 'Value'],
    rows: [
      ['Neighbor states', 'Down → Init → 2-Way → ExStart → Exchange → Loading → Full'], ['Broadcast network (Ethernet)', 'DR/BDR elected; hello 10 s / dead 40 s'],
      ['Point-to-point', 'No DR/BDR; hello 10 s / dead 40 s'], ['NBMA', 'DR/BDR; hello 30 s / dead 120 s'],
      ['Multicast (v2 / v3)', '224.0.0.5 & 224.0.0.6 / FF02::5 & FF02::6'], ['Router ID order', '`router-id` command → highest loopback IPv4 → highest active interface IPv4'],
      ['DR election', 'Highest interface priority (default 1, 0 = never), then highest RID; non-preemptive'],
      ['Must match to become neighbors', 'Area, subnet & mask, hello/dead timers, authentication, stub flags, MTU (else stuck ExStart/Exchange), compatible network type'],
      ['Cost', 'Reference bandwidth ÷ interface bandwidth; default reference 100 Mbps, so FastEthernet, Gigabit and 10G all cost 1 unless `auto-cost reference-bandwidth` is raised'],
      ['DROTHER ↔ DROTHER', 'Stay in 2-Way (normal); Full only with DR and BDR'],
    ],
  },
  {
    id: 'stp', title: 'Spanning tree (Rapid PVST+)', topic: '2.5',
    columns: ['Item', 'Value'],
    rows: [
      ['Bridge ID', 'Priority (default 32768, steps of 4096) + extended system ID (= VLAN) + MAC. VLAN 10 default → 32778'],
      ['Root bridge', 'Lowest bridge ID; `spanning-tree vlan X root primary` sets 24576 (or 4096 below the current root if needed)'],
      ['Root port selection', 'Lowest root path cost → lowest neighbor bridge ID → lowest neighbor port priority → lowest neighbor port number'],
      ['RSTP port roles', 'Root, designated, alternate (backup path to root), backup (redundant link to same segment), disabled'],
      ['RSTP states', 'Discarding, learning, forwarding (802.1D: blocking, listening, learning, forwarding, disabled)'],
      ['802.1D timers', 'Hello 2 s, max age 20 s, forward delay 15 s'],
      ['Path cost (short / long method)', '10 Mb 100 / 2,000,000 · 100 Mb 19 / 200,000 · 1 Gb 4 / 20,000 · 10 Gb 2 / 2,000. Check `show spanning-tree summary` for the method in use.'],
      ['PortFast', 'Edge port goes straight to forwarding; for host-facing ports only'],
      ['BPDU guard', 'BPDU received on the port → err-disabled'], ['Root guard', 'Superior BPDU received → root-inconsistent (blocked) until it stops'],
      ['Loop guard', 'BPDUs stop arriving on a non-designated port → loop-inconsistent instead of moving to forwarding'],
    ],
  },
  {
    id: 'fhrp', title: 'First hop redundancy', topic: '3.4',
    columns: ['', 'HSRP v1 / v2', 'VRRP (v2/v3)', 'GLBP'],
    rows: [
      ['Standard', 'Cisco', 'Open (RFC 5798 for v3)', 'Cisco'],
      ['Roles', 'Active / Standby', 'Master / Backup', 'AVG / AVF'],
      ['Multicast', '224.0.0.2 / 224.0.0.102', '224.0.0.18', '224.0.0.102'],
      ['Virtual MAC', '`0000.0c07.acXX` / `0000.0c9f.fXXX`', '`0000.5e00.01XX`', '`0007.b400.XXYY`'],
      ['Default priority', '100', '100 (255 = address owner)', '100'],
      ['Preemption default', 'Off', 'On', 'Off (AVG)'],
      ['Load balancing', 'Per group only', 'Per group only', 'Yes, across AVFs'],
    ],
    note: 'HSRP states: Initial → Learn → Listen → Speak → Standby → Active. HSRP hello 3 s / hold 10 s by default.',
  },
  {
    id: 'syslog', title: 'Syslog severity levels', topic: '5.6',
    columns: ['Level', 'Keyword', 'Meaning'],
    rows: [
      ['0', 'emergencies', 'System unusable'], ['1', 'alerts', 'Immediate action needed'], ['2', 'critical', 'Critical condition'], ['3', 'errors', 'Error condition'],
      ['4', 'warnings', 'Warning condition'], ['5', 'notifications', 'Normal but significant'], ['6', 'informational', 'Informational'], ['7', 'debugging', 'Debug messages'],
    ],
    note: 'Mnemonic: **E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily. `logging trap 4` sends levels 0–4. Format: `%FACILITY-SEVERITY-MNEMONIC: text`, e.g. `%LINK-3-UPDOWN`.',
  },
  {
    id: 'acl', title: 'ACL quick facts', topic: '4.6',
    columns: ['Item', 'Value'],
    rows: [
      ['Standard numbered', '1–99, 1300–1999 (source address only)'], ['Extended numbered', '100–199, 2000–2699 (protocol, src, dst, ports)'],
      ['Processing', 'Top-down, first match wins, implicit `deny any` at the end'], ['Placement', 'Standard: close to the destination · Extended: close to the source'],
      ['Per interface', 'One ACL per interface, per direction, per protocol'], ['`host 10.1.1.1`', 'Same as `10.1.1.1 0.0.0.0`'], ['`any`', 'Same as `0.0.0.0 255.255.255.255`'],
      ['Named ACL edits', 'Insert with a sequence number; remove with `no <seq>`'],
    ],
  },
  {
    id: 'cables', title: 'Cabling & Ethernet', topic: '1.1',
    columns: ['Standard / media', 'Speed', 'Max distance'],
    rows: [
      ['10BASE-T / 100BASE-TX (Cat5)', '10 / 100 Mb/s', '100 m'], ['1000BASE-T (Cat5e/Cat6)', '1 Gb/s', '100 m'], ['10GBASE-T (Cat6a)', '10 Gb/s', '100 m (Cat6: ~55 m)'],
      ['1000BASE-SX (multimode)', '1 Gb/s', '~550 m (50 µm OM2)'], ['1000BASE-LX (single-mode)', '1 Gb/s', '5 km spec (10 km common optics)'],
      ['10GBASE-SR (multimode)', '10 Gb/s', '300 m OM3 / 400 m OM4'], ['10GBASE-LR (single-mode)', '10 Gb/s', '10 km'],
    ],
    note: 'Straight-through connects unlike devices (PC↔switch, router↔switch); crossover connects like devices (switch↔switch, PC↔PC, PC↔router). Auto-MDIX makes either work on most modern ports. Duplex mismatch: late collisions on the half-duplex side, CRC/FCS errors and runts on the full-duplex side.',
  },
  {
    id: 'ifstatus', title: 'Interface status (show ip interface brief)', topic: '2.4',
    columns: ['Status / Protocol', 'Meaning'],
    rows: [
      ['up / up', 'Working'], ['administratively down / down', '`shutdown` configured'],
      ['down / down', 'Layer 1 problem: cable, remote side shut, speed mismatch, bad transceiver'],
      ['up / down', 'Layer 2 problem: encapsulation mismatch, keepalive failure (serial)'], ['down / down (err-disabled)', 'Port shut by a feature: BPDU guard, port security, etc. Recover with `shutdown` then `no shutdown`.'],
    ],
  },
  {
    id: 'wireless', title: 'Wireless', topic: '1.5',
    columns: ['Standard', 'Band(s)', 'Notes'],
    rows: [
      ['802.11b', '2.4 GHz', 'Up to 11 Mb/s'], ['802.11a', '5 GHz', 'Up to 54 Mb/s'], ['802.11g', '2.4 GHz', 'Up to 54 Mb/s'],
      ['802.11n (Wi-Fi 4)', '2.4 / 5 GHz', 'MIMO, up to 600 Mb/s'], ['802.11ac (Wi-Fi 5)', '5 GHz', 'MU-MIMO downlink, wide channels'],
      ['802.11ax (Wi-Fi 6 / 6E)', '2.4 / 5 / 6 GHz (6E)', 'OFDMA, BSS coloring'], ['802.11be (Wi-Fi 7)', '2.4 / 5 / 6 GHz', 'Multi-link operation, 320 MHz channels'],
    ],
    note: '2.4 GHz non-overlapping channels (US): 1, 6, 11. Security: WEP (broken) → WPA/TKIP (deprecated) → WPA2/AES-CCMP → WPA3 (SAE for Personal, 192-bit mode for Enterprise). Enterprise modes authenticate each user with 802.1X/EAP against a RADIUS server.',
  },
  {
    id: 'snmp', title: 'SNMP versions', topic: '5.4',
    columns: ['Version', 'Security'],
    rows: [
      ['v1', 'Community string in clear text'], ['v2c', 'Community string in clear text; adds GetBulk and Inform'],
      ['v3 noAuthNoPriv', 'Username only'], ['v3 authNoPriv', 'Authentication (HMAC-SHA/MD5), no encryption'], ['v3 authPriv', 'Authentication + encryption (AES/DES)'],
    ],
    note: 'Manager polls agents on UDP 161; agents send traps/informs to UDP 162. Informs are acknowledged; traps are not.',
  },
  {
    id: 'nat', title: 'NAT terminology', topic: '4.3',
    columns: ['Term', 'Meaning'],
    rows: [
      ['Inside local', 'Inside host as seen inside (usually a private IP)'], ['Inside global', 'Inside host as seen outside (the translated public IP)'],
      ['Outside global', 'Outside host’s real address'], ['Outside local', 'Outside host as seen from inside (usually equals outside global)'],
      ['PAT / overload', 'Many inside locals share one inside global, tracked by port numbers'],
    ],
  },
  {
    id: 'dns', title: 'DNS record types', topic: '4.4',
    columns: ['Record', 'Maps'],
    rows: [
      ['A', 'Name → IPv4 address'], ['AAAA', 'Name → IPv6 address'], ['CNAME', 'Alias → canonical name (not allowed at the zone apex)'],
      ['MX', 'Domain → mail server hostname with preference (lower = preferred); must not point to a CNAME'],
      ['NS', 'Zone → authoritative name servers'], ['PTR', 'IP address → name (reverse lookup in in-addr.arpa / ip6.arpa)'],
    ],
  },
];
