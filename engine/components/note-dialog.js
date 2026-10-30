// "Report a problem / note" dialog for a question. Notes are listed in Settings for export.
import { html, openModal, toast } from '../ui.js';
import { getQuestionNote, setQuestionNote } from '../progress.js';

export function openQuestionNote(questionId, { onClose } = {}) {
  const existing = getQuestionNote(questionId);
  const { el, close } = openModal(String(html`
    <h3>Note on ${questionId}</h3>
    <p class="small muted">Spotted a wrong answer, an inconsistent exhibit, or something unclear? Describe it here.
      Notes stay in this browser; Settings → Question notes lists them all for copying.</p>
    <textarea rows="5" data-note placeholder="e.g. The exhibit shows Gi0/0/1 down but the explanation says it's up.">${existing}</textarea>
    <div class="row" style="justify-content:space-between;margin-top:14px">
      <button class="btn btn-danger" data-act="delete" ${existing ? '' : 'hidden'}>Delete note</button>
      <div class="row"><button class="btn btn-ghost" data-act="cancel">Cancel</button><button class="btn btn-primary" data-act="save">Save note</button></div>
    </div>`), { narrow: true, onClose });
  const textarea = el.querySelector('[data-note]');
  textarea.focus();
  el.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'save') { setQuestionNote(questionId, textarea.value); toast(textarea.value.trim() ? 'Note saved' : 'Note removed', 'ok'); close(); }
    if (act === 'delete') { setQuestionNote(questionId, ''); toast('Note removed'); close(); }
    if (act === 'cancel') close();
  });
}
