// Building AI Agents: a skills course with no certification exam.
// The outline is this site's own, built from the vendors' agent and tool-use documentation (Anthropic Claude
// developer docs and the Model Context Protocol specification first, with OpenAI and Google equivalents noted),
// checked 2026-11-23. APIs, SDKs and model names change fast; lessons date-stamp anything product-specific.
// Domain `weight` sets how many questions the self-test draws from each domain.

export const EXAM = {
  code: 'Self-test',
  name: 'Building AI Agents final self-test',
  certification: 'None (skills course)',
  product: 'LLM agents: tool use, MCP and agent SDKs',
  minutes: 45,
  questions: 40,
  scoring: 'Percent correct; 80% is this site\'s mastery mark.',
};

export const DOMAINS = [
  {
    id: 1, weight: 15, title: 'Agent Foundations', short: 'Foundations',
    topics: [
      { id: '1.1', verb: 'Explain', title: 'what an agent is and when to build one', sub: ['The agent loop: model, tools, results, repeat', 'Workflows vs agents: who controls the steps', 'When a single call or a fixed workflow is the better design', 'Cost, latency and error trade-offs of autonomy'] },
      { id: '1.2', verb: 'Describe', title: 'the anatomy of an agent request', sub: ['System prompt, messages and roles', 'Tool definitions', 'Stop reasons and what each one means for the loop', 'The context window as the agent\'s working memory'] },
      { id: '1.3', verb: 'Choose', title: 'a way to build an agent', sub: ['A model API with your own tool loop', 'SDK tool runners', 'Agent SDKs and frameworks', 'Hosted (managed) agents', 'What you own in each: loop, tools, state, sandbox'] },
    ],
  },
  {
    id: 2, weight: 25, title: 'Tools and the Model Context Protocol', short: 'Tools & MCP',
    topics: [
      { id: '2.1', verb: 'Define', title: 'tools a model can use well', sub: ['Names, descriptions and JSON Schema inputs', 'Writing descriptions that say when to use the tool', 'Required fields, enums and strict schemas', 'Tool results the model can act on, including errors'] },
      { id: '2.2', verb: 'Implement', title: 'the tool-use loop', sub: ['Tool-use requests and tool results in the message history', 'Parallel tool calls', 'Reporting tool errors back to the model', 'Ending the loop: final answers, limits and refusals', 'Controlling tool choice'] },
      { id: '2.3', verb: 'Compare', title: 'client tools and server tools', sub: ['Tools your code runs vs tools the provider runs', 'Web search and web fetch', 'Code execution', 'Computer use', 'Security differences between them'] },
      { id: '2.4', verb: 'Connect', title: 'agents to systems with the Model Context Protocol', keepCase: true, sub: ['Hosts, clients and servers', 'Tools, resources and prompts', 'Transports: stdio and Streamable HTTP', 'Authorization for remote servers', 'Writing and testing a small MCP server'] },
      { id: '2.5', verb: 'Get', title: 'structured output from a model', sub: ['JSON output constrained by a schema', 'Structured output vs tool use', 'Validating model output before acting on it'] },
    ],
  },
  {
    id: 3, weight: 20, title: 'Context, Memory and Orchestration', short: 'Context & orchestration',
    topics: [
      { id: '3.1', verb: 'Manage', title: 'an agent\'s context', sub: ['System prompts written for agents', 'Context budgets and what fills them', 'Compaction and context editing', 'Prompt caching and what breaks a cache'] },
      { id: '3.2', verb: 'Give', title: 'an agent memory and state', sub: ['Conversation state vs durable memory', 'Files and memory tools', 'Sessions and resuming work', 'What not to store'] },
      { id: '3.3', verb: 'Compare', title: 'retrieval approaches', sub: ['Retrieval-augmented generation with embeddings', 'Agentic search with tools', 'Chunking, ranking and citations', 'Choosing between them'] },
      { id: '3.4', verb: 'Apply', title: 'orchestration patterns', sub: ['Prompt chaining and routing', 'Parallelization', 'Orchestrator and workers (subagents)', 'Evaluator and optimizer loops', 'When more agents make things worse'] },
    ],
  },
  {
    id: 4, weight: 20, title: 'Reliability, Evaluation and Cost', short: 'Reliability & cost',
    topics: [
      { id: '4.1', verb: 'Evaluate', title: 'an agent', sub: ['Building a test set from real tasks', 'Code-based, model-based and human grading', 'Measuring the outcome and the path', 'Regression testing prompts and tools'] },
      { id: '4.2', verb: 'Debug', title: 'agent runs', sub: ['Reading a transcript of tool calls', 'Loops, stalls and premature stops', 'Truncation and token limits', 'Logging and tracing'] },
      { id: '4.3', verb: 'Control', title: 'cost and latency', sub: ['Choosing a model tier for each job', 'Token accounting: input, output and cached', 'Reasoning effort and thinking budgets', 'Batch processing and streaming'] },
      { id: '4.4', verb: 'Handle', title: 'failures', sub: ['Retries, timeouts and rate limits', 'Idempotent tools', 'Iteration and spend limits', 'Handing off to a human'] },
    ],
  },
  {
    id: 5, weight: 20, title: 'Safety and Deployment', short: 'Safety & deployment',
    topics: [
      { id: '5.1', verb: 'Defend', title: 'an agent against prompt injection', sub: ['Why tool results and retrieved content are untrusted', 'Direct and indirect injection', 'Limiting what a compromised agent can do', 'Confirmation for irreversible actions'] },
      { id: '5.2', verb: 'Apply', title: 'least privilege to tools, secrets and data', sub: ['Read-only by default', 'Scoped credentials and where secrets live', 'Sandboxing code and commands', 'Data handling and logging'] },
      { id: '5.3', verb: 'Deploy', title: 'an agent', sub: ['Interactive, scheduled and event-driven agents', 'Self-hosted loops vs hosted agents', 'Permissions and approval modes', 'Monitoring a deployed agent'] },
      { id: '5.4', verb: 'Design', title: 'agents for IT and network operations', keepCase: true, sub: ['A read-only diagnostics agent', 'A change agent with a human approval gate', 'Tools for devices, tickets and documentation', 'What to keep out of an agent\'s reach'] },
    ],
  },
];
