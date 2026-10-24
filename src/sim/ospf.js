// OSPFv2 (IPv4) and OSPFv3 (IPv6) single-area model: interface enablement,
// neighbour adjacency rules (area, subnet/mask, hello/dead, passive, MTU,
// duplicate RID, ACLs), non-preemptive DR/BDR election and Dijkstra SPF.

import { netOf, maskToLen, ipStr, mask6, parseIp } from './util.js';
import { isLoopback } from './ifnames.js';
import { isHost } from './device.js';
import { aclPermits } from './acl.js';
import { hasDefaultRoute } from './routing.js';

const BW_KBPS = (dev, l) => {
  if (l.cfg.bandwidth) return l.cfg.bandwidth;
  if (isLoopback(l.name)) return 8000000;
  const l1 = dev.l1.get(l.phys);
  const sp = l1 && l1.speed ? l1.speed : 1000;
  if (l.name.startsWith('Port-channel')) {
    const ch = dev.chan.get(Number(l.name.slice(12)));
    const n = ch ? [...ch.members.values()].filter((f) => f === 'P').length : 1;
    return 1000000 * Math.max(1, n);
  }
  return sp * 1000;
};

function procs(dev, af) { return af === 4 ? dev.cfg.ospf : dev.cfg.ospf6; }

function matchNetwork(proc, ip) {
  let best = null;
  for (const n of proc.networks) {
    const m = (~n.wild) >>> 0;
    if (netOf(ip, m) === netOf(n.ip, m)) {
      const bits = 32 - maskToLen(n.wild === 0 ? 0 : (~n.wild) >>> 0);
      if (!best || bits < best.bits) best = { n, bits };
    }
  }
  return best ? best.n : null;
}

export function ospfCost(dev, l, proc, af) {
  const c = af === 4 ? l.cfg.ospf.cost : (l.cfg.ospf6.cost ?? l.cfg.ospf.cost);
  if (c) return c;
  const ref = (proc.refBw || 100) * 1000;
  return Math.max(1, Math.floor(ref / BW_KBPS(dev, l)));
}

/** List OSPF interfaces of a device for one address family. */
export function ospfInterfaces(dev, af) {
  const out = [];
  if (isHost(dev)) return out;
  const ps = procs(dev, af);
  if (!ps || ps.size === 0) return out;
  for (const l of dev.l3.values()) {
    if (!l.l3) continue;
    let pid = null; let area = null; let viaIf = false; let areaFmt = null;
    if (af === 4) {
      if (l.cfg.ospf.area && ps.has(l.cfg.ospf.area.pid)) {
        ({ pid, area, areaFmt } = l.cfg.ospf.area); viaIf = true;
      } else if (l.ip !== null) {
        for (const [p, proc] of [...ps.entries()].sort((a, b) => a[0] - b[0])) {
          const n = matchNetwork(proc, l.ip);
          if (n) { pid = p; area = n.area; areaFmt = n.areaFmt; break; }
        }
      }
      if (pid === null || l.ip === null) continue;
    } else {
      if (!l.cfg.ospf6.area || !ps.has(l.cfg.ospf6.area.pid)) continue;
      ({ pid, area, areaFmt } = l.cfg.ospf6.area); viaIf = true;
      if (l.ll === null) continue;
    }
    const proc = ps.get(pid);
    const netType = l.cfg.ospf.netType || (isLoopback(l.name) ? 'LOOPBACK' : 'BROADCAST');
    const hello = l.cfg.ospf.hello ?? (netType === 'NON_BROADCAST' ? 30 : 10);
    const passive = proc.passiveDefault ? !proc.nonPassive.has(l.name) : proc.passive.has(l.name);
    out.push({
      dev, l, pid, area, areaFmt: areaFmt || 'dec', viaIf, proc, netType, hello,
      dead: l.cfg.ospf.dead ?? hello * 4, priority: af === 4 ? l.cfg.ospf.priority : l.cfg.ospf6.priority,
      cost: ospfCost(dev, l, proc, af), passive, mtu: l.cfg.ipMtu ?? l.cfg.mtu,
    });
  }
  return out;
}

function pickRid(dev, af) {
  const loops = [...dev.l3.values()].filter((l) => isLoopback(l.name) && l.up && l.ip !== null).map((l) => l.ip);
  if (loops.length) return Math.max(...loops);
  const all = [...dev.l3.values()].filter((l) => l.up && l.ip !== null).map((l) => l.ip);
  return all.length ? Math.max(...all) : null;
}

