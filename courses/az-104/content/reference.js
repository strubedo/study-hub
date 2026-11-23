// Cheat-sheet tables for the Reference page. Cells are inline markdown.
// Each domain writer appends a dNTables constant for its own topics and spreads it into the default export.

// Domain 1 — Manage Azure identities and governance. Checked on Microsoft Learn 2026-11-23 (see REVIEW-TODO.md, Domain 1).
const d1Tables = [
  {
    id: 'rbac-key-roles', title: 'Azure RBAC: scopes and key built-in roles', topic: '1.2',
    columns: ['Item', 'What it allows', 'Notes'],
    rows: [
      ['Scopes', 'Management group > subscription > resource group > resource', 'Assignments inherit downward; remove them where they were made. 5,000 assignments per subscription, 500 per management group (fixed)'],
      ['**Owner**', 'Everything, including assigning roles', 'Control plane only: no blob or queue data without a data role'],
      ['**Contributor**', 'Create and manage all resources', 'NotActions include `Microsoft.Authorization/*/Write` and `/Delete` (so no role assignments and no locks), Blueprint assignments, gallery sharing, deployment stack deny settings, subscription cancel/enable'],
      ['**Reader**', 'View all resources', 'No data plane access'],
      ['**User Access Administrator**', '`Microsoft.Authorization/*` and `*/read`', 'Manages access, locks and policy assignments; what elevated access grants at `/`'],
      ['**Role Based Access Control Administrator**', 'Create and delete role assignments, `*/read`', 'Least privilege for delegating access; supports conditions limiting roles and principals'],
      ['**Virtual Machine Contributor**', 'VMs, disks, NICs, extensions; join subnets, NSGs, public IPs in its scope', 'Not the VNet or storage account management; no role assignment'],
      ['**Storage Blob Data Owner / Contributor / Reader**', 'Blob data plane (DataActions)', 'Needed for Microsoft Entra authorization to blob data'],
      ['**Tag Contributor**', 'Manage tags without access to the resources', 'Portal: tags on subscriptions only; full use via PowerShell or REST'],
    ],
  },
  {
    id: 'azure-vs-entra-roles', title: 'Azure roles vs Microsoft Entra roles', topic: '1.2',
    columns: ['', 'Azure roles (Azure RBAC)', 'Microsoft Entra roles'],
    rows: [
      ['Manage', 'Azure resources through Resource Manager', 'Directory objects: users, groups, apps, licenses, domains'],
      ['Examples', 'Owner, Contributor, Reader, Virtual Machine Contributor', 'Global Administrator, User Administrator, Groups Administrator, Helpdesk Administrator, Guest Inviter'],
      ['Scope', 'Management group, subscription, resource group, resource', 'Tenant, administrative unit, single object'],
      ['Assign in', '**Access control (IAM)** on the scope; `az role assignment create --role --scope` (both required), `New-AzRoleAssignment`', '**Entra ID > Roles & admins**; Microsoft Graph PowerShell'],
      ['Overlap', 'None by default', 'Global Administrator can elevate to User Access Administrator at `/`'],
      ['Custom roles', 'Yes (JSON with AssignableScopes)', 'Yes (Microsoft Entra ID P1 for each assignee)'],
    ],
  },
  {
    id: 'policy-effects', title: 'Azure Policy effects', topic: '1.3',
    columns: ['Effect', 'New or updated request', 'Existing resources', 'Identity / remediation'],
    rows: [
      ['`disabled`', 'Not evaluated', 'Not evaluated', 'No'],
      ['`append`', 'Adds fields; acts as deny if it would change a requested value', 'Non-compliant only', 'No'],
      ['`modify`', 'Adds, replaces or removes properties or tags', 'Non-compliant; fix with a remediation task', '**Managed identity required**'],
      ['`deny`', 'Blocked with 403 Forbidden', 'Non-compliant only (never deleted)', 'No'],
      ['`audit`', 'Allowed, Activity log warning, non-compliant', 'Non-compliant', 'No'],
      ['`auditIfNotExists`', 'After success, checks a related resource', 'Non-compliant if missing', 'No'],
      ['`deployIfNotExists`', 'After success, deploys a template if the related resource is missing (default delay PT10M)', 'Non-compliant; fix with a remediation task', '**Managed identity required**'],
      ['`denyAction`', 'Blocks the delete action', 'n/a', 'No'],
      ['Assignment settings', '`enforcementMode` Default or DoNotEnforce (evaluate and report, no effect); `notScopes` exclusions; exemptions', 'Evaluation: ~15 min after a change, every 24 h, or `az policy state trigger-scan`', 'Order: disabled, append/modify, deny, audit, then AINE/DINE'],
    ],
  },
  {
    id: 'locks-tags', title: 'Resource locks and tags', topic: '1.3',
    columns: ['Item', 'Behaviour', 'Commands'],
    rows: [
      ['**CanNotDelete** (portal Delete)', 'Read and modify, no delete; inherited; blocks deleting the parent resource group', '`az lock create --lock-type CanNotDelete`, `New-AzResourceLock -LockLevel CanNotDelete`'],
      ['**ReadOnly** (portal Read-only)', 'Read only for everyone; blocks POSTs: listing storage keys, starting VMs, scaling App Service plans; on a resource group or subscription, blocks moving resources in or out', '`az lock create --lock-type ReadOnly`'],
      ['Lock rules', 'Control plane only (data still changes); most restrictive inherited lock wins; manage with `Microsoft.Authorization/locks/*` (Owner, User Access Administrator)', '`az lock list`, `az lock delete`, `Remove-AzResourceLock`'],
      ['Tags', '50 per resource, resource group or subscription; none on management groups; name 512 / value 256 characters; values case-sensitive', '`az tag create` (replaces), `az tag update --operation Merge|Replace|Delete`'],
      ['Tag inheritance', 'Not inherited; use modify policies such as Inherit a tag from the resource group (if missing), then remediate', '`Update-AzTag -Operation Merge`, `New-AzTag` (replaces)'],
    ],
  },
  {
    id: 'entra-identity-settings', title: 'Microsoft Entra users, licensing, B2B and SSPR', topic: '1.1',
    columns: ['Feature', 'Key settings and facts', 'License'],
    rows: [
      ['Dynamic membership groups', 'User or device rules, not both; no manual members; string comparisons not case sensitive', 'P1 per unique user member'],
      ['Administrative units', 'Scope Entra roles; not nested; adding a group does not add its members', 'P1 per scoped administrator'],
      ['Licenses', 'Usage location before direct assignment; group licensing ignores nested groups and falls back to tenant location', 'Per product'],
      ['B2B guests', 'UserType Guest, UPN with `#EXT#`; invite in portal, Bulk invite or `New-MgInvitation -SendInvitationMessage:$true`; Guest Inviter role', 'External ID MAU model'],
      ['SSPR', 'None / Selected (one group) / All; 1 or 2 methods; register at sign-in; reconfirm 0 to 730 days; notify users and admins; admins enabled by default with a fixed two-gate policy; Authenticator and OATH tokens count as one method', 'Cloud reset: P1/P2 or Microsoft 365 Business Standard+'],
      ['Password writeback', 'Enable in Microsoft Entra Connect (Optional features) or cloud sync, then Password reset > On-premises integration; synchronous', 'P1/P2 or Microsoft 365 Business Premium'],
    ],
  },
];

