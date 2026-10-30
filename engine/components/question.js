// Renders one prepared question (see lib/quiz.prepareQuestion) and collects
// the response. Used by the practice bank and the exam simulator.
import { html, raw, md, icon, esc } from '../ui.js';
import { gradeResponse } from '../lib/quiz.js';

const TYPE_LABEL = {
  single: 'Multiple choice', multi: 'Multiple answer', order: 'Drag and drop — order', match: 'Drag and drop — match', fill: 'Fill in the blank',
};
const LETTERS = 'ABCDEFGH';
const DIFFICULTY = ['', 'Easy', 'Exam-level', 'Hard'];

const inlineMd = (s) => raw(md(s, { inline: true }));

function initialResponse(pq) {
  switch (pq.type) {
    case 'single':
    case 'multi': return [];
    case 'order': return [...pq.shuffledItems];
    case 'match': return {};
    default: return '';
  }
}

function renderBody(pq, response) {
  switch (pq.type) {
    case 'single':
    case 'multi': {
      const kind = pq.type === 'single' ? 'radio' : 'checkbox';
      return html`<div class="options" role="${pq.type === 'single' ? 'radiogroup' : 'group'}">${pq.choices.map((c, i) => html`
        <label class="option ${response.includes(c.orig) ? 'selected' : ''}" data-orig="${c.orig}">
          <input type="${kind}" name="opt" value="${c.orig}" ${response.includes(c.orig) ? 'checked' : ''}>
          <span class="letter">${LETTERS[i]}.</span>
          <span>${inlineMd(c.text)}</span>
        </label>`)}</div>`;
    }
    case 'order':
      return html`<p class="small muted">Drag the items (or use the arrows) into the correct order.</p>
        <ol class="order-list">${response.map((item, i) => html`
          <li class="order-item" draggable="true" data-item="${item}">
            <span class="handle">⋮⋮</span><span class="pos">${i + 1}</span><span class="grow">${inlineMd(item)}</span>
            <button class="btn btn-ghost btn-sm" data-move="-1" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn btn-ghost btn-sm" data-move="1" aria-label="Move down" ${i === response.length - 1 ? 'disabled' : ''}>↓</button>
          </li>`)}</ol>`;
    case 'match':
      return html`<p class="small muted">Match each item on the left with one on the right. Every right-hand option belongs to exactly one row.</p>
        <div class="match-grid">${pq.lefts.map((left) => html`
          <div class="match-left">${inlineMd(left)}</div>
          <select data-left="${left}" aria-label="Match for ${left}">
            <option value="">— select —</option>
            ${pq.rights.map((r) => html`<option value="${r}" ${response[left] === r ? 'selected' : ''}>${r}</option>`)}
          </select>`)}</div>`;
    case 'fill':
      return html`<input type="text" class="answer-input" data-fill autocomplete="off" spellcheck="false" placeholder="Type your answer" value="${response}">`;
    default:
      return html`<p class="muted">Unsupported question type.</p>`;
  }
}

export function correctAnswerText(q) {
  switch (q.type) {
    case 'single':
    case 'multi':
      return `<ul>${q.answer.map((i) => `<li>${md(q.options[i], { inline: true })}</li>`).join('')}</ul>`;
    case 'order':
      return `<ol>${q.items.map((i) => `<li>${md(i, { inline: true })}</li>`).join('')}</ol>`;
    case 'match':
      return `<ul>${q.pairs.map(([l, r]) => `<li>${md(l, { inline: true })} → ${esc(r)}</li>`).join('')}</ul>`;
    case 'fill':
      return `<p><code>${esc(q.answer[0])}</code>${q.answer.length > 1 ? ` <span class="muted small">(also accepted: ${q.answer.slice(1).map(esc).join(', ')})</span>` : ''}</p>`;
    default:
      return '';
  }
}

/**
 * mountQuestion(el, pq, opts) → { getResponse, isAnswered, reveal, destroy }
 * opts: { number, total, response, onChange, meta (html), locked, showTopic }
 */
