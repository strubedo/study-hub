// Domain 3 — Advanced Techniques and Tools. Original content; product facts checked against vendor pages in October 2026.
export default [
  { id: '3.1-prompt-chaining', topic: '3.1', title: 'Prompt Chaining: One Job per Prompt', minutes: 9, file: '3.1-prompt-chaining.md',
    objectives: ['Explain what prompt chaining is and when it beats a single prompt', 'Design a multi-stage chain with clean hand-offs between stages', 'Recognise the common patterns: extract-analyze-write, draft-critique-revise, classify-route, map-reduce', 'Anticipate compounding errors and add checks'] },
  { id: '3.1-long-documents-files', topic: '3.1', title: 'Working with Long Documents and Files', minutes: 9, file: '3.1-long-documents-files.md',
    objectives: ['Describe what an app may do with an attached file', 'Explain why long context does not guarantee equal recall', 'Apply quote-first, scoping and map-reduce techniques', 'Handle spreadsheets, PDFs and screenshots safely'] },
  { id: '3.1-rag-summarize-then-act', topic: '3.1', title: 'Retrieval-Augmented Generation and Summarize-then-Act', minutes: 10, file: '3.1-rag-summarize-then-act.md',
    objectives: ['Explain the retrieve-then-generate pipeline and what an embedding is', 'Contrast RAG with pasting into context and with fine-tuning', 'List RAG failure modes and how to prompt for grounded answers', 'Use summarize-then-act with a human checkpoint'] },
  { id: '3.2-custom-assistants-memory', topic: '3.2', title: 'Custom Assistants (Projects, Gems, GPTs) and Memory', minutes: 10, file: '3.2-custom-assistants-memory.md',
    objectives: ['Compare Claude Projects, Gemini Gems and custom GPTs', 'Write instructions and choose knowledge files for a custom assistant', 'Describe memory and personalization features and their trade-offs', 'Recognise that product features change and must be verified'] },
  { id: '3.2-tools-function-calling', topic: '3.2', title: 'Tool Use, Function Calling, Web Search, Code Execution and MCP', minutes: 11, file: '3.2-tools-function-calling.md',
    objectives: ['Trace the function-calling loop: definition, tool call, tool result, answer', 'Write tool definitions that a model can choose correctly', 'Apply safety rules to the code behind a tool', 'Explain hosted tools, search, code execution and the Model Context Protocol'] },
  { id: '3.2-agents-coding-images', topic: '3.2', title: 'Agents, Coding Assistants and Image Generation Prompts', minutes: 12, file: '3.2-agents-coding-images.md',
    objectives: ['Define the agent loop and contrast agents with chains', 'List agent risks and the controls that reduce them', 'Compare Claude Code, Codex and Gemini CLI and prompt a coding agent well', 'Write structured image prompts and iterate on them'] },
];
