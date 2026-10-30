// Lab workspace UI: scenario, topology, tasks, hints, solution and a per-device
// IOS-style console. Used by the Labs page (full) and the exam simulator (compact).
import { buildLab } from './index.js';
import defaultStore from '../../../../engine/store.js';
import { createTerminal } from './ui-terminal.js';
import { renderTopology } from './ui-topology.js';
import {
  h, mdBlock, fallbackMd, typeIcon, TYPE_LABEL, DIFFICULTY_LABEL, fmtClock, copyText,
} from './ui-dom.js';

const SAVE_DELAY_MS = 500;
const SAVED_BUFFER_LINES = 200;
const STATE_VERSION = 1;
const IOS_TYPES = new Set(['router', 'switch', 'l3switch']);

/** Run every task check against the network. A throwing check counts as a fail. */
export function runChecks(lab, net) {
  return (lab.tasks ?? []).map((t) => {
    try {
      return Boolean(t.check(net));
    } catch (e) {
      console.warn(`[sim] check failed for lab ${lab.id}`, e);
      return false;
    }
  });
}

function loadNetwork(lab, store, persist) {
  const key = `lab-state:${lab.id}`;
  const saved = persist ? store.get(key, null) : null;
  if (saved?.v === STATE_VERSION && saved.net) {
    try {
      return { net: buildLab(lab, saved.net), saved };
    } catch (e) {
      console.warn(`[sim] saved state for ${lab.id} could not be restored; starting fresh`, e);
      store.set(key, null);
    }
  }
  return { net: buildLab(lab), saved: null };
}

/** In-page confirmation (never window.confirm). Returns a cleanup function. */
function confirmPanel(host, message, confirmLabel, onConfirm) {
  host.replaceChildren();
  const close = () => host.replaceChildren();
  host.append(h('div', { class: 'sim-confirm', role: 'alertdialog' },
    h('p', { text: message }),
    h('div', { class: 'sim-row' },
      h('button', { class: 'btn btn-primary btn-sm', type: 'button', onclick: () => { close(); onConfirm(); } }, confirmLabel),
      h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: close }, 'Cancel'))));
  host.querySelector('.btn-primary')?.focus();
  return close;
}

