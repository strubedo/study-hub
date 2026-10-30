// Exam selection for single- and multi-exam courses (e.g. AZ-800 + AZ-801 in
// one course, each domain belonging to one exam). Pure functions.
import { buildExam } from './quiz.js';
import { readiness } from './plan.js';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Default simulator modes from an exam's real format: full, half and a quarter-length sprint.
 * `labsLabel` names the labs in the full-exam blurb (CCNA: "CLI labs").
 */
export function deriveModes({ questions, labs = 0, minutes }, labsLabel = 'labs') {
  const blurb = (q, l, min, tail) => `${q} questions${l ? ` + ${tail ?? plural(l, 'lab')}` : ''} in ${min} minutes`;
  const half = { questions: Math.round(questions / 2), labs: Math.ceil(labs / 2), minutes: Math.round(minutes / 2) };
  const sprint = { questions: Math.round(questions / 4), labs: Math.min(labs, 1), minutes: Math.round(minutes / 4) };
  return {
    full: { label: 'Full exam', questions, labs, minutes, blurb: `${blurb(questions, labs, minutes, `${labs} ${labsLabel}`)} — the real pace.` },
    half: { label: 'Half exam', ...half, blurb: `${blurb(half.questions, half.labs, half.minutes)}.` },
    sprint: { label: 'Sprint', ...sprint, blurb: `${blurb(sprint.questions, sprint.labs, sprint.minutes)}.` },
  };
}

export const isMultiExam = (course) => course.exams.length > 1;

/** A domain's exam weight as published: the range when the blueprint gives one ("20-25%"), else "25%". */
export const weightText = (d) => d.weightRange ?? `${d.weight}%`;

/** The exam with this id, else the course's first exam (old history entries carry no exam id). */
export function examById(course, id) {
  return course.exams.find((e) => e.id === id) ?? course.exams[0];
}

export function examDomains(course, exam) {
  return course.domains.filter((d) => exam.domains.includes(d.id));
}

export function examForDomain(course, domainId) {
  return course.exams.find((e) => e.domains.includes(Number(domainId))) ?? null;
}

/** Questions for one exam: blueprint-weighted across that exam's domains only. */
export function buildExamFor(course, banks, exam, total, rng = Math.random) {
  const domains = examDomains(course, exam);
  const examBanks = Object.fromEntries(domains.map((d) => [d.id, banks[d.id] ?? []]));
  const weights = Object.fromEntries(domains.map((d) => [d.id, d.weight]));
  return buildExam(examBanks, weights, total, rng);
}

/** Single-exam courses keep the original `settings.examDate`; multi-exam courses store `settings.examDates[examId]`. */
export function examDateFor(course, settings, exam) {
  return isMultiExam(course) ? settings.examDates?.[exam.id] : settings.examDate;
}

/** New settings with this exam's date set (or cleared when `date` is empty). */
export function withExamDate(course, settings, exam, date) {
  if (!isMultiExam(course)) return { ...settings, examDate: date || undefined };
  const { [exam.id]: _old, ...rest } = settings.examDates ?? {};
  return { ...settings, examDates: date ? { ...rest, [exam.id]: date } : rest };
}

/** [{ exam, date }] for every exam with a date, soonest first. */
export function datedExams(course, settings) {
  return course.exams
    .map((exam) => ({ exam, date: examDateFor(course, settings, exam) }))
    .filter((x) => x.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** The next exam on or after `today`, else the most recent past one, else null. */
export function nextDatedExam(course, settings, today) {
  const dated = datedExams(course, settings);
  return dated.find((x) => x.date >= today) ?? dated[dated.length - 1] ?? null;
}

/** Readiness 0-100 for one exam, using only that exam's domains (whose weights sum to 100). */
export function examReadiness(course, exam, mastery) {
  return readiness(examDomains(course, exam), mastery);
}

export const historyFor = (course, history, exam) => history.filter((h) => examById(course, h.exam).id === exam.id);
