// Builds a Network from a lab definition, loads startup-style configs through
// the real CLI parser, serializes/restores state, and handles reload.

import { Network } from './network.js';
import { IosSession } from './cli/session.js';
import { PcShell, applyHostConfig } from './pc.js';
import { createDevice, isIos, isHost } from './device.js';
import { renderRunning } from './render-config.js';
import { secret9, ipStr } from './util.js';
import { normalizeIfName } from './ifnames.js';
import { ribLookup } from './routing.js';

const BENIGN = /^(% (Access|Voice) VLAN does not exist|%Warning: portfast|%Portfast has been|% Login disabled|Creating a port-channel| host\.| interface|  when|Use with| have effect|% OSPF: Reference bandwidth|        Please ensure|Enter TEXT message|The name for the keys|% The key modulus|% Generating|\[OK\]|Enter configuration commands)/;

function isLoadError(out) {
  return out.split('\n').some((l) => /^\s*(%|Bad mask|Command rejected|\^)/.test(l) && !BENIGN.test(l) && l.trim() !== '');
}

const SKIP = /^(Building configuration|Current configuration|end$|!|Using \d+ out of)/;

/** Feed config text into a device. Returns a list of { line, output } errors. */
export function loadConfig(net, dev, text, { full = false } = {}) {
  const errors = [];
  if (full && isIos(dev)) for (const i of dev.cfg.interfaces.values()) i.shutdown = false;
  if (isHost(dev)) {
    const sh = new PcShell(net, dev);
    text.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).forEach((line) => {
      const out = sh.input(line);
      if (/not recognized|not valid|Invalid|usage/i.test(out)) errors.push({ line, output: out });
    });
    return errors;
  }
  const s = new IosSession(net, dev);
  s.mode = 'config';
  s.loading = true;
  const wasQuiet = net.quiet;
  net.quiet = true;
  net.suspend = true;
  try {
    for (const raw of text.split('\n')) {
      if (s.pendingPrompt) { s.input(raw); continue; }
      const line = raw.replace(/\s+$/, '');
      const t = line.trim();
      if (!t || SKIP.test(t)) continue;
      if (s.mode === 'exec' || s.mode === 'user') s.mode = 'config';
      const out = s.input(line);
      if (isLoadError(out)) errors.push({ line: t, output: out });
    }
  } finally {
    net.quiet = wasQuiet;
    net.suspend = false;
    net.takeLogs(dev);
  }
  net.dirty = true;
  return errors;
}

function topoDevice(net, d) {
  const dev = net.addDevice(d);
  if (isHost(dev)) applyHostConfig(dev, d);
  return dev;
}

/** Build a lab network; optionally restore from a serialized snapshot. */
export function buildLab(lab, saved = null) {
  const net = new Network();
  net.lab = lab;
  net.quiet = true;
  lab.topology.devices.forEach((d) => topoDevice(net, d));
  lab.topology.links.forEach(([a, ai, b, bi]) => net.addLink(a, ai, b, bi));
  const errors = [];
  if (saved && saved.devices) {
    if (saved.offset) net.offset = saved.offset;
    for (const [name, st] of Object.entries(saved.devices)) {
      const dev = net.devices.get(name);
      if (!dev) continue;
      if (isHost(dev)) { Object.assign(dev.nic, reviveNic(st.nic)); continue; }
      errors.push(...loadConfig(net, dev, st.run, { full: true }).map((e) => ({ device: name, ...e })));
      dev.startup = st.startup || null;
      dev.cfg.rsa = st.rsa || null;
      (st.err || []).forEach(([ifn, why]) => dev.st.errDisabled.set(ifn, why));
      (st.snoop || []).forEach((b) => dev.st.snoopBindings.set(b.mac, b));
      (st.dhcp || []).forEach((b) => dev.st.dhcpBindings.set(b.ip, b));
      dev.cfg.lastChange = st.lastChange || dev.cfg.lastChange;
    }
  } else {
    for (const [name, text] of Object.entries(lab.initialConfig || {})) {
      const dev = net.device(name);
      errors.push(...loadConfig(net, dev, text).map((e) => ({ device: name, ...e })));
      if (isIos(dev)) {
        dev.cfg.lastChange = null;
        if (lab.saveInitial !== false) dev.startup = renderRunning(net, dev, { forStartup: true });
      }
    }
  }
  net.loadErrors = errors;
  net.dirty = true;
  net.converge();
  net.quiet = false;
  for (const dev of net.devices.values()) if (isIos(dev)) net.takeLogs(dev);
  if (!saved) net.announceWarnings();
  return net;
}

function reviveNic(n) {
  const out = { ...n };
  if (typeof n.gw6 === 'string') out.gw6 = BigInt(n.gw6);
  return out;
}

