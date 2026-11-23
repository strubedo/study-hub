// Domain 5 — Infrastructure and Automation. Original questions written from the sources listed in lessons.js (docs.ansible.com, developer.hashicorp.com, the CiscoDevNet Terraform provider docs, nso-docs.cisco.com, the pyATS, Genie and Unicon documentation, virl2_client, the Meraki OpenAPI spec, the Catalyst Center API reference, RFC 6241, 7950, 7951, 8040, 8340, 8343 and 8344, GNU diffutils, git-scm.com, the GNU Bash manual, the GitLab CI reference and UML 2.5.1), checked 2026-11-22. Hosts, ids, tokens and passwords are invented placeholders. Every diff and Bash output in an exhibit was produced by running it (GNU diffutils 3.12, Git 2.55, Bash 5.3, GNU coreutils) in a throwaway directory, with the home directory shown as /home/alice; Python exhibits were compiled and playbooks were checked with ansible-playbook --syntax-check. HTTP, NETCONF, Terraform and NSO output is written from the documentation, not captured from a live system.
const L1 = '5.1-model-driven-value';
const L2 = '5.2-controller-vs-device';
const L3 = '5.3-cml-pyats';
const L4 = '5.4-infra-cicd';
const L5 = '5.5-infrastructure-as-code';
const L6 = '5.6-ansible-terraform-nso';
const L7 = '5.7-python-workflows';
const L8 = '5.8-ansible-playbooks';
const L9 = '5.9-bash-scripts';
const L10 = '5.10-restconf-netconf-results';
const L11 = '5.11-yang-models';
const L12 = '5.12-unified-diff';
const L13 = '5.13-code-review';
const L14 = '5.14-sequence-diagrams';

const ACL_TREE = `module: example-acl
  +--rw acls
     +--rw acl* [name]
        +--rw name      string
        +--rw type?     enumeration
        +--rw ace* [sequence]
        |  +--rw sequence       uint32
        |  +--rw action         enumeration
        |  +--rw protocol?      uint8
        |  +--rw source         inet:ipv4-prefix
        |  +--rw destination?   inet:ipv4-prefix
        |  +--rw dst-ports*     inet:port-number
        |  +--ro match-count?   yang:counter64
        +--ro in-use?   boolean`;

const SW01_DIFF = `$ diff -u old/sw01.cfg new/sw01.cfg
--- old/sw01.cfg	2026-11-20 09:00:00.000000000 +0000
+++ new/sw01.cfg	2026-11-21 14:30:00.000000000 +0000
@@ -4,6 +4,8 @@
  name users
 vlan 20
  name voice
+vlan 30
+ name cameras
 !
 interface GigabitEthernet1/0/1
  description uplink to core
@@ -16,9 +18,9 @@
  spanning-tree portfast
 !
 interface GigabitEthernet1/0/3
- description printer 2-01
+ description camera 2-01
  switchport mode access
- switchport access vlan 10
+ switchport access vlan 30
 !
-ntp server 192.0.2.10
+ntp server 192.0.2.11
 logging host 192.0.2.20`;

