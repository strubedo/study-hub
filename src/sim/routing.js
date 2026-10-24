// L3 interface state and the routing table (RIB) for IPv4 and IPv6:
// connected, local, static (incl. floating and recursive), OSPF.

import { isSwitch, isHost, ifMac } from './device.js';
import { netOf, lenToMask, maskToLen, ip6Big, mask6, parseIp6, linkLocalFor, eui64 } from './util.js';
import { parentOf, isSubif, isLoopback, isSvi, isPortChannel } from './ifnames.js';
import { stpForwarding } from './stp.js';
import { portVlans } from './link.js';

function sviUp(dev, vlan) {
  if (!dev.cfg.vlans.has(vlan)) return 'novlan';
  for (const port of dev.l2.values()) {
    if (!port.up || port.routed) continue;
    if (portVlans(dev, port).all.has(vlan) && stpForwarding(dev, port.name, vlan)) return 'up';
  }
  return 'noports';
}

function ifStatus(dev, name, i) {
  const admin = i.shutdown;
  if (isLoopback(name)) return admin ? ['administratively down', 'down'] : ['up', 'up'];
  if (isSvi(name)) {
    if (admin) return ['administratively down', 'down'];
    const s = sviUp(dev, Number(name.slice(4)));
    if (s === 'up') return ['up', 'up'];
    return s === 'novlan' ? ['down', 'down'] : ['up', 'down'];
  }
  if (isSubif(name)) {
    const parent = dev.cfg.interfaces.get(parentOf(name));
    if (admin) return ['administratively down', 'down'];
    const [ps, pp] = ifStatus(dev, parentOf(name), parent);
    return pp === 'up' ? ['up', 'up'] : [ps === 'administratively down' ? 'down' : ps, 'down'];
  }
  if (isPortChannel(name)) {
    if (admin) return ['administratively down', 'down'];
    const ch = dev.chan && dev.chan.get(Number(name.slice(12)));
    return ch && ch.up ? ['up', 'up'] : ['down', 'down'];
  }
  if (admin) return ['administratively down', 'down'];
  const l1 = dev.l1.get(name);
  if (dev.st.errDisabled.has(name)) return ['down', 'down'];
  if (l1 && l1.up) {
    const ch = i.channel && dev.chan.get(i.channel.group);
    const flag = ch ? ch.members.get(name) : null;
    if (flag === 's') return ['down', 'down'];
    return ['up', 'up'];
  }
  return ['down', 'down'];
}

function v6Addrs(dev, i, mac) {
  const list = [];
  const enabled = i.ipv6Enable || i.ipv6.length > 0;
  if (!enabled) return { ll: null, list };
  const ll = i.ipv6LinkLocal ? parseIp6(i.ipv6LinkLocal) : linkLocalFor(mac);
  for (const a of i.ipv6) {
    const g = a.eui ? eui64(a.addr, mac) : a.addr;
    list.push({ addr: ip6Big(g), groups: g, len: a.len, eui: a.eui });
  }
  return { ll: ip6Big(ll), llGroups: ll, list };
}

