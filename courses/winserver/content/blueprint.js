// Official Microsoft AZ-802 "Administering Windows Server" skills measured.
// Source: learn.microsoft.com/credentials/certifications/resources/study-guides/az-802 (checked 2026-10-29).
// AZ-802 replaced AZ-800 + AZ-801, which retired 2026-09-30 5:00 PM CST.
// Microsoft publishes weight ranges; `weight` is the midpoint (the exam builder normalises).

export const EXAM = {
  code: 'AZ-802',
  name: 'Administering Windows Server',
  certification: 'Microsoft Certified: Windows Server Administrator Associate',
  minutes: 120,
  questionsApprox: '40-60',
  passingScore: 700,
  scoreScale: '1-1000',
  replaces: 'AZ-800 and AZ-801 (retired 2026-09-30)',
  passingScoreNote: 'Microsoft requires 700 or greater. The score is scaled, not a percentage.',
};

export const DOMAINS = [
  {
    id: 1,
    weight: 22.5,
    weightRange: '20-25%',
    title: 'Deploy and manage AD DS',
    short: 'AD DS',
    topics: [
      { id: '1.1', verb: 'Deploy and manage', title: 'AD DS domain controllers', sub: ['Deploy and manage domain controllers locally', 'Deploy and manage domain controllers in Azure', 'Deploy Read-Only Domain Controllers (RODCs)', 'Manage account security on an RODC', 'Manage and troubleshoot Flexible Single-Master Operations (FSMO) roles'] },
      { id: '1.2', verb: 'Configure and manage', title: 'multi-site, multi-domain, and multi-forest environments', sub: ['Configure domain and forest trust relationships', 'Configure and manage AD DS sites', 'Configure and manage AD DS replication'] },
      { id: '1.3', verb: 'Create and manage', title: 'AD DS security principals', sub: ['Create and manage AD DS users and groups', 'Manage users and groups in multi-domain or multi-forest environments', 'Select and manage service accounts'] },
      { id: '1.4', keepCase: true, verb: 'Manage', title: 'Windows Server by using domain-based Group Policies', sub: ['Implement Group Policy', 'Implement Group Policy preferences'] },
    ],
  },
  {
    id: 2,
    weight: 12.5,
    weightRange: '10-15%',
    title: 'Manage Windows Server instances and workloads in a hybrid environment',
    short: 'Hybrid management',
    topics: [
      { id: '2.1', verb: 'Configure', title: 'remote management for Windows Server instances in a hybrid environment', sub: ['Deploy and manage Windows Admin Center on-premises and in the Azure portal', 'Configure remote management by using PowerShell, including double-hop and Just Enough Administration (JEA)', 'Configure and manage remote Secure Shell (SSH)', 'Configure and manage remote desktop access'] },
      { id: '2.2', keepCase: true, verb: 'Manage', title: 'Windows Server instances and workloads by using Azure services in a hybrid environment', sub: ['Implement Azure Arc-enabled Windows Server instances', 'Implement device configuration by using Azure Arc', 'Deploy Azure services with virtual machine (VM) extensions on non-Azure machines', 'Manage updates by using Azure Update Manager', 'Create and run Azure Automation runbooks'] },
    ],
  },
  {
    id: 3,
    weight: 12.5,
    weightRange: '10-15%',
    title: 'Manage virtual machines',
    short: 'Virtual machines',
    topics: [
      { id: '3.1', keepCase: true, verb: 'Manage', title: 'Hyper-V and guest VMs', sub: ['Enable Enhanced Session Mode', 'Manage VMs remotely by using PowerShell, PowerShell Direct, and SSH Direct for Linux guests', 'Enable nested virtualization', 'Configure VM memory settings', 'Configure integration services', 'Configure device assignment', 'Configure GPU partitioning', 'Manage VM checkpoints', 'Implement high availability for Hyper-V VMs', 'Manage Hyper-V virtual hard disks', 'Configure Hyper-V network adapter', 'Configure network interface card (NIC) teaming on the Hyper-V host and VM', 'Configure Hyper-V Virtual Switch', 'Configure Hyper-V Replica'] },
      { id: '3.2', keepCase: true, verb: 'Manage', title: 'Windows Server VMs in Azure', sub: ['Manage storage for Windows Server VMs in Azure', 'Manage capacity, including resizing and VM scale sets', 'Manage availability sets and zones', 'Manage just-in-time (JIT) VM access and Azure Bastion', 'Manage Azure Virtual Machines network configuration'] },
    ],
  },
  {
    id: 4,
    weight: 12.5,
    weightRange: '10-15%',
    title: 'Implement and manage an on-premises and hybrid networking infrastructure',
    short: 'Networking',
    topics: [
      { id: '4.1', verb: 'Implement', title: 'on-premises and hybrid name resolution', sub: ['Integrate domain name system (DNS) with AD DS', 'Create and manage DNS zones and records', 'Configure DNS forwarding and conditional forwarding', 'Configure DNS name resolution in a hybrid environment', 'Implement DNS policies', 'Implement DNS security extensions (DNSSEC)'] },
      { id: '4.2', verb: 'Manage', title: 'IP addressing in on-premises and hybrid scenarios', sub: ['Implement and configure the Dynamic Host Configuration Protocol (DHCP) server role', 'Troubleshoot IP addressing in hybrid environments', 'Create and manage DHCP scopes', 'Create IP reservations', 'Implement high availability for DHCP'] },
    ],
  },
  {
    id: 5,
    weight: 17.5,
    weightRange: '15-20%',
    title: 'Manage storage and file services',
    short: 'Storage & files',
    topics: [
      { id: '5.1', keepCase: true, verb: 'Configure and manage', title: 'Azure Files', sub: ['Create and manage Azure file shares', 'Manage permissions for Azure file shares', 'Configure and manage Azure File Sync', 'Monitor Azure File Sync', 'Migrate Distributed File System (DFS) to Azure File Sync', 'Migrate from file shares to Azure Files'] },
      { id: '5.2', keepCase: true, verb: 'Configure and manage', title: 'Windows Server file shares', sub: ['Configure access to Windows Server file shares', 'Configure File Server Resource Manager (FSRM)', 'Implement and configure DFS', 'Configure Server Message Block (SMB) over QUIC', 'Configure SMB settings and management'] },
      { id: '5.3', keepCase: true, verb: 'Configure', title: 'Windows Server storage', sub: ['Configure disks and volumes', 'Configure and manage Storage Spaces', 'Implement and manage Storage Spaces Direct', 'Configure and manage Storage Replica', 'Configure Data Deduplication', 'Configure SMB Direct (SMB over Remote Direct Memory Access [RDMA])', 'Configure Storage QoS', 'Select and configure file systems, including NTFS and ReFS', 'Configure and manage iSCSI', 'Manage BitLocker Drive Encryption', 'Manage and recover encrypted volumes'] },
    ],
  },
  {
    id: 6,
    weight: 12.5,
    weightRange: '10-15%',
    title: 'Secure Windows Server infrastructure',
    short: 'Security',
    topics: [
      { id: '6.1', verb: 'Secure', title: 'the Windows Server operating system', sub: ['Configure and manage exploit protection', 'Configure and manage Application Control for Windows', 'Configure and manage Credential Guard', 'Configure Microsoft Defender SmartScreen', 'Implement operating system security by using Group Policies', 'Manage Windows Server security baseline by using OSConfig', 'Implement Windows Local Administrator Password Solution', 'Configure and manage Defender for Servers', 'Manage Windows Firewall, including connection security rules'] },
      { id: '6.2', verb: 'Secure', title: 'AD DS', sub: ['Configure password policies', 'Implement Microsoft Entra Password Protection for AD DS', 'Manage protected users', 'Harden domain controllers', 'Restrict access to domain controllers', 'Configure security options for user accounts', 'Configure security options for built-in administrative groups', 'Manage AD delegation', 'Manage authentication protocols and methods for AD DS'] },
    ],
  },
  {
    id: 7,
    weight: 17.5,
    weightRange: '15-20%',
    title: 'Monitor and troubleshoot Windows Server environments',
    short: 'Monitor & troubleshoot',
    topics: [
      { id: '7.1', verb: 'Monitor', title: 'by using Windows Server tools and Azure services', sub: ['Monitor by using Performance Monitor', 'Create and configure data collector sets', 'Monitor servers and configure alerts by using Windows Admin Center', 'Analyze by using the System Insights feature of Windows Server', 'Manage event logs', 'Configure data collection rules for Azure Monitor', 'Create alerts', 'Monitor Azure Virtual Machines performance by using VM Insights'] },
      { id: '7.2', keepCase: true, verb: 'Troubleshoot', title: 'Windows Server issues', sub: ['Troubleshoot connectivity issues', 'Troubleshoot name resolution', 'Troubleshoot Windows Update', 'Troubleshoot Time service', 'Troubleshoot performance issues', 'Troubleshoot VM and Azure Arc extension issues', 'Troubleshoot disk encryption issues', 'Troubleshoot storage issues'] },
      { id: '7.3', keepCase: true, verb: 'Troubleshoot', title: 'Active Directory', sub: ['Restore objects from AD Recycle Bin', 'Recover AD database by using Directory Services Restore Mode', 'Recover SYSVOL', 'Troubleshoot AD replication', 'Troubleshoot on-premises AD', 'Troubleshoot Kerberos and authentication issues', 'Troubleshoot secure channel and computer account trust issues'] },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

export function topicLabel(t) {
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}
