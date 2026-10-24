// CLI parser behaviour: abbreviations, ambiguity, IOS error messages, `?`
// help, Tab completion, modes, `do`, pipes, and interface-name handling.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLab } from '../src/sim/index.js';
import { normalizeIfName, shortIf } from '../src/sim/ifnames.js';

function lab() {
  return buildLab({
    id: 'parser',
    topology: { devices: [{ name: 'R1', type: 'router' }, { name: 'SW1', type: 'switch' }], links: [['R1', 'Gi0/0/0', 'SW1', 'Gi1/0/1']] },
    initialConfig: { R1: 'hostname R1', SW1: 'hostname SW1' },
  });
}

function priv(net, name = 'R1') {
  const s = net.openSession(name);
  s.input('enable');
  return s;
}

test('interface name abbreviations expand to canonical names', () => {
  assert.equal(normalizeIfName('g0/0/0'), 'GigabitEthernet0/0/0');
  assert.equal(normalizeIfName('gi1/0/24'), 'GigabitEthernet1/0/24');
  assert.equal(normalizeIfName('Gig0/0/1.10'), 'GigabitEthernet0/0/1.10');
  assert.equal(normalizeIfName('lo0'), 'Loopback0');
  assert.equal(normalizeIfName('vlan10'), 'Vlan10');
  assert.equal(normalizeIfName('po1'), 'Port-channel1');
  assert.equal(normalizeIfName('port-channel2'), 'Port-channel2');
  assert.equal(normalizeIfName('fa0/1'), 'FastEthernet0/1');
  assert.equal(shortIf('GigabitEthernet1/0/24'), 'Gi1/0/24');
});

test('prompts follow IOS modes', () => {
  const net = lab();
  const s = net.openSession('R1');
  assert.equal(s.prompt, 'R1>');
  s.input('en');
  assert.equal(s.prompt, 'R1#');
  assert.match(s.input('conf t'), /Enter configuration commands, one per line\.\s+End with CNTL\/Z\./);
  assert.equal(s.prompt, 'R1(config)#');
  s.input('int g0/0/0');
  assert.equal(s.prompt, 'R1(config-if)#');
  s.input('int g0/0/0.10');
  assert.equal(s.prompt, 'R1(config-subif)#');
  s.input('router ospf 1');
  assert.equal(s.prompt, 'R1(config-router)#');
  s.input('exit');
  s.input('line vty 0 4');
  assert.equal(s.prompt, 'R1(config-line)#');
  s.input('ip access-list extended WEB');
  assert.equal(s.prompt, 'R1(config-ext-nacl)#');
  s.input('ip access-list standard MGMT');
  assert.equal(s.prompt, 'R1(config-std-nacl)#');
  s.input('ip dhcp pool LAN');
  assert.equal(s.prompt, 'R1(dhcp-config)#');
  s.input('ipv6 unicast-routing');
  s.input('ipv6 router ospf 1');
  assert.equal(s.prompt, 'R1(config-rtr)#');
  s.input('end');
  assert.equal(s.prompt, 'R1#');
  const sw = priv(net, 'SW1');
  sw.input('configure terminal');
  sw.input('vlan 10');
  assert.equal(sw.prompt, 'SW1(config-vlan)#');
  sw.input('interface range g1/0/1 - 4');
  assert.equal(sw.prompt, 'SW1(config-if-range)#');
  sw.ctrlZ();
  assert.equal(sw.prompt, 'SW1#');
});

test('unique-prefix abbreviation works for whole command lines', () => {
  const net = lab();
  const s = priv(net);
  assert.match(s.input('sh ip int br'), /^Interface\s+IP-Address\s+OK\? Method Status\s+Protocol/);
  s.input('conf t');
  s.input('int gi 0/0/1');
  assert.equal(s.prompt, 'R1(config-if)#');
  s.input('ip add 10.1.1.1 255.255.255.0');
  s.input('no shut');
  s.input('end');
  assert.match(s.input('sh run int g0/0/1'), / ip address 10\.1\.1\.1 255\.255\.255\.0/);
});

test('invalid input places the caret under the offending token', () => {
  const net = lab();
  const s = priv(net);
  const out = s.input('show ip interfaz brief');
  const [caretLine, msg] = out.split('\n');
  assert.equal(msg, "% Invalid input detected at '^' marker.");
  assert.equal(caretLine.indexOf('^'), 'R1#show ip '.length);
});

