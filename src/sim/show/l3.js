// show ip route / ospf / protocols / arp / standby / ipv6 route / ipv6 interface brief.

import { ipStr, classfulLen, lenToMask, netOf, fmtDuration, ip6Str, bigIp6, maskToLen, parseIp } from '../util.js';
import { shortIf, compareIf } from '../ifnames.js';
import { routingEnabled, ribLookup } from '../routing.js';
import { routerId } from '../ospf.js';

const CODES = `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2, m - OMP
       n - NAT, Ni - NAT inside, No - NAT outside, Nd - NAT DIA
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       H - NHRP, G - NHRP registered, g - NHRP registration summary
       o - ODR, P - periodic downloaded static route, l - LISP
       a - application route
       + - replicated route, % - next hop override, p - overrides from PfR
       & - replicated local route overrides by connected`;

function code(r) {
  const star = r.len === 0 ? '*' : '';
  if (r.proto === 'E2' || r.proto === 'E1') return `O${star || ' '}${r.proto}`;
  return `${r.proto}${star}`;
}

function routeBody(net, r, width) {
  const pfx = `${ipStr(r.net)}/${r.len}`;
  const age = fmtDuration(net.now() - (r.since ?? net.now()));
  const lines = [];
  if (r.proto === 'C' || r.proto === 'L') return [`${pfx} is directly connected, ${r.paths[0].ifName}`];
  if (r.proto === 'S') {
    r.paths.forEach((p, i) => {
      const head = i === 0 ? pfx : ' '.repeat(pfx.length);
      if (p.direct && p.nh === null) lines.push(`${head} is directly connected, ${p.ifName}`);
      else lines.push(`${head} [${r.ad}/0] via ${ipStr(p.nh)}${r.src && r.src.ifName ? `, ${p.ifName}` : ''}`);
    });
    return lines;
  }
  r.paths.forEach((p, i) => {
    const head = i === 0 ? pfx : ' '.repeat(pfx.length);
    lines.push(`${head} [${r.ad}/${r.metric}] via ${ipStr(p.nh)}, ${age}, ${p.ifName}`);
  });
  return lines;
}

function emit(net, out, r, top) {
  const c = code(r);
  const w = top ? 6 : 9;
  const body = routeBody(net, r);
  body.forEach((b, i) => out.push(i === 0 ? c.padEnd(w) + b : ' '.repeat(w) + b));
}

function gatewayLine(dev) {
  const d = (dev.rib || []).find((r) => r.len === 0);
  if (!d) return 'Gateway of last resort is not set';
  const p = d.paths[0];
  return `Gateway of last resort is ${p.nh === null ? '0.0.0.0' : ipStr(p.nh)} to network 0.0.0.0`;
}

export function showIpRoute(net, dev, filter) {
  if (!routingEnabled(dev)) {
    const gw = dev.cfg.defaultGateway;
    return `Default gateway is ${gw === null ? 'not set' : ipStr(gw)}\n\nHost               Gateway           Last Use    Total Uses  Interface\nICMP redirect cache is empty`;
  }
  if (filter && filter.addr) return routeEntry(net, dev, parseIp(filter.addr));
  const want = (r) => {
    if (!filter) return true;
    if (filter.connected) return r.proto === 'C' || r.proto === 'L';
    if (filter.static) return r.proto === 'S';
    if (filter.ospf) return ['O', 'E1', 'E2'].includes(r.proto);
    return true;
  };
  const rib = (dev.rib || []).filter(want);
  const out = [CODES, '', gatewayLine(dev), ''];
  const groups = new Map();
  for (const r of rib) {
    const cl = classfulLen(r.net);
    if (r.len < cl) { groups.set(`top|${r.net}|${r.len}`, { top: r }); continue; }
    const major = netOf(r.net, lenToMask(cl));
    const k = `maj|${major}`;
    if (!groups.has(k)) groups.set(k, { major, cl, routes: [] });
    groups.get(k).routes.push(r);
  }
  const keys = [...groups.keys()].sort((a, b) => {
    const na = Number(a.split('|')[1]); const nb = Number(b.split('|')[1]);
    return na - nb || a.localeCompare(b);
  });
  for (const k of keys) {
    const g = groups.get(k);
    if (g.top) { emit(net, out, g.top, true); continue; }
    const masks = new Set(g.routes.map((r) => r.len));
    if (g.routes.length === 1 && g.routes[0].len === g.cl) { emit(net, out, g.routes[0], true); continue; }
    const n = g.routes.length;
    if (masks.size === 1) out.push(`      ${ipStr(g.major)}/${[...masks][0]} is subnetted, ${n} subnet${n > 1 ? 's' : ''}`);
    else out.push(`      ${ipStr(g.major)}/${g.cl} is variably subnetted, ${n} subnets, ${masks.size} masks`);
    g.routes.sort((a, b) => a.net - b.net || a.len - b.len).forEach((r) => emit(net, out, r, false));
  }
  return out.join('\n');
}

