// Course bootstrap: loads the course config, binds the store to the course's
// prefix, then runs the hash router, sidebar navigation, theme and global search.
// A course page starts it with: boot(new URL('./', import.meta.url)).
import store, { STORE_ERROR_EVENT } from './store.js';
import { loadCourse, courseUrl } from './course.js';
import { loadContent } from './content.js';
import { buildNav, EXTRA_ROUTES } from './nav.js';
import { openSearch } from './search.js';
import { currentTheme, savedTheme, setTheme } from './theme.js';
import { html, icon, md, todayIso, toast } from './ui.js';
import { daysBetween } from './lib/plan.js';
import { isDue } from './lib/srs.js';
import { isMultiExam, nextDatedExam } from './lib/exams.js';

const viewEl = document.getElementById('view');
let course = null;
let nav = [];
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
  document.title = text ? `${text} · ${course.name}` : course.name;
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
  document.getElementById('nav').innerHTML = String(html`${nav.map((n) => (n.group
    ? html`<div class="nav-group">${n.group}</div>`
    : html`<a href="#/${n.path}" class="${activePath === n.path ? 'active' : ''}">${icon(n.icon)}<span>${n.label}</span>${n.badge === 'due' && due ? html`<span class="count">${due}</span>` : ''}</a>`))}`);
}

function renderCountdown() {
  const settings = store.get('settings', {});
  const foot = document.getElementById('sidebar-foot');
  const next = nextDatedExam(course, settings, todayIso());
  if (!next) {
    foot.innerHTML = String(html`<a class="countdown" href="#/settings" style="display:block;color:inherit;text-decoration:none">
      <small>No exam date set</small><div style="font-weight:650;margin-top:2px">Set your test date →</div></a>`);
    return;
  }
  const days = daysBetween(todayIso(), next.date);
  foot.innerHTML = String(html`<div class="countdown">
    <small>${isMultiExam(course) ? `${next.exam.code} exam day` : 'Exam day'}</small>
    <div class="big">${days >= 0 ? days : 0}<span class="muted" style="font-size:.9rem;font-weight:600"> days</span></div>
    <small>${new Date(`${next.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</small>
  </div>`);
}

function renderThemeButton() {
  const light = currentTheme() === 'light';
  const btn = document.getElementById('theme-btn');
  btn.innerHTML = String(icon(light ? 'moon' : 'sun'));
  btn.title = light ? 'Switch to dark theme' : 'Switch to light theme';
}

function applyTheme(theme) {
  const applied = setTheme(theme);
  store.update('settings', (s) => ({ ...s, theme: applied }), {});
  renderThemeButton();
}

function toggleTheme() {
  applyTheme(currentTheme() === 'light' ? 'dark' : 'light');
}

/**
 * The theme is hub-wide (engine/theme.js); courses also keep it in their own settings, as the CCNA
 * site always has. Before the hub existed only the course copy existed, so promote it once, and
 * afterwards keep the course copy in line with a choice made on the hub.
 */
function syncTheme() {
  const theme = currentTheme();
  if (!savedTheme()) setTheme(theme);
  const settings = store.get('settings', {});
  if ((settings.theme === 'light') !== (theme === 'light')) store.update('settings', (s) => ({ ...s, theme }), {});
}

// ---------- routing ----------

function loadView(item, viewName) {
  if (item?.module) return import(courseUrl(course, item.module));
  return import(`./views/${viewName}.js`);
}

async function route() {
  const seq = ++routeSeq;
  const { parts, query } = parseHash();
  const head = parts[0] ?? '';
  const navItem = nav.find((n) => !n.group && n.path === head);
  const viewName = navItem?.view ?? (navItem?.module ? head : EXTRA_ROUTES[head]);
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
  const ctx = { store, navigate, md, setTitle, setCrumbs, logActivity, content, course, applyTheme, refreshNav: () => renderNav(navItem ? head : 'learn') };
  try {
    const mod = await loadView(navItem, viewName);
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

function showBootError(e) {
  console.error('[boot] course failed to start', e);
  viewEl.innerHTML = String(html`<div class="card"><h3>This course could not start.</h3>
    <p class="muted">${e.message}</p><p class="mb0"><a href="../../">Back to all courses</a></p></div>`);
  toast('This course could not start. See the browser console for details.', 'err');
}

function showBrand() {
  document.querySelector('.brand-name').textContent = course.name;
  document.querySelector('.brand-sub').textContent = course.subtitle;
}

/** courseBase: URL of the course directory (the course page's own folder). */
export default async function boot(courseBase) {
  viewEl.innerHTML = '<div class="empty">Loading course content…</div>';
  try {
    course = await loadCourse(courseBase);
    // Bind the store before anything reads progress.
    store.configure({ prefix: course.storePrefix, courseId: course.id, courseName: course.name, legacyApps: course.legacyBackupApps });
  } catch (e) {
    showBootError(e);
    return;
  }
  nav = buildNav(course);
  showBrand();
  syncTheme();
  renderThemeButton();
  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('menu-btn').addEventListener('click', () => document.getElementById('app').classList.toggle('nav-open'));
  document.getElementById('search-btn').addEventListener('click', () => openSearch(course, content));
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(course, content); }
  });
  window.addEventListener(STORE_ERROR_EVENT, () => toast('Progress could not be saved to browser storage (it may be full). Export a backup from Settings.', 'err'));
  content = await loadContent(course);
  if (content.loadErrors.length) {
    toast(`Some content failed to load: ${content.loadErrors.join(', ')}. See the browser console.`, 'err');
  }
  if (!store.get('settings', {}).planStart) store.update('settings', (s) => ({ ...s, planStart: todayIso() }), {});
  window.addEventListener('hashchange', route);
  store.subscribe((key) => { if (key === 'srs' || key === 'settings' || key === '*') { renderCountdown(); } });
  route();
}
