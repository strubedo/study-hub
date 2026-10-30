export default {
  id: 'ipv4-addressing',
  title: 'Fix IPv4 Addressing: Masks and Gateways',
  topic: '1.3',
  difficulty: 1,
  minutes: 12,
  examEligible: true,
  troubleshooting: true,
  summary: 'Three addressing faults break a small branch. Find the wrong mask, gateway, and router interface address.',
  scenario: `A branch office uses **172.16.10.0/24**, carved into subnets:

| Segment | Subnet | Gateway |
|---|---|---|
| User LAN (SW1) | 172.16.10.0/26 | 172.16.10.1 (R1 Gi0/0/0) |
| Server LAN | 172.16.10.64/27 | 172.16.10.65 (R1 Gi0/0/1) |

Users report they cannot reach the file server **SRV1 (172.16.10.70)**. Someone typed the addressing by hand and made three mistakes, one on PC1, one on PC2, and one on R1.

Use \`ipconfig\`, \`ping\`, \`show ip interface brief\` and \`show running-config\` to find and fix them. PCs are configured with \`netsh\` exactly like Windows, e.g. \`netsh interface ip set address "Ethernet0" static <ip> <mask> <gateway>\`.`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 2, y: 0 },
      { name: 'SW1', type: 'switch', x: 1, y: 1 },
      { name: 'PC1', type: 'pc', x: 0.5, y: 2, ip: '172.16.10.10', mask: '255.255.255.0', gateway: '172.16.10.1' },
      { name: 'PC2', type: 'pc', x: 1.5, y: 2, ip: '172.16.10.11', mask: '255.255.255.192', gateway: '172.16.10.62' },
      { name: 'SRV1', type: 'server', x: 3, y: 1, ip: '172.16.10.70', mask: '255.255.255.224', gateway: '172.16.10.65' },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
      ['R1', 'Gi0/0/1', 'SRV1', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 description User LAN
 ip address 172.16.10.1 255.255.255.192
 no shutdown
interface GigabitEthernet0/0/1
 description Server LAN
 ip address 172.16.10.97 255.255.255.224
 no shutdown`,
    SW1: `hostname SW1
no ip domain lookup`,
  },
  tasks: [
    {
      text: 'PC1 uses the correct subnet mask for the user LAN (/26).',
      check: (net) => net.hostCfg('PC1').mask === '255.255.255.192' && net.hostCfg('PC1').ip === '172.16.10.10',
    },
    {
      text: 'PC2 uses R1 (172.16.10.1) as its default gateway.',
      check: (net) => net.hostCfg('PC2').gateway === '172.16.10.1',
    },
    {
      text: 'R1 Gi0/0/1 is the first usable address of the server subnet (172.16.10.65/27).',
      check: (net) => {
        const i = net.iface('R1', 'Gi0/0/1');
        return !!i.ip && i.ip.addr === 0xac100a41 && i.ip.mask === 0xffffffe0;
      },
    },
    {
      text: 'PC1 and PC2 can both ping SRV1 (172.16.10.70).',
      check: (net) => net.canPing('PC1', '172.16.10.70') && net.canPing('PC2', '172.16.10.70'),
    },
  ],
  hints: [
    'Compare each PC\'s `ipconfig` output with the addressing table. A /26 mask is 255.255.255.192.',
    'With the wrong mask PC1 may still reach some hosts, because R1 answers its ARP requests by proxy ARP. Fix the mask anyway, because proxy ARP is hiding the fault.',
    'On R1, `show ip interface brief` shows which subnet Gi0/0/1 is really in. 172.16.10.97 is in 172.16.10.96/27, not .64/27.',
  ],
  solution: {
    PC1: 'netsh interface ip set address "Ethernet0" static 172.16.10.10 255.255.255.192 172.16.10.1',
    PC2: 'netsh interface ip set address "Ethernet0" static 172.16.10.11 255.255.255.192 172.16.10.1',
    R1: `configure terminal
interface GigabitEthernet0/0/1
ip address 172.16.10.65 255.255.255.224
end`,
  },
};
