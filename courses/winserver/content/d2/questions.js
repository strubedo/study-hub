// Domain 2 — Manage Windows Server instances and workloads in a hybrid environment (10-15%). Question bank.
export default [
  {
    id: "d2-001",
    topic: "2.1",
    type: "single",
    difficulty: 1,
    stem: "Your network contains an AD DS domain named contoso.com. The domain contains a domain controller named DC1, a member server named Server1, and a Windows 11 workstation named Admin1. All servers run Windows Server 2025. You plan to deploy Windows Admin Center as a shared gateway that the entire IT team will use from their browsers. Where should you install Windows Admin Center?",
    options: [
      "On every server that will be managed",
      "On Server1, in gateway server mode",
      "On DC1, in gateway server mode",
      "On Admin1, in local client mode",
    ],
    answer: [1],
    explanation: `A shared gateway belongs on a **member server** running Windows Server 2016 or later, so **Server1** in gateway mode is right.

* Installing Windows Admin Center on a **domain controller is not supported**, so DC1 is out.
* Local client mode on Windows 11 is for a single administrator; other admins can't use it as a shared gateway.
* WAC manages nodes remotely over WinRM. Nothing needs to be installed on each managed server.`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-002",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "You have an Azure Arc-enabled server named Server1 that runs Windows Server 2022. An administrator installed Windows Admin Center on Server1 from the Azure portal. User1 has the Contributor role on the resource group that contains Server1. When User1 selects Connect on the Windows Admin Center blade, the connection fails. You need User1 to be able to use Windows Admin Center on Server1 by following the principle of least privilege. What should you do?",
    options: [
      "Assign User1 the Windows Admin Center Administrator Login role for Server1",
      "Add User1 to the local Administrators group on Server1",
      "Assign User1 the Azure Connected Machine Resource Administrator role for Server1",
      "Assign User1 the Owner role on the resource group",
    ],
    answer: [0],
    explanation: `Connecting to WAC in the Azure portal needs **Reader** plus the **Windows Admin Center Administrator Login** role on the machine resource. Contributor includes Reader-level visibility but not the WAC login data action, so assigning the WAC Administrator Login role at the Server1 scope is the least-privilege fix.

* WAC in Azure signs you in with Microsoft Entra ID; local group membership on Server1 isn't what the portal checks.
* Azure Connected Machine Resource Administrator manages the Arc resource and extensions; it doesn't grant the WAC login data action.
* Owner is far broader than needed (and Contributor already failed for the same reason).`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-003",
    topic: "2.1",
    type: "single",
    difficulty: 3,
    stem: "You have an Azure Arc-enabled server named Server1. Administrators already use SSH to Server1 through Azure Arc. You install Windows Admin Center on Server1 from the Azure portal by using port 6516. The AdminCenter extension shows Succeeded, but selecting Connect fails. You run the command shown in the exhibit on Server1. What should you do to resolve the issue?",
    exhibit: `C:\\> azcmagent config list
Local configuration setting
incomingconnections.ports (preview): 22`,
    options: [
      "Add an inbound rule for TCP 6516 to the perimeter firewall in front of Server1",
      "Create an inbound Windows Defender Firewall rule that allows TCP 6516 on Server1",
      "Run azcmagent config set incomingconnections.ports 6516",
      "Run azcmagent config set incomingconnections.ports 22,6516",
    ],
    answer: [3],
    explanation: `WAC in Azure reaches the server through the Arc agent's **reverse proxy**, and the agent only accepts proxied connections to ports listed in \`incomingconnections.ports\`. Only 22 is listed, so add 6516 **while keeping 22**, because SSH through Arc is still in use: \`azcmagent config set incomingconnections.ports 22,6516\`.

* Setting the value to \`6516\` alone fixes WAC but **replaces** the list, removing 22 and breaking the existing SSH access. (Appending with \`azcmagent config set incomingconnections.ports 6516 --add\` would also work.)
* No inbound port is needed for WAC on Arc servers - the session is built outbound - so neither a host firewall rule nor a perimeter rule is the fix.`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-004",
    topic: "2.1",
    type: "multi",
    difficulty: 2,
    stem: "You plan to use Windows Admin Center in the Azure portal to manage an on-premises Azure Arc-enabled server named Server1. Server1 sits behind a firewall that blocks all traffic unless it is explicitly allowed. Which three outbound HTTPS destinations must be allowed from Server1 for Windows Admin Center to work? (Choose three.)",
    options: [
      "*.servicebus.windows.net",
      "*.azure-automation.net",
      "Inbound TCP 6516 from the AzurePortal service tag",
      "*.vault.azure.net",
      "pas.windows.net",
      "*.service.waconazure.com (or the WindowsAdminCenter service tag)",
    ],
    answer: [0, 4, 5],
    explanation: `Windows Admin Center for Arc-enabled servers needs outbound HTTPS to **\`*.service.waconazure.com\`** (or the **WindowsAdminCenter** service tag) for the certificate/DNS service, **\`pas.windows.net\`** for Microsoft Entra ID, and **\`*.servicebus.windows.net\`** for the notification/relay channel (plus the normal Arc agent endpoints).

* No **inbound** rule is required; the connection is an outbound reverse proxy.
* \`*.azure-automation.net\` is for Hybrid Runbook Workers.
* \`*.vault.azure.net\` is Key Vault, not used by WAC.`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-005",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. You install Windows Admin Center in gateway mode on a server named WAC1. Administrators sign in to WAC1 with their domain accounts. When they connect to a server named Server1, they are prompted for credentials every time. You need to enable single sign-on from WAC1 to Server1 without storing credentials. Which command should you run?",
    options: [
      "Enable-WSManCredSSP -Role Server -Force (run on WAC1)",
      "Set-ADComputer -Identity (Get-ADComputer WAC1) -PrincipalsAllowedToDelegateToAccount (Get-ADComputer Server1)",
      "Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value Server1 (run on WAC1)",
      "Set-ADComputer -Identity (Get-ADComputer Server1) -PrincipalsAllowedToDelegateToAccount (Get-ADComputer WAC1)",
    ],
    answer: [3],
    explanation: `Browser to gateway to Server1 is a **double hop**. Microsoft's documented fix is **resource-based Kerberos constrained delegation** set on the **managed node** (the resource): Server1 lists WAC1 as a principal allowed to delegate to it.

* Reversing the objects (setting the attribute on WAC1) lets Server1 delegate to WAC1 - the wrong direction.
* CredSSP would cache credentials on the gateway and isn't how WAC SSO is configured.
* TrustedHosts only relaxes server authentication for NTLM; it doesn't delegate credentials.`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-006",
    topic: "2.1",
    type: "fill",
    difficulty: 2,
    stem: "You install the current release of Windows Admin Center on a Windows 11 workstation by using the default settings. Which TCP port does the browser use to connect to the local Windows Admin Center gateway? (Enter the port number only.)",
    answer: [
      "6600",
    ],
    explanation: "The modernized gateway (version 2410 and later, shown as **Windows Admin Center (v2)** in the Start menu) listens on **6600** on Windows client and **443** on Windows Server by default. The legacy gateway used 6516 for local client installs, which is why older material quotes 6516.",
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-007",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "Your company uses a Windows Admin Center gateway named WAC1 that runs version 2311 in a two-node failover cluster. You must move to the current Windows Admin Center release and keep the gateway available if a cluster node fails. What should you do?",
    options: [
      "Uninstall the existing gateway, then deploy the current release with the Deploy-GatewayV2Ha.Deploy.ps1 script to the cluster",
      "Run the current installer with /VERYSILENT on the active node; the cluster role is upgraded in place",
      "Deploy the current release on a single standalone server, because the modernized gateway doesn't support high availability",
      "Install the current release as a local client on two Windows 11 workstations behind a load balancer",
    ],
    answer: [0],
    explanation: `High-availability deployments on **2311 and older can't be upgraded directly** to the modernized gateway because of the architecture change - you uninstall and reinstall. HA support returned in **version 2511** through the \`Deploy-GatewayV2Ha.Deploy.ps1\` script, so redeploying with that script meets the availability requirement.

* An in-place upgrade of the HA role isn't supported.
* Version 2410 lacked HA, but current releases (2511 and later) support it again, so giving up HA is unnecessary.
* Local client mode is single-user and can't be load-balanced as a gateway.`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-008",
    topic: "2.1",
    type: "match",
    difficulty: 2,
    stem: "You are configuring access for Windows Admin Center. Match each role or group to what it allows.",
    pairs: [
      [
        "Gateway administrators",
        "Change gateway settings, install extensions and configure who can use the gateway",
      ],
      [
        "Gateway users",
        "Open the gateway and manage servers on which the user already has rights",
      ],
      [
        "Windows Admin Center Readers (on a managed node)",
        "View the managed server's settings without being able to change them",
      ],
      [
        "Windows Admin Center Hyper-V Administrators (on a managed node)",
        "Manage virtual machines and virtual switches on that host without full administrator rights",
      ],
      [
        "Windows Admin Center Administrator Login (Azure role)",
        "Connect to Windows Admin Center from the Azure portal for an Arc-enabled server or Azure VM",
      ],
    ],
    explanation: "Two layers exist. **Gateway** roles (Gateway users, Gateway administrators) control access to the WAC web service itself. **Role-based access control** on a managed node deploys JEA-backed local groups - *Windows Admin Center Administrators*, *Hyper-V Administrators* and *Readers* - that limit what users can do on that server without making them local admins. In the Azure portal, the **Windows Admin Center Administrator Login** Azure role (with Reader) is what lets a user connect.",
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-009",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. From Server1 you run the command shown in the exhibit. You can sign in to FS1 interactively and read \\\\FS1\\Reports. You need the command to succeed without caching credentials on Server2 and without requiring Domain Admins rights to configure the fix. What should you do?",
    exhibit: `PS C:\\> Invoke-Command -ComputerName Server2 -ScriptBlock { Get-ChildItem \\\\FS1\\Reports }
Access is denied
    + CategoryInfo          : PermissionDenied: (\\\\FS1\\Reports:String) [Get-ChildItem], UnauthorizedAccessException
    + FullyQualifiedErrorId : DirUnauthorizedAccessError,Microsoft.PowerShell.Commands.GetChildItemCommand
    + PSComputerName        : Server2`,
    options: [
      "Configure resource-based Kerberos constrained delegation on the Server2 computer object to allow FS1",
      "Enable CredSSP as a client on Server1 and as a server on Server2, then use -Authentication CredSSP",
      "Add FS1 to the TrustedHosts list on Server2",
      "Configure resource-based Kerberos constrained delegation on the FS1 computer object to allow Server2",
    ],
    answer: [3],
    explanation: `This is the **second hop**: Server2 has no reusable credential for FS1. **Resource-based constrained delegation** is configured on the **resource** - \`Set-ADComputer FS1 -PrincipalsAllowedToDelegateToAccount (Get-ADComputer Server2)\` - stores no credentials, and can be set by anyone with rights to write the FS1 object (no Domain Admins needed). The second hop here is SMB, which RBCD supports.

* Setting the attribute on Server2 points the trust the wrong way.
* CredSSP works but **caches credentials on Server2**, which the requirement forbids.
* TrustedHosts affects WinRM client server-authentication, not SMB delegation.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-010",
    topic: "2.1",
    type: "single",
    difficulty: 3,
    stem: "You have three servers named ServerA, ServerB and ServerC in an AD DS domain. Administrators connect from ServerA to ServerB with Enter-PSSession, and from inside that session must run Enter-PSSession to ServerC by using their own identity. The administrators' accounts aren't members of Protected Users. You need to make the second hop work. What should you configure?",
    options: [
      "Add ServerC to the TrustedHosts list on ServerB",
      "A JEA endpoint on ServerC that uses a virtual account",
      "CredSSP: Enable-WSManCredSSP -Role Client on ServerA and -Role Server on ServerB, then connect with -Authentication CredSSP",
      "Resource-based Kerberos constrained delegation on ServerC allowing ServerB",
    ],
    answer: [2],
    explanation: `When the second hop must itself be **PowerShell remoting (WinRM)**, resource-based constrained delegation doesn't help - Microsoft documents that RBCD **doesn't support the second hop for WinRM**. **CredSSP** delegates the user's credentials to ServerB so it can authenticate to ServerC as the user; it's configured as a client on ServerA (\`-DelegateComputer ServerB\`) and as a server on ServerB.

* A JEA endpoint on ServerC changes what runs on ServerC; it does nothing for the delegation from ServerB.
* TrustedHosts doesn't delegate credentials.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-011",
    topic: "2.1",
    type: "order",
    difficulty: 2,
    stem: "You need to deploy a Just Enough Administration (JEA) endpoint on a server named DNS1 so that members of CONTOSO\\DNS-Operators can restart only the DNS service. In which order should you perform the actions?",
    items: [
      "Create a PowerShell module folder that contains a RoleCapabilities subfolder",
      "Run New-PSRoleCapabilityFile to create DnsOperator.psrc in the RoleCapabilities folder",
      "Create DnsOps.pssc with -SessionType RestrictedRemoteServer and a RoleDefinitions entry for CONTOSO\\DNS-Operators, then run Register-PSSessionConfiguration -Name DnsOps -Path .\\DnsOps.pssc",
      "Run Get-PSSessionCapability -ConfigurationName DnsOps -Username CONTOSO\\User1 to confirm the effective commands",
      "Have users connect with Enter-PSSession -ComputerName DNS1 -ConfigurationName DnsOps",
    ],
    explanation: "The role capability file lives in the **RoleCapabilities** folder of a module on the module path, so the folder comes first, then the `.psrc`. The session configuration maps the group to the role by name and sets the restricted session type and run-as identity; **registering** it creates the endpoint (and restarts WinRM). `Get-PSSessionCapability` can only report on a registered endpoint whose role capability exists. Finally users connect by naming the endpoint with **-ConfigurationName**.",
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-012",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "You registered a JEA endpoint named PrintOps on Server1 by using the session configuration file shown in the exhibit. Members of CONTOSO\\Print-Operators who connect to PrintOps can run any cmdlet, including Stop-Computer, although the PrintOperator role capability exposes only print-related cmdlets. You need to restrict users to the role capability. What should you do?",
    exhibit: `@{
SchemaVersion = '2.0.0.0'
GUID = '6f2c1e8a-3b4d-4c7e-9a10-2d5b8e4f1c37'
SessionType = 'Default'
TranscriptDirectory = 'C:\\JEA\\Transcripts'
RunAsVirtualAccount = $true
RoleDefinitions = @{ 'CONTOSO\\Print-Operators' = @{ RoleCapabilities = 'PrintOperator' } }
}`,
    options: [
      "Move PrintOperator.psrc to C:\\JEA\\Transcripts",
      "Change RunAsVirtualAccount to $false",
      "Add LanguageMode = 'FullLanguage' to the file",
      "Change SessionType to 'RestrictedRemoteServer' and re-register the session configuration",
    ],
    answer: [3],
    explanation: `\`SessionType = 'Default'\` gives users the full default session, so every cmdlet is visible regardless of the role capability. JEA endpoints should use **\`RestrictedRemoteServer\`**, which starts from a locked-down NoLanguage session exposing only a few proxy commands plus what the role grants. Re-register the configuration after editing.

* Disabling the virtual account changes *who* commands run as, not *which* commands are visible.
* FullLanguage mode loosens the session further.
* Role capability files belong in a module's RoleCapabilities folder, not the transcript folder.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-013",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "You configured a JEA endpoint named DnsOps on a server named DNS1 and mapped CONTOSO\\DNS-Operators to a role capability. User1 is a member of DNS-Operators but not of any administrative group. User1 runs the command shown in the exhibit. What should User1 do?",
    exhibit: `PS C:\\> Enter-PSSession -ComputerName DNS1
Enter-PSSession : Connecting to remote server DNS1 failed with the following error message : Access is denied.
For more information, see the about_Remote_Troubleshooting Help topic.`,
    options: [
      "Run Enter-PSSession -ComputerName DNS1 -ConfigurationName DnsOps",
      "Run Enter-PSSession -ComputerName DNS1 -Authentication CredSSP",
      "Ask an administrator to run Enable-PSRemoting -Force on DNS1",
      "Ask an administrator to add User1 to the Remote Management Users group on DNS1",
    ],
    answer: [0],
    explanation: `Without **-ConfigurationName**, the session targets the default \`microsoft.powershell\` endpoint, which allows only administrators (and Remote Management Users). JEA users must name the JEA endpoint: \`-ConfigurationName DnsOps\`.

* CredSSP is about delegation and doesn't change which endpoint is used.
* Adding User1 to Remote Management Users would open a full, unrestricted remoting session on the default endpoint - the opposite of JEA.
* Remoting is already enabled; the error is authorization on the default endpoint.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-014",
    topic: "2.1",
    type: "single",
    difficulty: 3,
    stem: "You are creating a JEA endpoint on Server1. Help desk staff will use it to run a script that copies log files from Server1 to a share on FS1. The commands must run with an identity that can be granted permissions on the FS1 share, and no password should need to be managed. Which setting should you use in the session configuration file?",
    options: [
      "SessionType = 'Empty'",
      "RunAsVirtualAccountGroups = 'Backup Operators'",
      "RunAsVirtualAccount = $true",
      "GroupManagedServiceAccount = 'CONTOSO\\gmsaLogCopy'",
    ],
    answer: [3],
    explanation: `A **virtual account** is a local, temporary account; when it reaches the network it appears as the **computer account** of Server1, so you can't target it in a share ACL as a distinct identity. A **group managed service account** is a domain identity whose password AD manages automatically, so you can grant it rights on the FS1 share.

* \`RunAsVirtualAccountGroups\` changes the local groups the virtual account joins; it still has no domain identity.
* \`SessionType = 'Empty'\` controls the session's starting command set, not the run-as identity.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-015",
    topic: "2.1",
    type: "fill",
    difficulty: 2,
    stem: "You manage a JEA endpoint named DnsOps on DNS1. You need to list exactly which commands User1 will be able to run when connecting to the endpoint, without signing in as User1. Which cmdlet should you run? (Enter the cmdlet name only.)",
    answer: [
      "Get-PSSessionCapability",
    ],
    explanation: "`Get-PSSessionCapability -ConfigurationName DnsOps -Username CONTOSO\\User1` merges all role capabilities that apply to User1 through group membership and returns the resulting command list. `Get-PSSessionConfiguration` only lists endpoints; `Test-PSSessionConfigurationFile` only validates syntax.",
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-016",
    topic: "2.1",
    type: "match",
    difficulty: 2,
    stem: "Match each JEA element to its purpose.",
    pairs: [
      [
        ".psrc file",
        "Defines the visible cmdlets, functions and external commands for a role",
      ],
      [
        ".pssc file",
        "Maps users and groups to roles and sets the run-as identity and session type",
      ],
      [
        "Register-PSSessionConfiguration",
        "Creates the endpoint from a session configuration file and restarts WinRM",
      ],
      [
        "RunAsVirtualAccount",
        "Runs commands as a temporary local administrator account for the session",
      ],
      [
        "TranscriptDirectory",
        "Records an over-the-shoulder log of each JEA session",
      ],
    ],
    explanation: "A **role capability (.psrc)** says *what* a role can do and lives in a module's RoleCapabilities folder. A **session configuration (.pssc)** says *who* gets which role, as which identity, with which session type. **Register-PSSessionConfiguration** turns the .pssc into a live endpoint (WinRM restarts). **RunAsVirtualAccount** supplies the privileged temporary identity, and **TranscriptDirectory** enables transcripts.",
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-017",
    topic: "2.1",
    type: "multi",
    difficulty: 2,
    stem: "You have a workgroup server named Server9 with the IP address 172.16.5.20. From a domain-joined computer you run the command shown in the exhibit. Which two actions will each allow the connection to succeed? (Choose two.)",
    exhibit: `PS C:\\> Enter-PSSession -ComputerName 172.16.5.20 -Credential Server9\\Administrator
Enter-PSSession : Connecting to remote server 172.16.5.20 failed with the following error message : The WinRM client
cannot process the request. Default authentication may be used with an IP address under the following conditions: the
transport is HTTPS or the destination is in the TrustedHosts list, and explicit credentials are provided. Use
winrm.cmd to configure TrustedHosts.`,
    options: [
      "On Server9, set WSMan:\\localhost\\Service\\AllowUnencrypted to $true",
      "Configure an HTTPS listener with a certificate the client trusts on Server9 and connect with -UseSSL",
      "On the client, run Enable-PSRemoting -Force",
      "On the client, run Enable-WSManCredSSP -Role Client -DelegateComputer 172.16.5.20",
      "On the client, add 172.16.5.20 to WSMan:\\localhost\\Client\\TrustedHosts",
    ],
    answer: [1, 4],
    explanation: `Connecting by IP (or to a workgroup machine) rules out Kerberos, so WinRM falls back to NTLM, which can't authenticate the server. The error spells out the two ways to proceed: put the destination in the client's **TrustedHosts** list, or use **HTTPS**, where the certificate authenticates the server.

* CredSSP is for delegation, not for authenticating the server.
* AllowUnencrypted weakens transport security and doesn't address server authentication.
* Enable-PSRemoting configures the *listener* side; the client is already able to make outbound connections.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-018",
    topic: "2.1",
    type: "multi",
    difficulty: 3,
    stem: "You are evaluating resource-based Kerberos constrained delegation to solve a PowerShell remoting second-hop problem in which ServerB must access a file share on ServerC. Which two statements are true? (Choose two.)",
    options: [
      "User credentials are not cached on ServerB",
      "You configure it on the ServerC computer object by using the PrincipalsAllowedToDelegateToAccount parameter",
      "It lets ServerB open a WinRM PowerShell session to ServerC as the connecting user",
      "Configuring it requires membership in Domain Admins",
      "You enable it by running Enable-WSManCredSSP on ServerB",
      "It works for user accounts that are members of the Protected Users group",
    ],
    answer: [0, 1],
    explanation: `RBCD is set on the **resource's** object (ServerC) with \`-PrincipalsAllowedToDelegateToAccount\`, which writes \`msDS-AllowedToActOnBehalfOfOtherIdentity\`. It uses Kerberos S4U2proxy, so **no credentials are stored** on ServerB.

* It needs only rights to write the ServerC object, not Domain Admins.
* Microsoft documents that it **doesn't support WinRM** as the second hop.
* Protected Users (and accounts marked sensitive) can't be delegated by any method.
* Enable-WSManCredSSP configures CredSSP, a different technique.`,
    lesson: "2.1-powershell-remoting-jea",
  },
  {
    id: "d2-019",
    topic: "2.1",
    type: "multi",
    difficulty: 1,
    stem: "You deploy a new server named Server1 that runs Windows Server 2025 Datacenter with the default settings. You need to allow administrators to connect to Server1 by using SSH. Which two actions each achieve the goal? (Choose two.)",
    options: [
      "In Server Manager, on the Local Server page, set Remote SSH Access to Enabled",
      "Run Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 only",
      "Run Start-Service sshd and Set-Service -Name sshd -StartupType Automatic",
      "Run Install-WindowsFeature -Name OpenSSH-Server",
      "Run Enable-PSRemoting -Force",
    ],
    answer: [0, 2],
    explanation: `On Windows Server 2025, OpenSSH Server is **installed but not enabled**. You can enable it in Server Manager (**Remote SSH Access**) or by starting the \`sshd\` service and setting it to Automatic; setup creates the \`OpenSSH-Server-In-TCP\` firewall rule.

* Add-WindowsCapability is how you install it on 2019/2022; on 2025 it's already present and installing alone doesn't start the service.
* There is no \`OpenSSH-Server\` Windows feature for Install-WindowsFeature.
* Enable-PSRemoting configures WinRM, not SSH.`,
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-020",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "Server1 runs Windows Server 2025 with OpenSSH Server enabled. The relevant part of %ProgramData%\\ssh\\sshd_config is shown in the exhibit. Admin1 is a member of the local Administrators group on Server1. Admin1 copies their public key to C:\\Users\\admin1\\.ssh\\authorized_keys, but SSH sign-in fails as shown at the end of the exhibit. You need Admin1 to sign in by using the key. What should you do?",
    exhibit: `PubkeyAuthentication yes
PasswordAuthentication no

Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys

PS C:\\> ssh admin1@server1
admin1@server1: Permission denied (publickey).`,
    options: [
      "Set PasswordAuthentication yes and restart the sshd service",
      "Remove Admin1 from the local Administrators group",
      "Add the public key to C:\\ProgramData\\ssh\\administrators_authorized_keys and restrict the file's ACL to Administrators and SYSTEM",
      "Copy the private key to C:\\ProgramData\\ssh\\ssh_host_ed25519_key",
    ],
    answer: [2],
    explanation: `The \`Match Group administrators\` block makes sshd read keys for administrators from **\`%ProgramData%\\ssh\\administrators_authorized_keys\`**, not the user profile. That file must be writable only by **Administrators and SYSTEM**, or sshd ignores it.

* Enabling password authentication avoids keys rather than fixing them.
* Removing Admin1 from Administrators would make the profile file work but takes away the admin rights Admin1 needs.
* Host key files identify the *server*; never place a user's private key there.`,
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-021",
    topic: "2.1",
    type: "fill",
    difficulty: 2,
    stem: "Server1 runs OpenSSH Server. Administrators who connect over SSH land in cmd.exe. You need SSH sessions to start Windows PowerShell instead. You will create a string value under HKLM:\\SOFTWARE\\OpenSSH that contains the path to powershell.exe. What is the name of the value? (Enter the value name only.)",
    answer: [
      "DefaultShell",
    ],
    explanation: "OpenSSH for Windows reads **`HKLM:\\SOFTWARE\\OpenSSH\\DefaultShell`** to decide which shell to start: `New-ItemProperty -Path 'HKLM:\\SOFTWARE\\OpenSSH' -Name DefaultShell -Value 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe' -PropertyType String -Force`.",
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-022",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "Server2 runs Windows Server 2022 and receives updates only from a WSUS server. Server2 has no direct internet access. You run the command shown in the exhibit. You need to install OpenSSH Server on Server2. What should you do first?",
    exhibit: `PS C:\\> Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Add-WindowsCapability : Add-WindowsCapability failed. Error code = 0x800f0954`,
    options: [
      "Start the sshd service and set it to Automatic",
      "Upgrade Server2 to Windows Server 2025 Standard, because Windows Server 2022 doesn't support OpenSSH Server",
      "Run Install-WindowsFeature -Name OpenSSH-Server -Source D:\\sources\\sxs",
      "Configure the 'Specify settings for optional component installation and component repair' policy to use an alternate source, such as a Features on Demand share",
    ],
    answer: [3],
    explanation: `\`0x800F0954\` means the Feature on Demand payload couldn't be found on the update source - WSUS doesn't host FoD content. Point the **optional component installation and component repair** policy at an alternate source (a network FoD share) or allow it to contact Windows Update, then retry.

* OpenSSH is a capability, not a Windows feature, so Install-WindowsFeature doesn't apply.
* Windows Server 2019 and 2022 support OpenSSH Server; only the install method differs from 2025.
* There is no \`sshd\` service until the capability is installed.`,
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-023",
    topic: "2.1",
    type: "single",
    difficulty: 1,
    stem: "Your network contains an AD DS domain. You have a server named Server1 that has Remote Desktop enabled. Members of a group named Helpdesk must be able to sign in to Server1 by using Remote Desktop. Helpdesk members must not have administrative rights on Server1. What should you do?",
    options: [
      "Add Helpdesk to the local Administrators group and deny them the Change system time right",
      "Add Helpdesk to the local Remote Management Users group on Server1",
      "Add Helpdesk to the local Remote Desktop Users group on Server1",
      "Install the Remote Desktop Session Host role on Server1",
    ],
    answer: [2],
    explanation: `The **Allow log on through Remote Desktop Services** right is granted by default to Administrators and **Remote Desktop Users**, so adding Helpdesk to Remote Desktop Users is all that's needed.

* Remote Management Users grants WinRM/WMI access, not RDP.
* Administrators membership violates the requirement.
* The RD Session Host role (with CALs) is for multi-user session hosts; it isn't needed to let a group sign in.`,
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-024",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "You run the commands shown in the exhibit on Server1, which runs Windows Server 2025. Users report that Remote Desktop connections to Server1 time out. You need to allow Remote Desktop connections. What should you do?",
    exhibit: `PS C:\\> Get-ItemProperty 'HKLM:\\System\\CurrentControlSet\\Control\\Terminal Server' |
          Select-Object fDenyTSConnections

fDenyTSConnections
------------------
                 0

PS C:\\> Get-NetFirewallRule -DisplayGroup 'Remote Desktop' | Format-Table DisplayName, Enabled, Profile

DisplayName                          Enabled Profile
-----------                          ------- -------
Remote Desktop - User Mode (TCP-In)    False     Any
Remote Desktop - User Mode (UDP-In)    False     Any
Remote Desktop - Shadow (TCP-In)       False     Any`,
    options: [
      "Set the UserAuthentication value under RDP-Tcp to 0 to disable Network Level Authentication",
      "Run Enable-NetFirewallRule -DisplayGroup 'Remote Desktop'",
      "Run Enable-PSRemoting -Force",
      "Set fDenyTSConnections to 1",
    ],
    answer: [1],
    explanation: `\`fDenyTSConnections = 0\` means Remote Desktop is **allowed** on the host, but every rule in the **Remote Desktop** firewall group is disabled, so TCP/UDP 3389 is blocked and clients time out. Enable the rule group.

* Setting fDenyTSConnections to 1 *denies* RDP.
* Enable-PSRemoting opens WinRM, not RDP.
* Disabling NLA weakens security and wouldn't open the firewall; a timeout points to the network path, not authentication.`,
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-025",
    topic: "2.1",
    type: "single",
    difficulty: 3,
    stem: "Administrators use Remote Desktop to connect from privileged access workstations to Server1. After connecting, they often open \\\\FS1\\Admin from within the session, and access must use their own identity. You need to prevent the administrators' reusable credentials from being sent to Server1. What should the administrators use?",
    options: [
      "mstsc /remoteGuard",
      "mstsc /restrictedAdmin",
      "Network Level Authentication",
      "mstsc /admin",
    ],
    answer: [0],
    explanation: `**Remote Credential Guard** (\`mstsc /remoteGuard\`) keeps credentials on the client and redirects Kerberos requests back to it, so onward access to FS1 happens **as the administrator**.

* **Restricted Admin mode** also avoids sending credentials, but onward network access uses the **Server1 computer account**, not the user's identity.
* \`/admin\` connects to the console/admin session and offers no credential protection.
* NLA authenticates the user before the session starts but still delivers credentials to the host.`,
    lesson: "2.1-ssh-remote-desktop",
  },
  {
    id: "d2-026",
    topic: "2.1",
    type: "single",
    difficulty: 2,
    stem: "You have an Azure Arc-enabled server named Server1 in a branch office. Server1 runs Windows Server 2022, is licensed with Software Assurance, and is attested for Windows Server Management enabled by Azure Arc. Corporate policy forbids opening any inbound ports from the internet to Server1, and there is no VPN to the branch. Administrators need a graphical way to manage services, the registry, roles and features on Server1, and an occasional Remote Desktop session, from anywhere. What should you use?",
    options: [
      "A Windows Admin Center gateway installed on an Azure VM in a virtual network",
      "Just-in-time VM access in Microsoft Defender for Cloud",
      "Windows Admin Center in the Azure portal",
      "Azure Bastion deployed to a virtual network in the same region",
    ],
    answer: [2],
    explanation: `**Windows Admin Center in the Azure portal** works for Arc-enabled servers through an **outbound** reverse-proxy session created by the Arc agent - no inbound ports or VPN - and includes services, registry, roles and features and a Remote Desktop tool. It is one of the benefits of Windows Server Management enabled by Azure Arc, which Server1 is attested for.

* A gateway on an Azure VM would need network line-of-sight (WinRM) to the branch server.
* Azure Bastion reaches VMs by private IP inside Azure virtual networks (or connected networks), not an isolated branch server.
* JIT access works by opening NSG/Azure Firewall rules for Azure VMs; it doesn't apply to an on-premises server.`,
    lesson: "2.1-windows-admin-center",
  },
  {
    id: "d2-027",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You plan to onboard 400 on-premises servers to Azure Arc by running a script through Configuration Manager. The script will authenticate with a service principal. You need to assign a role to the service principal by following the principle of least privilege. Which role should you assign on the target resource group?",
    options: [
      "Contributor",
      "Azure Connected Machine Onboarding",
      "Hybrid Server Resource Administrator",
      "Azure Connected Machine Resource Administrator",
    ],
    answer: [1],
    explanation: `**Azure Connected Machine Onboarding** can create (onboard) Arc server resources but can't delete or otherwise manage them, which limits the impact of a leaked secret. Microsoft recommends a dedicated service principal with only this role, scoped to the landing resource group.

* Azure Connected Machine Resource Administrator can manage machines and extensions - more than onboarding needs.
* Contributor is far broader.
* Hybrid Server Resource Administrator is not the onboarding role.`,
    lesson: "2.2-azure-arc-servers",
  },
  {
    id: "d2-028",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "Server1 is an Azure Arc-enabled server in an on-premises datacenter. Yesterday the network team replaced the perimeter firewall rules. Today the Azure portal shows Server1 as Disconnected. You run the commands shown in the exhibit on Server1. What should you do?",
    exhibit: `C:\\> azcmagent show
Resource Name                           : Server1
Resource Group Name                     : RG-Arc
...
Location                                : eastus
...
Agent Status                            : Disconnected
Agent Last Heartbeat                    : 2026-10-28T03:12:44Z
...
Dependent Service Status
  Agent Service (himds)                 : running
  Extension Service (extensionservice)  : running
  GC Service (gcarcservice)             : running

PS C:\\> Test-NetConnection -ComputerName gbl.his.arc.azure.com -Port 443
WARNING: TCP connect to (52.168.112.66 : 443) failed

ComputerName           : gbl.his.arc.azure.com
RemoteAddress          : 52.168.112.66
RemotePort             : 443
InterfaceAlias         : Ethernet0
SourceAddress          : 10.20.1.15
PingSucceeded          : False
PingReplyDetails (RTT) : 0 ms
TcpTestSucceeded       : False`,
    options: [
      "Restart the himds service on Server1",
      "Run azcmagent disconnect and then azcmagent connect on Server1",
      "Ask the network team to allow outbound TCP 443 to *.his.arc.azure.com (the AzureArcInfrastructure service tag)",
      "Ask the network team to allow inbound TCP 443 from the AzureArcInfrastructure service tag to Server1",
    ],
    answer: [2],
    explanation: `All three agent services are running, but the agent can't open TCP 443 to the **hybrid identity service** endpoint, so heartbeats (one every 5 minutes) stop reaching Azure and the machine shows Disconnected within 15 to 30 minutes. The fix is to allow **outbound** HTTPS to \`*.his.arc.azure.com\` (covered by the AzureArcInfrastructure tag) along with the other required endpoints.

* Arc needs **no inbound** connectivity.
* Restarting himds won't fix a blocked network path - the service is already running.
* Reconnecting also needs the same endpoints and would fail; it isn't necessary once connectivity returns.`,
    lesson: "2.2-azure-arc-servers",
  },
  {
    id: "d2-029",
    topic: "2.2",
    type: "multi",
    difficulty: 2,
    stem: "Your firewall filters outbound traffic by Azure service tag. You are preparing to onboard Windows servers to Azure Arc. Which two service tags must you allow? (Choose two.)",
    options: [
      "Sql",
      "AzureActiveDirectory",
      "AzureBackup",
      "EventHub",
      "AzureSiteRecovery",
      "AzureArcInfrastructure",
    ],
    answer: [1, 5],
    explanation: "The Connected Machine agent needs **AzureActiveDirectory**, **AzureTrafficManager**, **AzureResourceManager**, **AzureArcInfrastructure** and **Storage** (plus AzureFrontDoor.Frontend from April 2026, and WindowsAdminCenter if used). Of the options listed, only AzureArcInfrastructure and AzureActiveDirectory are required. Sql, AzureBackup, AzureSiteRecovery and EventHub aren't part of the Arc agent requirements.",
    lesson: "2.2-azure-arc-servers",
  },
  {
    id: "d2-030",
    topic: "2.2",
    type: "fill",
    difficulty: 1,
    stem: "Before onboarding Server3 to Azure Arc, you want to verify that Server3 can reach every endpoint the Connected Machine agent requires for the East US region. Complete the command: azcmagent ____ --location eastus (Enter the missing subcommand.)",
    answer: [
      "check",
    ],
    explanation: "`azcmagent check --location eastus` tests connectivity (including TLS and private link resolution) to the required endpoints for that region. `show` reports agent state, `config` changes settings, and `connect` performs the registration.",
    lesson: "2.2-azure-arc-servers",
  },
  {
    id: "d2-031",
    topic: "2.2",
    type: "order",
    difficulty: 2,
    stem: "You need to onboard 200 on-premises Windows servers to Azure Arc with a script, without interactive sign-in. In which order should you perform the actions?",
    items: [
      "Create a service principal and assign it the Azure Connected Machine Onboarding role on the target resource group",
      "Generate the at-scale onboarding script in the Azure portal by using the service principal",
      "Run the script on each server to install the agent and run azcmagent connect",
      "Run azcmagent show on a sample of servers and confirm the status is Connected",
    ],
    explanation: "(The Microsoft.HybridCompute, Microsoft.GuestConfiguration and Microsoft.HybridConnectivity resource providers must also be registered before any server connects.) The service principal and its narrowly scoped role must exist before the portal can embed it in the at-scale script. The script installs the agent and calls `azcmagent connect --service-principal-id ...`. Finally, verify with `azcmagent show` or the portal.",
    lesson: "2.2-azure-arc-servers",
  },
  {
    id: "d2-032",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You have 50 Azure VMs and 120 Azure Arc-enabled servers, all running Windows Server 2022. You plan to assign built-in Azure Machine Configuration policies that audit security settings inside the operating systems. What must you deploy before the policies can report compliance?",
    options: [
      "A Log Analytics workspace and the Azure Monitor Agent on all 170 machines",
      "The Machine Configuration extension and a system-assigned managed identity on all 170 machines",
      "The Machine Configuration extension and a system-assigned managed identity on the Azure VMs only",
      "The Machine Configuration extension on the Arc-enabled servers only",
    ],
    answer: [2],
    explanation: `On **Azure VMs**, Machine Configuration needs the **Machine Configuration extension** and a **system-assigned managed identity** (the *Deploy prerequisites to enable Guest Configuration policies on virtual machines* initiative adds both). **Arc-enabled servers already include** the Machine Configuration service in the Connected Machine agent and always have a system-assigned identity, so nothing extra is deployed to them.

Machine Configuration doesn't use a Log Analytics workspace or the Azure Monitor Agent.`,
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-033",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You are creating a custom Azure Machine Configuration policy for Arc-enabled servers that sets the time zone to Central Standard Time. If an administrator changes the time zone later, it must be changed back automatically without any manual remediation. Which assignment type should the policy use?",
    options: [
      "Audit",
      "ApplyAndAutoCorrect",
      "AuditIfNotExists",
      "ApplyAndMonitor",
    ],
    answer: [1],
    explanation: `**ApplyAndAutoCorrect** applies the configuration and re-applies it whenever drift is detected.

* **ApplyAndMonitor** applies once and then only reports drift.
* **Audit** never changes the machine.
* **AuditIfNotExists** is an Azure Policy *effect*, not a machine configuration assignment type, and it only audits.`,
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-034",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You assign a built-in DeployIfNotExists policy that configures Arc-enabled Windows machines to run the Azure Monitor Agent. The assignment scope is a resource group that already contains 80 Arc-enabled servers. A day later, servers onboarded after the assignment have the agent, but the original 80 servers are listed as non-compliant and don't have the agent. What should you do?",
    options: [
      "Run azcmagent config set extensions.enabled true on each server",
      "Reassign the policy at the management group scope",
      "Create a remediation task for the policy assignment",
      "Change the policy effect to Audit",
    ],
    answer: [2],
    explanation: `DeployIfNotExists policies act automatically on resources that are **created or updated** after assignment. Resources that existed before are only flagged as non-compliant until you run a **remediation task**, which deploys the extension to them by using the assignment's managed identity.

* Audit would stop deployment entirely.
* The extension manager is enabled by default; the new servers prove it works.
* A broader scope doesn't remediate existing resources either.`,
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-035",
    topic: "2.2",
    type: "order",
    difficulty: 3,
    stem: "You need to create and deploy a custom Azure Machine Configuration policy that enforces a registry setting on Arc-enabled servers. In which order should you perform the actions?",
    items: [
      "Write a DSC configuration and compile it to a MOF file",
      "Run New-GuestConfigurationPackage with -Type AuditAndSet",
      "Upload the package .zip file to a storage account and generate a URI the machines can download from",
      "Run New-GuestConfigurationPolicy with the content URI and -Mode ApplyAndAutoCorrect",
      "Create the policy definition with New-AzPolicyDefinition and assign it",
    ],
    explanation: "Machine Configuration content is a compiled **DSC** configuration packaged by the **GuestConfiguration** module (you would normally test it locally with `Start-GuestConfigurationPackageRemediation` before publishing). Machines download the package from a URI, so it must be uploaded before you generate the policy definition JSON with `New-GuestConfigurationPolicy`, which embeds the content URI and hash. Finally create and assign the policy definition.",
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-036",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "Your domain controllers are Azure Arc-enabled so that the Azure Monitor Agent can send security events to Microsoft Sentinel. Security requires that nobody, including subscription Owners, can use Azure to run scripts or install other software on the domain controllers. What should you configure?",
    options: [
      "On each domain controller, run azcmagent config set extensions.allowlist \"Microsoft.Azure.Monitor/AzureMonitorWindowsAgent\" and azcmagent config set guestconfiguration.enabled false",
      "Assign an Azure Policy that denies the Microsoft.HybridCompute/machines/extensions resource type",
      "On each domain controller, run azcmagent config set extensions.blocklist \"Microsoft.Azure.Monitor/AzureMonitorWindowsAgent\"",
      "Remove the Contributor role from all users on the resource group that contains the domain controllers",
    ],
    answer: [0],
    explanation: `Local agent controls set with \`azcmagent config\` **can't be changed from Azure**, so an **allow list** that contains only the Azure Monitor Agent (plus disabling guest configuration, so a custom policy can't undo the restriction) blocks everything else, including Custom Script and Run Command.

* An Azure Policy deny can be modified or exempted by anyone with policy rights, which includes Owners.
* Removing Contributor doesn't stop Owners.
* A block list containing the AMA would block the one extension you need.`,
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-037",
    topic: "2.2",
    type: "single",
    difficulty: 3,
    stem: "Server1 is an Azure Arc-enabled server. A colleague with the Owner role tries to deploy the Key Vault extension (Microsoft.Azure.KeyVault/KeyVaultForWindows) to Server1 from the Azure portal, and the deployment fails because the extension isn't allowed. You run the command shown in the exhibit on Server1. The Azure Monitor Agent must keep working. What should you do?",
    exhibit: `C:\\> azcmagent config list
Local configuration setting
config.mode: full
extensions.allowlist: Microsoft.Azure.Monitor/AzureMonitorWindowsAgent
extensions.blocklist:
extensions.enabled: true
guestconfiguration.enabled: false
...`,
    options: [
      "Assign the colleague the Azure Connected Machine Resource Administrator role and retry from the portal",
      "On Server1, run azcmagent config set extensions.allowlist \"Microsoft.Azure.KeyVault/KeyVaultForWindows\"",
      "On Server1, run azcmagent config set config.mode monitor",
      "On Server1, run azcmagent config set extensions.allowlist \"Microsoft.Azure.Monitor/AzureMonitorWindowsAgent,Microsoft.Azure.KeyVault/KeyVaultForWindows\"",
    ],
    answer: [3],
    explanation: `An **allow list** blocks every extension not listed, and it can only be changed **locally** on the server - Azure roles can't override it. \`config set\` **replaces** the value, so include **both** the Azure Monitor Agent and the Key Vault extension. (Appending with \`azcmagent config set extensions.allowlist "Microsoft.Azure.KeyVault/KeyVaultForWindows" --add\` is equivalent.)

* Setting the list to only the Key Vault extension removes AMA from the list, so AMA updates, upgrades and reconfiguration would be blocked.
* No Azure role bypasses the local allow list - Microsoft states that not even Owner or Global Administrator can override it.
* Monitor mode swaps in a Microsoft-managed allow list of monitoring and security extensions that you can't edit while the mode is on, and it also disables remote connectivity; it is not a way to add the Key Vault certificate extension.`,
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-038",
    topic: "2.2",
    type: "match",
    difficulty: 2,
    stem: "You manage Azure Arc-enabled Windows servers. Match each VM extension type to its purpose.",
    pairs: [
      [
        "AzureMonitorWindowsAgent",
        "Collect event logs and performance counters defined by data collection rules",
      ],
      [
        "MDE.Windows",
        "Onboard the server to Microsoft Defender for Endpoint",
      ],
      [
        "CustomScriptExtension",
        "Download and run a script on the server",
      ],
      [
        "KeyVaultForWindows",
        "Keep certificates on the server in sync with Azure Key Vault",
      ],
      [
        "HybridWorkerForWindows",
        "Run Azure Automation runbooks locally on the server",
      ],
    ],
    explanation: "These are the common Windows extensions on Arc-enabled servers: the **Azure Monitor Agent** (replacing the retired Log Analytics agent), **MDE.Windows** deployed by Defender for Servers, the **Custom Script Extension**, the **Key Vault** certificate extension and the extension-based **Hybrid Runbook Worker**.",
    lesson: "2.2-arc-machine-configuration-extensions",
  },
  {
    id: "d2-039",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You use Azure Update Manager to patch 20 Azure VMs and 30 Azure Arc-enabled servers with one maintenance configuration. After the first scheduled run, all 30 Arc-enabled servers were patched, but none of the Azure VMs were. One-time updates work on the Azure VMs. What should you do?",
    options: [
      "Deploy the Azure Monitor Agent to the Azure VMs",
      "Enable periodic assessment on the Azure VMs",
      "Set the patch orchestration of the Azure VMs to Customer Managed Schedules",
      "Create a separate maintenance configuration for the Azure VMs with the Host maintenance scope",
    ],
    answer: [2],
    explanation: `Scheduled patching of **Azure VMs** requires patch orchestration to be **Customer Managed Schedules** (which sets AutomaticByPlatform and BypassPlatformSafetyChecksOnUserSchedule). **Arc-enabled servers have no such prerequisite**, which is why they patched.

* Periodic assessment controls scanning, not installation.
* Update Manager doesn't need the Azure Monitor Agent.
* The Host scope is for platform (host) maintenance, not guest OS updates; guest patching uses the Guest scope.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-040",
    topic: "2.2",
    type: "multi",
    difficulty: 2,
    stem: "You are creating a maintenance configuration in Azure Update Manager and plan to add a dynamic scope so that machines are included automatically. Which two criteria can you use to define the dynamic scope? (Choose two.)",
    options: [
      "Active Directory organizational unit",
      "WSUS computer group",
      "Resource groups",
      "Tags",
      "Installed applications",
      "Last boot time",
    ],
    answer: [2, 3],
    explanation: "Dynamic scopes filter Azure resources by **subscription, resource group, location, resource type, OS type and tags**, evaluated at run time. AD OUs, boot time, installed software and WSUS groups aren't Azure resource properties, so they can't be dynamic scope criteria.",
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-041",
    topic: "2.2",
    type: "single",
    difficulty: 3,
    stem: "Your company uses Azure Update Manager for the servers shown in the exhibit. All the Arc-enabled servers are Connected, and every server is assessed daily and patched monthly. Which server will incur Azure Update Manager charges?",
    exhibit: `Name    Platform             Arc ESU enabled  Windows Server Mgmt by Arc (SA attested)  Defender for Servers on subscription
------  -------------------  ---------------  ----------------------------------------  ------------------------------------
SRV-A   Arc-enabled server   No               No                                        Plan 1
SRV-B   Arc-enabled server   Yes              No                                        None
SRV-C   Azure VM             n/a              n/a                                       None
SRV-D   Arc-enabled server   No               Yes                                       None`,
    options: [
      "SRV-C",
      "SRV-B",
      "SRV-A",
      "SRV-D",
    ],
    answer: [2],
    explanation: "Update Manager is free for **Azure VMs** (SRV-C). For Arc-enabled servers it's charged per server per month (prorated daily) **unless** the server is enabled for **ESU through Arc** (SRV-B), its subscription has **Defender for Servers Plan 2**, or it is attested for **Windows Server Management enabled by Azure Arc** / uses pay-as-you-go (SRV-D). SRV-A has only **Plan 1**, which doesn't include Update Manager, so it is charged.",
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-042",
    topic: "2.2",
    type: "multi",
    difficulty: 2,
    stem: "You have 300 Azure Arc-enabled servers that run Windows Server 2022 with active Software Assurance. You plan to patch them with Azure Update Manager. You need to avoid per-server Update Manager charges. Which two actions each meet the goal? (Choose two.)",
    options: [
      "Enable Microsoft Defender for Servers Plan 2 on the subscription",
      "Disable periodic assessment and use only scheduled patching",
      "Enable Microsoft Defender for Servers Plan 1 on the subscription",
      "Attest the servers' Software Assurance to enable Windows Server Management enabled by Azure Arc",
      "Connect the servers to a Log Analytics workspace",
    ],
    answer: [0, 3],
    explanation: `Arc-enabled servers aren't charged for Update Manager when **Defender for Servers Plan 2** covers their subscription or when **Windows Server Management enabled by Azure Arc** applies - which requires you to explicitly **attest** Software Assurance (eligibility isn't inferred automatically).

* Plan 1 doesn't include it.
* A machine is billed for any day it is assessed **or** patched or associated with a schedule, so scheduled patching alone is still charged.
* Update Manager doesn't use Log Analytics for billing exemptions.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-043",
    topic: "2.2",
    type: "fill",
    difficulty: 1,
    stem: "You enable periodic assessment in Azure Update Manager for an Arc-enabled server. How often, in hours, does the automatic assessment scan run? (Enter a number.)",
    answer: [
      "24",
      "24 hours",
    ],
    explanation: "Periodic assessment checks for missing updates automatically every **24 hours**. You can also trigger a one-time **Check for updates** at any time.",
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-044",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You use an Azure Update Manager maintenance configuration to patch Arc-enabled servers that host a line-of-business application. The application service must be stopped gracefully on each server before updates are installed and started again afterwards. You need to automate this with minimal custom infrastructure. What should you configure?",
    options: [
      "The reboot setting Never reboot",
      "A Machine Configuration policy with the ApplyAndAutoCorrect assignment type",
      "Pre- and post-maintenance events on the maintenance configuration that trigger Azure Automation runbooks",
      "A dynamic scope that filters on the application tag",
    ],
    answer: [2],
    explanation: `Maintenance configurations can raise **pre- and post-maintenance events** through Event Grid, which can trigger an **Automation runbook** (or function/webhook) to stop the service before patching and start it afterwards.

* A dynamic scope only chooses *which* machines are patched.
* Never reboot doesn't stop the application.
* Machine Configuration enforces settings continuously and isn't tied to the maintenance window.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-045",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You need an Azure Automation runbook to clean up files on an on-premises server named Server7. Server7 has no inbound connectivity from the internet but can reach Azure outbound on TCP 443. Server7 is already Azure Arc-enabled. Which solution should you use?",
    options: [
      "Run the runbook in the Azure sandbox and connect to Server7 with Invoke-Command",
      "Add Server7 to an extension-based Hybrid Runbook Worker group and run the runbook on that group",
      "Install the Log Analytics agent on Server7 and register it as an agent-based Hybrid Runbook Worker",
      "Publish Server7 to the internet through a NAT rule so that the cloud job can reach it",
    ],
    answer: [1],
    explanation: `An **extension-based Hybrid Runbook Worker** runs jobs locally on the Arc-enabled server and communicates **outbound** on 443 to \`*.azure-automation.net\`.

* The agent-based worker (via the Log Analytics agent) was **retired on August 31, 2024**.
* Cloud sandbox jobs can't reach private on-premises resources.
* Publishing the server to the internet contradicts the security posture and isn't needed.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-046",
    topic: "2.2",
    type: "single",
    difficulty: 3,
    stem: "You imported the ActiveDirectory PowerShell module into an Azure Automation account and published a runbook that disables stale accounts. You run the runbook on a Hybrid Runbook Worker group, and the job fails as shown in the exhibit. What should you do?",
    exhibit: `Job ID  : 5b9c2e71-0d43-4f6a-a1c8-7e2f90b3d415
Runbook : Disable-StaleUsers
Ran on  : HWG-Dallas (Server7)
Status  : Failed

Get-ADUser : The term 'Get-ADUser' is not recognized as the name of a cmdlet, function, script file, or
operable program. Check the spelling of the name, or if a path was included, verify that the path is correct
and try again.`,
    options: [
      "Assign the Automation account's managed identity the User Administrator role in Microsoft Entra ID",
      "Install the RSAT-AD-PowerShell feature on Server7",
      "Run the runbook in the Azure sandbox instead of the Hybrid Runbook Worker group",
      "Re-import the ActiveDirectory module into the Automation account and publish the runbook again",
    ],
    answer: [1],
    explanation: `Jobs on a Hybrid Runbook Worker use modules **installed on the worker machine**; modules imported into the Automation account are used by cloud sandbox jobs and aren't copied to the worker. Installing **RSAT-AD-PowerShell** on Server7 makes \`Get-ADUser\` available.

* Re-importing to the account changes nothing on the worker.
* A sandbox job can't reach on-premises domain controllers.
* Entra ID roles don't affect on-premises AD cmdlets.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-047",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "You have an Azure Automation runbook that contains the code shown in the exhibit. The runbook now fails when it tries to retrieve the connection. You need the runbook to authenticate to Azure without storing secrets or certificates. What should you do?",
    exhibit: `$conn = Get-AutomationConnection -Name AzureRunAsConnection
Connect-AzAccount -ServicePrincipal -Tenant $conn.TenantID \`
    -ApplicationId $conn.ApplicationID -CertificateThumbprint $conn.CertificateThumbprint
Get-AzVM -ResourceGroupName RG1 -Status |
    Where-Object PowerState -eq 'VM running' | Stop-AzVM -Force`,
    options: [
      "Store a user name and password as a credential asset and call Connect-AzAccount -Credential",
      "Enable the Automation account's system-assigned managed identity, grant it the Virtual Machine Contributor role on RG1, and replace the connection code with Connect-AzAccount -Identity",
      "Create a new self-signed certificate asset named AzureRunAsConnection",
      "Create a new Run As account in the Automation account and renew its certificate",
    ],
    answer: [1],
    explanation: `**Run As accounts were retired on September 30, 2023** and can't be created or renewed. Use the Automation account's **managed identity**: enable it, give it only the Azure role it needs (Virtual Machine Contributor on RG1), and authenticate with \`Connect-AzAccount -Identity\`.

* A credential asset stores a password - the requirement is no secrets.
* Recreating certificate-based authentication still means managing a certificate.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-048",
    topic: "2.2",
    type: "single",
    difficulty: 2,
    stem: "A PowerShell runbook that exports data from an on-premises database runs for about five hours. When it runs as a cloud job in Azure Automation, it never completes and keeps starting over from the beginning. You need the runbook to complete. What should you do?",
    options: [
      "Increase the fair share limit on the Automation account to six hours",
      "Run the runbook on a Hybrid Runbook Worker",
      "Change the runtime version from PowerShell 5.1 to PowerShell 7.4",
      "Convert the runbook to a graphical runbook",
    ],
    answer: [1],
    explanation: `Cloud sandbox jobs are subject to **fair share**: jobs are unloaded after **3 hours**, and a PowerShell runbook restarts from the beginning (only workflows resume from checkpoints). Jobs on a **Hybrid Runbook Worker** don't have that limit and can also reach on-premises resources.

* Graphical runbooks are subject to the same sandbox limit.
* The fair share limit can't be raised.
* Changing the PowerShell version doesn't change sandbox limits.`,
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-049",
    topic: "2.2",
    type: "order",
    difficulty: 2,
    stem: "You have an Azure Automation account named AA1 that contains a published PowerShell runbook named Clean-Logs. You need Clean-Logs to run on an on-premises Azure Arc-enabled server named Server7. In which order should you perform the actions?",
    items: [
      "Create a Hybrid worker group named HWG-Dallas in AA1",
      "Add Server7 to HWG-Dallas from the group's Hybrid workers page",
      "Confirm that the HybridWorkerForWindows extension on Server7 shows Succeeded",
      "Start Clean-Logs and select Hybrid Worker with HWG-Dallas as the run target",
    ],
    explanation: "A machine is added to an existing Hybrid worker group, and adding it installs the extension-based worker (HybridWorkerForWindows) through the Arc agent. Wait for the extension to report Succeeded before sending jobs. Then start the published runbook targeting the group (`-RunOn HWG-Dallas` in PowerShell); without that target, the job runs in the Azure sandbox.",
    lesson: "2.2-update-manager-automation",
  },
  {
    id: "d2-050",
    topic: "2.2",
    type: "fill",
    difficulty: 2,
    stem: "You start a published runbook with Start-AzAutomationRunbook. You need the job to execute on the Hybrid Runbook Worker group named HWG-Dallas instead of in Azure. Which parameter should you add with the value HWG-Dallas? (Enter the parameter name.)",
    answer: [
      "RunOn",
      "-RunOn",
    ],
    explanation: "`Start-AzAutomationRunbook -AutomationAccountName AA1 -ResourceGroupName RG1 -Name MyRunbook -RunOn HWG-Dallas` sends the job to the named Hybrid Runbook Worker group. Without `-RunOn`, the job runs in the Azure sandbox.",
    lesson: "2.2-update-manager-automation",
  },
];