/** Router ID per process (sticky until 'clear ip ospf process'). */
export function routerId(dev, pid, af) {
  const key = `${af}:${pid}`;
  dev.st.rids = dev.st.rids || new Map();
  const proc = procs(dev, af).get(pid);
  if (!proc) return null;
  if (dev.st.rids.has(key) && dev.st.rids.get(key) !== null) return dev.st.rids.get(key);
  const rid = proc.rid !== null && proc.rid !== undefined ? proc.rid : pickRid(dev, af);
  dev.st.rids.set(key, rid);
  return rid;
}

function sameSubnet(a, b) {
  if (a.l.mask !== b.l.mask) return 'mask';
  return netOf(a.l.ip, a.l.mask) === netOf(b.l.ip, b.l.mask) ? 'ok' : 'subnet';
}

function aclAllows(oi, peerIp, af) {
  if (af !== 4) return true;
  const acl = oi.l.cfg.aclIn;
  if (!acl) return true;
  return aclPermits(oi.dev, acl, { af: 4, proto: 'ospf', src: peerIp, dst: parseIp('224.0.0.5') }, false);
}

/** Pairwise hello check result: 'ok' | reason string. */
function helloCheck(a, b, af) {
  if (a.passive || b.passive) return 'passive';
  if (a.area !== b.area) return 'area';
  if (af === 4 && a.netType !== 'POINT_TO_POINT' && b.netType !== 'POINT_TO_POINT' && sameSubnet(a, b) !== 'ok') return 'subnet';
  if (af === 4 && sameSubnet(a, b) === 'subnet') return 'subnet';
  if (a.hello !== b.hello || a.dead !== b.dead) return 'timers';
  const p2pA = a.netType === 'POINT_TO_POINT'; const p2pB = b.netType === 'POINT_TO_POINT';
  if (p2pA !== p2pB) return 'nettype';
  if (!aclAllows(a, b.l.ip, af) || !aclAllows(b, a.l.ip, af)) return 'acl';
  return 'ok';
}

/**
 * Run OSPF for one address family across the network.
 * Returns { routes: Map devName -> routes[], nbrs: Map devName -> nbr[], ifs: Map devName -> ospf ifs }.
 */
export function computeOspf(net, af) {
  const ifsByDev = new Map();
  for (const dev of net.devices.values()) ifsByDev.set(dev.name, ospfInterfaces(dev, af));
  const rid = (oi) => routerId(oi.dev, oi.pid, af);
  const nbrs = new Map([...net.devices.keys()].map((n) => [n, []]));
  const segState = af === 4 ? net.ospfDr : net.ospf6Dr;
  const ifInfo = new Map();
  const dups = [];
  // ---- hello / 2-way ----
  for (const [, list] of ifsByDev) {
    for (const oi of list) {
      oi.rid = rid(oi);
      oi.peers = [];
      ifInfo.set(`${oi.dev.name}|${oi.l.name}`, oi);
    }
  }
  for (const [, list] of ifsByDev) {
    for (const oi of list) {
      if (!oi.l.up || oi.netType === 'LOOPBACK' || oi.rid === null) continue;
      const domain = net.l2Domain(oi.dev, oi.l.name);
      for (const ep of domain) {
        const other = ifInfo.get(`${ep.dev.name}|${ep.ifName}`);
        if (!other || other.dev === oi.dev || !other.l.up || other.rid === null || other.netType === 'LOOPBACK') continue;
        const r = helloCheck(oi, other, af);
        if (r !== 'ok') continue;
        if (other.rid === oi.rid) { dups.push({ oi, other }); continue; }
        oi.peers.push(other);
      }
    }
  }
  // ---- DR election per broadcast segment ----
  const seen = new Set();
  for (const [, list] of ifsByDev) {
    for (const oi of list) {
      if (!oi.l.up || oi.netType !== 'BROADCAST' || oi.passive || oi.rid === null) {
        if (oi.netType === 'BROADCAST' && oi.l.up && oi.passive) { oi.drState = 'DR'; oi.dr = oi; }
        continue;
      }
      const key = `${oi.dev.name}|${oi.l.name}`;
      if (seen.has(key)) continue;
      const seg = [oi];
      for (let i = 0; i < seg.length; i += 1) {
        seg[i].peers.forEach((p) => { if (!seg.includes(p) && p.netType === 'BROADCAST') seg.push(p); });
      }
      seg.forEach((s) => seen.add(`${s.dev.name}|${s.l.name}`));
      elect(seg, segState, af);
    }
  }
  // ---- adjacency states ----
  for (const [, list] of ifsByDev) {
    for (const oi of list) {
      for (const p of oi.peers) {
        let state;
        if (oi.netType === 'POINT_TO_POINT') state = 'FULL';
        else {
          const dr = [oi.dr, oi.bdr];
          state = dr.includes(oi) || dr.includes(p) ? 'FULL' : '2WAY';
        }
        if (state === 'FULL' && !oi.l.cfg.ospf.mtuIgnore && oi.mtu !== p.mtu && af === 4) state = oi.mtu > p.mtu ? 'EXSTART' : 'EXCHANGE';
        if (state === 'FULL' && af === 4 && oi.mtu !== p.mtu && p.l.cfg.ospf.mtuIgnore && !oi.l.cfg.ospf.mtuIgnore) state = 'EXSTART';
        const role = oi.netType === 'POINT_TO_POINT' ? '-' : p === oi.dr ? 'DR' : p === oi.bdr ? 'BDR' : 'DROTHER';
        nbrs.get(oi.dev.name).push({
          rid: p.rid, pri: p.priority, state, role, ip: af === 4 ? p.l.ip : p.l.ll, ifName: oi.l.name,
          peerDev: p.dev.name, peerIf: p.l.name, pid: oi.pid, dead: p.dead, oi, p,
        });
      }
    }
  }
  const routes = new Map();
  for (const dev of net.devices.values()) routes.set(dev.name, spf(net, dev, ifsByDev, nbrs, af));
  return { routes, nbrs, ifs: ifsByDev, dups };
}

