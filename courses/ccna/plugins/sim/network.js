// Network: devices + links, the convergence pipeline (L1 -> EtherChannel ->
// DTP -> STP -> L3 -> HSRP -> OSPF/RIB -> CDP), syslog generation, and the
// probe primitives (ping, traceroute, TCP) used by the CLI and lab checks.

import { createDevice, isIos, isHost, isSwitch } from './device.js';
import { normalizeIfName, shortIf, isSubif } from './ifnames.js';
import { computeL1, computeChannels, computeL2Ports } from './link.js';
import { computeStp } from './stp.js';
import { computeL3, buildRib, buildRib6 } from './routing.js';
import { computeOspf } from './ospf.js';
import { computeHsrp, computeDiscovery, cdpWarnings, stpWarnings, ospfWarnings } from './services.js';
import { l3Input, originate, originate6, sendGarp, routeFor } from './packets.js';
import { l3Transmit } from './frames.js';
import { dhcpClient } from './dhcp.js';
import { BROADCAST_MAC, logStamp, configStamp, hashStr, ipStr, parseIp } from './util.js';

const START = Date.UTC(2026, 9, 24, 9, 0, 0);

export class Network {
  constructor({ realtime = typeof window !== 'undefined' } = {}) {
    this.devices = new Map();
    this.order = [];
    this.links = [];
    this.peers = new Map();
    this.realtime = realtime;
    this.created = realtime ? Date.now() : 0;
    this.base = realtime ? Date.now() : START;
    this.offset = 0;
    this.dirty = true;
    this.quiet = false;
    this.probes = new Map();
    this.ospfDr = new Map();
    this.ospf6Dr = new Map();
    this.hsrpState = new Map();
    this.leases = new Map();
    this.sessions = new Map();
    this.idSeq = 1;
    this.seed = 0x2545f491;
    this.prevSnapshot = null;
    this.warnKeys = new Set();
    this.converging = false;
  }

  // ---------- clock / random ----------
  now() { return this.base + (this.realtime ? Date.now() - this.created : 0) + this.offset; }
  advance(ms) { this.offset += ms; }
  stamp() { return configStamp(new Date(this.now())); }
  rand() {
    this.seed ^= this.seed << 13; this.seed ^= this.seed >>> 17; this.seed ^= this.seed << 5;
    return ((this.seed >>> 0) % 1000000) / 1000000;
  }
  nextId() { this.idSeq += 1; return this.idSeq; }

  // ---------- topology ----------
  addDevice(def) {
    if (this.devices.has(def.name)) throw new Error(`duplicate device ${def.name}`);
    const dev = createDevice(def);
    this.devices.set(def.name, dev);
    this.order.push(def.name);
    return dev;
  }

  device(name) {
    const d = this.devices.get(name);
    if (!d) throw new Error(`no such device ${name}`);
    return d;
  }

  deviceList() { return this.order.map((n) => ({ name: n, type: this.devices.get(n).type })); }

  addLink(a, ai, b, bi) {
    const da = this.device(a); const db = this.device(b);
    const ia = this.portName(da, ai); const ib = this.portName(db, bi);
    for (const [d, i] of [[a, ia], [b, ib]]) {
      if (this.peers.has(`${d}|${i}`)) throw new Error(`${d} ${i} already linked`);
    }
    this.links.push([a, ia, b, ib]);
    this.peers.set(`${a}|${ia}`, { dev: db, ifName: ib });
    this.peers.set(`${b}|${ib}`, { dev: da, ifName: ia });
    this.dirty = true;
  }

  portName(dev, raw) {
    if (isHost(dev)) return 'eth0';
    const n = normalizeIfName(raw);
    if (!n || !dev.cfg.interfaces.has(n) || isSubif(n)) throw new Error(`${dev.name}: bad port ${raw}`);
    return n;
  }

  peer(devName, ifName) { return this.peers.get(`${devName}|${ifName}`) || null; }

  // ---------- change tracking / logs ----------
  configChanged(dev) {
    this.dirty = true;
    if (dev && dev.cfg) dev.cfg.lastChange = { at: this.now(), by: 'console' };
  }

  log(dev, msg) {
    if (this.quiet || !isIos(dev)) return;
    const line = `${logStamp(new Date(this.now()))}: ${msg}`;
    dev.st.logs.push(line);
    if (dev.st.logs.length > 200) dev.st.logs.shift();
    dev.pendingLogs = [...(dev.pendingLogs || []), line];
  }

  takeLogs(dev) {
    const out = dev.pendingLogs || [];
    dev.pendingLogs = [];
    return out;
  }

