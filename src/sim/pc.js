// Windows-style host shell for PCs and servers: ipconfig (/all /release
// /renew), ping, tracert, arp -a, netsh address configuration, ssh, telnet,
// Test-NetConnection and curl.

import { parseIp, ipStr, maskToLen, isValidMask, macWindows, parsePrefix6, parseIp6, ip6Big, ip6Str, bigIp6, linkLocalFor, netOf, broadcastOf } from './util.js';
import { connectRemote } from './cli/remote.js';

const IFNAME = 'Ethernet0';
const HELP = `Supported commands:
  ipconfig [/all | /release | /renew]
  ping [-n count] [-t] <ip | ipv6>
  tracert [-d] <ip>
  arp -a
  netsh interface ip set address "${IFNAME}" static <ip> <mask> [<gateway>]
  netsh interface ip set address "${IFNAME}" dhcp
  netsh interface ip set dns "${IFNAME}" static <dns-server>
  netsh interface ipv6 add address "${IFNAME}" <ipv6>/<prefix-length>
  netsh interface ipv6 add route ::/0 "${IFNAME}" <ipv6-gateway>
  netsh interface ipv6 delete address "${IFNAME}" <ipv6>
  ssh <user>@<ip>        telnet <ip>
  Test-NetConnection <ip> -Port <port>   (alias: tnc)
  curl http://<ip>/
  hostname | getmac | cls`;

export class PcShell {
  constructor(net, dev) {
    this.net = net;
    this.dev = dev;
    this.history = [];
    this.pendingPrompt = null;
    this.remote = null;
  }

  get isPc() { return true; }
  get pending() { if (this.remote) return this.remote.pending; return !!this.pendingPrompt; }
  get secret() { if (this.remote) return this.remote.secret; return !!(this.pendingPrompt && this.pendingPrompt.secret); }
  get prompt() {
    if (this.remote) return this.remote.prompt;
    if (this.pendingPrompt) return this.pendingPrompt.prompt;
    return 'C:\\>';
  }

  ask(prompt, handle, secret = false) { this.pendingPrompt = { prompt, handle, secret }; }

  input(line) {
    if (this.remote) { const out = this.remote.input(line); this.net.converge(); return out; }
    if (this.pendingPrompt) {
      const p = this.pendingPrompt;
      this.pendingPrompt = null;
      return p.handle(line) || '';
    }
    const t = line.trim();
    if (t) this.history = [...this.history.slice(-99), t];
    if (!t) return '';
    this.net.converge();
    let out;
    try { out = this.run(t); } catch (e) { out = `Internal simulator error: ${e.message}`; }
    this.net.converge();
    return out;
  }

  help(text) {
    if (this.remote) return this.remote.help(text);
    return HELP;
  }

  complete(text) { if (this.remote) return this.remote.complete(text); return null; }
  ctrlZ() { if (this.remote) return this.remote.ctrlZ(); return ''; }
  ctrlC() {
    if (this.remote) return this.remote.ctrlC();
    this.pendingPrompt = null;
    return '';
  }
  drainLogs() { this.net.converge(); return ''; }

  run(t) {
    const args = splitArgs(t);
    const cmd = args[0].toLowerCase();
    switch (cmd) {
      case 'ipconfig': return this.ipconfig(args.slice(1));
      case 'ping': return this.ping(args.slice(1));
      case 'tracert': return this.tracert(args.slice(1));
      case 'arp': return this.arp(args.slice(1));
      case 'netsh': return this.netsh(args.slice(1));
      case 'ssh': return this.ssh(args.slice(1));
      case 'telnet': return this.telnet(args.slice(1));
      case 'test-netconnection': case 'tnc': return this.tnc(args.slice(1));
      case 'curl': case 'curl.exe': return this.curl(args.slice(1));
      case 'hostname': return this.dev.name;
      case 'getmac': return `\nPhysical Address    Transport Name\n=================== ==========================================================\n${macWindows(this.dev.mac)}   \\Device\\Tcpip_{4D36E972-E325-11CE-BFC1-08002BE10318}`;
      case 'cls': case 'clear': return '';
      case 'help': case '?': return HELP;
      case 'exit': return '';
      default: return `'${args[0]}' is not recognized as an internal or external command,\noperable program or batch file.`;
    }
  }

