// Windows Server 2025 Essentials: core administration skills for Windows Server 2025 (not tied to an exam).
// "Essentials" means essential admin skills; the Essentials *edition* is covered as one item in 1.1.
// Outline is this site's own, built from Microsoft Learn Windows Server 2025 documentation (checked 2026-10-30).
// Domain `weight` sets how many questions the self-test draws from each domain.

export const EXAM = {
  code: 'Self-test',
  name: 'Windows Server 2025 Essentials final self-test',
  certification: 'None (skills course; AZ-802 is the certification path)',
  product: 'Windows Server 2025',
  minutes: 60,
  questions: 50,
  scoring: 'Percent correct; 80% is this site\'s mastery mark.',
};

export const DOMAINS = [
  {
    id: 1, weight: 20, title: 'Deploy and Manage Windows Server 2025', short: 'Deploy & manage',
    topics: [
      { id: '1.1', verb: 'Choose', title: 'Windows Server 2025 editions, licensing and requirements', sub: ['Standard, Datacenter, Datacenter: Azure Edition and the Essentials edition', 'Core-based licensing, CALs and virtualization rights', 'Pay-as-you-go licensing through Azure Arc', 'Hardware requirements and what is new in 2025'] },
      { id: '1.2', verb: 'Install', title: 'and perform initial configuration', sub: ['Server Core vs Desktop Experience', 'In-place upgrade paths', 'SConfig, computer name, IP settings, domain join, activation', 'Roles, role services and features (Server Manager, Install-WindowsFeature)'] },
      { id: '1.3', verb: 'Manage', title: 'servers remotely and with PowerShell', sub: ['Server Manager and remote server groups', 'Windows Admin Center', 'PowerShell remoting, WinRM, Enter-PSSession and Invoke-Command', 'OpenSSH server on Windows', 'Windows Update, WSUS concepts and hotpatching'] },
    ],
  },
  {
    id: 2, weight: 25, title: 'Active Directory Domain Services', short: 'AD DS',
    topics: [
      { id: '2.1', verb: 'Explain', title: 'AD DS concepts and deploy domain controllers', keepCase: true, sub: ['Forests, domains, trees, OUs, sites', 'Promoting a DC, DNS integration, global catalog', 'FSMO roles', 'Functional levels including the 2025 level', 'Read-only domain controllers', 'Replication basics'] },
      { id: '2.2', verb: 'Manage', title: 'users, groups and computers', sub: ['User and computer accounts, ADUC and ADAC', 'Group scopes and types (domain local, global, universal) and AGDLP', 'Managed service accounts and gMSA', 'Delegation of control', 'Active Directory PowerShell module'] },
      { id: '2.3', verb: 'Configure', title: 'Group Policy', sub: ['GPO processing order (LSDOU), inheritance, enforcement, blocking', 'Security filtering and WMI filtering', 'Common settings: password policy, drive maps, software restrictions', 'gpupdate, gpresult and the Group Policy Management Console', 'Fine-grained password policies'] },
    ],
  },
  {
    id: 3, weight: 20, title: 'Network and File Services', short: 'Network & file',
    topics: [
      { id: '3.1', verb: 'Configure', title: 'DNS and DHCP servers', keepCase: true, sub: ['AD-integrated zones, forwarders, conditional forwarders, root hints', 'Record management and scavenging', 'DHCP scopes, options, reservations, exclusions', 'DHCP failover and authorization in AD'] },
      { id: '3.2', verb: 'Configure', title: 'file shares and permissions', sub: ['SMB shares, share vs NTFS permissions, effective access', 'Access-based enumeration, offline files', 'SMB security in 2025: signing required, NTLM blocking, SMB over QUIC', 'DFS Namespaces and DFS Replication', 'File Server Resource Manager quotas and screening'] },
    ],
  },
  {
    id: 4, weight: 20, title: 'Storage and Hyper-V', short: 'Storage & Hyper-V',
    topics: [
      { id: '4.1', verb: 'Manage', title: 'disks, volumes and Storage Spaces', sub: ['GPT vs MBR, basic disks, NTFS vs ReFS', 'Storage Spaces: pools, resiliency (simple, mirror, parity)', 'iSCSI target and initiator', 'Data Deduplication'] },
      { id: '4.2', verb: 'Run', title: 'virtual machines with Hyper-V', keepCase: true, sub: ['Installing Hyper-V, generation 1 vs 2 VMs', 'Virtual switches (external, internal, private)', 'VHDX, dynamic vs fixed, checkpoints (standard vs production)', 'Dynamic memory, integration services', 'Live migration and Hyper-V Replica overview', 'GPU partitioning in 2025'] },
    ],
  },
  {
    id: 5, weight: 15, title: 'Security, Monitoring and Recovery', short: 'Security & recovery',
    topics: [
      { id: '5.1', verb: 'Secure', title: 'Windows Server', sub: ['Windows Defender Firewall profiles and rules', 'Microsoft Defender Antivirus', 'Windows LAPS', 'Credential Guard and Protected Users', 'Security baselines and OSConfig'] },
      { id: '5.2', verb: 'Monitor', title: 'and back up servers', sub: ['Event Viewer, custom views, event forwarding', 'Performance Monitor and Resource Monitor', 'Windows Server Backup and bare-metal recovery', 'Volume Shadow Copies', 'Azure Backup and Azure Site Recovery overview'] },
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
