// show version / clock / logging / users / ip ssh / crypto key / access-lists /
// ip nat statistics / ip dhcp pool.

import { clockStr, ipStr, hashStr, maskToLen, netOf } from '../util.js';
import { showAcl } from '../acl.js';
import { isSwitch } from '../device.js';

function uptime(ms) {
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const parts = [];
  if (d) parts.push(`${d} day${d > 1 ? 's' : ''}`);
  if (h % 24) parts.push(`${h % 24} hour${h % 24 > 1 ? 's' : ''}`);
  parts.push(`${m % 60} minute${m % 60 === 1 ? '' : 's'}`);
  return parts.join(', ');
}

export function showVersion(net, dev) {
  const up = uptime(net.now() - net.base + 754000 + (dev.bootOffset || 0));
  const sw = isSwitch(dev);
  const serial = `FDO${2100 + (hashStr(dev.name) % 400)}${String.fromCharCode(65 + (hashStr(dev.name) % 26))}0${(hashStr(dev.name) % 90) + 10}`;
  const L = [
    `Cisco IOS XE Software, Version 17.09.04a`,
    `Cisco IOS Software [Cupertino], ${sw ? 'Catalyst L3 Switch Software (CAT9K_IOSXE)' : 'ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M)'}, Version 17.9.4a, RELEASE SOFTWARE (fc3)`,
    'Technical Support: http://www.cisco.com/techsupport', 'Copyright (c) 1986-2023 by Cisco Systems, Inc.', 'Compiled Fri 20-Oct-23 10:44 by mcpre', '', '',
    'Cisco IOS-XE software, Copyright (c) 2005-2023 by cisco Systems, Inc.', 'All rights reserved.  Certain components of Cisco IOS-XE software are',
    'licensed under the GNU General Public License ("GPL") Version 2.0.  The', 'software code licensed under GPL Version 2.0 is free software that comes',
    'with ABSOLUTELY NO WARRANTY.  You can redistribute and/or modify such', 'GPL code under the terms of GPL Version 2.0.  For more details, see the',
    'documentation or "License Notice" file accompanying the IOS-XE software,', 'or the applicable URL provided on the flyer accompanying the IOS-XE', 'software.', '', '',
    `ROM: ${sw ? 'IOS-XE ROMMON' : '16.12(2r)'}`, `BOOTLDR: ${sw ? 'System Bootstrap, Version 17.9.1r, RELEASE SOFTWARE (P)' : ''}`.trimEnd(), '',
    `${dev.cfg.hostname} uptime is ${up}`, `Uptime for this control processor is ${up}`, 'System returned to ROM by Reload Command',
    `System image file is "${sw ? 'flash:packages.conf' : 'bootflash:isr4300-universalk9.17.09.04a.SPA.bin'}"`, 'Last reload reason: Reload Command', '', '',
    'This product contains cryptographic features and is subject to United', 'States and local country laws governing import, export, transfer and',
    'use. Delivery of Cisco cryptographic products does not imply', 'third-party authority to import, export, distribute or use encryption.', '', '',
    sw ? `Technology Package License Information: \n\n------------------------------------------------------------------------------\nTechnology-package                                     Technology-package\nCurrent                        Type                       Next reboot  \n------------------------------------------------------------------------------\nnetwork-advantage      \tSmart License                 \tnetwork-advantage   \ndna-advantage          \tSubscription Smart License    \tdna-advantage                 \n`
      : 'Technology Package License Information:\n\n-----------------------------------------------------------------\nTechnology    Type             Technology-package Technology-package\n                               Current            Next Reboot\n-----------------------------------------------------------------\nSmart License Perpetual        appxk9             appxk9\nSmart License Subscription     None               None\nSmart License Perpetual        securityk9         securityk9\nSmart License Perpetual        ipbase             ipbasek9\n',
    `cisco ${dev.hw.model} (${sw ? 'X86' : '1RU'}) processor with ${sw ? '1338934K/6147K' : '1795999K/6147K'} bytes of memory.`, `Processor board ID ${serial}`,
    sw ? `${dev.hw.ports.length} Gigabit Ethernet interfaces` : `Router operating mode: Autonomous\n${dev.hw.ports.length} Gigabit Ethernet interfaces`,
    '32768K bytes of non-volatile configuration memory.', `${sw ? '8388608K' : '4194304K'} bytes of physical memory.`, `${sw ? '1638400K bytes of Crash Files at crashinfo:.\n11264000K bytes of Flash at flash:.' : '3207167K bytes of flash memory at bootflash:.'}`, '',
  ];
  if (sw) {
    L.push(`Base Ethernet MAC Address          : ${dev.baseMac.replace(/\./g, '').replace(/(..)(?!$)/g, '$1:')}`, `Model Number                       : ${dev.hw.model}`, `System Serial Number               : ${serial}`, '', '',
      'Switch Ports Model              SW Version        SW Image              Mode   ', '------ ----- -----              ----------        ----------            ----   ',
      `*    1 ${String(dev.hw.ports.length).padEnd(5)} ${dev.hw.model.padEnd(18)} 17.09.04a         CAT9K_IOSXE           INSTALL`, '', '', 'Configuration register is 0x102');
  } else L.push('Configuration register is 0x2102');
  return L.join('\n');
}

