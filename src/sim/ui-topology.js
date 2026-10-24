// Inline-SVG topology diagram for a lab. Built with createElementNS + textContent
// (no markup strings), auto-laid-out by device tier unless the lab gives x/y hints.
//
// layoutTopology(topology) -> Map(name -> { x, y })   (grid units, DOM-free, testable)
// renderTopology(topology, { onSelect }) -> { el, setActive(name), destroy() }

const NS = 'http://www.w3.org/2000/svg';
const COL_W = 150;
const ROW_H = 135;
const PAD_X = 70;
const PAD_Y = 50;
const LABEL_FRACTION = 0.22;
const LABEL_MIN_PX = 54; // clear of the icon and the device name
const STAGGER = 0.55;

const TIER_SPACING = { router: 1.6, l3switch: 1.6, switch: 1.6, pc: 1.15, server: 1.15 };

function tierOf(type, hasL3) {
  if (type === 'router') return 0;
  if (type === 'l3switch') return 1;
  if (type === 'switch') return hasL3 ? 2 : 1;
  return 3;
}

function neighbors(links) {
  const map = new Map();
  const add = (a, b) => {
    if (!map.has(a)) map.set(a, []);
    map.get(a).push(b);
  };
  links.forEach(([a, , b]) => { add(a, b); add(b, a); });
  return map;
}

function barycenter(names, nbrs, pos, exclude) {
  return names.map((n, i) => {
    const xs = (nbrs.get(n) ?? []).filter((m) => pos.has(m) && !exclude.has(m)).map((m) => pos.get(m).x);
    const bc = xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
    return { n, i, bc };
  });
}

/** Place a tier evenly, then slide it so it sits under/over its neighbours on average. */
function placeTier(names, spacing, y, pos, nbrs) {
  const offset = ((names.length - 1) * spacing) / 2;
  const fresh = new Map(names.map((n, i) => [n, i * spacing - offset]));
  const own = new Set(names);
  const scored = barycenter(names, nbrs, pos, own).filter((s) => s.bc != null);
  const shift = scored.length
    ? scored.reduce((sum, s) => sum + (s.bc - fresh.get(s.n)), 0) / scored.length
    : 0;
  names.forEach((n) => pos.set(n, { x: fresh.get(n) + shift, y }));
}

function orderTier(names, nbrs, pos) {
  const scored = barycenter(names, nbrs, pos, new Set(names));
  return scored
    .sort((a, b) => {
      if (a.bc == null && b.bc == null) return a.i - b.i;
      if (a.bc == null) return 1;
      if (b.bc == null) return -1;
      return a.bc - b.bc || a.i - b.i;
    })
    .map((s) => s.n);
}

/** If a tier has links that skip over a member, stagger every other device vertically. */
function staggerIfNeeded(names, links, pos) {
  if (names.length < 3) return;
  const index = new Map(names.map((n, i) => [n, i]));
  const skips = links.some(([a, , b]) => index.has(a) && index.has(b) && Math.abs(index.get(a) - index.get(b)) > 1);
  if (!skips) return;
  names.forEach((n, i) => {
    if (i % 2 === 1) pos.set(n, { ...pos.get(n), y: pos.get(n).y + STAGGER });
  });
}

export function layoutTopology(topology) {
  const devices = topology?.devices ?? [];
  const links = topology?.links ?? [];
  const hasL3 = devices.some((d) => d.type === 'l3switch') && devices.some((d) => d.type === 'switch');
  const nbrs = neighbors(links);
  const tiers = new Map();
  devices.forEach((d) => {
    const t = tierOf(d.type, hasL3);
    if (!tiers.has(t)) tiers.set(t, []);
    tiers.get(t).push(d.name);
  });
  const tierKeys = [...tiers.keys()].sort((a, b) => a - b);
  const pos = new Map();
  const spacingOf = (names) => TIER_SPACING[devices.find((d) => d.name === names[0])?.type] ?? 1.5;
  const pass = (keys, reorder) => keys.forEach((t, idx) => {
    const names = reorder && idx > 0 ? orderTier(tiers.get(t), nbrs, pos) : tiers.get(t);
    const row = tierKeys.indexOf(t);
    const near = new Map(pos);
    // only neighbours in tiers already placed in this pass influence the shift
    keys.slice(idx).forEach((k) => tiers.get(k).forEach((n) => near.delete(n)));
    placeTier(names, spacingOf(names), row * 1.3, near.size ? near : pos, nbrs);
    names.forEach((n) => pos.set(n, near.get(n) ?? pos.get(n)));
    tiers.set(t, names);
  });
  pass(tierKeys, true); // top-down
  pass([...tierKeys].reverse(), true); // bottom-up
  pass(tierKeys, false); // re-align top-down keeping order
  tierKeys.forEach((t) => staggerIfNeeded(tiers.get(t), links, pos));
  // explicit hints win
  devices.forEach((d) => {
    if (Number.isFinite(d.x) && Number.isFinite(d.y)) pos.set(d.name, { x: d.x, y: d.y });
  });
  return pos;
}

