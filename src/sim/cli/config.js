// Global configuration mode commands.

import { parseIp, isValidMask, lenToMask, maskToLen, parsePrefix6, parseIp6, ip6Big, mask6, parseVlanList, secret9, type7Decrypt, netOf, isLinkLocal6 } from '../util.js';
import { ensureIf, isSwitch } from '../device.js';
import { isSubif, isPhysical, shortIf } from '../ifnames.js';
import { ACE_STD, ACE_EXT, buildAce, ensureAcl, nextSeq } from './acl-cmds.js';
import { isStandardNumber, isExtendedNumber } from '../acl.js';
import { cmpBid } from '../stp.js';

const CFG = 'config';

export function registerConfig(def) {
  // ---- mode navigation ----
  const ALL_CFG = ['config', 'if', 'subif', 'router', 'rtr', 'line', 'vlan', 'dhcp', 'std-nacl', 'ext-nacl'];
  def(ALL_CFG, 'end', (s) => { s.exitConfig(); });
  def('config', 'exit', (s) => { s.exitConfig(); });
  def(ALL_CFG.filter((m) => m !== 'config'), 'exit', (s) => { s.enter('config'); });

  // ---- tolerated lines that appear in rendered configs ----
  ['version WORD', 'boot-start-marker', 'boot-end-marker', 'service timestamps LINE', 'no aaa new-model', 'redundancy', 'mode none',
    'control-plane', 'ip forward-protocol nd', 'spanning-tree extend system-id', 'login on-success log', 'no ip http server', 'ip http server',
    'ip http secure-server', 'no ip http secure-server', 'diagnostic bootup level minimal', 'line aux 0', 'stopbits 1',
    'platform qfp utilization monitor load 80', 'no platform punt-keepalive disable-kernel-core', 'vtp mode transparent',
  ].forEach((p) => def(CFG, p, () => ''));

  // ---- identity / management ----
  def(CFG, 'hostname name:WORD{This system\'s network name}', (s, a) => {
    if (!/^[A-Za-z]/.test(a.name)) return '% Hostname contains one or more illegal characters.';
    s.cfg.hostname = a.name.slice(0, 63); s.changed();
  });
  def(CFG, 'no hostname', (s) => { s.cfg.hostname = s.dev.type === 'router' ? 'Router' : 'Switch'; s.changed(); });
  def(CFG, 'enable secret [(t0:0{Specifies an UNENCRYPTED password will follow} | t5:5{Specifies a MD5 HASHED secret will follow} | t8:8{Specifies a PBKDF2 HASHED secret will follow} | t9:9{Specifies a SCRYPT HASHED secret will follow})] pw:WORD{The UNENCRYPTED (cleartext) \'enable\' secret}', (s, a) => {
    s.cfg.enableSecret = storeSecret(a); s.changed();
  });
  def(CFG, 'enable password [(t0:0 | t7:7{Specifies a HIDDEN password will follow})] pw:WORD{The UNENCRYPTED (cleartext) \'enable\' password}', (s, a) => {
    s.cfg.enablePassword = storePassword(a); s.changed();
  });
  def(CFG, 'no enable secret', (s) => { s.cfg.enableSecret = null; s.changed(); });
  def(CFG, 'no enable password', (s) => { s.cfg.enablePassword = null; s.changed(); });
  def(CFG, 'username user:WORD{User name} [privilege priv:<0-15>{User privilege level}] (secret [(t0:0 | t5:5 | t8:8 | t9:9)] pw:WORD{The UNENCRYPTED (cleartext) user secret} | password [(t0:0 | t7:7)] pwp:WORD{The UNENCRYPTED (cleartext) user password})', (s, a) => {
    const u = { name: a.user, privilege: a.priv !== undefined ? Number(a.priv) : 1, secret: null, password: null };
    if (a.secret) u.secret = storeSecret(a);
    else u.password = storePassword({ ...a, pw: a.pwp });
    s.cfg.users = new Map(s.cfg.users).set(a.user, u);
    s.changed();
  });
  def(CFG, 'username user:WORD privilege priv:<0-15>', (s, a) => {
    const cur = s.cfg.users.get(a.user) || { name: a.user, secret: null, password: null };
    s.cfg.users = new Map(s.cfg.users).set(a.user, { ...cur, privilege: Number(a.priv) });
    s.changed();
  });
  def(CFG, 'no username user:WORD', (s, a) => {
    const m = new Map(s.cfg.users); m.delete(a.user); s.cfg.users = m; s.changed();
  });
  def(CFG, '[no] service password-encryption', (s, a) => { s.cfg.passwordEncryption = !a.no; s.changed(); });
  def(CFG, 'banner motd text:LINE{c  banner-text c, where \'c\' is a delimiting character}', (s, a) => banner(s, a.text));
  def(CFG, 'no banner motd', (s) => { s.cfg.banner = null; s.changed(); });
  def(CFG, 'ip domain name dn:WORD{Default domain name}', (s, a) => { s.cfg.domainName = a.dn; s.changed(); });
  def(CFG, 'ip domain-name dn:WORD{Default domain name}', (s, a) => { s.cfg.domainName = a.dn; s.changed(); });
  def(CFG, 'no ip (domain name | domain-name) [dn:WORD]', (s) => { s.cfg.domainName = null; s.changed(); });
  def(CFG, '[no] ip (domain lookup | domain-lookup)', (s, a) => { s.cfg.domainLookup = !a.no; s.changed(); });
  def(CFG, '[no] ip name-server ns:A.B.C.D{Domain server IP address (maximum of 6)}', (s, a) => {
    const ip = parseIp(a.ns);
    s.cfg.nameServers = a.no ? s.cfg.nameServers.filter((x) => x !== ip) : [...new Set([...s.cfg.nameServers, ip])];
    s.changed();
  });
  def(CFG, 'crypto key generate rsa [general-keys] [modulus mod:<512-4096>{size of the key modulus [512-4096]}]', (s, a) => cryptoGen(s, a));
  def(CFG, 'crypto key zeroize rsa', (s) => {
    if (!s.cfg.rsa) return '% No Signature RSA Keys found in configuration.';
    s.ask('% All keys will be removed.\n% All router certs issued using these keys will also be removed.\nDo you really want to remove these keys? [yes/no]: ', (ans) => {
      if (/^y/i.test(ans.trim())) { s.cfg.rsa = null; s.changed(); s.net.log(s.dev, '%SSH-5-DISABLED: SSH 2.0 has been disabled'); }
      return '';
    });
  });
  def(CFG, 'ip ssh version ver:<1-2>{Protocol version}', (s, a) => {
    s.cfg.sshVersion = Number(a.ver); s.changed();
    if (!s.cfg.rsa) return 'Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2).';
  });
  def(CFG, 'no ip ssh version [ver:<1-2>]', (s) => { s.cfg.sshVersion = null; s.changed(); });
  def(CFG, 'ip default-gateway gw:A.B.C.D{IP address of default gateway}', (s, a) => { s.cfg.defaultGateway = parseIp(a.gw); s.changed(); }, { only: 'switch' });
  def(CFG, 'no ip default-gateway [gw:A.B.C.D]', (s) => { s.cfg.defaultGateway = null; s.changed(); }, { only: 'switch' });
  def(CFG, '[no] cdp run', (s, a) => { s.cfg.cdp = !a.no; s.changed(); });
  def(CFG, '[no] lldp run', (s, a) => { s.cfg.lldp = !a.no; s.changed(); });
  def(CFG, '[no] ntp server srv:A.B.C.D{IP address of peer} [prefer]', (s, a) => {
    const ip = parseIp(a.srv);
    s.cfg.ntp = a.no ? s.cfg.ntp.filter((x) => x.ip !== ip) : [...s.cfg.ntp.filter((x) => x.ip !== ip), { ip, prefer: !!a.prefer }];
    s.changed();
  });
  def(CFG, '[no] logging [host] lh:A.B.C.D{IP address of the logging host}', (s, a) => {
    const ip = parseIp(a.lh);
    s.cfg.logHosts = a.no ? s.cfg.logHosts.filter((x) => x !== ip) : [...new Set([...s.cfg.logHosts, ip])];
    s.changed();
  });
  def(CFG, 'snmp-server community comm:WORD{SNMP community string} [(ro | rw)] [acl:WORD{Std IP accesslist allowing access with this community string}]', (s, a) => {
    s.cfg.snmp = [...s.cfg.snmp.filter((x) => x.name !== a.comm), { name: a.comm, rw: !!a.rw, acl: a.acl || null }];
    s.changed();
  });
  def(CFG, 'no snmp-server community comm:WORD [(ro | rw)] [acl:WORD]', (s, a) => { s.cfg.snmp = s.cfg.snmp.filter((x) => x.name !== a.comm); s.changed(); });

  // ---- lines ----
  def(CFG, 'line (console | con) n:<0-0>{First Line number}', (s) => { s.enter('line', { line: 'con' }); });
  def(CFG, 'line vty first:<0-15>{First Line number} [last:<1-15>{Last Line number}]', (s) => { s.enter('line', { line: 'vty' }); });

  // ---- interfaces ----
  def(CFG, 'interface IFACE_NEW', (s, a) => enterInterface(s, a.iface));
  def(CFG, 'interface range range:IFRANGE', (s, a) => {
    const list = s.parseIfRange(a.range);
    list.forEach((n) => ensureIf(s.dev, n));
    s.enter('if-range', { ifaces: list });
    s.changed();
  });
  def(CFG, 'no interface IFACE', (s, a) => {
    if (isPhysical(a.iface)) return '% Removal of physical interfaces is not permitted';
    const m = new Map(s.cfg.interfaces); m.delete(a.iface); s.cfg.interfaces = m;
    if (a.iface.startsWith('Port-channel')) {
      const g = Number(a.iface.slice(12));
      for (const i of s.cfg.interfaces.values()) if (i.channel && i.channel.group === g) i.channel = null;
    }
    s.changed();
  });

  // ---- VLANs ----
  def(CFG, 'vlan vl:VLANLIST{ISL VLAN IDs 1-4094}', (s, a) => {
    const vl = [...parseVlanList(a.vl)];
    const vlans = new Map(s.cfg.vlans);
    vl.forEach((v) => { if (!vlans.has(v)) vlans.set(v, { name: `VLAN${String(v).padStart(4, '0')}` }); });
    s.cfg.vlans = vlans; s.changed();
    s.enter('vlan', { vlans: vl });
  }, { only: 'switch' });
  def(CFG, 'no vlan vl:VLANLIST', (s, a) => {
    const vl = [...parseVlanList(a.vl)];
    if (vl.includes(1)) return '%Default VLAN 1 may not be deleted.\n';
    const vlans = new Map(s.cfg.vlans); vl.forEach((v) => vlans.delete(v)); s.cfg.vlans = vlans; s.changed();
  }, { only: 'switch' });

  // ---- routing ----
  def(CFG, '[no] ip routing', (s, a) => { s.cfg.ipRouting = !a.no; s.changed(); });
  def(CFG, '[no] ipv6 unicast-routing', (s, a) => { s.cfg.ipv6Routing = !a.no; s.changed(); });
  const RT = 'ip route pfx:A.B.C.D{Destination prefix} msk:A.B.C.D{Destination prefix mask} (nh:A.B.C.D{Forwarding router\'s address} | IFACE [nh2:A.B.C.D{Forwarding router\'s address}]) [ad:<1-255>{Distance metric for this route}] [permanent] [name rname:WORD{Specify name of the next hop}]';
  def(CFG, RT, (s, a) => staticRoute(s, a, false));
  def(CFG, `no ${RT}`, (s, a) => staticRoute(s, a, true));
  def(CFG, 'no ip route pfx:A.B.C.D msk:A.B.C.D', (s, a) => staticRoute(s, a, true));
  const RT6 = 'ipv6 route p6:X:X:X:X::X/<0-128>{IPv6 prefix} (nh6:X:X:X:X::X{IPv6 address of next-hop} | IFACE [nh62:X:X:X:X::X]) [ad:<1-254>{Administrative distance}]';
  def(CFG, RT6, (s, a) => staticRoute6(s, a, false));
  def(CFG, `no ${RT6}`, (s, a) => staticRoute6(s, a, true));
  def(CFG, 'router ospf pid:<1-65535>{Process ID}', (s, a) => {
    if (!s.cfg.ipRouting) return '%IP routing not enabled';
    const pid = Number(a.pid);
    if (!s.cfg.ospf.has(pid)) {
      s.cfg.ospf = new Map(s.cfg.ospf).set(pid, newOspf());
      s.changed();
    }
    s.enter('router', { pid });
  });
  def(CFG, 'no router ospf pid:<1-65535>', (s, a) => {
    const m = new Map(s.cfg.ospf); m.delete(Number(a.pid)); s.cfg.ospf = m;
    s.dev.st.rids?.delete(`4:${a.pid}`);
    s.changed();
  });
  def(CFG, 'ipv6 router ospf pid:<1-65535>{Process ID}', (s, a) => {
    if (!s.cfg.ipv6Routing) return '% IPv6 routing not enabled';
    const pid = Number(a.pid);
    if (!s.cfg.ospf6.has(pid)) { s.cfg.ospf6 = new Map(s.cfg.ospf6).set(pid, newOspf()); s.changed(); }
    s.enter('rtr', { pid });
  });
  def(CFG, 'no ipv6 router ospf pid:<1-65535>', (s, a) => { const m = new Map(s.cfg.ospf6); m.delete(Number(a.pid)); s.cfg.ospf6 = m; s.changed(); });

  // ---- ACLs ----
  def(CFG, `access-list num:<1-99>{IP standard access list} ${ACE_STD}`, (s, a) => numberedAce(s, a, 'standard'));
  def(CFG, `access-list num:<1300-1999>{IP standard access list (expanded range)} ${ACE_STD}`, (s, a) => numberedAce(s, a, 'standard'));
  def(CFG, `access-list num:<100-199>{IP extended access list} ${ACE_EXT}`, (s, a) => numberedAce(s, a, 'extended'));
  def(CFG, `access-list num:<2000-2699>{IP extended access list (expanded range)} ${ACE_EXT}`, (s, a) => numberedAce(s, a, 'extended'));
  def(CFG, 'access-list num:<1-2699> remark rem:LINE{Comment up to 100 characters}', (s, a) => {
    const type = isStandardNumber(a.num) ? 'standard' : isExtendedNumber(a.num) ? 'extended' : null;
    if (!type) return '% Invalid access list number';
    const acl = ensureAcl(s, a.num, type, true);
    acl.entries = [...acl.entries, { seq: nextSeq(acl), action: 'remark', remark: a.rem.slice(0, 100) }];
    s.changed();
  });
  def(CFG, 'no access-list num:<1-2699>', (s, a) => { const m = new Map(s.cfg.acls); m.delete(String(a.num)); s.cfg.acls = m; s.changed(); });
  def(CFG, 'ip access-list (standard | extended) name:WORD{Access-list name}', (s, a) => {
    const type = a.standard ? 'standard' : 'extended';
    const numbered = /^\d+$/.test(a.name);
    if (numbered && ((type === 'standard' && !isStandardNumber(a.name)) || (type === 'extended' && !isExtendedNumber(a.name)))) return '% Invalid access list name.';
    const cur = s.cfg.acls.get(a.name);
    if (cur && cur.type !== type) return `% A named ${cur.type} IP access list with this name already exists`;
    ensureAcl(s, a.name, type, numbered);
    s.enter(type === 'standard' ? 'std-nacl' : 'ext-nacl', { acl: a.name });
  });
  def(CFG, 'no ip access-list (standard | extended) name:WORD', (s, a) => { const m = new Map(s.cfg.acls); m.delete(a.name); s.cfg.acls = m; s.changed(); });

  // ---- NAT ----
  def(CFG, '[no] ip nat inside source static loc:A.B.C.D{Inside local IP address} glob:A.B.C.D{Inside global IP address}', (s, a) => {
    const local = parseIp(a.loc); const global = parseIp(a.glob);
    const statics = s.cfg.nat.statics.filter((x) => x.local !== local);
    if (!a.no) {
      if (statics.some((x) => x.global === global)) return `% ${a.glob} already mapped (${ipStr(statics.find((x) => x.global === global).local)} -> ${a.glob})`;
      statics.push({ local, global });
    }
    s.cfg.nat = { ...s.cfg.nat, statics }; s.changed();
  }, { only: 'router' });
  def(CFG, '[no] ip nat inside source list acl:WORD{Access list number or name for local addresses} (interface IFACE [overload] | pool pool:WORD{Name pool of global addresses} [overload])', (s, a) => {
    const rule = { acl: a.acl, ifName: a.iface || null, pool: a.pool || null, overload: !!a.overload };
    const dyn = s.cfg.nat.dynamics.filter((r) => r.acl !== a.acl);
    if (!a.no) dyn.push(rule);
    s.cfg.nat = { ...s.cfg.nat, dynamics: dyn }; s.changed();
  }, { only: 'router' });
  def(CFG, 'ip nat pool pool:WORD{Pool name} start:A.B.C.D{Start IP address} end:A.B.C.D{End IP address} (netmask nm:A.B.C.D{Network mask} | prefix-length pl:<1-32>{Prefix length})', (s, a) => {
    const mask = a.nm ? parseIp(a.nm) : lenToMask(Number(a.pl));
    if (!isValidMask(mask)) return '%Pool ' + a.pool + ' mask ' + a.nm + ' is invalid';
    const start = parseIp(a.start); const end = parseIp(a.end);
    if (end < start) return '%End address less than starting address';
    if (netOf(start, mask) !== netOf(end, mask)) return `%Start and end addresses on different subnets`;
    s.cfg.nat = { ...s.cfg.nat, pools: new Map(s.cfg.nat.pools).set(a.pool, { name: a.pool, start, end, mask, prefix: !!a.pl }) };
    s.changed();
  }, { only: 'router' });
  def(CFG, 'no ip nat pool pool:WORD [LINE]', (s, a) => {
    if (s.cfg.nat.dynamics.some((r) => r.pool === a.pool)) return `%Pool ${a.pool} in use, cannot destroy`;
    const p = new Map(s.cfg.nat.pools); p.delete(a.pool); s.cfg.nat = { ...s.cfg.nat, pools: p }; s.changed();
  }, { only: 'router' });

  // ---- DHCP ----
  def(CFG, '[no] ip dhcp excluded-address lo:A.B.C.D{Low IP address} [hi:A.B.C.D{High IP address}]', (s, a) => {
    const lo = parseIp(a.lo); const hi = a.hi ? parseIp(a.hi) : lo;
    if (hi < lo) return '% Invalid address range';
    const rest = s.cfg.dhcpExcluded.filter((r) => !(r.lo === lo && r.hi === hi));
    s.cfg.dhcpExcluded = a.no ? rest : [...rest, { lo, hi, single: !a.hi }];
    s.changed();
  });
  def(CFG, 'ip dhcp pool pool:WORD{Pool name}', (s, a) => {
    if (!s.cfg.dhcpPools.has(a.pool)) {
      s.cfg.dhcpPools = new Map(s.cfg.dhcpPools).set(a.pool, { name: a.pool, network: null, routers: [], dns: [], domain: null, lease: null });
      s.changed();
    }
    s.enter('dhcp', { pool: a.pool });
  });
  def(CFG, 'no ip dhcp pool pool:WORD', (s, a) => { const m = new Map(s.cfg.dhcpPools); m.delete(a.pool); s.cfg.dhcpPools = m; s.changed(); });
  def(CFG, '[no] ip dhcp snooping', (s, a) => { s.cfg.snooping = { ...s.cfg.snooping, enabled: !a.no }; s.changed(); }, { only: 'switch' });
  def(CFG, '[no] ip dhcp snooping vlan vl:VLANLIST{DHCP Snooping vlan first number or vlan range}', (s, a) => {
    const set = new Set(s.cfg.snooping.vlans);
    parseVlanList(a.vl).forEach((v) => (a.no ? set.delete(v) : set.add(v)));
    s.cfg.snooping = { ...s.cfg.snooping, vlans: set }; s.changed();
  }, { only: 'switch' });
  def(CFG, '[no] ip dhcp snooping information option', (s, a) => { s.cfg.snooping = { ...s.cfg.snooping, option82: !a.no }; s.changed(); }, { only: 'switch' });
  def(CFG, '[no] ip dhcp relay information trust-all{Received DHCP packets may contain relay info option with zero giaddr}', (s, a) => { s.cfg.dhcpRelayTrustAll = !a.no; s.changed(); });
  def(CFG, '[no] ip arp inspection vlan vl:VLANLIST{vlan range}', (s, a) => {
    const set = new Set(s.cfg.dai);
    parseVlanList(a.vl).forEach((v) => (a.no ? set.delete(v) : set.add(v)));
    s.cfg.dai = set; s.changed();
  }, { only: 'switch' });

  // ---- spanning tree ----
  def(CFG, 'spanning-tree mode (rapid-pvst | pvst | mst{Multiple spanning tree mode})', (s, a) => {
    if (a.mst) return '% MST is not supported by this simulator';
    s.cfg.stp = { ...s.cfg.stp, mode: a['rapid-pvst'] ? 'rapid-pvst' : 'pvst' }; s.changed();
  }, { only: 'switch' });
  def(CFG, 'spanning-tree vlan vl:VLANLIST{VLAN IDs of the spanning tree} priority prio:<0-61440>{bridge priority in increments of 4096}', (s, a) => {
    const p = Number(a.prio);
    if (p % 4096 !== 0) return '% Bridge Priority must be in increments of 4096.\n% Allowed values are:\n  0     4096  8192  12288 16384 20480 24576 28672\n  32768 36864 40960 45056 49152 53248 57344 61440';
    const m = new Map(s.cfg.stp.prio);
    parseVlanList(a.vl).forEach((v) => m.set(v, p));
    s.cfg.stp = { ...s.cfg.stp, prio: m }; s.changed();
  }, { only: 'switch' });
  def(CFG, 'spanning-tree vlan vl:VLANLIST root (primary | secondary)', (s, a) => rootMacro(s, a), { only: 'switch' });
  def(CFG, 'no spanning-tree vlan vl:VLANLIST [(priority [prio:<0-61440>] | root [(primary | secondary)])]', (s, a) => {
    const m = new Map(s.cfg.stp.prio);
    parseVlanList(a.vl).forEach((v) => m.delete(v));
    s.cfg.stp = { ...s.cfg.stp, prio: m }; s.changed();
  }, { only: 'switch' });
  def(CFG, '[no] spanning-tree portfast [edge] default', (s, a) => { s.cfg.stp = { ...s.cfg.stp, portfastDefault: !a.no }; s.changed(); }, { only: 'switch' });
  def(CFG, '[no] spanning-tree portfast [edge] bpduguard default', (s, a) => { s.cfg.stp = { ...s.cfg.stp, bpduguardDefault: !a.no }; s.changed(); }, { only: 'switch' });
}

