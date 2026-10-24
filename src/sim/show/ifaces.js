// show ip interface brief / show ip interface / show interfaces [x|status|trunk|switchport|description].

import { ipStr, maskToLen, vlanListStr, fmtDuration } from '../util.js';
import { shortIf, compareIf, isPhysical, isPortChannel, isSvi, isLoopback, isSubif } from '../ifnames.js';
import { isSwitch } from '../device.js';
import { portVlans } from '../link.js';
import { stpForwarding } from '../stp.js';

function sortedL3(dev) { return [...dev.l3.values()].sort((a, b) => compareIf(a.name, b.name)); }

export function showIpIntBrief(net, dev) {
  const L = ['Interface              IP-Address      OK? Method Status                Protocol'];
  for (const l of sortedL3(dev)) {
    const ip = l.ip !== null ? ipStr(l.ip) : 'unassigned';
    const method = l.dhcp ? 'DHCP' : l.cfg.dhcpClient ? 'DHCP' : l.ip !== null ? (l.cfg.ipMethod || 'manual') : 'unset';
    L.push(`${l.name.padEnd(22)} ${ip.padEnd(15)} YES ${method.padEnd(6)} ${l.status[0].padEnd(21)} ${l.status[1]}`.padEnd(80));
  }
  return L.map((x) => x.trimEnd()).join('\n');
}

export function showIpInterface(net, dev, only) {
  const out = [];
  for (const l of sortedL3(dev)) {
    if (only && l.name !== only) continue;
    const i = l.cfg;
    const L = [`${l.name} is ${l.status[0]}, line protocol is ${l.status[1]}`];
    if (!l.l3) { L.push('  Internet protocol processing disabled'); out.push(L.join('\n')); continue; }
    if (l.ip === null) { L.push('  Internet protocol processing disabled'); out.push(L.join('\n')); continue; }
    L.push(`  Internet address is ${ipStr(l.ip)}/${maskToLen(l.mask)}`);
    L.push('  Broadcast address is 255.255.255.255', `  Address determined by ${l.dhcp ? 'DHCP' : i.ipMethod === 'NVRAM' ? 'non-volatile memory' : 'setup command'}`);
    L.push(`  MTU is ${i.ipMtu || 1500} bytes`);
    if (i.helpers.length) L.push(`  Helper address${i.helpers.length > 1 ? 'es are' : ' is'} ${i.helpers.map(ipStr).join('\n                       ')}`);
    else L.push('  Helper address is not set');
    L.push('  Directed broadcast forwarding is disabled');
    l.secondary.forEach((s) => L.push(`  Secondary address ${ipStr(s.addr)}/${maskToLen(s.mask)}`));
    const mc = i.ospf && dev.cfg.ospf.size ? '224.0.0.5 224.0.0.6' : '';
    if (mc) L.push(`  Multicast reserved groups joined: ${mc}`);
    L.push(`  Outgoing Common access list is not set `, `  Outgoing access list is ${i.aclOut || 'not set'}`, `  Inbound Common access list is not set `, `  Inbound  access list is ${i.aclIn || 'not set'}`);
    L.push(`  Proxy ARP is ${i.proxyArp ? 'enabled' : 'disabled'}`, '  Local Proxy ARP is disabled', '  Security level is default', '  Split horizon is enabled');
    L.push('  ICMP redirects are always sent', '  ICMP unreachables are always sent', '  ICMP mask replies are never sent');
    L.push('  IP fast switching is enabled', '  IP Flow switching is disabled', '  IP CEF switching is enabled');
    L.push('  IP CEF switching turbo vector', '  IP Null turbo vector', '  Associated unicast routing topologies:', '        Topology "base", operation state is UP');
    L.push('  IP multicast fast switching is enabled', '  IP multicast distributed fast switching is disabled', '  IP route-cache flags are Fast, CEF');
    L.push('  Router Discovery is disabled', '  IP output packet accounting is disabled', '  IP access violation accounting is disabled');
    L.push('  TCP/IP header compression is disabled', '  RTP/IP header compression is disabled', '  Probe proxy name replies are disabled');
    L.push('  Policy routing is disabled', `  Network address translation is ${i.nat ? `enabled, interface in domain ${i.nat}` : 'disabled'}`);
    L.push('  BGP Policy Mapping is disabled', '  Input features: MCI Check', '  IPv4 WCCP Redirect outbound is disabled', '  IPv4 WCCP Redirect inbound is disabled', '  IPv4 WCCP Redirect exclude is disabled');
    out.push(L.join('\n'));
  }
  if (only && !out.length) return '';
  return out.join('\n');
}