// ---------- SVG helpers ----------

function svg(tag, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
  if (parent) parent.append(node);
  return node;
}

function text(parent, x, y, content, cls) {
  const t = svg('text', { x, y, class: cls, 'text-anchor': 'middle' }, parent);
  t.textContent = content;
  return t;
}

const ARROW = 'M-6 0h12M3-3l3 3-3 3M-3-3l-3 3 3 3';

function iconRouter(g) {
  svg('ellipse', { cx: 0, cy: 6, rx: 22, ry: 8, class: 'sim-ico-body' }, g);
  svg('rect', { x: -22, y: -6, width: 44, height: 12, class: 'sim-ico-body sim-ico-side' }, g);
  svg('ellipse', { cx: 0, cy: -6, rx: 22, ry: 8, class: 'sim-ico-body' }, g);
  svg('path', { d: 'M-12 -6h9M-6 -9l3 3-3 3M12 -6h-9M6 -9l-3 3 3 3', class: 'sim-ico-mark' }, g);
}

function iconSwitch(g, l3) {
  svg('rect', { x: -24, y: -14, width: 48, height: 28, rx: 4, class: 'sim-ico-body' }, g);
  svg('path', { d: ARROW, transform: 'translate(-8,-5)', class: 'sim-ico-mark' }, g);
  svg('path', { d: ARROW, transform: 'translate(8,5)', class: 'sim-ico-mark' }, g);
  if (l3) {
    svg('rect', { x: 12, y: -22, width: 20, height: 13, rx: 3, class: 'sim-ico-badge' }, g);
    text(g, 22, -12.5, 'L3', 'sim-ico-badge-text');
  }
}

function iconPc(g) {
  svg('rect', { x: -18, y: -16, width: 36, height: 24, rx: 3, class: 'sim-ico-body' }, g);
  svg('rect', { x: -14, y: -12, width: 28, height: 16, rx: 1, class: 'sim-ico-screen' }, g);
  svg('path', { d: 'M-4 8v5M4 8v5M-10 14h20', class: 'sim-ico-mark' }, g);
}

function iconServer(g) {
  svg('rect', { x: -13, y: -20, width: 26, height: 38, rx: 3, class: 'sim-ico-body' }, g);
  svg('path', { d: 'M-8 -12h16M-8 -6h16M-8 0h16', class: 'sim-ico-mark' }, g);
  svg('circle', { cx: 0, cy: 10, r: 2.2, class: 'sim-ico-led' }, g);
}

function drawIcon(g, type) {
  if (type === 'router') iconRouter(g);
  else if (type === 'switch') iconSwitch(g, false);
  else if (type === 'l3switch') iconSwitch(g, true);
  else if (type === 'server') iconServer(g);
  else iconPc(g);
}

function px(p, minX, minY) {
  return { x: (p.x - minX) * COL_W + PAD_X, y: (p.y - minY) * ROW_H + PAD_Y };
}

const PARALLEL_GAP_PX = 18;

