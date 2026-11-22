// Curated free YouTube videos mapped to Security+ topics. Filled in by the last writer using yt-dlp.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
// Curated 2026-11-22: candidates found with `yt-dlp "ytsearch:<query>" --flat-playlist`, then every id confirmed
// individually with `yt-dlp --print "%(id)s|%(duration)s|%(title)s|%(channel)s|%(upload_date)s" <url>`; titles,
// durations and channels below are as yt-dlp reported them. SY0-801 material checked first: Professor Messer's
// "CompTIA Security+ SY0-801 (V8) Training Course" playlist had six videos, all objective 1.1 (uploaded 2026-11-19);
// the SY0-801 "full course" uploads from small, unknown channels were not used. Topics are SY0-801 blueprint ids,
// mapped by content, not by the SY0-701 number in a title. legacy = recorded for SY0-701.
const RAW = [
  // Domain 1
  ['yrE0fEEChu4', 788, 'Security Controls - CompTIA Security+ SY0-801 V8 - 1.1', 'lecture', ['1.1'], false, 'Professor Messer'],
  ['dtxmcv1lBKk', 303, 'The CIA Triad - CompTIA Security+ SY0-801 V8 - 1.1', 'lecture', ['1.1'], false, 'Professor Messer'],
  ['MwEY32PWy0c', 702, 'Authentication, Authorization, and Accounting - CompTIA Security+ SY0-801 V8 - 1.1', 'lecture', ['1.1'], false, 'Professor Messer'],
  ['JQo9OBdKJsw', 447, 'Zero Trust - CompTIA Security+ SY0-801 V8 - 1.1', 'lecture', ['1.1', '3.2'], false, 'Professor Messer'],
  ['48wRbMdHFVI', 681, 'Change Management - CompTIA Security+ SY0-701 - 1.3', 'lecture', ['1.2'], true, 'Professor Messer'],
  ['xHAMEF7-inQ', 548, 'Public Key Infrastructure - CompTIA Security+ Sy0-701 - 1.4', 'lecture', ['1.3'], true, 'Professor Messer'],
  // Domain 2
  ['86fruE9jkKk', 286, 'Threat Intelligence - CompTIA Security+ SY0-701 - 4.3', 'lecture', ['2.1'], true, 'Professor Messer'],
  ['6xUH0t6ugIM', 623, 'Threat Actors - CompTIA Security+ SY0-701 - 2.1', 'lecture', ['2.2'], true, 'Professor Messer'],
  ['9SD6DRCKZFU', 391, 'Phishing - CompTIA Security+ SY0-701 - 2.2', 'lecture', ['2.3', '2.5'], true, 'Professor Messer'],
  ['-eZs8wjjGGE', 366, 'An Overview of Malware - CompTIA Security+ SY0-701 - 2.4', 'lecture', ['2.5'], true, 'Professor Messer'],
  ['_jKylhJtPmI', 539, 'Hacking Websites with SQL Injection - Computerphile', 'lecture', ['2.4', '2.5'], false, 'Computerphile'],
  ['jrHRe9lSqqA', 657, 'What Is a Prompt Injection Attack?', 'lecture', ['2.6'], false, 'IBM Technology'],
  ['gUNXZMcd2jU', 1511, 'OWASP\'s Top 10 Ways to Attack LLMs: AI Vulnerabilities Exposed', 'lecture', ['2.6'], false, 'IBM Technology'],
  // Domain 3
  ['phLPKVx3Cl4', 782, 'What is Cloud Architecture? Understanding SaaS, IaaS, Cloud Delivery Models & More', 'lecture', ['3.1'], false, 'IBM Technology'],
  ['xTH1ZA_qUvA', 362, 'IPsec Explained', 'lecture', ['3.2'], false, 'PowerCert Animated Videos'],
  ['jHVe_SoQ7q0', 395, 'What is Security Service Edge (SSE)? SASE vs SSE vs VPN', 'lecture', ['3.2'], false, 'The CISO Perspective'],
  ['R0W0_gZCVzk', 354, 'Data Types and Classifications - CompTIA Security+ SY0-701 - 3.3', 'lecture', ['3.3'], true, 'Professor Messer'],
  ['8mGSwRScqIM', 735, 'Backups - CompTIA Security+ SY0-701 - 3.4', 'lecture', ['3.4'], true, 'Professor Messer'],
  // Domain 4
  ['Q8NUW3CZRvw', 379, 'CertMike Explains DMARC, DKIM and SPF', 'lecture', ['4.1'], false, 'Mike Chapple'],
  ['BJ2UMB4a04g', 517, 'Asset Management - CompTIA Security+ SY0-701 - 4.2', 'lecture', ['4.2'], true, 'Professor Messer'],
  ['9B0mtWk_AM0', 465, 'Vulnerability Scanning - CompTIA Security+ SY0-701 - 4.3', 'lecture', ['4.3', '4.4'], true, 'Professor Messer'],
  ['9RfsRn7m7OE', 268, 'What Is SIEM?', 'lecture', ['4.4'], false, 'IBM Technology'],
  ['MpIzA4fNWew', 269, 'Multifactor Authentication - CompTIA Security+ SY0-701 - 4.6', 'lecture', ['4.5'], true, 'Professor Messer'],
  ['k7ju95jDxFA', 435, 'What is SOAR (Security, Orchestration, Automation & Response)', 'lecture', ['4.6', '4.4'], false, 'IBM Technology'],
  ['xdUR8-_P3DU', 710, 'AI Agents for Cybersecurity: Enhancing Automation & Threat Detection', 'lecture', ['4.6'], false, 'IBM Technology'],
  ['X2UiMLxRdhE', 553, 'Incident Response - CompTIA Security+ SY0-701 - 4.8', 'lecture', ['4.7'], true, 'Professor Messer'],
  ['EDru1LTYDJw', 820, 'Log Data - CompTIA Security+ SY0-701 - 4.9', 'lecture', ['4.8'], true, 'Professor Messer'],
  // Domain 5
  ['5kY9kvzeWjA', 662, 'Security Policies - CompTIA Security+ SY0-701 - 5.1', 'lecture', ['5.1'], true, 'Professor Messer'],
  ['Ykx7t54y-oo', 553, 'Risk Analysis - CompTIA Security+ SY0-701 - 5.2', 'lecture', ['5.2'], true, 'Professor Messer'],
  ['HSZxjj1YAh8', 318, 'Agreement Types - CompTIA Security+ SY0-701 - 5.3', 'lecture', ['5.3'], true, 'Professor Messer'],
  ['WGXrbAh0LUI', 321, 'Privacy - CompTIA Security+ SY0-701 - 5.4', 'lecture', ['5.4'], true, 'Professor Messer'],
  ['wEMzVfwBiWY', 328, 'Penetration Tests - CompTIA Security+ SY0-701 - 5.5', 'lecture', ['5.5'], true, 'Professor Messer'],
  ['Yxv1suJYMI8', 222, 'MITRE ATT&CK® Framework', 'lecture', ['5.5'], false, 'mitrecorp (The MITRE Corporation)'],
  ['W_Npxwk4fbI', 405, 'Security Awareness - CompTIA Security+ SY0-701 - 5.6', 'lecture', ['5.6'], true, 'Professor Messer'],
  // Full-domain reviews
  ['Gxsjn7J97Lk', 6232, 'CompTIA Security+ SY0-701 - DOMAIN 5 COMPLETE', 'extra', ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6'], true, 'Inside Cloud and Security'],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