function vlanCol(dev, name) {
  const port = dev.l2 && dev.l2.get(name);
  const i = dev.cfg.interfaces.get(name);
  if (!i.sw) return 'routed';
  const ch = i.channel && dev.chan.get(i.channel.group);
  const bundled = ch && ch.members.get(name) === 'P';
  const p = bundled ? dev.l2.get(ch.po) : port;
  if (p && p.oper === 'trunk') return 'trunk';
  return String(i.sw.access);
}

function statusCol(dev, name) {
  const i = dev.cfg.interfaces.get(name);
  if (isPortChannel(name)) {
    if (i.shutdown) return 'disabled';
    const ch = dev.chan.get(Number(name.slice(12)));
    return ch && ch.up ? 'connected' : 'notconnect';
  }
  const l1 = dev.l1.get(name);
  const ch = i.channel && dev.chan.get(i.channel.group);
  if (ch && ch.members.get(name) === 's' && l1.up) return 'suspended';
  return l1.status;
}

function duplexSpeed(dev, name) {
  const i = dev.cfg.interfaces.get(name);
  if (isPortChannel(name)) {
    const ch = dev.chan.get(Number(name.slice(12)));
    return ch && ch.up ? ['a-full', 'a-1000'] : ['auto', 'auto'];
  }
  const l1 = dev.l1.get(name);
  if (l1.up) {
    const d = i.duplex === 'auto' ? `a-${l1.duplex}` : l1.duplex;
    const s = i.speed === 'auto' ? `a-${l1.speed}` : String(l1.speed);
    return [d, s];
  }
  return [i.duplex, i.speed];
}

export function showIntStatus(net, dev, errOnly) {
  if (errOnly) {
    const L = ['Port         Name               Status       Reason               Err-disabled Vlans'];
    [...dev.st.errDisabled.entries()].sort((a, b) => compareIf(a[0], b[0])).forEach(([n, why]) => {
      const i = dev.cfg.interfaces.get(n);
      L.push(`${shortIf(n).padEnd(12)} ${(i.description || '').slice(0, 18).padEnd(18)} err-disabled ${why}`);
    });
    return L.join('\n');
  }
  const L = ['Port         Name               Status       Vlan       Duplex  Speed Type'];
  const names = [...dev.cfg.interfaces.keys()].filter((n) => isPhysical(n) || isPortChannel(n)).sort(compareIf);
  for (const n of names) {
    const i = dev.cfg.interfaces.get(n);
    const [dx, sp] = duplexSpeed(dev, n);
    const type = isPortChannel(n) ? '' : '10/100/1000BaseTX';
    L.push(`${shortIf(n).padEnd(12)} ${(i.description || '').slice(0, 18).padEnd(18)} ${statusCol(dev, n).padEnd(12)} ${vlanCol(dev, n).padEnd(10)} ${dx.padStart(6)} ${sp.padStart(6)} ${type}`.trimEnd());
  }
  return L.join('\n');
}

export function showIntTrunk(net, dev) {
  const trunks = [...dev.l2.values()].filter((p) => p.up && p.oper === 'trunk').sort((a, b) => compareIf(a.name, b.name));
  if (!trunks.length) return '';
  const L = ['', 'Port        Mode             Encapsulation  Status        Native vlan'];
  trunks.forEach((p) => {
    const s = p.cfg.sw;
    const mode = s.mode === 'trunk' ? 'on' : s.mode === 'dynamic desirable' ? 'desirable' : 'auto';
    L.push(`${shortIf(p.name).padEnd(11)} ${mode.padEnd(16)} ${'802.1q'.padEnd(14)} ${'trunking'.padEnd(13)} ${s.native}`);
  });
  L.push('', 'Port        Vlans allowed on trunk');
  trunks.forEach((p) => L.push(`${shortIf(p.name).padEnd(11)} ${p.cfg.sw.allowed ? vlanListStr(p.cfg.sw.allowed) : '1-4094'}`));
  L.push('', 'Port        Vlans allowed and active in management domain');
  trunks.forEach((p) => L.push(`${shortIf(p.name).padEnd(11)} ${vlanListStr(portVlans(dev, p).all)}`));
  L.push('', 'Port        Vlans in spanning tree forwarding state and not pruned');
  trunks.forEach((p) => {
    const fwd = new Set([...portVlans(dev, p).all].filter((v) => stpForwarding(dev, p.name, v)));
    L.push(`${shortIf(p.name).padEnd(11)} ${vlanListStr(fwd)}`);
  });
  return L.join('\n');
}

