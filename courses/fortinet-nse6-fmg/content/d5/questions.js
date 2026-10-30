// Domain 5 — Troubleshooting question bank (original, exam-style).
const L51 = '5.1-fgfm-nat-deployments';
const L52C = '5.2-connectivity-registration-reload';
const L52I = '5.2-import-install-failures';
const L52D = '5.2-database-integrity-fsck';
const L53 = '5.3-device-vs-adom-database';
const L54K = '5.4-keepalive-recovery-rma';
const L54S = '5.4-system-resources-debug';

export default [
  // ---------------------------------------------------------------- 5.1
  {
    id: 'd5-001',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FMG-HQ (private IP 10.10.10.5) sits behind a data-center firewall that statically NATs 203.0.113.5 to it and forwards TCP 541. The administrator added FGT-Branch1 (public IP 198.51.100.20) with the Add Device wizard, and it was managed normally. After a data-center power event, FGT-Branch1 stays down in Device Manager although it has internet access. Why didn't FGT-Branch1 re-establish the FGFM tunnel?",
    exhibit: String.raw`FGT-Branch1 # show system central-management
config system central-management
    set type fortimanager
end

FMG-HQ # get system admin setting
...
mgmt-addr           :
mgmt-fqdn           :
...`,
    options: [
      "FortiManager behind NAT does not write its address into the FortiGate's fmg setting. With no fmg and no mgmt-addr configured, only FortiManager can bring the tunnel back",
      "The FortiGate needs set type fortiguard to call home after a power event",
      "FGFM tunnels initiated by FortiManager can never be re-established after a reboot. The device must be deleted and added again",
      "The FortiGate is behind NAT, so FortiManager must use reclaim-dev-tunnel on every keepalive interval",
    ],
    answer: [0],
    explanation: "When a FortiManager behind NAT discovers a FortiGate, it deliberately does **not** set `fmg`, because its own address is the private 10.10.10.5. The tunnel works while it stays up, but the FortiGate has nothing to call, so recovery depends on FortiManager reconnecting. The fix is `config system admin setting` → `set mgmt-addr \"203.0.113.5\"` (or `mgmt-fqdn`), so FortiManager pushes `set fmg \"203.0.113.5\"` to its devices. `type fortiguard` means FortiGate Cloud, not FortiManager. Tunnels can be re-established without deleting the device. FGT-Branch1 has a public IP. It is not behind NAT, and reclaim-dev-tunnel is not run on every keepalive.",
    lesson: L51,
  },
  {
    id: 'd5-002',
    topic: '5.1',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. FMG-HQ is behind a static 1:1 NAT. What does FortiManager configure on FortiGates it manages after this change?",
    exhibit: String.raw`FMG-HQ # config system admin setting
FMG-HQ (setting) # set mgmt-addr "203.0.113.5"
FMG-HQ (setting) # end`,
    options: [
      "set fmg \"203.0.113.5\" under config system central-management",
      "set fmg-source-ip 203.0.113.5 under config system central-management",
      "A VIP on the FortiGate that maps 203.0.113.5 to 10.10.10.5 on TCP 541",
      "set mgmt-addr \"203.0.113.5\" under config system global on the FortiGate",
    ],
    answer: [0],
    explanation: "`mgmt-addr` tells FortiManager its public, FGFM-reachable address. FortiManager then sets the FortiGate's `config system central-management` → `set fmg \"203.0.113.5\"`, so the FortiGate can initiate and re-establish FGFM. `fmg-source-ip` is the FortiGate's own source address, not the FortiManager address. FortiManager does not create a VIP on the FortiGate. The port forward belongs on the NAT device in front of FortiManager. `mgmt-addr` is a FortiManager setting with no FortiGate equivalent.",
    lesson: L51,
  },
  {
    id: 'd5-003',
    topic: '5.1',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Branch1 sits behind an ISP router that performs PAT. No port forwards exist on the ISP router. Which two statements are true? (Choose two.)",
    exhibit: String.raw`Topology
  FMG-HQ        port1 198.51.100.10/24 (routable, no NAT)
  ISP router    outside 198.51.100.77, inside 192.168.1.1 (PAT, no port forwards)
  FGT-Branch1   wan1 192.168.1.99/24, default route to 192.168.1.1`,
    options: [
      "FGT-Branch1 must initiate the FGFM session to 198.51.100.10 (set fmg) and will then appear as an unauthorized device on FMG-HQ",
      "If the FGFM tunnel drops, only FGT-Branch1 can re-establish it",
      "The Add Device wizard on FMG-HQ can discover FGT-Branch1 at 192.168.1.99",
      "FMG-HQ must be configured with mgmt-addr 198.51.100.77",
      "FMG-HQ will reject the session because the declared IP 192.168.1.99 does not match the source IP 198.51.100.77",
    ],
    answer: [0, 1],
    explanation: "FortiManager cannot reach a private address behind PAT, so the FortiGate must initiate with `set fmg 198.51.100.10`. The device then appears as unauthorized until an admin authorizes it. FortiManager treats a NATed FortiGate as not reachable for initiating, so only the FortiGate re-establishes a dropped tunnel. Add Device to 192.168.1.99 fails because there is no route. `mgmt-addr` is for a FortiManager *behind* NAT, and it would hold FortiManager's own public address, not the branch's. A declared-vs-source mismatch is how FortiManager **detects** NAT. It does not reject the session.",
    lesson: L51,
  },
  {
    id: 'd5-004',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Both FortiGates are managed normally. What is the most likely explanation for the two devices showing the same IP address?",
    exhibit: String.raw`FMG-HQ # diagnose dvm device list
--- There are currently 2 devices/vdoms managed ---

TYPE            OID    SN               HA      IP              NAME          ADOM     (further columns trimmed)
fmgfaz-managed  193    FGVM02TM24000101 -       198.51.100.77   FGT-Branch1   Retail
               |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: autoupdated; conn: up
               |- vdom:[3]root flags:0 adom:Retail pkg:[imported]Branch-PP
fmgfaz-managed  197    FGVM02TM24000102 -       198.51.100.77   FGT-Branch2   Retail
               |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: autoupdated; conn: up
               |- vdom:[3]root flags:0 adom:Retail pkg:[imported]Branch-PP
--- End device list ---`,
    options: [
      "Both FortiGates sit behind the same PAT device. FortiManager tells them apart by serial number and gives each its own internal tunnel address",
      "The two devices are an FGCP HA cluster, so they share one management IP",
      "FortiManager has an IP conflict and will drop one of the sessions at the next keepalive",
      "One of the FortiGates is configured with fmg-source-ip 198.51.100.77, which is spoofing the other",
    ],
    answer: [0],
    explanation: "The IP column is the source address FortiManager sees. Two branches behind the same ISP PAT address both show 198.51.100.77. FortiManager detects the NAT (declared IP differs from source IP), allocates each FortiGate a unique internal tunnel address, and routes to each by serial number, so both are up and managed normally. An HA cluster appears as one device entry with cluster members (and an HA value), not as two separate standalone devices. Identical source IPs are not a conflict for FGFM. `fmg-source-ip` must be an address on the FortiGate itself, and it would not override NAT.",
    lesson: L51,
  },
  {
    id: 'd5-005',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: "FMG-HQ is on a private data-center network behind one NAT device. FGT-Branch2 is on a private branch network behind another NAT device. What is required for FGFM management to work?",
    options: [
      "A VIP or port forward for TCP 541 on one side, normally to FortiManager, with the FortiGate's fmg pointing at that public address",
      "Nothing extra. FGFM uses NAT traversal like IPsec and works through any two NAT devices",
      "FortiManager must be switched to backup mode so that FortiGates push their configurations by FTP",
      "fgfm-deny-unknown must be enabled on FortiManager so that it accepts devices behind NAT",
    ],
    answer: [0],
    explanation: "With both ends behind NAT, neither private address is reachable, so one side must be published with a VIP / port forward on TCP 541. Publishing FortiManager is the practical choice: one stable address for every branch, `mgmt-addr` set on FortiManager, and `set fmg <public IP>` on the FortiGates. FGFM has no NAT-T style hole punching. Backup mode is an ADOM mode about how configuration is handled, not about NAT. `fgfm-deny-unknown enable` *blocks* unknown devices from registering. It does not help NAT.",
    lesson: L51,
  },
  {
    id: 'd5-006',
    topic: '5.1',
    type: 'fill',
    difficulty: 1,
    stem: "Which TCP port does the FGFM protocol use between FortiGate and FortiManager? (Enter the number.)",
    answer: ['541', 'tcp 541', 'tcp/541'],
    explanation: "FGFM runs as a TLS session on **TCP 541**. Any NAT device, firewall or FortiManager local-in policy on the path must allow it. For FortiManager-initiated connections, the FortiGate interface also needs `fgfm` in `allowaccess` (FMG-Access). FortiManager's own interfaces have no `fgfm` allowaccess option.",
    lesson: L51,
  },
  {
    id: 'd5-007',
    topic: '5.1',
    type: 'fill',
    difficulty: 2,
    stem: "FMG-HQ runs in an HA pair behind NAT, reachable through two public addresses. Under config system admin setting, which option lists several IP addresses or FQDNs that FortiManager pushes to its FortiGates? (Enter the option name.)",
    answer: ['mgmt-fqdn', 'set mgmt-fqdn'],
    explanation: "`mgmt-fqdn` takes several space-separated IPs or FQDNs, and FortiManager pushes them all into the FortiGates' `set fmg`. The FortiGate tries the first one, falls back to the next if it is unreachable, and only ever uses one at a time. With FortiManager HA, the first entry is the primary and the second the secondary. `mgmt-addr` holds a single address.",
    lesson: L51,
  },
  {
    id: 'd5-008',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-Branch1 reaches FMG-HQ (10.10.10.5) only through an IPsec tunnel whose phase 2 selectors are 10.1.1.0/24 to 10.10.10.0/24. The tunnel is up and users at the branch can reach the data center, but FGT-Branch1 never connects to FortiManager. What should the administrator change?",
    exhibit: String.raw`FGT-Branch1 # show system central-management
config system central-management
    set type fortimanager
    set fmg "10.10.10.5"
end

FGT-Branch1 # show system interface internal
config system interface
    edit "internal"
        set ip 10.1.1.1 255.255.255.0
        set allowaccess ping https ssh
    next
end`,
    options: [
      "Add set fmg-source-ip 10.1.1.1 under config system central-management so FGFM is sourced from an address the selectors cover",
      "Add fgfm to allowaccess on the internal interface",
      "Change set fmg to the FortiManager's public address so the traffic bypasses the VPN",
      "Enable fgfm-deny-unknown on FortiManager",
    ],
    answer: [0],
    explanation: "FGFM traffic that the FortiGate originates is not sourced from 10.1.1.1 by default. FortiOS uses an address of the egress interface, or of another interface when the tunnel interface has none, so the packets do not match the 10.1.1.0/24 selector and never make it through the tunnel. Setting `fmg-source-ip 10.1.1.1` (or using interface selection) sources FGFM from the protected subnet. `allowaccess fgfm` on the FortiGate is needed only for *FortiManager-initiated* connections. This FortiGate is initiating. The scenario says FortiManager is reachable only through the VPN, so a public address is not an option. `fgfm-deny-unknown` would only block unknown devices.",
    lesson: L51,
  },
  {
    id: 'd5-009',
    topic: '5.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each deployment to the side that re-establishes the FGFM tunnel after it drops (assuming correct configuration).",
    pairs: [
      ['FortiManager public, FortiGate behind PAT', 'The FortiGate only'],
      ['FortiManager behind NAT, FortiGate public, no mgmt-addr configured', 'FortiManager only'],
      ['FortiManager behind static NAT with mgmt-addr, FortiGate public', 'Either side'],
    ],
    explanation: "A NATed FortiGate cannot be reached, so it alone reconnects. A FortiManager behind NAT without `mgmt-addr` never writes `fmg` on the FortiGate, so only FortiManager can reconnect, using the device's public IP. With `mgmt-addr`, FortiManager pushes its public address into `fmg`, so the FortiGate can also initiate, and either side can bring the tunnel back.",
    lesson: L51,
  },
  {
    id: 'd5-010',
    topic: '5.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FMG-HQ is the primary of an HA pair. FMG-B is the secondary. Both are published through DNAT. How does FGT-Branch1 use these addresses?",
    exhibit: String.raw`FMG-HQ # config system admin setting
FMG-HQ (setting) # set mgmt-fqdn "203.0.113.5" "203.0.113.6"
FMG-HQ (setting) # end

FGT-Branch1 # show system central-management
config system central-management
    set type fortimanager
    set fmg "203.0.113.5" "203.0.113.6"
end`,
    options: [
      "It tries 203.0.113.5 first and moves to 203.0.113.6 only if the first is unreachable, using one address at a time",
      "It keeps FGFM tunnels to both addresses at the same time and load-balances installs",
      "It picks an address at random on each keepalive",
      "It uses 203.0.113.6 for FGFM and 203.0.113.5 for FortiGuard updates",
    ],
    answer: [0],
    explanation: "With several management addresses, the FortiGate attempts the first entry, falls through the list until one connects, and keeps only **one** FGFM tunnel at a time. In FortiManager HA, the first address is the primary and the second the secondary. There is no simultaneous dual tunnel, random selection, or split between FGFM and FortiGuard in this setting.",
    lesson: L51,
  },
  {
    id: 'd5-011',
    topic: '5.1',
    type: 'single',
    difficulty: 3,
    stem: "How does FortiManager determine that a connecting FortiGate is behind a NAT device?",
    options: [
      "It compares the IP address the FortiGate declares in its FGFM messages with the source IP of the connection. A mismatch means NAT",
      "It reads the NAT table of the upstream router through SNMP",
      "It checks whether the FortiGate's serial number is listed in the unauthorized devices table",
      "It sends an ICMP probe to the declared IP and assumes NAT if there is no reply",
    ],
    answer: [0],
    explanation: "Fortinet's FGFM protocol description explains that FortiManager compares the address the FortiGate *declares* with the *actual* remote source address. If they differ, the FortiGate is behind NAT, and FortiManager tracks it by serial number with a unique tunnel IP. FortiManager does not query routers, and the unauthorized list has nothing to do with NAT. ICMP probing is not part of FGFM NAT detection.",
    lesson: L51,
  },
  {
    id: 'd5-012',
    topic: '5.1',
    type: 'order',
    difficulty: 2,
    stem: "FGT-Branch2 is behind a PAT router and FMG-HQ has a routable address. Put the steps to bring FGT-Branch2 under management in the correct order.",
    items: [
      "Configure set fmg <FMG-HQ IP> under config system central-management on FGT-Branch2",
      "FGT-Branch2 opens the FGFM session and appears under unauthorized devices on FMG-HQ",
      "Authorize FGT-Branch2 into ADOM Retail",
      "Import the policy package or assign Branch-PP, then install",
    ],
    explanation: "A FortiGate behind PAT has to initiate, so you start by pointing it at FortiManager (with a route and TCP 541 allowed outbound). The session comes up and the device waits under unauthorized devices until an admin authorizes it into an ADOM. Only then can you import or assign a policy package and install.",
    lesson: L51,
  },

  // ---------------------------------------------------------------- 5.2 connectivity
  {
    id: 'd5-013',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FMG-HQ port1 has the public address 203.0.113.5. FGT-Branch2 (public IP 198.51.100.77) is configured with set fmg 203.0.113.5. FGT-Branch1 (198.51.100.20) is managed normally, but FGT-Branch2 never appears on FMG-HQ. What is the most likely cause?",
    exhibit: String.raw`FMG-HQ # diagnose sniffer packet any "host 198.51.100.77 and port 541" 1
interfaces=[any]
filters=[host 198.51.100.77 and port 541]
2.118204 198.51.100.77.31842 -> 203.0.113.5.541: syn 1406612288
3.130511 198.51.100.77.31842 -> 203.0.113.5.541: syn 1406612288
5.146977 198.51.100.77.31842 -> 203.0.113.5.541: syn 1406612288

FMG-HQ # show system local-in-policy
config system local-in-policy
    edit 1
        set action accept
        set dport 541
        set intf "port1"
        set protocol tcp
        set src 198.51.100.20 255.255.255.255
    next
    edit 2
        set action drop
        set dport 541
        set intf "port1"
        set protocol tcp
    next
end`,
    options: [
      "Local-in policy 2 drops TCP 541 from every source except FGT-Branch1, so FGT-Branch2's SYNs are never answered",
      "FGT-Branch2 has no route to FortiManager",
      "FGT-Branch2's certificate CN does not match its serial number",
      "fgfm-deny-unknown is enabled, which silently drops TCP SYNs from unknown devices",
    ],
    answer: [0],
    explanation: "SYNs from FGT-Branch2 **arrive** at FortiManager and are retransmitted with no SYN-ACK, so the path toward FortiManager works and FortiManager itself is not accepting the connection. The local-in policies accept TCP 541 only from 198.51.100.20 (FGT-Branch1), and entry 2 drops it from everyone else. Add an accept entry for 198.51.100.77 above entry 2. (FortiManager interfaces have no `fgfm` allowaccess option, so local-in policy is the FortiManager-side filter for TCP 541.) The SYNs reach FortiManager, so a missing route on the FortiGate is ruled out. A certificate problem would appear *after* the TCP and TLS handshakes, not as unanswered SYNs. `fgfm-deny-unknown` acts at FGFM registration, after the session is established. It is not a TCP filter.",
    lesson: L52C,
  },
  {
    id: 'd5-014',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-Branch2 should connect to FortiManager through its dedicated management interface mgmt2. Why does the connection fail?",
    exhibit: String.raw`FGT-Branch2 # show system central-management
config system central-management
    set type fortimanager
    set fmg "10.80.15.60"
    set vdom "root"
    set interface-select-method specify
    set interface "mgmt2"
end

FGT-Branch2 # show system interface mgmt2
config system interface
    edit "mgmt2"
        set vdom "MGMT"
        set ip 10.80.15.1 255.255.255.0
        set allowaccess ping https ssh fgfm
    next
end

FGT-Branch2 # diagnose debug application fgfmd -1
FGT-Branch2 # diagnose debug enable
FGFMs: Create session 0x7f3a2c10.
FGFMs: setting session 0x7f3a2c10 exclusive=0
FGFMs: connect error: Network is unreachable`,
    options: [
      "central-management uses VDOM root, but mgmt2 belongs to VDOM MGMT, so the connection attempt has no usable route out of mgmt2",
      "allowaccess on mgmt2 must not include fgfm when the FortiGate initiates",
      "FortiManager rejected the FortiGate's certificate",
      "The fmg address must be an FQDN when interface-select-method is specify",
    ],
    answer: [0],
    explanation: "`Network is unreachable` is a socket-level routing error: the connect never left the FortiGate. Central management is set to VDOM `root`, but the selected interface `mgmt2` is in VDOM `MGMT`, so there is no route in that context. Make the `central-management` VDOM match the interface's VDOM, or pick an interface in root. Having `fgfm` in allowaccess does no harm. A certificate rejection would happen after TCP and TLS, with a different message. `fmg` accepts an IP or an FQDN.",
    lesson: L52C,
  },
  {
    id: 'd5-015',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is correct?",
    exhibit: String.raw`FMG-HQ # diagnose dvm device list
--- There are currently 2 devices/vdoms managed ---

TYPE            OID    SN               HA      IP              NAME          ADOM     (further columns trimmed)
fmgfaz-managed  193    FGVM02TM24000101 -       198.51.100.20   FGT-Branch1   Retail
               |- STATUS: dev-db: modified; conf: in sync; cond: pending; dm: retrieved; conn: up
               |- vdom:[3]root flags:0 adom:Retail pkg:[modified]Branch-PP
fmgfaz-managed  197    FGVM02TM24000102 -       198.51.100.77   FGT-Branch2   Retail
               |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: autoupdated; conn: down
               |- vdom:[3]root flags:0 adom:Retail pkg:[imported]Branch-PP
--- End device list ---`,
    options: [
      "FGT-Branch1 has changes waiting to be installed, and FGT-Branch2's FGFM tunnel is currently down",
      "FGT-Branch1's last install failed, and FGT-Branch2 is out of sync",
      "Both devices have pending policy package changes",
      "FGT-Branch2 cannot be managed because its package was imported instead of installed",
    ],
    answer: [0],
    explanation: "FGT-Branch1 shows `dev-db: modified`, `cond: pending` and `pkg:[modified]`: changes exist in FortiManager that have not been installed, and the tunnel is up. FGT-Branch2 shows `conn: down`, meaning the tunnel is not up right now, while its databases are otherwise in sync (`cond: OK`). Nothing here indicates a failed install (that would be Conflict). FGT-Branch2's package is `imported`, which means the package was imported from the device and not changed since. It is not pending, and the device is still manageable once the tunnel returns.",
    lesson: L52C,
  },
  {
    id: 'd5-016',
    topic: '5.2',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FMG-HQ # show system global
config system global
    ...
    set fgfm-deny-unknown enable
    ...
end`,
    options: [
      "A new FortiGate whose serial number FortiManager does not know cannot register itself as an unauthorized device",
      "FortiGates that are already managed by FMG-HQ keep their FGFM connections",
      "All existing managed devices are disconnected until the setting is disabled",
      "FortiManager can no longer use the Add Device wizard",
      "TCP 541 is closed on all FortiManager interfaces",
    ],
    answer: [0, 1],
    explanation: "`fgfm-deny-unknown enable` stops FortiGates with an **unknown serial number** from actively registering as unauthorized devices. The default is `disable`. Already-managed devices have known serial numbers, so they are not affected and keep their connections. The Add Device wizard is FortiManager-initiated and unaffected. The setting does not close TCP 541. On FortiManager, that is the job of `config system local-in-policy`.",
    lesson: L52C,
  },
  {
    id: 'd5-017',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator added FGT-Branch1 to FMG-HQ, but the initial configuration retrieve failed. What should the administrator do?",
    exhibit: String.raw`FMG-HQ # diagnose test deploymanager reloadconf 193
Retrieving configuration file from FGT...
Configuration file import succeeded.
Reloading configuration file...
Error: Configuration reload error.
---------------------------------
Failure info:
    edit 3
>       set url "files.example.com"   [duplicate]
cdb_parse_file: runtime error 33: duplicate`,
    options: [
      "Remove the duplicate URL filter entry on the FortiGate, then retrieve the configuration again",
      "Check TCP 541 between the devices, because the file could not be fetched",
      "Run diagnose pm2 check-integrity all and restore a FortiManager backup",
      "Upgrade the ADOM, because duplicate entries are only accepted by newer ADOM versions",
    ],
    answer: [0],
    explanation: "\"Configuration file import succeeded\" shows the fetch over FGFM worked. The **reload** (parsing into the device database) failed on a duplicate entry that exists in the FortiGate's own configuration. Fix it on the FortiGate, then retrieve again, repeating until the reload is clean. Connectivity is fine. FortiManager's own databases are not the problem, so pm2 checks and restores are irrelevant. An ADOM upgrade does not make duplicates valid.",
    lesson: L52C,
  },
  {
    id: 'd5-018',
    topic: '5.2',
    type: 'fill',
    difficulty: 3,
    stem: "FGT-Branch1 has OID 193 on FMG-HQ. Which FortiManager diagnose command manually retrieves and reloads its configuration so you can see the exact line that fails to parse? (Enter the full command.)",
    answer: ['diagnose test deploymanager reloadconf 193', 'diag test deploymanager reloadconf 193', 'diagnose test deploymanager reloadconf'],
    explanation: "`diagnose test deploymanager reloadconf <devid>` re-runs the retrieve and reload for that device and prints the failure info, including the failing line and the parser error. Find the OID with `diagnose dvm device list`. The companion `diagnose test deploymanager getcheckin <devid>` shows configuration check-in information.",
    lesson: L52C,
  },
  {
    id: 'd5-019',
    topic: '5.2',
    type: 'order',
    difficulty: 3,
    stem: "FGT-Branch1 is a real (not model) device with a system template, a static route template, an SD-WAN template, the policy package Branch-PP and a CLI template assigned. Put the FortiManager 7.6 installation sequence in order.",
    items: [
      "The system template is applied to the device database",
      "The static route template is applied to the device database",
      "The SD-WAN template is applied to the device database",
      "The policy package Branch-PP is copied into the device database",
      "The CLI template is applied to the device database",
      "FortiManager generates a diff between the device database and FGT-Branch1's configuration",
      "FortiManager installs the diff on FGT-Branch1",
    ],
    explanation: "The 7.6 Administration Guide documents the sequence for real devices. Templates and the package are applied to the **device database** in a fixed order: system template, threat weight, IPsec tunnel, static route, BGP, NSX-T service, SD-WAN, AP profile, FortiSwitch and FortiExtender templates, then the policy package, and the **CLI template last**. Only then does FortiManager generate a diff and install the difference on the FortiGate. A *pre-run* CLI/Jinja template, applied before every other template, exists only for **model** devices. A copy error stops the sequence before the diff, which is why copy failures never touch the FortiGate.",
    lesson: L52I,
  },
  {
    id: 'd5-020',
    topic: '5.2',
    type: 'single',
    difficulty: 1,
    stem: "The Add Device wizard on FMG-HQ fails to reach FGT-Branch2, which sits behind a branch PAT router with no port forwards. FGT-Branch2 has normal outbound internet access. What is the best way to get it under management?",
    options: [
      "Configure set fmg with FMG-HQ's address on FGT-Branch2 and authorize the device when it appears as unauthorized",
      "Enable fgfm-deny-unknown so the wizard ignores NAT",
      "Configure mgmt-addr on FMG-HQ with the branch's public IP",
      "Increase discover-timeout under config system dm to its maximum",
    ],
    answer: [0],
    explanation: "FortiManager cannot initiate to a FortiGate hidden behind PAT. Let the FortiGate initiate outbound with `set fmg`, then authorize it. `fgfm-deny-unknown` blocks unknown devices. `mgmt-addr` holds FortiManager's *own* public address and is not for branches. A longer discover timeout does not create a route to the device.",
    lesson: L52C,
  },

  // ---------------------------------------------------------------- 5.2 import / install
  {
    id: 'd5-021',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An install of Branch-PP to FGT-Branch1 failed. What is the cause?",
    exhibit: String.raw`Starting log (Run on device)

Start installing
FGT-Branch1 $ config firewall policy
FGT-Branch1 (policy) $ edit 14
FGT-Branch1 (14) $ set name "Guest-Web"
FGT-Branch1 (14) $ set srcintf "port3"
FGT-Branch1 (14) $ set dstintf "port1"
FGT-Branch1 (14) $ set srcaddr "Guest-Net"
FGT-Branch1 (14) $ set dstaddr "Printer-MACs"
entry not found in datasource

value parse error before 'Printer-MACs'
Command fail. Return code -3`,
    options: [
      "FortiOS will not accept the object Printer-MACs as a destination address in this policy, even though FortiManager allowed the assignment",
      "The copy to the device database failed because port3 has no normalized interface mapping",
      "FGFM dropped during the install, so the FortiGate rolled back the policy",
      "Policy ID 14 already exists on the FortiGate",
    ],
    answer: [0],
    explanation: "The transcript shows commands being applied on the FortiGate, so the copy stage succeeded. The FortiGate rejected `set dstaddr \"Printer-MACs\"` with *entry not found in datasource* and return code -3: there is no object by that name that FortiOS considers valid for that field (for example, a MAC-address group). Fix the policy in Branch-PP and reinstall. A mapping error would stop the install before anything reached the FortiGate. Nothing indicates a tunnel drop. The failure is on the `dstaddr` line, not on `edit 14`, so the policy ID is not the problem.",
    lesson: L52I,
  },
  {
    id: 'd5-022',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Branch-PP installs to FGT-Branch1 without problems but fails for FGT-Branch2. What should the administrator do?",
    exhibit: String.raw`Install Wizard - FGT-Branch2 [root]
Copy device global objects
error 42 - entry not exist
  dynamic interface "lan" mapping undefined for device FGT-Branch2
Copy failed`,
    options: [
      "Add a per-device mapping (or a default mapping) for the normalized interface lan for FGT-Branch2, then reinstall",
      "Retrieve FGT-Branch2's configuration and re-import, because the FortiGate rejected the lan interface",
      "Check View Install Log on FGT-Branch2 to find which command the FortiGate rejected",
      "Enable rollback-allow-reboot so FGT-Branch2 recovers its previous configuration",
    ],
    answer: [0],
    explanation: "This is a **copy** failure. While building FGT-Branch2's device database, FortiManager could not resolve the normalized interface `lan` because it has no mapping for that device. Nothing was sent to the FortiGate. Add the mapping in Policy & Objects > Object Configurations > Normalized Interface and reinstall. The FortiGate never saw the install, so retrieving, reading a device install log, or recovery settings are not relevant.",
    lesson: L52I,
  },
  {
    id: 'd5-023',
    topic: '5.2',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements are true about this failure? (Choose two.)",
    exhibit: String.raw`Install Wizard - FGT-Branch1 [root]
error :131 - datasrc invalid. object: firewall policy 4.srcintf.
  "port1" cannot be used in system sdwan members interface
Copy failed`,
    options: [
      "No configuration was sent to FGT-Branch1 for this install",
      "The policy should reference the SD-WAN zone instead of the member interface port1",
      "FGT-Branch1 applied the policy and then rolled it back",
      "The fix requires deleting port1 from the SD-WAN configuration on the FortiGate CLI",
      "FGT-Branch1 must be rebooted before the next install attempt",
    ],
    answer: [0, 1],
    explanation: "A copy failure happens inside FortiManager while it builds the device database, so the FortiGate received nothing. The error says policy 4 uses `port1` as srcintf, but `port1` is an SD-WAN member and cannot be referenced directly. Use the SD-WAN zone (or the interface mapped to it) in the policy. There was no rollback, because nothing was applied. You don't need to change the SD-WAN members or reboot. Fix the package on FortiManager.",
    lesson: L52I,
  },
  {
    id: 'd5-024',
    topic: '5.2',
    type: 'single',
    difficulty: 1,
    stem: "An install to FGT-Branch1 failed with an error from the FortiGate. Where does the administrator find the transcript of commands that FortiManager sent and the FortiGate's replies?",
    options: [
      "In the device database, Revision History > View Install Log for that installation",
      "Policy & Objects > Object Configurations > Normalized Interface",
      "System Settings > Advanced > Device Log Settings",
      "In the output of diagnose dvm check-integrity",
    ],
    answer: [0],
    explanation: "The installation log for each revision is under the device's **Revision History** (Dashboard > Configuration and Installation widget), via **View Install Log**. The Task Monitor also records the per-device task result. Normalized Interface is where mappings are edited, the device log settings page is unrelated, and the DVM integrity check verifies the database, not install transcripts.",
    lesson: L52I,
  },
  {
    id: 'd5-025',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "While importing FGT-Branch2's policies into ADOM Retail, the wizard reports a conflict on address object Srv-Farm, which FGT-Branch1 also uses. The administrator chooses the FortiGate value. What is the impact?",
    options: [
      "The ADOM object Srv-Farm is updated to FGT-Branch2's value, and FGT-Branch1 becomes modified with a pending install",
      "Only FGT-Branch2 uses the new value. FGT-Branch1 keeps the old value automatically through a hidden per-device copy",
      "FGT-Branch2's local object is overwritten immediately with the FortiManager value",
      "The import aborts, because conflicts must be resolved on the FortiGate first",
    ],
    answer: [0],
    explanation: "Choosing the **FortiGate** value updates the shared ADOM object, exactly as if you had edited it by hand. Every device that references it, FGT-Branch1 included, now has a pending change. Choosing **FortiManager** would keep the ADOM value, keep FGT-Branch1 synchronized, and push FortiManager's value to FGT-Branch2 on its next install. Import never changes the FortiGate, and conflicts are resolved in the wizard.",
    lesson: L52I,
  },
  {
    id: 'd5-026',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Branch2 was upgraded to FortiOS 7.6 last night. The next install of Branch-PP failed. What should the administrator do?",
    exhibit: String.raw`Install Wizard - FGT-Branch2 [root]
Copy device global objects
version mismatched,adom:7.4; dev:7.6
Copy failed`,
    options: [
      "Upgrade ADOM Retail to 7.6 (or move the device to a 7.6 ADOM), because the device's major version no longer matches the ADOM",
      "Downgrade FortiManager to 7.4",
      "Run diagnose system fsck harddisk and retry",
      "Re-run the install with Install Device Settings (only), which skips version checks",
    ],
    answer: [0],
    explanation: "The copy stage reports that the device's FortiOS version (7.6) no longer matches the ADOM version (7.4), and the install stops before anything reaches the FortiGate. Upgrade the ADOM to 7.6 or move the device to a 7.6 ADOM. Alternatively, keep the FortiGate on the ADOM's version. Downgrading FortiManager makes things worse, since a newer FortiManager supports older ADOMs and not the reverse. File system checks are unrelated. Installing device settings only does not get around the ADOM version mismatch.",
    lesson: L52I,
  },
  {
    id: 'd5-027',
    topic: '5.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each message to the stage where the problem occurs.",
    pairs: [
      ['dynamic interface "lan" mapping undefined for device FGT-Branch2', 'Copy from ADOM DB to device DB'],
      ['entry not found in datasource ... Command fail. Return code -3', 'Install of the CLI diff on the FortiGate'],
      ['cdb_parse_file: runtime error 33: duplicate', 'Reload of a retrieved FortiGate configuration'],
      ['FGFMs: connect error: Network is unreachable', 'FGFM connectivity from the FortiGate'],
    ],
    explanation: "Mapping errors come from the copy stage inside FortiManager. Return codes after a `$` command line come from the FortiGate during install. `cdb_parse_file` errors come from FortiManager parsing a retrieved configuration (a failed reload). `connect error` in the `fgfmd` debug is a socket and routing failure before any FGFM session exists.",
    lesson: L52I,
  },
  {
    id: 'd5-028',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. This is part of the first install after the administrator imported FGT-Branch1's policies into Branch-PP with the wizard option Import only policy dependent objects. The administrator did not change anything else. Why is FortiManager deleting these objects?",
    exhibit: String.raw`FGT-Branch1 $ config firewall address
FGT-Branch1 (address) $ delete "Old-Server"
FGT-Branch1 (address) $ delete "Test-Host-2019"
FGT-Branch1 (address) $ end`,
    options: [
      "No imported policy referenced the objects, so they were not imported into the ADOM, and the install removes them from the FortiGate",
      "The import failed and FortiManager is rolling the FortiGate back to factory defaults",
      "The objects conflicted with ADOM objects and the FortiManager value was chosen",
      "FortiManager deletes all address objects before re-adding them on every install",
    ],
    answer: [0],
    explanation: "With *Import only policy dependent objects*, the wizard brings in the policies and only the objects those policies use. Objects that nothing references are not in the ADOM database, so they stay on the FortiGate only until the first install, which removes them. *Import all objects* would have kept them. Install Preview would have shown these deletions in advance. A rollback to defaults is not what this is. Choosing the FortiManager value would *change* a conflicting object, not delete it. FortiManager installs a diff, not a delete-and-re-add of everything.",
    lesson: L52I,
  },
  {
    id: 'd5-029',
    topic: '5.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. After a failed install, an engineer fixed FGT-Branch1 directly on the FortiGate, and the team agrees the FortiGate's current policies are correct. How should the administrator resolve the status?",
    exhibit: String.raw`Device Manager > Managed FortiGate
Device Name   Config Status   Policy Package Status   Connection
FGT-Branch1   Conflict        Branch-PP (Modified)    Up`,
    options: [
      "Retrieve the configuration from FGT-Branch1, then re-import its policies into the policy package",
      "Run Install Device Settings (only) from FortiManager",
      "Reinstall Branch-PP immediately to clear the Conflict",
      "Delete the device and add it again with the Add Device wizard, discarding its revision history",
    ],
    answer: [0],
    explanation: "When the FortiGate is the source of truth, bring its configuration into the device DB with **Retrieve Config**, then **re-import** so the policy package matches. Install Device Settings or reinstalling the package would push FortiManager's version and overwrite the fix. That is the right path only when FortiManager is the truth. Deleting and re-adding throws away history for no benefit.",
    lesson: L52I,
  },

  // ---------------------------------------------------------------- 5.2 integrity
  {
    id: 'd5-030',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FMG-HQ lost power yesterday. What is Fortinet's documented response to this result?",
    exhibit: String.raw`FMG-HQ # diagnose pm2 check-integrity all
...
Error: database disk image is malformed
pragma integrity_check fails: /var/pm2/adom153
>>> total: 10 failed: 1`,
    options: [
      "Restore FortiManager from the last known-good backup, because this command only detects errors and cannot repair them",
      "Answer y at the repair prompt that follows the output",
      "Run diagnose cdb check policy-packages to rebuild the ADOM database file",
      "Ignore it. pm2 errors are cosmetic and clear on the next reboot",
    ],
    answer: [0],
    explanation: "`diagnose pm2 check-integrity` **detects** corruption in the policy manager databases but cannot correct it. Fortinet's guidance is to restore from the last good backup, before any upgrade too. There is no y/n repair prompt for pm2. That behavior belongs to `dvm check-integrity` and `cdb check policy-packages`. The policy-package check fixes logical issues such as dynamic mappings, not a malformed database file. A malformed database is not cosmetic.",
    lesson: L52D,
  },
  {
    id: 'd5-031',
    topic: '5.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two FortiManager commands can repair the problems they find after the administrator confirms a y/n prompt? (Choose two.)",
    options: [
      "diagnose dvm check-integrity",
      "diagnose cdb check policy-packages",
      "diagnose pm2 check-integrity all",
      "diagnose system print df",
      "diagnose fgfm session-list",
    ],
    answer: [0, 1],
    explanation: "Both `diagnose dvm check-integrity` (eight Device Manager checks) and `diagnose cdb check policy-packages` (scope, dynamic mappings, package settings, undeleted objects) list the changes they will make, recommend a backup, and ask *Do you want to continue? (y/n)*. `pm2 check-integrity` only detects. `print df` shows disk usage and `fgfm session-list` lists FGFM sessions. Neither checks database integrity.",
    lesson: L52D,
  },
  {
    id: 'd5-032',
    topic: '5.2',
    type: 'fill',
    difficulty: 2,
    stem: "After an unexpected power failure, which FortiManager 7.6 command checks and repairs the file system and then reboots the unit? (Enter the full command.)",
    answer: ['diagnose system fsck harddisk', 'diag system fsck harddisk', 'diag sys fsck harddisk'],
    explanation: "`diagnose system fsck harddisk` checks and repairs the file system and then **reboots** FortiManager, so schedule it. `diagnose system fsck reset-mount-count` resets the disk's mount count on the next reboot. Follow the fsck with the database integrity checks, and restore a backup if they fail.",
    lesson: L52D,
  },
  {
    id: 'd5-033',
    topic: '5.2',
    type: 'single',
    difficulty: 1,
    stem: "A technician needs to move a hardware FortiManager to another rack. What should be done before removing power, to protect the FortiManager databases?",
    options: [
      "Run execute shutdown and wait for the unit to halt",
      "Run diagnose dvm check-integrity and answer y",
      "Run diagnose debug disable",
      "Nothing. FortiManager journals every write, so removing power is safe",
    ],
    answer: [0],
    explanation: "Fortinet's database-integrity best practice is never to power off FortiManager without a graceful shutdown. Use `execute shutdown` (or Dashboard > Unit Operation > Shutdown), plus a UPS for protection against unplanned outages. An integrity check does not make a hard power-off safe, and disabling debug is irrelevant. Power loss during writes is the main cause of database corruption, so removing power without a shutdown is not safe.",
    lesson: L52D,
  },
  {
    id: 'd5-034',
    topic: '5.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What should the administrator do before answering the prompt?",
    exhibit: String.raw`FMG-HQ # diagnose dvm check-integrity
[1/8] Checking object memberships       ... correct
[2/8] Checking device nodes             ... 0 change(s) will be made (263 error(s))
[3/8] Checking device vdoms             ... correct
[4/8] Checking duplicate device vdoms   ... correct
[5/8] Checking device ADOM memberships  ... correct
[6/8] Checking groups                   ... correct
[7/8] Checking group membership         ... correct
[8/8] Checking task database            ... correct
The above changes will be made to the database, however it is recommended to perform a backup first.
Do you want to continue? (y/n)`,
    options: [
      "Answer n, back up the FortiManager configuration, make sure no other admins are logged in and nothing is locked, then rerun the check and answer y",
      "Run diagnose system fsck harddisk first, because device node errors are file system errors",
      "Factory reset FortiManager, because 263 errors cannot be repaired",
      "Answer y immediately. A backup taken now would contain the same errors and is useless",
    ],
    answer: [0],
    explanation: "The DVM check proposes changes and explicitly recommends a backup first. Fortinet also advises running integrity commands with a single admin and no locks (unlock ADOMs in workspace mode). Back up, then rerun and confirm. Device-node errors are logical database errors, not file system errors. A factory reset is unnecessary when the tool offers a repair. A backup is your rollback if the repair goes wrong, so it is far from useless.",
    lesson: L52D,
  },

  // ---------------------------------------------------------------- 5.3
  {
    id: 'd5-035',
    topic: '5.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. ADOM Retail is ID 171, FGT-Branch1 is OID 193, VDOM root is ID 3, and category 145 is user radius. What explains the difference, and what is the correct fix if the new server must stay?",
    exhibit: String.raw`FMG-HQ # execute fmpolicy print-device-object 171 193 3 145 all
config user radius
    edit "NPS-Backup"
        set server "10.20.0.12"
        set secret ********
    next
    edit "NPS-Primary"
        set server "10.20.0.11"
        set secret ********
    next
end

FMG-HQ # execute fmpolicy print-adom-object 171 145 all
config user radius
    edit "NPS-Primary"
        set server "10.20.0.11"
        set secret ********
        set _scope "FGT-Branch1"-"root"
    next
end`,
    options: [
      "NPS-Backup was created on the FortiGate and auto-updated into the device database only. Re-import the policy package so the ADOM database contains it, then install",
      "NPS-Backup was created in the ADOM but never installed. Install the policy package to push it",
      "The device database is corrupted. Run diagnose dvm check-integrity",
      "The _scope line shows NPS-Primary is unused, so FortiManager will delete it on the next install",
    ],
    answer: [0],
    explanation: "The device database (`print-device-object`) has both servers. The ADOM database (`print-adom-object`) has only NPS-Primary, whose `_scope` shows it is used by FGT-Branch1/root. That pattern means a local FortiGate change reached the device DB (auto-update or retrieve) but not the ADOM. Re-import to bring it into the ADOM, then install. If it had been created in the ADOM, it would appear in the ADOM output. Nothing points to corruption. `_scope` lists where an object *is* used, so it marks NPS-Primary as in use.",
    lesson: L53,
  },
  {
    id: 'd5-036',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: "An administrator uses Revert in FGT-Branch1's revision history to load a revision from last week. Which statement is true?",
    options: [
      "The revision is loaded into the device database only. The administrator should import from the device to resynchronize the policy package and then reinstall",
      "The revision is pushed to FGT-Branch1 immediately and the policy package is updated to match",
      "The revert updates the ADOM database and leaves the device database unchanged",
      "Revert deletes all newer revisions from the revision history",
    ],
    answer: [0],
    explanation: "Revert loads a saved revision into the **device database**. It does not touch the FortiGate or the policy package. Fortinet's documented follow-up is to import the configuration to align the package in the ADOM database, then re-install the package. Nothing is pushed until you install, the ADOM database is not changed, and newer revisions remain.",
    lesson: L53,
  },
  {
    id: 'd5-037',
    topic: '5.3',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about the Retrieve Config operation are true? (Choose two.)",
    options: [
      "It saves FGT-Branch1's running configuration into the device database as a new revision",
      "It does not update the policy package",
      "It pushes the device database to the FortiGate",
      "It imports policies and objects into the ADOM's shared object database",
      "It removes unused objects from the FortiGate",
    ],
    answer: [0, 1],
    explanation: "Retrieve pulls the running configuration into the device DB and creates a new revision if it differs. The policy package is **not** updated, so policy-level changes still need an Import. Pushing to the FortiGate is an install. Moving policies and objects into the ADOM is Import. Removing unused objects happens on install.",
    lesson: L53,
  },
  {
    id: 'd5-038',
    topic: '5.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each operation to how it moves data.",
    pairs: [
      ['Install policy package & device settings', 'ADOM DB to device DB, then the diff to the FortiGate'],
      ['Retrieve Config', 'FortiGate to device DB'],
      ['Import policy', 'Device DB to ADOM DB'],
      ['Revert', 'Stored revision to device DB'],
      ['Install device settings (only)', 'Device DB to FortiGate'],
    ],
    explanation: "A package install copies ADOM content into the device DB and sends the difference. Retrieve and auto-update fill the device DB from the FortiGate. Import builds the package and objects from the device DB. Revert loads an older revision into the device DB. Install device settings (only) pushes the device DB without touching the package.",
    lesson: L53,
  },
  {
    id: 'd5-039',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: "Auto-update is enabled (default). An engineer changes the IP address of port5 directly on FGT-Branch1. What happens on FMG-HQ?",
    options: [
      "The change is stored in FGT-Branch1's device database (config status Auto-update), and the policy package status is unaffected",
      "The policy package goes to Conflict and must be re-imported",
      "The change is ignored until an administrator runs Retrieve Config",
      "FortiManager immediately reinstalls the old IP address",
    ],
    answer: [0],
    explanation: "With auto-update, FortiGate-side changes are sent to FortiManager automatically and stored in the device database. An interface address is a **device-level** setting, so the policy package status does not change. Policy-level changes, such as policies or objects, are the ones that change the package status (Out of Sync in the policy package status table, Conflict in the auto-update topic). A manual retrieve is not needed with auto-update, and FortiManager never reinstalls on its own.",
    lesson: L53,
  },
  {
    id: 'd5-040',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: "During an outage, an engineer adds firewall policy 50 directly on FGT-Branch1. Nobody imports. Next week a colleague edits an unrelated rule in Branch-PP and installs the package to FGT-Branch1. What happens to policy 50?",
    options: [
      "It is removed, because the install makes the FortiGate match the package. Install Preview would have shown the deletion",
      "It is kept, because FortiManager only installs the rule that changed",
      "It is moved into Branch-PP automatically",
      "The install fails with a copy error until policy 50 is deleted manually",
    ],
    answer: [0],
    explanation: "The package is FortiManager's definition of the policy table. Policy 50 is not in it, so the diff removes it. Installs send a diff of the whole device database against the FortiGate, not only the edited rule. FortiManager does not adopt local policies into the package. That is what Import does. The copy stage is unaffected by extra rules on the FortiGate.",
    lesson: L53,
  },
  {
    id: 'd5-041',
    topic: '5.3',
    type: 'fill',
    difficulty: 3,
    stem: "In the output of execute fmpolicy print-adom-object, which attribute line shows the device and VDOM that use an ADOM object? (Enter the attribute name.)",
    answer: ['_scope', 'set _scope'],
    explanation: "ADOM-database output includes `set _scope \"<device>\"-\"<vdom>\"` for objects used by devices. Device-database output (`print-device-object`) has no `_scope`, because the data already belongs to one device.",
    lesson: L53,
  },
  {
    id: 'd5-042',
    topic: '5.3',
    type: 'single',
    difficulty: 2,
    stem: "An administrator disables auto-update with config system admin setting → set auto-update disable. An engineer then changes a setting locally on FGT-Branch2. What config status does Device Manager show for FGT-Branch2?",
    options: [
      "Out of Sync, until the administrator accepts the change or retrieves the configuration",
      "Auto-update",
      "Synchronized, because nothing changed in FortiManager",
      "Never installed",
    ],
    answer: [0],
    explanation: "With auto-update disabled, FortiManager does not store FortiGate-side changes automatically. Instead the administrator can accept or refuse them. Until then, the FortiGate configuration differs from the latest revision, which FortiManager detects from the configuration checksum the FortiGate reports, and the status is **Out of Sync**. *Auto-update* is the status when the change was synced automatically. *Synchronized* would be wrong because the device changed. *Never installed* is a policy package status.",
    lesson: L53,
  },
  {
    id: 'd5-043',
    topic: '5.3',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. What does the package status for FGT-Branch2 mean?",
    exhibit: String.raw`fmgfaz-managed  197    FGVM02TM24000102 -       198.51.100.77   FGT-Branch2   Retail
               |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: autoupdated; conn: up
               |- vdom:[3]root flags:0 adom:Retail pkg:[imported]Branch-PP`,
    options: [
      "Branch-PP was built by importing FGT-Branch2's policies and objects, and has not been modified or installed since",
      "Branch-PP has never been assigned to FGT-Branch2",
      "The last install of Branch-PP failed and was rolled back",
      "Branch-PP was imported from another ADOM",
    ],
    answer: [0],
    explanation: "*Imported* means policies and objects were imported from the device DB into the ADOM database, and the associated package has not been modified or installed since. *Never Installed* means a package was assigned (not imported for this device) and has not been installed since. A failed install shows the **config status** Conflict. Packages are not imported across ADOMs by the Import wizard.",
    lesson: L53,
  },

  // ---------------------------------------------------------------- 5.4 keepalive / recovery / RMA
  {
    id: 'd5-044',
    topic: '5.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Branch1 stops sending all traffic because its upstream link fails. With these FortiManager settings, roughly how long before FMG-HQ treats the device as offline?",
    exhibit: String.raw`FMG-HQ # get system dm
...
fgfm-sock-timeout   : 360
fgfm_keepalive_itvl : 120
...
rollback-allow-reboot: disable
...`,
    options: [
      "About 360 seconds: three missed 120-second keepalives",
      "About 120 seconds: one missed keepalive",
      "About 30 seconds, the minimum keepalive value",
      "Never. The device is shown as up until an administrator refreshes it",
    ],
    answer: [0],
    explanation: "With the defaults, keepalives arrive every 120 seconds, and FortiManager considers the FortiGate offline after three consecutive misses, 360 seconds. That matches the default `fgfm-sock-timeout` of 360. A single missed keepalive does not mark the device down. 30 is only the bottom of the configurable range. Status updates automatically when keepalives stop.",
    lesson: L54K,
  },
  {
    id: 'd5-045',
    topic: '5.4',
    type: 'fill',
    difficulty: 2,
    stem: "Under config system dm on FortiManager, which option sets the FGFM keepalive interval in seconds (range 30–600, default 120)? (Enter the option name exactly.)",
    answer: ['fgfm_keepalive_itvl', 'set fgfm_keepalive_itvl'],
    explanation: "`fgfm_keepalive_itvl` uses **underscores**. Its sibling `fgfm-sock-timeout` (90–1800, default 360) uses hyphens. Both are FortiManager settings that FortiManager hands to the FortiGate during tunnel setup.",
    lesson: L54K,
  },
  {
    id: 'd5-046',
    topic: '5.4',
    type: 'multi',
    difficulty: 2,
    stem: "Which two are purposes or contents of FGFM keepalive messages? (Choose two.)",
    options: [
      "Letting FortiManager detect that a managed FortiGate is no longer reachable",
      "Reporting the FortiGate's configuration checksum, so FortiManager can detect configuration changes made on the device",
      "Carrying the full policy package to the FortiGate at each interval",
      "Authenticating FortiManager administrators who open the device CLI",
      "Pushing firmware images to FortiGates that are out of date",
    ],
    answer: [0, 1],
    explanation: "Keepalives provide liveness (missed keepalives mean the device is offline) and carry status: firmware version, platform, **configuration checksum**, and AV and IPS database versions. The checksum is how FortiManager notices changes made outside an install. Policy packages travel only during installs. Admin authentication is unrelated. Firmware upgrades are separate operations, and FortiGuard-style updates are pulled by the FortiGate, not pushed by keepalives.",
    lesson: L54K,
  },
  {
    id: 'd5-047',
    topic: '5.4',
    type: 'order',
    difficulty: 3,
    stem: "An install changes the route that FGT-Branch1 uses to reach FortiManager, and rollback-allow-reboot is enabled. Put the FGFM recovery steps in order.",
    items: [
      "FortiManager sends the set commands for the change together with the unset commands that would undo it",
      "FGT-Branch1 applies the set commands in memory",
      "FGT-Branch1 tests the FGFM connection to FortiManager",
      "The connection is down, so FGT-Branch1 applies the unset commands and tests again",
      "The connection is still down, so FGT-Branch1 reboots to load its previous saved configuration and reconnects",
    ],
    explanation: "FGFM recovery logic: the change arrives with its undo commands, is applied in memory, and the connection is tested. A failure triggers the unset commands and a retest. Only if it is *still* down, and only when `rollback-allow-reboot` is enabled on FortiManager, does the FortiGate reboot to recover the previous configuration from its config file.",
    lesson: L54K,
  },
  {
    id: 'd5-048',
    topic: '5.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. An install pushed a wrong default route to FGT-Branch2. The FortiGate applied the unset commands, but FGFM still did not come back. What happens next?",
    exhibit: String.raw`FMG-HQ # get system dm
...
fgfm_keepalive_itvl : 120
retry               : enable
rollback-allow-reboot: disable
...`,
    options: [
      "Nothing further. FGT-Branch2 does not reboot, so an administrator must restore connectivity locally or through another path",
      "FGT-Branch2 reboots to its previous configuration file",
      "FortiManager reinstalls the previous revision over the existing tunnel",
      "FortiManager reboots FGT-Branch2 through FortiGuard",
    ],
    answer: [0],
    explanation: "Reboot-based recovery happens only when `rollback-allow-reboot` is **enabled**. It is disabled here, which is the default. Recovery stops after the unset step, and someone has to fix the FortiGate by console or out-of-band access. FortiManager cannot install anything without a working tunnel, and it has no FortiGuard-based way to reboot devices. `retry` concerns retrying installations, not tunnel recovery.",
    lesson: L54K,
  },
  {
    id: 'd5-049',
    topic: '5.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Branch1 failed and was replaced under RMA with the same model, serial FGVM02TM24000199. The administrator wants to keep its revision history, device database and package assignment. Which FortiManager CLI command should the administrator use?",
    exhibit: String.raw`FMG-HQ # diagnose dvm device list
...
fmgfaz-managed  193    FGVM02TM24000101 -       198.51.100.20   FGT-Branch1   Retail
               |- STATUS: dev-db: not modified; conf: in sync; cond: OK; dm: autoupdated; conn: down
...`,
    options: [
      "execute device replace sn FGT-Branch1 FGVM02TM24000199",
      "execute fgfm reclaim-dev-tunnel FGVM02TM24000199",
      "diagnose dvm device delete Retail FGT-Branch1, then add the new unit as a new device",
      "execute central-mgmt register-device FGVM02TM24000199",
    ],
    answer: [0],
    explanation: "FortiManager checks the serial number on every connection, so the existing entry must be given the new serial. `execute device replace sn <device name> <serial number>` does exactly that and keeps the device's history and settings. The GUI equivalent is More > Swap Device. `reclaim-dev-tunnel` takes a device name and only re-opens a tunnel. Deleting and re-adding loses the history. `execute central-mgmt register-device` is a FortiGate command, and it takes FortiManager's serial number.",
    lesson: L54K,
  },
  {
    id: 'd5-050',
    topic: '5.4',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about replacing a managed standalone FortiGate on FortiManager 7.6 are true? (Choose two.)",
    options: [
      "The replacement must be the same model as the original device",
      "The serial number entered in execute device replace sn is case-sensitive",
      "A replacement of a different model can be swapped in with Swap Device as long as it runs the same FortiOS version",
      "Swap Device erases the device's revision history so the new unit starts clean",
      "The new FortiGate must be factory reset after it connects, before FortiManager can install to it",
    ],
    answer: [0, 1],
    explanation: "Fortinet allows replacing a device only with another serial number of the **same model**. A different model is added as a new device. The serial number is case-sensitive, and Fortinet serials use capitals. The point of swapping is to *keep* the history, device database and assignments, and no factory reset is required after connecting. In fact, if you restore the old config to the new unit, clear `fmg` and `serial-number` first so it does not call in as unauthorized early.",
    lesson: L54K,
  },
  {
    id: 'd5-051',
    topic: '5.4',
    type: 'single',
    difficulty: 2,
    stem: "The secondary unit of a managed FGCP cluster is replaced under RMA and rejoins the cluster. What is normally required on FortiManager?",
    options: [
      "Nothing special. The cluster reports its new member. If it appears as an unauthorized device, delete that entry so it is discovered as a cluster member",
      "execute device replace sn for the cluster, using the new member's serial",
      "Delete the cluster from Device Manager and add it again",
      "Import the policy package again from the new member",
    ],
    answer: [0],
    explanation: "Fortinet's guidance is that a cluster member replacement does not need `execute device replace sn`. The cluster informs FortiManager about the new member. A stray unauthorized entry for the new serial should be deleted so FortiManager learns it as part of the cluster. The old, downed member can then be removed from the HA widget. Deleting the cluster or re-importing is unnecessary.",
    lesson: L54K,
  },
  {
    id: 'd5-052',
    topic: '5.4',
    type: 'single',
    difficulty: 2,
    stem: "After an install broke management, FGT-Branch1 rebooted by itself, came back with its previous configuration, and reconnected to FMG-HQ. Which FortiManager setting allowed this?",
    options: [
      "rollback-allow-reboot enable under config system dm",
      "fgfm-deny-unknown enable under config system global",
      "auto-update enable under config system admin setting",
      "verify-install enable under config system dm",
    ],
    answer: [0],
    explanation: "The reboot step of FGFM recovery logic only runs when `rollback-allow-reboot` is enabled (default disabled). `fgfm-deny-unknown` controls registration of unknown devices. `auto-update` controls whether FortiGate-side changes are stored automatically. `verify-install` checks the result of an install against the device, and it does not reboot anything.",
    lesson: L54K,
  },

  // ---------------------------------------------------------------- 5.4 system resources / debug
  {
    id: 'd5-053',
    topic: '5.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The FortiManager GUI is slow and installs are taking much longer than usual. What does the output indicate?",
    exhibit: String.raw`FMG-HQ # get system performance
CPU:
    Used: 61.02%
    Used(Excluded NICE): 61.02%
          %used %user %nice %sys %idle %iowait %irq %softirq
    CPU0  60.88 12.40  0.00 3.51 39.12  44.97  0.00   0.00
    CPU1  61.15 11.93  0.00 3.40 38.85  45.82  0.00   0.00
Memory:
    Total: 16,363,092 KB
    Used: 6,102,880 KB 37.3%
Hard Disk:
    Total: 103,081,248 KB
    Used: 61,230,016 KB 59.4%
    IOStat: tps r_tps w_tps r_kB/s w_kB/s queue wait_ms svc_ms %util sampling_sec
             412.6 31.0 381.6 1240.2 30210.7 18.4   96.3   2.4  99.1       300.02`,
    options: [
      "The disk is the bottleneck: CPU time is mostly iowait and the disk is close to 100% utilized with a deep queue",
      "A user-space process is saturating the CPU and should be killed",
      "Memory is exhausted and FortiManager is swapping",
      "The disk is almost full and must be expanded",
    ],
    answer: [0],
    explanation: "Most of the \"used\" CPU is `%iowait` (about 45%), while `%user` is only about 12%. The disk shows about 99% `%util`, a queue of 18 and roughly 96 ms waits. The CPU is waiting on storage. Next, find the writer (`execute iotop`, Task Monitor) and check the VM's storage. User CPU is low, so killing processes is premature. Memory is only 37% used. Disk *capacity* is 59%, so this is a throughput problem, not a full disk.",
    lesson: L54S,
  },
  {
    id: 'd5-054',
    topic: '5.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is correct?",
    exhibit: String.raw`FMG-HQ # diagnose system print df
Filesystem           1K-blocks      Used Available Use% Mounted on
none                   1340996         0   1340996   0% /dev/shm
none                     65536       188     65348   0% /tmp
/dev/vda1               516040     97188    418852  19% /data
/dev/mdvg/mdlv        41280832  39333696   1947136  95% /var
/dev/mdvg/mdlv        41280832  39333696   1947136  95% /drive0
/dev/mdvg/mdlv        41280832  39333696   1947136  95% /Storage
/dev/loop0                9911      1121      8278  12% /var/dm/tcl-root`,
    options: [
      "/var, /drive0 and /Storage are one logical volume that is 95% full, so freeing space anywhere on it relieves all three",
      "Three separate disks are each 95% full, so each needs its own cleanup",
      "/data is the main database partition and has plenty of space, so there is no problem",
      "/tmp is nearly full and is the cause of failed installs",
    ],
    answer: [0],
    explanation: "All three mount points show the same device, `/dev/mdvg/mdlv`, with identical numbers. That is one logical volume, about 1.9 GB free out of about 41 GB. That volume holds the databases, revisions and FortiGuard and firmware files, so it is the one to clean up or expand. `/data` is a small separate partition. `/tmp` is memory-backed and almost empty.",
    lesson: L54S,
  },
  {
    id: 'd5-055',
    topic: '5.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the most appropriate next step?",
    exhibit: String.raw`FMG-HQ # execute top -b -n 1
top - 10:23:11 up 41 days,  2:07,  0 users,  load average: 3.91, 3.62, 3.10
Tasks: 214 total,   3 running, 211 sleeping,   0 stopped,   0 zombie
%Cpu(s): 88.9 us,  4.3 sy,  0.0 ni,  6.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  15979.6 total,    412.7 free,   9630.3 used,   5936.6 buff/cache

  PID USER      PR  NI    VIRT    RES  %CPU  %MEM     TIME+ S COMMAND
 4127 root      20   0 2310.6m   1.9g 172.4  12.2 410:16.03 R securityconsole
 3388 root      20   0  412.0m 210.4m   8.1   1.3  51:02.77 S fgfmsd
 3412 root      20   0  301.9m 120.6m   2.0   0.8  12:44.10 S httpd`,
    options: [
      "Check the Task Monitor for large or many simultaneous policy package installs, previews or checks before considering a process restart",
      "Run diagnose system fsck harddisk, because high CPU is a sign of file system damage",
      "Kill fgfmsd, because the FGFM daemon always causes high CPU",
      "Expand the disk, because iowait is the problem",
    ],
    answer: [0],
    explanation: "`securityconsole` handles policy package work (copy, preview, install, consistency checks) and is using about 1.7 cores (`%CPU` above 100% means more than one core). Find out what it is doing, for example a large install to many devices, before you restart it in a maintenance window. Nothing points to file system damage. `fgfmsd` is only at 8%. `wa` is 0.0, so this is not a disk-wait problem.",
    lesson: L54S,
  },
  {
    id: 'd5-056',
    topic: '5.4',
    type: 'fill',
    difficulty: 2,
    stem: "Which FortiManager 7.6 CLI command shows a live, top-style view of running processes sorted by CPU? (Enter the command without options.)",
    answer: ['execute top', 'exe top', 'exec top'],
    explanation: "FortiManager exposes the Linux `top` tool as `execute top`. Options are passed through, for example `execute top -b -n 1` for a single snapshot. `diagnose sys top` is the FortiGate command. On FortiManager, `diagnose system process list` gives a static process list.",
    lesson: L54S,
  },
  {
    id: 'd5-057',
    topic: '5.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Installs and scripts on FMG-HQ have stopped working, yet get system performance shows the hard disk only 54% used. What is the problem?",
    exhibit: String.raw`FMG-HQ # diagnose system print df -i
Filesystem           Inodes      Used Available Use% Mounted on
none                6170158         6   6170152   0% /dev/shm
none                6170158        56   6170102   0% /tmp
/dev/sda1             65536        38     65498   0% /data
/dev/mdvg/mdlv      2048000   2048000         0 100% /var
/dev/mdvg/mdlv      2048000   2048000         0 100% /drive0
/dev/mdvg/mdlv      2048000   2048000         0 100% /Storage`,
    options: [
      "The data volume has run out of inodes, so no new files can be created even though free space remains",
      "The /data partition is full",
      "The disk is fine. Installs fail because FGFM keepalives are too short",
      "The output shows RAID degradation on /dev/mdvg/mdlv",
    ],
    answer: [0],
    explanation: "`-i` reports **inodes**, not blocks. The main volume has 0 inodes available (100% used), so creating files fails even with plenty of free space. Installs, scripts and logs all create files. Find what is creating huge numbers of small files (TAC can help, and a known issue in some builds causes this), and in the short term a reboot may clear temporary files. `/data` shows 0% inode use. Keepalives are unrelated, and df output says nothing about RAID health.",
    lesson: L54S,
  },
  {
    id: 'd5-058',
    topic: '5.4',
    type: 'multi',
    difficulty: 2,
    stem: "An administrator wants to trace a failing policy package install on FMG-HQ, both the package or copy processing and the communication with the device. Which two debug targets should be enabled with diagnose debug application? (Choose two.)",
    options: [
      "securityconsole",
      "depmanager",
      "fgfmd",
      "oftpd",
      "sqlplugind",
    ],
    answer: [0, 1],
    explanation: "`securityconsole` covers policy package copy, preview and install processing. `depmanager` (deployment manager) covers retrieving from and deploying to devices. `fgfmd` is the FortiGate-side FGFM daemon. FortiManager's FGFM daemon is `fgfmsd`. `oftpd` and `sqlplugind` relate to log reception and SQL log processing, not installs.",
    lesson: L54S,
  },
  {
    id: 'd5-059',
    topic: '5.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. FMG-HQ is a VM with a 60 GB data disk and acts as the local FortiGuard server for its FortiGates. Disk usage keeps creeping toward 100%. What is the most likely reason?",
    exhibit: String.raw`FMG-HQ # get fmupdate disk-quota
value : 51200

FMG-HQ # get system status
...
Disk Usage                  : Free 1.20GB, Total 59.00GB
File System                 : Ext4
...`,
    options: [
      "The Update Manager quota (about 50 GB) is so close to the disk size that the cleanup threshold is reached only after the disk is nearly full. Expand the disk to the documented minimum or lower the quota",
      "Revision history is unlimited by default and has filled the disk",
      "fgfm-sock-timeout is too high, so stale sessions fill the disk",
      "The ext4 file system is damaged and is reporting wrong free space. Run fsck",
    ],
    answer: [0],
    explanation: "FortiGuard packages and images are only cleaned up when their directory reaches the Update Manager quota (`config fmupdate disk-quota`, default 51200 MB). On a disk barely larger than that, everything else runs out of space first. Size the VM to the documented minimum (the 7.6 FortiManager-VM guide lists 500 GB of disk storage, with the data disk ideally above 500 GB), or reduce the quota. Revisions are capped by `max-revs` (default 100). Socket timeouts don't consume disk. Nothing suggests file system damage.",
    lesson: L54S,
  },
  {
    id: 'd5-060',
    topic: '5.4',
    type: 'multi',
    difficulty: 2,
    stem: "Which two FortiManager settings directly limit how much disk space is consumed? (Choose two.)",
    options: [
      "max-revs under config system dm",
      "value under config fmupdate disk-quota",
      "fgfm_keepalive_itvl under config system dm",
      "rollback-allow-reboot under config system dm",
      "mgmt-addr under config system admin setting",
    ],
    answer: [0, 1],
    explanation: "`max-revs` caps the configuration revisions kept per device (1–250, default 100). `config fmupdate disk-quota` → `set value` caps the Update Manager space for FortiGuard packages and images (default 51200 MB). The keepalive interval, rollback behavior and management address have nothing to do with disk consumption.",
    lesson: L54S,
  },
];
