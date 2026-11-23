// Domain 2 — Virtualization. Original questions modelled on Cisco's public exam-topic wording; no recalled exam content. Protocol facts checked against RFC 2784/2890, 4301/4303, 7296, 9300/9301 and 7348; IOS XE keywords against the IOS XE 17.18.1 YANG models; output layouts modelled on real IOS XE output in Cisco's genieparser test files. All device output is documentation-based and listed in REVIEW-TODO.md for checking on lab gear.
const L211 = '2.1-hypervisors';
const L212 = '2.1-virtual-machines';
const L213 = '2.1-virtual-switching';
const L22V = '2.2-vrf-lite';
const L22T = '2.2-gre-ipsec';
const L23L = '2.3-lisp';
const L23X = '2.3-vxlan';

const bank = [
  // ---------- 2.1 Device virtualization ----------
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L211,
    stem: 'Refer to the exhibit. Which statement about the hypervisors on these three hosts is true?',
    exhibit: `Host     Installed directly on the hardware      Workloads
-------  --------------------------------------  ------------------------------------------
SRV-01   VMware ESXi 8.0                         C8000V-1, Ubuntu jump host
SRV-02   Ubuntu Server 24.04 with KVM enabled    Virtual firewall, C8000V-2
LAP-07   Windows 11 Pro                          VMware Workstation Pro -> CML VM -> routers`,
    options: ['SRV-01 and SRV-02 run type 1 hypervisors; LAP-07 runs a type 2 hypervisor', 'Only SRV-01 runs a type 1 hypervisor, because KVM needs a full Linux installation and is therefore type 2', 'LAP-07 runs a type 1 hypervisor, because CML inside it runs nested virtual machines', 'All three run type 2 hypervisors, because each has an operating system installed on the hardware'],
    answer: [0],
    explanation: "ESXi runs directly on the hardware (type 1). KVM turns the Linux kernel itself into the hypervisor and is classed as type 1 by Cisco and most references, even though some authors call it a hybrid. VMware Workstation is an application on Windows, so LAP-07 runs a type 2 hypervisor; nesting CML inside it does not change the type of the outer hypervisor. ESXi is a purpose-built hypervisor, not a general-purpose OS with a hypervisor application on top, so the \"all type 2\" option is wrong." },
  { topic: '2.1', type: 'multi', difficulty: 1, lesson: L211,
    stem: 'Which two statements describe a type 2 hypervisor? (Choose two.)',
    options: ['It runs as an application on top of a general-purpose host operating system', 'All of its virtual machines stop if the host operating system crashes or reboots', 'It is installed directly on the server hardware with no host operating system', 'It is the usual platform for production NFV such as Cisco NFVIS', 'VMware ESXi and Microsoft Hyper-V are examples'],
    answer: [0, 1],
    explanation: "A type 2 (hosted) hypervisor such as VirtualBox, VMware Workstation or Fusion runs on a host OS, so the host OS is part of every VM's failure domain. Running directly on the hardware describes a type 1 (bare-metal) hypervisor. Production NFV platforms, NFVIS included, are type 1. ESXi and Hyper-V are type 1 hypervisors." },
  { topic: '2.1', type: 'match', difficulty: 2, lesson: L213,
    stem: 'Match each scenario to the virtualization technology that fits it.',
    pairs: [
      ['Twenty ESXi hosts must share one virtual switch configuration that is defined once in vCenter', 'Distributed virtual switch'],
      ['Two Catalyst 9500 core switches must act as one logical switch so each access switch can use a single EtherChannel to both', 'StackWise Virtual'],
      ['An engineer runs a CML lab VM inside VMware Workstation on a Windows laptop', 'Type 2 hypervisor'],
      ['A monitoring agent runs on a Catalyst 9300 next to IOS XE and shares the switch operating system kernel', 'Container (IOx application hosting)'],
      ['A branch appliance runs a Catalyst 8000V and a virtual firewall on a hypervisor installed directly on its hardware', 'Type 1 hypervisor'],
    ],
    explanation: "A distributed switch (VMware vDS) is defined once in vCenter and spans hosts; a standard vSwitch is configured per host. StackWise Virtual joins two Catalyst 9000 switches into one control plane so neighbours can build multichassis EtherChannel. Workstation on Windows is a hosted (type 2) hypervisor. IOx application hosting on Catalyst 9000 runs containers, which share the host kernel. A hypervisor on the appliance's hardware, such as NFVIS on a Catalyst 8200 uCPE or ENCS, is type 1." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L213,
    stem: 'Refer to the exhibit. An ESXi host connects to SW1 with two uplinks. vSwitch0 uses the "Route based on IP hash" teaming policy. Users report intermittent loss to VMs on the host, and SW1 logs MAC flapping. What should the engineer change?',
    exhibit: `ESXi host: vSwitch0 (standard switch), uplinks vmnic0 -> Gi1/0/10, vmnic1 -> Gi1/0/11
           NIC teaming: Route based on IP hash

SW1# show running-config interface GigabitEthernet1/0/10
interface GigabitEthernet1/0/10
 switchport mode trunk
 channel-group 10 mode active
end

SW1# show etherchannel 10 summary
<legend omitted>
Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
10     Po10(SD)        LACP      Gi1/0/10(I)  Gi1/0/11(I)

%SW_MATM-4-MACFLAP_NOTIF: Host 0050.5601.0a0b in vlan 20 is flapping between port Gi1/0/10 and port Gi1/0/11`,
    options: ['Change both member ports to channel-group 10 mode on, because IP-hash teaming on a standard vSwitch needs a static EtherChannel', 'Change both member ports to channel-group 10 mode passive so that the ESXi host can start LACP', 'Enable spanning-tree bpduguard on both ports to stop the loop caused by the vSwitch', 'Remove the EtherChannel and configure the ESXi host to run Spanning Tree on vSwitch0'],
    answer: [0],
    explanation: "IP-hash teaming sends a MAC address's traffic out of either uplink, so the physical side must bundle the ports. A standard vSwitch does not run LACP, so `mode active` never bundles: the ports are stand-alone `(I)`, Po10 is down `(SD)`, and SW1 sees the VM MAC on both ports and logs flapping. `mode on` (static) matches IP hash. `mode passive` waits for LACP that the standard vSwitch never sends. A hypervisor vSwitch does not send BPDUs or forward between uplinks, so there is no STP loop to guard against, and it cannot run STP." },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L212,
    stem: 'A team is deciding whether to package a network monitoring tool as a virtual machine or as a container. Which statement correctly contrasts the two?',
    options: ['Each VM runs its own guest operating system kernel, while containers share the host kernel', 'Containers can run any operating system regardless of the host kernel, while VMs cannot', 'VMs start faster than containers because they do not need a guest operating system', 'Containers require a type 1 hypervisor, while VMs require a type 2 hypervisor'],
    answer: [0],
    explanation: "A VM virtualizes hardware and boots a full guest OS with its own kernel; a container isolates processes with namespaces and cgroups on the host's kernel. That is why a Linux container needs a Linux kernel, the opposite of the second option. Containers start faster because there is no OS to boot. Containers need no hypervisor at all, and VMs can run on either hypervisor type." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L213,
    stem: 'Refer to the exhibit. VMs in port group Servers are supposed to be in VLAN 20 (10.20.0.0/24, gateway 10.20.0.1 on SW1), but they cannot reach the gateway, and a packet capture shows their ARP requests arriving in VLAN 1. Which change fixes the problem?',
    exhibit: `vSwitch0 port group "Servers": VLAN ID 0 (none), uplink vmnic0 -> SW1 Gi1/0/12

SW1# show running-config interface GigabitEthernet1/0/12
interface GigabitEthernet1/0/12
 switchport trunk allowed vlan 1,20,30
 switchport mode trunk
 spanning-tree portfast trunk
end`,
    options: ['Set the Servers port group VLAN ID to 20 so the vSwitch tags the VMs\' frames for the trunk', 'Change Gi1/0/12 to switchport mode access in VLAN 1', 'Remove spanning-tree portfast trunk, because PortFast blocks tagged frames', 'Set the port group VLAN ID to 4095 so that the vSwitch tags the frames with VLAN 20'],
    answer: [0],
    explanation: "With VLAN ID 0 the vSwitch sends the VMs' frames untagged (external switch tagging), and an untagged frame arriving on an 802.1Q trunk belongs to the native VLAN, VLAN 1 here. Setting the port group to VLAN 20 (virtual switch tagging) makes the vSwitch tag the frames, and VLAN 20 is allowed on the trunk. Making the port an access port in VLAN 1 keeps the VMs in the wrong VLAN. PortFast only skips listening and learning; it does not drop tagged frames. VLAN 4095 on a standard vSwitch is guest tagging: the vSwitch passes tags through and expects the guest OS to tag, so it would not tag on the VMs' behalf." },

  // ---------- 2.2 VRF ----------
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22V,
    stem: 'Refer to the exhibit. The engineer must confirm from R1 that 10.40.0.1 is reachable. Enter the complete command that tests reachability to 10.40.0.1 using the correct routing table.',
    exhibit: `R1# show vrf
Name                             Default RD            Protocols   Interfaces
GUEST                            <not set>             ipv4        Gi0/0/2
STAFF                            65000:10              ipv4        Gi0/0/1
                                                                   Tu10

R1# ping 10.40.0.1
.....
Success rate is 0 percent (0/5)

R1# show ip route vrf STAFF 10.40.0.1

Routing Table: STAFF
Routing entry for 10.40.0.0/24
  Known via "ospf 10", distance 110, metric 1001, type intra area
  Last update from 172.16.10.2 on Tunnel10, 00:05:12 ago
  Routing Descriptor Blocks:
  * 172.16.10.2, from 10.255.0.2, 00:05:12 ago, via Tunnel10
      Route metric is 1001, traffic share count is 1`,
    answer: ['ping vrf STAFF 10.40.0.1', 'ping vrf STAFF ip 10.40.0.1'],
    explanation: "The route to 10.40.0.0/24 exists only in VRF STAFF (learned by OSPF process 10 over Tunnel10, which `show vrf` lists as a STAFF interface). A plain `ping` uses the global table, which has no route, so it fails. `ping vrf STAFF 10.40.0.1` looks up the destination in the STAFF table and sources the packets from the STAFF egress interface." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22V,
    stem: 'Refer to the exhibit. R1 and R2 are connected on subinterface .10. R2 is configured correctly, but no OSPF adjacency forms and show ip ospf neighbor on R1 is empty. What is the cause?',
    exhibit: `R1# show running-config | section 0/0/2.10|router ospf
interface GigabitEthernet0/0/2.10
 encapsulation dot1Q 10
 vrf forwarding CUST-A
 ip address 172.16.10.1 255.255.255.252
router ospf 1
 router-id 10.255.0.1
 network 172.16.10.0 0.0.0.3 area 0`,
    options: ['OSPF process 1 belongs to the global routing table, so its network statement cannot match an interface in VRF CUST-A', 'The wildcard mask 0.0.0.3 does not match a /30 subnet', 'OSPF cannot run on 802.1Q subinterfaces', 'VRF CUST-A needs a route distinguisher before OSPF can run in it'],
    answer: [0],
    explanation: "A routing process without the `vrf` keyword runs in the global table and only considers global interfaces. Gi0/0/2.10 is in CUST-A, so it never joins process 1. The fix is a VRF-bound process, for example `router ospf 10 vrf CUST-A` with the same network statement. 0.0.0.3 is the correct wildcard for a /30. OSPF runs on subinterfaces normally. An RD is not needed for OSPF in a VRF-Lite design; it matters only when VRF routes are carried in MP-BGP." },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L22V,
    stem: 'Subinterface Gi0/0/2.30 on R1 already has encapsulation dot1Q 30 and IP address 172.16.30.1/30 in the global table. The engineer must move it into a new VRF named CUST-C (IPv4) and prove that the neighbor 172.16.30.2 answers. Typing each command exactly once in one session, put the steps in the order that works.',
    items: ['vrf definition CUST-C', 'address-family ipv4', 'interface GigabitEthernet0/0/2.30', 'vrf forwarding CUST-C', 'ip address 172.16.30.1 255.255.255.252', 'ping vrf CUST-C 172.16.30.2'],
    explanation: "The VRF must exist before an interface can reference it, and `address-family ipv4` is a sub-mode of `vrf definition`, so it follows immediately (leaving with `exit-address-family`). Then enter the subinterface and apply `vrf forwarding CUST-C`, which removes the existing IPv4 address, so the `ip address` command must come after it. Finally test with `ping vrf CUST-C`, because a plain ping would use the global table, which no longer contains this subnet." },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L22V,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `R1# show ip route vrf CUST-B

Routing Table: CUST-B
Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
<legend lines omitted>

Gateway of last resort is 172.16.20.2 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 172.16.20.2
      10.0.0.0/8 is variably subnetted, 3 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0/3
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0/3
O        10.2.2.0/24 [110/2] via 172.16.20.2, 00:03:10, GigabitEthernet0/0/2.20
      172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C        172.16.20.0/30 is directly connected, GigabitEthernet0/0/2.20
L        172.16.20.1/32 is directly connected, GigabitEthernet0/0/2.20`,
    options: ['The default route is a static route configured for VRF CUST-B, for example with ip route vrf CUST-B 0.0.0.0 0.0.0.0 172.16.20.2', '10.2.2.0/24 was learned by an OSPF process that is bound to VRF CUST-B', 'A plain ping 10.2.2.1 from R1 uses this table', 'GigabitEthernet0/0/3 is in the global routing table', 'Because 10.1.1.0/24 is in CUST-B, no other VRF on R1 can use 10.1.1.0/24'],
    answer: [0, 1],
    explanation: "Routes appear in a VRF table only if they were configured or learned in that VRF: the `S*` default is a per-VRF static (`ip route vrf CUST-B ...`) and the `O` route comes from an OSPF process bound to CUST-B (`router ospf N vrf CUST-B`). A plain ping uses the global table; you need `ping vrf CUST-B`. Gi0/0/3 owns a connected route in this table, so it is in CUST-B, not global. Overlapping prefixes in different VRFs are exactly what VRFs allow." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22V,
    stem: 'Refer to the exhibit. After this change, hosts on Gi0/0/3 can no longer reach their default gateway 10.1.1.1. What must the engineer do?',
    exhibit: `R1(config)# interface GigabitEthernet0/0/3
R1(config-if)# ip address 10.1.1.1 255.255.255.0
R1(config-if)# vrf forwarding CUST-B
% Interface GigabitEthernet0/0/3 IPv4 disabled and address(es) removed due to enabling VRF CUST-B
R1(config-if)# end`,
    options: ['Re-enter ip address 10.1.1.1 255.255.255.0 on Gi0/0/3, because vrf forwarding removed it', 'Add rd 65000:2 under vrf definition CUST-B, because a VRF without an RD drops traffic', 'Configure ip routing vrf CUST-B in global configuration', 'Issue shutdown and no shutdown on Gi0/0/3 to activate the VRF'],
    answer: [0],
    explanation: "The console message is the clue: applying `vrf forwarding` removes the interface's IP addresses. The address has to be configured again after the interface is in the VRF; best practice is to enter `vrf forwarding` first. An RD is not required for VRF-Lite forwarding. `ip routing vrf` is not the fix here, and bouncing the interface does not restore a removed address." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22V,
    stem: 'Refer to the exhibit. Hosts in VRF CUST-A must send all traffic that has no more specific route to R2 at 172.16.10.2. Enter the single global configuration command that adds this route to VRF CUST-A only.',
    exhibit: `R1# show ip route vrf CUST-A | begin Gateway
Gateway of last resort is not set

      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0/1
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0/1
      172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C        172.16.10.0/30 is directly connected, GigabitEthernet0/0/2.10
L        172.16.10.1/32 is directly connected, GigabitEthernet0/0/2.10`,
    answer: ['ip route vrf CUST-A 0.0.0.0 0.0.0.0 172.16.10.2', 'ip route vrf CUST-A 0.0.0.0 0.0.0.0 GigabitEthernet0/0/2.10 172.16.10.2', 'ip route vrf CUST-A 0.0.0.0 0.0.0.0 Gi0/0/2.10 172.16.10.2'],
    explanation: "A static route lands in a VRF only when the command names it: `ip route vrf CUST-A 0.0.0.0 0.0.0.0 172.16.10.2`. The next hop 172.16.10.2 is resolved in CUST-A through the connected subnet on Gi0/0/2.10. Without `vrf CUST-A` the route would go into the global table, which the CUST-A hosts never use." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22V,
    stem: 'An engineer deploys VRF-Lite on two Catalyst 9500 core switches with one OSPF process per VRF and no BGP anywhere. Which statement about route distinguishers in this design is true?',
    options: ['An RD is optional, because it is only used to make prefixes unique when VRF routes are carried in MP-BGP', 'The RD must match on both switches or the per-VRF OSPF adjacencies will not form', 'The RD controls which routes are imported into the VRF from other VRFs', 'Each VRF needs an RD before any interface can be assigned to it with vrf forwarding'],
    answer: [0],
    explanation: "The RD is prepended to IPv4 prefixes to make VPNv4 routes unique in MP-BGP. In a pure VRF-Lite design with per-VRF IGPs it has no role, so with `vrf definition` it can be left out (many engineers set one anyway). RDs are never exchanged by OSPF, so they cannot affect adjacencies. Importing and exporting between VRFs is the job of route targets, not RDs. Interfaces can be assigned to a VRF that has an address family but no RD." },

  // ---------- 2.2 GRE and IPsec ----------
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22T,
    stem: 'Refer to the exhibit. Tunnel0 on R1 stays up/down. What is the cause?',
    exhibit: `R1# show interfaces Tunnel0
Tunnel0 is up, line protocol is down
  Hardware is Tunnel
  Internet address is 172.16.0.1/30
  MTU 9976 bytes, BW 100 Kbit/sec, DLY 50000 usec,
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation TUNNEL, loopback not set
  Keepalive not set
  Tunnel linestate evaluation down - no output interface
  Tunnel source 203.0.113.1 (GigabitEthernet0/0/0), destination 198.51.100.2
  Tunnel protocol/transport GRE/IP
<output omitted>

R1# show ip route 198.51.100.2
% Network not in table`,
    options: ['R1 has no route to the tunnel destination 198.51.100.2', 'R2 is powered off, so R1 receives no GRE packets', 'The tunnel mode is wrong; it should be tunnel mode ipsec ipv4', 'Tunnel0 has no IP address, so its line protocol cannot come up'],
    answer: [0],
    explanation: "A GRE tunnel's line protocol needs a usable source and a route to the destination. `no output interface` together with `% Network not in table` shows that R1 cannot route to 198.51.100.2; a default route toward the ISP fixes it. Without keepalives, R1 does not check the far end at all, so R2 being down would leave the tunnel up/up. GRE/IP is the intended (default) mode. The tunnel has an address, 172.16.0.1/30." },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L22T,
    stem: 'Refer to the exhibit. R1 reaches the internet with a static default route to its ISP and runs OSPF with R2 over Tunnel0 (tunnel destination 198.51.100.2). Tunnel0 goes down and comes back every minute or so. What is the best fix?',
    exhibit: `R1# show logging | include TUN
*Nov 18 10:14:07.315: %TUN-5-RECURDOWN: Tunnel0 temporarily disabled due to recursive routing

R1# show running-config | section router ospf
router ospf 1
 network 0.0.0.0 255.255.255.255 area 0

R1# show ip route 198.51.100.2
Routing entry for 198.51.100.0/30
  Known via "ospf 1", distance 110, metric 1001, type intra area
  Last update from 172.16.0.2 on Tunnel0, 00:00:04 ago
  Routing Descriptor Blocks:
  * 172.16.0.2, from 10.255.0.2, 00:00:04 ago, via Tunnel0
      Route metric is 1001, traffic share count is 1`,
    options: ['Replace the catch-all network statement on both routers with statements that match only the tunnel and LAN subnets, so the underlay subnet is not learned over the tunnel', 'Configure keepalive 5 3 on Tunnel0 so the tunnel recovers faster', 'Change Tunnel0 to tunnel mode ipsec ipv4', 'Lower the tunnel IP MTU to 1400 bytes'],
    answer: [0],
    explanation: "The route to the tunnel destination 198.51.100.2 is learned **through Tunnel0** (a /30 from OSPF is more specific than R1's static default, so it wins), which is recursive routing: the log line confirms it. The `network 0.0.0.0 255.255.255.255` statements advertise the underlay subnets into OSPF. Advertising only the overlay and LAN subnets (or a specific static route to the destination, or a front-door VRF) keeps the destination reachable through the underlay. Keepalives, the tunnel mode and the MTU do not change which route is used to reach the destination." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22T,
    stem: 'Refer to the exhibit. The underlay path MTU is 1500 bytes everywhere and the tunnel carries no IPsec. Enter the value for ip tcp adjust-mss on Tunnel0 that is the largest MSS that avoids fragmentation, assuming 20-byte IPv4 and TCP headers with no options.',
    exhibit: `R1# show interfaces Tunnel0 | include protocol|Key|transport MTU
Tunnel0 is up, line protocol is up
  Tunnel protocol/transport GRE/IP
    Key disabled, sequencing disabled
  Tunnel transport MTU 1476 bytes`,
    answer: ['1436'],
    explanation: "GRE over IPv4 adds a 20-byte outer IP header and a 4-byte GRE header (no key, no sequence number), leaving 1476 bytes for the inner IP packet, as the transport MTU line shows. Subtract the inner 20-byte IP header and 20-byte TCP header: 1476 − 40 = 1436, so `ip tcp adjust-mss 1436`." },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L22T,
    stem: 'Two IOS XE routers build an IKEv2 site-to-site tunnel with no NAT and no errors. Put the IKEv2 messages and the result in the order they occur.',
    items: ['Initiator sends IKE_SA_INIT request: SA proposals, Diffie-Hellman value and nonce', 'Responder sends IKE_SA_INIT response: chosen proposal, its Diffie-Hellman value and nonce', 'Initiator sends IKE_AUTH request (encrypted): identity, authentication data, Child SA proposal and traffic selectors', 'Responder sends IKE_AUTH response: identity, authentication data and the accepted Child SA', 'Both routers install the IPsec SA pair and ESP traffic starts to flow'],
    explanation: "RFC 7296 builds an IKEv2 tunnel in two exchanges, four messages. IKE_SA_INIT negotiates the IKE SA algorithms and runs Diffie-Hellman, so keys exist to protect what follows. IKE_AUTH, encrypted under those keys, carries the identities and authentication (pre-shared key or signatures) and creates the first Child SA, the IPsec SA pair used for ESP. Additional or rekeyed Child SAs later use CREATE_CHILD_SA." },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L22T,
    stem: 'An IKEv2 proposal, IKEv2 policy and IPsec transform set already exist on R1, and GRE Tunnel0 is up. Put the remaining steps to protect Tunnel0 with IPsec in order, so that every object exists before something references it and the last step confirms the result.',
    items: ['crypto ikev2 keyring IKEV2-KR with the peer address and pre-shared key', 'crypto ikev2 profile IKEV2-PROF with match identity remote address, authentication methods and keyring local IKEV2-KR', 'crypto ipsec profile GRE-PROF with set transform-set and set ikev2-profile IKEV2-PROF', 'tunnel protection ipsec profile GRE-PROF under interface Tunnel0', 'show crypto ikev2 sa shows the peer with status READY'],
    explanation: "The IKEv2 profile references the keyring, so the keyring comes first. The IPsec profile references the IKEv2 profile (and the existing transform set). `tunnel protection` references the IPsec profile and is what triggers negotiation with the peer. Only then can `show crypto ikev2 sa` show a READY IKE SA (once the peer is configured too)." },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L22T,
    stem: 'Refer to the exhibit. R1 and R2 use a crypto map with IKEv2. R2\'s crypto map is on Gi0/0/0 (198.51.100.2); its LAN interface Gi0/0/1 is 10.2.2.1/24. Pings from 10.1.1.10 to 10.2.2.20 fail. What is the most likely cause?',
    exhibit: `R1# show crypto ipsec sa | include ident|pkts encaps|pkts decaps
   local  ident (addr/mask/prot/port): (10.1.1.0/255.255.255.0/0/0)
   remote ident (addr/mask/prot/port): (10.2.2.0/255.255.255.0/0/0)
    #pkts encaps: 245, #pkts encrypt: 245, #pkts digest: 245
    #pkts decaps: 0, #pkts decrypt: 0, #pkts verify: 0

R2# show crypto ipsec sa | include ident|pkts encaps|pkts decaps
   local  ident (addr/mask/prot/port): (10.2.2.0/255.255.255.0/0/0)
   remote ident (addr/mask/prot/port): (10.1.1.0/255.255.255.0/0/0)
    #pkts encaps: 0, #pkts encrypt: 0, #pkts digest: 0
    #pkts decaps: 245, #pkts decrypt: 245, #pkts verify: 245

R2# show ip route 10.1.1.0
Routing entry for 10.1.1.0/24
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.2.2.254
      Route metric is 0, traffic share count is 1`,
    options: ['R2 routes 10.1.1.0/24 toward 10.2.2.254 on its LAN, so the replies never reach the interface with the crypto map and are not encrypted', 'The pre-shared keys do not match, so the IPsec SAs cannot be created', 'The crypto ACLs are not mirror images of each other', 'The transform sets do not match, so R2 cannot decrypt the packets'],
    answer: [0],
    explanation: "The SAs are up and working in one direction: R1 encrypted 245 packets and R2 decrypted all 245. R2 encrypted nothing, because its route to 10.1.1.0/24 points at 10.2.2.254, a next hop on its LAN, so replies never leave through Gi0/0/0 where the crypto map would match them. A key mismatch would stop the IKE SA, and no SAs or counters would exist. The identities are exact mirrors. A transform set mismatch prevents the Child SA, and R2 could not have decrypted anything." },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L22T,
    stem: 'Which two statements about a static VTI (tunnel mode ipsec ipv4 with tunnel protection) compared with a crypto map are true? (Choose two.)',
    options: ['With a VTI, traffic is selected for encryption by routing it into the tunnel interface', 'A routing protocol such as OSPF can form an adjacency across a VTI', 'A VTI requires a crypto ACL that is the mirror image of the peer\'s ACL', 'A crypto map is applied to the tunnel interface rather than the physical interface', 'Crypto maps can only be used with IKEv1'],
    answer: [0, 1],
    explanation: "A VTI is route-based: anything routed into the tunnel is protected and its proxy identities are any-to-any, so no crypto ACL is needed, and because it is an interface, routing protocols run across it. A crypto map is policy-based: its ACL selects traffic, and it is applied to the physical outside interface. Crypto maps work with IKEv2 through `set ikev2-profile`." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22T,
    stem: 'Refer to the exhibit. Tunnel1 is meant to be a static IPsec VTI that carries only IPv4 traffic with no GRE header. Enter the interface command that is missing from Tunnel1.',
    exhibit: `R1# show running-config interface Tunnel1
interface Tunnel1
 ip address 172.16.1.1 255.255.255.252
 tunnel source GigabitEthernet0/0/0
 tunnel destination 198.51.100.2
 tunnel protection ipsec profile IPSEC-PROF
end

R1# show interfaces Tunnel1 | include protocol/transport
  Tunnel protocol/transport GRE/IP`,
    answer: ['tunnel mode ipsec ipv4'],
    explanation: "A tunnel with no `tunnel mode` line uses the default, GRE over IP, which the `GRE/IP` line confirms; with `tunnel protection` that is GRE over IPsec, not a VTI. `tunnel mode ipsec ipv4` turns it into a static VTI that encrypts IPv4 packets directly with no GRE header. The peer must use the same mode." },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L22T,
    stem: 'Refer to the exhibit. R1\'s outside address is 203.0.113.1 and R2\'s is 198.51.100.2. The proposals and transform sets are identical on both routers, but the IKEv2 SA never establishes. What is the cause?',
    exhibit: `R1# show running-config | section crypto ikev2 (keyring|profile)
crypto ikev2 keyring IKEV2-KR
 peer R2
  address 198.51.100.2
  pre-shared-key <PRE-SHARED-KEY>
crypto ikev2 profile IKEV2-PROF
 match identity remote address 198.51.100.2 255.255.255.255
 authentication remote pre-share
 authentication local pre-share
 keyring local IKEV2-KR

R2# show running-config | section crypto ikev2 (keyring|profile)
crypto ikev2 keyring IKEV2-KR
 peer R1
  address 203.0.113.11
  pre-shared-key <PRE-SHARED-KEY>
crypto ikev2 profile IKEV2-PROF
 match identity remote address 203.0.113.1 255.255.255.255
 authentication remote pre-share
 authentication local pre-share
 keyring local IKEV2-KR`,
    options: ['R2\'s keyring has the wrong peer address (203.0.113.11), so R2 has no pre-shared key for R1', 'R2\'s profile must match R2\'s own address, not R1\'s', 'Both routers must use authentication local rsa-sig when the remote method is pre-share', 'The keyrings must use different names on the two routers'],
    answer: [0],
    explanation: "IOS XE looks up the pre-shared key for a peer by its address in the keyring. R2 has a key only for 203.0.113.11, but R1 is 203.0.113.1, so R2 has no key for R1 and authentication fails. The `match identity remote` line correctly names the peer's (R1's) identity. Pre-share can be used for both local and remote authentication. Keyring names are local and may be the same on both routers." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22T,
    stem: 'Refer to the exhibit. Which encapsulation protocol is the IPsec SA protecting? Enter its name.',
    exhibit: `R1# show crypto ipsec sa
interface: Tunnel0
    Crypto map tag: Tunnel0-head-0, local addr 203.0.113.1

   protected vrf: (none)
   local  ident (addr/mask/prot/port): (203.0.113.1/255.255.255.255/47/0)
   remote ident (addr/mask/prot/port): (198.51.100.2/255.255.255.255/47/0)
   current_peer 198.51.100.2 port 500
     PERMIT, flags={origin_is_acl,}
    #pkts encaps: 1520, #pkts encrypt: 1520, #pkts digest: 1520
    #pkts decaps: 1498, #pkts decrypt: 1498, #pkts verify: 1498
<output omitted>`,
    answer: ['GRE', 'Generic Routing Encapsulation'],
    explanation: "The proxy identities are host to host between the tunnel endpoints with protocol 47, which is GRE. This is GRE over IPsec: `tunnel protection` on a GRE tunnel encrypts the GRE packets. A static VTI (`tunnel mode ipsec ipv4`) would show 0.0.0.0/0.0.0.0 with protocol 0, and a crypto map would show the subnets in its ACL." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22T,
    stem: 'Refer to the exhibit. R2\'s Tunnel0 must form a GRE tunnel with R1\'s Tunnel0. Enter the interface command missing from R2.',
    exhibit: `R1# show running-config interface Tunnel0
interface Tunnel0
 ip address 172.16.0.1 255.255.255.252
 tunnel source GigabitEthernet0/0/0
 tunnel destination 198.51.100.2
end
R1# show ip interface brief | include 0/0/0
GigabitEthernet0/0/0   203.0.113.1     YES NVRAM  up                    up

R2# show running-config interface Tunnel0
interface Tunnel0
 ip address 172.16.0.2 255.255.255.252
 tunnel source GigabitEthernet0/0/0
end`,
    answer: ['tunnel destination 203.0.113.1'],
    explanation: "Each side's tunnel destination must be the other side's tunnel source address. R1 sources Tunnel0 from Gi0/0/0, which is 203.0.113.1, so R2 needs `tunnel destination 203.0.113.1`. Without a destination R2's tunnel stays up/down (no tunnel destination address)." },

  // ---------- 2.3 LISP ----------
  { topic: '2.3', type: 'order', difficulty: 2, lesson: L23L,
    stem: 'Host 10.1.1.10 in LISP site A sends the first packet to host 10.2.2.20 in LISP site B. Site B\'s ETR did not request proxy Map-Reply. Put the events in order, starting with the registration that happens before the packet is sent.',
    items: ['Site B\'s ETR sends a Map-Register for 10.2.2.0/24 to the map server', 'Site A\'s ITR receives the packet and finds no map-cache entry for 10.2.2.20', 'Site A\'s ITR sends a Map-Request to its map resolver', 'The map server forwards the Map-Request to site B\'s ETR', 'Site B\'s ETR sends a Map-Reply directly to site A\'s ITR', 'Site A\'s ITR caches the mapping and encapsulates traffic for 10.2.2.20 to site B\'s RLOC on UDP 4341'],
    explanation: "ETRs register their EID-prefixes in advance (and refresh them periodically). On a map-cache miss the ITR asks its map resolver, which passes the request into the mapping system; the map server holding the registration forwards it to the authoritative ETR. Without proxy Map-Reply the ETR answers, directly to the ITR. The ITR caches the EID-to-RLOC mapping and LISP-encapsulates traffic (UDP destination port 4341) to the RLOC. The packet that triggered the lookup is usually dropped (or buffered) while the Map-Request is outstanding, so it is later packets that are encapsulated." },
  { topic: '2.3', type: 'match', difficulty: 1, lesson: L23L,
    stem: 'Match each LISP function to the role that performs it.',
    pairs: [
      ['Encapsulates packets from hosts in its own LISP site toward a remote RLOC', 'ITR'],
      ['Decapsulates LISP packets for its site and registers the site\'s EID-prefixes', 'ETR'],
      ['Receives Map-Register messages and stores the EID-to-RLOC registrations', 'Map server'],
      ['Receives Map-Requests from ITRs and returns a Negative Map-Reply for non-LISP destinations', 'Map resolver'],
      ['Attracts traffic from non-LISP sites toward LISP EIDs and encapsulates it', 'Proxy ITR'],
      ['Decapsulates traffic that LISP sites send to non-LISP destinations and forwards it natively', 'Proxy ETR'],
    ],
    explanation: "ITRs encapsulate and ETRs decapsulate (an xTR does both). ETRs register with the map server; ITRs query the map resolver, which answers non-LISP destinations with a Negative Map-Reply. A PITR is the way in to LISP sites from the non-LISP world; a PETR is the way out." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23L,
    stem: 'Refer to the exhibit. An ITR receives this mapping for 10.2.2.0/24 and all three RLOCs are reachable. How does the ITR forward traffic to 10.2.2.0/24?',
    exhibit: `Decoded LISP Map-Reply (from packet capture)
  EID-prefix: 10.2.2.0/24   Instance ID: 0   Record TTL: 1440 minutes
  Locator          Priority   Weight
  198.51.100.2     1          75
  198.51.100.6     1          25
  192.0.2.50       2          100`,
    options: ['It load-shares between 198.51.100.2 and 198.51.100.6 in about a 75:25 ratio and uses 192.0.2.50 only if both are unreachable', 'It sends all traffic to 192.0.2.50, because that locator has the highest weight', 'It sends all traffic to 192.0.2.50, because a higher priority value is preferred', 'It sends all traffic to 198.51.100.2 and ignores weights, which only apply to Map-Registers'],
    answer: [0],
    explanation: "In a LISP mapping the lowest priority value wins, and locators with the same best priority share traffic in proportion to their weights. 198.51.100.2 and .6 both have priority 1, so they split traffic 75:25; 192.0.2.50 (priority 2) is a backup. Weight only compares locators of equal priority, so 192.0.2.50's weight of 100 does not matter while a priority-1 locator is up. Priority and weight are how the destination site controls inbound traffic." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23L,
    stem: 'Refer to the exhibit, a capture taken on the underlay. Which statement identifies the roles correctly?',
    exhibit: `No.  Source          Destination     Protocol / port         Info
1    203.0.113.1     192.0.2.100     UDP dst 4342            LISP Map-Register (EID 10.2.2.0/24)
2    192.0.2.100     203.0.113.1     UDP 4342 -> 4342        LISP Map-Notify
3    198.51.100.2    192.0.2.100     UDP dst 4342            LISP Encapsulated Control Message (Map-Request for 10.2.2.20)
4    203.0.113.1     198.51.100.2    UDP src 4342            LISP Map-Reply (10.2.2.0/24 -> 203.0.113.1)
5    198.51.100.2    203.0.113.1     UDP dst 4341            LISP data, inner 10.1.1.10 -> 10.2.2.20`,
    options: ['192.0.2.100 is the map server/map resolver, 198.51.100.2 is the ITR, and 203.0.113.1 is the ETR for 10.2.2.0/24', '192.0.2.100 is a proxy ITR, 198.51.100.2 is the ETR, and 203.0.113.1 is the map resolver', '203.0.113.1 is the map server, because it sends the Map-Reply', '198.51.100.2 is a proxy ETR, because it sends data on UDP 4341'],
    answer: [0],
    explanation: "203.0.113.1 registers 10.2.2.0/24 and receives a Map-Notify (packets 1 and 2), so it is the ETR and 192.0.2.100 is the map server. 198.51.100.2 sends an encapsulated Map-Request to 192.0.2.100 (so that device is also the map resolver), receives the Map-Reply directly from the ETR, and then encapsulates data to UDP 4341: it is the ITR. Map-Replies come from the ETR (or a map server doing proxy reply), not necessarily a map server. A PETR decapsulates traffic leaving LISP sites; it does not send Map-Requests for LISP EIDs." },

  // ---------- 2.3 VXLAN ----------
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L23X,
    stem: 'Refer to the exhibit. Enter the minimum IP MTU, in bytes, that the fabric links need so that 1500-byte inner IPv4 packets are carried without fragmentation.',
    exhibit: `Leaf1 (VTEP Lo1 10.255.1.1) ---- Spine1 ---- Leaf2 (VTEP Lo1 10.255.1.2)

Overlay : untagged inner Ethernet frames, inner IPv4 packets up to 1500 bytes
Underlay: IPv4, routed point-to-point fabric links, no 802.1Q tags
Encap   : VXLAN (RFC 7348), UDP destination port 4789`,
    answer: ['1550', '1550 bytes'],
    explanation: "The underlay IP packet holds the inner IP packet (1500) plus the inner Ethernet header (14), the VXLAN header (8), the UDP header (8) and the outer IPv4 header (20): 1500 + 14 + 8 + 8 + 20 = 1550. That is the familiar 50 bytes of VXLAN overhead. RFC 7348 says VTEPs must not fragment, so the fabric must carry 1550-byte IP packets; most fabrics simply use jumbo frames." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23X,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `Leaf1# show nve vni
Interface  VNI        Multicast-group VNI state  Mode  VLAN  cfg vrf
nve1       50001      N/A             Up         L3CP  N/A   CLI GREEN
nve1       10010      239.1.1.10      Up         L2CP  10    CLI N/A
nve1       10020      N/A             Up         L2CP  20    CLI N/A`,
    options: ['Broadcast, unknown unicast and multicast traffic for VNI 10010 is sent to underlay multicast group 239.1.1.10', 'VNI 50001 is the Layer 2 VNI that extends VLAN 50 between leaves', 'VNI 10020 is down because it has no multicast group', 'VLAN 10 and VLAN 20 hosts share the same Layer 2 segment because both are on nve1'],
    answer: [0],
    explanation: "VNI 10010 (VLAN 10, Layer 2 mode) is mapped to multicast group 239.1.1.10, so its BUM traffic uses underlay multicast. VNI 50001 is in L3 mode for VRF GREEN: it is the Layer 3 VNI used for routing between leaves, not a VLAN extension. VNI 10020 is Up; having no group means its BUM traffic is not flooded with multicast (ingress replication is the usual alternative). VLAN 10 and VLAN 20 map to different VNIs, which are separate segments even on the same NVE interface." },
  { topic: '2.3', type: 'multi', difficulty: 1, lesson: L23X,
    stem: 'Which two statements about VXLAN as defined in RFC 7348 are true? (Choose two.)',
    options: ['The IANA-assigned outer UDP destination port is 4789', 'The VNI is a 24-bit field, allowing about 16 million segments', 'The VXLAN header itself is 50 bytes long', 'VTEPs fragment encapsulated packets that exceed the underlay MTU', 'The outer UDP source port is always 4789'],
    answer: [0, 1],
    explanation: "VXLAN uses UDP destination port 4789 and a 24-bit VNI (2^24, about 16 million segments versus 4094 VLANs). The VXLAN header is 8 bytes; 50 bytes is the total added overhead (outer Ethernet, IP, UDP and VXLAN). RFC 7348 says VTEPs must not fragment VXLAN packets. The source port is a hash of the inner headers (recommended range 49152–65535) so the underlay can load-balance flows with ECMP." },
  { topic: '2.3', type: 'match', difficulty: 2, lesson: L23X,
    stem: 'Match each VXLAN fabric scenario to the mechanism or function it describes.',
    pairs: [
      ['The underlay has no multicast routing, so the source VTEP sends a separate unicast copy of each ARP broadcast to every peer VTEP in the VNI', 'Ingress (head-end) replication'],
      ['Each VNI is mapped to a group such as 239.1.1.10 and the spine switches run PIM', 'Underlay multicast replication'],
      ['A bare-metal server in VLAN 10 must share one subnet and broadcast domain with VMs in VNI 10010', 'VXLAN Layer 2 gateway'],
      ['Hosts in VNI 10010 (10.10.10.0/24) must reach hosts in VNI 10020 (10.10.20.0/24)', 'VXLAN Layer 3 gateway'],
      ['Leaves advertise host MAC and IP addresses in BGP so that most ARP requests can be answered locally', 'BGP EVPN control plane'],
    ],
    explanation: "Ingress replication needs no multicast in the underlay but the source VTEP sends one copy per peer. Underlay multicast maps each VNI to a group and relies on PIM. A Layer 2 gateway bridges a VLAN and a VNI that form one subnet; a Layer 3 gateway routes between different VNIs (subnets) or to outside networks. BGP EVPN distributes MAC and IP reachability, which enables ARP suppression and removes most flood-and-learn traffic." },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
