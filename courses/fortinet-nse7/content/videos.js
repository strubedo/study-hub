// Curated free videos for NSE 7 Secure Networking 7.6 (YouTube). No complete free NSE 7 SN series exists
// (checked 2026-10-29), so this is a hand-picked list from several channels, mapped to NSE 7 topics by title
// and description: Fortinet's own channels ("Fortinet", "Fortinet Video Library"), secrit (ADVPN / BGP on
// loopback lab demos, FortiOS 7.2-7.6), IT LEARNING LABS (FortiGate 7.4/7.6 lab series), PM Networking,
// staticroute, CyberGeek, FortiBytes and Fortinet Guru. All except the Fortinet channels are third-party.
// Ids, durations and upload dates taken with yt-dlp on 2026-10-29; members-only videos were left out.
// Titles are lightly trimmed (series numbers, hashtags, "NSE4" tags removed).
// Several are 7.2/7.4-era or admin-level; check the version shown in each video against the 7.6 docs.
// `legacy: true` marks a video that is useful background but not on the NSE 7 blueprint.

const RAW = [
  // [id, seconds, title, topics, channel, legacy]
  ['1dt8lV2bzQ0', 711, 'Fortinet Secure SD-WAN 7.6 - A Solution Overview', ['1.4'], 'Fortinet'],
  ['1-O4QCYoF5k', 1806, 'FortiGate SD-WAN Explained (Full Guide for Beginners & NSE Exams)', ['1.4'], 'IT LEARNING LABS'],
  ['DYPtPySxlHY', 1224, 'FortiGate High Availability Explained | Active-Passive vs Active-Active', ['1.2'], 'IT LEARNING LABS'],
  ['2xxzmL2iNDU', 2752, 'FortiGate High Availability (HA) Setup Step-by-Step', ['1.2'], 'IT LEARNING LABS'],
  ['Ibv1N7RNNzk', 1386, 'Day 29 FortiGate | Active-Active HA Configurations on FortiGate Firewalls', ['1.2'], 'PM Networking'],
  ['ZppbPHat8y8', 271, 'Support UTM Inspection on Asymmetric Traffic in FGSP', ['1.2'], 'Fortinet Video Library'],
  ['j4rdEPQwfUI', 2514, 'FortiGate vDOM: Architecture, Configuration & Real-World Use Cases', ['1.3'], 'IT LEARNING LABS'],
  ['jnP3AWSmHzo', 2446, 'FortiGate vDOM – How to Configure Inter-vDOM Communication', ['1.3'], 'IT LEARNING LABS'],
  ['rPyYgMPTLhw', 418, 'Fortinet Secure SD-WAN ZTP in FortiManager', ['2.1'], 'Fortinet'],
  ['YsnqB0Yppic', 370, 'Fortinet SD-WAN Overlay Orchestration in FortiManager', ['2.2'], 'Fortinet'],
  ['M3UU2zJ1qMM', 289, 'Add ADVPN 2.0 and Dynamic BGP Support to an SD-WAN Overlay Template in FortiManager', ['2.2', '5.3'], 'Fortinet Video Library'],
  ['h42MymcAVng', 725, 'ADVPN Template creation with FortiManager', ['5.1', '5.3'], 'secrit'],
  ['9EuLBsvkRx0', 318, 'FortiManager - deploy ADVPN branch with 15 overlays - 2 minutes', ['2.2', '5.2'], 'secrit'],
  ['LrAonhuCBSk', 1219, 'FortiGate SSL/SSH Inspection - Full Explanation', ['3.1'], 'IT LEARNING LABS'],
  ['6NCeUcmI47c', 1007, 'FortiGate: Certificate vs Deep Inspection - Step-by-Step (Part 1)', ['3.1'], 'IT LEARNING LABS'],
  ['64F9Dm1GRZs', 1315, 'FortiGate: Certificate vs Deep Inspection - Step-by-Step (Part 2)', ['3.1'], 'IT LEARNING LABS'],
  ['3pCCwGGXhzA', 1788, 'FortiGate Security Profiles Explained | Antivirus, IPS, Web Filtering, App Control', ['3.2'], 'IT LEARNING LABS'],
  ['pSGRrLyQKC4', 1095, 'Creating a Route Based IPsec VPN with OSPF on FortiGate', ['4.1'], 'CyberGeek'],
  ['vTcs5oFRQ5Q', 1575, 'Day 19 FortiGate Firewall | Basic BGP Configurations and Verification', ['4.2'], 'PM Networking'],
  ['W7-AlzTJy0s', 2364, 'BGP on Fortigate - In depth Guide plus important topical exam concepts!', ['4.2'], 'staticroute'],
  ['mdns1qlcBNM', 2963, 'FortiGate SD-WAN: Rules & Performance SLA Setup (Step-by-Step Guide)', ['4.3', '1.4'], 'IT LEARNING LABS'],
  ['vYq_MqbvR3A', 542, 'White Board Session - ADVPN Architecture Explanation', ['5.3'], 'Fortinet Guru'],
  ['WKVeIATugTU', 880, 'Fortinet ADVPN - Building blocks of ADVPN', ['5.3', '4.2'], 'secrit'],
  ['7dCeUA5rhKQ', 606, 'Guided tutorial: ADVPN - Dual Hub - with BGP on Loopback - from scratch', ['5.2', '5.3'], 'secrit'],
  ['3SmNWZGlIgw', 428, 'FortiGate ADVPN 1.0 - Cross Overlay - BGP on Loopback (7.4.8)', ['5.3'], 'secrit'],
  ['U3raaWPedm0', 658, 'FortiGate - ADVPN 2.0 with Dynamic BGP on Loopback', ['5.3'], 'secrit'],
  ['A1zPaDO6-UA', 353, 'FortiGate ADVPN 2.0 - Transit Groups - Single Hub - (MPLS / DIA) - Testing', ['5.3'], 'secrit'],
  ['JwSewau9wt4', 1052, 'Public Cloud Four Site ADVPN Mesh (Using the Fabric Overlay Orchestrator)', ['5.3'], 'FortiBytes', true],
];

export default RAW.map(([id, seconds, title, topics, channel, legacy = false], i) => ({
  id, title, seconds, kind: 'lecture', topics, legacy, order: i + 1, channel, playlist: null,
}));
