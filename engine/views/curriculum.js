// Curriculum overview (#/learn) and topic detail (#/topic/<id>).
import { html, icon, bar, fmtMinutes, fmtDuration } from '../ui.js';
import { topicMastery } from '../lib/plan.js';
import { topicLabel } from '../content.js';
import { isMultiExam, examForDomain, weightText } from '../lib/exams.js';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function videoRow(v, watched) {
  return html`<a class="list-item" href="#/videos?play=${v.id}">
    <span class="badge ${watched ? 'badge-ok' : ''}">${v.kind === 'lab' ? 'Lab' : 'Video'}</span>
    <span class="grow"><span class="title small">${v.title}</span><span class="sub">${v.channel} · ${fmtDuration(v.seconds)}</span></span>${icon('play', 14)}</a>`;
}

/** "of the exam" for single-exam courses, "of AZ-800" when the course has several. */
const weightOf = (course, d) => (isMultiExam(course) ? `of ${examForDomain(course, d.id)?.code ?? 'the exam'}` : 'of the exam');

function topicCounts(course, content, t, lessonCount) {
  const parts = [
    `${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`,
    ...(course.videos ? [`${content.videosForTopic(t.id).length} videos`] : []),
    ...(course.labs ? [`${content.labsForTopic(t.id).length} labs`] : []),
    `${content.questionsForTopic(t.id).length} questions`,
  ];
  return parts.join(' · ');
}

function renderOverview(root, ctx) {
  const { content, store, course } = ctx;
  const done = store.get('lessonsDone', {});
  const mastery = topicMastery(content.questions, store.get('attempts', {}));
  const mapped = ['lessons', ...(course.videos ? ['videos'] : []), ...(course.labs ? ['labs'] : [])].join(', ');
  root.innerHTML = String(html`
    <div class="page-header"><div><div class="eyebrow">Curriculum</div><h1>${course.title} blueprint</h1>
      <p>Every official exam topic, with ${mapped} and practice questions mapped to it.</p></div></div>
    <div class="stack">${content.domains.map((d) => {
      const lessons = content.lessons.filter((l) => l.domain === d.id);
      const finished = lessons.filter((l) => done[l.id]).length;
      const minutes = lessons.reduce((s, l) => s + l.minutes, 0);
      return html`<section class="card dom-card dom-${d.id}">
        <div class="card-title">
          <div><span class="dom-tag">Domain ${d.id} · ${weightText(d)} ${weightOf(course, d)}</span><h2 style="margin-top:4px">${d.title}</h2>
            <span class="small muted">${lessons.length} lessons · ${fmtMinutes(minutes)} reading · ${content.banks[d.id].length} questions</span></div>
          <div style="width:180px">${bar(lessons.length ? (finished / lessons.length) * 100 : 0, 'dom')}<div class="small muted" style="text-align:right">${finished}/${lessons.length} lessons done</div></div>
        </div>
        <div class="list">${d.topics.map((t) => {
          const m = mastery[t.id];
          const tl = content.lessonsForTopic(t.id);
          const tDone = tl.filter((l) => done[l.id]).length;
          return html`<a class="list-item" href="#/topic/${t.id}">
            <span class="badge" style="min-width:40px;justify-content:center">${t.id}</span>
            <span class="grow"><span class="title small"><span class="muted">${t.verb}</span> ${t.title}</span>
              <span class="sub">${topicCounts(course, content, t, tl.length)}</span></span>
            ${m?.seen ? html`<span class="badge ${m.percent >= 80 ? 'badge-ok' : m.percent >= 60 ? 'badge-warn' : 'badge-err'}">${m.percent}%</span>` : ''}
            ${tl.length && tDone === tl.length ? html`<span class="done-mark on">${icon('check', 12)}</span>` : html`<span class="done-mark"></span>`}
          </a>`;
        })}</div>
      </section>`;
    })}</div>`);
}

