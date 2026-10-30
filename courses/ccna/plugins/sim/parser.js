// IOS-style command grammar. Commands are declared as compact patterns and
// compiled into a per-mode NFA. Matching supports unique-prefix keyword
// abbreviation, typed arguments (some consuming several tokens), `?` help,
// Tab completion and the exact IOS error messages.
//
// Pattern syntax:
//   word            keyword (help text from KW_HELP or an inline {help})
//   word{Help text} keyword with inline help
//   name:TYPE{help} typed argument captured as args[name]
//   [ ... ]         optional group     ( a | b )  alternatives
// TYPE is one of A.B.C.D, X:X:X:X::X, X:X:X:X::X/<0-128>, WORD, LINE, H.H.H,
// <lo-hi>, IFACE, IFRANGE, VLANLIST, PORT, or a custom type registered below.

import { parseIp, parseIp6, parsePrefix6, parseMac, parseVlanList } from './util.js';
import { IF_TYPES, matchIfType, normalizeIfName, splitIfName } from './ifnames.js';
import { KW_HELP } from './help-text.js';

// ---------- argument types ----------
const ARG_TYPES = {};

function defType(name, spec) { ARG_TYPES[name] = { display: name, ...spec }; }

defType('A.B.C.D', { help: 'IP address', match: (t) => (parseIp(t) !== null ? 1 : 0) });
defType('X:X:X:X::X', { help: 'IPv6 address', match: (t) => (parseIp6(t) ? 1 : 0) });
defType('X:X:X:X::X/<0-128>', { help: 'IPv6 prefix', match: (t) => (parsePrefix6(t) ? 1 : 0) });
defType('WORD', { help: 'Name', match: () => 1 });
defType('H.H.H', { help: '48 bit mac address', match: (t) => (parseMac(t) ? 1 : 0) });
defType('VLANLIST', { display: 'WORD', help: 'VLAN IDs of the allowed VLANs when this port is in trunking mode', match: (t) => (parseVlanList(t) ? 1 : 0) });

export const TCP_PORTS = { bgp: 179, chargen: 19, cmd: 514, daytime: 13, discard: 9, domain: 53, echo: 7, exec: 512, finger: 79, ftp: 21, 'ftp-data': 20, gopher: 70, hostname: 101, ident: 113, irc: 194, klogin: 543, kshell: 544, login: 513, lpd: 515, nntp: 119, pop2: 109, pop3: 110, smtp: 25, sunrpc: 111, tacacs: 49, talk: 517, telnet: 23, time: 37, uucp: 540, whois: 43, www: 80 };
export const UDP_PORTS = { biff: 512, bootpc: 68, bootps: 67, discard: 9, dnsix: 195, domain: 53, echo: 7, isakmp: 500, 'mobile-ip': 434, nameserver: 42, 'netbios-dgm': 138, 'netbios-ns': 137, 'netbios-ss': 139, ntp: 123, rip: 520, snmp: 161, snmptrap: 162, sunrpc: 111, syslog: 514, tacacs: 49, talk: 517, tftp: 69, time: 37, who: 513, xdmcp: 177 };
defType('PORT', {
  display: '<0-65535>', help: 'Port number',
  match: (t) => (/^\d+$/.test(t) && Number(t) <= 65535) || TCP_PORTS[t.toLowerCase()] !== undefined || UDP_PORTS[t.toLowerCase()] !== undefined ? 1 : 0,
});

function rangeType(lo, hi) {
  return { display: `<${lo}-${hi}>`, help: '', match: (t) => (/^\d+$/.test(t) && Number(t) >= lo && Number(t) <= hi ? 1 : 0) };
}

// IFACE: "gi0/0/0", "gi 0/0/0", "GigabitEthernet0/0/0.10". The session decides which names exist.
function ifaceMatch(tokens, i, ctx, opts) {
  const t = tokens[i];
  const full = normalizeIfName(t);
  if (full && ctx.ifaceOk(full, opts)) return { n: 1, value: full };
  const ty = matchIfType(t, ctx.ifTypes(opts));
  if (ty && ty !== 'ambiguous' && /^[A-Za-z-]+$/.test(t) && i + 1 < tokens.length) {
    const cand = normalizeIfName(`${ty.name}${tokens[i + 1]}`);
    if (cand && ctx.ifaceOk(cand, opts)) return { n: 2, value: cand };
  }
  return null;
}

