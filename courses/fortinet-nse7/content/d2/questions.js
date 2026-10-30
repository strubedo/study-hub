// Domain 2 — Central management: question bank (FortiManager 7.6, FortiOS 7.6).
// Original exam-style items (not brain-dump material). Options are shuffled by the app.
export default [
  {
    "id": "d2-001",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Spoke2 was unboxed in the staging lab, where it received a FortiManager address from the lab DHCP server, and was then shipped to its branch. The branch DHCP server sends option 240 with 198.51.100.20, but FGT-Spoke2 never connects to FMG-HQ. What must the administrator do?",
    "exhibit": "FGT-Spoke2 # diagnose fdsm fmg-auto-discovery-status\ndhcp: fmg-ip=0.0.0.0, fmg-domain-name='', config-touched=1(/bin/dhcpcd)",
    "options": [
      "Run execute factoryreset on FGT-Spoke2 so that it accepts the FortiManager address from the branch DHCP server.",
      "Change option 240 on the branch DHCP server to type string, because FortiOS reads option 240 only as text.",
      "Enable fgfm-allow-vm on FMG-HQ, because FortiManager rejects units that learned its address from DHCP.",
      "Add option 241 with the same IP address, because FortiOS needs both options before it opens FGFM."
    ],
    "answer": [
      0
    ],
    "explanation": "`config-touched=1(/bin/dhcpcd)` shows that the unit already accepted a FortiManager address from DHCP (in the lab). After that, a FortiGate **ignores different FortiManager values from later DHCP offers** until it is factory-reset, which is why `fmg-ip` now reads 0.0.0.0. Run `execute factoryreset` and let it boot on the branch network.\n\n- Option 240 carries an **IP address** (type ip). Option 241 carries the FQDN as a string.\n- `fgfm-allow-vm` controls whether FortiManager accepts FortiGate-VM serial numbers. It has nothing to do with DHCP discovery.\n- One option is enough. Sending both creates two central management entries; it isn't a requirement.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-002",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A retailer will ship FortiGate units picked from warehouse stock to 120 stores. Nobody records which serial number goes to which store. Each store ISP delivers a static public IP address with no DHCP. A store manager can follow short written instructions on a console cable. Which provisioning approach fits these constraints?",
    "options": [
      "Low-touch provisioning: the manager sets the WAN address and FortiManager address, then links the unit with a per-store pre-shared key.",
      "ZTP through FortiCloud/FortiDeploy, with each model device linked by serial number.",
      "ZTP with DHCP option 240 from the ISP, with each model device linked by serial number.",
      "ZTP with DHCP option 241 from the ISP, with each model device linked by pre-shared key."
    ],
    "answer": [
      0
    ],
    "explanation": "Two constraints decide it. **Unknown serial numbers** rule out serial-number linking, and **pre-shared key linking needs someone at the unit**: they run `execute central-mgmt register-device <FortiManager serial> <key>`, which makes it a low-touch method. **No DHCP** on the WAN rules out FortiCloud/FortiDeploy ZTP (it needs a DHCP-provided internet connection) and both DHCP-option methods.\n\n- FortiCloud/FortiDeploy and DHCP options also authenticate by serial number, which isn't known in advance here.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-003",
    "topic": "2.1",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the auto-link steps in order, from the moment a zero-touch FortiGate reaches FortiManager.",
    "items": [
      "The FortiGate opens the FGFM tunnel and authenticates with its serial number or a pre-shared key.",
      "FortiManager matches the unit to an existing model device.",
      "FortiManager optionally upgrades or downgrades the firmware to the enforced version.",
      "The model device becomes a managed real device and the full configuration is pushed through the tunnel."
    ],
    "explanation": "Every ZTP and LTP method ends in this auto-link sequence: authenticate, match the model device, optional firmware enforcement, then the model becomes the real device and FortiManager pushes device settings, provisioning templates and the policy package. The model device must already exist before the unit calls in.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-004",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. A factory-default FortiGate on the staging network gets a DHCP lease from FGT-Hub but never learns the FortiManager address. FortiManager is reachable at fmg.example.com. What is wrong?",
    "exhibit": "FGT-Hub # show system dhcp server 5\nconfig system dhcp server\n    edit 5\n        set default-gateway 192.0.2.1\n        set netmask 255.255.255.0\n        set interface \"port3\"\n        config ip-range\n            edit 1\n                set start-ip 192.0.2.100\n                set end-ip 192.0.2.199\n            next\n        end\n        config options\n            edit 1\n                set code 240\n                set type string\n                set value \"fmg.example.com\"\n            next\n        end\n    next\nend",
    "options": [
      "An FQDN must be sent with option 241. Option 240 carries the FortiManager IP address.",
      "The options must be sent with code 43 (vendor-specific information), not a custom code.",
      "The FortiGate DHCP server sends custom options only to clients that request them in option 55.",
      "The ip-range is too small: DHCP-based ZTP needs a dedicated /24 per FortiManager."
    ],
    "answer": [
      0
    ],
    "explanation": "Fortinet's ZTP options are **240 = FortiManager IP address** (IP format) and **241 = FortiManager FQDN** (string format). Here an FQDN is sent in option 240 as a string, so the FortiGate doesn't get a usable address. Move the FQDN to code 241 (type string) or put the IP address in code 240 (type ip).\n\n- Code 43 isn't the FortiManager discovery option.\n- Option 55 matters for some third-party servers; the FortiGate DHCP server sends the options to all clients.\n- Pool size has nothing to do with ZTP.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-005",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two conditions must be met for a FortiGate to find FortiManager through DHCP option 240 or 241? (Choose two.)",
    "options": [
      "The FortiGate is in its factory-default configuration when it receives the lease.",
      "A DHCP server you control on the FortiGate's WAN segment is configured to send the option.",
      "The FortiGate is registered in FortiCloud and assigned to the FortiManager.",
      "The FortiGate has a static IP address on the WAN interface so the option can be bound to it.",
      "A USB stick with the FortiManager serial number is inserted before boot.",
      "The FortiManager admin password is configured on the FortiGate before shipping."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "DHCP-based ZTP works only on a **factory-default** unit (change any setting and it stops accepting option 240/241) and needs a **DHCP server you control** that sends the option with the lease, which is why it suits corporate and MPLS sites.\n\n- FortiCloud registration is the FortiCloud/FortiDeploy method; option 240 exists precisely so FortiCloud isn't needed.\n- A static WAN IP means no DHCP at all, and pre-configuring anything (an IP, a password) breaks the factory-default requirement.\n- USB boot is a separate method.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-006",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "A model device is set to Link Device By: Pre-Shared Key. Complete the FortiGate command the branch technician runs, before the arguments: `____ FMG-VMTM26000001 Br-0417-Key`",
    "answer": [
      "execute central-mgmt register-device",
      "exec central-mgmt register-device"
    ],
    "explanation": "`execute central-mgmt register-device <FortiManager serial number> <pre-shared key>` registers the FortiGate to FortiManager with a key. FortiManager matches the key to the model device, authorizes the unit and applies the model's configuration. Give each model device its own key.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-007",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator corrected the policy package in blueprint BR-70G on 20 October. FGT-Spoke1 and FGT-Spoke2 still have Branch-PP. Why?",
    "exhibit": "Device Blueprint: BR-70G\n  Device Model ............... FortiGate-70G\n  Assign Policy Package ...... Branch-PP-v2   (edited 2026-10-20, was Branch-PP)\n\nModel device   Source        Added        Policy Package\nFGT-Spoke1     CSV import    2026-10-14   Branch-PP\nFGT-Spoke2     CSV import    2026-10-14   Branch-PP\nFGT-Spoke3     CSV import    2026-10-22   Branch-PP-v2",
    "options": [
      "Changes to a device blueprint apply only to devices added after the change.",
      "The new policy package is applied only after FGT-Spoke1 and FGT-Spoke2 auto-link to their real devices.",
      "Policy packages assigned from a CSV import override the blueprint and must be changed in the CSV.",
      "FortiManager reapplies blueprints nightly, so the two devices will change at the next scheduled run."
    ],
    "answer": [
      0
    ],
    "explanation": "Blueprint edits **are not retroactive**: they only affect model devices added after the change. FGT-Spoke1 and FGT-Spoke2 were created on 14 October with Branch-PP and keep it; FGT-Spoke3, added after the edit, got Branch-PP-v2. Fix the two existing devices by assigning the new package to them directly.\n\n- Auto-link pushes what the model device already has; it doesn't re-read the blueprint.\n- The CSV has no policy package column: the package comes from the blueprint.\n- There is no nightly reapplication.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-008",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Refer to the exhibit. The administrator tries to import this file with Add Device > Import Model Devices from CSV File. Which change makes the file valid?",
    "exhibit": "Serial Number,Name,branch_id\nFGT70GTK25000123,FGT-Spoke1,1\nFGT70GTK25000456,FGT-Spoke2,2",
    "options": [
      "Add a Device Blueprint column naming a blueprint that matches each unit's platform.",
      "Add a Device Model column, because the platform can't be read from the serial number.",
      "Remove the branch_id column, because metadata variables can't be set from a CSV file.",
      "Add an ADOM column, because each row must name the ADOM it is imported into."
    ],
    "answer": [
      0
    ],
    "explanation": "The required columns are **Serial Number** (or `sn`), **Device Blueprint** and **Name**. The blueprint supplies the model, groups, templates, policy package and firmware settings, so it must match the unit's platform.\n\n- The device model comes from the blueprint; there's no Device Model column.\n- Extra columns named after ADOM metadata variables (such as `branch_id`) are allowed and set per-device values.\n- You select the ADOM before you start the import; it isn't a column.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-009",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The SD-WAN overlay template for the branch group was created with Automatic Branch ID Assignment disabled. What happens to FGT-Spoke4 and FGT-Spoke5 after this import?",
    "exhibit": "Metadata variable: branch_id   Type: Text   Default Value: 0\n\nCSV file:\nSerial Number,Device Blueprint,Name,branch_id\nFGT70GTK25000123,BR-70G,FGT-Spoke1,1\nFGT70GTK25000456,BR-70G,FGT-Spoke2,2\nFGT70GTK25000789,BR-70G,FGT-Spoke3,3\nFGT70GTK25000811,BR-70G,FGT-Spoke4,\nFGT70GTK25000832,BR-70G,FGT-Spoke5,",
    "options": [
      "Both receive the default value 0, so they share a branch ID; each needs a unique value before installing.",
      "FortiManager assigns them branch IDs 4 and 5, the next free values in the group.",
      "The import rejects the two rows because a metadata column can't contain empty cells.",
      "Both devices are skipped by the overlay template until a value is set, so nothing is generated for them."
    ],
    "answer": [
      0
    ],
    "explanation": "A device without a mapped value silently gets the variable's **default**. Both FGT-Spoke4 and FGT-Spoke5 resolve `branch_id` to 0, so they would share a branch ID. The overlay template requires a **unique** `branch_id` per branch, so set unique values (Edit Variable Mapping or a corrected CSV) or enable Automatic Branch ID Assignment.\n\n- FortiManager picks free IDs only when Automatic Branch ID Assignment is enabled.\n- Metadata columns are optional per row; an empty cell isn't an import error.\n- Template assignment comes from the branch device group, not from whether the variable has a value.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-010",
    "topic": "2.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each provisioning method with how the FortiGate learns where FortiManager is.",
    "pairs": [
      [
        "FortiCloud / FortiDeploy",
        "Reaches FortiCloud over a DHCP-provided internet link and learns it from its registration"
      ],
      [
        "DHCP option 240",
        "The local DHCP server sends the FortiManager IP address"
      ],
      [
        "DHCP option 241",
        "The local DHCP server sends the FortiManager FQDN"
      ],
      [
        "USB boot",
        "A minimal initial configuration is read from a stick at first boot"
      ],
      [
        "Low-touch provisioning",
        "A person enters the FortiManager address on the FortiGate"
      ]
    ],
    "explanation": "FortiCloud/FortiDeploy uses FortiCloud registration data; DHCP options 240 (IP) and 241 (FQDN) need a DHCP server you control; USB boot loads a minimal configuration from a stick shipped to the site; LTP means someone configures `config system central-management` (and optionally runs `execute central-mgmt register-device`).",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-011",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A device blueprint includes a pre-run CLI template that sets port5 to a VLAN-capable mode, and a template group whose system template configures VLANs on port5. How does FortiManager use the pre-run CLI template?",
    "options": [
      "It runs once on each new model device, before the provisioning templates, and is then unassigned from the device.",
      "It runs before every install to the device, so the VLAN mode is re-applied each time.",
      "It runs after the provisioning templates, so it can override any value they set.",
      "It runs on the real FortiGate before auto-link, through the FortiCloud connection."
    ],
    "answer": [
      0
    ],
    "explanation": "Pre-run CLI templates are **only for model devices**. They run **once**, **before** the provisioning templates, and FortiManager unassigns them afterwards. That makes them the place for day-zero settings that other templates depend on, as in this case.\n\n- They don't run on every install, and they don't run after the provisioning templates.\n- They're applied to the model device in FortiManager, not over FortiCloud.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-012",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Which ZTP method should the architect choose for site type B?",
    "exhibit": "Branch survey (all units are new, factory-default hardware FortiGates;\nserial numbers are recorded at the warehouse)\n\nSite type  WAN                         Internet at branch  Branch DHCP\nA          Broadband, DHCP from ISP    Yes                 ISP router\nB          MPLS only                   No (via DC)         Customer-managed CE router\nC          Fibre, static IP from ISP   Yes                 None",
    "options": [
      "ZTP with DHCP option 240 or 241 sent by the customer-managed CE router.",
      "ZTP through FortiCloud/FortiDeploy, because serial numbers are known.",
      "Low-touch provisioning with pre-shared keys, because MPLS sites can't use ZTP.",
      "USB boot, because it is the only method that works without a WAN DHCP server."
    ],
    "answer": [
      0
    ],
    "explanation": "Site B has **no internet** at the branch, so the unit can't reach FortiCloud, but the customer controls the CE router's DHCP server. DHCP option 240 (IP) or 241 (FQDN) needs no FortiCloud and suits closed networks under your control.\n\n- FortiCloud/FortiDeploy fits site A (internet plus ISP DHCP), not B.\n- MPLS sites can use ZTP through DHCP options; LTP isn't required.\n- USB boot doesn't need DHCP, but the CE router's DHCP already works here, and USB means shipping a stick to every site. It's an option for site C, not the best choice for B.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-013",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which DHCP option code carries the FortiManager FQDN for zero-touch provisioning?",
    "answer": [
      "241",
      "option 241",
      "code 241"
    ],
    "explanation": "Option **241** carries the FortiManager FQDN (string format, hex-encoded in the packet). Option 240 carries the FortiManager IP address.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-014",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The real FGT-Spoke6 with this serial number connects to FMG-HQ. What happens?",
    "exhibit": "Add Model Device: FGT-Spoke6\n  Link Device By ......................... Serial Number  FGT70GTK25000901\n  Device Model ........................... FortiGate-70G\n  Automatically Link to Real Device ...... Off\n  Enforce Firmware Version ............... On (7.6.x)\n  Add to Device Group .................... Branches-DIA\n  Assign Policy Package .................. Branch-PP",
    "options": [
      "FortiManager doesn't link it automatically; an administrator has to act before the model configuration is pushed.",
      "FortiManager links and authorizes it at once, because a serial number match is always automatic.",
      "FortiManager rejects the connection, because a model device with auto-link off accepts only pre-shared keys.",
      "FortiManager links it but pushes only the firmware, because the configuration needs auto-link."
    ],
    "answer": [
      0
    ],
    "explanation": "**Automatically Link to Real Device** is what turns a serial number match into true zero-touch: with it enabled, FortiManager links and authorizes the unit automatically and pushes the model's configuration. With it off, the unit still needs an administrator before anything is pushed.\n\n- A serial number match isn't automatic by itself.\n- Auto-link has nothing to do with the link method (serial number or pre-shared key).\n- Firmware enforcement is part of linking, not a separate step that runs without it.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-015",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two settings can a FortiManager device blueprint apply to every model device created from it? (Choose two.)",
    "options": [
      "A pre-run CLI template",
      "A provisioning template group",
      "A unique branch_id value for each device",
      "The serial number of each device",
      "The SD-WAN rules of the overlay template"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "A blueprint holds what devices of one platform **share**: auto-link, firmware enforcement, device groups, folder, Fabric authorization template, **pre-run CLI template**, policy package, **provisioning templates or a template group**, and HA settings.\n\n- Per-device values (serial number, name, `branch_id`) come from the model device or the CSV row.\n- The overlay template creates no SD-WAN rules; rules come from an SD-WAN template.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-016",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The import of the HA rows doesn't produce a model HA cluster. What must the administrator change?",
    "exhibit": "Device Blueprint: BR-HA-100F\n  Device Model ......... FortiGate-100F\n  HA ................... Disabled\n\nCSV file:\nSerial Number,Device Blueprint,Name,Cluster Id,Cluster Name,Priority,HA Mode\nFG100FTK25000101,BR-HA-100F,FGT-A,100,SPOKE9-HA,200,AP\nFG100FTK25000102,BR-HA-100F,FGT-B,100,SPOKE9-HA,100,AP",
    "options": [
      "Enable and configure HA (heartbeat interfaces, monitor interfaces, password) in the blueprint.",
      "Change HA Mode to active-passive, because AP isn't a valid value.",
      "Give the two rows different Cluster Id values, one per member.",
      "Remove the Priority column, because FortiManager elects the primary itself."
    ],
    "answer": [
      0
    ],
    "explanation": "HA rows need the four HA columns **and** a blueprint with **HA enabled and configured** (heartbeat and monitor interfaces, cluster password). Here the blueprint has HA disabled.\n\n- `AP` and `AA` are the documented values for HA Mode.\n- Both members of one cluster share the Cluster Id and Cluster Name.\n- Priority is required for HA rows; the higher-priority unit becomes the primary.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-017",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Sites in a closed network can't reach FortiCloud and the local DHCP servers can't be changed, so the architect chooses USB-boot ZTP. What should the initial configuration on the USB stick contain?",
    "options": [
      "Only what the unit needs to reach FortiManager, because the model device configuration overwrites the rest after auto-link.",
      "The complete branch configuration, so the branch works even if FortiManager is unreachable.",
      "The SD-WAN overlay template, so FortiManager can skip pushing the IPsec templates.",
      "The FortiManager admin password, so the FortiGate can log in to FortiManager."
    ],
    "answer": [
      0
    ],
    "explanation": "Keep the USB configuration to the **minimum needed to reach FortiManager** (WAN addressing and the FortiManager location). When auto-link completes, the model device configuration overwrites anything else. The stick can also carry the target firmware, which can be faster than a download over the branch link.\n\n- A full configuration on the stick is overwritten anyway and doubles the maintenance.\n- Overlay templates live in FortiManager; there's nothing to skip.\n- FGFM doesn't log in with a FortiManager admin password.",
    "lesson": "2.1-ztp-basics"
  },
  {
    "id": "d2-018",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An SD-WAN overlay template is assigned to branch device group Branches-DIA. The architect wants every zero-touch branch to receive the overlay branch templates without anyone assigning them. Which blueprint setting achieves this?",
    "options": [
      "Add to Device Group set to Branches-DIA.",
      "Add to Folder set to Branches-DIA.",
      "Provisioning Template set to the SD-WAN overlay template.",
      "Fabric Authorization Template set to the overlay template's hub."
    ],
    "answer": [
      0
    ],
    "explanation": "The overlay template assigns its branch template group to the members of its **branch device group**. A device that joins that group gets the branch provisioning templates **automatically**, so the blueprint only needs **Add to Device Group** = Branches-DIA.\n\n- Folders are for display only; they aren't template targets.\n- The overlay template isn't selected as a provisioning template; it generates templates and template groups and assigns them by device group.\n- Fabric authorization templates authorize downstream Fabric devices such as FortiSwitch and FortiAP.",
    "lesson": "2.1-blueprints-csv"
  },
  {
    "id": "d2-019",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. After the install, both overlays are up on every branch and BGP is established with FGT-Hub, but branch traffic to the data centre is distributed only by the implicit SD-WAN rule. What must the administrator do?",
    "exhibit": "SD-WAN Manager > Overlay Orchestration > EU-Overlay (summary)\nTopology ............................ Single HUB\nHUB ................................. FGT-Hub   WAN underlay port1, port2\nBranch device group ................. Branches-EU (FGT-Spoke1, FGT-Spoke2)\nBGP on Loopback ..................... Enabled   BGP-AS 65000\nAuto-Discovery VPN .................. Disabled\nAdd Overlay Objects to SD-WAN Template  Off\nAdd Healthcheck Servers ............. Off",
    "options": [
      "Create an SD-WAN template with the overlay zones, members, performance SLAs and SD-WAN rules, assign it to the branches and install it.",
      "Edit the overlay template and change Auto-Discovery VPN to ADVPN 2.0, which adds the SD-WAN rules.",
      "Change BGP on Loopback to BGP per overlay, because SD-WAN rules can't use routes learned on loopbacks.",
      "Set a unique branch_id on each branch, because the overlay rules are generated only for branches with an ID."
    ],
    "answer": [
      0
    ],
    "explanation": "The overlay template builds IPsec, BGP and CLI templates; it **does not provide SD-WAN intelligence**. SD-WAN rules come from an **SD-WAN template**. With *Add Overlay Objects to SD-WAN Template* off, not even the zones and members were added to one. Build the SD-WAN template (zones, members, SLAs, rules), assign it, and install.\n\n- ADVPN builds branch-to-branch shortcuts; it doesn't create SD-WAN rules.\n- SD-WAN rules work with BGP on loopback; that's Fortinet's recommended design.\n- `branch_id` affects the generated tunnels and routing, not SD-WAN rules (which don't exist here).",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-020",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two items does the FortiManager SD-WAN overlay template wizard create? (Choose two.)",
    "options": [
      "IPsec tunnel templates for the hubs and the branches",
      "Template groups, assigned automatically to the selected hubs and the branch device group",
      "SD-WAN rules that steer application traffic to the overlays",
      "The branch device group that the branches are placed in",
      "The ISP interface addressing on the hub and branch underlays",
      "Firewall policies for user traffic between branches and the data centre"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "The wizard generates **IPsec, BGP and CLI provisioning templates**, groups them into **template groups** per hub and for the branches, and **assigns them automatically**; it also creates the `branch_id` variable.\n\n- SD-WAN rules come from a separate SD-WAN template.\n- The branch device group and the ISP links are **prerequisites**, not outputs.\n- The optional policy feature adds only health-check policies; user-traffic policies are yours to build in the policy package.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-021",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which ADOM metadata variable does the SD-WAN overlay template create, which must hold a unique value for every branch unless automatic assignment is enabled?",
    "answer": [
      "branch_id",
      "$(branch_id)"
    ],
    "explanation": "The overlay template creates **`branch_id`**. Each branch needs a unique value, set per device (Edit Variable Mapping, or a CSV column during model device import) or by enabling **Automatic Branch ID Assignment** in the wizard.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-022",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The SD-WAN template assigned to all three branches sets the port1 member gateway to $(wan1_gw). Which gateway does FortiManager install on FGT-Spoke3?",
    "exhibit": "Metadata Variables (ADOM: SDWAN-EU)\nName        Type   Default Value    Per-Device Mapping\nwan1_gw     Text   192.0.2.1        FGT-Spoke1 = 198.51.100.1\n                                    FGT-Spoke2 = 203.0.113.1\nbranch_id   Text   0                FGT-Spoke1 = 1\n                                    FGT-Spoke2 = 2\n                                    FGT-Spoke3 = 3",
    "options": [
      "192.0.2.1",
      "None: the install fails because FGT-Spoke3 has no mapping for wan1_gw.",
      "203.0.113.1, the last mapped value",
      "The gateway currently configured on FGT-Spoke3, because unmapped variables keep the device value"
    ],
    "answer": [
      0
    ],
    "explanation": "FortiManager resolves a metadata variable per device: the device's mapped value if there is one, otherwise the **default value**. FGT-Spoke3 has a `branch_id` mapping but none for `wan1_gw`, so it gets **192.0.2.1**. A missing mapping never raises an error, which is why defaults must be chosen carefully and checked in Install Preview.\n\n- There's no last-value inheritance, and an unmapped variable doesn't keep the device's own setting.",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-023",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. On FortiManager 7.6.1, FGT-Spoke3 doesn't appear in the device list when the administrator assigns SD-WAN template Branch-SDWAN. What should the administrator do?",
    "exhibit": "Device Manager > Device & Groups (Table View)\nDevice Name   Config Status   Managed by SD-WAN Manager   Provisioning Templates\nFGT-Spoke1    Synchronized    Yes                         BRANCH\nFGT-Spoke2    Synchronized    Yes                         BRANCH\nFGT-Spoke3    Synchronized    No                          BRANCH",
    "options": [
      "Select FGT-Spoke3 in Device Manager and use More > Enable SD-WAN Management.",
      "Remove FGT-Spoke3 from the BRANCH template group, because a device with a template group can't take an SD-WAN template.",
      "Upgrade FortiManager to 7.6.3, because 7.6.1 can't assign SD-WAN templates to devices.",
      "Re-import FGT-Spoke3's policy package, because SD-WAN templates are offered only to devices with an installed package."
    ],
    "answer": [
      0
    ],
    "explanation": "In FortiManager 7.6 a device appears in **SD-WAN Manager**, and can take SD-WAN templates, only when **SD-WAN management is enabled** for it (the *Managed by SD-WAN Manager* column). Enable it with **More > Enable SD-WAN Management** (or at model device creation with *Managed by SD-WAN Manager*).\n\n- Template groups and SD-WAN templates coexist; the overlay branch group is normal alongside an SD-WAN template.\n- 7.6.1 assigns SD-WAN templates from SD-WAN Manager > Rules to devices with SD-WAN management enabled. 7.6.3 also lets SD-WAN templates be applied to devices without it, but upgrading isn't required: enabling SD-WAN management fixes this on 7.6.1.\n- Policy package status doesn't control SD-WAN template assignment.",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-024",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator wants to add the normalized interface VPN1 (created by the overlay wizard) as a member of zone HUB1 in a hand-built SD-WAN template, so that the template works on branches with different tunnel names. What does FortiManager 7.6 support?",
    "options": [
      "Normalized interfaces aren't supported as SD-WAN template members; members are bound by name to the physical or VPN interface.",
      "Normalized interfaces are supported as members if they have a per-platform mapping instead of a per-device mapping.",
      "Normalized interfaces are supported only for VPN members, not physical members.",
      "Normalized interfaces are supported if the SD-WAN template is in a template group with the IPsec template."
    ],
    "answer": [
      0
    ],
    "explanation": "The FortiManager 7.6 docs state that **normalized interfaces aren't supported for SD-WAN templates**: interface members are typed by name (physical or VPN interface). The practical answer is to keep tunnel names identical on all branches, which the IPsec templates and the overlay template do (`HUB1-VPN1`, `HUB1-VPN2`). Member and gateway fields do accept metadata variables.\n\nNormalized interfaces remain useful in policy packages.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-025",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Which subnet does the overlay template assign to HUB2_VPN1?",
    "exhibit": "Overlay template: DC-Overlay\nTopology ............... Dual HUB (Primary/Secondary)\nOverlay Network ........ 10.10.0.0/255.255.0.0 (default)\nHUB1 WAN underlay ...... port1, port2\nHUB2 WAN underlay ...... port1, port2\nBranch WAN underlay .... port1, port2",
    "options": [
      "10.10.128.0/19",
      "10.10.64.0/19",
      "10.10.64.0/18",
      "10.10.96.0/19"
    ],
    "answer": [
      0
    ],
    "explanation": "A dual-hub overlay gets **at least eight** subnets, so the default /16 is cut into **/19s**. HUB1 takes the first half and HUB2 the second half: HUB1_VPN1 10.10.0.0/19, HUB1_VPN2 10.10.32.0/19, **HUB2_VPN1 10.10.128.0/19**, HUB2_VPN2 10.10.160.0/19; the other four /19s stay idle.\n\n- 10.10.64.0/19 and 10.10.96.0/19 are idle subnets in HUB1's half.\n- /18 subnets are used for single-hub designs with up to four underlays.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-026",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Why does FGT-Hub get Local AS 65000 at the last install?",
    "exhibit": "Change log (ADOM SDWAN-EU)\n10:05  admin1  BGP template HUB1_BGP    Local AS 65000 -> 65010\n10:20  admin1  Install HUB1 group to FGT-Hub   (Local AS 65010 installed)\n14:40  admin2  Overlay template EU-Overlay: added branch underlay port3, Save\n14:55  admin2  Install HUB1 group to FGT-Hub   (Local AS 65000 installed)",
    "options": [
      "Saving the overlay template regenerated HUB1_BGP and overwrote the fields the overlay manages, including the AS.",
      "Install of a template group always restores the template defaults, so manual changes last until the next install.",
      "FortiManager rejected AS 65010 because the overlay template supports only AS 65000.",
      "admin2's install used a cached revision of HUB1_BGP from before 10:05."
    ],
    "answer": [
      0
    ],
    "explanation": "You may edit the templates the overlay generated, but the next **save of the overlay template regenerates them** and overwrites any field the overlay manages. The Local AS is one of them, so it went back to the overlay's BGP-AS (65000). Change the AS in the overlay template (Region Settings > Advanced > BGP-AS Number) instead. Fields the overlay doesn't set, such as descriptions, survive.\n\n- Installs push what is in the templates; they don't reset them.\n- 65000 is only the default; the wizard accepts another AS.\n- There's no cached-revision behaviour like this.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-027",
    "topic": "2.2",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the steps of a new SD-WAN overlay deployment with FortiManager in order.",
    "items": [
      "Add the hub and branch FortiGates, configure the ISP links and create the branch device group.",
      "Run the SD-WAN overlay template wizard in SD-WAN Manager > Overlay Orchestration.",
      "Give each branch a unique branch_id (or rely on Automatic Branch ID Assignment).",
      "Create or edit an SD-WAN template that uses the overlays and contains the SD-WAN rules.",
      "Create the policy packages for the hubs and branches.",
      "Install the changes with the Install Wizard."
    ],
    "explanation": "This is the documented workflow: prerequisites (devices, ISP links, device groups, underlay reachability), the overlay wizard, `branch_id` values, an SD-WAN template for the rules (the overlay template has no SD-WAN intelligence), policy packages, then the install.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-028",
    "topic": "2.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each SD-WAN overlay template option with its effect.",
    "pairs": [
      [
        "BGP on Loopback",
        "One BGP session from each branch to each hub, whatever the number of overlays"
      ],
      [
        "Dynamic BGP",
        "Spokes form BGP sessions dynamically over ADVPN, so hub route reflection becomes optional"
      ],
      [
        "Segmentation Over Single Overlay",
        "VRF segmentation over one set of tunnels using BGP VPNv4"
      ],
      [
        "Auto-Discovery VPN: ADVPN 2.0",
        "Spokes choose the underlay for shortcuts based on link health"
      ],
      [
        "Private Link (WAN underlay)",
        "No overlay is built on that underlay"
      ]
    ],
    "explanation": "BGP on Loopback reduces BGP sessions and advertised routes; Dynamic BGP lets ADVPN spokes peer directly and reveals the Route Reflection toggle; Segmentation Over Single Overlay generates VRF, VPNv4 and PE/CE BGP with `vpn-id-ipip` tunnels; ADVPN 2.0 adds health-based shortcut path selection; a Private Link underlay gets no overlay (with ADVPN 2.0 it defaults to transport group 1).",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-029",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An architect compares Dual HUB (Primary/Secondary) and Dual HUB (Primary/Primary) in the overlay template wizard. What is the difference between them?",
    "options": [
      "Primary/Secondary gives the secondary hub a higher cost, so SD-WAN rules prefer the primary hub.",
      "Primary/Secondary builds tunnels to the secondary hub only after the primary hub fails.",
      "Primary/Primary requires ADVPN 2.0, while Primary/Secondary supports only legacy ADVPN.",
      "Primary/Primary uses eBGP between the hubs, while Primary/Secondary uses iBGP."
    ],
    "answer": [
      0
    ],
    "explanation": "The only difference is **cost**: with Primary/Secondary, the secondary hub's members get a higher cost, so SD-WAN rules prefer the primary. Tunnels to both hubs are built in both topologies, and the BGP and ADVPN options are the same.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-030",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The template is assigned to device group Branches and installed. Which statement is true?",
    "exhibit": "IPsec Tunnel template: BR-Simple-VPN\nTunnel Name ......... HQ-VPN\nRouting ............. Automatic\nRemote Device ....... IP Address   Remote Gateway 198.51.100.10\nOutgoing Interface .. wan1\nRemote Subnet ....... 10.20.0.0/255.255.0.0\n                      10.30.0.0/255.255.0.0\nAuthentication ...... Pre-shared Key",
    "options": [
      "Every branch gets static routes to 10.20.0.0/16 and 10.30.0.0/16 through HQ-VPN.",
      "Every branch advertises 10.20.0.0/16 and 10.30.0.0/16 to the hub with BGP.",
      "The hub gets static routes to every branch LAN, built from the branches' interface addresses.",
      "No routes are created until a BGP template is added to the same template group."
    ],
    "answer": [
      0
    ],
    "explanation": "**Routing: Automatic** (IPsec template autorouting) creates **static routes to the listed remote subnets** over the tunnel on each assigned device. That's why the Remote Subnet field exists only with Automatic routing.\n\n- Autorouting doesn't run BGP.\n- This template is for the branches; it says nothing about routes on the hub.\n- With **Manual** routing no routes are created and you'd add a BGP or static route template.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-031",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which recommended IPsec template did the administrator activate?",
    "exhibit": "Activate recommended template\n  Template Name ........ Branch-ISP1\n  Outgoing Interface ... port1\n  Local ID ............. $(branch_id)-ISP1\n  Remote Gateway ....... 198.51.100.10\n  Pre-shared Key ....... ********\n  ADVPN ................ Enabled",
    "options": [
      "Branch_IPSec_Recommended",
      "HUB_IPSec_Recommended",
      "IPSec_Fortinet_Recommended",
      "HUB_BGP_Recommended"
    ],
    "answer": [
      0
    ],
    "explanation": "**Branch_IPSec_Recommended** asks for a **Local ID** (so the hub can tell the branch's tunnels apart) and the **remote gateway** (the hub), plus outgoing interface, pre-shared key and an optional ADVPN toggle.\n\n- HUB_IPSec_Recommended assumes dial-up spokes and asks for the IPv4 start/end range and netmask, with no remote gateway.\n- IPSec_Fortinet_Recommended makes no role assumption and has no Local ID field.\n- HUB_BGP_Recommended is a BGP template, not an IPsec template.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-032",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator activates HUB_IPSec_Recommended. Which two fields does the activation ask for? (Choose two.)",
    "options": [
      "IPv4 start and end IP of the range handed to the dial-up spokes",
      "Outgoing interface that the branches connect to",
      "Remote gateway IP address of the branch",
      "Local ID of each branch",
      "BGP AS number of the hub"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "HUB_IPSec_Recommended assumes **dial-up** spokes (Remote Device: Dynamic). It asks for the template name, **outgoing interface**, **IPv4 start IP, end IP** and netmask for the spokes, the pre-shared key and an optional ADVPN toggle.\n\n- A dial-up hub has no remote gateway; the remote gateway and Local ID belong to the branch template.\n- The BGP AS belongs to the BGP templates or the overlay template, not the IPsec template.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-033",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "A company runs 300 branches with two internet links each and wants hub-and-spoke overlays that are SD-WAN members, BGP routing and ADVPN shortcuts, all managed from FortiManager. Which FortiManager approach fits best?",
    "options": [
      "The SD-WAN overlay template, which generates IPsec, BGP and CLI templates per hub and branch.",
      "A VPN Manager Star community with the data centre FortiGate as the hub.",
      "A VPN Manager Full Meshed community, so that every branch has a tunnel to every other branch.",
      "One IPsec template per branch with Routing: Automatic and the other branches' LANs as remote subnets."
    ],
    "answer": [
      0
    ],
    "explanation": "The **overlay template** builds Fortinet's recommended SD-WAN overlay: named tunnels per underlay that become SD-WAN members, BGP (optionally on loopback) and ADVPN (legacy or 2.0), assigned by device group.\n\n- VPN Manager communities (Star, Full Meshed, Dial up) are the classic site-to-site path, not the SD-WAN overlay path, and a full mesh of 300 sites means about 45,000 tunnels.\n- Per-branch templates with static autorouting don't scale and can't follow ADVPN shortcuts or link failures.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-034",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The tunnels come up on every branch, but the branches have no routes to the data centre networks. What is missing?",
    "exhibit": "Template group: BR-Custom          (assigned to device group Branches)\n  IPsec Tunnel ...... BR-IPsec\n        HUB1-VPN1  Routing Manual  Remote Gateway 198.51.100.10\n        HUB1-VPN2  Routing Manual  Remote Gateway 198.51.100.11\n  SD-WAN ............ Branch-SDWAN\n  CLI ............... BR-Banner\n  BGP ............... -\n  Static Route ...... -",
    "options": [
      "A BGP template (or static route template) in the group, because Manual routing creates no routes.",
      "Routing: Automatic on the hub template, because the hub must push routes to dial-up branches.",
      "A second SD-WAN template for the data centre routes, because one SD-WAN template carries only rules.",
      "Network Overlay IDs on both tunnels, because tunnels without an ID carry no routes."
    ],
    "answer": [
      0
    ],
    "explanation": "With **Routing: Manual**, the IPsec template creates **no routes**. Routing has to come from another template: a **BGP template** (the SD-WAN design) or a static route template, added to the group's empty BGP or Static Route slot.\n\n- A hub template's autorouting doesn't create routes on the branches.\n- A template group holds one template per type, and SD-WAN templates don't carry the routes here anyway.\n- The network overlay ID separates tunnels between the same pair of IPs; it doesn't create routes.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-035",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator can't add IPsec template MPLS-IPsec to template group BR-Custom. Why?",
    "exhibit": "Template group: BR-Custom\n  IPsec Tunnel ...... BR-IPsec\n  BGP ............... BR-BGP\n  SD-WAN ............ Branch-SDWAN\n  CLI ............... BR-Banner\n\nAttempt: add IPsec Tunnel template \"MPLS-IPsec\" to BR-Custom",
    "options": [
      "A template group can contain only one template of each type, and it already has an IPsec template.",
      "IPsec templates for private links must be in a CLI template group instead.",
      "A template group can't contain both an IPsec template and an SD-WAN template.",
      "Templates can be added to a group only before the group is assigned to devices."
    ],
    "answer": [
      0
    ],
    "explanation": "A template group holds **one template per type** (one IPsec, one BGP, one SD-WAN, one CLI and so on). BR-Custom already has BR-IPsec, so a second IPsec template can't be added. Add the MPLS tunnel to BR-IPsec (an IPsec template can define several tunnels) or use a different group.\n\n- IPsec and SD-WAN templates are normally grouped together; the overlay template's own groups do the same with IPsec, BGP and CLI.\n- Assigned groups can be edited and reinstalled.",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-036",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The design must reach 9,000 branches within three years. What should the architect do before onboarding the first branch?",
    "exhibit": "Overlay design draft\nTopology ............... Dual HUB (Primary/Secondary)\nUnderlays .............. HUB1: port1, port2   HUB2: port1, port2\nBranch underlays ....... port1 (internet), port2 (internet)\nOverlay Network ........ 10.10.0.0/255.255.0.0\nAutomatic Branch ID .... Enabled",
    "options": [
      "Enter a larger Overlay Network, because each /19 overlay subnet from 10.10.0.0/16 holds only 8,190 FortiGates.",
      "Change the topology to Multi HUB, because more hubs give each overlay more addresses.",
      "Disable Automatic Branch ID Assignment, because manual IDs aren't limited by the overlay subnet.",
      "Nothing: automatic branch IDs are taken from the loopback range, which holds 65,534 addresses."
    ],
    "answer": [
      0
    ],
    "explanation": "A dual-hub overlay splits the overlay network into at least eight subnets, so the default 10.10.0.0/16 gives **/19 overlays with 8,190 usable addresses** each. Every FortiGate on an overlay needs an address, and automatic branch IDs are limited the same way. 9,000 branches don't fit, and changing the overlay network later changes every subnet, so choose a bigger range (for example from 10.0.0.0/8) **before** onboarding.\n\n- Multi HUB splits the range into more, **smaller** subnets (/20, 4,094 addresses each).\n- Manual IDs don't add addresses to the overlay subnets.\n- The overlay subnet, not the loopback range, is the documented limit.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-037",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An architect wants ADVPN spokes to exchange routes directly over shortcuts so the hubs don't have to reflect every branch route. Which overlay template setting provides this?",
    "options": [
      "Dynamic BGP, and then disable Route Reflection",
      "BGP on Loopback with Route Reflection enabled",
      "Segmentation Over Single Overlay",
      "Dual HUB (Primary/Primary)"
    ],
    "answer": [
      0
    ],
    "explanation": "**Dynamic BGP** lets ADVPN spokes form BGP sessions dynamically, which makes route reflection on the hub **optional**; enabling it reveals the **Route Reflection** toggle.\n\n- BGP on Loopback reduces sessions per branch, but with route reflection the hub still reflects branch routes.\n- Segmentation Over Single Overlay is about VRFs.\n- Primary/Primary only sets equal hub costs.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-038",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default BGP AS number in the FortiManager SD-WAN overlay template?",
    "answer": [
      "65000",
      "AS 65000",
      "AS65000"
    ],
    "explanation": "The wizard's Region Settings > Advanced defaults are BGP-AS **65000**, loopbacks 172.16.0.0/16 and overlays 10.10.0.0/16.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-039",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default Overlay Network in the FortiManager SD-WAN overlay template? (Answer as prefix/length.)",
    "answer": [
      "10.10.0.0/16",
      "10.10.0.0 255.255.0.0",
      "10.10.0.0/255.255.0.0"
    ],
    "explanation": "The default overlay network is **10.10.0.0/16** (shown as 10.10.0.0/255.255.0.0). The default loopback range is 172.16.0.0/16.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-040",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The branch IPsec template sets Local ID to $(branch_id)-VPN1 so that every branch presents its own Local ID, but Install Preview shows the same Local ID for FGT-Spoke4 and FGT-Spoke5. What is the cause?",
    "exhibit": "Install Preview - FGT-Spoke4\nconfig vpn ipsec phase1-interface\n    edit \"HUB1-VPN1\"\n        set interface \"port1\"\n        set localid \"0-VPN1\"\n        set remote-gw 198.51.100.10\n    next\nend\n\nInstall Preview - FGT-Spoke5\nconfig vpn ipsec phase1-interface\n    edit \"HUB1-VPN1\"\n        set interface \"port1\"\n        set localid \"0-VPN1\"\n        set remote-gw 198.51.100.10\n    next\nend",
    "options": [
      "Neither branch has a branch_id mapping, so both use the default 0 and present the same Local ID.",
      "The Local ID field doesn't accept metadata variables, so FortiManager inserted a placeholder.",
      "FortiManager evaluates $(branch_id) only in Jinja templates, so the value was not substituted.",
      "Install Preview shows template values before metadata variables are resolved, so the installed Local IDs will differ."
    ],
    "answer": [
      0
    ],
    "explanation": "Install Preview shows the **resolved** values: both devices got `0-VPN1`, because `0` is the default of `branch_id` and neither device has its own mapping. A device without a mapping silently gets the default. Map unique `branch_id` values (or enable Automatic Branch ID Assignment) and check the preview again before installing.\n\n- The Local ID field accepts metadata variables (the docs use it as the example of a field made unique this way), and the value was substituted, just with the default.\n- `$(var)` substitution works in IPsec templates; `{{ }}` is the Jinja form.\n- Install Preview shows the CLI with variables already resolved; that's what makes it useful for checking mappings.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-041",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about port2 is true?",
    "exhibit": "Overlay template: EU-Overlay   Auto-Discovery VPN: ADVPN 2.0\nNetwork Configuration > Branch (device group Branches-EU)\nWAN Underlay   Private Link   Cost   Transport Group\nport1          Off            0      0\nport2          On             0      1",
    "options": [
      "No overlay tunnels are built on port2, and its transport group defaults to 1 because it is a private link.",
      "An overlay is built on port2 but excluded from BGP, because private links carry only health checks.",
      "port2 is used only when port1 fails, because private links have a higher cost.",
      "Transport group 1 makes port2 the preferred path for ADVPN shortcuts."
    ],
    "answer": [
      0
    ],
    "explanation": "**Private Link** means **no overlay is created** on that underlay. With ADVPN 2.0, the Transport Group field appears and defaults to 0, or **1 for a private link**, which is what the exhibit shows.\n\n- There's no overlay on port2 to exclude from BGP.\n- Both costs are 0 here, and Private Link doesn't change the cost.\n- A transport group groups links for ADVPN 2.0 path matching; it doesn't make a link preferred.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-042",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which two statements are true? (Choose two.)",
    "exhibit": "SD-WAN template: Branch-SDWAN     Assigned to: Branches-DIA\nInterface Members\n  Zone   Member      Gateway        Status\n  WAN1   port1       $(wan1_gw)     Enabled\n  WAN2   port2       $(wan2_gw)     Enabled\n  HUB1   HUB1-VPN1   -              Enabled\n  HUB1   HUB1-VPN2   -              Enabled\nPerformance SLA\n  HUB1_HC   Server 172.16.255.253   Members HUB1-VPN1, HUB1-VPN2\nSD-WAN Rules\n  1  Corp   Destination Corp-Nets   Lowest Cost (SLA)   SLA HUB1_HC   HUB1-VPN1, HUB1-VPN2",
    "options": [
      "Each branch can receive a different WAN1 gateway through the wan1_gw metadata variable.",
      "Policy packages must use zone HUB1, not HUB1-VPN1 or HUB1-VPN2, as source or destination interface.",
      "HUB1-VPN1 and HUB1-VPN2 can be normalized interfaces, mapped per device to each branch's tunnel names.",
      "The template creates the HUB1-VPN1 and HUB1-VPN2 tunnels if they don't exist on a branch.",
      "Rule 1 sends traffic to the member with the lowest latency, whatever its SLA state."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "SD-WAN template **member and gateway fields accept metadata variables**, so `$(wan1_gw)` resolves per branch. Firewall policies can use **SD-WAN zones** but not individual zone members.\n\n- Normalized interfaces aren't supported as SD-WAN template members; members are bound by name.\n- SD-WAN templates don't create tunnels; the IPsec (or overlay) templates do.\n- Lowest Cost (SLA) picks the lowest-cost member that **meets** the SLA; picking by best latency is Best Quality.",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-043",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An estate already runs SD-WAN configured locally on each FortiGate. The architect wants a FortiManager SD-WAN template that starts from the configuration of a representative branch. What does FortiManager 7.6 offer?",
    "options": [
      "Import in SD-WAN Manager > Rules, which creates an SD-WAN template from a chosen FortiGate and prefixes its name with Import.",
      "The overlay template wizard, which reads the existing SD-WAN rules from the branch device group.",
      "Retrieve Config on the device, which converts its SD-WAN section into an SD-WAN template automatically.",
      "Export Templates on the FortiGate GUI, followed by Import Templates in FortiManager."
    ],
    "answer": [
      0
    ],
    "explanation": "**Import** (in SD-WAN Manager > Rules) asks for a name, the source FortiGate and an optional description, creates the template from that device's SD-WAN configuration, and prefixes the name with *Import*. Generalize it afterwards with metadata variables.\n\n- The overlay wizard builds new overlays; it doesn't read existing rules.\n- Retrieve Config refreshes the device database revision; it doesn't create templates.\n- FortiOS has no feature that exports FortiManager templates; SD-WAN templates are FortiManager objects.",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-044",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The SD-WAN template installs on FGT-Spoke1 and FGT-Spoke2, but the install fails on FGT-Spoke3. What is the most likely cause?",
    "exhibit": "SD-WAN template Branch-SDWAN (all branches)\n  Zone HUB1 members: HUB1-VPN1, HUB1-VPN2\n\nTemplate groups\n  BRANCH      -> FGT-Spoke1, FGT-Spoke2   IPsec template BRANCH_IPsec:  HUB1-VPN1, HUB1-VPN2\n  BR-Legacy   -> FGT-Spoke3               IPsec template Legacy-IPsec:  HUB1_VPN1, HUB1_VPN2",
    "options": [
      "Members are bound by name, and FGT-Spoke3's tunnels are named HUB1_VPN1 and HUB1_VPN2, so the members don't exist on it.",
      "FGT-Spoke3 needs its own SD-WAN template, because one SD-WAN template can be assigned to only two devices.",
      "FGT-Spoke3 has SD-WAN management enabled, which blocks templates from other groups.",
      "Underscores aren't allowed in tunnel names that are SD-WAN members."
    ],
    "answer": [
      0
    ],
    "explanation": "SD-WAN template members are typed **by name** (normalized interfaces aren't supported there). The template references `HUB1-VPN1` and `HUB1-VPN2`, which FGT-Spoke3 doesn't have: its legacy IPsec template created `HUB1_VPN1` and `HUB1_VPN2`. Standardize the tunnel names (move FGT-Spoke3 to the standard IPsec template) and reinstall.\n\n- SD-WAN templates can be assigned to many devices and device groups.\n- SD-WAN management must be **enabled** to use SD-WAN templates; it doesn't block them.\n- Underscores are valid in interface names; the problem is the mismatch.",
    "lesson": "2.2-ipsec-templates"
  },
  {
    "id": "d2-045",
    "topic": "2.2",
    "type": "match",
    "difficulty": 1,
    "stem": "Match each FortiManager 7.6 SD-WAN Manager section with what it contains.",
    "pairs": [
      [
        "Network",
        "Devices with SD-WAN management enabled, and the SD-WAN Monitor"
      ],
      [
        "Templates",
        "Template groups, IPsec tunnel, BGP, static route and CLI templates"
      ],
      [
        "Overlay Orchestration",
        "The SD-WAN overlay template wizard"
      ],
      [
        "Rules",
        "SD-WAN templates: zones, members, performance SLAs and rules"
      ]
    ],
    "explanation": "FortiManager 7.6.0 introduced SD-WAN Manager with four sections: **Network** (Devices and Monitor), **Templates** (SD-WAN-related templates other than the SD-WAN and overlay templates), **Overlay Orchestration** (the overlay template, previously in Device Manager > Provisioning Templates) and **Rules** (SD-WAN templates).",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-046",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about SD-WAN Manager in FortiManager 7.6 are true? (Choose two.)",
    "options": [
      "A device appears in SD-WAN Manager only when SD-WAN management is enabled for it.",
      "From 7.6.3, SD-WAN templates can be managed in either SD-WAN Manager or Device Manager.",
      "SD-WAN Manager replaces policy packages for SD-WAN devices.",
      "SD-WAN templates can be applied only to devices that do not have SD-WAN management enabled.",
      "SD-WAN Manager requires a separate SD-WAN Orchestrator licence for each managed FortiGate."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "A device needs **SD-WAN management enabled** (*Managed by SD-WAN Manager*) to appear there. In **7.6.3** SD-WAN templates became manageable in both SD-WAN Manager and Device Manager, and the SD-WAN Monitor is visible in both.\n\n- Policy packages still hold the firewall policies.\n- It's the other way round: in 7.6.0 to 7.6.2, SD-WAN templates can be applied **only** to devices with SD-WAN management enabled; from 7.6.3 they can be applied to devices with or without it.\n- SD-WAN Manager is a FortiManager pane, not a separately licensed SD-WAN Orchestrator (FortiManager has a page for migrating SD-WAN Orchestrator configurations into SD-WAN templates).",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-047",
    "topic": "2.2",
    "type": "order",
    "difficulty": 2,
    "stem": "An SD-WAN overlay already exists. Place the steps to onboard one new branch in order.",
    "items": [
      "Add the FortiGate as a model device, optionally from a device blueprint.",
      "Place it in the overlay template's branch device group, which assigns the branch templates automatically.",
      "Set its metadata variables, including branch_id unless automatic assignment is enabled.",
      "Assign a policy package to the branch.",
      "Install the changes with the Install Wizard."
    ],
    "explanation": "Documented onboarding: model device (blueprint optional; many branches at once via CSV), membership of the branch device group (automatic template assignment), metadata variables (`branch_id`), policy package, then install.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-048",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. An MSSP enables this option for two business units that must stay separated across the same branches and hubs. What does the wizard generate?",
    "exhibit": "Overlay template: MSSP-Overlay > Region Settings > Advanced\nBGP on Loopback .................. Enabled\nDynamic BGP ...................... Disabled\nAuto-Discovery VPN ............... Disabled\nSegmentation Over Single Overlay . Enabled\nOverlay Authentication Method .... Pre-shared Key",
    "options": [
      "VRF, BGP VPNv4 and PE/CE BGP configuration, with the tunnels set to vpn-id-ipip encapsulation.",
      "A separate set of overlay tunnels per business unit, each in its own SD-WAN zone.",
      "One VDOM per business unit on every branch, linked to the overlays with inter-VDOM links.",
      "Separate BGP AS numbers per business unit, peered with eBGP across the overlay."
    ],
    "answer": [
      0
    ],
    "explanation": "**Segmentation Over Single Overlay** carries several VRFs over **one** set of tunnels: the wizard generates VRF, **VPNv4** and PE/CE BGP configuration and sets the tunnels to **`vpn-id-ipip`** encapsulation.\n\n- The point of the option is to avoid building one overlay per segment.\n- It uses VRFs, not VDOMs.\n- It doesn't create per-segment AS numbers.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-049",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two must be in place before an administrator runs the SD-WAN overlay template wizard? (Choose two.)",
    "options": [
      "The hub and branch FortiGates are added to FortiManager.",
      "A device group containing the branch devices exists.",
      "SD-WAN rules for the overlays are configured in an SD-WAN template.",
      "BGP sessions between the hub and the branches are already established.",
      "ADVPN is enabled on the hub phase 1 interfaces.",
      "A policy package with the health-check policies is installed on the hub."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Documented prerequisites: hub and branch devices **added to FortiManager**, their ISP links and interfaces configured, a **branch device group**, and underlay reachability between hub and branches.\n\n- SD-WAN rules come **after** the wizard.\n- BGP and ADVPN are what the wizard builds.\n- The wizard can create the health-check policies itself.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-050",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. With BGP on Loopback enabled, how many BGP sessions to branches does each hub maintain?",
    "exhibit": "Design: Dual HUB (Primary/Primary), FGT-Hub1 and FGT-Hub2\nBranches ............... 600\nBranch underlays ....... 2 (port1, port2)\nOverlays per branch .... HUB1-VPN1, HUB1-VPN2, HUB2-VPN1, HUB2-VPN2\nBGP on Loopback ........ Enabled",
    "options": [
      "600",
      "1,200",
      "2,400",
      "300"
    ],
    "answer": [
      0
    ],
    "explanation": "With **BGP on Loopback**, each branch has **one BGP session to each hub, whatever the number of overlays**. Each hub therefore peers with 600 branch loopbacks. With BGP per overlay, each hub would need one session per overlay to it: 2 × 600 = 1,200.\n\n- 2,400 counts every tunnel on both hubs.\n- 300 would mean branches split between the hubs; in a dual-hub design every branch peers with both.",
    "lesson": "2.2-overlay-orchestration"
  },
  {
    "id": "d2-051",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "In a plain (non-Jinja) FortiManager CLI template, type the reference that inserts the value of the metadata variable branch_id.",
    "answer": [
      "$(branch_id)"
    ],
    "explanation": "Plain CLI templates and most object fields substitute **`$(branch_id)`**. Jinja CLI templates use `{{ branch_id }}`.",
    "lesson": "2.2-sdwan-manager-templates"
  },
  {
    "id": "d2-052",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator wants a per-branch site code to appear in the hostname set by a CLI template on 400 FortiGates. Which FortiManager 7.6 feature should hold the site code?",
    "options": [
      "An ADOM-level metadata variable with a per-device mapping, referenced in the template",
      "A required Device meta field, referenced in the template",
      "A device folder named after the site code",
      "The device description field, referenced in the template"
    ],
    "answer": [
      0
    ],
    "explanation": "**Metadata variables** (Policy & Objects > Advanced > Metadata Variables) hold a default plus per-device or per-group values and can be referenced in scripts and provisioning templates. In 7.6, **meta fields** are descriptive attributes on objects and administrators and **can't be used as variables** in scripts or provisioning templates. Folders and descriptions aren't template variables either.",
    "lesson": "2.2-sdwan-manager-templates"
  }
];
