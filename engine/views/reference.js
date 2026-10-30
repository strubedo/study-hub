// Reference cheat sheets rendered from the course's reference module (course.js `reference`).
import { html, raw, md, toast } from '../ui.js';
import { courseUrl } from '../course.js';

export async function render(root, params, ctx) {
  let sections;
  try {
    sections = (await import(courseUrl(ctx.course, ctx.course.reference))).default;
  } catch (e) {
    console.error('[reference] could not load the cheat sheets', e);
    toast('The reference sheets could not be loaded.', 'err');
    root.innerHTML = String(html`<div class="card"><h3>Reference unavailable</h3><p class="muted small mb0">${e.message}</p></div>`);
    return;
  }
  let active = params.query.s ?? 'all';

  function draw() {
    const shown = active === 'all' ? sections : sections.filter((s) => s.id === active);
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Reference</div><h1>Cheat sheets</h1>
        <p>The numbers and tables the exam expects you to know cold.</p></div></div>
      <div class="chips" style="margin-bottom:18px">
        <button class="chip ${active === 'all' ? 'on' : ''}" data-s="all">All</button>
        ${sections.map((s) => html`<button class="chip ${active === s.id ? 'on' : ''}" data-s="${s.id}">${s.title}</button>`)}
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,460px),1fr));align-items:start">
        ${shown.map((s) => html`<section class="card" id="ref-${s.id}">
          <div class="card-title"><h3>${s.title}</h3><a class="badge" href="#/topic/${s.topic}">Topic ${s.topic}</a></div>
          <div class="table-wrap"><table class="ref-table">
            <thead><tr>${s.columns.map((c) => html`<th>${c}</th>`)}</tr></thead>
            <tbody>${s.rows.map((r) => html`<tr>${r.map((cell) => html`<td>${raw(md(cell, { inline: true }))}</td>`)}</tr>`)}</tbody>
          </table></div>
          ${s.note ? html`<p class="small muted mb0 mt">${raw(md(s.note, { inline: true }))}</p>` : ''}
        </section>`)}
      </div>`);
  }

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]');
    if (!b) return;
    active = b.dataset.s;
    draw();
  });
  draw();
}
