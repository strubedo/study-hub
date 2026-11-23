// Curated free YouTube videos mapped to CCNA Automation topics.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
// Curated 2026-11-23: candidates found with `yt-dlp "ytsearch:<query>" --flat-playlist`, then every id confirmed
// individually with `yt-dlp --print "%(id)s|%(duration)s|%(title)s|%(channel)s|%(upload_date)s" <url>`; titles,
// durations and channels below are as yt-dlp reported them. Practice-question and "exam dump" uploads were not used.
// Topics are 200-901 v1.1 exam topic ids, mapped by content. legacy = recorded in the DevNet Associate era with
// older Cisco product names or sandbox details (DNA Center is now Catalyst Center; always-on sandboxes now need a
// reservation). General videos on Git, Python, HTTP and networking are not marked legacy.
const RAW = [
  // Orientation
  ['dCQxMWijfHE', 221, 'From DevNet Associate to CCNA Automation: What You Need to Know for 2026', 'extra', [], false, 'Learn with Cisco'],
  // Domain 1
  ['_e0-3StBC6c', 671, 'Comparing XML, JSON, and YAML (DevNet)', 'lecture', ['1.1'], true, 'Rowell Dionicio'],
  ['nohde2-QNJ4', 1736, 'Free CCNA | JSON, XML, & YAML | Day 60 | CCNA 200-301 Complete Course', 'lecture', ['1.1'], false, "Jeremy's IT Lab"],
  ['B8ERfAbxiUM', 2572, 'HUT 8 Techtorial - DevNet Associate DEVASC 200-901: Parsing JSON Data with Python 3 - Part I', 'lecture', ['1.2'], true, 'Travis Bonfigli'],
  ['B1j6k2j2eJg', 910, 'Test-Driven Development In Python // The Power of Red-Green-Refactor', 'lecture', ['1.3'], false, 'ArjanCodes'],
  ['NKW4BH3trXQ', 180, 'Lean vs Agile vs Waterfall: Choosing the Right Workflow for Your Team', 'lecture', ['1.4'], false, 'Eleken'],
  ['DUg2SWWK18I', 253, 'MVC Explained in 4 Minutes', 'lecture', ['1.6'], false, 'Web Dev Simplified'],
  ['-oLDJ2dbadA', 408, 'The Observer Pattern Explained and Implemented in Java | Behavioral Design Patterns | Geekific', 'lecture', ['1.6'], false, 'Geekific'],
  ['7OoGuLH9IwU', 3126, 'Git, GitHub and source control: Is this even for network engineers? Hank Preston Explains: Part 1', 'lecture', ['1.7', '1.8'], false, 'David Bombal'],
  ['e9lnsKot_SQ', 258, 'How Git Works: Explained in 4 Minutes', 'lecture', ['1.7', '1.8'], false, 'ByteByteGo'],
  // Domain 2
  ['Luei0p-2h10', 1905, 'Free CCNA | REST APIs | Day 61 | CCNA 200-301 Complete Course', 'lecture', ['2.1', '2.4', '2.6'], false, "Jeremy's IT Lab"],
  ['OA-s-eKtpYg', 3480, 'DEVNET 1001 - Coding 101: How to Call REST APIs from a REST Client and Python', 'lecture', ['2.1', '2.9'], true, 'Cisco DevNet'],
  ['_6udjMB8Oxs', 568, 'Webhooks for Delivering Network Alerts | Cisco Meraki', 'lecture', ['2.2', '3.2'], false, 'Cisco DevNet'],
  ['qmpUfWN7hh4', 306, 'HTTP Status Codes Explained In 5 Minutes', 'lecture', ['2.4', '2.5'], false, 'ByteByteGo'],
  ['bmqr_xpt6sc', 1754, 'REST API Authentication | CCNA 200-301 Day 61 (part 2)', 'lecture', ['2.7'], false, "Jeremy's IT Lab"],
  ['ZV5yTm4pT8g', 272, 'OAuth 2 Explained In Simple Terms', 'lecture', ['2.7'], false, 'ByteByteGo'],
  ['tb8gHvYlCFs', 1500, 'Python Requests Tutorial: Request Web Pages, Download Images, POST Data, Read JSON, and More', 'lecture', ['2.9'], false, 'Corey Schafer'],
  // Domain 3
  ['GDbQl82tsks', 1070, 'Python Scripting with a Cisco SDK from Cisco Certified DevNet Associate (200-901) | Best of ITProTV', 'lecture', ['3.1'], true, 'ACI Learning'],
  ['ZAaz608uwyo', 701, 'Quick Start to Meraki Dashboard API v1, DevNet Snack Minute Episode 2', 'lecture', ['3.2', '3.9'], true, 'Cisco DevNet'],
  ['nKgV5dDoZgU', 602, 'Cisco ACI Automation Part 2: APIC API Explained - Create Tenants #ciscoaci #devnet', 'lecture', ['3.2'], false, 'NetworkEvolution'],
  ['OYy1pByYfrI', 542, 'Accessing vManage SDWAN REST API documentation ~ Video 6', 'lecture', ['3.2'], true, 'Cisco DevNet'],
  ['WJTEvxGDftM', 962, 'Cisco Network Services Orchestrator Architecture: A Comprehensive Overview', 'lecture', ['3.2'], true, 'Cisco'],
  ['i5QSWtLyyEg', 1457, 'Cisco USC Manager XML API Introduction and Overview', 'lecture', ['3.3'], true, 'Cisco DevNet'],
  ['5ANR1KzC2Qs', 534, 'Cisco Intersight Python SDK', 'lecture', ['3.3', '3.1'], true, 'Cisco Compute'],
  ['yZQjoe5XUYE', 1098, '[How To] Building a Simple Webex Chatbot with Python Websockets & OpenWeather APIs', 'lecture', ['3.4'], true, '0x2142 - Networking Nonsense'],
  ['pnlUrzmX3tk', 662, 'Cisco Modeling Labs and DevNet Sandbox - The easy way to learn about network automation.', 'lecture', ['3.7', '5.3'], true, 'Cisco DevNet'],
  ['KbhLvLO-PhI', 1347, 'Cisco DevNet Code Exchange', 'lecture', ['3.7'], true, 'Cisco DevNet'],
  ['cooE3wZ7O4I', 2690, 'YANG, NETCONF, RESTCONF Demos. Which Cisco devices are supported? (Part 1)', 'lecture', ['3.6', '3.8', '5.10'], true, 'David Bombal'],
  // Domain 4
  ['ddDJxFnv-qs', 292, 'CI/CD Explained in 5 Minutes', 'lecture', ['4.4', '5.4'], false, 'TechWorld with Nana'],
  ['6tNS--WetLI', 2352, 'Python Tutorial: Unit Testing Your Code with the unittest Module', 'lecture', ['4.5', '1.3'], false, 'Corey Schafer'],
  ['UHo5p4-Q094', 3633, 'Dockerfile Creation | NetGru', 'lecture', ['4.6', '4.7'], false, 'Cisco DevNet'],
  ['pg19Z8LL06w', 4059, 'Docker Crash Course for Absolute Beginners [NEW]', 'lecture', ['4.7', '4.6'], false, 'TechWorld with Nana'],
  ['xo5V9g9joFs', 798, 'Proxy vs Reverse Proxy vs Load Balancer | Simply Explained', 'lecture', ['4.9'], false, 'TechWorld with Nana'],
  ['wUaeKEl1RCw', 898, 'OWASP Top 10 Web Application Security Risks', 'lecture', ['4.10', '4.8'], false, 'Telusko'],
  ['uQE_4Q-HZZw', 1486, 'How To Write Bash Scripts In Linux - Complete Guide (Part 3 - Variables)', 'lecture', ['4.11', '5.9'], false, 'Learn Linux TV'],
  // Domain 5
  ['4tsBgMCPVuc', 2006, 'Intro to Network Automation | CCNA 200-301 Day 59 (part 1)', 'lecture', ['5.1', '5.5'], false, "Jeremy's IT Lab"],
  ['7HhWCeXDTpA', 1699, 'Free CCNA | Software-Defined Networking | Day 62 | CCNA 200-301 Complete Course', 'lecture', ['5.2', '6.5'], false, "Jeremy's IT Lab"],
  ['1Ba_BRyHxSo', 1290, 'pyATS Tutorial for Beginners | Getting started with Genie & pyATS', 'lecture', ['5.3'], false, 'Roger Perkin | Network Automation Consultant'],
  ['ZafBNAu5jU8', 709, 'How to use GitLab to implement your CI/CD pipeline, DevNet Snack Minute Episode 20', 'lecture', ['5.4', '4.4'], true, 'Cisco DevNet'],
  ['VAwUaffejWU', 1349, 'Terraform | CCNA 200-301 Day 63 (part 2)', 'lecture', ['5.5', '5.6'], false, "Jeremy's IT Lab"],
  ['Kog9gHTjALI', 1292, 'Free CCNA | Ansible, Puppet, & Chef | Day 63 (part 1) | CCNA 200-301 Complete Course', 'lecture', ['5.6'], false, "Jeremy's IT Lab"],
  ['OWKPxAgh9DU', 902, 'get started with Ansible Network Automation (FREE cisco router lab)', 'lecture', ['5.8', '5.6'], false, 'NetworkChuck'],
  ['BvPRkAQOrD8', 1056, 'Getting Started with NETCONF', 'lecture', ['5.10', '5.1'], false, 'Kevin Wallace Training, LLC'],
  ['kESU4Y8DJ2A', 816, 'YANG Explained and Explored | Pyang | DevNet | CCNP', 'lecture', ['5.11'], false, 'Data Knox'],
  ['F1van9nShjA', 590, 'git diff: everything you need to know', 'lecture', ['5.12', '1.8'], false, 'Andrew Burgess'],
  // Domain 6
  ['cjFzOnm6u1g', 1424, 'Free CCNA | VLANs (Part 1) | Day 16 | CCNA 200-301 Complete Course', 'lecture', ['6.1'], false, "Jeremy's IT Lab"],
  ['bQ8sdpGQu8c', 1734, 'Free CCNA | Subnetting (Part 1) | Day 13 | CCNA 200-301 Complete Course', 'lecture', ['6.2'], false, "Jeremy's IT Lab"],
  ['aHwAm8GYbn8', 1860, 'Free CCNA | Routing Fundamentals | Day 11 (part 1) | CCNA 200-301 Complete Course', 'lecture', ['6.2', '6.3'], false, "Jeremy's IT Lab"],
  ['Ep1QW-wOmgc', 862, 'Data Plane vs. Control Plane', 'lecture', ['6.5'], false, 'IBM Technology'],
  ['e6-TaH5bkjo', 609, 'DHCP Explained - Dynamic Host Configuration Protocol', 'lecture', ['6.6'], false, 'PowerCert Animated Videos'],
  ['FTUV0t6JaDA', 266, 'NAT Explained - Network Address Translation', 'lecture', ['6.6'], false, 'PowerCert Animated Videos'],
  ['HXu0Ifj0oWU', 1761, 'Free CCNA | SNMP | Day 40 | CCNA 200-301 Complete Course', 'lecture', ['6.6'], false, "Jeremy's IT Lab"],
  ['qGJaJx7OfUo', 2566, 'Free CCNA | NTP | Day 37 | CCNA 200-301 Complete Course', 'lecture', ['6.6'], false, "Jeremy's IT Lab"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