// ---------- helpers ----------
function ipStr(n) { return [24, 16, 8, 0].map((x) => (n >>> x) & 255).join('.'); }

function storeSecret(a) {
  if (a.t5 || a.t8 || a.t9) return { type: a.t5 ? 5 : a.t8 ? 8 : 9, hash: a.pw };
  return { type: 9, hash: secret9(a.pw) };
}

function storePassword(a) {
  if (a.t7) return { plain: type7Decrypt(a.pw) ?? a.pw };
  return { plain: a.pw };
}

function banner(s, text) {
  const t = text.trimStart();
  const delim = t.startsWith('^C') ? '^C' : t[0];
  const rest = t.slice(delim.length);
  const end = rest.indexOf(delim);
  if (end >= 0) { s.cfg.banner = rest.slice(0, end); s.changed(); return ''; }
  const lines = rest.length ? [rest] : [];
  const collect = (line) => {
    const i = line.indexOf(delim);
    if (i >= 0) {
      if (i > 0) lines.push(line.slice(0, i));
      s.cfg.banner = lines.join('\n'); s.changed();
      return '';
    }
    lines.push(line);
    s.ask('', collect);
    return '';
  };
  s.ask('', collect);
  return `Enter TEXT message.  End with the character '${delim === '^C' ? '^C' : delim}'.`;
}

