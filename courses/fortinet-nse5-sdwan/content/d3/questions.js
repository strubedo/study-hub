// Domain 3 — Centralized management, visibility and troubleshooting question bank.
// FortiOS 7.6 / FortiManager 7.6. Exhibits follow the field layout of the FortiOS 7.6.3 guide
// (SD-WAN related diagnose commands, SD-WAN related logs) and the FortiManager 7.6.5 guide.
export default [
  // ---------------------------------------------------------------- 3.1 Centralized management
  {
    id: "d3-001",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. An administrator installed SD-WAN template Branch-SDWAN to both branches yesterday. This morning a technician changed the Internet_HC check interval directly on FGT-Branch2. Auto-update is disabled on FMG-HQ. What does the config status of FGT-Branch2 indicate, and how should the administrator keep central management of the SD-WAN settings?",
    exhibit: String.raw`FMG-HQ  Device Manager > Device & Groups (Table View)  ADOM: Branches

Device Name   Config Status   Policy Package Status
FGT-Branch1   Synchronized    Installed (Branch-PP)
FGT-Branch2   Out of Sync     Installed (Branch-PP)`,
    options: [
      "Changed locally and not synced; make the change in the template and install it again",
      "FortiManager has pending changes that were not installed; run Quick Install (Device DB) to push them",
      "The FGFM tunnel to FGT-Branch2 is down; check TCP 541 between the devices",
      "The template was unassigned from FGT-Branch2; reassign the template and install the policy package",
    ],
    answer: [0],
    explanation: "**Out of Sync** means the configuration was modified on the managed device and not synced to FortiManager. FortiManager's guide says local changes to SD-WAN, Performance SLA or SD-WAN Rules after a template install leave the template out of sync; make the same change in the template and reinstall, or the next install overwrites the local edit.\n\n- Pending FortiManager changes show as **Modified**, not Out of Sync.\n- A lost connection shows as **Unknown**.\n- Unassigning a template is a FortiManager-side change; it doesn't make the device Out of Sync.\n\nWith auto-update left at its default (enabled), the local change would have been synced automatically and the status would read **Auto-update** instead; the template would still be out of sync with the device.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-002",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "An administrator has assigned an SD-WAN template to ten FortiGates. The policy packages must not be installed today. Which operation pushes only the device-level settings, including the template, and lets the administrator review an installation preview first?",
    options: [
      "Install Device Settings (only)",
      "Install Policy Package & Device Settings",
      "Quick Install (Device DB)",
      "Re-install Policy",
    ],
    answer: [0],
    explanation: "SD-WAN configuration (`config system sdwan`) is device-level, and FortiManager's SD-WAN template workflow installs it with the Install Wizard's **Install Device Settings (only)**, which offers an Install Preview and can be cancelled.\n\n- **Quick Install (Device DB)** also pushes only the device layer, but has **no** preview and can't be cancelled.\n- **Install Policy Package & Device Settings** and **Re-install Policy** both have a preview, but they install the policy package as well, which the stem rules out.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-003",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about the FortiManager 7.6 SD-WAN overlay template are true? (Choose two.)",
    options: [
      "It generates IPsec, BGP and CLI provisioning templates and template groups for the hub and branch devices",
      "It configures the SD-WAN rules that steer business applications over the overlays",
      "It creates the branch_id metadata variable, which needs a unique value on each branch",
      "It installs the generated templates on the hub and branch FortiGates when the administrator clicks Finish",
      "It uses 172.16.0.0/16 as the default overlay tunnel network",
    ],
    answer: [0, 2],
    explanation: "The overlay wizard generates IPsec, BGP and CLI templates, organizes them in template groups, and creates `branch_id`, which must be unique per branch (set manually or with Automatic Branch ID Assignment).\n\n- The guide states that the overlay template provides **no SD-WAN intelligence**: the SD-WAN rules come from an SD-WAN template. (Template Options can add the overlay members, zones and hub health checks to an SD-WAN template, but not the steering rules.)\n- Finish generates the templates and **assigns** them; nothing reaches the FortiGates until you install with the Install Wizard.\n- The default overlay network is **10.10.0.0/16**; 172.16.0.0/16 is the default loopback range.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-004",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Branch1 and FGT-Branch2 are both members of device group East-Stores. An address object uses $(lan_net) as its subnet. Which value does FGT-Branch2 receive when the policy package is installed?",
    exhibit: String.raw`FMG-HQ  Policy & Objects > Advanced > Metadata Variables  ADOM: Branches

Name      Type   Default Value    Per-Device Mapping
lan_net   Text   10.0.0.0/24      Group East-Stores = 10.20.0.0/24
                                  FGT-Branch1       = 10.1.0.0/24`,
    options: [
      "10.20.0.0/24",
      "10.0.0.0/24",
      "10.1.0.0/24",
      "Nothing; the install fails because FGT-Branch2 has no per-device value",
    ],
    answer: [0],
    explanation: "A device-group mapping applies to every device in the group; a device with its own per-device value keeps that value instead. FGT-Branch2 has no per-device value, so it gets the **East-Stores** value, 10.20.0.0/24.\n\n- 10.1.0.0/24 is FGT-Branch1's own value.\n- The default 10.0.0.0/24 is used only when no device or group mapping exists.\n- Missing mappings don't fail the install; the default (or group) value is used.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-005",
    topic: "3.1",
    type: "fill",
    difficulty: 1,
    stem: "What is the name of the metadata variable that the FortiManager SD-WAN overlay template creates automatically, and that needs a unique value on each branch device?",
    answer: ["branch_id", "$(branch_id)"],
    explanation: "The overlay wizard creates **`branch_id`**. The branch provisioning templates use it for per-branch values such as the BGP router ID, so every branch needs a unique value, set per device or by **Automatic Branch ID Assignment**.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-006",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "Where does an administrator create ADOM-level metadata variables in FortiManager 7.6?",
    options: [
      "Policy & Objects > Advanced > Metadata Variables",
      "System Settings > Advanced > Meta Fields",
      "SD-WAN Manager > Overlay Orchestration > Variables",
      "Device Manager > Scripts > Variables",
    ],
    answer: [0],
    explanation: "ADOM-level metadata variables are created in **Policy & Objects > Advanced > Metadata Variables** (enable the feature in Policy & Objects > Tools > Feature Visibility first). Values can also be mapped from Device Manager with Edit Variable Mapping.\n\n- **Meta Fields** under System Settings are descriptive attributes on objects; they are a different feature.\n- The overlay wizard creates `branch_id` but doesn't have its own variables menu.\n- There is no Scripts > Variables page.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-007",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. A new FortiGate shipped with this default policy. The administrator assigns an SD-WAN template that makes port1 and port2 members of zone underlay. What must be done before the template can be installed?",
    exhibit: String.raw`FGT-Branch3 # show firewall policy
config firewall policy
    edit 1
        set name "Initial-Access"
        set srcintf "port1"
        set dstintf "port3"
        set action accept
        set srcaddr "all"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
    next
end`,
    options: [
      "Delete policy 1, because an interface referenced directly in a policy can't become an SD-WAN member",
      "Map port1 to a normalized interface so the SD-WAN template can use the normalized name",
      "Add port3 to the SD-WAN template as a third member",
      "Change the template to use zone virtual-wan-link, which accepts interfaces that are referenced in policies",
    ],
    answer: [0],
    explanation: "FortiManager's guide warns that some FortiGate models include a default policy for initial management access, and because SD-WAN members can't use interfaces referenced directly in firewall policies, the policy must be removed before the SD-WAN template is installed: manually, or by installing a policy package without it.\n\n- Normalized interfaces aren't supported for SD-WAN template members, and they wouldn't remove the reference anyway.\n- Adding port3 doesn't remove the port1 reference.\n- The zone name doesn't matter; any member interface must be free of direct policy references.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-008",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator right-clicked the SD-WAN template and chose Preview CLI Configuration with FGT-Branch1 selected in the Device dropdown. FGT-Branch1 has a per-device value for wan1_gw. Why does the preview show the variable instead of an IP address?",
    exhibit: String.raw`Preview CLI Configuration - Branch-SDWAN    Device: FGT-Branch1

config system sdwan
    config members
        edit 1
            set interface "port1"
            set zone "underlay"
            set gateway $(wan1_gw)
        next
    end
end`,
    options: [
      "This preview shows variable names, not values; Install Preview shows the resolved value",
      "The wan1_gw variable is a Password type, so its value is always hidden",
      "The per-device mapping is ignored until the device is moved into a device group",
      "Gateway IP doesn't support metadata variables, so the literal text will be installed",
    ],
    answer: [0],
    explanation: "FortiManager documents that when metadata variables are included in a provisioning template, **Preview CLI Configuration shows the variable names and not their resolved values**. **Install Preview** in the Install Wizard shows the CLI that will actually be sent, with the device's real value. (For CLI templates, More > Validate also lists each assigned device's resolved value.)\n\n- A Password variable would still be resolved at install time; the preview behaviour is the same for all types.\n- Per-device mappings work without device groups.\n- Gateway IP is one of the SD-WAN member fields that accepts metadata variables.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-009",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator tries to save template group BRANCH with both SD-WAN templates selected. What is the result?",
    exhibit: String.raw`Create New Template Group
Name: BRANCH
Provisioning Templates:
  IPsec Tunnel    [x] BRANCH_IPsec
  BGP             [x] BRANCH_BGP
  SD-WAN          [x] Branch-DIA
                  [x] Branch-Overlay
  CLI             [x] BRANCH_CLI`,
    options: [
      "It isn't possible: a template group holds one template of each type, so merge the SD-WAN settings into one template",
      "Both SD-WAN templates are installed, and FortiManager merges their rules in alphabetical order",
      "Both SD-WAN templates are installed, and the second one overwrites the first one's members",
      "It works only when the group is assigned to a device group instead of individual devices",
    ],
    answer: [0],
    explanation: "When you build a template group you can select **only one template for each template type** (AP profiles are the only type that allows several). Two SD-WAN templates for the same devices must be combined into one.\n\nNone of the merge or overwrite behaviours exist, and the rule is the same whether the group is assigned to devices, VDOMs or device groups.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-010",
    topic: "3.1",
    type: "order",
    difficulty: 1,
    stem: "Put the steps for deploying SD-WAN with a FortiManager SD-WAN template in the correct order.",
    items: [
      "Create the SD-WAN template with zones, members, performance SLAs and rules",
      "Assign the template to the FortiGate devices or device groups",
      "Run the Install Wizard with Install Device Settings (only)",
      "Check the devices in SD-WAN Manager > Network > Monitor",
    ],
    explanation: "FortiManager's workflow is: **create** the SD-WAN template, **assign** it to devices or device groups, **install** device settings with the Install Wizard (the template has no effect until installed), then **monitor** the FortiGates in the SD-WAN Monitor.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-011",
    topic: "3.1",
    type: "match",
    difficulty: 2,
    stem: "Match each FortiManager 7.6 SD-WAN Manager menu to what it contains.",
    pairs: [
      ["Network > Devices", "FortiGates that have SD-WAN management enabled"],
      ["Network > Monitor", "Map, table, template and history views of SD-WAN health"],
      ["Templates", "Template groups, IPsec tunnel, BGP, static route and CLI templates"],
      ["Overlay Orchestration", "The SD-WAN overlay template wizard"],
      ["Rules", "SD-WAN templates with zones, members, SLAs and rules"],
    ],
    explanation: "In FortiManager 7.6 the SD-WAN Manager module has **Network** (Devices, Monitor), **Templates** (template groups and the IPsec, BGP, static route and CLI templates used for SD-WAN), **Overlay Orchestration** (overlay templates) and **Rules**, where the SD-WAN templates themselves are created, edited, imported and assigned.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-012",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "Refer to the exhibit. FGT-Branch4 is managed by FMG-HQ, but it isn't listed in SD-WAN Manager > Network > Devices and can't be selected in a new SD-WAN overlay template. What should the administrator do?",
    exhibit: String.raw`FMG-HQ  Device Manager > Device & Groups  ADOM: Branches  (summary of the GUI)

Device Name   Connectivity   Config Status   Managed by SD-WAN Manager
FGT-Branch1   Up             Synchronized    Enabled
FGT-Branch2   Up             Synchronized    Enabled
FGT-Branch4   Up             Synchronized    Disabled`,
    options: [
      "Select FGT-Branch4 and choose More > Enable SD-WAN Management",
      "Assign an SD-WAN template to FGT-Branch4, which adds it automatically",
      "Enable sdwan-monitor-history in config system admin setting",
      "Move FGT-Branch4 to the root ADOM, the only ADOM SD-WAN Manager uses",
    ],
    answer: [0],
    explanation: "A FortiGate appears in SD-WAN Manager > Network > Devices only when **SD-WAN management is enabled** for it (More > Enable SD-WAN Management, or the Managed by SD-WAN Manager toggle on a model device), and devices must have it enabled before they can be used in SD-WAN overlay templates.\n\n- Assigning a template doesn't enable SD-WAN management.\n- `sdwan-monitor-history` only controls monitoring history storage.\n- SD-WAN Manager works per ADOM; it isn't limited to root.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-013",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "In the FortiManager SD-WAN Monitor History View, an administrator can only select data for the last 10 minutes, and no SD-WAN history is kept on FortiManager. What explains this?",
    options: [
      "Monitoring history is disabled by default; enable sdwan-monitor-history",
      "The FortiGates have sla-pass-log-period set to 0, so they send no data",
      "History requires the SD-WAN Underlay Bandwidth and Quality Monitoring Service subscription",
      "The ADOM is in workspace mode, which disables monitoring history",
    ],
    answer: [0],
    explanation: "By default SD-WAN Monitoring History is **disabled**: FortiManager shows only the last 10 minutes, read live from the FortiGates, and stores nothing. Enabling `sdwan-monitor-history` stores history (180 days by default, `rtm-max-monitor-by-days`).\n\n- `sla-pass-log-period` controls FortiGate event logs, not the monitor's API data.\n- The Underlay Bandwidth and Quality Monitoring subscription is for on-demand speed tests.\n- Workspace mode is about ADOM locking.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-014",
    topic: "3.1",
    type: "multi",
    difficulty: 1,
    stem: "Which two sections can be configured inside a FortiManager SD-WAN template? (Choose two.)",
    options: [
      "Performance SLA",
      "Neighbor",
      "IPsec phase 1 proposals",
      "Firewall policies between the SD-WAN zones",
      "BGP autonomous system number",
      "Metadata variable default values",
    ],
    answer: [0, 1],
    explanation: "An SD-WAN template has the sections **SD-WAN Zones**, **SD-WAN Rules**, **Performance SLA**, **Neighbor**, **Duplication** and Advanced Options.\n\n- IPsec settings belong to IPsec tunnel templates and the BGP AS to BGP templates.\n- Firewall policies live in policy packages.\n- Metadata variables are defined in Policy & Objects.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-015",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Branches use different WAN ports: some have wan1, others port1. The administrator wants one SD-WAN template and tries to use the normalized interface WAN1-norm as the interface member. What is the supported approach?",
    options: [
      "Bind the member by interface name, using a metadata variable such as $(wan_port) that resolves to wan1 or port1 per device",
      "Use the normalized interface; FortiManager resolves its per-device mapping when installing the SD-WAN template",
      "Create one zone per port name; FortiGates ignore zones whose interfaces don't exist",
      "Leave Interface Member empty and set only the Gateway IP; the FortiGate picks the interface from the routing table",
    ],
    answer: [0],
    explanation: "FortiManager states that **normalized interfaces are not supported for SD-WAN templates**; members must be bound by name to physical or VPN interfaces. The Interface Member field accepts **metadata variables**, so a variable with a per-device value is the way to vary the port name.\n\nThe other options describe behaviours that don't exist: missing interfaces cause install errors, and Interface Member is required.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-016",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "An administrator imports the SD-WAN configuration of FGT-Branch1 into a new SD-WAN template and types the name Retail. How does the template appear in the template list?",
    options: [
      "Retail, with the prefix Import added by FortiManager",
      "Retail, with the source device name appended",
      "Retail, exactly as typed",
      "The source device name followed by _sdwan",
    ],
    answer: [0],
    explanation: "FortiManager **automatically adds the prefix `Import`** to SD-WAN templates imported from FortiGates, which makes imported templates easy to spot. Review them before reuse: they contain that device's literal gateway and server values.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-017",
    topic: "3.1",
    type: "fill",
    difficulty: 1,
    stem: "FGT-Branch1 can't register to FMG-HQ through a new firewall in the path. Which TCP port does the FortiGate-to-FortiManager (FGFM) protocol use?",
    answer: ["541", "tcp 541", "tcp/541"],
    explanation: "FGFM runs over TLS on **TCP 541**. If an intermediate firewall blocks it, the device can't register and FortiManager shows the connection as down.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-018",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. In the SD-WAN overlay template wizard, the Overlay Network field is unavailable. Why?",
    exhibit: String.raw`Create New SD-WAN Overlay Template > Region Settings > Advanced

Loopback IP Address     172.16.0.0/255.255.0.0
Overlay Network         (unavailable)
BGP-AS Number           65000
BGP on Loopback         ON
Dynamic BGP             ON
Auto-Discovery VPN      ADVPN 2.0`,
    options: [
      "BGP on Loopback is enabled, and the overlay network setting isn't available in that mode",
      "ADVPN 2.0 assigns tunnel addresses dynamically from the hub, so no overlay network is needed",
      "Dynamic BGP requires the overlay network to be the same as the loopback range",
      "The topology is Single HUB, which doesn't use an overlay network",
    ],
    answer: [0],
    explanation: "The wizard's help says the Overlay Network option **isn't available when BGP on Loopback is enabled**: BGP peers between loopbacks, so one peering per hub is used regardless of how many overlays exist.\n\nThe other options invent dependencies on ADVPN 2.0, Dynamic BGP or the topology that the wizard doesn't have.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-019",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "What is the difference between the Dual HUB (Primary/Secondary) and Dual HUB (Primary/Primary) topologies in the SD-WAN overlay template wizard?",
    options: [
      "The same configuration, but the secondary hub gets a higher cost that the SD-WAN rule uses",
      "Primary/Secondary builds tunnels only to the primary hub until it fails",
      "Primary/Primary requires ADVPN 2.0, and Primary/Secondary requires legacy ADVPN",
      "Primary/Secondary uses one BGP AS per hub, and Primary/Primary uses a shared AS",
    ],
    answer: [0],
    explanation: "FortiManager's guide says Primary/Secondary and Primary/Primary are **the same configuration**, with the difference that in Primary/Secondary the **secondary hub gets a higher cost**, controlled by the SD-WAN rule. Tunnels to both hubs are still built in both cases.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-020",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "An SD-WAN overlay template uses device group Branches for its branch devices. A new store FortiGate is added as a model device. What is the simplest way to give it the overlay configuration?",
    options: [
      "Add it to the Branches device group, give it a unique branch_id, assign the branch policy package and install",
      "Clone BRANCH_IPsec and BRANCH_BGP for the new device and assign the clones to it directly",
      "Delete and re-create the overlay template so the wizard discovers the new device",
      "Edit the overlay template and select the new device as an additional hub in Role Assignment",
    ],
    answer: [0],
    explanation: "The overlay template assigns its branch provisioning templates through the **branch device group**: a device added to the group receives them automatically. Then it needs its `branch_id` (unless automatic assignment is on) and a policy package, and you install with the Install Wizard.\n\nCloning templates defeats the central design, re-creating the template is unnecessary, and a branch is not a hub.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-021",
    topic: "3.1",
    type: "multi",
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-Branch1, FGT-Branch2 and FGT-Branch3 are in ADOM Branches. FGT-Branch2 is the only member of device group Hubless. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FMG-HQ  Policy & Objects > Advanced > Metadata Variables  ADOM: Branches

Name       Type       Default Value    Per-Device Mapping
wan1_gw    Text       203.0.113.1      FGT-Branch2   = 203.0.113.9
                                       Group Hubless = 203.0.113.5
psk_hub1   Password   ********         (none)
site_no    Text       0                FGT-Branch1   = 11`,
    options: [
      "FGT-Branch2 resolves wan1_gw to 203.0.113.9",
      "FGT-Branch3 resolves site_no to 0",
      "FGT-Branch2 resolves wan1_gw to 203.0.113.5",
      "An administrator can reveal the value of psk_hub1 by editing the variable",
      "FGT-Branch3 fails to install because it has no mapping for wan1_gw",
    ],
    answer: [0, 1],
    explanation: "A per-device value beats a device-group value, so FGT-Branch2 gets **203.0.113.9**. FGT-Branch3 has no mapping for `site_no`, so it gets the **default 0**.\n\n- The group value 203.0.113.5 would apply only to group members without their own value.\n- Password variables are encrypted once saved; the value can't be revealed when editing.\n- A device without a mapping uses the default; it doesn't fail.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-022",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "An MSSP creates a metadata variable mgmt_net in the Global Database ADOM and wants a different value for every customer ADOM. Which mapping does it use?",
    options: [
      "Per-ADOM mapping, which applies one value to all devices in the selected ADOM",
      "Per-device mapping, configured for each FortiGate in every ADOM",
      "Device-group mapping in the Global Database ADOM",
      "None; Global Database metadata variables support only a default value",
    ],
    answer: [0],
    explanation: "In the **Global Database** ADOM, metadata variables use **Per-ADOM Mapping**: one value applied to every device in a chosen ADOM. Per-device mapping is **not available** in the Global Database ADOM; it is used in regular ADOMs.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-023",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The CLI template is assigned to FGT-Branch1, FGT-Branch2 and FGT-Branch3. Which IP address does port3 on FGT-Branch3 receive?",
    exhibit: String.raw`CLI template: BRANCH_LAN
config system interface
    edit "port3"
        set ip 10.$(store_no).1.1 255.255.255.0
    next
end

Metadata variable store_no   Default Value: 0
  Per-Device Mapping: FGT-Branch1 = 1
                      FGT-Branch2 = 2`,
    options: [
      "10.0.1.1/24",
      "10.3.1.1/24",
      "10.$(store_no).1.1/24, because the variable can't be resolved",
      "No address; FortiManager skips templates whose variables have no mapping",
    ],
    answer: [0],
    explanation: "FGT-Branch3 has no per-device value, so FortiManager substitutes the **default value 0**, and port3 gets **10.0.1.1/24**. That is a classic silent error: the install succeeds with the default. Validate or Install Preview would show it.\n\nFortiManager doesn't number devices automatically for an ordinary variable, and it doesn't install unresolved text or skip the template.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-024",
    topic: "3.1",
    type: "order",
    difficulty: 2,
    stem: "Put the pages of the FortiManager SD-WAN overlay template wizard in the order they appear.",
    items: [
      "Region Settings (name, topology, authentication, advanced address and BGP settings)",
      "Role Assignment (hubs and branch device groups)",
      "Network Configuration (underlays and network advertisement)",
      "Template Options (SD-WAN template objects, normalized interfaces, health-check policies)",
      "Summary, then Finish to generate the templates",
    ],
    explanation: "The wizard goes **Region Settings → Role Assignment → Network Configuration → Template Options → Summary**. Clicking Finish generates the provisioning templates and assigns them to the hubs and branch device groups chosen in the wizard.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-025",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "An administrator changed the Local AS in the HUB1_BGP template that the overlay wizard generated, and also added a description to the template. Later, another administrator edits the overlay template and finishes the wizard again. What is the result?",
    options: [
      "The Local AS returns to the value set in the overlay template, and the description is kept",
      "Both the Local AS and the description are kept, because manual edits always take precedence",
      "Both are reset, because the wizard re-creates every generated template from scratch",
      "The wizard refuses to finish until the manual changes are reverted",
    ],
    answer: [0],
    explanation: "Re-running the overlay wizard **updates the provisioning templates it generated**. Fields the wizard manages, such as the hub BGP Local AS, are overwritten with the wizard's values. Fields it doesn't include, such as descriptions, are not affected.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-026",
    topic: "3.1",
    type: "multi",
    difficulty: 1,
    stem: "Which two FortiManager install operations let the administrator view an installation preview before anything is sent to the FortiGate? (Choose two.)",
    options: [
      "Install Device Settings (only)",
      "Install Policy Package & Device Settings",
      "Quick Install (Device DB)",
      "Retrieve Config",
      "Import Configuration",
    ],
    answer: [0, 1],
    explanation: "Both Install Wizard operations, **Install Device Settings (only)** and **Install Policy Package & Device Settings**, offer an Install Preview and can be cancelled. (Re-install Policy, not listed here, has a preview too.)\n\n- **Quick Install (Device DB)** pushes the device layer at once, with no preview and no way to cancel.\n- Retrieve Config and Import Configuration pull configuration *from* the device; they don't install anything.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-027",
    topic: "3.1",
    type: "fill",
    difficulty: 2,
    stem: "Which `config system admin setting` attribute on FortiManager hides the SD-WAN Manager module from the GUI, so SD-WAN devices, templates and monitoring are managed from Device Manager instead?",
    answer: ["show-sdwan-manager", "set show-sdwan-manager disable", "show-sdwan-manager disable"],
    explanation: "`set show-sdwan-manager {enable | disable}` (default **enable**) controls the visibility of SD-WAN Manager. With it disabled, SD-WAN devices, templates and monitoring are managed from Device Manager instead. The GUI equivalent is **Show SD-WAN Manager** in System Settings > Advanced > Misc Settings.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-028",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. An administrator is looking at the SD-WAN Monitor Template View for overlay template Region-East. What does the orange colour of FGT-Branch2 indicate?",
    exhibit: String.raw`SD-WAN Manager > Network > Monitor   Devices: Region-East (SD-WAN overlay template)   Template View

  [star] FGT-HQ          green
  [dev]  FGT-Branch1     green     line to FGT-HQ: green
  [dev]  FGT-Branch2     orange    line to FGT-HQ: green

FGT-Branch2 has performance SLAs DC_HC and Internet_HC configured.`,
    options: [
      "Some of FGT-Branch2's SD-WAN health checks pass and some fail",
      "All of FGT-Branch2's health checks fail, but its tunnels are up",
      "Some of FGT-Branch2's underlays are down; health checks aren't considered",
      "FGT-Branch2 is out of sync with its SD-WAN template",
    ],
    answer: [0],
    explanation: "In Template View, a device that has SD-WAN health checks (usually a spoke) is coloured by them: **green** all pass, **orange some pass**, **red** all fail. Underlay status is used only for devices without health checks (usually a hub). The green line shows the tunnel to the hub is up. Config sync status isn't shown by these colours.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-029",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "The hub FGT-HQ has a unique SD-WAN configuration that no other device shares. The branches use SD-WAN template Branch-SDWAN. How should the administrator manage FGT-HQ's SD-WAN settings in FortiManager?",
    options: [
      "Configure SD-WAN in FGT-HQ's device database (Network > SD-WAN) and don't assign an SD-WAN template to it",
      "Assign Branch-SDWAN to FGT-HQ and override the hub settings locally on the FortiGate",
      "Create a template group containing Branch-SDWAN and a second SD-WAN template for the hub",
      "Hub SD-WAN can't be managed by FortiManager; configure it locally and exclude FGT-HQ from FortiManager",
    ],
    answer: [0],
    explanation: "FortiManager supports **per-device SD-WAN management** in the device database (Network > SD-WAN). The guide says that if you want per-device management, **don't assign SD-WAN templates** to the device.\n\n- Local overrides on a templated device put it out of sync and are overwritten on the next install.\n- A template group can't hold two SD-WAN templates.\n- Hubs can be fully managed by FortiManager.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-030",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about FortiManager template groups are true? (Choose two.)",
    options: [
      "A template group can be assigned to devices, VDOMs or device groups",
      "FortiManager installs the templates in a group in the correct order, and uninstalls them in the correct order",
      "A template group can contain several SD-WAN templates if they use different zones",
      "Template groups are installed with Install Policy Package & Device Settings only",
      "Template groups can be created only in SD-WAN Manager, not in Device Manager",
    ],
    answer: [0, 1],
    explanation: "Template groups are assigned to **devices or VDOMs or device groups**, and FortiManager **orders the install** of the member templates (for example IPsec before templates that use the tunnel interfaces) and the uninstall.\n\n- One template per type (AP profiles excepted), so not several SD-WAN templates.\n- Provisioning templates are device settings; no policy package is required.\n- They are available in both SD-WAN Manager > Templates and Device Manager > Provisioning Templates.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-031",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. After installing the overlay templates, the branch tunnels to FGT-HQ never come up, and a ping from FGT-Branch1 to FGT-HQ's WAN address 203.0.113.10 fails. What is the most likely cause?",
    exhibit: String.raw`FGT-Branch1 # get router info routing-table all
...
Routing table for VRF=0
C       10.0.1.0/24 is directly connected, port3
C       198.51.100.0/30 is directly connected, port2
C       203.0.113.4/30 is directly connected, port1`,
    options: [
      "The branch has no route to the hub's WAN address; the overlay template assumes underlay connectivity already exists",
      "The overlay wizard didn't generate IPsec templates because no SD-WAN template was selected",
      "BGP on loopback is enabled, and IPsec can't be negotiated to a loopback",
      "The branch_id variable is 0, so the tunnels are administratively disabled",
    ],
    answer: [0],
    explanation: "The routing table has only connected routes, so the branch has no route to 203.0.113.10. FortiManager states that the overlay template **assumes connectivity between the hub and branch** to build the tunnels, provided by static routes, BGP or a DHCP route. Add a default route (for example with a static route template to the underlay zone or members).\n\n- IPsec templates are generated regardless of SD-WAN template options.\n- BGP on loopback is about BGP peering; IKE still goes to the hub's WAN address.\n- `branch_id` doesn't disable tunnels.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-032",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "When creating an SD-WAN member in a FortiManager SD-WAN template, which field accepts a metadata variable so each branch can use its own ISP next hop?",
    options: [
      "Gateway IP",
      "Sequence Number",
      "Status",
      "Installation Target",
    ],
    answer: [0],
    explanation: "FortiManager's member dialog lets you use metadata variables for **Interface Member** and **Gateway IP**, for example `$(wan1_gw)`. Sequence Number, Status and Installation Target are fixed per template entry.",
    lesson: "3.1-sdwan-templates-groups",
  },
  {
    id: "d3-033",
    topic: "3.1",
    type: "match",
    difficulty: 2,
    stem: "Match each FortiManager Device Manager config status to its meaning.",
    pairs: [
      ["Synchronized", "FortiManager and the device configuration match"],
      ["Modified", "Changed on FortiManager and not yet installed"],
      ["Auto-update", "Changed on the device and automatically synced to FortiManager"],
      ["Out of Sync", "Changed on the device and not synced to FortiManager"],
      ["Conflict", "An install failed, or both sides changed without auto-sync"],
    ],
    explanation: "These are the Device Manager config statuses. Conflict can be resolved by retrieving the device configuration (then re-importing the policy) or by installing FortiManager's copy with Install Device Settings (only). Unknown (not in this list) means the connection is down or no revision exists yet.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-034",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "In the FortiManager SD-WAN Monitor map, branch port bandwidth usage is missing for every device, although SLA data is shown. What must be configured?",
    options: [
      "The estimated upstream and downstream bandwidth on the FortiGate interfaces used by SD-WAN",
      "SD-WAN monitoring history on FortiManager",
      "A FortiGuard SD-WAN Underlay Bandwidth and Quality Monitoring subscription on every FortiGate",
      "Passive WAN health measurement on every health check",
    ],
    answer: [0],
    explanation: "FortiManager's guide notes that to see **port bandwidth usage** you must configure the **estimated bandwidth** on the interfaces used by SD-WAN (`estimated-upstream-bandwidth` / `estimated-downstream-bandwidth`).\n\n- History only extends the time range.\n- The underlay subscription is for speed tests.\n- Passive measurement changes how SLA is measured, not bandwidth display.",
    lesson: "3.1-fortimanager-sdwan-manager",
  },
  {
    id: "d3-035",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The administrator validates CLI template BRANCH_CLI, which sets the BGP router ID on the branches, before installing, and every device reports OK. What should be done about FGT-Branch3?",
    exhibit: String.raw`Validate CLI Template - BRANCH_CLI   (validation results, summary of the GUI)

Device        Variable    Value         Status
FGT-Branch1   branch_id   1             OK
FGT-Branch2   branch_id   2             OK
FGT-Branch3   branch_id   2             OK

Template line:  set router-id 172.16.0.$(branch_id)`,
    options: [
      "Give FGT-Branch3 a unique branch_id value, because two branches would otherwise share the same BGP router ID",
      "Nothing; FortiManager adds the device serial number to duplicate router IDs at install time",
      "Delete the template line, because router IDs can't use metadata variables",
      "Move FGT-Branch3 out of the branch device group so the template no longer applies",
    ],
    answer: [0],
    explanation: "Validate shows each device's resolved value, and an OK status only means the template resolves. FGT-Branch3 has the same `branch_id` as FGT-Branch2, so both would install router ID 172.16.0.2. `branch_id` must be **unique per branch**; click the value in the Validation Results to edit it, then Re-validate.\n\nFortiManager doesn't fix duplicates itself, router IDs can be templated with variables, and removing the device from the group would remove its overlay configuration.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  {
    id: "d3-036",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about ADOM-level metadata variables are true? (Choose two.)",
    options: [
      "Each ADOM has its own list of metadata variables",
      "Typing $ in a supported field lists the metadata variables available in the ADOM",
      "Metadata variables can be used only in CLI scripts",
      "A device-group value overrides a per-device value for devices in that group",
      "Metadata variables are global to FortiManager and shared by every ADOM",
    ],
    answer: [0, 1],
    explanation: "Metadata variables are **per ADOM**, and typing **`$`** in a supported field opens the list of the ADOM's variables (fields without the selector take `$(name)` typed by hand).\n\n- They are used in scripts, provisioning templates, firewall addresses, IP pools, VIPs, normalized interfaces and more, not only CLI scripts.\n- A per-device value beats the device-group value.\n- Only the Global Database ADOM adds per-ADOM mapping; variables are not shared between regular ADOMs.",
    lesson: "3.1-overlay-orchestration-metadata",
  },
  // ---------------------------------------------------------------- 3.2 Logs and widgets
  {
    id: "d3-037",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 1 Critical-DIA uses the Lowest Cost (SLA) strategy with members 1 (port1, cost 0) and 2 (port2, cost 10) and requires Internet_HC SLA target 1. Which statement describes what happened?",
    exhibit: String.raw`date=2026-10-28 time=09:20:41 logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Health Check" healthcheck="Internet_HC" slatargetid=1 member="1" msg="Member status changed. Member out-of-sla."
date=2026-10-28 time=09:20:41 logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Health Check" healthcheck="Internet_HC" slatargetid=1 oldvalue="2" newvalue="1" msg="Number of pass member changed."
date=2026-10-28 time=09:20:41 logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Service" serviceid=1 service="Critical-DIA" seq="2,1" msg="Service prioritized by SLA will be redirected in sequence order."`,
    options: [
      "port1 is still alive but failed SLA target 1, so Critical-DIA now prefers port2",
      "port1 failed its health check and its static routes were removed",
      "port2 failed SLA target 1, so Critical-DIA now uses only port1",
      "Critical-DIA was edited and its members were reordered manually to 2, 1",
    ],
    answer: [0],
    explanation: "`member=\"1\"` is member sequence 1 (port1): it went **out of SLA** for target 1, the number of members passing went from 2 to 1, and the rule's new order is `seq=\"2,1\"`, so port2 is preferred despite its higher cost.\n\n- A dead member would produce log 0100022921 (Routing information changed) and a \"Stop forwarding traffic\" service log; neither is here.\n- The member that changed is 1, not 2.\n- These are automatic SLA events, not configuration changes.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-038",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is true?",
    exhibit: String.raw`date=2026-10-28 time=09:14:02 eventtime=1793196842104527311 tz="-0500" logid="0100022921" type="event" subtype="system" level="critical" vd="root" logdesc="Routing information changed" name="Internet_HC" interface="port2" status="down" msg="Static route on interface port2 may be removed by health-check Internet_HC. Route: (198.51.100.2->8.8.8.8 ping-down)"`,
    options: [
      "Internet_HC declared port2 dead, so its static routes may be withdrawn",
      "port2 is still alive, but it no longer meets the SLA target of Internet_HC",
      "An administrator deleted the static route that pointed through port2",
      "The ping server 8.8.8.8 was removed from the Internet_HC health check",
    ],
    answer: [0],
    explanation: "Log **0100022921** (Routing information changed) is written when a health check detects a failure (`status=\"down\"`) and the member's static routes may be removed, which is the **update-static-route** behaviour. The recovery log says the route may be added back.\n\n- An SLA failure on a live member is a 0113022923 \"Member out-of-sla\" log.\n- Manual route changes and health-check edits produce configuration (admin) logs, not this one.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-039",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "An administrator filters Log & Report > System Events to SD-WAN events only (subtype sdwan). Which three log IDs can appear in that view? (Choose three.)",
    options: [
      "0113022923 (SDWAN status)",
      "0113022924 (SDWAN volume status)",
      "0113022925 (SDWAN SLA information)",
      "0100022921 (Routing information changed)",
      "0000000013 (forward traffic)",
      "0001000014 (local traffic)",
    ],
    answer: [0, 1, 2],
    explanation: "SDWAN status (**0113022923**), SDWAN volume status (**0113022924**) and SDWAN SLA information (**0113022925**) are `subtype=\"sdwan\"` event logs.\n\n- **0100022921** is SD-WAN-related but has `subtype=\"system\"`, so it appears with the general system events.\n- 0000000013 and 0001000014 are traffic logs, not event logs.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-040",
    topic: "3.2",
    type: "fill",
    difficulty: 2,
    stem: "Under `config system sdwan` > `config health-check` > `edit \"DC_HC\"`, which attribute makes the FortiGate write an SDWAN SLA information log (0113022925) every 30 seconds while the SLA is failing? Give the attribute name.",
    answer: ["sla-fail-log-period", "set sla-fail-log-period 30", "sla-fail-log-period 30"],
    explanation: "`set sla-fail-log-period 30` generates 0113022925 logs every 30 s while SLA fails; `sla-pass-log-period` does the same while it passes. Both range 0-3600 seconds and default to **0**, meaning no periodic SLA logs.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-041",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about this session is correct?",
    exhibit: String.raw`date=2026-10-28 time=09:21:10 logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root" srcip=10.0.1.25 srcport=52114 srcintf="port3" srcintfrole="lan" dstip=198.51.100.80 dstport=443 dstintf="port2" dstintfrole="wan" sessionid=88412 proto=6 action="close" policyid=1 policytype="policy" service="HTTPS" trandisp="snat" transip=198.51.100.2 transport=52114 duration=31 sentbyte=18822 rcvdbyte=402114 vwlid=1 vwlname="Critical-DIA" vwlquality="Seq_num(2 port2), alive, sla(0x1), gid(0), cfg_order(1), cost(10), selected"`,
    options: [
      "It matched SD-WAN rule 1 Critical-DIA, which used member 2 (port2)",
      "It matched firewall policy 1, which forced the session out of port2",
      "It was routed by the implicit rule, because vwlid=1 identifies the implicit rule",
      "It used port2 because port2 has the lowest cost of all members",
    ],
    answer: [0],
    explanation: "`vwlid` is the SD-WAN rule (service) ID and `vwlname` its name; `vwlquality` shows the selected member: sequence 2, port2, alive, `sla(0x1)`. The egress is confirmed by `dstintf=\"port2\"`.\n\n- Firewall policies allow traffic; they don't pick the SD-WAN member.\n- The implicit rule isn't a numbered service with a name.\n- `cost(10)` shows port2 is the more expensive member; it is used because it is preferred while it meets SLA (the cheaper member must be failing it).",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-042",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. What does this log tell the administrator about HUB1-VPN1?",
    exhibit: String.raw`date=2026-10-28 time=10:02:15 logid="0113022925" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN SLA information" eventtype="SLA" healthcheck="DC_HC" slatargetid=1 interface="HUB1-VPN1" status="up" latency="38.212" jitter="2.104" packetloss="4.000%" slamap="0x0" metric="packetloss" msg="Health Check SLA status. SLA failed due to being over the performance metric threshold."`,
    options: [
      "The tunnel is alive but meets no SLA target of DC_HC; packet loss is the metric over its threshold",
      "The tunnel is dead, because slamap=0x0 means no probes were answered",
      "The tunnel meets SLA target 1, because slatargetid=1 is present",
      "The tunnel exceeded its latency threshold, and packet loss is within the target",
    ],
    answer: [0],
    explanation: "`status=\"up\"` means the member is alive. `slamap=\"0x0\"` means it meets no SLA target, and `metric=\"packetloss\"` with \"SLA failed due to being over the performance metric threshold\" names the failing metric. It's a periodic log written per `sla-fail-log-period`.\n\n- A dead member would show `status=\"down\"`.\n- `slatargetid` identifies the SLA entry being reported, not that it passed.\n- The log names packet loss as the failed metric.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-043",
    topic: "3.2",
    type: "single",
    difficulty: 1,
    stem: "Refer to the exhibit. FortiAnalyzer receives SDWAN status logs (0113022923) from FGT-Branch1 but never any SDWAN SLA information logs (0113022925). What is the most likely reason?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    set status enable
    config health-check
        edit "DC_HC"
            set server "10.200.1.10"
            set members 3 4
            config sla
                edit 1
                    set latency-threshold 50
                    set jitter-threshold 10
                    set packetloss-threshold 1
                next
            end
        next
    end
end`,
    options: [
      "sla-fail-log-period and sla-pass-log-period are not set, so they stay at their default of 0",
      "SD-WAN Events must first be enabled in System > Feature Visibility",
      "The firewall policies use set logtraffic utm instead of all",
      "SLA information logs need the SD-WAN Underlay Bandwidth and Quality Monitoring licence",
    ],
    answer: [0],
    explanation: "`show` lists only non-default settings, and neither log period appears. Periodic SLA information logs are generated only at the interval set by `sla-fail-log-period` / `sla-pass-log-period`, and both default to **0** (no periodic logs).\n\n- SD-WAN Events are always available in Log & Report > System Events.\n- `logtraffic` controls traffic logs, not event logs.\n- No licence is needed for SLA logs.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-044",
    topic: "3.2",
    type: "single",
    difficulty: 1,
    stem: "Refer to the exhibit. What does the checkmark next to HUB1-VPN2 indicate?",
    exhibit: String.raw`Network > SD-WAN > SD-WAN Rules

ID  Name          Source       Destination          Criteria   Members                       Hit Count
1   Critical-DIA  LAN-Subnet   Critical-SaaS        Cost       port1, port2 [check]          4127
2   DC-Apps       LAN-Subnet   DC-10.100.0.0/16     Latency    HUB1-VPN1, HUB1-VPN2 [check]  982`,
    options: [
      "HUB1-VPN2 is the member DC-Apps currently selects; hover over it to see why",
      "HUB1-VPN2 is the first member in the configured interface preference",
      "HUB1-VPN2 passes every performance SLA configured on the FortiGate",
      "HUB1-VPN2 has carried traffic for this rule since the last reboot",
    ],
    answer: [0],
    explanation: "On the SD-WAN Rules tab the interface **currently selected** by the rule has a checkmark, and a tooltip on it gives the reason. When several members are selected, only the highest-ranked one is highlighted (except with load balancing). Here DC-Apps has moved to HUB1-VPN2 even though HUB1-VPN1 is listed first.\n\nConfigured order, SLA status on other health checks and historic usage aren't what the checkmark means; the Hit Count column shows rule matches.",
    lesson: "3.2-sdwan-gui-monitoring",
  },
  {
    id: "d3-045",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. Internet_HC has one SLA target: latency 100 ms, jitter 30 ms, packet loss 2%. Which two statements are true? (Choose two.)",
    exhibit: String.raw`Network > SD-WAN > Performance SLAs   (Internet_HC selected)

Interface   Status          Packet Loss   Latency     Jitter
port1       [green arrow]   0.00%         141.20ms    6.11ms
port2       [red arrow]     100.00%       -           -`,
    options: [
      "port2 was inactive (dead) for Internet_HC at the last status check",
      "port1 is alive but doesn't meet the SLA target, because its latency is over 100 ms",
      "port1 meets the SLA target, because its arrow is green",
      "port2 is alive but out of SLA because of packet loss",
      "The red arrow means port2's interface is administratively down",
    ],
    answer: [0, 1],
    explanation: "The arrow shows status at the last check: **green = active, red = inactive**. port2 is dead for Internet_HC. port1 is alive, but 141 ms is over the 100 ms latency target, so it's **out of SLA**; the arrow doesn't show SLA pass/fail.\n\n- A green arrow only means alive.\n- 100% loss with a red arrow is a dead member, not \"alive but out of SLA\".\n- The arrow reflects health-check probes, not the interface's administrative status.",
    lesson: "3.2-sdwan-gui-monitoring",
  },
  {
    id: "d3-046",
    topic: "3.2",
    type: "match",
    difficulty: 1,
    stem: "Match each FortiGate SD-WAN GUI view to what it shows.",
    pairs: [
      ["SD-WAN Zones tab, Bandwidth", "Downloaded and uploaded traffic for each interface"],
      ["SD-WAN Zones tab, Volume", "Donut charts of received and sent bytes per interface"],
      ["SD-WAN Zones tab, Sessions", "Donut chart of active sessions per interface"],
      ["Performance SLAs tab, Packet Loss", "Percentage of probes lost for each member"],
    ],
    explanation: "The SD-WAN Zones tab has **Bandwidth**, **Volume** and **Sessions** views of interface usage. The Performance SLAs tab charts **Packet Loss**, **Latency** and **Jitter** for each member of the selected health check.",
    lesson: "3.2-sdwan-gui-monitoring",
  },
  {
    id: "d3-047",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "An administrator wants to see, in the GUI, the active policy routes that the FortiGate evaluates before the routing table, including SD-WAN rules. Where can they find this?",
    options: [
      "Dashboard > Network, expand the Static & Dynamic Routing widget and toggle to Policy",
      "Network > Static Routes, in the Policy Routes column of the table",
      "Log & Report > System Events, filtered to Router Events",
      "Dashboard > FortiView Policies, sorted by destination interface",
    ],
    answer: [0],
    explanation: "The **Static & Dynamic Routing** widget/monitor can be toggled from Static & Dynamic to **Policy**, which lists the active policy routes: user policy routes, **SD-WAN rules** and Internet Service static routes. It's the GUI view of `diagnose firewall proute list`.\n\nThe other places show configuration, router events or firewall policy usage, not the active policy-route table.",
    lesson: "3.2-sdwan-gui-monitoring",
  },
  {
    id: "d3-048",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The FortiGate has SD-WAN rules Critical-DIA and DC-Apps and two members, port1 and port2. What can the administrator conclude about this session?",
    exhibit: String.raw`date=2026-10-28 time=11:05:42 logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root" srcip=10.0.1.77 srcport=60211 srcintf="port3" srcintfrole="lan" dstip=192.0.2.44 dstport=443 dstintf="port1" dstintfrole="wan" sessionid=90217 proto=6 action="close" policyid=1 policytype="policy" service="HTTPS" trandisp="snat" transip=203.0.113.2 transport=60211 duration=12 sentbyte=4410 rcvdbyte=9120`,
    options: [
      "It matched no SD-WAN rule; the FIB (implicit rule) chose port1",
      "It matched Critical-DIA, because Critical-DIA is the first rule",
      "It matched DC-Apps, which logs its name only when the session is denied",
      "It bypassed SD-WAN because firewall policy 1 references port1 directly",
    ],
    answer: [0],
    explanation: "The Log Reference defines `vwlid`, `vwlname` and `vwlquality` as the ID, name and quality info of the SD-WAN (service) rule that the traffic matched, so a session steered by Critical-DIA or DC-Apps carries them. This log has none of them, so the session didn't match a configured SD-WAN rule; the egress came from the FIB, where the **implicit rule** distributes over the members' routes. (A debug flow without a `Match policy routing` line or a session without `sdwan_service_id` confirms it.)\n\n- Rule order doesn't make a rule match traffic outside its criteria.\n- SD-WAN fields aren't tied to deny actions.\n- A policy can't reference an SD-WAN member directly; it references the zone.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-049",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Rule 3 Bulk-Backup is a Lowest Cost (SLA) rule with load balancing enabled across members 1 (port1) and 2 (port2). What does the log indicate?",
    exhibit: String.raw`date=2026-10-28 time=13:40:07 logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Service" serviceid=3 service="Bulk-Backup" member="2(port2)" msg="Service will be load balanced among members with available routing."`,
    options: [
      "Only port2 is now in the rule's load-balancing set; port1 has dropped out",
      "Traffic is now balanced 2:1 in favour of port2",
      "port2 has been removed from the rule, and traffic is balanced across the remaining members",
      "The rule switched from load balancing to the Manual strategy using member 2",
    ],
    answer: [0],
    explanation: "For load-balancing rules, this message lists the members **now** sharing traffic. Fortinet's example writes it when a member stops meeting the SLA: `member=\"2(port2)\"` means only member 2 remains (port1 no longer qualifies); when port1 meets the SLA again the log shows `member=\"2(port2),1(port1)\"`.\n\nThe field lists members, not a ratio, port2 is the member that remains (not the one removed), and the strategy doesn't change.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-050",
    topic: "3.2",
    type: "multi",
    difficulty: 3,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: String.raw`09:31:02 logid="0113022923" subtype="sdwan" eventtype="Service" interface="HUB1-VPN1" member="3" serviceid=2 service="DC-Apps" gateway=10.10.1.1 msg="Member link is unreachable or miss threshold. Stop forwarding traffic. "
09:31:02 logid="0100022921" subtype="system" level="critical" name="DC_HC" interface="HUB1-VPN1" status="down" msg="Static route on interface HUB1-VPN1 may be removed by health-check DC_HC. Route: (10.10.1.2->10.200.1.10 ping-down)"
09:36:44 logid="0100022921" subtype="system" level="critical" name="DC_HC" interface="HUB1-VPN1" status="up" msg="Static route on interface HUB1-VPN1 may be added by health-check DC_HC. Route: (10.10.1.2->10.200.1.10 ping-up)"
09:36:44 logid="0113022923" subtype="sdwan" eventtype="Service" interface="HUB1-VPN1" member="3" serviceid=2 service="DC-Apps" gateway=10.10.1.1 msg="Member link is available. Start forwarding traffic. "`,
    options: [
      "HUB1-VPN1 was declared dead by DC_HC for about five and a half minutes",
      "During the outage, rule DC-Apps stopped sending new traffic to member 3",
      "HUB1-VPN1 stayed alive but was out of SLA during the outage",
      "member=\"3\" refers to the third rule that uses HUB1-VPN1",
      "The health-check server for DC_HC is 10.10.1.1",
    ],
    answer: [0, 1],
    explanation: "The down/up pair of **0100022921** at 09:31:02 and 09:36:44 shows DC_HC declared HUB1-VPN1 dead and then recovered (about 5 min 42 s). The service logs show rule 2 DC-Apps **stopped** and then **started** forwarding to member 3.\n\n- A dead member is not \"alive but out of SLA\"; the routing logs and `status=\"down\"` mean it failed the health check.\n- `member=\"3\"` is the member sequence number.\n- The probe goes 10.10.1.2 -> **10.200.1.10**; 10.10.1.1 is the member's gateway.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-051",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "An administrator is investigating a WAN outage in Log & Report > System Events, filtered to SD-WAN Events. The SDWAN status logs are there, but the \"Static route on interface port2 may be removed\" message is missing. Why?",
    options: [
      "That message is log 0100022921, which has subtype system and is listed with the general system events",
      "That message is generated only when sla-fail-log-period is non-zero",
      "That message is a router event and is written only when a dynamic routing protocol is configured",
      "That message is sent only to FortiAnalyzer, never to local disk or memory",
    ],
    answer: [0],
    explanation: "\"Routing information changed\" (**0100022921**) is `type=\"event\" subtype=\"system\"`, level critical. Filtering on the SD-WAN subtype hides it; look in the general system events.\n\nIt isn't controlled by the SLA log periods, doesn't need dynamic routing (it's about static routes and update-static-route), and is logged locally like other events.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-052",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The implicit rule uses load-balance-mode measured-volume-based. What is happening to port2?",
    exhibit: String.raw`date=2026-10-28 time=14:12:53 logid="0113022924" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN volume status" eventtype="Volume" interface="port2" member="2" msg="Member enters into conservative status with limited ablity to receive new sessions for too much traffic."`,
    options: [
      "port2 is over its configured volume share and gets limited new sessions",
      "port2 failed its health check and is removed from the implicit rule",
      "port2 crossed its spillover threshold, so all new sessions go to port1",
      "port2 is out of SLA, so SD-WAN rules stop using it",
    ],
    answer: [0],
    explanation: "**0113022924** (SDWAN volume status) is written when SD-WAN calculates that a member is over its configured session or volume ratio; the member gets limited ability to receive new sessions. A matching log is written when it resumes normal status.\n\nHealth-check failures, spillover thresholds (usage-based mode) and SLA failures are different mechanisms with different logs and diagnose output.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-053",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which strategy does rule 2 DC-Apps use, and which member does it now prefer?",
    exhibit: String.raw`date=2026-10-28 time=15:07:19 logid="0113022923" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN status" eventtype="Service" serviceid=2 service="DC-Apps" metric="latency" seq="4,3" msg="Service prioritized by performance metric will be redirected in sequence order."`,
    options: [
      "Best Quality with latency as the link-cost factor; it now prefers member 4",
      "Lowest Cost (SLA); it now prefers member 3",
      "Manual; member 4 was moved to the top of the interface preference",
      "Best Quality with latency as the link-cost factor; it now prefers member 3",
    ],
    answer: [0],
    explanation: "\"Service prioritized by **performance metric**\" with `metric=\"latency\"` is the Best Quality (`mode priority`) message; Lowest Cost (SLA) rules log \"prioritized by SLA\". `seq=\"4,3\"` is the new order, so member **4** is preferred.\n\nManual rules don't reorder members automatically.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-054",
    topic: "3.2",
    type: "fill",
    difficulty: 1,
    stem: "Which forward traffic log field contains the name of the SD-WAN rule that a session matched?",
    answer: ["vwlname"],
    explanation: "`vwlname` holds the SD-WAN rule name and `vwlid` its ID. `vwlquality` describes the matched rule's member quality and `vwlservice` the application matched by application-based steering.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-055",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Users report slow access to a SaaS application. The administrator searches the forward traffic logs for the users' sessions but finds only sessions that triggered security profile events. The LAN-to-underlay policy is shown below. What explains the missing logs?",
    exhibit: String.raw`FGT-Branch1 # show firewall policy 1
config firewall policy
    edit 1
        set name "LAN-to-Internet"
        set srcintf "port3"
        set dstintf "underlay"
        set action accept
        set srcaddr "all"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set utm-status enable
        set ssl-ssh-profile "certificate-inspection"
        set application-list "default"
        set logtraffic utm
        set nat enable
    next
end`,
    options: [
      "logtraffic utm logs only sessions with security events; set logtraffic all to log every session",
      "SD-WAN traffic is logged only when the policy references the members instead of the zone",
      "Traffic logs for SD-WAN sessions are written only when sla-pass-log-period is set",
      "Certificate inspection suppresses traffic logs for HTTPS sessions",
    ],
    answer: [0],
    explanation: "`set logtraffic utm` (GUI: Security Events) logs only sessions that triggered a security event. To trace steering for every session (and get `vwlid`/`vwlname` for each), use `set logtraffic all`.\n\nPolicies can't reference members, SLA log periods affect event logs only, and certificate inspection doesn't suppress traffic logs.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-056",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The implicit rule uses load-balance-mode source-ip-based. What best explains the two views?",
    exhibit: String.raw`Network > SD-WAN > SD-WAN Zones   (zone underlay)

Sessions view            Volume view (sent + received)
  port1   51%              port1   14%
  port2   49%              port2   86%`,
    options: [
      "Sessions are hashed by source IP, so a few heavy hosts on port2 carry most bytes",
      "port1 is out of SLA, so the implicit rule sends large flows to port2",
      "The Volume view counts only SD-WAN rule traffic, and the Sessions view only implicit rule traffic",
      "source-ip-based mode balances by bytes, so port1 must have a lower weight",
    ],
    answer: [0],
    explanation: "With `source-ip-based`, the implicit rule hashes each source IP to a member: session counts come out roughly even, but the bytes depend on what those hosts do. A few heavy users hashed to port2 skew the Volume donut. If balancing bytes matters, `measured-volume-based` (Volume) or `usage-based` (Spillover) fit better.\n\n- The implicit rule doesn't use SLA targets.\n- Both views count interface traffic regardless of which rule chose the member.\n- source-ip-based doesn't use weights or bytes.",
    lesson: "3.2-sdwan-gui-monitoring",
  },
  {
    id: "d3-057",
    topic: "3.2",
    type: "match",
    difficulty: 2,
    stem: "Match each SDWAN status (0113022923) message to what it means.",
    pairs: [
      ["Member status changed. Member out-of-sla.", "A member failed one SLA target of a health check"],
      ["Number of pass member changed.", "The count of members meeting an SLA target changed"],
      ["Service prioritized by SLA will be redirected in sequence order.", "A Lowest Cost (SLA) rule reordered its members"],
      ["Member link is unreachable or miss threshold. Stop forwarding traffic.", "A rule stopped using a member"],
      ["Service will be load balanced among members with available routing.", "A load-balancing rule's member set changed"],
    ],
    explanation: "All five share logid 0113022923 and are told apart by `eventtype` (Health Check or Service) and `msg`. The health-check messages carry `healthcheck` and `slatargetid`; the service messages carry `serviceid` and `service`, plus `seq` for reordering or `member` for load balancing.",
    lesson: "3.2-sdwan-logs",
  },
  {
    id: "d3-058",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. An application-based SD-WAN rule steers YouTube to port2. The policy applies application control, and the administrator has just started capturing. Why did the first packets to 142.250.136.119 leave port1?",
    exhibit: String.raw`FGT-Branch1 # diagnose sniffer packet any 'host 142.250.136.119' 4
interfaces=[any]
filters=[host 142.250.136.119]
2.104411 port3 in 10.0.1.25.53120 -> 142.250.136.119.443: syn 1288001931
2.104502 port1 out 203.0.113.2.53120 -> 142.250.136.119.443: syn 1288001931
...
9.880112 port3 in 10.0.1.25.53134 -> 142.250.136.119.443: syn 3105529930
9.880198 port2 out 198.51.100.2.53134 -> 142.250.136.119.443: syn 3105529930`,
    options: [
      "The rule matches only after application control learns the application's IP, protocol and port",
      "Application rules apply only to sessions that start after the next health-check interval",
      "port2 was out of SLA during the first session, so the rule skipped it",
      "Application rules are evaluated after the routing table, so the first session used the FIB",
    ],
    answer: [0],
    explanation: "Application steering depends on application control learning the application's 3-tuple. Fortinet's own example shows traffic leaving the other interface **before** the 3-tuple is recognized and the preferred interface afterwards. `diagnose sys sdwan internet-service-app-ctrl-list` shows what's been learned.\n\n- Health-check timing has nothing to do with it.\n- Nothing in the scenario suggests an SLA failure, and port2 is used seconds later.\n- SD-WAN rules, including application rules, are policy routes evaluated **before** the routing table; unlearned traffic simply doesn't match yet.",
    lesson: "3.2-sdwan-logs",
  },
  // ---------------------------------------------------------------- 3.3 Troubleshooting
  {
    id: "d3-059",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. DC_HC has two SLA entries: ID 1 (latency 50 ms, jitter 10 ms, packet loss 1%) and ID 2 (latency 100 ms, jitter 20 ms, packet loss 5%). Which statement is true?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check DC_HC
Health Check(DC_HC):
Seq(3 HUB1-VPN1): state(alive), packet-loss(0.000%) latency(31.402), jitter(0.812) sla_map=0x3
Seq(4 HUB1-VPN2): state(alive), packet-loss(3.000%) latency(29.877), jitter(1.025) sla_map=0x2`,
    options: [
      "HUB1-VPN2 meets SLA 2 but not SLA 1",
      "HUB1-VPN2 meets SLA 1 but not SLA 2",
      "HUB1-VPN1 meets only SLA 2 and SLA 3",
      "Both members meet both SLA entries, because both are alive",
    ],
    answer: [0],
    explanation: "`sla_map` is a bitmap: `0x1` = SLA 1, `0x2` = SLA 2, `0x3` = both. HUB1-VPN1 meets both; HUB1-VPN2 (`0x2`) meets only SLA 2, which fits its 3% loss (over SLA 1's 1%, under SLA 2's 5%).\n\n- The bit order is reversed in the second option.\n- `0x3` means SLA 1 and 2, not 2 and 3.\n- Alive and in SLA are separate tests.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-060",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Member 1 is port1 (cost 0) and member 2 is port2 (cost 10). Through which interface does traffic matching rule 1 leave?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan service4 1
Service(1): Address Mode(IPV4) flags=0x200
  Gen(3), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(sla), sla-compare-order
  Members(2):
    1: Seq_num(2 port2), alive, sla(0x1), gid(0), cfg_order(1), cost(10), selected
    2: Seq_num(1 port1), alive, sla(0x0), gid(0), cfg_order(0), cost(0), selected
  Dst address(1):
        0.0.0.0-255.255.255.255`,
    options: [
      "port2, because port1 fails the required SLA",
      "port1, because it has the lowest cost",
      "Both, because both members are marked selected",
      "port1, because cfg_order(0) always wins in Lowest Cost (SLA) mode",
    ],
    answer: [0],
    explanation: "In `Mode(sla)` (Lowest Cost (SLA)), members that meet the required SLA are preferred, then lowest cost, then configured order. port1 has `sla(0x0)`, so port2 (`sla(0x1)`) is listed **first** and used. Both show `selected` because both are alive and usable, but without load balancing only the first is used.\n\nCost and configuration order only decide among members that meet the SLA.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-061",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which interface does traffic to 10.100.20.0/24 use?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan service4 2
Service(2): Address Mode(IPV4) flags=0x200
  Gen(1), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(manual)
  Members(2):
    1: Seq_num(3 HUB1-VPN1), alive, selected
    2: Seq_num(4 HUB1-VPN2), alive, selected
  Dst address(1):
        10.100.20.0-10.100.20.255`,
    options: [
      "HUB1-VPN1, the first member in the manual preference order",
      "Both tunnels, alternating per session",
      "HUB1-VPN2, because the last selected member is the active one",
      "Whichever tunnel has lower latency, because both are alive",
    ],
    answer: [0],
    explanation: "In **manual** mode every alive member shows `selected`, but traffic uses the **first** member in the configured order: HUB1-VPN1. HUB1-VPN2 takes over only if HUB1-VPN1 becomes unusable.\n\nManual mode has no load balancing unless `load-balance` is enabled (the header would then read `Mode(manual hash-mode=...)`), and it doesn't compare latency.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-062",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The implicit rule uses load-balance-mode usage-based. What happens to new sessions handled by the implicit rule?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan member
Member(1): interface: port1, gateway: 203.0.113.1, priority: 1 1024, weight: 255
  Egress-spillover-threshold: 400kbit/s, ingress-spillover-threshold: 300kbit/s
  Egress-overbps=1, ingress-overbps=0
Member(2): interface: port2, gateway: 198.51.100.1, priority: 1 1024, weight: 254
  Egress-spillover-threshold: 0kbit/s, ingress-spillover-threshold: 0kbit/s
  Egress-overbps=0, ingress-overbps=0`,
    options: [
      "They spill over to port2, because port1 has exceeded its egress spillover threshold",
      "They are dropped, because port1 is over its threshold and port2 has no threshold",
      "They keep using port1, because ingress-overbps is 0",
      "They are balanced by weight, 255 to 254",
    ],
    answer: [0],
    explanation: "In spillover (`usage-based`) mode, traffic uses the first member until it exceeds its spillover threshold; `Egress-overbps=1` shows port1 is over its 400 kbit/s egress threshold, so new sessions go to port2. A threshold of 0 means no limit.\n\n- Over-threshold traffic spills, it isn't dropped.\n- `ingress-overbps=0` only means port1 is under its ingress threshold; the egress flag is what triggers spillover here.\n- The weight values in spillover output aren't a session ratio.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-063",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is true?",
    exhibit: String.raw`FGT-Branch1 # diagnose firewall proute list
list route policy info(vf=root):

id=2130706433(0x7f000001) vwl_service=1(Critical-DIA) vwl_mbr_seq=2 1 dscp_tag=0xff 0xff flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 sport=0-65535 iif=0 dport=1-65535 oif=4(port2) oif=3(port1)
destination(1): 0.0.0.0-255.255.255.255
source(1): 10.0.1.0-10.0.1.255
hit_count=4127 last_used=2026-10-28 09:24:02`,
    options: [
      "SD-WAN rule 1 Critical-DIA currently prefers port2 (member 2) over port1, and it is matching traffic",
      "This is a user-defined policy route that forces traffic from 10.0.1.0/24 out of port2",
      "port1 is dead, because only active members appear in the oif list",
      "The rule has never been hit since it was created, because last_used is in the past",
    ],
    answer: [0],
    explanation: "`vwl_service=1(Critical-DIA)` identifies an SD-WAN rule (user policy routes have no `vwl_service`). `vwl_mbr_seq=2 1` and `oif=4(port2) oif=3(port1)` list the members in **current preference order**, and `hit_count=4127` shows it's matching.\n\n- port1 is still listed, so it's usable as a fallback; it's just second.\n- `hit_count`, not `last_used`, tells you whether the entry has matched: a non-zero count means it has. (Entries that were never hit also carry a `last_used` timestamp.)",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-064",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which component chose port2 as the egress interface for this session?",
    exhibit: String.raw`id=65308 trace_id=1 func=print_pkt_detail line=6143 msg="vd-root:0 received a packet(proto=6, 10.0.1.25:52114->198.51.100.80:443) tun_id=0.0.0.0 from port3. flag [S], seq 2731045522, ack 0, win 64240"
id=65308 trace_id=1 func=init_ip_session_common line=6354 msg="allocate a new session-0001595c"
id=65308 trace_id=1 func=rpdb_srv_match_input line=1182 msg="Match policy routing id=2130706433: to 198.51.100.80 via ifindex-4"
id=65308 trace_id=1 func=vf_ip_route_input_common line=2615 msg="find a route: flag=04000000 gw-198.51.100.1 via port2"
id=65308 trace_id=1 func=fw_forward_handler line=1003 msg="Allowed by Policy-1: SNAT"`,
    options: [
      "A policy route, here the SD-WAN rule with policy-route ID 2130706433",
      "The implicit SD-WAN rule, using source-ip-based hashing",
      "Firewall policy 1",
      "The static default route with the lowest priority",
    ],
    answer: [0],
    explanation: "`Match policy routing id=2130706433 ... via ifindex-4` shows a **policy route** chose the egress. SD-WAN rules are policy routes; `diagnose firewall proute list` maps that ID to `vwl_service=<id>(<name>)`. The following `find a route` line resolves the gateway for that member.\n\n- With the implicit rule there's no `Match policy routing` line; the route comes from the FIB.\n- Firewall policy 1 allows and NATs the session after routing.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-065",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator moved HUB1-VPN2 from zone overlay to a new zone overlay2 so that rule DC-Apps could prefer it. Since then, traffic to 10.100.20.10 fails. What is the cause?",
    exhibit: String.raw`id=65308 trace_id=4 func=print_pkt_detail line=6143 msg="vd-root:0 received a packet(proto=6, 10.0.1.30:50322->10.100.20.10:443) tun_id=0.0.0.0 from port3. flag [S], seq 118223409, ack 0, win 64240"
id=65308 trace_id=4 func=init_ip_session_common line=6354 msg="allocate a new session-000159a1"
id=65308 trace_id=4 func=rpdb_srv_match_input line=1182 msg="Match policy routing id=2130706434: to 10.100.20.10 via ifindex-7"
id=65308 trace_id=4 func=vf_ip_route_input_common line=2615 msg="find a route: flag=00000000 gw-10.10.2.1 via HUB1-VPN2"
id=65308 trace_id=4 func=fw_forward_handler line=874 msg="Denied by forward policy check (policy 0)"

FGT-Branch1 # show firewall policy 2
config firewall policy
    edit 2
        set srcintf "port3"
        set dstintf "overlay"
        set action accept
        ...`,
    options: [
      "No firewall policy allows port3 to zone overlay2; the policy still references zone overlay",
      "The SD-WAN rule doesn't match, so the implicit rule sends the traffic to a blackhole",
      "HUB1-VPN2 is dead, so the session is denied by the health check",
      "Policy routes can't point to IPsec tunnels, so policy 0 drops the packet",
    ],
    answer: [0],
    explanation: "The SD-WAN rule matched (`Match policy routing ... via ifindex-7`) and the route lookup found HUB1-VPN2, but `Denied by forward policy check (policy 0)` means **no firewall policy matched** (policy 0 = implicit deny). Policies reference zones; policy 2 covers zone overlay, and HUB1-VPN2 is now in overlay2.\n\nSteering worked, the tunnel is alive (a dead member wouldn't be chosen), and SD-WAN rules commonly use tunnels.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-066",
    topic: "3.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Rule 1 Critical-DIA (destination 192.0.2.0/24, members port1 and port2) has a hit count of 0, and traffic to 192.0.2.80 leaves through port3. Why?",
    exhibit: String.raw`FGT-Branch1 # get router info routing-table all
...
Routing table for VRF=0
S*      0.0.0.0/0 [1/0] via 203.0.113.1, port1
                  [1/0] via 198.51.100.1, port2
S       192.0.2.0/24 [10/0] via 10.0.1.254, port3
C       10.0.1.0/24 is directly connected, port3
C       198.51.100.0/30 is directly connected, port2
C       203.0.113.0/30 is directly connected, port1`,
    options: [
      "The FIB best match for 192.0.2.80 is via port3, which isn't an SD-WAN member",
      "The SD-WAN rule is evaluated after the routing table, and the /24 static route matches first",
      "The /24 route has distance 10, which is lower priority than SD-WAN rules, so the rule is disabled",
      "Critical-DIA needs a health check, and rules without one are always skipped",
    ],
    answer: [0],
    explanation: "Before using an SD-WAN rule, FortiOS checks the FIB: the **best match for the destination must be an SD-WAN member**, and a route must exist over the chosen member. The /24 via port3 is more specific than the default route, and port3 isn't a member, so the rule is skipped and the packet follows the routing table to port3.\n\n- Policy routes, including SD-WAN rules, are checked **before** the routing table; the FIB check is what disqualifies the rule.\n- Distance doesn't disable rules.\n- Manual rules don't need a health check.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-067",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. What does the session entry show?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys session list
session info: proto=6 proto_state=01 duration=212 expire=3388 timeout=3600 flags=00000000 socktype=0 sockport=0 av_idx=0 use=4
...
orgin->sink: org pre->post, reply pre->post dev=5->3/3->5 gwy=203.0.113.1/10.0.1.40
hook=post dir=org act=snat 10.0.1.40:51022->192.0.2.80:443(203.0.113.2:51022)
hook=pre dir=reply act=dnat 192.0.2.80:443->203.0.113.2:51022(10.0.1.40:51022)
misc=0 policy_id=1 pol_uuid_idx=15 auth_info=0 chk_client_info=0 vd=0
serial=00016a2e tos=ff/ff app_list=0 app=0 url_cat=0
sdwan_mbr_seq=1 sdwan_service_id=2
rpdb_link_id=ff000002 rpdb_svc_id=0 ngfwid=n/a`,
    options: [
      "SD-WAN rule 2 chose member 1, and the session is source-NATed to 203.0.113.2",
      "The session uses SD-WAN rule 1 and member 2",
      "The session is handled by the implicit rule because sdwan_service_id is not 0",
      "The session is denied by policy 1 and waiting to expire",
    ],
    answer: [0],
    explanation: "`sdwan_service_id=2` is the SD-WAN rule and `sdwan_mbr_seq=1` the member sequence. `dev=5->3` (port3 to port1), `gwy=203.0.113.1` and `act=snat ... (203.0.113.2:51022)` show the egress, next hop and NAT. `proto_state=01` is an established TCP session allowed by policy 1.\n\nThe second option swaps the values; a non-zero service ID means a rule matched; denied traffic doesn't create an established session like this.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-068",
    topic: "3.3",
    type: "fill",
    difficulty: 1,
    stem: "On FortiOS 7.6, which diagnose command shows the status of all IPv4 SD-WAN rules, including the strategy and the current member order?",
    answer: ["diagnose sys sdwan service4", "diag sys sdwan service4", "diagnose system sdwan service4"],
    explanation: "`diagnose sys sdwan service4` lists the IPv4 rules (add an ID for one rule). Since FortiOS 7.4.4, the older `diagnose sys sdwan service` is split into `service4` and `service6`.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-069",
    topic: "3.3",
    type: "fill",
    difficulty: 1,
    stem: "Which diagnose command lists the kernel's policy-route table, where SD-WAN rules appear with vwl_service, their member order and hit counts?",
    answer: ["diagnose firewall proute list", "diag firewall proute list", "diag fire proute list"],
    explanation: "`diagnose firewall proute list` shows policy routes, SD-WAN rules (`vwl_service=<id>(<name>)`) and Internet Service routes, with `oif` order and `hit_count`.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-070",
    topic: "3.3",
    type: "fill",
    difficulty: 2,
    stem: "Write the command that shows the last 10 minutes of SLA probe results for member sequence 2 in health check Internet_HC.",
    answer: ["diagnose sys sdwan sla-log Internet_HC 2", "diag sys sdwan sla-log Internet_HC 2", "diagnose system sdwan sla-log Internet_HC 2"],
    explanation: "`diagnose sys sdwan sla-log <health-check> <seq>` prints the short (about 10-minute) SLA history for one member: status, latency, jitter and packet loss per sample. The arguments are the health-check name and the **member sequence number**, not the interface name.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-071",
    topic: "3.3",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. Internet_HC uses the default failtime and recoverytime. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(18.220), jitter(1.904) sla_map=0x1
Seq(2 port2): state(dead), packet-loss(100.000%) sla_map=0x0`,
    options: [
      "port2 missed at least five consecutive probes",
      "port2 must answer five consecutive probes before it is considered alive again",
      "port2 is alive but out of SLA, because its sla_map is 0x0",
      "port1 meets SLA target 2 of Internet_HC",
      "Rules that use port2 keep sending traffic to it until an administrator disables the member",
    ],
    answer: [0, 1],
    explanation: "A member goes dead after `failtime` consecutive failures (default 5) and is restored after `recoverytime` consecutive successes (default 5).\n\n- `state(dead)` is not \"alive but out of SLA\".\n- port1's `sla_map=0x1` is SLA target 1 only.\n- Rules stop using a dead member automatically.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-072",
    topic: "3.3",
    type: "multi",
    difficulty: 2,
    stem: "The implicit rule uses load-balance-mode weight-based. Which two pieces of information does diagnose sys sdwan member show for each member? (Choose two.)",
    options: [
      "The current session count",
      "The member's weight",
      "Config volume ratio and volume room",
      "Egress and ingress spillover thresholds",
      "The sla_map of each health check",
    ],
    answer: [0, 1],
    explanation: "In weight-based mode, `diagnose sys sdwan member` shows each member's interface, gateway, priority and **weight**, plus a **Session count** line.\n\n- Volume ratio and volume room appear in measured-volume-based mode.\n- Spillover thresholds and over-bps flags appear in usage-based mode.\n- `sla_map` is in `diagnose sys sdwan health-check`.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-073",
    topic: "3.3",
    type: "order",
    difficulty: 2,
    stem: "Put the steps of a debug flow capture for traffic to 198.51.100.80 in the correct order.",
    items: [
      "diagnose debug flow filter clear",
      "diagnose debug flow filter addr 198.51.100.80",
      "diagnose debug enable and diagnose debug flow trace start 10",
      "Generate the traffic and read the trace for the Match policy routing and policy lines",
      "diagnose debug flow trace stop and diagnose debug disable",
    ],
    explanation: "Clear old filters first so they don't hide the traffic, set the new filter, enable debug output and start the trace for a number of packets (without `diagnose debug enable` nothing is printed), generate and read the traffic, then stop the trace and disable debug output.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-074",
    topic: "3.3",
    type: "order",
    difficulty: 2,
    stem: "An administrator wants a test session to 192.0.2.80 to be re-routed after changing an SD-WAN rule, without affecting other sessions. Put the commands in the correct order.",
    items: [
      "diagnose sys session filter clear",
      "diagnose sys session filter dst 192.0.2.80",
      "diagnose sys session list",
      "diagnose sys session clear",
    ],
    explanation: "Clear any old filter, set a filter for the destination, **list** to confirm only the intended sessions match, then `diagnose sys session clear`, which removes only the sessions matching the current filter. Without a filter, clear removes every session on the VDOM.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-075",
    topic: "3.3",
    type: "match",
    difficulty: 2,
    stem: "Match each diagnose command to the information it is used for.",
    pairs: [
      ["diagnose sys sdwan health-check", "Alive/dead state and sla_map of each member"],
      ["diagnose sys sdwan member", "Implicit-rule state such as session count, volume room or spillover flags"],
      ["diagnose sys sdwan service4", "Strategy and current member order of each SD-WAN rule"],
      ["diagnose sys sdwan intf-sla-log", "About 15 minutes of per-interface bandwidth history"],
      ["diagnose sys sdwan sla-log", "About 10 minutes of per-member probe history"],
      ["diagnose firewall proute list", "Policy-route entries with oif order and hit count"],
    ],
    explanation: "These are the SD-WAN diagnose commands documented for FortiOS 7.6. Use health-check for member health, member for the implicit rule, service4 for rules, the two log commands for short history, and proute list for what the kernel actually uses.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-076",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Rule DC-Apps uses Best Quality with link-cost-factor latency and the default link-cost-threshold. HUB1-VPN1 is listed first in the rule's interface preference. Why is HUB1-VPN1 still first even though HUB1-VPN2 has lower latency?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan service4 2
Service(2): Address Mode(IPV4) flags=0x200
  Gen(5), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(priority), link-cost-factor(latency), link-cost-threshold(10), health-check(DC_HC)
  Members(2):
    1: Seq_num(3 HUB1-VPN1), alive, latency: 31.402, selected
    2: Seq_num(4 HUB1-VPN2), alive, latency: 29.877, selected
  Dst address(1):
        10.100.0.0-10.100.255.255`,
    options: [
      "HUB1-VPN2 is less than 10% better, so the link-cost-threshold keeps HUB1-VPN1 first",
      "Best Quality rules ignore any latency difference smaller than 5 ms",
      "HUB1-VPN1 has a lower member cost, which Best Quality uses as a tie-breaker",
      "Best Quality always uses the first configured member while it is alive",
    ],
    answer: [0],
    explanation: "With the default `link-cost-threshold(10)`, another member must be more than 10% better before it overtakes the first-listed member. 29.877 ms is under 5% better than 31.402 ms, so HUB1-VPN1 stays first. This avoids flapping between nearly equal links.\n\n- There's no fixed 5 ms rule.\n- Cost is used by Lowest Cost (SLA), not Best Quality.\n- Best Quality does move to a clearly better member.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-077",
    topic: "3.3",
    type: "multi",
    difficulty: 2,
    stem: "Which two commands show the order in which an SD-WAN rule currently prefers its members? (Choose two.)",
    options: [
      "diagnose sys sdwan service4",
      "diagnose firewall proute list",
      "diagnose sys sdwan member",
      "diagnose sys sdwan health-check",
      "get router info routing-table all",
      "diagnose sys sdwan intf-sla-log port1",
    ],
    answer: [0, 1],
    explanation: "`service4` lists each rule's members in current preference order, and `proute list` shows the same order in `vwl_mbr_seq` and the `oif` list.\n\n`member` covers the implicit rule, `health-check` member health, the routing table the FIB, and `intf-sla-log` bandwidth history; none of them shows per-rule order.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-078",
    topic: "3.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. DC_HC probes the data center server 10.200.1.10, which is reachable only through the IPsec overlays. Why is port1 dead in DC_HC although Internet traffic through port1 works?",
    exhibit: String.raw`FGT-Branch1 # show system sdwan
config system sdwan
    set status enable
    config health-check
        edit "DC_HC"
            set server "10.200.1.10"
            set members 0
        next
    end
end

FGT-Branch1 # diagnose sys sdwan health-check DC_HC
Health Check(DC_HC):
Seq(1 port1): state(dead), packet-loss(100.000%) sla_map=0x0
Seq(2 port2): state(dead), packet-loss(100.000%) sla_map=0x0
Seq(3 HUB1-VPN1): state(alive), packet-loss(0.000%) latency(31.402), jitter(0.812) sla_map=0x1
Seq(4 HUB1-VPN2): state(alive), packet-loss(0.000%) latency(29.877), jitter(1.025) sla_map=0x1`,
    options: [
      "members 0 makes every member probe the private server, which the underlays can't reach; limit DC_HC to the overlays",
      "port1 has an intermittent hardware fault that only the health-check probes detect",
      "Health checks can use only one member at a time, so port1 and port2 are skipped",
      "The DC_HC server must be a public IP address for the underlay members to be reported alive",
    ],
    answer: [0],
    explanation: "`set members 0` means all SD-WAN members participate, so port1 and port2 probe 10.200.1.10 directly over the Internet, where a private data-center address isn't reachable. They show dead in DC_HC even though they're fine for Internet traffic (and with `update-static-route` their static routes may be withdrawn). Limit DC_HC to `set members 3 4`.\n\nThere's no fault, a health check can probe through several members, and the server's address type isn't the problem: reachability per member is.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-079",
    topic: "3.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. port1 recovered ten minutes ago and Critical-DIA again prefers port1, but this long-lived SNAT session still uses port2. snat-route-change is at its default. What explains this?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan service4 1
...
    1: Seq_num(1 port1), alive, sla(0x1), gid(0), cfg_order(0), cost(0), selected
    2: Seq_num(2 port2), alive, sla(0x1), gid(0), cfg_order(1), cost(10), selected

FGT-Branch1 # diagnose sys session list
session info: proto=6 proto_state=01 duration=1843 expire=3597 timeout=3600 ...
orgin->sink: org pre->post, reply pre->post dev=5->4/4->5 gwy=198.51.100.1/10.0.1.25
hook=post dir=org act=snat 10.0.1.25:50110->192.0.2.90:22(198.51.100.2:50110)
...
sdwan_mbr_seq=2 sdwan_service_id=1`,
    options: [
      "SNAT sessions keep their egress while the old route is still valid, unless snat-route-change is enabled",
      "The session is stuck on port2 because port2 is out of SLA",
      "The SD-WAN rule hasn't updated, because service4 caches member order until sessions expire",
      "Sessions always stay on the member chosen at session start, whatever the configuration",
    ],
    answer: [0],
    explanation: "After a route change, routing information is flushed from non-SNAT sessions, but **SNAT sessions keep their outbound interface** as long as the old route is still active, because changing interface would change the source NAT address. `set snat-route-change enable` under `config system global` (default disable) makes them do a new lookup. Clearing just this session also works.\n\n- port2 shows `sla(0x1)`, so it isn't out of SLA.\n- `service4` already shows the new order.\n- Non-SNAT sessions can be re-routed, so \"always\" is wrong.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-080",
    topic: "3.3",
    type: "single",
    difficulty: 1,
    stem: "During a maintenance window, an administrator connected over SSH runs diagnose sys session clear to test a new SD-WAN rule, without setting a session filter first. What is the result?",
    options: [
      "Every session on the VDOM is cleared, including the SSH session",
      "Only sessions that match an SD-WAN rule are cleared",
      "Nothing is cleared, because a filter is mandatory",
      "Only sessions older than the rule change are cleared",
    ],
    answer: [0],
    explanation: "`diagnose sys session clear` removes the sessions matching the **current filter**; with no filter, that's all of them, user traffic and management sessions alike. Always `filter clear`, set a specific filter, `list`, then clear.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-081",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Ten minutes ago the default route had two ECMP paths, through port1 and port2. What removed the port2 path?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan health-check Internet_HC
Health Check(Internet_HC):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(18.220), jitter(1.904) sla_map=0x1
Seq(2 port2): state(dead), packet-loss(100.000%) sla_map=0x0

FGT-Branch1 # get router info routing-table all
...
S*      0.0.0.0/0 [1/0] via 203.0.113.1, port1
C       10.0.1.0/24 is directly connected, port3
C       198.51.100.0/30 is directly connected, port2
C       203.0.113.0/30 is directly connected, port1`,
    options: [
      "Internet_HC declared port2 dead, and update-static-route withdrew the static route through port2",
      "port2's interface went administratively down, which also removed its connected route",
      "The implicit rule removed port2 because its weight was 0",
      "An SD-WAN rule overrode the routing table and deleted the route",
    ],
    answer: [0],
    explanation: "port2 is `state(dead)`, and with `update-static-route` (enabled by default) the member's static routes are removed while it's dead and restored on recovery (log 0100022921).\n\n- The connected route for 198.51.100.0/30 is still present, so port2 is up at the interface level.\n- The implicit rule only chooses among the routes that exist; it doesn't remove them, and member weight matters only in weight-based mode.\n- SD-WAN rules don't delete routes.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-082",
    topic: "3.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Rule 2 Office365 never gets hits. What is the reason?",
    exhibit: String.raw`FGT-Branch1 # diagnose firewall proute list
list route policy info(vf=root):

id=2130706433(0x7f000001) vwl_service=1(Critical-DIA) vwl_mbr_seq=1 2 dscp_tag=0xff 0xff flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 sport=0-65535 iif=0 dport=1-65535 oif=3(port1) oif=4(port2)
destination(1): 0.0.0.0-255.255.255.255
source(1): 10.0.1.0-10.0.1.255
hit_count=91312 last_used=2026-10-28 16:02:44

id=2130706434(0x7f000002) vwl_service=2(Office365) vwl_mbr_seq=2 1 dscp_tag=0xff 0xff flags=0x0 tos=0x00 tos_mask=0x00 protocol=0 sport=0-65535 iif=0 dport=1-65535 oif=4(port2) oif=3(port1)
destination wildcard(1): 0.0.0.0/0.0.0.0
source(1): 10.0.1.0-10.0.1.255
internet service(1): Microsoft-Office365(327782,0,0,0,0)
hit_count=0 last_used=2026-10-27 08:15:10`,
    options: [
      "Rule 1 matches the same source with any destination and is checked first",
      "Rule 2 is missing a health check, so FortiOS keeps it in the table with zero hits",
      "Internet Service rules are evaluated after the routing table",
      "port2 is listed first in rule 2, and rules that prefer the higher-cost member are skipped",
    ],
    answer: [0],
    explanation: "SD-WAN rules are checked top-down and the first match wins. Rule 1 matches every destination for 10.0.1.0/24, so Office 365 sessions from that subnet match it first. Move Office365 above Critical-DIA (or narrow rule 1).\n\nA health check isn't required, Internet Service rules are policy routes evaluated before the routing table, and member order doesn't disqualify a rule.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-083",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. An application-based rule for YouTube never matches on FGT-Branch1. What should the administrator check first?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan internet-service-app-ctrl-list
FGT-Branch1 #

FGT-Branch1 # show firewall policy 1
config firewall policy
    edit 1
        set srcintf "port3"
        set dstintf "underlay"
        set action accept
        set srcaddr "all"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end`,
    options: [
      "Apply application control on the policy so the FortiGate can learn the application's IP, protocol and port",
      "Add a performance SLA to the rule, because application rules need SLA data before they can match",
      "Change the policy's destination to the member interfaces instead of the zone",
      "Enable set snat-route-change so the learned applications are written to the list",
    ],
    answer: [0],
    explanation: "The learned-application list is empty and the policy has no application control. Application-based steering needs the policy to inspect traffic with application control (`utm-status enable` plus an `application-list`) so FortiOS learns each application's 3-tuple; until then the rule can't match.\n\nSLAs aren't required for matching, policies can't reference members, and `snat-route-change` is about re-routing SNAT sessions.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-084",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The implicit rule uses load-balance-mode measured-volume-based with volume-ratio 33 on port1 and 66 on port2. Which statement is true?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan member
Member(1): interface: port1, gateway: 203.0.113.1, priority: 1 1024, weight: 0
  Config volume ratio: 33, last reading: 1287767633B, overload volume 517MB
Member(2): interface: port2, gateway: 198.51.100.1, priority: 1 1024, weight: 63
  Config volume ratio: 66, last reading: 1686997898B, volume room 63MB`,
    options: [
      "port1 is over its volume share, so new sessions favour port2",
      "port1 is dead, because a weight of 0 marks a failed member",
      "port2 is overloaded by 63 MB and receives no new sessions",
      "Both members are still under their configured volume target",
    ],
    answer: [0],
    explanation: "In volume mode, `overload volume` means the member is over its configured share and `volume room` means it still has room. port1 is over by 517 MB, so sessions are steered to port2 until the measured volumes match the 33:66 ratio (the FortiGate can log 0113022924 for this).\n\nThe weight shown is the dynamic weight in this mode, not member health; port2 has *room*, not overload.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-085",
    topic: "3.3",
    type: "fill",
    difficulty: 1,
    stem: "In a debug flow trace, a packet that no firewall policy allows is reported as \"Denied by forward policy check (policy N)\". What number is N for the implicit deny?",
    answer: ["0"],
    explanation: "`Denied by forward policy check (policy 0)` means no configured policy matched the ingress interface, egress zone, addresses and service, so the implicit deny (policy 0) dropped it.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-086",
    topic: "3.3",
    type: "multi",
    difficulty: 3,
    stem: "With the default rule settings (set default disable, set gateway disable), which two FIB conditions must be true before FortiOS uses an SD-WAN rule member for a destination? (Choose two.)",
    options: [
      "The FIB best match for the destination must be an SD-WAN member",
      "A FIB route to the destination must exist over the chosen member",
      "The member's static route must have the lowest administrative distance on the FortiGate",
      "A FIB route to the member's gateway must exist over any interface",
      "Every member of the rule must have an active default route",
    ],
    answer: [0, 1],
    explanation: "Fortinet documents two FIB lookups: the **best match must return an SD-WAN member**, and a **route to the destination must exist over the desired member**.\n\n- \"A route to the gateway over any interface\" replaces the second check only when `set gateway enable` is used.\n- Distance comparisons and default routes on every member aren't required.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-087",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. What selected port1 for this session?",
    exhibit: String.raw`id=65308 trace_id=9 func=print_pkt_detail line=6143 msg="vd-root:0 received a packet(proto=6, 10.0.1.77:60211->192.0.2.44:443) tun_id=0.0.0.0 from port3. flag [S], seq 99102344, ack 0, win 64240"
id=65308 trace_id=9 func=init_ip_session_common line=6354 msg="allocate a new session-00016c01"
id=65308 trace_id=9 func=vf_ip_route_input_common line=2615 msg="find a route: flag=04000000 gw-203.0.113.1 via port1"
id=65308 trace_id=9 func=fw_forward_handler line=1003 msg="Allowed by Policy-1: SNAT"`,
    options: [
      "The FIB lookup, where the implicit rule picks among the ECMP member routes",
      "An SD-WAN rule that lists port1 as its preferred member",
      "Firewall policy 1, which names port1 as its outgoing interface",
      "A user-defined policy route for the LAN subnet",
    ],
    answer: [0],
    explanation: "There is **no `Match policy routing` line**, so no policy route or SD-WAN rule matched. The egress came from the FIB lookup (`find a route ... via port1`), where the implicit rule's `load-balance-mode` picks among the ECMP member routes.\n\nSD-WAN rules and user policy routes would both appear as `Match policy routing`, and the policy references the zone, not port1.",
    lesson: "3.3-troubleshooting-workflow",
  },
  {
    id: "d3-088",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Users say the application behind rule 2 is slow between 09:20 and 09:22. What does the output show?",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan sla-log DC_HC 3
Timestamp: Wed Oct 28 09:19:58 2026, vdom root, health-check DC_HC, interface: HUB1-VPN1, status: up, latency: 31.208, jitter: 0.911, packet loss: 0.000%.
...
Timestamp: Wed Oct 28 09:20:31 2026, vdom root, health-check DC_HC, interface: HUB1-VPN1, status: up, latency: 188.554, jitter: 41.906, packet loss: 0.000%.
...
Timestamp: Wed Oct 28 09:21:47 2026, vdom root, health-check DC_HC, interface: HUB1-VPN1, status: up, latency: 192.020, jitter: 39.317, packet loss: 0.000%.
...
Timestamp: Wed Oct 28 09:22:40 2026, vdom root, health-check DC_HC, interface: HUB1-VPN1, status: up, latency: 30.877, jitter: 0.802, packet loss: 0.000%.`,
    options: [
      "HUB1-VPN1 stayed up, but latency and jitter rose sharply",
      "HUB1-VPN1 was dead between 09:20 and 09:22",
      "HUB1-VPN1 lost packets between 09:20 and 09:22",
      "Member 3 isn't HUB1-VPN1, so the output belongs to another rule",
    ],
    answer: [0],
    explanation: "`sla-log DC_HC 3` is the short probe history of member 3 (HUB1-VPN1) in DC_HC. Status stays `up` with 0% loss, but latency jumps from ~31 ms to ~190 ms and jitter to ~40 ms, then recovers. Whether rules moved away depends on their strategy and SLA targets; check `service4` and the 0113022923 logs.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-089",
    topic: "3.3",
    type: "multi",
    difficulty: 3,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FGT-Branch1 # diagnose sys sdwan service4
Service(1): Address Mode(IPV4) flags=0x200
  Gen(2), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(load-balance hash-mode=round-robin)
  Members(2):
    1: Seq_num(1 port1), alive, sla(0x1), gid(2), num of pass(1), selected
    2: Seq_num(2 port2), alive, sla(0x1), gid(2), num of pass(1), selected
  Dst address(1):
        0.0.0.0-255.255.255.255

Service(2): Address Mode(IPV4) flags=0x200
  Gen(1), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(manual)
  Members(2):
    1: Seq_num(3 HUB1-VPN1), alive, selected
    2: Seq_num(4 HUB1-VPN2), alive, selected
  Dst address(1):
        10.100.0.0-10.100.255.255`,
    options: [
      "Rule 1 distributes sessions over both port1 and port2",
      "Rule 2 sends its traffic through HUB1-VPN1",
      "Rule 2 distributes sessions over both tunnels",
      "Rule 1 is a Best Quality rule using round-robin as its link-cost factor",
      "Rule 1 uses only port1, because it is listed first",
    ],
    answer: [0, 1],
    explanation: "`Mode(load-balance hash-mode=round-robin)` with `sla(0x1)` on each member is a Lowest Cost (SLA) rule with load balancing enabled (a Manual rule with load balancing reads `Mode(manual hash-mode=...)` instead). Both members meet the SLA, so both carry sessions. Rule 2 is manual: both are marked selected, but traffic uses the first member, HUB1-VPN1.\n\n- Manual mode doesn't spread sessions unless load balancing is on.\n- round-robin is a `hash-mode`, not a link-cost factor; Best Quality reads `Mode(priority)`.\n- With load balancing, all selected members are used.",
    lesson: "3.3-sdwan-diagnose-output",
  },
  {
    id: "d3-090",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Health check DC_HC shows HUB1-VPN2 as dead, while users reach the data center through HUB1-VPN2 without problems. The sniffer runs on FGT-Branch1. What is the most likely cause?",
    exhibit: String.raw`FGT-Branch1 # diagnose sniffer packet HUB1-VPN2 'host 10.200.1.10 and icmp' 4
interfaces=[HUB1-VPN2]
filters=[host 10.200.1.10 and icmp]
4.812301 HUB1-VPN2 out 10.10.2.2 -> 10.200.1.10: icmp: echo request
5.312455 HUB1-VPN2 out 10.10.2.2 -> 10.200.1.10: icmp: echo request
5.812601 HUB1-VPN2 out 10.10.2.2 -> 10.200.1.10: icmp: echo request`,
    options: [
      "Probes leave HUB1-VPN2 but get no replies, so the hub side drops or misroutes them",
      "The FortiGate isn't sending any health-check probes through HUB1-VPN2",
      "The probe interval is too short; probes every 500 ms always fail on tunnels",
      "HUB1-VPN2 is out of SLA, which the health-check output reports as dead",
    ],
    answer: [0],
    explanation: "The sniffer shows echo requests going out every 500 ms (the default interval) and **no replies**. User traffic works, so the tunnel is fine; the replies to the probe source 10.10.2.2 are being dropped or misrouted beyond the branch (for example no return route for the tunnel subnet, or a hub policy that doesn't allow the probes).\n\n- The probes clearly leave the interface.\n- 500 ms is the default and works on tunnels.\n- Dead means failed probes; out of SLA is reported separately in `sla_map`.",
    lesson: "3.3-troubleshooting-workflow",
  },
];
