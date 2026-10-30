// Domain 3 — Integration question bank (original, exam-style). FortiNAC-F 7.6 / FortiOS 7.6.
export default [
  // ---------- 3.1 Third-party syslog and SNMP trap input ----------
  {
    id: 'd3-001',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A third-party firewall, PA-Edge, sends threat syslog to FNAC-CA1. A packet capture on FNAC-CA1 shows the messages arriving from 10.10.30.5, and the Palo Alto Networks Firewall Syslog File is enabled. No events are generated. What must the administrator change?',
    exhibit: String.raw`FNAC-CA1 # show system interface
config system interface
    edit port1
        set ip 10.10.10.20/24
        set allowaccess https-adminui ssh snmp syslog
    next
end

Network > Inventory > Firewalls > PA-Edge   (Pingable device, Element tab)
  Name ................ PA-Edge
  IP Address .......... 10.10.30.5
  Physical Address .... 02:00:5E:10:30:05
  Device Type ......... Firewall
  Incoming Events ..... Not Applicable
  SSO Agent ........... Not Applicable
  Role ................ NAC-Default`,
    options: [
      'Set Incoming Events on the PA-Edge model to Syslog and select the Palo Alto Networks Firewall Syslog File',
      'Add syslog to the allowaccess list of port2, because inbound syslog is accepted on the isolation interface',
      'Delete the pingable device and model PA-Edge with SNMP credentials, because syslog is processed only for devices FortiNAC-F can poll',
      'Change the Device Type to IPS/IDS, because Syslog Files are applied only to IPS/IDS device types',
    ],
    answer: [0],
    explanation: "Port1 already accepts syslog, the sender is modeled with the right source IP, and the definition is enabled. What's missing is the link between them: on a pingable device, **Incoming Events** decides how its syslog is parsed. Not Applicable means nothing is parsed. Selecting **Syslog** lets you pick an enabled Syslog File (Security Events picks a security event parser instead). Syslog is accepted on **port1**, not port2. Pingable devices are the documented way to model syslog senders such as firewalls and IPS, so SNMP polling isn't required. No device-type restriction is documented for Syslog Files.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-002',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator creates a Syslog File definition for an IPS whose messages look like `id=060001 cip=10.10.40.15 atck=tln-001017 msg="TCP Connection With Missed Setup"`. Which statement about this definition is true?',
    options: [
      'It uses the TAG/VALUE format; fields are found by tag name, the delimiter is a space, and values containing spaces must be enclosed in double quotes',
      'It uses the CSV format; the IP Tag/Column field must contain the column number 2 because cip is the second field',
      'It uses the CEF format, because any message containing tag=value pairs must be defined as CEF',
      'It uses the TAG/VALUE format with a pipe delimiter, which must be selected in the Delimiter field',
    ],
    answer: [0],
    explanation: "Tagged fields such as `cip=10.10.40.15` are the **TAG/VALUE** format. You enter the tag name (`cip`) in the IP Tag/Column field. The Delimiter field isn't available for TAG/VALUE because a space is always used, which is why a value with spaces (the `msg` text) must be in double quotes. Column numbers are for **CSV**. **CEF** is defined by its fixed `CEF:Version|Vendor|Product|…` pipe-separated header, which this message doesn't have.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-003',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The IPS sent one syslog message about 10.10.40.15, which a Syslog File maps to a high-severity IPS event. The Events view shows two IPS High Violation events at the same second for host LT-0442. Why?',
    exhibit: String.raw`Users & Hosts > Hosts > LT-0442 (Registered to jsmith)

Adapters
  Physical Address    IP Address     Media     Status   Location
  00:09:0F:6A:21:B4   10.10.40.15    Wired     Online   Cisco-Access1 Gi1/0/14
  00:09:0F:6A:21:B5   10.10.60.22    Wireless  Online   FAP-Floor2 / Corp-WiFi

Logs > Events (filtered: Host = LT-0442)
  2026/10/30 11:02:41  IPS High Violation  LT-0442  00:09:0F:6A:21:B4
  2026/10/30 11:02:41  IPS High Violation  LT-0442  00:09:0F:6A:21:B5`,
    options: [
      'When a syslog message refers to a host with more than one adapter, FortiNAC-F generates an event for each adapter',
      'The IPS sent the message twice, once for each of the host\'s IP addresses',
      'The alarm mapping uses the One Event to One Alarm trigger rule, which writes a second copy of the event to the log',
      'The Syslog File is listed twice under Syslog Files, so each line is parsed once by each definition',
    ],
    answer: [0],
    explanation: "The Syslog Files documentation states that a syslog message for a host with **more than one adapter** produces an event **for each adapter**, so one line can create several events and alarms. That's exactly what the exhibit shows: the same second and two MACs on one host. The message only contained 10.10.40.15, so the IPS didn't send per-IP copies. Trigger rules decide how many **alarms** are created; they don't duplicate events. Syslog File names are unique, so the same definition can't be listed twice.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-004',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'An administrator configures Cisco-Access1 to send MAC notification traps to FortiNAC-F. Which two statements are true? (Choose two.)',
    options: [
      'MAC notification traps should be enabled on access ports and AP ports, not on uplinks or aggregate ports',
      'The traps must come from the IP address that FortiNAC-F uses to model Cisco-Access1, or FortiNAC-F does not process them',
      'MAC notification traps must use SNMPv3, because FortiNAC-F rejects v1 and v2c MAC notification traps',
      'linkUp and linkDown traps should stay enabled on the same ports so FortiNAC-F can still read the forwarding table after each trap',
      'A Trap MIB File entry for the Cisco MAC notification OID must be created before FortiNAC-F can interpret the traps',
    ],
    answer: [0, 1],
    explanation: "The MAC notification guide says to enable the traps on **access ports** (and AP-facing ports) and not on infrastructure links, aggregates or user-defined uplinks. It also says that if traps are sourced from an IP other than the modeled one, FortiNAC-F won't process them, hence `snmp-server source-interface traps` on L3 switches. FortiNAC-F accepts **v1, v2 and v3** MAC notification traps. Link traps should be **removed** from ports that send MAC notification traps; avoiding forwarding-table reads is the point of the feature. Vendor MAC notification traps are supported natively (see SNMP trap support); Trap MIB Files are for custom application traps.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-005',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Cisco-Access1 is modeled in FortiNAC-F as 10.10.20.11 and polls successfully. MAC notification traps reach FNAC-CA1, but the Ports view only updates at the next L2 poll. What should the administrator do?',
    exhibit: String.raw`Cisco-Access1#show running-config | include snmp|mac address-table
mac address-table notification change
mac address-table notification mac-move
snmp-server community FNAC-RO RO
snmp-server enable traps mac-notification change move
snmp-server host 10.10.10.20 version 2c FNAC-RO mac-notification

Cisco-Access1#show ip interface brief | exclude unassigned
Interface              IP-Address      OK? Method Status                Protocol
Vlan20                 10.10.20.11     YES NVRAM  up                    up
Vlan99                 10.99.0.2       YES NVRAM  up                    up

FNAC-CA1 # execute tcpdump -i=port1 udp port 162
11:20:03.118204 IP 10.99.0.2.61514 > 10.10.10.20.162: UDP, length 171
11:20:07.402911 IP 10.99.0.2.61514 > 10.10.10.20.162: UDP, length 171`,
    options: [
      'Configure snmp-server source-interface traps Vlan20 on Cisco-Access1 so the traps are sourced from the modeled address',
      'Change the trap host to SNMPv3, because FortiNAC-F processes only authenticated MAC notification traps',
      'Create a Trap MIB File for enterprise OID 1.3.6.1.4.1.9 so FortiNAC-F can decode the Cisco traps',
      'Re-enable linkUp and linkDown traps on the access ports, because MAC notification traps are processed only after a link trap',
    ],
    answer: [0],
    explanation: "The capture shows the traps arriving from **10.99.0.2**, but the switch is modeled as **10.10.20.11**. FortiNAC-F matches traps to modeled devices by source IP, so these are ignored and the Ports view only changes when the L2 poll runs. On L3 switches the guide's fix is `snmp-server source-interface traps <vlan>`. v2c MAC notification traps are supported. Cisco MAC notification traps are built in; Trap MIB Files are for custom traps. Link traps should be removed where MAC notification is used.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-006',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: 'In a Trap MIB Files custom trap, the Event Format inserts varbind data with a placeholder in braces. Varbinds are counted from zero. What placeholder inserts the data from the **third** varbind of the trap?',
    answer: ['{2}', '2'],
    explanation: "The Event Format placeholder `{n}` takes the varbind at index *n*, counting from **0**. The documented example is `{4}` for the fifth varbind, so the third varbind is `{2}`.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-007',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'A monitoring application on server MON-01 sends a custom enterprise trap to FNAC-CA1 whenever it detects a compromised host. MON-01 is modeled as a server in Inventory, port1 allows snmp, and a Trap MIB File entry has the correct Enterprise OID, Specific Type and IP address OID. The application is set to send SNMPv3 authPriv traps, and no events appear. Based on the Trap MIB Files requirements, what is the most likely cause?',
    options: [
      'Trap MIB Files are documented as receiving traps only through SNMPv1 and SNMPv2, so the application must send v1 or v2c traps',
      'Trap MIB Files require the MAC address OID; an IP address OID alone cannot identify the host',
      'The sending application must be modeled as a pingable device with Incoming Events set to Security Events',
      'Custom traps must be sent to port2, because port1 only accepts traps from switches',
    ],
    answer: [0],
    explanation: "The Trap MIB Files page lists its requirements: the `snmp` allowaccess option, a modeled sender with an IP address, traps addressed to the FortiNAC-F server, and that FortiNAC-F **can only receive these traps through SNMPv1 and SNMPv2**. Only one of the IP, MAC and User ID OIDs is needed to identify the host. Incoming Events concerns syslog parsing, not traps. Traps go to port1. (Switch MAC notification traps are a separate, built-in feature that accepts v3; don't mix the two up.)",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-008',
    topic: '3.1',
    type: 'match',
    difficulty: 1,
    stem: 'Match each System > Settings > System Communication view to what you configure there.',
    pairs: [
      ['Syslog Files', 'Definitions that turn IPS/IDS syslog lines into standard events'],
      ['Security Event Parsers', 'Normalizing syslog into security events with vendor-to-FortiNAC severity mappings'],
      ['Trap MIB Files', 'Decoding custom enterprise SNMP traps into events'],
      ['Log Receivers', 'External syslog, SNMP trap or FortiAnalyzer hosts that receive FortiNAC-F events and alarms'],
    ],
    explanation: "**Syslog Files** create ordinary events from CSV, TAG/VALUE or CEF syslog. **Security Event Parsers** feed Security Incidents and add type, subtype, threat ID and severity mappings. **Trap MIB Files** map custom traps (Enterprise OID, Specific Type, IP/MAC/User OIDs) to events. **Log Receivers** handle outbound logging: Syslog CSV, Syslog CEF, SNMP Trap or FortiAnalyzer.",
    lesson: '3.1-syslog-trap-input',
  },
  {
    id: 'd3-009',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Every administrator except rlopez receives the Device Contact Lost email. rlopez has a valid email address and receives test messages from Email Settings. Why doesn\'t rlopez get the alarm email?',
    exhibit: String.raw`Logs > Events & Alarms > Mappings > Device Contact Lost
  Enabled ...................... Yes
  Trigger Event ................ Device Contact Lost
  Severity ..................... Critical
  Clear on Event ............... Device Contact Established
  Apply To ..................... Group: Core Switches
  Notify Users ................. Yes   Group: All Management
     Send Email ................ Yes
     Send SMS .................. No
  Trigger Rule ................. One Event to One Alarm

Users & Hosts > Administrators
  User ID    Email                   Groups
  admin      noc@corp.example.com    All Management
  mchen      mchen@corp.example.com  All Management, NetOps-Alerts
  rlopez     rlopez@corp.example.com NetOps-Alerts`,
    options: [
      'The mapping notifies the All Management group, and rlopez is not a member of it',
      'Send SMS must also be enabled, because email notification requires a mobile number as a fallback',
      'The Trigger Rule One Event to One Alarm sends email only to the first administrator in the group',
      'Device Contact Lost is logged Internal only, so the email can reach only administrators in All Management',
    ],
    answer: [0],
    explanation: "Alarm notification goes to the **administrator group** selected in the mapping, here **All Management**. rlopez is only in NetOps-Alerts. Fix it by pointing the mapping at NetOps-Alerts or adding rlopez to All Management. SMS is a separate option with its own prerequisites. Trigger rules decide how many alarms are created, not who is told. Internal/External logging controls where the event is logged, not alarm email.",
    lesson: '3.1-alarms-notification-syslog-out',
  },
  {
    id: 'd3-010',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'The Host Connected event is mapped to an alarm with the trigger rule Event Frequency set to 3 times in 10 minutes. Which sequence of connections generates an alarm?',
    options: [
      'Host A connects at minutes 2, 9 and 11',
      'Host A connects at minutes 1, 8 and 12',
      'Host A connects at minutes 3 and 5, and host B connects at minutes 6 and 7',
      'Host A connects at minutes 1, 12 and 23',
    ],
    answer: [0],
    explanation: "Event Frequency counts occurrences **from the same element** inside a **sliding** time window. Minutes 2, 9 and 11 fall within 10 minutes, so the alarm fires. With 1, 8 and 12, no 10-minute window contains all three (the documentation uses this example). Four connections split across two hosts never alarm, because each host is counted separately. Minutes 1, 12 and 23 are more than 10 minutes apart.",
    lesson: '3.1-alarms-notification-syslog-out',
  },
  {
    id: 'd3-011',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'An administrator adds the corporate SIEM as a Syslog CSV log receiver on FNAC-CA1. The SIEM must receive both the Device Contact Lost event and the alarm it raises, but nothing arrives. Which two changes are required? (Choose two.)',
    options: [
      'Set the Device Contact Lost event logging option to External or Internal & External in Logs > Events & Alarms > Management',
      'Enable Send Alarm to External Log Hosts on the Device Contact Lost alarm mapping',
      'Add syslog to the port1 allowaccess list so FortiNAC-F can send syslog',
      'Model the SIEM as a pingable device with Incoming Events set to Syslog',
      'Create a Syslog File definition in CSV format for the SIEM',
    ],
    answer: [0, 1],
    explanation: "A log receiver only defines **where** to send. Events go out only when their logging option includes **External**, and alarms only when the mapping has **Send Alarm to External Log Hosts** checked (default off). `allowaccess syslog` opens the **inbound** listener and isn't needed for outbound messages. Pingable devices with Incoming Events and Syslog Files are for **receiving** syslog from third parties.",
    lesson: '3.1-alarms-notification-syslog-out',
  },
  {
    id: 'd3-012',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The SIEM receives this message from FNAC-CA1 through a Syslog CSV log receiver with default settings. Which statement is correct?',
    exhibit: String.raw`<37>Oct 30 09:14:02 : 2026/10/30 09:14:02 EDT,2,58213,Device Contact Lost,2,1127,,Cisco-Access1,10.10.20.11,,Contact lost with device Cisco-Access1`,
    options: [
      'It is an alarm (log type 2) with severity Major (2), about the entity Cisco-Access1',
      'It is an event (log type 2) with severity Critical (2), about the entity Cisco-Access1',
      'It is a security alarm, because every message with facility value 37 is a security message',
      'It is an alarm with severity Minor, because the second field after the timestamp holds the severity',
    ],
    answer: [0],
    explanation: "In FortiNAC-F's CSV syslog format the field after the timestamp is the **log type** (1 Event, 2 Alarm, 3 Security Alarm). Next come the database ID and the name, then **severity** (0 Normal, 1 Minor, 2 Major, 3 Critical), the entity ID, user ID, entity name, IP, MAC and message. So this is an alarm with severity Major. `<37>` is the syslog PRI: facility 4 (the default, security/authorization) × 8 + severity 5 (notice). It's not a log-type indicator. The 2 right after the timestamp is the log type, not the severity.",
    lesson: '3.1-alarms-notification-syslog-out',
  },
  {
    id: 'd3-013',
    topic: '3.1',
    type: 'fill',
    difficulty: 1,
    stem: 'When you add a Syslog CSV log receiver in FortiNAC-F, which syslog **Facility** number is selected by default?',
    answer: ['4'],
    explanation: "Log receivers of type Syslog default to **Facility 4** (security/authorization messages) and port 514. SNMP Trap receivers default to port 162 and have a Security String instead of a facility.",
    lesson: '3.1-alarms-notification-syslog-out',
  },

  // ---------- 3.2 FortiNAC-F Manager ----------
  {
    id: 'd3-014',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which three items are shared globally from FortiNAC-F Manager to its managed CAs by server synchronization? (Choose three.)',
    options: [
      'User/host profiles',
      'Device profiling rules',
      'Roles',
      'Modeled switches and their port VLAN settings',
      'Guest accounts created on a CA',
      'Syslog File definitions',
    ],
    answer: [0, 1, 2],
    explanation: "The documented global objects are admin profiles, guest templates, **device profiling rules**, device types, groups, **roles**, **user/host profiles**, endpoint compliance policies, configurations and scans, and the security actions those configurations use. Modeled infrastructure stays on the CA that controls it. Guest **accounts** are copied between CAs on demand, never synchronized (guest **templates** are global). Syslog Files are not on the global list.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-015',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FNAC-CA1 and FNAC-CA2 are primaries in an N+1 failover group with FNAC-CA3 as the secondary. What does the CA Management widget show?',
    exhibit: String.raw`FNAC-M  Dashboard > CA Management
  Name       Role        Port1 IP Address   Status      Managed By   Firmware
  FNAC-CA1   Primary     10.10.10.20        Running     FNAC-M       7.6.7
  FNAC-CA2   Primary     10.20.10.20        Stand By    FNAC-M       7.6.7
  FNAC-CA3   Secondary   10.10.10.23        Promoted    FNAC-M       7.6.7`,
    options: [
      'FNAC-CA2 failed earlier and FNAC-CA3 took over its workload; FNAC-CA2 is back online but FNAC-CA3 is still running in its place',
      'FNAC-CA3 is idle and ready to take over if either primary fails, while FNAC-CA2 is waiting to be promoted',
      'FNAC-M has lost contact with FNAC-CA2 and is trying to reconnect, so FNAC-CA3 has been promoted to manager',
      'FNAC-CA3 is in the middle of taking over from FNAC-CA2, and the takeover completes when FNAC-CA2 shows Running',
    ],
    answer: [0],
    explanation: "**Promoted** means a secondary is running for one of its primaries. When an N+1 primary fails, the secondary takes over and becomes Promoted. When the primary is repaired and back online its status becomes **Stand By** while the secondary stays Promoted. An idle secondary would show Stand By, not Promoted. Lost contact would show **Unreachable Reconnecting**. A takeover that is still running shows **Promotion In Progress**. A CA is never promoted to Manager.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-016',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: 'A user/host profile named Contractors-Wired was created on FNAC-M and synchronized to the managed CAs. An administrator logs in to FNAC-CA2 to add a location to it. What happens?',
    options: [
      'The profile is read-only on FNAC-CA2; the change must be made on FNAC-M, which then synchronizes it',
      'The change is saved on FNAC-CA2 and automatically pushed up to FNAC-M at the next synchronization',
      'The change is saved on FNAC-CA2 and is kept, because local changes always take precedence over global objects',
      'The change is saved on FNAC-CA2 and copied to every other CA at the next host propagation cycle',
    ],
    answer: [0],
    explanation: "FortiNAC-F Manager owns global objects. **Global information on a managed CA is read-only**, so you edit user/host profiles (and the other global objects) on the Manager, and the Manager overwrites the CAs on the next synchronization or on Synchronize Now. Synchronization only goes from Manager to CAs. Host propagation moves host and user records, not policy objects.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-017',
    topic: '3.2',
    type: 'order',
    difficulty: 2,
    stem: 'A guest account was created on FNAC-CA1. The guest then tries to register at a site controlled by FNAC-CA2, with FNAC-M running. Put the documented steps in order.',
    items: [
      'The guest connects at the FNAC-CA2 site and starts registration in the captive portal',
      'FNAC-CA2 checks its own database for the guest account and does not find it',
      'FNAC-M searches the other managed CAs and finds the account on FNAC-CA1',
      'FNAC-M copies the guest account from FNAC-CA1 to FNAC-CA2',
      'The guest completes registration on FNAC-CA2',
    ],
    explanation: "Guest accounts aren't centrally stored or synchronized. The CA where the guest connects checks its own database first. Only if the account is missing does the Manager search the other CAs, and it then **copies** the account (with the guest's hosts if Propagate Hosts is set). After that the copies are independent. If FNAC-M were down, the guest couldn't register on FNAC-CA2.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-018',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'FNAC-M manages FNAC-CA1 and FNAC-CA2. Endpoint compliance must be available on every CA, but Guest Manager must be enabled only on FNAC-CA2. How should the licence keys be arranged?',
    options: [
      'Include endpoint compliance in the FNAC-M key; include Guest Manager in the FNAC-CA2 key and not in the FNAC-M key',
      'Include both features in the FNAC-M key, then disable Guest Manager on FNAC-CA1 under Feature Visibility',
      'Include both features in the FNAC-CA2 key only, because a feature licensed on one CA is copied to the others by global synchronization',
      'Include Guest Manager in the FNAC-M key and endpoint compliance in each CA key, because the Manager key applies only to the CA with the most licences',
    ],
    answer: [0],
    explanation: "Each appliance's key works together with the Manager's key. A feature in the **Manager's** key is enabled on **all** managed appliances. To enable a feature on **one** appliance, put it in that appliance's key and **leave it out** of the Manager's key. Licensed features aren't copied by global object synchronization, and the Manager key isn't tied to the CA with the most licences.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-019',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Both CAs are managed by FNAC-M, which holds 1000 concurrent endpoint licences. Which statement explains the FNAC-CA1 widget?',
    exhibit: String.raw`FNAC-CA1  Dashboard > License Information
  Total Licenses ........... 1000
  Licenses In Use .......... 730
  Licenses Available ....... 270

Connected hosts at this moment:
  FNAC-CA1 (HQ wired + wireless) ..... 420
  FNAC-CA2 (Branch1) ................. 310`,
    options: [
      'The pool is shared: FNAC-M counts usage across all managed CAs and every dashboard shows the same totals',
      'FNAC-CA1 owns 730 licences of its own, and FNAC-CA2 has a separate pool of 270',
      'FNAC-CA1 has reserved 730 licences for itself, so FNAC-CA2 can never use more than 270',
      'The figures are wrong, because each CA should show only its own connected hosts as In Use',
    ],
    answer: [0],
    explanation: "With a Manager, concurrent licences form **one pool** whose maximum is set on FNAC-M. Any CA can draw from it, and total, in-use and available figures are counted by the Manager and shown identically on **every** dashboard: 420 + 310 = 730 in use, 270 available. Nothing is reserved per CA. CA2 could take all 270 remaining licences, or more as CA1's hosts disconnect.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-020',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'All appliances run F 7.6.4 and On Demand Host Propagation is enabled. A laptop registered to user jsmith on FNAC-CA1 connects at Branch1, which FNAC-CA2 controls, and FNAC-CA2 treats it as a rogue. Hosts registered as devices propagate correctly. What should the administrator check first?',
    options: [
      'Whether the Propagate Hosts option is enabled on jsmith\'s user record',
      'Whether Global Object Synchronization is enabled, because host records are global objects',
      'Whether a device profiling rule on FNAC-CA2 matches the laptop, because propagation only applies to profiled devices',
      'Whether the laptop has the Persistent Agent, because host propagation needs an agent to report the MAC address',
    ],
    answer: [0],
    explanation: "From F 7.6.3, the Manager propagates host records (keyed on MAC) and user records among CAs under **On Demand Host Propagation**. For a host **registered to a user**, the user record's **Propagate Hosts** option must also be enabled. It's on by default, so a host that won't propagate while device-registered hosts do points to that setting. Host records are not global objects, and Global Object Synchronization concerns policy objects. Propagation doesn't depend on device profiling or on an agent.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-021',
    topic: '3.2',
    type: 'fill',
    difficulty: 2,
    stem: 'On FortiNAC-OS, which `allowaccess` keyword must be added to port1 on both FortiNAC-F Manager and each managed CA to allow inter-server communication (TCP 1050, 5555, 9443, 18090)?',
    answer: ['nac-ipc'],
    explanation: "`nac-ipc` opens the inter-server channel (CORBA on 1050/5555 and gRPC on 9443/18090, plus a high port range). The Manager guide has you add it to port1 on the Manager and on every CA, keeping the existing items, e.g. `set allowaccess https-adminui ssh nac-ipc`.",
    lesson: '3.2-fortinac-manager',
  },
  {
    id: 'd3-022',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FNAC-M already manages FNAC-CA1. Adding FNAC-CA2 in the CA Management widget fails. FNAC-CA2 lists the FNAC-M serial number in its own allowed list and has nac-ipc and ssh on port1. What is the cause?',
    exhibit: String.raw`FNAC-M # execute enter-shell
> globaloptiontool -name security.allowedserialnumbers
122 security.allowedserialnumbers: FNVMMXTM26000101,FNVMCATM26000211

FNAC-CA2 Dashboard > System Summary
  Host Name ........ FNAC-CA2
  Serial Number .... FNVMCATM26000212
  Version .......... 7.6.7`,
    options: [
      'The allowed serial number list on FNAC-M does not include FNAC-CA2\'s serial number; add it to the list on FNAC-M',
      'FNAC-CA2\'s allowed list must contain the serial numbers of every CA, not just the Manager',
      'nac-ipc must be enabled on port2 of FNAC-CA2, because inter-server traffic uses the service interface',
      'FNAC-CA2 must be added to an N+1 failover group before the Manager can manage it',
    ],
    answer: [0],
    explanation: "Per the Manager guide, the Manager's `security.allowedserialnumbers` must list the Manager(s) **and every managed CA**. Each CA lists only the Manager serial(s). FNAC-M lists FNAC-CA1 (…211) but not FNAC-CA2 (…212). Add it with `globaloptiontool -name security.allowedserialnumbers -setRaw \"…\"` from the shell. Inter-server traffic uses **port1**. N+1 membership is optional.",
    lesson: '3.2-fortinac-manager',
  },

  // ---------- 3.3 FortiGate VPN integration ----------
  {
    id: 'd3-023',
    topic: '3.3',
    type: 'order',
    difficulty: 2,
    stem: 'Put the events of a FortiNAC-F managed FortiGate VPN connection in order, for a user whose laptop already has the Persistent Agent.',
    items: [
      'The user authenticates to the FortiGate VPN and receives an address from the FortiNAC-managed VPN pool',
      'The FortiGate sends FortiNAC-F a syslog message with the session\'s user and IP information',
      'Restrictive FortiGate policies allow the session to reach only the FortiNAC-F VPN interface',
      'The agent reports to FortiNAC-F, which correlates it with the FortiGate session and evaluates its policies',
      'FortiNAC-F sends the FSSO group or tag for the matched logical network to the FortiGate',
      'A FortiGate policy that uses that FSSO group grants the session production access',
    ],
    explanation: "The session first exists only on the FortiGate. Its syslog tells FortiNAC-F about it while the default restrictive policies keep it contained. The agent identifies the host (IP and MAC), FortiNAC-F correlates that with the FortiGate data, checks compliance and network access policies, and sends the logical network's tag/group through FSSO. Only then does the authorized policy match. On disconnect, a second syslog message leads FortiNAC-F to remove the tag.",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-024',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-HQ is modeled in FortiNAC-F as 10.10.10.1. VPN users connect, but FortiNAC-F never shows them as online VPN clients. A capture on FNAC-CA1 shows syslog arriving. What is wrong?',
    exhibit: String.raw`FGT-HQ # show log syslogd setting
config log syslogd setting
    set status enable
    set server "10.10.10.20"
    set source-ip "203.0.113.2"
    set format csv
end

FGT-HQ # show system interface wan1
config system interface
    edit "wan1"
        set ip 203.0.113.2 255.255.255.248
        set allowaccess ping
    next
end`,
    options: [
      'The syslog source-ip is 203.0.113.2, not the 10.10.10.1 address FortiNAC-F uses to model FGT-HQ, so the messages are not associated with the modeled FortiGate',
      'FortiNAC-F accepts FortiGate syslog only in CEF format, so format must be changed to cef',
      'The syslog server must be the FortiNAC-F VPN interface rather than port1',
      'FortiNAC-F requires the FortiGate to send syslog over TCP 514, which needs reliable mode enabled',
    ],
    answer: [0],
    explanation: "The VPN guide is explicit: the FortiGate's syslog **source-ip must match the IP used to model the FortiGate** in FortiNAC-F. Messages from 203.0.113.2 can't be tied to FGT-HQ (10.10.10.1), so the sessions are never processed. The guide itself uses `set format csv`. Syslog goes to FortiNAC-F's **port1** (control server) address, not the VPN isolation interface, and nothing in the guide requires reliable (TCP) syslog.",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-025',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. VPN users get addresses from the managed pool and reach the captive portal, but Persistent Agents already installed on their laptops never locate FortiNAC-F, so the sessions stay restricted. What is the cause?',
    exhibit: String.raw`FGT-HQ # show vpn ipsec phase1-interface "RA-IPsec"
config vpn ipsec phase1-interface
    edit "RA-IPsec"
        set type dynamic
        set interface "wan1"
        set mode-cfg enable
        set ipv4-dns-server1 10.10.10.53
        set ipv4-dns-server2 10.10.50.22
        set domain "corp.local"
        set assign-ip-from name
        set ipv4-name "FNAC_IPsec_ADDR"
    next
end

FortiNAC-F  System > Configuration Wizard > Virtual Private Network
  VPN interface (port2) ... 10.10.50.22 / 255.255.255.0
  Scope label ............. RemoteUsers
  Domain .................. corp.example.com
  Lease pool .............. 10.200.80.100 - 10.200.80.200`,
    options: [
      'The tunnel\'s DNS suffix (corp.local) does not match the Domain in the FortiNAC-F VPN scope (corp.example.com), and FortiNAC-F answers agent SRV lookups only for the scope\'s domain',
      'ipv4-dns-server2 must be the production DNS server, because FortiNAC-F may only be the primary DNS server for VPN clients',
      'The scope label RemoteUsers is reserved and prevents the VPN scope from being written',
      'assign-ip-from name is not supported; the FortiGate must relay DHCP requests to FortiNAC-F for the VPN pool',
    ],
    answer: [0],
    explanation: "Agents find FortiNAC-F with a DNS SRV lookup in the VPN domain, and **FortiNAC-F only answers SRV queries from the domain set in its VPN scope**. The FortiGate must hand out the same domain. Here it's corp.local, which is also the `.local` suffix the guide warns against. The guide's layout is DNS 1 = production, DNS 2 = FortiNAC-F VPN interface, as shown. Reserved prefixes are REG_, REM_, AUTH_, DE_, ISOL_, VPN_ and HUB_; RemoteUsers is fine. FortiGate-assigned pools are the documented design, and DHCP relay is **not** supported.",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-026',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: 'In FortiNAC-F, an administrator opens Network > Inventory > FGT-HQ > Virtualized Devices, right-clicks the VDOM that terminates the VPN and selects Model Configuration. Which two VPN-related settings are configured there? (Choose two.)',
    options: [
      'VPN Addresses: the address group that contains the FortiGate VPN pool ranges',
      'Logical network mappings to the firewall tags or groups sent to the FortiGate',
      'The VPN DHCP scope and lease pool handed to VPN clients',
      'The FSSO password and listening port that FortiNAC-F uses for the connector',
      'The syslog log IDs that FortiNAC-F accepts from this FortiGate',
    ],
    answer: [0, 1],
    explanation: "The VDOM's model configuration holds **VPN Addresses** (the network address group of VPN pools), the **Source IP** for the connector where needed, and the **Logical Network → Firewall Tags / Send Groups to Firewall** mappings. VPN scopes are configured in the **Configuration Wizard**. The FSSO port and password are global (System Communication > Fortinet FSSO Settings). Log IDs are filtered on the **FortiGate** (`config log syslogd filter`).",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-027',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. During busy periods all VPN users on FGT-HQ suddenly appear offline in FortiNAC-F and lose their FSSO tags. About 150 users connect at peak. What should the administrator change?',
    exhibit: String.raw`Network > Inventory > FGT-HQ > Ports
  Port        Connection State   Hosts
  port1       Uplink             3
  port2       Always Uplink      12
  RA-IPsec    Uplink             151

Network > Settings > Network Device
  System Defined Uplink Count ...... 20`,
    options: [
      'Raise System Defined Uplink Count above the maximum number of concurrent VPN clients so the VPN interface is not automatically converted to Uplink',
      'Set the RA-IPsec interface to Always Uplink so FortiNAC-F processes all VPN MAC addresses on it',
      'Lower System Defined Uplink Count to 1 so every FortiGate interface becomes an uplink and VPN hosts are learned through ARP',
      'Add RA-IPsec to the Authorized Access Points port group so it stops counting hosts',
    ],
    answer: [0],
    explanation: "A VPN interface must have the connection state **Device** or **Multiple Hosts**, never **Uplink**. When more MAC addresses than the **System Defined Uplink Count** appear on an interface, FortiNAC-F turns it into an uplink, every client on it goes offline, and the tags are removed. The guide says to set the count above the maximum number of concurrent VPN clients. Forcing Always Uplink (or lowering the count) causes exactly this failure. The Authorized Access Points group concerns hubs and APs on switch ports.",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-028',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. User JSMITH is connected over the VPN and has passed FortiNAC-F compliance, but can reach only the FortiNAC-F VPN interface. What explains this?',
    exhibit: String.raw`FGT-HQ # show firewall policy 10
config firewall policy
    edit 10
        set name "VPN-Authorized"
        set srcintf "RA-IPsec"
        set dstintf "port2"
        set action accept
        set srcaddr "FNAC_IPsec_ADDR"
        set dstaddr "Corp-LAN"
        set schedule "always"
        set service "ALL"
        set groups "FSSO-VPN-AUTH"
    next
end

FGT-HQ # show user group "FSSO-VPN-AUTH"
config user group
    edit "FSSO-VPN-AUTH"
        set group-type fsso-service
        set member "VPN_AUTH"
    next
end

FGT-HQ # diagnose debug authd fsso list
----FSSO logons----
IP: 10.200.80.104  User: JSMITH  Groups: CONTRACTOR-VPN  Workstation:  MemberOf: Contractor-VPN
Total number of logons listed: 1, filtered: 0
----end of FSSO logons----`,
    options: [
      'FortiNAC-F sent the tag CONTRACTOR-VPN, which is not a member of FSSO-VPN-AUTH, so policy 10 does not match and the session falls through to the restrictive policies',
      'The FSSO connector to FortiNAC-F is down, so the FortiGate has no logon information for 10.200.80.104',
      'The FortiGate did not send the tunnel-up syslog message, so FortiNAC-F never processed the session',
      'The address 10.200.80.104 is outside FNAC_IPsec_ADDR, so policy 10 cannot match the source',
    ],
    answer: [0],
    explanation: "The FSSO list proves the connector works and FortiNAC-F processed the session: it sent a logon for 10.200.80.104 with group **CONTRACTOR-VPN**. Policy 10 requires FSSO-VPN-AUTH, whose only member is VPN_AUTH. So JSMITH matched a FortiNAC-F network access policy whose logical network maps to CONTRACTOR-VPN on the FGT-HQ model, and the session falls through to the restrictive policies. Either the policy/logical-network mapping or the FortiGate group membership is wrong. 10.200.80.104 is inside the managed pool (10.200.80.100–200).",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-029',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'FGT-HQ runs FortiOS 7.6.4. A team\'s runbook, written for an older FortiOS build, configures an SSL VPN tunnel-mode portal with the FortiNAC-F VPN interface as DNS server 2 for FortiNAC-F managed remote access. What should the team do?',
    options: [
      'Use an IPsec dial-up VPN for FortiNAC-F managed access, because SSL VPN tunnel mode is no longer supported from FortiOS 7.6.3',
      'Keep SSL VPN but switch the portal to web mode, because FortiNAC-F manages web-mode sessions the same way',
      'Move the VPN headend to FortiNAC-F, which can terminate SSL VPN tunnels itself from F 7.6.0',
      'Keep the runbook unchanged; SSL VPN tunnel mode is still the recommended method for FortiOS 7.6',
    ],
    answer: [0],
    explanation: "The FortiNAC-F VPN guide notes that **from FortiOS 7.6.3 the FortiGate no longer supports SSL VPN tunnel mode**, so on a 7.6.4 headend the managed design is IPsec. The DNS/domain and pool steps carry over to the phase1-interface (`mode-cfg`, `ipv4-dns-server2`, `domain`, `ipv4-name`). Web mode doesn't give the client a pool address for FortiNAC-F to manage. FortiNAC-F never terminates VPNs.",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-030',
    topic: '3.3',
    type: 'fill',
    difficulty: 3,
    stem: 'The FortiNAC-F VPN integration guide recommends one IPsec log ID in the FortiGate syslog filter for FortiNAC-F 7.6 and later. Enter that log ID.',
    answer: ['0101037139', '101037139'],
    explanation: "For IPsec the guide lists **0101037129** and **0101037134** (recommended for F 7.4 and earlier, supported on all versions) and **0101037139** as the recommendation for **F 7.6+**. SSL VPN uses 0101039947 and 0101039948.",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-031',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Fortinet FSSO Settings is enabled on FNAC-CA1 with port 8000 and a password, and the same password is set on FGT-HQ. The FGT-HQ connector stays disconnected. What must the administrator do?',
    exhibit: String.raw`FNAC-CA1 # show system interface
config system interface
    edit port1
        set ip 10.10.10.20/24
        set allowaccess https-adminui ssh snmp syslog
    next
end

FGT-HQ  Security Fabric > External Connectors > FortiNAC  (FSSO Agent on Windows AD)
  Primary FSSO Agent ...... 10.10.10.20   Port 8000
  Source IP ............... 10.10.10.1
  Status .................. Disconnected`,
    options: [
      'Add fsso to the port1 allowaccess list on FNAC-CA1 while keeping the existing options',
      'Change the FortiGate connector port to 8013, the port FortiNAC-F uses for FSSO',
      'Add nac-ipc to port1, because FSSO messages use the inter-server channel',
      'Point the FortiGate connector at the FortiNAC-F VPN interface instead of port1',
    ],
    answer: [0],
    explanation: "FortiNAC-OS accepts only the protocols in `allowaccess`, and the `fsso` keyword (TCP 8000) is missing. The integration guides add it to **port1**, copying the existing list, because `set allowaccess` replaces it: `set allowaccess https-adminui ssh snmp syslog fsso`. Port **8013** is for the **Security Fabric connection** from FortiNAC-F to the root FortiGate, not FSSO. `nac-ipc` is the Manager/HA channel. The connector targets FortiNAC-F's management interface (port1).",
    lesson: '3.3-fortigate-vpn-integration',
  },
  {
    id: 'd3-032',
    topic: '3.3',
    type: 'single',
    difficulty: 3,
    stem: 'VPN users on FGT-HQ intermittently lose production access a few minutes after FortiNAC-F authorizes them. In `diagnose debug authd fsso list`, the group on their IPs sometimes changes from the FortiNAC-F tag to an Active Directory group. The FortiGate also uses an FSSO collector agent for AD logons. What is the most likely cause?',
    options: [
      'The FortiGate keeps only one FSSO agent\'s information per IP, so the AD collector agent overwrites FortiNAC-F\'s entries; logon events for the VPN pool must be excluded on the AD collector',
      'FortiNAC-F resynchronizes with the FortiGate every few minutes and replaces its own tags with AD groups',
      'The FortiGate removes all SSO logins every five minutes even when the collector agent is connected',
      'Two FSSO connectors cannot exist on one FortiGate, so the FortiNAC-F connector disconnects whenever the AD connector polls',
    ],
    answer: [0],
    explanation: "The integration guides warn that **a FortiGate supports only one FSSO agent sending information for a given endpoint IP**. Other agents overwrite the entries, so you must find any other collector reporting the same addresses and block its logon events for that scope. FortiNAC-F's periodic resync re-adds missing **FortiNAC-F** sessions; it doesn't create AD groups. The 300-second removal applies only when the collector is **disconnected**. A FortiGate can have several FSSO connectors.",
    lesson: '3.3-fortigate-vpn-integration',
  },

  // ---------- 3.4 MDM integration, vendor OUIs, device profiling ----------
  {
    id: 'd3-033',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A newly enrolled iPad that exists in Intune connects to Corp-WiFi, opens a browser and reaches the FortiNAC-F captive portal. It stays a rogue for several hours, then is registered automatically. What change would register such devices when they reach the portal?',
    exhibit: String.raw`Network > Service Connectors > Intune-Corp  (Microsoft Intune)
  Enable On Demand Registration ............ Disabled
  Revalidate Health Status On Connect ...... Disabled
  Update Applications ...................... Disabled
  Remove Hosts ............................. Enabled
  Enable Automatic Registration Polling .... Enabled
  Poll Interval ............................ 1 Day
  Update Hosts Role ........................ Enabled
  Last Successful Poll ..................... 2026/10/30 02:00`,
    options: [
      'Enable On Demand Registration, so FortiNAC-F queries Intune when an unknown host reaches the captive portal',
      'Enable Revalidate Health Status On Connect, so FortiNAC-F registers the host each time it connects',
      'Disable Remove Hosts, because it deletes new hosts until the next poll',
      'Disable Update Hosts Role, because a host cannot be registered while its role is being updated',
    ],
    answer: [0],
    explanation: "With On Demand Registration **disabled**, an unknown host is registered only at the next **automatic registration poll** (here once a day), which matches the hours-long delay. Enabling it makes FortiNAC-F query the MDM as soon as the unknown host reaches the **captive portal** and register it if it's found. Revalidate Health Status On Connect checks compliance of known hosts, is off by default and can overload the MDM. Remove Hosts only deletes hosts that were removed or disabled in the MDM. Update Hosts Role sets the role from the Ownership value; it doesn't block registration.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-034',
    topic: '3.4',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two MDM service connector options does Fortinet document as disabled by default because, when enabled, the MDM may not cope with the rate of queries from FortiNAC-F? (Choose two.)',
    options: [
      'Revalidate Health Status On Connect',
      'Update Applications',
      'Update Hosts Role',
      'Test Connection',
      'Automatic Registration Polling Interval set to 1 day',
    ],
    answer: [0, 1],
    explanation: "Both **Revalidate Health Status On Connect** and **Update Applications** are documented as disabled by default with a warning that the MDM may not handle FortiNAC-F's query rate. As an alternative to per-connect revalidation, Fortinet suggests a once-a-day automatic poll, which also refreshes health status. Update Hosts Role (F 7.6.3+) carries no such warning. Test Connection is a right-click action, not a setting. A 1-day poll interval is the recommended low-load choice when MDM notifications are configured.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-035',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A camera with MAC 00:09:0F:4C:77:01 connects, is profiled by the rule CAM-Rule and is registered automatically. Which role does it receive?',
    exhibit: String.raw`System > Settings > Identification > Vendor OUIs
  Vendor OUI   Vendor Name   Vendor Alias   Role         Registration Type Override
  00:09:0F     Fortinet      IP Camera      Camera-OUI   Manual

Users & Hosts > Device Profiling Rules > CAM-Rule  (General tab)
  Enabled ......... Yes
  Registration .... Automatic
  Type ............ Camera
  Role ............ Cameras-DP
  Register as ..... Device in Host View
  Add to Group .... IP Cameras`,
    options: [
      'Cameras-DP, because roles assigned by the device profiler take precedence over the vendor OUI role',
      'Camera-OUI, because the vendor OUI role always overrides other role sources',
      'NAC-Default, because Registration Type Override is set to Manual',
      'No role, because a device registered in Host View cannot have a role',
    ],
    answer: [0],
    explanation: "The Vendor OUIs page states that **roles assigned by device profiler take precedence**. The OUI's role is applied to devices registered **manually through the portal**. Registration Type Override governs how the OUI classifies devices for manual registration; it doesn't blank the role from a profiling rule. Devices in Host View can certainly carry roles. The rule's Role field exists for exactly that.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-036',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Employees bring phones that are not yet enrolled in the corporate MDM. When such a phone hits the FortiNAC-F captive portal, the user should be sent to a page with links to the MDM agent, and the downloads must work while the phone is isolated. What should the administrator configure?',
    options: [
      'Enable MDM Registration in the portal\'s Global settings, put the agent links in the MDM Registration page content, and add the download sites to Allowed Domains',
      'Enable On Demand Registration on the MDM connector, which redirects unenrolled phones to the MDM enrollment site automatically',
      'Create a device profiling rule with the Vendor OUI method for each phone vendor and register matches as devices so they can reach the app stores',
      'Enable Revalidate Health Status On Connect so unenrolled phones are moved to the production VLAN long enough to download the agent',
    ],
    answer: [0],
    explanation: "The portal's **MDM Registration** setting (Global) sends browsers with mobile user agents to the **MDM Registration** portal page, whose content should link to the MDM agent downloads. Isolated hosts can only reach **Allowed Domains**, so the download sites must be listed there (no `*` wildcards; a parent domain covers its subdomains). On Demand Registration only registers devices the MDM already knows. Registering unknown phones by OUI would bypass the control you want. Revalidate Health Status checks compliance of known hosts and grants no temporary access.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-037',
    topic: '3.4',
    type: 'match',
    difficulty: 1,
    stem: 'Match each MDM event to its meaning.',
    pairs: [
      ['MDM Host Created', 'A host was added to the database from the MDM import'],
      ['MDM Host Destroyed', 'A host was deleted because it was removed or disabled in the MDM'],
      ['MDM Poll Failure', 'The poll of the MDM server did not complete'],
      ['MDM Host Compliance Failed', 'The host failed the MDM compliance check'],
    ],
    explanation: "These events can be enabled and mapped to alarms like any other event, for example emailing the mobility team on **MDM Poll Failure** or marking a host At Risk on **MDM Host Compliance Failed**. **MDM Host Destroyed** depends on **Remove Hosts Deleted from MDM Server** being enabled on the connector.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-038',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator adds vendor OUI entries for a new card reader vendor and a device profiling rule that uses them. Twenty card readers are already online as rogues and are not classified. What should the administrator do to classify them without reconnecting them?',
    options: [
      'In Users & Hosts > Device Profiling Rules, click Run to evaluate the current rogues against the enabled rules',
      'Run the AutoDef Synchronization task, which re-profiles every host in the database',
      'Enable Confirm Device Rule On Interval on the new rule, which also profiles rogues that were online before the rule existed',
      'Delete the vendor OUI entries and add them again, which raises a Vendor OUI Added event that triggers profiling',
    ],
    answer: [0],
    explanation: "**Run** in Device Profiling Rules re-evaluates rogue hosts against the enabled rules. Only hosts that are still unregistered and online are evaluated. AutoDef Synchronization updates definitions such as the vendor OUI database; it doesn't classify hosts. Confirm Device Rule On Interval rechecks devices **already profiled** by the rule. Vendor OUI Added is just an event and doesn't start profiling.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-039',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A camera whose MAC OUI is recorded with the alias IP Camera connects and gets an address by DHCP. Its DHCP fingerprint matches the rule, but its RTSP service has been moved to TCP 8554. What happens?',
    exhibit: String.raw`Users & Hosts > Device Profiling Rules > CAM-Rule
  General:  Enabled  Registration Automatic  Register as Device in Host View
            Add to Group IP Cameras
  Methods:
    [x] Vendor OUI ............ Vendor Alias = IP Camera
    [x] DHCP Fingerprinting ... (matches this camera model's fingerprint)
    [x] TCP ................... 554
    [ ] FortiGuard IoT`,
    options: [
      'It does not match CAM-Rule, because every selected method must match, and it remains a rogue unless a later rule matches',
      'It matches CAM-Rule, because two of the three selected methods matched',
      'It matches CAM-Rule, because the Vendor OUI method alone is enough when the vendor alias is set',
      'It matches CAM-Rule but is registered with Registration set to Manual, because one method failed',
    ],
    answer: [0],
    explanation: "Device profiling requires the device to meet the criteria of **all** selected methods in a rule. The TCP method fails (554 isn't open), so CAM-Rule doesn't match. The rogue continues to the next enabled rules and stays a rogue if none match. There is no majority voting or OUI-only shortcut, and a failed method never changes the rule's registration mode.",
    lesson: '3.4-mdm-oui-profiling',
  },
  {
    id: 'd3-040',
    topic: '3.4',
    type: 'fill',
    difficulty: 1,
    stem: 'Which FortiNAC-F scheduled task automatically updates the vendor OUI database with new IEEE assignments?',
    answer: ['AutoDef Synchronization', 'AutoDef Synchronizer', 'AutoDef Sync', 'Auto-Def Synchronization', 'AutoDef'],
    explanation: "The **AutoDef Synchronization** scheduled task keeps the vendor OUI database (and other auto-definitions) current, which prevents invalid-physical-address problems when new hardware appears. Entries can also be added by hand under System > Settings > Identification > Vendor OUIs.",
    lesson: '3.4-mdm-oui-profiling',
  },
];
