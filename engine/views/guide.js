// Exam guide (#/guide): renders the course's guide module (course.js `guide`).
// The module's default export is page data, or a function ({ today, daysBetween, course })
// returning it, for content that depends on today's date. Strings are inline markdown.
//
// Page: { eyebrow, title, intro, action?: { label, href }, stats?: [[value, label]], rows: [[card, card?]] }
// Card: { title, intro?, accent?, note?, blocks: [block] }
// Block types: text { md } · table { columns, rows } · domains { columns } (the course's domain weights)
//              list { items: [[title, text]] } · badges { kind, align?, items: [[badge, text]] } · grid { items: [[title, text]] }
import { html, raw, md, icon, toast, todayIso } from '../ui.js';
import { courseUrl } from '../course.js';
import { daysBetween } from '../lib/plan.js';

const inline = (s) => raw(md(s, { inline: true }));

function table(columns, rows) {
  return html`<div class="table-wrap"><table class="ref-table">
    <thead><tr>${columns.map((c) => html`<th>${c}</th>`)}</tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

function block(b, course, i) {
  const spaced = (inner) => (i ? html`<div class="mt">${inner}</div>` : inner);
  switch (b.type) {
    case 'text': return html`<p class="mb0">${inline(b.md)}</p>`;
    case 'table': return spaced(table(b.columns, b.rows.map((r) => html`<tr>${r.map((cell) => html`<td>${inline(cell)}</td>`)}</tr>`)));
    case 'domains': return spaced(table(b.columns, course.domains.map((d) => html`<tr><td><span class="dom-tag dom-${d.id}">D${d.id}</span> ${d.title}</td><td>${d.weightRange ?? d.weight}</td></tr>`)));
    case 'list': return html`<div class="list">${b.items.map(([t, d]) => html`<div class="list-item"><span class="grow"><span class="title">${inline(t)}</span><span class="sub">${inline(d)}</span></span></div>`)}</div>`;
    case 'badges': return html`<div class="list">${b.items.map(([badge, d]) => html`
      <div class="list-item"><span class="badge badge-${b.kind ?? 'accent'}" style="${b.align ? 'min-width:84px;justify-content:center' : ''}">${badge}</span><span class="grow small">${inline(d)}</span></div>`)}</div>`;
    case 'grid': return html`<div class="grid grid-2">${b.items.map(([t, d]) => html`<div><strong>${inline(t)}</strong><p class="small muted mb0">${inline(d)}</p></div>`)}</div>`;
    default:
      console.error(`[guide] unknown block type "${b.type}"`);
      return '';
  }
}

function card(c, course) {
  return html`<div class="card" style="${c.accent ? 'border-color:var(--accent)' : ''}">
    <h3>${c.title}</h3>
    ${c.intro ? html`<p class="small muted">${inline(c.intro)}</p>` : ''}
    ${c.blocks.map((b, i) => block(b, course, i))}
    ${c.note ? html`<p class="small muted mb0 mt">${inline(c.note)}</p>` : ''}
  </div>`;
}

function row(cards, course) {
  if (cards.length === 1) return html`<div class="mt">${card(cards[0], course)}</div>`;
  return html`<div class="grid grid-2 mt" style="align-items:start">${cards.map((c) => card(c, course))}</div>`;
}

export async function render(root, params, ctx) {
  const { course } = ctx;
  let page;
  try {
    const mod = await import(courseUrl(course, course.guide));
    page = typeof mod.default === 'function' ? mod.default({ today: todayIso(), daysBetween, course }) : mod.default;
  } catch (e) {
    console.error('[guide] could not load the exam guide', e);
    toast('The exam guide could not be loaded.', 'err');
    root.innerHTML = String(html`<div class="card"><h3>Exam guide unavailable</h3><p class="muted small mb0">${e.message}</p></div>`);
    return;
  }
  root.innerHTML = String(html`
    <div class="page-header"><div><div class="eyebrow">${page.eyebrow ?? 'Exam guide'}</div><h1>${page.title}</h1>
      ${page.intro ? html`<p>${page.intro}</p>` : ''}</div>
      ${page.action ? html`<a class="btn" href="${page.action.href}" target="_blank" rel="noopener">${icon('external')} ${page.action.label}</a>` : ''}</div>
    ${page.stats?.length ? html`<div class="grid grid-4">${page.stats.map(([v, l]) => html`<div class="card stat"><span class="value">${v}</span><span class="label">${l}</span></div>`)}</div>` : ''}
    ${(page.rows ?? []).map((r) => row(r, course))}`);
  // Markdown links in guide copy point off-site; open them in a new tab like the page's own links.
  root.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
}
