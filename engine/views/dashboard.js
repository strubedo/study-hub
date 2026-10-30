// Dashboard: readiness, next steps, domain mastery, weak topics, activity.
// Multi-exam courses get one readiness ring, score and trend line per exam.
import { html, icon, ring, bar, todayIso } from '../ui.js';
import { topicMastery, daysBetween, addDays } from '../lib/plan.js';
import { topicLabel } from '../content.js';
import { isDue } from '../lib/srs.js';
import { isMultiExam, examDomains, examReadiness, examDateFor, historyFor, weightText } from '../lib/exams.js';

const HEATMAP_WEEKS = 18;
const WEAK_MIN_SEEN = 3;
const SPARK_POINTS = 12;

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

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

function sparkline(values, { min, max, pass }) {
  if (values.length < 2) return '';
  const w = 220;
  const h = 56;
  const y = (v) => h - ((v - min) / (max - min)) * h;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${y(v)}`).join(' ');
  return html`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible">
    ${pass !== undefined ? html`<line x1="0" x2="${w}" y1="${y(pass)}" y2="${y(pass)}" stroke="var(--border-strong)" stroke-dasharray="4 4"/>` : ''}
    <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
}

const best = (history) => (history.length ? Math.max(...history.map((h) => h.scaled)) : null);

function readinessCopy(ready, attempted) {
  return ready >= 80 ? 'Strong across the blueprint. Keep taking full practice exams.'
    : ready >= 55 ? 'Good progress. Close the gaps in your weakest domains.'
      : attempted < 30 ? 'Answer more questions to get a reliable estimate.' : 'Keep building. Focus on lessons + topic drills.';
}

function examDateLine(course, settings) {
  if (isMultiExam(course)) {
    return html`${course.exams.map((e, i) => {
      const date = examDateFor(course, settings, e);
      const days = date ? daysBetween(todayIso(), date) : null;
      return html`${i ? ' · ' : ''}<strong>${e.code}</strong> ${days === null ? 'not scheduled' : days >= 0 ? `in ${days} days` : 'date passed'}`;
    })} <a class="small" href="#/settings">Set exam dates →</a>`;
  }
  const exam = course.exams[0];
  const date = examDateFor(course, settings, exam);
  if (date) {
    const days = daysBetween(todayIso(), date);
    return days >= 0 ? `${days} days until your exam.` : 'Your exam date has passed. Update it in settings.';
  }
  return html`<label class="row small" style="gap:8px;display:inline-flex">Exam date:
    <input type="date" data-exam-date min="${todayIso()}" style="width:auto;padding:5px 9px">
    <span class="faint">sets your countdown and week-by-week plan${exam.dateHint ? ` (${exam.dateHint})` : ''}</span></label>`;
}

function readinessCard(course, mastery, attempted) {
  if (!isMultiExam(course)) {
    const ready = examReadiness(course, course.exams[0], mastery);
    return html`<div class="card row" style="gap:24px;align-items:center;flex-wrap:nowrap">
      ${ring(ready, { label: 'readiness' })}
      <div><h3>Exam readiness</h3><p class="muted small mb0">${readinessCopy(ready, attempted)}</p>
        <p class="faint small mb0" style="margin-top:6px">Blueprint-weighted accuracy, discounted until you've covered each domain's bank.</p></div>
    </div>`;
  }
  const scores = course.exams.map((e) => ({ exam: e, ready: examReadiness(course, e, mastery) }));
  const lowest = Math.min(...scores.map((s) => s.ready));
  return html`<div class="card">
    <h3>Exam readiness</h3>
    <div class="row" style="gap:18px;margin-bottom:10px">${scores.map((s) => ring(s.ready, { size: 104, stroke: 9, label: s.exam.code }))}</div>
    <p class="muted small mb0">${readinessCopy(lowest, attempted)}</p>
    <p class="faint small mb0" style="margin-top:6px">Each exam is scored on its own domains: blueprint-weighted accuracy, discounted until you've covered each domain's bank.</p>
  </div>`;
}

