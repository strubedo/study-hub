// Domain 1 — Network Infrastructure and Connectivity: question bank.
// Original exam-style questions. Options are shuffled by the app.
export default [
  // ---------------------------------------------------------------- 1.1
  {
    id: 'd1-001',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A network printer on SW1 Gi1/0/2 prints very slowly. The printer's NIC was manually set to 100 Mbps full duplex. What is the cause of the problem?",
    exhibit: `SW1# show interfaces GigabitEthernet1/0/2 status

Port         Name               Status       Vlan       Duplex  Speed Type
Gi1/0/2      PRINTER-2F         connected    20           a-half  a-100 10/100/1000BaseTX

SW1# show interfaces GigabitEthernet1/0/2 | include duplex|CRC|late collision
  Half-duplex, 100Mb/s, media type is 10/100/1000BaseTX
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     0 babbles, 377 late collision, 0 deferred`,
    options: [
      'A duplex mismatch: SW1 fell back to half duplex and is logging late collisions',
      'A speed mismatch: the port should have negotiated 1000 Mbps instead of 100 Mbps',
      'The copper run exceeds 100 m, and excessive length is the only possible cause of late collisions',
      'Auto-MDIX failed because the printer is hard-coded, so a crossover cable is required',
    ],
    answer: [0],
    explanation: "The printer is hard-coded to 100/full, so it does not auto-negotiate. SW1 (on auto) uses parallel detection: it can sense 100 Mbps, but it cannot learn the duplex, so at 10/100 Mbps it falls back to **half duplex** (`a-half`). The half-duplex side sees the full-duplex peer transmit mid-frame and logs **late collisions**, which is exactly what the counters show. Fix: set both ends to auto (preferred) or hard-code both to 100/full.\n\n* **Speed mismatch** is wrong: the printer is a 100 Mbps device and the port correctly runs at `a-100`; a true speed mismatch would bring the link down (notconnect).\n* **Cable over 100 m** can also cause late collisions, but here the duplex settings explain the symptom completely; length is not 'the only cause'.\n* **Auto-MDIX failure** would leave the link down; the port is `connected`.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-002',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'A switch port is hard-coded to 100 Mbps full duplex. The PC connected to it has its NIC set to auto-negotiate. Which two counters will increase on the switch port? (Choose two.)',
    options: ['CRC errors', 'Runts', 'Late collisions', 'Giants', 'Collisions'],
    answer: [0, 1],
    explanation: "The PC cannot negotiate with a hard-coded partner, so it falls back to **half duplex**; the switch port is **full duplex**. The full-duplex side receives frames that the half-duplex PC aborted when it detected a 'collision', so the switch logs **CRC (FCS) errors** and **runts** (fragments under 64 bytes).\n\n* **Late collisions** and **collisions** appear on the *half-duplex* side (the PC). A full-duplex port does not run CSMA/CD and should show zero collisions.\n* **Giants** (oversized frames) indicate MTU/jumbo mismatches, not duplex problems.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-003',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. An AI network assistant produced this diagnosis for a slow uplink between SW2 and SW3. Which statement best evaluates the assistant's recommendation?",
    exhibit: `NetAssist AI > Diagnosis: SW2 Gi1/0/14 <-> SW3 Gi1/0/14

Observed on SW2:  Full-duplex, 100Mb/s (configured: speed 100, duplex full)
                  2915 CRC   1204 runts   0 collisions   0 late collision
Observed on SW3:  Half-duplex, 100Mb/s (configured: speed auto, duplex auto)
                  0 CRC      0 runts      2107 collisions  611 late collision

Diagnosis:      Physical cable degradation between SW2 and SW3.
Recommendation: Replace the patch cable on SW2 Gi1/0/14 and clear counters.
Confidence:     0.82`,
    options: [
      'Incorrect: it is a duplex mismatch; set both ends to auto-negotiate',
      'Correct: CRC errors and runts always indicate a damaged cable',
      'Incorrect: the counters show a speed mismatch; set both ends to 1000 Mbps',
      'Partially correct: replace the cable and enable Auto-MDIX on SW2 to remove the late collisions',
    ],
    answer: [0],
    explanation: "The assistant read only SW2's CRC/runt counters. Looking at **both** ends shows the classic duplex-mismatch signature: SW2 is hard-coded full duplex and logs CRC errors and runts; SW3 is on auto, fell back to half duplex, and logs collisions and **late collisions**. A bad cable would not make one side half duplex and would typically produce CRC errors on both ends. Fix the settings: auto/auto on both ends, or the same hard-coded speed and full duplex on both.\n\n* 'CRC errors always indicate a damaged cable' is false: duplex mismatch, EMI, and bad optics also cause them.\n* Speed is 100 Mbps on both ends; there is no speed mismatch (that would bring the link down).\n* Auto-MDIX deals with cable pinouts; it has nothing to do with collisions, and the link is already up.\n\nLesson for AI output: verify that the evidence supports the conclusion, and check both sides of a link before accepting a 'replace the cable' recommendation.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-004',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. SW1 Te1/1/2 connects over 2 km of single-mode fiber to SW2 using 10GBASE-LR optics on both ends, and the link is down. On SW2, the optic for this link reports Tx power -2.2 dBm and Rx power -3.0 dBm. What is the most likely cause?",
    exhibit: `SW1# show interfaces transceiver
If device is externally calibrated, only calibrated values are printed.
++ : high alarm, +  : high warning, -  : low warning, -- : low alarm.
NA or N/A: not applicable, Tx: transmit, Rx: receive.
mA: milliamperes, dBm: decibels (milliwatts).

                                           Optical   Optical
            Temperature  Voltage  Current  Tx Power  Rx Power
Port        (Celsius)    (Volts)  (mA)     (dBm)     (dBm)
---------   -----------  -------  -------  --------  --------
Te1/1/1       33.1       3.30      36.2     -2.2      -3.1
Te1/1/2       32.7       3.29      35.9     -2.4     -19.6 --`,
    options: [
      'Excessive loss on the strand from SW2 to SW1, such as a dirty connector or a tight bend',
      'The Te1/1/2 optic on SW1 has a failing transmitter and must be replaced',
      'The Te1/1/2 receiver is overloaded by a long-reach optic and needs an inline attenuator',
      'The Tx and Rx strands are crossed at an intermediate patch panel between the buildings',
    ],
    answer: [0],
    explanation: "SW2 transmits at a normal -2.2 dBm, but SW1 receives only -19.6 dBm (low alarm `--`): about 17 dB lost on that one strand, far more than the 1-2 dB expected for 2 km of SMF plus a few connectors. The other direction is healthy (SW1 Tx -2.4 dBm arrives at SW2 as -3.0 dBm). So the problem is in the path from SW2 to SW1: clean and inspect connectors, check patch panels and bends, then test the strand.\n\n* SW1's **transmitter** is fine: its Tx is -2.4 dBm and SW2 receives it at -3.0 dBm.\n* **Overload** would show a *high* Rx alarm (`++`), not a very low reading.\n* **Crossed strands** (Tx to Tx) would leave *both* receivers with essentially no light; SW2 is receiving normally.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-005',
    topic: '1.1',
    type: 'match',
    difficulty: 1,
    stem: 'Match each interface status/protocol combination to the condition that produces it.',
    pairs: [
      ['administratively down / down', 'The shutdown command is configured on the interface'],
      ['down / down', 'The cable is unplugged, or both ends are hard-coded to different speeds'],
      ['up / down', 'A serial link has HDLC on one end and PPP on the other'],
      ['up / up', 'Layer 1 and Layer 2 are both operational'],
      ['down / down (err-disabled)', 'BPDU Guard shut the port after it received a BPDU'],
    ],
    explanation: "* **Administratively down** appears only when `shutdown` is configured.\n* **Down/down** means no usable physical signal: no cable, far end off or shut, speed mismatch between two hard-coded ends, or a bad/mismatched optic.\n* **Up/down** means the physical layer is fine but Layer 2 fails, classically an encapsulation mismatch (HDLC vs PPP) or keepalive problem on serial links.\n* **Up/up** is working at Layers 1 and 2.\n* A port shut by a protection feature such as BPDU Guard or port security shows **down/down (err-disabled)**, and `err-disabled` in `show interfaces status`.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-006',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Two switches in different wiring closets are connected at 10GBASE-T over an existing 85 m Cat6 cable run. The link flaps and accumulates CRC errors, but it is clean when both ends are forced to 1 Gbps. What is the best explanation?',
    options: [
      'Cat6 supports 10GBASE-T only to about 55 m; Cat6a or fiber is needed',
      'The cable run exceeds the 100 m maximum channel length for twisted-pair Ethernet',
      '10GBASE-T requires a crossover cable whenever two switches are connected directly',
      '10GBASE-T must fall back to half duplex on any run longer than 50 m',
    ],
    answer: [0],
    explanation: "Cat6 is rated to 250 MHz and supports 10GBASE-T only up to roughly **55 m**; Cat6a (500 MHz) supports 10GBASE-T to the full 100 m. At 85 m on Cat6, the 10G signal suffers excessive crosstalk and attenuation, causing CRC errors and flaps, while 1000BASE-T runs fine.\n\n* 85 m is within the 100 m copper limit, so length alone against that limit is not the issue.\n* 10GBASE-T and 1000BASE-T PHYs handle pair swaps automatically, and the link works at 1G with the same cable, so the cable type (straight vs crossover) is not the problem.\n* 10GBASE-T is full duplex only; there is no half-duplex mode.",
    lesson: '1.1-cabling-media',
  },
  {
    id: 'd1-007',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: 'Two buildings 8 km apart are connected by single-mode fiber. The switches have SFP+ ports, and the link must run at 10 Gbps. Which transceiver should be installed at each end?',
    options: ['10GBASE-LR SFP+', '10GBASE-SR SFP+', '1000BASE-LX SFP', '10GBASE-T SFP+'],
    answer: [0],
    explanation: "**10GBASE-LR** uses a 1310 nm laser over single-mode fiber and reaches **10 km**, so it covers 8 km at 10 Gbps.\n\n* **10GBASE-SR** is an 850 nm multimode optic (about 300 m on OM3, 400 m on OM4).\n* **1000BASE-LX** suits single-mode, but it runs at only 1 Gbps.\n* **10GBASE-T** is copper twisted pair, limited to 100 m (and 10GBASE-T SFP+ modules typically reach only about 30 m).",
    lesson: '1.1-cabling-media',
  },
  {
    id: 'd1-008',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the maximum channel length, in meters, of a 1000BASE-T copper link, including patch cords?',
    answer: ['100', '100 m', '100m', '100 meters', '100 metres'],
    explanation: "Twisted-pair Ethernet (10BASE-T through 10GBASE-T on Cat6a) is limited to **100 m** per channel: up to 90 m of permanent horizontal cable plus up to 10 m of patch cords. Longer runs need an intermediate switch or fiber.",
    lesson: '1.1-cabling-media',
  },
  {
    id: 'd1-009',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'SW1 Gi1/0/48 and SW2 Gi1/0/48 were connected with a straight-through cable, and the link was up. An engineer then configured `speed 100` and `duplex full` on both ports. Now both ports show notconnect. What is the most likely reason?',
    options: [
      'Hard-coding speed disabled Auto-MDIX, so the straight-through cable no longer works',
      'A duplex mismatch between the two ports is preventing the link from coming up',
      'GigabitEthernet switch ports cannot be configured to operate at 100 Mbps',
      'The cable now exceeds the shorter maximum length allowed for 100 Mbps operation',
    ],
    answer: [0],
    explanation: "Two switches are 'like' devices (both MDI-X), so a straight-through cable works only because **Auto-MDIX** swaps the pairs. On many Catalyst platforms Auto-MDIX operates only when speed is auto-negotiated; once the speed is hard-coded, the port stops swapping pairs, transmit meets transmit, and the link stays down. Fix: return to `speed auto` or use a crossover cable. (Exact Auto-MDIX behavior with fixed speed varies by platform and software release, which is why best practice is auto/auto.)\n\n* Both ends were set to the same values (100/full), so there is no duplex mismatch, and a duplex mismatch would not bring the link down anyway.\n* 10/100/1000 ports support 100 Mbps.\n* The maximum length is 100 m at every twisted-pair speed; the cable did not get longer.",
    lesson: '1.1-cabling-media',
  },
  {
    id: 'd1-010',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which two actions can bring Gi1/0/5 out of the err-disabled state? (Choose two.)',
    exhibit: `%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Gi1/0/5 with BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Gi1/0/5, putting Gi1/0/5 in err-disable state`,
    options: [
      'Remove the device that sent the BPDU, then enter `shutdown` followed by `no shutdown` on Gi1/0/5',
      'Configure `errdisable recovery cause bpduguard` so the switch re-enables the port after the recovery interval',
      'Enter `clear counters GigabitEthernet1/0/5`',
      'Enter `no spanning-tree portfast` on Gi1/0/5',
      'Enter `clear mac address-table dynamic interface GigabitEthernet1/0/5`',
    ],
    answer: [0, 1],
    explanation: "An err-disabled port stays down until it is bounced manually (`shutdown` / `no shutdown`) or an automatic **errdisable recovery** timer for that cause re-enables it. Always remove the cause first (here, the switch or device sending BPDUs), or the port will be err-disabled again as soon as the next BPDU arrives.\n\n* `clear counters` only resets statistics.\n* Removing PortFast does not re-enable a port that is already err-disabled.\n* Clearing MAC addresses has no effect on the port state.",
    lesson: '1.1-interface-errors',
  },

  // ---------------------------------------------------------------- 1.2
  {
    id: 'd1-011',
    topic: '1.2',
    type: 'single',
    difficulty: 1,
    stem: 'Which statement describes a type 1 hypervisor?',
    options: [
      'It runs directly on the server hardware without a general-purpose host OS beneath it, for example VMware ESXi',
      'It runs as an application on top of a host operating system, for example Oracle VirtualBox',
      'It shares the host OS kernel among isolated application instances, for example Docker Engine',
      'It schedules containers across a cluster of hosts, for example Kubernetes',
    ],
    answer: [0],
    explanation: "A **type 1 (bare-metal)** hypervisor such as ESXi, Hyper-V, or Xen runs directly on the hardware and hosts VMs with minimal overhead. (KVM is also generally classed as type 1 because it turns the Linux kernel itself into the hypervisor, even though a full Linux OS is present.)\n\n* Running as an application on a host OS describes a **type 2 (hosted)** hypervisor such as VirtualBox or VMware Workstation.\n* Sharing the host kernel among isolated instances describes a **container runtime**, not a hypervisor.\n* Scheduling containers across a cluster is the job of a **container orchestrator**.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-012',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements correctly compare containers with virtual machines? (Choose two.)',
    options: [
      "Containers share the host operating system's kernel",
      'Containers are typically much smaller and start much faster than VMs',
      'Each container includes a complete guest operating system and kernel',
      'Containers provide stronger isolation than VMs because each has dedicated virtual hardware',
      'A Linux container host can natively run Windows containers alongside Linux containers',
      'Containers can run only on top of a type 2 hypervisor',
    ],
    answer: [0, 1],
    explanation: "Containers virtualize the **operating system**: they share the host kernel and package only the application and its dependencies, so images are megabytes rather than gigabytes and start in about a second or less.\n\n* A full guest OS and kernel per instance describes a **VM**.\n* VMs, not containers, have dedicated virtual hardware and the stronger isolation boundary; containers share a kernel.\n* Because containers share the host kernel, Windows containers need a Windows kernel; a Linux host cannot run them natively.\n* Containers run on bare-metal Linux/Windows hosts or inside VMs on any hypervisor type; no type 2 hypervisor is required.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-013',
    topic: '1.2',
    type: 'match',
    difficulty: 1,
    stem: 'Match each virtualization component to its function.',
    pairs: [
      ['Hypervisor', 'Creates and runs virtual machines by presenting virtual hardware to guest operating systems'],
      ['Container runtime', 'Pulls images and starts containers on a single host, for example containerd'],
      ['Container orchestrator', 'Schedules, scales, and restarts containers across a cluster, for example Kubernetes'],
      ['Virtual switch', "Connects VM vNICs to each other and to the host's physical NIC uplinks"],
      ['Container image', 'Read-only template that packages an application with its dependencies'],
    ],
    explanation: "* The **hypervisor** virtualizes hardware for VMs.\n* A **container runtime** (Docker Engine, containerd, CRI-O) runs containers on one host.\n* An **orchestrator** (Kubernetes) manages many containers across many hosts: placement, scaling, self-healing, rolling updates.\n* A **virtual switch** (vSwitch, vDS, Hyper-V switch, Open vSwitch) is the software Layer 2 switch inside the host.\n* An **image** is the read-only template; a container is a running instance of it.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-014',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "VM-A and VM-B run on the same ESXi host and connect to the same port group (VLAN 20) on a standard vSwitch. VM-C is in VLAN 20 on a different ESXi host. All of the first host's physical uplinks fail. Which communication still works?",
    options: [
      'VM-A to VM-B',
      'VM-A to VM-C',
      'VM-A to its default gateway on the physical distribution switch',
      'VM-B to the internet through NAT on the edge router',
    ],
    answer: [0],
    explanation: "The vSwitch is a Layer 2 switch inside the host. Frames between two VMs on the **same host and same port group/VLAN** are switched in software and never leave the server, so VM-A to VM-B keeps working.\n\nEverything else needs the physical uplinks: VM-C is on another host, the default gateway is on a physical switch, and internet traffic must reach the edge router. With all uplinks down, those paths fail.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-015',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Gi1/0/10 connects to vmnic0 on ESXI-01. VMs in port groups tagged with VLAN 10 and VLAN 20 work normally, but a new VM in a port group tagged with VLAN 30 cannot reach its gateway. VLAN 30 exists on SW1 and its SVI is up/up. What is the problem?',
    exhibit: `SW1# show running-config interface GigabitEthernet1/0/10
interface GigabitEthernet1/0/10
 description ESXI-01 vmnic0
 switchport trunk allowed vlan 10,20
 switchport mode trunk
end

SW1# show interfaces trunk | begin allowed and active
Port        Vlans allowed and active in management domain
Gi1/0/10    10,20`,
    options: [
      'VLAN 30 is not in the allowed VLAN list of the trunk to the host',
      'The port must be an access port in VLAN 30 for the vSwitch to tag frames',
      'A vSwitch can carry at most two VLANs per physical uplink',
      'The VM needs a type 2 hypervisor to use VLAN tagging',
    ],
    answer: [0],
    explanation: "The vSwitch tags the VM's frames with VLAN 30 on its uplink, but SW1's trunk allows only VLANs 10 and 20, so VLAN 30 frames are dropped. Add the VLAN: `switchport trunk allowed vlan add 30`.\n\n* An access port would carry only one untagged VLAN and would break VLANs 10 and 20; a host with several port groups needs a trunk.\n* vSwitch uplinks carry many VLANs; there is no two-VLAN limit.\n* VLAN tagging works on type 1 hypervisors such as ESXi; hypervisor type is unrelated.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-016',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'A company must run a legacy Windows Server application and several Linux applications on one dedicated physical server in the data center. Each workload needs strong isolation from the others. Which solution fits best?',
    options: [
      'A type 1 hypervisor running a Windows Server VM and separate Linux VMs',
      'A single Linux host running all of the applications as containers under one container runtime',
      "A type 2 hypervisor installed as an application on an administrator's laptop",
      'Kubernetes on a single Linux node, because orchestration provides kernel-level isolation between Windows and Linux workloads',
    ],
    answer: [0],
    explanation: "VMs on a **type 1 hypervisor** give each workload its own OS and kernel, which allows Windows and Linux side by side and provides strong, hardware-level isolation on a dedicated server.\n\n* Containers on one Linux host share the Linux kernel, so they cannot run a Windows Server application natively, and their isolation is weaker than VMs.\n* A type 2 hypervisor on a laptop is suited to labs and desktops, not a dedicated data-center server.\n* Kubernetes schedules containers; it does not let Windows and Linux containers share one Linux kernel, and orchestration is not an isolation mechanism.",
    lesson: '1.2-virtualization',
  },

  // ---------------------------------------------------------------- 1.3
  {
    id: 'd1-017',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: 'A host is configured as 172.16.45.200/20. What is the broadcast address of its subnet?',
    answer: ['172.16.47.255'],
    explanation: "/20 = 255.255.240.0, so the interesting octet is the third, with a block size of 256 - 240 = **16**. Multiples of 16: 0, 16, 32, 48. The third octet 45 falls in the 32 block, so the network is **172.16.32.0** and the next network is 172.16.48.0. Broadcast = next network - 1 = **172.16.47.255**. Usable hosts run from 172.16.32.1 to 172.16.47.254.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-018',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'Which range lists the usable host addresses of the subnet that contains 10.10.10.77/27?',
    options: [
      '10.10.10.65 - 10.10.10.94',
      '10.10.10.64 - 10.10.10.95',
      '10.10.10.65 - 10.10.10.126',
      '10.10.10.73 - 10.10.10.78',
    ],
    answer: [0],
    explanation: "/27 = 255.255.255.224, block size **32**. 77 falls between 64 and 96, so the network is 10.10.10.64 and the broadcast is 10.10.10.95. Usable hosts: **.65 through .94** (30 hosts).\n\n* .64 - .95 includes the network and broadcast addresses, which are not usable.\n* .65 - .126 is the usable range of a /26 (10.10.10.64/26).\n* .73 - .78 is the usable range of a /29 (10.10.10.72/29).",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-019',
    topic: '1.3',
    type: 'fill',
    difficulty: 1,
    stem: 'How many usable host addresses does a single /22 IPv4 subnet provide?',
    answer: ['1022'],
    explanation: "A /22 leaves 32 - 22 = **10 host bits**. 2^10 = 1024 addresses, minus the network and broadcast addresses = **1022** usable hosts.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-020',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'From 192.168.50.0/24, the subnet 192.168.50.0/25 is already assigned to Sales. Engineering needs 50 host addresses. Subnets are allocated largest first with no gaps. Which subnet should Engineering receive?',
    options: ['192.168.50.128/26', '192.168.50.64/26', '192.168.50.128/27', '192.168.50.160/26'],
    answer: [0],
    explanation: "50 hosts need 6 host bits (2^6 - 2 = 62), so a **/26** (block 64). The first free address after Sales (192.168.50.0 - .127) is .128, which is a valid /26 boundary: **192.168.50.128/26** (hosts .129 - .190).\n\n* 192.168.50.64/26 lies inside Sales' 192.168.50.0/25 and overlaps it.\n* A /27 provides only 30 usable hosts.\n* 160 is not a multiple of 64, so 192.168.50.160/26 is not a valid subnet boundary (that address belongs to 192.168.50.128/26).",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-021',
    topic: '1.3',
    type: 'multi',
    difficulty: 1,
    stem: 'Which three addresses are RFC 1918 private addresses? (Choose three.)',
    options: ['10.255.0.1', '172.31.200.5', '192.168.255.254', '172.32.0.1', '100.64.1.1', '192.169.1.1'],
    answer: [0, 1, 2],
    explanation: "RFC 1918 reserves **10.0.0.0/8**, **172.16.0.0/12** (172.16.0.0 - 172.31.255.255), and **192.168.0.0/16**. So 10.255.0.1, 172.31.200.5, and 192.168.255.254 are private.\n\n* 172.32.0.1 is just past the 172.16/12 block, so it is public.\n* 100.64.1.1 is in 100.64.0.0/10, the shared address space for carrier-grade NAT (RFC 6598), which is not RFC 1918.\n* 192.169.1.1 is public; only 192.168.x.x is private.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-022',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. What does the output indicate?',
    exhibit: `C:\\>ipconfig /all

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . :
   Description . . . . . . . . . . . : Intel(R) Ethernet Connection (7) I219-LM
   Physical Address. . . . . . . . . : 3C-52-82-1A-7F-0E
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   Link-local IPv6 Address . . . . . : fe80::8d1c:3b2a:91f4:6e07%12(Preferred)
   Autoconfiguration IPv4 Address. . : 169.254.112.45(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :
   NetBIOS over Tcpip. . . . . . . . : Enabled`,
    options: [
      'The PC is set for DHCP but received no DHCP response, so it assigned itself an APIPA address',
      'The PC has a statically configured private address with the wrong mask',
      'The PC detected a duplicate address, and the DHCP server assigned it a replacement',
      'The PC received a DHCP lease but the pool has no DNS server option',
    ],
    answer: [0],
    explanation: "`DHCP Enabled: Yes` plus an **Autoconfiguration IPv4 Address** in **169.254.0.0/16** with no default gateway means the client sent Discovers and never completed DORA, so it self-assigned an APIPA (IPv4 link-local) address. Check the link and VLAN, the relay (`ip helper-address`), and the DHCP server/pool.\n\n* It is not static: DHCP is enabled, and 169.254/16 is not an RFC 1918 range.\n* A DHCP server never hands out 169.254.x.x addresses.\n* A DHCP lease would show an IPv4 Address, lease times, and a DHCP Server line, none of which appear.",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-023',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. PC-A is statically addressed and connects to VLAN 30, whose gateway is R1 Gi0/0/1.30. PC-A cannot reach any other subnet. What is the problem?',
    exhibit: `C:\\>ipconfig

Ethernet adapter Ethernet:

   IPv4 Address. . . . . . . . . . . : 192.168.1.150
   Subnet Mask . . . . . . . . . . . : 255.255.255.240
   Default Gateway . . . . . . . . . : 192.168.1.129

R1# show ip interface GigabitEthernet0/0/1.30 | include Internet
  Internet address is 192.168.1.129/26`,
    options: [
      "PC-A's /28 mask places it in 192.168.1.144/28, which excludes the gateway",
      "PC-A's address 192.168.1.150 is the broadcast address of the VLAN 30 subnet",
      'The gateway address 192.168.1.129 is the network address of the VLAN 30 subnet',
      "R1's subinterface mask is wrong; it must be changed to /28 to match PC-A",
    ],
    answer: [0],
    explanation: "VLAN 30 is 192.168.1.128/26 (hosts .129 - .190, broadcast .191), so .150 is a valid host and .129 is a valid gateway. But PC-A uses 255.255.255.240 (/28, block 16): 150 falls in the 144 block, so PC-A believes its subnet is **192.168.1.144/28** (.145 - .158). The gateway .129 is outside that range, so PC-A cannot reach its gateway and every off-subnet destination fails. Fix PC-A's mask to 255.255.255.192. (Caveat: some host stacks, Windows included, warn about an off-subnet gateway yet may still ARP for it, so real-world symptoms vary; the misconfiguration is the mask either way.)\n\n* The /26 broadcast is .191, not .150.\n* The /26 network address is .128; .129 is the first usable host.\n* Changing R1 to /28 would put R1 in 192.168.1.128/28 (.129 - .142), which still does not contain .150, and would break every other host in VLAN 30.",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-024',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. An engineer asked an AI assistant to validate static server addresses for the 172.16.32.0/20 server VLAN. Which assessment of the assistant's output is correct?",
    exhibit: `Engineer: Validate these static assignments for the 172.16.32.0/20 server VLAN.
  SRV-DB01   172.16.33.0    /20   gw 172.16.32.1
  SRV-DB02   172.16.40.17   /20   gw 172.16.32.1
  SRV-WEB01  172.16.47.255  /20   gw 172.16.32.1

AI assistant:
  SRV-DB01   INVALID - 172.16.33.0 ends in .0, so it is a network address.
  SRV-DB02   OK
  SRV-WEB01  OK`,
    options: [
      'Two errors: 172.16.33.0 is a valid host, and 172.16.47.255 is the broadcast address',
      'The assistant is correct; an address ending in .0 can never be assigned to a host',
      'The assistant got only SRV-DB01 wrong; the other two assignments are valid',
      'The assistant got only SRV-WEB01 wrong; 172.16.33.0 is the network address of a /24 inside the /20',
    ],
    answer: [0],
    explanation: "For 172.16.32.0/20 (block 16 in the third octet), the network is **172.16.32.0** and the broadcast is **172.16.47.255**; every address in between is a usable host.\n\n* SRV-DB01 172.16.33.0 is a perfectly valid host in a /20: the assistant applied a /24 rule of thumb ('.0 is a network') to a /20.\n* SRV-DB02 172.16.40.17 is valid.\n* SRV-WEB01 172.16.47.255 is the **broadcast address** and cannot be assigned; the assistant missed it.\n\nSo the assistant made two errors. The '.0 is always a network' claim is false for prefixes shorter than /24, and the host is in a /20 (the /24 view in the last option is irrelevant because the configured mask is /20).",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-025',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Gi0/0/2 needs a new subnet that supports at least 300 hosts. Which address and mask can be configured on Gi0/0/2 without IOS rejecting it as an overlap?',
    exhibit: `R1# show ip route connected | include ^C
C        10.10.0.0/22 is directly connected, GigabitEthernet0/0/0
C        10.10.5.0/24 is directly connected, GigabitEthernet0/0/1

R1# configure terminal
R1(config)# interface GigabitEthernet0/0/2
R1(config-if)# ip address 10.10.4.1 255.255.254.0
% 10.10.4.0 overlaps with GigabitEthernet0/0/1`,
    options: [
      '10.10.8.1 255.255.254.0',
      '10.10.2.1 255.255.254.0',
      '10.10.6.1 255.255.255.0',
      '10.10.5.200 255.255.254.0',
    ],
    answer: [0],
    explanation: "300 hosts need 9 host bits (510 usable), so a **/23**. Existing subnets: 10.10.0.0/22 (10.10.0.0 - 10.10.3.255) and 10.10.5.0/24. **10.10.8.1/23** is in 10.10.8.0/23 (10.10.8.0 - 10.10.9.255), which overlaps neither.\n\n* 10.10.2.1/23 is in 10.10.2.0/23, which lies inside Gi0/0/0's 10.10.0.0/22.\n* 10.10.6.1/24 does not overlap, but a /24 gives only 254 hosts.\n* 10.10.5.200/23 is in 10.10.4.0/23, which contains Gi0/0/1's 10.10.5.0/24, the same overlap IOS just rejected.",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-026',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 Gi0/0/0 (192.168.10.1/24) is the default gateway for VLAN 10. Users report intermittent loss of connectivity to other subnets. What should the engineer do next?",
    exhibit: `R1# show logging | include DUPADDR
*Oct 24 09:12:44.311: %IP-4-DUPADDR: Duplicate address 192.168.10.1 on GigabitEthernet0/0/0, sourced by 0050.56b2.11a4
*Oct 24 09:15:02.870: %IP-4-DUPADDR: Duplicate address 192.168.10.1 on GigabitEthernet0/0/0, sourced by 0050.56b2.11a4`,
    options: [
      'Trace MAC 0050.56b2.11a4 with `show mac address-table address` and fix that device',
      "Change R1's Gi0/0/0 address to an unused address in the subnet to avoid the conflict",
      'Disable proxy ARP on Gi0/0/0 with `no ip proxy-arp` so R1 stops answering for the address',
      'Clear the ARP cache on R1 with `clear arp-cache` because the entry is stale',
    ],
    answer: [0],
    explanation: "Another device (MAC 0050.56b2.11a4) is claiming the gateway address, so hosts' ARP caches flip between R1 and that device, causing intermittent failures. Trace the MAC through the switches to its access port and fix the device. (The 0050.56 OUI belongs to VMware, so it is probably a VM with a mistyped static address.)\n\n* Changing R1's address would break every host that uses .1 as its gateway; fix the offender instead.\n* Proxy ARP is unrelated to another host claiming R1's own address.\n* The problem is not a stale entry in R1's cache; the other device keeps sending ARP traffic for .1, as the repeated log messages show.",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-027',
    topic: '1.3',
    type: 'order',
    difficulty: 2,
    stem: 'Put the steps of the block-size method in order to find the network, broadcast, and usable range for 172.20.99.7/22.',
    items: [
      'Identify the interesting octet: the third octet, where the mask is 252',
      'Calculate the block size: 256 - 252 = 4',
      'Find the largest multiple of 4 that is less than or equal to 99 (96): network 172.20.96.0',
      'Subtract 1 from the next network (172.20.100.0): broadcast 172.20.99.255',
      'Add 1 to the network and subtract 1 from the broadcast: usable 172.20.96.1 - 172.20.99.254',
    ],
    explanation: "Find the octet where the mask is not 255 or 0, compute the block size, locate the subnet boundary at or below the address, derive the broadcast from the next boundary, then derive the usable range. For 172.20.99.7/22: network **172.20.96.0**, broadcast **172.20.99.255**, usable **172.20.96.1 - 172.20.99.254** (1022 hosts).",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-028',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'A single VLAN must support 300 hosts today and grow to 480 hosts, using the fewest addresses possible. Which prefix length should be used?',
    options: ['/23', '/24', '/22', '/25'],
    answer: [0],
    explanation: "480 hosts need 9 host bits: 2^9 - 2 = **510**. 32 - 9 = **/23**.\n\n* /24 gives only 254 hosts, which is not even enough for today.\n* /22 (1022 hosts) works but wastes more than half of the block, so it is not the fewest addresses.\n* /25 gives 126 hosts.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-029',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'A branch router receives the address 100.72.15.9 from its ISP on the WAN interface. Which statement about this address is correct?',
    options: [
      'It is CGNAT shared address space (100.64.0.0/10): not RFC 1918 and not internet-routable',
      'It is an RFC 1918 private address, the same category as 10.0.0.0/8',
      'It is a public address that hosts on the internet can reach directly',
      'It is an APIPA link-local address, which means DHCP from the ISP failed',
    ],
    answer: [0],
    explanation: "100.64.0.0/10 (100.64.0.0 - 100.127.255.255) is **shared address space** defined in RFC 6598 for carrier-grade NAT between the ISP and its customers. The ISP translates it again before traffic reaches the internet, so inbound connections to 100.72.15.9 from the internet are not possible.\n\n* RFC 1918 covers only 10/8, 172.16/12, and 192.168/16.\n* It is not globally routed, so it is not directly reachable from the internet.\n* APIPA is 169.254.0.0/16.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-030',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'A statically configured PC can ping other hosts in its own subnet by IP address but cannot ping any IP address in another subnet. Other PCs in the same VLAN work normally. Which two misconfigurations on the PC could cause this? (Choose two.)',
    options: [
      'The default gateway is set to an address in the subnet that does not belong to the router',
      'The default gateway field is empty',
      'The DNS server address is wrong',
      "The PC's switch port is in the wrong VLAN",
      "The PC's NIC is set to half duplex while the switch port is full duplex",
    ],
    answer: [0, 1],
    explanation: "Same-subnet traffic is delivered directly using ARP; only off-subnet traffic depends on the **default gateway**. A wrong gateway address or no gateway at all produces exactly this pattern.\n\n* DNS is not involved because the tests use IP addresses.\n* A wrong VLAN would also break pings to hosts in the PC's own subnet.\n* A duplex mismatch degrades all traffic (local and remote) with errors and retransmissions; it does not selectively block remote destinations.",
    lesson: '1.3-ipv4-troubleshooting',
  },

  // ---------------------------------------------------------------- 1.4
  {
    id: 'd1-031',
    topic: '1.4',
    type: 'single',
    difficulty: 1,
    stem: 'Which is a correct compressed form of 2001:0DB8:0000:00A0:0000:0000:0000:0010?',
    options: ['2001:DB8:0:A0::10', '2001:DB8::A0::10', '2001:DB8:0:A::10', '2001:DB8:0:A0::1'],
    answer: [0],
    explanation: "Drop leading zeros in each hextet (0DB8 to DB8, 0000 to 0, 00A0 to A0, 0010 to 10), then replace the longest run of zero hextets (the three in positions 5-7) with `::`: **2001:DB8:0:A0::10**.\n\n* `2001:DB8::A0::10` uses `::` twice, which is invalid because the address would be ambiguous.\n* `2001:DB8:0:A::10` removed a *trailing* zero from 00A0; only leading zeros may be dropped (A0 is not A).\n* `2001:DB8:0:A0::1` dropped the trailing zero of 0010, which changes the address.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-032',
    topic: '1.4',
    type: 'fill',
    difficulty: 2,
    stem: 'Using modified EUI-64, what 64-bit interface ID is generated from MAC address 5CA6.2D11.2233? Enter it as four full hextets in the form XXXX:XXXX:XXXX:XXXX.',
    answer: ['5EA6:2DFF:FE11:2233'],
    explanation: "1. Split the MAC: `5CA62D` | `112233`.\n2. Insert FFFE: `5CA62D FFFE 112233`.\n3. Flip the 7th bit of the first byte: 5C = 0101 1100; flipping the U/L bit (value 0x02) gives 0101 1110 = **5E**.\n4. Result: **5EA6:2DFF:FE11:2233**.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-033',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which global unicast address does R1 assign to Gi0/0/1?',
    exhibit: `R1# show running-config interface GigabitEthernet0/0/1
interface GigabitEthernet0/0/1
 no ip address
 ipv6 address 2001:DB8:ACAD:20::/64 eui-64
end

R1# show interfaces GigabitEthernet0/0/1 | include address
  Hardware is ISR4331-3x1GE, address is 7c0e.ce1a.2b8c (bia 7c0e.ce1a.2b8c)`,
    options: [
      '2001:DB8:ACAD:20:7E0E:CEFF:FE1A:2B8C',
      '2001:DB8:ACAD:20:7C0E:CEFF:FE1A:2B8C',
      '2001:DB8:ACAD:20:7D0E:CEFF:FE1A:2B8C',
      '2001:DB8:ACAD:20:7E0E:CEFE:FF1A:2B8C',
    ],
    answer: [0],
    explanation: "MAC 7c0e.ce1a.2b8c: split into 7C0ECE | 1A2B8C, insert FFFE, and flip the 7th bit of the first byte. 7C = 0111 1100; flipping the bit worth 0x02 gives 0111 1110 = **7E**. Interface ID: 7E0E:CEFF:FE1A:2B8C, so the address is **2001:DB8:ACAD:20:7E0E:CEFF:FE1A:2B8C**.\n\n* `7C0E...` forgot to flip the U/L bit.\n* `7D0E...` flipped the lowest bit (the 8th bit, worth 0x01) instead of the 7th.\n* `...CEFE:FF1A...` inserted FEFF instead of FFFE.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-034',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. PC1 in VLAN 10 has only a link-local IPv6 address. An AI assistant proposed a fix. Which statement correctly evaluates the assistant's recommendation?",
    exhibit: `R1# show ipv6 interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  No Virtual link-local address(es):
  Global unicast address(es):
    2001:DB8:ACAD:10::1, subnet is 2001:DB8:ACAD:10::/64
  Joined group address(es):
    FF02::1
    FF02::1:FF00:1
  MTU is 1500 bytes
  ...
R1# show running-config | include ipv6 unicast
R1#

PC1> ipconfig (excerpt)
   Link-local IPv6 Address . . . . . : fe80::8d1c:3b2a:91f4:6e07%12
   IPv4 Address. . . . . . . . . . . : 192.168.10.21
   Default Gateway . . . . . . . . . : 192.168.10.1

AI assistant: "PC1 has no global IPv6 address because there is no DHCPv6
server. Create an 'ipv6 dhcp pool' on R1, apply it to Gi0/0/0 with
'ipv6 dhcp server', and set 'ipv6 nd managed-config-flag'."`,
    options: [
      'The assistant is wrong: R1 is not sending Router Advertisements because `ipv6 unicast-routing` is missing; enabling it lets PC1 use SLAAC',
      'The assistant is right: IPv6 hosts cannot obtain a global address without a DHCPv6 server',
      'The assistant is wrong: the fix is to configure `ipv6 address autoconfig` on R1 Gi0/0/0',
      'The assistant is wrong: FE80::1 is not a valid link-local address, so R1 cannot send Router Advertisements',
    ],
    answer: [0],
    explanation: "Without `ipv6 unicast-routing`, an IOS router does not route IPv6 and does **not send Router Advertisements**. Evidence: the running-config has no such line and Gi0/0/0 has not joined **FF02::2** (all-routers). With no RA, PC1 cannot learn a prefix (SLAAC) or a default gateway, so it keeps only its link-local address. Enable `ipv6 unicast-routing` and R1 starts advertising 2001:DB8:ACAD:10::/64.\n\n* The assistant's premise is false: SLAAC needs no DHCPv6 server. Its fix would not work anyway, because the M flag is delivered in an RA, and R1 is not sending RAs.\n* `ipv6 address autoconfig` makes R1 itself a SLAAC *client*; it does not advertise anything.\n* FE80::1 is a valid, commonly used manual link-local address.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-035',
    topic: '1.4',
    type: 'multi',
    difficulty: 1,
    stem: 'Which two addresses are IPv6 global unicast addresses? (Choose two.)',
    options: ['2605:9A00:41:7::25', '2A02:C7F:8E10:2C00::1', 'FD12:3456:789A:1::1', 'FE80::1', 'FF02::1:FF00:1', '::1'],
    answer: [0, 1],
    explanation: "Global unicast addresses currently come from **2000::/3**, so they begin with hex 2 or 3. 2605:... and 2A02:... both qualify.\n\n* FD12:... is a **unique local** address (FC00::/7).\n* FE80::1 is **link-local** (FE80::/10).\n* FF02::1:FF00:1 is a **solicited-node multicast** address (FF00::/8).\n* ::1 is the **loopback** address.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-036',
    topic: '1.4',
    type: 'match',
    difficulty: 1,
    stem: 'Match each IPv6 address to its type.',
    pairs: [
      ['FE80::A1', 'Link-local unicast'],
      ['FD00:AB:CD::1', 'Unique local unicast'],
      ['FF02::2', 'All-routers multicast'],
      ['2001:DB8:ACAD:5::1', 'Global unicast'],
      ['::1', 'Loopback'],
      ['::', 'Unspecified'],
    ],
    explanation: "* **FE80::/10** is link-local, valid only on one link.\n* **FC00::/7** (FD00::/8 in practice) is unique local, the IPv6 counterpart of private addressing.\n* **FF02::2** is the link-scope all-routers multicast group (FF02::1 is all nodes).\n* **2000::/3** is global unicast; 2001:DB8::/32 is the documentation range carved from it and is used in examples as a GUA.\n* **::1** is loopback; **::** is the unspecified address (used, for example, as the source during DAD).",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-037',
    topic: '1.4',
    type: 'fill',
    difficulty: 1,
    stem: 'How many /64 subnets does a /56 IPv6 prefix contain?',
    answer: ['256'],
    explanation: "64 - 56 = 8 subnet bits, and 2^8 = **256** /64 subnets. (For comparison, a /48 contains 2^16 = 65,536 /64s.)",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-038',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'What is the prefix of the address 2001:DB8:CAFE:1234::99/52?',
    options: ['2001:DB8:CAFE:1000::/52', '2001:DB8:CAFE:1200::/52', '2001:DB8:CAFE::/52', '2001:DB8:CAFE:1234::/52'],
    answer: [0],
    explanation: "The first three hextets are 48 bits, so a /52 keeps only the first **4 bits** (one hex digit) of the fourth hextet. 1234 keeps `1` and zeros the rest: **2001:DB8:CAFE:1000::/52**.\n\n* `1200::` keeps 8 bits of the fourth hextet, which is the /56 prefix.\n* `CAFE::` keeps none of the fourth hextet, which is the /48 prefix.\n* `1234::` is the /64 prefix.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-039',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'R1 sends Router Advertisements on Gi0/0/0, and hosts form their addresses with SLAAC. A stateless DHCPv6 pool with DNS server options is already configured and bound to Gi0/0/0. Which interface command makes hosts query DHCPv6 for DNS while still using SLAAC for their addresses?',
    options: ['ipv6 nd other-config-flag', 'ipv6 nd managed-config-flag', 'ipv6 address autoconfig', 'ipv6 address dhcp'],
    answer: [0],
    explanation: "Setting the **O (other configuration) flag** in RAs tells hosts to keep using SLAAC for addressing but to ask a DHCPv6 server for other information such as DNS servers: stateless DHCPv6.\n\n* The **M (managed) flag** tells hosts to obtain their *addresses* from a stateful DHCPv6 server.\n* `ipv6 address autoconfig` makes R1's own interface a SLAAC client.\n* `ipv6 address dhcp` makes R1's own interface a DHCPv6 client.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-040',
    topic: '1.4',
    type: 'order',
    difficulty: 2,
    stem: 'Put the steps in order for a host that boots on a LAN and configures a global IPv6 address with SLAAC.',
    items: [
      'The host creates a link-local address and verifies it with Duplicate Address Detection',
      'The host sends a Router Solicitation to FF02::2',
      'The router replies with a Router Advertisement containing a /64 prefix with the A flag set',
      'The host combines the prefix with an interface ID to form a global unicast address',
      'The host performs DAD for the new address by sending a Neighbor Solicitation to the solicited-node multicast group',
    ],
    explanation: "A host first needs a link-local address (checked with DAD) to communicate on the link. It then solicits an RA (ICMPv6 type 133 to all-routers FF02::2) instead of waiting for the next periodic RA. The RA (type 134) carries the /64 prefix and the A flag. The host appends a 64-bit interface ID (modified EUI-64 or randomized) and runs DAD on the new address before using it. The router's link-local source address in the RA becomes the host's default gateway.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-041',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What is the problem with the global address on Gi0/0/0?',
    exhibit: `R1# show ipv6 interface GigabitEthernet0/0/0 | include link-local|subnet
  IPv6 is enabled, link-local address is FE80::1
    2001:DB8:ACAD:10::1, subnet is 2001:DB8:ACAD:10::/64 [DUP]

R1# show logging | include DUPLICATE
*Oct 24 10:41:07.552: %IPV6_ND-4-DUPLICATE: Duplicate address 2001:DB8:ACAD:10::1 on GigabitEthernet0/0/0`,
    options: [
      'Another device on the link already uses this address, so DAD failed',
      "The same IPv6 address is configured on two of R1's interfaces",
      'The address is invalid because ::1 is reserved for the loopback address',
      'R1 received two Router Advertisements that contained the same prefix',
    ],
    answer: [0],
    explanation: "When an address is configured, IOS runs **Duplicate Address Detection**: it sends a Neighbor Solicitation for the address to its solicited-node multicast group. A Neighbor Advertisement from another device on the Gi0/0/0 link proves the address is in use, so IOS marks it **[DUP]**, logs `%IPV6_ND-4-DUPLICATE`, and does not use it. Find the other device (for example with `show ipv6 neighbors` and the MAC address table) and readdress one of them.\n\n* The log specifically reports a duplicate detected on the Gi0/0/0 link, not a conflict between R1's own interfaces.\n* Only the full address ::1 (0:0:0:0:0:0:0:1) is loopback; 2001:DB8:ACAD:10::1 is a normal host address in its /64.\n* Duplicate RAs do not cause DAD failures; RAs are the source of prefixes, not a conflict.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-042',
    topic: '1.4',
    type: 'single',
    difficulty: 1,
    stem: 'How does a host that uses SLAAC learn its IPv6 default gateway?',
    options: [
      "From the source of Router Advertisements: the router's link-local address",
      'From a default-router option in a DHCPv6 reply',
      'It uses the first address of the advertised /64 prefix (prefix::1)',
      'It sends an ARP broadcast for the gateway address',
    ],
    answer: [0],
    explanation: "Routers send RAs from their **link-local** address, and a host installs that link-local address as its default gateway (for example `fe80::1%12` on Windows). This is true even when DHCPv6 is used.\n\n* DHCPv6 has **no** default-router option; the gateway always comes from RAs.\n* Hosts make no assumption that the router is prefix::1.\n* IPv6 has no ARP or broadcast; Neighbor Discovery uses ICMPv6 and multicast.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-043',
    topic: '1.4',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about the IOS global command `ipv6 unicast-routing` are true? (Choose two.)',
    options: [
      'It enables the router to forward IPv6 packets between interfaces',
      'It allows the router to send Router Advertisements on its IPv6-enabled LAN interfaces',
      'It must be entered before any IPv6 address can be configured on an interface',
      'It enables OSPFv3 on all IPv6 interfaces',
      'It disables IPv4 routing on the router',
    ],
    answer: [0, 1],
    explanation: "`ipv6 unicast-routing` turns on IPv6 forwarding, and with it the router begins acting as an IPv6 router on the link: it joins FF02::2 and sends Router Advertisements so hosts can use SLAAC.\n\n* IPv6 addresses can be configured without it; the router then acts like an IPv6 host.\n* OSPFv3 is enabled separately (for example `ipv6 ospf 1 area 0` on each interface).\n* IPv4 routing is unaffected; the router runs both protocols (dual stack).",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-044',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'An enterprise received 2001:DB8:A000::/48 and wants to give each of its 200 branches a /56. Is this possible?',
    options: [
      'Yes: a /48 contains 256 /56 prefixes, and each /56 contains 256 /64 subnets',
      'No: a /48 contains only 128 /56 prefixes, which is fewer than 200',
      'Yes: a /48 contains 65,536 /56 prefixes, so there is plenty of room',
      'No: a /56 is too small to be subdivided into /64 LAN subnets',
    ],
    answer: [0],
    explanation: "56 - 48 = 8 bits, so a /48 holds 2^8 = **256** /56s, enough for 200 branches with 56 to spare. Each /56 holds 2^(64 - 56) = **256** /64 LAN subnets.\n\n* 128 would be 7 bits (a /55 split).\n* 65,536 is the number of /64s in a /48, not /56s.\n* A /56 is routinely split into /64s; that is its purpose.",
    lesson: '1.4-ipv6-addressing',
  },

  // ---------------------------------------------------------------- 1.5
  {
    id: 'd1-045',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An AI site-survey assistant produced this recommendation for the 2.4 GHz radios on a warehouse floor. What is the correct response?",
    exhibit: `Site Survey Assistant (AI) - 2.4 GHz, Warehouse Floor 2
Current:  AP-1 ch 6, AP-2 ch 6, AP-3 ch 6, AP-4 ch 6  (all within range of each other)
Finding:  High co-channel utilization (channel busy 78%).
Recommendation:
  Re-plan as AP-1 ch 1, AP-2 ch 4, AP-3 ch 8, AP-4 ch 11 so that every AP has
  its own channel and co-channel interference is eliminated.`,
    options: [
      'Reject it: 1, 4, 8, and 11 overlap and cause adjacent-channel interference; use only 1, 6, and 11',
      'Accept it: four channels give more capacity than three, and channels 4 and 8 do not overlap channels 1 and 11',
      'Accept it, and also widen the 2.4 GHz channels to 40 MHz to increase capacity',
      'Reject it: all four APs should stay on channel 6 because co-channel interference does not reduce capacity',
    ],
    answer: [0],
    explanation: "The finding (heavy co-channel contention with four APs on channel 6) is reasonable, but the fix is wrong. 2.4 GHz channels are 5 MHz apart while each signal is about 20-22 MHz wide, so only channels five numbers apart (**1, 6, 11**) avoid overlap. Channels 1/4, 4/8, and 8/11 partially overlap, producing **adjacent-channel interference**, which corrupts frames and is worse than co-channel contention. Use 1/6/11, lower transmit power so cells overlap less, and push 5 GHz-capable clients to 5 GHz.\n\n* Channels 4 and 8 do overlap 1 and 11.\n* A 40 MHz channel in 2.4 GHz consumes most of the band and leaves no room for a channel plan.\n* Co-channel interference does reduce capacity: every station on the channel shares the same airtime.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-046',
    topic: '1.5',
    type: 'fill',
    difficulty: 1,
    stem: 'An access point transmits at 17 dBm. What is its transmit power in milliwatts?',
    answer: ['50', '50 mW', '50mW'],
    explanation: "Use the rule of 3s and 10s: 20 dBm = 100 mW (0 dBm = 1 mW, +10 dB twice multiplies by 100). 17 dBm is 3 dB less, which halves the power: **50 mW**.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-047',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'A VoWLAN handset reports RSSI -72 dBm, and the AP reports a noise floor of -90 dBm on that channel. What is the SNR, and does it meet the commonly recommended minimum of 25 dB for voice?',
    options: [
      '18 dB; it is below the recommended 25 dB minimum for voice',
      '18 dB; it exceeds the recommended 25 dB minimum for voice',
      '162 dB; it far exceeds the recommended minimum for voice',
      '-18 dB; the signal is weaker than the noise floor',
    ],
    answer: [0],
    explanation: "SNR = signal - noise = -72 - (-90) = **18 dB**, which is below the 25 dB voice target (and the -72 dBm RSSI is also weaker than the usual -67 dBm voice target).\n\n* 18 dB is less than 25 dB, not more.\n* 162 dB comes from adding the absolute values, which is meaningless.\n* -18 dB would mean the noise is stronger than the signal; here the signal (-72 dBm) is 18 dB above the noise (-90 dBm).",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-048',
    topic: '1.5',
    type: 'match',
    difficulty: 2,
    stem: 'Match each RF behavior to its description.',
    pairs: [
      ['Absorption', 'Materials such as water, people, and concrete soak up energy, weakening the signal'],
      ['Reflection', 'The signal bounces off metal surfaces, creating multipath copies'],
      ['Refraction', 'The signal bends as it passes between media of different density'],
      ['Scattering', 'A rough or uneven surface breaks the signal into many weaker reflections in many directions'],
      ['Diffraction', 'The signal bends around the edge of an obstacle, leaving an RF shadow behind it'],
    ],
    explanation: "* **Absorption** converts RF energy to heat inside a material, reducing amplitude.\n* **Reflection** from smooth, dense surfaces (metal) creates delayed copies, called multipath.\n* **Refraction** is a change of direction when passing *through* a boundary between media.\n* **Scattering** is reflection from many small or uneven surfaces in many directions.\n* **Diffraction** is bending *around* an obstacle's edge, which creates a shadow area with weak coverage.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-049',
    topic: '1.5',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements describe WPA3-Personal? (Choose two.)',
    options: [
      "It authenticates with SAE (Simultaneous Authentication of Equals) instead of WPA2's pre-shared key method",
      'A captured handshake cannot be used to run an offline dictionary attack against the password',
      'It requires a RADIUS server to authenticate each user',
      'It encrypts traffic with TKIP',
      'Protected Management Frames are optional',
      'Each user signs in with a unique username and password',
    ],
    answer: [0, 1],
    explanation: "WPA3-Personal replaces PSK authentication with **SAE**, a Dragonfly-based exchange in which each password guess requires a live exchange with the AP. That **defeats offline dictionary attacks** on captured handshakes and adds forward secrecy.\n\n* RADIUS servers and per-user credentials belong to **Enterprise** mode (802.1X/EAP).\n* WPA3 uses AES (CCMP, or GCMP-256 in 192-bit Enterprise mode); TKIP is the WPA1 cipher.\n* PMF is **mandatory** in WPA3.",
    lesson: '1.5-wireless-security',
  },
  {
    id: 'd1-050',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'A controller-based WLAN uses lightweight APs in local mode and an SSID secured with WPA2-Enterprise. Cisco ISE is the RADIUS server. Which device acts as the 802.1X authenticator?',
    options: ['The wireless LAN controller', 'The Cisco ISE server', 'The wireless client', 'The DHCP server'],
    answer: [0],
    explanation: "In local mode, the AP tunnels client traffic to the **WLC** with CAPWAP, and the WLC is the **authenticator**: it relays EAP between the client and RADIUS and enforces the result. (With autonomous APs, or FlexConnect local authentication, the AP itself plays the authenticator role.)\n\n* ISE is the **authentication server**.\n* The client is the **supplicant**.\n* The DHCP server has no 802.1X role; clients receive an address only after authentication succeeds.",
    lesson: '1.5-wireless-security',
  },
  {
    id: 'd1-051',
    topic: '1.5',
    type: 'single',
    difficulty: 1,
    stem: 'Users in a break room report that their laptops become very slow on 2.4 GHz Wi-Fi every day around lunchtime, then recover. The AP reports high non-802.11 energy during those periods. What is the most likely cause and best remedy?',
    options: [
      'A microwave oven is raising the 2.4 GHz noise floor; steer those clients to 5 GHz or relocate the AP',
      'Co-channel interference from another AP; add a second AP on the same channel',
      'DFS radar detection is forcing channel changes; move the AP to a U-NII-1 channel',
      'The WPA2 group key is rotating at noon; switch the SSID to WPA3',
    ],
    answer: [0],
    explanation: "Microwave ovens leak energy around 2.45 GHz. The AP reports it as **non-802.11 (non-Wi-Fi) interference**, and the lunchtime pattern fits. The interference lowers SNR and causes retries; 5 GHz is unaffected.\n\n* Co-channel interference comes from 802.11 devices, and adding another AP on the same channel makes contention worse.\n* DFS and radar apply to 5 GHz U-NII-2 channels, not 2.4 GHz.\n* Group key rotation is brief and invisible to users; it does not cause daily slowdowns.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-052',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator enables an SSID secured with WPA2-Personal on the 2.4, 5, and 6 GHz radios of Wi-Fi 6E access points. Wi-Fi 6E laptops see the SSID on 2.4 and 5 GHz but never on 6 GHz. What is the reason?',
    options: [
      '6 GHz requires WPA3 (or OWE for open networks); WPA2 is not permitted on 6 GHz',
      '6 GHz permits only Enterprise (802.1X) security; Personal modes are not allowed',
      'An SSID on 6 GHz must use 320 MHz channels, which these APs do not support',
      '6 GHz is reserved for 802.11ac clients',
    ],
    answer: [0],
    explanation: "Wi-Fi 6E rules require **WPA3** (Personal SAE or Enterprise) or **OWE** for open SSIDs on 6 GHz, along with PMF. WPA2 and legacy open networks are not allowed there, so the SSID is not offered on the 6 GHz radio.\n\n* WPA3-Personal (SAE) is allowed on 6 GHz; Enterprise is not mandatory.\n* 6 GHz supports 20 MHz and wider channels; 320 MHz is an optional Wi-Fi 7 width.\n* 802.11ac (Wi-Fi 5) is 5 GHz only; 6 GHz requires 802.11ax (6E) or 802.11be clients.",
    lesson: '1.5-wireless-security',
  },
  {
    id: 'd1-053',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'Two APs in an open office both use 5 GHz channel 36 at 20 MHz width, and each hears the other at -70 dBm. What is the primary effect?',
    options: [
      'Co-channel interference: clients on both APs contend for the same airtime, reducing total capacity',
      'Adjacent-channel interference: channel 36 overlaps channel 40 and corrupts frames',
      'Both APs will be forced off channel 36 by DFS',
      'There is no effect, because 5 GHz channels never interfere with each other',
    ],
    answer: [0],
    explanation: "APs and clients on the **same channel** within hearing range form one contention domain. CSMA/CA makes them defer to each other, so they share the channel's airtime: **co-channel interference** reduces capacity even though frames are not necessarily corrupted.\n\n* At 20 MHz width, channels 36 and 40 do not overlap.\n* Channel 36 is in U-NII-1, which does not require DFS.\n* Same-channel cells in 5 GHz interfere just as they do in 2.4 GHz; 5 GHz only offers more channels to avoid it.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-054',
    topic: '1.5',
    type: 'multi',
    difficulty: 2,
    stem: 'An engineer changes all 5 GHz radios in a busy office from 20 MHz to 80 MHz channels. Which two outcomes should be expected? (Choose two.)',
    options: [
      'Higher maximum data rates for individual clients',
      'Fewer non-overlapping channels available for the channel plan',
      'Higher SNR because the wider channel collects more signal',
      'A larger coverage area for each AP',
      'Elimination of co-channel interference',
    ],
    answer: [0, 1],
    explanation: "Bonding four 20 MHz channels into one 80 MHz channel raises the **peak data rate** per client, but it divides the available channels by four, so neighboring APs are far more likely to share a channel (**more** co-channel interference, not less).\n\n* Wider channels capture more noise (about +3 dB per doubling of width) while transmit power is spread wider, so SNR goes **down**.\n* Coverage does not grow; if anything, the lower SNR shrinks the area where high rates are achievable.\n* With fewer channels, CCI increases in a dense deployment.",
    lesson: '1.5-wireless-rf',
  },

  // ---------------------------------------------------------------- 1.6
  {
    id: 'd1-055',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A statically addressed Linux server can reach its gateway (10.20.30.1) but nothing beyond it. What is the problem?',
    exhibit: `$ ip -br addr show eth0
eth0             UP             10.20.30.88/24 fe80::5a2f:1bff:fe40:7c11/64

$ ip route
10.20.30.0/24 dev eth0 proto kernel scope link src 10.20.30.88

$ ping -c 2 10.20.30.1
PING 10.20.30.1 (10.20.30.1) 56(84) bytes of data.
64 bytes from 10.20.30.1: icmp_seq=1 ttl=255 time=0.612 ms
64 bytes from 10.20.30.1: icmp_seq=2 ttl=255 time=0.540 ms

$ ping -c 2 10.10.50.53
ping: connect: Network is unreachable`,
    options: [
      'The server has no default route; it needs one via 10.20.30.1',
      "The server's subnet mask is wrong",
      'The server cannot resolve names because /etc/resolv.conf is empty',
      'The gateway 10.20.30.1 is filtering ICMP from the server',
    ],
    answer: [0],
    explanation: "`ip route` lists only the connected 10.20.30.0/24 route; there is no `default via ...` line. Linux reports **Network is unreachable** immediately (without sending anything) when no route matches the destination. Add a default route via 10.20.30.1, persistently in the server's network configuration (NetworkManager, netplan, etc.); `ip route add default via 10.20.30.1` fixes it only until reboot.\n\n* The /24 mask matches the gateway's subnet, and the gateway responds.\n* The test used an IP address, so DNS is not involved.\n* Filtering at the gateway would cause timeouts, not a local 'Network is unreachable' error, and the gateway already answers pings.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-056',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which host can this Mac reach directly on its local subnet, without using its default gateway?',
    exhibit: `% ifconfig en0
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
\tether a4:83:e7:5c:19:2b
\tinet6 fe80::1c4f:8a2e:3b7d:9a10%en0 prefixlen 64 secured scopeid 0xb
\tinet 172.16.4.200 netmask 0xfffffe00 broadcast 172.16.5.255
\tmedia: autoselect
\tstatus: active`,
    options: ['172.16.5.10', '172.16.6.10', '172.16.3.250', '172.16.7.1'],
    answer: [0],
    explanation: "macOS prints the mask in hex: 0xfffffe00 = 255.255.254.0 = **/23**. With a block size of 2 in the third octet, 172.16.4.200 is in **172.16.4.0/23** (172.16.4.1 - 172.16.5.254, broadcast 172.16.5.255, matching the output). 172.16.5.10 is inside that range.\n\n* 172.16.6.10 and 172.16.7.1 are in 172.16.6.0/23.\n* 172.16.3.250 is in 172.16.2.0/23.\n\nAll three require the default gateway.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-057',
    topic: '1.6',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. A corporate laptop can browse the internet but cannot reach internal file servers. The corporate SSID is CORP, secured with WPA2-Enterprise (PEAP). What is the most likely cause?',
    exhibit: `C:\\>netsh wlan show interfaces

There is 1 interface on the system:

    Name                   : Wi-Fi
    Description            : Intel(R) Wi-Fi 6 AX201 160MHz
    Physical address       : 8c:c6:81:3a:22:f1
    State                  : connected
    SSID                   : CORP-GUEST
    AP BSSID               : 70:6d:15:a2:4c:31
    Band                   : 5 GHz
    Channel                : 149
    Radio type             : 802.11ax
    Authentication         : WPA2-Personal
    Cipher                 : CCMP
    Connection mode        : Auto Connect
    Receive rate (Mbps)    : 286.8
    Transmit rate (Mbps)   : 286.8
    Signal                 : 90%
    Profile                : CORP-GUEST`,
    options: [
      'The laptop is connected to the guest SSID instead of the corporate SSID',
      'The signal is too weak for reliable connectivity',
      'The CCMP cipher cannot be used to reach internal servers',
      'Channel 149 is a DFS channel that blocks internal traffic',
    ],
    answer: [0],
    explanation: "The output shows SSID **CORP-GUEST** with **WPA2-Personal** authentication, not CORP with WPA2-Enterprise. Guest WLANs normally allow only internet access, which matches the symptom. Connect the laptop to CORP (and consider removing the auto-connect guest profile).\n\n* A signal of 90% is strong.\n* CCMP (AES) is the normal WPA2 cipher and has no effect on which destinations are reachable.\n* Channel 149 is in U-NII-3, which is not a DFS channel, and DFS never filters traffic by destination anyway.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-058',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user on PC 10.20.30.57 cannot open any websites. An AI assistant reviewed the user's test output. What is the correct evaluation of its recommendation?",
    exhibit: `C:\\>ping -n 2 10.20.30.1
Reply from 10.20.30.1: bytes=32 time=1ms TTL=255
Reply from 10.20.30.1: bytes=32 time<1ms TTL=255

C:\\>ping -n 2 8.8.8.8
Request timed out.
Request timed out.

C:\\>tracert -d -h 4 8.8.8.8
Tracing route to 8.8.8.8 over a maximum of 4 hops
  1    <1 ms    <1 ms    <1 ms  10.20.30.1
  2     *        *        *     Request timed out.
  3     *        *        *     Request timed out.
  4     *        *        *     Request timed out.
Trace complete.

C:\\>nslookup www.cisco.com
DNS request timed out.
    timeout was 2 seconds.
Server:  UnKnown
Address:  10.10.50.53

AI assistant: "Ping to the gateway works, so the network is fine. This is a
DNS failure. Run ipconfig /flushdns and change the DNS server to 8.8.8.8."`,
    options: [
      'Reject it: no remote IP is reachable, including the DNS server, so the fault is routing beyond the gateway',
      'Accept it: the nslookup timeout proves that the DNS server is the fault, because the gateway replies',
      'Accept it, but use 1.1.1.1 instead of 8.8.8.8 because 8.8.8.8 is filtered',
      'Reject it: the asterisks in tracert indicate a duplex mismatch between the PC and its switch port',
    ],
    answer: [0],
    explanation: "Work up the stack: the gateway answers, but **no remote IP answers**. 8.8.8.8 times out, the trace dies after hop 1, and the DNS server 10.10.50.53 (in another subnet) is also unreachable. That points to a routing, ACL, or upstream problem at or beyond 10.20.30.1. DNS fails only because the DNS server cannot be reached. Pointing the PC at 8.8.8.8 cannot help, because 8.8.8.8 is unreachable too.\n\n* The nslookup timeout is consistent with a reachability failure; it does not isolate DNS.\n* Nothing shows that 8.8.8.8 specifically is filtered, and every remote hop fails.\n* tracert asterisks mean no reply; a duplex mismatch would degrade local traffic too, and the gateway replies cleanly.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-059',
    topic: '1.6',
    type: 'single',
    difficulty: 3,
    stem: 'From a Windows PC, `tracert 198.51.100.20` lists every hop to the destination. From a Linux server on the same subnet, `traceroute 198.51.100.20` shows replies for hops 1-3 and only asterisks afterward. Both hosts can ping the destination. What is the most likely explanation?',
    options: [
      'A firewall after hop 3 permits ICMP but drops the UDP probes that Linux traceroute sends by default',
      'The Linux server has the wrong default gateway',
      'The Linux server has an incorrect subnet mask',
      'Linux traceroute sends TCP SYN probes to port 443 by default, and the firewall blocks them',
    ],
    answer: [0],
    explanation: "Windows `tracert` uses **ICMP Echo Requests**; Linux (and macOS) `traceroute` uses **UDP** probes to high ports by default. A firewall that permits ICMP but blocks those UDP ports lets the Windows trace through and stops the Linux trace at that point. Try `traceroute -I` (ICMP) or `-T` (TCP) on Linux to confirm.\n\n* A wrong gateway or mask would break hops 1-3 and the ping as well, but the server reaches the destination.\n* TCP probes are optional (`-T`); they are not the default.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-060',
    topic: '1.6',
    type: 'match',
    difficulty: 1,
    stem: 'Match each troubleshooting task to the command that performs it.',
    pairs: [
      ['Show SSID, authentication, cipher, and signal on Windows', 'netsh wlan show interfaces'],
      ['Print only the IPv4 address of en0 on macOS', 'ipconfig getifaddr en0'],
      ['Show the routing table and default gateway on Linux', 'ip route'],
      ['Show the BSSID, frequency, and signal in dBm for wlan0 on Linux', 'iw dev wlan0 link'],
      ['Clear the DNS resolver cache on Windows', 'ipconfig /flushdns'],
      ['Show the IPv4 neighbor (ARP) cache on Linux', 'ip neigh'],
    ],
    explanation: "* `netsh wlan show interfaces` shows the Windows WLAN connection, including Authentication and Cipher.\n* On macOS, `ipconfig getifaddr en0` prints just the interface's IPv4 address (macOS `ipconfig` is not the Windows command).\n* `ip route` replaces `route -n` on Linux; look for `default via`.\n* `iw dev wlan0 link` shows the associated BSSID, SSID, frequency, signal, and bit rates.\n* `ipconfig /flushdns` clears the Windows DNS client cache.\n* `ip neigh` replaces `arp -n` on Linux.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-061',
    topic: '1.6',
    type: 'fill',
    difficulty: 1,
    stem: 'Which Windows command displays the IPv4 address, mask, default gateway, DNS servers, DHCP server, lease times, and MAC address of every network adapter?',
    answer: ['ipconfig /all', 'ipconfig.exe /all'],
    explanation: "`ipconfig /all` shows the full configuration of every adapter. Plain `ipconfig` shows only the address, mask, and gateway, without the MAC, DHCP server, lease times, or DNS servers.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-062',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The company's DNS servers are 10.10.50.53 and 10.10.50.54. What is causing the failure on this Linux workstation?",
    exhibit: `$ ping -c 2 10.10.60.25
PING 10.10.60.25 (10.10.60.25) 56(84) bytes of data.
64 bytes from 10.10.60.25: icmp_seq=1 ttl=62 time=1.21 ms
64 bytes from 10.10.60.25: icmp_seq=2 ttl=62 time=1.09 ms

$ ping -c 2 intranet.corp.example
ping: intranet.corp.example: Temporary failure in name resolution

$ cat /etc/resolv.conf
search corp.example
nameserver 10.10.50.35

$ dig @10.10.50.53 intranet.corp.example +short
10.10.60.25`,
    options: [
      'The resolver points to the wrong DNS server (10.10.50.35 instead of 10.10.50.53)',
      'The workstation has no default route',
      'The DNS server 10.10.50.53 has no A record for intranet.corp.example',
      'The search domain prevents fully qualified names from resolving',
    ],
    answer: [0],
    explanation: "Reachability by IP works, and querying the real DNS server directly (`dig @10.10.50.53`) returns the correct A record. The workstation's resolver, however, is configured with **10.10.50.35**, a transposed typo, so normal lookups fail. Correct the DNS server in the network configuration (on systemd-resolved systems, check `resolvectl status`).\n\n* The workstation reaches 10.10.60.25 in another subnet, so it has a working route.\n* `dig @10.10.50.53` proves the A record exists.\n* A search domain only adds candidates for unqualified names; it never blocks a fully qualified name.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-063',
    topic: '1.6',
    type: 'multi',
    difficulty: 1,
    stem: 'Which two Linux commands display the signal strength of a nearby or connected Wi-Fi network? (Choose two.)',
    options: ['nmcli device wifi list', 'iw dev wlan0 link', 'ip route', 'ip neigh', 'cat /etc/resolv.conf'],
    answer: [0, 1],
    explanation: "`nmcli device wifi list` shows visible networks with SSID, channel, rate, **SIGNAL**, and security. `iw dev wlan0 link` shows the current association, including **signal in dBm**.\n\n* `ip route` shows routes, `ip neigh` shows the neighbor/ARP cache, and `/etc/resolv.conf` lists DNS resolvers; none of them show RF information.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-064',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A Mac on VLAN 10 can reach local hosts but nothing on other subnets. The VLAN 10 gateway is R1 at 192.168.10.1. What is the cause?',
    exhibit: `% networksetup -getinfo "Wi-Fi"
Manual Configuration
IP address: 192.168.10.47
Subnet mask: 255.255.255.0
Router: 192.168.10.254
IPv6: Automatic
IPv6 IP address: none
IPv6 Router: none
Wi-Fi ID: a4:83:e7:5c:19:2b

% ping -c 2 192.168.10.1
64 bytes from 192.168.10.1: icmp_seq=0 ttl=255 time=1.912 ms
64 bytes from 192.168.10.1: icmp_seq=1 ttl=255 time=1.704 ms

% arp -a | grep 192.168.10
? (192.168.10.1) at 0:1a:2b:3c:4d:5e on en0 ifscope [ethernet]
? (192.168.10.254) at (incomplete) on en0 ifscope [ethernet]`,
    options: [
      "The Mac's manually configured router address (.254) does not exist",
      "The Mac's ARP cache holds a stale entry for R1 that must be deleted",
      'R1 has an ACL blocking ICMP that originates from the Mac',
      "The Mac's subnet mask is wrong for the 192.168.10.0/24 network",
    ],
    answer: [0],
    explanation: "The Mac is manually configured with **Router: 192.168.10.254**. Its ARP request for .254 never gets a reply (`(incomplete)`), so it cannot deliver any off-subnet traffic. R1 (.1) is reachable and resolves normally. Set the router to 192.168.10.1 (or switch the service back to DHCP).\n\n* R1's ARP entry is complete and R1 answers pings, so the entry is not stale.\n* R1 replies to ICMP (TTL 255 is typical of IOS).\n* 255.255.255.0 is correct for 192.168.10.0/24, and both .1 and .254 fall inside it.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-065',
    topic: '1.6',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The LAB-WIFI SSID was migrated from WPA2-Personal to WPA3-Personal only, keeping the same passphrase. A Linux laptop with a WPA3-capable NIC and driver can no longer connect with its saved profile. What should be changed?',
    exhibit: `$ nmcli -f SSID,CHAN,SIGNAL,SECURITY device wifi list | grep LAB-WIFI
LAB-WIFI   36    84      WPA3

$ nmcli -g 802-11-wireless-security.key-mgmt connection show LAB-WIFI
wpa-psk`,
    options: [
      'Change the profile key-mgmt from wpa-psk to sae',
      'Change the profile key management to wpa-eap, because WPA3 always requires 802.1X',
      'Move closer to the AP, because a signal of 84 is too weak for WPA3',
      'Use a 6 GHz channel, because channel 36 does not support WPA3',
    ],
    answer: [0],
    explanation: "The network now advertises **WPA3** (SAE) only, but the saved profile still uses key management **wpa-psk** (WPA2-Personal), so the client tries the wrong authentication method. Changing key-mgmt to **sae** (WPA3-Personal), for example `nmcli connection modify LAB-WIFI 802-11-wireless-security.key-mgmt sae`, fixes it; the passphrase can stay the same. This requires NIC/driver support for SAE, which the stem confirms.\n\n* wpa-eap is Enterprise (802.1X); WPA3-Personal uses a passphrase with SAE.\n* An nmcli signal of 84 (out of 100) is strong.\n* WPA3 works on 2.4, 5, and 6 GHz; it is *mandatory* on 6 GHz but not limited to it.",
    lesson: '1.6-client-troubleshooting',
  },

  // ---------------------------------------------------------------- 1.7
  {
    id: 'd1-066',
    topic: '1.7',
    type: 'order',
    difficulty: 1,
    stem: 'Put the DHCPv4 lease process for a new client in order.',
    items: [
      'The client broadcasts a DHCPDISCOVER from 0.0.0.0 to 255.255.255.255',
      'The server sends a DHCPOFFER with a proposed address and options',
      'The client broadcasts a DHCPREQUEST that identifies the chosen server and address',
      'The server sends a DHCPACK confirming the lease',
      'The client checks that the address is not in use (for example with ARP) and begins using it',
    ],
    explanation: "**DORA**: Discover, Offer, Request, Acknowledge. The Request is broadcast so that every server that made an offer learns which one was accepted. After the ACK, the client typically ARPs for its new address; if another device answers, it sends DHCPDECLINE and starts over.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-067',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Clients in VLAN 20 receive 169.254.x.x addresses. The DHCP server 10.1.99.10 has a pool for 10.1.20.0/24 and is reachable from DSW1. Which statement evaluates the AI assistant's recommendation correctly?",
    exhibit: `DSW1# show running-config | section interface GigabitEthernet1/0/48|interface Vlan20
interface GigabitEthernet1/0/48
 description TO-DHCP-SERVER-SEGMENT
 no switchport
 ip address 10.1.99.1 255.255.255.0
interface Vlan20
 description USERS
 ip address 10.1.20.1 255.255.255.0

AI assistant: "VLAN 20 clients cannot reach a DHCP server. Fix: add
'ip helper-address 10.1.99.10' under interface GigabitEthernet1/0/48 so
DHCP requests are forwarded toward the server."`,
    options: [
      'Right diagnosis, wrong interface: put `ip helper-address 10.1.99.10` under interface Vlan20',
      'The recommendation is correct as written',
      'The recommendation is wrong: configure `ip helper-address 10.1.20.1` under GigabitEthernet1/0/48',
      'The recommendation is wrong: a Layer 3 switch cannot relay DHCP, so the server must be moved into VLAN 20',
    ],
    answer: [0],
    explanation: "Vlan20 has no `ip helper-address`, so client Discovers (broadcasts) die at the SVI: the assistant's diagnosis is correct. But the relay must be configured on the interface that **receives the client broadcasts**, here `interface Vlan20`. DSW1 then sets giaddr to 10.1.20.1, unicasts to 10.1.99.10, and the server selects its 10.1.20.0/24 pool. A helper on Gi1/0/48 would relay only broadcasts that arrive from the server segment.\n\n* As written, the fix leaves VLAN 20 unchanged.\n* The helper address must be the **server's** address, not the SVI's own address, and on the client-facing interface.\n* Layer 3 switches relay DHCP with `ip helper-address` on SVIs just like routers.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-068',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 is the DHCP server for VLAN 30 (10.1.30.0/24). Users who arrive early in the day work normally, but users who arrive later get 169.254.x.x addresses. What is the cause?',
    exhibit: `R1# show ip dhcp pool VLAN30

Pool VLAN30 :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0
 Total addresses                : 254
 Leased addresses               : 244
 Excluded addresses             : 10
 Pending event                  : none
 1 subnet is currently in the pool :
 Current index        IP address range                    Leased/Excluded/Total
 0.0.0.0              10.1.30.1        - 10.1.30.254       244   / 10    / 254`,
    options: [
      'The pool is exhausted: every address is either leased or excluded',
      'The ip helper-address for VLAN 30 is missing',
      'The pool is missing its default-router option',
      'Address conflicts have removed most addresses from the pool',
    ],
    answer: [0],
    explanation: "244 leased + 10 excluded = 254 = every host address in the /24, so the pool is **exhausted**. Early arrivals got leases; later clients get no Offer and fall back to APIPA. Remedies: shorten the lease time (stale leases from departed devices linger), enlarge the subnet (for example a /23 with a matching pool), or clear stale bindings.\n\n* The relay or server path clearly works, because 244 clients received leases.\n* A missing default-router would still hand out addresses; clients would just lack a gateway.\n* Conflicts would appear in `show ip dhcp conflict`; the counters show addresses that are leased, not removed.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-069',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 should provide DHCP to hosts directly connected to Gi0/0/1, but they receive no addresses. What is the problem?',
    exhibit: `R1# show running-config | section dhcp|interface GigabitEthernet0/0/1
ip dhcp excluded-address 192.168.20.1 192.168.20.10
ip dhcp pool LAN20
 network 192.168.2.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 192.168.20.5
interface GigabitEthernet0/0/1
 ip address 192.168.20.1 255.255.255.0`,
    options: [
      "The pool's network statement (192.168.2.0/24) does not match the Gi0/0/1 subnet (192.168.20.0/24)",
      'The excluded range includes the default gateway, so the pool cannot start',
      'R1 needs `ip helper-address 192.168.20.1` on Gi0/0/1 to serve its own clients',
      'The DNS server cannot be in the same subnet as the clients',
    ],
    answer: [0],
    explanation: "An IOS DHCP server chooses a pool by matching the receiving interface's subnet (or the relay's giaddr) against each pool's `network`. Gi0/0/1 is 192.168.20.0/24, but the pool is 192.168.2.0/24, a typo, so no pool matches and no Offers are sent. Fix: `network 192.168.20.0 255.255.255.0` under the pool.\n\n* Excluding the gateway address is correct practice, not a fault.\n* No relay is needed when the server is on the clients' own subnet.\n* A DNS server can be in any reachable subnet, including the clients' own.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-070',
    topic: '1.7',
    type: 'multi',
    difficulty: 1,
    stem: 'Which two messages does a new DHCP client, which has no IP address yet, send as IPv4 broadcasts? (Choose two.)',
    options: ['DHCPDISCOVER', 'DHCPREQUEST', 'DHCPOFFER', 'DHCPACK', 'DHCPRELEASE'],
    answer: [0, 1],
    explanation: "With no address and no knowledge of servers, the client broadcasts the **Discover** (0.0.0.0 to 255.255.255.255, UDP 68 to 67). It also broadcasts the **Request** so that all servers that made offers learn which one was chosen.\n\n* Offer and ACK are sent by the **server** (as unicast or broadcast, depending on the client's broadcast flag).\n* A Release is unicast by a client that already has an address.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-071',
    topic: '1.7',
    type: 'fill',
    difficulty: 1,
    stem: 'On which UDP port does a DHCPv4 server listen for client messages?',
    answer: ['67', 'udp 67', 'udp/67', 'port 67'],
    explanation: "DHCPv4 (inherited from BOOTP) uses **UDP 67** on the server (and relay) side and **UDP 68** on the client side. ACLs between clients, relays, and servers must permit both.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-072',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 also connects to a second ISP on Gi0/0/2 (198.51.100.2/30). An engineer adds `ip route 0.0.0.0 0.0.0.0 198.51.100.1`. Which default route will R1 use?',
    exhibit: `R1# show ip interface brief | include 0/0/0
GigabitEthernet0/0/0   203.0.113.45    YES DHCP   up                    up

R1# show ip route static | include 0.0.0.0/0
S*    0.0.0.0/0 [254/0] via 203.0.113.1`,
    options: [
      "The new static route, because AD 1 beats the DHCP-learned default route's AD of 254",
      'The DHCP-learned route via 203.0.113.1, because routes learned from DHCP are always preferred',
      'Both routes, load-balancing equally, because both are static default routes',
      'The DHCP-learned route, because it was installed first',
    ],
    answer: [0],
    explanation: "With `ip address dhcp`, IOS installs a default route toward the DHCP-provided gateway with **administrative distance 254**, deliberately weak so that any manually configured default (AD 1) wins. After the new route is added, `0.0.0.0/0 [1/0] via 198.51.100.1` replaces it in the routing table.\n\n* DHCP-learned defaults are the *least* preferred.\n* Equal-cost load balancing requires equal AD and metric; 1 and 254 are not equal.\n* Installation order does not matter; lower AD wins.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-073',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A network printer is statically configured as 192.168.10.30 in the 192.168.10.0/24 subnet served by R1. Which action prevents this conflict from recurring?',
    exhibit: `R1# show ip dhcp conflict
IP address        Detection method   Detection time          VRF
192.168.10.30     Ping               Oct 24 2026 07:58 AM

R1# show running-config | include excluded
ip dhcp excluded-address 192.168.10.1 192.168.10.20`,
    options: [
      'Add `ip dhcp excluded-address 192.168.10.30`, then clear the entry with `clear ip dhcp conflict 192.168.10.30`',
      'Enter `clear ip dhcp conflict *` only; the conflict entry itself is the problem',
      'Disable conflict detection with `ip dhcp ping packets 0` so that the server stops pinging addresses',
      'Increase the lease time so that the printer keeps its address',
    ],
    answer: [0],
    explanation: "The printer's static address lies inside the pool but outside the excluded range (.1 - .20). Before offering .30, R1 pinged it, got a reply from the printer, and logged a **conflict**. Excluding .30 keeps the server from ever offering it; clearing the conflict entry then tidies the table.\n\n* Clearing conflicts alone returns .30 to the pool, so the same conflict happens again.\n* Disabling ping checks would make R1 hand .30 to a client, creating a real duplicate IP.\n* The printer is static; lease time does not apply to it.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-074',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'R2 relays DHCP for clients on Gi0/0/1 (10.5.5.1/24) with `ip helper-address 10.9.9.10`. The server at 10.9.9.10 has pools for many subnets. How does the server choose the pool for these clients?',
    options: [
      'It matches the giaddr (10.5.5.1) inserted by R2 against its pool networks',
      "It uses the client's source IP address in the Discover",
      'It uses the subnet of its own interface that received the packet',
      "It uses the OUI of the client's MAC address to determine the client's VLAN",
    ],
    answer: [0],
    explanation: "The relay writes the IP address of the interface where it received the broadcast into **giaddr** (gateway IP address). The server matches giaddr against its pools, so 10.5.5.1 selects the 10.5.5.0/24 pool, and replies go back to the relay at that address.\n\n* The client's source IP is 0.0.0.0.\n* The server's own interface subnet would be used only for clients on the server's local segment (no relay).\n* The MAC OUI identifies the NIC vendor, not a location.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-075',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Clients in VLAN 40 receive leases through a relay on DSW1 interface Vlan40 (10.1.40.1) from an IOS DHCP server. They can ping each other and 10.1.40.1 but cannot reach other subnets. What is the most likely fault?',
    exhibit: `C:\\>ipconfig /all

Ethernet adapter Ethernet:

   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 10.1.40.23(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : Saturday, October 24, 2026 9:01:15 AM
   Lease Expires . . . . . . . . . . : Sunday, October 25, 2026 9:01:15 AM
   Default Gateway . . . . . . . . . :
   DHCP Server . . . . . . . . . . . : 10.1.99.10
   DNS Servers . . . . . . . . . . . : 10.1.99.53`,
    options: [
      'The DHCP pool for 10.1.40.0/24 is missing `default-router 10.1.40.1`',
      'The `ip helper-address` command is missing on interface Vlan40',
      'The DHCP server has no route back to 10.1.40.0/24',
      "The pool's `dns-server` statement is wrong",
    ],
    answer: [0],
    explanation: "The client holds a valid lease (with the default 1-day lease) and DNS servers, but the **Default Gateway is blank**, so the pool did not supply option 3. Add `default-router 10.1.40.1` to the pool and have clients renew (`ipconfig /renew`).\n\n* The relay works: the lease came from 10.1.99.10 through it.\n* If the server had no route back to the giaddr subnet, the client would never have received the Offer and ACK.\n* A wrong DNS server would break name resolution, but pings to other subnets by IP would still work.",
    lesson: '1.7-dhcpv4',
  },
  // ================================================== Expansion set (d1-076 ... d1-115)

  // ---------------------------------------------------------------- 1.1
  {
    id: 'd1-076',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A workstation on SW1 Gi1/0/12 reports slow file transfers. The switch port and the workstation NIC are both set to auto-negotiate, and the workstation reports 1000 Mb/s full duplex. Counters were cleared one hour ago. What is the most likely cause?',
    exhibit: `SW1# show interfaces GigabitEthernet1/0/12 status

Port         Name               Status       Vlan       Duplex  Speed Type
Gi1/0/12     ASSY-LINE-4        connected    30           a-full a-1000 10/100/1000BaseTX

SW1# show interfaces GigabitEthernet1/0/12 counters errors

Port          Align-Err     FCS-Err    Xmit-Err     Rcv-Err  UnderSize  OutDiscards
Gi1/0/12            214        5871           0        6085          0            0

Port         Single-Col  Multi-Col   Late-Col  Excess-Col  Carri-Sen      Runts     Giants
Gi1/0/12              0          0          0           0          0          0          0`,
    options: [
      'Frames are corrupted on the cable run, for example by EMI or physical damage',
      'A duplex mismatch: the workstation is half duplex and is corrupting its frames',
      'An MTU mismatch: the workstation sends jumbo frames that the port rejects',
      'Egress congestion: the port drops frames whenever its output buffers fill',
    ],
    answer: [0],
    explanation: "FCS (CRC) and alignment errors mean frames **arrived with bad checksums**: bits were damaged somewhere between the workstation NIC and the switch port. Both ends negotiated 1000/full (`a-full`), and every collision counter and the runt counter are zero, so the configuration is healthy. That leaves the physical path: a damaged or poorly terminated cable, a bad patch cord or jack, EMI from nearby power or motors, or a failing NIC. Test the run (TDR or a cable certifier), swap patch cords, and reroute or shield the cable if it runs near noise sources.\n\n* **Duplex mismatch** is ruled out: both ends negotiated full duplex, and a mismatch would also produce runts on the full-duplex side and collisions on the half-duplex side.\n* **MTU mismatch** increments **Giants**, which is zero.\n* **Egress congestion** shows up as **OutDiscards** (output drops), which is zero; it concerns frames leaving the port, not frames arriving with a bad FCS.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-077',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users report slow access to resources behind R1 during business hours. An AI assistant analyzed SW1's uplink to R1. Which statement correctly evaluates the assistant's conclusion?",
    exhibit: `SW1# show interfaces GigabitEthernet1/0/24
GigabitEthernet1/0/24 is up, line protocol is up (connected)
  Hardware is Gigabit Ethernet, address is 7c21.0e4f.9a18 (bia 7c21.0e4f.9a18)
  Description: UPLINK-TO-R1
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,
     reliability 255/255, txload 251/255, rxload 38/255
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
  ...
  Input queue: 0/2000/0/0 (size/max/drops/flushes); Total output drops: 48213
  ...
  5 minute input rate 149000000 bits/sec, 15102 packets/sec
  5 minute output rate 985000000 bits/sec, 83311 packets/sec
  ...
     0 runts, 0 giants, 0 throttles
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
  ...
     0 output errors, 0 collisions, 0 interface resets

AI assistant: "48,213 output drops on Gi1/0/24 indicate a failing cable or
port. Replace the patch cable to R1 and move the uplink to a spare port."`,
    options: [
      'Wrong: the uplink is near line rate with zero errors, so the drops are congestion',
      'Correct: output drops are physical-layer errors, so the cable should be replaced',
      'Wrong: the drops reveal a duplex mismatch, so both ends should be set to auto',
      'Wrong: the input queue is full, so the switch CPU is overloaded and dropping traffic',
    ],
    answer: [0],
    explanation: "**Total output drops** counts frames discarded because the egress queue was full. txload 251/255 and a 5-minute output rate of about 985 Mb/s show the 1 Gb/s uplink is saturated toward R1, and there are **zero** CRC, input, or output errors, so the cable is fine; replacing it changes nothing. Fix the capacity problem: add bandwidth (an EtherChannel or a 10 Gb/s uplink), apply QoS to protect critical traffic, or find what is filling the link.\n\n* Output drops are not physical-layer errors; physical faults show up as CRC errors, input errors, or interface resets, all zero here.\n* The port is full duplex at 1000 Mb/s with zero collisions and runts, so nothing points to a duplex mismatch.\n* The input queue is 0/2000 with 0 drops, so there is no sign of input-queue or CPU trouble.\n\nLesson for AI output: a large counter is not automatically a hardware fault. Check what the counter measures and whether the rest of the evidence agrees.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-078',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A PC with a gigabit NIC on SW1 Gi1/0/7 links at only 100 Mb/s; the NIC supports automatic speed downshift. The cable runs through a patch panel to a wall jack. An engineer ran a TDR test on the port. What does the output indicate?',
    exhibit: `SW1# show interfaces GigabitEthernet1/0/7 status

Port         Name               Status       Vlan       Duplex  Speed Type
Gi1/0/7      DESK-3-114         connected    20           a-full  a-100 10/100/1000BaseTX

SW1# show cable-diagnostics tdr interface GigabitEthernet1/0/7
TDR test last run on: October 24 10:02:11

Interface Speed Local pair Pair length        Remote pair Pair status
--------- ----- ---------- ------------------ ----------- --------------------
Gi1/0/7   100M  Pair A     52   +/- 5  meters Pair A      Normal
                Pair B     52   +/- 5  meters Pair B      Normal
                Pair C     31   +/- 5  meters N/A         Open
                Pair D     31   +/- 5  meters N/A         Open`,
    options: [
      'Pins 4-5 and 7-8 are open about 31 m out, so 1000BASE-T cannot use all four pairs',
      'The run is longer than 100 m, so the NIC lowered its speed to reduce bit errors',
      'Pairs C and D are unused by Ethernet, so the open pairs are harmless at any speed',
      'Pairs A and B are crossed at the wall jack, so Auto-MDIX forced the port to 100 Mb/s',
    ],
    answer: [0],
    explanation: "Catalyst TDR labels the pairs A-D: A = pins 1/2, B = 3/6, C = 4/5, D = 7/8. Pairs C and D are **Open** about 31 m from the switch, while A and B test normal over the full 52 m run. An open at that distance is typically a bad termination at the patch panel or broken conductors. **1000BASE-T transmits on all four pairs**, so it cannot come up; **100BASE-TX uses only pins 1, 2, 3, and 6** (pairs A and B), so the NIC downshifts to 100 Mb/s. Re-terminate or replace the faulty segment.\n\n* The run is about 52 m, well within the 100 m channel limit.\n* Pairs C and D are unused only at 10 and 100 Mb/s; 1000BASE-T (and 2.5G/5G/10GBASE-T) needs all four.\n* Pairs A and B test Normal, and Auto-MDIX corrects pair swaps without limiting speed.\n\n(Without a downshift feature on the NIC, the same fault usually leaves a gigabit link down or flapping instead of linking at 100 Mb/s.)",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-079',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each interface symptom to its most likely cause.',
    pairs: [
      ['Giants increasing', "The neighbor sends frames larger than this port's MTU, such as jumbo frames"],
      ['Total output drops increasing, no errors', 'More traffic is queued for the port than its speed can transmit'],
      ['CRC errors on an auto/auto full-duplex link, no collisions', 'Frames are damaged in transit by a bad cable, termination, or EMI'],
      ['Optical Rx power flagged ++ (high alarm)', 'Too much light at the receiver, such as a long-reach optic on a short fiber'],
      ['Overruns increasing in the input counters', 'The receive hardware cannot move incoming frames into buffers fast enough'],
    ],
    explanation: "* **Giants** are frames above the maximum size the port accepts (1518 bytes, or 1522 with a VLAN tag), usually an MTU or jumbo-frame mismatch between neighbors.\n* **Output drops** with clean error counters mean egress congestion: the queue overflowed. Add bandwidth or apply QoS.\n* **CRC/FCS errors** on a correctly negotiated full-duplex link point to the physical path: cabling, terminations, patch cords, EMI, or a failing NIC or optic.\n* A **high** Rx alarm (`++`) means the receiver is overloaded, for example an extended-reach optic on a few meters of fiber; add an attenuator or use the right optic. (Low readings, `-` or `--`, point to loss: dirty connectors, bends, breaks.)\n* **Overruns** count frames the receiver hardware could not hand to a buffer because the input rate exceeded what it could process.",
    lesson: '1.1-interface-errors',
  },
  {
    id: 'd1-080',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. SW1 and SW2 are in the same data center, 40 m apart, connected by OM4 multimode fiber. The link was up until SW2's optic failed and a technician replaced it, reconnecting the existing patch cord exactly as before. The link is now down on both ends. What will restore the link?",
    exhibit: `SW1# show interfaces TenGigabitEthernet1/1/3 status

Port         Name               Status       Vlan       Duplex  Speed Type
Te1/1/3      TO-SW2             notconnect   routed       full    10G SFP-10GBase-SR

SW2# show interfaces TenGigabitEthernet1/1/3 status

Port         Name               Status       Vlan       Duplex  Speed Type
Te1/1/3      TO-SW1             notconnect   routed       full    10G SFP-10GBase-LR`,
    options: [
      "Replace SW2's optic with a 10GBASE-SR module to match SW1 and the multimode fiber",
      "Replace SW1's optic with a 10GBASE-LR module so that both ends use the same type",
      'Swap the two LC connectors at SW2, because a new optic reverses the strand polarity',
      'Configure speed 10000 on both ports, because LR and SR optics negotiate differently',
    ],
    answer: [0],
    explanation: "The Type column shows the mismatch: SW1 has a **10GBASE-SR** optic (850 nm, multimode) and SW2 now has a **10GBASE-LR** optic (1310 nm, single-mode). Both ends of a fiber link must use the same optic standard, and the standard must match the fiber. OM4 supports 10GBASE-SR to about 400 m, so 40 m is fine. Install an SR optic in SW2.\n\n* Changing SW1 to LR would give matching optics on the wrong fiber: LR is specified for single-mode fiber, not OM4 multimode.\n* An optic does not change polarity, and the patch cord was reconnected exactly as it was when the link worked.\n* 10GBASE-SR and -LR run at a fixed 10 Gb/s and do not auto-negotiate speed; no speed command fixes a wavelength and fiber-type mismatch.",
    lesson: '1.1-cabling-media',
  },
  {
    id: 'd1-081',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'A 10/100 Mbps crossover cable is wired T568A on one end and T568B on the other. Pin 1 on one end connects to which pin on the other end? Enter the pin number.',
    answer: ['3', 'pin 3'],
    explanation: "A crossover swaps the transmit and receive pairs used by 10BASE-T and 100BASE-TX: **pin 1 to pin 3** and pin 2 to pin 6 (and back). Wiring one end T568A and the other T568B does exactly that, because the two standards swap the green pair (pins 1/2 in T568A, 3/6 in T568B) and the orange pair (3/6 in T568A, 1/2 in T568B). A gigabit crossover also swaps pins 4/5 with 7/8. Auto-MDIX on modern ports makes crossovers largely unnecessary.",
    lesson: '1.1-cabling-media',
  },

  // ---------------------------------------------------------------- 1.2
  {
    id: 'd1-082',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A web application runs in a container on Linux host DOCKER-01. Users who browse to http://10.20.30.40 get 'connection refused'. Which URL should users use to reach the application?",
    exhibit: `$ ip -br addr show ens192
ens192           UP             10.20.30.40/24

$ docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED       STATUS       PORTS                                     NAMES
3f9c2a7d1b4e   nginx:1.27   "/docker-entrypoint.…"   2 hours ago   Up 2 hours   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   inventory-web

$ docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' inventory-web
172.17.0.2`,
    options: [
      'http://10.20.30.40:8080',
      'http://172.17.0.2:8080',
      'http://172.17.0.2:80',
      'http://10.20.30.40:80/inventory-web',
    ],
    answer: [0],
    explanation: "`0.0.0.0:8080->80/tcp` means Docker **published** the container's port 80 on **host port 8080** on all of the host's IPv4 addresses (`[::]:8080` does the same for IPv6). Docker translates connections that arrive at 10.20.30.40:8080 to the container at 172.17.0.2:80. Nothing listens on host port 80, hence 'connection refused'.\n\n* 172.17.0.2 is the container's address on the host-internal `docker0` bridge. LAN users have no route to it, and port 8080 exists only on the host side of the mapping.\n* 172.17.0.2:80 works from the Docker host itself, but users on the LAN cannot route to the bridge network.\n* Adding a path does not change the port: the URL still targets host port 80, where nothing is listening.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-083',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Linux host DOCKER-01 runs containers on the default Docker bridge network. It reaches most of the network, but it cannot reach the backup server 172.17.88.20 in a remote data-center subnet. Other hosts reach that server without problems. What is the cause?',
    exhibit: `$ ip -br addr
lo               UNKNOWN        127.0.0.1/8 ::1/128
ens192           UP             10.20.30.40/24
docker0          UP             172.17.0.1/16

$ ip route
default via 10.20.30.1 dev ens192 proto static
10.20.30.0/24 dev ens192 proto kernel scope link src 10.20.30.40
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1

$ ping -c 2 172.17.88.20
PING 172.17.88.20 (172.17.88.20) 56(84) bytes of data.
From 172.17.0.1 icmp_seq=1 Destination Host Unreachable
From 172.17.0.1 icmp_seq=2 Destination Host Unreachable`,
    options: [
      'The docker0 subnet overlaps the remote subnet, so the host sends that traffic to docker0',
      'The backup server drops ICMP from container hosts, so the ping never receives a reply',
      '172.17.88.20 is a public address, so it must be translated by NAT before it can be routed',
      'The default gateway 10.20.30.1 has no route to the remote 172.17.88.0/24 data-center subnet',
    ],
    answer: [0],
    explanation: "Docker's default bridge uses **172.17.0.0/16** on `docker0`. That connected /16 route is more specific than the default route, so the host believes 172.17.88.20 is directly attached to docker0 and ARPs for it there. No container answers, so ping reports `Destination Host Unreachable` **from the host's own docker0 address**, 172.17.0.1. Fix it by moving Docker's bridge to an unused range (the `bip` or `default-address-pools` settings in `/etc/docker/daemon.json`) and restarting Docker.\n\n* An ICMP filter at the server would cause silent timeouts, not an unreachable message generated locally by 172.17.0.1.\n* 172.17.0.0/16 lies inside RFC 1918's 172.16.0.0/12, so it is private and routed internally without NAT.\n* The route lookup on this host never selects the default route for 172.17.88.20, so the packets never reach 10.20.30.1; other hosts reach the server through the routed network.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-084',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'An ESXi host running 12 VMs connects to SW1 Gi1/0/10 through an 802.1Q trunk. Which two statements are true? (Choose two.)',
    options: [
      "SW1 learns each VM's vNIC MAC address on Gi1/0/10, in the VLAN of the VM's port group",
      'After live migration to another host, a VM keeps its MAC and IP, and switches relearn the MAC on the new port',
      "All 12 VMs send frames using the burned-in MAC address of the host's physical NIC",
      'Each VM needs its own dedicated physical NIC for the hypervisor to forward its traffic',
      'Frames between two VMs in the same port group on this host always hairpin through SW1',
      "A VM's vNIC receives a new random MAC address every time the VM is powered on",
    ],
    answer: [0, 1],
    explanation: "Every vNIC has its own MAC address (VMware uses OUIs such as 00:50:56 and 00:0C:29), and the vSwitch forwards VM frames onto the uplink unchanged, tagged with the port group's VLAN. SW1 therefore learns many MAC addresses on one port, which matters for features such as port security. During live migration (vMotion) the VM keeps its MAC and IP; the destination host sends frames (RARP by default on ESXi) so the physical switches relearn the MAC on the new host's port.\n\n* VMs do not use the host NIC's burned-in MAC; each vNIC has its own.\n* Many VMs share a few physical uplinks; that is the point of a virtual switch.\n* Traffic between VMs in the same port group on the same host is switched inside the vSwitch and never reaches SW1.\n* A vNIC MAC is generated when the VM is created and is kept in its configuration; it does not change at each power-on.",
    lesson: '1.2-virtualization',
  },
  {
    id: 'd1-085',
    topic: '1.2',
    type: 'match',
    difficulty: 1,
    stem: 'Match each virtualization feature to its description.',
    pairs: [
      ['Live migration (for example vMotion)', 'Moves a running VM to another host without shutting it down'],
      ['Snapshot', "Captures a VM's state at a point in time so later changes can be rolled back"],
      ['Overcommitment', 'Assigning more total vCPU or vRAM to VMs than the host physically has'],
      ['NIC teaming on a vSwitch', 'Uses several physical uplinks for redundancy and load sharing'],
      ['Template', 'A master VM image used to deploy many identical VMs quickly'],
    ],
    explanation: "* **Live migration** keeps the VM running (same MAC and IP) while moving its memory and execution to another host, typically for maintenance or load balancing.\n* A **snapshot** preserves the disk (and optionally memory) state; it is a rollback point, not a backup.\n* **Overcommitment** works because VMs rarely use all allocated resources at once, but heavy overcommitment causes contention.\n* **NIC teaming** groups physical NICs as vSwitch uplinks; if one fails, traffic moves to another.\n* A **template** is a golden image cloned to create new VMs with a consistent build.",
    lesson: '1.2-virtualization',
  },

  // ---------------------------------------------------------------- 1.3
  {
    id: 'd1-086',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. PC-B is statically addressed in VLAN 20 (10.1.20.0/24), whose gateway is 10.1.20.1. Server 10.1.30.10 is in VLAN 30. Other VLAN 20 hosts reach the server, and proxy ARP is disabled on the gateway. Why can PC-B not reach the server?',
    exhibit: `C:\\>ipconfig

Ethernet adapter Ethernet:

   IPv4 Address. . . . . . . . . . . : 10.1.20.55
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . : 10.1.20.1

C:\\>ping -n 2 8.8.8.8

Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=12ms TTL=117
Reply from 8.8.8.8: bytes=32 time=11ms TTL=117

C:\\>ping -n 2 10.1.30.10

Pinging 10.1.30.10 with 32 bytes of data:
Reply from 10.1.20.55: Destination host unreachable.
Reply from 10.1.20.55: Destination host unreachable.`,
    options: [
      "PC-B's /16 mask makes 10.1.30.10 look local, so PC-B ARPs for the server directly",
      "PC-B's gateway 10.1.20.1 lies outside its configured subnet, so remote traffic fails",
      'The server has no route back to 10.1.20.0/24, so its replies never reach PC-B',
      'An ACL on the gateway blocks traffic from 10.1.20.55 to the VLAN 30 subnet',
    ],
    answer: [0],
    explanation: "With 255.255.0.0, PC-B believes its subnet is **10.1.0.0/16**, which includes 10.1.30.10. Hosts deliver on-link traffic directly, so PC-B ARPs for 10.1.30.10 in VLAN 20 instead of sending the packet to its gateway. Nobody answers (the server is in another VLAN and proxy ARP is off), so Windows reports **Destination host unreachable** from its own address, the signature of a failed ARP. 8.8.8.8 is outside 10.1.0.0/16, so it goes to the gateway and works. Fix the mask to 255.255.255.0.\n\n* 10.1.20.1 is inside 10.1.0.0/16, and the 8.8.8.8 replies prove the gateway is reachable.\n* A missing return route or an ACL would let packets leave PC-B and then fail (timeouts, or an unreachable sent by the router). Here PC-B never sends them, which is why the message comes from 10.1.20.55 itself; other VLAN 20 hosts also reach the server.\n\n(With proxy ARP enabled, the IOS default, the gateway would answer the ARP for 10.1.30.10 and hide this mistake.)",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-087',
    topic: '1.3',
    type: 'fill',
    difficulty: 1,
    stem: 'A router-to-router point-to-point link must use exactly two IPv4 addresses, with no network or broadcast address wasted (RFC 3021). What prefix length should be used?',
    answer: ['/31', '31', '255.255.255.254'],
    explanation: "A **/31** (255.255.255.254) contains exactly two addresses, and RFC 3021 lets both be used on point-to-point links, because a link with only two devices needs no network or broadcast address. A /30 has four addresses but only two usable, wasting half. IOS accepts /31 on point-to-point links; on Ethernet interfaces it may print a warning to use the mask cautiously, but it works when exactly two routers share the link.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-088',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement explains why IOS rejected the command?',
    exhibit: `R1(config)# interface GigabitEthernet0/0/2
R1(config-if)# ip address 172.16.15.255 255.255.252.0
% Bad mask /22 for address 172.16.15.255`,
    options: [
      "It is the subnet's broadcast address; the last usable host is 172.16.15.254",
      "It is the subnet's network address; the first usable host is 172.16.16.1",
      'A /22 mask cannot be used on a routed Ethernet interface; use a /24 instead',
      'An address ending in .255 is always reserved; the last usable host is 172.16.15.254',
    ],
    answer: [0],
    explanation: "/22 = 255.255.252.0, block size 4 in the third octet. 15 falls in the 12-15 block, so the subnet is **172.16.12.0/22**, with broadcast **172.16.15.255** and usable hosts 172.16.12.1 - 172.16.15.254. IOS reports `Bad mask` when the address is the network or broadcast address for the mask.\n\n* The network address is 172.16.12.0, and 172.16.16.1 belongs to the next /22.\n* Any valid mask can be used on a routed interface.\n* In a /22, addresses such as 172.16.12.255, 172.16.13.255, and 172.16.14.255 are ordinary hosts; only the subnet's last address is the broadcast. That option's usable-range half is right, but its reasoning is wrong.",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-089',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two addresses can be assigned to hosts in the subnet 10.44.128.0/18? (Choose two.)',
    options: ['10.44.143.255', '10.44.191.254', '10.44.128.0', '10.44.191.255', '10.44.192.10', '10.44.127.200'],
    answer: [0, 1],
    explanation: "/18 = 255.255.192.0, block size 64 in the third octet. 128 is a multiple of 64, so the subnet spans **10.44.128.0 - 10.44.191.255**.\n\n* **10.44.143.255** is a valid host: it ends in .255 but lies in the middle of the range.\n* **10.44.191.254** is the last usable host.\n* 10.44.128.0 is the network address, and 10.44.191.255 is the broadcast address.\n* 10.44.192.10 belongs to 10.44.192.0/18, and 10.44.127.200 belongs to 10.44.64.0/18.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-090',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: 'The block 172.20.0.0/16 must be divided into equal-size subnets. At least 12 subnets are required, and each subnet must be as large as possible. What prefix length should be used?',
    answer: ['/20', '20', '255.255.240.0'],
    explanation: "Subnets = 2^(borrowed bits). 3 bits give 8 subnets (too few); **4 bits give 16** (enough). 16 + 4 = **/20** (255.255.240.0), with 4094 usable hosts per subnet. A /21 also provides enough subnets (32) but halves each subnet to 2046 hosts, so it does not keep the subnets as large as possible.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-091',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A Linux server should be 10.60.8.25/24 with default gateway 10.60.8.1. The administrator entered these commands. What is the problem?',
    exhibit: `$ sudo ip addr add 10.60.8.25 dev eth0
$ sudo ip route add default via 10.60.8.1
Error: Nexthop has invalid gateway.

$ ip -br addr show eth0
eth0             UP             10.60.8.25/32 fe80::be24:11ff:fe3a:52c9/64

$ ip route
$`,
    options: [
      'With no prefix length the address became a /32, so no subnet is on-link',
      'The default route must be added before any IPv4 address is assigned to the interface',
      'eth0 is administratively down, so routes that point out of it cannot be installed',
      '10.60.8.1 is the network address of 10.60.8.0/24, so it cannot be used as a gateway',
    ],
    answer: [0],
    explanation: "`ip addr add` without `/prefix` assigns a **/32**, so no connected route for 10.60.8.0/24 is created (`ip route` is empty). The kernel then refuses a next hop that is not on a directly connected subnet: `Nexthop has invalid gateway`. Fix: `sudo ip addr del 10.60.8.25/32 dev eth0`, then `sudo ip addr add 10.60.8.25/24 dev eth0`, add the default route again, and make the change persistent in the distribution's network configuration.\n\n* Order is not the issue: the route is rejected because the gateway is not on-link, whenever it is added.\n* `ip -br addr` shows eth0 **UP**.\n* The network address of 10.60.8.0/24 is 10.60.8.0; 10.60.8.1 is the first usable host.",
    lesson: '1.3-ipv4-troubleshooting',
  },
  {
    id: 'd1-092',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An engineer asked an AI assistant for a VLSM plan. Which statement correctly evaluates the assistant's output?",
    exhibit: `Engineer: Split 192.168.40.0/24 into subnets for SALES (100 hosts),
          ENG (50 hosts), MGMT (20 hosts), and one router-to-router link.
          Allocate largest first, with no gaps.

AI assistant:
  SALES   192.168.40.0/25     hosts .1   - .126   broadcast .127
  ENG     192.168.40.128/26   hosts .129 - .190   broadcast .191
  MGMT    192.168.40.192/27   hosts .193 - .222   broadcast .223
  LINK    192.168.40.224/30   hosts .225 - .226   broadcast .227
  Free:   192.168.40.228 - 192.168.40.255`,
    options: [
      'The plan is correct: every subnet is big enough, aligned, and non-overlapping',
      'The plan is wrong: SALES needs a /24, because a /25 gives only 62 usable hosts',
      'The plan is wrong: ENG overlaps MGMT, because .192 is inside 192.168.40.128/26',
      'The plan is wrong: MGMT is too small, because a /27 gives only 14 usable hosts',
    ],
    answer: [0],
    explanation: "Check each subnet:\n\n* SALES: 100 hosts need 7 host bits (126 usable), so **/25**: .0 - .127.\n* ENG: 50 hosts need 6 bits (62 usable), so **/26**: .128 is a multiple of 64, range .128 - .191.\n* MGMT: 20 hosts need 5 bits (30 usable), so **/27**: .192 is a multiple of 32, range .192 - .223.\n* LINK: **/30** (2 usable): .224 is a multiple of 4, range .224 - .227.\n\nEvery subnet is large enough, starts on a valid boundary, and ends before the next begins, so the assistant is right.\n\n* A /25 provides 126 usable hosts; 62 is a /26.\n* 192.168.40.128/26 ends at .191, so .192 is the first address after it.\n* A /27 provides 30 usable hosts; 14 is a /28.",
    lesson: '1.3-ipv4-subnetting',
  },
  {
    id: 'd1-093',
    topic: '1.3',
    type: 'match',
    difficulty: 1,
    stem: 'Match each IPv4 address to its category.',
    pairs: [
      ['127.0.0.1', 'Loopback: traffic never leaves the host'],
      ['169.254.33.7', 'Link-local (APIPA): self-assigned when DHCP fails'],
      ['100.100.4.20', 'Shared address space for carrier-grade NAT'],
      ['172.30.5.9', 'RFC 1918 private address'],
      ['203.0.113.50', 'Documentation range, never routed on the internet'],
      ['239.1.1.1', 'Multicast group address, a destination only'],
    ],
    explanation: "* **127.0.0.0/8** is loopback.\n* **169.254.0.0/16** is IPv4 link-local, used by APIPA when no DHCP server answers.\n* **100.64.0.0/10** (100.64.0.0 - 100.127.255.255) is RFC 6598 shared space for CGNAT; 100.100.4.20 falls inside it.\n* **172.16.0.0/12** (172.16 - 172.31) is RFC 1918 private; 172.30.5.9 is in it.\n* **203.0.113.0/24** (TEST-NET-3), like 192.0.2.0/24 and 198.51.100.0/24, is reserved for documentation.\n* **224.0.0.0/4** is multicast; 239.0.0.0/8 is the administratively scoped (private) multicast range. A multicast address identifies a group and is never a host's interface address.",
    lesson: '1.3-ipv4-subnetting',
  },

  // ---------------------------------------------------------------- 1.4
  {
    id: 'd1-094',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Hosts on R1 Gi0/0/1 receive Router Advertisements but configure only link-local IPv6 addresses. `ipv6 unicast-routing` is enabled on R1. What is the problem?',
    exhibit: `R1# show ipv6 interface GigabitEthernet0/0/1
GigabitEthernet0/0/1 is up, line protocol is up
  IPv6 is enabled, link-local address is FE80::1
  No Virtual link-local address(es):
  Global unicast address(es):
    2001:DB8:CAFE:40::1, subnet is 2001:DB8:CAFE:40::/60
  Joined group address(es):
    FF02::1
    FF02::2
    FF02::1:FF00:1
  MTU is 1500 bytes
  ICMP error messages limited to one every 100 milliseconds
  ICMP redirects are enabled
  ICMP unreachables are sent
  ND DAD is enabled, number of DAD attempts: 1
  ND reachable time is 30000 milliseconds (using 30000)
  ND advertised reachable time is 0 (unspecified)
  ND advertised retransmit interval is 0 (unspecified)
  ND router advertisements are sent every 200 seconds
  ND router advertisements live for 1800 seconds
  ND advertised default router preference is Medium
  Hosts use stateless autoconfig for addresses.`,
    options: [
      'The interface prefix is /60; SLAAC needs a /64 prefix, so hosts ignore it',
      'R1 is not sending Router Advertisements because it has not joined FF02::2',
      'The RA must set the M flag before hosts may create global unicast addresses',
      'FE80::1 is a manual link-local address, so hosts reject RAs sourced from it',
    ],
    answer: [0],
    explanation: "R1 advertises the on-link prefix with the length configured on the interface: **/60**. SLAAC forms an address from the prefix plus a **64-bit** interface ID, so the advertised prefix must be exactly /64. A host that receives a prefix of any other length must ignore it for autoconfiguration (RFC 4862), so the hosts keep only link-local addresses. Change the interface address to `2001:DB8:CAFE:40::1/64`.\n\n* R1 has joined FF02::2 and reports RAs every 200 seconds, and the stem confirms hosts receive them.\n* The M flag tells hosts to use stateful DHCPv6; SLAAC does not need it, and no DHCPv6 server exists here.\n* FE80::1 is a valid manual link-local address; hosts accept RAs from any link-local source and use that address as the default gateway.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-095',
    topic: '1.4',
    type: 'fill',
    difficulty: 2,
    stem: 'What is the solicited-node multicast address for the IPv6 unicast address 2001:DB8:5:3::2A:7B9C? Enter it in compressed form.',
    answer: ['FF02::1:FF2A:7B9C', 'FF02:0:0:0:0:1:FF2A:7B9C', 'FF02:0000:0000:0000:0000:0001:FF2A:7B9C'],
    explanation: "The last two hextets of the address are **002A:7B9C**. A solicited-node group is FF02::1:FF00:0/104 plus the **last 24 bits** of the unicast address, here 2A:7B9C, giving **FF02::1:FF2A:7B9C**. A host joins this group for each of its unicast addresses; Neighbor Solicitations for address resolution and DAD are sent to it instead of to every node on the link.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-096',
    topic: '1.4',
    type: 'single',
    difficulty: 1,
    stem: 'An engineer must enter the address 2001:DB8:0:5::A:1 into a tool that accepts only fully expanded IPv6 addresses. Which entry is correct?',
    options: [
      '2001:0DB8:0000:0005:0000:0000:000A:0001',
      '2001:0DB8:0000:0005:0000:000A:0000:0001',
      '2001:DB80:0000:5000:0000:0000:A000:1000',
      '2001:0DB8:0000:0005:0000:0000:0000:000A',
    ],
    answer: [0],
    explanation: "Count the hextets shown: 2001, DB8, 0, 5, A, 1 = six, so `::` stands for exactly **two** zero hextets, placed where it appears (between 5 and A). Then restore the leading zeros in each hextet: **2001:0DB8:0000:0005:0000:0000:000A:0001**.\n\n* `...0005:0000:000A:0000:0001` moves one zero hextet after A, which is a different address.\n* `2001:DB80:...:5000:...:A000:1000` pads zeros on the right; compression removes only leading zeros.\n* `...0000:0000:0000:000A` expands `::` to three hextets and loses the final hextet, 1.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-097',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A help-desk technician asked an AI assistant why a Windows PC's IPv6 addresses do not contain FFFE. Which statement correctly evaluates the assistant's answer?",
    exhibit: `C:\\>ipconfig /all | findstr /C:"Physical" /C:"Default Gateway"
   Physical Address. . . . . . . . . : D4-5D-64-0B-3A-71
   Default Gateway . . . . . . . . . : fe80::1%14

C:\\>netsh interface ipv6 show addresses

Interface 14: Ethernet

Addr Type  DAD State   Valid Life Pref. Life Address
---------  ----------- ---------- ---------- ------------------------
Public     Preferred    29d23h58m   6d23h58m 2001:db8:acad:20:8d4e:12ab:6f3c:9e01
Temporary  Preferred     6d23h58m  23h58m12s 2001:db8:acad:20:3c19:a7d2:51e0:44b8
Other      Preferred     infinite   infinite fe80::8d4e:12ab:6f3c:9e01%14

AI assistant: "This is normal. Modified EUI-64 from D4-5D-64-0B-3A-71 would
give the interface ID d65d:64ff:fe0b:3a71, but Windows generates randomized
interface IDs by default. The Public address is the PC's stable SLAAC
address, the Temporary address is a privacy address it prefers for outbound
connections, and fe80::1 was learned from the router's Router Advertisements.
No change is needed."`,
    options: [
      'The assistant is correct: these are SLAAC addresses with randomized interface IDs',
      'The assistant is wrong: Windows uses EUI-64 for SLAAC, so these came from DHCPv6',
      'The assistant is wrong: two global addresses in one /64 indicate a duplicate address',
      'The assistant is wrong: an IPv6 default gateway must be a global unicast address',
    ],
    answer: [0],
    explanation: "The assistant is right on every point. EUI-64 check: D4 = 1101 0100; flipping the U/L bit (0x02) gives 1101 0110 = D6, so EUI-64 would produce D65D:64FF:FE0B:3A71, which appears in neither address. Windows randomizes interface IDs by default (current macOS and most Linux distributions also avoid EUI-64 for privacy). netsh labels the stable SLAAC address **Public** and the RFC 4941 privacy address **Temporary**, whose lifetimes (about 1 day preferred, 7 days valid) are shorter than the RA-derived 7-day and 30-day lifetimes of the Public address. A DHCPv6-assigned address would be labeled **Dhcp**.\n\n* Windows does not use EUI-64 by default, and no Dhcp-type address is listed.\n* A host using privacy extensions normally holds both a public and a temporary address in the same /64; both show DAD state Preferred, so both passed DAD.\n* IPv6 hosts normally use the router's **link-local** address, learned from RAs, as the default gateway.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-098',
    topic: '1.4',
    type: 'multi',
    difficulty: 3,
    stem: 'R1 does not have `ipv6 unicast-routing` configured. Interface Gi0/0/0 (MAC address 0c75.bd4a.9e10) is configured only with `ipv6 address 2001:DB8:1:1::1/64`. Which two addresses appear in the output of `show ipv6 interface GigabitEthernet0/0/0`? (Choose two.)',
    options: [
      'FE80::E75:BDFF:FE4A:9E10',
      'FE80::C75:BDFF:FE4A:9E10',
      'FF02::1:FF00:1',
      'FF02::2',
      '2001:DB8:1:1:E75:BDFF:FE4A:9E10',
      'FE80::1',
    ],
    answer: [0, 2],
    explanation: "Configuring any IPv6 address enables IPv6 on the interface, and IOS automatically creates a **link-local address using modified EUI-64**: 0C = 0000 1100; flipping the 0x02 bit gives 0000 1110 = 0E, so the interface ID is 0E75:BDFF:FE4A:9E10, displayed as **FE80::E75:BDFF:FE4A:9E10**. The interface also joins a solicited-node group for each unicast address; 2001:DB8:1:1::1 ends in 00:0001, so it joins **FF02::1:FF00:1** (plus FF02::1, and FF02::1:FF4A:9E10 for the link-local address).\n\n* `FE80::C75:...` is the EUI-64 result without flipping the U/L bit.\n* FF02::2 (all routers) is joined only when `ipv6 unicast-routing` is enabled.\n* The global address was configured manually as ::1; IOS builds a global EUI-64 address only with the `eui-64` keyword.\n* FE80::1 exists only if configured with `ipv6 address FE80::1 link-local`.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-099',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. R1 and R2 share an Ethernet link that is documented as 2001:DB8:ACAD:30::/64, and `ipv6 unicast-routing` is enabled on both. R1 can ping FE80::2 out Gi0/0/1, but it cannot ping 2001:DB8:ACAD:3::2. Which change fixes the problem?',
    exhibit: `R1# show ipv6 interface brief GigabitEthernet0/0/1
GigabitEthernet0/0/1   [up/up]
    FE80::1
    2001:DB8:ACAD:30::1

R1# show running-config interface GigabitEthernet0/0/1 | include ipv6
 ipv6 address FE80::1 link-local
 ipv6 address 2001:DB8:ACAD:30::1/64

R2# show ipv6 interface brief GigabitEthernet0/0/0
GigabitEthernet0/0/0   [up/up]
    FE80::2
    2001:DB8:ACAD:3::2

R2# show running-config interface GigabitEthernet0/0/0 | include ipv6
 ipv6 address FE80::2 link-local
 ipv6 address 2001:DB8:ACAD:3::2/64`,
    options: [
      "Change R2's global address to 2001:DB8:ACAD:30::2/64",
      'Remove the manual link-local addresses so both routers use EUI-64',
      'Change both global prefixes to /127 for the router-to-router link',
      'Add `ipv6 enable` to both interfaces to activate the global addresses',
    ],
    answer: [0],
    explanation: "Only **leading** zeros may be dropped: R1's `30` is hextet **0030**, while R2's `3` is **0003**. These are different /64 prefixes (2001:DB8:ACAD:30::/64 and 2001:DB8:ACAD:3::/64), so R1 has no connected route to R2's global address. Link-local pings work because both routers are on the same link regardless of their global prefixes. Readdress R2 as **2001:DB8:ACAD:30::2/64** to match the documentation.\n\n* Manual link-local addresses such as FE80::1 and FE80::2 are valid and independent of the global prefix.\n* /127 is recommended for point-to-point links (RFC 6164), but /64 also works; the length is not the fault, and the two prefixes would still differ.\n* `ipv6 enable` only creates a link-local address; configuring a global address already enables IPv6 on the interface.",
    lesson: '1.4-ipv6-addressing',
  },
  {
    id: 'd1-100',
    topic: '1.4',
    type: 'match',
    difficulty: 2,
    stem: 'Match each IPv6 prefix length to its typical use.',
    pairs: [
      ['/48', 'Allocation to an enterprise site, holding 65,536 /64 subnets'],
      ['/56', 'Common ISP delegation to a small office or home, holding 256 /64s'],
      ['/64', 'Standard LAN subnet, and the length SLAAC requires'],
      ['/127', 'Point-to-point link between two routers (RFC 6164)'],
      ['/128', 'A single address, such as a loopback or a host route'],
    ],
    explanation: "* A **/48** leaves 16 subnet bits: 2^16 = 65,536 /64s, the classic site allocation.\n* A **/56** leaves 8 bits: 256 /64s, typical for small sites and home connections.\n* A **/64** is the normal LAN size; SLAAC needs a 64-bit prefix plus a 64-bit interface ID.\n* A **/127** gives two addresses for a router-to-router link and avoids certain Neighbor Discovery exhaustion problems (RFC 6164); /64 also works on such links.\n* A **/128** identifies exactly one address, as on loopback interfaces or in host routes.",
    lesson: '1.4-ipv6-addressing',
  },

  // ---------------------------------------------------------------- 1.5
  {
    id: 'd1-101',
    topic: '1.5',
    type: 'fill',
    difficulty: 1,
    stem: 'An outdoor AP radio transmits at 14 dBm. It connects through a cable and connectors with 2 dB of total loss to a 9 dBi patch antenna. What is the EIRP in dBm?',
    answer: ['21', '21 dBm', '21dBm'],
    explanation: "EIRP = transmit power - cable and connector loss + antenna gain = 14 - 2 + 9 = **21 dBm** (about 126 mW). Regulatory limits are written in terms of EIRP, which is why fitting a higher-gain antenna can require lowering the radio's transmit power.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-102',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Voice users near AP-3F-07, in an office close to an airport, report that calls drop once or twice a day. What is the cause, and what is the best mitigation?',
    exhibit: `AP-3F-07 5 GHz radio event log (excerpt)
10:14:52  Radar detected on channel 52 (20 MHz)
10:14:52  Leaving channel 52; non-occupancy period 30 min
10:14:52  Moved to channel 149
10:14:53  12 clients disassociated, re-associating on channel 149
14:22:10  Radar detected on channel 56 (20 MHz)
14:22:10  Leaving channel 56; non-occupancy period 30 min
14:22:10  Moved to channel 40`,
    options: [
      'DFS makes the AP leave U-NII-2 channels when it hears radar; avoid DFS channels here',
      'Co-channel interference on channel 149; lower the transmit power of the surrounding APs',
      'A microwave oven is interfering on 5 GHz; move voice clients to the 2.4 GHz band instead',
      'Channel utilization is too high; widen the AP to 80 MHz channels to add more capacity',
    ],
    answer: [0],
    explanation: "Channels 52-64 (U-NII-2A) and 100-144 (U-NII-2C) are **DFS** channels shared with radar. When an AP detects radar on its channel it must stop transmitting there, stay off it for a **30-minute non-occupancy period**, and move to another channel; the forced change drops calls. Near airports or weather radar, the usual mitigation is to remove DFS channels from the plan for the affected APs and use U-NII-1 (36-48) and U-NII-3 (149-165), accepting fewer channels.\n\n* The log shows radar on the original channels; channel 149 is only where the AP landed afterward.\n* Microwave ovens interfere in 2.4 GHz, not 5 GHz, and moving voice to the crowded 3-channel 2.4 GHz band trades one problem for another.\n* An 80 MHz channel spans more spectrum, often including DFS channels, which makes radar events more likely and leaves fewer channels.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-103',
    topic: '1.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. An AI wireless assistant analyzed a ticket about slow laptops in a conference room. Which statement correctly evaluates the assistant's recommendation?",
    exhibit: `WLAN assistant (AI) - Ticket 4471: "Laptops in conference room B are slow"

Client 4c:79:6e:12:9a:05 on AP-CONF-B (5 GHz, channel 44)
  AP transmit power                   : 20 dBm
  Client transmit power (reported)    : 11 dBm
  Downlink RSSI (AP heard by client)  : -66 dBm
  Uplink RSSI (client heard by AP)    : -75 dBm
  Uplink retry rate                   : 28%

Recommendation: Raise AP-CONF-B to its maximum transmit power so the
laptops receive a stronger signal and throughput improves.`,
    options: [
      'Reject it: the weak direction is the uplink, and more AP power cannot improve it',
      'Accept it: more AP power improves RSSI in both directions, since RF paths are symmetric',
      'Accept it: more AP power raises the SNR that the AP measures on frames from the laptops',
      "Reject it: the laptops' 11 dBm transmit power exceeds legal limits and must be lowered",
    ],
    answer: [0],
    explanation: "Path loss is about the same in both directions: 20 dBm - (-66 dBm) = 86 dB on the downlink, and 11 dBm - 86 dB = -75 dBm on the uplink, which matches. The **uplink** is 9 dB weaker because the laptops transmit at lower power than the AP, and the 28% uplink retry rate confirms it is the struggling direction. Raising AP power improves only the downlink, which is already adequate; it widens the imbalance, enlarges the cell so distant clients stay associated, and adds co-channel interference with neighboring APs. Better fixes improve the uplink: an AP closer to or inside the room, or a denser design with modest AP power that matches client capabilities.\n\n* Path loss is symmetric, but received power depends on the *transmitter's* power; changing the AP's power does not change what the AP receives from a laptop.\n* SNR at the AP depends on the laptop's signal and the noise at the AP; AP transmit power affects neither.\n* 11 dBm is a typical client power; lowering it would make the uplink even weaker.",
    lesson: '1.5-wireless-rf',
  },
  {
    id: 'd1-104',
    topic: '1.5',
    type: 'multi',
    difficulty: 2,
    stem: 'A cafe wants a guest SSID that requires no password but still encrypts traffic over the air. Which two statements about OWE (Wi-Fi Enhanced Open) are true? (Choose two.)',
    options: [
      'Each client negotiates its own encryption key with the AP using a Diffie-Hellman exchange',
      "It encrypts traffic but does not authenticate users or prove the AP's identity",
      'Clients must enter a shared passphrase, which is then converted into the PMK',
      'It requires an 802.1X RADIUS server to generate a unique key for each user',
      'It is not permitted on 6 GHz radios, which accept only WPA3-Personal or Enterprise',
      "Any client that knows the SSID can decrypt other clients' traffic on the network",
    ],
    answer: [0, 1],
    explanation: "**OWE** (Opportunistic Wireless Encryption, RFC 8110) replaces the unencrypted open network: during association the client and AP run a **Diffie-Hellman exchange**, producing a unique PMK per client, and the 4-way handshake then derives encryption keys. Passive eavesdroppers cannot read the traffic. It is **unauthenticated** encryption: no passphrase or credentials, and nothing proves the AP is genuine, so an evil-twin AP can still offer OWE.\n\n* A shared passphrase describes WPA2/WPA3-Personal.\n* 802.1X and RADIUS describe Enterprise mode.\n* 6 GHz requires WPA3 or OWE, so OWE is explicitly allowed there.\n* Keys are per client, so other clients cannot decrypt each other's traffic.",
    lesson: '1.5-wireless-security',
  },
  {
    id: 'd1-105',
    topic: '1.5',
    type: 'order',
    difficulty: 2,
    stem: 'Put the steps in order for a laptop joining a WPA2-Enterprise SSID, from association until it requests an IP address.',
    items: [
      'The client associates with the AP on the WPA2-Enterprise SSID',
      'The authenticator sends an EAP-Request/Identity to the client',
      'EAP messages are relayed between the client and the RADIUS server, which checks the credentials',
      'The RADIUS server sends Access-Accept with keying material, so client and authenticator share a PMK',
      'The client and AP run the 4-way handshake to derive the session encryption keys',
      'The client broadcasts a DHCPDISCOVER to obtain an IP address',
    ],
    explanation: "The client first joins the BSS (probe, open system authentication, association). The authenticator (the AP, or the WLC for local-mode APs) then starts 802.1X by requesting the client's identity and relays EAP between the client and the RADIUS server. When the server accepts the credentials, it returns **Access-Accept** with keying material, so the client and authenticator hold the same PMK. The **4-way handshake** turns the PMK into session keys (PTK and GTK). Only then can the client send data such as DHCP.",
    lesson: '1.5-wireless-security',
  },

  // ---------------------------------------------------------------- 1.6
  {
    id: 'd1-106',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A user cannot open http://wiki.corp.example on a Windows PC. The wiki server moved to a new address last week, and other users reach it. What is the cause?',
    exhibit: `C:\\>ping -n 1 wiki.corp.example

Pinging wiki.corp.example [10.10.70.99] with 32 bytes of data:
Request timed out.

Ping statistics for 10.10.70.99:
    Packets: Sent = 1, Received = 0, Lost = 1 (100% loss),

C:\\>nslookup wiki.corp.example
Server:  dns1.corp.example
Address:  10.10.50.53

Name:    wiki.corp.example
Address:  10.10.70.25

C:\\>findstr /v "^#" C:\\Windows\\System32\\drivers\\etc\\hosts
10.10.70.99    wiki.corp.example`,
    options: [
      'A hosts-file entry maps the name to the old address; nslookup bypasses that file',
      'The local DNS cache holds a stale record; ipconfig /flushdns will fix the problem',
      'The DNS server dns1 still returns the old A record for the wiki server name',
      'The DNS suffix search list appends the wrong domain to the wiki server name',
    ],
    answer: [0],
    explanation: "ping and browsers use the Windows resolver, which checks the **hosts file** before DNS. The leftover line `10.10.70.99 wiki.corp.example` sends the PC to the old address. `nslookup` queries the DNS server directly and ignores the hosts file, so it shows the correct new address, 10.10.70.25. Remove or correct the hosts-file entry.\n\n* `ipconfig /flushdns` does not help: hosts-file entries are loaded back into the resolver cache, and DNS already returns the right address.\n* dns1 answers with the new address, 10.10.70.25.\n* The name is fully qualified, and ping resolved exactly wiki.corp.example; no suffix was appended.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-107',
    topic: '1.6',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. A Linux desktop has had no network access since it was moved to a new desk. What should be checked first?',
    exhibit: `$ ip link show enp3s0
2: enp3s0: <NO-CARRIER,BROADCAST,MULTICAST,UP> mtu 1500 qdisc fq_codel state DOWN mode DEFAULT group default qlen 1000
    link/ether 3c:7c:3f:1e:84:d2 brd ff:ff:ff:ff:ff:ff

$ sudo ethtool enp3s0 | grep -E 'Speed|Duplex|Link detected'
\tSpeed: Unknown!
\tDuplex: Unknown! (255)
\tLink detected: no

$ ip -4 addr show enp3s0
$`,
    options: [
      'The physical path: patch cable, wall-jack patching, and switch port status',
      'The interface admin state: run `ip link set enp3s0 up` to enable the NIC',
      'The DHCP lease: run `dhclient -r` and then `dhclient` to request a new address',
      'The DNS settings: the resolver configuration has lost its nameserver entries',
    ],
    answer: [0],
    explanation: "`NO-CARRIER` with `state DOWN`, plus ethtool's `Link detected: no`, means the NIC sees **no physical link**. The `UP` flag inside the brackets shows the interface is administratively enabled, so the OS side is ready. Work at Layer 1: check that the cable is seated and good, that the wall jack is patched to a switch port, and that the port is not shut down or err-disabled (`show interfaces status` on the switch).\n\n* The interface is already administratively up (the UP flag); `ip link set ... up` cannot create a carrier.\n* DHCP cannot work without a link; the missing IPv4 address is a symptom, not the cause.\n* DNS is irrelevant until the host has a link and an address.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-108',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A Linux laptop cannot join the BRANCH-STAFF SSID, which uses WPA2-Personal. What is the cause?',
    exhibit: `$ nmcli --ask device wifi connect BRANCH-STAFF
Password:
Error: Connection activation failed: Secrets were required, but not provided.

$ journalctl -u wpa_supplicant -n 4 --no-pager
Oct 24 09:41:05 lt-114 wpa_supplicant[812]: wlp2s0: SME: Trying to authenticate with 70:6d:15:a2:4c:3e (SSID='BRANCH-STAFF' freq=5180 MHz)
Oct 24 09:41:05 lt-114 wpa_supplicant[812]: wlp2s0: Associated with 70:6d:15:a2:4c:3e
Oct 24 09:41:06 lt-114 wpa_supplicant[812]: wlp2s0: WPA: 4-Way Handshake failed - pre-shared key may be incorrect
Oct 24 09:41:06 lt-114 wpa_supplicant[812]: wlp2s0: CTRL-EVENT-SSID-TEMP-DISABLED id=0 ssid="BRANCH-STAFF" auth_failures=1 duration=10 reason=WRONG_KEY`,
    options: [
      'The passphrase is wrong: the laptop associates, but the 4-way handshake fails',
      'The laptop is out of range of the AP, so 802.11 association with the BSSID fails',
      'The SSID requires 802.1X, so the laptop must be configured with an EAP method',
      'The DHCP server did not answer, so NetworkManager aborted the new connection',
    ],
    answer: [0],
    explanation: "The log shows the laptop **authenticated and associated** with the AP on 5180 MHz (channel 36), so RF and the SSID are fine. It then failed the **4-way handshake**, where the client proves it holds the same PMK derived from the passphrase: wpa_supplicant reports `pre-shared key may be incorrect` and `reason=WRONG_KEY`, and NetworkManager then abandons the activation with its secrets error. Enter the correct passphrase, and check whether the key was recently changed.\n\n* An out-of-range client would never reach `Associated with`.\n* An 802.1X SSID would show EAP exchanges; the log explicitly refers to a pre-shared key.\n* DHCP starts only after the handshake succeeds, and the connection never got that far.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-109',
    topic: '1.6',
    type: 'fill',
    difficulty: 2,
    stem: 'On macOS, which command displays the DHCP packet the Mac received for interface en0, including the lease time, server identifier, router, and DNS server options? Enter the full command.',
    answer: ['ipconfig getpacket en0', 'sudo ipconfig getpacket en0'],
    explanation: "`ipconfig getpacket en0` prints the last DHCP packet (the ACK) received on en0: the assigned address (yiaddr), `lease_time`, `server_identifier`, `router`, `domain_name_server`, and `subnet_mask`. macOS `ipconfig` is a different tool from the Windows command; `ipconfig getifaddr en0` prints only the address. Comparable views are `ipconfig /all` on Windows and `nmcli device show` on Linux.",
    lesson: '1.6-client-troubleshooting',
  },
  {
    id: 'd1-110',
    topic: '1.6',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. Several users report that their laptops connect to the CORP SSID (WPA2-Enterprise) but cannot reach anything. The WLC maps CORP clients to VLAN 40, whose gateway is an SVI on DSW1 and whose DHCP server is in the data center. Which two issues could cause this? (Choose two.)',
    exhibit: `C:\\>netsh wlan show interfaces | findstr /R "State SSID Authentication Signal"
    State                  : connected
    SSID                   : CORP
    AP BSSID               : 70:6d:15:a2:4c:31
    Authentication         : WPA2-Enterprise
    Signal                 : 94%

C:\\>ipconfig | findstr /C:"IPv4" /C:"Mask" /C:"Gateway"
   Autoconfiguration IPv4 Address. . : 169.254.201.14
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :`,
    options: [
      'The VLAN 40 SVI on DSW1 is missing its `ip helper-address` command',
      'The DHCP scope for the VLAN 40 subnet has no free addresses left',
      "The users' domain passwords are wrong, so the RADIUS server rejects them",
      'The laptops do not trust the certificate presented by the RADIUS server',
      'The signal is too weak for the DHCP messages to reach the access point',
      'The DHCP scope hands out the wrong DNS server address to the clients',
    ],
    answer: [0, 1],
    explanation: "`State: connected` on a WPA2-Enterprise SSID means 802.1X and the 4-way handshake succeeded, so the problem comes after association. A 169.254.x.x address with no gateway means **DHCP failed**. With a remote DHCP server, a missing relay (`ip helper-address` on the VLAN 40 SVI) stops the Discovers at the SVI, and an exhausted scope leaves the server nothing to offer. Either one produces APIPA addresses for several users.\n\n* Wrong passwords or an untrusted server certificate make 802.1X fail, so the laptops would never reach the connected state.\n* A 94% signal is strong.\n* A wrong DNS server breaks name resolution, but clients would still receive an address and a gateway.",
    lesson: '1.6-client-troubleshooting',
  },

  // ---------------------------------------------------------------- 1.7
  {
    id: 'd1-111',
    topic: '1.7',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Printer PRN-LAB (MAC 001b.783c.2e91) on R1 Gi0/0/1 should always receive 10.1.30.15 from the manual binding pool PRN-LAB. Instead it received 10.1.30.57 from the VLAN 30 pool. Which change makes the reservation work?',
    exhibit: `R1# show running-config | section ip dhcp pool PRN-LAB
ip dhcp pool PRN-LAB
 host 10.1.30.15 255.255.255.0
 hardware-address 001b.783c.2e91
 default-router 10.1.30.1

R1# show ip dhcp binding
Bindings from all pools not associated with VRF:
IP address      Client-ID/              Lease expiration        Type       State      Interface
                Hardware address/
                User name
10.1.30.57      0100.1b78.3c2e.91       Oct 25 2026 08:14 AM    Automatic  Active     GigabitEthernet0/0/1`,
    options: [
      'Replace hardware-address with `client-identifier 0100.1b78.3c2e.91` in the pool',
      'Add `network 10.1.30.0 255.255.255.0` to the PRN-LAB pool so that it can match',
      'Change the pool to `hardware-address 0100.1b78.3c2e.91` to include the media type',
      'Nothing; the binding changes to Manual by itself when the current lease expires',
    ],
    answer: [0],
    explanation: "The Client-ID column shows that the printer sends a DHCP **client identifier** (option 61): `01` (Ethernet) followed by its MAC, 0100.1b78.3c2e.91. IOS matches manual bindings for DHCP clients by **client identifier**; `hardware-address` is intended for clients that send no client identifier, such as BOOTP clients. Because nothing matched, the printer received an automatic lease. Configure `client-identifier 0100.1b78.3c2e.91` under PRN-LAB, clear the old binding with `clear ip dhcp binding 10.1.30.57`, and have the printer renew; the binding should then show Type **Manual**.\n\n* A manual binding pool is defined with `host`, not `network`.\n* `hardware-address` takes a MAC address; the 01 media-type prefix belongs only in a client identifier.\n* Waiting does not help: the binding still does not match, so the printer keeps getting automatic addresses.\n\n(Caveat: some clients send a different client-identifier format, or none at all; always copy the value shown in `show ip dhcp binding`.)",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-112',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Hosts on R1 Gi0/0/1 (10.1.50.0/24) receive 169.254.x.x addresses. R1 is supposed to be their DHCP server. What is the problem?',
    exhibit: `R1# show running-config | section dhcp
no service dhcp
ip dhcp excluded-address 10.1.50.1 10.1.50.10
ip dhcp pool VLAN50
 network 10.1.50.0 255.255.255.0
 default-router 10.1.50.1
 dns-server 10.1.99.53

R1# show ip interface brief | include 0/0/1
GigabitEthernet0/0/1   10.1.50.1       YES manual up                    up`,
    options: [
      'The DHCP service is disabled globally; enter `service dhcp` to enable it',
      'The excluded range contains the gateway; remove 10.1.50.1 from the range',
      'Gi0/0/1 needs `ip helper-address 10.1.50.1` for R1 to serve local clients',
      'The pool has no `lease` command, so R1 cannot grant any leases from it',
    ],
    answer: [0],
    explanation: "`no service dhcp` globally disables both the IOS **DHCP server and the DHCP relay agent**, so R1 ignores the clients' Discovers even though the pool is correct. Enter `service dhcp` (the default).\n\n* Excluding the gateway and other static addresses from the pool is correct practice.\n* A router serving its own directly connected subnet needs no helper address; the receiving interface's subnet selects the pool.\n* Without a `lease` command, the pool uses the default lease of one day.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-113',
    topic: '1.7',
    type: 'multi',
    difficulty: 2,
    stem: 'Interface Vlan10 on DSW1 is configured with `ip helper-address 10.1.99.10` and `ip helper-address 10.1.99.11`. Which two statements are true? (Choose two.)',
    options: [
      'DSW1 relays each client DHCPDISCOVER to both servers',
      "The client's DHCPREQUEST names the chosen server, so the other server can release its offered address",
      'DSW1 sends Discovers to the second server only when the first server stops answering',
      'DSW1 alternates between the two servers for successive clients in round-robin order',
      'Both servers must be configured with identical, overlapping address pools for the subnet',
      'ip helper-address relays only DHCP and never forwards any other UDP broadcast',
    ],
    answer: [0, 1],
    explanation: "With several helper addresses, the relay forwards each client broadcast to **every** listed server. Each server may send an Offer; the client picks one (usually the first) and broadcasts a DHCPREQUEST containing the chosen server's identifier (option 54). The relay forwards that Request to both servers, so the server that was not chosen sees it lost and returns its offered address to the pool.\n\n* There is no failover order and no round robin among helper addresses.\n* Two servers must not hand out the same addresses; they use non-overlapping (split) ranges of the subnet or a server-side failover mechanism.\n* By default `ip helper-address` also forwards several other UDP broadcasts (TFTP, DNS, Time, TACACS, and NetBIOS name and datagram services); `ip forward-protocol` controls the list.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-114',
    topic: '1.7',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Some users in VLAN 30 (10.1.30.0/24, gateway 10.1.30.1) intermittently receive 192.168.0.x addresses and cannot reach company resources. The capture was taken on a SPAN session of an affected Windows PC\'s switch port after the user ran `ipconfig /release` and `ipconfig /renew`. What is the cause, and what is the best long-term prevention?',
    exhibit: `No.  Time      Source        Destination      Protocol  Info
  1  0.000000  0.0.0.0       255.255.255.255  DHCP      DHCP Discover - Transaction ID 0x7b31c0de
  2  0.002114  192.168.0.1   255.255.255.255  DHCP      DHCP Offer    - Transaction ID 0x7b31c0de
  3  0.003027  0.0.0.0       255.255.255.255  DHCP      DHCP Request  - Transaction ID 0x7b31c0de
  4  0.004871  10.1.30.1     255.255.255.255  DHCP      DHCP Offer    - Transaction ID 0x7b31c0de
  5  0.005390  192.168.0.1   255.255.255.255  DHCP      DHCP ACK      - Transaction ID 0x7b31c0de`,
    options: [
      'A rogue DHCP server answers first; remove it and enable DHCP snooping on access switches',
      'The VLAN 30 pool is exhausted, so R1 hands out addresses from a backup 192.168.0.0 scope',
      'The relay forwards to two servers; remove the second ip helper-address from the VLAN 30 SVI',
      'The PC is reusing a cached lease from a home network; clear it with ipconfig /flushdns',
    ],
    answer: [0],
    explanation: "Two servers answer the same Discover (same transaction ID): **192.168.0.1** (frame 2) and the legitimate server through **10.1.30.1** (frame 4, the gateway acting as server or relay). The rogue answered first, the client requested its offer (frame 3), and the rogue acknowledged it (frame 5). Some device on the VLAN, typically a consumer router or a misconfigured VM, is running a DHCP server. Find it by tracing its MAC address through the MAC address tables and remove it. To prevent a repeat, enable **DHCP snooping** and trust only the uplinks toward the real server or relay, so access ports drop DHCP server messages.\n\n* R1 is clearly still offering addresses (frame 4), so the legitimate pool is not exhausted.\n* Offers relayed from a remote server reach the client from the relay's address (10.1.30.1). An Offer sourced from 192.168.0.1 on this segment comes from a local server.\n* The client sent a fresh Discover, so it was not reusing an old lease, and `/flushdns` clears DNS cache entries, not DHCP leases.",
    lesson: '1.7-dhcpv4',
  },
  {
    id: 'd1-115',
    topic: '1.7',
    type: 'match',
    difficulty: 2,
    stem: 'Match each DHCPv4 message to its purpose.',
    pairs: [
      ['DHCPDECLINE', 'Client tells the server that the assigned address is already in use on the subnet'],
      ['DHCPNAK', "Server refuses a client's request, such as an address from a subnet the client has left"],
      ['DHCPRELEASE', 'Client gives up its lease before the lease expires'],
      ['DHCPINFORM', 'Client that already has an address asks only for configuration options'],
      ['DHCPOFFER', 'Server proposes an address and options in reply to a Discover'],
    ],
    explanation: "* **DECLINE**: after the ACK, the client checks the address (for example with ARP); if another device answers, it declines and starts over.\n* **NAK**: the server rejects a Request it cannot honor, for example when a laptop moves to another subnet and asks to keep its old address. The client then restarts with a Discover.\n* **RELEASE**: sent (unicast) by the client, for example with `ipconfig /release`.\n* **INFORM**: used by hosts with a static address that still want options such as DNS servers.\n* **OFFER**: the second message of DORA.",
    lesson: '1.7-dhcpv4',
  },
];
