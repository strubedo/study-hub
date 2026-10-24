// IP data plane: ARP / IPv6 ND, ICMP, IPv4/IPv6 forwarding with longest-prefix
// match, inbound/outbound ACLs, NAT/PAT, DHCP server + relay + client, and
// minimal TCP (SYN -> SYN/ACK or RST) for reachability tests.

import { isHost } from './device.js';
import { l3Transmit } from './frames.js';
import { BROADCAST_MAC, netOf, ipStr, mask6 } from './util.js';
import { ribLookup, routingEnabled, lpm6 } from './routing.js';
import { aclPermits } from './acl.js';
import { natOutbound, natInbound } from './nat.js';
import { dhcpServe } from './dhcp.js';

export const TTL = { ios: 255, pc: 128, server: 64 };
const BCAST = 0xffffffff;

function defaultTtl(dev) { return dev.type === 'pc' ? TTL.pc : dev.type === 'server' ? TTL.server : TTL.ios; }

// ---------- addressing helpers ----------
export function ownsIp(net, dev, ip, ifName) {
  for (const l of dev.l3.values()) {
    if (!l.up) continue;
    if (l.ip === ip || l.secondary.some((s) => s.addr === ip)) return true;
  }
  if (ifName && net.hsrpVipActive(dev, ifName, ip)) return true;
  return false;
}


function ownsIp6(dev, ip) {
  for (const l of dev.l3.values()) {
    if (!l.up) continue;
    if (l.ll === ip || l.v6.some((a) => a.addr === ip)) return true;
  }
  return false;
}

function ifForSubnet(dev, ip) {
  for (const l of dev.l3.values()) {
    if (!l.up || l.ip === null) continue;
    if (netOf(ip, l.mask) === netOf(l.ip, l.mask)) return l;
  }
  return null;
}

/** Next hop decision: { ifName, nh } or { error }. */
export function routeFor(net, dev, dst) {
  if (dst === BCAST) return { error: 'bcast' };
  if (isHost(dev)) {
    const n = dev.nic;
    const l = dev.l3.get('eth0');
    if (n.ip === null || !l.up) return { error: 'noip' };
    if (netOf(dst, n.mask) === netOf(n.ip, n.mask)) return { ifName: 'eth0', nh: dst };
    if (n.gw === null) return { error: 'nogw' };
    return { ifName: 'eth0', nh: n.gw };
  }
  if (!routingEnabled(dev)) {
    const l = ifForSubnet(dev, dst);
    if (l) return { ifName: l.name, nh: dst };
    const gw = dev.cfg.defaultGateway;
    const gl = gw !== null ? ifForSubnet(dev, gw) : null;
    if (!gl) return { error: 'noroute' };
    return { ifName: gl.name, nh: gw };
  }
  const r = ribLookup(dev, dst);
  if (!r) return { error: 'noroute' };
  if (r.proto === 'L') return { local: true, ifName: r.paths[0].ifName };
  const path = r.paths[dst % r.paths.length];
  return { ifName: path.ifName, nh: path.nh === null ? dst : path.nh, route: r };
}

// ---------- ARP ----------
function arpLookup(dev, ip) {
  const e = dev.st.arp.get(ip);
  return e ? e.mac : null;
}

function arpLearn(net, dev, ifName, ip, mac, create) {
  if (!create && !dev.st.arp.has(ip)) return;
  dev.st.arp.set(ip, { mac, ifName, time: net.now() });
}

export function sendArpRequest(net, dev, ifName, target) {
  const l = dev.l3.get(ifName);
  if (!l || l.ip === null) return;
  const spa = srcIpFor(dev, l, target);
  l3Transmit(net, dev, ifName, { src: l.mac, dst: BROADCAST_MAC, type: 'arp', arp: { op: 'req', sha: l.mac, spa, tha: '0000.0000.0000', tpa: target } });
}