// ---------- pattern compilation ----------
function lex(pattern) {
  const out = [];
  const re = /\s*(\[|\]|\(|\)|\||[^\s[\]()|{]+(?:\{[^}]*\})?)/g;
  let m;
  while ((m = re.exec(pattern)) !== null) {
    if (m[1]) out.push(m[1]);
  }
  return out;
}

function parseSeq(toks, pos, stopAt) {
  const items = [];
  let i = pos;
  while (i < toks.length && !stopAt.includes(toks[i])) {
    const t = toks[i];
    if (t === '[' || t === '(') {
      const close = t === '[' ? ']' : ')';
      const alts = [];
      let j = i + 1;
      for (;;) {
        const r = parseSeq(toks, j, ['|', close]);
        alts.push(r.items);
        j = r.pos;
        if (toks[j] === '|') { j += 1; continue; }
        break;
      }
      items.push({ kind: t === '[' ? 'opt' : 'alt', alts });
      i = j + 1;
    } else {
      items.push({ kind: 'tok', spec: parseTok(t) });
      i += 1;
    }
  }
  return { items, pos: i };
}

function parseTok(raw) {
  const m = /^(?:([a-zA-Z_$][\w$]*):)?([^{]+)(?:\{([^}]*)\})?$/.exec(raw);
  const name = m[1] || null;
  const body = m[2];
  const help = m[3];
  const range = /^<(\d+)-(\d+)>$/.exec(body);
  if (range) return { arg: true, type: rangeType(Number(range[1]), Number(range[2])), name, help };
  if (body === 'IFACE' || body === 'IFACE_NEW' || body === 'IFACE_ANY') {
    const opts = body === 'IFACE' ? 'existing' : body === 'IFACE_NEW' ? 'create' : 'any';
    return { arg: true, iface: opts, name: name || 'iface', help, type: { display: 'IFACE', help: '' } };
  }
  if (body === 'LINE' || body === 'IFRANGE') return { arg: true, rest: true, name: name || body.toLowerCase(), help, type: { display: body === 'LINE' ? 'LINE' : 'LINE', help: '' }, ifrange: body === 'IFRANGE' };
  if (ARG_TYPES[body]) return { arg: true, type: ARG_TYPES[body], name, help };
  if (/^[A-Z]/.test(body) && !/[a-z]/.test(body)) throw new Error(`Unknown arg type ${body}`);
  return { kw: body.toLowerCase(), disp: body, name, help };
}

let nodeSeq = 0;
function newNode() { nodeSeq += 1; return { id: nodeSeq, edges: [], accept: null }; }

function compileItems(items, starts) {
  let cur = starts;
  for (const it of items) {
    if (it.kind === 'tok') {
      const n = newNode();
      cur.forEach((s) => s.edges.push({ spec: it.spec, to: n }));
      cur = [n];
    } else {
      const ends = [];
      it.alts.forEach((alt) => ends.push(...compileItems(alt, cur)));
      if (it.kind === 'opt') ends.push(...cur);
      cur = [...new Set(ends)];
    }
  }
  return cur;
}

export class Grammar {
  constructor() { this.roots = new Map(); this.order = 0; }

  root(mode) {
    if (!this.roots.has(mode)) this.roots.set(mode, newNode());
    return this.roots.get(mode);
  }

  /** def(modes, pattern, handler, opts) — opts.priv for privileged-only in exec. */
  def(modes, pattern, handler, opts = {}) {
    const toks = lex(pattern);
    const { items } = parseSeq(toks, 0, []);
    for (const mode of [].concat(modes)) {
      const ends = compileItems(items, [this.root(mode)]);
      this.order += 1;
      const acc = { handler, opts, order: this.order, pattern };
      ends.forEach((e) => { if (!e.accept || e.accept.order > acc.order) e.accept = acc; });
    }
  }
}

// ---------- tokenizing ----------
export function tokenize(line) {
  const toks = [];
  const re = /\S+/g;
  let m;
  while ((m = re.exec(line)) !== null) toks.push({ text: m[0], start: m.index });
  return toks;
}

function kwHelp(spec) {
  return spec.help ?? KW_HELP[spec.kw] ?? '';
}

