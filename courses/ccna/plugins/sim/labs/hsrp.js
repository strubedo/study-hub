export default {
  id: 'hsrp',
  title: 'HSRP: A Redundant Default Gateway',
  topic: '3.4',
  difficulty: 2,
  minutes: 12,
  examEligible: true,
  summary: 'Give the user LAN a virtual gateway shared by two routers, make R1 active with preemption, and verify failover.',
  scenario: `R1 and R2 both connect to the user LAN **192.168.50.0/24** (R1 .2, R2 .3) and to the core router CORE. The PCs use **192.168.50.1** as their default gateway, and no router owns that address yet.

Configure **HSRP version 2, group 50**:
- virtual IP **192.168.50.1**;
- R1 is normally **active** (priority 110) and takes the role back after recovering (**preempt**);
- R2 stays at the default priority and acts as **standby**.

OSPF between R1, R2 and CORE is already running, so CORE learns the user LAN from whichever router still has it.`,
  topology: {
    devices: [
      { name: 'CORE', type: 'router', x: 1.5, y: 0 },
      { name: 'R1', type: 'router', x: 0.7, y: 1 },
      { name: 'R2', type: 'router', x: 2.3, y: 1 },
      { name: 'SW1', type: 'switch', x: 1.5, y: 2 },
      { name: 'PC1', type: 'pc', x: 1, y: 3, ip: '192.168.50.10/24', gateway: '192.168.50.1' },
      { name: 'PC2', type: 'pc', x: 2, y: 3, ip: '192.168.50.11/24', gateway: '192.168.50.1' },
    ],
    links: [
      ['CORE', 'Gi0/0/0', 'R1', 'Gi0/0/1'],
      ['CORE', 'Gi0/0/1', 'R2', 'Gi0/0/1'],
      ['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/23'],
      ['R2', 'Gi0/0/0', 'SW1', 'Gi1/0/24'],
      ['SW1', 'Gi1/0/1', 'PC1', 'eth0'],
      ['SW1', 'Gi1/0/2', 'PC2', 'eth0'],
    ],
  },
  initialConfig: {
    CORE: `hostname CORE
no ip domain lookup
interface Loopback0
 ip address 10.255.255.1 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.0.1.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.2.1 255.255.255.252
 no shutdown
router ospf 1
 router-id 10.255.255.1
 network 10.0.0.0 0.255.255.255 area 0`,
    R1: `hostname R1
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 192.168.50.2 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.1.2 255.255.255.252
 no shutdown
router ospf 1
 router-id 1.1.1.1
 passive-interface GigabitEthernet0/0/0
 network 10.0.1.0 0.0.0.3 area 0
 network 192.168.50.0 0.0.0.255 area 0`,
    R2: `hostname R2
no ip domain lookup
interface GigabitEthernet0/0/0
 ip address 192.168.50.3 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.2.2 255.255.255.252
 no shutdown
router ospf 1
 router-id 2.2.2.2
 passive-interface GigabitEthernet0/0/0
 network 10.0.2.0 0.0.0.3 area 0
 network 192.168.50.0 0.0.0.255 area 0`,
    SW1: 'hostname SW1',
  },
  tasks: [
    { text: 'Both routers run HSRP version 2, group 50, with virtual IP 192.168.50.1.', check: (net) => ['R1', 'R2'].every((d) => { const i = net.iface(d, 'Gi0/0/0'); return i.standbyVersion === 2 && i.standby.get(50)?.ip === 0xc0a83201; }) },
    { text: 'R1 has priority 110 with preempt, and is Active; R2 is Standby.', check: (net) => { const g = net.iface('R1', 'Gi0/0/0').standby.get(50); return g?.priority === 110 && g.preempt && net.hsrpRole('R1', 'Gi0/0/0', 50) === 'Active' && net.hsrpRole('R2', 'Gi0/0/0', 50) === 'Standby'; } },
    { text: 'PC1 and PC2 can ping CORE\'s loopback 10.255.255.1 through the virtual gateway.', check: (net) => net.canPing('PC1', '10.255.255.1') && net.canPing('PC2', '10.255.255.1') },
    {
      text: 'Failover: with R1 Gi0/0/0 shut, R2 becomes Active and PC1 still reaches 10.255.255.1.',
      check: (net) => net.simulate((n) => { const i = n.iface('R1', 'Gi0/0/0'); i.shutdown = true; return () => { i.shutdown = false; }; },
        (n) => n.hsrpRole('R2', 'Gi0/0/0', 50) === 'Active' && n.canPing('PC1', '10.255.255.1')),
    },
  ],
  hints: [
    '`standby version 2` must match on both routers. Version 2 uses the virtual MAC 0000.0c9f.fXXX.',
    '`standby 50 ip 192.168.50.1`, `standby 50 priority 110`, `standby 50 preempt`.',
    'Without preempt, a router with a higher priority that comes up later stays in Standby. HSRP, like the OSPF DR, is non-preemptive by default.',
    'Check with `show standby brief` on both routers.',
  ],
  solution: {
    R1: `configure terminal
interface GigabitEthernet0/0/0
standby version 2
standby 50 ip 192.168.50.1
standby 50 priority 110
standby 50 preempt
end`,
    R2: `configure terminal
interface GigabitEthernet0/0/0
standby version 2
standby 50 ip 192.168.50.1
end`,
  },
};
