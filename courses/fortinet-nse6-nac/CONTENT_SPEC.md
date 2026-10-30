# Content Spec — Fortinet NSE 6 FortiNAC-F 7.6 Administrator

Targets the **official Fortinet NSE 6 - FortiNAC-F 7.6 Administrator exam topics** in
`content/blueprint.js` (training.fortinet.com exam page, checked 2026-10-29; product
"FortiNAC-F 7.6, FortiOS 7.6"; 60 minutes, 30–35 questions, English). Every lesson,
question and flashcard is tagged with a blueprint topic id; together the lessons must
cover **every** sub bullet. Fortinet's page drops letters in several bullets
("ailover", "abric", "N+", "etermin" …); the blueprint restores them, and "N+" is
written "N+1" as the FortiNAC-F docs name it.

**File formats, question types, mix guide, lesson structure, callouts, exam style
and the ground rules are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read it
first and follow it.** Only these points differ:

1. **Product and version.** FortiNAC-F **7.6**: the "F" series running
   **FortiNAC-OS** (Linux-based, FortiOS-style CLI), not legacy FortiNAC on CentOS
   (9.x and the CentOS 7.x builds; see the docs' "CentOS to FortiNAC-OS migration
   guides"). The exam's recommended references are the FortiNAC-F 7.6
   Administration Guide, Deployment Guide and FortiNAC Manager guide
   (docs.fortinet.com/product/fortinac-f/7.6); also use the 7.6 High Availability
   (FortiNAC-OS), N+1 Failover Group and Load Balancing, Configuration Wizard,
   Device Profiler and CLI Reference Manual guides. The newest release is
   **F 7.6.7**, and the "7.6.0" doc URLs now serve 7.6.7-era pages (for example
   State Based Access Control Rules says "In this release - 7.6.7"). Say which
   build a behaviour belongs to and flag 7.6.x changes: N+1 failover groups managed
   by FortiNAC-M are **new in 7.6** (before 7.6 only 1+1); failure detection plus
   failover dropped from about 10–15 min to about **1–5 min in F 7.6.3**; **F 7.6.7**
   added RADIUS-only device support with a selector-based architecture, State
   Based Access Control Rules (Network > Configuration; 6 predefined membership
   actions), sending remote groups to FortiGate, a five-layer failover health
   check ("True Hot Standby") for 1+1 and N+1, IPv6, and OUI regex for randomized
   MACs. The self-paced course build is not published; write questions that hold
   across 7.6.x, or name the build in the stem.
2. **FortiNAC-F CLI must be real.** Verified in the 7.6 CLI Reference Manual
   (base context): `get system status`, `get system ha status`, `get system
   license`, `get hardware status`, `config system ha` (`set public-key …`,
   `show full-configuration`, `end`/`abort`), `config system interface`,
   `execute ha failover`, `execute enter-shell`, `execute db-shell`, `execute
   backup config {local|scp|ftp|tftp}`, `execute restore config …`, `execute
   restore database …`, `execute tcpdump [-i=<port>] …`, `execute ping`,
   `execute license vm <token>` (FortiFlex), `execute factoryreset all-settings`,
   `diagnose tail -F output.master`, `diagnose debug plugin list | enable <name>
   | disable <name>`, `diagnose debug logger list | set <log level> <log name>`,
   `diagnose host list (all | mac=<mac> | …)`, `diagnose host device-profiling
   rules scan mac <mac>`, `diagnose network device display ip=<ip>`, `diagnose
   network device test-snmp ip=<ip>`, `diagnose network mac-notification-stats
   all`, `diagnose network snmp walk <ip> <oid>`, `diagnose network radius
   send-coa disconnect <ip> <mac>`, `diagnose network vlan change <ip> <port>
   <vlan>`, `diagnose network sso session-list`, `diagnose system health-check
   display …`, `diagnose sql db-size`. Shell (`execute enter-shell`): `shutdownNAC`
   (idles; `-kill` forces HA failover), `startupNAC`, `SendCoA`, `DeviceImport`,
   `sudo grab-log-snapshot`. CentOS-era habits (root shell first, `/bsc/…`
   paths, other legacy scripts) are not FortiNAC-F 7.6 answers. Copy syntax
   exactly, including the `key=value` selectors; don't invent subcommands or
   output fields. No `diagnose debug enable` / `diagnose debug flow` here — those
   are FortiOS.
3. **Concepts that must be exact (verify each in the 7.6 docs):**
   - *Architecture and onboarding:* port1 = management (GUI `https://<port1>:8443/`,
     first login `root`/`YAMS`, CLI admin separate from GUI accounts), port2 =
     isolation services (DHCP, DNS, captive portal); Server vs Control/Application
     (CA) vs Manager (FortiNAC-M) roles; endpoint licences (Base/Plus/Pro;
     perpetual key vs subscription from FortiCloud, polled every 12 h); host
     states (rogue, registered, profiled device, at risk, disabled) and
     **registration** (automatic via device profiling, manual, portal, CSV import).
   - *Isolation networks / Config Wizard:* network type None (captive portal off)
     vs Layer 2 (802.1Q isolation VLANs to port2) vs Layer 3 (port2 on one untagged
     VLAN, routed isolation subnets, DHCP scopes); scopes Registration, Remediation,
     Dead End, VPN, Authentication, Isolation (and Access Point Management);
     reserved scope-label prefixes `REG_`, `REM_`, `AUTH_`, `DE_`, `ISOL_`, `VPN_`.
   - *Modeling and enforcement:* modeled infrastructure devices (SNMP read/write,
     CLI credentials, RADIUS), Topology/Inventory, groups, L2/L3 polling, **MAC
     notification traps** and link up/down traps, RADIUS (local RADIUS, CoA RFC 5176),
     VLAN switching vs RADIUS attributes vs CLI configurations; FortiSwitch
     (FortiLink and standalone), FortiAP/wireless controllers, FortiGate modeling.
   - *Policies:* user/host profiles (Where / Who-What by group / by attribute /
     When; identity priority logged-on user → registered user → registered host),
     network access policies (top-down, first match; catch-all last), network
     access configurations (VLAN, CLI configuration, VPN group), **logical
     networks** and per-device access values, endpoint compliance and portal
     policies, **firewall tags**, FortiNAC-F as a Fabric connector (Security Fabric
     Connection, FortiGate root IP, port 8013), group and tag information sent to
     FortiGate (dynamic addresses), "Quarantine via FortiNAC" automation action.
   - *Security automation:* security events from integrated devices (syslog,
     SNMP traps), custom security event parsers, triggers (filters, Time Limit,
     Filter Match Any/All), security rules (rank order; user/host profile = or ≠;
     alarm), actions (activities, Activity Failure continue/stop, Secondary Task
     Delay), Rule Match / Action Taken email groups; Security Incidents licence.
   - *Device profiling:* rogues vs classified devices, rule placement (Host view,
     Inventory, both), methods (Active, DHCP Fingerprinting, HTTP/HTTPS, IP Range,
     Location, Passive, Persistent Agent, RADIUS Requests, SNMP, SSH, TCP, Telnet,
     UDP, Vendor OUI, WinRM, WMI Profile, FortiGate, ONVIF, FortiGuard IoT …; **all
     selected methods must match**), Confirm Device Rule On Connect / On Interval,
     endpoint fingerprints, re-evaluating rogues (Users & Hosts > Device Profiling
     Rules > Run). The "Active" method's text in the 7.6 guide is inconsistent
     (Nmap per the Device Profiler settings page, "network sessions" per the rule
     page) — don't build a question on that detail.
   - *HA:* 1+1 primary/secondary (secondary pings every 30 s, required services,
     Idle state, resume control, VIP vs no-VIP) vs N+1 failover group (secondary CA
     checks primaries directly and indirectly; FortiNAC-M shows Standby →
     Promoted; FortiADC or backup IP options). The exam's "hot standby mode" is
     not defined in the docs — confirm what the course means before writing on it.
   - *Integration:* FortiNAC-F Manager (Global/Manager vs managed CAs,
     synchronising groups, logical networks and policies), FortiGate VPN (SSO,
     FortiGate VPN integration guide), MDM services and vendor OUI tables, syslog
     and SNMP trap input from third-party devices, alarms mapped to admin groups.
   - *Visibility:* Hosts view filters, Adapters, Network Sessions, firewall session
     polling, reports, user/host aging, logs (Events, Alarms, admin audit, syslog
     and FortiAnalyzer forwarding), backups and system recovery.
4. **Exhibit names.** FortiNAC-F CA `FNAC-CA1` (HA peer `FNAC-CA2`, N+1 secondary
   `FNAC-CA3`), manager `FNAC-M`, FortiGate `FGT-HQ` (VPN headend) and
   `FGT-Branch1`, FortiSwitch `FSW-Access1`, FortiAP `FAP-Floor2`, third-party
   switch `Cisco-Access1`; VLANs `10` Production, `100` Registration, `110`
   Remediation, `120` Dead End, `200` Guest; logical networks `Corp`, `Cameras`,
   `Contractor`, `Guest`; groups `Card Readers`, `IP Cameras`, `Contractors`;
   domain `corp.example.com`; MACs from `00:09:0F` (Fortinet OUI) or locally
   administered. Use RFC 5737 / private addressing.
5. **Lab reality.** No self-service free trial or permanent evaluation licence for
   the FortiNAC-F VM is documented on docs.fortinet.com (checked 2026-10-29: VM
   deployment, licensing and POC guides). The VM needs an appliance or endpoint
   licence key bound to port1's MAC and the VM UUID (FortiFlex tokens via `execute
   license vm`), and Fortinet's POC guide routes evaluations through a Fortinet SE
   or partner. So lab steps are **optional** and must say so; write them for a
   POC/partner/employer lab, and give a reading-only path (GUI menu paths, CLI
   output exhibits) for owners without one. A FortiGate-VM permanent trial can play
   the FortiGate side (fabric connector, firewall tags, VPN) within its 3-interface,
   3-policy limits.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
