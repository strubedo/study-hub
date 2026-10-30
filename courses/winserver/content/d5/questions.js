// Domain 5 — Manage storage and file services. Question bank d5-001 .. d5-070.
// Exhibits use String.raw so Windows paths keep their backslashes.
export default [
  // ---------------------------------------------------------------- 5.1 Azure Files
  {
    id: 'd5-001',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Your network contains an AD DS domain named contoso.com that syncs to Microsoft Entra ID. You have a storage account named storage1 that has AD DS authentication enabled for Azure Files and an SMB file share named share1. A scheduled task on Server1 runs as a group managed service account (gMSA) named gmsaReports$. The gMSA is not synced to Microsoft Entra ID and has Modify permissions in the Windows ACL of share1, but the task fails with "Access is denied". Refer to the exhibit. You need the task to access share1 while minimizing administrative effort. What should you do?',
    exhibit: String.raw`PS C:\> (Get-AzStorageAccount -ResourceGroupName RG1 -Name storage1).AzureFilesIdentityBasedAuth

DirectoryServiceOptions   : AD
ActiveDirectoryProperties : Microsoft.Azure.Commands.Management.Storage.Models.PSActiveDirectoryProperties
DefaultSharePermission    : None`,
    options: [
      'Set the default share-level permission of storage1 to Storage File Data SMB Share Contributor.',
      'Assign the Storage File Data SMB Share Contributor role on share1 to gmsaReports$.',
      'Assign the Contributor role on storage1 to the computer account of Server1.',
      'Enable Microsoft Entra Kerberos authentication on storage1.',
    ],
    answer: [0],
    explanation: "Access to an Azure file share needs **both** a share-level permission and a Windows ACL. The exhibit shows `DefaultSharePermission : None`, so identities without an explicit RBAC assignment have no share-level access. A gMSA is not synced to Microsoft Entra ID, so it cannot receive an RBAC assignment; the **default share-level permission** is the supported way to give non-synced identities (gMSAs, sMSAs, computer accounts) share access, after which the Windows ACL (Modify) controls what it can do.\n\n- Assigning an SMB data role to gmsaReports$ is impossible because there is no Entra object for it.\n- **Contributor** on the storage account is control-plane access; it grants no SMB data access, and computer accounts have no Entra identity anyway.\n- Microsoft Entra Kerberos is a different identity source; a storage account supports only one at a time, and it would not help a non-synced on-premises gMSA.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-002',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'You have an Azure file share named share1 that uses AD DS authentication. Members of a synced group named Group1 must be able to read, write and delete files in share1 over SMB and must also be able to modify Windows ACLs on folders they own. The solution must follow the principle of least privilege. Which role should you assign to Group1 on share1?',
    options: [
      'Storage File Data SMB Share Reader',
      'Storage File Data SMB Share Contributor',
      'Storage File Data SMB Share Elevated Contributor',
      'Storage File Data Privileged Contributor',
    ],
    answer: [2],
    explanation: "**Storage File Data SMB Share Elevated Contributor** grants read, write and delete plus the right to modify ACLs, which is exactly the requirement.\n\n- *Reader* allows read only.\n- *Contributor* allows read, write and delete but **not** changing ACLs.\n- *Privileged Contributor* grants read/write/ACL access that **overrides existing Windows ACLs**, which is more than required and breaks least privilege.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-003',
    topic: '5.1',
    type: 'multi',
    difficulty: 1,
    stem: 'You plan to enable identity-based authentication over SMB for an Azure storage account so that users can access file shares with their own identities instead of the storage account key. Which three identity sources can you enable on the storage account? (Choose three.)',
    options: [
      'On-premises Active Directory Domain Services (AD DS)',
      'Microsoft Entra Domain Services',
      'Microsoft Entra Kerberos',
      'Microsoft Entra ID with NTLMv2 using the cloud password hash',
      'LDAP simple bind against an on-premises domain controller',
      'Shared access signature (SAS) tokens presented over SMB',
    ],
    answer: [0, 1, 2],
    explanation: "Azure Files supports three identity sources for SMB, all based on **Kerberos**: on-premises **AD DS** (the storage account is represented by a computer or service logon account), **Microsoft Entra Domain Services** (managed domain), and **Microsoft Entra Kerberos** (Entra ID issues the ticket, for hybrid identities and, in preview, cloud-only identities). Only one can be enabled at a time.\n\n- NTLMv2 is accepted only with the storage account key, not with user identities from Entra ID.\n- LDAP simple bind is not an SMB authentication method.\n- SAS tokens authorize REST (FileREST) requests, not SMB sessions.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-004',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'Your company has a hybrid identity deployment synced by Microsoft Entra Connect Sync. Users work from home on Microsoft Entra hybrid joined Windows 11 devices without a VPN, and outbound TCP 445 is permitted from their home networks. The users must map an Azure file share by using their own identities, and the devices have no line of sight to any domain controller. Which identity source should you enable on the storage account?',
    options: [
      'On-premises AD DS authentication',
      'Microsoft Entra Domain Services authentication',
      'Microsoft Entra Kerberos authentication',
      'Storage account key stored with cmdkey on each device',
    ],
    answer: [2],
    explanation: "**Microsoft Entra Kerberos** lets Entra ID issue the Kerberos ticket for the file share, so hybrid (and cloud-only) users can authenticate from Entra joined or hybrid joined devices **without line of sight to a domain controller**.\n\n- AD DS authentication requires the client to reach a DC to obtain a ticket.\n- Entra Domain Services requires clients joined to the managed domain, which these devices are not.\n- The storage account key is not the user's identity and bypasses all permissions.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-005',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Users in your main office cannot map an Azure file share named share1 in a storage account named storage1. Refer to the exhibit, which was run on a client in the office. The internet service provider will not change its filtering. You need to provide users in the office with access to the data in share1. Which two solutions achieve the goal? Each correct answer presents a complete solution. (Choose two.)',
    exhibit: String.raw`PS C:\> Test-NetConnection -ComputerName storage1.file.core.windows.net -Port 445
WARNING: TCP connect to (20.60.12.36 : 445) failed
WARNING: Ping to 20.60.12.36 failed with status: TimedOut

ComputerName           : storage1.file.core.windows.net
RemoteAddress          : 20.60.12.36
RemotePort             : 445
InterfaceAlias         : Ethernet
SourceAddress          : 192.168.10.25
PingSucceeded          : False
PingReplyDetails (RTT) : 0 ms
TcpTestSucceeded       : False`,
    options: [
      'Deploy a site-to-site VPN to an Azure virtual network and create a private endpoint for storage1.',
      'Deploy Azure File Sync on an on-premises Windows Server, sync share1 to it, and have users map a share on that server.',
      'Change the SMB port of storage1 to TCP 443.',
      'Add the public IP address of the office to the storage1 firewall allow list.',
      'Enable SMB 1.0 on the office clients.',
    ],
    answer: [0, 1],
    explanation: "`TcpTestSucceeded : False` on port 445 shows outbound SMB is blocked (Azure Files does not answer ping, so that warning is expected and irrelevant).\n\n- A **VPN to a private endpoint** carries SMB inside the tunnel, so the ISP's 445 filter no longer applies.\n- **Azure File Sync** lets users use SMB on the LAN while the server talks to Azure over **HTTPS 443**; Azure File Sync never uses SMB to reach Azure.\n\nWrong: you cannot change the SMB port of an Azure storage account; a storage firewall rule does not bypass an ISP block upstream; SMB 1 is not supported by Azure Files and would still use port 445.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-006',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'You plan to migrate 8 TB of project archives from a file server to a new pay-as-you-go HDD Azure file share by using Robocopy. After the migration, the data will be read only a few times per month. You need to minimize total cost, including the migration. Which access tier should you select when you create the share?',
    options: [
      'Cool',
      'Hot',
      'Transaction optimized',
      'Premium',
    ],
    answer: [2],
    explanation: "A migration produces a very large number of write transactions. **Transaction optimized** has the lowest transaction prices, so Microsoft recommends creating the share in that tier for the migration, then moving to the tier that matches steady-state usage (here, cool) after observing real usage.\n\n- Starting in **cool** would make every migration write expensive (cool has the highest transaction prices).\n- **Hot** is a middle ground and still costs more than transaction optimized during the copy.\n- **Premium** is not a pay-as-you-go access tier; SSD shares use a provisioned billing model.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-007',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'You need to create an HDD-based Azure file share that has 2 TiB of capacity, 3,000 IOPS and 150 MiB/s of throughput. IOPS and throughput must be provisioned independently of capacity so that monthly cost is predictable. What should you create?',
    options: [
      'A StorageV2 account with the Standard_LRS SKU and a share in the hot access tier',
      'A FileStorage account with the Premium_LRS SKU',
      'A FileStorage account with the StandardV2_LRS SKU and a provisioned v2 share',
      'A StorageV2 account with the Standard_LRS SKU and a share in the transaction optimized access tier',
    ],
    answer: [2],
    explanation: "The **provisioned v2** model lets you provision storage, IOPS and throughput separately and bills on what you provision. HDD provisioned v2 shares require a **FileStorage** account with a `StandardV2_*` SKU (SSD uses `PremiumV2_*`).\n\n- StorageV2/Standard_LRS shares are **pay-as-you-go**: billed on usage and transactions, with no provisioned IOPS (tier choice changes price, not performance).\n- FileStorage/Premium_LRS is **SSD provisioned v1**, where IOPS and throughput are derived from provisioned capacity rather than set independently, and the requirement was HDD.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-008',
    topic: '5.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Users need to read, create, modify and delete files in an Azure file share over SMB, but must not be able to change Windows ACLs. What is the name of the built-in Azure RBAC role you should assign at the share scope?',
    answer: ['Storage File Data SMB Share Contributor', 'Storage File Data SMB Share Contributor role'],
    explanation: "**Storage File Data SMB Share Contributor** grants read, write and delete. *Elevated Contributor* adds ACL modification, and *Reader* is read only.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-009',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'You enable Microsoft Entra Kerberos authentication for an Azure storage account named storage1 and assign share-level roles to synced users. A Conditional Access policy requires multifactor authentication for all cloud apps. When users try to map the share from Microsoft Entra joined devices, they receive the error shown in the exhibit. You need users to be able to map the share. What should you do?',
    exhibit: String.raw`C:\> net use Z: \\storage1.file.core.windows.net\share1
System error 1327 has occurred.

Account restrictions are preventing this user from signing in. For example: blank passwords aren't allowed, sign-in times are limited, or a policy restriction has been enforced.`,
    options: [
      'Exclude the storage account application for storage1 from the Conditional Access policy.',
      'Assign the Storage File Data SMB Share Elevated Contributor role to the users.',
      'Set the default share-level permission to Storage File Data SMB Share Reader.',
      'Disable the Secure transfer required setting on storage1.',
    ],
    answer: [0],
    explanation: "Microsoft Entra Kerberos **does not support MFA** for Azure file share access. If a Conditional Access policy that requires MFA applies to the storage account's Entra application (named like `[Storage Account] storage1.file.core.windows.net`), ticket issuance fails and `net use` returns system error 1327. Exclude that application from the policy.\n\n- The users already have share-level roles; changing the role or the default permission does not address the sign-in restriction.\n- Disabling secure transfer weakens encryption and has nothing to do with Kerberos ticket issuance.",
    lesson: '5.1-azure-files-shares-permissions',
  },
  {
    id: 'd5-010',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'You have two Storage Sync Services named Sync1 and Sync2 in the same Azure region. A file server named FS1 is registered with Sync1 and has a server endpoint in a sync group named SG-Data. You need FS1 to also sync D:\\Marketing with a new Azure file share named marketing. What should you do?',
    options: [
      'Register FS1 with Sync2 as well, and create a sync group for marketing in Sync2.',
      'Create a new sync group in Sync1 that uses marketing as its cloud endpoint, and add D:\\Marketing on FS1 as a server endpoint.',
      'Add marketing as a second cloud endpoint in SG-Data.',
      'Install a second instance of the Azure File Sync agent on FS1 and register it with Sync2.',
    ],
    answer: [1],
    explanation: "A server can be registered with **only one Storage Sync Service** at a time, but it can have server endpoints in **many sync groups** within that service. So create a new sync group in Sync1 with the marketing share as its cloud endpoint and add the FS1 path as a server endpoint.\n\n- FS1 cannot be registered with Sync2 while registered with Sync1.\n- A sync group has **exactly one** cloud endpoint.\n- There is one agent per server; you cannot install a second instance.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-011',
    topic: '5.1',
    type: 'order',
    difficulty: 3,
    stem: 'Two file servers, FS1 and FS2, replicate D:\\Data by using DFS Replication. FS1 holds the complete data set. You have deployed a Storage Sync Service, created a sync group with a cloud endpoint, and installed and registered the Azure File Sync agent on both servers. You need to replace DFS Replication with Azure File Sync by following the Microsoft-supported migration sequence. In which order should you perform the actions?',
    items: [
      'Create a server endpoint for D:\\Data on FS1 with cloud tiering disabled',
      'Wait until all data from FS1 has uploaded to the Azure file share',
      'Disable DFS Replication',
      'Create a server endpoint for D:\\Data on FS2 with cloud tiering disabled',
      'Enable cloud tiering on the server endpoints that need it',
    ],
    explanation: "Microsoft's sequence: seed the cloud from the member with the full data set **without cloud tiering**, let the upload finish, **disable DFS-R** so the two replication engines do not fight over the same files, add the remaining members as server endpoints (again without tiering) and let them sync, then retire DFS-R and only **then** enable cloud tiering. Cloud tiering is not supported on volumes with DFS-R replicated folders, which is why it comes last.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-012',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'A server named FS1 runs Azure File Sync. Refer to the exhibit. Users report that files they last opened about 30 days ago are being recalled from Azure, which means they were tiered. What is the most likely reason those files were tiered?',
    exhibit: String.raw`Server endpoint : FS1 - D:\Data
Cloud tiering   : Enabled
  Volume free space policy : 40%
  Date policy              : Tier files not accessed for 120 days

Volume D:
  Capacity   : 1,024 GiB
  Free space : 389 GiB (38%)`,
    options: [
      'The volume free space policy takes precedence over the date policy, so the coldest files are tiered until 40% of D: is free.',
      'The date policy counts days since file creation, not since last access.',
      'The cloud tiering heatmap is reset every 24 hours, so all files are treated as cold.',
      'Files are tiered after 30 days by default regardless of the configured date policy.',
    ],
    answer: [0],
    explanation: "The **volume free space policy always wins**. D: has only 38% free against a 40% target, so Azure File Sync keeps tiering the coldest files (by heatmap) until 40% is free, even if they are younger than the 120-day date policy.\n\n- The date policy is based on last access (heatmap), not creation.\n- The heatmap is not reset daily; it is built from access history.\n- There is no fixed 30-day default; the date policy is optional and off unless configured.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-013',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'A file server named FS1 has two Azure File Sync server endpoints on the same volume, as shown in the exhibit. Which volume free space policy does Azure File Sync enforce?',
    exhibit: String.raw`Registered server : FS1     Volume : D: (2 TiB, NTFS)

Name          Path          Cloud tiering  Volume free space policy  Date policy
----          ----          -------------  ------------------------  -----------
SE-Projects   D:\Projects   Enabled        20%                       Disabled
SE-Archive    D:\Archive    Enabled        35%                       90 days`,
    options: [
      '20% for SE-Projects and 35% for SE-Archive',
      '35% for both server endpoints',
      '55% for the volume (the sum of both policies)',
      '20% for both server endpoints',
    ],
    answer: [1],
    explanation: "The volume free space policy applies to the **volume**, not to individual endpoints. When several server endpoints share a volume, the **highest** percentage becomes the effective policy for all of them, so D: keeps 35% free. Policies are not summed, and the lower value is not used. The date policy still applies per endpoint.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-014',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: 'You are checking the health of Azure File Sync on a server named FS1. Refer to the exhibit, which shows the most recent sync session event. You need to identify which files failed to sync and why. What should you review next?',
    exhibit: String.raw`Event Viewer > Applications and Services Logs > Microsoft > FileSync > Agent > Telemetry

Event ID : 9102
Logged   : 10/28/2026 2:14:51 AM
Event data (excerpt):
  SyncGroupName     : SG-Data
  SyncDirection     : Upload
  HResult           : 0
  SyncFileCount     : 1250
  AppliedFileCount  : 1213
  PerItemErrorCount : 37`,
    options: [
      'Event ID 9302 entries in the Telemetry log',
      'Event ID 9121 entries in the Telemetry log',
      'Event ID 9301 entries in the Telemetry log',
      'The Storage Sync Agent service (FileSyncSvc) startup type',
    ],
    answer: [1],
    explanation: "Event 9102 marks a completed session: `HResult 0` means the session itself succeeded, but `PerItemErrorCount 37` (1250 - 1213) shows individual items failed. **Event 9121** is logged per per-item error after the session, with the error code and persistent/transient counts, so it identifies what failed and why.\n\n- 9302 reports progress of an active session.\n- 9301 shows the server polling the service for jobs (connectivity).\n- The service is clearly running, since sessions complete.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-015',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'You manage an Azure File Sync deployment with 12 registered servers. You need to be notified by email within minutes if any registered server stops communicating with the Storage Sync Service. The solution must minimize administrative effort. What should you configure?',
    options: [
      'An Azure Monitor metric alert rule on the Storage Sync Service that uses the Server online status metric, with an action group that sends email',
      'An Azure Service Health alert for the Azure Files service in the region',
      'An activity log alert for the Register-AzStorageSyncServer operation',
      'Storage analytics logging on the storage account that hosts the cloud endpoint',
    ],
    answer: [0],
    explanation: "Azure File Sync emits metrics to **Azure Monitor** every 15 minutes, including **Server online status** (heartbeats per server). A metric alert on the Storage Sync Service with the server name dimension and an email action group meets the requirement with no extra infrastructure.\n\n- Service Health covers Azure platform incidents, not your server going offline.\n- An activity log alert on registration fires on management operations, not on lost heartbeats.\n- Storage analytics logging records storage requests, not agent health.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-016',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: 'You mount an Azure file share as Z: by using the storage account key and plan to migrate D:\\Data from a file server by using several Robocopy passes before cut-over. The copy must preserve NTFS ACLs and file owners, and each later pass must remove files from the target that users deleted from the source. Which two switches should you include? (Choose two.)',
    options: [
      '/MIR',
      '/COPY:DATSO',
      '/MOVE',
      '/COPY:DAT',
      '/XO',
      '/CREATE',
    ],
    answer: [0, 1],
    explanation: "**/MIR** mirrors the source: it copies new and changed items and **purges** items that no longer exist on the source, which is what makes catch-up passes correct. **/COPY:DATSO** copies data, attributes and timestamps plus **S**ecurity (NTFS ACLs) and **O**wner.\n\n- /MOVE deletes the source after copying, which you do not want during a staged migration.\n- /COPY:DAT is the default and omits ACLs and owner.\n- /XO only skips older files and does not purge deletions.\n- /CREATE creates zero-length files only.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-017',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: 'You have an on-premises file server named FS-OLD that runs Windows Server 2012 R2 and hosts 40 shares. You plan to move the shares, data and share permissions to a new Windows Server 2025 virtual machine in Azure that is connected to the on-premises network by ExpressRoute. After migration, users and applications must keep using the name FS-OLD without any client changes. The solution must minimize administrative effort. Which tool should you use?',
    options: [
      'Storage Migration Service',
      'Robocopy',
      'AzCopy',
      'Azure File Sync',
    ],
    answer: [0],
    explanation: "**Storage Migration Service** (managed from Windows Admin Center) inventories the source, transfers files, shares and security, and performs **cut-over**, moving the source server's name (and, where the network allows, its IP addresses) to the destination so clients need no changes. It can even create the Azure VM destination.\n\n- Robocopy copies files and ACLs but not share definitions or server identity.\n- AzCopy targets Azure Storage over REST, not a Windows Server destination, and does not move identity.\n- Azure File Sync syncs to Azure file shares; it does not transfer a server's name or shares to a new server.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-018',
    topic: '5.1',
    type: 'fill',
    difficulty: 2,
    stem: 'You use AzCopy v10 to copy a folder from Windows Server to an SMB Azure file share. Which AzCopy flag (used together with --preserve-info) copies the NTFS ACLs of the files?',
    answer: ['--preserve-permissions', '--preserve-permissions=true', 'preserve-permissions'],
    explanation: "`--preserve-permissions=true` copies ACLs, and `--preserve-info=true` copies SMB properties such as attributes and timestamps. For migrations, Microsoft still prefers Robocopy (full fidelity over SMB, and `/MIR` purges deletions); AzCopy is rated \"supported but not fully recommended\" because it uses REST, can lose some file fidelity, and `azcopy sync` removes files deleted at the source only when you add `--delete-destination`.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-019',
    topic: '5.1',
    type: 'match',
    difficulty: 1,
    stem: 'Match each Azure File Sync component to its description.',
    pairs: [
      ['Storage Sync Service', 'Top-level Azure resource that contains registered servers and sync groups'],
      ['Sync group', 'Defines one sync topology that contains exactly one cloud endpoint'],
      ['Cloud endpoint', 'Represents the Azure file share in a sync topology'],
      ['Server endpoint', 'A specific path on a registered server, where cloud tiering is configured'],
      ['Registered server', 'Trust relationship between one Windows Server and one Storage Sync Service'],
    ],
    explanation: "The **Storage Sync Service** is the root resource. Each **sync group** has one **cloud endpoint** (an Azure file share) and one or more **server endpoints** (paths on **registered servers**). A server registers with only one Storage Sync Service, and cloud tiering is a per-server-endpoint setting.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-020',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: 'A file server named FS1 has the following volumes: C: (NTFS, operating system), D: (NTFS, data), E: (ReFS, data) and F: (NTFS, data). You plan to create Azure File Sync server endpoints with cloud tiering enabled. Which two paths can you use? (Choose two.)',
    options: [
      'C:\\Apps',
      'D:\\Projects',
      'E:\\Media',
      'F:\\Archive',
      'D:\\Projects\\2026 as a second endpoint nested inside D:\\Projects',
    ],
    answer: [1, 3],
    explanation: "Server endpoints must be on **NTFS** volumes, cloud tiering is **not supported on the system volume**, and endpoints cannot be **nested**. That leaves **D:\\Projects** and **F:\\Archive**.\n\n- C:\\Apps is on the system volume; you could create an endpoint there only with cloud tiering disabled.\n- E: is ReFS, which Azure File Sync does not support.\n- A path inside an existing endpoint is a nested endpoint, which is not allowed.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-021',
    topic: '5.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Your firewall team asks which TCP port the Azure File Sync agent uses to upload and download data between a Windows Server and Azure. What port number should you give them?',
    answer: ['443', 'TCP 443', 'tcp/443', 'HTTPS 443', '443/tcp'],
    explanation: "The agent uses the Azure File Sync REST and FileREST protocols over **HTTPS on TCP 443**. SMB (TCP 445) is never used between the server and Azure, which is why Azure File Sync is a workaround when port 445 is blocked.",
    lesson: '5.1-azure-file-sync-migration',
  },
  {
    id: 'd5-022',
    topic: '5.1',
    type: 'multi',
    difficulty: 3,
    stem: 'A hub server named HUB1 receives data from branch servers by using DFS Replication. Some branches cannot reach the internet, so DFS-R must stay in place. You install Azure File Sync on HUB1 to sync the DFS-R replicated folders on its D: volume to Azure. Which two requirements apply to this configuration? (Choose two.)',
    options: [
      'Cloud tiering must be disabled on the D: volume that hosts the DFS-R replicated folders.',
      'Server endpoints must not be created on DFS-R read-only replicated folders.',
      'Each branch server must also have the Azure File Sync agent installed.',
      'The DFS-R staging folder must be moved to the Azure file share.',
      'HUB1 must be the primary member of every replication group.',
    ],
    answer: [0, 1],
    explanation: "Running DFS-R and Azure File Sync side by side is supported for hub-and-spoke designs like this, with two rules: **disable cloud tiering** on volumes that contain DFS-R replicated folders (DFS-R cannot replicate tiered stubs correctly), and **do not create server endpoints on read-only replicated folders**.\n\n- The point of keeping DFS-R is that branches do not need the agent or internet access.\n- The staging folder is local DFS-R working space and stays on the server.\n- The primary member setting matters only for initial replication and is unrelated.",
    lesson: '5.1-azure-file-sync-migration',
  },
  // ---------------------------------------------------------------- 5.2 Windows Server file shares
  {
    id: 'd5-023',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A file server named FS1 runs Windows Server 2025 and hosts a share named Sales. User1 is a member of both CONTOSO\\Sales and CONTOSO\\Managers. Refer to the exhibit. User1 opens \\\\FS1\\Sales from a client computer. What can User1 do in the share?',
    exhibit: String.raw`PS C:\> Get-SmbShareAccess -Name Sales

Name  ScopeName AccountName      AccessControlType AccessRight
----  --------- -----------      ----------------- -----------
Sales *         CONTOSO\Sales    Allow             Change
Sales *         CONTOSO\Managers Allow             Full

PS C:\> icacls D:\Shares\Sales
D:\Shares\Sales CONTOSO\Sales:(OI)(CI)(M)
                CONTOSO\Managers:(OI)(CI)(RX)
                BUILTIN\Administrators:(OI)(CI)(F)
                NT AUTHORITY\SYSTEM:(OI)(CI)(F)

Successfully processed 1 files; Failed processing 0 files`,
    options: [
      'Open and read files only',
      'Create, modify and delete files, but not change permissions',
      'Create, modify and delete files and change permissions',
      'Nothing, because the Managers NTFS entry overrides the Sales entry',
    ],
    answer: [1],
    explanation: "Permissions are **cumulative within each layer**, and the **more restrictive layer wins** across share and NTFS.\n\n- Share: Change + Full = **Full Control**.\n- NTFS: Modify + Read & execute = **Modify**.\n- Effective over the network: the lesser of Full Control and Modify = **Modify**, which allows creating, editing and deleting but not changing permissions or taking ownership.\n\nRead-only would require both layers to be restrictive; changing permissions would require Full Control in NTFS too; and an allow entry never cancels another allow entry (only an explicit deny would).",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-024',
    topic: '5.2',
    type: 'single',
    difficulty: 1,
    stem: 'Users who browse the HR share on a server named FS1 can see the names of every employee folder, even folders they cannot open. Refer to the exhibit. You need to ensure that users see only the folders they have permission to read. Which command should you run?',
    exhibit: String.raw`PS C:\> Get-SmbShare -Name HR | Format-List Name, Path, FolderEnumerationMode, CachingMode, EncryptData

Name                  : HR
Path                  : D:\Shares\HR
FolderEnumerationMode : Unrestricted
CachingMode           : Manual
EncryptData           : False`,
    options: [
      'Set-SmbShare -Name HR -FolderEnumerationMode AccessBased',
      'Set-SmbShare -Name HR -CachingMode None',
      'Set-SmbServerConfiguration -ServerHidden $true',
      'Block-SmbShareAccess -Name HR -AccountName "CONTOSO\\Domain Users"',
    ],
    answer: [0],
    explanation: "**Access-based enumeration** (`-FolderEnumerationMode AccessBased`) hides files and folders the user has no read permission for; the exhibit shows it is `Unrestricted`.\n\n- CachingMode controls Offline Files, not visibility.\n- ServerHidden hides the whole server from browse lists, not individual folders.\n- Block-SmbShareAccess adds a share-level deny, locking all domain users out of the share entirely.",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-025',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A file server named FS1 has a D:\\Home folder that contains one subfolder per user. A provisioning script creates new subfolders every week. Each user folder must be limited to 5 GB, counting all data in the folder regardless of who owns the files, and new folders must receive the limit automatically. The solution must minimize administrative effort. What should you configure?',
    options: [
      'NTFS disk quotas on volume D: with a 5 GB limit per user',
      'An FSRM quota of 5 GB on D:\\Home',
      'An FSRM auto apply quota on D:\\Home that uses a 5 GB hard quota template',
      'An FSRM file screen on D:\\Home that uses a 5 GB file group',
    ],
    answer: [2],
    explanation: "An **auto apply quota** on the parent folder applies a template to every existing **and future** subfolder, giving each user folder its own 5 GB hard limit. FSRM quotas count all data in the path regardless of owner.\n\n- NTFS disk quotas are per user per **volume** and are based on file **ownership**, not per folder.\n- A single quota on D:\\Home limits all home folders combined to 5 GB.\n- File screens block file types by name pattern; they do not limit size.",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-026',
    topic: '5.2',
    type: 'single',
    difficulty: 1,
    stem: 'You need to make sure that the project manager receives an email when D:\\Projects on a server named FS1 reaches 90 percent of 500 GB. Users must never be prevented from saving files to the folder. What should you create?',
    options: [
      'An FSRM hard quota of 500 GB with a notification threshold at 90 percent',
      'An FSRM soft quota of 500 GB with an email notification threshold at 90 percent',
      'An NTFS disk quota with a warning level of 450 GB',
      'A passive FSRM file screen on D:\\Projects',
    ],
    answer: [1],
    explanation: "A **soft quota** never blocks writes; it only triggers notifications (email, event, command, report) at thresholds. Configure an email threshold at 90 percent (SMTP must be set in FSRM options).\n\n- A hard quota would block writes once 500 GB is reached.\n- NTFS disk quotas are per user per volume and their warning level only logs an event; they do not send email.\n- File screens act on file types, not on space usage.",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-027',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'An active FSRM file screen on D:\\Shares blocks the Video files file group for all subfolders. The Marketing department must be able to store video files in D:\\Shares\\Marketing\\Video only. All other folders must remain blocked. What should you do?',
    options: [
      'Create a passive file screen on D:\\Shares\\Marketing\\Video.',
      'Create a file screen exception on D:\\Shares\\Marketing\\Video that includes the Video files file group.',
      'Remove the video extensions from the Video files file group.',
      'Create a soft quota on D:\\Shares\\Marketing\\Video.',
    ],
    answer: [1],
    explanation: "A **file screen exception** on a subfolder allows file groups that a parent screen blocks, exactly what is needed here.\n\n- A passive screen on the subfolder does not override the active screen inherited from the parent; the parent would still block the save.\n- Editing the file group would unblock video everywhere the group is used.\n- Quotas limit space and have no effect on file screening.",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-028',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'On a server named FS2, you try to create an FSRM quota on F:\\Data and receive an error. F: is a 20 TB volume formatted with ReFS. You need to enforce folder quotas on the data. What should you do?',
    options: [
      'Install the FSRM management tools and retry.',
      'Move the data to a volume formatted with NTFS and create the quota there.',
      'Enable Data Deduplication on F: before creating the quota.',
      'Run Set-FsrmSetting to enable ReFS support.',
    ],
    answer: [1],
    explanation: "**FSRM supports NTFS volumes only**; quotas, file screens and classification cannot be managed on ReFS. The data must live on NTFS for FSRM quotas (or you need another approach). Installing tools, enabling dedup, or changing FSRM settings does not add ReFS support, and there is no in-place conversion from ReFS to NTFS.",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-029',
    topic: '5.2',
    type: 'match',
    difficulty: 2,
    stem: 'Match each File Server Resource Manager feature to the requirement it meets.',
    pairs: [
      ['Hard quota', 'Prevent a folder from growing beyond 200 GB'],
      ['Soft quota', 'Email the folder owner at 80% of 200 GB without blocking writes'],
      ['Active file screen', 'Stop users from saving .iso files'],
      ['Classification rule', 'Tag files that contain a project code with Confidentiality = High'],
      ['File management task', 'Move files not modified for two years to an archive share'],
      ['Storage report', 'List duplicate files across all shares every week'],
    ],
    explanation: "Hard quotas block, soft quotas only notify. Active file screens block by file-name pattern. Classification rules set properties on files (by location, content or script). File management tasks act on files matching conditions (expire, encrypt, custom command). Storage reports, such as Duplicate Files, analyse usage on demand or on a schedule.",
    lesson: '5.2-file-shares-fsrm',
  },
  {
    id: 'd5-030',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'Your network contains an AD DS domain named contoso.com. You plan to publish shares from several file servers under the path \\\\contoso.com\\Corp. The namespace must remain available if a single namespace server fails. You do not have a failover cluster. What should you do?',
    options: [
      'Create a standalone namespace on FS1 and another standalone namespace on FS2.',
      'Create a domain-based namespace on FS1 and add FS2 as an additional namespace server.',
      'Create a standalone namespace on FS1 and replicate C:\\DFSRoots by using DFS Replication.',
      'Create a domain-based namespace on FS1 and enable access-based enumeration.',
    ],
    answer: [1],
    explanation: "A **domain-based namespace** uses the domain name in its path (`\\\\contoso.com\\Corp`) and stores its configuration in AD DS, so you get redundancy simply by adding **more namespace servers** (`New-DfsnRootTarget`).\n\n- Standalone namespaces use a server name in the path; two of them are two different namespaces, and standalone HA requires a failover cluster.\n- Replicating the root folder with DFS-R does not make a standalone namespace highly available.\n- ABE controls visibility, not availability.",
    lesson: '5.2-dfs-namespaces-replication',
  },
  {
    id: 'd5-031',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A DFS namespace folder named \\\\contoso.com\\Public\\Docs has folder targets in the Seattle, Denver and Boston AD DS sites. The Branch1 site has no folder target. Users in Branch1 must be referred to the target in the site with the lowest site link cost, and must only fall back to more distant sites if that target is unavailable. Which referral ordering method should you configure?',
    options: [
      'Random order',
      'Lowest cost',
      'Exclude targets outside of the client\'s site',
      'Client failback only, with random order',
    ],
    answer: [1],
    explanation: "With **Lowest cost**, in-site targets come first (none here), then out-of-site targets are sorted by AD **site link cost**, so Branch1 users get the cheapest site first and fall through to the others.\n\n- Random order lists out-of-site targets randomly regardless of cost.\n- Exclude targets outside of the client's site would return no targets at all to Branch1, cutting off access.\n- Client failback controls returning to a preferred target after recovery; it does not order targets by cost on its own.",
    lesson: '5.2-dfs-namespaces-replication',
  },
  {
    id: 'd5-032',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A DFS namespace folder has three folder targets: \\\\FS1\\Apps and \\\\FS2\\Apps in production sites, and \\\\DR1\\Apps in a disaster recovery site with a low site link cost to some branches. Clients must be referred to \\\\DR1\\Apps only if both production targets are unavailable. What should you configure on the \\\\DR1\\Apps folder target?',
    options: [
      'Set the target priority to Last among all targets.',
      'Set the target priority to Last among targets of equal cost.',
      'Disable referrals for the folder target.',
      'Set the namespace ordering method to Random order.',
    ],
    answer: [0],
    explanation: "**Last among all targets** places DR1 at the very end of every referral, regardless of site cost, so it is used only when every other target fails.\n\n- *Last among targets of equal cost* only reorders DR1 within its cost group; for branches where DR1 is cheaper than the production sites, it would still be offered before them.\n- Disabling referrals removes DR1 completely, so it would not be available even as a last resort.\n- Random order ignores cost and could send clients to DR1 first.",
    lesson: '5.2-dfs-namespaces-replication',
  },
  {
    id: 'd5-033',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'Two servers replicate a CAD folder by using DFS Replication. Replication of large drawings is slow, and the DFS Replication event log on FS1 repeatedly reports that the staging folder reached its high watermark and that old staging files are being cleaned up. Refer to the exhibit. What should you do?',
    exhibit: String.raw`PS C:\> Get-DfsrMembership -GroupName RG-Eng -ComputerName FS1 | Select-Object FolderName, ContentPath, StagingPathQuotaInMB, ConflictAndDeletedQuotaInMB

FolderName ContentPath StagingPathQuotaInMB ConflictAndDeletedQuotaInMB
---------- ----------- -------------------- ---------------------------
CAD        D:\Eng\CAD                  4096                         660

PS C:\> Get-ChildItem D:\Eng\CAD -Recurse -File | Sort-Object Length -Descending | Select-Object -First 32 | Measure-Object -Property Length -Sum

Count    : 32
Average  :
Sum      : 61203283968
Maximum  :
Minimum  :
Property : Length`,
    options: [
      'Run Set-DfsrMembership to raise StagingPathQuotaInMB to at least 58368 on both members.',
      'Run Set-DfsrMembership to raise ConflictAndDeletedQuotaInMB to 58368 on both members.',
      'Disable Remote Differential Compression on the connection.',
      'Make the CAD replicated folder read-only on FS2.',
    ],
    answer: [0],
    explanation: "The staging quota is still the **4,096 MB default**, but the 32 largest files total 61,203,283,968 bytes = **58,368 MB (57 GB)**. Microsoft's sizing guidance is a staging quota at least as large as the 32 largest files; an undersized quota causes constant staging cleanup and re-staging of big files. Raise `StagingPathQuotaInMB` on both members.\n\n- ConflictAndDeleted holds conflict losers and deletions; it does not affect staging.\n- Disabling RDC makes WAN transfers larger, not faster.\n- Read-only membership changes who can write, not staging behaviour.",
    lesson: '5.2-dfs-namespaces-replication',
  },
  {
    id: 'd5-034',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'Two users edit the same file in a DFS-R replicated folder on different servers before replication occurs. Later, one user reports that their changes are missing. Where should you look for the overwritten version of the file?',
    options: [
      'The DfsrPrivate\\PreExisting folder on the primary member',
      'The DfsrPrivate\\ConflictAndDeleted folder on the member that resolved the conflict',
      'The DfsrPrivate\\Staging folder on both members',
      'The Recycle Bin of the user whose changes are missing',
    ],
    answer: [1],
    explanation: "DFS-R resolves conflicts with **last writer wins**. The losing version is moved to **DfsrPrivate\\ConflictAndDeleted** on the member that resolved the conflict (subject to the 660 MB default quota, so recover it promptly).\n\n- PreExisting holds files displaced during **initial** replication by the primary member.\n- Staging holds compressed files in transit, not conflict losers.\n- Replicated overwrites do not go to a user's Recycle Bin.",
    lesson: '5.2-dfs-namespaces-replication',
  },
  {
    id: 'd5-035',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'Your company publishes approved templates from a server named HQ1 to 20 branch servers by using DFS Replication. Changes made directly on branch servers, including by local administrators, must never be replicated back to HQ1 or to other branches. The solution must minimize administrative effort. What should you do?',
    options: [
      'Set the share permissions on each branch share to Read for Everyone.',
      'Configure each branch member\'s membership as read-only by using Set-DfsrMembership -ReadOnly $true.',
      'Create one-way connections from HQ1 to each branch and delete the reverse connections.',
      'Set HQ1 as the primary member of the replication group.',
    ],
    answer: [1],
    explanation: "A **read-only replicated folder** prevents any local changes on that member, so nothing originates there to replicate. It is the supported design for published content.\n\n- Share permissions only affect network access; local administrators can still change files locally, and those changes would replicate.\n- Deleting reverse connections creates a one-way topology, which Microsoft does not recommend: local changes still occur on the branches, so their copies silently diverge from HQ1.\n- The primary member flag only matters for initial replication.",
    lesson: '5.2-dfs-namespaces-replication',
  },
  {
    id: 'd5-036',
    topic: '5.2',
    type: 'multi',
    difficulty: 2,
    stem: 'You plan to let remote users access file shares over the internet by using SMB over QUIC without a VPN. Refer to the exhibit, which lists your candidate file servers. Which two servers can host SMB over QUIC? (Choose two.)',
    exhibit: String.raw`PS C:\> Get-CimInstance -ClassName Win32_OperatingSystem -ComputerName FS1,FS2,FS3,FS4,FS5 | Select-Object CSName, Caption

CSName Caption
------ -------
FS1    Microsoft Windows Server 2022 Datacenter
FS2    Microsoft Windows Server 2022 Datacenter: Azure Edition
FS3    Microsoft Windows Server 2025 Standard
FS4    Microsoft Windows Server 2019 Datacenter
FS5    Microsoft Windows Server 2022 Standard`,
    options: ['FS1', 'FS2', 'FS3', 'FS4', 'FS5'],
    answer: [1, 2],
    explanation: "SMB over QUIC server support is **Windows Server 2022 Datacenter: Azure Edition** or **any edition of Windows Server 2025**. So FS2 and FS3 qualify.\n\n- Windows Server 2022 Datacenter and Standard (FS1, FS5) do not include the SMB over QUIC server.\n- Windows Server 2019 (FS4) predates SMB over QUIC.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-037',
    topic: '5.2',
    type: 'order',
    difficulty: 3,
    stem: 'You are deploying SMB over QUIC on a Windows Server 2025 file server named FSEDGE1 that clients will reach as fsedge1.contoso.com. Only devices that hold client certificates from the Contoso Issuing CA may connect. Client devices already have those certificates mapped. You need to complete the server configuration and verify it. In which order should you perform the actions?',
    items: [
      'Install a certificate with the Server Authentication EKU and a SAN of fsedge1.contoso.com in the computer Personal store',
      'Run New-SmbServerCertificateMapping for fsedge1.contoso.com with the certificate thumbprint',
      'Run Set-SmbServerCertificateMapping -RequireClientAuthentication $true for that name, then Grant-SmbClientAccessToServer with -IdentifierType ISSUER for the Contoso Issuing CA',
      'From a client on the internet, run NET USE with /TRANSPORT:QUIC to the share',
    ],
    explanation: "The certificate must exist before it can be mapped; mapping it with `New-SmbServerCertificateMapping` enables SMB over QUIC for that name (Windows Admin Center does not support configuring SMB over QUIC on Windows Server 2025, so you use PowerShell). Client access control works on an existing mapping: `-RequireClientAuthentication $true` makes the server demand and check a client certificate (without it the allow list is never enforced), and `Grant-SmbClientAccessToServer -IdentifierType ISSUER` allows certificates issued by the Contoso CA. Only then can a client test with `NET USE ... /TRANSPORT:QUIC` (or `New-SmbMapping -TransportType QUIC`).",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-038',
    topic: '5.2',
    type: 'fill',
    difficulty: 1,
    stem: 'You are writing the perimeter firewall rule for a Windows Server 2025 file server that uses SMB over QUIC with default settings. Which UDP port must you allow inbound to the server?',
    answer: ['443', 'UDP 443', 'udp/443', '443/udp'],
    explanation: "SMB over QUIC uses **UDP 443** by default (a TLS 1.3 tunnel). Do not open TCP 445 to the internet. Windows Server 2025 can also be configured to use alternative ports.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-039',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'You replace a Windows Server 2019 scan-processing server with a new server named Server1 that runs Windows Server 2025. Server1 cannot open \\\\NAS01\\Scans on an older third-party NAS that is configured for guest access; the old server could, because a local policy on it allowed insecure guest logons. Refer to the exhibit. You need to restore access while keeping Server1 as secure as possible. What should you do?',
    exhibit: String.raw`You can't access this shared folder because your organization's security policies block
unauthenticated guest access. These policies help protect your PC from unsafe or malicious
devices on the network.

PS C:\> Get-SmbClientConfiguration | Select-Object RequireSecuritySignature, EnableInsecureGuestLogons

RequireSecuritySignature EnableInsecureGuestLogons
------------------------ -------------------------
                    True                     False`,
    options: [
      'Configure NAS01 to require an authenticated user account and to support SMB signing, then connect with that account.',
      'Run Set-SmbClientConfiguration -RequireSecuritySignature $false -EnableInsecureGuestLogons $true on Server1.',
      'Install the SMB 1.0/CIFS Client feature on Server1.',
      'Run Set-SmbClientConfiguration -RequireEncryption $true on Server1.',
    ],
    answer: [0],
    explanation: "Two settings block guest access on Server1: insecure guest logons are not allowed (`EnableInsecureGuestLogons False` in the exhibit), and Windows Server 2025 **requires SMB signing on outbound connections by default**, which guest sessions cannot provide. The secure fix is on the device: use a real account and enable signing on the NAS.\n\n- Disabling required signing and allowing insecure guest logons would work but reopens relay and spoofing risks (both settings would have to change).\n- SMB 1 is insecure and would not satisfy the signing requirement either.\n- Requiring encryption makes the client stricter and still needs an authenticated session.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-040',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A file server named FS3 was upgraded in place over several Windows Server versions and still has SMB 1 enabled. Before you disable it, you need to identify every client that connects by using SMB 1 over the next 30 days without disrupting anyone. What should you do on FS3?',
    options: [
      'Run Set-SmbServerConfiguration -AuditSmb1Access $true and review the Microsoft-Windows-SMBServer/Audit log.',
      'Run Get-SmbConnection daily and filter for dialect 1.',
      'Run Set-SmbServerConfiguration -AuditClientDoesNotSupportSigning $true and review the Security log.',
      'Uninstall the FS-SMB1 feature and review the System log for failed connections.',
    ],
    answer: [0],
    explanation: "`AuditSmb1Access` logs each SMB 1 access attempt to the **SMBServer/Audit** event log without blocking anything, giving you a list of clients to fix before you run `Set-SmbServerConfiguration -EnableSMB1Protocol $false` and remove FS-SMB1.\n\n- `Get-SmbConnection` shows the **client side** connections that FS3 itself has made to other servers, not inbound sessions.\n- Signing auditing reports clients that cannot sign, which is a different question.\n- Uninstalling first is disruptive, which the requirement forbids.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-041',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: 'The Finance share on a server named FS1 must be encrypted in transit. A legacy application server that supports only SMB 2.1 can still read files from the share. Refer to the exhibit. You need to ensure that clients that cannot encrypt are refused access to Finance. What should you do?',
    exhibit: String.raw`PS C:\> Get-SmbShare -Name Finance | Select-Object Name, EncryptData

Name    EncryptData
----    -----------
Finance        True

PS C:\> Get-SmbServerConfiguration | Select-Object EncryptData, RejectUnencryptedAccess

EncryptData RejectUnencryptedAccess
----------- -----------------------
      False                   False`,
    options: [
      'Run Set-SmbServerConfiguration -RejectUnencryptedAccess $true.',
      'Run Set-SmbServerConfiguration -EncryptData $true.',
      'Run Set-SmbShare -Name Finance -EncryptData $true.',
      'Run Set-SmbServerConfiguration -RequireSecuritySignature $true.',
    ],
    answer: [0],
    explanation: "Encryption is already on for the share, but `RejectUnencryptedAccess` has been changed from its default of **True** to False, so clients that cannot do SMB 3 encryption are let in unencrypted. Setting it back to True makes the server refuse them.\n\n- Server-wide EncryptData would encrypt all shares but still admit non-encrypting clients while RejectUnencryptedAccess is False.\n- The share already has EncryptData True.\n- Requiring signing protects integrity but does not deny unencrypted access.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-042',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: 'A security baseline requires that a Windows Server 2025 file server named FS1 accept inbound SMB connections only by using SMB 3.1.1. Which command should you run on FS1?',
    options: [
      'Set-SmbServerConfiguration -EnableSMB2Protocol $false',
      'Set-SmbServerConfiguration -Smb2DialectMin SMB311',
      'Set-SmbClientConfiguration -Smb2DialectMin SMB311',
      'Set-SmbServerConfiguration -EncryptionCiphers "AES_256_GCM"',
    ],
    answer: [1],
    explanation: "Windows Server 2025 adds **SMB dialect control**. `Set-SmbServerConfiguration -Smb2DialectMin SMB311` makes the server negotiate only 3.1.1 for inbound connections (setting only a minimum of 3.1.1 effectively also sets the maximum).\n\n- Disabling the SMB2 protocol would disable SMB 2 **and** 3 entirely.\n- The client setting controls outbound connections that FS1 makes.\n- Restricting ciphers limits encryption algorithms, not dialects.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-043',
    topic: '5.2',
    type: 'multi',
    difficulty: 3,
    stem: 'You are reviewing the default SMB behaviour of a newly installed Windows Server 2025 server before adding it to your file server farm. Which two statements describe defaults on Windows Server 2025? (Choose two.)',
    options: [
      'The SMB client requires signing for all outbound connections.',
      'Creating a share enables the File and Printer Sharing (Restrictive) firewall rule group, which does not open NetBIOS ports 137-139.',
      'The SMB server requires encryption for all inbound connections.',
      'SMB over QUIC is enabled automatically on every edition.',
      'SMB 1 is installed but disabled.',
      'The SMB client blocks NTLM for all outbound connections.',
    ],
    answer: [0, 1],
    explanation: "On Windows Server 2025, **outbound SMB signing is required by default**, and share creation uses the new **File and Printer Sharing (Restrictive)** firewall group without NetBIOS ports.\n\n- Encryption is **not** required by default; you enable it per share or server, and 2025 clients can optionally mandate it.\n- SMB over QUIC is opt-in: you must map a certificate.\n- SMB 1 is **not installed** by default (since 2019).\n- NTLM blocking is available but off by default.",
    lesson: '5.2-smb-quic-settings',
  },
  {
    id: 'd5-044',
    topic: '5.2',
    type: 'fill',
    difficulty: 2,
    stem: 'On a Windows Server 2025 file server, which PowerShell cmdlet binds a certificate to a server name to enable SMB over QUIC for that name?',
    answer: ['New-SmbServerCertificateMapping'],
    explanation: "`New-SmbServerCertificateMapping -Name <FQDN> -Thumbprint <thumbprint> -StoreName My` enables SMB over QUIC for that name. After certificate renewal, update the mapping with `Set-SmbServerCertificateMapping`, because the new certificate has a different thumbprint.",
    lesson: '5.2-smb-quic-settings',
  },
  // ---------------------------------------------------------------- 5.3 Windows Server storage
  {
    id: 'd5-045',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'A standalone server named Server1 runs Windows Server 2025 and has a storage pool named Pool1 that contains four 4 TB HDDs. You need to create a virtual disk in Pool1 that remains available if any two disks fail at the same time. What should you do first?',
    options: [
      'Run New-VirtualDisk with -ResiliencySettingName Mirror -NumberOfDataCopies 3.',
      'Add a fifth physical disk to Pool1.',
      'Create a single parity virtual disk.',
      'Create a two-way mirror and add a hot spare.',
    ],
    answer: [1],
    explanation: "On a standalone server, tolerating **two simultaneous disk failures** requires a **three-way mirror**, which needs at least **five** physical disks (dual parity would need seven). With four disks, add a fifth first.\n\n- New-VirtualDisk with three data copies fails with four disks.\n- Single parity tolerates only one failure.\n- A hot spare helps rebuild after one failure, but a two-way mirror still loses data if two disks fail before the rebuild completes.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-046',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'A disk in a storage pool named Pool1 on Server1 failed. The disks on Server1 were renamed PhysicalDisk0 to PhysicalDisk5 by using Set-PhysicalDisk -NewFriendlyName. You added PhysicalDisk5 to the pool as a replacement and retired the failed disk. Refer to the exhibit. You need to restore full resiliency of Data1. Which cmdlet should you run next?',
    exhibit: String.raw`PS C:\> Get-PhysicalDisk | Format-Table FriendlyName, MediaType, Usage, OperationalStatus, HealthStatus

FriendlyName  MediaType Usage       OperationalStatus  HealthStatus
------------  --------- -----       -----------------  ------------
PhysicalDisk0 SSD       Auto-Select OK                 Healthy
PhysicalDisk1 HDD       Auto-Select OK                 Healthy
PhysicalDisk2 HDD       Auto-Select OK                 Healthy
PhysicalDisk3 HDD       Retired     Lost Communication Warning
PhysicalDisk4 HDD       Auto-Select OK                 Healthy
PhysicalDisk5 HDD       Auto-Select OK                 Healthy

PS C:\> Get-VirtualDisk | Format-Table FriendlyName, ResiliencySettingName, OperationalStatus, HealthStatus

FriendlyName ResiliencySettingName OperationalStatus HealthStatus
------------ --------------------- ----------------- ------------
Data1        Mirror                Degraded          Warning`,
    options: [
      'Repair-VirtualDisk -FriendlyName Data1',
      'Reset-PhysicalDisk -FriendlyName PhysicalDisk3',
      'Optimize-StoragePool -FriendlyName Pool1',
      'Set-PhysicalDisk -FriendlyName PhysicalDisk5 -Usage HotSpare',
    ],
    answer: [0],
    explanation: "With the replacement in the pool and the failed disk retired (so nothing new is allocated on it), **Repair-VirtualDisk** rebuilds the missing mirror copies onto healthy disks; track it with `Get-StorageJob`, then `Remove-PhysicalDisk` the retired disk.\n\n- Reset-PhysicalDisk wipes a disk's pool metadata; it does not rebuild data, and the disk has lost communication anyway.\n- Optimize-StoragePool rebalances allocations across disks but is not the repair step for a degraded space.\n- Making the new disk a hot spare would prevent the repair from using it now.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-047',
    topic: '5.3',
    type: 'single',
    difficulty: 1,
    stem: 'You have a three-node failover cluster. Each node runs Windows Server 2025 Standard and has six local NVMe drives connected directly to the PCIe bus. You run Enable-ClusterStorageSpacesDirect and it fails. What should you do first?',
    options: [
      'Install Windows Server 2025 Datacenter on all three nodes.',
      'Configure the NVMe drives as a RAID 5 array on each node.',
      'Add a fourth node to the cluster.',
      'Disable the Failover Clustering feature and use standalone Storage Spaces.',
    ],
    answer: [0],
    explanation: "Storage Spaces Direct is a **Datacenter edition** feature; Standard does not include it. Three nodes and local NVMe drives are otherwise valid.\n\n- RAID volumes are explicitly **not supported** under S2D; drives must be presented directly.\n- S2D supports 2-16 nodes, so three is enough.\n- Standalone Storage Spaces would not give you shared, cluster-wide storage.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-048',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'You enable Storage Spaces Direct on a four-node cluster. Refer to the exhibit, which shows the drives in node HV1; the other nodes are identical. Which statement is true?',
    exhibit: String.raw`PS C:\> Get-PhysicalDisk -CimSession HV1 | Format-Table FriendlyName, BusType, MediaType, Usage, @{n='SizeGB';e={[int]($_.Size/1GB)}}

FriendlyName              BusType MediaType Usage       SizeGB
------------              ------- --------- -----       ------
INTEL SSDPE2KE016T8       NVMe    SSD       Journal       1490
INTEL SSDPE2KE016T8       NVMe    SSD       Journal       1490
ATA MZ7KH3T8HALS          SATA    SSD       Auto-Select   3577
ATA MZ7KH3T8HALS          SATA    SSD       Auto-Select   3577
ATA MZ7KH3T8HALS          SATA    SSD       Auto-Select   3577
ATA MZ7KH3T8HALS          SATA    SSD       Auto-Select   3577`,
    options: [
      'The NVMe drives were bound as cache automatically and, because the capacity drives are SSDs, the cache buffers writes only.',
      'The NVMe drives were bound as cache automatically and cache both reads and writes for the SATA SSDs.',
      'No cache is configured; you must run Set-PhysicalDisk -Usage Journal on the NVMe drives.',
      'All six drives contribute capacity, because S2D does not use a cache when every drive is flash.',
    ],
    answer: [0],
    explanation: "When more than one drive type is present, S2D automatically binds the **fastest type (NVMe) as cache**, shown as `Usage Journal`, and the rest as capacity. In front of **SSD** capacity drives the cache is **write-only**, because SSD reads are already fast; it caches reads and writes only in front of HDDs.\n\n- Read caching applies to HDD capacity tiers.\n- No manual step is needed; the cache is configured during `Enable-ClusterStorageSpacesDirect`.\n- A single flash type has no cache, but here there are two flash types.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-049',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'You have a four-node Storage Spaces Direct cluster. You need to create a volume for backup archives that are written in large sequential batches and rarely read. The volume must remain online if two servers fail at the same time, and must maximize capacity efficiency. Which resiliency type should you use?',
    options: [
      'Two-way mirror',
      'Three-way mirror',
      'Dual parity',
      'Nested two-way mirror',
    ],
    answer: [2],
    explanation: "**Dual parity** tolerates two simultaneous failures like three-way mirror, but with better efficiency (50% at four nodes, rising to 80% at 16), and it suits large sequential, rarely read data.\n\n- Two-way mirror tolerates only one failure.\n- Three-way mirror tolerates two but is only 33% efficient; it is preferred for performance-sensitive data.\n- Nested resiliency is for exactly two-node clusters.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-050',
    topic: '5.3',
    type: 'multi',
    difficulty: 2,
    stem: 'You are planning hardware for a Storage Spaces Direct cluster. Which two statements are requirements for Storage Spaces Direct? (Choose two.)',
    options: [
      'Each drive must be physically attached to only one server, through an HBA in pass-through mode or directly.',
      'Every node must run Windows Server Datacenter edition.',
      'All nodes must connect to a shared SAS JBOD enclosure.',
      'Each node must present its drives as a hardware RAID 5 volume.',
      'The cluster must have at least four nodes.',
      'Each node must have RDMA-capable network adapters.',
    ],
    answer: [0, 1],
    explanation: "S2D requires **direct-attached drives** (each visible to one server only, via a pass-through HBA or NVMe) and **Datacenter edition**.\n\n- Shared SAS enclosures and MPIO paths are **not supported** for S2D (that is classic clustered Storage Spaces).\n- Hardware RAID volumes are not supported.\n- The minimum is **two** nodes, not four.\n- RDMA is **strongly recommended**, not mandatory.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-051',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'You attach a new 3 TB data disk to a server named Server1 and create a single volume on it, but the volume is only about 2 TB. Refer to the exhibit. The disk contains no data yet. You need the entire disk to be usable as one volume. What should you do?',
    exhibit: String.raw`PS C:\> Get-Disk -Number 2 | Format-Table Number, FriendlyName, PartitionStyle, Size, AllocatedSize

Number FriendlyName      PartitionStyle          Size AllocatedSize
------ ------------      --------------          ---- -------------
     2 Msft Virtual Disk MBR            3298534883328 2199022206976`,
    options: [
      'Run Resize-Partition with the SizeMax value from Get-PartitionSupportedSize.',
      'Delete the partition, run Clear-Disk, initialize the disk as GPT, and create a new volume.',
      'Convert the disk to a dynamic disk and create a spanned volume.',
      'Format the volume with ReFS instead of NTFS.',
    ],
    answer: [1],
    explanation: "The disk is **MBR**, which can address only about **2 TiB** (with 512-byte sectors), so the rest is unusable. Because there is no data, remove the partition, clear the disk, and initialise it as **GPT** (`Initialize-Disk -PartitionStyle GPT`), then create the volume.\n\n- Resize-Partition cannot extend past the MBR addressing limit.\n- Converting to a dynamic disk does not change the MBR partition table's 2 TiB addressing limit, and dynamic disks are deprecated.\n- The file system is not the constraint; the partition table is.",
    lesson: '5.3-disks-filesystems-dedup',
  },
  {
    id: 'd5-052',
    topic: '5.3',
    type: 'fill',
    difficulty: 2,
    stem: 'After expanding a virtual disk, you run the following command to grow volume D: into all the new space: Resize-Partition -DriveLetter D -Size (_____ -DriveLetter D).SizeMax. Which cmdlet completes the command?',
    answer: ['Get-PartitionSupportedSize'],
    explanation: "`Get-PartitionSupportedSize` returns `SizeMin` and `SizeMax` for a partition. Passing `SizeMax` to `Resize-Partition` extends the partition and its file system into all adjacent unallocated space. Rescan disks (`Update-HostStorageCache`) first if Windows has not noticed the larger disk.",
    lesson: '5.3-disks-filesystems-dedup',
  },
  {
    id: 'd5-053',
    topic: '5.3',
    type: 'multi',
    difficulty: 2,
    stem: 'You plan to format a new 40 TB data volume on Windows Server 2025 with ReFS instead of NTFS. Which two capabilities will be unavailable on the ReFS volume? (Choose two.)',
    options: [
      'NTFS disk quotas per user',
      'Shrinking the volume',
      'BitLocker Drive Encryption',
      'Data Deduplication',
      'Access control lists (ACLs)',
      'Block cloning',
    ],
    answer: [0, 1],
    explanation: "ReFS does not support **disk quotas** or **shrinking** (it also lacks ODX, transactions, short names, booting and removable media).\n\n- BitLocker and ACLs work on both file systems.\n- Data Deduplication supports ReFS since Windows Server 2019.\n- Block cloning is a ReFS-only feature, so it is available, not lost.",
    lesson: '5.3-disks-filesystems-dedup',
  },
  {
    id: 'd5-054',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'You are creating Cluster Shared Volumes on a Storage Spaces Direct cluster that will host Hyper-V virtual machines. Checkpoint merges and creation of fixed-size VHDX files must be as fast as possible. Which file system should you use?',
    options: [
      'CSVFS_NTFS, because it supports Offloaded Data Transfer',
      'CSVFS_ReFS, because block cloning and sparse VDL accelerate VHDX operations',
      'CSVFS_NTFS, because ReFS is not supported on Cluster Shared Volumes',
      'CSVFS_ReFS, because it supports NTFS disk quotas for each VM',
    ],
    answer: [1],
    explanation: "**ReFS** (CSVFS_ReFS) is recommended for VHDX workloads on Storage Spaces Direct: **block cloning** turns checkpoint merges and copies into metadata operations, and **sparse VDL** creates fixed VHDX files almost instantly.\n\n- ODX matters for SAN offload, not S2D, and does not speed checkpoint merges.\n- ReFS is fully supported on CSVs.\n- ReFS does not support disk quotas.",
    lesson: '5.3-disks-filesystems-dedup',
  },
  {
    id: 'd5-055',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Two servers named SR1 and SR2 run Windows Server 2025 Standard. You need to replicate volume D: (1.5 TB) and volume E: (800 GB) from SR1 to SR2 by using Storage Replica. What should you do?',
    options: [
      'Create one Storage Replica partnership that contains both volumes.',
      'Create two partnerships, one for each volume.',
      'Install Windows Server 2025 Datacenter on both servers.',
      'Consolidate D: and E: into a single 2.3 TB volume and replicate it.',
    ],
    answer: [2],
    explanation: "On **Standard** edition, Storage Replica is limited to **a single volume of up to 2 TB**. Replicating two volumes requires **Datacenter**, which has no volume count or size limit.\n\n- A partnership with two volumes, or two partnerships, both exceed the single-volume limit.\n- A combined 2.3 TB volume exceeds the 2 TB limit.",
    lesson: '5.3-storage-replica-iscsi',
  },
  {
    id: 'd5-056',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'You need to replicate volume D: from SR1 in the main datacenter to SR2 in a disaster recovery site 600 km away by using Storage Replica. Application write latency on SR1 must not increase noticeably, and losing a few seconds of data in a site failure is acceptable. Refer to the exhibit. What should you do?',
    exhibit: String.raw`PS C:\> Test-Connection -ComputerName SR2 -Count 4

Source        Destination     IPV4Address      IPV6Address    Bytes    Time(ms)
------        -----------     -----------      -----------    -----    --------
SR1           SR2             10.20.1.15                      32       41
SR1           SR2             10.20.1.15                      32       39
SR1           SR2             10.20.1.15                      32       43
SR1           SR2             10.20.1.15                      32       40`,
    options: [
      'Run New-SRPartnership with -ReplicationMode Asynchronous.',
      'Run New-SRPartnership with its default replication mode.',
      'Configure Hyper-V Replica for volume D:.',
      'Configure DFS Replication for the folders on volume D:.',
    ],
    answer: [0],
    explanation: "Round trips are about **40 ms**, far above the **5 ms** average recommended for synchronous replication. **Asynchronous** mode acknowledges writes after the local log write, so application latency is unaffected and the RPO is small but non-zero, which the requirement accepts.\n\n- The default mode of `New-SRPartnership` is **synchronous**, which would add the WAN round trip to every write.\n- Hyper-V Replica replicates VMs, not volumes.\n- DFS-R is file-level and does not replicate open files or block changes.",
    lesson: '5.3-storage-replica-iscsi',
  },
  {
    id: 'd5-057',
    topic: '5.3',
    type: 'order',
    difficulty: 2,
    stem: 'You plan to configure server-to-server Storage Replica from SR1 to SR2. Both servers already have matching data and log volumes. You need to deploy replication by following Microsoft best practices. In which order should you perform the actions?',
    items: [
      'Install the Storage Replica feature with management tools on SR1 and SR2 and restart them',
      'Run Test-SRTopology against the source and destination volumes and review the report',
      'Run New-SRPartnership to create the replication groups and partnership',
      'Check (Get-SRGroup).Replicas until ReplicationStatus shows ContinuouslyReplicating',
    ],
    explanation: "The feature (or at least its tools) must be installed before `Test-SRTopology` can run. Microsoft recommends running `Test-SRTopology` before creating the partnership to validate bandwidth, latency and log sizing. `New-SRPartnership` then creates the groups, and you monitor the replicas as they move from `InitialBlockCopy` to `ContinuouslyReplicating`.",
    lesson: '5.3-storage-replica-iscsi',
  },
  {
    id: 'd5-058',
    topic: '5.3',
    type: 'fill',
    difficulty: 1,
    stem: 'You are enabling Data Deduplication on a volume that stores the VHDX files of a Virtual Desktop Infrastructure (VDI) deployment. Which value should you specify for the -UsageType parameter of Enable-DedupVolume?',
    answer: ['HyperV', 'Hyper-V'],
    explanation: "The **HyperV** usage type is tuned for **VDI**: it optimizes open (in-use) and partially changed VHDX files. *Default* is for general-purpose file servers and *Backup* is for virtualized backup applications such as DPM.",
    lesson: '5.3-disks-filesystems-dedup',
  },
  {
    id: 'd5-059',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Yesterday you copied 600 GB of installation media, duplicated across 20 project folders, to volume E: on a file server named FS1. Refer to the exhibit. No space savings appear yet. What is the most likely reason?',
    exhibit: String.raw`PS C:\> Get-DedupVolume -Volume E: | Format-List Volume, Enabled, UsageType, MinimumFileAgeDays, SavedSpace, SavingsRate

Volume             : E:
Enabled            : True
UsageType          : Default
MinimumFileAgeDays : 3
SavedSpace         : 0
SavingsRate        : 0`,
    options: [
      'The files are younger than the minimum file age, so they are not yet in policy for optimization.',
      'The Default usage type does not optimize files larger than 1 GB.',
      'Garbage collection must run before the first optimization job.',
      'Data Deduplication cannot optimize files that exist in more than one folder.',
    ],
    answer: [0],
    explanation: "Dedup is post-process. With the **Default** usage type, `MinimumFileAgeDays` is **3**, so files copied yesterday are not yet eligible. After three days the background optimization job will process them (or lower the value and run `Start-DedupJob -Type Optimization`).\n\n- There is no 1 GB file size limit for the Default usage type.\n- Garbage collection cleans unreferenced chunks after optimization; it is not a prerequisite.\n- Duplicate content across folders is exactly what dedup removes.",
    lesson: '5.3-disks-filesystems-dedup',
  },
  {
    id: 'd5-060',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'Two Hyper-V hosts use RoCEv2 network adapters for SMB Direct traffic to a Scale-Out File Server. Get-NetAdapterRdma shows RDMA enabled on the adapters, but storage throughput is poor and the switches report packet drops on the storage VLAN under load. Refer to the exhibit, from one host. You must keep the existing network adapters. What should you do?',
    exhibit: String.raw`PS C:\> Get-NetQosFlowControl

Priority   Enabled    PolicySet        IfIndex IfAlias
--------   -------    ---------        ------- -------
0          False      Global
1          False      Global
2          False      Global
3          False      Global
4          False      Global
5          False      Global
6          False      Global
7          False      Global`,
    options: [
      'Configure DCB on the hosts and switches: tag SMB Direct traffic with a priority, enable Priority Flow Control for that priority, and enable QoS on the adapters.',
      'Disable SMB Multichannel on the hosts.',
      'Replace the RoCEv2 adapters with adapters that support iWARP and keep the current configuration.',
      'Enable SMB encryption on the Scale-Out File Server shares.',
    ],
    answer: [0],
    explanation: "RoCE needs a **lossless** Ethernet fabric. The exhibit shows **Priority Flow Control disabled for every priority**, so RDMA traffic is dropped under congestion. Configure **DCB** end to end: a QoS policy that tags SMB Direct (`New-NetQosPolicy -NetDirectPortMatchCondition 445 -PriorityValue8021Action 3`), `Enable-NetQosFlowControl -Priority 3`, `Enable-NetAdapterQos`, and matching PFC/ETS on the switches.\n\n- SMB Direct relies on Multichannel to discover RDMA paths; disabling it would stop RDMA use entirely.\n- iWARP does not require PFC, but the requirement is to keep the existing adapters, and the problem is a missing configuration, not the hardware.\n- SMB encryption adds overhead and does not address packet loss.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-061',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'A Hyper-V host has two RDMA-capable 25 GbE adapters that are members of an LBFO NIC team bound to a virtual switch. SMB traffic from the host to a Scale-Out File Server never uses RDMA. You need the host to use SMB Direct while keeping NIC redundancy for the virtual switch. What should you do?',
    options: [
      'Replace the LBFO team with a Switch Embedded Teaming (SET) virtual switch, create host vNICs for SMB, and enable RDMA on those vNICs.',
      'Enable RDMA on the LBFO team interface by using Enable-NetAdapterRdma.',
      'Disable SMB Multichannel so that SMB uses the team interface directly.',
      'Create a second LBFO team in Switch Independent mode for SMB traffic.',
    ],
    answer: [0],
    explanation: "RDMA is **not supported on LBFO teams**. **Switch Embedded Teaming (SET)** provides teaming inside the Hyper-V switch and supports RDMA on host virtual NICs (`Enable-NetAdapterRdma -Name \"vEthernet (SMB1)\"`), giving both redundancy and SMB Direct.\n\n- An LBFO team interface cannot be RDMA-enabled, in any teaming mode.\n- Disabling Multichannel removes the mechanism SMB uses to find RDMA interfaces.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-062',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'A Scale-Out File Server stores VHDX files for 200 virtual desktop VMs. Each VM must be guaranteed at least 100 IOPS and capped at 400 IOPS, independently of the other VMs. You need to configure this with the fewest policies. What should you create?',
    options: [
      'One Storage QoS policy of type Dedicated with MinimumIops 100 and MaximumIops 400',
      'One Storage QoS policy of type Aggregated with MinimumIops 100 and MaximumIops 400',
      'One Storage QoS policy of type Aggregated with MinimumIops 20000 and MaximumIops 80000',
      '200 Storage QoS policies of type Aggregated, one per VM, each with MinimumIops 100 and MaximumIops 400',
    ],
    answer: [0],
    explanation: "A **Dedicated** policy applies its minimum and maximum to **each** virtual disk separately, so a single policy gives every VM its own 100-400 IOPS range.\n\n- An Aggregated 100/400 policy would make all 200 VMs **share** 100-400 IOPS.\n- An Aggregated 20,000/80,000 policy only bounds the total; one busy VM could take far more than 400 IOPS.\n- 200 policies work but are not the fewest, and Microsoft suggests keeping Aggregated policies to about 20 disks.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-063',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'Your Hyper-V hosts store VHDX files on a Scale-Out File Server cluster named SOFS1. You need to apply a centrally managed Storage QoS policy named Gold to the disks of a VM named SQL1. What should you do?',
    options: [
      'On SOFS1, run New-StorageQosPolicy to create Gold, then on the Hyper-V host run Set-VMHardDiskDrive -QoSPolicyID with the policy ID for the disks of SQL1.',
      'On the Hyper-V host, run Set-VMHardDiskDrive -MinimumIOPS and -MaximumIOPS for the disks of SQL1.',
      'On the Hyper-V host, run New-NetQosPolicy for SMB traffic from SQL1.',
      'On SOFS1, run Set-SmbBandwidthLimit -Category VirtualMachine.',
    ],
    answer: [0],
    explanation: "Storage QoS policies are created and monitored on the **storage cluster** (`New-StorageQosPolicy`, `Get-StorageQosFlow`) and assigned on the **Hyper-V host** by tagging each virtual disk with the policy ID (`Set-VMHardDiskDrive -QoSPolicyID`).\n\n- `-MinimumIOPS/-MaximumIOPS` is the legacy per-host Hyper-V QoS, not a central policy.\n- `New-NetQosPolicy` is network QoS (DCB), not storage IOPS.\n- `Set-SmbBandwidthLimit` limits bandwidth by traffic category, not per-VM IOPS.",
    lesson: '5.3-storage-spaces-s2d',
  },
  {
    id: 'd5-064',
    topic: '5.3',
    type: 'match',
    difficulty: 2,
    stem: 'You are presenting a LUN from an iSCSI Target Server named SAN1 to a server named SQL1. Match each cmdlet to the task it performs.',
    pairs: [
      ['New-IscsiVirtualDisk', 'Create the VHDX file that backs the LUN on SAN1'],
      ['New-IscsiServerTarget', 'Create a target on SAN1 and list the initiator IQNs that may connect'],
      ['Add-IscsiVirtualDiskTargetMapping', 'Assign the virtual disk to the target as a LUN'],
      ['New-IscsiTargetPortal', 'On SQL1, add SAN1 as a discovery portal'],
      ['Connect-IscsiTarget', 'On SQL1, log on to the target persistently'],
    ],
    explanation: "On the target: create the virtual disk, create the target with `-InitiatorIds`, then map the disk to the target. On the initiator: add the target portal (discovery on TCP 3260), then connect with `-IsPersistent $true` so the session returns after reboots.",
    lesson: '5.3-storage-replica-iscsi',
  },
  {
    id: 'd5-065',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'You are adding a second node named SQL2 to a failover cluster that uses a LUN from an iSCSI Target Server named SAN1. SQL2 can reach SAN1 on TCP 3260, but it cannot connect to the target. Refer to the exhibit. You need both SQL1 and SQL2 to access the LUN. What should you run on SAN1?',
    exhibit: String.raw`PS C:\> Get-IscsiServerTarget -TargetName SQLData | Format-List TargetName, TargetIqn, InitiatorIds, LunMappings, Status

TargetName   : SQLData
TargetIqn    : iqn.1991-05.com.microsoft:san1-sqldata-target
InitiatorIds : {Iqn:iqn.1991-05.com.microsoft:sql1.contoso.com}
LunMappings  : {TargetName:SQLData;VHD:"E:\iSCSIVirtualDisks\SQLData.vhdx";LUN:0}
Status       : Connected`,
    options: [
      'Set-IscsiServerTarget -TargetName SQLData -InitiatorIds "IQN:iqn.1991-05.com.microsoft:sql1.contoso.com","IQN:iqn.1991-05.com.microsoft:sql2.contoso.com"',
      'Set-IscsiServerTarget -TargetName SQLData -InitiatorIds "IQN:iqn.1991-05.com.microsoft:sql2.contoso.com"',
      'Add-IscsiVirtualDiskTargetMapping -TargetName SQLData -Path E:\\iSCSIVirtualDisks\\SQLData.vhdx',
      'Set-IscsiServerTarget -TargetName SQLData -EnableChap $true',
    ],
    answer: [0],
    explanation: "The target's access list (`InitiatorIds`) contains only SQL1's IQN, so SQL2 is refused. `Set-IscsiServerTarget -InitiatorIds` **replaces** the list, so it must contain **both** nodes' IQNs.\n\n- Setting only SQL2's IQN would lock SQL1 out.\n- The LUN is already mapped (LUN 0); mapping again does not change who may connect.\n- CHAP adds authentication but does not add SQL2 to the access list.",
    lesson: '5.3-storage-replica-iscsi',
  },
  {
    id: 'd5-066',
    topic: '5.3',
    type: 'fill',
    difficulty: 1,
    stem: 'You must update the UEFI firmware on a BitLocker-protected server and want it to restart once without prompting for the recovery key, with protection resuming automatically afterwards. Which BitLocker cmdlet should you run with -MountPoint C: -RebootCount 1?',
    answer: ['Suspend-BitLocker'],
    explanation: "`Suspend-BitLocker -MountPoint C: -RebootCount 1` keeps the volume encrypted but makes the key available in the clear until one restart has occurred, then protection resumes. Firmware changes alter TPM measurements, which would otherwise trigger BitLocker recovery.",
    lesson: '5.3-bitlocker',
  },
  {
    id: 'd5-067',
    topic: '5.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Your domain servers use BitLocker with TPM+PIN protectors on their operating system volumes. The servers must restart unattended during patching when they are connected to the wired corporate network, and must still prompt for the PIN elsewhere. DHCP is provided by a server named DHCP1. You select a member server named Server2 to support this. Which two items should you install on Server2? (Choose two.)',
    options: [
      'The Windows Deployment Services role',
      'The BitLocker Network Unlock feature',
      'The DHCP Server role',
      'The Host Guardian Service role',
      'The Network Policy and Access Services role',
    ],
    answer: [0, 1],
    explanation: "**Network Unlock** needs a server running **WDS** (the WDS service must be running) with the **BitLocker Network Unlock** feature, plus a Network Unlock certificate and Group Policy (*Allow network unlock at startup* and the public certificate). Clients need UEFI DHCP and TPM+PIN.\n\n- The DHCP server must be **separate** from the WDS server, and DHCP1 already provides it.\n- Host Guardian Service is for shielded VMs, not Network Unlock.\n- NPS is unrelated.",
    lesson: '5.3-bitlocker',
  },
  {
    id: 'd5-068',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'A server named FS1 had its C: volume encrypted with BitLocker before you deployed a Group Policy that stores recovery information in AD DS. Refer to the exhibit. You need the existing recovery password for C: to be stored in AD DS without changing the protectors. Which command should you run?',
    exhibit: String.raw`PS C:\> (Get-BitLockerVolume -MountPoint C:).KeyProtector

KeyProtectorId      : {8A1F3C52-6D47-4B0E-9E21-3F5C7A90B1D4}
AutoUnlockProtector :
KeyProtectorType    : Tpm
KeyFileName         :
RecoveryPassword    :
KeyCertificateType  :
Thumbprint          :

KeyProtectorId      : {E4B97A10-2C3D-4F58-A6E1-0B9D2C47F813}
AutoUnlockProtector :
KeyProtectorType    : RecoveryPassword
KeyFileName         :
RecoveryPassword    : 120736-150425-094633-047905-451000-152603-367675-429396
KeyCertificateType  :
Thumbprint          :`,
    options: [
      'Backup-BitLockerKeyProtector -MountPoint C: -KeyProtectorId "{E4B97A10-2C3D-4F58-A6E1-0B9D2C47F813}"',
      'Backup-BitLockerKeyProtector -MountPoint C: -KeyProtectorId "{8A1F3C52-6D47-4B0E-9E21-3F5C7A90B1D4}"',
      'BackupToAAD-BitLockerKeyProtector -MountPoint C: -KeyProtectorId "{E4B97A10-2C3D-4F58-A6E1-0B9D2C47F813}"',
      'gpupdate /force',
    ],
    answer: [0],
    explanation: "`Backup-BitLockerKeyProtector` writes a **recovery password** protector to AD DS (as an msFVE-RecoveryInformation object under the computer). You must pass the ID of the **RecoveryPassword** protector, which is {E4B97A10-...}.\n\n- The {8A1F3C52-...} protector is the TPM protector, which has no recovery password to escrow.\n- `BackupToAAD-BitLockerKeyProtector` stores the key in **Microsoft Entra ID**, not AD DS.\n- Applying the policy does not retroactively escrow protectors created earlier.",
    lesson: '5.3-bitlocker',
  },
  {
    id: 'd5-069',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: 'You move a BitLocker-encrypted data disk from a failed server to a new server named Server2. Refer to the exhibit. You have the recovery password from AD DS. You need to access the data on E: by using PowerShell. Which cmdlet should you run?',
    exhibit: String.raw`C:\> manage-bde -status E:
BitLocker Drive Encryption: Configuration Tool version 10.0.26100
Copyright (C) 2013 Microsoft Corporation. All rights reserved.

Volume E: [Label Unknown]
[Data Volume]

    Size:                 Unknown GB
    BitLocker Version:    2.0
    Conversion Status:    Unknown
    Percentage Encrypted: Unknown%
    Encryption Method:    XTS-AES 128
    Protection Status:    Unknown
    Lock Status:          Locked
    Identification Field: Unknown
    Automatic Unlock:     Disabled
    Key Protectors:
        Numerical Password
        Password`,
    options: [
      'Unlock-BitLocker -MountPoint E: -RecoveryPassword <48-digit password>',
      'Resume-BitLocker -MountPoint E:',
      'Disable-BitLocker -MountPoint E:',
      'Enable-BitLockerAutoUnlock -MountPoint E:',
    ],
    answer: [0],
    explanation: "The volume is **Locked**, and it has a numerical password (recovery password) protector. `Unlock-BitLocker -RecoveryPassword` (or `manage-bde -unlock E: -RecoveryPassword ...`) restores access.\n\n- `Resume-BitLocker` re-enables protection after a suspension; it does not unlock.\n- `Disable-BitLocker` (decryption) and `Enable-BitLockerAutoUnlock` both require the volume to be unlocked first.",
    lesson: '5.3-bitlocker',
  },
  {
    id: 'd5-070',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: 'A BitLocker-encrypted data disk on a server named FS4 was physically damaged. Typing the correct recovery password no longer unlocks the volume because BitLocker metadata is corrupt. There is no backup of the data. Group Policy was configured to store recovery passwords and key packages in AD DS. You need to salvage as much data as possible. What should you do?',
    options: [
      'Export the key package from AD DS and run repair-bde with the key package and recovery password, writing to a different drive that is at least as large.',
      'Run Unlock-BitLocker -MountPoint E: -RecoveryPassword repeatedly until the volume mounts.',
      'Run chkdsk E: /r and then unlock the volume.',
      'Run manage-bde -off E: to decrypt the volume in place.',
    ],
    answer: [0],
    explanation: "`repair-bde` reconstructs critical structures and decrypts recoverable blocks onto **another** drive (whose contents are overwritten). When BitLocker metadata is corrupt it needs the **key package** plus the recovery password or recovery key; because the policy saved key packages to AD DS, you can obtain it there.\n\n- Retrying `Unlock-BitLocker` cannot work when metadata is corrupt.\n- `chkdsk` cannot read a locked encrypted volume.\n- `manage-bde -off` requires an unlocked volume and would write to the damaged disk.",
    lesson: '5.3-bitlocker',
  },
];
