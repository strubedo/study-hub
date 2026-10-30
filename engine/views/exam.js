// Timed exam simulator. In-progress state persists in the store ("examInProgress")
// so a refresh never loses an attempt. Finished attempts go to "examHistory".
import { html, icon, bar, ring, fmtDuration, confirmDialog, toast } from '../ui.js';
import { prepareQuestion, gradeResponse, scoreExam } from '../lib/quiz.js';
import { mountQuestion } from '../components/question.js';
import { recordAttempt } from '../progress.js';
import { openQuestionNote } from '../components/note-dialog.js';
import { courseUrl } from '../course.js';
import { isMultiExam, examById, examDomains, buildExamFor, weightText } from '../lib/exams.js';

const DEFAULT_PREFS = { mode: 'full', strict: true, labs: true };
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

/** Scaled score as a 0-100 position on the exam's scale (for the results ring). */
const scalePercent = (scaled, { min, max }) => ((scaled - min) / (max - min)) * 100;
const passed = (entry, exam) => exam.scale.pass !== undefined && entry.scaled >= exam.scale.pass;

export async function render(root, params, ctx) {
  const { content, store, course } = ctx;
  const multi = isMultiExam(course);
  const labsCfg = course.labs;
  let timer = null;
  let mounted = null;
  let labHandle = null;
  let mountLab = null;

  const getState = () => store.get('examInProgress', null);
  const saveState = (s) => store.set('examInProgress', s);
  const getPrefs = () => store.get('examPrefs', DEFAULT_PREFS);
  // Multi-exam courses remember the chosen exam in examPrefs.exam; single-exam courses never write it.
  const prefExam = () => examById(course, getPrefs().exam);
  const modesFor = (exam) => exam.modes;
  const eligibleLabsFor = (exam) => (labsCfg && exam.labs > 0 ? content.labs.filter((l) => l.examEligible && exam.domains.includes(labDomain(l))) : []);
  const labById = (id) => content.labs.find((l) => l.id === id);

  async function loadMountLab() {
    if (mountLab || !labsCfg) return mountLab;
    try {
      mountLab = await (await import(courseUrl(course, labsCfg.module))).loadMountLab();
    } catch (e) {
      console.error('[exam] lab simulator unavailable', e);
      toast('The lab simulator could not be loaded. Skip the lab items.', 'err');
    }
    return mountLab;
  }

  // ---------- setup ----------
  function examPicker(current) {
    if (!multi) return '';
    return html`<div><h3>Exam</h3><div class="seg">${course.exams.map((e) => html`
      <button class="${e.id === current.id ? 'active' : ''}" data-exam="${e.id}">${e.code}${e.name ? html` <span class="faint">· ${e.name}</span>` : ''}</button>`)}</div></div>`;
  }

  function aboutCard(exam) {
    if (!exam.about) return '';
    return html`<div class="card">
      <h3>${exam.about.title ?? 'About the real exam'}</h3>
      <ul class="small" style="padding-left:1.1em;margin:0">${exam.about.items.map((t) => html`<li>${t}</li>`)}</ul>
    </div>`;
  }

  function drawSetup() {
    const history = store.get('examHistory', []);
    const opts = getPrefs();
    const exam = prefExam();
    const modes = modesFor(exam);
    const eligibleLabs = eligibleLabsFor(exam);
    const examHistory = history.map((h, i) => ({ h, i })).filter(({ h }) => !multi || examById(course, h.exam).id === exam.id);
    const best = examHistory.reduce((m, { h }) => Math.max(m, h.scaled), 0);
    const weights = examDomains(course, exam).map((d) => `D${d.id} ${weightText(d)}`).join(' · ');
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Exam simulator</div><h1>Practice Exam${multi ? ` · ${exam.code}` : ''}</h1>
        <p>Blueprint-weighted questions drawn from the full bank: ${weights}.</p></div></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:start">
        <div class="card stack" style="grid-column:span 2">
          ${examPicker(exam)}
          <div class="grid grid-3">${Object.entries(modes).map(([k, m]) => html`
            <button class="card flat" data-mode="${k}" style="text-align:left;cursor:pointer;font:inherit;color:inherit;${opts.mode === k ? 'border-color:var(--accent);background:var(--accent-soft)' : ''}">
              <div class="row between"><strong>${m.label}</strong>${opts.mode === k ? html`<span class="badge badge-accent">Selected</span>` : ''}</div>
              <div class="big-number" style="font-size:1.6rem;margin:8px 0 4px">${m.minutes} min</div>
              <div class="small muted">${m.blurb}</div>
            </button>`)}</div>
          <label class="check"><input type="checkbox" data-opt="strict" ${opts.strict ? 'checked' : ''}> Realistic navigation — no going back to earlier questions (like the real exam)</label>
          ${labsCfg && exam.labs > 0 ? html`<label class="check"><input type="checkbox" data-opt="labs" ${opts.labs && eligibleLabs.length ? 'checked' : ''} ${eligibleLabs.length ? '' : 'disabled'}> Include ${labsCfg.examLabel} ${eligibleLabs.length ? '' : html`<span class="muted small">(no exam-eligible labs available yet)</span>`}</label>` : ''}
          <div class="row between">
            <p class="small muted mb0">${exam.passNote ?? ''}</p>
            <button class="btn btn-primary btn-lg" data-act="begin">Begin exam ${icon('arrowRight')}</button>
          </div>
        </div>
        ${aboutCard(exam)}
      </div>
      <div class="card mt">
        <div class="card-title"><h3>Attempt history${multi ? ` · ${exam.code}` : ''}</h3>${examHistory.length ? html`<span class="muted small">Best: ${best} / ${exam.scale.max}</span>` : ''}</div>
        ${examHistory.length ? html`<div class="table-wrap"><table class="ref-table">
          <thead><tr><th>Date</th><th>Mode</th><th>Score</th><th>Correct</th>${examDomains(course, exam).map((d) => html`<th>D${d.id}</th>`)}<th>Time</th><th></th></tr></thead>
          <tbody>${examHistory.map(({ h, i }) => html`<tr>
            <td>${new Date(h.at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
            <td>${modes[h.mode]?.label ?? h.mode}</td>
            <td><span class="badge ${passed(h, exam) ? 'badge-ok' : 'badge-err'}">${h.scaled}</span></td>
            <td>${h.correct}/${h.total}</td>
            ${examDomains(course, exam).map((d) => html`<td>${h.perDomain[d.id] ? `${h.perDomain[d.id].percent}%` : '–'}</td>`)}
            <td>${fmtDuration(h.seconds)}</td>
            <td><a href="#/exam?review=${i}">Review</a></td></tr>`)}</tbody></table></div>`
        : html`<p class="muted mb0">No attempts yet. Your scores and per-domain breakdowns will appear here.</p>`}
      </div>`);
  }

  /** Returns false (and explains why) when there is nothing to start. */
  function begin() {
    const opts = getPrefs();
    const exam = prefExam();
    const mode = modesFor(exam)[opts.mode] ?? modesFor(exam).full;
    const eligibleLabs = eligibleLabsFor(exam);
    const questions = buildExamFor(course, content.banks, exam, mode.questions);
    if (!questions.length) { toast('The question bank is empty.', 'err'); return false; }
    const items = questions.map((q) => {
      const pq = prepareQuestion(q);
      return { kind: 'q', id: q.id, order: snapshotOrder(pq) };
    });
    if (opts.labs && mode.labs > 0 && eligibleLabs.length) {
      const labs = [...eligibleLabs].sort(() => Math.random() - 0.5).slice(0, mode.labs);
      labs.forEach((lab) => {
        const at = Math.floor(Math.random() * (items.length + 1));
        items.splice(at, 0, { kind: 'lab', id: lab.id });
      });
    }
    saveState({ ...(multi ? { exam: exam.id } : {}), mode: opts.mode, strict: opts.strict, startedAt: Date.now(), durationSec: mode.minutes * 60, items, idx: 0, responses: {}, answered: {}, labResults: {}, flags: {} });
    drawRunning();
    return true;
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
      const lab = labById(item.id);
      const mount = await loadMountLab();
      if (seq !== drawSeq || !host.isConnected) return; // user moved on while the simulator loaded
      if (!lab || !mount) { host.innerHTML = '<p class="muted">Lab unavailable — skip it.</p>'; return; }
      host.innerHTML = String(html`<div class="q-meta"><span class="badge badge-accent">Item ${state.idx + 1} of ${total}</span><span class="badge">${labsCfg.itemBadge}</span></div>
        <h2>${lab.title}</h2><p class="small muted mb0">Reloading the page restarts this lab from its initial config; your best result so far is kept.</p><div id="lab-host" class="mt"></div>`);
      labHandle = mount(host.querySelector('#lab-host'), lab, { compact: true, persist: false });
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
        const lab = labById(it.id);
        const r = state.labResults[i] ?? { passed: 0, total: lab?.tasks?.length || 1 };
        const score = r.total ? r.passed / r.total : 0;
        return { kind: 'lab', id: it.id, domain: lab ? labDomain(lab) : 0, correct: score === 1, score, detail: r };
      }
      const q = content.questionById.get(it.id);
      const g = q ? gradeResponse(q, state.responses[i]) : { correct: false, score: 0 };
      if (q && state.answered?.[i]) recordAttempt(q.id, g.correct);
      return { kind: 'q', id: it.id, order: it.order, domain: q?.domain ?? 0, correct: g.correct, score: g.score, response: state.responses[i] };
    });
    const exam = examById(course, state.exam);
    const s = scoreExam(results, exam.scale);
    const seconds = Math.min(state.durationSec, Math.round((Date.now() - state.startedAt) / 1000));
    const entry = { at: new Date().toISOString(), ...(multi ? { exam: exam.id } : {}), mode: state.mode, ...s, seconds, items: results };
    store.update('examHistory', (h) => [entry, ...h].slice(0, HISTORY_LIMIT), []);
    store.set('examInProgress', null);
    ctx.logActivity(5);
    ctx.navigate('#/exam?review=0');
  }

  // ---------- results / review ----------
  function drawResults(entry) {
    const exam = examById(course, entry.exam);
    const { scale } = exam;
    const ok = passed(entry, exam);
    const domains = examDomains(course, exam);
    const weakest = domains.filter((d) => entry.perDomain[d.id]).sort((a, b) => entry.perDomain[a.id].percent - entry.perDomain[b.id].percent)[0];
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Exam results${multi ? ` · ${exam.code}` : ''} · ${new Date(entry.at).toLocaleString()}</div><h1>${exam.modes[entry.mode]?.label ?? 'Exam'} — ${entry.scaled} / ${scale.max}</h1></div>
        <div class="row"><a class="btn" href="#/exam">Back to simulator</a><button class="btn btn-primary" data-act="again">Take another</button></div></div>
      <div class="card score-hero">
        ${ring(scalePercent(entry.scaled, scale), { size: 160, label: `of ${scale.max}`, display: entry.scaled, color: ok ? 'var(--ok)' : 'var(--err)' })}
        <div class="stack">
          ${scale.pass !== undefined ? html`<div class="row"><span class="badge ${ok ? 'badge-ok' : 'badge-err'}" style="font-size:.85rem">${ok ? 'Above' : 'Below'} the ${scale.passLabel ?? `passing score of ${scale.pass}`}</span></div>` : ''}
          <div class="grid grid-3">
            <div class="stat"><span class="value">${entry.percent}%</span><span class="label">${entry.correct} of ${entry.total} fully correct</span></div>
            <div class="stat"><span class="value">${fmtDuration(entry.seconds)}</span><span class="label">Time used</span></div>
            <div class="stat"><span class="value">${weakest ? `D${weakest.id}` : '–'}</span><span class="label">Weakest domain${weakest ? ` (${weakest.short})` : ''}</span></div>
          </div>
          <p class="small muted mb0">${exam.scoreNote ?? 'The scaled score is a linear estimate (partial credit counted for labs and matching).'}</p>
        </div>
      </div>
      <div class="card mt"><h3>By domain</h3><div class="stack">${domains.map((d) => {
        const r = entry.perDomain[d.id];
        return html`<div class="dom-${d.id}"><div class="row between small"><span class="dom-tag">D${d.id} · ${d.title} <span class="faint">(${weightText(d)})</span></span><span>${r ? `${r.correct}/${r.total} · ${r.percent}%` : '—'}</span></div>${bar(r?.percent ?? 0, 'dom')}
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
      const lab = r.kind === 'lab' ? labById(r.id) : null;
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
      const lab = labById(r.id);
      host.innerHTML = String(html`<div class="card flat"><h3>${lab?.title ?? r.id}</h3><p>${r.detail.passed} of ${r.detail.total} tasks completed.</p>
        ${labsCfg ? html`<a class="btn" href="#/${labsCfg.route}/${r.id}">Practice this lab ${icon('arrowRight')}</a>` : ''}</div>`);
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
      store.update('examPrefs', (p) => ({ ...p, mode: t.dataset.mode }), DEFAULT_PREFS);
      drawSetup();
      return;
    }
    if (t.dataset.exam) {
      store.update('examPrefs', (p) => ({ ...p, exam: t.dataset.exam }), DEFAULT_PREFS);
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
      case 'begin': if (begin()) startTimer(); break;
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
    store.update('examPrefs', (p) => ({ ...p, [key]: e.target.checked }), DEFAULT_PREFS);
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
