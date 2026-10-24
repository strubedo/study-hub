export default {
  id: 'static-floating',
  title: 'Static Routing with a Floating Static Backup',
  topic: '3.2',
  difficulty: 2,
  minutes: 12,
  examEligible: true,
  summary: 'Give a dual-homed branch a primary default route, a floating static backup with a higher AD, and a host route.',
  scenario: `Branch router **R1** connects to two providers:

| Link | R1 address | Next hop |
|---|---|---|
| Gi0/0/0 → ISP-A (R2), **primary** | 10.0.12.1/30 | 10.0.12.2 |
| Gi0/0/1 → ISP-B (R3), **backup** | 10.0.13.1/30 | 10.0.13.2 |

Configure R1 so that:
- all Internet traffic uses **ISP-A** while that link is up;
- traffic fails over to **ISP-B** automatically through a *floating* static default route with **AD 10**;
- the management host **203.0.113.50** is always reached through **ISP-B** (a /32 host route), even while ISP-A is up.

The Internet test host **198.51.100.1** sits behind both providers (R4).`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 0, y: 1 },
      { name: 'R2', type: 'router', x: 1.5, y: 0.2 },
      { name: 'R3', type: 'router', x: 1.5, y: 1.8 },
      { name: 'R4', type: 'router', x: 3, y: 1 },
      { name: 'PC1', type: 'pc', x: 0, y: 2.3, ip: '192.168.1.10/24', gateway: '192.168.1.1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'R2', 'Gi0/0/0'],
      ['R1', 'Gi0/0/1', 'R3', 'Gi0/0/0'],
      ['R2', 'Gi0/0/1', 'R4', 'Gi0/0/0'],
      ['R3', 'Gi0/0/1', 'R4', 'Gi0/0/1'],
      ['R1', 'Gi0/0/2', 'PC1', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 description ISP-A (primary)
 ip address 10.0.12.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/1
 description ISP-B (backup)
 ip address 10.0.13.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/2
 description LAN
 ip address 192.168.1.1 255.255.255.0
 no shutdown`,
    R2: `hostname R2
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 10.0.12.2 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.24.2 255.255.255.252
 no shutdown
ip route 192.168.1.0 255.255.255.0 10.0.12.1
ip route 0.0.0.0 0.0.0.0 10.0.24.1`,
    R3: `hostname R3
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 10.0.13.2 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.34.2 255.255.255.252
 no shutdown
ip route 192.168.1.0 255.255.255.0 10.0.13.1
ip route 0.0.0.0 0.0.0.0 10.0.34.1`,
    R4: `hostname R4
no ip domain lookup
interface Loopback0
 ip address 198.51.100.1 255.255.255.255
interface Loopback1
 ip address 203.0.113.50 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.0.24.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.34.1 255.255.255.252
 no shutdown
ip route 192.168.1.0 255.255.255.0 10.0.24.2
ip route 192.168.1.0 255.255.255.0 10.0.34.2 5`,
  },
  tasks: [
    { text: 'R1\'s default route points to ISP-A (10.0.12.2) with the default AD of 1.', check: (net) => { const r = net.routeTo('R1', '8.8.8.8'); return !!r && r.len === 0 && r.proto === 'S' && r.ad === 1 && r.paths.length === 1 && r.paths[0].nh === 0x0a000c02; } },
    { text: 'A floating static default route via 10.0.13.2 with AD 10 is configured (and is not in the routing table while ISP-A is up).', check: (net) => net.cfgOf('R1').staticRoutes.some((s) => s.net === 0 && s.mask === 0 && s.nh === 0x0a000d02 && s.ad === 10) },
    { text: 'A host route sends 203.0.113.50/32 via ISP-B.', check: (net) => { const r = net.routeTo('R1', '203.0.113.50'); return !!r && r.len === 32 && r.paths[0].nh === 0x0a000d02; } },
    { text: 'PC1 can ping 198.51.100.1.', check: (net) => net.canPing('PC1', '198.51.100.1') },
    {
      text: 'Failover works: with Gi0/0/0 shut, R1 installs the backup default route (AD 10) and PC1 can reach ISP-B\'s upstream interface 10.0.34.2.',
      check: (net) => net.simulate((n) => { const i = n.iface('R1', 'Gi0/0/0'); const was = i.shutdown; i.shutdown = true; return () => { i.shutdown = was; }; },
        (n) => { const r = n.routeTo('R1', '8.8.8.8'); return !!r && r.len === 0 && r.ad === 10 && n.canPing('PC1', '10.0.34.2'); }),
    },
  ],
  hints: [
    'Default route: `ip route 0.0.0.0 0.0.0.0 10.0.12.2`.',
    'A floating static is the same route with a higher administrative distance at the end: `ip route 0.0.0.0 0.0.0.0 10.0.13.2 10`.',
    'Longest match wins regardless of AD: a /32 host route beats the /0 default.',
    'Test it yourself: shut Gi0/0/0, then run `show ip route` and look for `S*  0.0.0.0/0 [10/0]`.',
    'Real-world caveat: a floating static only reacts when the local interface goes down. It cannot detect a failure further upstream; that needs IP SLA tracking or a routing protocol. The upstream routers here are static too, so test the backup path against ISP-B\'s own router.',
  ],
  solution: {
    R1: `configure terminal
ip route 0.0.0.0 0.0.0.0 10.0.12.2
ip route 0.0.0.0 0.0.0.0 10.0.13.2 10
ip route 203.0.113.50 255.255.255.255 10.0.13.2
end`,
  },
};
