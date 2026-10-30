import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ipToInt, intToIp, prefixToMask, maskToPrefix, wildcardFor, subnetInfo,
  prefixForHosts, eui64, compressIPv6, expandIPv6, generateProblem, checkAnswer, mulberry32,
} from '../courses/ccna/plugins/lib/subnet.js';

test('ipToInt / intToIp round-trip including high octets', () => {
  assert.equal(ipToInt('255.255.255.255'), 0xffffffff);
  assert.equal(intToIp(ipToInt('192.168.10.200')), '192.168.10.200');
  assert.equal(ipToInt('0.0.0.0'), 0);
});

test('ipToInt rejects malformed input', () => {
  assert.throws(() => ipToInt('256.1.1.1'));
  assert.throws(() => ipToInt('10.1.1'));
  assert.throws(() => ipToInt('a.b.c.d'));
});

test('prefix and mask conversions', () => {
  assert.equal(prefixToMask(26), '255.255.255.192');
  assert.equal(prefixToMask(0), '0.0.0.0');
  assert.equal(prefixToMask(32), '255.255.255.255');
  assert.equal(maskToPrefix('255.255.240.0'), 20);
  assert.throws(() => maskToPrefix('255.0.255.0'));
  assert.equal(wildcardFor(22), '0.0.3.255');
});

test('subnetInfo computes a typical /27', () => {
  const s = subnetInfo('172.16.5.77', 27);
  assert.deepEqual(s, {
    network: '172.16.5.64', broadcast: '172.16.5.95', firstHost: '172.16.5.65',
    lastHost: '172.16.5.94', usableHosts: 30, mask: '255.255.255.224', wildcard: '0.0.0.31', prefix: 27,
  });
});

test('subnetInfo handles /31 (RFC 3021) and /32', () => {
  const p2p = subnetInfo('10.0.0.1', 31);
  assert.equal(p2p.usableHosts, 2);
  assert.equal(p2p.firstHost, '10.0.0.0');
  assert.equal(p2p.lastHost, '10.0.0.1');
  const host = subnetInfo('10.0.0.9', 32);
  assert.equal(host.usableHosts, 1);
  assert.equal(host.firstHost, '10.0.0.9');
});

test('prefixForHosts picks the smallest subnet that fits', () => {
  assert.equal(prefixForHosts(30), 27);
  assert.equal(prefixForHosts(31), 26);
  assert.equal(prefixForHosts(2), 30);
  assert.equal(prefixForHosts(500), 23);
});

test('eui64 flips the U/L bit and inserts FFFE', () => {
  assert.equal(eui64('2001:db8:1:1::', '00:1A:2B:3C:4D:5E'), '2001:db8:1:1:21a:2bff:fe3c:4d5e');
  assert.equal(eui64('2001:db8::', '0200.1111.2222'), '2001:db8::11ff:fe11:2222');
});

test('IPv6 compression follows RFC 5952', () => {
  assert.equal(compressIPv6('2001:0db8:0000:0000:0000:ff00:0042:8329'), '2001:db8::ff00:42:8329');
  assert.equal(compressIPv6('2001:db8:0:1:0:0:0:1'), '2001:db8:0:1::1');
  assert.equal(compressIPv6('2001:db8:0:0:1:0:0:1'), '2001:db8::1:0:0:1');
  assert.equal(compressIPv6('fe80:0:0:0:0:0:0:1'), 'fe80::1');
  assert.equal(expandIPv6('2001:db8::1'), '2001:0db8:0000:0000:0000:0000:0000:0001');
});

test('generated problems are deterministic per seed and self-check', () => {
  const kinds = ['network', 'broadcast', 'first', 'last', 'hosts', 'prefixForHosts', 'wildcard', 'mask', 'eui64', 'compress'];
  for (const kind of kinds) {
    const a = generateProblem(kind, mulberry32(42));
    const b = generateProblem(kind, mulberry32(42));
    assert.deepEqual(a, b, `${kind} deterministic`);
    assert.ok(checkAnswer(a, a.answers[0]), `${kind} accepts its own answer`);
    assert.ok(!checkAnswer(a, 'nonsense'), `${kind} rejects garbage`);
  }
});

test('checkAnswer normalizes prefixes and whitespace', () => {
  const p = { kind: 'prefixForHosts', answers: ['/26', '26', '255.255.255.192'] };
  assert.ok(checkAnswer(p, ' /26 '));
  assert.ok(checkAnswer(p, '255.255.255.192'));
});