/** Compute dev.l3 : Map ifName -> L3 interface state. */
export function computeL3(net) {
  for (const dev of net.devices.values()) {
    dev.l3 = new Map();
    if (isHost(dev)) {
      const l1 = dev.l1.get('eth0');
      const n = dev.nic;
      const v6 = n.ipv6.map((a) => ({ addr: ip6Big(a.addr), groups: a.addr, len: a.len }));
      dev.l3.set('eth0', {
        name: 'eth0', up: !!(l1 && l1.up), status: l1 && l1.up ? ['up', 'up'] : ['down', 'down'],
        ip: n.ip, mask: n.mask, secondary: [], mac: dev.mac, tag: null, phys: 'eth0',
        ll: ip6Big(linkLocalFor(dev.mac)), llGroups: linkLocalFor(dev.mac), v6,
      });
      continue;
    }
    for (const [name, i] of dev.cfg.interfaces) {
      const l3capable = !i.sw && !(i.channel && !isPortChannel(name) && dev.chan.get(i.channel.group)?.members.get(name) === 'P');
      const status = ifStatus(dev, name, i);
      const mac = ifMac(dev, name);
      const v6 = v6Addrs(dev, i, mac);
      const lease = i.dhcpClient && dev.st.ifLeases ? dev.st.ifLeases.get(name) : null;
      const addr = i.ip || (lease ? { addr: lease.ip, mask: lease.mask } : null);
      const entry = {
        name, status, up: status[1] === 'up', l3: l3capable, mac,
        ip: l3capable && addr ? addr.addr : null, mask: l3capable && addr ? addr.mask : null, dhcp: !!lease,
        secondary: l3capable ? i.secondary : [],
        tag: i.encap && !i.encap.native ? i.encap.vlan : null,
        nativeSub: !!(i.encap && i.encap.native),
        phys: isSubif(name) ? parentOf(name) : name,
        ll: l3capable ? v6.ll : null, llGroups: v6.llGroups, v6: l3capable ? v6.list : [],
        cfg: i,
      };
      dev.l3.set(name, entry);
    }
  }
}

export function routingEnabled(dev) {
  return !isHost(dev) && dev.cfg.ipRouting;
}

// ---------- RIB ----------
function connectedRoutes(dev, now) {
  const out = [];
  for (const l of dev.l3.values()) {
    if (!l.up || !l.l3) continue;
    const addrs = l.ip !== null ? [{ addr: l.ip, mask: l.mask }, ...l.secondary] : [];
    for (const a of addrs) {
      const len = maskToLen(a.mask);
      out.push({ af: 4, net: netOf(a.addr, a.mask), len, proto: 'C', ad: 0, metric: 0, paths: [{ nh: null, ifName: l.name }] });
      if (len < 32) out.push({ af: 4, net: a.addr, len: 32, proto: 'L', ad: 0, metric: 0, paths: [{ nh: null, ifName: l.name }] });
      else out[out.length - 1].proto = 'C';
    }
  }
  return out.map((r) => ({ ...r, key: `${r.net}/${r.len}` }));
}

function lpm(routes, ip) {
  let best = null;
  for (const r of routes) {
    if (r.af !== 4) continue;
    if (netOf(ip, lenToMask(r.len)) === r.net && (!best || r.len > best.len)) best = r;
  }
  return best;
}

function resolveStatic(dev, s, pool) {
  if (s.ifName) {
    const l = dev.l3.get(s.ifName);
    if (!l || !l.up) return null;
    return [{ nh: s.nh, ifName: s.ifName, direct: s.nh === null }];
  }
  let nh = s.nh;
  for (let depth = 0; depth < 4; depth += 1) {
    const r = lpm(pool.filter((x) => x.src !== s), nh);
    if (!r) return null;
    if (r.proto === 'C' || r.proto === 'L') {
      if (r.proto === 'L') return null;
      return [{ nh: s.nh, ifName: r.paths[0].ifName }];
    }
    if (!r.paths[0].nh && r.paths[0].ifName) return [{ nh: s.nh, ifName: r.paths[0].ifName }];
    nh = r.paths[0].nh;
  }
  return null;
}

function selectBest(cands) {
  const byKey = new Map();
  for (const r of cands) {
    const cur = byKey.get(r.key);
    if (!cur || r.ad < cur.ad || (r.ad === cur.ad && r.proto === cur.proto && r.metric < cur.metric)) byKey.set(r.key, { ...r, paths: [...r.paths] });
    else if (r.ad === cur.ad && r.proto === cur.proto && r.metric === cur.metric && r.proto !== 'C' && r.proto !== 'L') {
      r.paths.forEach((p) => { if (!cur.paths.some((q) => q.nh === p.nh && q.ifName === p.ifName)) cur.paths.push(p); });
    }
  }
  return [...byKey.values()];
}

