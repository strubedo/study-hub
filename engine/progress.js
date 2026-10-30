// Progress bookkeeping on top of the store. Keys:
//   attempts:     { [questionId]: { seen, correct, last: bool, at: ISO } }
//   flags:        { [questionId]: true }
//   lessonsDone:  { [lessonId]: ISO }
//   videosWatched:{ [videoId]: ISO }
//   examHistory:  [{ at, mode, scaled, percent, correct, total, perDomain, seconds }]
import store from './store.js';

export function recordAttempt(questionId, correct) {
  const at = new Date().toISOString();
  store.update('attempts', (all) => {
    const cur = all[questionId] ?? { seen: 0, correct: 0 };
    return { ...all, [questionId]: { seen: cur.seen + 1, correct: cur.correct + (correct ? 1 : 0), last: correct, at } };
  }, {});
}

export function toggleFlag(questionId) {
  let flagged = false;
  store.update('flags', (f) => {
    flagged = !f[questionId];
    const { [questionId]: _removed, ...rest } = f;
    return flagged ? { ...rest, [questionId]: true } : rest;
  }, {});
  return flagged;
}

export function setDone(key, id, done) {
  store.update(key, (m) => {
    const { [id]: _removed, ...rest } = m;
    return done ? { ...rest, [id]: new Date().toISOString() } : rest;
  }, {});
}

/** questionNotes: { [questionId]: { text, at: ISO } }. Empty text removes the note. */
export function setQuestionNote(questionId, text) {
  const trimmed = String(text ?? '').trim();
  store.update('questionNotes', (notes) => {
    const { [questionId]: _removed, ...rest } = notes;
    return trimmed ? { ...rest, [questionId]: { text: trimmed, at: new Date().toISOString() } } : rest;
  }, {});
}

export const getQuestionNote = (questionId) => store.get('questionNotes', {})[questionId]?.text ?? '';

export const isLessonDone = (id) => Boolean(store.get('lessonsDone', {})[id]);
export const isVideoWatched = (id) => Boolean(store.get('videosWatched', {})[id]);
