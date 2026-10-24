// Renders the running configuration in IOS-XE order and format.

import { ipStr, ip6Str, bigIp6, configStamp, type7Encrypt, hashStr, maskToLen, vlanListStr } from './util.js';
import { compareIf, isPhysical, isSubif, isLoopback, isSvi, isPortChannel } from './ifnames.js';
import { isSwitch } from './device.js';
import { aceText } from './acl.js';

function pw(cfg, plain) {
  if (cfg.passwordEncryption) return `7 ${type7Encrypt(plain, hashStr(plain) % 16)}`;
  return plain;
}

function userLine(cfg, u) {
  const priv = u.privilege !== 1 ? ` privilege ${u.privilege}` : '';
  if (u.secret) return `username ${u.name}${priv} secret ${u.secret.type} ${u.secret.hash}`;
  const p = cfg.passwordEncryption ? pw(cfg, u.password.plain) : `0 ${u.password.plain}`;
  return `username ${u.name}${priv} password ${p}`;
}

function areaStr(area, fmt) { return fmt === 'dot' ? ipStr(area) : String(area); }

export function renderInterface(dev, name, i) {
  const L = [`interface ${name}`];
  const sw = isSwitch(dev);
  if (i.description) L.push(` description ${i.description}`);
  if (i.bandwidth) L.push(` bandwidth ${i.bandwidth}`);
  if (i.encap) L.push(` encapsulation dot1Q ${i.encap.vlan}${i.encap.native ? ' native' : ''}`);
  if (i.sw) {
    const s = i.sw;
    if (s.access !== 1) L.push(` switchport access vlan ${s.access}`);
    if (s.native !== 1) L.push(` switchport trunk native vlan ${s.native}`);
    if (s.allowed) L.push(` switchport trunk allowed vlan ${vlanListStr(s.allowed)}`);
    if (s.mode !== 'dynamic auto') L.push(` switchport mode ${s.mode}`);
    if (s.nonegotiate) L.push(' switchport nonegotiate');
    if (s.voice) L.push(` switchport voice vlan ${s.voice}`);
    const p = i.psec;
    if (p) {
      if (p.max !== 1) L.push(` switchport port-security maximum ${p.max}`);
      if (p.violation !== 'shutdown') L.push(` switchport port-security violation ${p.violation}`);
      if (p.sticky) L.push(' switchport port-security mac-address sticky');
      p.stickyMacs.forEach((m) => L.push(` switchport port-security mac-address sticky ${m.mac}${s.mode === 'trunk' ? ` vlan ${m.vlan}` : ''}`));
      p.static.forEach((m) => L.push(` switchport port-security mac-address ${m.mac}${s.mode === 'trunk' ? ` vlan ${m.vlan}` : ''}`));
      if (p.enabled) L.push(' switchport port-security');
    }
  } else if (sw && (isPhysical(name) || isPortChannel(name))) {
    L.push(' no switchport');
  }
  if (!i.sw) {
    if (i.dhcpClient) L.push(' ip address dhcp');
    else if (i.ip) {
      L.push(` ip address ${ipStr(i.ip.addr)} ${ipStr(i.ip.mask)}`);
      i.secondary.forEach((x) => L.push(` ip address ${ipStr(x.addr)} ${ipStr(x.mask)} secondary`));
    } else if (!isLoopback(name) || i.ipv6.length === 0) L.push(' no ip address');
    i.helpers.forEach((h) => L.push(` ip helper-address ${ipStr(h)}`));
    if (i.dhcpRelayTrusted) L.push(' ip dhcp relay information trusted');
    if (i.aclIn) L.push(` ip access-group ${i.aclIn} in`);
    if (i.aclOut) L.push(` ip access-group ${i.aclOut} out`);
    if (i.ipMtu) L.push(` ip mtu ${i.ipMtu}`);
    if (!i.proxyArp) L.push(' no ip proxy-arp');
    if (i.nat) L.push(` ip nat ${i.nat}`);
    const o = i.ospf;
    if (o.netType === 'POINT_TO_POINT') L.push(' ip ospf network point-to-point');
    if (o.netType === 'BROADCAST' && isLoopback(name)) L.push(' ip ospf network broadcast');
    if (o.hello) L.push(` ip ospf hello-interval ${o.hello}`);
    if (o.dead) L.push(` ip ospf dead-interval ${o.dead}`);
    if (o.mtuIgnore) L.push(' ip ospf mtu-ignore');
    if (o.priority !== 1) L.push(` ip ospf priority ${o.priority}`);
    if (o.cost) L.push(` ip ospf cost ${o.cost}`);
    if (o.area) L.push(` ip ospf ${o.area.pid} area ${areaStr(o.area.area, o.area.areaFmt)}`);
    if (i.standbyVersion === 2) L.push(' standby version 2');
    [...i.standby.entries()].sort((a, b) => a[0] - b[0]).forEach(([g, h]) => {
      const gs = g === 0 ? '' : ` ${g}`;
      if (h.ip !== null) L.push(` standby${gs} ip ${ipStr(h.ip)}`);
      if (h.priority !== 100) L.push(` standby${gs} priority ${h.priority}`);
      if (h.preempt) L.push(` standby${gs} preempt`);
    });
  }
  if (i.shutdown) L.push(' shutdown');
  if (i.speed !== 'auto') L.push(` speed ${i.speed}`);
  if (i.duplex !== 'auto') L.push(` duplex ${i.duplex}`);
  if (i.storm) {
    ['broadcast', 'multicast', 'unicast'].forEach((k) => { if (i.storm[k]) L.push(` storm-control ${k} level ${i.storm[k]}`); });
    if (i.storm.action) L.push(` storm-control action ${i.storm.action}`);
  }
  if (i.channel) L.push(` channel-group ${i.channel.group} mode ${i.channel.mode}`);
  if (dev.type === 'router' && isPhysical(name)) L.push(i.speed === 'auto' && i.duplex === 'auto' ? ' negotiation auto' : ' no negotiation auto');
  if (!i.cdp) L.push(' no cdp enable');
  if (i.lldpTx === false) L.push(' no lldp transmit');
  if (i.lldpRx === false) L.push(' no lldp receive');
  if (i.stp.portfast) L.push(i.stp.portfast === 'trunk' ? ' spanning-tree portfast trunk' : ' spanning-tree portfast');
  if (i.stp.bpduguard) L.push(' spanning-tree bpduguard enable');
  if (i.stp.guard) L.push(` spanning-tree guard ${i.stp.guard}`);
  if (i.stp.cost) L.push(` spanning-tree cost ${i.stp.cost}`);
  if (i.stp.prio !== 128) L.push(` spanning-tree port-priority ${i.stp.prio}`);
  if (i.daiTrust) L.push(' ip arp inspection trust');
  if (i.snoopTrust) L.push(' ip dhcp snooping trust');
  if (!i.sw) {
    if (i.ipv6LinkLocal) L.push(` ipv6 address ${i.ipv6LinkLocal} link-local`);
    i.ipv6.forEach((a) => L.push(` ipv6 address ${ip6Str(a.addr)}/${a.len}${a.eui ? ' eui-64' : ''}`));
    if (i.ipv6Enable) L.push(' ipv6 enable');
    if (i.ospf6.area) L.push(` ipv6 ospf ${i.ospf6.area.pid} area ${areaStr(i.ospf6.area.area, i.ospf6.area.areaFmt)}`);
    if (i.ospf6.cost) L.push(` ipv6 ospf cost ${i.ospf6.cost}`);
    if (i.ospf6.priority !== 1) L.push(` ipv6 ospf priority ${i.ospf6.priority}`);
  }
  return L;
}

