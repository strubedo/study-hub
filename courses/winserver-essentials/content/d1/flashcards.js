// Domain 1 - Deploy and Manage Windows Server 2025. Original flashcards.
let n = 0;
const c = (topic, front, back) => ({ id: `d1-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('1.1', 'VM rights: Standard vs Datacenter?', 'Standard: 2 Windows Server VMs (plus Hyper-V host) per fully licensed host; stack to add pairs. Datacenter and Azure Edition: unlimited VMs.'),
  c('1.1', 'Core licensing minimums?', 'License every physical core: at least 8 per processor and 16 per server. vCPUs and logical processors do not count.'),
  c('1.1', 'Which features are Datacenter-only (not Standard)?', 'Storage Spaces Direct, Network Controller, Host Guardian Hyper-V Support. Storage Replica is full only in Datacenter (Standard: one 2 TB volume).'),
  c('1.1', 'What is Datacenter: Azure Edition?', 'Edition for Azure and Azure Local VMs. Activated by Azure, cannot be a KMS host, hotpatching built in, unlimited VMs.'),
  c('1.1', 'Essentials edition limits?', 'Per Microsoft licensing material: 25 users and 50 devices, no CALs, fixed hardware caps. Converts to full retail with `slmgr.vbs /ipk <key>`.'),
  c('1.1', 'Which 2025 change moved SMB over QUIC server?', 'It was Azure Edition only in 2022; in 2025 it is also in Standard and Datacenter.'),
  c('1.1', 'What do CALs cover?', 'Right of users (User CAL) or devices (Device CAL) to access the server; RDS needs separate RDS CALs. Pay-as-you-go needs no base CALs but still needs RDS CALs.'),
  c('1.1', 'Azure Arc pay-as-you-go prerequisites?', '2025 Standard or Datacenter, Connected Machine agent 1.47+, not already activated with OEM/retail/VL, internet connection.'),
  c('1.1', 'Pay-as-you-go billing facts?', 'Per core per hour, same rate for Standard and Datacenter, 7-day free trial, billing continues until you disable it, no extra VM rights, no AVMA.'),
  c('1.1', '2025 CPU requirements beyond earlier releases?', '1.4 GHz x64 with SLAT, NX/DEP, CMPXCHG16b, LAHF/SAHF, PrefetchW, plus SSE4.2 and POPCNT (new in 2025).'),
  c('1.1', '2025 minimum RAM, disk and NIC?', '2 GB RAM (Core and Desktop; 4 GB recommended for Desktop), 32 GB disk, 1 Gbps PCIe Ethernet. A minimum VM needs 1,280 MB to install.'),
  c('1.2', 'Can Core and Desktop Experience be converted after install?', 'No. Not in place, not during an in-place upgrade. Clean install or migration is required.'),
  c('1.2', 'Oldest version that upgrades in place straight to 2025?', 'Windows Server 2012 R2 (up to four versions at once). Plain 2012 must step to 2012 R2 or 2016 first.'),
  c('1.2', 'Windows Update upgrade to 2025 works from?', 'Windows Server 2019 or 2022 only, with the required cumulative update installed; non-clustered.'),
  c('1.2', 'Edition rules during upgrade?', 'Edition kept by default; Standard to Datacenter (or Azure Edition) allowed; downgrades not allowed. Language cannot change.'),
  c('1.2', 'Domain controllers and in-place upgrade?', 'Microsoft recommends against it: install new 2025 DCs, promote, move FSMO roles, demote old ones.'),
  c('1.2', 'DISM edition conversion commands?', '`DISM /online /Get-CurrentEdition`, `/Get-TargetEditions`, then `/Set-Edition:<edition> /ProductKey:<key> /AcceptEula`. Eval Datacenter converts only to Datacenter.'),
  c('1.2', 'SConfig menu: 1, 2, 4, 8, 11, 15?', '1 domain/workgroup, 2 computer name, 4 remote management and ping, 8 network settings, 11 activation, 15 exit to PowerShell.'),
  c('1.2', 'SConfig facts?', 'Auto-starts on Server Core since 2022, PowerShell based, needs local Administrators, works locally or over RDP but not in a remote PowerShell session. Ping off by default.'),
  c('1.2', 'Role vs role service vs feature?', 'Role is the server job (DNS), role service is part of a role (DFS Namespaces), feature supports the server (Failover Clustering).'),
  c('1.3', 'WinRM ports and default state?', 'HTTP 5985, HTTPS 5986. Remoting enabled by default on servers; `Enable-PSRemoting` restores it. Public-profile rule is local subnet only.'),
  c('1.3', 'Workgroup remoting error fix?', 'Use HTTPS transport, or add the target to TrustedHosts on the client: `Set-Item WSMan:\\localhost\\Client\\TrustedHosts`.'),
  c('1.3', 'OpenSSH in 2025?', 'Server installed but not enabled. `Start-Service sshd`, `Set-Service sshd -StartupType Automatic`; firewall rule OpenSSH-Server-In-TCP, port 22. PowerShell over SSH needs PowerShell 7 and a Subsystem entry.'),
  c('1.3', 'Hotpatch cycle and prerequisites?', 'Baseline with restart, then two restart-free hotpatch months; four baselines a year. Arc route: 2025 Standard/Datacenter, build 26100.1742+, VBS, UEFI with Secure Boot.'),
];
