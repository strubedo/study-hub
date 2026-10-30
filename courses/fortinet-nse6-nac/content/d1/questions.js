// Domain 1 — Concepts and initial configuration question bank (original, exam-style).
// FortiNAC-F 7.6; facts checked 2026-10-30 on docs.fortinet.com (see lessons.js header).
export default [
  {
    id: 'd1-001',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator wants FortiNAC-F to switch access-port VLANs on Cisco-Access1, not just display it. Based on the exhibit, what must change?',
    exhibit: `Network > Inventory > HQ-Bldg-A > Add Device (Cisco-Access1)
  Add To Container    : HQ-Bldg-A
  IP Address          : 10.0.20.11
  SNMP                : SNMPv1
  Security String     : NACro
  CLI User Name       : nacview
  CLI Protocol Type   : SSH2
  Validate Credentials: SNMP OK, CLI OK

Cisco-Access1 (running-config excerpt)
  snmp-server community NACro RO
  username nacview privilege 7 secret 9 <hash>`,
    options: [
      'Model the switch with a read/write SNMP community and a CLI account with privilege level 15',
      'Change the device to SNMPv3, because FortiNAC-F cannot control devices modeled with SNMPv1',
      'Add Cisco-Access1 to the L3 (IP-->MAC) group so FortiNAC-F polls it for control',
      'Enable Use CDP so that FortiNAC-F learns the switch neighbours before it switches VLANs',
    ],
    answer: [0],
    explanation: "Read-only SNMP and a level-7 CLI account are enough to **model** and read a device, but devices FortiNAC-F will **control** need read/write SNMP and write-capable CLI credentials (a level 15 local account on Cisco). With SNMPv1, enter the read/write string. SNMPv1 is supported by Add Device, so moving to SNMPv3 is not required. The L3 (IP-->MAC) group is for ARP sources and has nothing to do with write access. CDP only helps Discovery find neighbours.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-002',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A Discovery started on the HQ-Campus container runs for hours and never completes. What is the most likely reason?',
    exhibit: `Discovery Settings (container HQ-Campus)
  Use CDP          : [ ] (cleared)
  IP Range         : 10.10.0.0 - 10.10.255.255
                     10.20.0.0 - 10.20.255.255
  SNMP Credentials : SNMPv1 security string  NACrw
                     SNMPv3  nacv3  AuthPriv  SHA1 / AES-128
  CLI Credentials  : nacadmin  SSH2`,
    options: [
      'The two ranges add up to about 131,000 addresses, more than the 65,000 that Fortinet says a discovery can reliably cover',
      'SNMPv1 strings and SNMPv3 credentials cannot be listed in the same discovery',
      'CLI credentials must be left empty during Discovery and added later in Model Configuration',
      'Discovery cannot run unless Use CDP is enabled',
    ],
    answer: [0],
    explanation: "Each /16 range holds 65,536 addresses, so the discovery covers about 131,000 addresses. The Administration Guide warns that the total across all ranges should not exceed **65,000** or discovery may not complete; split it into smaller ranges, or use CDP with starting addresses. SNMPv1 strings and SNMPv3 credentials can both be supplied on the SNMP Credentials tab, and the CLI Credentials tab is part of the same window. Use CDP is optional; with it enabled only a starting IP is needed.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-003',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'An administrator is preparing a Cisco access switch so that FortiNAC-F can model it and change the VLAN on its access ports. Which three items are requirements on the switch side? (Choose three.)',
    options: [
      'A read/write SNMP credential that FortiNAC-F uses',
      'A local CLI account with privilege level 15',
      'The switch answers ping from the FortiNAC-F port1 address',
      'A management address in the same subnet as FortiNAC-F port2',
      'SNMPv2c, because Add Device accepts neither SNMPv1 nor SNMPv3',
      'A RADIUS shared secret configured for FortiNAC-F',
    ],
    answer: [0, 1, 2],
    explanation: "The Network Device Modeling requirements for a device that FortiNAC-F will **control** are read/write SNMP, read/write CLI or API access (a **level 15** local account on Cisco) and the ability to answer **ping** from FortiNAC-F's management interface. Devices are managed from port1, not port2, and port2 belongs on the isolation side. Add Device takes SNMPv1 or SNMPv3. A RADIUS secret is needed only when the switch sends RADIUS to FortiNAC-F; VLAN switching through SNMP/CLI doesn't need it.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-004',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Unknown devices plugged into the lab bench on Cisco-Access1 Gi1/0/14 are never isolated, and the Ports view shows no hosts on that port. What explains this?',
    exhibit: `Network > Settings > Network Device
  System Defined Uplink Count : 20

Network > Inventory > HQ-Bldg-A > Cisco-Access1 > Ports
  Port       Label       Connection State
  Gi1/0/12   Desk-12     Connected
  Gi1/0/14   Lab-Bench   Threshold Uplink
  Gi1/0/48   To-Core     Learned Uplink

Cisco-Access1 MAC address table: 26 dynamic entries on Gi1/0/14
(unmanaged desktop switch, docking stations and test VMs)`,
    options: [
      'Gi1/0/14 carries more MAC addresses than the System Defined Uplink Count, so FortiNAC-F treats it as an uplink and neither enforces on it nor shows its hosts',
      'Hosts on the Default VLAN are never isolated, and Gi1/0/14 is in the Default VLAN',
      'L3 polling is disabled on Cisco-Access1, so FortiNAC-F cannot see MAC addresses on access ports',
      'Multi-access detection blocks enforcement on any port that has more than one MAC address',
    ],
    answer: [0],
    explanation: "When the number of MACs on a port exceeds the **System Defined Uplink Count** (default 20), FortiNAC-F changes the port to a **Threshold Uplink**. Uplink ports are not controlled and don't display endpoint connections. Fortinet recommends raising the count (to 2000) after initial discovery, clearing false Threshold Uplinks and marking real uplinks as Always Uplink. The Default VLAN is simply the production VLAN; isolation still applies there. MACs come from L2 polling (forwarding tables), not L3 polling. Multi-access detection raises Multi Access Point Detected events or alarms for ports outside the Authorized Access Points group; it does not turn every port with more than one MAC into an unmanaged port (the threshold is the uplink count, 20 by default).",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-005',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Hosts behind Cisco-Access1 appear with their MAC address and switch port, but never with an IP address. Cisco-Core1 (the routed SVIs for all user VLANs) is modeled in Inventory. What should the administrator do?',
    exhibit: `Network > L3 Polling
  Display: L3 (IP --> MAC) Devices        [Refresh]
  #   Name   IP address   Type   Status   L3 Polling   L3 Priority
  (no devices)

Adapter 00:09:0F:AA:10:21
  Location   : Cisco-Access1 Gi1/0/7
  IP Address : (blank)`,
    options: [
      'Add Cisco-Core1 to the L3 (IP-->MAC) group so that its ARP table is polled',
      'Reduce the L2 polling interval on Cisco-Access1 to 10 minutes',
      'Enable MAC notification traps on Cisco-Access1 access ports',
      'Add Cisco-Access1 to the Physical Address Filtering group',
    ],
    answer: [0],
    explanation: "IP addresses come from **L3 polling** of ARP tables, and only devices in the **L3 (IP-->MAC)** group are L3 polled. FortiNAC-F creates that group but never fills it automatically, which is why the L3 Polling view is empty. Adding the core (and any other ARP sources) enables L3 polling at 30 minutes, priority Low. Faster L2 polling and MAC notification traps improve MAC and port data, which is already present. Physical Address Filtering is for switches that take part in disabling hosts.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-006',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default L2 polling interval, in minutes, that FortiNAC-F applies to wireless devices?',
    answer: ['10', '10 minutes', '10 min', 'ten'],
    explanation: "Wireless devices are polled every **10 minutes** by default and wired devices every **60 minutes**. Wireless is polled more often because polling is how FortiNAC-F learns that a wireless client has disconnected.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-007',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Cisco-Access1 is modeled in FortiNAC-F and sends traps to FortiNAC-F port1 (10.0.50.10). According to Fortinet's MAC notification trap guidance, which change should the administrator make?",
    exhibit: `Cisco-Access1 (configuration commands applied by the switch team)
interface range GigabitEthernet1/0/1 - 46
 switchport mode access
 switchport access vlan 10
 snmp trap mac-notification change added
 snmp trap mac-notification change removed
!
mac address-table notification change
snmp-server enable traps snmp linkdown linkup coldstart warmstart
snmp-server enable traps mac-notification change move
snmp-server host 10.0.50.10 version 2c NACro`,
    options: [
      'Disable link up/link down traps on the access ports that send MAC notification traps (no snmp trap link-status)',
      'Also enable MAC notification traps on the uplinks Gi1/0/47 and Gi1/0/48',
      'Stop sending coldStart and warmStart traps, because they conflict with MAC notification',
      'Send the traps to the FortiNAC-F port2 address instead of port1',
    ],
    answer: [0],
    explanation: "Fortinet says that when MAC notification traps are enabled on a port, **link up/link down traps should be removed** from it: they are redundant, add traffic and prevent the MAC Learned events from being generated. Interface-level link-status traps (`snmp trap link-status`) are on by default on Cisco access ports, so they must be disabled explicitly (Fortinet's Catalyst 4500 example removes them globally with `no snmp-server enable traps snmp linkup` / `linkdown` instead). MAC notification traps should **not** be enabled on uplinks to other infrastructure. Cold and warm start traps are not affected by this change. Traps belong on port1, FortiNAC-F's trap receiver; port2 serves isolation networks.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-008',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Cisco-Access2 is modeled and L2 polling works, but its MAC notification traps never update the Ports view. What is the most likely cause?',
    exhibit: `FNAC-CA1 interfaces
  port1  10.0.50.10/24   allowaccess: https-adminui ssh snmp
  port2  10.0.60.10/24   Layer 3 isolation interface

Cisco-Access2 (modeled in Inventory as 10.0.21.11)
  snmp-server enable traps mac-notification change move
  snmp-server host 10.0.60.10 version 2c NACro mac-notification`,
    options: [
      'The traps are sent to the port2 address; FortiNAC-F receives SNMP traps on port1',
      'port1 is missing the snmp allowaccess option',
      'A switch modeled with SNMPv1 must also send its traps with SNMPv1',
      'FortiNAC-F only processes MAC notification traps sent with SNMPv3',
    ],
    answer: [0],
    explanation: "port1 is the management interface and the **SNMP trap receiver**; port2 provides DHCP, DNS and captive portal to isolation networks. The switch must send traps to the port1 address (10.0.50.10), and the exhibit shows port1 already allows `snmp`. Fortinet's guide notes that the trap version is independent of the version used to model the switch, and MAC notification traps are supported with SNMP v1, v2 and v3. Also make sure an L3 switch sources traps from the address it was modeled with.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-009',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiNAC-F system group to its purpose.',
    pairs: [
      ['L2 Wired Devices', 'Filled automatically as wired L2 devices are discovered'],
      ['L3 (IP-->MAC)', 'Filled manually with devices whose ARP tables are polled'],
      ['Physical Address Filtering', 'Switches that take part when FortiNAC-F disables a host'],
      ['Authorized Access Points', 'Ports where hubs or APs do not raise Multi-Access Point Detected events'],
      ['Forced Registration', 'Ports switched to the Registration VLAN when an unregistered host connects'],
      ['All Management', 'Administrators with all management rights; default alarm e-mail recipients'],
    ],
    explanation: "L2 Wired Devices (and L2 Wireless Devices) are populated during discovery. L3 (IP-->MAC) is created empty and must be filled with ARP sources. Physical Address Filtering lists switches that participate in host disabling; a disabled host on a switch outside it stays connected. Authorized Access Points exempts ports with hubs or APs from multi-access alarms and forced-registration VLAN switching. Forced Registration ports move unregistered hosts to the Registration VLAN. All Management starts with admin and root, gets every new administrator, and is the default group for alarm e-mails.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-010',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'The host groups Finance Hosts, HR Hosts and Legal Hosts must all be disabled every night by a single scheduled task, while each group can still be targeted on its own. What is the best approach?',
    options: [
      'Create a parent host group, add the three groups to it as sub-groups, and schedule the task against the parent',
      'Move the hosts into one Inventory container and schedule the task against the container',
      'Create one ports group containing every port where those hosts connect and disable the ports instead',
      'Create an administrator group that manages the three host groups and schedule the task against it',
    ],
    answer: [0],
    explanation: "Groups can contain other groups **of the same type**, and a parent group's membership includes its sub-groups' members. Fortinet's own example nests host groups so one scheduled task (Disable Hosts with a Fixed Day Task) can act on all of them, while each sub-group stays usable alone. Containers organize network devices in Inventory, not hosts, and cannot be nested. Disabling ports affects everything plugged into them, not just these hosts. An administrator group with Manages scopes admin rights; it is not a task target for the hosts.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-011',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: 'During a clean-up, an administrator deletes the Inventory container Bldg-C, which still holds three modeled switches. What happens to the switches?',
    options: [
      'They are deleted from FortiNAC-F together with the container',
      'They move to the top level of the Inventory tree',
      'The delete is refused until the container is empty',
      'They move to the system default container',
    ],
    answer: [0],
    explanation: "Deleting a container **deletes the devices it contains**, so Fortinet tells administrators to move devices (right-click > Move To Container) before deleting a container. There is no automatic move to another container and no refusal.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-012',
    topic: '1.1',
    type: 'order',
    difficulty: 2,
    stem: 'Put the Network Device Modeling procedure in the order Fortinet recommends.',
    items: [
      'Create containers for the logical grouping of devices',
      'Add the infrastructure devices to Inventory (Add Device or Discovery)',
      'Add ARP sources to the L3 (IP-->MAC) group',
      'Validate port data such as label, connection state and VLAN',
      'Review the ports that FortiNAC-F marked as Threshold Uplinks',
      'Raise the System Defined Uplink Count and clear false Threshold Uplinks',
    ],
    explanation: "The Network Device Modeling guide runs: Step 1 create containers, Step 2 add infrastructure devices, Step 3 configure Layer 3 sources (L3 group), Step 4 validate, Step 5 review uplinks, Step 6 modify the System Defined Uplink Count (from 20 to 2000, then clear and re-poll). Step 7, extra maintenance tasks, applies only to wireless devices.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-013',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A registered laptop on Cisco-Access1 fails its endpoint compliance scan and is marked at risk. FortiNAC-F enforces on this switch by VLAN switching. Which VLAN does FortiNAC-F assign to the laptop\'s port?',
    exhibit: `Network > Inventory > Cisco-Access1 > Model Configuration
VLAN ID/Network Access
  VLAN Display Format : VLAN ID
  Default             : 10
  Dead End            : 120
  Registration        : 100
  Quarantine          : 110
  Authentication      : (blank)
  Voice               : 30`,
    options: ['110', '120', '100', '10'],
    answer: [0],
    explanation: "Hosts that fail a compliance scan are in the remediation (at risk) state, and the Model Configuration field for that state is **Quarantine**, here VLAN **110**. Dead End (120) is for disabled hosts, Registration (100) for unregistered hosts, and Default (10) is production. The naming differs between views: the Config Wizard calls the same purpose a Remediation scope.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-014',
    topic: '1.1',
    type: 'multi',
    difficulty: 1,
    stem: 'Which two statements about the FortiNAC-F architecture are true? (Choose two.)',
    options: [
      'It runs on FortiNAC-OS and is managed through a FortiOS-style CLI and the Admin UI',
      'port2 provides DHCP, DNS and captive portal services to isolation networks',
      'It must be placed inline between the access and core layers so that all user traffic passes through it',
      'Each site needs a separate Control Server VM and Application Server VM',
      'port1 and port2 should be placed in the same subnet to simplify routing',
    ],
    answer: [0, 1],
    explanation: "FortiNAC-F runs **FortiNAC-OS** with a FortiOS-style CLI, and **port2** is the service interface for isolation (DHCP, DNS, captive portal). FortiNAC-F is not an inline device: it enforces through switches, controllers and firewalls rather than having all user traffic pass through it. Separate Control and Application VMs (`FNC-C-VM` + `FNC-A-VM`) are the legacy CentOS design; FortiNAC-F uses one CA appliance (`FNC-CAX`). Fortinet states that port1 and port2 in the same network is not recommended or supported.",
    lesson: '1.1-architecture-features',
  },
  {
    id: 'd1-015',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FNAC-CA1 was licensed with a 2,000-endpoint Pro subscription registered in FortiCloud. Hosts register normally, but a junior administrator is alarmed by the License Management view. Which statement is correct?',
    exhibit: `System > Settings > System Management > License Management
  Server               : FNAC-CA1
  License Name         : FortiNAC Base
  Concurrent Licenses  : 0`,
    options: [
      'This is expected: subscription entitlements are retrieved from FortiCloud and cached, not stored in the key, so this view does not show them',
      'The subscription must be downloaded from FortiCloud and installed with Modify License Key before it applies',
      'FortiNAC-F polls FortiCloud only at boot, so the CA must be rebooted to pick up the subscription',
      'The CA is running unlicensed and will block all new registrations until a perpetual key is installed',
    ],
    answer: [0],
    explanation: "With a **subscription**, FortiNAC-F pulls entitlements from **FortiCloud over TCP 443** at first startup, caches them in the database and polls again **every 12 hours**. Because they are not in the licence key file, License Management shows **License Name = FortiNAC Base** and **Concurrent Licenses = 0**; the License Information dashboard widget shows the real entitlements. Modify License Key is for perpetual key files. Polling is periodic, not only at boot. Hosts are registering, so the system is not blocking registrations.",
    lesson: '1.1-architecture-features',
  },
  {
    id: 'd1-016',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'On FortiNAC-F 7.6.7, an administrator must add a network device that FortiNAC-F will handle only through RADIUS. The device offers no SNMP or CLI access to FortiNAC-F. How should it be added?',
    options: [
      'Right-click a container, choose Add Device, enter the IP address and, optionally, a RADIUS secret, without SNMP settings',
      'Start a Discovery on the container with the RADIUS secret on the SNMP Credentials tab',
      'Add it with Add Pingable Device and set the SSO Agent field to RADIUS',
      'It cannot be added; FortiNAC-F only accepts RADIUS from devices modeled with SNMP',
    ],
    answer: [0],
    explanation: "FortiNAC-F **7.6.7** added a RADIUS-only option to **Add Device**: enter the IP address and optionally a RADIUS secret; no SNMP or CLI credentials are required. Discovery is SNMP based and the docs state it does not support adding RADIUS-only devices. The SSO Agent setting on a pingable device is for single sign-on integrations, not for modeling an access device. Before 7.6.7, devices were modeled with SNMP, which is why the last option describes older releases, not 7.6.7.",
    lesson: '1.1-modeling-discovery',
  },
  {
    id: 'd1-017',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiNAC-F information source to what it provides.',
    pairs: [
      ['L2 polling', 'Reads the switch MAC address table: host MAC, switch and port'],
      ['L3 polling', 'Reads ARP tables to map host MAC addresses to IP addresses'],
      ['Link up trap', 'Prompts FortiNAC-F to read the forwarding table of that switch after a delay'],
      ['MAC notification trap', 'Carries the host MAC and port inside the trap, so no table read is needed'],
      ['Contact status ping', 'Decides whether a device icon turns red in the Inventory tree'],
    ],
    explanation: "L2 polling reads MAC tables, L3 polling reads ARP tables (only for devices in the L3 (IP-->MAC) group). A link up trap triggers a forwarding-table read after Minimum Trap Period x Max Number of Trap Periods (40 s by default). MAC notification traps embed the MAC and port, so FortiNAC-F doesn't have to read tables each time. Separately, FortiNAC-F pings modeled devices; a device that stops answering is shown with a red box in Inventory.",
    lesson: '1.1-visibility-groups',
  },
  {
    id: 'd1-018',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FNAC-CA1 uses the Layer 3 network type. Unregistered hosts are placed in VLAN 100 but never receive an IP address. What fixes the problem?',
    exhibit: `Config Wizard summary (FNAC-CA1) - Network Type: Layer 3
  port2 Gateway            : 10.0.60.1     Mask: 255.255.255.0
  Registration interface   : 10.0.60.11
  Remediation interface    : 10.0.60.12
  Dead End interface       : 10.0.60.13
  Scope Bldg-A-Reg         : Gateway 10.100.0.1  Mask 255.255.255.0
                             Lease Pool 10.100.0.20 - 10.100.0.250

Cisco-Core1 (running-config excerpt)
interface Vlan100
 description Registration
 ip address 10.100.0.1 255.255.255.0`,
    options: [
      'Add ip helper-address 10.0.60.11 to interface Vlan100 so DHCP is relayed to the port2 registration interface',
      'Trunk VLAN 100 to FortiNAC-F port2 with an 802.1Q tag',
      'Change the Bldg-A-Reg scope gateway to 10.0.60.1',
      'Add ip helper-address 10.0.50.10 (port1) to interface Vlan100',
    ],
    answer: [0],
    explanation: "In a **Layer 3** design port2 sits on one untagged VLAN and the isolation subnets are routed to it, so **each isolation network needs a DHCP relay pointing back to the port2 isolation interface**; here, the registration interface 10.0.60.11. Trunking VLAN 100 to port2 is the Layer 2 design and doesn't match this configuration. The scope gateway must be the client subnet's gateway (10.100.0.1), not the port2 gateway. port1 is the management interface; isolation DHCP is served from port2.",
    lesson: '1.2-config-wizard-isolation',
  },
  {
    id: 'd1-019',
    topic: '1.2',
    type: 'single',
    difficulty: 1,
    stem: 'In Config Wizard Step 2: Select Network Type, an administrator chooses None. What is the result?',
    options: [
      'No isolation networks are configured and the captive portal service is disabled',
      'port2 is configured automatically as an 802.1Q trunk with default isolation VLANs',
      'Isolation DHCP and DNS move to port1 so that port2 can be left unconnected',
      'The wizard cannot be applied until at least one DHCP scope exists',
    ],
    answer: [0],
    explanation: "**None** means *don't configure isolation networks*, and the wizard notes that the **captive portal service is disabled**. Fortinet's hardware staging procedure uses None at first and configures the network type later. Nothing is built automatically, isolation services never move to port1, and the requirement for at least one scope applies to the Layer 2 and Layer 3 types, not to None.",
    lesson: '1.2-config-wizard-isolation',
  },
  {
    id: 'd1-020',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements describe the Layer 2 network type in the Config Wizard? (Choose two.)',
    options: [
      'port2 connects to an 802.1Q trunk that carries the isolation VLANs',
      'port2 needs an IP address in each isolation subnet, configured with that VLAN\'s ID',
      'Each isolation VLAN needs a DHCP relay that points to port2',
      'It is the type required when the HA primary and secondary are on different networks',
      'port2 sits on a single VLAN on an untagged switch port',
    ],
    answer: [0, 1],
    explanation: "With **Layer 2**, isolation VLAN traffic is switched to port2 with **802.1Q** tags, and port2 has an **address in each isolation network** (the wizard asks for Interface IPv4 Address, Mask, Gateway and **VLAN ID** per VLAN). It shares the hosts' broadcast domain, so DHCP relays are not needed. DHCP relays, a single untagged port2 VLAN, and being required for HA peers on different networks all describe **Layer 3**.",
    lesson: '1.2-config-wizard-isolation',
  },
  {
    id: 'd1-021',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator is adding Layer 3 DHCP scopes in the Config Wizard. The production domain is corp.example.com. Which scope breaks a Config Wizard rule?',
    exhibit: `Config Wizard > Layer 3 Network > Scopes (proposed)
  Label             Gateway       Mask            Domain
  Bldg-A-Reg        10.100.0.1    255.255.255.0   reg.example.net
  REG_Bldg-B        10.101.0.1    255.255.255.0   reg.example.net
  Bldg-A-Remed      10.110.0.1    255.255.255.0   remed.example.net
  Lobby-Isolation   10.130.0.1    255.255.255.0   iso.example.net`,
    options: ['REG_Bldg-B', 'Bldg-A-Reg', 'Bldg-A-Remed', 'Lobby-Isolation'],
    answer: [0],
    explanation: "Layer 3 scope labels must not **start** with a reserved prefix: `REG_`, `REM_`, `AUTH_`, `DE_`, `ISOL_` or `VPN_` (the Configure scopes page also lists `HUB_`). `REG_Bldg-B` does. The other labels only contain words such as Reg or Isolation, which is allowed. All gateways are the client subnets' own gateways, and none of the domains reuses the production domain, which the wizard advises against.",
    lesson: '1.2-config-wizard-isolation',
  },
  {
    id: 'd1-022',
    topic: '1.2',
    type: 'fill',
    difficulty: 1,
    stem: 'A new FortiNAC-F CA has port1 address 10.0.50.10. Which TCP port completes the Admin UI URL https://10.0.50.10:____/ ?',
    answer: ['8443'],
    explanation: "The Admin UI listens on **HTTPS TCP 8443** (allowaccess option `https-adminui`). The first login on a new appliance is `root` / `YAMS`. TCP 443 is the captive portal (`https`), and TCP 8080 is the optional HTTP Admin UI (`http-adminui`).",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-023',
    topic: '1.2',
    type: 'order',
    difficulty: 2,
    stem: 'Put the first-time staging of a new FortiNAC-F hardware appliance in order.',
    items: [
      'Give the management PC 192.168.1.1/24 and cable it to port1',
      'SSH to 192.168.1.99 and log in to the CLI as admin with no password',
      'Allow https-adminui and ssh on port1 under config system interface',
      'Browse to https://192.168.1.99:8443 and log in as root with password YAMS',
      'Create the first Admin UI user ID and password',
      'Apply the Config Wizard settings, reboot and connect port1 to the network',
    ],
    explanation: "The Appliance Installation guide: set the PC to 192.168.1.1/24 on port1, SSH to the default 192.168.1.99 as `admin` with a blank password (record the MAC with `get hardware status` and the serial with `get system status`), enable `https-adminui ssh` on port1, open `https://192.168.1.99:8443` as `root` / `YAMS`, accept the EULA, create your own Admin UI user, choose the installation method, complete the Config Wizard, Apply, reboot and move port1 to the production network.",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-024',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After this change, the Admin UI on port 8443 still works, but new SSH connections to FNAC-CA1 port1 are refused. Why?',
    exhibit: `(SSH session to FNAC-CA1 port1 as admin)
config system interface
edit port1
set allowaccess https-adminui
next
end`,
    options: [
      'set allowaccess replaced the whole list, so ssh is no longer allowed; it should have been set allowaccess https-adminui ssh or append allowaccess https-adminui',
      'The change was never saved because next was used before end',
      'SSH access is controlled on port2, and port2 has no allowaccess list',
      'The CLI admin password expires whenever interface settings change',
    ],
    answer: [0],
    explanation: "`set allowaccess` defines the **complete** list of services for the interface, so this command left only `https-adminui`. `append allowaccess` adds services, and `unselect allowaccess` removes them. `next` stages the entry and `end` saves, so the change was applied. SSH (`ssh`, TCP 22) is a management service on port1. Interface changes don't expire passwords.",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-025',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Administrator jlee should only manage clinic hosts and ports, but can modify any host in FortiNAC-F. What is the cause?',
    exhibit: `Users & Hosts > Administrators > jlee
  Auth Type     : Local
  Admin Profile : Clinic-Ops

Profile Clinic-Ops (General tab)
  Manage Hosts And Ports : Restrict By Groups

System > Groups > Clinic Admins (Administrator)
  Members : jlee
  Manages : Clinic Hosts, Clinic Ports

jlee > Group Membership (Administrator)
  [x] Clinic Admins
  [x] All Management`,
    options: [
      'jlee is still a member of the All Management group',
      'Restrict By Groups only works for administrators that authenticate with LDAP',
      'The Manages setting must be applied to jlee directly, not to an administrator group',
      'Clinic Hosts and Clinic Ports must be nested in one group before Manages can use them',
    ],
    answer: [0],
    explanation: "Restricting an admin needs a profile with **Manage Hosts And Ports = Restrict By Groups**, an **administrator group** that **Manages** the host and port groups, and **removing the admins from All Management**. All Management gives access to all hosts and ports, and new administrators are added to it automatically. The restriction works for any authentication type, Manages is set on administrator groups, and the managed groups don't need to be nested.",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-026',
    topic: '1.2',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator creates the Admin UI administrator netops in Users & Hosts > Administrators and then tries to SSH to the FortiNAC-F CLI with the same credentials. The login fails. Why?',
    options: [
      'CLI accounts are separate from Admin UI administrators; CLI users are managed with config system admin and are not listed in the UI',
      'The netops account needs the System Administrator profile before it can use SSH',
      'SSH logins require RADIUS authentication for Admin UI accounts',
      'Admin UI administrators can use SSH only after they are added to the All Management group',
    ],
    answer: [0],
    explanation: "The Administration Guide states that admin user accounts for appliance **CLI access are independent** of the Administrator users for UI access, and CLI users are not listed in the UI. CLI users are configured under `config system admin` (for example `edit admin`, `set password`). No profile, authentication type or group membership (All Management included) turns a GUI administrator into a CLI user.",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-027',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about the default System Administrator administrator profile are true? (Choose two.)',
    options: [
      'It cannot be deleted or copied',
      'Administrators assigned to it cannot be aged out of the database',
      'Its Delete permissions can be removed to create a safer full-access profile',
      'It is the profile used by the FortiNAC-OS CLI admin account',
      'Edits to it apply immediately to administrators who are already logged in',
    ],
    answer: [0, 1],
    explanation: "The System Administrator profile **cannot be deleted or copied**; only its Inactivity Time can be changed, so its permissions can't be trimmed. Administrators with this profile **cannot be aged out**. CLI accounts are separate from Admin UI profiles. Changes to an administrator profile take effect only when its administrators log out and log back in.",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-028',
    topic: '1.2',
    type: 'fill',
    difficulty: 2,
    stem: 'From the FortiNAC-OS base context, which command enters the context where you run edit admin and set password to change a CLI account password?',
    answer: ['config system admin', 'config sys admin'],
    explanation: "`config system admin` opens the admin context; then `edit admin`, `set password <password>` and `end`. The Passwords page abbreviates it as `config sys admin`. Admin UI passwords are changed in Users & Hosts > Administrators instead.",
    lesson: '1.2-initial-setup-admins',
  },
  {
    id: 'd1-029',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Most unregistered laptops in VLAN 100 see the registration page, but a few never do and can resolve internet names. Which change follows Fortinet\'s isolation design guidance?',
    exhibit: `Registration VLAN 100 (Layer 3 isolation, FortiNAC-F DHCP via relay)
Rogue laptop 00:09:0F:AA:20:05
  Lease from FortiNAC-F : 10.100.0.37/24, DNS server = FortiNAC-F port2
  Laptop DNS setting    : static 8.8.8.8 (configured by the user)

(ISOLATION-IN is applied inbound on interface Vlan100)
Cisco-Core1# show ip access-lists ISOLATION-IN
Extended IP access list ISOLATION-IN
    5 permit udp any any eq bootps
    10 permit udp 10.100.0.0 0.0.0.255 any eq domain
    20 permit tcp 10.100.0.0 0.0.0.255 any eq domain
    30 permit ip 10.100.0.0 0.0.0.255 host 10.0.60.11
    40 deny ip any any`,
    options: [
      'Permit DNS from the isolation VLAN only to the FortiNAC-F port2 address and block it to every other destination',
      'Change the network type to Layer 2 so that DNS answers come from the same broadcast domain',
      'Add 8.8.8.8/32 under Isolation IP Subnets',
      'Set Forwarding DNS for all Isolation Networks to Specify 8.8.8.8',
    ],
    answer: [0],
    explanation: "Fortinet's isolation VLAN guidance is to **block outbound DNS except to port2**, so a host with a hard-coded resolver can't bypass FortiNAC-F's DNS and its portal redirection. ACL lines 10 and 20 let any resolver through; line 5 is needed so DHCP requests reach the relay, and line 30 already allows DNS, DHCP and portal traffic to port2. Moving to Layer 2 doesn't stop a static resolver. Isolation IP Subnets lists **client subnets** that FortiNAC-F should answer DNS for, not upstream servers. Forwarding DNS sets where FortiNAC-F forwards the lookups it allows; it doesn't control hosts that never ask FortiNAC-F.",
    lesson: '1.2-config-wizard-isolation',
  },
  {
    id: 'd1-030',
    topic: '1.2',
    type: 'match',
    difficulty: 1,
    stem: 'Match each isolation scope type to the hosts it serves.',
    pairs: [
      ['Registration', 'Unknown hosts that are not yet registered'],
      ['Remediation', 'Hosts marked at risk after failing a compliance scan'],
      ['Dead End', 'Disabled hosts with little or no connectivity'],
      ['Authentication', 'Registered hosts until the user authenticates'],
      ['VPN', 'Unknown or untrusted hosts connecting through a managed VPN'],
      ['Isolation', 'Every restricted state in one network; the host state picks the page'],
    ],
    explanation: "These are the Config Wizard scope (Layer 3) or VLAN (Layer 2) types. A single **Isolation** scope can replace the others, because the host's state decides which portal page it gets. In Model Configuration the Remediation purpose appears as the **Quarantine** VLAN field.",
    lesson: '1.2-config-wizard-isolation',
  },
];