function routeEntry(net, dev, ip) {
  const cands = (dev.rib || []).filter((r) => r.len > 0 && netOf(ip, lenToMask(r.len)) === r.net);
  if (!cands.length) return '% Network not in table';
  const r = cands.reduce((a, b) => (b.len > a.len ? b : a));
  const age = fmtDuration(net.now() - (r.since ?? net.now()));
  const L = [`Routing entry for ${ipStr(r.net)}/${r.len}`];
  if (r.proto === 'C' || r.proto === 'L') {
    L.push(`  Known via "connected", distance 0, metric 0 (connected, via interface)`, '  Routing Descriptor Blocks:', `  * directly connected, via ${r.paths[0].ifName}`, '      Route metric is 0, traffic share count is 1');
  } else if (r.proto === 'S') {
    L.push(`  Known via "static", distance ${r.ad}, metric 0${r.paths[0].direct ? ' (connected)' : ''}`, '  Routing Descriptor Blocks:');
    r.paths.forEach((p, i) => L.push(`  ${i === 0 ? '*' : ' '} ${p.nh === null ? `directly connected, via ${p.ifName}` : ipStr(p.nh)}`, '      Route metric is 0, traffic share count is 1'));
  } else {
    const pid = [...dev.cfg.ospf.keys()][0];
    L.push(`  Known via "ospf ${pid}", distance 110, metric ${r.metric}, type ${r.proto === 'O' ? 'intra area' : `extern ${r.proto === 'E2' ? 2 : 1}, forward metric ${r.fwdCost ?? 1}`}`);
    L.push(`  Last update from ${ipStr(r.paths[0].nh)} on ${r.paths[0].ifName}, ${age} ago`, '  Routing Descriptor Blocks:');
    r.paths.forEach((p, i) => L.push(`  ${i === 0 ? '*' : ' '} ${ipStr(p.nh)}, from ${ipStr(r.fromRid ?? 0)}, ${age} ago, via ${p.ifName}`, `      Route metric is ${r.metric}, traffic share count is 1`));
  }
  return L.join('\n');
}

// ---------- OSPF ----------
function nbrList(net, dev, af) {
  const res = af === 6 ? net.ospf6 : net.ospf;
  return res ? res.nbrs.get(dev.name) || [] : [];
}

function stateCol(n) {
  if (n.state === '2WAY') return `2WAY/${n.role}`;
  if (n.role === '-') return `${n.state}/  -`;
  return `${n.state}/${n.role}`;
}

function deadTime(net, n) {
  const left = n.dead - Math.floor((net.now() / 1000) % 10) - 2;
  return fmtDuration(Math.max(1, left) * 1000);
}

