// Domain 2 questions, part A: topics 2.1 and 2.2 (FortiNAC-F 7.6). Original items. Imported by questions.js.
export default [
  {
    id: 'd2-001', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. FortiAnalyzer forwards FortiGate AV logs to FNAC-CA1. The packet capture shows the messages arriving, but nothing appears under Logs > Security Incidents > Events. Which configuration is missing?',
    exhibit: `FNAC-CA1 # execute tcpdump -i=port1 -c=1 port 514
IP 10.0.20.15.40112 > 10.0.1.21.514: SYSLOG local7.warning, length: 1108

Network > Inventory > Datacenter
Name          IP Address   Device Type  Incoming Events
FAZ-DC1       10.0.20.15   Firewall     None

System > Settings > System Communication > Security Event Parsers
Name         Enabled  Vendor   Format     CSV Delimiter
FAZ-AV       Yes      Fortinet TAG/VALUE  -`,
    options: ['Set Incoming Events on the FAZ-DC1 model to Security Events and select the FAZ-AV parser', 'Change the parser format to CEF, because FortiAnalyzer only sends CEF to FortiNAC-F', 'Add a security rule; events are only listed after a rule matches them', 'Add nac-ipc to the port1 allowaccess list'],
    answer: [0],
    explanation: 'Packets reach port1, so the path and `allowaccess syslog` are fine. The device that sends the syslog must be modeled with **Incoming Events = Security Events** and the parser selected; FAZ-DC1 shows None. FortiGate/FortiAnalyzer logs are key=value text, so TAG/VALUE suits them. Rules decide **alarms**, not whether events are listed. `nac-ipc` is for HA/inter-appliance traffic, not syslog.',
    lesson: '2.1-security-event-integration',
  },
  {
    id: 'd2-002', topic: '2.1', type: 'single', difficulty: 1,
    stem: 'Where does an administrator create a custom security event parser in FortiNAC-F 7.6?',
    options: ['System > Settings > System Communication > Security Event Parsers', 'Logs > Security Incidents > Triggers', 'Network > Service Connectors > Security Fabric Connection', 'Policy & Objects > Security Rules'],
    answer: [0],
    explanation: 'Parsers live under **System > Settings > System Communication > Security Event Parsers**. Triggers, rules and actions are under Logs > Security Incidents. Service Connectors is where FortiNAC-F joins the Security Fabric. There is no Policy & Objects > Security Rules menu.',
    lesson: '2.1-security-event-integration',
  },
  {
    id: 'd2-003', topic: '2.1', type: 'multi', difficulty: 2,
    stem: 'Which three message formats can a FortiNAC-F security event parser use? (Choose three.)',
    options: ['CSV', 'TAG/VALUE', 'CEF', 'JSON', 'XML', 'LEEF'],
    answer: [0, 1, 2],
    explanation: 'The supported formats are **CSV** (delimited fields), **TAG/VALUE** (`cip=192.0.2.10`) and **CEF** (fixed header plus tag/value extensions). JSON, XML and LEEF are not parser formats in the 7.6 guide.',
    lesson: '2.1-security-event-integration',
  },
  {
    id: 'd2-004', topic: '2.1', type: 'fill', difficulty: 2,
    stem: 'A FortiNAC-OS appliance must accept security event syslog on port1. Which `allowaccess` keyword must be present on port1? (one word)',
    answer: ['syslog'],
    explanation: 'The parser documentation states the FortiNAC-OS requirement: the **`syslog`** option must be in `set allowaccess`. Add it with `append allowaccess syslog` or by re-entering the full `set allowaccess` list.',
    lesson: '2.1-security-event-integration',
  },
  {
    id: 'd2-005', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'An administrator wants to check that a newly built parser reads a vendor message correctly before any device uses it. What should they do?',
    options: ['Right-click the parser and use Test, pasting a received syslog message', 'Enable the parser and wait for an alarm to appear', 'Run diagnose debug plugin enable SecurityParser and tail output.master', 'Create a security rule with an automatic Disable Host action and generate an event'],
    answer: [0],
    explanation: 'The parser view has a **Test** option that parses a pasted syslog message. Alarms only appear when a rule matches, so waiting proves little. The plugin name in that diagnose command is invented. Automatically disabling hosts while testing a parser is the opposite of the documented cautious approach.',
    lesson: '2.1-security-event-integration',
  },
  {
    id: 'd2-006', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. An AV event from host 10.0.10.25 satisfies trigger FGT-AV. The host is a member of the Contractors profile and is not a data center server. Which rule creates the security alarm?',
    exhibit: `Logs > Security Incidents > Rules
Rank  Name                 Enabled  Trigger  Host Profile              Action
1     DC-Servers-Notify    Yes      FGT-AV   = Data Center Servers     Notify-SOC (Manual)
2     Contractor-Disable   No       FGT-AV   = Contractors             Disable-60min (Automatic)
3     NonMedical-Remediate Yes      FGT-AV   ≠ Medical Devices         Mark-At-Risk (Automatic)
4     Catch-All-Log        Yes      FGT-AV   None                      None`,
    options: ['NonMedical-Remediate', 'Contractor-Disable', 'DC-Servers-Notify', 'Catch-All-Log'],
    answer: [0],
    explanation: 'Rules are evaluated by rank and the first **enabled** rule whose profile test passes creates the alarm. Rank 1 needs the Data Center Servers profile (no match). Rank 2 is **disabled**. Rank 3 requires the host **not** to match Medical Devices, which is true, so it matches and the host is marked at risk. Rank 4 is never reached.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-007', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'A trigger has four security filters, Filter Match set to Any with a minimum of 2, and a Time Limit of 30 minutes. When is the trigger satisfied?',
    options: ['When events matching at least two of the four filters occur within 30 minutes', 'When events matching any one filter occur twice within 30 minutes', 'When all four filters are matched within 30 minutes', 'When the first matching event is at least 30 minutes old'],
    answer: [0],
    explanation: '**Any** sets a *minimum number of filters* that must be matched; **All** requires every filter. The Time Limit is the window in which the events must satisfy the filters. How often a single event must repeat is the per-filter **Frequency**, not Filter Match.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-008', topic: '2.1', type: 'single', difficulty: 1,
    stem: 'A security event satisfies a trigger, but no security rule using that trigger matches the host. What does FortiNAC-F do?',
    options: ['It creates no security alarm', 'It creates an alarm with no action', 'It runs the action of the highest-ranked rule anyway', 'It disables the host until an administrator reviews it'],
    answer: [0],
    explanation: 'The documentation is explicit: the alarm is created by the first rule that also matches its optional user/host profile, and **if no rule matches, no alarm is created**. No action runs.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-009', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. The Disable Host activity succeeds but the Email Group activity fails. What happens next?',
    exhibit: `Logs > Security Incidents > Actions > Modify: Contain-Host
On Activity Failure:         Stop Running Activities
Perform Secondary Tasks After: [x] 60 minutes
Rank  Activity                       Secondary Task
1     Disable Host                   [x] Enable host
2     Email Group Action (SOC)       -
3     Send Message to Desktop        -`,
    options: ['Send Message to Desktop is not run; the host is re-enabled automatically after 60 minutes', 'Send Message to Desktop still runs; the host stays disabled until an administrator enables it', 'All activities are rolled back immediately, so the host is re-enabled', 'Send Message to Desktop is not run and the host stays disabled until an administrator enables it'],
    answer: [0],
    explanation: 'With **Stop Running Activities**, no lower-ranked activity runs after a higher-ranked one fails, so the desktop message is skipped. Disable Host already ran, and because **Perform Secondary Tasks After** is enabled with the activity\'s secondary task checked, the host is re-enabled automatically after 60 minutes. A failure does not roll back earlier activities.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-010', topic: '2.1', type: 'match', difficulty: 2,
    stem: 'Match each security rule setting to what it controls.',
    pairs: [
      ['Rule Match Email Group', 'Admin group emailed when the rule creates an alarm'],
      ['Action Taken Email Group', 'Admin group emailed when the associated action runs'],
      ['User/Host Profile with ≠', 'The host must not match the selected profile'],
      ['Action set to Manual', 'The alarm is created and an administrator runs the action'],
    ],
    explanation: 'Rule Match = alarm created; Action Taken = action executed. The = / ≠ selector decides whether the host must or must not match the profile. A manual action is associated with the alarm but only runs when an administrator starts it.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-011', topic: '2.1', type: 'order', difficulty: 2,
    stem: 'Put the documented security-rule validation steps in order.',
    items: ['Confirm security events from the device appear under Logs > Security Incidents > Events', 'Create a trigger from fields seen in a real event', 'Create a rule with profile and action set to None and Send Email when Rule is Matched enabled', 'Generate a test event (for example EICAR) and confirm the alarm and the email', 'Add the user/host profile and an automatic action and test again'],
    explanation: 'Prove events arrive, build the trigger from real fields, create a notify-only rule, generate a test event and confirm the alarm and email, then automate. Automating before the notify-only test risks disabling the wrong hosts.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-012', topic: '2.1', type: 'multi', difficulty: 2,
    stem: 'Which two activities can be configured with a secondary task that undoes them after the Secondary Task Delay? (Choose two.)',
    options: ['Disable Host', 'Mark Host At Risk', 'Email Group Action', 'Send Alarm to External Log Hosts', 'Send Message to Desktop'],
    answer: [0, 1],
    explanation: '**Disable Host** (secondary task: enable the host) and **Mark Host At Risk** (secondary task: mark safe) offer secondary tasks, as do Disable Port, Mark Host Safe and Host Role Action. Notifications and forwarding activities have nothing to undo.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-013', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'An administrator re-enables a host in Users & Hosts > Hosts. The host had been disabled by a security alarm action. What does FortiNAC-F offer?',
    options: ['To undo the security alarm, which also undoes its actions, or to enable the host and keep the alarm', 'Nothing; the host is enabled and the alarm is deleted', 'To re-run the security rule against the host', 'To convert the host to a device so the rule no longer applies'],
    answer: [0],
    explanation: 'With Security Incidents enabled, enabling a host disabled by a security alarm asks whether to **undo the alarm** (undoing its actions and running enabled secondary tasks) or to enable the host while leaving the alarm and its actions in place.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-014', topic: '2.1', type: 'single', difficulty: 3,
    stem: 'Refer to the exhibit. An administrator edited trigger FGT-AV from inside the Contractor-Disable rule to add a Severity filter. What is the effect?',
    exhibit: `Logs > Security Incidents > Triggers
Name     Time Limit  Filter Match  Total Filters  In use by
FGT-AV   5 min       All           2              3 rules`,
    options: ['All three rules that use FGT-AV now require the new Severity filter', 'Only Contractor-Disable uses the changed trigger; the other two keep a copy of the old one', 'The change is rejected because the trigger is in use', 'The other two rules are disabled until they are re-saved'],
    answer: [0],
    explanation: 'A trigger is a shared object. Modifying it from a rule modifies it **for all security rules that use it**. Use Copy to create a separate trigger when only one rule should change. In-use triggers can be edited; it is deletion of in-use objects that is blocked.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-015', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'FGT-HQ is connected to FortiNAC-F through the Security Fabric. A FortiGate automation stitch uses the Quarantine via FortiNAC action with a Compromised Host trigger. What happens in FortiNAC-F when the stitch runs?',
    options: ['The client\'s MAC address is disabled', 'The client is moved to the Contractor logical network', 'A security rule is created for the client', 'The client\'s host record is deleted'],
    answer: [0],
    explanation: 'The Security Fabric Connection page says the client PC is quarantined and **its MAC address is disabled** in FortiNAC-F, which then isolates it at the access layer. No rule or logical network change is involved, and the record is not deleted.',
    lesson: '2.1-security-rules-actions',
  },
  {
    id: 'd2-016', topic: '2.1', type: 'single', difficulty: 2,
    stem: 'A company has not purchased the Security Incidents licence. Which statement is true?',
    options: ['The Security Incidents features (security events, rules, triggers and actions) are not accessible', 'Security rules work, but only with manual actions', 'Security events are parsed but cannot be mapped to user/host profiles', 'Only the CEF parser format is available'],
    answer: [0],
    explanation: 'Without the Security Incidents licence the administrator cannot access the Security Incidents features. There is no reduced mode with manual-only actions or a single format.',
    lesson: '2.1-security-event-integration',
  },
  {
    id: 'd2-017', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A registered laptop fails an endpoint compliance scan and is marked at risk. It also matches network access policy Corp-Users (logical network Corp). Which treatment does it get on its next connection to an enforced port?',
    exhibit: `Users & Hosts > Hosts > PC-22 (tooltip)
Status:        Registered, At Risk (failed scan Corp-AV)
Registered to: jdoe
Policy Details > Network Access: Corp-Users / Corp Config / logical network Corp`,
    options: ['Remediation (quarantine) isolation until it passes the scan', 'The Corp VLAN, because network access policies take precedence over host state', 'Dead End, because at-risk hosts are disabled', 'Registration isolation, because the host loses its registration'],
    answer: [0],
    explanation: 'Host state takes precedence over policy. An **at-risk** host goes to **remediation/quarantine** isolation (Forced Remediation). Dead End is for **disabled** hosts; registration isolation is for **rogues**. The policy applies again once the host is safe.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-018', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. Policy Details for a registered host shows the expected policy and VLAN 30, but the switch port stays in VLAN 10. What is the most likely cause?',
    exhibit: `Policy Details > Network Access
Profile Name:        Finance Users
Policy Name:         Finance
Configuration Name:  Finance Config
Access Value/VLAN:   30

Port Cisco-Access1 Gi1/0/14 group membership:
  Forced Registration`,
    options: ['The port is not in the Role-Based Access group, so FortiNAC-F does not switch it for registered hosts', 'The host must be re-registered before policies apply', 'Policy Details is wrong because it ignores the When condition', 'Forced Registration overrides network access policies for all hosts'],
    answer: [0],
    explanation: 'Network access policies are enforced on ports in **Role-Based Access**. This port only has Forced Registration, which isolates rogues but does not move registered hosts to policy VLANs. The host is already registered, Policy Details evaluates the profile including time, and Forced Registration only affects unregistered hosts.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-019', topic: '2.2', type: 'match', difficulty: 2,
    stem: 'Match each enforcement function to the condition that sends a host to isolation (or, for role-based access, to a policy VLAN).',
    pairs: [
      ['Forced Authentication', 'The user is not authenticated'],
      ['Forced Registration', 'The device is unknown (rogue)'],
      ['Forced Remediation', 'The device failed a compliance scan'],
      ['Physical Address Filtering', 'The device is disabled'],
      ['Role-Based Access', 'A known device gets the VLAN from a policy or device role'],
    ],
    explanation: 'These are the enforcement groups described in Fortinet\'s Enforcement Groups guide; in 7.6.7 the same functions appear as State Based Access Control Rule membership actions.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-020', topic: '2.2', type: 'multi', difficulty: 3,
    stem: 'An administrator opens Network > Configuration > State Based Access Control Rules on FortiNAC-F 7.6.7. Which two statements are true? (Choose two.)',
    options: ['The table has six predefined entries, one per membership action', 'An entry cannot be saved without at least one condition', 'Administrators can create new custom states for each building', 'Each entry is applied to a device by a network access policy', 'Conditions can only test RADIUS attributes'],
    answer: [0, 1],
    explanation: 'In 7.6.7 there are **six predefined membership actions**, they can be edited but **no new states** can be created, and an entry needs **at least one condition**. Conditions can be RADIUS, Device, Container or Port and SSID types. Network access policies are unrelated to applying these rules.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-021', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit (wireless controller model configuration). What happens to an unregistered host that joins an SSID on this controller?',
    exhibit: `Host State     Access Enforcement  Access Value
Default        Enforce             10
Dead End       Enforce             120
Registration   Bypass              -
Quarantine     Enforce             110
Authentication Deny               -`,
    options: ['It is admitted on the default VLAN or role configured on the controller for that SSID', 'It is placed in VLAN 100 for registration', 'Its connection is rejected', 'It is placed in VLAN 10'],
    answer: [0],
    explanation: '**Bypass** lets the host on in the default VLAN/role configured *on the device* for that port or SSID, so there is no registration isolation. Enforce would use the Access Value; Deny rejects the connection. VLAN 10 is FortiNAC-F\'s Default value used for the Default state, not what Bypass means.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-022', topic: '2.2', type: 'fill', difficulty: 2,
    stem: 'FortiNAC-F sends RFC 5176 CoA and Disconnect messages to a NAS. What is the default UDP destination port? (number)',
    answer: ['3799'],
    explanation: 'RFC 5176 dynamic authorization uses **UDP 3799** by default; the model configuration\'s RFC5176 Port defaults to 3799.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-023', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'How does FortiNAC-F provision network access for an endpoint connected to a FortiGate wired (non-FortiSwitch) interface?',
    options: ['By applying a FortiGate firewall policy to the session using the group or tag FortiNAC-F sends; no VLAN is assigned', 'By changing the interface VLAN with SNMP set', 'By sending a CoA with a Tunnel-Private-Group-ID', 'By pushing a CLI configuration that moves the interface to a new zone'],
    answer: [0],
    explanation: 'The FortiGate endpoint management integration guide states that wired interfaces are controlled by applying a firewall policy to the device\'s session and **VLANs are not assigned**. VLAN assignment over RADIUS applies to FortiWiFi/FortiAP wireless clients.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-024', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Which FortiNAC-F CLI command moves port5 of the modeled switch 10.0.30.11 to VLAN 100 for a test?',
    options: ['diagnose network vlan change 10.0.30.11 port5 100', 'execute vlan set ip=10.0.30.11 port5 100', 'diagnose network device display ip=10.0.30.11 vlan=100', 'config system interface / edit port5 / set vlanid 100'],
    answer: [0],
    explanation: 'The CLI Reference lists `diagnose network vlan change <ip> <port> <vlan>`. `diagnose network device display` only shows device information, the `execute vlan` command does not exist, and `config system interface` configures the FortiNAC-F appliance\'s own interfaces.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-025', topic: '2.2', type: 'multi', difficulty: 2,
    stem: 'A CLI configuration is applied host-based. Which two substitution variables can its Undo section use? (Choose two.)',
    options: ['%ip%', '%mac%', '%port%', '%vlan%', '%user%'],
    answer: [0, 1],
    explanation: 'The substitution table allows **%ip%** and **%mac%** in Host Based UNDO, while %port% and %vlan% are not available there (they are in Host Based DO). %user% is not a substitution variable.',
    lesson: '2.2-access-control-enforcement',
  },
  {
    id: 'd2-026', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A rogue host record exists for a lab server. The administrator wants it to stop being isolated, to keep its connection history and to remain associable with a user, without adding it to the Inventory. Which Register As Device option should be used?',
    exhibit: `Users & Hosts > Hosts
Status  Host Name   IP Address   Physical Address     Registered To
Rogue   LAB-SRV-04  10.0.60.14   00:09:0F:21:6B:04    -`,
    options: ['Create In: Host View', 'Create In: Device in Topology', 'Create In: Host View and Topology, so the device is tracked in both views', 'Register As Host to the administrator account'],
    answer: [0],
    explanation: '**Host View** keeps connection history and user association. Device in Topology moves it to Inventory (pollable) and removes it from the Hosts view. Host View and Topology also keeps history and user association, but it adds the device to the Inventory, which the stem rules out. Registering it as a host to an admin misrepresents ownership.',
    lesson: '2.2-host-inventory-portals',
  },
  {
    id: 'd2-027', topic: '2.2', type: 'single', difficulty: 3,
    stem: 'A printer is registered with Create In set to Host View and Topology. Which limitation applies?',
    options: ['It cannot be polled for contact status', 'It cannot be associated with a user', 'Its connection history is lost', 'It no longer counts against the endpoint licence'],
    answer: [0],
    explanation: 'Host View and Topology keeps history and user association, but the guide notes the device **cannot be polled**. Only Device in Topology is pollable. Registered online devices still consume licences.',
    lesson: '2.2-host-inventory-portals',
  },
  {
    id: 'd2-028', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'How can an administrator check which network access policy a registered host would receive if it connected in Building B on Sunday, without connecting it there?',
    options: ['Open Policy Details for the host, click Edit Test and enter the location and date/time in the policy simulator', 'Run diagnose host list mac=<mac> -adapters', 'Move the host to the Building B port group and wait for the next L2 poll', 'Open Logs > Security Incidents > Alarms'],
    answer: [0],
    explanation: 'Policy Details shows what applies **now**; **Edit Test** opens the **policy simulator**, where adapter, user, host and date/time data can be entered to see which policy and profile would match. `diagnose host list` shows the record, not a what-if evaluation.',
    lesson: '2.2-host-inventory-portals',
  },
  {
    id: 'd2-029', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. Which user/host profile criterion can reliably select the portal for these hosts?',
    exhibit: `Policy & Objects > Portal Policy
Rank  Name             User/Host Profile        Portal Configuration
1     Lobby-Guests     Lobby Ports              RegistrationPortal
2     Corp-Wired       ?                        RestrictedPortal
Default portal: Portal`,
    options: ['Location (a port or SSID group)', 'Membership in a directory user group', 'The registered owner\'s role', 'The logged-on user\'s department attribute'],
    answer: [0],
    explanation: 'Portal policies apply to unregistered hosts, about which FortiNAC-F knows little and nothing about the user. The guide limits useful criteria to **location, IP address, MAC address or operating system**. User groups, owner role and user attributes are unknown at that point.',
    lesson: '2.2-host-inventory-portals',
  },
  {
    id: 'd2-030', topic: '2.2', type: 'single', difficulty: 1,
    stem: 'A connecting host matches no portal policy. Which portal does it see?',
    options: ['The default portal', 'RestrictedPortal', 'No portal; the host is denied', 'The portal of the lowest-ranked portal policy'],
    answer: [0],
    explanation: 'If no portal policy matches, FortiNAC-F uses the administrator-selected **default portal**.',
    lesson: '2.2-host-inventory-portals',
  },
  {
    id: 'd2-031', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Refer to the exhibit. A camera matching policy IP Camera Policy (logical network Cameras) connects to Cisco-Access1 and to FSW-Access1 on different days. Which VLANs does it get?',
    exhibit: `Model Configuration (logical network access values)
Logical network   FSW-Access1   Cisco-Access1
Default           10            10
Registration      100           100
Cameras           40            140
Contractor        50            (blank)`,
    options: ['VLAN 140 on Cisco-Access1 and VLAN 40 on FSW-Access1', 'VLAN 40 on both switches', 'VLAN 140 on both switches', 'VLAN 10 on both, because logical networks only apply to FortiGate'],
    answer: [0],
    explanation: 'A logical network is translated into each device\'s own **access value**. Cameras means 140 on Cisco-Access1 and 40 on FSW-Access1. That per-device translation is the whole point of logical networks; they are not FortiGate-only.',
    lesson: '2.2-logical-networks',
  },
  {
    id: 'd2-032', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'An administrator tries to delete the logical network Contractor and the deletion fails. What is the most likely reason?',
    options: ['The logical network is in use, for example by a network access configuration', 'Logical networks can only be deleted from FortiNAC-F Manager', 'Logical networks are read-only once created', 'The Contractor name is reserved'],
    answer: [0],
    explanation: 'A logical network that is **in use** cannot be deleted; the In Use option shows where it is referenced. Logical networks can be created, modified and deleted on the CA, and Contractor is not a reserved name.',
    lesson: '2.2-logical-networks',
  },
  {
    id: 'd2-033', topic: '2.2', type: 'single', difficulty: 2,
    stem: 'Printers are registered as devices in Topology (Inventory). Which feature assigns them a VLAN by role and connection location?',
    options: ['Network device roles', 'Network access policies', 'Portal policies', 'Supplicant EasyConnect policies'],
    answer: [0],
    explanation: '**Network device roles** map a device role plus a location (port or device groups) to an access value and optional CLI, and apply to hosts managed in Inventory and devices. Network access policies are for registered hosts in the Hosts view.',
    lesson: '2.2-logical-networks',
  },
  {
    id: 'd2-034', topic: '2.2', type: 'fill', difficulty: 3,
    stem: 'In a network access configuration, the "Access Value is an alias" option is supported for which two device vendors? (Answer as "X and Y")',
    answer: ['Cisco and Brocade', 'Brocade and Cisco'],
    explanation: 'The guide limits the alias option to **Cisco and Brocade** devices. Logical networks are the vendor-independent way to map one name to different VLANs per device.',
    lesson: '2.2-logical-networks',
  },
];