  errDisable(dev, ifName, reason) {
    dev.st.errDisabled.set(ifName, reason);
    this.dirty = true;
  }

  // ---------- convergence ----------
  converge() {
    if (!this.dirty || this.converging || this.suspend) return;
    this.converging = true;
    try {
      for (let round = 0; round < 6 && this.dirty; round += 1) {
        this.dirty = false;
        this.convergeOnce();
      }
    } finally {
      this.converging = false;
    }
  }

  convergeOnce() {
    for (let pass = 0; pass < 6; pass += 1) {
      computeL1(this);
      const chErr = computeChannels(this);
      if (chErr.length) {
        chErr.forEach((e) => {
          this.log(e.dev, `%PM-4-ERR_DISABLE: channel-misconfig (STP) error detected on ${shortIf(e.po)}, putting ${shortIf(e.ifName)} in err-disable state`);
          e.dev.st.errDisabled.set(e.ifName, 'channel-misconfig (STP)');
        });
        continue;
      }
      computeL2Ports(this);
      const { errdisable } = computeStp(this);
      if (errdisable.length) {
        errdisable.forEach(({ dev, port }) => {
          this.log(dev, `%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port ${port.name} with BPDU Guard enabled. Disabling port.`);
          this.log(dev, `%PM-4-ERR_DISABLE: bpduguard error detected on ${shortIf(port.name)}, putting ${shortIf(port.name)} in err-disable state`);
          port.members.forEach((m) => dev.st.errDisabled.set(m, 'bpduguard'));
        });
        continue;
      }
      break;
    }
    computeL3(this);
    this.l2cache = new Map();
    computeHsrp(this);
    const t = this.now();
    for (const dev of this.devices.values()) buildRib(dev, [], t);
    const o4 = computeOspf(this, 4);
    for (const dev of this.devices.values()) buildRib(dev, o4.routes.get(dev.name) || [], t);
    const o4b = computeOspf(this, 4);
    for (const dev of this.devices.values()) buildRib(dev, o4b.routes.get(dev.name) || [], t);
    this.ospf = o4b;
    for (const dev of this.devices.values()) buildRib6(dev, [], t);
    const o6 = computeOspf(this, 6);
    for (const dev of this.devices.values()) buildRib6(dev, o6.routes.get(dev.name) || [], t);
    this.ospf6 = o6;
    computeDiscovery(this);
    this.emitDiffLogs();
    this.afterTopology();
  }

  snapshot() {
    const snap = { ifs: new Map(), adj: new Map(), hsrp: new Map() };
    for (const dev of this.devices.values()) {
      if (!isIos(dev)) continue;
      for (const [name, l] of dev.l3) {
        if (isSubif(name)) continue;
        snap.ifs.set(`${dev.name}|${name}`, l.status.join('/'));
      }
      for (const [k, h] of dev.hsrp || []) snap.hsrp.set(`${dev.name}|${k}`, h.state);
    }
    for (const [af, res] of [[4, this.ospf], [6, this.ospf6]]) {
      if (!res) continue;
      for (const [devName, list] of res.nbrs) {
        list.forEach((n) => snap.adj.set(`${af}|${devName}|${n.ifName}|${n.rid}|${n.pid}`, n.state));
      }
    }
    return snap;
  }

