// Protocol behaviour: OSPF adjacency rules and DR election, STP root/roles,
// BPDU guard, port security, DTP, EtherChannel, ACL unreachables, NAT, HSRP.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLab } from '../courses/ccna/plugins/sim/index.js';

function cli(net, dev, lines) {
  const s = net.openSession(dev);
  if (s.mode === 'user') s.input('enable');
  return lines.map((l) => s.input(l)).join('\n');
}

const TRIO = {
  id: 'trio',
  topology: {
    devices: [{ name: 'R1', type: 'router' }, { name: 'R2', type: 'router' }, { name: 'R3', type: 'router' }, { name: 'SW1', type: 'switch' }],
    links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/1'], ['R2', 'Gi0/0/0', 'SW1', 'Gi1/0/2'], ['R3', 'Gi0/0/0', 'SW1', 'Gi1/0/3']],
  },
  initialConfig: Object.fromEntries([1, 2, 3].map((n) => [`R${n}`, `hostname R${n}
interface Loopback0
 ip address ${n}.${n}.${n}.${n} 255.255.255.255
interface GigabitEthernet0/0/0
 ip address 10.0.0.${n} 255.255.255.0
 no shutdown
router ospf 1
 router-id ${n}.${n}.${n}.${n}
 network 0.0.0.0 255.255.255.255 area 0`])),
};

test('OSPF: highest router ID wins DR, next is BDR; DROTHERs are 2WAY with each other only if two exist', () => {
  const net = buildLab(TRIO);
  assert.equal(net.ospfIfState('R3', 'Gi0/0/0'), 'DR');
  assert.equal(net.ospfIfState('R2', 'Gi0/0/0'), 'BDR');
  assert.equal(net.ospfIfState('R1', 'Gi0/0/0'), 'DROTHER');
  assert.deepEqual(net.ospfNbrs('R1').map((n) => `${n.rid}:${n.state}/${n.role}`).sort(), ['2.2.2.2:FULL/BDR', '3.3.3.3:FULL/DR']);
  assert.ok(net.ribHas('R1', '3.3.3.3/32', 'O'));
});

test('OSPF DR election is non-preemptive until clear ip ospf process', () => {
  const net = buildLab(TRIO);
  cli(net, 'R1', ['conf t', 'int g0/0/0', 'ip ospf priority 200', 'end']);
  assert.equal(net.ospfIfState('R3', 'Gi0/0/0'), 'DR', 'existing DR keeps its role');
  cli(net, 'R3', ['clear ip ospf process', 'yes']);
  assert.equal(net.ospfIfState('R2', 'Gi0/0/0'), 'DR', 'BDR is promoted when the DR resets');
  assert.equal(net.ospfIfState('R1', 'Gi0/0/0'), 'BDR');
});

test('OSPF adjacency fails on hello mismatch, area mismatch and passive; logs ADJCHG', () => {
  const net = buildLab(TRIO);
  const out = cli(net, 'R1', ['conf t', 'int g0/0/0', 'ip ospf hello-interval 5']);
  assert.match(out, /%OSPF-5-ADJCHG: Process 1, Nbr 3\.3\.3\.3 on GigabitEthernet0\/0\/0 from FULL to DOWN/);
  assert.equal(net.ospfNbrs('R1').length, 0);
  cli(net, 'R1', ['no ip ospf hello-interval', 'end']);
  assert.equal(net.ospfNbrs('R1').length, 2);
  cli(net, 'R2', ['conf t', 'router ospf 1', 'passive-interface g0/0/0', 'end']);
  assert.deepEqual(net.ospfNbrs('R1').map((n) => n.rid), ['3.3.3.3']);
  cli(net, 'R3', ['conf t', 'router ospf 1', 'no network 0.0.0.0 255.255.255.255 area 0', 'network 0.0.0.0 255.255.255.255 area 1', 'end']);
  assert.equal(net.ospfNbrs('R1').length, 0);
});

test('OSPF MTU mismatch leaves neighbors stuck in EXSTART/EXCHANGE', () => {
  const net = buildLab(TRIO);
  cli(net, 'R1', ['conf t', 'int g0/0/0', 'ip mtu 1400', 'end']);
  const states = net.ospfNbrs('R1').map((n) => n.state);
  assert.ok(states.every((s) => s === 'EXSTART' || s === 'EXCHANGE'), JSON.stringify(states));
});

