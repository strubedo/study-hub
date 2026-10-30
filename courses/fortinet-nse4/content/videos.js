// IT LEARNING LABS "FortiGate 7.4 & 7.6 Training LAB" playlist (YouTube, third-party, free),
// mapped to NSE 4 FortiOS 8.0 topics. Listing taken 2026-10-29 (51 videos).
// Recorded mostly on FortiOS 7.4/7.6 (episode 40 covers what's new in 8.0), so check 8.0 changes
// in the lessons. `legacy: true` marks subjects that are not on the NSE 4 8.0 topic list
// (VDOMs, VLAN basics, traffic shaping, SSL VPN). Episodes 1-5 are lab-setup extras.
export const PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PL8yjfb93Plz2lDHnmG1rd_GmdWIcChfws';

const CHANNEL = 'IT LEARNING LABS';
const PLAYLIST = 'PL8yjfb93Plz2lDHnmG1rd_GmdWIcChfws';

const RAW = [
  ['iJWLSBYuYTM', 330, '1- FortiGate NSE Exam Prep – Everything You Need to Know', 'extra', [], false],
  ['8kDsrYX9SS0', 654, '2- VMware Workstation 17 Pro – Prerequisites & Step-by-Step Installation (2025)', 'extra', [], false],
  ['HkpYNBfjIi8', 591, '3- GNS3 - Step by step Installation on Windows 11', 'extra', [], false],
  ['ZTcu7XuUy5c', 938, '4- Nested Virtualization: VMware Workstation Pro + GNS3 on Win 10 & 11', 'extra', [], false],
  ['fyGctFJNmkY', 823, '5- How to Import FortiGate Devices in GNS3 (Step-by-Step Guide)', 'extra', [], false],
  ['iJwenhC3qSE', 1155, '6- FortiGate Trial License Explained: Features, Limits & Activation', 'lecture', ['1.1'], false],
  ['6KRCwdx1XwM', 739, '7- Getting Started with FortiGate Firewall | Fortinet Essentials', 'lecture', ['1.1'], false],
  ['RK1OaDgWpyg', 850, '8- FortiGate DHCP Server | Step-by-Step Configuration', 'lecture', ['1.1'], false],
  ['9B0_kuS2vqY', 613, '9- NAT vs SNAT vs DNAT vs PAT | Explained with FortiGate Examples', 'lecture', ['2.2'], false],
  ['Ch04F3kIfzY', 955, '10- FortiGate Virtual IPs (VIPs) – Step by Step Configuration | NSE Training', 'lecture', ['2.2'], false],
  ['F0VakRJkPHQ', 1000, '11- FortiGate LDAP Configuration with Windows Server Active Directory | Step-by-Step Guide', 'lecture', ['2.3'], false],
  ['zfNTSVTW3F4', 865, '12- What is Fortinet Single Sign-On (FSSO) + How to Set it Up ?', 'lecture', ['2.4'], false],
  ['SArlvOm6Gws', 1163, '13- Fortinet Single Sign-On (FSSO) Installation + Windows AD Integration', 'lecture', ['2.4'], false],
  ['fFRbGFrv-w4', 1278, '14- FortiGate SSL Certificates Explained | Complete NSE4 Guide', 'lecture', ['3.1'], false],
  ['zq2tAu085QU', 1327, "15- Create a Let's Encrypt SSL Certificate on FortiGate", 'lecture', ['3.1'], false],
  ['SpTFw4AQ4TU', 1232, '16- How to Upgrade FortiGate Firewall from v6.4.10 to v7.6.4', 'lecture', ['1.1'], false],
  ['rTrHgFPxDgs', 1047, '17- FortiGate-VM on Microsoft Azure | NSE4 Cloud Lab | Step-by-Step Guide', 'lecture', ['1.5'], false],
  ['zwp7UIet2QQ', 1409, '18- FortiGate SSL VPN Configuration Step-by-Step (Full Guide 2026)', 'lecture', [], true],
  ['tUZLYvsiSkg', 1594, '19- FortiGate IPSec VPN Step-by-Step | Complete Lab for Certification', 'lecture', ['5.1'], false],
  ['LrAonhuCBSk', 1219, '20- FortiGate SSL/SSH Inspection (NSE4) - Full Explanation', 'lecture', ['3.1'], false],
  ['6NCeUcmI47c', 1007, '21- FortiGate NSE4 : Certificate vs Deep Inspection - Step-by-Step (Part1)', 'lecture', ['3.1'], false],
  ['64F9Dm1GRZs', 1315, '22- FortiGate NSE4 : Certificate vs Deep Inspection - Step-by-Step (Part2)', 'lecture', ['3.1'], false],
  ['3pCCwGGXhzA', 1788, '23- FortiGate NSE : Security Profiles Explained | Antivirus, IPS, Web Filtering, App Control', 'lecture', ['3.2', '3.3', '3.4', '3.5'], false],
  ['UlHTR_CIeCM', 1852, '24- FortiGate NSE Study Guide – DNS Filtering vs Web Content Filtering', 'lecture', ['3.2'], false],
  ['AqVeingUz9w', 2083, '25- FortiGate NSE: File Filtering & Application Control (Full Guide)', 'lecture', ['3.3'], false],
  ['Jt3DlPIoyE4', 1196, '26- FortiGate NSE Lab : How to Customize Default Block Pages (Full Demo)', 'lecture', ['3.2'], false],
  ['DYPtPySxlHY', 1224, '27- FortiGate High Availability Explained | Active-Passive vs Active-Active (Fortinet HA Guide)', 'lecture', ['1.3'], false],
  ['2xxzmL2iNDU', 2752, '28- FortiGate High Availability (HA) Setup Step-by-Step | Fortinet Training', 'lecture', ['1.3'], false],
  ['XeF0NzO-FFY', 1860, '29- FortiGate HA Setup with 3 Firewalls (Step-by-Step Guide)', 'lecture', ['1.3'], false],
  ['1-O4QCYoF5k', 1807, '30- FortiGate SD-WAN Explained (Full Guide for Beginners & NSE Exams)', 'lecture', ['4.2'], false],
  ['mdns1qlcBNM', 2964, '31- FortiGate SD-WAN: Rules & Performance SLA Setup (Step-by-Step Guide)', 'lecture', ['4.2'], false],
  ['q2rFk5EQc7g', 2272, '32- FortiGate + AD CS Integration (Step-by-Step) | Secure Authentication Made Easy', 'lecture', ['3.1'], false],
  ['xuHf6VuZD74', 3285, '33- FortiGate HTTPS Certificate from AD CS | Complete Step-by-Step Guide', 'lecture', ['3.1'], false],
  ['4B8uI4_zJPk', 3037, '34- FortiGate + Active Directory LDAPS Setup for SSL VPN Access | Complete Guide 2026', 'lecture', ['2.3'], false],
  ['j4rdEPQwfUI', 2515, '35- FortiGate vDOM: Architecture, Configuration & Real-World Use Cases', 'lecture', [], true],
  ['oSOfVGKvr1c', 2309, '36- FortiGate VLAN Configuration Step-by-Step | Complete Beginner Guide', 'lecture', [], true],
  ['ufq0sBH9BI8', 1444, '37- FortiGate vLAN Security & Access Restrictions | Trusted Hosts', 'lecture', ['1.1'], false],
  ['NyDI05syJ5M', 1963, '38- FortiGate vLAN -Traffic Shaping (QoS) & Bandwidth Sharing | How to Prioritize VoIP, Video & Data', 'lecture', [], true],
  ['oOphA9ifgIw', 2090, '39- How to Configure vLANs with SD-WAN on FortiGate | Step-by-Step Lab', 'lecture', ['4.2'], false],
  ['Bh0ebIQI598', 2369, "40- FortiOS 8.0 Explained | What's New? Features, Improvements & Upgrade Guide | Live Demo", 'lecture', ['1.1'], false],
  ['HY2Xvp7iDYo', 2558, '41- FortiGate vDOM Configuration Step-by-Step | Complete Lab Tutorial', 'lecture', [], true],
  ['jnP3AWSmHzo', 2446, '42- FortiGate vDOM – How to Configure Inter-vDOM Communication | Step-by-Step Lab', 'lecture', [], true],
  ['Trk-4HC5PHg', 2377, '43- FortiGate: How to Create & Manage VLANs in vDOMs | Step-by-Step Lab', 'lecture', [], true],
  ['D7_O4ON-SVw', 1820, '44- FortiGate SNAT Explained: Overload vs One-to-One | Complete Lab & Examples', 'lecture', ['2.2'], false],
  ['kMelHPFKT8M', 2438, '45- FortiGate DNAT & VIPs Explained | With & Without PAT | NSE 4', 'lecture', ['2.2'], false],
  ['VNsZdBkjXXo', 2317, '46- FortiGate FSSO: Agentless Mode + LDAP Server | Step-by-Step Configuration', 'lecture', ['2.4'], false],
  ['o_uMb5d2KqA', 2525, '47- Fortinet Single Sign-On (FSSO) – Collector Agent-Based Mode | Step-by-Step Configuration | NSE4', 'lecture', ['2.4'], false],
  ['ooL12L8LbCI', 2298, '48- Fortinet Single Sign-On (FSSO): DC Agent-Based Mode | Step-by-Step Configuration', 'lecture', ['2.4'], false],
  ['A95_9iXYXd0', 2209, '49- FortiGate FSSO: Standard vs Advanced AD Access Mode Explained | NSE4 Lab', 'lecture', ['2.4'], false],
  ['VKy_TXHjnpE', 1887, '50- FortiGate FSSO: How to Integrate 2 Active Directory Domains with 1 FortiGate | Agentless Mode', 'lecture', ['2.4'], false],
  ['RZBgukePfrE', 2844, '51- Fortinet FSSO with 2 Active Directory Domains | Bidirectional Trust Lab', 'lecture', ['2.4'], false],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel: CHANNEL, playlist: PLAYLIST,
}));
