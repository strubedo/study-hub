// Domain 1 — PAN-OS Networking Configuration. Original questions for PAN-OS 11.2 / 12.1.
let n = 0;
const q = (topic, lesson, type, difficulty, stem, rest) => ({ id: `d1-${String(++n).padStart(3, '0')}`, topic, type, difficulty, stem, ...rest, lesson });

export default [
  // ---------------- 1.1 interfaces ----------------
  q('1.1', '1.1-interfaces', 'single', 1, 'An engineer must insert a PA firewall between a router and a switch without changing any IP addressing or routing. Which interface type should be used?', {
    options: ['Virtual wire', 'Layer 3', 'Tap', 'Tunnel'], answer: [0],
    explanation: 'A **virtual wire** binds two ports with no MAC or IP, so neighbours are unaware of the firewall, and it still supports App-ID, Content-ID and NAT.\n\n* **Layer 3** requires addresses and routing changes.\n* **Tap** is a passive copy and cannot block traffic.\n* **Tunnel** interfaces are logical VPN interfaces, not physical ports.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'Refer to the exhibit. Users on 10.0.1.0/24 can reach the internet, but a ping to 10.0.1.1 from a user PC gets no reply. A security rule permitting ping from trust to trust already exists. What is the most likely cause?', {
    exhibit: `PA-HQ# show network interface ethernet ethernet1/2
ethernet1/2 {
  layer3 {
    ip {
      10.0.1.1/24;
    }
  }
}
PA-HQ# show zone trust
trust { network { layer3 ethernet1/2; } }`,
    options: ['No interface management profile allowing ping is attached to ethernet1/2', 'The zone trust is a virtual wire zone', 'Ethernet1/2 is missing a subinterface', 'The interface needs a tunnel monitor profile'], answer: [0],
    explanation: 'Traffic **to** a firewall interface address is governed by the **Interface Management Profile**; without one allowing ping the firewall does not answer. Transit traffic is unaffected, which is why internet access works.\n\n* The zone is a layer3 zone per the exhibit.\n* Subinterfaces are only needed for 802.1Q tags.\n* Tunnel monitor profiles apply to IPSec tunnels.' }),
  q('1.1', '1.1-interfaces', 'multi', 2, 'Which two statements about virtual wire interfaces are correct? (Choose two.)', {
    options: ['They support NAT', 'They can be assigned an IP address', 'Virtual wire subinterfaces can classify traffic by VLAN tag', 'They participate in OSPF', 'They require a virtual router'], answer: [0, 2],
    explanation: 'Vwire supports NAT and subinterfaces classified by VLAN tag (and optionally IP classifier).\n\n* No IP address, so no routing protocols and no virtual router are used.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'A Layer 2 interface pair is in VLAN object `v100`. Hosts in the VLAN need to reach a router beyond the firewall that is routed by the firewall itself. What is required?', {
    options: ['A VLAN interface (Layer 3) attached to the VLAN and a router', 'A virtual wire between the two ports', 'An aggregate group with LACP', 'A tap interface'], answer: [0],
    explanation: 'A VLAN does not route by itself. A **VLAN interface** with an IP address, bound to the VLAN object and a virtual router, provides the gateway.\n\n* Vwire, AE and tap do not provide a routed gateway for a VLAN.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'Refer to the exhibit. The ae1 bundle never comes up and the switch shows the port-channel in LACP passive mode. What is the cause?', {
    exhibit: `PA-HQ# show network interface aggregate-ethernet ae1
ae1 { layer3 { ip { 10.0.2.1/24; } lacp { enable yes; mode passive; transmission-rate fast; } } }`,
    options: ['Both ends are LACP passive, so neither sends LACPDUs', 'The transmission rate must be slow', 'AE interfaces cannot use Layer 3', 'The members must be in different zones'], answer: [0],
    explanation: 'LACP needs at least one **active** end. Two passive ends wait for each other.\n\n* Fast/slow is only the LACPDU timing.\n* AE can be Layer 3.\n* Members are assigned to the AE group, not to zones.' }),
  q('1.1', '1.1-interfaces', 'fill', 1, 'What is the default management interface IP address on a PA hardware firewall? (IP/mask)', {
    answer: ['192.168.1.1/24', '192.168.1.1'], explanation: 'The dedicated MGT interface defaults to 192.168.1.1/24 on hardware appliances.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'Refer to the exhibit. Software updates fail although data-plane routing is healthy. What should the engineer change to send updates out ethernet1/1 instead?', {
    exhibit: `PA-HQ> show interface management
ip address: 192.168.1.1   netmask: 255.255.255.0   default gateway: (none)
PA-HQ> show routing route | match 0.0.0.0/0
0.0.0.0/0  203.0.113.1  ethernet1/1  flags: A S`,
    options: ['Device > Setup > Services > Service Route Configuration', 'Network > Virtual Routers > Static Routes', 'Network > Network Profiles > Interface Mgmt', 'Network > Zones'], answer: [0],
    explanation: 'Management-plane services use MGT by default; a **service route** redirects individual services to a data-plane interface.\n\n* Static routes affect transit traffic.\n* Interface Mgmt profiles control services answered on an interface.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'Which statement about tunnel interfaces is correct?', {
    options: ['They must be assigned to a zone and router to pass traffic', 'They require a physical port', 'They need an IP address in every design', 'They can only be used for GlobalProtect'], answer: [0],
    explanation: 'A tunnel interface is a logical L3 interface, so it needs a **zone** and **router**. An IP is optional for static-routed VPNs (needed or unnumbered for dynamic routing). It serves IPSec tunnels, GRE and GlobalProtect gateways.' }),
  q('1.1', '1.1-interfaces', 'multi', 3, 'Which two requirements apply to members of an aggregate Ethernet group? (Choose two.)', {
    options: ['Members must have matching speed and duplex', 'Members are assigned to the group on each member interface', 'Each member needs its own IP address', 'LACP is mandatory', 'Members must be in different zones'], answer: [0, 1],
    explanation: 'Members share speed/duplex/media and are bound with the **Aggregate Group** setting on the Ethernet interface.\n\n* The IP is on the ae interface.\n* LACP is optional (static bundle possible).\n* Zones are assigned to the ae interface.' }),
  q('1.1', '1.1-interfaces', 'order', 2, 'Order the objects an engineer normally creates to give a new Layer 3 port internet access.', {
    items: ['Configure the interface as Layer 3 with an IP address', 'Assign the interface to a zone', 'Assign the interface to a router', 'Add a default route', 'Write a security policy rule'],
    explanation: 'Interface, zone, router, route, policy. Without any of these the traffic is dropped or unrouted.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'What does the Link State Pass Through option on a virtual wire do?', {
    options: ['Brings down the other port when one port loses link', 'Passes LLDP frames', 'Enables LACP on the wire', 'Duplicates packets to a tap'], answer: [0],
    explanation: 'Link state pass through propagates a link-down on one port to its partner so neighbours detect the failure. It does not affect LACP, LLDP or tap behaviour.' }),
  q('1.1', '1.1-interfaces', 'match', 2, 'Match each interface type to its role.', {
    pairs: [['Tap', 'Passive monitoring from a SPAN port'], ['Virtual wire', 'Transparent two-port inspection'], ['Layer 3', 'Routed with an IP address'], ['Tunnel', 'Logical interface for an IPSec tunnel'], ['Layer 2', 'Switching within a VLAN object']],
    explanation: 'Each type has a distinct role; know them as the basis for zone type and HA mode decisions.' }),
  q('1.1', '1.1-interfaces', 'single', 3, 'Refer to the exhibit. An administrator attached the profile below to ethernet1/1, the untrust interface. What is the risk?', {
    exhibit: `PA-HQ# show network profiles interface-management-profile allow-all
allow-all { ping yes; ssh yes; https yes; snmp yes; response-pages yes; }`,
    options: ['The firewall administration services are reachable from the internet', 'Transit traffic is dropped', 'The interface cannot get an IP', 'HA preemption is disabled'], answer: [0],
    explanation: 'The profile opens SSH/HTTPS/SNMP on the interface IP. Apply minimal profiles on untrust interfaces, restrict with permitted IPs, and keep admin on MGT.\n\n* The profile does not affect transit traffic.' }),
  q('1.1', '1.1-interfaces', 'single', 2, 'Which interface type may be used for HA3 in addition to physical Ethernet?', {
    options: ['Aggregate Ethernet', 'Loopback', 'Tunnel', 'VLAN'], answer: [0],
    explanation: 'HA3 supports aggregate Ethernet groups for bandwidth and redundancy. Loopback, tunnel and VLAN interfaces are logical L3 interfaces and cannot carry the HA link.' }),

  // ---------------- 1.2 zones ----------------
  q('1.2', '1.2-zones', 'single', 1, 'What is the default action for traffic between two different zones with no matching security rule?', {
    options: ['Deny', 'Allow', 'Allow but log', 'Reset'], answer: [0], explanation: 'The `interzone-default` rule denies. Intrazone traffic is allowed by `intrazone-default`.' }),
  q('1.2', '1.2-zones', 'single', 1, 'Refer to the exhibit. A host in the trust zone connects to another host in the same trust zone through the firewall. What happens?', {
    exhibit: `Security policy (top to bottom)
1. Trust-to-Untrust   from trust  to untrust  allow
2. Untrust-to-DMZ-Web from untrust to dmz       allow
intrazone-default (predefined)   action: allow
interzone-default (predefined)   action: deny`,
    options: ['Allowed by the default intrazone rule', 'Denied by the default interzone rule', 'Dropped because no rule matches', 'Allowed only if User-ID is enabled'], answer: [0], explanation: 'The predefined intrazone rule allows it. The interzone default applies only between different zones.' }),
  q('1.2', '1.2-zones', 'single', 2, 'Where is a Zone Protection profile attached?', {
    options: ['To a zone, applying to traffic entering the zone', 'To a security rule', 'To an interface management profile', 'To a virtual router'], answer: [0], explanation: 'Zone protection profiles are assigned in the zone and apply to ingress traffic, before security policy.' }),
  q('1.2', '1.2-zones', 'multi', 2, 'Which two sections exist in a Zone Protection profile? (Choose two.)', {
    options: ['Reconnaissance Protection', 'Flood Protection', 'URL Filtering', 'Anti-Spyware', 'Decryption'], answer: [0, 1],
    explanation: 'Zone protection has flood, reconnaissance, packet-based attack, protocol and Ethernet SGT sections.\n\n* URL filtering and anti-spyware are Security profiles; decryption is its own policy.' }),
  q('1.2', '1.2-zones', 'single', 2, 'Which SYN flood action makes the firewall answer the SYN itself and complete the handshake before involving the server?', {
    options: ['SYN Cookies', 'Random Early Drop', 'Block IP', 'Alarm'], answer: [0], explanation: 'SYN cookies validate the client; Random Early Drop merely drops a growing share of SYNs above the activate rate.' }),
  q('1.2', '1.2-zones', 'single', 2, 'Refer to the exhibit. Which statement about the flood settings is correct?', {
    exhibit: `Zone Protection Profile: ZP-untrust
Flood Protection > SYN
  Action: Random Early Drop
  Alarm Rate:  10000 packets/sec
  Activate:    20000 packets/sec
  Maximum:     40000 packets/sec`,
    options: ['Random early dropping starts at 20,000 SYN packets per second and all new SYNs drop at 40,000', 'SYN cookies start at 10,000 packets per second', 'Dropping begins at the alarm rate', 'The thresholds are per source IP'], answer: [0],
    explanation: 'Alarm only generates logs; **Activate** begins RED; **Maximum** drops all SYNs above it. Zone protection thresholds apply to the zone aggregate, not per source (that is DoS Protection).' }),
  q('1.2', '1.2-zones', 'single', 2, 'A DoS Protection policy and a Zone Protection profile are both available. Which statement is correct?', {
    options: ['DoS Protection policy can classify and limit by individual source or destination IP', 'Zone Protection profile tracks per-source connection counts', 'They are the same feature', 'DoS Protection applies only to tap zones'], answer: [0], explanation: 'DoS policy/classified profiles protect specific hosts (per-IP limits). Zone protection is aggregate per zone.' }),
  q('1.2', '1.2-zones', 'single', 2, 'Which zone type can contain Layer 3, loopback, VLAN and tunnel interfaces?', {
    options: ['Layer 3', 'Layer 2', 'Virtual Wire', 'Tap'], answer: [0], explanation: 'The Layer 3 zone accepts those L3 interface types. Other zone types accept only their own interface type.' }),
  q('1.2', '1.2-zones', 'fill', 2, 'What zone setting must be enabled on the zone where users originate traffic so that User-ID mapping applies? (three words)', {
    answer: ['enable user identification', 'user identification'], explanation: '**Enable User Identification** on the zone enables User-ID for traffic entering that zone.' }),
  q('1.2', '1.2-zones', 'single', 3, 'Why should an engineer avoid placing every VLAN in its own zone by default?', {
    options: ['More zones increase rule complexity without improving enforcement unless trust levels differ', 'The firewall supports only four zones', 'Zones must match VLAN IDs', 'Interfaces cannot be moved between zones'], answer: [0], explanation: 'Zones define policy boundaries. Group interfaces of the same trust level; there is no four-zone limit and zones need not match VLAN IDs.' }),

  // ---------------- 1.3 HA ----------------
  q('1.3', '1.3-ha-concepts', 'single', 1, 'Which HA link carries configuration synchronization and heartbeats?', {
    options: ['HA1', 'HA2', 'HA3', 'MGT only'], answer: [0], explanation: 'HA1 is the control link. HA2 syncs sessions, and HA3 forwards packets in active/active.' }),
  q('1.3', '1.3-ha-concepts', 'single', 2, 'In which HA mode is HA3 required?', {
    options: ['Active/active', 'Active/passive', 'Both', 'Neither'], answer: [0], explanation: 'HA3 forwards packets to the session owner for asymmetric flows, which exists only in active/active.' }),
  q('1.3', '1.3-ha-concepts', 'multi', 2, 'Which two interface deployments are supported in active/active HA? (Choose two.)', {
    options: ['Layer 3', 'Virtual wire', 'Layer 2', 'Tap'], answer: [0, 1], explanation: 'A/A supports L3 and vwire. Layer 2 and tap are active/passive-only designs.' }),
  q('1.3', '1.3-ha-concepts', 'single', 2, 'Refer to the exhibit. Which firewall becomes active after both reboot with preemption enabled on both?', {
    exhibit: `PA-A: Device Priority 90   Preemptive: yes
PA-B: Device Priority 110  Preemptive: yes`,
    options: ['PA-A', 'PA-B', 'Whichever boots first, regardless', 'Neither; split-brain'], answer: [0], explanation: 'The **lower** device priority number is preferred, and preemption lets PA-A reclaim the active role.' }),
  q('1.3', '1.3-ha-concepts', 'single', 2, 'Refer to the exhibit. PA-A fails and later recovers. What happens?', {
    exhibit: `PA-A: Device Priority 90   Preemptive: yes
PA-B: Device Priority 110  Preemptive: no
Current state: PA-B active (PA-A was suspended, now functional)`,
    options: ['PA-B stays active because preemption must be enabled on both peers', 'PA-A always reclaims active', 'Both firewalls go suspended', 'The HA pair re-elects randomly'], answer: [0], explanation: 'Preemption only takes effect when enabled on both firewalls.' }),
  q('1.3', '1.3-ha-concepts', 'single', 2, 'What does setting the passive link state to `auto` do?', {
    options: ['Keeps links up on the passive unit but not forwarding traffic', 'Shuts down passive links', 'Enables LACP', 'Disables HA2'], answer: [0], explanation: 'With `auto` the passive firewall keeps links up (blocking), which speeds failover; `shutdown` is the default.' }),
  q('1.3', '1.3-ha-concepts', 'single', 2, 'Which command shows the local HA state, peer state and sync status?', {
    options: ['show high-availability state', 'show ha status', 'show system ha', 'show interface ha1'], answer: [0], explanation: '`show high-availability state` (and `show high-availability all`) are the real commands.' }),
  q('1.3', '1.3-ha-concepts', 'single', 2, 'Refer to the exhibit. What is wrong?', {
    exhibit: `PA-A> show high-availability state
Local: State: active    Running Configuration: synchronized
Peer:  State: active    Connection status: down`,
    options: ['Both firewalls are active; HA1 is down (split-brain)', 'Normal active/active operation', 'Preemption is disabled', 'HA2 is misconfigured'], answer: [0], explanation: 'Two active units with the peer connection down indicates split-brain from HA1 loss. Use HA1 backup and heartbeat backup on a different path.' }),
  q('1.3', '1.3-ha-concepts', 'single', 3, 'In active/active, what does the session owner do?', {
    options: ['Performs Layer 7 processing for the session', 'Creates the NAT binding only', 'Holds the floating IP', 'Receives HA1 heartbeats'], answer: [0], explanation: 'The owner performs App-ID/Content-ID; the session setup firewall performs session creation and NAT. Roles can be different units.' }),
  q('1.3', '1.3-ha-concepts', 'multi', 3, 'Which two settings are not synchronized between HA peers? (Choose two.)', {
    options: ['Management interface IP address', 'HA device priority', 'Security policy', 'Address objects', 'Zones'], answer: [0, 1], explanation: 'Local items (management IP, HA settings, priority) differ per unit; policy, objects and zones are synced.' }),
  q('1.3', '1.3-ha-monitoring', 'single', 2, 'What does path monitoring in an HA path group do?', {
    options: ['Pings destination IPs and triggers failover if they become unreachable', 'Monitors physical link state only', 'Withdraws a static route', 'Synchronizes sessions'], answer: [0], explanation: 'HA path monitoring pings destinations and can cause failover. Link monitoring watches physical links; static route path monitoring (routing) withdraws routes.' }),
  q('1.3', '1.3-ha-monitoring', 'single', 2, 'Refer to the exhibit. With the settings shown, when is the path group considered failed?', {
    exhibit: `Path Group: VR-uplink  type: virtual-router
  Failure Condition: all
  Destinations: 203.0.113.1, 203.0.113.2
  Ping Interval: 200 ms   Ping Count: 10`,
    options: ['When both destinations miss ten consecutive pings', 'When either destination misses ten pings', 'After one missed ping', 'Only when HA1 fails'], answer: [0], explanation: 'Failure condition **all** requires every destination to fail.' }),
  q('1.3', '1.3-ha-monitoring', 'single', 2, 'Refer to the exhibit. The upstream switch port fails but ethernet1/1 stays up because of a media converter. Which configured feature detects this?', {
    exhibit: `HA Link and Path Monitoring
  Link Group  uplinks   ethernet1/1   condition: any
  Path Group  VR-uplink virtual-router  dest 203.0.113.1  condition: any`,
    options: ['Path monitoring', 'Link monitoring', 'HA1 heartbeat', 'HA2 keepalive'], answer: [0], explanation: 'The link stays up so link monitoring sees nothing; path monitoring tests actual reachability. HA1 heartbeats test the peer only.' }),
  q('1.3', '1.3-ha-monitoring', 'multi', 2, 'Which two events can trigger an HA failover? (Choose two.)', {
    options: ['Link monitoring group failure', 'Loss of HA1 heartbeats and hellos', 'A new security rule commit', 'Content update installation', 'A DNS server outage'], answer: [0, 1], explanation: 'Link/path failure, heartbeat loss, process failures and manual suspend trigger failover. A commit or content update by itself does not.' }),
  q('1.3', '1.3-ha-monitoring', 'single', 3, 'What is the purpose of the maximum flaps setting?', {
    options: ['Stops preemptive failovers after the limit to prevent flapping', 'Limits link flaps on the switch', 'Limits HA2 retransmits', 'Sets the number of path groups'], answer: [0], explanation: 'After the maximum number of preemptive failovers the firewall stops flapping and moves to a non-active state.' }),
  q('1.3', '1.3-ha-monitoring', 'fill', 2, 'Which command suspends the local firewall in an HA pair? (full command)', {
    answer: ['request high-availability state suspend'], explanation: '`request high-availability state suspend` takes the local unit out of the pair; `functional` returns it.' }),

  // ---------------- 1.4 routing ----------------
  q('1.4', '1.4-routing-dynamic', 'single', 1, 'What is the default administrative distance of an OSPF internal route on PAN-OS?', {
    options: ['30', '110', '120', '10'], answer: [0], explanation: 'OSPF internal is 30, OSPF external 110, RIP 120, static 10.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'Refer to the exhibit. Which route is installed for 10.9.0.0/16?', {
    exhibit: `Static   10.9.0.0/16 via 10.0.1.254  distance 10  metric 10
OSPF     10.9.0.0/16 via 10.0.2.254  distance 30  metric 20
EBGP     10.9.0.0/16 via 203.0.113.1 distance 20  metric 0`,
    options: ['The static route', 'The EBGP route', 'The OSPF route', 'All three through ECMP'], answer: [0], explanation: 'Same prefix: lowest administrative distance wins (static 10). ECMP only applies to equal-cost routes of the same source.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'Refer to the exhibit. 10.0.50.0/24 on ethernet1/5 is connected but is not in OSPF area 0. Which configuration advertises it into OSPF without enabling OSPF on ethernet1/5?', {
    exhibit: `PA-HQ> show routing protocol ospf interface
ethernet1/2  area 0.0.0.0  type broadcast  state DR
PA-HQ> show routing route | match 10.0.50
10.0.50.0/24  ethernet1/5  flags: A C`,
    options: ['A redistribution profile (connected) referenced by OSPF export rules', 'A static route to Null', 'A PBF rule', 'An ECMP profile'], answer: [0], explanation: 'Redistribution profiles define sources; the OSPF export rule references the profile. Without it, nothing is injected.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'Where is BGP routing policy (match on prefix or community, set local preference or MED) configured on the legacy engine?', {
    options: ['BGP > Import/Export rules', 'Redistribution Profiles only', 'Zone Protection', 'Interface Management profile'], answer: [0], explanation: 'Import and Export rules in BGP hold match criteria and set actions. Redistribution profiles choose sources to inject.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'What is the maximum number of equal-cost paths ECMP can use on a PAN-OS virtual router?', {
    options: ['4', '2', '8', '16'], answer: [0], explanation: 'ECMP supports up to four equal-cost paths.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 3, 'Why should ECMP changes be scheduled in a maintenance window?', {
    options: ['Changing ECMP restarts the virtual router and can reset sessions', 'ECMP reboots the firewall', 'ECMP disables HA', 'It deletes the BGP configuration'], answer: [0], explanation: 'Enabling, disabling or changing ECMP on an existing virtual router restarts that virtual router.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'Refer to the exhibit. The BGP peer never establishes. The remote peer is two hops away. What is missing?', {
    exhibit: `PA-HQ> show routing protocol bgp peer peer-name ISP1
  state: Active   remote AS: 64500
  peer-group type: EBGP   multihop: 0`,
    options: ['EBGP multihop on the peer', 'A redistribution profile', 'OSPF', 'ECMP'], answer: [0], explanation: 'Non-directly connected EBGP peers need multihop (TTL > 1). Redistribution affects advertisement, not session setup.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'Which BFD default is correct for a default BFD profile on PAN-OS?', {
    options: ['Detection time multiplier 3', 'Hold time 60 seconds', 'Passive mode only', 'Required minimum Rx 5000 ms'], answer: [0], explanation: 'Defaults: active mode, Tx/Rx 1000 ms, multiplier 3, hold time 0.' }),
  q('1.4', '1.4-routing-dynamic', 'single', 2, 'Which OSPF setting lets the firewall advertise an interface subnet without forming adjacencies on it?', {
    options: ['Passive', 'Stub area', 'Graceful restart', 'MD5 authentication'], answer: [0], explanation: 'A passive OSPF interface advertises the subnet and sends no hellos.' }),
  q('1.4', '1.4-routing-monitoring-are', 'single', 2, 'Which defaults apply to static route path monitoring?', {
    options: ['3 s ping interval, 5 ping count, any, 2 min preemptive hold time', '1 s interval, 3 count, all, 0 hold', '5 s interval, 10 count, any, 5 min hold', '200 ms interval, 10 count, all, 1 min hold'], answer: [0], explanation: 'These are the documented static route path monitoring defaults. 200 ms/10 are HA path monitoring.' }),
  q('1.4', '1.4-routing-monitoring-are', 'single', 2, 'Refer to the exhibit. ISP1 stops responding but the interface stays up. What happens to the default route?', {
    exhibit: `Static 0.0.0.0/0 ISP1  via 203.0.113.1  ethernet1/1 metric 10  Path monitoring: ON (dest 192.0.2.53, any)
Static 0.0.0.0/0 ISP2  via 198.51.100.1 ethernet1/3 metric 20  Path monitoring: OFF`,
    options: ['ISP1 route is removed and ISP2 route becomes active', 'Both routes remain', 'ISP2 route is removed', 'The firewall fails over to the HA peer'], answer: [0], explanation: 'Failed path monitoring removes ISP1 from the RIB and the metric 20 route is installed. HA failover is a separate feature.' }),
  q('1.4', '1.4-routing-monitoring-are', 'single', 2, 'Which failure condition is the default for static route path monitoring?', {
    options: ['Any', 'All', 'Majority', 'None'], answer: [0], explanation: 'Default is Any; All requires all monitored destinations to be unreachable.' }),
  q('1.4', '1.4-routing-monitoring-are', 'single', 2, 'What does enabling Advanced Routing require?', {
    options: ['A commit and a reboot', 'A commit only', 'A content update', 'A new license'], answer: [0], explanation: 'Switching engines in either direction requires commit and reboot. It is enabled in Device > Setup > Management > General Settings.' }),
  q('1.4', '1.4-routing-monitoring-are', 'single', 2, 'Which CLI command shows the routing table on a firewall running the Advanced Routing Engine?', {
    options: ['show advanced-routing route', 'show routing route', 'show route table', 'show ip route'], answer: [0], explanation: 'ARE uses `show advanced-routing ...`; the legacy command does not show the ARE tables.' }),
  q('1.4', '1.4-routing-monitoring-are', 'multi', 2, 'Which two features are specific to the Advanced Routing Engine? (Choose two.)', {
    options: ['Logical routers', 'Route maps and prefix lists', 'Virtual routers', 'Redistribution profiles on VR only'], answer: [0, 1], explanation: 'ARE uses logical routers and route maps/prefix lists. Virtual routers are the legacy construct.' }),
  q('1.4', '1.4-routing-monitoring-are', 'match', 2, 'Match each item to its routing engine.', {
    pairs: [['Virtual router', 'Legacy engine'], ['Logical router', 'Advanced Routing Engine'], ['show routing route', 'Legacy engine CLI'], ['show advanced-routing route', 'Advanced Routing Engine CLI']],
    explanation: 'The two engines use different objects and CLI.' }),
  q('1.4', '1.4-routing-monitoring-are', 'single', 3, 'Which protocols does the documentation list for the Advanced Routing Engine?', {
    options: ['Static, BGP/MP-BGP, OSPFv2/v3, RIPv2, IPv4 multicast, BFD', 'Only static and BGP', 'EIGRP, OSPF, BGP', 'IS-IS and OSPF only'], answer: [0], explanation: 'This is the documented list; EIGRP is not supported on PAN-OS.' }),

  // ---------------- 1.5 GlobalProtect ----------------
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 1, 'Which GlobalProtect component delivers the agent configuration to the app?', {
    options: ['Portal', 'Gateway', 'Satellite', 'Panorama'], answer: [0], explanation: 'The portal authenticates and sends the agent config; the gateway terminates the tunnel.' }),
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 2, 'Which tunnel type does the GlobalProtect app prefer?', {
    options: ['IPSec, falling back to SSL', 'SSL only', 'GRE', 'L2TP'], answer: [0], explanation: 'IPSec is preferred, with SSL/TLS over TCP 443 as the fallback.' }),
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 2, 'Refer to the exhibit. A user in both groups connects. Which agent config applies?', {
    exhibit: `Portal Agent Configs (top to bottom)
1. Everyone       Any OS    External gateway GW-West
2. Engineering    Any OS    External gateway GW-East`,
    options: ['Everyone', 'Engineering', 'Both, merged', 'The one with the lowest-latency gateway'], answer: [0], explanation: 'Agent configs are evaluated top-down and the first match wins. Reorder with specific configs first.' }),
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 2, 'Which connect method connects before the user signs in using a machine certificate?', {
    options: ['Pre-logon (Always On)', 'User-logon (Always On)', 'On-demand', 'Internal host detection'], answer: [0], explanation: 'Pre-logon connects at boot with a machine certificate; the user is unknown until sign-in.' }),
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 2, 'An internal gateway is configured. What is it used for?', {
    options: ['User-ID mapping and HIP without a VPN tunnel', 'Terminating the SSL tunnel', 'Distributing agent configurations', 'Hosting clientless VPN only'], answer: [0], explanation: 'Internal gateways do not need tunnel mode; they provide IP-to-user mapping and HIP checks on the LAN.' }),
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 3, 'Which zone settings does the GlobalProtect gateway tunnel interface zone normally need?', {
    options: ['A dedicated zone with User-ID enabled', 'A tap zone', 'The untrust zone', 'A zone with zone protection only'], answer: [0], explanation: 'Use a dedicated VPN zone with User-ID so user/group-based policy works.' }),
  q('1.5', '1.5-globalprotect-portal-gateway', 'single', 2, 'Refer to the exhibit. Both gateways have the same priority. How does the app choose?', {
    exhibit: `Agent Config Corp-Users > External Gateways
  GW-East  gw-east.example.com  Priority: Highest   (SSL ping 85 ms)
  GW-West  gw-west.example.com  Priority: Highest   (SSL ping 31 ms)`,
    options: ['Fastest response time', 'Alphabetical order', 'Random selection', 'Lowest IP'], answer: [0], explanation: 'Priority first; ties are broken by response time. Manual-only gateways are for user selection.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'single', 2, 'In a portal client authentication entry, what does "Allow Authentication with User Credentials OR Client Certificate" set to No require?', {
    options: ['Both credentials and a client certificate', 'Only a certificate', 'Only credentials', 'SAML'], answer: [0], explanation: 'No means both are required (two-factor); Yes allows either.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'single', 2, 'What does authentication override cookie reduce?', {
    options: ['Repeated credential prompts when reconnecting', 'Tunnel overhead', 'HIP report size', 'Gateway CPU use'], answer: [0], explanation: 'A cookie lets the user reconnect without re-authenticating for its lifetime.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'single', 2, 'Which requirement applies to pre-logon?', {
    options: ['A machine certificate on the endpoint', 'A SAML IdP', 'Split tunneling', 'Clientless VPN'], answer: [0], explanation: 'Before the user signs in the only available credential is the machine certificate.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'single', 2, 'Refer to the exhibit. Where does traffic from a connected client to 8.8.8.8 go?', {
    exhibit: `Gateway GP-GW1 > Agent > Client Settings > Corp-Users > Split Tunnel
  Include Access Routes:  10.0.0.0/8
  Exclude Access Routes:  (none)`,
    options: ['Directly out the endpoint\'s local interface', 'Through the tunnel', 'Dropped', 'To the portal'], answer: [0], explanation: 'Include routes define the only traffic that enters the tunnel. Everything else is local and uninspected.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'single', 3, 'Refer to the exhibit. Which traffic enters the tunnel?', {
    exhibit: `Split Tunnel > Exclude Access Routes:  203.0.113.0/24
Split Tunnel > Include Access Routes:  (none)`,
    options: ['Everything except 203.0.113.0/24', 'Only 203.0.113.0/24', 'Nothing', 'Only internal subnets'], answer: [0], explanation: 'Exclude routes send everything through the tunnel except the listed destinations.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'multi', 3, 'Which two statements about domain and application split tunneling are correct? (Choose two.)', {
    options: ['Domain-based include entries do not cover ICMP', 'Excluded domains and applications are sent through the endpoint\'s physical adapter, not the tunnel', 'The firewall inspects excluded traffic', 'They are configured on the portal only', 'They require IPSec tunnels only'], answer: [0, 1], explanation: 'The gateway client settings state that ICMP is not included for domain-based entries and that excluded domains and application processes leave through the physical adapter rather than the tunnel, so the firewall never sees that traffic. The split tunnel settings are on the gateway (Agent > Client Settings), not the portal, and they are not limited to IPSec.' }),
  q('1.5', '1.5-globalprotect-auth-split', 'single', 2, 'What is the security trade-off of split tunneling?', {
    options: ['Split-tunnel traffic bypasses firewall inspection', 'The tunnel disconnects more often', 'Authentication is skipped', 'HIP checks are disabled'], answer: [0], explanation: 'Traffic outside the tunnel is not inspected by the NGFW.' }),

  // ---------------- 1.6 tunnels ----------------
  q('1.6', '1.6-ipsec-tunnels', 'single', 1, 'Which IKE phase does the IPSec Crypto profile define?', {
    options: ['Phase 2', 'Phase 1', 'Both', 'Neither'], answer: [0], explanation: 'IKE Crypto = phase 1 (IKE SA); IPSec Crypto = phase 2 (IPSec SA).' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 2, 'Refer to the exhibit. Phase 1 is established but the tunnel is down. What is the likely issue?', {
    exhibit: `PA-HQ> show vpn ike-sa gateway GW-Branch1
Phase1 SA: established   IKEv2
PA-HQ> show vpn ipsec-sa tunnel Tun-Branch1
No IPSec SA. Phase 2 negotiation fails: no matching proposal in the IPSec crypto profiles`,
    options: ['IPSec crypto (phase 2) proposals do not match', 'A wrong pre-shared key', 'NAT-T is disabled', 'Missing tunnel zone'], answer: [0], explanation: 'Phase 1 is up, so authentication works. The phase 2 proposal mismatch is the failure. Wrong PSK would fail phase 1.' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 2, 'Which UDP port is used for IPSec NAT traversal?', {
    options: ['4500', '500', '4501', '1701'], answer: [0], explanation: 'IKE is UDP 500; NAT-T is UDP 4500. GlobalProtect IPSec uses UDP 4501.' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 2, 'When are proxy IDs most commonly required?', {
    options: ['The peer is a policy-based VPN device', 'Always for IKEv2', 'Only for GRE', 'Never'], answer: [0], explanation: 'Policy-based peers (crypto ACL selectors) require matching proxy IDs.' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 2, 'Refer to the exhibit. What does the configured action do when the monitored peer stops answering?', {
    exhibit: `IPSec Tunnel Tun-Branch1 > Tunnel Monitor
  Destination IP: 169.254.1.2
  Profile: tm-failover   Action: fail-over   Interval: 3   Threshold: 5`,
    options: ['Withdraws the tunnel\'s routes so a backup path is used', 'Restarts HA', 'Deletes the tunnel', 'Switches to GRE'], answer: [0], explanation: 'Fail-over removes the routes through the tunnel interface; wait-recover keeps the tunnel and keeps trying.' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 2, 'Which command forces an IKE phase 1 negotiation for testing?', {
    options: ['test vpn ike-sa gateway GW-Branch1', 'debug vpn start', 'request vpn up', 'clear vpn flow'], answer: [0], explanation: '`test vpn ike-sa gateway <name>` initiates phase 1; `test vpn ipsec-sa tunnel <name>` initiates phase 2.' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 3, 'Refer to the exhibit. The tunnel is up but pings from 10.0.1.10 to 10.20.0.5 fail. Which check is the best first step?', {
    exhibit: `PA-HQ> show vpn ike-sa gateway GW-Branch1   -> Phase1 SA established
PA-HQ> show vpn ipsec-sa tunnel Tun-Branch1 -> Phase2 SA established
PA-HQ> show routing route | match 10.20
(no output)
PA-HQ> show routing route | match 0.0.0.0/0
0.0.0.0/0  203.0.113.1  ethernet1/1  flags: A S`,
    options: ['Route to the remote subnet via tunnel.N and the policy between zones', 'Change the IKE lifetime', 'Replace the PSK', 'Disable NAT-T'], answer: [0], explanation: 'Both phases up isolates the problem to routing, policy or NAT.' }),
  q('1.6', '1.6-ipsec-tunnels', 'single', 2, 'Which IKE gateway mode makes the firewall only respond and never initiate?', {
    options: ['Passive mode', 'Aggressive mode', 'Dynamic mode', 'NAT-T'], answer: [0], explanation: 'Passive mode is responder-only.' }),
  q('1.6', '1.6-ipsec-tunnels', 'multi', 2, 'Which two objects must be created before an IPSec tunnel can reference them? (Choose two.)', {
    options: ['IKE Gateway', 'IPSec Crypto profile', 'GlobalProtect portal', 'Zone Protection profile', 'Decryption profile'], answer: [0, 1], explanation: 'The IPSec tunnel references an IKE gateway and an IPSec crypto profile (and a tunnel interface).' }),
  q('1.6', '1.6-quantum-gre', 'single', 1, 'Which IKE version is required for quantum-resistant IPSec features?', {
    options: ['IKEv2', 'IKEv1', 'Either', 'Neither'], answer: [0], explanation: 'The docs state the VPN must negotiate IKEv2 to use PQ features.' }),
  q('1.6', '1.6-quantum-gre', 'single', 2, 'From which PAN-OS version is RFC 8784 PPK supported?', {
    options: ['11.1', '10.2', '11.2 only', '12.1 only'], answer: [0], explanation: 'PAN-OS 11.1 or later; RFC 9242/9370 hybrid keys require 11.2 or later.' }),
  q('1.6', '1.6-quantum-gre', 'single', 2, 'Refer to the exhibit. The peer does not support RFC 8784. What happens?', {
    exhibit: `IKE Gateway GW-Branch1 > Advanced Options > IKEv2 > PQ PPK
  Enable Post-Quantum Pre-Shared Key (PPK): yes
  Negotiation Mode: Preferred`,
    options: ['The connection falls back to classical key exchange', 'The connection is aborted', 'The firewall switches to IKEv1', 'A GRE tunnel is created'], answer: [0], explanation: 'Preferred mode falls back; Mandatory aborts. IKEv1 has no PQ features.' }),
  q('1.6', '1.6-quantum-gre', 'single', 2, 'Refer to the exhibit. What is the maximum number of PQ PPKs that can be added and activated on a gateway such as this one?', {
    exhibit: `IKE Gateway GW-Branch1 > Advanced Options > IKEv2 > PQ PPK
  KeyID        Active
  PPK-1        yes
  PPK-2        yes
  (Add button)`,
    options: ['Up to 10', 'Only 1', 'Up to 7', 'Up to 31'], answer: [0], explanation: 'Up to 10 unique PPKs; the KeyID is up to 31 characters. Seven is the maximum additional key exchange rounds.' }),
  q('1.6', '1.6-quantum-gre', 'single', 2, 'What is transmitted over the wire in RFC 8784 PPK negotiation?', {
    options: ['Only the PPK KeyID', 'The PPK secret encrypted with DH', 'The PPK secret in clear', 'A hash of all PPKs'], answer: [0], explanation: 'Only the KeyID is sent; the secret is shared out of band.' }),
  q('1.6', '1.6-quantum-gre', 'single', 3, 'How many additional key exchange rounds does RFC 9370 allow beyond the default exchange?', {
    options: ['7', '3', '10', '1'], answer: [0], explanation: 'Up to seven additional rounds, for eight total.' }),
  q('1.6', '1.6-quantum-gre', 'multi', 3, 'Which two recommendations does the documentation give for hybrid-key IKEv2 VPNs? (Choose two.)', {
    options: ['Enable IKEv2 fragmentation', 'Configure the same PQCs and strengths on both peers', 'Use IKEv1 preferred mode', 'Use only one KEM round', 'Disable liveness checks'], answer: [0, 1], explanation: 'PQC keys enlarge packets, so use fragmentation, and matching configuration avoids interoperability issues.' }),
  q('1.6', '1.6-quantum-gre', 'single', 2, 'Which IP protocol number does GRE use?', {
    options: ['47', '50', '51', '99'], answer: [0], explanation: 'GRE is protocol 47. ESP is 50, AH 51.' }),
  q('1.6', '1.6-quantum-gre', 'single', 2, 'Which statement about a GRE tunnel is correct?', {
    options: ['It provides encapsulation without encryption', 'It encrypts with AES by default', 'It cannot carry routing protocols', 'It requires an IKE gateway'], answer: [0], explanation: 'GRE is not encrypted; combine with IPSec for confidentiality.' }),
  q('1.6', '1.6-quantum-gre', 'single', 3, 'Which feature inspects the inner payload of GRE traffic that merely transits the firewall?', {
    options: ['Tunnel Content Inspection', 'GRE tunnel interface', 'Zone Protection', 'GlobalProtect'], answer: [0], explanation: 'Tunnel inspection policy decapsulates transit GRE; a configured GRE tunnel interface terminates a tunnel.' }),
  q('1.6', '1.6-quantum-gre', 'order', 3, 'Order the steps to configure hybrid-key PQ VPN.', {
    items: ['Create an IKEv2 gateway with the PQ KEM option enabled', 'Create an IKE Crypto profile with additional key exchange rounds', 'Create an IPSec Crypto profile with additional key exchange rounds', 'Reference the profiles in the IPSec tunnel and commit'],
    explanation: 'The gateway, IKE crypto and IPSec crypto profile all carry the setting, then the tunnel ties them together.' }),
];
