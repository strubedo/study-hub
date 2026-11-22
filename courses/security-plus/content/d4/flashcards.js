// Domain 4 — Security Operations. Original flashcards (sources as in lessons.js).
let n = 0;
const c = (topic, front, back) => ({ id: `d4-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 4.1
  c('4.1', 'Honeypot vs honeynet vs honeyfile vs honeytoken vs canary account?', 'Decoy system; network of decoys; decoy file; decoy data or credential (fake key, record); decoy user account. All detective, very few false positives.'),
  c('4.1', 'Allow list vs block list (application control)?', 'Allow list: deny by default, run only approved software (stops unknown malware). Block list: allow by default, block known-bad only.'),
  c('4.1', 'Hardening (NIST)?', 'A process to eliminate a means of attack by patching vulnerabilities and turning off nonessential services; in practice apply a baseline (CIS, STIG), remove defaults.'),
  c('4.1', 'Usual compensating control for an unpatchable system?', '**Segmentation**: isolate it in its own zone and allow only the required peers and protocols.'),
  c('4.1', 'IDS vs IPS?', 'IDS: out of band (SPAN/TAP), alerts. IPS: inline, can drop or reset traffic; its false positives block legitimate traffic.'),
  c('4.1', 'Fail-open vs fail-closed?', 'Fail-open: a failed inline device passes traffic uninspected (availability). Fail-closed: it blocks traffic (security).'),
  c('4.1', 'NIDS/NIPS vs HIDS/HIPS vs WIPS?', 'Network sensor for a segment; agent on one host (sees decrypted and local activity); wireless sensors for rogue APs, evil twins and deauth attacks.'),
  c('4.1', 'False positive vs false negative?', 'False positive: alert on benign activity. False negative: real attack, no alert (the more dangerous one).'),
  c('4.1', 'Stateful firewall vs NGFW vs WAF vs UTM?', 'Stateful: Layer 4 + session table. NGFW: adds Layer 7 app/user ID, IPS, TLS inspection. WAF: protects one web app (HTTP). UTM: many functions in one box.'),
  c('4.1', 'How are firewall rules processed?', 'Top-down, first match wins, implicit deny at the end. A broad rule above a specific one shadows it.'),
  c('4.1', 'Content filter: centralized proxy vs agent-based?', 'Proxy: policy in one place, only for traffic that reaches it. Agent: policy on the device, follows it to any network.'),
  c('4.1', 'Antivirus vs EDR vs XDR?', 'AV: files, known-bad. EDR: endpoint behavior telemetry, investigation, isolation. XDR: correlates endpoint, email, identity, network, cloud and responds across them.'),
  c('4.1', '802.1X roles?', '**Supplicant** (client; RFC 3748 "peer"), **authenticator** (switch/AP, relays EAP), **authentication server** (RADIUS, UDP 1812).'),
  c('4.1', 'RADIUS attributes for 802.1X VLAN assignment (RFC 3580)?', '`Tunnel-Type=VLAN (13)`, `Tunnel-Medium-Type=802`, `Tunnel-Private-Group-ID=<VLAN ID>` in the Access-Accept.'),
  c('4.1', 'Captive portal?', 'Redirects a new client\'s browser to a login, registration or AUP page before granting access; typical for guests; does not encrypt the link.'),
  c('4.1', 'Endpoint posture check: agent-based vs agentless?', 'Agent: persistent, deep, continuous on managed devices. Agentless: dissolvable agent, scan or MDM/EDR query for BYOD/contractors. Non-compliant goes to remediation VLAN.'),
  c('4.1', 'Secret found in a pushed commit: first step?', '**Revoke or rotate** it, then remove it from history and move it to a secrets manager. History and clones keep the old value.'),
  c('4.1', 'Secure, HttpOnly, SameSite?', '`Secure`: HTTPS only. `HttpOnly`: hidden from scripts (XSS theft). `SameSite=Strict/Lax`: withheld on cross-site requests (CSRF defense in depth).'),
  c('4.1', 'Code signing proves what?', 'Who published the code and that it is unmodified since signing. It does not prove the code is safe.'),
  c('4.1', 'SPF checks which identity?', 'The **RFC 5321.MailFrom** (envelope/return-path) domain, optionally HELO; not the visible From header.'),
  c('4.1', 'SPF qualifiers and the lookup limit?', '`+` pass (default), `-` fail, `~` softfail, `?` neutral. Max **10** DNS-querying terms (include, a, mx, ptr, exists, redirect), else **permerror**.'),
  c('4.1', 'Where is a DKIM public key published?', 'TXT record at `<selector>._domainkey.<domain>`, from the `s=` and `d=` tags. DKIM signs selected headers (From required) and the body.'),
  c('4.1', 'DMARC pass condition?', 'SPF **or** DKIM passes **and** its domain aligns with the RFC 5322.From domain (relaxed: same organizational domain; strict: exact).'),
  c('4.1', 'DMARC tags p, sp, rua, ruf?', '`p=` none/quarantine/reject; `sp=` subdomain policy; `rua=` aggregate reports; `ruf=` failure (forensic) reports. Record at `_dmarc.<domain>`.'),
  c('4.1', 'What replaced RFC 7489?', '**RFC 9989** (Standards Track, May 2026), with RFC 9990/9991 for reports: `pct` historic, new `t=` test flag and `np=`, DNS tree walk.'),
  c('4.1', 'BIMI requirements?', 'DMARC at enforcement (quarantine/reject, no pct < 100), SVG Tiny P/S logo, TXT at `default._bimi.<domain>`; optional VMC (trademark) or CMC.'),
  c('4.1', 'Group Policy processing order?', 'Local, site, domain, OU (parent then child); last applied wins. Block Inheritance stops parents; **Enforced** links cannot be blocked.'),
  c('4.1', 'SELinux modes and the right fix for a denial?', 'Enforcing, permissive (log only), disabled. Fix the label (`semanage fcontext` + `restorecon`) or a boolean (`setsebool -P`); do not disable it.'),

  // 4.2
  c('4.2', 'Asset management life cycle stages?', 'Planning/scoping, acquisition/procurement, assignment/accounting, monitoring/asset tracking, disposal/decommissioning.'),
  c('4.2', 'SP 800-88 Rev. 2 sanitization methods?', '**Clear** (logical, vs simple recovery), **purge** (infeasible even in a lab: crypto erase, sanitize command), **destroy** (shred, incinerate). Document with a certificate.'),
  c('4.2', 'Why is overwriting unreliable on SSDs?', 'Wear leveling and spare blocks keep old data where host writes cannot reach; use purge (sanitize/crypto erase) or destroy.'),

  // 4.3
  c('4.3', 'Vulnerability management cycle?', 'Identify, prioritize, remediate, verify, report.'),
  c('4.3', 'Credentialed vs non-credentialed scan?', 'Credentialed logs in and reads installed versions: accurate. Non-credentialed sees the outside view, infers from banners: more false positives.'),
  c('4.3', 'IPAM and CSPM in vulnerability management?', 'IPAM: scan scope and address ownership. CSPM: continuous checks of cloud configuration (public buckets, open security groups) via provider APIs.'),
  c('4.3', 'SP 800-40 Rev. 4 risk responses?', 'Accept, mitigate (patch, workaround, controls), transfer (insurance, SaaS), avoid (uninstall, decommission).'),
  c('4.3', 'Bounty program vs responsible disclosure policy?', 'Disclosure policy: how to report, scope, safe harbor, response times. Bounty adds payment. `security.txt` (RFC 9116) names the contact.'),

  // 4.4
  c('4.4', 'Alert tuning without creating blind spots?', 'Narrow exceptions (one account, host, window), baseline thresholds, correlation, enrichment, periodic review. Never disable a rule wholesale.'),
  c('4.4', 'SPAN/port mirroring vs TAP?', 'SPAN copies switch traffic to a monitor port and can drop under load. A TAP passively copies everything on a link. Both are out of band.'),
  c('4.4', 'NetFlow/IPFIX vs packet capture?', 'Flows: unidirectional metadata (IPs, ports, bytes, times), no payload, long periods. Pcap: full packets, short periods.'),
  c('4.4', 'IPFIX facts?', 'RFC 7011, version number 10, SCTP/TCP/UDP port **4739** (4740 with TLS/DTLS); built on NetFlow v9 templates (RFC 3954).'),
  c('4.4', 'SNMP ports and v3 security levels?', 'UDP **161** agent, UDP **162** traps/informs. v3 levels: noAuthNoPriv, authNoPriv, **authPriv** (USM authentication + encryption).'),
  c('4.4', 'Syslog severities 0-7?', '0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, 7 Debug. PRI = facility x 8 + severity.'),
  c('4.4', 'Syslog transports and ports?', 'UDP **514** (RFC 5426); TLS on TCP **6514** (RFC 5425); plain TCP (RFC 6587, Historic) has no port of its own.'),
  c('4.4', 'SCAP components (SP 800-126 Rev. 3)?', 'XCCDF checklists, OVAL tests, OCIL questions; ARF and Asset Identification reports; CPE, SWID, CCE, CVE identifiers; CVSS, CCSS scores; TMSAD integrity.'),

  // 4.5
  c('4.5', 'SAML vs OAuth vs OIDC?', 'SAML: signed XML assertions (authN + attributes) IdP to SP. OAuth 2.0: authorization, access tokens with scopes. OIDC: identity layer on OAuth, ID token (JWT).'),
  c('4.5', 'OAuth 2.0 roles (RFC 6749)?', 'Resource owner, client, authorization server (issues tokens), resource server (API). RFC 9700: no implicit grant, never password grant; use code + PKCE.'),
  c('4.5', 'LDAP ports and role in SSO?', 'Directory protocol: TCP/UDP **389**, LDAPS **636** (or StartTLS). Often the user store behind an IdP; simple binds need TLS.'),
  c('4.5', 'Emergency access (break-glass) account controls?', 'Vaulted long random credential, excluded from policies that could lock it out, alert on every use, tested regularly.'),
  c('4.5', 'HOTP vs TOTP?', 'HOTP (RFC 4226): counter-based. TOTP (RFC 6238): time-based, 30-second default step. Both typed, so not phishing-resistant.'),
  c('4.5', 'Phishing-resistant MFA (SP 800-63B-4)?', 'Cryptographic authenticators with channel binding (PIV/CAC client TLS) or verifier name binding (FIDO2/WebAuthn, passkeys). OTP and push are not.'),
  c('4.5', 'Rule-based vs role-based access control?', 'Role-based: permissions by job role. Rule-based: the same rules for every request (ACLs, country blocks), regardless of role.'),
  c('4.5', 'MAC vs DAC (NIST)?', 'MAC: central authority, labels and clearances, users cannot change. DAC: the owner decides who gets access.'),
  c('4.5', 'Just-in-time access?', 'Privilege granted on request, often with approval, for a limited time, then removed automatically; no standing admin rights.'),
  c('4.5', 'SP 800-63B-4 password rules?', 'Min **15** characters single-factor (8 with MFA), allow 64+, **no composition rules**, **no periodic changes**, blocklist check, allow managers and paste.'),
  c('4.5', 'Minimum password age vs password history?', 'History blocks reusing the last N passwords; minimum age stops users cycling through N changes at once to get an old one back.'),
  c('4.5', 'Synced vs device-bound passkeys?', 'Synced: copied across a user\'s devices via a cloud credential manager. Device-bound: never leave one device (e.g. a FIDO key). Synced are not allowed at AAL3.'),

  // 4.6
  c('4.6', 'Automation vs orchestration?', 'Automation: one task without a person. Orchestration: coordinated workflow across tools (SOAR playbooks).'),
  c('4.6', 'Automation guardrails?', 'Human approval for high-impact actions, protected never-touch lists, rate caps, kill switch, monitor-only rollout.'),
  c('4.6', 'Four AI capabilities in the objectives?', 'Agentic (plans and acts with tools), chatbot (conversation), predictive analysis (forecasting), AI-augmented baselines (learned normal behavior, UEBA).'),

  // 4.7
  c('4.7', 'IR activities in the objectives\' order?', 'Preparation, identification, investigation, containment, negotiation, eradication/recovery, notification/external reporting, post-incident.'),
  c('4.7', 'SP 800-61 Rev. 3 mapping?', 'CSF 2.0 Profile: preparation = Govern/Identify/Protect; detection = Detect; response = Respond/Recover; lessons = Identify (Improvement, ID.IM).'),
  c('4.7', 'Tabletop vs simulation?', 'Tabletop: discussion of a scenario, no systems touched. Simulation: hands-on exercise with injected or simulated attack activity.'),
  c('4.7', 'Chain of custody (NIST)?', 'Tracks evidence through collection, safeguarding and analysis by documenting each handler, date/time of each transfer and its purpose.'),
  c('4.7', 'GDPR breach notification to the authority?', 'Article 33: without undue delay and, where feasible, within **72 hours** of becoming aware, unless unlikely to result in risk.'),

  // 4.8
  c('4.8', 'Order of volatility (RFC 3227)?', 'Registers/cache; routing, ARP, process table, memory; temp file systems; disk; remote logs; physical config/topology; archival media.'),
  c('4.8', 'Memory dump vs bit-level copy vs snapshot?', 'RAM contents (processes, keys); every bit of the media incl. deleted and slack space; point-in-time VM or volume state.'),
  c('4.8', 'Windows event IDs 4720, 4728, 4732, 4672, 4688, 1102?', 'Account created; added to global security group; added to local security group; special privileges at logon; process created; audit log cleared.'),
  c('4.8', 'Stakeholders in 4.8?', 'HR (employee matters), accounts (finance: payment fraud, funds), legal (holds, privilege, notification, court).'),
  c('4.8', 'Count failed SSH logons per IP?', '`grep "Failed password" auth.log | awk \'{print $(NF-3)}\' | sort | uniq -c | sort -rn`'),
];
