// Curated free YouTube videos for NSE 5 FortiSwitch 7.6 (all third-party except the Fortinet and
// Fortinet Video Library entries), mapped to NSE 5 FortiSwitch topics. No complete, current, free
// playlist for this exam exists: on 2026-10-29 the video and playlist lists of Fortinet, Fortinet Video
// Library, IT LEARNING LABS, The Net Knight, CybowPoint, LAB IT UP, Fortinet Guru, Deploy & Defend,
// Forti Tip, Tech Cyber Shield, UniNets, secrit, ROSA Technocrat and The Network Fixer were listed with
// yt-dlp and filtered for FortiSwitch/FortiLink titles (the general web search budget was exhausted, so
// other channels were not searched). Fortinet Guru's "FortiSwitch Training Videos" playlist is
// 2019-2024 and only 7 videos, so this is a list of individual videos, each listed with yt-dlp on
// 2026-10-29 for its real id and duration (28 videos, about 4.1 h). Upload dates are in the row
// comments. Caveats: most of these were recorded on FortiOS 6.4-7.4 (Fortinet Guru 2019 videos on
// FortiOS 6.x), so GUI paths and defaults can differ from 7.6 (for example FortiLink neighbor
// detection defaults to LLDP only from FortiOS 7.6.1). `legacy: true` marks FortiOS 8.0-only videos
// and FortiAIOps, which the exam does not list. One `extra` video covers the FortiGate-VM trial
// licence used for lab work. No playlist: video-page.js sets `playlist: null`.

const RAW = [
  ['iJwenhC3qSE', 1154, '6-   FortiGate Trial License Explained: Features, Limits & Activation', 'extra', [], false, 'IT LEARNING LABS'], // 2025-06-02
  ['5hoPpu_ZGqk', 1149, 'FortiSwitch & FortiGate: VLAN Configuration Made Easy', 'lecture', ['1.1', '2.1'], false, 'CybowPoint'], // 2025-01-11
  ['w59GUilHpFE', 650, 'FortiSwitch VLAN Configuration Guide: GUI & CLI Setup with FortiLink', 'lecture', ['1.1'], false, 'Deploy & Defend'], // 2024-11-25
  ['iDRIHPBw84s', 483, 'How to Manage FortiSwitch via FortiGate | VLAN Creation & Port Assignment Step-by-Step', 'lecture', ['1.1', '2.1'], false, 'Tech Cyber Shield'], // 2025-10-10
  ['2ShzeMOmoWo', 262, 'How LLDP works', 'lecture', ['1.2'], false, 'Forti Tip'], // 2020-11-24
  ['Apmf0i99Ohg', 839, 'Auto Tagging VOIP Phones To Voice VLAN On FortiGate Managed FortiSwitch', 'lecture', ['1.2', '1.1'], false, 'Fortinet Guru'], // 2019-11-19
  ['SyCpMS7OfOY', 276, 'FortiOS 8.0: Configuring Advanced Switching Features for Managed FortiSwitches', 'lecture', ['1.2'], true, 'Fortinet Video Library'], // 2026-08-25
  ['QRzhBsKtLYo', 157, 'FortiOS 8.0: Assigning QoS Policies to Managed FortiSwitch Ports Using NAC', 'lecture', ['1.2'], true, 'Fortinet Video Library'], // 2026-07-29
  ['sWIR2xyV-AU', 798, 'FortiSwitch MCLAG Configuration Step-by-Step | Switch Redundancy with FortiLink', 'lecture', ['1.3', '2.2'], false, 'Deploy & Defend'], // 2024-11-30
  ['3elYuHiVAOs', 333, 'FortiOS 7.4.1 InterVLAN Routing Between Managed FortiSwitches', 'lecture', ['1.4'], false, 'Fortinet Guru'], // 2023-11-27
  ['SQVUOpwJIwM', 561, 'FortiSwitch Flap Guard Configuration Guide (Prevent Port Flapping & STP Instability)', 'lecture', ['1.6', '1.5'], false, 'Deploy & Defend'], // 2024-11-16
  ['xuhZYHAJ1EI', 466, 'Fortiswitch - Configuring the Fortilink Interface', 'lecture', ['2.1'], false, 'Deploy & Defend'], // 2024-11-20
  ['-CcqFP_AFEA', 458, 'Manage FortiSwitch With FortiGate', 'lecture', ['2.1'], false, 'Fortinet Guru'], // 2016-09-09
  ['l2r1NhvcHw0', 1366, 'How to Manage A Switch From FortiGate', 'lecture', ['2.1'], false, 'Fortinet Guru'], // 2019-11-05
  ['_MyD9ms53Rs', 1058, 'How to set up FortiSwitch and FortiAP devices for Local Area Network', 'lecture', ['2.1'], false, 'CybowPoint'], // 2024-12-11
  ['K0VfMHtKmqo', 322, 'How to Change Admin Password on All FortiSwitches from FortiGate CLI (Switch Profile Guide)', 'lecture', ['2.1'], false, 'Deploy & Defend'], // 2024-12-05
  ['c11etztNyHc', 823, 'FortiSwitch Firmware Process', 'lecture', ['2.1', '4.2'], false, 'Fortinet Guru'], // 2019-10-30
  ['pCm1Z1iUops', 234, 'FortiOS 6.4.2: Multiple FortiLink Interfaces', 'lecture', ['2.1', '2.2'], false, 'Fortinet Video Library'], // 2020-09-22
  ['9_mSMdf-uus', 719, 'A-P HA FortiGate Managing FortiSwitch Stack Architecture', 'lecture', ['2.2', '1.3'], false, 'Fortinet Guru'], // 2019-05-25
  ['DqAnCzdQc94', 380, 'HA FortiGate Managing FortiSwitch Stack PART 2', 'lecture', ['2.2', '1.3'], false, 'Fortinet Guru'], // 2019-05-25
  ['aVHqKCJxF1k', 317, 'FortiLink Redundant and Extensible Infrastructure Scenarios', 'lecture', ['2.2'], false, 'Fortinet Video Library'], // 2020-07-23
  ['Q82_gEcjnuw', 245, 'FortiLink Switch Recommendations to Optimize Performance and Improve Stability', 'lecture', ['2.2', '1.5'], false, 'Fortinet Video Library'], // 2020-09-15
  ['3TT2ZttiT_o', 357, 'Support NAC Policies on SwitchPorts in FortiOS 6.4', 'lecture', ['3.1'], false, 'Fortinet Video Library'], // 2020-06-30
  ['Om7sNJ76F_8', 255, 'FortiLink NAC - Onboarding FAP and FON with NAC policies', 'lecture', ['3.1'], false, 'Fortinet Video Library'], // 2020-09-29
  ['NHx4_3G4MhM', 229, 'FortiOS 8.0: Switch Controller NAC Segmentation using EAP Identity', 'lecture', ['3.1'], true, 'Fortinet Video Library'], // 2026-05-26
  ['2rLSLaxsDRo', 282, 'FortiSwitch DHCP Snooping Static Entries Guide (IP-MAC-Port Binding Tutorial)', 'lecture', ['3.2'], false, 'Deploy & Defend'], // 2024-12-10
  ['7yyC_lTgHUg', 277, 'Configure Mirror Ports On FortiSwitch Managed By FortiGate', 'lecture', ['4.1'], false, 'Fortinet Guru'], // 2024-01-16
  ['3DK_e1sAQmA', 141, 'FortiAIOps: Troubleshooting Switching Related Network and Throughput Issues', 'lecture', ['4.3'], true, 'Fortinet Video Library'], // 2026-04-07
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
