// Lesson reader (#/lesson/<id>): markdown body, objectives, related videos/labs, completion.
import { html, raw, icon, md, fmtDuration } from '../ui.js';
import { loadLessonMarkdown } from '../content.js';
import { setDone } from '../progress.js';

export function youtubeEmbed(id) {
  return html`<iframe class="player" src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1" title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

export async function render(root, params, ctx) {
  const { content, store, course } = ctx;
  const lesson = content.lessonById.get(params.id);
  if (!lesson) {
    root.innerHTML = '<div class="empty"><h3>Lesson not found</h3><a href="#/learn">Back to curriculum</a></div>';
    return;
  }
  const domain = content.domainById(lesson.domain);
  const idx = content.lessons.indexOf(lesson);
  const prev = content.lessons[idx - 1];
  const next = content.lessons[idx + 1];
  ctx.setCrumbs([{ label: 'Curriculum', href: '#/learn' }, { label: `Topic ${lesson.topic}`, href: `#/topic/${lesson.topic}` }, { label: lesson.title }]);
  ctx.setTitle(lesson.title);

  let body;
  try {
    body = md(await loadLessonMarkdown(course, lesson));
  } catch (e) {
    body = String(html`<div class="card flat"><strong>Could not load this lesson.</strong><p class="muted small mb0">${e.message}</p></div>`);
  }
  const videos = content.videosForTopic(lesson.topic).filter((v) => !v.legacy);
  const labsRoute = course.labs?.route;
  const labs = labsRoute ? content.labsForTopic(lesson.topic) : [];
  const qCount = content.questionsForTopic(lesson.topic).length;

  const draw = () => {
    const done = Boolean(store.get('lessonsDone', {})[lesson.id]);
    root.innerHTML = String(html`
      <div class="grid" style="grid-template-columns:minmax(0,1fr) 300px;gap:32px;align-items:start" id="lesson-grid">
        <article>
          <div class="dom-${domain.id}"><span class="dom-tag">Domain ${domain.id} · Topic ${lesson.topic}</span></div>
          <h1 style="margin-top:8px">${lesson.title}</h1>
          <p class="muted">${icon('clock', 15)} ${lesson.minutes} min read</p>
          <div class="card flat" style="margin:18px 0 8px;max-width:78ch">
            <h3>You will be able to</h3>
            <ul style="margin:0;padding-left:1.2em">${lesson.objectives.map((o) => html`<li>${o}</li>`)}</ul>
          </div>
          <div class="prose">${raw(body)}</div>
          <div class="card mt" style="max-width:78ch">
            <div class="row between">
              <button class="btn ${done ? '' : 'btn-primary'}" data-act="done">${icon('check')} ${done ? 'Completed. Mark as unread' : 'Mark lesson complete'}</button>
              <a class="btn" href="#/practice?topic=${lesson.topic}">${icon('quiz')} Practice topic ${lesson.topic} (${qCount})</a>
            </div>
          </div>
          <div class="row between mt" style="max-width:78ch">
            ${prev ? html`<a class="btn btn-ghost" href="#/lesson/${prev.id}">${icon('arrowLeft')} ${prev.title}</a>` : html`<span></span>`}
            ${next ? html`<a class="btn btn-ghost" href="#/lesson/${next.id}">${next.title} ${icon('arrowRight')}</a>` : ''}
          </div>
        </article>
        <aside class="stack" style="position:sticky;top:80px">
          ${videos.length ? html`<div class="card" style="padding:14px"><h3>Watch</h3>${youtubeEmbed(videos[0].id)}
            <p class="small" style="margin:8px 0 0"><strong>${videos[0].title}</strong><br><span class="muted">${videos[0].channel} · ${fmtDuration(videos[0].seconds)}</span></p>
            ${videos.length > 1 ? html`<div class="list mt">${videos.slice(1, 6).map((v) => html`<a class="list-item small" href="#/videos?play=${v.id}">${icon('play', 12)}<span class="grow">${v.title}</span></a>`)}</div>` : ''}
          </div>` : ''}
          ${labs.length ? html`<div class="card" style="padding:14px"><h3>Hands-on</h3><div class="list">${labs.map((l) => html`
            <a class="list-item small" href="#/${labsRoute}/${l.id}">${icon('terminal', 15)}<span class="grow">${l.title}</span></a>`)}</div></div>` : ''}
        </aside>
      </div>`);
  };

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="done"]')) {
      const done = Boolean(store.get('lessonsDone', {})[lesson.id]);
      setDone('lessonsDone', lesson.id, !done);
      if (!done) ctx.logActivity(3);
      draw();
    }
  });
  draw();

  const mq = window.matchMedia('(max-width: 1100px)');
  const applyLayout = () => {
    const grid = root.querySelector('#lesson-grid');
    if (grid) grid.style.gridTemplateColumns = mq.matches ? '1fr' : 'minmax(0,1fr) 300px';
    const aside = root.querySelector('aside');
    if (aside) aside.style.position = mq.matches ? 'static' : 'sticky';
  };
  applyLayout();
  mq.addEventListener('change', applyLayout);
  return () => mq.removeEventListener('change', applyLayout);
}
