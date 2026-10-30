export default {
  id: 'lacp-etherchannel',
  title: 'LACP EtherChannel: Fix a Mode Mismatch',
  topic: '2.1',
  difficulty: 2,
  minutes: 12,
  examEligible: true,
  troubleshooting: true,
  summary: 'Two uplinks should form an LACP Port-channel trunk, but both ends are passive and one member is suspended.',
  scenario: `SW1 and SW2 are joined by **Gi1/0/23** and **Gi1/0/24**, which should form **Port-channel1** using **LACP** and carry all VLANs as a trunk.

\`show etherchannel summary\` shows the channel is not bundling. Spanning tree is blocking one of the two links, so you have half the bandwidth you expect. Find out why, and fix it so both links are bundled (**P**) on both switches.

Rules: keep LACP, don't remove either member, and don't change SW2's channel mode.`,
  topology: {
    devices: [
      { name: 'SW1', type: 'switch', x: 1, y: 0 },
      { name: 'SW2', type: 'switch', x: 3, y: 0 },
      { name: 'PC1', type: 'pc', x: 1, y: 1.3, ip: '10.0.10.11/24' },
      { name: 'PC2', type: 'pc', x: 3, y: 1.3, ip: '10.0.10.12/24' },
    ],
    links: [
      ['SW1', 'Gi1/0/23', 'SW2', 'Gi1/0/23'],
      ['SW1', 'Gi1/0/24', 'SW2', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW2', 'Gi1/0/1', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    SW1: `hostname SW1
no ip domain lookup
vlan 10
 name USERS
interface Port-channel1
 switchport mode trunk
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/23
 switchport mode trunk
 channel-group 1 mode passive
interface GigabitEthernet1/0/24
 switchport mode trunk
 channel-group 1 mode passive`,
    SW2: `hostname SW2
no ip domain lookup
vlan 10
 name USERS
interface Port-channel1
 switchport mode trunk
interface GigabitEthernet1/0/1
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/23
 switchport mode trunk
 channel-group 1 mode passive
interface GigabitEthernet1/0/24
 switchport trunk allowed vlan 10
 switchport mode trunk
 channel-group 1 mode passive`,
  },
  tasks: [
    { text: 'At least one side actively negotiates LACP (`mode active`).', check: (net) => ['SW1', 'SW2'].some((d) => net.iface(d, 'Gi1/0/23').channel?.mode === 'active') },
    {
      text: 'Port-channel1 is up (SU) on both switches with Gi1/0/23 and Gi1/0/24 bundled (P).',
      check: (net) => ['SW1', 'SW2'].every((d) => { const c = net.channel(d, 1); return c && c.up && c.proto === 'LACP' && c.members['GigabitEthernet1/0/23'] === 'P' && c.members['GigabitEthernet1/0/24'] === 'P'; }),
    },
    { text: 'Po1 is trunking on both switches.', check: (net) => net.trunkOper('SW1', 'Port-channel1') === 'trunk' && net.trunkOper('SW2', 'Port-channel1') === 'trunk' },
    { text: 'PC1 can ping PC2.', check: (net) => net.canPing('PC1', '10.0.10.12') },
  ],
  hints: [
    'LACP passive + passive never forms a bundle: neither side starts the negotiation. Look for (I) flags in `show etherchannel summary`.',
    'After fixing the mode, an (s) flag means a member is suspended because its configuration differs from Port-channel1. Compare `show running-config interface` for each member.',
    'Members must match the port-channel in mode, allowed VLANs, native VLAN, speed and duplex.',
  ],
  solution: {
    SW1: `configure terminal
interface range GigabitEthernet1/0/23 - 24
channel-group 1 mode active
end`,
    SW2: `configure terminal
interface GigabitEthernet1/0/24
no switchport trunk allowed vlan
end`,
  },
};