function ospfBlock(p, pid, v6) {
  const L = [v6 ? `ipv6 router ospf ${pid}` : `router ospf ${pid}`];
  if (p.rid !== null) L.push(` router-id ${ipStr(p.rid)}`);
  if (p.refBw !== 100) L.push(` auto-cost reference-bandwidth ${p.refBw}`);
  if (p.maxPaths !== 4) L.push(` maximum-paths ${p.maxPaths}`);
  if (p.passiveDefault) {
    L.push(' passive-interface default');
    [...p.nonPassive].sort(compareIf).forEach((n) => L.push(` no passive-interface ${n}`));
  } else [...p.passive].sort(compareIf).forEach((n) => L.push(` passive-interface ${n}`));
  if (!v6) p.networks.forEach((n) => L.push(` network ${ipStr(n.ip)} ${ipStr(n.wild)} area ${areaStr(n.area, n.areaFmt)}`));
  if (p.defaultInfo) {
    let s = ' default-information originate';
    if (p.defaultInfo.always) s += ' always';
    if (p.defaultInfo.metric !== null && p.defaultInfo.metric !== undefined) s += ` metric ${p.defaultInfo.metric}`;
    if (p.defaultInfo.type === 1) s += ' metric-type 1';
    L.push(s);
  }
  return L;
}

function staticLine(r) {
  let s = `ip route ${ipStr(r.net)} ${ipStr(r.mask)}`;
  if (r.ifName) s += ` ${r.ifName}`;
  if (r.nh !== null) s += ` ${ipStr(r.nh)}`;
  if (r.ad !== 1) s += ` ${r.ad}`;
  if (r.permanent) s += ' permanent';
  if (r.name) s += ` name ${r.name}`;
  return s;
}

