// Frame-level data plane: transmit over links, 802.1Q tagging, VLAN
// switching with MAC learning, flooding within STP-forwarding ports,
// port security, DHCP snooping and Dynamic ARP Inspection.

import { isSwitch, isHost, ifMac } from './device.js';
import { logicalOf, portVlans } from './link.js';
import { stpForwarding } from './stp.js';
import { BROADCAST_MAC, ipStr } from './util.js';
import { shortIf } from './ifnames.js';

const MAX_HOPS = 48;

function counters(dev, phys) {
  if (!dev.st.counters) dev.st.counters = new Map();
  if (!dev.st.counters.has(phys)) dev.st.counters.set(phys, { inPkts: 0, outPkts: 0, inBytes: 0, outBytes: 0, inBcast: 0, outBcast: 0, inMcast: 0, crc: 0, late: 0, inDrops: 0 });
  return dev.st.counters.get(phys);
}

function frameSize(f) { return f.size || (f.type === 'arp' ? 64 : 114); }

/** Put a frame on the wire from a physical port. */
export function transmit(net, dev, phys, frame) {
  if ((frame.hops || 0) > MAX_HOPS) return;
  const l1 = dev.l1.get(phys);
  if (!l1 || !l1.up) return;
  if (!frame.probe) {
    const c = counters(dev, phys);
    c.outPkts += 1; c.outBytes += frameSize(frame);
    if (frame.dst === BROADCAST_MAC) c.outBcast += 1;
    if (l1.dupMismatch) {
      net.dupCounter = (net.dupCounter || 0) + 1;
      if (frame.type === 'ip' && net.dupCounter % 4 === 3) {
        const pc = counters(l1.peer.dev, l1.peer.ifName);
        if (l1.duplex === 'half') c.late += 1; else pc.crc += 1;
        return;
      }
    }
  }
  const peer = l1.peer;
  const next = { ...frame, hops: (frame.hops || 0) + 1 };
  receive(net, peer.dev, peer.ifName, next);
}

export function receive(net, dev, phys, frame) {
  if (!frame.probe) {
    const c = counters(dev, phys);
    c.inPkts += 1; c.inBytes += frameSize(frame);
    if (frame.dst === BROADCAST_MAC) c.inBcast += 1;
  }
  if (isHost(dev)) {
    if (frame.vlan !== null && frame.vlan !== undefined) return;
    if (frame.dst !== dev.mac && frame.dst !== BROADCAST_MAC && !frame.dst.startsWith('3333')) return;
    net.l3Input(dev, 'eth0', frame);
    return;
  }
  if (isSwitch(dev)) { switchInput(net, dev, phys, frame); return; }
  routerInput(net, dev, phys, frame);
}

function routerInput(net, dev, phys, frame) {
  let target = null;
  for (const l of dev.l3.values()) {
    if (l.phys !== phys || !l.up) continue;
    if (frame.vlan !== null && frame.vlan !== undefined) { if (l.tag === frame.vlan) target = l; } else if (l.name === phys && !l.cfg.encap) target = l;
    else if (l.nativeSub && l.cfg.encap) target = l;
  }
  if (!target && (frame.vlan === null || frame.vlan === undefined)) {
    const own = dev.l3.get(phys);
    if (own && own.up) target = own;
  }
  if (!target) return;
  if (!acceptsMac(net, dev, target, frame.dst)) return;
  net.l3Input(dev, target.name, frame);
}

function acceptsMac(net, dev, l, dst) {
  if (dst === BROADCAST_MAC || dst.startsWith('0100.5e') || dst.startsWith('3333')) return true;
  if (dst === l.mac) return true;
  return net.hsrpOwnsMac(dev, l.name, dst);
}

// ---------- switching ----------
function ingressVlan(port, frame) {
  const s = port.cfg.sw;
  const tagged = frame.vlan !== null && frame.vlan !== undefined;
  if (port.oper === 'access') {
    if (!tagged) return s.access;
    if (s.voice && frame.vlan === s.voice) return s.voice;
    if (frame.vlan === 0) return s.access;
    return null;
  }
  const v = tagged ? frame.vlan : s.native;
  if (s.allowed && !s.allowed.has(v)) return null;
  return v;
}

