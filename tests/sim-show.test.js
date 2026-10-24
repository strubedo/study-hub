// Show-command formatting and running-config rendering / round trip.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLab } from '../src/sim/index.js';
import { type7Encrypt, type7Decrypt } from '../src/sim/util.js';

const LAB = {
  id: 'show',
  topology: {
    devices: [{ name: 'R1', type: 'router' }, { name: 'R2', type: 'router' }, { name: 'SW1', type: 'switch' }, { name: 'PC1', type: 'pc', ip: '192.168.1.10/24', gateway: '192.168.1.1' }],
    links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/24'], ['SW1', 'Gi1/0/1', 'PC1', 'eth0'], ['R1', 'Gi0/0/1', 'R2', 'Gi0/0/1']],
  },
  initialConfig: {
    R1: `hostname R1
no ip domain lookup
interface Loopback0
 ip address 1.1.1.1 255.255.255.255
interface GigabitEthernet0/0/0
 description LAN
 ip address 192.168.1.1 255.255.255.0
 no shutdown
interface GigabitEthernet0/0/1
 ip address 10.0.12.1 255.255.255.252
 no shutdown
router ospf 1
 router-id 1.1.1.1
 network 0.0.0.0 255.255.255.255 area 0
ip route 0.0.0.0 0.0.0.0 10.0.12.2`,
    R2: `hostname R2
interface Loopback0
 ip address 2.2.2.2 255.255.255.255
interface Loopback1
 ip address 172.16.1.1 255.255.255.0
interface GigabitEthernet0/0/1
 ip address 10.0.12.2 255.255.255.252
 no shutdown
router ospf 1
 router-id 2.2.2.2
 network 0.0.0.0 255.255.255.255 area 0`,
    SW1: `hostname SW1
vlan 10
 name USERS
interface GigabitEthernet1/0/1
 description PC1
 switchport access vlan 1
 switchport mode access`,
  },
};

const sh = (net, dev, cmd) => net.show(dev, cmd);

test('show ip interface brief columns and states', () => {
  const net = buildLab(LAB);
  const out = sh(net, 'R1', 'show ip interface brief').split('\n');
  assert.equal(out[0], 'Interface              IP-Address      OK? Method Status                Protocol');
  assert.equal(out.find((l) => l.startsWith('GigabitEthernet0/0/0')), 'GigabitEthernet0/0/0   192.168.1.1     YES NVRAM  up                    up');
  assert.equal(out.find((l) => l.startsWith('GigabitEthernet0/0/2')), 'GigabitEthernet0/0/2   unassigned      YES unset  administratively down down');
  assert.equal(out.find((l) => l.startsWith('Loopback0')), 'Loopback0              1.1.1.1         YES NVRAM  up                    up');
});

test('show ip route: codes, gateway of last resort, classful headers, OSPF and static lines', () => {
  const net = buildLab(LAB);
  const out = sh(net, 'R1', 'show ip route');
  assert.match(out, /^Codes: L - local, C - connected, S - static/);
  assert.match(out, /\nGateway of last resort is 10\.0\.12\.2 to network 0\.0\.0\.0\n/);
  assert.match(out, /\nS\* {4}0\.0\.0\.0\/0 \[1\/0\] via 10\.0\.12\.2\n/);
  assert.match(out, /\n {6}10\.0\.0\.0\/8 is variably subnetted, 2 subnets, 2 masks\n/);
  assert.match(out, /\nC {8}10\.0\.12\.0\/30 is directly connected, GigabitEthernet0\/0\/1\n/);
  assert.match(out, /\nL {8}10\.0\.12\.1\/32 is directly connected, GigabitEthernet0\/0\/1\n/);
  assert.match(out, /\n {6}2\.0\.0\.0\/32 is subnetted, 1 subnets?\nO {8}2\.2\.2\.2\/32 \[110\/2\] via 10\.0\.12\.2, \d\d:\d\d:\d\d, GigabitEthernet0\/0\/1/);
  assert.match(out, /\n {6}172\.16\.0\.0\/32 is subnetted, 1 subnet\nO {8}172\.16\.1\.1\/32 \[110\/2\]/, 'loopbacks are advertised as /32 host routes');
  assert.match(sh(net, 'R1', 'show ip route 2.2.2.2'), /^Routing entry for 2\.2\.2\.2\/32\n {2}Known via "ospf 1", distance 110, metric 2, type intra area/);
  assert.equal(sh(net, 'R1', 'show ip route 99.99.99.99'), '% Network not in table');
});

