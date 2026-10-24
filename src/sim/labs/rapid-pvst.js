export default {
  id: 'rapid-pvst',
  title: 'Rapid PVST+: Root Bridges, Load Sharing and BPDU Guard',
  topic: '2.5',
  difficulty: 3,
  minutes: 20,
  examEligible: false,
  summary: 'Switch three switches to Rapid PVST+, place the root bridge per VLAN for load sharing, and stop a rogue switch with BPDU guard.',
  scenario: `SW1, SW2 and SW3 form a triangle of trunks carrying VLANs 10 and 20. The switches still run legacy PVST+ with default priorities, so whichever switch has the lowest MAC address became root for every VLAN. That happens to be the access switch SW3.

Target design:

| VLAN | Root primary | Root secondary |
|---|---|---|
| 10 | SW1 | SW2 |
| 20 | SW2 | SW1 |

SW3 is an access switch. Someone has plugged a spare managed **ROGUE** switch (it runs spanning tree, so it sends BPDUs) into **SW3 Gi1/0/10**, a port meant for a desktop. Protect all of SW3's desk ports **Gi1/0/1 – Gi1/0/12** so that any switch connected to them is shut down automatically.`,
  topology: {
    devices: [
      { name: 'SW1', type: 'switch', x: 0.5, y: 0, mac: '701f.5300.3000' },
      { name: 'SW2', type: 'switch', x: 2.5, y: 0, mac: '701f.5300.2000' },
      { name: 'SW3', type: 'switch', x: 1.5, y: 1.2, mac: '701f.5300.1000' },
      { name: 'ROGUE', type: 'switch', x: 2.6, y: 2.2, mac: '701f.5300.9000' },
      { name: 'PC1', type: 'pc', x: 0.8, y: 2.2, ip: '172.20.10.11/24' },
      { name: 'PC2', type: 'pc', x: 0.5, y: 1, ip: '172.20.10.12/24' },
    ],
    links: [
      ['SW1', 'Gi1/0/23', 'SW2', 'Gi1/0/23'],
      ['SW1', 'Gi1/0/24', 'SW3', 'Gi1/0/23'],
      ['SW2', 'Gi1/0/24', 'SW3', 'Gi1/0/24'],
      ['SW3', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW3', 'Gi1/0/10', 'ROGUE', 'Gi1/0/1'],
      ['SW1', 'Gi1/0/1', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    SW1: `hostname SW1
no ip domain lookup
spanning-tree mode pvst
vlan 10
vlan 20
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface range GigabitEthernet1/0/23 - 24
 switchport mode trunk`,
    SW2: `hostname SW2
no ip domain lookup
spanning-tree mode pvst
vlan 10
vlan 20
interface range GigabitEthernet1/0/23 - 24
 switchport mode trunk`,
    SW3: `hostname SW3
no ip domain lookup
spanning-tree mode pvst
vlan 10
vlan 20
interface range GigabitEthernet1/0/1 - 12
 switchport access vlan 10
 switchport mode access
interface range GigabitEthernet1/0/23 - 24
 switchport mode trunk`,
    ROGUE: 'hostname ROGUE',
  },
  tasks: [
    { text: 'SW1, SW2 and SW3 run Rapid PVST+.', check: (net) => ['SW1', 'SW2', 'SW3'].every((d) => net.cfgOf(d).stp.mode === 'rapid-pvst') },
    { text: 'SW1 is the root bridge for VLAN 10 and SW2 is the root bridge for VLAN 20.', check: (net) => net.stpInfo('SW1', 10)?.isRoot && net.stpInfo('SW2', 20)?.isRoot },
    {
      text: 'Backups: SW2 is secondary root for VLAN 10 and SW1 for VLAN 20 (priority 28672).',
      check: (net) => net.cfgOf('SW2').stp.prio.get(10) === 28672 && net.cfgOf('SW1').stp.prio.get(20) === 28672,
    },
    { text: 'SW3 Gi1/0/1–12 have PortFast and BPDU guard enabled.', check: (net) => Array.from({ length: 12 }, (_, i) => i + 1).every((n) => { const st = net.iface('SW3', `Gi1/0/${n}`).stp; return st.portfast && st.bpduguard; }) },
    { text: 'SW3 Gi1/0/10 (ROGUE) is err-disabled by BPDU guard, and PC1 still reaches PC2.', check: (net) => net.errDisabled('SW3', 'Gi1/0/10') && net.canPing('PC1', '172.20.10.12') },
  ],
  hints: [
    '`spanning-tree mode rapid-pvst` is a global command on each switch.',
    '`spanning-tree vlan 10 root primary` is a macro. IOS writes a concrete priority (24576, or lower if needed) into the running-config.',
    'Use `show spanning-tree vlan 10` on SW3 to see which port became its root port after the change.',
    'Configure BPDU guard on the whole desk range with `interface range`. The rogue port err-disables as soon as it receives a BPDU.',
  ],
  solution: {
    SW1: `configure terminal
spanning-tree mode rapid-pvst
spanning-tree vlan 10 root primary
spanning-tree vlan 20 root secondary
end`,
    SW2: `configure terminal
spanning-tree mode rapid-pvst
spanning-tree vlan 20 root primary
spanning-tree vlan 10 root secondary
end`,
    SW3: `configure terminal
spanning-tree mode rapid-pvst
interface range GigabitEthernet1/0/1 - 12
spanning-tree portfast
spanning-tree bpduguard enable
end`,
  },
};
