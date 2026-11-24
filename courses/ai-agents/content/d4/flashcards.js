// Domain 4 — Reliability, Evaluation and Cost. Original flashcards; facts checked against vendor documentation on
// 2026-11-23 (URLs and anything not verified are listed in REVIEW-TODO.md). Defaults, multipliers and beta names change.
let n = 0;
const c = (topic, front, back) => ({ id: `d4-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 4.1 Evaluating an agent
  c('4.1', 'Task, trial, transcript, outcome (evals vocabulary)?', 'Task: one test with inputs and success criteria. Trial: one attempt. Transcript: the full record of a trial. Outcome: the final state of the environment, not what the agent said.'),
  c('4.1', 'How many tasks to start an agent eval with (Anthropic\'s evals article)?', '20 to 50 simple tasks drawn from real failures and manual checks; grow the set from every new failure.'),
  c('4.1', 'Four kinds of case in a balanced agent test set?', 'Representative, edge case, must decline (or refuse), must escalate.'),
  c('4.1', 'Fields of an agent test case beyond input and answer?', 'Environment (fixtures or sandbox), expected outcome (state), required evidence, forbidden calls, path budget, notes.'),
  c('4.1', 'Why not grade the exact order of tool calls?', 'It is brittle: agents find valid paths designers did not expect. Check essential evidence and forbidden calls instead.'),
  c('4.1', 'Code, model or human grader: which first?', 'Code wherever an answer, state or tool call can be checked; model graders for judgments code cannot express; humans to calibrate and for high-stakes or subjective cases.'),
  c('4.1', 'Six habits of a good model grader?', 'Clear rubric; closed verdict; reasoning before the verdict; an UNKNOWN way out; one dimension per judge; calibrated against human labels.'),
  c('4.1', 'pass@k vs pass^k?', 'pass@k: at least one of k trials succeeds (1 − (1 − p)^k). pass^k: all k succeed (p^k). Use pass^k when users need it to work every time.'),
  c('4.1', 'Capability suite vs regression suite?', 'Capability: hard tasks, low pass rate, room to climb. Regression: tasks already handled, should stay near 100%; any drop means something broke.'),
  c('4.1', 'When to rerun the regression suite?', 'After any change to the system prompt, a tool (name, description, schema, result format), the model id, effort or thinking setting, the SDK or the loop code.'),
  c('4.1', 'A case fails every trial on strong models. Suspect first?', 'The task or the grader: an ambiguous spec or a grader that rejects valid answers. Run the reference solution and read transcripts.'),
  // 4.2 Debugging runs
  c('4.2', 'Order for reading a failed transcript?', 'Last stop_reason → tool calls and results in order → first divergence → what the model was shown there → fix there → rerun evals.'),
  c('4.2', 'Loop vs stall vs premature stop?', 'Loop: same call, same arguments, repeated. Stall: many reads, no conclusion until the cap. Premature stop: end_turn or a question to the user before the task is done.'),
  c('4.2', '`max_tokens` with an incomplete `tool_use` as the last block?', 'A truncated tool call: never execute it; retry with a higher `max_tokens`.'),
  c('4.2', 'Input too large vs generation fills the window?', 'Input too large: HTTP 400 `invalid_request_error` "prompt is too long". Generation fills it: `stop_reason: "model_context_window_exceeded"` on a 200.'),
  c('4.2', 'Why fix failures in the tool before the prompt?', 'The model reads the tool description when choosing and the result right before its next decision; Anthropic\'s tool-writing guidance traces bad calls to descriptions and results.'),
  c('4.2', 'Where is the request id on a Claude response?', '`request-id` header on every response; `request_id` in error bodies; `_request_id` on Python and TypeScript SDK responses; `request_id` on `APIStatusError` (SDK source).'),
  c('4.2', 'Fields to log for every model call?', 'Run id, step, model and key settings, request id, stop_reason, the four usage counts, duration, and on failure status, error type and retries.'),
  c('4.2', 'Anthropic SDK OpenTelemetry content mode default?', '`metadata_only` (ids, timing, status, token counts). `content` adds prompts and responses. Tracing is in beta: pin the SDK version.'),
  // 4.3 Cost and latency
  c('4.3', 'Price one Claude request from `usage`?', 'IN × (input_tokens + 1.25 × cache_creation + read multiplier × cache_read) + OUT × output_tokens. 1-hour writes are 2×. (Pricing page, 2026-11-23.)'),
  c('4.3', 'How are thinking tokens billed?', 'As output tokens, counted toward `max_tokens`, even when the thinking text is omitted or summarized.'),
  c('4.3', 'Which input tokens count toward the input-tokens-per-minute limit?', '`input_tokens` and `cache_creation_input_tokens`; cache reads do not.'),
  c('4.3', 'Compare agent configurations on what?', 'Cost per completed task (cost per run ÷ pass rate), measured on your eval set, including the expensive tail.'),
  c('4.3', 'Effort parameter in the Messages API?', '`output_config.effort`: `low`, `medium`, `high`, `xhigh`, `max` (model-dependent). Affects text, tool calls and thinking; a behavioural signal, not a hard budget.'),
  c('4.3', 'Status of `thinking: {"type": "enabled", "budget_tokens": N}`?', 'Legacy and deprecated; Claude 4.7 and later reject it with a 400. Use adaptive thinking and `output_config.effort`.'),
  c('4.3', 'Message Batches API in one line?', 'Asynchronous, 50% off all tokens, most batches under an hour, unprocessed requests expire at 24 h; match results by `custom_id`.'),
  c('4.3', 'Not allowed inside a Claude batch request?', '`stream: true`, fast mode `speed`, server-side `fallbacks`, `max_tokens: 0`.'),
  c('4.3', 'Two reasons an agent streams?', 'Perceived latency (text from the first token) and long outputs (the SDK rejects non-streaming requests expected to exceed about 10 minutes).'),
  // 4.4 Handling failures
  c('4.4', 'Claude API errors to retry vs fix?', 'Retry: 429 (except the spend cap), 500 `api_error`, 504 `timeout_error`, 529 `overloaded_error`, connection errors. Fix: 400, 401, 402, 403, 404, 413.'),
  c('4.4', 'Spend-cap 429 vs ordinary rate-limit 429?', 'Spend cap: `error.details.error_code` `enforced_spend_limit_reached`, no `retry-after`, fails until access resumes. Rate limit: wait for `retry-after`.'),
  c('4.4', 'Anthropic SDK retry and timeout settings?', 'Retries twice by default with backoff, honouring `retry-after`; `max_retries` on the client or `with_options`. Timeout default 10 minutes; `timeout` likewise.'),
  c('4.4', 'Backoff recipe?', 'Obey `retry-after`; otherwise exponential delay with random jitter, capped delay and capped attempts; retry in one layer only.'),
  c('4.4', 'Four ways to make a tool safe to repeat?', 'Read-only by design; idempotency key on stable fields; check-then-act; declarative "ensure state" actions. Plus a dry-run default.'),
  c('4.4', 'Task budget vs `max_tokens`?', '`output_config.task_budget` (beta): advisory budget across the agent loop, minimum 20,000 tokens. `max_tokens`: hard cap on one request\'s output.'),
  c('4.4', 'What goes in a hand-off to a human?', 'Goal, what was checked with findings, what failed (errors, request ids), hypothesis and confidence, proposed next step, what was not done, transcript link.'),
];
