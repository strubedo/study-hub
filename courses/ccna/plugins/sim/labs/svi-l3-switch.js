export default {
  id: 'svi-l3-switch',
  title: 'SVIs and a Routed Uplink on a Layer 3 Switch',
  topic: '2.1',
  difficulty: 2,
  minutes: 20,
  examEligible: false,
  summary: 'Turn DSW1 into the gateway for two VLANs with SVIs, add a routed port toward the WAN router, and route the default traffic upstream.',
  scenario: `DSW1 is a Catalyst 9300 distribution switch, and ASW1 is the access switch where the PCs connect.

| Item | Setting |
|---|---|
| VLAN 10 gateway | SVI Vlan10, 10.1.10.1/24 |
| VLAN 20 gateway | SVI Vlan20, 10.1.20.1/24 |
| DSW1 Gi1/0/1 → R1 | **routed port**, 10.1.0.2/30 |
| R1 Gi0/0/0 | 10.1.0.1/30 (already configured) |
| R1 Loopback0 | 198.51.100.1 (stands in for the Internet) |

The ASW1–DSW1 trunk on Gi1/0/24 and the access ports are already configured. R1 already routes 10.1.0.0/16 back to DSW1. Make DSW1 route between the VLANs, and send everything else to R1.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1.5, y: 0 },
      { name: 'DSW1', type: 'l3switch', x: 1.5, y: 1 },
      { name: 'ASW1', type: 'switch', x: 1.5, y: 2 },
      { name: 'PC1', type: 'pc', x: 0.8, y: 3, ip: '10.1.10.10/24', gateway: '10.1.10.1' },
      { name: 'PC2', type: 'pc', x: 2.2, y: 3, ip: '10.1.20.10/24', gateway: '10.1.20.1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'DSW1', 'Gi1/0/1'],
      ['DSW1', 'Gi1/0/24', 'ASW1', 'Gi1/0/24'],
      ['ASW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['ASW1', 'Gi1/0/2', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface Loopback0
 ip address 198.51.100.1 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.1.0.1 255.255.255.252
 no shutdown
ip route 10.1.0.0 255.255.0.0 10.1.0.2`,
    DSW1: `hostname DSW1
no ip domain lookup
vlan 10
 name USERS
vlan 20
 name SERVERS
interface GigabitEthernet1/0/24
 switchport mode trunk`,
    ASW1: `hostname ASW1
no ip domain lookup
vlan 10
 name USERS
vlan 20
 name SERVERS
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/2
 switchport access vlan 20
 switchport mode access
interface GigabitEthernet1/0/24
 switchport mode trunk`,
  },
  tasks: [
    { text: 'IP routing is enabled on DSW1.', check: (net) => net.cfgOf('DSW1').ipRouting },
    {
      text: 'DSW1 has SVIs Vlan10 (10.1.10.1/24) and Vlan20 (10.1.20.1/24), both up/up.',
      check: (net) => [['Vlan10', 0x0a010a01], ['Vlan20', 0x0a011401]].every(([n, ip]) => net.iface('DSW1', n)?.ip?.addr === ip && net.ifStatus('DSW1', n)?.[1] === 'up'),
    },
    { text: 'DSW1 Gi1/0/1 is a routed port (no switchport) with 10.1.0.2/30.', check: (net) => { const i = net.iface('DSW1', 'Gi1/0/1'); return !i.sw && i.ip?.addr === 0x0a010002 && i.ip.mask === 0xfffffffc; } },
    { text: 'DSW1 has a default route pointing to R1.', check: (net) => { const r = net.routeTo('DSW1', '8.8.8.8'); return !!r && r.len === 0 && r.paths[0].nh === 0x0a010001; } },
    { text: 'PC1 can ping PC2 and 198.51.100.1.', check: (net) => net.canPing('PC1', '10.1.20.10') && net.canPing('PC1', '198.51.100.1') },
  ],
  hints: [
    'Without `ip routing` the switch behaves like a host: SVIs answer pings but nothing is routed.',
    'An SVI is up/up only if its VLAN exists and at least one port in that VLAN (access or trunk) is forwarding.',
    '`no switchport` turns a switch port into a routed interface that accepts `ip address`.',
  ],
  solution: {
    DSW1: `configure terminal
ip routing
interface Vlan10
ip address 10.1.10.1 255.255.255.0
no shutdown
interface Vlan20
ip address 10.1.20.1 255.255.255.0
no shutdown
interface GigabitEthernet1/0/1
no switchport
ip address 10.1.0.2 255.255.255.252
exit
ip route 0.0.0.0 0.0.0.0 10.1.0.1
end`,
  },
};