export function showOspfNeighbor(net, dev) {
  const list = nbrList(net, dev, 4);
  if (!dev.cfg.ospf.size) return '';
  const L = ['', 'Neighbor ID     Pri   State           Dead Time   Address         Interface'];
  list.forEach((n) => L.push(`${ipStr(n.rid).padEnd(15)} ${String(n.pri).padStart(3)}   ${stateCol(n).padEnd(15)} ${deadTime(net, n).padEnd(11)} ${ipStr(n.ip).padEnd(15)} ${n.ifName}`));
  return L.join('\n');
}

export function showOspf6Neighbor(net, dev) {
  if (!dev.cfg.ospf6.size) return '';
  const L = [];
  for (const pid of dev.cfg.ospf6.keys()) {
    const rid = routerId(dev, pid, 6);
    L.push('', `            OSPFv3 Router with ID (${ipStr(rid ?? 0)}) (Process ID ${pid})`, '', 'Neighbor ID     Pri   State           Dead Time   Interface ID    Interface');
    nbrList(net, dev, 6).filter((n) => n.pid === pid).forEach((n) => {
      const ifid = n.p.dev.hw.ports.indexOf(n.peerIf) + 7;
      L.push(`${ipStr(n.rid).padEnd(15)} ${String(n.pri).padStart(3)}   ${stateCol(n).padEnd(15)} ${deadTime(net, n).padEnd(11)} ${String(ifid).padEnd(15)} ${n.ifName}`);
    });
  }
  return L.join('\n');
}

function ospfIfs(net, dev, af = 4) {
  const res = af === 6 ? net.ospf6 : net.ospf;
  return res ? res.ifs.get(dev.name) || [] : [];
}

function ifState(oi) {
  if (!oi.l.up) return 'DOWN';
  if (oi.netType === 'LOOPBACK') return 'LOOP';
  if (oi.netType === 'POINT_TO_POINT') return 'P2P';
  if (oi.passive) return oi.drState === 'DR' ? 'DR' : 'DR';
  return oi.drState === 'DROTHER' ? 'DROTH' : oi.drState || 'WAIT';
}

export function showOspfIfBrief(net, dev, af = 4) {
  const ifs = ospfIfs(net, dev, af).slice().sort((a, b) => compareIf(a.l.name, b.l.name));
  const nb = nbrList(net, dev, af);
  if (af === 6) {
    const L = ['Interface    PID   Area            Intf ID    Cost  State Nbrs F/C'];
    ifs.forEach((oi) => {
      const mine = nb.filter((n) => n.ifName === oi.l.name);
      const ifid = dev.hw.ports.indexOf(oi.l.name) + 7;
      L.push(`${shortIf(oi.l.name).padEnd(12)} ${String(oi.pid).padEnd(5)} ${String(oi.area).padEnd(15)} ${String(ifid > 6 ? ifid : 20).padEnd(10)} ${String(oi.cost).padEnd(5)} ${ifState(oi).padEnd(5)} ${mine.filter((n) => n.state === 'FULL').length}/${mine.length}`);
    });
    return L.join('\n');
  }
  const L = ['Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C'];
  ifs.forEach((oi) => {
    const mine = nb.filter((n) => n.ifName === oi.l.name);
    const addr = `${ipStr(oi.l.ip)}/${maskToLen(oi.l.mask)}`;
    const area = oi.areaFmt === 'dot' ? ipStr(oi.area) : String(oi.area);
    L.push(`${shortIf(oi.l.name).padEnd(12)} ${String(oi.pid).padEnd(5)} ${area.padEnd(15)} ${addr.padEnd(18)} ${String(oi.cost).padEnd(5)} ${ifState(oi).padEnd(5)} ${mine.filter((n) => n.state === 'FULL').length}/${mine.length}`);
  });
  return L.join('\n');
}

