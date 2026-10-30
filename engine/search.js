// Global search palette (Ctrl+K) over everything in the loaded course.
import { esc, openModal } from './ui.js';

function searchIndex(course, content) {
  const items = [];
  const labsRoute = course.labs?.route;
  content.lessons.forEach((l) => items.push({ kind: 'Lesson', title: l.title, sub: `Topic ${l.topic}`, href: `#/lesson/${l.id}`, text: `${l.title} ${(l.objectives ?? []).join(' ')}` }));
  content.topics.forEach((t) => items.push({ kind: 'Topic', title: `${t.id} ${t.verb ?? ''} ${t.title}`, sub: `Domain ${t.domain}`, href: `#/topic/${t.id}`, text: `${t.id} ${t.title} ${(t.sub ?? []).join(' ')}` }));
  if (labsRoute) content.labs.forEach((l) => items.push({ kind: 'Lab', title: l.title, sub: `Topic ${l.topic}`, href: `#/${labsRoute}/${l.id}`, text: `${l.title} ${l.summary ?? ''}` }));
  content.videos.forEach((v) => items.push({ kind: 'Video', title: v.title, sub: v.channel, href: `#/videos?play=${v.id}`, text: v.title }));
  content.questions.forEach((q) => items.push({ kind: 'Question', title: q.stem.slice(0, 110), sub: `${q.id} · ${q.topic}`, href: `#/practice?q=${q.id}`, text: `${q.stem} ${q.exhibit ?? ''}` }));
  content.flashcards.forEach((c) => items.push({ kind: 'Card', title: c.front, sub: c.back.slice(0, 80), href: `#/flashcards?topic=${c.topic}`, text: `${c.front} ${c.back}` }));
  return items.map((i) => ({ ...i, hay: i.text.toLowerCase() }));
}

export function openSearch(course, content) {
  if (!content || document.querySelector('.palette')) return;
  const index = searchIndex(course, content);
  const { el, close } = openModal('<div class="palette"><input type="search" placeholder="Search lessons, topics, labs, videos, questions, flashcards…" aria-label="Search"><div class="palette-results"></div></div>');
  const input = el.querySelector('input');
  const results = el.querySelector('.palette-results');
  let sel = 0;
  let hits = [];
  const draw = () => {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    hits = terms.length ? index.filter((i) => terms.every((t) => i.hay.includes(t))).slice(0, 40) : [];
    sel = Math.min(sel, Math.max(0, hits.length - 1));
    results.innerHTML = hits.length
      ? hits.map((h, i) => `<a href="${esc(h.href)}" class="${i === sel ? 'sel' : ''}"><span class="kind">${esc(h.kind)}</span><span><div>${esc(h.title)}</div><div class="small muted">${esc(h.sub)}</div></span></a>`).join('')
      : `<div class="empty small">${terms.length ? 'No matches.' : 'Type to search everything in the course.'}</div>`;
    results.querySelector('a.sel')?.scrollIntoView({ block: 'nearest' });
  };
  input.addEventListener('input', () => { sel = 0; draw(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { sel = Math.min(hits.length - 1, sel + 1); draw(); e.preventDefault(); }
    if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
    if (e.key === 'Enter' && hits[sel]) { location.hash = hits[sel].href; close(); }
  });
  results.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  draw();
  input.focus();
}
