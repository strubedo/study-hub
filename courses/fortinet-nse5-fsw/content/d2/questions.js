// Domain 2 — Deployment and management: question bank (FortiOS 7.6 / FortiSwitchOS 7.6).
// Original exam-style items (not brain-dump material). Options are shuffled by the app.
// Build numbers in get-conn-status exhibits are illustrative; no answer depends on them.

const CONN_HDR = `Managed-devices in current vdom root:

FortiLink interface : fortilink
SWITCH-ID         VERSION           STATUS             FLAG   ADDRESS          JOIN-TIME                  SERIAL`;
const CONN_LEGEND = `         Flags: C=config sync, U=upgrading, S=staged, D=delayed reboot pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External`;

export default [
  // ---------------------------------------------------------------- 2.1
  {
    id: 'd2-001',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FSW-Core1 is managed. A second FortiSwitch, S248EPTF18000102, was cabled to FSW-Core1 and appears in the list but never becomes managed. What must the administrator do?',
    exhibit: `FGT-HQ # show system interface fortilink
config system interface
    edit "fortilink"
        set vdom "root"
        set fortilink enable
        set ip 10.255.1.1 255.255.255.0
        set type aggregate
        set member "port9" "port10"
        set lldp-reception enable
        set lldp-transmission enable
    next
end

FGT-HQ # execute switch-controller get-conn-status
${CONN_HDR}
FSW-Core1         v7.6.1 (1047)     Authorized/Up      2      10.255.1.2       Thu Oct 29 08:14:02 2026   S248EPTF18000101
S248EPTF18000102  N/A               Discovered/Down    2                       N/A                        S248EPTF18000102

${CONN_LEGEND}
         Managed-Switches: 2 (UP: 1 DOWN: 1 MAX: 32)`,
    options: [
      'Authorize the switch, for example with `set fsw-wan1-admin enable` in its `config switch-controller managed-switch` entry, because automatic authorization is not enabled on the FortiLink interface.',
      'Disable `fortilink-split-interface`, because the second switch is connected through the standby member of the aggregate.',
      'Change `fortilink-neighbor-detect` to `fortilink`, because LLDP cannot discover a switch through an ISL.',
      'Upgrade the FortiGate license, because the FortiGate has reached its managed-switch limit.',
    ],
    answer: [0],
    explanation: "The status **Discovered/Down** means the FortiGate sees the switch but it isn't authorized. `show` hides default values, and `auto-auth-extension-device` defaults to `disable`, so this FortiLink interface doesn't authorize switches automatically. Authorize it in the GUI or with `set fsw-wan1-admin enable` (or enable `auto-auth-extension-device` for future switches).\n\n- The new switch is behind FSW-Core1 through an auto-ISL; the split interface only concerns the two FortiGate aggregate members.\n- LLDP neighbor detection (the 7.6.1 default) discovers switches behind ISLs fine — this one *was* discovered.\n- `MAX: 32` with only two entries is nowhere near the model limit.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-002',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Both port9 and port10 of FGT-HQ are cabled to FSW-Access1, the only FortiSwitch in the network. The administrator notices that only one of the two links ever carries traffic. What should the administrator change?',
    exhibit: `FGT-HQ # show system interface fortilink
config system interface
    edit "fortilink"
        set vdom "root"
        set fortilink enable
        set ip 10.255.1.1 255.255.255.0
        set type aggregate
        set member "port9" "port10"
        set auto-auth-extension-device enable
    next
end`,
    options: [
      'Disable `fortilink-split-interface` on the FortiLink interface.',
      'Enable `fortilink-split-interface` on the FortiLink interface.',
      'Assign the `default-auto-mclag-icl` LLDP profile to the FortiSwitch uplink ports.',
      'Change the FortiLink interface type to a hardware switch.',
    ],
    answer: [0],
    explanation: "`fortilink-split-interface` is **enabled by default** (so `show` doesn't print it). It is meant for an aggregate whose two members go to **two different** switches, and it keeps only one link active. When all members go to the **same** switch, disable it so the aggregate bundles both links.\n\n- It is already enabled — that is the problem.\n- `default-auto-mclag-icl` is for the ICL between two MCLAG peers; there is only one switch.\n- A hardware-switch FortiLink isn't recommended and wouldn't create a LAG.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-003',
    topic: '2.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about the default FortiLink interface on a FortiGate running FortiOS 7.6.1 are true? (Choose two.)',
    options: [
      'It is created as an 802.3ad aggregate, or as a hardware switch on models that do not support aggregate interfaces.',
      'FortiLink can be enabled on any Ethernet port except the HA and MGMT ports.',
      'Automatic authorization of discovered switches is enabled by default.',
      'FortiLink neighbor detection uses the proprietary FortiLink method by default.',
      'FortiLink is supported when the FortiGate operates in transparent mode.',
      'The FortiLink split interface is disabled by default.',
    ],
    answer: [0, 1],
    explanation: "The FortiLink interface is created automatically as an **aggregate** (a **hardware switch** where aggregates aren't supported) and FortiLink works on all Ethernet ports **except HA and MGMT**.\n\n- `auto-auth-extension-device` defaults to `disable`.\n- From FortiOS **7.6.1** the default `fortilink-neighbor-detect` is **`lldp`**.\n- FortiLink isn't supported in transparent mode.\n- `fortilink-split-interface` defaults to `enable`.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-004',
    topic: '2.1',
    type: 'fill',
    difficulty: 1,
    stem: 'What is the default value of `switch-controller-mgmt-vlan` on a FortiLink interface? (Enter the VLAN ID.)',
    answer: ['4094'],
    explanation: "The FortiLink management VLAN defaults to **4094** (range 1–4094) and is set per FortiLink interface with `set switch-controller-mgmt-vlan`.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-005',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'A factory-default FortiSwitch running FortiSwitchOS 7.6.1 is connected at a site where both a FortiGate (FortiOS 7.6.1) FortiLink port and internet access to FortiEdge Cloud are available. Which statement about zero-touch management is true?',
    options: [
      'The switch connects to an available manager, but only one manager manages it at a time.',
      'The switch is managed by the FortiGate and FortiEdge Cloud simultaneously, with the FortiGate taking precedence for port settings.',
      'The switch must be restarted after it becomes managed before its configuration is applied.',
      'Zero-touch management works only if the administrator first disables `config switch auto-network` on the switch.',
    ],
    answer: [0],
    explanation: "Zero-touch management (FortiSwitchOS 7.2.0 + FortiOS 7.2.0 and later) lets a new switch connect to whichever manager is available — a FortiGate, FortiEdge Cloud (FortiLAN Cloud in the 7.6.1 guides) or FortiSwitch Manager — and **only one manager is used at a time**.\n\n- Two managers at once isn't supported; a switch generally can't be authorized by more than one.\n- The zero-touch page says the switch doesn't need a restart to become managed.\n- Auto topology (`auto-network`) is on by default and is part of zero-touch; you disable it only to keep a switch standalone.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-006',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-HQ has managed FSW-Core1 and FSW-Core2 for several months. Today the administrator created the configuration shown so that new switches automatically get a voice VLAN interface with a DHCP server. A third switch is then authorized, but no voice VLAN interface is created. Why?',
    exhibit: `FGT-HQ # show switch-controller initial-config template "voice-tpl"
config switch-controller initial-config template
    edit "voice-tpl"
        set vlanid 20
        set auto-ip enable
        set dhcp-server enable
    next
end

FGT-HQ # show switch-controller initial-config vlans
config switch-controller initial-config vlans
    set voice "voice-tpl"
end`,
    options: [
      'VLAN interface templates can be created only before the FortiGate has authorized any FortiSwitch unit.',
      '`dhcp-server` can only be enabled when `auto-ip` is disabled and a static `ip` is set.',
      'The voice role is applied only to ports that use `access-mode nac`.',
      'Templates are applied only to VLAN IDs taken from the 10.255.0.0/16 reserved network range.',
    ],
    answer: [0],
    explanation: "VLAN interface templates (`initial-config template` and `initial-config vlans`) are used for the VLAN interfaces the FortiGate creates when switches are discovered, and Fortinet states they can be created **only before the FortiGate has authorized any FortiSwitch**. This FortiGate already manages two switches.\n\n- `dhcp-server enable` works with `auto-ip enable`; it's the static `ip` that requires `auto-ip` to be disabled.\n- The voice role isn't tied to NAC ports.\n- The reserved network supplies subnets for `auto-ip`, not VLAN IDs.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-007',
    topic: '2.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Under `config system global`, which setting defines the subnet (default 10.255.0.0/16) from which the switch controller picks automatically assigned FortiLink VLAN interface subnets? (Enter the keyword.)',
    answer: ['switch-controller-reserved-network', 'set switch-controller-reserved-network'],
    explanation: "`set switch-controller-reserved-network <ip/netmask>` (default **10.255.0.0/16**). Templates with `auto-ip enable` get an unused /24 from this range.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-008',
    topic: '2.1',
    type: 'order',
    difficulty: 3,
    stem: 'Place the events of a one-time automatic FortiSwitchOS upgrade at authorization in the order they happen.',
    items: [
      'The administrator sets `firmware-provision-on-authorization enable` under `config switch-controller global`.',
      'The administrator authorizes the switch (`fsw-wan1-admin enable`), which sets its `firmware-provision-latest` to `once`.',
      'The switch reaches the Authorized/Up state.',
      'The FortiGate downloads the latest supported FortiSwitchOS from FortiGuard and upgrades the switch.',
      'The switch\'s `firmware-provision-latest` setting reverts to `disable`.',
    ],
    explanation: "With `firmware-provision-on-authorization enable` (default `disable`), authorizing a switch changes its `firmware-provision-latest` to `once`. When the switch is **Authorized/Up**, the FortiGate fetches the latest compatible image from FortiGuard (FortiOS 7.0.4+ behaviour) and upgrades it; afterwards the setting returns to `disable`, so it really is one-time.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-009',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which command should the administrator run next to investigate FSW-Access2?',
    exhibit: `FGT-HQ # execute switch-controller get-conn-status
${CONN_HDR}
FSW-Core1         v7.6.1 (1047)     Authorized/Up      2      10.255.1.2       Thu Oct 29 08:14:02 2026   S248EPTF18000101
FSW-Access1       v7.6.1 (1047)     Authorized/Up      2      10.255.1.3       Thu Oct 29 08:16:40 2026   S124EN5918000103
FSW-Access2       v7.6.1 (1047)     Authorized/Up      2E     10.255.1.4       Thu Oct 29 08:17:05 2026   S248EPTF18000102

${CONN_LEGEND}
         Managed-Switches: 3 (UP: 3 DOWN: 0 MAX: 32)`,
    options: [
      '`execute switch-controller get-sync-status switch-id FSW-Access2`',
      '`execute switch-controller get-upgrade-status`',
      '`execute switch-controller get-physical-conn standard fortilink`',
      '`execute factoryreset` on FGT-HQ',
    ],
    answer: [0],
    explanation: "Flag **E** is a **configuration sync error**. `get-sync-status` (with `all`, `serial <sn>` or `switch-id <name>`) checks each switch for synchronization errors; afterwards `diagnose switch-controller trigger config-sync <serial>` can push the full configuration again.\n\n- `get-upgrade-status` is for firmware staging and upgrades (flags U/S/D).\n- `get-physical-conn` shows which ports are authenticated, secured or restricted for FortiLink secure fabric.\n- Factory-resetting the FortiGate would destroy the whole configuration.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-010',
    topic: '2.1',
    type: 'match',
    difficulty: 2,
    stem: 'Match each `get-conn-status` flag with its meaning.',
    pairs: [
      ['E', 'Configuration sync error'],
      ['U', 'Upgrading'],
      ['S', 'New image staged'],
      ['D', 'Delayed reboot pending'],
      ['3', 'Managed over a layer-3 network'],
      ['V', 'Managed over VXLAN'],
    ],
    explanation: "From the 7.6.1 legend: `C=config sync, U=upgrading, S=staged, D=delayed reboot pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External`.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-011',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'A factory-default FortiSwitch whose admin account has no password is authorized by a FortiGate running FortiOS 7.6.1. No switch profile sets a password. What happens to the switch admin password?',
    options: [
      'The FortiGate generates a password for the switch, because FortiOS 7.6.1 no longer allows empty admin passwords on managed switches.',
      'The password stays empty until an administrator sets `login-passwd-override enable` in a switch profile.',
      'The switch is held in the Discovered/Down state until a password is configured.',
      'The FortiGate copies its own admin password to the switch.',
    ],
    answer: [0],
    explanation: "**New in FortiOS 7.6.1:** empty admin passwords are no longer allowed. If a switch has no password when it is authorized, the FortiGate generates one; switches that already have a password are unaffected. You can still set your own through `config switch-controller switch-profile` (`login-passwd-override enable`, `login-passwd`).\n\n- Before 7.6.1 the password would have stayed empty.\n- Authorization isn't blocked, and the FortiGate doesn't copy its own admin password.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-012',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Last month the administrator pushed a password to all managed switches with the first set of commands. Today the administrator ran the second set to remove it, but the switches still ask for the old password. What should the administrator do?',
    exhibit: `# Last month
config switch-controller switch-profile
    edit "default"
        set login-passwd-override enable
        set login-passwd <password>
    next
end

# Today
config switch-controller switch-profile
    edit "default"
        set login-passwd-override disable
    next
end`,
    options: [
      'Set `login-passwd-override enable` again and `unset login-passwd`, so the profile pushes an empty password.',
      'Run `execute factoryreset` on each switch so the FortiGate can push the new profile.',
      'Set `switch-on-deauth factory-reset` and deauthorize the switches.',
      'Disable `set login` in the switch profile.',
    ],
    answer: [0],
    explanation: "Turning the override off just stops the FortiGate from managing the password — the old one stays on the switch. To clear it, apply a profile with `login-passwd-override enable` **and** `unset login-passwd`. (On FortiOS 7.6.1 note that a switch authorized with no password gets a generated one.)\n\n- Factory-resetting or deauthorizing switches is disruptive and unnecessary.\n- `set login disable` blocks console login; it doesn't remove the password.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-013',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator ran these commands one hour ago. Which command completes the upgrade?',
    exhibit: `FGT-HQ # execute switch-controller switch-software stage all S248EP-IMG-761
FGT-HQ # execute switch-controller switch-software stage all S124EN-IMG-761

FGT-HQ # execute switch-controller get-conn-status
${CONN_HDR}
FSW-Core1         v7.4.4 (0870)     Authorized/Up      2S     10.255.1.2       Thu Oct 29 08:14:02 2026   S248EPTF18000101
FSW-Access1       v7.4.4 (0870)     Authorized/Up      2S     10.255.1.3       Thu Oct 29 08:16:40 2026   S124EN5918000103

${CONN_LEGEND}
         Managed-Switches: 2 (UP: 2 DOWN: 0 MAX: 32)`,
    options: [
      '`execute switch-controller switch-action restart delay all`',
      '`execute switch-controller switch-software upgrade all`',
      '`diagnose switch-controller trigger config-sync S248EPTF18000101`',
      '`set firmware-provision enable` on each managed switch',
    ],
    answer: [0],
    explanation: "Flag **S** shows the new image is **staged**; the switches still run 7.4.4 until they reboot. `execute switch-controller switch-action restart delay all` restarts them (they show **D** — delayed reboot pending — and briefly Authorized/Down, then come back on the new version). You can also restart by switch group.\n\n- `switch-software upgrade` takes one switch ID and an image ID; the images are already staged.\n- A config sync doesn't load firmware.\n- `firmware-provision` is for automatic provisioning, not for activating an already staged image.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-014',
    topic: '2.1',
    type: 'order',
    difficulty: 2,
    stem: 'Place the steps of a CLI upgrade of a managed FortiSwitch stack from a TFTP server in the correct order.',
    items: [
      'Upload each model\'s image with `execute switch-controller switch-software upload tftp <file> <server>`.',
      'Confirm the images with `execute switch-controller switch-software list-available`.',
      'Stage the images with `execute switch-controller switch-software stage all <image>`.',
      'Wait until `execute switch-controller get-upgrade-status` shows the save stage complete.',
      'Reboot with `execute switch-controller switch-action restart delay all`.',
      'Confirm every switch is Authorized/Up on the new version with `get-conn-status`.',
    ],
    explanation: "Upload once per model → list → stage (one `stage all` per model image) → monitor download/erase/save with `get-upgrade-status` → delayed restart → verify. HTTPS image push (`https-image-push`, default enable) speeds the transfer from FortiGate to switches.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-015',
    topic: '2.1',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about FortiSwitch firmware provisioning from a FortiGate running FortiOS 7.6 are true? (Choose two.)',
    options: [
      'Setting `firmware-provision-latest` to `once` unsets `firmware-provision` and `firmware-provision-version` on that switch.',
      'FortiGate models without a hard disk store one FortiSwitch image per FortiSwitch model.',
      '`firmware-provision-on-authorization` is enabled by default.',
      'A staged image becomes active immediately without a switch reboot.',
      'Federated upgrades of managed FortiSwitch units were introduced in FortiOS 6.4.0.',
    ],
    answer: [0, 1],
    explanation: "The one-time upgrade to the latest FortiGuard image can't be combined with uploaded-image provisioning: setting `firmware-provision-latest once` clears `firmware-provision` and `firmware-provision-version`. For uploaded images, hard-disk models store up to four images per FortiSwitch model and models without a disk store one.\n\n- `firmware-provision-on-authorization` defaults to `disable`.\n- A staged image needs a reboot (flag D during the delayed restart).\n- Federated upgrades of managed switches start in FortiOS **7.4.1**.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-016',
    topic: '2.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Refer to the exhibit. Complete the missing line so that the discovered switch is authorized. (Type the full `set` command.)',
    exhibit: `FGT-HQ # config switch-controller managed-switch
FGT-HQ (managed-switch) # edit S248EPTF18000102
FGT-HQ (S248EPTF18000102) # set fsw-wan1-peer "fortilink"
FGT-HQ (S248EPTF18000102) # ______________________
FGT-HQ (S248EPTF18000102) # end`,
    answer: ['set fsw-wan1-admin enable'],
    explanation: "`set fsw-wan1-admin enable` authorizes the switch. The CLI Reference lists the values `discovered` (default), `enable` and `disable`.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-017',
    topic: '2.1',
    type: 'single',
    difficulty: 3,
    stem: 'An administrator wants one managed-switch entry to pre-authorize the next FortiSwitch 248E-POE that arrives, whatever its exact serial number. Which entry name is valid?',
    options: [
      '`S248EP****000000`',
      '`S248****000000`',
      '`S248EP??000000`',
      '`S248EP****0000000000`',
    ],
    answer: [0],
    explanation: "A wildcard serial is the **first six characters** of a valid serial (`S248EP`), then asterisks (the only wildcard allowed), then any valid characters, with the part after the prefix at most **10 characters**. `****000000` is exactly 10.\n\n- `S248` is only a four-character prefix.\n- `?` isn't a supported wildcard.\n- `****0000000000` is 14 characters after the prefix.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-018',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The stitch that uses this trigger runs a CLI script that adds the switch to the `edge` switch group. A 124E switch with serial S124EN5918000103 and a 248E switch with serial S248EPTF18000102 both connect to FGT-HQ over a layer-3 FortiLink network. What happens?',
    exhibit: `FGT-HQ # show system automation-trigger "New-124E-L3"
config system automation-trigger
    edit "New-124E-L3"
        set description "124E connected over L2/L3 FortiLink"
        set event-type event-log
        set logid 32622
        config fields
            edit 1
                set name "sn"
                set value "S124EN*"
            next
        end
    next
end`,
    options: [
      'The trigger fires only for S124EN5918000103, because the `*` wildcard matches any string after the S124EN prefix.',
      'The trigger fires for both switches, because field entries are ignored for switch-controller log IDs.',
      'The trigger fires for neither switch, because `trigger-type` must be set to `scheduled` for switch-controller events.',
      'The trigger fires for both switches, because `*` matches any complete serial number.',
    ],
    answer: [0],
    explanation: "FortiOS 7.4.4 added switch-controller event-log triggers for zero-touch provisioning; log ID 32622 is a switch connecting in FortiLink mode over a layer-2 or layer-3 network. `trigger-type` defaults to `event-based` (so `show` hides it). Field entries filter the log, all entries must match, and `*` matches any string — `S124EN*` matches only serials that start with S124EN.\n\n- Fields are honoured for these triggers.\n- `scheduled` is for time-based triggers.\n- `S124EN*` is a prefix match, not a match-everything.",
    lesson: '2.1-authorization-firmware',
  },
  {
    id: 'd2-019',
    topic: '2.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After a factory reset and new cabling, FGT-HQ (FortiOS 7.6.1) no longer discovers any FortiSwitch on this FortiLink interface. What is the most likely cause?',
    exhibit: `FGT-HQ # show system interface fortilink
config system interface
    edit "fortilink"
        set vdom "root"
        set fortilink enable
        set ip 10.255.1.1 255.255.255.0
        set type aggregate
        set member "port9" "port10"
        set auto-auth-extension-device enable
        set lldp-reception disable
        set lldp-transmission enable
    next
end`,
    options: [
      'Neighbor detection uses LLDP by default in FortiOS 7.6.1, so LLDP reception must be enabled on the FortiLink interface.',
      'Automatic authorization prevents discovery until each switch is pre-authorized.',
      'An aggregate FortiLink interface supports only FortiLink neighbor detection.',
      'The FortiLink IP address must be taken from 10.255.0.0/16 with a /16 mask.',
    ],
    answer: [0],
    explanation: "`fortilink-neighbor-detect` isn't shown, so it is at its FortiOS 7.6.1 default, **`lldp`**. With LLDP detection, both `lldp-reception` and `lldp-transmission` must be enabled on the FortiLink interface; here reception is disabled, so the FortiGate never learns its switch neighbors.\n\n- Auto-authorization doesn't block discovery.\n- Aggregates work with either detection method (LLDP is even required for aggregates inside a FortiLink software switch).\n- Any FortiLink subnet works; the reserved network is for auto-assigned VLAN subnets.",
    lesson: '2.1-management-modes-fortilink',
  },
  {
    id: 'd2-020',
    topic: '2.1',
    type: 'single',
    difficulty: 1,
    stem: 'An engineer logs in to managed switch FSW-Access1 and changes a port\'s native VLAN directly on the switch. After the next switch restart, the change is gone. Why?',
    options: [
      'The FortiGate is not aware of changes made directly on a managed switch, and the switch configuration comes from the FortiGate.',
      'FortiSwitchOS discards configuration changes that are not saved with `execute save`.',
      'Native VLAN changes require the switch to be in standalone mode with auto-network enabled.',
      'Managed switches reset to factory defaults on every restart unless `switch-on-deauth no-op` is set.',
    ],
    answer: [0],
    explanation: "In FortiLink mode the FortiGate owns the switch configuration. Fortinet warns that changes made directly on a managed switch are unknown to the FortiGate and can be missing after the switch restarts. Make the change from the FortiGate (`config switch-controller managed-switch` → `config ports` → `set vlan`).\n\n- The other options describe behaviour that doesn't exist; `switch-on-deauth` only controls what happens when a switch is deauthorized.",
    lesson: '2.1-management-modes-fortilink',
  },

  // ---------------------------------------------------------------- 2.2
  {
    id: 'd2-021',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-A and FGT-B form an FGCP cluster that will manage FSW-Core1 and FSW-Core2. The administrator reviews the FortiLink cabling before going live. Which problem does the design have?',
    exhibit: `FortiLink cabling
Unit    FortiGate port   Connected to
FGT-A   port9            FSW-Core1 port51
FGT-A   port10           FSW-Core2 port51
FGT-B   port9            FSW-Core1 port52
FGT-B   port11           FSW-Core2 port52

FortiLink interface (synchronized by FGCP)
    edit "fortilink"
        set type aggregate
        set member "port9" "port10"`,
    options: [
      'The FortiLink ports and interface type must match on both FortiGate units, but FGT-B uses port11 instead of port10.',
      'HA-mode FortiGate units can manage FortiSwitch units only through a hardware-switch FortiLink interface.',
      'The secondary FortiGate must use FortiLink neighbor detection while the primary uses LLDP.',
      'HA-mode FortiGate units can manage only a single FortiSwitch, not two.',
    ],
    answer: [0],
    explanation: "For every HA-mode topology Fortinet states that **the FortiLink port(s) and interface type must match on the two FortiGate units**. FGCP synchronizes one FortiLink configuration (`port9` + `port10`), so FGT-B's port11 link to FSW-Core2 is not a FortiLink member at all and its port10 is unused. Cable FGT-B port10 to FSW-Core2 instead.\n\n- Aggregates are the recommended FortiLink type for HA, not hardware switches.\n- Both units share the same synchronized neighbor-detection setting.\n- HA pairs can manage a single switch, a stack or a two-tier topology.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-022',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator plans to connect four FortiSwitch units to four FortiGate ports grouped in a FortiLink-enabled software switch. Why does Fortinet not recommend this design in most cases?',
    options: [
      'Traffic between the switches must pass through the FortiGate, so it suits only very light inter-switch traffic.',
      'Software switch FortiLink interfaces cannot authorize more than one FortiSwitch.',
      'Software switch FortiLink interfaces don\'t support VLANs.',
      'The FortiSwitch units would form ISLs through the FortiGate and create an STP loop by design.',
    ],
    answer: [0],
    explanation: "With a hardware- or software-switch FortiLink, each switch connects only to the FortiGate, so all inter-switch traffic crosses the FortiGate. Fortinet says this suits only very light traffic and isn't recommended in most cases; you also must not create loops or rings in this topology.\n\n- Multiple switches are supported — that is the point of the design.\n- VLANs work; other 802.1Q devices on the interface even get layer-2 access to switch ports.\n- No ISLs form through the FortiGate; loops are a cabling mistake, not a design property.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-023',
    topic: '2.2',
    type: 'multi',
    difficulty: 3,
    stem: 'HA-mode FortiGate units manage two FortiSwitch units through a FortiLink hardware-switch interface, and an ISL between the switches provides redundancy. Which two statements are true? (Choose two.)',
    options: [
      'STP must be enabled on the FortiLink hardware-switch interface with `set stp enable`.',
      'LLDP transmission must be enabled on the interface before STP is enabled.',
      'The same design is supported with a FortiLink software-switch interface.',
      'The FortiGate should have the highest STP priority value so that a switch becomes the root.',
      'STP must stay disabled because STP is never supported between a FortiGate and a FortiSwitch.',
    ],
    answer: [0, 1],
    explanation: "This documented topology needs `set stp enable` on each FortiLink hardware-switch interface, and because neighbor detection uses LLDP, `lldp-transmission` must be enabled first. STP and STP forwarding are supported on the **hardware switch**; the **software switch** isn't supported for it. On models without aggregate support, the FortiGate should get the **lowest** priority (`config system stp` → `switch-priority`) so it is the CIST root.\n\n- The general statement \"no STP between FortiGate and FortiSwitch\" applies to the normal aggregate FortiLink; this hardware-switch design is the documented exception.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-024',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FSW-Access2 and FSW-Access3 are in two buildings joined by a third-party wireless bridge. The ISL between them never forms. What is the cause?',
    exhibit: `FSW-Access2 # show switch physical-port port52
config switch physical-port
    edit "port52"
        set fortilink-p2p enable
    next
end
FSW-Access2 # show switch global | grep tpid
    set fortilink-p2p-tpid 0x88a8

FSW-Access3 # show switch physical-port port52
config switch physical-port
    edit "port52"
        set fortilink-p2p enable
    next
end
FSW-Access3 # show switch global | grep tpid
FSW-Access3 #`,
    options: [
      'The FortiLink point-to-point TPID must be the same on both switches; FSW-Access3 uses the default 0x8100.',
      '`fortilink-p2p` works only in standalone mode.',
      'The wireless bridge must forward LLDP to the reserved multicast address, which point-to-point mode disables.',
      'A point-to-point layer-2 ISL requires FortiLink over VXLAN.',
    ],
    answer: [0],
    explanation: "FortiLink over a point-to-point layer-2 network (FortiSwitchOS 6.4.0+) needs `fortilink-p2p enable` on the ports at each end and the **same** `fortilink-p2p-tpid` on both switches. FSW-Access3 shows no TPID line, so it uses the default **0x8100**; FSW-Access2 uses 0x88a8.\n\n- `fortilink-p2p` is available in FortiLink and standalone mode (the TPID setting only in FortiLink mode).\n- Point-to-point mode changes the LLDP destination MAC to **broadcast** precisely so it crosses the middle layer-2 device.\n- VXLAN is a separate topology.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-025',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'What does enabling `fortilink-p2p` on a FortiSwitch port change so that an ISL can form across a non-FortiSwitch layer-2 device?',
    options: [
      'The LLDP destination MAC address becomes the broadcast MAC address.',
      'The port stops sending LLDP and uses CAPWAP discovery instead.',
      'The port encapsulates ISL traffic in VXLAN.',
      'The port disables STP so the intermediate device is not blocked.',
    ],
    answer: [0],
    explanation: "Standard LLDP uses a multicast address that many layer-2 devices consume or don't forward. In point-to-point mode the LLDP destination MAC changes to **broadcast**, so the frames cross the middle device and the two FortiSwitch units can still form an ISL.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-026',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Refer to the exhibit. FSW-Branch1 is managed by FGT-HQ across a routed WAN. Which two requirements apply to this deployment? (Choose two.)',
    exhibit: `FSW-Branch1 # show switch-controller global
config switch-controller global
    set ac-discovery-type static
    config ac-list
        edit 1
            set ipv4-address 10.255.1.1
        next
    end
end`,
    options: [
      'FSW-Branch1 must be able to ping the FortiGate.',
      'An NTP server must be reachable from FSW-Branch1.',
      'NAT must translate the switch address between the branch and FGT-HQ.',
      '`set fortilink-l3-mode enable` must be configured on the switch uplink.',
      'FortiSwitch NAC must be enabled so the FortiGate can identify the switch.',
    ],
    answer: [0, 1],
    explanation: "For FortiLink over layer 3, every switch must be able to **ping the FortiGate** and must reach an **NTP server** (configured or learned from DHCP). This exhibit uses static discovery (`ac-discovery-type static` with an `ac-list`); the alternative is DHCP option 138.\n\n- NAT between switch and FortiGate is **not supported**.\n- `fortilink-l3-mode` is deprecated since FortiOS 7.2.1; static ISL trunks replace it.\n- FortiSwitch NAC is **not supported** over layer 3.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-027',
    topic: '2.2',
    type: 'fill',
    difficulty: 2,
    stem: 'A factory-default FortiSwitch at a remote site gets its address from a DHCP server. Which DHCP option number, when it carries the FortiGate address, lets the switch establish FortiLink over the layer-3 network automatically? (Enter the number.)',
    answer: ['138', 'option 138'],
    explanation: "DHCP **option 138** (the CAPWAP access controller option). With it the switch connects and establishes FortiLink automatically; otherwise use a different `ac-dhcp-option-code` or static discovery with `ac-list`.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-028',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `FGT-HQ # execute switch-controller get-conn-status
Managed-devices in current vdom root:

FortiLink interface : fortilink
SWITCH-ID         VERSION           STATUS             FLAG   ADDRESS          JOIN-TIME                  SERIAL
FSW-Branch1       v7.6.1 (1047)     Authorized/Up      3      172.16.40.10     Thu Oct 29 09:41:12 2026   S124EN5918000104

FortiLink interface : flk-vxlan
SWITCH-ID         VERSION           STATUS             FLAG   ADDRESS          JOIN-TIME                  SERIAL
FSW-Branch2       v7.6.1 (1047)     Authorized/Up      V      10.255.2.2       Thu Oct 29 10:02:51 2026   S124EN5918000105

${CONN_LEGEND}
         Managed-Switches: 2 (UP: 2 DOWN: 0 MAX: 32)`,
    options: [
      'FSW-Branch2 is managed through a VXLAN tunnel, and by default only its management traffic uses the tunnel.',
      'FSW-Branch1 extends its user VLANs to FGT-HQ across the layer-3 network.',
      'FSW-Branch1 can be assigned FortiLink NAC policies.',
      'The link between FGT-HQ and FSW-Branch2 is encrypted with MACsec by the FortiLink secure fabric.',
    ],
    answer: [0],
    explanation: "Flag **V** (FortiOS/FortiSwitchOS 7.4.0+) means the switch is controlled over **VXLAN**, and by default **only management traffic** uses the VXLAN tunnel. Flag **3** means FortiLink over a **layer-3** network.\n\n- Over layer 3, no layer-2 data path such as a VLAN spans the routed network between FortiGate and switch.\n- FortiSwitch NAC isn't supported over layer 3.\n- Secure fabric doesn't support VXLAN, and FortiGate-to-switch links are never encrypted by it.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-029',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The administrator created a NAC policy for printers, but printers connected to FSW-Branch1 never match it. Why?',
    exhibit: `FGT-HQ # show user nac-policy "Printers"
config user nac-policy
    edit "Printers"
        set category device
        set type "Printer"
        set switch-fortilink "fortilink"
        set switch-mac-policy "printer-vlan"
    next
end

FGT-HQ # execute switch-controller get-conn-status
...
SWITCH-ID         VERSION           STATUS             FLAG   ADDRESS          JOIN-TIME                  SERIAL
FSW-Branch1       v7.6.1 (1047)     Authorized/Up      3      172.16.40.10     Thu Oct 29 09:41:12 2026   S124EN5918000104`,
    options: [
      'FSW-Branch1 is managed over a layer-3 network, where FortiSwitch NAC is not supported.',
      'NAC policies can match devices only by MAC address, not by device type.',
      'The NAC policy must use `set category ems-tag` for devices without FortiClient.',
      'FortiLink NAC requires the switch to be in an MCLAG peer group.',
    ],
    answer: [0],
    explanation: "Flag **3** shows FSW-Branch1 is managed with FortiLink over layer 3, and FortiSwitch NAC isn't supported in that mode.\n\n- Device-category NAC policies can match `mac`, `hw-vendor`, `type`, `family`, `os` and other device fields.\n- `ems-tag` is a separate category for FortiClient EMS tags, not a requirement.\n- NAC doesn't need MCLAG.",
    lesson: '2.2-deployment-topologies',
  },
  {
    id: 'd2-030',
    topic: '2.2',
    type: 'order',
    difficulty: 3,
    stem: 'FGT-HQ\'s FortiLink aggregate has one member to FSW-Core1 and one to FSW-Core2, which are joined by an ISL. Place the steps to convert this into a FortiLink MCLAG in the correct order.',
    items: [
      'Confirm `fortilink-split-interface` is enabled on the FortiLink aggregate.',
      'Assign the LLDP profile `default-auto-mclag-icl` to the ICL ports on both core switches.',
      'Disable `fortilink-split-interface` on the FortiLink aggregate.',
      'Set `lacp-mode active` on the FortiLink aggregate if it is not already set.',
      'Verify the aggregate with `diagnose netlink aggregate name <aggregate>`.',
    ],
    explanation: "The split interface keeps one link active while the two cores are still separate switches. Once the ICL turns them into an MCLAG pair (LLDP profile `default-auto-mclag-icl` on the ICL ports, assigned from the FortiGate), disable the split interface so both links join one LACP bundle, make sure LACP is active, then verify. All of it is done from the FortiGate.",
    lesson: '2.2-mclag-topologies',
  },
  {
    id: 'd2-031',
    topic: '2.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about MCLAG peer groups in FortiLink mode are true? (Choose two.)',
    options: [
      'An MCLAG peer group contains at most two FortiSwitch units, which should be the same model running the same FortiSwitchOS version.',
      'Fortinet recommends at least two links for the ICL.',
      'Routing can be enabled within an MCLAG to provide a redundant default gateway.',
      'STP must be disabled on ICL trunks so that both peers forward.',
      '`mclag-stp-aware` is disabled by default and must be enabled manually.',
    ],
    answer: [0, 1],
    explanation: "MCLAG supports a maximum of **two** switches, ideally the same model and version (mismatches \"might work\" but are unsupported), and Fortinet recommends **at least two ICL links**.\n\n- The routing feature isn't available within an MCLAG.\n- STP **must be enabled** on all ICL trunks.\n- `mclag-stp-aware` must be enabled and is **on by default**.",
    lesson: '2.2-mclag-topologies',
  },
  {
    id: 'd2-032',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FSW-Core1 and FSW-Core2 are cabled to each other on port51 and port52. Right after the administrator disabled the split interface, FortiLink to the core switches became unstable. What did the administrator miss?',
    exhibit: `FGT-HQ # show switch-controller managed-switch FSW-Core1 | grep -A3 "port5[12]"
            edit "port51"
                set lldp-profile "default-auto-isl"
            next
            edit "port52"
                set lldp-profile "default-auto-isl"

FGT-HQ # show system interface fortilink
config system interface
    edit "fortilink"
        set fortilink enable
        set ip 10.255.1.1 255.255.255.0
        set type aggregate
        set member "port9" "port10"
        set fortilink-split-interface disable
        set lacp-mode active
    next
end`,
    options: [
      'The ICL was never formed: port51 and port52 on both cores must use the `default-auto-mclag-icl` LLDP profile before the split interface is disabled.',
      'LACP must be `static` on FortiOS 7.6 FortiLink aggregates.',
      'The split interface must stay enabled permanently on any aggregate with two members.',
      'The core switches must be converted to standalone mode before MCLAG is enabled.',
    ],
    answer: [0],
    explanation: "The ports between the cores still use `default-auto-isl`, so FSW-Core1 and FSW-Core2 are an ordinary ISL pair, not MCLAG peers. Without the ICL they can't present one LACP partner, so turning the split interface off put two active links toward two independent switches. Assign `default-auto-mclag-icl` to the ICL ports on both switches first, then disable the split interface.\n\n- `lacp-mode static` was only for FortiOS 6.2 and earlier.\n- The split interface is disabled *after* the ICL forms so both links can be active.\n- Everything is done from the FortiGate; no standalone conversion is needed.",
    lesson: '2.2-mclag-topologies',
  },
  {
    id: 'd2-033',
    topic: '2.2',
    type: 'fill',
    difficulty: 2,
    stem: 'Which LLDP profile name is assigned, from the FortiGate, to the ports that should form the MCLAG ICL between two core FortiSwitch units? (Enter the profile name.)',
    answer: ['default-auto-mclag-icl'],
    explanation: "`set lldp-profile default-auto-mclag-icl` on the ICL ports of both peers (under `config switch-controller managed-switch` → `config ports`).",
    lesson: '2.2-mclag-topologies',
  },
  {
    id: 'd2-034',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The administrator is building a tier-2 MCLAG below the core pair. Where must this configuration be entered?',
    exhibit: `config switch auto-isl-port-group
    edit "tier2-closet-1"
        set members port1 port2
    next
    edit "tier2-closet-2"
        set members port3 port4
    next
end`,
    options: [
      'Directly on each tier-1 FortiSwitch, or pushed to them with a custom script from the FortiGate.',
      'On FGT-HQ under `config switch-controller managed-switch` for each tier-2 switch.',
      'On FGT-HQ under `config system interface` for the FortiLink interface.',
      'On each tier-2 FortiSwitch, after converting it to standalone mode.',
    ],
    answer: [0],
    explanation: "`config switch auto-isl-port-group` is a FortiSwitchOS command. Fortinet's multi-tier MCLAG procedure says it must be configured **directly on the FortiSwitch** (here each tier-1 switch, one group per downstream peer group) or through a custom script bound from the FortiGate — one of the few documented exceptions to configuring everything from the FortiGate.\n\n- It doesn't exist under the FortiGate's managed-switch or interface trees.\n- No switch is converted to standalone mode.",
    lesson: '2.2-mclag-topologies',
  },
  {
    id: 'd2-035',
    topic: '2.2',
    type: 'single',
    difficulty: 2,
    stem: 'Two FortiLink fabrics, each managed by its own FortiGate, are joined with an MCLAG trunk between their core switch pairs. Which statement about the interconnect is true?',
    options: [
      'Native and allowed VLAN IDs must match on both sides, but the VLAN names can differ.',
      'An ISL forms between the two fabrics so each FortiGate can manage the other fabric\'s switches.',
      '`auto-isl` must be enabled on the interconnect links.',
      'The interconnect ports must use the `default-auto-mclag-icl` LLDP profile.',
    ],
    answer: [0],
    explanation: "The interconnect ports look like access ports to each FortiGate and no ISL forms between fabrics. Native and allowed VLANs must match — **VLAN IDs must match, names may differ**.\n\n- Each FortiGate manages only its own fabric (you can even disable discovery of the other fabric's switches).\n- `auto-isl` is **disabled** on the interconnect links.\n- The interconnect ports use the `default` LLDP profile; `default-auto-mclag-icl` is for the ICL inside a peer group.",
    lesson: '2.2-mclag-topologies',
  },
  {
    id: 'd2-036',
    topic: '2.2',
    type: 'single',
    difficulty: 3,
    stem: 'IGMP snooping is used with a FortiLink MCLAG. Which configuration does Fortinet require for `mcast-snooping-flood-traffic` and `igmp-snooping-flood-reports`?',
    options: [
      'Disabled on ISL and FortiLink trunks, enabled on ICL trunks.',
      'Enabled on ISL and FortiLink trunks, disabled on ICL trunks.',
      'Disabled on all trunks, including the ICL.',
      'Enabled on all trunks, which is the default.',
    ],
    answer: [0],
    explanation: "With IGMP snooping and MCLAG, both settings must be **disabled on ISL and FortiLink trunks** and **enabled on ICL trunks**. They're enabled by default, so you disable them on the ISL/FortiLink trunks. `mclag-igmpsnooping-aware` (default enabled) and IGMP proxy are also required.",
    lesson: '2.2-mclag-topologies',
  },

  // ---------------------------------------------------------------- 2.3
  {
    id: 'd2-037',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The commands were run in the tenant-a VDOM, which has no FortiLink interface. Which statement is true?',
    exhibit: `FGT-HQ (tenant-a) # execute switch-controller virtual-port-pool request S248EPTF18000102 port11

FGT-HQ (tenant-a) # show switch-controller managed-switch
config switch-controller managed-switch
    edit "S248EPTF18000102"
        set type virtual
        set owner-vdom "root"
        config ports
            edit "port11"
                set vlan "ta-vlan110"
            next
        end
    next
end`,
    options: [
      'The tenant claimed port11 from a virtual port pool that the root VDOM administrator had assigned it to; the switch is still owned by the root VDOM.',
      'The tenant-a VDOM has taken over management of the whole switch, so the root VDOM can no longer configure it.',
      'port11 uses ta-vlan110 because the tenant administrator created the VLAN in the root VDOM.',
      'The request failed, because a switch cannot appear in a VDOM without a FortiLink interface.',
    ],
    answer: [0],
    explanation: "The root administrator put port11 in a virtual port pool (`export-to-pool`) and the tenant claimed it with `execute switch-controller virtual-port-pool request <sn> <port>`. The switch then appears in the tenant VDOM **even though it has no FortiLink interface**, as `type virtual` with `owner-vdom \"root\"`. The port uses the tenant's default virtual-switch VLAN (`ta-vlan110`), a VLAN created in the **tenant** VDOM on the root FortiLink interface.\n\n- Only the exported port is delegated; the root VDOM still owns the switch.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-038',
    topic: '2.3',
    type: 'order',
    difficulty: 3,
    stem: 'Place the steps for letting tenant VDOM tenant-a claim a FortiSwitch port from a virtual port pool in the correct order.',
    items: [
      'In tenant-a, create a VLAN interface whose parent is the root VDOM\'s FortiLink interface.',
      'In tenant-a, set that VLAN as `default-virtual-switch-vlan` under `config switch-controller global`.',
      'In root, create the pool under `config switch-controller virtual-port-pool`.',
      'In root, set `export-to-pool <pool>` on the switch port.',
      'In tenant-a, run `execute switch-controller virtual-port-pool request <serial> <port>`.',
    ],
    explanation: "The tenant VLAN comes first (CLI only — the GUI doesn't support creating it), then it is made the tenant's default virtual-switch VLAN. The root VDOM creates the pool and assigns ports to it; finally the tenant claims a port with `virtual-port-pool request`.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-039',
    topic: '2.3',
    type: 'multi',
    difficulty: 3,
    stem: 'A FortiSwitch port is exported from the root VDOM to tenant VDOM tenant-a. Which three features are NOT supported on this shared port? (Choose three.)',
    options: [
      'DHCP snooping',
      'STP',
      'Quarantines',
      'Dynamic MAC address learning limits',
      'Port security policy (802.1X)',
      'QoS egress CoS queue policy',
    ],
    answer: [0, 1, 2],
    explanation: "Shared ports don't support LLDP, STP, BPDU guard, root guard, **DHCP snooping**, IGMP snooping, MCLAG or **quarantines**. Since FortiOS 6.2.0 they do support pre-standard PoE detection, **dynamic MAC learning limits**, **QoS egress CoS queue policy** and **port security policy**.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-040',
    topic: '2.3',
    type: 'fill',
    difficulty: 2,
    stem: 'In the root VDOM, under `config switch-controller managed-switch` → `config ports` → `edit port10`, which command dedicates port10 directly to VDOM tenant-a? (Type the full `set` command.)',
    answer: ['set export-to tenant-a', 'set export-to "tenant-a"'],
    explanation: "`set export-to tenant-a` exports the port directly. `set export-to-pool <pool>` instead places it in a virtual port pool for the tenant to claim.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-041',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'A tenant-a administrator wants to create, in the GUI, the VLAN interface that will become the tenant\'s default virtual-switch VLAN on the root VDOM\'s FortiLink interface. What should the administrator know?',
    options: [
      'This VLAN must be created in the CLI; Fortinet notes the step is not supported in the GUI.',
      'The VLAN must be created by the root administrator in the root VDOM and then moved to tenant-a.',
      'Tenant VLANs must be created on a FortiLink interface that belongs to tenant-a.',
      'The GUI creates it automatically when the first port is exported to tenant-a.',
    ],
    answer: [0],
    explanation: "In the tenant VDOM you create a VLAN interface with `set interface` pointing at the **root** VDOM's FortiLink interface, then set it as `default-virtual-switch-vlan`. The FortiLink Guide states this VLAN step isn't supported in the GUI.\n\n- It is created in the tenant VDOM, not moved from root.\n- The tenant VDOM has no FortiLink interface of its own.\n- Nothing creates it automatically.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-042',
    topic: '2.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. An MSSP is configuring QinQ for customer c1. The FortiLink interface `fortilink` is in the root VDOM. QinQ for customer c1 does not work with `set qnq "svlan-c1"` on the customer port. Based on the exhibit, what is wrong?',
    exhibit: `FGT-HQ # show system interface svlan-c1
config system interface
    edit "svlan-c1"
        set vdom "c1"
        set interface "fortilink"
        set vlanid 3000
    next
end`,
    options: [
      'The S-VLAN must be in the same VDOM as the FortiLink interface, but svlan-c1 is in VDOM c1.',
      'S-VLAN IDs must use the TPID 0x88a8, which requires a dedicated FortiLink interface.',
      'QinQ requires the customer port to be exported with `export-to c1` first.',
      'VLAN ID 3000 is inside the switch-controller reserved range.',
    ],
    answer: [0],
    explanation: "For VLAN stacking, the **S-VLAN must be on the same VDOM as the FortiLink interface** (root here); the customer's C-VLANs go in the customer VDOM.\n\n- TPID profiles (up to four, default 0x8100 fixed) are separate from where the S-VLAN lives.\n- QinQ doesn't use `export-to`.\n- The reserved network is an IP subnet, not a VLAN range.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-043',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Customer c1 asks for DHCP snooping on its customer VLANs carried on port8. What should the MSSP administrator tell the customer?',
    exhibit: `FGT-HQ (root) # show switch-controller managed-switch S248EPTF18000102 | grep -A5 "edit \\"port8\\""
            edit "port8"
                set qnq "svlan-c1"
                set vlan "c1.vlan1"
                set allowed-vlans "c1.vlan10" "c1.vlan20"
            next`,
    options: [
      'DHCP snooping is not supported with QinQ.',
      'DHCP snooping works only if `allowed-vlans-all enable` is set on port8.',
      'DHCP snooping must be enabled on the S-VLAN interface instead of the C-VLANs.',
      'DHCP snooping is supported only if the C-VLANs use TPID 0x8100.',
    ],
    answer: [0],
    explanation: "Port8 is a QinQ port (`set qnq`). With QinQ, **DHCP relay, DHCP snooping, IGMP snooping, IP source guard, PVLAN and STP aren't supported**. Enabling it somewhere else or changing TPIDs doesn't change that.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-044',
    topic: '2.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each multi-tenancy method with its description.',
    pairs: [
      ['`set export-to <vdom>`', 'Dedicates a switch port directly to a tenant VDOM'],
      ['`set export-to-pool <pool>`', 'Pre-assigns a port that the tenant later claims with a request command'],
      ['`set qnq "<S-VLAN>"`', 'Carries each customer\'s own VLAN range inside a service-provider VLAN'],
      ['VDOM-owned VLANs assigned by the root admin', 'Shares ports between VDOMs without administrative separation'],
    ],
    explanation: "`export-to` and `export-to-pool` delegate ports (the tenant claims pooled ports with `execute switch-controller virtual-port-pool request`). QinQ wraps C-VLANs in an S-VLAN per customer. With VDOM-owned VLANs on shared ports, the root administrator still creates and assigns everything.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
  {
    id: 'd2-045',
    topic: '2.3',
    type: 'single',
    difficulty: 2,
    stem: 'An MSSP wants to add VLAN TPID profiles for QinQ. Which statement about TPID profiles in FortiLink mode is true?',
    options: [
      'Up to four TPID profiles are allowed, including the default 0x8100 profile, which cannot be changed or deleted.',
      'Up to eight TPID profiles are allowed, and the default profile can be changed to 0x88a8.',
      'Each customer VDOM can have its own unlimited set of TPID profiles.',
      'The default profile can be deleted once a custom profile is created.',
    ],
    answer: [0],
    explanation: "The FortiLink Guide allows a maximum of **four** VLAN TPID profiles **including the default**. The default (0x8100) is used to reach layer 3 and can't be changed or deleted.",
    lesson: '2.3-multi-tenancy-vdoms',
  },
];
