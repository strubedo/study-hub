export default [
  {
    id: 'd6-001',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. You deploy four servers that run Windows Server 2025 on hardware that meets all virtualization-based security requirements: DC1 is a domain controller, SRV1 is a domain member, SRV2 is in a workgroup, and SRV3 is a domain member that had Credential Guard explicitly disabled by Group Policy before it was upgraded from Windows Server 2022. The license requirements are met. On which servers is Credential Guard enabled by default?",
    options: [
      "SRV1 only",
      "DC1 and SRV1 only",
      "SRV1 and SRV2 only",
      "SRV1 and SRV3 only",
      "DC1, SRV1, SRV2 and SRV3",
    ],
    answer: [0],
    explanation: "Windows Server 2025 enables Credential Guard by default only on servers that meet the requirements, are **joined to a domain**, are **not domain controllers** and were **not explicitly configured to disable it**. Only SRV1 meets every condition.\n\n- DC1 is a domain controller.\n- SRV2 is not domain-joined.\n- SRV3's explicit disable is preserved across the upgrade.",
    lesson: '6.1-credguard-gpo-osconfig',
  },
  {
    id: 'd6-002',
    topic: '6.1',
    type: 'single',
    difficulty: 3,
    stem: "You have two Hyper-V hosts named HV1 and HV2 that run Windows Server 2025 and are members of contoso.com. They are not clustered. After an in-place upgrade from Windows Server 2022, live migrations initiated from HV1 fail. Credential Guard must remain enabled. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-VMHost -ComputerName HV1 | Format-List Name, VirtualMachineMigrationEnabled, VirtualMachineMigrationAuthenticationType

Name                                      : HV1
VirtualMachineMigrationEnabled            : True
VirtualMachineMigrationAuthenticationType : CredSSP

PS C:\\> (Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\\Microsoft\\Windows\\DeviceGuard -ComputerName HV1).SecurityServicesRunning
1
2`,
    options: [
      "Configure Kerberos constrained delegation on the HV1 and HV2 computer accounts for the cifs and Microsoft Virtual System Migration Service services, and set the migration authentication type on both hosts to Kerberos.",
      "Add the HV1 computer account to the Protected Users group.",
      "Set the Credential Guard Configuration policy on HV1 to Enabled with UEFI lock.",
      "Enable CredSSP delegation of default credentials by using Group Policy.",
    ],
    answer: [0],
    explanation: "`SecurityServicesRunning` contains **1**, so Credential Guard is running on HV1. With Credential Guard, CredSSP cannot delegate saved or single sign-on credentials, so CredSSP-based live migration from that host fails. The supported fix is **Kerberos constrained delegation** (or resource-based constrained delegation) with the hosts set to Kerberos authentication.\n\n- Computer accounts must not be added to Protected Users; authentication would fail.\n- UEFI lock changes how Credential Guard is locked, not CredSSP behaviour.\n- Credential Guard blocks delegated default credentials regardless of that policy.",
    lesson: '6.1-credguard-gpo-osconfig',
  },
  {
    id: 'd6-003',
    topic: '6.1',
    type: 'multi',
    difficulty: 2,
    stem: "SRV1 runs Windows Server 2025 with Credential Guard enabled. Which two authentication capabilities are blocked completely, even when the user types credentials when prompted? (Choose two.)",
    options: [
      "Kerberos unconstrained delegation",
      "Kerberos PKINIT that uses RSA key exchange instead of Diffie-Hellman",
      "Kerberos constrained delegation",
      "MS-CHAPv2 with credentials that the user enters at a prompt",
      "EAP-TLS certificate-based authentication",
    ],
    answer: [0, 1],
    explanation: "Credential Guard **blocks Kerberos unconstrained delegation and Kerberos PKINIT with RSA key exchange** for signed-in and supplied credentials alike (it also blocks DES, which Windows Server 2025 removes anyway).\n\n- Constrained delegation is the recommended replacement and works.\n- For MS-CHAPv2, NTLMv1 and Digest only **single sign-on** is blocked; a user who types credentials can still authenticate.\n- Certificate-based authentication is unaffected.",
    lesson: '6.1-credguard-gpo-osconfig',
  },
  {
    id: 'd6-004',
    topic: '6.1',
    type: 'fill',
    difficulty: 2,
    stem: "You query Win32_DeviceGuard in the root\\Microsoft\\Windows\\DeviceGuard namespace on a server. Which numeric value in the SecurityServicesRunning property indicates that Credential Guard is running?",
    answer: ['1'],
    explanation: "In `SecurityServicesRunning`, **1** means Credential Guard and **2** means memory integrity (hypervisor-protected code integrity). You can also check for the LsaIso.exe process or the msinfo32 field \"Virtualization-based security Services Running\".",
    lesson: '6.1-credguard-gpo-osconfig',
  },
  {
    id: 'd6-005',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "You deployed an exploit protection XML file to all servers by using Group Policy. The XML turns on Force randomization for images (Mandatory ASLR) at the system level. A line-of-business application named report.exe now crashes on SRV5. You must restore the application while keeping the mitigation for every other process. What should you do on the reference configuration that is deployed?",
    options: [
      "Add a program setting for report.exe that turns off Force randomization for images (Set-ProcessMitigation -Name report.exe -Disable ForceRelocateImages), export the configuration again and redeploy the XML.",
      "Turn off Force randomization for images at the system level.",
      "Unlink the exploit protection GPO from the OU that contains SRV5.",
      "Create an App Control for Business supplemental policy that allows report.exe.",
    ],
    answer: [0],
    explanation: "Program-level settings override system-level settings for that executable, so a **per-program override** for report.exe fixes the crash while every other process keeps Mandatory ASLR. Exporting and redeploying keeps the GPO-delivered XML as the source of truth.\n\n- Turning it off system-wide removes the protection everywhere.\n- Unlinking the GPO does **not** revert settings that the XML already applied.\n- App Control decides whether code may run; report.exe already runs and crashes because of the mitigation.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-006',
    topic: '6.1',
    type: 'order',
    difficulty: 2,
    stem: "You need to apply the same exploit protection configuration to all servers in the Servers OU by using Group Policy. In which order should you perform the actions?",
    items: [
      "Configure and test the mitigations on a reference server that does not receive the exploit protection GPO.",
      "Run Get-ProcessMitigation -RegistryConfigFilePath to export the configuration to an XML file.",
      "Copy the XML file to a share that the server computer accounts can read.",
      "Enable Use a common set of exploit protection settings in a GPO linked to the Servers OU and enter the UNC path of the XML file.",
    ],
    explanation: "Build the configuration on a machine without the GPO (GPO-delivered settings override local configuration), export it with `Get-ProcessMitigation -RegistryConfigFilePath`, publish it somewhere every target can read, and finally point the **Microsoft Defender Exploit Guard > Exploit Protection** policy at that path.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-007',
    topic: '6.1',
    type: 'single',
    difficulty: 3,
    stem: "On SRV5, Get-ProcessMitigation -System shows Bottom-up ASLR (BottomUp) set to ON and Force randomization for images (ForceRelocateImages) set to ON. Refer to the exhibit. Which settings apply to report.exe when it starts?",
    exhibit: `PS C:\\> Get-ProcessMitigation -Name report.exe

ProcessName                        : report.exe
Source                             : Registry
Id                                 : 0

DEP:
    Enable                         : NOTSET
    EmulateAtlThunks               : NOTSET

ASLR:
    BottomUp                       : NOTSET
    ForceRelocateImages            : OFF
    RequireInfo                    : NOTSET
    HighEntropy                    : NOTSET
...`,
    options: [
      "Bottom-up ASLR on; Mandatory ASLR off",
      "Bottom-up ASLR off; Mandatory ASLR off",
      "Bottom-up ASLR on; Mandatory ASLR on",
      "Bottom-up ASLR off; Mandatory ASLR on",
    ],
    answer: [0],
    explanation: "For program settings, **NOTSET** means the program inherits the **system-level** value, so Bottom-up ASLR is on. `ForceRelocateImages : OFF` is an explicit per-program override, so Mandatory ASLR is off for report.exe even though it is on system-wide.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-008',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "SRV4 runs Windows Server 2025 with an App Control for Business base policy in audit mode. The base policy includes rule option 17 (Enabled:Allow Supplemental Policies) and is used on 40 other servers. You plan to switch the policy to enforced mode. Refer to the exhibit. LogParser.exe must continue to run on SRV4 after enforcement, and the solution must minimise changes to the base policy. What should you do before enforcing?",
    exhibit: `Log Name:      Microsoft-Windows-CodeIntegrity/Operational
Source:        Microsoft-Windows-CodeIntegrity
Event ID:      3076
Computer:      SRV4.contoso.com
Description:
Code Integrity determined that a process (\\Device\\HarddiskVolume4\\Windows\\System32\\cmd.exe) attempted to load \\Device\\HarddiskVolume4\\Tools\\LogParser\\LogParser.exe that did not meet the Enterprise signing level requirements or violated code integrity policy (Policy ID:{6f1d2b7e-3c4a-4e59-9b1d-7a2c5e8f0d13}). However, due to code integrity auditing policy, the image was allowed to load.`,
    options: [
      "Create a supplemental policy that allows LogParser.exe, set its base policy ID to {6f1d2b7e-3c4a-4e59-9b1d-7a2c5e8f0d13}, and deploy it to SRV4.",
      "Do nothing; the event shows that LogParser.exe is allowed by the policy.",
      "Remove policy rule option 0 (Enabled:UMCI) from the base policy.",
      "Create an AppLocker executable rule that allows LogParser.exe.",
    ],
    answer: [0],
    explanation: "Event **3076** means the file **would have been blocked** and was allowed only because the policy is in audit mode. A **supplemental policy** tied to the base PolicyID adds an allow rule for LogParser.exe on SRV4 without editing the shared base policy.\n\n- After enforcement the same load would produce event 3077 and be blocked.\n- Removing UMCI stops the policy controlling user-mode code on every server.\n- An AppLocker allow rule cannot override an App Control block; both must allow a file.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-009',
    topic: '6.1',
    type: 'multi',
    difficulty: 2,
    stem: "You are choosing between App Control for Business and AppLocker for Windows Server 2025 servers. Which two statements describe App Control for Business? (Choose two.)",
    options: [
      "It can prevent unapproved kernel-mode drivers from loading.",
      "Its rules apply to every user on the device, including local administrators.",
      "It supports different rules for different users or groups on the same server.",
      "It is enforced by a user-mode service that administrators can stop.",
      "It requires the server to be joined to Microsoft Entra ID.",
    ],
    answer: [0, 1],
    explanation: "App Control for Business is enforced by **code integrity in the kernel**, covers **drivers** and applies **device-wide**, so administrators cannot bypass it.\n\n- Per-user or per-group rules are an AppLocker capability.\n- AppLocker depends on the Application Identity service; App Control does not.\n- Neither requires Entra ID join.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-010',
    topic: '6.1',
    type: 'fill',
    difficulty: 2,
    stem: "You are editing an App Control for Business policy XML. Which policy rule option number must you add with Set-RuleOption so the policy logs violations without blocking them? Type the number.",
    answer: ['3'],
    explanation: "Option **3, Enabled:Audit Mode**, logs event 3076 for files that would be blocked. Remove it later with `Set-RuleOption -FilePath <xml> -Option 3 -Delete` to enforce (event 3077 then marks blocks).",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-011',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "You must deploy one App Control for Business base policy and two supplemental policies to 20 servers that run Windows Server 2025. The servers are domain-joined but are not managed by Microsoft Intune or Configuration Manager. Which deployment method should you use?",
    options: [
      "A script that copies the {PolicyID}.cip files to each server and runs CiTool --update-policy for each file.",
      "The Deploy App Control for Business Group Policy setting.",
      "An AppLocker policy in a GPO linked to the servers' OU.",
      "Set-RuleOption -Option 16 on each policy file.",
    ],
    answer: [0],
    explanation: "Windows Server 2025 includes **CiTool**, which deploys multiple-policy-format base and supplemental policies, signed or unsigned. A script (or OSConfig) is the right tool without Intune or Configuration Manager.\n\n- The Group Policy setting supports only a **single** policy file in the legacy single-policy format, so it cannot deliver supplemental policies.\n- AppLocker is a different technology.\n- Option 16 (Update Policy No Reboot) changes behaviour; it does not deploy anything.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-012',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "On SRV6, you applied the Microsoft default App Control policies by using OSConfig. A colleague removed the policies by running citool --remove-policy, but several hours later they are active again. Refer to the exhibit. You need to remove the policies permanently. What should you do?",
    exhibit: `PS C:\\> citool -lp | findstr /I "WS2025"
Friendly Name: BlockUMCI_Microsoft_WS2025_Audit
Friendly Name: AllowMicrosoft_WS2025_Audit`,
    options: [
      "Run Remove-OSConfigDesiredConfiguration for the AppControl\\WS2025\\DefaultPolicy\\Audit and AppControl\\WS2025\\AppBlockList\\Audit scenarios.",
      "Run citool --remove-policy again and restart SRV6 immediately.",
      "Delete the policy files from C:\\Windows\\System32\\CodeIntegrity\\CiPolicies\\Active.",
      "Set the Deploy App Control for Business Group Policy setting to Disabled.",
    ],
    answer: [0],
    explanation: "OSConfig **drift control** re-establishes settings it manages (by default within about four hours), so removing the policies outside OSConfig does not stick. Remove them through OSConfig with `Remove-OSConfigDesiredConfiguration` for both scenarios.\n\n- CiTool or manual file deletion is undone by drift control.\n- The Group Policy setting was never used to deploy these policies.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-013',
    topic: '6.1',
    type: 'single',
    difficulty: 1,
    stem: "Users sign in to RDS session hosts that run Windows Server 2025. You must prevent users from running files downloaded from the internet that Microsoft Defender SmartScreen flags as unrecognised or malicious, without giving them the option to run the file anyway. Which Group Policy setting should you configure?",
    options: [
      "Windows Components > Windows Defender SmartScreen > Explorer > Configure Windows Defender SmartScreen: Enabled, Warn and prevent bypass",
      "Windows Components > Windows Defender SmartScreen > Explorer > Configure Windows Defender SmartScreen: Enabled, Warn",
      "Microsoft Edge > SmartScreen settings > Prevent bypassing Microsoft Defender SmartScreen prompts for sites: Enabled",
      "Windows Components > Windows Defender SmartScreen > Explorer > Configure Windows Defender SmartScreen: Disabled",
    ],
    answer: [0],
    explanation: "The Explorer **Configure Windows Defender SmartScreen** policy controls app and file reputation checks. **Warn and prevent bypass** removes the option to run the file.\n\n- **Warn** lets users click through.\n- The Edge \"prompts for sites\" policy covers websites, not files run from Explorer.\n- **Disabled** turns SmartScreen off.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-014',
    topic: '6.1',
    type: 'match',
    difficulty: 1,
    stem: "Match each requirement to the Windows Server 2025 feature that meets it.",
    pairs: [
      ["Allow only approved executables and drivers to run, for every user including administrators", "App Control for Business"],
      ["Force Mandatory ASLR and block child processes for a specific executable", "Exploit protection"],
      ["Warn before running unrecognised files downloaded from the internet", "Microsoft Defender SmartScreen"],
      ["Isolate NTLM hashes and Kerberos TGTs from LSASS memory", "Credential Guard"],
      ["Give each server a unique, rotated local administrator password stored in AD DS", "Windows LAPS"],
    ],
    explanation: "App Control is a kernel-enforced allow list; exploit protection applies memory and process mitigations; SmartScreen checks reputation of downloads; Credential Guard moves secrets into LsaIso.exe with VBS; Windows LAPS manages and backs up local administrator passwords.",
    lesson: '6.1-exploit-appcontrol-smartscreen',
  },
  {
    id: 'd6-015',
    topic: '6.1',
    type: 'single',
    difficulty: 1,
    stem: "DC4 is a new domain controller that runs Windows Server 2025. The Microsoft.OSConfig module is installed. You need to apply the Microsoft security baseline appropriate for DC4. Which command should you run?",
    options: [
      "Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/DomainController -Default",
      "Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/MemberServer -Default",
      "Set-OSConfigDesiredConfiguration -Scenario SecurityBaseline/WindowsServer/2025/WorkgroupMember -Default",
      "Set-OSConfigDesiredConfiguration -Scenario SecuredCore -Default",
    ],
    answer: [0],
    explanation: "OSConfig baselines are role-specific. A domain controller gets the **DomainController** scenario; member servers use MemberServer and standalone servers use WorkgroupMember. **SecuredCore** is a separate companion scenario for hardware-based protections, not the role baseline. A restart is required after applying.",
    lesson: '6.1-credguard-gpo-osconfig',
  },
  {
    id: 'd6-016',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "SRV7 runs Windows Server 2025 and has the OSConfig member server security baseline applied. Your auditors require the AuditDetailedFileShare setting to use a different value from the baseline default. The setting must stay protected from drift. What should you do?",
    options: [
      "Run Set-OSConfigDesiredConfiguration with the member server scenario, -Setting AuditDetailedFileShare and the required -Value.",
      "Change the setting by using auditpol.exe on SRV7.",
      "Remove the baseline, change the setting by using a GPO, and reapply the baseline.",
      "Create a GPO that sets the value and link it to the OU that contains SRV7.",
    ],
    answer: [0],
    explanation: "OSConfig supports **customising** a baseline setting with `-Setting` and `-Value`; drift control then enforces your value.\n\n- A local change with auditpol is treated as drift and reverted.\n- Reapplying the baseline resets the setting to the baseline default.\n- A GPO and OSConfig would fight over the same setting.",
    lesson: '6.1-credguard-gpo-osconfig',
  },
  {
    id: 'd6-017',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Windows LAPS backs up encrypted passwords to AD DS, and the policy uses the default authorized decryptor. User1 is a member of the Server Ops group, which was granted read permission by Set-LapsADReadPasswordPermission on the OU that contains SRV01. Refer to the exhibit, which User1 generated. User1 must be able to retrieve the password. What should you do?",
    exhibit: `PS C:\\> Get-LapsADPassword -Identity SRV01 -AsPlainText

ComputerName        : SRV01
DistinguishedName   : CN=SRV01,OU=Servers,DC=contoso,DC=com
Account             :
Password            :
PasswordUpdateTime  : 10/20/2026 8:14:02 AM
ExpirationTimestamp : 11/19/2026 8:14:02 AM
Source              : EncryptedPassword
DecryptionStatus    : Unauthorized
AuthorizedDecryptor : CONTOSO\\Domain Admins`,
    options: [
      "Set the Configure authorized password decryptors policy setting to CONTOSO\\Server Ops, and then force SRV01 to rotate its password.",
      "Run Set-LapsADReadPasswordPermission again for the Servers OU.",
      "Run Set-LapsADComputerSelfPermission for the Servers OU.",
      "Disable password encryption so that User1 can read the clear-text password.",
    ],
    answer: [0],
    explanation: "User1 can already **read** the attribute (the cmdlet returned the object), but `DecryptionStatus : Unauthorized` shows User1 is not the **authorized decryptor**, which defaults to Domain Admins. Set the authorized decryptor (`ADPasswordEncryptionPrincipal`) to Server Ops. The decryptor of an already-encrypted password cannot change, so force a rotation (for example `Set-LapsADPasswordExpirationTime` or `Reset-LapsPassword` on SRV01); the new password is encrypted for Server Ops.\n\n- Read permission is already in place.\n- Self permission lets computers write their passwords; it is not the issue.\n- Disabling encryption weakens security and also disables password history and DSRM backup.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-018',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. All domain controllers run Windows Server 2022. You configure a Windows LAPS GPO for the Domain Controllers OU with backup to Active Directory and Enable password backup for DSRM accounts. DSRM passwords are not backed up. Refer to the exhibit. What should you do first?",
    exhibit: `PS C:\\> Get-ADDomain | Format-List Name, DomainMode

Name       : contoso
DomainMode : Windows2012R2Domain

Event log on DC1 (Microsoft-Windows-LAPS/Operational):
Event ID 10006
LAPS password encryption is required but the Active Directory domain is not yet at 2016 domain functional level. The password was not updated and no changes will be made until this is corrected`,
    options: [
      "Raise the domain functional level to Windows Server 2016 or later.",
      "Change the backup directory for the domain controllers to Microsoft Entra ID.",
      "Disable the Enable password encryption setting in the GPO.",
      "Run Update-AdmPwdADSchema.",
    ],
    answer: [0],
    explanation: "DSRM password backup requires **encrypted** storage, and Windows LAPS encryption requires **domain functional level 2016**. The domain is at 2012 R2, as event 10006 confirms. Raise the DFL (all DCs already run Windows Server 2022, which supports DSRM backup; Windows Server 2019 or later is required). This domain could not contain a Windows Server 2025 DC yet, because promoting one requires DFL 2016 or later.\n\n- DSRM passwords cannot be backed up to Entra ID.\n- Disabling encryption makes DSRM backup impossible.\n- `Update-AdmPwdADSchema` is the legacy LAPS schema update.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-019',
    topic: '6.1',
    type: 'multi',
    difficulty: 2,
    stem: "You are deploying Windows LAPS for member servers in the OU=Servers,DC=contoso,DC=com OU with password backup to AD DS. Windows LAPS has never been used in the forest. Which two actions must you perform before the servers can back up their passwords? (Choose two.)",
    options: [
      "Run Update-LapsADSchema.",
      "Run Set-LapsADComputerSelfPermission -Identity 'OU=Servers,DC=contoso,DC=com'.",
      "Install the legacy LAPS client-side extension MSI on each server.",
      "Run Register-AzureADPasswordProtectionForest.",
      "Enable Microsoft Entra Local Administrator Password Solution in the Entra device settings.",
    ],
    answer: [0, 1],
    explanation: "AD backup needs the Windows LAPS **schema extension** (once per forest) and **self permission** on the OU so each computer can write its own password attributes.\n\n- Windows LAPS is built into Windows; no MSI is needed (the MSI is legacy LAPS).\n- Register-AzureADPasswordProtectionForest belongs to Entra Password Protection.\n- The Entra device setting is needed only for Entra ID backup.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-020',
    topic: '6.1',
    type: 'fill',
    difficulty: 2,
    stem: "You suspect that the Windows LAPS-managed local administrator password of SRV03 was disclosed. You are signed in to SRV03 as an administrator. Which cmdlet should you run on SRV03 to rotate the password immediately and back up the new password?",
    answer: ['Reset-LapsPassword'],
    explanation: "`Reset-LapsPassword` runs on the managed device and rotates the password at once, for both AD DS and Entra ID backup. From an admin workstation, `Set-LapsADPasswordExpirationTime` only marks the password expired so the device rotates it at its next hourly policy cycle.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-021',
    topic: '6.1',
    type: 'order',
    difficulty: 2,
    stem: "You are deploying Windows LAPS with AD DS backup for the first time in contoso.com. In which order should you perform the actions?",
    items: [
      "Run Update-LapsADSchema.",
      "Run Set-LapsADComputerSelfPermission on the OU that contains the servers.",
      "Link a GPO that sets Configure password backup directory to Active Directory.",
      "Run Invoke-LapsPolicyProcessing on a server to apply the policy.",
      "Run Get-LapsADPassword for that server to confirm the password was backed up.",
    ],
    explanation: "The schema attributes must exist before you can grant permissions on them, the computers need permission to write before the policy tells them to back up, and you can only retrieve a password after a device has processed the policy and written it.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-022',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "You have an Azure subscription that contains Azure VMs and Azure Arc-enabled on-premises servers that run Windows Server 2025. You need file integrity monitoring for all the servers and just-in-time access for the Azure VMs. The solution must use Microsoft Defender for Cloud. Which plan should you enable?",
    options: [
      "Defender for Servers Plan 2 on the subscription",
      "Defender for Servers Plan 1 on each server resource",
      "The free foundational CSPM capabilities",
      "Defender for Servers Plan 1 on the subscription",
    ],
    answer: [0],
    explanation: "**File integrity monitoring** and **just-in-time VM access** are **Plan 2** features. Plan 2 is enabled at subscription level (it cannot be enabled per resource).\n\n- Plan 1 focuses on Defender for Endpoint integration and does not include FIM or JIT.\n- Foundational CSPM provides posture recommendations but not these workload protections.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-023',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "You try to enable file integrity monitoring for servers in an Azure subscription, but the option is unavailable. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-AzSecurityPricing -Name "VirtualMachines" | Format-Table Name, PricingTier, SubPlan

Name            PricingTier SubPlan
----            ----------- -------
VirtualMachines Standard    P1`,
    options: [
      "Run Set-AzSecurityPricing -Name 'VirtualMachines' -PricingTier 'Standard' -SubPlan 'P2'.",
      "Run Set-AzSecurityPricing -Name 'VirtualMachines' -PricingTier 'Free'.",
      "Install the Azure Monitor Agent on every server.",
      "Onboard the servers directly to Microsoft Defender for Endpoint.",
    ],
    answer: [0],
    explanation: "The subscription runs Defender for Servers **Plan 1** (`SubPlan P1`). File integrity monitoring requires **Plan 2**, so change the sub-plan to P2.\n\n- The Free tier removes Defender for Servers entirely.\n- FIM in Defender for Servers Plan 2 collects data through the Defender for Endpoint sensor; installing AMA does not unlock it.\n- Direct MDE onboarding gives only Plan 1 capabilities.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-024',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "You have 30 on-premises servers that run Windows Server 2025. They were onboarded directly to Microsoft Defender for Endpoint by using an onboarding script. Defender for Servers Plan 2 is enabled on your Azure subscription. You need the servers to support file integrity monitoring and OS baseline misconfiguration assessment against the Microsoft cloud security benchmark. What should you do?",
    options: [
      "Onboard the servers to Azure Arc in the subscription that has Defender for Servers Plan 2 enabled.",
      "Re-run the Defender for Endpoint onboarding script with the Plan 2 option.",
      "Install the Log Analytics agent on each server.",
      "Enable Defender for Servers Plan 1 on each server resource.",
    ],
    answer: [0],
    explanation: "Full Defender for Servers functionality for non-Azure machines requires them to be **Azure Arc-enabled servers** in the subscription. Servers onboarded directly to Defender for Endpoint get Plan 1 features plus, under Plan 2, only the premium Defender Vulnerability Management features. FIM and the MCSB OS baseline assessment need Azure Arc (the baseline check runs through the Azure Machine Configuration extension).\n\n- There is no Plan 2 option in the MDE onboarding script.\n- The Log Analytics agent is retired.\n- Plan 1 includes neither feature, and these servers are not Azure resources yet.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-025',
    topic: '6.1',
    type: 'single',
    difficulty: 2,
    stem: "SQL1 runs Windows Server 2025. App servers in 10.10.20.0/24 cannot connect to SQL1 on TCP 1433, although the network path is open. Refer to the exhibit. Only the app servers must be able to connect to TCP 1433. What should you do?",
    exhibit: `PS C:\\> Get-NetFirewallRule -DisplayName "SQL*" | Format-Table DisplayName, Enabled, Direction, Action, Profile -AutoSize

DisplayName          Enabled Direction Action Profile
-----------          ------- --------- ------ -------
SQL allow app subnet    True   Inbound  Allow  Domain
SQL block all           True   Inbound  Block     Any

PS C:\\> Get-NetFirewallRule -DisplayName "SQL*" | Get-NetFirewallPortFilter | Format-Table Protocol, LocalPort
Protocol LocalPort
-------- ---------
TCP      1433
TCP      1433

PS C:\\> Get-NetFirewallRule -DisplayName "SQL allow app subnet" | Get-NetFirewallAddressFilter | Format-Table RemoteAddress
RemoteAddress
-------------
10.10.20.0/255.255.255.0`,
    options: [
      "Remove or disable the SQL block all rule; the default inbound action already blocks other sources.",
      "Change the processing order so that the allow rule is evaluated first.",
      "Change the profile of the allow rule to Any.",
      "Set the default inbound action of the Domain profile to Allow.",
    ],
    answer: [0],
    explanation: "In Windows Firewall a matching **block rule wins over an allow rule** (unless an authenticated allow rule overrides block rules). The explicit block for TCP 1433 from any address stops the app servers. Because the default inbound action is block, removing that rule leaves only the app subnet allowed.\n\n- Windows Firewall has no user-defined rule order.\n- The profile is not the problem; the block rule still wins.\n- Allowing all inbound traffic by default would expose every port.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-026',
    topic: '6.1',
    type: 'multi',
    difficulty: 3,
    stem: "SQL1 runs Windows Server 2025 in contoso.com. Only computers in the AD DS group AppServers may connect to SQL1 on TCP 1433, and those connections must be authenticated with IPsec. Which two configurations should you implement on SQL1? (Choose two.)",
    options: [
      "A connection security rule that requires inbound authentication by using computer Kerberos V5.",
      "An inbound firewall rule for TCP 1433 with the action Allow the connection if it is secure, limited to the authorized computers in AppServers.",
      "An authentication exemption rule for the AppServers computers.",
      "An outbound firewall rule that blocks TCP 1433 for all computers except AppServers.",
      "A tunnel-mode connection security rule that uses a preshared key.",
    ],
    answer: [0, 1],
    explanation: "The **connection security rule** makes connections use IPsec with Kerberos computer authentication, which gives SQL1 the identity of the remote computer. The **\"allow if secure\" firewall rule** with authorized computers then allows only AppServers members.\n\n- An authentication exemption does the opposite: it lets those computers connect without IPsec.\n- Outbound rules on SQL1 do not control inbound connections.\n- Tunnel mode with a preshared key is for gateway scenarios and does not identify individual computers.",
    lesson: '6.1-laps-defender-firewall',
  },
  {
    id: 'd6-027',
    topic: '6.2',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. The Default Domain Policy sets a minimum password length of 10. Refer to the exhibit. Which minimum password length applies to User1?",
    exhibit: `PS C:\\> Get-ADFineGrainedPasswordPolicy -Filter * | Format-Table Name, Precedence, MinPasswordLength, AppliesTo -AutoSize

Name  Precedence MinPasswordLength AppliesTo
----  ---------- ----------------- ---------
PSO-A         10                15 {CN=G-Admins,OU=Groups,DC=contoso,DC=com}
PSO-B         30                12 {CN=User1,OU=Staff,DC=contoso,DC=com}
PSO-C          5                20 {CN=G-IT,OU=Groups,DC=contoso,DC=com}

PS C:\\> Get-ADPrincipalGroupMembership -Identity User1 | Format-Table Name, GroupScope -AutoSize

Name         GroupScope
----         ----------
Domain Users     Global
G-Admins         Global
G-IT             Global`,
    options: [
      "12, from PSO-B",
      "20, from PSO-C",
      "15, from PSO-A",
      "10, from the Default Domain Policy",
    ],
    answer: [0],
    explanation: "A PSO linked **directly to the user** always wins over PSOs that apply through group membership, regardless of precedence. PSO-B is linked to User1, so its 12-character minimum applies.\n\n- PSO-C has the lowest precedence number among the group PSOs and would win only if no PSO were linked directly to User1.\n- PSO-A loses to PSO-C even among the group PSOs.\n- The domain policy applies only when no PSO applies.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-028',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. All user accounts in the OU named Finance must use a minimum password length of 16 characters. Other users must keep the domain policy. What should you do?",
    options: [
      "Create a global security group that contains the Finance users, create a PSO with a minimum length of 16, and apply the PSO to the group.",
      "Create a GPO that sets Minimum password length to 16 and link it to the Finance OU.",
      "Apply a PSO with a minimum length of 16 directly to the Finance OU.",
      "Modify the Default Domain Policy to require 16 characters and block inheritance on all other OUs.",
    ],
    answer: [0],
    explanation: "PSOs can be applied only to **users and global security groups**, so a shadow group mirroring the OU is the standard approach.\n\n- Account policies in a GPO linked to an OU affect only local accounts on computers in that OU.\n- PSOs cannot be linked to OUs.\n- Domain password policy cannot be scoped by blocking inheritance; it applies to all domain accounts.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-029',
    topic: '6.2',
    type: 'fill',
    difficulty: 1,
    stem: "Which ActiveDirectory module cmdlet returns the fine-grained password policy that is actually in effect for a specific user?",
    answer: ['Get-ADUserResultantPasswordPolicy'],
    explanation: "`Get-ADUserResultantPasswordPolicy -Identity <user>` returns the winning PSO (the value of msDS-ResultantPSO). If it returns nothing, the domain policy applies. In ADAC the equivalent is **View resultant password settings**.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-030',
    topic: '6.2',
    type: 'multi',
    difficulty: 2,
    stem: "You plan to deploy Microsoft Entra Password Protection for an on-premises AD DS forest. Which two statements are true? (Choose two.)",
    options: [
      "The DC agent service must be installed on every writable domain controller to guarantee that all password changes are validated.",
      "The proxy service runs on a domain-joined server that has outbound HTTPS access to Microsoft Entra ID.",
      "Each domain controller must have outbound internet access to download the banned password list.",
      "After deployment, existing weak passwords are detected and the users are forced to change them.",
      "The DC agent replaces the AD DS password complexity and length requirements.",
    ],
    answer: [0, 1],
    explanation: "DC agents validate only password changes sent to the DC they run on, so **every writable DC** needs the agent for consistent enforcement (RODCs forward password changes to a writable DC and do not need it). The **proxy** on a member server is the only component that talks to Entra ID.\n\n- DC agents need no internet access; they get policy through the proxy and cache it in SYSVOL.\n- Only new or reset passwords are checked.\n- It adds to, rather than replaces, AD password policy and PSOs.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-031',
    topic: '6.2',
    type: 'order',
    difficulty: 2,
    stem: "The Microsoft Entra Password Protection DC agent is already installed on every domain controller in contoso.com. You need to enforce the banned password lists while minimising disruption to users. In which order should you perform the remaining actions?",
    items: [
      "Install the Microsoft Entra Password Protection proxy service on two member servers.",
      "Run Register-AzureADPasswordProtectionProxy and Register-AzureADPasswordProtectionForest.",
      "In the Microsoft Entra admin center, enable password protection on Windows Server Active Directory in Audit mode.",
      "Review the DC agent Admin event logs for passwords that would have been rejected.",
      "Change the mode to Enforced.",
    ],
    explanation: "The registration cmdlets ship with the proxy, so install it first and then register the proxy and forest with the tenant. Start in **Audit** mode, use the DCAgent Admin logs to see the impact, and only then switch to **Enforced**.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-032',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "You installed the Microsoft Entra Password Protection proxy service on SRV1 and the DC agent on all domain controllers. The DC agent Admin log on each DC repeatedly records event 30017, stating that the agent cannot locate a proxy in the directory. You already ran Register-AzureADPasswordProtectionForest successfully. What should you do?",
    options: [
      "Run Register-AzureADPasswordProtectionProxy on SRV1.",
      "Allow outbound HTTPS from every domain controller to Microsoft Entra ID.",
      "Reinstall the DC agent on each domain controller.",
      "Set the mode to Enforced in the Microsoft Entra admin center.",
    ],
    answer: [0],
    explanation: "DC agents find proxies through objects that the proxy registration creates in AD DS. Event 30017 most often means the **proxy was never registered**. Register it, then allow AD replication to deliver the object to every DC.\n\n- DC agents never need direct internet access.\n- Reinstalling the agent does not create the missing proxy registration.\n- The mode does not help an agent that has no policy to apply.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-033',
    topic: '6.2',
    type: 'single',
    difficulty: 1,
    stem: "Microsoft Entra Password Protection proxies and DC agents are deployed and healthy in contoso.com. Users can still set the password Contoso2026! even though contoso is in the custom banned password list. Refer to the exhibit, which shows the tenant settings. What should you do?",
    exhibit: `Microsoft Entra admin center > Entra ID > Authentication methods > Password protection

Custom smart lockout
  Lockout threshold                                              : 10
  Lockout duration in seconds                                    : 60
Custom banned passwords
  Enforce custom list                                            : Yes
  Custom banned password list                                    : contoso, fabrikam, northwind
Password protection for Windows Server Active Directory
  Enable password protection on Windows Server Active Directory  : Yes
  Mode                                                           : Audit`,
    options: [
      "Change Mode to Enforced.",
      "Change Enforce custom list to No.",
      "Lower the lockout threshold to 5.",
      "Add Contoso2026! to the custom banned password list.",
    ],
    answer: [0],
    explanation: "In **Audit** mode, DC agents log passwords that violate the policy but still accept them. **Enforced** mode rejects them.\n\n- Turning off the custom list removes the protection for contoso.\n- Smart lockout settings concern sign-in attempts, not password changes.\n- Fuzzy matching already catches variants of contoso; the problem is the mode.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-034',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "To harden privileged identities, an administrator added the user account svc-sql, which runs the SQL Server service on SQL1, to the Protected Users group. The SQL Server service now fails to start with a logon failure. You must restore the service and keep strong protection for the service credentials. What should you do?",
    options: [
      "Remove svc-sql from Protected Users and migrate the service to a group managed service account.",
      "Configure svc-sql to use only DES encryption.",
      "Enable Credential Guard on SQL1.",
      "Mark svc-sql as trusted for delegation.",
    ],
    answer: [0],
    explanation: "Microsoft states that service and computer accounts must **never** be members of Protected Users: their authentication fails (\"the user name or password is incorrect\"), and the group adds little protection because their secret is always available on the host. A **gMSA** gives the service a long, random, automatically rotated password.\n\n- DES is not allowed for Protected Users and is removed in Windows Server 2025.\n- Credential Guard does not fix Protected Users restrictions for a service.\n- Trusting the account for delegation increases risk and members cannot be delegated anyway.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-035',
    topic: '6.2',
    type: 'multi',
    difficulty: 2,
    stem: "Your domain functional level is Windows Server 2025. You add the user account Admin2 to the Protected Users group. Which three restrictions apply to Admin2? (Choose three.)",
    options: [
      "Admin2 cannot authenticate by using NTLM.",
      "Admin2's Kerberos TGT is limited to four hours and cannot be renewed.",
      "Admin2 cannot be delegated by using constrained or unconstrained delegation.",
      "Admin2's account lockout threshold is reduced to three attempts.",
      "Admin2 must use a password of at least 15 characters.",
      "Admin2 can no longer use AES encryption for Kerberos.",
    ],
    answer: [0, 1, 2],
    explanation: "Domain controller-side protections for Protected Users are: **no NTLM**, no DES or RC4 in pre-authentication, **no delegation** and a **four-hour, non-renewable TGT**.\n\n- The group does not change lockout or password length; use PSOs for that.\n- AES is the only Kerberos encryption type members can use, not one they lose.",
    lesson: '6.2-password-policies-protected-users',
  },
  {
    id: 'd6-036',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Members of the Server-Admins group administer member servers. You must prevent them from signing in to domain controllers interactively or by using Remote Desktop. What should you do?",
    options: [
      "In a GPO linked to the Domain Controllers OU, add Server-Admins to Deny log on locally and Deny log on through Remote Desktop Services.",
      "In a GPO linked to the member servers OU, add Server-Admins to Deny log on locally and Deny log on through Remote Desktop Services.",
      "Add Server-Admins to the Protected Users group.",
      "Add Server-Admins to the Server Operators group.",
    ],
    answer: [0],
    explanation: "User rights for DCs come from GPOs linked to the **Domain Controllers OU**, and **deny** rights override allow rights.\n\n- The member servers OU controls rights on member servers, which would stop them doing their job.\n- Protected Users hardens authentication but does not stop sign-in.\n- Server Operators can sign in to DCs by default, the opposite of the goal.",
    lesson: '6.2-dc-hardening-admin-groups',
  },
  {
    id: 'd6-037',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Members of Domain Admins sometimes sign in to member servers and workstations, which exposes their credentials. You need to prevent Domain Admins accounts from signing in to those computers by any logon type. What should you do?",
    options: [
      "In a GPO linked to the OUs that contain member servers and workstations, add Domain Admins to Deny access to this computer from the network, Deny log on as a batch job, Deny log on as a service, Deny log on locally and Deny log on through Remote Desktop Services.",
      "In a GPO linked to the Domain Controllers OU, remove Domain Admins from Allow log on locally.",
      "Use Restricted Groups to remove Domain Admins from the local Administrators group on member computers.",
      "Enable Credential Guard on all member servers and workstations.",
    ],
    answer: [0],
    explanation: "Microsoft's guidance for securing Domain Admins is to **deny every logon right** for the group on member servers and workstations through GPOs linked to their OUs.\n\n- Changing rights on DCs affects where admins are supposed to sign in.\n- Removing them from local Administrators still allows them to sign in as ordinary users.\n- Credential Guard reduces theft but does not prevent sign-in.",
    lesson: '6.2-dc-hardening-admin-groups',
  },
  {
    id: 'd6-038',
    topic: '6.2',
    type: 'single',
    difficulty: 3,
    stem: "You delegated the Reset Password permission on the Branch1 OU to the Branch1-HelpDesk group. Help desk staff can reset passwords for every user in Branch1 except Admin7, whose account is also in Branch1. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-ADUser Admin7 -Properties adminCount, MemberOf | Format-List Name, DistinguishedName, adminCount, MemberOf

Name              : Admin7
DistinguishedName : CN=Admin7,OU=Branch1,DC=contoso,DC=com
adminCount        : 1
MemberOf          : {CN=Server Operators,CN=Builtin,DC=contoso,DC=com}

PS C:\\> (Get-Acl "AD:\\CN=Admin7,OU=Branch1,DC=contoso,DC=com").AreAccessRulesProtected
True`,
    options: [
      "Leave the permissions unchanged and have password resets for Admin7 performed by Tier 0 administrators, because the ACL of Admin7 is controlled by AdminSDHolder.",
      "Enable permission inheritance on the Admin7 object.",
      "Grant Branch1-HelpDesk the Reset Password permission on the AdminSDHolder object.",
      "Run the Delegation of Control Wizard on the Branch1 OU again.",
    ],
    answer: [0],
    explanation: "Admin7 is a member of a protected group (Server Operators), so **SDProp** on the PDC emulator sets `adminCount = 1`, disables inheritance and applies the **AdminSDHolder** ACL every hour. OU delegation therefore never reaches Admin7, by design. Privileged account resets belong with Tier 0 admins (and Admin7 probably should not be in Server Operators at all).\n\n- Re-enabling inheritance is reverted within an hour.\n- Granting rights on AdminSDHolder would let the help desk control every privileged account.\n- Rerunning the wizard changes nothing for a protected object.",
    lesson: '6.2-dc-hardening-admin-groups',
  },
  {
    id: 'd6-039',
    topic: '6.2',
    type: 'fill',
    difficulty: 2,
    stem: "Which background process, running on the PDC emulator every 60 minutes by default, copies the security descriptor of the AdminSDHolder object to members of protected groups?",
    answer: ['SDProp', 'SDPROP', 'Security Descriptor Propagator', 'SD Propagator', 'Security Descriptor Propagation'],
    explanation: "**SDProp** (Security Descriptor Propagator) runs on the PDC emulator, stamps the AdminSDHolder ACL onto protected accounts and groups and sets their adminCount attribute to 1.",
    lesson: '6.2-dc-hardening-admin-groups',
  },
  {
    id: 'd6-040',
    topic: '6.2',
    type: 'multi',
    difficulty: 1,
    stem: "You are reviewing membership of groups in contoso.com. According to Microsoft's least-privilege guidance, which two groups should normally have no members? (Choose two.)",
    options: [
      "Schema Admins",
      "Account Operators",
      "Domain Users",
      "Domain Computers",
      "Protected Users",
    ],
    answer: [0, 1],
    explanation: "**Schema Admins** should be populated only while a schema change is being made, and **Account Operators** (like Server, Backup and Print Operators) is a legacy group with broad rights, including local sign-in to DCs; use OU delegation instead.\n\n- Domain Users and Domain Computers are populated automatically.\n- Protected Users should contain your privileged user accounts.",
    lesson: '6.2-dc-hardening-admin-groups',
  },
  {
    id: 'd6-041',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Help desk staff in the Branch2-HelpDesk group must be able to reset passwords and force a password change at next sign-in for user accounts in the Branch2 OU only. The solution must follow the principle of least privilege. What should you do?",
    options: [
      "Run the Delegation of Control Wizard on the Branch2 OU and delegate the Reset user passwords and force password change at next logon task to Branch2-HelpDesk.",
      "Add Branch2-HelpDesk to the Account Operators group.",
      "Run the Delegation of Control Wizard on the domain root and delegate the Create, delete, and manage user accounts task to Branch2-HelpDesk.",
      "Add Branch2-HelpDesk to the Domain Admins group and use auditing to monitor their actions.",
    ],
    answer: [0],
    explanation: "The **Delegation of Control Wizard** on the **Branch2 OU** with the reset-password common task grants exactly the Reset Password right and the ability to set pwdLastSet for users in that OU.\n\n- Account Operators can manage most accounts in the domain and sign in to DCs.\n- Delegating at the domain root, and for full user management, grants far more scope and rights.\n- Domain Admins is the opposite of least privilege.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-042',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "A colleague ran the command shown in the exhibit on DC1. What can members of HD-Branch1 now do?",
    exhibit: `C:\\> dsacls "OU=Branch1,DC=contoso,DC=com" /I:S /G "CONTOSO\\HD-Branch1:WP;lockoutTime;user"
...
The command completed successfully`,
    options: [
      "Unlock user accounts in the Branch1 OU and its child OUs.",
      "Reset the passwords of user accounts in the Branch1 OU.",
      "Change the lockout policy for the Branch1 OU.",
      "Read, but not modify, the lockout status of users in Branch1.",
    ],
    answer: [0],
    explanation: "`WP;lockoutTime;user` grants **write property** on the **lockoutTime** attribute of **user** objects, and `/I:S` makes it inherit to sub-objects only. Writing lockoutTime to 0 is how an account is unlocked.\n\n- Resetting passwords needs the Reset Password extended right (`CA;Reset Password;user`).\n- Lockout policy is set by the domain policy or PSOs, not by OU permissions.\n- WP is a write permission, not read only.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-043',
    topic: '6.2',
    type: 'fill',
    difficulty: 2,
    stem: "In a dsacls /G grant, which two-letter permission code grants an extended right such as Reset Password?",
    answer: ['CA'],
    explanation: "`CA` is **control access**, used for extended rights such as Reset Password (for example `CONTOSO\\HelpDesk:CA;Reset Password;user`). `WP` and `RP` are write and read property; `CC` and `DC` are create and delete child.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-044',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "Your domain controllers run Windows Server 2025. You set KDC support for claims, compound authentication and Kerberos armoring to Fail unarmored authentication requests in the Default Domain Controllers Policy. Users of several older appliances and unmanaged devices can no longer authenticate. Devices that support armoring must continue to use it. What should you configure?",
    options: [
      "Change the KDC policy option to Supported.",
      "Change the KDC policy option to Not supported.",
      "Enable Fail authentication requests when Kerberos armoring is not available on all client computers.",
      "Add the users of the older devices to the Protected Users group.",
    ],
    answer: [0],
    explanation: "**Supported** makes DCs armor exchanges with clients that request it while still accepting unarmored requests from devices that cannot armor.\n\n- Not supported turns armoring off for everyone.\n- The client-side \"fail\" policy makes armoring mandatory on those clients; it does not help devices that cannot armor.\n- Protected Users adds restrictions and does not affect armoring.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-045',
    topic: '6.2',
    type: 'multi',
    difficulty: 3,
    stem: "You plan to create an authentication policy silo that allows Tier 0 administrators to obtain a TGT only from privileged access workstations in the PAWs group. The domain functional level is Windows Server 2025. Which two configurations are required for the device restriction to work? (Choose two.)",
    options: [
      "KDC support for claims, compound authentication and Kerberos armoring set to Supported or higher on all domain controllers.",
      "Kerberos client support for claims, compound authentication and Kerberos armoring enabled on the privileged access workstations.",
      "The Tier 0 administrators added to the Protected Users group.",
      "Credential Guard enabled on all domain controllers.",
      "NTLM disabled for the whole domain.",
    ],
    answer: [0, 1],
    explanation: "Device-based conditions in authentication policies depend on **Kerberos armoring**, which tells the KDC which computer the user is on. DCs need the **KDC** armoring policy and clients need the **Kerberos client** armoring policy.\n\n- Protected Users is a good companion but not required for silos.\n- Credential Guard is not enabled on DCs and is unrelated.\n- Disabling NTLM domain-wide is not a prerequisite.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-046',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "You plan to block NTLM in contoso.com. You must first identify which servers still receive NTLM pass-through authentication requests for domain accounts, without affecting any users. What should you do?",
    options: [
      "In a GPO linked to the Domain Controllers OU, configure Network security: Restrict NTLM: Audit NTLM authentication in this domain, and then review the NTLM Operational logs on the DCs.",
      "In a GPO linked to the Domain Controllers OU, set Network security: Restrict NTLM: NTLM authentication in this domain to Deny all.",
      "Set Network security: LAN Manager authentication level to Send NTLMv2 response only. Refuse LM & NTLM on all computers.",
      "Add all user accounts to the Protected Users group.",
    ],
    answer: [0],
    explanation: "The **Audit NTLM authentication in this domain** setting on DCs logs NTLM pass-through authentication without blocking it, and identifies the servers involved in the **Microsoft-Windows-NTLM/Operational** log.\n\n- Deny all blocks immediately, which affects users.\n- The LAN Manager level controls which NTLM variants are used; it neither audits nor shows where NTLM is used, and changes behaviour.\n- Protected Users blocks NTLM for members, which is also disruptive.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-047',
    topic: '6.2',
    type: 'single',
    difficulty: 2,
    stem: "A security assessment reports that an account in contoso.com is vulnerable to AS-REP roasting. Refer to the exhibit. The legacy application that used svc-legacy was updated and now supports standard Kerberos. What should you do?",
    exhibit: `PS C:\\> Get-ADUser -Filter 'DoesNotRequirePreAuth -eq $true' -Properties DoesNotRequirePreAuth | Format-Table SamAccountName, Enabled, DoesNotRequirePreAuth -AutoSize

SamAccountName Enabled DoesNotRequirePreAuth
-------------- ------- ---------------------
svc-legacy        True                  True`,
    options: [
      "Run Set-ADAccountControl -Identity svc-legacy -DoesNotRequirePreAuth $false.",
      "Run Set-ADAccountControl -Identity svc-legacy -AccountNotDelegated $true.",
      "Add svc-legacy to the Protected Users group.",
      "Run Set-ADUser -Identity svc-legacy -SmartcardLogonRequired $true.",
    ],
    answer: [0],
    explanation: "With **Do not require Kerberos preauthentication** set, anyone can request an AS-REP encrypted with the account's key and crack it offline. Turning pre-authentication back on removes the exposure.\n\n- \"Sensitive and cannot be delegated\" addresses delegation, not pre-authentication.\n- Service accounts must not be in Protected Users.\n- Requiring a smart card for interactive logon would break a service account.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-048',
    topic: '6.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each user account configuration to the risk or effect it has.",
    pairs: [
      ["Do not require Kerberos preauthentication", "Allows offline cracking of AS-REP responses (AS-REP roasting)"],
      ["Account is sensitive and cannot be delegated", "Prevents services from impersonating the account"],
      ["Store password using reversible encryption", "Makes the stored password equivalent to plain text"],
      ["Trusted for delegation (unconstrained) on a server", "Caches the TGTs of users who connect to that server"],
      ["Service principal name on a user account with a weak password", "Allows offline cracking of service tickets (Kerberoasting)"],
    ],
    explanation: "AS-REP roasting targets accounts without pre-authentication; the sensitive flag blocks delegation of the account; reversible encryption stores a recoverable password; unconstrained delegation leaves forwarded TGTs on the server; and Kerberoasting targets SPNs on accounts with crackable passwords (fix with gMSAs or dMSAs).",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-049',
    topic: '6.2',
    type: 'single',
    difficulty: 3,
    stem: "Service tickets issued for the web application that runs as svc-app use RC4 encryption. You must ensure that tickets for svc-app use AES without changing the account that the application uses. The account's password was last set after the domain reached a functional level that supports AES. Refer to the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-ADUser svc-app -Properties ServicePrincipalName, msDS-SupportedEncryptionTypes | Format-List SamAccountName, ServicePrincipalName, msDS-SupportedEncryptionTypes

SamAccountName                : svc-app
ServicePrincipalName          : {HTTP/app1.contoso.com}
msDS-SupportedEncryptionTypes : 4`,
    options: [
      "Run Set-ADUser -Identity svc-app -KerberosEncryptionType AES128,AES256.",
      "Run Set-ADAccountControl -Identity svc-app -UseDESKeyOnly $true.",
      "Add svc-app to the Protected Users group.",
      "Set Network security: LAN Manager authentication level to Send NTLMv2 response only. Refuse LM & NTLM.",
    ],
    answer: [0],
    explanation: "`msDS-SupportedEncryptionTypes : 4` means **RC4 only**, so the KDC issues RC4 tickets for the SPN. Setting the account to support **AES128 and AES256** (value 24) lets the KDC use AES; the AES keys already exist because the password was set at a suitable DFL. (The 2026 Kerberos RC4 hardening updates stop DCs assuming RC4 for accounts with **no** value set, but an explicit RC4-only value like this one is still honoured, so it must be changed.)\n\n- DES is insecure and removed in Windows Server 2025.\n- Service accounts must not be in Protected Users.\n- The LAN Manager level affects NTLM, not Kerberos ticket encryption.",
    lesson: '6.2-account-security-delegation-auth',
  },
  {
    id: 'd6-050',
    topic: '6.2',
    type: 'order',
    difficulty: 2,
    stem: "You need to block NTLM authentication for domain accounts in contoso.com while keeping a few legacy servers working. In which order should you perform the actions?",
    items: [
      "Configure Network security: Restrict NTLM: Audit NTLM authentication in this domain on the domain controllers.",
      "Review the NTLM Operational logs on the DCs to identify the servers that still use NTLM.",
      "Add the legacy servers to Network security: Restrict NTLM: Add server exceptions in this domain.",
      "Set Network security: Restrict NTLM: NTLM authentication in this domain to a Deny option.",
    ],
    explanation: "Audit first so nothing breaks, use the logs to find remaining NTLM dependencies, put the servers that cannot move to Kerberos on the DC exception list, and only then enable the deny setting.",
    lesson: '6.2-account-security-delegation-auth',
  },
];
