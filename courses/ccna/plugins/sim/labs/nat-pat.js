export default {
  id: 'nat-pat',
  title: 'NAT/PAT on an IOS XE Edge Router',
  topic: '4.3',
  difficulty: 2,
  minutes: 18,
  examEligible: false,
  summary: 'Overload the user LAN onto the WAN interface address (PAT) and publish an internal web server with static NAT.',
  scenario: `R1 is the Internet edge. The ISP assigned the block **203.0.113.0/29**: R1's WAN interface is **.2**, and the ISP router is **.1**.

| Requirement | Detail |
|---|---|
| PAT | Hosts in **192.168.1.0/24** share R1's Gi0/0/1 address. Use standard ACL **1** to define them. |
| Static NAT | Web server **SRV1 192.168.1.100** is reachable from the Internet as **203.0.113.5**. |
| Interfaces | Gi0/0/0 is inside, and Gi0/0/1 is outside. |

The ISP has no route to 192.168.1.0/24, which is why NAT is needed. **INET-PC** (198.51.100.10) sits behind the ISP and stands in for any Internet user.`,
  topology: {
    devices: [
      { name: 'ISP', type: 'router', x: 2.5, y: 0 },
      { name: 'INET-PC', type: 'pc', x: 3.5, y: 0.8, ip: '198.51.100.10/24', gateway: '198.51.100.1' },
      { name: 'R1', type: 'router', x: 1.5, y: 0.6 },
      { name: 'SW1', type: 'switch', x: 1.5, y: 1.6 },
      { name: 'PC1', type: 'pc', x: 0.6, y: 2.5, ip: '192.168.1.10/24', gateway: '192.168.1.1' },
      { name: 'PC2', type: 'pc', x: 1.5, y: 2.5, ip: '192.168.1.11/24', gateway: '192.168.1.1' },
      { name: 'SRV1', type: 'server', x: 2.4, y: 2.5, ip: '192.168.1.100/24', gateway: '192.168.1.1', services: [80, 443] },
    ],
    links: [
      ['R1', 'Gi0/0/1', 'ISP', 'Gi0/0/0'],
      ['ISP', 'Gi0/0/1', 'INET-PC', 'eth0'],
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
      ['SW1', 'Gi1/0/3', 'SRV1', 'eth0'],
    ],
  },
  initialConfig: {
    ISP: `hostname ISP
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 203.0.113.1 255.255.255.248
 no shutdown
interface GigabitEthernet0/0/1
 ip address 198.51.100.1 255.255.255.0
 no shutdown`,
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 description LAN
 ip address 192.168.1.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 description ISP
 ip address 203.0.113.2 255.255.255.248
 no shutdown
ip route 0.0.0.0 0.0.0.0 203.0.113.1`,
    SW1: 'hostname SW1',
  },
  tasks: [
    { text: 'Gi0/0/0 is `ip nat inside` and Gi0/0/1 is `ip nat outside`.', check: (net) => net.iface('R1', 'Gi0/0/0').nat === 'inside' && net.iface('R1', 'Gi0/0/1').nat === 'outside' },
    {
      text: 'Access list 1 permits 192.168.1.0/24, and PAT overloads it onto Gi0/0/1.',
      check: (net) => { const c = net.cfgOf('R1'); const acl = c.acls.get('1'); return !!acl && acl.entries.some((e) => e.action === 'permit' && e.src.addr === 0xc0a80100 && e.src.wild === 0xff) && c.nat.dynamics.some((r) => r.acl === '1' && r.ifName === 'GigabitEthernet0/0/1' && r.overload); },
    },
    { text: 'Static NAT maps 192.168.1.100 to 203.0.113.5.', check: (net) => net.cfgOf('R1').nat.statics.some((s) => s.local === 0xc0a80164 && s.global === 0xcb007105) },
    { text: 'PC1 and PC2 can ping INET-PC (198.51.100.10).', check: (net) => net.canPing('PC1', '198.51.100.10') && net.canPing('PC2', '198.51.100.10') },
    { text: 'INET-PC can open http://203.0.113.5 (TCP 80 to SRV1 through static NAT).', check: (net) => net.tcpOpen('INET-PC', '203.0.113.5', 80) },
  ],
  hints: [
    'Order does not matter, but you need all three parts: inside/outside interfaces, an ACL, and the `ip nat inside source` rule.',
    'PAT: `ip nat inside source list 1 interface GigabitEthernet0/0/1 overload`.',
    'Static NAT: `ip nat inside source static 192.168.1.100 203.0.113.5`. R1 answers ARP for 203.0.113.5 on the outside interface.',
    'Verify with `show ip nat translations` after pinging from a PC. Try `curl http://203.0.113.5` on INET-PC.',
  ],
  solution: {
    R1: `configure terminal
access-list 1 permit 192.168.1.0 0.0.0.255
interface GigabitEthernet0/0/0
ip nat inside
interface GigabitEthernet0/0/1
ip nat outside
exit
ip nat inside source list 1 interface GigabitEthernet0/0/1 overload
ip nat inside source static 192.168.1.100 203.0.113.5
end`,
  },
};