export function serialize(net) {
  const devices = {};
  for (const dev of net.devices.values()) {
    if (isHost(dev)) {
      const n = dev.nic;
      devices[dev.name] = { nic: { ...n, gw6: n.gw6 === null || n.gw6 === undefined ? null : String(n.gw6), lease: n.lease ? { ...n.lease } : null } };
      continue;
    }
    devices[dev.name] = {
      run: renderRunning(net, dev, { forStartup: true }),
      startup: dev.startup,
      rsa: dev.cfg.rsa,
      err: [...dev.st.errDisabled.entries()],
      lastChange: dev.cfg.lastChange,
      snoop: [...dev.st.snoopBindings.values()],
      dhcp: [...dev.st.dhcpBindings.values()],
    };
  }
  return { v: 1, offset: net.offset, devices };
}

export function reloadDevice(net, dev) {
  const fresh = createDevice(dev.def);
  const rsa = dev.cfg.rsa;
  dev.cfg = fresh.cfg;
  dev.st = fresh.st;
  dev.bootOffset = -(net.now() - net.base) - 754000 + 60000;
  if (dev.startup) loadConfig(net, dev, dev.startup, { full: true });
  else dev.cfg.hostname = dev.type === 'router' ? 'Router' : 'Switch';
  dev.cfg.rsa = rsa;
  dev.cfg.lastChange = null;
  net.dirty = true;
}

// ---------- Network helpers that need the CLI ----------
Network.prototype.newIosSession = function newIosSession(dev) { return new IosSession(this, dev); };

Network.prototype.openSession = function openSession(name) {
  if (!this.sessions.has(name)) {
    const dev = this.device(name);
    this.sessions.set(name, isHost(dev) ? new PcShell(this, dev) : new IosSession(this, dev));
  }
  return this.sessions.get(name);
};

Network.prototype.serialize = function ser() { return serialize(this); };

Network.prototype.loadConfigInto = function lci(dev, text) { return loadConfig(this, dev, text); };

Network.prototype.checkSecret = function checkSecret(stored, pw) {
  return stored && stored.type === 9 && stored.hash === secret9(pw);
};

Network.prototype.checkPassword = function checkPassword(stored, pw) { return !!stored && stored.plain === pw; };

Network.prototype.deviceByIp = function deviceByIp(ip) {
  this.converge();
  for (const dev of this.devices.values()) {
    if (isHost(dev)) { if (dev.nic.ip === ip) return dev; continue; }
    for (const l of dev.l3.values()) if (l.up && (l.ip === ip || l.secondary.some((x) => x.addr === ip))) return dev;
  }
  return null;
};

Network.prototype.bootBanner = function bootBanner(dev) {
  return `Cisco IOS XE Software, Version 17.09.04a\n${dev.hw.model} with ${dev.hw.ports.length} Gigabit Ethernet interfaces\n${dev.cfg.banner ? `\n${dev.cfg.banner}\n` : ''}`;
};

Network.prototype.consoleLogin = function consoleLogin(s) {
  const con = s.cfg.lines.con;
  const banner = s.cfg.banner ? `${s.cfg.banner}\n` : '';
  if (con.loginLocal) {
    const askUser = () => s.ask('Username: ', (u) => {
      s.ask('Password: ', (pw) => {
        const user = s.cfg.users.get(u.trim());
        const ok = user && ((user.secret && this.checkSecret(user.secret, pw)) || (user.password && user.password.plain === pw));
        if (ok) { s.enter(user.privilege >= 15 ? 'exec' : 'user'); return ''; }
        askUser();
        return '% Login invalid\n';
      }, true);
      return '';
    });
    askUser();
    return `${banner}\nUser Access Verification\n`;
  }
  if (con.login && con.password) {
    const askPw = () => s.ask('Password: ', (pw) => {
      if (pw === con.password.plain) { s.enter('user'); return ''; }
      askPw();
      return '';
    }, true);
    askPw();
    return `${banner}\nUser Access Verification\n`;
  }
  s.enter('user');
  return banner;
};

Network.prototype.clearOspf = function clearOspf(dev) {
  this.converge();
  dev.st.rids = new Map();
  for (const [key, af] of [['ospfDr', 4], ['ospf6Dr', 6]]) {
    const m = this[key];
    for (const [k, v] of m) {
      const mine = (x) => x && x.startsWith(`${dev.name}|`);
      if (mine(v.dr) || mine(v.bdr)) m.set(k, { dr: mine(v.dr) ? null : v.dr, bdr: mine(v.bdr) ? null : v.bdr });
    }
    const res = af === 4 ? this.ospf : this.ospf6;
    if (!res) continue;
    const affected = [];
    for (const [devName, list] of res.nbrs) {
      list.forEach((n) => {
        if (n.state !== 'FULL') return;
        if (devName === dev.name || n.peerDev === dev.name) affected.push({ devName, n });
      });
    }
    affected.forEach(({ devName, n }) => {
      const key2 = `${af}|${devName}|${n.ifName}|${n.rid}|${n.pid}`;
      const d = this.devices.get(devName);
      const tag = af === 6 ? 'OSPFv3-5-ADJCHG' : 'OSPF-5-ADJCHG';
      this.log(d, `%${tag}: Process ${n.pid}, Nbr ${ipStr(n.rid)} on ${n.ifName} from FULL to DOWN, Neighbor Down: Interface down or detached`);
      if (this.prevSnapshot) this.prevSnapshot.adj.delete(key2);
    });
  }
  this.dirty = true;
};

