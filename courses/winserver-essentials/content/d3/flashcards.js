// Domain 3 - Network and File Services. Original flashcards.
let n = 0;
const c = (topic, front, back) => ({ id: `d3-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('3.1', 'AD-integrated DNS replication scopes?', '`Forest` (ForestDnsZones), `Domain` (DomainDnsZones), `Legacy` (domain partition, all DCs in domain), `Custom` (your own application partition).'),
  c('3.1', 'Which DNS zone types can be AD-integrated?', 'Primary and stub zones (and conditional forwarders). Secondary zones cannot; they are read-only transfer copies.'),
  c('3.1', 'DNS resolution order for an outside name?', 'Own zones and cache, matching conditional forwarder, server forwarders, then root hints (unless `-UseRootHint $false`).'),
  c('3.1', 'Stop DNS falling back to root hints?', '`Set-DnsServerForwarder -IPAddress ... -UseRootHint $false`.'),
  c('3.1', 'Dynamic update options on a zone?', 'None, Nonsecure and secure, Secure only. Secure only needs an AD-integrated zone.'),
  c('3.1', 'Why not put a public resolver on domain clients?', 'Clients treat all DNS servers as equal, so SRV lookups for DCs fail intermittently. Put public resolvers in the server forwarders.'),
  c('3.1', 'DNS aging and scavenging defaults?', 'Both are off. When enabled, no-refresh and refresh intervals are 7 days each, so a record is eligible after 14 days.'),
  c('3.1', 'What is never scavenged?', 'Static records (timestamp 0). Only dynamic records with a timestamp in an aging-enabled zone can be removed.'),
  c('3.1', 'Cmdlets for scavenging?', '`Set-DnsServerScavenging`, `Set-DnsServerZoneAging`, `Get-DnsServerScavenging`, `Start-DnsServerScavenging`.'),
  c('3.1', 'Create an A record with its PTR?', '`Add-DnsServerResourceRecordA -ZoneName corp.example.com -Name fs01 -IPv4Address 10.0.0.20 -CreatePtr`.'),
  c('3.1', 'Authorize a DHCP server in AD?', '`Add-DhcpServerInDC -DnsName dhcp01.corp.example.com -IPAddress 10.0.0.30`. Unauthorized domain-joined servers do not lease.'),
  c('3.1', 'DHCP exclusion vs reservation?', 'Exclusion: addresses in the range never leased. Reservation: fixed address bound to a MAC (`ClientId`), with its own optional options.'),
  c('3.1', 'DHCP option levels?', 'Server, scope, policy and reservation. The more specific level overrides the server level; a reservation overrides the scope.'),
  c('3.1', 'DHCP failover modes and defaults?', 'Load balance (default 50:50) and hot standby (standby reserves 5 percent). One mode per scope relationship.'),
  c('3.1', 'MCLT and failover states?', 'Maximum client lead time, default 1 hour. States: Normal, Communication Interrupted, Partner Down. Partner Down takeover waits for MCLT.'),
  c('3.1', 'DHCP failover limits?', 'IPv4 scopes only, TCP port 647, two partners, clocks within one minute. Use `Invoke-DhcpServerv4FailoverReplication` for scope changes.'),
  c('3.2', 'Share vs NTFS permission rule?', 'Cumulative within each layer, explicit Deny wins, and the more restrictive of share and NTFS applies over the network.'),
  c('3.2', 'Create an SMB share with ABE?', '`New-SmbShare -Name Finance -Path D:\\Shares\\Finance -ChangeAccess "CORP\\GG-Finance" -FolderEnumerationMode AccessBased`.'),
  c('3.2', 'Share caching modes?', '`Manual` (default), `Documents`, `Programs`, `BranchCache`, `None`.'),
  c('3.2', 'SMB signing in Windows Server 2025?', 'Required by default for all outbound SMB connections (previously only SYSVOL/NETLOGON). Required signing also disables guest fallback.'),
  c('3.2', 'Enable SMB NTLM blocking?', '`Set-SmbClientConfiguration -BlockNTLM $true` or GPO Lanman Workstation > Block NTLM. Exception list is a GPO. Connect by FQDN, not IP.'),
  c('3.2', 'SMB authentication rate limiter?', 'Server feature, on by default in 2025. Default delay 2000 ms after each failed NTLM or PKU2U attempt; `InvalidAuthenticationDelayTimeInMs`, 0 disables.'),
  c('3.2', 'SMB over QUIC essentials?', 'UDP 443, TLS 1.3, server certificate, `New-SmbServerCertificateMapping`. In 2025 included in Standard and Datacenter, configured with PowerShell.'),
  c('3.2', 'DFS-N vs DFS-R, FSRM quotas and screens?', 'DFS-N: one path via referrals. DFS-R: multi-master folder sync, last writer wins. FSRM: hard/soft quotas, active/passive screens by file name.'),
];