test('incomplete, ambiguous and unknown-command messages match IOS', () => {
  const net = lab();
  const s = priv(net);
  assert.match(s.input('show ip'), /^% Incomplete command\./);
  assert.equal(s.input('c'), '% Ambiguous command:  "c"');
  assert.match(s.input('foo'), /^Translating "foo"\.\.\.domain server \(255\.255\.255\.255\)\n% Unknown command or computer name, or unable to find computer address$/);
  s.input('conf t');
  s.input('no ip domain lookup');
  s.input('end');
  assert.match(s.input('foo'), /^Translating "foo"\n% Unknown/);
});

test('commands that do not exist on a platform are rejected as invalid input', () => {
  const net = lab();
  const r1 = priv(net);
  r1.input('conf t');
  r1.input('int g0/0/0');
  assert.match(r1.input('switchport mode access'), /% Invalid input detected/);
  const sw = priv(net, 'SW1');
  sw.input('conf t');
  assert.match(sw.input('ip nat inside source static 1.1.1.1 2.2.2.2'), /% Invalid input detected/);
  assert.match(sw.input('interface g1/0/1'), /^$/);
  assert.match(sw.input('switchport trunk encapsulation dot1q'), /% Invalid input detected/);
});

test('? lists next keywords with help, and word? completes', () => {
  const net = lab();
  const s = priv(net);
  const h = s.help('show ip ');
  assert.match(h, /^ {2}access-lists\s+List access lists/m);
  assert.match(h, /^ {2}route\s+IP routing table/m);
  assert.equal(s.help('sh'), 'show');
  assert.match(s.help('co'), /configure {2}copy/);
  s.input('conf t');
  const r = s.help('ip route ');
  assert.match(r, /A\.B\.C\.D\s+Destination prefix/);
  assert.match(s.help('hostname R1 '), /<cr>/);
  assert.match(s.help('interface '), /GigabitEthernet\s+GigabitEthernet IEEE 802\.3z/);
  assert.equal(s.help('xyz'), '% Unrecognized command');
});

test('Tab completion completes unique keywords and interface types', () => {
  const net = lab();
  const s = priv(net);
  assert.equal(s.complete('sh'), 'show ');
  assert.equal(s.complete('show ip ro'), 'show ip route ');
  assert.equal(s.complete('c'), null);
  s.input('conf t');
  assert.equal(s.complete('int gi'), 'int GigabitEthernet');
});

test('do runs exec commands from config mode; config-mode fallback to global works', () => {
  const net = lab();
  const s = priv(net);
  s.input('conf t');
  s.input('interface g0/0/0');
  assert.match(s.input('do show ip interface brief'), /GigabitEthernet0\/0\/0/);
  s.input('hostname EDGE');
  assert.equal(s.prompt, 'EDGE(config)#');
});

test('output pipes: include, exclude, begin, section, count', () => {
  const net = lab();
  const s = priv(net);
  s.input('conf t');
  s.input('router ospf 1');
  s.input('network 10.0.0.0 0.255.255.255 area 0');
  s.input('end');
  assert.equal(s.input('show running-config | include hostname'), 'hostname R1');
  assert.match(s.input('show running-config | section router ospf'), /^router ospf 1\n network 10\.0\.0\.0 0\.255\.255\.255 area 0$/);
  assert.match(s.input('show running-config | count interface'), /^Number of lines which match regexp = \d+$/);
  assert.match(s.input('show running-config | begin line con'), /^line con 0/);
  assert.doesNotMatch(s.input('show ip interface brief | exclude unassigned'), /unassigned/);
});

