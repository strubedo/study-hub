// Labs page: catalogue (#/labs) and workspace (#/labs/<id>).
import LABS from '../sim/labs/index.js';
import { DOMAINS, topicById } from '../../content/blueprint.js';
import { mountLab } from '../sim/ui.js';
import { h, DIFFICULTY_LABEL, fmtClock } from '../sim/ui-dom.js';

const TOPIC_TITLE_MAX = 64;

function shortTopic(topicId) {
  const t = topicById(topicId);
  if (!t) return `Topic ${topicId}`;
  const title = t.title.length > TOPIC_TITLE_MAX ? `${t.title.slice(0, TOPIC_TITLE_MAX - 1).trimEnd()}…` : t.title;
  return `${t.id} ${t.verb} ${title}`;
}

function domainOf(lab) {
  return Number(String(lab.topic ?? '').split('.')[0]) || 0;
}

function difficulty(level) {
  const n = Math.max(1, Math.min(3, Number(level) || 1));
  return h('span', { class: 'sim-diff', title: `Difficulty: ${DIFFICULTY_LABEL[n]}` },
    [1, 2, 3].map((i) => h('span', { class: `sim-dot${i <= n ? ' on' : ''}` })),
    h('span', { class: 'muted small' }, DIFFICULTY_LABEL[n]));
}

function statusBadge(lab, records, store) {
  const rec = records[lab.id];
  if (rec) {
    const best = Number.isFinite(rec.bestSeconds) ? ` · best ${fmtClock(rec.bestSeconds)}` : '';
    return h('span', { class: 'badge badge-ok' }, `✓ Completed${best}`);
  }
  if (store.get(`lab-state:${lab.id}`, null)) return h('span', { class: 'badge badge-accent' }, 'In progress');
  return null;
}

function labCard(lab, records, store) {
  return h('a', { class: 'card sim-lab-card', href: `#/labs/${encodeURIComponent(lab.id)}` },
    h('div', { class: 'sim-lab-card-top' },
      h('span', { class: 'badge' }, `Topic ${lab.topic}`),
      lab.troubleshooting ? h('span', { class: 'badge badge-warn' }, 'Troubleshooting') : null,
      lab.examEligible ? h('span', { class: 'badge', title: 'Can appear inside the exam simulator' }, 'Exam sim') : null),
    h('h3', { class: 'sim-lab-card-title' }, lab.title),
    h('p', { class: 'muted small sim-lab-card-topic' }, shortTopic(lab.topic)),
    lab.summary ? h('p', { class: 'sim-lab-card-summary' }, lab.summary) : null,
    h('div', { class: 'sim-lab-card-foot' },
      difficulty(lab.difficulty),
      h('span', { class: 'muted small' }, `${lab.minutes ?? '?'} min`),
      h('span', { class: 'sim-spacer' }),
      statusBadge(lab, records, store)));
}

function renderCatalogue(root, ctx) {
  const { store } = ctx;
  ctx.setTitle('CLI Labs');
  const records = store.get('labs', {}) ?? {};
  const done = LABS.filter((l) => records[l.id]).length;
  const pct = LABS.length ? Math.round((done / LABS.length) * 100) : 0;
  const troubleshooting = LABS.filter((l) => l.troubleshooting).length;

  const page = h('div', { class: 'page sim-catalogue' },
    h('div', { class: 'page-header' },
      h('div', {},
        h('div', { class: 'eyebrow' }, 'Hands-on practice'),
        h('h1', {}, 'CLI Labs'),
        h('p', {}, `${LABS.length} hands-on IOS / IOS-XE labs on a simulated network, including ${troubleshooting} troubleshooting scenario${troubleshooting === 1 ? '' : 's'} with pre-broken configs.`)),
      h('div', { class: 'sim-progress' },
        h('div', { class: 'small muted' }, `${done} of ${LABS.length} completed`),
        h('div', { class: 'bar' }, h('span', { style: `width:${pct}%` })))));

  DOMAINS.forEach((d) => {
    const labs = LABS.filter((l) => domainOf(l) === d.id)
      .sort((a, b) => String(a.topic).localeCompare(String(b.topic), undefined, { numeric: true }));
    if (!labs.length) return;
    page.append(h('section', { class: `sim-domain dom-${d.id}` },
      h('div', { class: 'sim-domain-head' },
        h('span', { class: 'dom-tag' }, `Domain ${d.id}`),
        h('h2', {}, d.title),
        h('span', { class: 'muted small' }, `${labs.filter((l) => records[l.id]).length}/${labs.length} done`)),
      h('div', { class: 'grid grid-auto' }, labs.map((l) => labCard(l, records, store)))));
  });

  if (!LABS.length) page.append(h('div', { class: 'card empty' }, h('h3', {}, 'No labs yet'), h('p', {}, 'Labs will appear here once they are added.')));
  root.append(page);
}

function renderNotFound(root, id, ctx) {
  ctx.setTitle('Lab not found');
  root.append(h('div', { class: 'page' },
    h('div', { class: 'card empty' },
      h('h3', {}, 'Lab not found'),
      h('p', {}, `There is no lab called “${id}”.`),
      h('a', { class: 'btn btn-primary', href: '#/labs' }, '← Back to all labs'))));
}

export async function render(root, params, ctx) {
  const id = params?.id;
  if (!id) {
    renderCatalogue(root, ctx);
    return undefined;
  }
  const lab = LABS.find((l) => l.id === id);
  if (!lab) {
    renderNotFound(root, id, ctx);
    return undefined;
  }
  ctx.setTitle(lab.title);
  ctx.setCrumbs?.([{ label: 'CLI Labs', href: '#/labs' }, { label: lab.title }]);
  const page = h('div', { class: 'page sim-page' },
    h('div', { class: 'sim-back' }, h('a', { href: '#/labs', class: 'btn btn-ghost btn-sm' }, '← All labs')));
  const host = h('div');
  page.append(host);
  root.append(page);
  const handle = mountLab(host, lab, {
    compact: false,
    store: ctx.store,
    md: ctx.md,
    onComplete: () => { try { ctx.logActivity?.(1); } catch (e) { console.error('[labs] logActivity failed', e); } },
  });
  return () => handle.destroy();
}