function cryptoGen(s, a) {
  if (/^(Router|Switch)$/.test(s.cfg.hostname)) return `% Please define a hostname other than ${s.cfg.hostname}.`;
  if (!s.cfg.domainName) return '% Please define a domain-name first.';
  const name = `${s.cfg.hostname}.${s.cfg.domainName}`;
  const gen = (bits) => {
    const replaced = s.cfg.rsa ? `% You already have RSA keys defined named ${name}.\n% They will be replaced.\n\n` : '';
    s.cfg.rsa = { modulus: bits, name };
    s.changed();
    s.net.log(s.dev, '%SSH-5-ENABLED: SSH 1.99 has been enabled');
    return `${replaced}% The key modulus size is ${bits} bits\n% Generating ${bits} bit RSA keys, keys will be non-exportable...\n[OK] (elapsed time was 1 seconds)\n`;
  };
  if (a.mod) return `The name for the keys will be: ${name}\n\n${gen(Number(a.mod))}`;
  s.ask('How many bits in the modulus [1024]: ', (ans) => {
    const v = ans.trim() === '' ? 1024 : Number(ans.trim());
    if (!Number.isInteger(v) || v < 512 || v > 4096) return '% You must choose a key size between 512 and 4096 bits.';
    return gen(v);
  });
  return `The name for the keys will be: ${name}\nChoose the size of the key modulus in the range of 512 to 4096 for your\n  General Purpose Keys. Choosing a key modulus greater than 512 may take\n  a few minutes.\n`;
}