// Domain 2 — Implement and manage storage. Checked on Microsoft Learn 2026-11-23 (see REVIEW-TODO.md, Domain 2).
const d2Tables = [
  {
    id: 'storage-account-types', title: 'Storage account types and what they support', topic: '2.2',
    columns: ['Account type', '`--kind` / SKU', 'Services', 'Redundancy', 'Notes'],
    rows: [
      ['**Standard general-purpose v2**', '`StorageV2`, `Standard_*`', 'Blob (incl. Data Lake), Files (SMB), Queue, Table', 'LRS, ZRS, GRS, RA-GRS, GZRS, RA-GZRS', 'Default and recommended; access tiers hot/cool/cold/archive; CLI default SKU is `Standard_RAGRS`'],
      ['**Premium block blobs**', '`BlockBlobStorage`, `Premium_LRS` / `Premium_ZRS`', 'Block and append blobs', 'LRS, ZRS', 'SSD, low latency; no hot/cool/cold/archive tiering'],
      ['**Premium file shares** (SSD)', '`FileStorage`, `Premium_*` or `PremiumV2_*`', 'Azure Files, **SMB and NFS**', 'LRS, ZRS', 'Needed for production NFS shares; provisioned v1 or v2 billing'],
      ['**Premium page blobs**', '`StorageV2`, `Premium_LRS`', 'Page blobs only', 'LRS', 'Unmanaged VM disks'],
      ['Legacy GPv1 / Blob Storage', '`Storage` / `BlobStorage`', 'All / blobs', 'LRS, GRS, RA-GRS', 'Upgrade to GPv2 (one-way)'],
      ['Names and fixed settings', '3-24 lowercase letters and digits, globally unique', '', '', 'Type, performance, region and infrastructure encryption are fixed at creation'],
    ],
  },
  {
    id: 'storage-redundancy', title: 'Redundancy options compared', topic: '2.2',
    columns: ['Option', 'Primary region', 'Secondary region', 'Durability (Microsoft Learn)', 'Notes'],
    rows: [
      ['**LRS**', 'One datacenter (three copies)', 'None', 'At least 11 nines', 'Cheapest; lost in a datacenter disaster'],
      ['**ZRS**', 'Synchronous across three or more zones', 'None', 'At least 12 nines', 'Writable through a zone outage; no archive tier'],
      ['**GRS**', 'LRS', 'Async copy, LRS there', 'At least 16 nines', 'Secondary readable only after failover'],
      ['**GZRS**', 'ZRS', 'Async copy, LRS there', 'At least 16 nines', 'No archive tier; region needs zones and a pair'],
      ['**RA-GRS / RA-GZRS**', 'As GRS / GZRS', 'Readable any time at `<account>-secondary`', 'At least 16 nines', 'Not supported for Azure Files; RA-GZRS has no archive'],
      ['Failover', 'Planned: both regions healthy, roles swap, no loss expected', 'Unplanned: secondary becomes primary as **LRS**, writes after **Last Sync Time** can be lost', 'Microsoft-managed: whole region only', '`az storage account failover --failover-type Planned`'],
      ['Changing redundancy', 'Geo/read access: setting change', 'Zones: conversion (no SLA, usually starts within 72 h)', 'Region, premium block blob, avoiding rehydration: manual migration', 'Archived blobs block conversion to ZRS/GZRS'],
    ],
  },
  {
    id: 'sas-types-revocation', title: 'SAS types, signing and revocation', topic: '2.1',
    columns: ['Type', 'Signed with', 'Scope', 'Stored access policy', 'Revoke early by'],
    rows: [
      ['**User delegation SAS** (recommended)', 'User delegation key from Microsoft Entra ID (max 7 days)', 'Blob/Data Lake container, directory, blob; also Queue, Table, Files per current Learn', 'No', '`az storage account revoke-delegation-keys` or removing the signer\'s role'],
      ['**Service SAS**', 'Account key', 'One resource in one service (`sr`)', '**Yes** (`si`, max 5 per container, share, queue or table)', 'Delete, expire or rename the policy; or regenerate the signing key'],
      ['**Account SAS**', 'Account key', 'One or more services (`ss`), resource types (`srt` s/c/o)', 'No', 'Regenerate the signing key'],
      ['Fields to check', '`sp` permissions, `st`/`se` window, `sip` IPv4 range, `spr=https`', 'List = container-level, read = object-level', '', 'SAS never bypasses the storage firewall'],
      ['Shared Key disallowed', 'Keys, connection strings, service and account SAS rejected', 'Entra tokens and user delegation SAS allowed', '', 'Required for Conditional Access on the account'],
    ],
  },
  {
    id: 'blob-access-tiers', title: 'Blob access tiers and lifecycle actions', topic: '2.3',
    columns: ['Tier', 'Minimum retention (GPv2)', 'Access', 'Account default?', 'Lifecycle action'],
    rows: [
      ['**Hot**', 'None', 'Online, lowest access cost', 'Yes (default)', 'Reached by rehydration or `enableAutoTierToHotFromCool`; lifecycle `tierToHot` exists only for premium block blob accounts'],
      ['**Cool**', '30 days', 'Online', 'Yes', '`tierToCool`; `enableAutoTierToHotFromCool` with last-access condition'],
      ['**Cold**', '90 days', 'Online', 'Yes', '`tierToCold`'],
      ['**Archive**', '180 days', 'Offline; rehydrate Standard (up to 15 h) or High (under 1 h, <10 GB)', '**No**', '`tierToArchive`; not in ZRS/GZRS/RA-GZRS or with encryption scopes'],
      ['Conditions', '`daysAfterModificationGreaterThan`, `daysAfterCreationGreaterThan`, `daysAfterLastAccessTimeGreaterThan` (tracking on), `daysAfterLastTierChangeGreaterThan`', 'Strictly greater than', 'Targets: `baseBlob`, `snapshot`, `version`', 'Filters: `blobTypes` (required), `prefixMatch` (container/prefix, case-sensitive), `blobIndexMatch`; up to 24 h to apply, then runs periodically'],
    ],
  },
  {
    id: 'azure-files-access-protection', title: 'Azure Files: identity, roles and protection', topic: '2.3',
    columns: ['Item', 'Key facts', 'Commands / where'],
    rows: [
      ['Identity sources (one per account, SMB only)', 'AD DS (clients reach DCs, users synced); Microsoft Entra Domain Services (managed domain); Microsoft Entra Kerberos (Entra or hybrid joined clients, no DC line of sight, no Linux users)', '`--enable-files-adds`, `--enable-files-aadds`, `--enable-files-aadkerb`'],
      ['Share-level roles', 'SMB Share Reader / Contributor / Elevated Contributor (adds modify ACLs); SMB Admin (key-equivalent); effective access = most restrictive of RBAC and Windows ACL', 'Share > Access control (IAM); `--default-share-permission` for unsynced identities'],
      ['Media tiers and billing', 'SSD (FileStorage, SMB+NFS, LRS/ZRS); HDD pay-as-you-go (StorageV2, SMB, transaction optimized/hot/cool) or provisioned v2', '`az storage share-rm create --quota --access-tier --enabled-protocols`'],
      ['NFS', 'SSD account (HDD preview), Linux only, no identity auth, private or service endpoint required', '`mount -t nfs` or `-t aznfs`'],
      ['SMB connectivity', 'TCP 445 outbound; SMB 3.x from outside Azure; VPN/ExpressRoute if 445 blocked', '`Test-NetConnection -Port 445`, `nc -zv host 445`'],
      ['Share snapshots', 'Share-level, read-only, incremental, 200 per share, up to 10 years, deleted with the share; restore via Previous Versions', '`az storage share snapshot`, `New-AzRmStorageShare -Snapshot`'],
      ['Share soft delete', 'Whole shares only; on by default; 7 days default, 1-365; classic shares (not Microsoft.FileShares)', '`az storage account file-service-properties update --enable-delete-retention --delete-retention-days`'],
    ],
  },
];