function better(a, b) {
  if (a.priority !== b.priority) return a.priority > b.priority;
  return a.rid > b.rid;
}

function elect(seg, segState, af) {
  const key = seg.map((s) => `${s.dev.name}|${s.l.name}`).sort()[0];
  const subnetKey = af === 4 ? `${seg[0].area}|${ipStr(netOf(seg[0].l.ip, seg[0].l.mask))}/${maskToLen(seg[0].l.mask)}` : `${seg[0].area}|${key}`;
  const prev = segState.get(subnetKey) || {};
  const id = (s) => `${s.dev.name}|${s.l.name}`;
  const valid = (k) => seg.find((s) => id(s) === k && s.priority > 0) || null;
  const eligible = seg.filter((s) => s.priority > 0);
  const best = (list) => list.reduce((a, b) => (a === null || better(b, a) ? b : a), null);
  let dr = prev.dr ? valid(prev.dr) : null;
  let bdr = prev.bdr ? valid(prev.bdr) : null;
  if (!dr && bdr) { dr = bdr; bdr = null; }
  if (!dr) dr = best(eligible);
  if (bdr === dr) bdr = null;
  if (!bdr) bdr = best(eligible.filter((s) => s !== dr));
  segState.set(subnetKey, { dr: dr ? id(dr) : null, bdr: bdr ? id(bdr) : null });
  seg.forEach((s) => {
    s.dr = dr; s.bdr = bdr;
    s.drState = s === dr ? 'DR' : s === bdr ? 'BDR' : s.priority === 0 ? 'DROTHER' : 'DROTHER';
  });
}

function prefixesOf(oi, af) {
  if (!oi.l.up) return [];
  if (af === 4) {
    const len = oi.netType === 'LOOPBACK' ? 32 : maskToLen(oi.l.mask);
    const net = oi.netType === 'LOOPBACK' ? oi.l.ip : netOf(oi.l.ip, oi.l.mask);
    return [{ net, len, cost: oi.netType === 'LOOPBACK' ? 1 : oi.cost }];
  }
  return oi.l.v6.map((a) => (oi.netType === 'LOOPBACK'
    ? { net: a.addr, len: 128, cost: 0 }
    : { net: a.addr & mask6(a.len), len: a.len, cost: oi.cost }));
}

