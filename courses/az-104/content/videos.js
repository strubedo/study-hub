// Curated free YouTube videos mapped to AZ-104 topics.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
// Curated 2026-11-23: candidates found with `yt-dlp "ytsearch8:<query>" --flat-playlist`, then every id confirmed
// individually with `yt-dlp --print "%(id)s|%(duration)s|%(title)s|%(channel)s|%(upload_date)s" <url>` (all public);
// titles, durations and channels below are as yt-dlp reported them. Practice-question, "exam dump" and cert-mill uploads
// were not used, and CBT Nuggets was skipped. Topics are the AZ-104 (skills measured October 26, 2023) topic ids, mapped by content.
// legacy = uploaded before the Microsoft Entra ID rename (July 2023), so it may say Azure AD or show an older portal layout.
// The Microsoft Learn "AZ-104 | Episode N" series carries a 2026-05-11 upload date on YouTube and uses current names.
const RAW = [
  // Orientation and full courses
  ['0Knf9nub4-k', 14494, 'AZ-104 Administrator Associate Study Cram v2', 'extra', [], false, "John Savill's Technical Training"],
  ['10PbGbTUSAg', 40585, 'Azure Administrator Certification (AZ-104) - Full Course to PASS the Exam', 'extra', [], true, 'freeCodeCamp.org'],
  // Domain 1: Identities and governance
  ['UP2kzp14WA0', 603, 'Beginners Guide to Entra ID', 'lecture', ['1.1'], false, "John Savill's Technical Training"],
  ['UUkshXoGOD8', 2290, 'Create, configure, and manage identities | AZ-104 | Episode 3', 'lecture', ['1.1'], false, 'Microsoft Learn'],
  ['rA8TvhNcCvQ', 401, 'How to enable and configure SSPR in Entra ID', 'lecture', ['1.1'], true, 'Microsoft Security'],
  ['megA6BPpYqo', 8919, 'Azure Master Class v3 - Part 2 - Identity', 'lecture', ['1.1', '1.2'], false, "John Savill's Technical Training"],
  ['uk8xwyudb1k', 1388, 'Secure your Azure resources with Azure role-based access control (Azure RBAC) | AZ-104 | Episode 6', 'lecture', ['1.2'], false, 'Microsoft Learn'],
  ['t-i4XrygWCc', 7922, 'Azure Master Class v3 - Part 3 - Governance', 'lecture', ['1.3'], false, "John Savill's Technical Training"],
  ['XGL-8ZaBU4s', 794, 'Azure Policy initiatives | AZ-104 | Episode 5', 'lecture', ['1.3'], false, 'Microsoft Learn'],
  ['7w88KBVesPI', 615, 'AZ-900 Episode 37 | Azure Cost Management', 'lecture', ['1.3'], true, 'Adam Marczak - Azure for Everyone'],
  // Domain 2: Storage
  ['YnFkgLxqrKQ', 9518, 'Azure Master Class v3 - Part 5 - Storage', 'lecture', ['2.1', '2.2', '2.3'], false, "John Savill's Technical Training"],
  ['4R0amqEvbtQ', 1179, 'Configure Azure Storage security | AZ-104 | Episode 18', 'lecture', ['2.1'], false, 'Microsoft Learn'],
  ['NKmq1t41Zys', 1909, 'Configure storage accounts | AZ-104 | Episode 16', 'lecture', ['2.2'], false, 'Microsoft Learn'],
  ['eu7tlLbid8I', 959, 'Configure Azure Blob Storage | AZ-104 | Episode 17', 'lecture', ['2.3'], false, 'Microsoft Learn'],
  ['HucM0tmtKCk', 479, 'Configure Azure Files | AZ-104 | Episode 19', 'lecture', ['2.3'], false, 'Microsoft Learn'],
  // Domain 3: Compute
  ['VDCAJIGqHZU', 2153, 'Authoring and deploying Azure resources with Bicep | Azure Friday', 'lecture', ['3.1'], true, 'Microsoft Azure'],
  ['KRBFVqgxyo4', 7308, 'Azure Master Class v3 - Part 7 - VMs and VMSS', 'lecture', ['3.2'], false, "John Savill's Technical Training"],
  ['Sz6yhVDs4yY', 1647, 'Configure virtual machine availability | AZ-104 | Episode 21', 'lecture', ['3.2'], false, 'Microsoft Learn'],
  ['YMpytDVi6z0', 1203, 'Configure Azure Container Instances | AZ-104 | Episode 24', 'lecture', ['3.3'], false, 'Microsoft Learn'],
  ['0HwQfsa03K8', 328, 'The ONLY Azure Container Apps video you need in 2024', 'lecture', ['3.3'], false, 'Microsoft DevRadio'],
  ['QnIRaSaq5Wg', 1831, 'Configure Azure App Service plans | AZ-104 | Episode 22', 'lecture', ['3.4'], false, 'Microsoft Learn'],
  ['gT-N7Dn2uGw', 1399, 'Configure Azure App Service | AZ-104 | Episode 23', 'lecture', ['3.4'], false, 'Microsoft Learn'],
  // Domain 4: Networking
  ['nDtCSQyG_I8', 10326, 'Azure Master Class v3 - Part 6 - Networking', 'lecture', ['4.1', '4.2', '4.3'], false, "John Savill's Technical Training"],
  ['PLwE82PNEpg', 1438, 'Configure virtual networks | AZ-104 | Episode 8', 'lecture', ['4.1'], false, 'Microsoft Learn'],
  ['gxvdN8hZRtQ', 1208, 'Configure Azure Virtual Network peering | AZ-104 | Episode 11', 'lecture', ['4.1'], false, 'Microsoft Learn'],
  ['EReu507KLUs', 1364, 'Manage and control traffic flow in your Azure deployment with routes | AZ-104 | Episode 12', 'lecture', ['4.1'], false, 'Microsoft Learn'],
  ['6Gr17HqHfUw', 1731, 'Configure network security groups | AZ-104 | Episode 9', 'lecture', ['4.2'], false, 'Microsoft Learn'],
  ['lZ_u57gJBNo', 2389, 'Azure Bastion Deep Dive', 'lecture', ['4.2'], true, "John Savill's Technical Training"],
  ['2meCCu8fHJc', 958, 'Host your domain on Azure DNS | AZ-104 | Episode 10', 'lecture', ['4.3'], false, 'Microsoft Learn'],
  ['s5v20z0jXoQ', 1040, 'Introduction to Azure Load Balancer | AZ-104 | Episode 13', 'lecture', ['4.3'], false, 'Microsoft Learn'],
  ['wdzmWO27Ubo', 724, 'Introduction to Azure Network Watcher | AZ-104 | Episode 15', 'lecture', ['4.1', '5.1'], false, 'Microsoft Learn'],
  // Domain 5: Monitor and maintain
  ['p7Kw1YJl2S4', 1543, 'Introduction to Azure Monitor | AZ-104 | Episode 27', 'lecture', ['5.1'], false, 'Microsoft Learn'],
  ['tkNHafWEKKQ', 1436, 'Azure Monitor Logs Update', 'lecture', ['5.1'], false, "John Savill's Technical Training"],
  ['85Xxj5FhTk0', 193, 'How to Query Log Analytics', 'lecture', ['5.1'], false, 'Microsoft Azure'],
  ['cHH4RkL-9Dg', 1353, 'Microsoft Azure Monitor - Alert Processing Rules', 'lecture', ['5.1'], true, "John Savill's Technical Training"],
  ['k4M8WxzTDQg', 909, 'Introduction to Azure Backup | AZ-104 | Episode 25', 'lecture', ['5.2'], false, 'Microsoft Learn'],
  ['hh2qRBv_BAI', 676, 'Protect your virtual machines by using Azure Backup | AZ-104 | Episode 26', 'lecture', ['5.2'], false, 'Microsoft Learn'],
  ['tGr1KqnuxeM', 8870, 'Azure Master Class v3 - Part 4 - Resiliency', 'lecture', ['5.2'], false, "John Savill's Technical Training"],
  ['IJDL7c2dHXc', 2054, 'Resiliency and recovery with Azure Backup and Site Recovery | BRK146', 'lecture', ['5.2'], false, 'Microsoft Events'],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
