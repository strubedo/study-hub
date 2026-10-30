// Course configuration: loads courses/<id>/course.js and turns it into the
// normalized, validated object every engine module reads (ctx.course).
// Pure apart from the dynamic import in loadCourse(), so Node scripts and
// tests use it too. Schema: see README.md ("Adding a course").
import { deriveModes } from './lib/exams.js';

const REQUIRED_STRINGS = ['id', 'name', 'title', 'storePrefix'];
const OPTIONAL_MODULES = ['videos', 'reference', 'guide'];
// Routes the engine owns; plugin nav entries may not reuse them.
export const ENGINE_ROUTES = ['', 'plan', 'learn', 'videos', 'guide', 'practice', 'exam', 'flashcards', 'reference', 'settings', 'topic', 'lesson'];
// The hub keeps its own settings under this prefix, so no course may claim it.
export const HUB_PREFIX = 'studyhub:';

function fail(id, message) {
  throw new Error(`Course "${id ?? '?'}": ${message}`);
}

function normalizeDomains(raw) {
  const domains = raw.domains;
  if (!Array.isArray(domains) || !domains.length) fail(raw.id, 'needs a non-empty `domains` array (usually the blueprint DOMAINS export).');
  const ids = new Set();
  domains.forEach((d) => {
    if (!Number.isInteger(d.id) || d.id < 1) fail(raw.id, `domain id ${d.id} must be a positive integer (content lives in content/d<id>/).`);
    if (ids.has(d.id)) fail(raw.id, `duplicate domain id ${d.id}.`);
    ids.add(d.id);
    if (!Array.isArray(d.topics) || !d.topics.length) fail(raw.id, `domain ${d.id} has no topics.`);
  });
  return domains.map((d) => ({ ...d, short: d.short ?? d.title, topics: d.topics.map((t) => ({ ...t })) }));
}

/**
 * Score reporting scale from the exam's scoreMin / scoreMax / passScore (default 0-100, no pass line).
 * The simulator maps the fraction of credit earned linearly onto [scoreMin, scoreMax].
 */
function examScale(id, e) {
  const min = e.scoreMin ?? 0;
  const max = e.scoreMax ?? 100;
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) fail(id, `exam "${e.id}" needs scoreMin < scoreMax.`);
  const pass = e.passScore;
  if (pass !== undefined && !(pass >= min && pass <= max)) fail(id, `exam "${e.id}" passScore ${pass} is outside ${min}-${max}.`);
  return {
    min,
    max,
    pass,
    partialCredit: e.partialCredit ?? true, // false: an item earns credit only when fully correct (Fortinet)
    passLabel: e.passLabel ?? (pass !== undefined ? `passing score of ${pass}` : undefined),
    trendLabel: e.trendLabel ?? (pass !== undefined ? `${pass} to pass` : undefined),
  };
}

/** Resolves each exam's domain list: explicit `exam.domains`, else domains tagged `domain.exam === exam.id`, else (single exam) all. */
function normalizeExams(raw, domains) {
  const exams = raw.exams;
  if (!Array.isArray(exams) || !exams.length) fail(raw.id, 'needs at least one entry in `exams`.');
  const examIds = new Set(exams.map((e) => e.id));
  if (examIds.size !== exams.length) fail(raw.id, 'exam ids must be unique.');
  domains.forEach((d) => {
    if (d.exam !== undefined && !examIds.has(d.exam)) fail(raw.id, `domain ${d.id} belongs to unknown exam "${d.exam}".`);
  });

  const resolved = exams.map((e) => {
    if (typeof e.id !== 'string' || !e.id) fail(raw.id, 'every exam needs a string `id`.');
    const tagged = domains.filter((d) => d.exam === e.id).map((d) => d.id);
    const domainIds = e.domains ?? (tagged.length || exams.length > 1 ? tagged : domains.map((d) => d.id));
    if (!domainIds.length) fail(raw.id, `exam "${e.id}" has no domains (tag each domain with \`exam: '${e.id}'\`).`);
    domainIds.forEach((id) => { if (!domains.some((d) => d.id === id)) fail(raw.id, `exam "${e.id}" lists unknown domain ${id}.`); });
    // Weights are relative (vendors publish ranges; midpoints need not sum to 100). Consumers normalise.
    domains.filter((d) => domainIds.includes(d.id)).forEach((d) => {
      if (!(Number(d.weight) > 0)) fail(raw.id, `domain ${d.id} needs a positive \`weight\`.`);
    });
    ['questionCount', 'minutes'].forEach((k) => { if (!Number.isInteger(e[k]) || e[k] <= 0) fail(raw.id, `exam "${e.id}" needs a positive integer \`${k}\`.`); });
    const labs = e.labs ?? 0;
    if (!Number.isInteger(labs) || labs < 0) fail(raw.id, `exam "${e.id}" \`labs\` must be a whole number.`);
    if (labs > 0 && !raw.labs) fail(raw.id, `exam "${e.id}" asks for ${labs} labs but the course has no \`labs\` provider.`);
    const scale = examScale(raw.id, e);
    return {
      ...e,
      code: e.code ?? e.id,
      labs,
      domains: [...domainIds],
      scale,
      modes: e.modes ?? deriveModes({ questions: e.questionCount, labs, minutes: e.minutes }, raw.labs?.label),
    };
  });

  if (resolved.length > 1) {
    domains.forEach((d) => {
      const owners = resolved.filter((e) => e.domains.includes(d.id)).length;
      if (owners !== 1) fail(raw.id, `domain ${d.id} must belong to exactly one exam (found ${owners}).`);
    });
  }
  return resolved;
}

