// Question bank: filtered practice sessions with instant or end-of-set feedback.
import { html, icon, bar, toast } from '../ui.js';
import { prepareQuestion, gradeResponse, shuffle } from '../lib/quiz.js';
import { mountQuestion } from '../components/question.js';
import { recordAttempt, toggleFlag } from '../progress.js';
import { openQuestionNote } from '../components/note-dialog.js';

const COUNTS = [10, 20, 40, 0];
const POOLS = [
  ['all', 'All questions'], ['unseen', 'Unseen'], ['missed', 'Last answer wrong'], ['flagged', 'Flagged'],
];

function filterPool(questions, { domains, topics, pool, difficulty }, attempts, flags) {
  return questions.filter((q) => {
    if (topics.length ? !topics.includes(q.topic) : !domains.includes(q.domain)) return false;
    if (difficulty && q.difficulty !== difficulty) return false;
    if (pool === 'unseen') return !attempts[q.id];
    if (pool === 'missed') return attempts[q.id] && attempts[q.id].last === false;
    if (pool === 'flagged') return Boolean(flags[q.id]);
    return true;
  });
}

export async function render(root, params, ctx) {
  const { content, store } = ctx;
  const saved = store.get('practicePrefs', {});
  const prefs = {
    domains: saved.domains ?? content.domains.map((d) => d.id),
    topics: params.query.topic ? [params.query.topic] : (saved.topics ?? []),
    count: saved.count ?? 10,
    pool: saved.pool ?? 'all',
    mode: saved.mode ?? 'study',
    difficulty: saved.difficulty ?? 0,
  };
  if (params.query.domain) {
    prefs.domains = [Number(params.query.domain)];
    prefs.topics = [];
  }
  let session = null;
  let mounted = null;

  const keyHandler = (e) => {
    if (!session?.active || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('.overlay')) return;
    if (e.target.matches('input:not([type=radio]):not([type=checkbox]), textarea, select')) return;
    if (e.key === 'Enter') {
      if (e.target.closest('button, a')) return; // let focused controls activate normally
      root.querySelector('[data-act="primary"]')?.click();
      e.preventDefault();
    }
    const n = Number(e.key);
    if (n >= 1 && n <= 6) root.querySelectorAll('.option input')[n - 1]?.click();
  };
  document.addEventListener('keydown', keyHandler);

  function savePrefs() { store.set('practicePrefs', prefs); }

  function drawSetup() {
    const attempts = store.get('attempts', {});
    const flags = store.get('flags', {});
    const available = filterPool(content.questions, prefs, attempts, flags).length;
    const startCount = prefs.count && prefs.count < available ? prefs.count : available;
    const seen = content.questions.filter((q) => attempts[q.id]).length;
    const totals = Object.values(attempts).reduce((a, x) => ({ s: a.s + x.seen, c: a.c + x.correct }), { s: 0, c: 0 });

    root.innerHTML = String(html`
      <div class="page-header">
        <div><div class="eyebrow">Practice</div><h1>Question Bank</h1>
        <p>${content.questions.length} original exam-style questions mapped to the ${ctx.course.title} blueprint.</p></div>
      </div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));align-items:start">
        <div class="card stack" style="grid-column:span 2">
          <div>
            <h3>Domains</h3>
            <div class="chips">${content.domains.map((d) => html`<button class="chip ${prefs.domains.includes(d.id) && !prefs.topics.length ? 'on' : ''}" data-domain="${d.id}">D${d.id} ${d.short} <span class="faint">(${content.banks[d.id].length})</span></button>`)}</div>
          </div>
          <div>
            <h3>Or pick specific topics <span class="muted small">(${prefs.topics.length ? `${prefs.topics.length} selected` : 'optional'})</span></h3>
            <div class="chips">${content.topics.map((t) => html`<button class="chip ${prefs.topics.includes(t.id) ? 'on' : ''}" data-topic="${t.id}" title="${t.verb} ${t.title}">${t.id}</button>`)}</div>
          </div>
          <div class="grid grid-3">
            <label class="field">Questions
              <select data-pref="count">${COUNTS.map((c) => html`<option value="${c}" ${prefs.count === c ? 'selected' : ''}>${c || 'All matching'}</option>`)}</select>
            </label>
            <label class="field">Pool
              <select data-pref="pool">${POOLS.map(([v, l]) => html`<option value="${v}" ${prefs.pool === v ? 'selected' : ''}>${l}</option>`)}</select>
            </label>
            <label class="field">Difficulty
              <select data-pref="difficulty">${[[0, 'Any'], [1, 'Easy'], [2, 'Exam-level'], [3, 'Hard']].map(([v, l]) => html`<option value="${v}" ${prefs.difficulty === v ? 'selected' : ''}>${l}</option>`)}</select>
            </label>
          </div>
          <div class="row between">
            <div class="seg">
              <button class="${prefs.mode === 'study' ? 'active' : ''}" data-mode="study">Study · instant feedback</button>
              <button class="${prefs.mode === 'quiz' ? 'active' : ''}" data-mode="quiz">Quiz · review at end</button>
            </div>
            <button class="btn btn-primary btn-lg" data-act="start" ${available ? '' : 'disabled'}>Start ${startCount} question${startCount === 1 ? '' : 's'} ${icon('arrowRight')}</button>
          </div>
          ${available ? '' : html`<p class="muted small mb0">No questions match these filters.</p>`}
        </div>
        <div class="card stack">
          <div class="stat"><span class="value">${seen}/${content.questions.length}</span><span class="label">Questions attempted</span></div>
          ${bar(content.questions.length ? (seen / content.questions.length) * 100 : 0)}
          <div class="stat"><span class="value">${totals.s ? Math.round((totals.c / totals.s) * 100) : 0}%</span><span class="label">Overall accuracy (${totals.s} answers)</span></div>
          <div class="stat"><span class="value">${Object.keys(flags).length}</span><span class="label">Flagged for review</span></div>
          <p class="small muted mb0">Shortcuts: <kbd>1</kbd>–<kbd>6</kbd> select an option, <kbd>Enter</kbd> submits / continues.</p>
        </div>
      </div>`);
  }

  function start(questions) {
    session = { items: questions.map((q) => prepareQuestion(q)), idx: 0, results: [], mode: prefs.mode, revealed: false, active: true };
    drawQuestion();
  }

  function drawQuestion() {
    const pq = session.items[session.idx];
    const flags = store.get('flags', {});
    root.innerHTML = String(html`
      <div class="exam-bar">
        <strong>${session.mode === 'study' ? 'Study session' : 'Quiz'}</strong>
        <div style="flex:1;min-width:120px">${bar((session.idx / session.items.length) * 100, 'thin')}</div>
        <span class="muted small">${session.idx + 1} / ${session.items.length}</span>
        ${session.mode === 'study' ? html`<span class="badge badge-ok" id="correct-count">${session.results.filter((r) => r.correct).length} correct</span>` : ''}
        <button class="btn btn-ghost btn-sm" data-act="flag">${icon('flag', 15)} ${flags[pq.id] ? 'Flagged' : 'Flag'}</button>
        <button class="btn btn-ghost btn-sm" data-act="note" title="Report a problem or add a note">Note</button>
        <button class="btn btn-ghost btn-sm" data-act="quit">End session</button>
      </div>
      <div class="card"><div id="q"></div>
        <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-primary" data-act="primary">${session.mode === 'study' ? 'Submit' : 'Next'}</button></div>
      </div>`);
    mounted?.destroy();
    mounted = mountQuestion(root.querySelector('#q'), pq, { meta: html`<span class="badge">${pq.id}</span>` });
    session.revealed = false;
  }

  function record(pq, correct) {
    recordAttempt(pq.id, correct);
    session.results.push({ q: pq, correct, response: mounted.getResponse() });
    ctx.logActivity();
  }

  function advance() {
    if (session.idx + 1 < session.items.length) {
      session.idx += 1;
      drawQuestion();
      window.scrollTo(0, 0);
    } else {
      drawSummary();
    }
  }

  function primary() {
    const pq = session.items[session.idx];
    if (session.mode === 'study' && !session.revealed) {
      if (!mounted.isAnswered()) { toast('Answer the question first.'); return; }
      const grade = mounted.reveal({ lessonHref: pq.lesson ? `#/lesson/${pq.lesson}` : undefined });
      record(pq, grade.correct);
      session.revealed = true;
      const counter = root.querySelector('#correct-count');
      if (counter) counter.textContent = `${session.results.filter((r) => r.correct).length} correct`;
      root.querySelector('[data-act="primary"]').textContent = session.idx + 1 < session.items.length ? 'Next question' : 'See results';
      return;
    }
    if (session.mode === 'quiz') record(pq, gradeResponse(pq, mounted.getResponse()).correct);
    advance();
  }

  function drawSummary() {
    mounted?.destroy();
    mounted = null;
    session.active = false;
    const correct = session.results.filter((r) => r.correct).length;
    const total = session.results.length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const byTopic = {};
    session.results.forEach((r) => {
      const t = byTopic[r.q.topic] ?? { c: 0, n: 0 };
      byTopic[r.q.topic] = { c: t.c + (r.correct ? 1 : 0), n: t.n + 1 };
    });
    const verdict = pct >= 85 ? 'Exam-ready pace on this set.' : pct >= 70 ? 'Solid. Review the misses below.' : 'Worth another pass on these topics.';
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Session complete</div><h1>${correct} / ${total} correct · ${pct}%</h1><p>${verdict}</p></div>
        <div class="row">
          ${correct < total ? html`<button class="btn btn-primary" data-act="retry">Retry the ${total - correct} missed</button>` : ''}
          <button class="btn" data-act="new">New session</button>
        </div>
      </div>
      <div class="grid grid-2" style="align-items:start">
        <div class="card"><h3>By topic</h3><div class="list">${Object.entries(byTopic).sort().map(([t, v]) => html`
          <a class="list-item" href="#/topic/${t}"><span class="grow"><span class="title">${t}</span> <span class="sub">${content.topics.find((x) => x.id === t)?.title ?? ''}</span></span>
          <span class="badge ${v.c === v.n ? 'badge-ok' : v.c ? 'badge-warn' : 'badge-err'}">${v.c}/${v.n}</span></a>`)}</div></div>
        <div class="card"><h3>Questions <span class="muted small">(click to review)</span></h3><div class="list">${session.results.map((r, i) => html`
          <a href="javascript:void 0" class="list-item" data-review="${i}">
            <span class="done-mark ${r.correct ? 'on' : ''}" style="${r.correct ? '' : 'border-color:var(--err)'}">${r.correct ? icon('check', 12) : ''}</span>
            <span class="grow"><span class="title small">${r.q.stem.replace(/[*`_]/g, '').slice(0, 90)}${r.q.stem.length > 90 ? '…' : ''}</span><span class="sub">${r.q.id} · topic ${r.q.topic}</span></span>
          </a>`)}</div></div>
      </div>
      <div id="review" class="mt"></div>`);
  }

  function showReview(i) {
    const r = session.results[i];
    const host = root.querySelector('#review');
    host.innerHTML = '<div class="card"><div id="rq"></div></div>';
    const m = mountQuestion(host.querySelector('#rq'), r.q, { response: r.response, meta: html`<span class="badge">${r.q.id}</span>` });
    m.reveal({ lessonHref: r.q.lesson ? `#/lesson/${r.q.lesson}` : undefined });
    host.scrollIntoView({ behavior: 'smooth' });
  }

  function onClick(e) {
    const review = e.target.closest('[data-review]');
    if (review) { e.preventDefault(); showReview(Number(review.dataset.review)); return; }
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.domain) {
      const id = Number(t.dataset.domain);
      const wasTopicMode = prefs.topics.length > 0;
      prefs.topics = [];
      if (!wasTopicMode) prefs.domains = prefs.domains.includes(id) ? prefs.domains.filter((d) => d !== id) : [...prefs.domains, id];
      savePrefs(); drawSetup();
      return;
    }
    if (t.dataset.topic) {
      const id = t.dataset.topic;
      prefs.topics = prefs.topics.includes(id) ? prefs.topics.filter((x) => x !== id) : [...prefs.topics, id];
      savePrefs(); drawSetup();
      return;
    }
    if (t.dataset.mode) { prefs.mode = t.dataset.mode; savePrefs(); drawSetup(); return; }
    switch (t.dataset.act) {
      case 'start': {
        const pool = shuffle(filterPool(content.questions, prefs, store.get('attempts', {}), store.get('flags', {})));
        start(prefs.count ? pool.slice(0, prefs.count) : pool);
        break;
      }
      case 'primary': primary(); break;
      case 'note': openQuestionNote(session.items[session.idx].id); break;
      case 'flag': {
        const on = toggleFlag(session.items[session.idx].id);
        t.innerHTML = `${icon('flag', 15)} ${on ? 'Flagged' : 'Flag'}`;
        break;
      }
      case 'quit':
        if (session.results.length) drawSummary();
        else { session = null; drawSetup(); }
        break;
      case 'retry': start(shuffle(session.results.filter((r) => !r.correct).map((r) => content.questionById.get(r.q.id)))); break;
      case 'new': session = null; drawSetup(); break;
      default: break;
    }
  }

  function onChange(e) {
    const key = e.target.dataset.pref;
    if (!key) return;
    prefs[key] = key === 'pool' ? e.target.value : Number(e.target.value);
    savePrefs(); drawSetup();
  }

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);

  if (params.query.q && content.questionById.has(params.query.q)) {
    prefs.mode = 'study';
    start([content.questionById.get(params.query.q)]);
  } else {
    drawSetup();
  }

  return () => {
    document.removeEventListener('keydown', keyHandler);
    root.removeEventListener('click', onClick);
    root.removeEventListener('change', onChange);
    mounted?.destroy();
  };
}
