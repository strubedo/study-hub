// Cheat-sheet tables for the Reference page. Cells are inline markdown. FortiManager 7.6.
export default [
  {
    id: 'fgfm', title: 'FGFM essentials', topic: '2.1',
    columns: ['Item', 'Detail'],
    rows: [
      ['Protocol / port', 'FGFM over TLS, TCP 541. Management traffic then runs through the tunnel inside that session'],
      ['FortiGate side', '`config system central-management` → `set type fortimanager`, `set fmg <FortiManager IP or FQDN>`'],
      ['Who connects', 'Either side can start registration **if it can reach the other**: the FortiGate points at FortiManager (`set fmg`, then authorize the unauthorized device), or FortiManager adds the device by IP (Add Device wizard; needs `fgfm` in the FortiGate interface `allowaccess`). A FortiGate behind NAT must initiate, and only it re-establishes the tunnel'],
      ['FortiManager behind NAT', 'FortiManager does **not** set `fmg` on FortiGates it discovers. Configure `config system admin setting` → `set mgmt-addr <public IP/FQDN>` (or `set mgmt-fqdn <a> <b>` for several, tried in order) so it pushes `set fmg <public address>`. Intended for a static 1:1 NAT'],
      ['Check the tunnel', 'FortiManager `diagnose dvm device list` · `diagnose fgfm session-list`; FortiGate `diagnose debug application fgfmd -1`'],
    ],
    note: 'Both behind NAT: publish one side (normally FortiManager) with a VIP / port forward on TCP 541. On FortiManager, TCP 541 is filtered by `config system local-in-policy` (there is no `fgfm` allowaccess on FortiManager interfaces). FortiManager 7.6.3+ refuses FortiGate-VMs until `config system global` → `set fgfm-allow-vm enable`.',
  },
  {
    id: 'adom-modes', title: 'ADOM and workspace modes', topic: '1.3',
    columns: ['Setting', 'Options'],
    rows: [
      ['ADOM device mode (`config system global` / `set adom-mode {normal | advanced}`)', '**Normal** (default: a FortiGate and all its VDOMs belong to one ADOM) or **Advanced** (VDOMs of one FortiGate can be assigned to different ADOMs). GUI: System Settings > Advanced > Misc Settings > ADOM Mode'],
      ['ADOM mode (per ADOM)', '**Normal** (manage and configure devices from FortiManager) or **Backup** (back up configurations only; devices are configured locally)'],
      ['`workspace-mode disabled` (default)', 'Concurrent ADOM access: several admins can edit the same ADOM at once, no locks. GUI: Disable'],
      ['`workspace-mode normal`', 'Workspace (ALL ADOMS): lock the ADOM, a device or a policy package before editing; others are read-only'],
      ['`workspace-mode workflow`', 'Workflow (ALL ADOMS): lock the whole ADOM, change inside a session, submit for approval'],
      ['`workspace-mode per-adom`', 'Workspace (Per-ADOM): each ADOM picks Disable, Workspace or Workflow on its Edit ADOM page'],
      ['ADOM version', 'Fixed at creation; changed only by an ADOM upgrade. Confirm the lowest device FortiOS version is supported, upgrade the ADOM, then upgrade and resynchronize the FortiGates'],
    ],
    note: 'Changing `workspace-mode` ends your login session. Mixed FortiOS versions per ADOM version are listed in the "FortiOS version support by ADOM version" table of your FortiManager build.',
  },
  {
    id: 'scripts', title: 'Script types and run targets', topic: '2.2',
    columns: ['Run Script On', 'What it changes', 'Status afterwards'],
    rows: [
      ['Device Database', 'FortiManager\'s copy of the device settings only; nothing reaches the FortiGate until an install', 'Device config **Modified**; policy package unchanged. Push with Install Device Settings (only) or a full install'],
      ['Policy Package or ADOM Database', 'ADOM objects and the selected policy package', 'Policy package **Modified**; device config unchanged. Install the package. Can\'t be scheduled'],
      ['Remote FortiGate Directly (via CLI)', 'Runs on the FortiGate immediately over FGFM; FortiManager then does a full retrieve (or merges the script\'s changes with `config system dm` → `set conf-merge-after-script enable`), creating a new revision', 'Device config **Synchronized**; policy package **Unknown** until you import. The only target offered for Schedule Script and "automatic execute after each device install"'],
    ],
    note: 'Three script types in 7.6: **CLI** (all three targets), **TCL** (Remote FortiGate Directly only; `config system admin setting` → `set show_tcl_script enable`; runs over SSH through FGFM, so the admin credentials stored in Device Manager must be valid; no `exit`) and **Jinja** (ADOM database only). The Global Database ADOM accepts only CLI scripts, run on the policy package or ADOM database. Database targets need complete keywords. Scheduling needs `set show_schedule_script enable`. Read the log in Task Monitor, the device\'s Script Running History or `execute fmscript showlog <device>`.',
  },
  {
    id: 'install', title: 'Install wizard choices', topic: '3.4',
    columns: ['Option', 'What it pushes'],
    rows: [
      ['Install Policy Package & Device Settings (Install Wizard)', 'Copies the selected package into the device database, then installs the diff (package plus pending device-level changes). Best for a first package install. Preview and cancel possible'],
      ['Install Device Settings (only) (Install Wizard)', 'Device database (interfaces, routing, system settings) without copying the package. Preview and cancel possible'],
      ['Re-install Policy', 'The package already assigned to the device(s), without the wizard pages. Install Preview and Policy Package Diff available; cancel possible'],
      ['Quick Install (Device DB)', 'Device database only. **No install preview and cannot be cancelled**; for zero-touch provisioning or changes you already understand'],
    ],
    note: 'Validation (policy and object, interface, installation preparation) skips devices that fail. Use Install Preview to see the exact CLI FortiManager will send, and the install log for what failed.',
  },
];