// Domain 3 — Deploy and manage Azure compute resources. Checked on Microsoft Learn 2026-11-23 (see REVIEW-TODO.md, Domain 3).
// 3.1 and 3.2
const d3Tables = [
  {
    id: 'arm-vs-bicep', title: 'ARM JSON vs Bicep, deployment scopes and modes', topic: '3.1',
    columns: ['Item', 'ARM template (JSON)', 'Bicep'],
    rows: [
      ['Parameter', '`"parameters": { "env": { "type": "string", "allowedValues": [...], "defaultValue": "dev" } }`', '`@allowed([...])` then `param env string = \'dev\'`'],
      ['Secret parameter', '`"type": "secureString"`', '`@secure() param adminPassword string`'],
      ['Variable / string building', '`"[concat(\'vm-\', parameters(\'env\'))]"`, `format()`', '`var name = \'vm-${env}\'`'],
      ['Resource', '`{ "type": "...", "apiVersion": "...", "name": "...", ... }` in `resources`', '`resource sym \'Namespace/type@apiVersion\' = { ... }`'],
      ['Dependencies', '`dependsOn` with `resourceId()`; `reference()` by name to a resource in the same template implies one', 'Implicit from symbolic references and `parent:`; `dependsOn` rarely needed'],
      ['Loops / conditions', '`"copy": { "name": "...", "count": n }` + `copyIndex()`; `"condition": "[...]"`', '`[for i in range(start, count): {...}]`; `= if (cond) {...}`'],
      ['Outputs', '`"outputs": { "x": { "type": "string", "value": "[reference(...).prop]" } }`', '`output x string = sym.properties.prop`'],
      ['Parameter file', 'JSON with `"value"` or Key Vault `"reference"`; pass with `--template-file` + `--parameters @file.json`', '`.bicepparam` with `using \'main.bicep\'`; pass with `--parameters file.bicepparam` and no `--template-file`'],
      ['Scopes and commands', '`az deployment group|sub|mg|tenant create` (non-RG scopes need `-l`)', '`New-AzResourceGroupDeployment`, `New-AzSubscriptionDeployment`, `New-AzManagementGroupDeployment`, `New-AzTenantDeployment`; Bicep `targetScope`'],
      ['Modes', 'Incremental (default): leaves other resources. Complete: deletes resources not in the template (incl. false conditions); RG root only; not in portal; locks block it', 'Learn recommends deployment stacks over complete mode; preview with `what-if` / `--confirm-with-what-if`'],
      ['Export / convert', '`az group export` (current state, 200-resource limit, `--export-format bicep`); `az deployment group export` (exact history copy, JSON)', '`az bicep decompile --file x.json` (best-effort); `az bicep build --file x.bicep`'],
    ],
  },
  {
    id: 'vm-disk-types', title: 'Managed disk types and disk facts', topic: '3.2',
    columns: ['Disk type', 'Max size / IOPS / MB/s', 'OS disk?', 'Use for', 'Constraints'],
    rows: [
      ['**Ultra Disk** (`UltraSSD_LRS`)', '64 TiB / 400,000 / 10,000', 'No', 'SAP HANA, top-tier databases', 'Data disks only; no host caching; no availability sets; no ZRS; set IOPS and MB/s separately (up to 4 changes per 24 h)'],
      ['**Premium SSD v2** (`PremiumV2_LRS`)', '64 TiB / 80,000 / 2,000', 'No', 'Production databases, best price-performance', 'Data disks only; no host caching; zonal VM in most zone regions; 3,000 IOPS and 125 MB/s baseline free'],
      ['**Premium SSD** (`Premium_LRS`, `Premium_ZRS`)', '32 TiB (P80) / 20,000 / 900', 'Yes', 'Production OS and data disks', 'VM size with `s`; fixed tiers P1-P80; bursting'],
      ['**Standard SSD** (`StandardSSD_LRS`, `StandardSSD_ZRS`)', '32 TiB (E80) / 6,000 / 750', 'Yes', 'Web servers, dev/test', 'Any VM size; fixed tiers E1-E80'],
      ['**Standard HDD** (`Standard_LRS`)', '32 TiB (S80) / 2,000 (3,000 performance plus) / 500', 'Yes, retiring Sept 8, 2028', 'Backups, infrequent access', 'Latency-tolerant workloads only'],
      ['Host caching', 'OS default ReadWrite; ReadOnly for read-heavy data; None for write-heavy', '', '', 'Not on Ultra, Premium SSD v2, shared disks or disks of 4 TiB+'],
      ['Expand', 'Never shrink; data disks online; OS disk needs deallocation', '', '', 'Crossing 4 TiB on Premium/Standard: deallocate and detach; shared disks not online'],
      ['Encryption', 'SSE always on (PMK or CMK via disk encryption set); encryption at host adds temp disk and caches', '', '', 'ADE (BitLocker/DM-Crypt, Key Vault) retires Sept 15, 2028'],
    ],
  },
  {
    id: 'vm-availability', title: 'VM availability options and scale sets', topic: '3.2',
    columns: ['Option', 'Protects against', 'SLA', 'Key facts'],
    rows: [
      ['Single VM, premium disks on every disk', 'Nothing beyond host recovery', '99.9%', 'Premium SSD OS disk; Premium SSD, Premium SSD v2 or Ultra data disks'],
      ['**Availability set** (2+ VMs)', 'Rack, power, switch, planned maintenance in one datacenter', '99.95%', 'Up to 3 FDs, 20 UDs (fixed at creation); one UD rebooted at a time; VM joins only at creation; no zones; no Ultra Disks'],
      ['**Availability zones** (2+ VMs across 2+ zones)', 'Datacenter failure', '99.99%', 'VMs and disks are zonal; pair with zone-redundant Standard Load Balancer and public IP'],
      ['**Scale set, Flexible** (default, recommended)', 'FDs or zones, plus autoscale', '99.95% across FDs, 99.99% across zones', 'Standard VMs, mixed sizes and Spot; UDs deprecated; no default outbound access; up to 1,000 VMs; mode fixed at creation'],
      ['**Scale set, Uniform**', 'FDs or zones, plus autoscale', '99.95% (FD>1), 99.99% across zones', 'Identical instances via scale set VM API; 5 UDs; 100 VMs per placement group'],
      ['Autoscale', 'Load changes', '', 'Min/max/default; scale out if any rule fires (highest capacity wins); scale in only if all scale-in rules fire; per-rule cool down'],
      ['Scale-in policy', '', '', 'Default, NewestVM, OldestVM (zone balance first); instance protection exempts VMs'],
      ['Proximity placement group', 'Latency, not failures', '', 'Co-locates VMs; can reduce allocation success'],
    ],
  },
  // 3.3 and 3.4
  {
    id: 'container-options', title: 'Container registry and container hosting options', topic: '3.3',
    columns: ['Service', 'Unit and sizing', 'Scaling', 'Networking and identity', 'Pick it when'],
    rows: [
      ['**ACR Basic / Standard / Premium**', 'Registry `<name>.azurecr.io`; repositories and tags; storage 10 / 100 / 500 GiB included', 'n/a', 'Entra roles AcrPull / AcrPush (RBAC-only mode, the CLI default; ABAC-enabled mode uses the Container Registry Repository roles); tokens + scope maps (all SKUs); admin user off by default. **Premium only**: geo-replication, private endpoints, IP rules, CMK, untagged retention policy', 'Private images for every container service; `az acr build` (ACR Tasks) and `az acr import` need no local Docker'],
      ['**Azure Container Instances**', 'Container group = pod (same host, lifecycle, IP, volumes); size = sum of requests, min 1 CPU / 1 GB; multi-container groups Linux only', '**No autoscale**; CPU, memory, restart policy, OS and zone changes need delete + recreate; scale out with more groups (NGroups preview)', 'Public IP + DNS label `<label>.<region>.azurecontainer.io`, or VNet (delegated subnet, no public IP, NAT gateway outbound); ACR pull with **user-assigned** identity', 'Simple containers and run-to-completion tasks (restart policy Always / OnFailure / Never)'],
      ['**Azure Container Apps**', 'App in an environment (workload profiles: Consumption up to 4 vCPU / 8 GiB per replica, plus Dedicated profiles); immutable revisions', 'KEDA rules: HTTP, TCP, custom (queues, CPU...); min 0 (scale to zero), max 10 by default, up to 1,000', 'Ingress external or internal, target port; secrets with `secretref:`; system- or user-assigned identity, `--registry-identity`', 'Serverless microservices and event-driven workers; revisions with traffic splitting (multiple mode)'],
      ['**Azure Kubernetes Service**', 'Pods on node pools you size', 'Cluster autoscaler, HPA, KEDA add-on', 'Full Kubernetes networking choices', 'You need the Kubernetes API, operators and node control'],
      ['**App Service (Web App for Containers)**', 'App in an App Service plan; size = plan tier and instance size', 'Manual (Basic+), rule-based autoscale (Standard+), automatic scaling (Premium v2-v4)', 'Access restrictions, private endpoints, VNet integration; ACR pull with managed identity', 'Web apps and APIs needing slots, custom domains, certificates, built-in auth'],
    ],
  },
  {
    id: 'app-service-tiers', title: 'App Service tiers, slot swaps and networking', topic: '3.4',
    columns: ['Item', 'Facts'],
    rows: [
      ['**Free (F1) / Shared (D1)**', 'Shared compute, CPU quotas, no scale-out. Free: no custom domains. Shared (Windows only): custom domains but no TLS binding'],
      ['**Basic (B1-B3)**', 'Dedicated; up to 3 instances (manual); custom domains + SNI TLS; managed certificates; backups (production slot only); VNet integration; private endpoints; hybrid connections; Always On'],
      ['**Standard (S1-S3)**', '+ rule-based autoscale, 5 staging slots, IP-based TLS (1 included), up to 10 instances'],
      ['**Premium v3 / v4**', '+ 20 staging slots, up to 30 instances, automatic scaling (HTTP-based, Premium v2-v4), zone redundancy, Windows containers'],
      ['**Isolated v2**', 'App Service Environment v3 in your VNet; single tenant; up to 100 instances; 20 slots'],
      ['Scale up / out', 'Up = tier or size (`az appservice plan update --sku`); out = instances (`--number-of-workers`); both affect every app in the plan'],
      ['Backups', 'Automatic: hourly, 30 days, 30 GB, no DB. Custom: storage container (SAS), 10 GB incl. 4 GB DB, `_backup.filter`; linked DB backups deprecated (end Mar 31, 2028)'],
      ['Custom domain DNS', 'Apex: A `@` + TXT `asuid`. Subdomain: CNAME to `<app>.azurewebsites.net` + TXT `asuid.<sub>`. Value = custom domain verification ID'],
      ['Certificates', 'Managed (free, Basic+, no wildcard, not exportable); App Service certificate (bought, wildcard possible); Key Vault import; PFX upload. Min inbound TLS 1.2 by default (TLS 1.0/1.1 inbound retired May 31, 2027); set HTTPS Only explicitly (Learn sources disagree on its default)'],
      ['Swaps with content', 'App settings and connection strings (unless slot settings), framework versions, handler mappings, WebJobs content, hybrid connections, service endpoints, mounted storage'],
      ['Stays with the slot', 'Custom domains, TLS bindings and protocol settings, scale settings, managed identities, VNet integration, IP restrictions, Always On, CORS, diagnostic settings, WebJobs schedulers, slot settings'],
      ['Inbound networking', 'Access restrictions (priority order; implicit deny once any rule exists; separate scm rules; not applied to private endpoint traffic), service endpoint rules, private endpoints, app-assigned IP'],
      ['Outbound networking', 'Regional VNet integration (Basic+, same region, dedicated subnet delegated to Microsoft.Web/serverFarms, /28 min, route all via `outboundVnetRouting`, NAT gateway for static outbound IP), Hybrid Connections (host:port via Azure Relay; agent on Windows or Linux)'],
    ],
  },
];