function argMatch(spec, words, i, ctx, rawLine, toks) {
  if (spec.rest) {
    if (spec.ifrange) {
      const text = rawLine.slice(toks[i].start).trim();
      return ctx.parseIfRange(text) ? { n: words.length - i, value: text } : null;
    }
    return { n: words.length - i, value: rawLine.slice(toks[i].start) };
  }
  if (spec.iface) return ifaceMatch(words, i, ctx, spec.iface);
  return spec.type.match(words[i]) ? { n: 1, value: words[i] } : null;
}

function capture(args, spec, value) {
  const next = { ...args, $: [...args.$, value] };
  if (spec.kw) next[spec.name || spec.kw] = true;
  else if (spec.name) next[spec.name] = value;
  return next;
}

/**
 * Walk the NFA over the tokens. Returns
 *  { ok, accept, args } | { error: 'invalid'|'incomplete'|'ambiguous', pos }
 */
export function match(grammar, mode, rawLine, ctx) {
  const toks = tokenize(rawLine);
  const words = toks.map((t) => t.text);
  const root = grammar.roots.get(mode);
  if (!root) return { error: 'invalid', pos: 0, toks };
  let frontier = new Map([[0, [{ node: root, args: { $: [] } }]]]);
  let furthest = { pos: 0, kind: 'invalid' };
  const done = [];
  for (let p = 0; p <= words.length; p += 1) {
    const threads = frontier.get(p) || [];
    frontier.delete(p);
    if (threads.length === 0) continue;
    if (p === words.length) { done.push(...threads); continue; }
    const advanced = stepThreads(threads, words, p, ctx, rawLine, toks);
    if (advanced.ambiguous && advanced.next.length === 0) {
      if (p >= furthest.pos) furthest = { pos: p, kind: 'ambiguous' };
    } else if (advanced.next.length === 0 && p >= furthest.pos) {
      furthest = { pos: p, kind: 'invalid' };
    }
    advanced.next.forEach((t) => {
      const list = frontier.get(t.pos) || [];
      if (!list.some((x) => x.node === t.node)) list.push({ node: t.node, args: t.args });
      frontier.set(t.pos, list);
    });
  }
  const accepted = done.filter((t) => t.node.accept).sort((a, b) => a.node.accept.order - b.node.accept.order);
  if (accepted.length) return { ok: true, accept: accepted[0].node.accept, args: accepted[0].args, toks };
  if (done.length) return { error: 'incomplete', pos: words.length, toks };
  return { error: furthest.kind, pos: furthest.pos, toks };
}

function stepThreads(threads, words, p, ctx, rawLine, toks) {
  const w = words[p].toLowerCase();
  const kwEdges = [];
  const argEdges = [];
  threads.forEach((t) => t.node.edges.forEach((e) => (e.spec.kw ? kwEdges : argEdges).push({ t, e })));
  const cands = new Set(kwEdges.filter(({ e }) => e.spec.kw.startsWith(w)).map(({ e }) => e.spec.kw));
  let chosen = null;
  if (cands.has(w)) chosen = w;
  else if (cands.size === 1) [chosen] = cands;
  const next = [];
  if (chosen) {
    kwEdges.filter(({ e }) => e.spec.kw === chosen)
      .forEach(({ t, e }) => next.push({ node: e.to, pos: p + 1, args: capture(t.args, e.spec, chosen) }));
    return { next, ambiguous: false };
  }
  argEdges.forEach(({ t, e }) => {
    const r = argMatch(e.spec, words, p, ctx, rawLine, toks);
    if (r) next.push({ node: e.to, pos: p + r.n, args: capture(t.args, e.spec, r.value) });
  });
  return { next, ambiguous: cands.size > 1 };
}

/** Threads after consuming all complete words (for help/completion). */
function threadsAt(grammar, mode, words, ctx, rawLine, toks) {
  let frontier = new Map([[0, [{ node: grammar.roots.get(mode), args: { $: [] } }]]]);
  let furthest = { pos: 0, kind: 'invalid' };
  for (let p = 0; p < words.length; p += 1) {
    const threads = frontier.get(p) || [];
    frontier.delete(p);
    if (threads.length === 0) continue;
    const r = stepThreads(threads, words, p, ctx, rawLine, toks);
    if (r.next.length === 0 && p >= furthest.pos) furthest = { pos: p, kind: r.ambiguous ? 'ambiguous' : 'invalid' };
    r.next.forEach((t) => {
      if (t.pos > words.length) return;
      const list = frontier.get(t.pos) || [];
      list.push(t);
      frontier.set(t.pos, list);
    });
  }
  const at = frontier.get(words.length) || [];
  return { threads: at, furthest };
}

