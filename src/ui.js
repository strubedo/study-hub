// DOM-side helpers shared by every view: safe HTML templating, markdown,
// icons, toasts, dialogs and small visual widgets.

class SafeHtml {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export const raw = (s) => new SafeHtml(String(s ?? ''));

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function interp(v) {
  if (v instanceof SafeHtml) return v.value;
  if (Array.isArray(v)) return v.map(interp).join('');
  if (v === false || v === null || v === undefined) return '';
  return esc(v);
}

/** Tagged template: interpolations are escaped unless wrapped in raw() or produced by html``. */
export function html(strings, ...values) {
  return raw(strings.reduce((out, s, i) => out + s + (i < values.length ? interp(values[i]) : ''), ''));
}

export function $(sel, root = document) { return root.querySelector(sel); }
export function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

// ---------- markdown ----------

function highlightIos(code) {
  return code.split('\n').map((line) => {
    if (/^\s*!/.test(line)) return `<span class="tok-cmt">${esc(line)}</span>`;
    // Match the prompt on the raw line (before escaping turns ">" into "&gt;").
    const m = line.match(/^([\w.-]+(?:\([\w-]+\))?[>#])(\s?)(.*)$/);
    const body = esc(m ? m[3] : line);
    const colored = body
      .replace(/\b(up|FULL|forwarding|FWD|Active|connected)\b/g, '<span class="tok-up">$1</span>')
      .replace(/\b(down|administratively down|err-disabled|BLK|notconnect|Init)\b/g, '<span class="tok-down">$1</span>');
    return m ? `<span class="tok-prompt">${esc(m[1])}</span>${m[2]}${colored}` : colored;
  }).join('\n');
}

let mdReady = false;
function setupMarked() {
  if (mdReady || !globalThis.marked) return;
  globalThis.marked.use({
    gfm: true,
    renderer: {
      code(code, lang) {
        const text = typeof code === 'object' ? code.text : code;
        const language = typeof code === 'object' ? code.lang : lang;
        const body = language === 'ios' ? highlightIos(text) : esc(text);
        return `<pre><code class="lang-${esc(language || 'text')}">${body}</code></pre>`;
      },
    },
  });
  mdReady = true;
}

const CALLOUTS = [
  ['Exam tip:', 'tip'],
  ['Watch out:', 'warn'],
  ['Real world:', 'real'],
];

export function md(markdown, { inline = false } = {}) {
  setupMarked();
  if (!globalThis.marked) return esc(markdown);
  let out = inline ? globalThis.marked.parseInline(String(markdown ?? '')) : globalThis.marked.parse(String(markdown ?? ''));
  CALLOUTS.forEach(([label, cls]) => {
    out = out.replaceAll(`<blockquote>\n<p><strong>${label}</strong>`, `<blockquote class="${cls}">\n<p><strong>${label}</strong>`);
  });
  return out;
}

// ---------- icons (24px stroke icons) ----------

const P = {
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
  plan: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5V4.5"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
  exam: '<path d="M9 3h6l1 3H8z"/><rect x="4" y="5" width="16" height="16" rx="2"/><path d="m9 13 2 2 4-4"/>',
  terminal: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3M12 15h6"/>',
  calc: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>',
  cards: '<rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
  video: '<rect x="2" y="5" width="15" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
  ref: '<path d="M4 4h6v16H4zM14 4h6v16h-6z"/><path d="M7 8h0M17 8h0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  play: '<path d="M7 4v16l13-8z" fill="currentColor"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  flag: '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  external: '<path d="M14 4h6v6M10 14 20 4M18 14v6H4V6h6"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  download: '<path d="M12 3v12M6 11l6 6 6-6M4 21h16"/>',
  upload: '<path d="M12 21V9M6 13l6-6 6 6M4 3h16"/>',
};

export function icon(name, size = 18) {
  return raw(`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] ?? ''}</svg>`);
}

// ---------- widgets ----------

export function ring(percent, { size = 132, stroke = 11, label = '', color = 'var(--accent)', display } = {}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, percent));
  return html`<div class="ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}" style="transition:stroke-dashoffset .6s ease"/>
    </svg>
    <div class="ring-label"><strong>${display ?? Math.round(p)}</strong><span>${label}</span></div>
  </div>`;
}

export function bar(percent, cls = '') {
  const p = Math.max(0, Math.min(100, percent));
  return html`<div class="bar ${cls}"><span style="width:${p}%"></span></div>`;
}

export function fmtDuration(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}` : `${m}:${String(sec).padStart(2, '0')}`;
}

export function fmtMinutes(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function todayIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function toast(message, kind = '') {
  const host = document.getElementById('toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/** Opens a modal. Returns { el, close }. `onClose` runs once. */
export function openModal(content, { narrow = false, onClose } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `<div class="modal ${narrow ? 'narrow' : ''}" role="dialog" aria-modal="true">${content}</div>`;
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    overlay.remove();
    document.removeEventListener('keydown', onKey);
    onClose?.();
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  overlay.addEventListener('mousedown', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  return { el: overlay.firstElementChild, close };
}

export function confirmDialog(message, { okLabel = 'Confirm', danger = false } = {}) {
  return new Promise((resolve) => {
    let answered = false;
    const { el, close } = openModal(String(html`
      <h3>${message}</h3>
      <div class="row" style="justify-content:flex-end;margin-top:18px">
        <button class="btn btn-ghost" data-act="cancel">Cancel</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${okLabel}</button>
      </div>`), { narrow: true, onClose: () => { if (!answered) resolve(false); } });
    el.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (!act) return;
      answered = true;
      resolve(act === 'ok');
      close();
    });
    el.querySelector('[data-act="ok"]').focus();
  });
}

export function domainTag(domain) {
  return html`<span class="dom-tag dom-${domain.id}">D${domain.id} · ${domain.short}</span>`;
}
