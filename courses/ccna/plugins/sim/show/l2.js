// show vlan / mac address-table / spanning-tree / etherchannel / port-security /
// cdp / lldp / dhcp snooping / arp inspection.

import { ipStr, vlanListStr, hashStr } from '../util.js';
import { shortIf, cdpIf, compareIf, isPhysical } from '../ifnames.js';
import { isSwitch } from '../device.js';
import { protoOfMode } from '../link.js';
import { secureMacs } from '../frames.js';

export function showVlan(net, dev, { brief = true, id = null } = {}) {
  const L = ['', 'VLAN Name                             Status    Ports', '---- -------------------------------- --------- -------------------------------'];
  const members = new Map();
  for (const [n, i] of dev.cfg.interfaces) {
    if (!i.sw || !(isPhysical(n) || n.startsWith('Port-channel'))) continue;
    const ch = i.channel && dev.chan.get(i.channel.group);
    if (ch && ch.members.get(n) === 'P') continue;
    const port = dev.l2.get(n);
    if (port && port.oper === 'trunk') continue;
    if (!port && i.sw.mode === 'trunk') continue;
    [i.sw.access, i.sw.voice].filter(Boolean).forEach((v) => {
      if (!members.has(v)) members.set(v, []);
      members.get(v).push(n);
    });
  }
  const vlans = [...dev.cfg.vlans.entries()].filter(([v]) => id === null || v === id).sort((a, b) => a[0] - b[0]);
  if (id !== null && !vlans.length) return `VLAN id ${id} not found in current VLAN database`;
  for (const [v, info] of vlans) {
    const ports = (members.get(v) || []).sort(compareIf).map(shortIf);
    const head = `${String(v).padEnd(4)} ${info.name.padEnd(32)} active    `;
    if (!ports.length) L.push(head.trimEnd());
    for (let k = 0; k < Math.max(1, ports.length); k += 4) {
      const chunk = ports.slice(k, k + 4).join(', ');
      if (!chunk) continue;
      L.push(k === 0 ? head + chunk : ' '.repeat(48) + chunk);
    }
  }
  if (id === null) {
    L.push('1002 fddi-default                     act/unsup ', '1003 token-ring-default               act/unsup ', '1004 fddinet-default                  act/unsup ', '1005 trnet-default                    act/unsup ');
  }
  if (!brief) {
    L.push('', 'VLAN Type  SAID       MTU   Parent RingNo BridgeNo Stp  BrdgMode Trans1 Trans2', '---- ----- ---------- ----- ------ ------ -------- ---- -------- ------ ------');
    vlans.forEach(([v]) => L.push(`${String(v).padEnd(4)} enet  ${String(100000 + v).padEnd(10)} 1500  -      -      -        -    -        0      0   `));
    L.push('', 'Remote SPAN VLANs', '------------------------------------------------------------------------------', '', '', 'Primary Secondary Type              Ports', '------- --------- ----------------- ------------------------------------------');
  }
  return L.join('\n');
}

export function showMac(net, dev, f = {}) {
  const L = ['          Mac Address Table', '-------------------------------------------', '', 'Vlan    Mac Address       Type        Ports', '----    -----------       --------    -----'];
  const rows = [];
  for (const [n, i] of dev.cfg.interfaces) {
    if (!i.psec || !i.psec.enabled) continue;
    const sec = secureMacs(dev, n);
    [...sec.sticky, ...sec.static].forEach((m) => rows.push({ vlan: m.vlan, mac: m.mac, type: 'STATIC', port: n }));
  }
  for (const e of dev.st.mac.values()) {
    if (rows.some((r) => r.mac === e.mac && r.vlan === e.vlan)) continue;
    rows.push(e);
  }
  const sel = rows.filter((r) => (!f.vlan || r.vlan === f.vlan) && (!f.iface || r.port === f.iface) && (!f.dynamic || r.type === 'DYNAMIC'));
  sel.sort((a, b) => a.vlan - b.vlan || (a.mac < b.mac ? -1 : 1)).forEach((r) => L.push(`${String(r.vlan).padStart(4)}    ${r.mac}    ${r.type.padEnd(11)} ${shortIf(r.port)}`));
  L.push(`Total Mac Addresses for this criterion: ${sel.length}`);
  return L.join('\n');
}

function bidLines(label, prio, v, mac, extra) {
  return [
    `  ${label}  Priority    ${prio}${extra ? `  (priority ${prio - v} sys-id-ext ${v})` : ''}`,
    `             Address     ${mac}`,
  ];
}

