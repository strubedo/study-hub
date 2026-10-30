export default {
  id: 'edge-ports',
  title: 'Edge Ports: Data + Voice VLAN, PortFast and BPDU Guard',
  topic: '2.2',
  difficulty: 1,
  minutes: 12,
  examEligible: true,
  summary: 'Configure desk ports for a PC plus IP phone, protect them with PortFast and BPDU guard, and trunk the uplink to the router.',
  scenario: `Desks on SW1 have an IP phone with a PC connected behind it. The user ports are **Gi1/0/1 – Gi1/0/8**.

| VLAN | Name | Use |
|---|---|---|
| 10 | DATA | PCs (DHCP from R1, 10.10.10.0/24) |
| 150 | VOICE | IP phones (tagged by the phone) |

R1 already has subinterfaces and a DHCP pool for VLAN 10. Configure SW1 so the PCs get addresses. Use \`interface range\`, which works exactly like it does on a real Catalyst.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1.5, y: 0 },
      { name: 'SW1', type: 'switch', x: 1.5, y: 1 },
      { name: 'PC1', type: 'pc', x: 0.8, y: 2, dhcp: true },
      { name: 'PC2', type: 'pc', x: 2.2, y: 2, dhcp: true },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/5', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
ip dhcp excluded-address 10.10.10.1 10.10.10.9
ip dhcp pool DATA
 network 10.10.10.0 255.255.255.0
 default-router 10.10.10.1
interface GigabitEthernet0/0/0
 no shutdown
interface GigabitEthernet0/0/0.10
 encapsulation dot1Q 10
 ip address 10.10.10.1 255.255.255.0
interface GigabitEthernet0/0/0.150
 encapsulation dot1Q 150
 ip address 10.10.150.1 255.255.255.0`,
    SW1: 'hostname SW1\nno ip domain lookup',
  },
  tasks: [
    { text: 'VLAN 10 is named DATA and VLAN 150 is named VOICE.', check: (net) => net.cfgOf('SW1').vlans.get(10)?.name === 'DATA' && net.cfgOf('SW1').vlans.get(150)?.name === 'VOICE' },
    {
      text: 'Gi1/0/1–8 are static access ports in VLAN 10 with voice VLAN 150.',
      check: (net) => [1, 2, 3, 4, 5, 6, 7, 8].every((n) => { const sw = net.iface('SW1', `Gi1/0/${n}`).sw; return sw.mode === 'access' && sw.access === 10 && sw.voice === 150; }),
    },
    { text: 'Gi1/0/1–8 have PortFast and BPDU guard enabled.', check: (net) => [1, 2, 3, 4, 5, 6, 7, 8].every((n) => { const st = net.iface('SW1', `Gi1/0/${n}`).stp; return st.portfast && st.bpduguard; }) },
    { text: 'Gi1/0/24 is a static trunk that allows only VLANs 10 and 150.', check: (net) => { const sw = net.iface('SW1', 'Gi1/0/24').sw; return sw.mode === 'trunk' && sw.allowed && [...sw.allowed].sort((a, b) => a - b).join() === '10,150'; } },
    { text: 'PC1 and PC2 have DHCP leases in 10.10.10.0/24 and can ping 10.10.10.1.', check: (net) => ['PC1', 'PC2'].every((p) => (net.hostIp(p) || '').startsWith('10.10.10.') && net.canPing(p, '10.10.10.1')) },
  ],
  hints: [
    '`interface range GigabitEthernet1/0/1 - 8` applies every command to all 8 ports.',
    'A voice port is still an access port: `switchport mode access`, `switchport access vlan 10`, `switchport voice vlan 150`.',
    'PortFast is accepted on these ports even with a voice VLAN configured. The phone tags voice frames with 802.1Q, but the port still runs in access mode.',
    'If a PC still shows 169.254.x.x after the switch is configured, run `ipconfig /renew`.',
  ],
  solution: {
    SW1: `configure terminal
vlan 10
name DATA
vlan 150
name VOICE
exit
interface range GigabitEthernet1/0/1 - 8
switchport mode access
switchport access vlan 10
switchport voice vlan 150
spanning-tree portfast
spanning-tree bpduguard enable
exit
interface GigabitEthernet1/0/24
switchport mode trunk
switchport trunk allowed vlan 10,150
end`,
    PC1: 'ipconfig /renew',
    PC2: 'ipconfig /renew',
  },
};
