// App bootstrap: hash router, sidebar navigation, theme, global search.
import store from './store.js';
import { loadContent } from './content.js';
import { html, icon, md, esc, todayIso, openModal, toast } from './ui.js';
import { daysBetween } from './lib/plan.js';
import { isDue } from './lib/srs.js';

const NAV = [
  { group: 'Study' },
  { path: '', label: 'Dashboard', icon: 'home', view: 'dashboard' },
  { path: 'plan', label: 'Study Plan', icon: 'plan', view: 'plan' },
  { path: 'learn', label: 'Curriculum', icon: 'book', view: 'curriculum' },
  { path: 'videos', label: 'Video Course', icon: 'video', view: 'videos' },
  { path: 'guide', label: 'Exam Guide', icon: 'target', view: 'guide' },
  { group: 'Practice' },
  { path: 'practice', label: 'Question Bank', icon: 'quiz', view: 'practice' },
  { path: 'exam', label: 'Exam Simulator', icon: 'exam', view: 'exam' },
  { path: 'labs', label: 'CLI Labs', icon: 'terminal', view: 'labs' },
  { path: 'subnetting', label: 'Subnetting', icon: 'calc', view: 'subnetting' },
  { path: 'flashcards', label: 'Flashcards', icon: 'cards', view: 'flashcards', badge: 'due' },
  { group: 'Tools' },
  { path: 'reference', label: 'Reference', icon: 'ref', view: 'reference' },
  { path: 'settings', label: 'Settings', icon: 'settings', view: 'settings' },
];

const EXTRA_ROUTES = { topic: 'curriculum', lesson: 'lesson' };

const viewEl = document.getElementById('view');
let cleanup = null;
let content = null;
let routeSeq = 0;

const safeDecode = (s) => {
  try { return decodeURIComponent(s); } catch { return s; }
};

function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const q = h.indexOf('?');
  const path = q === -1 ? h : h.slice(0, q);
  const query = q === -1 ? '' : h.slice(q + 1);
  const parts = path.split('/').filter(Boolean).map(safeDecode);
  return { parts, query: Object.fromEntries(new URLSearchParams(query)) };
}

export function navigate(hash) {
  location.hash = hash.startsWith('#') ? hash : `#/${hash.replace(/^\//, '')}`;
}

function setTitle(text) {
  document.title = text ? `${text} · CCNA Prep` : 'CCNA Prep';
}

function setCrumbs(items) {
  document.getElementById('crumbs').innerHTML = String(html`${items.map((c, i) => html`
    ${i ? html`<span class="sep">/</span>` : ''}
    ${c.href ? html`<a href="${c.href}">${c.label}</a>` : html`<span>${c.label}</span>`}`)}`);
}

export function logActivity(amount = 1) {
  store.update('activity', (a) => ({ ...a, [todayIso()]: (a[todayIso()] ?? 0) + amount }), {});
}

function dueFlashcards() {
  if (!content) return 0;
  const srs = store.get('srs', {});
  const now = Date.now();
  return content.flashcards.filter((c) => srs[c.id] && isDue(srs[c.id], now)).length;
}

function renderNav(activePath) {
  const due = dueFlashcards();
  document.getElementById('nav').innerHTML = String(html`${NAV.map((n) => (n.group
    ? html`<div class="nav-group">${n.group}</div>`
    : html`<a href="#/${n.path}" class="${activePath === n.path ? 'active' : ''}">${icon(n.icon)}<span>${n.label}</span>${n.badge === 'due' && due ? html`<span class="count">${due}</span>` : ''}</a>`))}`);
}

