// Curated free YouTube videos mapped to course topics. Ids, durations, titles and channels come from yt-dlp flat search (2026-10-30); upload dates were not available.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel. legacy=true marks Ben Eater's 2018-era series (concepts hold; tooling is dated).
const RAW = [
  ["LkolbURrtTs", 805, "OSI Model: A Practical Perspective - Networking Fundamentals - Lesson 2a", "lecture", ['1.1'], false, "Practical Networking"],
  ["1XrRT0CmzYw", 545, "Frame formats | Networking tutorial (6 of 13)", "lecture", ['1.2'], true, "Ben Eater"],
  ["aamG4-tH_m8", 607, "ARP: Mapping between IP and Ethernet | Networking tutorial (9 of 13)", "lecture", ['1.3'], true, "Ben Eater"],
  ["rPoalUa4m8E", 573, "The Internet Protocol | Networking tutorial (8 of 13)", "lecture", ['1.4'], true, "Ben Eater"],
  ["vdajb14Lcu0", 881, "How IP FRAGMENTATION Works", "lecture", ['1.4', '3.2'], false, "Chris Greer"],
  ["5WfiTHiU4x8", 1125, "what is an IP Address? // You SUCK at Subnetting // EP 1", "lecture", ['2.1'], false, "NetworkChuck"],
  ["BWZ-MHIhqjM", 517, "What is Subnetting? - Subnetting Mastery - Part 1 of 7", "lecture", ['2.2'], false, "Practical Networking"],
  ["5-wlfAdcmFQ", 370, "How to solve ANY Subnetting Problems in 60 seconds or less - Subnetting Mastery - Part 3 of 7", "lecture", ['2.2'], false, "Practical Networking"],
  ["amKyfbg5G2Q", 709, "Variable-Length Subnet Mask (VLSM) - Subnetting Mastery - FLSM and VLSM Appendix Part 2 of 2", "lecture", ['2.3'], false, "Practical Networking"],
  ["Q4MArJTbUwk", 1839, "Supernetting, IP Aggregation, and IP Summarization -- Subnetting Mastery", "extra", ['2.3'], false, "Practical Networking"],
  ["po8ZFG0Xc4Q", 431, "Public vs Private IP Address", "extra", ['2.4'], false, "PowerCert Animated Videos"],
  ["up3bcBLZS74", 564, "Traceroute (tracert) Explained - Network Troubleshooting", "extra", ['3.1', '4.5'], false, "PowerCert Animated Videos"],
  ["XMcYwr-yJGA", 419, "How TCP Works - MTU vs MSS", "lecture", ['3.2'], false, "Chris Greer"],
  ["uwoD5YsGACg", 277, "TCP vs UDP Comparison", "lecture", ['3.3'], false, "PowerCert Animated Videos"],
  ["HCHFX5O1IaQ", 833, "How TCP Works - The Handshake", "lecture", ['3.4'], false, "Chris Greer"],
  ["IRXP1vJ6-vM", 953, "TCP Congestion Control // Hands-On Deep Dive TCP Analysis with Wireshark", "extra", ['3.4'], false, "Chris Greer"],
  ["Ep-x_6kggKA", 881, "Everything Routers do - Part 2 - How Routers forward Packets - Networking Fundamentals - Lesson 5", "lecture", ['4.1'], false, "Practical Networking"],
  ["PDcwijVC4XE", 901, "Route Precedence -- How does a Router choose a path when multiple paths exist?", "lecture", ['4.1'], false, "Practical Networking"],
  ["VWJ8GmYnjTs", 830, "Hop-by-hop routing | Networking tutorial (11 of 13)", "extra", ['4.1'], true, "Ben Eater"],
  ["IUOVSIKj6GU", 441, "How DHCP works?", "lecture", ['4.2'], false, "Sunny Classroom"],
  ["qYYeg2kz1yE", 1703, "Free CCNA | DHCP Snooping | Day 50 | CCNA 200-301 Complete Course", "lecture", ['4.2'], false, "Jeremy's IT Lab"],
  ["PS0UppB3-fg", 475, "DNS recursive query vs. Iterative query", "lecture", ['4.3'], false, "Sunny Classroom"],
  ["HnUDtycXSNE", 854, "DNS Records Explained", "extra", ['4.3'], false, "PowerCert Animated Videos"],
  ["KA56kj23RPU", 427, "NAT vs PAT, Static vs Dynamic -- demystified! -- Network Address Translation", "lecture", ['4.4'], false, "Practical Networking"],
  ["Q2XEoBEKrso", 545, "Static PAT - Network Address Translation", "extra", ['4.4'], false, "Practical Networking"],
  ["9tzy_6itUYM", 530, "Carrier-Grade NAT (NAT444)", "extra", ['4.4'], false, "Technology Lowdown"],
  ["68t07-KOH9Y", 733, "Top 10 Wireshark Filters // Filtering with Wireshark", "lecture", ['4.5'], false, "Chris Greer"],
  ["pucrWfbmumA", 182, "3 tcpdump Filters I Use for Real Troubleshooting", "extra", ['4.5'], false, "ZekByte Systems | Linux, DevOps & Networking"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