function switchInput(net, dev, phys, frame) {
  const logical = logicalOf(dev, phys);
  const port = dev.l2.get(logical);
  if (port && port.routed) {
    const l = dev.l3.get(logical);
    if (!l || !l.up || (frame.vlan !== null && frame.vlan !== undefined)) return;
    if (!acceptsMac(net, dev, l, frame.dst)) return;
    net.l3Input(dev, logical, frame);
    return;
  }
  if (!port || !port.up) return;
  const vlan = ingressVlan(port, frame);
  if (vlan === null || !dev.cfg.vlans.has(vlan)) return;
  if (!stpForwarding(dev, logical, vlan)) return;
  const f = { ...frame, vlan: null };
  if (!frame.probe) {
    if (!portSecurityOk(net, dev, port, f, vlan)) return;
    if (!snoopingOk(net, dev, port, f, vlan)) return;
    if (!daiOk(net, dev, port, f, vlan)) return;
    learn(dev, vlan, f.src, logical);
  }
  forwardInVlan(net, dev, vlan, frame.probe ? f : insertOption82(dev, port, f, vlan), logical);
}

export function learn(dev, vlan, mac, port) {
  if (mac === BROADCAST_MAC) return;
  const key = `${vlan}|${mac}`;
  const cur = dev.st.mac.get(key);
  if (cur && cur.type === 'STATIC' && cur.port === port) return;
  dev.st.mac.set(key, { vlan, mac, port, type: cur && cur.type === 'STATIC' && cur.port === port ? 'STATIC' : 'DYNAMIC' });
}

function sviMac(dev, vlan) { return ifMac(dev, `Vlan${vlan}`); }

/** Forward a frame inside a VLAN of switch `dev`. inPort=null when sourced by the switch itself (SVI). */
export function forwardInVlan(net, dev, vlan, frame, inPort) {
  const svi = dev.l3.get(`Vlan${vlan}`);
  const bcast = frame.dst === BROADCAST_MAC || frame.dst.startsWith('0100.5e') || frame.dst.startsWith('3333');
  if (inPort !== null && svi && svi.up) {
    if (bcast || frame.dst === sviMac(dev, vlan) || net.hsrpOwnsMac(dev, svi.name, frame.dst)) {
      net.l3Input(dev, svi.name, { ...frame });
      if (!bcast) return;
    }
  }
  if (!bcast) {
    const e = dev.st.mac.get(`${vlan}|${frame.dst}`);
    if (e && !frame.probe) {
      if (e.port !== inPort) egress(net, dev, dev.l2.get(e.port), vlan, frame);
      return;
    }
  }
  for (const port of dev.l2.values()) {
    if (port.name === inPort) continue;
    egress(net, dev, port, vlan, frame);
  }
}

function egress(net, dev, port, vlan, frame) {
  if (!port || !port.up || port.routed) return;
  if (!stpForwarding(dev, port.name, vlan)) return;
  const pv = portVlans(dev, port);
  let tag;
  if (pv.untagged === vlan) tag = null;
  else if (pv.tagged.has(vlan)) tag = vlan;
  else return;
  if (!frame.probe) recordSnoopBinding(net, dev, port, vlan, frame);
  const phys = port.members.find((m) => dev.l1.get(m)?.up) || port.members[0];
  transmit(net, dev, phys, { ...frame, vlan: tag });
}

// ---------- port security ----------
function psecState(dev, name) {
  if (!dev.st.psec.has(name)) dev.st.psec.set(name, { macs: new Set(), violations: 0, last: null });
  return dev.st.psec.get(name);
}

export function secureMacs(dev, name) {
  const i = dev.cfg.interfaces.get(name);
  const st = psecState(dev, name);
  const ps = i.psec || { static: [], stickyMacs: [] };
  return { static: ps.static || [], sticky: ps.stickyMacs || [], dynamic: [...st.macs] };
}

function portSecurityOk(net, dev, port, frame, vlan) {
  const ps = port.cfg.psec;
  if (!ps || !ps.enabled || port.isPo) return true;
  const st = psecState(dev, port.name);
  st.last = `${frame.src}:${vlan}`;
  const sec = secureMacs(dev, port.name);
  const all = [...sec.static.map((s) => s.mac), ...sec.sticky.map((s) => s.mac), ...sec.dynamic];
  if (all.includes(frame.src)) return true;
  if (all.length < ps.max) {
    if (ps.sticky) {
      ps.stickyMacs = [...ps.stickyMacs, { mac: frame.src, vlan }];
      net.configChanged(dev);
    } else st.macs.add(frame.src);
    return true;
  }
  // Protect mode drops silently: no syslog and no violation counter increment.
  if (ps.violation === 'protect') return false;
  st.violations += 1;
  if (ps.violation === 'restrict') {
    net.log(dev, `%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address ${frame.src} on port ${port.name}.`);
    return false;
  }
  net.log(dev, `%PM-4-ERR_DISABLE: psecure-violation error detected on ${shortIf(port.name)}, putting ${shortIf(port.name)} in err-disable state`);
  net.log(dev, `%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address ${frame.src} on port ${port.name}.`);
  net.errDisable(dev, port.name, 'psecure-violation');
  return false;
}

