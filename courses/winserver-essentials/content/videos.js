// Curated free YouTube videos mapped to course topics. Ids, durations, titles and channels come from yt-dlp flat search (2026-10-30); upload dates were not available.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel. legacy=true marks videos whose title names Windows Server 2019/2022 or older.
const RAW = [
  ["nvITWXI91O8", 255, "What's New in Windows Server 2025?", "lecture", ['1.1'], false, "Indigo Software"],
  ["Br_n6zMPEcQ", 1665, "Learn to Install & Configure Windows Server 2025 in 30mins", "lecture", ['1.2'], false, "Andy Malone MVP"],
  ["_steLmMvk4I", 1261, "Hotpatching and update management for Windows Server with Azure Arc", "lecture", ['1.3'], false, "ITOpsTalk"],
  ["ADakXsa8ry8", 425, "How to create an Active Directory domain (Windows Server 2025)", "lecture", ['2.1'], false, "Danny Moran"],
  ["1VQBIx5SqOQ", 839, "Windows Server 2025 Active Directory", "lecture", ['2.1'], false, "ittaster"],
  ["Tum6B3PDPbk", 3256, "What's new in Active Directory for Windows Server 2025", "extra", ['2.1'], false, "ITOpsTalk"],
  ["udXNagC43ow", 1799, "Bring Active Directory to the next level with Windows Server 2025", "extra", ['2.1'], false, "ITOpsTalk"],
  ["Q4I2lKHboDw", 3116, "Understanding Active Directory and Group Policy", "extra", ['2.1', '2.3'], false, "Kevin Brown"],
  ["rEhTzP-ScBo", 1438, "Learn Microsoft Group Policy the Easy Way!", "lecture", ['2.3'], false, "Andy Malone MVP"],
  ["q_TbJSVndv0", 1447, "Windows Server Basic Admin Skills DNS", "lecture", ['3.1'], false, "Andy Malone MVP"],
  ["iow24q9vqgU", 977, "Windows Server Basic Admin Skills. DHCP", "lecture", ['3.1'], false, "Andy Malone MVP"],
  ["iAf3nb_nToQ", 666, "Windows Server 2025 File and Folder Sharing Demonstration and Tutorial", "lecture", ['3.2'], false, "Tech Pub"],
  ["aig32E_0VQY", 587, "How to Create Scale Out File Server | Windows Server 2025", "extra", ['4.1'], false, "Techi Jack"],
  ["i24B8yPykbY", 411, "Install and configure Hyper-V on Windows Server 2025 in less than 7 minutes", "lecture", ['4.2'], false, "ITOpsTalk"],
  ["jCpXRxKgh34", 1918, "Windows Server 2025 Virtual Networking in Hyper-V: What You Need to Know", "extra", ['4.2'], false, "Mike in the Cloud"],
  ["fB1UVuNu7MI", 1190, "#59 Windows Firewall with Advanced Security Explained | Windows Server 2025 Step-by-Step Guide", "lecture", ['5.1'], false, "Labs Hands On"],
  ["MxHy2WB0EcA", 625, "Local Administrator Password Solution: New features built into Windows Server 2025", "lecture", ['5.1'], false, "ITOpsTalk"],
  ["9BPHJChumAQ", 898, "Microsoft LAPS The Ultimate Guide", "extra", ['5.1'], false, "Andy Malone MVP"],
  ["oYyPddhJMh4", 1757, "Credential Guard, Windows Server 2025", "lecture", ['5.1'], false, "Fernanda"],
  ["urRWkyzRI78", 345, "How to Set up Windows Event Log Forwarding [Step-by-Step]", "lecture", ['5.2'], false, "ATA Learning"],
  ["13OQ4fq99OQ", 1982, "Windows Event Forwarding at Scale", "extra", ['5.2'], false, "Tellaro"],
  ["SxlsDOddBXI", 1144, "Windows Performance and Monitoring: Performance Monitor Tutorial", "lecture", ['5.2'], false, "Darien's Tips"],
  ["eTMycVSahxw", 338, "How to Windows Server Backup | How to Backup Windows Server 2025 (Full System Image)", "lecture", ['5.2'], false, "Indigo Software"],
  ["hK7l3eAYpyY", 255, "How to Restore Active Directory from Windows Server Backup", "lecture", ['5.2'], false, "Tech Pub"],
  ["MdKCMQPJalc", 473, "95. How to Perform Bare Metal Backup on Windows Server 2022", "extra", ['5.2'], true, "MSFT WebCast"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