export function showStpVlan(net, dev, v) {
  const inst = dev.stp && dev.stp.get(v);
  if (!inst || inst.ports.size === 0) return null;
  const proto = dev.cfg.stp.mode === 'rapid-pvst' ? 'rstp' : 'ieee';
  const L = [`VLAN${String(v).padStart(4, '0')}`, `  Spanning tree enabled protocol ${proto}`];
  L.push(...bidLines('Root ID  ', inst.rootBid.prio, v, inst.rootBid.mac, false));
  if (inst.isRoot) L.push('             This bridge is the root');
  else {
    L.push(`             Cost        ${inst.rootCost}`);
    const rp = inst.rootPort;
    const num = rp ? inst.ports.get(rp).num : 0;
    L.push(`             Port        ${num} (${rp})`);
  }
  L.push('             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec', '');
  L.push(...bidLines('Bridge ID', inst.bid.prio, v, inst.bid.mac, true));
  L.push('             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec', '             Aging Time  300 sec', '');
  L.push('Interface           Role Sts Cost      Prio.Nbr Type', '------------------- ---- --- --------- -------- --------------------------------');
  [...inst.ports.entries()].sort((a, b) => compareIf(a[0], b[0])).forEach(([p, r]) => {
    let type = 'P2p';
    if (r.edge) type += ' Edge';
    if (r.inc) type += ` *${r.inc.startsWith('PVID') ? 'PVID' : r.inc}_Inc`;
    const sts = r.state === 'BKN' ? 'BKN*' : r.state;
    L.push(`${shortIf(p).padEnd(19)} ${r.role} ${sts.padEnd(3)}${sts.length > 3 ? '' : ' '}${String(r.cost).padEnd(9)} ${`${r.prio}.${r.num}`.padEnd(8)} ${type}`);
  });
  return L.join('\n');
}

export function showStp(net, dev, vlan) {
  if (vlan !== undefined) {
    const s = showStpVlan(net, dev, vlan);
    return s === null ? `Spanning tree instance(s) for vlan ${vlan} does not exist.` : `\n${s}`;
  }
  const parts = [...(dev.stp || new Map()).keys()].sort((a, b) => a - b).map((v) => showStpVlan(net, dev, v)).filter(Boolean);
  return parts.length ? `\n${parts.join('\n\n')}` : 'No spanning tree instance exists.';
}

export function showStpSummary(net, dev) {
  const roots = [...(dev.stp || new Map()).entries()].filter(([, i]) => i.isRoot && i.ports.size).sort((a, b) => a[0] - b[0]).map(([v]) => `VLAN${String(v).padStart(4, '0')}`);
  const L = [`Switch is in ${dev.cfg.stp.mode} mode`, `Root bridge for: ${roots.length ? roots.join(', ') : 'none'}`,
    'EtherChannel misconfig guard            is enabled', 'Extended system ID                      is enabled',
    `Portfast Default                        is ${dev.cfg.stp.portfastDefault ? 'enabled' : 'disabled'}`,
    `PortFast BPDU Guard Default             is ${dev.cfg.stp.bpduguardDefault ? 'enabled' : 'disabled'}`,
    'Portfast BPDU Filter Default            is disabled', 'Loopguard Default                       is disabled', 'UplinkFast                              is disabled',
    'BackboneFast                            is disabled', 'Configured Pathcost method used is short', '',
    'Name                   Blocking Listening Learning Forwarding STP Active', '---------------------- -------- --------- -------- ---------- ----------'];
  let tb = 0; let tf = 0;
  [...(dev.stp || new Map()).entries()].sort((a, b) => a[0] - b[0]).forEach(([v, inst]) => {
    if (!inst.ports.size) return;
    const b = [...inst.ports.values()].filter((r) => r.state !== 'FWD').length;
    const f = inst.ports.size - b; tb += b; tf += f;
    L.push(`${`VLAN${String(v).padStart(4, '0')}`.padEnd(22)} ${String(b).padStart(8)} ${'0'.padStart(9)} ${'0'.padStart(8)} ${String(f).padStart(10)} ${String(b + f).padStart(10)}`);
  });
  return L.join('\n');
}

