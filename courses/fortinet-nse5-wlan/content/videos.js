// Curated free YouTube videos for NSE 5 Secure Wireless LAN 7.6 (all third-party except the Fortinet
// Video Library entry; the Tech Field Day talks are given by Fortinet staff), mapped to the exam's
// topics. No complete, current, free playlist for this exam exists (searched 2026-10-29: Fortinet and
// Fortinet Video Library channels, CybowPoint, srnetsec, SecInfra, IT LEARNING LABS, Silesio Carvalho,
// viewer-made FortiAP playlists and others; the closest is SecInfra's 6-video Portuguese "FORTIAP"
// list), so this is a list of individual videos, each listed with yt-dlp on 2026-10-29 for its real id
// and duration (33 videos, about 9.2 h). Upload dates are in the row comments. Caveats: no wireless
// video states FortiOS 7.6; the newest stated versions are 7.4.x (the FortiAP 7.4.3 upgrade clip and
// the srnetsec NAC demo on FortiGate 7.4.9 / FortiAP 7.4.6, whose wired FortiSwitch part is off-topic).
// The Fortinet Video Library and Tech Field Day troubleshooting talks are from 2020, the FortiAIOps
// talks cover FortiAIOps 1.x/2.0 (the course uses 3.2), "FortiLAN Cloud" is the old name of FortiEdge
// Cloud, the Silesio Carvalho video was made for the older NSE 6 FortiWiFi exam, and the only
// rogue-AP video (SecInfra) is in Portuguese. Eight vendor-neutral videos cover RF and security basics.
// `legacy: true` marks the FortiPresence-only clip: FortiPresence 2.0 is in the exam's product line
// but not in its topic list. Two `extra` videos cover lab setup (FortiGate-VM 7.6 evaluation licence).
// No playlist: video-page.js sets `playlist: null`.

