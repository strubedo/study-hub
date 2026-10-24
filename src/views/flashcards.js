// Spaced-repetition flashcards (SM-2). Keys: Space flips, 1-4 grade.
import { html, raw, md, icon, bar } from '../ui.js';
import { review, isDue, newCardState, previewInterval, GRADES } from '../lib/srs.js';
import { shuffle } from '../lib/quiz.js';

const NEW_PER_SESSION = 20;
const GRADE_BUTTONS = [
  [GRADES.AGAIN, 'Again', '1', 'btn-danger'], [GRADES.HARD, 'Hard', '2', ''], [GRADES.GOOD, 'Good', '3', 'btn-primary'], [GRADES.EASY, 'Easy', '4', ''],
];

export async function render(root, params, ctx) {
  const { content, store } = ctx;
  let deck = params.query.topic ? `t:${params.query.topic}` : store.get('flashDeck', 'all');
  let queue = [];
  let current = null;
  let flipped = false;
  let reviewed = 0;

  const cardsInDeck = () => content.flashcards.filter((c) => {
    if (deck === 'all') return true;
    if (deck.startsWith('d:')) return c.domain === Number(deck.slice(2));
    return c.topic === deck.slice(2);
  });

  function buildQueue() {
    const srs = store.get('srs', {});
    const now = Date.now();
    const cards = cardsInDeck();
    const due = cards.filter((c) => srs[c.id] && isDue(srs[c.id], now)).sort((a, b) => srs[a.id].due - srs[b.id].due);
    const fresh = shuffle(cards.filter((c) => !srs[c.id])).slice(0, NEW_PER_SESSION);
    return [...due, ...fresh];
  }

  function deckStats() {
    const srs = store.get('srs', {});
    const cards = cardsInDeck();
    const now = Date.now();
    return {
      total: cards.length,
      fresh: cards.filter((c) => !srs[c.id]).length,
      due: cards.filter((c) => srs[c.id] && isDue(srs[c.id], now)).length,
      mature: cards.filter((c) => srs[c.id]?.interval >= 21).length,
    };
  }

  function drawPicker() {
    const s = deckStats();
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Memorize</div><h1>Flashcards</h1>
        <p>${content.flashcards.length} cards with spaced repetition. Cards you know come back less often.</p></div></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
        <div class="card stack">
          <label class="field">Deck
            <select data-deck>
              <option value="all" ${deck === 'all' ? 'selected' : ''}>All domains</option>
              ${content.domains.map((d) => html`<option value="d:${d.id}" ${deck === `d:${d.id}` ? 'selected' : ''}>Domain ${d.id} · ${d.short}</option>`)}
              ${content.topics.map((t) => html`<option value="t:${t.id}" ${deck === `t:${t.id}` ? 'selected' : ''}>Topic ${t.id}</option>`)}
            </select></label>
          <div class="grid grid-4">
            <div class="stat"><span class="value">${s.due}</span><span class="label">Due</span></div>
            <div class="stat"><span class="value">${s.fresh}</span><span class="label">New</span></div>
            <div class="stat"><span class="value">${s.mature}</span><span class="label">Mature (21d+)</span></div>
            <div class="stat"><span class="value">${s.total}</span><span class="label">Total</span></div>
          </div>
          ${bar(s.total ? ((s.total - s.fresh) / s.total) * 100 : 0)}
          <button class="btn btn-primary btn-lg" data-act="study" ${s.due + s.fresh ? '' : 'disabled'}>${s.due + s.fresh ? `Study ${s.due} due + ${Math.min(s.fresh, NEW_PER_SESSION)} new` : 'Nothing due. Come back later'}</button>
        </div>
        <div class="card"><h3>How it works</h3><ul class="small" style="padding-left:1.1em;margin:0">
          <li><kbd>Space</kbd> flips the card. Grade yourself honestly with <kbd>1</kbd>–<kbd>4</kbd>.</li>
          <li><strong>Again</strong> brings the card back in 10 minutes; <strong>Good</strong> spaces it out (1d → 3d → ~8d …).</li>
          <li>Up to ${NEW_PER_SESSION} new cards are introduced per session.</li>
          <li>Daily reviews compound. Ten minutes a day beats an hour on Sunday.</li></ul></div>
      </div>`);
  }

  function drawCard() {
    if (!current) {
      root.innerHTML = String(html`<div class="empty card"><h3>Session complete 🎉</h3><p>You reviewed ${reviewed} card${reviewed === 1 ? '' : 's'}.</p>
        <button class="btn btn-primary" data-act="back">Back to decks</button></div>`);
      return;
    }
    const state = store.get('srs', {})[current.id] ?? newCardState();
    const now = Date.now();
    root.innerHTML = String(html`
      <div class="exam-bar"><strong>Flashcards</strong><div style="flex:1">${bar((reviewed / (reviewed + queue.length + 1)) * 100, 'thin')}</div>
        <span class="small muted">${queue.length + 1} left</span><button class="btn btn-ghost btn-sm" data-act="back">End</button></div>
      <div class="flashcard ${flipped ? 'flipped' : ''}" data-act="flip" tabindex="0" role="button" aria-label="Flip card">
        <div class="flashcard-inner">
          <div class="flashcard-face"><span class="tag badge">Topic ${current.topic}</span><div>${raw(md(current.front, { inline: true }))}</div>
            <div class="small faint" style="position:absolute;bottom:14px">Space to reveal</div></div>
          <div class="flashcard-face back"><span class="tag badge badge-accent">Answer</span><div>${raw(md(current.back, { inline: true }))}</div></div>
        </div>
      </div>
      ${flipped ? html`<div class="grade-row">${GRADE_BUTTONS.map(([g, label, key, cls]) => html`
        <button class="btn ${cls}" data-grade="${g}">${label}<small>${key} · ${previewInterval(state, g, now)}</small></button>`)}</div>`
        : html`<div class="grade-row" style="grid-template-columns:1fr"><button class="btn btn-primary" data-act="flip">Show answer <small style="color:inherit;opacity:.8">Space</small></button></div>`}`);
  }

  function grade(g) {
    const srs = store.get('srs', {});
    const next = review(srs[current.id] ?? newCardState(), g, Date.now());
    store.set('srs', { ...srs, [current.id]: next });
    ctx.logActivity();
    reviewed += 1;
    if (g === GRADES.AGAIN) queue = [...queue, current];
    current = queue.shift() ?? null;
    flipped = false;
    drawCard();
  }

  function start() {
    queue = buildQueue();
    reviewed = 0;
    current = queue.shift() ?? null;
    flipped = false;
    drawCard();
  }

  const onKey = (e) => {
    if (!current || e.target.matches('input, select, textarea')) return;
    if (e.key === ' ') { e.preventDefault(); flipped = !flipped; drawCard(); }
    if (flipped && ['1', '2', '3', '4'].includes(e.key)) grade(Number(e.key) - 1);
  };
  document.addEventListener('keydown', onKey);

  root.addEventListener('click', (e) => {
    const g = e.target.closest('[data-grade]');
    if (g) { grade(Number(g.dataset.grade)); return; }
    const a = e.target.closest('[data-act]')?.dataset.act;
    if (a === 'flip') { flipped = !flipped; drawCard(); }
    if (a === 'study') start();
    if (a === 'back') { current = null; queue = []; drawPicker(); }
  });
  root.addEventListener('change', (e) => {
    if (e.target.dataset.deck === undefined) return;
    deck = e.target.value;
    store.set('flashDeck', deck);
    drawPicker();
  });

  drawPicker();
  return () => document.removeEventListener('keydown', onKey);
}
