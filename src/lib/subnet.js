// IPv4/IPv6 math plus a seeded problem generator for the subnetting trainer.
// Pure functions only: safe to use in Node tests and the browser.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

export function ipToInt(ip) {
  const parts = String(ip).trim().split('.');
  if (parts.length !== 4) throw new Error(`Invalid IPv4 address: ${ip}`);
  return parts.reduce((acc, p) => {
    if (!/^\d{1,3}$/.test(p) || Number(p) > 255) throw new Error(`Invalid IPv4 address: ${ip}`);
    return ((acc << 8) | Number(p)) >>> 0;
  }, 0);
}

export function intToIp(n) {
  const v = n >>> 0;
  return [24, 16, 8, 0].map((s) => (v >>> s) & 255).join('.');
}

export function prefixToMask(prefix) {
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error(`Invalid prefix: ${prefix}`);
  return intToIp(prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);
}

export function maskToPrefix(mask) {
  const n = ipToInt(mask);
  const prefix = n === 0 ? 0 : 32 - Math.log2((~n >>> 0) + 1);
  if (!Number.isInteger(prefix) || prefixToMask(prefix) !== intToIp(n)) throw new Error(`Non-contiguous mask: ${mask}`);
  return prefix;
}

export function wildcardFor(prefix) {
  return intToIp(~ipToInt(prefixToMask(prefix)) >>> 0);
}

export function subnetInfo(ip, prefix) {
  const addr = ipToInt(ip);
  const maskInt = ipToInt(prefixToMask(prefix));
  const network = (addr & maskInt) >>> 0;
  const broadcast = (network | (~maskInt >>> 0)) >>> 0;
  const base = { network: intToIp(network), broadcast: intToIp(broadcast) };
  let hostRange;
  if (prefix === 32) hostRange = { firstHost: intToIp(network), lastHost: intToIp(network), usableHosts: 1 };
  else if (prefix === 31) hostRange = { firstHost: intToIp(network), lastHost: intToIp(broadcast), usableHosts: 2 };
  else hostRange = { firstHost: intToIp(network + 1), lastHost: intToIp(broadcast - 1), usableHosts: 2 ** (32 - prefix) - 2 };
  return { ...base, ...hostRange, mask: prefixToMask(prefix), wildcard: wildcardFor(prefix), prefix };
}

/** Smallest subnet (longest prefix, max /30) whose subnet holds `hosts` usable addresses. */
export function prefixForHosts(hosts) {
  for (let p = 30; p >= 1; p -= 1) {
    if (2 ** (32 - p) - 2 >= hosts) return p;
  }
  throw new Error(`Too many hosts: ${hosts}`);
}

export function expandIPv6(addr) {
  const s = String(addr).trim().toLowerCase().split('/')[0];
  if (!/^[0-9a-f:]+$/.test(s) || (s.match(/::/g) || []).length > 1) throw new Error(`Invalid IPv6 address: ${addr}`);
  const [head, tail] = s.includes('::') ? s.split('::') : [s, null];
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const fill = tail === null ? [] : Array(Math.max(0, 8 - h.length - t.length)).fill('0');
  const groups = [...h, ...fill, ...t];
  if (groups.length !== 8 || groups.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) throw new Error(`Invalid IPv6 address: ${addr}`);
  return groups.map((g) => g.padStart(4, '0')).join(':');
}

/** RFC 5952 canonical text form. */
export function compressIPv6(addr) {
  const groups = expandIPv6(addr).split(':').map((g) => g.replace(/^0+(?=.)/, ''));
  let best = { start: -1, len: 0 };
  let cur = { start: -1, len: 0 };
  groups.forEach((g, i) => {
    if (g === '0') {
      cur = cur.start === -1 ? { start: i, len: 1 } : { start: cur.start, len: cur.len + 1 };
      if (cur.len > best.len) best = cur;
    } else {
      cur = { start: -1, len: 0 };
    }
  });
  if (best.len < 2) return groups.join(':');
  const left = groups.slice(0, best.start).join(':');
  const right = groups.slice(best.start + best.len).join(':');
  return `${left}::${right}`;
}

/** Modified EUI-64 address from a /64 prefix and a MAC in any common notation. */
export function eui64(prefix, mac) {
  const hex = String(mac).replace(/[^0-9a-f]/gi, '').toLowerCase();
  if (hex.length !== 12) throw new Error(`Invalid MAC: ${mac}`);
  const bytes = hex.match(/../g).map((b) => parseInt(b, 16));
  const flipped = [bytes[0] ^ 0x02, ...bytes.slice(1)];
  const iid = [flipped[0], flipped[1], flipped[2], 0xff, 0xfe, flipped[3], flipped[4], flipped[5]];
  const iidGroups = [0, 2, 4, 6].map((i) => ((iid[i] << 8) | iid[i + 1]).toString(16));
  const net = expandIPv6(prefix).split(':').slice(0, 4);
  return compressIPv6([...net, ...iidGroups].join(':'));
}

// ---------- problem generator ----------

function randomHostIp(rng) {
  const first = pick(rng, [10, 172, 192, randInt(rng, 1, 223)]);
  const firstOctet = first === 127 ? 126 : first;
  const second = firstOctet === 172 ? randInt(rng, 16, 31) : firstOctet === 192 ? 168 : randInt(rng, 0, 255);
  return `${firstOctet}.${second}.${randInt(rng, 0, 255)}.${randInt(rng, 1, 254)}`;
}

