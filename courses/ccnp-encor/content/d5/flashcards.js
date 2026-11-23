// Domain 5 — Security. Original flashcards (facts checked against RFC 2865/2866, 8907, 3748, 5176, 6749, 9110 and 6585, IEEE 802.1AE values from the Linux kernel MACsec code, and the IOS XE 17.18.1 YANG models; Cisco-specific details marked in REVIEW-TODO.md). All secrets are placeholders.
let n = 0;
const c = (topic, front, back) => ({ id: `d5-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 5.1.a
  c('5.1', 'Password types 0, 5, 7, 8, 9 (and 6)?', '0 plaintext; 7 reversible obfuscation; 5 salted MD5; 8 PBKDF2-SHA-256; 9 scrypt; 6 AES, reversible on the device with its master key. Use 8 or 9 for secrets.'),
  c('5.1', 'Create a local admin with a type 9 secret?', '`username netadmin privilege 15 algorithm-type scrypt secret <SECRET>` (`algorithm-type sha256` gives type 8). The config then shows `secret 9 <HASH>`.'),
  c('5.1', '`enable secret` and `enable password` both set?', '`enable secret` wins; `enable password` is ignored. Configure only the secret.'),
  c('5.1', 'What does `service password-encryption` do, and undo?', 'Encodes type 0 passwords as type 7 (reversible). Does not touch secrets. `no service password-encryption` does not decode existing type 7 strings.'),
  c('5.1', '`login` vs `login local` vs `no login` (no AAA)?', '`login`: line password. `login local`: username database. `no login`: no authentication. A vty with `login` but no password refuses connections.'),
  c('5.1', 'Default privilege levels?', '0: disable, enable, exit, help, logout. 1: user EXEC (`>`). 15: privileged EXEC (`#`). 2-14 empty until you move commands with `privilege exec level N ...`.'),
  c('5.1', 'SSH on IOS XE, minimum steps?', '`hostname`, `ip domain name`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`, a local user, then `login local` and `transport input ssh` on every vty range.'),
  c('5.1', '`exec-timeout` default?', '10 minutes (`exec-timeout 10 0`). `exec-timeout 0 0` never times out: avoid it.'),
  c('5.1', 'Why `vrf-also` on `access-class ... in`?', 'Without it the access class covers only global-table connections, and sessions arriving through a VRF interface (Mgmt-vrf, Mgmt-intf) are refused.'),
  c('5.1', '`login block-for 120 attempts 3 within 60`?', 'Three failures within 60 s trigger 120 s of quiet mode refusing logins; exempt management hosts with `login quiet-mode access-class ACL`. Check with `show login`.'),
  // 5.1.b
  c('5.1', 'What does `aaa new-model` change at once?', 'Lines stop using `login` / `login local` / line passwords and use method lists. With no default list, vty uses the local database and the console is unauthenticated.'),
  c('5.1', 'When does AAA try the next method in a list?', 'Only on ERROR (no response, timeout, unreachable). A reject (FAIL) stops authentication; local is never tried after a reject.'),
  c('5.1', '`local` vs `local-case`?', 'Both use the username database; `local-case` makes the username case-sensitive. Passwords are always case-sensitive.'),
  c('5.1', 'Modern TACACS+ server definition?', '`tacacs server NAME`, `address ipv4 A.B.C.D`, `key <TACACS-KEY>`; group with `aaa group server tacacs+ GRP` and `server name NAME`.'),
  c('5.1', 'Modern RADIUS server definition?', '`radius server NAME`, `address ipv4 A.B.C.D auth-port 1812 acct-port 1813`, `key <RADIUS-KEY>`; group with `aaa group server radius GRP`.'),
  c('5.1', 'RADIUS vs TACACS+?', 'RADIUS: UDP 1812/1813, only password hidden, authn+authz combined, RFC 2865/2866, network access. TACACS+: TCP 49, whole body obfuscated, A/A/A separate, per-command authorization, RFC 8907.'),
  c('5.1', 'Users authenticate via TACACS+ but land at level 1?', 'Add `aaa authorization exec default group GRP local` so the device requests the shell profile (`priv-lvl=15`).'),
  c('5.1', 'AAA lockout trap and its fix?', '`aaa authentication login default group GRP` with no fallback also covers the console; if servers are unreachable nobody logs in. End with `local` and give the console its own list.'),
  c('5.1', 'Verify AAA?', '`test aaa group GRP user <SECRET> new-code`, `show aaa servers` (UP/DEAD, accepts, rejects, timeouts), `show tacacs`, `debug aaa authentication`.'),
  // 5.2.a
  c('5.2', 'IPv4 ACL number ranges?', 'Standard 1-99 and 1300-1999. Extended 100-199 and 2000-2699.'),
  c('5.2', 'Wildcard for 10.1.16.0/20?', '0.0.15.255 (255 minus each mask octet of 255.255.240.0). Covers 10.1.16.0-10.1.31.255.'),
  c('5.2', 'What does `established` match?', 'TCP segments with ACK or RST set (not the first SYN). No state tracking; TCP only.'),
  c('5.2', 'Do outbound ACLs filter router-generated packets?', 'No. Pings, routing updates, syslog and AAA packets originated by the router pass outbound ACLs unchecked.'),
  c('5.2', 'Where to place standard and extended ACLs?', 'Extended close to the source; standard close to the destination (they match only the source).'),
  c('5.2', 'Why add `deny ip any any log`?', 'The implicit deny has no counter or log. An explicit final deny counts and logs drops (`%SEC-6-IPACCESSLOGP`).'),
  c('5.2', 'IPv6 ACL implicit entries?', '`permit icmp any any nd-na`, `permit icmp any any nd-ns`, `deny ipv6 any any`. An explicit final deny blocks ND unless you permit nd-na/nd-ns above it.'),
  c('5.2', 'VACL syntax and trap?', '`vlan access-map NAME 10`, `match ip address ACL`, `action drop`; sequence 20 `action forward`; `vlan filter NAME vlan-list N`. Implicit drop at the end.'),
  c('5.2', 'Switch filter order (inbound, routed packet)?', 'PACL on the port, then the ingress VLAN\'s VACL, then the RACL on the SVI; after routing, outbound RACL, then the egress VLAN\'s VACL.'),
  // 5.2.b
  c('5.2', 'Router CoPP building blocks?', 'ACLs, `class-map` with `match access-group name`, `policy-map` with `police ... conform-action transmit exceed-action drop`, then `control-plane` / `service-policy input PM`.'),
  c('5.2', 'A `deny` entry in a CoPP class ACL does what?', 'Nothing is dropped: the packet just does not match that class and moves on, ending in `class-default` if nothing else matches.'),
  c('5.2', 'Catalyst 9000 CoPP?', '`system-cpp-policy` applied by default, cannot be replaced; change system class rates (pps), restore with `cpp system-default`; verify with `show policy-map control-plane`.'),
  // 5.3
  c('5.3', 'Catalyst Center API token flow?', '`POST /dna/system/api/v1/auth/token` with Basic auth returns `{"Token": ...}`; send it in the `X-Auth-Token` header; it lasts 60 minutes.'),
  c('5.3', '401 vs 403?', '401: not authenticated (missing, wrong or expired credentials/token). 403: authenticated or known, but not allowed (role lacks permission). 429: rate limited.'),
  // 5.4
  c('5.4', 'Secure Network Analytics and ETA?', 'Formerly Stealthwatch: NetFlow/IPFIX behavioural analytics. Encrypted Traffic Analytics finds malware in encrypted flows from metadata, without decryption.'),
  c('5.4', 'Secure Endpoint retrospection?', 'Formerly AMP for Endpoints: if a file\'s verdict later changes to malicious, it raises a retrospective detection; file trajectory shows every device that has it.'),
  c('5.4', '802.1X roles and protocols?', 'Supplicant (endpoint) - EAPOL (0x888E) - authenticator (switch/WLC) - RADIUS carrying EAP - authentication server (ISE).'),
  c('5.4', 'NGFW deployment modes?', 'Routed (L3 hop, NAT, VPN), transparent (L2 bump in the wire), inline set (inline IPS, can drop), passive (copy from SPAN, alert only).'),
  c('5.4', 'TrustSec in three steps?', 'Classify (ISE dynamic or static IP/VLAN/port), propagate (inline CMD tag 0x8909 or SXP over TCP 64999), enforce SGACLs at egress. SGT = 16 bits.'),
  c('5.4', 'MACsec frame overhead and keys?', 'SecTAG (EtherType 0x88E5) 16 bytes with SCI + 16-byte ICV = 32 bytes. CAK (master), CKN (its name), SAK (encrypts). Keys via MKA (802.1X-2010) or Cisco SAP.'),
];