export function showOspfIf(net, dev, only) {
  const ifs = ospfIfs(net, dev).filter((oi) => !only || oi.l.name === only).sort((a, b) => compareIf(a.l.name, b.l.name));
  if (only && !ifs.length) return '';
  const nb = nbrList(net, dev, 4);
  const out = [];
  for (const oi of ifs) {
    const l = oi.l;
    const rid = ipStr(oi.rid ?? 0);
    const L = [`${l.name} is ${l.status[0]}, line protocol is ${l.status[1]} `];
    L.push(`  Internet Address ${ipStr(l.ip)}/${maskToLen(l.mask)}, Interface ID ${dev.hw.ports.indexOf(l.name) + 7 > 6 ? dev.hw.ports.indexOf(l.name) + 7 : 13}, Area ${oi.areaFmt === 'dot' ? ipStr(oi.area) : oi.area}`);
    L.push(`  Attached via ${oi.viaIf ? 'Interface Enable' : 'Network Statement'}`);
    L.push(`  Process ID ${oi.pid}, Router ID ${rid}, Network Type ${oi.netType}, Cost: ${oi.cost}`);
    L.push('  Topology-MTID    Cost    Disabled    Shutdown      Topology Name', `        0           ${String(oi.cost).padEnd(8)}no          no            Base`);
    if (oi.viaIf) L.push('  Enabled by interface config, including secondary ip addresses');
    if (oi.netType === 'LOOPBACK') {
      L.push('  Loopback interface is treated as a stub Host');
      out.push(L.join('\n'));
      continue;
    }
    L.push(`  Transmit Delay is 1 sec, State ${ifState(oi) === 'DROTH' ? 'DROTHER' : ifState(oi)}${oi.netType === 'BROADCAST' ? `, Priority ${oi.priority}` : ''}`);
    if (oi.netType === 'BROADCAST' && oi.dr) {
      L.push(`  Designated Router (ID) ${ipStr(oi.dr.rid)}, Interface address ${ipStr(oi.dr.l.ip)}`);
      if (oi.bdr) L.push(`  Backup Designated router (ID) ${ipStr(oi.bdr.rid)}, Interface address ${ipStr(oi.bdr.l.ip)}`);
      else L.push('  No backup designated router on this network');
    }
    L.push(`  Timer intervals configured, Hello ${oi.hello}, Dead ${oi.dead}, Wait ${oi.dead}, Retransmit 5`, '    oob-resync timeout 40');
    if (oi.passive) L.push('    No Hellos (Passive interface) ');
    else L.push(`    Hello due in 00:00:0${1 + (Math.floor(net.now() / 1000) % 8)}`);
    L.push('  Supports Link-local Signaling (LLS)', '  Cisco NSF helper support enabled', '  IETF NSF helper support enabled');
    const mine = nb.filter((n) => n.ifName === l.name);
    const adj = mine.filter((n) => n.state === 'FULL');
    L.push(`  Neighbor Count is ${mine.length}, Adjacent neighbor count is ${adj.length} `);
    adj.forEach((n) => L.push(`    Adjacent with neighbor ${ipStr(n.rid)}${n.role === 'DR' ? '  (Designated Router)' : n.role === 'BDR' ? '  (Backup Designated Router)' : ''}`));
    L.push('  Suppress hello for 0 neighbor(s)');
    out.push(L.join('\n'));
  }
  return out.join('\n');
}

/** Areas a process has interfaces in, backbone first. */
function ospfAreas(ifs) {
  const fmt = new Map();
  ifs.forEach((oi) => fmt.set(oi.area, oi.areaFmt));
  return [...fmt.entries()].sort((a, b) => a[0] - b[0]).map(([area, f]) => ({
    area,
    label: area === 0 ? 'BACKBONE(0)' : f === 'dot' ? ipStr(area) : String(area),
    count: ifs.filter((oi) => oi.area === area).length,
  }));
}

