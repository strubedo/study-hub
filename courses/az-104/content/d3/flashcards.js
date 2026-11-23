// Domain 3 — Deploy and manage Azure compute resources. Original flashcards; facts checked against Microsoft Learn on
// 2026-11-23 (see REVIEW-TODO.md for sources and items still to confirm in a subscription).
// Ids are generated from array order: append topics 3.3 and 3.4 after the 3.2 block.
let n = 0;
const c = (topic, front, back) => ({ id: `d3-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 3.1 ARM templates and Bicep
  c('3.1', 'Required sections of an ARM template?', '`$schema`, `contentVersion` and `resources`. Optional: `parameters`, `variables`, `functions`, `outputs`.'),
  c('3.1', '`resourceId()` vs `reference()`?', '`resourceId()` builds an ID string and creates no dependency. `reference()` reads runtime properties of a deployed resource and implies a dependency when it names (not resource ID) a resource deployed in the same template.'),
  c('3.1', 'What does `copyIndex(1)` return on the first iteration?', '1. `copyIndex()` is zero-based; the argument is an offset added to the iteration number.'),
  c('3.1', 'Bicep `range(1, 3)`?', '`[1, 2, 3]`: the second argument is a count, not an end value.'),
  c('3.1', 'Bicep decorators for parameter constraints?', '`@allowed`, `@minLength`/`@maxLength`, `@minValue`/`@maxValue`, `@secure` (string or object, kept out of logs), `@description`, `@metadata`.'),
  c('3.1', 'How does Bicep create dependencies?', 'Implicitly, whenever one resource references another symbolic name (`vnet.id`) or uses `parent:`. Explicit `dependsOn` only when there is no reference.'),
  c('3.1', 'Deploy with a `.bicepparam` file (CLI)?', '`az deployment group create -g <rg> --parameters main.bicepparam`. The `using` statement names the Bicep file; adding `--template-file` causes an error.'),
  c('3.1', 'Incremental vs complete mode?', 'Incremental (default) leaves resources not in the template. Complete deletes them, including false-condition resources; root RG deployments only, blocked by locks; Learn recommends deployment stacks instead.'),
  c('3.1', 'Deployment commands per scope (CLI)?', '`az deployment group create`, `az deployment sub create -l`, `az deployment mg create -m -l`, `az deployment tenant create -l`.'),
  c('3.1', 'Export from resource group vs from deployment history?', 'RG: current state, selectable, verbose, JSON or Bicep, max 200 resources, secrets missing. History: exact original template with parameters, JSON only, no later manual changes.'),
  c('3.1', 'Convert ARM JSON to Bicep and back?', '`az bicep decompile --file main.json` (best-effort, review it) and `az bicep build --file main.bicep`.'),
  // 3.2 Virtual machines
  c('3.2', 'Default security type for new Gen2 VMs (portal, CLI, PowerShell)?', 'Trusted launch: Secure Boot, vTPM and boot integrity monitoring. Opt out with security type `Standard`.'),
  c('3.2', 'Azure Disk Encryption retirement?', 'Scheduled for September 15, 2028; afterwards ADE disks fail to unlock on reboot. Microsoft recommends encryption at host for new VMs.'),
  c('3.2', 'ADE key vault requirements?', 'Same region and subscription as the VM, `enabledForDiskEncryption` set, soft delete on. Not for Basic, A-series, v6+ sizes or VMs under 2 GB of memory.'),
  c('3.2', 'Encryption at host covers what SSE doesn\'t?', 'Temp disks, ephemeral OS disks and OS/data disk caches, encrypted at the host. Needs the `EncryptionAtHost` feature registered; existing VMs must be deallocated; never on VMs that had ADE.'),
  c('3.2', 'What changes when a VM moves to another resource group?', 'Its resource ID (and role assignments are orphaned). Region and running state don\'t change; both resource groups are locked during the move.'),
  c('3.2', 'Resize a VM to a size not in `az vm list-vm-resize-options`?', 'Deallocate it, then `az vm resize`, then start it. Resizing a running VM restarts it anyway.'),
  c('3.2', 'Stopped vs Stopped (deallocated)?', 'Stopped (OS shutdown, `az vm stop`): compute still billed. Deallocated (portal Stop, `az vm deallocate`, `Stop-AzVM`): no compute charge. Disks billed in both.'),
  c('3.2', 'Disk types that can\'t be OS disks?', 'Ultra Disk and Premium SSD v2. Both also lack host caching and suit data disks with independently set IOPS and throughput.'),
  c('3.2', 'VM SLA figures?', 'Single VM with premium disks everywhere 99.9%; two or more in an availability set 99.95%; two or more across two or more zones 99.99%.'),
  c('3.2', 'Availability set FD/UD limits?', 'Up to 3 fault domains and 20 update domains, fixed at creation; one UD rebooted at a time; VMs join only at creation.'),
  c('3.2', 'Default scale set orchestration mode (CLI/PowerShell)?', 'Flexible (since November 2023), the recommended mode. Can\'t be changed after creation; instances are standard VMs.'),
  c('3.2', 'Autoscale with several rules?', 'Scale out if any scale-out rule fires (the highest resulting capacity wins); scale in only if all scale-in rules fire. Always within min and max.'),
  // 3.3 Containers
  c('3.3', 'ACR features that need the Premium SKU?', 'Geo-replication, private endpoints, public IP network rules, customer-managed keys, connected registries, dedicated data endpoints and the untagged-manifest retention policy (preview).'),
  c('3.3', 'Get an image into ACR without a local Docker engine?', '`az acr build -r <registry> -t repo:tag .` (ACR Tasks builds in Azure) or `az acr import -n <registry> --source <image> -t repo:tag` (registry-to-registry copy).'),
  c('3.3', 'Roles to pull and push in a default (RBAC-only) registry?', '**AcrPull** to pull, **AcrPush** to pull and push, AcrDelete to delete. ABAC-mode registries ignore them and use Container Registry Repository Reader/Writer/Contributor.'),
  c('3.3', 'Why avoid the ACR admin user?', 'One shared account with full push and pull rights and no per-user audit; disabled by default. Use Entra identities or managed identities instead.'),
  c('3.3', 'What do containers in an ACI container group share?', 'Host, lifecycle, IP address and DNS label, ports, volumes, restart policy and OS type. Multi-container groups are Linux only.'),
  c('3.3', 'ACI restart policies?', '**Always** (default), **OnFailure** (restart on non-zero exit), **Never**. Finished task containers show **Terminated**.'),
  c('3.3', 'Pull from ACR in ACI with a managed identity?', 'User-assigned identity only (system-assigned isn\'t supported for image pulls), with AcrPull; pass it to `--assign-identity` and `--acr-identity`.'),
  c('3.3', 'Container Apps replica defaults?', 'Min **0** (scale to zero), max **10**; both configurable up to 1,000. HTTP and TCP rules default to 10 concurrent requests or connections per replica.'),
  // 3.4 App Service
  c('3.4', 'Cheapest App Service tier for each: TLS on a custom domain, autoscale, slots, automatic scaling?', 'Custom domain + TLS: **Basic**. Rule-based autoscale and slots (5): **Standard**. Automatic scaling and 20 slots: **Premium v2/v3/v4**.'),
  c('3.4', 'Scale up vs scale out (App Service)?', 'Up: change tier or size (`az appservice plan update --sku`). Out: change instance count (`--number-of-workers`). Both affect every app in the plan.'),
  c('3.4', 'What replaced `az webapp up`?', 'The CLI reference marks it deprecated: it exits with an error. Use `az webapp create` then `az webapp deploy`.'),
  c('3.4', 'App Service managed certificate limits?', 'Free, auto-renewed, Basic and up; no wildcard, not exportable, not in ASE, one per custom domain; subdomain CNAME must point directly to the app.'),
  c('3.4', 'SNI SSL vs IP SSL binding?', 'SNI: Basic and up, unlimited, shared IP. IP SSL: Standard and up, dedicated inbound IP; remap the A record afterwards.'),
  c('3.4', 'DNS records to map `www.contoso.com` and `contoso.com`?', '`www`: CNAME to `<app>.azurewebsites.net` + TXT `asuid.www`. Apex: A `@` to the app IP + TXT `asuid`. TXT value = custom domain verification ID.'),
  c('3.4', 'Automatic vs custom App Service backups?', 'Automatic: hourly, 30 days, 30 GB, no config, no DB. Custom: your storage container, scheduled or on demand, 10 GB (4 GB DB), downloadable, `_backup.filter`.'),
  c('3.4', 'Inbound vs outbound App Service networking?', 'Inbound: access restrictions, service endpoints, private endpoints, app-assigned address. Outbound: VNet integration (delegated subnet, route all), Hybrid Connections.'),
  c('3.4', 'Settings that stay with a slot during a swap?', 'Custom domains, TLS bindings, scale settings, managed identities, VNet integration, HTTPS Only/TLS version, IP restrictions, Always On, CORS, and any setting marked as a slot setting.'),
];
