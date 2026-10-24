// HSRP election (non-preemptive unless `standby N preempt`), CDP/LLDP
// neighbour discovery and CDP mismatch notifications.

import { isIos } from './device.js';
import { shortIf } from './ifnames.js';
import { ipStr } from './util.js';

export function hsrpVmac(version, grp) {
  if (version === 2) return `0000.0c9f.f${grp.toString(16).padStart(3, '0')}`;
  return `0000.0c07.ac${grp.toString(16).padStart(2, '0')}`;
}

function participants(net) {
  const out = [];
  for (const dev of net.devices.values()) {
    if (!isIos(dev)) continue;
    for (const l of dev.l3.values()) {
      if (!l.l3 || !l.cfg.standby.size) continue;
      for (const [grp, g] of l.cfg.standby) {
        out.push({ dev, l, grp, g, version: l.cfg.standbyVersion, prio: g.priority, preempt: g.preempt, up: l.up && l.ip !== null });
      }
    }
  }
  return out;
}

function better(a, b) {
  if (a.prio !== b.prio) return a.prio > b.prio;
  return a.l.ip > b.l.ip;
}

export function computeHsrp(net) {
  const parts = participants(net);
  for (const dev of net.devices.values()) dev.hsrp = new Map();
  const id = (p) => `${p.dev.name}|${p.l.name}|${p.grp}`;
  const done = new Set();
  for (const p of parts) {
    if (done.has(id(p))) continue;
    const cluster = [p];
    if (p.up) {
      const domain = net.l2Domain(p.dev, p.l.name);
      parts.forEach((q) => {
        if (q === p || !q.up || q.grp !== p.grp || q.version !== p.version) return;
        if (domain.some((e) => e.dev === q.dev && e.ifName === q.l.name)) cluster.push(q);
      });
    }
    cluster.forEach((q) => done.add(id(q)));
    elect(net, cluster.filter((q) => q.up), id);
    cluster.filter((q) => !q.up).forEach((q) => {
      net.hsrpState.set(id(q), 'Init');
      q.dev.hsrp.set(`${q.l.name}|${q.grp}`, { state: 'Init', vip: q.g.ip, active: null, standby: null, vmac: hsrpVmac(q.version, q.grp), p: q });
    });
  }
}

function elect(net, cluster, id) {
  if (cluster.length === 0) return;
  const vip = cluster.map((q) => q.g.ip).find((x) => x !== null && x !== undefined) ?? null;
  const prevActive = cluster.find((q) => net.hsrpState.get(id(q)) === 'Active') || null;
  const best = cluster.reduce((a, b) => (better(b, a) ? b : a));
  let active = prevActive;
  if (!active || (best !== active && best.preempt && better(best, active))) active = best;
  const rest = cluster.filter((q) => q !== active);
  const standby = rest.length ? rest.reduce((a, b) => (better(b, a) ? b : a)) : null;
  for (const q of cluster) {
    let state = q === active ? 'Active' : q === standby ? 'Standby' : 'Listen';
    if (vip === null) state = 'Init';
    net.hsrpState.set(id(q), state);
    q.dev.hsrp.set(`${q.l.name}|${q.grp}`, {
      state, vip, active, standby, vmac: hsrpVmac(q.version, q.grp), p: q,
    });
  }
}

// ---------- CDP / LLDP ----------
export function computeDiscovery(net) {
  for (const dev of net.devices.values()) {
    dev.cdp = [];
    dev.lldp = [];
    if (!isIos(dev)) continue;
    for (const p of dev.hw.ports) {
      const l1 = dev.l1.get(p);
      if (!l1 || !l1.up || !isIos(l1.peer.dev)) continue;
      const peer = l1.peer;
      const mi = dev.cfg.interfaces.get(p);
      const pi = peer.dev.cfg.interfaces.get(peer.ifName);
      if (dev.cfg.cdp && peer.dev.cfg.cdp && mi.cdp && pi.cdp) dev.cdp.push({ local: p, dev: peer.dev, port: peer.ifName });
      if (dev.cfg.lldp && peer.dev.cfg.lldp && mi.lldpTx !== false && pi.lldpTx !== false && mi.lldpRx !== false) dev.lldp.push({ local: p, dev: peer.dev, port: peer.ifName });
    }
  }
}

/** CDP-derived warnings currently true (native VLAN / duplex mismatch). */
export function cdpWarnings(net) {
  const out = [];
  for (const dev of net.devices.values()) {
    if (!isIos(dev)) continue;
    for (const n of dev.cdp) {
      const myPort = dev.l2 && dev.l2.get(n.local);
      const theirPort = n.dev.l2 && n.dev.l2.get(n.port);
      // CDP's native-VLAN TLV carries the native VLAN on a trunk and the access VLAN on an access port.
      const cdpVlan = (p) => (!p || p.routed || !p.cfg.sw ? null : p.oper === 'trunk' ? p.cfg.sw.native : p.cfg.sw.access);
      const a = cdpVlan(myPort); const b = cdpVlan(theirPort);
      if (a !== null && b !== null) {
        if (a !== b) out.push({ dev, key: `nv|${n.local}|${a}|${b}`, msg: `%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on ${n.local} (${a}), with ${n.dev.cfg.hostname} ${n.port} (${b}).` });
      }
      const l1 = dev.l1.get(n.local);
      if (l1.dupMismatch && l1.duplex === 'half') {
        out.push({ dev, key: `dx|${n.local}`, msg: `%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on ${n.local} (not full duplex), with ${n.dev.cfg.hostname} ${n.port} (full duplex).` });
      }
    }
  }
  return out;
}

export function stpWarnings(net) {
  const out = [];
  for (const dev of net.devices.values()) {
    if (!dev.stp) continue;
    for (const [v, inst] of dev.stp) {
      for (const [port, r] of inst.ports) {
        if (!r.inc) continue;
        const vl = `VLAN${String(v).padStart(4, '0')}`;
        let msg;
        if (r.inc === 'PVID_P') msg = `%SPANTREE-2-BLOCK_PVID_PEER: Blocking ${port} on ${vl}. Inconsistent peer vlan.`;
        else if (r.inc === 'PVID_L') msg = `%SPANTREE-2-BLOCK_PVID_LOCAL: Blocking ${port} on ${vl}. Inconsistent local vlan.`;
        else if (r.inc === 'TYPE') msg = `%SPANTREE-7-BLOCK_PORT_TYPE: Blocking ${port} on ${vl}. Inconsistent port type.`;
        else msg = `%SPANTREE-2-ROOTGUARD_BLOCK: Root guard blocking port ${port} on ${vl}.`;
        out.push({ dev, key: `stp|${port}|${v}|${r.inc}`, msg });
      }
    }
  }
  return out;
}

/** OSPFv2 hellos from a neighbour using our own router ID (no adjacency forms). */
export function ospfWarnings(net) {
  return ((net.ospf && net.ospf.dups) || []).map(({ oi, other }) => ({
    dev: oi.dev,
    key: `ospfdup|${oi.l.name}|${other.dev.name}|${oi.rid}`,
    msg: `%OSPF-4-DUP_RTRID_NBR: OSPF detected duplicate router-id ${ipStr(oi.rid)} from ${ipStr(other.l.ip)} on interface ${oi.l.name}`,
  }));
}

export { shortIf };
