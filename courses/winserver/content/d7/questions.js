// Domain 7 question bank: Monitor and troubleshoot Windows Server environments.
// Exhibits use String.raw so Windows paths and counter paths keep their backslashes.
export default [
  // ---------------------------------------------------------------- 7.1
  {
    id: 'd7-001',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You have a server named Server1 that runs Windows Server 2025. Server1 is a virtual machine with four virtual processors and 16 GB of RAM. Users report that an application hosted on Server1 responds slowly. You run the command shown in the exhibit. Which resource is the bottleneck on Server1?",
    exhibit: String.raw`PS C:\> Get-Counter -ComputerName Server1 -Counter '\Processor(_Total)\% Processor Time','\System\Processor Queue Length','\Memory\Available MBytes','\PhysicalDisk(_Total)\Avg. Disk sec/Read' -SampleInterval 5 -MaxSamples 1

Timestamp                 CounterSamples
---------                 --------------
10/29/2026 10:42:15 AM    \\server1\processor(_total)\% processor time :
                          98.1204785

                          \\server1\system\processor queue length :
                          17

                          \\server1\memory\available mbytes :
                          9842

                          \\server1\physicaldisk(_total)\avg. disk sec/read :
                          0.0031`,
    options: [
      'Memory',
      'Processor',
      'Disk',
      'Network',
    ],
    answer: [1],
    explanation: "**Processor** is the bottleneck. `% Processor Time` is at 98% and 17 threads are waiting in the processor queue, more than four per logical processor (the common guidance is to investigate above about two per logical processor when sustained).\n\n- **Memory** is fine: about 9.8 GB of 16 GB is available.\n- **Disk** read latency is 3.1 ms, which is healthy.\n- **Network** isn't measured here and nothing points to it; the CPU evidence alone explains the symptom.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-002',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You have a server named Server2 that runs Windows Server 2025 and has 32 GB of RAM. Server2 hosts SQL Server and an IIS application. Performance degrades during business hours. You capture the Performance Monitor report shown in the exhibit. What should you do to resolve the issue?",
    exhibit: String.raw`\\SERVER2
   Memory
      % Committed Bytes In Use              96.412
      Available MBytes                     412.000
      Pages/sec                          2,814.553
   PhysicalDisk                       _Total
      Avg. Disk sec/Read                     0.006
      Avg. Disk sec/Write                    0.004
   Processor                          _Total
      % Processor Time                      31.274
   Process                            sqlservr
      Private Bytes                 24,102,617,088
   Process                            w3wp
      Private Bytes                  5,912,334,336`,
    options: [
      'Add virtual processors to Server2.',
      'Move the paging file to a faster volume.',
      'Increase the memory available to Server2, or cap the memory that SQL Server is allowed to use.',
      'Replace the disks that host the SQL Server data files.',
    ],
    answer: [2],
    explanation: "The server is short of **memory**: only 412 MB of 32 GB is available, 96% of the commit limit is used, and paging is heavy. `sqlservr` alone holds about 24 GB of private bytes, so either add RAM or set SQL Server's maximum server memory so IIS and the OS keep enough.\n\n- **Adding processors** doesn't help; CPU is at 31%.\n- **Moving the paging file** treats the symptom, not the cause; disk latency is already low (4-6 ms).\n- **Replacing disks** is unnecessary because disk latency is healthy.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-003',
    topic: '7.1',
    type: 'single',
    difficulty: 3,
    stem: "You have a Hyper-V host named HV1 that runs Windows Server 2025. HV1 hosts 20 virtual machines. Users report that VM5 is slow, but `% Processor Time` inside VM5 averages 40%. You need to determine whether VM5 is slow because HV1 has insufficient physical CPU capacity. Which counter should you examine?",
    options: [
      "`\\Processor(_Total)\\% Processor Time` inside VM5",
      "`\\Hyper-V Hypervisor Logical Processor(_Total)\\% Total Run Time` on HV1",
      "`\\Processor(_Total)\\% Processor Time` in the management OS of HV1",
      "`\\System\\Processor Queue Length` inside VM5",
    ],
    answer: [1],
    explanation: "On a Hyper-V host, `Hyper-V Hypervisor Logical Processor(_Total)\\% Total Run Time` shows how busy the **physical** logical processors are across all partitions. Guest counters only see the virtual processors' time, so they can't reveal host contention.\n\n- **% Processor Time inside VM5** is the value you already have; it can't show that VM5 is waiting for physical CPU.\n- **% Processor Time in the management OS** shows only the root partition's virtual processors, not the load from all guests.\n- **Processor Queue Length inside VM5** measures threads waiting for VM5's virtual processors, again a guest-only view.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-004',
    topic: '7.1',
    type: 'multi',
    difficulty: 2,
    stem: "You have a server named Server3 that runs Windows Server 2025. You have a data collector set named Detail-CPU that logs 40 processor, process and thread counters at a 1-second interval. You need Detail-CPU to run only when `\\Processor(_Total)\\% Processor Time` exceeds 90%, to keep log volume low. Which two actions should you perform? (Choose two.) Each correct answer presents part of the solution.",
    options: [
      "Create a data collector set that contains a performance counter alert for `\\Processor(_Total)\\% Processor Time` above 90.",
      "On the alert's Alert Action tab, configure the alert to start the Detail-CPU data collector set.",
      "Configure Data Manager on Detail-CPU to delete the oldest data first.",
      "Add an event trace data collector for the kernel provider to Detail-CPU.",
      "Schedule the built-in System Performance data collector set to run every hour.",
      "Enable the CPU capacity forecasting capability of System Insights.",
    ],
    answer: [0, 1],
    explanation: "A **performance counter alert** watches the counter against the threshold, and its **Alert Action** can **start another data collector set**. Together they start Detail-CPU only when CPU is above 90%.\n\n- **Data Manager** controls retention of existing logs; it doesn't decide when collection starts.\n- An **event trace collector** adds more data; it doesn't add a trigger.\n- **Scheduling System Performance** collects on a timer, not on a threshold.\n- **System Insights** forecasts long-term CPU trends; it doesn't react to a short spike.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-005',
    topic: '7.1',
    type: 'fill',
    difficulty: 1,
    stem: "You need to create the same performance counter data collector set on 40 servers that run Windows Server 2025. You plan to run a script from your management server without signing in to each server. Which built-in command-line tool should the script use? (Enter the tool name.)",
    answer: ['logman', 'logman.exe'],
    explanation: "`logman` creates, starts, stops and queries data collector sets, and its `-s` parameter targets a remote computer, for example `logman create counter Baseline -s Server7 -c \"\\Processor(_Total)\\% Processor Time\" -si 00:00:30`. `relog` only converts or trims existing logs, and `typeperf` writes counters to the console or a file but doesn't create data collector sets.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-006',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You run the commands shown in the exhibit to create a baseline on a server named APP1. The data collector set will run for several months. What happens when the log file reaches 512 MB?",
    exhibit: String.raw`C:\> logman create counter Baseline-App -s APP1 -c "\Processor(_Total)\% Processor Time" "\Memory\Available MBytes" -si 00:00:30 -f bincirc -max 512 -o C:\PerfLogs\Baseline-App
The command completed successfully.

C:\> logman start Baseline-App -s APP1
The command completed successfully.`,
    options: [
      'The data collector set stops and must be restarted manually.',
      'A new log file is created and the previous file is kept.',
      'New samples overwrite the oldest samples in the same file.',
      'The log file is compressed and collection continues in the same file.',
    ],
    answer: [2],
    explanation: "`-f bincirc` creates a **circular binary log** and `-max 512` caps it at 512 MB, so once the file is full the newest samples overwrite the oldest ones. That's ideal for an always-on baseline because the last weeks of data are always available.\n\n- Collection would **stop** at the size limit with a plain `bin` format and no restart option.\n- A **new file** per period requires a stop condition with restart (or `-cnf`), not `bincirc`.\n- Performance logs aren't **compressed** automatically.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-007',
    topic: '7.1',
    type: 'single',
    difficulty: 1,
    stem: "Your network contains an AD DS domain named contoso.com. A help desk user named User1 must be able to create and schedule data collector sets on a server named Server4. The solution must follow the principle of least privilege. To which group on Server4 should you add User1?",
    options: [
      'Performance Monitor Users',
      'Performance Log Users',
      'Event Log Readers',
      'Administrators',
    ],
    answer: [1],
    explanation: "Members of **Performance Log Users** can create, schedule and run data collector sets (performance logs and alerts) without being administrators.\n\n- **Performance Monitor Users** can view live counters but can't create logs.\n- **Event Log Readers** grants read access to event logs, not performance logging.\n- **Administrators** works but violates least privilege.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-008',
    topic: '7.1',
    type: 'match',
    difficulty: 1,
    stem: "You are building data collector sets in Performance Monitor on Windows Server 2025. Match each data collector type to what it captures.",
    pairs: [
      ['Performance counter data collector', 'Counter values sampled at a fixed interval into a log'],
      ['Event trace data collector', 'Events from ETW providers for detailed component tracing'],
      ['System configuration information', 'The values of specified registry keys'],
      ['Performance counter alert', 'A threshold check that triggers an action when crossed'],
    ],
    explanation: "- **Performance counter data collector**: samples counters (for example every 15 seconds) into `.blg`, CSV, TSV or SQL.\n- **Event trace data collector**: records Event Tracing for Windows (ETW) provider events, used for driver or component deep dives.\n- **System configuration information**: records registry key values so you know the configuration at the time of the capture.\n- **Performance counter alert**: compares a counter to a threshold and can log an event, start a data collector set or run a task.",
    lesson: '7.1-perfmon-data-collector-sets',
  },
  {
    id: 'd7-009',
    topic: '7.1',
    type: 'multi',
    difficulty: 2,
    stem: "You manage 30 on-premises servers that run Windows Server 2025 by using Windows Admin Center. The servers are Azure Arc-enabled and the Azure Monitor Agent sends their performance counters to a Log Analytics workspace. You need administrators to receive an email when any server's CPU usage stays above 90% for 15 minutes. Which two components should you configure? (Choose two.) Each correct answer presents part of the solution.",
    options: [
      'An Azure Monitor log search alert rule that queries the Perf table',
      'An action group that contains an email action',
      'Notification settings on the Windows Admin Center gateway',
      'A performance counter alert data collector set on each server',
      'A System Insights remediation action for CPU capacity forecasting',
    ],
    answer: [0, 1],
    explanation: "Windows Admin Center has no alerting engine of its own; alerts come from **Azure Monitor**. A **log search alert rule** evaluates the CPU data in the `Perf` table, and an **action group** delivers the email.\n\n- WAC gateway **notification settings** don't provide threshold-based email alerts.\n- A **performance counter alert** data collector set can log an event or start a task, but doesn't send email and must be built per server.\n- A **System Insights** action runs on long-term forecasts, not on a 15-minute threshold.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-010',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You have a file server named FS1 that runs Windows Server 2025 and has three data volumes. You run the command shown in the exhibit. The status description of the result reports that the forecast exceeds the available capacity for one of the three volumes. What does the result indicate?",
    exhibit: String.raw`PS C:\> (Get-InsightsCapabilityResult -Name "Volume consumption forecasting").Status
Warning`,
    options: [
      'At least one volume is forecast to run out of space within the next 7 days.',
      'At least one volume is forecast to run out of space within the next 30 days.',
      'At least one volume is already full.',
      'There isn\'t enough historical data to make a prediction for one volume.',
    ],
    answer: [1],
    explanation: "For the default System Insights forecasting capabilities, **Warning** means the forecast exceeds available capacity **within the next 30 days**. When several volumes are forecast, the overall status is the most severe one.\n\n- **Within 7 days** is the **Critical** status.\n- System Insights forecasts future usage; it doesn't report current fullness as a status.\n- Not enough data produces the **None** status.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-011',
    topic: '7.1',
    type: 'fill',
    difficulty: 2,
    stem: "You have a server named Server5 that runs Windows Server 2025. You need System Insights to run the script C:\\Scripts\\Cleanup.ps1 automatically whenever the Volume consumption forecasting capability returns a Critical status. Which cmdlet should you use? (Enter the cmdlet name.)",
    answer: ['Set-InsightsCapabilityAction'],
    explanation: "`Set-InsightsCapabilityAction -Name \"Volume consumption forecasting\" -Type Critical -Action \"C:\\Scripts\\Cleanup.ps1\" -ActionCredential $cred` registers a remediation script for a status. `Set-InsightsCapabilitySchedule` changes when the capability runs, and `Invoke-InsightsCapability` runs a prediction once; neither runs a script.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-012',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You deploy a new server named Server6 that runs Windows Server 2025. Three days later you run the command shown in the exhibit. Why doesn't the capability return a forecast?",
    exhibit: String.raw`PS C:\> Invoke-InsightsCapability -Name "CPU capacity forecasting" -Confirm:$false
PS C:\> (Get-InsightsCapabilityResult -Name "CPU capacity forecasting").Status
None`,
    options: [
      'System Insights must first be installed by using Windows Admin Center.',
      'Server6 must be connected to Azure Monitor before System Insights can make predictions.',
      'System Insights needs more history; no prediction is made with five or fewer days of data.',
      'The CPU capacity forecasting capability is disabled by default.',
    ],
    answer: [2],
    explanation: "The default forecasting capabilities make **no prediction with 0-5 days of data**, so a three-day-old server returns **None**. They use a simple linear trend until about three weeks of data exist, then an autoregressive model.\n\n- System Insights is **preinstalled** on Windows Server and is managed from PowerShell as well as WAC.\n- It runs **entirely locally**; Azure Monitor is optional for aggregating its events.\n- The four default capabilities are **enabled by default**, and the invoke succeeded.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-013',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You have a server named Server1 that runs Windows Server 2025. You run the command shown in the exhibit. You need to increase the maximum size of the Security log to 1 GB. Events must continue to be overwritten as needed. Which command should you run?",
    exhibit: String.raw`C:\> wevtutil gl Security
name: Security
enabled: true
type: Admin
owningPublisher:
isolation: Custom
channelAccess: O:BAG:SYD:(A;;0xf0005;;;SY)(A;;0x5;;;BA)(A;;0x1;;;S-1-5-32-573)
logging:
  logFileName: %SystemRoot%\System32\Winevt\Logs\Security.evtx
  retention: false
  autoBackup: false
  maxSize: 20971520
publishing:
  fileMax: 1`,
    options: [
      'wevtutil sl Security /ms:1048576',
      'wevtutil sl Security /ms:1073741824',
      'wevtutil sl Security /rt:true /ms:1073741824',
      'Limit-EventLog -LogName Security -MaximumSize 1GB -OverflowAction DoNotOverwrite',
    ],
    answer: [1],
    explanation: "`wevtutil sl` sets the maximum size with `/ms` in **bytes**; 1 GB is 1,073,741,824 bytes. The exhibit's `maxSize: 20971520` (20 MB) confirms the unit, and `retention: false` means the log already overwrites as needed, so only the size changes.\n\n- `/ms:1048576` is 1 MB, not 1 GB (that's the value in KB).\n- `/rt:true` turns on retention, so the log would stop overwriting events.\n- `-OverflowAction DoNotOverwrite` also stops overwriting, which violates the requirement.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-014',
    topic: '7.1',
    type: 'multi',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. You need to forward Security log events from 200 member servers to a server named COLLECT1 by using a source-initiated subscription. WinRM is already enabled on all servers. Which three actions should you perform? (Choose three.) Each correct answer presents part of the solution.",
    options: [
      'On COLLECT1, run `wecutil qc` and create a source-initiated subscription.',
      'Configure a GPO that enables **Configure target Subscription Manager** with the address of COLLECT1 and link it to the servers.',
      'Add the NETWORK SERVICE account to the Event Log Readers group on each source server.',
      "Add COLLECT1's computer account to the Event Log Readers group on each source server.",
      'Set the subscription delivery optimization to Minimize Bandwidth.',
      'Add each source server to the subscription on COLLECT1 by name.',
    ],
    answer: [0, 1, 2],
    explanation: "A source-initiated subscription needs the **Windows Event Collector** configured on COLLECT1 (`wecutil qc`) with the subscription, a **GPO (Configure target Subscription Manager)** that tells sources where the collector is, and, because forwarding runs as Network Service, **NETWORK SERVICE in Event Log Readers** on each source so it can read the Security log.\n\n- Adding the **collector's computer account** to Event Log Readers is the collector-initiated model.\n- **Minimize Bandwidth** is an optional delivery choice, not a requirement.\n- **Adding sources by name** is how collector-initiated subscriptions work; source-initiated subscriptions use computer groups.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-015',
    topic: '7.1',
    type: 'single',
    difficulty: 1,
    stem: "You have an event subscription that forwards critical events from domain controllers to a collector named COLLECT1. Events currently take up to 15 minutes to arrive. You need events to arrive within about one minute. Which delivery optimization option should you configure?",
    options: [
      'Normal',
      'Minimize Bandwidth',
      'Minimize Latency',
      'Pull with a 15-minute heartbeat',
    ],
    answer: [2],
    explanation: "**Minimize Latency** uses push delivery with a 30-second batch timeout, so events arrive within about a minute.\n\n- **Normal** uses pull mode with a 15-minute batch timeout, which is the current behaviour.\n- **Minimize Bandwidth** pushes with a 6-hour batch timeout, which is slower still.\n- Pull with a 15-minute heartbeat isn't a built-in option and wouldn't reduce latency.",
    lesson: '7.1-wac-insights-event-logs',
  },
  {
    id: 'd7-016',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You configure a data collection rule (DCR) for Azure Arc-enabled servers. The exhibit shows the Windows event log section of the DCR. Which events will the Azure Monitor Agent collect?",
    exhibit: String.raw`"dataSources": {
  "windowsEventLogs": [
    {
      "name": "eventLogsDataSource",
      "streams": [ "Microsoft-Event" ],
      "xPathQueries": [
        "System!*[System[(Level=1 or Level=2)]]",
        "Application!*[System[(EventID=1000)]]"
      ]
    }
  ]
}`,
    options: [
      'Error and Warning events from the System log, and event ID 1000 from the Application log',
      'Critical and Error events from the System log, and event ID 1000 at any level from the Application log',
      'Event ID 1000 from both the System and Application logs',
      'All System events, and Critical event ID 1000 from the Application log',
    ],
    answer: [1],
    explanation: "In event XPath, **Level=1 is Critical** and **Level=2 is Error** (3 is Warning, 4 Information). The first query collects Critical and Error System events; the second collects event ID 1000 from Application with no level filter.\n\n- Warning would be **Level=3**, which isn't included.\n- The EventID filter applies only to the **Application** query.\n- The System query is filtered by level, so it doesn't collect all System events.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-017',
    topic: '7.1',
    type: 'multi',
    difficulty: 2,
    stem: "You have an on-premises server named Server8 that runs Windows Server 2025. You need to collect Windows event logs and performance counters from Server8 into a Log Analytics workspace by using a data collection rule. Which two components must be installed on Server8? (Choose two.)",
    options: [
      'Azure Connected Machine agent',
      'Azure Monitor Agent',
      'Log Analytics agent (Microsoft Monitoring Agent)',
      'Dependency agent',
      'Windows Admin Center gateway',
    ],
    answer: [0, 1],
    explanation: "Non-Azure machines must be **Azure Arc-enabled** (Connected Machine agent) before the **Azure Monitor Agent** can be installed as an extension and associated with a DCR.\n\n- The **Log Analytics agent (MMA)** was retired on 31 August 2024 and doesn't use DCRs.\n- The **Dependency agent** is needed only for the VM insights Map feature.\n- A **WAC gateway** isn't required on the monitored server for Azure Monitor collection.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-018',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You have an Azure virtual machine named VM1 that runs Windows Server 2025. You install the Azure Monitor Agent on VM1. One hour later, the query `Heartbeat | where Computer == \"VM1\"` returns no results in your Log Analytics workspace. You run the commands shown in the exhibit. What should you do?",
    exhibit: String.raw`PS C:\> Get-AzVMExtension -ResourceGroupName RG1 -VMName VM1 | Select-Object Name, Publisher, ProvisioningState

Name                     Publisher               ProvisioningState
----                     ---------               -----------------
AzureMonitorWindowsAgent Microsoft.Azure.Monitor Succeeded

PS C:\> $vm = Get-AzVM -ResourceGroupName RG1 -Name VM1
PS C:\> Get-AzDataCollectionRuleAssociation -ResourceUri $vm.Id
PS C:\>`,
    options: [
      'Remove and reinstall the Azure Monitor Agent extension.',
      'Install the Log Analytics agent and connect it to the workspace.',
      'Create a data collection rule that sends data to the workspace and associate it with VM1.',
      'Enable boot diagnostics on VM1.',
    ],
    answer: [2],
    explanation: "The agent installed successfully, but VM1 has **no data collection rule association**. The Azure Monitor Agent collects and sends nothing (not even heartbeats to a workspace) until a DCR tells it what to collect and where to send it.\n\n- **Reinstalling** a healthy extension doesn't add a destination.\n- The **Log Analytics agent** is retired and the wrong answer for new deployments.\n- **Boot diagnostics** captures console screenshots and serial logs; it's unrelated to Log Analytics.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-019',
    topic: '7.1',
    type: 'match',
    difficulty: 2,
    stem: "You monitor Azure VMs and Azure Arc-enabled servers that run Windows Server 2025. Match each requirement to the Azure Monitor feature you should use.",
    pairs: [
      ['Alert in near real time when the host CPU metric of an Azure VM exceeds 85%', 'Metric alert rule'],
      ['Alert when event ID 4625 appears more than 20 times in 5 minutes on an on-premises Arc-enabled server', 'Log search alert rule'],
      ['Alert when someone deletes a virtual machine in RG1', 'Activity log alert rule'],
      ['Suppress all notifications for RG1 every Saturday from 01:00 to 05:00', 'Alert processing rule'],
    ],
    explanation: "- **Metric alerts** evaluate platform metrics such as `Percentage CPU` in near real time and need no agent on Azure VMs.\n- **Log search alerts** run a KQL query (here against the `Event` or `SecurityEvent` table) collected by AMA; on-premises servers have no host metrics.\n- **Activity log alerts** fire on Azure Resource Manager operations such as a VM delete, and on Service Health or Resource Health events.\n- **Alert processing rules** suppress notifications (or add action groups) for a scope and schedule without editing each alert rule.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-020',
    topic: '7.1',
    type: 'single',
    difficulty: 3,
    stem: "You create a log search alert rule in Azure Monitor that uses the query shown in the exhibit. The rule runs every 5 minutes. Which machines will cause the alert to fire?",
    exhibit: String.raw`Heartbeat
| where TimeGenerated > ago(1d)
| summarize LastHeartbeat = max(TimeGenerated) by Computer, _ResourceId
| where LastHeartbeat < ago(10m)`,
    options: [
      'Machines that sent more than 10 heartbeats in the last day',
      'Machines that sent at least one heartbeat in the last day but none in the last 10 minutes',
      'All machines that sent a heartbeat in the last 10 minutes',
      'Machines that have never sent a heartbeat to the workspace',
    ],
    answer: [1],
    explanation: "The query keeps only heartbeats from the last day, takes each machine's most recent one, and returns machines whose latest heartbeat is **older than 10 minutes**. So it flags machines that were reporting in the last 24 hours but have gone quiet.\n\n- `max(TimeGenerated)` finds the latest time; it doesn't count heartbeats.\n- Machines that sent a heartbeat in the last 10 minutes are **filtered out** by the last line.\n- Machines that never reported (or have been silent for more than a day) have no rows after the first filter, so they **don't** appear. That's a limitation to remember when you design this alert.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-021',
    topic: '7.1',
    type: 'single',
    difficulty: 2,
    stem: "You enable VM insights for 15 Azure VMs that run Windows Server 2025. The Performance view shows CPU, memory and disk charts for all VMs, but the Map view shows no data. What should you do?",
    options: [
      'Install the Log Analytics agent on the VMs.',
      'Enable processes and dependencies (Map) in the VM insights configuration so that the Dependency agent is installed.',
      'Create a metric alert rule for each VM.',
      'Enable boot diagnostics and guest-level diagnostics on each VM.',
    ],
    answer: [1],
    explanation: "VM insights performance data needs only the **Azure Monitor Agent** and the VM insights DCR. The **Map** feature additionally requires the **Dependency agent**, which is installed when you enable processes and dependencies.\n\n- The **Log Analytics agent** is retired and isn't needed with AMA.\n- **Metric alerts** don't populate Map data.\n- **Boot diagnostics** and the legacy diagnostics extension don't feed VM insights Map.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-022',
    topic: '7.1',
    type: 'order',
    difficulty: 2,
    stem: "You have an on-premises server named Server9 that runs Windows Server 2025. You need an email alert when free space on drive C: of Server9 falls below 10%. An action group that sends email already exists. In which order should you perform the actions?",
    items: [
      'Install the Azure Connected Machine agent on Server9 and connect it to Azure Arc.',
      'Create a data collection rule that collects \\LogicalDisk(C:)\\% Free Space to a Log Analytics workspace and associate it with Server9.',
      'Query the Perf table in the workspace to confirm that Server9 is sending the counter.',
      'Create a log search alert rule that uses the Perf query and the existing action group.',
    ],
    explanation: "An on-premises server must be **Arc-enabled** first. Associating a **DCR** installs the Azure Monitor Agent and starts collection. **Confirming data** in `Perf` proves the pipeline works and gives you the query for the **log search alert rule**, which then uses the existing action group to send email.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },
  {
    id: 'd7-023',
    topic: '7.1',
    type: 'fill',
    difficulty: 2,
    stem: "You enable VM insights (logs-based) on Azure VMs. In which Log Analytics table does VM insights store its standard guest performance data, such as Processor UtilizationPercentage and Memory AvailableMB? (Enter the table name.)",
    answer: ['InsightsMetrics'],
    explanation: "VM insights writes its standard performance set to **InsightsMetrics**, with `Origin == \"vm.azm.ms\"` and namespaces such as `Processor`, `Memory`, `LogicalDisk` and `Network`. Counters you add through your own DCRs go to the `Perf` table, and the Map feature writes to tables such as `VMConnection` and `VMBoundPort`.",
    lesson: '7.1-azure-monitor-dcr-alerts-vminsights',
  },

  // ---------------------------------------------------------------- 7.2
  {
    id: 'd7-024',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have a server named APP1 that runs Windows Server 2025. An application on APP1 can't connect to a SQL Server instance on a server named SQL1. The DNS A record for SQL1 is correct. You run the command shown in the exhibit on APP1. What should you do next?",
    exhibit: String.raw`PS C:\> Test-NetConnection -ComputerName SQL1 -Port 1433
WARNING: TCP connect to (10.0.2.15 : 1433) failed


ComputerName           : SQL1
RemoteAddress          : 10.0.2.15
RemotePort             : 1433
InterfaceAlias         : Ethernet
SourceAddress          : 10.0.1.40
PingSucceeded          : True
PingReplyDetails (RTT) : 1 ms
TcpTestSucceeded       : False`,
    options: [
      'Correct the default gateway on APP1.',
      'Create a new DNS A record for SQL1.',
      'On SQL1, verify that SQL Server is listening on TCP 1433 and that Windows Firewall allows inbound TCP 1433.',
      'Allow inbound ICMP echo requests on SQL1.',
    ],
    answer: [2],
    explanation: "Name resolution and routing work: SQL1 resolves to 10.0.2.15 and answers ping. Only the **TCP port test fails**, so either the service isn't listening on 1433 (stopped, or using a dynamic port) or a firewall is blocking that port.\n\n- The **gateway** is fine because ping succeeds across subnets.\n- **DNS** is already correct.\n- **ICMP** already works and isn't what the application uses.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-025',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have a file server named FS1 that is a member of an AD DS domain named contoso.com. FS1 restarted during a switch outage. The network has been restored and FS1 can now reach the domain controllers, but clients can't connect to its shares. The Windows Firewall rule that allows SMB on FS1 applies only to the Domain profile. You run the command shown in the exhibit. What should you do?",
    exhibit: String.raw`PS C:\> Get-NetConnectionProfile

Name             : Unidentified network
InterfaceAlias   : Ethernet
InterfaceIndex   : 6
NetworkCategory  : Public
IPv4Connectivity : LocalNetwork
IPv6Connectivity : NoTraffic`,
    options: [
      'Run `Set-NetConnectionProfile -InterfaceAlias Ethernet -NetworkCategory DomainAuthenticated`.',
      'Restart the Network Location Awareness service on FS1.',
      'Remove FS1 from the domain and join it again.',
      'Disable Windows Firewall on FS1.',
    ],
    answer: [1],
    explanation: "FS1 booted while no DC was reachable, so **Network Location Awareness** classified the network as **Public** and the Domain-scoped SMB rule doesn't apply. Now that the DCs are reachable, restarting NLA (`Restart-Service NlaSvc -Force`) lets it re-detect the domain and switch to **DomainAuthenticated**.\n\n- You **can't set DomainAuthenticated** manually; `Set-NetConnectionProfile` accepts only Public or Private.\n- **Rejoining** the domain is unnecessary; the computer account is fine.\n- **Disabling the firewall** removes protection instead of fixing the cause.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-026',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "Users on a server named Server1 report that the web application app1.contoso.com opens the old version of the site. The new site runs at 10.0.5.20. You already ran `ipconfig /flushdns` on Server1, but the problem persists. You run the commands shown in the exhibit on Server1. What should you do?",
    exhibit: String.raw`C:\> nslookup app1.contoso.com
Server:  dc1.contoso.com
Address:  10.0.0.10

Name:    app1.contoso.com
Address:  10.0.5.20

C:\> ping app1.contoso.com -n 1

Pinging app1.contoso.com [10.0.9.9] with 32 bytes of data:
Reply from 10.0.9.9: bytes=32 time<1ms TTL=128`,
    options: [
      'Delete the stale app1 A record from the contoso.com zone on DC1.',
      'Remove the app1.contoso.com entry from the hosts file on Server1.',
      'Change the DNS client settings on Server1 to use DC2.',
      'Clear the DNS server cache on DC1.',
    ],
    answer: [1],
    explanation: "`nslookup` queries the DNS server directly and returns the correct address, but applications (and `ping`) use the Windows resolver, which loads **hosts file** entries into the client cache. Because flushing the cache didn't help, a hosts file entry for app1 pointing to 10.0.9.9 is the cause.\n\n- The **zone on DC1** is correct, as nslookup shows.\n- **Changing DNS servers** doesn't override the hosts file.\n- The **DNS server cache** isn't involved; DC1 already answers correctly.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-027',
    topic: '7.2',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. You promoted a new domain controller named DC2 last week. After the promotion, an administrator changed the DNS client settings on DC2. Clients never authenticate against DC2. DC1 (10.0.0.10) hosts the AD-integrated contoso.com and _msdcs.contoso.com zones. You run the commands shown in the exhibit. What should you do?",
    exhibit: String.raw`PS C:\> Resolve-DnsName -Name _ldap._tcp.dc._msdcs.contoso.com -Type SRV -Server 10.0.0.10

Name                                     Type   TTL   Section    NameTarget                     Priority Weight Port
----                                     ----   ---   -------    ----------                     -------- ------ ----
_ldap._tcp.dc._msdcs.contoso.com         SRV    600   Answer     dc1.contoso.com                0        100    389

PS C:\> Get-DnsClientServerAddress -CimSession DC2 -InterfaceAlias Ethernet -AddressFamily IPv4

InterfaceAlias               Interface Address ServerAddresses                                 PSComputerName
                             Index     Family
--------------               --------- ------- ---------------                                 --------------
Ethernet                             4 IPv4    {8.8.8.8}                                       DC2`,
    options: [
      'Transfer the PDC emulator role to DC2.',
      'Run `ipconfig /flushdns` on all client computers.',
      'Configure DC2 to use internal DNS servers such as 10.0.0.10, and then restart the Netlogon service on DC2.',
      'Create the DC2 SRV records manually in the contoso.com zone on DC1.',
    ],
    answer: [2],
    explanation: "DC2 points only to a **public DNS server**, so Netlogon on DC2 can't register its SRV records in the internal `_msdcs.contoso.com` zone; clients therefore never locate it. Point DC2 at internal DNS and restart **Netlogon** to re-register the records listed in `netlogon.dns`.\n\n- The **PDC emulator** role doesn't affect DC locator registration.\n- **Flushing client caches** doesn't help when the records don't exist.\n- **Manual SRV records** are error-prone, wouldn't cover all the records Netlogon needs, and leave DC2 unable to resolve internal names.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-028',
    topic: '7.2',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS forest named contoso.com. A domain controller named DC1 holds the PDC emulator role for the forest root domain. DC1 is a virtual machine on a Hyper-V host named HV1. HV1 is a workgroup server whose clock runs seven minutes fast. All computers in the forest show the wrong time. You run the command shown in the exhibit on DC1. You need DC1 to provide accurate time to the forest. What should you do?",
    exhibit: String.raw`C:\> w32tm /query /status
Leap Indicator: 0(no warning)
Stratum: 2 (secondary reference - syncd by (S)NTP)
Precision: -23 (119.209ns per tick)
Root Delay: 0.0000000s
Root Dispersion: 10.0000000s
ReferenceId: 0x564D4943 (source name:  "VMIC")
Last Successful Sync Time: 10/29/2026 9:58:41 AM
Source: VM IC Time Synchronization Provider
Poll Interval: 6 (64s)`,
    options: [
      'Run `w32tm /config /syncfromflags:domhier /update` on DC1.',
      'Stop DC1 from taking its time from HV1 (clear the Time synchronization integration service or disable the VMICTimeProvider), and then run `w32tm /config /manualpeerlist:"time.windows.com,0x8" /syncfromflags:manual /reliable:yes /update`.',
      'Run `w32tm /resync` on every member server.',
      'Disable the Time Synchronization integration service for DC1 and make no other changes.',
    ],
    answer: [1],
    explanation: "DC1 takes its time from the Hyper-V host (`Source: VM IC Time Synchronization Provider`), so the forest inherits HV1's error. Stop DC1 from taking time from the host and configure it, as the forest root PDC emulator, with a **reliable external NTP source**. Microsoft documents both ways to cut the host off: its virtual-DC guidance says to clear **Time synchronization** in the VM's Integration Services, while the Windows Time and Hyper-V teams prefer keeping the integration service (it fixes the clock after a start or saved-state resume) and setting the guest's `VMICTimeProvider` `Enabled` value to 0.\n\n- `domhier` is wrong for the **forest root** PDC emulator; it's the top of the hierarchy and has no parent to sync from.\n- **Resyncing members** just copies DC1's wrong time again.\n- **Disabling the integration service alone** leaves DC1 on its local clock with no external source.\n\nHV1 should also be configured to sync from a reliable source, but that isn't one of the options and wouldn't stop DC1 from depending on a single host's clock.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-029',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have a member server named Server2 in an AD DS domain named contoso.com. An old NTP appliance named ntp-old.contoso.com was decommissioned last month. Server2 must get its time from the domain hierarchy. You run the commands shown in the exhibit on Server2. What should you do?",
    exhibit: String.raw`C:\> w32tm /query /status
Leap Indicator: 3(not synchronized)
Stratum: 0 (unspecified)
Precision: -23 (119.209ns per tick)
Root Delay: 0.0000000s
Root Dispersion: 0.0000000s
ReferenceId: 0x00000000 (unspecified)
Last Successful Sync Time: unspecified
Source: Local CMOS Clock
Poll Interval: 10 (1024s)

C:\> w32tm /query /configuration | findstr /i "Type: NtpServer:"
Type: NTP (Local)
NtpServer: ntp-old.contoso.com,0x8 (Local)`,
    options: [
      'Run `w32tm /config /syncfromflags:domhier /update`, and then restart the Windows Time service.',
      'Run `w32tm /config /manualpeerlist:DC1.contoso.com /syncfromflags:manual /reliable:yes /update`.',
      'Run `w32tm /resync /force`.',
      'Run `w32tm /unregister`, and then restart Server2.',
    ],
    answer: [0],
    explanation: "Server2 was configured locally with `Type: NTP` pointing to a decommissioned appliance, so it isn't synchronized (`Leap Indicator: 3`, `Source: Local CMOS Clock`). Setting `/syncfromflags:domhier` returns it to **NT5DS** (domain hierarchy) and it syncs from a DC.\n\n- A manual peer with `/reliable:yes` makes a member server advertise itself as a reliable source, which is wrong for a member.\n- `/resync` still uses the dead peer.\n- `/unregister` removes the service registration and doesn't fix the configuration.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-030',
    topic: '7.2',
    type: 'fill',
    difficulty: 2,
    stem: "You configure the forest root PDC emulator by running the following command: `w32tm /config /manualpeerlist:\"time.windows.com,0x8\" /syncfromflags:manual /____:yes /update`. Which parameter name completes the command so that the PDC emulator advertises itself as a reliable time source? (Enter the parameter name without the slash.)",
    answer: ['reliable', '/reliable'],
    explanation: "`/reliable:yes` sets the server to advertise as a **reliable time source** (it sets the good-time-server flag in AnnounceFlags), which is what the forest root PDC emulator should do. `/syncfromflags:manual` tells it to use the manual peer list instead of the domain hierarchy.",
    lesson: '7.2-connectivity-dns-time',
  },
  {
    id: 'd7-031',
    topic: '7.2',
    type: 'order',
    difficulty: 2,
    stem: "You have a server named Server3 that runs Windows Server 2025. A cumulative update repeatedly fails to install. You suspect corruption in the component store. In which order should you perform the actions?",
    items: [
      'Run Get-WindowsUpdateLog and review the generated WindowsUpdate.log and CBS.log for the failure.',
      'Run DISM /Online /Cleanup-Image /RestoreHealth.',
      'Run sfc /scannow.',
      'Install the cumulative update again.',
    ],
    explanation: "Gather evidence first (**Get-WindowsUpdateLog** decodes the ETW traces; CBS.log explains servicing failures). Repair the **component store with DISM** next, because **SFC** repairs protected system files *from* the component store and can't fix them if the store itself is damaged. Then retry the update.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-032',
    topic: '7.2',
    type: 'single',
    difficulty: 3,
    stem: "You have a server named Server3 that runs Windows Server 2025 Standard (Desktop Experience). Server3 has no internet access and gets updates from WSUS. You run the command shown in the exhibit. You mount the matching Windows Server 2025 installation media as drive D:. Index 2 of install.wim is Standard (Desktop Experience). What should you run?",
    exhibit: String.raw`C:\> DISM /Online /Cleanup-Image /RestoreHealth

Deployment Image Servicing and Management tool
Version: 10.0.26100.1

Image Version: 10.0.26100.4652

[==========================100.0%==========================]
Error: 0x800f081f

The source files could not be found.
Use the "Source" option to specify the location of the files that are required to restore the feature.

The DISM log file can be found at C:\Windows\Logs\DISM\dism.log`,
    options: [
      'sfc /scannow',
      'DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase',
      'DISM /Online /Cleanup-Image /RestoreHealth /Source:WIM:D:\\sources\\install.wim:2 /LimitAccess',
      'Get-WindowsUpdateLog -LogPath C:\\Temp\\WU.log',
    ],
    answer: [2],
    explanation: "Error **0x800f081f** means DISM couldn't find repair files; a server with no internet can't download them. Point DISM at a **matching image** with `/Source:WIM:D:\\sources\\install.wim:2` and use `/LimitAccess` so it doesn't try Windows Update.\n\n- **SFC** depends on a healthy component store, which is the thing that's broken.\n- `/StartComponentCleanup /ResetBase` removes superseded components; it doesn't repair corruption.\n- **Get-WindowsUpdateLog** only produces a log.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-033',
    topic: '7.2',
    type: 'fill',
    difficulty: 1,
    stem: "You have a server that runs Windows Server 2025. You need to convert the Windows Update ETW trace files in C:\\Windows\\Logs\\WindowsUpdate into a readable WindowsUpdate.log file. Which PowerShell cmdlet should you run? (Enter the cmdlet name.)",
    answer: ['Get-WindowsUpdateLog'],
    explanation: "Since Windows Server 2016, the Windows Update client writes ETW traces instead of a text log. `Get-WindowsUpdateLog` merges and decodes them into `WindowsUpdate.log` (on the desktop by default, or at the path given by `-LogPath`).",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-034',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You use Azure Update Manager with a maintenance configuration named Patch-Sat that targets four machines. After the last maintenance window, only VM1 and SRV-ARC1 were patched. The exhibit shows the update settings of the machines. What should you do to ensure that the schedule patches all four machines?",
    exhibit: String.raw`Machine    Resource type              OS                    Patch orchestration
-------    -------------              --                    -------------------
VM1        Virtual machine            Windows Server 2025   Customer Managed Schedules
VM2        Virtual machine            Windows Server 2025   Automatic by OS (Windows Automatic Updates)
VM3        Virtual machine            Windows Server 2022   Manual updates
SRV-ARC1   Arc-enabled server         Windows Server 2025   -`,
    options: [
      'Install the Azure Monitor Agent on VM2 and VM3.',
      'Set the patch orchestration of VM2 and VM3 to Customer Managed Schedules.',
      'Set the patch orchestration of SRV-ARC1 to Customer Managed Schedules.',
      'Enable periodic assessment on VM2 and VM3.',
    ],
    answer: [1],
    explanation: "Scheduled patching for **Azure VMs** requires the **Customer Managed Schedules** orchestration, which sets `Patch mode = AutomaticByPlatform` and `BypassPlatformSafetyChecksOnUserSchedule = True`. VM2 and VM3 lack it, so the schedule skipped them.\n\n- Update Manager doesn't need the **Azure Monitor Agent**.\n- **Arc-enabled servers** have no orchestration prerequisite; SRV-ARC1 was patched.\n- **Periodic assessment** reports missing updates every 24 hours; it doesn't enable scheduled installs.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-035',
    topic: '7.2',
    type: 'multi',
    difficulty: 2,
    stem: "You have a server named Server4 that runs Windows Server 2025. Windows Update downloads fail repeatedly with hash mismatch errors. You need to reset the Windows Update download cache. Which two actions are part of the process? (Choose two.)",
    options: [
      'Stop the Windows Update (wuauserv), BITS and Cryptographic services.',
      'Rename the C:\\Windows\\SoftwareDistribution folder.',
      'Delete the contents of C:\\Windows\\WinSxS.',
      'Run chkdsk C: /r.',
      'Set the Windows Update service startup type to Disabled.',
    ],
    answer: [0, 1],
    explanation: "Resetting the cache means **stopping wuauserv, BITS and cryptsvc**, **renaming SoftwareDistribution** (and usually `catroot2`), then starting the services so Windows Update rebuilds them.\n\n- **WinSxS** is the component store; deleting from it breaks servicing. Use DISM to manage it.\n- **chkdsk /r** checks the file system and isn't part of resetting update components.\n- **Disabling** the service stops updates altogether.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-036',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have a file server named FS2 that runs Windows Server 2025. Users report that opening files on the E: volume is slow. You capture the Performance Monitor report shown in the exhibit. What is the most likely cause?",
    exhibit: String.raw`\\FS2
   Memory
      Available MBytes                  11,204.000
   Network Interface                  Microsoft Hyper-V Network Adapter
      Bytes Total/sec               14,322,118.000
      Current Bandwidth         10,000,000,000.000
   PhysicalDisk                       1 E:
      Avg. Disk sec/Read                     0.087
      Avg. Disk sec/Write                    0.142
      Avg. Disk Queue Length                38.611
   Processor                          _Total
      % Processor Time                      18.905`,
    options: [
      'Insufficient memory',
      'Insufficient processor capacity',
      'Network saturation',
      'The storage that hosts the E: volume',
    ],
    answer: [3],
    explanation: "Read latency is 87 ms and write latency 142 ms with a deep queue: far above the roughly 20-25 ms that warrants investigation, so the **storage behind E:** is the bottleneck.\n\n- About 11 GB of **memory** is available.\n- **CPU** is at 19%.\n- The **network** carries about 14 MB/s on a 10 Gbps adapter, roughly 1% utilization.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-037',
    topic: '7.2',
    type: 'single',
    difficulty: 3,
    stem: "You have an Azure virtual machine named VM1 that runs Windows Server 2025 and hosts a database on a data disk at LUN 0. Queries are slow during peak hours. The exhibit shows the maximum values of VM1's platform metrics for the last hour. What should you do?",
    exhibit: String.raw`Metric                                   Max (last 1 hour)
------                                   -----------------
Percentage CPU                           31 %
Available Memory Bytes                   9.2 GB
OS Disk IOPS Consumed Percentage         6 %
Data Disk IOPS Consumed Percentage       100 %   (LUN 0)
VM Uncached IOPS Consumed Percentage     41 %`,
    options: [
      'Resize VM1 to a VM size with higher uncached IOPS limits.',
      'Increase the size or performance tier of the data disk at LUN 0.',
      'Add memory to VM1 by resizing it to a memory-optimized size.',
      'Enable accelerated networking on VM1.',
    ],
    answer: [1],
    explanation: "The data disk at LUN 0 is consuming **100% of its own IOPS limit**, while the VM-level uncached limit is only at 41%. The **disk** is throttling, so move it to a larger size or higher performance tier (or a disk type with more provisioned IOPS).\n\n- A **larger VM** raises the VM-level cap, which isn't the limit being hit.\n- **Memory** and **CPU** have headroom.\n- **Accelerated networking** improves network performance, not managed disk IOPS.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-038',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have an Azure Arc-enabled server named SRV-ARC1 that runs Windows Server 2025. A deployment of the Azure Monitor Agent extension to SRV-ARC1 has been stuck in the Creating state for two hours. You run the command shown in the exhibit (output abbreviated). What should you do first?",
    exhibit: String.raw`C:\> azcmagent show
Resource Name                            : SRV-ARC1
Resource Group Name                      : RG1
Location                                 : eastus
Agent Status                             : Connected
Agent Last Heartbeat                     : 2026-10-29T15:12:07Z
...
Dependent Service Status
  Agent Service (himds)                  : running
  Azure Arc Proxy (arcproxy)             : stopped
  Extension Service (extensionservice)   : stopped
  GC Service (gcarcservice)              : running`,
    options: [
      'Start the Azure Arc Proxy service.',
      'Start the extension service on SRV-ARC1.',
      'Run `azcmagent disconnect` and then `azcmagent connect`.',
      'Install the Log Analytics agent on SRV-ARC1.',
    ],
    answer: [1],
    explanation: "The agent is connected, but the **extension service** that installs and manages extensions is **stopped**, so the deployment can't progress. Start it (for example `Start-Service extensionservice`), then retry or wait for the operation.\n\n- **Azure Arc Proxy** is used only in specific configurations; Microsoft's extension troubleshooting guidance says its status can be ignored.\n- **Reconnecting** is disruptive and unnecessary while the agent is connected.\n- The **Log Analytics agent** is retired and unrelated to the stuck extension.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-039',
    topic: '7.2',
    type: 'single',
    difficulty: 3,
    stem: "You have an on-premises server named SRV2 that runs Windows Server 2025 and is Azure Arc-enabled. Company policy blocks all direct outbound internet traffic; servers must use the proxy server proxy1.contoso.com on port 8080. SRV2 shows a status of Disconnected in the Azure portal. You run the command shown in the exhibit (output abbreviated). What should you do?",
    exhibit: String.raw`C:\> azcmagent check
INFO    Testing connectivity to endpoints that are needed to connect to Azure... This might take a few minutes.
+------------------------------------------------------+-----------+---------+-----+----------+
|                       ENDPOINT                       | REACHABLE | PRIVATE | TLS |  PROXY   |
+------------------------------------------------------+-----------+---------+-----+----------+
| https://agentserviceapi.guestconfiguration.azure.com | false     | false   |     | not used |
| https://eastus-gas.guestconfiguration.azure.com      | false     | false   |     | not used |
| https://gbl.his.arc.azure.com                        | false     | false   |     | not used |
| https://login.microsoftonline.com                    | false     | false   |     | not used |
| https://management.azure.com                         | false     | false   |     | not used |
+------------------------------------------------------+-----------+---------+-----+----------+`,
    options: [
      'Run `azcmagent config set proxy.url "http://proxy1.contoso.com:8080"`.',
      'Run `azcmagent connect` again with the same resource group and location.',
      'Run `azcmagent disconnect --force-local-only`.',
      'Run `azcmagent logs --full` and upload the file to Microsoft Support.',
    ],
    answer: [0],
    explanation: "Every endpoint is unreachable and the PROXY column shows **not used**: the Connected Machine agent isn't configured to use the required proxy. `azcmagent config set proxy.url` sets the agent's proxy, after which the agent can reach Azure and reconnect.\n\n- **Reconnecting** fails for the same reason: no route to Azure.\n- `disconnect --force-local-only` deletes the local connection state and is meant for cloned machines.\n- **Collecting logs** is diagnostic only and the cause is already clear.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-040',
    topic: '7.2',
    type: 'match',
    difficulty: 2,
    stem: "You troubleshoot extension problems on Azure VMs and Azure Arc-enabled servers that run Windows Server 2025. Match each log file to the information it contains.",
    pairs: [
      ['%ProgramData%\\GuestConfig\\ext_mgr_logs\\gc_ext.log', 'Arc extension manager install, upgrade and uninstall activity'],
      ['%ProgramData%\\AzureConnectedMachineAgent\\Log\\himds.log', 'Arc agent heartbeats and connection attempts'],
      ['C:\\WindowsAzure\\Logs\\WaAppAgent.log', 'Azure VM guest agent extension operations'],
      ['WindowsUpdateExtension.log in the Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension folder', 'Azure Update Manager patch assessment and installation on an Arc server'],
    ],
    explanation: "- **gc_ext.log** is the Arc extension service log, including download and package verification errors.\n- **himds.log** records the Hybrid Instance Metadata Service: heartbeats, connect/disconnect, and identity token requests.\n- **WaAppAgent.log** is the Azure VM Agent log for extension download, install and enable.\n- **WindowsUpdateExtension.log** (under `C:\\ProgramData\\GuestConfig\\extension_logs\\`) records Update Manager's patch actions on Arc-enabled Windows servers.",
    lesson: '7.2-updates-performance-extensions',
  },
  {
    id: 'd7-041',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have a server named Server1 that runs Windows Server 2025. A vendor engineer updated Server1's firmware last month. You run the command shown in the exhibit. You need to ensure that the C: volume is protected by BitLocker again. What should you do?",
    exhibit: String.raw`C:\> manage-bde -status C:
BitLocker Drive Encryption: Configuration Tool version 10.0.26100
Copyright (C) 2013 Microsoft Corporation. All rights reserved.

Volume C: []
[OS Volume]

    Size:                 126.45 GB
    BitLocker Version:    2.0
    Conversion Status:    Fully Encrypted
    Percentage Encrypted: 100.0%
    Encryption Method:    XTS-AES 128
    Protection Status:    Protection Off
    Lock Status:          Unlocked
    Identification Field: Unknown
    Key Protectors:
        TPM
        Numerical Password`,
    options: [
      'Run `Enable-BitLocker -MountPoint C: -TpmProtector`.',
      'Run `Add-BitLockerKeyProtector -MountPoint C: -TpmProtector`.',
      'Run `Resume-BitLocker -MountPoint C:`.',
      'Run `Unlock-BitLocker -MountPoint C: -RecoveryPassword <password>`.',
    ],
    answer: [2],
    explanation: "The volume is **fully encrypted** with TPM and recovery password protectors, but **Protection Off** shows that BitLocker was **suspended** (probably for the firmware update with no automatic resume). `Resume-BitLocker` re-enables the protectors.\n\n- **Enable-BitLocker** is for volumes that aren't encrypted yet.\n- A **TPM protector** already exists.\n- The volume is already **unlocked**; unlocking doesn't turn protection back on.",
    lesson: '7.2-disk-encryption-storage',
  },
  {
    id: 'd7-042',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have 20 physical servers that run Windows Server 2025 with BitLocker protecting the OS volume with a TPM protector. After last month's UEFI firmware update, six servers stopped at the BitLocker recovery screen. You need to prevent this during future firmware updates while keeping protection enabled the rest of the time. What should you do before each update?",
    options: [
      'Run `Suspend-BitLocker -MountPoint C: -RebootCount 1`.',
      'Run `Suspend-BitLocker -MountPoint C: -RebootCount 0`.',
      'Run `Disable-BitLocker -MountPoint C:`.',
      'Run `Clear-Tpm`.',
    ],
    answer: [0],
    explanation: "Firmware updates change the TPM measurements, so the TPM won't release the key and the server enters recovery. Suspending with **`-RebootCount 1`** lets the server boot once after the update and then **resumes protection automatically**.\n\n- `-RebootCount 0` suspends **indefinitely** until someone runs Resume-BitLocker.\n- **Disable-BitLocker** decrypts the whole volume.\n- **Clear-Tpm** erases TPM keys and would cause the very recovery you want to avoid.",
    lesson: '7.2-disk-encryption-storage',
  },
  {
    id: 'd7-043',
    topic: '7.2',
    type: 'multi',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Server5 runs Windows Server 2025 and its C: volume was encrypted with BitLocker before you configured Group Policy to store recovery information in AD DS. You need to store the existing recovery password of C: in AD DS. Which two commands can you use? (Choose two.) Each correct answer presents a complete solution.",
    options: [
      '`Backup-BitLockerKeyProtector -MountPoint C: -KeyProtectorId <ID of the recovery password protector>`',
      '`manage-bde -protectors -adbackup C: -id <ID of the recovery password protector>`',
      '`Enable-BitLockerAutoUnlock -MountPoint C:`',
      '`Resume-BitLocker -MountPoint C:`',
      '`Add-BitLockerKeyProtector -MountPoint C: -TpmProtector`',
    ],
    answer: [0, 1],
    explanation: "Both **`Backup-BitLockerKeyProtector`** and **`manage-bde -protectors -adbackup`** write an existing recovery password protector to the computer's object in AD DS (as an `msFVE-RecoveryInformation` child object).\n\n- **Auto-unlock** applies to data volumes and doesn't back anything up.\n- **Resume-BitLocker** re-enables protection only.\n- Adding a **TPM protector** doesn't store a recovery password in AD DS.",
    lesson: '7.2-disk-encryption-storage',
  },
  {
    id: 'd7-044',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have an Azure VM named VM2 that runs Windows Server 2022 and a key vault named KV1 in the same region and subscription. Enabling Azure Disk Encryption on VM2 fails immediately with an error stating that KV1 isn't enabled for disk encryption. What should you do?",
    options: [
      'Run `az keyvault update --name KV1 --enabled-for-disk-encryption true`.',
      'Move KV1 to a different resource group.',
      'Enable encryption at host on the subscription.',
      'Assign VM2 a public IP address.',
    ],
    answer: [0],
    explanation: "Azure Disk Encryption needs the key vault's **enabledForDiskEncryption** access policy setting so the platform can write the BitLocker secrets. Set it with `az keyvault update --enabled-for-disk-encryption true` (or **Azure Disk Encryption for volume encryption** in the portal).\n\n- The **resource group** doesn't matter; region and subscription do, and they already match.\n- **Encryption at host** is a separate feature (and Microsoft's replacement for ADE, which retires in September 2028); registering it doesn't fix ADE's key vault requirement.\n- ADE doesn't need a **public IP**.",
    lesson: '7.2-disk-encryption-storage',
  },
  {
    id: 'd7-045',
    topic: '7.2',
    type: 'order',
    difficulty: 3,
    stem: "You have a server named Server6 that runs Windows Server 2025 and has a storage pool named Pool1 with a two-way mirror virtual disk named Data1. You run the commands shown in the exhibit. A replacement disk named PhysicalDisk5 has already been added to Pool1. You need to restore resiliency and remove the failed disk safely. In which order should you run the commands?",
    exhibit: String.raw`PS C:\> Get-PhysicalDisk | Sort-Object FriendlyName | Format-Table FriendlyName, MediaType, OperationalStatus, HealthStatus, Usage

FriendlyName  MediaType OperationalStatus  HealthStatus Usage
------------  --------- -----------------  ------------ -----
PhysicalDisk1 HDD       OK                 Healthy      Auto-Select
PhysicalDisk2 HDD       OK                 Healthy      Auto-Select
PhysicalDisk3 HDD       Lost Communication Warning      Auto-Select
PhysicalDisk4 HDD       OK                 Healthy      Auto-Select
PhysicalDisk5 HDD       OK                 Healthy      Auto-Select

PS C:\> Get-VirtualDisk | Format-Table FriendlyName, ResiliencySettingName, OperationalStatus, HealthStatus

FriendlyName ResiliencySettingName OperationalStatus HealthStatus
------------ --------------------- ----------------- ------------
Data1        Mirror                Degraded          Warning`,
    items: [
      'Set-PhysicalDisk -FriendlyName PhysicalDisk3 -Usage Retired',
      'Repair-VirtualDisk -FriendlyName Data1',
      'Get-StorageJob (repeat until the repair job completes)',
      'Remove-PhysicalDisk -StoragePoolFriendlyName Pool1 -PhysicalDisks (Get-PhysicalDisk -FriendlyName PhysicalDisk3)',
    ],
    explanation: "**Retire** the failed disk so Storage Spaces stops placing data on it, **repair** the virtual disk so the missing copies are rebuilt on healthy disks (including PhysicalDisk5), **monitor** with `Get-StorageJob` until the repair completes and Data1 is Healthy, and only then **remove** the retired disk from the pool.",
    lesson: '7.2-disk-encryption-storage',
  },
  {
    id: 'd7-046',
    topic: '7.2',
    type: 'single',
    difficulty: 2,
    stem: "You have a server named Server7 that runs Windows Server 2025. A storage administrator presents a new SAN LUN to Server7. You need to create a writable volume on the LUN. You run the command shown in the exhibit. What should you run first?",
    exhibit: String.raw`PS C:\> Get-Disk | Format-Table Number, FriendlyName, OperationalStatus, IsOffline, IsReadOnly, PartitionStyle, Size

Number FriendlyName       OperationalStatus IsOffline IsReadOnly PartitionStyle   Size
------ ------------       ----------------- --------- ---------- --------------   ----
     0 Msft Virtual Disk  Online            False     False      GPT            127 GB
     1 CONTOSO SAN-LUN01  Offline           True      True       GPT              2 TB`,
    options: [
      '`Initialize-Disk -Number 1 -PartitionStyle GPT`',
      '`Set-Disk -Number 1 -IsOffline $false`, followed by `Set-Disk -Number 1 -IsReadOnly $false`',
      '`Set-StorageSetting -NewDiskPolicy OnlineAll`',
      '`Repair-Volume -DriveLetter E -OfflineScanAndFix`',
    ],
    answer: [1],
    explanation: "Disk 1 is already initialized as GPT but is **offline and read-only** (typical with the SAN policy for shared disks). Bring it online and clear the read-only flag with `Set-Disk`, then create the partition and volume.\n\n- **Initialize-Disk** fails on a disk that already has a partition style, and it requires the disk to be online.\n- **Set-StorageSetting** changes the policy for disks discovered later, not this one.\n- **Repair-Volume** needs an existing volume; there isn't one yet.",
    lesson: '7.2-disk-encryption-storage',
  },
  {
    id: 'd7-047',
    topic: '7.2',
    type: 'fill',
    difficulty: 2,
    stem: "You have a file server that runs Windows Server 2025. You need to scan the NTFS volume D: for corruption while the volume stays online and available to users. Which PowerShell cmdlet should you use? (Enter the cmdlet name.)",
    answer: ['Repair-Volume', 'Repair-Volume -Scan', 'Repair-Volume -DriveLetter D -Scan'],
    explanation: "`Repair-Volume -DriveLetter D -Scan` runs an **online scan** and logs any corruption for later repair, without taking the volume offline. `Repair-Volume -SpotFix` then fixes the logged problems with a brief offline period. `chkdsk D: /scan` is the command-line equivalent.",
    lesson: '7.2-disk-encryption-storage',
  },

  // ---------------------------------------------------------------- 7.3
  {
    id: 'd7-048',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS forest named contoso.com. A user account named User1 was deleted yesterday. You must restore User1 with all its group memberships. You have a system state backup of DC1 taken before the deletion. You run the commands shown in the exhibit. What should you do?",
    exhibit: String.raw`PS C:\> Get-ADOptionalFeature -Filter 'Name -like "Recycle*"' | Format-List Name, EnabledScopes

Name          : Recycle Bin Feature
EnabledScopes : {}

PS C:\> (Get-ADForest).ForestMode
Windows2016Forest`,
    options: [
      'Enable the AD Recycle Bin, and then run `Restore-ADObject` for User1.',
      'Restart DC1 in Directory Services Restore Mode, restore system state, and perform an authoritative restore of User1 by using ntdsutil.',
      'Run `Get-ADObject -Filter \'samAccountName -eq "User1"\' -IncludeDeletedObjects | Restore-ADObject`.',
      'Perform a non-authoritative restore of DC1 from the backup.',
    ],
    answer: [1],
    explanation: "`EnabledScopes : {}` shows the **Recycle Bin isn't enabled**, and enabling it now doesn't cover objects deleted earlier. To get User1 back with its memberships, perform an **authoritative restore** of the object in DSRM.\n\n- **Enabling the Recycle Bin** after the deletion can't restore User1.\n- `Restore-ADObject` without the Recycle Bin can only reanimate a **tombstone**, which has lost most attributes, including group memberships.\n- A **non-authoritative** restore would receive the deletion again from the other DCs through replication.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-049',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com with the AD Recycle Bin enabled. An administrator accidentally deleted the OU=Sales,DC=contoso,DC=com organizational unit, which contained 40 user accounts. You need to restore the OU and all its users by using PowerShell. What should you do?",
    options: [
      'Restore the user accounts first, then restore the Sales OU.',
      "Restore the Sales OU first, then restore the objects whose lastKnownParent is OU=Sales,DC=contoso,DC=com.",
      'Run `Restore-ADObject` against the Sales OU only; its child objects are restored automatically.',
      'Run `Enable-ADOptionalFeature` again to restore the OU tree.',
    ],
    answer: [1],
    explanation: "A deleted child can't be restored into a parent that is still deleted. Restore the **parent OU first**, then restore the children by filtering deleted objects on **lastKnownParent**, for example `Get-ADObject -SearchBase \"CN=Deleted Objects,DC=contoso,DC=com\" -Filter 'lastKnownParent -eq \"OU=Sales,DC=contoso,DC=com\"' -IncludeDeletedObjects | Restore-ADObject`.\n\n- Restoring **users first** fails because their parent doesn't exist.\n- Restoring the OU **doesn't** bring back its children automatically.\n- `Enable-ADOptionalFeature` turns the Recycle Bin on; it doesn't restore anything.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-050',
    topic: '7.3',
    type: 'fill',
    difficulty: 1,
    stem: "The AD Recycle Bin is enabled in your forest. You locate a deleted group by running `Get-ADObject -Filter 'samAccountName -eq \"Group1\"' -IncludeDeletedObjects`. Which cmdlet do you pipe the result to in order to restore the group? (Enter the cmdlet name.)",
    answer: ['Restore-ADObject'],
    explanation: "`Restore-ADObject` restores a deleted object from the Recycle Bin with all its attributes, including link values such as group memberships. Use `-TargetPath` to restore it to a different container.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-051',
    topic: '7.3',
    type: 'single',
    difficulty: 1,
    stem: "You plan to enable the AD Recycle Bin in an AD DS forest. What is the minimum forest functional level required?",
    options: [
      'Windows Server 2003',
      'Windows Server 2008',
      'Windows Server 2008 R2',
      'Windows Server 2016',
    ],
    answer: [2],
    explanation: "The AD Recycle Bin requires the **Windows Server 2008 R2** forest functional level (and that domains are at that level or higher). Enabling it is irreversible. Windows Server 2016 and later levels also qualify, but 2008 R2 is the minimum.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-052',
    topic: '7.3',
    type: 'order',
    difficulty: 3,
    stem: "Your network contains an AD DS forest with two domains. The AD Recycle Bin isn't enabled. The OU=Sales,DC=contoso,DC=com OU was deleted, and its users were members of groups in both domains. You have a system state backup of DC1 from before the deletion. You need to restore the OU and the users' group memberships. In which order should you perform the actions?",
    items: [
      'Restart DC1 in Directory Services Restore Mode and sign in with the DSRM Administrator account.',
      'Run wbadmin start systemstaterecovery with the backup version taken before the deletion.',
      'Run ntdsutil and mark OU=Sales,DC=contoso,DC=com as an authoritative subtree.',
      'Restart DC1 normally and allow the restored objects to replicate.',
      'Import the back-link .ldf file generated by ntdsutil by using ldifde.',
    ],
    explanation: "Restore in **DSRM**, then mark the subtree **authoritative before the first normal restart** (otherwise DC1 replicates the deletion in again). After a normal restart the restored objects replicate out. Finally, import the **.ldf** file ntdsutil generated so group memberships (back-links), including those in the other domain, are rebuilt.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-053',
    topic: '7.3',
    type: 'multi',
    difficulty: 2,
    stem: "You need to restart a domain controller named DC2 that runs Windows Server 2025 into Directory Services Restore Mode so that you can restore its system state. Which two methods can you use? (Choose two.) Each correct answer presents a complete solution.",
    options: [
      'Run `bcdedit /set {default} safeboot dsrepair` and restart DC2.',
      'In System Configuration (msconfig), select Safe boot with the Active Directory repair option and restart DC2.',
      'Run `Stop-Service NTDS -Force` on DC2.',
      'Run `bcdedit /set {default} bootstatuspolicy ignoreallfailures` and restart DC2.',
      'Run `Restart-Computer -ComputerName DC2 -Force`.',
    ],
    answer: [0, 1],
    explanation: "`bcdedit /set {default} safeboot dsrepair` and **msconfig > Safe boot > Active Directory repair** both make the next boot start in DSRM. Remember to remove the setting afterwards (`bcdedit /deletevalue {default} safeboot`, or clear it in msconfig).\n\n- **Stopping NTDS** uses restartable AD DS, which allows offline maintenance but not a system state restore.\n- `bootstatuspolicy ignoreallfailures` only suppresses the boot-failure recovery prompt.\n- `Restart-Computer` performs a normal restart, so AD DS starts as usual.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-054',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com with three domain controllers. On DC3, the Active Directory Domain Services service fails to start because of database corruption. DC1 and DC2 are healthy and no objects were deleted. You have a recent system state backup of DC3. You need to return DC3 to service with current data. What should you do?",
    options: [
      'Perform a non-authoritative restore of DC3 in Directory Services Restore Mode.',
      'Perform an authoritative restore of the entire database on DC3 by using `ntdsutil` with `restore database`.',
      'Perform an authoritative SYSVOL synchronization with DC3 as the primary member.',
      'Run `Restore-ADObject` on DC1 for every object on DC3.',
    ],
    answer: [0],
    explanation: "A **non-authoritative restore** puts back DC3's database from backup; when DC3 restarts, it gets a new invocation ID and **receives all newer changes** from DC1 and DC2.\n\n- An **authoritative restore of the whole database** would roll back every change made since the backup across the domain.\n- **SYSVOL** synchronization doesn't repair the AD database.\n- **Restore-ADObject** restores deleted objects; nothing was deleted.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-055',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com with three domain controllers. DC3 was offline for 72 days. DC1 and DC2 have correct, current SYSVOL contents. On DC3 you find the event shown in the exhibit. You need to restore SYSVOL replication on DC3 without affecting DC1 and DC2. What should you do?",
    exhibit: String.raw`Log Name:      DFS Replication
Source:        DFSR
Event ID:      4012
Level:         Error
Computer:      DC3.contoso.com
Description (abridged):
The DFS Replication service stopped replication on the folder with the following local path: C:\Windows\SYSVOL\domain. This server has been disconnected from other partners for 72 days, which is longer than the time allowed by the MaxOfflineTimeInDays parameter (60). DFS Replication considers the data in this folder to be stale, and this server will not replicate the folder until this error is corrected.`,
    options: [
      'On DC3, set msDFSR-Enabled to FALSE, force AD replication and run `dfsrdiag pollad`, then set msDFSR-Enabled to TRUE and force AD replication and `dfsrdiag pollad` again.',
      'On DC3, set msDFSR-Enabled to FALSE and msDFSR-Options to 1, then set msDFSR-Enabled to FALSE on DC1 and DC2.',
      'Increase MaxOfflineTimeInDays on DC3 to 100 and restart the DFS Replication service.',
      'Delete the DFSR database on the SYSVOL volume of DC1 and DC2.',
    ],
    answer: [0],
    explanation: "DFSR **content freshness** blocked DC3. Because the other DCs are healthy, perform a **non-authoritative** sync on DC3 only: disable its SYSVOL membership (event 4114), then re-enable it so it performs an initial sync from a partner (events 4614 and 4604).\n\n- Setting **msDFSR-Options = 1 on DC3** makes DC3 authoritative and would push its stale SYSVOL to the healthy DCs.\n- Raising **MaxOfflineTimeInDays** lets DC3 resume with stale data, which can overwrite newer content.\n- **Deleting the DFSR database** on healthy DCs is unnecessary and discouraged.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-056',
    topic: '7.3',
    type: 'multi',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. All logon scripts were accidentally deleted from SYSVOL on every domain controller. You copy the scripts back to SYSVOL on DC1, which holds the PDC emulator role, and you stop the DFS Replication service on all domain controllers. You need DC1 to become the authoritative SYSVOL member. Which two attribute values should you set on the SYSVOL Subscription object of DC1? (Choose two.)",
    options: [
      'msDFSR-Enabled = FALSE',
      'msDFSR-Options = 1',
      'msDFSR-Enabled = TRUE',
      'msDFSR-Options = 0',
      'BurFlags = D4',
    ],
    answer: [0, 1],
    explanation: "For an authoritative (D4-style) DFSR SYSVOL sync, set **msDFSR-Enabled = FALSE** and **msDFSR-Options = 1** on the authoritative DC, and msDFSR-Enabled = FALSE on every other DC. After AD replication, start DFSR on DC1, set msDFSR-Enabled back to TRUE, run `dfsrdiag pollad`, and wait for event 4602 before bringing the other DCs back.\n\n- **msDFSR-Enabled = TRUE** is set later in the procedure, not at this stage.\n- **msDFSR-Options = 0** doesn't mark the member primary.\n- **BurFlags D4** is the old FRS registry method; it doesn't apply to DFSR.",
    lesson: '7.3-ad-recovery-recycle-bin-dsrm-sysvol',
  },
  {
    id: 'd7-057',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. DC1 is in the HQ site and DC2 is in the Branch1 site. The network team changed firewall rules between the sites last night. You run the command shown in the exhibit on DC2. `Test-NetConnection DC1 -Port 135` succeeds from DC2, and DC1 resolves to the correct IP address. What should you do?",
    exhibit: String.raw`C:\> repadmin /showrepl DC2

Repadmin: running command /showrepl against full DC DC2.contoso.com
Branch1\DC2
DSA Options: IS_GC
Site Options: (none)
DSA object GUID: 3c9e7f12-5b8a-4d61-a0f4-91d2c6e8b357
DSA invocationID: 3c9e7f12-5b8a-4d61-a0f4-91d2c6e8b357

==== INBOUND NEIGHBORS ======================================

DC=contoso,DC=com
    HQ\DC1 via RPC
        DSA object GUID: 7a2b9c41-1d6e-4f0b-8b3a-5c2e9d7f0a16
        Last attempt @ 2026-10-29 09:14:02 failed, result 1722 (0x6ba):
            The RPC server is unavailable.
        27 consecutive failure(s).
        Last success @ 2026-10-28 21:10:44.`,
    options: [
      'Remove lingering objects from DC1.',
      'Ask the network team to allow the RPC dynamic port range (TCP 49152-65535) from DC2 to DC1.',
      'Reset the computer account password of DC2.',
      'Enable strict replication consistency on DC2.',
    ],
    answer: [1],
    explanation: "Error **1722** means the RPC client on DC2 couldn't connect to the replication service on DC1. Name resolution and the **endpoint mapper (TCP 135)** work, but AD replication then uses a **dynamic RPC port** (49152-65535 by default) that the new firewall rules block.\n\n- **Lingering objects** cause 8606, not 1722.\n- A **machine password** problem shows up as access denied or target principal errors.\n- **Strict replication consistency** has no effect on connectivity.",
    lesson: '7.3-ad-replication-dc-health',
  },
  {
    id: 'd7-058',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. Strict replication consistency is enabled on all domain controllers. DC2 stopped replicating the domain partition from DC1. The exhibit shows the output of `repadmin /showrepl DC2` and an event from DC2. DC3 replicates correctly with all partners. What should you do?",
    exhibit: String.raw`DC=contoso,DC=com
    HQ\DC1 via RPC
        DSA object GUID: 7a2b9c41-1d6e-4f0b-8b3a-5c2e9d7f0a16
        Last attempt @ 2026-10-29 08:30:11 failed, result 8606 (0x219e):
            Insufficient attributes were given to create an object. This object may not exist because it may have been deleted and already garbage collected.
        14 consecutive failure(s).
        Last success @ 2026-10-28 12:02:47.

Log Name:      Directory Service
Source:        Microsoft-Windows-ActiveDirectory_DomainService
Event ID:      1988
Task Category: Replication
Level:         Error
Computer:      DC2.contoso.com
Description (abridged):
Active Directory Domain Services Replication encountered the existence of objects
in the following partition that have been deleted from the local domain
controller's Active Directory Domain Services database.
Source domain controller: 7a2b9c41-1d6e-4f0b-8b3a-5c2e9d7f0a16._msdcs.contoso.com
Object: CN=OldUser1,OU=Staff,DC=contoso,DC=com
This event is being logged because the source DC contains a lingering object
which does not exist on the local DC's Active Directory Domain Services database.
This replication attempt has been blocked.`,
    options: [
      'Disable strict replication consistency on DC2.',
      'Perform an authoritative restore of CN=OldUser1 on DC2.',
      'Remove the lingering objects from DC1 by running repadmin /removelingeringobjects against DC1 with DC3 as the reference, starting in advisory mode.',
      'Set the Allow Replication With Divergent and Corrupt Partner registry value on DC2.',
    ],
    answer: [2],
    explanation: "Error **8606** with **event 1988** means **DC1 holds a lingering object** that DC2, in strict mode, refuses to recreate. Remove the lingering objects from the **source (DC1)** by comparing it with a clean DC such as DC3 (`repadmin /removelingeringobjects DC1.contoso.com <DSA GUID of DC3> DC=contoso,DC=com /advisory_mode`, then without advisory mode), or use Lingering Object Liquidator.\n\n- **Disabling strict mode** would let DC2 recreate the deleted object, spreading it.\n- An **authoritative restore** would reinstate an object that was deliberately deleted.\n- The **divergent partner** override bypasses the protection and can introduce inconsistent objects.",
    lesson: '7.3-ad-replication-dc-health',
  },
  {
    id: 'd7-059',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com with a tombstone lifetime of 180 days. A domain controller named DC4 at a closed branch office was powered off for about seven months and was powered on today. You run the command shown in the exhibit. You need to restore a healthy replication topology. The solution must minimize the risk of reintroducing deleted objects. What should you do?",
    exhibit: String.raw`C:\> repadmin /replsummary
Replication Summary Start Time: 2026-10-29 10:05:33

Beginning data collection for replication summary, this may take awhile:
  .....


Source DSA          largest delta    fails/total %%   error
 DC1                       11m:02s    0 /  15    0
 DC2                       09m:47s    0 /  15    0
 DC4                    >60 days      5 /   5  100  (8614) The directory service cannot replicate with this server because the time since the last replication with this server has exceeded the tombstone lifetime.


Destination DSA     largest delta    fails/total %%   error
 DC1                       11m:02s    0 /  10    0
 DC2                       09m:47s    0 /  10    0
 DC4                    >60 days      5 /   5  100  (8614) The directory service cannot replicate with this server because the time since the last replication with this server has exceeded the tombstone lifetime.`,
    options: [
      'Set the Allow Replication With Divergent and Corrupt Partner registry value on DC1 and DC2.',
      'Run `repadmin /syncall DC4 /AdeP`.',
      'Perform an authoritative restore of the domain partition on DC4.',
      'Disconnect DC4, force-demote it, clean up its metadata, and promote a new DC if one is still needed.',
    ],
    answer: [3],
    explanation: "Error **8614** shows DC4 hasn't replicated within the **tombstone lifetime**, so its partners quarantine it; DC4 may hold objects that were deleted and purged everywhere else. Removing DC4 (force-demote and **metadata cleanup**) is the safe choice. Microsoft's alternative is to remove lingering objects first, then resume replication, which takes more effort.\n\n- The **divergent partner** override lets possibly lingering objects replicate back into the domain.\n- **Forcing replication** fails with the same 8614 error.\n- An **authoritative restore** from DC4 would push its stale data over newer changes.",
    lesson: '7.3-ad-replication-dc-health',
  },
  {
    id: 'd7-060',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. A domain controller named DC5 runs on a third-party hypervisor that doesn't support VM-GenerationID. After a storage failure, DC5 was recovered by copying back a two-week-old copy of its virtual disk. You find the information shown in the exhibit on DC5. What should you do?",
    exhibit: String.raw`Log Name:   Directory Service
Source:     Microsoft-Windows-ActiveDirectory_DomainService
Event ID:   2095
Level:      Error
Computer:   DC5.contoso.com
Description (abridged):
During an Active Directory Domain Services replication request, the local domain
controller (DC) identified a remote DC which has received replication data from
the local DC by using already acknowledged USN tracking numbers. ... The Net Logon
service has been paused.

C:\> reg query HKLM\SYSTEM\CurrentControlSet\Services\NTDS\Parameters /v "Dsa Not Writable"

HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\NTDS\Parameters
    Dsa Not Writable    REG_DWORD    0x4`,
    options: [
      'Delete the Dsa Not Writable registry value and restart the Netlogon service.',
      'Force-demote DC5, clean up its metadata, and promote it again as a new domain controller.',
      'Perform an authoritative restore of the domain partition on DC5.',
      'Run `repadmin /syncall DC5 /AdeP` until the error clears.',
    ],
    answer: [1],
    explanation: "Event **2095**, a paused Netlogon and **Dsa Not Writable = 4** are the signs of a **USN rollback**, caused here by an unsupported disk-copy restore. The supported recovery is to **demote** (forcibly if needed), clean up metadata and **re-promote**, or restore from a valid system state backup.\n\n- Deleting **Dsa Not Writable** is unsupported and leaves the partitions permanently inconsistent.\n- An **authoritative restore** from a rolled-back database would push stale data.\n- **Forcing replication** doesn't fix the USN mismatch; partners still ignore DC5's changes.",
    lesson: '7.3-ad-replication-dc-health',
  },
  {
    id: 'd7-061',
    topic: '7.3',
    type: 'match',
    difficulty: 2,
    stem: "You review `repadmin /showrepl` output from several domain controllers. Match each replication error code to its meaning.",
    pairs: [
      ['1722', 'The RPC server is unavailable'],
      ['8524', 'DNS lookup failure for the source DC'],
      ['8453', 'Replication access was denied'],
      ['8614', 'Time since last replication exceeded the tombstone lifetime'],
      ['8606', 'Insufficient attributes to create an object (lingering object blocked by strict mode)'],
    ],
    explanation: "- **1722 (0x6ba)**: the destination couldn't connect to RPC on the source (network, firewall, DNS pointing to a wrong IP).\n- **8524 (0x214c)**: the destination couldn't resolve the source's DSA GUID CNAME in `_msdcs`.\n- **8453 (0x2105)**: permissions on the naming context or the DC account's `userAccountControl` flags.\n- **8614 (0x21a6)**: partners haven't replicated within the tombstone lifetime (event 2042).\n- **8606 (0x219e)**: a lingering object on the source (event 1988).",
    lesson: '7.3-ad-replication-dc-health',
  },
  {
    id: 'd7-062',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. DC1 held the RID master and infrastructure master roles and suffered a permanent hardware failure. It won't be repaired. You need DC2 to hold both roles. What should you run on DC2?",
    options: [
      '`Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole RIDMaster, InfrastructureMaster`',
      '`Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole RIDMaster, InfrastructureMaster -Force`',
      '`Set-ADDomain -Identity contoso.com -RIDMaster DC2`',
      '`netdom query fsmo`',
    ],
    answer: [1],
    explanation: "Because DC1 is gone, the roles must be **seized**. `Move-ADDirectoryServerOperationMasterRole` with **`-Force`** seizes the roles when the current holder can't be contacted. Afterwards, clean up DC1's metadata and never bring it back online.\n\n- Without `-Force` the cmdlet attempts a **transfer**, which needs the current holder to be online.\n- `Set-ADDomain` has no parameter that moves FSMO roles.\n- `netdom query fsmo` only **displays** the role holders.",
    lesson: '7.3-ad-replication-dc-health',
  },
  {
    id: 'd7-063',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. At 10:15 AM you add User1 to a group named Finance, which has access to \\\\FS1\\Finance. You confirm that the membership has replicated to all domain controllers. At 10:30 AM User1 still gets access denied. User1 must not sign out. User1 runs the command shown in the exhibit. What should User1 do?",
    exhibit: String.raw`C:\> klist

Current LogonId is 0:0x5d2a81

Cached Tickets: (2)

#0>     Client: User1 @ CONTOSO.COM
        Server: krbtgt/CONTOSO.COM @ CONTOSO.COM
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40e10000 -> forwardable renewable initial pre_authent name_canonicalize
        Start Time: 10/29/2026 7:58:12 (local)
        End Time:   10/29/2026 17:58:12 (local)
        Renew Time: 11/5/2026 7:58:12 (local)
        Session Key Type: AES-256-CTS-HMAC-SHA1-96
        Cache Flags: 0x1 -> PRIMARY
        Kdc Called: DC1.contoso.com

#1>     Client: User1 @ CONTOSO.COM
        Server: cifs/FS1.contoso.com @ CONTOSO.COM
        KerbTicket Encryption Type: AES-256-CTS-HMAC-SHA1-96
        Ticket Flags 0x40a10000 -> forwardable renewable pre_authent name_canonicalize
        Start Time: 10/29/2026 8:03:40 (local)
        End Time:   10/29/2026 17:58:12 (local)
        Renew Time: 11/5/2026 7:58:12 (local)
        Session Key Type: AES-256-CTS-HMAC-SHA1-96
        Cache Flags: 0
        Kdc Called: DC1.contoso.com`,
    options: [
      'Run `gpupdate /force`.',
      'Run `klist purge`, and then reconnect to \\\\FS1\\Finance.',
      'Run `repadmin /syncall /AdeP`.',
      'Run `w32tm /resync`.',
    ],
    answer: [1],
    explanation: "User1's TGT was issued at 7:58 AM, before the group change, so neither the TGT nor the cached `cifs/FS1` ticket contains the Finance group SID. **`klist purge`** discards the tickets; the next connection obtains a new TGT and service ticket that include the new membership.\n\n- **gpupdate** refreshes Group Policy, not Kerberos tickets.\n- **Replication** is already confirmed.\n- **Time** isn't the issue; the tickets are valid.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-064',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com. A web application at app1.contoso.com runs on a server named WEB1 in an IIS application pool whose identity is CONTOSO\\svc-web. Windows Authentication on the site uses kernel-mode authentication with useAppPoolCredentials set to true. Users intermittently fall back to NTLM or fail to authenticate. You find the information shown in the exhibit. What should you do?",
    exhibit: String.raw`Log Name:      System
Source:        Microsoft-Windows-Kerberos-Key-Distribution-Center
Event ID:      11
Level:         Error
Computer:      DC1.contoso.com
Description:
The KDC encountered duplicate names while processing a Kerberos authentication request. The duplicate name is HTTP/app1.contoso.com (of type DS_SERVICE_PRINCIPAL_NAME). This may result in authentication failures or downgrades to NTLM. In order to prevent this from occurring remove the duplicate entries for HTTP/app1.contoso.com in Active Directory.

C:\> setspn -Q HTTP/app1.contoso.com
Checking domain DC=contoso,DC=com
CN=WEB1,OU=Servers,DC=contoso,DC=com
        HTTP/app1.contoso.com
        HOST/WEB1.contoso.com
        HOST/WEB1
CN=svc-web,OU=Service Accounts,DC=contoso,DC=com
        HTTP/app1.contoso.com

Existing SPN found!`,
    options: [
      'Run `setspn -D HTTP/app1.contoso.com CONTOSO\\svc-web`.',
      'Run `setspn -D HTTP/app1.contoso.com WEB1`.',
      'Run `setspn -A HTTP/app1.contoso.com CONTOSO\\svc-web`.',
      'Run `klist purge` on DC1.',
    ],
    answer: [1],
    explanation: "The SPN must be unique and must belong to the account that decrypts the tickets. Because `useAppPoolCredentials` is true, tickets are decrypted with the application pool identity, **svc-web** (with the default of false, http.sys would use the WEB1 computer account instead), so remove the duplicate from the **WEB1 computer account** with `setspn -D HTTP/app1.contoso.com WEB1`.\n\n- Removing it from **svc-web** leaves the SPN on the wrong account, causing KRB_AP_ERR_MODIFIED failures.\n- `setspn -A` adds yet another copy; svc-web already has it.\n- `klist purge` on a DC doesn't change SPN registrations.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-065',
    topic: '7.3',
    type: 'fill',
    difficulty: 1,
    stem: "By default, what is the maximum time difference, in minutes, that Kerberos allows between a client and a domain controller before authentication fails? (Enter a number.)",
    answer: ['5', 'five', '5 minutes'],
    explanation: "The **Maximum tolerance for computer clock synchronization** in the Default Domain Policy's Kerberos policy is **5 minutes** by default. Beyond that, clients get KRB_AP_ERR_SKEW errors.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-066',
    topic: '7.3',
    type: 'single',
    difficulty: 3,
    stem: "Your network contains an AD DS domain named contoso.com with the AD Recycle Bin enabled. Users can't sign in to a member server named SRV7 with domain accounts. SRV7 is a member of several security groups used to filter GPOs. You sign in to SRV7 as a local administrator and run the first command in the exhibit; you run the second command from a management workstation. You need to restore domain logons on SRV7 and keep its group memberships. What should you do?",
    exhibit: String.raw`PS C:\> Test-ComputerSecureChannel -Verbose
VERBOSE: Performing the operation "Test-ComputerSecureChannel" on target "SRV7".
VERBOSE: The secure channel between the local computer and the domain contoso.com is broken.
False

PS C:\> Get-ADComputer -Identity SRV7 -Server DC1
Get-ADComputer : Cannot find an object with identity: 'SRV7' under: 'DC=contoso,DC=com'.`,
    options: [
      'Run `Test-ComputerSecureChannel -Repair -Credential CONTOSO\\Admin1` on SRV7.',
      'Run `New-ADComputer -Name SRV7`, and then run `Test-ComputerSecureChannel -Repair` on SRV7.',
      'Restore the SRV7 computer object by using `Restore-ADObject`, and then run `Test-ComputerSecureChannel -Repair -Credential CONTOSO\\Admin1` on SRV7.',
      'Remove SRV7 from the domain and join it again.',
    ],
    answer: [2],
    explanation: "The computer account was **deleted**, so there's nothing for a secure channel repair to reset. Restore it from the **Recycle Bin** (same SID and group memberships), then **repair** the channel so the machine password matches again.\n\n- **Repair alone** fails because the account doesn't exist.\n- **New-ADComputer** creates a new object with a **new SID** and no group memberships.\n- **Rejoining** also creates a new account and loses the memberships.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-067',
    topic: '7.3',
    type: 'multi',
    difficulty: 2,
    stem: "You have a member server named SRV8 that runs Windows Server 2025 in a domain named contoso.com. SRV8 was reverted to a checkpoint from two months ago, and domain users now see \"The trust relationship between this workstation and the primary domain failed.\" You sign in as a local administrator. You need to repair the trust without removing SRV8 from the domain. Which two commands can you use? (Choose two.) Each correct answer presents a complete solution.",
    options: [
      '`Test-ComputerSecureChannel -Repair -Credential CONTOSO\\Admin1`',
      '`Reset-ComputerMachinePassword -Server DC1 -Credential CONTOSO\\Admin1`',
      '`nltest /sc_query:contoso.com`',
      '`klist -li 0x3e7 purge`',
      '`Remove-Computer -UnjoinDomainCredential CONTOSO\\Admin1`, then `Add-Computer -DomainName contoso.com`',
    ],
    answer: [0, 1],
    explanation: "The checkpoint restored an old machine password that no longer matches AD. **`Test-ComputerSecureChannel -Repair`** and **`Reset-ComputerMachinePassword`** both reset the password on SRV8 and in AD and re-establish the secure channel, without rejoining.\n\n- `nltest /sc_query` only **reports** the channel status.\n- Purging the computer's **Kerberos tickets** doesn't fix the password mismatch.\n- **Remove-Computer/Add-Computer** rejoins the domain, which the requirement forbids.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-068',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "You have a member server named SRV9 in a domain named contoso.com. Users can't access SRV9 by using Kerberos, and the System log on SRV9 contains Kerberos errors stating that the time difference between the client and server is too large. You run the command shown in the exhibit on SRV9. The solution must maintain the security of Kerberos authentication. What should you do?",
    exhibit: String.raw`C:\> w32tm /stripchart /computer:DC1.contoso.com /samples:3 /dataonly
Tracking DC1.contoso.com [10.0.0.10:123].
Collecting 3 samples.
The current time is 10/29/2026 11:20:04 AM.
11:20:04, +492.1834201s
11:20:06, +492.1840012s
11:20:08, +492.1838877s`,
    options: [
      'Increase the Maximum tolerance for computer clock synchronization in the Default Domain Policy to 10 minutes.',
      'Confirm that SRV9 is configured to sync from the domain hierarchy, and then run `w32tm /resync`.',
      'Register an SPN for SRV9 by running `setspn -S HOST/SRV9.contoso.com SRV9`.',
      'Run `Test-ComputerSecureChannel -Repair` on SRV9.',
    ],
    answer: [1],
    explanation: "SRV9's clock is about **492 seconds (8 minutes)** away from DC1, beyond the 5-minute Kerberos tolerance. Because SRV9 can reach DC1 on UDP 123, make sure it uses the **domain hierarchy** (`w32tm /config /syncfromflags:domhier /update` if needed) and **resync**.\n\n- **Raising the tolerance** weakens replay protection for the whole domain, which violates the requirement.\n- The **HOST SPN** is registered automatically; the error is about time, not names.\n- A **secure channel** repair doesn't correct the clock.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-069',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com with eight domain controllers. A user account named User2 is locked out several times a day. You need to identify the computer that is causing the lockouts with the least administrative effort. What should you do?",
    options: [
      'Search the Security log on the domain controller that holds the PDC emulator role for event ID 4740 for User2.',
      'Search the Security log on User2\'s workstation for event ID 4625.',
      'Run `Get-ADUser User2 -Properties LockedOut` on each domain controller.',
      'Run `repadmin /showobjmeta` against User2 on each domain controller.',
    ],
    answer: [0],
    explanation: "Bad-password counts are forwarded to the **PDC emulator**, which records the lockout as **event 4740** with the **Caller Computer Name**, so one search on one DC identifies the source.\n\n- **4625** on User2's own workstation shows only failures on that workstation, which may not be the source.\n- **LockedOut** shows the account is locked, not where the bad passwords came from.\n- **Replication metadata** shows which DC changed `lockoutTime`, not the client that sent the bad passwords.",
    lesson: '7.3-kerberos-secure-channel',
  },
  {
    id: 'd7-070',
    topic: '7.3',
    type: 'single',
    difficulty: 2,
    stem: "Your network contains an AD DS domain named contoso.com. Replication from DC1 to DC2 fails with error 8524. `nslookup` on DC2 can't resolve `7a2b9c41-1d6e-4f0b-8b3a-5c2e9d7f0a16._msdcs.contoso.com`. DC1 is online and was not removed from the domain. What should you investigate first?",
    options: [
      "Whether DC1 registered its CNAME record in the _msdcs.contoso.com zone, and whether DC2's DNS servers can resolve that zone",
      'Whether the RPC dynamic port range is open between DC2 and DC1',
      "Whether the userAccountControl attribute of DC1's computer account includes SERVER_TRUST_ACCOUNT",
      'Whether DC2 has replicated within the tombstone lifetime',
    ],
    answer: [0],
    explanation: "Error **8524** is a **DNS lookup failure**: the destination couldn't resolve the source DC's **DSA GUID CNAME** in `_msdcs.<forest root>`. Check that DC1 registered it (restart Netlogon to re-register) and that DC2 points only to DNS servers that host or forward the `_msdcs` zone.\n\n- Blocked **RPC ports** cause 1722.\n- Missing **userAccountControl** flags cause 8453.\n- Exceeding the **tombstone lifetime** causes 8614.",
    lesson: '7.3-ad-replication-dc-health',
  },
];