function renderCountdown() {
  const settings = store.get('settings', {});
  const foot = document.getElementById('sidebar-foot');
  if (!settings.examDate) {
    foot.innerHTML = String(html`<a class="countdown" href="#/settings" style="display:block;color:inherit;text-decoration:none">
      <small>No exam date set</small><div style="font-weight:650;margin-top:2px">Set your test date →</div></a>`);
    return;
  }
  const days = daysBetween(todayIso(), settings.examDate);
  foot.innerHTML = String(html`<div class="countdown">
    <small>Exam day</small>
    <div class="big">${days >= 0 ? days : 0}<span class="muted" style="font-size:.9rem;font-weight:600"> days</span></div>
    <small>${new Date(`${settings.examDate}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</small>
  </div>`);
}

function renderThemeButton() {
  const light = document.documentElement.dataset.theme === 'light';
  const btn = document.getElementById('theme-btn');
  btn.innerHTML = String(icon(light ? 'moon' : 'sun'));
  btn.title = light ? 'Switch to dark theme' : 'Switch to light theme';
}

function applyTheme(theme) {
  if (theme === 'light') document.documentElement.dataset.theme = 'light';
  else delete document.documentElement.dataset.theme;
  store.update('settings', (s) => ({ ...s, theme: theme === 'light' ? 'light' : 'dark' }), {});
  renderThemeButton();
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
}

// ---------- global search (Ctrl+K) ----------

function searchIndex() {
  const items = [];
  content.lessons.forEach((l) => items.push({ kind: 'Lesson', title: l.title, sub: `Topic ${l.topic}`, href: `#/lesson/${l.id}`, text: `${l.title} ${(l.objectives ?? []).join(' ')}` }));
  content.topics.forEach((t) => items.push({ kind: 'Topic', title: `${t.id} ${t.verb} ${t.title}`, sub: `Domain ${t.domain}`, href: `#/topic/${t.id}`, text: `${t.id} ${t.title} ${(t.sub ?? []).join(' ')}` }));
  content.labs.forEach((l) => items.push({ kind: 'Lab', title: l.title, sub: `Topic ${l.topic}`, href: `#/labs/${l.id}`, text: `${l.title} ${l.summary}` }));
  content.videos.forEach((v) => items.push({ kind: 'Video', title: v.title, sub: v.channel, href: `#/videos?play=${v.id}`, text: v.title }));
  content.questions.forEach((q) => items.push({ kind: 'Question', title: q.stem.slice(0, 110), sub: `${q.id} · ${q.topic}`, href: `#/practice?q=${q.id}`, text: `${q.stem} ${q.exhibit ?? ''}` }));
  content.flashcards.forEach((c) => items.push({ kind: 'Card', title: c.front, sub: c.back.slice(0, 80), href: `#/flashcards?topic=${c.topic}`, text: `${c.front} ${c.back}` }));
  return items.map((i) => ({ ...i, hay: i.text.toLowerCase() }));
}

function openSearch() {
  if (!content || document.querySelector('.palette')) return;
  const index = searchIndex();
  const { el, close } = openModal('<div class="palette"><input type="search" placeholder="Search lessons, topics, labs, videos, questions, flashcards…" aria-label="Search"><div class="palette-results"></div></div>');
  const input = el.querySelector('input');
  const results = el.querySelector('.palette-results');
  let sel = 0;
  let hits = [];
  const draw = () => {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    hits = terms.length ? index.filter((i) => terms.every((t) => i.hay.includes(t))).slice(0, 40) : [];
    sel = Math.min(sel, Math.max(0, hits.length - 1));
    results.innerHTML = hits.length
      ? hits.map((h, i) => `<a href="${esc(h.href)}" class="${i === sel ? 'sel' : ''}"><span class="kind">${esc(h.kind)}</span><span><div>${esc(h.title)}</div><div class="small muted">${esc(h.sub)}</div></span></a>`).join('')
      : `<div class="empty small">${terms.length ? 'No matches.' : 'Type to search everything in the course.'}</div>`;
    results.querySelector('a.sel')?.scrollIntoView({ block: 'nearest' });
  };
  input.addEventListener('input', () => { sel = 0; draw(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { sel = Math.min(hits.length - 1, sel + 1); draw(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    if (e.key === 'Enter' && hits[sel]) { location.hash = hits[sel].href; close(); }
  });
  results.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  draw();
  input.focus();
}

// ---------- routing ----------

async function route() {
  const seq = ++routeSeq;
  const { parts, query } = parseHash();
  const head = parts[0] ?? '';
  const navItem = NAV.find((n) => n.path === head && n.view);
  const viewName = navItem?.view ?? EXTRA_ROUTES[head];
  document.getElementById('app').classList.remove('nav-open');

  if (typeof cleanup === 'function') {
    try { cleanup(); } catch (e) { console.error('[router] cleanup failed', e); }
  }
  cleanup = null;

  renderNav(navItem ? head : head === 'topic' || head === 'lesson' ? 'learn' : '');
  renderCountdown();

  if (!viewName) {
    viewEl.innerHTML = String(html`<div class="empty"><h3>Page not found</h3><p><a href="#/">Back to the dashboard</a></p></div>`);
    return;
  }
  setCrumbs([{ label: navItem?.label ?? 'Curriculum', href: navItem ? undefined : '#/learn' }]);
  setTitle(navItem?.label);

  const params = { id: parts[1], rest: parts.slice(1), query, head };
  const ctx = { store, navigate, md, setTitle, setCrumbs, logActivity, content, applyTheme, refreshNav: () => renderNav(navItem ? head : 'learn') };
  try {
    const mod = await import(`./views/${viewName}.js`);
    if (seq !== routeSeq) return; // a newer navigation started while this module loaded
    // Fresh host per route so listeners attached by the previous view die with its node.
    const host = document.createElement('div');
    viewEl.replaceChildren(host);
    const viewCleanup = await mod.render(host, params, ctx);
    if (seq !== routeSeq) {
      // Superseded while rendering: tear this view down instead of letting it clobber the newer one.
      if (typeof viewCleanup === 'function') viewCleanup();
      return;
    }
    cleanup = viewCleanup;
    if (!query.keepScroll) window.scrollTo(0, 0);
    viewEl.focus({ preventScroll: true });
  } catch (e) {
    if (seq !== routeSeq) return;
    console.error(`[router] failed to render ${viewName}`, e);
    viewEl.innerHTML = String(html`<div class="card"><h3>Something went wrong loading this page.</h3><pre class="exhibit">${e.stack ?? e.message}</pre></div>`);
  }
}

async function boot() {
  renderThemeButton();
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('app').classList.toggle('nav-open'));
  document.getElementById('search-btn').addEventListener('click', openSearch);
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
  });
  viewEl.innerHTML = '<div class="empty">Loading course content…</div>';
  window.addEventListener('ccna:store-error', () => toast('Progress could not be saved to browser storage (it may be full). Export a backup from Settings.', 'err'));
  content = await loadContent();
  if (content.loadErrors.length) {
    toast(`Some content failed to load: ${content.loadErrors.join(', ')}. See the browser console.`, 'err');
  }
  if (!store.get('settings', {}).planStart) store.update('settings', (s) => ({ ...s, planStart: todayIso() }), {});
  window.addEventListener('hashchange', route);
  store.subscribe((key) => { if (key === 'srs' || key === 'settings' || key === '*') { renderCountdown(); } });
  route();
}

boot();
