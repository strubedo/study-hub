// Domain 4 — Reliability, Evaluation and Cost (20%). Original content.
// Written 2026-11-23. Facts checked that day against the Claude developer docs (platform.claude.com/docs: define success
// criteria and build evaluations, errors, rate limits, batch processing, streaming, effort, thinking, extended thinking,
// thinking steering and cost, task budgets, fast mode, service tiers, pricing, choosing a model, optimizing for cost and
// intelligence, reducing latency, OpenTelemetry overview, SDK and span pages, tool-use troubleshooting, Python SDK page,
// Managed Agents session budgets), the Python SDK source on GitHub (exceptions, retry constants), the Claude Agent SDK
// docs (observability, cost tracking), Anthropic's engineering articles "Demystifying evals for AI agents" and "Writing
// effective tools for agents", OpenAI's API docs (agent evals, graders, batch, reasoning, error codes, Agents SDK
// tracing and running agents, Python SDK README) and the Gemini API docs (thinking, batch, optimization, API errors,
// troubleshooting). Every URL is listed in REVIEW-TODO.md. Transcripts, usage reports and log lines are written from
// documented shapes, not captured.
export default [
  // 4.1 Evaluating an agent
  { id: '4.1-test-sets', topic: '4.1', title: 'Building an Agent Test Set from Real Tasks', minutes: 12, file: '4.1-test-sets.md',
    objectives: ['Explain why a fixed test set must exist before any tuning', 'Use the eval vocabulary: task, trial, grader, transcript, outcome, suite', 'Build test cases from real tickets, manual checks and past failures, balanced across representative, edge, decline and escalate cases', 'Record input, environment, expected outcome, required evidence, forbidden calls and a path budget for each case', 'Separate capability suites from regression suites'] },
  { id: '4.1-grading-methods', topic: '4.1', title: 'Grading Agent Runs: Code, Model and Human Graders', minutes: 14, file: '4.1-grading-methods.md',
    objectives: ['Compare code-based, model-based and human grading as the vendors describe them', 'Write code checks for agents: tool-call assertions, forbidden calls, schema checks, sandbox state and path metrics', 'Write a model grader with a rubric, reasoning before a closed verdict and an UNKNOWN way out', 'Parse grader verdicts strictly and calibrate a model grader against human labels', 'Decide when human grading is worth its cost'] },
  { id: '4.1-eval-worked-example', topic: '4.1', title: 'A Worked Eval: Grader, Pass Rates and Regression Testing', minutes: 15, file: '4.1-eval-worked-example.md',
    objectives: ['Specify five test cases for a read-only diagnostics agent', 'Score recorded transcripts and sandbox state with a pure-Python grader', 'Run cases several times and read pass rates, pass@k and pass^k', 'Measure the outcome and the path: tool calls, tokens and time per trial', 'Rerun a regression suite whenever the prompt, a tool, the model or its settings change'] },
  // 4.2 Debugging agent runs
  { id: '4.2-reading-transcripts', topic: '4.2', title: 'Reading a Transcript: Failure Shapes and Where the Fix Belongs', minutes: 14, file: '4.2-reading-transcripts.md',
    objectives: ['Read a transcript from the final stop reason back to the first divergence', 'Recognize loops, stalls, premature stops, wrong tools or arguments, ignored errors and hallucinated results', 'Diagnose truncation, including an incomplete tool call, and context overflow from stop reasons and errors', 'Choose a fix in the right place: tool result, tool description, tool shape, system prompt or limits', 'Explain why the fix usually belongs in the tool'] },
  { id: '4.2-logging-tracing', topic: '4.2', title: 'Logging, Tracing and Redaction', minutes: 14, file: '4.2-logging-tracing.md',
    objectives: ['List the fields to log for every model call and every tool call', 'Find the request id on Claude responses, error bodies and SDK exceptions', 'Describe OpenTelemetry tracing in the Anthropic SDK and API, the Claude Agent SDK and the OpenAI Agents SDK', 'Choose a content mode and keep prompts and results out of traces by default', 'Redact secrets and personal data from logs, and keep them out of tool results'] },
  // 4.3 Cost and latency
  { id: '4.3-token-accounting', topic: '4.3', title: 'Token Accounting and the Cost of a Run', minutes: 14, file: '4.3-token-accounting.md',
    objectives: ['Price each usage count: uncached input, cache writes, cache reads and output', 'Apply the documented multipliers for caching, batch, data residency and fast mode, date-stamped', 'Explain why thinking tokens are billed as output and count toward max_tokens', 'Price one agent run three ways and explain the differences', 'Compare configurations on cost per completed task'] },
  { id: '4.3-model-tier-effort', topic: '4.3', title: 'Model Tiers, Effort and Thinking', minutes: 14, file: '4.3-model-tier-effort.md',
    objectives: ['Assign a model tier to each job in an agent using the vendor model-selection guidance', 'Set output_config.effort and explain what it controls and what it does not', 'Describe adaptive thinking, the deprecated budget_tokens mode and per-model thinking rules', 'Size max_tokens for thinking and recognize the cache cost of switching models or effort mid-run', 'Name the OpenAI and Gemini equivalents for effort and thinking budgets'] },
  { id: '4.3-batch-streaming', topic: '4.3', title: 'Batch, Streaming and Other Cost and Latency Levers', minutes: 14, file: '4.3-batch-streaming.md',
    objectives: ['Describe the Message Batches API: discount, completion window, limits, custom_id and result types', 'Decide which agent workloads suit batching, including eval runs and grader calls', 'Use streaming for perceived latency and long outputs, and handle mid-stream errors', 'Apply other documented levers: caching, parallel tool calls, trimmed results, shorter answers and fast mode', 'Compare batch, flex and priority options across vendors'] },
  // 4.4 Handling failures
  { id: '4.4-retries-timeouts', topic: '4.4', title: 'Retries, Backoff, Timeouts and Rate Limits', minutes: 14, file: '4.4-retries-timeouts.md',
    objectives: ['Classify Claude API errors by status and type, and decide which to retry', 'Recognize the spend-cap and ramp-limit 429s from error.details.error_code', 'Configure the SDK\'s automatic retries and timeouts with max_retries, timeout and with_options', 'Write capped exponential backoff with jitter that honours retry-after, without stacking retry layers', 'Explain why long requests should stream'] },
  { id: '4.4-idempotency-limits-handoff', topic: '4.4', title: 'Idempotent Tools, Run Limits and Handing Off to a Human', minutes: 14, file: '4.4-idempotency-limits-handoff.md',
    objectives: ['Explain how tool calls get repeated and why state-changing tools must be idempotent', 'Make tools safe to repeat with idempotency keys, check-then-act, declarative actions and dry runs', 'Layer iteration, token, cost and time limits with SDK and platform limits', 'Decide when an agent must stop and hand off, and what the hand-off contains', 'Place approval gates in code before irreversible actions'] },
];