const MODE_TXT = { access: 'static access', trunk: 'trunk', 'dynamic auto': 'dynamic auto', 'dynamic desirable': 'dynamic desirable' };

export function showIntSwitchport(net, dev, only) {
  const names = [...dev.cfg.interfaces.keys()].filter((n) => (isPhysical(n) || isPortChannel(n)) && (!only || n === only)).sort(compareIf);
  const out = [];
  for (const n of names) {
    const i = dev.cfg.interfaces.get(n);
    if (!i.sw) { out.push(`Name: ${shortIf(n)}\nSwitchport: Disabled`); continue; }
    const s = i.sw;
    const port = dev.l2.get(n);
    const oper = !port || !port.up ? 'down' : port.oper === 'trunk' ? 'trunk' : 'static access';
    const vname = (v) => (dev.cfg.vlans.has(v) ? dev.cfg.vlans.get(v).name : 'Inactive');
    out.push([
      `Name: ${shortIf(n)}`, 'Switchport: Enabled', `Administrative Mode: ${MODE_TXT[s.mode]}`, `Operational Mode: ${oper}`,
      'Administrative Trunking Encapsulation: dot1q', `Operational Trunking Encapsulation: ${oper === 'trunk' ? 'dot1q' : 'native'}`,
      `Negotiation of Trunking: ${s.mode === 'access' || s.nonegotiate ? 'Off' : 'On'}`,
      `Access Mode VLAN: ${s.access} (${vname(s.access)})`, `Trunking Native Mode VLAN: ${s.native} (${vname(s.native)})`,
      'Administrative Native VLAN tagging: enabled', `Voice VLAN: ${s.voice ? `${s.voice} (${vname(s.voice)})` : 'none'}`,
      'Administrative private-vlan host-association: none ', 'Administrative private-vlan mapping: none ',
      'Administrative private-vlan trunk native VLAN: none', 'Administrative private-vlan trunk Native VLAN tagging: enabled',
      'Administrative private-vlan trunk encapsulation: dot1q', 'Administrative private-vlan trunk normal VLANs: none',
      'Administrative private-vlan trunk associations: none', 'Administrative private-vlan trunk mappings: none',
      'Operational private-vlan: none', `Trunking VLANs Enabled: ${s.allowed ? vlanListStr(s.allowed) : 'ALL'}`, 'Pruning VLANs Enabled: 2-1001',
      'Capture Mode Disabled', 'Capture VLANs Allowed: ALL', '', 'Protected: false', 'Unknown unicast blocked: disabled',
      'Unknown multicast blocked: disabled', 'Appliance trust: none',
    ].join('\n'));
  }
  return out.join('\n\n');
}

export function showIntDescription(net, dev) {
  const L = ['Interface                      Status         Protocol Description'];
  sortedL3(dev).forEach((l) => {
    const st = l.status[0] === 'administratively down' ? 'admin down' : l.status[0];
    L.push(`${shortIf(l.name).padEnd(30)} ${st.padEnd(14)} ${l.status[1].padEnd(8)} ${l.cfg.description || ''}`.trimEnd());
  });
  return L.join('\n');
}

function counters(dev, n) {
  const c = dev.st.counters && dev.st.counters.get(n);
  return c || { inPkts: 0, outPkts: 0, inBytes: 0, outBytes: 0, inBcast: 0, outBcast: 0, crc: 0, late: 0 };
}

/** A port-channel's BW is the sum of its bundled members' speeds (one member's worth when none are bundled). */
function poBandwidth(dev, name) {
  const ch = dev.chan && dev.chan.get(Number(name.slice(12)));
  const kbps = ch ? [...ch.members.entries()].filter(([, f]) => f === 'P').reduce((sum, [m]) => sum + (dev.l1.get(m)?.speed || 1000) * 1000, 0) : 0;
  return kbps || 1000000;
}

