// Persistent progress store backed by localStorage. All keys are namespaced
// with "ccna:". Values are JSON. Every write returns a new value (no in-place
// mutation of what callers hold). Falls back to memory if storage is blocked.

const PREFIX = 'ccna:';
const listeners = new Set();
const memory = new Map();
// Keys whose last localStorage write failed; reads prefer the in-memory copy for these.
const failedKeys = new Set();

function backend() {
  try {
    const probe = `${PREFIX}__probe`;
    globalThis.localStorage.setItem(probe, '1');
    globalThis.localStorage.removeItem(probe);
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

const ls = backend();

function readRaw(key) {
  if (ls && !failedKeys.has(key)) return ls.getItem(PREFIX + key);
  return memory.has(key) ? memory.get(key) : null;
}

function writeRaw(key, raw) {
  if (ls) {
    try {
      ls.setItem(PREFIX + key, raw);
      failedKeys.delete(key);
      memory.delete(key);
      return;
    } catch (e) {
      console.error(`[store] failed to persist "${key}"`, e);
      failedKeys.add(key);
      globalThis.dispatchEvent?.(new CustomEvent('ccna:store-error', { detail: { key, message: e.message } }));
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

export function exportAll() {
  const out = {};
  if (ls) {
    for (let i = 0; i < ls.length; i += 1) {
      const k = ls.key(i);
      if (k?.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = get(k.slice(PREFIX.length));
    }
  } else {
    memory.forEach((_, k) => { out[k] = get(k); });
  }
  return { app: 'ccna-prep', exportedAt: new Date().toISOString(), data: out };
}

export function importAll(payload) {
  if (payload?.app !== 'ccna-prep' || !payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
    throw new Error('Not a ccna-prep backup file.');
  }
  Object.entries(payload.data).forEach(([k, v]) => set(k, v));
}

export function clearAll() {
  const keys = Object.keys(exportAll().data);
  keys.forEach((k) => (ls ? ls.removeItem(PREFIX + k) : memory.delete(k)));
  listeners.forEach((fn) => fn('*', null));
}

export const store = { get, set, update, subscribe, exportAll, importAll, clearAll };
export default store;
