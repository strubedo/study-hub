// Every lab: initial config loads cleanly, not every task passes at the start,
// the published solution replays through the real CLI without errors and
// passes every check, and the solved state survives serialize -> restore.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import labs from '../src/sim/labs/index.js';
import { buildLab, replaySolution } from '../src/sim/index.js';
import { topicById } from '../content/blueprint.js';

const runChecks = (lab, net) => lab.tasks.map((t) => {
  try { return t.check(net) === true; } catch { return false; }
});

test('lab catalogue meets the minimum spec', () => {
  assert.ok(labs.length >= 14, 'at least 14 labs');
  assert.ok(labs.filter((l) => l.troubleshooting).length >= 5, 'at least 5 troubleshooting labs');
  assert.equal(new Set(labs.map((l) => l.id)).size, labs.length, 'unique ids');
  const topics = new Set(labs.map((l) => l.topic));
  ['1.3', '1.4', '1.7', '2.1', '2.2', '2.4', '2.5', '3.2', '3.3', '3.4', '4.1', '4.3', '4.6', '4.7'].forEach((t) => assert.ok(topics.has(t), `topic ${t} covered`));
});

for (const lab of labs) {
  test(`lab ${lab.id}: metadata`, () => {
    assert.ok(topicById(lab.topic), `topic ${lab.topic} exists in blueprint`);
    assert.ok([1, 2, 3].includes(lab.difficulty));
    assert.ok(lab.minutes > 0 && typeof lab.title === 'string' && lab.summary && lab.scenario);
    assert.ok(lab.tasks.length >= 3 && lab.hints.length >= 1);
    if (lab.examEligible) assert.ok(lab.minutes <= 12, 'exam-eligible labs are <= 12 minutes');
    for (const [a, , b] of lab.topology.links) {
      assert.ok(lab.topology.devices.some((d) => d.name === a) && lab.topology.devices.some((d) => d.name === b));
    }
  });

  test(`lab ${lab.id}: broken at start, solution passes, state round-trips`, () => {
    const net = buildLab(lab);
    assert.deepEqual(net.loadErrors, [], 'initial config loads without IOS errors');
    const before = runChecks(lab, net);
    assert.ok(before.some((x) => !x), `some task must fail on the initial config: ${JSON.stringify(before)}`);

    const { errors } = replaySolution(net, lab.solution);
    assert.deepEqual(errors, [], 'solution replays without CLI errors');
    const after = runChecks(lab, net);
    assert.deepEqual(after, after.map(() => true), `all tasks pass after the solution: ${JSON.stringify(after)}`);

    const restored = buildLab(lab, JSON.parse(JSON.stringify(net.serialize())));
    assert.deepEqual(restored.loadErrors, [], 'saved running-config reloads without errors');
    const again = runChecks(lab, restored);
    assert.deepEqual(again, again.map(() => true), `tasks still pass after restore: ${JSON.stringify(again)}`);
  });
}
