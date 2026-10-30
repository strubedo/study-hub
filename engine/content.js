// Loads and indexes one course's study content (blueprint, lessons, questions,
// flashcards, videos, labs). Every path is resolved against the course
// directory. Missing banks degrade to empty lists so the app still runs while
// content is being authored.
import { courseUrl } from './course.js';

/** Imports a course-relative module. On failure logs it, records its path in `errors`, and returns null. */
export async function optionalModule(course, rel, errors) {
  try {
    return await import(courseUrl(course, rel));
  } catch (e) {
    console.error(`[content] could not load ${rel}: ${e.message}`);
    const clean = rel.replace(/^\.\//, '');
    errors.push(clean.startsWith(`${course.contentDir}/`) ? clean.slice(course.contentDir.length + 1) : clean);
    return null;
  }
}

const domainFile = (course, d, name) => `${course.contentDir}/d${d.id}/${name}.js`;

/** Lesson index only (no questions or markdown): [{ ...lesson, domain }]. Used by the hub for totals. */
export async function loadLessonIndex(course, errors = []) {
  const perDomain = await Promise.all(course.domains.map(async (d) => {
    const mod = await optionalModule(course, domainFile(course, d, 'lessons'), errors);
    return (mod?.default ?? []).map((l) => ({ ...l, domain: d.id }));
  }));
  return perDomain.flat();
}

const cache = new Map();

export async function loadContent(course) {
  if (cache.has(course.base)) return cache.get(course.base);
  const loadErrors = [];
  const list = async (rel, pick = (m) => m.default) => {
    if (!rel) return [];
    const mod = await optionalModule(course, rel, loadErrors);
    return mod ? pick(mod) ?? [] : [];
  };
  const perDomain = await Promise.all(course.domains.map(async (d) => {
    const [lessons, questions, flashcards] = await Promise.all(
      ['lessons', 'questions', 'flashcards'].map((name) => list(domainFile(course, d, name))),
    );
    const tag = (x) => ({ ...x, domain: d.id });
    return { domain: d, lessons: lessons.map(tag), questions: questions.map(tag), flashcards: flashcards.map(tag) };
  }));
  const [videos, labs] = await Promise.all([
    list(course.videos?.list),
    list(course.labs?.module, (m) => m.labs),
  ]);

  const lessons = perDomain.flatMap((p) => p.lessons);
  const questions = perDomain.flatMap((p) => p.questions);
  const flashcards = perDomain.flatMap((p) => p.flashcards);
  const banks = Object.fromEntries(perDomain.map((p) => [p.domain.id, p.questions]));
  const topicById = (id) => course.topics.find((t) => t.id === id) ?? null;

  const content = {
    loadErrors,
    domains: course.domains,
    topics: course.topics,
    lessons,
    questions,
    flashcards,
    videos,
    labs,
    banks,
    lessonById: new Map(lessons.map((l) => [l.id, l])),
    questionById: new Map(questions.map((q) => [q.id, q])),
    topicById,
    domainById: (id) => course.domains.find((d) => d.id === Number(id)) ?? null,
    lessonsForTopic: (t) => lessons.filter((l) => l.topic === t),
    questionsForTopic: (t) => questions.filter((q) => q.topic === t),
    videosForTopic: (t) => videos.filter((v) => v.topics?.includes(t)),
    labsForTopic: (t) => labs.filter((l) => l.topic === t),
  };
  cache.set(course.base, content);
  return content;
}

const mdCache = new Map();

export async function loadLessonMarkdown(course, lesson) {
  const url = courseUrl(course, `${course.contentDir}/d${lesson.domain}/lessons/${lesson.file}`);
  if (mdCache.has(url)) return mdCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lesson file not found (${res.status}): ${url}`);
  const text = await res.text();
  mdCache.set(url, text);
  return text;
}

/**
 * "Diagnose interface and cable…": verb + title, lower-casing the first word unless it is an acronym (IPv4, DHCPv4).
 * A topic can set `keepCase: true` when its title starts with a proper noun (Windows Server, Hyper-V, Azure Files).
 */
export function topicLabel(t) {
  if (!t.verb) return t.title;
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}
