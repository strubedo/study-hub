// Interface / sub-interface / interface-range configuration commands.

import { parseIp, isValidMask, maskToLen, netOf, hex8, parseVlanList, parsePrefix6, parseIp6, isLinkLocal6, parseMac, ipStr, broadcastOf } from '../util.js';
import { ensureIf, newSwitchport } from '../device.js';
import { shortIf, isPortChannel, isSvi, isLoopback, isSubif } from '../ifnames.js';

const IF = ['if'];
const IFS = ['if', 'subif'];

/** Wrap a per-interface handler so it runs for every interface in the current context. */
function each(fn, { propagate = false } = {}) {
  return (s, a) => {
    const outs = [];
    for (const name of s.ctx.ifaces) {
      const i = s.cfg.interfaces.get(name);
      if (!i) continue;
      const r = fn(s, a, i, name);
      if (r) outs.push(r);
      if (propagate && isPortChannel(name)) {
        const g = Number(name.slice(12));
        for (const [mn, mi] of s.cfg.interfaces) if (mi.channel && mi.channel.group === g) fn(s, a, mi, mn);
      }
    }
    s.changed();
    return [...new Set(outs)].join('\n');
  };
}

function needSw(i, name) {
  if (!i.sw) return `% Interface ${name} is not a switchport.`.replace(/.*/, '%Command rejected: Not a switching port.');
  return null;
}

function parseArea(a) {
  if (a.areaip) return { area: parseIp(a.areaip), areaFmt: 'dot' };
  return { area: Number(a.area), areaFmt: 'dec' };
}

const AREA = '(area:<0-4294967295>{OSPF area ID as a decimal value} | areaip:A.B.C.D{OSPF area ID in IP address format})';