function solutionScript(session, type, text) {
  const body = String(text ?? '').trimEnd();
  if (!IOS_TYPES.has(type)) return body;
  const prompt = session.prompt ?? '';
  const first = body.split('\n')[0]?.trim().toLowerCase() ?? '';
  if (/\(.*\)#\s*$/.test(prompt)) return `end\n${body}`;
  if (/>\s*$/.test(prompt) && !first.startsWith('en')) return `enable\n${body}`;
  return body;
}

/**
 * Mount a lab into `container`.
 * @param {HTMLElement} container
 * @param {object} lab lab definition (see plugins/sim/labs/*.js)
 * @param {object} [opts]
 * @param {boolean} [opts.compact=false] terminal + tasks only (no hints, no solution) — for the exam simulator.
 * @param {boolean} [opts.persist=true] when false: always start from initialConfig, never read/write
 *   `lab-state:<id>` and never write completion to the `labs` key (onComplete may still fire).
 *   compact does not imply persist; the exam passes `{ compact: true, persist: false }`.
 * @param {Function} [opts.onComplete] called once with `{ labId, seconds }` when every task first passes.
 * @param {object} [opts.store] store API (defaults to engine/store.js)
 * @param {Function} [opts.md] markdown -> HTML string (defaults to a minimal escaping renderer)
 * @returns {{ destroy(): void, check(): { passed: number, total: number } }}
 *   check() keeps working after destroy(): the network is kept alive, only DOM/listeners/timers are torn down.
 */
export function mountLab(container, lab, opts = {}) {
  const compact = Boolean(opts.compact);
  const persist = opts.persist !== false;
  const store = opts.store ?? defaultStore;
  const md = opts.md ?? fallbackMd;
  const onComplete = typeof opts.onComplete === 'function' ? opts.onComplete : () => {};
  const key = `lab-state:${lab.id}`;

  const loaded = loadNetwork(lab, store, persist);
  const state = {
    net: loaded.net,
    elapsedBase: Number(loaded.saved?.elapsedMs) || 0,
    runningSince: Date.now(),
    frozen: false,
    completeFired: false,
    destroyed: false,
    saveTimer: null,
    tickTimer: null,
    active: null,
    // only persist once the learner has typed something (or state already existed),
    // so merely opening a lab does not mark it "in progress"
    hasState: Boolean(loaded.saved),
  };

  const elapsedMs = () => state.elapsedBase + (state.runningSince ? Date.now() - state.runningSince : 0);
  const pauseClock = () => {
    if (state.runningSince) state.elapsedBase = elapsedMs();
    state.runningSince = null;
  };
  const resumeClock = () => {
    if (!state.frozen && !state.runningSince) state.runningSince = Date.now();
  };

  // ---------- persistence ----------

  function saveNow() {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
    if (!persist || !state.hasState) return;
    try {
      store.set(key, {
        v: STATE_VERSION,
        net: state.net.serialize(),
        elapsedMs: Math.round(elapsedMs()),
        buffers: terminal.snapshot(SAVED_BUFFER_LINES),
        activeDevice: state.active,
      });
    } catch (e) {
      console.error(`[sim] could not save lab state for ${lab.id}`, e);
    }
  }

  function saveSoon() {
    if (!persist || state.destroyed) return;
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(saveNow, SAVE_DELAY_MS);
  }

  // ---------- layout ----------

  const root = h('div', { class: `sim-lab${compact ? ' sim-compact' : ''}` });
  const left = h('div', { class: 'sim-left' });
  const right = h('div', { class: 'sim-right' });
  root.append(left, right);
  container.append(root);

  // header
  const timerEl = h('span', { class: 'sim-timer', title: 'Time spent on this lab' });
  const doneBadge = h('span', { class: 'badge badge-ok', hidden: true }, 'Completed');
  if (!compact) {
    const record = store.get('labs', {})?.[lab.id];
    doneBadge.hidden = !(persist && record);
    left.append(h('div', { class: 'card sim-card sim-head' },
      h('h1', { class: 'sim-title' }, lab.title ?? lab.id),
      h('div', { class: 'sim-meta' },
        h('span', { class: 'badge' }, `Topic ${lab.topic ?? '?'}`),
        h('span', { class: 'sim-diff', title: 'Difficulty' }, ...difficultyDots(lab.difficulty)),
        h('span', { class: 'muted small' }, `${lab.minutes ?? '?'} min`),
        lab.troubleshooting ? h('span', { class: 'badge badge-warn' }, 'Troubleshooting') : null,
        doneBadge,
        h('span', { class: 'sim-spacer' }),
        timerEl)));
  }

  // scenario
  if (lab.scenario) {
    left.append(h('section', { class: `card sim-card${compact ? ' sim-scenario-compact' : ''}` },
      compact ? null : h('h2', { class: 'sim-h2' }, 'Scenario'),
      mdBlock('div', 'prose sim-prose', md(lab.scenario))));
  }

  // topology
  const topo = renderTopology(lab.topology, { onSelect: (name) => selectDevice(name, true) });
  left.append(h('section', { class: `card sim-card sim-topo${compact ? ' sim-topo-compact' : ''}` },
    compact ? null : h('h2', { class: 'sim-h2' }, 'Topology'),
    topo.el,
    compact ? null : h('p', { class: 'muted small sim-topo-tip' }, 'Click a device to open its console.')));

  // tasks
  const taskItems = (lab.tasks ?? []).map((t, i) => {
    const icon = h('span', { class: 'sim-task-icon', 'aria-hidden': 'true' }, String(i + 1));
    const li = h('li', { class: 'sim-task' }, icon, mdBlock('div', 'sim-task-text', md(t.text ?? '')));
    return { li, icon };
  });
  const summaryEl = h('span', { class: 'sim-summary muted small', role: 'status' });
  const bannerEl = h('div', { class: 'sim-banner', hidden: true, role: 'status' });
  const checkBtn = h('button', { class: 'btn btn-primary', type: 'button', onclick: () => doCheck(true) }, 'Check my work');
  left.append(h('section', { class: 'card sim-card' },
    h('div', { class: 'sim-card-head' }, h('h2', { class: 'sim-h2' }, 'Tasks'), summaryEl),
    h('ol', { class: 'sim-tasks' }, taskItems.map((t) => t.li)),
    compact ? null : h('div', { class: 'sim-row' }, checkBtn),
    bannerEl));

  if (!compact) {
    left.append(buildHints());
    left.append(buildSolutionAndReset());
  }

  // ---------- console ----------

  const tabsEl = h('div', { class: 'tabs sim-devtabs', role: 'tablist' });
  const devNameEl = h('span', { class: 'sim-term-dev' });
  const termHost = h('div', { class: 'sim-term-host' });
  right.append(h('div', { class: 'sim-console' },
    tabsEl,
    h('div', { class: 'sim-term-bar' },
      devNameEl,
      h('span', { class: 'sim-spacer' }),
      h('span', { class: 'sim-term-keys' }, 'Tab complete · ? help · ↑↓ history · Ctrl-Z end'),
      h('button', { class: 'sim-term-btn', type: 'button', onclick: () => { terminal.clear(); terminal.focus(); } }, 'Clear')),
    termHost));

  const terminal = createTerminal(termHost, {
    onExecute: () => { state.hasState = true; saveSoon(); },
  });
  const tabs = new Map();

  function devices() {
    try { return state.net.deviceList(); } catch (e) { console.error('[sim] deviceList failed', e); return []; }
  }

  function attachDevices(savedBuffers = {}) {
    tabsEl.replaceChildren();
    tabs.clear();
    devices().forEach((d) => {
      terminal.addDevice(d.name, d.type, state.net.openSession(d.name), savedBuffers?.[d.name] ?? '');
      const tab = h('button', {
        class: 'tab sim-devtab', type: 'button', role: 'tab', 'aria-selected': 'false',
        onclick: () => selectDevice(d.name, true),
      }, typeIcon(d.type), d.name);
      tabs.set(d.name, { tab, type: d.type });
      tabsEl.append(tab);
    });
  }

  function selectDevice(name, focus) {
    if (!tabs.has(name) || state.destroyed) return;
    state.active = name;
    tabs.forEach(({ tab }, n) => {
      tab.classList.toggle('active', n === name);
      tab.setAttribute('aria-selected', String(n === name));
    });
    devNameEl.replaceChildren(typeIcon(tabs.get(name).type), ` ${name}`, h('span', { class: 'sim-term-type' }, ` · ${TYPE_LABEL[tabs.get(name).type] ?? ''}`));
    topo.setActive(name);
    terminal.setActive(name);
    if (focus) terminal.focus();
    saveSoon();
  }

  attachDevices(loaded.saved?.buffers);
  const firstDevice = devices()[0]?.name;
  const startDevice = tabs.has(loaded.saved?.activeDevice) ? loaded.saved.activeDevice : firstDevice;
  if (startDevice) selectDevice(startDevice, false);

  // ---------- tasks / checking ----------

  function paintResults(results) {
    results.forEach((ok, i) => {
      const t = taskItems[i];
      t.li.classList.toggle('pass', ok);
      t.li.classList.toggle('fail', !ok);
      t.icon.textContent = ok ? '✓' : '✗';
      t.icon.setAttribute('aria-label', ok ? 'passed' : 'not yet');
    });
    const passed = results.filter(Boolean).length;
    summaryEl.textContent = `${passed} / ${results.length} tasks complete`;
  }

  function recordCompletion(seconds) {
    if (!persist) return;
    store.update('labs', (cur) => {
      const all = cur && typeof cur === 'object' ? cur : {};
      const prev = all[lab.id];
      const best = Number.isFinite(prev?.bestSeconds) ? Math.min(prev.bestSeconds, seconds) : seconds;
      return { ...all, [lab.id]: { completedAt: prev?.completedAt ?? new Date().toISOString(), lastCompletedAt: new Date().toISOString(), bestSeconds: best } };
    }, {});
    doneBadge.hidden = false;
  }

  function showBanner(seconds) {
    const best = persist ? store.get('labs', {})?.[lab.id]?.bestSeconds : null;
    bannerEl.replaceChildren(
      h('strong', {}, 'Lab complete!'),
      ` ${taskItems.length === 1 ? 'The task passes' : `All ${taskItems.length} tasks pass`}. Time: ${fmtClock(seconds)}`,
      Number.isFinite(best) ? ` · Best: ${fmtClock(best)}` : '');
    bannerEl.hidden = false;
  }

  function doCheck(paint) {
    const results = runChecks(lab, state.net);
    const passed = results.filter(Boolean).length;
    const total = results.length;
    if (paint && !state.destroyed) paintResults(results);
    if (total > 0 && passed === total && !state.completeFired) {
      state.completeFired = true;
      const seconds = Math.round(elapsedMs() / 1000);
      state.frozen = true;
      pauseClock();
      recordCompletion(seconds);
      if (!state.destroyed && !compact) showBanner(seconds);
      saveSoon();
      try { onComplete({ labId: lab.id, seconds }); } catch (e) { console.error('[sim] onComplete handler failed', e); }
    }
    return { passed, total };
  }

  // ---------- hints / solution / reset ----------

  function buildHints() {
    const hints = lab.hints ?? [];
    const list = h('ol', { class: 'sim-hints' });
    let shown = 0;
    const btn = h('button', { class: 'btn btn-sm', type: 'button' });
    const label = () => {
      btn.textContent = `Show hint ${shown + 1} of ${hints.length}`;
      btn.hidden = shown >= hints.length;
    };
    btn.addEventListener('click', () => {
      if (shown >= hints.length) return;
      list.append(mdBlock('li', 'sim-hint', md(hints[shown])));
      shown += 1;
      label();
    });
    label();
    const details = h('details', { class: 'card sim-card sim-details' },
      h('summary', { class: 'sim-h2' }, `Hints (${hints.length})`),
      hints.length ? [list, btn] : h('p', { class: 'muted small' }, 'No hints for this lab.'));
    return details;
  }

  function buildSolutionAndReset() {
    const solHost = h('div', { class: 'sim-solution' });
    const confirmHost = h('div');
    const solBtn = h('button', { class: 'btn', type: 'button' }, 'Show solution');
    const resetBtn = h('button', { class: 'btn btn-ghost sim-danger', type: 'button' }, 'Reset lab');
    solBtn.addEventListener('click', () => confirmPanel(confirmHost,
      'Viewing the solution shows the exact commands for every device. Try the hints first if you have not. Continue?',
      'Show solution', () => { solBtn.hidden = true; renderSolution(solHost); }));
    resetBtn.addEventListener('click', () => confirmPanel(confirmHost,
      'Reset this lab? Every device goes back to its initial configuration and your console history is cleared.',
      'Reset lab', resetLab));
    return h('section', { class: 'card sim-card' },
      h('div', { class: 'sim-row' }, solBtn, h('span', { class: 'sim-spacer' }), resetBtn),
      confirmHost, solHost);
  }

  function renderSolution(host) {
    const sol = lab.solution ?? {};
    host.replaceChildren(h('h2', { class: 'sim-h2' }, 'Solution'));
    Object.entries(sol).forEach(([name, text]) => {
      const copyBtn = h('button', { class: 'btn btn-ghost btn-sm', type: 'button' }, 'Copy');
      copyBtn.addEventListener('click', async () => {
        copyBtn.textContent = (await copyText(String(text))) ? 'Copied' : 'Copy failed';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
      });
      const runBtn = h('button', { class: 'btn btn-ghost btn-sm', type: 'button', disabled: !tabs.has(name) }, `Run on ${name}`);
      runBtn.addEventListener('click', () => {
        if (!tabs.has(name)) return;
        selectDevice(name, true);
        const session = state.net.openSession(name);
        terminal.runScript(name, solutionScript(session, tabs.get(name).type, text));
      });
      host.append(h('div', { class: 'sim-sol-block' },
        h('div', { class: 'sim-sol-head' }, h('strong', {}, name), h('span', { class: 'sim-spacer' }), runBtn, copyBtn),
        h('pre', { class: 'sim-sol-pre' }, String(text ?? '').trimEnd())));
    });
  }

  function resetLab() {
    clearTimeout(state.saveTimer);
    if (persist) store.set(key, null);
    state.hasState = false;
    state.net = buildLab(lab);
    state.elapsedBase = 0;
    state.runningSince = Date.now();
    state.frozen = false;
    state.completeFired = false;
    terminal.resetAll();
    attachDevices({});
    const first = devices()[0]?.name;
    if (first) selectDevice(first, true);
    taskItems.forEach((t, i) => {
      t.li.classList.remove('pass', 'fail');
      t.icon.textContent = String(i + 1);
    });
    summaryEl.textContent = '';
    bannerEl.hidden = true;
    tick();
  }

  // ---------- timers & lifecycle ----------

  function tick() {
    timerEl.textContent = `⏱ ${fmtClock(elapsedMs() / 1000)}`;
  }

  const onVisibility = () => {
    if (document.hidden) { pauseClock(); saveNow(); } else resumeClock();
  };
  const onPageHide = () => saveNow();
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', onPageHide);
  if (!compact) {
    tick();
    state.tickTimer = setInterval(tick, 1000);
  }

  return {
    check() {
      return doCheck(!compact && !state.destroyed);
    },
    destroy() {
      if (state.destroyed) return;
      saveNow();
      state.destroyed = true;
      pauseClock();
      clearTimeout(state.saveTimer);
      clearInterval(state.tickTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
      terminal.destroy();
      topo.destroy();
      root.remove();
    },
  };
}

function difficultyDots(level) {
  const n = Math.max(1, Math.min(3, Number(level) || 1));
  const dots = [1, 2, 3].map((i) => h('span', { class: `sim-dot${i <= n ? ' on' : ''}` }));
  return [...dots, h('span', { class: 'muted small' }, DIFFICULTY_LABEL[n])];
}