export function sendGarp(net, dev, ifName, ip, mac) {
  const l = dev.l3.get(ifName);
  if (!l) return;
  l3Transmit(net, dev, ifName, { src: mac || l.mac, dst: BROADCAST_MAC, type: 'arp', arp: { op: 'req', sha: mac || l.mac, spa: ip, tha: 'ffff.ffff.ffff', tpa: ip, garp: true } });
}

function srcIpFor(dev, l, target) {
  if (l.ip !== null && netOf(target, l.mask) === netOf(l.ip, l.mask)) return l.ip;
  const sec = l.secondary.find((s) => netOf(target, s.mask) === netOf(s.addr, s.mask));
  return sec ? sec.addr : l.ip;
}

function arpInput(net, dev, ifName, frame) {
  const a = frame.arp;
  const l = dev.l3.get(ifName);
  if (!l) return;
  if (a.garp) { arpLearn(net, dev, ifName, a.spa, a.sha, false); return; }
  if (a.op === 'rep') {
    if (a.tpa === l.ip || l.secondary.some((s) => s.addr === a.tpa)) arpLearn(net, dev, ifName, a.spa, a.sha, true);
    return;
  }
  const forMe = a.tpa === l.ip || l.secondary.some((s) => s.addr === a.tpa) || (isHost(dev) && a.tpa === dev.nic.ip);
  const vip = !isHost(dev) && net.hsrpVipActive(dev, ifName, a.tpa);
  const natAlias = !isHost(dev) && l.cfg.nat === 'outside' && natOwns(dev, a.tpa);
  let replyMac = null;
  if (forMe || natAlias) replyMac = l.mac;
  else if (vip) replyMac = net.hsrpVmac(dev, ifName, a.tpa);
  else if (!isHost(dev) && l.cfg.proxyArp && routingEnabled(dev) && a.spa !== 0) {
    const r = routeFor(net, dev, a.tpa);
    if (r.ifName && !r.local && r.ifName !== ifName && netOf(a.tpa, l.mask) !== netOf(l.ip ?? 0, l.mask)) replyMac = l.mac;
  }
  if (!replyMac) { arpLearn(net, dev, ifName, a.spa, a.sha, false); return; }
  if (a.spa !== 0) arpLearn(net, dev, ifName, a.spa, a.sha, true);
  l3Transmit(net, dev, ifName, { src: replyMac, dst: a.sha, type: 'arp', arp: { op: 'rep', sha: replyMac, spa: a.tpa, tha: a.sha, tpa: a.spa } });
}

function natOwns(dev, ip) {
  if (dev.cfg.nat.statics.some((s) => s.global === ip)) return true;
  for (const p of dev.cfg.nat.pools.values()) if (ip >= p.start && ip <= p.end) return true;
  return false;
}

// ---------- frame dispatch ----------
export function l3Input(net, dev, ifName, frame) {
  if (frame.probe) { frame.probe.push({ dev, ifName }); return; }
  if (frame.type === 'arp') { arpInput(net, dev, ifName, frame); return; }
  if (frame.type === 'nd') { ndInput(net, dev, ifName, frame); return; }
  if (frame.type === 'ip') { ipInput(net, dev, ifName, frame.ip, frame); return; }
  if (frame.type === 'ip6') ip6Input(net, dev, ifName, frame.ip);
}

// ---------- IPv4 ----------
function deliverOut(net, dev, ifName, nh, pkt, { wait }) {
  let mac = arpLookup(dev, nh);
  if (!mac) {
    sendArpRequest(net, dev, ifName, nh);
    mac = arpLookup(dev, nh);
    if (!mac) return 'arp-fail';
    if (!wait) { dev.st.arpDrops += 1; return 'arp-pending'; }
  }
  const l = dev.l3.get(ifName);
  l3Transmit(net, dev, ifName, { src: l.mac, dst: mac, type: 'ip', ip: pkt });
  return 'sent';
}

