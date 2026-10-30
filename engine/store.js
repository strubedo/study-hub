// Persistent progress store backed by localStorage. Every key is namespaced
// with the active course's prefix (CCNA: "ccna:"), set once by configure()
// before anything is read. Values are JSON. Every write returns a new value
// (no in-place mutation of what callers hold). Falls back to memory if
// storage is blocked.

export const STORE_ERROR_EVENT = 'studyhub:store-error';
export const BACKUP_APP = 'study-hub';

const listeners = new Set();
const memory = new Map();
// Keys whose last localStorage write failed; reads prefer the in-memory copy for these.
const failedKeys = new Set();

let config = null; // { prefix, courseId, courseName, legacyApps }
let ls = null;

function backend(prefix) {
  try {
    const probe = `${prefix}__probe`;
    globalThis.localStorage.setItem(probe, '1');
    globalThis.localStorage.removeItem(probe);
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

/**
 * Binds the store to one course. Must run before the first read or write.
 * `legacyApps` lists backup tags from before the hub (CCNA: 'ccna-prep') that importAll() still accepts.
 */
export function configure({ prefix, courseId, courseName = courseId, legacyApps = [] }) {
  if (typeof prefix !== 'string' || !/^[a-z0-9-]+:$/.test(prefix)) {
    throw new Error(`Invalid store prefix "${prefix}": use lower-case letters, digits or dashes ending in ":".`);
  }
  if (config) {
    if (config.prefix === prefix && config.courseId === courseId) return;
    throw new Error(`Store is already bound to "${config.prefix}"; one page serves one course.`);
  }
  config = { prefix, courseId, courseName, legacyApps: [...legacyApps] };
  ls = backend(prefix);
}

export const isConfigured = () => config !== null;

function prefix() {
  if (!config) throw new Error('Store used before configure(): the course prefix is not set.');
  return config.prefix;
}

function readRaw(key) {
  const p = prefix();
  if (ls && !failedKeys.has(key)) return ls.getItem(p + key);
  return memory.has(key) ? memory.get(key) : null;
}

function writeRaw(key, raw) {
  const p = prefix();
  if (ls) {
    try {
      ls.setItem(p + key, raw);
      failedKeys.delete(key);
      memory.delete(key);
      return;
    } catch (e) {
      console.error(`[store] failed to persist "${key}"`, e);
      failedKeys.add(key);
      globalThis.dispatchEvent?.(new CustomEvent(STORE_ERROR_EVENT, { detail: { key, course: config.courseId, message: e.message } }));
    }
  }
  memory.set(key, raw);
}

export function get(key, fallback = null) {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    console.error(`[store] corrupt value for "${key}", using fallback`);
    return fallback;
  }
}

export function set(key, value) {
  writeRaw(key, JSON.stringify(value));
  listeners.forEach((fn) => fn(key, value));
  return value;
}

/** update(key, fn, fallback): fn receives the current value and must return a new one. */
export function update(key, fn, fallback = null) {
  return set(key, fn(get(key, fallback)));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Every key this course has stored, from localStorage plus any kept in memory after a failed write. */
function keys() {
  const p = prefix();
  const out = new Set(memory.keys());
  if (ls) {
    for (let i = 0; i < ls.length; i += 1) {
      const k = ls.key(i);
      if (k?.startsWith(p)) out.add(k.slice(p.length));
    }
  }
  return [...out];
}

export function exportAll() {
  const data = Object.fromEntries(keys().map((k) => [k, get(k)]));
  return { app: BACKUP_APP, course: config.courseId, exportedAt: new Date().toISOString(), data };
}

/** Accepts this course's hub backups, plus pre-hub backups tagged with one of the course's legacy app names. */
export function importAll(payload) {
  prefix();
  const ours = payload?.app === BACKUP_APP && payload.course === config.courseId;
  const legacy = config.legacyApps.includes(payload?.app);
  if (payload?.app === BACKUP_APP && !ours) {
    throw new Error(`This backup belongs to the "${payload.course}" course, not ${config.courseName}.`);
  }
  if ((!ours && !legacy) || !payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
    throw new Error(`Not a ${config.courseName} backup file.`);
  }
  Object.entries(payload.data).forEach(([k, v]) => set(k, v));
}

export function clearAll() {
  const p = prefix();
  keys().forEach((k) => {
    if (ls) ls.removeItem(p + k);
    memory.delete(k);
    failedKeys.delete(k);
  });
  listeners.forEach((fn) => fn('*', null));
}

export const store = { configure, isConfigured, get, set, update, subscribe, exportAll, importAll, clearAll };
export default store;
