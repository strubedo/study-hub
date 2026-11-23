// Curated free YouTube videos mapped to ENCOR topics.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
// Curated 2026-11-23: candidates found with `yt-dlp "ytsearch8:<query>" --flat-playlist`, then every id confirmed
// individually with `yt-dlp --print "%(id)s|%(duration)s|%(title)s|%(channel)s|%(upload_date)s" <url>` (all public);
// titles, durations and channels below are as yt-dlp reported them. Practice-question, "exam dump" and cert-mill uploads
// were not used, and CBT Nuggets was skipped. Topics are 350-401 v1.2 exam topic ids, mapped by content.
// legacy = recorded with older Cisco product names (DNA Center, vManage) or titled with an older ENCOR topic number;
// general protocol videos recorded for ENCOR v1.0 / v1.1 or CCNA are not marked legacy, because the content still applies.
const RAW = [
  // Orientation
  ['ZwAq6JKJouU', 378, 'Cisco ENCOR 350-401 v1.2 Exam Changes Explained | What You Need to Know', 'extra', [], false, 'Learn with Cisco'],
  // Domain 1: Architecture
  ['TPqIbH-hcBk', 1679, 'CCNP ENCOR // Stateful Switchover (SSO) // ENCOR 350-401 Complete Course', 'lecture', ['1.1'], false, "Jeremy's IT Lab"],
  ['vsIleIg_HIg', 2000, 'Cisco Catalyst SD-WAN Fundamentals', 'lecture', ['1.2'], false, 'Learn with Cisco'],
  ['A-pZOpQFQ_A', 744, 'Intro to Catalyst Center and SD-Access', 'lecture', ['1.3', '4.5'], false, 'Learn with Cisco'],
  ['AoOAb2RQVyM', 6955, 'QoS Deep Dive', 'lecture', ['1.4'], false, 'Kevin Wallace Training, LLC'],
  // Domain 2: Virtualization
  ['_S3greGajJA', 2320, 'Free CCNA | Virtualization & Cloud | Day 54 (part 1) | CCNA 200-301 Complete Course', 'lecture', ['2.1'], false, "Jeremy's IT Lab"],
  ['rLwWFBd_3Rw', 1782, 'VRF-lite // CCNP ENCOR 350-401 Complete Course', 'lecture', ['2.2'], false, "Jeremy's IT Lab"],
  ['anm84IVNBZU', 2103, 'Net Talk - GRE over IPsec', 'lecture', ['2.2'], false, 'Kevin Wallace Training, LLC'],
  ['r-OoAowoJ9s', 468, 'ENCOR 350-401 Topic 2.3.a - LISP', 'lecture', ['2.3'], false, 'Kevin Wallace Training, LLC'],
  ['SnnNrXtIc1c', 503, 'Cisco ENCOR (350-401): VXLANs', 'lecture', ['2.3'], false, 'Kevin Wallace Training, LLC'],
  // Domain 3: Infrastructure
  ['M7fFjFtN6jM', 1535, 'CCNP ENCOR // Dynamic Trunking Protocol (DTP) // ENCOR 350-401 Complete Course', 'lecture', ['3.1'], false, "Jeremy's IT Lab"],
  ['rSyP3u9v4-M', 2295, 'EtherChannel // CCNP ENCOR 350-401 Complete Course', 'lecture', ['3.1'], false, "Jeremy's IT Lab"],
  ['xCCudtsav30', 1217, 'CCNP ENCOR // Rapid STP (RSTP) // ENCOR 350-401 Complete Course', 'lecture', ['3.1'], false, "Jeremy's IT Lab"],
  ['vgw6Efre0Zw', 1365, 'CCNP ENCOR // MSTP Basics // ENCOR 350-401 Complete Course', 'lecture', ['3.1'], false, "Jeremy's IT Lab"],
  ['nIye27VjkmQ', 942, 'CCNP ENCOR // STP Root Guard & Loop Guard / BPDU Filter // ENCOR 350-401 Complete Course', 'lecture', ['3.1'], false, "Jeremy's IT Lab"],
  ['ty37POOCLRw', 1430, 'Comparing OSPF with EIGRP', 'lecture', ['3.2'], false, 'Kevin Wallace Training, LLC'],
  ['yLqmsomzmPo', 2431, 'OSPF Basics // CCNP ENCOR 350-401 Complete Course', 'lecture', ['3.2'], false, "Jeremy's IT Lab"],
  ['e6H7DHuonz8', 1557, 'BGP - Complete ENCOR (350-401) Exam Coverage', 'lecture', ['3.2'], false, 'Kevin Wallace Training, LLC'],
  ['kclENlbSdeY', 1582, 'Policy-Based Routing // CCNP ENCOR 350-401 Complete Course', 'lecture', ['3.2'], false, "Jeremy's IT Lab"],
  ['qGJaJx7OfUo', 2566, 'Free CCNA | NTP | Day 37 | CCNA 200-301 Complete Course', 'lecture', ['3.3'], false, "Jeremy's IT Lab"],
  ['kILDNs4KjYE', 1779, 'Free CCNA | NAT (part 2) | Day 45 | CCNA 200-301 Complete Course', 'lecture', ['3.3'], false, "Jeremy's IT Lab"],
  ['43WnpwQMolo', 2424, 'Free CCNA | First Hop Redundancy Protocols | Day 29 | CCNA 200-301 Complete Course', 'lecture', ['3.3', '1.1'], false, "Jeremy's IT Lab"],
  ['Gjt2L9jAYNA', 2564, 'Cisco Multicast Routing for CCNA, CCNP, and CCIE Candidates', 'lecture', ['3.3'], false, 'Kevin Wallace Training, LLC'],
  // Domain 4: Network Assurance
  ['RaQPSKQ4J5A', 1678, 'Free CCNA | Syslog | Day 41 | CCNA 200-301 Complete Course', 'lecture', ['4.1'], false, "Jeremy's IT Lab"],
  ['vWZefoGNk5g', 658, 'How SNMP Works | Network Fundamentals Part 24', 'lecture', ['4.1'], false, 'Network Direction'],
  ['wME3yyKozeU', 1786, 'ENCOR 350-401 Topic 4.4 - SPAN, RSPAN & ERSPAN', 'lecture', ['4.3'], true, 'Kevin Wallace Training, LLC'],
  ['alBvWV_JMw4', 876, 'ENCOR (350-401) Topic: IP SLA', 'lecture', ['4.4'], false, 'Kevin Wallace Training, LLC'],
  ['WjXL8jjX5yk', 223, 'Cisco Catalyst Center Overview | How-To Demo', 'lecture', ['4.5'], true, 'Cisco'],
  ['Y7sWgutz9Iw', 3901, "AIOps in Action: Catalyst Center's AI Capabilities", 'lecture', ['4.5'], false, 'Learn with Cisco'],
  ['BvPRkAQOrD8', 1056, 'Getting Started with NETCONF', 'lecture', ['4.6', '6.3'], false, 'Kevin Wallace Training, LLC'],
  ['qeanMXpcHIk', 2234, 'Enable and Verify RESTCONF with the CLI and Postman.', 'lecture', ['4.6', '6.5'], false, 'Keith Barker - The OG of IT'],
  // Domain 5: Security
  ['tXprJgbEWXg', 1233, 'Configure AAA Authentication | Cisco CCNA 200-301', 'lecture', ['5.1'], false, 'Keith Barker - The OG of IT'],
  ['dUttKY_CNXE', 2454, 'Free CCNA | Extended ACLs | Day 35 | CCNA 200-301 Complete Course', 'lecture', ['5.2'], false, "Jeremy's IT Lab"],
  ['bmqr_xpt6sc', 1754, 'REST API Authentication | CCNA 200-301 Day 61 (part 2)', 'lecture', ['5.3'], false, "Jeremy's IT Lab"],
  ['H2mfjZjNkqM', 1723, 'Next Generation Firewalls (NGFWs) | Cisco CCNA 200-301', 'lecture', ['5.4'], false, 'Keith Barker - The OG of IT'],
  ['xSmUclcOLJE', 722, 'Trustsec: Overview of Trustsec and Terminology', 'lecture', ['5.4'], false, 'Katherine McNamara'],
  // Domain 6: Automation and Artificial Intelligence
  ['9N6a-VLBa2I', 1233, 'Python Tutorial: Working with JSON Data using the json Module', 'lecture', ['6.1', '6.2'], false, 'Corey Schafer'],
  ['nohde2-QNJ4', 1736, 'Free CCNA | JSON, XML, & YAML | Day 60 | CCNA 200-301 Complete Course', 'lecture', ['6.2'], false, "Jeremy's IT Lab"],
  ['kESU4Y8DJ2A', 816, 'YANG Explained and Explored | Pyang | DevNet | CCNP', 'lecture', ['6.3'], false, 'Data Knox'],
  ['23rXLP3yovc', 3754, 'Exploring the DNA Center platform Northbound API', 'lecture', ['6.4'], true, 'Cisco DevNet'],
  ['a4zdgGzP4Q4', 986, 'Interacting with the vManage REST API ~ Video 7.', 'lecture', ['6.4'], true, 'Cisco DevNet'],
  ['Luei0p-2h10', 1905, 'Free CCNA | REST APIs | Day 61 | CCNA 200-301 Complete Course', 'lecture', ['6.5'], false, "Jeremy's IT Lab"],
  ['32VZDHCrU-4', 518, 'ENCOR (350-401) Topic 6.6 - Embedded Event Manager (EEM)', 'lecture', ['6.6'], false, 'Kevin Wallace Training, LLC'],
  ['Kog9gHTjALI', 1292, 'Free CCNA | Ansible, Puppet, & Chef | Day 63 (part 1) | CCNA 200-301 Complete Course', 'lecture', ['6.7'], false, "Jeremy's IT Lab"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