test('show ip ospf neighbor format', () => {
  const net = buildLab(LAB);
  const lines = sh(net, 'R1', 'show ip ospf neighbor').split('\n');
  assert.equal(lines[1], 'Neighbor ID     Pri   State           Dead Time   Address         Interface');
  assert.match(lines[2], /^2\.2\.2\.2 {11}1 {3}FULL\/(DR|BDR) +00:00:\d\d {4}10\.0\.12\.2 {7}GigabitEthernet0\/0\/1$/);
});

test('show vlan brief and show interfaces status', () => {
  const net = buildLab(LAB);
  const v = sh(net, 'SW1', 'show vlan brief');
  assert.match(v, /^VLAN Name {29}Status {4}Ports$/m);
  assert.match(v, /^10 {3}USERS {28}active\s*$/m);
  assert.match(v, /^1002 fddi-default {21}act\/unsup/m);
  const st = sh(net, 'SW1', 'show interfaces status');
  assert.match(st, /^Gi1\/0\/1 {6}PC1 {16}connected {4}1 {10}a-full a-1000 10\/100\/1000BaseTX$/m);
  assert.match(st, /^Gi1\/0\/2 {25}notconnect {3}1 {12}auto {3}auto 10\/100\/1000BaseTX$/m);
});

test('running-config renders in IOS order and reloads to the same text', () => {
  const net = buildLab(LAB);
  const s = net.openSession('R1');
  ['enable', 'conf t', 'username admin privilege 15 secret S3cret', 'service password-encryption', 'line con 0', 'password cisco', 'login',
    'exit', 'ip access-list extended WEB', 'permit tcp any host 10.0.12.2 eq www', 'deny ip any any log', 'exit', 'access-list 10 permit host 192.168.1.10',
    'banner motd #Authorized access only#', 'interface g0/0/0', 'ip access-group WEB in', 'end'].forEach((c) => s.input(c));
  const run = sh(net, 'R1', 'show running-config');
  const idx = (re) => run.search(re);
  assert.match(run, /^Building configuration\.\.\.\n\nCurrent configuration : \d+ bytes\n/);
  assert.ok(idx(/^hostname R1$/m) < idx(/^username admin privilege 15 secret 9 /m));
  assert.ok(idx(/^username/m) < idx(/^interface Loopback0$/m));
  assert.ok(idx(/^interface Loopback0$/m) < idx(/^interface GigabitEthernet0\/0\/0$/m));
  assert.ok(idx(/^interface GigabitEthernet0\/0\/2$/m) < idx(/^router ospf 1$/m));
  assert.ok(idx(/^router ospf 1$/m) < idx(/^ip route 0\.0\.0\.0 0\.0\.0\.0 10\.0\.12\.2$/m));
  assert.ok(idx(/^ip access-list extended WEB$/m) < idx(/^access-list 10 permit 192\.168\.1\.10$/m), 'host keyword is dropped in numbered standard ACLs');
  assert.ok(idx(/^line con 0$/m) < idx(/^end$/m));
  assert.match(run, /^ 10 permit tcp any host 10\.0\.12\.2 eq www\n 20 deny {3}ip any any log$/m);
  assert.match(run, /^line con 0\n password 7 [0-9A-F]+\n login\n stopbits 1$/m);
  assert.match(run, /^banner motd \^CAuthorized access only\^C$/m);
  assert.match(run, /^interface GigabitEthernet0\/0\/2\n no ip address\n shutdown\n negotiation auto$/m);

  const saved = JSON.parse(JSON.stringify(net.serialize()));
  const net2 = buildLab(LAB, saved);
  assert.deepEqual(net2.loadErrors, []);
  const strip = (t) => t.replace(/^Current configuration.*$/m, '').replace(/^! Last configuration change.*$/m, '');
  assert.equal(strip(sh(net2, 'R1', 'show running-config')), strip(run).replace(/^!\n! Last configuration change.*\n/m, ''));
});

