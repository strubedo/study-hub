// Domain 5 — Monitor and maintain Azure resources. Original questions modelled on Microsoft's published item
// formats (study guide wording, exam sandbox item types, practice assessment style); no recalled exam content.
// Facts checked against Microsoft Learn on 2026-11-23. KQL results, metric aggregations, alert windows and backup
// retention dates were worked by hand and re-checked in an offline Python script. Command output and portal text in
// exhibits are documentation-based (not captured from a subscription) and are listed in REVIEW-TODO.md.
const L1 = '5.1-metrics';
const L2 = '5.1-log-settings';
const L3 = '5.1-kql';
const L4 = '5.1-alerts';
const L5 = '5.1-insights';
const L6 = '5.1-network-watcher';
const L7 = '5.2-vaults';
const L8 = '5.2-backup-policies';
const L9 = '5.2-backup-restore';
const L10 = '5.2-site-recovery';
const L11 = '5.2-failover';
const L12 = '5.2-backup-reports-alerts';

const bank = [
  // ---------- 5.1 Monitor resources in Azure ----------
  { topic: '5.1', type: 'single', difficulty: 1, lesson: L1,
    stem: 'Refer to the exhibit. A metrics explorer chart for vm-web-01 uses a 5-minute time granularity and shows a single data point of 40 for this interval. Which aggregation is the chart using?',
    exhibit: `Metric: Percentage CPU   Resource: vm-web-01   Namespace: Virtual Machine Host
One-minute values in the interval 10:00-10:04 UTC

Time    Percentage CPU
10:00   20
10:01   40
10:02   90
10:03   30
10:04   20`,
    options: ['Average', 'Max', 'Sum', 'Count'],
    answer: [0],
    explanation: "The five values add up to 200, so **Average** = 200 / 5 = 40. **Max** would show 90, the single highest sample. **Sum** would show 200. **Count** counts measurements, not their values, so it would show 5. The fact that 40 also appears as one raw value is a coincidence: each chart point is the aggregation of the whole bucket." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. The chart uses a 5-minute time granularity and the Average aggregation. What value does it show for the 10:00 interval? Enter a number.',
    exhibit: `Metric: Network Out Total   Resource: vm-web-01
One-minute values in the interval 10:00-10:04 UTC

Time    Network Out Total (bytes)
10:00   100
10:01   0
10:02   300
10:03   (no data received: recorded as NULL)
10:04   200`,
    answer: ['150', '150 bytes'],
    explanation: "Azure Monitor records missing data as **NULL**, which is not zero and isn't counted as a measurement. Average = (100 + 0 + 300 + 200) / 4 = **150**. If the NULL were treated as zero the answer would be 120, which is the trap. The zero at 10:01 is a real measurement and is counted. For the same bucket, Count = 4 and Sum = 600." },
  { topic: '5.1', type: 'multi', difficulty: 1, lesson: L1,
    stem: 'Which two statements about data that Azure Monitor collects without any configuration are true? (Choose two.)',
    options: ['Platform metrics are stored for 93 days', 'Resource logs are collected automatically and kept for 30 days', 'Activity log events are kept for 90 days at no charge', 'Guest OS performance counters are collected automatically for every Azure VM', 'A single metrics explorer chart can display up to 93 days of data'],
    answer: [0, 2],
    explanation: "Learn states platform and custom metrics are stored for **93 days**, and the activity log keeps events for **90 days** with no charge. Resource logs aren't collected at all until you create a **diagnostic setting**. Guest OS counters need the **Azure Monitor Agent** and a data collection rule. Metrics explorer can show at most **30 days** on one chart; you pan to see the rest of the 93 days." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. Security operations need the AuditEvent logs of kv-contoso-prod in their own workspace, log-contoso-sec, as well as in log-contoso-ops. The existing settings must keep working. What should you do?',
    exhibit: `Key vault: kv-contoso-prod   Region: East US   Resource group: rg-sec-prod
Monitoring > Diagnostic settings

Name        Logs                      Metrics      Destinations
diag-ops    AuditEvent                AllMetrics   Log Analytics workspace: log-contoso-ops (East US)
diag-arch   allLogs (category group)  -            Storage account: stcontosoarch01 (East US)

Workspaces:  log-contoso-ops (East US), log-contoso-sec (West Europe)`,
    options: ['Create a third diagnostic setting on kv-contoso-prod that sends AuditEvent to log-contoso-sec', 'Edit diag-ops and add log-contoso-sec as a second Log Analytics destination', 'Move log-contoso-sec to East US, then add it to diag-arch', 'Create a data collection rule that copies AuditEvent from log-contoso-ops to log-contoso-sec'],
    answer: [0],
    explanation: "A diagnostic setting can have **one destination of each type**, so to reach a second workspace you create **another setting**; a resource can have up to five. Log Analytics workspaces don't have to be in the resource's region, so West Europe is fine (the same-region rule applies to storage accounts and event hubs). diag-ops can't hold two workspaces, and workspaces can't be moved between regions. Data collection rules configure collection by agents and other sources; they don't copy data from one workspace to another." },
  { topic: '5.1', type: 'match', difficulty: 2, lesson: L2,
    stem: 'You are configuring diagnostic settings for kv-contoso-prod. Match each requirement to the destination that meets it.',
    pairs: [
      ['Stream audit events in near real time to a third-party SIEM that reads from Kafka-compatible endpoints', 'Event hub'],
      ['Keep audit events for seven years at the lowest cost, protected by an immutability policy', 'Storage account'],
      ['Query events with KQL and fire a log search alert when a secret is deleted', 'Log Analytics workspace'],
      ['Send events to an observability platform from Microsoft\'s Azure Native ISV Services', 'Azure Monitor partner solution'],
    ],
    explanation: "**Event hubs** are the streaming destination for SIEMs and external tools. A **storage account** is the cheapest long-term archive and supports immutable blob policies. A **Log Analytics workspace** is needed for KQL, log search alerts, workbooks and Insights. **Partner solutions** (Azure Native ISV Services) are the fourth destination type for third-party observability platforms." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. The script must send all NSG resource logs for nsg-web to log-contoso-prod. Enter the parameter that replaces the blank.',
    exhibit: `lawid=$(az monitor log-analytics workspace show -g rg-mon-prod -n log-contoso-prod --query id -o tsv)
az monitor diagnostic-settings create --name nsg-web-diag \\
  --resource /subscriptions/<subscription-id>/resourceGroups/rg-net-prod/providers/Microsoft.Network/networkSecurityGroups/nsg-web \\
  ____ $lawid \\
  --logs '[{"categoryGroup":"allLogs","enabled":true}]'`,
    answer: ['--workspace'],
    explanation: "`az monitor diagnostic-settings create` takes the Log Analytics destination as **`--workspace`** (name or resource ID). The other destinations are `--storage-account` and `--event-hub-rule` (with `--event-hub`). `--logs` takes the categories or a category group such as `allLogs`; `--resource` identifies the monitored resource." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. On 2026-11-23 an investigator needs StorageBlobLogs records from 200 days earlier. What should the investigator do?',
    exhibit: `Log Analytics workspace: log-contoso-prod > Tables > StorageBlobLogs > Manage table

Table plan:                 Analytics
Analytics retention:        90 days
Total retention:            730 days
Data ingested continuously since 2025-06-01`,
    options: ['Run a search job against StorageBlobLogs for that time range', 'Nothing: data older than the 90-day analytics retention has been deleted', 'Run a normal Log Analytics query, because total retention keeps data interactive', 'Open Logs from the storage account (resource context), which isn\'t limited by the workspace retention'],
    answer: [0],
    explanation: "Data older than the **analytics retention** (90 days) but within **total retention** (730 days) is in **long-term retention**: still in the table at low cost, but for Analytics and Basic tables it's retrieved with a **search job** (or a restore), not an interactive query. Nothing has been deleted. Resource-context queries read the same workspace tables with the same retention; they only narrow which records you see." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'You need to collect the Windows Security event log from 50 Azure VMs into log-contoso-sec. The solution must use a supported agent and the least administrative effort. What should you do?',
    options: ['Install the Azure Monitor Agent on the VMs and associate them with a data collection rule that collects Security events and sends them to log-contoso-sec', 'Install the Log Analytics agent and configure Windows event logs on the workspace Agents configuration page', 'Create a diagnostic setting on each VM that sends the Security category to log-contoso-sec', 'Enable boot diagnostics on each VM with a managed storage account'],
    answer: [0],
    explanation: "Guest OS logs are collected by the **Azure Monitor Agent**, configured by a **data collection rule** that one association can apply to many VMs (Azure Policy can automate both). The **Log Analytics agent was retired on August 31, 2024**. A VM's diagnostic settings route platform metrics, not guest event logs. Boot diagnostics captures serial console output and screenshots." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. How many rows does the query return?',
    exhibit: `Syslog sample (all rows in the time range)

TimeGenerated   Computer    Facility   SeverityLevel
09:58           vm-lnx-01   auth       err
10:02           vm-lnx-01   auth       info
10:03           vm-lnx-02   daemon     err
10:07           vm-lnx-02   auth       err
10:08           vm-lnx-01   auth       err
10:12           vm-lnx-03   kern       warning
10:14           vm-lnx-02   auth       err

Query:
Syslog
| where SeverityLevel == "err"
| summarize Errors = count() by Computer, bin(TimeGenerated, 10m)`,
    options: ['3', '4', '5', '6'],
    answer: [1],
    explanation: "Five rows have SeverityLevel `err`. `bin(TimeGenerated, 10m)` rounds down to 10-minute buckets, and `summarize ... by Computer, bin(...)` makes one row per combination: vm-lnx-01 at 09:50 (09:58), vm-lnx-02 at 10:00 (10:03 and 10:07, Errors = 2), vm-lnx-01 at 10:00 (10:08), and vm-lnx-02 at 10:10 (10:14). That's **4** rows. The info and warning rows are filtered out first." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Enter the value of Caller in the single row that the query returns.',
    exhibit: `AzureActivity sample (all rows in the time range)

Caller            OperationNameValue                                 ActivityStatusValue
ana@contoso.com   MICROSOFT.COMPUTE/VIRTUALMACHINES/DELETE           Failure
raj@contoso.com   MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/DELETE     Failure
ana@contoso.com   MICROSOFT.COMPUTE/VIRTUALMACHINES/WRITE            Failure
lee@contoso.com   MICROSOFT.STORAGE/STORAGEACCOUNTS/DELETE           Success
raj@contoso.com   MICROSOFT.COMPUTE/DISKS/DELETE                     Failure
ana@contoso.com   MICROSOFT.COMPUTE/VIRTUALMACHINES/DELETE           Start
lee@contoso.com   MICROSOFT.NETWORK/PUBLICIPADDRESSES/DELETE         Failure

Query:
AzureActivity
| where OperationNameValue endswith "/DELETE" and ActivityStatusValue == "Failure"
| summarize Failures = count() by Caller
| top 1 by Failures`,
    answer: ['raj@contoso.com'],
    explanation: "Keep only rows whose operation ends in `/DELETE` **and** whose status is `Failure`: ana has one (the WRITE row and the Start row are excluded), raj has two (NSG and disk), lee has one (the storage delete succeeded). `top 1 by Failures` sorts descending by default and keeps the first row: **raj@contoso.com** with 2." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which computers does the query return?',
    exhibit: `Heartbeat records received in the last 15 minutes (Computer column):
vm-web-01, vm-web-01, vm-web-01, vm-sql-01, vm-sql-01, vm-dc-01

Query:
let expected = datatable(Computer:string) ["vm-web-01", "vm-web-02", "vm-app-01", "vm-sql-01"];
expected
| join kind=leftanti (
    Heartbeat
    | where TimeGenerated > ago(15m)
    | distinct Computer
  ) on Computer`,
    options: ['vm-web-02 and vm-app-01', 'vm-dc-01 only', 'vm-web-01 and vm-sql-01', 'vm-web-02, vm-app-01 and vm-dc-01'],
    answer: [0],
    explanation: "A **leftanti** join returns rows from the **left** table that have **no match** on the right. The left table lists four expected computers; vm-web-01 and vm-sql-01 sent heartbeats, so **vm-web-02 and vm-app-01** remain: the machines that went silent. vm-dc-01 is only on the right side, so a leftanti join never returns it (a rightanti join would). vm-web-01 and vm-sql-01 would be the result of an inner or leftsemi join." },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which two queries always return the three computers with the highest average processor time? (Choose two.)',
    exhibit: `All queries start with:
Perf
| where ObjectName == "Processor" and CounterName == "% Processor Time" and TimeGenerated > ago(1h)

Query 1:  | summarize AvgCPU = avg(CounterValue) by Computer | top 3 by AvgCPU
Query 2:  | summarize AvgCPU = avg(CounterValue) by Computer | take 3
Query 3:  | summarize AvgCPU = avg(CounterValue) by Computer | sort by AvgCPU | take 3
Query 4:  | summarize AvgCPU = avg(CounterValue) by Computer | sort by AvgCPU asc | take 3
Query 5:  | top 3 by CounterValue | summarize AvgCPU = avg(CounterValue) by Computer`,
    options: ['Query 1', 'Query 2', 'Query 3', 'Query 4', 'Query 5'],
    answer: [0, 2],
    explanation: "**Query 1** uses `top`, which sorts descending by default. **Query 3** sorts with no direction, and `sort by` also defaults to **descending**, then takes three. Query 2's `take` returns any three rows with no ordering. Query 4 sorts ascending, so it returns the three lowest. Query 5 keeps only the three highest individual samples before averaging, which can return fewer than three computers and isn't an average over the hour." },
  { topic: '5.1', type: 'order', difficulty: 1, lesson: L3,
    stem: 'You are writing a log query that returns the five computers with the highest average processor time in the last hour. Put the query lines in order.',
    items: ['Perf', '| where TimeGenerated > ago(1h) and ObjectName == "Processor" and CounterName == "% Processor Time"', '| summarize AvgCPU = avg(CounterValue) by Computer', '| top 5 by AvgCPU', '| render barchart'],
    explanation: "Start from the **table**, **filter** rows (time first inside the predicate), **aggregate** with `summarize ... by Computer`, then pick the **top five** by the new `AvgCPU` column, and **render** last. `top` can't come before `summarize` because AvgCPU doesn't exist until then, and `render` must be the final operator because it only draws the result it receives." },
  { topic: '5.1', type: 'fill', difficulty: 3, lesson: L4,
    stem: 'Refer to the exhibit. At which evaluation time does the alert rule first fire? Enter the time as hh:mm.',
    exhibit: `Alert rule: alert-web01-cpu   Scope: vm-web-01   Severity: 2
Signal: Percentage CPU   Threshold: Static
Aggregation type: Average   Operator: Greater than   Threshold value: 80
Check every: 1 minute   Lookback period: 5 minutes
(Each evaluation at time T aggregates the five one-minute values from T-5 through T-1.)

One-minute values (every value before 10:00 was 70)
10:00 70   10:01 85   10:02 90   10:03 75
10:04 78   10:05 95   10:06 88   10:07 60`,
    answer: ['10:06'],
    explanation: "Evaluate each 5-minute window. Evaluations up to 10:04 include earlier 70s and stay below 80 (10:04 averages (70 + 70 + 85 + 90 + 75) / 5 = 78). At **10:05** the window 10:00-10:04 averages (70 + 85 + 90 + 75 + 78) / 5 = 79.6, not greater than 80, even though the maximum (90) is. At **10:06** the window 10:01-10:05 averages (85 + 90 + 75 + 78 + 95) / 5 = 84.6, so the condition is met and the alert fires at **10:06**. With the Maximum aggregation it would have fired at 10:05." },
  { topic: '5.1', type: 'match', difficulty: 2, lesson: L4,
    stem: 'Match each monitoring requirement to the alert type that meets it with the least effort.',
    pairs: [
      ['Notify the team whenever anyone deletes a virtual machine in Contoso-Prod', 'Activity log alert (Administrative)'],
      ['Notify the team when Azure announces planned maintenance for App Service in East US that affects the subscription', 'Service Health alert'],
      ['Notify the team when vm-sql-01 becomes Unavailable because of a platform problem', 'Resource Health alert'],
      ['Notify the team when Syslog shows more than 10 failed SSH logons in 15 minutes', 'Log search alert'],
      ['Notify the team when a VM\'s CPU deviates from its usual hourly and daily pattern', 'Metric alert with a dynamic threshold'],
    ],
    explanation: "Control plane operations such as deletes are **activity log** events in the Administrative category. Azure incidents and maintenance are **Service Health** events; the health of one of your resources is **Resource Health**; both are activity log alert types and are stateless. Counting Syslog rows needs a **log search** query. A **dynamic threshold** learns seasonal patterns of a metric, so no fixed number is needed." },
  { topic: '5.1', type: 'single', difficulty: 3, lesson: L4,
    stem: 'Refer to the exhibit. At 23:10 Eastern Time on a Saturday, alert-web01-cpu fires for vm-web-01. What happens?',
    exhibit: `Subscription: Contoso-Prod

Alert rule: alert-web01-cpu   Scope: vm-web-01 (rg-web-prod)   Severity: Sev0   Action group: ag-web

Alert processing rules
Name              Scope                    Filter            Rule type                  Schedule
apr-maint         rg-web-prod              (none)            Suppress notifications     Weekly, Saturday 22:00-23:59 (Eastern Standard Time)
apr-sev0-oncall   Contoso-Prod (subscr.)   Severity = Sev0   Apply action group:        Always
                                                             ag-oncall`,
    options: ['The alert is created and appears on the Alerts page, but neither ag-web nor ag-oncall is notified', 'The alert is created and only ag-oncall is notified', 'The alert is created and both ag-web and ag-oncall are notified', 'No alert is created until the maintenance window ends at 23:59'],
    answer: [0],
    explanation: "Both processing rules match the alert, but **suppression takes priority** over Apply action group: all action groups are removed, including ag-web from the rule and ag-oncall added by the second processing rule. Suppression doesn't stop the alert itself: it still **fires and is listed** (portal, Resource Graph, API), and it won't notify at the end of the window either." },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: L5,
    stem: 'Which two statements about Azure Monitor Insights are true? (Choose two.)',
    options: ['Storage insights needs a diagnostic setting on each storage account before it shows data', 'Enhanced VM monitoring (VM insights) needs the Azure Monitor Agent and a data collection rule associated with the VM', 'Network insights needs the Network Watcher Agent extension on every VM before it shows topology', 'The VM insights Map feature and Dependency Agent are deprecated, and new VMs can no longer be onboarded to Map from the portal', 'Storage insights capacity views need a Log Analytics workspace'],
    answer: [1, 3],
    explanation: "VM insights installs the **Azure Monitor Agent** and associates a **DCR** that sends guest counters to a workspace. Learn states the **Map experience and Dependency Agent are deprecated**: no new portal onboarding since September 30, 2025, retirement on June 30, 2028. Storage insights and Network insights need **no configuration**: they use platform metrics, Resource Health and Resource Graph, so no diagnostic setting, agent or workspace is required for them." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L6,
    stem: 'Refer to the exhibit. How many tests does the connection monitor cm-branch contain? Enter a number.',
    exhibit: `Network Watcher > Connection monitor > cm-branch (East US)

Test group: tg-web (enabled)
  Sources:              vm-web-01, vm-web-02, vm-web-03
  Destinations:         sql-01 (10.20.2.4), www.contoso.com
  Test configurations:  tcp-1433 (TCP 1433), https-443 (HTTP 443)

Test group: tg-mgmt (enabled)
  Sources:              vm-jump-01
  Destinations:         10.20.0.4, 10.20.0.5
  Test configurations:  icmp-1 (ICMP)`,
    answer: ['14'],
    explanation: "Each test group expands to **sources x destinations x test configurations**. tg-web: 3 x 2 x 2 = 12. tg-mgmt: 1 x 2 x 1 = 2. Total **14** tests, the most granular level at which Connection monitor stores checks failed % and round-trip time." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L6,
    stem: 'Refer to the exhibit. Which state does Connection monitor report for the test?',
    exhibit: `Test: vm-web-01 -> sql-01 (tcp-1433)
Test configuration thresholds
  Checks failed (%):        10
  Round-trip time (ms):     100

Observed in the last evaluation
  Checks failed:            9%
  Average round-trip time:  40 ms`,
    options: ['Warning', 'Pass', 'Fail', 'Indeterminate'],
    answer: [0],
    explanation: "Learn's rule: when you set a threshold and the observed checks-failed percentage is **more than 80% of that threshold**, the test is **Warning**. 80% of 10% is 8%, and 9% is above it, even though it is still under the 10% limit. RTT (40 ms) is well under 100 ms. **Fail** needs a threshold to be exceeded; **Indeterminate** means no data in the workspace; **Pass** would need checks failed at or below 8%." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L6,
    stem: 'Refer to the exhibit. You must record all IP flows in vnet-hub, including traffic through its VPN gateway, keep the logs for 90 days, and analyse them with traffic analytics. What should you configure?',
    exhibit: `vnet-hub   Region: East US   Subnets: GatewaySubnet (VPN gateway vpng-hub), snet-app (nsg-app)

Storage accounts
Name          Region     Performance   Kind
stflow01      East US    Premium       BlockBlobStorage
stflow02      West US    Standard      StorageV2
stflow03      East US    Standard      StorageV2

Workspace: log-contoso-prod (East US)`,
    options: ['A virtual network flow log on vnet-hub that writes to stflow03 with 90-day retention and traffic analytics to log-contoso-prod', 'An NSG flow log on nsg-app that writes to stflow03 with 90-day retention and traffic analytics to log-contoso-prod', 'A virtual network flow log on vnet-hub that writes to stflow02 with 90-day retention and traffic analytics to log-contoso-prod', 'A virtual network flow log on vnet-hub that writes to stflow01 with 90-day retention and traffic analytics to log-contoso-prod'],
    answer: [0],
    explanation: "**Virtual network flow logs** cover every flow in the VNet, including VPN gateway traffic, and need a **Standard** storage account in the **same region** as the VNet: stflow03. NSG flow logs retire on September 30, 2027, **can't be newly created**, and never covered VPN gateway traffic. stflow02 is in the wrong region. stflow01 is a premium account, which flow logs don't support." },

  // ---------- 5.2 Implement backup and recovery ----------
  { topic: '5.2', type: 'match', difficulty: 2, lesson: L7,
    stem: 'Match each requirement for rsv-contoso-eus to the vault feature that meets it.',
    pairs: [
      ['Restore VMs in the paired region during a DR drill without waiting for Microsoft to declare an outage', 'Cross Region Restore'],
      ['Permanently prevent anyone, including Owners, from shortening retention or deleting recovery points before they expire', 'Immutable vault, enabled and locked'],
      ['Require approval from a security team member in a different tenant before soft delete or immutability can be weakened', 'Multi-user authorization with a Resource Guard'],
      ['Recover backup data that an administrator removed with Stop backup and Delete backup data eight days ago', 'Soft delete (undelete the item)'],
    ],
    explanation: "**Cross Region Restore** (GRS vaults only) lets you restore from the secondary region at any time. A **locked immutable vault** blocks operations that lose recovery points and can't be reversed. **Multi-user authorization** puts a **Resource Guard**, owned by someone else and ideally in another subscription or tenant, in front of critical operations. **Soft delete** keeps deleted backup data for 14 days by default (up to 180), during which you can undelete it." },
  { topic: '5.2', type: 'match', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. Match each resource to the vault you should use to back it up.',
    exhibit: `Vaults (all in subscription Contoso-Prod)
Name      Type                      Region
rsv-eus   Recovery Services vault   East US
rsv-weu   Recovery Services vault   West Europe
bv-eus    Backup vault              East US
bv-weu    Backup vault              West Europe`,
    pairs: [
      ['vm-web-01, an Azure VM in East US', 'rsv-eus'],
      ['disk-data-02, a managed disk in West Europe that needs snapshot-only backups every 4 hours', 'bv-weu'],
      ['The finance file share in stcontosofin01 (West Europe)', 'rsv-weu'],
      ['Blob containers in stcontosoblob01 (East US)', 'bv-eus'],
    ],
    explanation: "Backup needs a vault **in the same region** as the data, of the **right type**. Azure VMs and **Azure Files** use a **Recovery Services vault**: rsv-eus for the East US VM, rsv-weu for the West Europe share. **Managed disks** (operational snapshot backups) and **blobs** use a **Backup vault**: bv-weu for the West Europe disk, bv-eus for the East US storage account." },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. The vault must store backups as locally redundant before the VM is protected. Enter the parameter that replaces the blank.',
    exhibit: `az backup vault create -g rg-bcdr-eus -n rsv-contoso-eus -l eastus
az backup vault backup-properties set -g rg-bcdr-eus -n rsv-contoso-eus ____ LocallyRedundant
az backup protection enable-for-vm -g rg-bcdr-eus --vault-name rsv-contoso-eus \\
  --vm $(az vm show -g rg-web-prod -n vm-web-01 --query id -o tsv) --policy-name DefaultPolicy`,
    answer: ['--backup-storage-redundancy'],
    explanation: "`az backup vault backup-properties set --backup-storage-redundancy` accepts **GeoRedundant**, **LocallyRedundant** or **ZoneRedundant**. A new Recovery Services vault defaults to GRS, and the setting must be changed **before** any item is protected; after backups exist, it's locked. The same command sets `--cross-region-restore-flag` and the soft-delete options." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L8,
    stem: 'Refer to the exhibit. Which recovery point is still available on Monday 2026-11-23 at 08:00 UTC?',
    exhibit: `Backup policy: pol-vm-std (Standard, time zone UTC)
Schedule:            Daily at 21:00
Instant restore:     2 days
Daily retention:     10 days
Weekly retention:    Saturday, 6 weeks
Monthly retention:   Day 1 of each month, 6 months
Yearly retention:    Not configured
All scheduled backups succeeded.`,
    options: ['Thursday 2026-10-01 21:00', 'Friday 2026-11-06 21:00', 'Saturday 2026-10-03 21:00', 'Saturday 2026-10-10 21:00'],
    answer: [0],
    explanation: "**2026-10-01** is day 1 of October, so it's a **monthly** point kept for six months (until April 2027). 2026-11-06 is only a daily point: 10 days later is 2026-11-16, already past. The Saturday points are weekly points kept 6 weeks (42 days): 2026-10-03 expired on 2026-11-14 and 2026-10-10 on 2026-11-21, two days before. Neither is day 1 of a month." },
  { topic: '5.2', type: 'multi', difficulty: 3, lesson: L8,
    stem: 'Refer to the exhibit. An administrator saves the change to pol-vm-prod on 2026-11-23. Which two statements are true? (Choose two.)',
    exhibit: `Recovery Services vault: rsv-contoso-eus   Soft delete: enabled, 14 days   Immutability: Disabled
Policy pol-vm-prod (Standard), protects 12 VMs

Setting              Before                 After the change
Schedule             Daily 23:00 UTC        Daily 23:00 UTC
Daily retention      30 days                14 days
Weekly retention     Sunday, 12 weeks       Sunday, 12 weeks
Yearly retention     Not configured         First Sunday of January, 5 years`,
    options: ['Daily recovery points older than 14 days that are not weekly points are marked for pruning in the next cleanup and are held as soft-deleted for the soft-delete period', 'Existing daily recovery points keep their 30-day retention; the new value applies only to new recovery points', 'Existing Sunday recovery points from January 2026 become yearly points kept for 5 years', 'The recovery point taken on Sunday 2026-11-01 (22 days earlier) remains available', 'The change is rejected because 12 VMs are protected by the policy'],
    answer: [0, 3],
    explanation: "Learn's FAQ: when retention is **reduced**, existing points outside it are **marked for pruning** at the next cleanup; Learn's secure-by-default page (soft delete of recovery points) says points lost by reducing a policy's retention stay recoverable as soft-deleted for the vault's soft-delete period. The **Sunday 2026-11-01** point is older than the new 14-day daily retention, but it's a **weekly** point (12 weeks), so it remains. Retention changes do apply to existing points, which is why the second option is wrong. Adding a yearly range doesn't upgrade existing points (Learn's VM backup FAQ: adding a yearly range doesn't affect pre-existing monthly points; the Azure Files backup FAQ: existing points aren't re-tagged as weekly, monthly or yearly), and the January 2026 Sunday points had already passed their 12-week weekly retention anyway. Policies can be changed while items use them; only an immutable vault would block the reduction." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L8,
    stem: 'vm-db-01 uses Premium SSD v2 disks. You must back up the whole VM every 4 hours and keep instant restore snapshots for 14 days. What should you use?',
    options: ['An Enhanced VM backup policy in a Recovery Services vault with an hourly schedule every 4 hours and 14-day instant restore retention', 'A Standard VM backup policy in a Recovery Services vault with a daily schedule and 14-day instant restore retention', 'An Azure Disk Backup policy in a Backup vault with an hourly schedule every 4 hours', 'A Standard VM backup policy with a weekly schedule and five on-demand backups each day'],
    answer: [0],
    explanation: "Only the **Enhanced** policy supports **Premium SSD v2**, schedules **every 4 hours**, and instant restore retention up to 30 days (Learn gives 17 days as the maximum at a 4-hour frequency, so 14 fits). The Standard policy runs once a day, keeps snapshots 1 to 5 days and doesn't protect Premium SSD v2. Azure Disk Backup protects individual disks, not the VM, and supports only a 12-hour hourly schedule for Premium SSD v2. On-demand backups aren't a schedule." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L9,
    stem: 'Refer to the exhibit. All three VMs use the same backup policy and the backup at 23:00 succeeds for each. Which consistency does the recovery point for vm-lnx-01 have?',
    exhibit: `VM          OS                    State at 23:00   Backup configuration
vm-sql-01   Windows Server 2022   Running          VM agent healthy, all VSS writers succeed
vm-lnx-01   Ubuntu 22.04          Running          VM agent healthy, no pre-script or post-script configured
vm-lnx-02   Ubuntu 22.04          Deallocated      VM agent not running`,
    options: ['File-system consistent', 'Application-consistent', 'Crash-consistent', 'No recovery point is created for vm-lnx-01'],
    answer: [0],
    explanation: "On Linux, application consistency needs the **pre-script and post-script** framework; without scripts, Azure Backup takes a **file-system consistent** snapshot (Learn's table: \"Linux: Default (if pre/post scripts aren't configured or failed)\"). vm-sql-01, with all VSS writers succeeding, gets application-consistent points. vm-lnx-02 is deallocated, so its point is crash-consistent." },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: L9,
    stem: 'A user deleted three files from vm-app-01 yesterday. The VM is backed up to rsv-contoso-eus. Put the steps to recover the files with file-level recovery in order.',
    items: ['In the vault, open Backup items and select vm-app-01', 'Select File Recovery and choose a recovery point from before the deletion', 'Download the executable or script and copy the password', 'Run the executable or script on a compatible machine to mount the recovery point volumes', 'Copy the three files from the mounted drives', 'Select Unmount Disks in the portal'],
    explanation: "File-level recovery mounts a recovery point as drives over **iSCSI**: pick the item, open **File Recovery** and a point, **download** the executable (Windows) or Python script (Linux) with its **password**, **run** it to mount the volumes read-only, **copy** the files, then **Unmount Disks**. The connection otherwise expires after 12 hours." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L9,
    stem: 'vm-app-02 was deleted by mistake. You must restore it from last night\'s recovery point into an availability set with a different VM size and two NICs. What should you do?',
    options: ['Use Restore disk, then deploy the generated template or attach the disks with the size, availability set and NICs you need', 'Use Create virtual machine, because it lets you choose any size, availability set and NIC layout', 'Use Replace existing, because the backup still holds the VM configuration', 'Enable Cross Region Restore and restore to the secondary region'],
    answer: [0],
    explanation: "**Restore disk** restores the managed disks and writes a VM configuration and **ARM template** to the staging storage account, so you can customise the VM (size, availability set, multiple NICs) before deploying it. **Create virtual machine** is the quick path with a basic set of settings. **Replace existing** needs the VM to still exist. Cross Region Restore restores to the paired region, which isn't a requirement." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L9,
    stem: 'Refer to the exhibit. On 2026-11-23 you must restore vm-app-01 from its 2026-11-10 recovery point. What should you do first?',
    exhibit: `Recovery Services vault: rsv-contoso-eus   Soft delete: enabled (secure by default), retention 14 days

Activity log
2026-11-12 09:00  Admin1  Stop backup  vm-app-01  Option: Delete backup data  Succeeded

Backup items > Azure Virtual Machine
vm-app-01   Status: Soft deleted`,
    options: ['Undelete the vm-app-01 backup item', 'Nothing: the backup data was deleted permanently on 2026-11-12', 'Select Resume backup for vm-app-01, then restore', 'Enable Cross Region Restore on the vault'],
    answer: [0],
    explanation: "Deleted backup data stays **soft-deleted** for the retention period: from 2026-11-12, 14 days runs to 2026-11-26, so on 2026-11-23 it's still recoverable. **Undelete** returns the item to the \"stop protection with retain data\" state; then you can restore from the 2026-11-10 point (and resume backup if needed). You can't resume or restore a soft-deleted item before undeleting it. Cross Region Restore is unrelated." },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: L11,
    stem: 'vm-web-01 replicates from East US to West US with Site Recovery. Put the steps in order to prove DR works, run a real failover, and end up running in East US again with replication restored.',
    items: ['Run a test failover into an isolated VNet, then clean up the test failover', 'Fail over vm-web-01 to West US', 'Commit the failover', 'Re-protect vm-web-01 so that West US replicates to East US', 'Fail over from West US back to East US and commit', 'Re-protect vm-web-01 so that East US replicates to West US again'],
    explanation: "Drill first with a **test failover** (no impact on replication) and **clean it up**. A real **failover** creates the VM in West US; **commit** it (required before re-protect). **Re-protect** reverses replication to East US. **Failing back** is a failover in the other direction plus commit, and a final **re-protect** restores the original direction." },
  { topic: '5.2', type: 'single', difficulty: 3, lesson: L11,
    stem: 'Refer to the exhibit. Corruption was written to the database on vm-sql-01 at 09:42. You must fail vm-sql-01 over so that SQL Server starts in a consistent state with no corrupted data, losing as little data as possible. vm-sql-01 isn\'t in a recovery plan. Which recovery point should you choose?',
    exhibit: `Replicated items > vm-sql-01 > Failover > Recovery points (East US to West US)

Time (UTC)   Type
10:15        Crash-consistent
10:10        Crash-consistent
10:00        Application-consistent
09:45        Crash-consistent
09:40        Crash-consistent
09:00        Application-consistent
08:00        Application-consistent`,
    options: ['Custom: the 09:00 application-consistent point', 'Latest app-consistent', 'Custom: the 09:40 crash-consistent point', 'Latest processed'],
    answer: [0],
    explanation: "The point must be **before 09:42** and **application-consistent**: the latest one that meets both is **09:00**, chosen with **Custom** (available because this is a single VM, not a recovery plan). **Latest app-consistent** would pick 10:00, which already contains the corruption. 09:40 is before the corruption but only crash-consistent. Latest processed is 10:15." },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: L10,
    stem: 'Refer to the exhibit. You will enable Site Recovery replication for vm-app-01 from East US to West US. Which two vaults can you use? (Choose two.)',
    exhibit: `VM: vm-app-01   Region: East US   Target region: West US

Vaults in Contoso-Prod
Name        Type                      Region
rsv-eus     Recovery Services vault   East US
rsv-wus     Recovery Services vault   West US
rsv-cus     Recovery Services vault   Central US
bv-wus      Backup vault              West US`,
    options: ['rsv-wus', 'rsv-cus', 'rsv-eus', 'bv-wus'],
    answer: [0, 1],
    explanation: "Learn: create the Recovery Services vault for Azure-to-Azure replication **in any region except the source region**. rsv-wus (the target region, the usual choice) and rsv-cus both qualify. rsv-eus is in the source region, which would be lost in the very outage you're protecting against. **Backup vaults** don't support Site Recovery." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L10,
    stem: 'Refer to the exhibit. During a failover, the Latest app-consistent option isn\'t available for vm-erp-01. You must have application-consistent recovery points every 4 hours. What should you do?',
    exhibit: `Recovery Services vault: rsv-contoso-wus > Site Recovery > Replication policies
Name                         Recovery point retention   App-consistent snapshot frequency
24-hour-retention-policy     24 hours                   0 hours
Associated items: vm-erp-01 (East US -> West US), vm-erp-02 (East US -> West US)`,
    options: ['Edit the replication policy and set the app-consistent snapshot frequency to 4 hours', 'Increase the recovery point retention to 15 days', 'Enable multi-VM consistency for vm-erp-01 and vm-erp-02', 'Install the VMSnapshot extension on vm-erp-01'],
    answer: [0],
    explanation: "An app-consistent snapshot frequency of **0 hours means disabled** (the default), so only crash-consistent points (every 5 minutes) exist. Set the **app-consistent snapshot frequency** to 4 hours (the minimum is 1 hour). Longer retention keeps more points but not app-consistent ones. Multi-VM consistency shares points across VMs; it doesn't create app-consistent points on its own. VMSnapshot is Azure Backup's extension; Site Recovery uses the Mobility service extension." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Backup failures and deletions of backup data in 30 Recovery Services vaults must send an email to ops@contoso.com. The vaults already generate built-in Azure Monitor alerts for Azure Backup. You need the least administrative effort. What should you do?',
    options: ['Create an action group with the email address and an alert processing rule that applies it to Azure Backup alerts in the subscription', 'Create a metric alert rule in each vault and attach the action group', 'Turn on classic alert email notifications in each vault', 'Create a diagnostic setting on each vault that streams to an event hub'],
    answer: [0],
    explanation: "Built-in Azure Backup alerts aren't produced by an alert rule you own, so there's nothing to attach an action group to; Learn's method is an **alert processing rule** that **applies an action group** to them, scoped to the subscription (optionally filtered on Monitor service = Azure Backup). One rule covers all 30 vaults. Metric rules per vault are 30 objects and don't cover deletion events. Classic alerts are being replaced (opt in to \"Use only Azure Monitor alerts\"). An event hub needs a consumer to send email." },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: L12,
    stem: 'You need Backup reports for 20 Recovery Services vaults in East US and West Europe. Which two actions are required? (Choose two.)',
    options: ['Configure a diagnostic setting on each vault that sends the Azure Backup events to a Log Analytics workspace', 'Select Resource specific as the destination table mode in each diagnostic setting', 'Create the Log Analytics workspace in the same region as each vault', 'Install the MARS agent on a reporting server', 'Send the vault diagnostics to a storage account in the same region as each vault'],
    answer: [0, 1],
    explanation: "Backup reports read from **Log Analytics**, so each vault needs a **diagnostic setting** to a workspace (Azure Policy can deploy them at scale), using **resource-specific** tables such as CoreAzureBackup and AddonAzureBackupJobs. The workspace can be in **any region and subscription**, so one workspace can serve both regions. The MARS agent backs up Windows machines; it has nothing to do with reporting. Storage accounts aren't a source for the reports (the old Power BI path that used them is deprecated)." },
];

export default bank.map((item, i) => ({ id: `d5-${String(i + 1).padStart(3, '0')}`, ...item }));
