// Domain 2 — IPv4 Addressing and Subnetting. Original content, checked against RFCs 791, 919, 950, 1112, 1122, 1918, 2644, 3021, 3927, 4632, 5737, 5771, 6598, 6890, 7526 and the IANA IPv4 Special-Purpose Address Registry.
export default [
  { id: '2.1-binary-decimal-hex', topic: '2.1', title: 'Binary, Decimal and Hexadecimal for IPv4 Addresses', minutes: 9, file: '2.1-binary-decimal-hex.md',
    objectives: ['Write and read octets using binary place values', 'Convert between decimal, binary and hexadecimal', 'Recognise the nine valid mask octet values', 'Read an IPv4 address as a 32-bit number in a packet dump'] },
  { id: '2.1-classful-cidr-address-types', topic: '2.1', title: 'Classful History, CIDR and Address Types', minutes: 9, file: '2.1-classful-cidr-address-types.md',
    objectives: ['Identify Class A to E from the leading bits', 'Explain why classful addressing failed and how CIDR replaced it', 'Distinguish unicast, broadcast, multicast and anycast', 'Classify a destination address from a capture'] },
  { id: '2.2-masks-prefixes-anding', topic: '2.2', title: 'Subnet Masks, Prefix Lengths and ANDing', minutes: 10, file: '2.2-masks-prefixes-anding.md',
    objectives: ['Convert between prefix length and dotted-decimal mask', 'Compute hosts per subnet (2^h - 2) and subnets per block', 'Derive network and broadcast addresses by ANDing', 'Explain how a host decides local versus remote'] },
  { id: '2.2-block-size-method', topic: '2.2', title: 'The Block-Size Method with Worked Examples', minutes: 10, file: '2.2-block-size-method.md',
    objectives: ['Apply the five-step block-size method in any octet', 'List all subnets of a block and their usable ranges', 'Pick a prefix from a host or subnet requirement', 'Check whether two hosts share a subnet'] },
  { id: '2.3-vlsm-overlaps', topic: '2.3', title: 'VLSM Allocation, Largest First, and Avoiding Overlaps', minutes: 10, file: '2.3-vlsm-overlaps.md',
    objectives: ['Allocate subnets largest-first with correct alignment', 'Build a VLSM plan for a parent block with links and LANs', 'Detect overlapping prefixes', 'Plan growth, loopbacks and point-to-point links'] },
  { id: '2.3-summarization-wildcards', topic: '2.3', title: 'Route Summarization and Wildcard Masks', minutes: 10, file: '2.3-summarization-wildcards.md',
    objectives: ['Summarize contiguous networks using the longest common prefix', 'Decide when an exact single summary is impossible', 'Explain over-summarization and discard routes', 'Convert subnet masks to wildcard masks for ACLs and OSPF'] },
  { id: '2.4-private-shared-loopback-linklocal-doc', topic: '2.4', title: 'Private, Shared, Loopback, Link-Local and Documentation Blocks', minutes: 10, file: '2.4-private-shared-loopback-linklocal-doc.md',
    objectives: ['State the three RFC 1918 ranges exactly', 'Explain 100.64.0.0/10 and carrier-grade NAT', 'Recognise loopback and 169.254.0.0/16 link-local behaviour', 'Use the RFC 5737 blocks and avoid confusing them with 198.18.0.0/15'] },
  { id: '2.4-broadcast-multicast-reserved-p2p', topic: '2.4', title: '0.0.0.0, Broadcast, Multicast, Reserved Space, /31 and /32', minutes: 10, file: '2.4-broadcast-multicast-reserved-p2p.md',
    objectives: ['Distinguish 0.0.0.0, 0.0.0.0/0, limited and directed broadcast', 'Recognise common 224.0.0.0/24 control addresses', 'Explain 240.0.0.0/4 as reserved space', 'Use /31 point-to-point links and /32 host routes correctly'] },
];