test('validation errors mirror IOS (bad mask, overlap, L2 port)', () => {
  const net = lab();
  const s = priv(net);
  s.input('conf t');
  s.input('int g0/0/0');
  assert.equal(s.input('ip address 10.1.1.1 255.0.255.0'), 'Bad mask 0xFF00FF00 for address 10.1.1.1');
  assert.equal(s.input('ip address 10.1.1.0 255.255.255.0'), 'Bad mask /24 for address 10.1.1.0');
  s.input('ip address 10.1.1.1 255.255.255.0');
  s.input('int g0/0/1');
  assert.equal(s.input('ip address 10.1.1.2 255.255.255.0'), '% 10.1.1.0 overlaps with GigabitEthernet0/0/0');
  s.input('exit');
  assert.equal(s.input('ip route 10.9.9.1 255.255.255.0 10.1.1.2'), '%Inconsistent address and mask');
  const sw = priv(net, 'SW1');
  sw.input('conf t');
  sw.input('int g1/0/2');
  assert.equal(sw.input('ip address 10.2.2.2 255.255.255.0'), '% IP addresses may not be configured on L2 links.');
  assert.match(sw.input('switchport port-security'), /Command rejected: GigabitEthernet1\/0\/2 is a dynamic port\./);
  assert.match(sw.input('switchport access vlan 30'), /% Access VLAN does not exist\. Creating vlan 30/);
});

test('enable secret prompts for a password and rejects bad ones', () => {
  const net = lab();
  const s = priv(net);
  s.input('conf t');
  s.input('enable secret Str0ng!');
  s.input('end');
  s.input('disable');
  assert.equal(s.prompt, 'R1>');
  s.input('enable');
  assert.equal(s.prompt, 'Password: ');
  assert.equal(s.secret, true);
  s.input('wrong');
  assert.equal(s.prompt, 'Password: ');
  s.input('Str0ng!');
  assert.equal(s.prompt, 'R1#');
  assert.match(s.input('show running-config | include enable'), /^enable secret 9 \$9\$/);
});

test('history records commands per session', () => {
  const net = lab();
  const s = priv(net);
  s.input('show clock');
  assert.deepEqual(s.history.slice(-2), ['enable', 'show clock']);
});

test('bare show asks for a subcommand like IOS', () => {
  const s = priv(lab());
  assert.equal(s.input('show'), '% Type "show ?" for a list of subcommands\n');
  assert.equal(s.input('sh'), '% Type "show ?" for a list of subcommands\n');
});

test('a LAN sub-interface needs encapsulation dot1Q before it accepts an IP address', () => {
  const s = priv(lab());
  s.input('conf t');
  s.input('int g0/0/0.10');
  assert.match(s.input('ip address 10.10.10.1 255.255.255.0'), /^% Configuring IP routing on a LAN subinterface is only allowed if that\nsubinterface is already configured as part of an IEEE 802\.10, IEEE 802\.1Q,\nor ISL vLAN\.$/);
  assert.equal(s.cfg.interfaces.get('GigabitEthernet0/0/0.10').ip, null);
  s.input('encapsulation dot1Q 10');
  assert.equal(s.input('ip address 10.10.10.1 255.255.255.0'), '');
});

test('an IPv6 static route to a link-local next hop must name the exit interface', () => {
  const s = priv(lab());
  s.input('conf t');
  assert.equal(s.input('ipv6 route 2001:db8:1::/64 fe80::2'), '% Interface has to be specified for a link-local nexthop');
  assert.equal(s.cfg.staticRoutes6.length, 0);
  assert.equal(s.input('ipv6 route 2001:db8:1::/64 g0/0/0 fe80::2'), '');
  assert.equal(s.cfg.staticRoutes6.length, 1);
});

test('real-but-unsimulated show commands explain themselves instead of claiming invalid input', async () => {
  const { buildLab } = await import('../src/sim/index.js');
  const lab = { id: 'stub', topology: { devices: [{ name: 'SW1', type: 'switch' }, { name: 'R1', type: 'router' }], links: [] }, initialConfig: { SW1: 'hostname SW1', R1: 'hostname R1' } };
  const net = buildLab(lab);
  const sw = net.openSession('SW1');
  sw.input('enable');
  for (const cmd of ['show lacp neighbor', 'sh ipv6 int gi1/0/1', 'show interfaces counters errors', 'show ip ospf database']) {
    const out = sw.input(cmd);
    assert.match(out, /real IOS command/, `${cmd}: ${out}`);
    assert.doesNotMatch(out, /Invalid input/, cmd);
  }
  // Truly bogus commands still get the real IOS error.
  assert.match(sw.input('show bogus-thing'), /Invalid input detected/);
  // Existing commands are unaffected.
  assert.match(sw.input('show ipv6 interface brief'), /\S/);
});
