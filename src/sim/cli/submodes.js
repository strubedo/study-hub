// Sub-mode commands: router ospf, ipv6 router ospf, line, vlan, dhcp pool,
// and named standard/extended ACLs.

import { parseIp, isValidMask, lenToMask, maskToLen, netOf, ipStr } from '../util.js';
import { ACE_STD, ACE_EXT, buildAce, nextSeq } from './acl-cmds.js';

const AREA = '(area:<0-4294967295>{OSPF area ID as a decimal value} | areaip:A.B.C.D{OSPF area ID in IP address format})';

function proc(s) { return (s.mode === 'rtr' ? s.cfg.ospf6 : s.cfg.ospf).get(s.ctx.pid); }
function touch(s) { s.changed(); }

function hasFullNbrs(s, af) {
  const res = af === 6 ? s.net.ospf6 : s.net.ospf;
  if (!res) return false;
  return (res.nbrs.get(s.dev.name) || []).some((n) => n.pid === s.ctx.pid && n.state === 'FULL');
}

export function registerSubmodes(def) {
  const R = ['router', 'rtr'];
  def(R, 'router-id rid:A.B.C.D{OSPF router-id in IP address format}', (s, a) => {
    const rid = parseIp(a.rid);
    const af = s.mode === 'rtr' ? 6 : 4;
    const others = [...(af === 6 ? s.cfg.ospf6 : s.cfg.ospf).entries()].filter(([pid, p]) => pid !== s.ctx.pid && p.rid === rid);
    if (others.length) return `% OSPF: Router-id ${a.rid} in use by ospf process ${others[0][0]}`;
    proc(s).rid = rid;
    touch(s);
    const key = `${af}:${s.ctx.pid}`;
    s.dev.st.rids = s.dev.st.rids || new Map();
    if (hasFullNbrs(s, af)) return `% OSPF: Reload or use "clear ip ospf process" command, for this to take effect`;
    s.dev.st.rids.set(key, null);
    return '';
  });
  def(R, 'no router-id [rid:A.B.C.D]', (s) => { proc(s).rid = null; touch(s); });
  def('router', `network ip:A.B.C.D{Network number} wild:A.B.C.D{OSPF wild card bits} area ${AREA}`, (s, a) => {
    const p = proc(s);
    const ip = parseIp(a.ip); const wild = parseIp(a.wild);
    const area = a.areaip ? parseIp(a.areaip) : Number(a.area);
    const dup = p.networks.find((n) => n.ip === ((ip & ~wild) >>> 0) && n.wild === wild);
    if (dup && dup.area !== area) return `% OSPF: "network ${a.ip} ${a.wild} area ${dup.areaFmt === 'dot' ? ipStr(dup.area) : dup.area}" is already configured`;
    if (!dup) p.networks = [...p.networks, { ip: (ip & ~wild) >>> 0, wild, area, areaFmt: a.areaip ? 'dot' : 'dec' }];
    touch(s);
  });
  def('router', `no network ip:A.B.C.D wild:A.B.C.D area ${AREA}`, (s, a) => {
    const p = proc(s); const ip = parseIp(a.ip); const wild = parseIp(a.wild);
    p.networks = p.networks.filter((n) => !(n.ip === ((ip & ~wild) >>> 0) && n.wild === wild));
    touch(s);
  });
  def(R, 'passive-interface (IFACE | default{Suppress routing updates on all interfaces})', (s, a) => {
    const p = proc(s);
    if (a.default) { p.passiveDefault = true; p.nonPassive = new Set(); } else if (p.passiveDefault) { const n = new Set(p.nonPassive); n.delete(a.iface); p.nonPassive = n; } else p.passive = new Set([...p.passive, a.iface]);
    touch(s);
  });
  def(R, 'no passive-interface (IFACE | default)', (s, a) => {
    const p = proc(s);
    if (a.default) { p.passiveDefault = false; p.passive = new Set(); } else if (p.passiveDefault) p.nonPassive = new Set([...p.nonPassive, a.iface]);
    else { const n = new Set(p.passive); n.delete(a.iface); p.passive = n; }
    touch(s);
  });
  def(R, 'default-information originate [always] [metric m:<0-16777214>{OSPF metric}] [metric-type mt:<1-2>{OSPF Link State type}]', (s, a) => {
    proc(s).defaultInfo = { always: !!a.always, metric: a.m !== undefined ? Number(a.m) : null, type: a.mt ? Number(a.mt) : 2 };
    touch(s);
  });
  def(R, 'no default-information originate [LINE]', (s) => { proc(s).defaultInfo = null; touch(s); });
  def(R, 'auto-cost reference-bandwidth bw:<1-4294967>{The reference bandwidth in terms of Mbits per second}', (s, a) => {
    proc(s).refBw = Number(a.bw); touch(s);
    return '% OSPF: Reference bandwidth is changed.\n        Please ensure reference bandwidth is consistent across all routers.';
  });
  def(R, 'no auto-cost reference-bandwidth [LINE]', (s) => { proc(s).refBw = 100; touch(s); });
  def(R, 'maximum-paths mp:<1-32>{Number of paths}', (s, a) => { proc(s).maxPaths = Number(a.mp); touch(s); });

  // ---- line ----
  def('line', 'password [(t0:0{Specifies an UNENCRYPTED password will follow} | t7:7{Specifies a HIDDEN password will follow})] pw:LINE{The UNENCRYPTED (cleartext) line password}', (s, a) => {
    const raw = a.pw.trim();
    s.cfg.lines[s.ctx.line].password = a.t7 ? { plain: decrypt7(raw) } : { plain: raw };
    touch(s);
  });
  def('line', 'no password', (s) => { s.cfg.lines[s.ctx.line].password = null; touch(s); });
  def('line', 'login [local{Local password checking}]', (s, a) => {
    const ln = s.cfg.lines[s.ctx.line];
    ln.login = true; ln.loginLocal = !!a.local;
    touch(s);
    if (!a.local && !ln.password) {
      const nums = s.ctx.line === 'con' ? [0] : s.dev.type === 'router' ? [2, 3, 4, 5, 6] : [1, 2, 3, 4, 5];
      return nums.map((n) => `% Login disabled on line ${n}, until 'password' is set`).join('\n');
    }
    return '';
  });
  def('line', 'no login [local]', (s) => { const ln = s.cfg.lines[s.ctx.line]; ln.login = false; ln.loginLocal = false; touch(s); });
  def('line', 'transport input (ssh{TCP/IP SSH protocol} [telnet] | telnet{TCP/IP Telnet protocol} [ssh] | all{All protocols} | none{No protocols})', (s, a) => {
    if (s.ctx.line !== 'vty') return '';
    const v = a.all ? 'all' : a.none ? 'none' : [a.telnet ? 'telnet' : null, a.ssh ? 'ssh' : null].filter(Boolean).join(' ');
    s.cfg.lines.vty.transport = v;
    touch(s);
  });
  def('line', 'no transport input [LINE]', (s) => { s.cfg.lines.vty.transport = null; touch(s); });
  def('line', 'exec-timeout min:<0-35791>{Timeout in minutes} [sec:<0-2147483>{Timeout in seconds}]', (s, a) => {
    s.cfg.lines[s.ctx.line].execTimeout = [Number(a.min), a.sec !== undefined ? Number(a.sec) : 0];
    touch(s);
  });
  def('line', 'no exec-timeout', (s) => { s.cfg.lines[s.ctx.line].execTimeout = null; touch(s); });
  def('line', '[no] logging synchronous', (s, a) => { s.cfg.lines[s.ctx.line].loggingSync = !a.no; touch(s); });
  def('line', 'access-class acl:WORD{IP access list} in{Filter incoming connections}', (s, a) => {
    if (s.ctx.line !== 'vty') return '';
    s.cfg.lines.vty.accessClass = a.acl; touch(s);
  });
  def('line', 'no access-class [acl:WORD] in', (s) => { s.cfg.lines.vty.accessClass = null; touch(s); });

  // ---- vlan ----
  def('vlan', 'name nm:WORD{The ascii name for the VLAN}', (s, a) => {
    if (s.ctx.vlans.includes(1)) return 'Default VLAN 1 may not have its name changed.';
    const m = new Map(s.cfg.vlans);
    s.ctx.vlans.forEach((v) => m.set(v, { ...m.get(v), name: a.nm.slice(0, 32) }));
    s.cfg.vlans = m; touch(s);
  });
  def('vlan', 'no name', (s) => {
    const m = new Map(s.cfg.vlans);
    s.ctx.vlans.forEach((v) => m.set(v, { ...m.get(v), name: `VLAN${String(v).padStart(4, '0')}` }));
    s.cfg.vlans = m; touch(s);
  });

  // ---- dhcp pool ----
  const pool = (s) => s.cfg.dhcpPools.get(s.ctx.pool);
  def('dhcp', 'network ip:A.B.C.D{Network number in dotted-decimal notation} (mask:A.B.C.D{Network mask} | pl:WORD{/nn or A.B.C.D  Network mask or prefix length})', (s, a) => {
    const ip = parseIp(a.ip);
    let mask;
    if (a.mask) mask = parseIp(a.mask);
    else {
      const m = /^\/(\d{1,2})$/.exec(a.pl);
      if (!m || Number(m[1]) > 32) return '% Invalid input';
      mask = lenToMask(Number(m[1]));
    }
    if (!isValidMask(mask)) return '% Invalid mask';
    if (netOf(ip, mask) !== ip) return `% ${a.ip}/${maskToLen(mask)} is an invalid network.`;
    pool(s).network = { addr: ip, mask, prefix: !!a.pl };
    touch(s);
  });
  def('dhcp', 'no network [LINE]', (s) => { pool(s).network = null; touch(s); });
  def('dhcp', 'default-router r1:A.B.C.D{Router\'s IP address} [r2:A.B.C.D] [r3:A.B.C.D]', (s, a) => {
    pool(s).routers = [a.r1, a.r2, a.r3].filter(Boolean).map(parseIp); touch(s);
  });
  def('dhcp', 'no default-router [LINE]', (s) => { pool(s).routers = []; touch(s); });
  def('dhcp', 'dns-server d1:A.B.C.D{Server\'s IP address} [d2:A.B.C.D] [d3:A.B.C.D]', (s, a) => {
    pool(s).dns = [a.d1, a.d2, a.d3].filter(Boolean).map(parseIp); touch(s);
  });
  def('dhcp', 'no dns-server [LINE]', (s) => { pool(s).dns = []; touch(s); });
  def('dhcp', 'domain-name dn:WORD{Domain name}', (s, a) => { pool(s).domain = a.dn; touch(s); });
  def('dhcp', 'no domain-name [LINE]', (s) => { pool(s).domain = null; touch(s); });
  def('dhcp', 'lease (days:<0-365>{Days} [hrs:<0-23>{Hours} [mins:<0-59>{Minutes}]] | infinite)', (s, a) => {
    pool(s).lease = a.infinite ? { infinite: true, days: 36500, hours: 0, mins: 0 } : { days: Number(a.days), hours: Number(a.hrs || 0), mins: Number(a.mins || 0) };
    touch(s);
  });
  def('dhcp', 'no lease', (s) => { pool(s).lease = null; touch(s); });

  // ---- named ACLs ----
  const acl = (s) => s.cfg.acls.get(s.ctx.acl);
  def('std-nacl', `[seqn:<1-2147483647>{Sequence Number}] ${ACE_STD}`, (s, a) => addAce(s, acl(s), a, 'standard'));
  def('ext-nacl', `[seqn:<1-2147483647>{Sequence Number}] ${ACE_EXT}`, (s, a) => addAce(s, acl(s), a, 'extended'));
  def(['std-nacl', 'ext-nacl'], '[seqn:<1-2147483647>] remark rem:LINE{Comment up to 100 characters}', (s, a) => {
    const l = acl(s);
    const seq = a.seqn ? Number(a.seqn) : nextSeq(l);
    l.entries = sortEntries([...l.entries, { seq, action: 'remark', remark: a.rem }]);
    touch(s);
  });
  def(['std-nacl', 'ext-nacl'], 'no seqn:<1-2147483647>{Sequence Number}', (s, a) => {
    const l = acl(s); l.entries = l.entries.filter((e) => e.seq !== Number(a.seqn)); touch(s);
  });
  def('std-nacl', `no ${ACE_STD}`, (s, a) => removeAce(s, acl(s), a, 'standard'));
  def('ext-nacl', `no ${ACE_EXT}`, (s, a) => removeAce(s, acl(s), a, 'extended'));
}