// ---------- DHCP snooping / DAI ----------
function snoopVlan(dev, vlan) { return dev.cfg.snooping.enabled && dev.cfg.snooping.vlans.has(vlan); }

function isDhcpServerMsg(frame) {
  const p = frame.ip;
  return frame.type === 'ip' && p && p.proto === 'udp' && p.sport === 67 && p.dport === 68;
}

function snoopingOk(net, dev, port, frame, vlan) {
  if (!snoopVlan(dev, vlan) || port.cfg.snoopTrust) return true;
  if (!isDhcpServerMsg(frame)) return true;
  const t = frame.ip.dhcp?.op === 'ack' ? 'DHCPACK' : 'DHCPOFFER';
  net.log(dev, `%DHCP_SNOOPING-5-DHCP_SNOOPING_UNTRUSTED_PORT: DHCP_SNOOPING drop message on untrusted port, message type: ${t}, MAC sa: ${frame.src}`);
  return false;
}

function recordSnoopBinding(net, dev, port, vlan, frame) {
  if (!snoopVlan(dev, vlan) || !isDhcpServerMsg(frame) || port.cfg.snoopTrust) return;
  const d = frame.ip.dhcp;
  if (!d || d.op !== 'ack') return;
  // A flooded ACK leaves through every port in the VLAN; bind it to the port the client is on.
  const client = dev.st.mac.get(`${vlan}|${d.chaddr}`);
  if (client && client.port !== port.name) return;
  dev.st.snoopBindings.set(d.chaddr, { mac: d.chaddr, ip: d.yiaddr, vlan, port: port.name, lease: d.lease });
}

function isDhcpClientMsg(frame) {
  const p = frame.ip;
  return frame.type === 'ip' && p && p.proto === 'udp' && p.sport === 68 && p.dport === 67 && !!p.dhcp;
}

/**
 * Snooping switches insert option 82 (with giaddr left at 0.0.0.0) into client
 * requests received on untrusted ports, unless `no ip dhcp snooping information option`.
 */
function insertOption82(dev, port, frame, vlan) {
  if (!snoopVlan(dev, vlan) || port.cfg.snoopTrust || !dev.cfg.snooping.option82) return frame;
  if (!isDhcpClientMsg(frame) || frame.ip.dhcp.giaddr || frame.ip.dhcp.opt82) return frame;
  return { ...frame, ip: { ...frame.ip, dhcp: { ...frame.ip.dhcp, opt82: true } } };
}

function daiOk(net, dev, port, frame, vlan) {
  if (frame.type !== 'arp' || !dev.cfg.dai.has(vlan) || port.cfg.daiTrust) return true;
  const a = frame.arp;
  const b = dev.st.snoopBindings.get(a.sha);
  if (b && b.ip === a.spa && b.vlan === vlan) return true;
  const op = a.op === 'req' ? 'Req' : 'Res';
  net.log(dev, `%SW_DAI-4-DHCP_SNOOPING_DENY: 1 Invalid ARPs (${op}) on ${shortIf(port.name)}, vlan ${vlan}.([${a.sha}/${ipStr(a.spa)}/${a.tha || '0000.0000.0000'}/${ipStr(a.tpa)}/${net.stamp()}])`);
  dev.st.daiDrops = (dev.st.daiDrops || 0) + 1;
  return false;
}

/** Send a frame sourced by an L3 interface of `dev`. */
export function l3Transmit(net, dev, ifName, frame) {
  if (isHost(dev)) { transmit(net, dev, 'eth0', frame); return; }
  const l = dev.l3.get(ifName);
  if (!l || !l.up) return;
  if (ifName.startsWith('Vlan')) {
    forwardInVlan(net, dev, Number(ifName.slice(4)), { ...frame, vlan: null }, null);
    return;
  }
  if (ifName.startsWith('Port-channel')) {
    const port = dev.l2.get(ifName);
    const phys = port ? port.members.find((m) => dev.l1.get(m)?.up) : null;
    if (phys) transmit(net, dev, phys, { ...frame, vlan: null });
    return;
  }
  transmit(net, dev, l.phys, { ...frame, vlan: l.tag });
}
