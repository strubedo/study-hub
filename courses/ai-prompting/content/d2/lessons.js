// Domain 2 — Core Prompting Techniques. Original content; technique claims checked against the vendors' prompting guides in October 2026.
export default [
  { id: '2.1-anatomy-explicit', topic: '2.1', title: 'Anatomy of a Clear Prompt: Context, Task, Constraints, Format', minutes: 9, file: '2.1-anatomy-explicit.md',
    objectives: ['Break a prompt into context, task, constraints and output format', 'Use precise verbs and measurable success criteria', 'Explain why giving the reason behind an instruction helps', 'Give the model a legitimate way to say it cannot tell'] },
  { id: '2.1-audience-positive-iterate', topic: '2.1', title: 'Audience, Positive Instructions and Iterating', minutes: 9, file: '2.1-audience-positive-iterate.md',
    objectives: ['Specify audience and tone for the output', 'Rewrite "don\'t" lists as positive instructions and know when prohibitions are valid', 'Run a repeatable prompt iteration loop', 'Diagnose common prompt failure patterns'] },
  { id: '2.2-system-prompts-roles', topic: '2.2', title: 'System and Developer Messages, Custom Instructions and Roles', minutes: 10, file: '2.2-system-prompts-roles.md',
    objectives: ['Place standing rules in system or developer messages and data in the user turn', 'Compare how OpenAI, Anthropic and Google expose standing instructions', 'Use role prompting to set tone and perspective', 'State the limits of role prompting'] },
  { id: '2.2-examples-few-shot', topic: '2.2', title: 'Zero-Shot, One-Shot and Few-Shot Examples', minutes: 8, file: '2.2-examples-few-shot.md',
    objectives: ['Distinguish zero-shot, one-shot and few-shot prompts', 'Choose relevant, diverse and consistently formatted examples', 'Avoid over-copying and example bias', 'Match example use to standard versus reasoning models'] },
  { id: '2.3-delimiters-long-docs', topic: '2.3', title: 'Delimiters, Markdown, XML Tags and Long Documents', minutes: 9, file: '2.3-delimiters-long-docs.md',
    objectives: ['Separate instructions from data with Markdown or XML-style tags', 'Place long documents first and the question last', 'Wrap multiple documents with source metadata', 'Ask for quotes first to ground an answer'] },
  { id: '2.3-structured-output-prefill', topic: '2.3', title: 'Structured Output, Templates and Prefilling', minutes: 10, file: '2.3-structured-output-prefill.md',
    objectives: ['Request tables, JSON and fixed templates reliably', 'Contrast prompt-only formats with platform structured outputs', 'Explain prefill and where Claude no longer supports it', 'Handle missing data in templates'] },
  { id: '2.4-reasoning', topic: '2.4', title: 'Chain of Thought, Reasoning Models, Self-Checking and Decomposition', minutes: 11, file: '2.4-reasoning.md',
    objectives: ['Apply chain-of-thought prompting and mark the final answer', 'Explain why reasoning models need less "think step by step"', 'Use self-checks and know their limits', 'Break a problem into steps or a prompt chain'] },
];
