// Dashboard: readiness, next steps, domain mastery, weak topics, activity.
import { html, icon, ring, bar, todayIso } from '../ui.js';
import { topicMastery, readiness, daysBetween, addDays } from '../lib/plan.js';
import { topicLabel, EXAM } from '../../content/blueprint.js';
import { isDue } from '../lib/srs.js';

const HEATMAP_WEEKS = 18;
const WEAK_MIN_SEEN = 3;

function heatmap(activity) {
  const today = todayIso();
  const dow = new Date(`${today}T12:00:00`).getDay();
  // Columns are Sunday→Saturday weeks; the last column ends on this week's Saturday.
  const start = addDays(today, -(HEATMAP_WEEKS * 7 - 1) + (6 - dow));
  const cells = [];
  for (let i = 0; i < HEATMAP_WEEKS * 7; i += 1) {
    const day = addDays(start, i);
    const n = daysBetween(day, today) < 0 ? 0 : activity[day] ?? 0;
    const level = n === 0 ? 0 : n < 5 ? 1 : n < 15 ? 2 : n < 30 ? 3 : 4;
    cells.push(html`<span data-l="${level}" title="${day}: ${n} activities"></span>`);
  }
  return html`<div class="heatmap">${cells}</div>`;
}

function streak(activity) {
  let n = 0;
  let day = todayIso();
  if (!activity[day]) day = addDays(day, -1);
  while (activity[day]) { n += 1; day = addDays(day, -1); }
  return n;
}

