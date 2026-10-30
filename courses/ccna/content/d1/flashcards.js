// Domain 1 — Network Infrastructure and Connectivity: flashcards.
export default [
  // 1.1
  { id: 'd1-f001', topic: '1.1', front: 'Maximum channel length of twisted-pair Ethernet?', back: '**100 m**: up to 90 m of permanent horizontal cable plus up to 10 m of patch cords.' },
  { id: 'd1-f002', topic: '1.1', front: 'Minimum UTP category for 10GBASE-T at 100 m?', back: '**Cat6a** (500 MHz). Cat6 supports 10GBASE-T only to about 55 m; Cat5e is rated for 1000BASE-T (and 2.5GBASE-T under 802.3bz), not 10GBASE-T.' },
  { id: 'd1-f003', topic: '1.1', front: 'Straight-through vs crossover: when is each used (without Auto-MDIX)?', back: 'Straight-through: unlike devices (PC/router/AP to switch). Crossover: like devices (switch-switch, router-router, PC-PC, PC-router).' },
  { id: 'd1-f004', topic: '1.1', front: 'What does Auto-MDIX do, and what commonly disables it?', back: 'It detects the cable type and swaps Tx/Rx pairs internally. On many platforms it works only with `speed auto`; hard-coding speed can disable it.' },
  { id: 'd1-f005', topic: '1.1', front: 'Single-mode vs multimode fiber: core size, light source, reach?', back: 'SMF: ~9 µm core, 1310/1550 nm lasers, kilometers. MMF: 50/62.5 µm core, 850 nm VCSEL/LED, hundreds of meters.' },
  { id: 'd1-f006', topic: '1.1', front: '10GBASE-SR vs 10GBASE-LR?', back: 'SR: multimode, 850 nm, ~300 m (OM3) / 400 m (OM4). LR: single-mode, 1310 nm, 10 km.' },
  { id: 'd1-f007', topic: '1.1', front: 'LC vs SC fiber connectors?', back: 'LC: small form-factor push-latch (1.25 mm ferrule), standard on SFP/SFP+. SC: larger square push-pull connector (2.5 mm ferrule).' },
  { id: 'd1-f008', topic: '1.1', front: 'Duplex mismatch: which counters rise on each side?', back: 'Half-duplex side: **late collisions** (and collisions). Full-duplex side: **CRC/FCS errors and runts**. The link stays up/up.' },
  { id: 'd1-f009', topic: '1.1', front: 'How do you recover an err-disabled port?', back: 'Fix the cause, then `shutdown` / `no shutdown`, or configure `errdisable recovery cause <cause>` for automatic recovery.' },
  { id: 'd1-f010', topic: '1.1', front: 'Common causes of a low optical Rx power reading (dBm)?', back: 'Dirty or damaged connectors, tight bends, broken or bad splices, run too long for the optic, wrong fiber type. Compare readings at both ends.' },

  // 1.2
  { id: 'd1-f011', topic: '1.2', front: 'Type 1 vs type 2 hypervisor?', back: 'Type 1 (bare-metal) runs directly on hardware: ESXi, Hyper-V, KVM, Xen. Type 2 (hosted) runs on a host OS: VirtualBox, VMware Workstation/Fusion.' },
  { id: 'd1-f012', topic: '1.2', front: 'Key difference between a VM and a container?', back: 'A VM includes a full guest OS and kernel on virtual hardware. A container shares the host kernel and packages only the app and its dependencies.' },
  { id: 'd1-f013', topic: '1.2', front: 'Examples of container runtimes vs orchestrators?', back: 'Runtimes (run containers on one host): Docker Engine, containerd, CRI-O, Podman. Orchestrators (manage clusters): Kubernetes, Docker Swarm.' },
  { id: 'd1-f014', topic: '1.2', front: 'What is a virtual switch (vSwitch)?', back: "A software Layer 2 switch in the hypervisor connecting VM vNICs to each other and to the host's physical NIC uplinks, usually tagging VLANs on an 802.1Q trunk." },
  { id: 'd1-f015', topic: '1.2', front: 'Does traffic between two VMs on the same host and port group touch the physical switch?', back: 'No. The vSwitch switches it inside the host.' },

  // 1.3
  { id: 'd1-f016', topic: '1.3', front: 'RFC 1918 private ranges?', back: '10.0.0.0/8, 172.16.0.0/12 (172.16-172.31), 192.168.0.0/16.' },
  { id: 'd1-f017', topic: '1.3', front: 'What does a 169.254.x.x address on a client mean?', back: 'APIPA / IPv4 link-local: the host is set for DHCP but got no response, so it self-assigned an address with mask /16 and no gateway.' },
  { id: 'd1-f018', topic: '1.3', front: 'What is 100.64.0.0/10?', back: 'Shared address space for carrier-grade NAT (RFC 6598). Not RFC 1918 and not routed on the internet.' },
  { id: 'd1-f019', topic: '1.3', front: 'Block-size method: how do you find the network address?', back: 'Block = 256 - mask value in the interesting octet. The network is the largest multiple of the block at or below the address in that octet.' },
  { id: 'd1-f020', topic: '1.3', front: 'Mask and usable hosts for /20?', back: '255.255.240.0, 4094 usable hosts (block 16 in the third octet).' },
  { id: 'd1-f021', topic: '1.3', front: 'Network, broadcast, and host range of 192.168.10.77/27?', back: 'Network .64, broadcast .95, hosts .65 - .94 (block 32).' },
  { id: 'd1-f022', topic: '1.3', front: 'What does the IOS message "% 10.10.4.0 overlaps with GigabitEthernet0/0/1" mean?', back: "The address/mask you entered falls in a subnet that overlaps a subnet already on another of the router's interfaces; IOS rejects it." },
  { id: 'd1-f023', topic: '1.3', front: 'What does `%IP-4-DUPADDR` tell you, and what is the next step?', back: 'Another device (MAC shown after "sourced by") is using the router interface address. Trace that MAC with `show mac address-table address <mac>`.' },

  // 1.4
  { id: 'd1-f024', topic: '1.4', front: 'IPv6 prefixes for GUA, ULA, link-local, and multicast?', back: 'GUA 2000::/3, ULA FC00::/7 (FD00::/8 used), link-local FE80::/10, multicast FF00::/8.' },
  { id: 'd1-f025', topic: '1.4', front: 'FF02::1 vs FF02::2?', back: 'FF02::1 = all nodes on the link. FF02::2 = all routers on the link.' },
  { id: 'd1-f026', topic: '1.4', front: 'The two IPv6 abbreviation rules?', back: 'Drop leading zeros in each hextet. Replace one run of all-zero hextets with `::`, used only once per address.' },
  { id: 'd1-f027', topic: '1.4', front: 'Modified EUI-64 steps?', back: 'Split the MAC in half, insert FFFE, flip the 7th bit (U/L) of the first byte. Example: 001A.2B3C.4D5E becomes 021A:2BFF:FE3C:4D5E.' },
  { id: 'd1-f028', topic: '1.4', front: 'How many /64s fit in a /48? In a /56?', back: '/48: 2^16 = 65,536. /56: 2^8 = 256.' },
  { id: 'd1-f029', topic: '1.4', front: 'Solicited-node multicast address format?', back: 'FF02::1:FF + the last 24 bits of the unicast address. Example: 2001:DB8::1 maps to FF02::1:FF00:1.' },
  { id: 'd1-f030', topic: '1.4', front: 'What does `ipv6 unicast-routing` add?', back: 'IPv6 forwarding, and the router joins FF02::2 and sends Router Advertisements. Without it, hosts get no RA, so no SLAAC and no IPv6 gateway.' },
  { id: 'd1-f031', topic: '1.4', front: 'RA M flag vs O flag?', back: 'M (managed) = get addresses from stateful DHCPv6. O (other) = use SLAAC for the address but get DNS and other options from stateless DHCPv6.' },
  { id: 'd1-f032', topic: '1.4', front: 'Where does an IPv6 host get its default gateway?', back: "From Router Advertisements: the router's **link-local** address. DHCPv6 has no default-gateway option." },

  // 1.5
  { id: 'd1-f033', topic: '1.5', front: 'Non-overlapping 2.4 GHz channels (US)?', back: '**1, 6, and 11**.' },
  { id: 'd1-f034', topic: '1.5', front: 'Rule of 3s and 10s?', back: '+3 dB doubles power, -3 dB halves it; +10 dB multiplies by 10, -10 dB divides by 10.' },
  { id: 'd1-f035', topic: '1.5', front: 'Convert 0, 10, 17, 20, and 30 dBm to mW.', back: '0 dBm = 1 mW, 10 = 10 mW, 17 = 50 mW, 20 = 100 mW, 30 = 1 W.' },
  { id: 'd1-f036', topic: '1.5', front: 'How is SNR calculated, and what are typical voice targets?', back: 'SNR = signal (dBm) - noise (dBm). Voice targets: RSSI -67 dBm or better and SNR 25 dB or more.' },
  { id: 'd1-f037', topic: '1.5', front: 'Co-channel vs adjacent-channel interference?', back: 'CCI: same channel, so stations share airtime (contention, lower capacity). ACI: overlapping channels (e.g., 1 and 3), which corrupts frames and causes retries.' },
  { id: 'd1-f038', topic: '1.5', front: 'WPA2 vs WPA3 Personal authentication?', back: 'WPA2: PSK (handshake can be attacked offline). WPA3: SAE (no offline dictionary attack, forward secrecy), with PMF mandatory.' },
  { id: 'd1-f039', topic: '1.5', front: 'The three 802.1X roles in a WLAN?', back: 'Supplicant = client. Authenticator = AP or WLC. Authentication server = RADIUS (e.g., Cisco ISE).' },
  { id: 'd1-f040', topic: '1.5', front: 'Security requirement on the 6 GHz band?', back: 'WPA3 (SAE or Enterprise) or OWE for open networks, with PMF. WPA2 and legacy open networks are not allowed.' },

  // 1.6
  { id: 'd1-f041', topic: '1.6', front: 'Windows tracert vs Linux/macOS traceroute default probe?', back: 'Windows `tracert` uses ICMP Echo. Linux/macOS `traceroute` uses UDP to high ports (use `-I` for ICMP).' },
  { id: 'd1-f042', topic: '1.6', front: 'macOS `ifconfig` shows `netmask 0xfffffe00`. Prefix length?', back: '255.255.254.0 = **/23**.' },
  { id: 'd1-f043', topic: '1.6', front: 'Linux `/etc/resolv.conf` shows `nameserver 127.0.0.53`. Meaning?', back: 'The systemd-resolved local stub. Run `resolvectl status` to see the real upstream DNS servers.' },
  { id: 'd1-f044', topic: '1.6', front: 'Which Windows command shows the SSID, BSSID, channel, authentication, cipher, and signal?', back: '`netsh wlan show interfaces`' },

  // 1.7
  { id: 'd1-f045', topic: '1.7', front: 'DHCPv4 ports and DORA order?', back: 'Server UDP 67, client UDP 68. Discover, Offer, Request, Ack. Discover and Request are broadcast by a new client.' },
  { id: 'd1-f046', topic: '1.7', front: 'Where does `ip helper-address` go?', back: 'On the **client-facing** interface (SVI or subinterface) that receives the broadcasts, pointing to the DHCP server IP.' },
  { id: 'd1-f047', topic: '1.7', front: 'What is giaddr?', back: 'The relay agent writes its receiving interface IP into giaddr; the server uses it to choose the matching pool and to send replies back to the relay.' },
  { id: 'd1-f048', topic: '1.7', front: 'Is `ip dhcp excluded-address` configured inside the pool?', back: 'No. It is a **global** command, e.g., `ip dhcp excluded-address 192.168.10.1 192.168.10.20`.' },
  { id: 'd1-f049', topic: '1.7', front: 'AD of a default route learned with `ip address dhcp`?', back: '**254**, so any manually configured static default (AD 1) overrides it.' },
  { id: 'd1-f050', topic: '1.7', front: 'DHCP lease renewal timers T1 and T2?', back: 'T1 = 50% of the lease: unicast renewal to the original server. T2 = 87.5%: broadcast rebind to any server.' },

  // Expansion set
  { id: 'd1-f051', topic: '1.1', front: 'TDR shows pairs C and D "Open" at 31 m. Effect?', back: 'Broken or unterminated conductors (pins 4/5, 7/8) about 31 m out. 1000BASE-T needs all four pairs; 100BASE-TX uses only pins 1, 2, 3, 6.' },
  { id: 'd1-f052', topic: '1.1', front: 'Total output drops rising, but zero CRC/input/output errors?', back: 'Egress **congestion**: the output queue overflows (check txload). Add bandwidth or apply QoS; the cable is not the problem.' },
  { id: 'd1-f053', topic: '1.1', front: 'What do giants indicate?', back: "Frames larger than the port's maximum (1518 bytes, 1522 tagged), usually an MTU or jumbo-frame mismatch with the neighbor." },
  { id: 'd1-f054', topic: '1.2', front: 'Docker `PORTS` shows `0.0.0.0:8080->80/tcp`. Meaning?', back: 'Host port 8080 on all IPv4 addresses is published (NATed) to container port 80. Users connect to `<host-IP>:8080`.' },
  { id: 'd1-f055', topic: '1.2', front: "Docker's default bridge subnet, and the classic conflict?", back: '`docker0` = 172.17.0.0/16. It overlaps any enterprise 172.17.x.x subnet, so the host sends that traffic to docker0. Change `bip`/`default-address-pools`.' },
  { id: 'd1-f056', topic: '1.3', front: 'What does a /31 provide?', back: 'Two addresses, both usable, for point-to-point links only (RFC 3021). No network or broadcast address.' },
  { id: 'd1-f057', topic: '1.3', front: 'Linux `ip addr add 10.60.8.25 dev eth0` (no prefix). Result?', back: 'A **/32**: no connected subnet route, so adding a gateway fails with "Nexthop has invalid gateway". Always give `/prefix`.' },
  { id: 'd1-f058', topic: '1.4', front: 'Why does SLAAC fail if a router LAN interface is /60?', back: 'SLAAC needs a **/64** prefix plus a 64-bit interface ID. Hosts ignore a prefix of any other length for autoconfiguration.' },
  { id: 'd1-f059', topic: '1.4', front: 'Windows netsh IPv6 Addr Type: Public, Temporary, Dhcp?', back: 'Public = stable SLAAC address. Temporary = RFC 4941 privacy address. Dhcp = stateful DHCPv6. Windows randomizes interface IDs by default (not EUI-64).' },
  { id: 'd1-f060', topic: '1.5', front: 'What happens when an AP detects radar on a DFS channel?', back: 'It leaves the channel and cannot use it for **30 minutes** (non-occupancy); clients briefly disconnect. DFS applies to U-NII-2A (52-64) and U-NII-2C (100-144).' },
  { id: 'd1-f061', topic: '1.5', front: 'What is OWE (Wi-Fi Enhanced Open)?', back: 'Encryption for open SSIDs: a per-client Diffie-Hellman exchange creates unique keys. No password, and no user or AP authentication.' },
  { id: 'd1-f062', topic: '1.6', front: 'Windows: why can ping and nslookup resolve a name to different IPs?', back: 'nslookup queries the DNS server directly. ping and browsers use the Windows resolver, which checks the **hosts file** (and cache) first.' },
  { id: 'd1-f063', topic: '1.6', front: 'Linux `<NO-CARRIER,...,UP> state DOWN` means?', back: 'Admin up (UP flag) but **no physical link**. Check the cable, wall jack, and switch port; DHCP cannot work until the link is up.' },
  { id: 'd1-f064', topic: '1.7', front: 'IOS manual DHCP binding: `client-identifier` or `hardware-address`?', back: 'DHCP clients are matched by `client-identifier` (01 + MAC, e.g. `0100.1b78.3c2e.91`). `hardware-address` is for BOOTP clients that send no client ID.' },
  { id: 'd1-f065', topic: '1.7', front: 'What does `no service dhcp` do on IOS?', back: 'Disables the DHCP **server and relay agent** globally. Pools and helper addresses stay in the config but do nothing.' },
];
