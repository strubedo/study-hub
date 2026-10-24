// Question presentation, grading and exam assembly. Pure functions.

export function shuffle(arr, rng = Math.random) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Builds a randomized view of a question without altering the source object. */
export function prepareQuestion(q, rng = Math.random) {
  switch (q.type) {
    case 'single':
    case 'multi':
      return { ...q, choices: shuffle(q.options.map((text, orig) => ({ text, orig })), rng) };
    case 'order': {
      let items = shuffle(q.items, rng);
      if (items.every((v, i) => v === q.items[i]) && items.length > 1) items = [...items.slice(1), items[0]];
      return { ...q, shuffledItems: items };
    }
    case 'match':
      return { ...q, lefts: q.pairs.map((p) => p[0]), rights: shuffle(q.pairs.map((p) => p[1]), rng) };
    default:
      return { ...q };
  }
}

export function normalizeFill(s) {
  return String(s ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

/**
 * response shapes: single/multi → array of original option indices;
 * order → array of item strings; match → { left: right }; fill → string.
 */
export function gradeResponse(q, response) {
  const wrong = { correct: false, score: 0 };
  if (response === undefined || response === null) return wrong;
  switch (q.type) {
    case 'single':
    case 'multi': {
      if (!Array.isArray(response)) return wrong;
      const ok = sameSet([...new Set(response)], q.answer);
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case 'order': {
      if (!Array.isArray(response)) return wrong;
      const ok = response.length === q.items.length && response.every((v, i) => v === q.items[i]);
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case 'match': {
      if (typeof response !== 'object') return wrong;
      const hits = q.pairs.filter(([l, r]) => response[l] === r).length;
      return { correct: hits === q.pairs.length, score: hits / q.pairs.length };
    }
    case 'fill': {
      const ok = q.answer.some((a) => normalizeFill(a) === normalizeFill(response));
      return { correct: ok, score: ok ? 1 : 0 };
    }
    default:
      return wrong;
  }
}

function allocate(weights, total) {
  const ids = Object.keys(weights);
  const sum = ids.reduce((s, id) => s + weights[id], 0);
  const raw = ids.map((id) => ({ id, exact: (weights[id] / sum) * total }));
  const base = raw.map((r) => ({ ...r, n: Math.floor(r.exact) }));
  let remaining = total - base.reduce((s, r) => s + r.n, 0);
  const byRemainder = [...base].sort((a, b) => (b.exact - b.n) - (a.exact - a.n));
  const extra = new Set();
  for (const r of byRemainder) {
    if (remaining <= 0) break;
    extra.add(r.id);
    remaining -= 1;
  }
  return Object.fromEntries(base.map((r) => [r.id, r.n + (extra.has(r.id) ? 1 : 0)]));
}

/** Round-robin across topics so a domain's picks are spread over its blueprint topics. */
function stratifiedPick(questions, n, rng) {
  const byTopic = new Map();
  shuffle(questions, rng).forEach((q) => byTopic.set(q.topic, [...(byTopic.get(q.topic) ?? []), q]));
  const queues = shuffle([...byTopic.values()], rng).map((qs) => [...qs]);
  const picked = [];
  while (picked.length < n && queues.some((qq) => qq.length)) {
    for (const qq of queues) {
      if (picked.length >= n) break;
      if (qq.length) picked.push(qq.shift());
    }
  }
  return picked;
}

/**
 * banks: { [domainId]: Question[] }, weights: { [domainId]: percent }.
 * Returns `total` unique questions (fewer only if every bank is exhausted),
 * each tagged with its domain, in random order.
 */
export function buildExam(banks, weights, total, rng = Math.random) {
  const domains = Object.keys(banks).filter((d) => weights[d] > 0);
  const quota = allocate(Object.fromEntries(domains.map((d) => [d, weights[d]])), total);
  const chosen = [];
  const leftovers = [];
  for (const d of domains) {
    const tagged = banks[d].map((q) => ({ ...q, domain: Number(d) }));
    const picked = stratifiedPick(tagged, quota[d], rng);
    const pickedIds = new Set(picked.map((q) => q.id));
    chosen.push(...picked);
    leftovers.push(...tagged.filter((q) => !pickedIds.has(q.id)));
  }
  const shortfall = total - chosen.length;
  const backfill = shortfall > 0 ? shuffle(leftovers, rng).slice(0, shortfall) : [];
  return shuffle([...chosen, ...backfill], rng);
}

/**
 * results: [{ domain, correct, score }]. `scaled` is a rough linear mapping onto
 * Cisco's 300-1000 scale; Cisco's real scaling is unpublished.
 */
export function scoreExam(results) {
  const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
  const perDomain = {};
  results.forEach((r) => {
    const cur = perDomain[r.domain] ?? { correct: 0, total: 0 };
    perDomain[r.domain] = { correct: cur.correct + (r.correct ? 1 : 0), total: cur.total + 1 };
  });
  Object.keys(perDomain).forEach((d) => {
    perDomain[d] = { ...perDomain[d], percent: pct(perDomain[d].correct, perDomain[d].total) };
  });
  const correct = results.filter((r) => r.correct).length;
  const weighted = results.reduce((s, r) => s + (r.score ?? (r.correct ? 1 : 0)), 0);
  const percent = pct(correct, results.length);
  const scaled = results.length ? Math.round(300 + 700 * (weighted / results.length)) : 300;
  return { correct, total: results.length, percent, scaled, perDomain };
}
