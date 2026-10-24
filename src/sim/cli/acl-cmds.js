// ACE grammar fragments and builders shared by numbered `access-list` and
// named `ip access-list` sub-modes.

import { parseIp } from '../util.js';
import { TCP_PORTS, UDP_PORTS } from '../parser.js';

export const SRC_STD = '(sany:any{Any source host} | shk:host{A single host address} shost:A.B.C.D{Host address} | saddr:A.B.C.D{Address to match} [swild:A.B.C.D{Wildcard bits}])';
const SRC = '(sany:any{Any source host} | shk:host{A single source host} shost:A.B.C.D{Source address} | saddr:A.B.C.D{Source address} swild:A.B.C.D{Source wildcard bits})';
const DST = '(dany:any{Any destination host} | dhk:host{A single destination host} dhost:A.B.C.D{Destination address} | daddr:A.B.C.D{Destination address} dwild:A.B.C.D{Destination wildcard bits})';
const SPORT = '[((seq:eq | sneq:neq | slt:lt | sgt:gt) sport:PORT | srange:range sp1:PORT sp2:PORT)]';
const DPORT = '[((deq:eq | dneq:neq | dlt:lt | dgt:gt) dport:PORT | drange:range dp1:PORT dp2:PORT)]';
const ACT = '(permit | deny)';

export const ACE_STD = `${ACT} ${SRC_STD} [log]`;
export const ACE_EXT = `${ACT} (`
  + `(ip{Any Internet Protocol} | ospf{OSPF routing protocol} | eigrp | gre | esp | ahp | pim | pnum:<0-255>{An IP protocol number}) ${SRC} ${DST} [log]`
  + ` | icmp ${SRC} ${DST} [(echo | echo-reply | unreachable | time-exceeded | itype:<0-255>{ICMP message type})] [log]`
  + ` | (tcp | udp) ${SRC} ${SPORT} ${DST} ${DPORT} [established] [log])`;

const PROTOS = ['ip', 'ospf', 'eigrp', 'gre', 'esp', 'ahp', 'pim', 'icmp', 'tcp', 'udp'];
const NUM_TO_PROTO = { 0: 'ip', 1: 'icmp', 6: 'tcp', 17: 'udp', 47: 'gre', 50: 'esp', 51: 'ahp', 88: 'eigrp', 89: 'ospf', 103: 'pim' };

function addr(a, p) {
  if (a[`${p}any`]) return { any: true };
  if (a[`${p}hk`]) return { addr: parseIp(a[`${p}host`]), wild: 0 };
  const ip = parseIp(a[`${p}addr`]);
  const wild = a[`${p}wild`] !== undefined ? parseIp(a[`${p}wild`]) : 0;
  return { addr: (ip & ~wild) >>> 0, wild };
}

function portNum(proto, v) {
  if (/^\d+$/.test(v)) return Number(v);
  const t = proto === 'udp' ? UDP_PORTS : TCP_PORTS;
  return t[v.toLowerCase()];
}

function ports(a, p, proto) {
  for (const op of ['eq', 'neq', 'lt', 'gt']) {
    if (a[`${p}${op}`]) return { op, ports: [portNum(proto, a[`${p}port`])] };
  }
  if (a[`${p}range`]) return { op: 'range', ports: [portNum(proto, a[`${p}p1`]), portNum(proto, a[`${p}p2`])] };
  return null;
}

/** Build an ACE object from parsed args. */
export function buildAce(a, type) {
  const action = a.permit ? 'permit' : 'deny';
  if (type === 'standard') return { action, src: addr(a, 's'), log: !!a.log };
  let proto = PROTOS.find((p) => a[p]);
  if (!proto && a.pnum !== undefined) proto = NUM_TO_PROTO[Number(a.pnum)];
  if (!proto) return { error: '% Protocol number not supported by this simulator' };
  const e = { action, proto, src: addr(a, 's'), dst: addr(a, 'd'), log: !!a.log };
  if (proto === 'tcp' || proto === 'udp') {
    const sp = ports(a, 's', proto); const dp = ports(a, 'd', proto);
    if ((sp && sp.ports.includes(undefined)) || (dp && dp.ports.includes(undefined))) return { error: `% ${proto.toUpperCase()} port name not valid for this protocol` };
    if (sp) e.srcPort = sp;
    if (dp) e.dstPort = dp;
    if (a.established) {
      if (proto !== 'tcp') return { error: '% established is only valid for TCP' };
      e.established = true;
    }
  }
  if (proto === 'icmp') {
    const t = ['echo', 'echo-reply', 'unreachable', 'time-exceeded'].find((k) => a[k]);
    if (t) e.icmp = t; else if (a.itype !== undefined) e.icmp = String(a.itype);
  }
  return e;
}

export function ensureAcl(s, name, type, numbered) {
  const key = String(name);
  let acl = s.cfg.acls.get(key);
  if (!acl) {
    acl = { name: key, type, numbered, entries: [] };
    s.cfg.acls = new Map(s.cfg.acls).set(key, acl);
  }
  return acl;
}

export function nextSeq(acl) {
  const max = acl.entries.reduce((m, e) => Math.max(m, e.seq), 0);
  return Math.floor(max / 10) * 10 + 10;
}