const TRIANGLE = {
  id: 'tri',
  topology: {
    devices: [{ name: 'SW1', type: 'switch', mac: '0000.0000.1100' }, { name: 'SW2', type: 'switch', mac: '0000.0000.2200' }, { name: 'SW3', type: 'switch', mac: '0000.0000.3300' }, { name: 'SW4', type: 'switch', mac: '0000.0000.4400' }],
    links: [['SW1', 'Gi1/0/1', 'SW2', 'Gi1/0/1'], ['SW1', 'Gi1/0/2', 'SW3', 'Gi1/0/1'], ['SW2', 'Gi1/0/2', 'SW3', 'Gi1/0/2'], ['SW3', 'Gi1/0/10', 'SW4', 'Gi1/0/1']],
  },
  initialConfig: Object.fromEntries(['SW1', 'SW2', 'SW3', 'SW4'].map((n) => [n, `hostname ${n}\ninterface range GigabitEthernet1/0/1 - 2\n switchport mode trunk`])),
};

test('STP: lowest bridge ID is root; the highest-BID switch blocks its non-root uplink', () => {
  const net = buildLab(TRIANGLE);
  assert.ok(net.stpInfo('SW1', 1).isRoot);
  const sw3 = net.stpInfo('SW3', 1);
  assert.equal(sw3.rootPort, 'GigabitEthernet1/0/1');
  assert.equal(sw3.ports['GigabitEthernet1/0/2'].role, 'Altn');
  assert.equal(sw3.ports['GigabitEthernet1/0/2'].state, 'BLK');
  assert.equal(net.stpInfo('SW2', 1).ports['GigabitEthernet1/0/2'].role, 'Desg');
  cli(net, 'SW3', ['conf t', 'spanning-tree vlan 1 root primary', 'end']);
  assert.ok(net.stpInfo('SW3', 1).isRoot);
  assert.equal(net.cfgOf('SW3').stp.prio.get(1), 24576);
  assert.equal(net.stpInfo('SW2', 1).ports['GigabitEthernet1/0/1'].role, 'Altn', 'SW2 now blocks toward SW1 (higher BID than SW1 on that segment)');
});

test('BPDU guard err-disables a portfast port that receives BPDUs; shut/no shut recovers once removed', () => {
  const net = buildLab(TRIANGLE);
  const out = cli(net, 'SW3', ['conf t', 'int g1/0/10', 'switchport mode access', 'spanning-tree portfast', 'spanning-tree bpduguard enable']);
  assert.match(out, /%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port GigabitEthernet1\/0\/10 with BPDU Guard enabled\. Disabling port\./);
  assert.match(out, /%PM-4-ERR_DISABLE: bpduguard error detected on Gi1\/0\/10, putting Gi1\/0\/10 in err-disable state/);
  assert.ok(net.errDisabled('SW3', 'Gi1/0/10'));
  assert.match(net.show('SW3', 'show interfaces g1/0/10'), /^GigabitEthernet1\/0\/10 is down, line protocol is down \(err-disabled\)/);
  cli(net, 'SW3', ['no spanning-tree bpduguard enable', 'shutdown', 'no shutdown', 'end']);
  assert.ok(!net.errDisabled('SW3', 'Gi1/0/10'));
});

test('DTP: dynamic auto + dynamic auto stays access; desirable + auto trunks', () => {
  const net = buildLab({ id: 'dtp', topology: { devices: [{ name: 'A', type: 'switch' }, { name: 'B', type: 'switch' }], links: [['A', 'Gi1/0/1', 'B', 'Gi1/0/1']] }, initialConfig: {} });
  assert.equal(net.trunkOper('A', 'Gi1/0/1'), 'access');
  cli(net, 'A', ['conf t', 'int g1/0/1', 'switchport mode dynamic desirable', 'end']);
  assert.equal(net.trunkOper('A', 'Gi1/0/1'), 'trunk');
  assert.equal(net.trunkOper('B', 'Gi1/0/1'), 'trunk');
});

