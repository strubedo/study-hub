// Domain 2 — Firewall policies and authentication: flashcards (FortiOS 8.0).
export default [
  {
    "id": "d2-f001",
    "topic": "2.1",
    "front": "How does FortiGate choose which firewall policy applies to a new session?",
    "back": "Top-down by **sequence**, first match wins. If nothing matches, implicit deny **policy 0** drops it."
  },
  {
    "id": "d2-f002",
    "topic": "2.1",
    "front": "Policy ID vs policy sequence?",
    "back": "The ID is a permanent label set at creation (`edit 10`). The sequence (list position) controls matching order. `move` changes only the sequence."
  },
  {
    "id": "d2-f003",
    "topic": "2.1",
    "front": "CLI to put policy 25 directly above policy 10?",
    "back": "`config firewall policy` → `move 25 before 10`"
  },
  {
    "id": "d2-f004",
    "topic": "2.1",
    "front": "How do you log traffic dropped by the implicit deny?",
    "back": "`config log setting` → `set fwpolicy-implicit-log enable` (off by default), or enable logging on the implicit deny in the GUI."
  },
  {
    "id": "d2-f005",
    "topic": "2.1",
    "front": "Default `action` of a policy created in the CLI?",
    "back": "`deny`. Set `action accept` explicitly. `show` hides defaults, so a policy with no action line is a deny policy."
  },
  {
    "id": "d2-f006",
    "topic": "2.1",
    "front": "Why does a policy change not affect an ongoing transfer?",
    "back": "Policies are evaluated only for the first packet. Existing sessions keep their `policy_id` until cleared or expired."
  },
  {
    "id": "d2-f007",
    "topic": "2.1",
    "front": "Where are IPv6 policies configured on FortiOS 8.0?",
    "back": "In the same `config firewall policy` table, using `srcaddr6`/`dstaddr6`. `policy6` was removed in 6.4."
  },
  {
    "id": "d2-f008",
    "topic": "2.1",
    "front": "Where is flow vs proxy inspection set in profile-based mode?",
    "back": "Per firewall policy: `set inspection-mode flow|proxy` (default `flow`)."
  },
  {
    "id": "d2-f009",
    "topic": "2.1",
    "front": "Key traits of NGFW policy-based mode?",
    "back": "Per-VDOM `ngfw-mode policy-based`. Apps and URL categories in security policies, SSL Inspection & Authentication pre-match table, flow only, central SNAT always on, no HA session pickup."
  },
  {
    "id": "d2-f010",
    "topic": "2.1",
    "front": "`logtraffic utm` vs `all`?",
    "back": "`utm` (default, Security Events) logs only sessions with security events. `all` logs every accepted session. `disable` logs none."
  },
  {
    "id": "d2-f011",
    "topic": "2.1",
    "front": "Traffic log fields for NAT?",
    "back": "`trandisp` = snat/dnat/noop. `transip`/`transport` = translated **source**. `tranip`/`tranport` = translated **destination**."
  },
  {
    "id": "d2-f012",
    "topic": "2.1",
    "front": "FortiOS 8.0 custom tag CLI?",
    "back": "`config firewall custom-tag` (abbreviation, comment, `color` 0–32, default 1), applied with `set custom-tags` on addresses, groups, policies and central SNAT entries."
  },
  {
    "id": "d2-f013",
    "topic": "2.1",
    "front": "Address group types in FortiOS 8.0?",
    "back": "`default` (normal), `folder` (members can't be in other groups), `dynamic-tag` (members = addresses carrying any of the group's tags)."
  },
  {
    "id": "d2-f014",
    "topic": "2.1",
    "front": "Why can't you see policy tags in the 8.0 GUI?",
    "back": "Policy tagging is hidden by default. Enable it in **System > Feature Visibility**."
  },
  {
    "id": "d2-f015",
    "topic": "2.2",
    "front": "`set nat enable` with no IP pool translates to…?",
    "back": "The IP of the actual **egress interface** for that session, with PAT."
  },
  {
    "id": "d2-f016",
    "topic": "2.2",
    "front": "Default IP pool type?",
    "back": "**Overload**: many-to-few with PAT. Each client consistently gets a pool address chosen by source IP modulo pool size."
  },
  {
    "id": "d2-f017",
    "topic": "2.2",
    "front": "One-to-one IP pool behaviour?",
    "back": "Each internal host gets its own external IP, with no PAT. N addresses serve N hosts at a time."
  },
  {
    "id": "d2-f018",
    "topic": "2.2",
    "front": "What does a fixed-port-range pool need that other types don't?",
    "back": "An internal range (`source-startip`/`source-endip`). Each internal IP gets a predictable port block."
  },
  {
    "id": "d2-f019",
    "topic": "2.2",
    "front": "PBA defaults and ports per host?",
    "back": "`block-size 128` × `num-blocks-per-user 8` = 1024 ports per internal IP. Logs per block, not per session."
  },
  {
    "id": "d2-f020",
    "topic": "2.2",
    "front": "Risk of an unused IP pool or VIP?",
    "back": "`arp-reply enable` (default) answers ARP for its addresses, and they are treated as local, even with no policy referencing them."
  },
  {
    "id": "d2-f021",
    "topic": "2.2",
    "front": "How do you enable central NAT and where does SNAT go?",
    "back": "`config system settings` → `set central-nat enable`. SNAT lives in `config firewall central-snat-map`: top-down, first match."
  },
  {
    "id": "d2-f022",
    "topic": "2.2",
    "front": "In what order are DNAT, routing and policy lookup applied?",
    "back": "VIP/DNAT first, then route lookup on the mapped IP, then policy lookup. So the policy uses the VIP, the server-side `dstintf` and the **mapped** port."
  },
  {
    "id": "d2-f023",
    "topic": "2.2",
    "front": "Debug flow: `find DNAT` then `policy 0`?",
    "back": "The VIP matched, but no policy allows the translated traffic. Check the service (mapped port), `dstintf`, and that `dstaddr` is the VIP."
  },
  {
    "id": "d2-f024",
    "topic": "2.2",
    "front": "`match-vip` default in FortiOS 8.0?",
    "back": "`enable` (only on deny policies). Deny policies with dstaddr `all` also match DNATed traffic. It was disabled by default before 7.2.3."
  },
  {
    "id": "d2-f025",
    "topic": "2.2",
    "front": "When is a VIP used for DNAT (central NAT off)?",
    "back": "Only when an enabled firewall policy references it. ARP reply still answers for its `extip` regardless."
  },
  {
    "id": "d2-f026",
    "topic": "2.2",
    "front": "Central NAT: what is a policy's destination for a published server?",
    "back": "The **mapped internal address**. Enabled VIPs apply without a policy reference (DNAT & Virtual IPs page)."
  },
  {
    "id": "d2-f027",
    "topic": "2.2",
    "front": "FortiOS 8.0.1 VIP ordering feature?",
    "back": "GUI drag-and-drop and Insert Above/Below, plus Security Rating *Virtual IP Overlap* insights. IPv4 VIPs only, central NAT disabled."
  },
  {
    "id": "d2-f028",
    "topic": "2.2",
    "front": "Hairpin to a VIP when client and server share a subnet?",
    "back": "Prefer split DNS. Otherwise use VIP `extintf any` and a policy for the internal interface pair with the VIP as dstaddr, **NAT enabled**."
  },
  {
    "id": "d2-f029",
    "topic": "2.3",
    "front": "LDAP bind types?",
    "back": "`simple` (default; builds DN from cnid+dn, no subtree search), `anonymous` (search with no credentials), `regular` (service account bind + subtree search, the usual choice for AD)."
  },
  {
    "id": "d2-f030",
    "topic": "2.3",
    "front": "AD `cnid` value?",
    "back": "`sAMAccountName` (or `userPrincipalName` for user@domain logins). The default is `cn`."
  },
  {
    "id": "d2-f031",
    "topic": "2.3",
    "front": "FortiOS 8.0 LDAP secure default?",
    "back": "The GUI preselects **STARTTLS** and can't disable it. CLI `secure` still defaults to `disable`. Upgrades keep existing settings. Import the private CA if needed."
  },
  {
    "id": "d2-f032",
    "topic": "2.3",
    "front": "Test an LDAP login from the CLI?",
    "back": "`diagnose test authserver ldap <server> <user> <password>`. Add `diagnose debug application fnbamd -1` for detail."
  },
  {
    "id": "d2-f033",
    "topic": "2.3",
    "front": "LDAP error 49 with AD data 52e?",
    "back": "Invalid credentials: wrong password. (525 = user not found, 532 = password expired, 533 = disabled, 775 = locked.)"
  },
  {
    "id": "d2-f034",
    "topic": "2.3",
    "front": "How are RADIUS users mapped to FortiGate groups?",
    "back": "The server returns the **Fortinet-Group-Name** VSA, and the user group's `config match` `group-name` matches it."
  },
  {
    "id": "d2-f035",
    "topic": "2.3",
    "front": "User group with a remote server member but no match entry?",
    "back": "Any user that server authenticates is a member of the group."
  },
  {
    "id": "d2-f036",
    "topic": "2.3",
    "front": "Active vs passive authentication?",
    "back": "Active prompts the user (local, LDAP, RADIUS, TACACS+, SAML). Passive learns identity silently (FSSO, RSSO)."
  },
  {
    "id": "d2-f037",
    "topic": "2.3",
    "front": "Which protocols can trigger the firewall login prompt?",
    "back": "HTTP, HTTPS, FTP, Telnet (`auth-type`). Allow DNS without authentication first. Login pages use ports 1000/1003."
  },
  {
    "id": "d2-f038",
    "topic": "2.3",
    "front": "`auth-on-demand implicitly` vs `always`?",
    "back": "`implicitly` (default): unauthenticated traffic falls through to lower non-auth policies. `always`: the first identity policy forces the prompt, which can break FSSO."
  },
  {
    "id": "d2-f039",
    "topic": "2.3",
    "front": "Default firewall authentication timeout?",
    "back": "5 minutes, `idle-timeout` type. `hard-timeout` and `new-session` are CLI only. Groups can override with `authtimeout`."
  },
  {
    "id": "d2-f040",
    "topic": "2.4",
    "front": "FSSO DC agent mode in one line?",
    "back": "`dcagent.dll` on **every** DC (reboot needed) sends logon events to the collector agent over UDP 8002."
  },
  {
    "id": "d2-f041",
    "topic": "2.4",
    "front": "Collector agent polling methods?",
    "back": "NetAPI (NetSessionEnum, fast, can miss), WinSecLog (security event log, needs auditing), WMI (event logs via WMI). No DC software."
  },
  {
    "id": "d2-f042",
    "topic": "2.4",
    "front": "Agentless FSSO polling facts?",
    "back": "`config user fsso-polling`. FortiGate reads the DC security log over TCP 445 every 10 s by default. No workstation check, no NTLM, small sites."
  },
  {
    "id": "d2-f043",
    "topic": "2.4",
    "front": "FortiGate to collector agent port?",
    "back": "TCP **8000** (`config user fsso` `port` default). TCP 8001 with SSL."
  },
  {
    "id": "d2-f044",
    "topic": "2.4",
    "front": "Logged-on user not in any monitored group?",
    "back": "Placed in the predefined **SSO_Guest_Users** group."
  },
  {
    "id": "d2-f045",
    "topic": "2.4",
    "front": "Show FSSO logons on FortiGate?",
    "back": "`diagnose debug authd fsso list`. `MemberOf` is the FortiGate group used by policies."
  },
  {
    "id": "d2-f046",
    "topic": "2.4",
    "front": "User's FSSO identity overwritten by a service account?",
    "back": "Add the account to the collector agent's **ignore user list**."
  },
  {
    "id": "d2-f047",
    "topic": "2.4",
    "front": "FSSO maps the user to the wrong IP?",
    "back": "Check DNS. The collector agent resolves the workstation name from the logon event through DNS."
  },
  {
    "id": "d2-f048",
    "topic": "2.4",
    "front": "Collector agent dead entry timeout default?",
    "back": "480 minutes (8 hours). Used when workstation verification can't reach the PC."
  },
  {
    "id": "d2-f049",
    "topic": "2.4",
    "front": "FSSO vs ZTNA identity?",
    "back": "FSSO: transparent, IP-bound AD identity. ZTNA: per-session user + device posture (EMS tags/certificates), the same on-net or off-net."
  },
  {
    "id": "d2-f050",
    "topic": "2.4",
    "front": "FortiIdentity Cloud and FortiOS 8.0?",
    "back": "Renamed FortiToken Cloud (MFA + SAML/OIDC IdP or IdP proxy). 8.0 adds `config user saml` `set type fortiidentity-cloud`, which auto-creates the SSO app."
  }
];