  emitDiffLogs() {
    const snap = this.snapshot();
    const prev = this.prevSnapshot;
    this.prevSnapshot = snap;
    if (!prev) {
      this.warnKeys = new Set([...cdpWarnings(this), ...stpWarnings(this), ...ospfWarnings(this)].map((w) => `${w.dev.name}|${w.key}`));
      return;
    }
    for (const [k, cur] of snap.ifs) {
      const [devName, ifName] = k.split('|');
      const dev = this.devices.get(devName);
      const was = prev.ifs.get(k);
      if (was === cur) continue;
      const [ws, wp] = (was || 'administratively down/down').split('/');
      const [cs, cp] = cur.split('/');
      const ifc = dev.cfg.interfaces.get(ifName);
      const ch = ifc && ifc.channel && dev.chan && dev.chan.get(ifc.channel.group);
      if (ch && ch.members.get(ifName) === 's' && cp === 'down') {
        this.log(dev, `%EC-5-CANNOT_BUNDLE2: ${shortIf(ifName)} is not compatible with ${shortIf(ch.po)} and will be suspended (vlan mask is different)`);
        if (wp !== cp) this.log(dev, `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${ifName}, changed state to down`);
        continue;
      }
      if (cs !== ws) {
        if (cs === 'administratively down') this.log(dev, `%LINK-5-CHANGED: Interface ${ifName}, changed state to administratively down`);
        else if (!(ifName.startsWith('Vlan') && cs === 'up' && ws !== 'administratively down')) this.log(dev, `%LINK-3-UPDOWN: Interface ${ifName}, changed state to ${cs}`);
      }
      if (cp !== wp) this.log(dev, `%LINEPROTO-5-UPDOWN: Line protocol on Interface ${ifName}, changed state to ${cp}`);
    }
    for (const [k, state] of snap.adj) {
      const was = prev.adj.get(k);
      if (state === 'FULL' && was !== 'FULL') this.adjLog(k, 'LOADING', 'FULL', 'Loading Done');
    }
    for (const [k, was] of prev.adj) {
      if (was === 'FULL' && snap.adj.get(k) !== 'FULL') {
        const [, devName, ifName] = k.split('|');
        const l = this.devices.get(devName).l3.get(ifName);
        const reason = !l || !l.up ? 'Interface down or detached' : 'Dead timer expired';
        this.adjLog(k, 'FULL', 'DOWN', `Neighbor Down: ${reason}`);
      }
    }
    for (const [k, state] of snap.hsrp) {
      const was = prev.hsrp.get(k) || 'Init';
      if (was === state) continue;
      const [devName, ifName, grp] = k.split('|');
      const dev = this.devices.get(devName);
      const from = state === 'Active' && was === 'Init' ? 'Standby' : was === 'Init' || was === 'Listen' ? 'Speak' : was;
      this.log(dev, `%HSRP-5-STATECHANGE: ${shortIf(ifName)} Grp ${grp} state ${from} -> ${state}`);
    }
    const warns = [...cdpWarnings(this), ...stpWarnings(this), ...ospfWarnings(this)];
    const keys = new Set();
    warns.forEach((w) => {
      const k = `${w.dev.name}|${w.key}`;
      keys.add(k);
      if (!this.warnKeys.has(k)) this.log(w.dev, w.msg);
    });
    for (const k of this.warnKeys) {
      if (keys.has(k)) continue;
      const [devName, kind, port, vlan, inc] = k.split('|');
      const dev = this.devices.get(devName);
      if (kind !== 'stp' || !dev) continue;
      const vl = `VLAN${String(vlan).padStart(4, '0')}`;
      if (inc === 'ROOT') this.log(dev, `%SPANTREE-2-ROOTGUARD_UNBLOCK: Root guard unblocking port ${port} on ${vl}.`);
      else this.log(dev, `%SPANTREE-2-UNBLOCK_CONSIST_PORT: Unblocking ${port} on ${vl}. Port consistency restored.`);
    }
    this.warnKeys = keys;
  }

  /** Re-announce current CDP/STP warnings (used once a lab is built). */
  announceWarnings() {
    [...cdpWarnings(this), ...stpWarnings(this), ...ospfWarnings(this)].forEach((w) => this.log(w.dev, w.msg));
  }

  adjLog(key, from, to, why) {
    const [af, devName, ifName, rid, pid] = key.split('|');
    const dev = this.devices.get(devName);
    const tag = af === '6' ? 'OSPFv3-5-ADJCHG: Process' : 'OSPF-5-ADJCHG: Process';
    this.log(dev, `%${tag} ${pid}, Nbr ${ipStr(Number(rid))} on ${ifName} from ${from} to ${to}, ${why}`);
  }

  l2Signature() {
    const parts = [];
    for (const dev of this.devices.values()) {
      for (const [p, s] of dev.l1) if (s.up) parts.push(`${dev.name}|${p}`);
      if (dev.stp) for (const [v, inst] of dev.stp) for (const [p, r] of inst.ports) if (r.state === 'FWD') parts.push(`${dev.name}|${v}|${p}`);
      if (dev.l2) for (const [p, port] of dev.l2) parts.push(`${dev.name}|${p}|${port.oper}`);
      for (const [n, l] of dev.l3) if (l.up) parts.push(`${dev.name}|${n}|${l.ip}|${l.tag}`);
      for (const [k, h] of dev.hsrp || []) parts.push(`${dev.name}|${k}|${h.state}`);
    }
    return parts.join(',');
  }

