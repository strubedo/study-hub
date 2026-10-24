export default {
  id: 'dhcp-relay',
  title: 'DHCP Server and Relay (ip helper-address)',
  topic: '1.7',
  difficulty: 2,
  minutes: 18,
  examEligible: false,
  summary: 'Build two DHCP pools on R1 and relay requests from a remote LAN with ip helper-address.',
  scenario: `R1 is the central DHCP server. It serves its own LAN directly and the branch LAN behind R2 through a relay.

| LAN | Subnet | Gateway | Excluded |
|---|---|---|---|
| HQ (R1 Gi0/0/0) | 192.168.10.0/24 | 192.168.10.1 | .1 – .10 |
| Branch (R2 Gi0/0/0) | 192.168.20.0/24 | 192.168.20.1 | .1 – .10 |

Both pools hand out DNS server **10.0.0.53** and domain **lab.local**. Routing between the sites is already in place. All PCs are DHCP clients and currently show 169.254.x.x (APIPA) addresses.

When you finish, run \`ipconfig /renew\` on the PCs (they also retry automatically).`,
  topology: {
    devices: [
      { name: 'R1', type: 'router', x: 1, y: 0 },
      { name: 'R2', type: 'router', x: 3, y: 0 },
      { name: 'SW1', type: 'switch', x: 1, y: 1 },
      { name: 'SW2', type: 'switch', x: 3, y: 1 },
      { name: 'PC1', type: 'pc', x: 1, y: 2, dhcp: true },
      { name: 'PC2', type: 'pc', x: 2.5, y: 2, dhcp: true },
      { name: 'PC3', type: 'pc', x: 3.5, y: 2, dhcp: true },
    ],
    links: [
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['R1', 'Gi0/0/1', 'R2', 'Gi0/0/1'],
      ['R2', 'Gi0/0/0', 'SW2', 'Gi1/0/24'],
      ['SW2', 'Gi1/0/1', 'PC2', 'eth0'],
      ['SW2', 'Gi1/0/2', 'PC3', 'eth0'],
    ],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.12.1 255.255.255.252
 no shutdown
ip route 192.168.20.0 255.255.255.0 10.0.12.2`,
    R2: `hostname R2
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 192.168.20.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.12.2 255.255.255.252
 no shutdown
ip route 0.0.0.0 0.0.0.0 10.0.12.1`,
    SW1: 'hostname SW1',
    SW2: 'hostname SW2',
  },
  tasks: [
    {
      text: 'R1 excludes 192.168.10.1–10 and 192.168.20.1–10 from DHCP.',
      check: (net) => {
        const ex = net.cfgOf('R1').dhcpExcluded;
        const has = (lo, hi) => ex.some((r) => r.lo <= lo && r.hi >= hi);
        return has(0xc0a80a01, 0xc0a80a0a) && has(0xc0a81401, 0xc0a8140a);
      },
    },
    {
      text: 'R1 has a pool for each LAN with the correct network, default-router, dns-server 10.0.0.53 and domain-name lab.local.',
      check: (net) => {
        const pools = [...net.cfgOf('R1').dhcpPools.values()];
        const ok = (netw, gw) => pools.some((p) => p.network && p.network.addr === netw && p.network.mask === 0xffffff00
          && p.routers[0] === gw && p.dns.includes(0x0a000035) && p.domain === 'lab.local');
        return ok(0xc0a80a00, 0xc0a80a01) && ok(0xc0a81400, 0xc0a81401);
      },
    },
    { text: 'R2 relays DHCP broadcasts from the branch LAN to R1 (10.0.12.1).', check: (net) => (net.iface('R2', 'Gi0/0/0').helpers || []).includes(0x0a000c01) },
    {
      text: 'PC1 leases an address in 192.168.10.0/24, and PC2 and PC3 lease addresses in 192.168.20.0/24 above .10.',
      check: (net) => {
        const inNet = (pc, prefix) => { const c = net.hostCfg(pc); return !!c.ip && !c.apipa && c.ip.startsWith(prefix) && Number(c.ip.split('.')[3]) > 10; };
        return inNet('PC1', '192.168.10.') && inNet('PC2', '192.168.20.') && inNet('PC3', '192.168.20.');
      },
    },
    { text: 'PC2 can ping PC1.', check: (net) => { const ip = net.hostIp('PC1'); return !!ip && net.canPing('PC2', ip); } },
  ],
  hints: [
    'Exclusions are global: `ip dhcp excluded-address 192.168.10.1 192.168.10.10`.',
    'Pool commands: `network`, `default-router`, `dns-server`, `domain-name`.',
    'The relay is configured on the interface that receives the client broadcasts (R2 Gi0/0/0): `ip helper-address 10.0.12.1`.',
    'R1 picks the pool whose network contains the relay\'s giaddr (192.168.20.1), so the remote pool needs no extra commands.',
  ],
  solution: {
    R1: `configure terminal
ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp excluded-address 192.168.20.1 192.168.20.10
ip dhcp pool HQ
network 192.168.10.0 255.255.255.0
default-router 192.168.10.1
dns-server 10.0.0.53
domain-name lab.local
exit
ip dhcp pool BRANCH
network 192.168.20.0 255.255.255.0
default-router 192.168.20.1
dns-server 10.0.0.53
domain-name lab.local
end`,
    R2: `configure terminal
interface GigabitEthernet0/0/0
ip helper-address 10.0.12.1
end`,
    PC1: 'ipconfig /renew',
    PC2: 'ipconfig /renew',
    PC3: 'ipconfig /renew',
  },
};
