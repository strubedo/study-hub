// Rapid PVST+: per-VLAN root election, port roles/states, PVID and port-type
// inconsistencies, root guard and BPDU guard.

import { isSwitch } from './device.js';
import { portVlans, portCost, portNumber } from './link.js';

export function bridgePrio(dev, v) {
  return (dev.cfg.stp.prio.has(v) ? dev.cfg.stp.prio.get(v) : 32768);
}

export function bidOf(dev, v) { return { prio: bridgePrio(dev, v) + v, mac: dev.baseMac }; }

export function cmpBid(a, b) {
  if (a.prio !== b.prio) return a.prio - b.prio;
  return a.mac < b.mac ? -1 : a.mac > b.mac ? 1 : 0;
}

function portId(dev, port) { return port.cfg.stp.prio * 4096 + portNumber(dev, port.name); }

function isEdgeCfg(dev, port) {
  if (port.oper === 'trunk') return port.cfg.stp.portfast === 'trunk';
  if (port.oper !== 'access') return false;
  return !!port.cfg.stp.portfast || dev.cfg.stp.portfastDefault;
}

function bpduguardOn(dev, port) {
  if (port.cfg.stp.bpduguard) return true;
  return dev.cfg.stp.bpduguardDefault && isEdgeCfg(dev, port);
}

/** Peer STP port (switch logical port speaking STP) or null. */
function stpPeer(port) {
  if (!port.peer || port.peer.host) return null;
  const pdev = port.peer.dev;
  if (!isSwitch(pdev)) return null;
  const pp = pdev.l2.get(port.peer.port);
  if (!pp || pp.routed) return null;
  return { dev: pdev, port: pp };
}

function buildVlanGraph(net, v, blockedRoot) {
  const nodes = [];
  const ports = [];
  for (const dev of net.devices.values()) {
    if (!isSwitch(dev) || !dev.cfg.vlans.has(v)) continue;
    const mine = [];
    for (const port of dev.l2.values()) {
      if (!port.up || port.routed) continue;
      const pv = portVlans(dev, port);
      if (!pv.all.has(v)) continue;
      mine.push(port);
    }
    if (mine.length || true) nodes.push({ dev, ports: mine });
  }
  const byDev = new Map(nodes.map((n) => [n.dev, n]));
  for (const n of nodes) {
    for (const port of n.ports) {
      const entry = { dev: n.dev, port, inc: null, nbr: null };
      const peer = stpPeer(port);
      if (peer) {
        const me = port.oper; const them = peer.port.oper;
        const ps = peer.port.cfg.sw; const s = port.cfg.sw;
        // PVID inconsistency is detected only between trunks (PVST+ SSTP BPDUs carry the VLAN ID).
        // Access ports in different VLANs are NOT blocked: the two VLANs' trees silently merge
        // (CDP logs a native VLAN mismatch instead; see services.js).
        if (me === 'trunk' && them === 'trunk' && s.native !== ps.native && (v === s.native || v === ps.native)) {
          entry.inc = v === s.native ? 'PVID_L' : 'PVID_P';
        } else if (me === 'access' && them === 'trunk') {
          entry.inc = 'TYPE';
        } else if (blockedRoot.has(`${n.dev.name}|${port.name}`)) {
          entry.inc = 'ROOT';
        } else {
          const pn = byDev.get(peer.dev);
          const carries = pn && pn.ports.includes(peer.port);
          if (carries && !(them === 'access' && me === 'trunk')) entry.nbr = { dev: peer.dev, port: peer.port };
        }
        entry.bpdus = true;
      }
      ports.push(entry);
    }
  }
  return { nodes, ports };
}

function solve(nodes, ports, v) {
  const dist = new Map();
  const bid = new Map(nodes.map((n) => [n.dev, bidOf(n.dev, v)]));
  // components
  const adj = new Map(nodes.map((n) => [n.dev, []]));
  ports.forEach((p) => { if (p.nbr) adj.get(p.dev).push(p); });
  const comp = new Map();
  nodes.forEach((n) => {
    if (comp.has(n.dev)) return;
    const members = [n.dev];
    comp.set(n.dev, members);
    for (let i = 0; i < members.length; i += 1) {
      adj.get(members[i]).forEach((p) => { if (!comp.has(p.nbr.dev)) { comp.set(p.nbr.dev, members); members.push(p.nbr.dev); } });
    }
  });
  const rootOf = new Map();
  new Set(comp.values()).forEach((members) => {
    const root = members.reduce((a, b) => (cmpBid(bid.get(b), bid.get(a)) < 0 ? b : a));
    members.forEach((m) => rootOf.set(m, root));
    dist.set(root, 0);
    const done = new Set();
    for (;;) {
      let best = null;
      members.forEach((m) => { if (!done.has(m) && dist.has(m) && (best === null || dist.get(m) < dist.get(best))) best = m; });
      if (best === null) break;
      done.add(best);
      // relax: neighbours of best receive BPDUs from best
      members.forEach((m) => {
        if (done.has(m)) return;
        adj.get(m).forEach((p) => {
          if (p.nbr.dev !== best) return;
          const c = dist.get(best) + portCost(m, p.port);
          if (!dist.has(m) || c < dist.get(m)) dist.set(m, c);
        });
      });
    }
  });
  return { dist, bid, rootOf, adj };
}