export function registerIface(def) {
  def(['if', 'subif'], 'description text:LINE{Up to 200 characters describing this interface}', each((s, a, i) => { i.description = a.text.slice(0, 200); }));
  def(IFS, 'no description [LINE]', each((s, a, i) => { i.description = null; }));
  def(IFS, '[no] shutdown', each((s, a, i, n) => {
    i.shutdown = !a.no;
    if (a.no && s.dev.st.errDisabled.has(n)) s.dev.st.errDisabled.delete(n);
    if (!a.no && s.dev.st.errDisabled.has(n)) s.dev.st.errDisabled.delete(n);
  }));
  def(IFS, 'ip address addr:A.B.C.D{IP address} mask:A.B.C.D{IP subnet mask} [secondary{Make this IP address a secondary address}]', each((s, a, i, n) => setIp(s, a, i, n)));
  def(IFS, 'ip address dhcp', each((s, a, i, n) => {
    if (i.sw) return '% IP addresses may not be configured on L2 links.';
    i.ip = null; i.secondary = []; i.dhcpClient = true;
    if (s.dev.st.ifLeases) s.dev.st.ifLeases.delete(n);
  }));
  def(IFS, 'no ip address [addr:A.B.C.D mask:A.B.C.D [secondary]]', each((s, a, i, n) => {
    if (a.secondary) { const ip = parseIp(a.addr); i.secondary = i.secondary.filter((x) => x.addr !== ip); return ''; }
    i.ip = null; i.secondary = []; i.dhcpClient = false;
    if (s.dev.st.ifLeases) s.dev.st.ifLeases.delete(n);
    return '';
  }));
  def(IFS, 'ipv6 address p6:X:X:X:X::X/<0-128>{IPv6 prefix} [eui-64]', each((s, a, i) => {
    if (i.sw) return '% IPv6 addresses may not be configured on L2 links.';
    const p = parsePrefix6(a.p6);
    const key = (x) => `${x.addr.join(':')}/${x.len}/${!!x.eui}`;
    const entry = { addr: p.addr, len: p.len, eui: !!a['eui-64'] };
    if (!i.ipv6.some((x) => key(x) === key(entry))) i.ipv6 = [...i.ipv6, entry];
    return '';
  }));
  def(IFS, 'ipv6 address ll:X:X:X:X::X{IPv6 link-local address} link-local', each((s, a, i) => {
    const g = parseIp6(a.ll);
    if (!isLinkLocal6(g)) return '% Invalid link-local address';
    i.ipv6LinkLocal = a.ll.toUpperCase();
    return '';
  }));
  def(IFS, 'no ipv6 address [(p6:X:X:X:X::X/<0-128> [eui-64] | ll:X:X:X:X::X link-local)]', each((s, a, i) => {
    if (a.ll) { i.ipv6LinkLocal = null; return; }
    if (a.p6) { const p = parsePrefix6(a.p6); i.ipv6 = i.ipv6.filter((x) => !(x.len === p.len && x.addr.join() === p.addr.join())); return; }
    i.ipv6 = []; i.ipv6LinkLocal = null;
  }));
  def(IFS, '[no] ipv6 enable', each((s, a, i) => { i.ipv6Enable = !a.no; }));
  def(IF, 'speed (sp10:10{Force 10 Mbps operation} | sp100:100{Force 100 Mbps operation} | sp1000:1000{Force 1000 Mbps operation} | auto{Enable AUTO speed configuration})', each((s, a, i, n) => {
    if (!/Ethernet/.test(n) || isPortChannel(n)) return '% Invalid input';
    i.speed = a.sp10 ? '10' : a.sp100 ? '100' : a.sp1000 ? '1000' : 'auto';
  }));
  def(IF, 'no speed', each((s, a, i) => { i.speed = 'auto'; }));
  def(IF, 'duplex (full | half | auto{Enable AUTO duplex configuration})', each((s, a, i) => {
    if (a.half && i.speed === '1000') return '% Duplex cannot be set to half when speed is 1000';
    i.duplex = a.full ? 'full' : a.half ? 'half' : 'auto';
  }));
  def(IF, 'no duplex', each((s, a, i) => { i.duplex = 'auto'; }));
  def(IF, '[no] negotiation auto', () => '', { only: 'router' });
  def(IF, 'mtu bytes:<1500-9216>{MTU size in bytes}', each((s, a, i) => { i.mtu = Number(a.bytes); }), { only: 'router' });
  def(IFS, 'ip mtu bytes:<68-1500>{MTU (bytes)}', each((s, a, i) => { i.ipMtu = Number(a.bytes); }));
  def(IFS, 'no ip mtu [LINE]', each((s, a, i) => { i.ipMtu = null; }));
  def(IFS, 'bandwidth kbps:<1-100000000>{Bandwidth in kilobits}', each((s, a, i) => { i.bandwidth = Number(a.kbps); }));
  def(IFS, 'no bandwidth [LINE]', each((s, a, i) => { i.bandwidth = null; }));
  def(IF, '[no] cdp enable{Enable CDP on interface}', each((s, a, i) => { i.cdp = !a.no; }));
  def(IF, '[no] lldp transmit{Enable LLDP transmission on interface}', each((s, a, i) => { i.lldpTx = !a.no; }));
  def(IF, '[no] lldp receive{Enable LLDP reception on interface}', each((s, a, i) => { i.lldpRx = !a.no; }));
  def(IFS, '[no] ip proxy-arp', each((s, a, i) => { i.proxyArp = !a.no; }));

  // ---- switchport ----
  def(IF, 'switchport', each((s, a, i, n) => {
    if (i.sw || isSvi(n) || isLoopback(n)) return '';
    i.sw = newSwitchport(); i.ip = null; i.secondary = [];
    return '';
  }), { only: 'switch' });
  def(IF, 'no switchport', each((s, a, i, n) => {
    if (isSvi(n) || isLoopback(n)) return '';
    i.sw = null; i.psec = null;
    return '';
  }), { only: 'switch' });
  def(IF, 'switchport mode (access{Set trunking mode to ACCESS unconditionally} | trunk{Set trunking mode to TRUNK unconditionally} | dynamic{Set trunking mode to dynamically negotiate access or trunk mode} (auto{Set trunking mode dynamic negotiation parameter to AUTO} | desirable{Set trunking mode dynamic negotiation parameter to DESIRABLE}))', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    const mode = a.access ? 'access' : a.trunk ? 'trunk' : a.auto ? 'dynamic auto' : 'dynamic desirable';
    if (mode.startsWith('dynamic') && i.sw.nonegotiate) return `Command rejected: Conflict between 'nonegotiate' and 'dynamic' status on this interface: ${shortIf(n)}.`;
    if (mode.startsWith('dynamic') && i.psec && i.psec.enabled) return `Command rejected: ${n} is a secure port.`;
    i.sw = { ...i.sw, mode };
    return '';
  }, { propagate: true }), { only: 'switch' });
  def(IF, 'no switchport mode', each((s, a, i) => { if (i.sw) i.sw = { ...i.sw, mode: 'dynamic auto' }; }, { propagate: true }), { only: 'switch' });
  def(IF, 'switchport access vlan vid:<1-4094>{VLAN ID of the VLAN when this port is in access mode}', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    const v = Number(a.vid);
    i.sw = { ...i.sw, access: v };
    if (!s.cfg.vlans.has(v)) {
      s.cfg.vlans = new Map(s.cfg.vlans).set(v, { name: `VLAN${String(v).padStart(4, '0')}` });
      return '% Access VLAN does not exist. Creating vlan ' + v;
    }
    return '';
  }, { propagate: true }), { only: 'switch' });
  def(IF, 'no switchport access vlan [vid:<1-4094>]', each((s, a, i) => { if (i.sw) i.sw = { ...i.sw, access: 1 }; }, { propagate: true }), { only: 'switch' });
  def(IF, 'switchport voice vlan vid:<1-4094>{Vlan for voice traffic}', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    const v = Number(a.vid);
    i.sw = { ...i.sw, voice: v };
    if (!s.cfg.vlans.has(v)) {
      s.cfg.vlans = new Map(s.cfg.vlans).set(v, { name: `VLAN${String(v).padStart(4, '0')}` });
      return '% Voice VLAN does not exist. Creating vlan ' + v;
    }
    return '';
  }), { only: 'switch' });
  def(IF, 'no switchport voice vlan [vid:<1-4094>]', each((s, a, i) => { if (i.sw) i.sw = { ...i.sw, voice: null }; }), { only: 'switch' });
  def(IF, 'switchport trunk allowed vlan (vl:VLANLIST | add avl:VLANLIST | remove rvl:VLANLIST | except evl:VLANLIST | all | none{no VLANs})', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    const all = () => new Set(Array.from({ length: 4094 }, (_, k) => k + 1));
    let set;
    if (a.all) set = null;
    else if (a.none) set = new Set();
    else if (a.vl) set = parseVlanList(a.vl);
    else if (a.avl) set = new Set([...(i.sw.allowed || all()), ...parseVlanList(a.avl)]);
    else if (a.rvl) { set = new Set(i.sw.allowed || all()); parseVlanList(a.rvl).forEach((v) => set.delete(v)); } else { set = all(); parseVlanList(a.evl).forEach((v) => set.delete(v)); }
    if (set && set.size === 4094) set = null;
    i.sw = { ...i.sw, allowed: set };
    return '';
  }, { propagate: true }), { only: 'switch' });
  def(IF, 'no switchport trunk allowed vlan [LINE]', each((s, a, i) => { if (i.sw) i.sw = { ...i.sw, allowed: null }; }, { propagate: true }), { only: 'switch' });
  def(IF, 'switchport trunk native vlan vid:<1-4094>{VLAN ID of the native VLAN when this port is in trunking mode}', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    i.sw = { ...i.sw, native: Number(a.vid) };
    return '';
  }, { propagate: true }), { only: 'switch' });
  def(IF, 'no switchport trunk native vlan [vid:<1-4094>]', each((s, a, i) => { if (i.sw) i.sw = { ...i.sw, native: 1 }; }, { propagate: true }), { only: 'switch' });
  def(IF, '[no] switchport nonegotiate', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    if (!a.no && i.sw.mode.startsWith('dynamic')) return `Command rejected: Conflict between 'nonegotiate' and 'dynamic' status on this interface: ${shortIf(n)}.`;
    i.sw = { ...i.sw, nonegotiate: !a.no };
    return '';
  }, { propagate: true }), { only: 'switch' });

  // ---- EtherChannel ----
  def(IF, 'channel-group grp:<1-128>{Channel group number} mode (active | passive | on | desirable | auto)', (s, a) => {
    const g = Number(a.grp);
    const mode = ['active', 'passive', 'on', 'desirable', 'auto'].find((m) => a[m]);
    const po = `Port-channel${g}`;
    const outs = [];
    for (const n of s.ctx.ifaces) {
      const i = s.cfg.interfaces.get(n);
      if (!/Ethernet/.test(n)) { outs.push('% Channel group not supported on this interface'); continue; }
      const existing = [...s.cfg.interfaces.values()].find((x) => x !== i && x.channel && x.channel.group === g);
      if (existing && protoOf(existing.channel.mode) !== protoOf(mode)) {
        outs.push(`Command rejected (Channel protocol mismatch for interface ${shortIf(n)} in group ${g}): the interface can not be added to the channel group`);
        continue;
      }
      i.channel = { group: g, mode };
      if (s.loading) { if (!s.cfg.interfaces.has(po)) { const p = ensureIf(s.dev, po); p.sw = i.sw ? { ...i.sw } : null; } continue; }
      if (!s.cfg.interfaces.has(po)) {
        const p = ensureIf(s.dev, po);
        p.sw = i.sw ? { ...i.sw } : null;
        if (!i.sw) p.sw = null;
        outs.push(`Creating a port-channel interface Port-channel ${g}\n`);
      } else {
        const p = s.cfg.interfaces.get(po);
        i.sw = p.sw ? { ...p.sw } : null;
      }
    }
    s.changed();
    return [...new Set(outs)].join('\n');
  }, { only: 'switch' });
  def(IF, 'no channel-group [LINE]', each((s, a, i) => { i.channel = null; }), { only: 'switch' });

  // ---- spanning tree ----
  def(IF, 'spanning-tree portfast [edge{Enable portfast edge on the interface}] [trunk{Enable portfast on the interface even in trunk mode}]', each((s, a, i, n) => {
    i.stp = { ...i.stp, portfast: a.trunk ? 'trunk' : true };
    const warn = '%Warning: portfast should only be enabled on ports connected to a single\n host. Connecting hubs, concentrators, switches, bridges, etc... to this\n interface  when portfast is enabled, can cause temporary bridging loops.\n Use with CAUTION';
    return a.trunk ? warn : `${warn}\n\n%Portfast has been configured on ${n} but will only\n have effect when the interface is in a non-trunking mode.`;
  }), { only: 'switch' });
  def(IF, '(no spanning-tree portfast [edge] | spanning-tree portfast disable{Disable portfast for this interface})', each((s, a, i) => { i.stp = { ...i.stp, portfast: false }; }), { only: 'switch' });
  def(IF, 'spanning-tree bpduguard (enable{Enable BPDU guard for this interface} | disable{Disable BPDU guard for this interface})', each((s, a, i) => { i.stp = { ...i.stp, bpduguard: !!a.enable }; }), { only: 'switch' });
  def(IF, 'no spanning-tree bpduguard [LINE]', each((s, a, i) => { i.stp = { ...i.stp, bpduguard: false }; }), { only: 'switch' });
  def(IF, 'spanning-tree guard (root{Set guard mode to root guard on interface} | loop | none)', each((s, a, i) => { i.stp = { ...i.stp, guard: a.root ? 'root' : a.loop ? 'loop' : null }; }), { only: 'switch' });
  def(IF, 'no spanning-tree guard [LINE]', each((s, a, i) => { i.stp = { ...i.stp, guard: null }; }), { only: 'switch' });
  def(IF, 'spanning-tree cost c:<1-200000000>{port path cost}', each((s, a, i) => { i.stp = { ...i.stp, cost: Number(a.c) }; }), { only: 'switch' });
  def(IF, 'no spanning-tree cost [LINE]', each((s, a, i) => { i.stp = { ...i.stp, cost: null }; }), { only: 'switch' });
  def(IF, 'spanning-tree port-priority pp:<0-240>{port priority in increments of 16}', each((s, a, i) => {
    if (Number(a.pp) % 16) return '% Port Priority in increments of 16 is required\n% Allowed values are:\n  0   16  32  48  64  80  96  112 128 144 160 176 192 208 224 240';
    i.stp = { ...i.stp, prio: Number(a.pp) };
  }), { only: 'switch' });

  // ---- port security ----
  def(IF, 'switchport port-security', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    if (i.sw.mode.startsWith('dynamic')) return `Command rejected: ${n} is a dynamic port.`;
    i.psec = { ...psec(i), enabled: true };
  }), { only: 'switch' });
  def(IF, 'no switchport port-security', each((s, a, i, n) => { if (i.psec) i.psec = { ...i.psec, enabled: false }; s.dev.st.psec.delete(n); s.dev.st.errDisabled.delete(n); }), { only: 'switch' });
  def(IF, 'switchport port-security maximum max:<1-4097>{Maximum addresses}', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    i.psec = { ...psec(i), max: Number(a.max) };
  }), { only: 'switch' });
  def(IF, 'no switchport port-security maximum [LINE]', each((s, a, i) => { if (i.psec) i.psec = { ...i.psec, max: 1 }; }), { only: 'switch' });
  def(IF, 'switchport port-security violation (protect | restrict | shutdown{Security violation shutdown mode})', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    i.psec = { ...psec(i), violation: a.protect ? 'protect' : a.restrict ? 'restrict' : 'shutdown' };
  }), { only: 'switch' });
  def(IF, 'no switchport port-security violation [LINE]', each((s, a, i) => { if (i.psec) i.psec = { ...i.psec, violation: 'shutdown' }; }), { only: 'switch' });
  def(IF, '[no] switchport port-security mac-address sticky', each((s, a, i, n) => {
    const e = needSw(i, n); if (e) return e;
    const p = psec(i);
    if (a.no) { i.psec = { ...p, sticky: false, stickyMacs: [] }; return ''; }
    const dyn = s.dev.st.psec.get(n);
    const learned = dyn ? [...dyn.macs].map((mac) => ({ mac, vlan: i.sw.access })) : [];
    if (dyn) dyn.macs.clear();
    i.psec = { ...p, sticky: true, stickyMacs: [...p.stickyMacs, ...learned] };
    return '';
  }), { only: 'switch' });
  def(IF, '[no] switchport port-security mac-address sticky mac:H.H.H [vlan vid:<1-4094>]', each((s, a, i) => {
    const p = psec(i); const mac = parseMac(a.mac);
    const rest = p.stickyMacs.filter((x) => x.mac !== mac);
    i.psec = { ...p, stickyMacs: a.no ? rest : [...rest, { mac, vlan: a.vid ? Number(a.vid) : (i.sw ? i.sw.access : 1) }] };
  }), { only: 'switch' });
  def(IF, '[no] switchport port-security mac-address mac:H.H.H [vlan vid:<1-4094>]', each((s, a, i) => {
    const p = psec(i); const mac = parseMac(a.mac);
    const rest = p.static.filter((x) => x.mac !== mac);
    i.psec = { ...p, static: a.no ? rest : [...rest, { mac, vlan: a.vid ? Number(a.vid) : (i.sw ? i.sw.access : 1) }] };
  }), { only: 'switch' });

  // ---- storm control ----
  def(IF, 'storm-control (broadcast | multicast | unicast) level lvl:WORD{Enter rising threshold (0.00-100.00)} [low:WORD{Enter falling threshold}]', each((s, a, i) => {
    const v = Number(a.lvl);
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(a.lvl) || v > 100) return '% Invalid input detected';
    const kind = a.broadcast ? 'broadcast' : a.multicast ? 'multicast' : 'unicast';
    i.storm = { ...(i.storm || { action: null }), [kind]: v.toFixed(2) };
  }), { only: 'switch' });
  def(IF, 'storm-control action (shutdown{Shutdown this interface if a storm occurs} | trap{Send SNMP trap if a storm occurs})', each((s, a, i) => { i.storm = { ...(i.storm || {}), action: a.shutdown ? 'shutdown' : 'trap' }; }), { only: 'switch' });
  def(IF, 'no storm-control [LINE]', each((s, a, i) => { i.storm = null; }), { only: 'switch' });

  // ---- L2 security trust ----
  def(IF, '[no] ip dhcp snooping trust', each((s, a, i) => { i.snoopTrust = !a.no; }), { only: 'switch' });
  def(IF, '[no] ip dhcp snooping limit rate r:<1-2048>{DHCP snooping rate limit}', each(() => ''), { only: 'switch' });
  def(IF, '[no] ip arp inspection trust', each((s, a, i) => { i.daiTrust = !a.no; }), { only: 'switch' });

  // ---- L3 services ----
  def(IFS, 'ip helper-address h:A.B.C.D{IP destination address}', each((s, a, i) => {
    const ip = parseIp(a.h);
    if (!i.helpers.includes(ip)) i.helpers = [...i.helpers, ip];
  }));
  def(IFS, 'no ip helper-address [h:A.B.C.D]', each((s, a, i) => { i.helpers = a.h ? i.helpers.filter((x) => x !== parseIp(a.h)) : []; }));
  def(IFS, '[no] ip dhcp relay information trusted{Received DHCP packets may contain relay info option with zero giaddr}', each((s, a, i) => { i.dhcpRelayTrusted = !a.no; }), { only: 'router' });
  def(IFS, 'ip nat (inside | outside)', each((s, a, i) => { i.nat = a.inside ? 'inside' : 'outside'; }), { only: 'router' });
  def(IFS, 'no ip nat (inside | outside)', each((s, a, i) => { i.nat = null; }), { only: 'router' });
  def(IFS, 'ip access-group acl:WORD{Access-list name or number} (in | out)', each((s, a, i) => {
    if (a.in) i.aclIn = a.acl; else i.aclOut = a.acl;
  }));
  def(IFS, 'no ip access-group [acl:WORD] (in | out)', each((s, a, i) => { if (a.in) i.aclIn = null; else i.aclOut = null; }));
  def('subif', 'encapsulation dot1q vid:<1-4094>{IEEE 802.1Q VLAN ID required} [native]', each((s, a, i, n) => {
    const v = Number(a.vid);
    const parent = n.split('.')[0];
    const clash = [...s.cfg.interfaces.entries()].find(([k, x]) => k !== n && k.startsWith(`${parent}.`) && x.encap && x.encap.vlan === v);
    if (clash) return `Configuration of multiple subinterfaces of the same main\ninterface with the same VID (${v}) is not permitted.\nThis VID is already configured on ${clash[0]}.`;
    i.encap = { vlan: v, native: !!a.native };
  }), { only: 'router' });
  def('subif', 'no encapsulation dot1q [LINE]', each((s, a, i) => { i.encap = null; i.ip = null; }), { only: 'router' });
  def(IF, 'encapsulation dot1q vid:<1-4094> [native]', () => '%Command rejected: Configuring IEEE 802.1Q encapsulation on the main interface is not permitted', { only: 'router' });

  // ---- HSRP ----
  def(IFS, 'standby version ver:<1-2>{Version}', each((s, a, i) => { i.standbyVersion = Number(a.ver); }));
  def(IFS, 'no standby version [LINE]', each((s, a, i) => { i.standbyVersion = 1; }));
  def(IFS, 'standby [grp:<0-4095>{group number}] ip vip:A.B.C.D{Virtual IP address}', each((s, a, i) => {
    const g = hsrpGroup(i, a);
    if (typeof g === 'string') return g;
    g.ip = parseIp(a.vip);
    if (i.ip && netOf(g.ip, i.ip.mask) !== netOf(i.ip.addr, i.ip.mask)) return `% Address ${a.vip} in group ${a.grp ?? 0} not within a subnet on this interface`;
  }));
  def(IFS, 'standby [grp:<0-4095>] priority pri:<0-255>{Priority level}', each((s, a, i) => { const g = hsrpGroup(i, a); if (typeof g === 'string') return g; g.priority = Number(a.pri); }));
  def(IFS, 'standby [grp:<0-4095>] preempt', each((s, a, i) => { const g = hsrpGroup(i, a); if (typeof g === 'string') return g; g.preempt = true; }));
  def(IFS, 'no standby [grp:<0-4095>] [(ip [LINE] | priority [LINE] | preempt)]', each((s, a, i) => {
    const grp = a.grp !== undefined ? Number(a.grp) : 0;
    const g = i.standby.get(grp);
    if (!g) return '';
    if (a.ip) g.ip = null;
    else if (a.priority) g.priority = 100;
    else if (a.preempt) g.preempt = false;
    else { const m = new Map(i.standby); m.delete(grp); i.standby = m; }
    return '';
  }));

  // ---- OSPF interface ----
  def(IFS, `ip ospf pid:<1-65535>{Process ID} area ${AREA}`, each((s, a, i) => { i.ospf = { ...i.ospf, area: { pid: Number(a.pid), ...parseArea(a) } }; }));
  def(IFS, `no ip ospf pid:<1-65535> area [${AREA}]`, each((s, a, i) => { i.ospf = { ...i.ospf, area: null }; }));
  def(IFS, 'ip ospf cost c:<1-65535>{Cost}', each((s, a, i) => { i.ospf = { ...i.ospf, cost: Number(a.c) }; }));
  def(IFS, 'ip ospf priority p:<0-255>{Priority}', each((s, a, i) => { i.ospf = { ...i.ospf, priority: Number(a.p) }; }));
  def(IFS, 'ip ospf network (point-to-point | broadcast{Specify OSPF broadcast multi-access network})', each((s, a, i) => { i.ospf = { ...i.ospf, netType: a['point-to-point'] ? 'POINT_TO_POINT' : 'BROADCAST' }; }));
  def(IFS, 'ip ospf hello-interval h:<1-65535>{Seconds}', each((s, a, i) => { i.ospf = { ...i.ospf, hello: Number(a.h) }; }));
  def(IFS, 'ip ospf dead-interval d:<1-65535>{Seconds}', each((s, a, i) => { i.ospf = { ...i.ospf, dead: Number(a.d) }; }));
  def(IFS, 'ip ospf mtu-ignore', each((s, a, i) => { i.ospf = { ...i.ospf, mtuIgnore: true }; }));
  def(IFS, 'no ip ospf (cost | priority | network | hello-interval | dead-interval | mtu-ignore) [LINE]', each((s, a, i) => {
    const key = a.cost ? 'cost' : a.priority ? 'priority' : a.network ? 'netType' : a['hello-interval'] ? 'hello' : a['dead-interval'] ? 'dead' : 'mtuIgnore';
    const dflt = { cost: null, priority: 1, netType: null, hello: null, dead: null, mtuIgnore: false };
    i.ospf = { ...i.ospf, [key]: dflt[key] };
  }));
  def(IFS, `ipv6 ospf pid:<1-65535>{Process ID} area ${AREA}`, each((s, a, i) => { i.ospf6 = { ...i.ospf6, area: { pid: Number(a.pid), ...parseArea(a) } }; }));
  def(IFS, `no ipv6 ospf pid:<1-65535> area [${AREA}]`, each((s, a, i) => { i.ospf6 = { ...i.ospf6, area: null }; }));
  def(IFS, 'ipv6 ospf cost c:<1-65535>{Cost}', each((s, a, i) => { i.ospf6 = { ...i.ospf6, cost: Number(a.c) }; }));
  def(IFS, 'ipv6 ospf priority p:<0-255>{Priority}', each((s, a, i) => { i.ospf6 = { ...i.ospf6, priority: Number(a.p) }; }));
}

