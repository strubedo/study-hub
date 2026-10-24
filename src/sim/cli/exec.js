// User/privileged EXEC commands: enable, configure, ping (incl. extended),
// traceroute, copy/write, reload, clear, terminal, ssh/telnet, and the show tree.

import { parseIp, ipStr, parseIp6, ip6Big, bigIp6, ip6Str } from '../util.js';
import { registerShow } from './show-cmds.js';
import { renderRunning } from '../render-config.js';
import { connectRemote } from './remote.js';
import { reloadDevice } from '../loader.js';
import { normalizeIfName } from '../ifnames.js';

const BOTH = ['user', 'exec'];

export function registerExec(def) {
  def(BOTH, 'enable', (s) => doEnable(s));
  def('exec', 'disable', (s) => { s.enter('user'); });
  def(BOTH, 'exit', (s) => doLogout(s));
  def(BOTH, 'logout', (s) => doLogout(s));
  def('exec', 'configure terminal', (s) => enterConfig(s));
  def('exec', 'configure', (s) => {
    s.ask('Configuring from terminal, memory, or network [terminal]? ', (ans) => {
      if (ans.trim() === '' || /^t/i.test(ans.trim())) return enterConfig(s);
      return '?Must be "terminal", "memory" or "network"';
    });
  });
  def('exec', 'write [memory]', (s) => saveConfig(s));
  def('exec', 'copy running-config startup-config', (s) => {
    s.ask('Destination filename [startup-config]? ', () => saveConfig(s));
  });
  def('exec', 'copy startup-config running-config', (s) => {
    s.ask('Destination filename [running-config]? ', () => {
      if (!s.dev.startup) return '%Error opening nvram:/startup-config (No such file or directory)';
      s.net.loadConfigInto(s.dev, s.dev.startup);
      return `${s.dev.startup.length} bytes copied in 0.051 secs`;
    });
  });
  def('exec', '(write erase | erase startup-config)', (s) => {
    s.ask('Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]', (ans) => {
      if (ans.trim() && !/^y/i.test(ans.trim())) return '';
      s.dev.startup = null;
      return '[OK]\nErase of nvram: complete';
    });
  });
  def('exec', 'reload', (s) => doReload(s));
  def(BOTH, 'terminal length <0-512>', () => '');
  def(BOTH, 'terminal monitor', () => '');
  def('exec', 'clear ip ospf process', (s) => {
    s.ask('Reset ALL OSPF processes? [no]: ', (ans) => {
      if (!/^y/i.test(ans.trim())) return '';
      s.net.clearOspf(s.dev);
      return '';
    });
  });
  def('exec', 'clear arp-cache', (s) => { s.dev.st.arp.clear(); });
  def('exec', 'clear mac address-table dynamic', (s) => {
    for (const [k, e] of s.dev.st.mac) if (e.type === 'DYNAMIC') s.dev.st.mac.delete(k);
  }, { only: 'switch' });
  def('exec', 'clear ip nat translation *', (s) => { s.dev.st.nat = []; }, { only: 'router' });
  def('exec', 'clear access-list counters [acl:WORD]', (s, a) => {
    for (const k of [...s.dev.st.aclHits.keys()]) if (!a.acl || k.startsWith(`${a.acl}|`)) s.dev.st.aclHits.delete(k);
  });
  def('exec', 'clear counters', (s) => {
    s.ask('Clear "show interface" counters on all interfaces [confirm]', () => { s.dev.st.counters = new Map(); return ''; });
  });
  def('exec', 'clear ip dhcp binding *', (s) => { s.dev.st.dhcpBindings = new Map(); });
  def('exec', 'clear errdisable interface IFACE', (s, a) => { s.dev.st.errDisabled.delete(a.iface); s.net.configChanged(); }, { only: 'switch' });

  const opts = '[(repeat rep:<1-2147483647>{Repeat count} | size sz:<36-18024>{Datagram size} | source (srcip:A.B.C.D{Source address} | IFACE) | timeout to:<0-3600>{Timeout in seconds} | df-bit{Enable do not fragment bit in IP header})]';
  const many = `${opts} ${opts} ${opts} ${opts}`;
  def(BOTH, `ping dst:A.B.C.D{Ping destination address or hostname} ${many}`, (s, a) => pingIos(s, a));
  def(BOTH, `ping ip dst:A.B.C.D{Ping destination address or hostname} ${many}`, (s, a) => pingIos(s, a));
  def(BOTH, 'ping ipv6 dst6:X:X:X:X::X [repeat rep:<1-2147483647>]', (s, a) => ping6Ios(s, a));
  def(BOTH, 'ping dst6:X:X:X:X::X [repeat rep:<1-2147483647>]', (s, a) => ping6Ios(s, a));
  def(BOTH, 'ping name:WORD', (s, a) => `Translating "${a.name}"...domain server (255.255.255.255)\n% Unrecognized host or address, or protocol not running.`);
  def('exec', 'ping', (s) => extendedPing(s));
  def(BOTH, 'traceroute dst:A.B.C.D [source (srcip:A.B.C.D | IFACE)]', (s, a) => tracerouteIos(s, a));
  def(BOTH, 'traceroute ip dst:A.B.C.D [source (srcip:A.B.C.D | IFACE)]', (s, a) => tracerouteIos(s, a));
  def(BOTH, 'ssh -l user:WORD{Log in using this user name} dst:A.B.C.D{IP address of a remote system}', (s, a) => connectRemote(s, 'ssh', parseIp(a.dst), a.user));
  def(BOTH, 'telnet dst:A.B.C.D{IP address of a remote system}', (s, a) => connectRemote(s, 'telnet', parseIp(a.dst), null));
  registerShow(def);
}

