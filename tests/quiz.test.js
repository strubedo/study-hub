import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shuffle, prepareQuestion, gradeResponse, buildExam, scoreExam, normalizeFill } from '../src/lib/quiz.js';
import { mulberry32 } from '../src/lib/subnet.js';

const single = { id: 'd1-001', topic: '1.1', type: 'single', options: ['a', 'b', 'c', 'd'], answer: [2] };
const multi = { id: 'd1-002', topic: '1.1', type: 'multi', options: ['a', 'b', 'c', 'd', 'e'], answer: [0, 3] };
const order = { id: 'd1-003', topic: '1.2', type: 'order', items: ['one', 'two', 'three', 'four'] };
const match = { id: 'd1-004', topic: '1.2', type: 'match', pairs: [['A', '1'], ['B', '2'], ['C', '3']] };
const fill = { id: 'd1-005', topic: '1.3', type: 'fill', answer: ['/26', '255.255.255.192'] };

test('shuffle returns a new permutation and leaves input untouched', () => {
  const input = [1, 2, 3, 4, 5];
  const out = shuffle(input, mulberry32(1));
  assert.deepEqual(input, [1, 2, 3, 4, 5]);
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
});

test('prepareQuestion maps shuffled options back to original indices', () => {
  const p = prepareQuestion(single, mulberry32(7));
  assert.equal(p.choices.length, 4);
  const correctChoice = p.choices.find((c) => c.orig === 2);
  assert.equal(correctChoice.text, 'c');
});

test('single and multi grading is all-or-nothing', () => {
  assert.equal(gradeResponse(single, [2]).correct, true);
  assert.equal(gradeResponse(single, [1]).correct, false);
  assert.equal(gradeResponse(multi, [3, 0]).correct, true);
  assert.equal(gradeResponse(multi, [0]).correct, false);
  assert.equal(gradeResponse(multi, [0, 3, 4]).correct, false);
});

test('order grading requires exact sequence', () => {
  assert.equal(gradeResponse(order, ['one', 'two', 'three', 'four']).correct, true);
  assert.equal(gradeResponse(order, ['two', 'one', 'three', 'four']).correct, false);
});

test('match grading gives partial credit but correct only when all pairs match', () => {
  const full = gradeResponse(match, { A: '1', B: '2', C: '3' });
  assert.equal(full.correct, true);
  const partial = gradeResponse(match, { A: '1', B: '3', C: '2' });
  assert.equal(partial.correct, false);
  assert.ok(Math.abs(partial.score - 1 / 3) < 1e-9);
});

test('fill grading normalizes case and whitespace', () => {
  assert.equal(normalizeFill('  Show  IP Route '), 'show ip route');
  assert.equal(gradeResponse(fill, ' /26').correct, true);
  assert.equal(gradeResponse(fill, '255.255.255.128').correct, false);
});

test('unanswered responses are graded incorrect, never throw', () => {
  for (const q of [single, multi, order, match, fill]) {
    assert.equal(gradeResponse(q, undefined).correct, false);
  }
});

test('buildExam respects domain weights and never repeats a question', () => {
  const mk = (d, n) => Array.from({ length: n }, (_, i) => ({ id: `d${d}-${String(i).padStart(3, '0')}`, topic: `${d}.1`, type: 'single', options: ['a', 'b', 'c'], answer: [0] }));
  const banks = { 1: mk(1, 40), 2: mk(2, 40), 3: mk(3, 40), 4: mk(4, 40), 5: mk(5, 40) };
  const weights = { 1: 25, 2: 25, 3: 20, 4: 20, 5: 10 };
  const exam = buildExam(banks, weights, 100, mulberry32(3));
  assert.equal(exam.length, 100);
  assert.equal(new Set(exam.map((q) => q.id)).size, 100);
  const count = (d) => exam.filter((q) => q.id.startsWith(`d${d}-`)).length;
  assert.deepEqual([1, 2, 3, 4, 5].map(count), [25, 25, 20, 20, 10]);
});

test('buildExam backfills from other domains when a bank is short', () => {
  const mk = (d, n) => Array.from({ length: n }, (_, i) => ({ id: `d${d}-${String(i).padStart(3, '0')}`, topic: `${d}.1`, type: 'single', options: ['a', 'b', 'c'], answer: [0] }));
  const banks = { 1: mk(1, 5), 2: mk(2, 50) };
  const exam = buildExam(banks, { 1: 50, 2: 50 }, 20, mulberry32(9));
  assert.equal(exam.length, 20);
  assert.equal(exam.filter((q) => q.id.startsWith('d1-')).length, 5);
});

test('scoreExam reports per-domain results and an approximate scaled score', () => {
  const results = [
    { domain: 1, correct: true, score: 1 }, { domain: 1, correct: false, score: 0 },
    { domain: 2, correct: true, score: 1 }, { domain: 2, correct: true, score: 1 },
  ];
  const s = scoreExam(results);
  assert.equal(s.correct, 3);
  assert.equal(s.total, 4);
  assert.equal(s.percent, 75);
  assert.deepEqual(s.perDomain[1], { correct: 1, total: 2, percent: 50 });
  assert.equal(s.scaled, 825);
});
