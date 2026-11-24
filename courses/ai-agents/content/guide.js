// Course guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// There is no certification exam for this course; the facts below describe this site's self-test.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['No certification', 'This is a skills course. There is no vendor exam; the final self-test is this site\'s own.'],
  ['Self-test', `${EXAM.questions} questions in ${EXAM.minutes} minutes, drawn from all five domains by weight. 80% is the mastery mark.`],
  ['Who it is for', 'Engineers who can script a little (Python or JavaScript) and want to build agents that do real work, especially in IT and network operations.'],
  ['What you need first', 'The AI Prompt Engineering course on this site, or equal experience writing prompts. You should be comfortable reading JSON and a short script.'],
  ['Vendors', 'Examples use the Claude API and the Model Context Protocol first, and note where OpenAI and Google Gemini differ. The design ideas apply to any model with tool use.'],
  ['Dated facts', 'APIs, SDK names and model names change quickly. Lessons date-stamp product details; check the vendor documentation before you rely on one.'],
];

const STRATEGY = [
  ['Start with the smallest thing', 'One model call, then a fixed workflow, then an agent, and only when the simpler design falls short. Most tasks never need the last step.'],
  ['Design the tools first', 'An agent is only as good as its tools. A clear name, a description that says when to use it and a tight schema fix more failures than prompt tweaks do.'],
  ['Measure before you change', 'Write a handful of test tasks and grade a run before you touch the prompt. Without a baseline you cannot tell an improvement from a regression.'],
  ['Assume inputs are hostile', 'Anything an agent reads (a web page, a ticket, a file, a tool result) can contain instructions. Limit what the agent can do, and keep a person in the loop for anything irreversible.'],
];

// Every lab runs on any computer. The only cost is API usage, which the labs keep small.
const LAB = [
  ['Any computer', '**Python 3** or **Node.js**, a terminal and a text editor, on Windows, macOS (Apple silicon and Intel) or Linux.'],
  ['A model API key', 'Create a key with the provider you use and keep it in an environment variable or a secrets manager, never in code or in a repository. Set a spend limit before you start.'],
  ['Official SDKs', 'Install the provider\'s official SDK for your language. The lessons name the package and link the documentation instead of pinning a version that will go stale.'],
  ['MCP tooling', 'The Model Context Protocol SDKs and the MCP Inspector run locally and need no account.'],
  ['Keep it cheap', 'Use a small, fast model tier while you learn the loop, cap the number of iterations, and read the token counts each response reports.'],
];

export default function guide() {
  return {
    eyebrow: 'Course guide',
    title: 'Building AI Agents at a glance',
    intro: 'What the course covers, what you need and how to get the most from it.',
    action: { label: 'Claude developer docs', href: 'https://platform.claude.com/docs' },
    stats: [
      ['5', 'Domains'],
      [`${EXAM.questions}`, 'Self-test questions'],
      [`${EXAM.minutes} min`, 'Self-test time'],
      ['80%', 'Mastery mark'],
    ],
    rows: [
      [{
        title: 'About the course',
        accent: true,
        blocks: [{ type: 'text', md: 'An agent is a model that chooses its own next step by calling tools in a loop. This course covers how to design the tools, run the loop, manage context, measure results, control cost and keep the agent safe.' }],
      }],
      [{
        title: 'Course facts',
        blocks: [{ type: 'list', items: FACTS }],
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['Domain', 'Weight'] }],
      }],
      [{
        title: 'Set up on any computer',
        blocks: [{ type: 'list', items: LAB }],
      }],
      [{
        title: 'How to approach it',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