/** Originate a packet from a device. Returns a status string. */
export function originate(net, dev, pkt, opts = {}) {
  const host = isHost(dev);
  if (pkt.dst === BCAST) {
    const ifName = opts.ifName || 'eth0';
    l3Transmit(net, dev, ifName, { src: dev.l3.get(ifName).mac, dst: BROADCAST_MAC, type: 'ip', ip: { ttl: defaultTtl(dev), ...pkt } });
    return 'sent';
  }
  if (!host && ownsIp(net, dev, pkt.dst)) {
    const p = { ttl: defaultTtl(dev), ...pkt, src: pkt.src ?? pkt.dst };
    localDeliver(net, dev, null, p);
    return 'sent';
  }
  const r = opts.forceIf ? { ifName: opts.forceIf, nh: pkt.dst } : routeFor(net, dev, pkt.dst);
  if (r.error) return r.error;
  const l = dev.l3.get(r.ifName);
  if (!l || !l.up) return 'noroute';
  const full = { ttl: defaultTtl(dev), ...pkt, src: pkt.src ?? srcIpFor(dev, l, r.nh) };
  if (full.src === null) return 'noip';
  return deliverOut(net, dev, r.ifName, r.nh, full, { wait: host || !!opts.wait });
}

function sendIcmpError(net, dev, inIf, pkt, type, code) {
  if (pkt.proto === 'icmp' && (pkt.icmp.type === 'unreach' || pkt.icmp.type === 'ttl-exceeded')) return;
  if (type === 'unreach') {
    const now = net.now();
    if (now - dev.st.unreachAt < 500) return;
    dev.st.unreachAt = now;
  }
  const l = dev.l3.get(inIf);
  const src = l && l.ip !== null ? l.ip : null;
  const orig = { src: pkt.src, dst: pkt.dst, proto: pkt.proto, sport: pkt.sport, dport: pkt.dport, icmp: pkt.icmp };
  originate(net, dev, { src, dst: pkt.src, proto: 'icmp', icmp: { type, code, orig } }, { wait: true });
}

function ipInput(net, dev, ifName, pktIn, frame) {
  let pkt = pktIn;
  const host = isHost(dev);
  if (host) {
    if (pkt.dst === dev.nic.ip || pkt.dst === BCAST || (pkt.proto === 'udp' && pkt.dport === 68)) localDeliver(net, dev, ifName, pkt);
    return;
  }
  const l = dev.l3.get(ifName);
  if (l.cfg.aclIn && !aclPermits(dev, l.cfg.aclIn, pkt)) {
    sendIcmpError(net, dev, ifName, pkt, 'unreach', 13);
    return;
  }
  if (l.cfg.nat === 'outside') pkt = natInbound(net, dev, pkt);
  const bcast = pkt.dst === BCAST || (l.ip !== null && pkt.dst === ((netOf(l.ip, l.mask) | (~l.mask >>> 0)) >>> 0));
  if (bcast || ownsIp(net, dev, pkt.dst, ifName)) { localDeliver(net, dev, ifName, pkt, frame); return; }
  if (!routingEnabled(dev)) return;
  if (pkt.ttl <= 1) { sendIcmpError(net, dev, ifName, pkt, 'ttl-exceeded', 0); return; }
  const r = routeFor(net, dev, pkt.dst);
  if (r.error) { sendIcmpError(net, dev, ifName, pkt, 'unreach', 0); return; }
  const out = dev.l3.get(r.ifName);
  let fwd = { ...pkt, ttl: pkt.ttl - 1 };
  if (l.cfg.nat === 'inside' && out.cfg.nat === 'outside') {
    const t = natOutbound(net, dev, fwd, r.ifName);
    if (t === null) return;
    fwd = t;
  }
  if (out.cfg.aclOut && !aclPermits(dev, out.cfg.aclOut, fwd)) {
    sendIcmpError(net, dev, ifName, pkt, 'unreach', 13);
    return;
  }
  deliverOut(net, dev, r.ifName, r.nh, fwd, { wait: false });
}

