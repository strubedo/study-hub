// Device model: default configuration objects for routers, switches and hosts.
// The `cfg` object is the running configuration; `st` holds dynamic state
// (ARP, MAC table, NAT translations, DHCP bindings, counters, logs).

import { hashStr, macFromBytes, macAdd } from './util.js';

export const MODELS = {
  router: {
    model: 'ISR4331/K9', platform: 'ISR4331', cdpPlatform: 'cisco ISR4331', hw: 'ISR4331-3x1GE',
    ports: ['GigabitEthernet0/0/0', 'GigabitEthernet0/0/1', 'GigabitEthernet0/0/2'],
    oui: [0x00, 0xa3, 0xd1], version: '17.9.4a', image: 'ISR4300 Software (X86_64_LINUX_IOSD-UNIVERSALK9-M)',
  },
  switch: {
    model: 'C9300-24T', platform: 'C9300-24T', cdpPlatform: 'cisco C9300-24T', hw: 'Gigabit Ethernet',
    ports: Array.from({ length: 24 }, (_, i) => `GigabitEthernet1/0/${i + 1}`),
    oui: [0x70, 0x1f, 0x53], version: '17.9.4a', image: 'Cat9k Software (CAT9K_IOSXE)',
  },
};
MODELS.l3switch = MODELS.switch;

export function isIos(dev) { return dev.type === 'router' || dev.type === 'switch' || dev.type === 'l3switch'; }
export function isSwitch(dev) { return dev.type === 'switch' || dev.type === 'l3switch'; }
export function isHost(dev) { return dev.type === 'pc' || dev.type === 'server'; }

function baseMac(name, oui) {
  const h = hashStr(`mac:${name}`);
  return macFromBytes([...oui, (h >>> 16) & 255, (h >>> 8) & 255, h & 0xf0]);
}

export function newInterface(name, dev) {
  const sw = isSwitch(dev);
  const phys = /^(Gigabit|Fast|TenGigabit)Ethernet\d/.test(name) && !name.includes('.');
  return {
    name,
    description: null,
    shutdown: dev.type === 'router' ? phys : name === 'Vlan1',
    ip: null,
    secondary: [],
    dhcpClient: false,
    noIpAddress: true,
    ipv6: [],
    ipv6LinkLocal: null,
    ipv6Enable: false,
    speed: 'auto',
    duplex: 'auto',
    mtu: 1500,
    ipMtu: null,
    bandwidth: null,
    sw: sw && phys ? newSwitchport() : null,
    channel: null,
    stp: { portfast: false, bpduguard: false, guard: null, cost: null, prio: 128 },
    psec: null,
    storm: null,
    helpers: [],
    nat: null,
    aclIn: null,
    aclOut: null,
    encap: null,
    standby: new Map(),
    standbyVersion: 1,
    ospf: { cost: null, priority: 1, netType: null, hello: null, dead: null, area: null, mtuIgnore: false },
    ospf6: { area: null, cost: null, priority: 1 },
    snoopTrust: false,
    daiTrust: false,
    proxyArp: true,
    cdp: true,
  };
}

export function newSwitchport() {
  return { mode: 'dynamic auto', access: 1, voice: null, allowed: null, native: 1, nonegotiate: false };
}

function newIosConfig(dev) {
  const isSw = isSwitch(dev);
  return {
    hostname: dev.name,
    enableSecret: null,
    enablePassword: null,
    users: new Map(),
    passwordEncryption: false,
    banner: null,
    domainName: null,
    domainLookup: true,
    nameServers: [],
    rsa: null,
    sshVersion: null,
    defaultGateway: null,
    lines: {
      con: { password: null, login: false, loginLocal: false, execTimeout: null, loggingSync: false },
      vty: { password: null, login: true, loginLocal: false, transport: null, execTimeout: null, accessClass: null, loggingSync: false },
    },
    interfaces: new Map(),
    vlans: isSw ? new Map([[1, { name: 'default' }]]) : new Map(),
    ipRouting: !isSw,
    ipv6Routing: false,
    staticRoutes: [],
    staticRoutes6: [],
    ospf: new Map(),
    ospf6: new Map(),
    acls: new Map(),
    nat: { statics: [], dynamics: [], pools: new Map() },
    dhcpExcluded: [],
    dhcpPools: new Map(),
    snooping: { enabled: false, vlans: new Set(), option82: true },
    dai: new Set(),
    stp: { mode: 'rapid-pvst', prio: new Map(), portfastDefault: false, bpduguardDefault: false },
    cdp: true,
    lldp: false,
    ntp: [],
    logHosts: [],
    snmp: [],
    lastChange: null,
  };
}

export function createDevice(def) {
  const type = def.type;
  const dev = { name: def.name, type, def };
  if (isHost(dev)) {
    const h = hashStr(`mac:${def.name}`);
    dev.mac = def.mac || macFromBytes([0x00, 0x50, 0x79, (h >>> 16) & 255, (h >>> 8) & 255, h & 255]);
    dev.nic = {
      name: 'eth0', ip: null, mask: null, gw: null, dhcp: false, dns: [], lease: null,
      ipv6: [], gw6: null, auto6: false, apipa: false,
    };
    dev.services = new Set(def.services || (type === 'server' ? [80, 443, 53] : []));
    dev.st = { arp: new Map(), nd: new Map(), logs: [] };
    return dev;
  }
  const hw = MODELS[type];
  dev.hw = hw;
  dev.baseMac = def.mac || baseMac(def.name, hw.oui);
  dev.cfg = newIosConfig(dev);
  hw.ports.forEach((p) => dev.cfg.interfaces.set(p, newInterface(p, dev)));
  if (isSwitch(dev)) dev.cfg.interfaces.set('Vlan1', newInterface('Vlan1', dev));
  dev.startup = null;
  dev.bootTime = 0;
  dev.st = {
    arp: new Map(), nd: new Map(), mac: new Map(), nat: [], dhcpBindings: new Map(), snoopBindings: new Map(),
    aclHits: new Map(), errDisabled: new Map(), psec: new Map(), logs: [], counters: new Map(),
    ospfRid: null, ospf6Rid: null, unreachAt: -1e9, arpDrops: 0,
  };
  return dev;
}

/** MAC of an interface on an IOS device. */
export function ifMac(dev, name) {
  if (dev.type === 'router') {
    const phys = name.split('.')[0];
    const idx = dev.hw.ports.indexOf(phys);
    if (idx >= 0) return macAdd(dev.baseMac, idx);
    return macAdd(dev.baseMac, 0x40);
  }
  if (name.startsWith('Vlan')) return macAdd(dev.baseMac, 0x40 + Number(name.slice(4)) % 0x3f);
  if (name.startsWith('Port-channel')) return macAdd(dev.baseMac, 0x80 + Number(name.slice(12)));
  const idx = dev.hw.ports.indexOf(name);
  if (idx >= 0) return macAdd(dev.baseMac, idx + 1);
  return macAdd(dev.baseMac, 0x3f);
}

export function getIf(dev, name) { return dev.cfg.interfaces.get(name) || null; }

export function ensureIf(dev, name) {
  let i = dev.cfg.interfaces.get(name);
  if (!i) {
    i = newInterface(name, dev);
    if (name.startsWith('Vlan') || name.startsWith('Loopback') || name.includes('.')) i.shutdown = false;
    if (name.startsWith('Port-channel') && isSwitch(dev)) i.sw = newSwitchport();
    dev.cfg.interfaces.set(name, i);
  }
  return i;
}
