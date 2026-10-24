export default {
  id: 'vlan-trunk',
  title: 'VLANs and 802.1Q Trunk: Fix the Native VLAN Mismatch',
  topic: '2.1',
  difficulty: 2,
  minutes: 15,
  examEligible: false,
  troubleshooting: true,
  summary: 'Two access switches share VLANs 10 and 20 over a trunk. Fix the native VLAN mismatch, the allowed list, and a missing VLAN.',
  scenario: `SW1 and SW2 carry two user VLANs across an 802.1Q trunk on **Gi1/0/24**:

| VLAN | Name | Subnet |
|---|---|---|
| 10 | STAFF | 192.168.10.0/24 |
| 20 | SALES | 192.168.20.0/24 |
| 99 | NATIVE | trunk native VLAN (no hosts) |

PC1 and PC3 are in VLAN 10, and PC2 and PC4 are in VLAN 20. There is no router, so hosts only talk inside their own VLAN.

The trunk was configured differently on each end. SW1's console shows CDP and spanning-tree errors, and the SALES users on SW2 are cut off. Use \`show interfaces trunk\`, \`show vlan brief\`, \`show spanning-tree vlan 99\` and the syslog messages to fix the trunk so it matches SW1's design.`,
  topology: {
    devices: [
      { name: 'SW1', type: 'switch', x: 1, y: 0 },
      { name: 'SW2', type: 'switch', x: 3, y: 0 },
      { name: 'PC1', type: 'pc', x: 0.5, y: 1.3, ip: '192.168.10.11/24' },
      { name: 'PC2', type: 'pc', x: 1.5, y: 1.3, ip: '192.168.20.11/24' },
      { name: 'PC3', type: 'pc', x: 2.5, y: 1.3, ip: '192.168.10.12/24' },
      { name: 'PC4', type: 'pc', x: 3.5, y: 1.3, ip: '192.168.20.12/24' },
    ],
    links: [
      ['SW1', 'Gi1/0/24', 'SW2', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
      ['SW2', 'Gi1/0/1', 'PC3', 'eth0'],
      ['SW2', 'Gi1/0/2', 'PC4', 'eth0'],
    ],
  },
  initialConfig: {
    SW1: `hostname SW1
no ip domain lookup
vlan 10
 name STAFF
vlan 20
 name SALES
vlan 99
 name NATIVE
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/2
 switchport access vlan 20
 switchport mode access
interface GigabitEthernet1/0/24
 description Trunk to SW2
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport mode trunk
 switchport nonegotiate`,
    SW2: `hostname SW2
no ip domain lookup
vlan 10
 name STAFF
vlan 99
 name NATIVE
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/2
 switchport mode access
interface GigabitEthernet1/0/24
 description Trunk to SW1
 switchport trunk allowed vlan 10,99
 switchport mode trunk`,
  },
  tasks: [
    { text: 'VLAN 20 exists on SW2 with the name SALES, and PC4\'s port (Gi1/0/2) is an access port in VLAN 20.', check: (net) => net.cfgOf('SW2').vlans.get(20)?.name === 'SALES' && net.iface('SW2', 'Gi1/0/2').sw.access === 20 },
    {
      text: 'The trunk uses native VLAN 99 on both ends and allows exactly VLANs 10, 20 and 99.',
      check: (net) => ['SW1', 'SW2'].every((d) => {
        const sw = net.iface(d, 'Gi1/0/24').sw;
        return sw.native === 99 && sw.allowed && [...sw.allowed].sort((a, b) => a - b).join() === '10,20,99' && net.trunkOper(d, 'Gi1/0/24') === 'trunk';
      }),
    },
    { text: 'No port is blocked as PVID-inconsistent in VLAN 99.', check: (net) => { const i = net.stpInfo('SW2', 99); return !!i && Object.values(i.ports).every((p) => !p.inc); } },
    { text: 'PC1 can ping PC3, and PC2 can ping PC4.', check: (net) => net.canPing('PC1', '192.168.10.12') && net.canPing('PC2', '192.168.20.12') },
  ],
  hints: [
    '`show interfaces trunk` on both switches: compare the "Native vlan" and "Vlans allowed on trunk" columns.',
    'The %CDP-4-NATIVE_VLAN_MISMATCH message names both native VLANs. PVST+ also blocks the trunk in those VLANs (BKN* *PVID_Inc).',
    '`switchport trunk allowed vlan add 20` adds to the list without retyping it.',
    'Creating the VLAN (`vlan 20` / `name SALES`) is not enough: PC4\'s port also has to be placed in it.',
  ],
  solution: {
    SW2: `configure terminal
vlan 20
name SALES
exit
interface GigabitEthernet1/0/2
switchport access vlan 20
interface GigabitEthernet1/0/24
switchport trunk native vlan 99
switchport trunk allowed vlan add 20
switchport nonegotiate
end`,
  },
};
