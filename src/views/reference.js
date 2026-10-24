// Reference cheat sheets rendered from content/reference.js.
import { html, raw, md } from '../ui.js';
import sections from '../../content/reference.js';

export async function render(root, params) {
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