// Domain 4 — Implement and manage virtual networking. Checked on Microsoft Learn 2026-11-23 (see REVIEW-TODO.md, Domain 4).
const d4Tables = [
  {
    id: 'vnet-special-subnets', title: 'Subnets: reserved addresses and special subnet names', topic: '4.1',
    columns: ['Item', 'Rule on Learn', 'Notes'],
    rows: [
      ['Reserved addresses', 'First four and last address of every subnet: network, `.1` gateway, `.2`/`.3` Azure DNS mapping, last', 'Usable = 2^(32-prefix) - 5: /29 = 3, /28 = 11, /27 = 27, /26 = 59, /24 = 251'],
      ['Subnet size', 'IPv4 /29 smallest, /2 largest; IPv6 exactly /64', 'Resize only when the subnet is empty; adding VNet ranges is always possible'],
      ['`GatewaySubnet`', '/27 or larger for all gateway SKUs except Basic VPN (/29 possible)', 'No NSG or 0.0.0.0/0 UDR supported; keep gateway route propagation on'],
      ['`AzureBastionSubnet`', '/26 or larger (deployments since 2021-11-02)', 'Basic, Standard, Premium; not needed for Developer'],
      ['`AzureFirewallSubnet`', '/26', 'Learn: sufficient for all scaling scenarios'],
      ['Private subnet', '`defaultOutboundAccess = false`; default for new VNets with API versions after 2026-03-31 and in the portal', 'Needs NAT gateway, instance public IP or LB outbound rules for internet egress'],
    ],
  },
  {
    id: 'route-selection', title: 'Route selection and next hop types', topic: '4.1',
    columns: ['Item', 'Behaviour', 'CLI value / notes'],
    rows: [
      ['Selection', '1. Longest prefix match. 2. Same prefix: **User > BGP > Default**', 'VNet, peering and service endpoint system routes are preferred even over more-specific BGP routes; service endpoint routes can\'t be overridden'],
      ['Default system routes', 'VNet ranges > Virtual network; 0.0.0.0/0 > Internet; 10/8, 172.16/12, 192.168/16, 100.64/10 > None', 'Optional: Virtual network peering, Virtual network gateway (BGP/LNG), `VirtualNetworkServiceEndpoint`. A 0.0.0.0/0 route to a VPN gateway or (Learn\'s routing example) a UDR to a virtual appliance removes the None routes'],
      ['Virtual appliance', 'Next hop = NVA NIC IP or internal LB frontend', '`VirtualAppliance`; NIC needs **IP forwarding** + OS forwarding'],
      ['Virtual network gateway', 'Send to the VNet\'s VPN gateway', '`VirtualNetworkGateway` (VPN gateway only)'],
      ['Virtual network / Internet / None', 'Keep in VNet / send to internet / drop', '`VnetLocal`, `Internet`, `None`'],
      ['Route table', 'One per subnet; same region and subscription as the VNet', '`--disable-bgp-route-propagation` stops gateway routes (never on GatewaySubnet)'],
      ['Effective routes', 'Running VM only; overridden routes show **Invalid**', '`az network nic show-effective-route-table`, `Get-AzEffectiveRouteTable`'],
    ],
  },
  {
    id: 'nsg-rules-evaluation', title: 'NSG default rules and evaluation order', topic: '4.2',
    columns: ['Priority / item', 'Inbound', 'Outbound'],
    rows: [
      ['Custom rules', '100–4096, lowest number first, first match wins', 'Same'],
      ['65000', 'AllowVNetInBound: VirtualNetwork > VirtualNetwork', 'AllowVnetOutBound: VirtualNetwork > VirtualNetwork'],
      ['65001', 'AllowAzureLoadBalancerInBound: AzureLoadBalancer (168.63.129.16) > Any', 'AllowInternetOutBound: Any > Internet'],
      ['65500', 'DenyAllInBound', 'DenyAllOutBound'],
      ['Order with two NSGs', '**Subnet NSG, then NIC NSG**', '**NIC NSG, then subnet NSG**'],
      ['Tags to remember', 'VirtualNetwork includes peered VNets and on-premises; Internet includes Azure public IPs', 'ASGs: NICs from one VNet only'],
      ['Tools', 'Effective security rules (running VM), IP flow verify (TCP/UDP, names the rule), NSG diagnostics (adds ICMP)', 'NSG flow logs retire 2027-09-30, no new ones; use VNet flow logs'],
    ],
  },
  {
    id: 'paas-access-bastion', title: 'Service endpoints, private endpoints and Bastion SKUs', topic: '4.2',
    columns: ['Feature', 'What it gives you', 'Key requirements and limits'],
    rows: [
      ['**Service endpoint**', 'Subnet reaches the service\'s public endpoint over the backbone with private source IP and VNet identity; free', 'Per subnet per service (`Microsoft.Storage`, `Microsoft.Sql`, `Microsoft.KeyVault`...); add a VNet rule on the resource; no on-premises; DNS unchanged'],
      ['Service endpoint policy', 'Limits a subnet to listed storage accounts', 'Azure Storage only; same region and subscription as the VNet'],
      ['**Private endpoint**', 'Read-only NIC with a private IP mapped to one resource sub-resource (`blob`, `file`, `sqlServer`, `vault`)', 'Same region and subscription as its VNet; private DNS zone (`privatelink.*`); approval Auto or Pending; NSG/UDR only with network policies enabled'],
      ['Bastion Developer', 'Free, shared, same VNet, one connection', 'No subnet or public IP; limited regions'],
      ['Bastion Basic', 'Dedicated (2 instances), peered VNets', 'AzureBastionSubnet /26+, Standard static public IP'],
      ['Bastion Standard', 'Native client (`az network bastion ssh/rdp/tunnel`), file transfer, IP-Connect, shareable link, 2–50 instances', 'As Basic'],
      ['Bastion Premium', 'Session recording, private-only deployment', 'Public IP optional (private-only); upgrades allowed, no downgrade'],
    ],
  },
  {
    id: 'lb-troubleshooting', title: 'Load Balancer settings and troubleshooting by symptom', topic: '4.3',
    columns: ['Symptom or setting', 'Likely cause / meaning', 'Fix or value'],
    rows: [
      ['SKU', 'Basic retired 2025-09-30 (Learn)', 'Standard: secure by default, zones, TCP/HTTP/HTTPS probes, HA ports, outbound rules'],
      ['All backends unhealthy', 'NSG custom deny above 65001 blocks AzureLoadBalancer; guest firewall; nothing listening on probe port', 'Allow AzureLoadBalancer to the probe port; open 168.63.129.16 in the OS'],
      ['HTTP probe down while site works', 'Probe path returns non-200 (301, 401, 404)', 'Probe a path returning 200, HTTPS probe, or TCP probe'],
      ['Healthy but no client traffic', 'NSG doesn\'t allow the client IP to the backend port (no inbound SNAT); backend calling its own ILB frontend', 'Allow clients in NSG; separate tiers or a proxy'],
      ['ILB backends have no internet', 'Standard internal LB gives no outbound', 'NAT gateway (recommended), instance public IP or public LB outbound rules'],
      ['Intermittent outbound failures', 'SNAT exhaustion: failed SNAT connections, Used = Allocated ports', 'NAT gateway or outbound rules with more frontend IPs (64,000 ports each)'],
      ['Persistence / timeouts', 'None 5-tuple (`Default`), Client IP (`SourceIP`), Client IP and protocol (`SourceIPProtocol`)', 'Idle timeout 4–100 min (default 4), optional TCP reset; HA ports = internal, protocol All, port 0'],
      ['Metrics', 'Data Path Availability (platform path), Health Probe Status (your probes), SYN Count, SNAT Connection Count', 'Load Balancer insights: dependency view + metrics dashboard'],
    ],
  },
];

