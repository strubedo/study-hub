// NAT / PAT on IOS: static, dynamic pool, and overload (interface or pool).

import { ipStr } from './util.js';
import { aclPermits } from './acl.js';

function portOf(pkt, dir) {
  if (pkt.proto === 'tcp' || pkt.proto === 'udp') return dir === 'src' ? pkt.sport : pkt.dport;
  if (pkt.proto === 'icmp' && pkt.icmp && pkt.icmp.id !== undefined) return pkt.icmp.id;
  return null;
}

function withPort(pkt, dir, port) {
  if (pkt.proto === 'tcp' || pkt.proto === 'udp') return dir === 'src' ? { ...pkt, sport: port } : { ...pkt, dport: port };
  if (pkt.proto === 'icmp' && pkt.icmp && pkt.icmp.id !== undefined) return { ...pkt, icmp: { ...pkt.icmp, id: port } };
  return pkt;
}

function globalFor(dev, rule, outIf) {
  if (rule.ifName) {
    const l = dev.l3.get(rule.ifName);
    return l && l.ip !== null ? [l.ip] : [];
  }
  const pool = dev.cfg.nat.pools.get(rule.pool);
  if (!pool) return [];
  const out = [];
  for (let a = pool.start; a <= pool.end && out.length < 1024; a += 1) out.push(a);
  return out;
}

function addEntry(net, dev, e) {
  dev.st.nat = [...dev.st.nat, { ...e, created: net.now() }];
  return e;
}

/** Translate inside->outside. Returns new packet, the same packet if untranslated, or null to drop. */
export function natOutbound(net, dev, pkt, outIf) {
  const proto = pkt.proto === 'icmp' || pkt.proto === 'tcp' || pkt.proto === 'udp' ? pkt.proto : null;
  const sp = portOf(pkt, 'src');
  const dp = portOf(pkt, 'dst');
  const existing = dev.st.nat.find((e) => e.proto === proto && e.il === pkt.src && e.ilp === sp && proto);
  if (existing) return withPort({ ...pkt, src: existing.ig }, 'src', existing.igp);
  const st = dev.cfg.nat.statics.find((s) => s.local === pkt.src);
  if (st) {
    if (!dev.st.nat.some((e) => e.static && e.il === st.local)) addEntry(net, dev, { proto: null, il: st.local, ig: st.global, static: true });
    if (proto) addEntry(net, dev, { proto, il: pkt.src, ilp: sp, ig: st.global, igp: sp, ol: pkt.dst, olp: dp });
    return { ...pkt, src: st.global };
  }
  for (const rule of dev.cfg.nat.dynamics) {
    if (!aclPermits(dev, rule.acl, pkt)) continue;
    const globals = globalFor(dev, rule, outIf);
    if (globals.length === 0) return null;
    if (rule.overload) {
      const ig = globals[0];
      let port = sp ?? 0;
      while (dev.st.nat.some((e) => e.proto === proto && e.ig === ig && e.igp === port)) port = port < 1024 ? 1024 : port + 1;
      addEntry(net, dev, { proto, il: pkt.src, ilp: sp, ig, igp: port, ol: pkt.dst, olp: dp });
      return withPort({ ...pkt, src: ig }, 'src', port);
    }
    let simple = dev.st.nat.find((e) => e.proto === null && !e.static && e.il === pkt.src);
    if (!simple) {
      const used = new Set(dev.st.nat.filter((e) => e.proto === null).map((e) => e.ig));
      const ig = globals.find((g) => !used.has(g));
      if (ig === undefined) { dev.st.natMisses = (dev.st.natMisses || 0) + 1; return null; }
      simple = addEntry(net, dev, { proto: null, il: pkt.src, ig });
    }
    return { ...pkt, src: simple.ig };
  }
  return pkt;
}

/** Translate outside->inside (destination). */
export function natInbound(net, dev, pkt) {
  if (pkt.proto === 'icmp' && pkt.icmp.orig) {
    const o = pkt.icmp.orig;
    const op = o.proto === 'icmp' ? o.icmp?.id : o.sport;
    const e = dev.st.nat.find((x) => x.proto === o.proto && x.ig === o.src && x.igp === op);
    if (e) {
      const orig = o.proto === 'icmp' ? { ...o, src: e.il, icmp: { ...o.icmp, id: e.ilp } } : { ...o, src: e.il, sport: e.ilp };
      return { ...pkt, dst: e.il, icmp: { ...pkt.icmp, orig } };
    }
  }
  const proto = pkt.proto;
  const dp = portOf(pkt, 'dst');
  const ext = dev.st.nat.find((e) => e.proto === proto && e.ig === pkt.dst && e.igp === dp);
  if (ext) return withPort({ ...pkt, dst: ext.il }, 'dst', ext.ilp);
  const simple = dev.st.nat.find((e) => e.proto === null && e.ig === pkt.dst);
  if (simple) return { ...pkt, dst: simple.il };
  const st = dev.cfg.nat.statics.find((s) => s.global === pkt.dst);
  if (st) return { ...pkt, dst: st.local };
  return pkt;
}

export function showNatTranslations(dev) {
  const fmt = (ip, port) => (ip === undefined || ip === null ? '---' : port === null || port === undefined ? ipStr(ip) : `${ipStr(ip)}:${port}`);
  const rows = ['Pro  Inside global         Inside local          Outside local         Outside global'];
  const list = [...dev.st.nat].sort((a, b) => (a.proto === null) - (b.proto === null));
  for (const e of list) {
    const pro = e.proto === null ? '---' : e.proto;
    rows.push(`${pro.padEnd(4)} ${fmt(e.ig, e.igp).padEnd(21)} ${fmt(e.il, e.ilp).padEnd(21)} ${fmt(e.ol, e.olp).padEnd(21)} ${fmt(e.ol, e.olp)}`);
  }
  // static entries that have not seen traffic still show up
  dev.cfg.nat.statics.forEach((s) => {
    if (!dev.st.nat.some((e) => e.static && e.il === s.local)) rows.push(`---  ${ipStr(s.global).padEnd(21)} ${ipStr(s.local).padEnd(21)} ---                   ---`);
  });
  rows.push(`Total number of translations: ${rows.length - 1}`);
  return rows.join('\n');
}
