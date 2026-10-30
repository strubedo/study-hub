// Domain 5 - Security, Monitoring and Recovery. Original questions; facts checked against Microsoft Learn (Windows Server 2025) on 2026-10-30.
// Rules-of-thumb performance thresholds and the event-ID list come from common Microsoft guidance and are framed that way in the explanations.
const LF = '5.1-firewall-defender-av';
const LL = '5.1-windows-laps';
const LC = '5.1-credential-guard-baselines-osconfig';
const LE = '5.2-event-viewer-forwarding';
const LP = '5.2-performance-monitor-resource-monitor';
const LW = '5.2-wsb-vss-recovery';
const LA = '5.2-azure-backup-site-recovery';

const bank = [
  // ---------- 5.1 firewall and Defender ----------
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LF,
    stem: 'Refer to the exhibit. An administrator expects blocked connections to appear in the firewall log on FS01 but finds no entries. What is the cause?',
    exhibit: `PS C:\\> Get-NetFirewallProfile -Name Domain | Format-List Name, Enabled, DefaultInboundAction, DefaultOutboundAction, LogAllowed, LogBlocked, LogFileName, LogMaxSizeKilobytes

Name                 : Domain
Enabled              : True
DefaultInboundAction : Block
DefaultOutboundAction: Allow
LogAllowed           : False
LogBlocked           : False
LogFileName          : %SystemRoot%\\System32\\LogFiles\\Firewall\\pfirewall.log
LogMaxSizeKilobytes  : 4096`,
    options: ['The Domain profile is disabled', 'Logging of dropped packets (LogBlocked) is not enabled, so nothing is written', 'The log file is limited to 4,096 KB, which has been reached and stops all logging', 'Outbound traffic is set to Allow, so inbound drops are not recorded'],
    answer: [1],
    explanation: 'Firewall logging is off until LogBlocked and/or LogAllowed is set to True; the file name and size alone do not cause entries. Enabled is True, so the profile is active. A full log discards the oldest entries rather than stopping, and the outbound default does not affect inbound drop logging.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LF,
    stem: 'Refer to the exhibit. Both rules are enabled and apply to the Domain profile. A client connects to FS01 on TCP 8080 from 192.168.10.50. What happens?',
    exhibit: `PS C:\\> Get-NetFirewallRule -DisplayName 'App-8080*' | Select-Object DisplayName, Direction, Action, Enabled, Profile

DisplayName           Direction Action Enabled Profile
-----------           --------- ------ ------- -------
App-8080-Allow-LAN      Inbound  Allow    True  Domain
App-8080-Block-Host50   Inbound  Block    True  Domain

PS C:\\> # The Block rule has RemoteAddress 192.168.10.50 and TCP 8080; the Allow rule has RemoteAddress 192.168.10.0/24 and TCP 8080.`,
    options: ['The connection is allowed, because the allow rule was created first', 'The connection is allowed, because the subnet rule is broader than the host rule', 'The connection is blocked, because an explicit block rule takes precedence over an allow rule', 'The connection is allowed only after the user authenticates with IPsec'],
    answer: [2],
    explanation: 'Block rules are evaluated before allow rules, so an explicit block that matches the traffic wins (authenticated-bypass rules are the exception, and none exists here). Creation order and rule breadth do not decide the outcome.' },
  { topic: '5.1', type: 'fill', difficulty: 1, lesson: LF,
    stem: 'Which PowerShell cmdlet creates a new Windows Defender Firewall rule? Enter the cmdlet name.',
    answer: ['New-NetFirewallRule'],
    explanation: 'New-NetFirewallRule creates a rule; Set-NetFirewallRule changes one and Enable-NetFirewallRule only toggles an existing rule.' },
  { topic: '5.1', type: 'single', difficulty: 1, lesson: LF,
    stem: 'Which firewall profile does Windows apply to a network connection on which the server can authenticate to a domain controller?',
    options: ['Domain', 'Private', 'Public', 'Authenticated'],
    answer: [0],
    explanation: 'The Domain profile is used when network location awareness detects the domain network. Private is chosen by an administrator and Public is the default for unidentified networks. There is no Authenticated profile.' },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: LF,
    stem: 'Which two statements describe the default behavior of Windows Defender Firewall on Windows Server 2025? (Choose two.)',
    options: ['Inbound connections that do not match an allow rule are blocked', 'Outbound connections that do not match a block rule are allowed', 'Dropped packets are logged to pfirewall.log automatically', 'The firewall is disabled on the Domain profile', 'Remote Desktop is allowed inbound on every profile'],
    answer: [0, 1],
    explanation: 'The defaults are inbound Block and outbound Allow on all three profiles. Logging is off until enabled, the firewall is on for every profile, and Remote Desktop is allowed only when its rule group is enabled.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LF,
    stem: 'A locally created inbound allow rule on FS01 never takes effect, and Get-NetFirewallRule shows it enabled. The server is in an OU with a firewall GPO. What is the most likely reason?',
    options: ['The GPO sets "Apply local firewall rules" to No for the profile', 'Local rules are always ignored on domain-joined servers', 'Rules created with PowerShell need a restart to take effect', 'The rule applies only to the Private profile by default'],
    answer: [0],
    explanation: 'When the GPO disables merging of local rules, locally created rules are ignored even though they exist and are enabled. Local rules do work on domain servers when merging is allowed, rules apply immediately, and a rule created without -Profile applies to all profiles.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LF,
    stem: 'An administrator wants to add D:\\SQLData to the Defender Antivirus exclusion list without removing existing exclusions. Which command does this?',
    options: ['Set-MpPreference -ExclusionPath D:\\SQLData', 'Add-MpPreference -ExclusionPath D:\\SQLData', 'Update-MpSignature -ExclusionPath D:\\SQLData', 'Start-MpScan -ExclusionPath D:\\SQLData'],
    answer: [1],
    explanation: 'Add-MpPreference appends to the exclusion list. Set-MpPreference replaces the whole list. Update-MpSignature and Start-MpScan do not manage exclusions.' },
  { topic: '5.1', type: 'fill', difficulty: 1, lesson: LF,
    stem: 'What is the Windows feature name used with Install-WindowsFeature to (re)install Microsoft Defender Antivirus on a server?',
    answer: ['Windows-Defender'],
    explanation: 'The feature is Windows-Defender; Windows-Defender-GUI adds the optional user interface.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LF,
    stem: 'Refer to the exhibit. Why is real-time protection not scanning files on this server?',
    exhibit: `PS C:\\> Get-MpComputerStatus | Format-List AMRunningMode, AMServiceEnabled, RealTimeProtectionEnabled, AntivirusSignatureAge

AMRunningMode             : Passive Mode
AMServiceEnabled          : True
RealTimeProtectionEnabled : False
AntivirusSignatureAge     : 0`,
    options: ['The Windows-Defender feature has been uninstalled', 'Defender Antivirus is running in passive mode, for example because another endpoint protection product or Defender for Endpoint onboarding is in control', 'The signature files are out of date', 'The Windows Security app is not installed'],
    answer: [1],
    explanation: 'AMRunningMode shows Passive Mode, in which Defender Antivirus does not provide real-time remediation but still updates. AMServiceEnabled is True, so the feature is present, the signature age is 0 days, and the Windows Security app is unrelated.' },

  // ---------- 5.1 LAPS ----------
  { topic: '5.1', type: 'order', difficulty: 2, lesson: LL,
    stem: 'Put the steps for deploying Windows LAPS with Active Directory backup in order (first at the top).',
    items: ['Run Update-LapsADSchema', 'Run Set-LapsADComputerSelfPermission on the OU of computers', 'Configure the LAPS Group Policy with BackupDirectory set to Active Directory', 'Run Invoke-LapsPolicyProcessing on a client', 'Run Get-LapsADPassword to retrieve the password'],
    explanation: 'The schema must contain the msLAPS attributes first, then computers need permission to write them, then policy tells clients to back up to AD, and only after a client processes policy is there a password to retrieve.' },
  { topic: '5.1', type: 'single', difficulty: 3, lesson: LL,
    stem: 'Refer to the exhibit. Windows LAPS on FS01 logs event 10027 and never rotates the password. What is the cause?',
    exhibit: `LAPS policy (Group Policy)               Local security policy on FS01
  BackupDirectory      : 2 (AD)             Minimum password length   : 14
  PasswordComplexity   : 4                  Password must meet complexity: Enabled
  PasswordLength       : 10
  PasswordAgeDays      : 30`,
    options: ['The schema was not updated', 'The configured PasswordLength is shorter than the device\'s local password policy allows, so LAPS cannot generate a compatible password', 'PasswordAgeDays must be at least 45', 'BackupDirectory 2 is not valid for member servers'],
    answer: [1],
    explanation: 'Windows LAPS generates a password that must satisfy the local password policy; a 10-character length conflicts with a 14-character minimum, which produces event 10027. A missing schema would cause a different failure, 30 days is valid, and BackupDirectory 2 is the Active Directory setting.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LL,
    stem: 'FS01 is hybrid joined to both Active Directory and Microsoft Entra ID. Where can Windows LAPS back up its local administrator password?',
    options: ['Only Active Directory', 'Only Microsoft Entra ID', 'Either Active Directory or Microsoft Entra ID, but not both at the same time', 'Both directories at the same time'],
    answer: [2],
    explanation: 'Hybrid-joined devices choose one target through BackupDirectory. Windows LAPS cannot back up to both directories.' },
  { topic: '5.1', type: 'fill', difficulty: 1, lesson: LL,
    stem: 'Which PowerShell cmdlet retrieves the Windows LAPS password for a computer from Active Directory?',
    answer: ['Get-LapsADPassword'],
    explanation: 'Get-LapsADPassword (add -AsPlainText to show the password). Reset-LapsPassword forces a rotation on the local machine.' },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: LL,
    stem: 'Which two Windows LAPS capabilities are new in Windows Server 2025 compared with the initial Windows LAPS release? (Choose two.)',
    options: ['Passphrase generation (PasswordComplexity 6-8)', 'Automatic account management of a dedicated local admin account', 'Encryption of passwords stored in Active Directory', 'Backup of the DSRM password on domain controllers', 'A configurable PasswordAgeDays setting'],
    answer: [0, 1],
    explanation: 'Passphrases, readable-password complexity and automatic account management arrived with Windows Server 2025 and Windows 11 24H2. AD encryption, DSRM backup and PasswordAgeDays were part of the original 2023 Windows LAPS release.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LL,
    stem: 'Which domain functional level is required before Windows LAPS can encrypt passwords stored in Active Directory?',
    options: ['Windows Server 2008 R2', 'Windows Server 2012 R2', 'Windows Server 2016', 'Windows Server 2025'],
    answer: [2],
    explanation: 'ADPasswordEncryptionEnabled requires a domain functional level of Windows Server 2016 or later. Level 2025 is not required.' },

  // ---------- 5.1 Credential Guard, baselines ----------
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LC,
    stem: 'Refer to the exhibit. All four servers run Windows Server 2025 on hardware that meets the requirements, and none of them has had Credential Guard explicitly disabled. Which server gets Credential Guard enabled by default?',
    exhibit: `Server   Role                      Domain membership
DC01     Domain controller         corp.example.com
FS01     File server               corp.example.com (member)
LAB01    Standalone lab server     WORKGROUP
HV01     Hyper-V host              WORKGROUP`,
    options: ['DC01', 'FS01', 'LAB01', 'HV01'],
    answer: [1],
    explanation: 'Default enablement on Windows Server 2025 applies to domain-joined servers that are not domain controllers. DC01 is a domain controller and the two workgroup servers are not domain joined.' },
  { topic: '5.1', type: 'single', difficulty: 3, lesson: LC,
    stem: 'Refer to the exhibit. After upgrading HV01 to Windows Server 2025, live migrations that worked on Windows Server 2022 now fail. HV01 is configured for CredSSP authentication. What is the best fix?',
    exhibit: `PS C:\\> (Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard).SecurityServicesRunning
1

PS C:\\> Get-VMHost | Format-List VirtualMachineMigrationAuthenticationType
VirtualMachineMigrationAuthenticationType : CredSSP`,
    options: ['Switch live migration to Kerberos authentication with constrained delegation', 'Turn off Secure Boot on the host', 'Add the migrating VM to Protected Users', 'Enable SMB1 on the destination host'],
    answer: [0],
    explanation: 'The 1 in SecurityServicesRunning shows Credential Guard is running, and with Credential Guard CredSSP can use only supplied credentials, which breaks live migration. Kerberos constrained delegation is compatible. Secure Boot, Protected Users and SMB1 are not the fix (SMB1 is also a security regression).' },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: LC,
    stem: 'The Win32_DeviceGuard SecurityServicesRunning property contains which numeric value when Credential Guard is running?',
    answer: ['1'],
    explanation: 'A value of 1 in SecurityServicesRunning indicates Credential Guard is running; msinfo32 shows the same under Virtualization-based security Services Running.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: LC,
    stem: 'Which OSConfig scenario applies the Windows Server 2025 security baseline to a domain controller?',
    options: ['SecurityBaseline/WindowsServer/2025/MemberServer', 'SecurityBaseline/WindowsServer/2025/DomainController', 'SecuredCore', 'LAPS/WindowsServer/2025/MemberServer'],
    answer: [1],
    explanation: 'The role-specific baselines are DomainController, MemberServer and WorkgroupMember. SecuredCore and the LAPS scenario are companion scenarios, and the LAPS one is for member servers only.' },
  { topic: '5.1', type: 'fill', difficulty: 1, lesson: LC,
    stem: 'Which cmdlet from the Microsoft.OSConfig module applies a security baseline scenario?',
    answer: ['Set-OSConfigDesiredConfiguration'],
    explanation: 'Set-OSConfigDesiredConfiguration applies it; Get-OSConfigDesiredConfiguration verifies and Remove-OSConfigDesiredConfiguration removes it.' },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: LC,
    stem: 'Which two effects should an administrator expect after applying the Windows Server 2025 member server baseline with OSConfig? (Choose two.)',
    options: ['Copying files through a Remote Desktop session is disabled', 'TLS connections require version 1.2 or higher', 'SMB 1 is enabled for compatibility', 'The Windows firewall is turned off on the Public profile', 'NTLMv1 is permitted for legacy clients'],
    answer: [0, 1],
    explanation: 'The baseline disables RDP drive redirection (reversible with a setting override) and enforces TLS 1.2 minimum. It disables SMB1, enables the firewall on all profiles with inbound default deny, and restricts authentication to NTLMv2.' },
  { topic: '5.1', type: 'match', difficulty: 2, lesson: LC,
    stem: 'Match each control to what it does.',
    pairs: [['Credential Guard', 'Isolates NTLM hashes and Kerberos TGTs using virtualization-based security'], ['Protected Users group', 'Blocks NTLM and weak Kerberos encryption and delegation for its members'], ['Windows LAPS', 'Gives each computer a unique, rotating local administrator password'], ['OSConfig baseline', 'Applies role-based hardened settings and corrects configuration drift']],
    explanation: 'Credential Guard protects secrets in memory with VBS, Protected Users restricts how member accounts authenticate, LAPS removes shared local admin passwords and OSConfig enforces a baseline with drift control.' },

  // ---------- 5.2 Event Viewer, forwarding ----------
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LE,
    stem: 'Refer to the exhibit. What does this event tell the administrator?',
    exhibit: `Log Name:      Security
Source:        Microsoft-Windows-Security-Auditing
Event ID:      4740
Task Category: User Account Management
Keywords:      Audit Success
Computer:      DC01.corp.example.com

A user account was locked out.
Subject:           Security ID: SYSTEM   Account Name: DC01$
Account That Was Locked Out:  Account Name: jsmith
Additional Information:       Caller Computer Name: FS01`,
    options: ['jsmith signed in successfully from FS01', 'jsmith\'s account was locked out, and the bad attempts came from FS01', 'The computer account DC01$ was locked out', 'jsmith\'s password was reset on FS01'],
    answer: [1],
    explanation: 'Event 4740 records an account lockout and the Caller Computer Name shows where the failed attempts originated. A successful logon is 4624 and a password reset attempt is 4724.' },
  { topic: '5.2', type: 'fill', difficulty: 1, lesson: LE,
    stem: 'Which Security log event ID records that the audit log was cleared? Enter the number.',
    answer: ['1102'],
    explanation: 'Event 1102 is logged in the Security log when it is cleared. Clearing another log, such as System, records event 104.' },
  { topic: '5.2', type: 'match', difficulty: 2, lesson: LE,
    stem: 'Match each event ID to its meaning.',
    pairs: [['4624', 'Successful logon'], ['4625', 'Failed logon'], ['4720', 'User account created'], ['4740', 'Account locked out']],
    explanation: 'These are the core Security log IDs: 4624 success, 4625 failure, 4720 account creation and 4740 lockout.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LE,
    stem: 'Which command, run on the event collector, enables the Windows Event Collector service and the ForwardedEvents channel?',
    options: ['wecutil qc /q', 'winrm set winrm/config/client', 'wevtutil cl ForwardedEvents', 'wecutil cs subscription.xml'],
    answer: [0],
    explanation: 'wecutil quick-config enables the ForwardedEvents channel, sets the collector service to delayed start and starts it. wecutil cs creates a subscription from an XML file, wevtutil cl clears a log, and the winrm command changes client settings.' },
  { topic: '5.2', type: 'single', difficulty: 3, lesson: LE,
    stem: 'Refer to the exhibit. A source-initiated subscription on WEC01 forwards Application and Security events from member servers. Application events arrive in Forwarded Events, but Security events do not. What should the administrator do?',
    exhibit: `<Subscription xmlns="http://schemas.microsoft.com/2006/03/windows/events/subscription">
  <SubscriptionId>Servers</SubscriptionId>
  <SubscriptionType>SourceInitiated</SubscriptionType>
  <Query><![CDATA[
    <QueryList>
      <Query Id="0">
        <Select Path="Application">*[System[(Level=1 or Level=2)]]</Select>
        <Select Path="Security">*[System[(EventID=4624 or EventID=4625)]]</Select>
      </Query>
    </QueryList>]]></Query>
  <AllowedSourceDomainComputers>O:NSG:NSD:(A;;GA;;;DC)(A;;GA;;;NS)</AllowedSourceDomainComputers>
</Subscription>`,
    options: ['Add the NETWORK SERVICE account to the Event Log Readers group on the source servers', 'Change SubscriptionType to CollectorInitiated', 'Install the Windows Server Backup feature on WEC01', 'Raise the Security log size on WEC01 to 1 GB'],
    answer: [0],
    explanation: 'Forwarding the Security log requires NETWORK SERVICE to be able to read it, which is granted by membership in Event Log Readers on each source. Changing subscription type, installing backup or resizing the collector log does not give the forwarder read access.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LE,
    stem: 'An organization wants 800 member servers to forward events to one collector with no per-server configuration on the collector. Which approach fits best?',
    options: ['A collector-initiated subscription listing all 800 servers', 'A source-initiated subscription with a Group Policy SubscriptionManager setting on the servers', 'Run Get-WinEvent -ComputerName against each server on a schedule', 'Copy the .evtx files by hand every day'],
    answer: [1],
    explanation: 'Source-initiated subscriptions let the servers find the collector through Group Policy, so the collector does not list every source. A collector-initiated subscription needs every source configured, and the remaining options are manual polling.' },
  { topic: '5.2', type: 'single', difficulty: 1, lesson: LE,
    stem: 'Which PowerShell approach is the most efficient way to retrieve only Security events with ID 4625 from the last day?',
    options: ['Get-WinEvent -LogName Security | Where-Object Id -eq 4625', 'Get-WinEvent -FilterHashtable @{LogName="Security"; Id=4625; StartTime=(Get-Date).AddDays(-1)}', 'Get-EventLog -LogName Security -ComputerName localhost | Select -First 1000', 'Get-Content C:\\Windows\\System32\\winevt\\Logs\\Security.evtx'],
    answer: [1],
    explanation: '-FilterHashtable applies the filter at the source before objects are created, which is far faster than reading every event and filtering afterward. The .evtx file is binary and not read as text.' },

  // ---------- 5.2 performance ----------
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LP,
    stem: 'Refer to the exhibit. FS01 has 16 GB of RAM and users report slow file opens. What does this sample suggest?',
    exhibit: `PS C:\\> Get-Counter '\\Processor(_Total)\\% Processor Time','\\Memory\\Available MBytes','\\Memory\\Pages/sec','\\PhysicalDisk(_Total)\\Avg. Disk sec/Read' -SampleInterval 5 -MaxSamples 3

Counter                                         Sample 1   Sample 2   Sample 3
\\Processor(_Total)\\% Processor Time                 22         25         21
\\Memory\\Available MBytes                           140        122        135
\\Memory\\Pages/sec                                  980       1210        860
\\PhysicalDisk(_Total)\\Avg. Disk sec/Read          0.035      0.041      0.038`,
    options: ['CPU saturation', 'Memory pressure, with paging driving up disk latency', 'Network saturation', 'A failing file share permission'],
    answer: [1],
    explanation: 'CPU is low (about 22%), but available memory is only about 130 MB of 16 GB and Pages/sec is high, so the system is paging and disk read latency has risen. Nothing in the sample points to network or permissions.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LP,
    stem: 'Which Resource Monitor tab shows which process is listening on a TCP port?',
    options: ['CPU', 'Memory', 'Disk', 'Network'],
    answer: [3],
    explanation: 'The Network tab lists TCP connections and listening ports with the owning process. CPU, Memory and Disk show activity for those resources.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: LP,
    stem: 'Which command-line tool creates and starts a Performance Monitor data collector set (for example, logman create counter ...)? Enter the executable name.',
    answer: ['logman', 'logman.exe'],
    explanation: 'logman creates, starts, stops and queries data collector sets. typeperf writes counter values to the console and relog converts logs.' },

  // ---------- 5.2 WSB, VSS ----------
  { topic: '5.2', type: 'fill', difficulty: 1, lesson: LW,
    stem: 'What is the feature name to install Windows Server Backup with Install-WindowsFeature?',
    answer: ['Windows-Server-Backup'],
    explanation: 'The feature is Windows-Server-Backup; it provides wbadmin, the snap-in and the WindowsServerBackup module.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LW,
    stem: 'Refer to the exhibit. The administrator wants a backup that can be used for bare-metal recovery. What must change?',
    exhibit: `C:\\> wbadmin start backup -backupTarget:E: -include:D: -quiet`,
    options: ['Add -allCritical', 'Replace -quiet with -vssCopy', 'Change the target to a remote share', 'Add -systemState only'],
    answer: [0],
    explanation: '-allCritical (used with -backupTarget) includes every volume that holds operating system state, which a bare-metal restore needs. -vssCopy is the default copy mode, a share does not add critical volumes, and -systemState alone does not make a backup bare-metal capable.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LW,
    stem: 'A domain controller has lost its Active Directory database and a system state backup exists. How should the administrator restore it?',
    options: ['Boot to Directory Services Restore Mode and run wbadmin start systemstaterecovery', 'Run wbadmin start sysrecovery from a normal Windows session', 'Reinstall Windows Server Backup and run Restore-ADObject', 'Run vssadmin restore shadows'],
    answer: [0],
    explanation: 'A domain controller\'s Active Directory is restored in Directory Services Restore Mode with a system state recovery (add ntdsutil for an authoritative restore). sysrecovery works only from the recovery environment and is a whole-server recovery, and the other options do not exist or do not restore AD.' },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: LW,
    stem: 'Which two statements about Volume Shadow Copy Service are correct? (Choose two.)',
    options: ['The system provider needs its shadow copy storage area on an NTFS volume', 'When shadow copy storage fills, the oldest shadow copies are deleted first', 'Shadow copies on the same disk protect against failure of that disk', 'A shadow copy removes the need for a separate backup', 'vssadmin list writers creates a new shadow copy'],
    answer: [0, 1],
    explanation: 'The default system provider keeps its shadow copy storage area on an NTFS volume (the volume being copied need not be NTFS), and a full storage area deletes the oldest copies. Shadow copies on the same disk are lost with it, they are not a replacement for backups, and list writers only reports writer state.' },

  // ---------- 5.2 Azure ----------
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LA,
    stem: 'On which installation type is the Azure Backup MARS agent not supported?',
    options: ['Windows Server 2025 with Desktop Experience', 'Windows Server 2022 with Desktop Experience', 'Windows Server Core', 'An Azure VM running Windows Server'],
    answer: [2],
    explanation: 'The MARS agent does not support Server Core. It does support 64-bit Windows Server 2025, 2022, 2019 and 2016 Desktop Experience installs, including Azure VMs for file-level backup.' },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: LA,
    stem: 'Put the Azure Site Recovery failover lifecycle for a Hyper-V VM in order (first at the top).',
    items: ['Enable replication and let initial replication complete', 'Run a test failover to an isolated network', 'Fail over to Azure and commit', 'Fail back to the on-premises site', 'Enable reverse replication to protect the workload again'],
    explanation: 'Replication must be healthy before any failover; the test failover proves the plan without disruption; a real failover is committed; fail back happens after the site returns; reverse replication re-protects the on-premises VM.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: LA,
    stem: 'A critical application must be running in Azure within minutes of an on-premises site outage, with data loss measured in seconds to minutes. Which service fits?',
    options: ['Azure Backup with the MARS agent', 'Azure Site Recovery', 'Shadow Copies of Shared Folders', 'Windows Server Backup to a local disk'],
    answer: [1],
    explanation: 'Azure Site Recovery continuously replicates VMs and fails them over. Backup products restore data from point-in-time copies and have much longer recovery times, and neither shadow copies nor a local disk survives a site outage.' },
];

export default bank.map((item, i) => ({ id: `d5-${String(i + 1).padStart(3, '0')}`, ...item }));