  // ---------- ipconfig ----------
  ipconfig(a) {
    const n = this.dev.nic;
    const l = this.dev.l3.get('eth0');
    const sw = (a[0] || '').toLowerCase();
    if (sw === '/release') {
      if (!n.dhcp) return `\nWindows IP Configuration\n\nThe operation failed as no adapter is in the state permissible for\nthis operation.`;
      Object.assign(n, { ip: null, mask: null, gw: null, lease: null, apipa: false });
      n.releasedByUser = true;
      this.net.dirty = true;
      return `\nWindows IP Configuration\n\n${this.adapterBlock(false)}`;
    }
    if (sw === '/renew') {
      if (!n.dhcp) return `\nWindows IP Configuration\n\nThe operation failed as no adapter is in the state permissible for\nthis operation.`;
      if (!l.up) return `\nWindows IP Configuration\n\nNo operation can be performed on ${IFNAME} while it has its media disconnected.`;
      n.releasedByUser = false;
      const ack = this.net.renewHost(this.dev);
      this.net.dirty = true;
      this.net.converge();
      if (!ack) return `\nWindows IP Configuration\n\nAn error occurred while renewing interface ${IFNAME} : unable to contact your DHCP server. Request has timed out.`;
      return `\nWindows IP Configuration\n\n${this.adapterBlock(false)}`;
    }
    if (sw && sw !== '/all') return `Error: unrecognized or incomplete command line.\n\nUSAGE:\n    ipconfig [/allcompartments] [/? | /all | /renew [adapter] | /release [adapter]]`;
    return `\nWindows IP Configuration\n\n${sw === '/all' ? `   Host Name . . . . . . . . . . . . : ${this.dev.name}\n   Primary Dns Suffix  . . . . . . . : \n   Node Type . . . . . . . . . . . . : Hybrid\n   IP Routing Enabled. . . . . . . . : No\n   WINS Proxy Enabled. . . . . . . . : No\n\n` : ''}${this.adapterBlock(sw === '/all')}`;
  }

  adapterBlock(all) {
    const n = this.dev.nic;
    const l = this.dev.l3.get('eth0');
    const L = [`Ethernet adapter ${IFNAME}:`, ''];
    if (!l.up) {
      L.push('   Media State . . . . . . . . . . . : Media disconnected', `   Connection-specific DNS Suffix  . : `);
      if (all) L.push('   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM', `   Physical Address. . . . . . . . . : ${macWindows(this.dev.mac)}`, `   DHCP Enabled. . . . . . . . . . . : ${n.dhcp ? 'Yes' : 'No'}`, '   Autoconfiguration Enabled . . . . : Yes');
      return L.join('\n');
    }
    L.push(`   Connection-specific DNS Suffix  . : ${n.domain || ''}`);
    if (all) L.push('   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM', `   Physical Address. . . . . . . . . : ${macWindows(this.dev.mac)}`, `   DHCP Enabled. . . . . . . . . . . : ${n.dhcp ? 'Yes' : 'No'}`, '   Autoconfiguration Enabled . . . . : Yes');
    n.ipv6.forEach((a) => L.push(`   IPv6 Address. . . . . . . . . . . : ${ip6Str(a.addr).toLowerCase()}${all ? '(Preferred) ' : ''}`));
    L.push(`   Link-local IPv6 Address . . . . . : ${ip6Str(linkLocalFor(this.dev.mac)).toLowerCase()}%12${all ? '(Preferred) ' : ''}`);
    if (n.ip !== null) {
      const label = n.apipa ? '   Autoconfiguration IPv4 Address. . : ' : '   IPv4 Address. . . . . . . . . . . : ';
      L.push(`${label}${ipStr(n.ip)}${all ? '(Preferred) ' : ''}`, `   Subnet Mask . . . . . . . . . . . : ${ipStr(n.mask)}`);
    }
    if (all && n.lease) {
      L.push(`   Lease Obtained. . . . . . . . . . : ${winDate(n.lease.obtained)}`, `   Lease Expires . . . . . . . . . . : ${winDate(n.lease.obtained + n.lease.lease)}`);
    }
    const gws = [];
    if (n.gw6 !== null && n.gw6 !== undefined) gws.push(ip6Str(bigIp6(n.gw6)).toLowerCase());
    if (n.gw !== null && n.gw !== undefined) gws.push(ipStr(n.gw));
    L.push(`   Default Gateway . . . . . . . . . : ${gws[0] || ''}`);
    gws.slice(1).forEach((g) => L.push(`                                       ${g}`));
    if (all) {
      if (n.lease) L.push(`   DHCP Server . . . . . . . . . . . : ${ipStr(n.lease.server)}`);
      if (n.dns.length) { L.push(`   DNS Servers . . . . . . . . . . . : ${ipStr(n.dns[0])}`); n.dns.slice(1).forEach((x) => L.push(`                                       ${ipStr(x)}`)); }
      L.push('   NetBIOS over Tcpip. . . . . . . . : Enabled');
    }
    return L.join('\n');
  }

