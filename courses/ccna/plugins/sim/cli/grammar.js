// Builds (and caches) the command grammar for each platform. Commands that
// do not exist on a platform are simply not registered, so they fail with
// the real "% Invalid input detected" error.

import { Grammar } from '../parser.js';
import { registerExec } from './exec.js';
import { registerConfig } from './config.js';
import { registerIface } from './iface.js';
import { registerSubmodes } from './submodes.js';

const cache = new Map();

export function grammarFor(dev) {
  const kind = dev.type === 'router' ? 'router' : 'switch';
  if (!cache.has(kind)) cache.set(kind, build(kind));
  return cache.get(kind);
}

function build(kind) {
  const g = new Grammar();
  const def = (modes, pattern, handler, opts = {}) => {
    if (opts.only && opts.only !== kind) return;
    g.def(modes, pattern, handler, opts);
  };
  registerExec(def, kind);
  registerConfig(def, kind);
  registerIface(def, kind);
  registerSubmodes(def, kind);
  return g;
}
