// Curated free YouTube videos for NSE 6 FortiNAC-F 7.6 (all third-party except the Fortinet and
// Fortinet Video Library entries), mapped to NSE 6 FortiNAC-F topics. No complete, free playlist for
// this exam exists (checked 2026-10-29: The Net Knight, CybowPoint, Nicolai Bach-Hansen, the Network
// Security channel, Fortinet and Fortinet Video Library), so this is a list of individual videos, each
// listed with yt-dlp on 2026-10-29 for its real id and duration (22 videos, about 6.5 h). Upload dates
// are in the row comments; emoji were trimmed from two titles.
// Best current match: Nicolai Bach-Hansen's four-part "FortiNAC For Beginners" (Jul-Sep 2026), recorded
// on FortiNAC 7.6.6 (Parts 1-2) and 7.6.7 (Part 3, which covers the 7.6.7 logical VLAN mapping /
// state-based control workflow). CybowPoint's 2025 videos are FortiNAC-F (F 7.4-era; one installs
// "FortiNAC VM 7.4"). `legacy: true` marks videos that predate FortiNAC-F 7.6 and state no FortiNAC-F
// version (CybowPoint 2023-mid 2024, the Network Security channel's 2023 lab series on FortiNAC 9.x,
// Fortinet Video Library 2020 clips): on-blueprint subjects, but the GUI and menus differ from 7.6.
// No playlist: video-page.js sets `playlist: null`.

const RAW = [
  ['6Ds4DADd8z4', 1176, 'Network Access Control Made Simpler | FortiNAC', 'lecture', ['1.1'], false, 'Fortinet'], // 2024-08-29
  ['fDulHBdee88', 1156, 'FortiNAC Demo | Fortinet\'s Network Access Control Solution', 'lecture', ['1.1'], false, 'Fortinet'], // 2023-10-25
  ['TSEZGYlBg5s', 914, 'How to Install FortiNAC VM 7.4 on VMware Workstation Pro | Fortinac OS Evolution Explained', 'extra', ['1.1'], false, 'CybowPoint'], // 2025-01-24
  ['p7IiWSY7fW4', 3722, 'FortiNAC For Beginners Part 1: Deployment, Configuration, Profiles & 802.1x', 'lecture', ['1.2', '2.2', '2.4', '4.2'], false, 'Nicolai Bach-Hansen'], // 2026-07-23
  ['lOtaNKJKcZE', 1333, 'FortiNAC For Beginners Part2: Optimisation, Guest Portal and Self-Registration', 'lecture', ['2.2', '4.1'], false, 'Nicolai Bach-Hansen'], // 2026-07-26
  ['Np-lk6FJPd8', 1187, 'FortiNAC For Beginners Part 3 - 7.6.7 Device Modeling & Enforcement Changes', 'lecture', ['1.1', '2.2'], false, 'Nicolai Bach-Hansen'], // 2026-08-04
  ['shr49wfVqQw', 1964, 'FortiNAC for Beginners – Part 4: Third-Party Devices, SNMP Signaling, AD & Persistent Agent', 'lecture', ['1.1', '2.2', '4.3'], false, 'Nicolai Bach-Hansen'], // 2026-09-07
  ['WfleuL0uVO0', 1162, 'FortiNAC Mastery: Complete Network Segmentation & Isolation Setup Guide', 'lecture', ['1.2', '2.2'], false, 'CybowPoint'], // 2025-02-01
  ['ENE9DdL8V_A', 254, 'How to Add FortiGate and FortiAP to FortiNAC', 'lecture', ['1.1', '2.4'], false, 'CybowPoint'], // 2025-04-24
  ['KqkxFoYvG2w', 708, 'FortiNAC-F: Configuring Local RADIUS for 802.1X Authentication | Part 1', 'lecture', ['2.2'], false, 'CybowPoint'], // 2025-01-16
  ['K2KT7jI6FYw', 972, 'How to configure Dynamic VLAN Assignment Using FortiNAC as a Local RADIUS Server for 802.1X auth', 'lecture', ['2.2'], false, 'CybowPoint'], // 2025-01-22
  ['vlOR8v8Btr8', 174, 'FortiNAC-F - How to Integrate an LDAP Server (Active directory) with FortiNAC', 'lecture', ['2.2'], false, 'CybowPoint'], // 2025-01-16
  ['Joty_vDV31w', 2394, 'Guest Wi-Fi: Guest Self-Registration Setup with FortiNAC & FortiAP', 'lecture', ['4.1'], false, 'CybowPoint'], // 2025-02-19
  ['IWCDKmhP-oE', 1598, 'FortiNAC Network Setup and Isolation Networks Configuration Explained...', 'lecture', ['1.2'], true, 'CybowPoint'], // 2023-09-06
  ['YvV9bb0j0Fk', 1233, 'FortiNAC (Fortinet Network Access Control) DEMO 1: Fortigate Modelling & Security Fabric', 'lecture', ['2.4'], true, 'CybowPoint'], // 2023-06-28
  ['GSy5B9LsiRU', 654, 'FortiNAC (Fortinet Network Access Control) DEMO2:  Automated Response for Security Incidents', 'lecture', ['2.1'], true, 'CybowPoint'], // 2023-07-17
  ['mKXSWd2kxJk', 732, 'Fortinac Demo IV: Create Device Profiling rules', 'lecture', ['4.2'], true, 'CybowPoint'], // 2024-07-15
  ['-Jcifr3AVbw', 434, 'Part 11 - Remediation', 'lecture', ['1.2'], true, 'Network Security'], // 2023-03-22
  ['dD6G3OgJGkc', 597, 'Uncover the Key to Success with Part 13: Firewall Tags!', 'lecture', ['2.4'], true, 'Network Security'], // 2023-03-29
  ['zAttLFpP4AI', 215, 'FortiNAC Automated Response', 'lecture', ['2.1'], true, 'Fortinet Video Library'], // 2020-09-05
  ['L0-QO6jD9TE', 232, 'FortiNAC Contractor Registration', 'lecture', ['4.1'], true, 'Fortinet Video Library'], // 2020-09-05
  ['pZUKxBC5dv4', 879, 'FortiNAC - Visibility', 'lecture', ['4.3'], true, 'Fortinet Video Library'], // 2020-09-05
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