  // ---------- ping / tracert ----------
  ping(a) {
    let count = 4;
    let target = null;
    for (let i = 0; i < a.length; i += 1) {
      const x = a[i].toLowerCase();
      if (x === '-n' && a[i + 1]) { count = Math.max(1, Math.min(100, Number(a[i + 1]) || 4)); i += 1; } else if (x === '-t') count = 10;
      else if (x === '-4' || x === '-6') continue;
      else if (x.startsWith('-')) return `Bad option ${a[i]}.`;
      else target = a[i];
    }
    if (!target) return 'Usage: ping [-t] [-n count] target_name';
    if (target.includes(':')) return this.ping6(target, count);
    const dst = parseIp(target);
    if (dst === null) return `Ping request could not find host ${target}. Please check the name and try again.`;
    const n = this.dev.nic;
    const L = ['', `Pinging ${ipStr(dst)} with 32 bytes of data:`];
    let recv = 0; const rtts = [];
    const id = 1;
    this.seq = (this.seq || 0);
    for (let k = 0; k < count; k += 1) {
      this.seq += 1;
      const r = this.net.echo(this.dev, dst, { id, seq: this.seq });
      this.net.advance(1000);
      if (r.code === '!') {
        recv += 1;
        const t = 1 + ((k + dst) % 2);
        rtts.push(t);
        L.push(`Reply from ${ipStr(dst)}: bytes=32 time${t <= 1 ? '<1' : `=${t}`}ms TTL=${r.ttl}`);
        if (t <= 1) rtts[rtts.length - 1] = 0;
      } else if (r.code === 'U') {
        recv += 1;
        const msg = r.unreachCode === 1 ? 'Destination host unreachable.' : r.unreachCode === 3 ? 'Destination port unreachable.' : 'Destination net unreachable.';
        L.push(`Reply from ${ipStr(r.from)}: ${msg}`);
      } else if (r.code === 'T') {
        recv += 1;
        L.push(`Reply from ${ipStr(r.from)}: TTL expired in transit.`);
      } else if (r.status === 'nogw' || r.status === 'noip' || r.status === 'noroute') {
        L.push('PING: transmit failed. General failure. ');
      } else if (r.status === 'arp-fail') {
        recv += 1;
        L.push(`Reply from ${n.ip !== null ? ipStr(n.ip) : '0.0.0.0'}: Destination host unreachable.`);
      } else L.push('Request timed out.');
    }
    const lost = count - recv;
    L.push('', `Ping statistics for ${ipStr(dst)}:`, `    Packets: Sent = ${count}, Received = ${recv}, Lost = ${lost} (${Math.floor((lost * 100) / count)}% loss),`);
    if (rtts.length) {
      const avg = Math.round(rtts.reduce((x, y) => x + y, 0) / rtts.length);
      L.push('Approximate round trip times in milli-seconds:', `    Minimum = ${Math.min(...rtts)}ms, Maximum = ${Math.max(...rtts)}ms, Average = ${avg}ms`);
    }
    return L.join('\n');
  }

