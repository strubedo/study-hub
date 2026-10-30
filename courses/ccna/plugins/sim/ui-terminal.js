// Terminal widget for the CLI labs. Pure DOM, no innerHTML: every byte of
// device output is inserted as text so lab/engine output can never inject markup.
//
// createTerminal(host, { onExecute }) -> {
//   addDevice(name, type, session, savedText?), setActive(name), clear(),
//   resetAll(), focus(), snapshot(maxLines) -> { [name]: text }, destroy()
// }

const MAX_LINES = 2000;
const TRIM_TO = 1800;
const MAX_HISTORY = 100;
const IOS_TYPES = new Set(['router', 'switch', 'l3switch']);

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function countNewlines(s) {
  let n = 0;
  for (let i = 0; i < s.length; i += 1) if (s.charCodeAt(i) === 10) n += 1;
  return n;
}

function lastLines(text, max) {
  const lines = text.split('\n');
  return lines.length <= max ? text : lines.slice(lines.length - max).join('\n');
}

/** A pending interactive question (Password:, [confirm], modulus ...) is not a CLI prompt. */
function isPending(session) {
  if (session.pending !== undefined) return Boolean(session.pending);
  if (session.secret) return true;
  return !/[#>]\s*$/.test(session.prompt ?? '');
}

function withNewline(s) {
  if (!s) return '';
  return s.endsWith('\n') ? s : `${s}\n`;
}

export function createTerminal(host, { onExecute = () => {} } = {}) {
  const devices = new Map();
  let active = null;

  const root = el('div', 'sim-term');
  root.setAttribute('role', 'application');
  root.setAttribute('aria-label', 'Device console');
  const scroller = el('div', 'sim-term-scroll');
  const out = el('div', 'sim-term-out');
  const line = el('div', 'sim-term-line');
  const promptSpan = el('span', 'sim-term-prompt');
  const beforeSpan = el('span');
  const cursorSpan = el('span', 'sim-cursor');
  const afterSpan = el('span');
  line.append(promptSpan, beforeSpan, cursorSpan, afterSpan);
  const ta = el('textarea', 'sim-term-input');
  ta.setAttribute('autocapitalize', 'off');
  ta.setAttribute('autocomplete', 'off');
  ta.setAttribute('autocorrect', 'off');
  ta.setAttribute('spellcheck', 'false');
  ta.setAttribute('aria-label', 'Terminal input');
  ta.rows = 1;
  scroller.append(out, line);
  root.append(scroller, ta);
  host.append(root);

  // ---------- rendering ----------

  function scrollToEnd() {
    scroller.scrollTop = scroller.scrollHeight;
  }

  function renderLine() {
    if (!active) return;
    const d = active;
    const s = d.session;
    promptSpan.textContent = s.prompt ?? '';
    if (s.secret) {
      beforeSpan.textContent = '';
      cursorSpan.textContent = ' ';
      afterSpan.textContent = '';
    } else {
      beforeSpan.textContent = d.buffer.slice(0, d.cursor);
      cursorSpan.textContent = d.buffer[d.cursor] ?? ' ';
      afterSpan.textContent = d.buffer.slice(d.cursor + 1);
    }
    scrollToEnd();
  }

  function rebuildOutput() {
    out.textContent = active ? active.text : '';
  }

  function write(dev, text) {
    if (!text) return;
    dev.text += text;
    dev.lines += countNewlines(text);
    if (dev.lines > MAX_LINES) {
      dev.text = lastLines(dev.text, TRIM_TO);
      dev.lines = countNewlines(dev.text);
      if (dev === active) rebuildOutput();
      return;
    }
    if (dev === active) out.append(document.createTextNode(text));
  }

  function flash() {
    root.classList.remove('sim-flash');
    // force reflow so the animation restarts
    void root.offsetWidth;
    root.classList.add('sim-flash');
  }

  function printLogs(dev) {
    let logs = '';
    try { logs = dev.session.drainLogs?.() ?? ''; } catch (e) { console.error('[sim] drainLogs failed', e); }
    write(dev, withNewline(logs));
  }

  // ---------- line editing ----------

  function setBuffer(dev, text, cursor = text.length) {
    dev.buffer = text;
    dev.cursor = Math.max(0, Math.min(cursor, text.length));
  }

  function insert(text) {
    const d = active;
    if (!d || !text) return;
    setBuffer(d, d.buffer.slice(0, d.cursor) + text + d.buffer.slice(d.cursor), d.cursor + text.length);
  }

  function pushHistory(dev, cmd) {
    if (!cmd.trim()) return;
    if (dev.history[dev.history.length - 1] !== cmd) dev.history.push(cmd);
    if (dev.history.length > MAX_HISTORY) dev.history.splice(0, dev.history.length - MAX_HISTORY);
  }

  function execute() {
    const d = active;
    if (!d) return;
    const s = d.session;
    const cmd = d.buffer;
    const wasPending = isPending(s);
    const hidden = Boolean(s.secret);
    write(d, `${s.prompt ?? ''}${hidden ? '' : cmd}\n`);
    let result = '';
    try {
      result = s.input(cmd) ?? '';
    } catch (e) {
      console.error('[sim] command failed', e);
      result = `% Internal simulator error: ${e.message}`;
    }
    write(d, withNewline(result));
    printLogs(d);
    if (!wasPending && !hidden) pushHistory(d, cmd);
    d.histIdx = -1;
    d.draft = '';
    setBuffer(d, '');
    renderLine();
    onExecute(d.name, cmd);
  }

  function control(kind) {
    const d = active;
    if (!d) return;
    const s = d.session;
    const shown = s.secret ? '' : d.buffer;
    write(d, `${s.prompt ?? ''}${shown}${kind === 'z' ? '^Z' : '^C'}\n`);
    let result = '';
    try {
      result = (kind === 'z' ? s.ctrlZ?.() : s.ctrlC?.()) ?? '';
    } catch (e) {
      console.error('[sim] control key failed', e);
    }
    write(d, withNewline(result));
    printLogs(d);
    setBuffer(d, '');
    d.histIdx = -1;
    renderLine();
    onExecute(d.name, kind === 'z' ? '^Z' : '^C');
  }

  function help() {
    const d = active;
    const s = d.session;
    write(d, `${s.prompt ?? ''}${d.buffer}?\n`);
    let result = '';
    try { result = s.help(d.buffer) ?? ''; } catch (e) { console.error('[sim] help failed', e); }
    write(d, withNewline(result));
    setBuffer(d, d.buffer);
    renderLine();
  }

  function complete() {
    const d = active;
    const before = d.buffer.slice(0, d.cursor);
    const after = d.buffer.slice(d.cursor);
    let result = null;
    try { result = d.session.complete?.(before) ?? null; } catch (e) { console.error('[sim] complete failed', e); }
    if (result == null || result === before) { flash(); return; }
    setBuffer(d, result + after, result.length);
  }

  function historyStep(dir) {
    const d = active;
    if (!d.history.length) return;
    if (d.histIdx === -1) {
      if (dir > 0) return;
      d.draft = d.buffer;
      d.histIdx = d.history.length - 1;
    } else {
      d.histIdx += dir;
      if (d.histIdx >= d.history.length) {
        d.histIdx = -1;
        setBuffer(d, d.draft);
        return;
      }
      d.histIdx = Math.max(0, d.histIdx);
    }
    setBuffer(d, d.history[d.histIdx]);
  }

  function deleteWordBack() {
    const d = active;
    const before = d.buffer.slice(0, d.cursor).replace(/\S+\s*$/, '');
    setBuffer(d, before + d.buffer.slice(d.cursor), before.length);
  }

  function wantsHelpKey() {
    const d = active;
    if (isPending(d.session)) return false;
    if (IOS_TYPES.has(d.type)) return true;
    return d.buffer.trim() === '';
  }

  function pasteText(text) {
    const parts = String(text).replace(/\r\n?/g, '\n').replace(/\t/g, ' ').split('\n');
    parts.forEach((part, i) => {
      insert(part);
      if (i < parts.length - 1) execute();
    });
    renderLine();
  }

  // ---------- key handling ----------

  const CTRL_KEYS = {
    c: () => control('c'),
    z: () => control('z'),
    a: () => setBuffer(active, active.buffer, 0),
    e: () => setBuffer(active, active.buffer),
    u: () => setBuffer(active, active.buffer.slice(active.cursor), 0),
    k: () => setBuffer(active, active.buffer.slice(0, active.cursor)),
    w: deleteWordBack,
    l: () => { active.text = ''; active.lines = 0; rebuildOutput(); },
    p: () => historyStep(-1),
    n: () => historyStep(1),
    b: () => setBuffer(active, active.buffer, active.cursor - 1),
    f: () => setBuffer(active, active.buffer, active.cursor + 1),
    d: () => { const d = active; setBuffer(d, d.buffer.slice(0, d.cursor) + d.buffer.slice(d.cursor + 1), d.cursor); },
  };

  function onKeyDown(e) {
    if (!active || e.isComposing) return;
    const d = active;
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === 'v' || (e.metaKey && k === 'c')) return; // native paste / copy
      if (e.ctrlKey && CTRL_KEYS[k]) {
        e.preventDefault();
        CTRL_KEYS[k]();
        renderLine();
      }
      return;
    }
    const keyActions = {
      Enter: execute,
      Tab: complete,
      Backspace: () => {
        if (d.cursor > 0) setBuffer(d, d.buffer.slice(0, d.cursor - 1) + d.buffer.slice(d.cursor), d.cursor - 1);
      },
      Delete: () => setBuffer(d, d.buffer.slice(0, d.cursor) + d.buffer.slice(d.cursor + 1), d.cursor),
      ArrowLeft: () => setBuffer(d, d.buffer, d.cursor - 1),
      ArrowRight: () => setBuffer(d, d.buffer, d.cursor + 1),
      Home: () => setBuffer(d, d.buffer, 0),
      End: () => setBuffer(d, d.buffer),
      ArrowUp: () => historyStep(-1),
      ArrowDown: () => historyStep(1),
      Escape: () => {},
    };
    if (e.key === '?' && wantsHelpKey()) {
      e.preventDefault();
      help();
      return;
    }
    const action = keyActions[e.key];
    if (!action) return;
    e.preventDefault();
    action();
    renderLine();
  }

  function onInput() {
    if (!active) { ta.value = ''; return; }
    const v = ta.value;
    ta.value = '';
    if (!v) return;
    if (v.includes('\n')) pasteText(v);
    else { insert(v); renderLine(); }
  }

  function onPaste(e) {
    if (!active) return;
    e.preventDefault();
    pasteText(e.clipboardData?.getData('text') ?? '');
  }

  function onRootMouseUp() {
    const sel = window.getSelection?.();
    if (sel && String(sel).length > 0) return; // user is selecting text to copy
    ta.focus({ preventScroll: true });
  }

  const onFocus = () => root.classList.add('focused');
  const onBlur = () => root.classList.remove('focused');

  ta.addEventListener('keydown', onKeyDown);
  ta.addEventListener('input', onInput);
  ta.addEventListener('paste', onPaste);
  ta.addEventListener('focus', onFocus);
  ta.addEventListener('blur', onBlur);
  root.addEventListener('mouseup', onRootMouseUp);

  // ---------- public API ----------

  function addDevice(name, type, session, savedText = '') {
    const text = savedText ? withNewline(savedText) : '';
    devices.set(name, {
      name, type, session, text, lines: countNewlines(text),
      buffer: '', cursor: 0, history: [], histIdx: -1, draft: '', opened: Boolean(text),
    });
  }

  function setActive(name) {
    const d = devices.get(name);
    if (!d) return;
    active = d;
    rebuildOutput();
    if (!d.opened) {
      d.opened = true;
      if (IOS_TYPES.has(d.type)) write(d, '\n');
    }
    printLogs(d);
    renderLine();
  }

  function replaceSession(name, session) {
    const d = devices.get(name);
    if (d) d.session = session;
  }

  function clear() {
    if (!active) return;
    active.text = '';
    active.lines = 0;
    rebuildOutput();
    renderLine();
  }

  function snapshot(maxLines = 200) {
    const snap = {};
    devices.forEach((d, name) => { if (d.text) snap[name] = lastLines(d.text, maxLines); });
    return snap;
  }

  /** Paste a block of commands into a device as if typed at its console. */
  function runScript(name, text) {
    setActive(name);
    pasteText(text.endsWith('\n') ? text : `${text}\n`);
  }

  function destroy() {
    ta.removeEventListener('keydown', onKeyDown);
    ta.removeEventListener('input', onInput);
    ta.removeEventListener('paste', onPaste);
    ta.removeEventListener('focus', onFocus);
    ta.removeEventListener('blur', onBlur);
    root.removeEventListener('mouseup', onRootMouseUp);
    root.remove();
    devices.clear();
    active = null;
  }

  return {
    addDevice,
    setActive,
    replaceSession,
    clear,
    snapshot,
    runScript,
    focus: () => ta.focus({ preventScroll: true }),
    activeName: () => active?.name ?? null,
    resetAll: () => { devices.clear(); active = null; out.textContent = ''; },
    destroy,
  };
}
