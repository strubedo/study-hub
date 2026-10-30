// Copy and links for the Video Course page (course.js `videos.page`).
// No single playlist covers this exam, so `playlist` is null and the main series are listed under resources.
export default {
  intro: 'A curated set of free videos from Fortinet and third-party channels (no complete free FortiNAC-F 7.6 series exists), each tagged with the NSE 6 FortiNAC-F topics it supports. Start with Nicolai Bach-Hansen\'s four-part FortiNAC For Beginners, recorded on FortiNAC 7.6.6 and 7.6.7.',
  playlist: null,
  legacy: { label: 'Pre-7.6', title: 'Recorded before FortiNAC-F 7.6 (legacy FortiNAC or an unstated older version): the subject is on the exam, but menus and workflows differ' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on several FortiNAC-F topics, so lean on the lessons and questions here:',
    note: 'Little or no video coverage: high availability, 1+1 and N+1 (2.3), syslog and SNMP trap input and custom security event parsers (2.1, 3.1), FortiNAC-F Manager (3.2), FortiGate VPN integration (3.3), MDM integration and vendor OUI tables (3.4), CSV import, data preservation and system recovery (4.2), and logging, reports and host aging (4.3).',
  },
  resources: [
    { name: 'NSE 6 - FortiNAC-F 7.6 Administrator exam page', url: 'https://training.fortinet.com/local/staticpage/view.php?page=fortinac_administrator_exam', note: 'Official exam topics this site is built on.' },
    { name: 'Fortinet Training Institute library — FortiNAC-F 7.6 Administrator', url: 'https://training.fortinet.com/local/library/', note: 'Official self-paced course behind the exam: lectures free with a FortiCloud login, labs paid. Includes sample questions.' },
    { name: 'FortiNAC-F 7.6 documentation', url: 'https://docs.fortinet.com/product/fortinac-f/7.6', note: 'Administration Guide, Deployment Guide, FortiNAC Manager guide, HA and N+1 guides, CLI Reference Manual.' },
    { name: 'FortiNAC-F 7.6 CLI Reference Manual', url: 'https://docs.fortinet.com/document/fortinac-f/7.6.0/cli-reference-manual', note: 'Every get, execute, diagnose and config command.' },
    { name: 'Nicolai Bach-Hansen — FortiNAC For Beginners', url: 'https://www.youtube.com/playlist?list=PLfs6viAnoMAc', note: 'Free, third-party four-part build of a FortiNAC 7.6.6/7.6.7 lab: profiling, 802.1X, guests, 7.6.7 device modeling, third-party switches.' },
    { name: 'CybowPoint — FortiNAC Overview and Configuration Tutorial', url: 'https://www.youtube.com/playlist?list=PLGFOYdDg2xtwgDCVwtCIsdQhtP11uu1qy', note: 'Free, third-party; the FortiNAC videos run 2023-2025 and the playlist also holds unrelated clips.' },
    { name: 'Pearson VUE — schedule a Fortinet exam', url: 'https://home.pearsonvue.com/fortinet', note: 'Test center or OnVUE online proctoring.' },
  ],
};
