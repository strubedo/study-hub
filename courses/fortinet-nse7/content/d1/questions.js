// Domain 1 — System configuration and SD-WAN setup. Original exam-style questions (FortiOS 7.6).
// Facts checked against the FortiOS 7.6.3 Administration Guide and CLI Reference on docs.fortinet.com (2026-10-29).
export default [
  // ---------------------------------------------------------------- 1.1 Security Fabric
  {
    id: "d1-001",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. FGT-Spoke1 is configured to join the Security Fabric whose root is FGT-Hub. FGT-Spoke1 reaches 10.10.1.1 over the overlay (ping works), but it never appears in the root's pending authorization list. What is the most likely cause?",
    exhibit: String.raw`FGT-Hub # show system csf
config system csf
    set status enable
    set group-name "Corp-Fabric"
end

FGT-Hub # show system interface HUB-Lo
config system interface
    edit "HUB-Lo"
        set vdom "root"
        set ip 10.10.1.1 255.255.255.255
        set allowaccess ping https ssh
        set type loopback
    next
end

FGT-Spoke1 # show system csf
config system csf
    set status enable
    set upstream "10.10.1.1"
    set group-name "Corp-Fabric"
end`,
    options: [
      "FGT-Spoke1 must be pre-authorized by serial number before it can send a join request",
      "The downstream FortiGate must use TCP 541 because the upstream is reached through an IPsec tunnel",
      "The group name must be different on the root and the downstream device",
      "Security Fabric Connection is not enabled on HUB-Lo, so the root does not listen for Fabric join requests on that address",
    ],
    answer: [3],
    explanation: "The root only accepts Fabric connections on interfaces where **Security Fabric Connection** is enabled (`fabric` in `allowaccess`, the same as selecting the interface as a listening interface in the Security Fabric Setup card). HUB-Lo allows only ping, HTTPS and SSH, so the join request on TCP 8013 is refused. Pre-authorization is optional: without it the device shows up as pending. TCP 541 is the FortiManager (FGFM) port, not the Fabric port; the default `upstream-port` is 8013. All Fabric members use the **same** group name.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-002",
    topic: "1.1",
    type: "multi",
    difficulty: 2,
    stem: "An architect is planning a Security Fabric for FortiOS 7.6 with FGT-Hub as the root. Which two requirements must be met for the Fabric to be enabled on the root? (Choose two.)",
    options: [
      "A FortiAnalyzer, FortiAnalyzer Cloud or FortiGate Cloud logging destination is configured",
      "A FortiManager manages every FortiGate that will join the Fabric",
      "FGT-Hub operates in NAT mode",
      "FortiClient EMS is connected to the root",
      "All Fabric FortiGates are the same hardware model",
    ],
    answer: [0, 2],
    explanation: "The 7.6 Admin Guide states that FortiGates in the Fabric must operate in **NAT mode** and that **FortiAnalyzer or cloud logging** (FortiAnalyzer, FortiAnalyzer Cloud or FortiGate Cloud) is a required component. FortiManager and FortiClient EMS are recommended integrations, not prerequisites. Fabric members can be any mix of models; identical models are an FGCP requirement, not a Fabric one.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-003",
    topic: "1.1",
    type: "match",
    difficulty: 2,
    stem: "Match each integration with the place where it is configured on a FortiOS 7.6 root FortiGate.",
    pairs: [
      ["FortiNAC appliance that sends host tags", "Fabric Connectors: supported connector, authorized into the topology"],
      ["FortiAnalyzer receiving logs from all members", "Fabric Connectors: Logging & Analytics card"],
      ["AWS VPC instances used in address objects", "External Connectors: public SDN connector"],
      ["Domain controllers polled for user logons", "External Connectors: Endpoint/Identity (Poll Active Directory)"],
      ["Malware hash list published on a web server", "External Connectors: threat feed"],
    ],
    explanation: "Fortinet products that join the Fabric and appear in the topology (FortiNAC, FortiNDR, FortiAnalyzer, FortiManager, EMS, FortiAP/FortiSwitch) are **Fabric connectors**. Third-party platforms (public and private SDN), identity sources (FSSO agent, Poll AD, RADIUS SSO, Exchange, Symantec) and threat feeds (FortiGuard category, IP, domain, MAC, malware hash lists) are **external connectors**.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-004",
    topic: "1.1",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Security Fabric SAML SSO is configured. An administrator working from a jump host in 172.20.5.0/24 browses to FGT-Spoke1 and clicks the single sign-on button. The browser is redirected but the page never loads. The jump host can reach 203.0.113.10 and 10.20.1.1, but has no route to 10.10.0.0/16. What should be changed?",
    exhibit: String.raw`FGT-Hub (root, IdP) # show system saml
config system saml
    set status enable
    set role identity-provider
    set cert "Fortinet_Factory"
    set server-address "10.10.1.1"
end

Addresses of FGT-Hub
  10.10.1.1    internal management interface
  203.0.113.10 port1 (internet, HTTPS admin access allowed)

FGT-Spoke1 (SP) management address: 10.20.1.1`,
    options: [
      "Add a static route on FGT-Spoke1 to 172.20.5.0/24, because the SP proxies the SAML exchange for the user",
      "Set the IdP Management IP/FQDN (server-address) on FGT-Hub to an address the administrator's browser can reach, such as 203.0.113.10",
      "Configure FGT-Spoke1 as the identity provider, because the administrator connects to it first",
      "Change the IdP certificate to a public CA certificate, because Fortinet_Factory cannot be used for SAML",
    ],
    answer: [1],
    explanation: "In SAML the **browser** carries the redirects. The SP sends the user to the IdP's Management IP/FQDN, and Fortinet requires that address and port to be reachable from the user's device. 10.10.1.1 is not reachable from the jump host, so use an address the jump host can reach. Only the root FortiGate can be the IdP. Fortinet_Factory is a valid choice for the IdP certificate (it is used in the documented CLI example). The SP does not proxy the exchange.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-005",
    topic: "1.1",
    type: "single",
    difficulty: 1,
    stem: "In a Security Fabric with FGT-Hub as root and FGT-Spoke1 and FGT-Spoke2 downstream, the security team wants FGT-Spoke2 to be the SAML identity provider for Fabric single sign-on. What is true?",
    options: [
      "Any FortiGate can be the IdP, but then SSO admin profiles cannot be used",
      "This is not supported: only the root FortiGate can be the IdP; downstream FortiGates can only be service providers",
      "It works if FGT-Spoke2 is set to role identity-provider and FGT-Hub to service-provider",
      "It works only if FGT-Spoke2 is the FortiGate that logs to FortiAnalyzer",
    ],
    answer: [1],
    explanation: "Fortinet states that in Security Fabric SSO **only the root FortiGate can be the identity provider**, and downstream FortiGates are configured as service providers (and must already be Fabric members). Logging placement and admin profiles do not change this.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-006",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. FortiNAC is shown as authorized in the root FortiGate's topology, but the FortiNAC tag dynamic addresses used in firewall policies stay empty after users log on. What is the most likely cause?",
    exhibit: String.raw`FGT-Hub > Security Fabric > Fabric Connectors > Security Fabric Setup
  Security Fabric role ............................ Serve as Fabric Root
  Fabric name ..................................... Corp-Fabric
  Allow other Security Fabric devices to join ..... On   (port2, HUB-Lo)
  Allow downstream device REST API access ......... Off
  SAML Single Sign-On ............................. Off

FGT-Hub > Security Fabric > Fabric Connectors > Supported Connectors
  FortiNAC  FNVM-NAC01  10.10.5.20  Authorized`,
    options: [
      "FortiNAC sends tag and IP information to the FortiGate through the REST API, which requires Allow downstream device REST API access on the root",
      "Dynamic addresses cannot be used in firewall policies; they work only in proxy policies",
      "FortiNAC tag addresses are only populated when SAML Single Sign-On is enabled on the root",
      "FortiNAC must be added as an external Endpoint/Identity connector instead of a supported Fabric connector",
    ],
    answer: [0],
    explanation: "The FortiNAC tag dynamic address stores device IPs, FortiNAC firewall tags and group information **sent from FortiNAC by the REST API** on logon and logoff events, and the Admin Guide lists FortiNAC among the devices that need **Allow downstream device REST API access** on the root. SAML SSO is unrelated. FortiNAC is a supported Fabric connector, not an external connector. FortiNAC tag addresses are used in normal firewall policies.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-007",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "FortiNDR has joined the Security Fabric and `config system fortindr` has `set status enable`. The antivirus profile on the internet policy uses the flow-based feature set. No file is ever submitted to FortiNDR. What must the administrator change to get FortiNDR inline verdicts?",
    options: [
      "Use a proxy-based antivirus profile (feature-set proxy) with the fortindr action set per protocol, because FortiNDR inline scanning does not support flow mode",
      "Enable fortindr-error-action block, because the default action discards FortiNDR verdicts",
      "Add FortiNDR as an external threat feed connector so that its verdicts become a malware hash list",
      "Enable FortiGuard outbreak prevention, because FortiNDR is only queried when outbreak prevention returns no verdict",
    ],
    answer: [0],
    explanation: "FortiOS 7.6 supports FortiNDR inline inspection with **proxy-based** antivirus profiles only (flow mode is not supported), configured per protocol with `set fortindr block` (or monitor). Outbreak prevention and FortiNDR run simultaneously; neither waits for the other. FortiNDR is a Fabric device, not a threat feed. `fortindr-error-action` only decides what happens when FortiNDR returns an error.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-008",
    topic: "1.1",
    type: "fill",
    difficulty: 2,
    stem: "On the root FortiGate, which diagnose command lists the Fabric authorization requests that are waiting for approval? (Enter the full command.)",
    answer: ["diagnose sys csf authorization pending-list", "diag sys csf authorization pending-list"],
    explanation: "`diagnose sys csf authorization pending-list` shows pending requests; `diagnose sys csf authorization accept <serial> [name]` authorizes one. Pre-authorized devices skip the pending list.",
    lesson: "1.1-fabric-connectors-sso",
  },
  {
    id: "d1-009",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. A SOAR platform must quarantine hosts by calling the FortiGate when it confirms an incident. The access layer is a third-party switch fleet (no FortiSwitch or FortiAP), endpoints do not run FortiClient, and FortiNAC controls the switch ports and is part of the Fabric. Which action should be added to this stitch?",
    exhibit: String.raw`FGT-Hub # show system automation-trigger "soar-hook"
config system automation-trigger
    edit "soar-hook"
        set event-type incoming-webhook
    next
end`,
    options: [
      "Access Layer Quarantine",
      "FortiNAC Quarantine",
      "FortiClient Quarantine",
      "Disable SSID",
    ],
    answer: [1],
    explanation: "**FortiNAC Quarantine** works with Compromised Host and Incoming Webhook triggers; FortiNAC quarantines the client and disables its MAC address on the ports it controls, which fits third-party switches. Access Layer Quarantine acts only on managed FortiSwitch and FortiAP devices, and FortiClient Quarantine needs FortiClient EMS on the endpoint, so neither helps here even though both can be driven by a webhook (the default Incoming Webhook Quarantine stitch uses them). Disable SSID turns off a wireless interface, it does not quarantine a host.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-010",
    topic: "1.1",
    type: "multi",
    difficulty: 2,
    stem: "A SIEM posts a JSON payload containing a host's `mac` and `fctuid` to the FortiGate's default **Incoming Webhook Quarantine** stitch, which has been enabled. Which two actions does that stitch run? (Choose two.)",
    options: [
      "IP Ban",
      "Access Layer Quarantine",
      "CLI Script",
      "FortiClient Quarantine",
      "FortiNAC Quarantine",
      "Email Notification",
    ],
    answer: [1, 3],
    explanation: "The default Incoming Webhook Quarantine stitch (disabled until you enable it) links the Incoming Webhook Call trigger to **Access Layer Quarantine**, which quarantines the `mac` on FortiSwitch and FortiAP, and **FortiClient Quarantine**, which has EMS quarantine the endpoint identified by `fctuid`. IP Ban, FortiNAC Quarantine, CLI Script and Email are not part of that default stitch; FortiNAC Quarantine can be added to a webhook stitch, but it is a separate action.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-011",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The stitch was triggered, but no email was sent. The autod statistics show that the webhook action failed. Why was no email sent?",
    exhibit: String.raw`Stitch "outage-report" (FGT-Hub, root of the Fabric)
  Trigger ............... FortiOS Event Log (logid 20099, status DOWN)
  Action execution ...... Sequential
  Action 1 .............. Webhook to ticketing system (POST)  -> failed (HTTP 503)
  Action 2 .............. Email to noc@example.com, body %%results%%, delay 30 s`,
    options: [
      "Stitches with event log triggers cannot have more than one action",
      "A delay can only be configured with parallel execution, so the stitch ignores action 2",
      "With sequential execution, the action chain stops when an action fails, so the email action never ran",
      "Email actions cannot follow webhook actions; only CLI Script output can be used in an email",
    ],
    answer: [2],
    explanation: "Sequential is the default execution mode: actions run one after another with optional delays, and **if one action fails the chain stops**. Parallel execution would have started both actions at once. `%%results%%` works with any previous action that returns JSON, including webhooks. Delays are a sequential-mode feature (up to 3600 s). Multiple actions per stitch are normal.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-012",
    topic: "1.1",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The stitch runs nightly on the Fabric root. The Fabric has twelve FortiGates, but each morning the FTP server holds a single file. What is the cause?",
    exhibit: String.raw`FGT-Hub # show system automation-action "fabric-backup"
config system automation-action
    edit "fabric-backup"
        set action-type cli-script
        set script "execute backup config ftp backup.conf 192.0.2.50 ftpuser ********"
        set execute-security-fabric enable
        set accprofile "super_admin"
    next
end`,
    options: [
      "The FTP server accepts only one connection per minute from the same Fabric",
      "Every Fabric member runs the same command at the same time with the same file name, so the backups overwrite each other",
      "execute-security-fabric runs the script only on the root, so only the root's configuration is saved",
      "CLI script actions cannot run execute commands; only the Backup Config Disk system action can back up configuration",
    ],
    answer: [1],
    explanation: "With `execute-security-fabric enable`, the CLI script runs on **all** Fabric devices. Fortinet specifically warns that commands such as `execute backup config ftp` can then overwrite each other on the FTP server. Use a per-device file name, or run the stitch on each device. With the option disabled (default) the script runs only on the device where the trigger fired. CLI scripts can run `execute backup` commands; Backup Config Disk is the alternative that saves a local revision.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-013",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "A stitch must back up the configuration and then reboot the FortiGate when it enters conserve mode. The first version used a CLI Script action containing `execute reboot`, and the reboot never happened. Which design meets the requirement?",
    options: [
      "Configuration Change trigger with a CLI Script action, because system actions cannot run in conserve mode",
      "Conserve Mode trigger with the Backup Config Disk system action, then the Reboot FortiGate system action after a delay",
      "Conserve Mode trigger with a CLI Script action that runs execute reboot with a longer timeout",
      "High CPU trigger with an Email action, because conserve mode blocks all automation",
    ],
    answer: [1],
    explanation: "System actions (`backup-config`, `reboot`, `shutdown`) were built for this: they run **even in conserve mode** and **bypass CLI confirmation prompts**, which a CLI script cannot answer (execute reboot asks for confirmation). The documented example chains Backup Config Disk and Reboot FortiGate with a delay. A longer timeout does not answer the prompt. Conserve mode does not block automation; the Conserve Mode trigger exists for it.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-014",
    topic: "1.1",
    type: "order",
    difficulty: 2,
    stem: "Place the steps of an automated IoC quarantine in the Security Fabric in the order in which they happen.",
    items: [
      "Fabric FortiGates send their logs to FortiAnalyzer",
      "FortiAnalyzer's indicator-of-compromise service flags a host as compromised",
      "The Compromised Host trigger fires on the root FortiGate",
      "The Access Layer Quarantine action quarantines the host's MAC on the managed FortiSwitch or FortiAP",
      "An administrator reviews and releases the host from the Quarantine widget",
    ],
    explanation: "IoC detection runs on the log data in FortiAnalyzer, so logs come first. A detection fires the **Compromised Host** trigger on the root, the stitch's quarantine action acts on the access layer, and the quarantined host is listed in Dashboard > Assets & Identities > Quarantine, where it can be released.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-015",
    topic: "1.1",
    type: "fill",
    difficulty: 1,
    stem: "Which CLI command runs an automation stitch immediately for testing, without waiting for its trigger? (Enter the command without the stitch name.)",
    answer: ["diagnose automation test", "diag automation test"],
    explanation: "`diagnose automation test <stitch-name>` fires the stitch now. In the GUI, right-click the stitch and choose Test Automation Stitch. `diagnose test application autod 3` then shows the hit and action counters.",
    lesson: "1.1-automation-stitches",
  },
  {
    id: "d1-016",
    topic: "1.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. CPU usage on FGT-Hub rises to 84%. What does the email sent by this stitch contain?",
    exhibit: String.raw`FGT-Hub # show system global | grep cpu-use
    set cpu-use-threshold 80

FGT-Hub # show system automation-stitch "cpu-spike"
config system automation-stitch
    edit "cpu-spike"
        set trigger "High CPU"
        config actions
            edit 1
                set action "cpu-debug"
                set required enable
            next
            edit 2
                set action "cpu-mail"
                set required enable
            next
        end
    next
end

FGT-Hub # show system automation-action
config system automation-action
    edit "cpu-debug"
        set action-type cli-script
        set script "diagnose sys top 5 20 2
get system performance status"
        set accprofile "super_admin"
    next
    edit "cpu-mail"
        set action-type email
        set email-to "noc@example.com"
        set email-subject "High CPU"
        set message "%%results%%"
    next
end`,
    options: [
      "Only the raw High CPU event log, because %%results%% refers to the trigger log",
      "The output of diagnose sys top and get system performance status collected when the trigger fired",
      "Nothing, because the High CPU trigger always uses the default threshold of 90%",
      "The text %%results%%, because CLI script output cannot be passed to an email action",
    ],
    answer: [1],
    explanation: "The High CPU trigger fires at `cpu-use-threshold` in `config system global` (default 90%, set here to 80%), so 84% triggers it. `%%results%%` inserts the output of the previous action, here the CLI script, into the email; Fortinet documents exactly this pattern for high CPU and memory. The trigger log would be `%%log%%`. Large output (over 64 KB) is sent as an attachment.",
    lesson: "1.1-automation-stitches",
  },
  // ---------------------------------------------------------------- 1.2 HA
  {
    id: "d1-017",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. FGT-A was primary. Its monitored interface port1 failed, FGT-B took over, and port1 on FGT-A was repaired 10 minutes later. Both units have been running for months. Which unit is primary now, and why?",
    exhibit: String.raw`FGT-A # show system ha
config system ha
    set group-id 10
    set group-name "DC-Cluster"
    set mode a-p
    set hbdev "port3" 50 "port4" 50
    set override disable
    set priority 200
    set monitor "port1" "port2"
end

FGT-B # show system ha
config system ha
    set group-id 10
    set group-name "DC-Cluster"
    set mode a-p
    set hbdev "port3" 50 "port4" 50
    set override disable
    set priority 100
    set monitor "port1" "port2"
end`,
    options: [
      "FGT-B, because a unit that has had a monitored interface failure cannot become primary again until it reboots",
      "FGT-A, because it has the higher device priority",
      "FGT-B, because FGT-A's HA uptime was reset when port1 failed and FGT-B's uptime is now more than 300 seconds larger",
      "FGT-A, because it has the higher serial number",
    ],
    answer: [2],
    explanation: "With override disabled the order is monitored interfaces, **HA uptime**, priority, serial. After repair both units have the same number of good monitored interfaces, so uptime decides. A monitored interface failure resets that unit's HA uptime to zero, while FGT-B's uptime kept counting, so ten minutes after the repair FGT-B's uptime is still far more than `ha-uptime-diff-margin` (300 s) larger and FGT-B stays primary. Priority would only matter if uptime were a tie or override were enabled. A reboot is not required for FGT-A to become primary later.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-018",
    topic: "1.2",
    type: "order",
    difficulty: 2,
    stem: "With `override disable` on all members, place the FGCP primary unit selection criteria in the order they are evaluated.",
    items: [
      "Number of connected monitored interfaces",
      "HA uptime (age), when the difference exceeds ha-uptime-diff-margin",
      "Device priority",
      "Serial number",
    ],
    explanation: "Override disabled: monitored interfaces, uptime, priority, serial number. With override enabled, priority moves ahead of uptime (monitored interfaces, priority, uptime, serial). Uptime differences under the margin (300 s by default) count as a tie.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-019",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. An FGCP cluster forms through a pair of data centre switches, but configuration changes made on FGT-A are not applied on FGT-B and `execute ha manage 1 admin` from FGT-A times out. Which change on both FortiGates addresses the problem without changing the switches?",
    exhibit: String.raw`Switch policy on the heartbeat VLAN (non-IP frames)
  permit ethertype 0x8890
  permit ethertype 0x8891
  permit ethertype 0x8892
  deny   any other non-IP ethertype

FGT-A # get system ha status
HA Health Status: OK
Model: FortiGate-VM64
Mode: HA A-P
Group Name: DC-Cluster
Group ID: 10
...
Primary     : FGT-A           , FGVM08TM26000011, HA cluster index = 0
Secondary   : FGT-B           , FGVM08TM26000012, HA cluster index = 1`,
    options: [
      "Enable unicast-hb, because the switches block multicast heartbeats",
      "Set l2ep-eth-type to an EtherType that the switches permit, because 0x8893 carries HA Telnet sessions used for configuration sync and execute ha manage",
      "Set hc-eth-type to 0x8890, because the A-P cluster is redistributing traffic",
      "Set ha-eth-type to 0x8893, because heartbeats are being dropped",
    ],
    answer: [1],
    explanation: "The cluster forms, so 0x8890 heartbeats pass. **0x8893** is used for HA Telnet sessions (configuration synchronization and `execute ha manage`) and is the only FGCP EtherType the switch denies. Fortinet's fix is `set l2ep-eth-type <hex>` on both members (for example 889f) or allowing 0x8893. `ha-eth-type` changes the heartbeat EtherType, `hc-eth-type` the A-A redistribution EtherType. Unicast heartbeat is a cloud (VM) feature, not a fix for a blocked EtherType.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-020",
    topic: "1.2",
    type: "match",
    difficulty: 2,
    stem: "Match each FGCP EtherType with its function as documented for FortiOS 7.6.",
    pairs: [
      ["0x8890", "Heartbeat packets to discover and monitor cluster units"],
      ["0x8891", "Primary redistributing traffic to subordinates in active-active mode"],
      ["0x8892", "Session synchronization over session-sync-dev interfaces"],
      ["0x8893", "HA Telnet sessions for configuration sync and execute ha manage"],
    ],
    explanation: "0x8890 heartbeat (`ha-eth-type`), 0x8891 A-A traffic redistribution (`hc-eth-type`, which the CLI Reference calls the transparent-mode heartbeat), 0x8892 session sync on dedicated `session-sync-dev` ports, and 0x8893 HA Telnet/configuration sync (`l2ep-eth-type`). Session sync uses UDP/708 inside 0x8892 frames with session-sync-dev, or inside 0x8893 frames on the heartbeat link without it.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-021",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The cluster uses automatic virtual MAC assignment based on group ID (auto-virtual-mac-interface is not set). What virtual MAC address does port3 of the primary unit use in virtual cluster 1?",
    exhibit: String.raw`FGT-A # show system ha | grep group-id
    set group-id 33

FGT-A # diagnose sys ha dump-by debug-zone
...
<hatalk>    port1   ifindex=3   phyindex=0   mac=00.0c.29.4a.11.01
<hatalk>    port2   ifindex=4   phyindex=1   mac=00.0c.29.4a.11.02
<hatalk>    port3   ifindex=5   phyindex=2   mac=00.0c.29.4a.11.03
<hatalk>    port4   ifindex=6   phyindex=3   mac=00.0c.29.4a.11.04
...`,
    options: [
      "00:09:0f:09:21:82",
      "00:09:0f:09:21:02",
      "00:09:0f:09:33:02",
      "02:0c:29:4a:11:03",
    ],
    answer: [1],
    explanation: "For group IDs below 256 and physical indexes below 128 the VMAC is `00:09:0f:09:<group ID in hex>:<vcluster bit + physical index>`. Group 33 is 0x21, port3 has phyindex 2, and vcluster 1 has vcluster bit 0, giving **00:09:0f:09:21:02**. 33 written as \"33\" is the decimal mistake. 0x82 would be the same port in vcluster 2. The 02: address is what `auto-virtual-mac-interface` produces (hardware MAC with the locally administered bit set), which is not configured.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-022",
    topic: "1.2",
    type: "multi",
    difficulty: 2,
    stem: "An FGCP cluster processes a high rate of short-lived connections and the heartbeat links are congested by session synchronization. Which two changes reduce the session sync load on the heartbeat links? (Choose two.)",
    options: [
      "Increase hb-lost-threshold",
      "Enable session-pickup-delay so that only sessions older than 30 seconds are synchronized",
      "Configure session-sync-dev with dedicated interfaces between the members",
      "Enable load-balance-all",
      "Enable session-pickup-connectionless",
    ],
    answer: [1, 2],
    explanation: "`session-sync-dev` moves session sync off the heartbeat link (kernel offloaded, EtherType 0x8892), and `session-pickup-delay` stops synchronizing sessions that live less than 30 seconds. Both are listed by Fortinet as ways to reduce heartbeat traffic. Connectionless pickup **adds** UDP and ICMP to the sync. hb-lost-threshold only changes failure detection time. load-balance-all increases A-A redistribution overhead.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-023",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The cluster was changed to active-active to use both units. After a week the secondary still processes almost nothing. Why?",
    exhibit: String.raw`FGT-A # show firewall policy 10
config firewall policy
    edit 10
        set name "LAN-to-Internet"
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "all"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set inspection-mode flow
        set utm-status enable
        set ips-sensor "default"
        set application-list "default"
        set logtraffic all
        set nat enable
    next
end

FGT-A # get system ha status
...
Mode: HA A-A
...
System Usage stats:
    FGVM08TM26000011(updated 1 seconds ago):
        sessions=48211, average-cpu-user/nice/system/idle=31%/0%/4%/65%, memory=58%
    FGVM08TM26000012(updated 2 seconds ago):
        sessions=37, average-cpu-user/nice/system/idle=0%/0%/0%/100%, memory=41%`,
    options: [
      "The secondary must be given a higher priority to receive sessions in active-active mode",
      "Active-active only load balances UDP sessions unless load-balance-all is enabled",
      "Active-active load balances proxy-based security profile sessions by default; flow-based IPS and application control sessions are processed by the primary",
      "The default schedule is none, so the primary never forwards sessions to the secondary",
    ],
    answer: [2],
    explanation: "FGCP A-A distributes **proxy-based** UTM sessions (proxy AV, proxy web filter, email filter, DLP) by default. IPS, application control and other flow-based inspection are listed as processed only by the primary. `load-balance-all enable` would add all TCP sessions. The default schedule is round-robin, not none. Priority affects election, not A-A distribution.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-024",
    topic: "1.2",
    type: "multi",
    difficulty: 2,
    stem: "In an FGCP active-active cluster with default load-balancing settings, which two kinds of traffic are always processed by the primary unit? (Choose two.)",
    options: [
      "SMTP sessions inspected by a proxy-based email filter profile",
      "HTTP sessions inspected by a proxy-based antivirus profile",
      "IPsec VPN traffic",
      "ICMP sessions",
      "FTP sessions inspected by a proxy-based DLP profile",
    ],
    answer: [2, 3],
    explanation: "ICMP, multicast and broadcast sessions are never load balanced, and IPsec VPN is on Fortinet's list of traffic processed only by the primary. Proxy-based antivirus, email filtering and DLP sessions are exactly the sessions A-A distributes by default.",
    lesson: "1.2-fgcp-clustering",
  },
  {
    id: "d1-025",
    topic: "1.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Both units run normally with override enabled. Which VDOMs does FGT-B process traffic for?",
    exhibit: String.raw`FGT-A # show system ha
config system ha
    set group-id 5
    set mode a-p
    set vcluster-status enable
    config vcluster
        edit 1
            set override enable
            set priority 200
            set vdom "root" "Tenant-A"
        next
        edit 2
            set override enable
            set priority 100
            set vdom "Tenant-B" "Tenant-C"
        next
    end
end

FGT-B # show system ha
config system ha
    set group-id 5
    set mode a-p
    set vcluster-status enable
    config vcluster
        edit 1
            set override enable
            set priority 100
            set vdom "root" "Tenant-A"
        next
        edit 2
            set override enable
            set priority 200
            set vdom "Tenant-B" "Tenant-C"
        next
    end
end`,
    options: [
      "Tenant-B and Tenant-C",
      "All four VDOMs, because virtual clustering is active-active",
      "None, because FGT-B is the secondary for the whole cluster",
      "root and Tenant-A",
    ],
    answer: [0],
    explanation: "Each virtual cluster is its own active-passive FGCP cluster with its own priorities. With override enabled, the higher priority wins in each vcluster: FGT-A (200) for vcluster 1 (root, Tenant-A) and FGT-B (200) for vcluster 2 (Tenant-B, Tenant-C). This is VDOM partitioning. Priority is not synchronized, which is why the two units can hold different values.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-026",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "An MSSP runs twelve customer VDOMs on a pair of identical FortiGates. Customer VDOMs reach the internet through inter-VDOM links to the root VDOM. Requirements: both FortiGates must forward production traffic, each customer's VDOMs must be pinned to a preferred unit, and failover must be stateful. Which design meets all requirements?",
    options: [
      "FGCP active-active with load-balance-all enabled",
      "VRRP on every customer-facing interface with FGT-A at priority 255",
      "FGCP virtual clustering: root and some customer VDOMs in vcluster 1 preferring FGT-A, the other customers in vcluster 2 preferring FGT-B, with session pickup enabled",
      "FGSP between the two FortiGates with an upstream load balancer",
    ],
    answer: [2],
    explanation: "Virtual clustering partitions VDOMs between units (up to 30 vclusters, root in vcluster 1) and keeps FGCP configuration sync and session pickup. Active-active cannot load balance sessions that cross VDOM links and only balances proxy UTM sessions by default. FGSP needs an external load balancer and does not pin VDOMs to units or sync configuration. VRRP with one priority-255 owner leaves the other unit idle and does not synchronize sessions.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-027",
    topic: "1.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The two FGSP peers do not synchronize any sessions. Which change fixes the configuration?",
    exhibit: String.raw`FGT-A # show system standalone-cluster
config system standalone-cluster
    set standalone-group-id 1
    set group-member-id 0
    config cluster-peer
        edit 1
            set peerip 10.99.0.2
        next
    end
end

FGT-B # show system standalone-cluster
config system standalone-cluster
    set standalone-group-id 2
    set group-member-id 1
    config cluster-peer
        edit 1
            set peerip 10.99.0.1
        next
    end
end`,
    options: [
      "Set the same group-member-id on both peers",
      "Set the same standalone-group-id on both peers",
      "Set mode a-p under config system ha on both peers",
      "Configure session-sync-dev, because FGSP cannot synchronize over layer 3",
    ],
    answer: [1],
    explanation: "`standalone-group-id` (0–255) must match on all FGSP members, while `group-member-id` (0–15) must be **unique**. FGSP peers stay in HA mode standalone; a-p would make them an FGCP cluster. Sync over layer 3 to the peer IP is the default; session-sync-dev is an optional layer 2 optimization.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-028",
    topic: "1.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. After a load balancer fails traffic over from FGT-A to FGT-B, HTTPS sessions continue but DNS lookups and VoIP calls in progress are dropped. What should be added on both peers?",
    exhibit: String.raw`FGT-A # show system ha
config system ha
    set session-pickup enable
end

FGT-A # show system standalone-cluster
config system standalone-cluster
    set standalone-group-id 1
    set group-member-id 0
    config cluster-peer
        edit 1
            set peerip 10.99.0.2
        next
    end
end`,
    options: [
      "set session-pickup-delay enable under config system ha",
      "set layer2-connection available under config system standalone-cluster",
      "set session-pickup-connectionless enable under config system ha",
      "set ipsec-tunnel-sync enable under the cluster peer",
    ],
    answer: [2],
    explanation: "FGSP synchronizes TCP sessions (and IPsec tunnels) by default. Connectionless UDP and ICMP sessions need `session-pickup enable` **plus** `session-pickup-connectionless enable`. session-pickup-delay would reduce what is synchronized. ipsec-tunnel-sync is already enabled by default and concerns tunnels. layer2-connection is about forwarding asymmetric traffic, not about which session types are synchronized.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-029",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. session-pickup-nat is enabled on both FGSP peers. After FGT-A fails, internet sessions that it had NATed are not resumed by FGT-B. What design change lets these NAT sessions survive a failover?",
    exhibit: String.raw`FGT-A # show firewall policy 1
config firewall policy
    edit 1
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "all"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set nat enable
    next
end

port1 on FGT-A: 203.0.113.11/24     port1 on FGT-B: 203.0.113.12/24`,
    options: [
      "Translate to an overload IP pool that both peers use instead of each peer's outgoing interface address",
      "Disable NAT on the policy, because FGSP cannot synchronize NAT sessions",
      "Enable session-pickup-expectation, because NAT sessions are expectation sessions",
      "Enable layer2-connection available so FGT-B can answer ARP for 203.0.113.11",
    ],
    answer: [0],
    explanation: "Synchronized NAT sessions point to the failed peer's interface address (203.0.113.11), which no longer exists on the network after failover. Fortinet's guidance is to use **IP pools** (overload, the default pool type) rather than the destination interface address so the surviving peer can keep the translation. FGSP does synchronize NAT sessions when session-pickup-nat is on. Expectation sessions are FTP data and SIP media. layer2-connection controls asymmetric forwarding, not ARP for another peer's interface IP.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-030",
    topic: "1.2",
    type: "multi",
    difficulty: 2,
    stem: "Two FortiGates are FGSP peers with only `config system standalone-cluster` configured (no session-pickup options in `config system ha`). Which two are synchronized between them? (Choose two.)",
    options: [
      "NAT sessions",
      "ICMP sessions",
      "IPsec tunnels",
      "UDP sessions",
      "FTP expectation (data) sessions",
      "IPv4 and IPv6 TCP sessions",
    ],
    answer: [2, 5],
    explanation: "The FortiOS 7.6 FGSP overview states that by default FGSP synchronizes all IPv4 and IPv6 **TCP sessions** and **IPsec tunnels**. UDP and ICMP need session-pickup with session-pickup-connectionless, expectation sessions need session-pickup-expectation, and NAT sessions need session-pickup-nat.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-031",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Two FortiGate-VMs in a public cloud are FGSP peers behind cloud load balancers that do not keep flows symmetric. Return traffic often reaches the peer that did not see the first packet, and those sessions fail UTM inspection. What should be changed?",
    exhibit: String.raw`FGT-A  port3 10.0.1.10/24 (sync)     FGT-B  port3 10.0.2.10/24 (sync)

FGT-A # show system standalone-cluster
config system standalone-cluster
    set standalone-group-id 1
    set group-member-id 0
    set layer2-connection available
    config cluster-peer
        edit 1
            set peerip 10.0.2.10
        next
    end
end`,
    options: [
      "Configure session-sync-dev port3 so the peers bounce traffic at layer 2",
      "Change the peers to FGCP active-passive, because FGSP cannot be used in public clouds",
      "Set layer2-connection unavailable on both peers so traffic for the session owner is UDP-encapsulated and routed between the peer interfaces",
      "Enable session-pickup-connectionless so the peers can inspect asymmetric UDP and TCP traffic",
    ],
    answer: [2],
    explanation: "`layer2-connection available` assumes the peers share layer 2 and bounce traffic to the owner's MAC. The peers are in different subnets, so FortiOS must use the **layer 3** method: `layer2-connection unavailable` (the default), which packs return traffic in UDP and sends it between peer interfaces. Fortinet's asymmetric examples also unset session-sync-dev, so adding it is wrong. Asymmetric UTM supports TCP only, and connectionless pickup does not change that. FGSP is a documented cloud design.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-032",
    topic: "1.2",
    type: "multi",
    difficulty: 3,
    stem: "Two on-premises FGSP peers must inspect asymmetric traffic with security profiles using the layer 2 method. Which three conditions are required? (Choose three.)",
    options: [
      "The internal and outgoing interfaces of both peers are in the same subnets",
      "set encryption enable with a psksecret on both peers",
      "session-sync-dev is not set in config system standalone-cluster",
      "set layer2-connection available in config system standalone-cluster",
      "UDP and ICMP sessions are included by session-pickup-connectionless",
      "The peers use different standalone-group-id values",
    ],
    answer: [0, 2, 3],
    explanation: "The 7.6 layer 2 example requires `layer2-connection available`, `unset session-sync-dev`, and peers whose internal and outgoing interfaces share subnets with layer 2 reachability (plus `utm-status enable` on the policies). Encryption is used for the layer 3 method and is optional. Asymmetric UTM inspection supports TCP only; UDP and ICMP are not supported. The group ID must match.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-033",
    topic: "1.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Standalone configuration sync was enabled on three new branch FortiGates. The administrator expected FGT-A, which holds the finished configuration, to be the source, but FGT-A's configuration was overwritten. What should have been configured on FGT-A before enabling standalone-config-sync?",
    exhibit: String.raw`FGT-A # get system ha status
HA Health Status: OK
Model: FortiGate-101F
Mode: ConfigSync
Group Name:
Group ID: 0
...
Primary selected using:
    <2026/10/27 08:02:11> FG101FTK26000303 is selected as the primary because its uptime is larger than peer member FG101FTK26000301.
ses_pickup: disable
override: disable
Configuration Status:
    FG101FTK26000301(updated 2 seconds ago): in-sync
    FG101FTK26000303(updated 1 seconds ago): in-sync`,
    options: [
      "A unique group-member-id under config system standalone-cluster",
      "Nothing; the unit with the lowest serial number is always the configuration source",
      "session-pickup enable, because configuration sync runs over session sync",
      "A higher HA priority with override enabled, because standalone-config-sync uses the HA primary selection logic",
    ],
    answer: [3],
    explanation: "Standalone configuration synchronization is derived from the HA primary selection mechanism, and Fortinet warns that the wrong unit can win and overwrite existing configuration. The documented source unit sets `priority 255` and `override enable` so priority beats uptime. group-member-id belongs to FGSP session sync, which is a separate feature. Config sync does not depend on session pickup, and serial number is only the last tie-breaker (highest wins, not lowest).",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-034",
    topic: "1.2",
    type: "single",
    difficulty: 2,
    stem: "A branch has a FortiGate 200F and a Cisco ISR router on the same LAN. Both must back each other up as the users' default gateway using a standards-based protocol, and the FortiGate should be preferred. Which HA option fits?",
    options: [
      "FGCP virtual clustering with the ISR in virtual cluster 2",
      "FGSP between the FortiGate and the ISR",
      "VRRP on the FortiGate LAN interface and the ISR, with the FortiGate at the higher priority",
      "FGCP active-passive between the FortiGate and the ISR",
    ],
    answer: [2],
    explanation: "VRRP (v2 and v3) is standards based and FortiOS supports VRRP domains that mix FortiGates of different models and other vendors' routers. FGCP and its virtual clustering require identical FortiGates. FGSP synchronizes sessions between FortiGates only and provides no shared gateway address.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-035",
    topic: "1.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which MAC address do LAN hosts learn for their gateway 10.1.20.1 while FGT-A is the VRRP primary?",
    exhibit: String.raw`FGT-A # show system interface port2
config system interface
    edit "port2"
        set ip 10.1.20.2 255.255.255.0
        set vrrp-virtual-mac enable
        config vrrp
            edit 20
                set vrip 10.1.20.1
                set priority 200
            next
        end
    next
end`,
    options: [
      "00-09-0F-09-00-14",
      "The burned-in MAC address of FGT-A port2",
      "00-00-5E-00-01-20",
      "00-00-5E-00-01-14",
    ],
    answer: [3],
    explanation: "With `vrrp-virtual-mac enable`, the VRRP virtual MAC is `00-00-5E-00-01-<VRID in hex>`; VRID 20 is 0x14. \"20\" is the decimal mistake. The interface MAC is used only when vrrp-virtual-mac is disabled (the default). 00-09-0F-09 is the FGCP virtual MAC prefix, not VRRP.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  {
    id: "d1-036",
    topic: "1.2",
    type: "fill",
    difficulty: 2,
    stem: "Under `config vrrp` on a FortiGate interface, which option sets up to two remote destination addresses that the primary monitors, so that it stops acting as primary when they become unreachable? (Enter the option name.)",
    answer: ["vrdst", "set vrdst"],
    explanation: "`set vrdst <ip> [<ip>]` monitors up to two destinations. Combined with `vrdst-priority`, the primary advertises a lower priority when it cannot reach them, which speeds up failover.",
    lesson: "1.2-vcluster-fgsp-vrrp",
  },
  // ---------------------------------------------------------------- 1.3 VLANs and VDOMs
  {
    id: "d1-037",
    topic: "1.3",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about VLAN subinterfaces on a FortiGate in NAT mode are true? (Choose two.)",
    options: [
      "A VLAN subinterface can be selected as an FGCP heartbeat interface",
      "Traffic between two VLAN subinterfaces of the same parent is bridged without a firewall policy",
      "Two subinterfaces of the same physical interface can share a VLAN ID if they have different IP subnets",
      "A VLAN subinterface can be assigned to a different VDOM than its physical parent interface",
      "The same VLAN ID can be used on subinterfaces of two different physical interfaces",
    ],
    answer: [3, 4],
    explanation: "VLAN IDs only need to be unique per parent interface, and a subinterface can live in a different VDOM than its parent. Two subinterfaces on one parent cannot share an ID whatever their addressing. FGCP heartbeats are not supported on VLAN subinterfaces. Traffic between VLAN subinterfaces is routed through the FortiGate and needs a firewall policy.",
    lesson: "1.3-vlans-switching",
  },
  {
    id: "d1-038",
    topic: "1.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Users on VLAN 100 can open file shares on the servers in VLAN 200. The backup server 10.1.200.50 cannot start a backup job that connects to the user PCs on TCP 445. What is required?",
    exhibit: String.raw`FGT-Hub # show firewall policy
config firewall policy
    edit 21
        set name "Users-to-Servers"
        set srcintf "VLAN100-Users"
        set dstintf "VLAN200-Servers"
        set action accept
        set srcaddr "Users-Net"
        set dstaddr "Servers-Net"
        set schedule "always"
        set service "HTTPS" "SMB"
    next
end`,
    options: [
      "Moving both VLANs into one software switch so that they can talk without a policy",
      "A second policy from VLAN200-Servers to VLAN100-Users that allows the backup server to the users on SMB",
      "A static route on the backup server to 10.1.100.0/24 through the FortiGate",
      "NAT on policy 21, so that return traffic from the servers is translated",
    ],
    answer: [1],
    explanation: "Policy 21 allows sessions **initiated** from VLAN 100; replies to those sessions pass statefully. A session initiated by the backup server is a new session in the other direction and needs its own policy. NAT does not create a reverse permission. The servers already use the FortiGate VLAN interface as gateway. Putting different subnets in one software switch is not how VLAN segmentation works and would remove the segmentation.",
    lesson: "1.3-vlans-switching",
  },
  {
    id: "d1-039",
    topic: "1.3",
    type: "single",
    difficulty: 1,
    stem: "A branch FortiGate must put two wired ports and the staff SSID in the same subnet so that wired and wireless devices share one broadcast domain. Which interface type meets this requirement?",
    options: [
      "Hardware switch",
      "Aggregate (802.3ad) interface",
      "Software switch",
      "VLAN switch (virtual VLAN switch)",
    ],
    answer: [2],
    explanation: "Only a **software switch** can include wireless SSIDs alongside physical ports; it is processed by the CPU. Hardware switches and VLAN switch mode are built on the switch chip and do not support SSIDs. An aggregate bundles links to one peer and does not join an SSID.",
    lesson: "1.3-vlans-switching",
  },
  {
    id: "d1-040",
    topic: "1.3",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about software switches compared with hardware switches are true in FortiOS 7.6? (Choose two.)",
    options: [
      "Hardware switches can include wireless SSIDs",
      "Software switches are not supported by FGCP active-active load balancing",
      "Software switches are processed by the hardware switch controller",
      "Software switches support STP",
      "Software switch traffic is processed by the CPU",
    ],
    answer: [1, 4],
    explanation: "A software switch is implemented in software (CPU), supports SSIDs, does not support STP and is not supported by A-A load balancing. A hardware switch is processed by the switch controller (or SPU), supports STP and does not support SSIDs.",
    lesson: "1.3-vlans-switching",
  },
  {
    id: "d1-041",
    topic: "1.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. On a FortiGate 60F, the administrator tries to assign internal1 and internal2 to VLAN 10 of the hardware switch. Why does the command fail?",
    exhibit: String.raw`FGT-Spoke1 # config system virtual-switch
FGT-Spoke1 (virtual-switch) # edit "VLAN10"
new entry 'VLAN10' added
FGT-Spoke1 (VLAN10) # set physical-switch "sw0"
FGT-Spoke1 (VLAN10) # set vlan 10
command parse error before 'vlan'
Command fail. Return code -61`,
    options: [
      "The VLAN must first be created as a VLAN subinterface of sw0 with set type vlan",
      "VLAN switch mode is not enabled; set virtual-switch-vlan enable under config system global first",
      "The 60F does not support VLAN switch mode in FortiOS 7.6",
      "VLAN IDs on a hardware switch must be above 1000",
    ],
    answer: [1],
    explanation: "The `vlan` option of `config system virtual-switch` only becomes available after `config system global` → `set virtual-switch-vlan enable` (the option is disabled when unset, enabled after a factory reset). The 60F is on the 7.6 list of supported models. No minimum VLAN ID applies, and VLAN switch interfaces are not created as VLAN subinterfaces.",
    lesson: "1.3-vlans-switching",
  },
  {
    id: "d1-042",
    topic: "1.3",
    type: "fill",
    difficulty: 2,
    stem: "In VLAN switch mode, which command entered under `config system interface` → `edit internal5` makes that hardware switch port carry 802.1Q-tagged traffic for the VLAN switches? (Enter the full set command.)",
    answer: ["set trunk enable"],
    explanation: "`set trunk enable` on a hardware switch port designates it as a trunk port, carrying the tagged VLANs of the VLAN switches, for example toward an upstream FortiGate or the other HA member.",
    lesson: "1.3-vlans-switching",
  },
  {
    id: "d1-043",
    topic: "1.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Hosts in Tenant-A cannot reach the internet. In the root VDOM, `diagnose debug flow` shows packets from 10.1.0.25 arriving on TA-lnk1 and then `reverse path check fail, drop`. What is the fix?",
    exhibit: String.raw`VDOM Tenant-A
  Route   0.0.0.0/0 via 10.255.1.1, TA-lnk0
  Policy  port2 -> TA-lnk0, accept, NAT disabled

VDOM root
  Route   0.0.0.0/0 via 203.0.113.1, port1
  Policy  TA-lnk1 -> port1, accept, NAT enabled

Inter-VDOM link TA-lnk: TA-lnk0 10.255.1.2/30 (Tenant-A), TA-lnk1 10.255.1.1/30 (root)
Tenant-A LAN on port2: 10.1.0.0/16`,
    options: [
      "Add a static route in the root VDOM to 10.1.0.0/16 via 10.255.1.2 on TA-lnk1",
      "Disable NAT on the root VDOM policy",
      "Change the VDOM link type to ethernet, because PPP links cannot carry return traffic",
      "Add a policy in Tenant-A from TA-lnk0 to port2 for the replies",
    ],
    answer: [0],
    explanation: "Tenant-A does not NAT, so root sees source 10.1.0.25 arriving on TA-lnk1. FortiOS's default (feasible-path) reverse path check needs at least one active route back to the source **through the incoming interface**; root's only route to 10.1.0.25 is the default route through port1, so the packet is dropped before policy lookup. Add a route in root to 10.1.0.0/16 via 10.255.1.2 on TA-lnk1 (or enable NAT in Tenant-A, as Fortinet's documented example does); the same route also carries the replies back. Disabling NAT in root would send private addresses to the internet and does not fix the RPF drop. PPP links carry traffic both ways. Replies to an accepted session need no extra policy.",
    lesson: "1.3-vdoms-inter-vdom",
  },
  {
    id: "d1-044",
    topic: "1.3",
    type: "single",
    difficulty: 2,
    stem: "On the FortiGate-VM permanent trial in multi-VDOM mode, root is the admin VDOM and LAN-VDOM is a traffic VDOM. The administrator builds a VDOM link from LAN-VDOM to root and a policy in root from the link to port1, expecting root to forward internet traffic. Traffic never leaves root. Why?",
    options: [
      "An admin-type VDOM is used only to manage the FortiGate and cannot pass traffic",
      "VDOM links are not supported on FortiGate-VM",
      "The management VDOM must be a traffic VDOM before policies can be created in any VDOM",
      "Inter-VDOM links require NPU acceleration, which FortiGate-VM does not have",
    ],
    answer: [0],
    explanation: "The admin VDOM type is for management access only: administrators can log in through it, but **traffic cannot pass through it**. The internet uplink must be in a traffic VDOM. VDOM links work on FortiGate-VM (regular links are not offloaded anyway). Policies can be created in any traffic VDOM regardless of which VDOM is the management VDOM.",
    lesson: "1.3-vdoms-inter-vdom",
  },
  {
    id: "d1-045",
    topic: "1.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. After a redesign, the MGMT VDOM sits on an isolated out-of-band network with no internet access. FortiGuard updates and web filter ratings now fail, while users in the root VDOM still browse the internet. What should be configured?",
    exhibit: String.raw`FGT-Hub # config global
FGT-Hub (global) # show system global | grep management-vdom
    set management-vdom "MGMT"

VDOM root:  port1 to the internet, default route via 203.0.113.1
VDOM MGMT:  port8 to 172.31.0.0/24 (out-of-band only)`,
    options: [
      "A firewall policy in the root VDOM from port8 to port1",
      "An inter-VDOM link between MGMT and root with a default route, because FortiGuard always uses the management VDOM",
      "config system fortiguard → set vdom root, plus DNS that resolves through the root VDOM",
      "Change the MGMT VDOM type to traffic",
    ],
    answer: [2],
    explanation: "FortiGuard traffic originates from the management VDOM by default. When that VDOM has no internet access, FortiOS lets you move FortiGuard services to a traffic VDOM with `config system fortiguard` → `set vdom \"root\"` (and that VDOM needs a gateway and DNS, for example `config system vdom-dns`). port8 is not in root, so a root policy cannot match it. A VDOM link with a route could work but is not required, and the option's reason is wrong. The VDOM type does not change where local-out traffic leaves.",
    lesson: "1.3-vdoms-inter-vdom",
  },
  {
    id: "d1-046",
    topic: "1.3",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about per-VDOM administrators in FortiOS 7.6 are true? (Choose two.)",
    options: [
      "They use prof_admin or a custom profile; super_admin cannot be used at VDOM level",
      "Their VDOM's resources are limited to an equal share of the FortiGate by default",
      "An administrator assigned to several VDOMs can be created inside any one of those VDOMs",
      "They see the global settings in read-only mode",
      "They can log in only through an interface that belongs to their VDOM (or the console)",
    ],
    answer: [0, 4],
    explanation: "Per-VDOM administrators must use prof_admin or a custom profile and can only reach the FortiGate through an interface in their VDOM with management access (or the console). They do not see global settings. Per-VDOM resources are **unlimited** by default. An administrator for multiple VDOMs must be created at the global level.",
    lesson: "1.3-vdoms-inter-vdom",
  },
  {
    id: "d1-047",
    topic: "1.3",
    type: "match",
    difficulty: 2,
    stem: "Match each inter-VDOM link item with the correct FortiOS 7.6 statement.",
    pairs: [
      ["type ppp", "Default link type, point-to-point"],
      ["type ethernet", "Needed when the link requires layer 2 behaviour, such as an IPv6 link-local address for OSPFv3"],
      ["type npupair", "NPU VDOM link used for hardware acceleration"],
      ["VDOM link name", "Up to 11 characters and must not match a VDOM name"],
    ],
    explanation: "VDOM links default to PPP. Ethernet type is used when the link needs Ethernet behaviour (Fortinet's example is a link-local address for OSPF in IPv6). Regular VDOM links are not offloaded; NPU VDOM links are. Link names are limited to 11 characters and cannot equal a VDOM name; FortiOS creates <name>0 and <name>1.",
    lesson: "1.3-vdoms-inter-vdom",
  },
  {
    id: "d1-048",
    topic: "1.3",
    type: "fill",
    difficulty: 1,
    stem: "Which command, entered under `config system global`, enables multiple VDOMs on a FortiGate running FortiOS 7.6? (Enter the full set command.)",
    answer: ["set vdom-mode multi-vdom"],
    explanation: "`set vdom-mode multi-vdom` (the other value is `no-vdom`). The session is logged out and the existing configuration moves into the root VDOM.",
    lesson: "1.3-vdoms-inter-vdom",
  },
  // ---------------------------------------------------------------- 1.4 SD-WAN
  {
    id: "d1-049",
    topic: "1.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator wants a firewall policy from the LAN (port3) to the internet over both ISPs. Which outgoing interface must the policy use?",
    exhibit: String.raw`FGT-Spoke1 # show system sdwan
config system sdwan
    set status enable
    config zone
        edit "virtual-wan-link"
        next
        edit "ISP"
        next
    end
    config members
        edit 1
            set interface "port1"
            set zone "ISP"
            set gateway 192.0.2.1
        next
        edit 2
            set interface "port2"
            set zone "ISP"
            set gateway 198.51.100.1
        next
    end
end`,
    options: [
      "virtual-wan-link",
      "Any interface, because SD-WAN rules override the policy's outgoing interface",
      "ISP",
      "port1 and port2",
    ],
    answer: [2],
    explanation: "Firewall policies reference **SD-WAN zones**; individual members cannot be used in policies. Both members are in the zone ISP, so the policy uses ISP. virtual-wan-link is the default zone but has no members here. SD-WAN rules choose a member inside the zone allowed by the policy; they do not replace the policy.",
    lesson: "1.4-sdwan-components-dia",
  },
  {
    id: "d1-050",
    topic: "1.4",
    type: "match",
    difficulty: 1,
    stem: "Match each SD-WAN component with its role.",
    pairs: [
      ["Member", "An interface (physical, VLAN, IPsec, and so on) that SD-WAN can steer traffic over"],
      ["Zone", "A group of members used as source or destination interface in firewall policies"],
      ["Performance SLA", "Probes a server over members to measure loss, latency and jitter and detect dead links"],
      ["SD-WAN rule", "Matches traffic and picks a member by strategy"],
      ["Implicit rule", "Load balances traffic that no rule matched, using load-balance-mode"],
    ],
    explanation: "Members are the interfaces; zones group them for policies and routes; performance SLAs (health checks) measure path quality and remove failed members' routes; SD-WAN rules (services) steer matching traffic; the implicit rule handles everything else (default source-ip-based).",
    lesson: "1.4-sdwan-components-dia",
  },
  {
    id: "d1-051",
    topic: "1.4",
    type: "single",
    difficulty: 2,
    stem: "A retail chain's branches have only an MPLS circuit plus an IPsec overlay over it to the data centre hub. Compliance requires all internet traffic to be inspected and logged by the hub's security stack with a single egress IP. Which topology meets the requirement?",
    options: [
      "Remote internet access: branch internet traffic follows the overlay to the hub and leaves through the hub's WAN",
      "Direct internet access with a performance SLA probing the hub",
      "ADVPN shortcuts between branches for internet traffic",
      "Direct internet access on the MPLS member with NAT at each branch",
    ],
    answer: [0],
    explanation: "RIA sends internet requests across the overlay and out of the hub's WAN, giving central inspection and one egress IP, and is the design for branches that have no local internet breakout. DIA would break out locally (and MPLS normally has no internet). An SLA target does not change the path. ADVPN shortcuts are for branch-to-branch traffic.",
    lesson: "1.4-sdwan-components-dia",
  },
  {
    id: "d1-052",
    topic: "1.4",
    type: "single",
    difficulty: 3,
    stem: "A branch has one ISP (port1, zone WAN1) and an MPLS overlay to the hub (HUB1-VPN1, zone HUB1). Requirements: internet traffic breaks out locally while the ISP is healthy and uses the hub when the ISP fails; the hub already allows and NATs branch internet traffic. Which configuration on the branch meets both requirements?",
    options: [
      "A policy LAN → WAN1 and HUB1 for internet destinations, default routes through both zones, and an SD-WAN rule for internet traffic listing port1 first and HUB1-VPN1 second",
      "A policy LAN → HUB1 only, because remote internet access cannot be combined with direct internet access",
      "A policy LAN → WAN1 only, and a default route through HUB1 with a higher distance",
      "Two policies LAN → WAN1 and LAN → HUB1, and update-static-route disabled on the internet health check",
    ],
    answer: [0],
    explanation: "Hybrid DIA with RIA fallback needs the policy to allow both zones, candidate routes through both, and a rule that prefers the local ISP member and falls back to the overlay (for example lowest cost or manual order with a health check). A policy that only allows WAN1 blocks the fallback path even if the route exists. A HUB1-only policy removes DIA. Disabling update-static-route would keep the dead ISP's route in place, which is the opposite of what failover needs.",
    lesson: "1.4-sdwan-components-dia",
  },
  {
    id: "d1-053",
    topic: "1.4",
    type: "multi",
    difficulty: 2,
    stem: "Which two are recommended practices for an SD-WAN DIA design? (Choose two.)",
    options: [
      "Put the MPLS member in the same zone as the ISP members because all of them are WAN links",
      "Point the default route at the internet-facing zone(s) instead of at every SD-WAN member, including MPLS and overlays",
      "Set SLA targets well below the application's real tolerance so traffic moves at the first sign of degradation",
      "Configure two servers in the internet performance SLA so that one unreachable server does not mark the link dead",
      "Create one firewall policy per SD-WAN member so that each ISP can have its own security profiles",
    ],
    answer: [1, 3],
    explanation: "Fortinet documents that with two health-check servers both must fail before the member is considered down, so one dead server does not cause a false positive. Pointing the default route only at the zones with internet access avoids black-holing internet traffic into MPLS or overlay members that have no internet path. Zones group members that need the same security, so an MPLS member does not belong in the internet zone just because it is a WAN link. Fortinet advises SLA targets just under the application's real limits; targets that are too tight make traffic flap between links. Members cannot be used in policies; zones are.",
    lesson: "1.4-sdwan-components-dia",
  },
  {
    id: "d1-054",
    topic: "1.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. All internet sessions now leave through port1 even though the implicit rule uses source-ip-based load balancing over port1 and port2. Why?",
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan health-check Internet
Health Check(Internet):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(17.902), jitter(0.811) sla_map=0x1
Seq(2 port2): state(dead), packet-loss(100.000%) sla_map=0x0

FGT-Spoke1 # get router info routing-table static
Routing table for VRF=0
S*      0.0.0.0/0 [1/0] via 192.0.2.1, port1`,
    options: [
      "The static route must list port1 and port2 separately; a route to an SD-WAN zone only uses the first member",
      "port2 is out of SLA but alive, and the implicit rule never uses out-of-SLA members",
      "source-ip-based load balancing always prefers the member with the lowest sequence number",
      "port2 failed its health check, so update-static-route withdrew the static route through port2 and only port1 has a route",
    ],
    answer: [3],
    explanation: "port2 is **dead** (100% loss after failtime failures). With update-static-route (enabled by default) FortiOS removes the static routes through a failed member, so only port1's default route remains and the implicit rule can only use port1. Source-IP hashing would otherwise spread hosts over both. port2 is dead, not merely out of SLA. A static route to a zone installs one route per member while the members are healthy, so both would normally appear.",
    lesson: "1.4-sdwan-components-dia",
  },
  {
    id: "d1-055",
    topic: "1.4",
    type: "fill",
    difficulty: 2,
    stem: "Under `config system sdwan`, which option selects the algorithm the implicit rule uses to spread traffic over members (for example source-ip-based or weight-based)? (Enter the option name.)",
    answer: ["load-balance-mode", "set load-balance-mode"],
    explanation: "`set load-balance-mode {source-ip-based | weight-based | usage-based | source-dest-ip-based | measured-volume-based}`; the default is source-ip-based.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-056",
    topic: "1.4",
    type: "order",
    difficulty: 2,
    stem: "With default performance SLA settings and update-static-route enabled, place the events in order when the ISP behind port2 stops answering health-check probes.",
    items: [
      "Probes sent through port2 every 500 ms go unanswered",
      "After 5 consecutive failures, port2 is marked dead in the health check",
      "Static routes through port2 are withdrawn and a \"Routing information changed\" event is logged",
      "New sessions are routed through the remaining member",
    ],
    explanation: "The default interval is 500 ms and failtime is 5, so after five failed probes the member goes dead. update-static-route then removes the routes through it (system event logid 0100022921), and new sessions can only use members that still have routes. Recovery needs recoverytime (default 5) successful probes.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-057",
    topic: "1.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The health check has one SLA target. Which statement about port2 is correct?",
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan health-check Office365
Health Check(Office365):
Seq(1 port1): state(alive), packet-loss(0.000%) latency(22.310), jitter(1.904) sla_map=0x1
Seq(2 port2): state(alive), packet-loss(3.000%) latency(61.745), jitter(14.230) sla_map=0x0`,
    options: [
      "port2 is dead and its routes have been removed",
      "port2 meets SLA target 1; sla_map=0x0 means no target is configured",
      "port2 is preferred by lowest cost (SLA) rules because it has the higher sequence number",
      "port2 is up but currently fails SLA target 1, so lowest cost (SLA) rules prefer port1 while port1 meets the SLA",
    ],
    answer: [3],
    explanation: "`state(alive)` is link status, so port2 is up and keeps its routes. `sla_map` is a bitmap of the SLA targets met; 0x0 means it fails target 1 while port1 (0x1) meets it. Lowest cost (SLA) rules therefore prefer port1. Sequence numbers do not give preference.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-058",
    topic: "1.4",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Which member does rule 1 send new matching sessions to, and why?",
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan service4
Service(1): Address Mode(IPV4) flags=0x200
  Gen(3), TOS(0x0/0x0), Protocol(0: 1->65535), Mode(sla), sla-compare-order
  Members(2):
    1: Seq_num(2 port2), alive, sla(0x1), gid(0), cfg_order(0), cost(0), selected
    2: Seq_num(1 port1), alive, sla(0x0), gid(0), cfg_order(1), cost(0), selected
  Src address(1):
        10.1.100.0-10.1.100.255
  Dst address(1):
        0.0.0.0-255.255.255.255`,
    options: [
      "port2, because it is the only member that meets the SLA in this lowest cost (SLA) rule",
      "Neither; the rule is inactive because one member is out of SLA",
      "port1, because member sequence 1 is always preferred",
      "port1 and port2 alternately, because both members are alive",
    ],
    answer: [0],
    explanation: "Mode(sla) is the lowest cost (SLA) strategy. Members that meet the SLA are preferred, then cost and configuration order break ties, and the list is printed in that preference order. port2 meets the SLA (`sla(0x1)`) and is listed first; port1 is alive but out of SLA, so it is still `selected` but only as the fallback listed second. Sequence numbers give no preference. Alternating would be load-balance mode. A rule stays active as long as a member has a valid route.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-059",
    topic: "1.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which implicit rule load-balance mode is configured?",
    exhibit: String.raw`FGT-Spoke1 # diagnose sys sdwan member
Member(1): interface: port1, flags=0x0 , gateway: 192.0.2.1, priority: 1 1024, weight: 33
  Session count: 412
Member(2): interface: port2, flags=0x0 , gateway: 198.51.100.1, priority: 1 1024, weight: 66
  Session count: 851`,
    options: [
      "weight-based",
      "measured-volume-based",
      "source-ip-based",
      "usage-based",
    ],
    answer: [0],
    explanation: "In weight-based mode the member output shows each member's weight and a **Session count**, and sessions are spread in proportion to the weights (here about 1:2). Source-IP and source-destination modes show weight 0 and no counters. Usage-based (spillover) shows spillover thresholds and over-bps flags. Measured-volume-based shows the configured volume ratio and the bytes read or volume room.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-060",
    topic: "1.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. What does this log tell the administrator?",
    exhibit: String.raw`date=2026-10-29 time=10:41:07 logid="0113022925" type="event" subtype="sdwan" level="notice" vd="root" logdesc="SDWAN SLA information" eventtype="SLA" healthcheck="Office365" slatargetid=1 interface="port2" status="up" latency="61.745" jitter="14.230" packetloss="3.000%" slamap="0x0" metric="packetloss" msg="Health Check SLA status. SLA failed due to being over the performance metric threshold."`,
    options: [
      "port2 is down and its static routes were removed",
      "port2 is up but fails SLA target 1 because its packet loss is over the threshold; this log repeats every sla-fail-log-period",
      "The SD-WAN rule Office365 moved its traffic from port1 to port2",
      "The log is generated once when the link recovers",
    ],
    answer: [1],
    explanation: "logid 0113022925 (SDWAN SLA information) is the periodic SLA log: sent every `sla-fail-log-period` while failing and `sla-pass-log-period` while passing. `status=\"up\"` is link state; `slamap=\"0x0\"` with `metric=\"packetloss\"` says target 1 is failed on packet loss. Route removal is logged as a system event (0100022921), and rule member changes as SDWAN status events (0113022923) with eventtype Service.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-061",
    topic: "1.4",
    type: "match",
    difficulty: 3,
    stem: "Match each log ID with the event it records in FortiOS 7.6 SD-WAN.",
    pairs: [
      ["0113022923", "SDWAN status: SLA pass member count, member in/out of SLA, or a rule's selected member changed"],
      ["0113022924", "SDWAN volume status: member enters or leaves conservative status in volume or session balancing"],
      ["0113022925", "SDWAN SLA information: periodic SLA pass or fail report with latency, jitter and loss"],
      ["0100022921", "Routing information changed: a health check removed or restored a member's static route"],
    ],
    explanation: "SD-WAN event logs use subtype sdwan with 0113022923 (status), 0113022924 (volume status) and 0113022925 (SLA information, at the fail and pass log periods). When a health check takes a link down or up, the static route change is logged as a system event, 0100022921.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-062",
    topic: "1.4",
    type: "single",
    difficulty: 1,
    stem: "An administrator wants a donut chart showing how many active sessions each SD-WAN member currently carries. Where is it in the FortiOS 7.6 GUI?",
    options: [
      "Network > SD-WAN, Performance SLAs tab, Latency view",
      "Network > SD-WAN, SD-WAN Zones tab, Sessions view",
      "Policy & Objects > Firewall Policy, Bytes column",
      "Log & Report > System Events, SD-WAN events",
    ],
    answer: [1],
    explanation: "The SD-WAN Zones tab offers Bandwidth (download/upload per interface), Volume (donut of sent and received bytes) and **Sessions** (donut of active sessions per interface). The Performance SLAs tab charts packet loss, latency and jitter. Event logs list changes, not live session shares.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-063",
    topic: "1.4",
    type: "fill",
    difficulty: 2,
    stem: "Which diagnose command shows the roughly 10-minute history of latency, jitter and packet loss that a performance SLA recorded for a member? (Enter the command without arguments.)",
    answer: ["diagnose sys sdwan sla-log", "diag sys sdwan sla-log"],
    explanation: "`diagnose sys sdwan sla-log <health-check> <member-seq>` prints the recent per-probe history. `diagnose sys sdwan intf-sla-log <interface>` shows per-interface bandwidth samples, and `diagnose sys sdwan health-check` shows the current state.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-064",
    topic: "1.4",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about SD-WAN performance SLAs in FortiOS 7.6 are true? (Choose two.)",
    options: [
      "Latency and jitter are calculated over the last 30 probes",
      "A green arrow on the Performance SLAs page means the member meets the SLA target",
      "The default check interval is 1 second",
      "When two servers are configured, the health check fails only when both are unreachable",
      "The same server IP can be used in several health checks at once",
    ],
    answer: [0, 3],
    explanation: "With two servers both must fail for the check to fail, and latency and jitter use the last 30 probes (packet loss the last 100). The green arrow only means the server responds, not that targets are met. The default interval is 500 ms. A server can be used in only one performance SLA at a time.",
    lesson: "1.4-sdwan-monitoring",
  },
  {
    id: "d1-065",
    topic: "1.4",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Rule 2 should steer data centre traffic over the overlays, but sessions to 10.100.0.0/16 leave through the ISP members instead. Both IPsec tunnels are down. What explains this?",
    exhibit: String.raw`FGT-Spoke1 # show system sdwan
...
    config service
        edit 2
            set name "DC-Apps"
            set mode sla
            set dst "DC-Net"
            set priority-zone "HUB1"
            config sla
                edit "HUB-HC"
                    set id 1
                next
            end
        next
    end
...
FGT-Spoke1 # get router info routing-table details 10.100.0.10
Routing table for VRF=0
Routing entry for 0.0.0.0/0
  Known via "static", distance 1, metric 0, best
  * vrf 0 192.0.2.1, via port1
  * vrf 0 198.51.100.1, via port2`,
    options: [
      "Lowest cost (SLA) rules fall back to ISP members automatically when every overlay is out of SLA",
      "Rule 2 is skipped because none of its HUB1 members has a valid route to the destination, so later rules or the implicit rule handle the traffic",
      "The default route has a lower distance than the SD-WAN rule, so routing wins over SD-WAN rules",
      "The rule needs set load-balance enable to use the overlay members",
    ],
    answer: [1],
    explanation: "An SD-WAN rule only uses members that have a valid route to the destination. With both tunnels down, no route to 10.100.0.0/16 exists via HUB1, so the rule is inactive and skipped; the traffic matches the default route through the ISP members. A rule never adds members it does not list. Load balancing would not create a route. SD-WAN rules are evaluated before the routing table, but only over members with routes; there is no distance comparison between rules and routes.",
    lesson: "1.4-sdwan-monitoring",
  },
];
