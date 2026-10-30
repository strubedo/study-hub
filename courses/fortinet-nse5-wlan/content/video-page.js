// Copy and links for the Video Course page (course.js `videos.page`).
// No single playlist covers this exam, so `playlist` is null and the main channels are listed under resources.
export default {
  intro: 'A curated set of free videos from Fortinet presenters, third-party channels and vendor-neutral RF teachers (no complete free Secure Wireless LAN 7.6 series exists), each tagged with the exam topics it supports. None states FortiOS 7.6 and several are from 2020–2023, so check menus, CLI and product names (FortiLAN Cloud is now FortiEdge Cloud) against the lessons.',
  playlist: null,
  legacy: { label: 'Not on NSE 5 WLAN', title: 'FortiPresence-only subject: FortiPresence 2.0 is in the exam\'s product line but not in its topic list' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on several topics, so lean on the lessons and questions here:',
    note: 'Little or no current English video coverage: DARRP and radio settings (1.3), WPA3 configuration on FortiGate (2.2), VLAN pooling (2.3), WIDS profiles and rogue AP suppression (3.1, Portuguese only), the FortiAP REST API (3.2), FortiAIOps 3.x (3.3), controller and FortiAP CLI (`diagnose wireless-controller wlac`, `cw_diag`) and wireless logs (4.1, 4.3).',
  },
  resources: [
    { name: 'NSE 5 - Secure Wireless LAN 7.6 Administrator exam page', url: 'https://training.fortinet.com/local/staticpage/view.php?page=secure_wireless_lan_administrator_exam', note: 'Official exam topics this site is built on.' },
    { name: 'Fortinet Secure Wireless LAN Administrator self-paced course', url: 'https://training.fortinet.com/local/staticpage/view.php?page=library_secure-wireless-lan-administrator', note: 'Official course behind the exam (FortiOS 7.6, FortiAP 7.6, FortiAIOps 3.2): lectures free with a FortiCloud login, labs paid. Includes sample questions.' },
    { name: 'FortiWiFi and FortiAP 7.6 Configuration Guide', url: 'https://docs.fortinet.com/document/fortiap/7.6.0/fortiwifi-and-fortiap-configuration-guide', note: 'The configuration guide the exam cites: discovery, SSIDs, security, rogue APs, debug commands.' },
    { name: 'FortiOS 7.6.3 CLI Reference — config wireless-controller vap', url: 'https://docs.fortinet.com/document/fortigate/7.6.3/cli-reference/304313044/config-wireless-controller-vap', note: 'Every SSID attribute and default (see the neighbouring wtp-profile and wids-profile pages too).' },
    { name: 'FortiAIOps 3.2 User Guide', url: 'https://docs.fortinet.com/document/fortiaiops/3.2.0/user-guide', note: 'Wireless SLAs, adding FortiGate controllers, AI-ARRP.' },
    { name: 'FortiEdge Cloud User Guide', url: 'https://docs.fortinet.com/document/fortiedge-cloud/26.3.0/user-guide', note: 'Cloud management of standalone FortiAPs (FortiEdge Cloud is transitioning to FortiManagement Cloud).' },
    { name: 'SecInfra — FORTIAP (Portuguese)', url: 'https://www.youtube.com/playlist?list=PLkEWllBrbuspOzbA9BxOqgGAmVBXhSiTl', note: 'Free, third-party, 6 videos: WPA3-Enterprise, RADIUS, rogue/suppressed APs, guest portal, tunnel vs bridge.' },
    { name: 'FortiGate-VM permanent trial license', url: 'https://docs.fortinet.com/document/fortigate/7.6.8/administration-guide/441460', note: 'Free lab VM for the controller-side CLI: 1 vCPU / 2 GB, max 3 interfaces, 3 policies and 3 routes, no FortiGuard. FortiAP features need real hardware.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'Test center or OnVUE online proctoring.' },
  ],
};
