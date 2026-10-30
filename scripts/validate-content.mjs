#!/usr/bin/env node
// Validates course content banks against CONTENT_SPEC.md, plus each course.js config.
// Usage: node scripts/validate-content.mjs [course] [domainNumber...]
//   no args       every ready course in courses/index.js
//   ccna          one course, by id or by directory (courses/ccna)
//   ccna 3        one domain of one course
import { existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadCourse } from '../engine/course.js';
import registry from '../courses/index.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = new Set(['single', 'multi', 'order', 'match', 'fill']);
const CHOOSE_WORDS = { 2: 'two', 3: 'three', 4: 'four' };

async function loadBank(contentDir, domain, name) {
  const path = join(contentDir, `d${domain}`, `${name}.js`);
  if (!existsSync(path)) return { missing: true, items: [] };
  const mod = await import(pathToFileURL(path).href);
  return { missing: false, items: mod.default };
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validIndexList(answer, optionCount) {
  return Array.isArray(answer)
    && answer.every((i) => Number.isInteger(i) && i >= 0 && i < optionCount)
    && new Set(answer).size === answer.length;
}

export function validateQuestion(q, domain, topicIds, lessonIds) {
  const errs = [];
  const where = q?.id ?? '(no id)';
  const err = (m) => errs.push(`${where}: ${m}`);

  if (!/^d\d+-\d{3}$/.test(q.id ?? '') || !q.id.startsWith(`d${domain}-`)) err('bad id format');
  if (!topicIds.has(q.topic)) err(`topic ${q.topic} not in domain ${domain}`);
  if (!TYPES.has(q.type)) err(`bad type ${q.type}`);
  if (![1, 2, 3].includes(q.difficulty)) err('difficulty must be 1-3');
  if (!isNonEmptyString(q.stem)) err('missing stem');
  if (!isNonEmptyString(q.explanation)) err('missing explanation');
  if (q.exhibit !== undefined && !isNonEmptyString(q.exhibit)) err('empty exhibit');
  if (q.lesson !== undefined && !lessonIds.has(q.lesson)) err(`unknown lesson ${q.lesson}`);

  const opts = q.options;
  switch (q.type) {
    case 'single':
      if (!Array.isArray(opts) || opts.length < 3 || opts.length > 5) err('single needs 3-5 options');
      else if (!validIndexList(q.answer, opts.length) || q.answer.length !== 1) err('single needs exactly one valid answer index');
      break;
    case 'multi': {
      if (!Array.isArray(opts) || opts.length < 4 || opts.length > 7) err('multi needs 4-7 options');
      else if (!validIndexList(q.answer, opts.length) || q.answer.length < 2) err('multi needs 2+ valid answer indices');
      else {
        const word = CHOOSE_WORDS[q.answer.length];
        if (!word || !q.stem.includes(`(Choose ${word}.)`)) err(`multi stem must say "(Choose ${word}.)"`);
      }
      break;
    }
    case 'order':
      if (!Array.isArray(q.items) || q.items.length < 3 || q.items.length > 8) err('order needs 3-8 items');
      else if (new Set(q.items).size !== q.items.length) err('order items must be unique');
      break;
    case 'match': {
      const pairs = q.pairs;
      if (!Array.isArray(pairs) || pairs.length < 3 || pairs.length > 7) err('match needs 3-7 pairs');
      else if (!pairs.every((p) => Array.isArray(p) && p.length === 2 && p.every(isNonEmptyString))) err('match pairs must be [left, right] strings');
      else {
        if (new Set(pairs.map((p) => p[0])).size !== pairs.length) err('match lefts must be unique');
        if (new Set(pairs.map((p) => p[1])).size !== pairs.length) err('match rights must be unique');
      }
      break;
    }
    case 'fill':
      if (!Array.isArray(q.answer) || q.answer.length === 0 || !q.answer.every(isNonEmptyString)) err('fill needs answer: [strings]');
      break;
    default:
      break;
  }
  if (Array.isArray(opts) && new Set(opts).size !== opts.length) err('duplicate options');
  return errs;
}

async function validateDomain(contentDir, d) {
  const errs = [];
  const topicIds = new Set(d.topics.map((t) => t.id));
  const lessons = await loadBank(contentDir, d.id, 'lessons');
  const questions = await loadBank(contentDir, d.id, 'questions');
  const cards = await loadBank(contentDir, d.id, 'flashcards');

  if (lessons.missing) errs.push('lessons.js missing');
  if (questions.missing) errs.push('questions.js missing');
  if (cards.missing) errs.push('flashcards.js missing');

  const lessonIds = new Set();
  for (const l of lessons.items) {
    if (!isNonEmptyString(l.id) || lessonIds.has(l.id)) errs.push(`lesson id bad/duplicate: ${l.id}`);
    lessonIds.add(l.id);
    if (!topicIds.has(l.topic)) errs.push(`lesson ${l.id}: topic ${l.topic} not in domain`);
    if (!isNonEmptyString(l.title)) errs.push(`lesson ${l.id}: missing title`);
    if (!Number.isInteger(l.minutes) || l.minutes <= 0) errs.push(`lesson ${l.id}: minutes must be a positive integer`);
    if (!Array.isArray(l.objectives) || l.objectives.length < 2) errs.push(`lesson ${l.id}: needs objectives`);
    if (!existsSync(join(contentDir, `d${d.id}`, 'lessons', l.file ?? ''))) errs.push(`lesson ${l.id}: file ${l.file} missing`);
  }
  if (!lessons.missing) {
    for (const t of d.topics) {
      if (!lessons.items.some((l) => l.topic === t.id)) errs.push(`no lesson for topic ${t.id}`);
    }
  }

  const qIds = new Set();
  for (const q of questions.items) {
    if (qIds.has(q.id)) errs.push(`duplicate question id ${q.id}`);
    qIds.add(q.id);
    errs.push(...validateQuestion(q, d.id, topicIds, lessonIds));
  }

  const cIds = new Set();
  for (const c of cards.items) {
    if (!/^d\d+-f\d{3}$/.test(c.id ?? '') || cIds.has(c.id)) errs.push(`flashcard id bad/duplicate: ${c.id}`);
    cIds.add(c.id);
    if (!topicIds.has(c.topic)) errs.push(`flashcard ${c.id}: topic ${c.topic} not in domain`);
    if (!isNonEmptyString(c.front) || !isNonEmptyString(c.back)) errs.push(`flashcard ${c.id}: empty side`);
  }

  const perTopic = Object.fromEntries(d.topics.map((t) => [t.id, questions.items.filter((q) => q.topic === t.id).length]));
  return { errs, stats: { lessons: lessons.items.length, questions: questions.items.length, flashcards: cards.items.length, perTopic } };
}

/** Course directory for an id ("ccna") or a path ("courses/ccna"). */
function courseDir(arg) {
  const byId = join(root, 'courses', arg);
  if (existsSync(join(byId, 'course.js'))) return byId;
  const byPath = resolve(arg);
  if (existsSync(join(byPath, 'course.js'))) return byPath;
  throw new Error(`No course "${arg}": expected courses/${arg}/course.js or a directory containing course.js.`);
}

async function validateCourse(dir, wantedDomains) {
  let course;
  try {
    course = await loadCourse(pathToFileURL(`${dir}/`));
  } catch (e) {
    console.log(`Course ${basename(dir)}: FAIL  config: ${e.message}`);
    return false;
  }
  const contentDir = join(dir, course.contentDir);
  const domains = wantedDomains.length ? course.domains.filter((d) => wantedDomains.includes(d.id)) : course.domains;
  console.log(`Course ${course.id} (${course.title}): config OK`);
  let ok = true;
  for (const d of domains) {
    let result;
    try {
      result = await validateDomain(contentDir, d);
    } catch (e) {
      result = { errs: [`failed to load: ${e.message}`], stats: {} };
    }
    const { errs, stats } = result;
    const status = errs.length ? `FAIL (${errs.length})` : 'OK';
    console.log(`  Domain ${d.id} ${d.short}: ${status}  ${JSON.stringify(stats)}`);
    errs.slice(0, 50).forEach((e) => console.log(`    - ${e}`));
    if (errs.length) ok = false;
  }
  return ok;
}

async function main() {
  const [first, ...rest] = process.argv.slice(2);
  if (first !== undefined && /^\d+$/.test(first)) {
    console.error('Name the course first, e.g. `node scripts/validate-content.mjs ccna 3`.');
    process.exit(2);
  }
  let dirs;
  try {
    dirs = first ? [courseDir(first)] : registry.filter((c) => c.status === 'ready').map((c) => courseDir(c.path.replace(/\/$/, '')));
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  const wanted = rest.map(Number);
  let failed = false;
  for (const dir of dirs) {
    if (!(await validateCourse(dir, wanted))) failed = true;
  }
  process.exit(failed ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
