// Settings: exam date, plan start, theme, question notes, backup/restore, reset.
import { html, icon, toast, confirmDialog, todayIso } from '../ui.js';
import { openQuestionNote } from '../components/note-dialog.js';
import { examDateFor, withExamDate, examById } from '../lib/exams.js';

/** One date field per exam; a warning when the date falls before the blueprint this course targets. */
function examDateFields(course, s) {
  const multi = course.exams.length > 1;
  return html`${course.exams.map((e) => {
    const date = examDateFor(course, s, e) ?? '';
    const warn = e.dateWarning && date && date < e.dateWarning.before;
    return html`<label class="field">${multi ? `${e.code} exam date` : 'Exam date'}<input type="date" data-exam-date="${e.id}" value="${date}" min="${todayIso()}"></label>
      ${warn ? html`<p class="small" style="color:var(--warn);margin:0">${e.dateWarning.message}</p>` : ''}`;
  })}`;
}

export async function render(root, params, ctx) {
  const { store, course } = ctx;

  function draw() {
    const s = store.get('settings', {});
    root.innerHTML = String(html`
      <div class="page-header"><div><div class="eyebrow">Settings</div><h1>Settings & data</h1>
        <p>Everything is stored locally in this browser. Nothing leaves your machine.</p></div></div>
      <div class="grid grid-2" style="align-items:start">
        <div class="card stack">
          <h3>Exam & plan</h3>
          ${examDateFields(course, s)}
          <label class="field">Study plan start<input type="date" data-set="planStart" value="${s.planStart ?? todayIso()}"></label>
          <label class="field">Theme<select data-set="theme"><option value="dark" ${s.theme !== 'light' ? 'selected' : ''}>Dark</option><option value="light" ${s.theme === 'light' ? 'selected' : ''}>Light</option></select></label>
        </div>
        <div class="card stack">
          <h3>Backup</h3>
          <p class="small muted mb0">Progress lives in this browser's local storage. Export it regularly. Clearing browser data or switching browsers starts you fresh.</p>
          <div class="row">
            <button class="btn" data-act="export">${icon('download')} Export progress</button>
            <label class="btn">${icon('upload')} Import progress<input type="file" accept="application/json" data-act="import" hidden></label>
          </div>
          <hr class="divider">
          <h3>Danger zone</h3>
          <div class="row">
            <button class="btn btn-danger" data-act="reset-exams">Clear exam history</button>
            <button class="btn btn-danger" data-act="reset-all">Reset all progress</button>
          </div>
        </div>
      </div>
      ${notesCard()}`);
  }

  function notesCard() {
    const notes = Object.entries(store.get('questionNotes', {})).sort((a, b) => b[1].at.localeCompare(a[1].at));
    return html`<div class="card mt">
      <div class="card-title"><h3>Question notes <span class="muted small">(${notes.length})</span></h3>
        ${notes.length ? html`<button class="btn btn-sm" data-act="copy-notes">${icon('download', 15)} Copy all as text</button>` : ''}</div>
      ${notes.length ? html`<div class="list">${notes.map(([id, n]) => html`
        <div class="list-item"><span class="badge">${id}</span>
          <span class="grow"><span class="title small" style="font-weight:500;white-space:pre-wrap">${n.text}</span><span class="sub">${new Date(n.at).toLocaleString()}</span></span>
          <a class="btn btn-ghost btn-sm" href="#/practice?q=${id}">Open</a>
          <button class="btn btn-ghost btn-sm" data-edit-note="${id}">Edit</button></div>`)}</div>`
        : html`<p class="muted small mb0">Use the <strong>Note</strong> button on any question to flag a possible error or jot a reminder. Notes collect here so you can copy them in one go.</p>`}
    </div>`;
  }

  root.addEventListener('change', async (e) => {
    const examId = e.target.dataset.examDate;
    if (examId) {
      store.update('settings', (st) => withExamDate(course, st, examById(course, examId), e.target.value), {});
      toast('Saved', 'ok');
      draw();
      return;
    }
    const key = e.target.dataset.set;
    if (key) {
      const value = e.target.value || undefined;
      if (key === 'theme') ctx.applyTheme(value);
      else store.update('settings', (s) => ({ ...s, [key]: value }), {});
      toast('Saved', 'ok');
      draw();
      return;
    }
    if (e.target.dataset.act === 'import' && e.target.files[0]) {
      try {
        const payload = JSON.parse(await e.target.files[0].text());
        if (!(await confirmDialog('Importing replaces matching progress data in this browser. Continue?', { okLabel: 'Import' }))) return;
        store.importAll(payload);
        toast('Progress imported', 'ok');
        setTimeout(() => location.reload(), 600);
      } catch (err) {
        toast(`Import failed: ${err.message}`, 'err');
      }
    }
  });

  root.addEventListener('click', async (e) => {
    const editId = e.target.closest('[data-edit-note]')?.dataset.editNote;
    if (editId) { openQuestionNote(editId, { onClose: draw }); return; }
    const act = e.target.closest('button[data-act]')?.dataset.act;
    if (act === 'copy-notes') {
      const text = Object.entries(store.get('questionNotes', {})).map(([id, n]) => `${id}: ${n.text}`).join('\n\n');
      try {
        await navigator.clipboard.writeText(text);
        toast('Notes copied to clipboard', 'ok');
      } catch {
        toast('Clipboard unavailable. Select the notes on this page and copy them manually.', 'err');
      }
    }
    if (act === 'export') {
      const blob = new Blob([JSON.stringify(store.exportAll(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${course.backupName}-${todayIso()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    if (act === 'reset-exams' && await confirmDialog('Delete all practice-exam history?', { okLabel: 'Delete', danger: true })) {
      store.set('examHistory', []);
      store.set('examInProgress', null);
      toast('Exam history cleared');
    }
    if (act === 'reset-all' && await confirmDialog('Erase ALL progress (lessons, answers, flashcards, labs, exams)? Export first if unsure.', { okLabel: 'Erase everything', danger: true })) {
      const theme = store.get('settings', {}).theme;
      store.clearAll();
      store.set('settings', { theme, planStart: todayIso() });
      toast('All progress erased');
      draw();
    }
  });

  draw();
}