function sparkline(values) {
  if (values.length < 2) return '';
  const w = 220;
  const h = 56;
  const min = 300;
  const max = 1000;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ');
  const passY = h - ((825 - min) / (max - min)) * h;
  return html`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible">
    <line x1="0" x2="${w}" y1="${passY}" y2="${passY}" stroke="var(--border-strong)" stroke-dasharray="4 4"/>
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
}

export async function render(root, params, ctx) {
  const { content, store } = ctx;
  const attempts = store.get('attempts', {});
  const lessonsDone = store.get('lessonsDone', {});
  const labsDone = store.get('labs', {});
  const history = store.get('examHistory', []);
  const srs = store.get('srs', {});
  const activity = store.get('activity', {});
  const settings = store.get('settings', {});

  const mastery = topicMastery(content.questions, attempts);
  const ready = readiness(content.domains, mastery);
  const doneCount = content.lessons.filter((l) => lessonsDone[l.id]).length;
  const nextLesson = content.lessons.find((l) => !lessonsDone[l.id]);
  const dueCards = content.flashcards.filter((c) => srs[c.id] && isDue(srs[c.id])).length;
  const newCards = content.flashcards.filter((c) => !srs[c.id]).length;
  const labsCompleted = content.labs.filter((l) => labsDone[l.id]?.completedAt).length;
  const attempted = content.questions.filter((q) => attempts[q.id]).length;
  const weak = Object.entries(mastery)
    .filter(([, m]) => m.seen >= WEAK_MIN_SEEN)
    .sort((a, b) => a[1].percent - b[1].percent)
    .slice(0, 5);
  const untouched = content.topics.filter((t) => !mastery[t.id]?.seen).slice(0, 5);
  const days = settings.examDate ? daysBetween(todayIso(), settings.examDate) : null;
  const readinessText = ready >= 80 ? 'Strong across the blueprint. Keep taking full practice exams.'
    : ready >= 55 ? 'Good progress. Close the gaps in your weakest domains.'
      : attempted < 30 ? 'Answer more questions to get a reliable estimate.' : 'Keep building. Focus on lessons + topic drills.';

  root.innerHTML = String(html`
    <div class="page-header">
      <div><div class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <h1>Your CCNA study hub</h1>
      <p>${days !== null ? (days >= 0 ? `${days} days until your exam.` : 'Your exam date has passed. Update it in settings.') : html`<label class="row small" style="gap:8px;display:inline-flex">Exam date:
          <input type="date" data-exam-date min="${todayIso()}" style="width:auto;padding:5px 9px">
          <span class="faint">sets your countdown and week-by-week plan (v2.0 starts ${EXAM.liveFrom})</span></label>`}</p></div>
      <div class="row"><a class="btn" href="#/practice">${icon('quiz')} Quick quiz</a><a class="btn btn-primary" href="#/exam">${icon('exam')} Practice exam</a></div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))">
      <div class="card row" style="gap:24px;align-items:center;flex-wrap:nowrap">
        ${ring(ready, { label: 'readiness' })}
        <div><h3>Exam readiness</h3><p class="muted small mb0">${readinessText}</p>
          <p class="faint small mb0" style="margin-top:6px">Blueprint-weighted accuracy, discounted until you've covered each domain's bank.</p></div>
      </div>
      <div class="card">
        <h3>Up next</h3>
        ${nextLesson ? html`<a class="list-item" href="#/lesson/${nextLesson.id}" style="padding-left:0">
            <span class="grow"><span class="title">${nextLesson.title}</span><span class="sub">Topic ${nextLesson.topic} · ${nextLesson.minutes} min read</span></span>${icon('arrowRight')}</a>`
          : html`<p class="muted">Every lesson is complete. Focus on exams and labs.</p>`}
        <div class="row mt">
          <a class="btn btn-sm" href="#/flashcards">${icon('cards', 15)} ${dueCards} due${newCards ? ` · ${newCards} new` : ''}</a>
          <a class="btn btn-sm" href="#/subnetting">${icon('bolt', 15)} Subnetting sprint</a>
          <a class="btn btn-sm" href="#/labs">${icon('terminal', 15)} CLI labs</a>
        </div>
      </div>
    </div>

    <div class="grid grid-4 mt">
      <div class="card stat"><span class="value">${doneCount}<span class="muted" style="font-size:1rem">/${content.lessons.length}</span></span><span class="label">Lessons completed</span>${bar(content.lessons.length ? (doneCount / content.lessons.length) * 100 : 0, 'thin')}</div>
      <div class="card stat"><span class="value">${attempted}<span class="muted" style="font-size:1rem">/${content.questions.length}</span></span><span class="label">Questions attempted</span>${bar(content.questions.length ? (attempted / content.questions.length) * 100 : 0, 'thin')}</div>
      <div class="card stat"><span class="value">${labsCompleted}<span class="muted" style="font-size:1rem">/${content.labs.length}</span></span><span class="label">CLI labs completed</span>${bar(content.labs.length ? (labsCompleted / content.labs.length) * 100 : 0, 'thin')}</div>
      <div class="card stat"><span class="value">${history.length ? Math.max(...history.map((h) => h.scaled)) : '—'}</span><span class="label">Best practice-exam score</span>${history.length ? html`<span class="small faint">${history.length} attempt${history.length === 1 ? '' : 's'}</span>` : html`<a class="small" href="#/exam">Take your first →</a>`}</div>
    </div>

    <div class="grid mt" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
      <div class="card">
        <div class="card-title"><h3>Domain mastery</h3><span class="small muted">accuracy · coverage</span></div>
        <div class="stack">${content.domains.map((d) => {
          const ms = d.topics.map((t) => mastery[t.id]).filter(Boolean);
          const seen = ms.reduce((s, m) => s + m.seen, 0);
          const acc = seen ? Math.round((ms.reduce((s, m) => s + m.correct, 0) / seen) * 100) : 0;
          const cov = Math.round((ms.reduce((s, m) => s + m.coverage, 0) / d.topics.length) * 100);
          return html`<a href="#/practice?domain=${d.id}" class="dom-${d.id}" style="color:inherit;text-decoration:none">
            <div class="row between small"><span class="dom-tag">D${d.id} ${d.title}</span><span class="muted">${d.weight}% of exam</span></div>
            <div class="row" style="gap:12px;flex-wrap:nowrap"><div style="flex:1">${bar(acc, 'dom')}</div><span class="small" style="width:92px;text-align:right">${seen ? `${acc}%` : '—'} · ${cov}% seen</span></div></a>`;
        })}</div>
      </div>
      <div class="card">
        <div class="card-title"><h3>${weak.length ? 'Weakest topics' : 'Not started yet'}</h3><a class="small" href="#/learn">Curriculum →</a></div>
        <div class="list">${weak.length ? weak.map(([t, m]) => html`
          <a class="list-item" href="#/practice?topic=${t}"><span class="badge ${m.percent < 60 ? 'badge-err' : m.percent < 80 ? 'badge-warn' : 'badge-ok'}">${m.percent}%</span>
            <span class="grow"><span class="title small">${t} ${content.topics.find((x) => x.id === t)?.title.slice(0, 70)}</span><span class="sub">${m.correct}/${m.seen} correct</span></span><span class="small">Drill →</span></a>`)
          : untouched.map((t) => html`<a class="list-item" href="#/topic/${t.id}"><span class="badge">${t.id}</span><span class="grow small">${topicLabel(t).slice(0, 90)}</span></a>`)}</div>
      </div>
    </div>

    <div class="grid mt" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
      <div class="card">
        <div class="card-title"><h3>Study activity</h3><span class="badge badge-ok">${streak(activity)} day streak</span></div>
        <div style="overflow-x:auto">${heatmap(activity)}</div>
      </div>
      <div class="card">
        <div class="card-title"><h3>Practice exam trend</h3><span class="small muted">dashed = ~825 estimate</span></div>
        ${history.length >= 2 ? sparkline(history.slice(0, 12).map((h) => h.scaled).reverse())
          : html`<p class="muted small mb0">Take two or more practice exams to see a trend line.</p>`}
      </div>
    </div>`);

  root.addEventListener('change', (e) => {
    if (e.target.dataset.examDate === undefined || !e.target.value) return;
    store.update('settings', (st) => ({ ...st, examDate: e.target.value }), {});
    ctx.navigate('#/plan');
  });
}
