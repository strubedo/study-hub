export default {
  id: 'router-on-a-stick',
  title: 'Inter-VLAN Routing: Router-on-a-Stick',
  topic: '2.1',
  difficulty: 2,
  minutes: 12,
  examEligible: true,
  summary: 'Route between two VLANs with 802.1Q subinterfaces on one router port and a trunk on the switch.',
  scenario: `SW1 already has the user VLANs and access ports:

| VLAN | Name | Subnet | Gateway (R1 subinterface) |
|---|---|---|---|
| 10 | USERS | 10.10.10.0/24 | 10.10.10.1 on Gi0/0/0.10 |
| 20 | VOICE-SRV | 10.10.20.0/24 | 10.10.20.1 on Gi0/0/0.20 |

Make **SW1 Gi1/0/24** a static 802.1Q trunk that carries only VLANs 10 and 20, then build the subinterfaces on **R1 Gi0/0/0** so PC1 (VLAN 10) and PC2 (VLAN 20) can reach each other.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1, y: 0 },
      { name: 'SW1', type: 'switch', x: 1, y: 1 },
      { name: 'PC1', type: 'pc', x: 0.4, y: 2, ip: '10.10.10.10/24', gateway: '10.10.10.1' },
      { name: 'PC2', type: 'pc', x: 1.6, y: 2, ip: '10.10.20.10/24', gateway: '10.10.20.1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    R1: 'hostname R1\nno ip domain lookup',
    SW1: `hostname SW1
no ip domain lookup
vlan 10
 name USERS
vlan 20
 name VOICE-SRV
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
 spanning-tree portfast
interface GigabitEthernet1/0/2
 switchport access vlan 20
 switchport mode access
 spanning-tree portfast`,
  },
  tasks: [
    {
      text: 'SW1 Gi1/0/24 is a static trunk (`switchport mode trunk`) allowing only VLANs 10 and 20.',
      check: (net) => { const sw = net.iface('SW1', 'Gi1/0/24').sw; return sw.mode === 'trunk' && sw.allowed && [...sw.allowed].sort((a, b) => a - b).join() === '10,20'; },
    },
    {
      text: 'R1 Gi0/0/0.10 and Gi0/0/0.20 use 802.1Q tags 10 and 20 with the gateway addresses.',
      check: (net) => {
        const a = net.iface('R1', 'Gi0/0/0.10'); const b = net.iface('R1', 'Gi0/0/0.20');
        return !!a && !!b && a.encap?.vlan === 10 && b.encap?.vlan === 20 && a.ip?.addr === 0x0a0a0a01 && b.ip?.addr === 0x0a0a1401;
      },
    },
    { text: 'R1 Gi0/0/0 is enabled (the parent interface must be no shutdown).', check: (net) => net.ifStatus('R1', 'Gi0/0/0.10')?.[1] === 'up' },
    { text: 'PC1 can ping PC2.', check: (net) => net.canPing('PC1', '10.10.20.10') },
  ],
  hints: [
    'Routers do not negotiate DTP, so the switch side must be `switchport mode trunk`.',
    'Subinterface order matters: `encapsulation dot1Q 10` must be entered before `ip address` on Gi0/0/0.10.',
    'The subinterfaces stay down until the physical interface is `no shutdown`.',
  ],
  solution: {
    SW1: `configure terminal
interface GigabitEthernet1/0/24
switchport mode trunk
switchport trunk allowed vlan 10,20
end`,
    R1: `configure terminal
interface GigabitEthernet0/0/0
no shutdown
interface GigabitEthernet0/0/0.10
encapsulation dot1Q 10
ip address 10.10.10.1 255.255.255.0
interface GigabitEthernet0/0/0.20
encapsulation dot1Q 20
ip address 10.10.20.1 255.255.255.0
end`,
  },
};
