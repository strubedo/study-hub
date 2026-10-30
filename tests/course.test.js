// Course config normalization, navigation, multi-exam selection and the hub registry.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeCourse, loadCourse, courseUrl, HUB_PREFIX } from '../engine/course.js';
import { buildNav } from '../engine/nav.js';
import {
  deriveModes, examById, examDomains, examForDomain, buildExamFor, examDateFor, withExamDate, nextDatedExam, historyFor,
} from '../engine/lib/exams.js';
import { scoreExam } from '../engine/lib/quiz.js';
import { readiness } from '../engine/lib/plan.js';
import { mulberry32 } from '../courses/ccna/plugins/lib/subnet.js';
import registry from '../courses/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ccnaBase = pathToFileURL(join(root, 'courses/ccna/'));

const topic = (id) => ({ id, verb: 'Configure', title: `Topic ${id}` });

/** A two-exam course in the shape of AZ-800 + AZ-801: each domain tagged with its exam. */
function hybridConfig(overrides = {}) {
  return {
    id: 'hybrid',
    name: 'Hybrid Prep',
    title: 'AZ-800 + AZ-801',
    storePrefix: 'hybrid:',
    domains: [
      { id: 1, exam: 'az-800', weight: 60, title: 'Identity', topics: [topic('1.1'), topic('1.2')] },
      { id: 2, exam: 'az-800', weight: 40, title: 'Compute', topics: [topic('2.1')] },
      { id: 3, exam: 'az-801', weight: 50, title: 'Security', topics: [topic('3.1')] },
      { id: 4, exam: 'az-801', weight: 50, title: 'Migration', topics: [topic('4.1')] },
    ],
    exams: [
      { id: 'az-800', code: 'AZ-800', questionCount: 10, minutes: 100, scoreMin: 1, scoreMax: 1000, passScore: 700 },
      { id: 'az-801', code: 'AZ-801', questionCount: 8, minutes: 100, scoreMin: 1, scoreMax: 1000, passScore: 700 },
    ],
    ...overrides,
  };
}

function banksFor(course, perDomain = 12) {
  return Object.fromEntries(course.domains.map((d) => [d.id, Array.from({ length: perDomain }, (_, i) => ({
    id: `d${d.id}-${String(i + 1).padStart(3, '0')}`, topic: d.topics[i % d.topics.length].id, type: 'single',
  }))]));
}

test('CCNA config loads with the original store prefix, one exam and its plugins', async () => {
  const course = await loadCourse(ccnaBase);
  assert.equal(course.storePrefix, 'ccna:');
  assert.equal(course.id, 'ccna');
  assert.deepEqual(course.legacyBackupApps, ['ccna-prep']);
  assert.equal(course.exams.length, 1);
  const [exam] = course.exams;
  assert.deepEqual({ q: exam.questionCount, labs: exam.labs, min: exam.minutes }, { q: 100, labs: 3, min: 120 });
  assert.deepEqual(exam.domains, [1, 2, 3, 4, 5]);
  assert.deepEqual({ min: exam.scale.min, max: exam.scale.max, pass: exam.scale.pass }, { min: 300, max: 1000, pass: 825 });
  assert.equal(courseUrl(course, 'content/blueprint.js'), new URL('content/blueprint.js', ccnaBase).href);
  assert.equal(course.labs.route, 'labs');
});

test('CCNA simulator modes match the original full / half / sprint formats', async () => {
  const { modes } = (await loadCourse(ccnaBase)).exams[0];
  assert.deepEqual(modes.full, { label: 'Full exam', questions: 100, labs: 3, minutes: 120, blurb: '100 questions + 3 CLI labs in 120 minutes — the real pace.' });
  assert.deepEqual(modes.half, { label: 'Half exam', questions: 50, labs: 2, minutes: 60, blurb: '50 questions + 2 labs in 60 minutes.' });
  assert.deepEqual(modes.sprint, { label: 'Sprint', questions: 25, labs: 1, minutes: 30, blurb: '25 questions + 1 lab in 30 minutes.' });
  assert.equal(deriveModes({ questions: 40, minutes: 60 }).full.blurb, '40 questions in 60 minutes — the real pace.');
});

