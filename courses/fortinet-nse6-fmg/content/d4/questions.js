// Domain 4 — Advanced configuration question bank (original, exam-style).
export default [
  {
    id: 'd4-001',
    topic: '4.1',
    type: 'single',
    difficulty: 1,
    stem: 'What is the maximum number of FortiManager units in one FortiManager HA cluster?',
    options: [
      'Two: one primary and one secondary',
      'Three: one primary and two secondaries',
      'Five: one primary and up to four secondaries',
      'Eight: one primary and up to seven secondaries',
    ],
    answer: [2],
    explanation: 'A FortiManager HA cluster has **one primary and up to four secondary (backup) units**, five in total, all of the same FortiManager series. The primary lists up to four peers; each secondary lists only the primary.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-002',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The HA pane on FMG-HQ shows the cluster as Down and nothing is synchronized to FMG-B. Both units can ping each other and TCP 5199 is open between them. What is the cause?',
    exhibit: String.raw`FMG-HQ # show system ha
config system ha
    set clusterid 15
    set mode primary
    set password ENC A3bc...
    config peer
        edit 1
            set ip 10.0.1.52
            set serial-number "FMG-VM0A26000102"
        next
    end
end

FMG-B # show system ha
config system ha
    set clusterid 51
    set mode secondary
    set password ENC A3bc...
    config peer
        edit 1
            set ip 10.0.1.50
            set serial-number "FMG-VM0A26000101"
        next
    end
end`,
    options: [
      'The cluster IDs differ (15 and 51); heartbeats are accepted only when cluster ID and group password match',
      'FMG-B must list itself as a peer as well as the primary',
      'Manual failover mode requires a VIP on both units',
      'The secondary must use the same serial number in its peer entry as the primary uses',
    ],
    answer: [0],
    explanation: 'A unit treats a peer as functioning only when heartbeats arrive with a **matching cluster ID and group password**. 15 and 51 do not match, so the primary never hears all its peers and the cluster stays Down. A secondary lists only the primary as its peer, which FMG-B does correctly with FMG-HQ\'s own serial. A VIP is used only in VRRP mode.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-003',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two items are NOT synchronized from the primary FortiManager to the secondary units? (Choose two.)',
    options: [
      'The hostname',
      'Local certificates',
      'Device databases of managed FortiGates',
      'ADOM databases and policy packages',
      'The config fmupdate service settings that enable built-in FDS services',
    ],
    answer: [0, 1],
    explanation: 'Fortinet lists settings that stay per unit: **hostname**, time/NTP, network, web proxy, HA settings, **local certificates**, SNMP, mail, syslog, SAML SSO, LDAP servers and LDAP admin users, the FortiCloud account, FortiGuard databases and some FortiGuard settings. All FortiManager **database** content (device and ADOM databases) is synchronized, and `config fmupdate service` is explicitly one of the FortiGuard settings that **is** synchronized.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-004',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: 'Which TCP port do FortiManager HA heartbeat and synchronization traffic use? (number)',
    answer: ['5199', 'tcp 5199', 'tcp/5199'],
    explanation: 'FortiManager HA heartbeats and database/configuration synchronization use **TCP 5199** between the configured peer IPs. Firewalls between geo-redundant members must allow it.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-005',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. With this configuration, how long after the primary stops sending heartbeats will the secondary consider it failed?',
    exhibit: String.raw`FMG-HQ # show system ha
config system ha
    set clusterid 15
    set hb-interval 5
    set hb-lost-threshold 12
    set mode primary
    set password ENC A3bc...
    config peer
        edit 1
            set ip 10.0.1.52
            set serial-number "FMG-VM0A26000102"
        next
    end
end`,
    options: [
      '12 seconds',
      '17 seconds',
      '60 seconds',
      '300 seconds',
    ],
    answer: [2],
    explanation: 'Failure detection time = heartbeat interval × lost threshold = **5 × 12 = 60 seconds**. 300 seconds is the result of the defaults (10 × 30). 12 is just the threshold and 17 adds the two values instead of multiplying.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-006',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: 'FMG-HQ (primary, manual failover mode) has a hardware failure. FMG-B is the only secondary. What must the administrator do to restore management of the FortiGates?',
    options: [
      'Nothing; FMG-B becomes primary automatically after the failover threshold',
      'Reconfigure FMG-B with mode primary (removing the failed peer); it keeps its own IP address, and FortiManager updates the FortiManager IP registered on the FortiGates',
      'Restore the last FMG-HQ backup onto FMG-B, because a secondary holds only a copy of the configuration, not the databases',
      'Change FMG-B\'s IP address to FMG-HQ\'s IP so the FortiGates can reconnect',
    ],
    answer: [1],
    explanation: 'In **manual** mode the cluster is down until you reconfigure it: set a secondary to `primary` and adjust peers. Fortinet notes that the new primary **keeps its IP address** and that the FortiManager IP registered on the FortiGates is changed automatically when the new primary is selected. (Behind NAT in manual mode, configure the management address on both units so FortiManager knows the public addresses.) Automatic promotion is VRRP mode. The secondary already holds the full synchronized database, and changing its IP is unnecessary.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-007',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FMG-HQ (198.51.100.10) and FMG-B (203.0.113.10) are in two data centres connected by a routed WAN. After configuring VRRP failover, both units claim the primary role. What should be changed?',
    exhibit: String.raw`FMG-HQ # show system ha
config system ha
    set clusterid 15
    set failover-mode vrrp
    set mode primary
    set password ENC A3bc...
    set priority 200
    set vip 192.0.2.1
    set vrrp-interface "port1"
    config peer
        edit 1
            set ip 203.0.113.10
            set serial-number "FMG-VM0A26000102"
        next
    end
end

FMG-B: identical except mode secondary, priority 100, peer ip 198.51.100.10 with serial-number FMG-VM0A26000101`,
    options: [
      'Set the same priority on both units so that VRRP can elect a primary',
      'Enable unicast on both units, because the peers are not in the same Layer 2 domain and multicast VRRP adverts do not reach the other site',
      'Give each unit a different VIP that belongs to its own subnet',
      'Change failover-mode to manual, because VRRP is not supported between different subnets',
    ],
    answer: [1],
    explanation: 'For geo-redundant HA Fortinet states **unicast is mandatory**, because the peers are not on the same Layer 2 network; `unicast` defaults to disable, so each unit never sees the other\'s adverts and both act as primary. Different priorities are what decides the primary. The VIP must be **identical** on all peers. VRRP mode explicitly supports geo-redundant, routed deployments.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-008',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FMG-HQ (FMG-VM0A26000101) and FMG-B (FMG-VM0A26000102) form a VRRP cluster. After a forced failover to FMG-B, FGT-Branch1 stops connecting to FortiManager, while FGT-Branch2, whose central-management lists both serial numbers, reconnects. What must be added on FGT-Branch1?',
    exhibit: String.raw`FGT-Branch1 # show system central-management
config system central-management
    set type fortimanager
    set fmg "198.51.100.10" "203.0.113.10"
    set serial-number "FMG-VM0A26000101"
end`,
    options: [
      'The serial number of FMG-B (FMG-VM0A26000102) with set serial-number',
      'set include-default-servers disable',
      'set fmg-update-port 443',
      'The cluster VIP 192.0.2.1 in set fmg',
    ],
    answer: [0],
    explanation: 'FortiGates must know **every** FortiManager address and **serial number**. The FortiGate learns the primary\'s serial automatically, but Fortinet says the secondary\'s serial must be added manually (`set serial-number "FMG_SN_A" "FMG_SN_B"`), otherwise central management is interrupted after failover. Both IPs are already listed. `include-default-servers` and `fmg-update-port` are FortiGuard settings. In Fortinet\'s VRRP example the VIP is a dummy address not used for management.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-009',
    topic: '4.1',
    type: 'fill',
    difficulty: 2,
    stem: 'Which FortiManager diagnose command triggers a new VRRP election so that the unit with the next highest priority becomes primary (for testing failover)? (full command)',
    answer: ['diagnose ha force-vrrp-election', 'diag ha force-vrrp-election'],
    explanation: '`diagnose ha force-vrrp-election` forces a new VRRP election; Fortinet uses it to fail over to the FortiManager with the next highest priority. Related commands: `get system ha-status` (role and HA health), `diagnose ha stats` (statistics) and `diagnose ha force-resync` (re-synchronize configuration). Note that `diagnose ha status` is not in the 7.6 CLI reference.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-010',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: 'FMG-HQ (default settings) manages the FortiGate FGCP cluster FGT-HQ (two members). Which two statements are correct? (Choose two.)',
    options: [
      'FortiManager manages the cluster as a single device, added using the primary\'s IP address',
      'FortiManager cannot configure HA settings on the real FortiGates; HA is configured on the FortiGates and imported',
      'Changing the HA priority in a CLI script run on the device database is installed to the cluster at the next install',
      'Each cluster member must be added separately so that FortiManager can install to both',
      'The cluster should use ha-mgmt-interface for the FGFM connection',
    ],
    answer: [0, 1],
    explanation: 'An operating cluster is added like a standalone device using the **primary\'s IP**, and FortiManager handles it as **one managed device** (members appear under Cluster Members, with Promote). **HA cannot be configured on real FortiGates from FortiManager**; the HA Status widget is read-only, and HA changes made with CLI templates or scripts appear in the device database but are **not pushed**. Fortinet says clustered FortiGates should **not** use `ha-mgmt-interface` or `standalone-mgmt-vdom` for FGFM. (7.6.3 added `config system dm` → `handle-nonhasync-config`; at its default, disable, member-specific/HA items are still skipped at install.)',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-011',
    topic: '4.1',
    type: 'order',
    difficulty: 2,
    stem: 'Put the events of a FortiManager HA cluster start-up in order.',
    items: [
      'Each unit sends heartbeats to its configured peer IPs and listens for heartbeats from them',
      'A unit accepts a peer\'s heartbeats when the cluster ID and group password match',
      'The primary receives heartbeats from all configured peers and sets the cluster status to Up',
      'The primary synchronizes its configuration and database to the secondaries',
      'Changes made during the initial synchronization are re-synchronized, and normal operation begins',
    ],
    explanation: 'This follows Fortinet\'s description of cluster start-up. Note that the cluster is Up only when the primary hears **all** configured peers, and that changes made during the initial sync are not lost but re-synchronized afterwards.',
    lesson: '4.1-fmg-ha',
  },
  {
    id: 'd4-012',
    topic: '4.2',
    type: 'single',
    difficulty: 1,
    stem: 'An administrator wants to practise using FortiManager as a local FDS on a FortiManager-VM running the free trial licence. What should the administrator expect?',
    options: [
      'All FortiGuard services work, limited to three devices',
      'The trial cannot act as a local FDS and has no FortiGuard subscriptions',
      'Only web filter queries work on the trial',
      'The FDS works for 15 days and then stops',
    ],
    answer: [1],
    explanation: 'Fortinet states that **a FortiManager VM with a trial licence does not support FortiGuard subscriptions and cannot act as a local FDS** (the trial also limits you to three devices/VDOMs and two ADOMs and has no FortiAnalyzer features). Practising FDS needs a full licence with a FortiCare Premium or Elite contract.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-013',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Branch1 and FGT-Branch2 receive AV and IPS updates from FMG-HQ, but every web filter rating query to FMG-HQ times out. Web Filtering service access is enabled on port1. What is the most likely cause?',
    exhibit: String.raw`FMG-HQ # get fmupdate service
avips               : enable
query-antispam      : disable
query-antivirus     : disable
query-filequery     : disable
query-ioc           : disable
query-iot           : disable
query-outbreak-prevention: disable
query-webfilter     : disable
webfilter-https-traversal: disable`,
    options: [
      'avips must be disabled before query services can run',
      'query-webfilter is disabled, so the built-in FDS does not answer web filter rating queries',
      'webfilter-https-traversal must be enabled for any web filter query to be answered',
      'Web filter queries always go to the public FortiGuard servers and cannot be answered by FortiManager',
    ],
    answer: [1],
    explanation: '`config fmupdate service` enables each built-in FDS service separately. `avips` (default enable) covers AV/IPS updates, which work; `query-webfilter` (default **disable**) must be enabled for rating queries. AV/IPS and query services run together. HTTPS traversal is an optional extra, and FortiManager can absolutely be a web filter rating server.',
    lesson: '4.2-fortiguard-webfilter-override',
  },
  {
    id: 'd4-014',
    topic: '4.2',
    type: 'match',
    difficulty: 1,
    stem: 'Match each FortiGuard term to its meaning.',
    pairs: [
      ['FDN', 'Fortinet\'s worldwide network of FortiGuard servers that publish updates and answer queries'],
      ['Local FDS', 'FortiManager\'s built-in server distributing updates and answering ratings for local devices'],
      ['Override server', 'An address a device is configured to use instead of the default public FortiGuard servers'],
      ['Push update', 'A notification from the FDN that makes FortiManager download an urgent AV/IPS update immediately'],
      ['Query service', 'Real-time rating lookups such as web filter categories and anti-spam'],
    ],
    explanation: 'FDN = FortiGuard Distribution Network; an FDS is one server in it, and FortiManager has a built-in FDS. Devices point at FortiManager as an **override server**. Push notifications arrive on UDP 9443. Update services deliver packages; query services answer per-request lookups.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-015',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FortiGuard services are enabled on FMG-HQ and it has downloaded current AV/IPS packages, but FortiGates connecting to 10.0.1.50 cannot download updates from it. What is missing?',
    exhibit: String.raw`FMG-HQ # get system interface port1
name: port1
status: enable
ip: 10.0.1.50 255.255.255.0
allowaccess: ping https ssh
serviceaccess:
speed: auto
type: physical`,
    options: [
      'http in allowaccess, because FortiGates download updates over HTTP',
      'serviceaccess on port1: FortiGate Updates (fgtupdates), plus Web Filtering (webfilter-antispam) for rating queries',
      'A second IP address on port1, because FDS cannot share the management IP',
      'snmp in allowaccess, which FortiGates use to discover the FDS',
    ],
    answer: [1],
    explanation: 'FortiGuard services are offered only on interfaces with **Service Access** enabled, and Fortinet notes service access is **not enabled on any port by default**. `set serviceaccess fgtupdates webfilter-antispam` (and `fclupdates` for FortiClient) fixes it. `allowaccess` is administrative access. A separate Bind to IP is needed only for update/rating service on TCP 443; on the default 8890 the management IP is used.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-016',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: 'An administrator is preparing FMG-HQ (FortiManager 7.6.5) to be the local FDS for 300 FortiGates. Which two are prerequisites? (Choose two.)',
    options: [
      'A valid FortiCare Premium or Elite support contract on FMG-HQ itself',
      'Service Access for FortiGate updates and web filtering on the interface the FortiGates use',
      'Every FortiGate must be authorized in Device Manager',
      'FortiAnalyzer features must be enabled',
      'FMG-HQ must be part of an HA cluster',
    ],
    answer: [0, 1],
    explanation: 'FortiManager needs **its own FortiCare Elite/Premium contract** to act as a local FDS; starting in 7.6.5 (and 7.4.9, 7.2.12) it needs that contract, registered in FortiCloud, to get any object updates from FortiGuard. The FortiGates\' contracts do not satisfy it. The interface also needs **Service Access**, which is enabled on no port by default. Devices do **not** have to be authorized to use the built-in FDS (unregistered devices are handled by `unreg_dev_opt`). FortiAnalyzer features and HA are unrelated.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-017',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'In FortiGuard > Packages > Service Status, FGT-Branch2 shows Pending. What does this mean?',
    options: [
      'FGT-Branch2 has never requested a package from FortiManager',
      'FGT-Branch2 has an older package for an acceptable reason, such as its scheduled update time not having arrived yet',
      'FGT-Branch2 missed its scheduled query or did not receive the latest package correctly',
      'FortiManager is waiting for an administrator to approve the package in workflow mode',
    ],
    answer: [1],
    explanation: '**Pending** = the device has an older version for an acceptable reason (for example its scheduled update has not happened yet); you can use **Push Pending** to send it now. Never requested = **Never Updated**. Missed query or bad download = **Problem**. Package distribution has nothing to do with workflow approval.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-018',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. Which device should the administrator investigate first because it missed its scheduled query or did not correctly receive the latest package?',
    exhibit: String.raw`FortiGuard > Packages > Service Status (By Device)

Device         Status          Last Update Time
-------------  --------------  -------------------
FGT-Branch1    Up to Date      2026-10-29 06:00:12
FGT-Branch2    Pending         2026-10-28 18:00:40
FGT-Branch3    Problem         2026-10-26 06:00:03
FGT-Branch4    Never Updated   -`,
    options: [
      'FGT-Branch1',
      'FGT-Branch2',
      'FGT-Branch3',
      'FGT-Branch4',
    ],
    answer: [2],
    explanation: '**Problem** is the status for a device that missed its scheduled query or did not correctly receive the latest package. FGT-Branch2 (Pending) only has an older version for an acceptable reason, FGT-Branch4 has never requested a package (perhaps it is not pointed at FortiManager yet), and FGT-Branch1 is current.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-019',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. A newly published IPS package caused false positives at another site. The administrator wants FMG-HQ to keep distributing the previous IPS version to FortiGates until Fortinet fixes it. What should be done?',
    exhibit: String.raw`FortiGuard > Packages > Receive Status (FortiGate 7.6)

Package Name                Version   Latest Version (Release Date/Time)   To Be Deployed Version
--------------------------  --------  -----------------------------------  ----------------------
IPS Attack Engine           7.01022   7.01022 (2026-10-20 10:14)           Latest   [Change]
IPS Definitions             32.01045  32.01045 (2026-10-29 03:40)          Latest   [Change]
AntiVirus Definitions       93.07112  93.07112 (2026-10-29 05:02)          Latest   [Change]`,
    options: [
      'Disable avips in config fmupdate service until the fix is released',
      'Click Change in the To Be Deployed Version column for IPS Definitions and select the previous version',
      'Set server override mode to strict so FortiManager stops downloading packages',
      'Disable push updates, which prevents FortiGates from receiving new IPS definitions',
    ],
    answer: [1],
    explanation: 'The **To Be Deployed Version** (default: latest) decides which version FortiManager hands out; **Change** lets you select an older received version for that package. From 7.6.2 the choice is also synchronized in an HA cluster, so it survives failover. Disabling `avips` stops all AV/IPS distribution. Strict mode only controls fallback when an override server is unreachable. Disabling push only changes how quickly FortiManager learns of updates; the new version would still be deployed after the next poll.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-020',
    topic: '4.2',
    type: 'fill',
    difficulty: 2,
    stem: 'FortiManager is behind a NAT firewall and push updates from the FDN never arrive. On which UDP port does FortiManager listen for FortiGuard push notifications, which the firewall must forward? (number)',
    answer: ['9443', 'udp 9443', 'udp/9443'],
    explanation: 'Push notifications from the FDN arrive on **UDP 9443**. Behind NAT, enter the NAT device\'s external IP and port as the push override under Allow Push Update so the FDN sends to a reachable address, and port-forward it to FortiManager UDP 9443. A dynamic public IP (DHCP/PPPoE) can make the override stale.',
    lesson: '4.2-fortiguard-fds-avips',
  },
  {
    id: 'd4-021',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. The upstream FortiManager 10.20.0.50 has been down for six hours, and FMG-HQ has not downloaded any AV/IPS update during that time, although it has Internet access. Why?',
    exhibit: String.raw`FMG-HQ # show fmupdate server-override-status
config fmupdate server-override-status
    set mode strict
end

FortiGuard > Settings > FortiGuard Antivirus and IPS Settings
  Use Override Server Address for FortiGate/FortiMail : ON
      10.20.0.50 : 8890`,
    options: [
      'Strict mode makes FortiManager use only the override server; when it is unreachable, no update is retrieved',
      'Strict mode disables push updates, so FortiManager waits for the next manual Update Now',
      'Override servers are used only for FortiClient packages, so FortiGate packages are never downloaded',
      'The override must use port 443 when FortiManager has Internet access',
    ],
    answer: [0],
    explanation: 'Server Override Mode **strict** ("Access Override Server Only") means FortiManager does not fall back to the default FortiGuard servers when the override server is unreachable, so it retrieves nothing. **Loose** (the default) would fall back to public FortiGuard. Strict mode does not change push behaviour. The FortiGate/FortiMail override list is exactly for FortiGate packages, and 8890 is the correct upstream port for them.',
    lesson: '4.2-fortiguard-webfilter-override',
  },
  {
    id: 'd4-022',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two statements about FortiManager server override mode are correct? (Choose two.)',
    options: [
      'Loose mode is the default and falls back to the default FortiGuard servers if the override server cannot be reached',
      'In strict mode the override servers must be configured, otherwise the server list is empty',
      'Strict mode makes managed FortiGates ignore their own override settings',
      'Loose mode sends every request to both the override server and public FortiGuard in parallel',
      'Server override mode is configured on each FortiGate with config fmupdate server-override-status',
    ],
    answer: [0, 1],
    explanation: '`config fmupdate server-override-status` → `set mode {loose | strict}` is a **FortiManager** setting for where FortiManager itself retrieves updates. **Loose** (default) tries the override and falls back to the default servers; **strict** uses only the override servers, so they must be configured or the list is empty. It does not change FortiGate settings, and loose does not query in parallel.',
    lesson: '4.2-fortiguard-webfilter-override',
  },
  {
    id: 'd4-023',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: 'FMG-DMZ has no Internet access and must use FMG-HQ (10.0.1.50) as its FDS for FortiGate AV/IPS packages. On FMG-DMZ, Use Override Server Address for FortiGate/FortiMail is enabled. Which address and port should be entered?',
    options: [
      '10.0.1.50 port 541',
      '10.0.1.50 port 8890',
      '10.0.1.50 port 8900',
      '10.0.1.50 port 9443',
    ],
    answer: [1],
    explanation: 'For a cascaded FortiManager, Fortinet\'s procedure uses the upstream IP with port **8890** for FortiGate/FortiMail AV/IPS, 8891 for FortiClient AV/IPS, **8900** for FortiGate/FortiMail web/email filter and 8901 for FortiClient web/email filter. The upstream must also have `serviceaccess fgtupdates fclupdates webfilter-antispam`. 541 is FGFM and 9443 is the FDN push port.',
    lesson: '4.2-fortiguard-webfilter-override',
  },
  {
    id: 'd4-024',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. FGT-Branch1 has current signatures, but FMG-HQ\'s Service Status shows it as Never Updated. Why?',
    exhibit: String.raw`FGT-Branch1 # show full-configuration system central-management
config system central-management
    set mode normal
    set type fortimanager
    ...
    set fmg "10.0.1.50"
    ...
    config server-list
        edit 1
            set server-type update rating
            set addr-type ipv4
            set server-address 10.0.1.50
        next
    end
    set fmg-update-port 8890
    set include-default-servers enable
    ...
end`,
    options: [
      'fmg-update-port must be 443 for FortiManager to record updates',
      'include-default-servers is enabled, so the FortiGate also uses the public FortiGuard servers and is updating from them; FortiManager never sees the downloads',
      'A server-list entry cannot have both update and rating types',
      'Service Status only tracks FortiGates in backup-mode ADOMs',
    ],
    answer: [1],
    explanation: 'Fortinet\'s guidance is that a managed FortiGate should have `include-default-servers disable` and the FortiManager as `server-address`. With it **enabled** (the default), the update list contains the production FDS as well as FortiManager; updates fetched from the public FDS are invisible to FortiManager, so its Service Status is wrong. 8890 is the default and valid update port, `server-type` accepts both values, and Service Status covers managed FortiGates generally.',
    lesson: '4.2-fortiguard-fortigate-firmware-troubleshooting',
  },
  {
    id: 'd4-025',
    topic: '4.2',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. Security policy allows FortiGates to reach FMG-HQ only on TCP 443, so the administrator configures the FortiGates as shown. What must be configured on FMG-HQ for updates and ratings over 443 to work?',
    exhibit: String.raw`FGT-Branch1 # config system central-management
FGT-Branch1 (central-management) # config server-list
FGT-Branch1 (server-list) # edit 1
FGT-Branch1 (1) # set server-type update rating
FGT-Branch1 (1) # set server-address 10.0.1.55
FGT-Branch1 (1) # next
FGT-Branch1 (server-list) # end
FGT-Branch1 (central-management) # set fmg-update-port 443
FGT-Branch1 (central-management) # set include-default-servers disable
FGT-Branch1 (central-management) # end

FMG-HQ port1: 10.0.1.50/24`,
    options: [
      'Nothing; FortiManager answers FDS requests on its GUI address on 443 automatically',
      'A Bind to IP Address for the update and rating services: a unique address on the same subnet as the interface with service access enabled',
      'A web proxy in tunnel mode on TCP 443',
      'fortiguard-anycast enable under config fmupdate fds-setting',
    ],
    answer: [1],
    explanation: 'FortiManager serves update and rating requests on **TCP 443** only through the **Bind to IP Address** of an interface with service access: a unique address in the interface\'s subnet (only one interface can do this). The FortiGate\'s `server-address` (10.0.1.55 here) must be that bind IP. The GUI address is not used for 443 FDS service, the web proxy is for FortiManager\'s own outbound connection to the FDN, and anycast affects how FortiManager reaches FortiGuard.',
    lesson: '4.2-fortiguard-fortigate-firmware-troubleshooting',
  },
  {
    id: 'd4-026',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. FGT-Lab is managed locally (not in Device Manager) but is configured to use FMG-HQ as its FortiGuard override server. FMG-HQ adds FGT-Lab as an unregistered device but refuses its update requests. Which change lets FMG-HQ serve it without managing it?',
    exhibit: String.raw`FMG-HQ # get system admin setting
...
auto-update         : enable
...
unreg_dev_opt       : add_no_service
...`,
    options: [
      'set unreg_dev_opt add_allow_service',
      'set auto-update disable',
      'Authorize FGT-Lab in Device Manager, because only managed devices can use the built-in FDS',
      'set offline_mode enable',
    ],
    answer: [0],
    explanation: '`unreg_dev_opt add_no_service` adds unregistered devices but **denies** service; `add_allow_service` adds them **and allows** service requests. Devices are **not** required to be authorized in Device Manager to use the built-in FDS. auto-update concerns FortiGate configuration changes, and offline mode stops device communication entirely.',
    lesson: '4.2-fortiguard-fortigate-firmware-troubleshooting',
  },
  {
    id: 'd4-027',
    topic: '4.2',
    type: 'fill',
    difficulty: 2,
    stem: 'Which FortiManager diagnose command dumps the FortiGuard subscriber contract that FortiManager holds for a device, optionally given its serial number? (command without the serial)',
    answer: ['diagnose fmupdate dbcontract', 'diag fmupdate dbcontract'],
    explanation: '`diagnose fmupdate dbcontract [<serial>]` dumps the subscriber contract, for example `diagnose fmupdate dbcontract FGVM02TM26001001`. `diagnose fmupdate fds-dump subs` dumps the contract file. In the GUI, FortiGuard > Device Licenses shows contract and subscription status per device.',
    lesson: '4.2-fortiguard-fortigate-firmware-troubleshooting',
  },
  {
    id: 'd4-028',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'FGT-Branch3 was added to FortiManager two weeks ago. A firmware upgrade from FortiGuard > Firmware Images fails for FGT-Branch3 only, while other FortiGates of the same model upgrade with the same image. What is the most likely cause?',
    options: [
      'FortiManager deletes cached images after 24 hours',
      'FGT-Branch3 does not have a valid Firmware & General Updates (FMWR) contract, and its 24-hour grace period after being added has expired',
      'FortiManager can upgrade only FortiGates that use FortiManager as their FDS',
      'The image must be imported again for each device',
    ],
    answer: [1],
    explanation: 'FortiGates need a valid **FMWR** contract for firmware updates through FortiManager, both from FortiGuard and from manually uploaded images. A **24-hour grace period** after adding a device allows upgrades while contract information synchronizes, which has long passed here. Images stored on FortiManager are reused for every device of that model, and FDS use is not a requirement.',
    lesson: '4.2-fortiguard-fortigate-firmware-troubleshooting',
  },
  {
    id: 'd4-029',
    topic: '4.2',
    type: 'order',
    difficulty: 3,
    stem: 'Put the steps for running FMG-DMZ as a local FDS in a closed network (no Internet) in order.',
    items: [
      'On FortiGuard > Settings, turn off Enable Communication with FortiGuard Server and enable the AV/IPS, web filter and email filter services needed',
      'Download the packages from the Fortinet Support portal or export them from an online FortiManager',
      'Upload the packages, databases and the devices\' service licence (entitlement) files to FMG-DMZ',
      'Verify in FortiGuard > Packages > Service Status that the FortiGates using FMG-DMZ show Up to Date',
    ],
    explanation: 'Fortinet\'s closed-network procedure: disable communication with FortiGuard (`config fmupdate publicnetwork` → `set status disable`), enable the services, obtain packages (metadata packages such as IPS Slim only from an online FortiManager), upload packages and licences (large databases via `execute fmupdate ... import`), then confirm the devices are receiving updates. FortiGates download only the services they have enabled.',
    lesson: '4.2-fortiguard-webfilter-override',
  },
  {
    id: 'd4-030',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: 'An administrator wants to confirm on FGT-Branch1 which FortiGuard rating servers the FortiGate is using and whether FortiManager 10.0.1.50 is among them. Which FortiGate command shows this?',
    options: [
      'diagnose debug rating',
      'diagnose fmupdate view-serverlist fgd',
      'get system ha status',
      'diagnose debug application fgfmd -1',
    ],
    answer: [0],
    explanation: 'On the FortiGate, `diagnose debug rating` shows the rating service information, including the server list. `diagnose fmupdate view-serverlist fgd` is a **FortiManager** command (FortiManager\'s own FortiGuard query servers). `get system ha status` is FortiGate HA, and `fgfmd` debug shows the FGFM management tunnel, not FortiGuard.',
    lesson: '4.2-fortiguard-fortigate-firmware-troubleshooting',
  },
  {
    id: 'd4-031',
    topic: '4.3',
    type: 'multi',
    difficulty: 2,
    stem: 'Which two policy types can be created in a global policy package in the Global Database ADOM? (Choose two.)',
    options: [
      'Firewall Header Policy',
      'Traffic Shaping Footer Policy',
      'Firewall address group',
      'Security policy in NGFW policy-based mode',
      'Static route template',
    ],
    answer: [0, 1],
    explanation: 'Global packages contain **firewall header/footer policies** and **traffic shaping header/footer policies** (IPS headers/footers are configured separately under Header/Footer IPS). **NGFW policy mode is not supported** for global policy packages, an address group is an object (global objects exist, but an object is not a policy type), and a static route template is a provisioning template, not a policy.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-032',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. The global package MSSP-Global is assigned as shown and then installed. Which policy packages in ADOM MSSP-CustomerA receive the global header and footer policies?',
    exhibit: String.raw`Global Database > Policy Packages > MSSP-Global > Assignment

ADOM              ADOM Policy Packages
----------------  -----------------------------------------------
MSSP-CustomerA    Specify Policy Packages to Exclude: Lab-PP
MSSP-CustomerB    All Policy Packages

Policy packages in MSSP-CustomerA: default, Branch-PP, Lab-PP`,
    options: [
      'Only Lab-PP',
      'default and Branch-PP',
      'default, Branch-PP and Lab-PP',
      'None, because a global package can be assigned to all packages of only one ADOM',
    ],
    answer: [1],
    explanation: '**Specify Policy Packages to Exclude** assigns the global package to every package in the ADOM **except** the ones listed, so default and Branch-PP get it and Lab-PP does not. "Specify Policy Packages to Include" would do the opposite. A global package can be assigned to many ADOMs, each with its own scope.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-033',
    topic: '4.3',
    type: 'multi',
    difficulty: 3,
    stem: 'Which two statements about global policy packages are correct? (Choose two.)',
    options: [
      'Each local policy package can have only one global policy package assigned to it',
      'After a global package is unassigned, its policies stay on the FortiGates until the next install',
      'Re-importing a FortiGate\'s configuration brings the installed global header and footer policies back into the Global Database',
      'Global database objects can be installed directly to devices without assigning them to an ADOM',
      'A global policy licence is required to create global policy packages',
    ],
    answer: [0, 1],
    explanation: 'One global package per local package (an ADOM can still use several global packages across its packages), and unassigning requires an **install** to remove the global policies from devices. Re-import does **not** retrieve global policies (Fortinet: global header/footer policies are not imported, and global policy and objects cannot be retrieved from a managed device). Global database objects **cannot** be installed to devices on their own. Fortinet states **no global policy licence is required**.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-034',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: 'The Global Database ADOM is version 7.4 and its global package is assigned to ADOMs Retail (7.4) and HQ (7.4). The administrator wants to use 7.6 features in the global header policies. What is the correct order?',
    options: [
      'Upgrade the Global Database to 7.6 first, then upgrade Retail and HQ',
      'Upgrade Retail and HQ (and their devices) to a supported version first, then upgrade the Global Database, edit the policies, re-assign and install',
      'Upgrade the Global Database and both ADOMs in the same multi-select upgrade operation',
      'Create a new 7.6 Global Database next to the existing one',
    ],
    answer: [1],
    explanation: 'Fortinet states that the Global Database ADOM should be upgraded **only after all ADOMs that use a global policy package have been upgraded**. The sequence is: upgrade the local ADOMs (and their devices), upgrade the Global Database, edit the header/footer policies, re-assign and install. Upgrading the Global Database first reverses that order, Fortinet documents a sequence rather than one combined operation, and there is only one Global Database ADOM, so you cannot create a second one.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-035',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: 'Refer to the exhibit. An administrator with this profile can create and edit global header policies in the Global Database ADOM, but the Assign Selected button fails. Why?',
    exhibit: String.raw`FMG-HQ # show system admin profile Global_Editors
config system admin profile
    edit "Global_Editors"
        set adom-switch read-write
        set policy-objects read-write
        set global-policy-packages read-write
        set assignment none
        set adom-policy-packages read-write
        set deploy-management read-write
    next
end`,
    options: [
      'deploy-management must be none to allow assignment',
      'assignment none denies the Assign from Global ADOM permission, which is separate from editing global policy packages',
      'Only the admin account can assign global packages',
      'global-policy-packages read-write allows viewing only; assignment needs Super_User',
    ],
    answer: [1],
    explanation: 'The profile has separate permissions for **Global Policy Packages & Objects** (`global-policy-packages`) and **Assign from Global ADOM** (`assignment`). With `assignment none` the admin can edit but not assign. (The predefined Standard_User profile has exactly this combination: Read-Write global packages, None for assignment.) Deploy rights do not block assignment, and any profile with `assignment read-write` can assign, not only `admin`.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-036',
    topic: '4.3',
    type: 'fill',
    difficulty: 2,
    stem: 'Which script type is the only one supported in the Global Database ADOM? (one word)',
    answer: ['CLI', 'CLI script', 'CLI scripts'],
    explanation: 'Only **CLI** scripts are supported in the Global Database ADOM, and they can run only on the Policy Package or ADOM Database (not on devices). In local ADOMs, TCL scripts run only on the Remote FortiGate Directly (via CLI) and Jinja scripts only on the ADOM Database.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-037',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: 'Which of the following is NOT one of the three scorecards on the Fabric View > Security Rating pane?',
    options: [
      'Security Posture',
      'Fabric Coverage',
      'Optimization',
      'Threat Intelligence',
    ],
    answer: [3],
    explanation: 'The Security Rating pane has three scorecards: **Security Posture**, **Fabric Coverage** and **Optimization**, each with a letter grade, sub-category breakdown and point score, and drill-down links to FSBP and PCI controls. "Threat Intelligence" is not a scorecard.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-038',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: 'In ADOM Retail, an administrator selects the Security Fabric group rooted at FGT-HQ and clicks Run Now on the Security Rating pane. The report contains no data for FGT-Branch2, a member of the Fabric. What is the most likely reason?',
    options: [
      'FortiManager calculates security ratings itself only for FortiGates in the root ADOM',
      'The rating on FortiManager is built from the FortiGates\' own security rating reports, and FGT-Branch2 has no report available',
      'Security Rating is available only when FortiAnalyzer features are enabled',
      'Run Now works only for single devices, not Fabric groups',
    ],
    answer: [1],
    explanation: 'Fortinet states that the security rating on FortiManager is **based on the security rating reports from FortiGate**; if a FortiGate\'s report is unavailable, its data is missing. (Running checks across all Fabric devices also needs a Security Rating licence.) Fabric View is available in 6.0 and later ADOMs, does not need FortiAnalyzer features, and supports both Fabric groups (Select a CSF) and single FortiGates.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-039',
    topic: '4.3',
    type: 'match',
    difficulty: 2,
    stem: 'Match each FortiManager Fabric View feature to what it shows or does.',
    pairs: [
      ['Physical Topology', 'Fabric devices and the devices they connect to, grouped by upstream device'],
      ['Logical Topology', 'The logical or physical interfaces used to connect Fabric devices, grouped by upstream interface'],
      ['Security Rating', 'Letter-graded scorecards with FSBP and PCI-linked recommendations'],
      ['Fabric Connectors', 'Integrations whose objects can be used in policies'],
    ],
    explanation: 'Fabric View (6.0+ ADOMs) offers Physical and Logical Topology views with filters (Device Traffic, Device Count, OS, Hardware Vendor, Risk, No Devices) and metrics, the Security Rating pane, and fabric connector configuration.',
    lesson: '4.3-global-database-fabric-view',
  },
  {
    id: 'd4-040',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: 'Refer to the exhibit. After installing Branch-PP, a customer administrator adds local policy 20 to block all traffic from the NOC subnet and installs again, but SSH sessions from the NOC to the store servers still succeed. Why?',
    exhibit: String.raw`ADOM MSSP-CustomerA > Policy Packages > Branch-PP (global package MSSP-Global assigned)

Seq  Section         Name                Source          Destination   Service   Action
---  --------------  ------------------  --------------  ------------  --------  ------
1    Global Header   NOC-Mgmt-Allow      NOC-Net         Store-Srv     SSH SNMP  ACCEPT
2    Global Header   Block-Countries     all             Blocked-Geo   ALL       DENY
3    Local           Users-Internet      LAN-Users       all           ALL       ACCEPT
4    Local           20 Block-NOC        NOC-Net         all           ALL       DENY
5    Global Footer   Deny-All-Log        all             all           ALL       DENY`,
    options: [
      'Global footer policies are evaluated first, so Deny-All-Log never applies',
      'Global header policies are evaluated before local policies, so NOC-Mgmt-Allow matches the SSH traffic before Block-NOC is reached',
      'Local policies are ignored when a global package is assigned',
      'Block-NOC needs to be installed from the Global Database to take effect',
    ],
    answer: [1],
    explanation: 'The assigned global package wraps the local policies: **header** policies first, then the local policies inserted into the reserved block, then **footer** policies. SSH from NOC-Net to the store servers matches header policy NOC-Mgmt-Allow before the local Block-NOC is evaluated (FortiGate policies are first-match). Footers are evaluated last, local policies are still enforced for other traffic, and local policies are installed from the local ADOM, not the Global Database.',
    lesson: '4.3-global-database-fabric-view',
  },
];
