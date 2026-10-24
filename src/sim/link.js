// Layer 1 and link-layer control plane: physical link state, speed/duplex
// negotiation, EtherChannel bundling (LACP/PAgP/on) and DTP trunk negotiation.

import { isSwitch, isHost, isIos } from './device.js';

const SPEEDS = { 10: 10, 100: 100, 1000: 1000 };

function nicOf(dev, ifName) {
  if (isHost(dev)) return { speed: 'auto', duplex: 'auto', shutdown: false };
  return dev.cfg.interfaces.get(ifName);
}

function negotiate(a, b) {
  const autoA = a.speed === 'auto' && a.duplex === 'auto';
  const autoB = b.speed === 'auto' && b.duplex === 'auto';
  const fixed = (x) => {
    const sp = x.speed === 'auto' ? 1000 : SPEEDS[x.speed];
    const dx = x.duplex === 'auto' ? (sp >= 1000 ? 'full' : 'half') : x.duplex;
    return { speed: sp, duplex: dx };
  };
  if (autoA && autoB) return [{ speed: 1000, duplex: 'full', auto: true }, { speed: 1000, duplex: 'full', auto: true }, true];
  if (autoA !== autoB) {
    const f = fixed(autoA ? b : a);
    const neg = { speed: f.speed, duplex: f.speed >= 1000 ? 'full' : 'half', auto: true };
    const fx = { ...f, auto: false };
    return autoA ? [neg, fx, true] : [fx, neg, true];
  }
  const fa = fixed(a); const fb = fixed(b);
  return [{ ...fa, auto: false }, { ...fb, auto: false }, fa.speed === fb.speed];
}

/** Compute physical status for every physical port of every device. */
export function computeL1(net) {
  for (const dev of net.devices.values()) {
    dev.l1 = new Map();
    const ports = isHost(dev) ? ['eth0'] : dev.hw.ports;
    for (const p of ports) {
      const cfg = nicOf(dev, p);
      const peer = net.peer(dev.name, p);
      const err = isIos(dev) && dev.st.errDisabled.has(p);
      const st = { up: false, status: 'notconnect', speed: null, duplex: null, auto: true, dupMismatch: false, peer };
      if (cfg.shutdown) st.status = 'disabled';
      else if (err) st.status = 'err-disabled';
      else if (peer) {
        const pc = nicOf(peer.dev, peer.ifName);
        const perr = isIos(peer.dev) && peer.dev.st.errDisabled.has(peer.ifName);
        if (!pc.shutdown && !perr) {
          const [mine, theirs, ok] = negotiate(cfg, pc);
          if (ok) {
            Object.assign(st, { up: true, status: 'connected', speed: mine.speed, duplex: mine.duplex, auto: mine.auto });
            st.dupMismatch = mine.duplex !== theirs.duplex;
          }
        }
      }
      if (!st.up && cfg.speed !== 'auto') st.speed = Number(cfg.speed);
      dev.l1.set(p, st);
    }
  }
}

function lacpPair(a, b) {
  if (a === 'on' || b === 'on') return a === b ? 'on' : 'misconfig';
  const lacp = ['active', 'passive'];
  const pagp = ['desirable', 'auto'];
  if (lacp.includes(a) && lacp.includes(b)) return a === 'active' || b === 'active' ? 'LACP' : 'none';
  if (pagp.includes(a) && pagp.includes(b)) return a === 'desirable' || b === 'desirable' ? 'PAgP' : 'none';
  return 'none';
}

export function protoOfMode(mode) {
  if (mode === 'active' || mode === 'passive') return 'LACP';
  if (mode === 'desirable' || mode === 'auto') return 'PAgP';
  return '-';
}

function swSig(i) {
  if (!i.sw) return 'routed';
  const s = i.sw;
  return [s.mode, s.access, s.native, s.allowed ? [...s.allowed].sort((x, y) => x - y).join(',') : 'all'].join('|');
}

/** Bundle EtherChannel members. Returns list of new err-disable events. */
export function computeChannels(net) {
  const errs = [];
  for (const dev of net.devices.values()) {
    dev.chan = new Map();
    if (!isIos(dev)) continue;
    for (const [name, i] of dev.cfg.interfaces) {
      if (!i.channel) continue;
      const g = i.channel.group;
      if (!dev.chan.has(g)) dev.chan.set(g, { group: g, proto: protoOfMode(i.channel.mode), members: new Map(), po: `Port-channel${g}` });
      dev.chan.get(g).members.set(name, 'D');
    }
  }
  for (const dev of net.devices.values()) {
    for (const ch of dev.chan.values()) {
      const po = dev.cfg.interfaces.get(ch.po);
      const peerDevs = new Set();
      for (const m of ch.members.keys()) {
        const l1 = dev.l1.get(m);
        if (!l1 || !l1.up) { ch.members.set(m, 'D'); continue; }
        const mi = dev.cfg.interfaces.get(m);
        const peer = l1.peer;
        const pi = isIos(peer.dev) ? peer.dev.cfg.interfaces.get(peer.ifName) : null;
        const pmode = pi && pi.channel ? pi.channel.mode : null;
        const pair = pmode ? lacpPair(mi.channel.mode, pmode) : (mi.channel.mode === 'on' ? 'misconfig' : 'none');
        if (pair === 'misconfig') {
          if (mi.channel.mode === 'on') errs.push({ dev, ifName: m, reason: 'channel-misconfig (STP)', po: ch.po });
          ch.members.set(m, 'I');
          continue;
        }
        if (pair === 'none') { ch.members.set(m, 'I'); continue; }
        if (po && swSig(mi) !== swSig(po)) { ch.members.set(m, 's'); continue; }
        if (mi.speed !== (po ? po.speed : mi.speed)) { ch.members.set(m, 's'); continue; }
        peerDevs.add(`${peer.dev.name}|${pi.channel.group}`);
        ch.members.set(m, 'P');
      }
      if (peerDevs.size > 1) {
        // Members lead to different neighbours: only the first neighbour's links bundle.
        const first = [...peerDevs][0];
        for (const [m, f] of ch.members) {
          if (f !== 'P') continue;
          const peer = dev.l1.get(m).peer;
          const key = `${peer.dev.name}|${peer.dev.cfg.interfaces.get(peer.ifName).channel.group}`;
          if (key !== first) ch.members.set(m, 's');
        }
      }
      ch.up = [...ch.members.values()].includes('P') && !(po && po.shutdown);
    }
  }
  return errs;
}