export function renderRunning(net, dev, { forStartup = false } = {}) {
  const c = dev.cfg;
  const sw = isSwitch(dev);
  const L = [];
  if (c.lastChange && !forStartup) {
    L.push('!', `! Last configuration change at ${configStamp(new Date(c.lastChange.at))} by ${c.lastChange.by}`);
  }
  if (forStartup && dev.savedAt) L.push('!', `! NVRAM config last updated at ${configStamp(new Date(net.now()))} by console`);
  L.push('!', `version ${dev.hw.version.split('.').slice(0, 2).join('.')}`, 'service timestamps debug datetime msec', 'service timestamps log datetime msec');
  if (c.passwordEncryption) L.push('service password-encryption');
  if (!sw) L.push('platform qfp utilization monitor load 80', 'no platform punt-keepalive disable-kernel-core');
  L.push('!', `hostname ${c.hostname}`, '!', 'boot-start-marker', 'boot-end-marker', '!', '!');
  if (c.enableSecret) L.push(`enable secret ${c.enableSecret.type} ${c.enableSecret.hash}`);
  if (c.enablePassword) L.push(`enable password ${pw(c, c.enablePassword.plain)}`);
  L.push('!', 'no aaa new-model', '!');
  c.nameServers.forEach((n) => L.push(`ip name-server ${ipStr(n)}`));
  if (c.domainName) L.push(`ip domain name ${c.domainName}`);
  if (!c.domainLookup) L.push('no ip domain lookup');
  if (c.dhcpExcluded.length) {
    L.push('!');
    c.dhcpExcluded.forEach((r) => L.push(`ip dhcp excluded-address ${ipStr(r.lo)}${r.single && r.lo === r.hi ? '' : ` ${ipStr(r.hi)}`}`));
  }
  if (c.dhcpRelayTrustAll) L.push('ip dhcp relay information trust-all');
  for (const p of c.dhcpPools.values()) {
    L.push('!', `ip dhcp pool ${p.name}`);
    if (p.network) L.push(p.network.prefix ? ` network ${ipStr(p.network.addr)} /${maskToLen(p.network.mask)}` : ` network ${ipStr(p.network.addr)} ${ipStr(p.network.mask)}`);
    if (p.routers.length) L.push(` default-router ${p.routers.map(ipStr).join(' ')} `);
    if (p.dns.length) L.push(` dns-server ${p.dns.map(ipStr).join(' ')} `);
    if (p.domain) L.push(` domain-name ${p.domain}`);
    if (p.lease) L.push(p.lease.infinite ? ' lease infinite' : ` lease ${p.lease.days}${p.lease.hours || p.lease.mins ? ` ${p.lease.hours}` : ''}${p.lease.mins ? ` ${p.lease.mins}` : ''}`);
  }
  L.push('!', '!', 'login on-success log');
  if (c.ipv6Routing) L.push('ipv6 unicast-routing');
  if (sw) {
    if (c.snooping.vlans.size) L.push(`ip dhcp snooping vlan ${vlanListStr(c.snooping.vlans)}`);
    if (!c.snooping.option82) L.push('no ip dhcp snooping information option');
    if (c.snooping.enabled) L.push('ip dhcp snooping');
    if (c.dai.size) L.push(`ip arp inspection vlan ${vlanListStr(c.dai)}`);
  }
  if (sw && c.ipRouting) L.push('ip routing');
  if (!sw && !c.ipRouting) L.push('no ip routing');
  L.push('!');
  if (c.users.size) {
    [...c.users.values()].forEach((u) => L.push(userLine(c, u)));
    L.push('!');
  }
  L.push('redundancy', ' mode none', '!');
  if (sw) {
    L.push(`spanning-tree mode ${c.stp.mode}`);
    if (c.stp.portfastDefault) L.push('spanning-tree portfast default');
    if (c.stp.bpduguardDefault) L.push('spanning-tree portfast bpduguard default');
    L.push('spanning-tree extend system-id');
    [...c.stp.prio.entries()].sort((a, b) => a[0] - b[0]).forEach(([v, p]) => L.push(`spanning-tree vlan ${v} priority ${p}`));
    L.push('!');
    [...c.vlans.entries()].filter(([v]) => v !== 1).sort((a, b) => a[0] - b[0]).forEach(([v, info]) => {
      L.push(`vlan ${v}`);
      if (info.name !== `VLAN${String(v).padStart(4, '0')}`) L.push(` name ${info.name}`);
      L.push('!');
    });
  }
  L.push('!');
  [...c.interfaces.entries()].sort((a, b) => compareIf(a[0], b[0])).forEach(([n, i]) => {
    L.push(...renderInterface(dev, n, i), '!');
  });
  [...c.ospf.entries()].sort((a, b) => a[0] - b[0]).forEach(([pid, p]) => L.push(...ospfBlock(p, pid, false), '!'));
  [...c.ospf6.entries()].sort((a, b) => a[0] - b[0]).forEach(([pid, p]) => L.push(...ospfBlock(p, pid, true), '!'));
  L.push('ip forward-protocol nd');
  if (c.sshVersion) L.push(`ip ssh version ${c.sshVersion}`);
  for (const p of c.nat.pools.values()) {
    L.push(`ip nat pool ${p.name} ${ipStr(p.start)} ${ipStr(p.end)} ${p.prefix ? `prefix-length ${maskToLen(p.mask)}` : `netmask ${ipStr(p.mask)}`}`);
  }
  c.nat.dynamics.forEach((r) => L.push(`ip nat inside source list ${r.acl} ${r.ifName ? `interface ${r.ifName}` : `pool ${r.pool}`}${r.overload ? ' overload' : ''}`));
  c.nat.statics.forEach((st) => L.push(`ip nat inside source static ${ipStr(st.local)} ${ipStr(st.global)}`));
  c.staticRoutes.forEach((r) => L.push(staticLine(r)));
  if (c.defaultGateway !== null) L.push(`ip default-gateway ${ipStr(c.defaultGateway)}`);
  L.push('!');
  [...c.acls.values()].filter((a) => !a.numbered).forEach((acl) => {
    L.push(`ip access-list ${acl.type} ${acl.name}`);
    acl.entries.forEach((e) => L.push(` ${e.seq} ${aceText(acl, e)}`));
    L.push('!');
  });
  c.staticRoutes6.forEach((r) => {
    let s = `ipv6 route ${ip6Str(bigIp6(r.net))}/${r.len}`;
    if (r.ifName) s += ` ${r.ifName}`;
    if (r.nh !== null) s += ` ${ip6Str(bigIp6(r.nh))}`;
    if (r.ad !== 1) s += ` ${r.ad}`;
    L.push(s);
  });
  if (c.staticRoutes6.length) L.push('!');
  c.logHosts.forEach((h) => L.push(`logging host ${ipStr(h)}`));
  [...c.acls.values()].filter((a) => a.numbered).sort((a, b) => Number(a.name) - Number(b.name)).forEach((acl) => {
    acl.entries.forEach((e) => L.push(`access-list ${acl.name} ${aceText(acl, e, { numberedCfg: true })}`));
  });
  L.push('!');
  c.snmp.forEach((s) => L.push(`snmp-server community ${s.name} ${s.rw ? 'RW' : 'RO'}${s.acl ? ` ${s.acl}` : ''}`));
  if (!c.cdp) L.push('no cdp run');
  if (c.lldp) L.push('lldp run');
  L.push('!', 'control-plane', '!');
  if (c.banner !== null) {
    L.push(c.banner.includes('\n') ? `banner motd ^C\n${c.banner}\n^C` : `banner motd ^C${c.banner}^C`);
  }
  L.push(...lineBlock(c, 'con', 'line con 0', !sw));
  if (!sw) L.push('line aux 0', ' stopbits 1');
  L.push(...lineBlock(c, 'vty', 'line vty 0 4', false));
  if (sw) L.push(...lineBlock(c, 'vty', 'line vty 5 15', false));
  L.push('!');
  c.ntp.forEach((n) => L.push(`ntp server ${ipStr(n.ip)}${n.prefer ? ' prefer' : ''}`));
  if (c.ntp.length) L.push('!');
  L.push('!', '!', 'end');
  const body = L.join('\n');
  if (forStartup) return body;
  return `Building configuration...\n\nCurrent configuration : ${body.length + 1} bytes\n${body}\n`;
}

function lineBlock(c, key, header, stopbits) {
  const ln = c.lines[key];
  const L = [header];
  if (ln.accessClass) L.push(` access-class ${ln.accessClass} in`);
  if (ln.execTimeout) L.push(` exec-timeout ${ln.execTimeout[0]} ${ln.execTimeout[1]}`);
  if (ln.password) L.push(` password ${pw(c, ln.password.plain)}`);
  if (ln.loggingSync) L.push(' logging synchronous');
  if (ln.loginLocal) L.push(' login local');
  else if (ln.login) L.push(' login');
  if (key === 'vty' && ln.transport) L.push(` transport input ${ln.transport}`);
  if (stopbits) L.push(' stopbits 1');
  return L;
}

export { isSubif, isSvi };