/** Offsets each of several links between the same device pair perpendicular to the pair's axis. */
function parallelOffsets(links, coords) {
  const pairKey = (a, b) => [a, b].sort().join('|');
  const groups = new Map();
  links.forEach((l, i) => {
    const key = pairKey(l[0], l[2]);
    groups.set(key, [...(groups.get(key) ?? []), i]);
  });
  const offsets = new Map();
  groups.forEach((idxs) => {
    idxs.forEach((linkIdx, k) => {
      const [first, second] = [links[linkIdx][0], links[linkIdx][2]].sort();
      const p1 = coords.get(first);
      const p2 = coords.get(second);
      if (!p1 || !p2) return;
      const len = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      const shift = (k - (idxs.length - 1) / 2) * PARALLEL_GAP_PX;
      offsets.set(linkIdx, { dx: (-(p2.y - p1.y) / len) * shift, dy: ((p2.x - p1.x) / len) * shift });
    });
  });
  return offsets;
}

function drawLinks(root, links, coords) {
  const layer = svg('g', { class: 'sim-topo-links' }, root);
  const labels = svg('g', { class: 'sim-topo-labels' }, root);
  const offsets = parallelOffsets(links, coords);
  links.forEach(([a, ifA, b, ifB], i) => {
    const ca = coords.get(a);
    const cb = coords.get(b);
    if (!ca || !cb) return;
    const { dx, dy } = offsets.get(i) ?? { dx: 0, dy: 0 };
    const pa = { x: ca.x + dx, y: ca.y + dy };
    const pb = { x: cb.x + dx, y: cb.y + dy };
    svg('line', { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y, class: 'sim-topo-link' }, layer);
    const len = Math.hypot(pb.x - pa.x, pb.y - pa.y) || 1;
    const dist = Math.min(Math.max(len * LABEL_FRACTION, LABEL_MIN_PX), len / 2 - 6);
    const f = Math.max(dist, 0) / len;
    const at = (t) => ({ x: pa.x + (pb.x - pa.x) * t, y: pa.y + (pb.y - pa.y) * t });
    const la = at(f);
    const lb = at(1 - f);
    text(labels, la.x, la.y + 3, ifA, 'sim-topo-if');
    text(labels, lb.x, lb.y + 3, ifB, 'sim-topo-if');
  });
}

export function renderTopology(topology, { onSelect = () => {} } = {}) {
  const devices = topology?.devices ?? [];
  const links = topology?.links ?? [];
  const pos = layoutTopology(topology);
  const pts = [...pos.values()];
  const minX = Math.min(...pts.map((p) => p.x), 0);
  const minY = Math.min(...pts.map((p) => p.y), 0);
  const maxX = Math.max(...pts.map((p) => p.x), 0);
  const maxY = Math.max(...pts.map((p) => p.y), 0);
  const width = (maxX - minX) * COL_W + PAD_X * 2;
  const height = (maxY - minY) * ROW_H + PAD_Y * 2 + 18;
  const coords = new Map([...pos].map(([n, p]) => [n, px(p, minX, minY)]));

  const root = svg('svg', {
    viewBox: `0 0 ${Math.max(width, 240)} ${Math.max(height, 140)}`,
    class: 'sim-topo-svg',
    role: 'img',
    'aria-label': `Lab topology: ${devices.map((d) => d.name).join(', ')}`,
  });
  drawLinks(root, links, coords);

  const nodes = new Map();
  const nodeLayer = svg('g', { class: 'sim-topo-nodes' }, root);
  devices.forEach((d) => {
    const c = coords.get(d.name);
    const g = svg('g', { class: `sim-topo-node sim-type-${d.type}`, transform: `translate(${c.x},${c.y})`, tabindex: 0, role: 'button' }, nodeLayer);
    const title = svg('title', {}, g);
    title.textContent = `${d.name} (${d.type}) - open console`;
    svg('rect', { x: -32, y: -28, width: 64, height: 76, rx: 8, class: 'sim-topo-hit' }, g);
    drawIcon(g, d.type);
    text(g, 0, 38, d.name, 'sim-topo-name');
    nodes.set(d.name, g);
  });

  const onClick = (e) => {
    const g = e.target.closest?.('.sim-topo-node');
    if (!g) return;
    const name = [...nodes].find(([, node]) => node === g)?.[0];
    if (name) onSelect(name);
  };
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); }
  };
  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKey);

  return {
    el: root,
    setActive(name) {
      nodes.forEach((g, n) => g.classList.toggle('active', n === name));
    },
    destroy() {
      root.removeEventListener('click', onClick);
      root.removeEventListener('keydown', onKey);
      root.remove();
    },
  };
}
