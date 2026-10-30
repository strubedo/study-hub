// Domain 2 — Firewall policies and authentication: question bank (FortiOS 8.0).
// Original exam-style items (not brain-dump material). Options are shuffled by the app.
export default [
  {
    "id": "d2-001",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The administrator added policy 2 to block SSH from host 10.0.1.25, but the host can still open SSH sessions to 198.51.100.50. Why?",
    "exhibit": "FGT-HQ # show firewall policy\nconfig firewall policy\n    edit 5\n        set name \"LAN-Internet\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"all\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"ALL\"\n        set nat enable\n    next\n    edit 2\n        set name \"Block-SSH-Host25\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set srcaddr \"HOST-10.0.1.25\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"SSH\"\n        set logtraffic all\n    next\nend",
    "options": [
      "Lower policy IDs are evaluated first, so policy 2 matched but its deny action applies only to new users.",
      "FortiGate always evaluates the most specific policy first, but policy 2 is skipped because it uses `logtraffic all`.",
      "Policy 2 has no `set action` line, so FortiOS treats it as an accept policy.",
      "Policy 5 is above policy 2 in the policy sequence, so policy 5 matches the SSH session first."
    ],
    "answer": [
      3
    ],
    "explanation": "FortiGate evaluates policies **top-down in sequence order and stops at the first match**. The `show` output lists policies in sequence order, so policy 5 (srcaddr `all`, service `ALL`) is checked before policy 2 and accepts the SSH session. The fix is `move 2 before 5`.\n\n- Policy 2 has no `set action` line because `show` hides default values, and the CLI default for `action` is **deny**. It is a deny policy, not an accept policy.\n- FortiGate doesn't prefer \"more specific\" policies, and `logtraffic` has no effect on matching.\n- The policy ID doesn't control order. Only the sequence does.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-002",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Network 172.16.10.0/24 is reached through router 10.0.2.1 on port3. Users on port2 cannot reach 172.16.10.20. What must the administrator do?",
    "exhibit": "FGT-HQ # diagnose debug flow trace start 10\nid=65308 trace_id=1 func=print_pkt_detail line=5845 msg=\"vd-root:0 received a packet(proto=6, 10.0.1.40:51544->172.16.10.20:443) tun_id=0.0.0.0 from port2. flag [S], seq 3011254711, ack 0, win 64240\"\nid=65308 trace_id=1 func=init_ip_session_common line=6047 msg=\"allocate a new session-0001c3d9\"\nid=65308 trace_id=1 func=__vf_ip_route_input_rcu line=2012 msg=\"find a route: flag=00000000 gw-203.0.113.1 via port1\"\nid=65308 trace_id=1 func=__iprope_tree_check line=524 msg=\"gnum-100004, use addr/intf hash, len=1\"\nid=65308 trace_id=1 func=fw_forward_handler line=1014 msg=\"Denied by forward policy check (policy 0)\"\n\nFGT-HQ # show firewall policy\nconfig firewall policy\n    edit 15\n        set name \"LAN-to-Lab\"\n        set srcintf \"port2\"\n        set dstintf \"port3\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"NET-172.16.10.0\"\n        set schedule \"always\"\n        set service \"ALL\"\n    next\nend",
    "options": [
      "Add a static route to 172.16.10.0/24 with gateway 10.0.2.1 on port3.",
      "Enable `match-vip` on policy 15.",
      "Enable NAT on policy 15 so return traffic comes back to the FortiGate.",
      "Move policy 15 to the top of the policy list."
    ],
    "answer": [
      0
    ],
    "explanation": "The debug shows `find a route: ... gw-203.0.113.1 via port1`. The route lookup, which runs **before** the policy lookup, sends 172.16.10.20 out the default route on port1. FortiGate then looks only for `port2` → `port1` policies, finds none, and the implicit deny drops the packet (`policy 0`). Policy 15 (`port2` → `port3`) is never evaluated because its `dstintf` doesn't match the egress interface. A static route via 10.0.2.1 on port3 fixes the egress interface, and then policy 15 matches.\n\n- Policy 15 is the only policy shown, so moving it changes nothing.\n- NAT doesn't affect which egress interface the route lookup picks.\n- `match-vip` applies only to deny policies and DNATed traffic.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-003",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about firewall policy IDs and policy sequence on FortiOS 8.0 are true? (Choose two.)",
    "options": [
      "Moving a policy with the `move` command renumbers its policy ID to match its new position.",
      "FortiGate evaluates policies in ascending policy ID order.",
      "The `policy_id` field in `diagnose sys session list` shows the policy's sequence number.",
      "FortiGate evaluates policies in sequence order, from the top of the list down, and stops at the first match.",
      "Implicit deny policy 0 can be moved above other policies to create a default-deny rule.",
      "The policy ID is assigned when the policy is created and does not change when the policy is moved."
    ],
    "answer": [
      3,
      5
    ],
    "explanation": "The **policy ID** is a permanent label (`edit 10`). The **sequence** (list position) controls matching, top-down with first match wins.\n\n- Evaluation is not by ID, and `move` changes only the position, never the ID.\n- `policy_id=` in the session table, `policyid=` in logs and `Policy-10` in debug flow all show the **ID**.\n- Policy 0 (implicit deny) is always last and can't be moved or deleted.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-004",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Inside `config firewall policy`, which command makes policy 25 be evaluated immediately before policy 10? (Type the full command.)",
    "answer": [
      "move 25 before 10",
      "move 10 after 25"
    ],
    "explanation": "`move 25 before 10` repositions policy 25 directly above policy 10 in the sequence. `move 10 after 25` gives the same result: policy 25 ends up immediately before policy 10. Neither command changes policy IDs.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-005",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator changes policy 12 from accept to deny to stop a large file transfer that is in progress. The transfer continues. What is the most likely reason?",
    "options": [
      "Policy changes take effect only after the configuration is backed up with `execute backup config`.",
      "The policy is evaluated only for the first packet of a session, so the existing session keeps using its original policy until it is cleared or expires.",
      "In flow inspection mode, policy changes apply only after the FortiGate reboots.",
      "A deny action applies only to unauthenticated users, not to sessions with an existing user identity."
    ],
    "answer": [
      1
    ],
    "explanation": "FortiGate matches a policy only for the **first packet**. It then creates a session that records the `policy_id`, and later packets follow that session. Changing a policy doesn't re-evaluate existing sessions. Clear the specific session (with a `diagnose sys session filter` set first, then `diagnose sys session clear`) or wait for it to time out.\n\nConfiguration changes take effect immediately with no backup or reboot. Deny actions aren't limited to unauthenticated users.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-006",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. GUEST-10.0.1.128 is 10.0.1.128/25 and LAN-10.0.1.0 is 10.0.1.0/24. A guest laptop at 10.0.1.150 opens an SSH session to an internet host. Which policy handles the session?",
    "exhibit": "FGT-HQ # show firewall policy\nconfig firewall policy\n    edit 3\n        set name \"Guest-Web-Only\"\n        set status disable\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"GUEST-10.0.1.128\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"HTTP\" \"HTTPS\" \"DNS\"\n        set nat enable\n    next\n    edit 4\n        set name \"LAN-Internet\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"ALL\"\n        set nat enable\n    next\nend",
    "options": [
      "Policy 3, because it is the first policy whose source address contains 10.0.1.150.",
      "Policy 4, because policy 3 is disabled and is skipped during matching.",
      "Implicit deny policy 0, because SSH is not in policy 3's service list.",
      "Policy 3, because disabled policies still match traffic but do not log it."
    ],
    "answer": [
      1
    ],
    "explanation": "`set status disable` keeps the policy in the configuration but removes it from matching. The next policy in sequence, policy 4, matches the guest (10.0.1.150 is inside 10.0.1.0/24) with service `ALL`, so SSH is accepted.\n\nIf policy 3 were enabled, SSH would simply not match it (its service list is HTTP, HTTPS and DNS), and the session would still fall to policy 4, not policy 0. Disabled policies don't match at all.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-007",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Where does an administrator configure a firewall policy for IPv6 traffic on FortiOS 8.0?",
    "options": [
      "In `config firewall policy64`, which handles all IPv6 forwarding.",
      "In `config firewall consolidated policy`, after enabling `consolidated-firewall-mode`.",
      "In `config firewall policy`, using `srcaddr6` and `dstaddr6`, in the same table as IPv4 rules.",
      "In `config firewall policy6`, a separate table evaluated after the IPv4 table."
    ],
    "answer": [
      2
    ],
    "explanation": "Since FortiOS 6.4, IPv4 and IPv6 share one table, `config firewall policy`. A policy can carry `srcaddr`/`dstaddr` and `srcaddr6`/`dstaddr6`. The separate `policy6` table, the 6.2 consolidated policy mode and its `consolidated-firewall-mode` setting were removed in 6.4. `policy64`/`policy46` were removed in 7.0.1, and NAT64/NAT46 now use regular policies.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-008",
    "topic": "2.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. An administrator pasted this script to let DMZ servers reach web sites. The FortiGate assigned ID 21 to the policy. The forward traffic log for the servers' sessions shows `action=\"deny\" policyid=21`. Why?",
    "exhibit": "config firewall policy\n    edit 0\n        set name \"DMZ-Web-Out\"\n        set srcintf \"port3\"\n        set dstintf \"port1\"\n        set srcaddr \"DMZ-10.0.2.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"HTTP\" \"HTTPS\" \"DNS\"\n        set logtraffic all\n    next\nend",
    "options": [
      "The script does not set `action accept`, and a new policy created in the CLI defaults to `action deny`.",
      "A policy created with `edit 0` is disabled until it is moved into position.",
      "A policy created with `edit 0` is placed above policy 1, so it shadows the DMZ accept policy.",
      "The policy has no NAT, so FortiGate denies private source addresses toward port1."
    ],
    "answer": [
      0
    ],
    "explanation": "In the FortiOS 8.0 CLI reference, the default for a policy's `action` is **deny**. The script never sets `action accept`, so policy 21 is a deny policy that matches the DMZ traffic, which is exactly what the log shows (`policyid=21`, `action=\"deny\"`).\n\n- `edit 0` only picks the next free ID. The new policy is enabled and placed at the **bottom** of the list.\n- Missing NAT would not create a deny log. FortiGate would forward the packet untranslated. (The servers will also need `set nat enable` to reach internet hosts, but that is not why they are denied.)",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-009",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "In a FortiOS 8.0 VDOM that uses profile-based NGFW mode, where does the administrator choose between flow-based and proxy-based inspection?",
    "options": [
      "Once per VDOM, with `set inspection-mode` under `config system settings`.",
      "In each firewall policy, with `set inspection-mode flow` or `set inspection-mode proxy`.",
      "In the SSL/SSH inspection profile assigned to the policy.",
      "In each security profile, such as the antivirus profile's scan mode."
    ],
    "answer": [
      1
    ],
    "explanation": "Since FortiOS 6.2, inspection mode has been a **per-policy** setting (`inspection-mode`, default `flow`). The VDOM-wide inspection mode under system settings belongs to FortiOS 6.0 and earlier. Security profiles adapt to the policy's mode but don't set it. The SSL/SSH inspection profile controls how encrypted traffic is decrypted, not whether inspection is flow or proxy.",
    "lesson": "2.1-inspection-modes-ngfw"
  },
  {
    "id": "d2-010",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about NGFW policy-based mode on FortiOS 8.0 are correct? (Choose two.)",
    "options": [
      "HA session pickup is supported for sessions that match security policies.",
      "Central NAT is always enabled, so source NAT is configured in the central SNAT table, not in individual policies.",
      "Security policies support only flow-based inspection.",
      "Policy-based mode is enabled for all VDOMs at once under `config system global`.",
      "The SSL Inspection & Authentication policy holds the accept or deny action for applications.",
      "Application control is configured by attaching an application control profile to each firewall policy."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "In policy-based mode central NAT is implicitly on (SNAT lives in `config firewall central-snat-map`), and only **flow** inspection is supported.\n\n- Attaching application control *profiles* to policies is how profile-based mode works. Policy-based mode matches applications directly in security policies.\n- `ngfw-mode` is a **per-VDOM** setting in `config system settings`.\n- The 8.0 guide lists *no HA session pickup upon failover* as a limitation of policy-based mode.\n- The SSL Inspection & Authentication policy has no action or schedule. It pre-matches traffic for SSL inspection and authentication.",
    "lesson": "2.1-inspection-modes-ngfw"
  },
  {
    "id": "d2-011",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A VDOM runs in NGFW policy-based mode. An administrator wants to allow only the Microsoft Teams application for the Sales group. Where is the application specified?",
    "options": [
      "In the SSL Inspection & Authentication policy under `config firewall policy`.",
      "In the application control profile of the default firewall policy.",
      "In a security policy under `config firewall security-policy`.",
      "In an application control profile attached to the central SNAT rule."
    ],
    "answer": [
      2
    ],
    "explanation": "Policy-based mode puts applications and URL categories directly into **security policies** (`config firewall security-policy`), together with users/groups, action and profiles. The SSL Inspection & Authentication table (`config firewall policy` in this mode) only pre-matches traffic for SSL inspection and authentication and has no action. Central SNAT only translates addresses.",
    "lesson": "2.1-inspection-modes-ngfw"
  },
  {
    "id": "d2-012",
    "topic": "2.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each logging setting with its effect.",
    "pairs": [
      [
        "set logtraffic all",
        "Logs every session the policy accepts, plus security events"
      ],
      [
        "set logtraffic utm",
        "Logs only sessions that trigger a security profile event (the default)"
      ],
      [
        "set logtraffic disable",
        "Writes no traffic logs for the policy"
      ],
      [
        "set logtraffic-start enable",
        "Also writes a log entry when each session starts"
      ],
      [
        "set fwpolicy-implicit-log enable",
        "Logs traffic dropped by implicit deny policy 0"
      ]
    ],
    "explanation": "`logtraffic` is per policy: `utm` (GUI *Security Events*) is the default, `all` is *All Sessions*, and `disable` turns traffic logging off. `logtraffic-start` adds a log at session start (default `disable`). `fwpolicy-implicit-log` lives under `config log setting` and enables logging for the implicit deny, which is off by default.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-013",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What is the most likely cause of this log entry?",
    "exhibit": "date=2026-10-27 time=09:20:03 logid=\"0000000013\" type=\"traffic\" subtype=\"forward\" level=\"notice\" vd=\"root\" srcip=10.0.1.40 srcport=41822 srcintf=\"port2\" srcintfrole=\"lan\" dstip=10.0.2.10 dstport=22 dstintf=\"port3\" dstintfrole=\"dmz\" sessionid=1772201 proto=6 action=\"deny\" policyid=0 policytype=\"policy\" service=\"SSH\" trandisp=\"noop\" duration=0 sentbyte=0 rcvdbyte=0 sentpkt=0 appcat=\"unscanned\"",
    "options": [
      "No firewall policy from port2 to port3 matches this source, destination and service, so the implicit deny dropped the session.",
      "An administrator created a deny policy with ID 0 for SSH, and it must be deleted.",
      "A local-in policy blocked the session because the destination is a FortiGate interface.",
      "The IPS sensor on the port2-to-port3 policy blocked the SSH session as an attack."
    ],
    "answer": [
      0
    ],
    "explanation": "`policyid=0` with `action=\"deny\"` means the session matched **no** configured policy and hit the implicit deny. (This log only appears because implicit deny logging is enabled.) Policy 0 can't be created or deleted by an administrator. An IPS block would produce a UTM/IPS log and show the ID of the policy that applied the sensor. The destination 10.0.2.10 is a DMZ host reached through port3, and the log is `subtype=\"forward\"`, so this is not local-in traffic.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-014",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The port1 interface address is 203.0.113.2. Which source address and port did the web server at 198.51.100.80 see for this session?",
    "exhibit": "date=2026-10-27 time=09:14:52 logid=\"0000000013\" type=\"traffic\" subtype=\"forward\" level=\"notice\" vd=\"root\" srcip=10.0.1.25 srcport=50433 srcintf=\"port2\" srcintfrole=\"lan\" dstip=198.51.100.80 dstport=443 dstintf=\"port1\" dstintfrole=\"wan\" sessionid=1772164 proto=6 action=\"close\" policyid=10 policytype=\"policy\" policyname=\"LAN-to-Internet\" service=\"HTTPS\" trandisp=\"snat\" transip=203.0.113.21 transport=50433 duration=15 sentbyte=2210 rcvdbyte=10840 sentpkt=14 rcvdpkt=16 appcat=\"unscanned\"",
    "options": [
      "203.0.113.2, port 50433",
      "203.0.113.21, port 50433",
      "203.0.113.21, port 443",
      "10.0.1.25, port 50433"
    ],
    "answer": [
      1
    ],
    "explanation": "`trandisp=\"snat\"` means source NAT was applied. `transip`/`transport` are the **translated source** IP and port, 203.0.113.21:50433. That is an IP pool address, not the port1 address, and the original source port was preserved. The server never sees the private 10.0.1.25. Port 443 is the destination port (`dstport`).",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-015",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Refer to the exhibit. Users browse the internet through policy 10 all day, but Forward Traffic logs show only a few sessions from them, all with web filter block or warning events. Why?",
    "exhibit": "FGT-HQ # show firewall policy 10\nconfig firewall policy\n    edit 10\n        set name \"LAN-to-Internet\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"ALL\"\n        set utm-status enable\n        set ssl-ssh-profile \"certificate-inspection\"\n        set webfilter-profile \"default\"\n        set nat enable\n    next\nend",
    "options": [
      "Web filter logs replace traffic logs whenever a web filter profile is applied.",
      "Traffic logs are written only for sessions that last longer than 60 seconds.",
      "With `logtraffic-start` disabled, no traffic log is written until the policy is edited.",
      "Policy 10 uses the default `logtraffic utm` (Security Events), which logs only sessions that trigger a security event."
    ],
    "answer": [
      3
    ],
    "explanation": "`show` displays no `logtraffic` line, so the policy uses the default, `utm`. Clean sessions generate no traffic log, and only sessions with security events (here web filter blocks or warnings) appear. Use `set logtraffic all` to log every accepted session. Sessions are logged regardless of duration, and `logtraffic-start` only adds an extra log at session start.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-016",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "Which FortiOS 8.0 CLI table creates the custom tags that are applied to objects with `set custom-tags`?",
    "options": [
      "config firewall vipgrp",
      "config system zone",
      "config firewall addrgrp with set type folder",
      "config firewall custom-tag"
    ],
    "answer": [
      3
    ],
    "explanation": "FortiOS 8.0 adds `config firewall custom-tag` (with `abbreviation`, `comment` and `color` 0–32, default 1). Tags are then applied with `set custom-tags` on addresses, address groups, policies and other supported objects. VIP groups and zones group objects or interfaces. A `folder` address group is an organising container, not a tag.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-017",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. An administrator creates a new address WEB03 (10.0.2.13/32) with `set custom-tags \"WEB\"`. What else is required so LAN users can reach WEB03 through policy 20?",
    "exhibit": "config firewall custom-tag\n    edit \"WEB\"\n        set abbreviation \"WEB\"\n        set color 4\n    next\nend\nconfig firewall addrgrp\n    edit \"GRP-WEB\"\n        set type dynamic-tag\n        set custom-tags \"WEB\"\n    next\nend\nconfig firewall policy\n    edit 20\n        set name \"LAN-to-Web-Servers\"\n        set srcintf \"port2\"\n        set dstintf \"port3\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"GRP-WEB\"\n        set schedule \"always\"\n        set service \"HTTP\" \"HTTPS\"\n    next\nend",
    "options": [
      "Add WEB03 to GRP-WEB with `append member \"WEB03\"`.",
      "Change GRP-WEB to `set type folder` so it accepts new members.",
      "Nothing. GRP-WEB automatically includes every address that carries the WEB tag, and policy 20 already uses GRP-WEB.",
      "Edit policy 20 and add WEB03 to its destination addresses."
    ],
    "answer": [
      2
    ],
    "explanation": "An address group with `type dynamic-tag` has no static member list. Its members are all addresses tagged with any of its `custom-tags`. Tagging WEB03 adds it to GRP-WEB, and the policy that references GRP-WEB covers it with **no policy change**. That is the point of 8.0 dynamic tag address groups. A `folder` group is an organising container whose members can't be in other groups.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-018",
    "topic": "2.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two object types can be labelled with FortiOS 8.0 custom tags? (Choose two.)",
    "options": [
      "SD-WAN members",
      "Virtual IPs (VIPs)",
      "IPsec phase 1 interfaces",
      "Static routes",
      "Central SNAT map entries",
      "Local-in policies"
    ],
    "answer": [
      4,
      5
    ],
    "explanation": "The 8.0 feature supports tags on firewall addresses and groups (IPv4/IPv6), proxy and multicast addresses, firewall policies, NGFW security policies, multicast, DoS, **local-in** and proxy policies, and **central SNAT** mappings. VIPs, static routes, IPsec phase 1 interfaces and SD-WAN members are not on the 8.0 list of taggable objects. VIPs can still be organised with the older `color` setting.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-019",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "What is a characteristic of an address group configured with `set type folder` on FortiOS 8.0?",
    "options": [
      "Its members are every address that carries one of the group's custom tags.",
      "It can contain only IPv6 addresses.",
      "It automatically contains all addresses that share the group's GUI colour.",
      "Its member addresses cannot belong to any other address group."
    ],
    "answer": [
      3
    ],
    "explanation": "The 8.0 address group types are `default` (normal group; an address can be in many groups), `folder` (members can't belong to any other group) and `dynamic-tag` (members are addresses carrying one of the configured tags). Colour has nothing to do with group membership.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-020",
    "topic": "2.1",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator has created custom tags on FortiOS 8.0 but cannot find a Tags field when editing firewall policies in the GUI. What should the administrator do?",
    "options": [
      "Switch the VDOM to NGFW policy-based mode.",
      "Enable `gui-object-colors` under `config system settings`.",
      "Enable policy tags under System > Feature Visibility.",
      "Enable `central-nat` under `config system settings`."
    ],
    "answer": [
      2
    ],
    "explanation": "In FortiOS 8.0 policy tagging is **disabled by default in the GUI** and is turned on under **System > Feature Visibility**. The policy dialogs then show tags, and the list can filter by tag and show a Tags column. Object colours, central NAT and NGFW mode have nothing to do with tag visibility.",
    "lesson": "2.1-policy-logging-tagging"
  },
  {
    "id": "d2-021",
    "topic": "2.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default `inspection-mode` of a new firewall policy on FortiOS 8.0? (One word.)",
    "answer": [
      "flow",
      "flow-based",
      "flow based"
    ],
    "explanation": "The FortiOS 8.0 CLI reference lists `inspection-mode` as `[proxy|flow]` with a default of **flow**.",
    "lesson": "2.1-inspection-modes-ngfw"
  },
  {
    "id": "d2-022",
    "topic": "2.1",
    "type": "order",
    "difficulty": 2,
    "stem": "Put these stages in the order FortiGate applies them to the first packet of a new session in profile-based NGFW mode.",
    "items": [
      "VIP (destination NAT) check",
      "Route lookup to select the egress interface",
      "Firewall policy lookup (first match)",
      "Flow or proxy inspection by the policy's security profiles"
    ],
    "explanation": "DNAT comes first, so the route lookup uses the **translated** destination. The egress interface from the route lookup is then used to find candidate policies (`srcintf`/`dstintf`), and the first matching policy decides accept or deny. Only after a policy accepts the session do its security profiles inspect it in flow or proxy mode. This order explains why VIP policies use the server-facing `dstintf` and why a bad route ends in policy 0.",
    "lesson": "2.1-inspection-modes-ngfw"
  },
  {
    "id": "d2-023",
    "topic": "2.1",
    "type": "single",
    "difficulty": 2,
    "stem": "When does the Initial Policy Configuration step, added to the FortiGate setup wizard in FortiOS 8.0.1, appear?",
    "options": [
      "Only after central NAT is enabled, to create the first central SNAT rule.",
      "On supported desktop and FG-100F/200E models when the firewall policy table is empty, for example after a factory reset, while `gui-initial-firewall-policy-setup` is enabled.",
      "Each time an administrator logs in to the GUI, until at least one policy uses a security profile.",
      "Whenever a new interface is added to a zone."
    ],
    "answer": [
      1
    ],
    "explanation": "The 8.0.1 step lets the administrator create a default outbound policy (the example is `lan` → `wan1`, NAT enabled) on new or factory-reset units. It appears only when **no** firewall policy exists, on desktop models and the FG-100F/200E series. `config system global` → `set gui-initial-firewall-policy-setup` (default `enable`) controls whether it is shown.",
    "lesson": "2.1-policy-fundamentals"
  },
  {
    "id": "d2-024",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Internet clients cannot reach the web server published on https://203.0.113.10:8443. What should the administrator change?",
    "exhibit": "FGT-HQ # show firewall vip VIP-WEB-8443\nconfig firewall vip\n    edit \"VIP-WEB-8443\"\n        set extip 203.0.113.10\n        set mappedip \"10.0.2.10\"\n        set extintf \"port1\"\n        set portforward enable\n        set extport 8443\n        set mappedport 443\n    next\nend\nFGT-HQ # show firewall policy 20\nconfig firewall policy\n    edit 20\n        set name \"Inbound-WEB\"\n        set srcintf \"port1\"\n        set dstintf \"port3\"\n        set action accept\n        set srcaddr \"all\"\n        set dstaddr \"VIP-WEB-8443\"\n        set schedule \"always\"\n        set service \"TCP-8443\"\n    next\nend\nFGT-HQ # diagnose debug flow trace start 10\nid=65308 trace_id=3 func=print_pkt_detail line=5845 msg=\"vd-root:0 received a packet(proto=6, 198.51.100.77:50122->203.0.113.10:8443) tun_id=0.0.0.0 from port1. flag [S], seq 912334801, ack 0, win 64240\"\nid=65308 trace_id=3 func=init_ip_session_common line=6047 msg=\"allocate a new session-0001c51a\"\nid=65308 trace_id=3 func=get_new_addr line=1239 msg=\"find DNAT: IP-10.0.2.10, port-443\"\nid=65308 trace_id=3 func=fw_pre_route_handler line=184 msg=\"VIP-10.0.2.10:443, outdev-port1\"\nid=65308 trace_id=3 func=__ip_session_run_tuple line=3435 msg=\"DNAT 203.0.113.10:8443->10.0.2.10:443\"\nid=65308 trace_id=3 func=__vf_ip_route_input_rcu line=2012 msg=\"find a route: flag=00000000 gw-10.0.2.10 via port3\"\nid=65308 trace_id=3 func=__iprope_tree_check line=524 msg=\"gnum-100004, use addr/intf hash, len=2\"\nid=65308 trace_id=3 func=fw_forward_handler line=1014 msg=\"Denied by forward policy check (policy 0)\"",
    "options": [
      "Change the service in policy 20 to HTTPS (TCP 443), the VIP's mapped port.",
      "Enable NAT on policy 20 so the server can reply.",
      "Change the VIP's extintf to any.",
      "Change the destination address in policy 20 to an address object for 10.0.2.10."
    ],
    "answer": [
      0
    ],
    "explanation": "The debug shows the VIP matched (`find DNAT: IP-10.0.2.10, port-443`) and translated `203.0.113.10:8443->10.0.2.10:443` **before** the policy lookup. The policy check therefore sees destination port **443**, but policy 20 allows only TCP 8443, so the session falls to `policy 0`. The policy service must match the **mapped** port.\n\n- In policy NAT mode the destination must stay the **VIP object**. An address object for the internal IP would stop the VIP from being used.\n- NAT on an inbound VIP policy only hides client IPs from the server and doesn't fix a policy mismatch.\n- `extintf` is fine. The traffic arrives on port1 and the VIP already matched.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-025",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Central NAT is disabled. Internet clients cannot reach the DMZ web server 10.0.2.10 at https://203.0.113.10. What is the fix?",
    "exhibit": "config firewall address\n    edit \"PUB-203.0.113.10\"\n        set subnet 203.0.113.10 255.255.255.255\n    next\nend\nconfig firewall vip\n    edit \"VIP-WEB\"\n        set extip 203.0.113.10\n        set mappedip \"10.0.2.10\"\n        set extintf \"port1\"\n    next\nend\nconfig firewall policy\n    edit 20\n        set name \"Inbound-WEB\"\n        set srcintf \"port1\"\n        set dstintf \"port3\"\n        set action accept\n        set srcaddr \"all\"\n        set dstaddr \"PUB-203.0.113.10\"\n        set schedule \"always\"\n        set service \"HTTPS\"\n    next\nend",
    "options": [
      "Enable `portforward` on VIP-WEB.",
      "Set the destination address of policy 20 to the VIP object VIP-WEB.",
      "Set the destination interface of policy 20 to port1.",
      "Enable NAT on policy 20."
    ],
    "answer": [
      1
    ],
    "explanation": "With central NAT disabled, a VIP performs DNAT only when an enabled policy **references the VIP object** as its destination. Policy 20 references an ordinary address for the public IP, so VIP-WEB is never used for DNAT and no policy matches the traffic as intended. Setting `dstaddr \"VIP-WEB\"` fixes it.\n\n- `dstintf` must be the server-facing port3, which is already correct.\n- Port forwarding is optional. Without it the VIP maps all ports, and the policy service limits exposure to HTTPS.\n- NAT isn't needed for inbound VIP traffic.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-026",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement about this session is correct?",
    "exhibit": "FGT-HQ # diagnose sys session list\nsession info: proto=6 proto_state=01 duration=34 expire=3566 timeout=3600 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3\norigin-shaper=\nreply-shaper=\nper_ip_shaper=\nclass_id=0 ha_id=0 policy_dir=0 tunnel=/ vlan_cos=0/255\nstate=log may_dirty\nstatistic(bytes/packets/allow_err): org=1820/12/1 reply=5240/10/1 tuples=2\ntx speed(Bps/kbps): 52/0 rx speed(Bps/kbps): 150/1\norgin->sink: org pre->post, reply pre->post dev=3->5/5->3 gwy=10.0.2.10/203.0.113.1\nhook=pre dir=org act=dnat 198.51.100.77:50122->203.0.113.10:8443(10.0.2.10:443)\nhook=post dir=reply act=snat 10.0.2.10:443->198.51.100.77:50122(203.0.113.10:8443)\npos/(before,after) 0/(0,0), 0/(0,0)\nmisc=0 policy_id=20 pol_uuid_idx=15820 auth_info=0 chk_client_info=0 vd=0\nserial=001b0c19 tos=ff/ff app_list=0 app=0 url_cat=0\nrpdb_link_id=00000000 ngfwid=n/a\nnpu_state=0x000100\ntotal session 1",
    "options": [
      "The client connected to 203.0.113.10:8443, and FortiGate forwarded the session to 10.0.2.10:443.",
      "The session is a source NAT session created by an IP pool.",
      "FortiGate translated the client's source port from 50122 to 8443.",
      "The server 10.0.2.10 sees the client's source address as 203.0.113.10."
    ],
    "answer": [
      0
    ],
    "explanation": "`hook=pre dir=org act=dnat 198.51.100.77:50122->203.0.113.10:8443(10.0.2.10:443)` means that in the original direction, before routing, the **destination** 203.0.113.10:8443 was rewritten to 10.0.2.10:443, which is a port-forwarding VIP. The `hook=post dir=reply act=snat` line is just the reverse translation of the server's replies. Nothing changes the client's source address or port, so the server sees 198.51.100.77:50122. No IP pool is involved.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-027",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Policy 10 has NAT enabled with an IP pool, and port1 is 203.0.113.2. Which statement is correct?",
    "exhibit": "FGT-HQ # diagnose sys session filter src 10.0.1.25\nFGT-HQ # diagnose sys session list\nsession info: proto=6 proto_state=01 duration=12 expire=3587 timeout=3600 refresh_dir=both flags=00000000 socktype=0 sockport=0 av_idx=0 use=3\norigin-shaper=\nreply-shaper=\nper_ip_shaper=\nclass_id=0 ha_id=0 policy_dir=0 tunnel=/ vlan_cos=0/255\nstate=log may_dirty\nstatistic(bytes/packets/allow_err): org=2210/14/1 reply=10840/16/1 tuples=2\ntx speed(Bps/kbps): 184/1 rx speed(Bps/kbps): 903/7\norgin->sink: org pre->post, reply pre->post dev=4->3/3->4 gwy=203.0.113.1/10.0.1.25\nhook=post dir=org act=snat 10.0.1.25:50433->198.51.100.80:443(203.0.113.21:50433)\nhook=pre dir=reply act=dnat 198.51.100.80:443->203.0.113.21:50433(10.0.1.25:50433)\npos/(before,after) 0/(0,0), 0/(0,0)\nmisc=0 policy_id=10 pol_uuid_idx=15812 auth_info=0 chk_client_info=0 vd=0\nserial=001b0a44 tos=ff/ff app_list=0 app=0 url_cat=0\nrpdb_link_id=00000000 ngfwid=n/a\nnpu_state=0x000100\ntotal session 1",
    "options": [
      "The source was translated to 203.0.113.21, and the original source port 50433 was kept.",
      "The session was translated to the port1 address because the pool was full.",
      "The destination was translated from 198.51.100.80 to 203.0.113.21.",
      "The session was created by a VIP because the reply line shows `act=dnat`."
    ],
    "answer": [
      0
    ],
    "explanation": "`hook=post dir=org act=snat 10.0.1.25:50433->198.51.100.80:443(203.0.113.21:50433)`: the value in parentheses is the **translated source**, an IP pool address with the same port. FortiGate keeps the original source port when it is free. The `hook=pre dir=reply act=dnat` line only reverses the SNAT for returning packets. It is not a VIP. The destination is unchanged.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-028",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about FortiOS IPv4 IP pool types are correct? (Choose two.)",
    "options": [
      "A fixed port range pool does not need an internal address range.",
      "A one-to-one pool with two external addresses can serve any number of internal hosts by rotating addresses.",
      "Port block allocation writes a log for every session instead of one per allocated block.",
      "Overload is the default type and performs port address translation.",
      "An overload pool picks a random pool address for each new session.",
      "A one-to-one pool maps each internal address to its own external address without port translation."
    ],
    "answer": [
      3,
      5
    ],
    "explanation": "**Overload** (default `type`) shares the pool addresses using PAT. **One-to-one** gives each internal host a dedicated external address with no PAT, so N addresses serve only N hosts at a time.\n\n- **Fixed port range** requires an internal range (`source-startip`/`source-endip`).\n- **PBA** logs block allocations, which is why it reduces log volume.\n- Overload address selection is deterministic: source IP modulo pool size.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-029",
    "topic": "2.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each IP pool type with its behaviour.",
    "pairs": [
      [
        "overload",
        "Many internal hosts share the pool addresses using PAT (default type)"
      ],
      [
        "one-to-one",
        "Each internal host gets a dedicated external address with no PAT"
      ],
      [
        "fixed-port-range",
        "A defined internal range maps to the external range with a predictable port block per internal host"
      ],
      [
        "port-block-allocation",
        "Hosts receive blocks of ports on demand, sized by block-size and num-blocks-per-user"
      ]
    ],
    "explanation": "These are the four IPv4 `config firewall ippool` types in FortiOS 8.0 (plus `cgn-resource-allocation` for hyperscale VDOMs). Fixed port range and PBA are both PAT variants. Fixed port range makes the internal-IP-to-port mapping predictable, and PBA allocates blocks dynamically and logs per block.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-030",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Policy 10 uses POOL-OUT. Host 10.0.1.26 opens sessions to several different internet servers. Which external address does FortiGate use for this host?",
    "exhibit": "FGT-HQ # show firewall ippool POOL-OUT\nconfig firewall ippool\n    edit \"POOL-OUT\"\n        set startip 203.0.113.20\n        set endip 203.0.113.23\n    next\nend",
    "options": [
      "203.0.113.20 for the first session, then .21, .22 and .23 in rotation",
      "203.0.113.22 for all of its sessions",
      "A random pool address chosen separately for each session",
      "203.0.113.2 (port1), because pool addresses are used only after the interface address runs out of ports"
    ],
    "answer": [
      1
    ],
    "explanation": "For an overload pool, FortiOS picks the address deterministically. It treats the source IP as a number, takes it modulo the pool size, and adds the result to `startip`. 10.0.1.26 = 167,772,442, and 167,772,442 mod 4 = 2, so the host maps to 203.0.113.20 + 2 = **203.0.113.22**, consistently for all its sessions. That keeps a client's public identity stable. There is no round-robin or random choice, and when a pool is attached the interface address is not used.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-031",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Hosts 10.0.1.10 and 10.0.1.11 have active sessions through a policy that uses POOL-1TO1. What happens when 10.0.1.12 starts a new session through the same policy?",
    "exhibit": "FGT-HQ # show firewall ippool POOL-1TO1\nconfig firewall ippool\n    edit \"POOL-1TO1\"\n        set type one-to-one\n        set startip 203.0.113.40\n        set endip 203.0.113.41\n    next\nend",
    "options": [
      "FortiGate frees the address of the host with the oldest session and assigns it to 10.0.1.12.",
      "The session cannot be translated because both pool addresses are already in use, so it fails.",
      "FortiGate shares 203.0.113.41 using PAT for the third host.",
      "FortiGate falls back to the egress interface address for the third host."
    ],
    "answer": [
      1
    ],
    "explanation": "A **one-to-one** pool disables PAT. Each external address is dedicated to one internal host, so a two-address pool supports only two hosts at a time. A third host has no free address and can't be translated through this policy. Use an overload pool when more hosts than addresses must share the pool.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-032",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "A port block allocation IP pool uses the default `block-size` and `num-blocks-per-user`. What is the maximum number of ports one internal IP can use? (Number only.)",
    "answer": [
      "1024"
    ],
    "explanation": "The FortiOS 8.0 defaults are `block-size 128` and `num-blocks-per-user 8`, so 128 × 8 = **1024** ports per internal host.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-033",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Policy 10 has `set nat enable` and no IP pool. Its destination is an SD-WAN zone whose members are wan1 (203.0.113.2) and wan2 (198.51.100.2). A session is steered out wan2. Which source address does the internet server see?",
    "options": [
      "203.0.113.2",
      "Whichever WAN address is configured first in the SD-WAN zone",
      "198.51.100.2",
      "The client's private address, because SD-WAN sessions are not source-NATed"
    ],
    "answer": [
      2
    ],
    "explanation": "Policy NAT without an IP pool translates to the IP of the **actual egress interface** chosen for the session, here wan2. That is why per-link NAT works automatically with SD-WAN. An IP pool would override this.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-034",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. port1 (MAC 00:0c:29:ab:cd:01) shares 203.0.113.0/24 with the ISP router. A new appliance is installed on that segment with address 203.0.113.28, but traffic from the internet never reaches it. No policy references POOL-OLD-PROJECT. What should the administrator do?",
    "exhibit": "FGT-HQ # show firewall ippool POOL-OLD-PROJECT\nconfig firewall ippool\n    edit \"POOL-OLD-PROJECT\"\n        set startip 203.0.113.24\n        set endip 203.0.113.31\n    next\nend\n\nISP-RTR# show ip arp 203.0.113.28\nProtocol  Address          Age (min)  Hardware Addr   Type   Interface\nInternet  203.0.113.28            0   000c.29ab.cd01  ARPA   GigabitEthernet0/1",
    "options": [
      "Enable `permit-any-host` on the IP pool.",
      "Create a VIP for 203.0.113.28 that maps to the appliance.",
      "Nothing on the FortiGate. It answers ARP only for pools that a policy references, so the problem is on the ISP router.",
      "Delete the unused IP pool, or set `arp-reply disable` on it."
    ],
    "answer": [
      3
    ],
    "explanation": "IP pools have `arp-reply enable` by default, and FortiGate answers ARP for every address in the range **even if no policy uses the pool**. Current releases also treat those addresses as local. The ISP router's ARP entry for .28 points to the FortiGate's port1 MAC, so traffic for the appliance is sent to the FortiGate. Remove the stale pool or disable its ARP reply. (The 8.0 Administration Guide states explicitly that ARP reply works without a policy referencing the pool, even though the short CLI help text for `arp-reply` still mentions policies. Either way, the exhibit settles it: the ISP router has learned .28 with the FortiGate's MAC, so the FortiGate is answering.)\n\n- \"Nothing on the FortiGate\" is contradicted by that ARP entry, and the only FortiGate object that covers .28 is the unused pool.\n- A VIP would also answer ARP and hijack the address.\n- `permit-any-host` controls full-cone NAT and doesn't change ARP.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-035",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Central NAT is enabled. Server 10.0.1.50 must leave the FortiGate with a POOL-SRV address, but it is translated to the port1 address. What should the administrator do?",
    "exhibit": "FGT-HQ # show firewall central-snat-map\nconfig firewall central-snat-map\n    edit 1\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set orig-addr \"all\"\n        set dst-addr \"all\"\n    next\n    edit 2\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set orig-addr \"SRV-10.0.1.50\"\n        set dst-addr \"all\"\n        set nat-ippool \"POOL-SRV\"\n    next\nend",
    "options": [
      "Enable `nat` and `ippool` with POOL-SRV in the firewall policy that allows the server's traffic.",
      "Disable `arp-reply` on POOL-SRV.",
      "Set `port-preserve disable` on entry 2.",
      "Move central SNAT entry 2 above entry 1."
    ],
    "answer": [
      3
    ],
    "explanation": "Central SNAT entries are evaluated **top-down, first match**. Entry 1 (`orig-addr all`, no pool, so the egress interface IP) matches the server before entry 2 is reached. Put the specific entry first.\n\nWith central NAT enabled, the policy's NAT settings are bypassed. `port-preserve` only affects source ports. ARP reply has nothing to do with which rule matches.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-036",
    "topic": "2.2",
    "type": "single",
    "difficulty": 1,
    "stem": "An administrator runs `set central-nat enable` under `config system settings`. Where does FortiGate now get the source NAT settings for traffic that a firewall policy accepts?",
    "options": [
      "From the `nat`, `ippool` and `poolname` settings in each firewall policy, as before.",
      "From the central SNAT table, `config firewall central-snat-map`.",
      "From the VIP objects referenced in each policy.",
      "From the IP pool whose `associated-interface` matches the egress interface."
    ],
    "answer": [
      1
    ],
    "explanation": "With central NAT enabled, the per-policy NAT option is bypassed and SNAT is configured only in the ordered **central SNAT** table. The firewall policy still decides whether traffic is allowed, and the central SNAT rule decides how it is translated. VIPs are DNAT objects.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-037",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 3,
    "stem": "Central NAT is enabled on a FortiGate that publishes a DMZ server with a VIP. Which two statements are correct? (Choose two.)",
    "options": [
      "VIPs can be reordered with the FortiOS 8.0.1 drag-and-drop VIP list.",
      "The firewall policy that allows the traffic should use the server's mapped internal address as its destination.",
      "Enabled VIPs perform DNAT without being referenced in a firewall policy.",
      "The firewall policy must use the VIP object as its destination address, as in policy NAT mode.",
      "Central NAT can be enabled while policies still reference VIPs, and FortiOS converts them automatically."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "In central NAT mode, DNAT is managed as **DNAT & Virtual IPs**, every enabled VIP applies, and policies reference the **mapped (internal)** address, because DNAT has already happened when the policy is checked.\n\n- Referencing the VIP object as the destination is the policy-NAT-mode method.\n- The 8.0.1 VIP drag-and-drop ordering works only when central NAT is **disabled**.\n- FortiOS refuses to enable central NAT while policies still use VIPs.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-038",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. The FortiGate runs FortiOS 8.0, and every setting not shown uses its default value. HOSTILE-198.51.100.0 is 198.51.100.0/24. VIP-WEB-HTTPS (extintf port1) maps its external IP to DMZ server 10.0.2.10, which is reached through port3. Host 198.51.100.77 connects to the external IP of VIP-WEB-HTTPS on TCP 443. What happens?",
    "exhibit": "FGT-HQ # show firewall policy\nconfig firewall policy\n    edit 30\n        set name \"Block-Hostile-Net\"\n        set srcintf \"port1\"\n        set dstintf \"port3\"\n        set srcaddr \"HOSTILE-198.51.100.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"ALL\"\n        set logtraffic all\n    next\n    edit 20\n        set name \"Inbound-WEB\"\n        set srcintf \"port1\"\n        set dstintf \"port3\"\n        set action accept\n        set srcaddr \"all\"\n        set dstaddr \"VIP-WEB-HTTPS\"\n        set schedule \"always\"\n        set service \"HTTPS\"\n    next\nend",
    "options": [
      "The implicit deny drops the session, because VIP traffic can only match policies whose source is `all`.",
      "Policy 20 accepts the session, because deny policies ignore DNATed traffic unless `match-vip` is explicitly enabled.",
      "Policy 30 accepts the session, because it has no action configured.",
      "Policy 30 denies the session, because `match-vip` is enabled by default on deny policies, so the DNATed traffic matches destination `all`."
    ],
    "answer": [
      3
    ],
    "explanation": "Policy 30 has no `set action` line, so it is a **deny** policy (the CLI default). In FortiOS 8.0, `match-vip` defaults to **enable** (it is available only on deny policies), so a deny policy with destination `all` also matches traffic that a VIP has translated. Defaults are hidden by `show`. Policy 30 is first in sequence and matches the source 198.51.100.77, so the session is denied.\n\nThe \"deny policies don't catch VIP traffic unless you set match-vip\" behaviour describes the old default in releases before 7.2.3.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-039",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Users on port2 (10.0.1.0/24) browse to https://203.0.113.10. That address is a VIP with `extintf \"port1\"` that maps to server 10.0.1.80, which is on the same port2 subnet as the users. Split DNS is not an option. Which configuration makes this work?",
    "options": [
      "Create a port1-to-port2 policy with the VIP as destination and NAT enabled.",
      "Enable `arp-reply` on the VIP so the users' ARP requests are answered.",
      "Change the VIP to `extintf any` (optionally with a `srcintf-filter` that includes port1 and port2), add a port2-to-port2 policy with the VIP as destination, and enable NAT on that policy.",
      "Add a static route for 203.0.113.10/32 through port2."
    ],
    "answer": [
      2
    ],
    "explanation": "Hairpin traffic enters on **port2**. A VIP's `extintf` is the interface the policy's source interface must match, so a VIP with `extintf \"port1\"` can't be used in a policy from port2. The VIP must cover port2 traffic (`extintf any`), and a policy for the real path (`port2` → `port2`) must reference it. Because client and server share a subnet, the server would reply directly to the client and bypass the FortiGate. Enabling NAT on the hairpin policy makes replies return through the FortiGate.\n\nA route doesn't create DNAT. ARP reply already defaults to enable and applies to the external segment. A port1 → port2 policy never matches traffic arriving on port2.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-040",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Central NAT is disabled. An administrator creates a VIP that maps 203.0.113.15 to 10.0.2.15 but has not yet used it in any firewall policy. Which statement is true?",
    "options": [
      "FortiGate ignores the VIP completely, including ARP, until a policy references it.",
      "The VIP immediately translates all traffic to 203.0.113.15, and the implicit deny drops it.",
      "FortiGate answers ARP for 203.0.113.15, but it does not use the VIP for DNAT until an enabled policy references it.",
      "FortiOS automatically adds the VIP to the first policy whose destination interface leads to 10.0.2.15."
    ],
    "answer": [
      2
    ],
    "explanation": "A VIP is used for DNAT only when it is referenced by an **enabled** firewall policy (central NAT off). Its `extip` is still answered by ARP because `arp-reply` defaults to `enable`, and current releases treat the address as local. That is why unused VIPs and pools should be removed. FortiOS never auto-adds VIPs to policies.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-041",
    "topic": "2.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Central NAT is disabled. Mail server 10.0.2.25 sends outbound SMTP through policy 12 and exits through port1. port1 is 203.0.113.2, and no IP pool is configured. Which source address do external mail servers see?",
    "exhibit": "config firewall vip\n    edit \"VIP-MAIL\"\n        set extip 203.0.113.25\n        set mappedip \"10.0.2.25\"\n        set extintf \"port1\"\n    next\nend\nconfig firewall policy\n    edit 11\n        set name \"Mail-In\"\n        set srcintf \"port1\"\n        set dstintf \"port3\"\n        set action accept\n        set srcaddr \"all\"\n        set dstaddr \"VIP-MAIL\"\n        set schedule \"always\"\n        set service \"SMTP\"\n    next\n    edit 12\n        set name \"Mail-Out\"\n        set srcintf \"port3\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"HOST-10.0.2.25\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"SMTP\"\n        set nat enable\n    next\nend",
    "options": [
      "10.0.2.25, because traffic from a VIP-mapped server is never source-NATed",
      "203.0.113.25, the VIP's external address",
      "203.0.113.2, the port1 address",
      "An address from the default IP pool on port1"
    ],
    "answer": [
      1
    ],
    "explanation": "VIP-MAIL is a **static NAT VIP without port forwarding**, so the mapping also works in reverse. With central NAT disabled, that requires the VIP to be referenced by at least one firewall policy, which inbound policy 11 does. When the mapped server sends traffic through a NAT-enabled policy toward the VIP's external interface, and the policy has no IP pool, FortiGate uses the VIP's external IP as the SNAT address. The priority is: `nat-source-vip` VIP external IP, then the policy IP pool, then the static VIP reverse mapping, then the egress interface IP. This keeps the mail server's outbound identity matching its MX/SPF address. There is no \"default IP pool\".",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-042",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about the VIP ordering feature in FortiOS 8.0.1 are correct? (Choose two.)",
    "options": [
      "Only IPv4 VIPs can be reordered.",
      "FortiOS automatically sorts VIPs by the length of their external range.",
      "Overlapping VIPs are rejected when the administrator saves them.",
      "VIP reordering is available only when central NAT is disabled.",
      "The feature also reorders central DNAT rules and IPv6 VIPs."
    ],
    "answer": [
      0,
      3
    ],
    "explanation": "FortiOS 8.0.1 lets administrators drag VIPs or use **Insert Above/Below** on the Virtual IPs page, and Security Rating Insights flag **Virtual IP Overlap**. The docs limit reordering to configurations with **central NAT disabled** and to **IPv4** VIPs. Order matters because the first matching VIP is used. Overlaps are flagged, not rejected (the overlap check was removed in 7.2). There is no automatic sorting.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-043",
    "topic": "2.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "A VIP has `set extintf \"any\"`. Which VIP attribute limits it to traffic arriving on port1 and port2 only? (Attribute name.)",
    "answer": [
      "srcintf-filter",
      "set srcintf-filter"
    ],
    "explanation": "`set srcintf-filter \"port1\" \"port2\"` restricts the interfaces the VIP applies to. It is useful with `extintf any`, and it prevents unexpected matches from other interfaces. `src-filter` restricts by source address instead.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-044",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement is correct?",
    "exhibit": "date=2026-10-27 time=10:02:41 logid=\"0000000013\" type=\"traffic\" subtype=\"forward\" level=\"notice\" vd=\"root\" srcip=198.51.100.77 srcport=50122 srcintf=\"port1\" srcintfrole=\"wan\" dstip=203.0.113.10 dstport=443 dstintf=\"port3\" dstintfrole=\"dmz\" sessionid=1772388 proto=6 action=\"close\" policyid=20 policytype=\"policy\" policyname=\"Inbound-WEB\" service=\"HTTPS\" trandisp=\"dnat\" tranip=10.0.2.10 tranport=443 duration=34 sentbyte=1820 rcvdbyte=5240 sentpkt=12 rcvdpkt=10 appcat=\"unscanned\"",
    "options": [
      "The session was denied, because `trandisp` is not `noop`.",
      "A VIP translated the destination to 10.0.2.10, and policy 20 accepted the session.",
      "The client connected directly to 10.0.2.10, and FortiGate logged the public address as a reference.",
      "The client's source address was translated to 10.0.2.10."
    ],
    "answer": [
      1
    ],
    "explanation": "`trandisp=\"dnat\"` with `tranip=10.0.2.10 tranport=443` means **destination NAT**: the client's destination 203.0.113.10 became the internal server. (`transip`/`transport` would show source translation.) `action=\"close\"` with `policyid=20` means an accepted session that ended normally.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-045",
    "topic": "2.2",
    "type": "single",
    "difficulty": 2,
    "stem": "What does `set fixedport enable` do on a firewall policy that performs source NAT?",
    "options": [
      "It reserves a fixed block of ports for each client, like port block allocation.",
      "It translates the destination port to a fixed mapped port.",
      "It allows unsolicited inbound UDP to the translated port (full-cone NAT).",
      "It keeps each session's original source port during SNAT, which reduces how many clients can share one translated address."
    ],
    "answer": [
      3
    ],
    "explanation": "`fixedport` (default `disable`) stops SNAT from changing the source port. Some protocols need that. Because the port is no longer translated, two clients using the same source port toward the same destination collide, so fewer clients can share an address. Destination port mapping is a VIP function, port blocks are PBA, and full-cone NAT is the IP pool's `permit-any-host`.",
    "lesson": "2.2-snat-ip-pools"
  },
  {
    "id": "d2-046",
    "topic": "2.2",
    "type": "order",
    "difficulty": 3,
    "stem": "Central NAT is disabled. A server is the mapped IP of a static NAT VIP that an inbound firewall policy references, and the server sends traffic through a NAT-enabled policy toward the VIP's external interface. Order the possible source NAT addresses from highest to lowest priority.",
    "items": [
      "The external IP of a VIP that has nat-source-vip enabled",
      "The IP pool configured on the outbound policy",
      "The reverse mapping of the static NAT VIP (nat-source-vip disabled)",
      "The IP address of the outgoing interface"
    ],
    "explanation": "FortiGate picks the SNAT address in this order: a VIP with `nat-source-vip enable` forces its external IP for all the mapped server's traffic. Otherwise an **IP pool** on the policy wins. Otherwise the static VIP's reverse mapping is used (when leaving through the VIP's external interface). Otherwise the **egress interface IP** is used. (With central NAT disabled, a VIP that no policy references isn't loaded, so neither VIP option would apply.)",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-047",
    "topic": "2.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Central NAT is disabled. Which two statements about a firewall policy that allows inbound traffic to a port-forwarding VIP are correct? (Choose two.)",
    "options": [
      "Its service must allow the VIP's mapped (internal) port.",
      "NAT must be enabled so that the server can reply to internet clients.",
      "Its destination interface is the interface that leads to the mapped server.",
      "Its destination address must be an address object for the server's internal IP.",
      "Its source interface must be set to any for DNAT to work."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "DNAT happens **before** the route and policy lookups. The route to the mapped IP determines the egress interface (the server side), and the policy sees the translated port, so the service must allow the **mapped** port.\n\n- In policy NAT mode the destination must be the **VIP object**.\n- NAT is normally disabled so the server sees real client IPs, and the server replies through the FortiGate because it is the server's gateway.\n- The source interface is the interface where clients arrive.",
    "lesson": "2.2-dnat-vips"
  },
  {
    "id": "d2-048",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. All user accounts are in OU=Staff,DC=training,DC=lab, and every user fails authentication against TRAINING-AD. Settings not shown use their default values. What should the administrator change?",
    "exhibit": "FGT-HQ # show user ldap\nconfig user ldap\n    edit \"TRAINING-AD\"\n        set server \"10.0.1.5\"\n        set cnid \"sAMAccountName\"\n        set dn \"dc=training,dc=lab\"\n    next\nend",
    "options": [
      "Change `cnid` to `cn`.",
      "Add a `config match` entry for OU=Staff in the user group.",
      "Set `type regular` and configure a bind username and password, so FortiGate searches the subtree for the user.",
      "Set `port 636` so the connection uses LDAPS."
    ],
    "answer": [
      2
    ],
    "explanation": "No `type` line is shown, so the server uses the default bind type, **simple**. Simple bind doesn't search. It builds the user DN as `cnid=<user>,<dn>` (here `sAMAccountName=jsmith,dc=training,dc=lab`) and binds with that DN. That object doesn't exist, because the users sit in an OU and AD DNs are built from `CN=`. **Regular** bind uses a service account to search the subtree under `dn` for `sAMAccountName=<user>` and then binds as the DN it finds.\n\n- `cn` is not the AD logon name.\n- Port 636 alone doesn't change how the DN is found (and needs `secure ldaps`).\n- A group match entry filters groups after authentication succeeds.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-049",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. What is the cause of the failure?",
    "exhibit": "FGT-HQ # diagnose debug application fnbamd -1\nFGT-HQ # diagnose debug enable\nFGT-HQ # diagnose test authserver ldap TRAINING-AD jsmith Wrongpass1\n[1931] handle_req-Rcvd auth req 421550113 for jsmith in TRAINING-AD opt=0000001b prot=0\n[1070] __fnbamd_cfg_get_ldap_list_by_server-Loading LDAP server 'TRAINING-AD'\n[1714] fnbamd_ldap_init-search filter is: sAMAccountName=jsmith\n[1723] fnbamd_ldap_init-search base is: dc=training,dc=lab\n[1095] __ldap_connect-tcps_connect(10.0.1.5) is established.\n[973] __ldap_rxtx-state 3(Admin Binding)\n[206] __ldap_build_bind_req-Binding to 'CN=svc-fgt-ldap,CN=Users,DC=training,DC=lab'\n[939] fnbamd_ldap_send-Request is sent. ID 1\n[831] fnbamd_ldap_parse_response-Got one MESSAGE. ID:1, type:bind\n[594] fnbamd_ldap_build_dn_search_req-base:'dc=training,dc=lab' filter:sAMAccountName=jsmith\n[939] fnbamd_ldap_send-Request is sent. ID 2\n[831] fnbamd_ldap_parse_response-Got one MESSAGE. ID:2, type:search-entry\n[206] __ldap_build_bind_req-Binding to 'CN=John Smith,OU=Staff,DC=training,DC=lab'\n[939] fnbamd_ldap_send-Request is sent. ID 3\n[831] fnbamd_ldap_parse_response-Got one MESSAGE. ID:3, type:bind\n[891] fnbamd_ldap_parse_response-Error 49(80090308: LdapErr: DSID-0C09044E, comment: AcceptSecurityContext error, data 52e, v4f7c)\n[3040] fnbamd_ldap_result-Result for ldap svr 10.0.1.5 is DENIED\nauthenticate 'jsmith' against 'TRAINING-AD' failed!",
    "options": [
      "The user's password is wrong. The service account bind and the user search succeeded, but the bind as the user returned error 49 with AD sub-code 52e.",
      "The user account does not exist in the directory.",
      "The TLS connection to the LDAP server failed, so no credentials were sent.",
      "The bind account credentials are wrong, so FortiGate could not search the directory."
    ],
    "answer": [
      0
    ],
    "explanation": "Read the fnbamd sequence. The connection is established and the admin (service account) bind is answered. The search returns a `search-entry` for the user, `CN=John Smith,OU=Staff,...`. Only the **user bind** (message ID 3) fails, with LDAP error **49 (invalid credentials)** and AD `data 52e` (bad password).\n\n- A bad service account would fail at message ID 1, before any search.\n- A missing user would return no search entry (AD sub-code 525 if a bind were attempted).\n- The connection line shows the TCP/TLS connection was established.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-050",
    "topic": "2.3",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which value is normally used for the LDAP server's Common Name Identifier (`cnid`) on Active Directory so that users log in with their pre-Windows 2000 logon name? (Attribute name.)",
    "answer": [
      "sAMAccountName",
      "samaccountname"
    ],
    "explanation": "`sAMAccountName` holds the AD logon name (for example `jsmith`). The FortiOS default `cnid` is `cn`, which on AD is usually the display name and is not suitable for logins. Use `userPrincipalName` if users log in as `user@domain`. The FortiOS Administration Guide notes that the identifier is case sensitive, so enter it as `sAMAccountName`.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-051",
    "topic": "2.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about LDAP secure connections in FortiOS 8.0 are correct? (Choose two.)",
    "options": [
      "The GUI provides a toggle that disables secure connection for a new LDAP server.",
      "An LDAP server that had secure connection disabled before the upgrade to 8.0 stays disabled after the upgrade.",
      "A new LDAP server created in the GUI uses STARTTLS by default.",
      "The CLI default for `secure` changed to `ldaps` in 8.0.",
      "STARTTLS requires the LDAP server to listen on port 636.",
      "A private CA certificate is not needed, because server-identity-check is disabled by default."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "FortiOS 8.0 *enables secure LDAP by default in the GUI*. STARTTLS is preselected and the GUI has no option to turn security off (use the CLI `set secure disable`). Upgrades keep existing settings.\n\n- The CLI attribute `secure` still defaults to `disable`.\n- STARTTLS runs on port 389. LDAPS uses 636.\n- `server-identity-check` defaults to `enable`, and a private CA that issued the server certificate must be imported.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-052",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "On FortiOS 8.0, an administrator creates a new LDAP server in the GUI for a DC whose certificate was issued by the company's internal CA. The DC supports STARTTLS and LDAPS. Test Connectivity fails. What should the administrator do?",
    "options": [
      "Enable `all-usergroup` on the LDAP server.",
      "Import the internal CA certificate into the FortiGate and select it as the LDAP server's certificate.",
      "Select plaintext LDAP in the GUI Protocol field.",
      "Change the Common Name Identifier to `userPrincipalName`."
    ],
    "answer": [
      1
    ],
    "explanation": "New 8.0 GUI LDAP servers use STARTTLS by default. The FortiGate must trust the certificate chain, and with a private CA that means importing the CA certificate into the FortiGate's CA certificate store and referencing it as the server's certificate. Also check that the server name or IP matches the certificate for the identity check. The GUI offers no plaintext option, because only the CLI can disable `secure`. `cnid` affects user lookup, not connectivity, and `all-usergroup` is a RADIUS option.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-053",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. `diagnose test authserver radius FAC-RADIUS pap jsmith <password>` fails after a timeout. What is the cause?",
    "exhibit": "FGT-HQ # show user radius FAC-RADIUS\nconfig user radius\n    edit \"FAC-RADIUS\"\n        set server \"10.0.1.7\"\n        set secret ENC 4Qm8kZ0vN3rT7yQ1aJ6wP2sL9xC5dF0gH8jK3lM6nB1vC4xZ7\n    next\nend\n\nRADIUS server log (FreeRADIUS on 10.0.1.7):\nDropping packet without response because of error: Received packet from 10.0.1.254 with invalid Message-Authenticator!  (Shared secret is incorrect.)",
    "options": [
      "The RADIUS server requires MS-CHAPv2, so `auth-type` must be changed.",
      "FortiGate sends RADIUS requests to port 1645 by default.",
      "The FortiGate must disable `require-message-authenticator` to accept the response.",
      "The shared secret configured on FAC-RADIUS does not match the secret defined for the FortiGate client on the RADIUS server."
    ],
    "answer": [
      3
    ],
    "explanation": "The server log says the request **from 10.0.1.254** had an invalid Message-Authenticator because the **shared secret is incorrect**, and the server drops it without a response. That is why the FortiGate test times out. Make the FortiGate `secret` match the client entry on the RADIUS server.\n\n- The packet was dropped before any authentication method was evaluated.\n- FortiOS uses port 1812 by default.\n- `require-message-authenticator` concerns validating **responses**, and there was no response.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-054",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "A RADIUS server (FortiAuthenticator) authenticates all staff. Only help-desk staff should become members of the FortiGate group Helpdesk-Users. What must the RADIUS server return for those users?",
    "options": [
      "An LDAP `memberOf` attribute that contains the Helpdesk-Users DN.",
      "A Filter-Id attribute that contains the ID of the firewall policy to apply.",
      "The Fortinet-Group-Name vendor-specific attribute, with a value that matches the `group-name` in the user group's `config match` entry.",
      "Nothing. FortiGate looks up RADIUS group membership in Active Directory."
    ],
    "answer": [
      2
    ],
    "explanation": "RADIUS doesn't return LDAP groups. FortiGate maps RADIUS users to groups with the **Fortinet-Group-Name VSA**, matched by `config match` → `set server-name` / `set group-name` in the FortiGate user group. Without a match entry, any user the RADIUS server accepts is a group member. `memberOf` is an LDAP attribute.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-055",
    "topic": "2.3",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default global RADIUS port in `config system global` (`radius-port`) on FortiOS 8.0? (Number only.)",
    "answer": [
      "1812"
    ],
    "explanation": "`radius-port` defaults to **1812**. A RADIUS server entry's own `radius-port` is 0 by default, which means \"use the global port\".",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-056",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. A contractor whose AD account is not in the Sales group logs in at the FortiGate authentication page and gets access through policy 40. Why?",
    "exhibit": "config user group\n    edit \"Sales-Users\"\n        set member \"TRAINING-AD\"\n    next\nend\nconfig firewall policy\n    edit 40\n        set name \"Sales-Web\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"HTTP\" \"HTTPS\"\n        set groups \"Sales-Users\"\n        set nat enable\n    next\nend",
    "options": [
      "Sales-Users has the LDAP server as a member with no `config match` entry, so any user the server authenticates belongs to the group.",
      "LDAP group membership is cached for 24 hours after the contractor's last login.",
      "`auth-on-demand implicitly` lets authenticated users fall through to policy 40.",
      "Policy 40 matches by source address only and ignores the `groups` setting for HTTPS."
    ],
    "answer": [
      0
    ],
    "explanation": "Adding a remote server to a firewall group without a match entry means *everyone that server successfully authenticates*. To restrict the group, add `config match` with `server-name \"TRAINING-AD\"` and `group-name \"CN=Sales,OU=Groups,DC=training,DC=lab\"`. `auth-on-demand` controls fall-through for **unauthenticated** sessions. FortiOS doesn't cache LDAP groups for 24 hours. The `groups` setting is enforced for all services.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-057",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Policy 40 is above policy 41, and authentication settings are at their defaults. Users browse the web but never see a login prompt. Which change forces users to authenticate while keeping policy 41?",
    "exhibit": "config firewall policy\n    edit 40\n        set name \"Sales-Web\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"HTTP\" \"HTTPS\"\n        set groups \"Sales-Users\"\n        set nat enable\n    next\n    edit 41\n        set name \"LAN-Web\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"HTTP\" \"HTTPS\" \"DNS\"\n        set nat enable\n    next\nend",
    "options": [
      "Set `auth-timeout-type hard-timeout` under `config user setting`.",
      "Enable `captive-portal-exempt` on policy 40.",
      "Set `auth-on-demand always` under `config user setting`.",
      "Set `auth-secure-http enable` under `config user setting`."
    ],
    "answer": [
      2
    ],
    "explanation": "With the default `auth-on-demand implicitly`, unauthenticated traffic that matches identity policy 40 continues to the lower policies. Policy 41 has no authentication and matches, so the user is never prompted. `always` makes the first matching identity policy force authentication.\n\n- `auth-secure-http` only redirects the HTTP login to HTTPS, and it is already enabled by default.\n- The timeout type affects how long an authentication lasts.\n- `captive-portal-exempt` exempts a policy from the captive portal, which is the opposite of what is needed.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-058",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. This is the only port2-to-port1 policy. Users should get the FortiGate login page before browsing, but their browsers just time out and no login page appears. What is the most likely fix?",
    "exhibit": "config firewall policy\n    edit 50\n        set name \"Staff-Internet\"\n        set srcintf \"port2\"\n        set dstintf \"port1\"\n        set action accept\n        set srcaddr \"LAN-10.0.1.0\"\n        set dstaddr \"all\"\n        set schedule \"always\"\n        set service \"ALL\"\n        set groups \"Staff\"\n        set nat enable\n    next\nend",
    "options": [
      "Add `telnet` to `auth-type` under `config user setting`.",
      "Set `auth-timeout 0` so authenticated users never expire.",
      "Disable `auth-secure-http` so the login page uses HTTP.",
      "Add a policy above policy 50 that allows DNS from port2 to the DNS servers without authentication."
    ],
    "answer": [
      3
    ],
    "explanation": "Only HTTP, HTTPS, FTP and Telnet can trigger the login prompt. Browsers must resolve the site name with **DNS** before they send any HTTP request. DNS can't trigger authentication, and no other policy allows it, so it hits the implicit deny and the browser never gets as far as HTTP. Allow DNS without authentication first. Adding Telnet or changing timeouts doesn't help DNS, and the HTTPS redirect is not the problem.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-059",
    "topic": "2.3",
    "type": "multi",
    "difficulty": 1,
    "stem": "An identity-based firewall policy requires active authentication. Which two protocols can trigger the FortiGate login prompt for an unauthenticated user? (Choose two.)",
    "options": [
      "ICMP echo",
      "FTP",
      "DNS",
      "SSH",
      "HTTP",
      "SMB"
    ],
    "answer": [
      1,
      4
    ],
    "explanation": "`config user setting` → `set auth-type` supports **HTTP, HTTPS, FTP and Telnet**, the protocols FortiGate can intercept to show a login page or challenge. DNS, ICMP, SSH and SMB can't present a prompt. They are allowed only after the user has authenticated through a supported protocol.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-060",
    "topic": "2.3",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each `auth-timeout-type` value with its behaviour.",
    "pairs": [
      [
        "idle-timeout",
        "The timer restarts while the user's traffic keeps flowing (default)"
      ],
      [
        "hard-timeout",
        "An absolute limit from login, regardless of activity"
      ],
      [
        "new-session",
        "Existing sessions continue after expiry, but new sessions require re-authentication"
      ]
    ],
    "explanation": "`auth-timeout` (default 5 minutes) is applied according to `auth-timeout-type`. The GUI sets only the idle timeout. The hard and new-session types are CLI only.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-061",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement is correct?",
    "exhibit": "FGT-HQ # diagnose firewall auth list\n10.0.1.25, jsmith\n\ttype: fw, id: 0, duration: 184, idled: 12\n\tserver: FAC-RADIUS\n\tpackets: in 1442 out 1189, bytes: in 1873320 out 166208\n\tgroup_id: 5\n\tgroup_name: Helpdesk-Users\n\n10.0.1.31, akhan\n\ttype: fw, id: 0, duration: 2210, idled: 0\n\tserver: TRAINING-AD\n\tpackets: in 22107 out 18864, bytes: in 31877120 out 2214540\n\tgroup_id: 3\n\tgroup_name: Sales-Users\n\n----- 2 listed, 0 filtered ------",
    "options": [
      "akhan was identified passively through FSSO.",
      "Running `diagnose firewall auth clear` with no filter would also delete both users' existing sessions.",
      "jsmith has been idle for 184 seconds.",
      "jsmith's credentials were validated by the RADIUS server FAC-RADIUS, and he is a member of the FortiGate group Helpdesk-Users."
    ],
    "answer": [
      3
    ],
    "explanation": "Each entry shows the IP and user, `type: fw` (firewall/active authentication), the **server** that validated the credentials, and the FortiGate `group_name`. jsmith → FAC-RADIUS → Helpdesk-Users.\n\n- akhan is also `type: fw`, validated by the LDAP server TRAINING-AD. An FSSO-learned user would show `type: fsso` here (and also appears in `diagnose debug authd fsso list`).\n- `duration: 184` is how long jsmith has been authenticated. `idled: 12` is the idle time.\n- Clearing authentications doesn't clear existing sessions.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-062",
    "topic": "2.3",
    "type": "single",
    "difficulty": 1,
    "stem": "Where is the Firewall Users monitor found in the FortiOS 8.0 GUI?",
    "options": [
      "Monitor > Firewall User Monitor",
      "Log & Report > Forward Traffic > Users",
      "User & Authentication > User Definition",
      "Dashboard > Assets and Identities > Firewall Users"
    ],
    "answer": [
      3
    ],
    "explanation": "The FortiOS 8.0 Administration Guide puts it at **Dashboard > Assets and Identities > Firewall Users**, with *Show all FSSO Logons*, a Proxy view and a Deauthenticate action. *Monitor > Firewall User Monitor* is the old 6.2-era menu. User Definition is where local users are configured.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-063",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator deauthenticates user jsmith in the Firewall Users monitor, but jsmith's large download keeps running. Why?",
    "options": [
      "Downloads are inspected in proxy mode, which ignores authentication changes.",
      "Deauthentication removes the user's authentication entry but does not delete sessions that already exist. Those must be cleared separately.",
      "The deauthentication applies only after the idle timeout expires.",
      "Deauthentication takes effect only after the configuration is saved."
    ],
    "answer": [
      1
    ],
    "explanation": "Deauthenticating, like `diagnose firewall auth clear`, removes the user from the authentication table, so **new** sessions need a fresh login. Established sessions stay in the session table until they end or are cleared (for example `diagnose sys session filter src 10.0.1.25` and then `diagnose sys session clear`). The change is immediate, with nothing to save, and the inspection mode doesn't matter.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-064",
    "topic": "2.3",
    "type": "fill",
    "difficulty": 2,
    "stem": "Complete the command that requires every user arriving on port2 to authenticate before any traffic is allowed: `config system interface` → `edit \"port2\"` → `set security-mode ______`",
    "answer": [
      "captive-portal"
    ],
    "explanation": "`set security-mode captive-portal` (options `none`, `captive-portal`, `802.1X`) enables interface captive portal. `set security-groups` lists the allowed groups, and `security-exempt-list` lets devices that can't authenticate skip it.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-065",
    "topic": "2.3",
    "type": "order",
    "difficulty": 3,
    "stem": "Put the steps of an LDAP authentication with bind type **regular** in the order FortiGate performs them.",
    "items": [
      "Bind to the LDAP server with the configured service account",
      "Search the subtree under the base DN for cnid=<username>",
      "Bind as the user DN that was found, using the password the user entered",
      "Read the user's group attribute (memberOf)",
      "Compare the groups with the user group's match entries"
    ],
    "explanation": "This matches the fnbamd debug sequence: admin bind → DN search (`search-entry`) → user bind (password check) → attribute query for `memberOf` → group matching against the FortiGate user group. Simple bind skips the service account and the search, which is why it fails when users are in sub-OUs.",
    "lesson": "2.3-ldap-radius"
  },
  {
    "id": "d2-066",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "A site uses FSSO for domain PCs and wants active LDAP authentication for non-domain laptops on the same subnet. How should the policies be ordered?",
    "options": [
      "Put an open policy without groups at the top, so authentication is triggered only when needed.",
      "Use one policy with both groups and set `auth-on-demand always`, so every user is prompted.",
      "Put the FSSO-group policy above the LDAP-group policy, so FSSO-identified users match first and the active policy is the fallback.",
      "Put the LDAP-group policy above the FSSO-group policy and set `auth-on-demand always`."
    ],
    "answer": [
      2
    ],
    "explanation": "Passive (FSSO) users are already known, so they match the **first** policy for their group. Placing the FSSO policy first lets domain users pass transparently. Unknown devices continue to the LDAP policy, which prompts them. `always` would force prompts and can break FSSO matching. An open policy at the top would let everyone through without authentication.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-067",
    "topic": "2.3",
    "type": "single",
    "difficulty": 2,
    "stem": "With FortiOS 8.0 default user authentication settings, an unauthenticated user's HTTP request matches an identity-based policy. Where is the user sent to log in?",
    "options": [
      "To the FortiGate's HTTP authentication page on port 1000, because HTTP requests always use the HTTP login page.",
      "To the LDAP server's web login page.",
      "To the FortiGate's HTTPS authentication page on port 1003, because `auth-secure-http` is enabled by default.",
      "To the FortiGate administrative GUI on port 443."
    ],
    "answer": [
      2
    ],
    "explanation": "In the FortiOS 8.0 CLI reference, `auth-secure-http` under `config user setting` defaults to `enable`, so HTTP challenges are redirected to HTTPS. The firewall authentication pages listen on `auth-http-port` **1000** and `auth-https-port` **1003** (`config system global`). LDAP servers don't host the login page, and the admin GUI is separate from firewall authentication.",
    "lesson": "2.3-active-passive-auth"
  },
  {
    "id": "d2-068",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. MLOPEZ belongs to the AD group Marketing but receives the restricted guest web filter. The DC logon and workstation IP are correct. Why?",
    "exhibit": "FGT-HQ # diagnose debug authd fsso list\n----FSSO logons----\nIP: 10.0.1.31  User: JSMITH  Groups: CN=SALES,OU=GROUPS,DC=TRAINING,DC=LAB  Workstation: WS-031.TRAINING.LAB MemberOf: FSSO-Sales\nIP: 10.0.1.52  User: MLOPEZ  Groups: CN=DOMAIN USERS,CN=USERS,DC=TRAINING,DC=LAB  Workstation: WS-052.TRAINING.LAB MemberOf: SSO_Guest_Users\nTotal number of logons listed: 2, filtered: 0\n----end of FSSO logons----",
    "options": [
      "`auth-on-demand always` is preventing MLOPEZ from matching the Marketing policy.",
      "The Marketing group is not one of the monitored groups, so no FortiGate FSSO group matches MLOPEZ and the user is placed in SSO_Guest_Users.",
      "The DNS record for WS-052 is stale, so FortiGate cannot match the user's traffic.",
      "No DC agent is installed on the DC that authenticated MLOPEZ."
    ],
    "answer": [
      1
    ],
    "explanation": "`MemberOf` shows the FortiGate group the logon was mapped into. `SSO_Guest_Users` is the predefined group for logged-on users who aren't in any monitored group, and Marketing doesn't appear in the reported groups. Add the Marketing group to the collector agent's (or FortiGate's) group filter and map it to an FSSO user group.\n\nThe logon is present with the right IP and workstation, so DNS and the DC agent are working. `auth-on-demand` doesn't change the FSSO group mapping.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-069",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Every night after about 01:00, JSMITH (WS-031) loses Sales access until he logs off and back on. The exhibit was captured at 01:10. What should the administrator do?",
    "exhibit": "FGT-HQ # diagnose debug authd fsso list\n----FSSO logons----\nIP: 10.0.1.31  User: SVC-BACKUP  Groups: CN=BACKUP OPERATORS,CN=BUILTIN,DC=TRAINING,DC=LAB  Workstation: WS-031.TRAINING.LAB MemberOf: SSO_Guest_Users\nIP: 10.0.1.44  User: AKHAN  Groups: CN=ENGINEERING,OU=GROUPS,DC=TRAINING,DC=LAB  Workstation: WS-044.TRAINING.LAB MemberOf: FSSO-Engineering\nTotal number of logons listed: 2, filtered: 0\n----end of FSSO logons----",
    "options": [
      "Add SVC-BACKUP to the collector agent's ignore user list.",
      "Switch from collector agent mode to agentless polling.",
      "Increase the collector agent's dead entry timeout.",
      "Set `logon-timeout` on the FortiGate FSSO connector to 0."
    ],
    "answer": [
      0
    ],
    "explanation": "A backup job logs on to WS-031 with the service account SVC-BACKUP. FSSO keeps **one user per IP**, so the newer logon replaces JSMITH's mapping, and SVC-BACKUP isn't in a monitored group. Adding service accounts to the **ignore user list** stops them from overwriting real users. The dead entry timeout and `logon-timeout` only control how long entries are kept. Agentless polling has the same one-user-per-IP limitation.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-070",
    "topic": "2.4",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each FSSO communication path with its default port.",
    "pairs": [
      [
        "FortiGate to collector agent",
        "TCP 8000"
      ],
      [
        "DC agent to collector agent",
        "UDP 8002"
      ],
      [
        "FortiGate agentless polling of a domain controller",
        "TCP 445"
      ],
      [
        "FortiGate to collector agent with SSL enabled",
        "TCP 8001"
      ]
    ],
    "explanation": "The FortiGate connects to the collector agent on **TCP 8000** (`config user fsso` `port` default 8000), or **8001** with SSL. DC agents send logon events to the collector agent over **UDP 8002** (TCP 8003 when secure). Agentless polling reads the DC security event log over SMB, **TCP 445**.",
    "lesson": "2.4-fsso-modes"
  },
  {
    "id": "d2-071",
    "topic": "2.4",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about FSSO agentless polling (the FortiGate polling a domain controller directly) are correct? (Choose two.)",
    "options": [
      "NTLM authentication fallback is supported.",
      "A DC agent must be installed on each polled domain controller.",
      "Workstation verification is not performed.",
      "The default polling frequency is 60 seconds.",
      "FortiGate reads the DC's security event log over SMB on TCP 445.",
      "A collector agent is still required to forward logons to the FortiGate."
    ],
    "answer": [
      2,
      4
    ],
    "explanation": "In agentless mode, `config user fsso-polling`, the FortiGate itself polls the DC security log over **TCP 445** (default `polling-frequency 10` seconds) and gets groups from an LDAP server. It does no workstation verification and has no NTLM support, and it needs neither a collector agent nor DC agents. Fortinet positions it for small environments.",
    "lesson": "2.4-fsso-modes"
  },
  {
    "id": "d2-072",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement is correct?",
    "exhibit": "FGT-HQ # diagnose debug fsso-polling detail\nAD Server Status(connected):\nID=1, name(10.0.1.5),ip=10.0.1.5,source(security),users(37)\nport=auto username=svc-fsso\nread log eof=1, latest logon timestamp: Tue Oct 27 08:41:12 2026\npolling frequency: every 10 second(s) success(18211), fail(0)\nLDAP query: success(52), fail(0)\nLDAP max group query period(seconds): 0\nLDAP status: connected",
    "options": [
      "The FortiGate itself polls the security event log of 10.0.1.5 every 10 seconds, without a collector agent.",
      "A DC agent on 10.0.1.5 pushes logon events to the FortiGate every 10 seconds.",
      "Polling is failing, because the LDAP query counters are increasing.",
      "The 37 users listed are all members of SSO_Guest_Users."
    ],
    "answer": [
      0
    ],
    "explanation": "`diagnose debug fsso-polling detail` belongs to **agentless polling** (`config user fsso-polling`). `source(security)` is the security event log, `polling frequency: every 10 second(s)` is the default, and `success(18211), fail(0)` shows healthy polls. The LDAP counters show successful group queries. Nothing in the output reveals the users' group mapping. DC agents send to a collector agent, not to the FortiGate.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-073",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "A company with four domain controllers deploys FSSO in DC agent mode but installs the DC agent on only two of them. What is the result?",
    "options": [
      "The FortiGate refuses the collector agent connection until all DCs have agents.",
      "Logons handled by the two DCs without the agent are not seen, so those users are not identified.",
      "DC agents replicate logon events between DCs, so all logons are still seen.",
      "The collector agent automatically polls the other two DCs with NetAPI."
    ],
    "answer": [
      1
    ],
    "explanation": "In DC agent mode, each DC agent reports only the logons processed by **its own** DC. Users authenticated by a DC without the agent never reach the collector agent, so they appear as unauthenticated. Install the agent on every DC that authenticates users, or monitor those DCs in polling mode. DC agents don't replicate events, and the FortiGate connection to the collector agent is unaffected.",
    "lesson": "2.4-fsso-modes"
  },
  {
    "id": "d2-074",
    "topic": "2.4",
    "type": "single",
    "difficulty": 1,
    "stem": "Which FSSO deployment uses a collector agent but requires no software on the domain controllers?",
    "options": [
      "DC agent mode",
      "Agentless polling on the FortiGate",
      "Collector agent polling mode (NetAPI, WinSecLog or WMI)",
      "RADIUS single sign-on (RSSO)"
    ],
    "answer": [
      2
    ],
    "explanation": "In **polling mode** the collector agent queries the DCs itself, so nothing is installed on the DCs. DC agent mode needs `dcagent.dll` on every DC. Agentless polling needs no DC software either, but it has **no collector agent**. RSSO learns identities from RADIUS accounting, not AD.",
    "lesson": "2.4-fsso-modes"
  },
  {
    "id": "d2-075",
    "topic": "2.4",
    "type": "multi",
    "difficulty": 3,
    "stem": "Which two statements comparing collector agent polling methods are correct? (Choose two.)",
    "options": [
      "WinSecLog requires the DC agent to be installed on each DC.",
      "NetAPI is the method used by FortiGate agentless polling.",
      "WinSecLog reads logon events from the DC security event log, so it depends on logon auditing being enabled.",
      "WMI polling requires the collector agent to query each workstation instead of the DCs.",
      "NetAPI receives real-time push notifications of each logon from the DC.",
      "NetAPI polls DC sessions with the NetSessionEnum API. It is fast but can miss short-lived logons."
    ],
    "answer": [
      2,
      5
    ],
    "explanation": "**WinSecLog** reads the Security event log, so it catches every audited logon but processes more data. **NetAPI** enumerates sessions on the DC (`NetSessionEnum`). It is light and fast but can miss logons. WMI queries the DCs' event logs through WMI. None of the polling methods needs DC agents, and none receives push notifications (that is DC agent mode). FortiGate agentless polling reads the security log over SMB, not NetAPI.",
    "lesson": "2.4-fsso-modes"
  },
  {
    "id": "d2-076",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "The FSSO list shows JSMITH at 10.0.1.77, but his workstation's DHCP address is 10.0.1.31. Another user at 10.0.1.77 is getting JSMITH's access. What should be checked first?",
    "options": [
      "The DNS record for JSMITH's workstation, because the collector agent resolves workstation names to IP addresses through DNS.",
      "The LDAP server's `cnid` on the FortiGate.",
      "The FortiGate's ARP table for 10.0.1.31.",
      "The RADIUS accounting configuration on the DC."
    ],
    "answer": [
      0
    ],
    "explanation": "Logon events identify the **workstation name**, and the collector agent resolves it to an IP with **DNS**. A stale A record (dynamic DNS updates failing, no scavenging) maps the user to the wrong IP and gives that IP's current user someone else's rights. `cnid` is for LDAP user lookups, ARP doesn't feed FSSO, and RADIUS accounting is RSSO.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-077",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Windows Firewall blocks the collector agent's workstation verification on all PCs. A user shuts down his PC at 17:00. The collector agent uses default timers. What happens to his FSSO logon entry?",
    "options": [
      "It is removed within 5 minutes, at the next workstation verification attempt.",
      "It stays until the dead entry timeout (8 hours by default) expires, so another device that receives his IP could inherit his access.",
      "It stays until the FortiGate reboots.",
      "It is removed immediately, because Windows sends a logoff event to the DC agent."
    ],
    "answer": [
      1
    ],
    "explanation": "When the collector agent can't reach a workstation (TCP 445/139/135 blocked), it can't prove the user logged off. It keeps the entry until the **dead entry timeout**, 480 minutes by default. Logoff events aren't reliably reported, and FSSO is driven by logons. Allow workstation verification, or shorten the timer, to reduce this risk.",
    "lesson": "2.4-fsso-modes"
  },
  {
    "id": "d2-078",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Twenty users work on the Windows Remote Desktop server RDS-01 (10.0.2.50), but the FortiGate shows only one FSSO logon for that IP, and it changes whenever someone new logs on. What is happening, and what is the recommended fix?",
    "exhibit": "FGT-HQ # diagnose debug authd fsso list\n----FSSO logons----\nIP: 10.0.2.50  User: PNGUYEN  Groups: CN=FINANCE,OU=GROUPS,DC=TRAINING,DC=LAB  Workstation: RDS-01.TRAINING.LAB MemberOf: FSSO-Finance\nTotal number of logons listed: 1, filtered: 0\n----end of FSSO logons----",
    "options": [
      "All twenty users are mapped to 10.0.2.50 with their own groups. No change is needed.",
      "The FortiGate rejects the logons. Use agentless polling instead.",
      "FSSO maps only one user to the IP at a time, so the most recent logon determines everyone's access. Deploy the Fortinet Terminal Server agent.",
      "The users are placed in SSO_Guest_Users. Switch to the collector agent's Advanced access method."
    ],
    "answer": [
      2
    ],
    "explanation": "FSSO is **IP-based, one user per IP**. On a multi-user host the last logon overwrites the mapping, so users get each other's rights. Fortinet's Terminal Server (TS) agent identifies users per session on shared hosts. The Advanced access method changes group naming and filtering, not the one-user-per-IP limit, and agentless polling has the same limit.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-079",
    "topic": "2.4",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. After a change, FSSO user JSMITH (10.0.1.31) cannot browse. `diagnose debug authd fsso list` shows JSMITH at 10.0.1.31 with `MemberOf: FSSO-Sales`. Policy 40 allows the FSSO group FSSO-Engineering, and policy 41, directly below it, allows FSSO-Sales. Both policies use the same interfaces, source address and services. Which change restores access without reordering policies?",
    "exhibit": "FGT-HQ # show user setting\nconfig user setting\n    set auth-on-demand always\nend\nFGT-HQ # diagnose debug flow trace start 10\nid=65308 trace_id=7 func=print_pkt_detail line=5845 msg=\"vd-root:0 received a packet(proto=6, 10.0.1.31:52211->198.51.100.80:443) tun_id=0.0.0.0 from port2. flag [S], seq 1720044311, ack 0, win 64240\"\nid=65308 trace_id=7 func=init_ip_session_common line=6047 msg=\"allocate a new session-0001d07e\"\nid=65308 trace_id=7 func=__vf_ip_route_input_rcu line=2012 msg=\"find a route: flag=00000000 gw-203.0.113.1 via port1\"\nid=65308 trace_id=7 func=__iprope_check_one_policy line=2202 msg=\"checked gnum-100004 policy-40, ret-matched, act-accept\"\nid=65308 trace_id=7 func=__iprope_user_identity_check line=1894 msg=\"ret-stop\"\nid=65308 trace_id=7 func=__iprope_check line=2400 msg=\"after iprope_captive_check(): is_captive-0, ret-stop, act-drop, idx-0\"\nid=65308 trace_id=7 func=fw_forward_handler line=1014 msg=\"Denied by forward policy check (policy 0)\"",
    "options": [
      "Set `logon-timeout` on the FSSO connector to its maximum.",
      "Increase `auth-timeout` to 30 minutes.",
      "Add FSSO-Sales to the collector agent's ignore user list.",
      "Set `auth-on-demand implicitly` under `config user setting`."
    ],
    "answer": [
      3
    ],
    "explanation": "JSMITH is correctly identified (FSSO-Sales), so the problem is policy matching. With `auth-on-demand always`, FortiGate doesn't let passively identified users fall through from one passive (FSSO/RSSO) policy to the next. Policy 40 matches by interface, address and service, the user identity check returns `ret-stop` instead of moving on to policy 41, and the session is dropped (`Denied by forward policy check (policy 0)`). Fortinet's documented fix is `set auth-on-demand implicitly` (the default), which lets the user fall through to policy 41. (Moving policy 41 above 40 would also work, but the question rules out reordering.)\n\n- `logon-timeout` only controls how long logons are kept after the collector agent connection is lost. The logon is present.\n- `auth-timeout` applies to active firewall authentication and doesn't affect fall-through.\n- The ignore user list takes user accounts, not groups, and ignoring the user would remove his identity entirely.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-080",
    "topic": "2.4",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two capabilities does ZTNA identity on FortiGate (with FortiClient EMS) provide that FSSO does not? (Choose two.)",
    "options": [
      "Transparent mapping of Active Directory logon events to IP addresses",
      "The same identity and posture-based access whether the device is on-net or off-net",
      "Access control with no software on the endpoint",
      "Device posture checks through EMS ZTNA tags that are evaluated in policy",
      "Identity bound to the device's source IP address",
      "Group-based firewall policies"
    ],
    "answer": [
      1,
      3
    ],
    "explanation": "ZTNA verifies **user plus device posture** per session (an EMS certificate and ZTNA tags such as patch or AV state), and it works the same from any location. Mapping AD logons to IPs is how FSSO works, and binding identity to the source IP is FSSO's weakness. Needing no endpoint software is already true of FSSO, so it isn't something ZTNA adds (and the EMS-tag posture model relies on FortiClient). Group-based policies exist in both models.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-081",
    "topic": "2.4",
    "type": "single",
    "difficulty": 1,
    "stem": "What is FortiIdentity Cloud?",
    "options": [
      "The cloud replacement for FortiClient EMS that issues ZTNA tags.",
      "Fortinet's cloud identity service, formerly FortiToken Cloud, which provides MFA and can act as a SAML/OIDC identity provider or IdP proxy.",
      "A FortiAnalyzer Cloud add-on that stores user authentication logs.",
      "The new name of the FSSO collector agent when it is hosted in FortiCloud."
    ],
    "answer": [
      1
    ],
    "explanation": "FortiToken Cloud was renamed **FortiIdentity Cloud (FIC)** in August 2025. Existing tokens and integrations kept working, and the portal URL moved from ftc.fortinet.com to fic.fortinet.com (the old URLs redirect). FIC provides MFA (for example FortiToken Mobile push) and identity provider functions: a local SAML/OIDC IdP, or an IdP proxy to upstream IdPs. It is not an FSSO component, a log store or EMS.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-082",
    "topic": "2.4",
    "type": "multi",
    "difficulty": 2,
    "stem": "Refer to the exhibit. An administrator saves this FortiOS 8.0 SSO configuration. Which two statements are correct? (Choose two.)",
    "exhibit": "config user saml\n    edit \"fic-sso\"\n        set type fortiidentity-cloud\n        set idp-cert \"FIC_Default_Cert\"\n        set user-name \"username\"\n        set group-name \"group\"\n        set service-provider-address \"203.0.113.2:8443\"\n        set user-source \"training-entra\"\n    next\nend",
    "options": [
      "Users are identified passively from Windows logon events, so they are never redirected to a login page.",
      "An FSSO collector agent is required to relay the SAML assertions.",
      "`fortiidentity-cloud` is the default value of `type` in `config user saml`.",
      "The administrator must download the IdP metadata XML and paste the entity ID and SSO URL manually.",
      "FortiIdentity Cloud automatically creates an SSO application named fic-sso.",
      "SP and IdP metadata are exchanged in the background, and the FortiIdentity Cloud certificate is imported on the FortiGate as a remote certificate."
    ],
    "answer": [
      4,
      5
    ],
    "explanation": "The 8.0 *SSO integration with FortiIdentity Cloud* feature pulls realms, user sources and certificates from FIC. On save, FIC creates the SSO application with the same name, metadata is exchanged automatically, and the FIC certificate is imported as a remote certificate (`show user saml` then shows the generated entity ID and URLs).\n\n- FIC SSO is **SAML**: users are redirected to the IdP, so it is not passive like FSSO.\n- No collector agent is involved.\n- The default `type` is `custom`.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-083",
    "topic": "2.4",
    "type": "single",
    "difficulty": 2,
    "stem": "What is required before an administrator can create an SSO server of type FortiIdentity Cloud on a FortiOS 8.0 FortiGate?",
    "options": [
      "A FortiGuard Unified Threat Protection bundle.",
      "An on-premises FortiAuthenticator acting as the SAML IdP.",
      "An FSSO collector agent registered to FortiIdentity Cloud.",
      "FortiIdentity Cloud already set up for the FortiGate (seats, for example the three free seats included with FortiCare Premium or Elite), with a realm, user source and certificate for the FortiGate to retrieve."
    ],
    "answer": [
      3
    ],
    "explanation": "In the 8.0 feature, the FortiGate **retrieves** the existing realm, user source and certificate from FortiIdentity Cloud to pre-populate the SSO server, so FIC must already be configured for that FortiGate. The New Features guide notes that FortiGates with FortiCare Premium or Elite get three free FIC seats; more seats can be bought as FIC licences.\n\n- No on-premises FortiAuthenticator is involved: FIC itself is the IdP (or IdP proxy).\n- FSSO collector agents have nothing to do with SAML SSO.\n- A FortiGuard UTP bundle doesn't include or enable FIC.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-084",
    "topic": "2.4",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which value completes `config user saml` → `edit \"fic-sso\"` → `set type ______` to use the FortiOS 8.0 FortiIdentity Cloud integration?",
    "answer": [
      "fortiidentity-cloud"
    ],
    "explanation": "`type` accepts `custom` (default, manual SAML configuration with any IdP) and `fortiidentity-cloud`, which automatically creates the SSO application in FIC and sets it up.",
    "lesson": "2.4-fsso-troubleshooting-identity"
  },
  {
    "id": "d2-085",
    "topic": "2.4",
    "type": "order",
    "difficulty": 2,
    "stem": "Put the FSSO DC agent mode information flow in order, from user logon to policy enforcement.",
    "items": [
      "The user logs on to the domain and a domain controller authenticates the user",
      "The DC agent on that domain controller captures the logon event",
      "The DC agent sends the logon information to the collector agent (UDP 8002)",
      "The collector agent resolves the workstation name to an IP address through DNS and checks group membership",
      "The collector agent sends the IP address, user and groups to the FortiGate (TCP 8000)",
      "The FortiGate matches the user's traffic against policies that use FSSO groups"
    ],
    "explanation": "DC agent → collector agent (UDP 8002) → DNS lookup and group check on the collector agent → FortiGate (TCP 8000) → policy matching. A DNS or group problem on the collector agent therefore shows up as a wrong IP or `SSO_Guest_Users` on the FortiGate, even though the DC saw the logon correctly.",
    "lesson": "2.4-fsso-modes"
  }
];