function argDisplay(spec, ctx) {
  if (spec.iface) return [];
  return [{ word: spec.type.display, help: spec.help ?? spec.type.help ?? '' }];
}

/**
 * Context help. `text` is everything typed before the '?'.
 * Returns { lines } or { error, pos }.
 */
export function help(grammar, mode, text, ctx) {
  const endsWithSpace = text.length === 0 || /\s$/.test(text);
  const toks = tokenize(text);
  const words = toks.map((t) => t.text);
  const complete = endsWithSpace ? words : words.slice(0, -1);
  const partial = endsWithSpace ? null : words[words.length - 1];
  const { threads, furthest } = threadsAt(grammar, mode, complete, ctx, text, toks);
  if (threads.length === 0) return { error: furthest.kind, pos: furthest.pos, toks };
  if (partial !== null) {
    const p = partial.toLowerCase();
    const names = new Set();
    threads.forEach((t) => t.node.edges.forEach((e) => {
      if (e.spec.kw && e.spec.kw.startsWith(p)) names.add(e.spec.disp);
      if (e.spec.iface) ctx.ifTypes(e.spec.iface).forEach((ty) => { if (ty.name.toLowerCase().startsWith(p)) names.add(ty.name); });
    }));
    if (names.size === 0) return { unrecognized: true };
    return { words: [...names].sort() };
  }
  const kws = new Map();
  const args = [];
  let cr = false;
  threads.forEach((t) => {
    if (t.node.accept) cr = true;
    t.node.edges.forEach((e) => {
      if (e.spec.kw) { if (!kws.has(e.spec.disp)) kws.set(e.spec.disp, kwHelp(e.spec)); return; }
      if (e.spec.iface) {
        ctx.ifTypes(e.spec.iface).forEach((ty) => { if (!kws.has(ty.name)) kws.set(ty.name, ty.help); });
        return;
      }
      argDisplay(e.spec, ctx).forEach((a) => { if (!args.some((x) => x.word === a.word)) args.push(a); });
    });
  });
  const rows = [...args, ...[...kws.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([word, h]) => ({ word, help: h }))];
  if (cr) rows.push({ word: '<cr>', help: '<cr>' });
  return { rows };
}

/** Tab completion of the last partial word. Returns the new line or null. */
export function complete(grammar, mode, text, ctx) {
  if (text.length === 0 || /\s$/.test(text)) return null;
  const toks = tokenize(text);
  const words = toks.map((t) => t.text);
  const partial = words[words.length - 1];
  const { threads } = threadsAt(grammar, mode, words.slice(0, -1), ctx, text, toks);
  const p = partial.toLowerCase();
  const names = new Set();
  threads.forEach((t) => t.node.edges.forEach((e) => {
    if (e.spec.kw && e.spec.kw.startsWith(p)) names.add(e.spec.disp);
    if (e.spec.iface) {
      ctx.ifTypes(e.spec.iface).forEach((ty) => { if (ty.name.toLowerCase().startsWith(p)) names.add(ty.name); });
      const sp = splitIfName(partial);
      if (sp) {
        const ty = matchIfType(sp.typeWord, ctx.ifTypes(e.spec.iface));
        if (ty && ty !== 'ambiguous') names.add(`${ty.name}${sp.num}`);
      }
    }
  }));
  const exact = [...names].find((n) => n.toLowerCase() === p);
  let pick = null;
  if (names.size === 1) [pick] = names;
  else if (exact) pick = exact;
  if (!pick) return null;
  const before = text.slice(0, toks[toks.length - 1].start);
  const isIfType = IF_TYPES.some((t) => t.name === pick);
  return `${before}${pick}${isIfType ? '' : ' '}`;
}

export function formatHelpRows(rows) {
  const w = Math.max(...rows.map((r) => r.word.length));
  return rows.map((r) => `  ${r.word.padEnd(w)}  ${r.help}`.trimEnd()).join('\n');
}