function normalizeNav(raw) {
  const nav = raw.nav ?? [];
  const seen = new Set();
  return nav.map((n) => {
    ['path', 'label', 'icon', 'group', 'module'].forEach((k) => {
      if (typeof n[k] !== 'string' || (k !== 'path' && !n[k])) fail(raw.id, `nav entry ${JSON.stringify(n.path)} needs a string \`${k}\`.`);
    });
    if (ENGINE_ROUTES.includes(n.path)) fail(raw.id, `nav path "${n.path}" is reserved by the engine.`);
    if (seen.has(n.path)) fail(raw.id, `duplicate nav path "${n.path}".`);
    seen.add(n.path);
    return { ...n };
  });
}

function normalizeLabs(raw, nav) {
  if (!raw.labs) return null;
  const labs = { label: 'labs', examLabel: 'labs', itemBadge: 'Lab', ...raw.labs };
  if (typeof labs.module !== 'string') fail(raw.id, '`labs.module` must point at the labs provider module.');
  if (!nav.some((n) => n.path === labs.route)) fail(raw.id, `\`labs.route\` "${labs.route}" must match one of the course's nav paths.`);
  return labs;
}

/**
 * raw: the course.js default export. base: URL (string or URL) of the course directory, ending in "/".
 * Returns a new object; the raw config and its blueprint arrays are never modified.
 */
export function normalizeCourse(raw, base) {
  if (!raw || typeof raw !== 'object') throw new Error('Course config must be an object (the default export of course.js).');
  REQUIRED_STRINGS.forEach((k) => { if (typeof raw[k] !== 'string' || !raw[k]) fail(raw.id, `\`${k}\` must be a non-empty string.`); });
  if (!/^[a-z0-9-]+$/.test(raw.id)) fail(raw.id, '`id` must be lower-case letters, digits or dashes.');
  if (!/^[a-z0-9-]+:$/.test(raw.storePrefix)) fail(raw.id, `\`storePrefix\` "${raw.storePrefix}" must look like "${raw.id}:".`);
  if (raw.storePrefix === HUB_PREFIX) fail(raw.id, `\`storePrefix\` "${HUB_PREFIX}" is reserved for the hub.`);
  OPTIONAL_MODULES.forEach((k) => {
    if (raw[k] === undefined) return;
    const path = k === 'videos' ? raw.videos?.list : raw[k];
    if (typeof path !== 'string') fail(raw.id, `\`${k}\` must be a module path${k === 'videos' ? ' (`videos.list`)' : ''}.`);
  });

  const baseUrl = new URL(String(base));
  const domains = normalizeDomains(raw);
  const nav = normalizeNav(raw);
  const course = {
    ...raw,
    shortName: raw.shortName ?? raw.name,
    subtitle: raw.subtitle ?? raw.title,
    contentDir: raw.contentDir ?? 'content',
    legacyBackupApps: [...(raw.legacyBackupApps ?? [])],
    backupName: raw.backupName ?? `${raw.id}-backup`,
    base: baseUrl.href,
    domains,
    topics: domains.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id }))),
    exams: normalizeExams(raw, domains),
    nav,
    labs: normalizeLabs(raw, nav),
  };
  return course;
}

/** Absolute URL for a path relative to the course directory. */
export function courseUrl(course, rel) {
  return new URL(rel, course.base).href;
}

/** Imports `<base>course.js` and normalizes it. `base` is the course directory URL. */
export async function loadCourse(base) {
  const baseUrl = new URL(String(base));
  const href = new URL('course.js', baseUrl).href;
  let mod;
  try {
    mod = await import(href);
  } catch (e) {
    throw new Error(`Could not load the course config at ${href}: ${e.message}`);
  }
  return normalizeCourse(mod.default, baseUrl);
}