function explainBlock(ip, prefix) {
  if (prefix % 8 === 0) {
    return `/${prefix} ends on an octet boundary, so the network keeps the first ${prefix / 8} octet(s) and zeros the rest.`;
  }
  const octetIndex = Math.floor(prefix / 8);
  const maskOctet = Number(prefixToMask(prefix).split('.')[octetIndex]);
  const block = 256 - maskOctet;
  const value = Number(ip.split('.')[octetIndex]);
  const low = Math.floor(value / block) * block;
  return `Mask /${prefix} = ${prefixToMask(prefix)}. Interesting octet is #${octetIndex + 1} (mask ${maskOctet}), block size 256 - ${maskOctet} = ${block}. `
    + `${value} falls in the ${low}–${low + block - 1} block.`;
}

const GENERATORS = {
  network(rng) {
    const ip = randomHostIp(rng);
    const prefix = randInt(rng, 9, 30);
    const s = subnetInfo(ip, prefix);
    return { prompt: `What is the network (subnet) address of ${ip}/${prefix}?`, answers: [s.network], explain: `${explainBlock(ip, prefix)} Network = ${s.network}.` };
  },
  broadcast(rng) {
    const ip = randomHostIp(rng);
    const prefix = randInt(rng, 9, 30);
    const s = subnetInfo(ip, prefix);
    return { prompt: `What is the broadcast address of ${ip}/${prefix}?`, answers: [s.broadcast], explain: `${explainBlock(ip, prefix)} Broadcast = ${s.broadcast}.` };
  },
  first(rng) {
    const ip = randomHostIp(rng);
    const prefix = randInt(rng, 9, 30);
    const s = subnetInfo(ip, prefix);
    return { prompt: `What is the first usable host address in the subnet of ${ip} ${prefixToMask(prefix)}?`, answers: [s.firstHost], explain: `${explainBlock(ip, prefix)} Network ${s.network}, so first host = ${s.firstHost}.` };
  },
  last(rng) {
    const ip = randomHostIp(rng);
    const prefix = randInt(rng, 9, 30);
    const s = subnetInfo(ip, prefix);
    return { prompt: `What is the last usable host address in the subnet of ${ip}/${prefix}?`, answers: [s.lastHost], explain: `${explainBlock(ip, prefix)} Broadcast ${s.broadcast}, so last host = ${s.lastHost}.` };
  },
  hosts(rng) {
    const prefix = randInt(rng, 16, 30);
    const n = 2 ** (32 - prefix) - 2;
    return { prompt: `How many usable host addresses does a /${prefix} subnet provide?`, answers: [String(n)], explain: `2^(32-${prefix}) - 2 = 2^${32 - prefix} - 2 = ${n}.` };
  },
  prefixForHosts(rng) {
    const hosts = pick(rng, [randInt(rng, 2, 60), randInt(rng, 61, 500), randInt(rng, 501, 4000)]);
    const p = prefixForHosts(hosts);
    return {
      prompt: `What is the longest prefix (smallest subnet) that supports ${hosts} usable hosts?`,
      answers: [`/${p}`, String(p), prefixToMask(p)],
      explain: `Need 2^h - 2 >= ${hosts}: h = ${32 - p} host bits gives ${2 ** (32 - p) - 2}. Prefix = 32 - ${32 - p} = /${p} (${prefixToMask(p)}).`,
    };
  },
  wildcard(rng) {
    const p = randInt(rng, 8, 30);
    return { prompt: `What wildcard mask matches a /${p} network (as used in OSPF network statements and ACLs)?`, answers: [wildcardFor(p)], explain: `255.255.255.255 - ${prefixToMask(p)} = ${wildcardFor(p)}.` };
  },
  mask(rng) {
    const p = randInt(rng, 8, 30);
    return { prompt: `Convert /${p} to a dotted-decimal subnet mask.`, answers: [prefixToMask(p)], explain: `${p} ones followed by ${32 - p} zeros = ${prefixToMask(p)}.` };
  },
  eui64(rng) {
    const hx = () => randInt(rng, 1, 0xffff).toString(16);
    const prefix = `2001:db8:${hx()}:${hx()}::`;
    const macBytes = Array.from({ length: 6 }, () => randInt(rng, 0, 255).toString(16).padStart(2, '0'));
    const mac = `${macBytes[0]}${macBytes[1]}.${macBytes[2]}${macBytes[3]}.${macBytes[4]}${macBytes[5]}`;
    const answer = eui64(prefix, mac);
    return {
      prompt: `Using modified EUI-64, what IPv6 address does an interface with MAC ${mac} build from prefix ${prefix}/64?`,
      answers: [answer],
      explain: `Split the MAC in half and insert FFFE, then flip the 7th bit of the first byte (${macBytes[0]} → ${(parseInt(macBytes[0], 16) ^ 2).toString(16).padStart(2, '0')}). Result: ${answer}`,
    };
  },
  compress(rng) {
    const groups = Array.from({ length: 8 }, () => (rng() < 0.45 ? '0000' : randInt(rng, 1, 0xffff).toString(16).padStart(4, '0')));
    const full = ['2001', '0db8', ...groups.slice(2)].join(':');
    const answer = compressIPv6(full);
    return { prompt: `Write ${full} in its shortest valid (RFC 5952) form.`, answers: [answer], explain: `Drop leading zeros in each hextet, then replace the longest run of two or more all-zero hextets with :: (leftmost run on a tie). Result: ${answer}` };
  },
};

export const PROBLEM_KINDS = Object.keys(GENERATORS);

export function generateProblem(kind, rng = Math.random) {
  const gen = GENERATORS[kind];
  if (!gen) throw new Error(`Unknown problem kind: ${kind}`);
  return { kind, ...gen(rng) };
}

const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/\s+/g, '');

export function checkAnswer(problem, input) {
  const given = norm(input);
  if (!given) return false;
  if (problem.kind === 'eui64') {
    try {
      return expandIPv6(given) === expandIPv6(problem.answers[0]);
    } catch {
      return false;
    }
  }
  return problem.answers.some((a) => norm(a) === given);
}
