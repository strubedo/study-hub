// IOS console session: modes and prompts, command dispatch through the
// grammar, IOS error messages, `do`, output pipes, pending prompts
// (passwords, confirmations), and config-mode fallback to global config.

import { match, help as grammarHelp, complete as grammarComplete, formatHelpRows, tokenize } from '../parser.js';
import { grammarFor } from './grammar.js';
import { IF_TYPES, normalizeIfName, isSubif, isPhysical } from '../ifnames.js';
import { isSwitch } from '../device.js';

const SUFFIX = {
  user: '>', exec: '#', config: '(config)#', if: '(config-if)#', 'if-range': '(config-if-range)#', subif: '(config-subif)#',
  router: '(config-router)#', rtr: '(config-rtr)#', line: '(config-line)#', vlan: '(config-vlan)#', dhcp: '(dhcp-config)#',
  'std-nacl': '(config-std-nacl)#', 'ext-nacl': '(config-ext-nacl)#',
};

const GRAMMAR_MODE = { 'if-range': 'if' };
const PIPE_RE = /^(.*?)\s+\|\s*(\S+)?\s*(.*)$/;
const PIPES = ['begin', 'count', 'exclude', 'include', 'section'];
const PIPE_HELP = [
  { word: 'begin', help: 'Begin with the line that matches' },
  { word: 'count', help: 'Count number of lines which match regexp' },
  { word: 'exclude', help: 'Exclude lines that match' },
  { word: 'include', help: 'Include lines that match' },
  { word: 'section', help: 'Filter a section of output' },
];

export class IosSession {
  constructor(net, dev) {
    this.net = net;
    this.dev = dev;
    this.mode = 'user';
    this.ctx = {};
    this.history = [];
    this.pendingPrompt = null;
    this.configTouched = false;
  }

  get cfg() { return this.dev.cfg; }
  get isPc() { return false; }
  get pending() { if (this.remote) return this.remote.pending; return this.pendingPrompt ? true : false; }
  get secret() { if (this.remote) return this.remote.secret; return !!(this.pendingPrompt && this.pendingPrompt.secret); }

  get prompt() {
    if (this.remote) return this.remote.prompt;
    if (this.pendingPrompt) return this.pendingPrompt.prompt;
    return `${this.cfg.hostname}${SUFFIX[this.mode]}`;
  }

  isConfigMode(m = this.mode) { return m !== 'user' && m !== 'exec'; }

  enter(mode, ctx = {}) { this.mode = mode; this.ctx = ctx; }

  ask(prompt, handle, secret = false) { this.pendingPrompt = { prompt, handle, secret }; }

  changed() {
    this.configTouched = true;
    this.net.configChanged(this.dev);
  }

  exitConfig() {
    if (!this.isConfigMode()) return;
    this.enter('exec');
    if (this.configTouched) {
      this.configTouched = false;
      this.net.log(this.dev, '%SYS-5-CONFIG_I: Configured from console by console');
    }
  }

  // ---------- grammar context (used by arg matchers) ----------
  ifTypes(opts) {
    const present = new Set([...this.cfg.interfaces.keys()].map((n) => IF_TYPES.find((t) => n.startsWith(t.name))?.name));
    return IF_TYPES.filter((t) => {
      if (present.has(t.name)) return true;
      if (opts === 'existing') return false;
      if (t.name === 'Loopback') return true;
      if ((t.name === 'Vlan' || t.name === 'Port-channel') && isSwitch(this.dev)) return true;
      return false;
    });
  }

  ifaceOk(name, opts) {
    if (this.cfg.interfaces.has(name)) return true;
    if (opts === 'existing') return false;
    if (/^Loopback\d+$/.test(name)) return Number(name.slice(8)) <= 2147483647;
    if (isSwitch(this.dev) && /^Vlan\d+$/.test(name)) { const v = Number(name.slice(4)); return v >= 1 && v <= 4094; }
    if (isSwitch(this.dev) && /^Port-channel\d+$/.test(name)) { const v = Number(name.slice(12)); return v >= 1 && v <= 128; }
    if (isSubif(name) && this.dev.type === 'router') {
      const [parent, sub] = name.split('.');
      return this.cfg.interfaces.has(parent) && isPhysical(parent) && Number(sub) >= 1 && Number(sub) <= 4294967295;
    }
    return false;
  }