export function showClock(net) { return clockStr(new Date(net.now())); }

export function showLogging(net, dev) {
  const L = ['Syslog logging: enabled (0 messages dropped, 0 messages rate-limited, 0 flushes, 0 overruns, xml disabled, filtering disabled)', '',
    'No Active Message Discriminator.', '', '', 'No Inactive Message Discriminator.', '', '',
    '    Console logging: level debugging, ' + `${dev.st.logs.length} messages logged, xml disabled,`, '                     filtering disabled',
    '    Monitor logging: level debugging, 0 messages logged, xml disabled,', '                     filtering disabled',
    `    Buffer logging:  level debugging, ${dev.st.logs.length} messages logged, xml disabled,`, '                    filtering disabled',
    '    Exception Logging: size (4096 bytes)', '    Count and timestamp logging messages: disabled', '    Persistent logging: disabled', '',
    'No active filter modules.', '', '    Trap logging: level informational, ' + `${dev.st.logs.length} message lines logged`];
  dev.cfg.logHosts.forEach((h) => L.push(`        Logging to ${ipStr(h)}  (udp port 514, audit disabled,`, '              link up),', `              ${dev.st.logs.length} message lines logged, `, '              0 message lines rate-limited, ', '              0 message lines dropped-by-MD, ', '              xml disabled, sequence number disabled', '              filtering disabled'));
  L.push('', `Log Buffer (102400 bytes):`, '', ...dev.st.logs);
  return L.join('\n');
}

export function showUsers(net, dev) {
  return `    Line       User       Host(s)              Idle       Location\n*  0 con 0                idle                 00:00:00   \n\n  Interface    User               Mode         Idle     Peer Address`;
}

export function showIpSsh(net, dev) {
  const c = dev.cfg;
  if (!c.rsa) return 'SSH Disabled - version 1.99\n%Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2).\nAuthentication methods:publickey,keyboard-interactive,password\nAuthentication timeout: 120 secs; Authentication retries: 3\nMinimum expected Diffie Hellman key size : 2048 bits\nIOS Keys in SECSH format(ssh-rsa, base64 encoded): NONE';
  const v = c.sshVersion === 2 ? '2.0' : c.sshVersion === 1 ? '1.5' : '1.99';
  return `SSH Enabled - version ${v}\nAuthentication methods:publickey,keyboard-interactive,password\nAuthentication Publickey Algorithms:rsa-sha2-256,rsa-sha2-512\nHostkey Algorithms:rsa-sha2-256,rsa-sha2-512\nEncryption Algorithms:aes128-gcm,aes256-gcm,aes128-ctr,aes192-ctr,aes256-ctr\nMAC Algorithms:hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,hmac-sha2-256,hmac-sha2-512\nKEX Algorithms:ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha256,diffie-hellman-group16-sha512\nAuthentication timeout: 120 secs; Authentication retries: 3\nMinimum expected Diffie Hellman key size : 2048 bits\nIOS Keys in SECSH format(ssh-rsa, base64 encoded): ${c.rsa.name}\nssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC${btoa16(c.rsa.name)}...`;
}

function btoa16(s) { return Array.from({ length: 40 }, (_, i) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[(hashStr(s + i)) % 64]).join(''); }

export function showCryptoKey(net, dev) {
  if (!dev.cfg.rsa) return '% Key name: none\n% No Signature RSA Keys found in configuration.';
  return `% Key pair was generated at: ${clockStr(new Date(net.now())).slice(1)}\nKey name: ${dev.cfg.rsa.name}\nKey type: RSA KEYS\n Storage Device: private-config\n Usage: General Purpose Key\n Key is not exportable. Redundancy enabled.\n Key Data:\n  30820122 300D0609 2A864886 F70D0101 01050003 82010F00 3082010A 02820101\n  00${btoa16(dev.name).slice(0, 30).toUpperCase()}`;
}