function doEnable(s) {
  if (s.mode === 'exec') return '';
  const secret = s.cfg.enableSecret; const pw = s.cfg.enablePassword;
  if (!secret && !pw) {
    if (s.vty) return '% No password set';
    s.enter('exec'); return '';
  }
  let tries = 0;
  const attempt = (ans) => {
    if ((secret && s.net.checkSecret(secret, ans)) || (!secret && pw && s.net.checkPassword(pw, ans))) { s.enter('exec'); return ''; }
    tries += 1;
    if (tries >= 3) return '% Bad secrets\n';
    s.ask('Password: ', attempt, true);
    return '';
  };
  s.ask('Password: ', attempt, true);
  return '';
}

function doLogout(s) {
  if (s.remoteExit) return s.remoteExit();
  s.enter('user');
  s.ask(`\n${s.cfg.hostname} con0 is now available\n\n\n\n\n\nPress RETURN to get started.\n`, () => s.net.consoleLogin(s));
  return '';
}

function enterConfig(s) {
  s.enter('config');
  return 'Enter configuration commands, one per line.  End with CNTL/Z.';
}

function saveConfig(s) {
  s.dev.startup = renderRunning(s.net, s.dev, { forStartup: true });
  s.dev.savedAt = s.net.now();
  s.dev.modifiedSinceSave = false;
  return 'Building configuration...\n[OK]';
}

function doReload(s) {
  const proceed = () => {
    s.ask('Proceed with reload? [confirm]', (ans) => {
      if (ans.trim() && !/^y/i.test(ans.trim())) return '';
      reloadDevice(s.net, s.dev);
      s.enter('user');
      return `\n\n*** --- SHUTDOWN NOW ---\n\nInitializing Hardware ...\n\n${s.net.bootBanner(s.dev)}\nPress RETURN to get started!\n`;
    });
    return '';
  };
  if (s.dev.modifiedSinceSave !== false && s.dev.cfg.lastChange) {
    s.ask('System configuration has been modified. Save? [yes/no]: ', (ans) => {
      const a = ans.trim().toLowerCase();
      if (a.startsWith('y')) { const out = saveConfig(s); proceed(); return out; }
      if (a.startsWith('n')) return proceed();
      return '% Please answer \'yes\' or \'no\'.';
    });
    return '';
  }
  return proceed();
}

// ---------- ping ----------
function resolveSource(s, a) {
  if (a.srcip) {
    const ip = parseIp(a.srcip);
    const owns = [...s.dev.l3.values()].some((l) => l.ip === ip);
    if (!owns) return { error: `% Invalid source address- IP address not on any of our up interfaces` };
    return { ip };
  }
  if (a.iface) {
    const l = s.dev.l3.get(a.iface);
    if (!l || l.ip === null) return { error: `% Invalid source interface - ${a.iface}: No IPv4 address configured` };
    return { ip: l.ip };
  }
  return { ip: null };
}

export function runIosPing(s, dst, { repeat = 5, size = 100, timeout = 2, src = null } = {}) {
  s.net.converge();
  const lines = ['Type escape sequence to abort.', `Sending ${repeat}, ${size}-byte ICMP Echos to ${ipStr(dst)}, timeout is ${timeout} seconds:`];
  if (src !== null) lines.push(`Packet sent with a source address of ${ipStr(src)} `);
  let marks = '';
  let ok = 0;
  const id = s.net.nextId();
  for (let i = 0; i < repeat; i += 1) {
    const r = s.net.echo(s.dev, dst, { src, id, seq: i });
    const c = r.code === 'T' ? '.' : r.code;
    if (c === '!') { ok += 1; s.net.advance(2); } else s.net.advance(c === 'U' ? 5 : timeout * 1000);
    marks += c;
  }
  for (let i = 0; i < marks.length; i += 70) lines.push(marks.slice(i, i + 70));
  const pct = Math.floor((ok * 100) / repeat);
  lines.push(`Success rate is ${pct} percent (${ok}/${repeat})${ok ? ', round-trip min/avg/max = 1/1/2 ms' : ''}`);
  return lines.join('\n');
}

