// Small DOM helpers shared by the lab UI. Text is always inserted as text nodes;
// only HTML produced by a markdown renderer is ever assigned to innerHTML.

export function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs ?? {}).forEach(([k, v]) => {
    if (v == null || v === false) return;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  });
  children.flat().forEach((c) => {
    if (c == null || c === false) return;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  });
  return node;
}

/** Element whose content is trusted HTML produced by a markdown renderer. */
export function mdBlock(tag, cls, html) {
  const node = document.createElement(tag);
  node.className = cls;
  node.innerHTML = html;
  return node;
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[c]);
}

function inline(s) {
  return escapeHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
}

/** Minimal, escape-first markdown used when the host does not supply ctx.md. */
export function fallbackMd(markdown) {
  const lines = String(markdown ?? '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let list = null;
  let para = [];
  let fence = null;
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(' '))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`);
    list = null;
  };
  lines.forEach((line) => {
    if (fence) {
      if (/^```/.test(line)) { out.push(`<pre><code>${escapeHtml(fence.join('\n'))}</code></pre>`); fence = null; } else fence.push(line);
      return;
    }
    if (/^```/.test(line)) { flushPara(); flushList(); fence = []; return; }
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const head = line.match(/^(#{1,4})\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const tag = ul ? 'ul' : 'ol';
      if (list && list.tag !== tag) flushList();
      if (!list) list = { tag, items: [] };
      list.items.push((ul ?? ol)[1]);
    } else if (head) {
      flushPara(); flushList();
      const level = Math.min(head[1].length + 2, 6);
      out.push(`<h${level}>${inline(head[2])}</h${level}>`);
    } else if (!line.trim()) {
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  });
  if (fence) out.push(`<pre><code>${escapeHtml(fence.join('\n'))}</code></pre>`);
  flushPara();
  flushList();
  return out.join('\n');
}

const TYPE_GLYPH = {
  router: 'M4 9h16v6H4z M8 12h3M13 12h3',
  switch: 'M3 8h18v8H3z M7 11h4M13 13h4',
  l3switch: 'M3 8h18v8H3z M7 11h4M13 13h4M17 5v3',
  pc: 'M4 5h16v11H4z M9 20h6M12 16v4',
  server: 'M7 3h10v18H7z M9.5 7h5M9.5 10h5',
};

export function typeIcon(type, size = 15) {
  const NS = 'http://www.w3.org/2000/svg';
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', size);
  s.setAttribute('height', size);
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('class', 'sim-type-icon');
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', TYPE_GLYPH[type] ?? TYPE_GLYPH.pc);
  s.append(p);
  return s;
}

export const TYPE_LABEL = {
  router: 'Router', switch: 'Switch', l3switch: 'L3 switch', pc: 'PC', server: 'Server',
};

export const DIFFICULTY_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

export function fmtClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const two = (n) => String(n).padStart(2, '0');
  return hh ? `${hh}:${two(mm)}:${two(ss)}` : `${two(mm)}:${two(ss)}`;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = h('textarea', { class: 'sim-offscreen' });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}
