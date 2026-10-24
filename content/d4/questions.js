export default [
  // ---------------------------------------------------------------- 4.1
  {
    id: 'd4-001',
    topic: '4.1',
    type: 'single',
    difficulty: 1,
    stem: "Which IOS password storage type can be converted back to clear text with freely available tools in seconds?",
    options: ['Type 5', 'Type 7', 'Type 8', 'Type 9'],
    answer: [1],
    explanation: "**Type 7** is the reversible Cisco obfuscation produced by `service password-encryption`; it only protects against shoulder surfing. **Type 5** is a salted MD5 hash: one-way, but fast to brute-force, so it is legacy. **Type 8** (PBKDF2-SHA-256) and **type 9** (scrypt) are strong one-way hashes and the recommended choices.",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-002',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user on the console of R1 types `enable`. Which statement is true?",
    exhibit: `R1# show running-config | include enable|username|service password
service password-encryption
enable secret 9 $9$Lr3Xq0Pz8n2KcE$uS0wGq7TfJr3o1sTqVY5mZk2N9bLh0XcPq4dWe8RyA6
enable password 7 0822455D0A16544541
username opsadmin privilege 15 password 7 13061E010803557878`,
    options: [
      "Only the password that produced the type 9 enable secret is accepted.",
      "Either the enable password or the enable secret is accepted.",
      "Only the enable password is accepted because type 7 is processed before type 9.",
      "The type 9 value was created by service password-encryption from a plain-text enable secret.",
    ],
    answer: [0],
    explanation: "When both exist, **`enable secret` always takes precedence** and the `enable password` is ignored, so only the secret works. IOS never accepts either one interchangeably, and there is no type-based processing order. `service password-encryption` only produces **type 7** from plain-text passwords (here the enable password and the opsadmin password); it never creates type 9 hashes, which come from `enable secret` itself (current IOS XE default) or `algorithm-type scrypt`. Also note that opsadmin's password is type 7 and therefore trivially reversible; it should be reconfigured with `secret`.",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-003',
    topic: '4.1',
    type: 'order',
    difficulty: 2,
    stem: "R1 has `aaa authentication login default group TACACS-GRP local`. TACACS-GRP contains ISE-1 and ISE-2, and both servers are powered off. Put the events of an administrator's SSH login in order.",
    items: [
      "The SSH session is established to R1 on TCP 22 and the user enters a username and password",
      "R1 sends the authentication request to ISE-1 and the request times out",
      "R1 sends the authentication request to ISE-2 and the request times out",
      "R1 treats the group method as an ERROR and moves to the next method in the list",
      "R1 checks the local username database and grants access if the credentials match",
    ],
    explanation: "The method list is evaluated left to right. Inside the group, servers are tried in the order they are listed. Only when **no server in the group answers** does the group return an ERROR, which is the sole condition that makes IOS move on to `local`. If either server had answered with a reject, that would be a FAIL and `local` would never be tried.",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-004',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "Which global configuration command enables the AAA security model on an IOS XE device (the command that must exist before any `aaa authentication` method list can be configured)?",
    answer: ['aaa new-model'],
    explanation: "`aaa new-model` turns on AAA. After it is entered, AAA method lists control logins and the old line-level `login local` behavior no longer applies to the VTY lines. Create a local privilege 15 account and keep a console session open before entering it to avoid locking yourself out.",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-005',
    topic: '4.1',
    type: 'multi',
    difficulty: 1,
    stem: "Which two statements describe TACACS+ when compared with RADIUS? (Choose two.)",
    options: [
      "It uses TCP port 49.",
      "It encrypts the entire body of the packet.",
      "It uses UDP ports 1812 and 1813.",
      "It combines authentication and authorization in a single reply.",
      "It encrypts only the user password attribute.",
      "It is the usual choice for 802.1X network access control.",
    ],
    answer: [0, 1],
    explanation: "TACACS+ runs over **TCP 49** and **encrypts the whole payload** (only the header is clear). The other options all describe **RADIUS**: UDP 1812/1813, authentication and authorization combined in the Access-Accept, only the password attribute encrypted, and the standard protocol for 802.1X and other network access. TACACS+ is preferred for device administration because it separates the three AAA functions and supports per-command authorization.",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-006',
    topic: '4.1',
    type: 'match',
    difficulty: 1,
    stem: "Match each line configuration command to its effect.",
    pairs: [
      ['transport input ssh', 'Permits only SSH sessions on the lines'],
      ['login local', 'Checks credentials against the local username database'],
      ['exec-timeout 5 0', 'Disconnects a session after five idle minutes'],
      ['access-class MGMT in', 'Limits which source addresses may open sessions to the lines'],
      ['login', 'Uses the password configured on the line itself'],
    ],
    explanation: "`transport input ssh` blocks Telnet. `login local` uses `username` entries; plain `login` uses the line `password` and ignores usernames. `exec-timeout` takes minutes then seconds. `access-class ... in` applies an ACL to incoming VTY sessions (the line equivalent of `ip access-group`).",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-007',
    topic: '4.1',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. An engineer is enabling SSH on a new router. Which command must be entered before the key generation will succeed?",
    exhibit: `Router(config)# hostname R1
R1(config)# crypto key generate rsa modulus 2048
% Please define a domain-name first.`,
    options: [
      'ip domain name corp.example.com',
      'ip ssh version 2',
      'ip name-server 10.10.1.53',
      'ip domain lookup',
    ],
    answer: [0],
    explanation: "The RSA key pair is named `hostname.domain`, so IOS needs a domain name. `ip domain name` is the current IOS XE syntax; the older `ip domain-name` is still accepted (and the error message still uses that spelling). `ip ssh version 2` is configured after or alongside the keys and does not create them. `ip name-server` and `ip domain lookup` control DNS resolution, which SSH key generation does not need.",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-008',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. ISE-1 is reachable. A network AI assistant analyzed why the local account `breakglass` cannot log in to R1. Which assessment of the assistant's output is correct?",
    exhibit: `R1 configuration (excerpt)
aaa new-model
tacacs server ISE-1
 address ipv4 10.1.100.10
 key 7 <removed>
aaa group server tacacs+ TACACS-GRP
 server name ISE-1
aaa authentication login default group TACACS-GRP local
username breakglass privilege 15 secret 9 <removed>

ISE-1 live log
 Device R1 (10.1.255.1)  User breakglass  Result: FAILED  Reason: 22056 Subject not found in the applicable identity store(s)

AI assistant
 "ISE rejected breakglass because the user does not exist on ISE. With 'local'
  configured after the TACACS+ group, R1 should then have checked its local
  database. Because it did not, the AAA process is stuck. Recommended action:
  reload R1 during a maintenance window."`,
    options: [
      "The assistant is wrong: a reject from a reachable server is a FAIL, which ends authentication; local is used only when no TACACS+ server responds, so a reload will not change anything.",
      "The assistant is correct: a reject from TACACS+ should trigger the local method, so the AAA process must be reset.",
      "The assistant is wrong: local must be listed before the TACACS+ group for any fallback to occur, so the method list should be reversed.",
      "The assistant is wrong: type 9 secrets cannot be used with AAA, so the breakglass account must be reconfigured with a type 7 password.",
    ],
    answer: [0],
    explanation: "IOS moves to the next method only on an **ERROR** (no response from any server in the group). ISE answered with a reject, which is a **FAIL**, so authentication stops and `local` is never tried. This is working as designed and a reload changes nothing. Listing `local` first is not required for fallback (fallback works fine on ERROR) and would make the local database the primary source, defeating central AAA. Type 9 secrets work normally with AAA local authentication; type 7 would be a security downgrade. To use breakglass while ISE is up, the account must exist on ISE (or the break-glass login must use a different method list, for example on the console).",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-009',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Five administrators from 10.99.0.0/24 are connected to R1 by SSH. A contractor at 10.200.1.9 then logs in successfully with a valid local account, although only 10.99.0.0/24 should be able to manage R1. What is the cause?",
    exhibit: `R1# show running-config | section line vty
line vty 0 4
 access-class MGMT in
 exec-timeout 10 0
 login local
 transport input ssh
line vty 5 15
 exec-timeout 10 0
 login local
 transport input ssh
R1# show ip access-lists MGMT
Standard IP access list MGMT
    10 permit 10.99.0.0, wildcard bits 0.0.0.255 (57 matches)`,
    options: [
      "The access-class is applied only to VTY lines 0-4; the contractor's session landed on line 5, which has no access-class.",
      "The MGMT ACL has no explicit deny statement, so all other sources are permitted.",
      "transport input ssh overrides the access-class on all lines.",
      "access-class filters only Telnet sessions; SSH must be filtered with ip access-group.",
    ],
    answer: [0],
    explanation: "With lines 0-4 busy, the next session uses line 5, and `line vty 5 15` has no `access-class`. Apply `access-class MGMT in` to `line vty 5 15` too (or configure `line vty 0 15`). The implicit deny at the end of MGMT would have blocked 10.200.1.9 on lines 0-4; an explicit deny is not needed. `transport input` and `access-class` are independent; both apply. `access-class` filters every inbound VTY session regardless of protocol, while `ip access-group` is an interface command.",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-010',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Security policy requires that every command entered at privilege level 15 on the routers be checked against the AAA server before it runs, so that the help desk can be blocked from commands such as `reload`. Which configuration meets the requirement?",
    options: [
      "TACACS+ servers with `aaa authorization commands 15 default group TACACS-GRP local`",
      "RADIUS servers with `aaa authorization commands 15 default group RAD-GRP local`",
      "TACACS+ servers with `aaa authorization exec default group TACACS-GRP local` only",
      "RADIUS servers with `aaa accounting commands 15 default start-stop group RAD-GRP`",
    ],
    answer: [0],
    explanation: "Per-command authorization is a **TACACS+** capability: with `aaa authorization commands 15`, each level 15 command is sent to the server for approval. RADIUS has no native per-command authorization, so the RADIUS command-authorization option does not deliver the requirement. `aaa authorization exec` only decides whether the user gets a shell and at what privilege level; it does not check individual commands. Accounting only **records** commands after the fact; it cannot block them.",
    lesson: '4.1-aaa',
  },
  // ---------------------------------------------------------------- 4.2
  {
    id: 'd4-011',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "An engineer runs `copy running-config scp://netadmin@10.1.50.25/backups/R1-confg` on R1. Which statement is true?",
    options: [
      "R1 acts as the SCP client; `ip scp server enable` is not required on R1, but 10.1.50.25 must run an SSH/SCP server.",
      "R1 acts as the SCP server, so `ip scp server enable` must be configured on R1 first.",
      "The file is sent over UDP port 69 after the username is authenticated over SSH.",
      "The password is sent in clear text, but the configuration file is encrypted.",
    ],
    answer: [0],
    explanation: "When the device initiates the copy, it is the **client** and connects to the SSH/SCP server on 10.1.50.25 over TCP 22. `ip scp server enable` is needed only when someone pushes files **to** R1 from another host. SCP never uses UDP 69 (that is TFTP). SSH encrypts both the authentication exchange and the file contents.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-012',
    topic: '4.2',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. SSH logins to R1 as netadmin work. An administrator tries to push an image from a laptop with `scp image.bin netadmin@10.1.1.1:flash:/image.bin`, and the transfer fails immediately. Which two commands must be added to R1? (Choose two.)",
    exhibit: `R1# show running-config | include aaa|scp|username|ssh
aaa new-model
aaa authentication login default local
username netadmin privilege 15 secret 9 <removed>
ip ssh version 2`,
    options: [
      'ip scp server enable',
      'aaa authorization exec default local',
      'aaa authorization commands 15 default local',
      'transport input scp',
      'ip ssh version 1',
    ],
    answer: [0, 1],
    explanation: "The IOS SCP server is off until `ip scp server enable` is configured. It also requires **AAA exec authorization** so the authenticated user is placed directly at its privilege level (15) without an interactive `enable`; add `aaa authorization exec default local` (without it, netadmin's privilege 15 is not even applied at SSH login under `aaa new-model`). Command authorization is not required for SCP. `transport input scp` is not a valid option; SCP rides on SSH, which `transport input ssh` already covers. Downgrading to SSHv1 would only weaken security.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-013',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The engineer copied a new image to R1 with SCP and checked it against the MD5 value published by Cisco. What should the engineer do next?",
    exhibit: `R1# verify /md5 flash:isr4300-universalk9.17.12.04.SPA.bin 7c1f3be2d0a94e6b8f25c3d1a0e9b47d
..........................................................Done!
%Error verifying flash:isr4300-universalk9.17.12.04.SPA.bin
Computed signature  = 4e0a91d72f3c58b6a1d09e7f2c3b8a65
Submitted signature = 7c1f3be2d0a94e6b8f25c3d1a0e9b47d`,
    options: [
      "Delete the file, copy the image again, and re-run the verification before changing the boot variable.",
      "Set the boot variable to the new image; the MD5 check is advisory and the signature is validated again at boot.",
      "Run `verify /md5` without the hash argument, because supplying the hash causes a false mismatch.",
      "Reload the router so the flash file system recalculates the checksum.",
    ],
    answer: [0],
    explanation: "A mismatch between the computed and published hash means the file is corrupted or not the expected file. Never boot from it: delete it, transfer it again and verify again. Pointing the boot variable at an unverified image risks a failed boot or a tampered image. Omitting the hash argument just prints the computed hash; it would still differ from the published value. A reload does not change the file contents.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-014',
    topic: '4.2',
    type: 'order',
    difficulty: 2,
    stem: "Put the steps of a bundle-mode IOS XE router software upgrade in the correct order.",
    items: [
      "Check available space with show flash:",
      "Copy the image with copy scp://netadmin@10.1.50.25/images/new.bin flash:",
      "Run verify /md5 flash:new.bin against the published hash",
      "Configure boot system flash:new.bin (after removing old boot entries)",
      "Save the configuration with write memory",
      "Reload the router and confirm the release with show version",
    ],
    explanation: "Confirm space before transferring, verify integrity before trusting the file, set the boot variable only for a verified image, save so the boot variable survives the reload, then reload and confirm. Skipping `write memory` means the router reloads with the old boot statements from the startup configuration.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-015',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The backup file does not contain any configuration for Loopback99. After the copy completes, Loopback99 still exists with its IP address. Why?",
    exhibit: `R1# copy scp://netadmin@10.1.50.25/backups/R1-confg running-config
Destination filename [running-config]?
Password:
!
2847 bytes copied in 0.711 secs (4004 bytes/sec)`,
    options: [
      "Copying a file into running-config merges it with the current configuration rather than replacing it.",
      "SCP transfers only the lines that differ from the startup configuration.",
      "Loopback interfaces cannot be removed by a configuration file and must be deleted manually with a reload.",
      "The copy failed silently because the file was smaller than the running configuration.",
    ],
    answer: [0],
    explanation: "A copy into `running-config` is treated like typing the file's commands at the CLI: commands are **added or changed**, but nothing absent from the file is removed. To make the running configuration match the file exactly, use `configure replace`. SCP copies the whole file, not a diff. Loopbacks can be removed with `no interface Loopback99` at any time. The output shows a successful copy; file size has nothing to do with it.",
    lesson: '4.2-secure-file-transfer',
  },
  // ---------------------------------------------------------------- 4.3
  {
    id: 'd4-016',
    topic: '4.3',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. Which source address and port does the web server at 198.51.100.40 see for this session?",
    exhibit: `R1# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
tcp  203.0.113.2:49731     192.168.10.24:49731   198.51.100.40:443     198.51.100.40:443
Total number of translations: 1`,
    options: ['203.0.113.2:49731', '192.168.10.24:49731', '198.51.100.40:443', '192.168.10.1:49731'],
    answer: [0],
    explanation: "The **inside global** address is how the inside host appears to the outside world, so the server sees 203.0.113.2:49731. 192.168.10.24 is the inside local (private) address, which never leaves the inside network. 198.51.100.40:443 is the server itself (outside local/global). 192.168.10.1 would be the router's LAN address, which is not involved in the translation.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-017',
    topic: '4.3',
    type: 'match',
    difficulty: 2,
    stem: "Match each NAT term to its definition.",
    pairs: [
      ['Inside local', 'Address assigned to an inside host, as seen on the inside network'],
      ['Inside global', 'Address that represents an inside host to the outside network'],
      ['Outside global', 'Address actually assigned to an outside host by its owner'],
      ['Outside local', 'Address of an outside host as it appears to the inside network'],
    ],
    explanation: "Inside/outside says whose address it is; local/global says from which side it is seen. With normal inside source NAT only the inside host is translated, so outside local and outside global are the same value.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-018',
    topic: '4.3',
    type: 'single',
    difficulty: 1,
    stem: "Inside server 192.168.10.50 must be reachable from the internet as 203.0.113.3 at all times. Which command creates the required mapping on R1?",
    options: [
      'ip nat inside source static 192.168.10.50 203.0.113.3',
      'ip nat inside source static 203.0.113.3 192.168.10.50',
      'ip nat outside source static 192.168.10.50 203.0.113.3',
      'ip nat inside source list 1 interface GigabitEthernet0/0/1 overload',
    ],
    answer: [0],
    explanation: "The syntax is `ip nat inside source static <inside-local> <inside-global>`. Reversing the addresses maps the wrong way. `ip nat outside source` translates addresses of **outside** hosts. The PAT command shares the interface address dynamically for outbound sessions and does not publish a server for inbound connections.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-019',
    topic: '4.3',
    type: 'fill',
    difficulty: 1,
    stem: "Complete the command so that all hosts matched by NAT-INSIDE share the address of the outside interface: `ip nat inside source list NAT-INSIDE interface GigabitEthernet0/0/1 ______`",
    answer: ['overload'],
    explanation: "`overload` enables PAT, tracking sessions by port so many inside hosts share one inside global address. Without it, the interface form would let only one inside host use the address at a time.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-020',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Hosts in 192.168.10.0/24 cannot reach the internet, and `show ip nat translations` is empty. R1 can ping 8.8.8.8 from Gi0/0/1. What is the cause?",
    exhibit: `interface GigabitEthernet0/0/0
 ip address 192.168.10.1 255.255.255.0
 ip nat inside
!
interface GigabitEthernet0/0/1
 ip address 203.0.113.2 255.255.255.248
 ip nat outside
!
ip access-list standard NAT-INSIDE
 10 permit 192.168.1.0 0.0.0.255
!
ip nat inside source list NAT-INSIDE interface GigabitEthernet0/0/1 overload
ip route 0.0.0.0 0.0.0.0 203.0.113.1`,
    options: [
      "The NAT-INSIDE ACL matches 192.168.1.0/24 instead of the 192.168.10.0/24 inside local addresses.",
      "The ip nat inside and ip nat outside statements are on the wrong interfaces.",
      "PAT requires a NAT pool; the interface keyword cannot be combined with overload.",
      "The default route must point to the exit interface instead of the next hop for NAT to work.",
    ],
    answer: [0],
    explanation: "The NAT ACL selects which inside **local** addresses get translated. It permits 192.168.1.0/24, so traffic from 192.168.10.0/24 never matches and is routed untranslated (and dropped upstream, since private addresses are not routed on the internet). Fix it with `permit 192.168.10.0 0.0.0.255`. The inside/outside statements are correct (LAN inside, ISP outside). `interface ... overload` is the standard PAT form. A next-hop default route works fine with NAT.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-021',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users report that some PCs reach the internet while most others time out. Which change resolves the problem with the least disruption?",
    exhibit: `R1# show ip nat statistics
Total active translations: 41 (0 static, 41 dynamic; 38 extended)
Outside interfaces:
  GigabitEthernet0/0/1
Inside interfaces:
  GigabitEthernet0/0/0
Hits: 5821  Misses: 431
Expired translations: 152
Dynamic mappings:
-- Inside Source
[Id: 1] access-list NAT-INSIDE pool PUBLIC-POOL refcount 3
 pool PUBLIC-POOL: id 1, netmask 255.255.255.248
  start 203.0.113.4 end 203.0.113.6
  type generic, total addresses 3, allocated 3 (100%), misses 214`,
    options: [
      "Reconfigure the mapping as ip nat inside source list NAT-INSIDE pool PUBLIC-POOL overload.",
      "Swap the ip nat inside and ip nat outside interface commands.",
      "Schedule clear ip nat translation * every hour so addresses return to the pool.",
      "Change the pool netmask to 255.255.255.0 so the pool contains more addresses.",
    ],
    answer: [0],
    explanation: "The pool has three addresses, all allocated (100%), and the pool's **misses** counter is climbing: every additional host finds no free address. Dynamic NAT without `overload` is one-to-one: the three non-extended entries are the address bindings (one per pool address) held by the three hosts that work, and the extended entries are their individual flows. Adding `overload` turns it into PAT so all hosts share the three addresses. The interface lists are correct. Clearing translations only moves the problem to whichever hosts start sessions next. The netmask is a consistency check on the pool range, not its size; the range is still .4-.6.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-022',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A network assistant AI reviewed R1 after users on 192.168.10.0/24 lost internet access. Which assessment of its recommendation is correct?",
    exhibit: `R1 configuration (excerpt)
interface GigabitEthernet0/0/0
 description LAN 192.168.10.0/24
 ip address 192.168.10.1 255.255.255.0
 ip nat outside
!
interface GigabitEthernet0/0/1
 description ISP uplink
 ip address 203.0.113.2 255.255.255.248
 ip nat inside
!
ip access-list standard NAT-INSIDE
 10 permit 192.168.10.0 0.0.0.255
ip nat inside source list NAT-INSIDE interface GigabitEthernet0/0/1 overload

AI assistant
 "PAT is failing because the overload keyword is only valid with a NAT pool.
  Create 'ip nat pool WAN 203.0.113.2 203.0.113.2 prefix-length 29' and change
  the mapping to 'ip nat inside source list NAT-INSIDE pool WAN overload'."`,
    options: [
      "The recommendation is wrong: overload works with the interface keyword. The real fault is that ip nat inside and ip nat outside are reversed; put ip nat inside on Gi0/0/0 and ip nat outside on Gi0/0/1.",
      "The recommendation is correct: overload requires a pool, and the pool will also fix the interface roles automatically.",
      "The recommendation is wrong: the real fault is the wildcard mask in NAT-INSIDE, which should be 255.255.255.0.",
      "The recommendation is wrong: both interfaces must be configured with ip nat outside when the interface keyword is used.",
    ],
    answer: [0],
    explanation: "`ip nat inside source list ... interface ... overload` is valid and the most common PAT form, so the assistant's diagnosis is false. The actual fault is that the LAN interface is marked **outside** and the ISP interface **inside**; inside source translation happens for traffic entering an inside interface and leaving an outside one, so user traffic is never translated correctly. A pool would not change the interface roles. ACLs use wildcard masks, and 0.0.0.255 is correct for /24. Marking both interfaces outside would disable translation entirely.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-023',
    topic: '4.3',
    type: 'multi',
    difficulty: 1,
    stem: "An engineer runs `clear ip nat translation *` on a router that has one static NAT mapping and a PAT configuration. Which two statements are true? (Choose two.)",
    options: [
      "All dynamic translation entries are removed from the table.",
      "The static mapping configured with ip nat inside source static remains in the table.",
      "The NAT ACL and PAT mapping are deleted from the running configuration.",
      "The ip nat inside and ip nat outside interface settings are reset.",
      "Inside hosts can no longer be translated until the router is reloaded.",
    ],
    answer: [0, 1],
    explanation: "The command flushes **dynamic** entries only; static mappings are configuration and stay in the table. It never changes the configuration (ACL, mappings or interface roles). New translations are built immediately for the next packets; active sessions may need to re-establish because their old entries are gone.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-024',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which statement is true?",
    exhibit: `R1# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
---  203.0.113.3           192.168.10.50         ---                   ---
tcp  203.0.113.3:443       192.168.10.50:443     198.51.100.77:50112   198.51.100.77:50112
tcp  203.0.113.2:62001     192.168.10.30:62001   198.51.100.20:443     198.51.100.20:443
tcp  203.0.113.2:1024      192.168.10.31:62001   198.51.100.20:443     198.51.100.20:443
Total number of translations: 4`,
    options: [
      "Internet host 198.51.100.77 has an HTTPS session to server 192.168.10.50 through a static mapping to 203.0.113.3.",
      "Hosts 192.168.10.30 and 192.168.10.31 each received a different public address from a dynamic pool.",
      "R1 translates the outside server address 198.51.100.20 to a private address for inside hosts.",
      "The first entry will age out after 24 hours if 192.168.10.50 sends no traffic.",
    ],
    answer: [0],
    explanation: "The `---` entry is a static mapping (192.168.10.50 to 203.0.113.3), and the second line is an inbound session from 198.51.100.77 to port 443 using it. Hosts .30 and .31 share the **same** inside global address 203.0.113.2 (PAT); because both used source port 62001 to the same server, R1 remapped .31 to port 1024. Outside local equals outside global, so no outside translation is happening. Static entries never age out.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-025',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "An ISP assigned 203.0.113.0/29. The engineer wants a dynamic NAT pool that contains only 203.0.113.4 through 203.0.113.6. Which command is valid and correct?",
    options: [
      'ip nat pool PUB 203.0.113.4 203.0.113.6 netmask 255.255.255.248',
      'ip nat pool PUB 203.0.113.4 203.0.113.6 netmask 0.0.0.7',
      'ip nat pool PUB 203.0.113.0 netmask 255.255.255.248',
      'ip nat pool PUB 203.0.113.4 203.0.113.6 255.255.255.248',
    ],
    answer: [0],
    explanation: "`ip nat pool <name> <start> <end> {netmask <mask> | prefix-length <len>}` defines the range, and the netmask (a real subnet mask, not a wildcard) describes the subnet the range belongs to. `prefix-length 29` would be equivalent. A wildcard such as 0.0.0.7 is invalid here. The one-line form needs both a start and an end address. The `netmask` or `prefix-length` keyword cannot be omitted.",
    lesson: '4.3-nat-pat',
  },
  // ---------------------------------------------------------------- 4.4
  {
    id: 'd4-026',
    topic: '4.4',
    type: 'fill',
    difficulty: 2,
    stem: "Mail servers check the reverse DNS of the company's outbound mail relay, 198.51.100.25. What is the owner name of the PTR record that must exist? (Enter the full reverse name.)",
    answer: ['25.100.51.198.in-addr.arpa', '25.100.51.198.in-addr.arpa.'],
    explanation: "IPv4 reverse names list the octets in reverse order under `in-addr.arpa`: 198.51.100.25 becomes `25.100.51.198.in-addr.arpa`, and its PTR record points to the relay's hostname. The reverse zone is usually controlled by whoever owns the address block, often the ISP. IPv6 uses nibble-reversed names under `ip6.arpa`.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-027',
    topic: '4.4',
    type: 'match',
    difficulty: 1,
    stem: "Match each DNS record type to its purpose.",
    pairs: [
      ['A', 'Maps a hostname to an IPv4 address'],
      ['AAAA', 'Maps a hostname to an IPv6 address'],
      ['CNAME', 'Makes one name an alias for another name'],
      ['MX', 'Names the mail servers for a domain, with a preference value'],
      ['NS', 'Names the authoritative servers for a zone'],
      ['PTR', 'Maps an address back to a hostname'],
    ],
    explanation: "A and AAAA are forward lookups for IPv4 and IPv6. CNAME is an alias whose target is another name. MX gives mail server **names** with a preference (lower is preferred). NS records define and delegate authority for a zone. PTR records live under in-addr.arpa or ip6.arpa for reverse lookups.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-028',
    topic: '4.4',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. All three servers are reachable. To which server will a sending mail server try to deliver first?",
    exhibit: `$ dig example.org MX +noall +answer
example.org.        3600    IN      MX      20 mx2.example.org.
example.org.        3600    IN      MX      10 mx1.example.org.
example.org.        3600    IN      MX      30 backup-mx.example.net.`,
    options: ['mx1.example.org', 'mx2.example.org', 'backup-mx.example.net', 'The first record in the answer section, regardless of preference'],
    answer: [0],
    explanation: "Senders try the MX with the **lowest preference value** first, so mx1 (10) is first, then mx2 (20), then backup-mx (30). The order of records in a DNS answer is not meaningful; resolvers may rotate them. A higher preference number means less preferred.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-029',
    topic: '4.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users on the IPv4-only guest network load www.example.org normally. Users on the dual-stack corporate network see long delays or time-outs. What is the most likely cause?",
    exhibit: `$ dig www.example.org A +noall +answer
www.example.org.    300     IN      A       203.0.113.80

$ dig www.example.org AAAA +noall +answer
www.example.org.    300     IN      AAAA    2001:db8:10::8

web01$ ip -6 addr show dev eth0 scope global
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
    inet6 2001:db8:10::80/64 scope global
       valid_lft forever preferred_lft forever`,
    options: [
      "The AAAA record points to 2001:db8:10::8 instead of the server's address 2001:db8:10::80.",
      "The A record points to the wrong IPv4 address.",
      "The PTR record for 203.0.113.80 is missing.",
      "The 300-second TTL is too short for clients to cache the record.",
    ],
    answer: [0],
    explanation: "Dual-stack clients prefer IPv6, so they try the AAAA address first. The record says ::8 but the server is ::80, so those clients wait for the IPv6 attempt to fail before falling back (or fail outright). IPv4-only users never try the IPv6 address (many do not even query for AAAA), which is why they are unaffected. The A record is fine (IPv4 users work). A missing PTR does not stop web browsing. A 300-second TTL is normal and only affects how often resolvers refresh.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-030',
    topic: '4.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. 10.10.1.53 is the correct corporate resolver configured on this PC. What is the best conclusion?",
    exhibit: `C:\\> nslookup intranet.corp.example.com
DNS request timed out.
    timeout was 2 seconds.
Server:  UnKnown
Address:  10.10.1.53

DNS request timed out.
    timeout was 2 seconds.
DNS request timed out.
    timeout was 2 seconds.
*** Request to UnKnown timed-out

C:\\> ping -n 2 10.10.1.53
Reply from 10.10.1.53: bytes=32 time=1ms TTL=127
Reply from 10.10.1.53: bytes=32 time=1ms TTL=127`,
    options: [
      "The resolver is reachable but DNS queries get no answer, so either the DNS service is down or something in the path (such as an ACL) is blocking port 53; the zone records are not the issue yet.",
      "The A record for intranet.corp.example.com is missing from the zone.",
      "The resolver's own PTR record is missing, and that is why the query fails.",
      "The PC is using the wrong DNS server and should be pointed at another resolver.",
    ],
    answer: [0],
    explanation: "ICMP to 10.10.1.53 works, but every DNS query **times out**: nothing is answering on port 53, which points to a stopped DNS service or a filter (ACL/firewall) that permits ping but not DNS. A missing record would produce an immediate **Non-existent domain** (NXDOMAIN) answer, not a timeout. `Server: UnKnown` only means nslookup could not reverse-resolve the server's address, which is a side effect of the same timeouts (or a missing PTR) and does not cause query failures. The stem states 10.10.1.53 is the correct resolver.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-031',
    topic: '4.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. An AI assistant proposed DNS changes for the example.org zone. Which evaluation is correct?",
    exhibit: `Ticket
 Marketing wants https://example.org (no www) to show the same site as
 www.example.org. The site is served by a CDN at edge.cdn-provider.example.net.
 The example.org zone is hosted on the company's standard DNS servers.

AI assistant proposed records
 example.org.         300  IN  CNAME  edge.cdn-provider.example.net.
 www.example.org.     300  IN  CNAME  edge.cdn-provider.example.net.`,
    options: [
      "The www record is valid, but the apex record is not: example.org already holds SOA and NS records and a CNAME cannot coexist with other records, so use A/AAAA records (or a provider flattening feature) at the apex.",
      "Both records are valid; CNAMEs may be placed at any name in a zone.",
      "The www record is invalid because two CNAMEs cannot point to the same target.",
      "Both records are invalid because a CNAME target must be inside the same zone.",
    ],
    answer: [0],
    explanation: "A name with a CNAME may hold **no other records**, and the zone apex must hold SOA and NS records, so a standard CNAME at `example.org.` is not allowed. Use A/AAAA records at the apex, or a DNS provider's proprietary ALIAS/ANAME (CNAME flattening) feature. Any number of CNAMEs can point to the same target, and targets can be in any zone, so the www record is fine.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-032',
    topic: '4.4',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Some external senders report delivery failures to example.org. Which two record problems should be corrected? (Choose two.)",
    exhibit: `example.org.            3600  IN  MX     10 mail.example.org.
example.org.            3600  IN  MX     20 198.51.100.25
mail.example.org.       3600  IN  CNAME  mailhost.example.org.
mailhost.example.org.   3600  IN  A      203.0.113.25`,
    options: [
      "The preference-20 MX record targets an IP address instead of a hostname.",
      "The preference-10 MX record targets a name that is a CNAME instead of a name with an A or AAAA record.",
      "Preference 10 makes mail.example.org the backup server; the primary should have the higher value.",
      "MX records must have a shorter TTL than the A records they reference.",
      "mailhost.example.org must also have an AAAA record for the MX record to be valid.",
    ],
    answer: [0, 1],
    explanation: "An MX target must be a **hostname**; 198.51.100.25 will be looked up as a name and fail. The MX target also **must not be a CNAME** (RFC 2181); point it at mailhost.example.org (or give mail.example.org its own A record). Lower preference is more preferred, so 10 is already primary. TTL values are independent between records. An AAAA record is optional; an A record alone is valid.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-033',
    topic: '4.4',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. The prompt hangs for several seconds after the typo. Which statement explains the output and how to stop the delay on this lab switch?",
    exhibit: `SW1# shwo vlan brief
Translating "shwo"...domain server (255.255.255.255)
% Unknown command or computer name, or unable to find computer address`,
    options: [
      "No ip name-server is configured, so IOS broadcasts the lookup; no ip domain lookup stops typos from being resolved.",
      "The switch has ip name-server 255.255.255.255 configured; replacing it with ip domain name stops the delay.",
      "The switch is acting as a DNS server; no ip dns server stops the delay.",
      "DNS is disabled, so IOS uses broadcast as a fallback; ip domain lookup stops the delay.",
    ],
    answer: [0],
    explanation: "IOS treats an unknown word at the EXEC prompt as a hostname to connect to and tries to resolve it. `ip domain lookup` is on by default, and with no `ip name-server` the query goes to 255.255.255.255 and waits for a timeout. `no ip domain lookup` (older form `no ip domain-lookup`) stops that, at the cost of all DNS resolution on the device. 255.255.255.255 is not a configured server; `ip domain name` only sets the suffix. The switch is not acting as a DNS server, and DNS is enabled, not disabled.",
    lesson: '4.4-dns-records',
  },

  // ---------------------------------------------------------------- 4.5
  {
    id: 'd4-034',
    topic: '4.5',
    type: 'fill',
    difficulty: 1,
    stem: "A firewall in front of a VPN gateway must permit ESP. Which IP protocol number identifies ESP?",
    answer: ['50'],
    explanation: "ESP is **IP protocol 50** (not a TCP or UDP port). AH is protocol 51 and GRE is 47. IKE uses UDP 500 and NAT-T uses UDP 4500.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-035',
    topic: '4.5',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about the IPsec Authentication Header (AH) are true? (Choose two.)",
    options: [
      "It is identified by IP protocol number 51.",
      "It provides integrity and origin authentication but no encryption.",
      "It encrypts the payload with AES when used in tunnel mode.",
      "It passes through PAT devices by encapsulating in UDP 4500.",
      "It runs over UDP port 500.",
    ],
    answer: [0, 1],
    explanation: "AH (**IP protocol 51**) authenticates the packet, including immutable fields of the outer IP header, but **never encrypts**; encryption requires ESP (protocol 50) in either mode. Because NAT rewrites the IP header, it breaks the AH integrity check; NAT-T (UDP 4500) is defined for ESP, not AH. UDP 500 is IKE, the key-management protocol, not AH.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-036',
    topic: '4.5',
    type: 'match',
    difficulty: 1,
    stem: "Match each VPN protocol to the identifier a firewall would use to permit it.",
    pairs: [
      ['IKE', 'UDP 500'],
      ['IKE and ESP with NAT traversal', 'UDP 4500'],
      ['ESP', 'IP protocol 50'],
      ['AH', 'IP protocol 51'],
      ['GRE', 'IP protocol 47'],
    ],
    explanation: "IKE negotiates SAs on UDP 500. When a NAT device is detected, IKE moves to UDP 4500 and ESP is encapsulated in UDP 4500 as well. ESP (50), AH (51) and GRE (47) are IP protocol numbers carried directly in the IP header's protocol field.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-037',
    topic: '4.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A packet was captured on the internet path between HQ-RTR (198.51.100.1) and BR-RTR (203.0.113.2), and the inner header was recorded after decryption at BR-RTR. Which IPsec protocol and mode are in use?",
    exhibit: `Outer IPv4   src 198.51.100.1   dst 203.0.113.2   protocol 50
ESP          SPI 0x8c3a1f20   seq 4411
Payload      1428 bytes, encrypted

Decrypted at BR-RTR:
Inner IPv4   src 10.1.10.25     dst 10.2.20.40     protocol 6 (TCP)
TCP          src port 51830     dst port 443`,
    options: ['ESP in tunnel mode', 'ESP in transport mode', 'AH in tunnel mode', 'AH in transport mode'],
    answer: [0],
    explanation: "Protocol 50 is **ESP**, and the payload is encrypted (AH cannot encrypt). The outer header carries the **gateways'** addresses while a complete inner IP header with the hosts' private addresses is inside the encrypted payload, which is **tunnel mode**. In transport mode the original host-to-host IP header would be the only IP header and there would be no inner header.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-038',
    topic: '4.5',
    type: 'single',
    difficulty: 2,
    stem: "A branch router and the HQ router must form an OSPF adjacency across the internet, and all traffic between the sites must be encrypted. Why is GRE over IPsec chosen instead of a policy-based (crypto map) IPsec tunnel alone?",
    options: [
      "GRE can carry the multicast OSPF hellos that a crypto-map IPsec tunnel cannot, and IPsec then encrypts the GRE packets.",
      "GRE encrypts the OSPF packets, and IPsec adds the routing capability.",
      "IPsec cannot carry TCP traffic unless it is first encapsulated in GRE.",
      "GRE is required for NAT traversal, which IPsec cannot perform on its own.",
    ],
    answer: [0],
    explanation: "Policy-based IPsec protects unicast IP that matches its crypto ACL; it does not provide an interface that carries multicast, so routing protocols cannot form adjacencies over it. **GRE (IP 47)** creates a tunnel interface that carries multicast and broadcast, but GRE itself has **no encryption**. Combining them gives routing plus encryption. IPsec carries TCP without help, and NAT-T is an IPsec/IKE feature (UDP 4500), not a GRE function.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-039',
    topic: '4.5',
    type: 'single',
    difficulty: 1,
    stem: "A contractor using an unmanaged laptop needs access to a single internal web-based ticketing application. IT policy forbids installing software on non-corporate devices. Which VPN type fits best?",
    options: [
      "Clientless SSL VPN through a web portal",
      "Client-based remote access VPN with Cisco Secure Client",
      "Site-to-site IPsec VPN",
      "GRE over IPsec tunnel",
    ],
    answer: [0],
    explanation: "A **clientless SSL VPN** needs only a browser; the user logs in to an HTTPS portal that exposes specific web applications. Cisco Secure Client (formerly AnyConnect) requires installing software and provides a full network tunnel, more access than needed. Site-to-site and GRE over IPsec connect networks via gateways, not an individual user's device.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-040',
    topic: '4.5',
    type: 'order',
    difficulty: 2,
    stem: "Put the steps of building an IKEv1 site-to-site tunnel using main mode in order.",
    items: [
      "Peers exchange proposals and agree on the IKE policy (encryption, hash, authentication method, DH group, lifetime)",
      "Peers perform a Diffie-Hellman exchange to generate shared keying material",
      "Peers authenticate each other with a pre-shared key or certificates, completing the IKE SA",
      "Quick mode negotiates the IPsec transform set and creates a pair of unidirectional IPsec SAs",
      "User traffic is encrypted with ESP and sent through the tunnel",
    ],
    explanation: "IKEv1 phase 1 main mode uses six messages: two to agree on the policy, two for the DH exchange, and two (now encrypted) to authenticate the peers. Phase 2 quick mode, protected by the IKE SA, then creates the IPsec SAs (one per direction) that actually protect data. IKEv2 compresses this into IKE_SA_INIT and IKE_AUTH (four messages) and creates the first child SA during IKE_AUTH.",
    lesson: '4.5-ipsec-vpn',
  },
  // ---------------------------------------------------------------- 4.6
  {
    id: 'd4-041',
    topic: '4.6',
    type: 'single',
    difficulty: 1,
    stem: "Which ACE matches every address in 172.16.32.0/20?",
    options: [
      'permit 172.16.32.0 0.0.15.255',
      'permit 172.16.32.0 0.0.31.255',
      'permit 172.16.32.0 255.255.240.0',
      'permit 172.16.32.0 0.0.16.255',
    ],
    answer: [0],
    explanation: "A /20 mask is 255.255.240.0; the wildcard is its inverse, **0.0.15.255**, covering 172.16.32.0-172.16.47.255. 0.0.31.255 is a /19 wildcard (172.16.32.0-172.16.63.255), matching too much. 255.255.240.0 is a subnet mask; used as a wildcard it would ignore the first two octets entirely. 0.0.16.255 is not a contiguous wildcard and matches a scattered set of addresses.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-042',
    topic: '4.6',
    type: 'fill',
    difficulty: 1,
    stem: "Enter the wildcard mask that matches exactly the addresses in 192.168.1.32/27.",
    answer: ['0.0.0.31'],
    explanation: "A /27 mask is 255.255.255.224. 255 - 224 = 31, so the wildcard is **0.0.0.31**, matching 192.168.1.32-192.168.1.63.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-043',
    topic: '4.6',
    type: 'multi',
    difficulty: 1,
    stem: "Which two numbers create a numbered extended IPv4 ACL? (Choose two.)",
    options: ['99', '150', '1500', '2100', '1999', '2700'],
    answer: [1, 3],
    explanation: "Extended numbered ACLs use **100-199** and **2000-2699**, so 150 and 2100. Standard ACLs use 1-99 and 1300-1999, which covers 99, 1500 and 1999. 2700 is outside both IPv4 ranges.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-044',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. ACL 15 is applied outbound on R2's server-facing interface. Hosts in 10.1.5.0/24 should be blocked from the servers, but they still reach them. How should the engineer fix this?",
    exhibit: `R2# show access-lists 15
Standard IP access list 15
    10 permit 10.1.0.0, wildcard bits 0.0.255.255 (3312 matches)
    20 deny   10.1.5.0, wildcard bits 0.0.0.255
    30 permit 10.2.0.0, wildcard bits 0.0.255.255 (88 matches)`,
    options: [
      "Enter ip access-list standard 15, then add 5 deny 10.1.5.0 0.0.0.255 and remove entry 20.",
      "Apply the ACL inbound instead of outbound so entry 20 is processed first.",
      "Add deny any at the end of the ACL, because the implicit deny is not applied to standard ACLs.",
      "Change entry 20 to deny host 10.1.5.0 so it is evaluated before the network entries.",
    ],
    answer: [0],
    explanation: "ACLs are processed top-down and stop at the **first match**. 10.1.5.x matches entry 10 (10.1.0.0/16) first and is permitted; entry 20 has no counter because it never matches. Placing the deny **before** the broader permit (for example as sequence 5) fixes it. Direction does not change the order of evaluation. Every ACL already ends with an implicit deny. `host 10.1.5.0` would match only that single address, not the subnet.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-045',
    topic: '4.6',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two flows from host 10.1.10.25 are permitted by the ACL? (Choose two.)",
    exhibit: `ip access-list extended USERS-IN
 10 permit tcp 10.1.10.0 0.0.0.255 host 10.1.50.10 eq 443
 20 deny   tcp 10.1.10.0 0.0.0.255 10.1.50.0 0.0.0.255 eq 22
 30 permit udp 10.1.10.0 0.0.0.255 host 10.1.50.53 eq domain
 40 deny   ip 10.1.10.0 0.0.0.255 10.1.50.0 0.0.0.255
 50 permit ip 10.1.10.0 0.0.0.255 any
!
interface GigabitEthernet0/0/0
 ip address 10.1.10.1 255.255.255.0
 ip access-group USERS-IN in`,
    options: [
      "HTTPS to 10.1.50.10",
      "A DNS query over UDP to 10.1.50.53",
      "SSH to 10.1.50.10",
      "HTTP to 10.1.50.10",
      "A DNS zone transfer over TCP 53 to 10.1.50.53",
      "A ping to 10.1.50.10",
    ],
    answer: [0, 1],
    explanation: "HTTPS to 10.1.50.10 matches entry 10, and UDP 53 to 10.1.50.53 matches entry 30. SSH to any server matches the deny in entry 20. HTTP (TCP 80), TCP 53 and ICMP to the 10.1.50.0/24 servers match no permit above entry 40 and are denied there. Entry 50 only permits traffic to destinations **outside** 10.1.50.0/24, because those flows have already been denied by entry 40.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-046',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. TO-WEB is applied inbound on the interface facing 10.1.10.0/24. Users should reach web server 10.1.50.10 on HTTP only, but every HTTP attempt fails. What is wrong?",
    exhibit: `R1# show access-lists TO-WEB
Extended IP access list TO-WEB
    10 permit tcp 10.1.10.0 0.0.0.255 eq www host 10.1.50.10
    20 deny ip 10.1.10.0 0.0.0.255 host 10.1.50.10 (214 matches)
    30 permit ip 10.1.10.0 0.0.0.255 any (90211 matches)`,
    options: [
      "Entry 10 matches source port 80; it should be permit tcp 10.1.10.0 0.0.0.255 host 10.1.50.10 eq www.",
      "The ACL is applied in the wrong direction; it should be outbound on the user-facing interface.",
      "Entry 30 permits all traffic, so entries 10 and 20 are ignored.",
      "IOS displays port 80 as www, which means the ACE matches HTTP proxies rather than web servers.",
    ],
    answer: [0],
    explanation: "A port written right after the source matches the **source** port. Client requests use a random high source port and destination port 80, so entry 10 never matches (no counter) and the requests hit the deny in entry 20 (214 matches). Move `eq www` after the destination. Outbound on the user-facing interface would filter traffic going toward the users, not their requests. First match wins, so entry 30 never overrides earlier entries. `www` is simply IOS's display name for TCP 80.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-047',
    topic: '4.6',
    type: 'match',
    difficulty: 1,
    stem: "Match each ACL keyword or operator to what it matches.",
    pairs: [
      ['host 10.1.1.5', 'Exactly one address (wildcard 0.0.0.0)'],
      ['any', 'All addresses (wildcard 255.255.255.255)'],
      ['established', 'TCP segments with the ACK or RST flag set'],
      ['range 20 21', 'Ports 20 through 21 inclusive'],
      ['gt 1023', 'Ports 1024 and higher'],
    ],
    explanation: "`host` is shorthand for a /32 wildcard and `any` for 0.0.0.0 255.255.255.255. `established` matches TCP with ACK or RST set (return traffic of existing sessions, statelessly). `range` is inclusive. `gt 1023` means greater than 1023, so 1024-65535.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-048',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Using a standard ACL that denies host 10.1.10.25, the engineer must block that host from the server LAN while leaving its access to the printer LAN, WAN and internet unaffected. Where should the ACL be applied?",
    exhibit: `10.1.10.0/24 users
      |
   Gi0/0/0
     R1
   Gi0/0/1
      |
     WAN
      |
   Gi0/0/1
     R2 --Gi0/0/2-- 10.1.60.0/24 printers
   Gi0/0/0
      |
10.1.50.0/24 servers`,
    options: ['R2 Gi0/0/0 outbound', 'R1 Gi0/0/0 inbound', 'R1 Gi0/0/1 outbound', 'R2 Gi0/0/1 inbound'],
    answer: [0],
    explanation: "A standard ACL matches only the source, so it belongs **near the destination**: outbound on the interface toward the servers, where only server-bound traffic is checked. Inbound on R1 Gi0/0/0 or outbound on R1 Gi0/0/1 would block 10.1.10.25 from everything beyond R1. Inbound on R2 Gi0/0/1 would still block it from the printer LAN.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-049',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Users in 10.1.10.0/24 connect to R1 Gi0/0/0, servers in 10.1.50.0/24 connect to R2 Gi0/0/0, and R1 and R2 are joined across a WAN. An AI assistant proposed an ACL for the stated goal. Which evaluation is correct?",
    exhibit: `Goal
 Block SSH from 10.1.10.0/24 to the servers in 10.1.50.0/24.
 All other traffic must keep working.

AI assistant
 "Apply this on R2 Gi0/0/0 outbound, close to the destination as Cisco recommends:
    access-list 10 deny 10.1.10.0 0.0.0.255
    access-list 10 permit any
  This blocks SSH from the user subnet and allows everything else."`,
    options: [
      "Incorrect: a standard ACL cannot match protocol or port, so it blocks all traffic from 10.1.10.0/24 to the servers; use an extended ACL denying tcp 10.1.10.0 0.0.0.255 10.1.50.0 0.0.0.255 eq 22, then permit ip any any, inbound on R1 Gi0/0/0.",
      "Correct: standard ACLs belong near the destination, and this one denies only SSH because the servers listen for SSH on that interface.",
      "Incorrect only in direction: the same ACL works if it is applied inbound on R2 Gi0/0/0.",
      "Incorrect only in numbering: standard ACLs must be numbered 100-199 to be applied outbound.",
    ],
    answer: [0],
    explanation: "ACL 10 is **standard** and matches only the source address, so it denies **every** packet from 10.1.10.0/24 to the server LAN, not just SSH. The goal needs protocol and port matching, which requires an **extended** ACL, ideally near the source (inbound on R1 Gi0/0/0). Inbound on R2 Gi0/0/0 would filter traffic coming **from** the servers. Standard ACLs use 1-99 and 1300-1999 and can be applied in either direction.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-050',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The engineer added a line to allow HTTPS management from 10.99.0.0/24, but HTTPS to the router is still blocked. What is the problem?",
    exhibit: `R1(config)# ip access-list extended MGMT-IN
R1(config-ext-nacl)# permit tcp 10.99.0.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# end
R1# show access-lists MGMT-IN
Extended IP access list MGMT-IN
    10 permit tcp 10.99.0.0 0.0.0.255 any eq 22 (310 matches)
    20 permit udp any any eq snmp (5521 matches)
    30 deny ip any any log (41 matches)
    40 permit tcp 10.99.0.0 0.0.0.255 any eq 443`,
    options: [
      "The new entry was appended as sequence 40, after the explicit deny; remove it with no 40 and re-add it as 25.",
      "Named extended ACLs do not accept port numbers; the keyword https must be used.",
      "The ACL must be removed from the interface and reapplied for new entries to take effect.",
      "The deny ip any any log entry blocks only logged traffic, so HTTPS is being dropped by the implicit deny.",
    ],
    answer: [0],
    explanation: "An entry added without a sequence number goes to the **end**. HTTPS packets match entry 30 (`deny ip any any`) first, so entry 40 is never reached. Delete it with `no 40` and insert it before the deny with a lower sequence number such as 25. Numeric ports are always valid. Changes to an applied ACL take effect immediately. The `log` keyword only adds logging; entry 30 denies everything it matches.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-051',
    topic: '4.6',
    type: 'fill',
    difficulty: 1,
    stem: "Enter the interface configuration command that applies extended ACL 110 to packets arriving on the interface.",
    answer: ['ip access-group 110 in'],
    explanation: "`ip access-group <acl> in|out` applies an IPv4 ACL to an interface. `in` filters packets as they arrive (before routing). `access-class` is the equivalent command for VTY lines.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-052',
    topic: '4.6',
    type: 'single',
    difficulty: 3,
    stem: "Numbered standard ACL 10 has five entries and is applied with ip access-group 10 in on Gi0/0/0. An engineer enters no access-list 10 deny host 10.1.1.9 in global configuration mode to remove one entry. What is the result?",
    options: [
      "All of ACL 10 is deleted; the interface still references ACL 10, and because it no longer exists, Gi0/0/0 now permits all inbound traffic.",
      "Only the deny host 10.1.1.9 entry is removed; the other four entries remain.",
      "All of ACL 10 is deleted, and the implicit deny now drops all inbound traffic on Gi0/0/0.",
      "The command is rejected because an applied ACL cannot be modified.",
    ],
    answer: [0],
    explanation: "In global configuration, `no access-list <number> ...` deletes the **entire** numbered ACL regardless of the rest of the line. The `ip access-group 10 in` statement remains, and on IOS an interface referencing an undefined ACL filters nothing, so all traffic is permitted. To remove a single entry, use `ip access-list standard 10` and `no <sequence>`. Applied ACLs can be edited at any time.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-053',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "R1 has `permit tcp any 10.1.0.0 0.0.255.255 established` followed by `deny ip any any` inbound on its internet-facing interface. Which packet from the internet is permitted?",
    options: [
      "A TCP segment with the ACK flag set from a web server replying to an inside client",
      "A TCP SYN from an internet host to an inside server on port 443",
      "A UDP DNS response to an inside client's query",
      "An ICMP echo reply to an inside host's ping",
    ],
    answer: [0],
    explanation: "`established` matches TCP segments with **ACK or RST** set, which includes replies in sessions the inside client started. A new inbound connection begins with a SYN (no ACK), so it is denied. `established` applies only to TCP, so UDP DNS replies and ICMP echo replies hit `deny ip any any`. This stateless check can be fooled by crafted ACK packets, which is why stateful firewalls are preferred.",
    lesson: '4.6-acl-extended',
  },
  // ---------------------------------------------------------------- 4.7
  {
    id: 'd4-054',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user plugged a personal laptop into the wall jack connected to Gi1/0/7 and lost connectivity. The user's desktop (sticky MAC) is now plugged back in. What must happen for the port to forward traffic again?",
    exhibit: `SW1# show port-security interface GigabitEthernet1/0/7
Port Security              : Enabled
Port Status                : Secure-shutdown
Violation Mode             : Shutdown
Aging Time                 : 0 mins
Aging Type                 : Absolute
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 0c1d.29e4.8a10:20
Security Violation Count   : 1`,
    options: [
      "The port is err-disabled; an administrator must enter shutdown then no shutdown on Gi1/0/7 (or errdisable recovery must be configured).",
      "Nothing; the port resumes forwarding automatically as soon as the sticky MAC is seen again.",
      "The sticky MAC must be removed, because it belongs to the laptop that caused the violation.",
      "The violation counter must be cleared with clear port-security sticky before the port can come up.",
    ],
    answer: [0],
    explanation: "Shutdown mode puts the port into **err-disabled** (Secure-shutdown). It stays down until it is bounced manually or `errdisable recovery cause psecure-violation` re-enables it after the interval (default 300 seconds). Recovery is never automatic just because the right device returns. The sticky address (1 learned) is the desktop's; the laptop's MAC 0c1d.29e4.8a10 is the last source address that **triggered** the violation and was never secured. `clear port-security sticky` would delete the legitimate desktop's sticky entry and does not re-enable the port.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-055',
    topic: '4.7',
    type: 'match',
    difficulty: 1,
    stem: "Match each port security setting to its behavior.",
    pairs: [
      ['violation protect', 'Drops offending frames with no log message and no violation counter increase'],
      ['violation restrict', 'Drops offending frames, sends a log message or trap and increments the violation counter'],
      ['violation shutdown', 'Places the port in the err-disabled state'],
      ['mac-address sticky', 'Learns MAC addresses dynamically and writes them to the running configuration'],
      ['errdisable recovery cause psecure-violation', 'Re-enables a port automatically after the recovery interval'],
    ],
    explanation: "protect and restrict both keep the port up and drop only frames from unauthorized MACs; restrict adds logging and counting. shutdown (the default) err-disables the port. Sticky learning stores addresses in the running config (save to keep them). errdisable recovery automates bouncing the port, by default after 300 seconds.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-056',
    topic: '4.7',
    type: 'single',
    difficulty: 1,
    stem: "Refer to the exhibit. Which command must be entered first on Gi1/0/5 so that port security can be enabled?",
    exhibit: `SW1(config)# interface GigabitEthernet1/0/5
SW1(config-if)# switchport port-security
Command rejected: GigabitEthernet1/0/5 is a dynamic port.`,
    options: ['switchport mode access', 'switchport nonegotiate', 'switchport access vlan 1', 'no shutdown'],
    answer: [0],
    explanation: "Port security is not allowed on a port in a dynamic (DTP) mode. Setting it statically with `switchport mode access` fixes the error. `switchport nonegotiate` cannot be used while the port is dynamic and does not change the mode. Assigning a VLAN or bringing the port up does not change the dynamic mode.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-057',
    topic: '4.7',
    type: 'multi',
    difficulty: 1,
    stem: "An engineer enters only switchport mode access and switchport port-security on an interface. Which two settings are in effect? (Choose two.)",
    options: [
      "A maximum of one secure MAC address",
      "Violation mode shutdown",
      "A maximum of two secure MAC addresses",
      "Violation mode restrict",
      "Sticky learning enabled",
      "Secure addresses age out after 5 minutes",
    ],
    answer: [0, 1],
    explanation: "Port security defaults are **maximum 1** and **violation shutdown**. Sticky learning must be enabled explicitly with `switchport port-security mac-address sticky`, and aging is disabled (0) unless `switchport port-security aging time` is configured.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-058',
    topic: '4.7',
    type: 'fill',
    difficulty: 1,
    stem: "Complete the interface command so the port is err-disabled when a storm-control threshold is exceeded: storm-control action ______",
    answer: ['shutdown'],
    explanation: "`storm-control action shutdown` err-disables the port (cause `storm-control`). `storm-control action trap` sends an SNMP trap/log while filtering. With no action configured, the switch simply filters the excess traffic of that type.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-059',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Gi1/0/10 has storm-control broadcast level 20.00 10.00 and no storm-control action configured. What is the switch doing on this port?",
    exhibit: `SW1# show storm-control GigabitEthernet1/0/10 broadcast
Interface  Filter State   Upper        Lower        Current
---------  -------------  -----------  -----------  ----------
Gi1/0/10   Blocking         20.00%       10.00%       37.52%`,
    options: [
      "Dropping incoming broadcast traffic until the broadcast rate falls below 10 percent, while still forwarding unicast and multicast",
      "Dropping all incoming traffic on the port until the total rate falls below 20 percent",
      "Holding the port in the err-disabled state until an administrator bounces it",
      "Forwarding all traffic and sending an SNMP trap every second",
    ],
    answer: [0],
    explanation: "The broadcast rate (37.52%) exceeded the upper threshold, so the switch is **blocking broadcasts** and will resume forwarding them when the rate drops below the lower (falling) threshold of 10%. Only the traffic class that exceeded the limit is blocked. The port is not err-disabled, which would require `storm-control action shutdown`, and no traps are sent without `storm-control action trap`.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-060',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After DHCP snooping was enabled on SW1, no client in VLAN 20 can obtain an address. Gi1/0/48 is the uplink toward the DHCP server. Which assessment of the AI assistant's recommendation is correct?",
    exhibit: `SW1# show running-config | include dhcp snooping
ip dhcp snooping vlan 20
no ip dhcp snooping information option
ip dhcp snooping
 ip dhcp snooping limit rate 15
 ip dhcp snooping limit rate 15
SW1# show ip dhcp snooping | begin ^Interface
Interface                  Trusted    Allow option    Rate limit (pps)
-----------------------    -------    ------------    ----------------
GigabitEthernet1/0/5       no         no              15
GigabitEthernet1/0/7       no         no              15

AI assistant
 "Clients on Gi1/0/5 and Gi1/0/7 are untrusted, so their DHCPDISCOVER
  messages are being dropped. Configure 'ip dhcp snooping trust' on
  Gi1/0/5 and Gi1/0/7."`,
    options: [
      "Incorrect: untrusted ports accept client messages; the server's OFFER and ACK are dropped because uplink Gi1/0/48 is untrusted, so trust Gi1/0/48 and leave the access ports untrusted.",
      "Correct: client ports must be trusted for DISCOVER messages to be forwarded.",
      "Incorrect: the fix is to remove no ip dhcp snooping information option so option 82 is inserted.",
      "Incorrect: the 15 pps rate limit on the client ports is too low for DHCP; raise it to 100 pps.",
    ],
    answer: [0],
    explanation: "Untrusted ports **do** forward client messages (DISCOVER, REQUEST); what they block is **server** messages. Gi1/0/48 does not appear in the table, which lists only ports with trust or a rate limit configured, so it is untrusted and the legitimate server's OFFER/ACK are dropped there. Trust Gi1/0/48. Trusting access ports would let a rogue DHCP server on those ports operate, defeating the feature. Option 82 insertion is already disabled, which avoids relay/server issues rather than causing them. A 15 pps limit is ample for normal clients (and exceeding it would err-disable the port, not silently starve it), so raising it would not restore service.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-061',
    topic: '4.7',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. R1 is the IOS DHCP server for VLAN 20 on subinterface Gi0/0/0.20. Clients behind SW1 get addresses when DHCP snooping is disabled, but not when it is enabled, even though the uplink to R1 is trusted. What should the engineer configure?",
    exhibit: `SW1# show ip dhcp snooping
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs:
20
DHCP snooping is operational on following VLANs:
20
...
Insertion of option 82 is enabled
...
Interface                  Trusted    Allow option    Rate limit (pps)
-----------------------    -------    ------------    ----------------
GigabitEthernet1/0/48      yes        yes             unlimited

R1# debug ip dhcp server packet
DHCPD: inconsistent relay information.
DHCPD: relay information option exists, but giaddr is zero.`,
    options: [
      "no ip dhcp snooping information option on SW1",
      "ip dhcp snooping trust on every access port of SW1",
      "ip dhcp snooping limit rate 100 on the SW1 uplink",
      "ip arp inspection vlan 20 on SW1",
    ],
    answer: [0],
    explanation: "With snooping on, SW1 inserts **option 82** but, not being a relay, leaves **giaddr 0.0.0.0**. The IOS DHCP server treats that combination as inconsistent and drops the request, exactly as the debug shows. Disabling insertion on SW1 is the usual fix; trusting the relay information on the router (`ip dhcp relay information trusted` on the receiving interface or `ip dhcp relay information trust-all` globally) is the commonly used alternative. Trusting access ports would expose the VLAN to rogue servers and would not stop insertion. A rate limit is unrelated, and DAI does not affect DHCP.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-062',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After DAI was enabled on VLAN 20, a printer on Gi1/0/9 stopped working. DHCP clients in VLAN 20 are unaffected. Which assessment of the AI assistant's analysis is correct?",
    exhibit: `%SW_DAI-4-DHCP_SNOOPING_DENY: 1 Invalid ARPs (Req) on Gi1/0/9, vlan 20.([0011.2233.4455/10.10.20.5/0000.0000.0000/10.10.20.1/09:14:22 UTC Fri Oct 23 2026])

SW1# show ip dhcp snooping binding interface GigabitEthernet1/0/9
MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface
------------------  ---------------  ----------  -------------  ----  --------------------
Total number of bindings: 0

AI assistant
 "The printer uses a static IP (10.10.20.5), so it has no DHCP snooping binding
  and DAI drops its ARP requests for the gateway 10.10.20.1. Recommended fix:
    arp access-list STATIC-HOSTS
     permit ip host 10.10.20.5 mac host 0011.2233.4455
    ip arp inspection filter STATIC-HOSTS vlan 20"`,
    options: [
      "Correct: the ARP ACL permits only that IP/MAC pair, so the printer works while DAI keeps inspecting Gi1/0/9.",
      "Incorrect: ARP ACLs are only evaluated on trusted ports, so Gi1/0/9 must be trusted instead.",
      "Incorrect: the log shows that 10.10.20.1 is spoofing the printer's MAC address.",
      "Incorrect: DHCP snooping must be disabled on VLAN 20 for DAI to accept static hosts.",
    ],
    answer: [0],
    explanation: "The log lists sender MAC/sender IP/target MAC/target IP: the printer (0011.2233.4455, 10.10.20.5) is ARPing for the gateway, and there is no binding for it because it never used DHCP. An **ARP ACL** applied with `ip arp inspection filter` is the intended fix: it permits exactly that pair while the port stays untrusted. Trusted ports are not inspected at all, so ARP ACLs matter on **untrusted** ports; trusting Gi1/0/9 would work but removes protection. The target MAC 0000.0000.0000 is normal in an ARP request. DAI relies on snooping bindings; disabling snooping would break every DHCP client.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-063',
    topic: '4.7',
    type: 'multi',
    difficulty: 2,
    stem: "Which two statements about Dynamic ARP Inspection on a Catalyst switch are true? (Choose two.)",
    options: [
      "It validates ARP packets received on untrusted ports against the DHCP snooping binding table.",
      "Uplinks to other switches and routers are normally configured with ip arp inspection trust.",
      "It inspects all IPv4 packets and drops those with spoofed source IP addresses.",
      "It is enabled per interface with the ip arp inspection vlan command.",
      "Untrusted ports have no ARP rate limit unless one is configured.",
    ],
    answer: [0, 1],
    explanation: "DAI checks the sender IP/MAC in ARP packets on **untrusted** ports against ARP ACLs and the **DHCP snooping bindings**, and uplinks are trusted so ARP from routers and neighbor switches is not dropped. Checking the source IP of all data packets is IP Source Guard, not DAI. `ip arp inspection vlan` is a **global** command. Untrusted ports default to **15 ARP packets per second**; exceeding it err-disables the port.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-064',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "On SW1, hosts connect to Gi1/0/1-46 and the legitimate IPv6 router connects to Gi1/0/48. Which RA guard design blocks rogue router advertisements without breaking IPv6 for the hosts?",
    options: [
      "A policy with device-role host attached to Gi1/0/1-46 and a policy with device-role router attached to Gi1/0/48",
      "A policy with device-role router attached to Gi1/0/1-46 and a policy with device-role host attached to Gi1/0/48",
      "A policy with device-role host attached to every port, including Gi1/0/48",
      "A policy with device-role router attached only to Gi1/0/48, leaving Gi1/0/1-46 without any policy",
    ],
    answer: [0],
    explanation: "RA guard filters RAs arriving on a port. `device-role host` drops all incoming RAs, which is right for host ports. `device-role router` allows RAs, which is needed only where the real router connects. The reversed design blocks the real router and allows rogues. Host role everywhere blocks the legitimate router too, so SLAAC and default gateway learning fail. Without a policy on the host ports, rogue RAs are not filtered at all.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-065',
    topic: '4.7',
    type: 'order',
    difficulty: 2,
    stem: "SW1 runs DHCP snooping and DAI on VLAN 20. Gi1/0/5 is an untrusted access port and Gi1/0/48 is the trusted uplink toward the DHCP server. Put the events for a newly connected client in order.",
    items: [
      "The client sends a DHCPDISCOVER that SW1 accepts on untrusted Gi1/0/5 and forwards",
      "The server's DHCPOFFER arrives on trusted Gi1/0/48 and is forwarded to the client",
      "The client sends a DHCPREQUEST for the offered address",
      "The DHCPACK arrives on Gi1/0/48 and SW1 adds a binding with the client's MAC, IP, VLAN and port",
      "The client ARPs for its default gateway and DAI forwards the ARP because it matches the binding",
    ],
    explanation: "Client messages are allowed on untrusted ports; server messages are only accepted on trusted ports. The binding is created when the switch sees the DHCPACK. Only after that does the client have a valid IP to ARP from, and DAI validates the ARP against the new binding.",
    lesson: '4.7-snooping-dai-raguard',
  },
  // ---------------------------------------------------------------- 4.1 (expansion)
  {
    id: 'd4-066',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A security audit flags R1 because it \"may accept SSH version 1 connections.\" Which statement is correct?",
    exhibit: `R1# show ip ssh
SSH Enabled - version 1.99
Authentication methods:publickey,keyboard-interactive,password
Encryption Algorithms:aes128-ctr,aes192-ctr,aes256-ctr
MAC Algorithms:hmac-sha2-256,hmac-sha2-512
Authentication timeout: 120 secs; Authentication retries: 3
Minimum expected Diffie Hellman key size : 2048 bits`,
    options: [
      "Version 1.99 is a maintenance release of SSHv2, so the finding is a false positive and no change is needed.",
      "Version 1.99 means R1 accepts both SSHv1 and SSHv2 clients; configuring ip ssh version 2 limits it to SSHv2.",
      "R1 is restricted to SSHv1 by a small RSA key; regenerating the key with modulus 2048 enables SSHv2 automatically.",
      "Adding transport input ssh to the VTY lines rejects SSHv1 clients while continuing to accept SSHv2 clients.",
    ],
    answer: [1],
    explanation: "**1.99** is the compatibility banner a server shows when it speaks **both** versions, so the audit is right. `ip ssh version 2` makes R1 advertise 2.0 and refuse SSHv1. It is not an SSHv2 release number. The key is not the limit here: a server showing 1.99 already supports SSHv2 (SSHv2 does need an RSA key of at least 768 bits, and 2048 is recommended). `transport input ssh` only blocks Telnet and other protocols; it does not choose the SSH version. Caveat: some recent IOS XE releases default to SSHv2 only and show `version 2.0` without the command, but whenever the output shows 1.99, SSHv1 is still possible.",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-067',
    topic: '4.1',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Administrators cannot log in to R1 with their TACACS+ accounts, but the local account breakglass works. The TACACS+ server has R1 registered by its Loopback0 address. Which change fixes the problem?",
    exhibit: `R1# show running-config | section aaa|tacacs
aaa new-model
aaa group server tacacs+ TACACS-GRP
 server name TAC-1
aaa authentication login default group TACACS-GRP local
aaa authorization exec default group TACACS-GRP local
tacacs server TAC-1
 address ipv4 10.1.100.10
 key 7 <removed>

R1# show ip interface brief | include 0/0/1|Loopback0
GigabitEthernet0/0/1   10.1.12.1       YES NVRAM  up                    up
Loopback0              10.255.0.1      YES NVRAM  up                    up

R1# show ip cef 10.1.100.10
10.1.100.0/24
  nexthop 10.1.12.2 GigabitEthernet0/0/1

TACACS+ server log (10.1.100.10)
 10:42:07  Connection from 10.1.12.1 rejected: unknown network device
 10:42:31  Connection from 10.1.12.1 rejected: unknown network device

TACACS+ server network device list
 R1    10.255.0.1`,
    options: [
      "Re-enter the shared key under tacacs server TAC-1, because a key mismatch makes the server treat R1 as unknown",
      "Change the method list to aaa authentication login default local group TACACS-GRP",
      "Configure ip tacacs source-interface Loopback0 so the requests are sourced from 10.255.0.1",
      "Add single-connection under tacacs server TAC-1 so R1 reuses one TCP session for all requests",
    ],
    answer: [2],
    explanation: "By default R1 sources TACACS+ from the **exit interface** toward the server, Gi0/0/1 (10.1.12.1), but the server only knows R1 as 10.255.0.1, so it refuses the connection. `ip tacacs source-interface Loopback0` (globally, or under the `aaa group server tacacs+` group) fixes it. Because no server accepted the request, the group returned an **ERROR**, which is exactly why the fallback to `local` lets breakglass in. A key mismatch would show up as a decryption or shared-secret failure for a known device, not as an unknown device. Putting `local` first only changes which database is checked first; TACACS+ accounts would still fail. `single-connection` changes how TCP sessions are reused, not which source address is used.",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-068',
    topic: '4.1',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Both TACACS+ servers in TACACS-GRP are reachable. Which two statements are true? (Choose two.)",
    exhibit: `R1# show running-config | section aaa|line
aaa new-model
aaa group server tacacs+ TACACS-GRP
 server name TAC-1
 server name TAC-2
aaa authentication login default group TACACS-GRP local
aaa authentication login CONSOLE local
line con 0
 exec-timeout 5 0
 login authentication CONSOLE
line vty 0 15
 exec-timeout 10 0
 transport input ssh`,
    options: [
      "SSH users are checked against a line password, because the VTY lines have no login authentication command.",
      "Console logins are checked only against the local username database, even while the TACACS+ servers are up.",
      "If a console user enters a wrong local password, R1 retries the login against TACACS-GRP.",
      "SSH logins use the default list: TACACS-GRP first, with local used only if no TACACS+ server responds.",
      "The CONSOLE list replaces the default list on every line because it was configured after it.",
      "The VTY lines refuse all logins until login authentication default is added under line vty 0 15.",
    ],
    answer: [1, 3],
    explanation: "A line that references a **named** list uses that list, so the console uses CONSOLE (local only), whether or not TACACS+ is up. Every line without a `login authentication` command automatically uses the **default** list, so SSH goes to TACACS-GRP first and to `local` only on an ERROR (no server answers). With `aaa new-model`, line passwords are not used for login on lines covered by a method list. CONSOLE contains only `local`, so a failed local login simply fails; there is no second method. Named lists apply only where they are referenced, regardless of configuration order. `login authentication default` is implied and does not need to be typed.",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-069',
    topic: '4.1',
    type: 'match',
    difficulty: 2,
    stem: "Match each AAA command to its effect on R1.",
    pairs: [
      ['aaa authentication login default group TACACS-GRP local', 'Verifies usernames and passwords, using local accounts only if no TACACS+ server responds'],
      ['aaa authorization exec default group TACACS-GRP local', 'Decides whether a user receives an EXEC shell and at which privilege level'],
      ['aaa authorization commands 15 default group TACACS-GRP local', 'Asks the server to approve each privilege 15 command before it runs'],
      ['aaa accounting exec default start-stop group TACACS-GRP', 'Sends a record when each EXEC session starts and another when it ends'],
      ['aaa accounting commands 15 default stop-only group TACACS-GRP', 'Sends a record of each privilege 15 command after it is executed'],
    ],
    explanation: "**Authentication** answers who you are. **Exec authorization** decides whether a shell starts and at what level (the server can return the privilege level). **Command authorization** checks individual commands before they run, which is how a help desk can be blocked from `reload`. **Accounting** only records: `exec` accounting logs session start and stop, and `commands` accounting logs what was typed. Accounting never blocks anything.",
    lesson: '4.1-aaa',
  },
  {
    id: 'd4-070',
    topic: '4.1',
    type: 'fill',
    difficulty: 1,
    stem: "A help desk engineer logs in to R1 by SSH and wants to confirm whether the session is at privilege level 1 or 15. Which EXEC command displays the current privilege level? (Enter the full command.)",
    answer: ['show privilege', 'sh privilege'],
    explanation: "`show privilege` prints, for example, `Current privilege level is 1`. It works in user EXEC and privileged EXEC. The prompt gives a hint too (`R1>` for level 1, `R1#` for level 2 and above), but only `show privilege` shows the exact level.",
    lesson: '4.1-local-ssh',
  },
  {
    id: 'd4-071',
    topic: '4.1',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 does not run AAA. Which assessment of the AI assistant's statement is correct?",
    exhibit: `R1# show running-config | include username|enable|aaa
enable secret 9 <removed>
username helpdesk privilege 1 secret 9 <removed>
username netops privilege 15 secret 9 <removed>
R1# show running-config | section line vty
line vty 0 15
 exec-timeout 10 0
 login local
 transport input ssh

AI assistant
 "Privilege levels on username entries only take effect with AAA. With
  'login local', every SSH user starts in user EXEC (R1>), so netops must
  type 'enable' and enter the enable secret before configuring R1."`,
    options: [
      "Correct: without aaa new-model and aaa authorization exec, R1 ignores the privilege keyword on username entries.",
      "Wrong: both users land in privileged EXEC (R1#), because login local always grants privilege level 15.",
      "Wrong: login local applies each username's privilege level, so netops starts at R1# and helpdesk at R1>.",
      "Wrong: netops is rejected at login, because privilege 15 accounts must authenticate with the enable secret instead of a username.",
    ],
    answer: [2],
    explanation: "Without AAA, `login local` authenticates against the username database **and applies that user's privilege level**. netops (15) gets `R1#` immediately; helpdesk (1) gets `R1>` and needs the enable secret to go further. The assistant confused this with AAA: under `aaa new-model`, a user's privilege level is applied at login only when `aaa authorization exec` is configured. `login local` never grants level 15 to everyone. Privilege 15 accounts log in with their own username and secret like any other account.",
    lesson: '4.1-local-ssh',
  },
  // ---------------------------------------------------------------- 4.2 (expansion)
  {
    id: 'd4-072',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 currently boots isr4300-universalk9.17.09.05.SPA.bin in bundle mode. An SCP copy of the new 17.12.04 image (about 780 MB) to flash: fails with an insufficient-space error. Which action lets the copy succeed while keeping a working fallback image?",
    exhibit: `R1# dir flash: | include .bin|bytes total
   18  -rw-   734512128  Mar 4 2025 11:20:33 +00:00  isr4300-universalk9.17.06.05.SPA.bin
   21  -rw-   751108096  Jan 9 2026 08:02:41 +00:00  isr4300-universalk9.17.09.05.SPA.bin
7451738112 bytes total (612073472 bytes free)`,
    options: [
      "Delete the running 17.09.05 image, because the router has already loaded it into memory",
      "Copy the image to bootflash: instead, because bootflash has its own free space",
      "Copy the image with TFTP, because TFTP does not need to reserve space for SSH overhead",
      "Delete the unused 17.06.05 image from flash: and repeat the SCP copy",
    ],
    answer: [3],
    explanation: "Only about 612 MB is free, less than the image size. Deleting the old **17.06.05** file frees about 735 MB (roughly 1.35 GB free in total) and keeps 17.09.05, the image R1 boots today, as the fallback. Deleting the running image removes the fallback: if the new image fails, the router has nothing to boot. On ISR 4000 routers `flash:` is an alias for `bootflash:`, the same file system with the same free space. The transfer protocol does not change how much space the file needs, and TFTP would also give up authentication and encryption.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-073',
    topic: '4.2',
    type: 'match',
    difficulty: 1,
    stem: "Match each file transfer protocol to its transport and security characteristics.",
    pairs: [
      ['TFTP', 'UDP 69, with no authentication and no encryption'],
      ['FTP', 'TCP 21 for control, with credentials and data sent in clear text'],
      ['SCP', 'TCP 22, a simple file copy carried over an SSH session'],
      ['SFTP', 'TCP 22, an SSH subsystem that can also list and manage remote files'],
      ['HTTPS', 'TCP 443, with the transfer protected by TLS'],
    ],
    explanation: "TFTP and FTP send everything, including any credentials, in clear text, so they should not carry configurations that contain keys and password hashes. **SCP** and **SFTP** both run over **SSH on TCP 22** and encrypt credentials and data; SFTP is a full file-access protocol (directory listings, rename, delete), while SCP just copies. IOS XE can also copy over HTTPS, which uses TLS on TCP 443.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-074',
    topic: '4.2',
    type: 'fill',
    difficulty: 2,
    stem: "R1's running configuration has drifted. The engineer has copied a complete known-good configuration to flash:R1-golden-confg with SCP and now wants the running configuration to match that file exactly, removing any commands that are not in it. Complete the command: `R1# ______ flash:R1-golden-confg`",
    answer: ['configure replace', 'config replace'],
    explanation: "`configure replace` compares the file with the running configuration and applies only the additions **and deletions** needed to make them identical. IOS warns that the file must be a complete configuration and asks for confirmation. `copy flash:R1-golden-confg running-config` would only **merge** the file, leaving extra commands in place. Save with `copy running-config startup-config` afterward if the result should survive a reload.",
    lesson: '4.2-secure-file-transfer',
  },
  {
    id: 'd4-075',
    topic: '4.2',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. The backup worked in the lab. In production, a stateful firewall sits between R1 (source address 10.1.12.1) and the server 10.1.50.25. Which rule must the firewall allow for the same backup to work?",
    exhibit: `R1# copy running-config sftp://netadmin@10.1.50.25/backups/R1-confg
Address or name of remote host [10.1.50.25]?
Destination username [netadmin]?
Destination filename [backups/R1-confg]?
Password:
!
6871 bytes copied in 1.402 secs (4901 bytes/sec)`,
    options: [
      "TCP from 10.1.50.25 to 10.1.12.1, destination port 22",
      "TCP from 10.1.12.1 to 10.1.50.25, destination port 22",
      "UDP from 10.1.12.1 to 10.1.50.25, destination port 69",
      "TCP from 10.1.12.1 to 10.1.50.25, destination ports 20 and 21",
    ],
    answer: [1],
    explanation: "SFTP runs over SSH. R1 starts the copy, so R1 is the **client** and opens a TCP session to the server's port **22**; a stateful firewall then allows the return traffic automatically. A rule toward R1's port 22 would be needed only if the server initiated the session (for example, pushing a file with SCP to R1 as the server). UDP 69 is TFTP, and TCP 20/21 is FTP; neither is used by SFTP.",
    lesson: '4.2-secure-file-transfer',
  },
  // ---------------------------------------------------------------- 4.3 (expansion)
  {
    id: 'd4-076',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. After a router replacement, hosts on 192.168.10.0/24 (connected to Gi0/0/0) cannot reach the internet. The NAT-INSIDE ACL permits 192.168.10.0 0.0.0.255. What is the cause?",
    exhibit: `R1# show ip nat statistics
Total active translations: 0 (0 static, 0 dynamic; 0 extended)
Outside interfaces:
  GigabitEthernet0/0/1
Inside interfaces:
Hits: 0  Misses: 0
Expired translations: 0
Dynamic mappings:
-- Inside Source
[Id: 1] access-list NAT-INSIDE interface GigabitEthernet0/0/1 refcount 0`,
    options: [
      "Gi0/0/1 must be marked both ip nat inside and ip nat outside when PAT uses the interface address.",
      "The NAT-INSIDE ACL needs an explicit deny any entry before NAT will use it.",
      "Gi0/0/0 is not marked ip nat inside, so LAN traffic is never considered for translation.",
      "Interface-based PAT has no address to allocate, as refcount 0 shows; a NAT pool is required.",
    ],
    answer: [2],
    explanation: "The **Inside interfaces** list is empty. Inside source NAT translates only packets that enter an `ip nat inside` interface and leave an `ip nat outside` interface, so nothing has ever been looked up (hits and misses are both 0). Add `ip nat inside` to Gi0/0/0. One interface cannot sensibly be both inside and outside for this design. The implicit deny already ends the ACL. `refcount` counts translations currently using the mapping; it is 0 simply because no translation has been built, not because the interface lacks an address.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-077',
    topic: '4.3',
    type: 'fill',
    difficulty: 2,
    stem: "Refer to the exhibit. How many different inside hosts (distinct inside local IPv4 addresses) appear in the translation table? (Enter a number.)",
    exhibit: `R1# show ip nat translations
Pro  Inside global         Inside local          Outside local         Outside global
---  203.0.113.3           192.168.10.50         ---                   ---
tcp  203.0.113.2:51004     192.168.10.21:51004   198.51.100.10:443     198.51.100.10:443
tcp  203.0.113.2:51007     192.168.10.21:51007   198.51.100.11:443     198.51.100.11:443
udp  203.0.113.2:60211     192.168.10.33:60211   198.51.100.53:53      198.51.100.53:53
tcp  203.0.113.2:1024      192.168.10.44:51004   198.51.100.10:443     198.51.100.10:443
tcp  203.0.113.3:443       192.168.10.50:443     198.51.100.77:50112   198.51.100.77:50112
icmp 203.0.113.2:7         192.168.10.33:7       198.51.100.10:7       198.51.100.10:7
Total number of translations: 7`,
    answer: ['4', 'four'],
    explanation: "Count the **inside local** column: 192.168.10.50 (the static mapping plus an inbound HTTPS session), .21 (two TCP sessions), .33 (a DNS query and a ping, where ICMP uses the query ID in place of a port) and .44. That is **4** hosts in 7 entries. .44 shows inside global port 1024 because 203.0.113.2:51004 was already taken by .21, so PAT assigned a different port. The table counts translations, not hosts.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-078',
    topic: '4.3',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Internet users cannot open https://203.0.113.2, which should reach inside server 192.168.10.50. Outbound browsing from inside hosts works. What is the cause?",
    exhibit: `R1 configuration (excerpt)
interface GigabitEthernet0/0/1
 ip address 203.0.113.2 255.255.255.248
 ip access-group OUTSIDE-IN in
 ip nat outside
!
ip nat inside source list NAT-INSIDE interface GigabitEthernet0/0/1 overload
ip nat inside source static tcp 192.168.10.50 443 interface GigabitEthernet0/0/1 443

R1# show access-lists OUTSIDE-IN
Extended IP access list OUTSIDE-IN
    10 permit tcp any host 192.168.10.50 eq 443
    20 permit tcp any 203.0.113.0 0.0.0.7 established (48211 matches)
    30 permit udp any eq domain host 203.0.113.2 (9120 matches)`,
    options: [
      "Static PAT cannot use the interface keyword; the server needs a dedicated public address.",
      "The overload rule already uses every port on 203.0.113.2, so port 443 cannot also be forwarded.",
      "Inbound ACLs are applied after NAT, so OUTSIDE-IN must be moved to the inside interface to see 192.168.10.50.",
      "OUTSIDE-IN is evaluated before NAT translates the destination, so entry 10 must match host 203.0.113.2, not 192.168.10.50.",
    ],
    answer: [3],
    explanation: "For traffic entering an outside interface, IOS checks the **inbound ACL before** NAT translates the destination. The SYN still carries destination 203.0.113.2:443, so entry 10 (no counter, never matched) cannot match it; the SYN has no ACK, so `established` does not match either, and the packet is dropped by the implicit deny. Change entry 10 to `permit tcp any host 203.0.113.2 eq 443`. Static PAT with the `interface` keyword is valid, and a static entry reserves its port so dynamic PAT does not use it. The claim that inbound ACLs run after NAT reverses the real order of operations, so it does not explain the failure.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-079',
    topic: '4.3',
    type: 'multi',
    difficulty: 2,
    stem: "R1's Gi0/0/1 receives its only public address from the ISP by DHCP, and that address changes from time to time. All 300 hosts behind Gi0/0/0 must reach the internet. Which two commands belong in a correct NAT configuration? (Choose two.)",
    options: [
      "ip nat inside source list NAT-INSIDE interface GigabitEthernet0/0/1 overload",
      "ip nat inside, entered under interface GigabitEthernet0/0/1",
      "ip nat pool ISP 203.0.113.2 203.0.113.2 prefix-length 29, used with overload",
      "ip nat outside, entered under interface GigabitEthernet0/0/1",
      "ip nat inside source static 192.168.10.0 203.0.113.2",
    ],
    answer: [0, 3],
    explanation: "The ISP-facing interface is the **outside** interface, and PAT with the `interface` keyword always uses whatever address the interface currently has, so a DHCP change needs no reconfiguration. (The LAN interface also needs `ip nat inside`, and NAT-INSIDE must match the LAN.) Marking Gi0/0/1 inside reverses the roles. A pool hard-codes today's address and breaks when the DHCP address changes. A static entry maps one inside address to one global address; it cannot share an address among 300 hosts.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-080',
    topic: '4.3',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which assessment of the AI assistant's proposal is correct?",
    exhibit: `Request
 Publish SSH on inside server 192.168.10.60 to the internet as public
 address 203.0.113.3, TCP port 2222. The server listens on TCP 22.
 R1: Gi0/0/0 is ip nat inside, Gi0/0/1 is ip nat outside,
     and the ISP routes 203.0.113.0/29 to R1.

AI assistant
 "Add this mapping on R1:
    ip nat inside source static tcp 192.168.10.60 22 203.0.113.3 2222
  Internet users connect to 203.0.113.3 port 2222. R1 rewrites the
  destination to 192.168.10.60 port 22, and rewrites the server's replies
  back to source 203.0.113.3 port 2222."`,
    options: [
      "Correct: local address and port come first, global address and port second, so port 2222 is forwarded to port 22.",
      "Wrong: the public address and port must come first, so the command should be ip nat inside source static tcp 203.0.113.3 2222 192.168.10.60 22.",
      "Wrong: the clients are outside hosts, so an inbound mapping must be built with ip nat outside source static.",
      "Wrong: static NAT cannot change port numbers, so the server must be reconfigured to listen on TCP 2222.",
    ],
    answer: [0],
    explanation: "Static PAT (port forwarding) uses `ip nat inside source static {tcp|udp} <local-ip> <local-port> <global-ip> <global-port>`, and the translation works in both directions, exactly as the assistant describes. Reversing the order would map the wrong way. `ip nat outside source` translates the addresses of outside hosts, not inside servers. Static PAT is specifically able to map one port to a different port, so the server can keep listening on 22.",
    lesson: '4.3-nat-pat',
  },
  {
    id: 'd4-081',
    topic: '4.3',
    type: 'order',
    difficulty: 3,
    stem: "R1 runs PAT with ip nat inside on Gi0/0/0 and ip nat outside on Gi0/0/1. Put the events for a new HTTPS session from inside host 192.168.10.24 to 198.51.100.40 in the order R1 handles them.",
    items: [
      "The packet from 192.168.10.24 to 198.51.100.40:443 arrives on the ip nat inside interface",
      "R1 routes the packet and selects the ip nat outside interface as the exit",
      "The source matches the NAT ACL, so R1 creates a translation and rewrites the source to 203.0.113.2 and a port",
      "The translated packet leaves Gi0/0/1 and the server replies to 203.0.113.2 at that port",
      "The reply arrives on the outside interface and R1 rewrites the destination to 192.168.10.24 and its original port",
      "R1 routes the translated reply out the inside interface to the host",
    ],
    explanation: "Inside-to-outside, IOS **routes first, then translates**: it must know the packet is leaving an outside interface before inside source NAT applies. Outside-to-inside, IOS **translates first, then routes**, because only the inside local address tells it where the host is. The reply is matched to the existing entry by inside global address and port.",
    lesson: '4.3-nat-pat',
  },
  // ---------------------------------------------------------------- 4.4 (expansion)
  {
    id: 'd4-082',
    topic: '4.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. portal.example.com, shop.example.com and api.example.com are all CNAMEs of web-lb.example.com, as shown for portal. The sites have moved to a new load balancer at 203.0.113.90. Which single change makes all three names resolve to the new address?",
    exhibit: `$ dig portal.example.com +noall +answer
portal.example.com.     300     IN      CNAME   web-lb.example.com.
web-lb.example.com.     300     IN      A       203.0.113.50`,
    options: [
      "Add an A record for 203.0.113.90 next to the CNAME on each of the three names",
      "Change the A record of web-lb.example.com to 203.0.113.90",
      "Change the PTR record of 203.0.113.50 so that it points to the new load balancer",
      "Change the NS records of example.com to the address of the new load balancer",
    ],
    answer: [1],
    explanation: "The three names are only **aliases**; the resolver follows each CNAME to web-lb.example.com and returns its A record. Changing that one A record moves all of them (after cached copies expire, here within 300 seconds). A name that has a CNAME cannot hold any other record, so adding A records beside the CNAMEs is invalid. PTR records serve reverse lookups and do not affect forward resolution. NS records name the zone's authoritative DNS servers, not web servers.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-083',
    topic: '4.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Ten minutes ago the web server moved, and its A record on the authoritative server was changed from 203.0.113.80 to 203.0.113.81. Internal users, who use resolver 10.10.1.53, still reach the old server. What is the best conclusion?",
    exhibit: `$ dig www.example.com @10.10.1.53 +noall +answer
www.example.com.        2817    IN      A       203.0.113.80

$ dig www.example.com @ns1.example.com +noall +answer
www.example.com.        3600    IN      A       203.0.113.81`,
    options: [
      "The change was not saved on the authoritative server, because that server still returns the full 3600-second TTL.",
      "The corporate resolver will never learn the new address on its own, because it is not authoritative for example.com.",
      "The corporate resolver cached the old record before the change and will serve it for about 47 more minutes.",
      "The A record must be replaced with a CNAME, because CNAME changes take effect immediately on every resolver.",
    ],
    answer: [2],
    explanation: "The authoritative server already returns .81, so the change is live there. The resolver's answer shows a **counting-down TTL** (2817 of 3600 seconds left), which means it is serving a cached copy obtained about 13 minutes ago, before the change. It will query again when the TTL reaches 0 (about 47 minutes) or sooner if its cache is flushed. An authoritative server always hands out the configured TTL, so 3600 is expected. Caching resolvers refresh automatically on expiry. CNAMEs are cached by TTL just like A records. Best practice: lower the TTL well before a planned change.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-084',
    topic: '4.4',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. Last month example.com moved its DNS hosting to ns1.example.com. Users on the internet now report that www.example.com sometimes resolves slowly or not at all. What is the most likely cause?",
    exhibit: `$ dig example.com NS +noall +answer
example.com.            86400   IN      NS      ns1.example.com.
example.com.            86400   IN      NS      ns2.old-host.example.net.

$ dig www.example.com @ns1.example.com +noall +answer
www.example.com.        300     IN      A       203.0.113.80

$ dig www.example.com @ns2.old-host.example.net
;; ->>HEADER<<- opcode: QUERY, status: REFUSED, id: 41207
;; flags: qr rd; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 1`,
    options: [
      "The 300-second TTL on the A record forces resolvers to query so often that the servers are overloaded.",
      "A zone may list only one NS record, so resolvers reject the zone when two are present.",
      "ns1.example.com has no PTR record, so resolvers distrust its answers.",
      "ns2.old-host.example.net is still listed as a name server but no longer serves the zone.",
    ],
    answer: [3],
    explanation: "Resolvers choose among the listed NS servers. ns1 answers authoritatively, but ns2 (the old provider) answers **REFUSED**: a **lame delegation**. Resolvers that try ns2 first must retry elsewhere (delay) or give up (failure), which matches the intermittent symptom. Fix the NS records in the zone **and** the delegation at the parent (registrar) so that every listed server is authoritative. A 300-second TTL is common and harmless. Zones normally list two or more NS records for redundancy. Resolvers do not check PTR records of name servers.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-085',
    topic: '4.4',
    type: 'fill',
    difficulty: 1,
    stem: "Complete the IOS XE global configuration command that makes R1 send its own DNS queries to resolver 10.10.1.53: `R1(config)# ip ______ 10.10.1.53`",
    answer: ['name-server'],
    explanation: "`ip name-server 10.10.1.53` sets the resolver (up to six can be listed). Name resolution also needs `ip domain lookup`, which is on by default, and `ip domain name` supplies the suffix for short names. `ip host` creates a static name entry instead, and `ip dns server` makes the router answer DNS queries for others, which is a different function.",
    lesson: '4.4-dns-records',
  },
  {
    id: 'd4-086',
    topic: '4.4',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user reports that http://intranet does not load, while http://intranet.corp.example.com works. Which assessment of the AI assistant's analysis is correct?",
    exhibit: `C:\\> nslookup intranet
Server:  dns1.corp.example.com
Address:  10.10.1.53

*** dns1.corp.example.com can't find intranet: Non-existent domain

C:\\> nslookup intranet.corp.example.com
Server:  dns1.corp.example.com
Address:  10.10.1.53

Name:    intranet.corp.example.com
Address:  10.10.20.80

C:\\> ipconfig /all | findstr /i "suffix"
   Primary Dns Suffix  . . . . . . . :
   Connection-specific DNS Suffix  . :

AI assistant
 "dns1 cannot resolve single-label names. Create a new zone named
  'intranet' on 10.10.1.53 and add an A record for 10.10.20.80 at its apex."`,
    options: [
      "Correct: DNS servers answer only fully qualified names, so a dedicated zone per short name is the standard fix.",
      "Wrong: the PC has no DNS suffix and queries the bare name; give clients the suffix corp.example.com instead.",
      "Wrong: the PTR record for 10.10.20.80 is missing, and Windows needs it to resolve a short name to that address.",
      "Wrong: dns1 returned Non-existent domain, so the PC must be pointed at a different resolver that knows the name.",
    ],
    answer: [1],
    explanation: "The record exists (the FQDN resolves). The PC has **no DNS suffix** to append, so it asks for the single label `intranet`, which does not exist, and gets NXDOMAIN. Supplying the suffix through DHCP option 15 or the suffix search list makes the client query intranet.corp.example.com. The assistant's per-name zone is a workaround that adds administrative mess for every short name. DNS servers do answer any name they hold; the problem is the name being asked. Reverse records play no part in forward lookups. dns1 answered correctly that `intranet.` does not exist; another resolver would say the same.",
    lesson: '4.4-dns-records',
  },
  // ---------------------------------------------------------------- 4.5 (expansion)
  {
    id: 'd4-087',
    topic: '4.5',
    type: 'match',
    difficulty: 1,
    stem: "Match each IPsec security service to the mechanism that provides it.",
    pairs: [
      ['Confidentiality', 'Encrypting the payload with an algorithm such as AES'],
      ['Data integrity', 'Adding a keyed hash such as HMAC-SHA-256 so changes are detected'],
      ['Peer authentication', 'Proving identity with a pre-shared key or digital certificates'],
      ['Anti-replay protection', 'Checking sequence numbers so duplicated or old packets are discarded'],
      ['Secure key exchange', 'Deriving shared keys with Diffie-Hellman without sending the keys'],
    ],
    explanation: "ESP encryption gives confidentiality; an HMAC (or the built-in check of a combined mode such as AES-GCM) gives integrity and data-origin authentication; IKE authenticates the peers with PSKs or certificates; ESP/AH sequence numbers with a sliding window give anti-replay; Diffie-Hellman lets the peers derive the same keying material over an untrusted network.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-088',
    topic: '4.5',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Why is ESP carried inside UDP between BR1 and HQ-RTR?",
    exhibit: `BR1 WAN address 192.168.1.2, behind an ISP PAT device (public 203.0.113.77)
HQ-RTR public address 198.51.100.1

Capture on the HQ-RTR internet interface:
 Outer IPv4  src 203.0.113.77   dst 198.51.100.1   protocol 17 (UDP)
 UDP         src port 41522     dst port 4500
 ESP         SPI 0x5a1c09e3     seq 912    payload encrypted`,
    options: [
      "IKE detected a NAT device between the peers, so NAT-T wraps ESP in UDP that the PAT device can track.",
      "The tunnel uses AH, and AH packets must always be encapsulated in UDP before they can cross the internet.",
      "ESP always runs over UDP 4500 in tunnel mode; it uses IP protocol 50 directly only in transport mode.",
      "IKEv2 carries all ESP traffic in UDP, and the PAT device changed the destination port from 500 to 4500.",
    ],
    answer: [0],
    explanation: "ESP (IP protocol 50) has **no port numbers**, so a PAT device cannot multiplex it. During IKE the peers exchange NAT-detection hashes; when they find a NAT, they move IKE to **UDP 4500** and wrap ESP in UDP 4500 (**NAT-T**). The PAT device rewrote BR1's source port to 41522. The packet shows ESP with an encrypted payload, not AH, and AH cannot work through NAT at all. Without NAT, ESP uses protocol 50 directly in both modes. IKEv2 also uses UDP 500 until NAT is detected, and PAT changes the source port, not the destination.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-089',
    topic: '4.5',
    type: 'order',
    difficulty: 3,
    stem: "Two routers run GRE over IPsec with ESP in transport mode between their public addresses. Put the parts of a protected packet in the order they appear on the wire, from the outermost (first) to the last.",
    items: [
      "Outer IPv4 header with the routers' public addresses and protocol 50",
      "ESP header with the SPI and sequence number",
      "GRE header indicating an IPv4 payload",
      "Original IPv4 header with the hosts' private addresses",
      "Original TCP header and application data",
      "ESP trailer and integrity check value",
    ],
    explanation: "GRE wraps the original packet and adds a delivery IP header between the routers. **Transport mode** keeps that delivery header in front and inserts ESP right after it (protocol field becomes 50), then encrypts everything from the GRE header to the end of the data, followed by the ESP trailer and ICV. Tunnel mode would add yet another IP header, wasting 20 bytes, which is why transport mode is the usual choice for GRE over IPsec.",
    lesson: '4.5-ipsec-vpn',
  },
  {
    id: 'd4-090',
    topic: '4.5',
    type: 'multi',
    difficulty: 1,
    stem: "Which two statements describe a site-to-site IPsec VPN? (Choose two.)",
    options: [
      "Every host at both sites needs VPN client software such as Cisco Secure Client.",
      "Hosts at each site send normal unencrypted traffic, and the VPN gateways encrypt and decrypt it.",
      "Each user authenticates in a browser portal before the tunnel is built.",
      "It is used mainly by teleworkers connecting from home networks and hotel Wi-Fi.",
      "The tunnel connects whole networks and is typically always on or brought up by matching traffic.",
    ],
    answer: [1, 4],
    explanation: "In a site-to-site VPN the **gateways** (routers or firewalls) build the tunnel and protect traffic between entire networks; end hosts are unaware of it. Policy-based tunnels come up when traffic matches the crypto ACL, and route-based tunnels usually stay up. Installed client software, per-user browser logins and teleworker access all describe **remote access** VPNs (client-based or clientless).",
    lesson: '4.5-ipsec-vpn',
  },
  // ---------------------------------------------------------------- 4.6 (expansion)
  {
    id: 'd4-091',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. R1 and R2 are OSPF neighbors across Gi0/0/1 with default timers. About 40 seconds after WAN-IN was applied, the adjacency went down. What is the cause?",
    exhibit: `R1(config)# ip access-list extended WAN-IN
R1(config-ext-nacl)# permit tcp any 10.1.0.0 0.0.255.255 established
R1(config-ext-nacl)# permit udp any eq domain 10.1.0.0 0.0.255.255
R1(config-ext-nacl)# permit icmp any any echo-reply
R1(config-ext-nacl)# exit
R1(config)# interface GigabitEthernet0/0/1
R1(config-if)# ip access-group WAN-IN in
R1(config-if)# end
*Oct 23 14:02:51.118: %OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on GigabitEthernet0/0/1 from FULL to DOWN, Neighbor Down: Dead timer expired`,
    options: [
      "Inbound ACLs drop all multicast packets, including OSPF hellos, no matter what their entries permit.",
      "OSPF hellos use TCP port 89, and the established keyword drops them because hellos have no ACK flag.",
      "R2's OSPF packets (IP protocol 89) match no entry, so the implicit deny drops them.",
      "Applying any ACL to an interface restarts the OSPF process on that interface, which resets the adjacency.",
    ],
    answer: [2],
    explanation: "OSPF runs directly over **IP protocol 89**, not TCP or UDP. None of WAN-IN's entries match it, so R2's hellos hit the **implicit deny**, and after the 40-second dead interval R1 declares the neighbor down. Add `permit ospf host <R2-address> any` (or `permit ospf any any`) before relying on the implicit deny. ACL entries can match multicast like any other destination. Applying an ACL does not reset routing protocols; the adjacency failed only when the dead timer expired. R1's own outgoing hellos are not filtered by an inbound ACL, but once R1 drops R2 it stops listing R2 in its hellos, so R2 tears the adjacency down too.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-092',
    topic: '4.6',
    type: 'multi',
    difficulty: 3,
    stem: "Refer to the exhibit. BRANCH-IN is applied inbound on R2's interface facing 10.20.0.0/24. Which three flows are permitted? (Choose three.)",
    exhibit: `R2# show access-lists BRANCH-IN
Extended IP access list BRANCH-IN
    10 deny   tcp 10.20.0.0 0.0.0.255 host 10.50.0.10 range 20 23 (12 matches)
    20 permit tcp 10.20.0.0 0.0.0.127 10.50.0.0 0.0.0.255 eq 22 (418 matches)
    30 permit tcp 10.20.0.0 0.0.0.255 host 10.50.0.10 gt 1023 (2290 matches)
    40 permit udp any host 10.50.0.53 eq domain (8817 matches)
    50 deny   icmp 10.20.0.0 0.0.0.255 any echo (64 matches)
    60 permit icmp any any (311 matches)`,
    options: [
      "SSH from 10.20.0.100 to 10.50.0.20",
      "SSH from 10.20.0.200 to 10.50.0.20",
      "SSH from 10.20.0.100 to 10.50.0.10",
      "TCP from 10.20.0.50 to 10.50.0.10, destination port 8080",
      "TCP from 10.20.0.50 to 10.50.0.10, destination port 1023",
      "A DNS query over UDP from 10.20.0.50 to 10.50.0.53",
    ],
    answer: [0, 3, 5],
    explanation: "Walk each flow top-down. **10.20.0.100 SSH to .20**: entry 10 is only for host .10; entry 20's source 10.20.0.0 0.0.0.127 covers .0-.127, so it is permitted. **10.20.0.200 SSH to .20**: outside .0-.127, and no later entry matches TCP 22 to .20, so the implicit deny drops it. **SSH to .10**: `range 20 23` includes 22, so entry 10 denies it before entry 20 is reached. **TCP 8080 to .10**: entry 30 `gt 1023` matches. **TCP 1023 to .10**: `gt 1023` means 1024 and above, so 1023 matches nothing and is implicitly denied. **UDP 53 to .53**: entry 40 permits it.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-093',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. SRV-IN is applied inbound on R1 Gi0/0/2, which faces the servers in 10.1.50.0/24. Users in 10.1.10.0/24 reach the servers on HTTPS, but their pings to the servers fail. No other ACL is applied. Why?",
    exhibit: `R1# show access-lists SRV-IN
Extended IP access list SRV-IN
    10 permit tcp 10.1.50.0 0.0.0.255 eq 443 10.1.10.0 0.0.0.255 (8812 matches)
    20 permit udp host 10.1.50.53 eq domain 10.1.10.0 0.0.0.255 (2210 matches)
    30 permit icmp 10.1.50.0 0.0.0.255 10.1.10.0 0.0.0.255 echo (14 matches)`,
    options: [
      "Entry 30 is reversed; it should be permit icmp 10.1.10.0 0.0.0.255 10.1.50.0 0.0.0.255 echo.",
      "Entry 10 already permits all traffic from the servers, so the pings must be blocked by the servers' host firewalls.",
      "The servers' echo replies match no entry and are dropped by the implicit deny, because entry 30 permits only echo requests.",
      "ICMP cannot be matched in an extended ACL that also contains TCP and UDP entries.",
    ],
    answer: [2],
    explanation: "A user's echo request leaves through Gi0/0/2 (no outbound ACL), but the server's **echo-reply** comes back **inbound** on Gi0/0/2. Entry 30 matches only type `echo`, so the replies fall to the implicit deny. Its 14 matches are echo requests sent **by** the servers. Use `echo-reply` (or permit both). Reversing entry 30 would describe user-to-server packets, which never arrive on this interface inbound. Entry 10 matches only TCP with source port 443. Extended ACLs freely mix TCP, UDP and ICMP entries.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-094',
    topic: '4.6',
    type: 'fill',
    difficulty: 2,
    stem: "Enter the wildcard mask that, used with base address 10.20.16.0, matches exactly the addresses 10.20.16.0 through 10.20.23.255.",
    answer: ['0.0.7.255'],
    explanation: "The range spans 8 values in the third octet (16-23) and all 256 in the fourth, which is 10.20.16.0/21 (mask 255.255.248.0). Its wildcard is **0.0.7.255**. The base works because 16 is a multiple of 8. 0.0.15.255 would also match 24-31, and 0.0.8.255 is not contiguous.",
    lesson: '4.6-acl-standard',
  },
  {
    id: 'd4-095',
    topic: '4.6',
    type: 'order',
    difficulty: 2,
    stem: "ACL USERS-IN will be applied inbound on R1's interface facing 10.1.10.0/24. Policy: host 10.1.10.99 is quarantined and may send nothing; the rest of the subnet may reach only 10.1.50.10 on HTTPS within the server subnet 10.1.50.0/24; all other traffic from the subnet is allowed. Put the entries in the only order that enforces the policy.",
    items: [
      "deny ip host 10.1.10.99 any",
      "permit tcp 10.1.10.0 0.0.0.255 host 10.1.50.10 eq 443",
      "deny ip 10.1.10.0 0.0.0.255 10.1.50.0 0.0.0.255",
      "permit ip 10.1.10.0 0.0.0.255 any",
    ],
    explanation: "First match wins, so specific entries go before broader ones. The quarantine deny must be first, or the HTTPS permit (and later the final permit) would let 10.1.10.99 through. The HTTPS permit must precede the server-subnet deny, or HTTPS to 10.1.50.10 would be denied. The broad permit must be last, or it would permit everything before the denies are reached.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-096',
    topic: '4.6',
    type: 'single',
    difficulty: 3,
    stem: "Refer to the exhibit. LAB-IN is applied inbound on the interface facing 10.1.10.0/24. Which assessment of the AI assistant's conclusion is correct?",
    exhibit: `R1# show access-lists LAB-IN
Extended IP access list LAB-IN
    10 permit tcp host 10.1.10.40 10.1.50.0 0.0.0.255 eq 443 (512 matches)
    20 deny   tcp 10.1.10.32 0.0.0.15 10.1.50.0 0.0.0.255 (77 matches)
    30 permit tcp 10.1.10.0 0.0.0.255 10.1.50.0 0.0.0.255 eq 22 (1290 matches)
    40 permit ip any any (40517 matches)

AI assistant
 "Host 10.1.10.40 can SSH to 10.1.50.22. Entry 30 permits TCP 22 from the
  whole 10.1.10.0/24 subnet, and entry 20 does not apply because it does
  not list the SSH port."`,
    options: [
      "Correct: an entry without a port operator is skipped for TCP sessions that use a well-known destination port.",
      "Wrong: the session is permitted, but by entry 40 rather than by entry 30.",
      "Wrong: entry 10 matches 10.1.10.40 first and denies SSH, because only HTTPS is listed for that host.",
      "Wrong: 10.1.10.32 0.0.0.15 includes .40, and entry 20 has no port, so it matches all TCP and denies SSH.",
    ],
    answer: [3],
    explanation: "Wildcard 0.0.0.15 with 10.1.10.32 matches **.32-.47**, which includes .40. A TCP entry with no port operator matches **all** TCP ports, so the SSH SYN matches entry 20 and is denied; entries 30 and 40 are never reached. Entry 10 does not match (port 443 only), and a non-matching entry neither permits nor denies; evaluation simply continues. An entry without a port is never skipped.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-097',
    topic: '4.6',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Pings from users to the server LAN are blocked as intended, but the engineer's test ping from R1 itself succeeds and the counter on entry 10 does not change. Why?",
    exhibit: `R1# show running-config interface GigabitEthernet0/0/2 | include access-group
 ip access-group TO-SERVERS out
R1# show access-lists TO-SERVERS
Extended IP access list TO-SERVERS
    10 deny   icmp any 10.1.50.0 0.0.0.255 echo (36 matches)
    20 permit ip any any (18874 matches)
R1# ping 10.1.50.10
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.50.10, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms
R1# show access-lists TO-SERVERS | include 10 deny
    10 deny   icmp any 10.1.50.0 0.0.0.255 echo (36 matches)`,
    options: [
      "Outbound ACLs do not filter packets that R1 itself originates, such as its own pings.",
      "For traffic sourced by R1, the entries are evaluated from the bottom up, so entry 20 permits the ping first.",
      "A router sends its pings as ICMP echo-reply messages, which entry 10 does not match.",
      "The ping was actually denied; ACL counters are updated only every five minutes.",
    ],
    answer: [0],
    explanation: "By default on IOS and IOS XE, an **outbound** interface ACL filters traffic routed **through** the router, not packets the router itself originates, so testing from R1 proves nothing. Test from a user host instead; even an extended ping sourced from another R1 interface is still generated by R1. ACLs are always evaluated top-down. A router's ping sends echo requests like any host. The five `!` replies show the ping succeeded, and counters update as packets match.",
    lesson: '4.6-acl-extended',
  },
  {
    id: 'd4-098',
    topic: '4.6',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. Which two statements are true? (Choose two.)",
    exhibit: `R1# show logging | include IPACCESSLOG
*Oct 23 16:20:04.511: %SEC-6-IPACCESSLOGP: list EDGE-IN denied tcp 198.51.100.9(51515) -> 203.0.113.10(22), 1 packet
*Oct 23 16:25:04.512: %SEC-6-IPACCESSLOGP: list EDGE-IN denied tcp 198.51.100.9(51515) -> 203.0.113.10(22), 214 packets
R1# show access-lists EDGE-IN
Extended IP access list EDGE-IN
    10 permit tcp any host 203.0.113.10 eq 443 (90412 matches)
    20 permit tcp 192.0.2.0 0.0.0.255 host 203.0.113.10 eq 22 (311 matches)
    30 deny   ip any any log (215 matches)`,
    options: [
      "198.51.100.9 tried to reach SSH on 203.0.113.10 and was denied by entry 30.",
      "198.51.100.9 is an authorized administrator, because entry 20 permits SSH to 203.0.113.10.",
      "The attempt used source port 22 and destination port 51515.",
      "The second message summarizes further packets of the same flow denied during the next logging interval, rather than one message per packet.",
      "Entry 30 logs the packets but still forwards them, because the log keyword overrides deny.",
    ],
    answer: [0, 3],
    explanation: "The log format is `source(port) -> destination(port)`: 198.51.100.9 port 51515 to 203.0.113.10 port **22** (SSH). The host is not in 192.0.2.0/24, so entry 20 does not match and entry 30 denies and logs it. IOS logs the first packet of a flow immediately, then reports a **count** for that flow about every 5 minutes, which keeps logging from overwhelming the CPU (1 + 214 = 215 matches). `log` only adds logging; the action is still deny.",
    lesson: '4.6-acl-extended',
  },
  // ---------------------------------------------------------------- 4.7 (expansion)
  {
    id: 'd4-099',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. A user connected a small unmanaged switch to the wall jack on Gi1/0/12 so a desktop and a laptop can share it. The desktop works; the laptop never gets an address. What is SW1 doing on Gi1/0/12?",
    exhibit: `SW1# show port-security interface GigabitEthernet1/0/12
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Restrict
Aging Time                 : 0 mins
Aging Type                 : Absolute
SecureStatic Address Aging : Disabled
Maximum MAC Addresses      : 1
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 0
Last Source Address:Vlan   : 3c52.82a1.77f0:30
Security Violation Count   : 214`,
    options: [
      "It has err-disabled the port, so neither device can send traffic until an administrator bounces it.",
      "It drops the laptop's frames silently, without logging or counting them, because the violation mode is protect.",
      "It alternates between the two MAC addresses, securing a new one each time the current one ages out.",
      "It forwards for the secured MAC and drops, logs and counts the laptop's frames while the port stays up.",
    ],
    answer: [3],
    explanation: "With maximum 1 and **restrict**, the first MAC learned (the desktop) is secured; frames from any other MAC are dropped, a syslog/SNMP notification is generated and the **violation counter** increases (214 here), while the port stays **Secure-up**. `switchport port-security maximum 2` would let both devices work. Err-disabled would show Secure-shutdown and needs violation mode shutdown. Protect also drops silently but does not increment the counter, and the mode shown is Restrict. Aging is 0 (disabled), so the secured address never rotates.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-100',
    topic: '4.7',
    type: 'multi',
    difficulty: 2,
    stem: "Refer to the exhibit. SW1 runs DHCP snooping and DAI on VLANs 20 and 30, and Gi1/0/48 is the trusted uplink toward the DHCP server. Which two statements are true? (Choose two.)",
    exhibit: `SW1# show ip dhcp snooping binding
MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface
------------------  ---------------  ----------  -------------  ----  --------------------
00:50:56:A1:10:21   10.10.20.21      84211       dhcp-snooping   20   GigabitEthernet1/0/3
00:50:56:A1:10:35   10.10.20.35      85977       dhcp-snooping   20   GigabitEthernet1/0/5
3C:52:82:A1:77:F0   10.10.30.14      691         dhcp-snooping   30   GigabitEthernet1/0/12
Total number of bindings: 3`,
    options: [
      "SW1 assigned these addresses, acting as the DHCP server for VLANs 20 and 30.",
      "The bindings were created from DHCP ACK messages that arrived on the trusted uplink.",
      "The table is built by recording the sender addresses of ARP replies seen on untrusted ports.",
      "ARP packets that claim 10.10.20.35 with sender MAC 00:50:56:A1:10:21 are dropped by DAI.",
      "If host 10.10.20.21 is reconfigured with static address 10.10.20.50, it keeps working because its MAC is already bound.",
      "Each binding stays in the table until the switch reloads, even after its lease time reaches zero.",
    ],
    answer: [1, 3],
    explanation: "DHCP snooping builds each binding when it sees the server's **DHCPACK** arrive on a trusted port, recording MAC, IP, lease, VLAN and access port. DAI then checks the sender MAC/IP of ARP on untrusted ports: 10.10.20.35 belongs to ...10:35, so an ARP claiming it from ...10:21 is a spoof and is dropped. SW1 only snoops; the server is elsewhere. Bindings come from DHCP, never from ARP. A host that changes to a static address no longer matches its binding, so DAI drops its ARP. Bindings are removed when the lease expires (or on a DHCPRELEASE).",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-101',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Minutes after DAI was enabled on VLANs 20 and 30, every user on SW1 lost connectivity. Gi1/0/48 is the trunk to the distribution switch, which is the default gateway for both VLANs. What should the engineer do?",
    exhibit: `%SW_DAI-4-PACKET_RATE_EXCEEDED: 31 packets received in 806 milliseconds on Gi1/0/48.
%PM-4-ERR_DISABLE: arp-inspection error detected on Gi1/0/48, putting Gi1/0/48 in err-disable state

SW1# show ip arp inspection interfaces
 Interface        Trust State     Rate (pps)    Burst Interval
 ---------------  -----------     ----------    --------------
 Gi1/0/1          Untrusted               15                 1
 Gi1/0/2          Untrusted               15                 1
 ...
 Gi1/0/48         Untrusted               15                 1`,
    options: [
      "Raise the DHCP snooping rate limit on Gi1/0/48 to 100 packets per second.",
      "Trust Gi1/0/48 for DAI and bounce it; as an uplink it carries ARP for many hosts and exceeded the 15 pps untrusted limit.",
      "Configure errdisable recovery cause arp-inspection so the uplink re-enables itself, and leave it untrusted.",
      "Disable ip arp inspection validate src-mac, because it is dropping the gateway's ARP replies.",
    ],
    answer: [1],
    explanation: "Every DAI interface is **untrusted by default with a 15 pps limit**. The uplink carries ARP for the whole access switch, exceeded the limit and was err-disabled, cutting everyone off. Uplinks to switches and routers should be **trusted** (trusted interfaces have no rate limit by default), then the port must be bounced. DHCP snooping rate limits are a separate feature. Automatic recovery alone would just repeat the err-disable cycle. No `validate` option is shown or involved; the log names the rate limit as the cause.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-102',
    topic: '4.7',
    type: 'fill',
    difficulty: 1,
    stem: "Complete the interface command that err-disables an untrusted access port if it receives more than 10 DHCP packets per second: `SW1(config-if)# ip dhcp snooping ______ 10`",
    answer: ['limit rate'],
    explanation: "`ip dhcp snooping limit rate 10` caps DHCP packets on the port; exceeding it err-disables the port with cause `dhcp-rate-limit`, which stops a client from starving the server with floods of DISCOVER messages. Untrusted ports have no DHCP rate limit until one is configured. `ip dhcp snooping trust` is the separate command used on uplinks.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-103',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Hosts connect to Gi1/0/1-46, and the only legitimate IPv6 router connects to Gi1/0/48, which has no RA guard configuration. Which statement is true?",
    exhibit: `SW1 configuration (excerpt)
ipv6 nd raguard policy HOST-PORTS
 device-role host
!
interface range GigabitEthernet1/0/1 - 46
 ipv6 nd raguard attach-policy HOST-PORTS`,
    options: [
      "The router's RAs on Gi1/0/48 are also dropped, because device-role host becomes the default for every port once any policy exists.",
      "Hosts on Gi1/0/1-46 can no longer send router solicitations, so they cannot discover the default router.",
      "RAs arriving on Gi1/0/1-46 are dropped; the router's RAs on Gi1/0/48 pass because no policy is attached there.",
      "The policy has no effect until it is also attached to each VLAN under vlan configuration mode.",
    ],
    answer: [2],
    explanation: "RA guard acts only where a policy is attached. `device-role host` drops RAs **arriving** on Gi1/0/1-46, so a rogue router there is blocked, while Gi1/0/48 has no policy and its RAs pass. Attaching a `device-role router` policy to Gi1/0/48 is still good practice because it documents the router port. Policies never spread to other ports by themselves. Router solicitations are sent by hosts to routers and are not blocked by the host role. Attaching to interfaces is sufficient; VLAN attachment is an alternative, not a requirement.",
    lesson: '4.7-snooping-dai-raguard',
  },
  {
    id: 'd4-104',
    topic: '4.7',
    type: 'match',
    difficulty: 1,
    stem: "Match each Layer 2 security feature to the problem it is designed to stop.",
    pairs: [
      ['DHCP snooping', 'A rogue DHCP server handing out a malicious default gateway'],
      ['Dynamic ARP inspection', 'ARP poisoning used for a man-in-the-middle attack'],
      ['RA guard', 'A rogue IPv6 router advertisement announcing a false default router'],
      ['Port security', 'MAC flooding that fills the switch MAC address table'],
      ['Storm control', 'A broadcast storm caused by a loop through an unmanaged switch'],
    ],
    explanation: "DHCP snooping blocks server messages on untrusted ports. DAI validates ARP against snooping bindings. RA guard drops RAs on host-facing ports. Port security limits and controls the MAC addresses per port, defeating MAC flooding. Storm control rate-limits broadcast, multicast or unknown unicast traffic so a storm cannot saturate the network.",
    lesson: '4.7-port-security-storm',
  },
  {
    id: 'd4-105',
    topic: '4.7',
    type: 'single',
    difficulty: 2,
    stem: "Refer to the exhibit. Which assessment of the AI assistant's analysis is correct?",
    exhibit: `%STORM_CONTROL-3-SHUTDOWN: A packet storm was detected on Gi1/0/22. The interface has been disabled.
%PM-4-ERR_DISABLE: storm-control error detected on Gi1/0/22, putting Gi1/0/22 in err-disable state

SW1# show running-config interface GigabitEthernet1/0/22 | begin interface
interface GigabitEthernet1/0/22
 description Conf-Room-3
 switchport access vlan 20
 switchport mode access
 storm-control broadcast level 5.00 2.00
 storm-control action shutdown
 spanning-tree portfast

SW1# show interfaces status err-disabled
Port         Name               Status       Reason               Err-disabled Vlans
Gi1/0/22     Conf-Room-3        err-disabled storm-control

AI assistant
 "Broadcasts on Gi1/0/22 exceeded 5% of the link bandwidth and the action
  is shutdown, so storm control err-disabled the port. Find the source
  first (for example a cable looped through a desk switch), then enter
  shutdown and no shutdown on Gi1/0/22, or configure errdisable recovery
  cause storm-control for automatic recovery."`,
    options: [
      "Wrong: storm control only filters the excess traffic and never err-disables a port, so port security must have shut it down.",
      "Wrong: the port recovers on its own as soon as the broadcast rate falls below the 2% lower threshold.",
      "Wrong: storm control must be removed from Gi1/0/22 before no shutdown can bring the port back up.",
      "Correct: the cause, the err-disabled state and both recovery options are identified accurately.",
    ],
    answer: [3],
    explanation: "With `storm-control action shutdown`, crossing the 5% rising threshold **err-disables** the port, exactly as both log messages and the err-disabled reason show. Recovery is a manual bounce or `errdisable recovery cause storm-control`, and fixing the loop first prevents an immediate repeat. Filtering is only the default action when no action is configured. The 2% lower threshold controls when **filtering** stops; it never re-enables an err-disabled port. Storm control can stay configured; a bounce restores the port.",
    lesson: '4.7-port-security-storm',
  },
];
