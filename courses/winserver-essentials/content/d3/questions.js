// Domain 3 - Network and File Services. Original questions; facts checked against Microsoft Learn (Windows Server 2025) on 2026-10-30.
const L31A = '3.1-dns-zones-forwarders';
const L31B = '3.1-dns-records-scavenging';
const L31C = '3.1-dhcp-scopes-failover';
const L32A = '3.2-shares-ntfs-abe-offline';
const L32B = '3.2-smb-security-2025';
const L32C = '3.2-dfs-fsrm';

const bank = [
  // ---------- 3.1 DNS zones, forwarders ----------
  { topic: '3.1', type: 'single', difficulty: 1, lesson: L31A,
    stem: 'A forest has three domains. An administrator wants the AD-integrated zone `_msdcs.corp.example.com` to replicate to every DNS server on a domain controller anywhere in the forest. Which replication scope should the zone use?',
    options: ['Forest', 'Domain', 'Legacy', 'Custom, with a partition holding only the root domain DCs'],
    answer: [0],
    explanation: 'Forest scope stores the zone in the ForestDnsZones application partition, so every DNS server on a DC in the forest receives it. Domain scope stops at the domain boundary. Legacy puts the zone in the domain partition for all DCs in that one domain. A custom partition reaches only the DCs enrolled in it, here just the root domain.' },
  { topic: '3.1', type: 'single', difficulty: 1, lesson: L31A,
    stem: 'Which DNS zone type can never be stored in Active Directory?',
    options: ['Primary zone', 'Stub zone', 'Secondary zone', 'Reverse lookup primary zone'],
    answer: [2],
    explanation: 'A secondary zone is a read-only copy that must be pulled by zone transfer, so it cannot be AD-integrated. Primary zones (forward or reverse) and stub zones can be AD-integrated.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31A,
    stem: 'Enter the DnsServer cmdlet that creates a conditional forwarder for `partner.example.org` (the zone-style conditional forwarder, not the server-wide forwarder list).',
    answer: ['Add-DnsServerConditionalForwarderZone'],
    explanation: '`Add-DnsServerConditionalForwarderZone -Name partner.example.org -MasterServers 192.168.50.10 -ReplicationScope Forest` creates it. `Add-DnsServerForwarder` edits only the server-wide list.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. The forwarder 192.168.1.1 is offline, but the lab has internet access. What happens when DC01 receives a recursive query for www.example.com?',
    exhibit: `PS C:\\> Get-DnsServerForwarder

UseRootHint        : True
Timeout(s)         : 3
EnableReordering   : True
IPAddress          : {192.168.1.1}
ReorderedIPAddress : {192.168.1.1}`,
    options: ['The query fails with SERVFAIL because the only forwarder is down', 'DC01 falls back to root hints and resolves the name itself', 'DC01 returns the cached answer for the forwarder and never queries anyone', 'DC01 refers the client to a secondary zone'],
    answer: [1],
    explanation: 'UseRootHint is True, so when the forwarder does not answer the server walks down from the root servers. It would fail only with UseRootHint set to False. Caching is not a substitute for resolution on a first query, and no secondary zone is involved.' },
  { topic: '3.1', type: 'order', difficulty: 2, lesson: L31A,
    stem: 'Put the steps a Windows DNS server takes to answer a recursive query for an outside name in order, first at the top.',
    items: ['Check its own zones and cache', 'Use a matching conditional forwarder', 'Use the server-level forwarders', 'Use root hints'],
    explanation: 'Authoritative data and cache come first. A matching conditional forwarder is more specific than the general forwarders, which are tried next. Root hints are the last resort, and only if root hints are allowed.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. Which domain controllers receive the zone partner.example.org?',
    exhibit: `PS C:\\> Get-DnsServerZone -Name partner.example.org | Format-List ZoneName, ZoneType, IsDsIntegrated, ReplicationScope

ZoneName         : partner.example.org
ZoneType         : Primary
IsDsIntegrated   : True
ReplicationScope : Legacy`,
    options: ['Only DCs that run the DNS Server role', 'All DCs in the forest', 'All domain controllers in the domain, whether or not they run DNS', 'Only DCs listed in a custom directory partition'],
    answer: [2],
    explanation: 'Legacy scope keeps the zone in the domain partition, which replicates to every DC in the domain regardless of the DNS role. Forest scope would reach the whole forest and Domain scope only DNS servers in the domain (DomainDnsZones). Custom scope needs a named partition.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31A,
    stem: 'Which parameter of `Set-DnsServerForwarder` stops the server from falling back to root hints when forwarders fail? Enter the parameter name.',
    answer: ['UseRootHint', '-UseRootHint'],
    explanation: '`Set-DnsServerForwarder -UseRootHint $false` makes the server rely only on its forwarders.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Domain clients use DC01 as the preferred DNS server and a public resolver as the alternate. Users report that logon sometimes fails to find a domain controller. What is the best fix?',
    options: ['Add a second reverse lookup zone', 'Enable scavenging on DC01', 'Remove the public resolver from the clients and add it to the DNS server forwarders', 'Change the zone to nonsecure dynamic updates'],
    answer: [2],
    explanation: 'Clients treat all DNS servers as equals, so the public resolver will eventually be asked for SRV records it cannot answer. Public resolvers belong in the server forwarders. A reverse zone, scavenging and nonsecure updates do not address SRV lookups.' },

  // ---------- 3.1 DNS records, scavenging ----------
  { topic: '3.1', type: 'fill', difficulty: 1, lesson: L31B,
    stem: 'By default, how many days long is the DNS no-refresh interval when aging is enabled on a zone? Enter the number.',
    answer: ['7', '7 days', 'seven'],
    explanation: 'Both the no-refresh interval and the refresh interval default to 7 days.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31B,
    stem: 'A zone has aging enabled with default intervals. A dynamically registered record with a timestamp stops being refreshed. After how long does it first become eligible for scavenging?',
    options: ['7 days', '14 days', '24 hours', '30 days'],
    answer: [1],
    explanation: 'Eligibility comes after the no-refresh interval plus the refresh interval, 7 + 7 = 14 days by default. 7 days is only the protected no-refresh period. 24 hours is the client re-registration cadence. 30 days is not a default.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31B,
    stem: 'Refer to the exhibit. Stale records for decommissioned PCs remain in corp.example.com for months. What is the cause?',
    exhibit: `PS C:\\> Get-DnsServerScavenging

NoRefreshInterval  : 7.00:00:00
RefreshInterval    : 7.00:00:00
ScavengingInterval : 0.00:00:00
ScavengingState    : False
LastScavengeTime   :

PS C:\\> Get-DnsServerZoneAging -Name corp.example.com | Select AgingEnabled
AgingEnabled : True`,
    options: ['The refresh interval is too long', 'Aging is enabled but the server scavenging interval is 0, so no scavenging pass ever runs', 'The records are CNAMEs, which are exempt', 'The zone must be a secondary zone to be scavenged'],
    answer: [1],
    explanation: 'Scavenging needs both zone aging and a server that actually runs passes; a ScavengingInterval of 0 means it is off. Seven-day intervals are normal. Record type is not the issue, and secondary zones are read-only and never scavenged.' },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31B,
    stem: 'Which two conditions must both be true for a stale dynamic record to be removed automatically? (Choose two.)',
    options: ['Aging is enabled on the zone', 'A DNS server has scavenging enabled for that zone', 'The record was created with the PTR option', 'The zone is Active Directory-integrated with Forest scope', 'The DHCP lease for the client has been deleted'],
    answer: [0, 1],
    explanation: 'Aging on the zone and scavenging on a server are the two required switches (plus a timestamp on the record). PTR creation, Forest scope and DHCP lease deletion are not requirements.' },
  { topic: '3.1', type: 'match', difficulty: 1, lesson: L31B,
    stem: 'Match each DNS record type to its purpose.',
    pairs: [['A', 'Maps a name to an IPv4 address'], ['PTR', 'Maps an IP address back to a name'], ['SRV', 'Locates a service by host and port'], ['MX', 'Names the mail servers for a domain'], ['CNAME', 'Aliases one name to another']],
    explanation: 'These are the standard meanings. SRV records are how clients find domain controllers; CNAMEs cannot coexist with other records at the same name.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31B,
    stem: 'Enter the cmdlet that starts a scavenging pass on a DNS server immediately.',
    answer: ['Start-DnsServerScavenging'],
    explanation: '`Start-DnsServerScavenging` triggers a pass now. `Set-DnsServerScavenging` only changes the settings.' },

  // ---------- 3.1 DHCP ----------
  { topic: '3.1', type: 'single', difficulty: 1, lesson: L31C,
    stem: 'A new domain-joined Windows Server runs the DHCP service with an active scope, but clients get no leases from it. What is the most likely cause?',
    options: ['Reservations must exist first', 'The server is not authorized in Active Directory', 'The scope lease is longer than 8 days', 'The DNS role is missing'],
    answer: [1],
    explanation: 'A domain-joined Windows DHCP server does not lease until it is authorized. Reservations are optional, 8 days is the normal default lease, and DNS is not required to lease addresses.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31C,
    stem: 'Enter the DhcpServer cmdlet that authorizes a DHCP server in Active Directory.',
    answer: ['Add-DhcpServerInDC'],
    explanation: '`Add-DhcpServerInDC -DnsName dhcp01.corp.example.com -IPAddress 10.0.0.30` authorizes it; `Get-DhcpServerInDC` lists authorized servers.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31C,
    stem: 'In a DHCP failover relationship in hot standby mode, what percentage of the address pool does the standby server reserve by default for new clients while the active server is unreachable?',
    options: ['5 percent', '50 percent', '20 percent', '100 percent'],
    answer: [0],
    explanation: 'The default reserve is 5 percent. 50:50 is the load balance default split, 20 percent resembles the old split-scope habit, and the standby reaches 100 percent only after the MCLT expires in Partner Down.' },
  { topic: '3.1', type: 'fill', difficulty: 3, lesson: L31C,
    stem: 'What is the default maximum client lead time (MCLT) for a DHCP failover relationship? Enter the value with its unit.',
    answer: ['1 hour', '1h', '01:00:00', '60 minutes', '1 hr'],
    explanation: 'The default MCLT is 1 hour. A partner entering Partner Down waits for the MCLT before taking over the whole pool.' },
  { topic: '3.1', type: 'single', difficulty: 3, lesson: L31C,
    stem: 'Refer to the exhibit. What is true about the failover relationship right now?',
    exhibit: `PS C:\\> Get-DhcpServerv4Failover -ComputerName dhcp01 | Format-List

Name                  : dhcp01-dhcp02
PartnerServer         : dhcp02.corp.example.com
Mode                  : LoadBalance
LoadBalancePercent    : 50
MaxClientLeadTime     : 01:00:00
AutoStateTransition   : False
State                 : CommunicationInterrupted
ScopeId               : {10.0.10.0}`,
    options: ['dhcp01 still serves its half, and moving to Partner Down needs an administrator because automatic transition is off', 'dhcp02 has taken over 100 percent of the pool', 'The relationship is in hot standby and dhcp01 is the standby', 'Both servers have stopped issuing leases until MCLT expires'],
    answer: [0],
    explanation: 'Communication Interrupted means a partner cannot be reached but has not been declared down. With AutoStateTransition False, only an administrator can move it to Partner Down, which is what lets the survivor take over the whole pool after MCLT. The mode is LoadBalance, and servers keep serving during the interruption.' },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31C,
    stem: 'Which two statements about DHCP failover in Windows Server are true? (Choose two.)',
    options: ['It supports IPv4 scopes only', 'Partners communicate over TCP port 647', 'It requires both servers to be domain controllers', 'It supports three or more partners per relationship', 'It replicates server-level options automatically'],
    answer: [0, 1],
    explanation: 'IPv4 only and TCP 647 are correct. Failover works on any DHCP servers, relationships have exactly two partners, and replication covers scope configuration, not server-level settings.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31C,
    stem: 'You need high availability for stateful DHCPv6 scopes on two servers. Which approach is available?',
    options: ['DHCP failover in load balance mode', 'DHCP failover in hot standby mode', 'A split scope with separate address ranges on each server', 'Authorizing both servers twice'],
    answer: [2],
    explanation: 'DHCP failover does not support IPv6 scopes in either mode. Dividing the range between two servers (split scope) is the remaining option. Authorization twice does nothing.' },
  { topic: '3.1', type: 'order', difficulty: 1, lesson: L31C,
    stem: 'Put the DHCP lease exchange in order, first at the top.',
    items: ['Discover', 'Offer', 'Request', 'Acknowledge'],
    explanation: 'The exchange is DORA: the client discovers, the server offers, the client requests the offer, and the server acknowledges.' },

  // ---------- 3.2 shares ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. User jsmith is a member of GG-Finance only. What access does jsmith get when connecting to \\\\FS01\\Finance over the network?',
    exhibit: `PS C:\\> Get-SmbShareAccess -Name Finance
Name    AccountName      AccessControlType AccessRight
Finance Everyone         Allow             Read

PS C:\\> icacls D:\\Shares\\Finance
D:\\Shares\\Finance CORP\\GG-Finance:(OI)(CI)(M)
                  BUILTIN\\Administrators:(OI)(CI)(F)`,
    options: ['Modify', 'Read', 'Full control', 'No access'],
    answer: [1],
    explanation: 'The effective permission is the more restrictive of the share (Read) and NTFS (Modify), so Read. Modify applies only to local logons. Full control belongs to administrators, and nothing denies jsmith access.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'A user is in Group A (share permission: Read) and Group B (share permission: Change). The NTFS ACL gives Group B Modify. What is the user\'s effective network access?',
    options: ['Read, because the most restrictive share permission wins', 'Change/Modify, because share permissions accumulate and the lower of share and NTFS results', 'Full Control', 'No access, because the groups conflict'],
    answer: [1],
    explanation: 'Within a layer, allow permissions accumulate (Read + Change = Change). Across layers the lower applies, here Change and Modify match. Taking the most restrictive entry inside one layer is wrong; only an explicit Deny overrides.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'An administrator uses the Effective Access tab for user mlee on a folder and sees Read. Mlee still cannot read files over the network. Which is the likely reason?',
    options: ['Effective Access does not include share permissions, and the share may deny or limit mlee', 'Effective Access only shows share permissions', 'The folder must be copied to another volume first', 'Offline Files is disabled on the share'],
    answer: [0],
    explanation: 'The Effective Access tab evaluates the NTFS ACL only; share permissions must be checked separately with `Get-SmbShareAccess`. It does not show share permissions, a copy is unnecessary, and offline caching does not block access.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32A,
    stem: 'Enter the value of `-FolderEnumerationMode` that turns on access-based enumeration for an SMB share.',
    answer: ['AccessBased'],
    explanation: '`Set-SmbShare -Name Finance -FolderEnumerationMode AccessBased` enables ABE. The default is `Unrestricted`.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32A,
    stem: 'Which two statements about access-based enumeration (ABE) are true? (Choose two.)',
    options: ['It hides files and folders from users who lack at least Read access', 'It does not stop access by someone who knows a path they are allowed to open', 'It encrypts SMB traffic to the share', 'It is enabled by default on every new share', 'It replaces NTFS permissions'],
    answer: [0, 1],
    explanation: 'ABE filters directory listings by the user\'s permissions and is not an access control itself. It does not encrypt, it is off by default (Unrestricted), and NTFS still decides access.' },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: L32A,
    stem: 'What is the default offline caching mode of a new SMB share?',
    options: ['None', 'Manual', 'Documents', 'Programs'],
    answer: [1],
    explanation: 'The default is Manual: users choose which files to make available offline. Documents and Programs cache automatically, and None disables caching.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'A file is moved with Explorer from D:\\Shares\\Finance to D:\\Shares\\Public on the same NTFS volume. Which permissions does the file have afterward?',
    options: ['It inherits the permissions of Public', 'It keeps its original permissions', 'It loses all permissions', 'It takes the share permissions of Public'],
    answer: [1],
    explanation: 'A move within the same volume keeps the file\'s ACL. A copy, or a move to a different volume, takes the destination permissions. Share permissions are never stored on files.' },

  // ---------- 3.2 SMB security ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'What changed about SMB signing in Windows Server 2025 compared with earlier versions?',
    options: ['Signing is required by default for all outbound SMB connections', 'Signing is disabled by default to improve speed', 'Signing is required only for connections to SYSVOL and NETLOGON', 'Signing can no longer be configured'],
    answer: [0],
    explanation: 'Signing is now required by default for all outbound connections. Previously only SYSVOL and NETLOGON on domain controllers required it. It is neither disabled nor locked; you can still change it deliberately.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. A Windows Server 2025 file server can no longer open a share on an old NAS. What is the best remediation?',
    exhibit: `PS C:\\> Get-SmbClientConfiguration | Format-List RequireSecuritySignature, BlockNTLM
RequireSecuritySignature : True
BlockNTLM                : False

PS C:\\> New-SmbMapping -LocalPath Z: -RemotePath \\\\nas01\\data
New-SmbMapping : The specified network name is no longer available.

# NAS vendor note: SMB signing is supported but not enabled in the factory settings.`,
    options: ['Disable SMB signing on every Windows Server 2025 client', 'Enable SMB signing on the NAS', 'Set BlockNTLM to True', 'Install the SMB1 feature'],
    answer: [1],
    explanation: 'Required signing blocks connections to servers that do not sign; the NAS supports it, so enabling it there is the safe fix. Disabling it clients-wide lowers security everywhere. BlockNTLM is already False and does not cause this. SMB1 is unsafe and unrelated.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32B,
    stem: 'Enter the parameter of `Set-SmbClientConfiguration` that blocks NTLM authentication for outbound SMB connections.',
    answer: ['BlockNTLM', '-BlockNTLM'],
    explanation: '`Set-SmbClientConfiguration -BlockNTLM $true` is the PowerShell route; the Group Policy is Block NTLM (LM, NTLM, NTLMv2) under Lanman Workstation.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32B,
    stem: 'After enabling SMB NTLM blocking, \\\\fs01.corp.example.com\\Finance works but \\\\10.0.0.20\\Finance fails. Why?',
    options: ['A UNC path with an IP address cannot use Kerberos, so authentication falls to NTLM, which is now blocked', 'NTLM blocking also blocks DNS', 'IP addresses are not allowed in SMB 3.1.1', 'The rate limiter blocked the client'],
    answer: [0],
    explanation: 'Kerberos needs a name that maps to an SPN, so IP-address connections fall back to NTLM and fail when it is blocked. DNS and the dialect are unaffected, and the rate limiter only delays failed authentications on the server.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'What does the SMB authentication rate limiter do by default in Windows Server 2025?',
    options: ['Locks accounts after five failures', 'Delays 2 seconds after each failed NTLM or PKU2U authentication attempt', 'Blocks Kerberos tickets above a request count', 'Limits file transfer bandwidth per client'],
    answer: [1],
    explanation: 'The server adds a delay (default 2000 ms) after each failed NTLM or PKU2U attempt. It does not lock accounts, it does not affect Kerberos, and it is not a bandwidth limit.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32B,
    stem: 'Which two statements about SMB over QUIC in Windows Server 2025 are true? (Choose two.)',
    options: ['It uses UDP port 443 by default', 'The connection is protected by TLS 1.3', 'The server feature requires Datacenter: Azure Edition', 'It requires a VPN to be established first', 'It uses TCP port 445 inside the tunnel'],
    answer: [0, 1],
    explanation: 'SMB over QUIC uses UDP 443 and a TLS 1.3 tunnel. In 2025 the server feature is available in Standard and Datacenter, not only Azure Edition. Its purpose is to avoid needing a VPN, and it does not use TCP 445.' },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: L32B,
    stem: 'What is the status of SMB1 on a clean installation of Windows Server 2025?',
    options: ['Installed and enabled for compatibility', 'Not installed by default and recommended to stay off', 'Required by domain controllers', 'Installed but disabled'],
    answer: [1],
    explanation: 'SMB1 has not been installed by default on clean installs since Windows Server 2019. It is deprecated and unsafe. Domain controllers do not need it.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32B,
    stem: 'Enter the cmdlet that associates a certificate with the SMB server for SMB over QUIC.',
    answer: ['New-SmbServerCertificateMapping'],
    explanation: '`New-SmbServerCertificateMapping -Name <FQDN> -Thumbprint <hash> -StoreName My` binds the certificate. On Windows Server 2025 this PowerShell method is the supported way to configure it.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Which editions of Windows Server 2025 include the SMB over QUIC server feature?',
    options: ['Datacenter: Azure Edition only', 'Standard and Datacenter', 'Datacenter only', 'Essentials only'],
    answer: [1],
    explanation: 'Windows Server 2025 makes the SMB over QUIC server available in Standard and Datacenter; it was previously Azure Edition only.' },

  // ---------- 3.2 DFS, FSRM ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32C,
    stem: 'Which statement about domain-based DFS namespaces is correct?',
    options: ['Configuration is stored in Active Directory and multiple root servers can be used', 'The namespace path begins with the root server name', 'They cannot use access-based enumeration', 'They require a failover cluster'],
    answer: [0],
    explanation: 'Domain-based namespaces store configuration in AD and allow multiple namespace servers. The server-name path and cluster option describe stand-alone namespaces. 2008 mode does support access-based enumeration.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32C,
    stem: 'Refer to the exhibit. What does the output indicate?',
    exhibit: `PS C:\\> Get-DfsrBacklog -GroupName RG-Finance -FolderName Finance \`
>>   -SourceComputerName FS01 -DestinationComputerName FS02

Backlog File Count: 1840`,
    options: ['1840 files have changes on FS01 that FS02 has not yet received', '1840 files conflict and were moved to ConflictAndDeleted', 'FS02 holds 1840 files that are not on FS01', 'The initial primary member election failed'],
    answer: [0],
    explanation: 'The backlog counts updates the source has that the destination still needs. Conflicts are not counted here, the direction is source to destination, and primary member election concerns initial sync only.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32C,
    stem: 'Two users edit the same file on different DFS-R members at the same time. How does DFS-R resolve the conflict?',
    options: ['The last writer wins and the losing file is moved to the ConflictAndDeleted folder', 'The first writer wins and the other is discarded permanently', 'Both versions are merged automatically', 'Replication stops until an administrator chooses'],
    answer: [0],
    explanation: 'DFS-R uses last-writer-wins; the loser goes to the ConflictAndDeleted folder, where it can be recovered for a while. It does not merge or halt.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32C,
    stem: 'An administrator wants to warn users at 85 percent of their folder limit but still allow writes beyond the limit while it is monitored. Which FSRM quota type fits?',
    options: ['Hard quota', 'Soft quota with a threshold action', 'NTFS per-user quota', 'File screen'],
    answer: [1],
    explanation: 'A soft quota monitors without blocking, and a threshold can send a notification. A hard quota blocks writes, NTFS quotas are per user per volume, and a file screen controls file types.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32C,
    stem: 'A team wants to see which users store media files in a share before blocking them. Which FSRM option should be used first?',
    options: ['An active file screen', 'A passive file screen', 'A hard quota', 'A DFS referral'],
    answer: [1],
    explanation: 'A passive screen logs or notifies without blocking. An active screen blocks immediately, a hard quota limits space not type, and a DFS referral is unrelated.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32C,
    stem: 'Enter the Windows feature name used with `Install-WindowsFeature` to install File Server Resource Manager.',
    answer: ['FS-Resource-Manager'],
    explanation: '`Install-WindowsFeature FS-Resource-Manager -IncludeManagementTools` installs FSRM.' },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));
