// Pure helpers shared by the simulator engine (no DOM). IPv4/IPv6 math,
// MAC formatting, deterministic hashing, Cisco type-7 and fake type-9 hashes,
// and small text-formatting helpers used by show commands.

// ---------- IPv4 ----------
export function parseIp(s) {
  if (typeof s !== 'string' || !/^\d{1,3}(\.\d{1,3}){3}$/.test(s)) return null;
  const p = s.split('.').map(Number);
  if (p.some((n) => n > 255)) return null;
  return ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3];
}

export function ipStr(n) {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
}

export function isValidMask(n) {
  const inv = (~n) >>> 0;
  return ((inv + 1) & inv) === 0;
}

export function maskToLen(n) {
  let c = 0;
  for (let i = 31; i >= 0; i -= 1) { if ((n >>> i) & 1) c += 1; else break; }
  return c;
}

export function lenToMask(len) {
  return len === 0 ? 0 : ((0xffffffff << (32 - len)) >>> 0);
}

export function netOf(ip, mask) { return (ip & mask) >>> 0; }

export function wildcardToMask(w) { return (~w) >>> 0; }

export function inSubnet(ip, net, mask) { return ((ip & mask) >>> 0) === ((net & mask) >>> 0); }

export function broadcastOf(ip, mask) { return ((ip & mask) | (~mask)) >>> 0; }

export function classfulLen(ip) {
  const a = ip >>> 24;
  if (a < 128) return 8;
  if (a < 192) return 16;
  if (a < 224) return 24;
  return 32;
}

export function hex8(n) { return `0x${(n >>> 0).toString(16).toUpperCase().padStart(8, '0')}`; }