function spf(net, self, ifsByDev, nbrs, af) {
  const myIfs = ifsByDev.get(self.name) || [];
  if (myIfs.length === 0) return [];
  // Edges: devName -> [{to, cost, nhIp, ifName}]
  const edges = new Map();
  const addEdge = (from, e) => { if (!edges.has(from)) edges.set(from, []); edges.get(from).push(e); };
  for (const [devName, list] of nbrs) {
    for (const n of list) {
      if (n.state !== 'FULL') continue;
      if (n.oi.netType === 'POINT_TO_POINT') {
        const back = nbrs.get(n.peerDev).some((m) => m.peerDev === devName && m.state === 'FULL');
        if (back) addEdge(devName, { to: n.peerDev, cost: n.oi.cost, nh: n.ip, ifName: n.ifName });
      }
    }
  }
  // broadcast transit segments: members FULL with DR
  const segs = new Map();
  for (const list of ifsByDev.values()) {
    for (const oi of list) {
      if (oi.netType !== 'BROADCAST' || !oi.dr || !oi.l.up || oi.passive) continue;
      const k = `${oi.dr.dev.name}|${oi.dr.l.name}`;
      if (!segs.has(k)) segs.set(k, []);
      segs.get(k).push(oi);
    }
  }
  for (const members of segs.values()) {
    const dr = members[0].dr;
    const attached = members.filter((m) => m === dr || nbrs.get(m.dev.name).some((n) => n.p === dr && n.oi === m && n.state === 'FULL'));
    if (attached.length < 2) continue;
    for (const a of attached) {
      for (const b of attached) {
        if (a === b || a.dev === b.dev) continue;
        addEdge(a.dev.name, { to: b.dev.name, cost: a.cost, nh: af === 4 ? b.l.ip : b.l.ll, ifName: a.l.name });
      }
    }
  }
  // Dijkstra
  const dist = new Map([[self.name, 0]]);
  const hops = new Map([[self.name, []]]);
  const done = new Set();
  for (;;) {
    let u = null;
    for (const [k, d] of dist) if (!done.has(k) && (u === null || d < dist.get(u))) u = k;
    if (u === null) break;
    done.add(u);
    for (const e of edges.get(u) || []) {
      const nd = dist.get(u) + e.cost;
      const nh = u === self.name ? [{ nh: e.nh, ifName: e.ifName }] : hops.get(u);
      if (!dist.has(e.to) || nd < dist.get(e.to)) { dist.set(e.to, nd); hops.set(e.to, [...nh]); } else if (nd === dist.get(e.to) && !done.has(e.to)) {
        const cur = hops.get(e.to);
        nh.forEach((h) => { if (!cur.some((c) => c.nh === h.nh && c.ifName === h.ifName)) cur.push(h); });
      }
    }
  }
  const best = new Map();
  for (const [devName, list] of ifsByDev) {
    if (devName === self.name || !dist.has(devName)) continue;
    for (const oi of list) {
      for (const p of prefixesOf(oi, af)) {
        const key = `${p.net}/${p.len}`;
        const cost = dist.get(devName) + p.cost;
        const cur = best.get(key);
        if (!cur || cost < cur.metric) best.set(key, { af, net: p.net, len: p.len, proto: 'O', ad: 110, metric: cost, paths: [...hops.get(devName)], key, from: devName, fromRid: oi.rid });
        else if (cost === cur.metric) hops.get(devName).forEach((h) => { if (!cur.paths.some((c) => c.nh === h.nh)) cur.paths.push(h); });
      }
    }
  }
  // type-5 default from ASBRs
  if (af === 4) {
    let asbr = null;
    for (const dev of net.devices.values()) {
      if (dev === self || !dist.has(dev.name) || isHost(dev)) continue;
      for (const proc of dev.cfg.ospf.values()) {
        if (!proc.defaultInfo) continue;
        if (!proc.defaultInfo.always && !hasDefaultRoute(dev)) continue;
        if (!asbr || dist.get(dev.name) < dist.get(asbr.dev.name)) asbr = { dev, metric: proc.defaultInfo.metric ?? 1, type: proc.defaultInfo.type ?? 2 };
      }
    }
    if (asbr) {
      const metric = asbr.type === 1 ? asbr.metric + dist.get(asbr.dev.name) : asbr.metric;
      best.set('0/0', { af, net: 0, len: 0, proto: asbr.type === 1 ? 'E1' : 'E2', ad: 110, metric, paths: [...hops.get(asbr.dev.name)], key: '0/0', from: asbr.dev.name, fromRid: (ifsByDev.get(asbr.dev.name)[0] || {}).rid, fwdCost: dist.get(asbr.dev.name) });
    }
  }
  return [...best.values()].filter((r) => r.paths.length > 0);
}
