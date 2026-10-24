import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newCardState, review, isDue, GRADES } from '../src/lib/srs.js';
import { buildPlan, topicMastery, daysBetween } from '../src/lib/plan.js';

const NOW = Date.parse('2026-10-24T12:00:00Z');
const DAY = 86_400_000;

test('new card is due immediately', () => {
  assert.equal(isDue(newCardState(), NOW), true);
});

test('"again" resets interval and keeps the card due today', () => {
  const s = review(newCardState(), GRADES.AGAIN, NOW);
  assert.equal(s.reps, 0);
  assert.ok(s.due - NOW <= 10 * 60_000);
  assert.ok(s.ease >= 1.3);
});

test('successive "good" reviews grow the interval', () => {
  let s = review(newCardState(), GRADES.GOOD, NOW);
  assert.equal(s.interval, 1);
  s = review(s, GRADES.GOOD, NOW + DAY);
  assert.equal(s.interval, 3);
  const prev = s.interval;
  s = review(s, GRADES.GOOD, NOW + 4 * DAY);
  assert.ok(s.interval > prev);
});

test('review never mutates the previous state', () => {
  const s0 = Object.freeze(newCardState());
  assert.doesNotThrow(() => review(s0, GRADES.EASY, NOW));
});

test('daysBetween counts calendar days', () => {
  assert.equal(daysBetween('2026-10-24', '2026-10-31'), 7);
});

test('buildPlan spreads lessons across weeks and reserves a final review week', () => {
  const lessons = Array.from({ length: 12 }, (_, i) => ({ id: `L${i}`, minutes: 30, domain: (i % 5) + 1 }));
  const plan = buildPlan({ lessons, start: '2026-10-24', examDate: '2027-02-20' });
  const weeks = plan.weeks;
  assert.ok(weeks.length >= 2);
  assert.equal(weeks.at(-1).kind, 'review');
  const scheduled = weeks.flatMap((w) => w.lessons);
  assert.deepEqual(scheduled, lessons.map((l) => l.id));
});

test('buildPlan never schedules the review week after a close exam date', () => {
  const lessons = [{ id: 'a', minutes: 30, domain: 1 }, { id: 'b', minutes: 30, domain: 2 }];
  for (const examDate of ['2026-10-30', '2026-11-08']) {
    const plan = buildPlan({ lessons, start: '2026-10-24', examDate });
    const review = plan.weeks.at(-1);
    assert.ok(review.start <= review.end, `${examDate}: review ${review.start} → ${review.end}`);
    assert.equal(review.end, examDate);
    plan.weeks.forEach((w) => assert.ok(w.start <= examDate, `week ${w.index} starts after exam`));
  }
});

test('buildPlan with no exam date defaults to a 12-week plan', () => {
  const lessons = [{ id: 'a', minutes: 10, domain: 1 }];
  const plan = buildPlan({ lessons, start: '2026-10-24' });
  assert.equal(plan.weeks.length, 12);
});

test('topicMastery aggregates question attempts by topic', () => {
  const questions = [{ id: 'q1', topic: '1.1' }, { id: 'q2', topic: '1.1' }, { id: 'q3', topic: '3.3' }];
  const attempts = { q1: { seen: 2, correct: 2 }, q2: { seen: 2, correct: 0 }, q3: { seen: 1, correct: 1 } };
  const m = topicMastery(questions, attempts);
  assert.deepEqual(m['1.1'], { seen: 4, correct: 2, percent: 50, coverage: 1 });
  assert.equal(m['3.3'].percent, 100);
});
