// `show` command grammar and dispatch.

import { renderRunning, renderInterface } from '../render-config.js';
import { showIpIntBrief, showIpInterface, showInterfaces, showIntStatus, showIntTrunk, showIntSwitchport, showIntDescription } from '../show/ifaces.js';
import { showVlan, showMac, showStp, showStpSummary, showEtherchannelSummary, showPortSecurity, showCdpNeighbors, showCdp, showLldpNeighbors, showDhcpSnooping, showSnoopBinding, showArpInspection } from '../show/l2.js';
import { showIpRoute, showOspfNeighbor, showOspf6Neighbor, showOspfIfBrief, showOspfIf, showOspfProcess, showIpProtocols, showArp, showStandbyBrief, showStandby, showIpv6IfBrief, showIpv6Route } from '../show/l3.js';
import { showVersion, showClock, showLogging, showIpSsh, showUsers, showCryptoKey, showNatStats, showDhcpPool, showAccessLists } from '../show/sys.js';
import { showNatTranslations } from '../nat.js';
import { showDhcpBinding } from '../dhcp.js';

const BOTH = ['user', 'exec'];
const conv = (fn) => (s, a) => { s.net.converge(); return fn(s, a); };

export function registerShow(def) {
  const sh = (modes, p, fn, opts) => def(modes, `show ${p}`, conv(fn), opts);
  sh('exec', 'running-config', (s) => renderRunning(s.net, s.dev));
  sh('exec', 'running-config interface IFACE', (s, a) => {
    const lines = renderInterface(s.dev, a.iface, s.cfg.interfaces.get(a.iface));
    const body = `${lines.join('\n')}\nend\n`;
    return `Building configuration...\n\nCurrent configuration : ${body.length} bytes\n!\n${body}`;
  });
  sh('exec', 'startup-config', (s) => (s.dev.startup ? `Using ${s.dev.startup.length} out of 33554432 bytes\n${s.dev.startup}\n` : 'startup-config is not present'));
  sh(BOTH, 'version', (s) => showVersion(s.net, s.dev));
  sh(BOTH, 'clock', (s) => showClock(s.net));
  sh(BOTH, 'history', (s) => s.history.slice(-10).map((h) => `  ${h}`).join('\n'));
  sh('exec', 'logging', (s) => showLogging(s.net, s.dev));
  sh(BOTH, 'users', (s) => showUsers(s.net, s.dev));
  sh(BOTH, 'ip ssh', (s) => showIpSsh(s.net, s.dev));
  sh('exec', 'crypto key mypubkey rsa', (s) => showCryptoKey(s.net, s.dev));

  sh(BOTH, 'ip interface brief', (s) => showIpIntBrief(s.net, s.dev));
  sh(BOTH, 'ip interface [IFACE]', (s, a) => showIpInterface(s.net, s.dev, a.iface));
  sh(BOTH, 'interfaces [IFACE]', (s, a) => showInterfaces(s.net, s.dev, a.iface));
  sh(BOTH, 'interfaces description', (s) => showIntDescription(s.net, s.dev));
  sh(BOTH, 'interfaces status [err-disabled]', (s, a) => showIntStatus(s.net, s.dev, a['err-disabled']), { only: 'switch' });
  sh(BOTH, 'interfaces trunk', (s) => showIntTrunk(s.net, s.dev), { only: 'switch' });
  sh(BOTH, 'interfaces [IFACE] switchport', (s, a) => showIntSwitchport(s.net, s.dev, a.iface), { only: 'switch' });

  sh(BOTH, 'vlan [brief]', (s, a) => showVlan(s.net, s.dev, { brief: !!a.brief }), { only: 'switch' });
  sh(BOTH, 'vlan id vid:<1-4094>{VLAN id}', (s, a) => showVlan(s.net, s.dev, { brief: true, id: Number(a.vid) }), { only: 'switch' });
  sh(BOTH, 'mac address-table [dynamic] [(vlan vid:<1-4094> | interface IFACE)]', (s, a) => showMac(s.net, s.dev, { dynamic: !!a.dynamic, vlan: a.vid ? Number(a.vid) : null, iface: a.iface }), { only: 'switch' });
  sh(BOTH, 'spanning-tree [vlan vid:<1-4094>{VLAN Switch Spanning Trees}]', (s, a) => showStp(s.net, s.dev, a.vid ? Number(a.vid) : undefined), { only: 'switch' });
  sh(BOTH, 'spanning-tree summary', (s) => showStpSummary(s.net, s.dev), { only: 'switch' });
  sh(BOTH, 'etherchannel summary', (s) => showEtherchannelSummary(s.net, s.dev), { only: 'switch' });
  sh(BOTH, 'port-security [interface IFACE]', (s, a) => showPortSecurity(s.net, s.dev, a.iface), { only: 'switch' });
  sh(BOTH, 'ip dhcp snooping', (s) => showDhcpSnooping(s.net, s.dev), { only: 'switch' });
  sh(BOTH, 'ip dhcp snooping binding', (s) => showSnoopBinding(s.net, s.dev), { only: 'switch' });
  sh(BOTH, 'ip arp inspection [vlan vid:<1-4094>]', (s, a) => showArpInspection(s.net, s.dev, a.vid ? Number(a.vid) : undefined), { only: 'switch' });

  sh(BOTH, 'cdp', (s) => showCdp(s.net, s.dev));
  sh(BOTH, 'cdp neighbors [detail]', (s, a) => showCdpNeighbors(s.net, s.dev, !!a.detail));
  sh(BOTH, 'lldp neighbors [detail]', (s, a) => showLldpNeighbors(s.net, s.dev, !!a.detail));

  sh(BOTH, 'ip route [(connected | static | ospf{Open Shortest Path First (OSPF)} | addr:A.B.C.D{Network to display information about or hostname})]', (s, a) => showIpRoute(s.net, s.dev, a.connected || a.static || a.ospf || a.addr ? a : null));
  sh(BOTH, 'ip ospf', (s) => showOspfProcess(s.net, s.dev));
  sh(BOTH, 'ip ospf neighbor [detail]', (s) => showOspfNeighbor(s.net, s.dev));
  sh(BOTH, 'ip ospf interface brief', (s) => showOspfIfBrief(s.net, s.dev, 4));
  sh(BOTH, 'ip ospf interface [IFACE]', (s, a) => showOspfIf(s.net, s.dev, a.iface));
  sh(BOTH, 'ip protocols', (s) => showIpProtocols(s.net, s.dev));
  sh(BOTH, '(arp{ARP table} | ip arp{IP ARP table})', (s) => showArp(s.net, s.dev));
  sh(BOTH, 'standby [brief]', (s, a) => (a.brief ? showStandbyBrief(s.net, s.dev) : showStandby(s.net, s.dev)));
  sh(BOTH, '(access-lists | ip access-lists) [acl:WORD{ACL name or number}]', (s, a) => showAccessLists(s.net, s.dev, a.acl));
  sh(BOTH, 'ip nat translations [verbose]', (s) => showNatTranslations(s.dev), { only: 'router' });
  sh(BOTH, 'ip nat statistics', (s) => showNatStats(s.net, s.dev), { only: 'router' });
  sh(BOTH, 'ip dhcp binding', (s) => showDhcpBinding(s.net, s.dev));
  sh(BOTH, 'ip dhcp pool [pname:WORD{Pool name}]', (s, a) => showDhcpPool(s.net, s.dev, a.pname));
  sh(BOTH, 'ip dhcp conflict', (s) => `IP address        Detection method   Detection time          VRF\n${(s.dev.st.dhcpConflicts || []).map((ip) => `${[24, 16, 8, 0].map((x) => (ip >>> x) & 255).join('.').padEnd(17)} Ping               ${new Date(s.net.now()).toUTCString().slice(5, 25)}`).join('\n')}`);

  sh(BOTH, 'ipv6 interface brief', (s) => showIpv6IfBrief(s.net, s.dev));
  sh(BOTH, 'ipv6 route [(connected | static | ospf)]', (s, a) => showIpv6Route(s.net, s.dev, a.connected || a.static || a.ospf ? a : null));
  sh(BOTH, 'ipv6 ospf neighbor', (s) => showOspf6Neighbor(s.net, s.dev));
  sh(BOTH, 'ipv6 ospf interface brief', (s) => showOspfIfBrief(s.net, s.dev, 6));

  // Real IOS commands this simulator does not model. Answer clearly instead of
  // "% Invalid input", which would wrongly suggest the command doesn't exist.
  const notSimulated = (cmd, alt) => () => `% "${cmd}" is a real IOS command, but this lab simulator doesn't implement it.${alt ? `\n% Try: ${alt}` : ''}`;
  sh(BOTH, 'ip ospf database', notSimulated('show ip ospf database', 'show ip ospf neighbor, show ip route ospf'));
  sh(BOTH, 'ipv6 interface [IFACE]', notSimulated('show ipv6 interface', 'show ipv6 interface brief'));
  sh(BOTH, 'ipv6 neighbors', notSimulated('show ipv6 neighbors', 'show ipv6 interface brief, ping'));
  sh(BOTH, 'vlans', notSimulated('show vlans', 'show vlan brief, show interfaces trunk'));
  sh(BOTH, 'etherchannel port-channel', notSimulated('show etherchannel port-channel', 'show etherchannel summary'), { only: 'switch' });
  sh(BOTH, 'lacp neighbor', notSimulated('show lacp neighbor', 'show etherchannel summary'), { only: 'switch' });
  sh(BOTH, 'dtp [interface IFACE]', notSimulated('show dtp', 'show interfaces switchport'), { only: 'switch' });
  sh(BOTH, 'spanning-tree interface IFACE', notSimulated('show spanning-tree interface', 'show spanning-tree vlan <id>'), { only: 'switch' });
  sh(BOTH, 'interfaces counters [errors]', notSimulated('show interfaces counters', 'show interfaces <iface>'));
  sh(BOTH, 'port-security address', notSimulated('show port-security address', 'show port-security interface <iface>'), { only: 'switch' });
  sh(BOTH, 'ip dhcp server statistics', notSimulated('show ip dhcp server statistics', 'show ip dhcp binding, show ip dhcp pool'));
}
