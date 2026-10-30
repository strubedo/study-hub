// DHCPv4: IOS server (pools, excluded ranges, bindings), relay via
// ip helper-address, and the client used by PCs and `ip address dhcp`.

import { isHost } from './device.js';
import { netOf, ipStr, BROADCAST_MAC } from './util.js';
import { originate } from './packets.js';
import { l3Transmit } from './frames.js';

const BCAST = 0xffffffff;

function inUseElsewhere(net, ip, mac) {
  for (const dev of net.devices.values()) {
    if (isHost(dev)) {
      if (dev.nic.ip === ip && !dev.nic.dhcp && dev.mac !== mac) return true;
      continue;
    }
    for (const i of dev.cfg.interfaces.values()) {
      if (i.ip && i.ip.addr === ip) return true;
      for (const g of i.standby.values()) if (g.ip === ip) return true;
    }
  }
  return false;
}

function excluded(dev, ip) {
  return dev.cfg.dhcpExcluded.some((r) => ip >= r.lo && ip <= r.hi);
}

function leaseMs(pool) {
  const l = pool.lease || { days: 1, hours: 0, mins: 0 };
  return ((l.days * 24 + l.hours) * 60 + l.mins) * 60000;
}

function allocate(net, dev, pool, mac) {
  const existing = [...dev.st.dhcpBindings.values()].find((b) => b.mac === mac && b.pool === pool.name);
  if (existing) return existing.ip;
  const { addr, mask } = pool.network;
  const first = netOf(addr, mask) + 1;
  const last = (netOf(addr, mask) | (~mask >>> 0)) >>> 0;
  for (let ip = first; ip < last; ip += 1) {
    if (excluded(dev, ip) || dev.st.dhcpBindings.has(ip)) continue;
    if (inUseElsewhere(net, ip, mac)) {
      dev.st.dhcpConflicts = [...(dev.st.dhcpConflicts || []), ip];
      dev.st.dhcpBindings.set(ip, { ip, mac: null, conflict: true, pool: pool.name });
      continue;
    }
    return ip;
  }
  return null;
}

function poolFor(dev, ip) {
  for (const pool of dev.cfg.dhcpPools.values()) {
    if (pool.network && netOf(ip, pool.network.mask) === netOf(pool.network.addr, pool.network.mask)) return pool;
  }
  return null;
}

function buildAck(net, dev, pool, req, serverIp) {
  const ip = allocate(net, dev, pool, req.chaddr);
  if (ip === null) return null;
  const expires = net.now() + leaseMs(pool);
  dev.st.dhcpBindings.set(ip, { ip, mac: req.chaddr, expires, pool: pool.name });
  return {
    op: 'ack', xid: req.xid, chaddr: req.chaddr, yiaddr: ip, mask: pool.network.mask,
    router: pool.routers[0] ?? null, dns: pool.dns, domain: pool.domain, lease: leaseMs(pool), server: serverIp,
  };
}

/** Handle a DHCP packet delivered to device `dev` on `ifName`. */
export function dhcpServe(net, dev, ifName, pkt) {
  const d = pkt.dhcp;
  if (!d) return;
  if (isHost(dev)) {
    if (d.op === 'ack' && d.chaddr === dev.mac) net.hostLease(dev, d);
    return;
  }
  const l = ifName ? dev.l3.get(ifName) : null;
  if (d.op === 'discover') {
    // IOS relay agents and DHCP servers drop requests carrying option 82 with a
    // zero giaddr (inserted by a snooping switch) unless the interface is trusted.
    if (d.opt82 && !d.giaddr && !dev.cfg.dhcpRelayTrustAll && !(l && l.cfg.dhcpRelayTrusted)) return;
    if (pkt.dst === BCAST && l && l.cfg.helpers.length && !d.giaddr) {
      l.cfg.helpers.forEach((h) => originate(net, dev, {
        src: l.ip, dst: h, proto: 'udp', sport: 67, dport: 67, dhcp: { ...d, giaddr: l.ip },
      }));
      return;
    }
    if (dev.cfg.dhcpDisabled) return;
    const anchor = d.giaddr ?? (l ? l.ip : null);
    if (anchor === null || anchor === undefined) return;
    const pool = poolFor(dev, anchor);
    if (!pool) return;
    const ack = buildAck(net, dev, pool, d, d.giaddr ? pkt.dst : l.ip);
    if (!ack) return;
    if (d.giaddr) {
      originate(net, dev, { src: pkt.dst, dst: d.giaddr, proto: 'udp', sport: 67, dport: 67, dhcp: ack }, { wait: true });
    } else {
      dev.st.dhcpBindings.get(ack.yiaddr).ifName = ifName;
      l3Transmit(net, dev, ifName, { src: l.mac, dst: BROADCAST_MAC, type: 'ip', ip: { src: l.ip, dst: BCAST, ttl: 255, proto: 'udp', sport: 67, dport: 68, dhcp: ack } });
    }
    return;
  }
  if (d.op === 'ack') {
    // relay agent receiving the server reply: broadcast it on the giaddr interface
    const out = [...dev.l3.values()].find((x) => x.ip === pkt.dst && x.up);
    if (out && pkt.dst !== BCAST) {
      l3Transmit(net, dev, out.name, { src: out.mac, dst: BROADCAST_MAC, type: 'ip', ip: { src: out.ip, dst: BCAST, ttl: 255, proto: 'udp', sport: 67, dport: 68, dhcp: d } });
      return;
    }
    if (dev.cfg.interfaces.get(ifName)?.dhcpClient && d.chaddr === dev.l3.get(ifName).mac) net.ifLease(dev, ifName, d);
  }
}

/** Run a DHCP exchange for a host; returns the ack or null. */
export function dhcpClient(net, dev, ifName = 'eth0') {
  const l = dev.l3.get(ifName);
  if (!l || !l.up) return null;
  const xid = Math.floor(net.rand() * 0xffffffff);
  const mac = l.mac;
  dev.dhcpXid = xid;
  net.pendingDhcp = null;
  l3Transmit(net, dev, ifName, {
    src: mac, dst: BROADCAST_MAC, type: 'ip',
    ip: { src: 0, dst: BCAST, ttl: 128, proto: 'udp', sport: 68, dport: 67, dhcp: { op: 'discover', xid, chaddr: mac } },
  });
  return net.lastLeaseFor(mac);
}

export function showDhcpBinding(net, dev) {
  const lines = [
    'Bindings from all pools not associated with VRF:',
    'IP address      Client-ID/              Lease expiration        Type       State      Interface',
    '                Hardware address/',
    '                User name',
  ];
  const fmtCid = (mac) => {
    const hex = `01${mac.replace(/\./g, '')}`;
    return hex.match(/.{1,4}/g).join('.');
  };
  [...dev.st.dhcpBindings.values()].filter((b) => !b.conflict).sort((a, b) => a.ip - b.ip).forEach((b) => {
    const d = new Date(b.expires);
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()];
    let h = d.getUTCHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    const exp = `${mon} ${String(d.getUTCDate()).padStart(2, '0')} ${d.getUTCFullYear()} ${String(h).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} ${ap}`;
    const ifn = b.ifName ? b.ifName : 'Unknown';
    lines.push(`${ipStr(b.ip).padEnd(16)}${fmtCid(b.mac).padEnd(24)}${exp.padEnd(24)}Automatic  Active     ${ifn}`);
  });
  return lines.join('\n');
}