function recordProbe(net, dev, pkt) {
  const ic = pkt.icmp;
  if (pkt.proto === 'icmp' && ic.type === 'echo-reply') {
    net.probes.set(`e:${ic.id}:${ic.seq}`, { dev: dev.name, type: 'reply', from: pkt.src, ttl: pkt.ttl });
  } else if (pkt.proto === 'icmp' && (ic.type === 'unreach' || ic.type === 'ttl-exceeded')) {
    const o = ic.orig;
    const key = o.proto === 'icmp' ? `e:${o.icmp.id}:${o.icmp.seq}` : o.proto === 'udp' ? `u:${o.sport}` : `t:${o.sport}`;
    net.probes.set(key, { dev: dev.name, type: ic.type, code: ic.code, from: pkt.src, ttl: pkt.ttl });
  } else if (pkt.proto === 'tcp') {
    net.probes.set(`t:${pkt.dport}`, { dev: dev.name, type: pkt.flags === 'SA' ? 'synack' : 'rst', from: pkt.src });
  }
}

function tcpListening(net, dev, port, srcIp) {
  if (isHost(dev)) return dev.services.has(port);
  if (port !== 22 && port !== 23) return false;
  const vty = dev.cfg.lines.vty;
  const t = vty.transport || 'all';
  if (vty.accessClass && !aclPermits(dev, vty.accessClass, { af: 4, proto: 'ip', src: srcIp, dst: 0 })) return false;
  if (port === 22) return !!dev.cfg.rsa && (t === 'all' || t.includes('ssh'));
  return t === 'all' || t.includes('telnet');
}

function localDeliver(net, dev, ifName, pkt) {
  if (pkt.proto === 'icmp') {
    const ic = pkt.icmp;
    if (ic.type === 'echo') {
      originate(net, dev, { src: pkt.dst === BCAST ? null : pkt.dst, dst: pkt.src, proto: 'icmp', icmp: { type: 'echo-reply', id: ic.id, seq: ic.seq } }, { wait: true });
      return;
    }
    recordProbe(net, dev, pkt);
    return;
  }
  if (pkt.proto === 'udp') {
    if (pkt.dport === 67 || pkt.dport === 68) { dhcpServe(net, dev, ifName, pkt); return; }
    if (pkt.dport >= 33434) {
      sendIcmpError(net, dev, ifName || 'eth0', pkt, 'unreach', 3);
      return;
    }
    return;
  }
  if (pkt.proto === 'tcp') {
    if (pkt.flags === 'S') {
      const open = tcpListening(net, dev, pkt.dport, pkt.src);
      originate(net, dev, { src: pkt.dst, dst: pkt.src, proto: 'tcp', sport: pkt.dport, dport: pkt.sport, flags: open ? 'SA' : 'R' }, { wait: true });
      return;
    }
    recordProbe(net, dev, pkt);
  }
}

// ---------- IPv6 (simplified ND, no DAD) ----------
function ndInput(net, dev, ifName, frame) {
  const n = frame.nd;
  const l = dev.l3.get(ifName);
  if (!l) return;
  if (n.op === 'na') { dev.st.nd.set(String(n.target), { mac: n.mac, ifName }); return; }
  const mine = l.ll === n.target || l.v6.some((a) => a.addr === n.target);
  if (!mine) return;
  dev.st.nd.set(String(n.src), { mac: n.mac, ifName });
  l3Transmit(net, dev, ifName, { src: l.mac, dst: n.mac, type: 'nd', nd: { op: 'na', target: n.target, mac: l.mac } });
}

function ndResolve(net, dev, ifName, nh) {
  const k = String(nh);
  if (dev.st.nd.has(k)) return dev.st.nd.get(k).mac;
  const l = dev.l3.get(ifName);
  const src = l.v6.length ? l.v6[0].addr : l.ll;
  l3Transmit(net, dev, ifName, { src: l.mac, dst: '3333.ff00.0001', type: 'nd', nd: { op: 'ns', target: nh, src, mac: l.mac } });
  return dev.st.nd.has(k) ? dev.st.nd.get(k).mac : null;
}