export function showOspfProcess(net, dev) {
  const out = [];
  for (const [pid, p] of dev.cfg.ospf) {
    const rid = routerId(dev, pid, 4);
    const ifs = ospfIfs(net, dev).filter((oi) => oi.pid === pid);
    const asbr = p.defaultInfo ? ' It is an autonomous system boundary router\n Redistributing External Routes from,\n' : '';
    const areas = ospfAreas(ifs);
    out.push(` Routing Process "ospf ${pid}" with ID ${ipStr(rid ?? 0)}
 Start time: 00:00:12.345, Time elapsed: ${fmtDuration(net.now() - net.base)}
 Supports only single TOS(TOS0) routes
 Supports opaque LSA
 Supports Link-local Signaling (LLS)
 Supports area transit capability
 Supports NSSA (compatible with RFC 3101)
 Supports Database exchange summary list optimization (RFC 5243)
 Event-log enabled, Maximum number of events: 1000, Mode: cyclic
 Router is not originating router-LSAs with maximum metric
${asbr} Initial SPF schedule delay 50 msecs
 Minimum hold time between two consecutive SPFs 200 msecs
 Maximum wait time between two consecutive SPFs 5000 msecs
 Incremental-SPF disabled
 Initial LSA throttle delay 50 msecs
 Minimum hold time for LSA throttle 200 msecs
 Maximum wait time for LSA throttle 5000 msecs
 Minimum LSA arrival 100 msecs
 LSA group pacing timer 240 secs
 Interface flood pacing timer 33 msecs
 Retransmission pacing timer 66 msecs
 EXCHANGE/LOADING adjacency limit: initial 300, process maximum 300
 Number of external LSA ${p.defaultInfo ? 1 : 0}. Checksum Sum 0x000000
 Number of opaque AS LSA 0. Checksum Sum 0x000000
 Number of DCbitless external and opaque AS LSA 0
 Number of DoNotAge external and opaque AS LSA 0
 Number of areas in this router is ${areas.length}. ${areas.length} normal 0 stub 0 nssa
 Number of areas transit capable is 0
 External flood list length 0
 IETF NSF helper support enabled
 Cisco NSF helper support enabled
 Reference bandwidth unit is ${p.refBw} mbps
${areas.map((a) => `    Area ${a.label}
        Number of interfaces in this area is ${a.count}
        Area has no authentication
        SPF algorithm last executed 00:00:05.123 ago
        SPF algorithm executed 4 times
        Area ranges are
        Number of LSA ${a.count + 1}. Checksum Sum 0x01A2B3
        Number of opaque link LSA 0. Checksum Sum 0x000000
        Number of DCbitless LSA 0
        Number of indication LSA 0
        Number of DoNotAge LSA 0
        Flood list length 0`).join('\n')}`);
  }
  return out.join('\n\n');
}

export function showIpProtocols(net, dev) {
  const out = ['*** IP Routing is NSF aware ***', ''];
  for (const [pid, p] of dev.cfg.ospf) {
    const rid = routerId(dev, pid, 4);
    out.push(`Routing Protocol is "ospf ${pid}"`, '  Outgoing update filter list for all interfaces is not set', '  Incoming update filter list for all interfaces is not set');
    out.push(`  Router ID ${ipStr(rid ?? 0)}`);
    if (p.defaultInfo) out.push('  It is an autonomous system boundary router', '  Redistributing External Routes from,');
    const nAreas = ospfAreas(ospfIfs(net, dev).filter((oi) => oi.pid === pid)).length;
    out.push(`  Number of areas in this router is ${nAreas}. ${nAreas} normal 0 stub 0 nssa`, `  Maximum path: ${p.maxPaths}`, '  Routing for Networks:');
    p.networks.forEach((n) => out.push(`    ${ipStr(n.ip)} ${ipStr(n.wild)} area ${n.areaFmt === 'dot' ? ipStr(n.area) : n.area}`));
    const viaIf = ospfIfs(net, dev).filter((oi) => oi.pid === pid && oi.viaIf);
    if (viaIf.length) {
      out.push(`  Routing on Interfaces Configured Explicitly (Area ${viaIf[0].area}):`);
      viaIf.forEach((oi) => out.push(`    ${oi.l.name}`));
    }
    const passive = ospfIfs(net, dev).filter((oi) => oi.pid === pid && oi.passive);
    if (passive.length) {
      out.push('  Passive Interface(s):');
      passive.forEach((oi) => out.push(`    ${oi.l.name}`));
    }
    out.push('  Routing Information Sources:', '    Gateway         Distance      Last Update');
    const srcs = new Map();
    (dev.rib || []).filter((r) => ['O', 'E1', 'E2'].includes(r.proto)).forEach((r) => { if (r.fromRid !== undefined) srcs.set(r.fromRid, r.since); });
    [...srcs.entries()].sort((a, b) => a[0] - b[0]).forEach(([rid2, since]) => out.push(`    ${ipStr(rid2).padEnd(15)}      110      ${fmtDuration(net.now() - since)}`));
    out.push('  Distance: (default is 110)', '');
  }
  return out.join('\n');
}

