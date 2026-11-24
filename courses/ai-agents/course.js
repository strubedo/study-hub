// Building AI Agents course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'aiagents:': every saved answer, lesson and test lives under it.
// There is no certification exam; the "exam" is this site's own 0–100 self-test with an 80% mastery mark.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'ai-agents',
  name: 'Building AI Agents',
  shortName: 'AI Agents',
  title: 'Tools, MCP and agent SDKs',
  subtitle: 'Tools · MCP · Agent SDKs',
  vendor: 'Vendor-neutral',
  description: 'Lessons, question bank, timed self-test and flashcards on building AI agents that work: the agent loop, tool definitions and tool use, the Model Context Protocol, structured output, context and memory, orchestration patterns, evaluation and debugging, cost control, prompt injection defence and deployment, with worked examples for IT and network operations.',
  storePrefix: 'aiagents:',
  backupName: 'ai-agents-backup',

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
        `${EXAM.questions} questions in ${EXAM.minutes} minutes, drawn across all five domains by weight.`,
        'Mixes multiple choice, multiple select, ordering, matching and fill-in-the-blank, many built around a tool definition, a transcript or a snippet of agent code you have to read.',
        'APIs, SDKs and model names change often; product facts in the lessons are dated.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two timed self-tests; aim for 85%+.', '#/exam'],
      ['Build the smallest useful agent: one read-only tool, a tool loop and an iteration limit.', '#/learn'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Write five test tasks for your agent and grade a run by hand before you change anything.', '#/learn'],
      ['Skim the Reference tables (stop reasons, tool design checklist, orchestration patterns, injection defences).', '#/reference'],
    ],
  },
};
