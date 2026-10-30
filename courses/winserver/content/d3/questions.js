// Domain 3 — Manage virtual machines (10-15%). Question bank.
export default [
  {
    id: "d3-001",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "You have a Hyper-V host named HV1 that runs Windows Server 2025. Administrators connect to a Windows Server 2022 VM named VM1 by using Virtual Machine Connection. Remote Desktop is enabled in VM1. The administrators report that they can't paste files into VM1, can't redirect local drives, and the console window can't be resized. You run the command shown in the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-VMHost | Format-List Name, EnableEnhancedSessionMode

Name                      : HV1
EnableEnhancedSessionMode : False`,
    options: [
      "Enable the Remote Desktop inbound firewall rules inside VM1",
      "Run Set-VMHost -EnableEnhancedSessionMode $true on HV1",
      "Run Enable-VMIntegrationService -VMName VM1 -Name 'Guest Service Interface'",
      "Run Set-VM -VMName VM1 -EnhancedSessionTransportType HvSocket",
    ],
    answer: [1],
    explanation: `Clipboard file transfer, drive redirection and a resizable display are **enhanced session mode** features. The host policy is **off by default on Windows Server**, as the exhibit shows; enable it with \`Set-VMHost -EnableEnhancedSessionMode $true\` (the per-user setting is on by default).

* Guest Service Interface enables \`Copy-VMFile\`, not VMConnect features.
* Remote Desktop is already enabled in VM1 (Microsoft lists it as a guest requirement), and enhanced sessions travel over the VMBus rather than the guest's network, so TCP 3389 firewall rules aren't involved.
* The HvSocket transport type is for **Linux** guests using xrdp.`,
    lesson: "3.1-hyperv-vm-access-integration",
  },
  {
    id: "d3-002",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You create a VM named VM2 that runs Windows Server 2025 on a Hyper-V host named HV1. VM2 has no network adapter yet. You are signed in to HV1 as a member of Hyper-V Administrators. You need to run a PowerShell script inside VM2 that configures a static IP address before you connect VM2 to the network. What should you run on HV1?",
    options: [
      "Copy-VMFile -Name VM2 -SourcePath .\\Set-IP.ps1 -DestinationPath C:\\Set-IP.ps1 -FileSource Host",
      "Invoke-Command -ComputerName VM2 -Credential VM2\\Administrator -FilePath .\\Set-IP.ps1",
      "Enter-PSSession -HostName VM2 -UserName Administrator",
      "Invoke-Command -VMName VM2 -Credential VM2\\Administrator -FilePath .\\Set-IP.ps1",
    ],
    answer: [3],
    explanation: `**PowerShell Direct** (\`-VMName\`) runs commands in a Windows 10/Server 2016+ guest over the VMBus, so it works with **no network adapter**. You need to be a Hyper-V administrator on the host and supply **guest credentials**.

* \`-ComputerName\` uses WinRM over the network, which VM2 doesn't have.
* \`-HostName\` is PowerShell over SSH, also network-based.
* Copy-VMFile only copies the file (and needs Guest Service Interface enabled); it doesn't run the script.`,
    lesson: "3.1-hyperv-vm-access-integration",
  },
  {
    id: "d3-003",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "An administrator runs Enter-PSSession -VMName VM3 from a management workstation named ADM1 and receives an error. VM3 runs Windows Server 2022 on a Hyper-V host named HV2. Which two conditions must be met for PowerShell Direct to VM3 to work? (Choose two.)",
    options: [
      "The Guest Service Interface integration service must be enabled for VM3",
      "The command must be run on HV2, where VM3 is running",
      "The administrator must supply credentials that are valid inside VM3",
      "HV2 and VM3 must be members of the same AD DS domain",
      "WinRM must be enabled with an HTTPS listener in VM3",
      "VM3 must have a network adapter connected to an external virtual switch",
    ],
    answer: [1, 2],
    explanation: `PowerShell Direct works only from **the Hyper-V host where the VM is running**, by a user who is a Hyper-V administrator on that host, and it needs **valid guest credentials**. ADM1 is a remote workstation, so the command fails there.

* No network adapter, WinRM listener or domain membership is needed - the session uses the VMBus.
* Guest Service Interface is used by Copy-VMFile; PowerShell Direct uses the Hyper-V PowerShell Direct service (\`vmicvmsession\`).`,
    lesson: "3.1-hyperv-vm-access-integration",
  },
  {
    id: "d3-004",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "A Hyper-V host named HV1 runs Windows Server 2025 and hosts an Ubuntu VM named Ubuntu1. The Ubuntu kernel includes Hyper-V socket (vsock) support, and sshd in the guest is configured to listen on vsock port 22 as well as on TCP. Ubuntu1's network configuration is broken, and you must open a shell in Ubuntu1 from HV1 without using the network. What should you run on HV1?",
    options: [
      "vmconnect.exe localhost Ubuntu1 /edit",
      "ssh admin1@Ubuntu1",
      "hvc ssh admin1@Ubuntu1",
      "Enter-PSSession -VMName Ubuntu1 -Credential admin1",
    ],
    answer: [2],
    explanation: `**SSH Direct** uses \`hvc.exe\` to run SSH over **Hyper-V sockets** instead of TCP/IP: \`hvc ssh\` launches the host's ssh client with \`hvc nc\` as a proxy that opens a vsock connection to port 22 in the guest. Because sshd listens on vsock, \`hvc ssh admin1@Ubuntu1\` works even when the guest network is broken. (A stock sshd listens only on TCP, which is why the stem states the vsock listener.)

* PowerShell Direct (\`-VMName\`) works only with **Windows** guests.
* Plain \`ssh\` resolves the name and connects over TCP/IP, which is broken.
* VMConnect's \`/edit\` opens the VM settings dialog; a VMConnect console session also wouldn't be a shell session from the host's command line.`,
    lesson: "3.1-hyperv-vm-access-integration",
  },
  {
    id: "d3-005",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You run Copy-VMFile -Name VM1 -SourcePath D:\\Tools\\agent.msi -DestinationPath C:\\Temp\\agent.msi -FileSource Host on a Hyper-V host, and the command fails. VM1 runs Windows Server 2025 and is running. You run the command shown in the exhibit. What should you do?",
    exhibit: `PS C:\\> Get-VMIntegrationService -VMName VM1

VMName Name                    Enabled PrimaryStatusDescription SecondaryStatusDescription
------ ----                    ------- ------------------------ --------------------------
VM1    Guest Service Interface False   OK
VM1    Heartbeat               True    OK                       OK
VM1    Key-Value Pair Exchange True    OK
VM1    Shutdown                True    OK
VM1    Time Synchronization    True    OK
VM1    VSS                     True    OK`,
    options: [
      "Run Set-VMHost -EnableEnhancedSessionMode $true",
      "Add -CreateFullPath and run the command from inside VM1",
      "Run Enable-VMIntegrationService -VMName VM1 -Name 'Guest Service Interface'",
      "Run Enable-VMIntegrationService -VMName VM1 -Name 'Key-Value Pair Exchange'",
    ],
    answer: [2],
    explanation: `\`Copy-VMFile\` depends on the **Guest Service Interface** integration service, which is the only integration service **disabled by default**. Enable it and rerun the command (add \`-CreateFullPath\` if C:\\Temp might not exist).

* Key-Value Pair Exchange is already enabled and is used for exchanging metadata, not files.
* Enhanced session mode affects VMConnect, not Copy-VMFile.
* Copy-VMFile runs on the **host**; running it inside the guest makes no sense.`,
    lesson: "3.1-hyperv-vm-access-integration",
  },
  {
    id: "d3-006",
    topic: "3.1",
    type: "fill",
    difficulty: 3,
    stem: "You configure xrdp in an Ubuntu VM named Ubuntu2 on a Windows Server 2025 Hyper-V host that already allows enhanced session mode. To use enhanced sessions with Ubuntu2, you must run Set-VM -VMName Ubuntu2 with one more parameter set to HvSocket. What is the parameter name? (Enter the parameter name.)",
    answer: [
      "EnhancedSessionTransportType",
      "-EnhancedSessionTransportType",
    ],
    explanation: "`Set-VM -VMName Ubuntu2 -EnhancedSessionTransportType HvSocket` switches the enhanced session transport to Hyper-V sockets, which xrdp in Linux guests uses. Windows guests use the default VMBus transport.",
    lesson: "3.1-hyperv-vm-access-integration",
  },
  {
    id: "d3-007",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "A Hyper-V host named HV1 runs Windows Server 2025 on AMD EPYC processors. You imported a VM named LabHV1 from an older host and ran the commands shown in the exhibit. When you start LabHV1 and try to install the Hyper-V role inside it, setup reports that the processor doesn't have the required virtualization capabilities. What should you do?",
    exhibit: `PS C:\\> Get-VM -Name LabHV1 | Format-Table Name, State, Version

Name   State Version
----   ----- -------
LabHV1 Off   8.0

PS C:\\> Get-VMProcessor -VMName LabHV1 | Format-List ExposeVirtualizationExtensions

ExposeVirtualizationExtensions : True`,
    options: [
      "Run Update-VMVersion -Name LabHV1 while the VM is off",
      "Run Set-VMNetworkAdapter -VMName LabHV1 -MacAddressSpoofing On",
      "Run Set-VMProcessor -VMName LabHV1 -CompatibilityForMigrationEnabled $true",
      "Disable dynamic memory for LabHV1",
    ],
    answer: [0],
    explanation: `Nested virtualization on **AMD** hosts needs Windows Server 2022 or later **and VM configuration version 9.3 or higher**. LabHV1 is at **8.0** (enough only for Intel hosts), so upgrade it with \`Update-VMVersion\` while it's off; extensions are already exposed.

* MAC spoofing is needed for nested VM networking, not for installing Hyper-V.
* Processor compatibility mode *hides* CPU features and would make things worse.
* Dynamic memory doesn't stop the Hyper-V role from installing.`,
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-008",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You enabled nested virtualization on a VM named LabHV1 on a Windows Server 2025 host, and installed Hyper-V inside LabHV1. LabHV1 has one network adapter connected to an external virtual switch on the physical host. Nested VMs inside LabHV1 are connected to an external switch inside LabHV1, but they can't reach anything on the physical network. LabHV1 itself has network connectivity. What should you do?",
    options: [
      "Run Set-VMProcessor -VMName LabHV1 -ExposeVirtualizationExtensions $true again",
      "Run Set-VMNetworkAdapter -VMName LabHV1 -AllowTeaming On on the physical host",
      "Run Set-VMNetworkAdapter -VMName LabHV1 -MacAddressSpoofing On on the physical host",
      "Run Set-VMNetworkAdapter -VMName LabHV1 -DhcpGuard On on the physical host",
    ],
    answer: [2],
    explanation: `Frames from nested VMs carry the **nested VMs' MAC addresses**, which the outer virtual switch drops unless **MAC address spoofing** is enabled on LabHV1's adapter. (The alternative is NAT inside LabHV1.)

* DHCP guard drops DHCP server messages from the VM - the opposite of helping.
* AllowTeaming is for guest NIC teams.
* Virtualization extensions are already exposed - Hyper-V installed and the nested VMs run.`,
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-009",
    topic: "3.1",
    type: "order",
    difficulty: 2,
    stem: "You need to configure an existing Windows Server 2025 VM named LabHV2 on an Intel host so that it can run its own Hyper-V VMs. LabHV2 is currently running. In which order should you perform the actions?",
    items: [
      "Shut down LabHV2",
      "Run Set-VMProcessor -VMName LabHV2 -ExposeVirtualizationExtensions $true",
      "Start LabHV2",
      "Install the Hyper-V role inside LabHV2 and restart it",
      "Create an external virtual switch inside LabHV2",
    ],
    explanation: "`ExposeVirtualizationExtensions` can only be changed while the VM is **off**. Then start the VM and install Hyper-V inside it like on a physical server; the virtual switch can only be created once the role is installed. For the nested VMs to reach the physical network you also turn on **MAC address spoofing** on LabHV2's adapter on the physical host (or use NAT inside LabHV2).",
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-010",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "VM4 runs Windows Server 2025 with dynamic memory enabled: Startup RAM 4 GB, Minimum RAM 2 GB, Maximum RAM 8 GB. VM4 is running and must not be restarted. Which two changes can you make? (Choose two.)",
    options: [
      "Decrease Maximum RAM below the memory currently assigned to VM4",
      "Disable dynamic memory",
      "Decrease Minimum RAM to 1 GB",
      "Increase Maximum RAM to 16 GB",
      "Change Startup RAM to 6 GB",
    ],
    answer: [2, 3],
    explanation: `While a dynamic memory VM runs, Hyper-V lets you **raise the maximum** and **lower the minimum** (widening the range).

* Enabling or disabling dynamic memory requires the VM to be **off**.
* Startup RAM is applied at boot, so it can't be changed while running.
* You can't lower the maximum below what the VM currently has assigned.`,
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-011",
    topic: "3.1",
    type: "match",
    difficulty: 2,
    stem: "Match each Hyper-V cmdlet to the task it performs.",
    pairs: [
      [
        "Dismount-VMHostAssignableDevice",
        "Remove a PCIe device from the host so it can be passed through to a VM",
      ],
      [
        "Add-VMAssignableDevice",
        "Assign a dismounted PCIe device to a VM by its location path",
      ],
      [
        "Set-VMHostPartitionableGpu",
        "Set how many partitions a physical GPU is divided into",
      ],
      [
        "Add-VMGpuPartitionAdapter",
        "Give a VM a partition of a GPU",
      ],
      [
        "Set-VMProcessor -ExposeVirtualizationExtensions",
        "Allow a VM to run its own hypervisor",
      ],
    ],
    explanation: "**DDA** uses `Dismount-VMHostAssignableDevice` (host side) then `Add-VMAssignableDevice` (VM side). **GPU-P** sets the partition count on the host GPU with `Set-VMHostPartitionableGpu` and attaches a partition with `Add-VMGpuPartitionAdapter`. **Nested virtualization** is `Set-VMProcessor -ExposeVirtualizationExtensions $true`.",
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-012",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You have a Hyper-V cluster that runs Windows Server 2025 Datacenter. Each node has one NVIDIA L4 GPU. You need to give 12 virtual desktop VMs GPU acceleration. Each VM needs only a fraction of a GPU, and VMs must be live-migrated between nodes during maintenance. What should you use?",
    options: [
      "RemoteFX vGPU",
      "Discrete Device Assignment (DDA)",
      "Nested virtualization",
      "GPU partitioning (GPU-P)",
    ],
    answer: [3],
    explanation: `**GPU partitioning** in Windows Server 2025 splits a supported GPU (the L4 is on the list) into partitions shared by several VMs, and Windows Server 2025 supports **live migration** of GPU-P VMs (clustering requires Datacenter, which you have).

* DDA assigns a **whole** GPU to **one** VM and doesn't support live migration.
* RemoteFX vGPU was removed from Windows Server years ago.
* Nested virtualization has nothing to do with GPUs.`,
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-013",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "You plan to use GPU partitioning on Windows Server 2025 Hyper-V hosts. VMs with GPU partitions must automatically fail over to another host if their host fails unexpectedly. Which edition must the hosts run?",
    options: [
      "Windows Server 2025 Standard",
      "Windows Server 2025 Datacenter",
      "Any edition, because GPU-P doesn't support failover clustering",
      "Windows Server 2025 Datacenter: Azure Edition only",
    ],
    answer: [1],
    explanation: `GPU-P is designed for standalone servers too (planned live migration between standalone hosts), but **failover clustering for unplanned downtime with GPU-P requires Windows Server 2025 Datacenter**.

* Standard doesn't meet the clustering requirement for GPU-P.
* Azure Edition isn't required.
* GPU-P *does* support clustering on Datacenter.`,
    lesson: "3.1-hyperv-compute-memory-gpu",
  },
  {
    id: "d3-014",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "A Generation 1 VM named Archive1 stores data on the virtual disk shown in the exhibit, attached to a SCSI controller. You need to grow the disk to 3 TB. What should you do first?",
    exhibit: `PS C:\\> Get-VHD -Path D:\\VMs\\Archive1.vhd

ComputerName            : HV1
Path                    : D:\\VMs\\Archive1.vhd
VhdFormat               : VHD
VhdType                 : Dynamic
FileSize                : 1846384640000
Size                    : 2190433320960
MinimumSize             : 2190432272384
LogicalSectorSize       : 512
PhysicalSectorSize      : 512
BlockSize               : 2097152
ParentPath              :
DiskIdentifier          : 3C9D4E1A-7B2F-4A8C-9E65-0D1F2B3A4C5E
FragmentationPercentage : 14
Alignment               : 1
Attached                : False`,
    options: [
      "Run Convert-VHD -Path D:\\VMs\\Archive1.vhd -DestinationPath D:\\VMs\\Archive1.vhdx",
      "Run Optimize-VHD -Path D:\\VMs\\Archive1.vhd -Mode Full",
      "Run Resize-VHD -Path D:\\VMs\\Archive1.vhd -SizeBytes 3TB",
      "Convert Archive1 to a Generation 2 VM",
    ],
    answer: [0],
    explanation: `The disk is a **VHD** at 2,190,433,320,960 bytes - exactly **2,040 GB**, the VHD format's maximum. Convert it to **VHDX** (64 TB maximum) with \`Convert-VHD\` (which writes a new file, so the disk must be detached, as it is), attach the new file, then \`Resize-VHD\` to 3 TB.

* Resize-VHD can't take a VHD beyond 2,040 GB.
* Optimize-VHD compacts; it doesn't increase capacity.
* You can't change a VM's generation, and it isn't needed for a data disk.`,
    lesson: "3.1-hyperv-disks-checkpoints",
  },
  {
    id: "d3-015",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "VM5 runs a line-of-business application with a SQL Server database. Before an application upgrade, you need to create checkpoints of VM5 that never include the VM's memory state. If an application-consistent checkpoint can't be created, the checkpoint attempt must fail. Which command should you run?",
    options: [
      "Set-VM -Name VM5 -CheckpointType ProductionOnly",
      "Set-VM -Name VM5 -CheckpointType Production",
      "Set-VM -Name VM5 -AutomaticCheckpointsEnabled $true",
      "Set-VM -Name VM5 -CheckpointType Standard",
    ],
    answer: [0],
    explanation: `**ProductionOnly** uses VSS for an application-consistent checkpoint and **fails** if it can't, instead of falling back.

* **Production** (the default) falls back to a standard checkpoint, which includes memory state.
* **Standard** always captures memory.
* Automatic checkpoints control *when* checkpoints are taken, not their type.`,
    lesson: "3.1-hyperv-disks-checkpoints",
  },
  {
    id: "d3-016",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "The volume that stores a VM named SQL1 is almost full because of old checkpoints. The checkpoints are shown in the exhibit. You need to free the space while keeping SQL1's current state and keeping SQL1 running. What should you do?",
    exhibit: `PS C:\\> Get-VMCheckpoint -VMName SQL1 | Format-Table VMName, Name, CreationTime, ParentSnapshotName

VMName Name                           CreationTime          ParentSnapshotName
------ ----                           ------------          ------------------
SQL1   SQL1 - (3/2/2026 - 9:14:02 PM) 3/2/2026 9:14:02 PM
SQL1   Before CU update               6/18/2026 7:40:11 AM  SQL1 - (3/2/2026 - 9:14:02 PM)
SQL1   Before app 4.2                 9/30/2026 6:05:47 PM  Before CU update`,
    options: [
      "Run Get-VMCheckpoint -VMName SQL1 | Remove-VMCheckpoint",
      "Run Restore-VMCheckpoint -VMName SQL1 -Name 'Before app 4.2'",
      "Delete the .avhdx files in the VM's folder",
      "Run Optimize-VHD on each .avhdx file",
    ],
    answer: [0],
    explanation: `Removing checkpoints with **Remove-VMCheckpoint** merges each differencing (.avhdx) disk into its parent **online**, keeping the current state and freeing space when the merge completes.

* Deleting .avhdx files by hand destroys every change made after the checkpoint and breaks the disk chain.
* Restoring a checkpoint **discards** the current state.
* Optimize-VHD compacts a disk but doesn't remove the checkpoint chain and can't run on in-use differencing disks.`,
    lesson: "3.1-hyperv-disks-checkpoints",
  },
  {
    id: "d3-017",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You are building a two-node guest failover cluster from VMs named SQLC1 and SQLC2 on a Hyper-V cluster that uses Cluster Shared Volumes. The cluster's shared data disk must be resizable while the guest cluster is online and must support host-based backup. What should you use for the shared disk?",
    options: [
      "A fixed VHDX file with the Enable Virtual Hard Disk Sharing option",
      "A pass-through disk presented to both VMs",
      "A VHD Set (.vhds) file on a CSV attached to both VMs' SCSI controllers",
      "Two differencing disks that share one parent VHDX",
    ],
    answer: [2],
    explanation: `**VHD Sets** (\`.vhds\`, Windows Server 2016+) are the supported shared virtual disk format for guest clusters and add **online resize** and **host-based backup**, which the older shared VHDX lacked.

* Shared VHDX can't be resized online or backed up at the host.
* A pass-through disk can't be shared by two VMs at once and prevents checkpoints/backup.
* Differencing children of one parent are separate disks, not shared storage.`,
    lesson: "3.1-hyperv-disks-checkpoints",
  },
  {
    id: "d3-018",
    topic: "3.1",
    type: "fill",
    difficulty: 1,
    stem: "A dynamically expanding VHDX file is 120 GB on disk, but the guest only uses 40 GB after a cleanup. You detach the disk and want to reclaim the unused space in the file. Which Hyper-V cmdlet should you run? (Enter the cmdlet name.)",
    answer: [
      "Optimize-VHD",
    ],
    explanation: "`Optimize-VHD -Path <file> -Mode Full` compacts **dynamically expanding and differencing** disks (detached, or attached read-only). It has no effect on fixed disks. `Resize-VHD` changes the maximum size, not the file's allocated space.",
    lesson: "3.1-hyperv-disks-checkpoints",
  },
  {
    id: "d3-019",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "You use production checkpoints for Windows Server VMs. Which two statements are true? (Choose two.)",
    options: [
      "When you restore one, the VM is in the Off state",
      "They are stored outside the VM's storage, so they can replace backups",
      "They use the Volume Shadow Copy Service inside the guest to create an application-consistent checkpoint",
      "They capture the VM's memory and processor state",
      "They require the Guest Service Interface integration service",
    ],
    answer: [0, 2],
    explanation: `Production checkpoints rely on **VSS** (the VSS integration service) and don't include memory, so a restored VM starts from the **Off** state, like after a clean shutdown.

* Capturing memory is what **standard** checkpoints do.
* Guest Service Interface is for Copy-VMFile.
* Checkpoints live with the VM's storage (as .avhdx files) and are **not** backups.`,
    lesson: "3.1-hyperv-disks-checkpoints",
  },
  {
    id: "d3-020",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "A new Hyper-V host named HV3 runs Windows Server 2025. An administrator created an LBFO team named Team1 from two physical adapters and then ran the command shown in the exhibit. You need VMs on HV3 to use both adapters for fault tolerance. What should you do?",
    exhibit: `PS C:\\> New-VMSwitch -Name External -NetAdapterName Team1 -AllowManagementOS $true
New-VMSwitch : Failed while adding virtual Ethernet switch connections.
An LBFO team cannot be attached to a virtual Hyper-V switch. If teaming is required, use "New-VMSwitch" to create a
Switch Embedded Team (SET).`,
    options: [
      "Create two external switches, one per adapter, and give each VM one adapter on each switch without teaming",
      "Remove Team1, then run New-VMSwitch -Name External -NetAdapterName 'NIC1','NIC2' -EnableEmbeddedTeaming $true",
      "Run New-VMSwitch with -SwitchType Internal and bind Team1 to it",
      "Change Team1 to LACP mode with Set-NetLbfoTeam and rerun the command",
    ],
    answer: [1],
    explanation: `On Windows Server 2022 and 2025, a Hyper-V switch **can't be bound to an LBFO team**. **Switch Embedded Teaming (SET)**, created with \`New-VMSwitch -EnableEmbeddedTeaming $true\` on the physical adapters, is the supported way to team NICs for a virtual switch. Remove the LBFO team first so the adapters are free.

* Changing the LBFO mode doesn't lift the restriction.
* An internal switch isn't bound to physical adapters at all.
* Two separate switches without any teaming give each VM no automatic failover (it would need guest teaming).`,
    lesson: "3.1-hyperv-networking",
  },
  {
    id: "d3-021",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "A Hyper-V host uses the SET switch shown in the exhibit. The network team configured the two physical switch ports connected to the host as a single LACP port channel. VMs now experience intermittent connectivity loss. You need to resolve the issue. What should you do?",
    exhibit: `PS C:\\> Get-VMSwitchTeam -Name SETswitch | Format-List

Name                           : SETswitch
Id                             : 8a3f1c2e-5b7d-4e9a-b6c1-2d4f6a8e0c13
NetAdapterInterfaceDescription : {Mellanox ConnectX-6 Lx Adapter, Mellanox ConnectX-6 Lx Adapter #2}
TeamingMode                    : SwitchIndependent
LoadBalancingAlgorithm         : HyperVPort`,
    options: [
      "Run Set-VMSwitchTeam -Name SETswitch -LoadBalancingAlgorithm Dynamic",
      "Run Set-VMSwitchTeam -Name SETswitch -TeamingMode Lacp",
      "Replace SETswitch with an LBFO team in LACP mode",
      "Remove the LACP port channel and configure the two physical switch ports as independent trunk ports",
    ],
    answer: [3],
    explanation: `SET supports **Switch Independent** teaming only. The physical switch must treat each port independently; an LACP port channel on the switch side mismatches the host and causes flapping and drops. Configure the ports as normal trunks carrying the same VLANs.

* SET has no LACP teaming mode.
* Changing the load-balancing algorithm doesn't fix the switch-side aggregation mismatch.
* An LBFO team can't host a Hyper-V switch on current Windows Server.`,
    lesson: "3.1-hyperv-networking",
  },
  {
    id: "d3-022",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "A developer's test VM named DevVM1 was accidentally configured as a DHCP server and is handing out addresses to other VMs on the external switch. You need to prevent DevVM1 from affecting other clients, while still allowing DevVM1 to obtain its own address through DHCP. What should you do?",
    options: [
      "Run Set-VMNetworkAdapter -VMName DevVM1 -DhcpGuard On",
      "Run Set-VMNetworkAdapter -VMName DevVM1 -MacAddressSpoofing Off",
      "Run Set-VMNetworkAdapter -VMName DevVM1 -RouterGuard On",
      "Run Set-VMNetworkAdapterVlan -VMName DevVM1 -Untagged",
    ],
    answer: [0],
    explanation: `**DHCP guard** drops DHCP **server** messages (offers/acks) coming from the VM, while the VM can still act as a DHCP **client**.

* Router guard drops router advertisements and redirects, not DHCP.
* MAC spoofing is off by default and unrelated.
* Changing the VLAN setting to untagged doesn't stop DHCP offers on the same network.`,
    lesson: "3.1-hyperv-networking",
  },
  {
    id: "d3-023",
    topic: "3.1",
    type: "match",
    difficulty: 2,
    stem: "Match each Hyper-V virtual switch configuration to the scenario it fits best.",
    pairs: [
      [
        "External switch",
        "VMs need to reach the physical network and the internet",
      ],
      [
        "Internal switch",
        "VMs need to talk to each other and to the host only",
      ],
      [
        "Private switch",
        "VMs need to talk only to each other, fully isolated from the host",
      ],
      [
        "Internal switch plus New-NetNat",
        "Lab VMs need outbound internet access through the host's IP address",
      ],
      [
        "External switch with -EnableEmbeddedTeaming $true",
        "VMs need fault-tolerant access through two physical NICs",
      ],
    ],
    explanation: "An **External** switch binds to a physical NIC. **Internal** adds a host vNIC but no physical NIC. **Private** connects VMs only. **NAT** is built from an internal switch, an IP on its host vNIC and `New-NetNat`. **SET** (`-EnableEmbeddedTeaming`) teams up to eight physical NICs inside an external switch.",
    lesson: "3.1-hyperv-networking",
  },
  {
    id: "d3-024",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "VM5 has two virtual network adapters connected to two different external virtual switches. Inside VM5 you created a Switch Independent NIC team from both adapters. When the physical NIC behind ExtSwitchA fails, VM5 loses connectivity instead of failing over. You run the command shown in the exhibit on the host. What should you do?",
    exhibit: `PS C:\\> Get-VMNetworkAdapter -VMName VM5 | Format-Table Name, SwitchName, AllowTeaming

Name  SwitchName AllowTeaming
----  ---------- ------------
NIC-A ExtSwitchA Off
NIC-B ExtSwitchB Off`,
    options: [
      "Recreate the team inside VM5 in LACP mode",
      "Connect both adapters to ExtSwitchA",
      "Run Set-VMNetworkAdapter -VMName VM5 -MacAddressSpoofing On -DhcpGuard On",
      "Run Set-VMNetworkAdapter -VMName VM5 -AllowTeaming On",
    ],
    answer: [3],
    explanation: `Guest NIC teaming requires **AllowTeaming On** for each VM adapter on the host; otherwise the host drops frames when the team moves a MAC address between adapters. Both adapters show **Off**.

* MAC spoofing isn't the setting Hyper-V uses for guest teams, and DHCP guard is unrelated.
* Putting both adapters on one switch removes the redundancy you want.
* Guest teams must be **Switch Independent**; LACP isn't supported inside a VM.`,
    lesson: "3.1-hyperv-networking",
  },
  {
    id: "d3-025",
    topic: "3.1",
    type: "fill",
    difficulty: 1,
    stem: "What is the maximum number of physical network adapters that can be members of a single Switch Embedded Teaming (SET) team? (Enter a number.)",
    answer: [
      "8",
      "eight",
    ],
    explanation: "A SET team can contain **one to eight** physical Ethernet adapters, which should be identical in make, model, firmware and speed.",
    lesson: "3.1-hyperv-networking",
  },
  {
    id: "d3-026",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "You have two standalone Hyper-V hosts named HV1 and HV2 that run Windows Server 2022 in the contoso.com domain. Live migration is enabled on both hosts and uses CredSSP authentication. From your management workstation you run the command shown in the exhibit. You need administrators to be able to start live migrations from their workstations. What should you do?",
    exhibit: `PS C:\\> Move-VM -ComputerName HV1 -Name VM3 -DestinationHost HV2 -IncludeStorage -DestinationStoragePath D:\\VMs\\VM3
Move-VM : Virtual machine migration operation for 'VM3' failed at migration source 'HV1'.
Failed to establish a connection with host 'HV2': No credentials are available in the security package (0x8009030E).`,
    options: [
      "Add HV2 to the TrustedHosts list on HV1",
      "Configure constrained delegation on the HV1 and HV2 computer accounts for the Microsoft Virtual System Migration Service and cifs services, and set the live migration authentication type to Kerberos",
      "Set the live migration performance option to SMB on both hosts",
      "Run Enable-WSManCredSSP -Role Client on your workstation",
    ],
    answer: [1],
    explanation: `With **CredSSP**, HV1 must hold your credentials to authenticate to HV2, which only happens when you are **signed in to the source host**; a command run from a workstation leaves HV1 with nothing to delegate, hence \`0x8009030E\`. For remote initiation use **Kerberos** with **constrained delegation** for the *Microsoft Virtual System Migration Service* and *cifs* services (cifs because \`-IncludeStorage\` moves files over SMB), and set the migration authentication type to Kerberos on both hosts. Kerberos is also required once the hosts move to Windows Server 2025, where Credential Guard (on by default) blocks CredSSP live migration altogether.

* Enabling only the CredSSP client role on the workstation doesn't hand HV1 credentials for its connection to HV2, and Microsoft's supported design for remote initiation is Kerberos constrained delegation.
* TrustedHosts affects WinRM to non-Kerberos targets; it has nothing to do with host-to-host migration authentication in a domain.
* The performance option affects transport, not authentication.`,
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-027",
    topic: "3.1",
    type: "multi",
    difficulty: 3,
    stem: "You configure Kerberos authentication for shared-nothing live migration between two standalone Hyper-V hosts named HV1 and HV2. On the Delegation tab of each computer account you select Trust this computer for delegation to specified services only. Which two services must you add for the other host? (Choose two.)",
    options: [
      "cifs",
      "HTTP",
      "WSMAN",
      "RPCSS",
      "Microsoft Virtual System Migration Service",
      "ldap",
    ],
    answer: [0, 4],
    explanation: "Kerberos live migration uses constrained delegation to the other host's **Microsoft Virtual System Migration Service** (the migration itself) and **cifs** (copying VHDX/storage over SMB for shared-nothing or storage moves). HTTP, ldap, RPCSS and WSMAN aren't required for live migration.",
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-028",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You have a Hyper-V failover cluster. Half the nodes have newer Intel Xeon processors than the others. Live migrations of VM6 from new nodes to old nodes fail with a processor feature mismatch. You need to be able to live-migrate VM6 between all nodes. What should you do?",
    options: [
      "Configure the live migration performance option to Compression",
      "Run Set-VMProcessor -VMName VM6 -ExposeVirtualizationExtensions $false while VM6 is running",
      "Add VM6 to an availability set",
      "Shut down VM6 and run Set-VMProcessor -VMName VM6 -CompatibilityForMigrationEnabled $true",
    ],
    answer: [3],
    explanation: `**Processor compatibility mode** hides newer CPU instructions from the VM so it can move between hosts of **different generations from the same vendor**. It must be set with the VM **off**.

* Exposing or hiding virtualization extensions is about nested virtualization.
* The performance option affects the transfer, not CPU features.
* Availability sets are an Azure concept.`,
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-029",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You enable Hyper-V Replica for VM1 from a host named HV1 to a replica server named HV-DR1 by using Kerberos authentication on port 80. Initial replication fails. You run the commands shown in the exhibit. What should you do?",
    exhibit: `PS C:\\> Measure-VMReplication -VMName VM1

VMName State Health   LReplTime PReplSize(M) AvgLatency AvgReplSize(M) Relationship
------ ----- ------   --------- ------------ ---------- -------------- ------------
VM1    Error Critical           0.00         00:00:00   0.00           Simple

PS C:\\> Get-NetFirewallRule -DisplayName 'Hyper-V Replica HTTP Listener (TCP-In)' -CimSession HV-DR1 |
          Format-Table DisplayName, Enabled

DisplayName                            Enabled
-----------                            -------
Hyper-V Replica HTTP Listener (TCP-In)   False`,
    options: [
      "Enable the Hyper-V Replica HTTP Listener (TCP-In) firewall rule on HV-DR1",
      "Install the Hyper-V Replica Broker role on HV-DR1",
      "Change the replication frequency to 30 seconds",
      "Enable the Hyper-V Replica HTTPS Listener (TCP-In) firewall rule on HV1",
    ],
    answer: [0],
    explanation: `The replica server's listener firewall rules are **disabled by default**. With Kerberos authentication, the primary connects to **TCP 80** on the replica, so enable the **HTTP** listener rule on **HV-DR1**.

* The HTTPS rule is for certificate authentication (443), and the primary doesn't need an inbound rule.
* Frequency doesn't affect connectivity.
* The Replica Broker role is only for a replica **cluster**.`,
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-030",
    topic: "3.1",
    type: "order",
    difficulty: 2,
    stem: "VM1 replicates from HV1 (primary site) to HV-DR1 (DR site) by using Hyper-V Replica. You need to move VM1 to the DR site for planned maintenance without losing any data, and then replicate changes back to HV1. In which order should you perform the actions?",
    items: [
      "Shut down VM1 on HV1",
      "On HV1, run Start-VMFailover -VMName VM1 -Prepare",
      "On HV-DR1, run Start-VMFailover -VMName VM1",
      "On HV-DR1, run Set-VMReplication -VMName VM1 -Reverse",
    ],
    explanation: "A **planned failover** requires the primary VM to be **off** so no new changes occur. `-Prepare` on the primary sends all pending changes. Failover on the replica makes the replica copy the active VM, `-Reverse` (possible only after the failover) makes HV-DR1 the new primary and HV1 the replica; you then start VM1 on HV-DR1. (Hyper-V Manager's Planned Failover wizard performs the same steps.)",
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-031",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "You use Hyper-V Replica between two sites connected by a 1 Gbps link. Management requires that VM8 lose no more than one minute of data if the primary site fails. VM8 is replicated directly to the DR site, without extended replication. What should you configure?",
    options: [
      "Configure 24 additional hourly recovery points",
      "Set the replication frequency to 30 seconds",
      "Set the replication frequency to 5 minutes",
      "Set the app-consistent snapshot frequency to 1 hour",
    ],
    answer: [1],
    explanation: `The replication frequency sets the maximum data loss for an unplanned failover. The choices are **30 seconds, 5 minutes and 15 minutes**; only 30 seconds meets a one-minute RPO.

* 5 minutes exceeds the RPO.
* Additional recovery points and VSS snapshot frequency control how far back you can go, not how current the replica is.`,
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-032",
    topic: "3.1",
    type: "fill",
    difficulty: 1,
    stem: "You configure a Hyper-V Replica server to accept replication by using Kerberos authentication with the default port. Which TCP port must be allowed inbound on the replica server? (Enter the port number.)",
    answer: [
      "80",
    ],
    explanation: "Kerberos authentication uses **HTTP on TCP 80** (traffic is compressed but not encrypted). Certificate-based authentication uses HTTPS on TCP 443.",
    lesson: "3.1-hyperv-ha-replica",
  },
  {
    id: "d3-033",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "You promoted an Azure VM named DC3 to a domain controller and placed the AD DS database, logs and SYSVOL on its data disk. You run the command shown in the exhibit. You need to follow Microsoft's guidance for domain controllers in Azure. What should you do?",
    exhibit: `$ az vm show --resource-group RG-Identity --name DC3 --query "storageProfile.dataDisks[].{lun:lun, name:name, caching:caching, sku:managedDisk.storageAccountType}" --output table
Lun    Name      Caching    Sku
-----  --------  ---------  -----------
0      DC3-NTDS  ReadWrite  Premium_LRS`,
    options: [
      "Change the disk SKU to Standard_LRS",
      "Move the AD DS database to the temporary disk",
      "Change the host caching of DC3-NTDS to None",
      "Change the host caching of DC3-NTDS to ReadOnly",
    ],
    answer: [2],
    explanation: `AD DS needs write-through behaviour for its database and logs, so the data disk holding NTDS and SYSVOL must use host caching **None**. ReadWrite (shown) can cache writes and risks corruption on host failure.

* ReadOnly is for read-heavy data such as SQL data files, not AD DS.
* Standard HDD lowers performance and doesn't address caching.
* The temporary disk is wiped on deallocation or redeployment - never put data there.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-034",
    topic: "3.2",
    type: "single",
    difficulty: 3,
    stem: "VM2 is an Azure VM that runs Windows Server 2025. It has a 2 TiB Premium SSD data disk that must be expanded to 8 TiB. Which statement describes what you must do?",
    options: [
      "Expand the disk while VM2 is running, and then extend the volume in Windows",
      "Deallocate VM2 (or detach the disk), expand the disk, start VM2, and then extend the volume in Windows",
      "Expand the disk while VM2 is running; Windows extends the volume automatically",
      "Create a new 8 TiB disk, because Premium SSD disks can't be expanded",
    ],
    answer: [1],
    explanation: `Data disks normally expand **without downtime**, but a Standard HDD, Standard SSD or **Premium SSD disk of 4 TiB or less** must be **detached or the VM deallocated** to grow **beyond 4 TiB**. After the resize, extend the partition in Windows - Azure never resizes the guest volume for you.

* Online expansion would work for 2 TiB to 4 TiB, not to 8 TiB.
* Premium SSD disks can be expanded; only shrinking isn't supported.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-035",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "VM4 is a running Azure VM of size Standard_D4s_v5. You need to resize it to Standard_E16s_v5, which is available in the region. You run the command shown in the exhibit. What should you do?",
    exhibit: `$ az vm list-vm-resize-options --resource-group RG1 --name VM4 --output table
MaxDataDiskCount    MemoryInMB    Name               NumberOfCores    OsDiskSizeInMB    ResourceDiskSizeInMB
------------------  ------------  -----------------  ---------------  ----------------  ----------------------
4                   8192          Standard_D2s_v5    2                1047552           0
8                   16384         Standard_D4s_v5    4                1047552           0
16                  32768         Standard_D8s_v5    8                1047552           0`,
    options: [
      "Deallocate VM4, then resize it to Standard_E16s_v5",
      "Redeploy VM4 to a new host, then resize it",
      "Run az vm resize --size Standard_E16s_v5 while VM4 is running",
      "Create a new VM of size Standard_E16s_v5 and move the disks, because a VM can't change size family",
    ],
    answer: [0],
    explanation: `\`list-vm-resize-options\` shows only the sizes available on the **hardware cluster currently hosting** the VM. When the target isn't listed, **deallocate** the VM; it can then be allocated on any cluster in the region that offers the size.

* Resizing while running will fail because the size isn't on the current cluster.
* Redeploy moves the VM to another host but doesn't guarantee a cluster with E-series and is unnecessary.
* VMs can change families when the target size is available and compatible.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-036",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "You plan a Virtual Machine Scale Set for a Windows Server web tier. Requirements: instances of different VM sizes must coexist in the set, individual instances must be manageable with the standard VM APIs, and instances must be spread across availability zones. Which configuration should you use?",
    options: [
      "A scale set with Uniform orchestration across zones 1, 2 and 3",
      "An availability set with three fault domains",
      "A scale set with Flexible orchestration across zones 1, 2 and 3",
      "A scale set with Uniform orchestration and five fixed fault domains",
    ],
    answer: [2],
    explanation: `**Flexible orchestration** creates standard VM resources that you can manage individually, supports **mixed sizes**, and can spread instances across zones - it's Microsoft's recommended mode.

* Uniform requires identical instances managed through the scale set.
* Availability sets don't scale and can't span zones.
* Fixed fault domains in Uniform mode still don't allow mixed sizes.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-037",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "You configure autoscale for a scale set named WebVMSS. Requirements: never fewer than 2 or more than 10 instances; add 2 instances when average CPU exceeds 75 percent for 10 minutes; remove 1 instance when average CPU is below 25 percent for 10 minutes. Which two settings meet the requirements? (Choose two.)",
    options: [
      "A scale-out rule only, because autoscale scales in automatically when CPU falls",
      "A scale-out rule: Percentage CPU > 75 average 10 minutes, increase count by 2, plus a scale-in rule: Percentage CPU < 25 average 10 minutes, decrease count by 1",
      "Instance limits: minimum 2, maximum 10, default 2",
      "A scheduled profile that sets 10 instances during business hours",
      "Instance limits: minimum 1, maximum 10, default 2",
    ],
    answer: [1, 2],
    explanation: `Autoscale needs **instance limits** (minimum 2, maximum 10; the default count of 2 is what autoscale uses if metrics are unavailable) and explicit **rules in both directions** - a scale-out rule and a matching scale-in rule. Autoscale never scales in without a rule.

* A minimum of 1 lets the set shrink below the required two instances.
* A scale-out rule alone never removes instances.
* A schedule doesn't react to CPU.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-038",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "You have an existing Azure VM named App1 in a region without availability zones. You create an availability set named AS1 and need App1 to be part of AS1 so that it qualifies for the 99.95 percent SLA together with a second VM. What should you do?",
    options: [
      "Move App1 to a different resource group that contains AS1",
      "Open App1's Availability + scale settings and select AS1",
      "Delete App1 while keeping its disks, and recreate it from the existing OS disk in AS1",
      "Run az vm update --set availabilitySet.id=<AS1 id> while App1 is deallocated",
    ],
    answer: [2],
    explanation: `A VM can be added to an availability set **only when it is created**. For an existing VM, delete the VM (keeping the managed disks), then create a new VM in AS1 that attaches the existing OS disk (and data disks).

* There's no setting or update operation that moves an existing VM into a set, even when deallocated.
* Resource group location doesn't change availability set membership.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-039",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "You plan to deploy two Azure VMs named DC11 and DC12 as domain controllers in the East US 2 region, which supports availability zones. You need to maximise the availability of AD DS in the region if an entire datacenter fails. What should you do?",
    options: [
      "Deploy DC11 in zone 1 and DC12 in zone 2",
      "Deploy DC11 and DC12 in a Uniform scale set with five fault domains in one zone",
      "Deploy DC11 and DC12 in the same availability set with three fault domains",
      "Deploy DC11 and DC12 in zone 1 with a proximity placement group",
    ],
    answer: [0],
    explanation: `**Availability zones** are separate datacenters, so placing the DCs in **different zones** protects against the loss of a datacenter and carries the **99.99%** SLA.

* An availability set spreads VMs across racks within **one** datacenter (99.95%).
* Both VMs in one zone share the datacenter failure risk.
* Fault domains inside one zone still don't protect against zone loss.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-040",
    topic: "3.2",
    type: "fill",
    difficulty: 1,
    stem: "What is the maximum number of fault domains you can configure for an Azure availability set? (Enter a number.)",
    answer: [
      "3",
      "three",
    ],
    explanation: "Availability sets support up to **3 fault domains** (some regions only 2) and up to **20 update domains** (default 5). These counts can't be changed after the set is created.",
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-041",
    topic: "3.2",
    type: "match",
    difficulty: 2,
    stem: "Match each Azure managed disk type to the workload it suits best.",
    pairs: [
      [
        "Ultra Disk",
        "SAP HANA and top-tier databases that need the highest IOPS and throughput Azure offers",
      ],
      [
        "Premium SSD v2",
        "Production SQL Server data disks that need sub-millisecond latency at lower cost than the top tier, billed by provisioned GiB, IOPS and MBps",
      ],
      [
        "Premium SSD",
        "OS disks and production workloads that need consistent low latency",
      ],
      [
        "Standard SSD",
        "Web servers and lightly used production or dev/test servers",
      ],
      [
        "Standard HDD",
        "Backup copies and infrequently accessed data at the lowest cost",
      ],
    ],
    explanation: "**Ultra Disk** and **Premium SSD v2** offer performance configurable independently of size but can't be OS disks and have no host caching. **Premium SSD** is the standard choice for production OS and data disks. **Standard SSD** suits light workloads; **Standard HDD** is cheapest for infrequent access.",
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-042",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "You are deploying new Windows Server 2025 Azure VMs. Security requires that the temporary disk and the OS and data disk caches be encrypted at rest, and that you avoid a technology that is scheduled for retirement. What should you enable?",
    options: [
      "Server-side encryption with platform-managed keys only",
      "BitLocker inside the guest with keys stored on the temporary disk",
      "Encryption at host",
      "Azure Disk Encryption",
    ],
    answer: [2],
    explanation: `**Encryption at host** encrypts the **temporary disk and disk caches** on the VM host and flows encrypted data to storage. It's Microsoft's recommended replacement for **Azure Disk Encryption**, which retires on **September 15, 2028**.

* Server-side encryption is always on but doesn't cover temp disks or caches.
* Keys on the temp disk would be lost on deallocation - and that isn't a supported design.`,
    lesson: "3.2-azure-vm-storage-capacity-availability",
  },
  {
    id: "d3-043",
    topic: "3.2",
    type: "single",
    difficulty: 1,
    stem: "You plan to use just-in-time (JIT) VM access to protect RDP on Azure VMs in a subscription named Sub1. Which prerequisite must you meet first?",
    options: [
      "Deploy Azure Bastion Standard in each virtual network",
      "Enable Microsoft Defender for Servers Plan 1 on Sub1",
      "Enable Microsoft Defender for Servers Plan 2 on Sub1",
      "Install the Azure Monitor Agent on each VM",
    ],
    answer: [2],
    explanation: `JIT VM access is a **Defender for Servers Plan 2** feature in Microsoft Defender for Cloud. The VMs also need an NSG or a classic-rule Azure Firewall.

* Bastion is a separate access service and isn't required for JIT.
* Plan 1 doesn't include JIT.
* JIT works on NSG/firewall rules and needs no agent in the VM.`,
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-044",
    topic: "3.2",
    type: "single",
    difficulty: 3,
    stem: "You enabled JIT VM access on VM7 for port 3389. Users can still connect to VM7 by RDP from any internet address without requesting access. The NSG on VM7's NIC contains the rules shown in the exhibit. What should you do?",
    exhibit: `$ az network nsg rule list --resource-group RG1 --nsg-name VM7-nsg --query "[].{Name:name, Priority:priority, Access:access, Source:sourceAddressPrefix, Port:destinationPortRange}" --output table
Name                                                               Priority    Access    Source    Port
-----------------------------------------------------------------  ----------  --------  --------  ------
AllowRDP                                                           300         Allow     *         3389
SecurityCenter-JITRule_1873102918_E1C3D4B2A6F84B95A0C7B1D2E3F4A5B6  1000        Deny      *         3389`,
    options: [
      "Change the JIT policy's maximum request time to 1 hour",
      "Delete the AllowRDP rule",
      "Add a rule that denies TCP 3389 from Internet at priority 4000",
      "Add a second NSG to the subnet that allows TCP 3389",
    ],
    answer: [1],
    explanation: `When you enable JIT and a rule for the port already exists, **the existing rule keeps priority** over JIT's deny rule. AllowRDP (priority 300) is evaluated before the JIT deny (1000), so RDP stays open to everyone. Delete the permanent allow rule; JIT then adds temporary higher-priority allow rules per request.

* A deny rule at priority 4000 is evaluated **after** AllowRDP (300), so it never matches.
* Request duration doesn't matter while a permanent allow exists.
* Another allowing NSG makes exposure worse, not better.`,
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-045",
    topic: "3.2",
    type: "match",
    difficulty: 2,
    stem: "Match each requirement to the minimum Azure Bastion SKU that meets it.",
    pairs: [
      [
        "Free access to one VM at a time in a dev/test VNet, with no dedicated subnet",
        "Developer",
      ],
      [
        "Dedicated Bastion that reaches VMs in peered spoke VNets from the Azure portal",
        "Basic",
      ],
      [
        "Connect with the native Windows Remote Desktop client by using az network bastion rdp",
        "Standard",
      ],
      [
        "Record sessions for compliance and deploy without a public IP address on Bastion",
        "Premium",
      ],
    ],
    explanation: "**Developer** is free, shared, one VM at a time, no peering and no AzureBastionSubnet. **Basic** is dedicated, supports VNet peering and portal connections. **Standard** adds the native client, shareable links, IP-based connection, custom ports and host scaling. **Premium** adds session recording and private-only deployment.",
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-046",
    topic: "3.2",
    type: "fill",
    difficulty: 1,
    stem: "You are deploying Azure Bastion Standard into VNet1. What exact name must the dedicated subnet have? (Enter the subnet name.)",
    answer: [
      "AzureBastionSubnet",
    ],
    explanation: "Basic, Standard and Premium Bastion require a subnet named exactly **AzureBastionSubnet**, sized **/26 or larger**. The Developer SKU uses shared infrastructure and needs no subnet.",
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-047",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "VM9 is an Azure VM that runs Windows Server 2025 in VNet1 and has no public IP address. Administrators on the internet need RDP access to VM9. You must not deploy a VPN, and VM9 must not receive a public IP address. Which two solutions each meet the requirements? (Choose two.)",
    options: [
      "Configure Windows Admin Center in the Azure portal for VM9 and connect by using VM9's private IP address",
      "Deploy Azure Bastion Basic in VNet1 and connect from the Azure portal",
      "Deploy Azure Bastion Standard in VNet1, enable native client support, and connect with az network bastion rdp",
      "Enable just-in-time VM access for port 3389 on VM9",
      "Add an inbound NSG rule that allows TCP 3389 from the Internet service tag to VM9",
    ],
    answer: [1, 2],
    explanation: `Bastion connects to VMs' **private IPs** and users reach Bastion over TLS 443, so both the **portal** (Basic or higher) and the **native client** (Standard or higher) satisfy the requirements.

* JIT opens NSG rules on a reachable address; without a public IP or VPN there is nothing to reach.
* An NSG rule can't help a VM with no public IP, and would be bad practice anyway.
* WAC in the portal for an Azure VM over its private IP needs network line-of-sight from the admin's browser, which requires a VPN or similar.`,
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-048",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "DC21 is an Azure VM that will run AD DS and DNS. Its IP address must never change, even after the VM is deallocated. How should you configure the IP address?",
    options: [
      "Associate a Standard SKU public IP address with DC21",
      "Configure a static IP address in the IPv4 settings of the Windows network adapter inside DC21",
      "Create a DHCP reservation on a Windows DHCP server in the VNet",
      "Set the private IP address allocation to Static in the IP configuration of DC21's network interface, and leave Windows set to obtain an address automatically",
    ],
    answer: [3],
    explanation: `Azure assigns VM addresses through its own DHCP. Set the private IP to **Static in Azure** (the NIC's IP configuration); Windows keeps DHCP and always receives that address. (A dynamic private IP usually survives deallocation too, but only a static allocation guarantees the exact address, which is what Microsoft recommends for DCs and DNS servers.)

* Hard-coding an IP inside Windows can disconnect the VM and isn't supported practice.
* A public IP doesn't fix the private address that clients and DNS use.
* You can't run your own DHCP server to hand out addresses to Azure VMs.`,
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-049",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "You need to add a second network interface to an Azure VM named NVA1 so that it can connect to another subnet. Which two statements are true? (Choose two.)",
    options: [
      "The new network interface can be in a different virtual network if the networks are peered",
      "Azure DHCP gives the secondary network interface its own default gateway",
      "NVA1 must be stopped (deallocated) before you can attach the new network interface",
      "Any VM size supports up to eight network interfaces",
      "The new network interface must be in the same virtual network as NVA1's primary network interface",
    ],
    answer: [2, 4],
    explanation: `Adding or removing NICs requires the VM to be **deallocated**, and all NICs of a VM must be in the **same VNet** (different subnets are fine).

* Peering doesn't allow a VM's NICs to span VNets.
* Only the **primary** NIC receives a default gateway; routes for secondary NICs must be configured in the guest.
* The maximum number of NICs depends on the VM size.`,
    lesson: "3.2-azure-vm-access-networking",
  },
  {
    id: "d3-050",
    topic: "3.2",
    type: "single",
    difficulty: 3,
    stem: "Web1 is an Azure VM in Subnet1. Users can't reach the HTTPS site on Web1 from the internet through its public IP address. The network security groups that apply to Web1 are shown in the exhibit. What should you do?",
    exhibit: `NSG: Subnet1-nsg (associated with Subnet1) - inbound rules
Priority  Name                           Port  Protocol  Source             Destination     Action
200       Allow-HTTPS-In                 443   TCP       Internet           Any             Allow
65000     AllowVnetInBound               Any   Any       VirtualNetwork     VirtualNetwork  Allow
65001     AllowAzureLoadBalancerInBound  Any   Any       AzureLoadBalancer  Any             Allow
65500     DenyAllInBound                 Any   Any       Any                Any             Deny

NSG: Web1-nic-nsg (associated with the network interface of Web1) - inbound rules
Priority  Name                           Port  Protocol  Source             Destination     Action
65000     AllowVnetInBound               Any   Any       VirtualNetwork     VirtualNetwork  Allow
65001     AllowAzureLoadBalancerInBound  Any   Any       AzureLoadBalancer  Any             Allow
65500     DenyAllInBound                 Any   Any       Any                Any             Deny`,
    options: [
      "Change the priority of Allow-HTTPS-In in Subnet1-nsg to 100",
      "Add an inbound rule that allows TCP 443 from Internet to Web1-nic-nsg",
      "Add an outbound rule that allows TCP 443 to Internet in Subnet1-nsg",
      "Remove the DenyAllInBound rule from Web1-nic-nsg",
    ],
    answer: [1],
    explanation: `When NSGs are associated with both the **subnet** and the **NIC**, inbound traffic must be allowed by **both** (subnet NSG first, then NIC NSG). Subnet1-nsg allows 443, but Web1-nic-nsg only has default rules, so **DenyAllInBound** drops it. Add an allow rule for 443 to the NIC NSG (or remove the NIC NSG).

* Priority 200 already wins in the subnet NSG.
* NSGs are stateful, so return traffic needs no outbound rule.
* Default rules can't be deleted.`,
    lesson: "3.2-azure-vm-access-networking",
  },
];