function bestScoreCard(course, history) {
  if (!isMultiExam(course)) {
    const top = best(history);
    return html`<div class="card stat"><span class="value">${top ?? '—'}</span><span class="label">Best practice-exam score</span>${history.length ? html`<span class="small faint">${history.length} attempt${history.length === 1 ? '' : 's'}</span>` : html`<a class="small" href="#/exam">Take your first →</a>`}</div>`;
  }
  return html`<div class="card stat"><span class="value" style="font-size:1.2rem">${course.exams.map((e, i) => html`${i ? ' · ' : ''}${e.code} ${best(historyFor(course, history, e)) ?? '—'}`)}</span>
    <span class="label">Best practice-exam scores</span>${history.length ? html`<span class="small faint">${history.length} attempt${history.length === 1 ? '' : 's'}</span>` : html`<a class="small" href="#/exam">Take your first →</a>`}</div>`;
}

function domainRow(d, mastery, weightLabel) {
  const ms = d.topics.map((t) => mastery[t.id]).filter(Boolean);
  const seen = ms.reduce((s, m) => s + m.seen, 0);
  const acc = seen ? Math.round((ms.reduce((s, m) => s + m.correct, 0) / seen) * 100) : 0;
  const cov = Math.round((ms.reduce((s, m) => s + m.coverage, 0) / d.topics.length) * 100);
  return html`<a href="#/practice?domain=${d.id}" class="dom-${d.id}" style="color:inherit;text-decoration:none">
    <div class="row between small"><span class="dom-tag">D${d.id} ${d.title}</span><span class="muted">${weightText(d)} of ${weightLabel}</span></div>
    <div class="row" style="gap:12px;flex-wrap:nowrap"><div style="flex:1">${bar(acc, 'dom')}</div><span class="small" style="width:92px;text-align:right">${seen ? `${acc}%` : '—'} · ${cov}% seen</span></div></a>`;
}

function masteryCard(course, mastery) {
  const body = isMultiExam(course)
    ? course.exams.map((e) => html`<div class="small muted" style="font-weight:650">${e.code}${e.name ? ` · ${e.name}` : ''}</div>
        ${examDomains(course, e).map((d) => domainRow(d, mastery, e.code))}`)
    : course.domains.map((d) => domainRow(d, mastery, 'exam'));
  return html`<div class="card">
    <div class="card-title"><h3>Domain mastery</h3><span class="small muted">accuracy · coverage</span></div>
    <div class="stack">${body}</div>
  </div>`;
}

function trendCard(course, history) {
  const trend = (exam, list) => (list.length >= 2 ? sparkline(list.slice(0, SPARK_POINTS).map((h) => h.scaled).reverse(), exam.scale)
    : html`<p class="muted small mb0">Take two or more practice exams${isMultiExam(course) ? ` for ${exam.code}` : ''} to see a trend line.</p>`);
  const legend = course.exams[0].scale.trendLabel;
  return html`<div class="card">
    <div class="card-title"><h3>Practice exam trend</h3>${legend ? html`<span class="small muted">dashed = ${legend}</span>` : ''}</div>
    ${isMultiExam(course)
      ? html`<div class="stack">${course.exams.map((e) => html`<div><div class="small muted" style="font-weight:650">${e.code}</div>${trend(e, historyFor(course, history, e))}</div>`)}</div>`
      : trend(course.exams[0], history)}
  </div>`;
}

