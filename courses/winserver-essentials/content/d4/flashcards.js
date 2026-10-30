// Domain 4 - Storage and Hyper-V. Original flashcards.
let n = 0;
const c = (topic, front, back) => ({ id: `d4-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('4.1', 'MBR vs GPT limits?', 'MBR: 4 primary partitions (or 3 + extended) and about 2 TB. GPT: 128 partitions in Windows, disks beyond 2 TB, backup table with CRC. GPT boot needs UEFI.'),
  c('4.1', 'Which cmdlets take a RAW disk to a usable volume?', '`Initialize-Disk -PartitionStyle GPT`, then `New-Partition -UseMaximumSize -AssignDriveLetter`, then `Format-Volume`. `New-Volume` combines partition and format.'),
  c('4.1', 'NTFS vs ReFS: maximum volume size?', 'NTFS 256 TB; ReFS 35 PB.'),
  c('4.1', 'What ReFS cannot do?', 'No production boot volume, disk quotas, shrink, removable media, ODX or object IDs. NTFS covers those.'),
  c('4.1', 'ReFS strengths?', 'Block cloning, sparse VDL, integrity streams with self-repair on Storage Spaces, mirror-accelerated parity on S2D. 2025 adds native dedup and compression (`refsutil`).'),
  c('4.1', 'Storage Spaces layering?', 'Physical disks, then storage pool, then virtual disk (space), then volume. A space cannot host the Windows OS.'),
  c('4.1', 'Minimum disks (standalone Storage Spaces)?', 'Simple 1; two-way mirror 2; parity 3; three-way mirror 5 (survives two failures).'),
  c('4.1', 'Minimum servers (Storage Spaces Direct)?', 'Two-way mirror 2; three-way mirror 3; dual parity 4; mirror-accelerated parity 4. S2D needs Datacenter.'),
  c('4.1', 'Usable capacity by resiliency?', 'Two-way mirror 50%; three-way mirror 33.3%; dual parity 50% to 80%; simple 100%.'),
  c('4.1', 'Mirror vs parity: when to use?', 'Mirror for VMs, databases and general shares (best writes). Parity for sequential archive and backup (slower writes, better capacity).'),
  c('4.1', 'Core Storage Spaces cmdlets?', '`Get-PhysicalDisk -CanPool $true`, `New-StoragePool`, `New-VirtualDisk`, `New-Volume`, `Get-VirtualDisk`, `Get-StorageJob`.'),
  c('4.1', 'iSCSI target workflow?', '`Install-WindowsFeature FS-iSCSITarget-Server`, `New-IscsiVirtualDisk` (VHDX), `New-IscsiServerTarget -InitiatorIds`, `Add-IscsiVirtualDiskTargetMapping`.'),
  c('4.1', 'iSCSI initiator workflow?', 'Start `MSiSCSI`, `New-IscsiTargetPortal`, `Connect-IscsiTarget -IsPersistent $true`, then initialize and format the disk. TCP port 3260.'),
  c('4.1', 'Why does an iSCSI disk vanish after reboot?', 'The session was not persistent. Connect with `-IsPersistent $true`.'),
  c('4.1', 'Data Deduplication usage types?', 'Default (file servers, 3-day min age), HyperV (VDI, optimizes open files), Backup (DPM-like, 0-day min age).'),
  c('4.1', 'How does Data Deduplication run?', 'Post-processing jobs (Optimization, GarbageCollection, Scrubbing), per volume, chunk store in System Volume Information. Not inline and not on by default.'),
  c('4.1', 'Data Deduplication not-supported list?', 'Nested virtualization VMs, multi-tier volumes, hard quota on the volume root, Windows 10 clients, and Windows Search indexing of deduplicated files.'),
  c('4.2', 'Windows Server 2025 VM limits?', 'Gen 2: 2,048 vCPUs and 240 TB RAM. Gen 1: 64 vCPUs and 1 TB. VHDX 64 TB; 50 checkpoints; 1,024 running VMs per host.'),
  c('4.2', 'Generation 2 advantages?', 'UEFI, Secure Boot (default on), vTPM, SCSI boot, 64 TB boot VHDX, online resize. Generation cannot be changed after creation.'),
  c('4.2', 'Virtual switch types?', 'External (physical network), Internal (VMs and host only), Private (VMs only). `New-VMSwitch -NetAdapterName` implies external.'),
  c('4.2', 'Production vs standard checkpoint?', 'Production: VSS or Linux freeze, no memory, applied VM is off, default. Standard: saves memory, resumes running state, not app-consistent.'),
  c('4.2', 'CheckpointType values?', '`Disabled`, `Production` (falls back to standard), `ProductionOnly` (no fallback), `Standard`. Set with `Set-VM -CheckpointType`.'),
  c('4.2', 'Dynamic Memory settings?', 'Startup, Minimum (as low as 32 MB, up to Startup), Maximum (up to 1 TB), buffer %, weight. Raise Max or lower Min while running.'),
  c('4.2', 'Live migration authentication in 2025?', 'Use Kerberos with constrained delegation (cifs and Microsoft Virtual System Migration Service). Default Credential Guard breaks CredSSP.'),
  c('4.2', 'Hyper-V Replica basics?', 'Asynchronous DR; 30 s, 5 min or 15 min; Kerberos HTTP 80 or certificate HTTPS 443; up to 24 hourly recovery points; extended replication 5 or 15 min.'),
  c('4.2', 'GPU partitioning in 2025?', 'Shares one GPU across VMs via SR-IOV. Live migration needs IOMMU DMA tracking CPUs and matching GPUs; one partition per VM; DDA is whole-GPU.'),
];