export function showEtherchannelSummary(net, dev) {
  const L = ['Flags:  D - down        P - bundled in port-channel', '        I - stand-alone s - suspended', '        H - Hot-standby (LACP only)',
    '        R - Layer3      S - Layer2', '        U - in use      f - failed to allocate aggregator', '', '        M - not in use, minimum links not met',
    '        u - unsuitable for bundling', '        w - waiting to be aggregated', '        d - default port', '', '        A - formed by Auto LAG', '', ''];
  const groups = [...dev.chan.values()].sort((a, b) => a.group - b.group);
  L.push(`Number of channel-groups in use: ${groups.length}`, `Number of aggregators:           ${groups.length}`, '');
  L.push('Group  Port-channel  Protocol    Ports', '------+-------------+-----------+-----------------------------------------------');
  groups.forEach((ch) => {
    const po = dev.cfg.interfaces.get(ch.po);
    const l3 = po && !po.sw;
    const flags = `${l3 ? 'R' : 'S'}${ch.up ? 'U' : 'D'}`;
    const members = [...ch.members.entries()].sort((a, b) => compareIf(a[0], b[0])).map(([m, f]) => `${shortIf(m)}(${f})`);
    const proto = protoOfMode([...ch.members.keys()].map((m) => dev.cfg.interfaces.get(m).channel.mode)[0]);
    L.push(`${String(ch.group).padEnd(6)} ${`${shortIf(ch.po)}(${flags})`.padEnd(15)} ${proto.padEnd(11)} ${members.join('   ')}`);
  });
  return L.join('\n');
}

export function showPortSecurity(net, dev, iface) {
  if (iface) {
    const i = dev.cfg.interfaces.get(iface);
    const p = i.psec || { enabled: false, max: 1, violation: 'shutdown', sticky: false, stickyMacs: [], static: [] };
    const st = dev.st.psec.get(iface) || { macs: new Set(), violations: 0, last: null };
    const sec = secureMacs(dev, iface);
    const total = sec.static.length + sec.sticky.length + sec.dynamic.length;
    const err = dev.st.errDisabled.get(iface) === 'psecure-violation';
    const l1 = dev.l1.get(iface);
    const status = !p.enabled ? 'Secure-down' : err ? 'Secure-shutdown' : l1 && l1.up ? 'Secure-up' : 'Secure-down';
    return [
      `Port Security              : ${p.enabled ? 'Enabled' : 'Disabled'}`, `Port Status                : ${status}`,
      `Violation Mode             : ${p.violation[0].toUpperCase()}${p.violation.slice(1)}`, 'Aging Time                 : 0 mins', 'Aging Type                 : Absolute',
      'SecureStatic Address Aging : Disabled', `Maximum MAC Addresses      : ${p.max}`, `Total MAC Addresses        : ${total}`,
      `Configured MAC Addresses   : ${sec.static.length}`, `Sticky MAC Addresses       : ${sec.sticky.length}`,
      `Last Source Address:Vlan   : ${st.last || '0000.0000.0000:0'}`, `Security Violation Count   : ${st.violations}`,
    ].join('\n');
  }
  const L = ['Secure Port  MaxSecureAddr  CurrentAddr  SecurityViolation  Security Action', '                (Count)       (Count)          (Count)', '---------------------------------------------------------------------------'];
  [...dev.cfg.interfaces.entries()].filter(([, i]) => i.psec && i.psec.enabled).sort((a, b) => compareIf(a[0], b[0])).forEach(([n, i]) => {
    const sec = secureMacs(dev, n);
    const st = dev.st.psec.get(n) || { violations: 0 };
    const total = sec.static.length + sec.sticky.length + sec.dynamic.length;
    const act = `${i.psec.violation[0].toUpperCase()}${i.psec.violation.slice(1)}`;
    L.push(`${shortIf(n).padStart(10)}${String(i.psec.max).padStart(15)}${String(total).padStart(13)}${String(st.violations).padStart(19)}${act.padStart(17)}`);
  });
  L.push('---------------------------------------------------------------------------', 'Total Addresses in System (excluding one mac per port)     : 0', 'Max Addresses limit in System (excluding one mac per port) : 4096');
  return L.join('\n');
}

function capsOf(dev) {
  if (dev.type === 'router') return { short: 'R B S I', long: 'Router Source-Route-Bridge Switch IGMP ', lldp: 'R' };
  return dev.cfg.ipRouting ? { short: 'R S I', long: 'Router Switch IGMP ', lldp: 'B,R' } : { short: 'S I', long: 'Switch IGMP ', lldp: 'B' };
}

function deviceId(dev) { return dev.cfg.domainName ? `${dev.cfg.hostname}.${dev.cfg.domainName}` : dev.cfg.hostname; }

