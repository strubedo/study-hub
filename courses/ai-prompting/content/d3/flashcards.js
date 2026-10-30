// Domain 3 — Advanced Techniques and Tools. Original flashcards; product facts as of October 2026.
let n = 0;
const c = (topic, front, back) => ({ id: `d3-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('3.1', 'What is prompt chaining?', 'Splitting a task into stages, each its own prompt, with each output feeding the next.'),
  c('3.1', 'When is chaining worth it?', 'When you need to inspect intermediate results, use different models or formats per stage, or branch. Skip it for short single-output tasks.'),
  c('3.1', 'Most common chain pattern (Anthropic)?', 'Draft, critique against explicit criteria, then revise.'),
  c('3.1', 'Main risk of a chain?', 'Errors compound: a wrong early output is faithfully built on by later stages. Validate after costly stages.'),
  c('3.1', 'How to pass data between stages safely?', 'Wrap it in delimiters or tags, use structured output, validate in code, and pass only what the next stage needs.'),
  c('3.1', 'What is context rot?', 'Accuracy and recall can degrade as context grows, so curating what you include matters as much as window size.'),
  c('3.1', 'Quote-first technique?', 'Ask for the relevant exact quotes in tags before the answer, so the answer is grounded and checkable.'),
  c('3.1', 'Map-reduce for big inputs?', 'Run the same structured prompt on each piece (map), then one prompt to merge the results (reduce).'),
  c('3.1', 'How should you count lines or sum columns with an LLM?', 'Have it write a script or formula, then run that yourself. Models are unreliable at exact counting.'),
  c('3.1', 'What is RAG?', 'Retrieval-augmented generation: retrieve relevant passages from an index and put them in the prompt so the model answers from them.'),
  c('3.1', 'What is an embedding?', 'A numeric vector representing meaning; similar texts are close together, enabling semantic search.'),
  c('3.1', 'Name two RAG failure modes.', 'Retrieval miss (right passage not returned) and wrong or stale chunk. Also chunks that lose context.'),
  c('3.1', 'Does RAG retrain the model?', 'No. Retrieved text goes into the prompt at answer time; the weights are unchanged.'),
  c('3.1', 'Summarize-then-act?', 'Condense the input into a reviewable summary first, then act on it, with human approval before side effects.'),
  c('3.2', 'Custom assistant names by vendor?', 'Claude Projects, Gemini Gems, ChatGPT custom GPTs. Verify current features on the vendor page.'),
  c('3.2', 'What happens to Gems on personal accounts?', 'Google says that starting in November 2026 they go away and transition automatically to skills (as of October 2026).'),
  c('3.2', 'Instructions vs knowledge files in a custom assistant?', 'Instructions are standing rules like a system prompt; knowledge files are searchable reference material. Never put secrets in either.'),
  c('3.2', 'What is memory in an AI app?', 'Saved or retrieved text from past chats added to later prompts. It does not change model weights.'),
  c('3.2', 'Function calling in one sentence?', 'The model returns a structured tool call; your code runs it and returns a tool result; the model then answers.'),
  c('3.2', 'Client tool vs server tool (Anthropic)?', 'Client tools run in your application and return tool_result; server tools such as web search run on Anthropic\'s infrastructure.'),
  c('3.2', 'Why are tool descriptions important?', 'The model picks tools and fills arguments from the name, description and parameter descriptions: they are prompt text.'),
  c('3.2', 'What is MCP?', 'Model Context Protocol: an open standard for connecting AI applications to tools, data sources and workflows (like a USB-C port for AI).'),
  c('3.2', 'What is the agent loop?', 'The model picks an action, the harness runs the tool and returns the result, and this repeats until done or limited.'),
  c('3.2', 'Name three agent risks.', 'Compounding mistakes, irreversible side effects, and prompt injection from content the agent reads. Also over-broad permissions and runaway cost.'),
  c('3.2', 'Claude Code vs Codex vs Gemini CLI?', 'Terminal and IDE coding agents from Anthropic, OpenAI and Google. Gemini CLI now targets Code Assist enterprise users; others moved to Antigravity CLI (as of October 2026).'),
  c('3.2', 'Project instruction files for coding agents?', 'CLAUDE.md for Claude Code, AGENTS.md for Codex.'),
  c('3.2', 'Good image-prompt elements?', 'Subject, style, composition, colours, exact quoted text, exclusions and format; then iterate one change at a time.'),
];