  ping6(target, count) {
    const g = parseIp6(target.split('%')[0]);
    if (!g) return `Ping request could not find host ${target}. Please check the name and try again.`;
    const dst = ip6Big(g);
    const L = ['', `Pinging ${ip6Str(g).toLowerCase()} with 32 bytes of data:`];
    let recv = 0;
    for (let k = 0; k < count; k += 1) {
      this.seq = (this.seq || 0) + 1;
      const r = this.net.echo6(this.dev, dst, { id: 1, seq: this.seq });
      if (r.code === '!') { recv += 1; L.push(`Reply from ${ip6Str(g).toLowerCase()}: time<1ms `); } else if (r.status === 'nogw' || r.status === 'noip') L.push('PING: transmit failed. General failure. ');
      else if (r.code === 'U') { recv += 1; L.push(`Reply from ${ip6Str(bigIp6(r.from)).toLowerCase()}: Destination net unreachable.`); } else L.push('Request timed out.');
    }
    const lost = count - recv;
    L.push('', `Ping statistics for ${ip6Str(g).toLowerCase()}:`, `    Packets: Sent = ${count}, Received = ${recv}, Lost = ${lost} (${Math.floor((lost * 100) / count)}% loss),`);
    if (recv) L.push('Approximate round trip times in milli-seconds:', '    Minimum = 0ms, Maximum = 1ms, Average = 0ms');
    return L.join('\n');
  }

  tracert(a) {
    const target = a.filter((x) => !x.startsWith('-')).pop();
    const dst = target ? parseIp(target) : null;
    if (dst === null) return target ? `Unable to resolve target system name ${target}.` : 'Usage: tracert [-d] [-h maximum_hops] target_name';
    const L = ['', `Tracing route to ${ipStr(dst)} over a maximum of 30 hops`, ''];
    for (let ttl = 1; ttl <= 30; ttl += 1) {
      const cells = []; let from = null; let done = false; let unreach = null;
      for (let p = 0; p < 3; p += 1) {
        this.seq = (this.seq || 0) + 1;
        const r = this.net.echo(this.dev, dst, { id: 1, seq: this.seq, ttl });
        if (r.code === '.' ) { cells.push('    *   '); continue; }
        from = r.from;
        cells.push(`${ttl === 1 ? '   <1' : `${String(ttl - 1).padStart(5)}`} ms`);
        if (r.code === '!') done = true;
        if (r.code === 'U') { unreach = r; done = true; }
      }
      if (from === null) L.push(`${String(ttl).padStart(3)}  ${cells.join(' ')}  Request timed out.`);
      else if (unreach) L.push(`${String(ttl).padStart(3)}  ${ipStr(from)}  reports: Destination net unreachable.`);
      else L.push(`${String(ttl).padStart(3)}  ${cells.join(' ')}  ${ipStr(from)}`);
      if (done) break;
      if (ttl >= 8 && from === null && L.slice(-4).every((x) => x.includes('Request timed out'))) { L.push('', '(simulator: trace stopped after 4 silent hops)'); break; }
    }
    L.push('', 'Trace complete.');
    return L.join('\n');
  }

  arp(a) {
    if (!a.length || !/^-[ag]$/i.test(a[0])) return 'Displays and modifies the IP-to-Physical address translation tables used by\naddress resolution protocol (ARP).\n\nARP -s inet_addr eth_addr [if_addr]\nARP -d inet_addr [if_addr]\nARP -a [inet_addr] [-N if_addr] [-v]';
    const n = this.dev.nic;
    if (n.ip === null) return 'No ARP Entries Found.';
    const L = ['', `Interface: ${ipStr(n.ip)} --- 0xc`, '  Internet Address      Physical Address      Type'];
    [...this.dev.st.arp.entries()].sort((x, y) => x[0] - y[0]).forEach(([ip, e]) => L.push(`  ${ipStr(ip).padEnd(21)} ${macWindows(e.mac).toLowerCase().padEnd(21)} dynamic   `));
    L.push(`  ${ipStr(broadcastOf(n.ip, n.mask)).padEnd(21)} ${'ff-ff-ff-ff-ff-ff'.padEnd(21)} static    `, `  ${'224.0.0.22'.padEnd(21)} ${'01-00-5e-00-00-16'.padEnd(21)} static    `, `  ${'255.255.255.255'.padEnd(21)} ${'ff-ff-ff-ff-ff-ff'.padEnd(21)} static    `);
    return L.join('\n');
  }