  afterTopology() {
    const sig = this.l2Signature();
    const changed = sig !== this.lastSig;
    this.lastSig = sig;
    if (changed) {
      for (const dev of this.devices.values()) {
        if (isSwitch(dev)) {
          const keep = new Map();
          dev.st.mac.forEach((e, k) => { if (e.type === 'STATIC') keep.set(k, e); });
          dev.st.mac = keep;
        }
        if (isIos(dev)) {
          for (const [ip, e] of dev.st.arp) {
            const l = dev.l3.get(e.ifName);
            if (!l || !l.up) dev.st.arp.delete(ip);
          }
          for (const [name] of dev.st.psec) {
            const l1 = dev.l1.get(name);
            if (!l1 || !l1.up) dev.st.psec.get(name).macs.clear();
          }
        }
      }
      this.warmUp();
    }
    this.runDhcpClients();
  }

  warmUp() {
    for (const dev of this.devices.values()) {
      if (isHost(dev)) {
        const l = dev.l3.get('eth0');
        if (l.up) {
          if (dev.nic.ip !== null) sendGarp(this, dev, 'eth0', dev.nic.ip);
          else l3Transmit(this, dev, 'eth0', { src: dev.mac, dst: BROADCAST_MAC, type: 'hello' });
        }
        continue;
      }
      for (const l of dev.l3.values()) {
        if (!l.up || !l.l3 || l.ip === null || l.name.startsWith('Loopback')) continue;
        sendGarp(this, dev, l.name, l.ip);
      }
      for (const h of (dev.hsrp || new Map()).values()) {
        if (h.state === 'Active' && h.vip !== null) sendGarp(this, dev, h.p.l.name, h.vip, h.vmac);
      }
    }
  }

  runDhcpClients() {
    for (const dev of this.devices.values()) {
      if (isHost(dev)) {
        const n = dev.nic;
        if (!n.dhcp || n.releasedByUser || (n.lease && !n.apipa) || !dev.l3.get('eth0').up) continue;
        this.renewHost(dev);
        continue;
      }
      for (const [name, i] of dev.cfg.interfaces) {
        if (!i.dhcpClient) continue;
        const l = dev.l3.get(name);
        if (!l || !l.up || (dev.st.ifLeases && dev.st.ifLeases.has(name))) continue;
        dhcpClient(this, dev, name);
      }
    }
  }

  // ---------- DHCP client results ----------
  hostLease(dev, ack) {
    if (ack.xid !== dev.dhcpXid) return;
    dev.dhcpXid = null;
    this.leases.set(dev.mac, ack);
    Object.assign(dev.nic, {
      ip: ack.yiaddr, mask: ack.mask, gw: ack.router, dns: ack.dns || [], lease: { ...ack, obtained: this.now() }, apipa: false,
      domain: ack.domain || null,
    });
    dev.l3.get('eth0').ip = ack.yiaddr;
    dev.l3.get('eth0').mask = ack.mask;
    this.dirty = true;
  }

  ifLease(dev, ifName, ack) {
    if (ack.xid !== dev.dhcpXid) return;
    dev.dhcpXid = null;
    dev.st.ifLeases = dev.st.ifLeases || new Map();
    dev.st.ifLeases.set(ifName, { ip: ack.yiaddr, mask: ack.mask, gw: ack.router });
    this.log(dev, `%DHCP-6-ADDRESS_ASSIGN: Interface ${ifName} assigned DHCP address ${ipStr(ack.yiaddr)}, mask ${ipStr(ack.mask)}, hostname ${dev.cfg.hostname}`);
    this.dirty = true;
  }

  lastLeaseFor(mac) { return this.leases.get(mac) || null; }

  renewHost(dev) {
    this.leases.delete(dev.mac);
    const ack = dhcpClient(this, dev, 'eth0');
    if (!ack) {
      const h = hashStr(`apipa:${dev.name}`);
      Object.assign(dev.nic, {
        ip: parseIp(`169.254.${(h >>> 8) % 254 + 1}.${h % 254 + 1}`), mask: parseIp('255.255.0.0'), gw: null, lease: null, apipa: true,
      });
      dev.l3.get('eth0').ip = dev.nic.ip;
      dev.l3.get('eth0').mask = dev.nic.mask;
    }
    return ack;
  }

  // ---------- L2 broadcast domain probe ----------
  l2Domain(dev, ifName) {
    const key = `${dev.name}|${ifName}`;
    if (this.l2cache && this.l2cache.has(key)) return this.l2cache.get(key);
    const l = dev.l3.get(ifName);
    const seen = [];
    if (l && l.up) l3Transmit(this, dev, ifName, { src: l.mac, dst: BROADCAST_MAC, type: 'probe', probe: seen });
    const uniq = [];
    seen.forEach((e) => {
      if (e.dev === dev && e.ifName === ifName) return;
      if (!uniq.some((u) => u.dev === e.dev && u.ifName === e.ifName)) uniq.push(e);
    });
    if (this.l2cache) this.l2cache.set(key, uniq);
    return uniq;
  }

