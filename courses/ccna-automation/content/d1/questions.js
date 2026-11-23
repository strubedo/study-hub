// Domain 1 — Software Development and Design. Original questions. Every Python exhibit was run with Python 3.14 (PyYAML 6.0.3, xmltodict 1.0.3) and every Git exhibit with Git 2.55 in throwaway mktemp directories; the output shown is the real output with placeholder user, host and path names. Method and pattern questions are based on the Agile Manifesto, the Scrum Guide, Poppendieck's lean principles and the Python documentation.
const L11 = '1.1-data-formats';
const L12 = '1.2-parsing-python';
const L13 = '1.3-test-driven-development';
const L14 = '1.4-development-methods';
const L15 = '1.5-functions-classes-modules';
const L16 = '1.6-design-patterns';
const L17 = '1.7-version-control';
const L18A = '1.8-git-basics';
const L18B = '1.8-git-branch-merge';

const bank = [
  // ---------- 1.1 Data formats ----------
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. A script builds this request body for a REST API, and the API rejects it as malformed JSON. Which two changes are required to make it valid JSON? (Choose two.)',
    exhibit: `{
  "hostname": 'sw01',
  "managed": true,
  "vlans": [10, 20,],
  "location": null
}`,
    options: ['Replace null with None', 'Put sw01 in double quotes instead of single quotes', 'Put true in double quotes so it becomes a string', 'Remove the comma after 20', 'Rename the keys so they contain no underscores'],
    answer: [1, 3],
    explanation: 'RFC 8259 strings must use double quotes, so `\'sw01\'` is invalid, and JSON has no trailing commas, so `[10, 20,]` is invalid. Python\'s parser reports exactly these two errors in turn (`Expecting value: line 2 column 15`, then `Illegal trailing comma before end of array`); with both fixed it parses. `null` is the correct JSON literal; `None` is Python. `true` is a valid JSON boolean; quoting it would change it into a string. Underscores are allowed in keys: any double-quoted string is a valid key.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. PyYAML refuses to load this inventory file. Which line causes the error?',
    exhibit: `1  ---
2  hostname: sw01
3  interfaces:
4    - name: GigabitEthernet1/0/1
5      description: Uplink: core-01
6      vlan: 10

yaml.scanner.ScannerError: mapping values are not allowed here
  in "<unicode string>", line 5, column 24:
        description: Uplink: core-01
                           ^`,
    options: ['Line 1, because a YAML file cannot start with three dashes', 'Line 4, because a list item cannot contain a mapping', 'Line 5, because the unquoted value contains a colon followed by a space', 'Line 6, because the integer 10 must be quoted'],
    answer: [2],
    explanation: 'A plain (unquoted) scalar cannot contain `": "`, because YAML reads it as the start of another mapping; the error points at line 5. Quote the value: `description: "Uplink: core-01"`. `---` is the optional start-of-document marker and is valid. A sequence item can be a mapping, which is how lists of interfaces are normally written. `10` is a valid integer scalar; quoting is only needed to force a string.' },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. The XML document is not well-formed; a parser reports "mismatched tag: line 7, column 2". Exactly one end tag is missing. Enter the end tag that must be inserted after line 3 to make the document well-formed.',
    exhibit: `1  <interfaces>
2    <interface name="Gi1/0/1">
3      <vlan>10</vlan>
4    <interface name="Gi1/0/2">
5      <vlan>20</vlan>
6    </interface>
7  </interfaces>`,
    answer: ['</interface>'],
    explanation: 'The `<interface>` opened on line 2 is never closed, so the parser reaches `</interfaces>` on line 7 while `<interface>` is still open and reports a mismatched tag there. Inserting `</interface>` after line 3 closes the first interface so that the two `<interface>` elements become siblings, each properly nested inside `<interfaces>`.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Which statement about this XML document is true?',
    exhibit: `<?xml version="1.0" encoding="UTF-8"?>
<device managed="true">
  <hostname>sw01</hostname>
  <interfaces>
    <interface name="GigabitEthernet1/0/1" enabled="true">
      <vlan>10</vlan>
    </interface>
    <interface name="GigabitEthernet1/0/2" enabled="false">
      <vlan>20</vlan>
    </interface>
  </interfaces>
</device>`,
    options: ['The document is not well-formed because it has two <interface> elements with the same name', 'XML parsers treat the value of enabled as a boolean because it is spelled true or false', 'The interface names are attributes, and the VLAN numbers are child elements', 'The <?xml ...?> declaration is mandatory, and without it the document would be rejected'],
    answer: [2],
    explanation: '`name="..."` and `enabled="..."` sit inside the start tags, so they are attributes; `<vlan>` is a child element with text content. Repeated sibling elements with the same name are how XML represents a list, so the document is well-formed. XML has no built-in data types: `true` is just text until a schema or your code interprets it. The XML declaration is optional (if present it must come first).' },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L11,
    stem: 'An engineer is reviewing payloads from several tools. Match each scenario to the data format it uses.',
    pairs: [
      ['The <rpc-reply> a router returns over a NETCONF SSH session (RFC 6241)', 'XML'],
      ['The body of a Meraki Dashboard API v1 GET /organizations response', 'JSON'],
      ['An Ansible playbook with comments explaining each task', 'YAML'],
    ],
    explanation: 'NETCONF messages, including `<rpc>` and `<rpc-reply>`, are XML-encoded (RFC 6241). The Meraki Dashboard API v1 returns JSON bodies, as most REST APIs do. Ansible playbooks and inventories are written in YAML, which, unlike JSON, supports `#` comments.' },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L11,
    stem: 'Which two statements correctly compare JSON and YAML? (Choose two.)',
    options: ['YAML supports comments that start with #, while JSON has no comment syntax', 'JSON uses indentation to define nesting, while YAML uses braces only', 'YAML 1.2 was designed so that JSON documents are also valid YAML', 'JSON allows tab characters for indentation, while YAML requires them', 'JSON object keys may be unquoted numbers, while YAML keys must be quoted'],
    answer: [0, 2],
    explanation: 'YAML has `#` comments; RFC 8259 defines no comments for JSON. The YAML 1.2.2 specification says the primary focus of YAML 1.2 was making YAML a strict superset of JSON, so a JSON document is valid YAML in practice. JSON nesting is defined by braces and brackets, and whitespace is insignificant; YAML uses indentation (and also allows flow style with braces). YAML forbids tabs for indentation. JSON keys must be double-quoted strings, and YAML keys need not be quoted.' },
  { topic: '1.1', type: 'single', difficulty: 3, lesson: L11,
    stem: 'Refer to the exhibit. A RESTCONF reply from an IOS XE router declares a namespace. What does the xmlns attribute do?',
    exhibit: `<interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
  <interface>
    <name>GigabitEthernet1</name>
    <enabled>true</enabled>
  </interface>
</interfaces>`,
    options: ['It tells the parser to download the schema from the URI and validate the document against it', 'It places <interfaces> and all its unprefixed descendants in the ietf-interfaces namespace, so their names cannot collide with elements of the same name from other models', 'It applies only to the <interfaces> element; child elements without their own xmlns stay in no namespace', 'It marks the document as JSON-compatible so that it can be converted with json.loads'],
    answer: [1],
    explanation: 'A default namespace declaration (`xmlns="..."`) applies to the element that carries it and to every unprefixed descendant, so `<interface>`, `<name>` and `<enabled>` are all in the ietf-interfaces namespace. That is how XML keeps identically named elements from different YANG models apart. The URI is an identifier, not a location that is fetched or used for automatic validation. The declaration is inherited by descendants, not limited to one element. It has nothing to do with JSON, and `json.loads` cannot parse XML.' },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11,
    stem: 'Refer to the exhibit. A parser rejects this XML with "mismatched tag: line 2, column 18". What is wrong?',
    exhibit: `<device>
  <Hostname>sw01</hostname>
</device>`,
    options: ['XML element names are case-sensitive, so <Hostname> and </hostname> are different elements', 'Element text must be enclosed in double quotes', 'The root element must be named <root>', 'An element that contains text must be self-closing'],
    answer: [0],
    explanation: 'XML names are case-sensitive: `<Hostname>` is closed only by `</Hostname>`, so `</hostname>` is a mismatched tag. Text content is never quoted; only attribute values are. The root element can have any valid name. A self-closing tag (`<x/>`) is for elements with no content, not elements with text.' },

  // ---------- 1.2 Parsing to Python ----------
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L12,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `import json

resp = '{"hostname": "sw01", "uptime_days": 42, "location": null, "vlans": [10, 20]}'
data = json.loads(resp)
print(type(data["vlans"]).__name__, type(data["uptime_days"]).__name__, data["location"])`,
    options: ['array number null', 'tuple float None', 'list str null', 'list int None'],
    answer: [3],
    explanation: 'Per the `json` module\'s decoding table, a JSON array becomes a Python `list`, an integer number becomes `int`, and `null` becomes `None`, so the script prints `list int None`. "array", "number" and "null" are JSON type names, not Python ones. With default settings the decoder never produces a `tuple` (tuples normally appear only on the encoding side), and an integer is not decoded as `float`. Unquoted `42` is a number, not a `str`.' },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L12,
    stem: 'Refer to the exhibit. Enter the json module function that belongs in the blank so the script reads the open file and returns a list of device dictionaries.',
    exhibit: `import json

with open("inventory.json") as f:
    devices = json.________(f)

for device in devices:
    print(device["hostname"])`,
    answer: ['load', 'json.load'],
    explanation: '`json.load()` takes a file-like object (anything with `.read()`), such as `f` from `with open(...)`, and returns the parsed Python object. `json.loads()` takes a string, so `json.loads(f)` raises `TypeError` because `f` is a file object; `json.dump()` and `json.dumps()` serialise instead of parsing.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `import json

