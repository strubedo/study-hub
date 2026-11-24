// Domain 1 — Agent Foundations. Original flashcards; facts checked against vendor documentation on 2026-11-23
// (URLs and anything not verified are listed in REVIEW-TODO.md). Product names and status labels change: re-check them.
let n = 0;
const c = (topic, front, back) => ({ id: `d1-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 1.1
  c('1.1', 'The agent loop in one line?', 'Send goal + tools; model asks for a tool call; your code (or the provider) runs it; send the result back; repeat until a final answer or a limit.'),
  c('1.1', 'Does the model run tools itself?', 'No. It emits a structured request. Your code runs client tools; the provider runs server tools such as web search.'),
  c('1.1', 'Workflow vs agent ("Building effective agents")?', 'Workflow: model and tools orchestrated through predefined code paths. Agent: the model dynamically directs its own process and tool use.'),
  c('1.1', 'When does Anthropic say agents fit?', 'Open-ended problems where the number of steps cannot be predicted and no fixed path can be hardcoded, in environments trusted enough for model decisions.'),
  c('1.1', 'ADK workflow agents?', '`SequentialAgent`, `ParallelAgent`, `LoopAgent`: deterministic controllers (a workflow). `LlmAgent` uses a model to reason. Deprecated as of 2026-11-23: graph-based and dynamic workflows supersede them in ADK Python, TypeScript, Go and Kotlin.'),
  c('1.1', 'First rule before building an agent?', 'Use the simplest solution that works: often a single call or a workflow. Add agentic complexity only when it demonstrably helps.'),
  c('1.1', 'Why does input grow every loop iteration?', 'Each request resends system prompt, tools and the whole history, including every earlier tool call and result.'),
  c('1.1', 'Compounding errors, the simple model?', 'End-to-end success ≈ per-step success ^ steps. 95% over 10 steps ≈ 60%; 99% over 10 ≈ 90%.'),
  c('1.1', 'Main counters to compounding errors?', 'Fewer steps, verification steps, instructive tool errors so the model can recover, iteration limits, read-only tools first.'),
  // 1.2
  c('1.2', 'Five key parts of a Messages API agent request?', '`model`, `max_tokens`, `system`, `tools`, `messages`. Only `messages` grows during a run.'),
  c('1.2', 'Where do tool calls and tool results live in Claude messages?', '`tool_use` blocks in `assistant` messages; `tool_result` blocks in `user` messages. No `tool` role.'),
  c('1.2', 'Core fields of a user-defined Claude tool?', 'Required: `name` (`^[a-zA-Z0-9_-]{1,128}$`) and `input_schema` (JSON Schema). `description` is optional in the API reference but essential in practice.'),
  c('1.2', 'Rules for the tool-result message?', 'Immediately after the call; one `tool_result` per `tool_use` (matched by `tool_use_id`); results before any text; `is_error: true` for failures.'),
  c('1.2', 'The seven Claude stop reasons?', '`end_turn`, `tool_use`, `max_tokens`, `stop_sequence`, `pause_turn`, `refusal`, `model_context_window_exceeded`.'),
  c('1.2', 'Loop action on `pause_turn`?', 'Server-tool loop hit its iteration limit. Resend the content unchanged as an assistant message, same tools, no new user message.'),
  c('1.2', '`max_tokens` with an incomplete `tool_use` block?', 'Do not run it. Retry with a higher `max_tokens`.'),
  c('1.2', 'Is `refusal` an HTTP error?', 'No. It is a stop reason in a 200 response, with `stop_details` (category, explanation). Discard any partial output; Anthropic\'s guide retries on a fallback model (except `reasoning_extraction`: change the prompt).'),
  c('1.2', 'Input too long vs generation too long?', 'Input over the window: 400 `invalid_request_error` ("prompt is too long"). Generation hits the window: `model_context_window_exceeded`.'),
  c('1.2', 'OpenAI Responses tool-call names?', 'Model emits `function_call` items (`call_id`, `name`, JSON-string `arguments`); you send `function_call_output` with `call_id` and `output`.'),
  c('1.2', 'Context window, per Anthropic?', 'The model\'s working memory: system prompt, tools, all messages and the output. Quality degrades as it grows (context rot).'),
  // 1.3
  c('1.3', 'Anthropic tool runner in one line?', 'Beta SDK helper (`client.beta.messages.tool_runner`, `@beta_tool`) that runs the loop in your process until no tool call or `max_iterations`.'),
  c('1.3', 'Claude Agent SDK vs Claude Managed Agents?', 'Agent SDK: Claude Code as a library in your process. Managed Agents: Anthropic-hosted harness with sessions in a cloud or self-hosted sandbox.'),
  c('1.3', 'OpenAI\'s three agent runtimes?', 'Agents API (OpenAI-managed Codex harness), Agents SDK (runs in your app: `Agent`, `Runner`), Responses API (build it yourself).'),
];
