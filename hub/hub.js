// Study Hub landing page: one card per course in courses/index.js. Ready
// courses show quick progress read from their own localStorage prefix.
import registry from '../courses/index.js';
import { loadCourse } from '../engine/course.js';
import { loadLessonIndex } from '../engine/content.js';
import { currentTheme, setTheme } from '../engine/theme.js';
import { html, icon, bar, todayIso, toast } from '../engine/ui.js';
import { readCourseStore, summarizeProgress } from './progress.js';

const grid = document.getElementById('courses');
const summary = document.getElementById('summary');

/** Ready entries resolve to { entry, course, lessonIds } or { entry, error }. */
async function loadReady(entry) {
  try {
    const course = await loadCourse(new URL(`../courses/${entry.path}`, import.meta.url));
    const errors = [];
    const lessons = await loadLessonIndex(course, errors);
    return { entry, course, lessonIds: errors.length ? null : lessons.map((l) => l.id) };
  } catch (e) {
    console.error(`[hub] course "${entry.id}" failed to load`, e);
    return { entry, error: e };
  }
}

function studiedText(days) {
  if (days === null) return 'Not started yet';
  if (days <= 0) return 'Studied today';
  if (days === 1) return 'Studied yesterday';
  return `Last studied ${days} days ago`;
}

function examText(next) {
  if (!next) return 'No exam date set';
  const when = new Date(`${next.date}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  if (next.days < 0) return `${next.code} exam was ${when}`;
  if (next.days === 0) return `${next.code} exam is today`;
  return `${next.code} exam in ${next.days} day${next.days === 1 ? '' : 's'} · ${when}`;
}

const examChips = (codes) => (codes.length
  ? codes.map((c) => html`<span class="badge">${c}</span>`)
  : html`<span class="badge">Course</span>`);

function readyCard({ entry, course, lessonIds }) {
  const p = summarizeProgress({ read: readCourseStore(course.storePrefix), course, lessonIds, today: todayIso() });
  const lessonPct = p.lessonsTotal ? (p.lessonsDone / p.lessonsTotal) * 100 : 0;
  return html`<a class="card hub-card" href="courses/${entry.path}">
    <div class="hub-card-top"><span class="hub-vendor">${course.vendor ?? ''}</span><span class="badge badge-ok">Ready</span></div>
    <h2>${course.name}</h2>
    <p class="hub-title">${course.title}</p>
    <div class="chips">${examChips(course.exams.map((e) => e.code))}</div>
    ${course.description ? html`<p class="small muted mb0">${course.description}</p>` : ''}
    <div class="hub-progress">
      <div class="row between small"><span>Lessons</span><span class="muted">${p.lessonsDone}${p.lessonsTotal !== null ? ` / ${p.lessonsTotal}` : ''}</span></div>
      ${bar(lessonPct, 'thin')}
      <div class="hub-stats">
        <div><strong>${p.attempted}</strong><span>questions attempted</span></div>
        <div><strong>${p.accuracy === null ? '—' : `${p.accuracy}%`}</strong><span>accuracy${p.answers ? ` (${p.answers} answers)` : ''}</span></div>
        <div><strong>${p.bestScore ?? '—'}</strong><span>best practice exam</span></div>
      </div>
      <div class="hub-meta small muted">
        <span>${icon('clock', 14)} ${examText(p.nextExam)}</span>
        <span>${icon('bolt', 14)} ${studiedText(p.daysSinceStudied)}</span>
      </div>
    </div>
    <div class="hub-open">Open course ${icon('arrowRight', 16)}</div>
  </a>`;
}

function errorCard({ entry, error }) {
  return html`<div class="card hub-card hub-error">
    <div class="hub-card-top"><span class="hub-vendor">courses/${entry.path}</span><span class="badge badge-err">Failed to load</span></div>
    <h2>${entry.id}</h2>
    <p class="small muted mb0">${error.message}</p>
    <a class="small" href="courses/${entry.path}">Try opening it anyway →</a>
  </div>`;
}

function soonCard(entry) {
  return html`<div class="card hub-card hub-soon" aria-disabled="true">
    <div class="hub-card-top"><span class="hub-vendor">${entry.vendor}</span><span class="badge badge-warn">Coming soon</span></div>
    <h2>${entry.name}</h2>
    ${entry.title ? html`<p class="hub-title">${entry.title}</p>` : ''}
    <div class="chips">${examChips(entry.exams ?? [])}</div>
    ${entry.description ? html`<p class="small muted mb0">${entry.description}</p>` : ''}
  </div>`;
}

let loaded = [];

function draw() {
  const ready = loaded.filter((x) => x.course).length;
  const soon = registry.filter((e) => e.status === 'coming-soon').length;
  summary.textContent = `${ready} ready · ${soon} coming soon`;
  grid.innerHTML = String(html`${registry.map((entry) => {
    if (entry.status !== 'ready') return soonCard(entry);
    const item = loaded.find((x) => x.entry === entry);
    if (!item) return '';
    return item.course ? readyCard(item) : errorCard(item);
  })}`);
}

function renderThemeButton() {
  const light = currentTheme() === 'light';
  const btn = document.getElementById('theme-btn');
  btn.innerHTML = String(icon(light ? 'moon' : 'sun'));
  btn.title = light ? 'Switch to dark theme' : 'Switch to light theme';
}

async function boot() {
  renderThemeButton();
  document.getElementById('theme-btn').addEventListener('click', () => {
    setTheme(currentTheme() === 'light' ? 'dark' : 'light');
    renderThemeButton();
  });
  loaded = await Promise.all(registry.filter((e) => e.status === 'ready').map(loadReady));
  const failed = loaded.filter((x) => x.error);
  if (failed.length) toast(`Could not load ${failed.map((x) => x.entry.id).join(', ')}. See the browser console.`, 'err');
  draw();
  // Progress changes in a course tab, or on returning via the back button, refresh the cards.
  window.addEventListener('storage', draw);
  window.addEventListener('pageshow', (e) => { if (e.persisted) draw(); });
}

boot();