  l3Input(dev, ifName, frame) { l3Input(this, dev, ifName, frame); }

  // ---------- HSRP helpers for the data plane ----------
  hsrpEntries(dev, ifName) {
    if (!dev.hsrp) return [];
    return [...dev.hsrp.values()].filter((h) => h.p.l.name === ifName && h.state === 'Active');
  }
  hsrpVipActive(dev, ifName, ip) { return this.hsrpEntries(dev, ifName).some((h) => h.vip === ip); }
  hsrpOwnsMac(dev, ifName, mac) { return this.hsrpEntries(dev, ifName).some((h) => h.vmac === mac); }
  hsrpVmac(dev, ifName, ip) { const h = this.hsrpEntries(dev, ifName).find((x) => x.vip === ip); return h ? h.vmac : null; }

  // ---------- probes ----------
  /** One ICMP echo. Returns { code: '!'|'.'|'U'|'N'|..., ttl, from, status }. */
  echo(dev, dst, { src = null, id, seq, ttl, wait } = {}) {
    this.converge();
    const key = `e:${id}:${seq}`;
    this.probes.delete(key);
    const status = originate(this, dev, { src, dst, proto: 'icmp', ttl, icmp: { type: 'echo', id, seq } }, { wait: wait ?? isHost(dev) });
    const r = this.probes.get(key);
    this.converge();
    if (r && r.dev === dev.name) {
      if (r.type === 'reply') return { code: '!', ttl: r.ttl, from: r.from, status };
      if (r.type === 'unreach') return { code: 'U', from: r.from, unreachCode: r.code, status };
      if (r.type === 'ttl-exceeded') return { code: 'T', from: r.from, status };
    }
    return { code: '.', status };
  }

  echo6(dev, dst, { id, seq, hlim } = {}) {
    this.converge();
    const key = `e6:${id}:${seq}`;
    this.probes.delete(key);
    const status = originate6(this, dev, { dst, proto: 'icmp6', hlim, icmp: { type: 'echo', id, seq } });
    const r = this.probes.get(key);
    if (r && r.dev === dev.name) return { code: r.type === 'reply' ? '!' : r.type === 'unreach' ? 'U' : 'T', from: r.from, ttl: r.ttl, status };
    return { code: '.', status };
  }

  udpProbe(dev, dst, ttl, sport, src = null) {
    this.converge();
    const key = `u:${sport}`;
    this.probes.delete(key);
    const status = originate(this, dev, { src, dst, proto: 'udp', sport, dport: 33434 + (sport % 100), ttl }, { wait: true });
    const r = this.probes.get(key);
    return r && r.dev === dev.name ? { ...r, status } : { type: 'timeout', status };
  }

  /** TCP connect with SYN retransmissions (3 tries, like a real stack). */
  tcpConnect(dev, dst, port) {
    let r = 'timeout';
    for (let i = 0; i < 3 && r === 'timeout'; i += 1) {
      r = this.tcpSyn(dev, dst, port);
      if (r === 'timeout') this.advance(1000 * (i + 1));
    }
    return r;
  }

  tcpSyn(dev, dst, port) {
    this.converge();
    const sport = 49152 + (this.nextId() % 16000);
    const key = `t:${sport}`;
    this.probes.delete(key);
    const status = originate(this, dev, { dst, proto: 'tcp', sport, dport: port, flags: 'S' }, { wait: true });
    const r = this.probes.get(key);
    this.converge();
    if (r && r.dev === dev.name) return r.type === 'synack' ? 'open' : r.type === 'rst' ? 'refused' : 'unreachable';
    return status === 'sent' ? 'timeout' : status;
  }

  routeFor(dev, ip) { this.converge(); return routeFor(this, dev, ip); }

  /**
   * What-if probe for lab checks: apply `mutate` (which returns an undo fn),
   * run `probe`, undo, and reconverge - all silently (no syslog, no state kept).
   */
  simulate(mutate, probe) {
    this.converge();
    const quiet = this.quiet;
    this.quiet = true;
    const savedDr = [new Map(this.ospfDr), new Map(this.ospf6Dr), new Map(this.hsrpState)];
    let undo = null;
    try {
      undo = mutate(this);
      this.dirty = true;
      this.converge();
      return probe(this);
    } finally {
      if (undo) undo();
      [this.ospfDr, this.ospf6Dr, this.hsrpState] = savedDr;
      this.dirty = true;
      this.converge();
      this.prevSnapshot = this.snapshot();
      this.quiet = quiet;
    }
  }
}
