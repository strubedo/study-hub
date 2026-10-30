// Domain 3 — Integration and Automation. Original questions for PAN-OS 11.2 / 12.1.
let n = 0;
const q = (topic, lesson, type, difficulty, stem, rest) => ({ id: `d3-${String(++n).padStart(3, '0')}`, topic, type, difficulty, stem, ...rest, lesson });

export default [
  // ---------------- 3.1 deployment options ----------------
  q('3.1', '3.1-cn-cloudngfw-airs', 'single', 1, 'A cloud team wants a firewall in AWS where Palo Alto Networks operates the infrastructure and PAN-OS, and where the customer manages only policy and attaches it to VPCs. Which deployment option fits?', {
    options: ['VM-Series from the AWS Marketplace', 'CN-Series on Amazon EKS', 'Cloud NGFW for AWS', 'A PA-Series appliance in a colocation facility'], answer: [2],
    explanation: 'Cloud NGFW is a managed service: the vendor runs the firewall infrastructure and software, and you manage policy through rulestacks.\n\n* VM-Series is an instance you operate and upgrade yourself.\n* CN-Series is a container firewall you deploy into Kubernetes, with Panorama.\n* A PA-Series appliance is hardware you run.' }),
  q('3.1', '3.1-pa-vm-series', 'single', 1, 'What are the factory default management address and credentials of a new PA-Series firewall?', {
    options: ['192.168.0.1/24, admin/paloalto', '192.168.1.1/24, admin/admin', '10.0.0.1/24, admin/admin', '192.168.1.254/24, root/admin'], answer: [1],
    explanation: 'A new PA-Series firewall answers on 192.168.1.1/24 on the dedicated management port with admin/admin, and forces a password change at first login. The other combinations are not PAN-OS defaults.' }),
  q('3.1', '3.1-pa-vm-series', 'single', 2, 'Refer to the exhibit. A VM-Series firewall on KVM was created with the virtual NICs below. The administrator cannot reach the web UI at the planned management address on the mgmt bridge. What is the cause?', {
    exhibit: `host$ virsh domiflist PA-Branch1
 Interface   Type     Source       Model    MAC
-----------------------------------------------------------
 vnet0       bridge   br-untrust   virtio   52:54:00:aa:10:01
 vnet1       bridge   br-trust     virtio   52:54:00:aa:10:02
 vnet2       bridge   br-mgmt      virtio   52:54:00:aa:10:03`,
    options: ['The first NIC is always the management interface, so the management address is on br-untrust and br-mgmt is ethernet1/2', 'The model virtio is not supported for the management interface', 'VM-Series management traffic must use ethernet1/1', 'The bridge br-mgmt needs a MAC address starting with 00:1b:17'], answer: [0],
    explanation: 'On a VM-Series the first virtual NIC is the management interface and the following NICs become ethernet1/1, ethernet1/2 and so on. Here the management port is attached to br-untrust and br-mgmt maps to ethernet1/2. Reorder the NICs.\n\n* virtio is the normal model.\n* Management does not use a dataplane interface.\n* MAC prefixes are irrelevant.' }),
  q('3.1', '3.1-pa-vm-series', 'single', 2, 'An engineer clones a licensed BYOL VM-Series virtual machine in vCenter, expecting the clone to be licensed too. The clone does not activate. What is the reason?', {
    options: ['The VM-Series licence is bound to the VM UUID and CPU ID, so the clone needs its own licence', 'Auth codes can be used only once per vCenter', 'Cloned firewalls need the PAYG model', 'The clone must be registered with Panorama before it can be licensed'], answer: [0],
    explanation: 'The licence is tied to the VM UUID and CPU ID, so a clone has a different identity. Deactivate or license each VM with its own auth code or Flex credits.\n\n* Auth codes are not limited per vCenter.\n* PAYG is a cloud marketplace billing model, not a cloning workaround.\n* Panorama registration does not create a licence.' }),
  q('3.1', '3.1-vm-series-bootstrap', 'multi', 2, 'Which two locations can hold a VM-Series bootstrap package in a public cloud? (Choose two.)', {
    options: ['An AWS S3 bucket', 'An Azure Files share', 'A TFTP server on the management network', 'A Git repository', 'An NFS export on the management network'], answer: [0, 1],
    explanation: 'AWS uses an S3 bucket named in the user data and Azure uses an Azure Files share (storage account, access key, share). Google Cloud uses a bucket.\n\n* TFTP, NFS and Git are not bootstrap sources.' }),
  q('3.1', '3.1-vm-series-bootstrap', 'single', 2, 'Refer to the exhibit. A VM-Series firewall fails its bootstrap during the media check. What is the cause?', {
    exhibit: `bootstrap/
  config/
    init-cfg.txt
  content/
  license/
    authcodes
  software/
  notes.txt`,
    options: ['The /plugins folder is missing, and it is required', 'notes.txt is an extra file in the bootstrap structure', 'The authcodes file must have a .key extension', 'The empty content and software folders are not allowed'], answer: [1],
    explanation: 'The bootstrap structure may not contain extra files or folders; the stray notes.txt causes a failure.\n\n* /plugins is optional.\n* The authcodes file is a text file with no extension (.key files hold licence keys).\n* /content and /software must exist but may be empty.' }),
  q('3.1', '3.1-vm-series-bootstrap', 'single', 2, 'Refer to the exhibit. The new firewall connects to Panorama but receives no template or device group configuration. What is the cause?', {
    exhibit: `# init-cfg.txt (bootstrap)
type=dhcp-client
hostname=PA-Branch1
panorama-server=203.0.113.50
tplname=Branch-Stack
dgname=Branch-DG
vm-auth-key=755036225328715

Panorama-HQ > Panorama > Templates
  Branch-Stack-01   (stack)
Panorama-HQ > Panorama > Device Groups
  Branch-DG`,
    options: ['The vm-auth-key has expired, so the registration is rejected', 'tplname does not match an existing template stack, so no template configuration applies', 'type=dhcp-client does not allow Panorama registration', 'panorama-server-2 is mandatory when dgname is used'], answer: [1],
    explanation: 'tplname must name an existing template stack (or template) on Panorama. The stack is called Branch-Stack-01, so nothing matches.\n\n* The firewall does connect, so the auth key worked.\n* DHCP management addressing is fine for registration.\n* panorama-server-2 is optional.' }),
  q('3.1', '3.1-vm-series-bootstrap', 'single', 2, 'Which Panorama command creates a time-limited key that a bootstrapped VM-Series firewall puts in init-cfg.txt to register?', {
    options: ['request bootstrap vm-auth-key generate lifetime 24', 'request license fetch auth-code', 'generate vm-auth-key lifetime 24', 'request system bootstrap key create'], answer: [0],
    explanation: '`request bootstrap vm-auth-key generate lifetime <hours>` creates the key, and `request bootstrap vm-auth-key show` lists active keys. `request license fetch auth-code` applies licences on the firewall. The other commands do not exist.' }),
  q('3.1', '3.1-vm-series-bootstrap', 'fill', 1, 'Which TCP port does a managed firewall use to connect to Panorama?', {
    answer: ['3978', 'tcp 3978', 'tcp/3978'], explanation: 'Firewalls connect to Panorama over TCP 3978 (the same port is used toward Log Collectors).' }),
  q('3.1', '3.1-pa-vm-series', 'single', 2, 'Which VM-Series licensing model needs no auth code for the base firewall licence because the cloud provider bills for it?', {
    options: ['BYOL', 'Flex credits', 'Pay-as-you-go from the cloud marketplace', 'A bootstrap licence key file'], answer: [2],
    explanation: 'PAYG images are billed through the marketplace, so no auth code is needed for the base licence. BYOL and Flex use auth codes (for Flex from a deployment profile), and a licence key file is just another form of BYOL licence.' }),
  q('3.1', '3.1-pa-vm-series', 'single', 2, 'Refer to the exhibit. A new VM-Series firewall cannot retrieve its licence. What is the most likely cause?', {
    exhibit: `admin@PA-HQ> request license fetch auth-code F1EX-EXAMPLE
Failed to fetch license. Unable to connect to the licensing server.

admin@PA-HQ> ping host updates.paloaltonetworks.com
ping: cannot resolve updates.paloaltonetworks.com: Unknown host`,
    options: ['The auth code is for CN-Series, not VM-Series', 'The management interface has no working DNS server', 'Licences can be fetched only from Panorama', 'The dataplane interface ethernet1/1 is down'], answer: [1],
    explanation: 'The firewall must reach the licensing service from its management interface, and the ping shows the name does not resolve. Fix DNS (Device > Setup > Services) or the management path.\n\n* A wrong auth code type would produce an auth code error after connecting.\n* The firewall fetches its own licence.\n* Licence retrieval uses the management plane, not ethernet1/1.' }),
  q('3.1', '3.1-cn-cloudngfw-airs', 'single', 2, 'In a CN-Series deployment, which component runs as a Kubernetes StatefulSet with a persistent volume?', {
    options: ['CN-NGFW', 'PAN-CNI', 'CN-MGMT', 'The Kubernetes plugin'], answer: [2],
    explanation: 'CN-MGMT, the management plane, is a StatefulSet. CN-NGFW (dataplane) is a DaemonSet or a Kubernetes service, PAN-CNI is a DaemonSet that plugs into the CNI chain, and the Kubernetes plugin runs on Panorama.' }),
  q('3.1', '3.1-cn-cloudngfw-airs', 'multi', 2, 'Which two items are required to manage CN-Series firewalls? (Choose two.)', {
    options: ['Panorama', 'The Kubernetes plugin on Panorama', 'A standalone web UI on each CN-MGMT pod', 'A VM-Series firewall on every node', 'Cloud NGFW rulestacks'], answer: [0, 1],
    explanation: 'Panorama is required for licence and configuration management, and its Kubernetes plugin provides cluster visibility, tags and licence token allocation.\n\n* There is no standalone management UI.\n* VM-Series is not part of CN-Series.\n* Rulestacks belong to Cloud NGFW.' }),
  q('3.1', '3.1-cn-cloudngfw-airs', 'single', 2, 'A team needs a firewall in AWS with full PAN-OS control: choosing the PAN-OS version, CLI access and custom configuration. Which option fits better than Cloud NGFW?', {
    options: ['VM-Series', 'A rulestack only', 'AI Runtime Security API Intercept', 'CN-Series without Panorama'], answer: [0],
    explanation: 'VM-Series gives you the full operating system to configure and upgrade. Cloud NGFW is managed, so there is no PAN-OS to upgrade or log into. API Intercept scans AI prompts through an API, and CN-Series needs Panorama.' }),
  q('3.1', '3.1-cn-cloudngfw-airs', 'single', 2, 'Which statement about AI Runtime Security (Prisma AIRS) Network Intercept is correct?', {
    options: ['An application calls a scanning API with an API key before sending each prompt to the model', 'A PAN-OS firewall inspects AI traffic using an AI security profile attached to a security policy rule', 'It runs only on PA-Series hardware', 'It replaces Panorama as the management platform for VM-Series'], answer: [1],
    explanation: 'Network Intercept uses a firewall in the traffic path with an AI security profile in a security rule. The API scan option describes API Intercept. It is not limited to hardware, and it does not manage firewalls.' }),
  q('3.1', '3.1-pa-vm-series', 'match', 1, 'Match each deployment option to its description.', {
    pairs: [['PA-Series', 'Hardware appliance'], ['VM-Series', 'Virtual machine on a hypervisor or cloud'], ['CN-Series', 'Containers on Kubernetes managed from Panorama'], ['Cloud NGFW', 'Managed cloud firewall service using rulestacks']],
    explanation: 'PA-Series is hardware, VM-Series is the virtual firewall, CN-Series is the container firewall that requires Panorama, and Cloud NGFW is the managed service with rulestacks.' }),

  // ---------------- 3.2 APIs ----------------
  q('3.2', '3.2-xml-rest-api', 'single', 2, 'A script creates address objects through the REST API and every call returns success, but the firewall still enforces the old configuration. What is missing?', {
    options: ['A second REST call with the PUT method', 'A commit, performed with the XML API (type=commit)', 'Restarting the management server', 'Regenerating the API key'], answer: [1],
    explanation: 'The REST API changes the candidate configuration only, and it has no commit. Commit with the XML API (`type=commit`) and poll the job.\n\n* PUT replaces an object, it does not commit.\n* There is no need to restart anything.\n* A key problem would give an authorization error.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 2, 'Refer to the exhibit. What is the security problem with this key generation request, and what is the better practice?', {
    exhibit: `$ curl -k 'https://PA-HQ/api/?type=keygen&user=apiadmin&password=S3cret!'`,
    options: ['The password is in the URL and can be logged; use a POST request with the credentials in the body', 'type=keygen is allowed only for superusers; use type=config', 'The key never expires; PAN-OS cannot limit key lifetime', 'The -k option encrypts the password; remove it'], answer: [0],
    explanation: 'A GET puts the password in the URL, where web and proxy logs and shell history keep it. Use POST, a dedicated least-privilege account, and an API Key Lifetime.\n\n* Any administrator whose role enables the API can generate a key.\n* PAN-OS has an API Key Lifetime setting.\n* -k skips certificate validation; it does not encrypt anything and is itself a risk.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 2, 'Refer to the exhibit. A script has worked for weeks with a stored key. Yesterday the administrator apiadmin changed the account password, and now every call fails. What should the engineer do?', {
    exhibit: `$ curl -k -H 'X-PAN-KEY: LUFRPT14MW5xOEo1R09KVlBZ...' 'https://PA-HQ/api/?type=op&cmd=<show><system><info></info></system></show>'
<response status="error" code="403">...</response>`,
    options: ['Add the REST API role to apiadmin', 'Generate a new key with type=keygen and update the script', 'Disable API Key Lifetime', 'Switch the request to the REST API'], answer: [1],
    explanation: 'An API key is tied to the administrator credentials; changing the password invalidates it. Generate a new key and update the secret store.\n\n* The role was not changed, and the error is about the credential, not authorization of a feature.\n* Lifetime settings do not explain the failure after a password change.\n* The REST API uses the same key.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 2, 'Which XML API config action returns the running (active) configuration rather than the candidate configuration?', {
    options: ['get', 'show', 'edit', 'export'], answer: [1],
    explanation: '`action=show` returns the running configuration and `action=get` returns the candidate configuration. `edit` modifies, and `export` is a different request type.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 3, 'An engineer must replace the whole definition of the existing address object web1 through the XML API config type. Which request is correct?', {
    options: ['action=edit with an xpath that ends at .../address/entry[@name=\'web1\'] and the full entry as the element', 'action=set with an xpath that ends at .../address/entry[@name=\'web1\'] and the full entry as the element', 'action=get with the new entry as the element', 'action=override with an xpath that ends at .../address'], answer: [0],
    explanation: '`edit` replaces the node at the xpath, so the xpath points at the entry itself. `set` merges an element into the node named by the xpath (the parent, .../address, for a new entry). `get` only reads. `override` is used for template override entries.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 2, 'A commit request returns "Commit job enqueued with jobid 17". Which request checks the result?', {
    options: ['type=op with cmd=<show><jobs><id>17</id></jobs></show>', 'type=commit with action=status&job=17', 'type=config with action=get&xpath=/jobs/17', 'type=keygen with job=17'], answer: [0],
    explanation: 'A commit is a job, and `show jobs id <n>` through type=op returns its status (FIN) and result (OK or FAIL). The other requests are not valid for job status.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 2, 'Refer to the exhibit. Which XML API request runs the same operational command?', {
    exhibit: `admin@PA-HQ> debug cli on
admin@PA-HQ> show interface ethernet1/1
<request cmd="op" cookie="..."><operations><show><interface>ethernet1/1</interface></show></operations></request>`,
    options: ['type=op&cmd=<show><interface>ethernet1/1</interface></show>', 'type=config&action=show&xpath=/show/interface/ethernet1/1', 'type=report&cmd=<show><interface>ethernet1/1</interface></show>', 'type=op&cmd=show interface ethernet1/1'], answer: [0],
    explanation: '`debug cli on` prints the XML for any CLI command. Operational commands use type=op with the XML between `<operations>` tags as the cmd value.\n\n* type=config reads configuration, not operational state.\n* type=report runs reports.\n* The cmd parameter must be XML, not the CLI text.' }),
  q('3.2', '3.2-xml-rest-api', 'multi', 2, 'Which two statements about the PAN-OS REST API are correct? (Choose two.)', {
    options: ['It supports create, read, update and delete operations for objects and policies', 'Its changes go to the candidate configuration and need a commit through the XML API', 'It commits automatically after each POST', 'It is served from the /api/ path', 'It does not require authentication'], answer: [0, 1],
    explanation: 'The REST API is CRUD over /restapi/<version>/ and works on the candidate configuration. It has no commit of its own.\n\n* It does not commit automatically.\n* /api/ is the XML API entry point.\n* It needs an API key.' }),
  q('3.2', '3.2-xml-rest-api', 'single', 3, 'A script commits on Panorama with type=commit&cmd=<commit></commit> after editing the device group Branch-DG, but the firewalls do not receive the new rules. What is next?', {
    options: ['Repeat the commit with action=partial', 'Issue a push with type=commit&action=all and a commit-all command that names the device group', 'Reboot the firewalls', 'Use the REST API to copy the rules to each firewall'], answer: [1],
    explanation: 'On Panorama, committing applies the change to Panorama only. To push it, use `type=commit&action=all` with `<commit-all><shared-policy>…</shared-policy></commit-all>` naming the device group (the equivalent of Push to Devices).\n\n* A partial commit still only affects Panorama.\n* A reboot does not fetch policy.\n* Rules from a device group are not copied manually.' }),
  q('3.2', '3.2-xml-rest-api', 'fill', 1, 'Which value of the XML API type parameter returns an API key?', {
    answer: ['keygen', 'type=keygen'], explanation: 'A call with `type=keygen` and the administrator credentials returns the key. Use POST so the password is not in the URL.' }),
  q('3.2', '3.2-xml-rest-api', 'order', 2, 'Order the steps for adding an address object to a firewall and activating it through the APIs.', {
    items: ['Generate an API key with type=keygen', 'Create the address object (REST POST or type=config action=set)', 'Send type=commit and note the job id', 'Poll the job with show jobs until the result is OK'],
    explanation: 'You need the key first, the change goes to the candidate configuration, a commit makes it active, and the commit job is verified last.' }),

  // ---------------- 3.3 third-party ----------------
  q('3.3', '3.3-third-party-deploy', 'single', 2, 'Using the panos Terraform provider 2.x, how does a resource state where on the firewall or Panorama the object is created?', {
    options: ['With a location block, for example a vsys, shared, or a device group', 'With an xpath string', 'With the provider alias only', 'By the order of resources in the file'], answer: [0],
    explanation: '2.x resources take a `location` that names the vsys, shared scope, device group, template, and so on. Xpath strings are an XML API concept, and ordering in the file does not set location.' }),
  q('3.3', '3.3-third-party-deploy', 'single', 3, 'Refer to the exhibit. Someone created the rule temp-allow-ssh in the GUI. Why does Terraform plan to delete it?', {
    exhibit: `  # panos_security_policy.branch will be updated in-place
  ~ resource "panos_security_policy" "branch" {
      ~ rules = [
          - {
              - name = "temp-allow-ssh"
              - action = "allow"
            },
            { name = "allow-web" ... },
        ]
    }
Plan: 0 to add, 1 to change, 0 to destroy.`,
    options: ['The rule uses ssh, which is blocked by the provider', 'panos_security_policy manages the entire rulebase at its location, so unmanaged rules are removed', 'Terraform removes any rule created in the last 24 hours', 'The rule has no description'], answer: [1],
    explanation: '`panos_security_policy` owns the whole rulebase at its location, so rules outside its list are drift and are removed. To manage only some rules, use `panos_security_policy_rules`. The other reasons do not exist.' }),
  q('3.3', '3.3-third-party-deploy', 'single', 2, 'A Terraform apply for panos resources finishes successfully, yet the firewall enforces the old policy. What explains this?', {
    options: ['The changes are in the candidate configuration and still need a commit, for example with the provider commit action', 'Terraform always waits 24 hours before pushing', 'The state file is stored in the wrong directory', 'The API key is read-only'], answer: [0],
    explanation: 'The provider changes the candidate configuration. A commit is a separate step (the 2.x provider offers a panos_commit action, or use Ansible or the XML API). A read-only key would make the apply fail.' }),
  q('3.3', '3.3-third-party-deploy', 'single', 2, 'A playbook using the paloaltonetworks.panos collection fails on the control node with an import error for the PAN-OS Python library. What fixes it?', {
    options: ['Install pan-os-python (and its dependencies) with pip on the control node', 'Enable the REST API on the firewall', 'Install the Terraform provider', 'Run the playbook as root on the firewall'], answer: [0],
    explanation: 'The collection modules call the pan-os-python library, which must be installed where Ansible runs (the control node for connection: local). The firewall-side API setting and Terraform are unrelated.' }),
  q('3.3', '3.3-third-party-deploy', 'single', 2, 'Workloads in a cloud auto-scaling group come and go. Policy must follow them without editing rules. What should the engineer use?', {
    options: ['A static address object per instance', 'Tags from the Panorama cloud or Kubernetes plugin feeding dynamic address groups', 'A scheduled script that rewrites the rulebase hourly', 'A security rule that allows the whole subnet'], answer: [1],
    explanation: 'The cloud and Kubernetes plugins turn instance and label metadata into tags used by dynamic address groups, so membership follows the workloads. Static objects and scripts need constant maintenance, and a subnet allow rule loses granularity.' }),
  q('3.3', '3.3-third-party-deploy', 'multi', 3, 'Which two tasks suit Ansible better than Terraform? (Choose two.)', {
    options: ['Upgrading PAN-OS on a list of firewalls and waiting for each reboot before continuing', 'Running operational commands and acting on their output in order', 'Tracking the lifecycle of cloud VPCs and subnets in a state file', 'Detecting configuration drift against a declared desired state', 'Destroying an entire test environment with one command'], answer: [0, 1],
    explanation: 'Ansible is procedural, so ordered steps such as upgrades with waits and operational commands with conditions fit it. Terraform fits state tracking, drift detection and building or destroying infrastructure.' }),
  q('3.3', '3.3-third-party-deploy', 'single', 2, 'CN-NGFW pods are running on every node, but traffic from the pods in one namespace is not being inspected. Which cause is most likely?', {
    options: ['The pods are not annotated for PAN-CNI redirection, so their traffic bypasses the CN-NGFW', 'CN-MGMT is a StatefulSet', 'Helm 3.6 is installed', 'The CN-NGFW DaemonSet has too few pods'], answer: [0],
    explanation: 'PAN-CNI reads annotations on application pods (or namespaces) to decide whether to redirect traffic to the CN-NGFW. Without them the pods are not inspected. The other options are normal design details.' }),
  q('3.3', '3.3-third-party-deploy', 'single', 2, 'Refer to the exhibit. What is the main problem with this playbook, and what is the correct fix?', {
    exhibit: `- hosts: firewalls
  connection: local
  tasks:
    - paloaltonetworks.panos.panos_address_object:
        provider:
          ip_address: "{{ inventory_hostname }}"
          username: "apiadmin"
          password: "S3cret!"
        name: web1
        value: 10.0.1.10/32`,
    options: ['The password is in plain text in the playbook; store credentials in Ansible Vault or use a vaulted API key', 'The module name is wrong; it must be panos_address', 'connection: local must be removed', 'The value must be written with a netmask such as 255.255.255.255'], answer: [0],
    explanation: 'Hard-coded credentials leak through version control. Use Ansible Vault or another secret store. `panos_address_object` is a valid module, connection: local is the normal pattern for API modules, and ip-netmask values may be written as a /32 prefix.' }),

  // ---------------- 3.4 Panorama ----------------
  q('3.4', '3.4-panorama-templates', 'single', 1, 'Where does an administrator configure the interfaces and zones that fifty branch firewalls will share, using Panorama?', {
    options: ['In a device group', 'In a template or template stack', 'In the Shared location', 'In a log collector group'], answer: [1],
    explanation: 'Network and Device settings (interfaces, zones, routing, server profiles) live in templates and template stacks. Device groups hold policy and objects.' }),
  q('3.4', '3.4-panorama-templates', 'single', 2, 'Refer to the exhibit. Which NTP primary server does PA-Branch1 receive after the push?', {
    exhibit: `Panorama > Templates > Branch-Stack (firewalls: PA-Branch1)
Template order in the stack:
  1  Site-Overrides    NTP primary = 198.51.100.123
  2  Global-Base       NTP primary = 203.0.113.123
Stack-level setting:   (not configured)`,
    options: ['198.51.100.123', '203.0.113.123', 'Both, as primary and secondary', 'None; the push fails because of the conflict'], answer: [0],
    explanation: 'When templates in a stack set the same value, the template higher in the list takes precedence. There is no conflict error, and a value is not split into primary and secondary.' }),
  q('3.4', '3.4-device-groups-rules-push', 'single', 2, 'Refer to the exhibit. SSH from 10.1.1.5 in the trust zone to a server in dmz arrives at PA-Branch1. What happens to it?', {
    exhibit: `Shared pre-rules:
  1  block-tor         any -> any   app tor             deny
Branch-DG pre-rules:
  1  allow-ssh-admins  10.1.1.0/24 trust -> dmz   app ssh   allow
Local rules on PA-Branch1:
  1  deny-ssh          trust -> dmz   app ssh             deny
Branch-DG post-rules:
  1  cleanup           any -> any                         deny`,
    options: ['It is denied by the local rule deny-ssh', 'It is allowed by the pre-rule allow-ssh-admins', 'It is denied by the post-rule cleanup', 'It is allowed because local rules take precedence over Panorama rules'], answer: [1],
    explanation: 'Pre-rules are evaluated before local rules. The shared pre-rule does not match, then allow-ssh-admins matches and allows the session. The local deny and the cleanup rule are never reached.' }),
  q('3.4', '3.4-device-groups-rules-push', 'single', 2, 'An administrator edits a rule in the device group Branch-DG and clicks Commit > Commit to Panorama. The firewalls still enforce the old rule. Why?', {
    options: ['Commit to Panorama applies the change on Panorama only; Push to Devices is needed', 'Firewalls pull Panorama policy only once a day', 'Device group rules need a local commit on each firewall first', 'The rule was saved in the template instead'], answer: [0],
    explanation: 'Commit to Panorama updates Panorama\'s running configuration. Push to Devices (or Commit and Push) sends it to the firewalls. Firewalls do not pull on a timer, and no per-firewall pre-commit is needed.' }),
  q('3.4', '3.4-panorama-templates', 'single', 2, 'What does the Force Template Values option do when pushing a template stack?', {
    options: ['It overwrites local overrides on the firewall with the template values', 'It forces a reboot of each firewall', 'It pushes uncommitted Panorama changes', 'It merges the firewall\'s local settings into the template'], answer: [0],
    explanation: 'Force Template Values makes the pushed template values win over values administrators overrode locally. It does not reboot, it cannot push uncommitted changes (Push uses Panorama\'s running configuration), and nothing flows from firewall to template.' }),
  q('3.4', '3.4-device-groups-rules-push', 'single', 3, 'Refer to the exhibit. Which statement is correct?', {
    exhibit: `Panorama-HQ > Panorama > Managed Devices > Summary
Device Name   Connected   Shared Policy   Template
PA-Branch1    yes         In Sync         In Sync
PA-Branch2    yes         Out of Sync     Out of Sync
PA-Branch3    no          Out of Sync     Out of Sync`,
    options: ['A push to PA-Branch1 is needed to bring it in sync', 'A push can bring PA-Branch2 in sync, but PA-Branch3 must first reconnect to Panorama', 'Pushing to all three will configure PA-Branch3 as soon as it reconnects', 'PA-Branch2 must be removed from its device group before it can sync'], answer: [1],
    explanation: 'PA-Branch2 is connected but out of sync, so a push fixes it. PA-Branch3 is disconnected (check TCP 3978, routing and certificates), so a push cannot reach it. PA-Branch1 is already in sync, and a push is not queued for disconnected devices.' }),
  q('3.4', '3.4-device-groups-rules-push', 'multi', 2, 'Which two statements about device group hierarchy are correct? (Choose two.)', {
    options: ['A child device group inherits objects and rules from its ancestors', 'An object in a child group with the same name as an inherited object overrides it for that group', 'A parent device group inherits objects from its children', 'A firewall can belong to several device groups at the same time', 'A Shared rule can reference an object defined only in a child group'], answer: [0, 1],
    explanation: 'Inheritance runs from Shared down through ancestors to children, and a same-name object in a descendant overrides the inherited one.\n\n* Nothing is inherited upward.\n* A firewall (or vsys) is in one device group.\n* A rule can reference only objects visible from its own level.' }),
  q('3.4', '3.4-device-groups-rules-push', 'single', 2, 'The security team wants a log-and-deny cleanup rule on all firewalls that is evaluated after any local rules a site adds. Where should it be placed?', {
    options: ['A Shared pre-rule', 'A Shared post-rule', 'A local rule created on each firewall', 'The interzone-default rule on each firewall'], answer: [1],
    explanation: 'Post-rules are evaluated after local rules, and in Shared they apply to every firewall. A pre-rule would be evaluated first, local rules are per-firewall and not centrally enforced, and the built-in default rules are not where you centrally maintain a custom cleanup rule.' }),
  q('3.4', '3.4-panorama-templates', 'single', 2, 'Fifty branches differ only in WAN interface address and HA device priority. How should the engineer avoid fifty templates?', {
    options: ['Use template variables with per-firewall values', 'Use one device group per branch', 'Use Force Template Values at every push', 'Configure the branches locally and import them'], answer: [0],
    explanation: 'Variables (such as $wan-ip as IP Netmask and a Device Priority variable) hold per-firewall values while the template stays common. Device groups do not carry interface settings, Force Template Values is not a source of values, and local configuration defeats central management.' }),
  q('3.4', '3.4-device-groups-rules-push', 'order', 2, 'Order the policy evaluation for a firewall managed by Panorama, from first to last.', {
    items: ['Shared pre-rules', 'Parent device group pre-rules', 'Child device group pre-rules', 'Local firewall rules', 'Child device group post-rules', 'Shared post-rules', 'Default rules (intrazone-default, interzone-default)'],
    explanation: 'Pre-rules come first, from Shared down through ancestors to the child; then local rules; then post-rules back out toward Shared; and finally the default rules.' }),
  q('3.4', '3.4-panorama-templates', 'single', 2, 'Which Panorama mode manages firewall configuration but does not collect logs?', {
    options: ['Panorama mode', 'Management Only mode', 'Log Collector mode', 'Legacy mode'], answer: [1],
    explanation: 'Management Only manages configuration without log collection. Log Collector mode is the reverse. Panorama mode does both, and Legacy mode (virtual appliance) stores logs locally too.' }),

  // ---------------- 3.5 ACC and reports ----------------
  q('3.5', '3.5-acc-custom-reports', 'single', 2, 'Refer to the exhibit. What is the scope of these two global filters?', {
    exhibit: `ACC > Network Activity    Time: Last 24 Hrs    Data Source: Panorama
Global Filters:  user = alice     application = ssl`,
    options: ['They narrow the widgets on every ACC tab to traffic from alice using ssl', 'They narrow only the Network Activity tab', 'They narrow only the widget the filter was created from', 'They are saved into every custom report'], answer: [0],
    explanation: 'A global filter is applied across all tabs and widgets of the ACC, so the display pivots around that user and application. A filter limited to one widget is a widget (local) filter, which persists across reboots only if you use Set Local Filter. Global filters are not persistent, and neither type is saved into reports.' }),
  q('3.5', '3.5-acc-custom-reports', 'single', 2, 'Refer to the exhibit. An auditor wants the source port and session ID for each session in this report. What must change?', {
    exhibit: `Monitor > Manage Custom Reports > top-talkers-weekly
Database:        Traffic Summary
Time Frame:      Last 7 Days        Scheduled: Yes
Selected Columns: Source User, Application, Bytes
Group By:        Source User        Sort By: Bytes (Top 25)`,
    options: ['Add the columns to this report; Traffic Summary supports every traffic log field', 'Use the Traffic detailed log database, which has per-session fields', 'Increase the time frame to 30 days', 'Disable Scheduled so the report runs on demand'], answer: [1],
    explanation: 'Summary databases are aggregated, so per-session fields such as source port and session ID are not available. Use a detailed log database such as Traffic. A longer time frame or on-demand running does not add fields.' }),
  q('3.5', '3.5-acc-custom-reports', 'single', 2, 'A manager wants the "top applications by bytes" report emailed as a PDF every Monday. Which configuration achieves this?', {
    options: ['Add the report to a report group and attach the group to an email scheduler', 'Pin the ACC widget to the dashboard', 'Create a log forwarding profile that sends traffic logs by email', 'Create an SNMP trap profile'], answer: [0],
    explanation: 'Report groups (Monitor > PDF Reports > Report Groups) bundle reports into a PDF, and the email scheduler sends the group on a schedule using an email server profile. Dashboards are interactive only, and log forwarding or SNMP send individual events.' }),
  q('3.5', '3.5-acc-custom-reports', 'multi', 1, 'Which two are ACC tabs on PAN-OS? (Choose two.)', {
    options: ['Network Activity', 'Blocked Activity', 'Policy Hit Activity', 'Log Collector Activity', 'Config Activity'], answer: [0, 1],
    explanation: 'ACC includes Network Activity, Threat Activity, Blocked Activity and Tunnel Activity (with GlobalProtect and SSL tabs in newer releases). The other names are not ACC tabs.' }),
  q('3.5', '3.5-acc-custom-reports', 'single', 2, 'The ACC on Panorama is empty for a branch, although the firewall\'s own ACC shows traffic. The firewall is not forwarding logs to Panorama yet. How can the administrator view the branch data from Panorama in the meantime?', {
    options: ['Change the ACC data source from Panorama to the remote device (firewall) data', 'Lock the global filter', 'Create a custom tab with the same widgets', 'Raise the time range to 30 days'], answer: [0],
    explanation: 'Panorama\'s ACC can use its own collected data or query the firewall directly. When the firewall forwards no logs, Panorama\'s own data is empty; switching to the remote device source retrieves the firewall\'s data. Filters, tabs and time range cannot create data that was never received.' }),
  q('3.5', '3.5-acc-custom-reports', 'single', 2, 'A report must show application usage over the last 30 days quickly, and per-session detail is not needed. Which database should the custom report use?', {
    options: ['The Traffic detailed log database', 'A summary database such as Application Statistics', 'The Unified log database', 'The Decryption log database'], answer: [1],
    explanation: 'Summary databases hold aggregated data and are efficient over long periods. Detailed log databases are slower over large ranges and are chosen when per-session fields are required.' }),
];
