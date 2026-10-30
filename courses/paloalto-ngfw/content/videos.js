// Curated free YouTube videos mapped to NGFW Engineer topics. Ids, durations and upload dates checked with yt-dlp on 2026-10-30.
// Tuple: id, seconds, title, kind, topic ids, legacy, channel. Upload date / note in the trailing comment.
const RAW = [
  ["3oG92nAR0_A", 5612, "Palo Alto Interface Types – Deep Dive", "lecture", ["1.1"], false, "CloudCipher Academy"], // 2025-09-20
  ["x-m2kZK7am4", 1011, "Video Tutorial: Zone Protection Profiles", "extra", ["1.2"], true, "Palo Alto Networks LIVEcommunity"], // 2016-01-15; PAN-OS 7.x era, concepts still valid
  ["aL_ee1FZRdM", 1356, "[PaloAlto Firewall] High Availability configuration Active/Passive. Failover Test.", "lecture", ["1.3"], false, "TechTalkSecurity"], // 2026-01-04
  ["AGBpWyZHvsc", 425, "[PaloAlto Firewall] HA Active/Passive link/Path Monitor configuration and failover Explained", "extra", ["1.3"], false, "TechTalkSecurity"], // 2026-01-17
  ["LkHph2AwPjA", 1545, "October, 2024 Spark User Summit: Advanced Routing Engine (ARE) - Part 1 of 2", "lecture", ["1.4"], false, "Palo Alto Networks LIVEcommunity"], // 2024-10-28
  ["GtBr4cVSD1w", 2072, "October, 2024 Spark User Summit: Advanced Routing Engine (ARE) - Part 2 of 2", "lecture", ["1.4"], false, "Palo Alto Networks LIVEcommunity"], // 2024-11-05
  ["m1NWcB2gBj4", 1493, "10.6 | Lab: GlobalProtect Remote Access VPN (Palo Alto PAN-OS) | Portal + Gateway +(Step-by-Step)", "lecture", ["1.5"], false, "Astrit Krasniqi"], // 2026-02-11
  ["w56CRt1YFNw", 1274, "10.10 | Lab: Site-to-Site IPsec VPN (Palo Alto PAN-OS) | Build Tunnel+ Verify Traffic (Step-by-Step)", "lecture", ["1.6"], false, "Astrit Krasniqi"], // 2026-02-25
  ["zHfA-FlChoY", 976, "NGFW Engineer Lesson 13 - Virtual Systems", "lecture", ["2.2"], false, "Wes"], // 2026-10-06
  ["w_sELOfoVio", 1300, "NGFW Engineer Lesson 14 - VSYS Routing", "lecture", ["2.2"], false, "Wes"], // 2026-10-19
  ["KVEBpdGZxrc", 1499, "Palo Alto Networks Strata Cloud Manager NGFW Onboarding", "extra", ["2.3"], false, "MB Tech Talker"], // 2025-05-31; SCM onboarding, only loosely related to logging
  ["6HRapvR1nok", 807, "Upgrade PAN-OS from 10.2 to 11.1", "lecture", ["2.4"], false, "Wes"], // 2025-07-06
  ["GnkCuRCHqH0", 805, "7.3 | SSL Forward Proxy Decryption (Palo Alto PAN-OS) | Configure, Certificates, Verify", "lecture", ["2.5"], false, "Astrit Krasniqi"], // 2026-01-30
  ["n3sSsGtPDyc", 2012, "Week 14: Cloud Identity Engine", "lecture", ["2.6"], false, "Palo Alto Networks LIVEcommunity"], // 2022-11-21; CIE UI has changed since, check menus
  ["W4_gPTQQt20", 128, "Mobile Users with Explicit Proxy", "extra", ["2.7"], false, "Palo Alto Networks LIVEcommunity"], // 2022-02-01; Prisma Access explicit proxy, not the PAN-OS web proxy feature
  ["OovXk4WF7vs", 450, "Introducing Cloud NGFW for AWS Video", "lecture", ["3.1"], false, "Palo Alto Networks LIVEcommunity"], // 2022-03-29
  ["18MwInEAE0Y", 2695, "July 2025 - Spark User Summit - Prisma AIRS", "lecture", ["3.1"], false, "Palo Alto Networks LIVEcommunity"], // 2025-07-28
  ["sHZz9YkovgM", 593, "Introduction to CN-Series and Demo", "extra", ["3.1", "3.3"], true, "Palo Alto Networks LIVEcommunity"], // 2020-12-16; PAN-OS 10.0 era
  ["v4HIvytbVU8", 1097, "Bootstrapping the VM-Series on AWS", "extra", ["3.1", "3.3"], true, "Palo Alto Networks LIVEcommunity"], // 2019-03-08; PAN-OS 9.0 era, bootstrap folder layout still the same idea
  ["SfyouNAFF7Q", 188, "Introduction to the PAN-OS API", "lecture", ["3.2"], false, "Palo Alto Networks LIVEcommunity"], // 2022-02-10
  ["07tIl9rkd0U", 582, "Palo Alto Automation: Security Rule Configuration using Ansible galaxy collection | Playbook Example", "lecture", ["3.3"], false, "NetworkEvolution"], // 2024-04-04
  ["lWSuOq4hS_s", 463, "Palo Alto Automation: Commit and Print Config Changes | Ansible Playbook Example", "extra", ["3.3", "3.2"], false, "NetworkEvolution"], // 2024-04-08
  ["KJd3rS9spQw", 1032, "Using Terraform to configure Palo Alto firewall", "lecture", ["3.3"], false, "SKA"], // 2024-05-08; likely the 1.x panos provider, resource names differ in 2.x
  ["zHytWZfAe7U", 608, "PANCast Episode 23: Panorama Templates and Template Stacks", "lecture", ["3.4"], false, "Palo Alto Networks LIVEcommunity"], // 2023-08-02
  ["66jDqhUMqxw", 2538, "January 2025 Spark User Summit: Session 1 - Panorama Templates & Template Groups", "lecture", ["3.4"], false, "Palo Alto Networks LIVEcommunity"], // 2025-01-27
  ["fbqZXbuObyc", 357, "Palo Alto Panorama Template Variables", "extra", ["3.4"], false, "netsums"], // 2025-01-30
  ["VrUkuRJPTEY", 558, "11.2 | Application Command Center (ACC) (Palo Alto PAN-OS) Network, Threat, Blocked, Tunnel Activity", "lecture", ["3.5"], false, "Astrit Krasniqi"], // 2026-03-23
  ["DnX6mFklBcQ", 443, "11.3 | Reports (Palo Alto PAN-OS) | Predefined + Custom Reports + PDF Summary (EDU-210)", "lecture", ["3.5"], false, "Astrit Krasniqi"], // 2026-03-30
];
export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
