// AI Prompt Engineering (ChatGPT, Gemini, Claude): a skills course with no certification exam.
// Outline is this site's own, built from the vendors' prompting guides (OpenAI, Google Gemini, Anthropic Claude docs),
// checked 2026-10-30. Model names and features change fast; lessons date-stamp anything product-specific.
// Domain `weight` sets how many questions the self-test draws from each domain.

export const EXAM = {
  code: 'Self-test',
  name: 'AI Prompt Engineering final self-test',
  certification: 'None (skills course)',
  product: 'ChatGPT, Google Gemini and Anthropic Claude',
  minutes: 45,
  questions: 40,
  scoring: 'Percent correct; 80% is this site\'s mastery mark.',
};

export const DOMAINS = [
  {
    id: 1, weight: 20, title: 'How Large Language Models Work', short: 'LLM basics',
    topics: [
      { id: '1.1', verb: 'Explain', title: 'how LLMs generate text', keepCase: true, sub: ['Tokens and tokenization', 'Next-token prediction, training and fine-tuning in plain terms', 'Context windows and what happens when you exceed them', 'Sampling: temperature and top-p', 'Why models hallucinate; knowledge cutoffs'] },
      { id: '1.2', verb: 'Compare', title: 'ChatGPT, Gemini and Claude', keepCase: true, sub: ['Model families and tiers (fast vs flagship vs reasoning)', 'Reasoning / extended thinking models', 'Multimodal input: images, files, audio', 'Consumer apps vs APIs vs workspace integrations', 'Picking a model for a task'] },
    ],
  },
  {
    id: 2, weight: 30, title: 'Core Prompting Techniques', short: 'Core techniques',
    topics: [
      { id: '2.1', verb: 'Write', title: 'clear, specific prompts', sub: ['Context, task, constraints, output format', 'Being explicit and giving the why', 'Audience and tone', 'Positive instructions vs "don\'t" lists', 'Iterating on a prompt'] },
      { id: '2.2', verb: 'Use', title: 'roles, system prompts and examples', sub: ['System / developer messages and custom instructions', 'Role prompting and its limits', 'Zero-shot, one-shot and few-shot examples', 'Choosing and formatting good examples'] },
      { id: '2.3', verb: 'Structure', title: 'prompts and outputs', sub: ['Delimiters, Markdown and XML tags', 'Putting long documents first and the question last', 'Structured output: JSON, tables, schemas', 'Prefilling and output templates'] },
      { id: '2.4', verb: 'Elicit', title: 'reasoning', sub: ['Chain-of-thought prompting', 'Reasoning models vs asking a model to think step by step', 'Self-checking and asking for verification', 'Breaking a problem into steps'] },
    ],
  },
  {
    id: 3, weight: 25, title: 'Advanced Techniques and Tools', short: 'Advanced & tools',
    topics: [
      { id: '3.1', verb: 'Build', title: 'multi-step workflows', sub: ['Prompt chaining', 'Working with long documents and files', 'Retrieval-augmented generation (RAG) concepts', 'Summarize-then-act patterns'] },
      { id: '3.2', verb: 'Use', title: 'custom assistants, tools and agents', sub: ['Custom GPTs, Gemini Gems and Claude Projects', 'Memory and personalization features', 'Tool use / function calling, web search and code execution', 'Agents and coding assistants (Claude Code, Codex, Gemini CLI)', 'Image generation prompts'] },
    ],
  },
  {
    id: 4, weight: 25, title: 'Reliability, Safety and Real-World Use', short: 'Reliability & use',
    topics: [
      { id: '4.1', verb: 'Reduce', title: 'hallucinations and verify output', sub: ['Grounding answers in supplied sources', 'Asking for citations and quotes', 'Letting the model say "I don\'t know"', 'Fact-checking technical output (commands, configs, code)'] },
      { id: '4.2', verb: 'Protect', title: 'data and defend against prompt injection', sub: ['What happens to your data: consumer vs business/enterprise plans, training opt-outs', 'Never pasting secrets or credentials', 'Prompt injection and indirect injection', 'Jailbreaks and why guardrails exist'] },
      { id: '4.3', verb: 'Apply', title: 'prompting to IT and networking work', keepCase: false, sub: ['Writing and reviewing scripts and configs', 'Troubleshooting with logs and show output', 'Documentation, change plans and runbooks', 'Evaluating prompts: test cases and comparing outputs'] },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

export function topicLabel(t) {
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}
