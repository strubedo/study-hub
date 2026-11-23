// Domain 5 — Security. Original questions modelled on Cisco's public exam-topic wording; no recalled exam content. Protocol facts checked against RFC 2865/2866, 8907, 3748, 5176, 6749/6750, 9110 and 6585, IEEE 802.1AE values from the Linux kernel MACsec code, TrustSec CMD/SXP from draft-smith-kandula-sxp-07; IOS XE keywords against the IOS XE 17.18.1 YANG models; output layouts modelled on real IOS XE output in Cisco's genieparser test files. All device output is documentation-based and listed in REVIEW-TODO.md for checking on lab gear. Every password, key and hash is a placeholder.
const L51L = '5.1-lines-local-auth';
const L51A = '5.1-aaa';
const L52A = '5.2-acls-ipv4';
const L52S = '5.2-acls-ipv6-switch';
const L52C = '5.2-copp';
const L53 = '5.3-rest-api-security';
const L54T = '5.4-threat-defense';
const L54E = '5.4-endpoint-security';
const L54N = '5.4-ngfw';
const L54M = '5.4-trustsec-macsec';

const bank = [
  // ---------- 5.1.a Lines and local user authentication ----------
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: L51L,
    stem: 'Refer to the exhibit. An auditor reviews the line configuration of R1. Which two findings are security weaknesses? (Choose two.)',
    exhibit: `R1# show running-config | section username|line
username netadmin privilege 15 secret 9 <HASH>
line con 0
 exec-timeout 0 0
 login local
line vty 0 4
 exec-timeout 10 0
 login local
 transport input ssh
line vty 5 15
 exec-timeout 10 0
 password 7 <ENCODED>
 login
 transport input telnet ssh`,
    options: ['Lines vty 5 to 15 accept Telnet and authenticate with one shared, reversible line password', 'The console session never times out, so an unattended console stays logged in', 'The netadmin secret is stored as type 9, which can be reversed with freely available tools', 'Lines vty 0 to 4 have no password command, so they accept any SSH user without a password', 'transport input ssh on vty 0 to 4 permits only SSH version 1'],
    answer: [0, 1],
    explanation: "The sixth and later sessions land on vty 5 to 15, which allow clear-text Telnet and use a shared line password stored as type 7, an obfuscation anyone can reverse. `exec-timeout 0 0` disables the idle timeout, so a console left logged in stays at privilege 15 indefinitely. Type 9 is a one-way scrypt hash, the strongest type available. `login local` checks the local username database, so vty 0 to 4 need no line password. `transport input ssh` allows SSH; the SSH version is controlled by `ip ssh version`, and current IOS XE runs version 2." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L51L,
    stem: 'Refer to the exhibit. The engineer wants the key pair to be named R1.example.com. Which global configuration command must be entered before the key can be generated? (Give the full command.)',
    exhibit: `Router(config)# hostname R1
R1(config)# crypto key generate rsa modulus 2048
% Please define a domain-name first.`,
    answer: ['ip domain name example.com', 'ip domain-name example.com'],
    explanation: "The default RSA key pair is named hostname.domain, so IOS needs both a non-default hostname and a domain name. The hostname is set; the error asks for the domain: `ip domain name example.com` (the older hyphenated form `ip domain-name` is also accepted on many releases). Then `crypto key generate rsa modulus 2048` creates `R1.example.com` and enables the SSH server." },
  { topic: '5.1', type: 'multi', difficulty: 1, lesson: L51L,
    stem: 'Which two password types in an IOS XE configuration can be turned back into the original password by anyone who has a copy of the configuration file? (Choose two.)',
    options: ['Type 0', 'Type 7', 'Type 5', 'Type 8', 'Type 9', 'Type 6'],
    answer: [0, 1],
    explanation: "Type 0 is plaintext, and type 7 is Cisco's reversible obfuscation, decoded instantly by public tools. Types 5 (salted MD5), 8 (PBKDF2-SHA-256) and 9 (scrypt) are one-way hashes: they can only be attacked by guessing, and 8 and 9 make guessing expensive. Type 6 is reversible AES encryption, but only with the master key, which is held on the device and not printed in the configuration, so a copy of the file alone is not enough." },
  { topic: '5.1', type: 'single', difficulty: 1, lesson: L51L,
    stem: 'Refer to the exhibit. A user at the R1> prompt types enable. Which password does R1 accept?',
    exhibit: `R1# show running-config | include ^enable
enable secret 9 <HASH>
enable password ExamplePass123

(ExamplePass123 is a placeholder; assume the two values differ.)`,
    options: ['Only the password configured with enable secret', 'Only the password configured with enable password, because it is listed later', 'Either of the two passwords', 'Neither, until service password-encryption is enabled'],
    answer: [0],
    explanation: "When both are configured, `enable secret` takes precedence and `enable password` is ignored. The order in the configuration does not matter, so the second option is wrong, and the two are never both accepted. `service password-encryption` only encodes type 0 passwords as type 7; it has nothing to do with which enable password works. Best practice is to remove `enable password` entirely." },
  { topic: '5.1', type: 'order', difficulty: 2, lesson: L51L,
    stem: 'An engineer is moving remote management of R1 (hostname still Router) from Telnet to SSH while connected over Telnet. Put the steps in the order that avoids configuration errors and avoids locking the engineer out.',
    items: ['Set a hostname with hostname R1 and a domain with ip domain name example.com', 'Generate the key pair with crypto key generate rsa modulus 2048', 'Create username netadmin privilege 15 algorithm-type scrypt secret, then under every vty range configure login local and transport input ssh', 'From a second window confirm an SSH login works and check show ip ssh before closing the Telnet session'],
    explanation: "The key cannot be generated until a non-default hostname and a domain name exist, because the key is named hostname.domain (IOS refuses with a message asking for a domain name, or for a hostname other than Router). The key must exist before the vty lines are switched to SSH only: `transport input ssh` refuses new Telnet sessions at once, and until a key exists there is no SSH server either, so a dropped Telnet session would leave no way in. The local user is created in the same step, before `login local`, or nobody could log in on those lines. Testing SSH from a second window before disconnecting the current Telnet session is the last safety step." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51L,
    stem: 'Refer to the exhibit. R1 does not run AAA. What can the user helpdesk do after logging in over SSH?',
    exhibit: `R1# show running-config | include privilege|username
privilege exec level 5 clear counters
username helpdesk privilege 5 secret 9 <HASH>
username netadmin privilege 15 secret 9 <HASH>
R1# show running-config | section line vty
line vty 0 15
 login local
 transport input ssh

(after logging in as helpdesk)
R1#show privilege
Current privilege level is 5`,
    options: ['Run clear counters and every command at levels 0 to 4, but not configure terminal', 'Run any command, because any level above 1 is privileged EXEC', 'Run only clear counters, because level 5 does not include the level 1 commands', 'Nothing beyond level 1 until the user types enable 5'],
    answer: [0],
    explanation: "With `login local`, a user starts at the privilege level in the `username` entry, here 5 (confirmed by `show privilege`). A level includes every command at that level and below, so helpdesk has the level 0 and 1 commands plus `clear counters`, which was moved to level 5. `configure terminal` is still at level 15. Levels 2 to 14 are not full privileged EXEC, and no `enable 5` is needed because the user already arrives at level 5." },
  { topic: '5.1', type: 'single', difficulty: 3, lesson: L51L,
    stem: 'Refer to the exhibit. SW1, a Catalyst 9300, is managed only through its GigabitEthernet0/0 management port in Mgmt-vrf (10.99.0.5/24). SSH from the jump host 10.99.0.10 is refused, while console access works. Which change fixes the problem?',
    exhibit: `SW1# show running-config | section line vty
line vty 0 4
 access-class MGMT-HOSTS in
 login local
 transport input ssh
line vty 5 15
 access-class MGMT-HOSTS in
 login local
 transport input ssh
SW1# show ip access-lists MGMT-HOSTS
Standard IP access list MGMT-HOSTS
    10 permit 10.99.0.0, wildcard bits 0.0.0.255`,
    options: ['Add the vrf-also keyword to both access-class commands', 'Change the wildcard in MGMT-HOSTS to 0.0.0.0 so that it matches the jump host', 'Replace MGMT-HOSTS with an extended ACL, because access-class only accepts extended ACLs', 'Add ip ssh version 2 so that the jump host can negotiate SSH'],
    answer: [0],
    explanation: "Without `vrf-also`, an inbound access class applies to connections from the global routing table, and sessions arriving through a VRF interface such as the Mgmt-vrf port are refused. `access-class MGMT-HOSTS in vrf-also` applies the same ACL to VRF connections. The ACL already permits 10.99.0.10 (10.99.0.0/24); a 0.0.0.0 wildcard would match only 10.99.0.0. `access-class` accepts standard ACLs. SSH version is not the issue: the connection is refused before negotiation, and current IOS XE runs SSHv2 by default." },
  { topic: '5.1', type: 'fill', difficulty: 1, lesson: L51L,
    stem: 'Refer to the exhibit. A vulnerability scan reports that R1 accepts clear-text remote logins. Complete the line configuration command that fixes the finding while keeping SSH: transport input ____',
    exhibit: `R1# show running-config | section line vty
line vty 0 15
 exec-timeout 10 0
 login local
 transport input telnet ssh

Scan result: 10.255.0.1  TCP/22 open (SSH-2.0)  TCP/23 open (telnet)`,
    answer: ['ssh'],
    explanation: "`transport input ssh` permits only SSH for incoming sessions on the line. `transport input telnet ssh` would allow both, and `transport input none` refuses all incoming protocols. Set it on every vty range the device has." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51L,
    stem: 'Refer to the exhibit. Why is the vty password still stored as type 7?',
    exhibit: `R1(config)# service password-encryption
R1(config)# no service password-encryption
R1(config)# end
R1# show running-config | section line vty
line vty 0 4
 password 7 <ENCODED>
 login
 transport input ssh`,
    options: ['Removing service password-encryption does not decode passwords that were already encoded; it only stops new ones being encoded', 'The no form of the command takes effect only after a reload', 'Line passwords are always stored as type 7, whatever the service setting', 'The password was configured with the secret keyword, which forces type 7'],
    answer: [0],
    explanation: "`service password-encryption` converts existing and future type 0 passwords to type 7. `no service password-encryption` stops future conversion but leaves already-encoded strings as type 7; to return to plaintext you would re-enter the password. The change is immediate, not after a reload. Without the service, a line password is stored as type 0. `secret` produces a one-way hash (5, 8 or 9), never type 7, and line passwords use `password`." },
  { topic: '5.1', type: 'match', difficulty: 2, lesson: L51L,
    stem: 'Match each requirement for R1 to the configuration that meets it.',
    pairs: [
      ['Administrators keep leaving SSH sessions idle for hours', 'exec-timeout 10 0 under the vty lines'],
      ['Logs show thousands of password guesses per minute against the vty lines', 'login block-for 120 attempts 3 within 60'],
      ['Only the jump hosts in 10.99.0.0/24 may open sessions to any R1 address', 'access-class MGMT-HOSTS in vrf-also on the vty lines'],
      ['A security scan reports that R1 accepts clear-text remote logins', 'transport input ssh on every vty range'],
      ['A configuration backup must not reveal the local administrator password, even to offline tools', 'username netadmin algorithm-type scrypt secret'],
    ],
    explanation: "`exec-timeout` closes idle sessions. `login block-for` enters quiet mode after repeated failures, slowing guessing. `access-class ... in` filters by source address which hosts may open sessions, on every interface address at once, and `vrf-also` covers VRF interfaces. `transport input ssh` refuses Telnet. `algorithm-type scrypt secret` stores a type 9 one-way hash instead of a reversible password." },

  // ---------- 5.1.b Authentication and authorization using AAA ----------
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51A,
    stem: 'Refer to the exhibit. The netadmin account was deleted from ISE by mistake. netadmin now tries to log in to R1 over SSH using the password of the local account and is refused. Why?',
    exhibit: `R1# show running-config | include aaa|username
aaa new-model
aaa authentication login default group RAD-SERVERS local
username netadmin privilege 15 secret 9 <HASH>

R1# show aaa servers
RADIUS: id 1, priority 1, host 10.10.50.11, auth-port 1812, acct-port 1813, hostname ISE-RAD-1
     State: current UP, duration 93511s, previous duration 0s
     Dead: total time 0s, count 0
     Authen: request 6, timeouts 0, failover 0, retransmission 0
             Response: accept 3, reject 3, challenge 0`,
    options: ['ISE answered with a reject, so the method list stops; local is tried only when the RADIUS group returns an error such as a timeout', 'The vty lines need login local before the local database can be used', 'RADIUS cannot be used for device administration logins, so every attempt fails', 'The local user needs privilege 1 to be used as a fallback'],
    answer: [0],
    explanation: "The server is UP and the counters show rejects, not timeouts. A reject is a FAIL result, and AAA moves to the next method only on ERROR (no response). So `local` is never consulted while ISE is reachable. Under `aaa new-model`, `login local` on a line is ignored; the method list decides. RADIUS can authenticate CLI logins (TACACS+ is preferred because of command authorization). The privilege level of the local account has nothing to do with whether it is tried." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51A,
    stem: 'Refer to the exhibit. TAC-SERVERS contains only ISE-TAC-1. A user tries to log in to R1 over SSH. Which credentials will succeed?',
    exhibit: `R1# show running-config | include aaa authentication|username
aaa authentication login default group TAC-SERVERS local
username netadmin privilege 15 secret 9 <HASH>

R1# show tacacs

Tacacs+ Server -  public  :
               Server name: ISE-TAC-1
            Server address: 10.10.50.11
               Server port: 49
              Socket opens:          0
             Socket closes:          0
             Socket aborts:          0
             Socket errors:          0
           Socket Timeouts:          7
   Failed Connect Attempts:          7
        Total Packets Sent:          0
        Total Packets Recv:          0
             Server Status: Dead`,
    options: ['The local netadmin username and its password, after the TACACS+ attempt times out', 'Any ISE account, because R1 caches earlier TACACS+ authentications', 'None, because a dead server causes the method list to fail', 'Any username with the enable secret as the password'],
    answer: [0],
    explanation: "The server never answers (seven connect failures and timeouts, status Dead). No response is an ERROR, so AAA moves to the next method, `local`, and the local account works. IOS does not cache TACACS+ logins for this purpose. A failed (unreachable) group is exactly the case in which fallback happens. The `enable` method is not in this list." },
  { topic: '5.1', type: 'order', difficulty: 2, lesson: L51A,
    stem: 'An engineer will move logins on R1 from local passwords to TACACS+ on ISE, working over SSH. Put the steps in the order that avoids locking anyone out.',
    items: ['Create a local fallback user with a scrypt secret and test it', 'Enter aaa new-model', 'Define tacacs server ISE-TAC-1 (address ipv4, key), add it to aaa group server tacacs+ TAC-SERVERS with server name ISE-TAC-1, and set ip tacacs source-interface', 'Prove the server path with test aaa group TAC-SERVERS', 'Configure aaa authentication login default group TAC-SERVERS local'],
    explanation: "`aaa new-model` immediately makes new vty logins use the local database (no default list yet), so the local user must exist first. The `aaa group server` and other `aaa` commands are available only after `aaa new-model`. The server is defined before the group references it by name, and the source interface must match the address ISE has for R1. `test aaa group` proves server, key and source address without risking a login. Only then is the default login list switched to TACACS+, with `local` as the fallback for when the servers are unreachable." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L51A,
    stem: 'Refer to the exhibit. The ISE shell profile for administrators returns priv-lvl=15, but they land at level 1 after logging in. Complete the missing command: aaa authorization ____ default group TAC-SERVERS local',
    exhibit: `R1# show running-config | include ^aaa
aaa new-model
aaa authentication login default group TAC-SERVERS local
aaa authorization commands 15 default group TAC-SERVERS local
aaa accounting commands 15 default start-stop group TAC-SERVERS

(administrator logs in over SSH)
R1>show privilege
Current privilege level is 1`,
    answer: ['exec'],
    explanation: "Authentication alone does not request the shell attributes. `aaa authorization exec default group TAC-SERVERS local` makes R1 ask TACACS+ for EXEC authorization, which returns the privilege level (`priv-lvl=15`). Command authorization (`commands 15`) only checks individual level-15 commands, and accounting only records them, so neither raises the starting level." },
  { topic: '5.1', type: 'multi', difficulty: 1, lesson: L51A,
    stem: 'Which three statements describe TACACS+? (Choose three.)',
    options: ['It uses TCP port 49', 'It obfuscates the entire packet body with the shared key', 'It keeps authentication, authorization and accounting separate, allowing per-command authorization', 'It uses UDP ports 1812 and 1813', 'It hides only the user password attribute and sends the rest in clear text', 'It is specified in RFC 2865'],
    answer: [0, 1, 2],
    explanation: "TACACS+ (RFC 8907) runs over TCP 49, obfuscates the whole body (the RFC calls it obfuscation, not strong encryption) and handles authentication, authorization and accounting as separate exchanges, which is what allows the device to authorize each command. UDP 1812/1813, password-only hiding and RFC 2865 describe RADIUS." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51A,
    stem: 'Refer to the exhibit. After a firewall change, R1 can no longer reach either TACACS+ server. An engineer connects to the console port. What happens?',
    exhibit: `R1# show running-config | include aaa|username|line con|login
aaa new-model
aaa authentication login default group TAC-SERVERS
line con 0
 exec-timeout 10 0`,
    options: ['The console login fails for every user, because the default list has no fallback method and applies to the console', 'The console is never subject to AAA, so the engineer gets a prompt without a login', 'The console automatically falls back to the local database when the servers are unreachable', 'The console accepts the enable secret as the login password'],
    answer: [0],
    explanation: "The console has no `login authentication` command, so it uses the default list, which contains only TACACS+. With both servers unreachable the group returns ERROR and there is no next method, so authentication fails for everyone: the classic AAA lockout. The fix (once in, or via password recovery) is to add `local` to the default list and give the console its own list. The console is unauthenticated only when no default login list exists. There is no automatic local fallback, and `enable` is used only when listed as a method." },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L51A,
    stem: 'Refer to the exhibit. The engineer wants SSH logins to try the local database first, but debug aaa authentication shows that vty sessions still use the default list. Which line configuration command is missing under line vty 0 15? (Give the full command.)',
    exhibit: `R1# show running-config | include aaa authentication
aaa authentication login default group TAC-SERVERS local
aaa authentication login VTY-LOCAL-FIRST local group TAC-SERVERS
R1# show running-config | section line vty
line vty 0 15
 exec-timeout 10 0
 transport input ssh`,
    answer: ['login authentication VTY-LOCAL-FIRST'],
    explanation: "A named method list does nothing until a line references it. `login authentication VTY-LOCAL-FIRST` under `line vty 0 15` applies it; lines without that command use the `default` list, which is what the debug shows. List names are case-sensitive, so type the name exactly as defined." },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51A,
    stem: 'Refer to the exhibit. ISE has R1 defined as a network device with IP address 10.255.0.1. Every RADIUS login on R1 times out, and the ISE logs show requests from an unknown network device. Which change fixes it?',
    exhibit: `R1# show ip interface brief | exclude unassigned
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   172.16.0.2      YES manual up                    up
GigabitEthernet0/0/1   10.1.10.1       YES manual up                    up
Loopback0              10.255.0.1      YES manual up                    up

R1# show ip route 10.10.50.11 | include via
  * 172.16.0.1, from 10.255.0.2, 00:41:10 ago, via GigabitEthernet0/0/0

ISE log: RADIUS request dropped - unknown network device, source 172.16.0.2`,
    options: ['Configure ip radius source-interface Loopback0 on R1', 'Change the RADIUS server definition to use auth-port 1645', 'Configure ip tacacs source-interface Loopback0 on R1', 'Add the key again under radius server, because the key is wrong'],
    answer: [0],
    explanation: "Without a source interface, R1 sources RADIUS from the egress interface toward ISE, Gi0/0/0 (172.16.0.2). ISE identifies network devices by source IP and silently drops requests from an address it does not know, so R1 sees timeouts. `ip radius source-interface Loopback0` makes requests come from 10.255.0.1, which ISE knows. Port 1645 is the old RADIUS port and would make things worse. `ip tacacs source-interface` affects TACACS+, not RADIUS. A key mismatch produces a different ISE error; here the device is not even recognised." },

  // ---------- 5.2.a ACLs ----------
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Complete the wildcard mask in entry 10 so that it matches exactly the Engineering block.',
    exhibit: `Site address plan
Block          First address   Last address
Engineering    10.1.16.0       10.1.31.255
Finance        10.1.32.0       10.1.33.255

R1(config)# ip access-list standard ENG-ONLY
R1(config-std-nacl)# 10 permit 10.1.16.0 ???????`,
    answer: ['0.0.15.255'],
    explanation: "10.1.16.0 to 10.1.31.255 is 16 consecutive third-octet values (16 to 31) with any fourth octet: a /20 (255.255.240.0). The wildcard is 255 minus each mask octet: 0.0.15.255. 16 is a multiple of 16, so the block is aligned. 0.0.31.255 would also match 10.1.0.0 to 10.1.31.255 (the address would be treated as 10.1.0.0/19), and 0.0.16.255 is a non-contiguous mask that matches the wrong addresses." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Host 10.1.1.70 opens an HTTPS connection to 192.0.2.10. What happens to its first packet when it arrives on Gi0/0/1?',
    exhibit: `R1# show running-config | section LAN-IN|interface GigabitEthernet0/0/1
ip access-list extended LAN-IN
 10 deny   tcp 10.1.1.0 0.0.0.63 any eq 443
 20 permit tcp 10.1.1.0 0.0.0.255 host 192.0.2.10 eq 443
 30 permit udp 10.1.1.0 0.0.0.255 any eq domain
 40 deny   ip any any log
interface GigabitEthernet0/0/1
 ip address 10.1.1.1 255.255.255.0
 ip access-group LAN-IN in`,
    options: ['It is permitted by entry 20', 'It is denied by entry 10', 'It is denied by entry 40 and logged', 'It is denied by the implicit deny at the end of the ACL'],
    answer: [0],
    explanation: "Work through the entries. Entry 10 matches sources 10.1.1.0 to 10.1.1.63 (wildcard 0.0.0.63); .70 is outside, so no match. Entry 20 matches sources 10.1.1.0 to 10.1.1.255, destination host 192.0.2.10 and destination port 443: all true, so the packet is permitted and evaluation stops. Entries 30 and 40 and the implicit deny are never reached. (Host 10.1.1.20, by contrast, would be denied by entry 10.)" },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. WAN-IN is applied inbound on R1\'s internet interface. Inside hosts can browse the web, but pings from inside hosts to internet addresses fail, and none of the counters increase when they try. What is the cause and the best fix?',
    exhibit: `R1# show access-lists WAN-IN
Extended IP access list WAN-IN
    10 permit tcp any host 203.0.113.10 eq 443 (5120 matches)
    20 permit udp host 198.51.100.53 eq domain any (884 matches)
    30 permit tcp any any established (91233 matches)`,
    options: ['The ICMP echo replies match no entry and are dropped by the implicit deny, which has no counter; add a permit for echo-reply and a final deny ip any any log', 'Entry 30 drops the echo replies because established only matches TCP', 'Counters are not kept for ICMP, so the replies are matched by entry 30 but not counted', 'The echo requests are dropped by WAN-IN as they leave R1'],
    answer: [0],
    explanation: "Echo replies are ICMP, so they match neither the TCP entries nor the UDP DNS entry and fall to the implicit deny. The implicit deny is not a visible line, so no counter increases. `permit icmp any any echo-reply` (and other ICMP types you need, such as unreachable and time-exceeded for traceroute) fixes it, and an explicit `deny ip any any log` makes future drops visible. Entry 30 simply does not match ICMP; a non-matching entry never drops anything. ICMP entries do keep counters. WAN-IN is applied inbound, so it does not see the outgoing echo requests." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Pings from PC1 (10.1.10.5) to R2 fail, but a ping from R1 to R2\'s address succeeds. Why?',
    exhibit: `R1# show running-config | section TO-R2|interface GigabitEthernet0/0/0
ip access-list extended TO-R2
 10 deny   icmp any any
 20 permit ip any any
interface GigabitEthernet0/0/0
 description Link to R2
 ip address 10.0.12.1 255.255.255.252
 ip access-group TO-R2 out`,
    options: ['An outbound ACL does not filter packets that R1 itself originates', 'R1 sources its ping from a loopback, which entry 20 permits', 'Entry 10 matches only transit ICMP, by definition of the any keyword', 'The ACL is evaluated only after the ping from R1 has already been answered'],
    answer: [0],
    explanation: "Outbound interface ACLs filter traffic forwarded through the router, not packets generated by the router's own processes, so R1's echo requests leave without being checked against TO-R2 while PC1's are denied by entry 10. A ping from R1 is sourced from Gi0/0/0 by default, not a loopback, and entry 10 would match any ICMP if it were applied. `any` matches every address. The ACL is checked before the packet leaves, not after a reply." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. The requirement is to stop the 10.1.10.0/24 users reaching the server LAN 10.50.0.0/24 while keeping their internet access. After the change, the users lose internet access too. What is the best fix?',
    exhibit: `Users 10.1.10.0/24 -- Gi0/0/1 R1 Gi0/0/0 -- Gi0/0/0 R2 Gi0/0/1 -- Servers 10.50.0.0/24
                         R1 Gi0/0/2 -- Internet

R1(config)# access-list 10 deny 10.1.10.0 0.0.0.255
R1(config)# access-list 10 permit any
R1(config)# interface GigabitEthernet0/0/1
R1(config-if)# ip access-group 10 in`,
    options: ['Remove ACL 10 from R1 Gi0/0/1, create the same ACL 10 on R2 and apply it outbound on R2 Gi0/0/1, close to the destination', 'Apply ACL 10 outbound on R1 Gi0/0/2', 'Add access-list 10 permit 10.1.10.0 0.0.0.255 at the end of ACL 10', 'Change ACL 10 to deny 10.50.0.0 0.0.0.255, because standard ACLs match the destination'],
    answer: [0],
    explanation: "A standard ACL matches only the source, so on R1's user-facing interface it blocks the users from everything. Placed outbound on R2's server-facing interface, it only affects traffic going to the servers: standard ACLs belong close to the destination. Outbound on R1 Gi0/0/2 would block the users' internet traffic and leave the servers reachable. A permit after the deny is never reached for those sources. Standard ACLs match the source address, not the destination. (An extended ACL near the source is the other valid design.)" },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. Which two statements about entry 10 are true? (Choose two.)',
    exhibit: `R1# show running-config | section INET-IN|interface GigabitEthernet0/0/2
ip access-list extended INET-IN
 10 permit tcp any 10.1.0.0 0.0.255.255 established
 20 permit tcp any host 10.1.50.10 eq 443
 30 deny   ip any any log
interface GigabitEthernet0/0/2
 description Internet
 ip address 203.0.113.2 255.255.255.252
 ip access-group INET-IN in`,
    options: ['It matches TCP segments that have the ACK or RST bit set', 'It keeps no session state, so crafted packets with the ACK bit set can pass it', 'It also permits UDP replies such as DNS responses', 'It matches the first SYN of a connection from the internet', 'It creates temporary return entries for each inside session'],
    answer: [0, 1],
    explanation: "`established` checks only the TCP flags: ACK or RST set means \"part of an existing connection\". Because it does not track sessions, an attacker can send segments with ACK set and they will match. It applies to TCP only, so DNS replies over UDP need their own entry. A first SYN has no ACK, so it does not match, which is the point. Temporary return entries are what reflexive ACLs and stateful firewalls do, not `established`." },
  { topic: '5.2', type: 'fill', difficulty: 1, lesson: L52A,
    stem: 'Refer to the exhibit. Which ACL (name or number) filters packets that R1 routes out of GigabitEthernet0/0/0?',
    exhibit: `R1# show ip interface GigabitEthernet0/0/0
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 198.51.100.2/30
  Broadcast address is 255.255.255.255
  MTU is 1500 bytes
  Helper address is not set
  Directed broadcast forwarding is disabled
  Outgoing Common access list is not set
  Outgoing access list is 110
  Inbound Common access list is not set
  Inbound  access list is WAN-IN
  Proxy ARP is disabled`,
    answer: ['110', 'access list 110', 'access-list 110'],
    explanation: "\"Outgoing access list is 110\" is the ACL applied with `ip access-group 110 out`, which filters traffic routed out of the interface. WAN-IN is applied inbound and filters traffic arriving on it. The \"Common\" lines refer to a separate feature and are not set." },
  { topic: '5.2', type: 'single', difficulty: 3, lesson: L52S,
    stem: 'Refer to the exhibit. Shortly after V6-IN was applied, R1 can no longer reach hosts on the 2001:db8:10::/64 LAN, and the neighbor entries for them show INCMP. What is the cause?',
    exhibit: `R1# show running-config | section V6-IN|interface GigabitEthernet0/0/1
ipv6 access-list V6-IN
 sequence 10 permit tcp 2001:DB8:10::/64 2001:DB8:50::/64 eq 443
 sequence 20 deny ipv6 any any log
interface GigabitEthernet0/0/1
 ipv6 address 2001:DB8:10::1/64
 ipv6 traffic-filter V6-IN in`,
    options: ['The explicit deny at sequence 20 is evaluated before the implicit permits for neighbor discovery, so neighbor advertisements are dropped', 'IPv6 ACLs must be applied with ipv6 access-group, so the filter is not active', 'IPv6 ACLs have no implicit entries, so the ACL always needs a permit icmp any any', 'Sequence 10 uses an uppercase prefix, which the parser treats as a different network'],
    answer: [0],
    explanation: "Every IPv6 ACL ends with implicit `permit icmp any any nd-na`, `permit icmp any any nd-ns` and `deny ipv6 any any`. An explicit `deny ipv6 any any` sits above them, so neighbor advertisements from the hosts are denied inbound and R1 cannot complete resolution (INCMP). Adding `permit icmp any any nd-na` and `nd-ns` above sequence 20 fixes it. `ipv6 traffic-filter` is the correct command. The ACL does have implicit entries. IPv6 addresses are case-insensitive; IOS displays them in uppercase." },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: L52S,
    stem: 'An engineer must drop TFTP between hosts inside VLAN 20 on SW1 while forwarding all other VLAN 20 traffic. Put the configuration steps in order.',
    items: ['Create ip access-list extended TFTP-TRAFFIC with permit udp any any eq tftp', 'Create vlan access-map VLAN20-POLICY with sequence 10 (match ip address TFTP-TRAFFIC, action drop) and sequence 20 (action forward, no match clause)', 'Apply the map with vlan filter VLAN20-POLICY vlan-list 20', 'Verify with show vlan access-map VLAN20-POLICY and show vlan filter'],
    explanation: "The ACL defines what the map entry matches (its `permit` means \"match\"), so it is built first. In the map, sequence 10 drops the matched TFTP traffic and sequence 20, with no `match`, forwards everything else. Both entries must exist before `vlan filter`: without sequence 20 the VLAN map's implicit drop would black out VLAN 20 the moment the filter is applied. Applying the map is the step that activates it, and the `show` commands confirm the map and the VLANs it is attached to." },
  { topic: '5.2', type: 'match', difficulty: 2, lesson: L52S,
    stem: 'Match each filtering requirement on a Catalyst 9300 to the feature that meets it.',
    pairs: [
      ['Stop two hosts in the same VLAN 20 from exchanging SMB traffic', 'VLAN access map applied with vlan filter'],
      ['Filter traffic routed from VLAN 30 into VLAN 40 at the VLAN 40 gateway', 'Router ACL on the SVI with ip access-group'],
      ['Filter only the traffic entering the single access port of a lab PC', 'Port ACL on the Layer 2 interface'],
      ['Allow only the NOC subnet to open SSH sessions to the switch itself', 'access-class on the vty lines'],
      ['Allow guest VLAN users HTTPS only between 08:00 and 18:00 on weekdays', 'ACL entry with a time-range'],
    ],
    explanation: "Traffic between hosts in one VLAN is bridged, never routed, so only a VACL (or a PACL on each port) sees it. Routed traffic between VLANs is what a RACL on an SVI filters. A PACL applies to one Layer 2 port. Management sessions to the device are controlled by `access-class` on the lines. A `time-range` makes an entry active only in the defined period." },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. SSH from 10.1.10.0/24 to 10.50.0.21 still fails after the engineer\'s change. Why, and what is the fix?',
    exhibit: `R1# show access-lists 101
Extended IP access list 101
    10 permit tcp 10.1.10.0 0.0.0.255 any eq 443 (2210 matches)
    20 deny ip any any log (48 matches)
R1# configure terminal
R1(config)# access-list 101 permit tcp 10.1.10.0 0.0.0.255 host 10.50.0.21 eq 22
R1(config)# end`,
    options: ['The new entry was appended as sequence 30, below the deny; enter ip access-list extended 101 and add it as sequence 15', 'Numbered ACLs cannot permit SSH; convert ACL 101 to a named ACL', 'The new entry needs the established keyword for SSH to work', 'The access-list command replaced the whole ACL with the single new entry'],
    answer: [0],
    explanation: "The global `access-list` command always appends to the end, so the new permit becomes entry 30 after `deny ip any any log` and never matches; the deny counter keeps rising. In ACL configuration mode (`ip access-list extended 101`), `15 permit tcp 10.1.10.0 0.0.0.255 host 10.50.0.21 eq 22` inserts it above the deny. Numbered ACLs can match any port. `established` would block the initial SYN. The global command adds an entry; it does not replace the ACL." },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. A TCP segment from 172.16.9.20 port 51514 to 10.10.10.5 port 22 arrives on the interface where MGMT-IN is applied inbound. Which sequence number does it match?',
    exhibit: `ip access-list extended MGMT-IN
 10 deny   tcp 172.16.10.0 0.0.1.255 host 10.10.10.5 eq 22
 20 permit tcp 172.16.8.0 0.0.3.255 host 10.10.10.5 eq 22
 30 deny   tcp any any eq 22 log
 40 permit ip any any`,
    answer: ['20'],
    explanation: "Entry 10 covers sources 172.16.10.0 to 172.16.11.255 (wildcard 0.0.1.255 on an aligned block of two third-octet values); the third octet 9 is outside, so no match. Entry 20 covers 172.16.8.0 to 172.16.11.255 (0.0.3.255, four values from 8), the destination is host 10.10.10.5 and the destination port is 22: it matches and the segment is permitted. Entries 30 and 40 are never evaluated." },

  // ---------- 5.2.b CoPP ----------
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52C,
    stem: 'Refer to the exhibit. During a nightly job that backs up configurations by SCP from 10.99.0.0/24, administrators cannot keep an SSH session to R1 open. What is the most likely cause?',
    exhibit: `R1# show policy-map control-plane
 Control Plane

  Service-policy input: PM-COPP

    Class-map: CM-COPP-MGMT (match-all)
      96214 packets, 8466832 bytes
      5 minute offered rate 214000 bps, drop rate 150000 bps
      Match: access-group name COPP-MGMT
      police:
          cir 64000 bps, bc 2000 bytes
        conformed 27411 packets, 2412168 bytes; actions:
          transmit
        exceeded 68803 packets, 6054664 bytes; actions:
          drop
        conformed 64000 bps, exceeded 150000 bps`,
    options: ['The management class is policed at 64 kbit/s and the excess, including SSH, is dropped; the rate is too low for the backup traffic', 'The SSH packets fall into class-default, which drops them', 'COPP-MGMT denies TCP port 22, so SSH packets are dropped by the ACL', 'The police rate must be configured in pps, so the bps policer drops everything above 64 packets'],
    answer: [0],
    explanation: "About 214 kbit/s of management traffic arrives against a 64 kbit/s CIR; 150 kbit/s is exceeding and dropped (68,803 packets so far). The backup and interactive SSH share the class, so SSH loses packets too. The fix is to raise the rate based on a baseline, or to classify bulk transfers separately. The counters show the traffic is matching this class, not class-default. A deny in a CoPP class ACL would make packets skip the class, not drop them. A bps policer is valid; it measures bits, not packets." },
  { topic: '5.2', type: 'single', difficulty: 3, lesson: L52C,
    stem: 'Refer to the exhibit. What happens to ICMP echo requests from 10.99.0.10 to R1\'s loopback address?',
    exhibit: `ip access-list extended COPP-ICMP
 10 deny   icmp host 10.99.0.10 any
 20 permit icmp any any
class-map match-all CM-COPP-ICMP
 match access-group name COPP-ICMP
policy-map PM-COPP
 class CM-COPP-ICMP
  police 32000 conform-action transmit exceed-action drop
 class class-default
  police 256000 conform-action transmit exceed-action transmit
control-plane
 service-policy input PM-COPP`,
    options: ['They do not match CM-COPP-ICMP and are handled by class-default, which transmits them', 'They are dropped by entry 10 of COPP-ICMP', 'They match CM-COPP-ICMP and are policed at 32 kbit/s', 'They are dropped because they match no class in PM-COPP'],
    answer: [0],
    explanation: "In a class-map ACL, `deny` means \"not in this class\". Entry 10 removes 10.99.0.10's ICMP from CM-COPP-ICMP, so the packets fall through to `class-default`, policed at 256 kbit/s with both actions `transmit`: they reach the CPU. An ACL in a class never drops packets itself. Every packet matches at least `class-default`, so nothing is unclassified." },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: L52C,
    stem: 'Put the steps for deploying CoPP on an ISR 4000 router in order.',
    items: ['Write extended ACLs that permit the routing, management and ICMP traffic for each class', 'Create class maps that match those ACLs with match access-group name', 'Create a policy map that polices each class and class-default', 'Enter control-plane configuration mode', 'Apply the policy with service-policy input', 'Watch show policy-map control-plane counters before tightening exceed actions to drop'],
    explanation: "MQC is built bottom-up: ACLs classify, class maps reference the ACLs, the policy map references the class maps and adds police actions. The policy takes effect when it is attached under `control-plane` with `service-policy input`. Best practice is to start with permissive actions, baseline the counters, and then set drop actions." },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: L52C,
    stem: 'Which two statements about CoPP on Catalyst 9000 switches are true? (Choose two.)',
    options: ['A system-defined policy named system-cpp-policy is applied to the control plane by default', 'The police rate of a system-defined class can be changed, and is expressed in packets per second', 'No CPU protection is active until the administrator creates and attaches a policy', 'The administrator can replace system-cpp-policy with a custom policy using service-policy input under control-plane', 'System-defined classes can be deleted to stop policing a protocol'],
    answer: [0, 1],
    explanation: "Catalyst 9000 switches apply `system-cpp-policy` automatically, so CoPP is on from first boot. You can change the pps rate of a system-defined class under `policy-map system-cpp-policy` (and restore defaults with `cpp system-default`). You cannot attach a different policy of your own, and you cannot delete the system classes or change what they match. Routers are the platforms where no CoPP exists until you configure it." },
  { topic: '5.2', type: 'fill', difficulty: 1, lesson: L52C,
    stem: 'Refer to the exhibit. How many packets has CoPP dropped in the ICMP class since the counters were last cleared? (Digits only.)',
    exhibit: `R1# show policy-map control-plane
 Control Plane

  Service-policy input: PM-COPP

    Class-map: CM-COPP-ICMP (match-all)
      40250 packets, 4266500 bytes
      5 minute offered rate 52000 bps, drop rate 20000 bps
      Match: access-group name COPP-ICMP
      police:
          cir 32000 bps, bc 1500 bytes
        conformed 25012 packets, 2651272 bytes; actions:
          transmit
        exceeded 15238 packets, 1615228 bytes; actions:
          drop
        conformed 32000 bps, exceeded 20000 bps`,
    answer: ['15238', '15,238'],
    explanation: "The exceed action is `drop`, so the exceeded counter is the number of dropped packets: 15,238. The conformed 25,012 packets were transmitted to the CPU; together they make the 40,250 packets that matched the class. The drop rate (20 kbit/s) is the current rate, not a packet count." },
  { topic: '5.2', type: 'fill', difficulty: 1, lesson: L52C,
    stem: 'A CoPP class for ARP on an IOS XE router must be policed to 200 packets per second. Complete the command: police rate 200 ____',
    answer: ['pps'],
    explanation: "`police rate 200 pps` polices in packets per second, which matches how punted traffic loads the CPU. Without the `pps` keyword a rate is in bits per second. IOS XE accepts a pps policer only in a policy applied to the control plane." },

  // ---------- 5.3 REST API security ----------
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53,
    stem: 'Refer to the exhibit. A monitoring script authenticates once to Catalyst Center at the start of the shift. Why does the last request fail?',
    exhibit: `Time      Method  Path                                       Status
09:00:02  POST    /dna/system/api/v1/auth/token              200
09:00:03  GET     /dna/intent/api/v1/network-device          200
09:41:17  GET     /dna/intent/api/v1/network-device          200
10:03:55  GET     /dna/intent/api/v1/network-device          401`,
    options: ['The token has expired after its 60-minute lifetime; the script must request a new token', 'The account lost the role that allows it to read the device inventory', 'The script exceeded Catalyst Center\'s rate limit', 'The Catalyst Center certificate expired, so the TLS session failed'],
    answer: [0],
    explanation: "Catalyst Center tokens last 60 minutes; the request at 10:03 is more than an hour after the token was issued at 09:00, and an expired token returns 401 Unauthorized. A missing role returns 403 Forbidden, a rate limit 429 Too Many Requests. A certificate problem fails the TLS handshake before any HTTP status is returned." },
  { topic: '5.3', type: 'match', difficulty: 2, lesson: L53,
    stem: 'Match each API client situation to the HTTP status code the server returns.',
    pairs: [
      ['The script sends a token that was revoked when the user left', '401 Unauthorized'],
      ['An account with a read-only role sends a POST to deploy a template', '403 Forbidden'],
      ['A loop sends hundreds of requests per second and the controller throttles it', '429 Too Many Requests'],
      ['The script asks for a device ID that does not exist in the inventory', '404 Not Found'],
    ],
    explanation: "401 means the request lacks valid authentication (missing, wrong, expired or revoked credentials or token). 403 means the server understood who is asking and refuses because the role does not permit the action. 429 (RFC 6585) signals a rate limit. 404 means the resource does not exist." },
  { topic: '5.3', type: 'multi', difficulty: 2, lesson: L53,
    stem: 'Refer to the exhibit. Which two changes improve the security of this script? (Choose two.)',
    exhibit: `import requests
from requests.auth import HTTPBasicAuth

CATC = "https://10.10.20.85"
resp = requests.post(CATC + "/dna/system/api/v1/auth/token",
                     auth=HTTPBasicAuth("admin", "ExamplePass123"),
                     verify=False)
token = resp.json()["Token"]`,
    options: ['Read the username and password from environment variables or a vault instead of the source code', 'Validate the server certificate against the trusted CA instead of using verify=False', 'Send the credentials as URL query parameters instead of Basic authentication', 'Use GET instead of POST for the token request so that no body is sent', 'Switch to plain HTTP, because Basic authentication already encodes the password'],
    answer: [0, 1],
    explanation: "Hard-coded credentials leak through version control and file shares; environment variables or a secrets vault keep them out of the code. `verify=False` still encrypts but no longer checks who the server is, so a man-in-the-middle can collect the password; point `verify` at the CA certificate instead. Query parameters end up in logs and browser history. The token endpoint is a POST with Basic credentials by design. Base64 is encoding, not encryption, so Basic authentication over plain HTTP exposes the password." },
  { topic: '5.3', type: 'fill', difficulty: 1, lesson: L53,
    stem: 'Refer to the exhibit. Which header name must replace the underscores so that Catalyst Center accepts the token?',
    exhibit: `token = get_token()          # from POST /dna/system/api/v1/auth/token
headers = {"__________": token, "Accept": "application/json"}
r = requests.get(CATC + "/dna/intent/api/v1/network-device",
                 headers=headers, verify=CA_FILE, timeout=10)`,
    answer: ['X-Auth-Token'],
    explanation: "Catalyst Center expects the token in the `X-Auth-Token` header on every Intent API request. It is not sent as `Authorization: Bearer`, which is the OAuth 2.0 convention (RFC 6750) used by other APIs." },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53,
    stem: 'Refer to the exhibit. How is this RESTCONF request to an IOS XE router authenticated?',
    exhibit: `$ curl -u netadmin -H "Accept: application/yang-data+json" \\
    https://10.10.10.1/restconf/data/Cisco-IOS-XE-native:native/hostname
Enter host password for user 'netadmin':
{
  "Cisco-IOS-XE-native:hostname": "R1"
}`,
    options: ['With HTTP Basic credentials over HTTPS on each request, for a user with privilege level 15', 'By requesting a token from /dna/system/api/v1/auth/token and sending it in X-Auth-Token', 'With an OAuth 2.0 bearer token issued by the router\'s built-in authorization server', 'With an SSH key pair over TCP port 830'],
    answer: [0],
    explanation: "IOS XE RESTCONF uses HTTP Basic authentication over HTTPS, checked against local users or AAA; the account needs privilege 15 to read and change the configuration. The token endpoint and `X-Auth-Token` belong to Catalyst Center. The router does not run an OAuth authorization server. SSH on port 830 is NETCONF, not RESTCONF." },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53,
    stem: 'A new reporting tool only needs to read the device inventory and health scores from Catalyst Center. Which approach follows the principle of least privilege?',
    options: ['Create a dedicated account for the tool with an observer (read-only) role', 'Let the tool use the shared administrator account, rotating its password monthly', 'Create a dedicated account with the super-admin role so that future reports need no changes', 'Give the tool the administrator\'s current token so that it never stores a password'],
    answer: [0],
    explanation: "Least privilege means the minimum rights for the job, under an identity that is accountable: a dedicated read-only account. A shared administrator account gives write access and hides who did what, even with rotation. A super-admin role grants far more than reading. Sharing someone's token ties the tool to that person's full rights and breaks as soon as the token expires." },

  // ---------- 5.4 Network security design ----------
  { topic: '5.4', type: 'single', difficulty: 1, lesson: L54T,
    stem: 'What is the role of Cisco Talos in Cisco\'s security architecture?',
    options: ['It researches threats and supplies reputation data, malware verdicts and Snort rules that Cisco security products consume', 'It is the on-premises manager for Secure Firewall Threat Defense devices', 'It is the RADIUS policy server that authorizes endpoints on the network', 'It is the flow collector that stores NetFlow records for behavioural analysis'],
    answer: [0],
    explanation: "Talos is Cisco's threat intelligence and research group; its output (IP, domain and URL reputation, file dispositions, IPS rules, email filters) keeps the products current. The firewall manager is Secure Firewall Management Center, the RADIUS policy server is ISE, and flow collection is part of Secure Network Analytics." },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54T,
    stem: 'A company must detect malware command-and-control traffic hidden in TLS sessions, but policy forbids decrypting user traffic. Which capability meets the requirement?',
    options: ['Encrypted Traffic Analytics with Secure Network Analytics', 'TLS decryption on the next-generation firewall', 'MACsec on the access switch uplinks', 'An IPS policy in passive mode fed by SPAN'],
    answer: [0],
    explanation: "Encrypted Traffic Analytics exports extra flow metadata (initial data packet and sequence of packet lengths and times) from supported Catalyst switches and routers, and Secure Network Analytics analyses it to identify malicious encrypted flows without decryption. Firewall TLS decryption violates the policy. MACsec encrypts links; it does not detect anything. A passive IPS sees only ciphertext in TLS sessions." },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54T,
    stem: 'Sales staff laptops connect from home and hotel networks without a VPN. Which solution blocks their connections to known phishing and command-and-control domains before a connection is even made?',
    options: ['Cisco Umbrella DNS-layer security with the roaming module', 'An outbound ACL on the head-office internet router', 'Secure Web Appliance at the head office', 'Secure Network Analytics with NetFlow from the head-office switches'],
    answer: [0],
    explanation: "Umbrella answers the DNS query for a malicious domain with a block page address, so no connection to the real host happens, for any port or protocol; the Secure Client roaming module keeps this working off network. Head-office ACLs, an on-premises web proxy and head-office NetFlow never see traffic that does not pass through the head office." },
  { topic: '5.4', type: 'match', difficulty: 2, lesson: L54T,
    stem: 'Match each scenario to the Cisco security product designed to address it.',
    pairs: [
      ['Inbound messages carry malicious attachments and spoofed sender domains', 'Secure Email'],
      ['A file that was clean last week is now known to be ransomware; find every laptop that has it', 'Secure Endpoint'],
      ['Users anywhere must be stopped from resolving newly registered malicious domains', 'Umbrella'],
      ['An internal server suddenly sends gigabytes to an unusual external address at night', 'Secure Network Analytics'],
      ['Remote laptops must pass a posture check and build a VPN before reaching internal applications', 'Secure Client'],
      ['On-premises users\' web browsing must be filtered by category through a proxy', 'Secure Web Appliance'],
    ],
    explanation: "Secure Email (formerly ESA) filters email threats. Secure Endpoint (formerly AMP for Endpoints) raises retrospective detections and shows file trajectory. Umbrella works at the DNS layer for any user. Secure Network Analytics (formerly Stealthwatch) detects behavioural anomalies such as exfiltration from flow data. Secure Client (formerly AnyConnect) provides the VPN and the ISE posture module. Secure Web Appliance (formerly WSA) is the on-premises web proxy." },
  { topic: '5.4', type: 'order', difficulty: 2, lesson: L54E,
    stem: 'A Windows laptop connects to a switch port configured for 802.1X with EAP-TLS and ISE. Put the events in order.',
    items: ['The switch detects link up and sends an EAP Request/Identity frame over EAPOL', 'The supplicant replies with an EAP Response/Identity', 'The switch forwards the identity to ISE inside a RADIUS Access-Request', 'ISE and the supplicant exchange certificates in the EAP-TLS method, relayed by the switch', 'ISE sends a RADIUS Access-Accept with authorization attributes such as a VLAN or downloadable ACL', 'The switch sends EAP-Success to the supplicant and authorizes the port'],
    explanation: "The authenticator (switch) starts by asking for the identity (the supplicant may also start with EAPOL-Start). The identity goes to the authentication server (ISE) in RADIUS. The EAP method, here mutual certificate authentication with TLS, runs end to end between supplicant and ISE with the switch relaying EAPOL on one side and RADIUS on the other. ISE returns Access-Accept with the authorization result, and the switch passes EAP-Success to the client and opens the port." },
  { topic: '5.4', type: 'single', difficulty: 1, lesson: L54E,
    stem: 'A network printer is connected to a switch port that requires 802.1X. The printer has no 802.1X supplicant. Which method lets ISE authorize it?',
    options: ['MAC Authentication Bypass', 'PEAP with MSCHAPv2', 'EAP-TLS with a machine certificate', 'Local web authentication'],
    answer: [0],
    explanation: "MAB sends the device's MAC address to ISE as the identity when no EAPOL response arrives; combined with profiling it suits printers, phones and cameras. PEAP and EAP-TLS are EAP methods and need a supplicant. Web authentication needs a person at a browser, which a printer does not have." },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54E,
    stem: 'A laptop authenticates with 802.1X and is placed in a remediation network because its posture is unknown. Two minutes later the posture module reports it compliant. How does ISE move the laptop to full access without the user reconnecting?',
    options: ['ISE sends a RADIUS Change of Authorization to the switch, which reauthorizes the session', 'The switch polls ISE every two minutes for posture changes', 'The posture module tells the switch directly to change the VLAN', 'ISE waits for the next periodic 802.1X reauthentication, which is the only way to change access'],
    answer: [0],
    explanation: "RADIUS is normally request and response from the switch; Change of Authorization (RFC 5176; the RFC port is UDP 3799, while ISE and IOS XE use UDP 1700 by default) lets ISE push a change for an existing session, such as a reauthentication or a new VLAN or ACL. Switches do not poll ISE for posture. The posture module talks to ISE, not to the switch. Periodic reauthentication would eventually work but is not what ISE uses to apply posture results." },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54E,
    stem: 'A PDF opened on five laptops last Monday was judged clean. On Thursday new intelligence classifies it as malicious. Which Secure Endpoint capability alerts the team and shows every device that has the file and how it arrived?',
    options: ['Retrospective detection with file trajectory', 'Posture assessment with Change of Authorization', 'Encrypted Traffic Analytics', 'URL filtering with reputation scores'],
    answer: [0],
    explanation: "Secure Endpoint keeps monitoring after a file is allowed; when the file's disposition changes, it raises a retrospective detection, can quarantine the file, and file trajectory shows every device that has it and where it came from. Posture and CoA are ISE network access features. ETA analyses encrypted flows. URL filtering acts on web requests, not on files already on disk." },
  { topic: '5.4', type: 'single', difficulty: 1, lesson: L54N,
    stem: 'A firewall policy permits TCP 443 from inside to any destination. Which capability of a next-generation firewall lets the administrator allow Webex but block a remote-access tool that also uses TCP 443?',
    options: ['Application visibility and control', 'Stateful inspection of TCP sessions', 'Network address translation', 'Static routing between security zones'],
    answer: [0],
    explanation: "Application visibility and control identifies the application from the traffic itself, regardless of port, so rules can permit or block specific applications. Stateful inspection tracks sessions by addresses and ports, which cannot tell two TLS applications apart. NAT and routing do not classify applications." },
  { topic: '5.4', type: 'match', difficulty: 2, lesson: L54N,
    stem: 'Match each deployment requirement to the Secure Firewall Threat Defense mode that meets it.',
    pairs: [
      ['Insert a firewall between servers and their gateway without readdressing the servers or changing the gateway', 'Transparent firewall mode'],
      ['The firewall must route between inside, outside and DMZ subnets and perform NAT and VPN', 'Routed firewall mode'],
      ['Inspect a copy of traffic from a SPAN session and alert, with no risk of affecting production traffic', 'Passive interface mode'],
      ['Add intrusion prevention in front of an existing firewall so that exploits are dropped, with no Layer 2 or Layer 3 role', 'Inline set'],
    ],
    explanation: "Transparent mode bridges like a bump in the wire, so the subnet and gateway stay as they are. Routed mode makes each interface a Layer 3 hop and supports NAT, VPN and dynamic routing. Passive mode receives a copy of traffic and can only alert. An inline set passes traffic between an interface pair while inspecting it and can drop." },
  { topic: '5.4', type: 'multi', difficulty: 2, lesson: L54M,
    stem: 'Which two statements about Cisco TrustSec are true? (Choose two.)',
    options: ['SGACLs are typically enforced at egress, on the device closest to the destination', 'SXP sends IP-to-SGT bindings over TCP to devices that cannot receive inline tags', 'A Security Group Tag is a 32-bit value carried in the 802.1Q header', 'Enforcement always happens on the access switch where the source was classified', 'Static classification is only possible after 802.1X authentication'],
    answer: [0, 1],
    explanation: "Egress enforcement works because the device near the destination knows both the source SGT (from the tag or an SXP binding) and the destination SGT. SXP (TCP) carries IP-to-SGT bindings from a speaker to a listener when the path cannot tag inline. An SGT is 16 bits and is carried inline in the Cisco Meta Data header, not in 802.1Q. Enforcement is normally at egress, not at the classifying switch. Static classification (IP, subnet, VLAN or port to SGT) needs no authentication; dynamic classification comes from ISE after 802.1X, MAB or WebAuth." },
  { topic: '5.4', type: 'fill', difficulty: 2, lesson: L54M,
    stem: 'Refer to the exhibit. SW1 is the egress enforcement switch. Which SGACL does it apply to traffic from 10.20.1.16 to 10.50.0.40?',
    exhibit: `SW1# show cts role-based sgt-map all
Active IPv4-SGT Bindings Information

IP Address              SGT     Source
============================================
10.20.1.15              4       LOCAL
10.20.1.16              5       LOCAL
10.50.0.0/24            10      CLI
10.60.0.20              8       SXP

TrustSec policy matrix (from ISE)
Source SGT \\ Destination SGT    10 (PCI_Servers)    8 (Cameras)
4 (Employees)                   PERMIT-WEB          DENY-ALL
5 (Contractors)                 DENY-ALL            DENY-ALL`,
    answer: ['DENY-ALL'],
    explanation: "10.20.1.16 is bound to SGT 5 (Contractors). 10.50.0.40 falls inside the static mapping 10.50.0.0/24, SGT 10 (PCI_Servers). The matrix cell for source 5 and destination 10 is DENY-ALL. Traffic from 10.20.1.15 (SGT 4, Employees) to the same server would get PERMIT-WEB instead." },
  { topic: '5.4', type: 'fill', difficulty: 3, lesson: L54M,
    stem: 'Refer to the exhibit. Without MACsec this frame would be 1014 bytes long, including the MAC headers and FCS. How long is it on the MACsec-protected link, in bytes? (Digits only.)',
    exhibit: `Ethernet II, Dst: 00:00:5e:00:53:02, Src: 00:00:5e:00:53:01
802.1AE Security tag
    EtherType: 0x88e5
    TCI/AN: 0x2c (V=0, ES=0, SC=1, SCB=0, E=1, C=1, AN=0)
    Short length: 0
    Packet number: 1849
    System Identifier: 00:00:5e:00:53:01
    Port Identifier: 1
    [Encrypted data]
    ICV: 16 bytes`,
    answer: ['1046'],
    explanation: "The SC flag is set, so the SecTAG carries the 8-byte SCI (System Identifier plus Port Identifier) and is 16 bytes long: 2 EtherType + 1 TCI/AN + 1 short length + 4 packet number + 8 SCI. The ICV adds 16 bytes. 1014 + 16 + 16 = 1046 bytes. Without the SCI the SecTAG would be 8 bytes and the frame 1038 bytes." },
  { topic: '5.4', type: 'multi', difficulty: 2, lesson: L54M,
    stem: 'Which two statements about MACsec are true? (Choose two.)',
    options: ['Each device decrypts frames on receipt and re-encrypts them on the next MACsec link, so protection is hop by hop', 'MKA, the key agreement protocol used for MACsec, is defined in IEEE 802.1X-2010', 'MACsec encrypts the source and destination MAC addresses as well as the payload', 'MACsec protects traffic end to end between two hosts across routers, like IPsec', 'MACsec frames use EtherType 0x8909'],
    answer: [0, 1],
    explanation: "MACsec (IEEE 802.1AE) secures each link separately; switches see clear frames internally, which lets them apply SGTs, QoS and forwarding. Keys are agreed with MKA from IEEE 802.1X-2010 (or Cisco SAP on older TrustSec links). The MAC addresses stay in the clear so the frame can be delivered. End-to-end protection across routers is IPsec's job. MACsec uses EtherType 0x88E5; 0x8909 is the Cisco Meta Data header used for inline SGT tagging." },
];

export default bank.map((item, i) => ({ id: `d5-${String(i + 1).padStart(3, '0')}`, ...item }));