test('CCNA navigation keeps the original order, with plugin routes in place', async () => {
  const paths = buildNav(await loadCourse(ccnaBase)).map((n) => n.group ?? n.path);
  assert.deepEqual(paths, ['Study', '', 'plan', 'learn', 'videos', 'guide', 'Practice', 'practice', 'exam', 'labs', 'subnetting', 'flashcards', 'Tools', 'reference', 'settings']);
});

test('nav hides pages a course has no content for and appends plugins to their group', () => {
  const course = normalizeCourse(hybridConfig({
    nav: [{ path: 'ps', label: 'PowerShell', icon: 'terminal', group: 'Tools', module: 'plugins/ps.js' }],
  }), 'https://example.test/courses/hybrid/');
  const paths = buildNav(course).map((n) => n.group ?? n.path);
  assert.deepEqual(paths, ['Study', '', 'plan', 'learn', 'Practice', 'practice', 'exam', 'flashcards', 'Tools', 'settings', 'ps']);
});

test('multi-exam: domains resolve to their exam and exams build only from their own domains', () => {
  const course = normalizeCourse(hybridConfig(), 'https://example.test/courses/hybrid/');
  assert.deepEqual(course.exams.map((e) => e.domains), [[1, 2], [3, 4]]);
  assert.equal(examForDomain(course, 3).id, 'az-801');
  assert.deepEqual(examDomains(course, examById(course, 'az-801')).map((d) => d.id), [3, 4]);
  const banks = banksFor(course);
  const az800 = buildExamFor(course, banks, examById(course, 'az-800'), 10, mulberry32(7));
  assert.equal(az800.length, 10);
  assert.ok(az800.every((q) => [1, 2].includes(q.domain)), 'AZ-800 exam drew a question from an AZ-801 domain');
  assert.equal(az800.filter((q) => q.domain === 1).length, 6); // 60% weight
  const az801 = buildExamFor(course, banks, examById(course, 'az-801'), 8, mulberry32(7));
  assert.ok(az801.every((q) => [3, 4].includes(q.domain)));
  assert.equal(new Set(az801.map((q) => q.id)).size, 8);
});

test('multi-exam: unknown exam ids (old history entries) fall back to the first exam', () => {
  const course = normalizeCourse(hybridConfig(), 'https://example.test/courses/hybrid/');
  assert.equal(examById(course, undefined).id, 'az-800');
  const history = [{ exam: 'az-801', scaled: 700 }, { scaled: 650 }, { exam: 'az-800', scaled: 800 }];
  assert.deepEqual(historyFor(course, history, examById(course, 'az-800')).map((h) => h.scaled), [650, 800]);
});

test('exam dates: single-exam keeps settings.examDate; multi-exam uses settings.examDates', async () => {
  const ccna = await loadCourse(ccnaBase);
  const set = withExamDate(ccna, { theme: 'dark' }, ccna.exams[0], '2027-03-01');
  assert.deepEqual(set, { theme: 'dark', examDate: '2027-03-01' });
  assert.equal(examDateFor(ccna, set, ccna.exams[0]), '2027-03-01');

  const course = normalizeCourse(hybridConfig(), 'https://example.test/courses/hybrid/');
  let s = withExamDate(course, {}, examById(course, 'az-801'), '2027-01-10');
  s = withExamDate(course, s, examById(course, 'az-800'), '2026-12-01');
  assert.deepEqual(s, { examDates: { 'az-801': '2027-01-10', 'az-800': '2026-12-01' } });
  assert.equal(nextDatedExam(course, s, '2026-11-01').exam.id, 'az-800');
  assert.equal(nextDatedExam(course, s, '2026-12-15').exam.id, 'az-801');
  assert.equal(nextDatedExam(course, s, '2027-06-01').exam.id, 'az-801'); // all past: most recent
  assert.deepEqual(withExamDate(course, s, examById(course, 'az-800'), ''), { examDates: { 'az-801': '2027-01-10' } });
});

