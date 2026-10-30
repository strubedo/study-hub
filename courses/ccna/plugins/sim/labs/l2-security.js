export default {
  id: 'l2-security',
  title: 'Layer 2 Security: Port Security, DHCP Snooping and DAI',
  topic: '4.7',
  difficulty: 3,
  minutes: 25,
  examEligible: false,
  troubleshooting: true,
  summary: 'A rogue DHCP server is handing out a bad gateway. Stop it with DHCP snooping, then add Dynamic ARP Inspection and port security.',
  scenario: `Users on SW1 (VLAN 10, 192.168.10.0/24) report they "have an IP address but no network". The legitimate DHCP server is **R1** (gateway **192.168.10.1**) on the uplink **Gi1/0/24**. Someone has plugged a router acting as a **rogue DHCP server** into **Gi1/0/10**, and PC1 and PC2 took its leases.

Secure SW1:
1. **DHCP snooping** for VLAN 10. Only the uplink is trusted.
2. Renew the PCs' leases (\`ipconfig /release\` then \`ipconfig /renew\`), so they get R1's lease and the snooping binding table fills.
3. **Dynamic ARP Inspection** on VLAN 10, with the uplink trusted.
4. **Port security** on the user ports Gi1/0/1–3: at most **2** MAC addresses, **sticky** learning, violation mode **restrict**.
5. **PRINTER** (static 192.168.10.50) is not in the binding table, so DAI must drop its ARPs. It is moving to a reserved lease next week. For now, confirm that it is blocked.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1.5, y: 0 },
      { name: 'SW1', type: 'switch', x: 1.5, y: 1 },
      { name: 'ROGUE', type: 'router', x: 3, y: 1 },
      { name: 'PC1', type: 'pc', x: 0.5, y: 2, dhcp: true },
      { name: 'PC2', type: 'pc', x: 1.5, y: 2, dhcp: true },
      { name: 'PRINTER', type: 'pc', x: 2.5, y: 2, ip: '192.168.10.50/24', gateway: '192.168.10.1' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['ROGUE', 'Gi0/0/0', 'SW1', 'Gi1/0/10'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
      ['SW1', 'Gi1/0/3', 'PRINTER', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
ip dhcp excluded-address 192.168.10.1 192.168.10.99
ip dhcp pool USERS
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 192.168.10.1
interface GigabitEthernet0/0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown`,
    ROGUE: `hostname ROGUE
no ip domain lookup
ip dhcp excluded-address 192.168.10.1 192.168.10.199
ip dhcp pool EVIL
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.254
interface GigabitEthernet0/0/0
 ip address 192.168.10.254 255.255.255.0
 no shutdown`,
    SW1: `hostname SW1
no ip domain lookup
vlan 10
 name USERS
interface range GigabitEthernet1/0/1 - 10
 switchport access vlan 10
 switchport mode access
interface GigabitEthernet1/0/24
 switchport access vlan 10
 switchport mode access`,
  },
  tasks: [
    { text: 'DHCP snooping is enabled globally and for VLAN 10, and only Gi1/0/24 is trusted.', check: (net) => { const c = net.cfgOf('SW1'); const trusted = [...c.interfaces.entries()].filter(([, i]) => i.snoopTrust).map(([n]) => n); return c.snooping.enabled && c.snooping.vlans.has(10) && trusted.length === 1 && trusted[0] === 'GigabitEthernet1/0/24'; } },
    { text: 'PC1 and PC2 hold leases from R1 (gateway 192.168.10.1), and both appear in the snooping binding table.', check: (net) => ['PC1', 'PC2'].every((p) => net.hostCfg(p).gateway === '192.168.10.1' && net.device('SW1').st.snoopBindings.has(net.device(p).mac)) },
    { text: 'DAI is enabled on VLAN 10 with Gi1/0/24 trusted, and PC1 can ping 192.168.10.1.', check: (net) => net.cfgOf('SW1').dai.has(10) && net.iface('SW1', 'Gi1/0/24').daiTrust && net.canPing('PC1', '192.168.10.1') },
    {
      text: 'Gi1/0/1–3: port security enabled, maximum 2, sticky, violation restrict.',
      check: (net) => [1, 2, 3].every((n) => { const p = net.iface('SW1', `Gi1/0/${n}`).psec; return p && p.enabled && p.max === 2 && p.sticky && p.violation === 'restrict'; }),
    },
    { text: 'PRINTER (static IP, no binding) is blocked by DAI: it cannot ping 192.168.10.1.', check: (net) => net.cfgOf('SW1').dai.has(10) && !net.canPing('PRINTER', '192.168.10.1', { tries: 2 }) },
  ],
  hints: [
    'Snooping needs both `ip dhcp snooping` and `ip dhcp snooping vlan 10`, plus `ip dhcp snooping trust` on the uplink.',
    'Untrusted ports drop server-side DHCP messages (OFFER/ACK). Look for %DHCP_SNOOPING-5-DHCP_SNOOPING_UNTRUSTED_PORT in the log.',
    'DAI checks ARP against the snooping bindings. Until a PC renews its lease through the trusted port, it has no binding and its ARPs are dropped. DHCP itself is not ARP, so renewing still works.',
    'Real-world gotcha: with snooping on, the switch inserts option 82 with giaddr 0.0.0.0, and an IOS DHCP server drops those requests. `no ip dhcp snooping information option` avoids this (or `ip dhcp relay information trusted` on R1 Gi0/0/0). If PCs fall back to 169.254.x.x after you enable snooping, this is why.',
    'R1\'s ARP replies arrive on the uplink, so it needs `ip arp inspection trust` there.',
    'Port security: `switchport port-security maximum 2`, `... violation restrict`, `... mac-address sticky`, then `switchport port-security`.',
  ],
  solution: {
    SW1: `configure terminal
ip dhcp snooping
ip dhcp snooping vlan 10
no ip dhcp snooping information option
ip arp inspection vlan 10
interface GigabitEthernet1/0/24
ip dhcp snooping trust
ip arp inspection trust
exit
interface range GigabitEthernet1/0/1 - 3
switchport port-security maximum 2
switchport port-security violation restrict
switchport port-security mac-address sticky
switchport port-security
end`,
    PC1: 'ipconfig /release\nipconfig /renew',
    PC2: 'ipconfig /release\nipconfig /renew',
  },
};
