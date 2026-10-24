import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMAINS, topicLabel } from '../content/blueprint.js';
import videos from '../content/videos.js';
import reference from '../content/reference.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('blueprint weights sum to 100 and topic ids are unique', () => {
  assert.equal(DOMAINS.reduce((s, d) => s + d.weight, 0), 100);
  const ids = DOMAINS.flatMap((d) => d.topics.map((t) => t.id));
  assert.equal(new Set(ids).size, ids.length);
  ids.forEach((id) => assert.match(id, /^[1-5]\.\d$/));
});

test('topicLabel keeps acronyms and lower-cases ordinary first words', () => {
  assert.equal(topicLabel({ verb: 'Troubleshoot', title: 'IPv4 address configuration' }), 'Troubleshoot IPv4 address configuration');
  assert.equal(topicLabel({ verb: 'Diagnose', title: 'Interface and cable issues' }), 'Diagnose interface and cable issues');
});

test('every content bank passes the spec validator', () => {
  const out = execFileSync(process.execPath, [join(root, 'scripts/validate-content.mjs')], { encoding: 'utf8' });
  assert.doesNotMatch(out, /FAIL/, out);
});

test('question ids are unique across the whole bank', async () => {
  const banks = await Promise.all(DOMAINS.map((d) => import(`../content/d${d.id}/questions.js`).then((m) => m.default)));
  const ids = banks.flat().map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every lesson file ends with a Key takeaways section', async () => {
  for (const d of DOMAINS) {
    const lessons = (await import(`../content/d${d.id}/lessons.js`)).default;
    for (const l of lessons) {
      const text = readFileSync(join(root, 'content', `d${d.id}`, 'lessons', l.file), 'utf8');
      assert.match(text, /^## Key takeaways/m, `${l.id} missing Key takeaways`);
      assert.doesNotMatch(text, /^# /m, `${l.id} must not contain an H1`);
    }
  }
});

test('videos map only to real blueprint topics and have valid ids', () => {
  const topicIds = new Set(DOMAINS.flatMap((d) => d.topics.map((t) => t.id)));
  assert.ok(videos.length > 100);
  videos.forEach((v) => {
    assert.match(v.id, /^[\w-]{11}$/);
    v.topics.forEach((t) => assert.ok(topicIds.has(t), `${v.title} → ${t}`));
  });
});

test('reference tables have rows matching their column count', () => {
  reference.forEach((s) => s.rows.forEach((r) => assert.equal(r.length, s.columns.length, `${s.id}: ${r[0]}`)));
});