function computeVlan(net, v) {
  const blockedRoot = new Set();
  for (let iter = 0; iter < 8; iter += 1) {
    const { nodes, ports } = buildVlanGraph(net, v, blockedRoot);
    const { dist, bid, rootOf } = solve(nodes, ports, v);
    const rootPort = new Map();
    for (const n of nodes) {
      if (rootOf.get(n.dev) === n.dev) continue;
      let best = null; let bestKey = null;
      ports.filter((p) => p.dev === n.dev && p.nbr).forEach((p) => {
        const key = [dist.get(p.nbr.dev) + portCost(n.dev, p.port), bid.get(p.nbr.dev), portId(p.nbr.dev, p.nbr.port), portId(n.dev, p.port)];
        if (!best || cmpKey(key, bestKey) < 0) { best = p; bestKey = key; }
      });
      if (best) rootPort.set(n.dev, best.port.name);
    }
    const result = new Map();
    let newGuard = false;
    for (const p of ports) {
      const r = { role: 'Desg', state: 'FWD', cost: portCost(p.dev, p.port), prio: p.port.cfg.stp.prio, num: portNumber(p.dev, p.port.name), inc: p.inc, edge: false, peerBpdu: !!p.bpdus };
      if (p.inc) {
        r.state = 'BKN';
      } else if (p.nbr) {
        const mine = [dist.get(p.dev), bid.get(p.dev), portId(p.dev, p.port)];
        const theirs = [dist.get(p.nbr.dev), bid.get(p.nbr.dev), portId(p.nbr.dev, p.nbr.port)];
        if (cmpKey(mine, theirs) > 0) {
          r.role = rootPort.get(p.dev) === p.port.name ? 'Root' : 'Altn';
          r.state = r.role === 'Root' ? 'FWD' : 'BLK';
          if (p.port.cfg.stp.guard === 'root') { blockedRoot.add(`${p.dev.name}|${p.port.name}`); newGuard = true; }
        }
      } else {
        r.edge = isEdgeCfg(p.dev, p.port) && !p.bpdus;
      }
      if (!result.has(p.dev)) result.set(p.dev, new Map());
      result.get(p.dev).set(p.port.name, r);
    }
    if (newGuard) continue;
    return { nodes, result, dist, bid, rootOf, rootPort };
  }
  return null;
}

function cmpKey(a, b) {
  for (let i = 0; i < a.length; i += 1) {
    const x = a[i]; const y = b[i];
    const d = typeof x === 'object' ? cmpBid(x, y) : x - y;
    if (d !== 0) return d;
  }
  return 0;
}

/** Compute STP for every VLAN. Returns { errdisable: [...] } for BPDU guard hits. */
export function computeStp(net) {
  const errdisable = [];
  const vlans = new Set();
  for (const dev of net.devices.values()) {
    if (!isSwitch(dev)) continue;
    dev.stp = new Map();
    dev.cfg.vlans.forEach((_, v) => vlans.add(v));
    for (const port of dev.l2.values()) {
      if (!port.up || port.routed) continue;
      if (bpduguardOn(dev, port) && stpPeer(port)) errdisable.push({ dev, port });
    }
  }
  if (errdisable.length) return { errdisable };
  for (const v of [...vlans].sort((a, b) => a - b)) {
    const r = computeVlan(net, v);
    if (!r) continue;
    for (const n of r.nodes) {
      const root = r.rootOf.get(n.dev);
      n.dev.stp.set(v, {
        bid: r.bid.get(n.dev),
        rootBid: r.bid.get(root),
        isRoot: root === n.dev,
        rootCost: r.dist.get(n.dev) ?? 0,
        rootPort: r.rootPort.get(n.dev) || null,
        ports: r.result.get(n.dev) || new Map(),
      });
    }
  }
  return { errdisable };
}

/** Is a logical port forwarding for VLAN v on this switch? */
export function stpForwarding(dev, portName, v) {
  const inst = dev.stp && dev.stp.get(v);
  if (!inst) return false;
  const p = inst.ports.get(portName);
  return !!p && p.state === 'FWD';
}