function enterInterface(s, name) {
  const existed = s.cfg.interfaces.has(name);
  const i = ensureIf(s.dev, name);
  if (!existed) s.changed();
  if (isSubif(name)) s.enter('subif', { ifaces: [name] });
  else s.enter('if', { ifaces: [name] });
  if (!existed && name.startsWith('Port-channel')) i.sw = i.sw || null;
  return '';
}

function staticRoute(s, a, remove) {
  const pfx = parseIp(a.pfx); const msk = parseIp(a.msk);
  if (!isValidMask(msk) || (pfx & ~msk) !== 0) return '%Inconsistent address and mask';
  const nh = a.nh ? parseIp(a.nh) : a.nh2 ? parseIp(a.nh2) : null;
  const ifName = a.iface || null;
  if (!remove && nh !== null && [...(s.dev.l3 || new Map()).values()].some((l) => l.ip === nh)) return '%Invalid next hop address (it\'s this router)';
  const same = (r) => r.net === pfx && r.mask === msk && (a.nh || a.iface || a.nh2 ? r.nh === nh && r.ifName === ifName : true);
  const rest = s.cfg.staticRoutes.filter((r) => !same(r));
  s.cfg.staticRoutes = remove ? rest : [...rest, { net: pfx, mask: msk, nh, ifName, ad: a.ad ? Number(a.ad) : 1, permanent: !!a.permanent, name: a.rname || null }];
  s.changed();
  return '';
}

