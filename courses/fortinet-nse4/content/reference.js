// Cheat-sheet tables for the Reference page. Cells are inline markdown.
// FortiOS 8.0 unless a cell says otherwise.
export default [
  {
    id: 'debug-flow', title: 'Debug flow: the standard capture', topic: '1.4',
    columns: ['Step', 'Command'],
    rows: [
      ['Clear old filters and settings', '`diagnose debug flow filter clear` · `diagnose debug reset`'],
      ['Filter on the host or flow', '`diagnose debug flow filter addr 10.0.1.10` (also `saddr`, `daddr`, `port`, `proto`)'],
      ['Show the function trace (optional)', '`diagnose debug flow show function-name enable`'],
      ['Timestamps in the console', '`diagnose debug console timestamp enable`'],
      ['Number of packets to trace', '`diagnose debug flow trace start 10`'],
      ['Start output', '`diagnose debug enable`'],
      ['Stop when done', '`diagnose debug disable` · `diagnose debug flow trace stop`'],
    ],
    note: 'Debug flow traces matching packets that the CPU handles until the trace count runs out, but the **route and policy decision appear only for the first packet of a new session**; later packets just show "Find an existing session". To see the policy decision for a flow that is already up, clear its session (`diagnose sys session filter …` then `diagnose sys session clear`) and retrace. Packets offloaded to NP/SoC hardware are not traced at all. Typical lines: "allocate a new session", "find a route", "Allowed by Policy-10", "Denied by forward policy check (policy 0)", "SNAT … ->", "DNAT … ->".',
  },
  {
    id: 'sniffer', title: 'Packet sniffer verbosity', topic: '1.4',
    columns: ['Level', 'Output'],
    rows: [
      ['1', 'Packet headers only'], ['2', 'Headers + IP payload'], ['3', 'Headers + Ethernet payload'],
      ['4', 'Headers + interface name'], ['5', 'Headers + IP payload + interface name'], ['6', 'Headers + Ethernet payload + interface name'],
    ],
    note: 'Syntax: `diagnose sniffer packet <interface|any> \'<BPF filter>\' <verbosity> <count> <timestamp>` — e.g. `diagnose sniffer packet any \'host 10.0.1.10 and icmp\' 4 10 l` (`l` = local time). Level 6 output can be converted to a pcap for Wireshark.',
  },
  {
    id: 'ha-election', title: 'FGCP primary election', topic: '1.3',
    columns: ['Order', 'override disabled (default)', 'override enabled'],
    rows: [
      ['1st', 'Most connected monitored interfaces', 'Most connected monitored interfaces'],
      ['2nd', 'Highest HA uptime (age)', 'Highest device priority'],
      ['3rd', 'Highest device priority', 'Highest HA uptime (age)'],
      ['4th', 'Highest serial number', 'Highest serial number'],
    ],
    note: 'Uptime differences smaller than `ha-uptime-diff-margin` (300 s by default) are treated as equal. With override enabled the higher-priority unit always takes back the primary role, which causes an extra failover when it rejoins. Check with `get system ha status`; compare configs with `diagnose sys ha checksum cluster`.',
  },
  {
    id: 'ippools', title: 'IP pool types (SNAT)', topic: '2.2',
    columns: ['Type', 'Behaviour'],
    rows: [
      ['Overload (default)', 'Many-to-one / many-to-few PAT: hosts share the pool addresses. Each host always gets the same pool address (`startip` + source IP mod pool size), and source ports are translated when needed (`port-preserve` keeps a free original port)'],
      ['One-to-one', 'Each internal address gets its own pool address; no port translation; pool exhaustion blocks new hosts'],
      ['Fixed port range', 'Maps an internal address range to an external range deterministically, each internal IP getting a fixed share of ports'],
      ['Port block allocation', 'Allocates blocks of ports per user (block size and blocks per user), reducing per-session NAT logging'],
    ],
    note: 'Policy NAT: enable NAT on the policy and either use the outgoing interface address or pick an IP pool. Central SNAT moves SNAT out of the policies into an ordered central SNAT table. PBA defaults: `block-size 128` × `num-blocks-per-user 8` = 1024 ports per host, `pba-timeout 30`. `arp-reply` is enabled by default, so FortiGate answers ARP for pool addresses and treats them as local even when no policy uses the pool. Delete unused pools.',
  },
  {
    id: 'inspection', title: 'Flow-based vs proxy-based inspection', topic: '3.2',
    columns: ['', 'Flow-based', 'Proxy-based'],
    rows: [
      ['How it scans', 'Reassembles and scans the stream while packets keep flowing (single-pass IPS engine)', 'Proxies the session (WAD, scanunit) and buffers the whole file or object before forwarding'],
      ['Performance', 'Higher throughput, lower latency', 'More CPU and memory, adds delay'],
      ['AV block seen by the user', 'Session reset if part of the file was already sent; block page on the next attempt (cached URL)', 'Replacement message immediately'],
      ['Typical use', 'Default for most policies', 'When you need proxy-only features or the most thorough file scanning'],
      ['Set where', 'Per firewall policy (`set inspection-mode flow`, the default)', 'Per firewall policy (`set inspection-mode proxy`)'],
    ],
    note: 'Proxy-only profiles in 8.0: video filter, inline CASB, ICAP, WAF, SSH filter, WebSocket inspection. Proxy-only features: AV CDR, client comforting and FortiNDR inline; web filter category quota and web profile override; DLP fingerprint/watermark; FortiGuard-assisted email filters. AV, web filter, DLP, file filter and email filter profiles have a `feature-set` that must match the policy mode; IPS and application control always run in the IPS engine. Physical models with 2 GB RAM or less have no proxy-only features (email proxy inspection allowed again since 7.6.5); FortiGate-VMs are exempt.',
  },
  {
    id: 'ssl-profiles', title: 'Built-in SSL/SSH inspection profiles', topic: '3.1',
    columns: ['Profile', 'What it does'],
    rows: [
      ['`certificate-inspection` (read-only)', 'Reads the SNI / server certificate only; no decryption. Enough for FortiGuard web filtering by domain; no paths, safe search, AV or DLP on HTTPS'],
      ['`deep-inspection` (read-only)', 'Full decryption and re-signing (`caname` Fortinet_CA_SSL, `untrusted-caname` Fortinet_CA_Untrusted); clients must trust the CA. Exempts categories 31/33/87 and a list of `g-…` wildcard-FQDN update servers'],
      ['`custom-deep-inspection`', 'The one editable built-in profile for deep inspection with your own exemptions and settings'],
      ['`no-inspection` (read-only)', 'No SSL inspection; do not pair it with other security profiles'],
    ],
    note: 'Clone a read-only profile to change it. For deep inspection, deploy the FortiGate\'s CA certificate (`Fortinet_CA_SSL`, or your own subordinate CA) to endpoints, or users see certificate warnings; never deploy `Fortinet_CA_Untrusted`. Exempt sites that pin certificates or must not be decrypted (Finance and Banking, Health and Wellness, Personal Privacy).',
  },
  {
    id: 'distance', title: 'Default administrative distance', topic: '4.1',
    columns: ['Route source', 'Distance'],
    rows: [
      ['Connected', '0'], ['Static route through an SD-WAN zone', '1'], ['Default route learned by DHCP or PPPoE', '5'], ['Static', '10'], ['eBGP', '20'], ['OSPF', '110'], ['IS-IS', '115'], ['RIP', '120'], ['iBGP', '200'],
    ],
    note: 'Route selection: longest prefix, then lowest distance. Static routes with the same prefix and distance are both kept in the RIB; the lower **priority** value wins (default 1), and equal priority gives ECMP. `get router info routing-table all` shows the RIB; `get router info routing-table database` also shows routes that lost on distance. The DHCP/PPPoE distance is set per interface and beats a static default route at 10.',
  },
  {
    id: 'sdwan', title: 'SD-WAN building blocks', topic: '4.2',
    columns: ['Object', 'Purpose'],
    rows: [
      ['Members', 'Interfaces (physical, VLAN, IPsec) added to SD-WAN, each with its own gateway, cost and priority'],
      ['Zones', 'Groups of members referenced by firewall policies and static routes (default zone `virtual-wan-link`)'],
      ['Performance SLA', 'Health checks (ping, HTTP/HTTPS, DNS, TWAMP, TCP/UDP echo and more) measuring latency, jitter and packet loss against SLA targets; defaults 500 ms interval, failtime/recoverytime 5'],
      ['SD-WAN rules', 'Steer traffic by source, destination, application or ISDB entry using a strategy; unmatched traffic follows the implicit rule'],
      ['Strategies', 'Manual, Best quality, Lowest cost (SLA); load balancing is an option inside Manual and Lowest cost (SLA) rules (it replaced Maximize bandwidth (SLA) in 7.4.1)'],
    ],
    note: 'Diagnose with `diagnose sys sdwan health-check`, `diagnose sys sdwan member` and `diagnose sys sdwan service4`. SD-WAN still needs a route (usually a static default route pointing to the SD-WAN zone, distance 1 by default) and a firewall policy that uses the zone.',
  },
  {
    id: 'ports', title: 'Ports and protocols', topic: '1.1',
    columns: ['Service', 'Port'],
    rows: [
      ['Admin GUI (HTTPS / HTTP)', 'TCP 443 / 80 (changeable with `admin-sport` / `admin-port`)'], ['Admin SSH', 'TCP 22 (changeable with `admin-ssh-port`)'],
      ['FortiAnalyzer (OFTP)', 'TCP 514; log data uses UDP 514 unless `set reliable enable`'], ['FortiManager management (FGFM)', 'TCP 541'],
      ['IKE / NAT-T (ESP = IP protocol 50)', 'UDP 500 / UDP 4500; IKE/ESP over TCP or TLS: TCP 443 by default since 7.6.1 (`ike-tcp-port`)'], ['FSSO collector agent ← FortiGate', 'TCP 8000 (default)'], ['FSSO DC agent → collector agent', 'UDP 8002 (default)'],
    ],
    note: 'Admin access is enabled per interface (`set allowaccess https ssh ping`) and restricted further with trusted hosts on each administrator account.',
  },
];