// Domain 5 — Monitor and maintain Azure resources. Checked on Microsoft Learn 2026-11-23 (see REVIEW-TODO.md, Domain 5).
const d5Tables = [
  {
    id: 'monitoring-data-destinations', title: 'Azure Monitor data: where it comes from and where it goes', topic: '5.1',
    columns: ['Data', 'Collected by default?', 'How to collect or route it', 'Default retention', 'Typical table / store'],
    rows: [
      ['**Platform metrics**', 'Yes, every minute', 'Diagnostic setting (`AllMetrics`) to copy elsewhere', '93 days; 30 days per chart', 'Metrics store; `AzureMetrics` in a workspace'],
      ['**Activity log**', 'Yes', 'Subscription diagnostic setting (`az monitor diagnostic-settings subscription create`)', '90 days, free', '`AzureActivity`'],
      ['**Resource logs**', '**No**', 'Diagnostic setting per resource: workspace, storage (same region), event hub (same region), partner; one of each type, five settings per resource', 'Set at the destination', '`AzureDiagnostics` or resource-specific tables'],
      ['**Guest OS logs and counters**', '**No**', '**Azure Monitor Agent** + **data collection rule** (Log Analytics agent retired 2024-08-31)', 'Workspace table retention', '`Event`, `Syslog`, `Perf`, `Heartbeat`, `InsightsMetrics`'],
      ['**Workspace tables**', '', 'Plans: Analytics, Basic, Auxiliary / Lake (switch once a week)', 'Analytics 30 days default, up to 2 years; total up to 12 years (search job for long-term data)', ''],
      ['**Flow logs**', '**No**', 'Virtual network flow logs (VNet, subnet or NIC) to a same-region Standard storage account; NSG flow logs retire 2027-09-30 and can\'t be created', 'Days you set (0 = keep)', 'Traffic analytics: `NTANetAnalytics` (60- or 10-minute processing)'],
      ['**Connection monitor**', '**No**', 'Network Watcher Agent extension (Azure) or Azure Arc + AMA (on-premises)', 'Workspace retention', '`NWConnectionMonitorTestResult`, metrics'],
    ],
  },
  {
    id: 'kql-cheat-sheet', title: 'KQL operators for Azure Monitor Logs', topic: '5.1',
    columns: ['Operator / function', 'Does', 'Watch out'],
    rows: [
      ['`where`', 'Keeps matching rows', 'Filter on `TimeGenerated` first; `==` case-sensitive, `=~` not; `has` whole terms, `contains` substrings'],
      ['`project` / `extend`', 'Choose or compute columns / add a column', '`project` drops every column you don\'t name'],
      ['`summarize ... by`', 'Aggregates: `count()`, `dcount()`, `avg()`, `sum()`, `min()`, `max()`, `percentile(x, 95)`, `arg_max(TimeGenerated, *)`', 'One output row per distinct `by` combination; unnamed results get names like `count_`'],
      ['`bin(TimeGenerated, 5m)`', 'Rounds down into buckets', '10:08 with 10m bins lands in 10:00'],
      ['`sort by` / `order by`', 'Sorts', 'Default **descending**'],
      ['`top N by`', 'Sort + keep N', 'Default **descending**; same as `sort by` then `take`'],
      ['`take` / `limit`', 'Any N rows', 'No ordering guaranteed'],
      ['`join kind=`', 'Combines tables on a key', 'Default `innerunique`; `leftouter` keeps all left rows; `leftanti` = left rows with no match'],
      ['`union`, `search`, `render`', 'Append tables / full-text search / chart', '`render` goes last (`timechart`, `barchart`, `piechart`)'],
      ['`ago()`, `between`', 'Relative and absolute time filters', '`TimeGenerated > ago(1h)`; `between (datetime(...) .. datetime(...))`'],
    ],
  },
  {
    id: 'alert-types', title: 'Alert types, signals and behaviour', topic: '5.1',
    columns: ['Type', 'Signal', 'Example', 'State', 'Create with'],
    rows: [
      ['**Metric**', 'Platform, custom or guest metrics', 'Average CPU > 85 over 5 minutes; dynamic threshold on requests', 'Stateful by default (resolves after 3 clean checks)', '`az monitor metrics alert create`, `Add-AzMetricAlertRuleV2`'],
      ['**Log search**', 'KQL query on a workspace', 'More than 10 failed logons in 15 minutes; missing heartbeats', 'Stateful or stateless', '`az monitor scheduled-query create`'],
      ['**Activity log**', 'Activity log events', 'Someone deletes a VM or NSG', 'Stateless', '`az monitor activity-log alert create`'],
      ['**Service Health**', 'Service Health category', 'Azure incident or planned maintenance in your regions', 'Stateless; action group must be **Global**', 'Activity log alert'],
      ['**Resource Health**', 'Resource Health category', 'vm-sql-01 Unavailable or Degraded', 'Stateless', 'Activity log alert'],
      ['Severity', 'Sev0 Critical, Sev1 Error, Sev2 Warning, Sev3 Informational, Sev4 Verbose', 'CLI default 2', 'Alerts kept 30 days', ''],
      ['**Action group**', 'Notifications: email, ARM role email, SMS, push, voice. Actions: runbook, function, event hub, ITSM, logic app, webhook, secure webhook', 'Short name up to 12 characters', 'Email, SMS, push and voice are rate limited', '`az monitor action-group create`, `New-AzActionGroup`'],
      ['**Alert processing rule**', 'Fired alerts in a scope (same subscription), filters, schedule', 'Suppress during maintenance; add on-call group to all Sev0', 'Suppression beats Apply action group; up to 30 min to apply', '`az monitor alert-processing-rule create` (extension)'],
    ],
  },
  {
    id: 'backup-vs-site-recovery', title: 'Vaults, Azure Backup and Site Recovery compared', topic: '5.2',
    columns: ['Item', 'Recovery Services vault + Azure Backup', 'Backup vault', 'Site Recovery (Recovery Services vault)'],
    rows: [
      ['Protects', 'Azure VMs, SQL / SAP HANA in VMs, Azure Files, MARS, MABS, DPM', 'Managed disks, blobs, PostgreSQL, AKS and newer workloads', 'Running Azure VMs (and on-premises machines) replicated to another region'],
      ['Vault region', 'Same as the data', 'Same as the data', 'Any region **except the source** (usually the target)'],
      ['Frequency', 'VM: daily (Standard) or every 4, 6, 8, 12 or 24 h (Enhanced); MARS 3/day; MABS/DPM 2/day', 'Disks: hourly or daily snapshots; blobs: continuous (operational) and scheduled (vaulted)', 'Crash-consistent every 5 min; app-consistent every 1 h or more if enabled'],
      ['Retention', 'Daily to yearly, up to 99 years; instant restore 1–5 days (Standard) or 1–30 (Enhanced)', 'Disks: one year or 450 snapshots; blobs per policy', 'Up to 15 days of recovery points (default 1 day)'],
      ['Redundancy / regions', 'GRS (default), LRS, ZRS, set before protecting; Cross Region Restore on GRS', 'GRS, LRS, ZRS', 'Replica disks (`-ASRReplica`), `-asr` RG and VNet in the target'],
      ['Protection of the data', 'Soft delete 14–180 days (enforced for RSV; a vault holding soft-deleted items may refuse deletion for up to the retention period), immutable vault, MUA with Resource Guard', 'Same features; enforced soft delete GA in three regions, preview elsewhere', 'Not backup: corruption replicates; pair with Backup'],
      ['Recover', 'Create VM, restore disks (+ template), replace existing, CRR, file recovery (iSCSI, 12 h)', 'Restore disk from snapshot; blob point-in-time or vaulted restore', 'Test failover, failover (Latest, Latest processed, Latest app-consistent, Custom), commit, re-protect, fail back'],
      ['Monitor', 'Resiliency (formerly Azure Business Continuity Center, and before that Backup center), built-in Azure Monitor alerts + alert processing rules, Backup reports (diagnostic settings to Log Analytics, resource-specific)', 'Same', 'Resiliency, replication health, jobs, Site Recovery diagnostic categories'],
    ],
  },
];

export default [
  ...d1Tables,
  ...d2Tables,
  ...d3Tables,
  ...d4Tables,
  ...d5Tables,
];