/** Build dev.rib (IPv4). ospfRoutes is an array from the OSPF engine (may be empty). */
export function buildRib(dev, ospfRoutes, now) {
  if (isHost(dev)) { dev.rib = []; return; }
  const conn = connectedRoutes(dev, now);
  let pool = [...conn, ...ospfRoutes];
  let statics = [];
  const routing = routingEnabled(dev);
  for (let round = 0; round < 3 && routing; round += 1) {
    statics = [];
    const dhcpDefaults = [...(dev.st.ifLeases || new Map()).entries()]
      .filter(([, x]) => x.gw !== null && x.gw !== undefined)
      .map(([ifName, x]) => ({ net: 0, mask: 0, nh: x.gw, ifName: null, ad: 254, dhcp: ifName }));
    for (const s of [...dev.cfg.staticRoutes, ...dhcpDefaults]) {
      if (s.ad === 255) continue; // distance 255 = never trusted, never installed in the RIB
      const paths = resolveStatic(dev, s, selectBest([...pool, ...statics]));
      if (!paths) continue;
      statics.push({ af: 4, net: s.net, len: maskToLen(s.mask), proto: 'S', ad: s.ad, metric: 0, paths, key: `${s.net}/${maskToLen(s.mask)}`, src: s });
    }
    pool = [...conn, ...ospfRoutes];
  }
  const all = routing ? [...conn, ...statics, ...ospfRoutes] : conn;
  const rib = selectBest(all);
  const times = dev.st.routeTimes || new Map();
  const nextTimes = new Map();
  rib.forEach((r) => {
    const k = `${r.proto}|${r.key}`;
    nextTimes.set(k, times.get(k) ?? now);
    r.since = nextTimes.get(k);
  });
  dev.st.routeTimes = nextTimes;
  rib.sort((a, b) => (a.net - b.net) || (a.len - b.len));
  dev.rib = rib;
}

export function ribLookup(dev, ip) {
  return lpm(dev.rib || [], ip);
}

/** Static routes whose prefix exists in config, used by OSPF default-information. */
export function hasDefaultRoute(dev) {
  return (dev.rib || []).some((r) => r.len === 0 && r.proto !== 'O' && r.proto !== 'E2');
}

// ---------- IPv6 RIB ----------
export function buildRib6(dev, ospf6Routes, now) {
  if (isHost(dev)) { dev.rib6 = []; return; }
  const out = [];
  for (const l of dev.l3.values()) {
    if (!l.up || !l.l3) continue;
    for (const a of l.v6) {
      const net = a.addr & mask6(a.len);
      out.push({ af: 6, net, len: a.len, proto: 'C', ad: 0, metric: 0, paths: [{ nh: null, ifName: l.name }] });
      out.push({ af: 6, net: a.addr, len: 128, proto: 'L', ad: 0, metric: 0, paths: [{ nh: null, ifName: l.name }] });
    }
  }
  const conn = out.map((r) => ({ ...r, key: `${r.net}/${r.len}` }));
  const statics = [];
  if (dev.cfg.ipv6Routing) {
    for (const s of dev.cfg.staticRoutes6) {
      let ifName = s.ifName;
      if (ifName) {
        const l = dev.l3.get(ifName);
        if (!l || !l.up) continue;
      } else {
        const r = lpm6([...conn, ...ospf6Routes], s.nh);
        if (!r || r.proto === 'L') continue;
        ifName = r.paths[0].ifName;
      }
      statics.push({ af: 6, net: s.net, len: s.len, proto: 'S', ad: s.ad, metric: 0, paths: [{ nh: s.nh, ifName, direct: !s.nh }], key: `${s.net}/${s.len}` });
    }
  }
  const rib = selectBest(dev.cfg.ipv6Routing ? [...conn, ...statics, ...ospf6Routes] : conn);
  rib.sort((a, b) => (a.net < b.net ? -1 : a.net > b.net ? 1 : a.len - b.len));
  rib.forEach((r) => { r.since = now; });
  dev.rib6 = rib;
}

export function lpm6(routes, ip) {
  let best = null;
  for (const r of routes) {
    if (r.af !== 6) continue;
    if ((ip & mask6(r.len)) === r.net && (!best || r.len > best.len)) best = r;
  }
  return best;
}

export { isSwitch };
