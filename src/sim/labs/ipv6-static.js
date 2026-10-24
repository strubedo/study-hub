export default {
  id: 'ipv6-static',
  title: 'IPv6 Addressing, EUI-64 and Static Routes',
  topic: '1.4',
  difficulty: 2,
  minutes: 15,
  examEligible: false,
  summary: 'Enable IPv6 routing, address interfaces with static, EUI-64 and link-local addresses, then route between two LANs.',
  scenario: `Two sites are being migrated to IPv6. The PCs already have their IPv6 settings, and you configure the routers.

| Device / interface | IPv6 configuration |
|---|---|
| R1 Gi0/0/0 (LAN A) | 2001:db8:acad:1::/64 **EUI-64**, link-local **FE80::1** |
| R1 Gi0/0/1 (to R2) | 2001:db8:acad:12::1/64 |
| R2 Gi0/0/1 (to R1) | 2001:db8:acad:12::2/64 |
| R2 Gi0/0/0 (LAN B) | 2001:db8:acad:2::1/64 |
| PC1 | 2001:db8:acad:1::10/64, gateway FE80::1 |
| PC2 | 2001:db8:acad:2::10/64, gateway 2001:db8:acad:2::1 |

R1 reaches LAN B with a **network route**, and R2 reaches everything else with a **default route** toward R1.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1, y: 0 },
      { name: 'R2', type: 'router', x: 3, y: 0 },
      { name: 'SW1', type: 'switch', x: 1, y: 1 },
      { name: 'PC1', type: 'pc', x: 1, y: 2, ipv6: '2001:db8:acad:1::10/64', gateway6: 'fe80::1' },
      { name: 'PC2', type: 'pc', x: 3, y: 1.5, ipv6: '2001:db8:acad:2::10/64', gateway6: '2001:db8:acad:2::1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['R1', 'Gi0/0/1', 'R2', 'Gi0/0/1'],
      ['R2', 'Gi0/0/0', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 description LAN A
 no shutdown
interface GigabitEthernet0/0/1
 description Link to R2
 no shutdown`,
    R2: `hostname R2
no ip domain lookup
interface GigabitEthernet0/0/0
 description LAN B
 no shutdown
interface GigabitEthernet0/0/1
 description Link to R1
 no shutdown`,
    SW1: 'hostname SW1',
  },
  tasks: [
    { text: 'IPv6 unicast routing is enabled on R1 and R2.', check: (net) => net.cfgOf('R1').ipv6Routing && net.cfgOf('R2').ipv6Routing },
    {
      text: 'R1 Gi0/0/0 uses 2001:db8:acad:1::/64 with an EUI-64 interface ID and link-local FE80::1.',
      check: (net) => {
        const i = net.iface('R1', 'Gi0/0/0');
        return i.ipv6.some((a) => a.eui && a.len === 64 && a.addr.slice(0, 4).join() === [0x2001, 0xdb8, 0xacad, 1].join())
          && /^FE80::1$/i.test(i.ipv6LinkLocal || '');
      },
    },
    {
      text: 'The R1–R2 link and LAN B are addressed as specified (::1, ::2, and 2001:db8:acad:2::1).',
      check: (net) => {
        const has = (dev, ifn, g) => net.iface(dev, ifn).ipv6.some((a) => !a.eui && a.len === 64 && a.addr.join() === g.join());
        return has('R1', 'Gi0/0/1', [0x2001, 0xdb8, 0xacad, 0x12, 0, 0, 0, 1]) && has('R2', 'Gi0/0/1', [0x2001, 0xdb8, 0xacad, 0x12, 0, 0, 0, 2])
          && has('R2', 'Gi0/0/0', [0x2001, 0xdb8, 0xacad, 2, 0, 0, 0, 1]);
      },
    },
    { text: 'R1 has a static route for 2001:db8:acad:2::/64 and R2 has a static default route (::/0).', check: (net) => net.cfgOf('R1').staticRoutes6.some((r) => r.len === 64) && net.cfgOf('R2').staticRoutes6.some((r) => r.len === 0) },
    { text: 'PC1 can ping PC2 (2001:db8:acad:2::10).', check: (net) => net.canPing6('PC1', '2001:db8:acad:2::10') },
  ],
  hints: [
    'Without `ipv6 unicast-routing` a router does not forward IPv6 packets or send router advertisements.',
    'EUI-64: `ipv6 address 2001:db8:acad:1::/64 eui-64`. Check the generated address with `show ipv6 interface brief`.',
    'Link-local: `ipv6 address fe80::1 link-local`. Hosts often use the router\'s link-local address as their gateway.',
    'Routes: `ipv6 route 2001:db8:acad:2::/64 2001:db8:acad:12::2` on R1 and `ipv6 route ::/0 2001:db8:acad:12::1` on R2.',
  ],
  solution: {
    R1: `configure terminal
ipv6 unicast-routing
interface GigabitEthernet0/0/0
ipv6 address 2001:db8:acad:1::/64 eui-64
ipv6 address fe80::1 link-local
interface GigabitEthernet0/0/1
ipv6 address 2001:db8:acad:12::1/64
exit
ipv6 route 2001:db8:acad:2::/64 2001:db8:acad:12::2
end`,
    R2: `configure terminal
ipv6 unicast-routing
interface GigabitEthernet0/0/0
ipv6 address 2001:db8:acad:2::1/64
interface GigabitEthernet0/0/1
ipv6 address 2001:db8:acad:12::2/64
exit
ipv6 route ::/0 2001:db8:acad:12::1
end`,
  },
};
