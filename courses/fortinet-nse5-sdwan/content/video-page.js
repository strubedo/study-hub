// Copy and links for the Video Course page (course.js `videos.page`).
// No single playlist covers this exam, so `playlist` is null and the main channels are listed under resources.
export default {
  intro: 'A curated set of free videos from Fortinet and third-party channels (no complete free SD-WAN Core 7.6 series exists), each tagged with the NSE 5 SD-WAN Core topics it supports. Several were recorded on FortiOS 7.0–7.4, so check strategy names and CLI against the lessons.',
  playlist: null,
  legacy: { label: 'Not on NSE 5 SD-WAN', title: 'FortiOS 8.0 or NSE 7-level subject, not listed in the NSE 5 SD-WAN Core 7.6 exam topics' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on several Core topics, so lean on the lessons and questions here:',
    note: 'Little or no current video coverage: SD-WAN for local-out traffic and SLA target maps (2.1), member probe routes and the route lookup process (2.2), session flags, protocol states and snat-route-change (2.3), FortiManager 7.6 SD-WAN templates in the SD-WAN Manager pane (3.1), SD-WAN event logs (3.2) and current 7.6 diagnose output (3.3).',
  },
  resources: [
    { name: 'NSE 5 - SD-WAN Core 7.6 Administrator exam page', url: 'https://training.fortinet.com/local/staticpage/view.php?page=sd-wan_core_administrator_exam', note: 'Official exam topics this site is built on.' },
    { name: 'Fortinet SD-WAN Core Administrator self-paced course', url: 'https://training.fortinet.com/local/staticpage/view.php?page=library_sd-wan-core-administrator', note: 'Official course behind the exam (FortiOS 7.6.3, FortiManager 7.6.3): lectures free with a FortiCloud login, labs paid. Includes sample questions.' },
    { name: 'FortiOS 7.6.3 Administration Guide — SD-WAN', url: 'https://docs.fortinet.com/document/fortigate/7.6.3/administration-guide/19246/sd-wan', note: 'The SD-WAN chapter the exam cites.' },
    { name: 'FortiOS 7.6.4 CLI Reference — config system sdwan', url: 'https://docs.fortinet.com/document/fortigate/7.6.4/cli-reference/838040159', note: 'Every SD-WAN attribute and default.' },
    { name: 'FortiManager 7.6 Administration Guide — SD-WAN Manager', url: 'https://docs.fortinet.com/document/fortimanager/7.6.1/administration-guide/474330/sd-wan-manager', note: 'SD-WAN templates, overlay orchestration and monitoring.' },
    { name: 'LAB IT UP — FortiGate SD-WAN', url: 'https://www.youtube.com/playlist?list=PLeDm5NI-1k3pfyWZoCcWIRgeVUNRlQ2G1', note: 'Free, third-party EVE-NG labs on the implicit rule and strategies (FortiOS 7.0-era).' },
    { name: 'FortiGate-VM permanent trial license', url: 'https://docs.fortinet.com/document/fortigate/7.6.8/administration-guide/441460', note: 'Free lab VM: 1 vCPU / 2 GB, max 3 interfaces, 3 policies and 3 routes, no FortiGuard.' },
    { name: 'FortiManager-VM trial license', url: 'https://docs.fortinet.com/document/fortimanager/7.6.0/vm-trial-license-guide/131614/licensing', note: 'Free lab VM: 3 devices/VDOMs, 2 ADOMs, no FortiGuard or FDS features.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'Test center or OnVUE online proctoring.' },
  ],
};
