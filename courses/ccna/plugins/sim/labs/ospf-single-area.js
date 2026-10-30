export default {
  id: 'ospf-single-area',
  title: 'Single-Area OSPFv2: DR/BDR, Passive Interfaces and a Default Route',
  topic: '3.3',
  difficulty: 2,
  minutes: 25,
  examEligible: false,
  summary: 'Bring up OSPF area 0 on three routers sharing a LAN segment, control the DR election, and advertise a default route from the edge.',
  scenario: `R1, R2 and R3 share a transit LAN (**10.0.0.0/24**) through SW1. R1 also has the user LAN, and R3 connects to the ISP.

| Router | Router ID | Transit LAN (Gi0/0/0) | Other |
|---|---|---|---|
| R1 | 1.1.1.1 | 10.0.0.1 | Gi0/0/1 = 192.168.1.1/24 (users) |
| R2 | 2.2.2.2 | 10.0.0.2 | Loopback0 = 172.16.2.2/32 |
| R3 | 3.3.3.3 | 10.0.0.3 | Gi0/0/1 = 203.0.113.2/30 (ISP, static default already configured) |

Requirements:
1. OSPF **process 1, area 0** on all three routers, with the router IDs above set manually.
2. **R1 must be the DR** on the transit LAN (priority 255) and **R3 must never be DR/BDR** (priority 0).
3. No hellos are sent toward the users: make R1 Gi0/0/1 **passive**, but still advertise it.
4. R3 advertises its static default route into OSPF.

Configure the routers **in the order R1, R2, R3**. The DR election is non-preemptive, so a router that comes up first can keep the DR role.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 0.5, y: 0 },
      { name: 'R2', type: 'router', x: 1.5, y: 0 },
      { name: 'R3', type: 'router', x: 2.5, y: 0 },
      { name: 'SW1', type: 'switch', x: 1.5, y: 1 },
      { name: 'ISP', type: 'router', x: 3.5, y: 1 },
      { name: 'PC1', type: 'pc', x: 0.5, y: 1.5, ip: '192.168.1.10/24', gateway: '192.168.1.1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/1'],
      ['R2', 'Gi0/0/0', 'SW1', 'Gi1/0/2'],
      ['R3', 'Gi0/0/0', 'SW1', 'Gi1/0/3'],
      ['R1', 'Gi0/0/1', 'PC1', 'eth0'],
      ['R3', 'Gi0/0/1', 'ISP', 'Gi0/0/0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 10.0.0.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 192.168.1.1 255.255.255.0
 no shutdown`,
    R2: `hostname R2
no ip domain lookup
interface Loopback0
 ip address 172.16.2.2 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.0.0.2 255.255.255.0
 no shutdown`,
    R3: `hostname R3
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 10.0.0.3 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 203.0.113.2 255.255.255.252
 no shutdown
ip route 0.0.0.0 0.0.0.0 203.0.113.1`,
    ISP: `hostname ISP
no ip domain lookup
interface Loopback0
 ip address 8.8.8.8 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 203.0.113.1 255.255.255.252
 no shutdown
ip route 0.0.0.0 0.0.0.0 203.0.113.2`,
    SW1: 'hostname SW1',
  },
  tasks: [
    { text: 'All three routers run OSPF process 1 with router IDs 1.1.1.1, 2.2.2.2 and 3.3.3.3.', check: (net) => [['R1', 0x01010101], ['R2', 0x02020202], ['R3', 0x03030303]].every(([d, rid]) => net.cfgOf(d).ospf.get(1)?.rid === rid) },
    {
      text: 'R1 is FULL with both R2 and R3 on the transit LAN.',
      check: (net) => { const n = net.ospfNbrs('R1'); return n.length === 2 && n.every((x) => x.state === 'FULL'); },
    },
    { text: 'R1 is the DR, R2 is the BDR, and R3 has priority 0.', check: (net) => net.ospfIfState('R1', 'Gi0/0/0') === 'DR' && net.ospfIfState('R2', 'Gi0/0/0') === 'BDR' && net.iface('R3', 'Gi0/0/0').ospf.priority === 0 },
    {
      text: 'R1 Gi0/0/1 is passive, and R2 still has an OSPF route to 192.168.1.0/24.',
      check: (net) => net.cfgOf('R1').ospf.get(1)?.passive.has('GigabitEthernet0/0/1') && net.ribHas('R2', '192.168.1.0/24', 'O'),
    },
    { text: 'R1 learns the default route from R3 as O*E2, and PC1 can ping 8.8.8.8.', check: (net) => { const r = net.routeTo('R1', '8.8.8.8'); return !!r && r.proto === 'E2' && net.canPing('PC1', '8.8.8.8'); } },
  ],
  hints: [
    'Set the router ID before the network statements. Changing it later needs `clear ip ospf process`.',
    '`ip ospf priority 255` goes on R1 Gi0/0/0, and `ip ospf priority 0` on R3 Gi0/0/0.',
    '`network 192.168.1.0 0.0.0.255 area 0` plus `passive-interface GigabitEthernet0/0/1` advertises the LAN without sending hellos.',
    '`default-information originate` on R3 works because R3 already has a static default route.',
    '`show ip ospf neighbor` on R2 should show R1 as FULL/DR and R3 as FULL/DROTHER. On R3, R2 appears as FULL/BDR.',
  ],
  solution: {
    R1: `configure terminal
interface GigabitEthernet0/0/0
ip ospf priority 255
exit
router ospf 1
router-id 1.1.1.1
passive-interface GigabitEthernet0/0/1
network 10.0.0.0 0.0.0.255 area 0
network 192.168.1.0 0.0.0.255 area 0
end`,
    R2: `configure terminal
router ospf 1
router-id 2.2.2.2
network 10.0.0.0 0.0.0.255 area 0
network 172.16.2.2 0.0.0.0 area 0
end`,
    R3: `configure terminal
interface GigabitEthernet0/0/0
ip ospf priority 0
exit
router ospf 1
router-id 3.3.3.3
network 10.0.0.0 0.0.0.255 area 0
default-information originate
end`,
  },
};
