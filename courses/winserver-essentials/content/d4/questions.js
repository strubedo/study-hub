// Domain 4 - Storage and Hyper-V. Original questions; facts checked against Microsoft Learn (Windows Server 2025) on 2026-10-30.
const L41A = '4.1-disks-partitions-filesystems';
const L41B = '4.1-storage-spaces-resiliency';
const L41C = '4.1-iscsi-and-dedup';
const L42A = '4.2-install-generations-switches';
const L42B = '4.2-vhdx-checkpoints-memory';
const L42C = '4.2-migration-replica-gpu';

const bank = [
  // ---------- 4.1 disks, file systems ----------
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L41A,
    stem: 'A new 4 TB data disk on FS01 shows only about 2 TB of usable space in Disk Management. What is the most likely cause?',
    options: ['The disk was initialized with the MBR partition style', 'The disk was formatted with ReFS instead of NTFS', 'The disk is a dynamic disk', 'The disk is attached to a SCSI controller instead of IDE'],
    answer: [0],
    explanation: 'MBR uses 32-bit sector addresses, so only about 2 TB is addressable. Converting to GPT exposes the whole disk. ReFS supports volumes up to 35 PB, a dynamic disk does not impose this 2 TB cap, and the controller type has no effect on partition style limits.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. FS01 has an empty 3 TB data disk that you want to use fully with one volume. What should you do?',
    exhibit: `PS C:\\> Get-Disk | Select-Object Number, FriendlyName, @{n='SizeTB';e={[math]::Round($_.Size/1TB,2)}}, PartitionStyle, OperationalStatus

Number FriendlyName     SizeTB PartitionStyle OperationalStatus
------ ------------     ------ -------------- -----------------
     0 Msft Virtual Disk   0.12 GPT            Online
     1 Msft Virtual Disk      3 MBR            Online`,
    options: ['Create one NTFS volume on disk 1; it will use all 3 TB', 'Clear the empty disk and initialize it as GPT, then create the volume', 'Convert disk 0 to MBR so both disks match', 'Format disk 1 with ReFS to remove the size limit'],
    answer: [1],
    explanation: 'Disk 1 is MBR, which can address only about 2 TB. Because it is empty, clear it and initialize it as GPT (Initialize-Disk -PartitionStyle GPT) before creating the volume. Creating a volume on the MBR disk strands the rest, converting the boot disk to MBR would shrink its limits, and the file system does not change the partition-style limit.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41A,
    stem: 'What is the maximum number of partitions Windows supports on a GPT disk? Enter the number.',
    answer: ['128'],
    explanation: 'The GPT specification allows almost unlimited partitions, but the Windows implementation restricts a GPT disk to 128. An MBR disk allows four primary partitions.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'An older physical server uses legacy BIOS firmware. Its administrator wants the 6 TB system disk to be one GPT disk that the server boots from. What is required?',
    options: ['UEFI firmware, because BIOS cannot boot from a GPT disk', 'Nothing; Windows Server 2025 boots GPT disks on BIOS', 'A dynamic disk with a protective MBR', 'ReFS on the system volume'],
    answer: [0],
    explanation: 'BIOS can boot only from MBR disks; booting from GPT requires UEFI. GPT disks can be used for data on BIOS systems, but not for boot. Dynamic disks are unrelated to boot firmware, and ReFS cannot be a production boot volume.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Which requirement forces you to use NTFS rather than ReFS on a volume?',
    options: ['Disk quotas on the volume', 'A 20 TB data volume', 'Block cloning for faster VHDX merges', 'Integrity streams for automatic repair on a mirror space'],
    answer: [0],
    explanation: 'ReFS has no disk quota support, and it also cannot be shrunk or used on removable media. A 20 TB volume is well within ReFS limits (35 PB), and block cloning and integrity streams are ReFS strengths that NTFS lacks.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41A,
    stem: 'Which two features are available on ReFS but not on NTFS? (Choose two.)',
    options: ['Block cloning', 'Integrity streams with automatic repair on Storage Spaces mirror or parity', 'Disk quotas', 'Offloaded Data Transfer (ODX)', 'Volume shrink', 'Use as removable media'],
    answer: [0, 1],
    explanation: 'Block cloning and integrity streams are ReFS-only. Disk quotas, ODX, shrinking and removable media are NTFS capabilities that ReFS does not support.' },
  { topic: '4.1', type: 'match', difficulty: 1, lesson: L41A,
    stem: 'Match each limit to the technology it describes.',
    pairs: [['Four primary partitions or three plus an extended', 'MBR partition style'], ['128 partitions in Windows', 'GPT partition style'], ['256 TB maximum volume size', 'NTFS'], ['35 PB maximum volume size', 'ReFS']],
    explanation: 'MBR allows four primary partitions (or three plus one extended). Windows restricts GPT to 128 partitions. NTFS volumes top out at 256 TB, while ReFS supports up to 35 PB.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41A,
    stem: 'Which PowerShell cmdlet writes a partition style (MBR or GPT) to a RAW disk?',
    answer: ['Initialize-Disk'],
    explanation: 'Initialize-Disk -Number <n> -PartitionStyle GPT brings a RAW disk online with a partition table. New-Partition then creates partitions and Format-Volume formats them.' },

  // ---------- 4.1 Storage Spaces ----------
  { topic: '4.1', type: 'order', difficulty: 1, lesson: L41B,
    stem: 'Put the Storage Spaces layers in the order you build them (first at the top).',
    items: ['Physical disks that can be pooled', 'Storage pool', 'Virtual disk (storage space)', 'Volume with a file system'],
    explanation: 'You pool the physical disks, create virtual disks with a resiliency type in the pool, then create and format volumes on the virtual disks.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: 'What is the minimum number of physical disks needed in a standalone Storage Spaces pool to create a three-way mirror that tolerates two simultaneous disk failures?',
    options: ['3', '4', '5', '7'],
    answer: [2],
    explanation: 'Microsoft requires at least two disks for a mirror to survive one failure and at least five to survive two simultaneous failures. Three is the parity minimum, and four and seven are not the documented mirror minimums.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: 'Refer to the exhibit. A user reports that a file on E: opens normally. What does the output tell you?',
    exhibit: `PS C:\\> Get-VirtualDisk | Select-Object FriendlyName, ResiliencySettingName, HealthStatus, OperationalStatus

FriendlyName ResiliencySettingName HealthStatus OperationalStatus
------------ ---------------------- ------------ -----------------
Data         Mirror                 Warning      Degraded`,
    options: ['The mirror space is online but has lost redundancy; replace the failed disk and let the repair run', 'The space is offline and data is lost', 'The space is simple and has no fault tolerance', 'The pool must be deleted and rebuilt'],
    answer: [0],
    explanation: 'Degraded with Warning health means a mirror lost a copy but still serves data from the remaining copy. Add or replace a disk and monitor Get-StorageJob. The space is not offline, ResiliencySettingName shows Mirror rather than Simple, and no rebuild of the pool is required.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: 'Refer to the exhibit. FS01 has 12 TB of raw capacity in the pool. About how much usable capacity will a new three-way mirror space get?',
    exhibit: `PS C:\\> Get-StoragePool -IsPrimordial $false | Select FriendlyName, Size, AllocatedSize

FriendlyName          Size AllocatedSize
------------          ---- -------------
Pool1       13194139533312             0`,
    options: ['About 12 TB', 'About 6 TB', 'About 4 TB', 'About 8 TB'],
    answer: [2],
    explanation: 'The Size is 12 TB (13,194,139,533,312 bytes). Three-way mirroring writes three copies, so efficiency is about 33%, giving about 4 TB usable. 12 TB is simple, 6 TB is two-way mirror, and 8 TB does not correspond to any mirror level.' },
  { topic: '4.1', type: 'multi', difficulty: 3, lesson: L41B,
    stem: 'Which two statements about dual parity in Storage Spaces Direct are correct? (Choose two.)',
    options: ['It requires at least four fault domains (servers)', 'It tolerates up to two simultaneous failures', 'It requires only three servers', 'Its storage efficiency is always exactly 33.3%', 'It is available in Windows Server Standard edition'],
    answer: [0, 1],
    explanation: 'Dual parity needs four fault domains and tolerates two failures, with 50% efficiency at four servers rising toward 80% at larger scale. Three servers is the single-parity minimum (discouraged), 33.3% is three-way mirror efficiency, and Storage Spaces Direct needs Datacenter edition.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: 'Refer to the exhibit. Why did the command fail?',
    exhibit: `PS C:\\> New-VirtualDisk -StoragePoolFriendlyName Pool1 -FriendlyName Data -ResiliencySettingName Mirror -NumberOfDataCopies 3 -UseMaximumSize
New-VirtualDisk : There are not enough physical disks in the specified storage pool to create the virtual disk.

PS C:\\> (Get-StoragePool Pool1 | Get-PhysicalDisk).Count
4`,
    options: ['A standalone three-way mirror needs at least five physical disks in the pool', 'Mirror spaces cannot use -NumberOfDataCopies', 'The pool must use ReFS first', 'Three-way mirrors require Storage Spaces Direct clusters'],
    answer: [0],
    explanation: 'Surviving two simultaneous disk failures with a mirror needs at least five disks, and the pool has four. -NumberOfDataCopies is the correct parameter, a pool has no file system, and three-way mirrors work on a standalone server.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41B,
    stem: 'Which cmdlet creates a storage pool from physical disks?',
    answer: ['New-StoragePool'],
    explanation: 'New-StoragePool takes -FriendlyName, -StorageSubsystemFriendlyName and -PhysicalDisks. New-VirtualDisk and New-Volume are used afterwards.' },

  // ---------- 4.1 iSCSI ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: 'Refer to the exhibit. HV01 connected to an iSCSI target and formatted the new disk. After a restart, the disk is gone. What should you have used on Connect-IscsiTarget?',
    exhibit: `PS C:\\> Get-IscsiConnection
(no output after reboot)

PS C:\\> Get-IscsiTarget | Select NodeAddress, IsConnected
NodeAddress                                              IsConnected
-----------                                              -----------
iqn.1991-05.com.microsoft:fs01-target1-target                  False`,
    options: ['-IsPersistent $true', '-AuthenticationType ONEWAYCHAP', '-TargetPortalPortNumber 3260', '-IsMultipathEnabled $false'],
    answer: [0],
    explanation: 'A session created without -IsPersistent $true is not re-established at boot. The CHAP setting changes authentication only, 3260 is already the default port, and disabling multipath does not make a session persist.' },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L41C,
    stem: 'Put the steps for presenting a new iSCSI LUN to a Windows initiator in order (first step at the top).',
    items: ['On the target server, create the iSCSI virtual disk (VHDX) and target and map them', 'On the initiator, start the MSiSCSI service and add the target portal', 'Connect to the discovered target with a persistent session', 'Initialize, partition and format the new disk'],
    explanation: 'The LUN must exist and be mapped to an allowed initiator before the initiator can discover it. The initiator then connects, and the raw disk is initialized and formatted like local storage.' },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41C,
    stem: 'What is the PowerShell feature name of the iSCSI Target Server role service installed with Install-WindowsFeature?',
    answer: ['FS-iSCSITarget-Server'],
    explanation: 'Install-WindowsFeature -Name FS-iSCSITarget-Server installs the iSCSI Target Server, which provides the IscsiTarget module cmdlets such as New-IscsiVirtualDisk.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41C,
    stem: 'What default TCP port does iSCSI use to reach the target portal? Enter the number.',
    answer: ['3260'],
    explanation: 'The iSCSI target portal listens on TCP 3260 by default, and New-IscsiTargetPortal reports TargetPortalPortNumber 3260.' },

  // ---------- 4.1 Data Deduplication ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: 'Which Data Deduplication usage type is designed for volumes that store virtual desktop infrastructure (VDI) VHDX files?',
    options: ['HyperV', 'Default', 'Backup', 'Archive'],
    answer: [0],
    explanation: 'HyperV optimizes in-use and partial files, which VDI VHDX files need. Default targets general purpose file servers, Backup targets virtualized backup applications, and Archive is not a usage type.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: 'Refer to the exhibit. You enabled deduplication on E: this morning and copied 500 GB of files to it an hour ago, but savings are zero. What is the most likely reason?',
    exhibit: `PS C:\\> Get-DedupVolume -Volume E: | Select Volume, Enabled, UsageType, MinimumFileAgeDays

Volume Enabled UsageType MinimumFileAgeDays
------ ------- --------- ------------------
E:        True Default                    3

PS C:\\> Get-DedupStatus -Volume E: | Select Volume, SavedSpace, OptimizedFilesCount, InPolicyFilesCount

Volume SavedSpace OptimizedFilesCount InPolicyFilesCount
------ ---------- ------------------- ------------------
E:           0 B                    0                  0`,
    options: ['The files are younger than the 3-day minimum file age, so none are in policy yet', 'Deduplication needs a reboot before it works', 'The Default usage type cannot deduplicate on NTFS', 'Deduplication is inline and only works on read'],
    answer: [0],
    explanation: 'Default skips files newer than MinimumFileAgeDays (3). InPolicyFilesCount of 0 confirms that no files qualify yet. No reboot is needed, Default works on NTFS volumes, and Data Deduplication is post-processing, not inline.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41C,
    stem: 'Which two conditions are not supported or are disallowed for Data Deduplication? (Choose two.)',
    options: ['Running deduplication inside a VM that has nested virtualization and hosts other VMs', 'A hard quota on the root of a deduplicated volume', 'A ReFS volume on Windows Server 2025', 'A Cluster Shared Volume on a failover cluster where every node has the feature installed', 'Backing up the volume with Windows Server Backup'],
    answer: [0, 1],
    explanation: 'Nested virtualization scenarios and hard quotas on a deduplicated volume root are unsupported. ReFS is supported since Windows Server 2019, CSVs are supported when all nodes have the feature, and Windows Server Backup can back up an optimized volume as-is.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41C,
    stem: 'What is the name of the feature you install with Install-WindowsFeature to add Data Deduplication?',
    answer: ['FS-Data-Deduplication'],
    explanation: 'Install-WindowsFeature -Name FS-Data-Deduplication adds the role service; Enable-DedupVolume then turns it on for a volume.' },

  // ---------- 4.2 Hyper-V ----------
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L42A,
    stem: 'A VM was created as Generation 1 and now must use UEFI and Secure Boot. What should the administrator do?',
    options: ['Create a new Generation 2 VM and migrate the workload; a VM generation cannot be changed', 'Run Set-VM -Generation 2 on the VM', 'Enable Secure Boot in the VM settings, which converts the firmware', 'Convert the VHDX to VHD'],
    answer: [0],
    explanation: 'Generation is fixed at creation. Set-VM has no Generation parameter, Generation 1 VMs have no Secure Boot setting, and changing the disk format does not change the VM firmware.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42A,
    stem: 'What is the maximum number of virtual processors for a Generation 2 VM on a Windows Server 2025 Hyper-V host? Enter the number without commas.',
    answer: ['2048', '2,048'],
    explanation: 'Windows Server 2025 supports 2,048 virtual processors (PowerShell only at that scale) and 240 TB of memory for Generation 2 VMs. Generation 1 stays at 64 vCPUs and 1 TB.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'A VM must boot from a virtual SCSI controller and use Secure Boot, a vTPM and a 100 GB boot VHDX that can be resized while running. Which generation do you choose?',
    options: ['Generation 2', 'Generation 1', 'Either, because both support these features', 'Generation 1 with legacy network adapters'],
    answer: [0],
    explanation: 'Only Generation 2 offers UEFI, Secure Boot, vTPM, SCSI boot and online boot-disk resize. Generation 1 is BIOS with IDE boot.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. An Ubuntu ISO fails to boot in a new Generation 2 VM named LNX01 with a Secure Boot violation. What is the best fix?',
    exhibit: `PS C:\\> Get-VMFirmware -VMName LNX01 | Select SecureBoot, SecureBootTemplate

SecureBoot SecureBootTemplate
---------- ------------------
        On MicrosoftWindows`,
    options: ['Set the Secure Boot template to MicrosoftUEFICertificateAuthority', 'Recreate the VM as Generation 1', 'Add a legacy network adapter', 'Switch the VHDX to the VHD format'],
    answer: [0],
    explanation: 'The Microsoft UEFI Certificate Authority template trusts the signed Linux boot loaders. Set-VMFirmware -SecureBootTemplate MicrosoftUEFICertificateAuthority (or turning Secure Boot off) resolves it. Generation 1 loses UEFI features and legacy adapters and VHD are unrelated to the violation.' },
  { topic: '4.2', type: 'match', difficulty: 1, lesson: L42A,
    stem: 'Match each Hyper-V virtual switch type to the connectivity it provides.',
    pairs: [['External', 'VMs, the physical network and optionally the management OS'], ['Internal', 'VMs and the management OS, but not the physical network'], ['Private', 'VMs on that switch only']],
    explanation: 'An external switch is bound to a physical NIC. An internal switch connects the VMs and the host. A private switch isolates the VMs from both the host and the physical network.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'You want VMs in a lab to reach the Hyper-V host to download tools, but to have no access to the corporate LAN. Which switch type should you create?',
    options: ['Internal', 'External', 'Private', 'External with AllowManagementOS set to false'],
    answer: [0],
    explanation: 'Internal gives VM-to-VM and VM-to-host connectivity without a physical NIC. Private would block the host, and both external options connect to the physical network.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42A,
    stem: 'Which cmdlet creates a Hyper-V virtual switch?',
    answer: ['New-VMSwitch'],
    explanation: 'New-VMSwitch with -NetAdapterName creates an external switch; -SwitchType Internal or Private creates the other types.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42A,
    stem: 'Refer to the exhibit. HV01 is a Generation 2 VM on your laptop, and installing the Hyper-V role inside it fails. What is the correct fix?',
    exhibit: `PS C:\\> Get-VMProcessor -VMName HV01 | Select Count, ExposeVirtualizationExtensions

Count ExposeVirtualizationExtensions
----- ------------------------------
    4                          False`,
    options: ['Turn the VM off and run Set-VMProcessor -VMName HV01 -ExposeVirtualizationExtensions $true', 'Enable Dynamic Memory so Hyper-V can allocate more RAM', 'Convert HV01 to Generation 1', 'Install integration services from an ISO'],
    answer: [0],
    explanation: 'Nested virtualization requires exposing the hardware virtualization extensions, which you set while the VM is off. Dynamic Memory does not enable nesting and does not resize while Hyper-V runs inside the VM, Generation 1 is not needed (Generation 2 is recommended), and integration services are built in.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42A,
    stem: 'Which cmdlet installs the Hyper-V role on Windows Server from PowerShell?',
    answer: ['Install-WindowsFeature'],
    explanation: 'Install-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart installs the role. Enable-WindowsOptionalFeature is the Windows client method.' },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L42B,
    stem: 'Which two statements about the VHDX format are correct? (Choose two.)',
    options: ['It supports virtual disks up to 64 TB', 'It protects against corruption from power failures by logging metadata updates', 'It is limited to 2,040 GB', 'It can be used only by Generation 1 VMs', 'It cannot be used for differencing disks'],
    answer: [0, 1],
    explanation: 'VHDX supports 64 TB and logs metadata changes. The 2,040 GB limit belongs to VHD. Both generations can use VHDX data disks, and VHDX supports differencing disks.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42B,
    stem: 'Which statement about applying a production checkpoint is correct?',
    options: ['The VM ends up powered off and boots like a restored backup, with no memory state restored', 'The VM resumes running with all applications open', 'It always requires a VM running Windows 10 or later', 'It can be created only while the VM is turned off'],
    answer: [0],
    explanation: 'Production checkpoints use VSS (or a Linux file system freeze) and do not save memory, so the applied VM boots from an off state. Standard checkpoints are the ones that resume running state. They work for supported Windows Server guests and can be taken while running.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42B,
    stem: 'You set a VM to CheckpointType ProductionOnly. The guest VSS writer is failing. What happens when you run Checkpoint-VM?',
    options: ['No checkpoint is taken', 'A standard checkpoint is taken instead', 'A production checkpoint is taken without VSS', 'The VM is paused and saved'],
    answer: [0],
    explanation: 'ProductionOnly never falls back. Plain Production would fall back to a standard checkpoint, which is the difference between the two values. Neither a VSS-less production checkpoint nor a pause is produced.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42B,
    stem: 'Why are standard checkpoints discouraged on a domain controller VM?',
    options: ['They revert the whole VM state, which can cause consistency problems for systems that replicate data between nodes, such as Active Directory', 'They are limited to ten per VM', 'They cannot be created on Generation 2 VMs', 'They encrypt the AD database'],
    answer: [0],
    explanation: 'Reverting a replicating system to an old state can desynchronize it from its partners. The limit is 50 checkpoints per VM, standard checkpoints work on Generation 2 VMs, and they do not encrypt anything.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42B,
    stem: 'Refer to the exhibit. A SQL VM is hitting its memory ceiling while running. What can you change without shutting the VM down?',
    exhibit: `PS C:\\> Get-VMMemory -VMName SQL01 | Select DynamicMemoryEnabled, Startup, Minimum, Maximum, Buffer, Priority

DynamicMemoryEnabled     Startup     Minimum     Maximum Buffer Priority
--------------------     -------     -------     ------- ------ --------
                True  2147483648  1073741824  8589934592     20       50`,
    options: ['Raise the Maximum value', 'Raise the Startup value', 'Disable Dynamic Memory', 'Raise the Minimum above Startup'],
    answer: [0],
    explanation: 'While a Dynamic Memory VM runs, Hyper-V lets you increase Maximum and decrease Minimum. Changing Startup or switching to static memory needs the VM off, and Minimum can never exceed Startup.' },
  { topic: '4.2', type: 'order', difficulty: 2, lesson: L42C,
    stem: 'Put these steps for setting up Hyper-V Replica in order (first step at the top).',
    items: ['Configure the replica server to accept replication and choose the authentication type', 'Enable the Hyper-V Replica firewall rule on the receiving host', 'Enable replication for the VM on the primary host', 'Send the initial copy of the VM'],
    explanation: 'You configure the receiving side first and open the firewall, then enable replication per VM, and finally complete initial replication so that delta replication can start.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42C,
    stem: 'Refer to the exhibit. After HV01 and HV02 were upgraded to Windows Server 2025, live migrations that worked before now fail. What is the best fix?',
    exhibit: `PS C:\\> Move-VM -Name APP01 -DestinationHost HV02
Move-VM : Virtual machine migration operation for 'APP01' failed at migration source 'HV01'.
Failed to establish a connection with host computer 'HV02': No credentials are available in the security package (0x8009030E).

PS C:\\> (Get-VMHost).VirtualMachineMigrationAuthenticationType
CredSSP`,
    options: ['Switch to Kerberos authentication and configure constrained delegation', 'Disable Credential Guard on every server in the domain', 'Change the performance option to SMB', 'Increase the maximum number of simultaneous live migrations'],
    answer: [0],
    explanation: 'Windows Server 2025 enables Credential Guard by default on domain-joined non-DC servers, which blocks CredSSP delegation. Microsoft recommends Kerberos with constrained delegation. Disabling Credential Guard weakens security, and the performance option and concurrency limit do not affect authentication.' },
  { topic: '4.2', type: 'multi', difficulty: 3, lesson: L42C,
    stem: 'For Kerberos-authenticated live migration, which two services must be delegated on each host\'s computer account for the partner host? (Choose two.)',
    options: ['cifs', 'Microsoft Virtual System Migration Service', 'LDAP', 'HTTP', 'MSSQLSvc'],
    answer: [0, 1],
    explanation: 'Constrained delegation for live migration targets the cifs service (file access to VHDX) and the Microsoft Virtual System Migration Service. LDAP, HTTP and MSSQLSvc are unrelated.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42C,
    stem: 'What is the shortest Hyper-V Replica replication frequency, in seconds? Enter the number.',
    answer: ['30', '30 seconds'],
    explanation: 'Hyper-V Replica frequencies are 30 seconds, 5 minutes and 15 minutes. Extended replication supports only 5 and 15 minutes.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42C,
    stem: 'Which statement describes Hyper-V Replica correctly?',
    options: ['It asynchronously replicates VM disks to another host for disaster recovery without needing shared storage', 'It synchronously mirrors a running VM so that failover has zero downtime and zero data loss', 'It moves a running VM between hosts with no downtime', 'It replaces backups because replicas keep unlimited history'],
    answer: [0],
    explanation: 'Replica is asynchronous DR with a configurable 30 second, 5 minute or 15 minute interval. Zero-downtime moves are live migration, synchronous zero-loss replication is not Replica behavior, and recovery points are limited to latest plus up to 24 hourly ones, so it is not a backup.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42C,
    stem: 'Refer to the exhibit. A cluster of these hosts will use Windows Server 2025 GPU partitioning with live migration. Which statement is correct?',
    exhibit: `PS C:\\> Get-CimInstance Win32_Processor | Select -First 1 Name
Name
----
AMD EPYC 7452 32-Core Processor     (EPYC 7002 series, "Rome")`,
    options: ['These CPUs support GPU partitioning but not live migration with it, so VMs would restart on failover', 'These CPUs fully support live migration with GPU partitioning', 'GPU partitioning is not possible on any AMD processor', 'GPU partitioning live migration needs Windows Server 2022'],
    answer: [0],
    explanation: 'Live migration with GPU partitioning requires IOMMU DMA bit tracking, available on AMD EPYC 7003 (Milan) and later and 4th Gen Intel Xeon Scalable. EPYC 7002 supports GPU-P but not live migration with it. GPU-P live migration is a Windows Server 2025 feature, not 2022.' },
  { topic: '4.2', type: 'multi', difficulty: 3, lesson: L42C,
    stem: 'Which two statements about GPU partitioning (GPU-P) in Windows Server 2025 are correct? (Choose two.)',
    options: ['Only one GPU partition can be assigned to a VM', 'The GPUs in a cluster must be the same make, model and size', 'The same physical GPU can be both a DDA device and partitioned at once', 'Live migration of a VM with a partition uses RDMA only', 'You can choose which specific partition a VM receives'],
    answer: [0, 1],
    explanation: 'A VM can have one GPU partition, and GPU configurations must be homogeneous. A GPU is either DDA or partitioned, never both. Live migration falls back to TCP/IP with compression, and partitions are auto-assigned, not chosen.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42C,
    stem: 'Which Hyper-V cmdlet assigns a GPU partition to a VM?',
    answer: ['Add-VMGpuPartitionAdapter'],
    explanation: 'Add-VMGpuPartitionAdapter -VMName <name> assigns the partition and Get-VMGpuPartitionAdapter verifies it. Get-VMHostPartitionableGpu lists host GPUs and valid partition counts.' },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
