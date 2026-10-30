// Curated free YouTube videos mapped to AZ-900 topics. Ids, durations, titles and channels come from yt-dlp (2026-10-30); upload dates were not available. legacy=true: Savill's 2022 cram and May 2022 Arc video (pre-dating the current outline).
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
const RAW = [
  ["5abffC-K40c", 30109, "Microsoft Azure Fundamentals Certification Course (AZ-900) UPDATED – Pass the exam in 8 hours!", "extra", ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '2.4', '3.1', '3.2', '3.3', '3.4'], false, "freeCodeCamp.org"],
  ["tQp1YkB2Tgs", 12347, "AZ-900 Azure Fundamentals Study Cram - 2022 Edition! - OVER ONE MILLION VIEWS!", "extra", ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '2.4', '3.1', '3.2', '3.3', '3.4'], true, "John Savill's Technical Training"],
  ["Pt9LelJ0fL0", 580, "AZ-900 Episode 1 | Cloud Computing and Vocabulary | Microsoft Azure Fundamentals Full Course", "lecture", ['1.1'], false, "Adam Marczak - Azure for Everyone"],
  ["JRbhGzGzoOA", 924, "Benefits of High Availability and Scalability in the Cloud - AZ-900 Certification Course", "lecture", ['1.2'], false, "John Savill's Technical Training"],
  ["9CVBohl6w0Q", 478, "AZ-900 Episode 5 | IaaS vs PaaS vs SaaS cloud service models | Microsoft Azure Fundamentals Course", "lecture", ['1.3'], false, "Adam Marczak - Azure for Everyone"],
  ["C-nNw1mGwzE", 891, "AZ-900 Episode 7 | Geographies, Regions & Availability Zones | Microsoft Azure Fundamentals Course", "lecture", ['2.1'], false, "Adam Marczak - Azure for Everyone"],
  ["bPdDiEtCVhM", 389, "Benefits and Usage of Management Groups - AZ-900 Certification Course", "lecture", ['2.1'], false, "John Savill's Technical Training"],
  ["yKDSAYDLGrI", 2071, "Benefits and Usage of Core Compute Resources - AZ-900 Certification Course", "lecture", ['2.2'], false, "John Savill's Technical Training"],
  ["5NMcM4zJPM4", 1033, "AZ-900 Episode 10 | Networking Services | Virtual Network, VPN Gateway, CDN, Load Balancer, App GW", "lecture", ['2.2'], false, "Adam Marczak - Azure for Everyone"],
  ["AI2XoRFwqYE", 2109, "Benefits and Usage of Storage Account Resources - AZ-900 Certification Course - December 2024 Update", "lecture", ['2.3'], false, "John Savill's Technical Training"],
  ["DFwERh9Xxk0", 749, "Functionality of Conditional Access, MFA and SSO - AZ-900 Certification Course", "lecture", ['2.4'], false, "John Savill's Technical Training"],
  ["qFoHDTxkQII", 2081, "Azure Role-Based Access Control Deep Dive", "extra", ['2.4'], false, "John Savill's Technical Training"],
  ["FoBjC9CAF08", 348, "Functionality and Usage of Azure Cost Management - AZ-900 Certification Course", "lecture", ['3.1'], false, "John Savill's Technical Training"],
  ["7w88KBVesPI", 615, "AZ-900 Episode 37 | Azure Cost Management", "lecture", ['3.1'], false, "Adam Marczak - Azure for Everyone"],
  ["J40eJR4qQ0w", 753, "AZ-900 Episode 30 | Azure Resource Tags", "lecture", ['3.1'], false, "Adam Marczak - Azure for Everyone"],
  ["rMKmbZ1SYQg", 1808, "Master the Azure Pricing Calculator", "extra", ['3.1'], false, "John Savill's Technical Training"],
  ["9WO4EBgUJXk", 875, "AZ-900 Episode 31 | Azure Policy", "lecture", ['3.2'], false, "Adam Marczak - Azure for Everyone"],
  ["eDH20Ve0eI0", 478, "AZ-900 Episode 29 | Azure Resource Locks", "lecture", ['3.2'], false, "Adam Marczak - Azure for Everyone"],
  ["U5nAmJv_Cn4", 501, "Understand How Microsoft Purview Secures and Governs Your Entire Data Estate", "lecture", ['3.2'], false, "Microsoft Developer"],
  ["4wGns611G4w", 4337, "Anatomy of Azure Policy", "extra", ['3.2'], false, "John Savill's Technical Training"],
  ["8JHY0xPssb8", 629, "AZ-900 Episode 19 | Azure Tools | Azure Portal, CLI, PowerShell & Cloud Shell", "lecture", ['3.3'], false, "Adam Marczak - Azure for Everyone"],
  ["loxcA5MUf-I", 400, "Functionality and Usage of ARM Templates - AZ-900 Certification Course", "lecture", ['3.3'], false, "John Savill's Technical Training"],
  ["cW6_rvDYSHg", 471, "Describe the Purpose of Azure Arc - AZ-900 Certification Course - May 2022 New", "lecture", ['3.3'], true, "John Savill's Technical Training"],
  ["JDx8blnt5Aw", 881, "Azure Arc | On-prem + Multi-cloud Management", "extra", ['3.3'], false, "Microsoft Mechanics"],
  ["58_6MkB2znI", 377, "AZ-900 Episode 20 | Azure Advisor", "lecture", ['3.4'], false, "Adam Marczak - Azure for Everyone"],
  ["M1xPK4T4Vls", 178, "Functionality and Usage of Azure Service Health - AZ-900 Certification Course", "lecture", ['3.4'], false, "John Savill's Technical Training"],
  ["v68jL-l9Fww", 619, "Functionality and Usage of Azure Monitor - AZ-900 Certification Course", "lecture", ['3.4'], false, "John Savill's Technical Training"],
  ["A0jAeGf2zUQ", 2066, "Azure Application Insights Tutorial | Amazing telemetry service", "extra", ['3.4'], false, "Adam Marczak - Azure for Everyone"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