const RAW = [
  ["AQMA9aU202g", 1083, "How to Install FortiGate 7.6.0 Virtual Machine with Free evaluation License in VMWare Workstation", "extra", [], false, "CybowPoint"], // 2024-08-09
  ["NGE5ktEvQGQ", 407, "Fortinet Trial Licenses (FGT & FMG) | Complete Guide for Labs on ESXi, GNS3, and EVE-NG", "extra", [], false, "KBTrainings With Guy Bisuku"], // 2024-06-17
  ["QSq1TYTiESA", 781, "Explaining Wi-Fi: 802.11 Standards & Generations", "lecture", ["1.1"], false, "ExplainingComputers"], // 2023-06-04
  ["uZyrJTfetNg", 558, "Wi-Fi Channels Explained: 2.4GHz, 5GHz & Overlap | CCNA Prep", "lecture", ["1.1"], false, "CBT Nuggets"], // 2026-02-23
  ["3EzRQpnswWA", 601, "What is WiFi DFS?", "lecture", ["1.1"], false, "Willie Howe"], // 2021-02-18
  ["gVBEcvMHKr0", 515, "WiFi 7 Explained", "lecture", ["1.1"], false, "PowerCert Animated Videos"], // 2025-04-21
  ["oPPeNJaigeU", 2817, "Secure Flexible Wi-Fi 7 with Fortinet’s FortiAP-441K Wi-Fi Access Point", "lecture", ["1.1"], false, "Tech Field Day"], // 2024-05-20
  ["WZaIfyvERcA", 520, "WiFi (Wireless) Password Security - WEP, WPA, WPA2, WPA3, WPS Explained", "lecture", ["1.1", "2.2"], false, "PowerCert Animated Videos"], // 2019-04-26
  ["XjLkLhzL6HE", 397, "Manage FortiAP with FortiGate (Wireless Controller)", "lecture", ["1.2", "1.3", "2.1"], false, "ToThePoint Fortinet"], // 2022-03-29
  ["EStWM7V-x2o", 1357, "Introduction to FortiAP Management with FortiGate | Setup, SSIDs & Demo", "lecture", ["1.2", "1.3", "2.1"], false, "srnetsec"], // 2026-06-15
  ["oC1w3tkXdzY", 908, "FortiAP with FortiGate (Wireless Controller) | NSE 6 Secure Wireless LAN", "lecture", ["1.2", "2.1"], false, "Silesio Carvalho"], // 2024-03-04
  ["iR8bx0FAJeo", 530, "How to set up FortiAP (Fortinet Access Point) using FortiGate device as the Wireless AP Controller", "lecture", ["1.2"], false, "CybowPoint"], // 2024-12-11
  ["QMAMrChPt-8", 264, "How to upgrade FortiAP 221E to 7.4.3 firmware", "lecture", ["1.2"], false, "The Ping Master"], // 2025-05-14
  ["LOvKLZ6D7qs", 497, "FortiAP Compatibility Troubleshooting | How to Check on FortiGate (Step-by-Step Guide)", "lecture", ["1.2", "4.2"], false, "Tech Cyber Shield"], // 2025-09-28
  ["4RyfLEo8JpA", 622, "Connecting Fortinet FortiAP to FortiLAN Cloud", "lecture", ["1.2"], false, "Alexander Pavlock"], // 2023-08-01
  ["BbPPGNx8HrQ", 933, "Deploying and Managing Fortinet Switches and AP's in FortiEdge Cloud", "lecture", ["1.2"], false, "CyberGeek"], // 2026-03-02
  ["3H6rJ5yiuBA", 361, "FortiAP Complete Setup Step by Step | SSID Profile, WiFi Setup, Radio Profile | Enterprise WiFi", "lecture", ["1.3", "2.1"], false, "Daily Support"], // 2026-05-07
  ["mU-4wFkNw0c", 1834, "Fortinet FortiAP's- How to form a wireless mesh network to extend your WLAN", "lecture", ["2.1"], false, "Alexander Pavlock"], // 2023-08-18
  ["kVKh97hpRng", 396, "How to setup a Private and Guest WIFI network on your FortiGate and FortiAP", "lecture", ["2.1", "2.2"], false, "Secure IT City"], // 2023-01-21
  ["SdC3ppnanAE", 452, "How 802.1X works", "lecture", ["2.2"], false, "CBT Nuggets"], // 2026-01-05
  ["jdkIvw1tohc", 1047, "How to Configure Wireless Radius Server authentication on FortiGate Firewall (FortiAP) with Windows", "lecture", ["2.2"], false, "CybowPoint"], // 2022-07-05
  ["nmdF_Aw3Rtk", 466, "Solving IoT Needs in a WPA3 World – Fortinet’s MPSK for WPA3", "lecture", ["2.2"], false, "Tech Field Day"], // 2024-05-20
  ["70y4jjybJ4Q", 3399, "FortiGate/AP Guest WiFi Config and Demo: Disclaimers, Guest Accounts, Email Collection + Custom HTML", "lecture", ["2.2"], false, "srnetsec"], // 2026-02-17
  ["jKsDymddwlc", 1413, "Dynamic Wi-Fi VLAN Assignment: FortiAP & FortiAuthenticator Enterprise Setup (802.1X)", "lecture", ["2.2", "2.3"], false, "CybowPoint"], // 2026-01-12
  ["MxmdC6ucTk8", 1858, "FortiGate NAC Demo: Built-In Wired + WiFi NAC (FortiGate + FortiSwitch + FortiAP)", "lecture", ["2.3"], false, "srnetsec"], // 2026-02-03
  ["VfyYDVhmb_s", 605, "FORTIAP - ROGUE AP, SUPRESSED AP -  O QUE É, CONCEITOS E QUANDO USAR! #fortinet #fortigate #fortiap", "lecture", ["3.1"], false, "SecInfra - Security and Network Infrastructure"], // 2024-11-01
  ["F15YO5br2kw", 856, "How to Configure Multiple FortiAPs with Same SSID for Seamless Roaming | FortiGate WiFi Setup", "lecture", ["3.2"], false, "CybowPoint"], // 2026-04-09
  ["uiXqfxeUJ7g", 149, "Fortinet Handoff Setup | Wi-Fi Roaming Explained", "lecture", ["3.2"], false, "Firewalls.com"], // 2025-10-22
  ["S7DATalgVlE", 503, "Wireless Monitoring & Troubleshooting", "lecture", ["3.2", "4.1", "4.2"], false, "Fortinet Video Library"], // 2020-09-11
  ["ueYdOc7IDFU", 1094, "Enhanced AI & ML for the LAN with FortiAIOps", "lecture", ["3.3"], false, "Tech Field Day"], // 2022-07-17
  ["b4N4TKpWg0o", 2472, "Announcing v2.0 of Fortinet’s AIOps Solution, Combining Troubleshooting Tools with Network Insights", "lecture", ["3.3"], false, "Tech Field Day"], // 2023-05-21
  ["J46G80MoCT0", 141, "FortiPresence - Presence Analytics and Guest Interaction | Wireless Management", "lecture", ["3.2"], true, "GCC"], // 2019-10-16
  ["eUgOQfLnAUI", 3206, "Fortinet Troubleshooting Fortinet Wireless in FortiOS", "lecture", ["4.1", "4.2", "4.3"], false, "Tech Field Day"], // 2020-08-01
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
