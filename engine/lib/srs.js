// SM-2 style spaced repetition. States are plain objects; review() returns a new one.

export const GRADES = Object.freeze({ AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 });

const DAY_MS = 86_400_000;
const RELEARN_MS = 10 * 60_000;
const MIN_EASE = 1.3;

export function newCardState() {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: 0 };
}

export function isDue(state, now = Date.now()) {
  return !state || state.due <= now;
}

function nextInterval(state, grade, reps) {
  if (reps === 1) return grade === GRADES.EASY ? 2 : 1;
  if (reps === 2) return grade === GRADES.HARD ? 2 : grade === GRADES.EASY ? 4 : 3;
  const factor = grade === GRADES.HARD ? 1.2 : grade === GRADES.EASY ? state.ease * 1.3 : state.ease;
  return Math.max(state.interval + 1, Math.round(state.interval * factor));
}

export function review(state, grade, now = Date.now()) {
  const s = state ?? newCardState();
  if (grade === GRADES.AGAIN) {
    return { ...s, reps: 0, interval: 0, lapses: s.lapses + 1, ease: Math.max(MIN_EASE, s.ease - 0.2), due: now + RELEARN_MS, last: now };
  }
  const reps = s.reps + 1;
  const easeDelta = grade === GRADES.HARD ? -0.15 : grade === GRADES.EASY ? 0.15 : 0;
  const interval = nextInterval(s, grade, reps);
  return { ...s, reps, interval, ease: Math.max(MIN_EASE, s.ease + easeDelta), due: now + interval * DAY_MS, last: now };
}

/** Human label for the next interval a grade would produce (for button captions). */
export function previewInterval(state, grade, now = Date.now()) {
  const next = review(state, grade, now);
  const ms = next.due - now;
  if (ms < DAY_MS) return `${Math.round(ms / 60_000)}m`;
  const days = Math.round(ms / DAY_MS);
  return days >= 30 ? `${Math.round(days / 30)}mo` : `${days}d`;
}