export function route6For(net, dev, dst) {
  if (isHost(dev)) {
    const l = dev.l3.get('eth0');
    if (!l.up) return { error: 'noip' };
    if ((dst >> 118n) === (0xfe80n >> 6n)) return { ifName: 'eth0', nh: dst };
    if (l.v6.some((a) => (dst & mask6(a.len)) === (a.addr & mask6(a.len)))) return { ifName: 'eth0', nh: dst };
    const gw = dev.nic.gw6;
    if (gw === null || gw === undefined) return { error: 'nogw' };
    return { ifName: 'eth0', nh: gw };
  }
  const r = lpm6(dev.rib6 || [], dst);
  if (!r) return { error: 'noroute' };
  if (r.proto === 'L') return { local: true };
  const p = r.paths[0];
  return { ifName: p.ifName, nh: p.nh === null || p.nh === undefined ? dst : p.nh };
}

function src6For(l, dst) {
  if ((dst >> 118n) === (0xfe80n >> 6n)) return l.ll;
  return l.v6.length ? l.v6[0].addr : l.ll;
}

export function originate6(net, dev, pkt) {
  if (ownsIp6(dev, pkt.dst)) { local6(net, dev, { hlim: 64, ...pkt, src: pkt.src ?? pkt.dst }); return 'sent'; }
  const r = route6For(net, dev, pkt.dst);
  if (r.error) return r.error;
  const l = dev.l3.get(r.ifName);
  if (!l || !l.up) return 'noroute';
  const full = { hlim: isHost(dev) ? 128 : 64, ...pkt, src: pkt.src ?? src6For(l, pkt.dst) };
  const mac = ndResolve(net, dev, r.ifName, r.nh);
  if (!mac) return 'arp-fail';
  l3Transmit(net, dev, r.ifName, { src: l.mac, dst: mac, type: 'ip6', ip: full });
  return 'sent';
}

function local6(net, dev, pkt) {
  const ic = pkt.icmp;
  if (ic.type === 'echo') { originate6(net, dev, { src: pkt.dst, dst: pkt.src, proto: 'icmp6', icmp: { type: 'echo-reply', id: ic.id, seq: ic.seq } }); return; }
  if (ic.type === 'echo-reply') net.probes.set(`e6:${ic.id}:${ic.seq}`, { dev: dev.name, type: 'reply', from: pkt.src, ttl: pkt.hlim });
  else if (ic.orig) net.probes.set(`e6:${ic.orig.icmp.id}:${ic.orig.icmp.seq}`, { dev: dev.name, type: ic.type, from: pkt.src, ttl: pkt.hlim });
}

function ip6Input(net, dev, ifName, pkt) {
  if (ownsIp6(dev, pkt.dst)) { local6(net, dev, pkt); return; }
  if (isHost(dev) || !dev.cfg.ipv6Routing) return;
  const l = dev.l3.get(ifName);
  if (pkt.hlim <= 1) {
    originate6(net, dev, { src: src6For(l, pkt.src), dst: pkt.src, proto: 'icmp6', icmp: { type: 'ttl-exceeded', orig: pkt } });
    return;
  }
  const r = route6For(net, dev, pkt.dst);
  if (r.error || r.local) {
    if (r.error) originate6(net, dev, { src: src6For(l, pkt.src), dst: pkt.src, proto: 'icmp6', icmp: { type: 'unreach', orig: pkt } });
    return;
  }
  const mac = ndResolve(net, dev, r.ifName, r.nh);
  if (!mac) return;
  const out = dev.l3.get(r.ifName);
  l3Transmit(net, dev, r.ifName, { src: out.mac, dst: mac, type: 'ip6', ip: { ...pkt, hlim: pkt.hlim - 1 } });
}

export { ipStr };