test('config validation fails loudly on mistakes', () => {
  const base = 'https://example.test/courses/hybrid/';
  const bad = (overrides, re) => assert.throws(() => normalizeCourse(hybridConfig(overrides), base), re);
  bad({ storePrefix: 'hybrid' }, /storePrefix/);
  bad({ storePrefix: HUB_PREFIX }, /reserved for the hub/);
  bad({ domains: hybridConfig().domains.map((d) => (d.id === 2 ? { ...d, exam: 'az-999' } : d)) }, /unknown exam "az-999"/);
  bad({ domains: hybridConfig().domains.map((d) => (d.id === 2 ? { ...d, weight: 0 } : d)) }, /positive `weight`/);
  bad({ exams: [{ ...hybridConfig().exams[0], scoreMin: 1000, scoreMax: 1 }, hybridConfig().exams[1]] }, /scoreMin < scoreMax/);
  bad({ exams: [{ ...hybridConfig().exams[0], passScore: 1200 }, hybridConfig().exams[1]] }, /outside 1-1000/);
  bad({ exams: [{ ...hybridConfig().exams[0], questionCount: undefined }, hybridConfig().exams[1]] }, /questionCount/);
  bad({ domains: hybridConfig().domains.map(({ exam: _e, ...d }) => d) }, /has no domains/);
  bad({ exams: [{ ...hybridConfig().exams[0], labs: 2 }, hybridConfig().exams[1]] }, /no `labs` provider/);
  bad({ nav: [{ path: 'exam', label: 'X', icon: 'x', group: 'Practice', module: 'x.js' }] }, /reserved by the engine/);
});

test('normalizeCourse never modifies the raw config', () => {
  const raw = hybridConfig();
  const before = JSON.stringify(raw);
  normalizeCourse(raw, 'https://example.test/courses/hybrid/');
  assert.equal(JSON.stringify(raw), before);
});

test('registry: all fifteen courses ready, none coming soon', () => {
  assert.deepEqual(registry.filter((c) => c.status === 'ready').map((c) => c.id), ['ccna', 'winserver', 'fortinet-nse4', 'fortinet-nse6-fmg', 'fortinet-nse5-sdwan', 'fortinet-nse7', 'fortinet-nse5-fsw', 'fortinet-nse5-wlan', 'fortinet-nse6-nac', 'paloalto-ngfw', 'lpi-devops', 'tcpip-ipv4', 'winserver-essentials', 'ai-prompting', 'az-900']);
  assert.deepEqual(registry.filter((c) => c.status === 'coming-soon').map((c) => c.name), []);
  const ids = registry.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  registry.forEach((c) => {
    assert.ok(['ready', 'coming-soon'].includes(c.status), c.id);
    if (c.status === 'coming-soon') assert.ok(c.name && c.vendor && Array.isArray(c.exams), c.id);
    else assert.match(c.path, /^[a-z0-9-]+\/$/);
  });
});

test('ready courses load and their store prefixes cannot overlap', async () => {
  const courses = await Promise.all(registry.filter((c) => c.status === 'ready')
    .map((c) => loadCourse(pathToFileURL(join(root, 'courses', c.path)))));
  const prefixes = courses.map((c) => c.storePrefix);
  prefixes.forEach((p, i) => prefixes.forEach((q, j) => {
    if (i !== j) assert.ok(!q.startsWith(p), `${p} is a prefix of ${q}`);
  }));
});