function pingIos(s, a) {
  const dst = parseIp(a.dst);
  const src = resolveSource(s, a);
  if (src.error) return src.error;
  return runIosPing(s, dst, { repeat: a.rep ? Number(a.rep) : 5, size: a.sz ? Number(a.sz) : 100, timeout: a.to ? Number(a.to) : 2, src: src.ip });
}

function ping6Ios(s, a) {
  const dst = ip6Big(parseIp6(a.dst6));
  const repeat = a.rep ? Number(a.rep) : 5;
  const lines = ['Type escape sequence to abort.', `Sending ${repeat}, 100-byte ICMP Echos to ${ip6Str(bigIp6(dst))}, timeout is 2 seconds:`];
  let marks = ''; let ok = 0;
  const id = s.net.nextId();
  for (let i = 0; i < repeat; i += 1) {
    const r = s.net.echo6(s.dev, dst, { id, seq: i });
    marks += r.code === 'T' ? '.' : r.code;
    if (r.code === '!') ok += 1;
  }
  for (let i = 0; i < marks.length; i += 70) lines.push(marks.slice(i, i + 70));
  lines.push(`Success rate is ${Math.floor((ok * 100) / repeat)} percent (${ok}/${repeat})${ok ? ', round-trip min/avg/max = 1/1/3 ms' : ''}`);
  return lines.join('\n');
}

function extendedPing(s) {
  const st = { repeat: 5, size: 100, timeout: 2, src: null, dst: null };
  const steps = [];
  const next = () => { const f = steps.shift(); if (f) f(); };
  const ask = (q, fn) => steps.push(() => s.ask(q, (ans) => { const r = fn(ans.trim()); if (r !== undefined) return r; next(); return ''; }));
  ask('Protocol [ip]: ', (v) => (v && !/^ip$/i.test(v) ? '% Unknown protocol - "' + v + '", type "ping ?" for help' : undefined));
  ask('Target IP address: ', (v) => {
    const ip = parseIp(v);
    if (ip === null) return '% Bad IP address';
    st.dst = ip;
    return undefined;
  });
  ask('Repeat count [5]: ', (v) => { if (v) st.repeat = Math.max(1, Number(v) || 5); return undefined; });
  ask('Datagram size [100]: ', (v) => { if (v) st.size = Number(v) || 100; return undefined; });
  ask('Timeout in seconds [2]: ', (v) => { if (v) st.timeout = Number(v) || 2; return undefined; });
  ask('Extended commands [n]: ', (v) => {
    if (!/^y/i.test(v)) return runIosPing(s, st.dst, st);
    const more = [
      ['Source address or interface: ', (x) => {
        if (!x) return undefined;
        const ip = parseIp(x);
        if (ip !== null) { st.src = ip; return undefined; }
        const l = s.dev.l3.get(normalizeIfName(x.replace(/\s/g, '')) || '');
        if (!l || l.ip === null) return '% Invalid source. Must use same-VRF IP address or full interface name without spaces (e.g. Serial0/1)';
        st.src = l.ip; return undefined;
      }],
      ['Type of service [0]: ', () => undefined],
      ['Set DF bit in IP header? [no]: ', () => undefined],
      ['Validate reply data? [no]: ', () => undefined],
      ['Data pattern [0x0000ABCD]: ', () => undefined],
      ['Loose, Strict, Record, Timestamp, Verbose[none]: ', () => undefined],
      ['Sweep range of sizes [n]: ', () => runIosPing(s, st.dst, st)],
    ];
    more.forEach(([q, fn]) => ask(q, fn));
    return undefined;
  });
  next();
  return '';
}

// ---------- traceroute ----------
function tracerouteIos(s, a) {
  const dst = parseIp(a.dst);
  const src = resolveSource(s, a);
  if (src.error) return src.error;
  const lines = ['Type escape sequence to abort.', `Tracing the route to ${ipStr(dst)}`, 'VRF info: (vrf in name/id, vrf out name/id)'];
  for (let ttl = 1; ttl <= 30; ttl += 1) {
    let from = null; const cells = []; let reached = false;
    for (let p = 0; p < 3; p += 1) {
      const sport = 49000 + s.net.nextId() % 15000;
      const r = s.net.udpProbe(s.dev, dst, ttl, sport, src.ip);
      if (r.type === 'timeout') { cells.push('*'); s.net.advance(3000); continue; }
      if (from === null) from = r.from;
      if (r.type === 'ttl-exceeded') cells.push(`${1 + (ttl % 2)} msec`);
      else if (r.code === 3) { cells.push(`${1 + (ttl % 2)} msec`); reached = true; } else { cells.push(r.code === 13 ? '!A' : r.code === 1 ? '!H' : '!N'); reached = r.code !== 13 || reached; }
    }
    const lead = String(ttl).padStart(3);
    lines.push(from === null ? `${lead}  *  *  * ` : `${lead} ${ipStr(from)} ${cells.join(' ')}`.replace(/\* (\d)/g, '*  $1'));
    if (reached || (from !== null && from === dst)) break;
  }
  return lines.join('\n');
}
