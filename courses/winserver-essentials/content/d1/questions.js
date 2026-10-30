// Domain 1 - Deploy and Manage Windows Server 2025. Original questions; facts checked against Microsoft Learn (Windows Server 2025) on 2026-10-30.
// Licensing minimums (8 cores per processor, 16 per server), CAL rules and Essentials caps come from Microsoft licensing terms, not Learn.
const L11A = '1.1-editions-and-licensing';
const L11B = '1.1-payg-hardware-whats-new';
const L12A = '1.2-install-options-and-upgrades';
const L12B = '1.2-sconfig-initial-config-roles';
const L13A = '1.3-remote-management-powershell-ssh';
const L13B = '1.3-updates-wsus-hotpatching';

const bank = [
  // ---------- 1.1 ----------
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11A,
    stem: 'A company will run about 30 Windows Server VMs on each licensed Hyper-V host and wants the simplest licensing. Which choice fits?',
    options: ['Windows Server 2025 Standard, relicensed with stacked cores for every two VMs', 'Windows Server 2025 Datacenter, with every physical core on the host licensed', 'Windows Server 2025 Essentials on each host', 'Windows Server 2025 Standard with Desktop Experience'],
    answer: [1],
    explanation: 'Datacenter grants unlimited Windows Server VMs on a fully core-licensed host. Standard could do it only by stacking licenses for every pair of VMs, which is not simple or cheap at 30 VMs. Essentials is a fixed-capacity small-business edition. Desktop Experience is an install option, not a license that adds VM rights.' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11A,
    stem: 'Under core-based licensing, what is the minimum number of core licenses required for a single physical server, regardless of how few cores it has? Enter the number.',
    answer: ['16', 'sixteen'],
    explanation: 'Microsoft licensing terms require every physical core to be licensed, with at least 8 core licenses per physical processor and at least 16 core licenses per server.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11A,
    stem: 'Refer to the exhibit. HV01 is a physical server that will host many VMs under Windows Server 2025 Datacenter. What is the minimum number of core licenses required for HV01?',
    exhibit: `PS C:\\> Get-CimInstance Win32_Processor | Select-Object SocketDesignation, NumberOfCores, NumberOfLogicalProcessors

SocketDesignation NumberOfCores NumberOfLogicalProcessors
----------------- ------------- -------------------------
CPU0                          6                        12
CPU1                          6                        12`,
    options: ['12', '16', '24', '32'],
    answer: [1],
    explanation: 'The host has 2 x 6 = 12 physical cores. Hyper-Threading logical processors are not counted. The per-processor minimum is 8 (2 x 8 = 16) and the per-server minimum is 16, so 16 core licenses are required. 12 is below the minimum; 24 counts logical processors; 32 would apply to two 16-core processors.' },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L11A,
    stem: 'Which three features are available in Windows Server 2025 Datacenter but not in Standard? (Choose three.)',
    options: ['Storage Spaces Direct', 'Network Controller', 'Host Guardian Hyper-V Support', 'DNS Server', 'Hyper-V', 'SMB over QUIC server'],
    answer: [0, 1, 2],
    explanation: 'Storage Spaces Direct, Network Controller and Host Guardian Hyper-V Support are Datacenter features. DNS Server and Hyper-V are in every edition. SMB over QUIC was Azure Edition only in 2022, but in 2025 it is also in Standard and Datacenter.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11A,
    stem: 'Which statement about the SMB over QUIC server feature in Windows Server 2025 is correct?',
    options: ['It remains exclusive to Datacenter: Azure Edition', 'It is available in Standard, Datacenter and Datacenter: Azure Edition', 'It is available only in Datacenter', 'It requires the Essentials edition'],
    answer: [1],
    explanation: 'In 2025 Microsoft moved the SMB over QUIC server from Azure Edition only to Standard and Datacenter as well. The other options describe the Windows Server 2022 situation or are invented.' },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L11A,
    stem: 'Match each licensed scenario to the virtualization rights it gives.',
    pairs: [['Standard, all cores licensed once', 'Two Windows Server VMs plus the Hyper-V host role'], ['Datacenter, all cores licensed once', 'Unlimited Windows Server VMs on that host'], ['Machine licensed with Azure Arc pay-as-you-go', 'Applies to that device only; every VM needs its own license']],
    explanation: 'Standard is two VMs per fully licensed host (stack to add pairs); Datacenter is unlimited. Pay-as-you-go licenses only the device where it is enabled and gives no rights to VMs on the same server.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'FS01 runs Windows Server 2025 Standard and is enrolled in Azure Arc pay-as-you-go. Which statement about client access licensing is correct?',
    options: ['Windows Server CALs are required for every user, as with perpetual licensing', 'No CALs are required for standard functionality, but Remote Desktop Services CALs are still required', 'No CALs of any kind are ever required', 'Only Device CALs are required, never User CALs'],
    answer: [1],
    explanation: 'Microsoft documents that pay-as-you-go needs no CALs for standard functionality, while RDS CALs are still required. The other options overstate or invent a CAL rule.' },
  { topic: '1.1', type: 'multi', difficulty: 3, lesson: L11B,
    stem: 'Refer to the exhibit. An administrator wants to enable Azure Arc pay-as-you-go on FS01 (Windows Server 2025 Standard). Which two actions are required first? (Choose two.)',
    exhibit: `PS C:\\> azcmagent show
Resource Name           : FS01
Agent Version           : 1.44.02560.1234
Agent Status            : Connected

PS C:\\> cscript //nologo C:\\Windows\\System32\\slmgr.vbs /dlv
Name: Windows(R), ServerStandard edition
Description: Windows(R) Operating System, VOLUME_KMSCLIENT channel
License Status: Licensed`,
    options: ['Upgrade the Connected Machine agent to version 1.47 or later', 'Convert the server to Datacenter: Azure Edition', 'Remove the existing volume-license (KMS) activation so the machine is not activated with another license type', 'Join the server to an Active Directory domain', 'Purchase Software Assurance for the server'],
    answer: [0, 2],
    explanation: 'Pay-as-you-go needs agent 1.47 or later (the exhibit shows 1.44) and a machine that is not already activated with OEM, retail or volume licensing (the exhibit shows a KMS client channel). Azure Edition conversion, domain join and Software Assurance are not prerequisites; Software Assurance relates to the separate Windows Server Management enabled by Azure Arc offer.' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11B,
    stem: 'How many days of free trial do you get after enabling Windows Server pay-as-you-go through Azure Arc? Enter the number.',
    answer: ['7', 'seven'],
    explanation: 'Microsoft documents a seven-day free trial period after enabling pay-as-you-go; billing starts automatically afterward.' },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11B,
    stem: 'What is the minimum RAM for Windows Server 2025 with Desktop Experience on a physical server, with 4 GB recommended?',
    options: ['512 MB', '1 GB', '2 GB', '8 GB'],
    answer: [2],
    explanation: 'The 2025 minimum is 2 GB for both Server Core and Desktop Experience, with 4 GB recommended for Desktop Experience. 512 MB and 1 GB were earlier-version figures; 8 GB is not a minimum.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'Refer to the exhibit. An older physical server is being evaluated for Windows Server 2025. What is the consequence of the Coreinfo result?',
    exhibit: `C:\\> coreinfo -f
...
SSE            *       Supports SSE instruction extensions
SSE2           *       Supports SSE2 instruction extensions
SSE3           *       Supports SSE3 instruction extensions
SSSE3          *       Supports Supplemental SSE3 instruction extensions
SSE4.1         *       Supports SSE4.1 instruction extensions
SSE4.2         -       Supports SSE4.2 instruction extensions
POPCNT         -       Supports POPCNT instruction
CMPXCHG16B     *       Supports CMPXCHG16B instruction`,
    options: ['The server meets the 2025 requirements because CMPXCHG16B is present', 'The server fails the 2025 CPU requirements because SSE4.2 and POPCNT are missing', 'The server can install only Server Core', 'The server can install only Standard, not Datacenter'],
    answer: [1],
    explanation: 'Windows Server 2025 adds SSE4.2 and POPCNT to the processor requirements. Both are missing (-), so the CPU does not meet the minimum regardless of CMPXCHG16B. The edition and the Core option do not change CPU requirements.' },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L11B,
    stem: 'A Hyper-V VM has 1 core and the minimum 1,024 MB of RAM and fails to install Windows Server 2025. What is the minimum amount of RAM, in MB, Microsoft says to allocate so setup succeeds? Enter the number.',
    answer: ['1280', '1,280'],
    explanation: 'Microsoft states that setup needs 1,280 MB or more; afterward the allocation can be lowered to as little as 1,024 MB depending on workload.' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11A,
    stem: 'For how many days does the free Windows Server 2025 evaluation from the Microsoft Evaluation Center run? Enter the number.',
    answer: ['180', 'one hundred eighty'],
    explanation: 'Microsoft documents the Windows Server 2025 evaluation as a free 180-day download.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11A,
    stem: 'A 12-person office wants a single server for file and print, no virtualization, and no CAL purchasing. Per Microsoft licensing material, which edition is built for this and what are its user and device limits?',
    options: ['Essentials, limited to 25 users and 50 devices', 'Essentials, limited to 250 users and 500 devices', 'Standard, limited to 25 users and 50 devices', 'Datacenter: Azure Edition, limited to 25 users'],
    answer: [0],
    explanation: 'The Essentials edition is documented in Microsoft licensing material as 25 users and 50 devices with no CALs. Standard has no built-in user cap (CALs control it). Azure Edition is for Azure and Azure Local VMs. Treat the exact caps as licensing-datasheet facts to re-check before purchase.' },

  // ---------- 1.2 ----------
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L12A,
    stem: 'A server was installed as Server Core. Management now wants the full graphical shell without reinstalling. What is the supported approach?',
    options: ['Run Install-WindowsFeature Server-Gui-Shell and restart', 'Run DISM /online /Set-Edition to the Desktop Experience edition', 'Convert it with SConfig option 15', 'There is no in-place conversion; perform a clean install or migrate to a new Desktop Experience server'],
    answer: [3],
    explanation: 'Since Windows Server 2016 you cannot convert between Server Core and Desktop Experience after installation, and an in-place upgrade cannot switch them either. Server-Gui-Shell conversion was a 2012 R2-era feature. DISM Set-Edition changes edition, not the install option. SConfig option 15 only exits to PowerShell.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. An administrator signs in to FS01 at the console. What do they see?',
    exhibit: `PS C:\\> (Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion').InstallationType
Server Core`,
    options: ['A desktop with Server Manager opening automatically', 'A PowerShell window in which the SConfig menu is running', 'A cmd.exe prompt only, with no menu', 'The Azure Arc Setup wizard'],
    answer: [1],
    explanation: 'Server Core on Windows Server 2022 and later uses PowerShell as the default shell and launches SConfig automatically after sign-in. Server Manager and a desktop belong to Desktop Experience. A bare cmd.exe was the pre-2022 default. Azure Arc Setup is a Desktop Experience item.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. Which statement describes how to move this server to Windows Server 2025 in place using installation media?',
    exhibit: `PS C:\\> (Get-CimInstance Win32_OperatingSystem).Caption
Microsoft Windows Server 2012 Standard`,
    options: ['Run setup.exe from the 2025 media; any version from 2008 R2 onward is supported', 'Run setup.exe from the 2025 media; Windows Server 2012 is supported directly', 'First upgrade in place to Windows Server 2012 R2 (or 2016), then upgrade to 2025', 'First upgrade in place to Windows Server 2019, then to 2025'],
    answer: [2],
    explanation: 'Direct upgrades to 2025 start at Windows Server 2012 R2. Plain 2012 can upgrade to 2012 R2 or 2016 but not directly to 2019, 2022 or 2025. 2012 to 2019 is not a supported path, so the third-hop plan via 2019 fails.' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12A,
    stem: 'Which two changes are NOT supported during an in-place upgrade of a licensed (non-evaluation) server to Windows Server 2025? (Choose two.)',
    options: ['Switching from Server Core to Server with Desktop Experience', 'Downgrading from Datacenter to Standard', 'Upgrading from Standard to Datacenter', 'Keeping the same edition', 'Upgrading from Windows Server 2022 using Windows Update'],
    answer: [0, 1],
    explanation: 'The Core/Desktop Experience choice cannot change during an in-place upgrade, and edition downgrades are not allowed. Standard to Datacenter is allowed, keeping the edition is the default, and Windows Update can upgrade 2019 and 2022 servers that have the required cumulative update.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'DC01, a Windows Server 2019 domain controller, must be moved to Windows Server 2025. What does Microsoft recommend?',
    options: ['Run an in-place upgrade; it is the preferred approach for domain controllers', 'Install a new Windows Server 2025 server, promote it as a domain controller, transfer roles, and demote the old one', 'Convert it to a read-only domain controller first', 'Use DISM /Set-Edition to change DC01 to 2025'],
    answer: [1],
    explanation: 'Microsoft advises against in-place upgrading AD DS servers because an upgrade does not provide the AD improvements in 2025; use a clean install, promote, move FSMO roles, and demote the old DC. RODC conversion is unrelated, and DISM Set-Edition does not change release.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12A,
    stem: 'Refer to the exhibit. An evaluation copy of Windows Server 2025 Datacenter must be converted to retail. What is the supported result?',
    exhibit: `C:\\> DISM /online /Get-CurrentEdition
Current Edition : ServerDatacenterEval

C:\\> DISM /online /Get-TargetEditions
Editions that can be upgraded to:
Target Edition : ServerDatacenter`,
    options: ['Convert to retail Datacenter with DISM /online /Set-Edition:ServerDatacenter /ProductKey:<key> /AcceptEula', 'Convert to retail Standard with /Set-Edition:ServerStandard', 'Convert to Server Core retail with /Set-Edition:ServerDatacenterCore', 'Run slmgr /rearm to make the evaluation permanent'],
    answer: [0],
    explanation: 'An evaluation Datacenter can only convert to retail Datacenter, and the output lists that single target. Standard is not a target, there is no such Core edition name, and rearming only extends an evaluation period.' },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12B,
    stem: 'What number do you type at the SConfig main menu to open Windows activation?',
    answer: ['11', 'option 11'],
    explanation: 'Option 11 is Windows activation (view status, activate, install a product key). Option 8 is network settings and option 4 is remote management.' },
  { topic: '1.2', type: 'match', difficulty: 2, lesson: L12B,
    stem: 'Match each SConfig main-menu option number to its item.',
    pairs: [['2', 'Computer name'], ['4', 'Configure remote management'], ['8', 'Network settings'], ['15', 'Exit to command line (PowerShell)']],
    explanation: 'The SConfig menu runs: 1 domain/workgroup, 2 computer name, 3 add local administrator, 4 remote management, 5 update settings, 6 install updates, 7 remote desktop, 8 network settings, 9 date and time, 10 telemetry, 11 activation, 12 log off, 13 restart, 14 shut down, 15 exit to command line.' },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12B,
    stem: 'On a Desktop Experience server, what command do you type in PowerShell to open the Server Configuration tool?',
    answer: ['sconfig', 'sconfig.cmd'],
    explanation: 'Running SConfig in PowerShell starts the tool; SConfig.cmd also works but is no longer being developed.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12B,
    stem: 'Refer to the exhibit. FS01 is a new Server Core machine in a workgroup. The ping fails, yet remote PowerShell works. Why?',
    exhibit: `C:\\> ping 192.168.10.21
Pinging 192.168.10.21 with 32 bytes of data:
Request timed out.
Request timed out.

PS C:\\> Test-WSMan 192.168.10.21
wsmid           : http://schemas.dmtf.org/wbem/wsman/identity/wsmanidentity.xsd
ProtocolVersion : http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd
ProductVendor   : Microsoft Corporation
ProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0`,
    options: ['WinRM must be disabled for ping to work', 'Response to ICMP echo is off by default; it can be enabled through SConfig option 4', 'FS01 has no IP address', 'Ping works only after the server is domain joined'],
    answer: [1],
    explanation: 'SConfig documents that response to ping is disabled by default, while remote management (WinRM) is enabled. Test-WSMan succeeding proves the address is working. Domain membership and WinRM state do not control ICMP echo.' },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12B,
    stem: 'What PowerShell cmdlet installs a server role or feature on Windows Server?',
    answer: ['install-windowsfeature', 'add-windowsfeature'],
    explanation: 'Install-WindowsFeature in the ServerManager module installs roles, role services and features (Add-WindowsFeature is an alias). Get-WindowsFeature lists state and Uninstall-WindowsFeature removes.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12B,
    stem: 'Refer to the exhibit. Which command installs the IIS role and its management console on FS01?',
    exhibit: `PS C:\\> Get-WindowsFeature Web-Server

Display Name                                            Name           Install State
------------                                            ----           -------------
[ ] Web Server (IIS)                                    Web-Server         Available`,
    options: ['Install-WindowsFeature -Name Web-Server -IncludeManagementTools', 'Add-WindowsCapability -Online -Name Web-Server', 'Enable-PSRemoting -Name Web-Server', 'Set-Service -Name Web-Server -StartupType Automatic'],
    answer: [0],
    explanation: 'Roles and features install with Install-WindowsFeature, and -IncludeManagementTools adds the console. Add-WindowsCapability handles Features on Demand such as OpenSSH, Enable-PSRemoting configures WinRM, and Set-Service changes service startup.' },
  { topic: '1.2', type: 'order', difficulty: 2, lesson: L12A,
    stem: 'Put the steps of an in-place upgrade from installation media in order (first step at the top).',
    items: ['Take a full backup and test the restore', 'Run setup.exe from the mounted Windows Server 2025 media', 'Let setup restart the server several times', 'Sign in and verify roles, services and activation'],
    explanation: 'Back up and verify before touching the server, run setup from the media, allow the multiple restarts, then validate the result.' },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L12B,
    stem: 'Which statement about using SConfig is correct?',
    options: ['It can be used inside a remote PowerShell session to configure a server', 'It can be used at the console or over Remote Desktop, but not in a remote PowerShell session', 'It requires membership in Domain Admins', 'It is available only on Server Core'],
    answer: [1],
    explanation: 'SConfig works locally and over RDP, not in a remote PowerShell session. It needs local Administrators membership, and it also runs on Desktop Experience by typing SConfig in PowerShell.' },

  // ---------- 1.3 ----------
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13A,
    stem: 'What is the default TCP port for PowerShell remoting over WinRM using HTTP?',
    answer: ['5985'],
    explanation: 'WinRM listens on 5985 for HTTP and 5986 for HTTPS.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13A,
    stem: 'What is the default TCP port for PowerShell remoting over WinRM using HTTPS?',
    answer: ['5986'],
    explanation: '5986 is the HTTPS listener; 5985 is HTTP. SSH uses 22 and RDP uses 3389.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13A,
    stem: 'Which cmdlet starts an interactive PowerShell session on a single remote computer?',
    answer: ['enter-pssession'],
    explanation: 'Enter-PSSession gives an interactive 1:1 session; Invoke-Command runs commands non-interactively on one or many computers.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. What does the PSComputerName column identify?',
    exhibit: `PS C:\\> Invoke-Command -ComputerName FS01, HV01 -ScriptBlock { Get-Service WinRM }

Status   Name   DisplayName                PSComputerName
------   ----   -----------                --------------
Running  WinRM  Windows Remote Management  FS01
Running  WinRM  Windows Remote Management  HV01`,
    options: ['The computer that sent the command', 'The remote computer that produced each returned object', 'The computer account used for authentication', 'The WinRM listener address'],
    answer: [1],
    explanation: 'Invoke-Command adds a PSComputerName property to each object returned from a remote computer, so results from many servers can be told apart. It is not the sender, an account or the listener.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. An administrator on a workgroup PC runs Enter-PSSession -ComputerName 192.168.10.21 and gets this error. Which action resolves it for a lab test?',
    exhibit: `Enter-PSSession : Connecting to remote server 192.168.10.21 failed with the following error message :
The WinRM client cannot process the request. If the authentication scheme is different from Kerberos, or if the
client computer is not joined to a domain, then HTTPS transport must be used or the destination machine must be
added to the TrustedHosts configuration setting.`,
    options: ['Add the target to TrustedHosts on the client, for example Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value 192.168.10.21', 'Disable the WinRM service on the target', 'Open TCP 3389 on the target', 'Install Windows Admin Center on the PC'],
    answer: [0],
    explanation: 'The message names the two options: HTTPS transport or TrustedHosts. TrustedHosts is the quick lab fix and is set on the client. Disabling WinRM removes the listener, 3389 is RDP, and WAC is a different tool that would still need WinRM to the target.' },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L13A,
    stem: 'Match each remote management tool to its defining characteristic.',
    pairs: [['Server Manager', 'Server pool and groups of servers; manages equal or older versions only'], ['Windows Admin Center', 'Browser-based gateway, HTTPS 443 by default, not supported on a domain controller'], ['PowerShell remoting', 'WinRM on TCP 5985 and 5986'], ['OpenSSH server', 'sshd service on TCP 22']],
    explanation: 'These are the key identifying facts for each tool. Server Manager cannot manage a newer Windows Server release than itself; the WAC gateway installer defaults to 443; remoting uses WinRM; OpenSSH listens on 22.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'What is the default state of the OpenSSH server on a new Windows Server 2025 installation?',
    options: ['Not installed; it must be added as an optional feature', 'Installed but not enabled', 'Installed, running and set to start automatically', 'Available only on Datacenter: Azure Edition'],
    answer: [1],
    explanation: 'Microsoft documents that in Windows Server 2025 the OpenSSH server is installed but not enabled (earlier versions needed manual installation). Start-Service sshd and a startup type change enable it.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. SSH to FS01 (Windows Server 2025) fails. What should the administrator do on FS01?',
    exhibit: `PS C:\\> Test-NetConnection FS01 -Port 22
WARNING: TCP connect to (192.168.10.21 : 22) failed

ComputerName     : FS01
RemoteAddress    : 192.168.10.21
RemotePort       : 22
InterfaceAlias   : Ethernet
SourceAddress    : 192.168.10.5
PingSucceeded    : True
TcpTestSucceeded : False`,
    options: ['Run Start-Service sshd, and Set-Service sshd -StartupType Automatic to keep it running', 'Run Enable-PSRemoting', 'Install the Telnet client feature', 'Open TCP 5985 in the firewall'],
    answer: [0],
    explanation: 'The server is reachable by ping but nothing listens on port 22 because sshd is installed but not started by default in 2025. Enable-PSRemoting configures WinRM, Telnet client is irrelevant, and 5985 is the WinRM port.' },
  { topic: '1.3', type: 'multi', difficulty: 3, lesson: L13A,
    stem: 'Which two requirements apply to PowerShell remoting over SSH to a Windows Server 2025 machine? (Choose two.)',
    options: ['PowerShell 7 installed on the target', 'A Subsystem powershell entry in sshd_config', 'A WinRM HTTPS listener on 5986', 'Kerberos authentication to a domain controller', 'The target added to TrustedHosts'],
    answer: [0, 1],
    explanation: 'PowerShell over SSH needs PowerShell 6 or later (in practice 7) and an sshd Subsystem line that starts pwsh in server mode. WinRM listeners, Kerberos and TrustedHosts belong to the WinRM transport, not SSH. Windows PowerShell 5.1 cannot use -HostName.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'On which kind of server is installing the Windows Admin Center gateway not supported?',
    options: ['A member server running Windows Server 2025', 'A Windows 11 workstation in local-client mode', 'A domain controller', 'A failover cluster node'],
    answer: [2],
    explanation: 'Microsoft states installing Windows Admin Center on a domain controller is not supported. Member servers, Windows 11 clients and failover cluster nodes are supported installation targets.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'What is the status of WSUS in Windows Server 2025?',
    options: ['Removed; the role no longer ships', 'Deprecated: no new features, but still included, supported and updated', 'The only supported update tool for servers', 'Available only through Azure Arc'],
    answer: [1],
    explanation: 'Microsoft lists WSUS as no longer actively developed, but the role ships in 2025 and is supported for production with security and quality updates. It was not removed, and Azure Update Manager is an alternative rather than a replacement requirement.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'A Windows Server baseline cumulative update, which requires a restart, is installed in January. If no unplanned baseline occurs, in which months are restart-free hotpatches released before the next baseline?',
    options: ['February and March', 'February, March and April', 'Only March', 'Every month including April'],
    answer: [0],
    explanation: 'Baselines refresh every three months and are followed by two months of hotpatches. January baseline gives February and March hotpatches; April is the next baseline and needs a restart.' },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L13B,
    stem: 'An on-premises Windows Server 2025 Standard server is Arc-enabled. The portal refuses to enable Hotpatch and says virtual secure mode is not running. Which change satisfies the prerequisite?',
    options: ['Convert the server to Windows Server 2022', 'Enable a VBS-dependent feature such as Credential Guard on a system that boots with UEFI and Secure Boot', 'Switch the server from Standard to Essentials', 'Install the WSUS role'],
    answer: [1],
    explanation: 'Hotpatch for Arc-enabled 2025 servers needs virtualization-based security running, which needs UEFI with Secure Boot (Generation 2 for a Hyper-V VM). Enabling Credential Guard or similar starts VSM. Older versions, Essentials and WSUS do not provide it.' },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L13A,
    stem: 'Refer to the exhibit. HV01, a Windows Server 2025 member server on a Public network profile, rejects remoting from a management PC in another subnet. What explains this?',
    exhibit: `PS C:\\> Get-NetFirewallRule -Name 'WINRM-HTTP-In-TCP-PUBLIC' | Get-NetFirewallAddressFilter

LocalAddress  : Any
RemoteAddress : LocalSubnet`,
    options: ['Server versions allow remoting from the local subnet only on the Public profile until the rule is changed', 'WinRM does not work on member servers', 'The rule requires SSH keys', 'Public-profile servers accept only HTTPS on 5986'],
    answer: [0],
    explanation: 'On server versions Enable-PSRemoting creates a Public-profile rule limited to the local subnet, shown by RemoteAddress LocalSubnet. It can be widened with Set-NetFirewallRule -RemoteAddress Any after considering the risk. The other options are not how the rule works.' },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13B,
    stem: 'What Hyper-V virtual machine generation is required to meet the UEFI and Secure Boot prerequisites for Azure Arc-enabled Hotpatch? Enter the number.',
    answer: ['2', 'generation 2', 'gen 2'],
    explanation: 'Generation 2 VMs use UEFI with Secure Boot support. Generation 1 VMs use BIOS and cannot meet the VBS prerequisite.' },
  { topic: '1.3', type: 'order', difficulty: 3, lesson: L13B,
    stem: 'Put the Windows Server hotpatch calendar for one quarter in order (first at the top).',
    items: ['Baseline cumulative update installed, restart required', 'First month after baseline: hotpatch, no restart', 'Second month after baseline: hotpatch, no restart', 'Next baseline cumulative update, restart required'],
    explanation: 'The cycle is a baseline with a restart, then two hotpatch months without restarts, then the next baseline.' },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
