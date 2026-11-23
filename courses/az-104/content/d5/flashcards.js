// Domain 5 — Monitor and maintain Azure resources. Original flashcards; facts checked against Microsoft Learn on
// 2026-11-23 (see REVIEW-TODO.md for sources and items still to confirm in a subscription).
let n = 0;
const c = (topic, front, back) => ({ id: `d5-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 5.1
  c('5.1', 'What does Azure Monitor collect with no configuration?', 'Platform metrics (every minute, kept 93 days) and the activity log (kept 90 days, free). Resource logs need a diagnostic setting; guest OS data needs the Azure Monitor Agent and a DCR.'),
  c('5.1', 'The five metric aggregations?', 'Sum, Count (number of samples, not their values), Average, Min, Max. Missing data is NULL and isn\'t counted.'),
  c('5.1', 'Activity log categories?', 'Administrative, Service Health, Resource Health, Alert, Autoscale, Security, Recommendation, Policy.'),
  c('5.1', 'Diagnostic setting destinations and limits?', 'Log Analytics workspace, storage account, event hub, partner solution. One of each type per setting, five settings per resource; storage and event hub in the same region as a regional resource.'),
  c('5.1', 'Azure diagnostics vs resource-specific mode?', 'Azure diagnostics writes every resource to the shared AzureDiagnostics table; resource-specific writes one table per category (e.g. StorageBlobLogs). Learn recommends resource-specific.'),
  c('5.1', 'Log Analytics table plans?', 'Analytics (full features, alerts, Insights), Basic (cheaper ingestion, pay per query, 30 days of queries), Auxiliary / Lake (cheapest, slow, no alerts). Switch at most once a week.'),
  c('5.1', 'Workspace retention limits?', 'Analytics retention default 30 days, up to 2 years (730 days); total retention up to 12 years. Older data is retrieved with a search job.'),
  c('5.1', 'When was the Log Analytics agent retired, and what replaces it?', 'August 31, 2024. The Azure Monitor Agent with data collection rules (Azure Arc first for non-Azure machines).'),
  c('5.1', 'KQL: default direction of `sort by` and `top`?', 'Descending. `take` returns arbitrary rows with no ordering.'),
  c('5.1', 'Alert severities?', 'Sev0 Critical, Sev1 Error, Sev2 Warning (CLI default), Sev3 Informational, Sev4 Verbose.'),
  c('5.1', 'Stateful vs stateless alerts?', 'Stateful fire once and resolve when the condition clears (metric: three clean checks). Stateless fire every time; all activity log alerts are stateless.'),
  c('5.1', 'Alert processing rule vs action group?', 'Action group = who to notify and what to run. Alert processing rule = suppress or add action groups on fired alerts by scope, filter and schedule. Suppression wins.'),
  c('5.1', 'Connection monitor test count?', 'Per test group: sources x destinations x test configurations. Azure sources need the Network Watcher Agent extension; on-premises sources need Azure Arc plus the Azure Monitor Agent.'),
  c('5.1', 'NSG flow logs status?', 'Retire September 30, 2027; new NSG flow logs can no longer be created. Use virtual network flow logs (VNet, subnet or NIC; NIC > subnet > VNet) to a same-region Standard storage account.'),
  c('5.1', 'VM insights Map status?', 'Map and the Dependency Agent are deprecated: no new portal onboarding since September 30, 2025; retirement June 30, 2028.'),
  // 5.2
  c('5.2', 'Recovery Services vault vs Backup vault workloads?', 'RSV: Azure VMs, SQL and SAP HANA in VMs, Azure Files, MARS, MABS, DPM, Site Recovery. Backup vault: managed disks, blobs, PostgreSQL, AKS.'),
  c('5.2', 'Vault region rules?', 'Backup: vault in the same region as the data. Site Recovery: vault in any region except the source. Vaults can\'t move between regions.'),
  c('5.2', 'When must vault redundancy be set?', 'Before any item is protected. Default GRS; options GRS, LRS, ZRS. Cross Region Restore needs GRS and can\'t be turned off after protection starts.'),
  c('5.2', 'Soft delete for Azure Backup?', '14 days by default, up to 180 (first 14 days free). Enforced (secure by default) for Recovery Services vaults, so a vault holding soft-deleted items may not delete until they expire. Undelete returns the item to stop protection with retain data.'),
  c('5.2', 'Standard vs Enhanced VM policy?', 'Standard: daily or weekly, instant restore 1–5 days (default 2). Enhanced: every 4 to 24 hours, instant restore 1–30 days (default 7; 17 max at every 4 hours), Premium SSD v2, Ultra and Trusted Launch; migration Standard to Enhanced only, no way back.'),
  c('5.2', 'Reducing a backup policy\'s retention?', 'Existing points outside the new retention are pruned at the next cleanup (soft-deleted first). Extending retention extends existing points. Immutable vaults block reductions.'),
  c('5.2', 'Site Recovery replication policy defaults?', 'Recovery point retention 1 day (up to 15 days); app-consistent snapshot frequency 0 (off), minimum 1 hour. Crash-consistent points every 5 minutes.'),
  c('5.2', 'Site Recovery recovery point choices?', 'Latest (lowest RPO), Latest processed (lowest RTO), Latest app-consistent, multi-VM options for plans, Custom (single VM only).'),
  c('5.2', 'How do you get emails for built-in Azure Backup alerts?', 'Create an action group and an alert processing rule that applies it to Azure Backup alerts. Opt in to "Use only Azure Monitor alerts".'),
];
