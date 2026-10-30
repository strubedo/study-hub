// Domain 5 - Security, Monitoring and Recovery. Original content, checked against Microsoft Learn (Windows Server 2025 documentation) on 2026-10-30.
export default [
  { id: '5.1-firewall-defender-av', topic: '5.1', title: 'Windows Defender Firewall Profiles and Rules, and Microsoft Defender Antivirus', minutes: 10, file: '5.1-firewall-defender-av.md',
    objectives: ['Explain the Domain, Private and Public profiles and their defaults', 'Create, filter and troubleshoot firewall rules with the NetSecurity cmdlets', 'Enable firewall logging and read dropped-packet entries', 'Manage Defender Antivirus, exclusions, updates and passive mode on a server'] },
  { id: '5.1-windows-laps', topic: '5.1', title: 'Windows LAPS: Schema, Permissions, Policy and 2025 Features', minutes: 10, file: '5.1-windows-laps.md',
    objectives: ['Describe where Windows LAPS can store the password and the join-state limits', 'Prepare Active Directory with the LAPS schema and permission cmdlets', 'Recall the main policy defaults and ranges', 'Use the 2025 additions: passphrases, automatic account management and post-authentication action 11'] },
  { id: '5.1-credential-guard-baselines-osconfig', topic: '5.1', title: 'Credential Guard, Protected Users and OSConfig Security Baselines', minutes: 10, file: '5.1-credential-guard-baselines-osconfig.md',
    objectives: ['State when Credential Guard is enabled by default on Windows Server 2025', 'Verify Credential Guard and recognize the protocols it breaks', 'Place Protected Users alongside Credential Guard', 'Apply, verify and remove OSConfig baselines by role'] },
  { id: '5.2-event-viewer-forwarding', topic: '5.2', title: 'Event Viewer, Custom Views, Key Event IDs and Windows Event Forwarding', minutes: 10, file: '5.2-event-viewer-forwarding.md',
    objectives: ['Navigate the Windows logs and build custom views', 'Query logs with Get-WinEvent and wevtutil', 'Identify important logon, account, lockout and log-cleared event IDs', 'Configure collector- and source-initiated subscriptions with wecutil'] },
  { id: '5.2-performance-monitor-resource-monitor', topic: '5.2', title: 'Performance Monitor, Data Collector Sets and Resource Monitor', minutes: 9, file: '5.2-performance-monitor-resource-monitor.md',
    objectives: ['Choose between Task Manager, Resource Monitor and Performance Monitor', 'Select the core CPU, memory, disk and network counters', 'Create a baseline with a data collector set and logman', 'Sample counters with Get-Counter and typeperf'] },
  { id: '5.2-wsb-vss-recovery', topic: '5.2', title: 'Windows Server Backup, Bare-Metal Recovery and Volume Shadow Copies', minutes: 11, file: '5.2-wsb-vss-recovery.md',
    objectives: ['Install Windows Server Backup and run backups with wbadmin and PowerShell', 'Plan system state and bare-metal recovery, including DC restores', 'Explain how VSS works and its documented limits', 'Use vssadmin and Previous Versions for file-level recovery'] },
  { id: '5.2-azure-backup-site-recovery', topic: '5.2', title: 'Azure Backup (MARS Agent) and Azure Site Recovery Overview', minutes: 8, file: '5.2-azure-backup-site-recovery.md',
    objectives: ['Distinguish backup from disaster recovery', 'Set up the MARS agent and know its limits', 'Describe the Hyper-V-to-Azure Site Recovery flow', 'Layer VSS, Windows Server Backup, Azure Backup and ASR'] },
];
