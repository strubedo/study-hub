// Study-plan scheduling and mastery analytics. Pure functions.

const DAY_MS = 86_400_000;
const DEFAULT_WEEKS = 12;
const MIN_WEEKS = 2;

const toUtc = (iso) => Date.parse(`${String(iso).slice(0, 10)}T00:00:00Z`);

export function daysBetween(fromIso, toIso) {
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / DAY_MS);
}

export function addDays(iso, days) {
  return new Date(toUtc(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

/**
 * lessons: ordered [{ id, minutes, domain }]. Returns { weeks: [{ index, kind, start, end, lessons, minutes }] }
 * where the last week is always a 'review' week (practice exams, weak areas, labs).
 */
export function buildPlan({ lessons, start, examDate }) {
  const span = examDate ? Math.max(1, daysBetween(start, examDate)) : DEFAULT_WEEKS * 7;
  const totalWeeks = examDate ? Math.max(MIN_WEEKS, Math.floor(span / 7)) : DEFAULT_WEEKS;
  // Normally 7-day blocks; an exam less than two weeks out compresses the blocks so review ends on exam day.
  const blockDays = Math.min(7, Math.max(1, Math.floor(span / totalWeeks)));
  const studyWeeks = totalWeeks - 1;
  const totalMinutes = lessons.reduce((s, l) => s + (l.minutes || 0), 0) || 1;
  const perWeek = totalMinutes / studyWeeks;

  const buckets = Array.from({ length: studyWeeks }, () => []);
  let cumulative = 0;
  lessons.forEach((l) => {
    const week = Math.min(studyWeeks - 1, Math.floor(cumulative / perWeek));
    buckets[week] = [...buckets[week], l];
    cumulative += l.minutes || 0;
  });

  const weeks = buckets.map((bucket, i) => ({
    index: i + 1,
    kind: 'study',
    start: addDays(start, i * blockDays),
    end: addDays(start, (i + 1) * blockDays - 1),
    lessons: bucket.map((l) => l.id),
    minutes: bucket.reduce((s, l) => s + (l.minutes || 0), 0),
    domains: [...new Set(bucket.map((l) => l.domain))],
  }));
  const reviewStart = addDays(start, studyWeeks * blockDays);
  weeks.push({
    index: totalWeeks,
    kind: 'review',
    start: reviewStart,
    end: examDate && examDate >= reviewStart ? examDate : addDays(start, totalWeeks * blockDays - 1),
    lessons: [],
    minutes: 0,
    domains: [],
  });
  return { totalWeeks, weeks };
}

/** Per-topic accuracy and coverage from the attempts map { [questionId]: { seen, correct } }. */
export function topicMastery(questions, attempts) {
  const out = {};
  questions.forEach((q) => {
    const a = attempts[q.id];
    const cur = out[q.topic] ?? { seen: 0, correct: 0, attempted: 0, count: 0 };
    out[q.topic] = {
      seen: cur.seen + (a?.seen ?? 0),
      correct: cur.correct + (a?.correct ?? 0),
      attempted: cur.attempted + (a?.seen ? 1 : 0),
      count: cur.count + 1,
    };
  });
  return Object.fromEntries(Object.entries(out).map(([topic, v]) => [topic, {
    seen: v.seen,
    correct: v.correct,
    percent: v.seen ? Math.round((v.correct / v.seen) * 100) : 0,
    coverage: v.count ? v.attempted / v.count : 0,
  }]));
}

/**
 * Readiness 0-100: blueprint-weighted accuracy, discounted by how much of each
 * domain's bank has been attempted (accuracy on 3 questions is not evidence).
 */
export function readiness(domains, mastery) {
  let score = 0;
  domains.forEach((d) => {
    const topics = d.topics.map((t) => mastery[t.id]).filter(Boolean);
    if (!topics.length) return;
    const seen = topics.reduce((s, t) => s + t.seen, 0);
    const correct = topics.reduce((s, t) => s + t.correct, 0);
    const coverage = topics.reduce((s, t) => s + t.coverage, 0) / d.topics.length;
    const accuracy = seen ? correct / seen : 0;
    score += d.weight * accuracy * Math.min(1, coverage * 1.5);
  });
  return Math.round(score);
}