  // ---------- netsh ----------
  netsh(a) {
    const words = a.map((x) => x.replace(/^name=/i, ''));
    const low = words.map((x) => x.toLowerCase());
    const idx = (k) => low.indexOf(k);
    const usage = 'The syntax supplied for this command is not valid. Check help for the correct syntax.';
    if (low[0] !== 'interface' && low[0] !== 'int') return `The following command was not found: ${a.join(' ')}.`;
    const fam = low[1];
    const ifn = words.find((w, i) => i > 2 && /^ethernet\s?0$/i.test(w));
    const nameIdx = words.findIndex((w, i) => i > 2 && /^ethernet\s?0$/i.test(w));
    if ((fam === 'ip' || fam === 'ipv4') && low[2] === 'set' && (low[3] === 'address' || low[3] === 'addr')) {
      if (!ifn) return 'The filename, directory name, or volume label syntax is incorrect.\n';
      const rest = words.slice(nameIdx + 1).map((x) => x.replace(/^(source|address|mask|gateway)=/i, ''));
      if (/^dhcp$/i.test(rest[0])) {
        Object.assign(this.dev.nic, { dhcp: true, ip: null, mask: null, gw: null, lease: null, apipa: false, releasedByUser: false });
        this.net.dirty = true; this.net.converge();
        return '';
      }
      if (!/^static$/i.test(rest[0])) return usage;
      const ip = parseIp(rest[1]); const mask = parseIp(rest[2]); const gw = rest[3] && !/^none$/i.test(rest[3]) ? parseIp(rest[3]) : null;
      if (ip === null || mask === null || !isValidMask(mask) || maskToLen(mask) === 0) return 'Invalid address parameter.\n';
      if (rest[3] && !/^none$/i.test(rest[3]) && gw === null) return 'Invalid gateway parameter.\n';
      if (gw !== null && netOf(gw, mask) !== netOf(ip, mask)) {
        // Windows accepts it but warns nothing; reachability simply fails.
      }
      Object.assign(this.dev.nic, { dhcp: false, ip, mask, gw, lease: null, apipa: false });
      this.net.dirty = true; this.net.converge();
      return '';
    }
    if ((fam === 'ip' || fam === 'ipv4') && low[2] === 'set' && low[3] === 'dns') {
      const rest = words.slice(nameIdx + 1);
      const ip = parseIp(rest[1]);
      if (ip === null) return usage;
      this.dev.nic.dns = [ip];
      return '';
    }
    if (fam === 'ipv6' && low[2] === 'add' && low[3] === 'address') {
      const val = words.slice(nameIdx + 1)[0];
      const p = parsePrefix6(val || '') || (parseIp6(val || '') ? { addr: parseIp6(val), len: 64 } : null);
      if (!ifn || !p) return usage;
      this.dev.nic.ipv6 = [...this.dev.nic.ipv6.filter((x) => ip6Str(x.addr) !== ip6Str(p.addr)), { addr: p.addr, len: p.len }];
      this.net.dirty = true; this.net.converge();
      return 'Ok.\n';
    }
    if (fam === 'ipv6' && low[2] === 'delete' && low[3] === 'address') {
      const val = words.slice(nameIdx + 1)[0];
      const g = parseIp6((val || '').split('/')[0]);
      if (!g) return usage;
      this.dev.nic.ipv6 = this.dev.nic.ipv6.filter((x) => ip6Str(x.addr) !== ip6Str(g));
      this.net.dirty = true; this.net.converge();
      return 'Ok.\n';
    }
    if (fam === 'ipv6' && low[2] === 'add' && low[3] === 'route') {
      const pfx = words[4]; const gw = words[nameIdx + 1];
      if (pfx !== '::/0' || !gw || !parseIp6(gw)) return usage;
      this.dev.nic.gw6 = ip6Big(parseIp6(gw));
      this.net.dirty = true; this.net.converge();
      return 'Ok.\n';
    }
    return usage;
  }

  // ---------- remote / tcp ----------
  ssh(a) {
    let user = null; let host = null;
    for (let i = 0; i < a.length; i += 1) {
      if (a[i] === '-l') { user = a[i + 1]; i += 1; } else if (a[i].includes('@')) [user, host] = a[i].split('@');
      else host = a[i];
    }
    const ip = host ? parseIp(host) : null;
    if (!user || ip === null) return 'usage: ssh [-l login_name] destination   (example: ssh admin@10.1.1.1)';
    return connectRemote(this, 'ssh', ip, user);
  }

  telnet(a) {
    const ip = a[0] ? parseIp(a[0]) : null;
    if (ip === null) return 'usage: telnet <ip>';
    return connectRemote(this, 'telnet', ip, null);
  }

