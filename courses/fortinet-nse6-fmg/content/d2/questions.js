// Domain 2 — Device manager: question bank (FortiManager 7.6 managing FortiOS 7.6).
// Original exam-style items (not brain-dump material). Options are shuffled by the app.
export default [
  {
    "id": "d2-001",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. An administrator on FMG-HQ tries to install a policy package to FGT-Branch2 and the task fails immediately. Which statement explains the failure?",
    "exhibit": "FMG-HQ # diagnose dvm device list\n--- There are currently 2 devices/vdoms managed ---\n--- There are currently 2 devices/vdoms count for license ---\n\nTYPE            OID    SN                 HA      IP              NAME           ADOM     IPS   FIRMWARE         HW_GenX\nfmgfaz-managed  231    FGVM02TM24000111   -       198.51.100.11   FGT-Branch1    Retail   N/A   7.0 MR6 (3401)   N/A\n                |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: installed; conn: up\n                |- vdom:[3]root flags:0 adom:Retail pkg:[installed]Branch-PP\nfmgfaz-managed  232    FGVM02TM24000112   -       198.51.100.12   FGT-Branch2    Retail   N/A   7.0 MR6 (3401)   N/A\n                |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: installed; conn: down\n                |- vdom:[3]root flags:0 adom:Retail pkg:[modified]Branch-PP\n\nFMG-HQ # diagnose fgfm session-list\nFGT-Branch1(231) sn(FGVM02TM24000111) ip(198.51.100.11) conn:0\n        state(tunnel) tunnel(169.254.0.2) uptime:Wed Oct 28 08:14:02 2026\nSession count = 1 (tunnel 1)",
    "options": [
      "FGT-Branch2 is still an unauthorized device and must be authorized in the root ADOM before an install.",
      "FGT-Branch2 has device database changes that must be installed with Install Device Settings (only) before the policy package.",
      "FGT-Branch2 isn't counted for license, so FortiManager blocks installs to it.",
      "FGT-Branch2 has no FGFM session to FMG-HQ, so FortiManager can't reach it to install until the FGFM connection is restored."
    ],
    "answer": [
      3
    ],
    "explanation": "`conn: down` in the STATUS line and the missing entry in `diagnose fgfm session-list` both show that FGT-Branch2 has **no FGFM tunnel**. Installs, retrieves and remote scripts all ride on that tunnel, so the install fails until the session is back (work the discovery checklist: routing, TCP 541, TLS, certificates).\n\n- The device appears in ADOM `Retail` with an OID and a policy package, so it's already authorized.\n- `dev-db: not modified` and `cond: OK` mean there are no pending device-level changes. The only pending item is the modified policy package.\n- The header says 2 devices are counted for license, so FGT-Branch2 is licensed.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-002",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-Branch1 never appears in FMG-HQ, not even as an unauthorized device. What must the administrator change?",
    "exhibit": "FGT-Branch1 # show system central-management\nconfig system central-management\n    set type fortimanager\n    set fmg \"203.0.113.10\"\n    set interface-select-method specify\n    set interface \"port3\"\nend\n\nFGT-Branch1 # get router info routing-table all\n...\nS*      0.0.0.0/0 [10/0] via 198.51.100.1, port1, [1/0]\nC       10.1.1.0/24 is directly connected, port2\nC       198.51.100.0/24 is directly connected, port1\n\nFGT-Branch1 # diagnose debug application fgfmd -1\nFGT-Branch1 # diagnose debug enable\nFGFMs: connect error: Network is unreachable",
    "options": [
      "Change the fmg setting to the FortiManager serial number instead of its IP address.",
      "Enable fgfm-allow-vm on the FortiGate so that the FortiGate-VM is allowed to register.",
      "Set interface-select-method to auto (or specify port1) so FGFM leaves through the interface that has a route to 203.0.113.10.",
      "Add fgfm to the allowaccess list of port3 so FortiManager can answer the connection."
    ],
    "answer": [
      2
    ],
    "explanation": "With `interface-select-method specify` and `interface \"port3\"`, FGFM is forced out of port3. The routing table has **no route via port3** (port3 isn't even connected), so fgfmd reports `Network is unreachable` and never reaches FortiManager. Using `auto` (or `specify` with port1) lets FGFM use the default route via port1.\n\n- `allowaccess fgfm` controls **inbound** FGFM to the FortiGate (Discover Device). It doesn't help an outbound connection.\n- `fmg` takes the FortiManager IP or FQDN, not a serial number.\n- `fgfm-allow-vm` is a **FortiManager** `config system global` setting, and the FortiGate never got far enough for it to matter.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-003",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator registers FGT-Branch2 by configuring config system central-management on the FortiGate with type fortimanager and the IP address of FMG-HQ. Which two statements are true? (Choose two.)",
    "options": [
      "FMG-HQ doesn't need to be able to open connections to the FortiGate. The FortiGate opens the TCP 541 session to FMG-HQ.",
      "The FortiGate's egress interface must have fgfm in its allowaccess list before the FortiGate can connect out.",
      "The FortiManager administrator must enter FGT-Branch2's admin username and password to accept the request.",
      "FortiManager automatically places FGT-Branch2 into the ADOM whose name matches the FortiGate hostname.",
      "FGT-Branch2 appears in the Unauthorized Devices list in the root ADOM until an administrator authorizes it."
    ],
    "answer": [
      0,
      4
    ],
    "explanation": "With a FortiGate-initiated request, the FortiGate calls FortiManager on **TCP 541**. FortiManager validates the certificate and serial number and lists the device under **Unauthorized Devices** (root ADOM) until someone clicks **Authorize** and picks the ADOM. That's why this method works when FortiManager can't reach the branch (NAT, outbound-only sites).\n\n- `allowaccess fgfm` is needed for **inbound** FGFM, which is what Discover Device uses. It isn't needed for an outbound connection.\n- FortiGate credentials are needed for Discover Device, not for authorizing an unauthorized device.\n- The administrator chooses the ADOM during authorization. Nothing maps hostnames to ADOMs automatically in this flow.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-004",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A retailer will ship FortiGates from a pool of spares to new stores, so the serial number of each store's unit isn't known in advance. A store technician will connect the unit and has console access. Which registration approach fits this requirement best?",
    "options": [
      "Create a model device per store linked by Pre-Shared Key, and have the technician run execute central-mgmt register-device with the FortiManager serial number and the store's key.",
      "Create a model device per store linked by Serial Number, and have the technician run execute central-mgmt register-device with the FortiGate serial number.",
      "Use Add Device > Discover Device from FortiManager with the store's public IP address and the default admin account.",
      "Import the stores from a CSV file that lists only the store names, and let FortiManager assign serial numbers when the units connect."
    ],
    "answer": [
      0
    ],
    "explanation": "**Link Device By: Pre-Shared Key** exists for exactly this case. Each model device gets a **unique** key, and the technician runs `execute central-mgmt register-device <fmg-serial-no> <key>`. FortiManager matches the key, authorizes the unit and applies the prepared configuration.\n\n- Linking by serial number needs the serial **before** the unit arrives, and `register-device` takes the **FortiManager** serial, not the FortiGate's.\n- Discover Device needs FortiManager to reach the store and log in to the FortiGate, which is unlikely through store NAT, and it doesn't use the prepared model.\n- A CSV model-device import needs the serial number, device blueprint and name columns. FortiManager doesn't invent serial numbers.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-005",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which TCP port does the FortiGate-FortiManager protocol (FGFM) use? Enter the port number.",
    "answer": [
      "541",
      "tcp 541",
      "tcp/541",
      "541/tcp",
      "port 541"
    ],
    "explanation": "FGFM runs over **TCP 541**, encrypted with TLS. Either side can open the session: FortiManager for Discover Device, or the FortiGate when its central management points at FortiManager. FortiGuard services from FortiManager use other ports, so don't confuse the two.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-006",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The administrator of a FortiManager-VM trial tries to discover a third FortiGate and the wizard fails with a license error. What is the most likely reason?",
    "exhibit": "License Information (FMG-HQ, FortiManager-VM trial)\n  Devices/VDOMs allowed : 3\n\nDevice Manager summary\n  ADOM Retail          : FGT-Branch1 (VDOMs disabled)\n  ADOM MSSP-CustomerA  : FGT-Branch2 (VDOMs disabled)\n  root ADOM            : Unauthorized Devices (1)\n                           FGT-Lab   FGVM02TM24000199   not hidden\n\nAdd Device > Discover Device 198.51.100.13 -> failed",
    "options": [
      "The trial license counts each ADOM as one device, so the two ADOMs plus root use all three slots.",
      "Discover Device is disabled on trial licenses. Only FortiGate-initiated registration is allowed.",
      "The unregistered FGT-Lab in the root ADOM counts as one license, so all three slots are in use.",
      "Unauthorized devices count as three licenses until they are authorized."
    ],
    "answer": [
      2
    ],
    "explanation": "FortiManager's license rules count **an unregistered device in the root ADOM as one license** (hidden devices are not counted). FGT-Branch1 + FGT-Branch2 + the unauthorized FGT-Lab = 3, which is the trial's limit. Delete or **hide** FGT-Lab (or authorize it if it's the unit you wanted), and the slot is free.\n\n- An unregistered device counts as one license, not three.\n- ADOMs aren't counted as devices.\n- Discover Device works on the trial. The license count, not the method, is the problem.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-007",
    "topic": "2.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each registration method with how the FortiGate becomes managed.",
    "pairs": [
      [
        "Add Device > Discover Device",
        "FortiManager connects to the FortiGate management IP and a FortiGate admin approves the request"
      ],
      [
        "FortiGate central management pointing at FortiManager",
        "The device waits in Unauthorized Devices until an administrator authorizes it"
      ],
      [
        "Model device linked by serial number",
        "Links automatically when a FortiGate with that serial connects (auto-link enabled)"
      ],
      [
        "Model device linked by pre-shared key",
        "A technician runs execute central-mgmt register-device on the FortiGate"
      ],
      [
        "Model devices imported from CSV",
        "Creates many model devices from rows that name a device blueprint"
      ]
    ],
    "explanation": "- **Discover Device**: FortiManager initiates over TCP 541, the admin logs in to the FortiGate and clicks Allow (legacy login for older FortiOS).\n- **FortiGate request**: `config system central-management` with `type fortimanager` and `fmg`. The unit sits in Unauthorized Devices (root ADOM) until authorized.\n- **Model device by serial**: FortiManager matches the serial in the FGFM certificate and, with Automatically Link to Real Device, links and pushes the prepared configuration.\n- **Model device by pre-shared key**: `execute central-mgmt register-device <fmg-serial-no> <key>` on the FortiGate.\n- **CSV import**: needs serial number, device blueprint and name columns. The blueprint must exist first.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-008",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Last week an administrator created 50 model devices from the device blueprint Retail-Store. Today the administrator edits the blueprint to add the device group Stores-East. What is the effect?",
    "options": [
      "Only model devices created from the blueprint after the change are added to Stores-East. The existing 50 are unchanged.",
      "All 50 existing model devices are added to Stores-East at the next install.",
      "The existing 50 model devices are unlinked from their real devices until they are re-imported from the CSV file.",
      "FortiManager asks which of the 50 devices should be updated before saving the blueprint."
    ],
    "answer": [
      0
    ],
    "explanation": "Blueprint settings are applied **when a model device is created** from it. Editing a blueprint affects only devices added afterwards. The 50 existing model devices keep the settings they received, so add them to Stores-East yourself (for example, by editing the group).\n\nThe other options describe behavior FortiManager doesn't have. Nothing is applied retroactively, links aren't broken, and there's no per-device prompt.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-009",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator enables Enforce Device Configuration on a model device for a zero-touch branch deployment. Which risk must the administrator consider?",
    "options": [
      "The FortiGate firmware is downgraded to the oldest image in the FortiManager firmware cache.",
      "The real FortiGate keeps its local configuration and FortiManager discards the model device configuration.",
      "The model device stops linking automatically, so every unit must be authorized manually.",
      "The model's management interface settings are pushed to the real FortiGate as they are, so a mistake there can disconnect the FortiGate from FortiManager."
    ],
    "answer": [
      3
    ],
    "explanation": "**Enforce Device Configuration** pushes the model's management interface configuration to the real device during ZTP/LTP **as-is**. If the model has a wrong IP, VLAN or gateway on the interface that FGFM uses, the FortiGate can lose its path to FortiManager right after linking.\n\n- Firmware changes come from **Enforce Firmware Version**, which uses the version you select, not the oldest image.\n- ZTP **overwrites** the real FortiGate's configuration with the model's, not the other way round.\n- Auto-link is a separate setting (Automatically Link to Real Device).",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-010",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-Branch2 tries to connect to FMG-HQ but never appears in Device Manager. The FortiGate uses a custom certificate for FGFM. What is the cause?",
    "exhibit": "FGT-Branch2 # show system central-management\nconfig system central-management\n    set type fortimanager\n    set fmg \"203.0.113.10\"\n    set local-cert \"Branch-FGFM-Cert\"\nend\n\nFMG-HQ # diagnose debug application fgfmsd 255\nFMG-HQ # diagnose debug enable\n...\nserial number (FGVM02TM24000112) in 'get' message doesn't match subject CN",
    "options": [
      "FMG-HQ has fgfm-allow-vm disabled, so it rejects the FortiGate-VM serial number.",
      "The pre-shared key entered with execute central-mgmt register-device doesn't match the model device.",
      "The custom certificate Branch-FGFM-Cert doesn't carry the FortiGate's serial number in its subject, so FortiManager rejects the identity check.",
      "TCP 541 is blocked between the FortiGate and FMG-HQ, so the session never starts."
    ],
    "answer": [
      2
    ],
    "explanation": "FGFM identifies devices by **serial number**, and FortiManager compares the serial in the request with the certificate's subject CN. A custom `local-cert` whose CN (or SAN) doesn't contain the FortiGate serial fails this check, so remove the custom certificate or issue one that includes the serial. (FortiManager 7.6.1 also had a `fgfm-peercert-withoutsn` global setting to relax the check, but the fix is a certificate that carries the serial.)\n\n- A blocked TCP 541 would never get as far as a message about the certificate subject. The TLS exchange already happened.\n- A disallowed VM model is a different rejection and isn't about the CN mismatch shown.\n- No model device or pre-shared key is involved in this scenario.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-011",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What is 169.254.0.3?",
    "exhibit": "FMG-HQ # diagnose fgfm session-list\nFGT-Branch1(231) sn(FGVM02TM24000111) ip(198.51.100.11) conn:0\n        state(tunnel) tunnel(169.254.0.2) uptime:Wed Oct 28 08:14:02 2026\nFGT-Branch2(232) sn(FGVM02TM24000112) ip(198.51.100.12) conn:0\n        state(tunnel) tunnel(169.254.0.3) uptime:Wed Oct 28 08:15:40 2026\nSession count = 2 (tunnel 2)",
    "options": [
      "An APIPA address that FGT-Branch2 picked because its DHCP client failed.",
      "The FGFM tunnel address assigned to FGT-Branch2.",
      "The FGFM tunnel address of FMG-HQ's svr_fgfm interface.",
      "The management IP address that FMG-HQ uses to discover FGT-Branch2."
    ],
    "answer": [
      1
    ],
    "explanation": "After authentication, FGFM builds a tunnel with **link-local addresses**. `diagnose fgfm session-list` shows each FortiGate's tunnel address, here **169.254.0.3** for FGT-Branch2, next to its real IP (198.51.100.12).\n\n- FortiManager's own end of the tunnels is the `svr_fgfm` interface, 169.254.0.1, visible with `diagnose fmnetwork interface list`.\n- The management IP is shown separately in `ip(...)`.\n- The address has nothing to do with DHCP. FGFM assigns it.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-012",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which two statements about FGFM keepalives are true? (Choose two.)",
    "exhibit": "FMG-HQ # get system dm\n...\nfgfm-sock-timeout   : 360\nfgfm_keepalive_itvl : 120\n...",
    "options": [
      "The keepalive interval is set per FortiGate with set keepalive under config system central-management.",
      "The FortiGate sends FGFM keepalive messages to FortiManager, by default every 120 seconds.",
      "The keepalive interval is controlled on FortiManager with fgfm_keepalive_itvl under config system dm.",
      "FortiManager sends ICMP echo requests to each FortiGate every 360 seconds to check that it is alive.",
      "Keepalives use UDP 541 so that they keep working when the TCP session is down."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "The **FortiGate** sends keepalives over the FGFM session. They carry status such as firmware, platform and configuration checksum. FortiManager controls the timers in `config system dm`: `fgfm_keepalive_itvl` (note the underscores; default 120 s, range 30–600) and `fgfm-sock-timeout` (360 s idle before the socket is dropped).\n\n- FGFM liveness isn't ICMP, and 360 s is the socket idle timeout, not a ping interval.\n- FGFM is TCP 541. There's no UDP 541 keepalive channel.\n- `config system central-management` has no `keepalive` attribute.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-013",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which FortiManager CLI command lists the active FGFM sessions together with each FortiGate's tunnel IP address?",
    "answer": [
      "diagnose fgfm session-list",
      "diag fgfm session-list",
      "diagnose fgfm session-list ",
      "diag fgfm session"
    ],
    "explanation": "`diagnose fgfm session-list` shows each connected device's name and OID, serial number, real IP, tunnel state and 169.254.x.x tunnel address, plus a session count. Pair it with `diagnose dvm device list` (where `conn: up/down` is the connection state).",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-014",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The capture was taken on FMG-HQ while FGT-Branch1 tried to register. Which two causes are consistent with this output? (Choose two.)",
    "exhibit": "FMG-HQ # diagnose sniffer packet any 'host 198.51.100.11 and port 541' 4\ninterfaces=[any]\nfilters=[host 198.51.100.11 and port 541]\n3.407606 198.51.100.11.42754 -> 203.0.113.10.541: syn 3738660390\n4.426946 198.51.100.11.42754 -> 203.0.113.10.541: syn 3738660390\n6.511686 198.51.100.11.42754 -> 203.0.113.10.541: syn 3738660390\n10.621104 198.51.100.11.42754 -> 203.0.113.10.541: syn 3738660390",
    "options": [
      "FMG-HQ has fgfm-allow-vm disabled and rejects the FortiGate-VM.",
      "The FortiGate's fmg setting points to the wrong FortiManager IP address.",
      "A local-in policy on FMG-HQ drops TCP 541 from 198.51.100.11.",
      "FMG-HQ has no route back to 198.51.100.11, so it can't send the SYN/ACK.",
      "The FortiGate interface is missing fgfm in its allowaccess list."
    ],
    "answer": [
      2,
      3
    ],
    "explanation": "The SYNs **arrive** on FMG-HQ, addressed to the right IP and port, and are retransmitted with no SYN/ACK ever leaving. Something on FortiManager drops them (a **local-in policy** limiting TCP 541 sources), or FortiManager can't send the reply because it has **no route back** to the source.\n\n- `allowaccess fgfm` on the FortiGate matters for inbound FGFM to the FortiGate. Here the FortiGate is the client.\n- `fgfm-allow-vm` is checked after TCP and TLS, when FortiManager sees the serial number. The TCP handshake would still complete.\n- The destination 203.0.113.10:541 is FortiManager itself, so `fmg` is correct.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-015",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "FMG-HQ manages an FGCP active-passive cluster of two FortiGates. Which two statements are true? (Choose two.)",
    "options": [
      "FortiManager manages the cluster as one device with one device database, and FGFM runs to the primary unit.",
      "The secondary FortiGate doesn't count toward the FortiManager device license.",
      "FortiManager configures FGCP on the real FortiGates when you add both units with Discover Device.",
      "Each cluster member needs its own policy package, because FortiManager installs to each unit separately.",
      "After a failover, the administrator must authorize the new primary as a new device."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "FortiManager treats a cluster as **one managed device**. It talks to the **primary**, installs there, and FGCP synchronizes the configuration to the secondary. License rules don't count the **secondary** FortiGate.\n\n- FortiManager can't configure HA on real FortiGates. Build the cluster on the FortiGates, or pre-provision a model HA cluster for ZTP.\n- There's one policy package and one install target for the cluster.\n- FortiManager already knows the member serial numbers, so after a failover the new primary brings up FGFM and management continues without re-registration.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-016",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator wants to pre-provision a FortiGate HA pair for a new data center so that FortiManager pushes the configuration when both units come online. Which approach is supported?",
    "options": [
      "Create a model HA cluster (Add Model Device with HA settings, or a device blueprint with an HA section) using the two serial numbers.",
      "Discover each unit separately and then use a CLI script on the device database to merge the two devices into a cluster.",
      "Add one unit as a model device and let FortiManager configure FGCP on the second unit through the system template.",
      "Create two ADOMs, one per unit, and link them with a global policy package."
    ],
    "answer": [
      0
    ],
    "explanation": "FortiManager supports **model HA clusters** for zero-touch/low-touch deployment. You define the members (serial numbers) and HA settings such as heartbeat and monitor interfaces and the password, either in Add Model Device or in a blueprint's **HA** section. When the units come up, they link as one cluster and the higher-priority unit becomes primary.\n\n- A device database script can't merge two managed devices into a cluster.\n- System templates have no HA widget, and FortiManager doesn't build FGCP on real devices.\n- ADOMs and global packages have nothing to do with forming a cluster.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-017",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. How many FortiManager device licenses does this cluster consume?",
    "exhibit": "HA cluster FGT-DC (FGCP active-passive)\n  Primary   : FGT-DC-A   FG100FTK24000201\n  Secondary : FGT-DC-B   FG100FTK24000202\n\nVDOM mode: multi-VDOM\n  VDOM      Type\n  global    -\n  mgmt      admin\n  root      traffic\n  Retail-A  traffic\n  Retail-B  traffic",
    "options": [
      "4",
      "6",
      "10",
      "3"
    ],
    "answer": [
      3
    ],
    "explanation": "With VDOMs enabled, FortiManager counts **one license per traffic VDOM**: root, Retail-A and Retail-B = **3**. The **admin-type** VDOM (`mgmt`) isn't counted, the **global** VDOM isn't counted, and the **secondary** HA member adds nothing.\n\n- 4 would wrongly count the admin VDOM.\n- 6 would count the traffic VDOMs again for the secondary unit.\n- 10 would count every VDOM on both units.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-018",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator wants 40 FortiGates in ADOM Retail to share the same DNS and NTP settings, based on the settings already running on FGT-Branch1, and wants the settings to stay applied at every future install. What should the administrator use?",
    "options": [
      "A policy package that contains DNS and NTP objects, installed to the 40 devices.",
      "A device blueprint edited to include DNS and NTP, which then updates the 40 existing devices.",
      "A system template with the DNS and NTP Server widgets, imported from FGT-Branch1 and assigned to a device group containing the 40 devices.",
      "A CLI script that targets Remote FortiGate Directly, run once on each device."
    ],
    "answer": [
      2
    ],
    "explanation": "A **system template** controls system settings through widgets (DNS, NTP Server, Admin Settings, SNMP, Log Settings and so on). **More > Import** copies the values from a managed device such as FGT-Branch1, and **Assign to Devices/Groups** applies it to a group. Because the template owns those settings, every install reapplies them.\n\n- A script runs once. Later local changes or edits aren't corrected.\n- Policy packages hold policies and firewall objects, not system DNS/NTP settings.\n- Blueprints affect only model devices created after the change, and they don't hold DNS/NTP values themselves.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-019",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The administrator wants a copy of the system template from ADOM Retail in ADOM MSSP-CustomerA, but after these commands the template doesn't appear correctly in MSSP-CustomerA. What should the administrator do?",
    "exhibit": "FMG-HQ # execute fmprofile export-profile Retail 10465 retail-base\nFMG-HQ # execute fmprofile import-profile MSSP-CustomerA 10465 /tmp/retail-base",
    "options": [
      "Copy the template with execute fmscript copy, which also copies provisioning templates.",
      "Create an empty system template with the same name in MSSP-CustomerA, find its profile ID, and import the file into that ID.",
      "Run the import from the root ADOM, because templates can only be imported into root and then moved.",
      "Move a device from Retail to MSSP-CustomerA, because system templates follow devices between ADOMs."
    ],
    "answer": [
      1
    ],
    "explanation": "Profile IDs are **per ADOM**. ID 10465 belongs to Retail and means nothing in MSSP-CustomerA. The procedure is: create a blank template with the same name in the target ADOM, look up its ID (`execute fmprofile list-profiles MSSP-CustomerA`, or `import-profile MSSP-CustomerA ?`), then run `import-profile MSSP-CustomerA <new-id> /tmp/retail-base`. Alternatively, use the GUI Export Templates/Import Templates (JSON) option.\n\n- Templates don't need to pass through root.\n- System templates do **not** follow a device that moves to another ADOM.\n- `execute fmscript copy` copies scripts, not provisioning templates.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-020",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator assigns a system template with new NTP servers to FGT-Branch1. FGT-Branch1 was Synchronized before the change. What happens next?",
    "options": [
      "FGT-Branch1 shows Modified, and the NTP change reaches the FortiGate at the next install of device settings.",
      "FortiManager pushes the NTP settings to FGT-Branch1 immediately over FGFM, and the status stays Synchronized.",
      "FGT-Branch1 shows Auto-update, because the template was applied automatically.",
      "FGT-Branch1 shows Out of Sync until the administrator retrieves its configuration."
    ],
    "answer": [
      0
    ],
    "explanation": "Assigning (or unassigning) a template sets the device's config status to **Modified** (pending install). At install time FortiManager applies the template to the device database and pushes the difference. Nothing reaches the FortiGate until that install (Install Device Settings (only), or Install Policy Package & Device Settings).\n\n- Templates aren't pushed live. Only a remote-FortiGate script runs immediately.\n- Auto-update means a change made **on the FortiGate** was taken into FortiManager.\n- Out of Sync means the FortiGate changed and FortiManager didn't take the change in. A retrieve would also throw away the template change.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-021",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "What does enabling chassis management add to FortiManager?",
    "options": [
      "A new management protocol that replaces FGFM for the blades in the chassis.",
      "The ability to configure FGCP HA between blades from FortiManager.",
      "A separate license pool so that chassis blades don't count as devices.",
      "Visibility of supported Fortinet chassis hardware through the shelf manager (slots and blades, power, fans, temperature), while the blades are still managed as FortiGate devices."
    ],
    "answer": [
      3
    ],
    "explanation": "Chassis management lets FortiManager work with the **shelf manager** of supported Fortinet ATCA chassis (FortiGate-5000 series) and show the hardware in a chassis dashboard. It is enabled in FortiManager's advanced settings with an update interval. `diagnose dvm chassis list` and `diagnose dvm chassis supported-models` show the CLI view.\n\nThe blades are still FortiGates managed over **FGFM**. Chassis management doesn't change the protocol, doesn't configure HA and isn't a license feature.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-022",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator regularly runs scripts on, assigns templates to and installs to the same 120 SD-WAN spoke FortiGates in ADOM Retail. What is the most efficient way to target them?",
    "options": [
      "Add a metadata variable called spoke to each device and select the variable as the target.",
      "Select the 120 devices individually each time, because device groups can't be script targets.",
      "Create a device group for the spokes and use it as the target for scripts, templates and installs.",
      "Create a separate ADOM for the spokes so that each operation applies to the whole ADOM."
    ],
    "answer": [
      2
    ],
    "explanation": "**Device groups** exist for exactly this. A group is a reusable target for scripts (`execute fmscript run ... group <name>` on the CLI), template assignment (Assign to Devices/Groups), policy package installation targets and firmware upgrades.\n\n- A new ADOM would split policy and object management and needs ADOM-level planning. That's not a targeting shortcut.\n- Metadata variables supply per-device values. They aren't targets.\n- Device groups **can** be script targets.",
    "lesson": "2.1-templates-ha-chassis-groups"
  },
  {
    "id": "d2-023",
    "topic": "2.1",
    "type": "order",
    "difficulty": 3,
    "stem": "Place the stages of adding a FortiGate to FortiManager in the order they occur.",
    "items": [
      "TCP connection to port 541 is opened by the initiating side",
      "TLS handshake with exchange of Fortinet certificates",
      "Serial number in the request is checked against the certificate and device policy (VM allowed, licence)",
      "Device is authorized (admin approval, auto-link of a model device, or matching pre-shared key)",
      "FGFM tunnel comes up with link-local addresses and the device shows conn: up",
      "Device configuration is stored as a revision, with an optional policy import"
    ],
    "explanation": "Think of it bottom-up: **TCP 541 → TLS → identity (serial/CN, VM allowed, licence) → authorization → tunnel → device database/revision (+ optional import)**. This order also drives troubleshooting. SYNs without replies are a network problem, a CN mismatch is an identity problem, and an Unauthorized Devices entry means the authorization step is waiting for an admin.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-024",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator clicks Finish without downloading the import report. Later, the security team asks for the list of objects that the import created. Where can the administrator download that report?",
    "exhibit": "Add Device wizard - FGT-Branch1 - Import Device - Summary\n  Policy package       : Branch-PP (ADOM Retail)\n  Policies imported    : 12\n  Objects created      : 38\n  Objects updated      : 4\n  Conflicts            : 0\n  [Download Import Report]                 [Finish]",
    "options": [
      "Nowhere. The import report can be downloaded only from the summary page of the import wizard.",
      "From the device's revision history, where each import creates a revision with its report.",
      "From System Settings > Event Log, where the full report is stored as an attachment.",
      "From the policy package's Installation tab, which keeps the last ten import reports."
    ],
    "answer": [
      0
    ],
    "explanation": "The import report is available **only on the final page** of the import wizard. Once you click Finish, it's gone, so download it before you leave the page.\n\n- A policy import updates the **ADOM database**. It doesn't create a device revision.\n- Event logs record that tasks ran, but they don't keep the downloadable report.\n- Policy packages don't keep a history of import reports.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-025",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "FMG-HQ refuses a FortiGate-VM as an unsupported device. Complete the FortiManager command under config system global that allows VM devices to be managed: set ______ enable",
    "answer": [
      "fgfm-allow-vm",
      "set fgfm-allow-vm enable",
      "fgfm-allow-vm enable"
    ],
    "explanation": "`config system global` / `set fgfm-allow-vm enable`. The setting was added in FortiManager **7.6.3** (and 7.4.7, 7.2.10) and is **disabled by default**. While it's disabled, FortiManager rejects FGFM connections from VM serial numbers (FortiGate-VM, FortiCarrier-VM, FortiProxy-VM, FortiFirewall-VM, FortiAnalyzer-VM) with \"Unsupported device model\", so the VM doesn't even reach the unauthorized list. VMs managed before the upgrade keep working. Changing it restarts the FGFM daemon, so all tunnels reconnect briefly. FortiManager 7.6.0–7.6.2 have no such setting.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-026",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator adds FGT-Branch1 (FortiOS 7.6) with Add Device > Discover Device, enters its management IP and logs in with a FortiGate administrator account. What must happen before discovery continues?",
    "options": [
      "The FortiGate is rebooted so that it loads the FortiManager certificate.",
      "The FortiManager administrator enters the FortiGate's pre-shared key.",
      "The administrator approves the authorization request (Allow) presented by the FortiGate.",
      "The FortiGate administrator runs execute central-mgmt register-device on the FortiGate CLI."
    ],
    "answer": [
      2
    ],
    "explanation": "For current FortiOS versions, Discover Device uses a login to the FortiGate followed by an **authorization request** that you **Allow**. Then FortiManager collects the device details and continues to the name, template, group and import steps. (For FortiOS 6.4 and earlier, the wizard falls back to a legacy username and password login.)\n\n- `register-device` belongs to the pre-shared key and FortiGate-initiated methods.\n- No reboot is involved.\n- Pre-shared keys are used for model devices, not for Discover Device.",
    "lesson": "2.1-registration-methods"
  },
  {
    "id": "d2-027",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FMG-HQ fails to discover FortiGate-VM FGT-Branch2 at 198.51.100.12. Which two changes are required for Discover Device to succeed? (Choose two.)",
    "exhibit": "FGT-Branch2 # show system interface port1\nconfig system interface\n    edit \"port1\"\n        set vdom \"root\"\n        set ip 198.51.100.12 255.255.255.0\n        set allowaccess ping https ssh\n        set type physical\n    next\nend\n\nFMG-HQ # get system global\n...\nfgfm-allow-vm       : disable\nfgfm-deny-unknown   : disable\n...",
    "options": [
      "Run execute central-mgmt register-device on FGT-Branch2 with the FortiManager serial number.",
      "Add fgfm to the allowaccess list of port1 on FGT-Branch2.",
      "Enable fgfm-allow-vm in config system global on FMG-HQ.",
      "Set type fortimanager in config system central-management on FGT-Branch2.",
      "Enable fgfm-deny-unknown on FMG-HQ so that only discovered devices are accepted."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "Discover Device means **FortiManager connects to the FortiGate on TCP 541**, so port1 must accept FGFM: add `fgfm` to `allowaccess`. FGT-Branch2 is a **FortiGate-VM**, and this FortiManager has the `fgfm-allow-vm` setting (7.6.3 and later, default disable), so it rejects VM serial numbers until the setting is enabled.\n\n- Central management settings on the FortiGate are for the FortiGate-initiated method. Discover doesn't need them.\n- `fgfm-deny-unknown` (already disabled) would make registration stricter, not fix it.\n- `register-device` is for pre-shared key or FortiGate-side registration, not Discover.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-028",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A firewall in front of FMG-HQ permits TCP 541 only from each branch's loopback address. FGT-Branch1 uses loopback 10.255.0.11 and has several WAN and LAN interfaces. Which setting makes FGT-Branch1 source its FGFM traffic from the loopback?",
    "options": [
      "set fmg-source-ip 10.255.0.11 under config system central-management",
      "set fmg 10.255.0.11 under config system central-management",
      "set interface-select-method sdwan under config system central-management",
      "set allowaccess fgfm on the loopback interface"
    ],
    "answer": [
      0
    ],
    "explanation": "`fmg-source-ip` (default 0.0.0.0, meaning the egress interface address) sets the **source IPv4 address** that the FortiGate uses toward FortiManager. Point it at the loopback (and make sure the loopback is routed toward FortiManager).\n\n- `fmg` is the **FortiManager's** address, not the source.\n- `interface-select-method sdwan` picks the egress interface through SD-WAN rules. It doesn't set the loopback as the source.\n- `allowaccess fgfm` allows **inbound** FGFM on an interface. It doesn't change the source of outbound sessions.",
    "lesson": "2.1-fgfm-discovery-troubleshooting"
  },
  {
    "id": "d2-029",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The script fails on the device database of FGT-Branch1, although the same lines typed on the FortiGate CLI work. Why?",
    "exhibit": "Script name   : Set-Hostname\nType          : CLI Script\nRun Script On : Device Database\n\nconfig system global\n    set host \"FGT-Branch1-NEW\"\nend\n\nScript log (FGT-Branch1):\nStarting log (Run on database)\n\n config system global\n  set host \"FGT-Branch1-NEW\"\ncommand parse error",
    "options": [
      "The hostname can't be changed with a script. It must be set in a system template.",
      "config system global can only be used in scripts that run on the Global Database ADOM.",
      "The quotation marks around the value aren't allowed in FortiManager scripts.",
      "Database targets need full keywords. The abbreviation host must be written as hostname."
    ],
    "answer": [
      3
    ],
    "explanation": "The FortiOS CLI accepts unambiguous abbreviations (`set host` completes to `set hostname`), but scripts that run on a **database** (device database, ADOM database, Global Database) must use **complete keywords**. Otherwise FortiManager reports `command parse error`.\n\n- Scripts can change the hostname, and a system template is only one option.\n- `config system global` is a normal FortiOS context. It's unrelated to the Global Database ADOM.\n- Quoted values are normal FortiOS syntax.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-030",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The script completes without errors. What does FMG-HQ show for FGT-Branch1 afterwards?",
    "exhibit": "Script name   : Add-Payroll-Server\nType          : CLI Script\nRun Script On : Remote FortiGate Directly (via CLI)\nTarget        : FGT-Branch1 (ADOM Retail, policy package Branch-PP)\n\nconfig firewall address\n    edit \"Srv-Payroll\"\n        set subnet 10.20.0.15 255.255.255.255\n    next\nend",
    "options": [
      "Config status Out of Sync until the administrator retrieves the configuration manually.",
      "Policy package status Modified, because the address object was added to the ADOM database.",
      "Config status Synchronized after the automatic retrieve, and policy package status Unknown.",
      "Config status Modified until the administrator runs Install Device Settings (only)."
    ],
    "answer": [
      2
    ],
    "explanation": "A **Remote FortiGate Directly** script changes the FortiGate immediately. FortiManager then **retrieves** the configuration into the device database (a new revision), so the config status is **Synchronized**. The ADOM database wasn't updated, so the **policy package status is Unknown** until you import (or reinstall).\n\n- Modified would be the result of a **device database** run.\n- FortiManager performs the retrieve itself, so the device doesn't stay Out of Sync.\n- Nothing was written to the ADOM database. A policy package or ADOM database run would do that.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-031",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator runs a CLI script that adds a static route, with Run Script On set to Device Database, on FGT-Branch2. The log ends with \"on DB success\". Which two statements are true? (Choose two.)",
    "options": [
      "The route is active on FGT-Branch2 already, and FortiManager created a new revision by retrieving it.",
      "The policy package Branch-PP shows Modified, because routes are part of the policy package.",
      "The script can be scheduled to repeat nightly only because it targets the device database.",
      "FGT-Branch2 shows config status Modified.",
      "The route reaches FGT-Branch2 only when the administrator installs device settings."
    ],
    "answer": [
      3,
      4
    ],
    "explanation": "A device database run edits FortiManager's **copy** of the device settings. The device becomes **Modified**, and the FortiGate gets the route at the next **install** (Install Device Settings (only), or a full install).\n\n- Changes are live with an automatic retrieve only for **Remote FortiGate Directly** scripts.\n- Static routes are device-level settings, not policy package content.\n- Scheduling is about Remote FortiGate Directly scripts (and isn't possible for the Policy Package or ADOM Database target). The device database target isn't what enables it.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-032",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about Tcl scripts in FortiManager 7.6 are true? (Choose two.)",
    "options": [
      "The Validate button checks Tcl syntax against the selected device platform.",
      "The TCL Script type is available only after set show_tcl_script enable under config system admin setting.",
      "Tcl scripts run over SSH tunneled through FGFM, so valid FortiGate administrator credentials must be stored in Device Manager.",
      "Tcl scripts can run on the device database, the ADOM database or the remote FortiGate.",
      "A Tcl script must end with the exit command so the SSH session closes cleanly."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "Tcl is hidden until `config system admin setting` / `set show_tcl_script enable`. Unlike CLI scripts, which use the FGFM channel authenticated by serial numbers, Tcl scripts open an **SSH session through the FGFM tunnel**, so the stored admin credentials must be valid.\n\n- Tcl scripts run **only on Remote FortiGate Directly (via CLI)**.\n- Don't use `exit`. It **prevents** the script from running.\n- Validate (and Validate on change) are for **CLI scripts only**.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-033",
    "topic": "2.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each script type or ADOM with the targets it supports in FortiManager 7.6.",
    "pairs": [
      [
        "Tcl script",
        "Remote FortiGate Directly (via CLI) only"
      ],
      [
        "Jinja script",
        "ADOM database only"
      ],
      [
        "CLI script in the Global Database ADOM",
        "Policy package or ADOM database only"
      ],
      [
        "CLI script in a normal ADOM",
        "Device database, policy package or ADOM database, or remote FortiGate"
      ]
    ],
    "explanation": "- **Tcl**: sends commands to the live FortiGate through SSH inside FGFM, so it runs on the remote FortiGate only.\n- **Jinja**: templated changes to the ADOM database only.\n- **Global Database ADOM**: supports only CLI scripts, and they run on the policy package or ADOM database (global objects and header/footer policies).\n- **CLI scripts in a normal ADOM** have all three targets.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-034",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. A remote CLI script fails on FGT-Branch2. The address object Branch-LAN exists in ADOM Retail. What is the cause?",
    "exhibit": "Starting log (Run on device)\n\nFGT-Branch2 $ config firewall policy\nFGT-Branch2 (policy) $ edit 7\nFGT-Branch2 (7) $ set srcaddr \"Branch-LAN\"\nentry not found in datasource\n\nvalue parse error before 'Branch-LAN'\nCommand fail. Return code -3\nFGT-Branch2 (7) $ next\nFGT-Branch2 (policy) $ end\n------- The end of log ----------",
    "options": [
      "Remote scripts can't change firewall policies. They must run on the policy package.",
      "The quotation marks around Branch-LAN must be removed for remote scripts.",
      "Branch-LAN exists only in the ADOM database and has never been installed to FGT-Branch2, so the FortiGate has no object with that name to reference.",
      "The script uses edit 7, and remote scripts must use edit 0 to create policies."
    ],
    "answer": [
      2
    ],
    "explanation": "A **Remote FortiGate Directly** script talks to the **FortiGate's** configuration, not the ADOM's. `entry not found in datasource ... Return code -3` means the referenced object isn't on the FortiGate. Create the address first (earlier in the same script) or install it from FortiManager, then reference it.\n\n- `edit 7` is valid. It edits or creates policy ID 7.\n- Remote scripts can change policies, though doing so leaves the policy package out of step until you import.\n- Quoted names are normal FortiOS syntax.",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-035",
    "topic": "2.2",
    "type": "single",
    "difficulty": 1,
    "stem": "Refer to the exhibit. An administrator wants to run a script every night at 02:00 but can't find the Schedule Script option. What should the administrator do?",
    "exhibit": "Device Manager > Scripts (ADOM Retail) - toolbar\n  [Create New] [Edit] [Delete] [Run Script] [Clone] [Import CLI Script] [Export Script]",
    "options": [
      "Enable show_tcl_script, because the scheduler is part of the Tcl engine.",
      "Run config system admin setting, set show_schedule_script enable, end on FMG-HQ.",
      "Change the ADOM to workflow mode, because scheduling is a workflow feature.",
      "Convert the script to Tcl, because only Tcl scripts can be scheduled."
    ],
    "answer": [
      1
    ],
    "explanation": "Script scheduling is **hidden by default**. It appears in the toolbar, More menu and right-click menu after `config system admin setting` / `set show_schedule_script enable`.\n\n- Workflow mode has nothing to do with script scheduling.\n- CLI scripts can be scheduled too. The target matters: Remote FortiGate Directly, and never Policy Package or ADOM Database.\n- `show_tcl_script` reveals the Tcl script type, not scheduling.",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-036",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "Under config system admin setting on FortiManager, which command makes the TCL Script type available in the script editor?",
    "answer": [
      "set show_tcl_script enable",
      "show_tcl_script enable",
      "show_tcl_script"
    ],
    "explanation": "`config system admin setting` / `set show_tcl_script enable` / `end`. The companion setting `show_schedule_script` reveals script scheduling. Note the underscores in both names.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-037",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator has enabled script scheduling and wants a CLI script that adds address objects to policy package Branch-PP to run every Sunday night. FortiManager doesn't let the administrator create a schedule for this script. Why?",
    "options": [
      "Scheduled scripts must be Tcl scripts.",
      "Weekly recurrence is available only for scripts in the Global Database ADOM.",
      "Address objects can only be added with Jinja scripts.",
      "Scripts whose target is Policy Package or ADOM Database can't be scheduled."
    ],
    "answer": [
      3
    ],
    "explanation": "FortiManager doesn't allow schedules on scripts with the **Policy Package or ADOM Database** target. The automatic execute after install and timed schedule options are offered for **Remote FortiGate Directly (via CLI)** scripts.\n\n- CLI scripts can be scheduled. Tcl isn't required.\n- One Time, Daily, Weekly and Monthly recurrences aren't tied to the Global Database ADOM.\n- CLI scripts can add address objects to the ADOM database.",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-038",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "A remote CLI script that contains several show commands runs fine on FGT-Branch2 but hangs on FGT-Branch1 until it times out. On FGT-Branch1, config system console has output set to more. What should the administrator change?",
    "options": [
      "Change the script target to Device Database so show commands run faster.",
      "Split the show commands into a Tcl script, because CLI scripts can't run show commands.",
      "On FGT-Branch1, set output standard under config system console so the CLI doesn't pause with --More--.",
      "On FMG-HQ, increase fgfm_keepalive_itvl so the session doesn't time out during the script."
    ],
    "answer": [
      2
    ],
    "explanation": "With paged output, the FortiGate stops at `--More--` and waits for a key press while FortiManager waits for the prompt, so the script hangs until it times out. Disabling paging (`config system console` / `set output standard`) on FortiGates that receive scripts is a documented best practice.\n\n- A longer keepalive interval doesn't fix a CLI waiting for input.\n- On a database target, show commands give no useful output.\n- CLI scripts can run show commands on the remote FortiGate, and the output appears in the log.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-039",
    "topic": "2.2",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the steps for safely rolling out a new CLI script to 60 branch FortiGates in the recommended order.",
    "items": [
      "Write the script with full keywords and closed config contexts",
      "Validate it against the branch device platform",
      "Run it on one test branch",
      "Review that branch's script log and status",
      "Run it on the device group with the remaining branches",
      "Check the results (logs, config status, revisions) across the group"
    ],
    "explanation": "Best practice is to build it cleanly (full keywords, `end` for every `config`), **Validate** (CLI scripts only), **test on one device** and **read the log**, then widen the target, usually to a **device group**, and verify. Backing up first and keeping scripts short make each step easier to undo.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-040",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Which line must the administrator correct?",
    "exhibit": "Script log (FGT-Branch1):\nStarting log (Run on database)\n\n config router statc\ncommand parse error\n  edit 0\nunknown action\n   set dst 172.16.50.0 255.255.255.0\nunknown action\n   set gateway 10.1.1.254\nunknown action\n  next\n end",
    "options": [
      "config router statc",
      "edit 0",
      "set dst 172.16.50.0 255.255.255.0",
      "set gateway 10.1.1.254"
    ],
    "answer": [
      0
    ],
    "explanation": "`unknown action` usually means **the previous line wasn't executed**. The real error is the first one: `config router statc` (a typo for `static`) gives `command parse error`, so no context opens and every following `edit`/`set` reports `unknown action`. Fix the `config` line and the rest runs.\n\nThe `edit 0`, `set dst` and `set gateway` lines are valid inside `config router static`. They fail only because the context never opened.",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-041",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What is the most likely problem with this script?",
    "exhibit": "Script:\nconfig system dns\n    set primary 192.0.2.53\n    set secondary 192.0.2.54\n\nResult:\nDevice FGT-Branch1 failed-1",
    "options": [
      "DNS servers can only be set with a system template, not with a script.",
      "The DNS addresses must be in quotation marks.",
      "The script needs config global because FGT-Branch1 is in normal ADOM mode.",
      "The script doesn't close config system dns with end."
    ],
    "answer": [
      3
    ],
    "explanation": "`Device <name> failed-1` usually points to a problem at the **end of the script**, most often a missing `end`. (It can also appear when the device isn't synchronized.) Here the `config system dns` block is never closed.\n\n- Scripts can set DNS. A system template is only another way to do it.\n- IP address values don't need quotation marks.\n- `config global` is for VDOM-enabled FortiGates. ADOM mode has nothing to do with it.",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-042",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which FortiManager CLI command shows the most recent script log for the managed device FGT-Branch1?",
    "answer": [
      "execute fmscript showlog FGT-Branch1",
      "exec fmscript showlog FGT-Branch1",
      "execute fmscript showlog",
      "exec fmscript showlog"
    ],
    "explanation": "`execute fmscript showlog <device_name>` prints the script log for that device, for example `Running script(...) on DB success` for a database run. The related commands are `execute fmscript list` (IDs, names, types), `execute fmscript run` and `execute fmscript run-task` (asynchronous, returns a task ID).",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-043",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The Tcl script never produces output on FGT-Branch1, although the administrator's credentials are correct and show_tcl_script is enabled. What is wrong?",
    "exhibit": "#!\nputs [exec \"get system performance status\\n\" \"# \" 15]\nexit",
    "options": [
      "The timeout of 15 seconds is below the minimum of 60 seconds.",
      "The exit command prevents a FortiManager Tcl script from running. Remove it.",
      "The first line must be #!/usr/bin/tclsh for FortiManager to recognize Tcl.",
      "exec can't run get commands. Only config commands are allowed in Tcl scripts."
    ],
    "answer": [
      1
    ],
    "explanation": "Fortinet states that including `exit` stops the script from running. The rest is correct: the first line is just `#!`, `exec` sends the command (the `\\n` executes it), waits for the `# ` prompt with a 15-second timeout, and `puts` writes the result to the log.\n\n- FortiManager Tcl doesn't need an interpreter path. The first line is `#!`.\n- `exec` can send any CLI command, including `get`, and return its output.\n- 15 seconds is the timeout used in Fortinet's own examples.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-044",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. A remote CLI script fails on FGT-Branch1. How should the administrator fix the script?",
    "exhibit": "FMG-HQ # diagnose dvm device list FGT-Branch1\n...\nfmgfaz-managed  231    FGVM02TM24000111   -       198.51.100.11   FGT-Branch1    Retail   N/A   7.0 MR6 (3401)   N/A\n                |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: installed; conn: up\n                |- vdom:[3]root flags:0 adom:Retail pkg:[installed]Branch-PP\n                |- vdom:[4]Guest flags:0 adom:Retail pkg:[installed]Guest-PP\n\nScript log (FGT-Branch1):\nStarting log (Run on device)\n\nFGT-Branch1 $ config router static\ncommand parse error before 'router'\nCommand fail. Return code -61",
    "options": [
      "Wrap the commands in config vdom, edit root, ..., end so they run in the root VDOM context.",
      "Change the target to Device Database, because routes can't be added remotely.",
      "Replace config router static with config system static, which is the VDOM-mode syntax.",
      "Enable show_tcl_script, because VDOM-enabled FortiGates accept only Tcl scripts."
    ],
    "answer": [
      0
    ],
    "explanation": "The device list shows **two VDOMs** (root and Guest), so VDOMs are enabled. A remote session starts at the top (global) level, where `config router static` doesn't exist, so FortiOS rejects it. VDOM-level commands must be wrapped in `config vdom` / `edit root` ... `end`, and global ones in `config global` ... `end`.\n\n- Routes can be added remotely once the context is correct.\n- `config system static` isn't a FortiOS command.\n- CLI scripts work fine on VDOM-enabled FortiGates. Tcl isn't required.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-045",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Which FortiManager command runs script ID 12 from ADOM Retail against FortiManager's device database copy of FGT-Branch1, without touching the FortiGate?",
    "options": [
      "execute fmscript run Retail 12 device FGT-Branch1",
      "execute fmscript run Retail 12 adomdb FGT-Branch1",
      "execute fmscript showlog Retail 12 FGT-Branch1",
      "execute fmscript run Retail 12 devicedb FGT-Branch1"
    ],
    "answer": [
      3
    ],
    "explanation": "The syntax is `execute fmscript run [adom] <script-id> <run_on> <device | group | package-id>`, where `run_on` is `device`, `group`, `devicedb`, `adomdb` or `globaldb`. **`devicedb`** runs on the device's database in FortiManager.\n\n- `device` runs the script on the remote FortiGate.\n- `adomdb` runs on a policy package and takes a package ID, not a device name.\n- `showlog` displays a log. It doesn't run anything.",
    "lesson": "2.2-script-scheduling-troubleshooting"
  },
  {
    "id": "d2-046",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 1,
    "stem": "Which two are recommended practices for FortiManager CLI scripts? (Choose two.)",
    "options": [
      "End each command line with a semicolon so FortiManager can separate the commands.",
      "Run a new script on the whole ADOM first so that all devices stay consistent.",
      "Leave out next and end statements to keep the script short. FortiManager closes contexts automatically.",
      "Use complete command keywords, such as set hostname instead of set host.",
      "Keep scripts short and focused, and chain them (for example in a script group) if needed."
    ],
    "answer": [
      3,
      4
    ],
    "explanation": "Full keywords are mandatory for database targets and avoid surprises everywhere. Short scripts are easier to troubleshoot and can be chained.\n\n- Don't put punctuation at the start or end of lines. Only a command and whitespace belong on a line.\n- Test on **one** device first, then widen the target.\n- Missing `end` statements cause failures such as `failed-1`. Close every context.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-047",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. An administrator runs a CLI script on Remote FortiGate Directly against FGT-Branch1. How does FMG-HQ bring the change into the device database?",
    "exhibit": "FMG-HQ # get system dm\n...\nconf-merge-after-script : disable\n...\nscript-logsize          : 100\n...",
    "options": [
      "It imports the changes into policy package Branch-PP and leaves the device database unchanged.",
      "It performs a full retrieve of FGT-Branch1's configuration after the script and saves it as a new revision.",
      "It merges only the script's commands into the device database, without retrieving.",
      "It doesn't update the device database. The device shows Out of Sync until the administrator retrieves."
    ],
    "answer": [
      1
    ],
    "explanation": "`conf-merge-after-script` controls what happens after a script runs on the remote device. **Disabled** (as shown), FortiManager does a **full retrieve**, which creates a new revision and leaves the device Synchronized. Enabled, it merges the script's config instead of doing a full retrieve.\n\n- The merge behavior is what `enable` would give.\n- FortiManager doesn't leave the device Out of Sync. It catches up itself.\n- Nothing updates the policy package automatically. That needs an import.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-048",
    "topic": "2.2",
    "type": "single",
    "difficulty": 1,
    "stem": "In the script editor, the Validate button is unavailable for one of an administrator's scripts. Which script is it most likely to be?",
    "options": [
      "A Tcl script that runs on the remote FortiGate.",
      "A CLI script that runs on the device database.",
      "A CLI script that runs on the policy package or ADOM database.",
      "A CLI script that runs on Remote FortiGate Directly (via CLI)."
    ],
    "answer": [
      0
    ],
    "explanation": "**Validate** (and Validate on change) check syntax against a chosen device platform and are supported for **CLI scripts only**. A Tcl script can't be validated this way. Test it on one device and read the log. Every CLI script, whatever its target, can be validated.",
    "lesson": "2.2-cli-tcl-scripts"
  },
  {
    "id": "d2-049",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What happened most recently to FGT-Branch1?",
    "exhibit": "FMG-HQ # diagnose dvm device list FGT-Branch1\n...\nfmgfaz-managed  231    FGVM02TM24000111   -       198.51.100.11   FGT-Branch1    Retail   N/A   7.0 MR6 (3401)   N/A\n                |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: autoupdated; conn: up\n                |- vdom:[3]root flags:0 adom:Retail pkg:[installed]Branch-PP",
    "options": [
      "An administrator changed FGT-Branch1's device settings in FortiManager, and they are waiting to be installed.",
      "FortiManager installed the policy package and device settings to FGT-Branch1.",
      "FGT-Branch1 lost its FGFM connection, and FortiManager can't determine which revision is running.",
      "Someone changed FGT-Branch1 locally, and FortiManager automatically took the change into the device database."
    ],
    "answer": [
      3
    ],
    "explanation": "`dm: autoupdated` means the latest revision came from an **auto-update**: a change made directly on the FortiGate was sent to FortiManager and merged into the device database (GUI status **Auto-update**). `dev-db: not modified` and `cond: OK` mean nothing is pending, and `conf: in sync` means the revision matches the device.\n\n- Pending FortiManager changes would show `dev-db: modified` and `cond: pending`.\n- An install would show `dm: installed`.\n- A lost connection would show `conn: down`, and the GUI status would be Unknown.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-050",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. A local administrator changed the DNS servers on FGT-Branch2 yesterday, and FMG-HQ has auto-update disabled. What is the correct way to keep the local change and bring FortiManager back in sync?",
    "exhibit": "FMG-HQ # get system admin setting\n...\nauto-update         : disable\n...\n\nDevice Manager - FGT-Branch2\n  Config Status    : Out of Sync\n  Total Revisions  : 9  (latest: ID 9, 2026-10-26 18:02, admin, Installed)",
    "options": [
      "Revert to revision 9, which accepts the FortiGate's current configuration.",
      "Import the policy package, which also updates the device database with the DNS change.",
      "Retrieve the configuration from FGT-Branch2, which creates revision 10 from the running config.",
      "Install device settings to FGT-Branch2, which copies the FortiGate's DNS servers into FortiManager."
    ],
    "answer": [
      2
    ],
    "explanation": "With auto-update **disabled**, a local change leaves the device **Out of Sync** and no new revision is created. **Retrieve** pulls the running configuration into the device database as a new revision (10), and the status returns to Synchronized.\n\n- An install pushes FortiManager's version **to** the FortiGate, which would overwrite the local DNS change.\n- Reverting to revision 9 also restores the old DNS servers, once installed.\n- An import updates **policies and objects** in the ADOM database, not device-level DNS settings.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-051",
    "topic": "2.3",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each device configuration status with its meaning.",
    "pairs": [
      [
        "Synchronized",
        "The latest revision is confirmed as running on the FortiGate"
      ],
      [
        "Modified",
        "The device database changed in FortiManager and hasn't been installed"
      ],
      [
        "Auto-update",
        "A local FortiGate change was automatically taken into the device database"
      ],
      [
        "Out of Sync",
        "The FortiGate changed and FortiManager hasn't taken the change in"
      ],
      [
        "Conflict",
        "The install failed, or both sides changed without an auto-sync"
      ],
      [
        "Unknown",
        "FortiManager can't tell which revision is running, typically because the connection is down"
      ]
    ],
    "explanation": "Out of Sync and Auto-update both mean someone changed the FortiGate directly. Auto-update means FortiManager already merged the change, and Out of Sync means it didn't (auto-update disabled or failed), so retrieve. Modified is the opposite direction: FortiManager has changes the FortiGate doesn't. Conflict is an install failure, or changes on both FortiManager and the FortiGate that weren't auto-synced. Unknown also appears for a model device that has no revision yet.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-052",
    "topic": "2.3",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. What does revision 15 indicate?",
    "exhibit": "Configuration Revision History - FGT-Branch1\nID   Date & Time          Name          Created by    Installation   Comments\n15   2026-10-28 11:20     AutoRetrieve  AutoRetrieve  N/A            Retrieve\n14   2026-10-28 09:42     AutoUpdate    AutoUpdate    N/A            Auto update from device\n13   2026-10-27 22:10                   admin         Installed\n12   2026-10-25 14:03                   jsmith        Installed",
    "options": [
      "FortiManager detected a configuration change that the FortiGate didn't report through auto-update, so it retrieved the full configuration itself.",
      "An administrator clicked Retrieve Config in the revision history toolbar.",
      "The FortiGate sent its configuration change to FortiManager, which merged it into the device database.",
      "FortiManager installed revision 13 again after an install failure."
    ],
    "answer": [
      0
    ],
    "explanation": "Revisions named and created by **AutoRetrieve** with the comment *Retrieve* come from the **auto-retrieve fallback**. When the FortiGate fails to start an auto-update, FortiManager retrieves the full configuration itself.\n\n- A manual Retrieve Config shows the administrator's account in Created by.\n- A FortiGate-initiated auto-update looks like revision 14 (`AutoUpdate`, *Auto update from device*).\n- An install shows the administrator and an installation status, not AutoRetrieve.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-053",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "FGT-Branch1 is Synchronized and its running configuration is identical to the latest revision. An administrator clicks Retrieve Config. What is the result?",
    "options": [
      "A new revision is always created and named Retrieve.",
      "The device database is cleared and rebuilt, so the device shows Modified.",
      "The policy package is re-imported automatically.",
      "No new revision is created, because the running configuration doesn't differ from the latest revision."
    ],
    "answer": [
      3
    ],
    "explanation": "Retrieve Config compares the running configuration with the repository copy. A new revision (with a new ID) is created **only if they differ**.\n\n- Revisions aren't created when nothing changed.\n- A retrieve never leaves the device Modified. It aligns the device database with the device.\n- Retrieve doesn't import policies. Only the import wizard updates the ADOM database.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-054",
    "topic": "2.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator selects revision 13 of FGT-Branch1 and chooses Revert, but hasn't installed yet. Which two statements are true? (Choose two.)",
    "options": [
      "Revisions 14 and later are deleted from the revision history.",
      "FGT-Branch1 reboots to load revision 13.",
      "The device database now holds the settings from revision 13, and the device shows Modified.",
      "FGT-Branch1 still runs its current configuration until an install pushes the reverted settings.",
      "Policy package Branch-PP in the ADOM database is also rolled back to how it was at revision 13."
    ],
    "answer": [
      2,
      3
    ],
    "explanation": "Revert loads the chosen revision into the **device database** (`dev-db: modified`, `cond: pending`). Nothing reaches the FortiGate until you **install**.\n\n- The **ADOM database** isn't reverted. Fortinet states that a revert doesn't affect the policy package or other modules, and policy packages have their own ADOM revisions. Afterwards you may need to import and reinstall to realign the package with the device database.\n- Revert doesn't delete later revisions.\n- The FortiGate isn't rebooted. A full config restore on the FortiGate would reboot it, but that's a different action.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-055",
    "topic": "2.3",
    "type": "fill",
    "difficulty": 2,
    "stem": "An administrator wants FortiManager to stop accepting local FortiGate changes automatically, so that an administrator decides whether to accept them. Complete the command under config system admin setting: set ______ disable",
    "answer": [
      "auto-update",
      "set auto-update disable",
      "auto-update disable"
    ],
    "explanation": "`config system admin setting` / `set auto-update disable` / `end`. Auto-update is **enabled by default**. When it's disabled, local changes leave the device **Out of Sync** until an administrator retrieves (accepts) or installs (overwrites).",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-056",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit (Revision Diff, Show Diff Only, revision 14 compared with revision 13). Which statement is correct?",
    "exhibit": "Revision 13 (2026-10-27 22:10, admin)          Revision 14 (2026-10-28 09:42, AutoUpdate)\nconfig system dns                               config system dns\n-    set primary 10.0.0.53                     +    set primary 192.0.2.53\nend                                             end\nconfig router static                            config router static\n                                                +    edit 3\n                                                +        set dst 172.16.99.0 255.255.255.0\n                                                +        set gateway 10.1.1.254\n                                                +        set device \"port2\"\n                                                +    next\nend                                             end",
    "options": [
      "The DNS server and static route 3 were changed directly on the FortiGate, and FortiManager took them in through auto-update.",
      "An administrator added static route 3 in FortiManager, and it hasn't been installed yet.",
      "Revision 14 was created by a Remote FortiGate Directly script run by admin.",
      "The diff shows that the policy package has a new route that must be imported."
    ],
    "answer": [
      0
    ],
    "explanation": "Revision 14 was **created by AutoUpdate**, so the changes (primary DNS 10.0.0.53 → 192.0.2.53, new static route 3) were made **on the FortiGate** and merged in automatically.\n\n- A change staged in FortiManager wouldn't be attributed to AutoUpdate. It would carry the administrator's name and show the device as Modified until installed.\n- After a remote script, FortiManager itself retrieves the configuration (or merges the script's changes). That isn't an auto-update sent by the FortiGate, so it wouldn't be labelled AutoUpdate.\n- Static routes and DNS are device settings. They don't belong to policy packages.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-057",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "In Revision Diff, what does the Capture Diff to a Script output option do?",
    "options": [
      "Runs the differences immediately as a Remote FortiGate Directly script.",
      "Creates a new revision that contains only the differences.",
      "Adds the differences to the ADOM database as a new policy package.",
      "Downloads the configuration differences between the two revisions as a CLI script file."
    ],
    "answer": [
      3
    ],
    "explanation": "The three diff outputs are **Show Full File Diff** (whole file, differences highlighted), **Show Diff Only** (changed parts only) and **Capture Diff to a Script**, which **downloads** the differences as a script to your browser's downloads folder. You can review it and, if you want, reuse it as a FortiManager CLI script, which is handy for a surgical rollback or for copying a change to other devices.\n\nIt doesn't run anything, create revisions or touch the ADOM database.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-058",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The output was taken right after an administrator reverted FGT-Branch1 to an older revision. What must the administrator do for the FortiGate to run the reverted settings?",
    "exhibit": "FMG-HQ # diagnose dvm device list FGT-Branch1\n...\nfmgfaz-managed  231    FGVM02TM24000111   -       198.51.100.11   FGT-Branch1    Retail   N/A   7.0 MR6 (3401)   N/A\n                |- STATUS: dev-db: modified; conf: in sync; cond: pending; dm: installed; conn: up\n                |- vdom:[3]root flags:0 adom:Retail pkg:[installed]Branch-PP",
    "options": [
      "Nothing. The revert was already applied to the FortiGate over FGFM.",
      "Import the policy package, which pushes the reverted settings.",
      "Run an install to FGT-Branch1 so that the reverted device database is pushed to the FortiGate.",
      "Retrieve the configuration from FGT-Branch1."
    ],
    "answer": [
      2
    ],
    "explanation": "`dev-db: modified` and `cond: pending` show that the reverted revision is sitting in the **device database**, waiting for an install. An install (Install Device Settings (only), or a full install) pushes it, after which the status returns to OK and Synchronized.\n\n- A retrieve would **overwrite** the reverted database with the current running configuration and undo the revert.\n- A revert doesn't touch the FortiGate by itself.\n- Import pulls policies **from** the device into the ADOM. It doesn't push anything. The revert doesn't touch the policy package (its status is unchanged), although Fortinet recommends importing and reinstalling afterwards if the package no longer matches the device database.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-059",
    "topic": "2.3",
    "type": "single",
    "difficulty": 3,
    "stem": "A local administrator adds firewall policy 3 directly on FGT-Branch1. FortiManager auto-updates the device, and the policy package Branch-PP now shows Conflict. Which action keeps policy 3 and aligns the ADOM with the device?",
    "options": [
      "Revert FGT-Branch1 to the revision before the auto-update and install.",
      "Import the policy package from FGT-Branch1 so that policy 3 and its objects are added to the ADOM database.",
      "Retrieve the configuration again, because a retrieve also updates the policy package.",
      "Reinstall the policy package Branch-PP to FGT-Branch1."
    ],
    "answer": [
      1
    ],
    "explanation": "Auto-update brought policy 3 into the **device database**, but policies belong to the **ADOM database** (policy package), which auto-update doesn't touch. That's why the package is in Conflict. **Import** pulls the device's policies and objects into Branch-PP.\n\n- Retrieve updates only the device database. The package would still be out of step.\n- Reinstalling Branch-PP pushes the ADOM version, which **removes** policy 3 from the FortiGate.\n- Reverting and installing also removes the local change.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-060",
    "topic": "2.3",
    "type": "order",
    "difficulty": 2,
    "stem": "Auto-update is disabled. A local administrator changed both a static route and a firewall policy on FGT-Branch2. Place the steps to review and keep those changes in FortiManager in the correct order.",
    "items": [
      "See that FGT-Branch2 shows Out of Sync",
      "Retrieve Config to create a new revision from the running configuration",
      "Run Revision Diff between the new revision and the previous one (Show Diff Only)",
      "Import the policy package so the firewall policy change reaches the ADOM database"
    ],
    "explanation": "With auto-update off, the device goes **Out of Sync** and no revision is created. **Retrieve** turns the running configuration into a revision. Revision Diff works between revisions, so the retrieve comes first, then **Revision Diff** shows exactly what changed. After the retrieve, the device database holds both changes, but the ADOM's policy package still lacks the new policy, so **import** brings it into the policy package.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-061",
    "topic": "2.3",
    "type": "single",
    "difficulty": 3,
    "stem": "In FGT-Branch1's revision history, revision 11 has N/A in the Installation column, and revision 12, created later, shows Installed. What does N/A mean for revision 11?",
    "options": [
      "Revision 11 failed to install and was rolled back.",
      "Revision 11 is a factory default configuration.",
      "Revision 11 is corrupted and can't be viewed or reverted.",
      "Revision 11 was never sent to the device itself, usually because a later revision that included its changes was installed."
    ],
    "answer": [
      3
    ],
    "explanation": "N/A in the **Installation** column means that revision was never installed to the device on its own. Typically a later revision containing its changes (here revision 12) was the one installed.\n\n- A failed install shows as a failed installation status and a device in Conflict.\n- Factory default is downloaded separately (Download Factory Default).\n- N/A doesn't mean the revision can't be used. You can still view, diff or revert to it.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-062",
    "topic": "2.3",
    "type": "fill",
    "difficulty": 3,
    "stem": "Which attribute under config system dm on FortiManager sets the maximum number of configuration revisions kept per device?",
    "answer": [
      "max-revs",
      "set max-revs"
    ],
    "explanation": "`config system dm` / `set max-revs <n>` limits stored configuration revisions (range 1–250, default 100). Other dm settings in this domain: `fgfm_keepalive_itvl`, `fgfm-sock-timeout`, `script-logsize`, `conf-merge-after-script`, `force-remote-diff` and `verify-install`.",
    "lesson": "2.3-device-db-status-revisions"
  },
  {
    "id": "d2-063",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Device Manager shows Config Status Unknown for FGT-Branch2. What should the administrator do first?",
    "exhibit": "FMG-HQ # diagnose dvm device list FGT-Branch2\n...\nfmgfaz-managed  232    FGVM02TM24000112   -       198.51.100.12   FGT-Branch2    Retail   N/A   7.0 MR6 (3401)   N/A\n                |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: installed; conn: down\n                |- vdom:[3]root flags:0 adom:Retail pkg:[installed]Branch-PP",
    "options": [
      "Delete the device and add it again with Discover Device.",
      "Restore the FGFM connection (conn: down), then use Refresh Device to recheck the status.",
      "Revert FGT-Branch2 to its last installed revision and install it.",
      "Import the policy package, because Unknown means the package is out of date."
    ],
    "answer": [
      1
    ],
    "explanation": "**Unknown** means FortiManager can't tell which revision is running, and here the reason is clear: `conn: down`. Fix FGFM connectivity first (routing, TCP 541, the FortiGate's central-management settings), then **Refresh Device** so FortiManager compares the checksums again.\n\n- Revert and install would fail without a connection, and nothing indicates the configuration is wrong.\n- The package status is `installed`, so no import is indicated.\n- Deleting and re-adding the device loses its revision history and doesn't fix the network problem.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-064",
    "topic": "2.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements correctly compare retrieve and import? (Choose two.)",
    "options": [
      "Import creates a new configuration revision in the device's revision history.",
      "Auto-update performs an import automatically whenever a policy changes on the FortiGate.",
      "Retrieve copies the FortiGate's running configuration into the device database and creates a revision when it differs.",
      "Import brings the FortiGate's policies and objects into a policy package in the ADOM database.",
      "Retrieve also updates the policy package, so an import is only needed for new devices."
    ],
    "answer": [
      2,
      3
    ],
    "explanation": "Retrieve works on the **device database** (and revisions). Import works on the **ADOM database** (policies and objects into a policy package).\n\n- After a retrieve, the package status is **Unknown**. It isn't updated.\n- An import doesn't create a device revision.\n- Auto-update updates only the device database. A local policy change can leave the package in Conflict until you import.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  },
  {
    "id": "d2-065",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The DNS change in revision 14 broke name resolution at the branch. What is the quickest way, using FortiManager, to put FGT-Branch1 back on the device settings of revision 13?",
    "exhibit": "Configuration Revision History - FGT-Branch1\nID   Date & Time          Name          Created by    Installation   Comments\n14   2026-10-28 09:42     AutoUpdate    AutoUpdate    N/A            Auto update from device\n13   2026-10-27 22:10                   admin         Installed\n12   2026-10-25 14:03                   jsmith        Installed",
    "options": [
      "Retrieve Config, then delete revision 14.",
      "Delete revision 14. FortiManager then pushes revision 13 automatically.",
      "Import revision 13 into policy package Branch-PP and install the package.",
      "Revert to revision 13, then install device settings to FGT-Branch1."
    ],
    "answer": [
      3
    ],
    "explanation": "**Revert** loads revision 13 into the device database (Modified), and an **install** pushes it to the FortiGate. The primary DNS goes back to the old value, and the device returns to Synchronized.\n\n- A retrieve pulls the current (broken) configuration again. Deleting a revision only removes history and never changes the device.\n- Deleting revision 14 doesn't trigger an install.\n- Revisions are device configurations. They aren't imported into policy packages, and DNS isn't policy package content.",
    "lesson": "2.3-retrieve-autoupdate-revert"
  }
];
