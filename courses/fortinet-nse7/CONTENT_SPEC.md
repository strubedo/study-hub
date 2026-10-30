# Content Spec — Fortinet NSE 7 Secure Networking 7.6 Architect

Targets the **official Fortinet NSE 7 - Secure Networking 7.6 Architect exam topics** in
`content/blueprint.js` (training.fortinet.com exam page, checked 2026-10-29; product
FortiGate 7.6, FortiManager 7.6, FortiAnalyzer 7.6). Every lesson, question and
flashcard is tagged with a blueprint topic id; together the lessons must cover
**every** sub bullet. Fortinet repeats most of the 5.2 bullets (dual hub, multiregion,
self-healing, VRF-aware overlays, MSSP) under 5.1 — teach them in depth in 5.2 and
cross-reference from 5.1, which keeps IKEv2, DPD, MTU/MSS, aggregates, offload and the
FortiManager IPsec templates.

**File formats, question types, mix guide, lesson structure, callouts, exam style
and the ground rules are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read it
first and follow it.** Only these points differ:

1. **Architect level.** This is not an admin exam. Questions should test design
   trade-offs and multi-device scenarios: pick a topology (single vs dual hub,
   multiregion), a routing design (BGP per overlay vs BGP on loopback, route
   reflection vs dynamic BGP, OSPF vs BGP), an HA mode (FGCP vs FGSP vs VRRP), or
   explain why a multi-device design misbehaves from several devices' outputs. Use
   exhibits that show two or three devices at once (hub + spoke tables, both ends of
   a tunnel). Keep a good share of "what is the *best* design" items, but each must
   have one defensible answer from the docs, not opinion.
2. **Products and versions.** FortiOS **7.6** (docs.fortinet.com: FortiOS 7.6.0 and
   7.6.3 Administration Guide, New Features and CLI Reference — the versions the exam
   page cites — plus the SD-WAN Deployment Guide), FortiManager **7.6** (7.6.0 / 7.6.3
   Administration Guide, 7.6.0 CLI Reference) and FortiAnalyzer **7.6** (CLI
   Reference). When a feature arrived after 7.6.0 or changed in a later 7.6 patch, say
   which patch. Do not teach FortiOS 8.0 behaviour.
