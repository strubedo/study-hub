// Curated free YouTube videos for NSE 5 SD-WAN Core 7.6 (all third-party except the Fortinet and
// Fortinet Video Library entries), mapped to NSE 5 SD-WAN Core topics. No complete, current, free
// playlist for this exam exists (searched 2026-10-29: IT LEARNING LABS, The Net Knight, CybowPoint,
// LAB IT UP, Fortinet's channels and others), so this is a list of individual videos, each listed
// with yt-dlp on 2026-10-29 for its real id and duration (31 videos, about 8.7 h). Upload dates are
// in the row comments. Caveats: the LAB IT UP "FortiGate SD-WAN" series (episodes 8 and 10-17,
// uploaded 2024) opens with a FortiOS 7.0 introduction, so expect a 7.0-era build: its
// "Maximize Bandwidth" strategy is the 7.4.1+ load-balancing option
// inside a Manual or Lowest Cost (SLA) rule; the Forti Tip passive-measurement clip is 7.0; The Net
// Knight lab is the FortiGate Administrator 7.4 lab, not the SD-WAN Core lab. `legacy: true` marks
// FortiOS 8.0 or NSE 7-level subjects (ADVPN 2.0 overlay template, FortiOS 8.0 FortiView SD-WAN
// widget). Two `extra` videos cover lab setup (FortiGate-VM trial licence, FortiManager-VM install).
// No playlist: video-page.js sets `playlist: null`.

