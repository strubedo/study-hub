// Domain 3 — Security profiles: question bank (FortiOS 7.6).
// Original exam-style items (not brain-dump material). Options are shuffled by the app.
export default [
  {
    "id": "d3-001",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. The profile is applied to the VIP policy that publishes portal.example.com to the internet. IPS must inspect the HTTPS requests, but internet users now get certificate warnings showing the issuer Fortinet_CA_SSL. What should the administrator change?",
    "exhibit": "FGT-Hub # show firewall ssl-ssh-profile Portal-Inbound\nconfig firewall ssl-ssh-profile\n    edit \"Portal-Inbound\"\n        config https\n            set ports 443\n            set status deep-inspection\n        end\n        set server-cert-mode re-sign\n        set caname \"Fortinet_CA_SSL\"\n    next\nend",
    "options": [
      "Set server-cert-mode to replace and select the portal's own certificate (with its private key) as server-cert.",
      "Ask internet users to install Fortinet_CA_SSL as a trusted root certificate.",
      "Change status to certificate-inspection, which removes the warning and keeps payload inspection.",
      "Set untrusted-server-cert to ignore, so the re-signed certificate is presented as trusted."
    ],
    "answer": [
      0
    ],
    "explanation": "This is the **Protecting SSL Server** case: inbound clients to a server you own. With `server-cert-mode replace` and the portal's certificate and key imported as a local certificate, the FortiGate presents the **real server certificate**, so clients trust it, and still decrypts for IPS. `re-sign` is for many clients going to many unknown servers.\n\n- You can't make internet users trust your FortiGate CA.\n- Certificate inspection doesn't decrypt, so IPS can't see the requests.\n- `untrusted-server-cert` concerns the **server's** certificate validity, not whether clients trust the FortiGate CA.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-002",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A policy uses the certificate-inspection profile and a web filter with a static URL filter that blocks https://portal.example.org/games/*. Users can still open the games pages, while the rest of the site must stay reachable. What is required?",
    "options": [
      "A full (deep) inspection profile, because certificate inspection sees only the host name, not the URL path.",
      "Enable the server certificate SNI check in strict mode, so the FortiGate reads the full URL from the SNI.",
      "Change the web filter to proxy-based, because flow-based web filtering ignores static URL filters.",
      "Add the site to the SSL exemption list, so the web filter can see the URL."
    ],
    "answer": [
      0
    ],
    "explanation": "With certificate inspection the FortiGate sees only the TLS handshake: the **SNI** and the **server certificate**. The path `/games/` is inside the encrypted HTTP request, so path-based blocking needs **full inspection**.\n\n- The SNI holds only the host name; strict mode closes mismatched sessions.\n- Flow-based web filtering does support static URL filters.\n- Exempting the site does the opposite: it is never decrypted.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-003",
    "topic": "3.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. After this profile was deployed, sessions to media.example.net fail. The security team wants those sessions to work but still wants URL filtering to rate them by the real certificate rather than by the SNI the client sent. What should the administrator configure?",
    "exhibit": "config firewall ssl-ssh-profile\n    edit \"Cert-Strict\"\n        config https\n            set status certificate-inspection\n            set sni-server-cert-check strict\n        end\n    next\nend\n\nClient hello SNI ............ media.example.net\nServer certificate CN ....... *.cdn-provider.example\nServer certificate SAN ...... *.cdn-provider.example, cdn-provider.example",
    "options": [
      "set sni-server-cert-check enable",
      "set sni-server-cert-check disable",
      "set untrusted-server-cert allow",
      "set status deep-inspection"
    ],
    "answer": [
      0
    ],
    "explanation": "The SNI (`media.example.net`) doesn't match the certificate's CN or SAN, so **strict** closes the connection. With **enable** (the default), the FortiGate lets the session continue and uses the **certificate CN** for URL filtering on a mismatch, which is exactly the requirement.\n\n- `disable` turns the check off and rates by the client's SNI.\n- The certificate isn't untrusted; the problem is the name mismatch.\n- Deep inspection doesn't change how the SNI check treats mismatches.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-004",
    "topic": "3.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "Which value of `sni-server-cert-check` makes the FortiGate close the connection when the SNI doesn't match the CN or SAN of the server certificate?",
    "answer": [
      "strict",
      "set sni-server-cert-check strict"
    ],
    "explanation": "**strict** closes mismatched connections. **enable** (default) uses the certificate CN for URL filtering on a mismatch, and **disable** turns the check off.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-005",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Users trust Fortinet_CA_SSL. Which statement explains the warning on lab-nas.example.com?",
    "exhibit": "Profile: Users-Deep   (deep inspection, untrusted-server-cert allow)\n\nSite                             Issuer shown by the browser     Warning\nhttps://intranet.example.com     Fortinet_CA_SSL                  No\nhttps://wiki.example.com         Fortinet_CA_SSL                  No\nhttps://lab-nas.example.com      Fortinet_CA_Untrusted            Yes",
    "options": [
      "The NAS's own certificate isn't trusted by the FortiGate, so the FortiGate re-signed it with Fortinet_CA_Untrusted to keep the warning.",
      "Fortinet_CA_Untrusted must be installed on the clients alongside Fortinet_CA_SSL to remove the warning.",
      "The FortiGate ran out of certificate cache and fell back to its second CA for the NAS session.",
      "The NAS uses TLS 1.3, and the FortiGate re-signs TLS 1.3 sessions with Fortinet_CA_Untrusted."
    ],
    "answer": [
      0
    ],
    "explanation": "With deep inspection and `untrusted-server-cert allow` (the default), a server certificate the FortiGate doesn't trust (self-signed, missing chain) is re-signed with **Fortinet_CA_Untrusted**, so the user **still sees a warning**, as they would without the FortiGate. Fix the NAS certificate or exempt the NAS if it's known-good.\n\n- **Never** install Fortinet_CA_Untrusted on clients; it would hide every bad certificate.\n- The CA choice depends on trust, not on a cache or the TLS version.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-006",
    "topic": "3.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "According to the FortiOS 7.6 CLI Reference, which two statements about the defaults in the `config https` block of an SSL/SSH inspection profile are true? (Choose two.)",
    "options": [
      "`expired-server-cert` defaults to block.",
      "`untrusted-server-cert` defaults to allow.",
      "`revoked-server-cert` defaults to allow.",
      "`client-certificate` defaults to inspect.",
      "`min-allowed-ssl-version` defaults to tls-1.2.",
      "`cert-validation-timeout` defaults to block."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "CLI defaults in `config https`: **expired-server-cert block**, **untrusted-server-cert allow**, revoked-server-cert **block**, client-certificate **bypass**, min-allowed-ssl-version **tls-1.1**, cert-validation-timeout **allow**, cert-validation-failure block, sni-server-cert-check enable.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-007",
    "topic": "3.1",
    "type": "match",
    "difficulty": 2,
    "stem": "Deep inspection was just enabled for users. Match each symptom with its most likely cause.",
    "pairs": [
      [
        "Every HTTPS site warns, issuer Fortinet_CA_SSL",
        "Clients don't trust the FortiGate CA"
      ],
      [
        "Only one site warns, issuer Fortinet_CA_Untrusted",
        "The real server certificate isn't trusted"
      ],
      [
        "Browsers work but a mobile app can't connect",
        "The app pins its server certificate"
      ],
      [
        "A smart-card login to a partner portal fails",
        "The server requests a client certificate (mutual TLS)"
      ]
    ],
    "explanation": "Missing CA trust affects every inspected site. Fortinet_CA_Untrusted marks a genuinely untrusted server certificate. Pinned apps reject any re-signed certificate and need an exemption. Mutual TLS can't pass through a man-in-the-middle; exempt it or rely on `client-certificate bypass` (the default).",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-008",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A policy uses the certificate-inspection profile and a web filter that blocks the Gambling category. When users open a gambling site over HTTPS, they get a certificate warning instead of the FortiGate block page. Why?",
    "options": [
      "The block page is FortiGate content sent over HTTPS with a certificate signed by the FortiGate CA, which the clients don't trust.",
      "Certificate inspection can't block by category, so the browser shows the site's own certificate error.",
      "The SNI check is in strict mode, which replaces block pages with a certificate warning.",
      "Gambling sites use pinned certificates, which always produce a warning when they are blocked."
    ],
    "answer": [
      0
    ],
    "explanation": "To show a block page in an HTTPS session, the FortiGate has to present the page itself, signed by its CA (default **Fortinet_CA_SSL**). Clients that don't trust that CA show a certificate warning. Download the CA from the profile and deploy it to clients.\n\n- Certificate inspection **can** block by category (it rates the host from the SNI or certificate).\n- Strict SNI closes mismatched connections; it doesn't produce block-page warnings.\n- Pinning is an app behaviour and isn't why browsers warn here.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-009",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Users can't log in to a partner portal that authenticates them with client certificates. Other HTTPS sites work. What is the cause?",
    "exhibit": "config firewall ssl-ssh-profile\n    edit \"Users-Deep\"\n        config https\n            set ports 443\n            set status deep-inspection\n            set client-certificate block\n        end\n    next\nend",
    "options": [
      "client-certificate block drops sessions in which the server requests a client certificate; the default bypass would let them through.",
      "Deep inspection never supports client certificates, so the portal must use certificate inspection.",
      "The portal's certificate is untrusted, and untrusted certificates are blocked by default.",
      "The FortiGate requires the client certificate to be signed by Fortinet_CA_SSL."
    ],
    "answer": [
      0
    ],
    "explanation": "`client-certificate` controls sessions where the server asks for a client certificate (mutual TLS): **bypass** (default) skips inspection of that session, **inspect** inspects it, **block** drops it. This profile blocks them. Set it back to bypass, or exempt the portal.\n\n- Mutual-TLS sessions are handled by this setting; switching the whole policy to certificate inspection isn't needed.\n- Untrusted server certificates default to allow, and nothing suggests the portal's certificate is untrusted.\n- The FortiGate doesn't sign client certificates.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-010",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A penetration test sends SQL injection payloads in HTTPS POST requests to the company web server behind a VIP. The VIP policy has an IPS sensor with server-side web signatures and the certificate-inspection profile. Nothing is detected. What is the best fix?",
    "options": [
      "Apply an SSL/SSH profile that protects the SSL server, using the web server's certificate, to the VIP policy.",
      "Apply the deep-inspection profile with Fortinet_CA_SSL to the VIP policy.",
      "Change the IPS sensor to client-side signatures, because the attack payload comes from a client.",
      "Enable strict SNI checking, so the FortiGate can read the POST body from the client hello."
    ],
    "answer": [
      0
    ],
    "explanation": "Code injection in HTTPS requests is invisible without decryption. For **your own** server, the right profile is **Protecting SSL Server** (`server-cert-mode replace`) with the server's certificate: the IPS sees the decrypted requests and clients still see the real certificate.\n\n- Re-signing with Fortinet_CA_SSL would decrypt, but every internet client would get a certificate warning.\n- Attacks against servers match **server**-target signatures.\n- The client hello holds no POST data.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-011",
    "topic": "3.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "A privacy requirement allows only certificate inspection for user traffic. Which two controls still work for HTTPS? (Choose two.)",
    "options": [
      "Blocking HTTPS sites by FortiGuard category, using the SNI or the certificate",
      "Closing sessions whose SNI doesn't match the server certificate (strict SNI check)",
      "Blocking one path of a site while allowing the rest of the site",
      "Scanning files downloaded over HTTPS for malware",
      "Detecting SQL injection in HTTPS POST bodies"
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Certificate inspection examines the handshake only, so it supports **host and category decisions** and the **SNI check**. Paths, file contents and request bodies are inside the encrypted stream, so URL-path filtering, antivirus and payload IPS need full inspection.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-012",
    "topic": "3.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. Users roam between sites, and deep inspection must not cause certificate warnings anywhere. What is the best design?",
    "exhibit": "Estate ......... 300 branch FortiGates and an FGCP pair (FGT-A/FGT-B) at HQ\nInspection ..... deep inspection on all user policies\nCA certificate . Fortinet_CA_SSL on every FortiGate (the factory-generated CA of each unit)\nClients ........ domain-joined, trust the company root CA (ACME-Root-CA)",
    "options": [
      "Issue a subordinate CA certificate from ACME-Root-CA, import it on the FortiGates and use it as the inspection CA.",
      "Export every FortiGate's Fortinet_CA_SSL and push all of them to the clients by group policy.",
      "Install Fortinet_CA_Untrusted on the clients, because it is the same on every FortiGate.",
      "Switch to certificate inspection at the branches and keep deep inspection only at HQ."
    ],
    "answer": [
      0
    ],
    "explanation": "The documented best practice is for the FortiGate to sign with a **subordinate CA issued by the company's private CA**. Clients already trust ACME-Root-CA, so every FortiGate using that subordinate CA is trusted wherever the user roams, with nothing new to distribute.\n\n- Pushing hundreds of per-unit Fortinet_CA_SSL certificates works but is the hard way and grows with every new FortiGate.\n- Never install Fortinet_CA_Untrusted on clients.\n- Dropping deep inspection at branches breaks the stated requirement.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-013",
    "topic": "3.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. How does the FortiGate handle HTTPS sessions to api.pinned-app.example on a policy that uses Users-Deep?",
    "exhibit": "config firewall wildcard-fqdn custom\n    edit \"pinned-app\"\n        set wildcard-fqdn \"*.pinned-app.example\"\n    next\nend\nconfig firewall ssl-ssh-profile\n    edit \"Users-Deep\"\n        config https\n            set status deep-inspection\n        end\n        config ssl-exempt\n            edit 1\n                set type wildcard-fqdn\n                set wildcard-fqdn \"pinned-app\"\n            next\n        end\n    next\nend",
    "options": [
      "They are exempt from deep inspection, so the app receives the server's real certificate.",
      "They are decrypted and re-signed with Fortinet_CA_Untrusted.",
      "They are blocked, because exempted destinations can't be reached with deep inspection.",
      "They are decrypted, but no security profiles are applied to them."
    ],
    "answer": [
      0
    ],
    "explanation": "An **SSL exemption** (`config ssl-exempt`, here by wildcard FQDN) means matching sessions **aren't decrypted**. The app gets the real server certificate, which is how you keep certificate-pinned apps working under deep inspection.\n\n- Fortinet_CA_Untrusted is used for **untrusted** server certificates during inspection, not for exemptions.\n- Exemptions allow the traffic, they don't block it.\n- Exempted traffic isn't decrypted at all.",
    "lesson": "3.1-ssl-inspection-design"
  },
  {
    "id": "d3-014",
    "topic": "3.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which signatures does entry 2 include?",
    "exhibit": "config ips sensor\n    edit \"Bulletin-Oct\"\n        config entries\n            edit 1\n                set cve \"cve-2024-3400\"\n                set status enable\n                set action block\n            next\n            edit 2\n                set cve \"cve-2017\"\n                set action reset\n            next\n        end\n    next\nend",
    "options": [
      "Every signature tagged with any 2017 CVE ID, including signatures for those CVEs added in later updates.",
      "Only signatures released by FortiGuard during 2017.",
      "Only signatures last modified in 2017.",
      "Only the signature for a CVE whose full ID is exactly CVE-2017."
    ],
    "answer": [
      0
    ],
    "explanation": "The CVE option accepts a full CVE ID or a **wildcard by year**. `cve-2017` includes every signature tagged with a 2017 CVE. Because it's a filter, signatures FortiGuard adds later for those CVEs are included automatically after an update.\n\n- Release or modification dates aren't what the CVE filter matches; date filtering is the separate `last-modified` option.\n- There's no CVE with the bare ID CVE-2017.",
    "lesson": "3.2-ips-sensor-design"
  },
  {
    "id": "d3-015",
    "topic": "3.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which IPS filter entry gives WEB-01 the best protection with the least inspection overhead?",
    "exhibit": "Asset    Zone   OS      Service           Published as\nWEB-01   DMZ    Linux   HTTPS (nginx)     VIP 203.0.113.80:443 -> 10.30.0.80:443\n(The VIP policy uses an SSL/SSH profile that protects WEB-01's certificate.)",
    "options": [
      "Target server, OS Linux, protocol HTTP, severity medium/high/critical, action block",
      "Target client, OS Linux, protocol HTTP, severity medium/high/critical, action block",
      "Target server, OS Windows, protocol SMB, severity high/critical, action block",
      "All signatures of every target, OS and protocol, action block"
    ],
    "answer": [
      0
    ],
    "explanation": "Inbound attacks on a web server match **server-target** signatures for its **OS** and **protocol** (the decrypted HTTPS is inspected as HTTP). A tight filter means fewer signatures per packet, which is **better performance and fewer false positives**.\n\n- Client-target signatures protect browsers and endpoints, not servers.\n- Windows/SMB signatures don't apply to a Linux web server.\n- Every signature adds overhead and false positives for no gain on this asset.",
    "lesson": "3.2-ips-sensor-design"
  },
  {
    "id": "d3-016",
    "topic": "3.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. 10.20.0.15 is the monitoring server, which polls 10.20.0.40 every night; the security team confirmed the traffic is benign. What is the best fix?",
    "exhibit": "date=2026-10-27 time=02:00:04 logid=\"0419016384\" type=\"utm\" subtype=\"ips\"\neventtype=\"signature\" level=\"alert\" vd=\"root\" severity=\"medium\"\nsrcip=10.20.0.15 dstip=10.20.0.40 srcintf=\"port3\" dstintf=\"port4\" policyid=7\nsessionid=88123 action=\"dropped\" proto=6 service=\"HTTP\"\nattack=\"Example.Monitor.Probe.Anomaly\" attackid=44120 profile=\"DC-Servers\"",
    "options": [
      "In DC-Servers, add a signature entry for attack ID 44120 above the filter entries, keep it blocking, and add an exempt IP pair with source 10.20.0.15 and destination 10.20.0.40.",
      "Remove the IPS sensor from policy 7.",
      "Change every entry in DC-Servers to action monitor.",
      "Enable fail-open under config ips global."
    ],
    "answer": [
      0
    ],
    "explanation": "Fix false positives with the **narrowest** exception. **Exempt IPs** (source and destination pairs) are configured on a **signature** entry, so add an entry for this one signature, ordered above the filter that also includes it, and exempt only the monitoring server talking to that host. Every other source is still blocked by the same signature.\n\n- Removing the sensor or monitoring everything drops protection for all traffic on the policy.\n- `fail-open` decides what happens when the IPS buffer is full; it doesn't exempt signatures.",
    "lesson": "3.2-ips-sensor-design"
  },
  {
    "id": "d3-017",
    "topic": "3.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "Under `config ips global`, which setting (default disable) lets traffic pass uninspected instead of being blocked when the IPS buffer is full?",
    "answer": [
      "fail-open",
      "set fail-open enable",
      "fail-open enable"
    ],
    "explanation": "`fail-open` defaults to **disable**: when the IPS buffer is full, traffic is blocked. Enabling it trades security for availability. A segment that must fail closed (PCI, for example) keeps the default.",
    "lesson": "3.2-ips-sensor-design"
  },
  {
    "id": "d3-018",
    "topic": "3.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about security profiles and FortiGate performance are true? (Choose two.)",
    "options": [
      "Sessions that need proxy-based inspection can't be offloaded to NP processors.",
      "With NTurbo, sessions with flow-based security profiles can be offloaded to the NP.",
      "Certificate inspection costs more CPU than deep inspection, because it validates every certificate.",
      "The number of signatures in an IPS sensor has no effect on performance.",
      "In flow mode, deep inspection scans only the ports listed in the protocol port mapping."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "Proxy-based features keep sessions on the CPU, so those sessions **aren't NP-offloaded**. **NTurbo** (`np-accel-mode basic`, the default on models that support it) offloads the firewall and NAT work of sessions with **flow-based** profiles to NP6/NP7 processors, with a data path from the ingress interface to the IPS engine and on to the egress interface.\n\n- Deep inspection (decrypt, inspect, re-encrypt) is far more expensive than certificate inspection.\n- Larger sensors mean more pattern matching; tight sensors are a performance tool.\n- In flow mode, deep inspection scans **all** ports whatever the port mapping.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-019",
    "topic": "3.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. CPU use rose sharply after deep inspection was enabled on the proxy-based policy for branch users. Most of the volume is Office 365 and backups to a cloud storage service. Which change reduces the load most while keeping deep inspection for general browsing?",
    "exhibit": "FGT-Hub # get system performance status\nCPU states: 3% user 84% system 0% nice 13% idle 0% iowait 0% irq 0% softirq\nMemory: 8165140k total, 5307341k used (65.0%), 2449542k free (30.0%), 408257k freeable (5.0%)\nAverage sessions: 212480 sessions in 1 minute\n\nFGT-Hub # diagnose sys top 2 10\nRun Time:  12 days, 3 hours and 41 minutes\n3U, 0N, 84S, 13I, 0WA, 0HI, 0SI, 0ST; 7973T, 2392F\n          wad     2817      R      71.2     5.9    1\n    ipsengine     2790      S       9.4     4.1    0\n       newcli     5531      R       0.4     0.1    2",
    "options": [
      "Add policies above it that match Office 365 and the backup service by ISDB, with certificate inspection and light profiles.",
      "Increase engine-count under config ips global.",
      "Enable fail-open under config ips global.",
      "Replace the deep-inspection profile with no-inspection on every policy."
    ],
    "answer": [
      0
    ],
    "explanation": "The busy process is **wad**, which does the proxy and SSL work; the IPS engine is at 9%. The cheapest big win is to stop decrypting trusted, high-volume SaaS: match it at policy lookup with **ISDB** in policies above the general one, with certificate inspection, and keep deep inspection for the rest.\n\n- More IPS engines don't help when the IPS engine isn't the bottleneck (and `engine-count 0` already sizes them to the CPU).\n- `fail-open` doesn't reduce load.\n- No inspection everywhere removes the protection the design requires.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-020",
    "topic": "3.2",
    "type": "single",
    "difficulty": 2,
    "stem": "An SD-WAN rule must send Microsoft 365 traffic to the internet underlays from the first packet of each session, before any application has been identified. Which destination criterion should the rule use?",
    "options": [
      "An Internet Service (ISDB) object for the Microsoft service",
      "An application control signature for Microsoft 365",
      "A FortiGuard web filter category",
      "An IPS signature filter for Microsoft applications"
    ],
    "answer": [
      0
    ],
    "explanation": "**ISDB** objects match on destination IP, protocol and port from FortiGuard's database, so they decide on the **first packet**. Application signatures need a few packets before the application is identified, web filter categories are URL ratings, and IPS isn't a steering criterion.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-021",
    "topic": "3.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Refer to the exhibit. Which statement is true for a new HTTPS session from Branch-LAN to an Office 365 server?",
    "exhibit": "ID  Name          Source       Destination                    SSL/SSH profile          Profiles\n20  O365-Direct   Branch-LAN   ISDB Microsoft-Office365       certificate-inspection   IPS protect_client\n21  Web-General   Branch-LAN   all                            Users-Deep               IPS, App Control, Web Filter\n(Policy 20 is above policy 21.)",
    "options": [
      "It matches policy 20 at policy lookup, so it isn't decrypted.",
      "Application control on policy 21 identifies it first and then moves it to policy 20.",
      "It matches policy 20, but is decrypted because IPS needs deep inspection to run.",
      "It matches policy 21, because ISDB objects can be used only in SD-WAN rules."
    ],
    "answer": [
      0
    ],
    "explanation": "ISDB objects are matched at **policy lookup**, on the first packet, so the session hits policy 20 and gets **certificate inspection** (no decryption) plus client IPS on what is visible. That is the point of the design: trusted, high-volume SaaS skips deep inspection.\n\n- Application control doesn't move sessions between policies.\n- IPS runs with certificate inspection too; it just can't see encrypted payloads.\n- ISDB objects work in firewall policies (as destination and as source) as well as in SD-WAN rules.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-022",
    "topic": "3.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each control with what it decides on.",
    "pairs": [
      [
        "Internet Service Database",
        "Destination or source IP, protocol and port, at policy lookup"
      ],
      [
        "Application control",
        "L7 application signatures, after a few packets"
      ],
      [
        "Web filter",
        "URL and FortiGuard category"
      ],
      [
        "IPS",
        "Exploit and anomaly signatures throughout the session"
      ]
    ],
    "explanation": "ISDB is the cheapest and earliest (first packet, L3/L4). Application control identifies applications at L7. Web filter rates URLs and categories. IPS looks for exploits and anomalies for the life of the session.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-023",
    "topic": "3.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "A supplier's ordering site is blocked because FortiGuard rates it in a blocked category. Which two actions fix this false positive without weakening the category policy? (Choose two.)",
    "options": [
      "Create a local rating override that puts the site in an allowed category.",
      "Submit a rerating request for the site to FortiGuard.",
      "Change the blocked category to allow in the web filter profile.",
      "Remove the web filter from the policy.",
      "Set the SSL/SSH profile to no-inspection on the policy."
    ],
    "answer": [
      0,
      1
    ],
    "explanation": "A **local rating override** fixes the one site immediately, and a **rerating request** gets FortiGuard to correct the rating for everyone. Both leave the category policy untouched.\n\n- Allowing the category or removing the web filter weakens the policy for every site.\n- Turning SSL inspection off doesn't correct the rating and removes the protection the inspection profile gives.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-024",
    "topic": "3.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Refer to the exhibit. A site needs 1.5 Gbps of internet traffic inspected with IPS, application control and antivirus. SSL inspection isn't used. Which model should the architect choose?",
    "exhibit": "Datasheet extract           Model X     Model Y\nFirewall throughput         10 Gbps     27 Gbps\nIPS throughput              2.6 Gbps    5.0 Gbps\nNGFW throughput             1.6 Gbps    3.5 Gbps\nThreat protection           1.4 Gbps    3.1 Gbps\n\nNotes: NGFW = firewall + IPS + application control.\nThreat protection = firewall + IPS + application control + malware protection.",
    "options": [
      "Model Y, because the threat protection figure applies and Model X offers only 1.4 Gbps.",
      "Model X, because its NGFW throughput of 1.6 Gbps exceeds the requirement.",
      "Model X, because its IPS throughput of 2.6 Gbps exceeds the requirement.",
      "Model X, because its firewall throughput of 10 Gbps exceeds the requirement."
    ],
    "answer": [
      0
    ],
    "explanation": "Size on the profile set the site will run. IPS + application control + antivirus is the **threat protection** figure (per the datasheet notes). Model X offers 1.4 Gbps, below the 1.5 Gbps required; Model Y offers 3.1 Gbps.\n\n- NGFW leaves out malware protection, IPS leaves out application control and AV, and firewall throughput has no inspection at all.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-025",
    "topic": "3.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "In an IPS sensor entry (`config ips sensor` > `config entries`), which option selects signatures by CVE ID or by a CVE year wildcard?",
    "answer": [
      "cve",
      "set cve"
    ],
    "explanation": "`set cve \"cve-2021-44228\"` selects the signatures tagged with that CVE; `set cve \"cve-2017\"` selects every signature tagged with a 2017 CVE. The entry still needs a sensible action and status.",
    "lesson": "3.2-ips-sensor-design"
  },
  {
    "id": "d3-026",
    "topic": "3.2",
    "type": "fill",
    "difficulty": 2,
    "stem": "Which FortiOS diagnose command shows whether the FortiGate is in memory conserve mode and the thresholds it uses?",
    "answer": [
      "diagnose hardware sysinfo conserve",
      "diag hardware sysinfo conserve",
      "diag hard sys conserve"
    ],
    "explanation": "`diagnose hardware sysinfo conserve` shows the conserve mode state, memory use and the extreme, red and green thresholds (defaults 95%, 88% and 82% of RAM). In conserve mode, proxy-based inspection follows `av-failopen` (default `pass`, which bypasses the AV proxy) and flow-based inspection follows IPS `fail-open` (default `disable`, which drops new sessions that need flow inspection), so a memory-starved FortiGate changes how it inspects traffic.",
    "lesson": "3.2-layered-profiles-performance"
  },
  {
    "id": "d3-027",
    "topic": "3.2",
    "type": "order",
    "difficulty": 2,
    "stem": "Place the steps for handling a suspected IPS false positive in order.",
    "items": [
      "Read the IPS log for the attack name and ID, source, destination and policy.",
      "Confirm with the application owner that the traffic is legitimate.",
      "Add the narrowest exception: exempt IPs or a per-signature entry for that sensor.",
      "Verify in the logs that the traffic now passes and other traffic is still inspected.",
      "Report the false positive to FortiGuard so the signature can be fixed."
    ],
    "explanation": "Identify the signature from the log, confirm it's benign, add the narrowest exception (exempt IP pair or a per-signature entry rather than removing the sensor), verify, and report it to FortiGuard.",
    "lesson": "3.2-ips-sensor-design"
  }
];