// ---------- convenience API for lab checks ----------
function ipNum(x) { return typeof x === 'number' ? x : x.split('.').reduce((a, o) => a * 256 + Number(o), 0); }

Object.assign(Network.prototype, {
  /** True if `from` gets at least one echo reply from `ip` (up to `tries` echoes, ARP warm-up included). */
  canPing(from, ip, { tries = 4, source = null } = {}) {
    const dev = this.device(from);
    const id = this.nextId();
    const src = source === null ? null : ipNum(source);
    for (let i = 0; i < tries; i += 1) {
      if (this.echo(dev, ipNum(ip), { id, seq: i, src }).code === '!') return true;
    }
    return false;
  },
  canPing6(from, ip6) {
    const dev = this.device(from);
    const parts = ip6;
    const id = this.nextId();
    // eslint-disable-next-line no-use-before-define
    const big = parseBig6(parts);
    for (let i = 0; i < 3; i += 1) if (this.echo6(dev, big, { id, seq: i }).code === '!') return true;
    return false;
  },
  tcpOpen(from, ip, port) { return this.tcpConnect(this.device(from), ipNum(ip), port) === 'open'; },
  show(name, cmd) {
    this.converge();
    const s = new IosSession(this, this.device(name));
    s.mode = 'exec';
    const quiet = this.quiet;
    this.quiet = true;
    try { return s.run(cmd); } finally { this.quiet = quiet; }
  },
  cfgOf(name) { return this.device(name).cfg; },
  iface(name, ifName) { return this.device(name).cfg.interfaces.get(normalizeIfName(ifName)) || null; },
  routeTo(name, ip) {
    this.converge();
    return ribLookup(this.device(name), ipNum(ip));
  },
  ribHas(name, prefix, proto) {
    this.converge();
    const [p, len] = prefix.split('/');
    return (this.device(name).rib || []).some((r) => r.net === ipNum(p) && r.len === Number(len) && (!proto || r.proto === proto));
  },
  ospfNbrs(name, af = 4) {
    this.converge();
    const res = af === 6 ? this.ospf6 : this.ospf;
    return ((res && res.nbrs.get(name)) || []).map((n) => ({ rid: ipStr(n.rid), state: n.state, role: n.role, ifName: n.ifName, peer: n.peerDev }));
  },
  ospfIfState(name, ifName) {
    this.converge();
    const oi = ((this.ospf && this.ospf.ifs.get(name)) || []).find((x) => x.l.name === normalizeIfName(ifName));
    return oi ? oi.drState || oi.netType : null;
  },
  stpInfo(name, vlan) {
    this.converge();
    const inst = this.device(name).stp?.get(vlan);
    if (!inst) return null;
    const ports = {};
    inst.ports.forEach((r, p) => { ports[p] = { role: r.role, state: r.state, inc: r.inc }; });
    return { isRoot: inst.isRoot, rootPort: inst.rootPort, rootMac: inst.rootBid.mac, rootPrio: inst.rootBid.prio, ports };
  },
  ifStatus(name, ifName) {
    this.converge();
    const l = this.device(name).l3.get(normalizeIfName(ifName));
    return l ? l.status : null;
  },
  errDisabled(name, ifName) { this.converge(); return this.device(name).st.errDisabled.has(normalizeIfName(ifName)); },
  trunkOper(name, ifName) { this.converge(); const p = this.device(name).l2.get(normalizeIfName(ifName)); return p && p.up ? p.oper : null; },
  channel(name, group) {
    this.converge();
    const ch = this.device(name).chan.get(group);
    if (!ch) return null;
    return { up: !!ch.up, proto: ch.proto, members: Object.fromEntries(ch.members) };
  },
  hsrpRole(name, ifName, grp = 0) {
    this.converge();
    const h = this.device(name).hsrp?.get(`${normalizeIfName(ifName)}|${grp}`);
    return h ? h.state : null;
  },
  hostIp(name) { this.converge(); const n = this.device(name).nic; return n.ip === null ? null : ipStr(n.ip); },
  hostCfg(name) {
    const n = this.device(name).nic;
    return { ip: n.ip === null ? null : ipStr(n.ip), mask: n.mask === null ? null : ipStr(n.mask), gateway: n.gw === null ? null : ipStr(n.gw), dhcp: n.dhcp, apipa: n.apipa };
  },
});

function parseBig6(s) {
  const parts = s.toLowerCase().split('::');
  const head = parts[0] ? parts[0].split(':') : [];
  const tail = parts.length > 1 && parts[1] ? parts[1].split(':') : [];
  const fill = 8 - head.length - tail.length;
  const groups = [...head, ...Array(parts.length > 1 ? fill : 0).fill('0'), ...tail].map((g) => BigInt(parseInt(g, 16)));
  return groups.reduce((a, g) => (a << 16n) | g, 0n);
}

export { Network };
