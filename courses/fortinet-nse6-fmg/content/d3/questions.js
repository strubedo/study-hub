// Domain 3 — Policy and objects question bank (original, exam-style).
// FortiManager 7.6 behaviour, checked against the FortiManager 7.6.x Administration Guide and CLI Reference.
export default [
  {
    id: 'd3-001',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The Branch-PP policy package is installed to both of its installation targets. Which policies does FGT-Branch2 receive?',
    exhibit: String.raw`Policy & Objects > Policy Packages > Branch-PP
Installation Targets: FGT-Branch1 [root], FGT-Branch2 [root]

Seq  Name             From    To     Install On
1    Guest-WiFi-Out   guest   wan1   FGT-Branch1 [root]
2    LAN-Out          lan     wan1   Installation Targets
3    Mgmt-In          wan1    lan    Installation Targets`,
    options: [
      'Policies 2 and 3 only',
      'Policies 1, 2 and 3, because Install On only affects the order of installation',
      'Policy 1 only, because a policy with an explicit Install On value overrides the package targets',
      'No policies, because a package with any restricted policy must be installed with Install Device Settings (only)',
    ],
    answer: [0],
    explanation: 'The Install On column narrows a single policy to the listed targets. **Installation Targets** (the default) means every target of the package, so policies 2 and 3 go to both devices, while policy 1 goes only to FGT-Branch1. Install On has nothing to do with install order, it does not cancel the other policies, and restricted policies install normally with the Install Wizard.',
    lesson: '3.1-policy-packages-targets',
  },
  {
    id: 'd3-002',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator changes the subnet of Web-Srv from 10.1.20.10/32 to 10.1.20.11/32 and saves. What is the result?',
    exhibit: String.raw`Policy & Objects > Firewall Objects > Addresses > Web-Srv > Where Used (ADOM: Retail)

Policy Package   Policy Type       Policy ID   Field
Branch-PP        Firewall Policy   4           dstaddr
DC-PP            Firewall Policy   11          dstaddr
DC-PP            Firewall Policy   12          srcaddr

Branch-PP installation targets: FGT-Branch1, FGT-Branch2
DC-PP installation targets:     FGT-HQ-DC`,
    options: [
      'The targets of both Branch-PP and DC-PP show the policy package status Modified, and each package must be installed to push the new subnet',
      'Only Branch-PP becomes Modified, because it is listed first in Where Used',
      'FortiManager installs the new subnet to FGT-Branch1, FGT-Branch2 and FGT-HQ-DC automatically',
      'FortiManager creates a copy of Web-Srv inside each package so that the packages stay independent',
    ],
    answer: [0],
    explanation: 'Objects are **ADOM-level** and shared by every package that references them, so both Branch-PP and DC-PP are affected and their targets show **Modified** (changed on FortiManager, not yet installed). Nothing reaches the FortiGates until each package is installed; auto-push only concerns devices that come back online. FortiManager never copies objects into packages.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-003',
    topic: '3.1',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator wants to create ADOM-level metadata variables, but Policy & Objects > Advanced does not list Metadata Variables. What should the administrator do?',
    options: [
      'Enable Metadata Variables in Policy & Objects > Tools > Feature Visibility',
      'Upgrade the ADOM, because metadata variables are only available in the newest ADOM version',
      'Create the variables under System Settings > Advanced > Meta Fields instead',
      'Enable workspace mode, because metadata variables require an ADOM lock to be displayed',
    ],
    answer: [0],
    explanation: 'Many policy types and object categories are hidden by default. Metadata variables must be made visible in **Tools > Feature Visibility** before they can be configured. Meta Fields are a different feature (extra attributes, not variables). Neither an ADOM upgrade nor workspace mode controls whether the menu is shown.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-004',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: 'By default Policy & Objects feature visibility is shared by every administrator in an ADOM. Complete the command that makes it individual for each administrator: `config system global` / `set gui-feature-visibility-mode ________` / `end`',
    answer: ['per-admin'],
    explanation: '`gui-feature-visibility-mode` accepts `per-adom` (the default behaviour: all administrators in the ADOM share the settings) or `per-admin`. The mode also applies to Feature Visibility for provisioning templates.',
    lesson: '3.1-policy-packages-targets',
  },
  {
    id: 'd3-005',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about the FortiManager policy consistency check are true? (Choose two.)',
    options: [
      'It checks all policy packages in the ADOM for object duplication, shadowing, overlap and orphaning',
      'When enabled to run before every install, it checks only policies that were added or modified',
      'It automatically merges duplicate objects that it finds',
      'It runs on the FortiGate and uses the FortiGate session table to find unused policies',
      'It is only available when the ADOM is in workflow mode',
    ],
    answer: [0, 1],
    explanation: 'The policy check examines all packages in the ADOM and reports duplication, shadowing, overlap and orphaning, based on interfaces, addresses, services and schedules. The automatic check during install (ADOM setting **Perform Policy Check Before Every Install**) examines only added or modified policies to limit the performance impact. The check only reports; merging is done with Find Duplicate Objects. It runs on FortiManager, not on the FortiGate, and it does not need workflow mode.',
    lesson: '3.1-policy-packages-targets',
  },
  {
    id: 'd3-006',
    topic: '3.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each policy consistency check finding to its meaning.',
    pairs: [
      ['Duplication', 'Two objects have identical definitions'],
      ['Shadowing', 'A higher-priority object completely encompasses another object of the same type'],
      ['Overlap', 'One object partially covers another object of the same type'],
      ['Orphaning', 'An object is defined but not used anywhere'],
    ],
    explanation: 'These are the four results of the policy consistency check. Shadowing is complete coverage (the lower object can never match on its own); overlap is partial coverage. Orphaned objects are what Find Unused Objects also lists; duplicates are what Find Duplicate Objects can merge.',
    lesson: '3.1-policy-packages-targets',
  },
  {
    id: 'd3-007',
    topic: '3.1',
    type: 'order',
    difficulty: 2,
    stem: 'Put the FortiManager provisioning workflow for a new branch FortiGate in order.',
    items: [
      'Add the device in Device Manager',
      'Optionally assign a system template to the device',
      'Configure the dynamic object mappings the device needs in Policy & Objects',
      'Decide whether the device gets its own policy package or joins an existing one',
      'Add the device to the package installation targets and run the Install Wizard',
    ],
    explanation: 'Fortinet describes provisioning as: add the device or VDOM, optionally assign a system template, configure the dynamic objects for it, decide on a new or existing package, then install (adding the device to an existing package\'s installation targets if it shares one). Dynamic mappings must exist before the install, or validation fails for the device.',
    lesson: '3.1-policy-packages-targets',
  },
  {
    id: 'd3-008',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'A retail chain manages 40 FortiGate branches and two FortiWiFi branches with one policy package. A policy that allows the guest SSID to the internet must exist only on the FortiWiFi units. What is the simplest way to achieve this?',
    options: [
      'Clone the package for the two FortiWiFi units and maintain both packages',
      'Set the Install On value of the guest policy to the two FortiWiFi devices',
      'Disable the guest policy in the package and enable it locally on each FortiWiFi',
      'Create a per-platform mapping for the policy in the normalized interface',
    ],
    answer: [1],
    explanation: '**Install On** restricts an individual policy to some of the package\'s installation targets, so one shared package can serve devices with different hardware. Cloning works but doubles maintenance. Enabling the policy locally makes the package Out of Sync. Normalized interface mappings map interfaces, not policies.',
    lesson: '3.1-policy-packages-targets',
  },
  {
    id: 'd3-009',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator tries to delete the address object Old-Printer and FortiManager refuses. What is the reason?',
    exhibit: String.raw`FMG-HQ # show system admin setting
config system admin setting
    ...
    set objects-force-deletion disable
    ...
end

Policy & Objects > Object Configurations > Firewall Objects > Addresses
Name          Type    Details          Used
Old-Printer   Subnet  10.1.9.20/32     Yes`,
    options: [
      'Old-Printer is still referenced, and forced deletion of used objects is disabled',
      'Objects can be deleted only from the Global Database ADOM',
      'Address objects can be deleted only by the administrator who created them',
      'The Used column means the object was installed at least once, and installed objects can never be deleted',
    ],
    answer: [0],
    explanation: 'The Used column shows the object is referenced. With `objects-force-deletion disable`, FortiManager does not offer **Delete Anyway** for used objects. Use **Where Used** to find and remove the references, then delete it (or re-enable the setting, which is enabled by default). The other options are not FortiManager rules; Used means referenced, not "installed once".',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-010',
    topic: '3.1',
    type: 'single',
    difficulty: 1,
    stem: 'After importing policies from several FortiGates, an administrator finds the addresses WebServer, Srv-Web and web01, all defined as 10.1.20.10/32. Which FortiManager tool groups these objects and lets the administrator combine them into one?',
    options: [
      'Tools > Find Duplicate Objects, then Merge',
      'Tools > Find Unused Objects, then Delete',
      'Policy Package > Policy Check, then Fix',
      'Tools > Cross-ADOM Search, then Promote',
    ],
    answer: [0],
    explanation: '**Find Duplicate Objects** lists objects with the same definition but different names and offers **Merge** for each group. Find Unused Objects finds unreferenced objects. The policy check reports duplication but has no fix action. Cross-ADOM Search finds addresses, IP pools and VIPs across ADOMs and can promote them to the Global Database; it does not merge.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-011',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The address Store-LAN is used in Branch-PP, whose installation targets are FGT-Branch1, FGT-Branch2 and FGT-Branch3. Which subnet does FGT-Branch3 receive when the package is installed?',
    exhibit: String.raw`config firewall address
    edit "Store-LAN"
        set subnet 10.1.0.0 255.255.255.0
        config dynamic_mapping
            edit "FGT-Branch2"-"root"
                set subnet 10.2.0.0 255.255.255.0
            next
        end
    next
end`,
    options: [
      '10.1.0.0/24, the object\'s default value',
      '10.2.0.0/24, because the first dynamic mapping applies to all devices without their own entry',
      'None; the install to FGT-Branch3 fails because it has no per-device mapping',
      'Whatever subnet FGT-Branch3 had locally, because dynamic objects are never installed',
    ],
    answer: [0],
    explanation: 'A device with a per-device mapping (FGT-Branch2) receives the mapped value. Every other target receives the object\'s **default** configuration, so FGT-Branch1 and FGT-Branch3 get 10.1.0.0/24. Installation fails only when neither a per-device mapping nor a default exists. Mappings do not spread to other devices, and dynamic objects are installed like any other object.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-012',
    topic: '3.1',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about per-device dynamic mapping of objects are true? (Choose two.)',
    options: [
      'The default value is used only when there is no per-device mapping for the device',
      'A CLI script that configures dynamic_mapping must be run against a policy package (ADOM database), not the device database',
      'A per-platform mapping always takes priority over a per-device mapping',
      'Dynamic mapping is available only when the ADOM is in workflow mode',
      'Importing a policy package removes all existing per-device mappings from the objects',
    ],
    answer: [0, 1],
    explanation: 'Fortinet documents that the default mapping is used only when no per-device mapping exists, and that CLI scripts defining `dynamic_mapping` or `platform_mapping` must run on a policy package instead of the device database. Per-device mappings win over per-platform mappings (for normalized interfaces explicitly). Dynamic mapping does not depend on workflow mode, and an import usually **adds** per-device mappings for objects the FortiGate already uses.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-013',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Branch1 and FGT-Branch2 are both FortiGate-VM64 units. A policy in Branch-PP uses the normalized interface LAN as its source interface. Which interface does the policy use on FGT-Branch1?',
    exhibit: String.raw`Policy & Objects > Normalized Interface > LAN

Per-Device Mapping
  Mapped Device          Mapped Interface Name
  FGT-Branch1 [root]     port3

Per-Platform Mapping
  Model                  Mapped Interface Name
  FortiGate-VM64         port2`,
    options: [
      'port3',
      'port2',
      'Both port2 and port3',
      'Neither; the install fails because two mapping rules match',
    ],
    answer: [0],
    explanation: 'When a normalized interface is used in a policy, **per-device mappings have higher priority than per-platform mappings**, and the first match is used. FGT-Branch1 matches its per-device rule (port3). FGT-Branch2, which has no per-device rule, uses the per-platform rule (port2). Multiple matching rule types are normal and do not cause a failure.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-014',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator deleted the default per-platform rules from the normalized interface DMZ and created the rules shown. Branch-PP uses DMZ in policy 7. What happens when the Install Wizard runs for both targets?',
    exhibit: String.raw`Normalized Interface: DMZ
  Per-Device Mapping:   FGT-Branch1 [root] -> port4
  Per-Platform Mapping: (none)

Branch-PP installation targets: FGT-Branch1 [root], FGT-Branch2 [root]`,
    options: [
      'FGT-Branch1 passes validation and is installed; FGT-Branch2 fails interface validation and is skipped',
      'Both devices install, and FGT-Branch2 creates a new interface called DMZ',
      'Both devices are skipped because one target has a validation error',
      'FGT-Branch2 installs policy 7 using port4, the only interface mapped in DMZ',
    ],
    answer: [0],
    explanation: 'A normalized interface needs a matching rule for each device the policy is installed to. FGT-Branch2 has no per-device rule and no per-platform rule, so it fails the **interface** validation step and is skipped; devices without errors (FGT-Branch1) are still installed. FortiManager does not create interfaces on the FortiGate from a normalized interface, and a per-device mapping for one device never applies to another.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-015',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: 'In a FortiManager CLI script that runs against a policy package, which sub-table inside an object such as `config firewall address` / `edit "Store-LAN"` holds the per-device values? Type the `config` keyword that follows.',
    answer: ['dynamic_mapping', 'config dynamic_mapping'],
    explanation: 'Per-device values live in `config dynamic_mapping`, with entries such as `edit "FGT-Branch2"-"root"`. Per-platform values use `platform_mapping` where the object supports it. These scripts must run on a policy package (ADOM database).',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-016',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The administrator tries to create a new normalized interface Uplink with a per-platform rule mapping FortiGate-VM64 to port1. FortiManager reports that the dynamic-interface default mapping has been used, and Uplink is not created. What must the administrator do?',
    exhibit: String.raw`Policy & Objects > Normalized Interface (ADOM: Retail)

Name     Per-Platform Mapping (default rules)
port1    FortiGate-VM64 -> port1, FortiGate-60F -> port1, ...
port2    FortiGate-VM64 -> port2, FortiGate-60F -> port2, ...
wan1     FortiGate-60F -> wan1, ...`,
    options: [
      'Delete the FortiGate-VM64 per-platform rule from the default normalized interface port1, then create Uplink',
      'Enable Advanced ADOM device mode so that an interface can be mapped twice',
      'Use a per-device mapping instead, because per-platform mappings are allowed only for zones',
      'Upgrade the ADOM, because default normalized interfaces are read-only in the current ADOM version',
    ],
    answer: [0],
    explanation: 'Default normalized interfaces created with the ADOM already map port1 to port1 per platform. To use that physical interface in your own per-platform rule you must first delete the default per-platform rule; otherwise FortiManager reports that the default mapping has been used. You are allowed to edit and delete default normalized interfaces, per-platform rules are valid for interfaces as well as zones, and ADOM device mode is unrelated.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-017',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator creates a normalized interface with the Wildcard option turned on. In the wildcard pattern, what does a period (.) represent?',
    options: [
      'Exactly one alphanumeric character',
      'Zero or more characters of any kind',
      'A literal period, as in a VLAN name such as port1.100',
      'The end of the interface name',
    ],
    answer: [0],
    explanation: 'FortiManager wildcard interfaces use `.` for a single alphanumeric character (like the regex `[a-zA-Z0-9]`) and `*` for zero or more characters (like `.*`). At install, every interface that matches the pattern is installed. A literal period and an end-of-name anchor are not what the period means here.',
    lesson: '3.1-objects-dynamic-mapping',
  },
  {
    id: 'd3-018',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'A provisioning template must set a different store number in an interface address for each FortiGate. In FortiManager 7.6, what should the administrator use?',
    options: [
      'An ADOM-level metadata variable referenced as $(storenumber), with a value mapped for each device',
      'A required device meta field named storenumber referenced in the template',
      'A separate system template for every store',
      'A per-platform mapping on the system template',
    ],
    answer: [0],
    explanation: 'Metadata variables exist for exactly this: one shared template, a value per device (or device group), and a default. The 7.6 Meta Fields documentation states that meta fields cannot be used as variables in scripts or provisioning templates and directs you to ADOM-level metadata variables instead (older releases used meta fields this way, and a few legacy template pages still mention it). A template per store works but defeats the purpose, and templates do not have per-platform mappings.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-019',
    topic: '3.1',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. What does the (!) in the storenumber column indicate for FGT-Branch2?',
    exhibit: String.raw`Device Manager > Device & Groups > Managed FortiGate (table view)

Device Name   Config Status   Policy Package Status     storenumber
FGT-Branch1   Synchronized    Installed (Branch-PP)     148
FGT-Branch2   Synchronized    Installed (Branch-PP)     (!)`,
    options: [
      'storenumber is a required meta field for devices and FGT-Branch2 has no value set',
      'The storenumber metadata variable failed to install on FGT-Branch2',
      'FGT-Branch2 has a duplicate store number',
      'FGT-Branch2 is locked by another administrator',
    ],
    answer: [0],
    explanation: 'A **required** meta field on the Device object automatically adds a column to Device Manager. An exclamation mark shows the device lacks a value; right-click the device, Edit, and fill it in. Meta fields are attributes, not installed configuration, so nothing failed to install, and locks are shown with padlock icons.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-020',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A CLI template assigned to FGT-Branch1 and FGT-Branch2 contains `set interface $(wan_intf)`. FGT-Branch1 is not a member of any device group. Which value does FGT-Branch1 receive?',
    exhibit: String.raw`Policy & Objects > Advanced > Metadata Variables (ADOM: Retail)

Name        Type   Default Value   Per-Device Mapping
wan_intf    Text   wan1            FGT-Branch2 = port1
storenumber Text   0               FGT-Branch1 = 148, FGT-Branch2 = 152`,
    options: [
      'wan1',
      'port1',
      'An empty value, so the command is skipped',
      '148',
    ],
    answer: [0],
    explanation: 'The per-device mapping value is used when the device has one; otherwise the **default value** applies. wan_intf has a mapping only for FGT-Branch2, so FGT-Branch1 gets the default wan1. 148 is FGT-Branch1\'s value for a different variable. Install Preview shows the resolved value for each device.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-021',
    topic: '3.1',
    type: 'fill',
    difficulty: 1,
    stem: 'An administrator writes a CLI script that must use the ADOM-level metadata variable named branch_id. Type exactly how the variable is referenced in the script.',
    answer: ['$(branch_id)'],
    explanation: 'Metadata variables are referenced as `$(variable_name)` in scripts and templates, for example `set network-id $(branch_id)`. In GUI object fields that support them, typing `$` opens a picker listing the ADOM\'s variables.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-022',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about meta fields in FortiManager 7.6 are true? (Choose two.)',
    options: [
      'They are configured in System Settings > Advanced > Meta Fields',
      'A required meta field forces administrators to supply a value when they create the associated object',
      'They can be referenced in CLI scripts with $(name)',
      'Their Object and Name can be changed after creation',
      'The Status option is available only for firewall objects',
    ],
    answer: [0, 1],
    explanation: 'Meta fields are defined in **System Settings > Advanced > Meta Fields** and can be Required or Optional; a required field must be filled when the object is created. In 7.6 they cannot be used as variables in scripts or provisioning templates (use metadata variables). Object and Name cannot be edited afterwards, and the Status option is available only for **non**-firewall objects.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-023',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'An administrator creates a metadata variable in the Global Database ADOM for use in global header policies. Each customer ADOM needs a different value. How are the values assigned?',
    options: [
      'With per-ADOM mapping, which applies one value to all devices in the selected ADOM',
      'With per-device mapping for every FortiGate in every customer ADOM',
      'By creating a meta field on the Administrative Domain object',
      'They cannot be assigned; global metadata variables only support a default value',
    ],
    answer: [0],
    explanation: 'In the Global Database ADOM, metadata variables offer **Per-ADOM Mapping** instead of per-device mapping: each mapping assigns a value to all devices in that ADOM. Per-device mapping is not available in the Global Database. A meta field is an attribute, not a variable.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-024',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about ADOM-level metadata variables are true? (Choose two.)',
    options: [
      'A Password-type variable is stored encrypted and its value cannot be revealed after it is saved',
      'The default value is used for any device that has no per-device or device-group mapping',
      'A metadata variable created in the Retail ADOM is automatically available in every other ADOM',
      'Metadata variables are configured in System Settings > Advanced > Meta Fields',
      'Per-device mapping is available in the Global Database ADOM',
    ],
    answer: [0, 1],
    explanation: 'Password variables are encrypted once saved and their value stays obscured when you edit them; Text variables are not encrypted. The default value applies whenever a device has no mapping. Metadata variables are **per ADOM** and live in Policy & Objects > Advanced > Metadata Variables (Meta Fields are a different feature). The Global Database uses per-ADOM mapping instead of per-device mapping.',
    lesson: '3.1-meta-fields-metadata-variables',
  },
  {
    id: 'd3-025',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Workspace mode is enabled, ADOM lock override is disabled and the Retail ADOM is unlocked. The administrator dana tries to lock the Retail ADOM. What happens?',
    exhibit: String.raw`Policy & Objects > Policy Packages (logged in as dana, ADOM Retail [unlocked])

Package      Lock
Branch-PP    red padlock   (locked by lee, 2026-10-28 14:02)
DC-PP        -
default      -`,
    options: [
      'dana cannot lock the ADOM unless lee\'s lock is released, for example by lee unlocking or logging out, or by disconnecting lee',
      'dana locks the ADOM and lee\'s package lock is converted to read-only access',
      'dana locks the ADOM, but Branch-PP stays editable by lee',
      'dana must first lock DC-PP and default, then the ADOM lock is granted automatically',
    ],
    answer: [0],
    explanation: 'While another administrator holds a device or policy package lock in an unlocked ADOM, others can lock that ADOM only by disconnecting the administrator who holds the lock. dana can still lock and edit DC-PP or default individually. Locks are never silently converted or shared.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-026',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator wants to lock only FGT-Branch2 in Device Manager, but the Lock option is not offered for individual devices. What is the reason?',
    exhibit: String.raw`FMG-HQ # get system global
...
adom-mode : advanced
...
adom-status : enable
...
per-policy-lock : disable
...
workspace-mode : normal
...`,
    options: [
      'The ADOM device mode is Advanced, and individual devices cannot be locked in that mode',
      'Per-policy lock is disabled, and device locks depend on it',
      'Workspace mode normal supports only ADOM locks; device locks need workflow mode',
      'ADOMs are enabled, and device locks are available only when ADOMs are disabled',
    ],
    answer: [0],
    explanation: 'With `adom-mode advanced` (VDOMs of one FortiGate can be split across ADOMs), individual devices cannot be locked; in that mode device database changes made in workspace mode are saved automatically. Per-policy lock concerns policies only. `normal` is the workspace mode that **does** allow device and package locks; workflow mode allows only whole-ADOM locks. ADOMs being enabled is irrelevant.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-027',
    topic: '3.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Workspace mode is enabled. Type the `config system global` setting name that must be enabled so administrators can lock individual firewall policies instead of a whole policy package.',
    answer: ['per-policy-lock', 'set per-policy-lock enable'],
    explanation: '`set per-policy-lock enable` (default disabled, only available in workspace lock mode). In the GUI it is the Per-Policy Lock toggle under System Settings > Advanced > Workspace.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-028',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Per-policy lock is enabled. An administrator tries to lock policy 12 in Branch-PP and cannot. Policy 12 comes from the policy block Std-Outbound inserted in the package. What should the administrator do?',
    options: [
      'Lock the policy block Std-Outbound (or the package or ADOM) and edit it there',
      'Disable per-policy lock and re-enable it to refresh the lock table',
      'Enable ADOM lock override so the policy can be locked',
      'Move the ADOM to workflow mode, which supports per-policy locks inside policy blocks',
    ],
    answer: [0],
    explanation: 'Policies that are used in a policy block cannot be locked individually. Policy blocks have their own lock (7.6 supports locking policy blocks in workspace mode), or you lock a larger scope. Lock override is about breaking another admin\'s ADOM lock, and workflow mode supports only whole-ADOM locks.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-029',
    topic: '3.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Per-policy lock is enabled. Administrator lee has just added two new policies to Branch-PP and has not saved yet. What can administrator dana do in Branch-PP until lee saves?',
    exhibit: String.raw`Policy & Objects > Policy Packages > Branch-PP > Firewall Policy   (viewed by dana)

          Seq  Name            From   To     Action
[red]          sequence lock held by lee
[red]     1    Guest-Out       guest  wan1   ACCEPT
[red]     2    POS-Out         pos    wan1   ACCEPT
          3    LAN-Out         lan    wan1   ACCEPT
          4    Mgmt-In         wan1   lan    ACCEPT`,
    options: [
      'Edit policies 3 and 4, but not create or insert new policies',
      'Nothing, because adding policies locks the whole package',
      'Create new policies at the bottom of the table but not reorder them',
      'Lock the ADOM, which automatically saves lee\'s changes',
    ],
    answer: [0],
    explanation: 'Adding two or more policies takes a **sequence lock** so only one administrator controls policy order. While it is held, other administrators can edit existing policies that are not locked (3 and 4 here) but can neither create nor insert policies. Saving releases it. Nobody can lock the ADOM while lee holds locks in it without disconnecting lee, and that would not save lee\'s work.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-030',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The ADOM Retail is in workflow mode. An approver selects session 9 and clicks Approve, but approval is not allowed. Why?',
    exhibit: String.raw`Policy & Objects > Sessions > Session List (ADOM: Retail)

ID  Name                 User   Date Submitted        Approved/...  Status
7   Add-POS-VLAN         dana   2026-10-21 09:14:02   2/2           Approved
8   Block-Torrent        lee    2026-10-22 15:40:11   0/2           Rejected
9   Rework-Guest-Policy  dana   2026-10-23 08:02:57   1/2           Waiting for approval`,
    options: [
      'Session 8 was rejected and must be repaired or discarded before a later session can be approved',
      'Session 9 already has one approval, and a session can be approved by only one group',
      'dana created session 9, and administrators cannot approve sessions created by the same user',
      'The ADOM must be unlocked before sessions can be approved',
    ],
    answer: [0],
    explanation: 'Sessions must be approved in the order they were submitted, and a rejected session must be repaired or discarded before the next one can be approved. 1/2 means one of two approval groups has approved, which is normal. FortiManager cannot prevent administrators from approving their own sessions. Approving from the session list requires the approver to lock the ADOM, not unlock it.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-031',
    topic: '3.1',
    type: 'order',
    difficulty: 2,
    stem: 'An administrator in a workflow-mode ADOM changes a policy and gets it onto the FortiGates. Put the steps in order.',
    items: [
      'Lock the ADOM',
      'Create a new session from Sessions > Session List',
      'Make and save the policy changes',
      'Submit the session for approval, which unlocks the ADOM',
      'One approver from each approval group approves the session',
      'Install the policy package to the target devices',
    ],
    explanation: 'Workflow mode requires the ADOM lock and a session before any policy or object change. Submitting sends the approval emails and automatically unlocks the ADOM. The changes are accepted when one approver from each group approves. Approval commits the changes to FortiManager; an install is still needed to push them to devices (and devices cannot be installed while a session is in progress).',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-032',
    topic: '3.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about FortiManager workflow mode are true? (Choose two.)',
    options: [
      'Only the entire ADOM can be locked; device and policy package locks are not available',
      'While a workflow session is in progress, devices cannot be added or installed',
      'One approver from any one approval group is enough to approve a session',
      'FortiManager prevents an administrator from approving a session they submitted',
      'Discarding a session discards only that session; later sessions stay in the list',
      'An approval matrix can contain at most two approval groups',
    ],
    answer: [0, 1],
    explanation: 'In workflow mode only whole-ADOM locks exist, and while a session is in progress devices cannot be added or installed. Approval needs one approver from **each** group (up to eight groups). FortiManager cannot prevent self-approval. Discarding a session also discards all later sessions.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-033',
    topic: '3.1',
    type: 'single',
    difficulty: 2,
    stem: 'In a workflow-mode ADOM, session 14 was rejected because a policy referenced the wrong address. What does selecting the session and clicking Repair do?',
    options: [
      'Creates and starts a new session containing session 14\'s changes so they can be corrected and resubmitted',
      'Reopens session 14 itself and resets its approval count',
      'Deletes session 14 and every session after it',
      'Reverts the ADOM to the state before session 14 and submits that automatically',
    ],
    answer: [0],
    explanation: 'Repair creates a **new** session, added to the session list, that carries the rejected session\'s changes so you can fix them. Discard deletes a session and all later sessions. Revert creates a new automatically submitted session that undoes later changes.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-034',
    topic: '3.1',
    type: 'match',
    difficulty: 3,
    stem: 'Match each administrator profile permission (CLI name) to what it controls.',
    pairs: [
      ['adom-lock', 'Locking and unlocking an ADOM'],
      ['device-policy-package-lock', 'Locking and unlocking individual devices and policy packages'],
      ['deploy-management', 'Installing policy packages or device configuration'],
      ['import-policy-packages', 'Importing policies from managed devices'],
      ['set-install-targets', 'Editing a policy package\'s installation targets'],
    ],
    explanation: 'These are separate Read-Write/Read-Only/None permissions in a FortiManager administrator profile (GUI names: Lock/Unlock ADOM, Lock/Unlock Device/Policy Package, Install Policy Package or Device Configuration, Import Policy Package, Edit Installation Targets). Splitting them lets you, for example, allow junior admins to edit packages but not install them.',
    lesson: '3.1-locks-workflow-mode',
  },
  {
    id: 'd3-035',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. All FortiGates in Retail now run FortiOS 7.6, and the team wants to use 7.6-only policy options in Policy & Objects. What must the administrator do?',
    exhibit: String.raw`System Settings > ADOMs > Edit ADOM: Retail

Name:     Retail
Type:     FortiGate      (cannot be edited)
Version:  7.4            (cannot be edited)
Devices:  FGT-Branch1 (v7.6.1), FGT-Branch2 (v7.6.1)
Mode:     Normal`,
    options: [
      'Upgrade the ADOM with System Settings > ADOMs > More > Upgrade',
      'Delete and recreate the ADOM with the same name but version 7.6, keeping the packages',
      'Re-import every FortiGate, which converts the ADOM to the version of the newest device',
      'Nothing; an ADOM automatically follows the firmware of its devices',
    ],
    answer: [0],
    explanation: 'The ADOM version is fixed at creation and the only way to move it forward is an **ADOM upgrade** (More > Upgrade), which converts its database to the new format. Deleting the ADOM would require removing its devices and would lose its packages and objects. Imports and device firmware never change the ADOM version.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-036',
    topic: '3.2',
    type: 'order',
    difficulty: 2,
    stem: 'Put the recommended steps for upgrading a 7.4 ADOM to 7.6 in order.',
    items: [
      'Back up FortiManager (and take a VM snapshot if applicable)',
      'Run ADOM Upgrade Readiness, fix the reported issues and confirm every device runs a FortiOS version the 7.6 ADOM supports',
      'Select the ADOM and choose More > Upgrade',
      'Upgrade the FortiGates in the ADOM and resynchronize them',
    ],
    explanation: 'Fortinet recommends a backup or snapshot first, then the readiness tool (which reports but does not fix problems) together with a check that no device is too old for the new ADOM version, then the upgrade itself, and finally upgrading the FortiGates\' firmware and resynchronizing.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-037',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator selects Retail and MSSP-CustomerA and opens More > Upgrade. What is the result?',
    exhibit: String.raw`System Settings > ADOMs

Name             Type       Version   Devices
root             FortiGate  7.6       0
Retail           FortiGate  7.4       2
MSSP-CustomerA   FortiGate  7.2       1
Global Database  -          7.4       -`,
    options: [
      'The two ADOMs cannot be upgraded together because only ADOMs of the same version can be upgraded at the same time',
      'Both ADOMs are upgraded to 7.6 in one step',
      'Both ADOMs are upgraded, but the Global Database is upgraded first automatically',
      'Retail is upgraded and MSSP-CustomerA is skipped silently',
    ],
    answer: [0],
    explanation: 'Multiple ADOMs can be upgraded at once only if they are on the **same version** (two 7.4 ADOMs, yes; a 7.4 and a 7.2 ADOM, no). The readiness check has the same rule. The Global Database is not upgraded automatically, and it should be upgraded last, after the ADOMs that use global packages.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-038',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Several ADOMs use global policy packages from the Global Database ADOM. In which order should the upgrade be done?',
    options: [
      'Upgrade every ADOM that uses a global package to a supported version first, then upgrade the Global Database ADOM',
      'Upgrade the Global Database ADOM first so the global packages are ready for the new ADOM version',
      'Upgrade the Global Database ADOM and the local ADOMs together in one operation',
      'The Global Database ADOM is never upgraded; it is always on the FortiManager firmware version',
    ],
    answer: [0],
    explanation: 'Fortinet states the Global Database ADOM should only be upgraded after all ADOMs using a global policy package have been upgraded to a supported version. It has its own version and Upgrade option, and it cannot be combined with local ADOMs in one upgrade.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-039',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'What does the ADOM Upgrade Readiness tool do?',
    options: [
      'Checks the ADOM for configuration that is missing or invalid for the next ADOM version and produces a report that can be exported to CSV or PDF',
      'Fixes invalid values automatically and then upgrades the ADOM',
      'Upgrades the FortiGates in the ADOM to a firmware version that matches the new ADOM version',
      'Creates an ADOM revision and a FortiManager backup before the upgrade',
    ],
    answer: [0],
    explanation: 'The readiness tool checks whether devices in the ADOM have configuration incompatible with the new FortiOS syntax and reports the issues (exportable to CSV or PDF). It **cannot fix** invalid values, it does not upgrade anything, and it does not take backups or revisions.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-040',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: 'A Super_User administrator moves FGT-Branch1, which is a member of a VPN Manager community, from the Retail ADOM to the Retail-76 ADOM using Select Device in the destination ADOM. Which two statements are true? (Choose two.)',
    options: [
      'FGT-Branch1\'s policy package stays in Retail; the administrator must import the configuration (or assign and install a package) in Retail-76',
      'Its VPN Manager configuration is ADOM-specific and does not follow the device to Retail-76',
      'The policy package and all objects it uses move to Retail-76 with the device',
      'FGT-Branch1 must be deleted from FortiManager and re-registered in Retail-76',
      'FGT-Branch1 remains visible and editable in both ADOMs until the next install',
    ],
    answer: [0, 1],
    explanation: 'Adding a device to another ADOM with Select Device removes it from the old one (a device is in only one ADOM, and only devices with the same version as the destination ADOM can be selected). ADOM-level content such as its policy package, the objects it used and its VPN Manager settings stays in the old ADOM, which is why Fortinet recommends not moving devices that VPN Manager already manages. Import the configuration (or assign and install a package) in the new ADOM and rebuild the VPN there if needed. No delete and re-register is needed, and the device is not visible in both ADOMs.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-041',
    topic: '3.2',
    type: 'single',
    difficulty: 1,
    stem: 'Which type of administrator can assign a registered FortiGate to a different ADOM?',
    options: [
      'An administrator with the Super_User profile',
      'Any administrator who can lock both ADOMs',
      'An administrator with the Package_User profile assigned to both ADOMs',
      'Any administrator in the root ADOM',
    ],
    answer: [0],
    explanation: 'Creating ADOMs and assigning devices (or VDOMs) to ADOMs requires a **Super_User** administrator. Locking rights or package permissions are not enough, and being in root gives no special right.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-042',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Branch1 has been upgraded to FortiOS 7.6 ahead of the other stores. The team wants to manage it with 7.6 features now but must not upgrade Retail until the other stores are upgraded. What should the administrator do?',
    exhibit: String.raw`System Settings > ADOMs

Name         Version   Devices
Retail       7.4       FGT-Branch1 (v7.6.1), FGT-Branch2 (v7.4.5), FGT-Branch3 (v7.4.5)
Retail-76    7.6       -`,
    options: [
      'Edit Retail-76, use Select Device to add FGT-Branch1, then import its configuration (or assign and install a 7.6 package) in Retail-76',
      'Upgrade only FGT-Branch1\'s policy package to 7.6 inside the Retail ADOM',
      'Change FGT-Branch1\'s ADOM version on its Edit Device page',
      'Downgrade FGT-Branch1 to 7.4, because a 7.4 ADOM can never manage a 7.6 FortiGate',
    ],
    answer: [0],
    explanation: 'Moving the upgraded device into an ADOM of the new version, then rebuilding its package there, is the upgraded-device migration path. Packages have no version of their own (the ADOM does), devices have no ADOM version setting, and depending on the FortiManager build a 7.4 ADOM can usually still manage a 7.6 FortiGate through syntax conversion, just without 7.6-only features.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-043',
    topic: '3.2',
    type: 'single',
    difficulty: 3,
    stem: 'A 7.4 ADOM installs a policy package to a FortiGate running FortiOS 7.6. How does FortiManager handle CLI syntax that exists only in FortiOS 7.6?',
    options: [
      'It is not used, because the ADOM database has no 7.6-only syntax to send',
      'It is added with FortiOS 7.6 default values on every install',
      'The install fails until the ADOM is upgraded',
      'It is copied from the FortiGate into the ADOM database at the next install',
    ],
    answer: [0],
    explanation: 'When an ADOM installs to a newer FortiOS, FortiManager upgrades changed syntax, does **not use** syntax that exists only in the newer version, and does not install syntax the newer version deleted. This is best-effort and only for supported combinations; it is why features of the newer FortiOS are unavailable until the ADOM is upgraded. Installs never copy configuration back into the ADOM.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-044',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'An MSSP wants VDOM root of FGT-HQ in the ADOM MSSP-CustomerA and VDOM cust-b of the same FortiGate in a different ADOM. What is required?',
    options: [
      'Set the ADOM device mode to Advanced in System Settings > Advanced > Misc Settings',
      'Enable workflow mode for both ADOMs',
      'Register FGT-HQ twice, once for each VDOM',
      'Create both ADOMs in Backup mode',
    ],
    answer: [0],
    explanation: 'In **Normal** ADOM device mode a FortiGate and all its VDOMs belong to one ADOM. **Advanced** mode lets individual VDOMs go to different ADOMs (at the cost of more complex management, and individual devices can then not be locked in workspace mode). Workflow mode, double registration and Backup ADOM mode do not split VDOMs.',
    lesson: '3.2-adom-versions-upgrade-move',
  },
  {
    id: 'd3-045',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Auto deletion is set to keep the last 10 revisions. Which revision can the administrator NOT delete with the Delete action?',
    exhibit: String.raw`Policy & Objects > ADOM Revisions (ADOM: Retail)

ID  Name                    Created by  Created Time          Comment
14  pre-Q4-freeze  [lock]   dana        2026-10-01 18:02:11   Baseline before holiday freeze
15  install-2026-10-14      lee         2026-10-14 22:30:47   Created by Install Wizard
16  before-guest-rework     dana        2026-10-23 07:55:02   Guest SSID policy redesign`,
    options: [
      'Revision 14, because it is locked from auto deletion',
      'Revision 15, because revisions created by the Install Wizard are read-only',
      'Revision 16, because it is the most recent revision',
      'Any revision created by another administrator',
    ],
    answer: [0],
    explanation: 'The lock icon means **Lock this revision from auto deletion** is set. A locked revision is protected from auto deletion and cannot be deleted until it is unlocked (More > Unlock Revision or by clearing the checkbox in Edit). Install Wizard revisions, recent revisions and other admins\' revisions have no special protection.',
    lesson: '3.2-adom-revisions',
  },
  {
    id: 'd3-046',
    topic: '3.2',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator restores ADOM revision 16 in the Retail ADOM. What is affected?',
    options: [
      'Policy packages, objects and VPN console settings in the Retail ADOM database; nothing changes on the FortiGates until an install',
      'The device database of every FortiGate in Retail, including interfaces and routing',
      'Policy packages in the ADOM and, immediately, the policies on every FortiGate in Retail',
      'Only the policy package that was open when the revision was created',
    ],
    answer: [0],
    explanation: 'An ADOM revision contains the ADOM\'s policy packages, objects and VPN console settings. Restoring reverts those in the ADOM database only. Device settings are not part of an ADOM revision, and the FortiGates change only when you install. The revision covers all packages in the ADOM, not just one.',
    lesson: '3.2-adom-revisions',
  },
  {
    id: 'd3-047',
    topic: '3.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about ADOM revisions are true? (Choose two.)',
    options: [
      'The Install Wizard can create an ADOM revision as part of an install',
      'View Revision Diff compares the selected revision with the current ADOM database',
      'ADOM revisions include each device\'s interface, routing and system settings',
      'Auto deletion can remove locked revisions when the revision count is exceeded',
      'An ADOM revision created in Retail can be restored into MSSP-CustomerA',
    ],
    answer: [0, 1],
    explanation: 'The first Install Wizard page has a **Create ADOM Revision** checkbox, and **View Revision Diff** shows Global Policy, Policy Package and ADOM-level object changes between the revision and the current database (with CLI Diff and CSV download). Device settings are not included, locked revisions are exempt from auto deletion, and revisions belong to their own ADOM.',
    lesson: '3.2-adom-revisions',
  },
  {
    id: 'd3-048',
    topic: '3.3',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. Two administrators log in to the same ADOM on FMG-HQ and edit the same address object at the same time. Why does FortiManager not stop them?',
    exhibit: String.raw`FMG-HQ # get system global
...
adom-mode : normal
...
adom-status : enable
...
workspace-mode : disabled`,
    options: [
      'Workspace mode is disabled (the default), so concurrent ADOM access is allowed and no locks are required',
      'Lock override is disabled, so locks are not enforced',
      'Per-policy lock is disabled, which disables all locking',
      'Address objects can never be locked',
    ],
    answer: [0],
    explanation: '`workspace-mode disabled` is the default and means **concurrent ADOM access**: several administrators can change the same ADOM at the same time, and nothing is locked. Enabling workspace mode disables concurrent access. Lock override (`lock-preempt`) and `per-policy-lock` only matter once workspace mode is on (per-policy lock is only available in workspace lock mode), and objects can be locked in workspace mode.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-049',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Complete the command that enables workspace (lock) mode for all ADOMs: `config system global` / `set workspace-mode ________` / `end`',
    answer: ['normal'],
    explanation: 'The values are `disabled` (default), `normal` (workspace for all ADOMs), `workflow` (workflow for all ADOMs) and `per-adom` (each ADOM chooses). In the GUI, `normal` is Workspace (ALL ADOMS) under System Settings > Advanced > Workspace.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-050',
    topic: '3.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each `workspace-mode` value in `config system global` to its effect.',
    pairs: [
      ['disabled', 'Concurrent ADOM access; no locking required'],
      ['normal', 'Locking required in every ADOM'],
      ['workflow', 'Locking plus sessions and change approval in every ADOM'],
      ['per-adom', 'Each ADOM selects Disable, Workspace or Workflow in its Edit ADOM page'],
    ],
    explanation: 'The 7.6 CLI reference lists `set workspace-mode {disabled | normal | per-adom | workflow}` with `disabled` as the default. Changing the mode ends your login session.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-051',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Workspace mode is enabled for all ADOMs. Which two statements describe its effects? (Choose two.)',
    options: [
      'Device Manager and Policy & Objects are read-only until the administrator locks the ADOM, a device or a policy package',
      'The ADOM must be locked before changes can be made in VPN Manager or AP Manager',
      'A new policy package can be created with only a policy package lock',
      'A CLI script can be created with only a device lock',
      'JSON API clients must lock the ADOM before making device-level changes',
    ],
    answer: [0, 1],
    explanation: 'With workspace on, Device Manager and Policy & Objects are read-only until a lock is taken, and AP Manager, VPN Manager, FortiSwitch Manager and Extender Manager need the ADOM lock. Creating packages, adding devices and creating scripts need the **whole** ADOM locked (a script can be **run** on a device that is only device-locked). Fortinet notes that through the API the ADOM does not need to be locked for device-level changes.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-052',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Workspace mode is enabled. Administrator lee went home with the Retail ADOM locked and is unreachable. Lock override is disabled. Which command, run by a Super_User administrator, releases the lock?',
    exhibit: String.raw`FMG-HQ # diagnose system admin-session list
*** entry 0 ***
session_id: 3121 (seq: 0)
username: lee
admin template: lee
from: GUI(10.10.5.23) (type 1)
profile: Standard_User
adom: Retail
session length: 22418 (seconds)
idle: 21907 (seconds)

*** entry 1 ***
session_id: 3188 (seq: 1)
username: admin
admin template: admin
from: GUI(10.10.5.40) (type 1)
profile: Super_User
adom: root
session length: 96 (seconds)
idle: 2 (seconds)`,
    options: [
      'diagnose system admin-session kill 3121',
      'diagnose system admin-session kill 3188',
      'diagnose dvm adom list',
      'diagnose debug application fgfmsd 255',
    ],
    answer: [0],
    explanation: 'A lock lasts as long as the holder\'s session. Killing lee\'s session (session_id 3121) logs lee out and releases the locks; unsaved changes are lost. 3188 is the current admin\'s own session. `diagnose dvm adom list` only lists ADOMs, and the fgfmsd debug traces FortiGate-FortiManager tunnel traffic; neither touches admin sessions or locks. The GUI equivalent is Dashboard > System Information > Current Session List > Delete.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-053',
    topic: '3.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Type the `config system global` setting name that enables ADOM lock override, allowing an administrator to unlock an ADOM locked by someone else.',
    answer: ['lock-preempt', 'set lock-preempt enable'],
    explanation: '`set lock-preempt enable` (default disable). It only has an effect when workspace mode is on, and overriding a lock discards the other administrator\'s unsaved changes.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-054',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'ADOM lock override is enabled. Administrator dana unlocks the Retail ADOM, which administrator lee had locked while editing Branch-PP. What happens to lee\'s unsaved changes?',
    options: [
      'They are discarded',
      'They are saved automatically before the ADOM is unlocked',
      'They are moved into a workflow session for approval',
      'They are kept in lee\'s workspace and applied when lee next logs in',
    ],
    answer: [0],
    explanation: 'ADOM lock override lets an administrator unlock an ADOM locked by another administrator and **discards all of their unsaved changes**. That is why it is disabled by default. Nothing is auto-saved or turned into a session.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-055',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Administrators often forget to unlock the ADOM after installing. Which change adds an Install and Unlock option to the Install Wizard?',
    options: [
      'config system global / set workspace-unlock-after-install enable / end',
      'config system global / set lock-preempt enable / end',
      'Enable Auto-Push Policy Packages When Device Back Online in the ADOM settings',
      'config system admin setting / set auto-update enable / end',
    ],
    answer: [0],
    explanation: '`workspace-unlock-after-install` (default disable, CLI only, after workspace mode is enabled) adds **Install and Unlock**, which unlocks the ADOM automatically when the install completes. `lock-preempt` is lock override, auto-push installs to devices that come back online, and `auto-update` concerns accepting changes made on FortiGates.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-056',
    topic: '3.3',
    type: 'single',
    difficulty: 1,
    stem: 'Workspace mode is enabled and lock override is disabled. Administrator dana locked the Retail ADOM. Who can unlock it from System Settings > ADOMs?',
    options: [
      'Only dana',
      'Any Super_User administrator',
      'Any administrator assigned to the Retail ADOM',
      'Nobody until dana\'s idle timeout expires',
    ],
    answer: [0],
    explanation: 'Only the administrator who locked the ADOM can unlock it, from the banner or from System Settings > ADOMs. Others can break the lock only with lock override (if enabled) or by ending dana\'s session. dana herself can unlock at any time; logging out also releases her locks.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-057',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'Workspace mode is enabled. Administrator lee holds locks on FGT-Branch1 and on the Branch-PP package in the Retail ADOM, then locks the Retail ADOM itself. What happens to lee\'s device and package locks?',
    options: [
      'They are removed, because the ADOM lock covers everything in the ADOM',
      'They stay in place and must be released separately after the ADOM is unlocked',
      'The ADOM lock is refused because lee already holds locks in the ADOM',
      'They are transferred to the next administrator who logs in to Retail',
    ],
    answer: [0],
    explanation: 'Locking an ADOM automatically removes the device and policy package locks you held within it; if you have unsaved changes you are asked to save or discard them. Only **another** administrator\'s granular locks prevent an ADOM lock.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-058',
    topic: '3.3',
    type: 'single',
    difficulty: 2,
    stem: 'An MSSP wants workflow approval in MSSP-CustomerA but no locking at all in the Lab ADOM. How is this configured?',
    options: [
      'Set workspace-mode per-adom, log in again, then choose Workflow in MSSP-CustomerA\'s Edit ADOM page and Disable in Lab\'s',
      'Set workspace-mode workflow, then exclude the Lab ADOM in the approval matrix',
      'Set workspace-mode normal and create an approval matrix only for MSSP-CustomerA',
      'This is not possible; workspace settings always apply to all ADOMs',
    ],
    answer: [0],
    explanation: 'Workspace (Per-ADOM), CLI value `per-adom`, lets each ADOM choose Disable, Workspace or Workflow on its Edit ADOM page. Changing the global mode ends your session, so you log back in before editing the ADOMs. `workflow` applies to every ADOM, and an approval matrix cannot exempt an ADOM from the mode.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-059',
    topic: '3.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about changing the workspace mode on FortiManager 7.6 are true? (Choose two.)',
    options: [
      'After the mode is changed, the administrator\'s session ends and the login screen is displayed',
      'With Workspace (Per-ADOM) selected, each ADOM\'s Edit ADOM page offers Disable, Workspace or Workflow',
      'FortiManager reboots to convert the ADOM databases',
      'All ADOMs are locked to the administrator who changed the mode',
      'Disabling workspace mode keeps every logged-in administrator\'s unsaved changes in their workspace',
    ],
    answer: [0, 1],
    explanation: 'Changing the mode always ends your session. In per-ADOM mode each ADOM then chooses its own mode on its Edit ADOM page. There is no reboot, ADOMs start unlocked, and disabling workspace warns that logged-in users may **lose** unsaved data.',
    lesson: '3.3-workspace-mode',
  },
  {
    id: 'd3-060',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What is the most likely cause of the status shown for FGT-HQ-DC?',
    exhibit: String.raw`Device Manager > Device & Groups > Managed FortiGate (ADOM: Retail, table view)

Device Name   Connection  Config Status   Policy Package Status
FGT-Branch1   up          Synchronized    Modified (Branch-PP)
FGT-Branch2   up          Synchronized    Installed (Branch-PP)
FGT-HQ-DC     up          Out of Sync     Out of Sync (DC-PP)`,
    options: [
      'Someone changed policies or objects directly on FGT-HQ-DC, outside FortiManager',
      'An administrator edited DC-PP on FortiManager and has not installed it',
      'FGT-HQ-DC has never had a policy package installed',
      'The FGFM tunnel to FGT-HQ-DC is down',
    ],
    answer: [0],
    explanation: '**Out of Sync** (red X) means the change was made **on the managed device**. A change made on FortiManager and not yet installed is **Modified**, as FGT-Branch1 shows. A package that was assigned but never installed shows Never Installed, and a lost connection shows the connection as down and Unknown config status.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-061',
    topic: '3.4',
    type: 'match',
    difficulty: 2,
    stem: 'Match each policy package status to its meaning.',
    pairs: [
      ['Imported', 'Policies and objects were imported from the device into FortiManager'],
      ['Modified', 'Policies or objects were changed on FortiManager and not installed'],
      ['Out of Sync', 'Policies or objects were changed on the managed device'],
      ['Unknown', 'The device configuration was retrieved after the package was imported or installed'],
      ['Never Installed', 'The assigned package did not come from an import of this device and has not been installed since assignment'],
    ],
    explanation: 'These are the policy package statuses in Device Manager and the Installation Targets pane, together with Installed/Synchronized (green check: installed and matching). A typical Unknown case is retrieving the configuration after a FortiOS upgrade.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-062',
    topic: '3.4',
    type: 'single',
    difficulty: 1,
    stem: 'Refer to the exhibit. FGT-Branch2 was just added to the installation targets of Branch-PP, which was originally imported from FGT-Branch1. No install has been run. Which policy package status belongs in the empty cell?',
    exhibit: String.raw`Policy & Objects > Policy Packages > Branch-PP > Installation Targets

Installation Target   Config Status   Policy Package Status
FGT-Branch1 [root]    Synchronized    Synchronized
FGT-Branch2 [root]    Synchronized    ?`,
    options: [
      'Never Installed',
      'Imported',
      'Out of Sync',
      'Synchronized',
    ],
    answer: [0],
    explanation: 'The package was assigned to FGT-Branch2 without being the result of an import from that device and has not been installed since, so it shows **Never Installed** (yellow triangle). Imported applies to the device whose configuration created the package. The Installation Targets pane labels an installed, matching package Synchronized (Device Manager calls it Installed).',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-063',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After upgrading FGT-Branch1 to a new FortiOS build, the administrator retrieved its configuration in Device Manager. What does the policy package status mean?',
    exhibit: String.raw`Device Manager > Device & Groups (ADOM: Retail)

Device Name   Config Status   Policy Package Status              Firmware
FGT-Branch1   Synchronized    (gray ?) Unknown (Branch-PP)       v7.6.1
FGT-Branch2   Synchronized    (green check) Installed (Branch-PP) v7.6.0`,
    options: [
      'The device configuration was retrieved after the package was imported or installed, so FortiManager can no longer confirm that the package matches',
      'The last install failed and Branch-PP must be deleted and re-created',
      'Retrieving the configuration unassigned Branch-PP from FGT-Branch1',
      'The FortiOS upgrade deleted the policies on FGT-Branch1',
    ],
    answer: [0],
    explanation: 'Fortinet\'s example for **Unknown** is exactly this: a retrieve after a FortiOS upgrade. Retrieve updates the device database but not the policy package, so the package state is unknown. Re-importing, or reinstalling after checking the Policy Package Diff, brings it back to green. Retrieves do not unassign packages, and the device still shows Branch-PP.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-064',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The administrator wants to keep the changes that were made locally on FGT-HQ-DC. What should the administrator do?',
    exhibit: String.raw`Device Manager > Device & Groups (ADOM: Retail)

Device Name  Config Status  Policy Package Status
FGT-HQ-DC    Conflict       Out of Sync (DC-PP)

Notes: auto-update is disabled (config system admin setting / set auto-update disable).
Since the last install, FortiManager has pending changes for FGT-HQ-DC and a local
admin has also changed settings and firewall policies on the FortiGate. The team has
decided that the local changes are the correct ones.`,
    options: [
      'Retrieve the configuration from FGT-HQ-DC, then re-import the policy with the Import Configuration wizard',
      'Run Install Device Settings (only) to FGT-HQ-DC',
      'Run Re-install Policy for DC-PP',
      'Restore the latest ADOM revision',
    ],
    answer: [0],
    explanation: 'Conflict means both sides changed and the FortiGate change was not auto-synced. To keep the FortiGate\'s version, retrieve its configuration into the device database (Revision History > Retrieve Config) and then re-import the policy so the package matches the device. Install Device Settings (only) and Re-install Policy push FortiManager\'s version and would overwrite the local changes. An ADOM revision restore changes only the ADOM database.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-065',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Branch-PP is also installed on FGT-Branch1, which uses TCP-8443. The administrator completes the import of FGT-Branch2 with the choices shown. What is the effect on FGT-Branch1?',
    exhibit: String.raw`Import Device - FGT-Branch2 [root] - Object Conflicts

Category          Name       FortiGate Value   FortiManager Value   Choice
firewall address  Web-Srv    10.2.20.10/32     10.1.20.10/32        Use FortiManager Value
firewall service  TCP-8443   TCP/8443          TCP/8443-8444        Use FortiGate Value`,
    options: [
      'The ADOM object TCP-8443 becomes TCP/8443, so FGT-Branch1 has a pending change and receives the new value at its next install',
      'Nothing changes for FGT-Branch1, because conflict choices only apply to the device being imported',
      'FGT-Branch1 immediately receives TCP/8443 as part of the import',
      'FGT-Branch1 keeps TCP/8443-8444 because FortiManager creates a per-device mapping for FGT-Branch2 automatically',
    ],
    answer: [0],
    explanation: '**Use FortiGate value** updates the definition of the shared ADOM object. Fortinet documents that this affects every FortiGate that references the object: the updated object is a pending change for them (their package shows Modified), and they receive the new definition at their next install. Import never pushes anything to a FortiGate. Choosing the FortiGate value is not the same as giving FGT-Branch2 its own value; if each branch needs a different value, configure a per-device mapping deliberately.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-066',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'During an import of FGT-Branch2, the administrator chooses Use FortiManager Value for the address Web-Srv (FortiGate 10.2.20.10/32, FortiManager 10.1.20.10/32). What happens at the next install to FGT-Branch2?',
    options: [
      'FGT-Branch2\'s Web-Srv is changed to 10.1.20.10/32',
      'FGT-Branch2 keeps 10.2.20.10/32 permanently because it was the imported value',
      'The install fails with an object conflict until the administrator re-imports',
      'FortiManager renames the FortiGate\'s object to Web-Srv_1',
    ],
    answer: [0],
    explanation: 'Use FortiManager value keeps the ADOM definition, so devices already using it stay synchronized, and the next install pushes the FortiManager definition to FGT-Branch2, overwriting its local value. If FGT-Branch2 really needs 10.2.20.10, add a per-device mapping for it on Web-Srv before installing.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-067',
    topic: '3.4',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about the Import Configuration wizard (Import Policy Package) are true? (Choose two.)',
    options: [
      'Every enabled FortiGate interface requires a per-device or per-platform mapping to a normalized interface',
      'The import does not modify the FortiGate configuration',
      'Disabled interfaces must also be mapped before the wizard continues',
      'Objects identical to existing ADOM objects are imported again with a numeric suffix',
      'Import only policy dependent objects also imports every unused address so it can be deleted later',
    ],
    answer: [0, 1],
    explanation: 'All **enabled** interfaces require a mapping (Per-Device or Per-Platform), and the import only copies from the device database into the ADOM database without touching the FortiGate. Identical duplicates are simply not imported. Import only policy dependent objects brings in only what the imported policies reference; unused objects are left out.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-068',
    topic: '3.4',
    type: 'order',
    difficulty: 2,
    stem: 'Put the pages of the Import Configuration wizard (Import Policy Package) in order.',
    items: [
      'Choose Import Policy Package',
      'Set the package name and folder, policy selection and object selection',
      'Map enabled device interfaces to normalized interfaces',
      'Resolve object conflicts by choosing the FortiGate or FortiManager value',
      'Review the list of objects to be imported and start the import',
      'Review the summary page and optionally download the import report',
    ],
    explanation: 'After choosing Import Policy Package, the wizard asks what to import (package name, folder, Import All or Select Policies, policy dependent or all objects), then the interface map, then object conflicts (View Conflict, Download Conflict File), then lists the objects to be imported, runs the import and ends with a summary and Download Import Report.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-069',
    topic: '3.4',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Branch2 was just imported with Import only policy dependent objects. Why does the preview of its first install contain delete commands?',
    exhibit: String.raw`Install Preview - FGT-Branch2 [root]

config firewall address
    delete "Old-Printer"
    delete "Temp-Contractor"
end
config firewall service custom
    delete "TCP-9999"
end`,
    options: [
      'These objects were not used by any policy, so they were not imported, and FortiManager does not keep unused objects on the device',
      'The import failed for these objects, and FortiManager deletes objects it could not import',
      'The objects had conflicts that were resolved with Use FortiManager value',
      'The policy consistency check marked them as shadowed and removed them',
    ],
    answer: [0],
    explanation: 'With policy dependent objects only, unreferenced objects never reach the ADOM database. The first install after an import can therefore delete them from the FortiGate; Fortinet notes that FortiManager does not need to keep unused objects and that you can bring them back by using them in a policy. Conflict choices change values rather than deleting objects, and the policy check never removes anything.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-070',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'After the first install to a newly imported FortiGate, the administrator notices that the order of policies in the FortiGate configuration changed, although the policy logic is the same. Why?',
    options: [
      'FortiManager groups policies by source and destination interface pair to match the order shown in its GUI; it does not reorder policies within an interface pair',
      'FortiManager sorts policies by policy ID on every install',
      'The policy consistency check moved shadowed policies to the bottom',
      'The FortiGate re-sorted the policies after the FGFM tunnel restarted',
    ],
    answer: [0],
    explanation: 'On the first installation after discovery, FortiManager may reorder configuration elements so policies with the same interface pair are grouped, matching its logical GUI order. It never moves policies within an interface pair, so the match order for any given traffic is unchanged. The policy check only reports, and the FortiGate does not reorder policies itself.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-071',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What does the output show about FGT-Branch2?',
    exhibit: String.raw`FMG-HQ # diagnose dvm device list
--- There are currently 2 devices/vdoms managed ---

TYPE            OID    SN                HA      IP            NAME          ADOM     ...
fmgfaz-managed  167    FGVM02TM24000101  -       10.10.1.1     FGT-Branch1   Retail   ...
               |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: retrieved; conn: up
               |- vdom:[3]root flags:0 adom:Retail pkg:[imported]Branch-PP
fmgfaz-managed  171    FGVM02TM24000102  -       10.10.2.1     FGT-Branch2   Retail   ...
               |- STATUS: dev-db: modified; conf: in sync; cond: pending; dm: retrieved; conn: up
               |- vdom:[3]root flags:0 adom:Retail pkg:[never-installed]Branch-PP
--- End device list ---`,
    options: [
      'Branch-PP is assigned to its root VDOM but has not been installed yet, and its device database has pending changes',
      'FGT-Branch2 is disconnected from FortiManager',
      'Branch-PP was imported from FGT-Branch2 and matches the device',
      'FGT-Branch2\'s configuration was changed locally and not synced to FortiManager',
    ],
    answer: [0],
    explanation: '`pkg:[never-installed]Branch-PP` is the policy package status for VDOM root: assigned, not installed. `dev-db: modified` and `cond: pending` show device-database changes waiting to be installed. `conn: up` shows the tunnel is up, and `conf: in sync` says the latest revision matches the FortiGate, so nothing was changed locally.',
    lesson: '3.4-package-status-import',
  },
  {
    id: 'd3-072',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator edited an address used by Branch-PP, then completed this install successfully. FGT-Branch1 still shows Modified (Branch-PP). Why?',
    exhibit: String.raw`Install Wizard - Step 1
( ) Install Policy Package & Device Settings
(*) Install Device Settings (only)
Comment: weekly push

Step 2 - Devices: FGT-Branch1 [root]
Result: FGT-Branch1  Install  Success`,
    options: [
      'Install Device Settings (only) pushes only the device database; the policy package (and the edited address) was not copied and installed',
      'The install failed silently and must be repeated with Quick Install',
      'Modified is the normal policy package status after any successful install',
      'Object changes can be installed only from the Global Database ADOM',
    ],
    answer: [0],
    explanation: 'Install Device Settings (only) installs the device layer only. The edited address lives in the ADOM database and reaches the FortiGate only when the package is copied into the device database: Install Policy Package & Device Settings or Re-install Policy. After a successful package install the status turns Installed.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-073',
    topic: '3.4',
    type: 'single',
    difficulty: 1,
    stem: 'FGT-Branch3 has just been registered and has no policy package assigned or installed. According to Fortinet, what is the best way to install Branch-PP to it for the first time?',
    options: [
      'The Install Wizard with Install Policy Package & Device Settings',
      'Re-install Policy',
      'Quick Install (Device DB)',
      'Install Device Settings (only)',
    ],
    answer: [0],
    explanation: 'For a first package install, use the Install Wizard with **Install Policy Package & Device Settings**, where you choose the package and devices and can preview. Re-install Policy is for devices that already have a package assigned. Quick Install and Install Device Settings (only) push only the device database.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-074',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. What happens when the administrator clicks Install?',
    exhibit: String.raw`Install Wizard - Validation (Policy Package: Branch-PP)

Device             Policy and Object   Interface   Installation Preparation
FGT-Branch1 [root] Passed              Passed      Passed
FGT-Branch2 [root] Passed              Failed      -
  (summary) interface validation failed: normalized interface DMZ has no mapping for this device`,
    options: [
      'FGT-Branch1 is installed and FGT-Branch2 is skipped',
      'Neither device is installed until every device passes validation',
      'Both devices are installed, and policies using DMZ are skipped on FGT-Branch2',
      'FGT-Branch2 is installed with DMZ mapped to the same interface as on FGT-Branch1',
    ],
    answer: [0],
    explanation: 'Validation covers policy and object, interface, and installation preparation. **Devices with validation errors are skipped**; the rest are installed. FortiManager does not partially install a failing device or borrow another device\'s mapping. Fix the DMZ mapping and install FGT-Branch2 again.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-075',
    topic: '3.4',
    type: 'multi',
    difficulty: 2,
    stem: 'Which three install operations let the administrator open an Install Preview and cancel before anything is sent to the FortiGate? (Choose three.)',
    options: [
      'Install Policy Package & Device Settings',
      'Install Device Settings (only)',
      'Re-install Policy',
      'Quick Install (Device DB)',
      'Retrieve Config',
    ],
    answer: [0, 1, 2],
    explanation: 'The two Install Wizard operations and Re-install Policy all offer Install Preview and can be cancelled without changing anything. **Quick Install (Device DB)** has no preview and cannot be cancelled. Retrieve Config pulls configuration from the FortiGate into FortiManager; it does not install.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-076',
    topic: '3.4',
    type: 'fill',
    difficulty: 1,
    stem: 'A package is already assigned to and installed on FGT-Branch1. After editing a policy, the administrator wants to push the same package again without going through the full Install Wizard. Type the name of the Install menu option.',
    answer: ['Re-install Policy', 'Reinstall Policy', 'Re-install'],
    explanation: '**Re-install Policy** (Install Wizard dropdown in Policy & Objects, or Install > Re-install Policy in Device Manager) reinstalls the assigned package. Its window still offers Install Preview and Policy Package Diff before you install.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-077',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Store-LAN uses the metadata variable store_net, and FGT-Branch2 has a per-device mapping of 10.152.0.0/24. What does the preview confirm?',
    exhibit: String.raw`Install Preview - FGT-Branch2 [root]

config firewall address
    edit "Store-LAN"
        set subnet 10.152.0.0 255.255.255.0
    next
end
config firewall policy
    edit 4
        set name "POS-Out"
        set srcintf "port3"
        set dstintf "wan1"
        set srcaddr "Store-LAN"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "HTTPS"
        set nat enable
    next
end`,
    options: [
      'The variable was resolved to FGT-Branch2\'s mapped value, and only the changed configuration will be sent',
      'The variable failed to resolve, so FortiManager used a literal subnet instead',
      'The preview shows the full Branch-PP package, which will replace all policies on the FortiGate',
      'The preview is FortiGate\'s running configuration, retrieved for comparison',
    ],
    answer: [0],
    explanation: 'Install Preview shows the exact CLI FortiManager will send, with metadata variables displayed as their real values for that device. Because installs send the **diff** between the updated device database and the FortiGate\'s current configuration, only the changes appear, not the whole package. It is not the running configuration.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-078',
    topic: '3.4',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. An administrator adds a policy to Branch-PP that is completely shadowed by an earlier policy, then starts an install. What happens?',
    exhibit: String.raw`System Settings > ADOMs > Edit ADOM: Retail

Default Device Selection for Install:             Select All
Perform Policy Check Before Every Install:        ON
  Action When Conflicts Occur During Policy Check: Stop Installation
Auto-Push Policy Packages When Device Back Online: OFF`,
    options: [
      'The automatic policy check examines the added policy, finds the conflict and the installation stops',
      'The check examines every policy in every package, reports the conflict and continues',
      'FortiManager deletes the shadowed policy and continues',
      'Nothing; the automatic check only runs in workflow mode',
    ],
    answer: [0],
    explanation: 'The install-time policy check covers only added or modified policies, and with **Stop Installation** a detected conflict stops the install (Continue Installation would let it proceed). The check never deletes policies, and it is an ADOM setting that works in any workspace mode.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-079',
    topic: '3.4',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two options are available on the first page of the Install Wizard when Install Policy Package & Device Settings is selected? (Choose two.)',
    options: [
      'Create ADOM Revision',
      'Schedule Install',
      'Import all objects',
      'Add mapping for all unused device interfaces',
      'Use FortiGate value',
    ],
    answer: [0, 1],
    explanation: 'The first page has Policy Package, Comment, **Create ADOM Revision** (name and comments) and **Schedule Install** (date and time). Import all objects, Add mapping for all unused device interfaces and Use FortiGate value belong to the Import Configuration wizard.',
    lesson: '3.4-install-wizard-reinstall',
  },
  {
    id: 'd3-080',
    topic: '3.4',
    type: 'fill',
    difficulty: 3,
    stem: 'An administrator wants to push a changed address object to the devices that use it, using More > Install Object(s), without installing the whole package. Type the `config system global` setting name that must be enabled first.',
    answer: ['partial-install', 'set partial-install enable'],
    explanation: '`set partial-install enable` makes Install Object(s) available. Its Install Preview shows No record found for an object not used in a policy, and the affected packages stay Modified until their next full install.',
    lesson: '3.4-install-wizard-reinstall',
  },
];
