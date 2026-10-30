// Domain 2 questions, part B: topics 2.3 and 2.4 (FortiNAC-F 7.6). Original items. Imported by questions.js.
export default [
  {
    id: 'd2-035', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit from the secondary server (FNAC-CA2) of a 1+1 pair running F 7.6.2, not managed by FortiNAC-M. What does FNAC-CA2 do next?',
    exhibit: `FNAC-CA2 # diagnose tail -F output.processManager
sendPacket() 10.0.1.21 verb Ping retval = Running - In Control
sendPacket() 10.0.1.21 verb Ping retval = null
**** Failed to talk to Primary **** PingRetryCnt = 1 pingRetries = 5
**** Failed to talk to Primary **** PingRetryCnt = 2 pingRetries = 5
**** Failed to talk to Primary **** PingRetryCnt = 3 pingRetries = 5
**** Failed to talk to Primary **** PingRetryCnt = 4 pingRetries = 5
**** Failed to talk to Primary **** PingRetryCnt = 5 pingRetries = 5
**** Failed to talk to Primary **** PingRetryCnt exceeded!`,
    options: ['It pings its configured gateway IP; if the gateway answers it takes control, otherwise it does not', 'It takes control immediately because the retry count was exceeded', 'It restarts the primary\'s management process over SSH', 'It waits for an administrator to click Resume Control'],
    answer: [0],
    explanation: 'After the retries are exhausted the secondary pings the **Secondary Appliance Gateway IP Address**. Reachable gateway → the primary is assumed isolated and the secondary takes control (after a 10-minute wait if its own management process has run for under 10 minutes). Unreachable → the secondary assumes it is isolated and stays passive. Resume Control is for returning control to the primary.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-036', topic: '2.3', type: 'multi', difficulty: 2,
    stem: 'Which three services are required services on a FortiNAC-F CA in 1+1 HA, whose failure can trigger a failover? (Choose three.)',
    options: ['mysql', 'httpd', 'named', 'snmpd', 'ntpd', 'radiusd'],
    answer: [0, 1, 2],
    explanation: 'For a FortiNAC Server (CA) the required services are **mysql, SSHd, dhcpd** (when port2 has an IP), **httpd** and **named**. The Manager only requires mysql and SSHd. snmpd, ntpd and radiusd are not in the list.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-037', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit from the primary server. What happens after the last line?',
    exhibit: `dhcpd is not running!
Restarting dhcpd (retries = 0)
dhcpd is not running!
Restarting dhcpd (retries = 1)
dhcpd is not running!
Restarting dhcpd (retries = 2)
dhcpd is not running!
Restarting dhcpd (retries = 3)
dhcpd is not running!`,
    options: ['The system check fails and the primary changes status to Secondary In Control, forcing a failover', 'The primary reboots itself and tries dhcpd again', 'The secondary starts dhcpd only, while the primary keeps the other loaders', 'Nothing; dhcpd is optional on a CA'],
    answer: [0],
    explanation: 'The primary retries a failed required service every 30 seconds; after the fourth failed restart it logs System Check Failed, changes status to **Secondary In Control** and sends a force failover. Failover moves all loaders, not one service. dhcpd is required when port2 has an IP.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-038', topic: '2.3', type: 'single', difficulty: 1,
    stem: 'Refer to the exhibit. After a failover in a 1+1 pair, the primary is repaired and back online. How does it regain control?',
    exhibit: `Dashboard > System Summary
Primary Server   FNAC-CA1  Running - Not In Control
Secondary Server FNAC-CA2  Running - In Control
[Resume Control]`,
    options: ['An administrator clicks Resume Control in the Dashboard System Summary widget', 'Automatically, as soon as the secondary detects the primary', 'Automatically after the next database replication', 'By running execute ha failover on the repaired primary only'],
    answer: [0],
    explanation: 'The primary **never** resumes control automatically. Use the **Resume Control** button in System Summary (grayed out until a failover has occurred). The primary restarts, data is copied from the secondary, and the secondary relinquishes control.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-039', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'An administrator must restart the FortiNAC-F processes on the primary for maintenance without causing a failover. Which approach is correct?',
    options: ['Gracefully stop the loaders in the shell (which sets the secondary to Idle), then start them again', 'Stop only the management process without stopping the loaders first, then start it again', 'Force a failover with execute ha failover, then reboot the primary', 'Halt the appliance and power it back on'],
    answer: [0],
    explanation: 'In the shell, the graceful stop (`shutdownNAC` in the 7.6 HA guide) stops the loaders and sets the secondary to **Idle**, so it will not take control; `startupNAC` restarts them. Stopping the management process first (`shutdownNAC -kill`) on the primary **causes a failover**. `execute ha failover` forces one. A halt is a clean shutdown that idles the control process, not a maintenance restart.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-040', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'An administrator wants to test 1+1 failover by running poweroff on the primary. Why is this not a valid test?',
    options: ['A clean shutdown idles the control process, so the secondary does not take control', 'poweroff also shuts down the secondary', 'poweroff triggers an immediate failover that bypasses database replication', 'poweroff resets the HA configuration'],
    answer: [0],
    explanation: 'The HA guide notes that `halt` or `poweroff` cause a clean shutdown that **idles** the control process; the secondary will not take control. Use the failover command or disconnect port1 to simulate a failure.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-041', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'For a 1+1 pair, approximately how long does failure detection plus failover take on F 7.6.3 and later?',
    options: ['About 1–5 minutes', 'About 10–15 minutes', 'About 2 seconds', 'About 30 seconds'],
    answer: [0],
    explanation: 'The HA guide gives **about 1–5 minutes** from F 7.6.3, compared with about 10–15 minutes before. The failover step alone is about 2 seconds (4 s if managed by FortiNAC-M); detection dominates. 30 seconds is the poll interval.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-042', topic: '2.3', type: 'multi', difficulty: 2,
    stem: 'An HA pair will be built as Layer 3 HA across two data centres. Which two statements are true? (Choose two.)',
    options: ['Both appliances must use the Layer 3 network type in the Configuration Wizard', 'Isolation VLANs need DHCP helpers pointing to both the primary and secondary port2 addresses', 'A shared IP (VIP) is required for GUI access', 'Network devices should send SNMP traps to the shared IP only', 'The secondary port2 must use the same isolation IP addresses as the primary'],
    answer: [0, 1],
    explanation: 'L3 HA requires the **Layer 3** network type and uses **no shared IP**. Each appliance has its own port2 subnet, so isolation VLANs need **two DHCP helpers** and hosts receive two DNS servers. Traps always go to both port1 addresses. Identical isolation IPs on both port2s is the L2 design.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-043', topic: '2.3', type: 'order', difficulty: 3,
    stem: 'Put the FortiNAC-OS 1+1 HA configuration steps in order.',
    items: ['Back up the primary database', 'Exchange SSH public keys with config system ha / set public-key add on each appliance', 'Confirm port1 allowaccess includes ping, ssh and nac-ipc', 'Add both serial numbers to the allowed serial numbers list on the primary', 'Reboot both appliances', 'Configure System > Settings > System Management > High Availability on the primary and apply'],
    explanation: 'This is the order in the HA (FortiNAC-OS) guide: back up, exchange keys, allow inter-appliance access over port1, register the allowed serial numbers, reboot, then configure the HA page on the primary.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-044', topic: '2.3', type: 'fill', difficulty: 2,
    stem: 'Which port1 allowaccess keyword enables FortiNAC-F inter-appliance communication used by HA? (one word)',
    answer: ['nac-ipc'],
    explanation: '**nac-ipc** (TCP 1050, 5555, 9443, 18090 and 30000–64000) must be allowed on port1 of both appliances, together with ping and ssh.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-045', topic: '2.3', type: 'single', difficulty: 3,
    stem: 'Refer to the exhibit. Both FortiNAC-F CAs in a 1+1 pair are running F 7.6.3, managed by FNAC-M. The link between the two data centres fails; both gateways stay reachable, and FNAC-M can still reach the primary. What happens?',
    exhibit: `Primary   FNAC-CA1  10.0.1.21  gateway 10.0.1.1   (reachable)
Secondary FNAC-CA2  10.50.1.21 gateway 10.50.1.1  (reachable)
FNAC-M    10.0.5.10  -> FNAC-CA1 reachable, FNAC-CA2 reachable
Link FNAC-CA1 <-> FNAC-CA2: down`,
    options: ['The primary stays in control and the secondary does not promote itself', 'Both appliances run their loaders until the link returns', 'The primary shuts down and the secondary takes control', 'The secondary takes control and FNAC-M then shuts down the primary'],
    answer: [0],
    explanation: 'From F 7.6.3, after the gateway test the secondary asks FortiNAC-M about the primary. If FortiNAC-M can reach the primary, the secondary does **not** promote itself: split-brain prevention. Without the Manager, scenario 1 would leave both running.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-046', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'Which statement about the F 7.6.7 CA Clustering Failover Health Check Mechanism ("True Hot Standby") is correct?',
    options: ['It checks five layers (infrastructure, database, cache, services and custom components) and feeds both 1+1 and N+1 failover', 'It replaces 1+1 HA with N+1 failover groups', 'It only monitors custom ICMP checks configured on FortiNAC-M', 'It requires a FortiADC to evaluate health'],
    answer: [0],
    explanation: 'F 7.6.7 adds a five-layer health check (L1 to L5: infrastructure, database, cache, services and custom components) with configurable intervals and thresholds, integrated with **both 1+1 and N+1** failover. It does not replace either model or need a load balancer.',
    lesson: '2.3-ha-1plus1',
  },
  {
    id: 'd2-047', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'In an N+1 failover group, which component performs the health checks on the primary CAs?',
    options: ['The secondary CA', 'FortiNAC-M', 'Each primary CA checks itself and reports to FortiNAC-M', 'The FortiGate Security Fabric root'],
    answer: [0],
    explanation: 'The N+1 guide states the health checks are performed by the **secondary server, not FortiNAC-M**. FortiNAC-M manages the group and shows status.',
    lesson: '2.3-ha-nplus1',
  },
  {
    id: 'd2-048', topic: '2.3', type: 'single', difficulty: 3,
    stem: 'Refer to the exhibit. N+1 group: FNAC-CA3 is the secondary for FNAC-CA1 and FNAC-CA2. What does FNAC-CA3 do?',
    exhibit: `Direct check   FNAC-CA3 -> FNAC-CA1 : FAIL
Direct check   FNAC-CA3 -> FNAC-CA2 : OK
Indirect check FNAC-CA3 via FNAC-CA2 -> FNAC-CA1 : OK`,
    options: ['Nothing; the indirect check passed, so no failover is triggered', 'It is promoted to replace FNAC-CA1', 'It is promoted to replace FNAC-CA2', 'It asks FortiNAC-M to decide'],
    answer: [0],
    explanation: 'Failover requires **both** the direct and the indirect check to fail. FNAC-CA2 can still reach FNAC-CA1, so the problem is the secondary\'s own path and no failover happens. FortiNAC-M does not make the decision.',
    lesson: '2.3-ha-nplus1',
  },
  {
    id: 'd2-049', topic: '2.3', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit (FNAC-M > System > CA Management). What is the state of the N+1 group?',
    exhibit: `Name      IP          Failover Role  Status
FNAC-CA1  10.0.1.21   Primary        Standby
FNAC-CA2  10.0.2.21   Primary        Running
FNAC-CA3  10.0.9.21   Secondary      Promoted`,
    options: ['FNAC-CA3 has taken over FNAC-CA1; FNAC-CA1 is back online and waits for an administrator to resume control', 'FNAC-CA1 is being upgraded and FNAC-CA3 is idle', 'FNAC-CA3 is load-balancing traffic for both primaries', 'FNAC-CA1 will automatically resume control at the next health check'],
    answer: [0],
    explanation: 'After a failover the secondary is **Promoted**. A repaired primary returns in **Standby** and the secondary stays Promoted until someone right-clicks the primary and selects **Resume Control**; nothing fails back automatically. The secondary does not load-balance.',
    lesson: '2.3-ha-nplus1',
  },
  {
    id: 'd2-050', topic: '2.3', type: 'multi', difficulty: 2,
    stem: 'Which two statements about building an N+1 failover group on FortiNAC-M are true? (Choose two.)',
    options: ['Configure the secondary CA first, then the primaries', 'A primary whose firmware version differs from the secondary is ignored', 'A secondary can protect up to ten primaries', 'Config Wizard isolation scopes are replicated automatically from each primary to the secondary', 'The failover group is configured on the primary CA\'s HA page'],
    answer: [0, 1],
    explanation: 'Add and configure the **secondary first**; the secondary **ignores a primary with unmatched firmware**. The limit is **five** primaries per secondary. Config Wizard settings are **not** replicated; configure all primaries\' isolation scopes on the secondary. Groups are configured in FortiNAC-M CA Management.',
    lesson: '2.3-ha-nplus1',
  },
  {
    id: 'd2-051', topic: '2.3', type: 'match', difficulty: 2,
    stem: 'Match each N+1 traffic-redirection option to its description.',
    pairs: [
      ['FortiADC', 'Virtual servers with the primary and secondary as real servers; health checks steer traffic'],
      ['Backup IP: Independent', 'Layer 3: each primary has its own backup IP that the secondary brings up when promoted'],
      ['Backup IP: Shared', 'Layer 2: one shared port1 IP with a VLAN ID moves to the active appliance'],
    ],
    explanation: 'The N+1 guide offers a load balancer (FortiADC) or backup IP in two forms: Independent (L3, per-primary IP) and Shared (L2, shared IP, VLAN on port1, secondary clones port2).',
    lesson: '2.3-ha-nplus1',
  },
  {
    id: 'd2-052', topic: '2.3', type: 'fill', difficulty: 3,
    stem: 'On FortiNAC-F 7.6.3+, which CLI command, run on an N+1 secondary CA, displays the failover group\'s primaries and secondary? (full command)',
    answer: ['RunClient FailoverConsole getFailoverGroup'],
    explanation: '`RunClient FailoverConsole getFailoverGroup` returns the group configuration. The N+1 commands run on the CAs, not on FortiNAC-M.',
    lesson: '2.3-ha-nplus1',
  },
  {
    id: 'd2-053', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A registered card reader belongs to host group Card Readers. Which configuration does it receive?',
    exhibit: `Policy & Objects > Network Access (Policies)
Rank  Name            User/Host Profile   Network Access Configuration
1     IP Cameras      IP Cameras          Cameras Config
2     General Access  Catch All           Corp Config
3     Card Readers    Card Readers        Card Readers Config

Catch All: Where=Any, Who/What by Group=Any, Who/What by Attribute=Any, When=Always`,
    options: ['Corp Config', 'Card Readers Config', 'Cameras Config', 'No configuration; the Default VLAN applies'],
    answer: [0],
    explanation: 'Policies are evaluated top down and the first match wins. **Catch All** at rank 2 matches every host, so rank 3 is never reached (the GUI shows it grayed out with a strike-through). Move Card Readers above General Access.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-054', topic: '2.4', type: 'order', difficulty: 2,
    stem: 'Put the identities FortiNAC-F uses when evaluating a user/host profile in priority order, highest first.',
    items: ['Logged-on user and host', 'Registered user and host', 'Registered host'],
    explanation: 'The User/host profiles page lists the priority as logged-in user and host, then registered user and host, then registered host.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-055', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. Host PC-17 is registered to Alice (Finance) and Bob (Engineering) is logged on to it. Which policy applies?',
    exhibit: `Rank  Policy        Profile (Who/What by Group)
1     Finance       Any Of: Finance (user group)
2     Engineering   Any Of: Engineering (user group)
3     Corp-Default  Who/What by Attribute: Host Device Type = Windows`,
    options: ['Engineering', 'Finance', 'Corp-Default', 'Finance, because the registered owner always takes precedence'],
    answer: [0],
    explanation: 'The **logged-on user** has the highest priority, so Bob\'s groups are evaluated: Finance (rank 1) doesn\'t match Bob, Engineering (rank 2) does. Alice\'s groups would only count if no user were logged on.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-056', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A profile\'s Where field contains a device group with FSW-Access1, but hosts on FSW-Access1 ports never match. What should the administrator change?',
    exhibit: `User/Host Profile: Access1-Users
Where:                  Device Group = Access1-Switches (members: FSW-Access1)
Who/What by Group:      Any
Who/What by Attribute:  Any
When:                   Always`,
    options: ['Use a port group containing the FortiSwitch ports instead of the device group', 'Add the FortiGate that manages FSW-Access1 to the device group', 'Set When to Always', 'Change Who/What by Group to All Of'],
    answer: [0],
    explanation: 'The guide warns that for hosts on FortiSwitch ports you must use a **Port Group**; a Device Group with the FortiSwitch selected will not match. The other changes don\'t address the location match.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-057', topic: '2.4', type: 'single', difficulty: 3,
    stem: 'An administrator builds a profile that matches Adapter > Connected = Online for a RADIUS (802.1X) wireless network access policy. Why does it fail to match?',
    options: ['At RADIUS post-authentication time the adapter status is always offline', 'Adapter attributes can only be used in portal policies', 'RADIUS hosts have no adapter record', 'Online status is only known after the next L3 poll'],
    answer: [0],
    explanation: 'The profile page warns not to use adapter status in network access policies: it changes during authentication, and at RADIUS post-auth processing the adapter is **always offline**.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-058', topic: '2.4', type: 'multi', difficulty: 2,
    stem: 'A Who/What by Attribute section contains two filters: Filter 1 has Host OS = Windows AND Host Role = Kiosk; Filter 2 has Device Type = Camera. Which two hosts match? (Choose two.)',
    options: ['A Windows host with role Kiosk', 'A camera of any OS', 'A Windows host with role Staff', 'A macOS host with role Kiosk', 'A printer with role Kiosk'],
    answer: [0, 1],
    explanation: 'Within one filter all parameters must match (Windows **and** Kiosk); the host needs to match only **one** filter in the list (Filter 1 **or** Filter 2). Windows/Staff and macOS/Kiosk fail Filter 1, and a printer fails both.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-059', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A contractor connects on Saturday at 10:00 in Building A. Which result is correct?',
    exhibit: `Rank 1  Contractor Access
  Profile: Who/What by Group = Any Of Contractors
           Where = Building A Ports
           When  = Mon-Fri 07:00-19:00
  Configuration: logical network Contractor (FSW-Access1 = VLAN 50)
Rank 2  Employees
  Profile: Who/What by Group = Any Of Staff
  Configuration: logical network Corp
(no other policies)`,
    options: ['No policy matches, so the host stays on the device\'s Default VLAN', 'Contractor Access applies because Where and Who/What match', 'Employees applies because it is the next policy', 'The host is sent to registration isolation'],
    answer: [0],
    explanation: 'All profile sections must match; **When** fails on Saturday, so rank 1 fails. The contractor isn\'t in Staff, so rank 2 fails. With no matching policy the device\'s **Default** VLAN (used when no policy sets one) applies. The host is still registered, so registration isolation does not apply.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-060', topic: '2.4', type: 'order', difficulty: 2,
    stem: 'Put the steps for automatically placing new IP cameras in the Cameras VLAN in a sensible order.',
    items: ['Create the logical network Cameras and give it an access value in each switch model', 'Create a device profiling rule that registers matching cameras as devices and adds them to group IP Cameras', 'Create a user/host profile with Who/What by Group = Any Of IP Cameras', 'Create a network access configuration that uses logical network Cameras', 'Create a network access policy with that profile and configuration, ranked above any catch-all'],
    explanation: 'Logical network and device values first, then onboarding (profiling rule → group), then the profile and configuration, then the ranked policy that ties them together.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-061', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A newly connected IP camera is still a rogue because no profiling rule matched it. Which network access policy applies to it?',
    exhibit: `Users & Hosts > Hosts
Status  Host Name  IP Address   Physical Address     Device Type
Rogue   -          10.0.40.37   00:09:0F:4C:21:9B    -`,
    options: ['None; network access policies are used for registered hosts only', 'The IP Cameras policy, because its OUI matches', 'The catch-all policy', 'The first policy whose Where matches the port'],
    answer: [0],
    explanation: 'Network access policies apply to **registered hosts only**. A rogue on an enforced port is handled by registration enforcement until it is registered (by profiling, the portal or an administrator).',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-062', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Which Who/What by Group option matches a host only if it is a member of every selected group?',
    options: ['All Of', 'Any Of', 'Any', 'None Of'],
    answer: [0],
    explanation: '**All Of** requires every selected group; **Any Of** needs at least one; **Any** matches any group; **None Of** requires none of them.',
    lesson: '2.4-profiles-access-policies',
  },
  {
    id: 'd2-063', topic: '2.4', type: 'match', difficulty: 2,
    stem: 'Match each FortiGate integration term to its description.',
    pairs: [
      ['Connector Based FSSO Tag', 'External FSSO connector on TCP 8000; FortiGate not joined to the Fabric'],
      ['Dynamic Address Tag', 'FortiNAC-F authorised by the Fabric root FortiGate; port 8013'],
      ['Firewall tag', 'Label created in FortiNAC-F and chosen by policy, not by group membership'],
      ['Quarantine via FortiNAC', 'FortiGate automation action that disables the host MAC in FortiNAC-F'],
    ],
    explanation: 'FSSO tags use an external connector on TCP 8000 and FSSO user groups; Dynamic Address Tag uses the Security Fabric (port 8013, Fabric root) and dynamic address objects. Firewall tags are FortiNAC-F labels picked by policy. Quarantine via FortiNAC is the FortiGate stitch action that disables the MAC in FortiNAC-F.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-064', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit (FortiGate CLI). What does the Groups value represent?',
    exhibit: `FGT-HQ # diagnose debug authd fsso list
----FSSO logons----
IP: 10.0.40.31  User: 00:09:0F:4C:21:7A  Groups: CAMERAS  Workstation:  MemberOf: Cameras
Total number of logons listed: 1, filtered: 0
----end of FSSO logons----`,
    options: ['The group or firewall tag selected by the network access policy the camera matched in FortiNAC-F', 'The camera\'s Active Directory group', 'The FortiGate interface the camera is connected to', 'The FortiNAC-F logical network VLAN ID'],
    answer: [0],
    explanation: 'In the FSSO method FortiNAC-F sends logon events with the device IP, the user ID (the **MAC** when no user is known, as for a camera) and a **group filter**: the user group, host group or firewall tag chosen by the matching network access policy.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-065', topic: '2.4', type: 'multi', difficulty: 3,
    stem: 'An administrator wants FortiGate VDOM root on FGT-Branch1 to receive tag Cameras for hosts that match the IP Cameras policy, using logical networks. Which three steps are required? (Choose three.)',
    options: ['Assign logical network Cameras in the network access configuration used by the IP Cameras policy', 'In Network > Inventory > FGT-Branch1 > Virtualized Devices, open the root VDOM Model Configuration and set the tag for logical network Cameras', 'Model FGT-Branch1 in Inventory with SNMP, CLI and API credentials', 'Create a VLAN 40 interface on FGT-Branch1 for the cameras', 'Enable the Access Value is an alias option in the configuration'],
    answer: [0, 1, 2],
    explanation: 'The FortiGate must be **modeled**, the policy\'s configuration must use the **logical network**, and the **VDOM model configuration** maps that logical network to the firewall tag. FortiGate wired control doesn\'t use VLANs, and the alias option is a Cisco/Brocade VLAN-name feature.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-066', topic: '2.4', type: 'fill', difficulty: 2,
    stem: 'FortiNAC-F joins the Security Fabric through Network > Service Connectors > Security Fabric Connection, pointing at the root FortiGate. Which port is entered? (number)',
    answer: ['8013'],
    explanation: 'The Security Fabric Connection uses the root FortiGate IP and port **8013**. Port 8000 is the FSSO connector method.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-067', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A registered host matches policy Corp (tag Production) but is marked at risk. What does FortiNAC-F provide at the FortiGate?',
    exhibit: `Policy Details > Network Access (host PC-31)
Policy Name: Corp   Configuration Name: Corp Config   Tags: Production
Host status: Registered, At Risk
FGT-HQ model (root VDOM): Quarantine access configured`,
    options: ['The Quarantine network access configured in the FortiGate device model', 'The Production tag, because the policy still matches', 'No logon at all, so the FortiGate implicit deny applies', 'The Production tag plus an automatic CoA'],
    answer: [0],
    explanation: 'The SSO guide states that host status takes precedence over a matching policy: an **at-risk** registered device is provisioned the **Quarantine** network access configured in the FortiGate model, not the policy\'s tag.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-068', topic: '2.4', type: 'multi', difficulty: 2,
    stem: 'Which two statements about FortiNAC-F integration with FortiGate for tags are true? (Choose two.)',
    options: ['Use only one method (FSSO connector or Dynamic Address Tag) when managing multiple FortiGates', 'If FortiNAC-F is disconnected for 300 seconds, FortiGate removes the SSO logons it received', 'FortiGate merges tags from several FSSO agents reporting the same IP address', 'Dynamic Address Tag requires that the FortiGate is not part of the Security Fabric', 'Rogue hosts are sent with tag Unregistered'],
    answer: [0, 1],
    explanation: 'Mixing methods caused unpredictable tag behaviour, so **use one**. FortiGate removes SSO logons after **300 s** without the collector. FortiGate accepts one FSSO agent per IP (others overwrite). Dynamic Address Tag is for FortiGates that are **Security Fabric members**, with FortiNAC-F authorised at the Fabric root. Rogues don\'t match network access policies, so no tag is sent for them.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-069', topic: '2.4', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. FortiNAC-F was added as a Security Fabric connection but FortiGate policies show no FortiNAC tag addresses. What is the next step?',
    exhibit: `FortiNAC-F  Network > Service Connectors
Name                 Type                        IP           Port  Status
FGT-HQ Fabric        Security Fabric Connection  10.0.0.1     8013  Waiting for Authorization`,
    options: ['Authorize FortiNAC-F on the root FortiGate (Security Fabric > Fabric Connectors, or the csf trusted-list)', 'Change the port to 8000', 'Enable FSSO Communication on FortiNAC-F', 'Add fsso to the FortiNAC-F port2 allowaccess list'],
    answer: [0],
    explanation: '**Waiting for Authorization** means the root FortiGate hasn\'t accepted FortiNAC-F yet. Authorize it in the Fabric topology or with `config system csf` > `config trusted-list` > `edit "<serial>"` > `set action accept`. Port 8000 and FSSO settings belong to the other method.',
    lesson: '2.4-firewall-tags-fabric',
  },
  {
    id: 'd2-070', topic: '2.4', type: 'fill', difficulty: 2,
    stem: 'Refer to the exhibit. For the Connector Based FSSO Tag method, which keyword must be added to the FortiNAC-F port1 allowaccess list? (one word)',
    exhibit: `FNAC-CA1 # show system interface
config system interface
    edit port1
        set ip 10.0.1.21/24
        set allowaccess https-adminui ssh ping snmp nac-ipc
    next
end`,
    answer: ['fsso'],
    explanation: 'The SSO guide adds **fsso** (TCP 8000) to port1 `allowaccess` so FortiNAC-F accepts the FortiGate FSSO connector.',
    lesson: '2.4-firewall-tags-fabric',
  },
];