test('type 7 password encryption is the real Cisco algorithm', () => {
  assert.equal(type7Decrypt('0822455D0A16'), 'cisco');
  assert.equal(type7Decrypt(type7Encrypt('S3cr3t!', 5)), 'S3cr3t!');
});

test('show access-lists shows sequence numbers and hit counters', () => {
  const net = buildLab(LAB);
  const s = net.openSession('R1');
  ['enable', 'conf t', 'ip access-list standard LAN', 'permit 192.168.1.0 0.0.0.255', 'exit', 'interface g0/0/0', 'ip access-group LAN in', 'end'].forEach((c) => s.input(c));
  net.canPing('PC1', '2.2.2.2');
  const out = sh(net, 'R1', 'show access-lists');
  assert.match(out, /^Standard IP access list LAN\n {4}10 permit 192\.168\.1\.0, wildcard bits 0\.0\.0\.255 \(\d+ match(es)?\)$/);
});

test('PC ipconfig and Windows ping output', () => {
  const net = buildLab(LAB);
  const pc = net.openSession('PC1');
  assert.match(pc.input('ipconfig'), /IPv4 Address\. \. \. \. \. \. \. \. \. \. \. : 192\.168\.1\.10\n {3}Subnet Mask \. \. \. \. \. \. \. \. \. \. \. : 255\.255\.255\.0\n {3}Default Gateway \. \. \. \. \. \. \. \. \. : 192\.168\.1\.1/);
  const ping = pc.input('ping 192.168.1.1');
  assert.match(ping, /Pinging 192\.168\.1\.1 with 32 bytes of data:\nReply from 192\.168\.1\.1: bytes=32 time[<=]\d+ms TTL=255/);
  assert.match(ping, /Packets: Sent = 4, Received = 4, Lost = 0 \(0% loss\),/);
  assert.match(pc.input('ping 192.168.1.99'), /Reply from 192\.168\.1\.10: Destination host unreachable\./);
});

test('IOS ping: first packet lost to ARP, then success; unreachable shows U', () => {
  const net = buildLab(LAB);
  const s = net.openSession('R1');
  s.input('enable');
  const first = s.input('ping 192.168.1.10');
  assert.match(first, /^Type escape sequence to abort\.\nSending 5, 100-byte ICMP Echos to 192\.168\.1\.10, timeout is 2 seconds:\n\.!!!!\nSuccess rate is 80 percent \(4\/5\), round-trip min\/avg\/max = \d+\/\d+\/\d+ ms$/);
  assert.match(s.input('ping 192.168.1.10'), /\n!!!!!\nSuccess rate is 100 percent \(5\/5\)/);
  const r2 = net.openSession('R2');
  r2.input('enable');
  assert.match(r2.input('ping 8.8.8.8'), /\n\.{5}\nSuccess rate is 0 percent \(0\/5\)$/, 'no route: dots');
});

test('show ip dhcp pool with no pool name lists every pool', () => {
  const net = buildLab({ ...LAB, initialConfig: { ...LAB.initialConfig, R1: `${LAB.initialConfig.R1}\nip dhcp pool LAN\n network 192.168.1.0 255.255.255.0\nip dhcp pool SPARE\n network 10.9.9.0 255.255.255.0` } });
  const all = sh(net, 'R1', 'show ip dhcp pool');
  assert.match(all, /^Pool LAN :$/m);
  assert.match(all, /^Pool SPARE :$/m);
  const one = sh(net, 'R1', 'show ip dhcp pool SPARE');
  assert.match(one, /^Pool SPARE :$/m);
  assert.doesNotMatch(one, /Pool LAN/);
});

