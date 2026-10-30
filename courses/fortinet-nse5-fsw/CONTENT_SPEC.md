# Content Spec — Fortinet NSE 5 FortiSwitch 7.6 Administrator

Targets the **official Fortinet NSE 5 - FortiSwitch 7.6 Administrator exam topics** in
`content/blueprint.js` (training.fortinet.com exam page, checked 2026-10-29; product
"FortiSwitchOS 7.6, FortiOS 7.6"; 70 minutes, 35-40 questions, English and Japanese).
Every lesson, question and flashcard is tagged with a blueprint topic id.

**Fortinet publishes only 4 areas and 15 tasks for this exam — no weights and no
sub-bullets.** The `sub` lists in `blueprint.js` are this site's scope notes, taken
from chapter titles of the FortiLink Guide 7.6.1 and the FortiSwitchOS 7.6.1
Administration Guide (the versions the exam page links) and from the FortiSwitch 7.6
Administrator course objectives. Cover every one of them anyway, but never call them
"exam objectives" in lessons. The domain weights (40/20/20/20) are a site estimate
proportional to task count.

**File formats, question types, mix guide, lesson structure, callouts, exam style
and the ground rules are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read it
first and follow it.** Only these points differ:

1. **Product and version.** FortiSwitchOS **7.6** and FortiOS **7.6** (FortiLink),
   not 8.0. The exam's recommended references are the FortiSwitch 7.6 Administrator
   course, the **FortiSwitchOS 7.6 Administration Guide**, the **FortiLink Guide 7.6**
   (FortiOS 7.6) and the **FortiSwitchOS 7.6 CLI Reference**; the exam page links the
   7.6.1 editions, the newest FortiLink and FortiSwitchOS guides are 7.6.7
   (docs.fortinet.com, checked 2026-10-29). Teach the 7.6.1 behaviour and note later
   7.6.x changes only after checking them. Version notes already verified in the
   7.6.1 guides: **FortiLink neighbor detection uses LLDP by default starting in
   FortiOS 7.6.1** (`set fortilink-neighbor-detect {fortilink | lldp}`); FortiSwitchOS
   7.6.0 supports 128 ports in software (was 64), which allows more split ports;
   zero-touch management (FortiSwitchOS 7.2.0 + FortiOS 7.2.0 and later) connects a
   new switch to whichever manager is available — FortiGate, FortiLAN Cloud or
   FortiSwitch Manager — and only one manager is used at a time. **Cloud name:** the
   7.6 course page says **FortiEdge Cloud**; the 7.6.1 guides still say **FortiLAN
   Cloud**. Use "FortiEdge Cloud (called FortiLAN Cloud in the 7.6.1 guides)". Don't
   teach FortiOS 8.0-only switch-controller features (the Fortinet Video Library has
   several "FortiOS 8.0:" switch videos; they are marked `legacy` in `videos.js`).

