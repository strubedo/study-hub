// Domain 2 — Implement and manage storage. Original questions modelled on Microsoft's published item
// formats (study guide wording, exam sandbox item types, practice assessment style); no recalled exam
// content. Facts checked against Microsoft Learn on 2026-11-23. Command output and portal text in
// exhibits are documentation-based (not captured from a subscription) and are listed in REVIEW-TODO.md.
const L211 = '2.1-storage-firewalls';
const L212 = '2.1-sas-stored-access-policies';
const L213 = '2.1-access-keys';
const L214 = '2.1-azure-files-identity';
const L221 = '2.2-storage-accounts';
const L222 = '2.2-redundancy';
const L223 = '2.2-object-replication';
const L224 = '2.2-encryption';
const L225 = '2.2-storage-explorer-azcopy';
const L231 = '2.3-azure-files';
const L232 = '2.3-files-snapshots-soft-delete';
const L233 = '2.3-blob-containers';
const L234 = '2.3-access-tiers';
const L235 = '2.3-lifecycle-management';
const L236 = '2.3-blob-versioning';

const bank = [
  // ---------- 2.1 Configure access to storage ----------
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: L211,
    stem: 'Refer to the exhibit. Every client holds a valid user delegation SAS with read and list permissions and no IP restriction. Which two clients can read blobs in stcontosodata01? (Choose two.)',
    exhibit: `Storage account: stcontosodata01   Region: East US   Resource group: rg-data-prod
Networking > Public network access: Enabled from selected networks

Virtual networks
  Virtual network   Subnet     Address range   Endpoint status
  vnet-hub          snet-app   10.10.1.0/24    Enabled (Microsoft.Storage)

IPv4 addresses
  203.0.113.0/27

Exceptions
  [ ] Allow Azure services on the trusted services list to access this storage account

Client      Where it runs                                       Source address
vm-app-01   vnet-hub / snet-app, East US                        10.10.1.4
vm-web-01   vnet-hub / snet-web, East US (no service endpoint)  10.10.2.4
Branch1     Branch office, internet via NAT                     203.0.113.20
Home1       Home broadband                                      203.0.113.40
Partner1    Partner datacenter                                  192.0.2.15`,
    options: ['vm-app-01', 'vm-web-01', 'Branch1', 'Home1', 'Partner1'],
    answer: [0, 2],
    explanation: "With **Enabled from selected networks** the default action is Deny, so only listed sources pass the firewall. **vm-app-01** is in snet-app, which has a Microsoft.Storage service endpoint and a virtual network rule. **Branch1** arrives from 203.0.113.20, inside 203.0.113.0/27 (203.0.113.0 to 203.0.113.31). **vm-web-01** is in a subnet with no rule; an IP rule couldn't help either, because IP rules don't apply to clients in the same region as the account. **Home1** (203.0.113.40) is outside the /27, and **Partner1** (192.0.2.15) matches no rule. A valid SAS never overrides the firewall." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L211,
    stem: 'Refer to the exhibit. You need to meet the requirement for stcontosodata01. What should you do?',
    exhibit: `Site / network     Connectivity                                 Address space
HQ (on-premises)   Site-to-site VPN to vnet-hub (East US)       10.50.0.0/16
vnet-hub           Hub virtual network, East US                 10.10.0.0/16

Storage account stcontosodata01 (StorageV2, East US)
Requirement: HQ servers must reach blob data only through the VPN tunnel,
             and the account's public endpoint must be disabled.`,
    options: ['Create a private endpoint for the blob service of stcontosodata01 in vnet-hub, and configure DNS so that HQ resolves the account name to the private IP address', 'Add an IP network rule for 10.50.0.0/16 and set the default action to Deny', 'Enable the Microsoft.Storage service endpoint on the GatewaySubnet of vnet-hub and add a virtual network rule for that subnet', 'Select Allow Azure services on the trusted services list to access this storage account'],
    answer: [0],
    explanation: "A **private endpoint** gives the blob service a private IP in vnet-hub that HQ can reach over the VPN, and it keeps working when public network access is **Disabled**. Name resolution must return the private IP, typically through the privatelink.blob.core.windows.net zone with a DNS forwarder for HQ. IP rules accept only public addresses: RFC 1918 ranges such as 10.50.0.0/16 are rejected, and IP rules act only on the public endpoint, which must be disabled. A service endpoint still uses the public endpoint and doesn't extend to on-premises traffic. The trusted services exception is for Azure services, not your servers." },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L211,
    stem: 'Refer to the exhibit. Clients at 198.51.100.7 can still read data from stcontosodata01. You must allow only 203.0.113.0/27 to reach the public endpoint by running: az storage account update -g rg-data-prod -n stcontosodata01 --default-action ____. Enter the missing value.',
    exhibit: `$ az storage account network-rule list -g rg-data-prod --account-name stcontosodata01 --query "ipRules[].ipAddressOrRange"
[
  "203.0.113.0/27"
]
$ az storage account show -g rg-data-prod -n stcontosodata01 --query networkRuleSet.defaultAction
"Allow"`,
    answer: ['Deny'],
    explanation: "The IP rule exists, but the default action is still **Allow**, so every network can reach the endpoint and the rule has no effect. Microsoft Learn: network rules have no effect until the default action is set to **Deny**. `--default-action Deny` corresponds to **Enabled from selected networks** in the portal. Set up all required rules (or private endpoints) before switching, or legitimate clients lose access." },
  { topic: '2.1', type: 'match', difficulty: 2, lesson: L211,
    stem: 'stcontosodata01 uses "Enabled from selected networks". Match each access requirement to the configuration that meets it.',
    pairs: [
      ['Servers at a branch office reach the internet through the NAT address 203.0.113.10', 'IP network rule'],
      ['VMs in snet-app of vnet-hub, in the same region as the account, must read blobs', 'Virtual network rule with a storage service endpoint on the subnet'],
      ['One specific Azure AI Search service in the same tenant, which has no fixed IP address, must index blobs', 'Resource instance rule'],
      ['On-premises servers on 10.50.0.0/16 reach Azure only through ExpressRoute private peering', 'Private endpoint'],
      ['Azure Monitor must read the classic storage logs and metrics while all other traffic stays blocked', 'Network security exceptions for logging and metrics'],
    ],
    explanation: "Public NAT addresses fit an **IP network rule**. Same-region VMs need a **virtual network rule** with a Microsoft.Storage (or Microsoft.Storage.Global) service endpoint; IP rules don't work for same-region clients. A specific Azure resource without a stable IP is admitted with a **resource instance rule** (its managed identity still needs a data role). Private addresses can't be used in IP rules, and ExpressRoute private peering reaches private IPs, so on-premises servers need a **private endpoint**. Read access to logs and metrics is granted with the **exceptions** (bypass Logging, Metrics)." },
  { topic: '2.1', type: 'multi', difficulty: 3, lesson: L212,
    stem: 'Refer to the exhibit. App1 uses the SAS shown. Which two requests succeed? (Choose two.)',
    exhibit: `Storage account stcontosodata01: Public network access = Enabled from all networks
Shared Key access: Enabled

SAS URL issued to App1 (one field per line):
https://stcontosodata01.blob.core.windows.net/?
  sv=2022-11-02
  ss=b
  srt=co
  sp=rl
  st=2026-11-23T08:00:00Z
  se=2026-11-23T20:00:00Z
  sip=203.0.113.0-203.0.113.255
  spr=https
  sig=<signature>

All requests are made on 2026-11-23 at 10:15 UTC.`,
    options: ['List the blobs in container reports from 203.0.113.40 over HTTPS', 'Download reports/q3.pdf from 203.0.113.40 over HTTPS', 'Upload reports/q4.pdf from 203.0.113.40 over HTTPS', 'Download reports/q3.pdf from 198.51.100.10 over HTTPS', 'Read messages from the queue orders from 203.0.113.40 over HTTPS', 'Download reports/q3.pdf from 203.0.113.40 over HTTP'],
    answer: [0, 1],
    explanation: "This is an **account SAS** (it has ss and srt). Walk the fields: service `ss=b` is Blob only; resource types `srt=co` allow container-level and object-level operations; permissions `sp=rl` are read and list; 10:15 is inside 08:00 to 20:00; `sip` allows 203.0.113.0 to 203.0.113.255; `spr=https` requires HTTPS. **Listing blobs** is a container-level operation with List permission, and **downloading a blob** is an object-level Read: both succeed from 203.0.113.40 over HTTPS. The upload needs create or write permission. 198.51.100.10 is outside `sip`. Queue access fails because `ss` contains only b. HTTP fails because `spr=https`." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L212,
    stem: 'Refer to the exhibit. The SAS issued to partners has leaked. You must revoke it immediately without affecting UploadApp or the two line-of-business apps. What should you do?',
    exhibit: `Container: invoices   Account: stcontosodata01

Stored access policies
  Identifier      Start                  Expiry                 Permissions
  read-partners   2026-11-01T00:00:00Z   2027-11-01T00:00:00Z   rl
  upload-app      2026-11-01T00:00:00Z   2027-05-01T00:00:00Z   acw

Token given to partners (service SAS, signed with key1):
  sv=2022-11-02&sr=c&si=read-partners&spr=https&sig=<signature>
Token used by UploadApp (service SAS, signed with key1):
  sv=2022-11-02&sr=c&si=upload-app&spr=https&sig=<signature>
Two line-of-business apps use a connection string with key1.`,
    options: ['Delete the read-partners stored access policy', 'Regenerate key1', 'Run az storage account revoke-delegation-keys for stcontosodata01', 'Set the anonymous access level of the invoices container to Private'],
    answer: [0],
    explanation: "The partner token references the stored access policy through `si=read-partners`. **Deleting the policy** (or setting its expiry in the past, or renaming it) invalidates every SAS bound to it and nothing else. Don't re-create it with the same name, or the leaked token works again. Regenerating key1 would revoke the partner token but also UploadApp's token (also signed with key1) and break both apps that use key1. Revoking user delegation keys affects only user delegation SAS, and this is a service SAS. The container's anonymous access level doesn't affect SAS-authorized requests." },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L212,
    stem: 'Refer to the exhibit. The second command must produce a SAS that inherits its permissions and expiry from the read-partners stored access policy. Enter the parameter that replaces the blank.',
    exhibit: `#!/bin/bash
# Partner tokens must be revocable centrally without rotating account keys
az storage container policy create --account-name stcontosodata01 --account-key "$KEY" \\
  --container-name invoices --name read-partners --permissions rl \\
  --expiry 2027-11-01T00:00:00Z

az storage container generate-sas --account-name stcontosodata01 --account-key "$KEY" \\
  --name invoices --https-only ________ read-partners`,
    answer: ['--policy-name'],
    explanation: "`az storage container generate-sas --policy-name read-partners` creates a service SAS whose `si` field points to the stored access policy, so start, expiry and permissions come from the policy. Don't also pass `--permissions` or `--expiry` values that the policy already defines: a field can be set in the policy or in the SAS, not both. In PowerShell the equivalent is `New-AzStorageContainerSASToken -Policy read-partners`." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L212,
    stem: 'App2 received a user delegation SAS for the telemetry container of stcontosodata01. You suspect the token leaked and must invalidate it as soon as possible. Other applications authenticate with the account keys, and the keys must not change. What should you do?',
    options: ['Run az storage account revoke-delegation-keys for stcontosodata01', 'Regenerate key2 of stcontosodata01', 'Delete the stored access policy that the SAS references', 'Set AllowSharedKeyAccess to false on stcontosodata01'],
    answer: [0],
    explanation: "A user delegation SAS is signed with a user delegation key obtained with Microsoft Entra credentials. **Revoking the user delegation keys** invalidates every user delegation SAS on the account; Microsoft notes there can be a short delay because keys and role assignments are cached. Account keys don't sign user delegation SAS, so regenerating them has no effect on it (and would break the other apps). User delegation SAS can't use stored access policies. Disallowing Shared Key blocks key-signed SAS but **not** user delegation SAS." },
  { topic: '2.1', type: 'order', difficulty: 1, lesson: L213,
    stem: 'All applications that use stcontosodata01 currently authenticate with key1. Put the steps in the order Microsoft documents for rotating both access keys without an outage.',
    items: ['Update all applications to use key2', 'Regenerate key1', 'Update all applications to use the new key1', 'Regenerate key2'],
    explanation: "Move clients to the key you are **not** regenerating, regenerate the idle key, move clients back, then regenerate the other key. At every moment the applications use a key that is valid. Regenerating a key also revokes the service and account SAS tokens signed with it." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L213,
    stem: 'Refer to the exhibit. Which request to Blob Storage in stcontosodata01 succeeds, assuming the caller otherwise has the required permissions?',
    exhibit: `$ az storage account show -g rg-data-prod -n stcontosodata01 --query "{sharedKey:allowSharedKeyAccess, publicNetwork:publicNetworkAccess}"
{
  "publicNetwork": "Enabled",
  "sharedKey": false
}`,
    options: ['A download that uses a user delegation SAS created with az storage blob generate-sas --as-user --auth-mode login', 'A download that uses a service SAS bound to a stored access policy', 'An AzCopy upload that uses an account SAS', 'A .NET application that uses a connection string containing AccountKey=<storage-account-key>'],
    answer: [0],
    explanation: "With **allowSharedKeyAccess = false**, every request authorized with the account key is rejected: connection strings and keys directly, and also **service SAS** and **account SAS**, because both are signed with the account key. A **user delegation SAS** is signed with a key derived from Microsoft Entra credentials, so it is still accepted, as are OAuth tokens." },
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: L213,
    stem: 'Which two statements about storage account access keys are true? (Choose two.)',
    options: ['Regenerating key1 invalidates service SAS tokens that were signed with key1', 'A key expiration policy rotates the keys automatically when the interval expires', 'A user with the Reader role on the storage account can view the access keys', 'Regenerating both keys invalidates all user delegation SAS tokens', 'The Storage Account Key Operator Service Role can list and regenerate the keys', 'Each storage account has one primary key and up to five secondary keys'],
    answer: [0, 4],
    explanation: "A SAS signed with a key stops working when that key is **regenerated**; that is the only way to revoke an ad hoc service or account SAS early. **Owner, Contributor and Storage Account Key Operator Service Role** include the listkeys and regeneratekey actions; Reader doesn't. A key expiration policy only sets a rotation reminder and drives Azure Policy compliance; it rotates nothing. User delegation SAS tokens aren't signed with account keys. Every account has exactly two 512-bit keys, key1 and key2." },
  { topic: '2.1', type: 'match', difficulty: 2, lesson: L214,
    stem: 'Match each Azure Files scenario to the identity-based access option that fits it.',
    pairs: [
      ['Windows 11 devices are Microsoft Entra joined, users are synced from on-premises AD DS, and the devices have no line of sight to domain controllers', 'Microsoft Entra Kerberos'],
      ['Domain-joined Windows servers (not Microsoft Entra hybrid joined) on the corporate network reach domain controllers, and users are synced to Microsoft Entra ID', 'On-premises AD DS'],
      ['Azure VMs are joined to a managed domain in Azure; there is no on-premises Active Directory', 'Microsoft Entra Domain Services'],
      ['AD DS authentication is configured but the forest is not synced to Microsoft Entra ID; every authenticated user needs read and write share access', 'Default share-level permission'],
    ],
    explanation: "**Microsoft Entra Kerberos** issues Kerberos tickets from Microsoft Entra ID, so Entra joined or hybrid joined clients don't need to reach a DC. Classic domain-joined servers that reach DCs use **AD DS** authentication. VMs joined to a managed domain use **Microsoft Entra Domain Services**. Without sync, RBAC can't target the on-premises identities, so use the **default share-level permission** (for example StorageFileDataSmbShareContributor) and refine with Windows ACLs." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L214,
    stem: 'Refer to the exhibit. User1 maps the finance share and opens the Budget folder. What can User1 do in Budget?',
    exhibit: `File share: finance (stcontosofiles01)   Identity source: On-premises AD DS

Share-level role assignments (Access control (IAM) on the share)
  Principal        Role
  grp-finance      Storage File Data SMB Share Reader
  grp-it-admins    Storage File Data SMB Share Elevated Contributor
Default share-level permission: None

Windows ACL on \\\\stcontosofiles01.file.core.windows.net\\finance\\Budget
  CONTOSO\\grp-finance     Modify
  CONTOSO\\grp-it-admins   Full control

User1 is a member of grp-finance only.`,
    options: ['Read files only', 'Read, create, modify and delete files', 'Read, create, modify and delete files and change permissions', "Nothing; the share can't be mounted"],
    answer: [0],
    explanation: "Effective access is the **more restrictive** of the share-level permission and the Windows ACL. The share level (Storage File Data SMB Share **Reader**, through grp-finance) allows only read, so the NTFS Modify grant can't be used. User1 can mount the share because a share-level role exists. Changing permissions would need Elevated Contributor at the share level plus an ACL that allows it." },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L214,
    stem: 'Refer to the exhibit. Which built-in role should you assign to Admin1 at the scope of the projects share?',
    exhibit: `Share: projects (stcontosofiles01)   Identity source: Microsoft Entra Kerberos
Requirements for Admin1:
  - Read, create, modify and delete files and folders over SMB
  - Change the Windows ACLs on folders
  - Must NOT receive access equivalent to the storage account key
  - Use the least privilege`,
    options: ['Storage File Data SMB Share Contributor', 'Storage File Data SMB Share Elevated Contributor', 'Storage File Data SMB Admin', 'Storage Account Contributor'],
    answer: [1],
    explanation: "**SMB Share Elevated Contributor** grants read, write, delete **and modify ACLs**. SMB Share Contributor can't change ACLs. Storage File Data SMB Admin gives access equivalent to the storage account key, which the requirements rule out. Storage Account Contributor is a management-plane role; it grants no SMB data access by itself (although it can list keys, which is far more than least privilege)." },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L214,
    stem: "Contoso's on-premises AD DS forest is synced to a Microsoft Entra tenant that is different from the tenant that hosts stcontosofiles01. Users must reach the shares with Kerberos, and Windows ACLs must control access to folders. You need to grant share-level access with the least administrative effort. What should you do?",
    options: ['Configure AD DS authentication on the account and set a default share-level permission', 'Assign Storage File Data SMB Share Contributor to each user in the storage account tenant', 'Switch the account to Microsoft Entra Domain Services authentication', 'Mount the shares with the storage account key on every client'],
    answer: [0],
    explanation: "Share-level RBAC needs the user's identity in the **same** Microsoft Entra tenant as the storage account. Microsoft Learn lists this multi-tenant case as a reason to use the **default share-level permission**, which applies to every identity that authenticates against the AD DS domain; Windows ACLs then do the fine-grained work. Assigning roles fails because the users don't exist in that tenant. Microsoft Entra Domain Services is a different directory and doesn't solve the problem. Mounting with the key removes per-user access control." },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L211,
    stem: 'Refer to the exhibit. Requests from vm-batch-01 to stcontosodata01 are refused with HTTP 403. You need vm-batch-01 to reach the account without opening it to other sources. What should you do?',
    exhibit: `Resource          Type              Region    Details
vm-batch-01       Virtual machine   East US   Subnet vnet-hub/snet-batch (no service endpoints)
                                              Public IP 198.51.100.20
stcontosodata01   Storage account   East US   Public network access: Enabled from selected networks
                                              IPv4 rules: 198.51.100.20
                                              Virtual network rules: none`,
    options: ['Enable the Microsoft.Storage service endpoint on snet-batch and add a virtual network rule for snet-batch', 'Change the IP rule to 198.51.100.20/32', "Add the VM's private IP address as an IP rule", 'Select Allow Azure services on the trusted services list to access this storage account'],
    answer: [0],
    explanation: "IP network rules have **no effect for requests from the same Azure region** as the account, because that traffic uses private Azure addresses rather than the VM's public IP. Use a **virtual network rule** with a service endpoint (or a private endpoint). /31 and /32 prefixes aren't supported in IP rules (use the single address), and it would still not work for a same-region client. Private addresses are rejected in IP rules. Virtual machines aren't trusted services." },

  // ---------- 2.2 Configure and manage storage accounts ----------
  { topic: '2.2', type: 'single', difficulty: 1, lesson: L221,
    stem: 'Linux application servers need an NFS 4.1 file share in Azure Files with consistent single-digit millisecond latency. Which storage account type should you create?',
    options: ['Standard general-purpose v2 with LRS', 'Premium block blobs', 'Premium file shares (FileStorage)', 'Standard general-purpose v2 with hierarchical namespace enabled'],
    answer: [2],
    explanation: "Production **NFS** Azure file shares need the **premium file shares** (SSD, FileStorage) account type, which Microsoft recommends when you want SMB and NFS shares. Standard GPv2 pay-as-you-go shares support SMB only. Premium block blob accounts hold blobs, not file shares. Hierarchical namespace enables NFS 3.0 for **Blob Storage**, not Azure Files." },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L221,
    stem: 'Refer to the exhibit. Only one candidate meets the storage account naming rules. Enter it.',
    exhibit: `Candidate names for the new storage account (name availability not yet checked)
  1  stContosoLogs01
  2  st-contoso-logs-01
  3  stcontosologsarchive20261123
  4  stcontosologs01
  5  st_contoso_logs`,
    answer: ['stcontosologs01'],
    explanation: "Storage account names are **3 to 24 characters** of **lowercase letters and digits** only, and must be globally unique. stContosoLogs01 has uppercase letters, st-contoso-logs-01 has hyphens, st_contoso_logs has underscores, and stcontosologsarchive20261123 is 28 characters long. **stcontosologs01** (15 characters) is valid, subject to the global availability check." },
  { topic: '2.2', type: 'match', difficulty: 2, lesson: L222,
    stem: 'Match each requirement to the redundancy option that meets it at the lowest cost.',
    pairs: [
      ['Lowest possible cost; losing data in a datacenter-wide disaster is acceptable', 'LRS'],
      ['Data must not leave the region and must stay writable if one availability zone fails', 'ZRS'],
      ['Survive a regional disaster; the secondary copy needs to be readable only after a failover', 'GRS'],
      ['Read from the secondary region at any time, and a zone failure in the primary must not interrupt writes', 'RA-GZRS'],
      ['Read from the secondary region at any time, and blobs must be movable to the archive tier', 'RA-GRS'],
    ],
    explanation: "**LRS** keeps copies in one datacenter only. **ZRS** spreads synchronous copies over availability zones in one region. **GRS** adds an asynchronous secondary that you can use after failover. **RA-GZRS** combines zone redundancy in the primary with a readable secondary. The last requirement can't use RA-GZRS because ZRS, GZRS and RA-GZRS accounts don't support the archive tier, so **RA-GRS** fits." },
  { topic: '2.2', type: 'multi', difficulty: 3, lesson: L222,
    stem: 'Refer to the exhibit. The time is 10:05 UTC and the primary region is unavailable. Which two statements are true? (Choose two.)',
    exhibit: `$ az storage account show -n stcontosodata01 -g rg-data-prod --expand geoReplicationStats \\
    --query "{sku:sku.name, primary:primaryLocation, secondary:secondaryLocation, statusOfPrimary:statusOfPrimary, geo:geoReplicationStats}"
{
  "geo": {
    "canFailover": true,
    "lastSyncTime": "2026-11-23T09:42:10+00:00",
    "status": "Live"
  },
  "primary": "eastus",
  "secondary": "westus",
  "sku": "Standard_GRS",
  "statusOfPrimary": "unavailable"
}`,
    options: ['Writes made to the primary after 09:42:10 UTC that had not replicated can be lost if you start an unplanned failover', 'After an unplanned failover completes, West US is the primary region and the account is locally redundant (LRS)', 'Applications can read the data now from stcontosodata01-secondary.blob.core.windows.net', 'A customer-managed planned failover is the right choice because it guarantees no data loss', 'You can ask Microsoft to start a Microsoft-managed failover for this account only'],
    answer: [0, 1],
    explanation: "**Last Sync Time** marks the point up to which all writes are in the secondary; later writes can be lost in an **unplanned** failover. After an unplanned failover the secondary becomes the primary and the account is configured as **LRS** until you re-enable geo-redundancy. The SKU is GRS, not RA-GRS, so the -secondary endpoint isn't readable. A planned failover requires both regions to be available. Microsoft-managed failover is done for a whole region or datacenter, never for an individual account on request." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L222,
    stem: 'Refer to the exhibit. A reporting application must read blobs from the secondary region without a failover. Enter the fully qualified host name of the blob endpoint it should use.',
    exhibit: `$ az storage account show -g rg-web-prod -n stcontosoweb01 --query "{sku:sku.name, blob:primaryEndpoints.blob}"
{
  "blob": "https://stcontosoweb01.blob.core.windows.net/",
  "sku": "Standard_RAGZRS"
}`,
    answer: ['stcontosoweb01-secondary.blob.core.windows.net', 'https://stcontosoweb01-secondary.blob.core.windows.net', 'https://stcontosoweb01-secondary.blob.core.windows.net/'],
    explanation: "With RA-GRS or RA-GZRS the secondary endpoint adds **-secondary** to the account name: **stcontosoweb01-secondary.blob.core.windows.net**. The same keys and role assignments work on both endpoints. The secondary is read-only and may lag the primary by up to the Last Sync Time gap." },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L223,
    stem: 'You configure object replication from stcontososrc01 (container reports) to stcontosodst01 (container reports-replica) by using the Azure CLI. Both containers already exist. Put the steps in order.',
    items: ['Enable blob versioning on both accounts and change feed on stcontososrc01', 'Create the replication policy and rule on stcontosodst01', 'Read the policy ID that Azure assigned on stcontosodst01', 'Create the policy on stcontososrc01 with the same policy ID and rules', 'Upload a new block blob to reports and confirm that it appears in reports-replica'],
    explanation: "Versioning on both accounts and change feed on the source are prerequisites. With the CLI or PowerShell you create the policy on the **destination** first; Azure assigns a policy ID, and the same policy must then be created on the **source** (for example by piping `az storage account or-policy show` into `or-policy create --policy @-`). By default only blobs written after the rule exists are replicated, so test with a new upload. In the portal you work from the source and it creates the destination side for you." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L223,
    stem: 'Refer to the exhibit. Creating an object replication policy from stcontososrc01 to stcontosodst01 fails. What should you do?',
    exhibit: `Property                  stcontososrc01 (source)   stcontosodst01 (destination)
Kind                      StorageV2                 StorageV2
Hierarchical namespace    Disabled                  Disabled
Blob versioning           Enabled                   Enabled
Change feed               Disabled                  Disabled
Container                 reports                   reports-replica`,
    options: ['Enable change feed on stcontososrc01', 'Enable change feed on stcontosodst01', 'Disable blob versioning on stcontosodst01', 'Enable hierarchical namespace on both accounts'],
    answer: [0],
    explanation: "Object replication needs **blob versioning on both accounts** and **change feed on the source**, which Azure Storage reads to find writes to replicate. Change feed on the destination isn't required. Versioning must stay enabled on the destination. Hierarchical namespace accounts aren't supported for object replication." },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L223,
    stem: 'Which two statements about object replication are true? (Choose two.)',
    options: ['Only block blobs are replicated', 'Replication is asynchronous, so the destination can lag behind the source', 'Blob snapshots are replicated together with their base blobs', 'Applications can upload new blobs to the destination container while the policy is active', 'Accounts with a hierarchical namespace are supported', 'The source and destination accounts must be in different regions'],
    answer: [0, 1],
    explanation: "Object replication copies **block blobs** only (no append or page blobs) and works **asynchronously** from the source change feed. Snapshots aren't replicated (versions are). Writes to a destination container in a rule fail with 409 Conflict until the rule is removed. Hierarchical namespace isn't supported. The accounts can be in the same region or different regions, subscriptions or tenants." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L224,
    stem: 'Refer to the exhibit. You plan to configure customer-managed keys for stcontosodata01 by using cmk-storage. Which change must you make first to meet the documented requirements?',
    exhibit: `Key vault: kv-contoso-prod (East US)   Permission model: Azure role-based access control
  Soft delete:        Enabled (retention 90 days)
  Purge protection:   Disabled
  Key:                cmk-storage (RSA 3072, enabled)

Storage account: stcontosodata01   System-assigned managed identity: On
  Role assignment on kv-contoso-prod:
    Key Vault Crypto Service Encryption User -> stcontosodata01 (managed identity)`,
    options: ['Enable purge protection on kv-contoso-prod', 'Change the key vault permission model to vault access policies', 'Replace cmk-storage with an RSA 2048 key', 'Assign the Key Vault Administrator role to the managed identity of stcontosodata01'],
    answer: [0],
    explanation: "The vault holding a customer-managed key must have **soft delete and purge protection** enabled. Purge protection is off here and must be turned on (`az keyvault update --enable-purge-protection true`; it can't be turned off later). The RBAC model is supported, the identity already has the role Microsoft documents (Key Vault Crypto Service Encryption User), and RSA keys of 2048, 3072 or 4096 bits are supported. Key Vault Administrator would be excessive and doesn't fix the purge protection requirement." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L224,
    stem: 'A compliance rule requires that all data in stcontosodata01, including its file shares and queues, is encrypted at rest twice with two different keys. The account was created last year with default settings. What should you do?',
    options: ['Create a new storage account with infrastructure encryption enabled and migrate the data to it', 'Run az storage account update with --require-infrastructure-encryption true', 'Configure customer-managed keys for stcontosodata01', 'Create an encryption scope that requires infrastructure encryption and set it as the default for every container'],
    answer: [0],
    explanation: "**Infrastructure encryption** adds a second layer with a separate key, but it can be enabled **only when the account is created**; you can't turn it on later. Customer-managed keys change who controls the single service-level key; they don't add a second layer. An encryption scope can require infrastructure encryption, but scopes apply only to blobs, and a container's default scope is set at container creation, so it can't cover existing data, file shares or queues." },
  { topic: '2.2', type: 'match', difficulty: 2, lesson: L224,
    stem: 'Match each requirement to the encryption feature that meets it.',
    pairs: [
      ['The security team must rotate and audit the key that protects all blob data, using Azure Key Vault', 'Customer-managed keys'],
      ['A client application sends its own AES-256 key with every blob read and write, and Azure must not store the key', 'Customer-provided keys'],
      ['Two customers share one storage account, and each customer container must be protected by a different key', 'Encryption scopes'],
      ['Regulations require data at rest to be encrypted twice with two different algorithms and keys', 'Infrastructure encryption'],
      ['No key management overhead is acceptable for the team', 'Microsoft-managed keys'],
    ],
    explanation: "**Customer-managed keys** live in Key Vault or Managed HSM and you control rotation. **Customer-provided keys** are supplied on each Blob request over HTTPS; Azure stores only a hash. **Encryption scopes** give per-container or per-blob keys inside one account. **Infrastructure encryption** adds a second, infrastructure-level layer (chosen at account creation). **Microsoft-managed keys** are the default and need no work." },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L225,
    stem: 'Refer to the exhibit. The command must copy all three files, keeping the folder structure. Enter the flag that completes it.',
    exhibit: `PS C:\\> Get-ChildItem C:\\Exports -Recurse -File | Select-Object FullName

FullName
--------
C:\\Exports\\summary.csv
C:\\Exports\\2026\\10\\orders.csv
C:\\Exports\\2026\\11\\orders.csv

PS C:\\> azcopy copy 'C:\\Exports' 'https://stcontosodata01.blob.core.windows.net/exports?<sas-token>' ________`,
    answer: ['--recursive', '--recursive=true', '--recursive true'],
    explanation: "`azcopy copy` doesn't descend into subdirectories unless you add **--recursive** (the reference lists it as false by default). Without it the two files in the 2026 subfolders aren't copied; with it AzCopy recreates the folder structure as virtual directories (Exports/2026/10/orders.csv). `azcopy sync`, by contrast, is recursive by default." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L225,
    stem: 'Refer to the exhibit. What is the result of the azcopy command?',
    exhibit: `Local folder /srv/site               Container $web in stcontosoweb01
  index.html  (modified 10:00)         index.html  (modified 09:00)
  app.js      (modified 10:00)         app.js      (modified 10:05)
                                       old.css     (modified 08:00)

$ azcopy sync '/srv/site' 'https://stcontosoweb01.blob.core.windows.net/$web?<sas-token>' --delete-destination=true`,
    options: ['index.html is uploaded, app.js is skipped, and old.css is deleted from the container', 'index.html and app.js are uploaded, and old.css is downloaded to /srv/site', 'All files are uploaded and old.css is kept', 'Nothing is copied because --recursive was not specified'],
    answer: [0],
    explanation: "`azcopy sync` is **one-way** (source to destination), compares **last-modified times** and skips a file when the destination copy is newer: index.html (local 10:00, blob 09:00) is uploaded and app.js (blob newer at 10:05) is skipped. `--delete-destination=true` removes destination files that don't exist at the source, so old.css is deleted. Sync never downloads to the source, and it is recursive by default." },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L225,
    stem: 'From Azure Cloud Shell, you run azcopy copy with SAS tokens to copy 2 TB of blobs from stcontososrc01 to stcontosodst01. Both accounts are in East US. How does the data travel?',
    options: ['Directly between the storage services by using server-to-server APIs, without passing through Cloud Shell', 'Through the Cloud Shell container, which downloads and re-uploads each blob', 'Through a temporary container that AzCopy creates in the destination account', 'Through the Cloud Shell storage account file share'],
    answer: [0],
    explanation: "For account-to-account copies AzCopy uses **server-to-server** operations such as Put Block From URL, so the data moves between storage servers and the client only orchestrates the job. That is why a small VM or Cloud Shell can move large volumes. No staging container or file share is involved. If you use Microsoft Entra ID for both sides, both accounts must be in the same tenant." },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L221,
    stem: 'Refer to the exhibit. Enter the value that the second command returns.',
    exhibit: `$ az storage account create --name stcontosodev01 --resource-group rg-dev --location eastus
$ az storage account show -n stcontosodev01 -g rg-dev --query sku.name -o tsv`,
    answer: ['Standard_RAGRS'],
    explanation: "When `--sku` is omitted, `az storage account create` uses its documented default **Standard_RAGRS** (and `--kind` defaults to StorageV2). The portal makes you pick a redundancy option, but scripts that omit `--sku` silently pay for read-access geo-redundancy. Always specify `--sku`." },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L222,
    stem: 'Refer to the exhibit. You must change stcontosoarch01 to zone-redundant storage. What must you do first?',
    exhibit: `Account           Kind        Redundancy   Blobs in the archive tier
stcontosoarch01   StorageV2   LRS          4,200

Goal: ZRS for stcontosoarch01`,
    options: ['Rehydrate the archived blobs to an online tier or move them to an account that supports archive', 'Change the account to GRS, then request the conversion to ZRS', 'Open a support request, because support-initiated conversions keep archived blobs in place', 'Nothing; the conversion leaves archived blobs in the archive tier'],
    answer: [0],
    explanation: "ZRS, GZRS and RA-GZRS accounts **don't support the archive tier**, so the archived blobs must be rehydrated or moved out before converting (or you perform a manual migration). Going through GRS doesn't help: the target is still zone-redundant. No conversion path, customer- or support-initiated, keeps archived blobs in a ZRS account." },

  // ---------- 2.3 Configure Azure Files and Azure Blob Storage ----------
  { topic: '2.3', type: 'single', difficulty: 3, lesson: L235,
    stem: 'Refer to the exhibit. Which blob does the next run of the policy move to the archive tier?',
    exhibit: `Account stcontosoiot01: StorageV2, Standard_GRS, versioning disabled, no snapshots

{
  "rules": [
    {
      "enabled": true,
      "name": "telemetry-tiering",
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["telemetry/raw"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 90 },
            "delete": { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}

Container           Blob name                Type    Days since modified   Tier
telemetry           raw/dev01.json           Block   400                   Hot
telemetry           raw/dev02.json           Block   95                    Cool
telemetry           raw/dev03.json           Block   90                    Cool
telemetry           processed/dev01.parquet  Block   120                   Hot
telemetry           Raw/dev04.json           Block   200                   Hot
telemetry-archive   raw/dev05.json           Block   200                   Hot`,
    options: ['telemetry/raw/dev02.json', 'telemetry/raw/dev01.json', 'telemetry/raw/dev03.json', 'telemetry/Raw/dev04.json', 'telemetry-archive/raw/dev05.json'],
    answer: [0],
    explanation: "The prefix `telemetry/raw` means container telemetry, blob names starting with raw, case-sensitive. **raw/dev02.json** (95 days, more than 90 and not more than 365) is archived. raw/dev01.json (400 days) qualifies for delete as well as archive; when several actions are due, the cheapest wins, so it is **deleted**. raw/dev03.json is exactly 90 days, not greater than 90. Raw/dev04.json fails the case-sensitive prefix. telemetry-archive/raw/dev05.json is in another container, so the prefix doesn't match. processed/dev01.parquet doesn't match the prefix. The account is GRS, so archive is available." },
  { topic: '2.3', type: 'fill', difficulty: 3, lesson: L235,
    stem: 'Refer to the exhibit. How many of the listed blobs will the next policy run either move to the cold tier or delete? Enter a number.',
    exhibit: `Account stcontosofin01: StorageV2, Standard_LRS, flat namespace, versioning disabled

{
  "rules": [
    {
      "enabled": true,
      "name": "short-retention",
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["invoices/"],
          "blobIndexMatch": [
            { "name": "Retention", "op": "==", "value": "Short" }
          ]
        },
        "actions": {
          "baseBlob": {
            "tierToCold": { "daysAfterCreationGreaterThan": 60 },
            "delete": { "daysAfterCreationGreaterThan": 180 }
          }
        }
      }
    }
  ]
}

Blob                        Days since created   Index tags          Tier
invoices/2026/a.pdf         200                  Retention=Short     Hot
invoices/2026/b.pdf         200                  Retention=Long      Hot
invoices/2026/c.pdf         90                   Retention=Short     Hot
invoices/2026/d.pdf         61                   (none)              Hot
invoices/2026/e.pdf         60                   Retention=Short     Hot
receipts/2026/f.pdf         300                  Retention=Short     Hot`,
    answer: ['2', 'two'],
    explanation: "Filters are ANDed: block blob, container invoices, and tag Retention == Short. That leaves a.pdf, c.pdf and e.pdf. **a.pdf** (200 days) is deleted; **c.pdf** (90 days, over 60) moves to cold; e.pdf is exactly 60 days, which isn't greater than 60. b.pdf and d.pdf fail the tag condition, and f.pdf is in the receipts container. Total: **2**." },
  { topic: '2.3', type: 'multi', difficulty: 3, lesson: L235,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `Account stcontosomedia01: StorageV2, LRS
Data management > Lifecycle management: Access tracking enabled (since 2026-01-10)

{
  "rules": [
    {
      "enabled": true,
      "name": "media-idle",
      "type": "Lifecycle",
      "definition": {
        "filters": { "blobTypes": ["blockBlob"], "prefixMatch": ["media/"] },
        "actions": {
          "baseBlob": {
            "enableAutoTierToHotFromCool": true,
            "tierToCool": { "daysAfterLastAccessTimeGreaterThan": 30 }
          },
          "snapshot": {
            "delete": { "daysAfterCreationGreaterThan": 90 }
          }
        }
      }
    }
  ]
}`,
    options: ['A hot block blob in the media container that hasn\'t been read or written for 45 days becomes eligible to move to cool', 'A blob that this rule moved to cool returns to hot when it is next read, at most once every 30 days', 'Snapshots are deleted 90 days after their base blob was last modified', 'Blobs that were already in cool before the rule was created move to hot when they are read', 'Calling Get Blob Properties on a blob resets its last access time', 'The rule also applies to append blobs in the media container'],
    answer: [0, 1],
    explanation: "With access tracking on, `daysAfterLastAccessTimeGreaterThan: 30` makes a blob idle for 45 days eligible for cool. `enableAutoTierToHotFromCool` brings blobs that **this rule** tiered back to hot on access, limited to once in 30 days to avoid repeated early-deletion charges; blobs already cool before the rule aren't affected. Snapshot conditions use the **snapshot's creation time**, not the base blob's modification time. Get Blob Properties isn't an access operation for tracking. `blobTypes` lists only blockBlob." },
  { topic: '2.3', type: 'order', difficulty: 1, lesson: L236,
    stem: 'Blob versioning is enabled on stcontosodocs01. A user deleted reports/budget.xlsx an hour ago. Put the Azure portal steps in order to restore the most recent version.',
    items: ['Open the reports container and turn on the option to show deleted blobs', 'Select budget.xlsx and open its Versions tab', 'Select the most recent previous version', 'Select Make current version', 'Download budget.xlsx and confirm its content'],
    explanation: "Deleting a versioned blob leaves no current version, so the blob only appears when deleted items are shown. On the **Versions** tab you pick the version and choose **Make current version**, which copies that version over the base blob and creates a new current version. Then verify the content. Portal labels are documentation-based; see REVIEW-TODO." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L234,
    stem: 'Refer to the exhibit. Which deleted blob incurs an early deletion charge?',
    exhibit: `Account stcontosodata01: StorageV2 (general-purpose v2), LRS, blob soft delete disabled

Blob    Tier when deleted   Days in that tier when deleted
a.bak   Hot                 3
b.bak   Cool                45
c.bak   Cold                60
d.bak   Archive             200`,
    options: ['a.bak', 'b.bak', 'c.bak', 'd.bak'],
    answer: [2],
    explanation: "Minimum retention in GPv2 accounts: cool **30** days, cold **90** days, archive **180** days; hot has none. **c.bak** left cold after 60 days, so it is charged for the remaining 30 days of cold storage. b.bak stayed 45 days in cool (over 30), d.bak 200 days in archive (over 180), and a.bak was in hot." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L234,
    stem: 'An auditor needs a 2 GB blob that is in the archive tier within the next two hours. The archived blob must stay in the archive tier. What should you do?',
    options: ['Copy the blob to a new blob in the hot tier with High rehydration priority', 'Change the blob tier to Hot with Standard rehydration priority', 'Copy the blob to a new blob in the hot tier with Standard rehydration priority', 'Add a lifecycle management rule that moves the blob to hot'],
    answer: [0],
    explanation: "A **Copy Blob** to an online tier leaves the source in archive, and **High** priority may finish in under an hour for objects under 10 GB. Standard priority can take up to 15 hours. Changing the tier moves the original out of archive (and may incur early deletion). Lifecycle management can't rehydrate from archive." },
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L234,
    stem: "Which value can't be set as the default access tier of a general-purpose v2 storage account?",
    options: ['Hot', 'Cool', 'Cold', 'Archive'],
    answer: [3],
    explanation: "The account default tier can be **hot, cool or cold**; Microsoft Learn states that archive isn't supported as the default. Individual block blobs can be set to archive explicitly or by a lifecycle rule." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L234,
    stem: 'Refer to the exhibit. In which account can you move block blobs to the archive tier?',
    exhibit: `Account        Kind               SKU
stcontosoa01   StorageV2          Standard_ZRS
stcontosoa02   StorageV2          Standard_GZRS
stcontosoa03   StorageV2          Standard_RAGRS
stcontosoa04   StorageV2          Standard_RAGZRS
stcontosoa05   BlockBlobStorage   Premium_LRS`,
    options: ['stcontosoa03', 'stcontosoa01', 'stcontosoa02', 'stcontosoa04', 'stcontosoa05'],
    answer: [0],
    explanation: "Archive is supported only in accounts configured for **LRS, GRS or RA-GRS**, so stcontosoa03 (RA-GRS) qualifies. ZRS, GZRS and RA-GZRS don't support archive. Premium block blob accounts don't support the hot, cool, cold and archive tiers at all." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L233,
    stem: 'Refer to the exhibit. An anonymous user opens https://stcontosoweb01.blob.core.windows.net/images/logo.png in a browser. What happens?',
    exhibit: `$ az storage account show -g rg-web-prod -n stcontosoweb01 --query allowBlobPublicAccess
false
$ az storage container-rm show -g rg-web-prod --storage-account stcontosoweb01 -n images --query publicAccess
"Blob"`,
    options: ['The request fails because anonymous access is disallowed for the storage account', 'The blob is returned because the container allows anonymous read access to blobs', 'The blob is returned, and the user can also list the container', 'The request fails because anonymous requests must include a SAS token'],
    answer: [0],
    explanation: "Anonymous access needs **both** the account setting (allowBlobPublicAccess = true) and a container level of Blob or Container. When the account disallows it, the **account setting overrides** the container setting, so no container in the account is anonymously readable. The container keeps its stored level, which takes effect again if the account setting is re-enabled. Blob level never allows listing, and a request with a SAS isn't anonymous." },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: L233,
    stem: 'Refer to the exhibit. Enter the value that replaces the blank so that the container meets the requirements.',
    exhibit: `Account stcontosoweb01: allowBlobPublicAccess = true
Requirements for the new container media:
  - Anyone on the internet can download a file if they know its URL
  - Nobody can list the contents of the container without authorization

$ az storage container-rm create -g rg-web-prod --storage-account stcontosoweb01 \\
    --name media --public-access ______`,
    answer: ['blob'],
    explanation: "`--public-access blob` (portal: **Blob, anonymous read access for blobs only**) allows anonymous reads of individual blobs by URL but not container listing. `container` would also allow listing, and `off` (Private) allows no anonymous access." },
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L233,
    stem: 'A monitoring agent on a VM continuously adds new log lines to the end of a blob. Existing content is never modified. Which blob type is designed for this workload?',
    options: ['Append blob', 'Block blob', 'Page blob', 'Archive blob'],
    answer: [0],
    explanation: "**Append blobs** are optimized for append operations such as logging. Block blobs suit general objects uploaded in blocks; page blobs are for random read/write workloads such as VHDs. Archive is an access tier, not a blob type." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L231,
    stem: 'Refer to the exhibit. A user on a home network can\'t map the finance share from a Windows 11 laptop. The storage account allows all networks and the credentials are correct. What should you do?',
    exhibit: `PS C:\\> Test-NetConnection -ComputerName stcontosofiles01.file.core.windows.net -Port 445
WARNING: TCP connect to (198.51.100.44 : 445) failed

ComputerName     : stcontosofiles01.file.core.windows.net
RemoteAddress    : 198.51.100.44
RemotePort       : 445
InterfaceAlias   : Wi-Fi
SourceAddress    : 192.168.10.25
TcpTestSucceeded : False`,
    options: ['Connect the laptop through a point-to-site VPN to a virtual network that has a private endpoint for the storage account, and map the share through the VPN', 'Change the share access tier to Hot', 'Enable SMB 1.0 on the laptop', 'Mount the share over NFS 4.1 instead of SMB'],
    answer: [0],
    explanation: "SMB uses **TCP 445**, and many ISPs block it outbound. When 445 is blocked, Microsoft's guidance is to tunnel the traffic with a **VPN** (point-to-site or site-to-site) or ExpressRoute, typically to a private endpoint. The access tier affects pricing, not connectivity. Azure Files requires SMB 2.1 or later (SMB 3.x from outside Azure); SMB 1.0 isn't supported. NFS shares can't be mounted from Windows and need virtual network access anyway." },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: L232,
    stem: 'Refer to the exhibit. You need to recover the deleted file with the most recent content. What should you do?',
    exhibit: `Storage account stcontosofiles01
  File service: Soft delete for file shares = Enabled, retention 14 days

Share: finance (SMB, pay-as-you-go, quota 1024 GiB)
  Share snapshots:
    2026-11-20T02:00:00Z
    2026-11-21T02:00:00Z
    2026-11-22T02:00:00Z

Events
  2026-11-21 16:00 UTC  User1 saves \\finance\\Budget\\fy27.xlsx
  2026-11-22 15:10 UTC  User1 deletes \\finance\\Budget\\fy27.xlsx`,
    options: ['Restore fy27.xlsx from the 2026-11-22T02:00:00Z share snapshot, for example by using Previous Versions in File Explorer', 'Restore fy27.xlsx from the 2026-11-21T02:00:00Z share snapshot', 'Undelete the file from the soft-deleted items of the finance share', 'Undelete the finance share'],
    answer: [0],
    explanation: "The newest copy of the file is in the snapshot taken **after** the 16:00 save and **before** the 15:10 deletion the next day: **2026-11-22T02:00**. The 2026-11-21T02:00 snapshot holds the older version from before the save. Soft delete for Azure Files protects **whole shares**, not individual files, and the share wasn't deleted." },
  { topic: '2.3', type: 'multi', difficulty: 2, lesson: L232,
    stem: 'Which two statements about Azure Files share snapshots are true? (Choose two.)',
    options: ['Share snapshots are incremental and store only data that changed since the previous snapshot', 'A share can have up to 200 share snapshots', 'A share snapshot protects the share from being deleted', 'Share snapshots count toward the share quota', 'You can take a snapshot of a single file instead of the whole share', 'Share snapshots can be modified to correct mistakes'],
    answer: [0, 1],
    explanation: "Share snapshots are **incremental** and limited to **200 per share** (kept up to 10 years). Microsoft Learn states that share snapshots don't prevent accidental deletion of a share (a share can't be deleted while keeping its snapshots; deleting it removes them): use share soft delete and locks for that. Snapshots don't count toward the maximum share size, are always taken at share level (restore single files from them), and are read-only." },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L236,
    stem: 'Refer to the exhibit. Which statement describes contracts/msa.docx at 11:05?',
    exhibit: `Account stcontosodocs01: blob versioning Enabled, blob soft delete Disabled

Time    Operation on contracts/msa.docx       Result
09:00   Put Blob (first upload)               version 2026-11-23T09:00:00.0000000Z
10:00   Put Blob (overwrite with edits)       version 2026-11-23T10:00:00.0000000Z
11:00   Delete Blob (no version ID given)`,
    options: ['There is no current version, and the 09:00 and 10:00 versions remain as previous versions', 'The blob is permanently deleted because soft delete is disabled', 'Only the 10:00 version remains, because versioning keeps the last version only', 'The 10:00 version is still the current version, because deleting a versioned blob only marks it'],
    answer: [0],
    explanation: "With versioning, the upload creates a current version, the overwrite turns it into a previous version, and a delete without a version ID turns the current version into a **previous version**, leaving **no current version**. All previous versions remain until explicitly deleted, independent of blob soft delete. Restore by copying a version over the base blob." },
  { topic: '2.3', type: 'multi', difficulty: 2, lesson: L236,
    stem: 'Which two statements about blob versioning are true? (Choose two.)',
    options: ['Disabling versioning deletes all previous versions', 'Each overwrite creates a new version, and previous versions are billed like active data', 'Versioning can be enabled on accounts with a hierarchical namespace', "You can't disable versioning while an object replication policy uses the account", 'Undelete Blob promotes the most recent version to the current version', 'Versioning restores blobs after the container is deleted'],
    answer: [1, 3],
    explanation: "Every write creates a version, and versions are billed (unique blocks, or full length if a tier is set explicitly). Object replication relies on versioning, so you must delete the replication policies before disabling it. Disabling versioning keeps existing versions. Hierarchical namespace accounts aren't supported. Undelete Blob restores soft-deleted versions but never promotes one; copy a version over the base blob instead. Container deletion needs container soft delete." },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