/** A single-exam course shaped like AZ-802: 50 questions, 120 min, no labs, 1-1000 with 700 to pass, range-midpoint weights. */
function az802Config() {
  const weights = [22.5, 12.5, 12.5, 12.5, 17.5, 12.5, 17.5]; // midpoints of published ranges: sum 107.5
  return {
    id: 'winserver',
    name: 'Windows Server Prep',
    title: 'AZ-802',
    storePrefix: 'winserver:',
    domains: weights.map((w, i) => ({ id: i + 1, weight: w, weightRange: `${w - 2.5}-${w + 2.5}%`, title: `Domain ${i + 1}`, topics: [topic(`${i + 1}.1`)] })),
    exams: [{ id: 'az-802', code: 'AZ-802', questionCount: 50, minutes: 120, labs: 0, scoreMin: 1, scoreMax: 1000, passScore: 700 }],
  };
}

test('AZ-802 shape: relative weights, no labs, 1-1000 scale with a 700 pass line', () => {
  const course = normalizeCourse(az802Config(), 'https://example.test/courses/winserver/');
  const [exam] = course.exams;
  assert.deepEqual(exam.domains, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual({ min: exam.scale.min, max: exam.scale.max, pass: exam.scale.pass }, { min: 1, max: 1000, pass: 700 });
  assert.equal(exam.scale.passLabel, 'passing score of 700');
  assert.deepEqual([exam.modes.full.questions, exam.modes.full.labs, exam.modes.full.minutes], [50, 0, 120]);
  assert.equal(exam.modes.full.blurb, '50 questions in 120 minutes — the real pace.');
  const picked = buildExamFor(course, banksFor(course, 20), exam, 50, mulberry32(3));
  assert.equal(picked.length, 50);
  assert.equal(picked.filter((q) => q.domain === 1).length, 10); // 22.5 / 107.5 of 50 = 10.47
  const all = (ok) => picked.map((q) => ({ domain: q.domain, correct: ok, score: ok ? 1 : 0 }));
  assert.equal(scoreExam(all(true), exam.scale).scaled, 1000);
  assert.equal(scoreExam(all(false), exam.scale).scaled, 1);
});

test('readiness normalises weights that do not sum to 100, and is unchanged when they do', () => {
  const course = normalizeCourse(az802Config(), 'https://example.test/courses/winserver/');
  const perfect = Object.fromEntries(course.topics.map((t) => [t.id, { seen: 10, correct: 10, percent: 100, coverage: 1 }]));
  assert.equal(readiness(course.domains, perfect), 100);
  const ccnaLike = [{ weight: 60, topics: [{ id: 'a' }] }, { weight: 40, topics: [{ id: 'b' }] }];
  assert.equal(readiness(ccnaLike, { a: { seen: 4, correct: 2, coverage: 1 }, b: { seen: 4, correct: 4, coverage: 1 } }), 70);
});

test('an exam with partialCredit: false scores only fully correct items (Fortinet style)', () => {
  const raw = { ...az802Config(), exams: [{ ...az802Config().exams[0], scoreMin: 0, scoreMax: 100, passScore: 75, partialCredit: false }] };
  const [exam] = normalizeCourse(raw, 'https://example.test/courses/fortinet/').exams;
  assert.equal(exam.scale.partialCredit, false);
  const results = [{ domain: 1, correct: true, score: 1 }, { domain: 2, correct: false, score: 0.5 }];
  assert.equal(scoreExam(results, exam.scale).scaled, 50);
  assert.equal(scoreExam(results, { min: 0, max: 100 }).scaled, 75);
});

test('CCNA scoring is unchanged: 300 + 700 × credit', async () => {
  const { scale } = (await loadCourse(ccnaBase)).exams[0];
  const results = [{ domain: 1, correct: true, score: 1 }, { domain: 2, correct: false, score: 0.5 }];
  assert.equal(scoreExam(results, scale).scaled, scoreExam(results).scaled);
  assert.equal(scoreExam(results, scale).scaled, Math.round(300 + 700 * 0.75));
});
