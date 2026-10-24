// Timed exam simulator. In-progress state persists in the store ("examInProgress")
// so a refresh never loses an attempt. Finished attempts go to "examHistory".
import { html, icon, bar, ring, fmtDuration, confirmDialog, toast } from '../ui.js';
import { buildExam, prepareQuestion, gradeResponse, scoreExam } from '../lib/quiz.js';
import { mountQuestion } from '../components/question.js';
import { recordAttempt } from '../progress.js';
import { openQuestionNote } from '../components/note-dialog.js';
import { EXAM } from '../../content/blueprint.js';

const MODES = {
  full: { label: 'Full exam', questions: 100, labs: 3, minutes: 120, blurb: '100 questions + 3 CLI labs in 120 minutes — the real pace.' },
  half: { label: 'Half exam', questions: 50, labs: 2, minutes: 60, blurb: '50 questions + 2 labs in 60 minutes.' },
  sprint: { label: 'Sprint', questions: 25, labs: 1, minutes: 30, blurb: '25 questions + 1 lab in 30 minutes.' },
};
const PASS_ESTIMATE = 825;
const HISTORY_LIMIT = 30;
const LOW_TIME_SEC = 300;

function restoreQuestion(q, item) {
  switch (q.type) {
    case 'single':
    case 'multi': return { ...q, choices: item.order.map((orig) => ({ text: q.options[orig], orig })) };
    case 'order': return { ...q, shuffledItems: item.order };
    case 'match': return { ...q, lefts: q.pairs.map((p) => p[0]), rights: item.order };
    default: return { ...q };
  }
}

function snapshotOrder(pq) {
  if (pq.type === 'single' || pq.type === 'multi') return pq.choices.map((c) => c.orig);
  if (pq.type === 'order') return pq.shuffledItems;
  if (pq.type === 'match') return pq.rights;
  return null;
}

const labDomain = (lab) => Number(String(lab.topic).split('.')[0]);