const EC = {
  id: 'po-bw',
  topology: { devices: [{ name: 'A', type: 'switch' }, { name: 'B', type: 'switch' }], links: [['A', 'Gi1/0/1', 'B', 'Gi1/0/1'], ['A', 'Gi1/0/2', 'B', 'Gi1/0/2']] },
  initialConfig: { A: 'interface range GigabitEthernet1/0/1 - 2\n switchport mode trunk\n channel-group 1 mode on', B: 'interface range GigabitEthernet1/0/1 - 2\n switchport mode trunk\n channel-group 1 mode on' },
};

test('show interfaces port-channel: BW is the sum of the bundled members', () => {
  const net = buildLab(EC);
  assert.match(sh(net, 'A', 'show interfaces port-channel 1'), /MTU 1500 bytes, BW 2000000 Kbit\/sec/);
});

test('show interfaces status err-disabled keeps the full reason; STP summary lists only active instances as root', () => {
  const net = buildLab({ ...EC, initialConfig: { ...EC.initialConfig, B: 'interface range GigabitEthernet1/0/1 - 2\n switchport mode trunk' } });
  assert.match(sh(net, 'A', 'show interfaces status err-disabled'), /^Gi1\/0\/1 +err-disabled channel-misconfig \(STP\)$/m);
  const lone = buildLab({ id: 'lone', topology: { devices: [{ name: 'S', type: 'switch' }, { name: 'PC1', type: 'pc' }], links: [['S', 'Gi1/0/1', 'PC1', 'eth0']] }, initialConfig: { S: 'vlan 10\ninterface GigabitEthernet1/0/1\n switchport mode access\n switchport access vlan 10' } });
  assert.match(sh(lone, 'S', 'show spanning-tree summary'), /^Root bridge for: VLAN0010$/m);
  assert.equal(sh(lone, 'S', 'show spanning-tree vlan 1'), 'Spanning tree instance(s) for vlan 1 does not exist.');
});

test('ipconfig /all lease times use Windows long dates', () => {
  const net = buildLab({ ...LAB, topology: { ...LAB.topology, devices: LAB.topology.devices.map((d) => (d.name === 'PC1' ? { name: 'PC1', type: 'pc', dhcp: true } : d)) }, initialConfig: { ...LAB.initialConfig, R1: `${LAB.initialConfig.R1}\nip dhcp excluded-address 192.168.1.1\nip dhcp pool LAN\n network 192.168.1.0 255.255.255.0\n default-router 192.168.1.1` } });
  const all = net.openSession('PC1').input('ipconfig /all');
  assert.match(all, /Lease Obtained\. \. \. \. \. \. \. \. \. \. : Saturday, October 24, 2026 9:00:\d\d AM$/m);
  assert.match(all, /Lease Expires \. \. \. \. \. \. \. \. \. \. : Sunday, October 25, 2026 9:00:\d\d AM$/m);
});

test('show ip ospf / show ip protocols name the area the router is really in', () => {
  const net = buildLab({ ...LAB, initialConfig: { ...LAB.initialConfig, R2: LAB.initialConfig.R2.replace('area 0', 'area 1') } });
  const o = sh(net, 'R2', 'show ip ospf');
  assert.match(o, /^ {4}Area 1$/m);
  assert.doesNotMatch(o, /BACKBONE/);
  assert.match(o, /Number of areas in this router is 1\. 1 normal 0 stub 0 nssa/);
  assert.match(sh(net, 'R1', 'show ip ospf'), /^ {4}Area BACKBONE\(0\)$/m);
});