export async function render(root, params, ctx) {
  const { content, store, course } = ctx;
  const attempts = store.get('attempts', {});
  const lessonsDone = store.get('lessonsDone', {});
  const labsDone = store.get('labs', {});
  const history = store.get('examHistory', []);
  const srs = store.get('srs', {});
  const activity = store.get('activity', {});
  const settings = store.get('settings', {});

  const mastery = topicMastery(content.questions, attempts);
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
  const quickLinks = course.dashboard?.quickLinks ?? [];

  root.innerHTML = String(html`
    <div class="page-header">
      <div><div class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <h1>Your ${course.shortName} study hub</h1>
      <p>${examDateLine(course, settings)}</p></div>
      <div class="row"><a class="btn" href="#/practice">${icon('quiz')} Quick quiz</a><a class="btn btn-primary" href="#/exam">${icon('exam')} Practice exam</a></div>
    </div>

    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))">
      ${readinessCard(course, mastery, attempted)}
      <div class="card">
        <h3>Up next</h3>
        ${nextLesson ? html`<a class="list-item" href="#/lesson/${nextLesson.id}" style="padding-left:0">
            <span class="grow"><span class="title">${nextLesson.title}</span><span class="sub">Topic ${nextLesson.topic} · ${nextLesson.minutes} min read</span></span>${icon('arrowRight')}</a>`
          : html`<p class="muted">Every lesson is complete. Focus on exams${course.labs ? ' and labs' : ''}.</p>`}
        <div class="row mt">
          <a class="btn btn-sm" href="#/flashcards">${icon('cards', 15)} ${dueCards} due${newCards ? ` · ${newCards} new` : ''}</a>
          ${quickLinks.map((q) => html`<a class="btn btn-sm" href="${q.href}">${icon(q.icon, 15)} ${q.label}</a>`)}
        </div>
      </div>
    </div>

    <div class="grid ${course.labs ? 'grid-4' : 'grid-3'} mt">
      <div class="card stat"><span class="value">${doneCount}<span class="muted" style="font-size:1rem">/${content.lessons.length}</span></span><span class="label">Lessons completed</span>${bar(content.lessons.length ? (doneCount / content.lessons.length) * 100 : 0, 'thin')}</div>
      <div class="card stat"><span class="value">${attempted}<span class="muted" style="font-size:1rem">/${content.questions.length}</span></span><span class="label">Questions attempted</span>${bar(content.questions.length ? (attempted / content.questions.length) * 100 : 0, 'thin')}</div>
      ${course.labs ? html`<div class="card stat"><span class="value">${labsCompleted}<span class="muted" style="font-size:1rem">/${content.labs.length}</span></span><span class="label">${capitalize(course.labs.label)} completed</span>${bar(content.labs.length ? (labsCompleted / content.labs.length) * 100 : 0, 'thin')}</div>` : ''}
      ${bestScoreCard(course, history)}
    </div>

    <div class="grid mt" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
      ${masteryCard(course, mastery)}
      <div class="card">
        <div class="card-title"><h3>${weak.length ? 'Weakest topics' : 'Not started yet'}</h3><a class="small" href="#/learn">Curriculum →</a></div>
        <div class="list">${weak.length ? weak.map(([t, m]) => html`
          <a class="list-item" href="#/practice?topic=${t}"><span class="badge ${m.percent < 60 ? 'badge-err' : m.percent < 80 ? 'badge-warn' : 'badge-ok'}">${m.percent}%</span>
            <span class="grow"><span class="title small">${t} ${content.topicById(t)?.title.slice(0, 70)}</span><span class="sub">${m.correct}/${m.seen} correct</span></span><span class="small">Drill →</span></a>`)
          : untouched.map((t) => html`<a class="list-item" href="#/topic/${t.id}"><span class="badge">${t.id}</span><span class="grow small">${topicLabel(t).slice(0, 90)}</span></a>`)}</div>
      </div>
    </div>

    <div class="grid mt" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));align-items:start">
      <div class="card">
        <div class="card-title"><h3>Study activity</h3><span class="badge badge-ok">${streak(activity)} day streak</span></div>
        <div style="overflow-x:auto">${heatmap(activity)}</div>
      </div>
      ${trendCard(course, history)}
    </div>`);

  root.addEventListener('change', (e) => {
    if (e.target.dataset.examDate === undefined || !e.target.value) return;
    store.update('settings', (st) => ({ ...st, examDate: e.target.value }), {});
    ctx.navigate('#/plan');
  });
}