function protoOf(mode) { return mode === 'active' || mode === 'passive' ? 'lacp' : mode === 'on' ? 'on' : 'pagp'; }

function psec(i) { return i.psec || { enabled: false, max: 1, violation: 'shutdown', sticky: false, stickyMacs: [], static: [] }; }

function hsrpGroup(i, a) {
  const grp = a.grp !== undefined ? Number(a.grp) : 0;
  if (i.standbyVersion !== 2 && grp > 255) return '% Invalid group number for HSRP version 1 (0-255)';
  if (!i.standby.has(grp)) i.standby = new Map(i.standby).set(grp, { ip: null, priority: 100, preempt: false });
  return i.standby.get(grp);
}

function setIp(s, a, i, n) {
  if (i.sw) return '% IP addresses may not be configured on L2 links.';
  if (isSubif(n) && !i.encap) return '% Configuring IP routing on a LAN subinterface is only allowed if that\nsubinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q,\nor ISL vLAN.';
  const ip = parseIp(a.addr); const mask = parseIp(a.mask);
  if (!isValidMask(mask)) return `Bad mask ${hex8(mask)} for address ${a.addr}`;
  const len = maskToLen(mask);
  if (len < 31 && (ip === netOf(ip, mask) || ip === broadcastOf(ip, mask))) return `Bad mask /${len} for address ${a.addr}`;
  for (const [other, oi] of s.cfg.interfaces) {
    if (other === n || !oi.ip) continue;
    const m = Math.min(len, maskToLen(oi.ip.mask));
    const mm = m === 0 ? 0 : (0xffffffff << (32 - m)) >>> 0;
    if (netOf(ip, mm) === netOf(oi.ip.addr, mm)) return `% ${ipStr(netOf(ip, mask))} overlaps with ${other}`;
  }
  if (a.secondary) {
    if (!i.ip) return `% Primary address not configured on ${n}`;
    if (!i.secondary.some((x) => x.addr === ip)) i.secondary = [...i.secondary, { addr: ip, mask }];
    return '';
  }
  i.ip = { addr: ip, mask }; i.dhcpClient = false;
  i.ipMethod = s.loading ? 'NVRAM' : 'manual';
  if (s.dev.st.ifLeases) s.dev.st.ifLeases.delete(n);
  return '';
}

export { isSubif };
