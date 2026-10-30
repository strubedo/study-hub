// Cheat-sheet tables for the Reference page. Cells are inline markdown. FortiOS / FortiManager 7.6.
// Every row was checked on docs.fortinet.com on 2026-10-29:
// - FortiOS 7.6.3 CLI Reference, config vpn ipsec phase1-interface (options and CLI defaults):
//   docs.fortinet.com/document/fortigate/7.6.3/cli-reference/305883427/config-vpn-ipsec-phase1-interface
// - FortiOS 7.6.5 Admin Guide: ADVPN with BGP as the routing protocol (820072), ADVPN 2.0 (637049),
//   SD-WAN with ADVPN 2.0 versus previous ADVPN (623804), Dynamic BGP on loopback dual hub example (825080),
//   Add ADVPN to dynamic BGP on loopback example (585153); 7.6.2 Admin Guide: SD-WAN CLI configuration (196824)
// - FortiOS 7.6.3 Admin Guide: Manual (723448), Best quality (22371), Lowest cost (SLA) (342836),
//   Automatic (985056) and Load balancing (708464) strategies; 7.6.5 Implicit rule (216765)
// - FortiOS 7.4.0 New Features: ADVPN 2.0 edge discovery and path management 7.4.2 (637049)
// - FortiManager 7.6.3 Admin Guide: SD-WAN overlay orchestration (224982), Template prerequisites (440777),
//   Configuring an SD-WAN overlay template (275483), Using the SD-WAN overlay template (748381)
export default [
  {
    id: 'advpn', title: 'ADVPN 1.0 and 2.0 settings', topic: '5.3',
    columns: ['Setting', 'Where and what it does'],
    rows: [
      ['`set auto-discovery-sender enable`', 'Hub phase 1 (dial-up, `type dynamic`). Sends shortcut messages to spokes. Default disable'],
      ['`set auto-discovery-receiver enable`', 'Spoke phase 1. Accepts shortcut messages. Default disable'],
      ['`set auto-discovery-forwarder enable`', 'Forwards shortcut messages (CLI Reference wording). Default disable'],
      ['`set auto-discovery-shortcuts`', '`independent` (default): shortcuts stay up if the parent tunnel goes down. `dependent`: shortcuts go down with the parent'],
      ['`set auto-discovery-offer-interval`', 'Seconds between shortcut offer messages, 1–300, default 5'],
      ['`set auto-discovery-crossover`', '`allow` (default) or `block` shortcuts between different `network-id` values'],
      ['Hub firewall policy', 'Spoke-to-spoke traffic must be allowed on the hub (srcintf and dstintf both the hub tunnel) in ADVPN 1.0 and 2.0'],
      ['ADVPN 2.0 (FortiOS 7.4.2+)', '`config system sdwan` → zone `set advpn-select enable` + `set advpn-health-check <name>`; member `set transport-group <n>` (admin guide 1–255; CLI Reference 0–255, default 0); rule `set shortcut-priority` enable, disable or auto. IPv4 only'],
      ['ADVPN 2.0 overlay placeholder', 'Spoke phase 1 `type dynamic`, `net-device enable`, `set auto-discovery-dialup-placeholder enable`: builds shortcuts over transports the hub isn\'t connected to'],
      ['ADVPN 2.0 shared idle timeout', 'Phase 1 `set idle-timeout enable` + `set shared-idle-timeout enable`; IKEv2 only, `location-id` set on both spokes'],
      ['Check ADVPN 2.0', '`diagnose sys sdwan advpn-session`: remote spoke WAN link info and the chosen shortcut path'],
    ],
    note: 'ADVPN 1.0 shortcut choice relied on the overlays and needed user traffic to trigger it. ADVPN 2.0 adds edge discovery (the shortcut reply carries the remote spoke\'s WAN links, then link info is refreshed every 5 seconds over the shortcut) and path management on the local spoke, and no longer depends on route reflection, recursive next hop, BGP per overlay or BGP on loopback.',
  },
  {
    id: 'p1-dialup', title: 'Phase 1 options for dial-up hubs', topic: '5.1',
    columns: ['Option', 'Values (CLI default in bold)'],
    rows: [
      ['`type`', '**static** · dynamic (dial-up; remote gateway has a dynamic IP) · ddns'],
      ['`ike-version`', '**1** · 2'],
      ['`peertype`', 'any · one · dialup · **peer** · peergrp'],
      ['`net-device`', '**disable**: no kernel device per tunnel; each dynamic tunnel gets a tunnel ID (an IP address) used as the gateway of routes to it. enable: a kernel device for every tunnel. The ADVPN-with-BGP example requires `disable` on the hub'],
      ['`add-route`', '**enable**: add a route to the peer\'s destination selector. The ADVPN examples set `disable` and let BGP carry the routes'],
      ['`mode-cfg`', '**disable** · enable (IKE configuration method). With it, `assign-ip` (default enable) assigns an IP to the IPsec interface, from a local range by default (`assign-ip-from range`)'],
      ['`exchange-interface-ip` / `exchange-ip-addr4`', '**disable** / **0.0.0.0**: exchange the tunnel interface IP, or a given IPv4 address (the loopback in BGP on loopback designs) with peers'],
      ['`dpd`', 'disable · on-idle (probe when IPsec is idle) · **on-demand** (probe when traffic is sent but nothing comes back); `dpd-retrycount` default 3'],
      ['`network-overlay` / `network-id`', '**disable** / **0** (0–255): VPN gateway network ID'],
    ],
    note: 'Defaults are from the 7.6.3 CLI Reference; the GUI VPN wizard may set different values. `tunnel-search` was removed in FortiOS 7.0.0.',
  },
  {
    id: 'bgp-loopback', title: 'BGP on loopback design checklist', topic: '4.2',
    columns: ['Piece', 'Configuration'],
    rows: [
      ['Loopbacks', 'One /32 `type loopback` interface per spoke (e.g. `Branch-Lo`). On the hub, separate loopbacks for BGP (`BGP-Lo`) and for spoke health checks (`HUB-Lo`)'],
      ['Why two hub loopbacks', 'A health check installs a kernel route to its server that stays even when the check fails, so BGP to the same IP would keep using the tunnel it first came up on'],
      ['Reach the loopbacks', 'Phase 1 `set exchange-ip-addr4 <own loopback>` on every overlay: IKE injects a route to the peer\'s loopback'],
      ['Location', '`config system settings` → `set location-id <loopback IP>` (unique per device)'],
      ['Spoke BGP', 'One neighbor per hub loopback with `set interface` / `set update-source` = spoke loopback; `ibgp-multipath enable`, `recursive-next-hop enable`'],
      ['Hub BGP', '`config neighbor-group` (update-source = BGP loopback, `next-hop-self` in the dual-hub example) + `config neighbor-range` covering the spoke loopback range, for dynamic peers'],
      ['SD-WAN members', 'Tunnels have no IP, so each overlay member gets `set source <spoke loopback>` for health checks'],
      ['Policies', 'Allow health-check probes and BGP (PING, BGP) between the loopbacks and the overlay zones'],
    ],
    note: 'With BGP on loopback there is only one BGP session from a spoke to each hub, however many overlays exist (FortiManager overlay template docs). FortiManager\'s template defaults: loopbacks 172.16.0.0/16, overlays 10.10.0.0/16, AS 65000.',
  },
  {
    id: 'sdwan-strategies', title: 'SD-WAN rule strategies', topic: '4.3',
    columns: ['Strategy (CLI `mode`)', 'How the member is chosen'],
    rows: [
      ['Manual (`manual`, default)', 'No health checks. Members/zones in the configured order of preference; with `set load-balance enable` traffic is spread across all listed members'],
      ['Best quality (`priority`)', 'Best member by a `link-cost-factor`: latency, jitter, packet-loss, inbandwidth, outbandwidth, bibandwidth or custom-profile-1. The first configured member gets a default 10% advantage (`link-cost-threshold 10`)'],
      ['Lowest cost (SLA) (`sla`)', 'Lowest-cost member that meets the SLA target (lowest cost is 0); ties go to the interface preference order. With `set load-balance enable` it spreads traffic over every member that meets the SLA, ignoring cost'],
      ['Automatic (`auto`)', 'Legacy: picks a member by its performance rank against the other members'],
      ['Load balancing', 'Called maximize bandwidth (SLA) before FortiOS 7.4.1; now `load-balance enable` under manual (no SLA) or lowest cost (SLA). `hash-mode` default **round-robin** (also source-ip-based, source-dest-ip-based, inbandwidth, outbandwidth, bibandwidth)'],
      ['Implicit rule', 'Used when no SD-WAN rule matches: ECMP over members with `load-balance-mode` **source-ip-based** (default), weight-based, usage-based (spillover), source-dest-ip-based or measured-volume-based'],
    ],
  },
  {
    id: 'fmg-overlay', title: 'FortiManager SD-WAN overlay template', topic: '2.2',
    columns: ['Item', 'Detail'],
    rows: [
      ['Where', 'SD-WAN Manager → Overlay Orchestration → Create New (wizard)'],
      ['Before you start', 'Hub and branch FortiGates added to FortiManager, ISP links configured, a device group for the branches, underlay reachability hub ↔ branch'],
      ['Topologies', 'Single HUB, Dual HUB (Primary/Secondary), Dual HUB (Primary/Primary), Multi HUB (3 or 4 hubs, cost per hub). Primary/Secondary just gives the secondary hub a higher cost'],
      ['Advanced defaults', 'Loopbacks 172.16.0.0/16, overlays 10.10.0.0/16, BGP AS 65000'],
      ['Region options', 'BGP on Loopback; Dynamic BGP (ADVPN spokes form BGP sessions dynamically, so route reflection becomes optional); ADVPN Disabled / Legacy / 2.0; Segmentation Over Single Overlay (VRF + VPNv4); PSK or signature authentication'],
      ['What it generates', 'IPsec, BGP and CLI provisioning templates, grouped per hub and branch in template groups, assigned to the devices automatically'],
      ['`branch_id`', 'Metadata variable created by the template; each branch needs a unique value, or enable Automatic Branch ID Assignment'],
      ['Not included', 'No SD-WAN intelligence: build the rules in an SD-WAN template (the wizard can add the overlays and health checks to one), then policy packages, then install'],
    ],
    note: 'ADVPN 2.0 adds a Transport Group field per branch WAN underlay (default 0, or 1 for a private link). Preconfigured route maps (hubs RM-VPN-Priority; branches Priority_1 to Priority_4 and Priority_999) support BGP self-healing.',
  },
];