function staticRoute6(s, a, remove) {
  const p = parsePrefix6(a.p6);
  const net = ip6Big(p.addr) & mask6(p.len);
  const nhStr = a.nh6 || a.nh62;
  const nh = nhStr ? ip6Big(parseIp6(nhStr)) : null;
  const ifName = a.iface || null;
  if (!remove && a.nh6 && isLinkLocal6(parseIp6(a.nh6))) return '% Interface has to be specified for a link-local nexthop';
  if (!remove && !s.cfg.ipv6Routing) {
    // IOS accepts the command but the route is not used until ipv6 unicast-routing is on.
  }
  const rest = s.cfg.staticRoutes6.filter((r) => !(r.net === net && r.len === p.len && r.nh === nh && r.ifName === ifName));
  s.cfg.staticRoutes6 = remove ? rest : [...rest, { net, len: p.len, nh, ifName, ad: a.ad ? Number(a.ad) : 1 }];
  s.changed();
}

export function newOspf() {
  return { rid: null, networks: [], passive: new Set(), nonPassive: new Set(), passiveDefault: false, defaultInfo: null, refBw: 100, maxPaths: 4 };
}

function numberedAce(s, a, type) {
  const acl = ensureAcl(s, a.num, type, true);
  const e = buildAce(a, type);
  if (e.error) return e.error;
  if (acl.entries.some((x) => sameAce(x, e))) return '';
  acl.entries = [...acl.entries, { ...e, seq: nextSeq(acl) }];
  s.changed();
  return '';
}

function sameAce(x, e) {
  const { seq, ...a } = x;
  return JSON.stringify(a) === JSON.stringify(e);
}

function rootMacro(s, a) {
  const vl = [...parseVlanList(a.vl)];
  const m = new Map(s.cfg.stp.prio);
  s.net.converge();
  for (const v of vl) {
    if (a.secondary) { m.set(v, 28672); continue; }
    const inst = s.dev.stp && s.dev.stp.get(v);
    let prio = 24576;
    if (inst && !inst.isRoot) {
      const rootPrio = inst.rootBid.prio - v;
      if (rootPrio <= 24576) {
        prio = rootPrio - 4096;
        if (cmpBid({ prio: prio + v, mac: s.dev.baseMac }, inst.rootBid) > 0 && prio >= 4096) prio -= 4096;
      }
      if (prio < 0) return `% Failed to make the bridge root for vlan ${v}\n% It may be possible to make the bridge root by setting the priority\n% for some (or all) of these instances to zero.`;
    }
    m.set(v, prio);
  }
  s.cfg.stp = { ...s.cfg.stp, prio: m };
  s.changed();
  return '';
}

export { maskToLen, shortIf, isSwitch };