function holdtime(net, dev, n) { return 120 + ((hashStr(dev.name + n.local) + Math.floor(net.now() / 1000)) % 60); }

export function showCdpNeighbors(net, dev, detail) {
  if (!dev.cfg.cdp) return '% CDP is not enabled';
  if (detail) return showCdpDetail(net, dev);
  const L = ['Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge', '                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone, ', '                  D - Remote, C - CVTA, M - Two-port Mac Relay ', '', 'Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID'];
  dev.cdp.slice().sort((a, b) => (deviceId(a.dev) < deviceId(b.dev) ? -1 : 1)).forEach((n) => {
    const id = deviceId(n.dev);
    const rest = `${cdpIf(n.local).padEnd(17)} ${String(holdtime(net, dev, n)).padEnd(10)} ${capsOf(n.dev).short.padStart(11)} ${n.dev.hw.platform.slice(0, 9).padEnd(9)} ${cdpIf(n.port)}`;
    if (id.length > 16) L.push(id, `${' '.repeat(17)}${rest}`); else L.push(`${id.padEnd(16)} ${rest}`);
  });
  L.push('', `Total cdp entries displayed : ${dev.cdp.length}`);
  return L.join('\n');
}

function mgmtIp(dev, port) {
  const own = dev.l3.get(port);
  if (own && own.ip !== null) return own.ip;
  const any = [...dev.l3.values()].find((l) => l.up && l.ip !== null);
  return any ? any.ip : null;
}

function showCdpDetail(net, dev) {
  const out = [];
  dev.cdp.forEach((n) => {
    const ip = mgmtIp(n.dev, n.port);
    const port = n.dev.l2 && n.dev.l2.get(n.port);
    const caps = capsOf(n.dev).long;
    out.push([
      '-------------------------', `Device ID: ${deviceId(n.dev)}`, 'Entry address(es): ', ...(ip !== null ? [`  IP address: ${ipStr(ip)}`] : []),
      `Platform: ${n.dev.hw.cdpPlatform},  Capabilities: ${caps}`, `Interface: ${n.local},  Port ID (outgoing port): ${n.port}`,
      `Holdtime : ${holdtime(net, dev, n)} sec`, '', 'Version :',
      `Cisco IOS Software [Cupertino], ${n.dev.type === 'router' ? 'ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M)' : 'Catalyst L3 Switch Software (CAT9K_IOSXE)'}, Version ${n.dev.hw.version}, RELEASE SOFTWARE (fc3)`,
      'Technical Support: http://www.cisco.com/techsupport', 'Copyright (c) 1986-2023 by Cisco Systems, Inc.', 'Compiled Fri 20-Oct-23 10:44 by mcpre', '',
      'advertisement version: 2', ...(port && port.cfg.sw ? ["VTP Management Domain: ''", `Native VLAN: ${port.cfg.sw.native}`] : []),
      `Duplex: ${n.dev.l1.get(n.port).duplex}`, 'Management address(es): ', ...(ip !== null ? [`  IP address: ${ipStr(ip)}`] : []), '',
    ].join('\n'));
  });
  return `${out.join('\n')}\n\nTotal cdp entries displayed : ${dev.cdp.length}`;
}

export function showCdp(net, dev) {
  if (!dev.cfg.cdp) return '% CDP is not enabled';
  return 'Global CDP information:\n\tSending CDP packets every 60 seconds\n\tSending a holdtime value of 180 seconds\n\tSending CDPv2 advertisements is  enabled';
}

export function showLldpNeighbors(net, dev, detail) {
  if (!dev.cfg.lldp) return '% LLDP is not enabled';
  if (detail) {
    const out = dev.lldp.map((n) => {
      const ip = mgmtIp(n.dev, n.port);
      return ['------------------------------------------------', `Local Intf: ${shortIf(n.local)}`, `Chassis id: ${n.dev.baseMac}`, `Port id: ${shortIf(n.port)}`,
        `Port Description: ${n.dev.cfg.interfaces.get(n.port).description || n.port}`, `System Name: ${deviceId(n.dev)}`, '', 'System Description: ',
        `Cisco IOS Software [Cupertino], Version ${n.dev.hw.version}, RELEASE SOFTWARE (fc3)`, '', 'Time remaining: 101 seconds',
        `System Capabilities: ${capsOf(n.dev).lldp}`, `Enabled Capabilities: ${capsOf(n.dev).lldp}`, 'Management Addresses:', ...(ip !== null ? [`    IP: ${ipStr(ip)}`] : []),
        'Auto Negotiation - supported, enabled', ''].join('\n');
    });
    return `${out.join('\n')}\n\nTotal entries displayed: ${dev.lldp.length}`;
  }
  const L = ['Capability codes:', '    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device', '    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other', '', 'Device ID           Local Intf     Hold-time  Capability      Port ID'];
  dev.lldp.forEach((n) => L.push(`${deviceId(n.dev).slice(0, 19).padEnd(19)} ${shortIf(n.local).padEnd(14)} ${'120'.padEnd(10)} ${capsOf(n.dev).lldp.padEnd(15)} ${shortIf(n.port)}`));
  L.push('', `Total entries displayed: ${dev.lldp.length}`);
  return L.join('\n');
}

