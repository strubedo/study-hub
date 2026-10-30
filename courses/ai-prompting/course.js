// AI Prompt Engineering course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'aiprompt:': every saved answer, lesson and test lives under it.
// There is no certification exam; the "exam" is this site's own 0–100 self-test with an 80% mastery mark.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'ai-prompting',
  name: 'AI Prompt Engineering',
  shortName: 'AI Prompting',
  title: 'ChatGPT, Gemini, Claude',
  subtitle: 'ChatGPT · Gemini · Claude',
  vendor: 'Vendor-neutral',
  description: 'Lessons, question bank, timed self-test and flashcards on getting reliable results from ChatGPT, Gemini and Claude: how LLMs work, clear prompts, examples and structure, reasoning, chaining and tools, custom assistants, hallucination control, data safety and prompt injection, and real IT and networking workflows.',
  storePrefix: 'aiprompt:',
  backupName: 'ai-prompting-backup',

  domains: DOMAINS,
  exams: [{
    id: 'self-test',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: EXAM.questions,
    minutes: EXAM.minutes,
    labs: 0,
    scoreMin: 0,
    scoreMax: 100,
    passScore: 80,
    partialCredit: false,
    passLabel: '80% mastery mark',
    trendLabel: '80% mastery',
    passNote: 'There is no certification exam for this course. The self-test reports percent correct; 80% is this site\'s mastery mark.',
    scoreNote: 'A question counts only when fully correct; multiple-select and fill-in-the-blank items get no partial credit.',
    dateHint: 'optional: set a target date to pace the study plan',
    about: {
      title: 'About the self-test',
      items: [
        `${EXAM.questions} questions in ${EXAM.minutes} minutes, drawn across all four domains by weight.`,
        'Mixes multiple choice, multiple select, ordering, matching and fill-in-the-blank, many built around a prompt you have to fix or judge.',
        'Model names and app features change often; product facts in the lessons are dated.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two timed self-tests; aim for 85%+.', '#/exam'],
      ['Rewrite three prompts you use at work with context, format and examples, and compare the results in two different assistants.', '#/learn'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Build one reusable assistant (Custom GPT, Gem or Claude Project) for a real task, such as reviewing switch configs.', '#/learn'],
      ['Skim the Reference tables (technique cheat sheet, feature comparison, safety checklist).', '#/reference'],
    ],
  },
};