function labsCard(course, labs, labsDone) {
  if (!course.labs) return '';
  const { route, label } = course.labs;
  return html`<div class="card"><h3>${capitalize(label)}</h3>${labs.length ? html`<div class="list">${labs.map((l) => html`
    <a class="list-item" href="#/${route}/${l.id}"><span class="badge ${labsDone[l.id]?.completedAt ? 'badge-ok' : ''}">${labsDone[l.id]?.completedAt ? 'Done' : 'Lab'}</span>
      <span class="grow"><span class="title small">${l.title}</span><span class="sub">${l.minutes} min · ${l.summary}</span></span></a>`)}</div>`
    : html`<p class="muted small mb0">No hands-on lab for this topic. It is a describe/interpret objective, so focus on lessons and questions.</p>`}</div>`;
}

function renderTopic(root, id, ctx) {
  const { content, store, course } = ctx;
  const topic = content.topicById(id);
  if (!topic) { root.innerHTML = '<div class="empty"><h3>Unknown topic</h3><a href="#/learn">Back to curriculum</a></div>'; return; }
  const domain = content.domainById(topic.domain);
  const done = store.get('lessonsDone', {});
  const watched = store.get('videosWatched', {});
  const labsDone = store.get('labs', {});
  const m = topicMastery(content.questionsForTopic(id), store.get('attempts', {}))[id];
  const lessons = content.lessonsForTopic(id);
  const videos = content.videosForTopic(id);
  const labs = content.labsForTopic(id);
  const qCount = content.questionsForTopic(id).length;
  ctx.setCrumbs([{ label: 'Curriculum', href: '#/learn' }, { label: `Domain ${domain.id}`, href: '#/learn' }, { label: topic.id }]);
  ctx.setTitle(`${topic.id} ${topic.verb ?? topic.title}`);

  root.innerHTML = String(html`
    <div class="page-header dom-${domain.id}"><div><span class="dom-tag">Domain ${domain.id} · ${domain.title}</span>
      <h1 style="margin-top:6px">${topic.id} · ${topicLabel(topic)}</h1>
      ${topic.sub ? html`<div class="chips mt">${topic.sub.map((s, i) => html`<span class="badge">${topic.id}.${'abcdefg'[i]} ${s}</span>`)}</div>` : ''}</div>
      <a class="btn btn-primary" href="#/practice?topic=${id}" ${qCount ? '' : 'disabled'}>${icon('quiz')} Practice ${qCount} questions</a></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));align-items:start">
      <div class="stack">
        <div class="card"><h3>Lessons</h3><div class="list">${lessons.length ? lessons.map((l) => html`
          <a class="list-item" href="#/lesson/${l.id}"><span class="done-mark ${done[l.id] ? 'on' : ''}">${done[l.id] ? icon('check', 12) : ''}</span>
            <span class="grow"><span class="title">${l.title}</span><span class="sub">${l.minutes} min · ${l.objectives.length} objectives</span></span>${icon('arrowRight', 16)}</a>`)
          : html`<p class="muted mb0">Lesson in progress.</p>`}</div></div>
        ${labsCard(course, labs, labsDone)}
      </div>
      <div class="stack">
        <div class="card"><h3>Your performance</h3>
          ${m?.seen ? html`<div class="row" style="gap:24px"><div class="stat"><span class="value">${m.percent}%</span><span class="label">accuracy (${m.correct}/${m.seen})</span></div>
            <div class="stat"><span class="value">${Math.round(m.coverage * 100)}%</span><span class="label">of this topic's bank attempted</span></div></div>`
          : html`<p class="muted small mb0">No questions answered on this topic yet.</p>`}</div>
        ${course.videos ? html`<div class="card"><h3>Videos</h3>${videos.length ? html`<div class="list">${videos.map((v) => videoRow(v, watched[v.id]))}</div>`
          : html`<p class="muted small mb0">The video course doesn't cover this topic directly. The lesson here is your primary source.</p>`}</div>` : ''}
      </div>
    </div>`);
}

export async function render(root, params, ctx) {
  if (params.head === 'topic' && params.id) renderTopic(root, params.id, ctx);
  else renderOverview(root, ctx);
}