  tnc(a) {
    const host = a.find((x) => !x.startsWith('-') && !/^\d+$/.test(x) || parseIp(x) !== null);
    const pi = a.findIndex((x) => /^-port$/i.test(x));
    const port = pi >= 0 ? Number(a[pi + 1]) : null;
    const ip = host ? parseIp(host) : null;
    if (ip === null) return 'WARNING: Name resolution of target failed';
    const src = this.dev.nic.ip;
    if (port === null) {
      const r = this.net.echo(this.dev, ip, { id: 1, seq: (this.seq = (this.seq || 0) + 1) });
      return `\nComputerName           : ${ipStr(ip)}\nRemoteAddress          : ${ipStr(ip)}\nInterfaceAlias         : ${IFNAME}\nSourceAddress          : ${src === null ? '' : ipStr(src)}\nPingSucceeded          : ${r.code === '!' ? 'True' : 'False'}\n`;
    }
    const r = this.net.tcpConnect(this.dev, ip, port);
    const warn = r === 'open' ? '' : `WARNING: TCP connect to (${ipStr(ip)} : ${port}) failed\n`;
    return `${warn}\nComputerName     : ${ipStr(ip)}\nRemoteAddress    : ${ipStr(ip)}\nRemotePort       : ${port}\nInterfaceAlias   : ${IFNAME}\nSourceAddress    : ${src === null ? '' : ipStr(src)}\nTcpTestSucceeded : ${r === 'open' ? 'True' : 'False'}\n`;
  }

  curl(a) {
    const url = a.find((x) => /^https?:\/\//i.test(x) || parseIp(x) !== null);
    if (!url) return 'curl: try \'curl --help\' for more information';
    const m = /^(?:(https?):\/\/)?([\d.]+)(?::(\d+))?/i.exec(url);
    const ip = m ? parseIp(m[2]) : null;
    if (ip === null) return `curl: (6) Could not resolve host: ${url}`;
    const port = m[3] ? Number(m[3]) : (m[1] || 'http').toLowerCase() === 'https' ? 443 : 80;
    const r = this.net.tcpConnect(this.dev, ip, port);
    if (r === 'open') return `<!DOCTYPE html>\n<html><head><title>${this.net.deviceByIp(ip)?.name || 'web'}</title></head>\n<body><h1>It works!</h1></body></html>`;
    if (r === 'refused') return `curl: (7) Failed to connect to ${ipStr(ip)} port ${port} after 1 ms: Couldn't connect to server`;
    return `curl: (28) Failed to connect to ${ipStr(ip)} port ${port} after 21045 ms: Couldn't connect to server`;
  }
}

const WIN_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WIN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Windows en-US long date/time, e.g. "Saturday, October 24, 2026 9:00:00 AM". */
export function winDate(ms) {
  const d = new Date(ms);
  const h = d.getUTCHours();
  const pad = (x) => String(x).padStart(2, '0');
  return `${WIN_DAYS[d.getUTCDay()]}, ${WIN_MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} ${h % 12 || 12}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} ${h < 12 ? 'AM' : 'PM'}`;
}

function splitArgs(t) {
  const out = [];
  const re = /"([^"]*)"|(\S+)/g;
  let m;
  while ((m = re.exec(t)) !== null) out.push(m[1] !== undefined ? m[1] : m[2]);
  return out;
}

/** Apply host config from a lab definition / saved state. */
export function applyHostConfig(dev, def) {
  const n = dev.nic;
  if (def.dhcp) Object.assign(n, { dhcp: true });
  if (def.ip) {
    const [ip, len] = def.ip.split('/');
    n.ip = parseIp(ip);
    n.mask = def.mask ? parseIp(def.mask) : len ? ((0xffffffff << (32 - Number(len))) >>> 0) : null;
  }
  if (def.gateway) n.gw = parseIp(def.gateway);
  if (def.dns) n.dns = [].concat(def.dns).map(parseIp);
  if (def.ipv6) n.ipv6 = [].concat(def.ipv6).map((x) => { const p = parsePrefix6(x); return { addr: p.addr, len: p.len }; });
  if (def.gateway6) n.gw6 = ip6Big(parseIp6(def.gateway6));
}

export { maskToLen };
