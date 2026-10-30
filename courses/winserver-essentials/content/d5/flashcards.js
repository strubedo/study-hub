// Domain 5 - Security, Monitoring and Recovery. Original flashcards.
let n = 0;
const c = (topic, front, back) => ({ id: `d5-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('5.1', 'Firewall defaults on every profile?', 'Firewall on, inbound **Block**, outbound **Allow**. Logging is off until you enable `LogBlocked`/`LogAllowed` (default log 4,096 KB).'),
  c('5.1', 'Block rule vs allow rule?', 'An explicit **block** rule beats a matching allow rule. Exception: authenticated-bypass allow rules.'),
  c('5.1', 'Cmdlets for rule match criteria?', '`Get-NetFirewallPortFilter`, `Get-NetFirewallAddressFilter`, `Get-NetFirewallApplicationFilter`; `Get-NetFirewallRule` returns the rule itself.'),
  c('5.1', 'Add vs Set for Defender exclusions?', '`Add-MpPreference` appends to the list; `Set-MpPreference` replaces it.'),
  c('5.1', 'What puts Defender Antivirus in passive mode?', 'A non-Microsoft antivirus, Defender for Endpoint onboarding, or `ForceDefenderPassiveMode` = 1. Check `AMRunningMode`.'),
  c('5.1', 'Windows LAPS AD setup cmdlets?', '`Update-LapsADSchema`, `Set-LapsADComputerSelfPermission`, `Set-LapsADReadPasswordPermission`, `Set-LapsADResetPasswordPermission`.'),
  c('5.1', 'Windows LAPS defaults?', '`BackupDirectory` Disabled; 30 days; 14 characters; complexity 4; post-auth action 3 after 24 hours; AD encryption on (Domain Admins decrypt).'),
  c('5.1', 'LAPS backup target rules?', 'AD-only joined: AD. Entra-only: Entra. Hybrid: either one, never both. AD encryption needs domain functional level 2016.'),
  c('5.1', 'What LAPS added in Server 2025?', 'Passphrases (complexity 6-8, 3-10 words), readable passwords (5), automatic account management (`WLapsAdmin` default name), post-auth action 11.'),
  c('5.1', 'When is Credential Guard on by default (2025)?', 'Domain-joined, **not** a domain controller, supported hardware and licence, not explicitly disabled. No UEFI lock.'),
  c('5.1', 'How to verify Credential Guard?', '`Win32_DeviceGuard` `SecurityServicesRunning` contains **1**, or `msinfo32` VBS services running.'),
  c('5.1', 'What breaks under Credential Guard?', 'Unconstrained Kerberos delegation, NTLMv1/MS-CHAPv2/WDigest SSO, CredSSP delegation (breaks Hyper-V live migration; use Kerberos constrained delegation).'),
  c('5.1', 'OSConfig baseline commands?', '`Install-Module Microsoft.OSConfig`; `Set-/Get-/Remove-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/<Role>`; restart after apply/remove.'),
  c('5.2', 'Event IDs: logon success, failure, lockout?', '4624, 4625, 4740. Account created 4720; Security log cleared 1102; other log cleared 104.'),
  c('5.2', 'Collector vs source-initiated subscription?', 'Collector-initiated lists every source; source-initiated is driven by the GPO SubscriptionManager setting and scales. Security log needs NETWORK SERVICE in Event Log Readers.'),
  c('5.2', 'Collector setup commands?', '`winrm quickconfig`, `wecutil qc /q`, `wecutil cs file.xml`; check with `wecutil gr <name>`. WinRM ports 5985 HTTP, 5986 HTTPS.'),
  c('5.2', 'Core performance counters?', '`% Processor Time`, `Processor Queue Length`, `Available MBytes`, `Pages/sec`, `PhysicalDisk\\Avg. Disk sec/Read`, `Network Interface\\Bytes Total/sec`. Compare to a baseline.'),
  c('5.2', 'Bare-metal backup with wbadmin?', '`wbadmin start backup -backupTarget:E: -allCritical -quiet`. `-allCritical` needs `-backupTarget`. Restore with `wbadmin start sysrecovery` in WinRE.'),
  c('5.2', 'Restore AD on a domain controller?', 'Boot to DSRM, `wbadmin start systemstaterecovery -version:<id>`. Add `ntdsutil` for an authoritative restore.'),
  c('5.2', 'VSS limits?', '512 shadow copies per volume, 64 by default for Shadow Copies of Shared Folders (`MaxShadowCopies`); NTFS for persistent copies; oldest deleted when storage fills.'),
  c('5.2', 'MARS agent vs Site Recovery?', 'MARS agent (Recovery Services vault) backs up files, volumes and system state; no Server Core. Site Recovery replicates VMs (Hyper-V as often as 30 s) for failover and failback.'),
];