export function showInterfaces(net, dev, only) {
  const out = [];
  for (const l of sortedL3(dev)) {
    if (only && l.name !== only) continue;
    const i = l.cfg; const n = l.name;
    const err = dev.st.errDisabled.has(n);
    const l1 = dev.l1.get(n);
    let head = `${n} is ${l.status[0]}, line protocol is ${l.status[1]}`;
    if (err) head += ' (err-disabled)';
    else if (isSwitch(dev) && isPhysical(n) && l1 && !l1.up && !i.shutdown) head += ' (notconnect)';
    else if (isSwitch(dev) && isPhysical(n) && l1 && l1.up) head += ' (connected)';
    const L = [head];
    const hw = isLoopback(n) ? 'Loopback' : isSvi(n) ? 'Ethernet SVI' : isPortChannel(n) ? 'EtherChannel' : dev.type === 'router' ? dev.hw.hw : 'Gigabit Ethernet';
    L.push(isLoopback(n) ? `  Hardware is ${hw}` : `  Hardware is ${hw}, address is ${l.mac} (bia ${l.mac})`);
    if (i.description) L.push(`  Description: ${i.description}`);
    if (l.ip !== null && l.l3) L.push(`  Internet address is ${ipStr(l.ip)}/${maskToLen(l.mask)}`);
    const bw = i.bandwidth || (isLoopback(n) ? 8000000 : isPortChannel(n) ? poBandwidth(dev, n) : l1 && l1.speed ? l1.speed * 1000 : 1000000);
    L.push(`  MTU ${isLoopback(n) ? 1514 : i.mtu} bytes, BW ${bw} Kbit/sec, DLY ${isLoopback(n) ? 5000 : 10} usec, `, '     reliability 255/255, txload 1/255, rxload 1/255');
    if (i.encap) L.push(`  Encapsulation 802.1Q Virtual LAN, Vlan ID  ${i.encap.vlan}.`);
    else L.push(`  Encapsulation ${isLoopback(n) ? 'LOOPBACK' : 'ARPA'}, loopback not set`);
    if (isSubif(n)) {
      L.push('  ARP type: ARPA, ARP Timeout 04:00:00', '  Keepalive not supported ', '  Last clearing of "show interface" counters never');
      out.push(L.join('\n'));
      continue;
    }
    L.push(isLoopback(n) ? '  Keepalive set (10 sec)' : '  Keepalive not supported ');
    if (isPhysical(n)) {
      const dx = l1 && l1.up ? (l1.duplex === 'full' ? 'Full Duplex' : 'Half Duplex') : i.duplex === 'auto' ? 'Auto Duplex' : `${i.duplex[0].toUpperCase()}${i.duplex.slice(1)} Duplex`;
      const sp = l1 && l1.up ? `${l1.speed}Mbps` : i.speed === 'auto' ? 'Auto Speed' : `${i.speed}Mbps`;
      L.push(`  ${dx}, ${sp}, link type is ${i.speed === 'auto' ? 'auto' : 'force-up'}, media type is RJ45`, '  output flow-control is off, input flow-control is off');
    }
    if (isPortChannel(n)) {
      const ch = dev.chan.get(Number(n.slice(12)));
      const mem = ch ? [...ch.members.entries()].filter(([, f]) => f === 'P').map(([m]) => m) : [];
      L.push(`  Members in this channel: ${mem.map(shortIf).join(' ')}`);
    }
    L.push('  ARP type: ARPA, ARP Timeout 04:00:00', '  Last input 00:00:01, output 00:00:00, output hang never', '  Last clearing of "show interface" counters never');
    const c = counters(dev, n);
    L.push('  Input queue: 0/375/0/0 (size/max/drops/flushes); Total output drops: 0', '  Queueing strategy: fifo', '  Output queue: 0/40 (size/max)');
    L.push('  5 minute input rate 0 bits/sec, 0 packets/sec', '  5 minute output rate 0 bits/sec, 0 packets/sec');
    L.push(`     ${c.inPkts} packets input, ${c.inBytes} bytes, 0 no buffer`, `     Received ${c.inBcast} broadcasts (0 IP multicasts)`, '     0 runts, 0 giants, 0 throttles ');
    L.push(`     ${c.crc} input errors, ${c.crc} CRC, 0 frame, 0 overrun, 0 ignored`, '     0 watchdog, 0 multicast, 0 pause input');
    L.push(`     ${c.outPkts} packets output, ${c.outBytes} bytes, 0 underruns`, `     Output ${c.outBcast} broadcasts (0 IP multicasts)`);
    L.push(`     ${c.late} output errors, ${c.late} collisions, 0 interface resets`, '     0 unknown protocol drops', `     0 babbles, ${c.late} late collision, 0 deferred`);
    L.push('     0 lost carrier, 0 no carrier, 0 pause output', '     0 output buffer failures, 0 output buffers swapped out');
    out.push(L.join('\n'));
  }
  return out.join('\n');
}

export { fmtDuration };
