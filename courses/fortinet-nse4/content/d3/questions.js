// Domain 3 — Content inspection question bank (generated from structured source; edit with care).
export default [
  {
    id: "d3-001",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The web filter profile WF-Staff uses URL filter table 1. Users can still open https://www.example.com/games/index.html. Why is the URL filter entry not blocking the page?",
    exhibit: String.raw`FGT-HQ # show firewall policy 10
config firewall policy
    edit 10
        set name "LAN-to-Internet"
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "LAN-10.0.1.0"
        set dstaddr "all"
        set schedule "always"
        set service "HTTP" "HTTPS" "DNS"
        set utm-status enable
        set ssl-ssh-profile "certificate-inspection"
        set webfilter-profile "WF-Staff"
        set logtraffic all
        set nat enable
    next
end

FGT-HQ # show webfilter urlfilter 1
config webfilter urlfilter
    edit 1
        set name "Staff-URLs"
        config entries
            edit 1
                set url "www.example.com/games/*"
                set type wildcard
                set action block
            next
        end
    next
end`,
    options: ["With certificate inspection FortiGate only sees the hostname (SNI), so an entry that matches on the URL path can never match HTTPS traffic", "Wildcard entries cannot contain a path; the entry must be changed to type regex", "Static URL filtering requires a FortiGuard Web Filtering licence", "The web filter profile must use the proxy feature set before it can match HTTPS URLs"],
    answer: [0],
    explanation: "Policy 10 uses the read-only `certificate-inspection` profile. FortiGate never decrypts the session, so the only name it sees is the hostname from the SNI (or the certificate CN). The path `/games/...` is inside the encrypted HTTP request, so `www.example.com/games/*` cannot match. Use a deep inspection profile, or block the whole hostname.\n\n- Wildcard entries can include paths. Changing the type to regex would not help while the path is still encrypted.\n- The static URL filter is a local feature and needs no FortiGuard licence.\n- Flow-mode web filter profiles support static URL filtering. The problem is visibility, not the feature set.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-002",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Users who browse through a full SSL inspection profile get a certificate warning on one internal site only. All other HTTPS sites work without warnings. What is the most likely cause?",
    exhibit: String.raw`Browser certificate details (client 10.0.1.41)
  Site:                 https://intranet.training.lab
  Subject CN:           intranet.training.lab
  Issuer (FortiGate CA): Fortinet_CA_Untrusted
  Trusted by client:    No

SSL/SSH inspection profile on the matching policy
  Inspection method:          Full SSL inspection
  CA certificate:             Fortinet_CA_SSL (installed on all clients)
  Untrusted SSL certificates: Allow`,
    options: ["The real certificate of intranet.training.lab failed validation on the FortiGate (for example self-signed or issued by a private CA the FortiGate does not trust), so FortiGate re-signed it with Fortinet_CA_Untrusted", "The client does not have Fortinet_CA_SSL in its trusted root store", "The site is exempted from SSL inspection, so the user sees the server's real self-signed certificate", "Server certificate SNI check is set to strict and the SNI did not match"],
    answer: [0],
    explanation: "FortiGate re-signs with `untrusted-caname` (Fortinet_CA_Untrusted) when the real server certificate is not trusted and the action is **Allow** (Keep Untrusted & Allow). The browser warning is intentional: it tells the user the original certificate was bad. The fix is to give the server a proper certificate, or to import its issuing CA into the FortiGate's trusted CAs.\n\n- Fortinet_CA_SSL is installed and every other site works, so the endpoint CA is not the problem.\n- An exempted site would show the server's own issuer, not a FortiGate CA.\n- A strict SNI mismatch closes the connection; it does not re-sign with the untrusted CA.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-003",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "An administrator needs a full SSL inspection profile with additional HTTPS ports and a custom exemption list, and wants to start from a built-in profile that can be edited directly. Which built-in profile can be modified?",
    options: ["custom-deep-inspection", "deep-inspection", "certificate-inspection", "no-inspection"],
    answer: [0],
    explanation: "`custom-deep-inspection` is the built-in profile that can be edited. `deep-inspection`, `certificate-inspection` and `no-inspection` are read-only. To change one of them, clone it or create a new profile. The 8.0 documentation's own examples clone `deep-inspection` to add ports.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-004",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "A company enables full SSL inspection for outbound traffic. Managed Windows laptops must not show certificate warnings for legitimate sites. Which two actions achieve this? (Choose two.)",
    options: ["Download the CA certificate used by the profile (Fortinet_CA_SSL) and deploy it to the laptops' Trusted Root Certification Authorities store with Group Policy", "Import a subordinate CA certificate and private key issued by the corporate PKI into the FortiGate, and set it as the profile's caname", "Deploy Fortinet_CA_Untrusted to the laptops together with Fortinet_CA_SSL", "Set server-cert-mode replace and upload a public certificate for the FortiGate", "Set untrusted-server-cert ignore in the profile", "Disable the server certificate SNI check"],
    answer: [0, 1],
    explanation: "The endpoint has to trust the CA that signs the re-signed certificates. You can either push the FortiGate's own CA (Fortinet_CA_SSL) to the trusted root store, or make the FortiGate sign with a subordinate CA that chains to a root the laptops already trust (`set caname`).\n\n- Fortinet_CA_Untrusted must never be installed. It exists to keep warnings for bad server certificates.\n- `replace` mode presents one uploaded certificate. It is meant for protecting your own server, not for re-signing arbitrary internet sites.\n- `ignore` only affects servers whose certificate is untrusted. It does nothing for missing endpoint trust and hides real problems.\n- The SNI check is unrelated to the CA warning.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-005",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The profile is a full SSL inspection profile, and every client trusts the Corp-SubCA chain. A user browses to https://lab-nas.training.lab, a server that presents a self-signed certificate. What does the user experience?",
    exhibit: String.raw`FGT-HQ # show firewall ssl-ssh-profile "SSL-Deep-HQ"
config firewall ssl-ssh-profile
    edit "SSL-Deep-HQ"
        config https
            set untrusted-server-cert ignore
        end
        set caname "Corp-SubCA"
    next
end`,
    options: ["The page loads with no warning; the browser sees a certificate for lab-nas.training.lab issued by Corp-SubCA", "The browser shows a warning because the certificate is re-signed by Fortinet_CA_Untrusted", "FortiGate blocks the session and logs an SSL anomaly", "The browser receives the original self-signed certificate and shows a warning"],
    answer: [0],
    explanation: "`untrusted-server-cert ignore` is the GUI's **Trust & Allow**. FortiGate treats the untrusted certificate as trusted and re-signs it with `caname`, here Corp-SubCA. The clients trust that CA, so the warning disappears. That is exactly why `ignore` is dangerous: the user can no longer tell that the real certificate was self-signed.\n\n- Re-signing with Fortinet_CA_Untrusted happens with `allow` (Keep Untrusted & Allow).\n- Blocking happens with `block`.\n- The original certificate would only be seen if the session were not deep-inspected.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-006",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "A FortiGate uses certificate inspection. For a TLS 1.3 session without Encrypted Client Hello, which information can it use to rate the destination for web filtering?",
    options: ["The SNI in the cleartext Client Hello", "The server certificate CN, read passively from the server's handshake messages", "The HTTP Host header", "A reverse DNS lookup of the destination IP address"],
    answer: [0],
    explanation: "TLS 1.3 encrypts everything after the Server Hello, including the server certificate, so a passive device cannot read it. The Client Hello and its SNI are still cleartext (unless ECH is used), and certificate inspection uses the SNI. FortiGate can actively probe the server to obtain the certificate, but it cannot read it from the client's session.\n\n- The HTTP Host header is inside the encrypted application data.\n- FortiGate does not rate URLs by reverse DNS.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-007",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. After a browser update, users behind FGT-Branch can reach several sites in blocked FortiGuard categories. The web filter logs show the sessions rated as the hostname of a shared CDN front end rather than the real sites. Which change fixes this?",
    exhibit: String.raw`FGT-Branch # show firewall ssl-ssh-profile "SSL-Cert-Branch"
config firewall ssl-ssh-profile
    edit "SSL-Cert-Branch"
        config https
            set status certificate-inspection
            set encrypted-client-hello allow
        end
    next
end`,
    options: ["set encrypted-client-hello block under config https", "set sni-server-cert-check strict under config https", "set quic block under config https", "set unsupported-ssl-negotiation block under config https"],
    answer: [0],
    explanation: "With Encrypted Client Hello, the real SNI is hidden in an encrypted inner Client Hello, and the outer SNI names only the CDN front end. Certificate inspection therefore rates the wrong host. `encrypted-client-hello block` (the default, changed here to `allow`) makes the browser fall back to a normal Client Hello with a visible SNI.\n\n- A strict SNI check compares the SNI with the certificate. With ECH both point to the front end, so nothing changes.\n- In a certificate inspection profile, HTTP/3 is fixed to bypass, and QUIC is not the cause described here.\n- Negotiation compliance settings do not reveal the hidden SNI.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-008",
    topic: "3.1",
    type: "match",
    difficulty: 2,
    stem: "Match each SSL/SSH inspection profile setting to its effect.",
    pairs: [["caname", "CA used to re-sign certificates of servers that passed validation"], ["untrusted-caname", "CA used to re-sign certificates that failed validation, so the client still sees a warning"], ["server-cert-mode replace", "Present an uploaded certificate and key for a server you own"], ["sni-server-cert-check strict", "Close the connection when the SNI does not match the certificate CN/SAN"], ["client-certificate bypass", "Do not inspect sessions in which the server requests a client certificate"], ["allowlist enable", "Exempt FortiGuard's list of reputable websites from inspection"]],
    explanation: "`caname` (default Fortinet_CA_SSL) and `untrusted-caname` (default Fortinet_CA_Untrusted) are the two re-signing CAs. `replace` mode is for Protecting SSL Server. A strict SNI check drops mismatches, whereas `enable` falls back to the CN for URL filtering. `client-certificate bypass` is the HTTPS default, because FortiGate cannot present a user's client certificate. `allowlist` is the GUI's *Reputable websites* exemption.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-009",
    topic: "3.1",
    type: "single",
    difficulty: 1,
    stem: "Refer to the exhibit. What should the administrator do to resolve the warning on LAPTOP-114?",
    exhibit: String.raw`Browser warning on LAPTOP-114 (Windows, not joined to the domain)
  Error:               NET::ERR_CERT_AUTHORITY_INVALID
  Site:                https://portal.example.com
  Certificate subject: CN=portal.example.com
  Certificate issuer:  Fortinet_CA_SSL (FGT-HQ)

Domain-joined laptops browsing the same site through the same policy: no warning
Group Policy "Corp-Root-CAs" deploys the FGT-HQ CA certificate to domain computers`,
    options: ["Import the FGT-HQ CA certificate (downloaded from the SSL/SSH inspection profile) into LAPTOP-114's trusted root store", "Install Fortinet_CA_Untrusted on LAPTOP-114", "Add portal.example.com to the SSL inspection exemptions", "Change the profile's untrusted-server-cert action to ignore"],
    answer: [0],
    explanation: "The issuer is Fortinet_CA_SSL, so the real server certificate was trusted and re-signed. The warning only means that this laptop does not trust the FortiGate CA. It is not domain-joined, so the GPO never delivered it. Import the CA, which you can download from the inspection profile.\n\n- Fortinet_CA_Untrusted must never be installed on clients.\n- An exemption would hide the symptom for one site only and lose inspection.\n- `ignore` concerns untrusted server certificates, which is not the case here.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-010",
    topic: "3.1",
    type: "fill",
    difficulty: 2,
    stem: "Which `config firewall ssl-ssh-profile` attribute names the CA that FortiGate uses to re-sign server certificates that failed validation (default Fortinet_CA_Untrusted)?",
    answer: ["untrusted-caname", "set untrusted-caname"],
    explanation: "`set untrusted-caname <cert>` (default `Fortinet_CA_Untrusted`) is used when an untrusted server certificate is allowed as untrusted. `caname` (default `Fortinet_CA_SSL`) is used for trusted servers.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-011",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "An administrator wants to deep-inspect inbound HTTPS to a web server behind a VIP. The company owns the server's certificate and private key, and external clients must see the real certificate. Which SSL/SSH inspection setting is required?",
    options: ["Protecting SSL Server: server-cert-mode replace with the server's certificate selected", "Multiple clients connecting to multiple servers with server-cert-mode re-sign and Fortinet_CA_SSL", "Certificate inspection on port 443", "untrusted-server-cert ignore with the server's certificate as caname"],
    answer: [0],
    explanation: "For a server you own, FortiGate presents the server's real certificate, so it holds that certificate and its key: `server-cert-mode replace` with `server-cert`, which is the GUI's **Protecting SSL Server**. External clients see the genuine certificate and FortiGate can decrypt the traffic.\n\n- `re-sign` would present a FortiGate-signed certificate that internet clients do not trust.\n- Certificate inspection cannot see the payload.\n- `caname` must be a CA certificate, and `ignore` is about untrusted upstream servers.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-012",
    topic: "3.1",
    type: "multi",
    difficulty: 3,
    stem: "Refer to the exhibit. The profile is a full SSL inspection profile. Which two HTTPS sessions are NOT decrypted by FortiGate? (Choose two.)",
    exhibit: String.raw`FGT-HQ # show firewall ssl-ssh-profile "SSL-Deep-HQ"
config firewall ssl-ssh-profile
    edit "SSL-Deep-HQ"
        config ssl-exempt
            edit 1
                set fortiguard-category 31
            next
            edit 2
                set type wildcard-fqdn
                set wildcard-fqdn "g-partner-portal"
            next
        end
        set caname "Corp-SubCA"
    next
end

FGT-HQ # show firewall wildcard-fqdn custom "g-partner-portal"
config firewall wildcard-fqdn custom
    edit "g-partner-portal"
        set wildcard-fqdn "*.partner.example.net"
    next
end`,
    options: ["A session to an online bank rated Finance and Banking", "A session to app.partner.example.net", "A session to a hospital website rated Health and Wellness", "A session to www.example.com rated Information Technology", "A session to a privacy service rated Personal Privacy"],
    answer: [0, 1],
    explanation: "Entry 1 has no `set type` line, so it uses the default type `fortiguard-category` and exempts category 31 (Finance and Banking). Entry 2 exempts anything matching the wildcard FQDN object `g-partner-portal` (`*.partner.example.net`); `wildcard-fqdn` exemptions reference `config firewall wildcard-fqdn custom` objects.\n\nThe built-in deep inspection profiles also exempt Health and Wellness (33) and Personal Privacy (87), but this profile's exemption list contains only the two entries shown. The hospital site, the privacy service and the Information Technology site are therefore decrypted.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-013",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "A partner portal requires users to authenticate with a client certificate (mutual TLS). The traffic matches a policy that uses a full SSL inspection profile with default HTTPS settings. What happens?",
    options: ["The session is not deep-inspected, so client certificate authentication succeeds", "FortiGate blocks the session because client certificates cannot be inspected", "FortiGate presents its own certificate as the client certificate, and authentication fails", "FortiGate decrypts the session and forwards the user's client certificate to the server"],
    answer: [0],
    explanation: "`client-certificate` defaults to `bypass` for HTTPS. FortiGate cannot complete mutual TLS on the user's behalf, because it does not have the user's private key. By default it therefore lets these sessions through without decryption. Setting `inspect` would break authentication, and `block` would drop the session.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-014",
    topic: "3.1",
    type: "order",
    difficulty: 2,
    stem: "Place the steps of outbound full SSL inspection (re-sign mode) in the order they occur.",
    items: ["The client sends its Client Hello toward the server and FortiGate intercepts it", "FortiGate opens its own TLS session to the server and receives the server certificate", "FortiGate validates the server certificate against its trusted CA store", "FortiGate generates a copy of the certificate signed by caname or untrusted-caname", "FortiGate completes the TLS handshake with the client using the re-signed certificate", "FortiGate decrypts the traffic, passes it to the security profiles and re-encrypts it toward the server"],
    explanation: "FortiGate has to learn and validate the real certificate before it can decide which CA re-signs the copy: `caname` if the certificate is trusted, `untrusted-caname` if it is not. Only then can it finish the client-side handshake. After that it acts as two TLS endpoints and inspects the cleartext between them.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-015",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit from a FortiGate running FortiOS 8.0. What does the output show about this tunnel?",
    exhibit: String.raw`FGT-Branch # diagnose vpn ike gateway list

vd: root/0
name: to-HQ
version: 2
interface: port1 3
addr: 192.0.2.10:51322 -> 203.0.113.1:443
tun_id: 203.0.113.1/::203.0.113.1
transport: TLS
peer-id-auth: yes
IKE SA: created 1/1  established 1/1  time 40/40/40 ms
IPsec SA: created 1/1  established 1/1  time 0/0/0 ms

  direction: initiator
  status: established 812-812s ago = 40ms
  proposal: aes256gcm-prfsha384`,
    options: ["IKE and ESP are carried inside a TLS session over TCP between the two FortiGates (TLS-based VPN negotiation)", "The tunnel is an agentless (SSL) VPN session rather than IPsec", "The IPsec SA keys were derived from the TLS 1.3 handshake instead of IKE", "FortiGate is applying SSL deep inspection to the IKE exchange"],
    answer: [0],
    explanation: "`transport: TLS` is the 8.0 **TLS 1.3-based VPN over TCP** feature (`ike-tcp-service` and `ike-tls-service` under `config system settings`). The IPsec tunnel's IKE and ESP traffic is wrapped in TLS, here toward TCP 443.\n\n- It is still an IKEv2 tunnel (`version: 2`, IKE SA and IPsec SA lines), not SSL VPN.\n- IKE still negotiates the SA keys. TLS only protects and disguises the transport.\n- This is the FortiGate's own tunnel, not an inspected transit session.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-016",
    topic: "3.1",
    type: "fill",
    difficulty: 3,
    stem: "In FortiOS 8.0, which `config system settings` attribute (together with `ike-tcp-service`) enables IKE/ESP over TLS for a VDOM?",
    answer: ["ike-tls-service", "set ike-tls-service enable", "set ike-tls-service"],
    explanation: "`set ike-tcp-service enable` turns on IKE over TCP, and `set ike-tls-service enable` wraps it in TLS. Both are set per VDOM, and `ike-tcp-service` is disabled by default. Site-to-site tunnels need `set transport auto` in phase 1 to prefer UDP and fall back to TCP/TLS. This is the 8.0 feature \"TLS 1.3 based VPN over TCP\".",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-017",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "FortiOS 8.0.1 performs proxy-mode deep inspection. Legacy clients that only support classical X25519 key exchange cannot reach an external service that accepts only the hybrid group X25519MLKEM768. Which profile setting allows the client and server legs to negotiate key exchange independently?",
    options: ["set tls-handshake-mode dual", "set min-allowed-ssl-version tls-1.3", "set unsupported-ssl-negotiation allow", "set server-cert-mode replace"],
    answer: [0],
    explanation: "`tls-handshake-mode` (8.0.1) has two values. `sync` (the default) makes the server leg follow the server's choices. `dual` negotiates version, key exchange and signature separately on the client-to-proxy and proxy-to-server legs. The FortiGate can then use X25519MLKEM768 toward the server and classical X25519 toward the client.\n\n- Raising the minimum version does not add PQC groups.\n- Negotiation compliance and replace mode have nothing to do with key exchange translation.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-018",
    topic: "3.1",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Both log entries were generated for the same connection through a proxy-mode policy with deep inspection. Which statement is true?",
    exhibit: String.raw`date=2026-10-27 time=11:05:42 logid="1704062220" type="utm" subtype="ssl"
eventtype="ssl-handshake" vd="root" policyid=20 sessionid=40991
srcip=10.0.1.44 dstip=198.51.100.80 dstport=443 hostname="pqc.example.com"
profile="SSL-Deep-PQC" tlsver="tls1.3" kxproto="hybrid"
kxcurve="X25519MLKEM768" armtype="proxy-to-server"

date=2026-10-27 time=11:05:42 logid="1704062220" type="utm" subtype="ssl"
eventtype="ssl-handshake" vd="root" policyid=20 sessionid=40991
srcip=10.0.1.44 dstip=198.51.100.80 dstport=443 hostname="pqc.example.com"
profile="SSL-Deep-PQC" tlsver="tls1.2" kxproto="ecdhe"
kxcurve="x25519" armtype="client-to-proxy"`,
    options: ["FortiGate used hybrid post-quantum key exchange over TLS 1.3 toward the server and classical X25519 over TLS 1.2 toward the client", "The client negotiated X25519MLKEM768 and FortiGate downgraded the server leg to TLS 1.2", "The entries belong to two different clients, one that supports PQC and one that does not", "The session was exempted from inspection, so FortiGate only recorded the two handshakes"],
    answer: [0],
    explanation: "Read `armtype`. The **proxy-to-server** leg shows `tlsver=\"tls1.3\"`, `kxproto=\"hybrid\"` and `kxcurve=\"X25519MLKEM768\"`. The **client-to-proxy** leg shows TLS 1.2 with ECDHE X25519. This is the PQC-to-classical translation of 8.0.1 proxy-mode deep inspection (`tls-handshake-mode dual`).\n\n- The same `sessionid`, source and destination prove it is one connection.\n- An exempted session would not have two separately negotiated legs.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-019",
    topic: "3.1",
    type: "multi",
    difficulty: 2,
    stem: "Fortinet_CA_SSL has been deployed to every managed endpoint's operating system store. A few applications still fail through the full SSL inspection policy, while browsers work. Which two reasons explain this? (Choose two.)",
    options: ["The application pins the server's certificate or public key and rejects any other certificate", "The application uses its own trust store, which does not contain the FortiGate CA", "The application uses TLS 1.3, which deep inspection does not support", "The application's server certificate is issued by a public CA", "The destination is exempted by category, so FortiGate re-signs it with Fortinet_CA_Untrusted"],
    answer: [0, 1],
    explanation: "Pinned applications only accept one specific certificate or key, so any re-signed certificate fails, whatever CA you deploy. Applications with their own trust store (some runtimes, Firefox without enterprise roots, many mobile apps) ignore the OS store. Both need an exemption or separate CA distribution.\n\n- Deep inspection supports TLS 1.3.\n- A public CA on the real server is the normal, trusted case.\n- Exempted traffic is not re-signed at all.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-020",
    topic: "3.1",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The policy uses a certificate inspection profile and a web filter profile. Video sites that should be blocked by category still work in Chrome, and their traffic appears as shown. What is the most effective fix?",
    exhibit: String.raw`date=2026-10-28 time=09:14:22 type="traffic" subtype="forward" level="notice"
srcip=10.0.1.52 srcintf="port2" dstip=198.51.100.120 dstport=443
dstintf="port1" proto=17 service="udp/443" policyid=10 action="accept"
sentbyte=48211 rcvdbyte=4412093`,
    options: ["Block QUIC, for example with an application control profile, so the browser falls back to TCP/TLS where the web filter applies", "Set quic inspect in the certificate inspection profile", "Add UDP 443 to the HTTPS port list of the SSL/SSH inspection profile", "Enable inspect-all ports in the protocol options profile"],
    answer: [0],
    explanation: "`proto=17` to port 443 is QUIC (HTTP/3). In a certificate inspection profile, HTTP/3 handling is fixed to **bypass**, so these sessions escape web filtering. Blocking QUIC (application control, or `quic block` in a full inspection profile) forces the browser back to TCP, where filtering works.\n\n- `quic inspect` requires full SSL inspection.\n- The HTTPS port list is for TCP ports.\n- Protocol options do not make QUIC inspectable.",
    lesson: "3.1-certificate-issues-tls13",
  },
  {
    id: "d3-021",
    topic: "3.1",
    type: "fill",
    difficulty: 1,
    stem: "What is the name of the built-in CA certificate that the deep-inspection profile uses by default to re-sign the certificates of trusted servers?",
    answer: ["Fortinet_CA_SSL"],
    explanation: "`caname` defaults to `Fortinet_CA_SSL`. Download it from the profile and install it on endpoints to avoid warnings. `Fortinet_CA_Untrusted` is the default `untrusted-caname`.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-022",
    topic: "3.1",
    type: "match",
    difficulty: 1,
    stem: "Match each requirement to the SSL/SSH inspection approach that meets it with the least intrusion.",
    pairs: [["Block HTTPS sites by FortiGuard category without deploying any certificates", "Certificate inspection"], ["Scan files downloaded over HTTPS for malware", "Full SSL inspection (re-sign)"], ["Inspect inbound HTTPS to your own web server while clients see its real certificate", "Protecting SSL Server (replace mode)"], ["The traffic must never be decrypted or examined at the TLS layer", "no-inspection"]],
    explanation: "Category blocking only needs the SNI, which certificate inspection provides. AV on HTTPS needs decryption. Your own server is protected with its real certificate and key in replace mode. `no-inspection` leaves TLS untouched, and should not be combined with other profiles.",
    lesson: "3.1-ssl-inspection-fundamentals",
  },
  {
    id: "d3-023",
    topic: "3.2",
    type: "single",
    difficulty: 1,
    stem: "An administrator creates a new firewall policy in profile-based NGFW mode and enables security profiles without changing the inspection mode. Which inspection mode does the policy use?",
    options: ["Flow-based", "Proxy-based", "The mode of the antivirus profile's feature set", "Proxy-based for HTTP and HTTPS, flow-based for all other protocols"],
    answer: [0],
    explanation: "`inspection-mode` defaults to `flow`. Proxy mode must be selected explicitly per policy. Profiles do not decide the mode: their `feature-set` must match the policy's mode.",
    lesson: "3.2-inspection-modes",
  },
  {
    id: "d3-024",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit (newest entry first). Policy 10 uses flow-based inspection. The user reports that the first download attempt ended with a connection error and no message, and the second attempt displayed a block page. Why?",
    exhibit: String.raw`1: date=2026-10-28 time=10:02:11 logid="0211008192" type="utm" subtype="virus"
eventtype="infected" level="warning" vd="root" policyid=10 srcip=10.0.1.25
dstip=198.51.100.44 service="HTTP" direction="incoming" action="blocked"
url="http://198.51.100.44/test/eicar.com" filename="eicar.com"
virus="EICAR_TEST_FILE" dtype="av-engine" profile="default"
msg="File is infected."

2: date=2026-10-28 time=10:01:47 logid="0211008192" type="utm" subtype="virus"
eventtype="infected" level="warning" vd="root" policyid=10 srcip=10.0.1.25
dstip=198.51.100.44 service="HTTP" direction="incoming" action="blocked"
url="http://198.51.100.44/test/eicar.com" filename="eicar.com"
virus="EICAR_TEST_FILE" dtype="av-engine" profile="default"
msg="File is infected."`,
    options: ["In flow mode the IPS engine resets the infected session and caches the URL; the replacement message is shown on the next request for that URL", "The first attempt was not scanned because the AV database was still loading", "Client comforting had already delivered the file on the first attempt, so only the second attempt could be blocked", "The replacement message group was missing until the second attempt"],
    answer: [0],
    explanation: "Both log entries show `action=\"blocked\"`, so the file was caught both times. In flow mode, packets are already flowing when the verdict arrives, so the IPS engine can only drop the rest and reset the session. It caches the URL, and the next request for it gets the replacement message. Proxy mode shows the block page on the first attempt.\n\n- Client comforting is a proxy-mode feature.\n- Nothing points to a database or replacement message problem.",
    lesson: "3.2-inspection-modes",
  },
  {
    id: "d3-025",
    topic: "3.2",
    type: "multi",
    difficulty: 1,
    stem: "Which two security profiles are supported only on proxy-based policies in FortiOS 8.0? (Choose two.)",
    options: ["Inline CASB", "ICAP", "Intrusion prevention", "Application control", "DNS filter", "File filter"],
    answer: [0, 1],
    explanation: "The 8.0 feature comparison lists video filter, inline CASB, ICAP, web application firewall, SSH filter and WebSocket inspection as proxy-only. IPS and application control always run in the IPS engine and work on both kinds of policy. The DNS filter and file filter are supported in both modes.",
    lesson: "3.2-inspection-modes",
  },
  {
    id: "d3-026",
    topic: "3.2",
    type: "single",
    difficulty: 1,
    stem: "An administrator creates the antivirus profile AV-Proxy with feature set Proxy-based, but cannot select it in policy 12. What is the most likely reason?",
    options: ["Policy 12 uses flow-based inspection; a profile's feature set must match the policy's inspection mode", "Proxy-based AV profiles can only be used in policy-based NGFW mode", "The policy has no SSL/SSH inspection profile", "AV-Proxy has no protocols enabled"],
    answer: [0],
    explanation: "AV, web filter, DLP, file filter and email filter profiles have a `feature-set` that must match the policy's `inspection-mode`. Switch the policy to proxy, or use a flow profile.\n\n- Policy-based NGFW mode is flow-only.\n- The SSL profile and the enabled protocols do not affect whether the profile can be selected.",
    lesson: "3.2-inspection-modes",
  },
  {
    id: "d3-027",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. On FGT-Branch, a FortiGate 60F appliance running FortiOS 8.0, `gui-proxy-inspection` is already enabled, but the administrator still cannot find the Feature set option or any proxy-only profiles. What explains this?",
    exhibit: String.raw`FGT-Branch # get system performance status | grep Memory
Memory: 1999556k total, 1127748k used (56.4%), 705842k free (35.3%), 165966k freeable (8.3%)

FGT-Branch # show system settings | grep gui-proxy
    set gui-proxy-inspection enable

FGT-Branch # get system settings | grep ngfw-mode
ngfw-mode           : profile-based`,
    options: ["Physical models with 2 GB of RAM or less do not support proxy-only features, and their profiles are flow-only", "Proxy inspection requires a separate FortiGuard licence", "The VDOM is in policy-based NGFW mode, which hides the option only in the GUI", "Memory conserve mode is active and has disabled proxy inspection"],
    answer: [0],
    explanation: "The 60F has about 2 GB of RAM. Since 7.4.4, and in the FortiOS 8.0 feature comparison, proxy-only profiles are not supported and the feature set option is not available on physical models with 2 GB of RAM or less. Their antivirus, web filter, file filter and email filter profiles are flow-only (proxy-based inspection of email protocols has been allowed again since 7.6.5). FortiGate-VMs are exempt from this rule.\n\n- Proxy inspection is not licensed separately.\n- The exhibit shows `ngfw-mode : profile-based`, so policy-based mode is not the cause.\n- 56% memory use is not conserve mode.",
    lesson: "3.2-inspection-modes",
  },
  {
    id: "d3-028",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Which statement about NGFW policy-based mode is true?",
    options: ["Applications and URL categories are referenced directly in security policies, and inspection is flow-based only", "Each firewall policy must reference an application control profile", "Proxy-based inspection is required to match applications", "SSL inspection is configured inside each security policy entry"],
    answer: [0],
    explanation: "In policy-based mode (`set ngfw-mode policy-based` per VDOM), `config firewall security-policy` entries match applications and URL categories directly, with no sensor or web filter profile needed. The mode is flow-only. SSL inspection and authentication are handled by a separate policy, not inside each security rule.",
    lesson: "3.2-inspection-modes",
  },
  {
    id: "d3-029",
    topic: "3.2",
    type: "order",
    difficulty: 2,
    stem: "Place the web filter components in the order FortiOS applies them to a request.",
    items: ["Static URL filter", "FortiGuard category filter", "Web content filter", "Web script filter", "Antivirus scanning"],
    explanation: "FortiOS applies the URL filter first, then FortiGuard web filtering, then the content (banned word) filter, then the script filter, and finally antivirus on the content. This order is why a URL filter *block* stops processing early, *exempt* skips the later stages, and *allow* still leaves the FortiGuard check to run.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-030",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. To unblock www.example.com, the administrator added it to the URL filter with action allow. Users are still blocked. Why?",
    exhibit: String.raw`FGT-HQ # show webfilter urlfilter 1
config webfilter urlfilter
    edit 1
        set name "Staff-URLs"
        config entries
            edit 1
                set url "www.example.com"
                set action allow
            next
        end
    next
end

FGT-HQ # execute log display
1: date=2026-10-28 time=11:31:05 logid="0316013056" type="utm" subtype="webfilter"
eventtype="ftgd_blk" level="warning" vd="root" policyid=10 srcip=10.0.1.33
hostname="www.example.com" profile="WF-Staff" action="blocked"
url="https://www.example.com/" cat=52 catdesc="Information Technology"
msg="URL belongs to a denied category in policy"`,
    options: ["A URL filter allow entry only passes the request on to the remaining filters, so the FortiGuard category block still applies; use exempt or a rating override instead", "Simple URL filter entries do not match HTTPS URLs", "The URL filter entry needs the type wildcard to match the hostname", "The FortiGuard filter is evaluated before the static URL filter"],
    answer: [0],
    explanation: "The log shows `eventtype=\"ftgd_blk\"` for category 52, so the block came from FortiGuard, not from the URL filter. A URL filter **allow** means \"not blocked here\" and processing continues to the category filter. **Exempt** (or re-rating the site locally) is required to get past the category block.\n\n- Simple entries match hostnames over HTTPS.\n- The static URL filter is evaluated before FortiGuard, not after.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-031",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. After a change on the upstream firewall, all web browsing through policies with web filter profiles is blocked. What is the cause, and which profile option would temporarily restore browsing?",
    exhibit: String.raw`FGT-HQ # diagnose debug rating
Locale       : english

Service      : Web-filter
Status       : Enable
License      : Contract

Service      : Antispam
Status       : Disable

Service      : Virus Outbreak Prevention
Status       : Disable

Num. of servers : 2
Protocol        : https
Port            : 443
Anycast         : Enable
Default servers : Included

-=- Server List (Wed Oct 28 08:31:52 2026) -=-

IP                 Weight    RTT Flags   TZ   FortiGuard-requests  Curr Lost Total Lost   Updated Time
173.243.141.6          10      0 DIF     -5                   622        622        622
96.45.33.65            20      0 DF      -8                   619        619        619`,
    options: ["FortiGate cannot reach the FortiGuard rating servers, so every rating fails; enabling 'Allow websites when a rating error occurs' (error-allow) lets pages through until connectivity is fixed", "The web filtering licence has expired; enabling rate-server-ip lets FortiGate rate by IP instead", "The local rating cache is full; flushing it with diagnose webfilter fortiguard cache dump fixes browsing", "Every server is flagged F because they are in a different time zone; changing the FortiGuard time zone fixes it"],
    answer: [0],
    explanation: "The licence shows **Contract**, but every server is flagged **F** (failed) and every request is lost (*Curr Lost* equals *FortiGuard-requests*). The rating requests are not getting through, which fits a blocked port or protocol upstream. Without `error-allow`, a rating error blocks the page, and that is what users see. Enabling *Allow websites when a rating error occurs* fails open while you fix the upstream rule.\n\n- `rate-server-ip` adds IP-based rating. It does not fix reachability.\n- `cache dump` only displays the cache.\n- TZ is just a server attribute.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-032",
    topic: "3.2",
    type: "match",
    difficulty: 1,
    stem: "Match each FortiGuard category action to its behaviour.",
    pairs: [["Allow", "Permit the request"], ["Monitor", "Permit the request and log it"], ["Block", "Deny the request and show a replacement message"], ["Warning", "Show a page the user can click through, repeated after an interval"], ["Authenticate", "Require a login from a member of a selected user group before access"]],
    explanation: "These are the five category actions. *Disable* also exists, but only for local and remote categories, where it removes the category from the profile. In flow mode, local and remote categories cannot use Warning or Authenticate.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-033",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Safe search is enabled in the web filter profile, but users still get unfiltered image results from HTTPS search engines. What must the administrator change?",
    exhibit: String.raw`FGT-HQ # show firewall policy 10
config firewall policy
    edit 10
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "LAN-10.0.1.0"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set utm-status enable
        set ssl-ssh-profile "certificate-inspection"
        set webfilter-profile "WF-Staff"
        set nat enable
    next
end

FGT-HQ # show webfilter profile "WF-Staff"
config webfilter profile
    edit "WF-Staff"
        config web
            set safe-search url header
        end
    next
end`,
    options: ["Use a full SSL inspection profile on policy 10, because safe search has to modify the encrypted HTTPS request", "Change the web filter profile to the proxy feature set", "Add the search engines to the URL filter with action exempt", "Enable rate-server-ip in the FortiGuard rating options"],
    answer: [0],
    explanation: "Safe search works by rewriting the request (URL parameters or headers). FortiGate can only do that after decrypting the session. With certificate inspection the setting silently has no effect.\n\n- Search engine controls are supported in flow mode.\n- Exempting the search engines would remove filtering from them entirely.\n- IP rating is unrelated.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-034",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "A policy uses certificate inspection with a web filter profile. Which two controls can still be enforced for HTTPS traffic? (Choose two.)",
    options: ["Blocking by FortiGuard category, based on the SNI", "Static URL filter entries that match only the hostname", "Safe search enforcement", "Blocking a specific path such as /downloads/ on an allowed site", "Antivirus scanning of files downloaded from the site", "Web content filtering with banned words"],
    answer: [0, 1],
    explanation: "Certificate inspection exposes the hostname (from the SNI, or the certificate CN if the SNI check finds a mismatch). That is enough for category ratings and hostname-only URL filter entries. Safe search, path matching, AV and content filtering all need the decrypted request or response, so they need deep inspection.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-035",
    topic: "3.2",
    type: "fill",
    difficulty: 2,
    stem: "Which `config ftgd-wf` option keyword enables \"Rate URLs by domain and IP address\" in a web filter profile?",
    answer: ["rate-server-ip", "set options rate-server-ip"],
    explanation: "`set options rate-server-ip` also rates the server IP. When the domain and IP ratings differ, FortiOS uses built-in weights to pick one. `error-allow` is the option for rating errors.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-036",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. FortiGuard rates files.example.com as Information Technology (52). The policy is proxy-based. What happens when a user browses to https://files.example.com?",
    exhibit: String.raw`FGT-HQ # show webfilter ftgd-local-cat "Unsanctioned-Storage"
config webfilter ftgd-local-cat
    edit "Unsanctioned-Storage"
        set id 140
    next
end

FGT-HQ # show webfilter ftgd-local-rating
config webfilter ftgd-local-rating
    edit "files.example.com"
        set rating 140
    next
end

FGT-HQ # show webfilter profile "WF-Staff"
config webfilter profile
    edit "WF-Staff"
        set feature-set proxy
        config ftgd-wf
            config filters
                edit 1
                    set category 52
                    set action monitor
                next
                edit 2
                    set category 140
                    set action block
                next
            end
        end
    next
end`,
    options: ["The request is blocked, because the local category takes precedence and the URL follows only the local category's action", "The request is allowed and logged, because the FortiGuard category is evaluated first", "The request is allowed, because the monitor action of filter 1 overrides block", "The request triggers a warning page, because the URL is in two categories with conflicting actions"],
    answer: [0],
    explanation: "Category precedence is local → remote → FortiGuard. A URL that is in a local category follows only that category's behaviour. files.example.com is locally rated 140, which is blocked, so the FortiGuard rating (52, monitor) is never used.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-037",
    topic: "3.2",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. Policy 15 is flow-based and uses WF-Flow. portal.example.com is locally rated in category 140. Users never see a warning page for it. What is the reason?",
    exhibit: String.raw`FGT-HQ # show webfilter ftgd-local-cat "Partner-Portals"
config webfilter ftgd-local-cat
    edit "Partner-Portals"
        set id 140
    next
end

FGT-HQ # show webfilter profile "WF-Flow"
config webfilter profile
    edit "WF-Flow"
        config ftgd-wf
            config filters
                edit 1
                    set category 140
                    set action warning
                next
            end
        end
    next
end`,
    options: ["In flow mode, local and remote categories do not support the warning and authenticate actions; use a proxy-based policy and profile", "Category IDs from 140 are reserved for FortiGuard and cannot be used with warning", "The warning action requires the FortiGuard Web Filtering licence for local categories", "Warning pages are only displayed for HTTP, never for HTTPS sites"],
    answer: [0],
    explanation: "The 8.0 inspection mode comparison notes that local and remote category filters in flow mode do not support the warning and authenticate actions, and cannot be overridden. A proxy-based profile and policy can warn on a local category.\n\n- 140 is the first ID used for local categories.\n- HTTPS warning pages work as long as the client trusts the FortiGate CA.",
    lesson: "3.2-web-filtering-fortiguard",
  },
  {
    id: "d3-038",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit, captured twice 60 seconds apart. Users report intermittent slow page loads and occasional rating-error blocks. What do the counters indicate?",
    exhibit: String.raw`FGT-HQ # diagnose webfilter fortiguard statistics list
Rating Statistics:
=====================
DNS failures                   :          0
DNS lookups                    :         42
Request timeout                :        318
Total requests                 :       5120
Requests to FortiGuard servers :       1904
Server errored responses       :          0
Allowed                        :       4386
Blocked                        :        416
Errors                         :        318
...

(60 seconds later)
Request timeout                :        371
Total requests                 :       5304
Requests to FortiGuard servers :       1981
Errors                         :        371`,
    options: ["Rating requests to FortiGuard are timing out, which points to a communication problem between the FortiGate and the rating servers", "Users are visiting many sites in blocked categories", "The DNS server is failing to resolve the FortiGuard server names", "The rating cache is disabled, so every request goes to FortiGuard"],
    answer: [0],
    explanation: "*Request timeout* and *Errors* grew by 53 in a minute while 77 requests went to FortiGuard. Steadily growing error counters indicate communication problems with FortiGuard (packet loss, an upstream filter or a poor server choice). Use `diagnose debug rating` next.\n\n- The Blocked count is a separate counter and is not the issue.\n- DNS failures are 0.\n- Only about a third of requests go to FortiGuard, so the cache is answering the rest.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-039",
    topic: "3.2",
    type: "fill",
    difficulty: 2,
    stem: "Enter the command that enables real-time debug output from the URL filter daemon, to be used together with `diagnose debug enable`.",
    answer: ["diagnose debug application urlfilter -1", "diag debug app urlfilter -1", "diagnose debug app urlfilter -1", "diag debug application urlfilter -1"],
    explanation: "`diagnose debug application urlfilter -1` with `diagnose debug enable` shows each rating decision. Narrow it with `diagnose debug urlfilter src-addr <ip>`, and stop it with `diagnose debug disable`.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-040",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "A URL filter list contains the simple entry `example.com` with action block. The administrator wants to block only example.com itself and still allow mail.example.com. What must be changed?",
    options: ["Set include-subdomains disable on the URL filter list", "Change the entry type to wildcard", "Add the entry *.example.com with action exempt below the block entry", "Enable rate-server-ip in the web filter profile"],
    answer: [0],
    explanation: "Simple entries match subdomains by default. `set include-subdomains disable` (simple entries only) makes the entry match just the exact domain.\n\n- A wildcard entry does not remove subdomain matching.\n- An exempt entry placed below the block entry is never reached for mail.example.com, because the first match wins.\n- IP rating is unrelated.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-041",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "Refer to the exhibit. FortiGuard categories allow all of the sites listed below. Which two requests are blocked by this URL filter? (Choose two.)",
    exhibit: String.raw`config webfilter urlfilter
    edit 2
        set name "Branch-URLs"
        config entries
            edit 1
                set url "*.cdn.example.net"
                set type wildcard
                set action exempt
            next
            edit 2
                set url "*.example.net"
                set type wildcard
                set action block
            next
            edit 3
                set url "www.example.org"
                set action monitor
            next
        end
    next
end`,
    options: ["https://mail.example.net/inbox", "https://shop.example.net/cart", "https://img.cdn.example.net/logo.png", "https://www.example.org/", "https://downloads.example.com/tool.zip"],
    answer: [0, 1],
    explanation: "Entries are evaluated top-down and the first match wins. mail.example.net and shop.example.net match entry 2 (`*.example.net`, block). img.cdn.example.net matches entry 1 first and is exempt. www.example.org matches the monitor entry, so it is allowed and logged. downloads.example.com matches nothing.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-042",
    topic: "3.2",
    type: "single",
    difficulty: 1,
    stem: "A company decides to block every generative AI chatbot website with a web filter profile. Which FortiGuard category should be set to block?",
    options: ["Artificial Intelligence Technology", "Information Technology", "Newly Observed Domain", "Personal Privacy"],
    answer: [0],
    explanation: "FortiOS 8.0 documents category **100, Artificial Intelligence Technology** (group *General Interest – Business*), for blocking GenAI sites with a web filter. Information Technology (52) is far broader, and the other two categories are unrelated.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-043",
    topic: "3.2",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The DLP profile genai-dlp has message and file rules on http-post with action block, and the address group contains the chatbot FQDNs. Prompts containing the dictionary keywords are still accepted by the chatbots. What is the cause?",
    exhibit: String.raw`FGT-HQ # show firewall policy 30
config firewall policy
    edit 30
        set name "Staff-to-GenAI"
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "LAN-10.0.1.0"
        set dstaddr "g-genai-apps"
        set schedule "always"
        set service "ALL"
        set utm-status enable
        set inspection-mode proxy
        set ssl-ssh-profile "certificate-inspection"
        set dlp-profile "genai-dlp"
        set application-list "Block-QUIC"
        set nat enable
    next
end`,
    options: ["Certificate inspection cannot see the HTTPS POST body; the policy needs a full SSL inspection profile", "DLP for GenAI requires flow-based inspection", "QUIC must be allowed so that DLP can read HTTP/3 prompts", "The DLP profile must be referenced from the web filter profile, not from the policy"],
    answer: [0],
    explanation: "The documented 8.0 design needs a proxy-mode policy, **deep inspection**, the DLP profile and application control blocking QUIC. Policy 30 has everything except deep inspection. With certificate inspection the POST body (the prompt) stays encrypted, so the DLP rules never match.\n\n- Proxy mode is correct for this design.\n- QUIC must be blocked, not allowed.\n- DLP profiles are attached to the policy.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-044",
    topic: "3.2",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about controlling GenAI services with FortiOS 8.0 are true? (Choose two.)",
    options: ["An application control entry for the GenAI category can monitor AI applications, and with deep inspection and extended logging the logs include fields such as model and prompt", "A web filter profile can block AI websites by setting the FortiGuard category Artificial Intelligence Technology to block", "DLP keyword rules can block sensitive prompts on flow-based policies that use certificate inspection", "GenAI application signatures are delivered in the antivirus extended database", "Blocking QUIC stops DLP from inspecting chatbot prompts"],
    answer: [0, 1],
    explanation: "Application control (category GenAI, ID 36) provides visibility and control, and with `extended-log` and deep inspection it adds `aiuser`, `model`, `dcgeo`, `usecase`, `prompt` and `cloudgenai`. The web filter can block category 100.\n\n- DLP prompt blocking needs proxy mode and deep inspection.\n- GenAI signatures come from the GenAI Application Definitions (AIAP) database, not the AV database.\n- QUIC is blocked precisely so that DLP can see the prompts over TCP.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-045",
    topic: "3.2",
    type: "fill",
    difficulty: 2,
    stem: "In the FortiOS 8.0 GenAI DLP example, one DLP rule inspects uploaded files and another inspects the chatbot prompt text. Which value is set with `set type` on the prompt rule?",
    answer: ["message", "set type message"],
    explanation: "The prompt rule uses `set type message`, and the upload rule keeps the default file type. Both use `set proto http-post`, `set filter-by sensor` and `set action block` in a `feature-set proxy` DLP profile.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-046",
    topic: "3.2",
    type: "match",
    difficulty: 2,
    stem: "Match each command to what it shows or does.",
    pairs: [["diagnose debug rating", "FortiGuard rating servers with flags and packet loss"], ["diagnose webfilter fortiguard statistics list", "Rating and cache counters such as request timeouts"], ["diagnose webfilter fortiguard cache dump", "URLs held in the local rating cache"], ["diagnose test application urlfilter 99", "Restart the URL filter daemon"], ["diagnose wad stats filter list", "URL filter statistics for proxy-based policies"]],
    explanation: "`diagnose debug rating` is the first check for FortiGuard reachability. The statistics list shows rating and cache counters. The cache dump lists cached ratings, with the category in hex. Option 99 restarts the URL filter daemon. Proxy-mode filtering counters come from WAD (`diagnose wad stats filter list`), and flow-mode counters from `diagnose webfilter stats list`.",
    lesson: "3.2-url-filters-troubleshooting-genai",
  },
  {
    id: "d3-047",
    topic: "3.3",
    type: "single",
    difficulty: 1,
    stem: "A firewall policy uses proxy-based inspection and has an application control sensor. Which FortiOS component performs the application control inspection?",
    options: ["The IPS engine", "The WAD proxy daemon", "The scanunit daemon", "The FortiGuard cloud, through a per-session rating request"],
    answer: [0],
    explanation: "Application control (like IPS) always runs in the IPS engine, using FortiGuard application signatures and protocol decoders, whatever the policy's inspection mode. WAD handles proxy-mode HTTP processing and scanunit handles AV scanning. Applications are identified locally from signatures, not by cloud lookups.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-048",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Policy 22 allows all services from the LAN to a server network and uses the sensor APP-Servers. Application ID 15896 is FTP. A client connects to one FTP server on TCP 21 and to another FTP server on TCP 2121. What happens?",
    exhibit: String.raw`FGT-HQ # show application list "APP-Servers"
config application list
    edit "APP-Servers"
        set enforce-default-app-port enable
        config entries
            edit 1
                set application 15896
                set action pass
            next
        end
    next
end`,
    options: ["FTP on TCP 21 is allowed; FTP on TCP 2121 is blocked", "Both sessions are allowed, because the entry action is pass", "Both sessions are blocked, because port enforcement blocks FTP on all ports", "FTP on TCP 2121 is allowed but logged as an unknown application"],
    answer: [0],
    explanation: "`enforce-default-app-port enable` (*Block applications detected on non-default ports*) blocks applications with a monitor or allow action when they are detected on a port other than their FortiGuard default port. FTP on 21 passes. FTP identified on 2121 is blocked. Applications set to block are blocked on every port.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-049",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Category 23 is Social.Media. A social media application with risk level 4 is detected in traffic using this sensor. What is the result?",
    exhibit: String.raw`config application list
    edit "APP-Staff"
        config entries
            edit 1
                set risk 4 5
                set action block
            next
            edit 2
                set category 23
                set action pass
                set log enable
            next
        end
    next
end`,
    options: ["The application is blocked by entry 1, because entries are evaluated in order and the risk filter matches first", "The application is allowed and logged by entry 2, because category settings take precedence over filter overrides", "The application is allowed, because pass is the more permissive action and wins ties", "The application is allowed, but only after the risk filter generates a log entry"],
    answer: [0],
    explanation: "Filter and application overrides are evaluated top-down before the category settings. Entry 1 (risk 4 or 5, block) matches first, so the application is blocked. To exempt one social application from the risk filter, place a specific application override above entry 1.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-050",
    topic: "3.3",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about application control actions are true? (Choose two.)",
    options: ["Monitor and Allow both pass the traffic (CLI action pass); Monitor also generates an application control log", "Reset terminates the session by sending TCP resets", "Allow generates an application control log for every matching session", "Quarantine passes the traffic and adds the source IP to a watch list", "The Block action can be used only on proxy-based policies"],
    answer: [0, 1],
    explanation: "In the CLI, Monitor and Allow are both `action pass`, with `log enable` and `log disable` respectively. Reset sends TCP resets. Allow does not log. Quarantine blocks the traffic and bans the source IP for `quarantine-expiry`. Block works on every policy type, because application control runs in the IPS engine.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-051",
    topic: "3.3",
    type: "single",
    difficulty: 3,
    stem: "Security requires that only genuine DNS may use port 53 through a policy, and that any other protocol detected on port 53 is blocked, whatever application signature it matches. Which application control feature meets this requirement?",
    options: ["Network protocol enforcement (control-default-network-services with a default-network-services entry for port 53 and service dns)", "Block applications detected on non-default ports (enforce-default-app-port)", "Setting unknown-application-action to block", "An application override that blocks the DNS application"],
    answer: [0],
    explanation: "Network protocol enforcement defines which protocol is allowed on a port. Anything else seen there triggers `violation-action` (default block).\n\n- Port enforcement works the other way round: it stops allowed applications from using non-default ports.\n- Blocking unknown applications would not stop a known protocol on port 53.\n- Blocking DNS breaks the one thing that should work.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-052",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. APP-Staff blocks the P2P category. A user on 10.0.1.60 still uses BitTorrent successfully. What is the cause?",
    exhibit: String.raw`FGT-HQ # show firewall policy
config firewall policy
    edit 5
        set name "IT-Admins"
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "LAN-10.0.1.0"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set nat enable
    next
    edit 10
        set name "Staff-Internet"
        set srcintf "port2"
        set dstintf "port1"
        set action accept
        set srcaddr "LAN-10.0.1.0"
        set dstaddr "all"
        set schedule "always"
        set service "ALL"
        set utm-status enable
        set ssl-ssh-profile "certificate-inspection"
        set application-list "APP-Staff"
        set nat enable
    next
end`,
    options: ["Policy 5 is above policy 10 and matches the same traffic, and it has no application control sensor, so APP-Staff never sees the session", "P2P applications can only be detected with deep inspection", "Application control requires proxy-based inspection", "APP-Staff only works when the VDOM is in policy-based NGFW mode"],
    answer: [0],
    explanation: "The policy is matched on the first packet, before the application is known. Policy 5 has the same interfaces and source subnet (probably meant for an IT group, but configured with the whole LAN), so it accepts the session first, without any sensor. Fix the source of policy 5, or move policy 10 above it.\n\n- P2P signatures do not need deep inspection to identify the protocol.\n- Application control works in flow mode and in profile-based NGFW mode.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-053",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "An application is set to Block in the sensor, but the forward traffic log for each blocked attempt shows a small number of bytes sent and received. Why?",
    options: ["The TCP handshake and the first data packets have to pass before a signature can identify the application", "Application control only acts after the session times out", "The block action only applies to the reply direction", "The bytes are FortiGate's replacement message, counted as application data"],
    answer: [0],
    explanation: "Signatures need application data, such as the TLS Client Hello or an HTTP request, before they can identify the application. The first packets of every session are therefore allowed, and the block applies as soon as the application is recognised. This is normal behaviour.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-054",
    topic: "3.3",
    type: "order",
    difficulty: 3,
    stem: "When several application signatures match the same session, FortiOS uses a series of tie-breakers. Order them from first considered to last considered.",
    items: ["Earlier segment (entry order) in the sensor", "Custom signature over FortiGuard signature", "More pre-match and post-match actions", "Higher application weight", "Non-hidden signature over hidden signature", "More pattern and PCRE matches", "Higher signature ID"],
    explanation: "This is the documented priority. In practice the **weight** (set by FortiGuard, not configurable) decides most ties: a specific application such as Facebook (weight 10) beats a generic protocol such as SSL (weight 1). The signature ID is the last resort, because a higher ID is assumed to be newer.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-055",
    topic: "3.3",
    type: "fill",
    difficulty: 2,
    stem: "In `config application list` → `config entries`, which category ID selects the Generative AI category?",
    answer: ["36", "set category 36"],
    explanation: "The FortiOS 8.0 documentation uses `set category 36` for the GenAI category. Its signatures come from the GenAI Application Definitions (AIAP) database.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-056",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The FortiGate has a valid support contract. Its firewall policies currently use only IPS sensors and web filter profiles. What explains the output?",
    exhibit: String.raw`FGT-HQ # diagnose autoupdate versions | grep -A 6 GenAI
GenAI Application Definitions
---------
Version: 0.00000 signed
Contract Expiry Date: Thu Jan  3 2030
Last Updated using manual update on Mon Jan  1 00:00:00 2001
Last Update Attempt: Wed Oct 28 03:12:04 2026
Result: No Updates`,
    options: ["The GenAI Application Definitions database has never been downloaded; it is only updated once at least one policy uses an application control profile", "The contract has expired, so FortiGuard refuses the download", "The GenAI database is only available on proxy-based policies", "Version 0.00000 means FortiGuard has disabled GenAI signatures for this model"],
    answer: [0],
    explanation: "Version `0.00000` means the AIAP database has not been updated. According to the 8.0 documentation, updates need an application control profile on at least one firewall policy, and a valid FortiCare firmware and general updates (FMWR) contract. The contract is valid until 2030, so the missing piece is an application control profile in use.\n\n- The database is not tied to proxy mode.\n- Version 0 does not mean FortiGuard disabled the signatures.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-057",
    topic: "3.3",
    type: "multi",
    difficulty: 3,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: String.raw`date=2026-10-28 time=15:02:37 type="utm" subtype="app-ctrl" eventtype="signature"
level="information" vd="root" srcip=10.0.1.77 srcintf="port2" dstintf="port1"
policyid=12 applist="GenAI" action="pass" appcat="GenAI"
app="OpenAI.ChatGPT_Post" msg="GenAI: OpenAI.ChatGPT_Post"
usecase="Conversational_Assistant" model="auto" dcgeo="US" apprisk="low"
prompt="summarize the attached Q3 forecast"`,
    options: ["The matching entry in sensor GenAI passes the traffic with logging enabled (Monitor)", "Policy 12 performs deep inspection on this session", "A DLP profile blocked the prompt", "Policy 12 uses certificate inspection, which is enough to record the prompt text", "The entry was generated by the web filter category Artificial Intelligence Technology"],
    answer: [0, 1],
    explanation: "`action=\"pass\"` with an application control log means a Monitor entry. Allow would not log. The `prompt` text and the `usecase`, `model` and `dcgeo` fields are only available with **deep inspection** (Fortinet also says to enable extended logging, `set extended-log enable` in the sensor, to capture them).\n\n- A DLP block would produce a `subtype=\"dlp\"` log with `action=\"block\"`.\n- Certificate inspection cannot reveal the prompt.\n- The log is `subtype=\"app-ctrl\"`, not webfilter.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-058",
    topic: "3.3",
    type: "single",
    difficulty: 1,
    stem: "A VDOM runs in NGFW policy-based mode. Where does the administrator specify that the application group Sanctioned-SaaS is allowed for users in the Sales group?",
    options: ["In a security policy (config firewall security-policy) that references the applications and the user group", "In an application control sensor attached to a firewall policy", "In the SSL inspection and authentication policy", "In a proxy policy with an application control profile"],
    answer: [0],
    explanation: "In policy-based mode, applications, application groups and URL categories are referenced directly in security policies. No sensor is used. The `config firewall policy` table in that mode handles SSL inspection and authentication, not application matching.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-059",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The sensor APP-Staff has an override that blocks the Dropbox_File.Upload signature, and policy 10 uses certificate inspection. Users can still upload files to Dropbox. What is the reason?",
    exhibit: String.raw`date=2026-10-28 time=14:12:09 type="utm" subtype="app-ctrl" eventtype="signature"
level="information" vd="root" srcip=10.0.1.29 srcintf="port2" dstintf="port1"
dstport=443 service="HTTPS" policyid=10 applist="APP-Staff" action="pass"
appcat="Storage.Backup" app="Dropbox" msg="Storage.Backup: Dropbox"`,
    options: ["Sub-application actions such as File.Upload are inside the encrypted session; without deep inspection only the parent application can be identified", "The override must use the reset action instead of block", "Port enforcement must be enabled for sub-application signatures to match", "deep-app-inspection must be disabled in the sensor"],
    answer: [0],
    explanation: "With certificate inspection, FortiGate identifies **Dropbox** from the handshake (SNI or certificate), which is why the log shows the parent application. The upload action is in the encrypted HTTP requests, so `Dropbox_File.Upload` can only match with deep inspection. Check the signature's *Requirements* field.\n\n- Changing block to reset does not make the signature visible.\n- Port enforcement is unrelated.\n- `deep-app-inspection` (default enable) should stay enabled.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-060",
    topic: "3.3",
    type: "match",
    difficulty: 2,
    stem: "Match each application control sensor option to its effect.",
    pairs: [["other-application-action block", "Block applications that match no entry in the sensor"], ["unknown-application-action block", "Block traffic that no signature can identify"], ["enforce-default-app-port enable", "Block allowed applications detected on non-default ports"], ["app-replacemsg enable", "Show a replacement page for blocked HTTP-based applications"], ["extended-log enable", "Add extra detail, such as GenAI fields, to application control logs"]],
    explanation: "`other-application-action` and `unknown-application-action` both default to pass, with logging disabled. Port enforcement defaults to disabled. `app-replacemsg` defaults to enabled. `extended-log` (default disabled) adds detail and, for GenAI signatures with deep inspection, the AI-specific fields.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-061",
    topic: "3.3",
    type: "single",
    difficulty: 2,
    stem: "Two signatures match the same session in the same sensor segment. The administrator wants to see each signature's ID, category, risk and weight to understand which one won. Which command shows this?",
    options: ["get application name status", "diagnose autoupdate versions", "diagnose test application ipsmonitor 1", "get webfilter categories"],
    answer: [0],
    explanation: "`get application name status` lists each application signature with its ID, category, popularity, risk, weight and protocols (filter it with `grep`). `diagnose autoupdate versions` shows package versions, `ipsmonitor 1` shows IPS engine information, and `get webfilter categories` lists web filter categories.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-062",
    topic: "3.3",
    type: "fill",
    difficulty: 2,
    stem: "Which `config application list` attribute implements the GUI option \"Block applications detected on non-default ports\"?",
    answer: ["enforce-default-app-port", "set enforce-default-app-port enable", "set enforce-default-app-port"],
    explanation: "`set enforce-default-app-port enable` (default disable) blocks monitored or allowed applications seen on ports other than their FortiGuard default ports.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-063",
    topic: "3.3",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. The sensor is applied to the policy from an OT network toward the internet. Application ID 15896 is FTP. What happens when OT host 10.0.50.20 starts an FTP session?",
    exhibit: String.raw`config application list
    edit "APP-OT"
        config entries
            edit 1
                set application 15896
                set action block
                set quarantine attacker
                set quarantine-expiry 0d1h0m
            next
        end
    next
end`,
    options: ["The FTP session is blocked and 10.0.50.20 is banned, so all of its traffic through the FortiGate is dropped for one hour", "Only FTP from 10.0.50.20 is blocked for one hour; its other traffic is still allowed", "The FTP server's IP address is banned for one hour", "The session is allowed, and 10.0.50.20 is reported to FortiClient EMS for quarantine"],
    answer: [0],
    explanation: "`quarantine attacker` adds the source (the \"attacker\" that triggered the entry) to the banned IP list for `quarantine-expiry`, here one hour. All of that host's traffic is then dropped, not just FTP. The destination is not banned, and EMS is not involved.",
    lesson: "3.3-app-control-monitoring-troubleshooting",
  },
  {
    id: "d3-064",
    topic: "3.3",
    type: "multi",
    difficulty: 1,
    stem: "When creating a filter override in an application control sensor, which two attributes can be used to select signatures? (Choose two.)",
    options: ["Risk", "Behavior", "Destination port", "Source address", "FortiGuard web category", "User group"],
    answer: [0, 1],
    explanation: "Filter overrides select signatures by attributes such as behavior, popularity, protocol, risk, technology and vendor (and category). Ports, addresses, users and web categories belong to the firewall policy or the web filter, not to signature filters.",
    lesson: "3.3-application-control-profiles",
  },
  {
    id: "d3-065",
    topic: "3.4",
    type: "single",
    difficulty: 1,
    stem: "Which antivirus signature database does a FortiGate use by default?",
    options: ["Extended", "Normal", "Extreme", "Flow-only quick scan database"],
    answer: [0],
    explanation: "The **extended** database is the default. It covers malware currently in the wild plus recent malware that has nearly or completely disappeared. *Normal* is the base set present on every FortiGate. *Extreme* adds dormant historical malware and only exists on supporting models. Quick scan is a legacy flow-mode concept.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-066",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "A research lab must detect old, dormant malware samples that rarely appear in the wild any more. The FortiGate model supports the option. What should the administrator configure?",
    options: ["set use-extreme-db enable under config antivirus settings", "set analytics-db enable in the antivirus profile", "set mobile-malware-db enable in the antivirus profile", "set scan-mode legacy in the antivirus profile"],
    answer: [0],
    explanation: "The **extreme** database adds a large set of dormant \"zoo\" malware to the extended set. It is enabled with `use-extreme-db`, which only appears on models that support it (in 8.0, from the FortiGate 121G up, and on all VMs).\n\n- `analytics-db` adds signatures found by FortiSandbox.\n- `mobile-malware-db` covers mobile threats.\n- `legacy` disables stream-based scanning.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-067",
    topic: "3.4",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. A proxy-based policy uses AV-Proxy and PO-Staff. A user downloads a 25 MB infected executable over HTTP. The download completes and there is no antivirus log. Why?",
    exhibit: String.raw`FGT-HQ # show antivirus profile "AV-Proxy"
config antivirus profile
    edit "AV-Proxy"
        set feature-set proxy
        set scan-mode legacy
        config http
            set av-scan block
        end
    next
end

FGT-HQ # show firewall profile-protocol-options "PO-Staff"
config firewall profile-protocol-options
    edit "PO-Staff"
        config http
            set oversize-limit 15
        end
    next
end`,
    options: ["The file exceeds the 15 MB oversize limit, and oversized files are passed without scanning because the block-oversized option (options oversize) is not set", "Legacy scan mode does not scan HTTP traffic", "HTTP downloads are only scanned when the policy uses deep inspection", "The extended database does not contain executable malware"],
    answer: [0],
    explanation: "In legacy (buffered) mode, files larger than `oversize-limit` are not scanned. Unless `options oversize` is set in the protocol table, they are **passed**. Add `set options oversize` (and `set oversize-log enable` at the top level) to block and log them, or raise the limit if memory allows.\n\n- Legacy mode still scans HTTP; it only disables stream-based scanning.\n- Plain HTTP needs no SSL inspection.\n- The database size is not the issue.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-068",
    topic: "3.4",
    type: "multi",
    difficulty: 2,
    stem: "Which two antivirus features are available only with proxy-based inspection? (Choose two.)",
    options: ["Content disarm and reconstruction", "Client comforting", "FortiGuard outbreak prevention", "Mobile malware protection", "External malware blocklist", "FortiSandbox inline scanning"],
    answer: [0, 1],
    explanation: "The 8.0 feature comparison lists **content disarm** and **client comforting** (and FortiNDR inline detection) as proxy-only. Outbreak prevention, mobile malware, external blocklists and FortiSandbox inline scanning are supported in both flow and proxy modes.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-069",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. What can the administrator conclude from this log entry?",
    exhibit: String.raw`1: date=2026-10-28 time=14:07:33 eventtime=1793214453000000000 tz="-0500"
logid="0211008192" type="utm" subtype="virus" eventtype="infected"
level="warning" vd="root" policyid=10 sessionid=90214 srcip=10.0.1.25
srcport=52110 srcintf="port2" dstip=198.51.100.44 dstport=443
dstintf="port1" proto=6 service="HTTPS" direction="incoming"
action="blocked" filename="eicar.com" quarskip="Quarantine-disabled"
virus="EICAR_TEST_FILE" viruscat="Virus" dtype="av-engine"
ref="http://www.fortinet.com/ve?vn=EICAR_TEST_FILE"
url="https://www.example.com/eicar.com" profile="default"
msg="File is infected."`,
    options: ["Policy 10 performs full SSL inspection on this traffic, because the AV engine saw a file inside an HTTPS session", "Policy 10 uses certificate inspection, which is enough for HTTPS antivirus scanning", "The infected file was quarantined on the FortiGate", "The file was detected by FortiSandbox"],
    answer: [0],
    explanation: "An AV engine detection (`dtype=\"av-engine\"`) on `service=\"HTTPS\"` means FortiGate decrypted the session. Certificate inspection never exposes file contents.\n\n- `quarskip=\"Quarantine-disabled\"` shows that the file was not quarantined.\n- The detection came from the AV engine signature `EICAR_TEST_FILE`. A FortiSandbox verdict would show `dtype=\"fortisandbox\"`.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-070",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. A password-protected ZIP containing malware is downloaded over HTTP through a proxy-based policy using this profile. The download succeeds and no virus is logged. Which change blocks such files?",
    exhibit: String.raw`FGT-HQ # show antivirus profile "AV-Proxy"
config antivirus profile
    edit "AV-Proxy"
        set feature-set proxy
        config http
            set av-scan block
            set outbreak-prevention block
        end
    next
end`,
    options: ["set archive-block encrypted under config http", "set use-extreme-db enable under config antivirus settings", "set scan-mode legacy in the profile", "set options oversize in the protocol options HTTP table"],
    answer: [0],
    explanation: "An encrypted archive cannot be opened, so no signature can match its contents. `archive-block encrypted` blocks such archives outright (and `archive-log` can log them).\n\n- A bigger database cannot decrypt the archive.\n- Legacy mode does not either.\n- `oversize` concerns size, not encryption.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-071",
    topic: "3.4",
    type: "fill",
    difficulty: 2,
    stem: "Which `config antivirus settings` attribute enables the extreme antivirus database on models that support it?",
    answer: ["use-extreme-db", "set use-extreme-db enable", "set use-extreme-db"],
    explanation: "`set use-extreme-db enable` switches from the default extended database to the extreme database. The attribute appears only on models that support it.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-072",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about this FortiGate's antivirus protection is true?",
    exhibit: String.raw`FGT-HQ # diagnose autoupdate versions | grep -A 6 "Virus Definitions"
Virus Definitions
---------
Version: 93.07126 signed
Contract Expiry Date: Sat Mar  1 2025
Last Updated using scheduled update on Fri Feb 28 23:04:11 2025
Last Update Attempt: Wed Oct 28 12:00:02 2026
Result: No Updates`,
    options: ["The FortiGate still scans traffic, but with virus definitions from February 2025, because the contract expired in March 2025", "Antivirus scanning stopped when the contract expired, so all files pass unscanned", "The FortiGate blocks all downloads until the contract is renewed", "The latest update attempt succeeded, so the definitions are current"],
    answer: [0],
    explanation: "The contract expired on 1 March 2025 and the last successful update was on 28 February 2025. The FortiGate keeps checking (*Last Update Attempt* is today), but every attempt since then has returned *No Updates*. Scanning continues with the old database, which misses everything released since. Expiry does not stop scanning or block downloads. Renew the contract, then run `execute update-now`.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-073",
    topic: "3.4",
    type: "order",
    difficulty: 2,
    stem: "Place the steps of a proxy-based (buffered) antivirus scan of a large HTTP download with client comforting enabled in the order they occur.",
    items: ["The client's TCP session terminates on the FortiGate proxy, which opens a separate session to the server", "The server starts sending the file, and FortiGate buffers it", "At each comfort interval, FortiGate releases a small amount of data to the client", "When the whole file has been buffered, the AV engine scans it", "If the file is clean the rest is delivered; if it is infected the remaining data is discarded, so the client never receives the complete file"],
    explanation: "The proxy splits the connection, buffers the file up to the oversize limit, and trickles `comfort-amount` bytes every `comfort-interval` seconds (default 1 byte every 10 s) so the client does not time out. The last part of the file is held until the verdict is known.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-074",
    topic: "3.4",
    type: "match",
    difficulty: 2,
    stem: "Match each antivirus technique to its description.",
    pairs: [["Content disarm and reconstruction", "Removes active content such as macros from Office and PDF files"], ["FortiGuard outbreak prevention", "Hash lookup that catches new outbreaks before signatures exist"], ["External malware blocklist", "Blocks files whose hashes appear in your own threat feed"], ["Mobile malware protection", "Uses the FortiGuard database of Android and iOS malware"], ["Extreme database", "Adds dormant historical zoo malware signatures"]],
    explanation: "CDR is proxy-only and rebuilds documents without their active content. Outbreak prevention is a licensed FortiGuard hash service. The external blocklist uses your own hash feed. Mobile malware coverage is enabled by default (`mobile-malware-db`). The extreme database extends the default extended set.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-075",
    topic: "3.4",
    type: "single",
    difficulty: 3,
    stem: "In flow-based inspection with AV engine 7.0 or later, which configuration causes a downloaded file to be handled by a full scan (cached and passed to scanunit) instead of the default stream-based scan?",
    options: ["Enabling FortiGuard outbreak prevention in the antivirus profile", "Downloading an HTML file", "Using the extended antivirus database", "Applying the profile to an HTTP policy instead of FTP"],
    answer: [0],
    explanation: "The 8.0 guide lists features that force a full scan in flow mode: machine-learning detection, the extreme database, grayware checks, mobile malware, external blocklists, the EMS feed and **outbreak prevention**, as well as DLP and file filter.\n\n- HTML and JavaScript are exactly the types that are stream-scanned.\n- The extended database is the default.\n- The protocol alone does not force a full scan.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-076",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The profile is used on a proxy-based policy for inbound SMTP to the mail server. A clean, legitimate Windows installer is sent as an email attachment. What happens to it?",
    exhibit: String.raw`FGT-HQ # show antivirus profile "AV-Mail"
config antivirus profile
    edit "AV-Mail"
        set feature-set proxy
        config smtp
            set av-scan block
            set executables virus
        end
    next
end`,
    options: ["It is treated as a virus and blocked, because Windows executables in email attachments are treated as viruses", "It is delivered, because it does not match any virus signature", "It is delivered but quarantined for administrator review", "It is sent to FortiSandbox and delivered after a clean verdict"],
    answer: [0],
    explanation: "`set executables virus` is the GUI option **Treat Windows executables in email attachments as viruses**. Every Windows executable attachment is handled as infected, which with `av-scan block` means it is blocked, whether or not it matches a signature. Quarantine and FortiSandbox are not configured in this profile.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-077",
    topic: "3.4",
    type: "single",
    difficulty: 3,
    stem: "Refer to the exhibit. While the unit is in this state, what happens to new sessions on proxy-based policies that would normally be scanned by antivirus?",
    exhibit: String.raw`FGT-Branch # diagnose hardware sysinfo conserve
memory conserve mode:                        on
total RAM:                                         3971 MB
memory used:                                       3519 MB   88% of total RAM
memory freeable:                                    102 MB   2% of total RAM
memory used + freeable threshold extreme:          3772 MB   95% of total RAM
memory used threshold red:                         3494 MB   88% of total RAM
memory used threshold green:                       3256 MB   82% of total RAM

FGT-Branch # show full-configuration system global | grep av-failopen
    set av-failopen pass
    set av-failopen-session disable`,
    options: ["They are allowed without antivirus scanning until the unit leaves conserve mode", "They are dropped until the unit leaves conserve mode", "They are scanned with the normal database instead of the extended database", "They are queued and scanned when memory becomes available"],
    answer: [0],
    explanation: "Memory used (88%) is above the red threshold, so the unit is in memory conserve mode. For proxy-based inspection, `av-failopen pass` (the default) bypasses the antivirus proxy, so new sessions pass unscanned until the unit leaves conserve mode. `off` would block new sessions that need the AV proxy, and `one-shot` keeps bypassing even after conserve mode ends, until the setting is changed or the unit restarts. FortiOS does not switch databases or queue sessions.\n\nFlow-based policies are not governed by `av-failopen`: in conserve mode, `config ips global` → `fail-open` decides (default `disable`, so the IPS engine drops new sessions that need flow inspection).",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-078",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "Outlook clients use MAPI to reach an on-premises Exchange server through a FortiGate policy with an antivirus profile. Malicious attachments are never detected in MAPI traffic. What is the most likely reason?",
    options: ["MAPI is inspected only by proxy-based antivirus, and the policy is flow-based", "MAPI is only scanned when the extreme database is enabled", "MAPI requires a separate FortiGuard licence", "MAPI scanning requires content disarm to be enabled"],
    answer: [0],
    explanation: "According to the 8.0 antivirus documentation, MAPI and SSH are inspected only in proxy-based mode. A flow-based policy (the default) never scans MAPI. There is no database or licence requirement, and CDR applies to HTTP and email protocols only in proxy mode, as an optional feature.",
    lesson: "3.4-antivirus-profiles-modes",
  },
  {
    id: "d3-079",
    topic: "3.4",
    type: "fill",
    difficulty: 2,
    stem: "What is the default value, in seconds, of `comfort-interval` in a protocol options profile?",
    answer: ["10", "10 seconds", "10s"],
    explanation: "Client comforting releases `comfort-amount` (default 1 byte) every `comfort-interval` (default 10 seconds) while a proxy-mode scan is buffering the file.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-080",
    topic: "3.4",
    type: "fill",
    difficulty: 2,
    stem: "To list antivirus logs from the CLI, the administrator runs `execute log filter category <n>` followed by `execute log display`. Which category number selects antivirus logs?",
    answer: ["2"],
    explanation: "Category 2 is antivirus (virus) logs, as used in the FortiOS 8.0 antivirus testing procedure. IPS logs are category 4.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-081",
    topic: "3.4",
    type: "multi",
    difficulty: 3,
    stem: "Refer to the exhibit. A proxy-based policy uses these profiles together with a full SSL inspection profile whose HTTPS port list is 443. Which two statements are true? (Choose two.)",
    exhibit: String.raw`FGT-HQ # show antivirus profile "AV-Proxy"
config antivirus profile
    edit "AV-Proxy"
        set feature-set proxy
        set scan-mode legacy
        config http
            set av-scan block
        end
    next
end

FGT-HQ # show firewall profile-protocol-options "PO-Staff"
config firewall profile-protocol-options
    edit "PO-Staff"
        set oversize-log enable
        config http
            set ports 80 8080
            set options clientcomfort oversize
            set oversize-limit 25
        end
    next
end`,
    options: ["HTTP traffic on TCP 8080 is scanned as HTTP", "A 40 MB file downloaded over HTTP is blocked and an oversize log is generated", "HTTPS on TCP 8443 is decrypted and scanned", "A 20 MB file downloaded over HTTP is passed without scanning", "Client comforting also applies to flow-based policies that reference PO-Staff"],
    answer: [0, 1],
    explanation: "Port 8080 is mapped to HTTP. With `options oversize`, files above 25 MB are blocked, and `oversize-log enable` logs them.\n\n- HTTPS on 8443 is not in the SSL profile's port list, so a proxy policy does not treat it as HTTPS.\n- A 20 MB file is under the limit and is scanned.\n- Client comforting is a proxy-mode feature.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-082",
    topic: "3.4",
    type: "single",
    difficulty: 2,
    stem: "A user pastes a screenshot of a customer spreadsheet into a GenAI chatbot. Which FortiOS 8.0.1 capability lets a DLP profile detect sensitive data in the image?",
    options: ["OCR-based content analysis in DLP", "Content disarm and reconstruction in the antivirus profile", "The extreme antivirus database", "Application control extended logging"],
    answer: [0],
    explanation: "8.0.1 adds **DLP with OCR-based content analysis**, which reads text embedded in images and screenshots so DLP rules can match it.\n\n- CDR removes active content from documents.\n- The extreme database adds old malware signatures.\n- Extended application control logs show the prompt, but cannot read images or block data based on content.",
    lesson: "3.4-protocol-options-av-troubleshooting",
  },
  {
    id: "d3-083",
    topic: "3.5",
    type: "single",
    difficulty: 1,
    stem: "A web server behind a FortiGate is hit by a TCP SYN flood. Which FortiGate feature is designed to detect and mitigate this kind of anomaly?",
    options: ["A DoS policy with a tcp_syn_flood anomaly threshold", "An IPS sensor filter with severity critical", "An application control sensor that blocks the HTTP application", "Botnet C&C scanning in the IPS sensor"],
    answer: [0],
    explanation: "Rate-based traffic anomalies such as floods, sweeps and port scans are handled by **DoS policies**, which are evaluated early in the packet flow. IPS sensors match exploit signatures inside sessions. Application control and botnet scanning do not measure SYN rates.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-084",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Machine-learning detection is enabled and the AI/ML package is installed. A client on a policy that uses this sensor starts a DNS tunnel that triggers DNS.Tunnelling (rule 58322). What does FortiGate do?",
    exhibit: String.raw`FGT-HQ # show ips sensor "IPS-Client"
config ips sensor
    edit "IPS-Client"
        config entries
            edit 1
                set rule 58322
                set status enable
                set action pass
            next
            edit 2
                set severity low medium high critical
                set status enable
                set action block
            next
        end
    next
end`,
    options: ["It allows the traffic and logs it, because entry 1 contains the signature and is evaluated first", "It blocks the traffic, because entry 2 includes severity low and block wins over pass", "It blocks the traffic, because ML-based signatures always block", "It allows the traffic without logging, because pass entries never log"],
    answer: [0],
    explanation: "IPS sensor entries are evaluated top-down, and the first entry containing a signature decides its action. Entry 1 explicitly sets rule 58322 to `pass`, with logging enabled by default, so the tunnel is allowed and logged. Block does not \"win\" over pass, ML-backed signatures follow the configured action, and `log` defaults to enable.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-085",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. The administrator expected DNS tunnels to be blocked. What must be changed?",
    exhibit: String.raw`date=2026-10-28 time=11:48:30 logid="0419016384" type="utm" subtype="ips"
eventtype="signature" level="alert" vd="root" severity="low"
srcip=10.0.1.88 srcintf="port2" dstip=192.0.2.53 dstport=53 dstintf="port1"
proto=17 service="DNS" policyid=10 action="detected" attack="DNS.Tunnelling"
attackid=58322 profile="all_default" msg="backdoor: DNS.Tunnelling"
ref="http://www.fortinet.com/ids/VID58322" crlevel="low"`,
    options: ["Add an entry for rule 58322 with action block to the sensor used by policy 10, because the signature's default action is pass", "Apply a full SSL inspection profile, because DNS tunnelling detection requires deep inspection", "Enable machine-learning-detection in config ips global", "Change policy 10 to proxy-based inspection"],
    answer: [0],
    explanation: "The log proves that detection works (`action=\"detected\"`). The predefined sensor `all_default` includes every signature with its **default** action, and DNS.Tunnelling (severity low, enabled by default) defaults to pass. Add rule 58322 with `action block` to the sensor on policy 10, above any broader entries. (The predefined `default` sensor would not even have logged it, because it only includes critical, high and medium signatures.)\n\n- Classic DNS is cleartext, and 8.0 supports detection with certificate inspection.\n- ML detection is clearly working already.\n- Proxy mode is not required.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-086",
    topic: "3.5",
    type: "multi",
    difficulty: 2,
    stem: "Which two are prerequisites for the FortiOS 8.0 AI/ML-based DNS tunnelling detection? (Choose two.)",
    options: ["An active IPS subscription, so that the AI/Machine Learning IPS Definitions package can be downloaded", "machine-learning-detection enabled under config ips global", "A full SSL inspection profile on the policy", "Proxy-based inspection on the policy", "A DNS filter profile with botnet C&C domain blocking enabled"],
    answer: [0, 1],
    explanation: "The feature needs the IPS subscription and the AI/ML IPS Definitions package, `machine-learning-detection enable` (the default), and the `DNS.Tunnelling` signature in an IPS sensor on a policy. Deep inspection is not required, and certificate inspection and proxy-mode policies are both supported. A DNS filter is a separate feature.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-087",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "What does the FortiOS 8.0 enhancement \"Expanded CASB SaaS application database\" provide?",
    options: ["A much larger FortiGuard SaaS application database (more than 2,700 applications) for inline CASB profiles", "An extended IPS signature database for SaaS server vulnerabilities", "A FortiGuard web filter category that groups all SaaS applications", "An antivirus database tier for malware hosted on SaaS storage"],
    answer: [0],
    explanation: "The 8.0 feature *Expanded CASB SaaS application database* grows the FortiGuard CASB database to more than 2,700 SaaS applications, so inline CASB (a proxy-only profile) can control many more services. It is delivered from FortiGuard (FDS) to devices with the Firmware & General Updates licence and viewed under Security Profiles → Inline-CASB → SaaS Application. It is not an IPS, web filter or AV database.\n\nThis is the 8.0 feature that best matches the exam topic \"FortiGuard Extended SaaS DB\"; Fortinet's 8.0 documentation does not use that exact phrase.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-088",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Users report slow throughput during business hours. What should the administrator do next to confirm that IPS inspection load is the cause?",
    exhibit: String.raw`FGT-HQ # get system performance status
CPU states: 91% user 6% system 0% nice 3% idle 0% iowait 0% irq 0% softirq
CPU0 states: 93% user 5% system 0% nice 2% idle 0% iowait 0% irq 0% softirq
CPU1 states: 89% user 7% system 0% nice 4% idle 0% iowait 0% irq 0% softirq
Memory: 4055272k total, 2433163k used (60.0%), 1216581k free (30.0%), 405528k freeable (10.0%)

FGT-HQ # diagnose sys top 2 10
Run Time:  41 days, 2 hours and 17 minutes
91U, 0N, 6S, 3I, 0WA, 0HI, 0SI, 0ST; 3960T, 1188F
       ipsengine     1844      R      88.4     6.1
       ipsengine     1845      R      85.9     5.9
         wad         1201      S       1.2     2.0
       miglogd       2210      S       0.8     0.9`,
    options: ["Run diagnose test application ipsmonitor 5 to put the IPS engine in bypass briefly and check whether the CPU usage drops", "Run diagnose test application ipsmonitor 99 to restart the IPS engines, which permanently fixes the load", "Enable fail-open under config ips global, because fail-open reduces CPU usage", "Enable memory conserve mode manually to protect the IPS engine"],
    answer: [0],
    explanation: "CPU time is in **user** space, and `diagnose sys top` shows two `ipsengine` processes near 90%. The documented test is to toggle bypass with `ipsmonitor 5`. The engine keeps running but stops inspecting. If the CPU then drops, the inspected volume is too high for the current design and model. Toggle it back immediately afterwards.\n\n- Restarting the engines does not change the load.\n- Fail-open only decides what happens when the IPS buffer is full (or the unit is in conserve mode); it does not reduce CPU usage.\n- Conserve mode is a memory protection state, not something you enable.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-089",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. During a traffic peak, the IPS engine cannot keep up and its socket buffer fills. Sessions on this unit are not offloaded to NTurbo. What happens to traffic that needs IPS inspection?",
    exhibit: String.raw`FGT-HQ # show ips global
config ips global
    set fail-open enable
end`,
    options: ["It passes without IPS inspection until the engine catches up", "It is dropped until the engine catches up", "It is redirected to the proxy daemons for inspection", "The IPS engines restart automatically and all sessions are reset"],
    answer: [0],
    explanation: "With `fail-open enable`, a full IPS socket buffer causes traffic to **pass uninspected**. Availability is preserved at the cost of security. With the default `disable`, those packets are dropped. Sessions offloaded to NTurbo cannot fail open and are dropped regardless, which is why the stem rules them out.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-090",
    topic: "3.5",
    type: "fill",
    difficulty: 2,
    stem: "Which option number of `diagnose test application ipsmonitor` toggles the IPS engine bypass status?",
    answer: ["5", "diagnose test application ipsmonitor 5", "diag test app ipsmonitor 5"],
    explanation: "`diagnose test application ipsmonitor 5` toggles bypass (the output shows `bypass: enable` or `bypass: disable`). Other options: 1 shows engine information, 97 and 98 start and stop all engines, and 99 restarts all engines and the monitor.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-091",
    topic: "3.5",
    type: "order",
    difficulty: 2,
    stem: "Place the steps for troubleshooting suspected IPS engine high CPU in a logical order.",
    items: ["Check overall CPU usage and its user/system split with get system performance status", "Identify the busiest processes with diagnose sys top", "Toggle IPS bypass with diagnose test application ipsmonitor 5 and compare the CPU usage", "Run ipsmonitor 5 again to disable bypass and restore inspection", "Reduce the load: targeted sensors on only the policies that need them, packet logging off, hardware acceleration enabled"],
    explanation: "Measure first, then identify the process, then prove the cause with a short bypass test, restore inspection straight away, and only then change the design. Leaving bypass on would leave traffic uninspected.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-092",
    topic: "3.5",
    type: "match",
    difficulty: 2,
    stem: "Match each IPS sensor setting to its effect.",
    pairs: [["action default", "Use each signature's own recommended action"], ["status enable", "Turn on matching signatures even if they are disabled by default"], ["log-packet enable", "Save the packets that triggered the signature"], ["quarantine attacker", "Ban the attacker's IP address for a configured period"], ["rate-count with rate-duration", "Act only when the signature fires a set number of times within the period"], ["scan-botnet-connections block", "Drop connections to known botnet C&C servers"]],
    explanation: "`action default` and `status default` defer to FortiGuard's per-signature defaults. `status enable` overrides them. Packet logging needs a disk or FortiAnalyzer. Quarantine bans the source for `quarantine-expiry` (default 5m). Rate settings turn a signature into a threshold. Botnet scanning is set at the sensor level (disable, block or monitor).",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-093",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement about entry 2 is true?",
    exhibit: String.raw`FGT-HQ # show ips sensor "IPS-DMZ-Web"
config ips sensor
    edit "IPS-DMZ-Web"
        set scan-botnet-connections block
        config entries
            edit 2
                set location server
                set severity medium high critical
                set protocol HTTP
                set os Linux
                set status enable
                set action block
            next
        end
    next
end`,
    options: ["It includes only signatures that target servers, use HTTP, apply to Linux and have medium, high or critical severity, and enables them even if they are disabled by default", "It includes every signature that matches at least one of the selected attributes", "It only includes signatures that are enabled by default, because status enable keeps the default status", "It blocks only signatures whose default action is block"],
    answer: [0],
    explanation: "A filter entry includes a signature only if it matches **all** of the selected attributes (location AND severity AND protocol AND OS). `status enable` turns on matching signatures that are disabled by default, and `action block` overrides each signature's default action. Using `status default` and `action default` would keep FortiGuard's defaults.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-094",
    topic: "3.5",
    type: "multi",
    difficulty: 2,
    stem: "A FortiGate's IPS engine is consistently overloaded. Which two changes reduce IPS CPU usage without lowering protection where it is needed? (Choose two.)",
    options: ["Replace sensors that enable all signatures with filters targeted at the protected assets' location, OS and protocols", "Remove IPS from high-volume trusted internal flows that do not need it", "Enable packet logging on every sensor entry", "Set engine-count to 1", "Set fail-open disable", "Apply full SSL inspection to every policy"],
    answer: [0, 1],
    explanation: "Fewer, more relevant signatures and less unnecessary inspected traffic cut the IPS engine's work directly.\n\n- Packet logging adds load.\n- `engine-count 0` (the default) lets FortiOS choose the optimum number of engines; forcing 1 usually makes things worse.\n- Fail-open only decides what happens when the engine is overloaded.\n- Blanket deep inspection adds decryption load.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-095",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "Refer to the exhibit from a newly deployed FortiGate with a valid IPS licence. So far, its policies use only web filter and application control profiles. Why have the attack definitions not been updated?",
    exhibit: String.raw`FGT-HQ # diagnose autoupdate versions | grep -A 6 "Attack Definitions"
Attack Definitions
---------
Version: 6.00741 signed
Contract Expiry Date: Thu Jan  3 2030
Last Updated using manual update on Mon Jan  1 00:00:00 2001
Last Update Attempt: Wed Oct 28 13:02:22 2026
Result: No Updates`,
    options: ["FortiGuard only delivers IPS packages once at least one firewall policy uses an IPS sensor", "The extended IPS database must be enabled before updates are downloaded", "machine-learning-detection is disabled, which blocks signature updates", "IPS fail-open is disabled, which prevents updates"],
    answer: [0],
    explanation: "The contract is valid until 2030, but the package has never been updated. The 8.0 documentation notes that at least one policy with an IPS-enabled security profile must exist before IPS definition updates are downloaded. Add an IPS sensor to a policy and run `execute update-now`. The database size, ML detection and fail-open do not control downloads.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-096",
    topic: "3.5",
    type: "single",
    difficulty: 2,
    stem: "An IPS signature blocks legitimate traffic from an internal vulnerability scanner at 10.0.30.5 to one application server. Every other host must stay protected by the same signature. What is the best fix?",
    options: ["Add a signature entry for that signature with action block above the filters, and give it an exempt IP for source 10.0.30.5 and the server as destination", "Change the sensor's filter entry action to pass", "Remove the IPS sensor from the policy", "Enable fail-open under config ips global"],
    answer: [0],
    explanation: "A signature entry placed above the filters takes over that one signature (entries are evaluated top-down). Its Exempt IPs (`config exempt-ip`, available on signature entries) skip it only for the specified source/destination pair, so every other host stays protected by the same signature. Changing the whole filter to pass or removing the sensor weakens protection for every host, and fail-open is unrelated to false positives. Report the false positive to FortiGuard as well.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
  {
    id: "d3-097",
    topic: "3.5",
    type: "fill",
    difficulty: 2,
    stem: "Which `config ips global` attribute must be enabled (it is by default) for AI/ML-based IPS detection such as DNS tunnelling detection?",
    answer: ["machine-learning-detection", "set machine-learning-detection enable", "set machine-learning-detection"],
    explanation: "`set machine-learning-detection enable` (default enable) lets the IPS engine apply the AI/Machine Learning IPS Definitions package. Its version is shown as IPS-MLDB in `get system status`.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-098",
    topic: "3.5",
    type: "single",
    difficulty: 1,
    stem: "An administrator wants an IPS sensor to drop outgoing connections to known botnet command-and-control servers. Which sensor setting does this?",
    options: ["set scan-botnet-connections block", "set block-malicious-url enable", "set extended-log enable", "set quarantine attacker"],
    answer: [0],
    explanation: "`scan-botnet-connections` (disable, block or monitor) checks outgoing connections against the FortiGuard botnet C&C IP database. `block-malicious-url` uses the local malicious URL database. `extended-log` only adds log detail, and `quarantine` is a per-entry action.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-099",
    topic: "3.5",
    type: "multi",
    difficulty: 2,
    stem: "Which two statements about IPS and encrypted traffic are true? (Choose two.)",
    options: ["Exploits carried inside an HTTPS payload can only be matched when the policy performs full SSL inspection", "To inspect inbound HTTPS to your own server, use a Protecting SSL Server profile with the server's certificate and key", "DNS tunnelling detection requires full SSL inspection", "With certificate inspection, the IPS engine cannot see any part of the TLS handshake", "IPS sensors require a proxy-based policy to inspect HTTPS"],
    answer: [0, 1],
    explanation: "IPS needs the cleartext to match payload signatures, so HTTPS exploits require deep inspection. For servers you own, that means replace mode with the server certificate.\n\n- DNS tunnelling (classic DNS) does not need deep inspection.\n- With certificate inspection, the handshake is still visible to the IPS engine.\n- IPS works on both flow and proxy policies.",
    lesson: "3.5-ips-sensors",
  },
  {
    id: "d3-100",
    topic: "3.5",
    type: "single",
    difficulty: 1,
    stem: "Refer to the exhibit. Which statement is true?",
    exhibit: String.raw`1: date=2026-10-28 time=16:41:09 eventtime=1793223669000000000 tz="-0500"
logid="0419016384" type="utm" subtype="ips" eventtype="signature"
level="alert" vd="root" severity="high" srcip=10.0.1.37 srcport=50812
srcintf="port2" dstip=203.0.113.77 dstport=443 dstintf="port1" proto=6
service="HTTPS" policyid=10 sessionid=120934 action="dropped"
attack="Backdoor.Cobalt.Strike" attackid=57293 profile="IPS-Client"
ref="http://www.fortinet.com/ids/VID57293"
msg="backdoor: Backdoor.Cobalt.Strike" crscore=30 craction=8192 crlevel="high"`,
    options: ["IPS sensor IPS-Client on policy 10 dropped traffic in a session from the internal host 10.0.1.37 that matched a high-severity backdoor signature", "The traffic was detected and allowed, because the severity is only high, not critical", "The session was reset by the application control sensor IPS-Client", "An external host at 203.0.113.77 opened a connection to the internal network, and the attack was dropped"],
    answer: [0],
    explanation: "`subtype=\"ips\"` with `action=\"dropped\"` means the IPS sensor named in `profile` (IPS-Client) blocked the session on `policyid=10`. The session source is the internal client 10.0.1.37 (port2) connecting out to 203.0.113.77:443 (port1), which is typical of a backdoor beaconing to its C2 server.\n\n- Severity does not determine the action; a `pass` entry would log `action=\"detected\"`.\n- This is an IPS log, not application control.\n- `srcip`/`srcintf` show that the internal host opened the session, not the external one.",
    lesson: "3.5-ips-operations-troubleshooting",
  },
];
