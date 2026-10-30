// Copy and links for the Video Course page (course.js `videos.page`).
// No single playlist covers this exam, so `playlist` is null and the main channels are listed under resources.
// Doc links are the 7.6.1 editions the exam page links (checked 2026-10-29).
export default {
  intro: 'A curated set of free videos from Fortinet and third-party channels (no complete free FortiSwitch 7.6 series exists), each tagged with the NSE 5 FortiSwitch topics it supports. Most were recorded on FortiOS 6.4–7.4, so check GUI paths, defaults and CLI against the lessons.',
  playlist: null,
  legacy: { label: 'Not on NSE 5 FortiSwitch', title: 'FortiOS 8.0-only or FortiAIOps subject, not listed in the NSE 5 FortiSwitch 7.6 exam topics' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on several exam tasks, so lean on the lessons and questions here:',
    note: 'Little or no current video coverage: STP, root/BPDU guard and loop guard on managed switches (1.5), split ports and transceivers (1.6), multi-tenancy with VDOMs and virtual port pools (2.3), DAI and IPv4 source guard (3.2), ACLs, quarantines and intra-VLAN blocking (3.3), FortiSwitchOS packet-capture profiles (4.1), FortiLink troubleshooting with get-conn-status and config sync (4.2), switch-info and FortiSwitchOS diagnose commands (4.3), and FortiSwitch in standalone mode.',
  },
  resources: [
    { name: 'NSE 5 - FortiSwitch 7.6 Administrator exam page', url: 'https://training.fortinet.com/local/staticpage/view.php?page=fortiswitch_administrator_exam', note: 'Official exam topics this site is built on.' },
    { name: 'Fortinet FortiSwitch 7.6 Administrator self-paced course', url: 'https://training.fortinet.com/local/staticpage/view.php?page=library_fortiswitch-administrator', note: 'Official course behind the exam (FortiGate 7.6, FortiSwitch 7.6): lectures free with a FortiCloud login, labs paid. Includes sample questions.' },
    { name: 'FortiLink Guide 7.6.1 (FortiOS 7.6)', url: 'https://docs.fortinet.com/document/fortiswitch/7.6.1/fortilink-guide', note: 'Managing FortiSwitch from the FortiGate: provisioning, topologies, MCLAG, VLANs, security, troubleshooting commands.' },
    { name: 'FortiSwitchOS 7.6.1 Administration Guide', url: 'https://docs.fortinet.com/document/fortiswitch/7.6.1/fortiswitchos-administration-guide', note: 'Standalone FortiSwitch: switching, routing, STP, 802.1X, ACL, packet capture.' },
    { name: 'FortiSwitchOS 7.6.1 CLI Reference', url: 'https://docs.fortinet.com/document/fortiswitch/7.6.1/fortiswitchos-cli-reference', note: 'Every FortiSwitchOS command and attribute.' },
    { name: 'Fortinet Guru — FortiSwitch Training Videos', url: 'https://www.youtube.com/playlist?list=PLkTH0tTArHoSuI67iQcTZ-7UZzuOD2GRI', note: 'Free, third-party: 7 videos on FortiLink stacks with HA FortiGates, firmware, voice VLAN and mirroring (uploaded 2019–2024).' },
    { name: 'FortiGate-VM permanent trial license', url: 'https://docs.fortinet.com/document/fortigate/7.6.8/administration-guide/441460', note: 'Free lab VM: 1 vCPU / 2 GB, max 3 interfaces, 3 policies and 3 routes, no FortiGuard. Shows the switch-controller configuration; to our knowledge there is no free FortiSwitch VM.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'Test center or OnVUE online proctoring.' },
  ],
};