export async function render(root, params, ctx) {
  const { content, store } = ctx;
  let timer = null;
  let mounted = null;
  let labHandle = null;
  let simUi = null;

  const eligibleLabs = content.labs.filter((l) => l.examEligible);
  const getState = () => store.get('examInProgress', null);
  const saveState = (s) => store.set('examInProgress', s);

  async function loadSim() {
    if (simUi || !eligibleLabs.length) return simUi;
    try {
      simUi = await import('../sim/ui.js');
    } catch (e) {
      console.error('[exam] lab simulator unavailable', e);
    }
    return simUi;
  }

  // ---------- setup ----------
  function drawSetup() {
    const history = store.get('examHistory', []);
    const best = history.reduce((m, h) => Math.max(m, h.scaled), 0);
    const opts = store.get('examPrefs', { mode: 'full', strict: true, labs: true });
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Exam simulator</div><h1>Practice Exam</h1>
        <p>Blueprint-weighted questions drawn from the full bank: D1 25% · D2 25% · D3 20% · D4 20% · D5 10%.</p></div></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
        <div class="card stack" style="grid-column:span 2">
          <div class="grid grid-3">${Object.entries(MODES).map(([k, m]) => html`
            <button class="card flat" data-mode="${k}" style="text-align:left;cursor:pointer;font:inherit;color:inherit;${opts.mode === k ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
              <div class="row between"><strong>${m.label}</strong>${opts.mode === k ? html`<span class="badge badge-accent">Selected</span>` : ''}</div>
              <div class="big-number" style="font-size:1.6rem;margin:8px 0 4px">${m.minutes} min</div>
              <div class="small muted">${m.blurb}</div>
            </button>`)}</div>
          <label class="check"><input type="checkbox" data-opt="strict" ${opts.strict ? 'checked' : ''}> Realistic navigation — no going back to earlier questions (like the real exam)</label>
          <label class="check"><input type="checkbox" data-opt="labs" ${opts.labs && eligibleLabs.length ? 'checked' : ''} ${eligibleLabs.length ? '' : 'disabled'}> Include CLI simulation labs ${eligibleLabs.length ? '' : html`<span class="muted small">(no exam-eligible labs available yet)</span>`}</label>
          <div class="row between">
            <p class="small muted mb0">${EXAM.passingScoreNote}</p>
            <button class="btn btn-primary btn-lg" data-act="begin">Begin exam ${icon('arrowRight')}</button>
          </div>
        </div>
        <div class="card">
          <h3>About the real exam</h3>
          <ul class="small" style="padding-left:1.1em;margin:0">
            <li>${EXAM.code} ${EXAM.version}, ${EXAM.minutes} minutes, roughly ${EXAM.questionsApprox} items.</li>
            <li>Multiple choice, multiple answer, drag-and-drop, and CLI simulations / simlets.</li>
            <li>No going back once you submit an answer.</li>
            <li>Scored on a 300–1000 scale; Cisco does not publish the cut score.</li>
            <li>v2.0 becomes live ${EXAM.liveFrom}; v1.1 ends ${EXAM.previousVersionLastDay}.</li>
          </ul>
        </div>
      </div>
      <div class="card mt">
        <div class="card-title"><h3>Attempt history</h3>${history.length ? html`<span class="muted small">Best: ${best} / 1000</span>` : ''}</div>
        ${history.length ? html`<div class="table-wrap"><table class="ref-table">
          <thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>Correct</th>${content.domains.map((d) => html`<th>D${d.id}</th>`)}<th>Time</th><th></th></tr></thead>
          <tbody>${history.map((h, i) => html`<tr>
            <td>${new Date(h.at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
            <td>${MODES[h.mode]?.label ?? h.mode}</td>
            <td><span class="badge ${h.scaled >= PASS_ESTIMATE ? 'badge-ok' : 'badge-err'}">${h.scaled}</span></td>
            <td>${h.correct}/${h.total}</td>
            ${content.domains.map((d) => html`<td>${h.perDomain[d.id] ? `${h.perDomain[d.id].percent}%` : '–'}</td>`)}
            <td>${fmtDuration(h.seconds)}</td>
            <td><a href="#/exam?review=${i}">Review</a></td></tr>`)}</tbody></table></div>`
        : html`<p class="muted mb0">No attempts yet. Your scores and per-domain breakdowns will appear here.</p>`}
      </div>`);
  }

  function begin() {
    const opts = store.get('examPrefs', { mode: 'full', strict: true, labs: true });
    const mode = MODES[opts.mode];
    const weights = Object.fromEntries(content.domains.map((d) => [d.id, d.weight]));
    const questions = buildExam(content.banks, weights, mode.questions);
    if (!questions.length) { toast('The question bank is empty.', 'err'); return; }
    const items = questions.map((q) => {
      const pq = prepareQuestion(q);
      return { kind: 'q', id: q.id, order: snapshotOrder(pq) };
    });
    if (opts.labs && eligibleLabs.length) {
      const labs = [...eligibleLabs].sort(() => Math.random() - 0.5).slice(0, mode.labs);
      labs.forEach((lab) => {
        const at = Math.floor(Math.random() * (items.length + 1));
        items.splice(at, 0, { kind: 'lab', id: lab.id });
      });
    }
    saveState({ mode: opts.mode, strict: opts.strict, startedAt: Date.now(), durationSec: mode.minutes * 60, items, idx: 0, responses: {}, answered: {}, labResults: {}, flags: {} });
    drawRunning();
  }

  // ---------- running ----------
  function remaining(state) {
    return Math.max(0, state.durationSec - (Date.now() - state.startedAt) / 1000);
  }

  function tick() {
    const state = getState();
    if (!state) return;
    const left = remaining(state);
    const el = root.querySelector('.timer');
    if (el) {
      el.textContent = fmtDuration(left);
      el.classList.toggle('low', left < LOW_TIME_SEC);
    }
    if (left <= 0) {
      toast('Time is up — your exam was submitted.');
      finish();
    }
  }

  /** Stores a response only when the item is actually answered; otherwise clears it. */
  /**
   * Keeps any response the user has touched (partial answers still earn partial credit),
   * and tracks fully-answered items separately for the progress counters.
   */
  function saveResponse(state, idx, response, touched, answered) {
    const { [idx]: _r, ...restResponses } = state.responses;
    const { [idx]: _a, ...restAnswered } = state.answered ?? {};
    saveState({
      ...state,
      responses: touched ? { ...restResponses, [idx]: response } : restResponses,
      answered: answered ? { ...restAnswered, [idx]: true } : restAnswered,
    });
  }

  const answeredCount = (state) => Object.keys(state.answered ?? {}).length + Object.keys(state.labResults).length;

  function persistCurrent() {
    const state = getState();
    if (!state) return;
    const item = state.items[state.idx];
    if (item.kind === 'q' && mounted) {
      saveResponse(state, state.idx, mounted.getResponse(), mounted.isTouched(), mounted.isAnswered());
    } else if (item.kind === 'lab' && labHandle) {
      const now = labHandle.check();
      const prev = state.labResults[state.idx];
      // After a refresh the lab restarts from its initial config; keep the better of the two results.
      const best = prev && prev.passed > now.passed ? prev : now;
      saveState({ ...state, labResults: { ...state.labResults, [state.idx]: best } });
    }
  }

  function teardownItem() {
    mounted?.destroy();
    mounted = null;
    if (labHandle) {
      try { labHandle.destroy(); } catch (e) { console.error('[exam] lab destroy failed', e); }
      labHandle = null;
    }
  }

  let drawSeq = 0;

  async function drawRunning() {
    const seq = ++drawSeq;
    teardownItem();
    const state = getState();
    const item = state.items[state.idx];
    const total = state.items.length;
    const answered = answeredCount(state);
    root.innerHTML = String(html`
      <div class="exam-bar">
        <span class="row" style="gap:6px">${icon('clock')} <span class="timer">${fmtDuration(remaining(state))}</span></span>
        <div style="flex:1;min-width:120px">${bar((state.idx / total) * 100, 'thin')}</div>
        <span class="muted small">Item ${state.idx + 1} of ${total} · ${answered} answered</span>
        ${state.strict ? '' : html`<button class="btn btn-ghost btn-sm" data-act="flag">${icon('flag', 15)} ${state.flags[state.idx] ? 'Flagged' : 'Flag'}</button>`}
        <button class="btn btn-ghost btn-sm" data-act="end">End exam</button>
      </div>
      <div class="card"><div id="item"></div>
        <div class="row between" style="margin-top:18px">
          <div>${state.strict ? html`<span class="small muted">Answers are final once you continue.</span>` : html`<button class="btn" data-act="prev" ${state.idx === 0 ? 'disabled' : ''}>${icon('arrowLeft')} Previous</button>`}</div>
          <div class="row">
            ${state.strict ? '' : html`<button class="btn btn-ghost" data-act="overview">Overview</button>`}
            <button class="btn btn-primary" data-act="next">${state.idx + 1 < total ? 'Next' : 'Finish exam'} ${icon('arrowRight')}</button>
          </div>
        </div>
      </div>`);
    const host = root.querySelector('#item');
    if (item.kind === 'q') {
      const q = content.questionById.get(item.id);
      if (!q) { host.innerHTML = '<p class="muted">This question is no longer in the bank — skip it.</p>'; return; }
      mounted = mountQuestion(host, restoreQuestion(q, item), {
        number: state.idx + 1, total, showTopic: false,
        response: state.responses[state.idx],
        onChange: (r) => { const s = getState(); if (s && mounted) saveResponse(s, s.idx, r, mounted.isTouched(), mounted.isAnswered()); },
      });
    } else {
      const lab = content.labs.find((l) => l.id === item.id);
      const sim = await loadSim();
      if (seq !== drawSeq || !host.isConnected) return; // user moved on while the simulator loaded
      if (!lab || !sim?.mountLab) { host.innerHTML = '<p class="muted">Lab unavailable — skip it.</p>'; return; }
      host.innerHTML = String(html`<div class="q-meta"><span class="badge badge-accent">Item ${state.idx + 1} of ${total}</span><span class="badge">CLI simulation</span></div>
        <h2>${lab.title}</h2><p class="small muted mb0">Reloading the page restarts this lab from its initial config; your best result so far is kept.</p><div id="lab-host" class="mt"></div>`);
      labHandle = sim.mountLab(host.querySelector('#lab-host'), lab, { compact: true, persist: false });
    }
  }

  function go(delta) {
    persistCurrent();
    const state = getState();
    const next = state.idx + delta;
    if (next >= state.items.length) { confirmFinish(); return; }
    if (next < 0) return;
    saveState({ ...state, idx: next });
    drawRunning();
    window.scrollTo(0, 0);
  }

  async function confirmFinish() {
    persistCurrent();
    const state = getState();
    const unanswered = state.items.length - answeredCount(state);
    const ok = await confirmDialog(unanswered > 0 ? `Submit now? ${unanswered} item(s) are unanswered and will be scored as incorrect.` : 'Submit your exam for scoring?', { okLabel: 'Submit exam' });
    if (ok) finish();
  }

  function drawOverview() {
    persistCurrent();
    const state = getState();
    root.querySelector('#item').innerHTML = String(html`<h2>Overview</h2>
      <p class="muted small">Click an item to jump to it. Flagged items are marked in amber.</p>
      <div class="chips">${state.items.map((it, i) => {
        const done = Boolean(state.answered?.[i]) || state.labResults[i] !== undefined;
        const style = state.flags[i] ? 'border-color:var(--warn);color:var(--warn)' : '';
        return html`<button class="chip ${done ? 'on' : ''}" style="${style}" data-jump="${i}">${i + 1}${it.kind === 'lab' ? ' (lab)' : ''}</button>`;
      })}</div>`);
  }

  function finish() {
    clearInterval(timer);
    timer = null;
    persistCurrent();
    teardownItem();
    const state = getState();
    if (!state) return;
    const results = state.items.map((it, i) => {
      if (it.kind === 'lab') {
        const lab = content.labs.find((l) => l.id === it.id);
        const r = state.labResults[i] ?? { passed: 0, total: lab?.tasks?.length || 1 };
        const score = r.total ? r.passed / r.total : 0;
        return { kind: 'lab', id: it.id, domain: lab ? labDomain(lab) : 0, correct: score === 1, score, detail: r };
      }
      const q = content.questionById.get(it.id);
      const g = q ? gradeResponse(q, state.responses[i]) : { correct: false, score: 0 };
      if (q && state.answered?.[i]) recordAttempt(q.id, g.correct);
      return { kind: 'q', id: it.id, order: it.order, domain: q?.domain ?? 0, correct: g.correct, score: g.score, response: state.responses[i] };
    });
    const s = scoreExam(results);
    const seconds = Math.min(state.durationSec, Math.round((Date.now() - state.startedAt) / 1000));
    const entry = { at: new Date().toISOString(), mode: state.mode, ...s, seconds, items: results };
    store.update('examHistory', (h) => [entry, ...h].slice(0, HISTORY_LIMIT), []);
    store.set('examInProgress', null);
    ctx.logActivity(5);
    ctx.navigate('#/exam?review=0');
  }

  // ---------- results / review ----------
  function drawResults(entry) {
    const passed = entry.scaled >= PASS_ESTIMATE;
    const weakest = content.domains.filter((d) => entry.perDomain[d.id]).sort((a, b) => entry.perDomain[a.id].percent - entry.perDomain[b.id].percent)[0];
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Exam results · ${new Date(entry.at).toLocaleString()}</div><h1>${MODES[entry.mode]?.label ?? 'Exam'} — ${entry.scaled} / 1000</h1></div>
        <div class="row"><a class="btn" href="#/exam">Back to simulator</a><button class="btn btn-primary" data-act="again">Take another</button></div></div>
      <div class="card score-hero">
        ${ring((entry.scaled - 300) / 7, { size: 160, label: 'of 1000', display: entry.scaled, color: passed ? 'var(--ok)' : 'var(--err)' })}
        <div class="stack">
          <div class="row"><span class="badge ${passed ? 'badge-ok' : 'badge-err'}" style="font-size:.85rem">${passed ? 'Above' : 'Below'} the ~${PASS_ESTIMATE} community pass estimate</span></div>
          <div class="grid grid-3">
            <div class="stat"><span class="value">${entry.percent}%</span><span class="label">${entry.correct} of ${entry.total} fully correct</span></div>
            <div class="stat"><span class="value">${fmtDuration(entry.seconds)}</span><span class="label">Time used</span></div>
            <div class="stat"><span class="value">${weakest ? `D${weakest.id}` : '–'}</span><span class="label">Weakest domain${weakest ? ` (${weakest.short})` : ''}</span></div>
          </div>
          <p class="small muted mb0">The scaled score is a linear estimate (partial credit counted for labs and matching). Cisco's real scoring method is unpublished.</p>
        </div>
      </div>
      <div class="card mt"><h3>By domain</h3><div class="stack">${content.domains.map((d) => {
        const r = entry.perDomain[d.id];
        return html`<div class="dom-${d.id}"><div class="row between small"><span class="dom-tag">D${d.id} · ${d.title} <span class="faint">(${d.weight}%)</span></span><span>${r ? `${r.correct}/${r.total} · ${r.percent}%` : '—'}</span></div>${bar(r?.percent ?? 0, 'dom')}
          ${r && r.percent < 80 ? html`<div class="small mt" style="margin-top:4px"><a href="#/practice?domain=${d.id}">Drill domain ${d.id} →</a></div>` : ''}</div>`;
      })}</div></div>
      <div class="card mt"><div class="card-title"><h3>Review answers</h3>
        <div class="seg"><button class="active" data-filter="wrong">Incorrect</button><button data-filter="all">All</button></div></div>
        <div id="review-list" class="list"></div><div id="review-item" class="mt"></div></div>`);
    drawReviewList(entry, 'wrong');
  }

  function drawReviewList(entry, filter) {
    const list = root.querySelector('#review-list');
    const rows = entry.items.map((r, i) => ({ ...r, i })).filter((r) => filter === 'all' || !r.correct);
    list.innerHTML = rows.length ? String(html`${rows.map((r) => {
      const q = r.kind === 'q' ? content.questionById.get(r.id) : null;
      const lab = r.kind === 'lab' ? content.labs.find((l) => l.id === r.id) : null;
      const title = q ? q.stem.replace(/[*`_]/g, '').slice(0, 100) : lab ? `Lab: ${lab.title}` : r.id;
      return html`<a href="javascript:void 0" class="list-item" data-item="${r.i}">
        <span class="badge ${r.correct ? 'badge-ok' : r.score > 0 ? 'badge-warn' : 'badge-err'}">${r.i + 1}</span>
        <span class="grow"><span class="title small">${title}</span><span class="sub">${q ? `${q.id} · topic ${q.topic}` : lab ? `${r.detail.passed}/${r.detail.total} tasks · topic ${lab.topic}` : ''}</span></span></a>`;
    })}`) : '<p class="muted">Nothing to show — every item was correct.</p>';
  }

  function showReviewItem(entry, i) {
    const r = entry.items[i];
    const host = root.querySelector('#review-item');
    if (r.kind === 'lab') {
      const lab = content.labs.find((l) => l.id === r.id);
      host.innerHTML = String(html`<div class="card flat"><h3>${lab?.title ?? r.id}</h3><p>${r.detail.passed} of ${r.detail.total} tasks completed.</p>
        <a class="btn" href="#/labs/${r.id}">Practice this lab ${icon('arrowRight')}</a></div>`);
    } else {
      const q = content.questionById.get(r.id);
      if (!q) return;
      host.innerHTML = '<div class="card flat"><div id="rq"></div></div>';
      const m = mountQuestion(host.querySelector('#rq'), restoreQuestion(q, r), { response: r.response, number: i + 1 });
      m.reveal({ lessonHref: q.lesson ? `#/lesson/${q.lesson}` : undefined });
      const noteBtn = document.createElement('button');
      noteBtn.className = 'btn btn-ghost btn-sm mt';
      noteBtn.textContent = 'Report a problem / add a note';
      noteBtn.addEventListener('click', () => openQuestionNote(q.id));
      host.querySelector('.card').appendChild(noteBtn);
    }
    host.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- events ----------
  async function onClick(e) {
    const t = e.target.closest('button, a[data-item]');
    if (!t) return;
    if (t.dataset.mode) {
      store.update('examPrefs', (p) => ({ ...p, mode: t.dataset.mode }), { mode: 'full', strict: true, labs: true });
      drawSetup();
      return;
    }
    if (t.dataset.jump !== undefined) {
      const s = getState();
      saveState({ ...s, idx: Number(t.dataset.jump) });
      drawRunning();
      return;
    }
    if (t.dataset.item !== undefined) {
      e.preventDefault();
      showReviewItem(store.get('examHistory', [])[Number(params.query.review)], Number(t.dataset.item));
      return;
    }
    if (t.dataset.filter) {
      root.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('active', b === t));
      drawReviewList(store.get('examHistory', [])[Number(params.query.review)], t.dataset.filter);
      return;
    }
    switch (t.dataset.act) {
      case 'begin': begin(); startTimer(); break;
      case 'next': go(1); break;
      case 'prev': go(-1); break;
      case 'overview': drawOverview(); break;
      case 'flag': {
        const s = getState();
        const flags = s.flags[s.idx] ? Object.fromEntries(Object.entries(s.flags).filter(([k]) => Number(k) !== s.idx)) : { ...s.flags, [s.idx]: true };
        saveState({ ...s, flags });
        t.innerHTML = `${icon('flag', 15)} ${flags[s.idx] ? 'Flagged' : 'Flag'}`;
        break;
      }
      case 'end': {
        const ok = await confirmDialog('End the exam now and score what you have answered?', { okLabel: 'End and score', danger: true });
        if (ok) finish();
        break;
      }
      case 'again': ctx.navigate('#/exam'); break;
      default: break;
    }
  }

  function onChange(e) {
    const key = e.target.dataset.opt;
    if (!key) return;
    store.update('examPrefs', (p) => ({ ...p, [key]: e.target.checked }), { mode: 'full', strict: true, labs: true });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  const beforeUnload = () => persistCurrent();
  window.addEventListener('beforeunload', beforeUnload);

  const inProgress = getState();
  if (params.query.review !== undefined) {
    const entry = store.get('examHistory', [])[Number(params.query.review)];
    if (entry) drawResults(entry); else drawSetup();
  } else if (inProgress) {
    if (remaining(inProgress) <= 0) finish();
    else { drawRunning(); startTimer(); }
  } else {
    drawSetup();
  }

  return () => {
    persistCurrent();
    clearInterval(timer);
    teardownItem();
    window.removeEventListener('beforeunload', beforeUnload);
  };
}