2. **Two CLIs, and they must not be mixed up.** Most of the exam is **FortiLink
   mode**: the FortiSwitch is configured *from the FortiGate*, and Fortinet warns that
   changes made directly on a managed switch are unknown to the FortiGate and are
   lost when the switch restarts. Standalone mode uses the FortiSwitchOS CLI.
   - **FortiGate (FortiOS) side**, verified in the FortiLink Guide 7.6.1:
     `config system global` / `set switch-controller enable` (GUI: System > Feature
     Visibility > Switch Controller), `set switch-controller-reserved-network`
     (default `10.255.0.0/16`); `config system interface` / `edit "fortilink"` with
     `set fortilink enable`, `set member`, `set auto-auth-extension-device enable`,
     `set fortilink-split-interface`, `set fortilink-neighbor-detect`,
     `set switch-controller-mgmt-vlan` (default 4094), `set lldp-reception` /
     `set lldp-transmission`, and on VLAN interfaces `set switch-controller-dhcp-snooping
     enable` / `set switch-controller-arp-inspection`; `config switch-controller
     managed-switch` / `edit <serial>` with `set fsw-wan1-admin enable` (manual
     authorization), `config ports` / `edit portN` (`set stp-state`, `set edge-port`,
     `set stp-bpdu-guard`, `set stp-bpdu-guard-timeout` (0–120 min, default 5; the
     FortiLink Guide 7.6.1 example prints `stp-bpdu-guard-time`, but the FortiOS 7.6.1
     CLI Reference and FortiSwitchOS use `-timeout`), `set stp-root-guard`, `set
     loop-guard`, `set loop-guard-timeout`, `set dhcp-snooping {trusted | untrusted}`,
     `set ip-source-guard`, `set export-to`, `set export-to-pool`), `config
     ip-source-guard`, `config stp-settings` / `set local-override`, `config
     stp-instance`; `config switch-controller initial-config template` and `config
     switch-controller initial-config vlans` (VLAN interface templates — only before
     any switch is authorized); `config switch-controller stp-settings`, `config
     switch-controller stp-instance`, `config switch-controller global`
     (`set firmware-provision-on-authorization`, `set https-image-push`,
     `set default-virtual-switch-vlan`), `config switch-controller virtual-port-pool`.
     Diagnostics: `execute switch-controller get-conn-status`, `execute
     switch-controller get-sync-status {all | serial <sn> | switch-id <name>}`,
     `execute switch-controller get-physical-conn {dot | standard} <FortiLink_interface>`,
     `execute switch-controller get-upgrade-status`, `execute switch-controller
     virtual-port-pool request <sn> <port>`, `diagnose switch-controller trigger
     config-sync <sn>`, and `diagnose switch-controller switch-info` with `stp <sn>
     <instance>`, `rpvst`, `lldp neighbors-summary <sn>` / `neighbors-detail` /
     `stats`, `mclag list` / `icl`, `port-stats <sn> <port>`, `port-properties`,
     `mac-limit-violations {all | interface | vlan}`, `bpdu-guard-status <sn>`,
     `arp-inspection stats <sn>`, `ip-source-guard`, `option82-mapping`,
     `acl-counters`, `qos-stats`, `flapguard`, `flow-tracking`, `802.1X-dacl <sn>
     [<port>]`. Anything else (other `switch-info` keywords, `diagnose
     switch-controller` subcommands, defaults) must be checked in the FortiOS 7.6 CLI
     Reference first.
   - **FortiSwitch (FortiSwitchOS) side**, verified in the FortiSwitchOS 7.6.1
     Administration Guide: config trees `config switch interface` (with `config
     port-security`, `set port-security-mode {802.1X | 802.1X-mac-based}`), `config
     switch physical-port`, `config switch vlan`, `config switch trunk` (`set mode
     lacp-active`, `set auto-isl`, `set mclag-icl enable`), `config switch auto-network`,
     `config system sniffer-profile`; show/get/diagnose: `get switch lldp
     neighbor-summary` (singular in the 7.6.1 guide — the FortiGate-side keyword is
     `neighbors-summary`), `get switch lldp settings` / `profile`, `get switch stp
     settings` / `instance`, `diagnose stp instance list`, `diagnose stp vlan list`,
     `diagnose stp rapid-pvst-port list`, `diag switch mac-address list`, `diagnose
     switch trunk list`, `diagnose switch mclag list` / `icl` /
     `peer-consistency-check`, `diagnose switch physical-ports list` / `port-stats
     list` / `cable-diag <port>` / `qos-stats`, `diagnose switch 802-1x status
     [<port>]` (note `802-1x` here vs `802.1X-dacl` on the FortiGate), `get switch
     dhcp-snooping status` / `database-summary` / `client-db-details`, `diagnose
     switch arp-inspection stats`, `get switch ip-source-guard-violations all`, `get
     switch acl counters {all | egress | ingress | prelookup}`, `get switch storm-control`,
     `get switch igmp-snooping group`, `get switch modules status`, `get switch poe
     inline`, `get router info routing-table ...`, `execute system sniffer-profile
     {start | pause | stop | upload | delete-capture}`, `get system sniffer-profile
     capture <profile>`, `execute factoryreset`. Exhibits of `get-conn-status` must copy
     the 7.6.1 guide's layout: `SWITCH-ID  VERSION  STATUS  FLAG  ADDRESS  JOIN-TIME
     SERIAL`, statuses such as `Authorized/Up`, `Authorized/Down`, `Discovered/Down`,
     and the legend `Flags: C=config sync, U=upgrading, S=staged, D=delayed reboot
     pending, E=config sync error, 2=L2, 3=L3, V=VXLAN, T=tunnel, X=External` with a
     `Managed-Switches: n (UP: n DOWN: n MAX: n)` line.

3. **Doc inconsistencies to handle carefully** (all in the 7.6.1 guides — don't build a
   question on the contradictory point):
   - The DAI page prints `set switch-controller-arp-inpsection` (typo) in one block
     and `switch-controller-arp-inspection` in another, and shows
     `arp-inspection-trust` without `set`. Use the CLI Reference spelling.
   - Loop guard: one page says "Loop guard and STP should be used separately", another
     says loop guard "is designed to work in concert with STP". Teach what loop guard
     does (detects downstream loops, disabled by default, `loop-guard-timeout`
     0-120 minutes) and avoid "use it with/without STP" items.
   - Authorization: the FortiLink pages say the switch reboots after `set
     fsw-wan1-admin enable` / after authorization, while the zero-touch page
     (FortiSwitchOS 7.2.0+) says the switch "does not need to be restarted when it
     becomes managed". Don't test the reboot.
   - MSTP is called IEEE 802.1s in the FortiSwitchOS guide and 802.1Q in the FortiLink
     guide (802.1s was folded into 802.1Q). Either is fine; don't make it a question.

4. **Concepts that must be exact:** management modes (FortiLink/managed, standalone,
   cloud); FortiLink interface defaults (created as an aggregate, or a hardware switch
   on models without aggregate support; supported on all Ethernet ports except HA and
   MGMT; not supported in transparent mode; managed switches allow only HTTPS 443 for
   admin access); auto-authorization vs manual authorization; FortiLink split interface
   (enabled by default, aggregate of exactly two ports, one active link, must be
   enabled before MCLAG and can be disabled after MCLAG to make both links active);
   ISL/auto-ISL, MCLAG peer groups and the ICL; the reserved network and the default
   template addresses (quarantine `10.255.11.1/24`, RSPAN `10.255.12.1/24`, NAC segment
   `10.255.13.1/24`); management VLAN 4094; managed-switch limits per FortiGate model
   (FortiGate 40F / FortiGate-VM01: 8; FortiGate-VM02: 24; FortiGate-VM04: 64 — table
   in the FortiLink Guide Introduction); STP defaults (STP enabled on non-FortiLink
   ports, no STP between FortiGate and FortiSwitch in FortiLink mode, STP and IGMP
   snooping on by default, changing `auto-stp-priority` briefly drops FortiLink);
   BPDU guard only on edge ports; root guard drops superior BPDUs; DHCP snooping
   (managed-switch ports untrusted by default), DAI needs DHCP snooping and is off on
   all VLANs by default, IPv4 source guard is off by default, static entries beat
   dynamic ones, more than 2,048 entries from a FortiGate errors out, and dropped
   traffic is not logged; 802.1X port vs MAC-based modes, MAB, guest / auth-fail /
   server-timeout VLANs, 20 MAC sessions per port; multi-tenancy (`export-to`,
   virtual port pools, `owner-vdom`, VLANs created in the tenant VDOM on the root
   VDOM's FortiLink interface, CLI only). **"Security profiles" (3.3) is ambiguous** —
   Fortinet doesn't define it for this exam. Treat it as FortiGate inspection of
   switch VLAN traffic (firewall policies and profiles on the FortiLink VLAN
   interfaces) plus FortiSwitch security policies; say so in the lesson.

5. **Exhibit names.** FortiGate `FGT-HQ` (HA pair `FGT-A` / `FGT-B`), FortiLink
   interface `fortilink` (aggregate of `port9` and `port10`, or `x1`/`x2`), managed
   switches with realistically formatted serials such as `S248EPTF18000101`,
   `S248EPTF18000102`, `S124EN5918000103`, `S524DF4K15000104` and user-defined names
   `FSW-Core1`, `FSW-Core2` (MCLAG pair), `FSW-Access1`…`FSW-Access3`; VLAN interfaces
   `vlan10-data`, `vlan20-voice`, `vlan30-guest`, `vlan99-mgmt` on `10.10.<vlan>.0/24`;
   FortiLink subnet e.g. `10.255.1.0/24`; RADIUS server `10.10.99.20` on
   `example.com`; tenant VDOM `tenant-a`. Switch ports `port1`…`port48`, uplinks
   `port49`…`port52`. Never use a real customer serial from a doc example.

6. **Lab reality.** FortiSwitchOS needs **switch hardware**: no FortiSwitch VM appears
   in Fortinet's FortiSwitch 7.6 document library (docs.fortinet.com product page,
   checked 2026-10-29), and to the owner's knowledge Fortinet offers no free
   FortiSwitch VM trial — lessons must say so plainly and not invent one. Labs should
   therefore focus on what the **FortiGate-VM permanent trial** (FortiOS 7.6.x;
   1 vCPU / 2 GB, max 3 interfaces, 3 firewall policies, 3 routes, no FortiGuard) can
   show without a switch: enabling the switch controller, building or editing the
   FortiLink interface, VLAN interface templates and `initial-config vlans`, the
   `config switch-controller` object tree (`stp-settings`, `stp-instance`, `global`,
   `virtual-port-pool`), VDOM-based multi-tenancy objects, and running
   `execute switch-controller get-conn-status` (it lists no switches). The FortiLink
   Guide lists FortiGate-VM01 as supporting 8 managed FortiSwitch units, so the
   switch-controller feature exists on FortiGate-VM, but **confirm on the trial VM that
   the menus appear** and whether VLAN interfaces count against the 3-interface cap
   before writing a step that depends on it. Everything FortiSwitch-side (port output,
   `get switch ...`, `diagnose switch ...`, packet-capture profiles, cable tests,
   MCLAG/ISL state) is "read the exhibit" material unless the owner gets a real switch.
   Mark any step that needs a physical FortiSwitch as such.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
