// Week-by-week study plan generated from the exam date and lesson lengths.
// Multi-exam courses plan one exam at a time (its domains' lessons, its date) or all of them.
import { html, icon, bar, todayIso, fmtMinutes } from '../ui.js';
import { buildPlan, daysBetween } from '../lib/plan.js';
import { setDone } from '../progress.js';
import { isMultiExam, examById, examDateFor, datedExams } from '../lib/exams.js';

const ALL_EXAMS = 'all';

function defaultReviewTasks(course) {
  return [
    ['Take two full timed practice exams in strict mode.', '#/exam'],
    ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
    ['Clear every due flashcard each day this week.', '#/flashcards'],
    ...(course.reference ? [['Skim the Reference cheat sheets.', '#/reference']] : []),
  ];
}

/** Which lessons and exam date this plan covers. Single-exam courses: everything, `settings.examDate`. */
function planScope(course, content, settings, choice) {
  if (!isMultiExam(course)) return { lessons: content.lessons, examDate: examDateFor(course, settings, course.exams[0]), label: '' };
  if (choice === ALL_EXAMS) {
    const dated = datedExams(course, settings);
    return { lessons: content.lessons, examDate: dated[dated.length - 1]?.date, label: 'all exams' };
  }
  const exam = examById(course, choice);
  return { lessons: content.lessons.filter((l) => exam.domains.includes(l.domain)), examDate: examDateFor(course, settings, exam), label: exam.code };
}

export async function render(root, params, ctx) {
  const { content, store, course } = ctx;
  const settings = store.get('settings', {});
  const start = settings.planStart ?? todayIso();
  const multi = isMultiExam(course);
  const reviewTasks = course.plan?.reviewTasks ?? defaultReviewTasks(course);
  const labsRoute = course.labs?.route;
  let choice = multi ? store.get('planExam', course.exams[0].id) : null;
  const today = todayIso();

  const draw = () => {
    const scope = planScope(course, content, settings, choice);
    const plan = buildPlan({ lessons: scope.lessons, start, examDate: scope.examDate });
    const done = store.get('lessonsDone', {});
    const labsDone = store.get('labs', {});
    const currentIdx = plan.weeks.findIndex((w) => today >= w.start && today <= w.end);
    root.innerHTML = String(html`
      <div class="page-header">
        <div><div class="eyebrow">Study plan</div><h1>${plan.totalWeeks}-week plan${scope.label ? ` · ${scope.label}` : ''}</h1>
          <p>Starts ${start}${scope.examDate ? `, exam ${scope.examDate}` : ' (no exam date set, so the default is 12 weeks)'}. Lessons are spread by reading time; the final week is pure review.</p></div>
        <a class="btn" href="#/settings">${icon('settings')} Change dates</a>
      </div>
      ${multi ? html`<div class="seg" style="margin-bottom:16px">${[...course.exams.map((e) => [e.id, e.code]), [ALL_EXAMS, 'All exams']].map(([id, label]) => html`
        <button class="${choice === id ? 'active' : ''}" data-plan-exam="${id}">${label}</button>`)}</div>` : ''}
      ${scope.examDate && daysBetween(start, scope.examDate) < 28 ? html`<div class="card flat" style="border-color:var(--warn);margin-bottom:16px">
        <strong>Tight timeline.</strong> <span class="muted">Fewer than 4 weeks between your plan start and exam. Most candidates need 8–16 weeks; consider a later date.</span></div>` : ''}
      <div class="stack">${plan.weeks.map((w, i) => {
        const lessons = w.lessons.map((id) => content.lessonById.get(id)).filter(Boolean);
        const finished = lessons.filter((l) => done[l.id]).length;
        const topics = [...new Set(lessons.map((l) => l.topic))];
        const labs = content.labs.filter((l) => topics.includes(l.topic));
        const isCurrent = i === currentIdx;
        return html`<div class="card ${isCurrent ? '' : 'flat'}" style="${isCurrent ? 'border-color:var(--accent)' : ''}">
          <div class="card-title">
            <div><h3>Week ${w.index} ${w.kind === 'review' ? '· Final review' : ''} ${isCurrent ? html`<span class="badge badge-accent">This week</span>` : ''}</h3>
              <span class="small muted">${w.start} → ${w.end}${w.minutes ? ` · ${fmtMinutes(w.minutes)} reading` : ''}</span></div>
            ${lessons.length ? html`<div style="width:160px">${bar((finished / lessons.length) * 100, 'thin')}<div class="small muted" style="text-align:right">${finished}/${lessons.length} lessons</div></div>` : ''}
          </div>
          ${w.kind === 'review' ? html`<div class="list">${reviewTasks.map(([t, href]) => html`<a class="list-item" href="${href}"><span class="grow small">${t}</span>${icon('arrowRight', 16)}</a>`)}</div>` : html`
          <div class="list">${lessons.map((l) => html`<div class="list-item">
            <button class="done-mark ${done[l.id] ? 'on' : ''}" data-toggle="${l.id}" aria-label="Toggle complete" style="cursor:pointer;background:${done[l.id] ? '' : 'none'}">${done[l.id] ? icon('check', 12) : ''}</button>
            <a class="grow" href="#/lesson/${l.id}" style="color:inherit"><span class="title">${l.title}</span><span class="sub"> · Topic ${l.topic} · ${l.minutes} min</span></a>
            <span class="dom-tag dom-${l.domain}">D${l.domain}</span></div>`)}</div>
          <div class="row small mt">
            <span class="muted">Then practice:</span>
            ${topics.map((t) => html`<a class="chip" href="#/practice?topic=${t}">Quiz ${t}</a>`)}
            ${labsRoute ? labs.map((l) => html`<a class="chip ${labsDone[l.id]?.completedAt ? 'on' : ''}" href="#/${labsRoute}/${l.id}">${icon('terminal', 13)} ${l.title}</a>`) : ''}
          </div>`}
        </div>`;
      })}</div>`);
  };

  root.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-plan-exam]');
    if (pick) {
      choice = pick.dataset.planExam;
      store.set('planExam', choice);
      draw();
      return;
    }
    const b = e.target.closest('[data-toggle]');
    if (!b) return;
    const id = b.dataset.toggle;
    const nowDone = !store.get('lessonsDone', {})[id];
    setDone('lessonsDone', id, nowDone);
    if (nowDone) ctx.logActivity();
    draw();
  });
  draw();
}
