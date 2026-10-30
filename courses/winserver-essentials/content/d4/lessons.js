// Domain 4 - Storage and Hyper-V. Original content, checked against Microsoft Learn (Windows Server 2025 documentation) on 2026-10-30.
export default [
  { id: '4.1-disks-partitions-filesystems', topic: '4.1', title: 'GPT vs MBR, Basic Disks, and NTFS vs ReFS', minutes: 9, file: '4.1-disks-partitions-filesystems.md',
    objectives: ['Choose MBR or GPT from disk size, partition count and firmware', 'Initialize, partition and format disks with the Storage cmdlets', 'Compare NTFS and ReFS limits and features, including what is new for ReFS in 2025', 'Pick the right file system for system, data, SAN and virtualization volumes'] },
  { id: '4.1-storage-spaces-resiliency', topic: '4.1', title: 'Storage Spaces: Pools, Virtual Disks and Resiliency', minutes: 10, file: '4.1-storage-spaces-resiliency.md',
    objectives: ['Describe the pool, virtual disk and volume layers', 'State minimum disks or servers and usable capacity for simple, mirror and parity', 'Create a pool, resilient virtual disk and volume in PowerShell', 'Distinguish standalone Storage Spaces from Storage Spaces Direct'] },
  { id: '4.1-iscsi-and-dedup', topic: '4.1', title: 'iSCSI Target and Initiator, and Data Deduplication', minutes: 10, file: '4.1-iscsi-and-dedup.md',
    objectives: ['Build an iSCSI target, map a VHDX LUN and connect an initiator persistently', 'Secure and scale iSCSI with isolation, CHAP and MPIO', 'Enable Data Deduplication with the correct usage type', 'List supported and unsupported deduplication scenarios'] },
  { id: '4.2-install-generations-switches', topic: '4.2', title: 'Installing Hyper-V, VM Generations and Virtual Switches', minutes: 11, file: '4.2-install-generations-switches.md',
    objectives: ['Install the Hyper-V role and meet its hardware requirements', 'Quote the Windows Server 2025 VM and host limits', 'Choose Generation 1 or 2 and understand Secure Boot templates', 'Create external, internal and private switches and enable nested virtualization for a lab'] },
  { id: '4.2-vhdx-checkpoints-memory', topic: '4.2', title: 'VHDX, Checkpoints, Dynamic Memory and Integration Services', minutes: 10, file: '4.2-vhdx-checkpoints-memory.md',
    objectives: ['Compare VHD and VHDX and fixed, dynamic and differencing disks', 'Explain production vs standard checkpoints and the CheckpointType values', 'Configure Dynamic Memory and know what smart paging does', 'Manage integration services and enable guest file copy'] },
  { id: '4.2-migration-replica-gpu', topic: '4.2', title: 'Live Migration, Hyper-V Replica and GPU Partitioning', minutes: 12, file: '4.2-migration-replica-gpu.md',
    objectives: ['Configure live migration authentication and know the Credential Guard change in 2025', 'Set up Hyper-V Replica and use test, planned and unplanned failover', 'Separate live migration, Replica and clustering by purpose', 'State the GPU partitioning requirements and its live migration behavior in 2025'] },
];