const bank = [
  // ---------- 5.1 Model-driven programmability ----------
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Refer to the exhibit. After an IOS XE upgrade the script prints None for every router, although the routers are passing traffic. Which change fixes the cause of the failure rather than the symptom?',
    exhibit: `import re
from netmiko import ConnectHandler

out = conn.send_command("show interfaces GigabitEthernet1")
m = re.search(r"(\\d+) packets input", out)
print(m.group(1) if m else None)

----- output line before the upgrade -----
     5280391 packets input, 412839104 bytes, 0 no buffer
----- output line after the upgrade -----
     Packets input: 5280391, bytes: 412839104, no buffer: 0`,
    options: [
      'Rewrite the regular expression so that it matches both output formats',
      'Read the counter as structured data from a YANG model, for example in-unicast-pkts under ietf-interfaces statistics, over RESTCONF or NETCONF',
      'Increase the Netmiko read timeout so the full show output arrives',
      'Send the command with terminal length 0 first so the output is not paginated',
    ],
    answer: [1],
    explanation: 'The cause is that CLI output is text for people, with no contract: the new release reworded the line and the regex no longer matches. Retrieving the value from a YANG model gives typed, structured data whose schema is versioned, so a release that changes `show` formatting does not break the script. A wider regex only patches this one change and breaks again at the next rewording. The output arrived complete (the new line is shown), so the timeout is not the problem, and pagination does not change the wording of a line.' },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: L1,
    stem: 'A team is moving from sending CLI lines over SSH to NETCONF with YANG models. Which two capabilities do they gain? (Choose two.)',
    options: [
      'Devices no longer need any authentication because the model defines who may connect',
      'Edits are checked against the model\'s types and constraints, and a multi-part change can be applied all or nothing with the candidate datastore and commit',
      'Every feature of every platform is covered by the vendor-neutral IETF models, so native models are no longer needed',
      'Errors come back as structured rpc-error elements with a type, tag, severity and path',
      'Changes take effect faster because NETCONF bypasses the device configuration database',
    ],
    answer: [1, 3],
    explanation: 'Model-driven configuration is validated against the YANG schema, and NETCONF\'s candidate datastore plus `<commit>` makes a change transactional; failures are reported as structured `<rpc-error>` elements (`error-type`, `error-tag`, `error-severity`, `error-path`). NETCONF still runs over authenticated SSH. IETF and OpenConfig models cover common features only, so platform-specific features still need native models such as `Cisco-IOS-XE-native`. NETCONF edits the same configuration datastores; it is not a bypass.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'A monitoring team wants interface counters from 300 IOS XE routers every 10 seconds, in the same YANG structure the configuration tools use, without the collector polling each router. Which approach fits?',
    options: [
      'SNMP GET requests from the collector every 10 seconds',
      'A cron job that runs show interfaces over SSH and parses the text',
      'A configured model-driven telemetry subscription on each router that pushes the data periodically to the collector',
      'RESTCONF GET requests from the collector every 10 seconds',
    ],
    answer: [2],
    explanation: 'Model-driven telemetry streams YANG-modelled data; with a configured (dial-out) periodic subscription the router pushes updates to the collector on its own schedule (IOS XE expresses the period in centiseconds, so 1000 for 10 seconds). SNMP and RESTCONF GETs are both polling by the collector, which the requirement excludes, and SNMP data is not in the YANG structure. Parsing `show` output over SSH is polling too, and returns text, not modelled data.' },

  // ---------- 5.2 Controller versus device ----------
  { topic: '5.2', type: 'match', difficulty: 2, lesson: L2,
    stem: 'Match each task to the interface an automation engineer should use.',
    pairs: [
      ['Change the pre-shared key of one SSID across 120 cloud-managed branch networks tonight', 'Meraki Dashboard API'],
      ['Push a QoS template to every Catalyst switch in the campus site hierarchy and track the job', 'Catalyst Center Intent API'],
      ['Create EPGs and contracts for a new application in the data-centre fabric', 'APIC REST API'],
      ['Read the BGP neighbour states on one standalone ISR that no controller manages, while troubleshooting', 'RESTCONF on the router itself'],
    ],
    explanation: 'Cloud-managed Meraki networks are changed through the Dashboard API, which pushes the setting to every AP. Catalyst Center owns templates and the site hierarchy and returns tasks to track. EPGs and contracts are ACI objects created through the APIC. A standalone router with no controller is managed device by device, and RESTCONF on the router gives the full, immediate detail troubleshooting needs.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. Which characteristic of the management approach does this script illustrate?',
    exhibit: `from ncclient import manager

failed = []
for host in inventory:                       # 50 switches
    try:
        with manager.connect(host=host, port=830, username=user,
                             password=password, hostkey_verify=True,
                             timeout=30) as m:
            m.edit_config(target="running", config=VLAN30_XML)
    except Exception as exc:
        failed.append((host, str(exc)))
print(f"{len(failed)} of {len(inventory)} switches failed")`,
    options: [
      'A single source of intent: one northbound call changes all 50 switches',
      'An asynchronous task that the script must poll until it finishes',
      'Device-level management: one session and one credential check per device, with partial failure handled by the script',
      'Abstraction: the script describes a site policy and a controller computes the device configuration',
    ],
    answer: [2],
    explanation: 'The loop opens a NETCONF session to each of the 50 switches, sends the same edit to each one, and records the devices that failed, so the script itself carries the scale, the credentials and the partial-failure handling. That is device-level management. A single northbound call, an asynchronous task to poll and intent translated by a controller are controller-level traits; there is no controller in this script.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L2,
    stem: 'An engineer fixes a VLAN by typing CLI commands directly on a switch that Catalyst Center manages. The next day the change is gone or the switch is flagged as non-compliant. What is the most likely explanation?',
    options: [
      'The switch rebooted and lost its running configuration because the engineer did not save it',
      'Device-level CLI changes are always rejected by Catalyst Center-managed switches',
      'The controller cannot manage VLANs, so it reset the switch to factory defaults',
      'The controller treats its own intent as the source of truth and reapplied or flagged it, because the change was made outside the controller',
    ],
    answer: [3],
    explanation: 'A controller holds the intended configuration; a change made directly on the device is out-of-band drift, which the controller can overwrite on its next provisioning or report as a compliance violation. The fix is to make the change through the controller. A reboot would explain lost changes only if it happened and the change was unsaved, which the scenario does not say. The switch accepted the CLI change, so it is not "always rejected", and Catalyst Center does manage VLANs.' },

  // ---------- 5.3 CML and pyATS ----------
  { topic: '5.3', type: 'order', difficulty: 2, lesson: L3,
    stem: 'Put the steps of a pyATS pre- and post-change check in order.',
    items: [
      'Write a testbed YAML file describing the devices and how to connect to them',
      'Run pyats learn for the affected features and save the output as the baseline',
      'Apply the configuration change',
      'Run pyats learn for the same features again into a second directory',
      'Run pyats diff on the two directories and investigate every unexpected difference',
    ],
    explanation: 'pyATS needs a testbed before it can connect to anything. The baseline must be captured before the change, the second snapshot after it, and only then can `pyats diff` compare the two and show what changed (with `-` for old and `+` for new values).' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which workflow does the script automate?',
    exhibit: `import os
from virl2_client import ClientLibrary

client = ClientLibrary("https://cml.example.com", os.environ["CML_USER"],
                       os.environ["CML_PASSWORD"], ssl_verify="cml-ca.pem")
lab = client.create_lab("ci-pipeline-142")
r1 = lab.create_node("r1", "iosv", 100, 100)
r2 = lab.create_node("r2", "iosv", 300, 100)
lab.connect_two_nodes(r1, r2)
lab.start()
with open("testbed.yaml", "w") as f:
    f.write(lab.get_pyats_testbed())
run_tests("testbed.yaml")          # defined elsewhere
lab.stop()
lab.wipe()
lab.remove()`,
    options: [
      'It configures two production routers named r1 and r2 and saves their configuration',
      'It uploads IOSv images to the CML server so that later pipelines can use them',
      'It builds a two-node simulated lab in Cisco Modeling Labs, starts it, writes a pyATS testbed for it, runs tests and then deletes the lab',
      'It creates a lab and leaves it running so that the next pipeline run can reuse it',
    ],
    answer: [2],
    explanation: '`create_lab`, `create_node` with the `iosv` node definition and `connect_two_nodes` build a simulated topology on the CML server; `start` boots it, `get_pyats_testbed()` produces a testbed file for pyATS, and `stop`, `wipe` and `remove` delete the lab at the end. Nothing touches production devices: the nodes exist only inside CML. No image is uploaded (the node definition must already exist), and the final `remove()` rules out leaving the lab for reuse.' },
  { topic: '5.3', type: 'single', difficulty: 1, lesson: L3,
    stem: 'Refer to the exhibit. Which component produced the dictionary from the router\'s show output?',
    exhibit: `>>> parsed = rtr.parse("show ip interface brief")
>>> parsed["interface"]["GigabitEthernet2"]
{'ip_address': 'unassigned', 'interface_is_ok': 'YES', 'method': 'unset',
 'status': 'administratively down', 'protocol': 'down'}`,
    options: [
      'Cisco Modeling Labs, which returns node state as dictionaries',
      'AEtest, the pyATS test harness',
      'A Genie parser from the pyATS Library',
      'The router\'s RESTCONF server, which converts show commands to JSON',
    ],
    answer: [2],
    explanation: '`device.parse()` runs the command over the device connection and passes the text to a Genie parser for that OS, which returns a dictionary that follows the parser\'s schema (`interface` → name → `ip_address`, `status`, `protocol`, ...). CML runs simulations and does not parse show output. AEtest structures test scripts (setup, testcases, cleanup) but does not parse. RESTCONF returns YANG-modelled data, not parsed CLI output, and the keys here are the parser\'s, not a YANG model\'s.' },

  // ---------- 5.4 CI/CD for infrastructure ----------
  { topic: '5.4', type: 'order', difficulty: 2, lesson: L4,
    stem: 'An engineer opens a merge request that adds a VLAN to the branch switch templates. Put the stages of the infrastructure pipeline in the order they run.',
    items: [
      'Lint the YAML variables and playbooks and run a syntax check',
      'Render each switch configuration from the templates and variables',
      'Deploy the rendered configurations to a simulated lab and run pyATS tests',
      'A reviewer approves the merge request and it is merged',
      'Deploy to a canary site, then to the remaining sites in waves',
      'Verify the deployed state with post-change tests and roll back if they fail',
    ],
    explanation: 'Cheap static checks run first and fail fast; rendering needs valid input; the lab test needs the rendered configurations; reviewers approve with the test results in front of them; production deployment starts only after the merge, at a small canary scope; verification (and rollback on failure) closes the loop.' },
  { topic: '5.4', type: 'match', difficulty: 2, lesson: L4,
    stem: 'Match each problem with the pipeline stage that should catch it first.',
    pairs: [
      ['A playbook mixes two-space and three-space indentation in the same list', 'Lint and syntax check'],
      ['One site\'s variables file has no value for the loopback address the template needs', 'Rendering from templates'],
      ['A new route-map applies cleanly, but OSPF adjacencies drop in the simulated topology', 'Testing in simulation'],
      ['The change is correct but is scheduled for the middle of the trading day', 'Review gate'],
      ['Interface errors appear on real hardware at the canary site after rollout', 'Post-deploy verification'],
    ],
    explanation: 'Indentation is a static syntax problem for `yamllint` and `ansible-lint`. A missing variable fails when the template is rendered. A configuration that applies but breaks routing needs a running network, which is what the CML plus pyATS stage provides. Timing and business risk need human judgement in the review. Hardware-only symptoms can appear only after real deployment, so verification against the canary catches them.' },
  { topic: '5.4', type: 'single', difficulty: 3, lesson: L4,
    stem: 'Refer to the exhibit. A developer pushes a new commit to an open merge request. Which jobs run in the resulting merge request pipeline?',
    exhibit: `workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"

stages: [lint, render, test, deploy]

lint:
  stage: lint
  script: [yamllint ., ansible-lint playbooks/]

render:
  stage: render
  script: [python render.py --out build/]
  artifacts:
    paths: [build/]

lab-test:
  stage: test
  script: [pyats run job tests/job.py --testbed-file ci/testbed.yaml]
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

deploy-canary:
  stage: deploy
  script: [ansible-playbook playbooks/site.yml --limit canary]
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual`,
    options: [
      'lint, render and lab-test',
      'lint and render only',
      'lint, render, lab-test and deploy-canary, with deploy-canary waiting for a manual start',
      'lab-test only, because it is the only job with a merge_request_event rule',
    ],
    answer: [0],
    explanation: 'The `workflow` rules allow merge request pipelines, so jobs without their own `rules` (lint and render) run in them; `lab-test` matches `merge_request_event`. `deploy-canary` only matches pipelines for the `main` branch, so it is not added to a merge request pipeline at all, manual or otherwise. "lab-test only" ignores that the workflow rules let rule-less jobs run; "lint and render only" ignores lab-test\'s matching rule.' },

  // ---------- 5.5 Infrastructure as code ----------
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L5,
    stem: 'Refer to the exhibit. Both A and B were run once before, so VLAN 30 named cameras exists on sw01 and is recorded in Terraform\'s state. Both are now run again. Which statement is accurate?',
    exhibit: `----- A: add_vlan.py -----
conn.send_config_set(["vlan 30", "name cameras"])

----- B: vlans.tf -----
resource "iosxe_vlan" "cameras" {
  vlan_id = 30
  name    = "cameras"
}`,
    options: [
      'A is declarative because it names the end state; B is imperative because Terraform runs commands',
      'Both are idempotent in the same way, because the switch ignores duplicate commands',
      'B creates a second VLAN 30 because Terraform does not read the device',
      'B is declarative: Terraform compares the desired state with the device and plans no change; A is imperative and sends both commands again',
    ],
    answer: [3],
    explanation: 'The Terraform resource states what must exist; Terraform refreshes the real object, finds it already matches, and reports no changes. The Python line is a sequence of steps that is sent every time it runs, whatever the switch already has; it happens to be harmless here, but nothing in the script checked first. Terraform does read the real object during plan, and VLAN ids are unique, so there is no "second VLAN 30".' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L5,
    stem: 'Refer to the exhibit. No one has changed the Terraform files since the last apply. What does the plan indicate?',
    exhibit: `$ terraform plan
aci_tenant.web: Refreshing state... [id=uni/tn-web-prod]

Terraform will perform the following actions:

  # aci_tenant.web will be updated in-place
  ~ resource "aci_tenant" "web" {
      ~ description = "temp change for ticket 4411" -> "Managed by Terraform"
        id          = "uni/tn-web-prod"
        name        = "web-prod"
        # (4 unchanged attributes hidden)
    }

Plan: 0 to add, 1 to change, 0 to destroy.`,
    options: [
      'Someone changed the description outside Terraform (drift); applying the plan sets it back to the value in the code',
      'The tenant was deleted outside Terraform and will be recreated',
      'The code was changed to a new description that will be pushed to the APIC',
      'The state file is corrupt, so Terraform will destroy and replace the tenant',
    ],
    answer: [0],
    explanation: 'During plan Terraform refreshed the real tenant and found a description different from the configuration. Because the files did not change, the difference came from outside Terraform: configuration drift. `~` means an in-place update back to "Managed by Terraform". A deleted tenant would show `+` (create); a replacement would show `-/+` and count under add and destroy; and the code was not changed, by the stem.' },
  { topic: '5.5', type: 'multi', difficulty: 2, lesson: L5,
    stem: 'Which two statements describe principles of infrastructure as code? (Choose two.)',
    options: [
      'The running devices are the source of truth, and the code is regenerated from them every night',
      'Device passwords are committed to the repository so the pipeline can always reach the devices',
      'The intended configuration lives in version control, and changes reach devices through review and a pipeline',
      'Imperative step-by-step scripts are preferred because they show every command',
      'Applying the same definitions again when nothing has changed leaves the infrastructure unchanged',
    ],
    answer: [2, 4],
    explanation: 'IaC treats the repository as the source of truth and changes it through review and automation, and IaC tools are idempotent: re-applying unchanged definitions makes no changes. Regenerating code from devices makes the devices the truth and hides drift instead of correcting it. Secrets belong in a vault or CI variables, never in the repository. Declarative definitions are generally preferred for IaC; showing every command is not a principle.' },

  // ---------- 5.6 Ansible, Terraform, NSO ----------
  { topic: '5.6', type: 'match', difficulty: 2, lesson: L6,
    stem: 'Match each requirement with the tool that fits it best.',
    pairs: [
      ['Install packages and push syslog settings to Linux servers and IOS switches over SSH, with nothing installed on the targets', 'Ansible'],
      ['Create ACI tenants and EPGs from HCL files, review a plan, and keep a record of which objects the code owns', 'Terraform'],
      ['Provision one L3VPN across Cisco and Juniper routers as a single all-or-nothing transaction that can later be removed as a unit', 'Cisco NSO'],
      ['Start a disposable virtual topology of IOS XE nodes for pipeline tests', 'Cisco Modeling Labs'],
      ['Snapshot OSPF and interface state before and after a change and compare the two', 'pyATS'],
    ],
    explanation: 'Ansible is agentless and runs tasks over SSH for servers and network devices. Terraform declares resources in HCL, previews with `plan`, and tracks ownership in its state. NSO\'s service models, NEDs and network-wide transactions handle multivendor services and remove them cleanly. CML provides the simulated network; pyATS (`learn` and `diff`) captures and compares state.' },
  { topic: '5.6', type: 'order', difficulty: 2, lesson: L6,
    stem: 'Put the steps of a reviewed Terraform change in order.',
    items: [
      'Edit the .tf files on a branch and commit them',
      'Run terraform init to download the providers and configure the backend',
      'Run terraform plan -out=tfplan',
      'Review the saved plan in the merge request',
      'Run terraform apply tfplan',
    ],
    explanation: '`terraform init` reads the configuration to know which providers to install, so the files come first. `plan -out` saves the proposed actions without changing anything; reviewers read that plan; `apply tfplan` then performs exactly the saved plan without asking again.' },
  { topic: '5.6', type: 'fill', difficulty: 3, lesson: L6,
    stem: 'Refer to the exhibit. The summary line at the end of the plan has been removed. Enter the number Terraform reports as "to add".',
    exhibit: `Terraform will perform the following actions:

  # aci_bridge_domain.web will be updated in-place
  ~ resource "aci_bridge_domain" "web" { ... }

  # aci_application_epg.db must be replaced
-/+ resource "aci_application_epg" "db" { ... }

  # aci_tenant.lab will be destroyed
  - resource "aci_tenant" "lab" { ... }

  # aci_application_epg.api will be created
  + resource "aci_application_epg" "api" { ... }

Plan: __ to add, __ to change, __ to destroy.`,
    answer: ['2', 'two'],
    explanation: 'A replacement (`-/+`) destroys the old object and creates a new one, so it counts once under "to add" and once under "to destroy". With the one `+` create, that is **2 to add**; the `~` update is 1 to change; the `-` destroy plus the replacement make 2 to destroy: `Plan: 2 to add, 1 to change, 2 to destroy.`' },
  { topic: '5.6', type: 'single', difficulty: 2, lesson: L6,
    stem: 'Refer to the exhibit. Someone made an emergency change directly on rtr02, and the team wants to keep it. Which NSO command makes NSO\'s copy match the device without changing the device?',
    exhibit: `admin@ncs# devices check-sync
sync-result {
    device rtr01
    result in-sync
}
sync-result {
    device rtr02
    result out-of-sync
    info got: 7d1a9c0e44b3f2a8a51e6c2b90d4e117 expected: 2c4f8e19b0a7d3c65e91f0a8b7c3d412
}`,
    options: [
      'devices device rtr02 sync-to',
      'rollback-files apply-rollback-file fixed-number 10005',
      'commit dry-run outformat native',
      'devices device rtr02 sync-from',
    ],
    answer: [3],
    explanation: '`check-sync` found that rtr02\'s configuration no longer matches the copy in NSO\'s CDB. `sync-from` reads the device configuration into the CDB, accepting the out-of-band change (`compare-config` would show the difference first). `sync-to` does the opposite and pushes the CDB copy to the device, undoing the emergency change. A rollback file reverts an earlier NSO commit, not a device change, and `commit dry-run` only previews pending NSO changes.' },

  // ---------- 5.7 Python scripts using Cisco APIs ----------
  { topic: '5.7', type: 'single', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. What does the script do?',
    exhibit: `import os
import requests

APIC = "https://apic.example.com"
s = requests.Session()
s.verify = "apic-ca.pem"
s.post(f"{APIC}/api/aaaLogin.json", timeout=30, json={"aaaUser": {"attributes": {
    "name": os.environ["APIC_USER"], "pwd": os.environ["APIC_PASSWORD"]}}}).raise_for_status()

r = s.get(f"{APIC}/api/class/fvTenant.json",
          params={"query-target-filter": 'eq(fvTenant.name,"web-prod")'}, timeout=30)
r.raise_for_status()
if r.json()["totalCount"] == "0":
    body = {"fvTenant": {"attributes": {"name": "web-prod", "descr": "created by script"}}}
    s.post(f"{APIC}/api/mo/uni.json", json=body, timeout=30).raise_for_status()
    print("tenant created")
else:
    print("tenant already exists")`,
    options: [
      'It lists every tenant in the fabric and prints their names',
      'It creates the web-prod tenant only if a tenant with that name does not already exist',
      'It deletes the web-prod tenant and recreates it with a new description',
      'It creates an endpoint group named web-prod in every tenant',
    ],
    answer: [1],
    explanation: 'After `aaaLogin`, the class query on `fvTenant` is filtered to the name web-prod; only when `totalCount` is "0" does the script POST an `fvTenant` object under `uni`, otherwise it reports that the tenant exists. The filter rules out listing every tenant. There is no DELETE call, and the object posted is `fvTenant`, not an EPG (`fvAEPg`). Note the check-then-act pattern: the script is idempotent.' },
  { topic: '5.7', type: 'single', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. What does the script do?',
    exhibit: `import os
import requests

BASE = "https://api.meraki.com/api/v1"
H = {"Authorization": f"Bearer {os.environ['MERAKI_DASHBOARD_API_KEY']}"}
NET = "L_123456789012345678"

devices = requests.get(f"{BASE}/networks/{NET}/devices", headers=H, timeout=30)
devices.raise_for_status()
for dev in devices.json():
    if dev["model"].startswith("MS"):
        tags = sorted(set(dev.get("tags", [])) | {"access-layer"})
        r = requests.put(f"{BASE}/devices/{dev['serial']}", headers=H,
                         json={"tags": tags}, timeout=30)
        r.raise_for_status()
        print(dev["serial"], tags)`,
    options: [
      'It replaces the tags on every device in the organization with access-layer',
      'It removes the access-layer tag from every MS switch in the network',
      'It creates a new network for MS switches and moves them into it',
      'It adds the access-layer tag to every switch in one network, keeping the tags each switch already has',
    ],
    answer: [3],
    explanation: 'The script lists the devices of one network (`/networks/{NET}/devices`), keeps those whose model starts with "MS" (Meraki switches), and PUTs a tag list that is the union of the existing tags and "access-layer", so existing tags stay. The scope is one network, not the organization, and the `startswith("MS")` filter rules out "every device"; the union adds rather than removes or replaces; and no network is created.' },
  { topic: '5.7', type: 'fill', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. Enter the name of the key in the task object whose presence ends the polling loop.',
    exhibit: `token = requests.post(f"{CC}/dna/system/api/v1/auth/token", auth=(user, pwd),
                      verify="cc-ca.pem", timeout=30).json()["Token"]
H = {"X-Auth-Token": token, "Content-Type": "application/json"}

resp = requests.put(f"{CC}/dna/intent/api/v1/network-device/sync", headers=H,
                    json=[device_id], verify="cc-ca.pem", timeout=30)
if resp.status_code not in (200, 202):
    sys.exit(f"sync request rejected: {resp.status_code} {resp.text}")

task_id = resp.json()["response"]["taskId"]
while True:
    task = requests.get(f"{CC}/dna/intent/api/v1/task/{task_id}", headers=H,
                        verify="cc-ca.pem", timeout=30).json()["response"]
    if "endTime" in task:
        break
    time.sleep(5)
print("failed:" if task.get("isError") else "done:", task.get("progress"))`,
    answer: ['endTime'],
    explanation: 'The `while True` loop GETs `/dna/intent/api/v1/task/{taskId}` every 5 seconds and breaks only when **`endTime`** is in the task object; `isError` and `progress` are read after the loop to report the result. That is the Catalyst Center asynchronous pattern: the sync request returns a `taskId` at once, and the work finishes later. The script accepts 200 or 202 for the sync request because the Catalyst Center 3.1.6 reference documents the `taskId` reply under 200 and also lists 202 Accepted.' },
  { topic: '5.7', type: 'single', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. Which workflow does the script automate?',
    exhibit: `import os
import requests

ROUTERS = ["rtr01.example.com", "rtr02.example.com"]
AUTH = (os.environ["RTR_USER"], os.environ["RTR_PASSWORD"])
H = {"Accept": "application/yang-data+json"}

for host in ROUTERS:
    url = f"https://{host}/restconf/data/ietf-interfaces:interfaces"
    r = requests.get(url, headers=H, auth=AUTH, verify="lab-ca.pem", timeout=30)
    r.raise_for_status()
    for intf in r.json()["ietf-interfaces:interfaces"]["interface"]:
        if intf.get("enabled") and intf.get("oper-status") == "down":
            print(f"{host} {intf['name']} is enabled but down")`,
    options: [
      'It shuts down every interface whose operational status is down',
      'It reports interfaces that an administrator has shut down',
      'It reports interfaces on each router that are administratively enabled but operationally down, without changing anything',
      'It asks Catalyst Center for the interface status of every router it manages',
    ],
    answer: [2],
    explanation: 'Each router is queried directly over RESTCONF with GET only, and the `if` keeps interfaces where `enabled` is true and `oper-status` is "down": configured up but not working. There is no PATCH, PUT or DELETE, so nothing is shut down. Administratively shut interfaces have `enabled` false, which the condition excludes. The URLs go to each router\'s own `/restconf/data`, not to a controller.' },
  { topic: '5.7', type: 'match', difficulty: 2, lesson: L7,
    stem: 'Match each fragment found in a script with the Cisco API it calls.',
    pairs: [
      ['POST /api/aaaLogin.json, then reads item["fvCEp"]["attributes"]', 'ACI APIC REST API'],
      ['Authorization: Bearer with MERAKI_DASHBOARD_API_KEY, then GET /organizations/{id}/networks', 'Meraki Dashboard API'],
      ['POST /dna/system/api/v1/auth/token, then X-Auth-Token on /dna/intent/api/v1/network-device', 'Catalyst Center Intent API'],
      ['PATCH /restconf/data/ietf-interfaces:interfaces/interface=Loopback0 with Content-Type application/yang-data+json', 'RESTCONF on an IOS XE device'],
    ],
    explanation: '`aaaLogin` and the `imdata` items keyed by class name (`fvCEp`, a client endpoint) are APIC. A Bearer API key and the organization and network hierarchy are Meraki. The token from `/dna/system/api/v1/auth/token` sent as `X-Auth-Token` to `/dna/intent/` paths is Catalyst Center. `/restconf/data/<module>:<node>` with the YANG media type is RESTCONF on the device.' },
  { topic: '5.7', type: 'multi', difficulty: 3, lesson: L7,
    stem: 'Refer to the exhibit. The Catalyst Center manages 1,240 switches. Which two statements about the script are true? (Choose two.)',
    exhibit: `token = requests.post(f"{CC}/dna/system/api/v1/auth/token", auth=(user, pwd),
                      verify="cc-ca.pem", timeout=30).json()["Token"]
resp = requests.get(f"{CC}/dna/intent/api/v1/network-device",
                    headers={"X-Auth-Token": token},
                    params={"family": "Switches and Hubs", "limit": 500, "offset": 1},
                    verify="cc-ca.pem", timeout=30)
for dev in resp.json()["response"]:
    if dev["reachabilityStatus"] != "Reachable":
        print(dev["hostname"], dev["managementIpAddress"])`,
    options: [
      'It examines at most 500 of the 1,240 switches, because it requests one page and never changes offset',
      'It reboots every switch that is not reachable',
      'It sends Basic authentication on the GET request instead of a token',
      'It never checks the HTTP status of the GET, so an error reply is parsed as if it were device data',
      'It lists routers as well as switches',
    ],
    answer: [0, 3],
    explanation: 'The Intent API returns at most 500 records per page with 1-based `offset`; a single request with `offset=1` and no loop sees only the first 500. There is no `raise_for_status()` or status check, so a 401 or 500 reply goes straight to `resp.json()["response"]` and fails or misleads. The script only prints (no write call), it sends `X-Auth-Token` on the GET (Basic is only on the token request), and the `family` filter limits it to switches.' },

  // ---------- 5.8 Ansible playbooks ----------
  { topic: '5.8', type: 'single', difficulty: 2, lesson: L8,
    stem: 'Refer to the exhibit. Which statement describes what the play does on each host in ntp_servers?',
    exhibit: `- name: Time service
  hosts: ntp_servers
  become: true
  tasks:
    - name: Install chrony
      ansible.builtin.apt:
        name: chrony
        state: latest
        update_cache: true

    - name: Configure chrony
      ansible.builtin.template:
        src: templates/chrony.conf.j2
        dest: /etc/chrony/chrony.conf
        mode: "0644"
      notify: Restart chrony

    - name: Run chrony now and at boot
      ansible.builtin.service:
        name: chrony
        state: started
        enabled: true

  handlers:
    - name: Restart chrony
      ansible.builtin.service:
        name: chrony
        state: restarted`,
    options: [
      'Installs chrony only if it is missing, deploys its configuration, and restarts it on every run',
      'Installs chrony, deploys its configuration and disables the service at boot so it starts only on demand',
      'Removes chrony and replaces it with the configuration file from the template',
      'Installs or upgrades chrony to the newest available version, deploys its configuration, restarts chrony only when the configuration changed, and keeps it running and enabled at boot',
    ],
    answer: [3],
    explanation: '`state: latest` installs chrony or upgrades it whenever a newer package is available (that rules out "only if missing", which is `present`). The template task notifies the handler, so the restart runs once at the end of the play and only when the file changed, not on every run. `started` with `enabled: true` keeps it running and starts it at boot, ruling out "disables". Nothing uses `state: absent`.' },
  { topic: '5.8', type: 'fill', difficulty: 1, lesson: L8,
    stem: 'Refer to the exhibit. Enter the fully qualified name of the module that creates the service account the exporter runs as.',
    exhibit: `- name: Node exporter
  hosts: monitored
  become: true
  tasks:
    - name: Install the exporter package
      ansible.builtin.package:
        name: prometheus-node-exporter
        state: present

    - name: Service account for the exporter
      ansible.builtin.user:
        name: node_exporter
        system: true
        shell: /usr/sbin/nologin
        create_home: false

    - name: Start the exporter at boot
      ansible.builtin.systemd_service:
        name: prometheus-node-exporter
        state: started
        enabled: true`,
    answer: ['ansible.builtin.user'],
    explanation: 'The task "Service account for the exporter" uses **`ansible.builtin.user`** with `system: true` (a system account), `shell: /usr/sbin/nologin` (no interactive login) and `create_home: false`. `ansible.builtin.package` installs the software and `ansible.builtin.systemd_service` starts and enables it.' },
  { topic: '5.8', type: 'order', difficulty: 3, lesson: L8,
    stem: 'Refer to the exhibit. On the first run, the haproxy package is already installed, and both the configuration file and the certificate are new. Put the events on lb01 in the order they happen.',
    exhibit: `- name: Load balancer
  hosts: lb01
  become: true
  tasks:
    - name: Install haproxy
      ansible.builtin.apt:
        name: haproxy
        state: present
    - name: Deploy haproxy.cfg
      ansible.builtin.template:
        src: haproxy.cfg.j2
        dest: /etc/haproxy/haproxy.cfg
        validate: haproxy -c -f %s
      notify: Restart haproxy
    - name: Deploy the TLS certificate
      ansible.builtin.copy:
        src: files/site.pem
        dest: /etc/haproxy/site.pem
        mode: "0600"
      notify: Restart haproxy
    - name: Ensure haproxy is running and enabled
      ansible.builtin.service:
        name: haproxy
        state: started
        enabled: true
  handlers:
    - name: Restart haproxy
      ansible.builtin.service:
        name: haproxy
        state: restarted`,
    items: [
      'Install haproxy reports ok',
      'Deploy haproxy.cfg reports changed and notifies Restart haproxy',
      'Deploy the TLS certificate reports changed and notifies Restart haproxy',
      'Ensure haproxy is running and enabled runs',
      'The Restart haproxy handler runs once',
    ],
    explanation: 'Tasks run top to bottom. The package is already present, so the first task is `ok`. Both file tasks change and notify the same handler, but a handler runs only after all the tasks in the play and only once no matter how many tasks notified it, so haproxy restarts a single time, after the service task.' },
  { topic: '5.8', type: 'multi', difficulty: 2, lesson: L8,
    stem: 'Refer to the exhibit. The play has already run once successfully and nothing on the host has changed since. On the second run, which two tasks still report changed? (Choose two.)',
    exhibit: `  tasks:
    - name: Install git
      ansible.builtin.apt:
        name: git
        state: present
    - name: Refresh the device cache
      ansible.builtin.command: /usr/local/bin/refresh-cache.sh
    - name: Bounce the collector
      ansible.builtin.service:
        name: collector
        state: restarted
    - name: Collector account
      ansible.builtin.user:
        name: collector
        system: true
    - name: Collector settings
      ansible.builtin.template:
        src: collector.ini.j2
        dest: /etc/collector.ini`,
    options: [
      'Install git',
      'Refresh the device cache',
      'Bounce the collector',
      'Collector account',
      'Collector settings',
    ],
    answer: [1, 2],
    explanation: '`ansible.builtin.command` cannot know whether the script changed anything, so it reports changed every run unless you add `creates`, `removes` or `changed_when`. `state: restarted` always restarts the service, so it is changed every run. The package (`present`), the user and the unchanged template are already in the desired state and report ok.' },
  { topic: '5.8', type: 'single', difficulty: 2, lesson: L8,
    stem: 'Refer to the exhibit. The play runs against web01, an Ubuntu host on which apache2 and nginx are both running. What happens?',
    exhibit: `- name: Retire the old web servers
  hosts: web01
  become: true
  tasks:
    - name: Stop and disable the web services
      ansible.builtin.service:
        name: "{{ item }}"
        state: stopped
        enabled: false
      loop:
        - apache2
        - nginx
      when: ansible_facts['os_family'] == "RedHat"`,
    options: [
      'Both services are stopped and disabled at boot',
      'Only apache2 is stopped, because a loop stops after its first item',
      'Both loop items are skipped, so both services keep running',
      'The play fails because the service module cannot take a variable as the name',
    ],
    answer: [2],
    explanation: 'Facts are gathered by default, and on Ubuntu `ansible_facts[\'os_family\']` is "Debian", so the `when` condition is false for each loop item and both are reported as skipping: nothing is stopped. A loop runs the task once per item; it does not stop after the first. Module arguments can be templated, so `"{{ item }}"` is valid.' },
  { topic: '5.8', type: 'single', difficulty: 2, lesson: L8,
    stem: 'Refer to the exhibit. The inventory sets ansible_connection to ansible.netcommon.network_cli and ansible_network_os to cisco.ios.ios for the access_switches group. Which statement about the task is correct?',
    exhibit: `- name: Camera port
  hosts: access_switches
  gather_facts: false
  tasks:
    - name: Gi1/0/10 to the camera VLAN
      cisco.ios.ios_config:
        parents:
          - interface GigabitEthernet1/0/10
        lines:
          - description camera 2-01
          - switchport access vlan 30`,
    options: [
      'Ansible copies a Python module to each switch and runs it there over SSH',
      'The module runs on the control node, compares the lines with that interface section of the running configuration, and sends only the lines that are missing',
      'The module replaces the whole running configuration with the two lines',
      'The running configuration is copied to the startup configuration on every run',
    ],
    answer: [1],
    explanation: 'Network devices cannot run Ansible\'s Python modules, so network modules execute on the control node and talk to the switch through `network_cli` (CLI over SSH). `ios_config` checks the `lines` under the `parents` section and sends only what differs, which keeps it idempotent. It edits that section only, not the whole configuration. `save_when` defaults to `never`, and the task does not set it, so nothing is saved to startup.' },

  // ---------- 5.9 Bash scripts ----------
  { topic: '5.9', type: 'single', difficulty: 2, lesson: L9,
    stem: 'Refer to the exhibit. The script is run as root. What does it do?',
    exhibit: `#!/usr/bin/env bash
set -euo pipefail
# users.txt holds one user name per line
groupadd -f netops
while IFS= read -r name; do
    [[ -z "$name" ]] && continue
    if id -u "$name" >/dev/null 2>&1; then
        usermod -aG netops "$name"
    else
        useradd -m -s /bin/bash -G netops "$name"
    fi
done < users.txt
echo "netops: $(getent group netops | cut -d: -f4)"`,
    options: [
      'Deletes any account in the netops group that is not listed in users.txt',
      'Creates only the users that do not exist yet and ignores existing users',
      'Replaces the supplementary groups of every listed user with netops only',
      'Makes every listed user a member of netops: existing users are added to it while keeping their other groups, and missing users are created with a home directory, Bash as their shell and netops as a group',
    ],
    answer: [3],
    explanation: '`groupadd -f` creates netops if needed. For each non-empty line, `id -u` decides: existing users get `usermod -aG netops`, where `-a` appends so their other groups stay; new users are created by `useradd -m -s /bin/bash -G netops`. There is no `userdel`, so nobody is removed; the `usermod` branch rules out "ignores existing users"; and `-aG` (not `-G` alone) rules out replacing groups. The last line prints the group\'s members.' },
  { topic: '5.9', type: 'fill', difficulty: 2, lesson: L9,
    stem: 'Refer to the exhibit. alice runs ./check-cfg.sh sw01.cfg in a directory where sw01.cfg exists with the contents shown. Enter the exit status of the script.',
    exhibit: `----- check-cfg.sh -----
#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "usage: $0 <config-file>" >&2
    exit 64
fi
cfg="$1"
[[ -f "$cfg" ]] || { echo "missing: $cfg" >&2; exit 3; }

if ! grep -q '^hostname ' "$cfg"; then
    echo "no hostname line in $cfg" >&2
    exit 4
fi
if grep -q '^ntp server ' "$cfg"; then
    echo "$cfg looks complete"
else
    echo "$cfg has no NTP server" >&2
    exit 5
fi

----- sw01.cfg -----
hostname sw01
!
vlan 10
 name users
!
logging host 192.0.2.20`,
    answer: ['5'],
    explanation: 'One argument is given, so the usage check passes; the file exists, so exit 3 is skipped; it has a `hostname` line, so exit 4 is skipped; but no line starts with `ntp server `, so the `else` branch prints "sw01.cfg has no NTP server" to stderr and runs **`exit 5`**. Running it confirms `echo $?` prints 5. (Without an argument it exits 64; with a missing file, 3.)' },
  { topic: '5.9', type: 'single', difficulty: 2, lesson: L9,
    stem: 'Refer to the exhibit. ~/configs contains rtr01.txt, sw01.txt, sw02.cfg, sw02.bak and notes.md. What does the final command print?',
    exhibit: `#!/usr/bin/env bash
set -euo pipefail
cd "$HOME/configs"
mkdir -p backup
for f in *.txt; do
    mv -- "$f" "\${f%.txt}.cfg"
done
cp -- *.cfg backup/
rm -f -- *.bak
ls backup`,
    options: [
      'rtr01.cfg  sw01.cfg  sw02.cfg',
      'sw02.cfg',
      'rtr01.txt  sw01.txt  sw02.cfg',
      'notes.md  rtr01.cfg  sw01.cfg  sw02.bak  sw02.cfg',
    ],
    answer: [0],
    explanation: 'The loop renames each `.txt` file: `${f%.txt}` strips the suffix, so rtr01.txt and sw01.txt become rtr01.cfg and sw01.cfg. Then every `.cfg` file (those two plus sw02.cfg) is copied into backup, and sw02.bak is deleted from configs, not from backup. Running it prints `rtr01.cfg`, `sw01.cfg`, `sw02.cfg`. Only sw02.cfg would be copied if the rename came after the copy; the `.txt` names no longer exist; and notes.md and sw02.bak never match `*.cfg`.' },
  { topic: '5.9', type: 'fill', difficulty: 3, lesson: L9,
    stem: 'Refer to the exhibit. alice\'s home directory is /home/alice. Enter the path the script prints.',
    exhibit: `#!/usr/bin/env bash
set -euo pipefail
mkdir -p "$HOME/netops/sites/hq" "$HOME/netops/templates"
cd "$HOME/netops/sites/hq"
pushd ../../templates >/dev/null
cd ..
popd >/dev/null
cd ..
pwd`,
    answer: ['/home/alice/netops/sites', '/home/alice/netops/sites/'],
    explanation: '`cd` puts the script in /home/alice/netops/sites/hq. `pushd ../../templates` saves that directory on the stack and moves to /home/alice/netops/templates; `cd ..` moves to /home/alice/netops, but `popd` returns to the saved directory, /home/alice/netops/sites/hq, whatever happened in between. The final `cd ..` gives **/home/alice/netops/sites**, which is what the script printed when run.' },
  { topic: '5.9', type: 'multi', difficulty: 3, lesson: L9,
    stem: 'Refer to the exhibit. The variable SITE is not set in the environment. Which two statements about running the script are true? (Choose two.)',
    exhibit: `#!/usr/bin/env bash
set -euo pipefail
LOG="/var/log/netbackup/run.log"
echo "start"
errors=$(grep -c "ERROR" "$LOG" | tail -n 1)
echo "errors: $errors"
echo "site: $SITE"`,
    options: [
      'If run.log exists but contains no ERROR lines, the script prints errors: 0 and then site: with an empty value',
      'If run.log does not exist, the script prints start and a grep error, then exits with a non-zero status without printing the errors line',
      'pipefail has no effect here because the pipeline is inside a command substitution',
      'set -u makes the script exit as soon as it starts, before printing start, because SITE is unset',
      'If run.log contains two ERROR lines, the script prints start and errors: 2, then stops with an unbound variable error for SITE',
    ],
    answer: [1, 4],
    explanation: 'With no log, `grep` exits 2; `pipefail` makes the pipeline fail although `tail` succeeded, and `set -e` ends the script with status 2 after "start". With two matches, the assignment succeeds and "errors: 2" prints, then `$SITE` triggers `SITE: unbound variable` (status 1). With zero matches, `grep -c` prints 0 **but exits 1**, so the pipeline fails and the script exits before printing "errors: 0"; and `-u` would stop it at the SITE line anyway. `pipefail` applies inside command substitutions, as the first case shows. `-u` acts when an unset variable is expanded, not at start-up. All three cases were run to confirm the output.' },

  // ---------- 5.10 RESTCONF and NETCONF results ----------
  { topic: '5.10', type: 'single', difficulty: 2, lesson: L10,
    stem: 'Refer to the exhibit. Users on the segment behind one interface report no connectivity. Which interface should the engineer investigate first for a physical-layer or far-end problem?',
    exhibit: `GET /restconf/data/ietf-interfaces:interfaces  ->  200 OK

{
  "ietf-interfaces:interfaces": {
    "interface": [
      {"name": "GigabitEthernet1", "enabled": true,  "oper-status": "up",
       "type": "iana-if-type:ethernetCsmacd"},
      {"name": "GigabitEthernet2", "enabled": false, "oper-status": "down",
       "type": "iana-if-type:ethernetCsmacd"},
      {"name": "GigabitEthernet3", "enabled": true,  "oper-status": "down",
       "type": "iana-if-type:ethernetCsmacd"},
      {"name": "Loopback0",        "enabled": true,  "oper-status": "up",
       "type": "iana-if-type:softwareLoopback"}
    ]
  }
}`,
    options: [
      'GigabitEthernet1',
      'GigabitEthernet2',
      'GigabitEthernet3',
      'Loopback0',
    ],
    answer: [2],
    explanation: '`enabled` is configuration (administrative state) and `oper-status` is state. GigabitEthernet3 is configured up (`enabled: true`) but operationally down, which points at the cable, optic, or the device at the other end. GigabitEthernet2 is down because it is administratively disabled, a configuration choice rather than a fault. GigabitEthernet1 and Loopback0 are up.' },
  { topic: '5.10', type: 'fill', difficulty: 2, lesson: L10,
    stem: 'Refer to the exhibit. Enter the prefix length configured for the address on Loopback0.',
    exhibit: `<rpc-reply message-id="311" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <data>
    <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
      <interface>
        <name>GigabitEthernet1</name>
        <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
          <address>
            <ip>192.0.2.11</ip>
            <prefix-length>24</prefix-length>
          </address>
        </ipv4>
      </interface>
      <interface>
        <name>Loopback0</name>
        <ipv4 xmlns="urn:ietf:params:xml:ns:yang:ietf-ip">
          <address>
            <ip>10.255.0.1</ip>
            <prefix-length>32</prefix-length>
          </address>
        </ipv4>
      </interface>
    </interfaces>
  </data>
</rpc-reply>`,
    answer: ['32', '/32'],
    explanation: 'Find the `interface` entry whose key `name` is Loopback0, then follow `ipv4` (from the `ietf-ip` namespace, an augment) to its `address` entry: `ip` 10.255.0.1 with `prefix-length` **32**. The 24 belongs to GigabitEthernet1. The `<data>` element means this is the reply to a `<get>` or `<get-config>`.' },
  { topic: '5.10', type: 'single', difficulty: 2, lesson: L10,
    stem: 'Refer to the exhibit. What happened?',
    exhibit: `<rpc message-id="412" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <edit-config>
    <target><candidate/></target>
    <config>
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces"
                  xmlns:nc="urn:ietf:params:xml:ns:netconf:base:1.0">
        <interface nc:operation="delete">
          <name>Loopback99</name>
        </interface>
      </interfaces>
    </config>
  </edit-config>
</rpc>

<rpc-reply message-id="412" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <rpc-error>
    <error-type>application</error-type>
    <error-tag>data-missing</error-tag>
    <error-severity>error</error-severity>
    <error-path xmlns:if="urn:ietf:params:xml:ns:yang:ietf-interfaces">
      /if:interfaces/if:interface[if:name="Loopback99"]
    </error-path>
  </rpc-error>
</rpc-reply>`,
    options: [
      'Another session holds a lock on the candidate datastore',
      'The delete failed because Loopback99 does not exist in the candidate datastore',
      'Loopback99 was deleted, and the server returned a warning',
      'The RPC was malformed XML, so the server could not parse it',
    ],
    answer: [1],
    explanation: '`operation="delete"` requires the target data to exist; `data-missing` (error-type `application`, the content layer) at the `error-path` of Loopback99 says it does not, so the edit failed (`error-severity` is `error`, not a warning). The `remove` operation would have succeeded silently. A held lock is reported as `lock-denied` with error-type `protocol`; unparseable XML is `malformed-message` with error-type `rpc`.' },
  { topic: '5.10', type: 'single', difficulty: 2, lesson: L10,
    stem: 'Refer to the exhibit. Both messages belong to the same session on a device that supports the candidate datastore. What is the state of the running configuration after the reply?',
    exhibit: `<rpc message-id="105" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <edit-config>
    <target><candidate/></target>
    <config>
      <interfaces xmlns="urn:ietf:params:xml:ns:yang:ietf-interfaces">
        <interface>
          <name>GigabitEthernet2</name>
          <description>to sw01</description>
        </interface>
      </interfaces>
    </config>
  </edit-config>
</rpc>

<rpc-reply message-id="105" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <ok/>
</rpc-reply>`,
    options: [
      'The new description is active in running, because ok means the change was applied',
      'Running is unchanged because the edit failed and ok is only an acknowledgement of receipt',
      'The description is active in running and saved to startup',
      'Running is unchanged: the edit succeeded in the candidate datastore and takes effect only after a commit',
    ],
    answer: [3],
    explanation: '`<ok/>` with matching `message-id` 105 means the `<edit-config>` succeeded, but its target was `<candidate/>`, a scratch datastore. Nothing reaches running until a `<commit>` (and `<discard-changes>` would throw it away). The edit did not fail; a failure returns `<rpc-error>`. Startup is never written by an edit to the candidate.' },
  { topic: '5.10', type: 'multi', difficulty: 3, lesson: L10,
    stem: 'Refer to the exhibit. Which two statements about this RESTCONF reply are correct? (Choose two.)',
    exhibit: `HTTP/1.1 200 OK
Content-Type: application/yang-data+json

{
  "ietf-interfaces:interface": [
    {
      "name": "GigabitEthernet2",
      "enabled": true,
      "oper-status": "up",
      "speed": "1000000000",
      "statistics": {
        "in-octets": "48213097",
        "in-errors": 12
      },
      "ietf-ip:ipv4": {
        "address": [{"ip": "10.10.12.1", "prefix-length": 30}]
      }
    }
  ]
}`,
    options: [
      'The values are strings because they exceeded the maximum size of a JSON number',
      'ietf-interfaces is the YANG prefix of the module, so the module must be named if',
      'in-octets and speed are JSON strings because 64-bit YANG integer types are encoded as strings in JSON',
      'The ietf-ip:ipv4 member is qualified again because it is defined in a different module from its parent',
      'The reply contains configuration data only, because RESTCONF GET never returns state',
    ],
    answer: [2, 3],
    explanation: 'RFC 7951 encodes `int64`, `uint64` (and `counter64`, `gauge64` built on them) and `decimal64` as JSON strings, whatever the value, so `speed` and `in-octets` are strings while the `counter32` `in-errors` is a number. A member whose module differs from its parent\'s is namespace-qualified, which is why the augmented `ipv4` reads `ietf-ip:ipv4`. JSON qualifiers are module **names**, not prefixes. `oper-status` and `statistics` are state data, which a RESTCONF GET on `/restconf/data` returns along with configuration.' },

  // ---------- 5.11 YANG models ----------
  { topic: '5.11', type: 'fill', difficulty: 1, lesson: L11,
    stem: 'Refer to the exhibit. Enter the name of the leaf that uniquely identifies each entry in the ace list.',
    exhibit: ACL_TREE,
    answer: ['sequence'],
    explanation: 'In an RFC 8340 tree, `ace* [sequence]` means `ace` is a list (`*`) whose key is the leaf in brackets, **sequence**. The `acl` list is keyed by `name`. The key leaf shows no `?`, because every list entry must have it.' },
  { topic: '5.11', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Which statement about the model is correct?',
    exhibit: ACL_TREE,
    options: [
      'action is optional in each ace entry',
      'dst-ports is a leaf-list that can hold several port numbers in one ace entry',
      'match-count can be set in an edit-config to reset the counter',
      'Each acl entry is identified by its type',
    ],
    answer: [1],
    explanation: '`dst-ports*` has a type and no children, so `*` marks a leaf-list: several values of `inet:port-number`. `action` has no `?`, so it is mandatory, not optional. `match-count` is `ro`, state data that cannot be configured. The `acl` list key is `[name]`; `type?` is just an optional leaf.' },
  { topic: '5.11', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Which JSON instance is valid configuration data for this module?',
    exhibit: `module example-vlan {
  yang-version 1.1;
  namespace "urn:example:vlan";
  prefix vl;

  container vlans {
    list vlan {
      key "id";
      leaf id {
        type uint16 {
          range "1..4094";
        }
      }
      leaf name {
        type string;
        mandatory true;
      }
      leaf-list tagged-ports {
        type string;
      }
      leaf member-count {
        type uint32;
        config false;
      }
    }
  }
}`,
    options: [
      '{"example-vlan:vlans": {"vlan": [{"id": 30, "name": "cameras", "tagged-ports": ["Gi1/0/1", "Gi1/0/2"]}]}}',
      '{"vl:vlans": {"vlan": [{"id": 30, "name": "cameras"}]}}',
      '{"example-vlan:vlans": {"vlan": [{"id": 4095, "name": "cameras"}]}}',
      '{"example-vlan:vlans": {"vlan": [{"id": 30, "name": "cameras", "member-count": 4}]}}',
    ],
    answer: [0],
    explanation: 'The valid instance uses the module name as the top-level qualifier, gives the key `id` inside the range, includes the mandatory `name`, and encodes the leaf-list as an array. "vl" is the YANG prefix, which JSON does not use. 4095 is outside `range "1..4094"`. `member-count` is `config false`, so it cannot appear in configuration data.' },
  { topic: '5.11', type: 'multi', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Which two statements are correct? (Choose two.)',
    exhibit: `module example-acl {
  yang-version 1.1;
  namespace "urn:example:acl";
  prefix acl;

  import ietf-inet-types {
    prefix inet;
  }
  import ietf-yang-types {
    prefix yang;
  }

  revision 2026-11-22 {
    description "Initial revision.";
  }

  container acls {
    list acl {
      key "name";
      ...`,
    options: [
      'NETCONF XML for this module uses xmlns="urn:example:acl"',
      'RESTCONF URLs for this module begin /restconf/data/acl:acls',
      'The revision statement sets the YANG language version of the module',
      'The import statements copy the imported modules\' data nodes into the acls container',
      'Within this module, types from ietf-inet-types are referred to as inet:<type-name>',
    ],
    answer: [0, 4],
    explanation: 'The `namespace` is what XML uses as `xmlns`, and `import ... { prefix inet; }` lets the module refer to that module\'s typedefs as `inet:ipv4-prefix` and so on. RESTCONF and JSON use the module **name**: `/restconf/data/example-acl:acls`. `yang-version 1.1` sets the language version; `revision` dates this version of the module. `import` makes definitions available for reference; it does not add data nodes (that would be `uses` of a grouping or an `augment`).' },
  { topic: '5.11', type: 'single', difficulty: 2, lesson: L11,
    stem: 'Refer to the exhibit. Which RESTCONF URL addresses ace 20 of the ACL named EDGE-IN?',
    exhibit: ACL_TREE,
    options: [
      'https://rtr01.example.com/restconf/data/example-acl:acls/acl=EDGE-IN/ace=20',
      'https://rtr01.example.com/restconf/data/acl:acls/acl=EDGE-IN/ace=20',
      'https://rtr01.example.com/restconf/data/example-acl:acls/acl/EDGE-IN/ace/20',
      'https://rtr01.example.com/restconf/data/example-acl:acls/acl[name=EDGE-IN]/ace[sequence=20]',
    ],
    answer: [0],
    explanation: 'RESTCONF qualifies the first node with the module name (`example-acl:acls`) and addresses list entries as `list=key`, giving `acl=EDGE-IN/ace=20`. "acl:" would be the YANG prefix, which RESTCONF does not use; `/acl/EDGE-IN` treats the key value as a child node; and the bracket form is XPath syntax (as in `error-path`), not a RESTCONF resource path.' },

  // ---------- 5.12 Unified diff ----------
  { topic: '5.12', type: 'fill', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. Enter the line number of resp.raise_for_status() in the new version of inventory.py.',
    exhibit: `$ git diff
diff --git a/inventory.py b/inventory.py
index 45019f6..e1c82f6 100644
--- a/inventory.py
+++ b/inventory.py
@@ -6,9 +6,10 @@ BASE = "https://catalyst.example.com"
 def get_devices(token):
     url = f"{BASE}/dna/intent/api/v1/network-device"
     resp = requests.get(url, headers={"X-Auth-Token": token},
-                        verify=False)
+                        verify="ca.pem", timeout=30)
+    resp.raise_for_status()
     return resp.json()["response"]
${' '}
${' '}
 def hostnames(devices):
-    return [d["hostname"] for d in devices]
+    return sorted(d["hostname"] for d in devices)`,
    answer: ['10'],
    explanation: 'The hunk starts at line 6 of the new file (`+6,10`). Counting only context and `+` lines: 6 `def get_devices`, 7 `url =`, 8 `resp = requests.get(`, 9 the new `verify="ca.pem", timeout=30)` line (the `-` line is skipped), **10** `resp.raise_for_status()`.' },
  { topic: '5.12', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. Which statement describes the change?',
    exhibit: SW01_DIFF,
    options: [
      'It adds VLAN 30, moves GigabitEthernet1/0/3 from VLAN 10 to VLAN 30 with a new description, and replaces NTP server 192.0.2.10 with 192.0.2.11',
      'It adds VLAN 30 and moves GigabitEthernet1/0/2 and GigabitEthernet1/0/3 to it',
      'It removes VLAN 10, adds VLAN 30 and changes the logging host',
      'It adds a second NTP server, 192.0.2.11, while keeping 192.0.2.10',
    ],
    answer: [0],
    explanation: 'The `+` lines add `vlan 30` / `name cameras`; under `interface GigabitEthernet1/0/3` the description and `switchport access vlan 10` are each replaced (a `-` line then a `+` line); and `ntp server 192.0.2.10` is removed and 192.0.2.11 added, so it is a replacement, not an addition. GigabitEthernet1/0/2 appears only through its context line `spanning-tree portfast`; `vlan 10` is not in the diff and the logging host is a context line, so neither changes.' },
  { topic: '5.12', type: 'single', difficulty: 3, lesson: L12,
    stem: 'Refer to the exhibit. Why does the second hunk start at line 13 of the old file but line 10 of the new file?',
    exhibit: `$ diff -u old.acl new.acl
--- old.acl	2026-11-20 09:00:00.000000000 +0000
+++ new.acl	2026-11-21 10:15:00.000000000 +0000
@@ -3,9 +3,6 @@
  20 permit tcp 198.51.100.0 0.0.0.255 any eq 22
  30 permit tcp 198.51.100.0 0.0.0.255 any eq 443
  40 permit udp 198.51.100.0 0.0.0.255 any eq 161
- 50 remark --- legacy ---
- 60 permit tcp any any eq 23
- 70 permit tcp any any eq 21
  80 remark --- services ---
  90 permit tcp any host 203.0.113.10 eq 443
  100 permit tcp any host 203.0.113.11 eq 443
@@ -13,5 +10,6 @@
  120 permit tcp any host 203.0.113.53 eq 53
  130 permit udp any host 203.0.113.123 eq 123
  140 permit tcp any host 203.0.113.25 eq 25
- 150 permit tcp any host 203.0.113.80 eq 80
+ 150 permit tcp any host 203.0.113.80 eq 443
+ 155 permit tcp any host 203.0.113.81 eq 443
  160 deny ip any any log`,
    options: [
      'The first hunk removed three lines (50, 60 and 70), so every later line sits three lines higher in the new file',
      'The second hunk shows 5 old lines and 6 new lines, and 13 minus 10 is the difference between the counts',
      'The ACL sequence numbers were renumbered by 30 in the new file',
      'diff always starts the second hunk three lines earlier to provide context',
    ],
    answer: [0],
    explanation: 'Hunk 1 has 9 old lines but only 6 new ones: three `-` lines and no `+` lines. Everything after them moves up three lines, so old line 13 (`120 permit tcp ... eq 53`) is new line 10. The counts in hunk 2 (5 and 6) describe that hunk only, one more new line because 155 was added; they do not set its start. Sequence numbers are part of the text and did not change; context lines are included inside each hunk\'s own range, not by shifting its start.' },
  { topic: '5.12', type: 'multi', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. Which two statements are correct? (Choose two.)',
    exhibit: `$ git diff --staged
diff --git a/ntp.yml b/ntp.yml
new file mode 100644
index 0000000..3e05712
--- /dev/null
+++ b/ntp.yml
@@ -0,0 +1,3 @@
+ntp_servers:
+  - 192.0.2.11
+  - 192.0.2.12`,
    options: [
      'ntp.yml did not exist in the last commit and is staged as a new, three-line file',
      'The file is a regular, non-executable file',
      'ntp.yml was emptied, and its three lines were removed',
      'index 0000000 means the new file has no content yet',
      'The diff compares the working tree with the staging area',
    ],
    answer: [0, 1],
    explanation: '`new file mode`, `--- /dev/null` and `@@ -0,0 +1,3 @@` (no old lines; new lines 1 to 3) mark a creation of three lines, and `--staged` compares the staging area with the last commit. Mode `100644` is a regular file without execute permission (`100755` would be executable). The lines start with `+`, so they were added, not removed; `0000000` is the all-zero hash standing for "no old blob", and the new blob is `3e05712`. Plain `git diff` (without `--staged`) is the one that compares the working tree with the staging area.' },

  // ---------- 5.13 Code review ----------
  { topic: '5.13', type: 'single', difficulty: 2, lesson: L13,
    stem: 'Refer to the exhibit. The merge request\'s pipeline passed. What should the reviewer do?',
    exhibit: `diff --git a/backup.py b/backup.py
index f0ba7d6..8275ca9 100644
--- a/backup.py
+++ b/backup.py
@@ -1,9 +1,11 @@
 import os
 import requests
${' '}
+ROUTER_PASSWORD = "example-password-not-real"
+
${' '}
 def fetch(host):
     return requests.get(f"https://{host}/restconf/data/Cisco-IOS-XE-native:native",
-                        auth=("backup", os.environ["ROUTER_PASSWORD"]),
+                        auth=("backup", ROUTER_PASSWORD),
                         headers={"Accept": "application/yang-data+json"},
-                        verify="lab-ca.pem", timeout=30)
+                        verify=False, timeout=30)`,
    options: [
      'Approve it, because the automated checks passed',
      'Request changes: keep the password out of the code (environment variable or vault) and restore TLS certificate verification',
      'Approve it and fix the password directly on the production server later',
      'Reject the whole backup project, because scripts should not handle credentials',
    ],
    answer: [1],
    explanation: 'The diff replaces an environment variable with a credential written into the source, which would be stored in Git history, and replaces the CA bundle with `verify=False`, which disables certificate checking. Both are exactly what human review is for; passing lint and tests does not make them acceptable. Fixing it later in production bypasses review and leaves the secret in history. Rejecting the project is out of proportion: the specific, actionable comment is the right response.' },
  { topic: '5.13', type: 'multi', difficulty: 1, lesson: L13,
    stem: 'Which two are benefits of a code review process? (Choose two.)',
    options: [
      'Reviewed changes no longer need automated tests',
      'Defects are found before the change reaches production, when they are cheapest to fix',
      'Knowledge of the automation code spreads across the team instead of staying with one author',
      'Large changes can be merged faster because one approval covers everything',
      'The reviewer becomes responsible for any outage instead of the author',
    ],
    answer: [1, 2],
    explanation: 'Review catches defects early and spreads knowledge (reviewers learn the code, authors learn from feedback); it also improves consistency and security. It complements automated testing rather than replacing it. Small changes are reviewed better; large ones get skimmed. Review is about the code, not shifting blame.' },

  // ---------- 5.14 Sequence diagrams ----------
  { topic: '5.14', type: 'order', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. The first task poll returns no endTime and the second returns endTime with isError false. Put the script\'s actions in order.',
    exhibit: `legend:  ------->  synchronous request     <- - - -  reply

  [ Script ]                                   [ Catalyst Center ]
      |--- POST /dna/system/api/v1/auth/token ------->|
      |<- - - 200 {"Token": "..."} - - - - - - - - - -|
      |--- PUT /dna/intent/api/v1/network-device/sync >|
      |<- - - 202 {"response": {"taskId": "..."}} - - |
  +-- loop [task has no endTime] ---------------------+
  |   |--- GET /dna/intent/api/v1/task/{taskId} ----->|
  |   |<- - - 200 {"response": {...}} - - - - - - - - |
  |   |    wait 5 s if the reply has no endTime        |
  +----------------------------------------------------+
  +-- alt [isError is false] -------------------------+
  |   |    print "sync complete"                       |
  |-- [else] ------------------------------------------|
  |   |    print failureReason, exit 1                 |
  +----------------------------------------------------+`,
    items: [
      'POST /dna/system/api/v1/auth/token',
      'PUT /dna/intent/api/v1/network-device/sync',
      'GET /dna/intent/api/v1/task/{taskId}: no endTime yet',
      'Wait 5 seconds',
      'GET /dna/intent/api/v1/task/{taskId}: endTime present',
      'Print "sync complete"',
    ],
    explanation: 'Time flows down the diagram: token first, then the sync request, which is answered with 202 and a task id. The loop polls; the first poll finds no `endTime`, so the script waits and polls again; the second poll ends the loop. In the `alt` fragment, `isError` false selects the first operand, so the script prints "sync complete" and the `else` branch never runs.' },
  { topic: '5.14', type: 'single', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. Which statement is correct?',
    exhibit: `legend:  ------->  synchronous   ------->>  asynchronous   <- - - -  reply

 [ Meraki cloud ]            [ Webhook receiver ]             [ Webex API ]
       |--- POST /alerts --------->>|                                |
       |    {"alertType": "...", "networkId": "..."}                 |
       |<- - - 200 OK - - - - - - - |                                |
       |   +-- opt [alertType contains "went down"] -------------+   |
       |   |   |--- POST /v1/messages ------------------------------->|
       |   |   |    Authorization: Bearer <bot token>               |
       |   |   |<- - - 200 {"id": "..."} - - - - - - - - - - - - - - |
       |   +-----------------------------------------------------+   |`,
    options: [
      'The webhook receiver polls Meraki for alerts and forwards every alert to Webex',
      'Meraki pushes the alert to the receiver, and the receiver posts to Webex only for alerts whose type contains "went down"',
      'Meraki posts directly to Webex, and the receiver only logs the reply',
      'The receiver must wait for the Webex reply before it can answer Meraki',
    ],
    answer: [1],
    explanation: 'The first arrow starts at the Meraki cloud and goes to the receiver with an open (asynchronous) arrowhead: an event pushed to a webhook URL, not a poll. The `opt` fragment with its guard means the Webex message is sent only when the alert type matches. Meraki never talks to Webex. The receiver\'s 200 reply to Meraki comes before the opt fragment, so it does not wait for Webex.' },
  { topic: '5.14', type: 'fill', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. One header name has been replaced by underscores. Enter the header the client must send with call (3).',
    exhibit: `legend:  ------->  synchronous request     <- - - -  reply

   [ Client ]                                        [ Controller ]
 (1)  |--- POST /dna/system/api/v1/auth/token --------------->|
      |    Authorization: Basic <base64 of user:password>     |
 (2)  |<- - - 200 {"Token": "example-token-not-real"} - - - - |
 (3)  |--- GET /dna/intent/api/v1/network-device ------------>|
      |    ____________: example-token-not-real               |
 (4)  |<- - - 200 {"response": [ ... ], "version": "1.0"} - - |`,
    answer: ['X-Auth-Token', 'X-Auth-Token:'],
    explanation: 'The paths `/dna/system/api/v1/auth/token` and `/dna/intent/api/v1/network-device` identify Catalyst Center. Its token flow is Basic authentication to the token endpoint, which returns `Token`, then the token in the **`X-Auth-Token`** header on every Intent API call. Catalyst Center does not use `Authorization: Bearer` for this token.' },
];

export default bank.map((item, i) => ({ id: `d5-${String(i + 1).padStart(3, '0')}`, ...item }));
