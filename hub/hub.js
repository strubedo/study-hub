// Study Hub: a welcome page (#/) with continue-where-you-left-off and overall progress, and a
// course catalog (#/courses) with one card per course in courses/index.js. Ready courses show
// quick progress read from their own localStorage prefix.
import registry from '../courses/index.js';
import { loadCourse } from '../engine/course.js';
import { loadLessonIndex } from '../engine/content.js';
import { currentTheme, setTheme } from '../engine/theme.js';
import { html, icon, bar, todayIso, toast } from '../engine/ui.js';
import { readCourseStore, summarizeProgress, summarizeHub } from './progress.js';

const grid = document.getElementById('courses');
const summary = document.getElementById('summary');
const welcome = document.getElementById('welcome');
const catalog = document.getElementById('catalog');

/** Ready entries resolve to { entry, course, lessonIds } or { entry, error }. */
async function loadReady(entry) {
  try {
    const course = await loadCourse(new URL(`../courses/${entry.path}`, import.meta.url));
    const errors = [];
    const lessons = await loadLessonIndex(course, errors);
    return { entry, course, lessons: errors.length ? null : lessons, lessonIds: errors.length ? null : lessons.map((l) => l.id) };
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

const progressOf = ({ course, lessonIds }) => summarizeProgress({ read: readCourseStore(course.storePrefix), course, lessonIds, today: todayIso() });

function readyCard(item) {
  const { entry, course } = item;
  const p = progressOf(item);
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

const courseHref = (item, hash = '') => `courses/${item.entry.path}${hash}`;

function continueCard(item, p) {
  const next = item.lessons?.find((l) => l.id === p.nextLessonId);
  const pct = p.lessonsTotal ? (p.lessonsDone / p.lessonsTotal) * 100 : 0;
  return html`<div class="card hub-continue">
    <div class="eyebrow">Continue where you left off</div>
    <h2>${item.course.name}</h2>
    <p class="muted mb0">${next ? html`Next lesson: <strong>${next.title}</strong>` : 'All lessons done. Keep your edge with practice exams and flashcards.'}</p>
    <div class="row between small"><span>Lessons</span><span class="muted">${p.lessonsDone} / ${p.lessonsTotal ?? '?'}</span></div>
    ${bar(pct, 'thin')}
    <div class="row hub-actions">
      <a class="btn btn-primary" href="${courseHref(item, next ? `#/lesson/${next.id}` : '#/practice')}">${icon('play', 14)} ${next ? 'Continue lesson' : 'Practice'}</a>
      <a class="btn" href="${courseHref(item)}">Open course</a>
    </div>
  </div>`;
}

function startCard() {
  return html`<div class="card hub-continue">
    <div class="eyebrow">Get started</div>
    <h2>Pick your first course</h2>
    <p class="muted mb0">Every course has lessons, a question bank, flashcards and a timed practice exam. Start with the one you're studying for now.</p>
    <div class="row hub-actions"><a class="btn btn-primary" href="#/courses">Browse courses ${icon('arrowRight', 14)}</a></div>
  </div>`;
}

function recentRow(item, p) {
  const pct = p.lessonsTotal ? (p.lessonsDone / p.lessonsTotal) * 100 : 0;
  return html`<a class="hub-recent" href="${courseHref(item)}">
    <span class="hub-recent-name">${item.course.name}</span>
    <span class="small muted">${studiedText(p.daysSinceStudied)} · ${p.lessonsDone}/${p.lessonsTotal ?? '?'} lessons</span>
    ${bar(pct, 'thin')}
  </a>`;
}

function drawWelcome() {
  const ready = loaded.filter((x) => x.course);
  const cards = ready.map((item) => ({ id: item.entry.id, item, progress: progressOf(item) }));
  const h = summarizeHub(cards);
  const byId = (id) => cards.find((c) => c.id === id);
  const first = h.continueId ? byId(h.continueId) : null;
  const recent = h.startedIds.slice(1, 5).map(byId);
  welcome.innerHTML = String(html`
    <div class="hub-hero">
      <div class="eyebrow">Study Hub</div>
      <h1>${first ? 'Welcome back' : 'Welcome'}</h1>
      <p>${h.courses} courses, one place. Learn, practise, drill flashcards and sit timed practice exams. Everything stays in this browser.</p>
    </div>
    <div class="hub-welcome">
      ${first ? continueCard(first.item, first.progress) : startCard()}
      <div class="card">
        <h3>Your progress</h3>
        <div class="hub-stats hub-stats-4">
          <div><strong>${h.startedIds.length}</strong><span>courses started</span></div>
          <div><strong>${h.lessonsDone}</strong><span>lessons done</span></div>
          <div><strong>${h.answers}</strong><span>questions answered</span></div>
          <div><strong>${h.accuracy === null ? '—' : `${h.accuracy}%`}</strong><span>accuracy</span></div>
        </div>
        <p class="small muted mb0">${icon('bolt', 14)} ${h.weekActivity ? `${h.weekActivity} study actions in the last 7 days` : 'Nothing studied in the last 7 days yet'}</p>
      </div>
    </div>
    ${recent.length ? html`<h3 class="hub-section">Also in progress</h3><div class="hub-recent-list">${recent.map((c) => recentRow(c.item, c.progress))}</div>` : ''}
    <div class="hub-browse"><a class="btn btn-lg btn-primary" href="#/courses">Browse all ${registry.length} courses ${icon('arrowRight', 16)}</a></div>
  `);
}

/** #/courses shows the catalog; anything else shows the welcome page. */
function route() {
  const onCatalog = location.hash.replace(/\/$/, '') === '#/courses';
  catalog.hidden = !onCatalog;
  welcome.hidden = onCatalog;
  document.title = onCatalog ? 'Courses · Study Hub' : 'Study Hub';
  window.scrollTo(0, 0);
}

function draw() {
  drawWelcome();
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
  route();
  document.getElementById('theme-btn').addEventListener('click', () => {
    setTheme(currentTheme() === 'light' ? 'dark' : 'light');
    renderThemeButton();
  });
  loaded = await Promise.all(registry.filter((e) => e.status === 'ready').map(loadReady));
  const failed = loaded.filter((x) => x.error);
  if (failed.length) toast(`Could not load ${failed.map((x) => x.entry.id).join(', ')}. See the browser console.`, 'err');
  draw();
  route();
  window.addEventListener('hashchange', route);
  // Progress changes in a course tab, or on returning via the back button, refresh the cards.
  window.addEventListener('storage', draw);
  window.addEventListener('pageshow', (e) => { if (e.persisted) draw(); });
}

boot();
