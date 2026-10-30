// Hub course cards read progress straight from the course's localStorage keys.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCourse } from '../engine/course.js';
import { readCourseStore, summarizeProgress } from '../hub/progress.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ccna = await loadCourse(pathToFileURL(join(root, 'courses/ccna/')));

function storageWith(entries) {
  const map = new Map(Object.entries(entries));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null) };
}

test('summarizes ccna:* progress: lessons, answers, accuracy, best exam, countdown, last studied', () => {
  const storage = storageWith({
    'ccna:lessonsDone': JSON.stringify({ a: '2026-10-01', b: '2026-10-02', gone: '2026-10-03' }),
    'ccna:attempts': JSON.stringify({ q1: { seen: 3, correct: 2 }, q2: { seen: 1, correct: 1 } }),
    'ccna:activity': JSON.stringify({ '2026-10-20': 4, '2026-10-27': 2, '2026-10-28': 0 }),
    'ccna:settings': JSON.stringify({ examDate: '2027-02-10', theme: 'dark' }),
    'ccna:examHistory': JSON.stringify([{ scaled: 780 }, { scaled: 845 }]),
    'other:attempts': JSON.stringify({ q9: { seen: 50, correct: 0 } }),
  });
  const p = summarizeProgress({ read: readCourseStore('ccna:', storage), course: ccna, lessonIds: ['a', 'b', 'c'], today: '2026-10-29' });
  assert.equal(p.lessonsDone, 2); // "gone" is no longer a lesson
  assert.equal(p.lessonsTotal, 3);
  assert.equal(p.attempted, 2);
  assert.equal(p.answers, 4);
  assert.equal(p.accuracy, 75);
  assert.equal(p.bestScore, 845);
  assert.deepEqual(p.nextExam, { code: '200-301', date: '2027-02-10', days: 104 });
  assert.equal(p.lastStudied, '2026-10-27');
  assert.equal(p.daysSinceStudied, 2);
});

test('empty, corrupt or blocked storage reads as a fresh start', () => {
  const corrupt = storageWith({ 'ccna:attempts': '{not json', 'ccna:examHistory': '"nope"' });
  const blocked = { getItem: () => { throw new Error('SecurityError'); } };
  [corrupt, blocked].forEach((storage) => {
    const p = summarizeProgress({ read: readCourseStore('ccna:', storage), course: ccna, lessonIds: null, today: '2026-10-29' });
    assert.deepEqual(
      [p.lessonsDone, p.lessonsTotal, p.attempted, p.accuracy, p.bestScore, p.nextExam, p.lastStudied, p.daysSinceStudied],
      [0, null, 0, null, null, null, null, null],
    );
  });
});
