// Domain 6 — Automation and Artificial Intelligence. Original questions modelled on Cisco's public exam-topic wording; no recalled exam content. Every Python script in an exhibit was compiled with Python 3, and every script-output key was confirmed by running the script offline (scripts that call requests were run with the HTTP call replaced by the JSON body shown). Every JSON exhibit and option was checked with python3 -m json.tool. RESTCONF behaviour from RFC 8040, HTTP codes from RFC 9110, Catalyst Center and SD-WAN Manager behaviour from developer.cisco.com and Cisco's Catalyst Center SDK, EEM keywords from Cisco-IOS-XE-eem.yang (17.18.1). Device output is documentation-based and listed in REVIEW-TODO.md.
const L61B = '6.1-python-basics';
const L61N = '6.1-python-network-scripts';
const L62 = '6.2-json';
const L63 = '6.3-yang';
const L64C = '6.4-catalyst-center-api';
const L64S = '6.4-sdwan-manager-api';
const L65C = '6.5-catalyst-center-responses';
const L65R = '6.5-restconf-responses';
const L66C = '6.6-eem-configuration';
const L66T = '6.6-eem-troubleshooting';
const L66D = '6.6-eem-data-collection';
const L67A = '6.7-agent-based';
const L67L = '6.7-agentless';

const bank = [
  // ---------- 6.1 Python ----------
  { topic: '6.1', type: 'single', difficulty: 1, lesson: L61B,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `devices = ["R1", "R2", "SW1", "SW2", "DSW1"]
switches = [d for d in devices if "SW" in d]
print(devices[1:3], devices[-1], len(switches))`,
    options: ["['R2', 'SW1'] DSW1 3", "['R2', 'SW1', 'SW2'] DSW1 3", "['R2', 'SW1'] DSW1 2", "['R1', 'R2'] SW2 2"],
    answer: [0],
    explanation: "Indexes start at 0, so `devices[1:3]` takes items 1 and 2 (`'R2'` and `'SW1'`); the stop index 3 is excluded, which rules out the three-item list. `devices[-1]` is the last item, `'DSW1'`. The comprehension keeps every name containing the substring `SW`, and `'DSW1'` contains it too, so `switches` has three items, not two. The last option starts the slice at 0 and treats -1 as the second-to-last item." },
  { topic: '6.1', type: 'fill', difficulty: 2, lesson: L61B,
    stem: 'Refer to the exhibit. What value does the script print? Enter the value only.',
    exhibit: `uplinks = {"Gi1/0/49": 120, "Gi1/0/50": 0, "Gi1/0/51": 7, "Gi1/0/52": 0}
flagged = 0
for port, crc in uplinks.items():
    if crc == 0:
        continue
    flagged += 1
    if crc > 100:
        break
print(flagged)`,
    answer: ['1'],
    explanation: "A dictionary keeps insertion order, so the loop sees Gi1/0/49 first. Its CRC count is 120: not 0, so `continue` is skipped, `flagged` becomes 1, and because 120 > 100 the `break` leaves the loop at once. Gi1/0/51 (7 errors) is never reached. The script prints `1`." },
  { topic: '6.1', type: 'single', difficulty: 2, lesson: L61B,
    stem: 'Refer to the exhibit. Which output does the script produce?',
    exhibit: `values = ["100", "1000", "auto", "10000"]
total = 0
for v in values:
    try:
        total += int(v)
    except ValueError:
        print("bad value:", v)
        break
    finally:
        print("checked", v)
print("total", total)`,
    options: [
      'checked 100 / checked 1000 / bad value: auto / checked auto / total 1100',
      'checked 100 / checked 1000 / bad value: auto / total 1100',
      'checked 100 / checked 1000 / bad value: auto / checked auto / checked 10000 / total 11100',
      'checked 100 / checked 1000, then the script stops with a ValueError traceback',
    ],
    answer: [0],
    explanation: "`int(\"auto\")` raises `ValueError`, which the `except` block catches: it prints `bad value: auto` and executes `break`. A `finally` block runs even when the `try` statement is left by `break`, so `checked auto` is still printed before the loop ends, and the loop never reaches \"10000\". `total` holds 100 + 1000 = 1100. Leaving out `checked auto` ignores the `finally`; continuing to 10000 ignores the `break`; and the exception is handled, so there is no traceback. (Lines are shown separated by slashes.)" },
  { topic: '6.1', type: 'fill', difficulty: 2, lesson: L61B,
    stem: 'Refer to the exhibit. Enter the exact line that the script prints.',
    exhibit: `import json

payload = '{"hostname": "R1", "interfaces": [{"name": "Gi1", "vlans": [10, 20]}, {"name": "Gi2", "vlans": []}], "managed": true}'
data = json.loads(payload)
first = data["interfaces"][0]
print(first["vlans"][-1], len(data["interfaces"]), data["managed"])`,
    answer: ['20 2 True'],
    explanation: "`json.loads` turns the JSON text into a dictionary. `data[\"interfaces\"]` is a list of two dictionaries, so `len(...)` is 2 and `[0]` is the Gi1 entry, whose `vlans` list is `[10, 20]`; `[-1]` is its last item, 20. JSON `true` becomes the Python boolean `True`, which `print` writes with a capital T. The output is `20 2 True`." },
  { topic: '6.1', type: 'single', difficulty: 2, lesson: L61N,
    stem: 'Refer to the exhibit. The Catalyst Center request returns the response shown. What does the script print?',
    exhibit: `import requests

BASE = "https://cc.example.com/dna/intent/api/v1"
HEADERS = {"X-Auth-Token": "example-token-not-real", "Accept": "application/json"}

resp = requests.get(f"{BASE}/network-device", headers=HEADERS,
                    params={"role": "ACCESS"}, verify=False, timeout=15)
devices = resp.json()["response"]
print(resp.status_code, len(devices))
for dev in devices[1:]:
    if dev["reachabilityStatus"] == "Reachable":
        print(dev["hostname"], dev["platformId"])

--- Response ---
HTTP/1.1 200 OK
Content-Type: application/json

{
  "response": [
    {"hostname": "ASW1", "platformId": "C9200L-48P-4G", "reachabilityStatus": "Reachable", "role": "ACCESS"},
    {"hostname": "ASW2", "platformId": "C9300-48P", "reachabilityStatus": "Unreachable", "role": "ACCESS"},
    {"hostname": "ASW3", "platformId": "C9300-24P", "reachabilityStatus": "Reachable", "role": "ACCESS"}
  ],
  "version": "1.0"
}`,
    options: ['200 3 / ASW3 C9300-24P', '200 3 / ASW1 C9200L-48P-4G / ASW3 C9300-24P', '200 2 / ASW3 C9300-24P', '200 3 / ASW2 C9300-48P'],
    answer: [0],
    explanation: "The status line is 200 and `response` holds three devices, so the first line is `200 3` (the `version` member is not counted, because `devices` is only the `response` list). `devices[1:]` skips index 0, so ASW1 is never examined even though it is reachable. Of ASW2 and ASW3, only ASW3 is `Reachable`, giving `ASW3 C9300-24P`. ASW2 fails the `==` test. (Output lines are separated by slashes.)" },
  { topic: '6.1', type: 'single', difficulty: 2, lesson: L61N,
    stem: 'Refer to the exhibit. Which statement describes what this script does?',
    exhibit: `from ncclient import manager

FILTER = """
<interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
  <interface>
    <name>GigabitEthernet2</name>
  </interface>
</interfaces>
"""

with manager.connect(host="192.0.2.10", port=830, username="netops",
                     password="ExamplePass123",  # example only
                     hostkey_verify=False) as m:
    reply = m.get_config(source="running", filter=("subtree", FILTER))
    print(reply.xml)`,
    options: [
      'It opens a NETCONF session over SSH and prints the running configuration of GigabitEthernet2 from the ietf-interfaces model as XML',
      'It sends a RESTCONF GET over HTTPS and prints GigabitEthernet2 configuration and counters as JSON',
      'It opens an SSH CLI session and prints the output of show running-config interface GigabitEthernet2',
      'It replaces the configuration of GigabitEthernet2 in the running datastore with the contents of FILTER',
    ],
    answer: [0],
    explanation: "`manager.connect(... port=830 ...)` is ncclient, so the transport is NETCONF over SSH. `get_config(source=\"running\", ...)` reads configuration (not state, so no counters) from the running datastore, and the subtree filter, in the `ietf-interfaces` namespace, limits the reply to GigabitEthernet2. `reply.xml` is the XML `rpc-reply`. RESTCONF would use `requests` and URLs; a CLI session would use a library such as Netmiko; and a change would need `edit_config`, not `get_config`." },
  { topic: '6.1', type: 'multi', difficulty: 2, lesson: L61N,
    stem: 'Refer to the exhibit. Which two statements about the script are true? (Choose two.)',
    exhibit: `from netmiko import ConnectHandler

r1 = {"device_type": "cisco_xe", "host": "192.0.2.10",
      "username": "netops", "password": "ExamplePass123"}   # example only

config = ["interface Loopback100",
          "description Managed by Netmiko",
          "ip address 10.100.100.1 255.255.255.255"]

with ConnectHandler(**r1) as conn:
    output = conn.send_config_set(config)
    brief = conn.send_command("show ip interface brief | include Loopback100")
    print(type(brief).__name__)`,
    options: [
      'send_config_set enters and leaves configuration mode itself, so the list needs no configure terminal or end',
      'The script prints str, because send_command returns the CLI output as text',
      'The script uses NETCONF on TCP port 830',
      'send_command returns a dictionary parsed from the YANG model by default',
      'The configuration fails because the list does not start with configure terminal',
    ],
    answer: [0, 1],
    explanation: "Netmiko is an SSH CLI library (TCP 22, not NETCONF on 830). `send_config_set` sends `configure terminal`, then each line, then exits configuration mode, so adding `configure terminal` to the list is unnecessary and its absence is not an error. `send_command` returns what the device printed as one string, so `type(brief).__name__` is `str`; Netmiko returns structured data only if you ask it to parse the text (for example with TextFSM), and never from a YANG model." },
  { topic: '6.1', type: 'single', difficulty: 2, lesson: L61B,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `def classify(vlan):
    if vlan in (1, 1002, 1003, 1004, 1005):
        return "reserved"
    elif 1006 <= vlan <= 4094:
        return "extended"
    return "normal"


result = {}
for v in [1, 20, 1005, 2000]:
    result[v] = classify(v)
print(result)`,
    options: [
      "{1: 'reserved', 20: 'normal', 1005: 'reserved', 2000: 'extended'}",
      "{1: 'normal', 20: 'normal', 1005: 'extended', 2000: 'extended'}",
      "{'1': 'reserved', '20': 'normal', '1005': 'reserved', '2000': 'extended'}",
      "{1: 'reserved', 20: 'normal', 1005: 'reserved', 2000: 'normal'}",
    ],
    answer: [0],
    explanation: "The function returns at the first matching test. 1 and 1005 are in the tuple, so they are `reserved` before the range test is reached. 2000 falls in 1006 to 4094: `extended`. 20 matches neither and reaches the final `return \"normal\"`. The keys are the integers from the list, so Python prints them without quotes; quoted keys would need strings." },

  // ---------- 6.2 JSON ----------
  { topic: '6.2', type: 'fill', difficulty: 2, lesson: L62,
    stem: 'Refer to the exhibit. An API rejects this file with 400 Bad Request. Enter the number of the line that must be edited to make the JSON valid.',
    exhibit: ` 1  {
 2    "device": "R1",
 3    "interfaces": [
 4      {
 5        "name": "GigabitEthernet0/0/0",
 6        "enabled": true,
 7        "ipv4": "203.0.113.1/30"
 8      },
 9      {
10        "name": "GigabitEthernet0/0/1",
11        "enabled": false
12        "ipv4": null
13      }
14    ]
15  }

$ python3 -m json.tool r1.json
Expecting ',' delimiter: line 12 column 7 (char 216)`,
    answer: ['11', 'line 11'],
    explanation: "Members of an object must be separated by commas. Line 11 ends `\"enabled\": false` with no comma, so the parser only notices the problem when the next member starts, and reports line 12. The fix is a comma at the end of line 11. Everything else is valid: `true`, `false` and `null` are lowercase, the strings are double-quoted, and there is no comma before any `}` or `]`." },
  { topic: '6.2', type: 'multi', difficulty: 2, lesson: L62,
    stem: 'Refer to the exhibit. Which two changes are required for the file to be valid JSON? (Choose two.)',
    exhibit: `{
  "hostname": "SW1",
  "vlans": [10, 20, 30],
  "stp_mode": 'rapid-pvst',
  "portfast_default": true,
  "uplinks": ["Gi1/0/49", "Gi1/0/50",]
}`,
    options: [
      'Enclose rapid-pvst in double quotes instead of single quotes',
      'Remove the comma after "Gi1/0/50"',
      'Change true to True',
      'Enclose the VLAN numbers in double quotes',
      'Escape the forward slashes in the interface names as \\/',
    ],
    answer: [0, 1],
    explanation: "JSON strings must use double quotes, so `'rapid-pvst'` is invalid, and a comma may not appear before a closing `]`. With just those two fixes the file passes `json.tool`. `True` is Python, not JSON: the literal must stay lowercase. Numbers in an array are valid without quotes (quoting them would turn them into strings). A forward slash may be escaped but never has to be." },
  { topic: '6.2', type: 'match', difficulty: 2, lesson: L62,
    stem: 'Each body was rejected by a JSON parser. Match each body to the reason it is invalid.',
    pairs: [
      ['{"managed": True}', 'A Python literal is used instead of the lowercase JSON literal'],
      ['{"vlans": [10, 20,]}', 'A comma appears before the closing bracket'],
      ["{'hostname': 'R1'}", 'Names and strings are enclosed in single quotes'],
      ['{"hostname": "R1" "managed": true}', 'Two members are not separated by a comma'],
      ['{"path": "flash:\\logs"}', 'A backslash in a string is not a valid escape and must be doubled'],
      ['{"vlan": 010}', 'A number is written with a leading zero'],
    ],
    explanation: "Each body was checked with Python's `json.tool`, which rejects all six. JSON literals are `true`, `false` and `null` in lowercase (`True` is Python). A trailing comma before `]` or `}` is not allowed. Only double quotes delimit names and strings. Members need a comma between them. In a string, `\\l` is not one of JSON's escapes, so a literal backslash must be written `\\\\`. Numbers may not have leading zeros." },
  { topic: '6.2', type: 'fill', difficulty: 1, lesson: L62,
    stem: 'Refer to the exhibit. Enter the value that the output shows for the enabled key, exactly as printed.',
    exhibit: `import json

intf = {"name": "Loopback0", "enabled": True, "description": None, "mtu": 1514}
print(json.dumps(intf))`,
    answer: ['true'],
    explanation: "`json.dumps` converts Python objects to JSON text, so the Python boolean `True` is written as the JSON literal `true` (and `None` as `null`). The full output is `{\"name\": \"Loopback0\", \"enabled\": true, \"description\": null, \"mtu\": 1514}`." },
  { topic: '6.2', type: 'single', difficulty: 1, lesson: L62,
    stem: 'An engineer must send a RESTCONF body that sets a description on Loopback1 and enables it. Which body is valid JSON?',
    options: [
      '{"ietf-interfaces:interface": {"name": "Loopback1", "description": "Router ID", "enabled": true}}',
      '{"ietf-interfaces:interface": {"name": "Loopback1", "description": "Router ID", "enabled": True}}',
      '{"ietf-interfaces:interface": {\'name\': \'Loopback1\', "description": "Router ID", "enabled": true}}',
      '{"ietf-interfaces:interface": {"name": "Loopback1", "description": "Router ID", "enabled": true,}}',
    ],
    answer: [0],
    explanation: "Only the first body passes a JSON parser: double-quoted names and strings, lowercase `true`, commas between members and none before `}`. The colon inside `\"ietf-interfaces:interface\"` is part of the string, which is how RESTCONF qualifies a name with its module. The others fail on `True` (a Python literal), on single quotes, and on a trailing comma." },
  { topic: '6.2', type: 'single', difficulty: 3, lesson: L62,
    stem: 'Refer to the exhibit. The file validates, but a script that reads backup_path cannot find the file. What is the problem?',
    exhibit: String.raw`$ cat r1.json
{
  "device": "R1",
  "backup_path": "C:\backups\r1.cfg"
}

$ python3 -m json.tool r1.json > /dev/null && echo valid
valid

$ python3 -c "import json; print(repr(json.load(open('r1.json'))['backup_path']))"
'C:\x08ackups\r1.cfg'`,
    options: [
      'The backslashes are read as the escapes \\b and \\r; each backslash must be written as \\\\ in the JSON file',
      'JSON does not allow a colon inside a string value, so C: must be escaped',
      'File paths must be stored in JSON arrays, not in strings',
      'json.load cannot read files; json.loads must be used instead',
    ],
    answer: [0],
    explanation: "Backslash starts an escape in a JSON string. `\\b` (backspace) and `\\r` (carriage return) are both legal escapes, so the file is valid JSON, but the value now contains control characters, which `repr` shows as `\\x08` and `\\r`. Writing `C:\\\\backups\\\\r1.cfg` stores single backslashes. A colon inside a string is ordinary text. Strings can hold any text, paths included. `json.load` reads from a file object, which is exactly what the command does; `json.loads` is for strings." },

  // ---------- 6.3 YANG ----------
  { topic: '6.3', type: 'fill', difficulty: 2, lesson: L63,
    stem: 'Refer to the exhibit. Enter the name of the key leaf that identifies each entry of the ace list.',
    exhibit: `module: example-acl
  +--rw acls
     +--rw acl* [name]
        +--rw name           string
        +--rw type?          enumeration
        +--rw ace* [sequence]
           +--rw sequence    uint32
           +--rw action      enumeration
           +--rw source?     inet:ipv4-prefix
           +--ro matches?    yang:counter64`,
    answer: ['sequence'],
    explanation: "In a tree diagram, `*` marks a list (or leaf-list) and the leaf names in square brackets after it are the list's keys. `ace* [sequence]` is keyed by `sequence`, just as the outer `acl* [name]` list is keyed by `name`. The key leaf has no `?` because it is mandatory. `matches` is `ro`: state data the device counts, not something you configure." },
  { topic: '6.3', type: 'multi', difficulty: 2, lesson: L63,
    stem: 'Refer to the exhibit, which shows part of the ietf-interfaces model. Which two statements are true? (Choose two.)',
    exhibit: `module: ietf-interfaces
  +--rw interfaces
     +--rw interface* [name]
        +--rw name                        string
        +--rw description?                string
        +--rw type                        identityref
        +--rw enabled?                    boolean
        +--ro oper-status                 enumeration
        +--ro statistics
           +--ro in-octets?            yang:counter64
           +--ro in-errors?            yang:counter32`,
    options: [
      'oper-status is operational state data and cannot be set with a RESTCONF PUT or a NETCONF edit-config',
      'interface is a list whose entries are identified by the name leaf',
      'description must be present in every interface entry',
      'statistics is a configurable container that can be used to clear counters',
      'enabled is a leaf-list that can hold several boolean values',
    ],
    answer: [0, 1],
    explanation: "`ro` marks config false (state) nodes, so `oper-status` and everything under `statistics` are read-only. `interface* [name]` is a list keyed by `name`. The `?` after `description` means it is optional, not mandatory. `enabled?` is a single optional leaf (a leaf-list would show `*`)." },
  { topic: '6.3', type: 'single', difficulty: 2, lesson: L63,
    stem: 'A company runs Cisco IOS XE and another vendor\'s routers. One automation script must configure interfaces and BGP on both platforms through NETCONF without per-vendor code. Which type of YANG model best fits?',
    options: ['OpenConfig models such as openconfig-interfaces and openconfig-bgp', 'The Cisco-IOS-XE-native model', 'A Cisco deviation module such as cisco-xe-openconfig-bgp-deviation', 'SNMP MIBs translated to YANG'],
    answer: [0],
    explanation: "Vendor-neutral models let one script work on several platforms, and OpenConfig covers both interfaces and BGP with operator-defined, vendor-neutral models. The native model is IOS XE-specific, so the other vendor would not understand it. A deviation module is not something you configure through: it documents where Cisco's implementation differs from the OpenConfig model. MIB-derived models are for monitoring, not BGP configuration." },
  { topic: '6.3', type: 'match', difficulty: 1, lesson: L63,
    stem: 'Match each YANG statement to its purpose.',
    pairs: [
      ['augment', 'Adds nodes from one module into another module\'s tree'],
      ['deviation', 'Declares where an implementation differs from a published model'],
      ['leaf-list', 'Holds a sequence of simple values of one type'],
      ['list', 'Holds entries identified by one or more key leaves'],
      ['rpc', 'Defines an operation with input and output that a client can invoke'],
      ['notification', 'Defines an event the server can send to subscribers'],
    ],
    explanation: "`augment` is how `ietf-ip` adds `ipv4` under each `ietf-interfaces` interface. Vendors publish `deviation` modules for unsupported or changed nodes. A `leaf-list` is many values of one type (for example tagged ports), whereas a `list` is many structured entries with keys. `rpc` defines operations such as save-config; `notification` defines events for subscriptions and streaming." },

  // ---------- 6.4 APIs ----------
  { topic: '6.4', type: 'order', difficulty: 2, lesson: L64C,
    stem: 'A script must run show ip ospf neighbor on DSW1 through the Catalyst Center Command Runner API and report whether the job succeeded. Put the API steps in order.',
    items: [
      'POST /dna/system/api/v1/auth/token with HTTP Basic authentication and read Token from the body',
      'GET /dna/intent/api/v1/network-device?hostname=DSW1 with the X-Auth-Token header and read the device id',
      'POST /dna/intent/api/v1/network-device-poller/cli/read-request with the command and the device id',
      'Receive 202 Accepted and read response.taskId',
      'GET /dna/intent/api/v1/task/{taskId} until endTime is present, then check isError',
    ],
    explanation: "Every Intent API call needs a token, so authentication comes first, and the token is then sent as `X-Auth-Token`. Command Runner needs the device's UUID, which comes from the inventory (`network-device`). The Command Runner request is asynchronous: it returns 202 with a `taskId` immediately. Only the task resource says whether the job finished (`endTime`) and succeeded (`isError` false); its `progress` then points to the output file." },
  { topic: '6.4', type: 'match', difficulty: 2, lesson: L64C,
    stem: 'Match each Catalyst Center requirement to the interface that meets it.',
    pairs: [
      ['A Python script must list every switch with its software version', 'Northbound Intent API'],
      ['An HTTPS listener at hooks.example.com must be told within seconds when a device becomes unreachable', 'Eastbound event notification (webhook)'],
      ['ServiceNow must open an incident automatically for a new Assurance issue and link the ticket back', 'Westbound ITSM integration'],
      ['Catalyst Center must push a template to a Catalyst 9300 over SSH or NETCONF', 'Southbound device communication'],
    ],
    explanation: "Northbound is software calling Catalyst Center (the REST Intent API: GET `network-device`). Eastbound is Catalyst Center pushing events to subscribers, by email, syslog or a webhook POST. Westbound covers integration bundles with IT systems such as ITSM and IPAM. Southbound is how the controller reaches devices: SSH, SNMP, NETCONF." },
  { topic: '6.4', type: 'single', difficulty: 2, lesson: L64C,
    stem: 'Refer to the exhibit. The token was issued 30 seconds earlier. Why does the request fail?',
    exhibit: `GET /dna/intent/api/v1/network-device HTTP/1.1
Host: cc.example.com
Authorization: Bearer example-token-not-real
Accept: application/json

HTTP/1.1 401 Unauthorized`,
    options: [
      'Catalyst Center expects the token in the X-Auth-Token header, not in an Authorization: Bearer header',
      'The token must be sent in the request body as {"Token": "..."}',
      'The request must be a POST, because the Intent API does not support GET',
      'The user\'s role does not permit reading the inventory, which is what 401 means',
    ],
    answer: [0],
    explanation: "The token from `/dna/system/api/v1/auth/token` must be sent in the `X-Auth-Token` header. Without that header Catalyst Center sees an unauthenticated request and returns 401; the token is still valid (it lasts 60 minutes). GET bodies carry no token, and GET is the correct method for the inventory. A role problem would return 403 Forbidden, not 401." },
  { topic: '6.4', type: 'single', difficulty: 2, lesson: L64S,
    stem: 'Refer to the exhibit. The GET succeeds but the POST fails. What is missing?',
    exhibit: `POST /j_security_check           (j_username / j_password)   -> 200, Set-Cookie: JSESSIONID=<SESSION-HASH>
GET  /dataservice/device          Cookie: JSESSIONID=...       -> 200 OK, "data": [ 14 devices ]
POST /dataservice/template/device/config/attachfeature
     Cookie: JSESSIONID=...
     Content-Type: application/json                            -> 403 Forbidden`,
    options: [
      'The X-XSRF-TOKEN header, with the value returned by GET /dataservice/client/token',
      'An X-Auth-Token header obtained from /dna/system/api/v1/auth/token',
      'A new j_security_check login, because each session allows only one request',
      'The API version in the path, such as /dataservice/v1/template',
    ],
    answer: [0],
    explanation: "SD-WAN Manager session authentication needs two things: the `JSESSIONID` cookie from `/j_security_check` (enough for GETs, as the 200 shows) and, for most POST, PUT and DELETE requests, an XSRF token fetched with `GET /dataservice/client/token` and sent as `X-XSRF-TOKEN`. `X-Auth-Token` and `auth/token` belong to Catalyst Center. A session serves many requests (Cisco documents a 24-hour lifetime). The classic template resources carry no version in the path (only the newer configuration-group resources use `/dataservice/v1/...`), and a wrong path would give 404, not 403, after a GET on the same session succeeded." },
  { topic: '6.4', type: 'multi', difficulty: 2, lesson: L64S,
    stem: 'Which two statements describe session-based authentication to the Cisco Catalyst SD-WAN Manager REST API? (Choose two.)',
    options: [
      'The client posts j_username and j_password, form-encoded, to /j_security_check and receives a JSESSIONID cookie',
      'API resources are under the /dataservice/ base path, for example /dataservice/device',
      'The client obtains a token from /dna/system/api/v1/auth/token and sends it in the X-Auth-Token header',
      'A failed login is always reported with 401 Unauthorized and a JSON error body',
      'Each request must include the API version in the URL, such as /dataservice/v2/device',
    ],
    answer: [0, 1],
    explanation: "SD-WAN Manager (formerly vManage) authenticates a session with a form POST to `/j_security_check`; the session is the `JSESSIONID` cookie, and changes also need the XSRF token from `/dataservice/client/token`. Its resources sit under `/dataservice/`. The `auth/token` and `X-Auth-Token` pair is Catalyst Center. Cisco documents that a failed `j_security_check` login returns an HTML login page in the body, so scripts check for `<html>`. There is no rule that every request carries a version in the path: classic resources such as `/dataservice/device` have none (an optional vendor Accept header selects it), and only newer configuration-group resources use `/dataservice/v1/...`." },

  // ---------- 6.5 Responses ----------
  { topic: '6.5', type: 'single', difficulty: 2, lesson: L65C,
    stem: 'Refer to the exhibit. A script reports "Discovery created" because the POST returned 202. Which statement is correct?',
    exhibit: `POST /dna/intent/api/v1/discovery           -> 202 Accepted
{"response": {"taskId": "a8805e89-0000-4b00-a2b6-000000000001",
              "url": "/dna/intent/api/v1/task/a8805e89-0000-4b00-a2b6-000000000001"},
 "version": "1.0"}

GET /dna/intent/api/v1/task/a8805e89-0000-4b00-a2b6-000000000001   -> 200 OK
{"response": {"serviceType": "Discovery Service", "isError": true,
              "progress": "Failed to create discovery",
              "failureReason": "Discovery name is duplicate",
              "startTime": 1763891000100, "endTime": 1763891000146,
              "id": "a8805e89-0000-4b00-a2b6-000000000001"},
 "version": "1.0"}`,
    options: [
      'The request was accepted but the discovery task failed, because a discovery with that name already exists',
      'The discovery succeeded, because both requests returned 2xx status codes',
      'The discovery is still running, because the task returned 200 rather than 201',
      'The token expired between the two requests, because isError is true',
    ],
    answer: [0],
    explanation: "202 Accepted only means Catalyst Center queued the work. The task shows the outcome: `endTime` is present, so it finished, and `isError: true` with `failureReason: Discovery name is duplicate` says it failed. The 200 on the task GET only means reading the task worked. A token problem would make the GET itself fail with 401." },
  { topic: '6.5', type: 'fill', difficulty: 2, lesson: L65C,
    stem: 'Refer to the exhibit. Every access switch should run 17.12.4. Enter the hostname of the switch that does not.',
    exhibit: `GET /dna/intent/api/v1/network-device?role=ACCESS   -> 200 OK
{
  "response": [
    {"hostname": "ASW1", "managementIpAddress": "10.10.30.11", "platformId": "C9300-48P",
     "softwareVersion": "17.12.4", "reachabilityStatus": "Reachable"},
    {"hostname": "ASW2", "managementIpAddress": "10.10.30.12", "platformId": "C9300-48P",
     "softwareVersion": "17.12.4", "reachabilityStatus": "Reachable"},
    {"hostname": "ASW3", "managementIpAddress": "10.10.30.13", "platformId": "C9200L-24P-4G",
     "softwareVersion": "17.9.5", "reachabilityStatus": "Reachable"},
    {"hostname": "ASW4", "managementIpAddress": "10.10.30.14", "platformId": "C9300-24P",
     "softwareVersion": "17.12.4", "reachabilityStatus": "Unreachable"}
  ],
  "version": "1.0"
}`,
    answer: ['ASW3'],
    explanation: "Each object in the `response` array is one device. Only ASW3 reports `softwareVersion` 17.9.5. ASW4 is unreachable, but the inventory still records 17.12.4 for it, so it is not the answer to this question." },
  { topic: '6.5', type: 'match', difficulty: 2, lesson: L65R,
    stem: 'Match each API result to the HTTP status code the server returns.',
    pairs: [
      ['RESTCONF PUT of Loopback200, which did not exist before', '201 Created'],
      ['RESTCONF PUT of Loopback100, replacing its existing configuration', '204 No Content'],
      ['Catalyst Center POST that starts a discovery job lasting several minutes', '202 Accepted'],
      ['Catalyst Center GET sent with a token issued 75 minutes earlier', '401 Unauthorized'],
      ['Catalyst Center DELETE of a device by a user whose role is read-only', '403 Forbidden'],
      ['RESTCONF POST that tries to create Loopback100, which already exists', '409 Conflict'],
    ],
    explanation: "RFC 8040: PUT returns 201 when it creates the resource and 204 when it replaces an existing one; POST of an existing resource fails with 409. Catalyst Center runs long operations asynchronously and returns 202 with a task id. Its tokens last 60 minutes, so a 75-minute-old token is rejected as unauthenticated (401). A valid user without permission gets 403." },
  { topic: '6.5', type: 'single', difficulty: 2, lesson: L65R,
    stem: 'Refer to the exhibit. What is the cause of the error?',
    exhibit: `GET /restconf/data/ietf-interface:interfaces HTTP/1.1
Host: 192.0.2.10
Accept: application/yang-data+json

HTTP/1.1 404 Not Found
Content-Type: application/yang-data+json

{
  "ietf-restconf:errors": {
    "error": [
      {
        "error-type": "application",
        "error-tag": "invalid-value",
        "error-message": "uri keypath not found"
      }
    ]
  }
}`,
    options: [
      'The module name is misspelled: the IETF module is ietf-interfaces, so the URI does not exist',
      'The user is not authorized at privilege level 15',
      'The Accept header must be application/json',
      'A NETCONF session holds a lock on the running datastore',
    ],
    answer: [0],
    explanation: "404 with `invalid-value` means the server cannot find the resource named by the URI. The URI says `ietf-interface:interfaces`, but the module is `ietf-interfaces`. Authorization failures return 401 or 403 with `access-denied`. `application/yang-data+json` is the correct RESTCONF media type; an encoding the server cannot produce would give 406. A lock would give 409 with `lock-denied` or `in-use`, and only on a change." },
  { topic: '6.5', type: 'fill', difficulty: 2, lesson: L65R,
    stem: 'Refer to the exhibit. Enter the name of the YANG module that defines the ipv4 container in this response.',
    exhibit: `GET /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet2   -> 200 OK
Content-Type: application/yang-data+json

{
  "ietf-interfaces:interface": [
    {
      "name": "GigabitEthernet2",
      "description": "Link to R2",
      "type": "iana-if-type:ethernetCsmacd",
      "enabled": true,
      "ietf-ip:ipv4": {
        "address": [
          {
            "ip": "10.1.12.1",
            "netmask": "255.255.255.0"
          }
        ]
      }
    }
  ]
}`,
    answer: ['ietf-ip'],
    explanation: "In YANG JSON (RFC 7951) a member name carries a module prefix wherever the module changes. The interface entry comes from `ietf-interfaces`, but `ipv4` appears as `ietf-ip:ipv4`, because the `ietf-ip` module augments the interface list with it. Members inside it (`address`, `ip`, `netmask`) belong to the same module and are not prefixed again." },
  { topic: '6.5', type: 'single', difficulty: 3, lesson: L65R,
    stem: 'Refer to the exhibit. Why does R1 reject the request?',
    exhibit: `$ curl -k -v -u 'netops:<PASSWORD>' -X PATCH \\
    -d '{"ietf-interfaces:interface": [{"name": "GigabitEthernet2", "description": "Link to R2"}]}' \\
    https://192.0.2.10/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet2

> PATCH /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet2 HTTP/1.1
> Authorization: Basic <BASE64-CREDENTIALS>
> Content-Type: application/x-www-form-urlencoded
>
< HTTP/1.1 415 Unsupported Media Type`,
    options: [
      'curl -d sent the body as application/x-www-form-urlencoded; the request needs Content-Type: application/yang-data+json',
      'PATCH cannot change a description; the engineer must use POST',
      'The JSON body is invalid because the list entry is inside an array',
      'The credentials are wrong, which RESTCONF reports as 415',
    ],
    answer: [0],
    explanation: "415 means the server does not accept the body's media type. Without `-H \"Content-Type: ...\"`, `curl -d` labels the body `application/x-www-form-urlencoded`, which RFC 8040 servers do not accept; RESTCONF bodies are `application/yang-data+json` or `+xml`. PATCH (merge) is the right method for changing one leaf, while POST would try to create the interface. A list entry encoded as a one-element array is valid YANG JSON. Bad credentials give 401." },
  { topic: '6.5', type: 'multi', difficulty: 2, lesson: L65R,
    stem: 'Which two statements about successful RESTCONF responses are true according to RFC 8040? (Choose two.)',
    options: [
      'A successful DELETE returns 204 No Content',
      'A plain PATCH that returns no body returns 204 No Content',
      'A successful POST that creates a resource returns 200 OK with the created data in the body',
      'PUT always returns 200 OK, whether it creates or replaces the resource',
      'PATCH creates the target resource when it does not exist',
    ],
    answer: [0, 1],
    explanation: "RFC 8040: DELETE succeeds with 204; PATCH succeeds with 204 (or 200 if a body is returned). POST that creates a resource returns 201 Created with a Location header and no body. PUT returns 201 when it creates and 204 when it replaces. PATCH must not create a missing target: that is an error." },

  // ---------- 6.6 EEM ----------
  { topic: '6.6', type: 'order', difficulty: 2, lesson: L66C,
    stem: 'An applet named BACKUP-ON must bring up GigabitEthernet0/0/3 when tracked object 30 goes down. Put the configuration in order: the applet and event lines first, then the cli command actions in the order their labels must make them run.',
    items: [
      'event manager applet BACKUP-ON',
      'event track 30 state down',
      'cli command "enable"',
      'cli command "configure terminal"',
      'cli command "interface GigabitEthernet0/0/3"',
      'cli command "no shutdown"',
      'cli command "end"',
    ],
    explanation: "The applet is created first, then its single event detector. The CLI session an applet opens starts in user EXEC, so `enable` must run before `configure terminal`; then the interface is selected and enabled, and `end` returns to privileged EXEC. Labelled 1.0 to 5.0 (which sort correctly as strings) the actions run in this order." },
  { topic: '6.6', type: 'fill', difficulty: 2, lesson: L66T,
    stem: 'Refer to the exhibit. The applet runs but changes nothing. Enter the CLI command that the applet must run before configure terminal.',
    exhibit: `R1# show running-config | section SHUT-PORT
event manager applet SHUT-PORT
 event none
 action 1.0 cli command "configure terminal"
 action 2.0 cli command "interface GigabitEthernet1/0/5"
 action 3.0 cli command "shutdown"
 action 4.0 cli command "end"

R1# debug event manager action cli
R1# event manager run SHUT-PORT
%HA_EM-6-LOG: SHUT-PORT : DEBUG(cli_lib) : : OUT : R1>
%HA_EM-6-LOG: SHUT-PORT : DEBUG(cli_lib) : : IN  : R1>configure terminal
%HA_EM-6-LOG: SHUT-PORT : DEBUG(cli_lib) : : OUT :                   ^
%HA_EM-6-LOG: SHUT-PORT : DEBUG(cli_lib) : : OUT : % Invalid input detected at '^' marker.`,
    answer: ['enable', 'cli command "enable"', 'action 0.5 cli command "enable"'],
    explanation: "The debug shows the prompt `R1>`: an applet's CLI session starts in user EXEC mode, where `configure terminal` does not exist, so every following command fails too. Adding `action 0.5 cli command \"enable\"` (any label that sorts before 1.0) puts the session in privileged EXEC first." },
  { topic: '6.6', type: 'fill', difficulty: 3, lesson: L66C,
    stem: 'Refer to the exhibit. Enter the label of the action that EEM runs second.',
    exhibit: `event manager applet COLLECT
 event none
 action 1.0 cli command "enable"
 action 2.0 cli command "show clock | append flash:collect.txt"
 action 3.0 cli command "show ip route summary | append flash:collect.txt"
 action 10.0 syslog msg "COLLECT finished"`,
    answer: ['10.0'],
    explanation: "Action labels are sorted as strings, not numbers. Comparing character by character, `10.0` sorts after `1.0` (at the second character, `.` comes before `0`) and before `2.0` (at the first character, `1` comes before `2`), so the order is 1.0, 10.0, 2.0, 3.0: the \"finished\" message is logged before any output is collected. Labels such as 1.0, 1.1, 1.2 or zero-padded ones avoid this." },
  { topic: '6.6', type: 'match', difficulty: 2, lesson: L66C,
    stem: 'Match each requirement to the EEM event detector that meets it.',
    pairs: [
      ['Run a set of show commands every night at 23:30', 'event timer cron cron-entry "30 23 * * *"'],
      ['Act when the IP SLA-based tracked object 5 goes down', 'event track 5 state down'],
      ['Act only when Gi0/0/1 logs a line-protocol down message three times within 60 seconds', 'event syslog pattern with occurs 3 period 60'],
      ['Prevent anyone from executing reload from the CLI', 'event cli pattern "reload" sync no skip yes'],
      ['Run only when an engineer types event manager run', 'event none'],
      ['Collect data when the 1-minute CPU MIB value reaches 80 percent', 'event snmp oid ... entry-op ge entry-val 80'],
    ],
    explanation: "A calendar schedule is a cron timer (minute 30, hour 23). Tracked objects (often IP SLA) are watched with `event track`. A rate of log messages uses `event syslog` with `occurs` and `period`. `event cli ... sync no skip yes` matches the command and skips its execution. `event none` registers an applet that runs only on `event manager run`. A MIB value threshold is the SNMP detector." },
  { topic: '6.6', type: 'single', difficulty: 3, lesson: L66C,
    stem: 'Refer to the exhibit. The applet worked in the lab but does nothing on R1, which uses TACACS+ command authorization. What should the engineer change?',
    exhibit: `R1# show running-config | include aaa authorization commands
aaa authorization commands 1 default group tacacs+
aaa authorization commands 15 default group tacacs+

R1# show running-config | section LOG-ROUTES
event manager applet LOG-ROUTES
 event timer watchdog time 600
 action 1.0 cli command "enable"
 action 2.0 cli command "show ip route summary | append flash:routes.txt"

TACACS+ server log:
  Authorization FAILED  user=<none>  cmd="show ip route summary | append flash:routes.txt"`,
    options: [
      'Configure event manager applet LOG-ROUTES authorization bypass',
      'Add action 0.5 cli command "enable" before action 1.0',
      'Change the event to event none sync yes',
      'Change the watchdog timer to a cron timer',
    ],
    answer: [0],
    explanation: "With AAA command authorization, every command the applet runs is sent to TACACS+, and the EEM session has no user, so the server refuses it (the log shows `user=<none>`). `authorization bypass` on the applet line skips command authorization for that applet; the global alternative is `event manager session cli username <user>` with a user the server authorizes. The applet already runs `enable`. Changing the event type or timer does not change authorization." },
  { topic: '6.6', type: 'single', difficulty: 2, lesson: L66T,
    stem: 'Refer to the exhibit. An administrator with privilege 15 types reload on R1. What happens?',
    exhibit: `event manager applet NO-RELOAD
 event cli pattern "^reload" sync no skip yes
 action 1.0 syslog priority alerts msg "reload attempted and blocked by EEM"`,
    options: [
      'The reload command is not executed, and the applet logs the attempt',
      'R1 reloads, and the message is logged just before it goes down',
      'R1 asks the administrator to confirm, and the applet answers no',
      'The applet is rejected, because skip yes requires sync yes',
    ],
    answer: [0],
    explanation: "`event cli` matches commands as they are entered. With `sync no` the applet runs asynchronously, and `skip yes` tells IOS not to execute the matched command, so the reload never happens and the syslog action records the attempt. In the IOS XE model `skip` is allowed only with `sync no`, so this combination is valid. EEM does not answer the reload confirmation prompt in this applet." },
  { topic: '6.6', type: 'single', difficulty: 2, lesson: L66D,
    stem: 'Refer to the exhibit. The applet has run three times. What does flash:cpu.txt contain?',
    exhibit: `event manager applet CPU-HOURLY
 event timer watchdog time 3600
 action 1.0 cli command "enable"
 action 2.0 cli command "show processes cpu sorted | redirect flash:cpu.txt"`,
    options: [
      'Only the output collected during the most recent run',
      'The output of all three runs, oldest first',
      'Nothing, because a watchdog timer runs the applet only once',
      'The output of the first run only, because redirect does not overwrite an existing file',
    ],
    answer: [0],
    explanation: "`| redirect` writes the command output to the file and replaces what was there, so each run overwrites the previous one. `| append` would add each run to the end. A watchdog timer re-arms after every expiry and runs every 3,600 seconds; a countdown timer is the one-shot." },
  { topic: '6.6', type: 'multi', difficulty: 1, lesson: L66T,
    stem: 'An engineer wants to confirm that an applet is registered and see when it last ran. Which two commands show this? (Choose two.)',
    options: ['show event manager policy registered', 'show event manager history events', 'show archive log config all', 'show applet status', 'debug ip packet'],
    answer: [0, 1],
    explanation: "`show event manager policy registered` lists the registered applets with their event types and registration time; `show event manager history events` lists when policies ran. The configuration archive log records configuration changes, not applet runs; `show applet status` is not an IOS command; and `debug ip packet` debugs forwarding. To watch an applet's CLI actions while it runs, use `debug event manager action cli`." },

  // ---------- 6.7 Orchestration ----------
  { topic: '6.7', type: 'match', difficulty: 2, lesson: L67L,
    stem: 'Match each description to the tool it describes.',
    pairs: [
      ['No software may be installed on 400 IOS XE switches; an engineer runs YAML playbooks that push changes over SSH during a change window', 'Ansible'],
      ['Agents on 2,000 Linux servers connect to a central server on TCP 8140 every 30 minutes and apply a compiled catalog', 'Puppet'],
      ['Engineers write Ruby recipes on a workstation, upload cookbooks to a central server, and the client on each node pulls them', 'Chef'],
      ['A master publishes commands to minions over ZeroMQ on TCP 4505 and receives their results on TCP 4506', 'SaltStack'],
      ['HCL files describe resources, a state file records what exists, and plan and apply make changes through providers', 'Terraform'],
    ],
    explanation: "Ansible is agentless and pushes YAML playbooks over SSH (or NETCONF and HTTPS APIs). Puppet agents pull catalogs from Puppet Server over HTTPS on 8140, by default every 30 minutes. Chef uses Ruby recipes grouped in cookbooks, written on a workstation and stored on Chef Infra Server, which Chef Infra Client pulls. Salt's master and minions talk over ZeroMQ on 4505 and 4506. Terraform is declarative infrastructure as code with providers and a state file." },
  { topic: '6.7', type: 'single', difficulty: 1, lesson: L67L,
    stem: 'Why are agentless tools usually preferred for managing switches and routers?',
    options: [
      'Network operating systems generally cannot host third-party agents, while SSH, NETCONF and RESTCONF are already available on the devices',
      'Agentless tools pull configuration from the devices every 30 minutes, which keeps them in compliance without engineer action',
      'Agent-based tools cannot use encryption, so they are not allowed on management networks',
      'Agentless tools do not need device credentials',
    ],
    answer: [0],
    explanation: "Most network operating systems do not let you install and run a configuration agent, and they already expose SSH and model-driven interfaces (NETCONF, RESTCONF), so an agentless tool needs nothing extra on the device. Agentless tools push when run; the 30-minute pull describes agent-based Puppet or Chef. Agent-based tools encrypt their traffic (Puppet uses HTTPS on 8140). Agentless tools still need credentials for every device." },
  { topic: '6.7', type: 'multi', difficulty: 1, lesson: L67L,
    stem: 'Which two statements describe Ansible? (Choose two.)',
    options: [
      'It needs no agent on managed network devices and pushes changes from a control node',
      'Playbooks are written in YAML and call modules such as cisco.ios.ios_config',
      'Managed nodes pull their configuration from the Ansible server on TCP 8140',
      'Configuration is written as Ruby recipes grouped into cookbooks',
      'It requires a minion on each device connected over ZeroMQ',
    ],
    answer: [0, 1],
    explanation: "Ansible is agentless: the control node connects over SSH (network_cli), NETCONF or HTTPS and pushes changes when a playbook runs. Playbooks are YAML, with tasks that call modules from collections such as `cisco.ios`. TCP 8140 and pull are Puppet; Ruby recipes and cookbooks are Chef; minions and ZeroMQ are Salt." },
  { topic: '6.7', type: 'single', difficulty: 2, lesson: L67L,
    stem: 'Refer to the exhibit. The same playbook was run twice without any manual change in between. Which property of the tool does the second recap show?',
    exhibit: `$ ansible-playbook -i inventory.yml ntp.yml      (first run)
PLAY RECAP *********************************************************************
R1    : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
R2    : ok=3    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0

$ ansible-playbook -i inventory.yml ntp.yml      (second run)
PLAY RECAP *********************************************************************
R1    : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
R2    : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0`,
    options: [
      'Idempotence: the devices already match the desired state, so nothing is changed again',
      'Pull-based enforcement: the routers fetched the playbook themselves on the second run',
      'Check mode: the second run only reported what it would change',
      'Failure: the second run could not reach the routers, so it changed nothing',
    ],
    answer: [0],
    explanation: "An idempotent task changes something only when the device differs from the desired state. The first run added the configuration (`changed=1`); the second found it already present (`ok`, `changed=0`). Ansible is push-based, so the routers fetch nothing. Check mode needs `--check`, which the command does not use. Unreachable hosts would show `unreachable=1`, not `ok=3`." },

  // ---------- 6.4 (added in review) ----------
  { topic: '6.4', type: 'order', difficulty: 2, lesson: L64S,
    stem: 'A Python script must attach a device template through the SD-WAN Manager REST API using session-based authentication and then end its session cleanly. Put the requests in order.',
    items: [
      'POST /j_security_check with the form fields j_username and j_password, and keep the JSESSIONID cookie',
      'GET /dataservice/client/token with the JSESSIONID cookie, and keep the body as the XSRF token',
      'POST /dataservice/template/device/config/attachfeature with the JSESSIONID cookie and the X-XSRF-TOKEN header',
      'GET the status of the returned operation id until the attach has finished',
      'POST /logout with the JSESSIONID cookie',
    ],
    explanation: "The session starts with the form login to `/j_security_check`, which sets the `JSESSIONID` cookie; a failed login returns an HTML login page instead. The XSRF token can only be fetched inside that session, so `/dataservice/client/token` comes next. The attach is a state-changing POST, so it needs both the cookie and the `X-XSRF-TOKEN` header. Template attachment is a long operation that returns an id, so the script polls it before reporting success. `POST /logout` releases the session (Cisco limits concurrent sessions)." },
];

export default bank.map((item, i) => ({ id: `d6-${String(i + 1).padStart(3, '0')}`, ...item }));