  parseIfRange(text) {
    const parts = text.split(',').map((p) => p.trim()).filter(Boolean);
    if (!parts.length) return null;
    const out = [];
    for (const p of parts) {
      const m = /^([A-Za-z-]+)\s*(\d+(?:\/\d+)*?)\/?(\d+)\s*(?:-\s*(\d+))?$/.exec(p);
      if (!m) return null;
      const base = normalizeIfName(`${m[1]}${m[2]}/${m[3]}`) || normalizeIfName(`${m[1]}${m[3]}`);
      if (!base) return null;
      const prefix = base.slice(0, base.lastIndexOf('/') + 1) || base.replace(/\d+$/, '');
      const lo = Number(m[3]); const hi = m[4] !== undefined ? Number(m[4]) : lo;
      if (hi < lo) return null;
      for (let n = lo; n <= hi; n += 1) {
        const name = base.includes('/') ? `${prefix}${n}` : base.replace(/\d+$/, String(n));
        if (!this.ifaceOk(name, name.startsWith('Vlan') ? 'create' : 'existing')) return null;
        out.push(name);
      }
    }
    return out;
  }

  // ---------- public API ----------
  input(line) {
    if (this.remote) {
      const out = this.remote.input(line);
      return this.finish(out);
    }
    if (this.pendingPrompt) {
      const p = this.pendingPrompt;
      this.pendingPrompt = null;
      const out = p.handle(line) || '';
      return this.finish(out);
    }
    const text = line.replace(/\s+$/, '');
    if (text.trim()) {
      this.history = [...this.history.slice(-99), text];
    }
    if (!text.trim()) return this.finish('');
    if (this.isConfigMode() && text.trim().startsWith('!')) return this.finish('');
    let out;
    try {
      out = this.run(text);
    } catch (e) {
      out = `% Internal simulator error: ${e.message}`;
      if (typeof console !== 'undefined') console.error(e);
    }
    return this.finish(out || '');
  }

  finish(out) {
    this.net.converge();
    const logs = this.net.takeLogs(this.dev);
    const parts = [out, ...logs].filter((x) => x !== '');
    return parts.join('\n');
  }

  drainLogs() {
    this.net.converge();
    return this.net.takeLogs(this.dev).join('\n');
  }

  ctrlZ() {
    if (this.remote) return this.remote.ctrlZ();
    if (this.pendingPrompt) { this.pendingPrompt = null; return ''; }
    if (this.isConfigMode()) this.exitConfig();
    return this.finish('');
  }

  ctrlC() {
    if (this.remote) return this.remote.ctrlC();
    if (this.pendingPrompt) { this.pendingPrompt = null; return ''; }
    if (this.isConfigMode()) this.exitConfig();
    return this.finish('');
  }

  /** Execute one command line in the current mode. */
  run(text) {
    const lead = text.length - text.trimStart().length;
    const line = text.trim();
    if (this.isConfigMode() && /^do(\s|$)/i.test(line)) {
      const rest = line.slice(2).trimStart();
      if (!rest) return this.errIncomplete();
      const off = this.prompt.length + lead + line.indexOf(rest);
      return this.runExec(rest, off, 'exec');
    }
    if (!this.isConfigMode()) return this.runExec(line, this.prompt.length + lead, this.mode);
    return this.runConfig(line, this.prompt.length + lead);
  }

  runExec(line, offset, mode) {
    const pm = PIPE_RE.exec(line);
    let cmd = line; let pipe = null;
    if (pm && /^sh/i.test(line)) {
      cmd = pm[1];
      const kw = (pm[2] || '').toLowerCase();
      const which = PIPES.filter((p) => p.startsWith(kw));
      if (!kw) return this.errIncomplete();
      if (which.length !== 1) return this.errInvalid(offset + line.indexOf(pm[2], pm[1].length));
      if (!pm[3]) return this.errIncomplete();
      pipe = { kind: which[0], pattern: pm[3] };
    }
    const g = grammarFor(this.dev);
    const r = match(g, mode, cmd, this);
    if (!r.ok) {
      if (r.error === 'incomplete' && /^sh(o|ow)?$/i.test(cmd.trim())) return '% Type "show ?" for a list of subcommands\n';
      if (r.error === 'invalid' && r.pos === 0 && (mode === 'user' || mode === 'exec') && offset === this.prompt.length + (line.length - line.trimStart().length)) {
        const privKw = mode === 'user' && grammarHelp(g, 'exec', r.toks[0].text, this).words?.length;
        if (!privKw) return this.unknownExec(r.toks[0].text);
      }
      return this.formatError(r, cmd, offset);
    }
    const out = r.accept.handler(this, r.args, cmd) ?? '';
    return pipe ? applyPipe(out, pipe) : out;
  }

