// Quick progress for a hub course card, read straight from that course's
// localStorage keys (same keys and shapes the engine writes; see engine/progress.js).
// Read-only: the hub never writes course data. Pure apart from readCourseStore().
import { daysBetween } from '../engine/lib/plan.js';
import { nextDatedExam } from '../engine/lib/exams.js';

/** (key) => parsed value or null, for keys under `prefix`. Corrupt or blocked storage reads as null. */
export function readCourseStore(prefix, storage = globalThis.localStorage) {
  return (key) => {
    try {
      const raw = storage.getItem(prefix + key);
      return raw === null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  };
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Latest day in the activity map ({ 'YYYY-MM-DD': count }) with any activity, or null. */
function lastActiveDay(activity) {
  return Object.entries(activity)
    .filter(([day, n]) => /^\d{4}-\d{2}-\d{2}$/.test(day) && n > 0)
    .map(([day]) => day)
    .sort()
    .pop() ?? null;
}

const WEEK_DAYS = 7;

/** Activity total and number of active days in the 7 days ending today. */
function weekStats(activity, today) {
  const inWeek = Object.entries(activity).filter(([day, n]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !(n > 0)) return false;
    const age = daysBetween(day, today);
    return age >= 0 && age < WEEK_DAYS;
  });
  return { total: inWeek.reduce((sum, [, n]) => sum + n, 0), days: inWeek.length };
}

/**
 * read: (key) => value | null. course: normalized course config. lessonIds: ids of the course's
 * current lessons (null when unknown). today: 'YYYY-MM-DD'.
 */
export function summarizeProgress({ read, course, lessonIds, today }) {
  const map = (key) => { const v = read(key); return isObject(v) ? v : {}; };
  const lessonsDone = map('lessonsDone');
  const attempts = map('attempts');
  const activity = map('activity');
  const settings = map('settings');
  const storedHistory = read('examHistory');
  const history = Array.isArray(storedHistory) ? storedHistory : [];

  const answers = Object.values(attempts).reduce((a, x) => ({
    seen: a.seen + (Number(x?.seen) || 0),
    correct: a.correct + (Number(x?.correct) || 0),
  }), { seen: 0, correct: 0 });
  const next = nextDatedExam(course, settings, today);
  const lastStudied = lastActiveDay(activity);
  const scores = history.map((h) => h?.scaled).filter(Number.isFinite);
  const week = weekStats(activity, today);

  return {
    lessonsDone: lessonIds ? lessonIds.filter((id) => lessonsDone[id]).length : Object.keys(lessonsDone).length,
    lessonsTotal: lessonIds ? lessonIds.length : null,
    attempted: Object.keys(attempts).length,
    answers: answers.seen,
    accuracy: answers.seen ? Math.round((answers.correct / answers.seen) * 100) : null,
    bestScore: scores.length ? Math.max(...scores) : null,
    exams: history.length,
    nextExam: next ? { code: next.exam.code, date: next.date, days: daysBetween(today, next.date) } : null,
    lastStudied,
    daysSinceStudied: lastStudied ? daysBetween(lastStudied, today) : null,
    weekActivity: week.total,
    weekDays: week.days,
    nextLessonId: lessonIds ? lessonIds.find((id) => !lessonsDone[id]) ?? null : null,
  };
}

/**
 * Totals across hub cards ([{ id, progress }] with progress from summarizeProgress) for the
 * welcome page. Started courses are ordered most recently studied first; accuracy is weighted
 * by answers.
 */
export function summarizeHub(cards) {
  const started = cards
    .filter((c) => c.progress.lastStudied)
    .sort((a, b) => b.progress.lastStudied.localeCompare(a.progress.lastStudied));
  const sum = (key) => cards.reduce((total, c) => total + (Number(c.progress[key]) || 0), 0);
  const answers = sum('answers');
  const correct = cards.reduce((total, c) => total + (c.progress.accuracy === null ? 0 : (c.progress.accuracy / 100) * (c.progress.answers || 0)), 0);
  return {
    courses: cards.length,
    continueId: started[0]?.id ?? null,
    startedIds: started.map((c) => c.id),
    lessonsDone: sum('lessonsDone'),
    answers,
    accuracy: answers ? Math.round((correct / answers) * 100) : null,
    weekActivity: sum('weekActivity'),
  };
}
