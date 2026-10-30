// Domain 5 — VPNs flashcards (generated data).
export default [
  {
    "id": "d5-f001",
    "topic": "5.1",
    "front": "IKE and NAT-T ports?",
    "back": "IKE on UDP **500**. It moves to UDP **4500** when NAT is detected, and ESP is then UDP-encapsulated on 4500. Raw ESP is IP protocol 50."
  },
  {
    "id": "d5-f002",
    "topic": "5.1",
    "front": "What does phase 1 build?",
    "back": "The authenticated **IKE SA**: peer auth (PSK or certificate), proposals, DH group, keylife (default 86400 s)."
  },
  {
    "id": "d5-f003",
    "topic": "5.1",
    "front": "What does phase 2 build?",
    "back": "The **IPsec (child) SAs** for each selector pair: proposals, PFS (on by default), replay detection, keylifeseconds (default 43200 s)."
  },
  {
    "id": "d5-f004",
    "topic": "5.1",
    "front": "Phase 1 up, phase 2 down: suspect?",
    "back": "Selector (proxy ID) mismatch, phase 2 proposal mismatch, or PFS/DH group mismatch."
  },
  {
    "id": "d5-f005",
    "topic": "5.1",
    "front": "IKEv1 main vs aggressive mode?",
    "back": "Main: 6 messages, ID encrypted. Aggressive: 3 messages, ID in clear. Needed for multiple PSK dial-up phase 1s on one IP."
  },
  {
    "id": "d5-f006",
    "topic": "5.1",
    "front": "IKEv2 initial exchanges?",
    "back": "**IKE_SA_INIT** + **IKE_AUTH** (4 messages) create the IKE SA and first child SA. Then CREATE_CHILD_SA and INFORMATIONAL."
  },
  {
    "id": "d5-f007",
    "topic": "5.1",
    "front": "Extended user auth: IKEv1 vs IKEv2?",
    "back": "IKEv1 uses **XAuth**. IKEv2 uses **EAP**."
  },
  {
    "id": "d5-f008",
    "topic": "5.1",
    "front": "FortiClient and IKEv1?",
    "back": "FortiClient **7.4.4 and later doesn't support IKEv1**. Use IKEv2 for remote access."
  },
  {
    "id": "d5-f009",
    "topic": "5.1",
    "front": "Default IKE version for new FortiOS 8.0 tunnels?",
    "back": "**IKEv2**. Fortinet calls IKEv1 legacy. The blueprint's \"IPsec v2\" is best read as IKEv2."
  },
  {
    "id": "d5-f010",
    "topic": "5.1",
    "front": "Route-based vs policy-based config trees?",
    "back": "Route-based: `vpn ipsec phase1-interface` (creates a tunnel interface). Policy-based: `vpn ipsec phase1` + policy `action ipsec`."
  },
  {
    "id": "d5-f011",
    "topic": "5.1",
    "front": "A route-based tunnel needs which two things to pass traffic?",
    "back": "A **route** to the remote subnet via the tunnel interface, and **firewall policies** in each direction."
  },
  {
    "id": "d5-f012",
    "topic": "5.1",
    "front": "FortiOS 8.0 `ike-proposal-visibility`?",
    "back": "Default `recommended` hides weak options, including DH groups 1, 2, 5, 14, 27. Set `all` under `config system settings` to show them."
  },
  {
    "id": "d5-f013",
    "topic": "5.1",
    "front": "`nattraversal forced`?",
    "back": "Uses UDP-encapsulated ESP (4500) even when no NAT is detected."
  },
  {
    "id": "d5-f014",
    "topic": "5.1",
    "front": "DPD modes?",
    "back": "`on-demand` (default): probe only when traffic gets no reply. `on-idle`: also probe idle tunnels. `disable`."
  },
  {
    "id": "d5-f015",
    "topic": "5.1",
    "front": "What does the Site to Site wizard create?",
    "back": "Phase 1/2, address objects and groups, a tunnel route plus a **blackhole route (distance 254)**, and **two** policies (LAN↔tunnel)."
  },
  {
    "id": "d5-f016",
    "topic": "5.1",
    "front": "Dial-up phase 1 type?",
    "back": "`set type dynamic`. Clients become instances `<name>_0`, `_1`… (`mode=dial_inst`). Only the client can initiate."
  },
  {
    "id": "d5-f017",
    "topic": "5.1",
    "front": "`add-route` on dial-up?",
    "back": "Enabled by default. Installs a route to each client's phase 2 selector while connected (default distance 15)."
  },
  {
    "id": "d5-f018",
    "topic": "5.1",
    "front": "`mode-cfg`?",
    "back": "Dial-up server pushes the client IP, DNS and split-tunnel networks (IKE Mode Config)."
  },
  {
    "id": "d5-f019",
    "topic": "5.1",
    "front": "SSL VPN in FortiOS 8.0?",
    "back": "Tunnel mode was **removed in 7.6.3**. Use IPsec. Web mode is now **Agentless VPN**, disabled by default (`sslvpn-web-mode`)."
  },
  {
    "id": "d5-f020",
    "topic": "5.1",
    "front": "Redundant VPN between two FortiGates needs?",
    "back": "One phase 1 per path with DPD, one phase 2 each, routes ranked by distance or priority, policies, and a blackhole route at 254."
  },
  {
    "id": "d5-f021",
    "topic": "5.1",
    "front": "Backup tunnel route: higher distance or higher priority?",
    "back": "Usually **equal distance, higher priority**, so the route stays in the table and traffic arriving on the backup passes RPF."
  },
  {
    "id": "d5-f022",
    "topic": "5.1",
    "front": "`set monitor <phase1>`?",
    "back": "CLI-only. Keeps this backup phase 1 down until the monitored phase 1 fails."
  },
  {
    "id": "d5-f023",
    "topic": "5.1",
    "front": "Full-mesh tunnel count?",
    "back": "n(n−1)/2. For example, 6 sites need 15 tunnels. ADVPN avoids this with on-demand spoke-to-spoke shortcuts."
  },
  {
    "id": "d5-f024",
    "topic": "5.1",
    "front": "`selectors(total,up): 2/1` in `get vpn ipsec tunnel summary`?",
    "back": "One of two phase 2 selector pairs is down. Check it with `diagnose vpn tunnel list name <p1>`."
  },
  {
    "id": "d5-f025",
    "topic": "5.1",
    "front": "Three classic negotiation failure reasons (8.0.1 log `reason`)?",
    "back": "`probable PSK mismatch` (auth), `no proposal chosen` (phase 1 proposals), `TS_UNACCEPTABLE received` (phase 2 selectors)."
  },
  {
    "id": "d5-f026",
    "topic": "5.1",
    "front": "Key VPN log IDs?",
    "back": "0101037124 phase 1 error, 0101037125 phase 2 error, 0101037138 tunnel up/down, 0101037133 SA installed, 0101037141 statistics."
  },
  {
    "id": "d5-f027",
    "topic": "5.1",
    "front": "Enable TLS 1.3 VPN negotiation (8.0)?",
    "back": "`config system settings` → `ike-tcp-service enable` + `ike-tls-service enable` (per VDOM, `ike-tcp-port` default 443). Static phase 1 `transport auto`. FortiGate↔FortiGate only."
  },
  {
    "id": "d5-f028",
    "topic": "5.1",
    "front": "How do you confirm a tunnel runs over TLS?",
    "back": "`diagnose vpn ike gateway list` shows `transport: TLS` with tcp-tx/rx rate and drop counters."
  },
  {
    "id": "d5-f029",
    "topic": "5.1",
    "front": "Hybrid PQC key exchange on FortiOS?",
    "back": "IKEv2 `addke1`–`addke7` (RFC 9370 via IKE_INTERMEDIATE). ML-KEM-512/768/1024 = 35/36/37. Classical DH still runs."
  },
  {
    "id": "d5-f030",
    "topic": "5.1",
    "front": "PQC signature auth (new in 8.0)?",
    "back": "`authmethod signature` + `digital-signature-auth enable` (RFC 7427) with ML-DSA (FIPS 204) or SLH-DSA (FIPS 205) certificates."
  }
];
