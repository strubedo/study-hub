// Domain 1 — Administration question bank (original, exam-style).
export default [
  {
    id: 'd1-001',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator changes the hostname and the port3 IP address of FGT-Branch1 in its device database, and changes an address object used by Branch-PP in Policy & Objects. What happens when the administrator runs the Install Wizard with "Install Policy Package & Device Settings"?',
    options: [
      'FortiManager copies the policy package into the device database, compares the result with the running configuration retrieved from FGT-Branch1 and installs only the differences',
      'FortiManager replays every command of the device database and policy package on FGT-Branch1 line by line',
      'FortiManager installs the policy package first and then asks whether the device database changes should overwrite it',
      'FortiManager installs only the policy package, because device-level settings such as hostname must be changed on the FortiGate itself',
    ],
    answer: [0],
    explanation: 'An install has two stages. First the ADOM-level items (policy package, objects, templates) are copied into the target\'s **device database** (the "VDOM copy"), which marks the device Modified. Then FortiManager retrieves the running configuration, compares it with the updated device database and pushes **only the diff**. It does not replay commands line by line. Hostname and interface IP are device-level settings that are edited in the device database and are installed by the same operation, so they do not have to be made locally. There is no prompt to choose between package and device database; where both define a setting, the policy package overwrites the device database.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-002',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An automation script sends this request to FMG-HQ and receives HTTP status 200. The script logs "success", but the address does not change. Why?',
    exhibit: String.raw`POST https://fmg-hq.example.com/jsonrpc
{
  "method": "add",
  "params": [
    {
      "url": "/pm/config/adom/Retail/obj/firewall/address",
      "data": { "name": "POS-Server", "subnet": ["10.20.5.10", "255.255.255.255"] }
    }
  ],
  "session": "Dr9f0BKtQjv2c4Wb6Hk8yLmPq1sT3uVx",
  "id": 7
}

HTTP/1.1 200 OK
{
  "id": 7,
  "result": [
    {
      "status": { "code": -2, "message": "Object already exists" },
      "url": "/pm/config/adom/Retail/obj/firewall/address"
    }
  ]
}`,
    options: [
      'The session token has expired, so FortiManager accepted the request but discarded it',
      'POS-Server already exists in ADOM Retail and the add method does not overwrite; the script must check result[].status.code instead of the HTTP status',
      'The ADOM Retail is locked by another administrator in workspace mode, which FortiManager reports as code -2',
      'The subnet must be sent as a single string such as "10.20.5.10/32", so FortiManager rejected the data',
    ],
    answer: [1],
    explanation: 'HTTP 200 only says the JSON-RPC request was received and processed. The operation result is in the body: code **-2, "Object already exists"**. `add` fails when an object of that name exists; `set` (create or overwrite) or `update` would change it. An invalid or expired session is reported as an authentication or permission failure (the best-practice guide lists HTTP 401 for an invalid session or token), never as -2. A lock or permission problem returns a different error (for example -11 "No permission for the resource"). Invalid data would be reported as -10 "The data is invalid for selected url", and the subnet array form shown is accepted.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-003',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about FortiManager JSON API methods are correct? (Choose two.)',
    options: [
      'set creates the object if it does not exist and overwrites it if it does',
      'add succeeds even if an object with the same name exists, creating a duplicate with a numeric suffix',
      'update changes only the attributes sent in the request and keeps existing child-table data',
      'Login is performed with the get method on /sys/login/user',
      'move copies an object, such as an ADOM, under a new name',
    ],
    answer: [0, 2],
    explanation: '`set` behaves like add-or-replace, and `update` modifies only the attributes you send while keeping child tables (`replace` is the method that clears child-table content you did not send). `add` **fails** with "Object already exists" rather than creating duplicates. Login is an **exec** call on `/sys/login/user`, not `get`. Copying under a new name is `clone`; `move` reorders an object such as a policy.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-004',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Which JSON-RPC method is used with the URL /sys/logout to end a FortiManager API session? (one word)',
    answer: ['exec'],
    explanation: 'Both login (`/sys/login/user`) and logout (`/sys/logout`) are **exec** calls. Logging out frees the session slot; Fortinet\'s API best-practice guide warns that unclosed sessions can exhaust the per-user (`login-max`) and system-wide session limits.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-005',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator queries the policy package Branch-PP in ADOM Retail. What does the response show?',
    exhibit: String.raw`Request:
{ "method": "get",
  "params": [ { "url": "/pm/pkg/adom/Retail/Branch-PP" } ],
  "session": "Dr9f0BKtQjv2c4Wb6Hk8yLmPq1sT3uVx", "id": 5 }

Response:
{
  "id": 5,
  "result": [
    {
      "data": {
        "name": "Branch-PP",
        "obj ver": 12,
        "oid": 4512,
        "package settings": { "central-nat": 0, "ngfw-mode": 0 },
        "scope member": [
          { "name": "FGT-Branch1", "vdom": "root" },
          { "name": "FGT-Branch2", "vdom": "root" }
        ],
        "type": "pkg"
      },
      "status": { "code": 0, "message": "OK" },
      "url": "/pm/pkg/adom/Retail/Branch-PP"
    }
  ]
}`,
    options: [
      'Branch-PP has been installed successfully on FGT-Branch1 and FGT-Branch2 and both are synchronized',
      'The root VDOMs of FGT-Branch1 and FGT-Branch2 are the installation targets of Branch-PP',
      'FGT-Branch1 and FGT-Branch2 are locked by the API session in workspace mode',
      'Branch-PP uses central NAT and NGFW policy-based mode on both devices',
    ],
    answer: [1],
    explanation: 'The **scope member** attribute of a package lists its installation targets: device (or device group) name and VDOM. It does not report install or synchronization status; that is policy package status, a different query. The request is a read and does not lock anything. In `package settings`, `0` for `central-nat` and `ngfw-mode` (no `verbose` flag, so index values) means central NAT disabled and profile-based mode, not the opposite.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-006',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each HTTP status code returned by the FortiManager JSON API to its meaning, as listed in Fortinet\'s FortiManager 7.6 API best-practice guide.',
    pairs: [
      ['401', 'Invalid session or token'],
      ['403', 'Permission denied'],
      ['404', 'Unable to find the specified resource'],
      ['405', 'Method not allowed for this resource'],
      ['503', 'Service unavailable'],
    ],
    explanation: 'These are the transport-level HTTP codes from the guide (it also lists 100 Continue, 200 Success and 500 Internal error). They are separate from the JSON-RPC `status.code` inside the body (0 OK, -2, -3, -6, -10, -11 and so on), which describes the result of the individual operation even when HTTP returns 200.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-007',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'A NOC wants a monitoring tool to query FMG-HQ every minute without calling the login and logout endpoints. What should the FortiManager administrator configure?',
    options: [
      'A regular administrator with JSON API Access set to Read, with the password stored in the tool and sent in every request body',
      'A REST API Admin with an admin profile, JSON API Access and at least one trusted host; the tool sends the generated key in an "Authorization: Bearer" header',
      'A REST API Admin whose key is passed in the session field of each JSON-RPC body',
      'A Password_Change_User account, which is the only profile allowed to use the API without a session',
    ],
    answer: [1],
    explanation: 'A **REST API Admin** gets a permanent API key (shown once, regenerated with the GUI or `execute api-user generate-key <name>`). It is sent with the **bearer** scheme in the `Authorization` header, so no login/logout is needed, and the account **requires at least one trusted host**. A regular admin still needs a login exec to obtain a session; there is no password-per-request mode. The key does not go in the `session` field, and passing it as an `access_token` query string is no longer supported from 7.4.7/7.6.2. Password_Change_User can only change passwords.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-008',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. A cron job runs every five minutes on a Linux host. After several hours the job, and also the administrator api-ops in the GUI, can no longer log in to FMG-HQ, although the password is correct. The FortiManager administrator had raised the API idle timeout to the maximum. What is the most likely cause?',
    exhibit: String.raw`#!/bin/bash
# poll-fmg.sh  (runs every 5 minutes)
SESSION=$(curl -sk https://10.0.1.50/jsonrpc -d '{"method":"exec",
  "params":[{"url":"/sys/login/user","data":{"user":"api-ops","passwd":"S3cret!pass"}}],
  "id":1}' | jq -r .session)

for ADOM in Retail MSSP-CustomerA; do
  curl -sk https://10.0.1.50/jsonrpc -d "{\"method\":\"get\",
    \"params\":[{\"url\":\"/dvmdb/adom/$ADOM/device\"}],
    \"session\":\"$SESSION\",\"id\":2}" >> /var/log/fmg-poll.log
done
# end of script

FMG-HQ # get system admin setting | grep idle_timeout_api
idle_timeout_api: 28800`,
    options: [
      'The script uses get on /dvmdb, which requires Super_User, so FortiManager locked the account',
      'The script never sends an exec on /sys/logout, so each run leaves a session open and api-ops reaches its maximum number of login sessions',
      'curl -k disables certificate checking, and FortiManager blocks clients that do not validate its certificate after several attempts',
      'The session token can be used for only one request, so the second ADOM query invalidates the account',
    ],
    answer: [1],
    explanation: 'Every run logs in and never logs out. With `idle_timeout_api` raised to 28800 s (8 hours; default 900 s) the orphaned sessions do not expire for hours, so at 12 logins an hour the user\'s **login-max** (default 32) is reached in under three hours, after which new logins for that account, GUI included, fail. (With the default 900 s timeout only about three would be open at a time, which is why the timeout matters.) Fortinet\'s API guide calls logout "critical to free up session slots". Reading `/dvmdb/adom/<adom>/device` needs only a suitable admin profile, not Super_User, and a permission problem returns -11, not a lockout. FortiManager does not detect whether a client validates its certificate. A session token is reusable for many requests until logout or timeout.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-009',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator wants to add FMG-B as an HA secondary of FMG-HQ, but System Settings > HA cannot be configured. What must the administrator do first?',
    exhibit: String.raw`FMG-HQ # get system global
admin-lockout-duration: 60
admin-lockout-threshold: 3
adom-mode           : normal
adom-status         : enable
...
faz-status          : enable
...
hostname            : FMG-HQ
...
workspace-mode      : normal`,
    options: [
      'Disable workspace mode, because HA cannot synchronize ADOM locks',
      'Disable the FortiAnalyzer features, because FortiManager cannot form an HA cluster while they are enabled',
      'Change the ADOM mode to advanced, because HA requires VDOM-level ADOM assignment',
      'Disable ADOMs, because HA supports only the root ADOM',
    ],
    answer: [1],
    explanation: '`faz-status : enable` means FortiAnalyzer features are on. Fortinet states that **FortiAnalyzer features must be disabled before you can form a FortiManager HA cluster** (and disabling them reboots the unit). Workspace mode, ADOMs and the ADOM device mode have no such restriction on HA; HA synchronizes the whole database regardless of how ADOMs are organized.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-010',
    topic: '1.1',
    type: 'multi',
    difficulty: 3,
    stem: 'An administrator wants FortiManager to manage the existing FortiAnalyzer FAZ-HQ so that Log View and Reports from FAZ-HQ appear in FortiManager. Which two conditions prevent the FortiAnalyzer from being added? (Choose two.)',
    options: [
      'FortiAnalyzer features are enabled on FortiManager',
      'ADOMs are enabled and the ADOM device mode is Advanced',
      'Workspace mode is enabled in all ADOMs',
      'ADOMs are enabled and the ADOM device mode is Normal',
      'FortiManager and FAZ-HQ run the same 7.6 firmware version',
      'Offline mode is disabled on FortiManager',
    ],
    answer: [0, 1],
    explanation: 'If FortiAnalyzer features are enabled on FortiManager, the **Add FortiAnalyzer** option is hidden. FortiManager also cannot add a FortiAnalyzer when ADOMs are enabled in **Advanced** device mode. Workspace mode does not block it, Normal device mode is the supported mode, and matching versions is a **requirement**, not an obstacle. Offline mode disabled is the normal state; enabling offline mode would stop device communication.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-011',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: 'FMG-HQ manages FortiAnalyzer FAZ-HQ in ADOM Retail. An administrator wants to keep Retail logs for 180 days. Where is this configured?',
    options: [
      'On FMG-HQ, in the Retail ADOM data policy',
      'On FAZ-HQ, because logs are stored there and its log storage settings cannot be changed from FortiManager',
      'On each FortiGate, with config log fortianalyzer setting',
      'On FMG-HQ, in System Settings > Storage Info, which is pushed to FAZ-HQ at the next synchronization',
    ],
    answer: [1],
    explanation: 'When FortiManager manages a FortiAnalyzer, logs and all data for FortiView, Log View, Incidents & Events and Reports stay on the **FortiAnalyzer**, and log storage settings are configured there; FortiManager only accesses the data remotely. The ADOM data policy and Storage Info on FortiManager apply when FortiManager itself has FortiAnalyzer features enabled. The FortiGate log setting only chooses where logs are sent, not how long they are kept.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-012',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Which TCP port does the FortiGate-FortiManager (FGFM) protocol use? (number)',
    answer: ['541', 'tcp 541', 'tcp/541'],
    explanation: 'FGFM, used by Device Manager for registration, install, retrieve, auto-update and keepalives, runs over **TCP 541**. Either side can open the connection. GUI and JSON API use HTTPS 443, FortiManager HA uses TCP 5199, and the local FDS uses TCP 8890/443 and UDP 53/8888.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-013',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Which FortiManager module does NOT communicate with managed FortiGates through its own protocol, but instead feeds the device database for installation by Device Manager?',
    options: [
      'Device Manager',
      'FortiGuard',
      'Policy & Objects',
      'FortiAnalyzer features',
    ],
    answer: [2],
    explanation: 'Fortinet lists three modules that talk directly to devices with protocols: **Device Manager** (FGFM), **FortiGuard** (FortiGuard update/rating protocols) and **FortiAnalyzer features** (logging protocol). Policy & Objects, like VPN Manager, AP Manager, FortiSwitch Manager and Extender Manager, uses the ADOM object database and indirectly edits the device database; the changes reach the FortiGate through a Device Manager install.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-014',
    topic: '1.1',
    type: 'order',
    difficulty: 2,
    stem: 'Put the stages of a policy package installation to a real FortiGate in the order FortiManager performs them.',
    items: [
      'Copy the relevant ADOM objects, templates and policy package into the FortiGate\'s device database',
      'Mark the device database as Modified',
      'Retrieve the running configuration from the FortiGate and compare it with the device database',
      'Install only the differences on the FortiGate over FGFM',
      'Generate the verification report and finish the install',
    ],
    explanation: 'FortiManager first performs the "VDOM copy" from the ADOM database into the device database, after which the device shows **Modified**. It then retrieves the real configuration, computes the diff and installs only the changed lines. The install log ends with the verification report and "install finished". Templates are applied to the device database in a fixed order (system template, pre-VDOM-copy CLI template, ... policy package, post-VDOM-copy CLI template) as part of the first stage.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-015',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Other requests from the same session to objects in ADOM Retail succeed. What is the cause of the error?',
    exhibit: String.raw`Request:
{
  "method": "get",
  "params": [ { "url": "/pm/config/adom/Retail/obj/firewall/adress" } ],
  "session": "Dr9f0BKtQjv2c4Wb6Hk8yLmPq1sT3uVx",
  "id": 11
}

Response (HTTP 200):
{
  "id": 11,
  "result": [
    {
      "status": { "code": -6, "message": "Invalid url" },
      "url": "/pm/config/adom/Retail/obj/firewall/adress"
    }
  ]
}`,
    options: [
      'The administrator lacks read permission for Policy & Objects in ADOM Retail',
      'The ADOM Retail does not exist',
      'The URL is wrong: the table is firewall/address, so FortiManager cannot resolve the path',
      'get requests on object tables must include a filter',
    ],
    answer: [2],
    explanation: 'Code **-6 "Invalid url"** means FortiManager cannot map the URL to a resource; here `adress` is misspelled. A permission problem returns -11 "No permission for the resource". Filters are optional performance tools, not required. The ADOM exists and the session has access to it, because other requests to Retail succeed.',
    lesson: '1.1-json-api',
  },
  {
    id: 'd1-016',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: 'A security team asks for every JSON API request and response on FMG-HQ (FortiManager 7.6) to be recorded in the event log. Which configuration does this?',
    options: [
      'config system global, set jsonapi-log all',
      'config system admin setting, set rpc-permit read-write',
      'config system global, set api-ip-binding enable',
      'config system locallog disk setting, set jsonrpc enable',
    ],
    answer: [0],
    explanation: 'FortiManager 7.6 added `set jsonapi-log {disable | request | response | all}` under `config system global` (disabled by default); `all` logs both requests and responses to the event log. `rpc-permit` is a per-admin (or per-profile) JSON API access level, not logging. `api-ip-binding` enables the source-IP check for JSON API requests. The last option is not a real setting.',
    lesson: '1.1-fmg-architecture',
  },
  {
    id: 'd1-017',
    topic: '1.2',
    type: 'single',
    difficulty: 1,
    stem: 'A new FortiManager appliance is connected to a laptop on the port1 network. The laptop has 192.168.1.10/24. How does the administrator log in for the first time?',
    options: [
      'Browse to https://192.168.1.99, log in as admin with an empty password, and set a new password when prompted',
      'Browse to https://192.168.1.1, log in as admin with the password fortinet',
      'Browse to http://192.168.1.99:8080, log in as maintainer using the serial number as the password',
      'Connect only through the console, because the factory default has no administrative access on any port',
    ],
    answer: [0],
    explanation: 'Factory default FortiManager: **port1 192.168.1.99/24**, GUI at `https://192.168.1.99`, user **admin** with a **blank** password. At the first GUI or CLI login FortiManager forces you to set a password (applies to hardware and VMs). 192.168.1.1 and `fortinet` are not FortiManager defaults, HTTP on 8080 is not the default GUI, and port1 does allow HTTPS out of the box.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-018',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'During the FortiManager Setup wizard an administrator clicks Later wherever possible to finish quickly. Which step can NOT be postponed before the administrator can use the FortiManager?',
    options: [
      'Specify the hostname',
      'Upgrade the firmware to the latest version on FortiGuard',
      'Register with FortiCare',
      'Configure the automatic system backup',
    ],
    answer: [2],
    explanation: 'The wizard requires the **Register with FortiCare** step (and FortiCare single sign-on) to be completed before the appliance or VM can be used; in air-gapped networks an entitlement file is imported instead. Hostname, firmware upgrade and the optional backup strategy step can be handled later or skipped.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-019',
    topic: '1.2',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the factory default IPv4 address of FortiManager port1? (dotted decimal, no mask)',
    answer: ['192.168.1.99'],
    explanation: 'FortiManager ships with **192.168.1.99/255.255.255.0** on port1, reachable at `https://192.168.1.99`. Give the management PC an address in 192.168.1.0/24 for the first connection.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-020',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After initial CLI configuration, the administrator can ping 10.0.1.50 and SSH to it from 10.0.1.20, but the browser cannot open https://10.0.1.50. What should the administrator change?',
    exhibit: String.raw`FMG-HQ # show system interface port1
config system interface
    edit "port1"
        set ip 10.0.1.50 255.255.255.0
        set allowaccess ping ssh
        set type physical
    next
end`,
    options: [
      'Add a static route to 10.0.1.0/24 through port1',
      'Add https to allowaccess on port1',
      'Enable serviceaccess fgtupdates on port1',
      'Enable the admin trusted host 10.0.1.20/32, because no trusted hosts are configured',
    ],
    answer: [1],
    explanation: '`allowaccess` controls which administrative protocols the interface accepts. Ping and SSH are allowed, HTTPS is not, so the GUI is refused: `set allowaccess https ssh ping`. The PC is on the directly connected subnet, so no route is needed. `serviceaccess` is for FortiGuard services, not the GUI. Trusted hosts restrict access; having none configured does not block anything.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-021',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An MSSP wants to create the ADOMs MSSP-CustomerA and MSSP-CustomerB on this FortiManager. What must be done first?',
    exhibit: String.raw`FMG-HQ # get system status
Platform Type                   : FMG-VM64
Platform Full Name              : FortiManager-VM64
Version                         : v7.6.5-build3653 251212 (GA.M)
Serial Number                   : FMG-VM0A26000101
Hostname                        : FMG-HQ
Max Number of Admin Domains     : 25
Admin Domain Configuration      : Disabled
HA Mode                         : Stand Alone
License Status                  : Valid`,
    options: [
      'Configure HA, because ADOMs are only available on a cluster',
      'Enable ADOMs as a Super_User administrator (System Information widget, or config system global, set adom-status enable)',
      'Change the ADOM device mode to advanced',
      'Purchase an ADOM licence, because Max Number of Admin Domains shows only the root ADOM',
    ],
    answer: [1],
    explanation: '"Admin Domain Configuration : Disabled" means the ADOM feature is off (the default). A **Super_User** enables it with the Administrative Domain toggle or `set adom-status enable`; the admin is logged out and can then create ADOMs. HA is unrelated to ADOMs. Advanced device mode is only needed to split VDOMs of one FortiGate between ADOMs. The output shows a maximum of 25 ADOMs, so licensing is not the obstacle.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-022',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two requirements must be met before adding FortiAnalyzer FAZ-HQ to FortiManager FMG-HQ? (Choose two.)',
    options: [
      'FMG-HQ and FAZ-HQ run the same firmware version',
      'FortiAnalyzer features are disabled on FMG-HQ',
      'FMG-HQ is in offline mode during the wizard',
      'FAZ-HQ is configured as an HA secondary of FMG-HQ',
      'ADOMs on FMG-HQ use the Advanced device mode',
    ],
    answer: [0, 1],
    explanation: 'Fortinet requires **the same version** on both units and that **FortiAnalyzer features are disabled** on FortiManager (otherwise Add FortiAnalyzer is hidden). Offline mode would stop FortiManager from talking to devices. A FortiAnalyzer cannot be a FortiManager HA member. Advanced device mode actually **prevents** adding a FortiAnalyzer.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-023',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator connected over SSH from a remote site must return FMG-B to factory settings before reusing it, but there is nobody on site to reconnect the network. Which command should be used?',
    options: [
      'execute reset all-settings',
      'execute reset all-except-ip',
      'execute reset all-shutdown',
      'execute restore all-settings with keepbasic',
    ],
    answer: [1],
    explanation: '`execute reset all-except-ip` resets everything to factory defaults **except the current IP address and route information**, so the unit stays reachable. `all-settings` also resets port1 to 192.168.1.99, and `all-shutdown` resets and powers off. `execute restore all-settings ... keepbasic` restores a backup file while keeping IP and routing; it is not a factory reset.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-024',
    topic: '1.2',
    type: 'order',
    difficulty: 2,
    stem: 'Put the FortiManager initial setup tasks in the order recommended by the FortiManager 7.6 Administration Guide.',
    items: [
      'Connect to the GUI',
      'Configure the RAID level, if the unit supports RAID',
      'Configure network settings',
      'Configure administrative domains (optional)',
      'Configure administrator accounts',
    ],
    explanation: 'The guide\'s initial setup order is: connect to the GUI, configure RAID (hardware with RAID support), configure the network interfaces, optionally configure ADOMs, then create administrator accounts. Fortinet also recommends creating your own Super_User account and logging in with it after the first login.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-025',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'During planning, an architect argues that ADOMs can "just be switched off later" if the MSSP decides it does not need them. Why is this a poor assumption?',
    options: [
      'Disabling ADOMs requires a firmware reinstall',
      'Disabling ADOMs requires moving every device back to the root ADOM and deleting all non-root ADOMs first',
      'Once enabled, ADOMs can never be disabled',
      'Disabling ADOMs deletes every policy package in every ADOM automatically',
    ],
    answer: [1],
    explanation: 'ADOMs can be disabled, but only after **all devices are moved to root and every non-root ADOM is deleted**; FortiManager refuses while ADOMs with devices exist. That is a major change once customers are separated, so the ADOM decision belongs in initial planning. No firmware reinstall is involved, and nothing is deleted automatically: deleting the ADOMs (which you must do yourself) is what removes their packages.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-026',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FMG-HQ can reach devices on 10.0.1.0/24, but FortiGates in remote stores (172.16.0.0/12) never connect, and execute ping 172.16.10.1 fails. The site router is 10.0.1.1. What is the problem?',
    exhibit: String.raw`FMG-HQ # show system interface port1
config system interface
    edit "port1"
        set ip 10.0.1.50 255.255.255.0
        set allowaccess ping https ssh
    next
end

FMG-HQ # show system route
config system route
    edit 1
        set device "port1"
        set dst 0.0.0.0 0.0.0.0
        set gateway 10.0.2.1
    next
end`,
    options: [
      'The default route points to 10.0.2.1, which is not on the port1 subnet; it should point to 10.0.1.1',
      'port1 needs fgfm in allowaccess for FortiGates to connect',
      'FortiManager requires a specific route to 172.16.0.0/12 because it ignores default routes for FGFM',
      'The route must use device "any" instead of port1',
    ],
    answer: [0],
    explanation: 'The only route sends everything to **10.0.2.1**, an address not reachable on port1\'s 10.0.1.0/24 subnet, so off-subnet traffic fails. Changing the gateway to the site router 10.0.1.1 fixes it. FortiManager 7.6 `allowaccess` options are fabric, http, https, ping, snmp, soc-fabric and ssh; there is no `fgfm` keyword to add. A default route is used normally for FGFM, and `config system route` takes a real interface name.',
    lesson: '1.2-initial-configuration',
  },
  {
    id: 'd1-027',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'FGT-Branch2 is in an ADOM whose mode is Backup. Which action can the FortiManager administrator still perform on it from FortiManager?',
    options: [
      'Install a policy package to it with the Install Wizard',
      'Run a CLI script directly on the FortiGate',
      'Assign it to a VPN Manager community',
      'Push a system template that changes its DNS settings',
    ],
    answer: [1],
    explanation: 'Backup-mode ADOMs store device configurations and revisions but **do not push configuration** through installs. Scripts are still allowed directly on the FortiGate, and existing revisions can be pushed back. Policy package installs, provisioning templates and central management (VPN, FortiAP, FortiSwitch) are Normal-mode features.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-028',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After adding FGT-Branch2 to the ADOM and clicking Import Now in the Add Device wizard, the administrator sees the FortiGate\'s address and service objects in Policy & Objects, but no policy package. Why?',
    exhibit: String.raw`System Settings > ADOMs > Edit ADOM

Name                  : Stores-Archive
Type                  : FortiGate
Version               : 7.6
Mode                  : Backup
Devices               : FGT-Branch2 [root]
Time Zone             : (GMT-5:00) Eastern Time (US & Canada)`,
    options: [
      'Import into a 7.6 ADOM always creates the package later, after the first install',
      'In a backup-mode ADOM only objects are imported, not policies',
      'The device must be in Advanced device mode to import policies',
      'The wizard requires workspace mode to create policy packages',
    ],
    answer: [1],
    explanation: 'In a **Backup** ADOM the import option brings **objects only** into the ADOM database (where they can be shared with other devices); policies are not imported and no package is created. The device\'s full configuration, policies included, is still held in its device database and revision history. Version, device mode and workspace mode do not change this behaviour.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-029',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: 'An MSSP hosts several customers as VDOMs on one large FortiGate and wants each customer VDOM to live in its own ADOM. What must be configured?',
    options: [
      'ADOM operation mode Backup',
      'ADOM device mode Advanced',
      'Workspace mode per-ADOM',
      'A Fabric-type ADOM for each customer',
    ],
    answer: [1],
    explanation: 'Only **Advanced** device mode (`config system global`, `set adom-mode advanced`) allows VDOMs of one FortiGate to be assigned to different ADOMs; in Normal mode the whole device belongs to one ADOM. Backup is an operation mode for storing configurations, per-ADOM workspace controls locking, and the ADOM type controls which device types are accepted.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-030',
    topic: '1.3',
    type: 'multi',
    difficulty: 3,
    stem: 'An administrator plans to change the ADOM device mode from Normal to Advanced. Which two consequences should the administrator expect? (Choose two.)',
    options: [
      'VDOMs of the same FortiGate can be assigned to different ADOMs',
      'Individual devices can no longer be locked in workspace mode',
      'Each VDOM can have its own FortiAnalyzer added through Add FortiAnalyzer',
      'ADOM versions become editable so that each VDOM can use its own version',
      'All ADOMs are converted to backup mode',
    ],
    answer: [0, 1],
    explanation: 'Advanced mode lets you split VDOMs across ADOMs, and Fortinet notes that **individual devices cannot be locked** in workspace mode when ADOMs are in advanced mode. You actually **cannot add a FortiAnalyzer** at all in advanced mode. ADOM versions are never editable (only upgradable), and device mode is independent of the Normal/Backup operation mode.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-031',
    topic: '1.3',
    type: 'fill',
    difficulty: 1,
    stem: 'Complete the command that enables ADOMs: config system global / set ________ enable / end',
    answer: ['adom-status'],
    explanation: '`set adom-status enable` under `config system global` turns on administrative domains (default `disable`). The GUI equivalent is the Administrative Domain toggle in the System Information widget. Only Super_User administrators can do this.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-032',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FMG-HQ runs FortiManager 7.6.5. Which FortiGates can be managed in ADOM Retail (version 7.6), including import and policy package install?',
    exhibit: String.raw`Device Manager > Device & Groups (ADOM Retail, version 7.6)

Device         Platform        Firmware
-------------  --------------  ----------------
FGT-Branch1    FortiGate-VM64  FortiOS v7.6.4
FGT-Branch2    FortiGate-100F  FortiOS v7.4.9
FGT-Branch3    FortiGate-60F   FortiOS v7.2.11
FGT-Branch4    FortiGate-60E   FortiOS v7.0.17`,
    options: [
      'Only FGT-Branch1, because a 7.6 ADOM manages only FortiOS 7.6',
      'FGT-Branch1 and FGT-Branch2 only, because an ADOM supports its own version and one earlier version',
      'All four FortiGates, because on FortiManager 7.6.5 a 7.6 ADOM supports FortiOS 7.6, 7.4, 7.2 and 7.0',
      'FGT-Branch1, FGT-Branch2 and FGT-Branch3 only, because FortiManager 7.6 cannot manage FortiOS 7.0',
    ],
    answer: [2],
    explanation: 'In FortiManager 7.6.5 the **7.6 ADOM supports FortiOS 7.6.x, 7.4.x, 7.2.x and 7.0.x** for adding devices, importing and installing (7.0 support for the 7.6 ADOM arrived in 7.6.3). FortiManager handles the differences by upgrading or downgrading CLI syntax. The support matrix is published per FortiManager build and changes between patches, which is why the stem names 7.6.5. Fortinet still recommends aligning firmware and ADOM version rather than running mixed versions permanently.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-033',
    topic: '1.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each predefined FortiManager admin profile to its default access.',
    pairs: [
      ['Super_User', 'All system and device privileges; the profile cannot be edited'],
      ['Standard_User', 'No system privileges; read-write device privileges'],
      ['Restricted_User', 'No system privileges; read-only device privileges'],
      ['Package_User', 'Read-write policy and objects; read-only system and other privileges'],
      ['Password_Change_User', 'Can only change passwords through the CLI or API'],
    ],
    explanation: 'These are Fortinet\'s definitions of the predefined profiles. No_Permission_User (not listed here) has no system or device privileges. Predefined profiles cannot be deleted; Super_User cannot be edited, while the standard and restricted profiles can be.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-034',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Workspace mode is enabled. An operator with this profile can lock and edit the Branch-PP policy package but gets a permission error when clicking Lock next to the ADOM name. Why?',
    exhibit: String.raw`FMG-HQ # show system admin profile Retail_Ops
config system admin profile
    edit "Retail_Ops"
        set system-setting none
        set adom-switch read-write
        set device-manager read-write
        set policy-objects read-write
        set adom-policy-packages read-write
        set deploy-management read-write
        set adom-lock none
        set device-policy-package-lock read-write
    next
end`,
    options: [
      'system-setting none hides the ADOM banner, including its lock button',
      'adom-lock none denies the Lock/Unlock ADOM permission, while device-policy-package-lock read-write still allows locking individual devices and packages',
      'deploy-management read-write automatically locks the ADOM for installs, so a manual lock is refused',
      'adom-switch read-write lets the operator switch ADOMs but never lock them; only Super_User can lock an ADOM',
    ],
    answer: [1],
    explanation: 'Admin profiles have separate permissions for **Lock/Unlock ADOM** (`adom-lock`) and **Lock/Unlock Device/Policy Package** (`device-policy-package-lock`). With `adom-lock none` the operator cannot lock the ADOM but can still lock Branch-PP. System Settings access does not control the banner lock, deploy rights do not auto-lock, and Standard_User and Package_User profiles have Read-Write ADOM lock by default, so locking is not Super_User-only.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-035',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'An MSSP wants the lead administrator of customer A to manage the other administrator accounts of ADOM MSSP-CustomerA only, without seeing administrators of other customers. Which FortiManager 7.6 feature fits?',
    options: [
      'A Restricted Admin profile with Allow to Install',
      'An ADOM Scoped Admin profile, applied to an account whose Administrative Domain is Specify (MSSP-CustomerA) with a Single admin profile',
      'The Package_User profile with per-ADOM assignment',
      'A wildcard RADIUS administrator with ext-auth-adom-override',
    ],
    answer: [1],
    explanation: 'The **ADOM Scoped Admin** profile type, new in 7.6.0, limits an administrator to managing administrators inside their own ADOM. It is selectable only when the account uses **Specify** for Administrative Domain and **Single** for Admin Profile; Fortinet recommends System Settings = None so the account cannot change global settings. Restricted Admin profiles delegate web filter, IPS and application control profiles. Package_User and RADIUS overrides do not give scoped user management.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-036',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Users jsmith and mlee take turns logging in to FMG-HQ from the same workstation, 10.0.10.25. NPS-1 accepts both users\' AD credentials. jsmith gets in, but mlee is rejected. What is the most likely reason?',
    exhibit: String.raw`FMG-HQ # show system admin user RADIUS-Admins
config system admin user
    edit "RADIUS-Admins"
        set user_type radius
        set radius_server "NPS-1"
        set wildcard enable
        set profileid "Standard_User"
        set adom-access specify
        set adom "Retail"
        set ext-auth-group-match "FMG-Retail-Ops"
        set trusthost1 10.0.10.0 255.255.255.0
    next
end`,
    options: [
      'Wildcard accounts allow only one simultaneous remote user',
      'mlee is not a member of the group FMG-Retail-Ops returned by the RADIUS server',
      'mlee must also exist as a local administrator because wildcard is enabled',
      'Standard_User cannot be assigned to remote administrators',
    ],
    answer: [1],
    explanation: '`ext-auth-group-match` allows only remote users who belong to the named group to log in through this wildcard account, so a valid RADIUS user outside FMG-Retail-Ops is rejected. Wildcard accounts serve any number of users and remove the need for matching local accounts. Any profile can be assigned to a remote admin. The trusted host 10.0.10.0/24 is not the cause, because both users log in from the same permitted address 10.0.10.25.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-037',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about remote (non-local) administrator authentication on FortiManager are correct? (Choose two.)',
    options: [
      'A wildcard administrator lets any user accepted by the remote server log in with that account\'s profile and ADOM scope',
      'Remote authentication server groups (config system admin group) can be created only in the GUI',
      'With ext-auth-adom-override enabled, the ADOM supplied by the remote server is used instead of the account\'s ADOM setting',
      'PKI administrators must always enter a username and password in addition to their certificate',
      'Without the wildcard option, any username accepted by the RADIUS server can log in',
    ],
    answer: [0, 2],
    explanation: 'Wildcard ("Match all users on remote server") maps every user the server accepts to one FortiManager account. `ext-auth-adom-override` (and `ext-auth-accprofile-override` for the profile) lets the server decide. Server **groups are CLI-only**. PKI needs only a valid certificate unless two-factor is required. Without wildcard, the FortiManager username must **exactly match** the remote user.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-038',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator left for the day with ADOM Retail locked. Another Super_User needs to make urgent changes in Retail. ADOM lock override is disabled. What can the second administrator do?',
    exhibit: String.raw`Dashboard > System Information > Current Session List

User Name        IP Address              Start Time            Time Out (mins)
---------------  ----------------------  --------------------  ---------------
admin (current)  10.0.10.15 (GUI)        2026-10-29 07:58:12   15
jdoe             10.0.10.44 (GUI)        2026-10-28 16:02:40   480
netops           10.0.10.51 (SSH)        2026-10-29 07:30:05   15`,
    options: [
      'Nothing until jdoe\'s session times out, because only the locking administrator can release a lock',
      'Select jdoe\'s session and delete it, which disconnects jdoe and releases the locks held in that session',
      'Run diagnose ha force-resync to clear all ADOM locks',
      'Disable and re-enable ADOMs to clear the lock',
    ],
    answer: [1],
    explanation: 'Locks belong to the session. Deleting a session in the **Current Session List** (or `diagnose system admin-session kill <sid>`) disconnects the administrator, and all elements are unlocked when an admin logs out or is disconnected. Waiting for the 480-minute timeout works but is not necessary. `force-resync` is an HA command, and disabling ADOMs is impossible while ADOMs contain devices.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-039',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which FortiManager CLI command lists the current administrator login sessions? (full command)',
    answer: ['diagnose system admin-session list', 'diag system admin-session list', 'diag sys admin-session list', 'diagnose sys admin-session list'],
    explanation: '`diagnose system admin-session list` lists sessions; `diagnose system admin-session status` shows your own; `diagnose system admin-session kill <sid>` disconnects one. The GUI equivalent is the Current Session List in the System Information widget.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-040',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Two administrators edited the same firewall policy in Branch-PP at the same time and one administrator\'s change was silently overwritten. What change prevents this for every ADOM?',
    exhibit: String.raw`FMG-HQ # get system global
...
adom-mode           : normal
adom-status         : enable
...
lock-preempt        : disable
...
workspace-mode      : disabled`,
    options: [
      'set lock-preempt enable',
      'set workspace-mode normal',
      'set adom-mode advanced',
      'set workspace-mode per-adom and leave each ADOM on Disable',
    ],
    answer: [1],
    explanation: '`workspace-mode disabled` (the default) means **concurrent ADOM access**: several admins can change the same ADOM and the last save wins. `set workspace-mode normal` enables workspace for all ADOMs so the ADOM, a device or a package must be locked before editing. `lock-preempt` only lets someone override an existing lock and does nothing while workspace is off. Advanced device mode is about VDOM assignment. Per-ADOM with every ADOM on Disable changes nothing.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-041',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Workspace mode is enabled on FMG-HQ (workspace-mode normal). Which two statements are correct? (Choose two.)',
    options: [
      'Device Manager and Policy & Objects are read-only until the administrator locks the ADOM, a device or a policy package',
      'All locks held by an administrator are released when that administrator logs out',
      'Any administrator with read-write Policy & Objects permission can unlock an ADOM locked by someone else, by default',
      'Individual devices can be locked even when the ADOM device mode is Advanced',
      'JSON API calls that change device-level settings must lock the ADOM first',
    ],
    answer: [0, 1],
    explanation: 'In workspace mode the panes are read-only until you lock something, and every lock is released at logout. Only the locking admin can unlock unless **lock-preempt** (ADOM lock override) is enabled. Individual device locks are **not** available in Advanced device mode. Fortinet notes that the API does **not** need an ADOM lock for device-level changes.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-042',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Administrator jdoe locked ADOM Retail and is unavailable. Administrator asmith, who has Lock/Unlock ADOM permission, wants to unlock Retail without disconnecting jdoe and accepts that jdoe\'s unsaved changes will be lost. Workspace locking must stay in force for all ADOMs. What must be changed?',
    exhibit: String.raw`FMG-HQ # config system global
FMG-HQ (global) # get
...
lock-preempt        : disable
...
workspace-mode      : normal`,
    options: [
      'set lock-preempt enable',
      'set workspace-mode workflow',
      'set workspace-mode disabled',
      'Nothing; Super_User can always override, so asmith must be made a Super_User',
    ],
    answer: [0],
    explanation: '**ADOM lock override** (`set lock-preempt enable`, default disable) lets an administrator unlock an ADOM locked by someone else, discarding that admin\'s unsaved changes. Workflow mode adds approvals and still locks. Disabling workspace removes locking entirely (and warns users may lose unsaved data), which is broader than asked and changes every ADOM. Without lock-preempt, the documented way is to disconnect the locking admin, not to grant Super_User.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-043',
    topic: '1.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each workspace-mode value under config system global to its effect.',
    pairs: [
      ['disabled', 'Concurrent ADOM access; administrators do not lock anything (default)'],
      ['normal', 'Workspace: lock the ADOM, a device or a policy package before making changes'],
      ['workflow', 'Lock the ADOM and use workflow sessions with approval before changes are installed'],
      ['per-adom', 'Disable, Workspace or Workflow is chosen for each ADOM in System Settings > ADOMs'],
    ],
    explanation: 'The four values of `workspace-mode` are `disabled` (default), `normal`, `workflow` and `per-adom`. Changing the mode ends your GUI session. In workflow mode the ADOM must be locked and a workflow session started before policy or object changes, and the session is submitted for approval.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-044',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: 'In workspace mode, administrator A has locked only the policy package Branch-PP in ADOM Retail. Administrator B tries to lock the whole Retail ADOM to add a new device. What happens?',
    options: [
      'B locks the ADOM and A\'s package lock is converted to read-only',
      'B can lock the ADOM only by disconnecting administrator A, which breaks A\'s lock',
      'B is not affected, because device additions do not need the ADOM lock',
      'B\'s ADOM lock succeeds and A\'s unsaved package changes are saved automatically',
    ],
    answer: [1],
    explanation: 'When another administrator holds an individual device or package lock, the ADOM can be locked **only by disconnecting that administrator** and breaking the lock. Adding devices and policy packages requires the **whole ADOM** to be locked, so B does need it. Lock conversion and automatic saving do not exist; locking the ADOM yourself removes only **your own** device and package locks.',
    lesson: '1.3-admins-workspace',
  },
  {
    id: 'd1-045',
    topic: '1.3',
    type: 'order',
    difficulty: 2,
    stem: 'Put the steps for upgrading ADOM Retail from version 7.4 to 7.6 in the order that follows the FortiManager 7.6 Administration Guide procedure.',
    items: [
      'Run ADOM Upgrade Readiness on Retail, fix the reported issues and confirm every device\'s FortiOS version is supported by a 7.6 ADOM',
      'Immediately before the change, back up the FortiManager configuration or take a VM snapshot',
      'Select Retail in System Settings > ADOMs and choose More > Upgrade',
      'Upgrade the FortiGates in the ADOM to FortiOS 7.6 and resynchronize them',
    ],
    explanation: 'Check first: the readiness tool reports configuration that is invalid or missing in 7.6 syntax (it cannot fix it for you), and the lowest device firmware must be supported by the new ADOM version. Take the backup or snapshot right before the upgrade so it can be rolled back. Then run the one-click upgrade, and finally upgrade and resynchronize the devices, as in Fortinet\'s procedure.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-046',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A Super_User selects all three ADOMs and chooses More > Upgrade. What is the result?',
    exhibit: String.raw`System Settings > ADOMs

Name              Firmware Version   Devices
----------------  -----------------  -------
Retail            7.4                12
MSSP-CustomerA    7.4                3
MSSP-CustomerB    7.2                2`,
    options: [
      'All three ADOMs are upgraded to 7.6 in one operation',
      'The upgrade is not allowed as selected; only ADOMs of the same version can be upgraded together, so Retail and MSSP-CustomerA must be done separately from MSSP-CustomerB',
      'MSSP-CustomerB is upgraded to 7.4 and the other two to 7.6',
      'The upgrade succeeds only if workspace mode is disabled',
    ],
    answer: [1],
    explanation: 'Multiple ADOMs can be upgraded at once only if they are **on the same version** (for example several 7.4 ADOMs). A 7.2 and a 7.4 ADOM cannot be upgraded together; the same rule applies to the readiness check. Each upgrade moves an ADOM to the next supported version. Workspace mode does not affect ADOM upgrades.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-047',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Branch2 was upgraded to FortiOS 7.6 and moved from ADOM Retail (7.4) to ADOM Retail-76 (7.6). What should the administrator do next so that policies can be managed for it in Retail-76?',
    exhibit: String.raw`ADOM Retail-76 > Device Manager > Managed FortiGate

Device        IP            Config Status   Policy Package
------------  ------------  --------------  --------------
FGT-Branch2   172.16.20.1   Synchronized    (none)`,
    options: [
      'Nothing; Branch-PP moved with the device and will appear after a refresh',
      'Run the Import Configuration (import policy) wizard for FGT-Branch2 in Retail-76, or assign an existing package there, then install',
      'Revert FGT-Branch2 to its last revision from Retail, which restores the package link',
      'Move FGT-Branch2 back, because a device that has been in a 7.4 ADOM cannot be managed in a 7.6 ADOM',
    ],
    answer: [1],
    explanation: 'Moving a device carries its **device database**, but **policy packages and ADOM objects stay in the old ADOM**. In the new ADOM the device has no package, so import its policy (creating a package and importing objects, resolving any conflicts) or assign an existing package, then install. A revert loads a revision into the device database only and does not create packages. Moving an upgraded device to an ADOM of its new version is exactly the documented migration path.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-048',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'A FortiGate that uses VPN Manager and policy package Branch-PP is moved from ADOM Retail to ADOM HQ. Which two items stay behind in ADOM Retail? (Choose two.)',
    options: [
      'The policy package Branch-PP and the Retail object database',
      'The VPN Manager communities the FortiGate belongs to',
      'The FortiGate\'s device database',
      'The FortiGate\'s interface and routing configuration',
      'The FortiGate\'s firmware version record',
    ],
    answer: [0, 1],
    explanation: 'Policy packages, objects and **VPN Manager** settings are ADOM-level and do not move; Fortinet does not recommend moving FortiGates that VPN Manager configures, because those VPN settings belong to the original ADOM (the VPN has to be rebuilt in the new one). The device database, which holds interfaces, routing and the device\'s properties such as firmware, moves with the device.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-049',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The scheduled backup ran at 02:30. At 02:31 an administrator started a manual backup from the CLI. Why did the manual backup fail?',
    exhibit: String.raw`FMG-HQ # show system backup all-settings
config system backup all-settings
    set status enable
    set server "10.0.1.60"
    set user "backupuser"
    set directory "/backups"
    set week_days monday tuesday wednesday thursday friday saturday sunday
    set time 02:30:00
    set protocol sftp
end

02:31:14  FMG-HQ # execute backup all-settings sftp 10.0.1.60 /backups/manual.dat backupuser ********
Starting backup all settings in background, Please wait.
Failed to backup all-settings due to backup in progress
Backup all settings...Failed.

Event log entry at 02:31:14:
  Backup all settings fail (backup in progress)`,
    options: [
      'The manual backup used a different encryption password from the scheduled one',
      'Only one backup can run at a time and the scheduled backup was still in progress',
      'Manual backups are blocked while a backup schedule is enabled',
      'The SFTP server allows only one session per user',
    ],
    answer: [1],
    explanation: 'FortiManager performs **one backup at a time**; a backup started while another is running fails with *Backup all settings fail (backup in progress)* in the event log (7.6.2 also shows a GUI error). Each backup can use its own encryption password, schedules do not block manual backups once the scheduled one finishes, and the message is generated by FortiManager, not the SFTP server. A successful backup records its MD5 checksum in the event log for verification.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-050',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which execute command imports a backup from an SFTP server onto a FortiManager of a different model or platform? (first three words of the command)',
    answer: ['execute migrate all-settings', 'exec migrate all-settings'],
    explanation: '`execute migrate all-settings {ftp | scp | sftp} <ip> <file> <user> <password> [<crptpasswd>]` migrates a backup to a different platform or version (GUI: Restore with *Migrate from a different platform*). Enable ADOMs on the target first if the source used them; system settings are not migrated, and FortiGuard databases must be exported/imported separately.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-051',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After restoring the FMG-HQ backup onto replacement unit FMG-HQ2, every managed FortiGate shows as disconnected in Device Manager, although routing and FortiGate configuration are unchanged. What should the administrator do?',
    exhibit: String.raw`FMG-HQ2 # get system admin setting
access-banner       : disable
admin-https-redirect: enable
admin-login-max     : 256
...
auto-update         : enable
...
offline_mode        : enable
...`,
    options: [
      'Re-add every FortiGate with the Add Device wizard, because restored device databases cannot reconnect',
      'Disable offline mode (System Settings > Advanced > Advanced Settings, or set offline_mode disable), once the old FortiManager no longer manages the devices',
      'Disable auto-update, which blocks FGFM after a restore',
      'Restore the backup again with keepbasic',
    ],
    answer: [1],
    explanation: 'A restore **enables offline mode** as a safety measure so that two FortiManagers do not manage the same devices; offline mode shuts down FGFM, so devices appear down. Disable it when this unit should take over. Re-adding devices is unnecessary, auto-update only controls how FortiGate-side changes are accepted, and restoring again would just re-enable offline mode.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-052',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about FortiManager system backups are correct? (Choose two.)',
    options: [
      'An MD5 checksum of each backup is recorded in the event log',
      'The backup includes the FortiGuard AV/IPS packages and web filter databases downloaded by FortiManager',
      'Backups can be encrypted with a password, and FortiManager uses AES-GCM for backup encryption',
      'Restoring a backup keeps the administrator accounts currently on the unit',
      'A backup can be taken while another backup is running if a different protocol is used',
    ],
    answer: [0, 2],
    explanation: 'Each backup writes its MD5 checksum and file name to the event log, and backups are encrypted with your password using **AES-GCM**. FortiGuard databases are **not** in the configuration backup (export/import them separately). A restore replaces the settings, **including administrator accounts and passwords**. Only one backup runs at a time regardless of protocol.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-053',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What does keepbasic do in this command?',
    exhibit: String.raw`FMG-HQ # execute restore all-settings sftp 10.0.1.60 /backups/FMG-HQ-2026-10-29.dat backupuser Str0ng! Encr7pt! keepbasic`,
    options: [
      'It restores only the basic system settings and skips device and ADOM databases',
      'It keeps the current IP address and routing information of the unit instead of taking them from the file',
      'It keeps the current administrator accounts',
      'It prevents the unit from entering offline mode after the restore',
    ],
    answer: [1],
    explanation: 'The restore option **keepbasic** retains the IP and routing information of the unit being restored (in the GUI, the closest equivalent is leaving "Overwrite current IP, routing and HA settings" unchecked, which also keeps the HA settings). Everything else, including databases and admin accounts, is replaced from the file, and the unit restarts. Offline mode is still enabled after a restore.',
    lesson: '1.3-adom-upgrade-backup',
  },
  {
    id: 'd1-054',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'An MSSP manages 40 customers. Each customer has its own FortiGates on different FortiOS versions, and each customer\'s staff must see only their own devices and policies. Which ADOM design fits best?',
    options: [
      'One ADOM for all customers with a policy package per customer and per-package admin access',
      'One ADOM per customer, with each ADOM on a version that matches that customer\'s FortiGates and admins restricted to their ADOM',
      'One ADOM per FortiOS version, with customers sharing the object database',
      'Leave ADOMs disabled and use device groups per customer',
    ],
    answer: [1],
    explanation: 'Per-customer ADOMs give each customer a separate object database, policy packages and device list, admins can be limited to their ADOM, and each ADOM\'s version can follow that customer\'s firmware and be upgraded independently. One shared ADOM or per-version ADOMs mix customers\' objects, and device groups without ADOMs do not separate objects or policies.',
    lesson: '1.3-adom-concepts-modes',
  },
  {
    id: 'd1-055',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: 'A retailer has 400 store FortiGates that use the same security policy, plus a head-office cluster maintained by a separate team. Which ADOM configuration is most appropriate?',
    options: [
      'One ADOM per store so that each store can be upgraded separately',
      'An ADOM for the stores with a shared policy package installed to device groups, a separate ADOM for head office, and workspace mode so the teams do not overwrite each other',
      'A single backup-mode ADOM for all devices so that policies are configured locally',
      'Advanced device mode so that each store VDOM can be placed in a regional ADOM',
    ],
    answer: [1],
    explanation: 'Stores that share policy belong in one ADOM where one package (with per-device mappings) can be installed to many devices; head office, run by another team with different rules, gets its own ADOM; workspace mode prevents concurrent overwrites. 400 ADOMs would exceed most ADOM licences and duplicate every object. Backup mode cannot push policy. Advanced mode is for splitting VDOMs of the same FortiGate, not for separate store devices.',
    lesson: '1.3-adom-concepts-modes',
  },
];
