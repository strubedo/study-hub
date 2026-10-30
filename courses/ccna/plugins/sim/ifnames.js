// Interface naming: abbreviation expansion, short forms for show output,
// and IOS running-config ordering.

export const IF_TYPES = [
  { name: 'Loopback', short: 'Lo', cdp: 'Loo', order: 0, help: 'Loopback interface' },
  { name: 'Port-channel', short: 'Po', cdp: 'Por', order: 1, help: 'Ethernet Channel of interfaces' },
  { name: 'FastEthernet', short: 'Fa', cdp: 'Fas', order: 2, help: 'FastEthernet IEEE 802.3' },
  { name: 'GigabitEthernet', short: 'Gi', cdp: 'Gig', order: 3, help: 'GigabitEthernet IEEE 802.3z' },
  { name: 'TenGigabitEthernet', short: 'Te', cdp: 'Ten', order: 4, help: 'Ten Gigabit Ethernet' },
  { name: 'Vlan', short: 'Vl', cdp: 'Vla', order: 5, help: 'Iosxe Vlans' },
];

const PHYSICAL = new Set(['FastEthernet', 'GigabitEthernet', 'TenGigabitEthernet']);

/** Match an interface type word by unique prefix (case-insensitive). Returns type or null/'ambiguous'. */
export function matchIfType(word, allowed = IF_TYPES) {
  const w = word.toLowerCase();
  const exact = allowed.find((t) => t.name.toLowerCase() === w);
  if (exact) return exact;
  const hits = allowed.filter((t) => t.name.toLowerCase().startsWith(w));
  if (hits.length === 1) return hits[0];
  return hits.length > 1 ? 'ambiguous' : null;
}

/** Split "gi0/0/0.10" into { type, num } ; num keeps "0/0/0.10". */
export function splitIfName(s) {
  const m = /^([A-Za-z][A-Za-z-]*?)\s*(\d+(?:\/\d+)*(?:\.\d+)?)$/.exec(String(s).trim());
  if (!m) return null;
  return { typeWord: m[1], num: m[2] };
}

/** Expand any abbreviation to the canonical name, e.g. "g0/0/0" -> "GigabitEthernet0/0/0". */
export function normalizeIfName(s) {
  if (/^eth\d+$/i.test(String(s))) return String(s).toLowerCase();
  const sp = splitIfName(s);
  if (!sp) return null;
  const t = matchIfType(sp.typeWord);
  if (!t || t === 'ambiguous') return null;
  return `${t.name}${sp.num}`;
}

export function ifType(name) {
  return IF_TYPES.find((t) => name.startsWith(t.name) && /^\d/.test(name.slice(t.name.length))) || null;
}

export function shortIf(name) {
  const t = ifType(name);
  return t ? `${t.short}${name.slice(t.name.length)}` : name;
}

export function cdpIf(name) {
  const t = ifType(name);
  return t ? `${t.cdp} ${name.slice(t.name.length)}` : name;
}

export function isPhysical(name) {
  const t = ifType(name);
  return !!t && PHYSICAL.has(t.name) && !name.includes('.');
}

export function isSubif(name) { return name.includes('.'); }
export function parentOf(name) { return name.split('.')[0]; }
export function isLoopback(name) { return name.startsWith('Loopback'); }
export function isSvi(name) { return name.startsWith('Vlan'); }
export function isPortChannel(name) { return name.startsWith('Port-channel'); }

export function ifNumber(name) {
  const t = ifType(name);
  return t ? name.slice(t.name.length) : '';
}

function numKey(num) {
  return num.split(/[/.]/).map(Number);
}

export function compareIf(a, b) {
  const ta = ifType(a); const tb = ifType(b);
  const oa = ta ? ta.order : 9; const ob = tb ? tb.order : 9;
  if (oa !== ob) return oa - ob;
  const ka = numKey(ifNumber(a)); const kb = numKey(ifNumber(b));
  const pa = a.includes('.'); const pb = b.includes('.');
  const baseA = ka.slice(0, pa ? -1 : undefined); const baseB = kb.slice(0, pb ? -1 : undefined);
  for (let i = 0; i < Math.max(baseA.length, baseB.length); i += 1) {
    const d = (baseA[i] ?? -1) - (baseB[i] ?? -1);
    if (d !== 0) return d;
  }
  if (pa !== pb) return pa ? 1 : -1;
  return (ka[ka.length - 1] ?? 0) - (kb[kb.length - 1] ?? 0);
}