test('EtherChannel: active/passive bundles, passive/passive stays individual, on/active err-disables', () => {
  const mk = (a, b) => buildLab({
    id: 'ec',
    topology: { devices: [{ name: 'A', type: 'switch' }, { name: 'B', type: 'switch' }], links: [['A', 'Gi1/0/1', 'B', 'Gi1/0/1'], ['A', 'Gi1/0/2', 'B', 'Gi1/0/2']] },
    initialConfig: { A: `interface range GigabitEthernet1/0/1 - 2\n switchport mode trunk\n channel-group 1 mode ${a}`, B: `interface range GigabitEthernet1/0/1 - 2\n switchport mode trunk\n channel-group 1 mode ${b}` },
  });
  let net = mk('active', 'passive');
  assert.deepEqual(net.channel('A', 1), { up: true, proto: 'LACP', members: { 'GigabitEthernet1/0/1': 'P', 'GigabitEthernet1/0/2': 'P' } });
  assert.match(net.show('A', 'show etherchannel summary'), /^1 {6}Po1\(SU\) {9}LACP {8}Gi1\/0\/1\(P\) {3}Gi1\/0\/2\(P\)$/m);
  net = mk('passive', 'passive');
  assert.equal(net.channel('A', 1).up, false);
  assert.equal(net.channel('A', 1).members['GigabitEthernet1/0/1'], 'I');
  net = mk('on', 'active');
  assert.ok(net.errDisabled('A', 'Gi1/0/1'));
  net = mk('desirable', 'auto');
  assert.equal(net.channel('B', 1).proto, 'PAgP');
  assert.equal(net.channel('B', 1).up, true);
});

const EDGE = {
  id: 'edge',
  topology: {
    devices: [{ name: 'R1', type: 'router' }, { name: 'R2', type: 'router' }, { name: 'PC1', type: 'pc', ip: '192.168.1.10/24', gateway: '192.168.1.1' }, { name: 'SW1', type: 'switch' }],
    links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'], ['SW1', 'Gi1/0/1', 'PC1', 'eth0'], ['R1', 'Gi0/0/1', 'R2', 'Gi0/0/1']],
  },
  initialConfig: {
    R1: `hostname R1
interface GigabitEthernet0/0/0
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
 no shutdown
interface GigabitEthernet0/0/1
 ip address 203.0.113.2 255.255.255.252
 ip nat outside
 no shutdown
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/0/1 overload
ip route 0.0.0.0 0.0.0.0 203.0.113.1`,
    R2: `hostname R2
interface Loopback0
 ip address 8.8.8.8 255.255.255.255
interface GigabitEthernet0/0/1
 ip address 203.0.113.1 255.255.255.252
 no shutdown`,
    SW1: 'hostname SW1',
  },
};

test('PAT: inside host reaches a network the ISP has no route back to; translation table shows ICMP entry', () => {
  const net = buildLab(EDGE);
  assert.ok(net.canPing('PC1', '8.8.8.8'));
  assert.match(net.show('R1', 'show ip nat translations'), /^icmp 203\.0\.113\.2:\d+ +192\.168\.1\.10:\d+ +8\.8\.8\.8:\d+ +8\.8\.8\.8:\d+$/m);
  assert.match(net.show('R1', 'show ip nat translations'), /Total number of translations: 1$/);
});

test('ACL deny makes IOS send ICMP unreachables (U.U.U pattern) and counts matches', () => {
  const net = buildLab(EDGE);
  cli(net, 'R1', ['conf t', 'ip access-list extended BLOCK', 'deny icmp any host 192.168.1.10', 'permit ip any any', 'exit', 'int g0/0/1', 'ip access-group BLOCK in', 'end']);
  const out = cli(net, 'R2', ['conf t', 'ip route 192.168.1.0 255.255.255.0 203.0.113.2', 'end', 'ping 203.0.113.2', 'ping 192.168.1.10']);
  assert.match(out, /\nU\.U\.U\nSuccess rate is 0 percent \(0\/5\)/);
  assert.match(net.show('R1', 'show access-lists BLOCK'), /10 deny icmp any host 192\.168\.1\.10 \(\d+ match(es)?\)/);
});

