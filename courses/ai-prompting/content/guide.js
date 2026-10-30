// Course guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// No certification exam: this page explains how to use the course and where it leads.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Certification', 'None. This is a skills course for using AI assistants well at work.'],
  ['Self-test', `${EXAM.questions} questions in ${EXAM.minutes} minutes, scored as percent correct.`],
  ['Mastery mark', '**80%** on the self-test, and every domain above 80% on the dashboard.'],
  ['Sources', 'The vendors\' own prompting guides: OpenAI, Google (Gemini) and Anthropic (Claude). Product facts are dated because they change often.'],
];

const STRATEGY = [
  ['Practise on real work', 'Use your own tasks: a config to review, a log to explain, a runbook to write. Prompting is learned by doing.'],
  ['Compare assistants', 'Run the same prompt in ChatGPT, Gemini and Claude. The differences teach you more than any rule.'],
  ['Verify everything', 'Treat output like a junior engineer\'s first draft: check commands, numbers and citations before you use them.'],
  ['Keep secrets out', 'Never paste passwords, keys or customer data into a consumer chat app.'],
];

export default function guide() {
  return {
    eyebrow: 'Course guide',
    title: 'How to use this course',
    intro: 'AI Prompt Engineering has no exam of its own. Work through the four domains in order, then use the self-test to prove mastery.',
    action: { label: 'Claude prompting guide', href: 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview' },
    stats: [
      [`${EXAM.minutes} min`, 'Self-test time'],
      [String(EXAM.questions), 'Self-test questions'],
      ['80%', 'Mastery mark'],
      ['4', 'Domains'],
    ],
    rows: [
      [{
        title: 'About this course',
        accent: true,
        blocks: [{ type: 'text', md: 'How to get accurate, useful results from ChatGPT, Gemini and Claude, from the basics of how language models work to multi-step workflows, custom assistants, safety and real IT tasks.' }],
      }],
      [{
        title: 'Course facts',
        blocks: [{ type: 'list', items: FACTS }],
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['Domain', 'Self-test share'] }],
      }],
      [{
        title: 'Study strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
