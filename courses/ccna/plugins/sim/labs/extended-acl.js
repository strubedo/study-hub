export default {
  id: 'extended-acl',
  title: 'Extended Named ACL: Per-Host Server Access',
  topic: '4.6',
  difficulty: 3,
  minutes: 20,
  examEligible: false,
  summary: 'Write and place an extended named ACL that gives two users different access to a server while leaving all other traffic alone.',
  scenario: `R1 routes between the user LAN **10.1.10.0/24** (Gi0/0/0) and the server LAN **10.1.20.0/24** (Gi0/0/1). SRV1 (**10.1.20.100**) runs HTTP (80) and HTTPS (443). R1's **Loopback0 (10.1.99.1)** stands in for "everything else".

Security policy:

| Source | Allowed to SRV1 |
|---|---|
| PC1 (10.1.10.10, IT admin) | HTTP, HTTPS, and ping (echo) |
| Any other host in 10.1.10.0/24 (e.g. PC2 10.1.10.20) | HTTP only |
| Everything from 10.1.10.0/24 to the rest of 10.1.20.0/24 | **denied** |
| All other traffic (e.g. users to 10.1.99.1) | **permitted** |

Create an **extended named ACL called USERS-IN** and apply it where Cisco recommends placing extended ACLs: as close to the source as possible.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1.5, y: 0 },
      { name: 'SW1', type: 'switch', x: 0.7, y: 1 },
      { name: 'PC1', type: 'pc', x: 0.2, y: 2, ip: '10.1.10.10/24', gateway: '10.1.10.1' },
      { name: 'PC2', type: 'pc', x: 1.2, y: 2, ip: '10.1.10.20/24', gateway: '10.1.10.1' },
      { name: 'SRV1', type: 'server', x: 2.5, y: 1, ip: '10.1.20.100/24', gateway: '10.1.20.1', services: [80, 443] },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
      ['R1', 'Gi0/0/1', 'SRV1', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface Loopback0
 ip address 10.1.99.1 255.255.255.255
interface GigabitEthernet0/0/0
 description Users
 ip address 10.1.10.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 description Servers
 ip address 10.1.20.1 255.255.255.0
 no shutdown`,
    SW1: 'hostname SW1',
  },
  tasks: [
    { text: 'An extended named ACL USERS-IN exists and is applied inbound on Gi0/0/0.', check: (net) => net.cfgOf('R1').acls.get('USERS-IN')?.type === 'extended' && net.iface('R1', 'Gi0/0/0').aclIn === 'USERS-IN' },
    { text: 'PC1 can reach SRV1 on TCP 80 and 443, and can ping it.', check: (net) => net.tcpOpen('PC1', '10.1.20.100', 80) && net.tcpOpen('PC1', '10.1.20.100', 443) && net.canPing('PC1', '10.1.20.100') },
    { text: 'PC2 can reach SRV1 on TCP 80 only: HTTPS and ping are blocked.', check: (net) => net.tcpOpen('PC2', '10.1.20.100', 80) && !net.tcpOpen('PC2', '10.1.20.100', 443) && !net.canPing('PC2', '10.1.20.100', { tries: 2 }) },
    { text: 'Users cannot reach the rest of 10.1.20.0/24 (PC2 cannot ping 10.1.20.1).', check: (net) => !net.canPing('PC2', '10.1.20.1', { tries: 2 }) },
    { text: 'Other traffic still flows: PC2 can ping 10.1.99.1.', check: (net) => net.canPing('PC2', '10.1.99.1') },
  ],
  hints: [
    'Order matters: the PC1 host entries have to come before the broader 10.1.10.0/24 entries.',
    '`permit tcp host 10.1.10.10 host 10.1.20.100 eq 443` and `permit icmp host 10.1.10.10 host 10.1.20.100 echo`.',
    'End with `deny ip 10.1.10.0 0.0.0.255 10.1.20.0 0.0.0.255` and then `permit ip any any`. Otherwise the implicit deny blocks everything else.',
    'Apply it with `ip access-group USERS-IN in` on Gi0/0/0. Watch the counters in `show access-lists` while you test with `curl` and `Test-NetConnection` on the PCs.',
  ],
  solution: {
    R1: `configure terminal
ip access-list extended USERS-IN
permit tcp host 10.1.10.10 host 10.1.20.100 eq www
permit tcp host 10.1.10.10 host 10.1.20.100 eq 443
permit icmp host 10.1.10.10 host 10.1.20.100 echo
permit tcp 10.1.10.0 0.0.0.255 host 10.1.20.100 eq www
deny ip 10.1.10.0 0.0.0.255 10.1.20.0 0.0.0.255
permit ip any any
exit
interface GigabitEthernet0/0/0
ip access-group USERS-IN in
end`,
  },
};