// ---------- ARP ----------
export function showArp(net, dev) {
  const L = ['Protocol  Address          Age (min)  Hardware Addr   Type   Interface'];
  const rows = [];
  for (const l of dev.l3.values()) {
    if (!l.up || l.ip === null || l.name.startsWith('Loopback')) continue;
    rows.push({ ip: l.ip, age: '-', mac: l.mac, ifName: l.name });
    for (const h of (dev.hsrp || new Map()).values()) if (h.p.l.name === l.name && h.state === 'Active' && h.vip !== null) rows.push({ ip: h.vip, age: '-', mac: h.vmac, ifName: l.name });
  }
  for (const [ip, e] of dev.st.arp) rows.push({ ip, age: String(Math.floor((net.now() - e.time) / 60000)), mac: e.mac, ifName: e.ifName });
  rows.sort((a, b) => a.ip - b.ip).forEach((r) => L.push(`Internet  ${ipStr(r.ip).padEnd(16)} ${r.age.padStart(8)}   ${r.mac}  ARPA   ${r.ifName}`));
  return L.join('\n');
}

// ---------- HSRP ----------
export function showStandbyBrief(net, dev) {
  const L = ['                     P indicates configured to preempt.', '                     |', 'Interface   Grp  Pri P State   Active          Standby         Virtual IP'];
  [...(dev.hsrp || new Map()).values()].sort((a, b) => compareIf(a.p.l.name, b.p.l.name)).forEach((h) => {
    const act = h.state === 'Active' ? 'local' : h.active ? ipStr(h.active.l.ip) : 'unknown';
    const sb = h.state === 'Standby' ? 'local' : h.standby ? ipStr(h.standby.l.ip) : 'unknown';
    L.push(`${shortIf(h.p.l.name).padEnd(11)} ${String(h.p.grp).padEnd(4)} ${String(h.p.prio).padEnd(3)} ${h.p.preempt ? 'P' : ' '} ${h.state.padEnd(7)} ${act.padEnd(15)} ${sb.padEnd(15)} ${h.vip === null ? 'unknown' : ipStr(h.vip)}`);
  });
  return L.join('\n');
}

