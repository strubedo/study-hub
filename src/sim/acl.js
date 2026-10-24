// IPv4 ACL evaluation (standard/extended, numbered/named) with hit counters,
// plus text rendering shared by show access-lists and running-config.

import { ipStr, netOf } from './util.js';
import { TCP_PORTS, UDP_PORTS } from './parser.js';

export const PROTO_NUM = { ip: 0, icmp: 1, tcp: 6, udp: 17, ospf: 89, eigrp: 88, gre: 47, esp: 50, ahp: 51, pim: 103 };
export const ICMP_TYPES = { 'echo-reply': [0], unreachable: [3], echo: [8], 'time-exceeded': [11], redirect: [5], 'host-unreachable': [3], 'port-unreachable': [3], 'net-unreachable': [3], 'administratively-prohibited': [3] };
const ICMP_TYPE_NUM = { echo: 8, 'echo-reply': 0, unreach: 3, 'ttl-exceeded': 11 };

export function isStandardNumber(n) {
  const x = Number(n);
  return (x >= 1 && x <= 99) || (x >= 1300 && x <= 1999);
}
export function isExtendedNumber(n) {
  const x = Number(n);
  return (x >= 100 && x <= 199) || (x >= 2000 && x <= 2699);
}

function addrMatch(spec, ip) {
  if (spec.any) return true;
  return netOf(ip, (~spec.wild) >>> 0) === netOf(spec.addr, (~spec.wild) >>> 0);
}

function portMatch(spec, port) {
  if (!spec) return true;
  if (port === undefined || port === null) return false;
  const [a, b] = spec.ports;
  switch (spec.op) {
    case 'eq': return port === a;
    case 'neq': return port !== a;
    case 'lt': return port < a;
    case 'gt': return port > a;
    case 'range': return port >= a && port <= b;
    default: return false;
  }
}

function pktProtoNum(pkt) { return PROTO_NUM[pkt.proto] ?? 255; }

export function entryMatches(acl, e, pkt) {
  if (e.action === 'remark') return false;
  if (acl.type === 'standard') return addrMatch(e.src, pkt.src);
  if (e.proto !== 'ip' && PROTO_NUM[e.proto] !== pktProtoNum(pkt)) return false;
  if (!addrMatch(e.src, pkt.src) || !addrMatch(e.dst, pkt.dst)) return false;
  if (e.proto === 'tcp' || e.proto === 'udp') {
    if (!portMatch(e.srcPort, pkt.sport) || !portMatch(e.dstPort, pkt.dport)) return false;
    if (e.established && !(pkt.flags && /[AR]/.test(pkt.flags))) return false;
  }
  if (e.proto === 'icmp' && e.icmp) {
    const t = ICMP_TYPE_NUM[pkt.icmp?.type];
    if (!(ICMP_TYPES[e.icmp] || [Number(e.icmp)]).includes(t)) return false;
  }
  return true;
}

/** Evaluate ACL `name` on dev. Missing ACL permits all (IOS behaviour). */
export function aclPermits(dev, name, pkt, count = true) {
  const acl = dev.cfg.acls.get(String(name));
  if (!acl) return true;
  for (const e of acl.entries) {
    if (!entryMatches(acl, e, pkt)) continue;
    if (count) {
      const k = `${acl.name}|${e.seq}`;
      dev.st.aclHits.set(k, (dev.st.aclHits.get(k) || 0) + 1);
    }
    return e.action === 'permit';
  }
  return false;
}

// ---------- rendering ----------
function addrText(spec, standard, forShow) {
  if (spec.any) return 'any';
  if (spec.wild === 0) return standard ? (forShow ? spec.addr === null ? 'any' : ipStr(spec.addr) : ipStr(spec.addr)) : `host ${ipStr(spec.addr)}`;
  return standard && forShow ? `${ipStr(spec.addr)}, wildcard bits ${ipStr(spec.wild)}` : `${ipStr(spec.addr)} ${ipStr(spec.wild)}`;
}

function portName(proto, n) {
  const table = proto === 'udp' ? UDP_PORTS : TCP_PORTS;
  const hit = Object.entries(table).find(([, v]) => v === n);
  return hit ? hit[0] : String(n);
}

function portText(proto, spec) {
  if (!spec) return '';
  const names = spec.ports.map((p) => portName(proto, p));
  return ` ${spec.op} ${names.join(' ')}`;
}

/** Body of an ACE without sequence number, e.g. "permit tcp any host 10.1.1.1 eq www". */
export function aceText(acl, e, { forShow = false, numberedCfg = false } = {}) {
  if (e.action === 'remark') return `remark ${e.remark}`;
  const pad = acl.type === 'standard' && forShow ? (e.action === 'deny' ? 'deny  ' : 'permit') : (!forShow && !numberedCfg && e.action === 'deny' ? 'deny  ' : e.action);
  if (acl.type === 'standard') {
    return `${pad} ${addrText(e.src, true, forShow)}${e.log ? ' log' : ''}`;
  }
  let s = `${pad} ${e.proto} ${addrText(e.src, false)}${portText(e.proto, e.srcPort)} ${addrText(e.dst, false)}${portText(e.proto, e.dstPort)}`;
  if (e.icmp) s += ` ${e.icmp}`;
  if (e.established) s += ' established';
  if (e.log) s += ' log';
  return s;
}

export function showAcl(dev, acl) {
  const head = `${acl.type === 'standard' ? 'Standard' : 'Extended'} IP access list ${acl.name}`;
  const lines = [head];
  acl.entries.filter((e) => e.action !== 'remark').forEach((e) => {
    const hits = dev.st.aclHits.get(`${acl.name}|${e.seq}`);
    lines.push(`    ${e.seq} ${aceText(acl, e, { forShow: true })}${hits ? ` (${hits} match${hits === 1 ? '' : 'es'})` : ''}`);
  });
  return lines.join('\n');
}