export function showAccessLists(net, dev, name) {
  const acls = [...dev.cfg.acls.values()].filter((a) => !name || a.name === name);
  const numbered = acls.filter((a) => a.numbered).sort((a, b) => Number(a.name) - Number(b.name));
  const named = acls.filter((a) => !a.numbered).sort((a, b) => a.name.localeCompare(b.name));
  return [...numbered, ...named].map((a) => showAcl(dev, a)).join('\n');
}

export function showNatStats(net, dev) {
  const tr = dev.st.nat;
  const inside = [...dev.cfg.interfaces.entries()].filter(([, i]) => i.nat === 'inside').map(([n]) => n);
  const outside = [...dev.cfg.interfaces.entries()].filter(([, i]) => i.nat === 'outside').map(([n]) => n);
  const L = [`Total active translations: ${tr.length + dev.cfg.nat.statics.filter((s) => !tr.some((e) => e.static && e.il === s.local)).length} (${dev.cfg.nat.statics.length} static, ${tr.filter((e) => !e.static).length} dynamic; ${tr.filter((e) => e.proto).length} extended)`,
    'Outside interfaces:', `  ${outside.join(', ')}`, 'Inside interfaces: ', `  ${inside.join(', ')}`,
    `Hits: ${tr.length * 5}  Misses: ${dev.st.natMisses || 0}`, 'Expired translations: 0', 'Dynamic mappings:'];
  dev.cfg.nat.dynamics.forEach((r) => {
    L.push('-- Inside Source', `[Id: 1] access-list ${r.acl} ${r.ifName ? `interface ${r.ifName}` : `pool ${r.pool}`} refcount ${tr.filter((e) => !e.static).length}`);
    if (r.pool) {
      const p = dev.cfg.nat.pools.get(r.pool);
      if (p) {
        const total = p.end - p.start + 1;
        const used = new Set(tr.filter((e) => !e.static).map((e) => e.ig)).size;
        L.push(` pool ${p.name}: id 1, netmask ${ipStr(p.mask)}`, `\tstart ${ipStr(p.start)} end ${ipStr(p.end)}`, `\ttype generic, total addresses ${total}, allocated ${used} (${Math.floor((used * 100) / total)}%), misses ${dev.st.natMisses || 0}`);
      }
    }
  });
  L.push('nat-limit statistics:', ' max entry: max allowed 0, used 0, missed 0', 'In-to-out drops: 0  Out-to-in drops: 0', 'Pool stats drop: 0  Mapping stats drop: 0', 'Port block alloc fail: 0', 'IP alias add fail: 0', 'Limit entry add fail: 0');
  return L.join('\n');
}

export function showDhcpPool(net, dev, only) {
  const out = [];
  for (const p of dev.cfg.dhcpPools.values()) {
    if (only && p.name !== only) continue;
    if (!p.network) { out.push(`\nPool ${p.name} :\n Utilization mark (high/low)    : 100 / 0\n Subnet size (first/next)       : 0 / 0 \n Total addresses                : 0\n Leased addresses               : 0\n Excluded addresses             : 0\n Pending event                  : none\n 0 subnet is currently in the pool :`); continue; }
    const len = maskToLen(p.network.mask);
    const total = 2 ** (32 - len) - 2;
    const leased = [...dev.st.dhcpBindings.values()].filter((b) => b.pool === p.name && !b.conflict).length;
    const first = netOf(p.network.addr, p.network.mask) + 1;
    const last = first + total - 1;
    const excluded = dev.cfg.dhcpExcluded.reduce((sum, r) => sum + Math.max(0, Math.min(r.hi, last) - Math.max(r.lo, first) + 1), 0);
    out.push(`\nPool ${p.name} :\n Utilization mark (high/low)    : 100 / 0\n Subnet size (first/next)       : 0 / 0 \n Total addresses                : ${total}\n Leased addresses               : ${leased}\n Excluded addresses             : ${excluded}\n Pending event                  : none\n 1 subnet is currently in the pool :\n Current index        IP address range                    Leased/Excluded/Total\n ${ipStr(first).padEnd(20)} ${ipStr(first)}     - ${ipStr(last).padEnd(16)}  ${leased} / ${excluded} / ${total}`);
  }
  return out.join('\n');
}