export function showStandby(net, dev) {
  const out = [];
  [...(dev.hsrp || new Map()).values()].forEach((h) => {
    const p = h.p;
    out.push([
      `${p.l.name} - Group ${p.grp}${p.version === 2 ? ' (version 2)' : ''}`,
      `  State is ${h.state}`,
      '    2 state changes, last state change 00:01:12',
      `  Virtual IP address is ${h.vip === null ? 'unknown' : ipStr(h.vip)}`,
      `  Active virtual MAC address is ${h.vmac} (MAC ${h.state === 'Active' ? 'In Use' : 'Not In Use'})`,
      `    Local virtual MAC address is ${h.vmac} (v${p.version} default)`,
      '  Hello time 3 sec, hold time 10 sec',
      `    Next hello sent in ${(1 + net.now() % 3000 / 1000).toFixed(3)} secs`,
      `  Preemption ${p.preempt ? 'enabled' : 'disabled'}`,
      `  Active router is ${h.state === 'Active' ? 'local' : h.active ? `${ipStr(h.active.l.ip)}, priority ${h.active.prio} (expires in 9.312 sec)` : 'unknown'}`,
      `  Standby router is ${h.state === 'Standby' ? 'local' : h.standby ? `${ipStr(h.standby.l.ip)}, priority ${h.standby.prio} (expires in 10.112 sec)` : 'unknown'}`,
      `  Priority ${p.prio} (${p.prio === 100 ? 'default 100' : 'configured ' + p.prio})`,
      `  Group name is "hsrp-${shortIf(p.l.name)}-${p.grp}" (default)`,
      `  FLAGS: 1/1`,
    ].join('\n'));
  });
  return out.join('\n');
}

// ---------- IPv6 ----------
export function showIpv6IfBrief(net, dev) {
  const L = [];
  [...dev.l3.values()].sort((a, b) => compareIf(a.name, b.name)).forEach((l) => {
    if (!l.l3) return;
    const st = l.status[0] === 'administratively down' ? 'administratively down/down' : `${l.status[0]}/${l.status[1]}`;
    L.push(`${l.name.padEnd(22)} [${st}]`);
    if (l.ll === null) L.push('    unassigned');
    else {
      L.push(`    ${ip6Str(bigIp6(l.ll))}`);
      l.v6.forEach((a) => L.push(`    ${ip6Str(a.groups)}`));
    }
  });
  return L.join('\n');
}

const CODES6 = `IPv6 Routing Table - default - %N entries
Codes: C - Connected, L - Local, S - Static, U - Per-user Static route
       B - BGP, R - RIP, H - NHRP, I1 - ISIS L1
       I2 - ISIS L2, IA - ISIS interarea, IS - ISIS summary, D - EIGRP
       EX - EIGRP external, ND - ND Default, NDp - ND Prefix, DCE - Destination
       NDr - Redirect, RL - RPL, O - OSPF Intra, OI - OSPF Inter
       OE1 - OSPF ext 1, OE2 - OSPF ext 2, ON1 - OSPF NSSA ext 1
       ON2 - OSPF NSSA ext 2, la - LISP alt, lr - LISP site-registrations
       ld - LISP dyn-eid, lA - LISP away, le - LISP extranet-policy
       lp - LISP publications, a - Application, m - OMP`;

export function showIpv6Route(net, dev, filter) {
  if (!dev.cfg.ipv6Routing && !(dev.rib6 || []).length) return '% IPv6 routing table default does not exist';
  const rib = (dev.rib6 || []).filter((r) => !filter || (filter.connected ? ['C', 'L'].includes(r.proto) : filter.static ? r.proto === 'S' : r.proto === 'O'));
  const L = [CODES6.replace('%N', String(rib.length + 1))];
  rib.forEach((r) => {
    L.push(`${r.proto.padEnd(3)} ${ip6Str(bigIp6(r.net))}/${r.len} [${r.ad}/${r.metric}]`);
    r.paths.forEach((p) => {
      if (r.proto === 'C') L.push(`     via ${p.ifName}, directly connected`);
      else if (r.proto === 'L') L.push(`     via ${p.ifName}, receive`);
      else if (p.nh === null || p.nh === undefined) L.push(`     via ${p.ifName}, directly connected`);
      else L.push(`     via ${ip6Str(bigIp6(p.nh))}${r.proto === 'O' || (r.proto === 'S' && (p.nh >> 118n) === (0xfe80n >> 6n)) ? `, ${p.ifName}` : ''}`);
    });
  });
  L.push('L   FF00::/8 [0/0]', '     via Null0, receive');
  return L.join('\n');
}

export { ribLookup };