function sortEntries(list) { return [...list].sort((x, y) => x.seq - y.seq); }

function addAce(s, l, a, type) {
  const e = buildAce(a, type);
  if (e.error) return e.error;
  const seq = a.seqn ? Number(a.seqn) : nextSeq(l);
  if (l.entries.some((x) => x.seq === seq)) return '% Duplicate sequence number';
  if (l.entries.some((x) => { const { seq: _q, ...r } = x; return JSON.stringify(r) === JSON.stringify(e); })) return '% Duplicate entry';
  l.entries = sortEntries([...l.entries, { ...e, seq }]);
  s.changed();
  return '';
}

function removeAce(s, l, a, type) {
  const e = buildAce(a, type);
  l.entries = l.entries.filter((x) => { const { seq: _q, ...r } = x; return JSON.stringify(r) !== JSON.stringify(e); });
  s.changed();
}

function decrypt7(enc) {
  const XLAT = 'dsfd;kfoA,.iyewrkldJKDHSUBsgvca69834ncxv9873254k;fg87';
  if (!/^\d{2}([0-9A-Fa-f]{2})*$/.test(enc)) return enc;
  const seed = Number(enc.slice(0, 2));
  let out = '';
  for (let i = 2; i < enc.length; i += 2) out += String.fromCharCode(parseInt(enc.slice(i, i + 2), 16) ^ XLAT.charCodeAt((seed + (i - 2) / 2) % XLAT.length));
  return out;
}

export { maskToLen };
