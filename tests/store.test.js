// Store prefix binding: the CCNA course must keep reading and writing "ccna:*" keys.
// Tests in this file share one store module and run in order.
import { test } from 'node:test';
import assert from 'node:assert/strict';

class MemoryStorage {
  #map = new Map();
  get length() { return this.#map.size; }
  key(i) { return [...this.#map.keys()][i] ?? null; }
  getItem(k) { return this.#map.has(k) ? this.#map.get(k) : null; }
  setItem(k, v) { this.#map.set(k, String(v)); }
  removeItem(k) { this.#map.delete(k); }
  keys() { return [...this.#map.keys()]; }
}

const storage = new MemoryStorage();
globalThis.localStorage = storage;
// Data from before the hub, under the original prefix, plus another course's key.
storage.setItem('ccna:attempts', JSON.stringify({ 'd1-001': { seen: 2, correct: 1, last: true, at: '2026-10-01T00:00:00.000Z' } }));
storage.setItem('az:attempts', JSON.stringify({ x: { seen: 9, correct: 9 } }));

const { default: store, configure, BACKUP_APP } = await import('../engine/store.js');

test('reading before configure() throws instead of guessing a prefix', () => {
  assert.throws(() => store.get('attempts'), /before configure/);
});

test('configure() rejects malformed prefixes', () => {
  assert.throws(() => configure({ prefix: 'ccna', courseId: 'ccna' }), /Invalid store prefix/);
  assert.throws(() => configure({ prefix: 'CCNA:', courseId: 'ccna' }), /Invalid store prefix/);
});

test('ccna prefix reads existing ccna:* data and writes the same keys', () => {
  configure({ prefix: 'ccna:', courseId: 'ccna', courseName: 'CCNA Prep', legacyApps: ['ccna-prep'] });
  assert.equal(store.get('attempts')['d1-001'].seen, 2);
  store.set('lessonsDone', { '1.1-cabling': '2026-10-02T00:00:00.000Z' });
  assert.ok(storage.getItem('ccna:lessonsDone'));
  assert.equal(storage.getItem('lessonsDone'), null);
  assert.equal(storage.getItem('az:attempts'), JSON.stringify({ x: { seen: 9, correct: 9 } }));
});

test('configure() is idempotent for the same course but refuses to switch prefixes', () => {
  configure({ prefix: 'ccna:', courseId: 'ccna' });
  assert.throws(() => configure({ prefix: 'az:', courseId: 'az' }), /already bound/);
});

test('exportAll() covers only this prefix and tags the course id', () => {
  const backup = store.exportAll();
  assert.equal(backup.app, BACKUP_APP);
  assert.equal(backup.course, 'ccna');
  assert.deepEqual(Object.keys(backup.data).sort(), ['attempts', 'lessonsDone']);
});

test('importAll() accepts pre-hub ccna-prep backups and this course\'s hub backups', () => {
  store.importAll({ app: 'ccna-prep', exportedAt: '2026-10-20T00:00:00.000Z', data: { flags: { 'd2-004': true } } });
  assert.deepEqual(JSON.parse(storage.getItem('ccna:flags')), { 'd2-004': true });
  store.importAll({ app: BACKUP_APP, course: 'ccna', data: { flashDeck: 'd:3' } });
  assert.equal(JSON.parse(storage.getItem('ccna:flashDeck')), 'd:3');
});

test('importAll() rejects other courses\' backups and foreign files', () => {
  assert.throws(() => store.importAll({ app: BACKUP_APP, course: 'winserver', data: {} }), /belongs to the "winserver" course/);
  assert.throws(() => store.importAll({ app: 'something-else', data: {} }), /Not a CCNA Prep backup/);
  assert.throws(() => store.importAll({ app: 'ccna-prep', data: [] }), /Not a CCNA Prep backup/);
});

test('clearAll() removes only this course\'s keys', () => {
  store.clearAll();
  assert.deepEqual(storage.keys(), ['az:attempts']);
});