body = {"enabled": True, "description": None, 10: "users"}
print(json.dumps(body))`,
    options: ['{"enabled": True, "description": None, 10: "users"}', '{"enabled": "True", "description": "", "10": "users"}', 'TypeError: keys must be str, int, float, bool or None, not int', '{"enabled": true, "description": null, "10": "users"}'],
    answer: [3],
    explanation: '`json.dumps()` converts `True` to `true` and `None` to `null`, and because JSON object keys are always strings it converts the integer key `10` to `"10"`. The output was produced by running the script. The first option is the Python repr, not JSON. Booleans are not turned into strings, and `None` becomes `null`, not an empty string. Integer keys are allowed and converted, so no `TypeError` is raised.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `import xml.etree.ElementTree as ET

xml = """<device>
  <hostname>rtr01</hostname>
  <interfaces>
    <interface name="GigabitEthernet1" enabled="true"><mtu>1500</mtu></interface>
    <interface name="GigabitEthernet2" enabled="false"><mtu>9000</mtu></interface>
  </interfaces>
</device>"""
root = ET.fromstring(xml)
print(len(root.findall("interface")), len(list(root.iter("interface"))))
first = root.find("interfaces/interface")
print(first.attrib)
print(first.find("mtu").text + "0")`,
    options: ['2 2\n{\'name\': \'GigabitEthernet1\', \'enabled\': True}\n1500', '0 2\n{\'name\': \'GigabitEthernet1\', \'enabled\': \'true\'}\n15000', '0 2\n{\'name\': \'GigabitEthernet1\', \'enabled\': True}\nTypeError', '2 0\n[\'name\', \'enabled\']\n15000'],
    answer: [1],
    explanation: 'With a bare tag name, `findall()` matches direct children only, and `<interface>` is a grandchild of `<device>`, so it returns 0 matches; `iter()` walks the whole subtree and finds 2. `.attrib` is a dict whose values are always strings, so `enabled` is `\'true\'`, not `True`. `.text` is the string `\'1500\'`, and `\'1500\' + "0"` concatenates to `15000`; there is no `TypeError` because both operands are strings. `.attrib` is a dict, not a list of names.' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. Enter the Element method that belongs in the blank so the loop prints each interface\'s name attribute.',
    exhibit: `import xml.etree.ElementTree as ET

root = ET.parse("device.xml").getroot()
for intf in root.iter("interface"):
    print(intf.______("name"))

# Expected output
GigabitEthernet1/0/1
GigabitEthernet1/0/2

# device.xml (excerpt)
<interface name="GigabitEthernet1/0/1" enabled="true">`,
    answer: ['get', 'attrib.get'],
    explanation: '`Element.get(key)` returns the value of the named attribute (or `None` if it is absent). `intf.attrib.get("name")` gives the same result, because `.attrib` is a plain dict. `intf.attrib["name"]` would also work, but it uses square brackets rather than a call. `find()` and `findall()` look for child elements, not attributes, so `find("name")` would return `None` here.' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. Enter exactly what the script prints.',
    exhibit: `import yaml

doc = """
hostname: sw01
interfaces:
  - name: GigabitEthernet1/0/1
    shutdown: no
    vlan: 10
"""
cfg = yaml.safe_load(doc)
print(cfg["interfaces"][0]["shutdown"])`,
    answer: ['False'],
    explanation: 'PyYAML implements YAML 1.1, whose boolean type includes `yes`/`no` and `on`/`off`, so the unquoted `no` loads as the Python boolean `False` and the script prints `False` (verified with PyYAML 6.0.3). A YAML 1.2 core-schema parser would keep `no` as the string `"no"`. Write `shutdown: "no"` or, better, `shutdown: false` to avoid the ambiguity.' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12,
    stem: 'A teammate\'s inventory script uses yaml.load(f, Loader=yaml.Loader) to read YAML files submitted by other teams. Why should it use yaml.safe_load instead? (Choose two.)',
    options: ['safe_load constructs only standard YAML types such as dict, list, str, int, float, bool and None', 'The full loader can construct arbitrary Python objects from tags such as !!python/object/apply, which can run code', 'safe_load also validates the file against a YANG model', 'safe_load is the only PyYAML function that accepts a file object', 'safe_load interprets the file as YAML 1.2, so no and on stay strings'],
    answer: [0, 1],
    explanation: 'PyYAML\'s documentation says `yaml.load` with the full `Loader` "is as powerful as pickle.load and so may call any Python function", for example via `!!python/object/apply:os.system`; `safe_load` recognises only standard YAML tags and builds plain Python types, raising `ConstructorError` for the rest. PyYAML has no YANG validation. `yaml.load`, `safe_load` and others all accept strings or file objects. `safe_load` still follows YAML 1.1 implicit typing, so `no` and `on` still become booleans.' },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L12,
    stem: 'Refer to the exhibit. The script worked when the device returned two interfaces, but fails now that it returns one. Why?',
    exhibit: `import xmltodict

xml = """<interfaces>
  <interface name="Gi1/0/1"><vlan>10</vlan></interface>
</interfaces>"""
data = xmltodict.parse(xml)
for intf in data["interfaces"]["interface"]:
    print(intf["@name"])

Traceback (most recent call last):
  ...
    print(intf["@name"])
          ~~~~^^^^^^^^^
TypeError: string indices must be integers, not 'str'`,
    options: ['xmltodict cannot parse attributes, so @name does not exist', 'With one <interface>, xmltodict returns a dict instead of a list, so the loop iterates over the dict\'s keys, which are strings', 'xmltodict returns ElementTree Element objects, which cannot be indexed by name', 'The vlan value 10 is an int, which cannot be printed with an attribute key'],
    answer: [1],
    explanation: 'xmltodict turns repeated sibling elements into a list, but a single element into a dict. Looping over a dict yields its keys (`\'@name\'`, `\'vlan\'`), and indexing a string with `"@name"` raises the `TypeError` shown. Use `force_list=("interface",)` or normalise the value to a list. xmltodict does parse attributes, with an `@` prefix. It returns dicts, not `Element` objects. All values, including `10`, are strings.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. A script parses an IOS XE RESTCONF reply with ElementTree. Why does the first print show None?',
    exhibit: `import xml.etree.ElementTree as ET

xml = """<interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
  <interface><name>GigabitEthernet1</name><enabled>true</enabled></interface>
</interfaces>"""
root = ET.fromstring(xml)
print(root.find("interface"))
ns = {"if": "urn:ietf:params:xml:ns:yang:ietf-interfaces"}
print(root.find("if:interface/if:name", ns).text)

# Output
None
GigabitEthernet1`,
    options: ['ElementTree stores the tags with the namespace URI, as {urn:ietf:params:xml:ns:yang:ietf-interfaces}interface, so the bare name does not match', 'find() only searches attributes, not child elements', 'fromstring() returns an ElementTree, not an Element, so find() cannot work on it', 'The interface element has no text of its own, so find() returns None'],
    answer: [0],
    explanation: 'ElementTree expands namespaced names to `{uri}localname`, so a bare `"interface"` matches nothing and `find()` returns `None`. A prefix map (or the full `{uri}interface` name) fixes it, as the second print shows. `find()` searches child elements. `fromstring()` returns the root `Element`. `find()` returns a matching element regardless of whether that element has text.' },
  { topic: '1.2', type: 'match', difficulty: 1, lesson: L12,
    stem: 'A script calls json.loads() on this API reply: {"name": "Gi1/0/1", "mtu": 1500, "load": 0.25, "up": true, "desc": null, "vlans": [10, 20]}. Match each value to the Python type it becomes.',
    pairs: [
      ['"Gi1/0/1"', 'str'],
      ['1500', 'int'],
      ['0.25', 'float'],
      ['true', 'bool'],
      ['null', 'NoneType'],
      ['[10, 20]', 'list'],
    ],
    explanation: 'From the `json` module decoding table: string to `str`, integer number to `int`, real number to `float`, `true`/`false` to `True`/`False` (type `bool`), `null` to `None` (type `NoneType`), array to `list`, and the outer object to `dict`.' },

  // ---------- 1.3 TDD ----------
  { topic: '1.3', type: 'order', difficulty: 1, lesson: L13,
    stem: 'An engineer uses test-driven development to add a function that converts "Po10" to "Port-channel10" in an existing helper module. Put the steps in the correct order.',
    items: ['Write a unit test that asserts expand_intf("Po10") returns "Port-channel10"', 'Run the test suite and confirm the new test fails', 'Write the simplest code that makes the new test pass', 'Run the test suite and confirm all tests pass', 'Refactor the code for clarity, rerunning the tests to confirm they still pass'],
    explanation: 'TDD is red, green, refactor. The test is written first and must fail on its first run (red), which proves it can detect the missing behaviour. Then the minimum code is written until the whole suite passes (green), and only then is the code cleaned up with the tests still passing (refactor). The next behaviour starts a new cycle.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13,
    stem: 'Refer to the exhibit. A developer following TDD wrote two tests before writing any implementation and has just written a first implementation. Which statement describes this result?',
    exhibit: `alice@devbox:~/netutils$ python3 -m unittest test_netutils
.F
======================================================================
FAIL: test_tengig (test_netutils.TestExpandIntf.test_tengig)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/alice/netutils/test_netutils.py", line 11, in test_tengig
    self.assertEqual(expand_intf("Te1/1/1"), "TenGigabitEthernet1/1/1")
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 'Te1/1/1' != 'TenGigabitEthernet1/1/1'
- Te1/1/1
+ TenGigabitEthernet1/1/1


----------------------------------------------------------------------
Ran 2 tests in 0.000s

FAILED (failures=1)`,
    options: ['The suite is still red: one test passed and test_tengig failed its assertion, so the next step is to change the code until both pass', 'The suite is green, so the next step is to refactor', 'Both tests raised errors because the netutils module could not be imported', 'The test is wrong and should be changed to expect Te1/1/1 so the suite passes'],
    answer: [0],
    explanation: '`.F` means one test passed and one failed, and `FAILED (failures=1)` confirms the suite is not green, so the developer stays in the red-to-green step and changes the implementation. Refactoring comes only when everything passes. An import problem would be reported as an `ERROR` (`E`), not an assertion failure, and the traceback shows `expand_intf` ran. Changing the test to match the wrong output defeats the purpose of TDD: the test encodes the requirement.' },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L13,
    stem: 'Which statement best describes test-driven development?',
    options: ['Developers write the complete application, then a QA team writes tests before release', 'Tests are generated automatically from the code after each commit', 'Testing is a separate phase that starts when all requirements are implemented', 'Developers write a failing automated test for a small piece of behaviour first, then write the code to make it pass, then refactor'],
    answer: [3],
    explanation: 'TDD writes the test before the code in short red-green-refactor cycles, so tests drive the design. Writing tests after the application is test-after development. Generating tests from existing code is not TDD and cannot express requirements that the code does not yet meet. A separate testing phase after implementation describes waterfall.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13,
    stem: 'Which two are benefits of test-driven development? (Choose two.)',
    options: ['A regression suite builds up, so a later change that breaks existing behaviour is detected quickly', 'Code no longer needs review because the tests prove it is correct', 'Developers can refactor with confidence because the tests show whether behaviour changed', 'Unit tests replace the need for integration testing against real devices', 'Less code is written in total, because tests are optional once code works'],
    answer: [0, 2],
    explanation: 'Every behaviour comes with a test, so the suite catches regressions and gives a safety net for refactoring. Tests only cover what they assert, so code review is still needed. Unit tests usually mock devices and APIs, so integration tests are still required. TDD typically means writing more code (the tests), and the tests are kept and maintained, not dropped.' },

  // ---------- 1.4 Development methods ----------
  { topic: '1.4', type: 'match', difficulty: 2, lesson: L14,
    stem: 'Match each team description to the software development method it is following.',
    pairs: [
      ['Requirements for a provisioning tool are fully documented and signed off before design starts; testing begins only after all coding is complete', 'Waterfall'],
      ['The team delivers a working increment of the tool every two weeks, demos it to the NOC and reprioritises the backlog from their feedback', 'Agile'],
      ['The team maps the change-request value stream, finds that most of the elapsed time is waiting for hand-offs, and limits work in progress to cut that waste', 'Lean'],
    ],
    explanation: 'Fixed, signed-off requirements, sequential phases and testing after implementation are waterfall. Short iterations that each deliver working software, with customer collaboration and a reprioritised backlog, are agile (Scrum-style sprints). Value stream mapping, eliminating waste such as waiting and hand-offs, and WIP limits are lean.' },
  { topic: '1.4', type: 'single', difficulty: 1, lesson: L14,
    stem: 'Which value is stated in the Manifesto for Agile Software Development?',
    options: ['Comprehensive documentation over working software', 'Following a plan over responding to change', 'Customer collaboration over contract negotiation', 'Processes and tools over individuals and interactions'],
    answer: [2],
    explanation: 'The manifesto values individuals and interactions over processes and tools, working software over comprehensive documentation, customer collaboration over contract negotiation, and responding to change over following a plan. The other three options reverse those values.' },
  { topic: '1.4', type: 'multi', difficulty: 2, lesson: L14,
    stem: 'Which two characteristics describe the waterfall model? (Choose two.)',
    options: ['Each phase is completed and signed off before the next phase begins', 'Work is delivered in short iterations, each ending with working software', 'Requirements are gathered and fixed at the start of the project', 'Work in progress is limited on a Kanban board to optimise flow', 'Customers review a new increment at the end of every sprint'],
    answer: [0, 2],
    explanation: 'Waterfall runs sequential phases with gates, and it gathers and freezes requirements up front. Short iterations with working software and per-sprint customer reviews are agile (Scrum). WIP limits on a Kanban board come from lean (and are also used by agile teams).' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'An automation team notices that finished scripts wait three weeks for a change-board slot, features nobody requested keep being added, and engineers switch between five tasks a day. Which lean principle addresses these problems most directly?',
    options: ['Eliminate waste', 'Decide as late as possible', 'Responding to change over following a plan', 'Big design up front'],
    answer: [0],
    explanation: 'Partially done work waiting for deployment, extra features and task switching are three of the seven software wastes the Poppendiecks identify, so "eliminate waste" is the principle that targets them. "Decide as late as possible" is a lean principle about keeping options open, not about removing these delays. "Responding to change over following a plan" is an Agile Manifesto value, not a lean principle. Big design up front is associated with waterfall.' },

  // ---------- 1.5 Functions, classes, modules ----------
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `class Switch:
    vendor = "Cisco"

    def __init__(self, hostname, ports=48):
        self.hostname = hostname
        self.ports = ports
        self.vlans = []

    def add_vlan(self, vlan_id):
        if vlan_id not in self.vlans:
            self.vlans.append(vlan_id)
        return len(self.vlans)


sw1 = Switch("sw01")
sw2 = Switch("sw02", ports=24)
sw1.add_vlan(10)
print(sw1.add_vlan(10), sw1.add_vlan(20))
print(sw2.ports, sw2.vlans, Switch.vendor, sw2.vendor)`,
    options: ['2 3\n24 [10, 10, 20] Cisco Cisco', '1 2\n48 [] Cisco Cisco', '1 2\n24 [] Cisco Cisco', '1 2\n24 [10, 20] Cisco AttributeError'],
    answer: [2],
    explanation: 'The method skips a VLAN that is already present, so the second `add_vlan(10)` still returns 1, and adding 20 returns 2. `sw2` was created with `ports=24` and has its own empty `vlans` list, because `self.vlans` is an instance attribute created in `__init__`. `vendor` is a class attribute, readable through the class and through any instance, so both print `Cisco`. The output was produced by running the script.' },
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15,
    stem: 'Refer to the exhibit. The engineer runs python3 report.py. What is printed?',
    exhibit: `# inventory.py
SITE = "dc1"

def device_count(devices):
    return len(devices)

print("inventory loaded")

if __name__ == "__main__":
    print("running as a script")

# report.py
import inventory
from inventory import device_count

print(inventory.SITE, device_count(["sw01", "sw02"]))`,
    options: ['inventory loaded\nrunning as a script\ndc1 2', 'inventory loaded\ninventory loaded\ndc1 2', 'dc1 2', 'inventory loaded\ndc1 2'],
    answer: [3],
    explanation: 'A module\'s top-level code runs once, on its first import, so "inventory loaded" prints once even though `inventory` is imported twice (the second import uses the cached module). Inside the imported module `__name__` is `"inventory"`, not `"__main__"`, so the guarded line does not run. Then `report.py` prints `dc1 2`. The output was produced by running the files.' },
  { topic: '1.5', type: 'multi', difficulty: 2, lesson: L15,
    stem: 'A team has five scripts that each contain their own copy of a function that parses show interfaces output. Which two benefits do they gain by moving the function into a shared module that every script imports? (Choose two.)',
    options: ['A bug fix in the parser is made once and every script picks it up', 'The scripts run faster because imported code is compiled to machine code', 'The parser can be unit-tested and versioned on its own, separate from the scripts', 'The function becomes private and cannot be called by the scripts', 'Python no longer needs the scripts to be in the same language version'],
    answer: [0, 2],
    explanation: 'A shared module removes duplicated code, so a fix in one place reaches every caller, and it lets the parser be tested, reviewed and versioned as its own unit. Python compiles modules to bytecode, not machine code, and importing does not meaningfully speed up execution. Moving a function into a module does not make it private; importing it is the whole point. Modules do not remove Python version requirements.' },

  // ---------- 1.6 Design patterns ----------
  { topic: '1.6', type: 'single', difficulty: 2, lesson: L16,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `class Device:
    def __init__(self, hostname):
        self.hostname = hostname
        self.status = "up"
        self._observers = []

    def attach(self, observer):
        self._observers.append(observer)

    def set_status(self, status):
        if status != self.status:
            self.status = status
            for observer in self._observers:
                observer.update(self)


class SyslogAlert:
    def update(self, device):
        print(f"syslog: {device.hostname} is {device.status}")


class WebexAlert:
    def update(self, device):
        print(f"webex: {device.hostname} changed to {device.status}")


sw = Device("sw01")
sw.attach(SyslogAlert())
sw.attach(WebexAlert())
sw.set_status("down")
sw.set_status("down")
sw.set_status("up")`,
    options: ['syslog: sw01 is down\nwebex: sw01 changed to down\nsyslog: sw01 is up\nwebex: sw01 changed to up', 'syslog: sw01 is down\nwebex: sw01 changed to down\nsyslog: sw01 is down\nwebex: sw01 changed to down\nsyslog: sw01 is up\nwebex: sw01 changed to up', 'syslog: sw01 is up\nwebex: sw01 changed to up', 'Nothing, because the observers were never told which device to watch'],
    answer: [0],
    explanation: 'This is the Observer pattern: the subject (`Device`) notifies every attached observer when its state changes. Only two calls actually change the status (up to down, then down to up), because the second `"down"` equals the current status, so each observer is notified twice, in attachment order. The observers do not need to know the device in advance; the subject passes itself to `update()`. The output was produced by running the script.' },
  { topic: '1.6', type: 'match', difficulty: 2, lesson: L16,
    stem: 'A team is building a web dashboard for its switch inventory. Match each piece of code to the role it plays.',
    pairs: [
      ['Code that stores the inventory and rejects a device with no hostname', 'MVC model'],
      ['A template that renders the device list as an HTML table', 'MVC view'],
      ['A handler that receives the "add device" form POST, calls the inventory code and picks the page to return', 'MVC controller'],
      ['Alerting and logging classes that register with each device object and are called automatically whenever its status changes', 'Observer pattern'],
    ],
    explanation: 'In MVC the model holds the data and business rules, the view presents it, and the controller handles input and coordinates the model and view. Objects that register with a subject and are notified automatically of its state changes are observers in the Observer pattern, which keeps the device class decoupled from the alerting code.' },
  { topic: '1.6', type: 'single', difficulty: 1, lesson: L16,
    stem: 'A team wants to offer the same device inventory as an HTML page, a CLI table and a JSON API without changing the code that validates and stores devices. Which advantage of MVC does this rely on?',
    options: ['The controller caches the database, so no model is needed', 'Separation of concerns: several views can present one model, and the model contains no presentation code', 'The view enforces business rules, so each output format validates its own data', 'MVC makes every object notify its subscribers automatically'],
    answer: [1],
    explanation: 'MVC separates data and rules (model) from presentation (views) and input handling (controller), so new views can be added over the same model without touching it. The model is still needed; the controller does not replace it. Business rules belong in the model, not the views. Automatic notification of subscribers describes the Observer pattern.' },

  // ---------- 1.7 Version control ----------
  { topic: '1.7', type: 'single', difficulty: 1, lesson: L17,
    stem: 'After a change window, a switch template on the team\'s shared drive no longer works. Nobody knows who edited it, what changed or what the previous working version looked like. Which advantage of version control would have prevented this situation?',
    options: ['Automatic encryption of every file at rest', 'Faster execution of the template on the switch', 'A recorded history of every change with its author, time and message, plus the ability to compare and restore earlier versions', 'Automatic validation of the template syntax against the device'],
    answer: [2],
    explanation: 'Version control keeps every committed version with who, when and why, so `git log` and `git diff` show the change and the earlier version can be restored. It does not encrypt files, change how fast a template runs, or validate syntax by itself (that is the job of tests or a CI pipeline that runs from the repository).' },
  { topic: '1.7', type: 'multi', difficulty: 2, lesson: L17,
    stem: 'Which two statements about Git are true? (Choose two.)',
    options: ['Every clone contains the full history of the repository, so commits can be made offline', 'Git is a hosting service, and GitHub is the version control software it runs', 'A change must be staged with git add before git commit records it (unless git commit -a is used for tracked files)', 'Git requires a connection to a central server for every commit', 'Git stores only the latest version of each file and discards older versions'],
    answer: [0, 2],
    explanation: 'Git is a distributed VCS: each clone is a complete repository, and committing is local. Changes go from the working tree to the staging area with `git add`, then into a commit (`git commit -a` stages modified tracked files automatically). GitHub, GitLab and Bitbucket are hosting services for Git repositories, not the reverse. Git needs no server to commit. It keeps every committed version.' },

  // ---------- 1.8 Git operations ----------
  { topic: '1.8', type: 'order', difficulty: 2, lesson: L18A,
    stem: 'An engineer must contribute an ACL change to the team repository at https://git.example.com/netops/netconfigs.git without committing directly to main. Team policy is to create the feature branch before editing or staging anything. Put the steps in the correct order.',
    items: ['git clone https://git.example.com/netops/netconfigs.git', 'git switch -c feature/acl-update', 'Edit acl.cfg, then git add acl.cfg', 'git commit -m "Allow HTTPS from management subnet"', 'git push -u origin feature/acl-update', 'Open a pull request from feature/acl-update into main'],
    explanation: 'Clone first to get the repository and the `origin` remote. Create and switch to a feature branch before changing anything, so main is untouched. Stage the edit with `git add`, record it with `git commit`, and publish the branch with `git push -u origin feature/acl-update` (`-u` sets the upstream). Finally, open a pull (merge) request so the change is reviewed before it is merged into main.' },
  { topic: '1.8', type: 'fill', difficulty: 2, lesson: L18A,
    stem: 'Refer to the exhibit. creds.env was committed by mistake. Enter the full Git command that removes creds.env from the index so the next commit stops tracking it, while leaving the file on disk.',
    exhibit: `alice@devbox:~/netconfigs$ git ls-files
.gitignore
README.md
creds.env
sw01.cfg
alice@devbox:~/netconfigs$ cat .gitignore
creds.env`,
    answer: ['git rm --cached creds.env', 'git rm --cached -- creds.env', 'git rm --cached ./creds.env', 'git rm --cached -- ./creds.env', 'git rm -r --cached creds.env', 'git rm --cached -r creds.env'],
    explanation: '`git rm --cached <file>` removes the path from the index only; the file stays in the working tree and becomes untracked, and because `.gitignore` already lists it, it will not be offered again. Commit afterwards. `.gitignore` alone has no effect on a file that is already tracked, as `git ls-files` shows. Plain `git rm creds.env` would also delete the file from disk. The secret remains in earlier commits, so it must be rotated.' },
  { topic: '1.8', type: 'single', difficulty: 2, lesson: L18B,
    stem: 'Refer to the exhibit. The engineer was on main and ran git merge hotfix. Which statement is correct?',
    exhibit: `alice@devbox:~/automation$ git merge hotfix
Auto-merging ntp.cfg
CONFLICT (content): Merge conflict in ntp.cfg
Automatic merge failed; fix conflicts and then commit the result.
alice@devbox:~/automation$ cat ntp.cfg
ntp server 10.10.20.5
<<<<<<< HEAD
ntp server 10.10.20.8
=======
ntp server 10.10.20.7
>>>>>>> hotfix`,
    options: ['10.10.20.7 is the version on main and 10.10.20.8 is the version on hotfix', '10.10.20.8 is the version on main and 10.10.20.7 is the version on hotfix', 'Git has already committed both lines, and the markers are only comments', 'The line ntp server 10.10.20.5 is in conflict and must be removed'],
    answer: [1],
    explanation: 'The section between `<<<<<<< HEAD` and `=======` is the current branch (HEAD, here main), and the section between `=======` and `>>>>>>> hotfix` is the incoming branch. Nothing has been committed: the merge stopped, and the markers are literal text that must be removed before the file is staged. `ntp server 10.10.20.5` is outside the markers, so it merged cleanly.' },
  { topic: '1.8', type: 'fill', difficulty: 2, lesson: L18B,
    stem: 'Refer to the exhibit. The engineer has edited ntp.cfg to the correct content and removed all conflict markers. Enter the Git command that marks ntp.cfg as resolved, before git commit completes the merge.',
    exhibit: `alice@devbox:~/automation$ git status --short
UU ntp.cfg
alice@devbox:~/automation$ cat ntp.cfg
ntp server 10.10.20.5
ntp server 10.10.20.8`,
    answer: ['git add ntp.cfg', 'git add -- ntp.cfg', 'git add ./ntp.cfg', 'git add .', 'git add -A', 'git add --all', 'git add -u', 'git stage ntp.cfg'],
    explanation: '`UU` means the file is unmerged (both sides modified it). Staging the edited file with `git add ntp.cfg` tells Git the conflict is resolved. Because the resolved content keeps main\'s `10.10.20.8` line and so matches `HEAD`, `git status --short` then prints nothing for ntp.cfg, and `git status` reports "All conflicts fixed but you are still merging." (keeping hotfix\'s line instead would show `M `). Then `git commit` creates the merge commit. `git merge --abort` would discard the merge instead, and `git commit` before staging is refused while unmerged paths remain.' },
  { topic: '1.8', type: 'order', difficulty: 2, lesson: L18B,
    stem: 'git merge feature/rename-vlan has stopped with "Automatic merge failed; fix conflicts and then commit the result." The engineer scrolled past the CONFLICT lines and does not know which files conflict. Put the steps that complete the merge in the correct order.',
    items: ['Run git status to list the unmerged paths (it shows both modified: sw01.cfg)', 'Open sw01.cfg and decide which change to keep between the <<<<<<< and >>>>>>> markers', 'Edit the file to its final content and delete the <<<<<<<, ======= and >>>>>>> lines', 'git add sw01.cfg', 'git commit'],
    explanation: '`git status` lists the files under "Unmerged paths". In each file the markers delimit the current branch\'s version and the incoming version; edit the file to the correct result and remove all three marker lines. `git add` marks the file resolved, and `git commit` records the merge commit (Git proposes the message "Merge branch \'feature/rename-vlan\'").' },
  { topic: '1.8', type: 'single', difficulty: 2, lesson: L18B,
    stem: 'Refer to the exhibit. Which command displays the change to ntp.cfg?',
    exhibit: `alice@devbox:~/automation$ git status --short
M  acl.cfg
 M ntp.cfg`,
    options: ['git diff --staged', 'git diff', 'git log -p -1', 'git diff --cached ntp.cfg'],
    answer: [1],
    explanation: 'In short status the left column is the staging area and the right column the working tree. ` M ntp.cfg` means ntp.cfg is modified but not staged, so plain `git diff` (working tree vs index) shows it. `M  acl.cfg` is staged, so `git diff --staged` (index vs last commit) shows acl.cfg, not ntp.cfg; `--cached` is a synonym of `--staged`, so the ntp.cfg variant shows nothing. `git log -p -1` shows the last commit, which contains neither change.' },
  { topic: '1.8', type: 'single', difficulty: 2, lesson: L18B,
    stem: 'Refer to the exhibit. What will the next commit contain if the engineer runs git commit -m "Allow HTTPS from mgmt" now?',
    exhibit: `alice@devbox:~/automation$ git diff --staged
diff --git a/acl.cfg b/acl.cfg
index 1027e69..fbd8c12 100644
--- a/acl.cfg
+++ b/acl.cfg
@@ -1,3 +1,4 @@
 ip access-list extended MGMT
  permit tcp 10.10.20.0 0.0.0.255 any eq 22
+ permit tcp 10.10.20.0 0.0.0.255 any eq 443
  deny ip any any log
alice@devbox:~/automation$ git diff
diff --git a/ntp.cfg b/ntp.cfg
index 2bae578..eaa4276 100644
--- a/ntp.cfg
+++ b/ntp.cfg
@@ -1 +1,2 @@
 ntp server 10.10.20.5
+ntp server 10.10.20.6`,
    options: ['Both the new ACL line and the new NTP server', 'Only the new NTP server', 'Nothing, because git commit requires -a when files are modified', 'Only the new permit ... eq 443 ACL line'],
    answer: [3],
    explanation: '`git diff --staged` shows what is in the index, which is exactly what `git commit` records: the added `eq 443` line in acl.cfg. `git diff` shows the unstaged ntp.cfg edit, which stays in the working tree for a later commit. `-a` is only needed to include unstaged changes to tracked files; staged changes are committed without it.' },
  { topic: '1.8', type: 'single', difficulty: 2, lesson: L18B,
    stem: 'Refer to the exhibit. Why did this merge not create a merge commit?',
    exhibit: `alice@devbox:~/automation$ git switch main
Switched to branch 'main'
Your branch is ahead of 'origin/main' by 2 commits.
  (use "git push" to publish your local commits)
alice@devbox:~/automation$ git merge feature/snmp
Updating bd52193..26bcf2b
Fast-forward
 snmp.cfg | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 snmp.cfg
alice@devbox:~/automation$ git log --oneline --graph -4
* 26bcf2b Add SNMP config
* bd52193 Add second NTP server
* 3de0204 Allow HTTPS from mgmt
* 0e9f05f Add MGMT ACL and NTP`,
    options: ['main had no new commits since feature/snmp branched off, so Git only moved the main pointer forward to the branch tip', 'Git squashed the feature commits into one, which never creates a merge commit', 'The merge failed and Git rolled back to bd52193', 'Merge commits are created only by git pull, never by git merge'],
    answer: [0],
    explanation: '"Fast-forward" means the current branch was an ancestor of the branch being merged, so Git simply advanced `main` from bd52193 to 26bcf2b, giving a straight line in the log. Squashing requires `--squash` and stages changes without committing. The merge succeeded; `main` now points at 26bcf2b. `git merge` creates a merge commit whenever both branches have new commits (a three-way merge), or always with `--no-ff`.' },
  { topic: '1.8', type: 'single', difficulty: 2, lesson: L18B,
    stem: 'Refer to the exhibit. Which statement describes commit 2a83c07?',
    exhibit: `alice@devbox:~/automation$ git log --oneline --graph -4
*   2a83c07 Merge branch 'feature/banner'
|\\
| * 86636e2 Add login banner
* | 0eb223e Add syslog host
|/
* 61e92c1 Use regional NTP server
alice@devbox:~/automation$ git log -1 --format="%h parents: %p"
2a83c07 parents: 0eb223e 86636e2`,
    options: ['It is a fast-forward of main to the tip of feature/banner', 'It is the result of a rebase, which rewrote 86636e2', 'It is a conflict marker commit that must be resolved before pushing', 'It is a merge commit from a three-way merge, with two parents, because main and feature/banner had both moved on since 61e92c1'],
    answer: [3],
    explanation: 'Both branches gained a commit after their common ancestor 61e92c1, so Git did a three-way merge and recorded a merge commit whose two parents are the tips of main (0eb223e) and feature/banner (86636e2). A fast-forward creates no new commit and leaves a straight line. A rebase would produce a linear history without a merge commit. There is no such thing as a conflict marker commit; markers live in files during an unfinished merge.' },
  { topic: '1.8', type: 'fill', difficulty: 2, lesson: L18A,
    stem: 'Refer to the exhibit. Before changing any local branch or file, the engineer wants to download the commits that caused the rejection and inspect them with git log main..origin/main. Enter the command that downloads them without merging.',
    exhibit: `alice@devbox:~/netconfigs$ git push
To /home/alice/repos/netconfigs.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to '/home/alice/repos/netconfigs.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.`,
    answer: ['git fetch', 'git fetch origin', 'git fetch origin main', 'git fetch --all', 'git remote update'],
    explanation: '`git fetch` downloads new commits and updates the remote-tracking branch `origin/main` without touching local `main` or the working tree, so the engineer can review them first. `git pull` would fetch and then immediately merge or rebase, which the stem rules out. After reviewing, `git pull` (or `git merge origin/main`) integrates the work and the push can be retried.' },
  { topic: '1.8', type: 'single', difficulty: 2, lesson: L18A,
    stem: 'What is the difference between git fetch and git pull?',
    options: ['git fetch uploads local commits; git pull downloads remote commits', 'git fetch clones a new repository; git pull updates an existing one', 'They are aliases for the same operation', 'git fetch downloads commits and updates remote-tracking branches such as origin/main only; git pull runs a fetch and then merges (or rebases) the upstream branch into the current branch'],
    answer: [3],
    explanation: 'The git-pull documentation says it first runs `git fetch` and then integrates the fetched branch into the current one, by merge (`--no-rebase`) or by rebase (`--rebase`); with neither chosen, current Git only fast-forwards and stops if the branches have diverged. `git fetch` on its own never changes local branches or files. Uploading is `git push`; cloning is `git clone`. They are different commands, not aliases.' },
  { topic: '1.8', type: 'single', difficulty: 1, lesson: L18A,
    stem: 'Refer to the exhibit. Bob has just cloned the team repository. Where does the name origin come from?',
    exhibit: `bob@devbox:~$ git clone /srv/git/netconfigs.git
Cloning into 'netconfigs'...
done.
bob@devbox:~$ cd netconfigs
bob@devbox:~/netconfigs$ git remote -v
origin	/srv/git/netconfigs.git (fetch)
origin	/srv/git/netconfigs.git (push)
bob@devbox:~/netconfigs$ git branch -a
* main
  remotes/origin/HEAD -> origin/main
  remotes/origin/main`,
    options: ['git clone automatically names the remote it cloned from origin, unless --origin gives another name', 'It is the name of the repository owner on the server', 'It is the name of the default branch on the server', 'It was copied from the server\'s own remote configuration'],
    answer: [0],
    explanation: 'The git-clone documentation says clone creates remote-tracking branches under `refs/remotes/origin` and sets `remote.origin.url`; `--origin <name>` uses a different name. It is not the owner, and it is a remote, not a branch: branches show up as `origin/main` and so on. A server\'s own remotes are not copied by a clone.' },
  { topic: '1.8', type: 'multi', difficulty: 3, lesson: L18A,
    stem: 'An engineer runs git init in a new folder on a workstation where no Git settings have been configured, using Git 2.55. Which two statements are true? (Choose two.)',
    options: ['The initial branch is named master, and Git prints a hint that this default will change to main in Git 3.0', 'The initial branch is always named main in every Git version', 'The init.defaultBranch setting (for example git config --global init.defaultBranch main) controls the initial branch name for new repositories', 'git init contacts GitHub to discover the default branch name', 'The initial branch name can never be changed after the repository is created'],
    answer: [0, 2],
    explanation: 'With no `init.defaultBranch` set, Git 2.x names the first branch `master` and prints a hint, as the real output in the lesson shows; the git-init documentation says this will change to `main` in Git 3.0. The `init.defaultBranch` setting, or `git init -b <name>`, chooses the name. `git init` is entirely local. A branch can be renamed at any time with `git branch -m <name>`.' },
  { topic: '1.8', type: 'match', difficulty: 2, lesson: L18B,
    stem: 'An engineer is working in a local clone of the netconfigs repository. Match each situation to the Git command that handles it.',
    pairs: [
      ['Before committing, check exactly which lines the next commit will contain', 'git diff --staged'],
      ['A colleague pushed new commits; download them for review without changing local branches or files', 'git fetch'],
      ['secrets.env was committed by mistake; keep the file locally but stop tracking it', 'git rm --cached secrets.env'],
      ['Start an ACL change on a new branch without touching main', 'git switch -c feature/acl'],
      ['A merge stopped with conflicts and the engineer wants to return to the state before the merge', 'git merge --abort'],
    ],
    explanation: '`git diff --staged` compares the index with the last commit, which is what `git commit` will record. `git fetch` updates `origin/*` only; `git pull` would also merge. `git rm --cached` removes a file from the index but leaves it on disk (add it to `.gitignore` and rotate the secret). `git switch -c` (or `git checkout -b`) creates and switches to a branch. `git merge --abort` abandons a conflicted merge and restores the pre-merge state.' },
  { topic: '1.8', type: 'fill', difficulty: 2, lesson: L18A,
    stem: 'Refer to the exhibit. Alice\'s push to main was rejected, so she ran git fetch and git status -sb. Enter the number of commits that origin/main has and her local main does not.',
    exhibit: `alice@devbox:~/netconfigs$ git fetch
From /home/alice/repos/netconfigs
   9abedfe..b86bdf9  main       -> origin/main
alice@devbox:~/netconfigs$ git status -sb
## main...origin/main [ahead 1, behind 2]`,
    answer: ['2', 'two'],
    explanation: 'In `git status -sb` the bracket compares the current branch with its upstream: `behind 2` means origin/main has two commits that local main lacks (the ones `git log main..origin/main` would list), and `ahead 1` means main has one commit that origin/main lacks. Because both counts are non-zero the branches have diverged, which is why the push was refused; Alice must merge or rebase (for example `git merge origin/main` or `git pull --no-rebase`) before `git push` succeeds. The fetch line shows origin/main moving from 9abedfe to b86bdf9 but does not by itself give the count.' },
  { topic: '1.8', type: 'order', difficulty: 2, lesson: L18A,
    stem: 'Alice\'s git push to main was rejected with "(fetch first)" because Bob pushed two commits. She wants to review Bob\'s commits before anything changes in her branch or files, keep her own commit, and finish with the remote updated. Put the commands in the correct order.',
    items: ['git fetch', 'git log --oneline main..origin/main', 'git merge origin/main', 'git push'],
    explanation: '`git fetch` downloads Bob\'s commits into the remote-tracking branch origin/main without touching main or the working tree. `git log --oneline main..origin/main` then lists the commits on origin/main that main lacks, so she can review them. `git merge origin/main` integrates them (here a merge commit, because both sides have new commits), and only then is `git push` a fast-forward for the remote, so it succeeds. `git pull` would combine the fetch and merge in one step and skip the review the stem asks for; pushing again before integrating is rejected again.' },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