3. **Verify these before writing** (docs.fortinet.com, the 7.6 pages; don't rely on
   memory, blogs or community posts):
   - **ADVPN 1.0**: `auto-discovery-sender` (hub), `auto-discovery-receiver` (spoke),
     `auto-discovery-forwarder`, `auto-discovery-shortcuts independent|dependent`,
     `auto-discovery-offer-interval`, `auto-discovery-crossover`, `network-id`,
     shortcut idle timeout, spoke-to-spoke policy on the hub, shortcut negotiation
     (offer/query/reply) and the hub `net-device disable` requirement in the BGP
     example.
   - **ADVPN 2.0** (from 7.4.2): `advpn-select`, `advpn-health-check`,
     `transport-group`, `shortcut-priority`, `auto-discovery-dialup-placeholder`
     (overlay placeholders), `shared-idle-timeout`, `diagnose sys sdwan
     advpn-session`; IPv4 only; edge discovery and path management.
   - **SD-WAN overlays / hub-and-spoke**: zones and members, member `source` on
     IP-less tunnels, performance SLAs, `update-static-route` /
     `update-cascade-interface`, SD-WAN rule strategies (manual, best quality
     `priority`, lowest cost `sla`, load balancing — "maximize bandwidth" before
     7.4.1), `link-cost-threshold`, implicit rule `load-balance-mode`, session
     re-evaluation, `config system sdwan` → `config neighbor` and self-healing.
   - **BGP on loopback**: loopback per device, `exchange-ip-addr4`, `location-id`,
     `update-source`, `neighbor-group` + `neighbor-range`, `ibgp-multipath`,
     `recursive-next-hop`, separate hub loopbacks for health checks and BGP,
     dynamic BGP over shortcuts, route reflection vs no route reflection.
   - **Multiregion**: regional hubs, inter-region routing, `auto-discovery-forwarder`
     and `network-id` / `auto-discovery-crossover` — check the 7.6 SD-WAN Deployment
     Guide's large-scale / multi-region chapters.
   - **FortiManager**: SD-WAN Manager, SD-WAN overlay template (Overlay Orchestration
     wizard: topologies, BGP on loopback, dynamic BGP, ADVPN legacy vs 2.0,
     segmentation over a single overlay, normalized interfaces, `branch_id`), SD-WAN
     templates, IPsec templates (recommended templates, autorouting), template
     groups, metadata variables, VPN Manager, ZTP / device blueprints / CSV import.
   - **VDOMs and HA**: VDOM types (admin vs traffic), inter-VDOM links, FGCP
     active-passive / active-active, virtual clustering and VDOM partitioning,
     virtual MACs, heartbeat Ethertypes, FGSP peers and session sync filters, VRRP.
   - **Routing on FortiGate**: `config router ospf` / `config router bgp`, access
     lists, prefix lists, route maps, redistribution, ECMP, BFD, graceful restart,
     route reflectors, `get router info bgp summary`, `get router info routing-table
     all`, `diagnose ip rtcache list`, `diagnose firewall proute list`.
   - **IPsec advanced**: IKEv2 dial-up hubs, `net-device`, `mode-cfg`, `add-route`,
     `exchange-interface-ip`, `network-overlay`, DPD modes, IPsec aggregates, FEC,
     NPU offload and the session `npu` flags, MTU/MSS (`tcp-mss-sender` /
     `tcp-mss-receiver` on policies), `diagnose vpn ike gateway list`, `diagnose vpn
     tunnel list`.
   - **Security profiles at scale**: certificate vs deep inspection, SNI check,
     exemptions, IPS sensors built from CVE filters, ISDB objects, the performance
     cost of proxy vs flow inspection.
   Don't invent CLI options, defaults or limits. If a doc page and the CLI Reference
   disagree (for example a default value), say so or leave the value out.
4. **Exhibit names.** Hubs `FGT-Hub` (dual hub: `FGT-Hub1`, `FGT-Hub2`; regional hubs
   `FGT-Hub-EU`, `FGT-Hub-US`), spokes `FGT-Spoke1`, `FGT-Spoke2` (`FGT-Spoke3` when a
   third is needed), HA members `FGT-A` / `FGT-B`, FortiManager `FMG-HQ`,
   FortiAnalyzer `FAZ-HQ`. Overlays `HUB1-VPN1`, `HUB1-VPN2`; SD-WAN zones `HUB1`,
   `HUB2`, `WAN1`, `WAN2`; loopbacks `Branch-Lo`, `HUB-Lo`, `BGP-Lo`; BGP AS 65000
   (the overlay template default) unless the item is about eBGP. Loopbacks from
   172.16.0.0/16 and overlays from 10.10.0.0/16 (FortiManager template defaults);
   public addresses from RFC 5737.
5. **Lab limits.** The owner's lab is the **FortiGate-VM permanent trial** (FortiOS 7.6):
   **max 3 interfaces, 3 firewall policies, 3 routes**, low encryption only (except GUI
   management and FortiManager traffic), 1 vCPU / 2 GB, no FortiGuard, 2 VDOMs (root
   must be admin type), **one per FortiCloud account**; plus the **FortiManager-VM
   trial**: **3 devices/VDOMs, 2 ADOMs**, no FortiGuard, no FDS, no FortiAnalyzer
   features. Most NSE 7 labs **exceed** these: a dual-hub ADVPN with two spokes needs
   four FortiGates and several tunnels, policies and routes each; HA needs two
   licensed VMs. Every "Lab it yourself" section must say what fits in the trials (for
   example one hub and one spoke with a single overlay, or one VDOM pair) and what
   needs full licences, the paid Fortinet on-demand labs or hardware. Never write lab
   steps that silently go past the trial caps.

Suggested bank sizes (about 300 questions, weighted by domain midpoint): D1 65, D2 52,
D3 27, D4 78, D5 78 questions; D1 40, D2 30, D3 15, D4 45, D5 45 flashcards.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
