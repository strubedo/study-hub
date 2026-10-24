// Loads and indexes all study content (blueprint, lessons, questions,
// flashcards, videos, labs). Missing banks degrade to empty lists so the app
// still runs while content is being authored.
import { DOMAINS, ALL_TOPICS } from '../content/blueprint.js';

async function optionalImport(path, errors) {
  try {
    const mod = await import(path);
    return mod.default ?? [];
  } catch (e) {
    console.error(`[content] could not load ${path}: ${e.message}`);
    errors.push(path.replace(/^\.\.?\//, '').replace(/^content\//, ''));
    return [];
  }
}

let cache = null;

export async function loadContent() {
  if (cache) return cache;
  const loadErrors = [];
  const perDomain = await Promise.all(DOMAINS.map(async (d) => {
    const [lessons, questions, flashcards] = await Promise.all([
      optionalImport(`../content/d${d.id}/lessons.js`, loadErrors),
      optionalImport(`../content/d${d.id}/questions.js`, loadErrors),
      optionalImport(`../content/d${d.id}/flashcards.js`, loadErrors),
    ]);
    const tag = (x) => ({ ...x, domain: d.id });
    return { domain: d, lessons: lessons.map(tag), questions: questions.map(tag), flashcards: flashcards.map(tag) };
  }));
  const [videos, labs] = await Promise.all([
    optionalImport('../content/videos.js', loadErrors),
    optionalImport('./sim/labs/index.js', loadErrors),
  ]);

  const lessons = perDomain.flatMap((p) => p.lessons);
  const questions = perDomain.flatMap((p) => p.questions);
  const flashcards = perDomain.flatMap((p) => p.flashcards);
  const banks = Object.fromEntries(perDomain.map((p) => [p.domain.id, p.questions]));

  cache = {
    loadErrors,
    domains: DOMAINS,
    topics: ALL_TOPICS,
    lessons,
    questions,
    flashcards,
    videos,
    labs,
    banks,
    lessonById: new Map(lessons.map((l) => [l.id, l])),
    questionById: new Map(questions.map((q) => [q.id, q])),
    lessonsForTopic: (t) => lessons.filter((l) => l.topic === t),
    questionsForTopic: (t) => questions.filter((q) => q.topic === t),
    videosForTopic: (t) => videos.filter((v) => v.topics?.includes(t)),
    labsForTopic: (t) => labs.filter((l) => l.topic === t),
  };
  return cache;
}

const mdCache = new Map();

export async function loadLessonMarkdown(lesson) {
  const url = `content/d${lesson.domain}/lessons/${lesson.file}`;
  if (mdCache.has(url)) return mdCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Lesson file not found (${res.status}): ${url}`);
  const text = await res.text();
  mdCache.set(url, text);
  return text;
}