test('port security restrict: second MAC beyond maximum is dropped and counted', () => {
  const net = buildLab({
    id: 'ps',
    topology: { devices: [{ name: 'SW1', type: 'switch' }, { name: 'PC1', type: 'pc', ip: '10.0.0.1/24' }, { name: 'PC2', type: 'pc', ip: '10.0.0.2/24' }], links: [['SW1', 'Gi1/0/1', 'PC1', 'eth0'], ['SW1', 'Gi1/0/2', 'PC2', 'eth0']] },
    initialConfig: { SW1: 'interface GigabitEthernet1/0/2\n switchport mode access\n switchport port-security mac-address 0000.1111.2222\n switchport port-security violation shutdown\n switchport port-security' },
  });
  assert.ok(net.errDisabled('SW1', 'Gi1/0/2'), 'PC2 is not the configured secure MAC: shutdown violation');
  assert.ok(!net.canPing('PC1', '10.0.0.2', { tries: 2 }));
  assert.match(net.show('SW1', 'show port-security interface g1/0/2'), /Port Status {16}: Secure-shutdown/);
});

test('HSRP: higher priority with preempt becomes active; virtual IP answers ARP with the vMAC', () => {
  const net = buildLab({
    id: 'hsrp',
    topology: { devices: [{ name: 'R1', type: 'router' }, { name: 'R2', type: 'router' }, { name: 'SW1', type: 'switch' }, { name: 'PC1', type: 'pc', ip: '10.1.1.10/24', gateway: '10.1.1.1' }], links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/1'], ['R2', 'Gi0/0/0', 'SW1', 'Gi1/0/2'], ['SW1', 'Gi1/0/3', 'PC1', 'eth0']] },
    initialConfig: {
      R1: 'hostname R1\ninterface GigabitEthernet0/0/0\n ip address 10.1.1.2 255.255.255.0\n standby 1 ip 10.1.1.1\n no shutdown',
      R2: 'hostname R2\ninterface GigabitEthernet0/0/0\n ip address 10.1.1.3 255.255.255.0\n standby 1 ip 10.1.1.1\n no shutdown',
    },
  });
  assert.equal(net.hsrpRole('R2', 'Gi0/0/0', 1), 'Active', 'equal priority: highest IP wins');
  cli(net, 'R1', ['conf t', 'int g0/0/0', 'standby 1 priority 110', 'end']);
  assert.equal(net.hsrpRole('R2', 'Gi0/0/0', 1), 'Active', 'no preempt: R1 does not take over');
  const out = cli(net, 'R1', ['conf t', 'int g0/0/0', 'standby 1 preempt', 'end']);
  assert.match(out, /%HSRP-5-STATECHANGE: Gi0\/0\/0 Grp 1 state Standby -> Active/);
  assert.ok(net.canPing('PC1', '10.1.1.1'));
  assert.match(net.openSession('PC1').input('arp -a'), /10\.1\.1\.1 +00-00-0c-07-ac-01 +dynamic/);
});

test('switch SVI is up/down with no active ports in its VLAN and up/up once a port forwards', () => {
  const net = buildLab({ id: 'svi', topology: { devices: [{ name: 'SW1', type: 'switch' }, { name: 'PC1', type: 'pc' }], links: [['SW1', 'Gi1/0/1', 'PC1', 'eth0']] }, initialConfig: { SW1: 'vlan 20\ninterface Vlan20\n ip address 10.20.0.1 255.255.255.0' } });
  assert.deepEqual(net.ifStatus('SW1', 'Vlan20'), ['up', 'down']);
  cli(net, 'SW1', ['conf t', 'int g1/0/1', 'switchport access vlan 20', 'end']);
  assert.deepEqual(net.ifStatus('SW1', 'Vlan20'), ['up', 'up']);
});

const PSEC = (violation) => buildLab({
  id: 'ps-mode',
  topology: { devices: [{ name: 'SW1', type: 'switch' }, { name: 'PC1', type: 'pc', ip: '10.0.0.1/24' }, { name: 'PC2', type: 'pc', ip: '10.0.0.2/24' }], links: [['SW1', 'Gi1/0/1', 'PC1', 'eth0'], ['SW1', 'Gi1/0/2', 'PC2', 'eth0']] },
  initialConfig: { SW1: `interface GigabitEthernet1/0/2\n switchport mode access\n switchport port-security mac-address 0000.1111.2222\n switchport port-security violation ${violation}\n switchport port-security` },
});

test('port security protect drops silently: no syslog and the violation counter stays 0 (restrict counts)', () => {
  const net = PSEC('protect');
  assert.ok(!net.canPing('PC1', '10.0.0.2', { tries: 2 }));
  assert.ok(!net.errDisabled('SW1', 'Gi1/0/2'));
  assert.match(net.show('SW1', 'show port-security interface g1/0/2'), /Security Violation Count {3}: 0$/m);
  assert.doesNotMatch(net.show('SW1', 'show logging'), /PSECURE_VIOLATION/);
  const r = PSEC('restrict');
  assert.ok(!r.canPing('PC1', '10.0.0.2', { tries: 2 }));
  assert.match(r.show('SW1', 'show port-security interface g1/0/2'), /Security Violation Count {3}: [1-9]\d*$/m);
  assert.match(r.show('SW1', 'show logging'), /%PORT_SECURITY-2-PSECURE_VIOLATION/);
});

test('a static route with administrative distance 255 is never installed', () => {
  const net = buildLab(EDGE);
  cli(net, 'R1', ['conf t', 'ip route 10.99.0.0 255.255.0.0 203.0.113.1 255', 'ip route 10.98.0.0 255.255.0.0 203.0.113.1 254', 'end']);
  assert.ok(!net.ribHas('R1', '10.99.0.0/16', 'S'));
  assert.ok(net.ribHas('R1', '10.98.0.0/16', 'S'));
  assert.match(net.show('R1', 'show running-config'), /^ip route 10\.99\.0\.0 255\.255\.0\.0 203\.0\.113\.1 255$/m);
});

const SNOOP = {
  id: 'snoop82',
  topology: {
    devices: [{ name: 'R1', type: 'router' }, { name: 'SW1', type: 'switch' }, { name: 'PC1', type: 'pc', dhcp: true }, { name: 'PC2', type: 'pc', dhcp: true }],
    links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'], ['SW1', 'Gi1/0/1', 'PC1', 'eth0'], ['SW1', 'Gi1/0/2', 'PC2', 'eth0']],
  },
  initialConfig: {
    R1: 'hostname R1\nip dhcp excluded-address 192.168.10.1 192.168.10.9\nip dhcp pool LAN\n network 192.168.10.0 255.255.255.0\n default-router 192.168.10.1\ninterface GigabitEthernet0/0/0\n ip address 192.168.10.1 255.255.255.0\n no shutdown',
    SW1: 'hostname SW1\nip dhcp snooping vlan 1\nip dhcp snooping\ninterface GigabitEthernet1/0/24\n ip dhcp snooping trust',
  },
};

test('DHCP snooping inserts option 82: an IOS DHCP server drops it until insertion is disabled or the interface is trusted', () => {
  let net = buildLab(SNOOP);
  assert.ok(!(net.hostIp('PC1') || '').startsWith('192.168.10.'), 'option 82 with giaddr 0.0.0.0 is dropped by R1');
  cli(net, 'SW1', ['conf t', 'no ip dhcp snooping information option', 'end']);
  net.openSession('PC1').input('ipconfig /renew');
  net.openSession('PC2').input('ipconfig /renew');
  assert.ok(net.hostIp('PC1').startsWith('192.168.10.'));
  // the binding is on the client's port, not on whichever port the flooded ACK left last
  assert.match(net.show('SW1', 'show ip dhcp snooping binding'), /^00:50:79:.* GigabitEthernet1\/0\/1$/m);
  assert.equal(net.device('SW1').st.snoopBindings.get(net.device('PC1').mac).port, 'GigabitEthernet1/0/1');
  assert.equal(net.device('SW1').st.snoopBindings.get(net.device('PC2').mac).port, 'GigabitEthernet1/0/2');

  net = buildLab(SNOOP);
  cli(net, 'R1', ['conf t', 'int g0/0/0', 'ip dhcp relay information trusted', 'end']);
  net.openSession('PC1').input('ipconfig /renew');
  assert.ok(net.hostIp('PC1').startsWith('192.168.10.'), 'trusted interface accepts option 82 with giaddr 0');
});

test('OSPF duplicate router ID: no adjacency and %OSPF-4-DUP_RTRID_NBR is logged', () => {
  const net = buildLab(TRIO);
  const out = cli(net, 'R2', ['conf t', 'router ospf 1', 'router-id 1.1.1.1', 'end', 'clear ip ospf process', 'yes']);
  assert.match(out, /%OSPF-4-DUP_RTRID_NBR: OSPF detected duplicate router-id 1\.1\.1\.1 from 10\.0\.0\.1 on interface GigabitEthernet0\/0\/0/);
  assert.ok(!net.ospfNbrs('R2').some((n) => n.rid === 0x01010101));
});

test('spanning-tree portfast trunk makes a trunk to a router an edge port; plain portfast does not', () => {
  const net = buildLab({
    id: 'pftrunk',
    topology: { devices: [{ name: 'R1', type: 'router' }, { name: 'SW1', type: 'switch' }], links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24']] },
    initialConfig: { R1: 'interface GigabitEthernet0/0/0\n no shutdown', SW1: 'interface GigabitEthernet1/0/24\n switchport mode trunk\n spanning-tree portfast' },
  });
  assert.doesNotMatch(net.show('SW1', 'show spanning-tree vlan 1'), /^Gi1\/0\/24 .*Edge/m, 'plain portfast has no effect on a trunk');
  const out = cli(net, 'SW1', ['conf t', 'int g1/0/24', 'spanning-tree portfast trunk', 'end']);
  assert.doesNotMatch(out, /non-trunking mode/);
  assert.match(net.show('SW1', 'show spanning-tree vlan 1'), /^Gi1\/0\/24 .*P2p Edge$/m);
  assert.match(net.show('SW1', 'show running-config'), /^ spanning-tree portfast trunk$/m);
});

test('CDP reports a native VLAN mismatch between access ports in different VLANs, and access vs trunk', () => {
  const net = buildLab({
    id: 'cdpnv',
    topology: { devices: [{ name: 'A', type: 'switch' }, { name: 'B', type: 'switch' }], links: [['A', 'Gi1/0/1', 'B', 'Gi1/0/1']] },
    initialConfig: { A: 'hostname A\nvlan 10\ninterface GigabitEthernet1/0/1\n switchport mode access\n switchport access vlan 10', B: 'hostname B\nvlan 20\ninterface GigabitEthernet1/0/1\n switchport mode access\n switchport access vlan 20' },
  });
  assert.match(net.show('A', 'show logging'), /%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet1\/0\/1 \(10\), with B GigabitEthernet1\/0\/1 \(20\)\./);
  const out = cli(net, 'B', ['conf t', 'int g1/0/1', 'switchport mode trunk', 'switchport trunk native vlan 30', 'end']);
  assert.match(out, /Native VLAN mismatch discovered on GigabitEthernet1\/0\/1 \(30\), with A GigabitEthernet1\/0\/1 \(10\)\./);
});

test('PVST+: access ports in different VLANs linked together are NOT PVID-blocked (trees merge; only trunks check PVID)', () => {
  const lab = {
    id: 'pvid-access',
    topology: { devices: [{ name: 'SW1', type: 'switch' }, { name: 'SW2', type: 'switch' }], links: [['SW1', 'Gi1/0/1', 'SW2', 'Gi1/0/1']] },
    initialConfig: {
      SW1: 'hostname SW1\nvlan 10\ninterface GigabitEthernet1/0/1\n switchport mode access\n switchport access vlan 10',
      SW2: 'hostname SW2\nvlan 20\ninterface GigabitEthernet1/0/1\n switchport mode access\n switchport access vlan 20',
    },
  };
  const net = buildLab(lab);
  const out = cli(net, 'SW1', ['show spanning-tree vlan 10']);
  assert.doesNotMatch(out, /PVID/i, out);
  assert.match(out, /Gi1\/0\/1\s+\S+\s+FWD/, out);
});
