// Domain 2 — Virtualization. Original flashcards (facts checked against RFC 2784/2890, 4303, 7296, 9300/9301 and 7348 and the IOS XE 17.18.1 YANG models; Cisco-specific details marked in REVIEW-TODO.md).
let n = 0;
const c = (topic, front, back) => ({ id: `d2-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('2.1', 'Type 1 vs type 2 hypervisor?', 'Type 1 (bare-metal) runs on the hardware: ESXi, Hyper-V, KVM, Xen, NFVIS. Type 2 (hosted) runs as an app on a desktop OS: VirtualBox, Workstation, Fusion, Parallels.'),
  c('2.1', 'VM vs container?', 'A VM boots its own guest OS kernel on a hypervisor. A container shares the host kernel (namespaces, cgroups): smaller and faster to start. IOx on Catalyst 9000 hosts containers.'),
  c('2.1', 'Why does a hypervisor vSwitch need no STP?', 'It never forwards frames from one uplink to another and is not a transit switch, so it cannot form a loop. The facing physical port is an edge trunk (`spanning-tree portfast trunk`).'),
  c('2.1', 'StackWise Virtual?', 'Two Catalyst 9000 switches as one logical switch: one control plane (active/standby SSO), both forwarding, joined by the SVL, with dual-active detection; neighbours use multichassis EtherChannel.'),
  c('2.2', 'Create a VRF and put an interface in it (IOS XE)?', '`vrf definition NAME`, `address-family ipv4`, `exit-address-family`; then on the interface `vrf forwarding NAME` followed by `ip address ...`.'),
  c('2.2', 'Side effect of `vrf forwarding`?', 'It removes the interface\'s IPv4 and IPv6 addresses. Re-enter the address afterwards (configure `vrf forwarding` first).'),
  c('2.2', 'Per-VRF routing syntax?', '`ip route vrf A ...`; `router ospf 10 vrf A`; EIGRP and BGP: `address-family ipv4 [unicast] vrf A ...` under the process.'),
  c('2.2', 'Verify and test a VRF?', '`show vrf`, `show vrf detail`, `show ip vrf interfaces`, `show ip route vrf A`, `ping vrf A x.x.x.x`, `traceroute vrf A x.x.x.x`. Plain `ping` uses the global table.'),
  c('2.2', 'GRE protocol number, header size and default IOS XE mode?', 'IP protocol 47; 4-byte base header (+4 key, +4 sequence, RFC 2890); `tunnel mode gre ip` is the default.'),
  c('2.2', 'When is a GRE tunnel up/up?', 'Valid tunnel source (interface up with an IP) and a route to the tunnel destination not via the tunnel. The far end is not checked unless `keepalive` is configured.'),
  c('2.2', 'Recursive routing?', 'The route to the tunnel destination is learned through the tunnel. Log: `%TUN-5-RECURDOWN`; tunnel flaps. Fix: keep underlay prefixes out of the overlay IGP, static route, or front-door VRF.'),
  c('2.2', 'GRE MTU and MSS numbers?', 'GRE/IPv4 overhead 24 bytes: IP MTU 1476, MSS 1436. With IPsec, commonly `ip mtu 1400` and `ip tcp adjust-mss 1360`.'),
  c('2.2', 'IKEv2 ports and initial exchanges?', 'UDP 500, UDP 4500 with NAT-T. IKE_SA_INIT then IKE_AUTH: four messages build the IKE SA and the first Child SA. ESP is IP protocol 50, AH 51.'),
  c('2.2', 'Crypto map vs VTI vs GRE over IPsec?', 'Crypto map: ACL selects traffic, on the physical interface. VTI: `tunnel mode ipsec ipv4` + `tunnel protection`, route-based. GRE over IPsec: GRE tunnel + `tunnel protection`, carries multicast and non-IP.'),
  c('2.2', 'IPsec verification commands?', '`show crypto ikev2 sa` (READY), `show crypto ipsec sa` (encaps/decaps counters, proxy identities), `show crypto session` (UP-ACTIVE), `debug crypto ikev2`.'),
  c('2.3', 'LISP EID vs RLOC?', 'EID = host identity address, unchanged when the host moves. RLOC = underlay address of the ETR where the EID is reachable. The core routes only RLOCs.'),
  c('2.3', 'LISP control message flow and ports?', 'ETR → map server: Map-Register. ITR → map resolver: Map-Request. ETR (or MS as proxy) → ITR: Map-Reply. Control UDP 4342, data UDP 4341, 8-byte LISP header.'),
  c('2.3', 'PITR vs PETR?', 'PITR: ITR for non-LISP sites, the way in to LISP EIDs. PETR: ETR for LISP sites sending to non-LISP destinations, the way out.'),
  c('2.3', 'VXLAN key numbers?', 'UDP 4789; 8-byte header; 24-bit VNI (~16 million); 50 bytes overhead, so the underlay needs IP MTU ≥ 1550 for 1500-byte inner packets.'),
  c('2.3', 'VXLAN BUM handling options?', 'Underlay multicast (VNI → group, PIM), ingress/head-end replication (unicast copy per peer VTEP), BGP EVPN control plane with ARP suppression to reduce flooding.'),
  c('2.3', 'VXLAN L2 vs L3 gateway?', 'L2 gateway bridges VLAN ↔ VNI in the same subnet. L3 gateway routes between VNIs or to non-VXLAN networks (often a distributed anycast gateway).'),
];
