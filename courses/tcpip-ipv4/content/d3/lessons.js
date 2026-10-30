// Domain 3 — ICMP, UDP and TCP. Original content, checked against RFCs 768, 792, 1191, 2018, 3168, 4821, 5681, 5961, 6298, 6335, 6633, 6928, 7323, 8899, 9293 and the IANA ICMP and port registries.
export default [
  { id: '3.1-icmp-ping-traceroute', topic: '3.1', title: 'ICMP, Ping, Traceroute and Redirects', minutes: 9, file: '3.1-icmp-ping-traceroute.md',
    objectives: ['Decode ICMP types and codes 0, 3, 5, 8, 11 and 12', 'Interpret ping replies and TTL values', 'Contrast UDP-based traceroute with Windows ICMP tracert', 'Explain why routers send redirects', 'Avoid breaking the network by filtering ICMP'] },
  { id: '3.2-mtu-mss-pmtud', topic: '3.2', title: 'MTU, MSS, Fragmentation and Path MTU Discovery', minutes: 10, file: '3.2-mtu-mss-pmtud.md',
    objectives: ['Distinguish MTU from MSS', 'Explain DF and ICMP type 3 code 4 in path MTU discovery', 'Recognise a PMTUD black hole', 'Calculate tunnel overhead and an MSS clamp value for GRE, IPsec and PPPoE'] },
  { id: '3.3-udp-ports-sockets', topic: '3.3', title: 'UDP, Ports and Sockets', minutes: 9, file: '3.3-udp-ports-sockets.md',
    objectives: ['Decode the 8-byte UDP header', 'Decide when UDP is the right transport', 'State the port ranges and OS ephemeral defaults', 'Identify a flow by its 5-tuple', 'Recall the common service ports'] },
  { id: '3.4-tcp-header-handshake-teardown', topic: '3.4', title: 'TCP Header, Handshake and Teardown', minutes: 10, file: '3.4-tcp-header-handshake-teardown.md',
    objectives: ['Decode TCP header fields, flags and options', 'Compute sequence and acknowledgment numbers through a handshake', 'Trace a four-segment close and a half-close', 'Explain what causes an RST'] },
  { id: '3.4-tcp-state-machine-time-wait', topic: '3.4', title: 'TCP States, TIME-WAIT and Reading ss', minutes: 9, file: '3.4-tcp-state-machine-time-wait.md',
    objectives: ['Name the eleven TCP states and who occupies them', 'Explain why TIME-WAIT exists and how long it lasts on Linux and Windows', 'Diagnose CLOSE-WAIT and TIME-WAIT buildup from ss output', 'Describe keepalives and idle timeouts'] },
  { id: '3.4-tcp-windowing-retransmission-congestion', topic: '3.4', title: 'Windows, Retransmission, SACK and Congestion Control', minutes: 11, file: '3.4-tcp-windowing-retransmission-congestion.md',
    objectives: ['Separate flow control (rwnd) from congestion control (cwnd)', 'Apply window scaling and the bandwidth-delay product', 'Explain RTO, duplicate ACKs, fast retransmit and SACK', 'Describe slow start, congestion avoidance, fast recovery and ECN'] },
];