// ---------- IPv6 ----------
export function parseIp6(s) {
  if (typeof s !== 'string') return null;
  const str = s.toLowerCase();
  if (!/^[0-9a-f:]+$/.test(str) || str.split('::').length > 2) return null;
  const [head, tail] = str.includes('::') ? str.split('::') : [str, null];
  const hp = head ? head.split(':') : [];
  const tp = tail ? tail.split(':') : [];
  if ([...hp, ...tp].some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  const fill = 8 - hp.length - tp.length;
  if (tail === null ? hp.length !== 8 : fill < 1) return null;
  const groups = [...hp, ...Array(tail === null ? 0 : fill).fill('0'), ...tp].map((g) => parseInt(g, 16));
  return groups;
}

export function ip6Str(groups) {
  // RFC 5952 compression, upper-case like IOS.
  let bestStart = -1; let bestLen = 0;
  for (let i = 0; i < 8;) {
    if (groups[i] !== 0) { i += 1; continue; }
    let j = i;
    while (j < 8 && groups[j] === 0) j += 1;
    if (j - i > bestLen && j - i >= 2) { bestStart = i; bestLen = j - i; }
    i = j;
  }
  const h = groups.map((g) => g.toString(16).toUpperCase());
  if (bestStart < 0) return h.join(':');
  const left = h.slice(0, bestStart).join(':');
  const right = h.slice(bestStart + bestLen).join(':');
  return `${left}::${right}`;
}

export function ip6Net(groups, len) {
  return groups.map((g, i) => {
    const bits = Math.max(0, Math.min(16, len - i * 16));
    const m = bits === 0 ? 0 : (0xffff << (16 - bits)) & 0xffff;
    return g & m;
  });
}

export function ip6Eq(a, b) { return a.every((g, i) => g === b[i]); }

export function ip6InNet(addr, net, len) { return ip6Eq(ip6Net(addr, len), ip6Net(net, len)); }

export function eui64(prefixGroups, mac) {
  const b = macBytes(mac);
  const e = [b[0] ^ 0x02, b[1], b[2], 0xff, 0xfe, b[3], b[4], b[5]];
  return [prefixGroups[0], prefixGroups[1], prefixGroups[2], prefixGroups[3],
    (e[0] << 8) | e[1], (e[2] << 8) | e[3], (e[4] << 8) | e[5], (e[6] << 8) | e[7]];
}

export function linkLocalFor(mac) { return eui64([0xfe80, 0, 0, 0], mac); }

export function isLinkLocal6(g) { return (g[0] & 0xffc0) === 0xfe80; }

export function parsePrefix6(s) {
  const m = /^([0-9a-fA-F:]+)\/(\d{1,3})$/.exec(s || '');
  if (!m) return null;
  const addr = parseIp6(m[1]);
  const len = Number(m[2]);
  if (!addr || len > 128) return null;
  return { addr, len };
}

// ---------- MAC ----------
export function macBytes(mac) {
  const hex = mac.replace(/[^0-9a-f]/gi, '');
  return [0, 2, 4, 6, 8, 10].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

export function macFromBytes(b) {
  const h = b.map((x) => x.toString(16).padStart(2, '0'));
  return `${h[0]}${h[1]}.${h[2]}${h[3]}.${h[4]}${h[5]}`;
}

export function macAdd(mac, n) {
  const b = macBytes(mac);
  let v = (b[3] << 16) | (b[4] << 8) | b[5];
  v = (v + n) & 0xffffff;
  return macFromBytes([b[0], b[1], b[2], (v >> 16) & 255, (v >> 8) & 255, v & 255]);
}

export function parseMac(s) {
  if (!/^[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}\.[0-9a-fA-F]{4}$/.test(s || '')) return null;
  return s.toLowerCase();
}

export function macWindows(mac) {
  return macBytes(mac).map((x) => x.toString(16).padStart(2, '0').toUpperCase()).join('-');
}

export const BROADCAST_MAC = 'ffff.ffff.ffff';

// ---------- hashing ----------
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const B64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function pseudoChars(seed, count) {
  let h = hashStr(seed);
  let out = '';
  for (let i = 0; i < count; i += 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    h = (h + 0x9e3779b9 + i) >>> 0;
    out += B64[h % 64];
  }
  return out;
}

/** Deterministic look-alike of an IOS type 9 (scrypt) secret. */
export function secret9(password) {
  return `$9$${pseudoChars(`salt:${password}`, 14)}$${pseudoChars(`hash:${password}`, 43)}`;
}

const XLAT = 'dsfd;kfoA,.iyewrkldJKDHSUBsgvca69834ncxv9873254k;fg87';

export function type7Encrypt(pw, seed = 2) {
  let out = String(seed).padStart(2, '0');
  for (let i = 0; i < pw.length; i += 1) {
    const c = pw.charCodeAt(i) ^ XLAT.charCodeAt((seed + i) % XLAT.length);
    out += c.toString(16).toUpperCase().padStart(2, '0');
  }
  return out;
}

export function type7Decrypt(enc) {
  if (!/^\d{2}([0-9A-Fa-f]{2})*$/.test(enc || '')) return null;
  const seed = Number(enc.slice(0, 2));
  let out = '';
  for (let i = 2; i < enc.length; i += 2) {
    const c = parseInt(enc.slice(i, i + 2), 16) ^ XLAT.charCodeAt((seed + (i - 2) / 2) % XLAT.length);
    out += String.fromCharCode(c);
  }
  return out;
}

// ---------- VLAN lists ----------
export function parseVlanList(s) {
  if (!/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(s || '')) return null;
  const out = new Set();
  for (const part of s.split(',')) {
    const [a, b] = part.split('-').map(Number);
    const hi = b === undefined ? a : b;
    if (a < 1 || hi > 4094 || hi < a) return null;
    for (let v = a; v <= hi; v += 1) out.add(v);
  }
  return out;
}

export function vlanListStr(set) {
  const v = [...set].sort((a, b) => a - b);
  if (v.length === 0) return 'none';
  const parts = [];
  for (let i = 0; i < v.length;) {
    let j = i;
    while (j + 1 < v.length && v[j + 1] === v[j] + 1) j += 1;
    parts.push(j > i ? `${v[i]}-${v[j]}` : `${v[i]}`);
    i = j + 1;
  }
  return parts.join(',');
}

// ---------- text ----------
export const padR = (s, n) => String(s).padEnd(n);
export const padL = (s, n) => String(s).padStart(n);

export function fmtDuration(ms) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  if (h >= 24) return `${Math.floor(h / 24)}d${String(h % 24).padStart(2, '0')}h`;
  return [h, m, s].map((x) => String(x).padStart(2, '0')).join(':');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** IOS syslog timestamp: "*Oct 24 10:51:23.123" */
export function logStamp(d) {
  const p2 = (x) => String(x).padStart(2, '0');
  return `*${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, ' ')} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}.${String(d.getUTCMilliseconds()).padStart(3, '0')}`;
}

/** show clock: "*10:51:23.123 UTC Sat Oct 24 2026" */
export function clockStr(d) {
  const p2 = (x) => String(x).padStart(2, '0');
  return `*${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}.${String(d.getUTCMilliseconds()).padStart(3, '0')} UTC ${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
}

export function configStamp(d) {
  const p2 = (x) => String(x).padStart(2, '0');
  return `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())} UTC ${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
}

export function wrapList(items, firstPrefix, contPrefix, perLine) {
  const lines = [];
  for (let i = 0; i < items.length; i += perLine) {
    lines.push((i === 0 ? firstPrefix : contPrefix) + items.slice(i, i + perLine).join(', '));
  }
  if (lines.length === 0) lines.push(firstPrefix.trimEnd());
  return lines;
}

// ---------- IPv6 as BigInt (for prefix math) ----------
export function ip6Big(groups) {
  return groups.reduce((acc, g) => (acc << 16n) | BigInt(g), 0n);
}

export function bigIp6(n) {
  const out = [];
  let v = n;
  for (let i = 0; i < 8; i += 1) { out.unshift(Number(v & 0xffffn)); v >>= 16n; }
  return out;
}

export function mask6(len) {
  if (len === 0) return 0n;
  return ((1n << 128n) - 1n) ^ ((1n << BigInt(128 - len)) - 1n);
}