  unknownExec(word) {
    const tr = this.cfg.domainLookup ? `Translating "${word}"...domain server (255.255.255.255)` : `Translating "${word}"`;
    return `${tr}\n% Unknown command or computer name, or unable to find computer address`;
  }

  runConfig(line, offset) {
    const g = grammarFor(this.dev);
    const gm = GRAMMAR_MODE[this.mode] || this.mode;
    const r = match(g, gm, line, this);
    if (r.ok) return r.accept.handler(this, r.args, line) ?? '';
    if (this.mode !== 'config') {
      const r2 = match(g, 'config', line, this);
      if (r2.ok) {
        this.enter('config');
        return r2.accept.handler(this, r2.args, line) ?? '';
      }
      if (r2.error !== 'invalid' || r2.pos > r.pos) return this.formatError(r2, line, offset);
    }
    return this.formatError(r, line, offset);
  }

  formatError(r, line, offset) {
    if (r.error === 'incomplete') return this.errIncomplete();
    if (r.error === 'ambiguous') return `% Ambiguous command:  "${line}"`;
    const tok = r.toks[r.pos];
    return this.errInvalid(offset + (tok ? tok.start : line.length));
  }

  errInvalid(col) { return `${' '.repeat(Math.max(0, col))}^\n% Invalid input detected at '^' marker.\n`; }
  errIncomplete() { return '% Incomplete command.\n'; }

  help(text) {
    if (this.remote) return this.remote.help(text);
    let mode = GRAMMAR_MODE[this.mode] || this.mode;
    let t = text;
    let offset = this.prompt.length;
    if (this.pendingPrompt) return '';
    if (this.isConfigMode() && /^\s*do\s/i.test(t)) { mode = 'exec'; offset += t.indexOf('do') + 3; t = t.replace(/^\s*do\s+/i, ''); }
    if (/\|\s*$/.test(t) && /^\s*sh/i.test(t)) return formatHelpRows(PIPE_HELP);
    if (/\|\s*\S+\s+$/.test(t) && /^\s*sh/i.test(t)) return formatHelpRows([{ word: 'LINE', help: 'Regular Expression' }]);
    const g = grammarFor(this.dev);
    const r = grammarHelp(g, mode, t, this);
    if (r.error === 'ambiguous') return `% Ambiguous command:  "${t.trim()}"`;
    if (r.error) {
      const toks = tokenize(t);
      const tok = toks[r.pos];
      return this.errInvalid(offset + (tok ? tok.start : t.length));
    }
    if (r.unrecognized) return '% Unrecognized command';
    if (r.words) return r.words.join('  ');
    if (!r.rows.length) return '% Unrecognized command';
    return formatHelpRows(r.rows);
  }

  complete(text) {
    if (this.remote) return this.remote.complete(text);
    if (this.pendingPrompt) return null;
    const mode = GRAMMAR_MODE[this.mode] || this.mode;
    const doMatch = this.isConfigMode() && /^(\s*do\s+)(.*)$/i.exec(text);
    if (doMatch) {
      const c = grammarComplete(grammarFor(this.dev), 'exec', doMatch[2], this);
      return c === null ? null : doMatch[1] + c;
    }
    return grammarComplete(grammarFor(this.dev), mode, text, this);
  }
}

export function applyPipe(out, { kind, pattern }) {
  let re;
  try { re = new RegExp(pattern); } catch { return out; }
  const lines = out.split('\n');
  if (kind === 'include') return lines.filter((l) => re.test(l)).join('\n');
  if (kind === 'exclude') return lines.filter((l) => !re.test(l)).join('\n');
  if (kind === 'count') return `Number of lines which match regexp = ${lines.filter((l) => re.test(l)).length}`;
  if (kind === 'begin') {
    const i = lines.findIndex((l) => re.test(l));
    return i < 0 ? '' : lines.slice(i).join('\n');
  }
  const res = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/^\S/.test(lines[i]) && re.test(lines[i])) {
      res.push(lines[i]);
      while (i + 1 < lines.length && /^\s/.test(lines[i + 1])) { i += 1; res.push(lines[i]); }
    } else if (/^\s/.test(lines[i]) && re.test(lines[i])) {
      let j = i; while (j > 0 && /^\s/.test(lines[j])) j -= 1;
      if (!res.includes(lines[j])) res.push(lines[j]);
      res.push(lines[i]);
    }
  }
  return res.join('\n');
}