export function bundleOf(dev, ifName) {
  if (!dev.chan) return null;
  for (const ch of dev.chan.values()) {
    if (ch.members.get(ifName) === 'P') return ch;
  }
  return null;
}

/** Logical switchport (phys or Po) the physical port belongs to for L2 purposes. */
export function logicalOf(dev, ifName) {
  const ch = bundleOf(dev, ifName);
  return ch ? ch.po : ifName;
}

function peerLogical(net, dev, port) {
  const firstMember = port.members[0];
  const l1 = dev.l1.get(firstMember);
  if (!l1 || !l1.up) return null;
  const peer = l1.peer;
  if (!isIos(peer.dev)) return { dev: peer.dev, port: peer.ifName, host: true };
  return { dev: peer.dev, port: logicalOf(peer.dev, peer.ifName) };
}

/** Build logical L2 ports for switches and resolve DTP operational modes. */
export function computeL2Ports(net) {
  for (const dev of net.devices.values()) {
    dev.l2 = new Map();
    if (!isSwitch(dev)) continue;
    for (const [name, i] of dev.cfg.interfaces) {
      if (!/Ethernet/.test(name)) continue;
      if (bundleOf(dev, name)) continue;
      const l1 = dev.l1.get(name);
      const flag = i.channel && dev.chan.get(i.channel.group) ? dev.chan.get(i.channel.group).members.get(name) : null;
      dev.l2.set(name, { name, members: [name], up: !!(l1 && l1.up) && flag !== 's', cfg: i, suspended: flag === 's' });
    }
    for (const ch of dev.chan.values()) {
      const po = dev.cfg.interfaces.get(ch.po);
      if (!po) continue;
      const members = [...ch.members.entries()].filter(([, f]) => f === 'P').map(([m]) => m);
      dev.l2.set(ch.po, { name: ch.po, members, up: ch.up, cfg: po, isPo: true });
    }
  }
  for (const dev of net.devices.values()) {
    for (const port of dev.l2.values()) {
      port.peer = port.up ? peerLogical(net, dev, port) : null;
      port.routed = !port.cfg.sw;
    }
  }
  for (const dev of net.devices.values()) {
    for (const port of dev.l2.values()) {
      if (port.routed) { port.oper = 'routed'; continue; }
      const s = port.cfg.sw;
      port.adminMode = s.mode;
      port.oper = operMode(port, s);
    }
  }
}

function peerSw(port) {
  if (!port.peer || port.peer.host) return null;
  const p = port.peer.dev.l2 && port.peer.dev.l2.get(port.peer.port);
  return p && !p.routed ? p.cfg.sw : null;
}

function operMode(port, s) {
  if (s.mode === 'access') return 'access';
  if (s.mode === 'trunk') return 'trunk';
  const ps = peerSw(port);
  if (!ps) return 'access';
  const peerSendsDtp = !ps.nonegotiate;
  if (s.mode === 'dynamic desirable') {
    if ((ps.mode === 'trunk' && peerSendsDtp) || ps.mode === 'dynamic desirable' || ps.mode === 'dynamic auto') return 'trunk';
    return 'access';
  }
  if ((ps.mode === 'trunk' && peerSendsDtp) || ps.mode === 'dynamic desirable') return 'trunk';
  return 'access';
}

/** VLANs a logical port carries: { untagged, tagged:Set } using only VLANs that exist locally. */
export function portVlans(dev, port) {
  const s = port.cfg.sw;
  if (!s || !port.up) return { untagged: null, tagged: new Set(), all: new Set() };
  if (port.oper === 'access') {
    const untagged = dev.cfg.vlans.has(s.access) ? s.access : null;
    const tagged = new Set(s.voice && dev.cfg.vlans.has(s.voice) ? [s.voice] : []);
    return { untagged, tagged, all: new Set([...(untagged ? [untagged] : []), ...tagged]) };
  }
  const allowed = [...dev.cfg.vlans.keys()].filter((v) => !s.allowed || s.allowed.has(v));
  const untagged = allowed.includes(s.native) ? s.native : null;
  const tagged = new Set(allowed.filter((v) => v !== s.native));
  return { untagged, tagged, all: new Set(allowed), native: s.native };
}

export function portCost(dev, port) {
  if (port.cfg.stp.cost) return port.cfg.stp.cost;
  const bw = port.members.reduce((sum, m) => sum + (dev.l1.get(m)?.speed || 1000), 0);
  if (bw >= 10000) return 2;
  if (bw >= 2000) return 3;
  if (bw >= 1000) return 4;
  if (bw >= 100) return 19;
  return 100;
}

export function portNumber(dev, name) {
  if (name.startsWith('Port-channel')) return 2080 + Number(name.slice(12));
  const idx = dev.hw.ports.indexOf(name);
  return idx + 1;
}
