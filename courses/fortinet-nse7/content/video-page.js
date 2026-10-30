// Copy and links for the Video Course page (course.js `videos.page`).
// Curated list (see videos.js); there is no single playlist. Links checked 2026-10-29.
export default {
  intro: 'There is no complete free video course for NSE 7 Secure Networking 7.6, so this is a curated list: Fortinet\'s own short demos of FortiManager overlay orchestration and ZTP, plus free third-party labs on ADVPN, BGP on loopback, HA, VDOMs, SD-WAN and inspection, each tagged with the NSE 7 topics it supports. Several are recorded on FortiOS 7.2 or 7.4, or at admin level; the lessons here are the 7.6 reference.',
  playlist: null,
  legacy: { label: 'Not on NSE 7', title: 'Useful background, not listed in the NSE 7 Secure Networking 7.6 exam topics' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'These topics have no good free 7.4/7.6 video, so lean on the lessons, the Reference tables and the docs:',
    note: 'Also thin on video: multiregion design and VRF-aware overlays (5.2), IKEv2 DPD, MTU/MSS, aggregates, FEC and NPU offload (5.1), and ZTP with device blueprints and CSV import (2.1).',
  },
  resources: [
    { name: 'NSE 7 - Secure Networking 7.6 Architect exam page', url: 'https://training.fortinet.com/local/staticpage/view.php?page=secure_networking_architect_exam', note: 'Official exam topics this site is built on.' },
    { name: 'FortiOS 7.6 Administration Guide', url: 'https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide', note: 'SD-WAN, ADVPN, HA, VDOM and routing chapters. The exam cites 7.6.0 and 7.6.3.' },
    { name: 'FortiOS 7.6 CLI Reference', url: 'https://docs.fortinet.com/document/fortigate/7.6.3/cli-reference', note: 'Exact option names and defaults, e.g. config vpn ipsec phase1-interface.' },
    { name: 'FortiManager 7.6 Administration Guide', url: 'https://docs.fortinet.com/document/fortimanager/7.6.3/administration-guide', note: 'SD-WAN Manager, overlay orchestration, IPsec templates, ZTP.' },
    { name: 'Fortinet 4-D Resources: SD-WAN', url: 'https://docs.fortinet.com/4d-resources/SD-WAN', note: 'Fortinet\'s SD-WAN deployment and architecture guides (the exam page cites the "SD-WAN—Deployment Guide" without a link).' },
    { name: 'FortiGate-VM permanent trial', url: 'https://docs.fortinet.com/document/fortigate/7.6.8/administration-guide/441460', note: 'Free lab VM: 3 interfaces, 3 policies, 3 routes, low encryption, one per FortiCloud account.' },
    { name: 'FortiManager-VM trial license', url: 'https://docs.fortinet.com/document/fortimanager/7.6.0/vm-trial-license-guide/131614/licensing', note: 'Free lab VM: 3 devices/VDOMs, 2 ADOMs, no FortiGuard or FDS features.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'NSE 7 is test center only since 2026-09-21.' },
  ],
};
