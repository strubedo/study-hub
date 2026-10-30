// Domain 3 - Network and File Services. Original content, checked against Microsoft Learn (Windows Server 2025 documentation) on 2026-10-30.
export default [
  { id: '3.1-dns-zones-forwarders', topic: '3.1', title: 'DNS Zones, AD-Integrated Replication Scopes, Forwarders and Root Hints', minutes: 9, file: '3.1-dns-zones-forwarders.md',
    objectives: ['Compare primary, secondary, stub and conditional forwarder zones', 'Choose the right AD-integrated replication scope', 'Configure forwarders, conditional forwarders and root hints', 'Explain the order in which a DNS server resolves an outside name'] },
  { id: '3.1-dns-records-scavenging', topic: '3.1', title: 'DNS Records, Dynamic Updates, Aging and Scavenging', minutes: 9, file: '3.1-dns-records-scavenging.md',
    objectives: ['Create and remove A, CNAME and PTR records with PowerShell and DNS Manager', 'Explain why static records are never scavenged', 'Use the 7-day no-refresh and refresh intervals to predict when a record is removed', 'Enable aging and scavenging on the zone and on a server'] },
  { id: '3.1-dhcp-scopes-failover', topic: '3.1', title: 'DHCP Scopes, Options, Reservations, Failover and AD Authorization', minutes: 11, file: '3.1-dhcp-scopes-failover.md',
    objectives: ['Authorize a DHCP server in Active Directory', 'Create scopes, exclusions, reservations and options', 'Distinguish load balance from hot standby failover and explain MCLT', 'Replicate scope changes between failover partners'] },
  { id: '3.2-shares-ntfs-abe-offline', topic: '3.2', title: 'SMB Shares, Share vs NTFS Permissions, Effective Access, ABE and Offline Files', minutes: 10, file: '3.2-shares-ntfs-abe-offline.md',
    objectives: ['Create SMB shares with New-SmbShare and the New Share Wizard', 'Combine share and NTFS permissions to find the effective result', 'Use the Effective Access tab and know what it leaves out', 'Enable access-based enumeration and choose an offline caching mode'] },
  { id: '3.2-smb-security-2025', topic: '3.2', title: 'SMB Security in Windows Server 2025: Signing, NTLM Blocking, Rate Limiter and QUIC', minutes: 11, file: '3.2-smb-security-2025.md',
    objectives: ['State what SMB signing requires by default in Windows Server 2025', 'Enable NTLM blocking for the SMB client and manage exceptions', 'Describe the SMB authentication rate limiter and its default delay', 'Configure SMB over QUIC and know which editions include it', 'Explain the status of SMB1'] },
  { id: '3.2-dfs-fsrm', topic: '3.2', title: 'DFS Namespaces, DFS Replication and File Server Resource Manager', minutes: 12, file: '3.2-dfs-fsrm.md',
    objectives: ['Choose a domain-based or stand-alone namespace', 'Build a replication group and check the backlog', 'Create hard and soft quotas with thresholds and auto-apply templates', 'Create active and passive file screens with file groups'] },
];