export function showDhcpSnooping(net, dev) {
  const s = dev.cfg.snooping;
  const L = [`Switch DHCP snooping is ${s.enabled ? 'enabled' : 'disabled'}`, 'Switch DHCP gleaning is disabled',
    'DHCP snooping is configured on following VLANs:', s.vlans.size ? vlanListStr(s.vlans) : 'none',
    'DHCP snooping is operational on following VLANs:', s.enabled && s.vlans.size ? vlanListStr(new Set([...s.vlans].filter((v) => dev.cfg.vlans.has(v)))) : 'none',
    'DHCP snooping is configured on the following L3 Interfaces:', '',
    `Insertion of option 82 is ${s.option82 ? 'enabled' : 'disabled'}`, '   circuit-id default format: vlan-mod-port', '   remote-id: ' + dev.baseMac + ' (MAC)',
    'Option 82 on untrusted port is not allowed', 'Verification of hwaddr field is enabled', 'Verification of giaddr field is enabled',
    'DHCP snooping trust/rate is configured on the following Interfaces:', '', 'Interface                  Trusted    Allow option    Rate limit (pps)',
    '-----------------------    -------    ------------    ----------------   '];
  [...dev.cfg.interfaces.entries()].filter(([, i]) => i.snoopTrust).sort((a, b) => compareIf(a[0], b[0])).forEach(([n]) => {
    L.push(`${n.padEnd(26)} yes        yes             unlimited`, '  Custom circuit-ids:');
  });
  return L.join('\n');
}

export function showSnoopBinding(net, dev) {
  const L = ['MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface', '------------------  ---------------  ----------  -------------  ----  --------------------'];
  const list = [...dev.st.snoopBindings.values()];
  list.forEach((b) => L.push(`${b.mac.toUpperCase().replace(/(\w{2})(\w{2})\.(\w{2})(\w{2})\.(\w{2})(\w{2})/, '$1:$2:$3:$4:$5:$6').padEnd(19)} ${ipStr(b.ip).padEnd(16)} ${String(Math.floor(b.lease / 1000)).padEnd(11)} dhcp-snooping  ${String(b.vlan).padEnd(5)} ${b.port}`));
  L.push(`Total number of bindings: ${list.length}`, '');
  return L.join('\n');
}

export function showArpInspection(net, dev, vlan) {
  const vlans = [...dev.cfg.dai].filter((v) => vlan === undefined || v === vlan).sort((a, b) => a - b);
  const L = ['', 'Source Mac Validation      : Disabled', 'Destination Mac Validation : Disabled', 'IP Address Validation      : Disabled', '',
    ' Vlan     Configuration    Operation   ACL Match          Static ACL', ' ----     -------------    ---------   ---------          ----------'];
  vlans.forEach((v) => L.push(`${String(v).padStart(5)}     Enabled          ${dev.cfg.vlans.has(v) ? 'Active   ' : 'Inactive '}                                  `));
  L.push('', ' Vlan     ACL Logging      DHCP Logging      Probe Logging', ' ----     -----------      ------------      -------------');
  vlans.forEach((v) => L.push(`${String(v).padStart(5)}     Deny             Deny              Off          `));
  L.push('', ' Vlan      Forwarded        Dropped     DHCP Drops      ACL Drops', ' ----      ---------        -------     ----------      ---------');
  vlans.forEach((v) => L.push(`${String(v).padStart(5)}${'0'.padStart(15)}${String(dev.st.daiDrops || 0).padStart(15)}${String(dev.st.daiDrops || 0).padStart(15)}${'0'.padStart(15)}`));
  return L.join('\n');
}

export { isSwitch, protoOfMode };
