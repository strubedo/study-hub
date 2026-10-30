// Domain 4 — Network visibility and monitoring question bank (original, exam-style). FortiNAC-F 7.6.
// CLI output that could not be verified character for character is shown as a labelled summary, not a fake capture.
export default [
  // ---------- 4.1 Guests and contractors ----------
  {
    id: 'd4-001',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A sponsor created a guest account, and the guest registered a laptop. What happens when the host's expiration date is reached?",
    exhibit: `Users & Hosts > User Accounts > visitor7@example.net > Guest Account Details
  Account Type ......... Guest
  Sponsor .............. sponsor1
  End Date ............. 2026/11/06 18:00

Users & Hosts > Hosts > VISITOR7-LT > Host Properties
  Registered to ........ visitor7@example.net
  Expiration Date ...... 2026/11/03 09:12   (set from global aging for registered hosts)`,
    options: [
      "Only the host record is removed; the guest user account stays valid until 2026/11/06 18:00",
      "Both the host record and the guest user account are removed, because the host and its owner always expire together",
      "Nothing happens until 2026/11/06 18:00, because a guest's host always inherits the guest user's end date",
      "The host is marked At Risk for the Guest No Access admin scan until the guest account expires",
    ],
    answer: [0],
    explanation: "The guest user's expiration comes from the account end date (and the template's Account Duration), while the guest's registered host inherits the **global aging setting for registered hosts**. When the **user** expires, the user and the host are both removed; when the **host** expires first, only the host is removed and the guest account remains. The host doesn't inherit the user's end date, and Guest No Access marking is driven by the template's Login Availability, not by aging.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-002',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. An administrator assigns this administrator profile to the receptionist account sponsor1. Which two statements about sponsor1 are true? (Choose two.)",
    exhibit: `Users & Hosts > Administrators > Profiles > Lobby-Sponsor
Permissions: Guest/Contractor Accounts (Custom)
Manage Guests tab
  Guest Account Access ................. Own Accounts
  Account Types ........................ Individual, Bulk
  Create Accounts Days in Advance ...... 7
  Create Accounts Active For Days ...... 5
  Can View Passwords ................... disabled
  Allowed Templates .................... Specify Templates
  Selected Templates ................... Visitor-1day`,
    options: [
      "sponsor1 can modify or delete accounts that sponsor1 created, but not accounts created by other sponsors",
      "sponsor1 cannot create an account whose end date is more than 5 days after its start date",
      "sponsor1 can create conference accounts as long as the Visitor-1day template is used",
      "sponsor1 can read each generated password on the View Accounts screen and print it",
      "sponsor1 can create accounts from any contractor template because contractors are not limited by Allowed Templates",
      "sponsor1 can also log in to the lobby kiosk PC to run guest self-service",
    ],
    answer: [0, 1],
    explanation: "**Own Accounts** lets a sponsor see, send credentials for, modify and delete only the accounts they created (No = no modify/delete, All Accounts = everyone's). **Create Accounts Active For Days (Maximum)** caps the end date relative to the start date. Conference isn't in Account Types, so conference accounts are not offered. **Can View Passwords** disabled means the operator never sees generated passwords (guests still get them by email or SMS). Allowed Templates restricts every template type, so only Visitor-1day is usable. Kiosk use needs a separate profile with Enable Guest Kiosk.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-003',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Every morning a receptionist must start the self-service guest page on the lobby kiosk PC. During the day the same receptionist creates contractor accounts for arriving contractors. How should the administrator set this up?",
    options: [
      "Create two administrator accounts for the receptionist: one with a guest kiosk profile and one with a guest manager profile",
      "Create one profile with Enable Guest Kiosk selected and the Guest/Contractor Accounts permission set added",
      "Create one guest self registration profile, because it includes kiosk mode and account creation",
      "Create one guest manager profile with Guest Account Access set to All Accounts, which unlocks kiosk mode",
    ],
    answer: [0],
    explanation: "A profile with **Enable Guest Kiosk** disables every other option: that user can only log in to the kiosk PC to display the guest page and can't create accounts. Someone who also creates guest or contractor accounts needs a **second login** with a guest manager profile. A self-registration profile only processes self-registration requests, and Guest Account Access has nothing to do with kiosk mode.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-004',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A visitor says they requested access from the guest portal on their phone and never got credentials. What explains the state of the request?",
    exhibit: `Users & Hosts > Registration Requests (filter: MAC Address = 00:09:0F:7C:41:0E)
State     Request Date        Expiration Date     Request Approver              Location
Expired   2026/10/30 09:02    2026/10/30 09:22    facilities@corp.example.com   FAP-Floor2

Portal > Portal Configuration > Registration > Self Registration Login
  Require Sponsor Approval ............ Any Administrator
  Guest Request Expiration (minutes) .. 20`,
    options: [
      "The sponsor did not approve or deny the request within the Guest Request Expiration time, so it expired and the visitor must submit a new request",
      "The sponsor denied the request, and FortiNAC-F records a denied request as Expired",
      "The self-registered guest template has no Account Duration, so the account expired as soon as it was created",
      "The phone was already registered, so FortiNAC-F expired the duplicate request",
    ],
    answer: [0],
    explanation: "A self-registration request waits for a sponsor for the **Guest Request Expiration (minutes)** set in the portal (default 20). Request and expiration dates 20 minutes apart with State **Expired** means nobody answered in time. Denied requests show **Denied** (the states are Accepted, Canceled, Denied, Error, Expired, Pending). The self-registered guest template must have an Account Duration, but that governs the account after approval, not the request. A registered host wouldn't be sent to the registration portal in the first place.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-005',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "By default, how many minutes does a guest self-registration request wait for a sponsor before it expires? (Enter a number.)",
    answer: ['20', '20 minutes'],
    explanation: "The portal setting **Guest Request Expiration (minutes)** under Registration > Self Registration Login defaults to **20**. After that the sponsor can no longer approve it and the request shows as Expired in Users & Hosts > Registration Requests.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-006',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A sponsor wants to create contractor accounts in bulk from a file and supply the passwords. Which change makes the file meet FortiNAC-F's bulk import requirements?",
    exhibit: `Add Account > Bulk Accounts
  Template .............. Contractor-90d
  Import Passwords ...... enabled
  Fields for this template: First Name, Last Name, Email, Phone

contractors.csv
Pk7-mqz-41,Dana,Ruiz,druiz@vendor.example,555-0141
Hw3-tbn-88,Omar,Haddad,ohaddad@vendor.example,555-0187`,
    options: [
      "Move each password to the last field of its record",
      "Add a first line with the field names First Name,Last Name,Email,Phone,Password",
      "Remove the email addresses, because guest manager generates the user names",
      "Disable Import Passwords and leave the file unchanged",
    ],
    answer: [0],
    explanation: "Bulk guest import files have **no header row**, a comma for every field, a line break after each record and a mandatory **email**. With **Import Passwords** enabled, the password is mandatory and must be the **last** field of every row. Adding a header row breaks the format, email is the one field that must be present, and disabling Import Passwords would leave the passwords sitting in the First Name position.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-007',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "A guest template has Account Duration set to 24 hours. A sponsor uses it to create an account whose Account End Date is one week away. How does FortiNAC-F decide when the account is removed from the database?",
    options: [
      "The two limits work together and the shorter one applies, so the 24-hour Account Duration removes the account before the end date",
      "The longer limit applies, so the account stays for the full week",
      "The Account End Date always wins, because Account Duration only applies to conference templates",
      "Account Duration only limits daily login hours; the account is removed at the end date",
    ],
    answer: [0],
    explanation: "The guide is explicit: the template's **Account Duration** and the account's **Account End Date** work together and **the shorter of the two** removes the guest account from the database. Duration applies to guest and contractor templates (and is mandatory for self-registered guest templates). Daily access windows are a separate setting, **Login Availability**.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-008',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "An administrator prepares accounts for a two-day partner conference. Which two statements about FortiNAC-F conference accounts are true? (Choose two.)",
    options: [
      "Conference accounts authenticate locally only; LDAP and RADIUS are not available for them",
      "After creation, the only change that can be made to a conference account is resetting passwords",
      "Credentials are emailed to every attendee automatically when the conference accounts are created",
      "The conference name can be changed later with Modify, and the attendee user names update to match",
      "A conference template can use LDAP so attendees log in with corporate directory credentials",
    ],
    answer: [0, 1],
    explanation: "For conference accounts **authentication is Local only**, and the **only** change possible after creation is a password reset; anything else means deleting the accounts and creating new ones. The conference name becomes the attendee user name and can't be modified. Email and SMS can't be sent to attendees until an email address or mobile number is added to each user record, so nothing is emailed automatically at creation.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-009',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. How does FortiNAC-F restrict this contractor's host outside the allowed hours?",
    exhibit: `Template Contractor-Day
  Visitor Type ......... Contractor
  Role ................. Contractor
  Login Availability ... Specify Time: Mon-Fri 07:00-19:00

Contractor laptop CTR-LT14 connects on Tuesday at 20:30. The browser shows:
  "Your network access has been disabled. You are outside of your allowed time window. ..."`,
    options: [
      "FortiNAC-F marks the host At Risk for the Guest No Access admin scan, so the host is treated as at risk and isolated until the window opens",
      "FortiNAC-F disables the contractor's user account at 19:00 and re-enables it at 07:00",
      "FortiNAC-F deletes the host record at 19:00 so the laptop returns as a rogue",
      "FortiNAC-F sends a firewall tag to FortiGate that blocks the contractor's IP address outside the window",
    ],
    answer: [0],
    explanation: "Login Availability is enforced through the **Guest No Access** admin scan: outside the window the guest or contractor host is marked **At Risk**, and the At Risk state is removed when the window opens. That's why the feature needs a quarantine/remediation VLAN and the related configuration. The user account isn't disabled, the host isn't deleted (that's what the F 7.6.7 Re-registration Period does), and no FortiGate integration is involved.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-010',
    topic: '4.1',
    type: 'multi',
    difficulty: 3,
    stem: "An administrator wants guest templates with time-of-day Login Availability to be enforced on wired and wireless guests. Which three items are required? (Choose three.)",
    options: [
      "A quarantine or remediation VLAN on the network, with the quarantine VLAN option enabled in the FortiNAC-F settings",
      "Wired ports that guests use placed in the Forced Remediation group",
      "A quarantine VLAN entry in the model configuration of every switch and access point that guests connect to",
      "The Persistent Agent installed on each guest host",
      "Firewall session polling enabled on the FortiGate in front of the guest network",
      "LDAP as the authentication method in the guest template",
    ],
    answer: [0, 1, 2],
    explanation: "Because restricted hours are enforced by marking the host **At Risk** (Guest No Access scan), FortiNAC-F must be able to move it to quarantine: you need a **quarantine/remediation VLAN** with the option enabled, guest wired ports in **Forced Remediation**, and a **quarantine VLAN entry in the model configuration** of each switch and AP. No agent is needed (the state is set on the host record), session polling is unrelated, and the authentication method doesn't matter.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-011',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Contractor hosts are placed in the Corp logical network instead of Contractor. What should the administrator do?",
    exhibit: `Network access policies (evaluated top to bottom)
Rank  Policy             User/Host Profile                                  Network Access Config
1     Registered-Hosts   Who/What by Attribute: host is registered          Corp
2     Contractors        Who/What by Attribute: user Role = Contractor      Contractor
3     Guests             Who/What by Attribute: user Role = Guest           Guest

Template Contractor-90d: Role = Contractor`,
    options: [
      "Move the Contractors policy above Registered-Hosts",
      "Change the template role to NAC-Default so the Contractors profile matches",
      "Add the Contractor logical network to the Registered-Hosts network access configuration",
      "Re-run device profiling so contractor hosts are reclassified",
    ],
    answer: [0],
    explanation: "Network access policies are checked **top down and the first match wins**. A contractor's registered host matches the broad Registered-Hosts profile at rank 1, so Contractors is never reached. Put the specific policy above the general one. Changing the role to NAC-Default would stop the Contractors profile matching at all, a network access configuration applies one logical network, and device profiling only deals with rogues.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-012',
    topic: '4.1',
    type: 'match',
    difficulty: 1,
    stem: "Match each guest manager visitor type to its description.",
    pairs: [
      ['Guest', 'Visitor with limited or Internet-only access, usually for a day or a few days'],
      ['Contractor', 'Temporary worker given full or limited access for weeks or months'],
      ['Conference', 'Group of attendees needing identical, limited access for a short event'],
      ['Self-Registered Guest', 'Visitor who requests an account from their own device in the portal'],
    ],
    explanation: "These are the four **Visitor Type** values on Guest/Contractor templates. Conference accounts are created as a batch (shared or individual names and passwords); self-registered guest accounts are created when a sponsor approves a portal request, or immediately if no approval is required.",
    lesson: '4.1-guest-manager-setup',
  },
  {
    id: 'd4-013',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Yesterday a sponsor created a guest account and emailed the credentials. Today the sponsor opens the account and clicks Print Badge for the guest. The guest's emailed password then stops working. Why?",
    options: [
      "Once the creating session has ended, passwords are no longer visible, and Print or Print Badge generates a new password that replaces the old one",
      "Printing a badge disables the account until the guest scans the badge at the kiosk",
      "The badge printer settings reset the account's Login Availability to the current day",
      "Print Badge converts the account to a conference account with a shared password",
    ],
    answer: [0],
    explanation: "Generated passwords are only viewable in the GUI session in which they were created. In a later session, **Print** or **Print Badge** produces a **new** password and the previous one becomes invalid; the new one is visible for that session. Nothing in badge printing disables the account, changes login availability or converts the account type.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-014',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Sponsors complain that they must log in to the FortiNAC-F GUI to approve each self-registration request. They want to approve or deny directly from the email. What should the administrator change?",
    exhibit: `Portal > Portal Configuration > Registration > Self Registration Login
  Default Sponsor Email ......................... facilities@corp.example.com
  Require Sponsor Approval ...................... Any Administrator
  Sponsor Approval Link Requires Login .......... enabled
  Guest Request Expiration (minutes) ............ 20`,
    options: [
      "Disable Sponsor Approval Link Requires Login, so the email carries Approve and Deny links",
      "Set Require Sponsor Approval to None",
      "Enable Notify Sponsor of Guest Details",
      "Increase Guest Request Expiration (minutes) to 60",
    ],
    answer: [0],
    explanation: "With **Sponsor Approval Link Requires Login** enabled the email contains a Login link to the admin GUI; disabled, it contains **Approve** and **Deny** links that act without further interaction. Setting approval to None removes sponsor approval entirely, which isn't what was asked. Notify Sponsor of Guest Details only sends the guest's credentials to the sponsor, and the expiration time doesn't change how approval works.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-015',
    topic: '4.1',
    type: 'fill',
    difficulty: 2,
    stem: "From the FortiNAC-F CLI base context, enter the full command that lists every guest/contractor template.",
    answer: ['diagnose user guest-templates list all'],
    explanation: "`diagnose user guest-templates list (all | name=<name> | dbid=<dbid>)` lists guest template information. Related: `diagnose user list email=<email>` checks that a guest user record exists, and `diagnose host list owner=<owner>` lists hosts owned by that user.",
    lesson: '4.1-guest-contractor-workflows',
  },
  {
    id: 'd4-016',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "On FortiNAC-F 7.6.7, a contractor template has Re-registration Period enabled with 720 hours. What happens to a contractor's registered host when that period expires?",
    options: [
      "The host record is deleted and the device is seen as a rogue again, so the contractor must register again",
      "The host is moved to the authentication VLAN and the contractor re-enters credentials; the registration is kept",
      "The contractor's user account is disabled, but the host stays registered",
      "The host is marked At Risk for the Guest No Access admin scan until a sponsor renews it",
    ],
    answer: [0],
    explanation: "From F 7.6.7 the template's *Reauth Period* is renamed **Re-registration Period** (1 to 8760 hours). When it expires, registered hosts are **deleted and become rogues again**, so the guest/contractor flow must be repeated. Moving hosts to the authentication VLAN is what an authentication policy's re-authentication period does (the two can run side by side; with identical intervals re-registration takes precedence). Neither feature disables the user or uses the Guest No Access scan.",
    lesson: '4.1-guest-manager-setup',
  },

  // ---------- 4.2 Device profiling ----------
  {
    id: 'd4-017',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Weeks after this camera was registered, the administrator added an IP-Cameras rule at rank 1 and clicked Run. The camera is still shown with the Linux device type. Why?",
    exhibit: `Logs > Events & Alarms > Events (Element: 00:09:0F:31:88:02)
Date              Event                                     Message (summary)
2026/10/12 10:04  Device Profile Rule Match                 matched rule Generic-Linux
2026/10/12 10:04  Device Profiling Automatic Registration   registered as device by rule Generic-Linux
2026/10/30 08:15  Host Connected                            host connected on FSW-Access1 port21`,
    options: [
      "Device profiler only evaluates rogues; the camera is already registered, so it must be changed by hand or deleted so it reconnects as a rogue",
      "Run only processes hosts that are offline, and the camera is online",
      "New rules only apply after Confirm Device Rule On Interval runs for the old rule",
      "The IP-Cameras rule must be placed below the Catch All rule to take effect",
    ],
    answer: [0],
    explanation: "Device profiler never re-profiles a **registered** host: new or changed rules can't be run against it unless it is deleted and returns as a rogue, or you modify it manually. **Run** queues rogues that are still connected and not yet categorized, and ignores offline ones. Rule confirmation only re-checks a device against its *own* rule, and nothing can be ranked below Catch All.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-018',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Cameras with static IP addresses stay rogues, and the event log shows Device Profiling Rule Missing Data for each of them. What is the best fix?",
    exhibit: `Users & Hosts > Device Profiling Rules
Rank  Name          Enabled  Methods                  Registration
1     Linux-DHCP    Yes      DHCP Fingerprinting      Automatic
2     IP-Cameras    Yes      Vendor OUI, TCP          Automatic
3     Catch All     -        (none)                   -

Camera 10.30.0.41: static IP, vendor OUI known, TCP 554 open`,
    options: [
      "Rank IP-Cameras above Linux-DHCP and keep DHCP fingerprinting rules at the bottom of the list",
      "Add DHCP Fingerprinting as a second method to the IP-Cameras rule",
      "Disable the Catch All rule so evaluation continues past rule 1",
      "Enable Confirm Device Rule On Connect on the IP-Cameras rule",
    ],
    answer: [0],
    explanation: "Static-IP devices never send DHCP, so there is no DHCP fingerprint. When a rule needs data FortiNAC-F doesn't have, device profiler **stops evaluating that device** (it doesn't skip to the next rule) and logs *Device Profiling Rule Missing Data*. Rank OUI rules first and DHCP rules last where static addresses exist. Adding DHCP to the camera rule would make it fail too, Catch All isn't the reason evaluation stops, and rule confirmation only applies after a device has matched.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-019',
    topic: '4.2',
    type: 'multi',
    difficulty: 3,
    stem: "Refer to the exhibit. Which two rogue devices match this rule? (Choose two.)",
    exhibit: `Device profiling rule: Door-Controllers   (Type: Card Reader, Enabled)
Methods tab
  Vendor OUI
    Vendor Name: Northgate Security
    Vendor Name: Kestrel Controls
  TCP
    Ports: 80,443`,
    options: [
      "A Northgate Security device with TCP 80 and TCP 443 open",
      "A Kestrel Controls device with TCP 80 and TCP 443 open",
      "A Northgate Security device with only TCP 443 open",
      "A device from another vendor with TCP 80 and TCP 443 open",
      "A Kestrel Controls device with only TCP 80 open",
    ],
    answer: [0, 1],
    explanation: "All selected **methods** must match: here Vendor OUI **and** TCP. Within the Vendor OUI method, multiple entries are alternatives (matching **one** is enough). Within the TCP method, multiple ports must **all** be open. So either vendor with both ports matches; a single open port fails TCP, and another vendor fails the OUI method.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-020',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "A device profiling rule registers matching UPS units with Register as set to Device in Topology and a container named UPS. Which statement about the registered UPS units is true?",
    options: [
      "They appear in the Inventory, can be polled for contact status, and do not appear in the Profiled Devices view",
      "They appear only in the Host View, with connection history, and can be added to a host group by the rule",
      "They remain rogues associated with the rule until a device manager registers them",
      "They appear in both the Host View and the Inventory, and device managers can manage them from Profiled Devices",
    ],
    answer: [0],
    explanation: "**Device in Topology** places the device in an Inventory container only. Inventory devices are polled for connection status (shown in red when unreachable, with contact events), but they're **not** listed in Profiled Devices and device managers can't manage them. Host View placement gives connection history and group membership (Add to Group is only for Host View). Rogues stay rogues only if the rule doesn't register them.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-021',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The card reader is still on the registration network. What should a device manager do to give it access?",
    exhibit: `Users & Hosts > Profiled Devices
Name              Rule Name      Type          Role          IP address    Registered
Kestrel Controls  Card-Readers   Card Reader   NAC-Default   10.40.0.17    No

Rule Card-Readers: Registration = Manual, Register as = Device in Host View, Add to Group = Card Readers`,
    options: [
      "Right-click the device in Profiled Devices and select Register As Device",
      "Click Run on the Device Profiling Rules view so the device is evaluated again",
      "Enable Confirm Device Rule On Connect for the device",
      "Delete the Card-Readers rule so the device falls through to Catch All",
    ],
    answer: [0],
    explanation: "The device **matched** Card-Readers (Rule Name and Type are filled in), but the rule uses **Manual** registration, so it waits in Profiled Devices until someone uses **Register As Device**. Run only queues uncategorized rogues, rule confirmation re-checks devices that already matched, and deleting the rule removes the association and leaves the device a rogue.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-022',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Branch devices behind FGT-Branch1 never match the Branch-POS rule. What must the administrator do?",
    exhibit: `Device profiling rule Branch-POS   (Enabled, Registration: Automatic)
  Methods: FortiGate (Match Type: Cash Register)

Network > Inventory > FGT-Branch1 > Set Firewall Session Polling
  Enabled ........................... (not selected)
  Frequency ......................... 5 minutes

Users & Hosts > Network Sessions (Firewall = FGT-Branch1): no records`,
    options: [
      "Enable firewall session polling on FGT-Branch1, because the FortiGate method uses network session data",
      "Add the Vendor OUI method, because the FortiGate method can't be used on its own",
      "Configure FGT-Branch1 as a log receiver so it can send sessions to FortiNAC-F as syslog",
      "Enable Create Rogues from DHCP packets in the Device Profiler settings",
    ],
    answer: [0],
    explanation: "The **FortiGate** and **Active** profiling methods match on information collected in **Network Sessions**, and the guide states that firewall session polling must be configured to use them. Polling is enabled per FortiGate in Network > Inventory (default frequency 5 minutes); no sessions means nothing to match. The FortiGate method doesn't require another method, log receivers send FortiNAC-F events out rather than collecting sessions, and DHCP rogue creation doesn't feed the FortiGate method.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-023',
    topic: '4.2',
    type: 'fill',
    difficulty: 2,
    stem: "Enter the full FortiNAC-F CLI command that runs the device profiling rules against the single MAC address 00:09:0f:aa:10:21.",
    answer: ['diagnose host device-profiling rules scan mac 00:09:0f:aa:10:21'],
    explanation: "`diagnose host device-profiling rules scan mac <mac>` queues one MAC for evaluation. Related forms: `rules scan all` (all rogues), `rules scan size` (queue size), `rules scan flush` (empty the queue) and `rules display all` (list the rules).",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-024',
    topic: '4.2',
    type: 'order',
    difficulty: 2,
    stem: "Put the device profiler process for a new IP camera in order, from first to last.",
    items: [
      "The camera connects and FortiNAC-F learns its MAC address",
      "FortiNAC-F creates a rogue host record because the MAC is unknown",
      "The camera's IP address is resolved through IP-to-MAC polling",
      "Device profiler compares the rogue with enabled rules in rank order",
      "The first fully matching rule assigns its device type and role",
      "The camera is registered automatically and placed according to Register as",
    ],
    explanation: "Unknown MAC → **rogue** record → wait (up to 30 minutes) for the **IP address** → compare with **enabled rules by rank** → first full match assigns **type and role** (overriding the vendor OUI defaults) → if the rule is Automatic with Register as set, the device is **registered** in the Host View, Inventory or both. With Manual registration it waits in Profiled Devices instead.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-025',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "After creating three new device profiling rules, an administrator clicks Run on the Device Profiling Rules view. Which statement describes what happens?",
    options: [
      "Rogues that are still connected and not yet categorized are added to the Rogue Evaluation Queue; offline rogues and registered hosts are not processed",
      "Every host in the database, registered or not, is re-evaluated against the new rules",
      "Only rogues that are currently offline are evaluated, so online devices are not disrupted",
      "The new rules are pushed to FortiNAC Manager, which then evaluates rogues on all managed CAs",
    ],
    answer: [0],
    explanation: "**Run** re-runs device profiler for rogues that remain in the Host View and were not previously categorized; they go into the Rogue Evaluation Queue. Rogues no longer connected are ignored and already-categorized or registered devices aren't affected. If the rules notify device managers, those emails are sent again. Run is a local action, not a FortiNAC Manager push.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-026',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about endpoint fingerprints in FortiNAC-F 7.6 are true? (Choose two.)",
    options: [
      "A new fingerprint record is added each time a new fingerprint is heard for a MAC, for example after the host gets a new address in the production VLAN",
      "When one MAC shows records with different operating systems, FortiNAC-F raises the Device Fingerprint Changed event",
      "A device is registered as soon as FortiNAC-F has a fingerprint for it, even if no device profiling rule matches",
      "Set Source Rank changes the rank of device profiling rules",
      "Administrators can edit the built-in fingerprint database to add their own DHCP fingerprints",
    ],
    answer: [0, 1],
    explanation: "Fingerprints accumulate: each **new** fingerprint for a MAC adds a record, and different OS values for the same MAC (typically a dual-boot host) generate **Device Fingerprint Changed**. Fingerprints only populate the rogue record; registration needs a rule set to register (or manual action). **Set Source Rank** orders the sources used to populate the host record, not the rules. The fingerprint database used by fingerprinting methods can't be modified by the user; you match custom strings in the rule instead.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-027',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Both records are for the same switch port. What is the most likely explanation?",
    exhibit: `Endpoint Fingerprints (filter: Physical Address = 00:09:0F:44:1A:9C)
Physical Address    Operating System   Host Name   Source   Device Registered   Last Heard
00:09:0F:44:1A:9C   Windows 11         LAB-WS09    DHCPv4   Registered          2026/10/30 08:01
00:09:0F:44:1A:9C   Linux (Ubuntu)     lab-ws09    DHCPv4   Registered          2026/10/30 12:47

Event: Device Fingerprint Changed (Element: LAB-WS09)`,
    options: [
      "The workstation is dual-boot, so it reports a different operating system depending on which OS is running",
      "The workstation has two adapters, so FortiNAC-F created a sibling record",
      "Two hosts share the MAC through randomized MAC addressing on the same port",
      "The fingerprint database was updated, so every host was re-fingerprinted",
    ],
    answer: [0],
    explanation: "Two records for the **same MAC and port** with different operating systems most likely mean a **dual-boot** host, and that's what the *Device Fingerprint Changed* event flags (the host is using a different OS than the one it registered with). Sibling adapters have different MACs, randomized MACs change the MAC rather than share it, and a database update wouldn't produce a second DHCP fingerprint with a different OS.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-028',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The administrator has now added more endpoint licences. How can the waiting cameras be registered?",
    exhibit: `Earlier today: concurrent licences in use = licences available

Users & Hosts > Profiled Devices (Rule Name = IP-Cameras)
  14 devices   Type: Camera   Registered: No

Rule IP-Cameras: Registration = Automatic, Register as = Device in Host View`,
    options: [
      "Register them with Register As Device, or delete them so the automatic rule profiles and registers them again",
      "Do nothing; FortiNAC-F registers them automatically at the next L2 poll now that licences are free",
      "Enable Confirm Device Rule On Interval so the rule registers them at the next interval",
      "Move the IP-Cameras rule to rank 1 and wait for the next connection",
    ],
    answer: [0],
    explanation: "When the concurrent licence count is exceeded, new hosts that match a rule are listed in Profiled Devices but **not registered**. Once licences are available the guide gives two ways: **manually** (right-click > Register As Device) or, for an Automatic rule, **delete the hosts** so FortiNAC-F re-profiles and registers them. Polling, rule confirmation and rank changes don't register devices that already matched.",
    lesson: '4.2-device-profiler-rules',
  },
  {
    id: 'd4-029',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An administrator imports this file from Users & Hosts > Hosts > Import. Where do the cameras appear afterwards?",
    exhibit: `adap.mac,siblings,adap.ip,host.topo,host.devType
00:09:0F:6B:20:11,00:09:0F:6B:20:11,10.40.0.21,Cameras,Camera
00:09:0F:6B:20:12,00:09:0F:6B:20:12,10.40.0.22,Cameras,Camera`,
    options: [
      "In the Host View and in the Cameras container of the Inventory, with the Camera device type",
      "Only in the Cameras container of the Inventory, because host.topo moves them out of the Host View",
      "Only in the Host View; host.topo is ignored unless the file also has user.uid",
      "Nowhere; the import fails because host.owner is mandatory for host records",
    ],
    answer: [0],
    explanation: "`host.topo` names an Inventory container: the device is displayed in the **Inventory** and automatically in the **Host View**. `host.devType` sets the type and icon. Only `adap.mac` is required for host records (`user.uid` is required for user records), and `host.owner` is optional.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-030',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the result of importing this file?",
    exhibit: `Existing host record:  MAC 00:09:0F:5A:10:31   IP 10.10.10.31   Host Name LAB-PC31

Import file (Users & Hosts > Hosts > Import):
adap.mac,adap.ip,host.host
00:09:0F:5A:10:31,10.10.20.31,LAB-PC31B`,
    options: [
      "The existing record is updated: same MAC, new IP 10.10.20.31 and host name LAB-PC31B",
      "A second host record is created with the same MAC address",
      "The import is rejected because the MAC address already exists",
      "A new adapter is added to LAB-PC31 as a sibling with IP 10.10.20.31",
    ],
    answer: [0],
    explanation: "In host imports the **MAC address is the key**. Importing a record that already exists **updates** it with the new data, so the host keeps its MAC and takes the new IP and host name. No duplicate is created, and siblings are only defined through the `siblings` field with different MACs.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-031',
    topic: '4.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each Register as option of a device profiling rule to its result.",
    pairs: [
      ['Device in Host View', 'Host View only, with connection history and optional host group'],
      ['Device in Topology', 'Inventory container only, polled for contact status'],
      ['Device in Host View and Topology', 'Shown in both the Host View and an Inventory container'],
      ['Host to Logged In User (If Present)', 'Registered to the user currently logged on to the device'],
    ],
    explanation: "Register as decides where a matched device lands. Host View placement keeps connection history and allows Add to Group; Topology (Inventory) placement is polled for contact and drops out of Profiled Devices; both combines them. The Host to User options register the device to a named user or to the logged-on user.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-032',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two types of data are NOT included in a FortiNAC-F database backup? (Choose two.)",
    options: [
      "Alarms and events",
      "Scan results",
      "Device profiling rules",
      "Guest/contractor templates",
      "Host and adapter records",
      "Modeled network devices",
    ],
    answer: [0, 1],
    explanation: "The database holds everything you see in the GUI **except alarms and events, connection logs and scan results**. Those are archived and purged by the Database Archive and Purge task and restored by importing the archives into their views. Rules, templates, hosts, adapters and modeled devices are all in the database backup.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-033',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the risk of this backup configuration?",
    exhibit: `System > Settings > System Management > Database Backup/Restore
  Scheduled task Database Backup: Repetitive, every 7 Days
  Remove local backups older than: 3 days

System > Settings > System Management > Remote Backup Configuration
  Enable FTP Remote Backup ......... no
  Enable SSH Remote Backup ......... no
  Enable Secure FTP Remote Backup .. no`,
    options: [
      "The purge age is shorter than the backup interval and nothing is copied off the appliance, so the local backups can all be removed",
      "Backups older than 3 days are also deleted from the remote server, so off-box copies are lost",
      "The database backup only runs if a remote server is configured, so no backup is ever created",
      "Backups are kept forever because the purge setting only applies to system backups",
    ],
    answer: [0],
    explanation: "The guide warns that the purge age and the schedule must be planned together: if *Remove local backups older than* is shorter than the backup interval you may remove all your backups. With no remote backup enabled there is no copy elsewhere. The setting never deletes files on a remote server, backups run locally whether or not remote backup is configured, and the setting applies to database backups.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-034',
    topic: '4.2',
    type: 'fill',
    difficulty: 3,
    stem: "Complete the FortiNAC-F CLI command that restores the database from a backup file stored on the appliance: ______ FortiNAC_DataBase_BackUp_26_10_29_02_00_00_FNAC-CA1.gz",
    answer: ['execute restore database local'],
    explanation: "`execute restore database local <filename>` restores a local database backup; `execute restore database scp <host> <username> <password> <backup-path>` pulls one over SCP. In the GUI the same job is System Management > Database Backup/Restore > Restore Database, and the server restarts afterwards.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-035',
    topic: '4.2',
    type: 'order',
    difficulty: 3,
    stem: "Put the steps for importing printers into the Inventory with the CLI DeviceImport tool in order.",
    items: [
      "Create one CSV file that contains only the printers",
      "Back up the FortiNAC-F database",
      "Download the CSV file to the appliance from an FTP or TFTP server",
      "Run execute enter-shell",
      "Run DeviceImport with the file path and -type printer",
      "Verify the printers in Network > Inventory",
    ],
    explanation: "Each device type needs its **own CSV**. Back up the database first, because DeviceImport removes an existing device with the same IP before creating the new one. Get the file onto the appliance, enter the shell with `execute enter-shell`, run `DeviceImport <file> -type printer`, then check **Network > Inventory** and adjust device properties.",
    lesson: '4.2-fingerprints-registration-recovery',
  },
  {
    id: 'd4-036',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "An investigator needs events from three weeks ago. The Event/Alarms Age Time is 7 days and the archive and purge task has run since then. How can the administrator view those events?",
    options: [
      "Use Import in the Events view and select the events archive file from the appliance; the records are added back without overwriting current events",
      "Restore the latest database backup, which contains all events and alarms",
      "Download them from the remote backup server with Restore Database",
      "They can't be recovered, because purged events are deleted without an archive",
    ],
    answer: [0],
    explanation: "The archive and purge task **archives** events and alarms before purging them, and **Import** in the Events (or Alarms) view adds the archived records back; it doesn't overwrite existing data. The database backup excludes events and alarms, and archived events and alarms can only be restored from the **local disk**, not from a remote server.",
    lesson: '4.2-fingerprints-registration-recovery',
  },

  // ---------- 4.3 Troubleshoot network devices and device status ----------
  {
    id: 'd4-037',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A user's PC on Cisco-Access1 gets no access, and FortiNAC-F never placed it in the registration VLAN. What is the most likely cause?",
    exhibit: `FNAC-CA1 # diagnose host list mac=00:09:0F:5A:22:31
  (summary) no host record returned

FNAC-CA1 # diagnose network device test-snmp ip=10.20.0.12
  (summary) SNMP credential test for Cisco-Access1 (10.20.0.12): failed

Cisco-Access1# show mac address-table address 0009.0f5a.2231   (data row only)
  10    0009.0f5a.2231    DYNAMIC     Gi1/0/14`,
    options: [
      "FortiNAC-F can't read Cisco-Access1 with its SNMP credentials, so it never learned the host; fix the credentials on the modeled device",
      "The host is a rogue that no device profiling rule matched; create a rule for it",
      "The host is registered but disabled; enable it in the Host View",
      "The port isn't in the Forced Registration group; add it so the host gets a record",
    ],
    answer: [0],
    explanation: "No host record means FortiNAC-F **never learned** the MAC, even though the switch has it. The failed `test-snmp` shows FortiNAC-F can't use its SNMP credentials on the switch, so it can't read the forwarding table (L2 polling) or manage the port, and the host never gets a record. A rogue or disabled host would have a database record, and group membership decides how a known host is treated, not whether FortiNAC-F learns it.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-038',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about this host is true?",
    exhibit: `Users & Hosts > Hosts (filter: Physical Address = 00:09:0F:3D:77:10)
Status        Host Name   Host Type   IP Address    Location
[rogue icon]  -           Rogue       10.40.0.33    FSW-Access1 port12

Users & Hosts > Profiled Devices: no entry for 00:09:0F:3D:77:10
Endpoint Fingerprints: one record, Source = Vendor OUI, Rule Name = (empty)`,
    options: [
      "The host is in the database as a rogue and has not been classified by any device profiling rule",
      "The host is not in the database; the Hosts view only shows adapters learned from the switch",
      "The host is classified by the Catch All rule and is waiting for manual registration",
      "The host is a registered device whose rule confirmation failed",
    ],
    answer: [0],
    explanation: "A Host View record with Host Type **Rogue** proves the host is in the database and unregistered. No Profiled Devices entry and an empty **Rule Name** mean it isn't associated with any rule yet, so it isn't classified. A Catch All association would show the rule name and a Profiled Devices entry, and a registered device would not be a rogue.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-039',
    topic: '4.3',
    type: 'multi',
    difficulty: 2,
    stem: "An administrator wants to confirm which device profiling rule classified a printer. Which two methods show this? (Choose two.)",
    options: [
      "The Rule Name column for the printer in Users & Hosts > Profiled Devices or the Endpoint Fingerprints view",
      "diagnose host device-profiling host display rule-name <rule name>",
      "diagnose network device display ip=<printer IP>",
      "get system status",
      "The printer's entry in Logs > Audit Logs",
    ],
    answer: [0, 1],
    explanation: "Profiled Devices and Endpoint Fingerprints both show the **Rule Name** a device matched, and `diagnose host device-profiling host display rule-name <name>` lists the hosts associated with a rule. `diagnose network device display` shows modeled **infrastructure** devices, `get system status` shows appliance version and licence, and audit logs record administrator changes, not profiling results.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-040',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An employee's laptop should be in the Corp logical network but lands in Contractor. What should the administrator check next?",
    exhibit: `Network > Network events (MAC Address = 00:09:0F:5A:10:44)
Timestamp   Event Type            Type         Location             Logical Network
10:02:11    Adapter Connected     Registered   FSW-Access1 port7
10:02:13    Applied Role/Policy   Registered   FSW-Access1 port7    Contractor`,
    options: [
      "Policy Details on the host, to see which user/host profile and network access policy match it right now",
      "diagnose network device test-snmp on FSW-Access1, because the VLAN change failed",
      "Click Run on the Device Profiling Rules view to reclassify the laptop",
      "The host's aging values, because an expired host keeps its last logical network",
    ],
    answer: [0],
    explanation: "The host is in the database, registered, and FortiNAC-F successfully applied a policy: the problem is **which** policy matched. **Policy Details** shows the policies that would apply to the host at this moment (network access, endpoint compliance, portal, supplicant). Enforcement worked, so SNMP isn't the issue; device profiling only handles rogues; aging deletes records rather than keeping a logical network.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-041',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Cisco-Access1 is configured to send both MAC notification traps and link up/down traps to FortiNAC-F. What should the administrator change?",
    exhibit: `Logs > Events & Alarms > Events (Element = Cisco-Access1, last hour)
Event            Count
Port Link Up     212
Port Link Down   209
MAC Learned      0
MAC Removed      0`,
    options: [
      "Disable the link up/down traps on Cisco-Access1, because they are redundant with MAC notification traps and stop MAC Learned events from being generated",
      "Disable MAC notification traps, because FortiNAC-F only processes link up/down traps from Cisco switches",
      "Shorten the L2 polling interval of Cisco-Access1 to one minute",
      "Lower the Minimum Trap Period to 0 so FortiNAC-F reads the forwarding table immediately",
    ],
    answer: [0],
    explanation: "With MAC notification traps enabled, the guide says to **disable link up and link down traps**: they are redundant, add traffic and **prevent the MAC Learned event messages** from being generated. Cisco switches are a typical source of MAC notification traps. Faster polling or trap timing only hides the misconfiguration.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-042',
    topic: '4.3',
    type: 'fill',
    difficulty: 2,
    stem: "Enter the full FortiNAC-F CLI command that displays the main FortiNAC-F log, output.master, in real time and keeps following it even when the file is replaced.",
    answer: ['diagnose tail -F output.master'],
    explanation: "`diagnose tail -F output.master`. **-F** follows the file through replacement (rotation); **-f** stops if the file is replaced; **-k <numKB>** shows only the last N KB. Enable plugin debug first if you need more detail.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-043',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "An engineer left diagnose tail -f output.master running overnight. In the morning the window shows nothing after 00:00, although FortiNAC-F kept working and logging. What is the most likely reason?",
    options: [
      "The log file was replaced during the night, and -f does not follow a replaced file; -F does",
      "diagnose tail stops automatically after 60 minutes unless -k is added",
      "Plugin debug was disabled at midnight, which stops all writing to output.master",
      "output.master only receives messages while a plugin has debug enabled",
    ],
    answer: [0],
    explanation: "The CLI Reference defines **-f** as following changes but **not** following if the file is replaced, while **-F** follows through the replacement. There's no 60-minute limit (Ctrl-C stops tail), and output.master is the main log, written whether or not plugin debug is on; debug only adds detail.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-044',
    topic: '4.3',
    type: 'order',
    difficulty: 2,
    stem: "Order the FortiNAC-F logger levels used with diagnose debug logger set, from most verbose to least verbose.",
    items: ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'],
    explanation: "TRACE (packet capture, most verbose) → DEBUG → INFO → WARN → ERROR (least verbose). Each level includes the ones below it, for example INFO logs INFO + WARN + ERROR. `diagnose debug logger unset <logger>` returns a logger to INHERIT, and the CLI Reference says to change logger levels under the advice of Support.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-045',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. MAC notification traps from the access switch are not being processed. What is the most likely cause?",
    exhibit: `FNAC-CA1 # execute tcpdump -i=port1 -c=3 udp port 162
09:41:12.104233 IP 10.20.0.2.51734 > 10.0.0.5.snmptrap: [SNMP trap, decode abridged]
09:41:14.880961 IP 10.20.0.2.51734 > 10.0.0.5.snmptrap: [SNMP trap, decode abridged]
09:41:19.012407 IP 10.20.0.2.51734 > 10.0.0.5.snmptrap: [SNMP trap, decode abridged]

Network > Inventory: Cisco-Access1 modeled with IP address 10.20.0.12
No other modeled device uses 10.20.0.2`,
    options: [
      "The traps arrive from 10.20.0.2, which is not a modeled device, so FortiNAC-F can't tie them to Cisco-Access1; fix the switch's trap source or the modeled address",
      "A firewall between the switch and FortiNAC-F drops the traps before they reach port1",
      "Traps must be received on port2, the isolation interface, not on port1",
      "FortiNAC-F only processes traps after diagnose debug flow is enabled",
    ],
    answer: [0],
    explanation: "The capture proves the traps **reach** port1 (so nothing drops them), but their source is 10.20.0.2 while the switch is modeled as 10.20.0.12. FortiNAC-F listens for traps from devices once they are **modeled**, and MAC notification traps require the device to be modeled, so traps from an unknown source can't be processed. Traps go to the FortiNAC-F address the switch is configured with, not specifically to port2, and `diagnose debug flow` is a FortiOS command.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-046',
    topic: '4.3',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. A Syslog CSV log receiver is configured and reachable. Which two events are sent to the syslog server when they occur? (Choose two.)",
    exhibit: `Logs > Events & Alarms > Management
Log                   Event Name                   Group
Internal & External   Host Connected               All Groups
Internal              Host Disconnected            All Groups
External              Admin User Login Failure
Disabled              Device Profile Rule Match    All Groups
Internal              Guest Account Created`,
    options: [
      "Host Connected",
      "Admin User Login Failure",
      "Host Disconnected",
      "Device Profile Rule Match",
      "Guest Account Created",
    ],
    answer: [0, 1],
    explanation: "Only events whose Log setting includes **External** (External, or Internal & External) are sent to log receivers. Internal events stay in the local events database, and Disabled events aren't generated at all. Note that External alone gives the event a database ID of -1, which some log servers don't accept.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-047',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A SIEM receives this message from FNAC-CA1 through a Syslog CSV log receiver. Which statement is true?",
    exhibit: `<37>Oct 30 11:02:40 : 2026/10/30 11:02:40 EDT,2,77310,Contact Lost,3,812,,Cisco-Access1,10.20.0.12,,Contact with device Cisco-Access1 lost`,
    options: [
      "It is an alarm record with severity Critical for the element Cisco-Access1",
      "It is an event record with severity Minor, because the log type is 2",
      "It is a security alarm generated by a security rule",
      "The syslog header shows the message was sent with syslog severity Critical",
    ],
    answer: [0],
    explanation: "In the FortiNAC-F CSV format, the field after the log time is the **log type** (1 Event, **2 Alarm**, 3 Security Alarm), then the database ID, the name, and the **severity** (0 Normal, 1 Minor, 2 Major, **3 Critical**). The entity name and IP follow. `<37>` is the syslog priority: facility 4 (security/authorization, the default) × 8 + severity 5 (notice), so the syslog-level severity is notice, not critical.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-048',
    topic: '4.3',
    type: 'fill',
    difficulty: 2,
    stem: "When you add a Syslog CSV log receiver, which syslog facility number does FortiNAC-F use by default? (Enter the number.)",
    answer: ['4'],
    explanation: "The default **Facility** is **4** (security/authorization messages). The default port is 514 for Syslog CSV and Syslog CEF, and 162 for SNMP trap receivers, which use a Security String instead of a facility.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-049',
    topic: '4.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each FortiNAC-F log or view to what it records.",
    pairs: [
      ['Logs > Events & Alarms > Events', 'Enabled system and network events with element and message'],
      ['Network > Network events', 'Connect and disconnect history with Registered/Rogue type and the applied logical network'],
      ['Logs > Audit Logs', 'Who added, modified or deleted a configuration item, and when'],
      ['Logs > Authentication Logs', 'RADIUS, LDAP, Local, SAML and Social authentication attempts with their steps'],
      ['Logs > Events & Alarms > Alarms', 'Records created from events by event-to-alarm mappings, which can be acknowledged'],
    ],
    explanation: "Events are the audit trail of enabled events; Network Events is the connection log (Event Type, Type, Location, Logical Network …); Audit Logs track administrative changes (CLI changes appear as CLI Tool); Authentication Logs show live authentication attempts per method with View Steps; Alarms come from event-to-alarm mappings and have severities and acknowledgement.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-050',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "An auditor reviews Logs > Audit Logs and finds a modification to a network device whose user ID is CLI Tool. What does this mean?",
    options: [
      "The change was made through the FortiNAC-F CLI rather than the GUI",
      "The change was made by FortiNAC Manager during a synchronization",
      "An administrator account named CLI Tool exists and should be investigated",
      "The change was rolled back automatically by a scheduled task",
    ],
    answer: [0],
    explanation: "Changes made through the CLI are tracked in the admin auditing log, but the user ID appears as **CLI Tool**. It isn't an administrator account, a Manager sync or a rollback marker. Remember that some items, such as adapters, alarms and certificates, aren't audited at all.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-051',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Global aging was never configured. On 2026/11/02 the administrator sets Days Valid to 30 for hosts and saves. What happens to LAB-PC12?",
    exhibit: `Users & Hosts > Hosts > LAB-PC12 > Host Properties
  Created ............ 2026/09/01 08:30
  Expiration Date .... (none)
  Inactivity Date .... (none)`,
    options: [
      "Its calculated expiration date (2026/10/01) has already passed, so the record is removed straight away",
      "Nothing; global aging values only apply to hosts created after the change",
      "It expires on 2026/12/02, 30 days after the setting was saved",
      "It is marked At Risk until an administrator sets an expiration date manually",
    ],
    answer: [0],
    explanation: "Global age times are applied to new records **and to existing records with no aging values**. Days Valid counts from the record's **creation** date, so LAB-PC12 gets 2026/10/01, which is already in the past, and it is deleted immediately (the guide shows the same effect with a 5-day example). Records that already have dates, or are set to Never, are not changed until cleared.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-052',
    topic: '4.3',
    type: 'multi',
    difficulty: 3,
    stem: "Which two statements about user and host aging in FortiNAC-F are true? (Choose two.)",
    options: [
      "Group aging updates every host in the group, even hosts that already have age times, except hosts set to Never expire",
      "Host age times are evaluated every ten minutes, so a host can remain up to ten minutes after its expiration time",
      "Changing the global Days Valid value immediately recalculates every host that already has an expiration date",
      "Setting Days Inactive to 0 disables inactivity aging",
      "Administrators with the System Administrator profile age out like any other user",
    ],
    answer: [0, 1],
    explanation: "**Group aging** overrides existing values for all members except Never-expire hosts, and host age times are **evaluated every ten minutes**. Global changes don't touch records that already have dates until you Clear them. A value of **0** removes records at the next poll (empty fields disable global aging). Administrators with the System Administrator profile can't be aged out.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-053',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Sessions from FGT-Branch1 appear in Users & Hosts > Network Sessions, but branch endpoints with no switch modeled never appear in the Host View. Which setting adds them?",
    exhibit: `Network > Inventory > FGT-Branch1 > Set Firewall Session Polling
  Enabled ............................ yes
  Frequency .......................... 5 minutes
  Create Rogues from Session Data .... (not selected)`,
    options: [
      "Select Create Rogues from Session Data",
      "Lower the Frequency to 1 minute",
      "Enable Create Rogues from DHCP packets in the Device Profiler settings",
      "Add FGT-Branch1 as a log receiver of type FortiAnalyzer",
    ],
    answer: [0],
    explanation: "Firewall session polling is already collecting sessions. The optional **Create Rogues from Session Data** setting creates rogue host records for endpoints seen in those sessions, which then appear in the Host View and can be profiled. Polling faster doesn't create records, DHCP rogue creation depends on DHCP packets reaching FortiNAC-F, and log receivers send FortiNAC-F's own events out.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-054',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "An administrator compares FGT-HQ's session list in the FortiGate GUI with Users & Hosts > Network Sessions on FortiNAC-F and finds fewer sessions in FortiNAC-F. Polling works. What explains this?",
    options: [
      "FortiNAC-F reads sessions through the FortiOS REST API firewall session endpoint, and some sessions shown in the FortiGate GUI are not in that API response",
      "FortiNAC-F only stores sessions for registered hosts and drops sessions from rogues",
      "Network Sessions only shows sessions that also appear in NetFlow exports",
      "Each poll replaces the list, and FortiNAC-F only keeps the 100 most recent sessions",
    ],
    answer: [0],
    explanation: "The guide notes that FortiNAC-F builds Network Sessions from the REST API (`api/v2/monitor/firewall/session/select`), and sessions that appear in the FortiGate GUI but not in that response aren't displayed. Sessions aren't filtered by registration state, NetFlow is a separate source, and no 100-session limit is documented.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-055',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Why does the search return nothing, although several hosts with MAC addresses beginning 00:09:0F:5A exist?",
    exhibit: `Users & Hosts > Hosts
  Search: 00090F5A*
  Displayed: 0   Total: 4812`,
    options: [
      "A wildcard MAC search must include the colon separators, for example 00:09:0F:5A:*",
      "Quick Search does not accept wildcards; a custom filter is required",
      "MAC addresses can only be searched in the Adapters view",
      "The asterisk must be replaced with a percent sign",
    ],
    answer: [0],
    explanation: "Quick Search accepts IP, MAC, host name, user name and user ID, with wildcards. For a **wildcard MAC search you must keep the colons** (such as `00:B6:5*`), otherwise FortiNAC-F can't tell the string is a MAC. Hosts, Adapters and Users share the same search, and `*` is the documented wildcard.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-056',
    topic: '4.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each filter entry in a FortiNAC-F text field to what it returns.",
    pairs: [
      ['10.40.*', 'Values that begin with 10.40.'],
      ['[10.40.0.17,10.40.0.21]', 'Records matching any value in the list'],
      ['!Windows', 'Records that do not contain Windows'],
      ['<esc>!Lab', 'Records that contain the literal text !Lab'],
    ],
    explanation: "`*` is a wildcard, square brackets with commas make a list of values, a leading `!` negates (and `![…]` negates a list), and `<esc>!` searches for a literal exclamation mark.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-057',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. No agent is installed on jdoe's laptop. Why does FortiNAC-F hold two host records for it?",
    exhibit: `Users & Hosts > Hosts (search: jdoe)
Host Name   Registered User   Adapter (Physical Address / Media Type)
JDOE-LT     jdoe              00:09:0F:5A:10:61 / Wired
JDOE-LT     jdoe              02:6B:3C:11:9E:40 / Wireless`,
    options: [
      "FortiNAC-F can only link several adapters to one host when an agent reports them, so each adapter got its own host record",
      "The wireless MAC is randomized, which always forces a second registration",
      "Host aging created a copy of the record when the laptop moved from wired to wireless",
      "The user registered twice because Allowed Hosts is set to 2",
    ],
    answer: [0],
    explanation: "Adapters on the same host are **siblings**, but FortiNAC-F can only associate them with one host when an **agent** reports the host's MAC addresses. Without one, it creates a separate host record per adapter (one user, two hosts, two adapters). Randomized MACs, aging and Allowed Hosts don't create sibling copies; Allowed Hosts only limits how many hosts a user may register.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-058',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "An administrator schedules the standard Registration report weekly and selects the Network Admins administrator group as the Email Group. Nobody receives it. Which prerequisite is most likely missing?",
    options: [
      "Email addresses in the administrators' user records, or the mail server settings under System > Settings",
      "A FortiAnalyzer log receiver, because scheduled reports are delivered through FortiAnalyzer",
      "Firewall session polling, because reports are built from Network Sessions",
      "A custom report, because standard report templates can't be scheduled",
    ],
    answer: [0],
    explanation: "Reports via email need the recipients in an **administrator group**, an **email address** in each member's user record, and the **mail server** configured in System > Settings. Both standard templates and custom reports can be scheduled (output also appears under Archives). FortiAnalyzer and session polling are unrelated to local report delivery.",
    lesson: '4.3-visibility-views-aging',
  },
  {
    id: 'd4-059',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FortiAnalyzer receives no FortiNAC-F data. What is the most likely cause?",
    exhibit: `FNAC-CA1: System > Settings > System Communication > Log Receivers
  Type: FortiAnalyzer    IP Address: 192.0.2.20    Port: 514

FGT-HQ policy from the FNAC-CA1 port1 subnet to 192.0.2.20
  service: SYSLOG (UDP 514)    action: accept`,
    options: [
      "FortiNAC-F sends events, alarms, endpoint and network data to FortiAnalyzer over TCP 514, which the policy doesn't allow",
      "The log receiver must use port 162 for FortiAnalyzer",
      "FortiAnalyzer only accepts FortiNAC-F data as SNMP traps",
      "FortiNAC-F must be added as a log receiver on FortiAnalyzer, not the other way round",
    ],
    answer: [0],
    explanation: "The FortiAnalyzer integration guide states that FortiNAC-F sends **events, alarms, endpoint data and network infrastructure data over TCP port 514**, and that TCP 514 must be allowed between them. A UDP-only syslog policy blocks it. Port 162 is for SNMP trap receivers, FortiAnalyzer is configured as a log receiver *on FortiNAC-F*, and FortiAnalyzer also has to recognise the FortiNAC-F serial number.",
    lesson: '4.3-troubleshooting-logging',
  },
  {
    id: 'd4-060',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "An engineer with a FortiGate background wants more detail about VLAN switching on FNAC-CA1 and types diagnose debug enable followed by diagnose debug flow. Which approach is correct on FortiNAC-F 7.6?",
    options: [
      "Enable debug for the relevant plugin with diagnose debug plugin enable <name> (or raise a logger level) and watch diagnose tail -F output.master",
      "Use diagnose sniffer packet any with verbosity 4 to see FortiNAC-F's decisions",
      "Run execute enter-shell and open /bsc/logs/output.master in a text editor",
      "Use get system status, which shows the last VLAN change for every host",
    ],
    answer: [0],
    explanation: "`diagnose debug enable`, `diagnose debug flow` and `diagnose sniffer packet` are **FortiOS** commands. FortiNAC-F adds detail per component with **plugin debug** (`diagnose debug plugin list | enable <name>`) or **logger levels** (`diagnose debug logger set`), then shows it with `diagnose tail -F output.master`; for packets it has `execute tcpdump`. Browsing log files from the shell is the CentOS-era habit, and `get system status` shows appliance status, not host events.",
    lesson: '4.3-troubleshooting-logging',
  },
];
