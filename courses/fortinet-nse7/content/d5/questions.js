// Domain 5 — Advanced IPsec question bank. FortiOS / FortiManager 7.6.
// Original items. Facts checked on docs.fortinet.com (7.6.3 CLI Reference, 7.6.5 Admin Guide,
// 7.6 SD-WAN Architecture for Enterprise / MSSP guides, FortiManager 7.6.3 Admin Guide) on 2026-10-29.
export default [
  {
    id: 'd5-001',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Hub terminates FortiGate spokes on the dial-up phase 1 VPN1, which uses mode-cfg to assign tunnel addresses. What is the value shown in the tun_id field of the dial-up instance?',
    exhibit: String.raw`FGT-Hub # show vpn ipsec phase1-interface VPN1
config vpn ipsec phase1-interface
    edit "VPN1"
        set type dynamic
        set interface "port1"
        set ike-version 2
        set peertype any
        set net-device disable
        set mode-cfg enable
        set ipv4-start-ip 10.10.1.1
        set ipv4-end-ip 10.10.1.200
        set ipv4-netmask 255.255.255.0
        set add-route disable
        set psksecret ENC ...
    next
end

FGT-Hub # diagnose vpn tunnel list name VPN1_0
------------------------------------------------------
name=VPN1_0 ver=2 serial=7 203.0.113.1:0->192.0.2.10:0 tun_id=10.10.1.1 dst_mtu=1500 dpd-link=on remote_location=172.16.0.1 weight=1
bound_if=3 lgwy=static/1 tun=intf mode=dial_inst/3 encap=none/74408 options[122a8]=npu rgwy-chg frag-rfc run_state=0 accept_traffic=1 overlay_id=0
parent=VPN1 index=0
...`,
    options: [
      'The address the hub assigned to this spoke through mode-cfg, used as the gateway of routes through this dial-up instance because net-device is disabled',
      'The spoke\'s public IP address, used as the IKE remote gateway',
      'The spoke\'s location-id, used for aggregate packet distribution',
      'The hub tunnel interface IP that the spoke uses as its BGP next hop',
    ],
    answer: [0],
    explanation: 'With `net-device disable`, FortiOS creates no kernel interface per dial-up instance. Each instance gets a **tunnel ID** in the form of an IP address, and routes through that instance use it as their gateway. On this IKEv2 gateway, mode-cfg assigned the spoke 10.10.1.1 (the first address in the pool), and that address is the tunnel ID, as in Fortinet\'s IKEv2 EAP dial-up example (`tun_id` equal to the first mode-cfg address). Without an assigned address, the tunnel ID is normally the peer\'s public IP.\n\n- The spoke\'s public IP is 192.0.2.10, shown in the `203.0.113.1:0->192.0.2.10:0` part of the line.\n- The location ID appears separately as `remote_location=172.16.0.1`.\n- The hub tunnel interface IP is not what `tun_id` reports.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-002',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Hub has two IKEv2 dial-up phase 1s on port1, both authenticated with pre-shared keys. Spokes configured for HUB1-VPN2 fail to come up, and IKE debug on the hub shows them being matched against VPN1. What is the best fix?',
    exhibit: String.raw`FGT-Hub # show vpn ipsec phase1-interface
config vpn ipsec phase1-interface
    edit "VPN1"
        set type dynamic
        set interface "port1"
        set ike-version 2
        set peertype any
        set net-device disable
        set psksecret ENC ...
    next
    edit "VPN2"
        set type dynamic
        set interface "port1"
        set ike-version 2
        set peertype any
        set net-device disable
        set psksecret ENC ...
    next
end`,
    options: [
      'Enable network-overlay and set a different network-id on VPN1 and VPN2, with the matching network-id on each spoke phase 1',
      'Change both phase 1s to aggressive mode with set mode aggressive',
      'Set peertype one with a peerid on VPN2 and keep IKEv2 unchanged on the spokes',
      'Enable net-device on VPN2 so it gets its own kernel interface',
    ],
    answer: [0],
    explanation: 'For several IKEv2 dial-up gateways on the same interface, FortiOS selects the gateway by **network ID**: `set network-overlay enable` plus a unique `set network-id` (0–255) per phase 1, configured identically on both ends. Without it, Fortinet\'s support articles note that IKEv2 dial-in peers are matched against the first IKEv2 dial-up phase 1.\n\n- `mode aggressive` / main mode applies only to IKEv1 and has no effect on IKEv2.\n- A peer ID can only match if the spokes send a matching local ID, and this option leaves the spokes unchanged. FortiManager documents peer ID matching with aggressive mode as the IKEv1 approach, and network IDs as the IKEv2 one.\n- `net-device` controls kernel interfaces, not gateway selection.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-003',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: 'An architect is deciding between IKEv1 and IKEv2 for a new FortiGate dial-up overlay. Which two capabilities require IKEv2? (Choose two.)',
    options: [
      'Selecting among several dial-up phase 1s on one interface with network-overlay and network-id',
      'EAP user authentication with set eap enable',
      'Aggressive mode with a local ID',
      'XAuth user authentication',
      'ADVPN shortcuts with auto-discovery-sender and auto-discovery-receiver',
    ],
    answer: [0, 1],
    explanation: 'Network IDs are IKEv2 only (IKEv1 doesn\'t support them, and FortiManager only offers Network Overlay with IKE version 2). EAP (`eap`, `eap-identity`, `eap-cert-auth`) is the IKEv2 user-authentication method.\n\n- Aggressive mode and XAuth are IKEv1 features.\n- ADVPN 1.0 works with IKEv1 and IKEv2. Fortinet\'s NAT hole-punching example runs ADVPN over IKEv1.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-004',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. After a new spoke connected to FGT-Hub, internet traffic from the datacenter LAN started leaving through the dial-up tunnel instead of port4. The new spoke uses wildcard phase 2 selectors. What caused this?',
    exhibit: String.raw`FGT-Hub # show vpn ipsec phase1-interface VPN1
config vpn ipsec phase1-interface
    edit "VPN1"
        set type dynamic
        set interface "port1"
        set peertype any
        set net-device disable
        set distance 5
        set psksecret ENC ...
    next
end

FGT-Hub # get router info routing-table database
Routing table for VRF=0
S    *> 0.0.0.0/0 [5/0] via VPN1 tunnel 192.0.2.27, [1/0]
S       0.0.0.0/0 [10/0] via 203.0.113.254, port4, [1/0]
...`,
    options: [
      'mode-cfg pushed the hub\'s own default gateway to the spoke, which reflected it back',
      'add-route is enabled by default and installed a route to the spoke\'s wildcard selector with the phase 1 distance (5); disable add-route on VPN1 and let BGP carry spoke routes',
      'net-device disable makes FortiOS send all traffic to the most recent dial-up instance',
      'The spoke advertised a default route through BGP with a lower administrative distance',
    ],
    answer: [1],
    explanation: '`add-route` defaults to **enable**. When a dial-up tunnel comes up, FortiOS adds a route to the peer\'s destination selector. If the peer offers a wildcard (0.0.0.0/0), a default route through the tunnel is installed with the phase 1 distance and priority. Here the distance is 5 (lowered from the default 15), which beats the port4 default at distance 10: the routing database shows both defaults, with the IKE route selected (`*>`). Its gateway, 192.0.2.27, is the dial-up instance\'s tunnel ID (here the spoke\'s public IP, because `net-device` is disabled and no mode-cfg address is assigned). Disable `add-route` (as Fortinet\'s SD-WAN/ADVPN examples do) and use BGP, or give the spoke specific selectors.\n\n- mode-cfg hands addresses and settings to the client. It doesn\'t install routes on the hub.\n- `net-device disable` doesn\'t steer traffic to a dial-up instance by itself.\n- The route is an `S` (static/IKE) route, not a BGP `B` route.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-005',
    topic: '5.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Which phase 1 option sends the FortiGate\'s loopback address to the peer during IKE so that both ends inject a /32 route to each other\'s loopback over the tunnel? (Enter the option name.)',
    answer: ['exchange-ip-addr4', 'set exchange-ip-addr4'],
    explanation: '`set exchange-ip-addr4 <IPv4>` (default 0.0.0.0) is the Fortinet IKE extension used for BGP on loopback. Each side learns a /32 to the other\'s loopback from IKE, with no IGP needed. `exchange-interface-ip` sends the tunnel interface IP instead.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-006',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Spoke overlays are SD-WAN members. Overnight there is almost no user traffic, and when a hub underlay fails, the spoke should notice the dead tunnel before users send traffic in the morning. Which DPD mode fits this requirement?',
    options: [
      'on-idle',
      'on-demand',
      'disable, and rely on the SD-WAN health check only',
      'on-demand with dpd-retrycount 0',
    ],
    answer: [0],
    explanation: '`dpd on-idle` sends DPD probes while the tunnel is idle, so a dead peer is detected without user traffic. Fortinet\'s ADVPN and SD-WAN examples use it on hubs and spokes.\n\n- `on-demand` (the default) only probes when traffic is sent and nothing comes back, so an idle tunnel is never checked.\n- Disabling DPD leaves IKE unaware of the dead peer, so routes and SAs linger.\n- A retry count of 0 doesn\'t change when probing starts.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-007',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FortiClient users connect to an IKEv2 dial-up gateway that has eap enable and eap-cert-auth enable. One user cannot connect. Why does the connection fail?',
    exhibit: String.raw`ike V=root:0:FCT-EAP:9: received peer identifier DER_ASN1_DN 'C = US, O = Example, CN = laptop-042'
ike V=root:0:FCT-EAP:9: re-validate gw ID
ike V=root:0:FCT-EAP:9: gw validation OK
ike V=root:0:FCT-EAP:9: Validating X.509 certificate
ike V=root:0:FCT-EAP:9: peer cert, subject='laptop-042', issuer='Contractor-CA'
ike V=root:0:FCT-EAP:9: peer ID verified
ike V=root:0:FCT-EAP:9: building fnbam peer candidate list
ike V=root:0:FCT-EAP:9: FNBAM_GROUP_NAME candidate 'Staff-Peers'
ike V=root:0:FCT-EAP:9: certificate validation before eap pending
ike V=root:0:FCT-EAP:9: fnbam cert group matching failed
ike V=root:0:FCT-EAP:9: certificate validation failed`,
    options: [
      'The client certificate does not match the peer object configured on the phase 1 (Staff-Peers), so certificate validation fails before EAP starts',
      'The user typed the wrong EAP password',
      'The proposals do not match, so IKE_SA_INIT fails',
      'eap-identity is set to use-id-payload, so the user name could not be read',
    ],
    answer: [0],
    explanation: 'With `eap-cert-auth enable`, FortiGate validates the certificate *before* EAP (`certificate validation before eap pending`). The certificate was issued by Contractor-CA and failed to match the `peer` object Staff-Peers (`fnbam cert group matching failed`). EAP never starts.\n\n- No EAP exchange appears, so the password was never tested.\n- A proposal mismatch would fail much earlier, before any certificate is received.\n- The identity method affects EAP user lookup, which is never reached here.',
    lesson: '5.1-ikev2-dialup-hubs',
  },
  {
    id: 'd5-008',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The overlay HUB1-VPN1 has no IP address. The performance SLA to the hub loopback 172.16.255.251 shows HUB1-VPN1 as dead, although the tunnel is up. What should the administrator change?',
    exhibit: String.raw`FGT-Spoke1 # show system sdwan
config system sdwan
    set status enable
    config zone
        edit "HUB1"
        next
    end
    config members
        edit 3
            set interface "HUB1-VPN1"
            set zone "HUB1"
        next
    end
    config health-check
        edit "HUB1_HC"
            set server "172.16.255.251"
            set members 3
        next
    end
end

FGT-Spoke1 # diagnose sniffer packet any 'icmp and host 172.16.255.251' 4
1.020331 HUB1-VPN1 out 192.0.2.10 -> 172.16.255.251: icmp: echo request
2.020517 HUB1-VPN1 out 192.0.2.10 -> 172.16.255.251: icmp: echo request`,
    options: [
      'Set source 172.16.0.1 (the spoke loopback) on SD-WAN member 3 so probes are sourced from an address the hub can route back',
      'Enable update-static-route on the health check',
      'Change the health-check protocol to TCP echo',
      'Enable exchange-interface-ip on HUB1-VPN1 so the hub learns 192.0.2.10',
    ],
    answer: [0],
    explanation: 'Local-out traffic leaving an IP-less tunnel uses the outgoing underlay IP (192.0.2.10). The hub cannot route replies to that address back over the overlay. Fortinet\'s BGP-on-loopback examples set `set source <spoke loopback>` on each overlay **member**, because the tunnels have no IP. Firewall policies must allow PING between the loopback and the overlay zones.\n\n- `update-static-route` affects routes when members fail, not the probe source.\n- Changing the protocol doesn\'t change the source address.\n- `exchange-interface-ip` advertises the tunnel interface IP, and this tunnel has none.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-009',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Policy 12 sends branch users to an application behind the hub over HUB1-VPN1, which has no IP address. The hub sees the traffic sourced from 10.255.0.1, an address it cannot route back. On FGT-Spoke1, mgmt has the lowest interface index of all the interfaces that have an IP address. Why is the traffic translated to 10.255.0.1?',
    exhibit: String.raw`FGT-Spoke1 # show firewall policy 12
config firewall policy
    edit 12
        set name "LAN-to-HUB1"
        set srcintf "port5"
        set dstintf "HUB1-VPN1"
        set action accept
        set srcaddr "all"
        set dstaddr "DC-Apps"
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end

FGT-Spoke1 # diagnose netlink interface list | grep "if=mgmt "
if=mgmt family=00 type=1 index=3 mtu=1500 link=0 master=0
FGT-Spoke1 # diagnose netlink interface list | grep "if=port5 "
if=port5 family=00 type=1 index=5 mtu=1500 link=0 master=0
FGT-Spoke1 # diagnose netlink interface list | grep "if=HUB1-VPN1 "
if=HUB1-VPN1 family=00 type=768 index=7 mtu=1438 link=0 master=0

FGT-Spoke1 # show system interface mgmt | grep "set ip"
        set ip 10.255.0.1 255.255.255.0`,
    options: [
      'With NAT enabled and no IP pool, FortiOS must borrow an address because the tunnel has none, and it uses the interface with the lowest index (mgmt); use an IP pool or give the tunnel an IP',
      'NAT always uses the management interface address for traffic into IPsec tunnels',
      'The hub rewrote the source because its dial-up phase 1 has mode-cfg enabled',
      'The SD-WAN member source setting overrides the policy NAT address',
    ],
    answer: [0],
    explanation: 'When the egress interface is an IPsec tunnel with no IP, policy NAT needs another address. Fortinet\'s support article on this case says FortiOS chooses the **interface with the lowest index number**. Here that is mgmt (index 3), so traffic leaves as 10.255.0.1. The documented fixes are an IP pool in the policy (often the loopback) or an IP on the tunnel interface.\n\n- It is the lowest-index interface, not "always mgmt". Mgmt wins here only because of its index.\n- The hub does not rewrite the source. The translation happens on the spoke\'s outbound policy.\n- SD-WAN member `source` applies to local-out probes, not to forwarded traffic NAT.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-010',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. HQ and Branch both use 192.168.111.0/24. HQ source-NATs its hosts into 10.1.1.0/24 with an IP pool, and the branch presents itself as 10.2.2.0/24. Traffic from HQ never enters the tunnel. What is wrong?',
    exhibit: String.raw`FGT-HQ # show vpn ipsec phase2-interface HQtoBranch
config vpn ipsec phase2-interface
    edit "HQtoBranch"
        set phase1name "HQtoBranch"
        set src-subnet 192.168.111.0 255.255.255.0
        set dst-subnet 10.2.2.0 255.255.255.0
    next
end

FGT-HQ # show firewall policy 5
config firewall policy
    edit 5
        set srcintf "port2"
        set dstintf "HQtoBranch"
        set srcaddr "HQ-real-192.168.111.0"
        set dstaddr "Branch-virtual-10.2.2.0"
        set action accept
        set schedule "always"
        set service "ALL"
        set nat enable
        set ippool enable
        set poolname "HQ-SNAT-10.1.1.0"
    next
end`,
    options: [
      'The phase 2 local selector must be the virtual subnet 10.1.1.0/24, because SNAT is applied before the selector check on outbound traffic',
      'The firewall policy source address must be the virtual subnet 10.1.1.0/24',
      'A VIP must be used on the outbound policy instead of an IP pool',
      'The IP pool must be of type overload so that one address is used',
    ],
    answer: [0],
    explanation: 'For traffic entering a tunnel, FortiOS matches the firewall policy, then applies source NAT, then checks the phase 2 selectors. After SNAT the source is in 10.1.1.0/24, which doesn\'t match the configured local selector 192.168.111.0/24, so the traffic doesn\'t enter the tunnel. Fortinet\'s overlapping-subnet example uses the virtual subnets on both selectors (local 10.1.1.0/24, remote 10.2.2.0/24).\n\n- The policy matches pre-NAT traffic, so its source must stay the real 192.168.111.0/24.\n- VIPs handle the inbound DNAT direction, not outbound SNAT.\n- Overload would collapse the 1:1 mapping that the design relies on and still fail the selector check.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-011',
    topic: '5.1',
    type: 'order',
    difficulty: 2,
    stem: 'Put these steps in the order FortiOS applies them to a packet that the FortiGate sends into a route-based IPsec tunnel, with source NAT configured on the outbound policy.',
    items: [
      'Firewall policy lookup on the egress tunnel interface',
      'Source NAT using the policy IP pool',
      'Phase 2 selector check against the translated packet',
      'ESP encapsulation and transmission to the peer',
    ],
    explanation: 'Fortinet documents the outbound order: firewall policy, then SNAT if configured, then the traffic selector check, then encryption. Inbound it is reversed: selectors, then policy, then DNAT. This is why selectors in NAT-based overlapping-subnet designs list the translated (virtual) subnets.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-012',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator tries to add pri_HUB and sec_HUB to an IPsec aggregate, but pri_HUB is not accepted as a member. What must change?',
    exhibit: String.raw`config vpn ipsec phase1-interface
    edit "pri_HUB"
        set interface "port1"
        set peertype any
        set net-device enable
        set aggregate-member enable
        set remote-gw 203.0.113.1
    next
    edit "sec_HUB"
        set interface "port2"
        set peertype any
        set net-device disable
        set aggregate-member enable
        set remote-gw 198.51.100.1
    next
end
config system ipsec-aggregate
    edit "agg_HUB"
        set member "pri_HUB" "sec_HUB"
    next
end`,
    options: [
      'Set net-device disable on pri_HUB; aggregate members must not create a kernel device',
      'Set the same interface on both members',
      'Enable mode-cfg on pri_HUB',
      'Change the aggregate algorithm to redundant before adding members',
    ],
    answer: [0],
    explanation: 'Fortinet states that tunnel interfaces must have **net-device disabled** to be IPsec aggregate members, in addition to `aggregate-member enable`. sec_HUB qualifies and pri_HUB does not.\n\n- Aggregates are typically built over different underlays (port1 and port2), which is the point of the redundancy.\n- mode-cfg is unrelated to aggregation.\n- The algorithm (default round-robin) doesn\'t affect member eligibility.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-013',
    topic: '5.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each IPsec aggregate algorithm with its behaviour.',
    pairs: [
      ['round-robin', 'Per-packet distribution across members (the default)'],
      ['weighted-round-robin', 'Per-packet distribution proportional to each member\'s aggregate-weight'],
      ['redundant', 'All traffic uses the first member tunnel that is up'],
      ['L3', 'Distribution based on layer 3 addresses'],
      ['L4', 'Distribution based on layer 4 information'],
    ],
    explanation: 'These are the options of `config system ipsec-aggregate` → `set algorithm` in the 7.6.3 CLI Reference. Round-robin is the default. Only `redundant` gives pure failover. The others load-balance, and weighted round-robin uses `aggregate-weight` (1–100) from each member phase 1.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-014',
    topic: '5.1',
    type: 'fill',
    difficulty: 2,
    stem: 'A hub aggregates dial-up IPsec tunnels from each branch for per-packet load balancing. Which setting under config system settings must each branch configure so the hub knows which dial-up tunnels come from the same location? (Enter the option name.)',
    answer: ['location-id', 'set location-id'],
    explanation: '`config system settings` → `set location-id <IPv4-format ID>`. The hub load-balances per packet across the aggregated dial-up tunnels that share a location ID. Fortinet notes that this traffic cannot be offloaded to the NPU. The same location ID is also used by BGP-on-loopback designs and by ADVPN 2.0 shared idle timeout.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  {
    id: 'd5-015',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit from FGT-Spoke1. Both SAs use the same AES/SHA1 proposal over 1500-byte underlays. Why does the shortcut report a smaller MTU than the parent tunnel?',
    exhibit: String.raw`name=HUB1-VPN1 ver=1 serial=2 192.0.2.10:0->203.0.113.1:0 tun_id=203.0.113.1
...
natt: mode=none draft=0 interval=0 remote_port=0
 SA: ref=6 options=1a227 type=00 soft=0 mtu=1438 expire=1225/0B replaywin=1024
...
name=HUB1-VPN1_0 ver=1 serial=9 192.0.2.10:4500->192.0.2.20:4500 tun_id=192.0.2.20
...
 parent=HUB1-VPN1 index=0
natt: mode=keepalive draft=32 interval=10 remote_port=4500
 SA: ref=6 options=1a227 type=00 soft=0 mtu=1422 expire=447/0B replaywin=1024`,
    options: [
      'The shortcut uses NAT traversal, and the extra UDP encapsulation header reduces the payload the SA can carry',
      'Shortcuts always use a 16-byte larger integrity check value than parent tunnels',
      'The shortcut inherited the MTU of the hub\'s loopback interface',
      'FEC is enabled on the shortcut, which reserves 16 bytes for redundant packets',
    ],
    answer: [0],
    explanation: 'The shortcut runs over UDP 4500 with `natt: mode=keepalive`, so every ESP packet carries an additional 8-byte UDP header, and the inner MTU drops (1438 → 1422 in Fortinet\'s own ADVPN example with the same proposal). The drop is 16 rather than 8 bytes because AES pads the ESP payload to 16-byte blocks: on a 1500-byte underlay, 20 (IP) + 8 (ESP) + 16 (IV) + 12 (SHA1 ICV) leave 1444 bytes, padded down to 1440 minus the 2-byte trailer = 1438; the 8-byte UDP header leaves 1436, padded down to 1424 minus 2 = 1422. Size TCP MSS from the smallest MTU that traffic may use.\n\n- The proposal, and so the ICV, is identical.\n- Loopback MTU isn\'t involved.\n- FEC isn\'t shown, and it adds packets rather than reserving bytes per packet.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-016',
    topic: '5.1',
    type: 'fill',
    difficulty: 2,
    stem: 'An IPv4 IPsec SA reports mtu=1422 and there are no IP or TCP options. What is the largest TCP MSS value (in bytes) that avoids fragmentation inside this tunnel?',
    answer: ['1382'],
    explanation: 'MSS = MTU − 20 (IPv4 header) − 20 (TCP header) = 1422 − 40 = 1382. Set it with `tcp-mss-sender` / `tcp-mss-receiver` on the firewall policy. Many designs use a slightly lower value for margin.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-017',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'After upgrading the hubs and spokes from FortiOS 7.4 to 7.6.3, large file transfers over the overlays stall while small transactions work. A third-party firewall between the users and the spokes blocks all ICMP. No firewall policy sets an MSS. What is the most likely explanation?',
    options: [
      'From 7.6.1, FortiGate no longer lowers the TCP MSS for traffic too large for the tunnel and relies on ICMP fragmentation-needed, which the third-party firewall drops; set tcp-mss-sender and tcp-mss-receiver on the policies',
      'FortiOS 7.6 changed the default ip-fragmentation to pre-encapsulation, which breaks TCP',
      'FortiOS 7.6 disables NPU offload for TCP sessions larger than the tunnel MTU',
      'FortiOS 7.6 enables FEC by default on IPsec tunnels, which increases packet size',
    ],
    answer: [0],
    explanation: 'Fortinet documents that in **7.6.1 and later**, FortiGate does not reduce the MSS. It only sends ICMP_FRAG_NEEDED so the sender can adjust. Earlier versions reduced the MSS as well. With ICMP filtered, path MTU discovery fails and large segments are lost. Explicit `tcp-mss-sender` / `tcp-mss-receiver` clamping fixes it.\n\n- The `ip-fragmentation` default is still `post-encapsulation`.\n- There is no such MTU-based offload rule.\n- `fec-egress` / `fec-ingress` default to disable.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-018',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Hub is an NP6-based model with npu-offload enabled on the phase 1, but throughput on this tunnel is far below the datasheet IPsec figure. Why is the tunnel not offloaded?',
    exhibit: String.raw`FGT-Hub # diagnose vpn tunnel list name VPN2_3
...
 SA: ref=3 options=10602 type=00 soft=0 mtu=1453 expire=38114/0B replaywin=2048
 seqno=1f42 esn=0 replaywin_lastseq=00001f42 itn=0
 life: type=01 bytes=0/0 timeout=38140/43200
 dec: spi=5b0e19c2 esp=chacha20poly1305 key=36 4a9c07d2...
      ah=null key=0
 enc: spi=c71d03a8 esp=chacha20poly1305 key=36 9e3b61f0...
      ah=null key=0
 dec:pkts/bytes=8002/701455, enc:pkts/bytes=8002/1120280
 npu_flag=00 npu_rgwy=192.0.2.30 npu_lgwy=198.51.100.1 npu_selid=7 dec_npuid=0 enc_npuid=0`,
    options: [
      'The negotiated cipher chacha20poly1305 is not supported by the NPU or the CP, so the SA is processed in software',
      'npu_flag=00 means the SA is offloaded in both directions, so the bottleneck is elsewhere',
      'The SA has no authentication algorithm, which the NPU rejects for security reasons',
      'Dial-up instances are never offloaded when net-device is disabled',
    ],
    answer: [0],
    explanation: 'Fortinet lists SEED, ARIA and **chacha20poly1305** as proposals the NPU and CP don\'t support. Such SAs fall back to the CPU: `npu_flag=00`, `dec_npuid=0 enc_npuid=0`, and the SOFTWARE counters in `diagnose vpn ipsec status` tick. Remove that proposal (or reorder proposals) so an offloadable cipher such as AES-GCM is negotiated.\n\n- `npu_flag=03` means offloaded in both directions. `00` means not offloaded.\n- chacha20poly1305 is an AEAD cipher. `ah=null` is normal for AEAD and isn\'t the reason.\n- Dial-up instances with `net-device disable` can be offloaded.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-019',
    topic: '5.1',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit from an NP6-based FGT-Spoke1. The session is from a LAN host to a server behind the hub over HUB1-VPN1. Which two statements are true? (Choose two.)',
    exhibit: String.raw`FGT-Spoke1 # diagnose sys session list
session info: proto=6 proto_state=01 duration=34 expire=3565 timeout=3600 flags=00000000 socktype=0 sockport=0 av_idx=0 use=3
origin-shaper=
reply-shaper=
per_ip_shaper=
class_id=0 ha_id=0 policy_dir=0 tunnel=/HUB1-VPN1 vlan_cos=0/255
state=may_dirty npu
statistic(bytes/packets/allow_err): org=112/2/1 reply=112/2/1 tuples=2
orgin->sink: org pre->post, reply pre->post dev=9->17/17->9 gwy=203.0.113.1/10.1.1.20
hook=pre dir=org act=noop 10.1.1.20:35254->10.0.1.10:443(0.0.0.0:0)
hook=post dir=reply act=noop 10.0.1.10:443->10.1.1.20:35254(0.0.0.0:0)
misc=0 policy_id=20 pol_uuid_idx=731 auth_info=0 chk_client_info=0 vd=0
serial=00002d29 tos=ff/ff app_list=0 app=0 url_cat=0
npu_state=0x000c00
npu info: flag=0x82/0x81, offload=8/8, ips_offload=0/0, epid=1/3, ipid=3/1, vlan=0x0000/0x0000`,
    options: [
      'The session is offloaded to an NP6 processor',
      'The original direction is IPsec traffic and the reply direction is regular traffic, as seen by this FortiGate',
      'Both directions are encrypted by the CP because the flag values differ',
      'The session is not offloaded because it uses an IPsec tunnel',
      'FEC is applied to this session',
    ],
    answer: [0, 1],
    explanation: 'The `state=` line includes `npu`, and `offload=8/8` marks an NP6 session. In the `npu info` line, `0x82` means IPsec traffic and `0x81` regular traffic, per direction (original/reply). The original direction (LAN → server) leaves through the tunnel, and the reply is delivered to the LAN as regular traffic.\n\n- Different flag values show the traffic type per direction, not CP processing.\n- IPsec sessions can be offloaded, as shown here.\n- A FEC session would show `fec` in its `state=` line instead of `npu`.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-020',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: 'An architect plans adaptive forward error correction for voice over LTE-backed overlays. Which two statements about FEC on FortiGate are true? (Choose two.)',
    options: [
      'FEC does not support NPU offload, so it should be applied with set fec enable only on policies matching loss-sensitive UDP traffic',
      'fec-egress is enabled on the sending FortiGate and fec-ingress on the receiving FortiGate',
      'FEC is enabled on a phase 1 with a single command, and both peers negotiate it automatically through IKE',
      'With fec-codec xor, the mapping profile adapts the base and redundant values to the measured packet loss',
      'FEC replaces the need for an SD-WAN health check on the overlay',
    ],
    answer: [0, 1],
    explanation: 'Fortinet: "Because FEC does not support NPU offloading", limit it to the flows that need it (policy `set fec enable`) so other traffic stays offloaded. Direction matters: `fec-egress` on the sender, `fec-ingress` on the receiver.\n\n- There is no IKE negotiation of FEC. Each side is configured explicitly.\n- With `xor`, the base and redundant values are **not** updated adaptively.\n- Adaptive FEC relies on an SD-WAN health check (`fec-health-check`), not the other way round.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-021',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Spoke1 should protect voice sent to FGT-Hub with FEC. Voice quality has not improved, and the hub discards the redundant packets. What is missing?',
    exhibit: String.raw`FGT-Spoke1 # show vpn ipsec phase1-interface HUB1-VPN1
config vpn ipsec phase1-interface
    edit "HUB1-VPN1"
        set interface "port1"
        set ike-version 2
        set fec-egress enable
        set fec-health-check "HUB1_HC"
        set fec-mapping-profile "FEC-VOICE"
        ...
    next
end

FGT-Hub # show vpn ipsec phase1-interface VPN1
config vpn ipsec phase1-interface
    edit "VPN1"
        set type dynamic
        set interface "port1"
        set ike-version 2
        ...
    next
end`,
    options: [
      'set fec-ingress enable on the hub phase 1 VPN1',
      'set fec-egress enable on the hub phase 1 VPN1',
      'set fec-codec xor on both sides',
      'set npu-offload enable on the hub phase 1 VPN1',
    ],
    answer: [0],
    explanation: 'FEC is directional. The FortiGate sending protected traffic uses `fec-egress enable`, and the receiving FortiGate must use `fec-ingress enable` to process the FEC packets and rebuild lost ones. Fortinet\'s example sets egress on FortiGate A and ingress on FortiGate B.\n\n- Hub egress FEC would protect hub-to-spoke traffic, the other direction.\n- The codec must match, but changing it doesn\'t replace ingress processing.\n- NPU offload doesn\'t help FEC, which isn\'t offloaded.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-022',
    topic: '5.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each setting with the problem it addresses.',
    pairs: [
      ['ip-fragmentation pre-encapsulation', 'NP-offloaded packets that exceed the tunnel MTU cannot trigger ICMP fragmentation-needed'],
      ['tcp-mss-sender / tcp-mss-receiver', 'TCP segments that would be too large for the tunnel MTU'],
      ['fragmentation-mtu', 'Large IKE messages, such as certificate chains, dropped by networks that block IP fragments'],
      ['fec-egress / fec-ingress', 'Packet loss on real-time UDP over a lossy underlay'],
    ],
    explanation: '`ip-fragmentation pre-encapsulation` fragments before ESP, which avoids the loss Fortinet describes when offloaded packets can\'t generate ICMP. The policy MSS options clamp TCP. IKE fragmentation (`fragmentation`, default enable, with `fragmentation-mtu` default 1200) splits IKE messages on retransmission. FEC adds redundant packets.',
    lesson: '5.1-mtu-offload-fec',
  },
  {
    id: 'd5-023',
    topic: '5.1',
    type: 'single',
    difficulty: 1,
    stem: 'Which FortiManager recommended IPsec template prompts for a Local ID and the hub\'s remote gateway so that a branch can build several tunnels for SD-WAN?',
    options: [
      'Branch_IPSec_Recommended',
      'HUB_IPSec_Recommended',
      'IPSec_Fortinet_Recommended',
      'BRANCH_IPsec (generated by the SD-WAN overlay template)',
    ],
    answer: [0],
    explanation: 'Branch_IPSec_Recommended asks for Enable ADVPN, outgoing interface, **Local ID** (used by the hub to identify the device), remote gateway and pre-shared key.\n\n- HUB_IPSec_Recommended assumes a dial-up hub and asks for an address range.\n- IPSec_Fortinet_Recommended makes no role assumption and asks for no Local ID.\n- BRANCH_IPsec is generated by the overlay wizard. It is not a recommended template you activate.',
    lesson: '5.1-fmg-ipsec-templates',
  },
  {
    id: 'd5-024',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'In a FortiManager IPsec tunnel template, routing is set to Automatic with the hub LAN as Remote Subnet. The branches also learn the hub LAN through a BGP template. What does the Automatic setting add, and what should the architect choose for a BGP-based design?',
    options: [
      'Automatic creates static routes to the Remote Subnet through the tunnel; choose Manual so routing is left to BGP',
      'Automatic enables BGP on the tunnel; choose Manual to disable BGP',
      'Automatic enables add-route on the hub; choose Manual to enable mode-cfg instead',
      'Automatic creates policy routes on the hub; choose Manual to remove SD-WAN rules',
    ],
    answer: [0],
    explanation: 'FortiManager defines Routing **Automatic** as "Static routes to remote subnet will be created" (template autorouting), and **Manual** as "Routes will not automatically created". In a BGP design, the static routes duplicate and override BGP (static distance is lower than iBGP\'s 200), so Manual is the right choice.\n\n- The setting does not configure BGP, add-route, policy routes or SD-WAN rules.',
    lesson: '5.1-fmg-ipsec-templates',
  },
  {
    id: 'd5-025',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'A single FortiManager IPsec template must give every branch a unique tunnel IP and LAN subnet derived from the branch number. What should be used?',
    options: [
      'An ADOM-level metadata variable such as branch_id, referenced in the template fields and given a unique value per device',
      'A separate IPsec template per branch, assigned one-to-one',
      'A CLI template that overwrites the IPsec template after install',
      'Normalized interfaces mapped per platform',
    ],
    answer: [0],
    explanation: 'IPsec template fields marked with the magnifying glass accept ADOM-level metadata variables. Fortinet\'s IPsec template example builds each branch LAN as 192.168.`branch_id`.0 with a per-device `branch_id`, and the overlay template creates `branch_id` automatically.\n\n- One template per branch defeats the purpose of templates and doesn\'t scale.\n- Overwriting with CLI templates is fragile and unnecessary.\n- Normalized interfaces map interface names, not addressing.',
    lesson: '5.1-fmg-ipsec-templates',
  },
  {
    id: 'd5-026',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about FortiManager 7.6 VPN Manager (IPsec VPN communities) are true? (Choose two.)',
    options: [
      'A community can be created as Full Meshed, Star or Dial up',
      'In star and dial up communities, a hub gateway can advertise summary networks instead of each protected subnet',
      'VPN Manager is the only FortiManager tool that can enable ADVPN',
      'External gateways are FortiGates managed in the same ADOM',
      'VPN Manager generates SD-WAN rules for the overlays it creates',
    ],
    answer: [0, 1],
    explanation: 'The VPN Topology Setup Wizard offers Full Meshed, Star and Dial up. Hub gateways in star and dial up topologies have a **Summary Network(s)** setting.\n\n- ADVPN can be enabled in the HUB/Branch recommended IPsec templates, in any IPsec template\'s advanced settings, or with the overlay template (Legacy/2.0).\n- Managed gateways are in the current ADOM. External gateways are devices configured manually elsewhere.\n- SD-WAN rules come from SD-WAN templates, not VPN Manager.',
    lesson: '5.1-fmg-ipsec-templates',
  },
  {
    id: 'd5-027',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. It shows the IPsec templates the FortiManager SD-WAN overlay template generated for a two-underlay design. Which topology was selected?',
    exhibit: String.raw`Device Manager > Provisioning Templates > IPsec Tunnel Templates
Name           Tunnels                                          Assigned to
-------------  -----------------------------------------------  -----------------
HUB1_IPsec     VPN1, VPN2                                       FGT-Hub1
HUB2_IPsec     VPN1, VPN2                                       FGT-Hub2
BRANCH_IPsec   HUB1-VPN1, HUB1-VPN2, HUB2-VPN1, HUB2-VPN2       Branches (group)`,
    options: [
      'A dual-hub topology: one IPsec template per hub, and one branch template with two tunnels to each hub',
      'A single-hub topology with two VDOMs on the hub',
      'A multi-hub topology with four hubs',
      'A full-mesh topology built by VPN Manager',
    ],
    answer: [0],
    explanation: 'For a dual-hub deployment with two underlays, the overlay template creates `HUB1_IPsec` and `HUB2_IPsec` (each with VPN1 and VPN2) and `BRANCH_IPsec` containing HUB1-VPN1, HUB1-VPN2, HUB2-VPN1 and HUB2-VPN2.\n\n- A single hub would produce only HUB1_IPsec and two branch tunnels.\n- Four hubs would add HUB3/HUB4 templates and tunnels.\n- VPN Manager communities don\'t appear as IPsec tunnel templates.',
    lesson: '5.1-fmg-ipsec-templates',
  },
  {
    id: 'd5-028',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator built a private CA with OpenSSL (ca.key, ca.crt) and issued spoke certificates from it. The spokes now use authmethod signature. What must be imported on FGT-Hub so it can validate the spoke certificates?',
    options: [
      'The CA certificate ca.crt, imported as a CA certificate (and referenced by a user peer object if peers are restricted)',
      'The CA private key ca.key, so the hub can verify signatures',
      'Each spoke\'s private key, bundled as PKCS#12',
      'Nothing: FortiGate trusts any certificate whose CN matches the peer ID',
    ],
    answer: [0],
    explanation: 'To validate a peer certificate, the hub needs the issuing **CA certificate** (public). Import it as a CA certificate. Optionally, restrict accepted peers with `config user peer` (`set ca`, `set subject`) and `peertype peer`. The hub also needs its *own* local certificate (with its own key) to authenticate itself.\n\n- The CA private key must never leave the CA, and validation doesn\'t need it.\n- Spoke private keys stay on the spokes.\n- Certificates must chain to a trusted CA, and CN matching alone isn\'t trust.',
    lesson: '5.1-nat-overlap-aggregate',
  },
  // END-5.1
  {
    id: 'd5-029',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'An architect compares Dual HUB (Primary/Secondary) and Dual HUB (Primary/Primary) in the FortiManager SD-WAN overlay template. How do the generated configurations differ?',
    options: [
      'They are the same configuration, except that the secondary hub is given a higher cost, which the SD-WAN rule uses to prefer the primary',
      'Primary/Secondary builds overlays only to the primary hub until it fails',
      'Primary/Primary requires ADVPN 2.0, and Primary/Secondary supports only legacy ADVPN',
      'Primary/Secondary configures FGCP HA between the two hubs',
    ],
    answer: [0],
    explanation: 'FortiManager\'s documentation states that Primary/Secondary and Primary/Primary "are the same configuration", the difference being the higher cost given to the secondary hub, controlled by the SD-WAN rule.\n\n- Branches build overlays to both hubs in both modes.\n- The ADVPN choice (Disabled/Legacy/2.0) is independent of the topology.\n- The template doesn\'t create an HA cluster. The hubs are separate devices.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-030',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. HUB1-VPN1 is out of SLA for HUB1_HC, but FGT-Spoke1 keeps sending its iBGP session to FGT-Hub1 over HUB1-VPN1. What is the root cause?',
    exhibit: String.raw`FGT-Spoke1 # show system sdwan | grep -A2 "edit \"HUB1_HC\""
        edit "HUB1_HC"
            set server "172.16.255.252"
            set members 3 4

FGT-Spoke1 # show router bgp | grep -A4 "config neighbor"
    config neighbor
        edit "172.16.255.252"
            set interface "Branch-Lo"
            set update-source "Branch-Lo"
            set remote-as 65000

FGT-Spoke1 # get router info kernel | grep 172.16.255.252
tab=254 vf=0 scope=0 type=1 proto=18 prio=0 172.16.0.1/255.255.255.255/0->172.16.255.252/32 pref=0.0.0.0 gwy=0.0.0.0 dev=21(HUB1-VPN1)
tab=254 vf=0 scope=0 type=1 proto=18 prio=0 172.16.0.1/255.255.255.255/0->172.16.255.252/32 pref=0.0.0.0 gwy=0.0.0.0 dev=22(HUB1-VPN2)`,
    options: [
      'The health check and the BGP peering use the same hub address; the kernel routes installed for the health check stay even when the check fails, so BGP keeps using the tunnel it started on. Use a separate HUB-Lo for health checks',
      'recursive-next-hop is disabled, so BGP cannot move to HUB1-VPN2',
      'The neighbor uses update-source Branch-Lo, which pins BGP to the first overlay',
      'ibgp-multipath is disabled, so only one overlay can carry BGP',
    ],
    answer: [0],
    explanation: 'Fortinet explains why the hub needs separate loopbacks: a health check installs kernel routes to its server, and they are not removed when the check fails. If the BGP neighbor references the same IP, the spoke keeps sending BGP over the tunnel the peering came up on, even when that tunnel is failing its SLA. Use `HUB-Lo` (for example 172.16.255.251) for health checks and `BGP-Lo` for peering.\n\n- recursive-next-hop concerns resolving BGP next hops of routes, not the transport of the session.\n- update-source sets the source address, not the tunnel.\n- ibgp-multipath installs multiple paths for routes. It doesn\'t choose the session\'s path.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-031',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Spoke1 peers with the hub on loopbacks. The route to FGT-Spoke2\'s LAN is received but not installed. The hub advertises 172.16.0.0/16 so that spoke loopbacks are reachable. Which change fixes it?',
    exhibit: String.raw`FGT-Spoke1 # get router info bgp network 10.1.2.0/24
VRF 0 BGP routing table entry for 10.1.2.0/24
Paths: (1 available, no best path)
  Not advertised to any peer
  Original VRF 0
  Local
    172.16.0.2 (inaccessible) from 172.16.255.252 (172.16.255.252)
      Origin IGP metric 0, localpref 100, internal
      Originator: 172.16.0.2, Cluster list: 172.16.255.252
      Last update: Tue Oct 28 09:12:44 2026

FGT-Spoke1 # get router info routing-table all | grep 172.16
S       172.16.255.252/32 [15/0] via HUB1-VPN1 tunnel 203.0.113.1, [1/0]
B       172.16.0.0/16 [200/0] via 172.16.255.252 (recursive via HUB1-VPN1 tunnel 203.0.113.1), 00:14:10

FGT-Spoke1 # show router bgp
config router bgp
    set as 65000
    set router-id 172.16.0.1
    set ibgp-multipath enable
    config neighbor
        edit "172.16.255.252"
    ...`,
    options: [
      'Enable recursive-next-hop so the next hop 172.16.0.2 can be resolved through the BGP route 172.16.0.0/16',
      'Enable next-hop-self on the spoke neighbor',
      'Disable ibgp-multipath, which hides recursive routes',
      'Add exchange-interface-ip on HUB1-VPN1',
    ],
    answer: [0],
    explanation: 'The next hop 172.16.0.2 (FGT-Spoke2\'s loopback) is only reachable through another BGP route (172.16.0.0/16). FortiOS resolves a BGP next hop through a BGP route only with `set recursive-next-hop enable` (default disable). That is why Fortinet\'s BGP-on-loopback examples enable it on spokes and hubs. The IKE /32 route covers only the hub loopback.\n\n- next-hop-self on the spoke changes what it advertises, not how it resolves received routes.\n- ibgp-multipath is needed for multiple paths and doesn\'t hide routes.\n- exchange-interface-ip advertises tunnel IPs, which aren\'t used in this design.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-032',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A new branch, FGT-Spoke40, with Branch-Lo 172.16.40.5, has its overlays up, but its BGP session to FGT-Hub1 never establishes. Other branches use loopbacks from 172.16.0.0/20. Why?',
    exhibit: String.raw`FGT-Hub1 # show router bgp
config router bgp
    set as 65000
    set router-id 172.16.255.252
    set ibgp-multipath enable
    set recursive-next-hop enable
    config neighbor-group
        edit "EDGE"
            set interface "BGP-Lo"
            set update-source "BGP-Lo"
            set remote-as 65000
            set next-hop-self enable
        next
    end
    config neighbor-range
        edit 1
            set prefix 172.16.0.0 255.255.224.0
            set neighbor-group "EDGE"
        next
    end
end`,
    options: [
      'The neighbor range 172.16.0.0/19 covers 172.16.0.0–172.16.31.255, so 172.16.40.5 is not accepted as a dynamic neighbor',
      'The neighbor group is passive by default and never accepts connections',
      'next-hop-self prevents new neighbors from being added',
      'The hub must list each spoke loopback as a static neighbor when recursive-next-hop is enabled',
    ],
    answer: [0],
    explanation: '255.255.224.0 is a /19, so the range accepts sources 172.16.0.0–172.16.31.255. Extend the range (or add another `neighbor-range` entry) or renumber the branch loopback inside the plan. This is why the loopback plan must be summarisable.\n\n- Neighbor groups are passive (they wait for the spoke to connect), which is exactly what a hub wants. Passive doesn\'t mean refusing.\n- next-hop-self affects advertised next hops, not neighbor acceptance.\n- Dynamic neighbors through neighbor ranges work with recursive-next-hop.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-033',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Which community does FGT-Spoke1 attach to the routes it advertises to neighbor 10.10.1.254 at this moment?',
    exhibit: String.raw`FGT-Spoke1 # show system sdwan | grep -A6 "config neighbor"
    config neighbor
        edit "10.10.1.254"
            set member 1
            set health-check "HUB1_HC"
            set sla-id 1
        next
    end

FGT-Spoke1 # show router bgp | grep -A3 "edit \"10.10.1.254\""
        edit "10.10.1.254"
            set remote-as 65000
            set route-map-out "HUB_BAD"
            set route-map-out-preferable "HUB_CARRIER1"

FGT-Spoke1 # show router route-map
config router route-map
    edit "HUB_CARRIER1"
        config rule
            edit 1
                set set-community "65000:1"
            next
        end
    next
    edit "HUB_BAD"
        config rule
            edit 1
                set set-community "65000:9999"
            next
        end
    next
end

FGT-Spoke1 # diagnose sys sdwan neighbor
Neighbor(10.10.1.254): member(1)role(standalone)
 Health-check(HUB1_HC:1) sla-fail alive`,
    options: [
      '65000:9999, because the member fails SLA 1, so the default route-map-out (HUB_BAD) is used',
      '65000:1, because route-map-out-preferable always takes precedence over route-map-out',
      'No community, because the SD-WAN neighbor suppresses advertisements when the member fails',
      'Both communities, because route-map-out and route-map-out-preferable are applied in sequence',
    ],
    answer: [0],
    explanation: 'When the SD-WAN neighbor\'s members meet the SLA, FortiOS applies `route-map-out-preferable`. When they don\'t, it applies `route-map-out`. The neighbor shows `sla-fail`, so HUB_BAD (65000:9999) is used. The hub can then map 9999 to a worse route priority and send its traffic over another overlay.\n\n- The preferable map is used only while the SLA is met.\n- Advertisements continue, only with the "bad" community.\n- Only one of the two maps applies at a time.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-034',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Hub uses a route-map-in that sets route priorities from the spokes\' communities. Which tunnel does FGT-Hub use for traffic to 10.1.1.0/24?',
    exhibit: String.raw`FGT-Hub # diagnose ip route list | grep proto=11 | grep 10.1.1.0
tab=254 vf=0 scope=0 type=1 proto=11 prio=200 0.0.0.0/0.0.0.0/0->10.1.1.0/24 pref=0.0.0.0 gwy=10.10.2.1 dev=102(VPN2)
tab=254 vf=0 scope=0 type=1 proto=11 prio=9999 0.0.0.0/0.0.0.0/0->10.1.1.0/24 pref=0.0.0.0 gwy=10.10.1.1 dev=101(VPN1)`,
    options: [
      'VPN2, because the route with the lower priority value (200) is preferred',
      'VPN1, because the route with the higher priority value (9999) is preferred',
      'Both tunnels equally, because both routes are BGP routes with the same distance',
      'Neither, because routes with different priorities are rejected as inconsistent',
    ],
    answer: [0],
    explanation: 'For routes with the same distance, FortiOS prefers the lower priority value. The hub\'s route map translated the spoke\'s out-of-SLA community into priority 9999 on VPN1, while VPN2 kept 200, so hub-to-spoke traffic leaves on VPN2. This is BGP-driven self-healing: no SD-WAN rule is needed on the hub.\n\n- Higher priority values are less preferred.\n- Equal distance doesn\'t mean ECMP when priorities differ.\n- Both routes stay in the table. Only the preferred one carries traffic.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-035',
    topic: '5.2',
    type: 'fill',
    difficulty: 2,
    stem: 'Which BGP neighbor option names the route map that a spoke applies to its advertisements while the members of the matching SD-WAN neighbor meet SLA? (Enter the option name.)',
    answer: ['route-map-out-preferable', 'set route-map-out-preferable'],
    explanation: '`set route-map-out-preferable <map>` is used while the SD-WAN neighbor (`config system sdwan` → `config neighbor`) is in SLA. `route-map-out` is the default map used otherwise. This pair is the basis of BGP self-healing communities.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-036',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. HUB1-VPN1 (member 3) is in SLA and HUB1-VPN2 (member 4) is out of SLA. Which route map does FGT-Spoke1 apply to neighbor 172.16.255.252?',
    exhibit: String.raw`FGT-Spoke1 # show system sdwan | grep -A7 "config neighbor"
    config neighbor
        edit "172.16.255.252"
            set member 3 4
            set minimum-sla-meet-members 2
            set health-check "HUB1_HC"
            set sla-id 1
        next
    end

FGT-Spoke1 # show router bgp | grep -A5 "edit \"172.16.255.252\""
        edit "172.16.255.252"
            set interface "Branch-Lo"
            set update-source "Branch-Lo"
            set remote-as 65000
            set route-map-out "OUT_SLA"
            set route-map-out-preferable "IN_SLA"`,
    options: [
      'OUT_SLA, because only one member meets the SLA and minimum-sla-meet-members requires two',
      'IN_SLA, because at least one member meets the SLA',
      'IN_SLA for routes via HUB1-VPN1 and OUT_SLA for routes via HUB1-VPN2',
      'Neither, because the session is torn down when a member fails SLA',
    ],
    answer: [0],
    explanation: '`minimum-sla-meet-members` (default 1) sets how many listed members must be in SLA for the preferable route map to be used. With it set to 2 and only one member in SLA, the default `route-map-out` (OUT_SLA) applies.\n\n- With the default of 1, IN_SLA would have been used.\n- With BGP on loopback there is one session, so the map applies to the whole advertisement, not per overlay.\n- The BGP session stays up. Only the advertised attributes change.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-037',
    topic: '5.2',
    type: 'fill',
    difficulty: 2,
    stem: 'A hub serving 3,000 spokes shows high CPU because it keeps sending shortcut offers that fail. Which hub phase 1 option (default 5 seconds, range 1–300) sets the interval between shortcut offers? (Enter the option name.)',
    answer: ['auto-discovery-offer-interval', 'set auto-discovery-offer-interval'],
    explanation: 'By default the hub sends a shortcut offer every five seconds. With many spokes and failing offers, this loads the hub. `set auto-discovery-offer-interval <1-300>` rate-limits the offers.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-038',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Each branch has overlays to FGT-Hub1 and FGT-Hub2. The datacenter core routers learn branch prefixes from both hubs over eBGP and should enter through the hub that has the healthiest overlay to each branch. Which spoke-side setting lets the spokes influence this using their SD-WAN member priorities?',
    options: [
      'set route-metric priority on the SD-WAN neighbors, so member priorities are mapped to the MED of routes advertised to the hubs over iBGP',
      'set auto-discovery-forwarder enable on the spoke overlays',
      'set next-hop-self enable on the spoke BGP neighbors',
      'set sla-stickiness enable on the spoke SD-WAN rules',
    ],
    answer: [0],
    explanation: 'With `route-metric priority`, the SD-WAN neighbor selects by member priority-in-sla / priority-out-sla, and the spoke maps those priorities into the **MED** of its iBGP advertisements. Each hub then presents different MEDs to its external eBGP peers, which pick the hub with the lowest MED.\n\n- auto-discovery-forwarder relays shortcut messages between hubs.\n- next-hop-self rewrites next hops and doesn\'t express health.\n- sla-stickiness affects session switching on the spoke, not hub ingress.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-039',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A company has regions EU and US, each with its own hubs. Spokes never need direct tunnels to spokes in the other region, but they do need shortcuts within their region. Which inter-region routing design does Fortinet prefer?',
    options: [
      'eBGP between the regional hubs, each advertising a summary of its region, with ADVPN used only within each region',
      'iBGP between the regional hubs with original next hops preserved',
      'A single route-reflector hub for both regions, with all spokes peering to it',
      'OSPF area 0 across the inter-hub tunnels, with each region in its own area',
    ],
    answer: [0],
    explanation: 'Fortinet\'s 7.6 architecture guide: "If cross-regional ADVPN is required, iBGP between regions will be required. If there is no requirement for ADVPN between regions, eBGP is preferred." With eBGP, each regional gateway advertises a summary of its prefixes to the other regions, and branches send cross-region traffic to their regional hub.\n\n- iBGP with preserved next hops is the more complex design, needed only for cross-regional shortcuts.\n- One RR hub for all regions defeats the regional design.\n- The documented inter-region designs are BGP based.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-040',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The regions use iBGP between FGT-Hub-EU and FGT-Hub-US so that EU spokes can build shortcuts to US spokes. Traffic from FGT-Spoke1 (EU) to 10.21.5.0/24 (behind a US spoke whose loopback is 172.17.0.5) always crosses both hubs, and no cross-region shortcut forms. What is the most likely cause?',
    exhibit: String.raw`FGT-Spoke1 # get router info bgp network 10.21.5.0/24
VRF 0 BGP routing table entry for 10.21.5.0/24
Paths: (1 available, best #1, table Default-IP-Routing-Table)
  Not advertised to any peer
  Original VRF 0
  Local
    172.16.255.252 from 172.16.255.252 (172.16.255.252)
      Origin IGP metric 0, localpref 100, valid, internal, best
      Originator: 172.17.0.5, Cluster list: 172.16.255.252 172.17.255.252

FGT-Hub-EU # show router bgp | grep -A6 "edit \"EDGE\""
        edit "EDGE"
            set interface "BGP-Lo"
            set update-source "BGP-Lo"
            set remote-as 65000
            set route-reflector-client enable
            set next-hop-self-rr enable
        next`,
    options: [
      'FGT-Hub-EU sets its own address as next hop on the routes it reflects to its spokes (next-hop-self-rr), so the spoke never sees the US spoke\'s loopback as next hop; cross-regional ADVPN requires the original next hops to be preserved',
      'auto-discovery-crossover is set to allow on the EU hub',
      'The US prefixes are summarised by eBGP before reaching the EU region',
      'The spoke needs ibgp-multipath disabled for routes from another region',
    ],
    answer: [0],
    explanation: 'Fortinet\'s iBGP inter-region design requires "preserving specific prefixes (including their original BGP next-hop values)" between spokes in different regions. Here the route reaches Spoke1 with next hop 172.16.255.252, the EU hub, instead of 172.17.0.5, so it can never resolve over a shortcut. `next-hop-self-rr` ("setting nexthop\'s address to interface\'s IPv4 address for route-reflector routes") causes this. Disable it so reflection preserves next hops, and make sure the inter-hub overlays forward shortcut messages.\n\n- `allow` is the default and doesn\'t block shortcuts.\n- The session shown is iBGP (`internal`), not an eBGP summary.\n- Multipath doesn\'t change next hops.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-041',
    topic: '5.2',
    type: 'multi',
    difficulty: 3,
    stem: 'Refer to the exhibit. PoP1 (four overlays to two hubs) should carry traffic only while at least two of its overlays are in SLA. Otherwise the rule must fail over to PoP2. Which two changes achieve this? (Choose two.)',
    exhibit: String.raw`FGT-Spoke1 # show system sdwan
config system sdwan
    set status enable
    config zone
        edit "PoP1"
        next
        edit "PoP2"
        next
    end
    ...
    config service
        edit 1
            set mode sla
            set dst "all"
            set src "CORP_LAN"
            config sla
                edit "Hubs"
                    set id 1
                next
            end
            set priority-zone "PoP1" "PoP2"
        next
    end
end`,
    options: [
      'Under zone PoP1, set minimum-sla-meet-members 2',
      'Under service 1, set zone-mode enable',
      'Under service 1, set sla-stickiness enable',
      'Under the SD-WAN neighbor for each hub, set minimum-sla-meet-members 2',
      'On the hub phase 1s, set auto-discovery-forwarder enable',
    ],
    answer: [0, 1],
    explanation: 'Fortinet\'s multi-PoP design adds `minimum-sla-meet-members` to the **zone**: below it, the zone\'s state is out of SLA and all its members count as out of SLA. `zone-mode enable` on the **rule** makes steering follow the zone state, with the first `priority-zone` (PoP1) preferred.\n\n- sla-stickiness controls what existing sessions do after recovery. It doesn\'t trigger the failover.\n- `minimum-sla-meet-members` under an SD-WAN **neighbor** chooses which BGP route map is advertised (inbound path). It doesn\'t steer the spoke\'s outbound traffic.\n- auto-discovery-forwarder relays ADVPN messages between hubs.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-042',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A spoke rule uses zone-mode with priority zones PoP1 then PoP2, hold-down-time 30 and sla-stickiness enable. Traffic failed over to PoP2, and PoP1 has just returned to SLA. What happens?',
    options: [
      'Existing sessions stay on the in-SLA PoP2 overlays; new sessions are steered back to PoP1 once the 30-second hold-down has passed',
      'All sessions, existing and new, move back to PoP1 immediately',
      'All sessions stay on PoP2 until an administrator clears the sessions',
      'New sessions keep using PoP2 for 30 minutes, then all sessions move back together',
    ],
    answer: [0],
    explanation: 'In Fortinet\'s multi-PoP example, a 30-second hold-down plus sla-stickiness means that after recovery "existing sessions will remain on the secondary PoP while new sessions will switch back to the primary PoP once the 30-second duration ends". Stickiness keeps a session on its path while that path is in SLA. hold-down-time (in seconds) delays the return to the primary.\n\n- Immediate movement of all sessions is what both settings prevent.\n- New sessions do return, so no manual clearing is needed.\n- The hold-down is in seconds, and existing sessions don\'t move as a group.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-043',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'An MSSP serves 40 small tenants from shared hubs. Tenants at the same branch sites use overlapping RFC 1918 ranges, must never reach each other, and the MSSP wants one set of IPsec tunnels and one BGP design per branch rather than per tenant. Which design fits best?',
    options: [
      'Segmentation over a single overlay: tenant LANs in CE VRFs, tunnels with encapsulation vpn-id-ipip in the PE VRF, and BGP VPNv4 with per-tenant route distinguishers and route targets',
      'A separate set of overlays per tenant, each with its own phase 1s and BGP sessions',
      'A single shared routing table with source NAT per tenant on every branch',
      'One FGCP cluster per tenant at each branch',
    ],
    answer: [0],
    explanation: 'Segmentation over a single overlay carries every VRF over the same tunnels (`vpn-id-ipip` encapsulates the VRF identity). VRFs keep tenants isolated and allow overlapping subnets, and VPNv4 BGP with RD/RT keeps their routes apart. Tunnel and BGP counts don\'t grow with the tenant count.\n\n- Per-tenant overlays multiply tunnels, sessions and health checks by 40.\n- A shared routing table with NAT doesn\'t give routing isolation and is complex to operate.\n- HA clusters per tenant don\'t address segmentation at all.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-044',
    topic: '5.2',
    type: 'multi',
    difficulty: 2,
    stem: 'According to Fortinet\'s SD-WAN deployment guide for MSSPs, which two practices are recommended when onboarding many customer branches? (Choose two.)',
    options: [
      'Create model devices linked to device blueprints, so FortiManager is the source of truth before the real FortiGate connects',
      'Limit per-device work mainly to assigning the blueprint and setting per-device variables, and keep the configuration in templates',
      'Onboard each branch with Device Discovery after configuring it locally',
      'Configure each branch interactively in Device Manager to allow per-customer tweaks',
      'Avoid the FortiManager JSON API so that every change is made in the GUI and is traceable',
    ],
    answer: [0, 1],
    explanation: 'The MSSP guide recommends model devices (which turn FortiManager into the source of truth and suit ZTP and LTP) and heavy templating. It explicitly discourages Device Discovery onboarding and per-device configuration in Device Manager, and it encourages automation through the JSON API, because automation is consistent and traceable.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-045',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit (extracts). Branches run segmentation over a single overlay with CE VRFs 1 and 2. The BGP VPNv4 session between the loopbacks of FGT-Spoke1 and FGT-Hub is up and routes are exchanged, but forwarded traffic between the VRF 1 and VRF 2 LANs fails over HUB1-VPN1. What should be fixed?',
    exhibit: String.raw`FGT-Spoke1 # show vpn ipsec phase1-interface HUB1-VPN1
config vpn ipsec phase1-interface
    edit "HUB1-VPN1"
        ...
        set exchange-ip-addr4 172.16.0.1
        set encapsulation vpn-id-ipip
        ...
    next
end

FGT-Hub # show vpn ipsec phase1-interface VPN1
config vpn ipsec phase1-interface
    edit "VPN1"
        ...
        set exchange-ip-addr4 172.16.255.252
        ...
    next
end`,
    options: [
      'Set encapsulation vpn-id-ipip on the hub phase 1 VPN1 so both ends carry the VRF identity in the tunnel',
      'Set encapsulation gre on both ends',
      'Move the hub tunnel interface into VRF 1',
      'Remove exchange-ip-addr4 from both ends, because it is not VRF-aware',
    ],
    answer: [0],
    explanation: 'Multi-VRF IPsec tunnels need `set encapsulation vpn-id-ipip` (VPN ID with IPIP encapsulation) on every overlay, at both ends. The hub tunnel lacks it (the default is `none`), so the two ends disagree about the encapsulation and the VRF of the traffic cannot be decoded. BGP stays up because `vpn-id-ipip` applies only to forwarded traffic, not to local-out traffic such as the BGP session between the loopbacks.\n\n- GRE doesn\'t carry the VRF ID.\n- The tunnels belong in the PE VRF, not in one customer VRF.\n- exchange-ip-addr4 provides loopback reachability for BGP and must stay.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-046',
    topic: '5.2',
    type: 'match',
    difficulty: 2,
    stem: 'Match each element of a VRF-aware SD-WAN overlay with its role.',
    pairs: [
      ['PE VRF', 'Holds the VRF-aware overlay tunnel interfaces'],
      ['CE VRF', 'Holds a customer or department LAN interface'],
      ['encapsulation vpn-id-ipip', 'Carries the VRF identity inside the IPsec tunnel'],
      ['rd / export-rt / import-rt', 'VPNv4 route distinguisher and route targets, set on CE VRFs under config router bgp'],
      ['config leak-target', 'Leaks routes from one VRF to another, for example for internet access'],
    ],
    explanation: 'Fortinet\'s architecture guide defines the PE VRF (tunnels) and CE VRFs (LANs). `vpn-id-ipip` makes the tunnel multi-VRF. Under `config router bgp` → `config vrf`, `rd`, `export-rt` and `import-rt` exist only when the role is `ce`. `config leak-target` (formerly `target` under `vrf-leak` in 7.0) leaks routes between VRFs.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-047',
    topic: '5.2',
    type: 'fill',
    difficulty: 3,
    stem: 'In a multiregion design with iBGP between regional hubs, cross-regional ADVPN shortcuts require shortcut messages to be relayed over the inter-hub overlays. Which phase 1 option does the CLI Reference describe as enabling the forwarding of auto-discovery shortcut messages? (Enter the option name.)',
    answer: ['auto-discovery-forwarder', 'set auto-discovery-forwarder enable', 'set auto-discovery-forwarder'],
    explanation: '`auto-discovery-forwarder` ("Enable/disable forwarding auto-discovery short-cut messages", default disable) complements `auto-discovery-sender` (hub toward spokes) and `auto-discovery-receiver` (spokes). The GUI doesn\'t expose it, so configure it in the CLI.',
    lesson: '5.2-multiregion-mssp-vrf',
  },
  {
    id: 'd5-048',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Spoke1 runs BGP per overlay to two hubs over four overlays. After migrating to BGP on loopback as generated by the 7.6.3 overlay template, how many BGP sessions will FGT-Spoke1 have to the hubs?',
    exhibit: String.raw`FGT-Spoke1 # get router info bgp summary
VRF 0 BGP router identifier 172.16.0.1, local AS number 65000
BGP table version is 41
2 BGP AS-PATH entries
0 BGP community entries

Neighbor        V         AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.10.1.254     4      65000    1880    1876       41    0    0 1d02h11m       12
10.10.2.254     4      65000    1879    1876       41    0    0 1d02h11m       12
10.10.3.254     4      65000    1881    1877       41    0    0 1d02h11m       12
10.10.4.254     4      65000    1878    1876       41    0    0 1d02h11m       12

Total number of neighbors 4`,
    options: [
      'Two: one session from Branch-Lo to each hub\'s BGP loopback',
      'Four: one per overlay, as before',
      'One: a single session to the primary hub only',
      'Eight: one per overlay in each direction',
    ],
    answer: [0],
    explanation: 'With BGP on loopback "there is only ever one BGP peer from the SD-WAN device to the HUB, regardless of how many overlays exist". With two hubs, that is two sessions. Prefixes resolve recursively over all overlays through the IKE-injected loopback routes. From 7.6.3, BGP on loopback is Fortinet\'s recommendation and the Overlay Orchestrator default.\n\n- Four sessions is the per-overlay design shown in the exhibit.\n- Dual-hub designs keep a session to each hub.\n- BGP sessions are not counted per direction.',
    lesson: '5.2-dual-hub-bgp-self-healing',
  },
  {
    id: 'd5-049',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Spokes reach the datacenter behind FGT-Hub, but spoke-to-spoke traffic fails and no ADVPN shortcut is ever created. Spoke phase 1s have auto-discovery-receiver enabled. What is the cause?',
    exhibit: String.raw`FGT-Hub # show vpn ipsec phase1-interface VPN1
(excerpt — unrelated lines removed)
    edit "VPN1"
        set type dynamic
        set net-device disable
        set auto-discovery-sender enable

FGT-Hub # show firewall policy
config firewall policy
    edit 1
        set name "spoke2hub"
        set srcintf "VPN1"
        set dstintf "port3"
        set srcaddr "all"
        set dstaddr "DC-LAN"
        set action accept
        set schedule "always"
        set service "ALL"
    next
    edit 2
        set name "hub2spoke"
        set srcintf "port3"
        set dstintf "VPN1"
        set srcaddr "DC-LAN"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
    next
end`,
    options: [
      'The hub has no spoke-to-spoke policy (srcintf VPN1 to dstintf VPN1), so the first packets are dropped and no shortcut offer is triggered',
      'The hub needs auto-discovery-receiver enabled as well as auto-discovery-sender',
      'net-device must be enabled on the hub for shortcuts to form',
      'ADVPN shortcuts require IKEv2, and the exhibit shows IKEv1',
    ],
    answer: [0],
    explanation: 'In ADVPN 1.0 and 2.0, the hub must allow spoke-to-spoke traffic (`srcintf` and `dstintf` both the hub tunnel or overlay zone). The first packets cross the hub, and that crossing triggers the shortcut offer. Without the policy, the traffic is dropped and nothing is offered.\n\n- The receiver role belongs to spokes.\n- Fortinet\'s ADVPN-with-BGP example requires `net-device disable` on the hub, as shown.\n- ADVPN works with IKEv1 and IKEv2. The exhibit doesn\'t show the version anyway.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-050',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit, captured on FGT-Spoke1 with diagnose debug application ike -1. Which statement is true?',
    exhibit: String.raw`ike 0: comes 203.0.113.1:500->192.0.2.10:500,ifindex=5....
ike 0: IKEv1 exchange=Informational id=3c10fb6a76f1e264/6c7b397100dffc63:58ac7c02 len=204
ike 0:HUB1-VPN1:35: notify msg received: SHORTCUT-OFFER
ike 0:HUB1-VPN1: shortcut-offer 10.1.1.10->10.1.2.20 psk 64 ppk 0 ver 1 mode 0
ike 0 looking up shortcut by addr 10.1.2.20, name HUB1-VPN1
ike 0:HUB1-VPN1: send shortcut-query 1438189781753480593 d3fdd1bfbc94caee/0000000000000000 192.0.2.10 10.1.1.10->10.1.2.20 psk 64 ttl 32 nat 0 ver 1 mode 0
ike 0:HUB1-VPN1:35: sent IKE msg (SHORTCUT-QUERY): 192.0.2.10:500->203.0.113.1:500, len=236, id=3c10fb6a76f1e264/6c7b397100dffc63:12e263f7`,
    options: [
      'The hub saw traffic from 10.1.1.10 to 10.1.2.20 pass through it and offered a shortcut; FGT-Spoke1 is now sending a shortcut query through the hub',
      'FGT-Spoke2 sent the shortcut offer directly to FGT-Spoke1 over the internet',
      'The shortcut tunnel HUB1-VPN1_0 is already established',
      'FGT-Spoke1 is acting as an auto-discovery sender for 10.1.2.20',
    ],
    answer: [0],
    explanation: 'The offer arrives from 203.0.113.1, the hub, over the existing IKE SA of HUB1-VPN1, for the flow 10.1.1.10 → 10.1.2.20 that the hub forwarded. FGT-Spoke1 answers by sending a SHORTCUT-QUERY to the hub (`192.0.2.10:500->203.0.113.1:500`), which relays it toward FGT-Spoke2.\n\n- The offer comes from the hub, not from FGT-Spoke2.\n- No reply has arrived and no dynamic tunnel has been added yet.\n- The sender role is the hub\'s. The spoke is the receiver.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-051',
    topic: '5.3',
    type: 'order',
    difficulty: 2,
    stem: 'Put the ADVPN 1.0 shortcut process in order, starting when a host behind FGT-Spoke1 first sends traffic to FGT-Spoke2\'s LAN.',
    items: [
      'FGT-Spoke1 sends the first packets through its overlay to the hub',
      'The hub forwards the packets to FGT-Spoke2 and sends a shortcut offer to FGT-Spoke1',
      'FGT-Spoke1 sends a shortcut query through the hub',
      'FGT-Spoke2 returns a shortcut reply through the hub',
      'FGT-Spoke1 and FGT-Spoke2 negotiate IKE directly and create the shortcut tunnel',
      'Routing resolves FGT-Spoke2\'s prefixes through the shortcut and traffic flows directly',
    ],
    explanation: 'Traffic must first cross the hub (spoke-to-spoke policy). The hub, as auto-discovery sender, sends the offer. The originating spoke queries, the remote spoke replies with its reachable address (or NAT mapping), and the spokes then run IKE directly to create `parent_0`. Finally the routing design (route reflection, BGP on loopback, dynamic BGP or IKE routes) moves the prefixes onto the shortcut.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-052',
    topic: '5.3',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit from FGT-Spoke1. What is HUB1-VPN1_0?',
    exhibit: String.raw`FGT-Spoke1 # diagnose vpn tunnel list name HUB1-VPN1_0
------------------------------------------------------
name=HUB1-VPN1_0 ver=1 serial=9 192.0.2.10:0->192.0.2.20:0 tun_id=192.0.2.20
bound_if=7 lgwy=static/1 tun=intf/0 mode=dial_inst/3 encap=none/728 options[02d8]=npu create_dev no-sysctl rgwy-chg frag-rfc accept_traffic=1
 parent=HUB1-VPN1 index=0
proxyid_num=1 child_num=0 refcnt=17 ilast=4 olast=4 ad=r/2
stat: rxp=1 txp=100 rxb=112 txb=4686
dpd: mode=on-idle on=1 idle=5000ms retry=3 count=0 seqno=231`,
    options: [
      'An ADVPN shortcut to FGT-Spoke2 (192.0.2.20), created as a dynamic instance of the parent phase 1 HUB1-VPN1',
      'A second tunnel to the hub created for redundancy by an IPsec aggregate',
      'A FortiClient dial-up user connected to FGT-Spoke1',
      'A placeholder tunnel that is waiting for the hub to connect',
    ],
    answer: [0],
    explanation: 'Shortcuts are dynamic instances of the spoke\'s parent phase 1: `mode=dial_inst/3`, `parent=HUB1-VPN1 index=0`, and the remote endpoint is the other spoke\'s underlay IP (192.0.2.20), not the hub. `create_dev` shows a kernel interface exists for it (the spoke uses `net-device enable`), so SD-WAN can steer to it.\n\n- Aggregate members are configured phase 1s, not dial_inst instances.\n- The spoke parent is a static phase 1 to the hub, not a dial-up server for users.\n- A placeholder doesn\'t connect to the hub, and this instance is up with traffic.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-053',
    topic: '5.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two phase 1 settings are required to enable ADVPN between a hub and its spokes? (Choose two.)',
    options: [
      'set auto-discovery-sender enable on the hub dial-up phase 1',
      'set auto-discovery-receiver enable on the spoke phase 1s',
      'set auto-discovery-receiver enable on the hub dial-up phase 1',
      'set auto-discovery-forwarder enable on the spoke phase 1s',
      'set add-route enable on the hub dial-up phase 1',
    ],
    answer: [0, 1],
    explanation: 'The hub sends shortcut messages (`auto-discovery-sender`) and the spokes accept them (`auto-discovery-receiver`). Both default to disable.\n\n- The hub is not a receiver.\n- The forwarder relays shortcut messages between hubs, for example across regions. It isn\'t a spoke requirement.\n- Fortinet\'s ADVPN examples set `add-route disable` and use BGP.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-054',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'An engineer with a DMVPN phase 3 background asks which FortiOS ADVPN element plays the role of the hub\'s NHRP redirect. What is the best answer?',
    options: [
      'The IKE shortcut offer that the hub (auto-discovery-sender) sends to the originating spoke',
      'The shortcut reply sent by the destination spoke',
      'The BGP update that the hub reflects to the spokes',
      'The DPD probe sent by the hub over the parent tunnel',
    ],
    answer: [0],
    explanation: 'In DMVPN phase 3, the hub sees traffic hairpinning and sends an NHRP redirect to the source spoke. In FortiOS ADVPN, the hub sees traffic entering and leaving its auto-discovery-sender tunnel and sends a **shortcut offer** in an IKE notification. The spoke then sends a shortcut query, roughly the NHRP resolution request, and the remote spoke answers with a shortcut reply.\n\n- The shortcut reply corresponds to the resolution reply.\n- BGP distributes routes. It doesn\'t trigger the shortcut.\n- DPD only checks liveness.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-055',
    topic: '5.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each DMVPN phase 3 element with its closest FortiOS ADVPN counterpart.',
    pairs: [
      ['NHRP redirect from the hub', 'IKE shortcut offer'],
      ['NHRP resolution request', 'IKE shortcut query'],
      ['NHRP resolution reply', 'IKE shortcut reply'],
      ['Dynamic spoke-to-spoke tunnel on the mGRE interface', 'Dynamic instance of the parent phase 1 (for example HUB1-VPN1_0)'],
      ['NHRP registration of a spoke with the hub', 'Spoke phase 1 connecting to the hub\'s dial-up phase 1'],
    ],
    explanation: 'FortiOS carries ADVPN discovery in IKE notifications over the existing IKE SAs instead of NHRP, and it builds shortcuts as dynamic instances of the spoke\'s parent phase 1 instead of entries on an mGRE interface. The hub learns spokes because they dial in to its `type dynamic` phase 1.\n\nOne difference in the reply path: in DMVPN phase 3 the destination spoke sends the NHRP resolution reply directly to the source spoke (over the new spoke-to-spoke tunnel), while the FortiOS shortcut reply travels back through the hub over the existing IKE SAs. Only after the reply do the spokes run IKE directly.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-056',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. During a hub ISP1 outage, HUB1-VPN1 went down on the spokes, but the existing shortcut HUB1-VPN1_0 between FGT-Spoke1 and FGT-Spoke2 stayed up. Policy requires shortcuts to be removed when their parent overlay is down. What should be changed?',
    exhibit: String.raw`FGT-Spoke1 # show full vpn ipsec phase1-interface HUB1-VPN1 | grep auto-discovery
        set auto-discovery-sender disable
        set auto-discovery-receiver enable
        set auto-discovery-forwarder disable
        set auto-discovery-psk disable
        set auto-discovery-shortcuts independent
        set auto-discovery-crossover allow
        set auto-discovery-offer-interval 5
        set auto-discovery-dialup-placeholder disable`,
    options: [
      'set auto-discovery-shortcuts dependent on the spoke phase 1s',
      'set auto-discovery-crossover block on the spoke phase 1s',
      'set auto-discovery-psk enable on the spoke phase 1s',
      'set auto-discovery-offer-interval 1 on the spoke phase 1s',
    ],
    answer: [0],
    explanation: '`auto-discovery-shortcuts` controls deletion of child shortcuts when the parent goes down. With `independent` (default), shortcuts remain up. With `dependent`, they are brought down with the parent.\n\n- Crossover controls shortcuts between different network IDs.\n- auto-discovery-psk selects pre-shared-key authentication for shortcuts.\n- The offer interval is a hub setting for how often offers are sent.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-057',
    topic: '5.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which SD-WAN rule option keeps a recovered ADVPN shortcut (or recovered primary overlay) at low priority for a set number of seconds before traffic fails back to it? (Enter the option name.)',
    answer: ['hold-down-time', 'set hold-down-time'],
    explanation: '`config system sdwan` → `config service` → `set hold-down-time <0-10000000>` (seconds, default 0). The recovered member is held at low priority until the timer expires, which prevents flapping. It applies to shortcuts and to the primary VPN tunnels.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-058',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The shortcut vd2-1_0 recovered a few seconds ago. Why is it still ranked last, below members with higher packet loss?',
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan service4
Service(1): Address Mode(IPV4) flags=0x200
 Gen(34), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(priority), link-cost-factor(packet-loss), link-cost-threshold(0), health-check(ping)
Hold down time(15) seconds, Hold start at 2003 second, now 2010
 Member sub interface(4):
 1: seq_num(1), interface(vd2-1):
 1: vd2-1_0(86)
 3: seq_num(2), interface(vd2-2):
 1: vd2-2_0(88)
 Members(4):
 1: Seq_num(2 vd2-2_0), alive, packet loss: 0.000%, selected
 2: Seq_num(2 vd2-2), alive, packet loss: 0.000%, selected
 3: Seq_num(1 vd2-1), alive, packet loss: 24.000%, selected
 4: Seq_num(1 vd2-1_0), alive, packet loss: 0.000%, selected
 Dst address(1):
 33.1.1.101-33.1.1.200`,
    options: [
      'The rule\'s 15-second hold-down started at 2003 and it is now 2010, so the recovered shortcut stays at low priority until the hold-down expires',
      'Shortcuts are always ranked below their parent overlays in priority mode',
      'vd2-1_0 has failed its SLA and is excluded from selection',
      'The packet-loss value of a shortcut is ignored until sla-stickiness is enabled',
    ],
    answer: [0],
    explanation: 'The exhibit is modelled on Fortinet\'s hold-down example (same rule, timer and members). When a downed shortcut recovers and is added back to the rule, it is held at low priority until `hold-down-time` (15 s here) elapses. Only 7 s have passed (2010 − 2003). Once the timer expires, the shortcut is ranked by its packet loss again.\n\n- Shortcuts normally rank ahead of their parent. The hold-down is what demotes it here.\n- The member is `alive` and `selected`.\n- sla-stickiness keeps existing sessions on an in-SLA path. It doesn\'t enable metric evaluation.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-059',
    topic: '5.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Spoke phase 1s use idle-timeout enable with idle-timeoutinterval 10. Overnight no user traffic flows between FGT-Spoke1 and FGT-Spoke2, but SD-WAN health checks run and the two spokes have a dynamic BGP session over their shortcut. Which two statements are true? (Choose two.)',
    options: [
      'The ICMP probes of the SD-WAN link monitor on the shortcut do not count as user traffic that keeps the shortcut alive',
      'The spoke-to-spoke BGP traffic is matched by a dynamic IKE selector and does not reset the idle timeout',
      'The shortcut stays up indefinitely because health-check probes keep it active',
      'The BGP keepalives keep the shortcut up, so the BGP session never drops',
      'idle-timeout applies only to the parent tunnels to the hub, never to shortcuts',
    ],
    answer: [0, 1],
    explanation: 'Fortinet documents that the dynamic link monitors\' ICMP probes "will not be counted as actual user traffic that keeps the spoke-to-spoke tunnel alive". It also documents that IKE creates a dynamic selector for spoke-to-spoke health checks, which BGP also matches, so "BGP traffic does not count towards the data traffic and will not impact IPsec idle timeout and shortcut tunnel tear down". After 10 idle minutes the shortcut is torn down, and the spoke-to-spoke BGP session goes with it.\n\n- The probes don\'t keep it up, and neither do the BGP keepalives.\n- Idle timeout is exactly how shortcuts are removed.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-060',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Each spoke has an internet overlay (network-id 1) and an MPLS overlay (network-id 2) to FGT-Hub. Shortcuts are sometimes attempted from one spoke\'s internet overlay to the other spoke\'s MPLS overlay, which can never work. Which ADVPN 1.0 setting prevents this?',
    exhibit: String.raw`FGT-Spoke1 # show vpn ipsec phase1-interface
(excerpt — unrelated lines removed)
    edit "HUB1-INET"
        set interface "port1"
        set network-id 1
        set auto-discovery-receiver enable
    edit "HUB1-MPLS"
        set interface "port2"
        set network-id 2
        set auto-discovery-receiver enable`,
    options: [
      'set auto-discovery-crossover block, so shortcuts are not set up between tunnels with different network IDs',
      'set auto-discovery-shortcuts dependent',
      'Set network-id 1 on both overlays so they match',
      'set auto-discovery-psk enable',
    ],
    answer: [0],
    explanation: '`auto-discovery-crossover` "Allow/block set-up of short-cut tunnels between different network IDs" defaults to `allow`. Setting `block` keeps shortcuts between overlays with the same network ID only (internet with internet, MPLS with MPLS). ADVPN 2.0 solves the same problem with transport groups.\n\n- Dependent shortcuts concern parent failure.\n- Giving both overlays the same ID would remove the distinction, and two tunnels to the same hub need distinct IDs when they share addresses.\n- auto-discovery-psk only changes shortcut authentication.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-061',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'FGT-Spoke1 and FGT-Spoke2 both sit behind carrier NAT. Shortcut offers and replies are exchanged through the hub, but the direct shortcut fails. Which property must the NAT devices have for ADVPN UDP hole punching to work?',
    options: [
      'RFC 4787 endpoint-independent mapping',
      'Symmetric NAT with a new port per destination',
      'Static one-to-one NAT for every spoke',
      'ALG support for IKE on UDP 500',
    ],
    answer: [0],
    explanation: 'Fortinet: "UDP hole punching allows ADVPN shortcuts to be established through a UDP hole on a NAT device. The NAT device must support RFC 4787 Endpoint-Independent Mapping." The shortcut reply carries the remote spoke\'s NAT mapping, and the spokes punch through to it.\n\n- Symmetric (endpoint-dependent) NAT changes the mapping per destination, which breaks hole punching.\n- Static NAT would make hole punching unnecessary, but it isn\'t the requirement.\n- An IKE ALG is not required and can interfere.',
    lesson: '5.3-advpn-operation',
  },
  {
    id: 'd5-062',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Hub reflects iBGP routes between spokes (BGP per overlay, addressed tunnels). After traffic to FGT-Spoke2 started, the route to 10.1.2.0/24 on FGT-Spoke1 points to HUB1-VPN1_0 with gateway 10.10.1.2. Why?',
    exhibit: String.raw`FGT-Spoke1 # get router info routing-table bgp
Routing table for VRF=0
B       10.0.1.0/24 [200/0] via 10.10.1.254, HUB1-VPN1, 00:23:57
B       10.1.2.0/24 [200/0] via 10.10.1.2, HUB1-VPN1_0, 00:00:42

FGT-Spoke1 # diagnose vpn tunnel list name HUB1-VPN1_0
(excerpt — unrelated lines removed)
name=HUB1-VPN1_0 ver=1 serial=9 192.0.2.10:0->192.0.2.20:0 tun_id=192.0.2.20
 parent=HUB1-VPN1 index=0`,
    options: [
      'The hub reflected FGT-Spoke2\'s route with its original next hop, FGT-Spoke2\'s overlay address 10.10.1.2, and that next hop is now reached directly through the shortcut',
      'add-route on the shortcut installed a static route to 10.1.2.0/24',
      'The hub rewrote the next hop to 10.10.1.2 after it sent the shortcut offer',
      'FGT-Spoke2 advertised 10.1.2.0/24 over eBGP with a better administrative distance',
    ],
    answer: [0],
    explanation: 'A route reflector passes iBGP routes on **without changing the next hop**, so FGT-Spoke1 learns 10.1.2.0/24 with FGT-Spoke2\'s overlay address 10.10.1.2 as next hop. Once the shortcut to FGT-Spoke2 exists, that next hop is directly reachable over `HUB1-VPN1_0`, and the route follows it, matching Fortinet\'s ADVPN-with-BGP example output.\n\n- The route is `B`, not an IKE static route.\n- The hub doesn\'t modify next hops on shortcut events.\n- Distance 200 is iBGP. eBGP would show 20.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-063',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Hub (AS 65000) peers with FGT-Spoke1 (AS 65101) and FGT-Spoke2 (AS 65102) over eBGP on loopbacks. A shortcut between the spokes is up, but FGT-Spoke1 still sends traffic for 10.1.2.0/24 through the hub. What should be changed?',
    exhibit: String.raw`FGT-Spoke1 # get router info bgp network 10.1.2.0/24
VRF 0 BGP routing table entry for 10.1.2.0/24
Paths: (1 available, best #1, table Default-IP-Routing-Table)
  Not advertised to any peer
  Original VRF 0
  65000 65102
    172.16.255.252 from 172.16.255.252 (172.16.255.252)
      Origin IGP metric 0, localpref 100, valid, external, best

FGT-Spoke1 # diagnose vpn tunnel list name HUB1-VPN1_0
(excerpt — unrelated lines removed)
name=HUB1-VPN1_0 ver=2 serial=12 192.0.2.10:0->192.0.2.20:0 tun_id=192.0.2.20
 parent=HUB1-VPN1 index=0`,
    options: [
      'On the hub neighbor group, set attribute-unchanged next-hop so routes passed between spokes keep the originating spoke\'s loopback as next hop',
      'On the hub, set route-reflector-client enable on the neighbor group',
      'On FGT-Spoke1, set allowas-in-enable enable',
      'On FGT-Spoke1, disable recursive-next-hop',
    ],
    answer: [0],
    explanation: 'With eBGP, the hub sets the next hop to itself (172.16.255.252) when it advertises FGT-Spoke2\'s prefix to FGT-Spoke1. That next hop never resolves over the shortcut, so traffic keeps going to the hub. `set attribute-unchanged next-hop` on the hub keeps FGT-Spoke2\'s loopback (172.16.0.2) as next hop. That address resolves over the shortcut through the IKE-injected /32.\n\n- Route reflection is an iBGP concept and doesn\'t apply to eBGP peers.\n- allowas-in matters only when a spoke\'s own AS appears in the path. Here the spokes use different AS numbers.\n- Disabling recursive next hop would break loopback-based resolution entirely.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-064',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The design uses dynamic BGP on loopback without route reflection. The shortcut between FGT-Spoke1 and FGT-Spoke2 is up, but the spokes never form a BGP session with each other. Both spokes have the same BGP configuration. What is missing?',
    exhibit: String.raw`FGT-Spoke1 # show router bgp
config router bgp
    set as 65000
    set router-id 172.16.0.1
    set ibgp-multipath enable
    set recursive-next-hop enable
    config neighbor
        edit "172.16.255.252"
            set interface "Branch-Lo"
            set update-source "Branch-Lo"
            set remote-as 65000
        next
    end
    config neighbor-group
        edit "SPOKES"
            set interface "Branch-Lo"
            set update-source "Branch-Lo"
            set remote-as 65000
        next
    end
    config neighbor-range
        edit 1
            set prefix 172.16.0.0 255.255.240.0
            set neighbor-group "SPOKES"
        next
    end
end

FGT-Spoke1 # get router info bgp summary | grep "^172"
172.16.255.252  4      65000     252     254        3    0    0 00:17:22        3`,
    options: [
      'set passive disable in neighbor-group SPOKES on the spokes, because neighbor groups are passive by default and two passive spokes never initiate the session',
      'set route-reflector-client enable on the hub neighbor group',
      'Add exchange-ip-addr4 to the shortcut phase 1',
      'Change the neighbor-range prefix to 172.16.255.0/24',
    ],
    answer: [0],
    explanation: 'The `passive` setting defaults to enable for neighbor groups, so both spokes wait and neither connects. Fortinet\'s active dynamic BGP design requires each spoke to set `set passive disable` on its spoke neighbor group, so the spokes initiate BGP over the shortcut and exchange their routes.\n\n- Route reflection is deliberately off in this design.\n- A shortcut is a dynamic instance of the parent phase 1, which already carries `exchange-ip-addr4`. There is no separate shortcut phase 1.\n- The range must cover the other spokes\' loopbacks (172.16.0.0/20), not the hub\'s.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-065',
    topic: '5.3',
    type: 'multi',
    difficulty: 3,
    stem: 'An architect replaces route reflection with dynamic BGP in an ADVPN network with thousands of prefixes. Which two elements are part of Fortinet\'s documented design? (Choose two.)',
    options: [
      'The hub advertises summary routes that cover the spoke LANs, backed by blackhole static routes, so first packets reach the hub before a shortcut exists',
      'Each spoke has a neighbor group and neighbor range covering the other spokes\' addresses, with passive disabled',
      'The hub neighbor group sets route-reflector-client enable so spokes learn each other\'s specific prefixes',
      'Spokes set net-device disable so that BGP can run over the shortcut',
      'Spokes set auto-discovery-forwarder enable to accept BGP sessions from other spokes',
    ],
    answer: [0, 1],
    explanation: 'In Fortinet\'s active dynamic BGP example, the hub has route reflection disabled and advertises summary routes (blackhole statics plus `config network`). Spokes configure `neighbor-group` + `neighbor-range` with `set passive disable`, so they actively open BGP to each other once the shortcut exists. Each spoke learns only the routes of spokes it talks to, which relieves hub CPU.\n\n- Enabling RR is exactly what the design avoids.\n- Spokes use `net-device enable` in these examples.\n- auto-discovery-forwarder relays shortcut messages and has nothing to do with BGP.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-066',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The hub sends spokes only a default route through BGP and does not reflect routes. After a shortcut formed, these routes appeared on FGT-Spoke1. Which spoke configuration produces them?',
    exhibit: String.raw`FGT-Spoke1 # get router info routing-table static
Routing table for VRF=0
S       10.1.2.0/24 [15/0] via HUB1-VPN1_0 tunnel 192.0.2.20 vrf 0, [1/0]
S       10.2.2.0/24 [15/0] via HUB1-VPN1_0 tunnel 192.0.2.20 vrf 0, [1/0]`,
    options: [
      'mode-cfg, mode-cfg-allow-client-selector and add-route enabled on the spoke phase 1s, with phase 2 source selectors naming each spoke\'s LAN subnets',
      'exchange-ip-addr4 set to the spoke loopback on each overlay',
      'auto-discovery-forwarder enabled on the spoke phase 1s',
      'A static route template from FortiManager with Automatic routing',
    ],
    answer: [0],
    explanation: 'Fortinet\'s large-scale ADVPN design injects IKE routes from phase 2 selectors. With `mode-cfg enable` and `mode-cfg-allow-client-selector enable`, the spokes use custom selectors (their LAN address group). With `add-route enable`, IKE installs routes to the peer\'s selectors when the shortcut is negotiated, at the IKE route distance of 15. No reflection is needed.\n\n- exchange-ip-addr4 injects only a /32 for the loopback.\n- The forwarder relays shortcut messages.\n- A FortiManager static route would not point at a dynamic shortcut instance.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-067',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'In a BGP-on-loopback ADVPN design, FGT-Spoke1 learns 10.1.2.0/24 with next hop 172.16.0.2 (FGT-Spoke2\'s loopback). When a shortcut between the spokes comes up, what makes 172.16.0.2 reachable through the shortcut so the route moves onto it?',
    options: [
      'exchange-ip-addr4 on the parent phase 1s: IKE on the shortcut injects a /32 route to the peer spoke\'s loopback',
      'The hub sends a BGP update with a new next hop once the shortcut is up',
      'add-route on the hub installs the loopback route on both spokes',
      'auto-discovery-crossover allow advertises loopbacks across overlays',
    ],
    answer: [0],
    explanation: 'Shortcuts inherit the parent phase 1 settings, including `exchange-ip-addr4`. When the shortcut negotiates, each spoke receives the other\'s loopback and installs a /32 over the shortcut. With `recursive-next-hop`, the BGP route to 10.1.2.0/24 then resolves through `HUB1-VPN1_0`, as in Fortinet\'s active dynamic BGP example, where the remote spoke\'s LAN shows `via 10.200.1.101 (recursive via spoke1-1_0 tunnel 13.1.1.3)`.\n\n- The hub doesn\'t change next hops for shortcut events.\n- The hub\'s add-route doesn\'t act on spoke-to-spoke tunnels.\n- Crossover controls whether shortcuts may join different network IDs.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-068',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'An SD-WAN rule steers spoke-to-spoke traffic over the members HUB1-INET and HUB1-MPLS. The shortcut HUB1-INET_0 falls out of SLA. The spoke still has a default route through both hub overlays and a specific BGP route to the remote LAN through the shortcut. Fortinet\'s MSSP guide recommends a rule setting so that the hub overlays are not selected only because the default route makes them valid. Which setting?',
    options: [
      'set tie-break fib-best-match',
      'set tie-break cfg-order',
      'set sla-stickiness disable',
      'set shortcut disable',
    ],
    answer: [0],
    explanation: 'With `tie-break fib-best-match`, the rule considers only members holding the best (most specific) route to the destination. The default or summary route through the hub overlays doesn\'t qualify them while a more specific route exists through the shortcut. Traffic switches smoothly once an alternative shortcut is built.\n\n- cfg-order picks members by configuration order among those meeting SLA. That is the behaviour the guide warns about.\n- Disabling stickiness or shortcuts makes traffic move to the hub, the opposite of the goal.',
    lesson: '5.3-advpn-routing-designs',
  },
  {
    id: 'd5-069',
    topic: '5.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two limitations of ADVPN 1.0 does ADVPN 2.0 address? (Choose two.)',
    options: [
      'Shortcut path selection relied entirely on the overlay the traffic arrived on, so the shortcut could be built over a poor remote link',
      'The local spoke had no information about the remote spoke\'s WAN links, cost or link quality before building the shortcut',
      'Shortcuts could only be built with IKEv1',
      'The hub had to run an NHRP server for each overlay',
      'Spoke-to-spoke traffic could not be allowed by a firewall policy on the hub',
    ],
    answer: [0, 1],
    explanation: 'Fortinet: with the previous ADVPN, "shortcut path selection relied entirely on the overlays between the spokes", with hub policy routes and user traffic needed to trigger it. ADVPN 2.0 adds **edge discovery** (the extended shortcut reply carries the remote spoke\'s WAN links, transport group, link quality, cost and configuration order) and **path management** on the local spoke.\n\n- ADVPN 1.0 supports IKEv1 and IKEv2.\n- FortiOS doesn\'t use NHRP.\n- The hub spoke-to-spoke policy is required in both versions.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-070',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit, from FGT-Spoke1 running ADVPN 2.0. Which statement is true?',
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan advpn-session
Session head(FGT-Spoke2-0-HUB1:1)
(1) Service ID(1), last access(41203), remote health check info(2)
Selected path: local(HUB1-VPN2, port2) gw: 198.51.100.254 remote IP: 198.51.100.20(172.16.0.2) remote gw-name: HUB1-VPN2, status: up
Remote information:
1: latency: 182.410000 jitter: 21.300000 pktloss: 4.000000 mos: 3.100000 sla: 0x0 cost: 0 remote gw: HUB1-VPN1 transport_group: 1 bandwidth up: 999999 down: 999997 bidirection: 1999996
ipv4: 192.0.2.20(172.16.0.2) ipv6 ::(0:0:0:0:0:0:0:0)
2: latency: 0.310000 jitter: 0.020000 pktloss: 0.000000 mos: 4.404000 sla: 0x1 cost: 0 remote gw: HUB1-VPN2 transport_group: 1 bandwidth up: 999999 down: 999997 bidirection: 1999996
ipv4: 198.51.100.20(172.16.0.2) ipv6 ::(0:0:0:0:0:0:0:0)`,
    options: [
      'FGT-Spoke1 learned FGT-Spoke2\'s link health through edge discovery and chose a shortcut from its port2 to FGT-Spoke2\'s HUB1-VPN2 underlay, because FGT-Spoke2\'s HUB1-VPN1 link is out of SLA',
      'The hub chose the shortcut path and pushed it to FGT-Spoke1 in the shortcut offer',
      'No shortcut can be built, because both remote links are in transport group 1',
      'The output was taken on the hub and lists both spokes\' links',
    ],
    answer: [0],
    explanation: '`diagnose sys sdwan advpn-session` runs on the local spoke and shows the remote spoke\'s WAN link information and the path manager\'s choice. Remote link 1 (HUB1-VPN1) is out of SLA (`sla: 0x0`, 182 ms, 4% loss), and link 2 (HUB1-VPN2) is in SLA. The selected path is local HUB1-VPN2/port2 to remote 198.51.100.20, status up.\n\n- In ADVPN 2.0, path management runs on the local spoke, not on the hub.\n- A shared transport group is what *allows* a shortcut between members.\n- The output is per-spoke (session head FGT-Spoke2) and taken on FGT-Spoke1.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-071',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Both spokes use the same member layout. FGT-Spoke1\'s internet link is down, so only its MPLS overlay is healthy. FGT-Spoke2\'s MPLS link is down, so only its internet overlay is healthy. With ADVPN 2.0, what happens to traffic from FGT-Spoke1 to FGT-Spoke2?',
    exhibit: String.raw`FGT-Spoke1 # show system sdwan
(excerpt — unrelated lines removed)
        edit 3
            set interface "HUB1-INET"
            set transport-group 1
        edit 4
            set interface "HUB1-MPLS"
            set transport-group 2`,
    options: [
      'No shortcut is built, because path management never pairs members of different transport groups; traffic stays on the path through the hub',
      'A shortcut is built from FGT-Spoke1\'s MPLS overlay to FGT-Spoke2\'s internet overlay',
      'The hub builds a shortcut on behalf of both spokes',
      'Traffic is dropped, because ADVPN 2.0 removes the path through the hub when shortcuts fail',
    ],
    answer: [0],
    explanation: 'Transport groups describe interconnected transports. MPLS (group 2) and the internet (group 1) are segregated, so "the Path Selection mechanism will never attempt to build a shortcut between members belonging to different transport groups." The spokes keep using the overlays through the hub, which can reach both transports.\n\n- A cross-group shortcut is precisely what transport groups prevent.\n- Hubs don\'t build shortcuts.\n- The hub path remains valid.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-072',
    topic: '5.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which three settings are part of the ADVPN 2.0 configuration on a spoke in config system sdwan? (Choose three.)',
    options: [
      'set advpn-select enable on the overlay zone',
      'set advpn-health-check <name> on the overlay zone',
      'set transport-group <n> on each overlay member',
      'set auto-discovery-sender enable on each overlay member',
      'set advpn-select enable on the hub dial-up phase 1',
      'set transport-group <n> on the health check',
    ],
    answer: [0, 1, 2],
    explanation: 'ADVPN 2.0 spokes use zone `advpn-select` (enable SD-WAN/ADVPN 2.0 selection) and `advpn-health-check` (the health check whose results are sent to peer spokes), plus member `transport-group`. Rules can add `shortcut-priority`.\n\n- `auto-discovery-sender` is a hub phase 1 option, not an SD-WAN member option.\n- `advpn-select` is a zone setting, not a phase 1 option.\n- Transport groups are set per member, not per health check.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-073',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Spoke1 and FGT-Spoke2 share a private MPLS that the hub is not connected to. The administrator wants ADVPN 2.0 to build shortcuts over it, but no placeholder shortcut (Placeholder_MPLS_0) ever appears in the SD-WAN health check or rule. What must change?',
    exhibit: String.raw`FGT-Spoke1 # show vpn ipsec phase1-interface Placeholder_MPLS
config vpn ipsec phase1-interface
    edit "Placeholder_MPLS"
        set type dynamic
        set interface "port3"
        set ike-version 2
        set peertype any
        set net-device disable
        set exchange-ip-addr4 172.16.0.1
        set add-route disable
        set auto-discovery-receiver enable
        set auto-discovery-dialup-placeholder enable
        set network-overlay enable
        set network-id 250
        set psksecret ENC ...
    next
end`,
    options: [
      'Set net-device enable on the placeholder phase 1, as overlay placeholders require',
      'Set type static and a remote-gw pointing to the hub',
      'Disable auto-discovery-dialup-placeholder so the tunnel can connect to the hub',
      'Change ike-version to 1, because placeholders are IKEv1 only',
    ],
    answer: [0],
    explanation: 'Fortinet\'s placeholder configuration requires `type dynamic`, **`net-device enable`** and `auto-discovery-dialup-placeholder enable` on each spoke. `net-device enable` gives each dynamic instance its own interface, so the placeholder shortcut appears as `Placeholder_MPLS_0` and SD-WAN can health-check it and steer to it as a member in its own right. With `net-device disable`, instances get no interface of their own and the design Fortinet documents doesn\'t apply.\n\n- A placeholder never connects to the hub, so it has no remote gateway.\n- Disabling the placeholder option defeats the design.\n- Fortinet\'s placeholder examples use IKEv2.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-074',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. No spoke-to-spoke traffic has been sent yet. The administrator thinks the placeholder overlay is broken. What is the correct assessment?',
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan health-check
Health Check(HUB1_HC):
Seq(3 HUB1-INET): state(alive), packet-loss(0.000%), latency(0.235), jitter(0.011), mos(4.404), bandwidth-up(999998), bandwidth-dw(999998), bandwidth-bi(1999996), sla_map=0x1
Seq(13 Placeholder_MPLS): state(dead), packet-loss(100.000%), sla_map=0x0`,
    options: [
      'This is expected: a placeholder never connects to the hub, so its health check is dead until a placeholder shortcut (Placeholder_MPLS_0) is built, which then gets its own health check',
      'The MPLS circuit is down and must be repaired before ADVPN 2.0 can work',
      'The placeholder must be removed from the health check, or the rule will never use the shortcut',
      'The hub must be connected to the MPLS for the placeholder to come up',
    ],
    answer: [0],
    explanation: 'In Fortinet\'s overlay placeholder example, the placeholder shows `state(dead)` before traffic, because no connection to the hub is ever established. When the first packets trigger the shortcut exchange through the real overlay, the SHORTCUT_REPLY carries the remote spoke\'s eligible links, and the spoke builds a placeholder shortcut, which is then health-checked (`Seq(13 Placeholder_MPLS_0): state(alive)`).\n\n- Nothing shows the MPLS is down.\n- The placeholder should stay in the health check and rule.\n- The point of placeholders is transports the hub is *not* connected to.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-075',
    topic: '5.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which phase 1 option, described in the CLI Reference as enabling "placeholder restriction to only accept shortcut connections on this dial-up gateway", creates an ADVPN 2.0 overlay placeholder? (Enter the option name.)',
    answer: ['auto-discovery-dialup-placeholder', 'set auto-discovery-dialup-placeholder enable', 'set auto-discovery-dialup-placeholder'],
    explanation: '`set auto-discovery-dialup-placeholder enable` (default disable) on a `type dynamic`, `net-device enable` phase 1 makes it a placeholder overlay for shortcuts over transports the hub isn\'t connected to.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-076',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Both spokes run IKEv2 overlays with idle-timeout and shared-idle-timeout enabled. Shortcuts between FGT-Spoke1 and FGT-Spoke2 do not tear down together when idle. What is the most likely cause?',
    exhibit: String.raw`FGT-Spoke1 # get system settings | grep location-id
location-id         : 172.16.0.1

FGT-Spoke2 # get system settings | grep location-id
location-id         : 0.0.0.0`,
    options: [
      'Shared idle timeout requires location-id to be configured on both spokes, and FGT-Spoke2 still has the default 0.0.0.0',
      'Shared idle timeout requires IKEv1',
      'idle-timeoutinterval must be set to 0 for shared idle timeout',
      'Shared idle timeout works only with overlay placeholders',
    ],
    answer: [0],
    explanation: 'The CLI Reference for `shared-idle-timeout`: "The location-id attribute must be configured on both spokes. Shared idle timeout is supported only on IKEv2 since remote-location is available only for IKEv2." FGT-Spoke2 has no location ID, so its shortcuts can\'t be grouped per remote spoke.\n\n- It is IKEv2 only, not IKEv1.\n- The interval range is 5–43200 minutes, and 0 isn\'t valid.\n- Shared idle timeout applies to ADVPN overlays in general, not only to placeholders.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-077',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'In the FortiManager 7.6 SD-WAN overlay template, the architect selects ADVPN 2.0 in Region Settings. Which additional field then appears for each branch WAN underlay?',
    options: [
      'Transport Group (default 0, or 1 when Private Link is selected)',
      'Network ID (default 1 for each underlay)',
      'Shortcut Priority (enable, disable or auto)',
      'Auto-Discovery Forwarder (enable or disable)',
    ],
    answer: [0],
    explanation: 'FortiManager\'s overlay template shows a **Transport Group** field per branch WAN underlay only when ADVPN 2.0 is selected. Its default is 0, or 1 when Private Link is selected. It maps to the SD-WAN member `transport-group` on the branches.\n\n- Network IDs, shortcut priority and the forwarder are not per-underlay fields in the wizard.',
    lesson: '5.3-advpn2-fortimanager',
  },
  {
    id: 'd5-078',
    topic: '5.3',
    type: 'order',
    difficulty: 2,
    stem: 'Put these FortiManager steps in order to deploy a new ADVPN 2.0 overlay to existing hubs and branches.',
    items: [
      'Add the hub and branch FortiGates to FortiManager and put the branches in a device group',
      'Run the SD-WAN overlay template wizard (topology, BGP on loopback, ADVPN 2.0, transport groups)',
      'Build the SD-WAN rules in an SD-WAN template that uses the generated overlays and health checks',
      'Create the hub and branch policy packages, including the hub spoke-to-spoke policy',
      'Install the device settings and policy packages to the FortiGates',
    ],
    explanation: 'The overlay template requires the hub and branches to be in FortiManager already, with the branches in a device group. The wizard generates IPsec, BGP and CLI templates, template groups and the `branch_id` metadata variable, and it can add the overlay members, zones and hub health checks to an SD-WAN template, but it doesn\'t create SD-WAN rules. FortiManager\'s documented workflow then has you configure the SD-WAN rules in an SD-WAN template, create the hub and branch policy packages (the hub needs the spoke-to-spoke policy for ADVPN) and install with the Install Wizard.',
    lesson: '5.3-advpn2-fortimanager',
  },
];
