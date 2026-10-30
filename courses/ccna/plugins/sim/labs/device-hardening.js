export default {
  id: 'device-hardening',
  title: 'Device Hardening: Local Users, SSH-Only VTY, Console',
  topic: '4.1',
  difficulty: 2,
  minutes: 15,
  examEligible: false,
  summary: 'Lock down management access on R1: enable secret, local admin user, SSH version 2 only, console password, a login banner, and a management ACL.',
  scenario: `R1 still has its factory-fresh management plane: anyone can telnet in, and there is no enable secret. Harden it to the company baseline:

| Item | Setting |
|---|---|
| Hostname / domain | R1 / **corp.local** |
| Enable secret | **Cisco123!** |
| Local user | **netadmin**, privilege 15, secret **Adm1nPass** |
| SSH | RSA 2048-bit key, **version 2**, vty lines accept **SSH only** and authenticate against **local users** |
| VTY source restriction | only the management subnet **10.99.0.0/24** (standard ACL **MGMT** applied with \`access-class\`) |
| Console | password **C0nsole!**, \`login\`, exec-timeout **5 minutes** |
| Passwords | no clear-text passwords in the configuration |
| Banner | an MOTD banner that contains the word **Authorized** |

When you're done, test from **ADMIN-PC** (10.99.0.10) with \`ssh netadmin@10.0.0.1\`. **USER-PC** (10.20.0.10) must not get a session at all.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1.5, y: 0 },
      { name: 'ADMIN-PC', type: 'pc', x: 0.7, y: 1.2, ip: '10.99.0.10/24', gateway: '10.99.0.1' },
      { name: 'USER-PC', type: 'pc', x: 2.3, y: 1.2, ip: '10.20.0.10/24', gateway: '10.20.0.1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'ADMIN-PC', 'eth0'],
      ['R1', 'Gi0/0/1', 'USER-PC', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
interface Loopback0
 ip address 10.0.0.1 255.255.255.255
interface GigabitEthernet0/0/0
 description Management LAN
 ip address 10.99.0.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 description User LAN
 ip address 10.20.0.1 255.255.255.0
 no shutdown
line vty 0 4
 password cisco
 login
 transport input telnet ssh`,
  },
  tasks: [
    { text: 'Enable secret is set, and `service password-encryption` is on.', check: (net) => { const c = net.cfgOf('R1'); return !!c.enableSecret && net.checkSecret(c.enableSecret, 'Cisco123!') && c.passwordEncryption; } },
    { text: 'User netadmin exists with privilege 15 and a secret (not a password).', check: (net) => { const u = net.cfgOf('R1').users.get('netadmin'); return !!u && u.privilege === 15 && !!u.secret && net.checkSecret(u.secret, 'Adm1nPass'); } },
    { text: 'Domain corp.local, an RSA key of at least 2048 bits, and `ip ssh version 2`.', check: (net) => { const c = net.cfgOf('R1'); return c.domainName === 'corp.local' && (c.rsa?.modulus || 0) >= 2048 && c.sshVersion === 2; } },
    { text: 'VTY lines: `login local` and `transport input ssh` only.', check: (net) => { const v = net.cfgOf('R1').lines.vty; return v.loginLocal && v.transport === 'ssh'; } },
    {
      text: 'ACL MGMT allows only 10.99.0.0/24, and it is applied to the vty lines (ADMIN-PC can open TCP/22, USER-PC cannot, and telnet is refused).',
      check: (net) => net.cfgOf('R1').lines.vty.accessClass === 'MGMT' && net.tcpOpen('ADMIN-PC', '10.0.0.1', 22) && !net.tcpOpen('USER-PC', '10.0.0.1', 22) && !net.tcpOpen('ADMIN-PC', '10.0.0.1', 23),
    },
    { text: 'Console: password set, `login`, exec-timeout 5 0.', check: (net) => { const c = net.cfgOf('R1').lines.con; return !!c.password && c.login && c.execTimeout?.[0] === 5 && c.execTimeout[1] === 0; } },
    { text: 'An MOTD banner containing "Authorized" is configured.', check: (net) => /authorized/i.test(net.cfgOf('R1').banner || '') },
  ],
  hints: [
    'RSA keys need a hostname other than Router and an `ip domain name` first. Then run `crypto key generate rsa modulus 2048`.',
    '`username netadmin privilege 15 secret Adm1nPass` stores a type 9 hash, which is safer than `password`.',
    'Named standard ACL: `ip access-list standard MGMT` / `permit 10.99.0.0 0.0.0.255`. Apply it under `line vty 0 4` with `access-class MGMT in`.',
    'Banner: `banner motd #Authorized access only#`. The first character is the delimiter.',
    'Test with `ssh netadmin@10.0.0.1` on ADMIN-PC. Typing `enable` should not be needed because the user has privilege 15.',
  ],
  solution: {
    R1: `configure terminal
service password-encryption
enable secret Cisco123!
username netadmin privilege 15 secret Adm1nPass
ip domain name corp.local
crypto key generate rsa modulus 2048
ip ssh version 2
ip access-list standard MGMT
permit 10.99.0.0 0.0.0.255
exit
line vty 0 4
login local
transport input ssh
access-class MGMT in
exit
line console 0
password C0nsole!
login
exec-timeout 5 0
exit
banner motd #Authorized access only. Disconnect now if you are not authorized.#
end`,
  },
};
