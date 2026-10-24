export default {
  id: 'troubleshoot-l2l3',
  title: 'Troubleshooting Challenge: Four Faults, One Network',
  topic: '2.4',
  difficulty: 3,
  minutes: 25,
  examEligible: false,
  troubleshooting: true,
  summary: 'A campus with router-on-a-stick, two switches and a server LAN has four independent faults. Use show commands, ping and traceroute to find them.',
  scenario: `Nothing in this network works end to end. The intended design:

| VLAN | Subnet | Gateway (R1) | Hosts |
|---|---|---|---|
| 10 STAFF | 10.20.10.0/24 | Gi0/0/0.10 = 10.20.10.1 | PC1 (SW2), PC3 (SW2) |
| 20 GUEST | 10.20.20.0/24 | Gi0/0/0.20 = 10.20.20.1 | PC2 (SW2) |
| Server LAN | 10.20.99.0/24 | Gi0/0/1 = 10.20.99.1 | SRV1 10.20.99.10 |

R1 Gi0/0/0 trunks to **SW1 Gi1/0/24**, and SW1 trunks to **SW2 on Gi1/0/1**. Every PC must be able to reach SRV1.

There are **four faults**, spread across R1, SW1, SW2 and one PC. A good approach:
1. \`ping\` and \`tracert\` from each PC to its gateway and then to SRV1.
2. \`show ip interface brief\`, \`show interfaces trunk\` and \`show vlan brief\` along the path.
3. \`show running-config\` only once you know where to look.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1.5, y: 0 },
      { name: 'SRV1', type: 'server', x: 3, y: 0, ip: '10.20.99.10/24', gateway: '10.20.99.1' },
      { name: 'SW1', type: 'switch', x: 1.5, y: 1 },
      { name: 'SW2', type: 'switch', x: 1.5, y: 2 },
      { name: 'PC1', type: 'pc', x: 0.6, y: 3, ip: '10.20.10.11/24', gateway: '10.20.10.1' },
      { name: 'PC2', type: 'pc', x: 1.5, y: 3, ip: '10.20.20.11/24', gateway: '10.20.20.1' },
      { name: 'PC3', type: 'pc', x: 2.4, y: 3, ip: '10.20.10.12/24', gateway: '10.20.10.254' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['R1', 'Gi0/0/1', 'SRV1', 'eth0'],
      ['SW1', 'Gi1/0/1', 'SW2', 'Gi1/0/24'],
      ['SW2', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW2', 'Gi1/0/2', 'PC2', 'eth0'],
      ['SW2', 'Gi1/0/3', 'PC3', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 no shutdown
interface GigabitEthernet0/0/0.10
 encapsulation dot1Q 10
 ip address 10.20.10.1 255.255.255.0
interface GigabitEthernet0/0/0.20
 encapsulation dot1Q 21
 ip address 10.20.20.1 255.255.255.0
interface GigabitEthernet0/0/1
 ip address 10.20.99.1 255.255.255.0
 no shutdown`,
    SW1: `hostname SW1
no ip domain lookup
vlan 10
 name STAFF
vlan 20
 name GUEST
interface GigabitEthernet1/0/1
 switchport trunk allowed vlan 20
 switchport mode trunk
interface GigabitEthernet1/0/24
 switchport mode trunk`,
    SW2: `hostname SW2
no ip domain lookup
vlan 10
 name STAFF
vlan 20
 name GUEST
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/2
 switchport access vlan 20
 switchport mode access
interface GigabitEthernet1/0/3
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/24
 switchport mode trunk
 shutdown`,
  },
  tasks: [
    { text: 'PC1 can reach SRV1 (10.20.99.10).', check: (net) => net.canPing('PC1', '10.20.99.10') },
    { text: 'PC2 can reach SRV1.', check: (net) => net.canPing('PC2', '10.20.99.10') },
    { text: 'PC3 can reach SRV1.', check: (net) => net.canPing('PC3', '10.20.99.10') },
    {
      text: 'No workaround shortcuts: the SW1–SW2 link is still an 802.1Q trunk, and R1 still uses subinterfaces .10 and .20.',
      check: (net) => net.trunkOper('SW1', 'Gi1/0/1') === 'trunk' && net.trunkOper('SW2', 'Gi1/0/24') === 'trunk'
        && net.iface('R1', 'Gi0/0/0.10')?.encap?.vlan === 10 && net.iface('R1', 'Gi0/0/0.20')?.encap?.vlan === 20,
    },
  ],
  hints: [
    'Start at Layer 1: `show interfaces status` on SW2. One uplink is administratively disabled.',
    'Once the uplink is up, compare `show interfaces trunk` on SW1 and SW2. Which VLANs actually cross the SW1–SW2 trunk?',
    'GUEST users still fail after that. Check `show running-config interface Gi0/0/0.20` on R1 and compare its 802.1Q tag with the VLAN ID.',
    'One PC works only after the others. `ipconfig` on PC3 shows its default gateway.',
  ],
  solution: {
    SW2: `configure terminal
interface GigabitEthernet1/0/24
no shutdown
end`,
    SW1: `configure terminal
interface GigabitEthernet1/0/1
switchport trunk allowed vlan 10,20
end`,
    R1: `configure terminal
interface GigabitEthernet0/0/0.20
encapsulation dot1Q 20
ip address 10.20.20.1 255.255.255.0
end`,
    PC3: 'netsh interface ip set address "Ethernet0" static 10.20.10.12 255.255.255.0 10.20.10.1',
  },
};
