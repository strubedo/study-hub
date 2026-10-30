# Content Spec — Fortinet NSE 5 SD-WAN Core 7.6 Administrator

Targets the **official Fortinet NSE 5 - SD-WAN Core 7.6 Administrator exam topics** in
`content/blueprint.js` (training.fortinet.com exam page, checked 2026-10-29; product
"FortiOS 7.6 and FortiManager 7.6"; the matching self-paced course lists FortiOS 7.6.3
and FortiManager 7.6.3). Every lesson, question and flashcard is tagged with a
blueprint topic id; together the lessons must cover **every** sub bullet (Fortinet
repeats some bullets across topics, e.g. widgets/logs in 1.1 and 3.2 — cover them once
in depth, then cross-reference).

**File formats, question types, mix guide, lesson structure, callouts, exam style
and the ground rules are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read it
first and follow it.** Only these points differ:

1. **Product and version.** FortiOS **7.6** and FortiManager **7.6**, not 8.0. The
   exam's recommended references are the FortiOS 7.6.3 Administration Guide
   (SD-WAN chapter), the FortiOS 7.6.4 CLI Reference, the SD-WAN Deployment Guide and
   the FortiManager 7.6 Administration Guide (SD-WAN Manager chapter). Call out
   behaviour that changed in 7.4 → 7.6, in particular: since **7.4.1** the old
   "Maximize Bandwidth (SLA)" strategy is the **load balancing** option
   (`set load-balance enable`) inside a Manual or Lowest Cost (SLA) rule; and since
   **7.4.4** `diagnose sys sdwan service` is split into `service4` / `service6`.
   Don't teach FortiOS 8.0-only SD-WAN features (underlay-bandwidth steering,
   bandwidth-threshold duplication, FortiView SD-WAN application widget).
2. **SD-WAN CLI must be real.** Use the `config system sdwan` tree: `set status`,
   `set load-balance-mode`, `config zone`, `config members` (`interface`, `zone`,
   `gateway`, `cost`, `priority`, `weight`, `volume-ratio`, `spillover-threshold`,
   `ingress-spillover-threshold`, `source`), `config health-check` (`server`,
   `protocol`, `detect-mode`, `interval`, `failtime`, `recoverytime`, `members`,
   `update-static-route`, `sla-fail-log-period`, `sla-pass-log-period`,
   `embed-measured-health`, `config sla` with `link-cost-factor`,
   `latency-threshold`, `jitter-threshold`, `packetloss-threshold`), and
   `config service` (`mode {auto | manual | priority | sla}`, `priority-members`,
   `priority-zone`, `health-check`, `link-cost-factor`, `link-cost-threshold`,
   `config sla`, `load-balance`, `hash-mode`, `minimum-sla-meet-members` (exists
   under both `config service` and `config zone` in 7.6.4 — be precise about which),
   `hold-down-time`, `internet-service`, `dst`, `src`). Check every attribute
   and default against the 7.6.4 CLI Reference before using it. Diagnostics to use
   (verified in the 7.6.3 guide, "SD-WAN related diagnose commands"): `diagnose sys
   sdwan health-check [name]`, `diagnose sys sdwan member`, `diagnose sys sdwan
   service4 [id]`, `diagnose sys sdwan intf-sla-log <intf>`, `diagnose sys sdwan
   sla-log <hc> <seq>`, `diagnose sys sdwan internet-service-app-ctrl-list`,
   `diagnose sys sdwan route-tag-list`, `diagnose firewall proute list`, `diagnose
   sys link-monitor-passive admin list by-interface`, plus `get router info
   routing-table all`, `get router info routing-table database`, `diagnose sys
   session list` / `filter`, `diagnose debug flow`. **`diagnose sys sdwan zone` is
   only confirmed by a Fortinet Community article — run it on a 7.6 lab FortiGate
   before quoting its output.** Exhibits of `service4`, `member` and `health-check`
   output must copy the field layout of the 7.6.3 guide (e.g. `Seq(1 port1):
   state(alive), packet-loss(0.000%) latency(…), jitter(…) sla_map=0x1`,
   `Mode(sla)`, `alive, sla(0x1), …, selected`).
3. **Concepts that must be exact:** members vs zones (members can't be used in
   firewall policies, zones can; default zone `virtual-wan-link`), member `cost`
   (default 0, lower wins in SLA mode) and `priority` (default 1, used in the
   member static route and in rules), the implicit rule and its five
   `load-balance-mode` values (default `source-ip-based`), the strategies and their
   CLI names (Manual = `manual`, Best Quality = `priority`, Lowest Cost (SLA) =
   `sla`, CLI-only legacy `auto`), the 10% `link-cost-threshold` advantage for the
   first-listed member, SLA target maps (`sla_map` bitmask), `minimum-sla-meet-members`,
   health-check defaults and probe modes (active / passive / prefer-passive), "update
   static route" member state change action, embedded SLA information in ICMP
   probes, policy route → FIB lookup order, member static routes and static routes
   to a zone, session table fields and flags, session re-evaluation after route
   changes, `preserve-session-route` and `snat-route-change`, and SD-WAN event log
   messages (logid `0113022923`, `0100022921`, `0113022925`). Topics such as ADVPN,
   BGP on loopback, multi-hub and FEC/duplication belong to the Secure Networking
   Architect (NSE 7) level — mention them only where a Core bullet needs context.
4. **FortiManager 7.6.** SD-WAN lives in the **SD-WAN Manager** pane: SD-WAN
   Network / Monitor, **SD-WAN templates** (zones and members, rules, performance
   SLA, neighbors, duplication; assigned to devices or device groups),
   provisioning-template **template groups**, IPsec / BGP / static-route / CLI
   templates, **SD-WAN overlay orchestration** (overlay template wizard that
   generates IPsec, BGP and CLI templates, creates the `branch_id` metadata
   variable, and gives *no* SD-WAN intelligence by itself), and **ADOM-level
   metadata variables** (Policy & Objects > Advanced > Metadata Variables; default
   value plus per-device mapping; typed as `$` in supported fields). Verify menu
   paths against the FortiManager 7.6 Administration Guide; don't invent them.
5. **Exhibit names.** FortiGates `FGT-Branch1`, `FGT-Branch2`, hub `FGT-HQ`;
   FortiManager `FMG-HQ`; underlay members `port1`/`port2` (or `wan1`/`wan2`) in zone
   `underlay`, overlay tunnels `HUB1-VPN1`/`HUB1-VPN2` in zone `overlay`; health
   checks `DC_HC` and `Internet_HC` (server `198.51.100.10`, `8.8.8.8` only if the
   point is a public DNS probe); SD-WAN rules `Critical-DIA`, `DC-Apps`; ISP
   gateways from `203.0.113.0/24` and `198.51.100.0/24`.
6. **Lab limits.** The owner's lab is the **FortiGate-VM permanent trial** (7.6.x):
   1 vCPU / 2 GB, **max 3 interfaces, 3 firewall policies, 3 routes**, low encryption
   only, **no FortiGuard** (so no ISDB/application updates; the SD-WAN Setup wizard
   needs an SD-WAN Underlay and Application Monitoring licence, so expect it to be
   missing), one per FortiCloud account — a LAN port plus two WAN members is the
   realistic SD-WAN lab; plus the **FortiManager-VM trial** (7.6): **3 devices/VDOMs,
   2 ADOMs, no FortiGuard, no FDS, no FortiAnalyzer features**. Lab steps must fit
   these limits or say clearly that a step needs a full licence. The owner can put
   Cisco IOS routers or Linux hosts (tc/netem for latency and loss) around it.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