const RAW = [
  ['iJwenhC3qSE', 1154, '6-   FortiGate Trial License Explained: Features, Limits & Activation', 'extra', [], false, 'IT LEARNING LABS'], // 2025-06-02
  ['B2xWSrUPO7g', 1107, 'How to Install FortiManager on VMware Workstation | Step-by-Step Enterprise Lab Setup', 'extra', [], false, 'CybowPoint'], // 2026-01-16
  ['1dt8lV2bzQ0', 711, 'Fortinet Secure SD-WAN 7.6 - A Solution Overview | SD-WAN', 'lecture', ['1.1'], false, 'Fortinet'], // 2024-07-08
  ['_PQd6ygy4UI', 2751, 'Fortinet SD-WAN Explained: Enterprise Architecture & Live Whiteboard Session', 'lecture', ['1.1'], false, 'CybowPoint'], // 2025-12-31
  ['1-O4QCYoF5k', 1806, '30- FortiGate SD-WAN Explained (Full Guide for Beginners & NSE Exams)', 'lecture', ['1.1', '1.2'], false, 'IT LEARNING LABS'], // 2026-04-13
  ['9faHqjHSmgc', 1436, 'FortiGate Administrator 7.4 Training Institute Labs | Lab-12 (SD-WAN Configuration)', 'lecture', ['1.1', '1.2', '1.3', '2.1'], false, 'Eng / Mohamed Al-Tantawy Yehya | The Net Knight'], // 2025-08-08
  ['UdsVgbFrtvA', 672, 'FortiGate SD-WAN Configuration Guide: Zones, Members, Routes & Load Balancing', 'lecture', ['1.2', '2.2'], false, 'Deploy & Defend'], // 2024-01-31
  ['oOphA9ifgIw', 2090, '39- How to Configure vLANs with SD-WAN on FortiGate | Step-by-Step Lab', 'lecture', ['1.2', '2.2'], false, 'IT LEARNING LABS'], // 2026-07-08
  ['mdns1qlcBNM', 2963, '31- FortiGate SD-WAN: Rules & Performance SLA Setup (Step-by-Step Guide)', 'lecture', ['1.3', '2.1'], false, 'IT LEARNING LABS'], // 2026-04-20
  ['hidMmQw2B7I', 236, 'FortiOS 7.0 Passive WAN measurement', 'lecture', ['1.3'], false, 'Forti Tip'], // 2021-05-08
  ['_xZOpBtu_K4', 1738, 'Introduction to Fortinet SD-WAN Rules | FortiGate SD-WAN Explained', 'lecture', ['2.1'], false, 'UniNets'], // 2025-08-06
  ['q1DdnuacFLI', 1475, '10. Mastering Implicit Source ip based SD-WAN Rules in FortiGate: EVE-NG Lab Walk through', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-09-21
  ['-DC5bSrE9hM', 411, '11. Mastering FortiGate SD-WAN: Implicit Source & Destination Load-Balancing in EVE-NG LAB', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-10-10
  ['GO_KGw0ha9U', 402, '12. Optimizing Network Performance: Weight-Based Implicit Load Balancing in FortiGate SD-WAN', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-10-13
  ['4tooZFTn2aY', 805, '13. FortiGate Load Balancing Unleashed: Understanding Implicit Volume-Based Algorithms!', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-10-13
  ['rBr1GvcRMCA', 819, '14. Mastering Spillover Implicit Load Balancing in FortiGate SD-WAN', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-10-16
  ['Drk43t-cZqM', 1336, '15 . Mastering Low-Cost SLA Strategies in FortiGate SD-WAN', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-10-29
  ['-n3axIF5lVs', 778, '16. Best Quality Load Balancing Algorithm in FortiGate SD-WAN Lab on EVE-NG | Step-by-Step Guide', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-11-17
  ['wCHgAIZUaxw', 899, '17. Maximize Bandwidth with FortiGate SD-WAN: SLA Strategy using Round-Robin Hashing Algorithm', 'lecture', ['2.1'], false, 'LAB IT UP'], // 2024-11-21
  ['WMpTmdnrwOg', 445, 'Fortigate - SDWAN - minimum-sla-meet-members', 'lecture', ['2.1'], false, 'secrit'], // 2025-08-26
  ['CQ-W8BZIIwM', 1048, '8. Configuring Policy Routes on FortiGate Firewalls: EVE-NG Lab Tutorial', 'lecture', ['2.2'], false, 'LAB IT UP'], // 2024-09-04
  ['zJZZ4CANNFU', 1232, 'Fortigate Session Diagnose #diag sys session #fortigate #fortios #troubleshooting #networksecurity', 'lecture', ['2.3'], false, 'ROSA Technocrat'], // 2022-08-13
  ['acKbawAc1x8', 247, 'How to add a Fortigate firewall to Fortimanager', 'lecture', ['3.1'], false, 'CybowPoint'], // 2025-04-11
  ['n_hisPtZqU0', 565, 'Fortigate Standardization with FortiManager - Provisioning Templates', 'lecture', ['3.1'], false, 'secrit'], // 2025-04-10
  ['Jz3w1pTXQv0', 436, 'Provisioing Templates in FortiManager and MetaData variables', 'lecture', ['3.1'], false, 'Ahmad Srour'], // 2025-01-26
  ['YsnqB0Yppic', 370, 'Fortinet SD-WAN Overlay Orchestration in FortiManager | SD-WAN', 'lecture', ['3.1'], false, 'Fortinet'], // 2024-01-05
  ['M3UU2zJ1qMM', 289, 'Add ADVPN 2.0 and Dynamic BGP Support to an SD-WAN Overlay Template in FortiManager', 'lecture', ['3.1'], true, 'Fortinet Video Library'], // 2026-07-10
  ['r4A_tgyB7I0', 246, 'FortiManager - SD-WAN Monitoring in Large Environments (5000 devices)', 'lecture', ['3.1', '3.2'], false, 'Fortinet Video Library'], // 2026-05-01
  ['ruvU_JYSsKc', 160, 'FortiView SD-WAN Application Graphical Performance Monitoring', 'lecture', ['3.2'], true, 'Fortinet Video Library'], // 2026-05-20
  ['WJ4araroMTM', 566, 'FortiGate SD-WAN Troubleshooting After Implementation | Fix Load Balancing Rule Issues Fast', 'lecture', ['3.3'], false, 'Tech Cyber Shield'], // 2026-02-22
  ['1nEWsPO561o', 1992, 'FortiGate CLI Commands for Troubleshooting | 20+ FortiOS Commands Every Network Engineer Should Know', 'lecture', ['3.3'], false, 'The Network Fixer'], // 2026-10-05
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
