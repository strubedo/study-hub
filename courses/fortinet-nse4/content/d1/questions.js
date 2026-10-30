// Domain 1 — Deployment and system configuration question bank (original, exam-style).
export default [
  {
    id: 'd1-001',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: "An administrator unboxes a new entry-level desktop FortiGate, connects a laptop to one of its LAN ports and leaves the laptop set to obtain an address automatically. How does the administrator first log in to the GUI?",
    options: [
      "Browse to https://192.168.1.99 and log in as maintainer with the password bcpb followed by the serial number",
      "Browse to https://192.168.1.1 and log in as admin with the password fortinet",
      "Browse to https://192.168.1.99 and log in as admin with an empty password, then set a new password when prompted",
      "Connect to the console, because the factory default configuration has no administrative access on any interface",
    ],
    answer: [2],
    explanation: "Factory default hardware uses `192.168.1.99/24` on the LAN-side (or mgmt) interface, the `admin` account with a **blank password**, and forces a password change at first login. Entry-level models also run a DHCP server there, so the laptop gets an address in 192.168.1.0/24. 192.168.1.1 with `fortinet` is not a FortiGate default. The `maintainer` account is a console-only password-recovery account used within about 60 seconds of a power cycle, not a GUI login. The default configuration does allow HTTPS management on that interface.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-002',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator netops can log in to FGT-HQ from 10.0.1.25 but not from 10.0.2.25, even with the correct password. Both workstations can ping the FortiGate. Why?",
    exhibit: String.raw`FGT-HQ # show system admin netops
config system admin
    edit "netops"
        set trusthost1 10.0.1.0 255.255.255.0
        set trusthost2 192.0.2.50 255.255.255.255
        set accprofile "prof_admin"
        set vdom "root"
        set password ENC SH2...
    next
end`,
    options: [
      "Trusted hosts also block ping, so the ping replies must be coming from a different device",
      "10.0.2.25 is not inside any trusted host configured for netops, so FortiOS refuses that account's login from that address",
      "The prof_admin profile only allows logins from the subnet of the interface the admin connects to",
      "trusthost2 is a /32, which disables trusted host checking for all other subnets",
    ],
    answer: [1],
    explanation: "Once any trusted host is set for an administrator, that admin can log in only from sources inside one of the listed trusted hosts. 10.0.2.25 is not in 10.0.1.0/24 or 192.0.2.50/32, so the login is refused. Admin profiles control permissions, not source addresses. Trusted hosts apply only to administrative logins, so ping still works (ping is controlled by the interface `allowaccess`). A /32 trusted host is normal and does not disable checking.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-003',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about FortiGate administrator trusted hosts are true? (Choose two.)",
    options: [
      "Trusted hosts also restrict which source addresses can send traffic through firewall policies",
      "Trusted hosts are configured per administrator account and restrict where that account can log in from",
      "An administrator account with no trusted hosts configured can log in from any source address",
      "Trusted hosts remove the need to configure allowaccess on the interface",
      "Each administrator can have at most three trusted hosts",
    ],
    answer: [1, 2],
    explanation: "Trusted hosts are an attribute of each admin account (`trusthost1` to `trusthost10`); an account without any can log in from anywhere. They do nothing for transit traffic, which is governed by firewall policies. The limit is ten per account, not three. The interface must still list the management protocol in `allowaccess`; both checks have to pass.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-004',
    topic: '1.1',
    type: 'fill',
    difficulty: 1,
    stem: "Under `config system global`, which attribute changes the TCP port the FortiGate GUI listens on for HTTPS administrative access? Enter the attribute name.",
    answer: ['admin-sport', 'set admin-sport'],
    explanation: "`set admin-sport <port>` changes the HTTPS admin port (default 443). `admin-port` is the HTTP port, and `admin-ssh-port` is the SSH port.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-005',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An administrator at 10.0.1.25 browses to https://10.0.1.1 and the connection fails. What should the administrator do to reach the GUI?",
    exhibit: String.raw`FGT-HQ # show system global | grep admin
    set admin-sport 8443
    set admintimeout 15

FGT-HQ # show system interface port2
config system interface
    edit "port2"
        set vdom "root"
        set ip 10.0.1.1 255.255.255.0
        set allowaccess ping https ssh
        set role lan
    next
end`,
    options: [
      "Set admin-sport back to 443, because HTTPS admin access only works on port 443",
      "Remove ssh from the allowaccess list on port2, because SSH and HTTPS administration cannot share an interface",
      "Browse to https://10.0.1.1:8443",
      "Add a firewall policy from port2 to port2 that allows HTTPS",
    ],
    answer: [2],
    explanation: "HTTPS administration is allowed on port2, but `admin-sport` moved the GUI to TCP 8443, so the administrator must browse to `https://10.0.1.1:8443`. SSH and HTTPS administration can be enabled on the same interface. Administrative access to the FortiGate's own interface is local-in traffic controlled by `allowaccess`, not by a forwarding policy. Non-standard admin ports are fully supported.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-006',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "An administrator manages a remote FortiGate over the internet and wants to reset its configuration to factory defaults without losing remote access. Which command should be used?",
    options: [
      "execute reboot factory-keep-interfaces",
      "execute factoryreset2",
      "execute restore config factory",
      "execute factoryreset",
    ],
    answer: [1],
    explanation: "`execute factoryreset2` resets the configuration but keeps VDOM, interface, system settings and static route configuration, so the unit stays reachable. `execute factoryreset` wipes everything, including the WAN IP and default route, and the unit comes back on 192.168.1.99. The other two commands do not exist.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-007',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "A new G-series FortiGate was powered on in a lab and configured over the past week, but never registered. Today the GUI no longer offers to postpone registration and configuration changes are rejected. What is the cause?",
    options: [
      "The unit entered conserve mode because it could not reach FortiGuard",
      "The seven-day setup period for FortiCare registration has expired; the device must be registered before it can be configured",
      "The admin password has expired under the default password policy",
      "The FortiGuard trial license has expired, which disables the configuration database",
    ],
    answer: [1],
    explanation: "Newer FortiGate hardware enforces FortiCare registration: from first power-on there is a seven-day setup period (counted while powered up). After it ends, the *Postpone registration* option disappears and configuration changes are not allowed until the unit is registered (apart from a limited set of settings, such as interfaces, static routes and DHCP, that let the unit get online to register). A factory reset or firmware restore resets the period. Password policy expiry, FortiGuard status and conserve mode do not produce this behaviour.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-008',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about the administrator account automation is true?",
    exhibit: String.raw`FGT-HQ # show system admin automation
config system admin
    edit "automation"
        set accprofile "prof_admin"
        set vdom "root"
        set disallowed-login-methods gui
        set trusthost1 10.0.50.10 255.255.255.255
        set password ENC SH2...
    next
end`,
    options: [
      "disallowed-login-methods gui blocks only HTTP; HTTPS logins are still accepted",
      "The account can log in from any address because disallowed-login-methods overrides trusted hosts",
      "The account can log in only from 10.0.50.10 and cannot log in through HTTP or HTTPS; it can still use SSH if SSH is allowed on the interface",
      "The account can log in through the GUI from 10.0.50.10, but SSH is blocked",
    ],
    answer: [2],
    explanation: "FortiOS 8.0 adds `disallowed-login-methods {console | gui | ssh | telnet}` per admin. Selecting the GUI method prohibits logins through both HTTP and HTTPS. The trusted host still restricts the account to 10.0.50.10, so the account can log in only over methods that remain, such as SSH, and only from that host. The setting does not override trusted hosts.",
    lesson: '1.1-factory-defaults-admin-access',
  },
  {
    id: 'd1-009',
    topic: '1.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Clients on port2 receive 10.0.1.1 as their DNS server, but every DNS query from them times out. Internet access by IP address works. What is the most likely cause?",
    exhibit: String.raw`FGT-HQ # show system dhcp server 1
config system dhcp server
    edit 1
        set dns-service local
        set default-gateway 10.0.1.1
        set netmask 255.255.255.0
        set interface "port2"
        config ip-range
            edit 1
                set start-ip 10.0.1.100
                set end-ip 10.0.1.199
            next
        end
    next
end

FGT-HQ # show system dns-server
config system dns-server
end`,
    options: [
      "A firewall policy from port2 to port2 for DNS is missing",
      "dns-service local hands out the DNS servers configured under config system dns, so the system DNS servers are unreachable",
      "dns-service local hands out the interface IP, but no DNS server (forwarding or recursive) is enabled on port2 to answer the queries",
      "The DHCP server needs dns-server1 configured whenever dns-service is local",
    ],
    answer: [2],
    explanation: "`dns-service local` gives clients the FortiGate interface IP (10.0.1.1) as their DNS server. The FortiGate answers DNS on an interface only when a DNS server is enabled on it under `config system dns-server` (for example forwarding mode); here that table is empty, so queries go unanswered. Handing out the system DNS servers is what `dns-service default` does. `dns-server1` is used with `dns-service specify`. DNS to the FortiGate itself is local-in traffic, not a forwarding policy.",
    lesson: '1.1-fortiguard-dhcp',
  },
  {
    id: 'd1-010',
    topic: '1.1',
    type: 'fill',
    difficulty: 2,
    stem: "What is the default DHCP lease time, in seconds, of a FortiGate DHCP server when lease-time is not changed? Enter the number.",
    answer: ['604800', '604,800'],
    explanation: "The default `lease-time` is 604800 seconds (seven days). Many administrators shorten it on guest or busy networks so addresses are recycled faster.",
    lesson: '1.1-fortiguard-dhcp',
  },
  {
    id: 'd1-011',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Several new devices on port2 fail to obtain an IP address, while existing devices keep working. What is the cause?",
    exhibit: String.raw`FGT-Branch # show system dhcp server 1
config system dhcp server
    edit 1
        set dns-service default
        set default-gateway 10.0.5.1
        set netmask 255.255.255.0
        set interface "port2"
        config ip-range
            edit 1
                set start-ip 10.0.5.100
                set end-ip 10.0.5.109
            next
        end
    next
end

FGT-Branch # execute dhcp lease-list port2
port2
  IP              MAC-Address        Hostname          Expiry
  10.0.5.100      00:0c:29:1a:00:01  POS-01            Wed Nov  4 08:10:12 2026
  10.0.5.101      00:0c:29:1a:00:02  POS-02            Wed Nov  4 08:11:40 2026
  10.0.5.102      00:0c:29:1a:00:03  LAPTOP-07         Wed Nov  4 09:02:55 2026
  10.0.5.103      00:0c:29:1a:00:04  PRN-01            Wed Nov  4 09:15:03 2026
  10.0.5.104      00:0c:29:1a:00:05  PHONE-11          Wed Nov  4 09:20:47 2026
  10.0.5.105      00:0c:29:1a:00:06  PHONE-12          Wed Nov  4 09:21:02 2026
  10.0.5.106      00:0c:29:1a:00:07  TABLET-02         Wed Nov  4 10:44:18 2026
  10.0.5.107      00:0c:29:1a:00:08  CAM-01            Wed Nov  4 10:59:31 2026
  10.0.5.108      00:0c:29:1a:00:09  CAM-02            Wed Nov  4 11:00:07 2026
  10.0.5.109      00:0c:29:1a:00:0a  LAPTOP-09         Wed Nov  4 11:30:26 2026`,
    options: [
      "dns-service default prevents the server from answering DHCP Discover messages from new clients",
      "The default gateway must be outside the DHCP range for new clients to be accepted",
      "The ten-address range is fully leased, so the server has no free addresses to offer",
      "DHCP requires a firewall policy from port2 to port2 for UDP 67 and 68",
    ],
    answer: [2],
    explanation: "The range 10.0.5.100-10.0.5.109 holds ten addresses and all ten are leased (default seven-day leases), so new clients get no offer. Extend the range, shorten `lease-time`, or clear stale leases with `execute dhcp lease-clear`. `dns-service` only affects the DNS servers handed out. The gateway 10.0.5.1 is already outside the range. DHCP to the FortiGate is local traffic, not a forwarding policy.",
    lesson: '1.1-fortiguard-dhcp',
  },
  {
    id: 'd1-012',
    topic: '1.1',
    type: 'single',
    difficulty: 1,
    stem: "Which entitlement must be valid for a FortiGate to be eligible for firmware upgrades and technical support from Fortinet?",
    options: [
      "FortiGuard IPS",
      "FortiGuard Web Filtering",
      "The FortiGate-VM permanent trial license",
      "FortiCare support",
    ],
    answer: [3],
    explanation: "Firmware access, technical support and hardware RMA are FortiCare entitlements. FortiGuard subscriptions such as IPS and web filtering provide signatures and ratings, not firmware rights. The VM trial license gives no FortiGuard services and no support contract.",
    lesson: '1.1-fortiguard-dhcp',
  },
  {
    id: 'd1-013',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about FortiGuard service bundles are true? (Choose two.)",
    options: [
      "The Enterprise Protection bundle contains fewer services than UTP but adds 24x7 support",
      "Each FortiGuard bundle includes FortiCare Premium support",
      "A FortiGuard bundle is required before firewall policies can accept traffic",
      "The Unified Threat Protection (UTP) bundle includes the services of the Advanced Threat Protection (ATP) bundle plus web, DNS and video filtering",
      "A FortiGuard bundle is licensed per FortiCloud account and shared by every FortiGate registered to that account",
    ],
    answer: [1, 3],
    explanation: "The bundles stack: ATP (IPS, anti-malware, application control) < UTP (adds web/DNS/video filtering and antispam) < Enterprise Protection (adds advanced services), and every bundle includes FortiCare Premium. Bundles are bought for a specific FortiGate (its serial number), not pooled across a FortiCloud account. Firewall policies, NAT, routing and VPN work without any FortiGuard license. Enterprise Protection is the largest bundle, not a smaller one.",
    lesson: '1.1-fortiguard-dhcp',
  },
  {
    id: 'd1-014',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit (partial output) taken on 2026-10-29. What does the output indicate?",
    exhibit: String.raw`FGT-HQ # diagnose autoupdate versions
...
Virus Definitions
---------
Version: 93.06112 signed
Contract Expiry Date: Wed Sep 30 2026
Last Updated using scheduled update on Wed Sep 30 2026 22:04:13
Last Update Attempt: Thu Oct 29 06:02:40 2026
Result: No Updates

IPS Attack Engine
---------
Version: 8.00028 signed
Contract Expiry Date: Sat Sep 30 2028
Last Updated using scheduled update on Mon Oct 26 06:01:55 2026
Last Update Attempt: Thu Oct 29 06:02:40 2026
Result: No Updates
...`,
    options: [
      "Antivirus scanning stops completely the day after the contract expires",
      "The antivirus contract expired on September 30, so the FortiGate keeps trying to update but receives no new virus definitions",
      "The FortiGate cannot reach FortiGuard at all, because no package has updated since September",
      "The IPS contract has expired, so IPS signatures are no longer updated",
    ],
    answer: [1],
    explanation: "The virus definitions contract expired on 2026-09-30 and the definitions were last updated that day; daily attempts continue but return no updates. The IPS engine was updated on October 26 and its contract runs to 2028, so FortiGuard is reachable and IPS is licensed. When AV expires, the FortiGate keeps scanning with the last downloaded definitions; it simply stops receiving new ones.",
    lesson: '1.1-fortiguard-dhcp',
  },
  {
    id: 'd1-015',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An administrator tries to restore this backup file onto a replacement FortiGate 200F and the restore is rejected. What is the most likely reason?",
    exhibit: String.raw`#config-version=FG100F-7.06-FW-build3652-260212:opmode=0:vdom=0:user=admin
#conf_file_ver=2211904771630552
#buildno=3652
#global_vdom=1
config system global
    set hostname "FGT-Branch"
...`,
    options: [
      "The file was created on a FortiGate 100F, and a configuration file can only be restored onto the same model",
      "VDOMs are disabled in the file but enabled by default on the 200F",
      "The file is encrypted and no password was supplied",
      "The file is from FortiOS 7.6, and an 8.0 FortiGate cannot restore any 7.6 configuration",
    ],
    answer: [0],
    explanation: "The header's `config-version` begins with `FG100F`, the model that created it. FortiOS restores a full configuration only onto the same model. Restoring an older-release configuration onto newer firmware is supported (it is converted on load). An encrypted backup is not readable plain text like this. VDOMs are not enabled by default on any model.",
    lesson: '1.1-backup-firmware-fortiai',
  },
  {
    id: 'd1-016',
    topic: '1.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each FortiOS command to its effect.",
    pairs: [
      ['execute factoryreset', 'Erases the whole configuration and reboots with factory defaults'],
      ['execute factoryreset2', 'Resets to defaults but keeps interface, VDOM, system settings and static route configuration'],
      ['execute backup config tftp FGT.conf 10.0.1.50 P@ss1', 'Saves an encrypted configuration file to a TFTP server'],
      ['execute restore config tftp FGT.conf 10.0.1.50 P@ss1', 'Replaces the running configuration from a file and reboots'],
      ['execute restore image tftp FGT_VM64-v8.0.2.F-build0201-FORTINET.out 10.0.1.50', 'Installs a firmware image from a TFTP server'],
    ],
    explanation: "`factoryreset` wipes everything; `factoryreset2` keeps what you need for management access. On `execute backup config` the optional last argument is the encryption password, and the same password is required by `execute restore config`, which overwrites the configuration and reboots. `execute restore image` loads firmware.",
    lesson: '1.1-backup-firmware-fortiai',
  },
  {
    id: 'd1-017',
    topic: '1.1',
    type: 'order',
    difficulty: 2,
    stem: "Place the steps for upgrading a standalone FortiGate from FortiOS 7.6 to 8.0 in the recommended order.",
    items: [
      "Identify the required intermediate builds with the Upgrade Path Tool and read their release notes",
      "Back up the configuration (encrypted) and record the current build",
      "Install each build in the upgrade path in sequence during the maintenance window",
      "Verify the final version with get system status and test traffic and logging",
    ],
    explanation: "Plan first (Upgrade Path Tool and the release notes for each step), protect yourself with a backup, then upgrade through each required build in order, and finally verify. The backup is what you restore if you must go back, because downgrading does not convert the configuration back.",
    lesson: '1.1-backup-firmware-fortiai',
  },
  {
    id: 'd1-018',
    topic: '1.1',
    type: 'single',
    difficulty: 2,
    stem: "A help-desk administrator whose admin profile is read-only for Firewall asks FortiAI-Assist to create a policy allowing port2 to port1. FortiAI returns the CLI commands. What happens when the administrator tries to run them in CLI Code Lab?",
    options: [
      "The commands fail, because FortiAI acts through the REST API with the logged-in administrator's own permissions",
      "The commands succeed, because FortiAI runs changes as super_admin",
      "The commands succeed, because CLI Code Lab bypasses admin profiles for generated scripts",
      "FortiAI refuses to generate commands for any administrator who is not super_admin",
    ],
    answer: [0],
    explanation: "FortiAI calls the FortiOS REST APIs with the same permissions as the logged-in administrator, so a read-only Firewall profile cannot commit a policy. FortiAI does not elevate privileges and CLI Code Lab does not bypass the profile. Generating commands is allowed for any admin whose profile permits the AI assistant (`gui-ai-assistant enable`).",
    lesson: '1.1-backup-firmware-fortiai',
  },
  {
    id: 'd1-019',
    topic: '1.1',
    type: 'multi',
    difficulty: 2,
    stem: "Which two requirements apply to using FortiAI-Assist on a FortiGate hardware appliance running FortiOS 8.0? (Choose two.)",
    options: [
      "A local GPU module installed in the FortiGate",
      "Internet access from the FortiGate",
      "A model with more than 2 GB of RAM and FortiCare Premium support",
      "A FortiAnalyzer registered to the FortiGate to store chat history",
      "An OpenAI API key, because FortiAI cannot be used as the provider on hardware",
    ],
    answer: [1, 2],
    explanation: "The 8.0 documentation requires hardware with more than 2 GB RAM and FortiCare Premium (models with 2 GB or less are not supported), and the FortiGate must reach the internet because the AI provider is a cloud service. No local GPU is involved. FortiAI is the default provider; OpenAI is optional with your own key. FortiAnalyzer is not required.",
    lesson: '1.1-backup-firmware-fortiai',
  },
  {
    id: 'd1-020',
    topic: '1.1',
    type: 'fill',
    difficulty: 3,
    stem: "In FortiOS 8.0, which attribute under `config system accprofile` enables or disables an admin profile's ability to submit queries to the FortiAI assistant? Enter the attribute name.",
    answer: ['gui-ai-assistant', 'set gui-ai-assistant'],
    explanation: "`set gui-ai-assistant {enable | disable}` is the CLI form of *Allow using AI Assistant* in an admin profile (default `disable`). When disabled the FortiAI icon still appears, but the administrator cannot submit queries. It can be changed on `prof_admin` but not on `super_admin`.",
    lesson: '1.1-backup-firmware-fortiai',
  },
  {
    id: 'd1-021',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What does this log entry show?",
    exhibit: String.raw`date=2026-10-29 time=11:20:44 logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root"
srcip=10.0.1.10 srcport=53114 srcintf="port2" srcintfrole="lan"
dstip=192.0.2.80 dstport=3389 dstintf="port1" dstintfrole="wan"
sessionid=220917 proto=6 action="deny" policyid=0 policytype="policy"
service="RDP" trandisp="noop" duration=0 sentbyte=0 rcvdbyte=0 sentpkt=0`,
    options: [
      "An IPS sensor blocked the session because RDP is a high-risk service",
      "Firewall policy 0, configured by the administrator with action deny, blocked the session",
      "The session was allowed but the RDP server did not respond",
      "No configured firewall policy matched the RDP session, so the implicit deny dropped it",
    ],
    answer: [3],
    explanation: "`policyid=0` with `action=deny` is the **implicit deny** at the end of the policy list: nothing matched port2 to port1 for this traffic. Administrator-created policies cannot have ID 0. An allowed session would show a real policy ID and an action such as `close` or `timeout`. A security profile block would generate a security (UTM) log, and the traffic log would carry the matching policy ID and UTM fields.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-022',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users browse through policy 1 all day, but the Forward Traffic log shows only a handful of entries for policy 1. Why?",
    exhibit: String.raw`FGT-HQ # show firewall policy 1
config firewall policy
    edit 1
        set name "LAN-to-Internet"
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "LAN-10.0.1.0"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set utm-status enable
        set ssl-ssh-profile "certificate-inspection"
        set webfilter-profile "default"
        set logtraffic utm
        set nat enable
    next
end`,
    options: [
      "With logtraffic utm, only sessions in which a security profile generated an event are logged",
      "Traffic logs are written only for sessions that are denied",
      "Forward traffic logs are only kept in memory and are cleared every hour",
      "Certificate inspection disables traffic logging for HTTPS sessions",
    ],
    answer: [0],
    explanation: "`set logtraffic utm` (the default) logs only sessions where a security profile produced an event, such as a web filter block or warning. To log every session, use `set logtraffic all`. Memory logs are not cleared hourly. Allowed traffic is logged when configured. The SSL inspection mode does not disable logging.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-023',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: "An administrator wants traffic dropped by the implicit deny policy to appear in the Forward Traffic log. Which two methods achieve this? (Choose two.)",
    options: [
      "In the GUI policy list, edit the implicit deny policy and enable Log Violation Traffic",
      "Set logtraffic all on every existing accept policy",
      "Raise the log severity filter to debug",
      "Enable disk logging with config log disk setting",
      "In the CLI, run config log setting and set fwpolicy-implicit-log enable",
    ],
    answer: [0, 4],
    explanation: "The implicit deny does not log by default. *Log Violation Traffic* on the implicit deny policy and `set fwpolicy-implicit-log enable` under `config log setting` are the GUI and CLI forms of the same switch. `logtraffic all` on accept policies logs sessions those policies accept, not implicit-deny drops. Enabling a storage location or changing the severity filter does not make the implicit deny generate logs.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-024',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator has just configured FortiAnalyzer logging on FGT-Branch. What must be done next for FortiAnalyzer to store the FortiGate's logs?",
    exhibit: String.raw`FGT-Branch # execute log fortianalyzer test-connectivity
FortiAnalyzer Host Name: FAZ-HQ
FortiAnalyzer Adom Name:
FortiGate Device ID: FGT60FTK26004411
Registration: unregistered
Connection: deny
Adom Disk Space (Used/Allocated): 0B/0B
Log: Tx & Rx (log not received)`,
    options: [
      "On FortiAnalyzer, authorize the FortiGate from the unauthorized devices list in Device Manager and assign it to an ADOM",
      "On the FortiGate, enable disk logging so logs can be buffered",
      "Open UDP 514 on the FortiAnalyzer, because OFTP registration uses UDP",
      "On the FortiGate, change upload-option to realtime",
    ],
    answer: [0],
    explanation: "The FortiGate reaches FortiAnalyzer (it reports the host name) but is `unregistered` with `Connection: deny` and no ADOM: it is waiting as an unauthorized device. An administrator must authorize it on FortiAnalyzer (Device Manager) into an ADOM. The upload option controls timing, not acceptance. OFTP runs over TCP 514. Disk logging is not required.",
    lesson: '1.2-fortianalyzer',
  },
  {
    id: 'd1-025',
    topic: '1.2',
    type: 'fill',
    difficulty: 1,
    stem: "FortiGate communicates with FortiAnalyzer using OFTP. Which TCP port must be open between them? Enter the port number.",
    answer: ['514', 'tcp 514', 'tcp/514'],
    explanation: "OFTP (Fortinet's FortiGate-to-FortiAnalyzer protocol) uses **TCP 514** for registration, status and (with `set reliable enable`) the log stream; with `reliable` disabled the log data itself is sent over UDP 514, but TCP 514 must still be open. Testing it with `execute telnet <faz-ip> 514` from the FortiGate is a quick reachability check.",
    lesson: '1.2-fortianalyzer',
  },
  {
    id: 'd1-026',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Branch is a model without a local log disk. Which change makes this configuration work as intended?",
    exhibit: String.raw`FGT-Branch # show log fortianalyzer setting
config log fortianalyzer setting
    set status enable
    set server "10.0.20.15"
    set upload-option store-and-upload
    set upload-interval daily
    set upload-time 01:00
end`,
    options: [
      "Add a second FortiAnalyzer, because store-and-upload requires two servers",
      "Set upload-interval to hourly, because daily uploads are only supported on FortiAnalyzer Cloud",
      "Change the server to an FQDN, because store-and-upload does not accept IP addresses",
      "Change upload-option to realtime, 1-minute or 5-minute, because store-and-upload first writes logs to the local disk",
    ],
    answer: [3],
    explanation: "`store-and-upload` logs to the local disk and uploads on a schedule, so it needs a disk. On a diskless model use `realtime`, `1-minute` or `5-minute` uploads. The server can be an IP or FQDN, daily scheduling is not cloud-only, and a single FortiAnalyzer is fine.",
    lesson: '1.2-fortianalyzer',
  },
  {
    id: 'd1-027',
    topic: '1.2',
    type: 'order',
    difficulty: 2,
    stem: "Place the steps for registering a FortiGate on FortiAnalyzer, starting from the FortiGate side, in the correct order.",
    items: [
      "On the FortiGate, enable FortiAnalyzer logging and enter the FortiAnalyzer IP address",
      "On the FortiGate, verify and accept the FortiAnalyzer certificate and serial number",
      "On FortiAnalyzer, find the FortiGate in Device Manager as an unauthorized device",
      "On FortiAnalyzer, authorize the device and assign it to an ADOM",
      "On the FortiGate, run test-connectivity and confirm Registration: registered and Connection: allow",
    ],
    explanation: "The FortiGate initiates the OFTP connection, the administrator confirms the FortiAnalyzer's identity, the FortiGate then appears as unauthorized on FortiAnalyzer, an administrator authorizes it into an ADOM, and the connection test confirms it. Pre-adding the device by serial number on FortiAnalyzer removes the manual authorization step.",
    lesson: '1.2-fortianalyzer',
  },
  {
    id: 'd1-028',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which logs does the final command display?",
    exhibit: String.raw`FGT-HQ # execute log filter reset
FGT-HQ # execute log filter category 0
FGT-HQ # execute log filter field srcip 10.0.1.10
FGT-HQ # execute log filter field dstport 443
FGT-HQ # execute log display`,
    options: [
      "Traffic logs from source 10.0.1.10 to destination port 443",
      "Web filter logs only, because port 443 is HTTPS",
      "Event logs generated by the administrator logged in from 10.0.1.10",
      "All logs of every category involving 10.0.1.10, because field filters override the category",
    ],
    answer: [0],
    explanation: "Category 0 is traffic; the two field filters narrow it to `srcip=10.0.1.10` and `dstport=443`, read from the currently selected log device. Category 1 would be event logs. Field filters refine, not replace, the category. Web filter logs are a different (security) category.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-029',
    topic: '1.2',
    type: 'single',
    difficulty: 2,
    stem: "A syslog destination on the FortiGate has its log filter severity set to warning. Which log messages are sent to it?",
    options: [
      "Messages at warning, error, critical, alert and emergency levels",
      "Messages at warning level only",
      "Messages at warning, notification, information and debug levels",
      "Messages at notification and information levels only",
    ],
    answer: [0],
    explanation: "The severity filter is a threshold: the destination receives the selected level and everything more severe. Severity runs emergency > alert > critical > error > warning > notification > information > debug. Traffic logs are logged at notification (notice) level, so a warning threshold also excludes them.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-030',
    topic: '1.2',
    type: 'match',
    difficulty: 2,
    stem: "Match each log destination with the description that fits it best.",
    pairs: [
      ['Memory', 'Small, always available, cleared at reboot'],
      ['Local disk', 'Survives reboots and supports local reports, on models with a disk'],
      ['FortiAnalyzer', 'Central storage and analytics over OFTP; up to three per FortiGate'],
      ['Syslog', 'Up to four servers; formats include CSV, CEF, JSON and, in 8.0, custom'],
      ['FortiGate Cloud', 'Fortinet cloud service for management and logging, with basic retention free'],
    ],
    explanation: "Memory logging is a small temporary buffer. Disk logging persists and enables local historical views on models with storage. FortiAnalyzer (up to three: `fortianalyzer`, `fortianalyzer2`, `fortianalyzer3`) is the central option. Syslog supports up to four servers (`syslogd` to `syslogd4`) and several formats, with custom formats new in 8.0. FortiGate Cloud is Fortinet's hosted management/logging service.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-031',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Users connect to an FTP server at 192.0.2.21 on TCP port 2121. Logins succeed, but directory listings and file transfers hang. All FTP session helper counters stay at zero during the tests. What is the most likely fix?",
    exhibit: String.raw`FGT-HQ # diagnose sys session help stats ftp
PORT Requests: 0
EPRT Requests: 0
PASV Requests: 0
PASV Replies: 0
EPSV Requests: 0
EPSV Replies: 0
RETR Requests: 0
STOR Requests: 0

FGT-HQ # show system session-helper 9
config system session-helper
    edit 9
        set name ftp
        set protocol 6
        set port 21
    next
end`,
    options: [
      "Add a session-helper entry with name ftp, protocol 6 and port 2121 so the FTP helper processes the control channel on that port",
      "Enable session-pickup-expectation, because expectation sessions are disabled on standalone FortiGates",
      "Delete session helper 9, because session helpers block FTP data connections",
      "Change the policy to proxy-based inspection, because session helpers work only in proxy mode",
    ],
    answer: [0],
    explanation: "The FTP helper is bound to TCP 21, so it never sees the control channel on 2121, never reads the PASV/EPSV/PORT negotiation (all counters at zero) and never opens the pinhole for the data connection. Adding a helper entry for port 2121 fixes it. `session-pickup-expectation` is an HA session-sync option. Session helpers work regardless of inspection mode. Deleting the helper would break FTP on port 21 too.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-032',
    topic: '1.2',
    type: 'fill',
    difficulty: 3,
    stem: "In FortiOS 8.0, which complete command shows the session helper statistics for RTSP?",
    answer: ['diagnose sys session help stats rtsp', 'diag sys session help stats rtsp'],
    explanation: "FortiOS 8.0 adds `diagnose sys session help stats {ftp | tftp | rtsp | pptp}`. Note the keyword is `help`, not `helper`. The RTSP output includes streams created and freed, client ports allocated and data sessions created, freed and failed.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-033',
    topic: '1.2',
    type: 'multi',
    difficulty: 2,
    stem: "Which two logging capabilities are new in FortiOS 8.0? (Choose two.)",
    options: [
      "Uploading rolled disk logs to an SFTP server in LZ4 format",
      "OFTP moved from TCP 514 to TCP 443",
      "Custom syslog log formats built with config log custom-format",
      "Support for up to ten FortiAnalyzer servers per VDOM",
      "Removal of memory logging on models with a disk",
    ],
    answer: [0, 2],
    explanation: "8.0 adds custom syslog formats (`config log custom-format`, then `set format custom` and `set custom-log-format`) and secure log upload with SFTP as a destination and standard LZ4 files. FortiOS still supports three FortiAnalyzers, OFTP remains on TCP 514, and memory logging is still available.",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-034',
    topic: '1.2',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. A user reports that a partner website at 198.51.100.40 never loads. What does the log indicate?",
    exhibit: String.raw`date=2026-10-29 time=13:05:18 logid="0000000013" type="traffic" subtype="forward" level="notice" vd="root"
srcip=10.0.1.31 srcport=60218 srcintf="port2" srcintfrole="lan"
dstip=198.51.100.40 dstport=443 dstintf="port1" dstintfrole="wan"
sessionid=331540 proto=6 action="timeout" policyid=1 policytype="policy"
service="HTTPS" trandisp="snat" transip=203.0.113.10 transport=61802
duration=13 sentbyte=180 rcvdbyte=0 sentpkt=3 rcvdpkt=0`,
    options: [
      "The FortiGate did not apply source NAT, so the server could not reply",
      "Policy 1 denied the session, which is why no bytes were received",
      "Policy 1 allowed and source-NATed the session, but no reply ever came back; the problem is upstream or on the return path",
      "The web filter blocked the site and replaced the page",
    ],
    answer: [2],
    explanation: "`policyid=1`, `trandisp=snat` and `transip=203.0.113.10` show the session was accepted and translated. Three packets were sent and none received (`rcvdbyte=0`, `rcvdpkt=0`), and the session ended with `action=timeout`. The FortiGate forwarded the traffic; the destination, the ISP path or the route back to 203.0.113.10 is the problem. A deny would show `action=deny`, and a web filter block would create a web filter log and return a block page (bytes received).",
    lesson: '1.2-log-workflow-storage',
  },
  {
    id: 'd1-035',
    topic: '1.3',
    type: 'order',
    difficulty: 2,
    stem: "With HA override disabled (the default), place the criteria FGCP uses to select the primary in order, from first evaluated to last.",
    items: [
      "Number of connected (up) monitored interfaces",
      "HA uptime (differences within ha-uptime-diff-margin are treated as equal)",
      "Device priority",
      "Serial number",
    ],
    explanation: "With override disabled, FGCP compares connected monitored interfaces, then HA uptime (with the 300-second default margin), then priority, then the serial number (highest wins). Because uptime comes before priority, a high-priority unit that rejoins later does not take the primary role back.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-036',
    topic: '1.3',
    type: 'order',
    difficulty: 2,
    stem: "With HA override enabled, place the criteria FGCP uses to select the primary in order, from first evaluated to last.",
    items: [
      "Number of connected (up) monitored interfaces",
      "Device priority",
      "HA uptime",
      "Serial number",
    ],
    explanation: "Enabling override moves device priority ahead of HA uptime, so the highest-priority member becomes primary whenever it is available and has as many monitored interfaces up. Monitored interfaces are still evaluated first, and the serial number is still the final tie-breaker.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-037',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-A has priority 200 and FGT-B has the default priority. FGT-A rebooted after a power failure 40 minutes ago and is back in the cluster. Why is FGT-B still the primary?",
    exhibit: String.raw`FGT-B(Primary) # get system ha status
HA Health Status: OK
Model: FortiGate-VM64
Mode: HA A-P
Group Name: HQ-CLUSTER
Group ID: 10
Debug: 0
Cluster Uptime: 21 days 4:15:02
Cluster state change time: 2026-10-29 08:02:37
Primary selected using:
    <2026/10/29 08:02:37> vcluster-1: FGVM02TM26000102 is selected as the primary because it has the largest value of uptime.
    <2026/10/29 07:58:10> vcluster-1: FGVM02TM26000102 is selected as the primary because it's the only member in the cluster.
ses_pickup: enable, ses_pickup_delay=disable
override: disable
Configuration Status:
    FGVM02TM26000102(updated 2 seconds ago): in-sync
    FGVM02TM26000101(updated 3 seconds ago): in-sync
...
Primary     : FGT-B           , FGVM02TM26000102, HA cluster index = 0
Secondary   : FGT-A           , FGVM02TM26000101, HA cluster index = 1`,
    options: [
      "Override is disabled, so HA uptime is compared before priority, and FGT-B has the higher uptime",
      "FGT-A must be rebooted a second time to apply its priority",
      "FGT-A's configuration is out of sync, so it cannot become primary",
      "Priority is only compared when both units have the same serial number prefix",
    ],
    answer: [0],
    explanation: "With `override: disable`, the order is monitored interfaces, uptime, priority, serial. When FGT-A rebooted, FGT-B became the only member and then kept the role because its HA uptime exceeds FGT-A's by more than the 300 s margin. To make FGT-A always primary, enable override on both members. Both members are in sync. Serial numbers are the last tie-breaker, and rebooting FGT-A again would only reset its uptime.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-038',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Two separate FGCP clusters are connected to the same switches and VLANs. After the second cluster is installed, hosts lose connectivity intermittently and the switches log MAC flapping between the clusters' ports. What is the most likely cause?",
    options: [
      "Both clusters use the same HA group ID, so they generate the same virtual MAC addresses",
      "Both clusters use active-passive mode",
      "Both clusters use port3 as their heartbeat interface",
      "Both clusters use the same HA password",
    ],
    answer: [0],
    explanation: "FGCP virtual MAC addresses are derived from the group ID. Two clusters with the same group ID on a shared layer 2 domain present identical MACs, so switches flap between them. Give each cluster a unique group ID. Passwords, mode and heartbeat port names do not affect the virtual MACs.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-039',
    topic: '1.3',
    type: 'multi',
    difficulty: 2,
    stem: "Which three settings are NOT synchronized from the primary to the other members of an FGCP cluster? (Choose three.)",
    options: [
      "Administrator accounts",
      "Host name",
      "HA override",
      "Firewall policies",
      "Static routes",
      "HA device priority",
    ],
    answer: [1, 2, 5],
    explanation: "Host name, HA priority and override are member-specific, as are the reserved management interface settings and in-band management IPs. Firewall policies, routes, objects and administrator accounts are part of the synchronized configuration, which is why changes are made once on the primary.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-040',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "In an FGCP active-active cluster with default settings, which statement about traffic distribution is correct?",
    options: [
      "The primary receives all traffic and load-balances sessions that use security profiles to the secondaries",
      "All TCP sessions, with or without security profiles, are distributed round-robin to all members",
      "The secondaries receive traffic directly from the network and forward only logs to the primary",
      "Each member answers ARP for a different virtual MAC, so the switch distributes traffic between them",
    ],
    answer: [0],
    explanation: "Even in A-A, the primary owns the virtual MACs and receives every packet. By default it distributes sessions that are inspected by security profiles to secondaries; plain firewall sessions stay on the primary unless `load-balance-all` is enabled. Secondaries do not answer ARP for cluster IPs.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-041',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After a failover, users' SSH sessions through the cluster continued, but a long-running UDP video stream and continuous pings restarted. What change would keep those sessions through the next failover?",
    exhibit: String.raw`FGT-A(Primary) # show system ha
config system ha
    set group-id 10
    set group-name "HQ-CLUSTER"
    set mode a-p
    set password ENC ...
    set hbdev "port3" 50 "port4" 50
    set session-pickup enable
    set override disable
    set priority 200
    set monitor "port1" "port2"
end`,
    options: [
      "set override enable",
      "set session-pickup-delay enable",
      "set session-pickup-expectation enable",
      "set session-pickup-connectionless enable",
    ],
    answer: [3],
    explanation: "`session-pickup enable` synchronizes TCP sessions only; UDP and ICMP sessions need `session-pickup-connectionless enable`. `session-pickup-delay` reduces what is synchronized (only sessions older than 30 s). `session-pickup-expectation` covers helper pinholes such as FTP data. Override changes election, not session sync.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-042',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: "Which `config system ha` attribute must be enabled, in addition to session-pickup, so that UDP and ICMP sessions are synchronized? Enter the attribute name.",
    answer: ['session-pickup-connectionless', 'set session-pickup-connectionless enable', 'set session-pickup-connectionless'],
    explanation: "`set session-pickup-connectionless enable` extends session synchronization to connectionless (UDP and ICMP) sessions. It requires `session-pickup enable`.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-043',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user starts a large file download through the cluster, and the primary fails 12 seconds later. What happens to the download?",
    exhibit: String.raw`FGT-A(Primary) # show system ha | grep session
    set session-pickup enable
    set session-pickup-delay enable`,
    options: [
      "It continues, because all TCP sessions are synchronized as soon as they are created",
      "It is interrupted, because with session-pickup-delay only sessions older than 30 seconds are synchronized",
      "It is interrupted, because session pickup never synchronizes TCP sessions",
      "It continues, because session-pickup-delay buffers the session for 30 seconds on the old primary",
    ],
    answer: [1],
    explanation: "`session-pickup-delay enable` synchronizes only sessions that have existed for more than 30 seconds, which cuts sync load from short-lived sessions. A 12-second-old session has not been synchronized, so the new primary has no entry for it and the download must restart. Without the delay option, TCP sessions are synchronized from creation.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-044',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "Session pickup is enabled on an active-passive cluster. Which sessions are still lost when the primary fails?",
    options: [
      "TCP sessions with no security profiles",
      "IPsec VPN tunnels",
      "Sessions being inspected by proxy-based security profiles",
      "TCP sessions inspected by flow-based profiles",
    ],
    answer: [2],
    explanation: "Proxy-based inspection keeps state in the proxy that cannot be synchronized, so those sessions restart after failover. Flow-based and unprofiled TCP sessions are synchronized by session pickup, and IPsec SAs are synchronized so tunnels survive failover.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-045',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Both members are configured this way, each with its own IP on port5. The administrator wants each member to send its own logs to FortiAnalyzer through port5. Which setting is missing?",
    exhibit: String.raw`FGT-A(Primary) # show system ha
config system ha
    set group-id 10
    set group-name "HQ-CLUSTER"
    set mode a-p
    set password ENC ...
    set hbdev "port3" 50 "port4" 50
    set session-pickup enable
    set ha-mgmt-status enable
    config ha-mgmt-interfaces
        edit 1
            set interface "port5"
            set gateway 10.0.99.1
        next
    end
    set override disable
    set priority 200
    set monitor "port1" "port2"
end`,
    options: [
      "set monitor \"port5\"",
      "set hbdev \"port5\" 100",
      "set ha-direct enable",
      "set session-sync-dev \"port5\"",
    ],
    answer: [2],
    explanation: "The reserved management interface is configured, but by default management traffic such as logging still follows the cluster's data interfaces and routing table, not the reserved interface. `set ha-direct enable` makes logging (FortiAnalyzer/syslog), SNMP, RADIUS, NetFlow/sFlow and similar services use each member's reserved management interface. `session-sync-dev` carries session sync, `hbdev` carries heartbeats, and monitoring port5 would make a management link failure trigger failover.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-046',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "An administrator wants to reach the secondary member's GUI without dedicating a physical port to management. port2 on the cluster is 10.0.1.1/24. Which configuration meets the requirement?",
    options: [
      "Add the secondary's serial number as a trusted host on the primary",
      "Configure ha-mgmt-interfaces with port2 on both members",
      "On the primary, set management-ip 172.16.0.12 255.255.255.0 on port2 so it is synchronized to the secondary",
      "On the secondary, set management-ip 10.0.1.12 255.255.255.0 on port2",
    ],
    answer: [3],
    explanation: "An in-band management IP is configured per member on a normal cluster interface and must be in the same subnet as that interface's cluster IP; it is not synchronized. 172.16.0.12 is in the wrong subnet, and setting it on the primary would not give the secondary an address. A reserved management interface must be dedicated (port2 carries traffic). Trusted hosts do not provide reachability.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-047',
    topic: '1.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each HA management method with its description.",
    pairs: [
      ['execute ha manage', 'CLI session to another member over the heartbeat link, no extra IP needed'],
      ['Reserved management interface (ha-mgmt-interfaces)', 'Dedicated port with its own per-member IP and gateway, excluded from sync'],
      ['In-band management-ip', 'Extra per-member IP on a cluster interface, in the same subnet as the cluster IP'],
      ['ha-direct', 'Sends logs, SNMP and similar management traffic out of each member\'s reserved management interface'],
    ],
    explanation: "`execute ha manage <index> <admin>` gives CLI only. A reserved management interface gives full GUI/SSH/SNMP access to each member through a dedicated port. An in-band `management-ip` reuses a traffic interface. `ha-direct` is the option that steers management services through the reserved interface.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-048',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. get system ha status reports FGVM02TM26000102 as out-of-sync. What does the checksum output show?",
    exhibit: String.raw`FGT-A(Primary) # diagnose sys ha checksum cluster

================== FGVM02TM26000101 ==================

is_manage_primary()=1, is_root_primary()=1
debugzone
global: 3e 8a 17 c0 52 9d 04 ff 61 b7 2a 4e 90 d3 18 6c
root: a4 19 7e 02 c8 55 3b e1 0f 92 d6 47 b8 21 6a 9c
all: 6d 02 f1 b8 37 4a c9 15 e0 8b 52 7f 1c a6 d4 30

checksum
global: 3e 8a 17 c0 52 9d 04 ff 61 b7 2a 4e 90 d3 18 6c
root: a4 19 7e 02 c8 55 3b e1 0f 92 d6 47 b8 21 6a 9c
all: 6d 02 f1 b8 37 4a c9 15 e0 8b 52 7f 1c a6 d4 30

================== FGVM02TM26000102 ==================

is_manage_primary()=0, is_root_primary()=0
debugzone
global: 3e 8a 17 c0 52 9d 04 ff 61 b7 2a 4e 90 d3 18 6c
root: 59 c3 0d a8 e6 21 7f 94 b2 3a 08 ce 15 6f 81 d7
all: c8 71 2e 95 0b d4 63 af 1a 7c e9 30 84 5b f2 06

checksum
global: 3e 8a 17 c0 52 9d 04 ff 61 b7 2a 4e 90 d3 18 6c
root: 59 c3 0d a8 e6 21 7f 94 b2 3a 08 ce 15 6f 81 d7
all: c8 71 2e 95 0b d4 63 af 1a 7c e9 30 84 5b f2 06`,
    options: [
      "The global configuration differs, so the HA settings themselves do not match",
      "The global configuration matches; the difference is in the root VDOM configuration",
      "The members run different firmware builds, because the all checksums differ",
      "Both members believe they are primary (split brain)",
    ],
    answer: [1],
    explanation: "The `global` checksums are identical on both members, the `root` checksums differ, and `all` (which covers everything) therefore differs. The mismatch is inside the root VDOM's configuration; `diagnose sys ha checksum show root` on each member narrows it to a table. A different `all` alone does not indicate a firmware difference, and `is_manage_primary()=0` on the second member shows it is not acting as primary.",
    lesson: '1.3-fgcp-operations-upgrade',
  },
  {
    id: 'd1-049',
    topic: '1.3',
    type: 'multi',
    difficulty: 3,
    stem: "A secondary remains out-of-sync after a configuration change. Which two commands are used to resolve stale synchronization? (Choose two.)",
    options: [
      "execute factoryreset2",
      "diagnose sys ha reset-uptime",
      "diagnose sys ha checksum recalculate",
      "execute ha synchronize start",
      "execute ha failover set 1",
    ],
    answer: [2, 3],
    explanation: "`diagnose sys ha checksum recalculate` recomputes the checksums (fixing stale values), and `execute ha synchronize start` (run on the secondary) forces it to resynchronize from the primary. Forcing a failover or resetting uptime changes which unit is primary, possibly making the out-of-sync unit primary. A factory reset is not a sync tool.",
    lesson: '1.3-fgcp-operations-upgrade',
  },
  {
    id: 'd1-050',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator uploads new firmware to the primary of this two-member active-passive cluster. Which sequence occurs?",
    exhibit: String.raw`FGT-A(Primary) # show full-configuration system ha
config system ha
    set group-id 10
    set group-name "HQ-CLUSTER"
    set mode a-p
...
    set session-pickup enable
...
    set override disable
...
    set upgrade-mode uninterruptible
...
end`,
    options: [
      "The secondary upgrades first, then a new primary is selected from the upgraded member, and the former primary upgrades last",
      "Both members upgrade and reboot at the same time",
      "Only the primary upgrades; the secondary must be upgraded separately with execute ha manage",
      "The primary upgrades first while the secondary passes traffic, then the secondary upgrades",
    ],
    answer: [0],
    explanation: "`upgrade-mode uninterruptible` (the default) upgrades the secondaries first; once they are back, a new primary is chosen from the upgraded members and traffic fails over to it; the original primary is upgraded last. With session pickup enabled, established sessions survive. Upgrading all members at once is `simultaneous` mode.",
    lesson: '1.3-fgcp-operations-upgrade',
  },
  {
    id: 'd1-051',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. What is the effect of this setting during a cluster firmware upgrade?",
    exhibit: String.raw`FGT-A(Primary) # show system ha | grep upgrade
    set upgrade-mode simultaneous`,
    options: [
      "Only the secondary members upgrade; the primary keeps the old firmware",
      "Members upgrade one at a time, so traffic is never interrupted",
      "The upgrade is blocked until session pickup is enabled",
      "All members install the firmware and reboot at the same time, interrupting traffic",
    ],
    answer: [3],
    explanation: "`simultaneous` upgrades every member at once. It is faster, but the cluster stops passing traffic while the members reboot. The default `uninterruptible` mode staggers the upgrade to avoid the outage. Neither mode requires session pickup, and simultaneous mode upgrades all members.",
    lesson: '1.3-fgcp-operations-upgrade',
  },
  {
    id: 'd1-052',
    topic: '1.3',
    type: 'fill',
    difficulty: 2,
    stem: "What is the default value, in seconds, of ha-uptime-diff-margin, the HA uptime difference below which FGCP treats two members' uptimes as equal? Enter the number.",
    answer: ['300'],
    explanation: "The default margin is 300 seconds (five minutes). If both members' HA uptimes are within five minutes of each other, the comparison is a tie and priority (then serial number) decides.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-053',
    topic: '1.3',
    type: 'single',
    difficulty: 2,
    stem: "Both members of an FGCP cluster are running, but both now show themselves as primary and both answer ARP for the cluster IPs. What is the most likely cause?",
    options: [
      "A monitored interface failed on the primary",
      "Override was enabled on both members",
      "Session pickup was disabled",
      "All heartbeat links between the members have failed",
    ],
    answer: [3],
    explanation: "When every heartbeat link fails, each member stops hearing the other, assumes it is dead and becomes primary: a split-brain. Use at least two heartbeat links on separate paths. A monitored interface failure causes a normal failover to the other member. Session pickup and override do not affect whether members can see each other.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-054',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit, taken from the primary of a two-member cluster with hbdev \"port3\" 50 \"port4\" 50 and monitor \"port1\" \"port2\". Which statement is true?",
    exhibit: String.raw`HBDEV stats:
    FGVM02TM26000101(updated 1 seconds ago):
        port3: physical/00, down, rx-bytes/packets/dropped/errors=4410293811/11280455/0/0, tx=4581002377/11396012/0/0
        port4: physical/10000full, up, rx-bytes/packets/dropped/errors=1882210/24011/0/0, tx=1901874/24233/0/0
MONDEV stats:
    FGVM02TM26000101(updated 1 seconds ago):
        port1: physical/10000full, up, rx-bytes/packets/dropped/errors=9128833012/12001876/0/0, tx=8811901235/11893420/0/0
        port2: physical/10000full, up, rx-bytes/packets/dropped/errors=8811004331/11873002/0/0, tx=9122937110/11987650/0/0`,
    options: [
      "The cluster has failed over, because a heartbeat interface is down",
      "The cluster is in split-brain, because one heartbeat link is down",
      "The heartbeat continues over port4, so the cluster stays formed and no failover is triggered by the port3 failure",
      "port1 and port2 will be used as heartbeat links automatically",
    ],
    answer: [2],
    explanation: "port3 (which carried most heartbeat traffic) is down, but port4 is up and takes over the heartbeat, which is why redundant heartbeat links are recommended. Heartbeat link loss is not a failover trigger while another heartbeat link works, and split-brain needs all heartbeat links down. Monitored interfaces are not used as heartbeat links unless listed in `hbdev`.",
    lesson: '1.3-fgcp-operations-upgrade',
  },
  {
    id: 'd1-055',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "In a cluster with override disabled, the switch port connected to monitored interface port2 on the primary FGT-A fails, and FGT-B becomes primary. Ten minutes later the switch port is repaired. What happens?",
    options: [
      "FGT-A becomes primary again after the 300-second uptime margin expires",
      "FGT-A becomes primary again immediately, because it has the higher priority",
      "Both units reboot to renegotiate the primary role",
      "FGT-B remains primary, because FGT-A's HA uptime was reset when its monitored interface failed",
    ],
    answer: [3],
    explanation: "A monitored interface failure resets the HA uptime of the member that lost the link. When port2 recovers, both members have equal monitored interfaces up, and FGT-B now has the higher uptime by more than the margin, so it stays primary. Priority would only decide if override were enabled (or uptimes were within the margin). No reboot occurs.",
    lesson: '1.3-fgcp-operations-upgrade',
  },
  {
    id: 'd1-056',
    topic: '1.3',
    type: 'multi',
    difficulty: 1,
    stem: "Which two conditions must be met for two FortiGates to form an FGCP cluster? (Choose two.)",
    options: [
      "Heartbeat interfaces in different routed subnets",
      "Same HA device priority",
      "Same hardware model (or VM type) and same firmware build",
      "Same HA group ID, group name and password",
      "Same host name",
    ],
    answer: [2, 3],
    explanation: "Members must match in model, firmware (and licensing), HA mode, group ID, group name and password. Host names and priorities are member-specific and normally differ. FGCP heartbeat on physical clusters is layer 2 between the members; routed heartbeat is not a requirement (unicast heartbeat exists for clouds).",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-057',
    topic: '1.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Both members have override enabled. FGT-A has priority 200 and FGT-B has priority 150. The administrator changes FGT-A's priority to 100. What happens?",
    exhibit: String.raw`FGT-A(Primary) # get system ha status
HA Health Status: OK
Model: FortiGate-VM64
Mode: HA A-P
Group Name: HQ-CLUSTER
Group ID: 10
...
Primary selected using:
    <2026/10/27 18:44:09> vcluster-1: FGVM02TM26000101 is selected as the primary because it has the largest value of override priority.
ses_pickup: enable, ses_pickup_delay=disable
override: enable
...
Primary     : FGT-A           , FGVM02TM26000101, HA cluster index = 1
Secondary   : FGT-B           , FGVM02TM26000102, HA cluster index = 0`,
    options: [
      "Nothing changes, because FGT-A has the higher HA uptime",
      "Nothing changes until FGT-A is rebooted, because priority is read only at boot",
      "The cluster renegotiates and FGT-B becomes primary, because with override enabled priority is compared before uptime",
      "The change is synchronized to FGT-B, so both have priority 100 and the serial number decides",
    ],
    answer: [2],
    explanation: "With override enabled the election uses monitored interfaces, then priority. Lowering FGT-A to 100 below FGT-B's 150 makes FGT-B win, so the cluster fails over. Uptime is only considered after priority when override is enabled. Priority changes take effect without a reboot, and priority is not synchronized between members.",
    lesson: '1.3-fgcp-fundamentals',
  },
  {
    id: 'd1-058',
    topic: '1.3',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. An administrator connects with SSH to 10.0.1.12 on a FortiOS 8.0 cluster. What does the prompt tell the administrator?",
    exhibit: String.raw`admin@lab:~$ ssh admin@10.0.1.12
admin@10.0.1.12's password:
FGT-B(Secondary) #`,
    options: [
      "The role is shown because override is enabled; without override the prompt shows only the host name",
      "The session is on the primary, and FGT-B is the name of the cluster",
      "FGT-B is in standalone mode and has left the cluster",
      "The session is on FGT-B, which currently holds the secondary role",
    ],
    answer: [3],
    explanation: "FortiOS 8.0 shows the member's current HA role in the CLI prompt after the host name, for example `FGT-A(Primary) #` and `FGT-B(Secondary) #`, and updates it after a failover. 10.0.1.12 here is FGT-B's in-band management IP. The role display does not depend on override.",
    lesson: '1.3-fgcp-config-sessions-mgmt',
  },
  {
    id: 'd1-059',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Why is the traffic dropped?",
    exhibit: String.raw`id=65308 trace_id=1 func=print_pkt_detail line=6012 msg="vd-root:0 received a packet(proto=6, 10.0.1.10:50112->192.0.2.80:3389) tun_id=0.0.0.0 from port2. flag [S], seq 2216340012, ack 0, win 64240"
id=65308 trace_id=1 func=init_ip_session_common line=6198 msg="allocate a new session-0003b1c2"
id=65308 trace_id=1 func=iprope_dnat_check line=5480 msg="in-[port2], out-[]"
id=65308 trace_id=1 func=iprope_dnat_check line=5492 msg="result: skb_flags-02000000, vid-0, ret-no-match, act-accept, flag-00000000"
id=65308 trace_id=1 func=vf_ip_route_input_common line=2612 msg="find a route: flag=04000000 gw-203.0.113.1 via port1"
id=65308 trace_id=1 func=__iprope_fwd_check line=811 msg="in-[port2], out-[port1], skb_flags-02000000, vid-0, app_id: 0, url_cat_id: 0"
id=65308 trace_id=1 func=fw_forward_handler line=852 msg="Denied by forward policy check (policy 0)"`,
    options: [
      "The reverse path check failed for 10.0.1.10",
      "No firewall policy from port2 to port1 matches the session, so the implicit deny drops it",
      "Policy 0 is an explicit deny policy that the administrator created for RDP",
      "There is no route to 192.0.2.80",
    ],
    answer: [1],
    explanation: "The route lookup succeeded (`find a route ... via port1`), and the policy check from port2 to port1 found nothing: `Denied by forward policy check (policy 0)` means the implicit deny. An explicit deny policy would show its own ID. A reverse path failure prints `reverse path check fail, drop`.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-060',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Hosts in 10.0.7.0/24 behind a new router on port3 cannot reach anything through FGT-HQ. What is the most likely cause?",
    exhibit: String.raw`FGT-HQ # diagnose debug flow trace start 5
FGT-HQ # diagnose debug enable
id=65308 trace_id=12 func=print_pkt_detail line=6012 msg="vd-root:0 received a packet(proto=1, 10.0.7.20:1->198.51.100.20:2048) tun_id=0.0.0.0 from port3. type=8, code=0, id=1, seq=1."
id=65308 trace_id=12 func=init_ip_session_common line=6198 msg="allocate a new session-0003c004"
id=65308 trace_id=12 func=ip_route_input_slow line=1408 msg="reverse path check fail, drop"`,
    options: [
      "There is no firewall policy from port3 to port1",
      "FGT-HQ has no route back to 10.0.7.0/24 through port3, so the reverse path (RPF) check fails",
      "The ICMP session helper is missing",
      "Port3 is not in the allowaccess list for ping",
    ],
    answer: [1],
    explanation: "`reverse path check fail, drop` means the FortiGate has no route to the packet's source (10.0.7.20) out of the interface it arrived on (port3). Add a static route for 10.0.7.0/24 via the new router on port3. A missing policy would show `Denied by forward policy check`. ICMP does not use a session helper, and `allowaccess` controls traffic to the FortiGate itself, not transit traffic.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-061',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users at 10.0.1.10 report they cannot ping 198.51.100.20. What can the administrator conclude?",
    exhibit: String.raw`FGT-HQ # diagnose sniffer packet any 'host 198.51.100.20 and icmp' 4 6 l
interfaces=[any]
filters=[host 198.51.100.20 and icmp]
2026-10-29 10:02:11.481203 port2 in 10.0.1.10 -> 198.51.100.20: icmp: echo request
2026-10-29 10:02:11.481290 port1 out 203.0.113.10 -> 198.51.100.20: icmp: echo request
2026-10-29 10:02:12.482017 port2 in 10.0.1.10 -> 198.51.100.20: icmp: echo request
2026-10-29 10:02:12.482081 port1 out 203.0.113.10 -> 198.51.100.20: icmp: echo request
2026-10-29 10:02:13.483355 port2 in 10.0.1.10 -> 198.51.100.20: icmp: echo request
2026-10-29 10:02:13.483419 port1 out 203.0.113.10 -> 198.51.100.20: icmp: echo request
6 packets received by filter
0 packets dropped by kernel`,
    options: [
      "No firewall policy allows the traffic, so the FortiGate drops the requests",
      "The FortiGate is forwarding and source-NATing the requests, but no replies arrive; the problem is beyond the FortiGate",
      "The sniffer filter is wrong, so it cannot show the replies",
      "The FortiGate is not applying NAT, so the replies are being sent to 10.0.1.10 directly",
    ],
    answer: [1],
    explanation: "Each request arrives on port2 and leaves port1 translated to 203.0.113.10, so a policy with NAT is matching and the FortiGate routes correctly. No `echo reply` comes back in on port1. The destination, the ISP, or a return path to 203.0.113.10 is the issue. The filter `host 198.51.100.20 and icmp` would match replies too.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-062',
    topic: '1.4',
    type: 'fill',
    difficulty: 1,
    stem: "Which diagnose sniffer packet verbosity level prints packet headers together with the interface name and direction, but no packet data? Enter the number.",
    answer: ['4'],
    explanation: "Verbosity 4 shows headers with the interface name and direction (`port2 in`, `port1 out`). Level 1 is headers only, 5 adds IP data, and 6 adds Ethernet data, both with interface names.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-063',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "An administrator needs a FortiGate packet capture from the CLI that can be converted into a pcap file for Wireshark, including Ethernet headers and interface names. Which verbosity level should be used?",
    options: ["1", "4", "3", "6"],
    answer: [3],
    explanation: "Verbosity 6 includes headers, full Ethernet data and the interface name, which is what conversion tools need to rebuild a pcap. Level 3 has Ethernet data without the interface name, level 4 has no packet data, and level 1 has headers only.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-064',
    topic: '1.4',
    type: 'order',
    difficulty: 2,
    stem: "Place the stages of a clean, filtered debug flow capture in the correct order.",
    items: [
      "Clear previous debug settings with diagnose debug reset",
      "Define the filter, for example diagnose debug flow filter addr 10.0.1.10",
      "Arm the trace (diagnose debug flow trace start 10) and enable output (diagnose debug enable)",
      "Reproduce the traffic and read the trace",
      "Stop the output with diagnose debug disable",
    ],
    explanation: "Reset first so old filters do not hide or flood the output, then set filters, then arm the trace with a packet count and turn on debug output (nothing prints until `diagnose debug enable`). Generate the traffic, read the result, and disable debug output when finished.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-065',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement best describes the FortiGate's condition?",
    exhibit: String.raw`FGT-HQ # get system performance status
CPU states: 3% user 2% system 0% nice 6% idle 0% iowait 0% irq 89% softirq
CPU0 states: 3% user 2% system 0% nice 6% idle 0% iowait 0% irq 89% softirq
Memory: 2055256k total, 905112k used (44.0%), 1018380k free (49.6%), 131764k freeable (6.4%)
Average network usage: 1810344 / 1792210 kbps in 1 minute, 1702283 / 1689018 kbps in 10 minutes, 802113 / 790442 kbps in 30 minutes
Average sessions: 1904 sessions in 1 minute, 1877 sessions in 10 minutes, 1650 sessions in 30 minutes
Average session setup rate: 9 sessions per second in last 1 minute, 8 sessions per second in last 10 minutes, 7 sessions per second in last 30 minutes
Virus caught: 0 total in 1 minute
IPS attacks blocked: 0 total in 1 minute
Uptime: 2 days,  3 hours,  10 minutes`,
    options: [
      "A high session setup rate from a SYN flood is consuming the CPU",
      "A user-space process such as ipsengine is consuming most of the CPU",
      "The FortiGate is in conserve mode because memory usage is above the red threshold",
      "CPU is consumed by packet processing (softirq) from high traffic volume, not by inspection daemons or memory pressure",
    ],
    answer: [3],
    explanation: "89% softirq with only 3% user time shows the CPU busy handling packets in the kernel, which matches the ~1.8 Gbps of traffic being handled by the CPU without hardware offload. Memory is 44% used, far below the 88% red threshold. User-space daemons like `ipsengine` would show as user CPU. The session setup rate (9/s) is low, which argues against a flood.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-066',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which change is most likely to reduce CPU usage?",
    exhibit: String.raw`FGT-HQ # diagnose sys top 5 20
Run Time:  9 days, 6 hours and 42 minutes
84U, 0N, 9S, 7I, 0WA, 0HI, 0SI, 0ST; 2007T, 583F
       ipsengine      312      R <    76.9     9.8
            wad      288      S       3.1     6.8
        miglogd      201      S       2.0     2.4
         httpsd      276      S       0.8     1.9
         newcli    18810      R       0.4     0.6`,
    options: [
      "Narrow the IPS sensors to the operating systems and services actually present instead of all signatures",
      "Close idle administrator GUI sessions",
      "Disable session pickup",
      "Change logtraffic from all to utm on busy policies",
    ],
    answer: [0],
    explanation: "`ipsengine` (the IPS and flow-inspection engine) uses about 77% CPU, while `miglogd` (logging) and `httpsd` (GUI) are minor. Reducing the IPS workload, for example by filtering sensors to relevant targets and OSes, addresses the actual consumer. Logging and GUI changes would barely help. Session pickup is an HA setting and is not the cause here.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-067',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Memory usage later drops to 85% of total RAM. Assuming default thresholds, what is the FortiGate's state at that point?",
    exhibit: String.raw`FGT-HQ # diagnose hardware sysinfo conserve
memory conserve mode:                        on
total RAM:                                   2007 MB
memory used:                                 1792 MB   89% of total RAM
memory freeable:                               61 MB    3% of total RAM
memory used + freeable threshold extreme:    1906 MB   95% of total RAM
memory used threshold red:                   1766 MB   88% of total RAM
memory used threshold green:                 1645 MB   82% of total RAM`,
    options: [
      "Out of conserve mode, because memory is below the red threshold of 88%",
      "Dropping all new sessions, because memory is above the green threshold",
      "Rebooting automatically to clear memory",
      "Still in conserve mode, because it exits only when memory use falls to the green threshold of 82%",
    ],
    answer: [3],
    explanation: "Conserve mode starts at the red threshold (88%) and ends only at the green threshold (82%); the gap prevents flapping. At 85% the unit stays in conserve mode. New sessions are dropped only at the extreme threshold (95%). FortiOS does not reboot to leave conserve mode.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-068',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The FortiGate enters conserve mode while policies use proxy-based antivirus. What happens to new sessions that would be scanned by the antivirus proxy?",
    exhibit: String.raw`FGT-HQ # show full-configuration system global | grep av-failopen
    set av-failopen pass
    set av-failopen-session disable`,
    options: [
      "They are scanned by the flow-based engine instead",
      "They bypass the antivirus proxy and pass without antivirus scanning",
      "They are blocked until the FortiGate leaves conserve mode",
      "They are queued until memory is available, then scanned",
    ],
    answer: [1],
    explanation: "`av-failopen pass` (the default) bypasses the antivirus proxy in conserve mode so traffic keeps flowing uninspected; proxy-dependent profiles are bypassed too. `off` would block new sessions that need the proxy, and `one-shot` would keep bypassing even after conserve mode ends until changed or rebooted. Traffic is not queued or moved to the flow engine. (`av-failopen-session` is a separate option that applies the `av-failopen` action when a proxy's session table is full; it does not change conserve mode behaviour.)",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-069',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The FortiGate is in conserve mode. What happens to new sessions that require flow-based (IPS engine) inspection?",
    exhibit: String.raw`FGT-HQ # show full-configuration ips global | grep fail-open
    set fail-open disable`,
    options: [
      "The IPS engine passes them without scanning",
      "The IPS engine drops them",
      "They are redirected to the antivirus proxy",
      "They are allowed only if av-failopen is set to pass",
    ],
    answer: [1],
    explanation: "With the default `fail-open disable` under `config ips global`, the IPS engine drops new sessions that require flow-based inspection during conserve mode. `fail-open enable` would let new packets through unscanned. `av-failopen` controls the proxy-based antivirus path, not the IPS engine.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-070',
    topic: '1.4',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about FortiOS 8.0 default memory conserve mode thresholds are true? (Choose two.)",
    options: [
      "New sessions are dropped when memory use reaches 90% of total RAM",
      "The red threshold is 80% of total RAM",
      "The FortiGate enters conserve mode when used memory reaches 88% of total RAM",
      "The thresholds can be set anywhere from 10% to 100%",
      "The FortiGate leaves conserve mode when used memory falls to 82% of total RAM",
    ],
    answer: [2, 4],
    explanation: "Defaults: red 88% (enter), green 82% (exit), extreme 95% (drop new sessions). The configurable range is 70 to 97 percent of total RAM. The 8.0 Administration Guide lists the same defaults as earlier releases.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-071',
    topic: '1.4',
    type: 'fill',
    difficulty: 2,
    stem: "Which CLI command displays whether the FortiGate is in memory conserve mode, along with used memory and the red, green and extreme thresholds?",
    answer: ['diagnose hardware sysinfo conserve', 'diag hardware sysinfo conserve', 'diag hard sys conserve', 'diagnose hard sysinfo conserve'],
    explanation: "`diagnose hardware sysinfo conserve` prints the conserve mode state, total RAM, used and freeable memory and the three thresholds in MB and percent.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-072',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Transfers through port1 are slow and the upstream Cisco switch shows rising CRC/FCS input errors on the connected port, which is hard-coded to 100 Mbps full duplex. What is the problem?",
    exhibit: String.raw`FGT-HQ # get system interface physical
== [onboard]
        ==[port1]
                mode: static
                ip: 203.0.113.10 255.255.255.0
                ipv6: ::/0
                status: up
                speed: 100Mbps (Duplex: half)
        ...`,
    options: [
      "The FortiGate interface is administratively down",
      "A duplex mismatch: the switch is fixed at full duplex, so the auto-negotiating FortiGate falls back to half duplex",
      "port1 has no IP address configured",
      "The FortiGate is applying traffic shaping to port1",
    ],
    answer: [1],
    explanation: "When one side is hard-coded and the other auto-negotiates, the auto side cannot detect duplex and falls back to half duplex, producing a mismatch: the half-duplex side backs off and logs late collisions, the full-duplex side logs CRC/FCS errors, and throughput collapses. Set both ends to auto, or both to the same fixed speed and duplex. The interface is up and addressed, and shaping would not change negotiated duplex.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-073',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. An administrator at 198.51.100.77 cannot open the FortiGate GUI on port1 (203.0.113.10). What is the most likely cause?",
    exhibit: String.raw`id=65308 trace_id=31 func=print_pkt_detail line=6012 msg="vd-root:0 received a packet(proto=6, 198.51.100.77:51544->203.0.113.10:443) tun_id=0.0.0.0 from port1. flag [S], seq 1902281533, ack 0, win 64240"
id=65308 trace_id=31 func=init_ip_session_common line=6198 msg="allocate a new session-0003d781"
id=65308 trace_id=31 func=iprope_dnat_check line=5480 msg="in-[port1], out-[]"
id=65308 trace_id=31 func=iprope_dnat_check line=5492 msg="result: skb_flags-02000000, vid-0, ret-no-match, act-accept, flag-00000000"
id=65308 trace_id=31 func=vf_ip_route_input_common line=2612 msg="find a route: flag=80000000 gw-203.0.113.10 via root"
id=65308 trace_id=31 func=iprope_in_check line=503 msg="iprope_in_check() check failed on policy 0, drop"`,
    options: [
      "The HTTPS session helper is disabled",
      "Administrative HTTPS to port1 is not permitted for this source (for example https is missing from port1's allowaccess), so the local-in check drops traffic addressed to the FortiGate itself",
      "A firewall policy from port1 to port1 allowing HTTPS is missing",
      "There is no route back to 198.51.100.77",
    ],
    answer: [1],
    explanation: "The route lookup points to the FortiGate itself (`via root`), so this is local-in traffic, and `iprope_in_check() check failed` shows the local-in check rejected it: HTTPS is not in port1's `allowaccess` (or a local-in policy denies it). Forwarding policies do not control access to the FortiGate's own IPs. A reverse path failure would print `reverse path check fail`. There is no HTTPS session helper; helpers exist for protocols such as FTP, SIP and RTSP.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-074',
    topic: '1.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users on port2 (10.0.1.0/24) cannot reach 198.51.100.20, yet the ping from the FortiGate succeeds. Which conclusion is correct?",
    exhibit: String.raw`FGT-HQ # execute ping-options source 203.0.113.10
FGT-HQ # execute ping-options repeat-count 3
FGT-HQ # execute ping 198.51.100.20
PING 198.51.100.20 (198.51.100.20): 56 data bytes
64 bytes from 198.51.100.20: icmp_seq=0 ttl=55 time=11.8 ms
64 bytes from 198.51.100.20: icmp_seq=1 ttl=55 time=11.6 ms
64 bytes from 198.51.100.20: icmp_seq=2 ttl=55 time=11.7 ms

--- 198.51.100.20 ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max = 11.6/11.7/11.8 ms`,
    options: [
      "The firewall policy from port2 to port1 must be correct, because the ping passed through it",
      "The ISP is blocking ICMP from the FortiGate",
      "The ping proves that source NAT is working for 10.0.1.0/24",
      "Upstream routing from the FortiGate's WAN address works; the users' problem is likely a firewall policy or NAT issue for 10.0.1.0/24",
    ],
    answer: [3],
    explanation: "Pings generated by the FortiGate itself are local-out traffic; they use the routing table but are not matched against forwarding firewall policies, and here they are sourced from the WAN IP. The success proves upstream reachability, so the users' failure points to the policy, NAT or the LAN side. It proves nothing about policy or SNAT for 10.0.1.0/24, and ICMP is clearly not blocked.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-075',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The administrator is investigating why an established SSH connection from 10.0.1.10 to 10.0.30.5 matches the wrong policy, but the trace shows no policy decision. Why?",
    exhibit: String.raw`id=65308 trace_id=4 func=print_pkt_detail line=6012 msg="vd-root:0 received a packet(proto=6, 10.0.1.10:55002->10.0.30.5:22) tun_id=0.0.0.0 from port2. flag [.], seq 3381002211, ack 902211875, win 501"
id=65308 trace_id=4 func=resolve_ip_tuple_fast line=6100 msg="Find an existing session, id-0002f1a0, original direction"
id=65308 trace_id=4 func=npu_handle_session44 line=1301 msg="Trying to offloading session from port2 to port3, skb.npu_flag=00000400 ses.state=00010204 ses.npu_state=0x00000000"
id=65308 trace_id=4 func=ip_session_run_all_tuple line=7712 msg="SNAT 10.0.1.10->10.0.30.1:55002"`,
    options: [
      "Debug flow cannot show policy decisions for TCP traffic",
      "The function-name option must be disabled to see policy IDs",
      "The session was offloaded, so the FortiGate never applied a policy to it",
      "The packets belong to an existing session, so no policy lookup happens; clear the session and trace the new connection's first packets",
    ],
    answer: [3],
    explanation: "`Find an existing session` means the packet matched an entry in the session table; the policy was chosen when the session was created. To see the decision, clear that session (`diagnose sys session filter` then `diagnose sys session clear`) or start a new connection, then trace its first packets. Debug flow shows policy decisions for TCP. Offloading happens after a session is established and allowed by a policy. `function-name` only adds function names to the output.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-076',
    topic: '1.4',
    type: 'match',
    difficulty: 2,
    stem: "Match each debug flow message with its meaning.",
    pairs: [
      ['Denied by forward policy check (policy 0)', 'No policy matched; implicit deny'],
      ['reverse path check fail, drop', 'No route back to the source via the ingress interface'],
      ['iprope_in_check() check failed on policy 0, drop', 'Traffic to the FortiGate itself rejected by local-in checks'],
      ['Find an existing session, id-0002f1a0', 'Packet matched an existing session entry'],
      ['Allowed by Policy-3: SNAT', 'Policy 3 accepted the session with source NAT'],
    ],
    explanation: "These five messages cover most debug flow troubleshooting: implicit deny, RPF failure, local-in drop, existing-session match, and an allowed session with SNAT.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-077',
    topic: '1.4',
    type: 'single',
    difficulty: 3,
    stem: "On a hardware FortiGate with NP7 processors, a sniffer shows only the first few packets of a large file transfer through policy 5, and then nothing, although the transfer completes. What should the administrator do to see the whole session while troubleshooting?",
    options: [
      "Enable session-pickup on the FortiGate",
      "Increase the sniffer verbosity to 6",
      "Use the interface name instead of any in the sniffer command",
      "Temporarily set auto-asic-offload disable on policy 5",
    ],
    answer: [3],
    explanation: "After the first packets, the session is offloaded to the NP processor and its packets no longer pass through the CPU, so the sniffer (and debug flow) cannot see them. Disabling offload on the test policy with `set auto-asic-offload disable` keeps the traffic on the CPU. Verbosity and interface choice do not affect offloading, and session pickup is an HA setting.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-078',
    topic: '1.4',
    type: 'multi',
    difficulty: 2,
    stem: "Which two commands are valid FortiOS packet sniffer commands? (Choose two.)",
    options: [
      "diagnose sniffer packet any host 10.0.1.10 verbose 4",
      "diagnose sniffer packet any 'host 10.0.1.10 and port 443' 4 0 l",
      "diagnose sniffer packet 'host 10.0.1.10' any 4",
      "diagnose debug sniffer port1 'icmp' 4",
      "diagnose sniffer packet port1 'icmp' 1 10",
    ],
    answer: [1, 4],
    explanation: "The syntax is `diagnose sniffer packet <interface> '<filter>' <verbose 1-6> <count> <a|l>`. The first valid command captures on all interfaces at verbosity 4, unlimited count (0), local timestamps; the second captures 10 ICMP packets on port1 at verbosity 1. A filter containing spaces must be quoted and there is no `verbose` keyword; the interface must come before the filter, so `'host 10.0.1.10' any` is wrong; and `diagnose debug sniffer` does not exist.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-079',
    topic: '1.4',
    type: 'fill',
    difficulty: 2,
    stem: "After setting debug flow filters, which command arms the trace for the next 20 matching packets? Enter the full command.",
    answer: ['diagnose debug flow trace start 20', 'diag debug flow trace start 20', 'diag deb flow trace start 20'],
    explanation: "`diagnose debug flow trace start 20` traces the next 20 packets that match the filters. Output appears only after `diagnose debug enable`.",
    lesson: '1.4-sniffer-debug-flow',
  },
  {
    id: 'd1-080',
    topic: '1.4',
    type: 'multi',
    difficulty: 3,
    stem: "A FortiGate enters conserve mode every afternoon. Investigation shows a large number of proxy-inspected sessions and a session table inflated by a misbehaving scanner. Which two actions address the cause? (Choose two.)",
    options: [
      "Set av-failopen to off",
      "Change suitable policies from proxy-based to flow-based inspection where the security requirements allow it",
      "Enable session-pickup-connectionless",
      "Stop the scanner (or block it with a DoS policy) and shorten session timers that keep idle sessions alive",
      "Raise memory-use-threshold-red to 97",
    ],
    answer: [1, 3],
    explanation: "Proxy-based inspection and a bloated session table both consume memory; reducing them fixes the cause. Raising the red threshold only postpones conserve mode (and leaves less headroom before the extreme threshold). `av-failopen off` changes what happens in conserve mode (block instead of bypass), not memory use. Session pickup is for HA and would add work.",
    lesson: '1.4-resources-conserve-mode',
  },
  {
    id: 'd1-081',
    topic: '1.5',
    type: 'single',
    difficulty: 1,
    stem: "Under the public cloud shared responsibility model, which item is the customer's responsibility when running workloads in AWS or Azure?",
    options: [
      "Physical security of the cloud data centres",
      "Maintaining the provider's backbone network",
      "Patching the hypervisor that hosts the instances",
      "Inspecting traffic to and between their workloads and configuring their network security controls",
    ],
    answer: [3],
    explanation: "The provider secures the physical facilities, hypervisor and core infrastructure. The customer secures what they build: operating systems, identities, network design, security groups and traffic inspection, which is where FortiGate-VM fits.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-082',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: "A company needs FortiGate-VMs in AWS that can be launched within minutes during traffic peaks and terminated afterwards, without managing license files. Which licensing model fits best?",
    options: [
      "The FortiGate-VM permanent trial license",
      "A FortiCare-only contract without a VM license",
      "BYOL with a perpetual license file per instance",
      "PAYG (on-demand) marketplace images billed hourly through AWS",
    ],
    answer: [3],
    explanation: "PAYG marketplace images include the FortiGate license in the hourly instance price, so instances can be created and destroyed freely; this suits elastic autoscaling. BYOL needs a license (file or FortiFlex token) applied per instance and suits steady, long-running deployments. The trial is limited to one instance per FortiCloud account and very small sizes, and FortiCare is support, not a VM license.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-083',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: "A FortiGate-VM in AWS has a private-subnet route table pointing 0.0.0.0/0 at its port2 ENI. Policies and NAT are correct, but the FortiGate never forwards traffic from the private instances. What is the most likely missing step?",
    options: [
      "Configure a multicast HA heartbeat on port2",
      "Disable the source/destination check on the FortiGate's ENIs",
      "Assign an Elastic IP to port2",
      "Enable gratuitous ARP on port2",
    ],
    answer: [1],
    explanation: "By default AWS drops packets on an ENI whose source or destination is not the instance's own address. A firewall forwards traffic for other hosts, so source/destination check must be disabled on its ENIs (in Azure the equivalent is enabling IP forwarding on the NICs). Gratuitous ARP and multicast heartbeat are not used in AWS, and the private interface does not need an Elastic IP.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-084',
    topic: '1.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Firewall policy 3 uses aws-web-servers as its destination. The web tier is an autoscaling group whose instances are tagged Role=web. What happens when the group scales out from two to four instances?",
    exhibit: String.raw`FGT-AWS # show system sdn-connector aws-conn
config system sdn-connector
    edit "aws-conn"
        set type aws
        set use-metadata-iam enable
        set region "us-east-1"
    next
end

FGT-AWS # show firewall address aws-web-servers
config firewall address
    edit "aws-web-servers"
        set type dynamic
        set sdn "aws-conn"
        set filter "Tag.Role=web"
    next
end`,
    options: [
      "The administrator must add the two new IPs to aws-web-servers manually",
      "The SDN connector learns the new instances' IPs from the AWS API, the dynamic address now resolves to four IPs, and policy 3 applies to all of them",
      "The dynamic address keeps only the two original IPs until the SDN connector is recreated",
      "Policy 3 stops matching until the FortiGate is rebooted",
    ],
    answer: [1],
    explanation: "A dynamic address with an SDN connector resolves its members from cloud metadata (here the tag `Role=web`) and updates automatically as instances come and go, so policies follow the autoscaling group. `use-metadata-iam enable` makes the connector use the instance's IAM role. No manual edits, reboots or connector recreation are needed. To check, `diagnose sys sdn status` shows whether the connector is up, and `show firewall address aws-web-servers` (or hovering the object in the GUI) lists the resolved IPs.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-085',
    topic: '1.5',
    type: 'multi',
    difficulty: 3,
    stem: "Which two statements describe an FGCP active-passive cluster of FortiGate-VMs in AWS? (Choose two.)",
    options: [
      "The members must use multicast heartbeats on a dedicated VLAN",
      "Failover is instant because AWS supports virtual MAC addresses on ENIs",
      "On failover, the new primary sends gratuitous ARP so the VPC router learns the virtual MAC",
      "On failover, the new primary uses an SDN connector and the AWS API to move the Elastic IP and update route tables",
      "The members exchange heartbeats as unicast between their peer IP addresses",
    ],
    answer: [3, 4],
    explanation: "AWS has no layer 2 broadcast or multicast, so FGCP uses unicast heartbeat (`unicast-hb enable`, `unicast-hb-peerip`), and failover works by API calls that move the public IP and repoint routes at the new primary (Fortinet calls this automatic AWS SDN updates to EIPs and route targets; the `awsd` process makes the calls with the instance's IAM role, usually through the HA management interface). Gratuitous ARP and virtual MACs do not steer traffic in a VPC, and API-based failover takes longer than hardware failover.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-086',
    topic: '1.5',
    type: 'fill',
    difficulty: 2,
    stem: "An SDN connector on a FortiGate-VM uses the instance's IAM role (AWS) or managed identity (Azure) instead of stored keys. The FortiGate obtains those credentials from the cloud instance metadata service. What IP address does that service use? Enter the address.",
    answer: ['169.254.169.254'],
    explanation: "Both AWS and Azure expose the instance metadata service at the link-local address 169.254.169.254. A FortiGate-VM uses it to obtain temporary credentials for an SDN connector that uses the instance's identity (for example `set use-metadata-iam enable` on an AWS connector), and in AWS also to read its bootstrap user data at first boot.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-087',
    topic: '1.5',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. The administrator did not create this object. What is it?",
    exhibit: String.raw`FGT-HQ # show firewall address FTLWIN0000012345
config firewall address
    edit "FTLWIN0000012345"
        set type dynamic
        set sub-type telemetry
        set agent-id "FTLWIN0000012345"
    next
end

FGT-HQ # show full-configuration telemetry-controller global | grep auto-group
    set auto-group-telemetry-addr enable`,
    options: [
      "A telemetry address created automatically for an authorized FortiTelemetry agent, which is also added to the TELEMETRY address group",
      "A FortiClient EMS posture tag object for a non-compliant Windows endpoint",
      "An SDN connector address learned from Azure for an instance tagged FTLWIN0000012345",
      "A placeholder object FortiOS creates for an unregistered FortiGate in the Security Fabric",
    ],
    answer: [0],
    explanation: "When the FortiGate acts as a FortiTelemetry Controller and an agent is authorized, FortiOS creates a dynamic address of `sub-type telemetry`, named after the agent's serial number with a matching `agent-id`. With `auto-group-telemetry-addr enable` (the default), it is also added to the `TELEMETRY` group, so policies can follow the agent. SDN connector addresses use `set sdn` and a filter, and EMS tags use a different dynamic sub-type.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-088',
    topic: '1.5',
    type: 'match',
    difficulty: 2,
    stem: "Match each automation-ready mechanism with its purpose in a cloud FortiGate deployment.",
    pairs: [
      ['User data (AWS) or custom data (Azure)', 'Day-0 bootstrap: configuration applied at first boot'],
      ['Terraform templates', 'Infrastructure as code for repeatable deployments'],
      ['FortiFlex token', 'Points-based BYOL licensing applied without a license file'],
      ['SDN connector dynamic addresses', 'Policy objects that follow instances by cloud metadata'],
    ],
    explanation: "Bootstrap data configures the instance at first boot, Terraform (and CloudFormation/ARM) deploy the infrastructure repeatably, FortiFlex licenses BYOL instances flexibly, and SDN connector dynamic objects keep policies current as instances change.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-089',
    topic: '1.5',
    type: 'single',
    difficulty: 1,
    stem: "Why do organizations deploy FortiGate-VM in AWS or Azure in addition to native security groups?",
    options: [
      "Security groups cannot filter by port number",
      "Security groups filter at layers 3 and 4 only, while FortiGate adds IPS, application control, web filtering, antivirus and SSL inspection",
      "Security groups do not work for instances in private subnets",
      "FortiGate-VM is required by AWS and Azure for any internet access",
    ],
    answer: [1],
    explanation: "Native security groups and network ACLs filter by address, protocol and port. They do not inspect content or identify applications, which is what an NGFW adds. Security groups do filter by port and do apply to private-subnet instances, and neither provider requires a third-party firewall.",
    lesson: '1.5-fortigate-vm-public-cloud',
  },
  {
    id: 'd1-090',
    topic: '1.6',
    type: 'single',
    difficulty: 1,
    stem: "A company backhauls all remote-user traffic over VPN to its head-office FortiGate. Users complain that Microsoft 365 and other SaaS applications are slow. Which SASE benefit addresses this?",
    options: [
      "All SaaS traffic is excluded from inspection",
      "Remote users are moved to an agentless proxy at the head office",
      "The head-office FortiGate is replaced by a larger model",
      "Users connect to a nearby cloud security PoP where traffic is inspected before going directly to the SaaS service",
    ],
    answer: [3],
    explanation: "SASE moves inspection to cloud points of presence close to the user, removing the hairpin through the data centre while keeping the traffic inspected and logged. Excluding SaaS from inspection (plain split tunnelling) sacrifices security. A bigger head-office firewall does not remove the extra latency, and a proxy at the head office is still backhaul.",
    lesson: '1.6-sase-architecture-components',
  },
  {
    id: 'd1-091',
    topic: '1.6',
    type: 'match',
    difficulty: 2,
    stem: "Match each FortiSASE use case with the traffic it secures.",
    pairs: [
      ['Secure internet access (SIA)', 'Remote users browsing the web and the internet'],
      ['Secure SaaS access (SSA)', 'Remote users using SaaS applications, with inline and API CASB'],
      ['Secure private access (SPA)', 'Remote users reaching applications in the company data centre or cloud'],
    ],
    explanation: "SIA inspects general internet traffic in the PoP, SSA adds SaaS visibility and control through CASB, and SPA connects users to private applications through FortiGate hubs or ZTNA.",
    lesson: '1.6-sase-architecture-components',
  },
  {
    id: 'd1-092',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "Contractors use personal laptops on which the company cannot install software. They must be protected by FortiSASE web filtering when browsing. Which onboarding method fits?",
    options: [
      "A FortiExtender thin edge device for each contractor",
      "Agentless SWG: configure the browser or OS to use FortiSASE as an explicit proxy, typically through a PAC file, with user authentication",
      "FortiClient agent-based mode with an invitation code",
      "Branch on-ramp IPsec tunnel from each contractor's home router",
    ],
    answer: [1],
    explanation: "SWG (proxy) mode protects web traffic from devices without an agent: the browser or OS sends HTTP/HTTPS to FortiSASE as a proxy, usually configured by a PAC file, and users authenticate (commonly through SSO). The agent-based mode needs FortiClient installed. Branch on-ramp and thin edge protect sites, not individual unmanaged laptops.",
    lesson: '1.6-sase-architecture-components',
  },
  {
    id: 'd1-093',
    topic: '1.6',
    type: 'multi',
    difficulty: 2,
    stem: "Which two items are components of a FortiSASE deployment? (Choose two.)",
    options: [
      "A mandatory on-premises FortiGate that inspects all internet traffic for remote users",
      "FortiClient, managed by the FortiSASE Endpoint Management Service",
      "A separate, non-FortiOS security engine with its own signature database",
      "Thin edge devices such as FortiExtender and FortiAP for small sites",
      "A FortiSwitch at every user's home",
    ],
    answer: [1, 3],
    explanation: "FortiSASE combines cloud PoPs, FortiClient (with the built-in Endpoint Management Service), agentless access, thin edge devices, branch on-ramp and SPA hubs. Internet traffic is inspected in the cloud PoP, not on an on-premises FortiGate (FortiGates act as SPA hubs only for private access). FortiSASE uses FortiOS security and FortiGuard intelligence. FortiSwitch is not required.",
    lesson: '1.6-sase-architecture-components',
  },
  {
    id: 'd1-094',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "A private access policy allows the Engineering group to reach a code repository only from endpoints carrying the Compliant security posture tag. An engineer's laptop has its antivirus disabled, which removes the tag. What happens?",
    options: [
      "Nothing changes until an administrator edits the policy",
      "The endpoint's tag changes, the dynamic address membership updates, and the policy stops allowing that laptop without any policy edit",
      "The user is removed from the Engineering group",
      "The laptop keeps access until FortiClient is reinstalled",
    ],
    answer: [1],
    explanation: "Security posture tags are dynamic. EMS (on FortiSASE, the Endpoint Management Service) re-evaluates the tagging rules, the tag-based address used in the policy updates, and access is denied automatically; re-enabling antivirus restores it. Group membership is unaffected, and no policy edit or reinstall is needed.",
    lesson: '1.6-fortisase-security-onboarding',
  },
  {
    id: 'd1-095',
    topic: '1.6',
    type: 'single',
    difficulty: 3,
    stem: "An administrator configures a DLP profile that references a FortiData label so that files labelled Restricted by FortiData are blocked. How does FortiOS determine whether a file in transit carries that label?",
    options: [
      "It sends the file's fingerprint (hash) to FortiData, which returns the label; FortiData must have its Label Query Service enabled and the FortiGate added",
      "It reads a label string that FortiData embeds in the file name",
      "It sends the entire file to FortiData for re-classification on every transfer",
      "It checks the file against FortiGuard's global label database",
    ],
    answer: [0],
    explanation: "Fortinet's docs say FortiGate passes the fingerprint of the transferred file to FortiData to check its label, so FortiData returns the label it assigned when it classified that file in storage. FortiData must have the Label Query Service enabled and the FortiGate added as a querying device, and the DLP profile (with `feature-set proxy`) is applied to a proxy-based policy; `fortidata-error-action` decides what happens if the query fails. Labels are not in file names, the file is not re-sent for classification, and FortiGuard has no copy of a customer's labels.",
    lesson: '1.6-fortisase-security-onboarding',
  },
  {
    id: 'd1-096',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "Which data loss risk does adding optical character recognition (OCR) to DLP address?",
    options: [
      "Sensitive text inside images, such as screenshots of spreadsheets or scanned documents, that text-based pattern matching cannot see",
      "Data exfiltration over DNS tunnels",
      "Data sent over unencrypted FTP",
      "Sensitive data hidden in encrypted ZIP files",
    ],
    answer: [0],
    explanation: "OCR extracts text from images so DLP patterns can be applied to screenshots, scans and photos of documents. Encrypted archives cannot be read by any content engine (they are handled by file filter blocking), DNS tunnelling is a DNS security problem, and plain FTP content is already visible to text-based DLP.",
    lesson: '1.6-fortisase-security-onboarding',
  },
  {
    id: 'd1-097',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "A security team wants to stop users from uploading customer records to GenAI chatbots while still allowing the approved chatbot for normal questions. Which component is required for the DLP profile to see the uploaded content?",
    options: [
      "A DNS filter profile that blocks the chatbot's domain",
      "SSL deep inspection on the traffic to the chatbot",
      "An IPS sensor with all signatures enabled",
      "SSL certificate inspection on the traffic to the chatbot",
    ],
    answer: [1],
    explanation: "Chatbot prompts and file uploads travel inside TLS. Only deep (full) inspection decrypts the traffic so DLP can examine what is posted. Certificate inspection sees only the SNI and certificate. Blocking the domain with DNS filtering would stop the approved use too, and IPS does not apply DLP patterns.",
    lesson: '1.6-fortisase-security-onboarding',
  },
  {
    id: 'd1-098',
    topic: '1.6',
    type: 'order',
    difficulty: 2,
    stem: "Place the steps of onboarding a remote user to FortiSASE by invitation in the correct order.",
    items: [
      "The administrator sends invitations with Onboard Users in FortiSASE",
      "The user receives an email with a FortiClient download link and an invitation code",
      "The user installs FortiClient",
      "FortiClient registers to the FortiSASE Endpoint Management Service using the invitation code",
      "The user authenticates (for example with SSO) and FortiClient brings up the tunnel to the nearest PoP",
    ],
    explanation: "The invitation email carries the download link and the deployment's invitation code. After installation, FortiClient registers with the Endpoint Management Service; the user must also be provisioned in an authentication source to get tunnel access.",
    lesson: '1.6-fortisase-security-onboarding',
  },
  {
    id: 'd1-099',
    topic: '1.6',
    type: 'single',
    difficulty: 2,
    stem: "Which statement about agentless ZTNA in FortiSASE is correct?",
    options: [
      "It requires FortiClient on the endpoint to present a device certificate",
      "Users reach private web applications through bookmarks in a browser portal, with access based on identity rather than agent-reported device posture",
      "It works only for UDP-based applications",
      "It gives users full network-level access to the data centre subnet",
    ],
    answer: [1],
    explanation: "Agentless ZTNA publishes private web applications as bookmarks in a portal; the user authenticates in the browser, and without an agent there is no device posture from FortiClient. Agent-based ZTNA is the mode that uses FortiClient and certificates. ZTNA grants per-application access, not network access, and the agentless portal is for web applications.",
    lesson: '1.6-fortisase-security-onboarding',
  },
  {
    id: 'd1-100',
    topic: '1.6',
    type: 'fill',
    difficulty: 3,
    stem: "In FortiOS, a DLP label that references a label defined in FortiData is created with a specific label type. What is that type keyword?",
    answer: ['fortidata'],
    explanation: "The DLP label type `fortidata` references a FortiData label name; the label is then used in a DLP profile applied to a proxy-based policy. (The other label type is for Microsoft Purview information protection sensitivity labels.)",
    lesson: '1.6-fortisase-security-onboarding',
  },
];