export function mountQuestion(el, pq, opts = {}) {
  let response = opts.response ?? initialResponse(pq);
  let locked = Boolean(opts.locked);
  // An order question starts with a (wrong) shuffled answer; only count it once the user rearranges it.
  let touched = opts.response !== undefined;
  const need = pq.type === 'multi' ? pq.answer.length : 1;
  const showTopic = opts.showTopic !== false;

  const lockInputs = () => {
    el.querySelectorAll('input, select, button[data-move]').forEach((n) => { n.disabled = true; });
    el.querySelectorAll('.option, .order-item').forEach((n) => { n.classList.add('locked'); n.draggable = false; });
  };

  const draw = () => {
    el.innerHTML = String(html`<div class="q-card">
      <div class="q-meta">
        ${opts.number ? html`<span class="badge badge-accent">Question ${opts.number}${opts.total ? ` of ${opts.total}` : ''}</span>` : ''}
        <span class="badge">${TYPE_LABEL[pq.type]}</span>
        ${showTopic ? html`<span class="badge">Topic ${pq.topic}</span><span class="badge">${DIFFICULTY[pq.difficulty] ?? ''}</span>` : ''}
        ${opts.meta ?? ''}
      </div>
      <div class="q-stem">${raw(md(pq.stem))}</div>
      ${pq.exhibit ? html`<div class="exhibit-label">Exhibit</div><pre class="exhibit">${pq.exhibit}</pre>` : ''}
      <div class="q-body">${renderBody(pq, response)}</div>
      <div class="q-feedback"></div>
    </div>`);
    if (locked) lockInputs();
  };

  const emit = () => {
    touched = true;
    opts.onChange?.(response);
  };

  const onInput = (e) => {
    if (locked) return;
    const t = e.target;
    if (t.name === 'opt') {
      // Checkboxes/radios fire both input and change; handle once.
      if (e.type !== 'change') return;
      const v = Number(t.value);
      if (pq.type === 'single') {
        response = [v];
      } else if (t.checked && response.length >= need) {
        t.checked = false;
        return;
      } else {
        response = t.checked ? [...new Set([...response, v])] : response.filter((x) => x !== v);
      }
      el.querySelectorAll('.option').forEach((o) => o.classList.toggle('selected', response.includes(Number(o.dataset.orig))));
      emit();
    } else if (t.dataset.left !== undefined) {
      response = { ...response, [t.dataset.left]: t.value || undefined };
      emit();
    } else if (t.dataset.fill !== undefined) {
      response = t.value;
      emit();
    }
  };

  const move = (from, to) => {
    if (from < 0 || to < 0 || to >= response.length || from === to) return;
    const next = [...response];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    response = next;
    draw();
    emit();
  };

  const onClick = (e) => {
    const btn = e.target.closest('[data-move]');
    if (!btn || locked) return;
    const idx = response.indexOf(btn.closest('.order-item').dataset.item);
    move(idx, idx + Number(btn.dataset.move));
  };

  let dragFrom = -1;
  const onDragStart = (e) => {
    const li = e.target.closest('.order-item');
    if (!li || locked) return;
    dragFrom = response.indexOf(li.dataset.item);
    li.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e) => { if (dragFrom >= 0) e.preventDefault(); };
  const onDrop = (e) => {
    const li = e.target.closest('.order-item');
    if (!li || dragFrom < 0) return;
    e.preventDefault();
    const from = dragFrom;
    dragFrom = -1;
    move(from, response.indexOf(li.dataset.item));
  };
  const onDragEnd = () => { dragFrom = -1; el.querySelectorAll('.dragging').forEach((n) => n.classList.remove('dragging')); };

  const handlers = { change: onInput, input: onInput, click: onClick, dragstart: onDragStart, dragover: onDragOver, drop: onDrop, dragend: onDragEnd };
  Object.entries(handlers).forEach(([evt, fn]) => el.addEventListener(evt, fn));
  draw();

  return {
    getResponse: () => response,
    isAnswered() {
      if (pq.type === 'single' || pq.type === 'multi') return response.length === need;
      if (pq.type === 'match') return pq.lefts.every((l) => response[l]);
      if (pq.type === 'fill') return String(response).trim().length > 0;
      return touched;
    },
    /** True once the user has interacted at all (partial answers count). */
    isTouched: () => touched,
    /** Grades, locks, decorates the UI and (optionally) shows the explanation. */
    reveal({ showExplanation = true, lessonHref } = {}) {
      const grade = gradeResponse(pq, response);
      locked = true;
      lockInputs();
      if (pq.type === 'single' || pq.type === 'multi') {
        el.querySelectorAll('.option').forEach((o) => {
          const orig = Number(o.dataset.orig);
          if (pq.answer.includes(orig)) o.classList.add('correct');
          else if (response.includes(orig)) o.classList.add('incorrect');
        });
      } else if (pq.type === 'order') {
        el.querySelectorAll('.order-item').forEach((li, i) => li.classList.add(li.dataset.item === pq.items[i] ? 'correct' : 'incorrect'));
      } else if (pq.type === 'match') {
        el.querySelectorAll('select[data-left]').forEach((s) => {
          const right = pq.pairs.find((p) => p[0] === s.dataset.left)[1];
          s.classList.add(s.value === right ? 'correct' : 'incorrect');
        });
      }
      if (showExplanation) {
        const verdict = grade.correct ? 'Correct' : grade.score > 0 ? `Partially correct (${Math.round(grade.score * 100)}%)` : 'Incorrect';
        el.querySelector('.q-feedback').innerHTML = `<div class="feedback ${grade.correct ? 'good' : 'bad'}">
          <h3>${icon(grade.correct ? 'check' : 'x')} ${verdict}</h3>
          ${grade.correct ? '' : `<p class="mb0"><strong>Correct answer:</strong></p>${correctAnswerText(pq)}`}
          <div class="prose" style="max-width:none">${md(pq.explanation)}</div>
          ${lessonHref ? `<p class="small mb0"><a href="${esc(lessonHref)}">Review the lesson →</a></p>` : ''}
        </div>`;
      }
      return grade;
    },
    destroy() {
      Object.entries(handlers).forEach(([evt, fn]) => el.removeEventListener(evt, fn));
    },
  };
}
