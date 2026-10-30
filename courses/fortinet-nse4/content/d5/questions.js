// Domain 5 — VPNs. Original questions for FortiOS 8.0 (generated data).
export default [
  {
    "id": "d5-001",
    "topic": "5.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Two FortiGates build a route-based IPsec tunnel with default UDP transport. A NAT device sits between them. Which traffic must the path between the gateways allow for the tunnel to establish and pass data?",
    "options": [
      "UDP 500 and UDP 4500",
      "UDP 500 and IP protocol 50 (ESP) only",
      "TCP 443 only",
      "UDP 4500 and IP protocol 51 (AH)"
    ],
    "answer": [
      0
    ],
    "explanation": "IKE starts on **UDP 500**. When the peers detect NAT (NAT-D payloads), they move IKE to **UDP 4500**, and ESP is encapsulated in UDP 4500 as well (NAT-T). Raw ESP (protocol 50) can't pass most NAT devices, because it has no ports to translate.\n\n* **ESP only**: that works only when there is no NAT in the path.\n* **TCP 443**: that is used only if VPN over TCP/TLS is configured.\n* **AH**: FortiOS doesn't use AH, and AH can't cross NAT anyway.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-002",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Without NAT-T, ESP packets are carried directly in IP. What is ESP's IP protocol number? (Enter the number.)",
    "answer": [
      "50"
    ],
    "explanation": "ESP is **IP protocol 50** (AH is 51, which FortiOS doesn't use). With NAT traversal, ESP is wrapped in UDP 4500.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-003",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Users can't reach the network behind FGT-BR2. Which statement is correct?",
    "exhibit": "FGT-HQ # diagnose vpn ike gateway list name to-BR2\n\nvd: root/0\nname: to-BR2\nversion: 2\ninterface: port1 3\naddr: 203.0.113.10:500 -> 192.0.2.44:500\ntun_id: 192.0.2.44/::192.0.2.44\nremote_location: 0.0.0.0\nnetwork-id: 0\ntransport: UDP\ncreated: 412s ago\npeer-id: 192.0.2.44\npeer-id-auth: no\npending-queue: 0\nPPK: no\nIKE SA: created 1/1  established 1/1  time 10/10/10 ms\nIPsec SA: created 0/3  established 0/0  time 0/0/0 ms\n\n  id/spi: 87 1f2e3d4c5b6a7980/a1b2c3d4e5f60718\n  direction: initiator\n  status: established 412-412s ago = 10ms\n  proposal: aes256gcm-prfsha384\n  child: no\n  PPK: no\n  message-id sent/recv: 6/3\n  QKD: no\n  PQC-KEM (IKE): no\n  PQC-KEM (all IPsec): no\n  lifetime/rekey: 86400/85688\n  DPD sent/recv: 00000000/00000000\n  peer-id: 192.0.2.44",
    "options": [
      "Phase 1 is established but no phase 2 SA is up. Check the phase 2 selectors, proposals and PFS settings on both peers.",
      "Phase 1 failed because of a pre-shared key mismatch.",
      "UDP 500 is blocked between the peers.",
      "The tunnel is fully up. The problem must be a missing firewall policy."
    ],
    "answer": [
      0
    ],
    "explanation": "`IKE SA: ... established 1/1` with `status: established` means **phase 1 is up**. Authentication (including the PSK) succeeded and UDP 500 works. `IPsec SA: created 0/3  established 0/0` means three child SA attempts were made and none exists now, so **phase 2 failed**. The usual causes are mismatched selectors (proxy IDs), phase 2 proposals, or PFS/DH group settings.\n\n* **PSK mismatch**: phase 1 would never reach `established`.\n* **UDP 500 blocked**: same reason.\n* **Missing policy**: with no IPsec SA there is no tunnel to carry traffic yet.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-004",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit (FGT-HQ, FortiOS 8.0.1). What should the administrator change?",
    "exhibit": "1: date=2026-10-28 time=08:41:37 eventtime=1793202097512200118 tz=\"-0700\" logid=\"0101037125\" type=\"event\" subtype=\"vpn\" level=\"error\" vd=\"root\" logdesc=\"IPsec phase 2 error\" msg=\"IPsec phase 2 error\" action=\"negotiate\" remip=198.51.100.20 locip=203.0.113.10 remport=500 locport=500 outintf=\"port1\" cookies=\"5c0e2b9a7d1f4e36/9a3d77c1e2b04f58\" user=\"198.51.100.20\" group=\"N/A\" useralt=\"N/A\" eapuser=\"N/A\" eapauthgroup=\"N/A\" assignip=N/A vpntunnel=\"to-BR1\" status=\"negotiate_error\" reason=\"TS_UNACCEPTABLE received\" fctuid=\"N/A\" advpnsc=0",
    "options": [
      "Make the phase 2 local and remote selectors on the two peers mirror each other.",
      "Change the pre-shared key on both peers.",
      "Add a matching phase 1 encryption proposal.",
      "Enable NAT traversal on both peers."
    ],
    "answer": [
      0
    ],
    "explanation": "Log **0101037125** is *IPsec phase 2 error*. The 8.0.1 `reason` field says `TS_UNACCEPTABLE received`: the peer rejected the proposed **traffic selectors** (proxy IDs). Each side's local subnet must match the other side's remote subnet. FortiOS accepts a peer selector that is a subset of its own, but not one outside it.\n\n* **PSK**: a key problem is a phase 1 failure (`probable PSK mismatch`).\n* **Phase 1 proposal**: a phase 1 proposal problem appears as `no proposal chosen` in phase 1.\n* **NAT traversal**: NAT-T doesn't affect selector negotiation.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-005",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "A FortiGate has two IKEv1 dial-up phase 1 configurations bound to the same interface IP. Both authenticate peers with pre-shared keys. According to FortiOS documentation, which phase 1 mode is required for this design to work?",
    "options": [
      "Aggressive mode, so the responder can use the peer ID to select the correct phase 1",
      "Main mode, so the identities are encrypted",
      "Either mode, as long as the pre-shared keys differ",
      "Quick mode on both phase 1 configurations"
    ],
    "answer": [
      0
    ],
    "explanation": "In IKEv1 **main mode** the peer identity is encrypted and arrives only after the responder has already chosen a phase 1 (and therefore a PSK). With several dial-up phase 1s on the same IP, the responder can't tell them apart. **Aggressive mode** sends the ID in the first message, so with unique peer IDs the responder picks the right phase 1. With IKEv2, the Fortinet `network-id` or peer ID does this job.\n\n* **Main mode**: it fails for exactly the reason above.\n* **Different PSKs**: the responder needs the key *before* it can authenticate, so different keys don't help it choose.\n* **Quick mode**: that is the IKEv1 *phase 2* exchange.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-006",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about IKEv2 compared with IKEv1 are true? (Choose two.)",
    "options": [
      "IKEv2 uses EAP for extended user authentication, where IKEv1 uses XAuth.",
      "IKEv2 creates the IKE SA and the first child SA in a four-message exchange (IKE_SA_INIT and IKE_AUTH).",
      "IKEv2 has an aggressive mode that sends the identity in clear text.",
      "FortiClient 7.4.4 and later requires IKEv1 for remote access tunnels.",
      "IKEv2 cannot traverse NAT devices."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "IKEv2 (RFC 7296) replaces IKEv1's main/aggressive plus quick mode with **IKE_SA_INIT + IKE_AUTH**: four messages that establish the IKE SA and the first child SA. Further SAs and rekeys use CREATE_CHILD_SA. User authentication uses **EAP** instead of XAuth.\n\n* **Aggressive mode**: this is an IKEv1-only concept.\n* **FortiClient 7.4.4**: it *dropped* IKEv1 support.\n* **NAT**: IKEv2 has NAT traversal built in.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-007",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "After the company upgraded FortiClient to 7.4.4, remote users can no longer connect to an existing dial-up tunnel that uses IKEv1 with XAuth. What should the administrator do?",
    "options": [
      "Rebuild the remote access tunnel with IKE version 2, using EAP for user authentication.",
      "Switch the phase 1 from main mode to aggressive mode.",
      "Enable SSL VPN tunnel mode as a fallback.",
      "Change the authentication method from pre-shared key to signature."
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS documents that **IKEv1 is not supported on FortiClient 7.4.4 and later**, so the tunnel must be IKEv2. With IKEv2, user authentication uses **EAP** instead of XAuth.\n\n* **Aggressive mode**: it is still IKEv1.\n* **SSL VPN tunnel mode**: it was removed in FortiOS 7.6.3 and doesn't exist in 8.0.\n* **Signature authentication**: changing the authentication method doesn't fix the IKE version mismatch.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-008",
    "topic": "5.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each IKEv2 exchange with its purpose.",
    "pairs": [
      [
        "IKE_SA_INIT",
        "Negotiates IKE SA algorithms and exchanges DH values and nonces"
      ],
      [
        "IKE_AUTH",
        "Authenticates the peers and normally creates the first child SA"
      ],
      [
        "CREATE_CHILD_SA",
        "Creates additional child SAs and performs rekeys"
      ],
      [
        "INFORMATIONAL",
        "Carries notifications such as deletes and liveness (DPD) checks"
      ],
      [
        "IKE_INTERMEDIATE",
        "Carries additional key exchanges such as ML-KEM before IKE_AUTH"
      ]
    ],
    "explanation": "IKE_SA_INIT sets up the cryptographic channel and IKE_AUTH authenticates it. CREATE_CHILD_SA handles more SAs and rekeys. INFORMATIONAL carries deletes, errors and DPD. **IKE_INTERMEDIATE** (RFC 9242) is where FortiOS sends the extra RFC 9370 key exchanges (ADDKE rounds, such as ML-KEM) during initial setup.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-009",
    "topic": "5.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator must build VPNs that can run BGP over the tunnels, use them as SD-WAN members, and fail over between redundant tunnels. Which VPN type must be used?",
    "options": [
      "Route-based (interface mode) VPN, configured under config vpn ipsec phase1-interface",
      "Policy-based VPN with a firewall policy that uses action ipsec",
      "Agentless VPN",
      "Either type, because both create a tunnel interface"
    ],
    "answer": [
      0
    ],
    "explanation": "Only **route-based** VPNs create a virtual tunnel interface. Routes, routing protocols, SD-WAN membership and zone-based policies all need that interface. Policy-based VPNs (`config vpn ipsec phase1` and a policy with `action ipsec`) create no interface. They are a legacy option and hidden by default.\n\nAgentless VPN is the clientless web portal (formerly SSL VPN web mode). It isn't a site-to-site tunnel.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-010",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit, captured on FGT-Branch. The tunnel to-HQ is up. Ping from 10.0.5.20 (HQ LAN) to 10.20.1.10 (branch LAN) fails. What must the administrator add on FGT-Branch?",
    "exhibit": "FGT-Branch # diagnose debug flow filter addr 10.0.5.20\nFGT-Branch # diagnose debug flow trace start 5\nFGT-Branch # diagnose debug enable\nid=65308 trace_id=12 func=print_pkt_detail line=6012 msg=\"vd-root:0 received a packet(proto=1, 10.0.5.20:1->10.20.1.10:2048) tun_id=203.0.113.10 from to-HQ. type=8, code=0, id=1, seq=14.\"\nid=65308 trace_id=12 func=init_ip_session_common line=6193 msg=\"allocate a new session-0004b21c\"\nid=65308 trace_id=12 func=iprope_dnat_check line=5480 msg=\"in-[to-HQ], out-[]\"\nid=65308 trace_id=12 func=iprope_dnat_tree_check line=830 msg=\"len=0\"\nid=65308 trace_id=12 func=iprope_dnat_check line=5505 msg=\"result: skb_flags-02000000, vid-0, ret-no-match, act-accept, flag-00000000\"\nid=65308 trace_id=12 func=vf_ip_route_input_common line=2611 msg=\"find a route: flag=04000000 gw-10.20.1.10 via port3\"\nid=65308 trace_id=12 func=fw_forward_handler line=948 msg=\"Denied by forward policy check (policy 0)\"",
    "options": [
      "A firewall policy from to-HQ to port3 that allows 10.0.5.0/24 to the branch LAN",
      "A static route to 10.20.1.0/24 through the tunnel",
      "A phase 2 selector for 10.20.1.0/24",
      "A firewall policy from port3 to to-HQ"
    ],
    "answer": [
      0
    ],
    "explanation": "The packet arrives decrypted **from to-HQ**, so phase 1 and 2 work. The route lookup succeeds (`find a route ... via port3`). It is then dropped by the **implicit deny** (`policy 0`), because no policy allows *to-HQ → port3*. A route-based VPN needs a policy for each direction.\n\n* **Static route**: the route to the branch LAN is found, out port3.\n* **Phase 2 selector**: the packet already came through the tunnel.\n* **port3 → to-HQ**: that policy handles traffic initiated by the branch. This session starts at HQ.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-011",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "An administrator uses the VPN Wizard Site to Site template to connect two FortiGates. Which three objects does the wizard create? (Choose three.)",
    "options": [
      "Phase 1 and phase 2 interface configurations for the tunnel",
      "A static route to the remote subnets through the tunnel, plus a blackhole route to the same destination",
      "Firewall policies for both directions between the local interface and the tunnel",
      "An IP pool used to source-NAT traffic into the tunnel",
      "A local-in policy that allows UDP 500 and 4500 on the WAN interface",
      "A VIP that maps the remote subnet to a local address range"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explanation": "For a Site to Site tunnel, the wizard creates:\n\n* phase1-interface and phase2-interface entries\n* local and remote address objects and groups\n* a route to the remote group via the tunnel, plus a **blackhole route at distance 254**\n* **two accept policies**, LAN → tunnel and tunnel → LAN, without NAT\n\nIt creates no IP pools, local-in policies or VIPs. IKE is accepted on the bound interface without a local-in policy, and VPN policies don't need NAT.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-012",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "The VPN Wizard adds a blackhole static route for the remote subnets. Which administrative distance does it give that route? (Enter the number.)",
    "answer": [
      "254"
    ],
    "explanation": "The wizard sets the blackhole route to **distance 254**. It is installed only when the tunnel route (distance 10) is withdrawn, which keeps traffic for the remote subnets from leaking out the default route.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-013",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Users at HQ can reach the BR2 network but not the BR1 network. Which statement best explains the BR1 counters?",
    "exhibit": "FGT-HQ # get vpn ipsec tunnel summary\n'to-BR1' 198.51.100.20:0  selectors(total,up): 1/1  rx(pkt,err): 0/0  tx(pkt,err): 1388/0\n'to-BR2' 192.0.2.44:0  selectors(total,up): 1/1  rx(pkt,err): 20914/0  tx(pkt,err): 21077/0",
    "options": [
      "HQ is encrypting traffic into to-BR1, but nothing comes back. FGT-BR1 is probably missing its tunnel-to-LAN policy or its route back to the HQ subnet.",
      "Phase 2 for to-BR1 is down because the selectors don't match.",
      "The pre-shared key for to-BR1 doesn't match.",
      "HQ has no route to the BR1 subnet through to-BR1."
    ],
    "answer": [
      0
    ],
    "explanation": "`selectors(total,up): 1/1` means phase 2 is up. **tx = 1388** means HQ routes and encrypts traffic into the tunnel. **rx = 0** means nothing returns, so the problem is on BR1's side of the conversation. Typical causes are a missing *to-HQ → LAN* policy, a missing route back to HQ's subnet on BR1, or BR1's hosts not replying.\n\n* **Phase 2 down**: the selector count shows it up.\n* **PSK**: a key mismatch would stop phase 1 entirely.\n* **No HQ route**: tx would stay at 0 if HQ weren't routing into the tunnel.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-014",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-Branch sits behind a carrier-grade NAT and connects to FGT-HQ's dial-up phase 1. After FGT-Branch reboots, HQ users can't reach the branch until someone at the branch sends traffic. Why?",
    "exhibit": "FGT-HQ # show vpn ipsec phase1-interface Branch-Dial\nconfig vpn ipsec phase1-interface\n    edit \"Branch-Dial\"\n        set type dynamic\n        set interface \"port1\"\n        set ike-version 2\n        set peertype any\n        set net-device disable\n        set proposal aes256gcm-prfsha384 aes256-sha256\n        set dhgrp 20 21\n        set psksecret ENC <encrypted>\n        set dpd on-idle\n    next\nend",
    "options": [
      "A dial-up (dynamic) gateway doesn't know the peer's address, so only the branch can initiate. Enabling auto-negotiate on the branch's phase 2 brings the tunnel up without user traffic.",
      "DPD on-idle prevents HQ from initiating the tunnel.",
      "net-device disable stops HQ from creating the tunnel interface until the branch sends traffic.",
      "IKEv2 doesn't support dial-up tunnels initiated from HQ, but IKEv1 does."
    ],
    "answer": [
      0
    ],
    "explanation": "With `type dynamic`, HQ accepts connections from unknown peers but has no address to initiate *to*. **Only the dial-up client can start the tunnel.** Setting `auto-negotiate enable` on the branch's phase 2 (and keeping it up with DPD or keepalive) brings the tunnel up as soon as the branch boots.\n\n* **DPD on-idle**: DPD only detects dead peers. It doesn't stop HQ from initiating.\n* **net-device**: it only controls whether each dial-up instance gets its own interface.\n* **IKE version**: no IKE version lets a responder initiate to an unknown address.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-015",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Which two statements are true? (Choose two.)",
    "exhibit": "FGT-HQ # diagnose vpn tunnel list name RA-FCT_0\nlist ipsec tunnel by names in vd 0\n------------------------------------------------------\nname=RA-FCT_0 ver=2 serial=7 203.0.113.10:4500->198.51.100.77:61022 nexthop=203.0.113.1 tun_id=10.212.134.10 tun_id6=::10.212.134.10 status=up dst_mtu=1500 weight=1\nbound_if=3 real_if=3 lgwy=static/1 tun=intf mode=dial_inst/3 encap=none/74664 options[123a8]=npu rgwy-chg rport-chg frag-rfc run_state=0 role=primary accept_traffic=1 overlay_id=0\nparent=RA-FCT index=0\nproxyid_num=1 child_num=0 refcnt=6 ilast=1 olast=1 ad=/0\nstat: rxp=5120 txp=4876 rxb=702133 txb=3310482\ndpd: mode=on-demand on=1 status=ok idle=20000ms retry=3 count=0 seqno=4\nnatt: mode=keepalive draft=0 interval=10 remote_port=61022\nfec: egress=0 ingress=0\nproxyid=RA-FCT proto=0 sa=1 ref=2 serial=1 add-route\n  src: 0:0.0.0.0-255.255.255.255:0\n  dst: 0:10.212.134.10-10.212.134.10:0\n  SA: ref=3 options=20682 type=00 soft=0 mtu=1422 expire=40211/0B replaywin=2048\n       seqno=130d esn=0 replaywin_lastseq=00001401 qat=0 hash_search_len=1\n  life: type=01 bytes=0/0 timeout=43186/43200\n  dec: spi=9c33a01e esp=aes key=32 6c1f0a9e3b7d42c58e01f6a2d9b4c37e5a8f0e12b6c4d3a7f9e2b1c0d8a7f6e5\n       ah=sha256 key=32 0f3e2d1c4b5a69788796a5b4c3d2e1f00a1b2c3d4e5f60718293a4b5c6d7e8f9\n  enc: spi=e1d07c55 esp=aes key=32 a9b8c7d6e5f40312213f4e5d6c7b8a99e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3\n       ah=sha256 key=32 5d4c3b2a1908f7e6d5c4b3a2918f7e6d5c4b3a2f1e0d9c8b7a69584736251403\n  dec:pkts/bytes=5120/702133, enc:pkts/bytes=4876/3310482",
    "options": [
      "The remote client is behind NAT, so ESP is encapsulated in UDP 4500.",
      "The FortiGate installed a route to 10.212.134.10 through this tunnel while the client is connected.",
      "RA-FCT_0 is the dial-up template entry, and it carries no user traffic itself.",
      "DPD sends probes on this tunnel every 20 seconds, whether or not traffic is flowing.",
      "The phase 2 SA rekeys every 20000 seconds."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "* **NAT-T**: the tunnel runs 4500 → 61022 with `natt: mode=keepalive`, so NAT was detected and ESP is UDP-encapsulated.\n* **add-route**: the `add-route` flag with the client's assigned address as the remote selector (`dst: 10.212.134.10`) means a route to the client is installed while the tunnel is up.\n\nWrong statements:\n\n* **Template entry**: `mode=dial_inst` and `parent=RA-FCT` mark this as a dynamic **instance**. The template is `RA-FCT`.\n* **Probes every 20 s**: DPD `mode=on-demand` probes only when outbound traffic gets no reply. `idle=20000ms` is the retry interval.\n* **Rekey every 20000 s**: the SA lifetime is 43200 s (`timeout=43186/43200`).",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-016",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FortiClient users report that all their traffic, including internet browsing, goes through the tunnel. The administrator wants only traffic to 10.0.0.0/8 to use the tunnel. What should the administrator change?",
    "exhibit": "FGT-HQ # show vpn ipsec phase1-interface RA-FCT\nconfig vpn ipsec phase1-interface\n    edit \"RA-FCT\"\n        set type dynamic\n        set interface \"port1\"\n        set ike-version 2\n        set peertype any\n        set net-device disable\n        set mode-cfg enable\n        set proposal aes256gcm-prfsha384 aes256-sha256\n        set dhgrp 20 21\n        set eap enable\n        set eap-identity send-request\n        set authusrgrp \"VPN-Users\"\n        set ipv4-start-ip 10.212.134.10\n        set ipv4-end-ip 10.212.134.200\n        set dns-mode auto\n        set psksecret ENC <encrypted>\n    next\nend",
    "options": [
      "Enable split tunnelling in the mode-cfg settings and set the split network to 10.0.0.0/8.",
      "Disable mode-cfg so the client keeps its own default route.",
      "Change the remote phase 2 selector on the FortiGate to 0.0.0.0/0.",
      "Set net-device enable so that each client gets its own interface."
    ],
    "answer": [
      0
    ],
    "explanation": "Mode-cfg pushes addressing *and routes* to the client. With no split-include networks configured (`ipv4-split-include`, *Enable IPv4 Split Tunnel* in the GUI), FortiClient sends **all** traffic into the tunnel. Configuring 10.0.0.0/8 as the split network makes the client tunnel only that range.\n\n* **Disable mode-cfg**: the client would lose its tunnel address assignment entirely.\n* **Selector 0.0.0.0/0**: it would still cover everything.\n* **net-device**: it affects interface creation on the FortiGate, not client routing.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-017",
    "topic": "5.1",
    "type": "single",
    "difficulty": 1,
    "stem": "A customer asks whether they can keep using SSL VPN tunnel mode after upgrading to FortiOS 8.0. What is the correct answer?",
    "options": [
      "No. SSL VPN tunnel mode was removed in FortiOS 7.6.3. Remote access should move to IPsec dial-up VPN, and the clientless web portal remains as Agentless VPN.",
      "Yes, but only on FortiGate-VM models.",
      "Yes. FortiOS 8.0 renamed SSL VPN tunnel mode to Agentless VPN.",
      "Yes, after enabling it in System > Feature Visibility."
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS **7.6.3 removed SSL VPN tunnel mode** from the GUI and CLI on all models. Its settings don't carry over on upgrade. Fortinet's replacement is **IPsec** remote access, which can also run over TCP 443. SSL VPN **web mode** survives as **Agentless VPN**, a browser portal that is disabled by default (`set sslvpn-web-mode enable`). Agentless VPN is not a renamed tunnel mode, and no feature visibility switch brings tunnel mode back.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-018",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-Branch prefers its tunnel BR-p2 for traffic to HQ. Sessions that FGT-Branch starts through BR-p2 are dropped on FGT-HQ with \"reverse path check fail, drop\", although both tunnels are up. What should the administrator change on FGT-HQ?",
    "exhibit": "FGT-HQ # show router static\nconfig router static\n    edit 10\n        set dst 10.20.0.0 255.255.0.0\n        set device \"BR-p1\"\n    next\n    edit 11\n        set dst 10.20.0.0 255.255.0.0\n        set distance 20\n        set device \"BR-p2\"\n    next\n    edit 12\n        set dst 10.20.0.0 255.255.0.0\n        set blackhole enable\n        set distance 254\n    next\nend",
    "options": [
      "Give route 11 the same distance as route 10 and a higher priority value, so both routes stay in the routing table.",
      "Lower route 11's distance to 5.",
      "Set dpd on-idle on BR-p2.",
      "Remove the blackhole route, because it conflicts with the tunnel routes."
    ],
    "answer": [
      0
    ],
    "explanation": "Route 11 has distance 20, so it is a **floating** route that isn't in the routing table while route 10 is up. When FGT-Branch sends a new session through BR-p2, FGT-HQ's RPF check finds no active route to 10.20.0.0/16 via BR-p2 and drops the packet. With **equal distance and a higher priority value**, both routes are installed: BR-p1 stays preferred for outbound traffic, and RPF passes on BR-p2.\n\n* **Distance 5**: route 11 would become the only installed route. Sessions arriving on BR-p1 would then fail RPF instead.\n* **DPD**: DPD detects dead peers. It doesn't affect RPF.\n* **Blackhole**: it is used only when both tunnel routes are gone.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-019",
    "topic": "5.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each phase 1 DPD setting with its behaviour.",
    "pairs": [
      [
        "disable",
        "No DPD probes are sent"
      ],
      [
        "on-idle",
        "Probes are also sent when the tunnel is idle"
      ],
      [
        "on-demand",
        "Probes are sent only when outbound traffic receives no inbound reply"
      ]
    ],
    "explanation": "`on-demand` is the default and keeps DPD traffic low on large dial-up servers. `on-idle` actively checks quiet tunnels, which suits standby tunnels in redundant designs: you want to know the backup is dead *before* you need it. `disable` turns DPD off. A dead peer is then noticed only when the SAs expire.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-020",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "In a redundant design, an administrator wants backup phase 1 BR-backup to stay down until phase 1 BR-p1 goes down. Which phase1-interface attribute, set on BR-backup, does this? (Enter the attribute name.)",
    "answer": [
      "monitor",
      "set monitor",
      "set monitor BR-p1",
      "set monitor \"BR-p1\""
    ],
    "explanation": "`set monitor \"BR-p1\"` on the backup phase 1 makes it a standby that comes up only when the monitored phase 1 fails. It is CLI only. Keep DPD enabled on the primary so that a silent failure of BR-p1 is detected and the backup is triggered.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-021",
    "topic": "5.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An organization wants a full-mesh IPsec VPN between 6 sites, with a direct tunnel between every pair of sites. How many tunnels are required?",
    "options": [
      "15",
      "6",
      "12",
      "30"
    ],
    "answer": [
      0
    ],
    "explanation": "A full mesh needs n(n−1)/2 tunnels: 6 × 5 / 2 = **15**. A hub-and-spoke design would need 5. Quadratic growth like this is why large deployments use hub and spoke with **ADVPN** shortcuts instead.\n\n* **6** is just the number of sites.\n* **12** has no basis in the formula.\n* **30** counts each tunnel twice, once from each end.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-022",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about ADVPN are true? (Choose two.)",
    "options": [
      "Spokes keep permanent tunnels only to the hub or hubs.",
      "When spokes exchange traffic through the hub, the hub triggers a direct shortcut tunnel between them.",
      "Every spoke must be statically configured with a phase 1 for every other spoke.",
      "ADVPN works only with IKEv1 aggressive mode.",
      "ADVPN requires policy-based VPNs."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "ADVPN keeps the simple hub-and-spoke configuration and builds **on-demand shortcut tunnels**. The hub (`auto-discovery-sender`) tells spokes (`auto-discovery-receiver`) about a better path, and they negotiate a direct tunnel.\n\n* **Static phase 1 per spoke**: avoiding this is the whole point of ADVPN.\n* **IKEv1 aggressive mode**: ADVPN isn't tied to IKEv1. Modern designs use IKEv2.\n* **Policy-based**: ADVPN needs route-based tunnels, normally with BGP and SD-WAN.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-023",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "FGT-A and FGT-B each have two ISP links. The administrator builds a redundant route-based VPN with static routing between them. Which three items are part of the configuration on each FortiGate? (Choose three.)",
    "options": [
      "One phase 1 for each path between the peers, with dead peer detection enabled",
      "One phase 2 for each phase 1",
      "One static route to the remote subnet for each tunnel interface, ranked by distance or priority",
      "set asymroute enable under config system settings",
      "set ike-tcp-service enable under config system settings",
      "An FGCP HA cluster on each side"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explanation": "Fortinet's redundant VPN design uses one phase 1 per path with DPD, one phase 2 per phase 1, one static route per tunnel with different distance or priority values, plus policies for each tunnel and normally a blackhole route.\n\n* **asymroute**: it would weaken security, and correct route design makes it unnecessary.\n* **ike-tcp-service**: it is only needed to run IKE over TCP.\n* **HA cluster**: optional, and unrelated to tunnel redundancy.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-024",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. FGT-HQ runs FortiOS 8.0 with the default IKE proposal visibility. The third-party peer can't be changed and offers AES-256-CBC, SHA-1 and DH group 14. What must the administrator do on FGT-HQ to establish the tunnel?",
    "exhibit": "ike V=root:0:to-Partner:211: responder received SA_INIT msg\nike V=root:0:to-Partner:211: incoming proposal:\nike V=root:0:to-Partner:211: proposal id = 1:\nike V=root:0:to-Partner:211:   protocol = IKEv2:\nike V=root:0:to-Partner:211:      encapsulation = IKEv2/none\nike V=root:0:to-Partner:211:         type=ENCR, val=AES_CBC (key_len = 256)\nike V=root:0:to-Partner:211:         type=INTEGR, val=AUTH_HMAC_SHA_96\nike V=root:0:to-Partner:211:         type=PRF, val=PRF_HMAC_SHA\nike V=root:0:to-Partner:211:         type=DH_GROUP, val=MODP2048.\nike V=root:0:to-Partner:211: my proposal, gw to-Partner:\nike V=root:0:to-Partner:211: proposal id = 1:\nike V=root:0:to-Partner:211:   protocol = IKEv2:\nike V=root:0:to-Partner:211:      encapsulation = IKEv2/none\nike V=root:0:to-Partner:211:         type=ENCR, val=AES_GCM_16 (key_len = 256)\nike V=root:0:to-Partner:211:         type=INTEGR, val=NONE\nike V=root:0:to-Partner:211:         type=PRF, val=PRF_HMAC_SHA2_384\nike V=root:0:to-Partner:211:         type=DH_GROUP, val=ECP384.\nike V=root:0:to-Partner:211:         type=DH_GROUP, val=ECP521.\nike V=root:0:to-Partner:211: no SA proposal chosen",
    "options": [
      "Set ike-proposal-visibility all under config system settings, then add an aes256-sha1 proposal and DH group 14 to the phase 1.",
      "Change the phase 1 to IKEv1 main mode.",
      "Set nattraversal forced on the phase 1.",
      "Re-enter the pre-shared key on both peers."
    ],
    "answer": [
      0
    ],
    "explanation": "The debug shows a **phase 1 proposal mismatch** (`no SA proposal chosen`). The peer offers AES-CBC-256, SHA-1 and MODP2048 (group 14). FGT-HQ offers only AES-GCM-256 with PRF SHA-384 and ECP384/521. In FortiOS 8.0 the CLI shows only **recommended** proposals by default: SHA-1 combinations and DH groups 1, 2, 5, 14 and 27 are hidden. So first set `ike-proposal-visibility all`, then add the matching proposal and DH group.\n\n* **IKEv1**: the peer is speaking IKEv2, and the algorithms still wouldn't match.\n* **NAT-T**: unrelated to proposals.\n* **PSK**: authentication happens after a proposal is agreed, so the key isn't the problem yet.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-025",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "In FortiOS 8.0, which config system settings attribute must be set to all so that the CLI offers non-recommended IKE proposals and DH groups such as group 14? (Enter the attribute name.)",
    "answer": [
      "ike-proposal-visibility",
      "set ike-proposal-visibility all"
    ],
    "explanation": "`set ike-proposal-visibility {recommended | all}`. The default `recommended` hides DH groups 1, 2, 5, 14 and 27 and older algorithms, leaving AES-CBC/GCM, ChaCha20-Poly1305 and SHA-256/384/512.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-026",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "What is the effect of set nattraversal forced on a phase 1?",
    "options": [
      "IPsec uses UDP encapsulation (UDP 4500) even when no NAT device is detected between the peers.",
      "The FortiGate source-NATs all traffic entering the tunnel.",
      "IKE negotiation is forced onto TCP port 443.",
      "The tunnel comes up only if NAT is detected."
    ],
    "answer": [
      0
    ],
    "explanation": "With `forced`, the FortiGate uses a port value of zero when it builds its NAT discovery hash. The peer therefore believes NAT is present, and both sides use **UDP-encapsulated ESP** even without NAT. This helps when an intermediate device mishandles raw ESP.\n\n* **Source NAT**: NAT-T has nothing to do with translating user traffic.\n* **TCP 443**: that is IKE over TCP (`ike-tcp-service`).\n* **Only with NAT**: `forced` does the opposite. It encapsulates whether or not NAT is present.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-027",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What does the log entry indicate?",
    "exhibit": "2: date=2026-10-28 time=11:22:29 eventtime=1793211749204417733 tz=\"-0700\" logid=\"0101037138\" type=\"event\" subtype=\"vpn\" level=\"notice\" vd=\"root\" logdesc=\"IPsec connection status changed\" msg=\"IPsec connection status change\" action=\"tunnel-down\" remip=198.51.100.20 locip=203.0.113.10 remport=4500 locport=4500 outintf=\"port1\" cookies=\"7b21e0c4a9f35d18/c4e18a2d73b0f956\" user=\"198.51.100.20\" group=\"N/A\" useralt=\"N/A\" eapuser=\"N/A\" eapauthgroup=\"N/A\" assignip=N/A vpntunnel=\"to-BR1\" tunnelip=N/A tunnelid=1793120044 tunneltype=\"ipsec\" duration=86120 sentbyte=91234012 rcvdbyte=50120311 nextstat=0 reason=\"DPD timeout\"",
    "options": [
      "The peer stopped answering dead peer detection probes, so FGT-HQ brought the tunnel down.",
      "An administrator flushed the tunnel from the CLI.",
      "The phase 2 key lifetime expired and the rekey succeeded.",
      "The pre-shared key was changed on the peer."
    ],
    "answer": [
      0
    ],
    "explanation": "Log **0101037138** (*IPsec connection status changed*) with `action=\"tunnel-down\"` and the 8.0.1 `reason=\"DPD timeout\"` means the peer became unresponsive. Typical causes are an upstream failure or a peer reboot. Note that remport and locport 4500 show NAT-T was in use.\n\n* **Admin flush**: that would show `reason=\"tunnel flush\"` (or `gw flush` for a gateway clear).\n* **Rekey**: a successful rekey doesn't bring the tunnel down.\n* **PSK change**: that causes authentication failures on the *next* negotiation, not a DPD timeout.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-028",
    "topic": "5.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each VPN event log ID with its log description.",
    "pairs": [
      [
        "0101037124",
        "IPsec phase 1 error"
      ],
      [
        "0101037125",
        "IPsec phase 2 error"
      ],
      [
        "0101037138",
        "IPsec connection status changed"
      ],
      [
        "0101037133",
        "IPsec SA installed"
      ],
      [
        "0101037141",
        "IPsec tunnel statistics"
      ]
    ],
    "explanation": "These are FortiOS VPN event logs (`type=\"event\" subtype=\"vpn\"`). 37124 and 37125 report phase 1 and phase 2 errors, now with a `reason` field. 37138 reports tunnel-up and tunnel-down. 37133 reports an SA install with in/out SPIs. 37141 holds periodic tunnel statistics. Progress logs are 37127/37128 (phase 1) and 37129/37130 (phase 2).",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-029",
    "topic": "5.1",
    "type": "order",
    "difficulty": 2,
    "stem": "A new site-to-site tunnel passes no traffic. Order the troubleshooting steps from first to last.",
    "items": [
      "Verify that the gateways can exchange UDP 500/4500 across the underlay",
      "Confirm that the IKE SA (phase 1) is established",
      "Confirm that the IPsec SAs (phase 2) are up for the expected selectors",
      "Verify that the route to the remote subnet points into the tunnel interface",
      "Verify that firewall policies allow the traffic in both directions"
    ],
    "explanation": "Work up the stack. Phase 1 needs underlay reachability. Phase 2 needs phase 1. Only after the SAs exist does routing decide whether traffic enters the tunnel. FortiOS performs the route lookup before the policy lookup, so check the route, then the policies (`diagnose debug flow` shows both).",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-030",
    "topic": "5.1",
    "type": "order",
    "difficulty": 3,
    "stem": "Two FortiGates negotiate a new IKEv2 tunnel with set addke1 36 (ML-KEM-768) and set childless-ike enable. Order the exchanges as they occur.",
    "items": [
      "IKE_SA_INIT: algorithms negotiated and classical DH values exchanged",
      "IKE_INTERMEDIATE: the additional ML-KEM key exchange is carried",
      "IKE_AUTH: the peers authenticate each other",
      "CREATE_CHILD_SA: the IPsec SAs are created"
    ],
    "explanation": "FortiOS implements RFC 9370 hybrid key exchange using RFC 9242's **IKE_INTERMEDIATE** exchange. IKE_SA_INIT still runs the classical (EC)DH. One IKE_INTERMEDIATE exchange per ADDKE round then carries the KEM. IKE_AUTH authenticates. With `childless-ike`, no child SA is created in IKE_AUTH, so the IPsec SAs come from **CREATE_CHILD_SA**. If phase 2 also has ADDKE groups, their extra key exchanges follow in IKE_FOLLOWUP_KE exchanges (FortiOS debug: `FOLLOWUP_KE message (CHILD_SA)`).",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-031",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Which statement about TLS 1.3-based VPN negotiation in FortiOS 8.0 is correct?",
    "options": [
      "It carries IKE and ESP inside TLS 1.3 over TCP, it is enabled per VDOM with ike-tcp-service and ike-tls-service, and it is supported between FortiGates but not yet with FortiClient.",
      "It replaces IKE with a TLS handshake, so no phase 1 configuration is needed.",
      "It is available only for IKEv1 tunnels.",
      "It is a renamed version of SSL VPN tunnel mode for FortiClient users."
    ],
    "answer": [
      0
    ],
    "explanation": "The 8.0 feature *TLS 1.3 based VPN over TCP* adds TLS as an option for IKE/ESP over TCP. Enable *Allow VPN negotiation over TCP* and *Use TLS* (`ike-tcp-service`, `ike-tls-service`, both per VDOM). Supported topologies are site-to-site and dial-up **between FortiGates**. FortiClient doesn't support TLS-based VPN over TCP yet.\n\n* **Replaces IKE**: IKE still runs. It is just transported inside TLS.\n* **IKEv1 only**: TCP transport is an IKEv2 capability.\n* **Renamed SSL VPN**: SSL VPN tunnel mode was removed. This is IPsec.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-032",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. UDP 500 and 4500 are blocked by the branch's ISP, yet the tunnel is up. Which statement explains the output?",
    "exhibit": "FGT-Branch # diagnose vpn ike gateway list name to-HQ\n\nvd: root/0\nname: to-HQ\nversion: 2\ninterface: wan1 5\n...\ntransport: TLS\ntcp-tx-1m-rate : 412 kbps\ntcp-tx-5m-rate : 398 kbps\ntcp-tx-drop    : 0\ntcp-rx-1m-rate : 1203 kbps\ntcp-rx-5m-rate : 1150 kbps\ntcp-rx-drop    : 0\ncreated: 7210s ago\n...",
    "options": [
      "IKE and ESP are carried inside TLS 1.3 over TCP, because ike-tcp-service and ike-tls-service are enabled and the phase 1 transport is auto.",
      "The tunnel uses Fortinet proprietary ESP-in-TCP encapsulation (fortinet-esp).",
      "The tunnel is an Agentless VPN session.",
      "The tunnel uses IKEv1 over TCP because UDP is blocked."
    ],
    "answer": [
      0
    ],
    "explanation": "`transport: TLS`, with TCP rate and drop counters, is how FortiOS 8.0 shows a tunnel negotiated over **TLS 1.3** on TCP. With `transport auto`, the static phase 1 tried UDP first and fell back to TCP/TLS when UDP failed. The VDOM must have `ike-tcp-service enable` and `ike-tls-service enable`.\n\n* **fortinet-esp**: Fortinet's proprietary encapsulation is a different TCP option, not TLS.\n* **Agentless VPN**: a browser portal, not an IKE gateway.\n* **IKEv1**: the output shows `version: 2`.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-033",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "When IKE over TCP is enabled under config system settings, which TCP port does ike-tcp-port use by default? (Enter the number.)",
    "answer": [
      "443"
    ],
    "explanation": "`ike-tcp-port` defaults to **443** (since FortiOS 7.6.1; it was 4500 up to 7.6.0), so IKE/ESP over TCP or TLS blends in with HTTPS. It is set per VDOM together with `ike-tcp-service` (and `ike-tls-service` for TLS).",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-034",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A bank worries that encrypted VPN traffic recorded today could be decrypted by a future quantum computer (\"harvest now, decrypt later\"). Which FortiOS IPsec feature addresses the key exchange part of this threat?",
    "options": [
      "IKEv2 additional key exchanges (addke1–addke7) using ML-KEM, per RFC 9370",
      "Enabling PFS with DH group 21 in phase 2",
      "Changing the ESP proposal to AES-256-GCM",
      "Using IKEv1 aggressive mode with a longer pre-shared key"
    ],
    "answer": [
      0
    ],
    "explanation": "Harvest-now-decrypt-later targets the **key exchange**. Classical (EC)DH, including group 21, is vulnerable to a large quantum computer. FortiOS adds **hybrid** key exchange: classical DH plus one or more post-quantum KEMs such as **ML-KEM** (FIPS 203) in `addke` rounds (RFC 9370 over IKE_INTERMEDIATE).\n\n* **PFS with group 21**: it is still classical ECDH.\n* **AES-256-GCM**: it protects the data, but the keys still come from the vulnerable exchange.\n* **IKEv1 aggressive mode**: it is weaker, not stronger.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-035",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Which statement about the tunnel is correct?",
    "exhibit": "FGT-HQ # show vpn ipsec phase1-interface to-Branch\nconfig vpn ipsec phase1-interface\n    edit \"to-Branch\"\n        set interface \"port1\"\n        set ike-version 2\n        set peertype any\n        set net-device disable\n        set proposal aes256gcm-prfsha384\n        set dhgrp 20\n        set addke1 36\n        set childless-ike enable\n        set remote-gw 198.51.100.20\n        set psksecret ENC <encrypted>\n    next\nend\n\nFGT-HQ # diagnose debug application ike -1\n...\nike V=root:0:to-Branch:58: initiator received SA_INIT response\n...\nike V=root:0:to-Branch:58: incoming proposal:\nike V=root:0:to-Branch:58: proposal id = 1:\nike V=root:0:to-Branch:58:   protocol = IKEv2:\nike V=root:0:to-Branch:58:      encapsulation = IKEv2/none\nike V=root:0:to-Branch:58:         type=ENCR, val=AES_GCM_16 (key_len = 256)\nike V=root:0:to-Branch:58:         type=PRF, val=PRF_HMAC_SHA2_384\nike V=root:0:to-Branch:58:         type=DH_GROUP, val=ECP384.\nike V=root:0:to-Branch:58:         type=ADDKE1, val=ML-KEM-768.\nike V=root:0:to-Branch:58: matched proposal id 1\n...\nike V=root:0:to-Branch:58: initiator preparing INTERMEDIATE msg\n...\nike V=root:0:to-Branch:58: processing KE group 36\nike V=root:0:to-Branch:58: KEM decapsulate okay",
    "options": [
      "The IKE SA keys combine a classical ECP384 exchange with an additional ML-KEM-768 exchange (hybrid key exchange).",
      "ML-KEM-768 replaces the Diffie-Hellman exchange, so dhgrp 20 is ignored.",
      "ESP traffic is now encrypted with ML-KEM instead of AES-256-GCM.",
      "The configuration also works with IKEv1 main mode peers."
    ],
    "answer": [
      0
    ],
    "explanation": "The matched proposal contains both `DH_GROUP ECP384` (group 20) and `ADDKE1 ML-KEM-768` (group 36). FortiOS performs the classical exchange in IKE_SA_INIT and the ML-KEM exchange in IKE_INTERMEDIATE, then mixes both secrets into the keys. That is **hybrid** PQC. `KEM decapsulate okay` (logged by the initiator, FGT-HQ here, after the INTERMEDIATE response) confirms the KEM step. `diagnose vpn ike gateway list` would show `PQC-KEM (IKE): yes`.\n\n* **Replaces DH**: classical DH still runs.\n* **ML-KEM for ESP**: ML-KEM is a key-establishment mechanism. ESP still uses AES-GCM.\n* **IKEv1**: additional key exchanges are an IKEv2 extension.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-036",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which three mechanisms does FortiOS provide to make IKEv2 IPsec VPNs quantum-safe? (Choose three.)",
    "options": [
      "Hybrid post-quantum key exchange with ML-KEM in additional key exchange rounds (RFC 9370)",
      "Signature authentication with ML-DSA or SLH-DSA certificates using the RFC 7427 framework",
      "A post-quantum preshared key (PPK, RFC 8784) mixed into key derivation",
      "Phase 2 PFS with DH group 14",
      "3DES encryption for phase 2",
      "IKEv1 aggressive mode with peer IDs"
    ],
    "answer": [
      0,
      1,
      2
    ],
    "explanation": "FortiOS's documented post-quantum strategy layers:\n\n* **PQC key exchange**: `addke1-7` with ML-KEM, using RFC 9370 and IKE_INTERMEDIATE.\n* **PQC signatures**: `digital-signature-auth enable` with ML-DSA (FIPS 204) or SLH-DSA (FIPS 205) certificates, new in 8.0.\n* **PPK**: `set ppk allow|require` with `ppk-secret`, per RFC 8784.\n* **QKD**: keys from a quantum key distribution system.\n\nDH group 14 is classical and breakable by a quantum computer. 3DES and IKEv1 aggressive mode are legacy and weaker.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-037",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "FortiOS post-quantum additional key exchanges (addke) and PQC signature authentication require which IKE version? (Enter the version number.)",
    "answer": [
      "2",
      "IKEv2",
      "v2",
      "version 2",
      "ikev2"
    ],
    "explanation": "They need **IKEv2**. RFC 9370, RFC 9242 (IKE_INTERMEDIATE), RFC 7427 and RFC 8784 all extend IKEv2. IKEv2 is also the FortiOS 8.0 default for new tunnels.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-038",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. To meet a FIPS 204 requirement, the two FortiGates must authenticate each other with ML-DSA certificates, which are already imported. Which additional phase 1 setting is required?",
    "exhibit": "FGT-HQ # show vpn ipsec phase1-interface to-DR\nconfig vpn ipsec phase1-interface\n    edit \"to-DR\"\n        set interface \"port1\"\n        set ike-version 2\n        set authmethod signature\n        set peertype peer\n        set net-device disable\n        set proposal aes256gcm-prfsha384\n        set dhgrp 21\n        set certificate \"fgt-hq-ml-dsa\"\n        set peer \"DR-ML-DSA-peer\"\n        set remote-gw 192.0.2.77\n    next\nend",
    "options": [
      "set digital-signature-auth enable",
      "set ppk require",
      "set addke1 37",
      "set authmethod psk"
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS 8.0 adds **signature authentication using post-quantum cryptography**. The RFC 7427 framework makes IKEv2 signature authentication algorithm-agnostic, so certificates with ML-DSA (FIPS 204) or SLH-DSA (FIPS 205) keys can be used. It is enabled with `set digital-signature-auth enable` together with `authmethod signature`. `signature-hash-alg` can be set to `identity` (RFC 8420).\n\n* **ppk**: it adds a post-quantum preshared key to key derivation. It isn't certificate authentication.\n* **addke1 37**: it adds an ML-KEM-1024 key exchange. That is key establishment, not authentication.\n* **authmethod psk**: it would drop certificates altogether.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-039",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Which of the following is available only when the phase 1 uses IKE version 2 on FortiOS 8.0?",
    "options": [
      "Negotiating the VPN over TCP or TLS 1.3 transport",
      "XAuth user authentication",
      "Aggressive mode",
      "Dead peer detection"
    ],
    "answer": [
      0
    ],
    "explanation": "FortiOS documents that IKEv2 supports **TCP as transport** (RFC 8229), and the 8.0 TLS option builds on it. Other IKEv2-only features include EAP, `network-id` and PQC key exchange.\n\n* **XAuth and aggressive mode**: IKEv1-only.\n* **DPD**: works with both versions.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-040",
    "topic": "5.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Both dial-up phase 1 configurations are on the same interface IP. Users configured for RA-Eng always fail authentication, while RA-Sales users connect normally. What should the administrator do?",
    "exhibit": "FGT-HQ # show vpn ipsec phase1-interface\nconfig vpn ipsec phase1-interface\n    edit \"RA-Sales\"\n        set type dynamic\n        set interface \"port1\"\n        set ike-version 1\n        set mode main\n        set peertype any\n        set proposal aes256-sha256\n        set dhgrp 20\n        set psksecret ENC <encrypted>\n    next\n    edit \"RA-Eng\"\n        set type dynamic\n        set interface \"port1\"\n        set ike-version 1\n        set mode main\n        set peertype any\n        set proposal aes256-sha256\n        set dhgrp 20\n        set psksecret ENC <encrypted>\n    next\nend",
    "options": [
      "Use aggressive mode on both tunnels and assign each a unique peer ID (peertype one with peerid) that the clients send as their local ID.",
      "Set net-device enable on RA-Eng.",
      "Set dpd on-idle on both tunnels.",
      "Move RA-Eng above RA-Sales in the configuration."
    ],
    "answer": [
      0
    ],
    "explanation": "With IKEv1 **main mode**, the responder must choose a phase 1, and with it the PSK, before the encrypted ID arrives. Both tunnels match on the same IP with `peertype any`, so the FortiGate always selects the first one (RA-Sales), and RA-Eng's key never matches. FortiOS requires **aggressive mode** with distinct **peer IDs** when several dial-up phase 1s share an interface IP and use PSK.\n\n* **net-device and DPD**: neither affects gateway selection.\n* **Moving RA-Eng up**: it would just break RA-Sales instead.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-041",
    "topic": "5.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator on FortiOS 8.0 wants to offer a clientless, browser-based portal for RDP and SSH access. What must be done first?",
    "options": [
      "Enable Agentless VPN with set sslvpn-web-mode enable under config system global.",
      "Enable SSL VPN tunnel mode in the portal.",
      "Install FortiClient on each user device.",
      "Nothing, because Agentless VPN is enabled and visible by default."
    ],
    "answer": [
      0
    ],
    "explanation": "SSL VPN web mode is now **Agentless VPN**. It is **disabled and hidden by default**. Enable it with `config system global` → `set sslvpn-web-mode enable`, and make the menus visible with *Feature Visibility* (`gui-sslvpn`). It isn't available on some small models.\n\n* **Tunnel mode**: it was removed in 7.6.3.\n* **FortiClient**: \"agentless\" means no client software is needed.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-042",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. FGT-HQ has no static route to 10.30.0.0/24, but HQ users can reach the branch LAN while the dial-up tunnel is up. Why?",
    "exhibit": "FGT-HQ # get router info routing-table all\n...\nRouting table for VRF=0\nS*      0.0.0.0/0 [10/0] via 203.0.113.1, port1, [1/0]\nC       10.0.5.0/24 is directly connected, port3\nS       10.30.0.0/24 [15/0] via Branch-Dial tunnel 198.51.100.66, [1/0]\nC       203.0.113.0/24 is directly connected, port1",
    "options": [
      "add-route (enabled by default on dial-up phase 1s) installs a route to the client's phase 2 selector while the tunnel is up.",
      "OSPF learned the route over the tunnel.",
      "The FortiGate creates the route from the blackhole route when the tunnel comes up.",
      "mode-cfg always adds a route to 10.30.0.0/24 for every dial-up client."
    ],
    "answer": [
      0
    ],
    "explanation": "On dial-up tunnels, `add-route` is **enabled by default**. When a client negotiates phase 2 with a remote selector of 10.30.0.0/24, FortiOS adds a route to it through the tunnel instance, and removes it when the tunnel goes down. The route shows as a static route via the tunnel (distance 15 here). Phase 1 `distance` and `priority` settings control its values.\n\n* **OSPF**: it would show `O`, not `S`.\n* **Blackhole route**: no blackhole route is involved.\n* **mode-cfg**: it assigns client addressing. The route comes from the negotiated selector.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-043",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Phase 1 to FGT-BR4 fails. What is the cause?",
    "exhibit": "ike V=root:0:to-BR4:3021: responder received AUTH msg\nike V=root:0:to-BR4:3021: processing notify type INITIAL_CONTACT\nike V=root:0:to-BR4:3021: peer identifier IPV4_ADDR 192.0.2.61\nike V=root:0:to-BR4:3021: PSK auth failed: probable pre-shared key mismatch",
    "options": [
      "The pre-shared keys configured on the two peers do not match.",
      "The phase 1 encryption proposals do not match.",
      "The phase 2 selectors do not match.",
      "NAT traversal is disabled on one side."
    ],
    "answer": [
      0
    ],
    "explanation": "The failure happens while the **IKE_AUTH** message is processed: `PSK auth failed: probable pre-shared key mismatch`. The peers already agreed on algorithms in IKE_SA_INIT, so proposals aren't the problem. Phase 2 selectors are checked only after authentication succeeds. In 8.0.1 the same cause appears in the log as `reason=\"probable PSK mismatch\"`.\n\nNAT-T problems show as missing replies or NAT-D issues, not as an authentication failure.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  },
  {
    "id": "d5-044",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "What is the default phase 2 key lifetime (keylifeseconds) of a FortiOS IPsec phase 2, in seconds? (Enter the number.)",
    "answer": [
      "43200"
    ],
    "explanation": "Phase 2 SAs default to **43200 s** (12 h). Phase 1 `keylife` defaults to 86400 s (24 h). Look for `timeout=…/43200` in `diagnose vpn tunnel list` and `lifetime/rekey: 86400/…` in `diagnose vpn ike gateway list`.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-045",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator wants FGT-HQ and FGT-Branch to form a BGP peering directly across the route-based tunnel to-Branch, using addresses on the tunnel itself. What must the administrator configure on FGT-HQ?",
    "exhibit": "FGT-HQ # show system interface to-Branch\nconfig system interface\n    edit \"to-Branch\"\n        set vdom \"root\"\n        set type tunnel\n        set snmp-index 9\n        set interface \"port1\"\n    next\nend",
    "options": [
      "Assign tunnel addresses, for example set ip 169.254.10.1 255.255.255.255 and set remote-ip 169.254.10.2 255.255.255.255, and peer BGP with the remote address.",
      "Convert the tunnel to a policy-based VPN.",
      "Set the phase 2 selectors to the BGP neighbour's loopback only.",
      "Enable add-route on the phase 1."
    ],
    "answer": [
      0
    ],
    "explanation": "Tunnel interfaces have no IP address by default. That is fine for static routes that point at the interface, but a BGP session across the tunnel needs addresses to peer on. (Peering between loopbacks, with static routes to them through the tunnel, is another valid design, but the stem asks for addresses on the tunnel itself.) Configure `ip` and `remote-ip` on the tunnel interface on both sides, mirrored, and use those addresses as BGP neighbours. The phase 2 selectors must permit the traffic. 0.0.0.0/0 covers it.\n\n* **Policy-based**: it has no interface to run BGP on.\n* **Selectors limited to the loopback**: that would block the user traffic.\n* **add-route**: it is a dial-up feature.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-046",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An FGCP active-passive cluster terminates several site-to-site IPsec tunnels on its port1 interface IP. Session pickup is enabled, and the phase 1 settings are at their defaults. What happens to the tunnels when the primary unit fails?",
    "options": [
      "The new primary takes over the tunnels using the IPsec SAs synchronised from the former primary, without a full renegotiation.",
      "All tunnels go down until the remote peers time out and renegotiate from scratch with the new primary.",
      "The tunnels stay on the failed unit until it is replaced.",
      "Tunnels survive only if they use IKEv1."
    ],
    "answer": [
      0
    ],
    "explanation": "FGCP synchronises IKE and IPsec SAs to the other cluster members (for IKEv2 it also syncs the IKE message IDs). The cluster's interface IPs and virtual MACs move to the new primary, so the remote peers keep sending to the same address, and the new primary already has the SAs. Fortinet's recipe for uninterrupted traffic is `session-pickup enable` under `config system ha` plus `ha-sync-esp-seqno enable` on the phase 1 (the default), which keeps ESP sequence numbers ahead so the peer's anti-replay check accepts traffic after failover.\n\n* **Peers renegotiate from scratch**: that would be needed only if the SAs weren't synchronised. FGCP synchronises them.\n* **Tunnels stay on the failed unit**: the cluster IPs move, so the tunnels move with them.\n* **IKEv1 only**: both IKE versions are synchronised. IKEv2 is the default and fully supported.",
    "lesson": "5.1-ipsec-redundant-meshed"
  },
  {
    "id": "d5-047",
    "topic": "5.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about a FortiGate dial-up IPsec server (phase 1 set type dynamic) are true? (Choose two.)",
    "options": [
      "Each connected client gets a dynamic tunnel instance named after the phase 1 with a numeric suffix, such as HQ-Dial_0.",
      "Firewall policies reference the parent tunnel interface and apply to all its instances.",
      "After the first connection, the server can initiate the tunnel towards the client.",
      "Each client must have a static public IP address.",
      "The server must use IKEv1 aggressive mode."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "A dynamic phase 1 is a **template**. Each client connection spawns an instance (`<name>_0`, `<name>_1`, and so on), shown as `mode=dial_inst` in `diagnose vpn tunnel list`. Policies are written once against the parent interface.\n\n* **Server initiates**: the server never knows where to initiate, so only clients can.\n* **Static client IPs**: dial-up exists precisely because clients don't have known addresses.\n* **Aggressive mode**: it is needed only for specific IKEv1 multi-tunnel cases, and IKEv2 is the default.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-048",
    "topic": "5.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "FortiOS names the virtual tunnel interface of a route-based VPN after its phase1-interface name. What is the maximum length of that name, in characters? (Enter the number.)",
    "answer": [
      "15"
    ],
    "explanation": "A route-based (interface mode) phase 1 name can have at most **15** characters, because it also becomes the interface name. Plan site naming conventions accordingly, such as `HQ-to-BR01`.",
    "lesson": "5.1-ipsec-concepts"
  },
  {
    "id": "d5-049",
    "topic": "5.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Refer to the exhibit. The tunnel comes up only when users send traffic, and the first packets are lost while it negotiates. The administrator wants the IPsec SA to be negotiated and kept up without waiting for traffic. What should be changed?",
    "exhibit": "FGT-Branch # show full-configuration vpn ipsec phase2-interface to-HQ | grep -f auto-negotiate\nconfig vpn ipsec phase2-interface\n    edit \"to-HQ\"\n        set auto-negotiate disable <---\n    next\nend",
    "options": [
      "set auto-negotiate enable on the phase 2",
      "set dpd on-demand on the phase 1",
      "set keylifeseconds 86400 on the phase 2",
      "set add-route enable on the phase 2"
    ],
    "answer": [
      0
    ],
    "explanation": "Phase 2 `auto-negotiate` (disabled by default) makes the FortiGate bring up the SA as soon as phase 1 is available and renegotiate it when it expires, so the tunnel doesn't wait for interesting traffic. It is also how a dial-up client keeps its tunnel up for traffic from the hub.\n\n* **DPD**: it detects dead peers. It doesn't initiate SAs.\n* **Longer key life**: it only delays rekeys.\n* **add-route**: it controls route installation on dial-up servers.",
    "lesson": "5.1-ipsec-wizard-site-dialup"
  },
  {
    "id": "d5-050",
    "topic": "5.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Tunnel to-BR5 has two phase 2 entries, one for 10.50.1.0/24 and one for 10.50.2.0/24. Users in 10.50.2.0/24 can't reach HQ. Which command shows which selector pair is down, with its SA details?",
    "exhibit": "FGT-HQ # get vpn ipsec tunnel summary\n'to-BR5' 192.0.2.90:0  selectors(total,up): 2/1  rx(pkt,err): 30417/0  tx(pkt,err): 29983/0",
    "options": [
      "diagnose vpn tunnel list name to-BR5",
      "get router info routing-table all",
      "diagnose sys session list",
      "diagnose sys sdwan health-check"
    ],
    "answer": [
      0
    ],
    "explanation": "`selectors(total,up): 2/1` means one of the two phase 2 selector pairs is down. `diagnose vpn tunnel list name to-BR5` lists each `proxyid` with its `src`/`dst` selectors and `sa=` count, plus SPIs and counters, so you can see which selector has no SA. Then debug that phase 2's negotiation.\n\n* **Routing table**: it shows routes, not SAs.\n* **Session list**: it shows sessions, not SA state.\n* **SD-WAN health check**: it measures SLA probes, not IPsec selectors.",
    "lesson": "5.1-ipsec-troubleshooting-80"
  }
];
