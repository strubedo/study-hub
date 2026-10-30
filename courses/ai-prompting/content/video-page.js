// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the course topics it supports. AI products change monthly, so check model names and features against the lessons.',
  playlist: null,
  legacy: { label: 'Older', title: 'Recorded on an older model or app version; the technique still applies but screens and model names differ' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'Free videos cover data-handling and privacy by plan type, writing and evaluating prompt test sets, comparing ChatGPT, Gemini and Claude, reasoning models, and prompt-injection defences for IT work only thinly, so rely on the lessons for those.',
  },
  resources: [
    { name: 'Anthropic: Prompt engineering overview', url: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview', note: 'Claude\'s official prompting guide.' },
    { name: 'OpenAI: Prompt engineering guide', url: 'https://platform.openai.com/docs/guides/prompt-engineering', note: 'OpenAI\'s official prompting guide.' },
    { name: 'Google: Prompt design strategies', url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies', note: 'Gemini\'s official prompting guide.' },
    { name: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/', note: 'Prompt injection and other LLM risks.' },
  ],
};
