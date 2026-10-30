export default {
  id: 'ospf-troubleshoot',
  title: 'OSPF Troubleshooting: Why Won\'t They Peer?',
  topic: '3.3',
  difficulty: 3,
  minutes: 20,
  examEligible: false,
  troubleshooting: true,
  summary: 'Three routers in a chain should form two OSPF adjacencies. Find the passive interface, the area mismatch, the timer mismatch, and the missing network.',
  scenario: `R1 – R2 – R3 are chained with point-to-point Ethernet links, and every router has a loopback. The design is **OSPF process 1, everything in area 0**, with default timers.

| Link | Subnet |
|---|---|
| R1 Gi0/0/0 – R2 Gi0/0/0 | 10.1.12.0/30 |
| R2 Gi0/0/1 – R3 Gi0/0/1 | 10.1.23.0/30 |
| Loopbacks | 1.1.1.1, 2.2.2.2, 3.3.3.3 (/32) |

Right now R2 has **no** OSPF neighbors. Use \`show ip ospf neighbor\`, \`show ip ospf interface\`, \`show ip protocols\` and \`show running-config | section ospf\` to find each fault. Every router must learn every loopback through OSPF.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 0, y: 0 },
      { name: 'R2', type: 'router', x: 1.5, y: 0 },
      { name: 'R3', type: 'router', x: 3, y: 0 },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'R2', 'Gi0/0/0'],
      ['R2', 'Gi0/0/1', 'R3', 'Gi0/0/1'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.1.12.1 255.255.255.252
 ip ospf network point-to-point
 no shutdown
router ospf 1
 router-id 1.1.1.1
 passive-interface GigabitEthernet0/0/0
 network 1.1.1.1 0.0.0.0 area 0
 network 10.1.12.0 0.0.0.3 area 0`,
    R2: `hostname R2
no ip domain lookup
interface Loopback0
 ip address 2.2.2.2 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.1.12.2 255.255.255.252
 ip ospf network point-to-point
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.1.23.1 255.255.255.252
 ip ospf network point-to-point
 ip ospf hello-interval 5
 no shutdown
router ospf 1
 router-id 2.2.2.2
 network 2.2.2.2 0.0.0.0 area 0
 network 10.1.12.0 0.0.0.3 area 0
 network 10.1.23.0 0.0.0.3 area 0`,
    R3: `hostname R3
no ip domain lookup
interface Loopback0
 ip address 3.3.3.3 255.255.255.255
interface GigabitEthernet0/0/1
 ip address 10.1.23.2 255.255.255.252
 ip ospf network point-to-point
 no shutdown
router ospf 1
 router-id 3.3.3.3
 network 10.1.23.0 0.0.0.3 area 1`,
  },
  tasks: [
    { text: 'R1 and R2 are FULL neighbors.', check: (net) => net.ospfNbrs('R1').some((n) => n.rid === '2.2.2.2' && n.state === 'FULL') },
    { text: 'R2 and R3 are FULL neighbors.', check: (net) => net.ospfNbrs('R3').some((n) => n.rid === '2.2.2.2' && n.state === 'FULL') },
    { text: 'All links and loopbacks are in area 0, and the R2–R3 link uses the default hello/dead timers (10/40).', check: (net) => net.cfgOf('R3').ospf.get(1)?.networks.every((n) => n.area === 0) && !net.iface('R2', 'Gi0/0/1').ospf.hello && !net.iface('R3', 'Gi0/0/1').ospf.hello },
    { text: 'R1 can ping 3.3.3.3 sourced from its loopback (1.1.1.1).', check: (net) => net.ribHas('R1', '3.3.3.3/32', 'O') && net.canPing('R1', '3.3.3.3', { source: '1.1.1.1' }) },
  ],
  hints: [
    '`show ip ospf interface GigabitEthernet0/0/0` on R1 contains the line "No Hellos (Passive interface)".',
    'Neighbors must agree on area ID, hello/dead intervals, subnet and network type. Compare `show ip ospf interface` on both ends of each link.',
    'R3 also never advertises its loopback. Check its network statements.',
    'Use `ping 3.3.3.3 source loopback0` to test end to end.',
  ],
  solution: {
    R1: `configure terminal
router ospf 1
no passive-interface GigabitEthernet0/0/0
end`,
    R2: `configure terminal
interface GigabitEthernet0/0/1
no ip ospf hello-interval
end`,
    R3: `configure terminal
router ospf 1
no network 10.1.23.0 0.0.0.3 area 1
network 10.1.23.0 0.0.0.3 area 0
network 3.3.3.3 0.0.0.0 area 0
end`,
  },
};
