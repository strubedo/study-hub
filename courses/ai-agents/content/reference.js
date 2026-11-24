// Cheat-sheet tables for the Reference page. Cells are inline markdown.
// Each domain writer appends a dNTables constant for its own topics and spreads it into the default export.

// Domain 1 — Agent Foundations. Checked against vendor documentation on 2026-11-23 (see REVIEW-TODO.md).
const d1Tables = [
  {
    id: 'claude-stop-reasons', title: 'Claude stop reasons and what the loop does next', topic: '1.2',
    columns: ['`stop_reason`', 'Meaning', 'Loop action'],
    rows: [
      ['`end_turn`', 'Model finished naturally', 'Use the answer; leave the loop'],
      ['`tool_use`', 'Model is calling one or more tools', 'Run each client tool; append the response as `assistant` and one `user` message with a `tool_result` per `tool_use`; send again with the same tools'],
      ['`max_tokens`', 'Hit your `max_tokens` limit', 'Output is incomplete: raise the limit or continue. Incomplete `tool_use` block: retry with a higher `max_tokens`, never run it'],
      ['`stop_sequence`', 'Model emitted one of your `stop_sequences`', 'Read `stop_sequence` to see which; usually a deliberate end'],
      ['`pause_turn`', 'Server-tool loop (for example web search) hit its iteration limit; default 10 per request', 'Resend the content unchanged as `assistant`, same tools, no new user message. Never occurs for your own tools'],
      ['`refusal`', 'Model declined (HTTP 200, not an error)', 'Read `stop_details` (category, explanation); discard partial output; retry on a fallback model by policy (for `reasoning_extraction`, change the prompt); never resend unchanged to the same model'],
      ['`model_context_window_exceeded`', 'Generation reached the context window limit', 'Treat as truncated. (Input alone too large: HTTP 400 "prompt is too long" instead)'],
      ['HTTP 4xx / 5xx', 'Request failed: no message returned', 'Error handling, not stop-reason handling: fix the request, or retry with backoff for transient errors (Domain 4)'],
    ],
  },
  {
    id: 'single-workflow-agent', title: 'Single call, workflow or agent?', topic: '1.1',
    columns: ['', 'Single model call', 'Workflow', 'Agent'],
    rows: [
      ['Who picks the next step', 'Nobody: one step', 'Your code (predefined paths)', 'The model, using tool results'],
      ['Use when', 'All information is already in hand', 'Steps and branches are known in advance', 'The path depends on what is found; step count unpredictable'],
      ['Model calls per task', '1', 'Fixed', 'Varies; cap it'],
      ['Cost and latency', 'Lowest, predictable', 'Predictable', 'Highest and variable: input grows every iteration; steps are sequential'],
      ['Testing', 'Easy', 'Per branch', 'Needs a task set and repeated runs (Domain 4)'],
      ['Main risk', 'Missing evidence', 'Cases outside the branches', 'Compounding errors (≈ per-step success ^ steps), loops, unsafe actions'],
      ['Before you build any', 'Is a model needed at all? Can you check success?', 'Same', 'Plus: read-only tools first, approval for changes, iteration and budget limits'],
    ],
  },
  {
    id: 'ways-to-build-ownership', title: 'Ways to build an agent and what you own', topic: '1.3',
    columns: ['', 'Model API + own loop', 'SDK tool runner', 'Agent SDK / framework', 'Hosted (managed) agent'],
    rows: [
      ['Examples (2026-11-23)', 'Claude Messages API; OpenAI Responses API; Gemini Interactions API', 'Anthropic client SDK tool runner (beta): `client.beta.messages.tool_runner`, `@beta_tool`', 'Claude Agent SDK (`claude-agent-sdk`); OpenAI Agents SDK (`openai-agents`); Google ADK (`google-adk`)', 'Claude Managed Agents (beta); OpenAI Agents API; Gemini managed agents (Public Preview)'],
      ['Loop', 'You', 'SDK, in your process (`max_iterations`)', 'Library, in your process (for example `max_turns`, `max_budget_usd`)', 'Provider'],
      ['Tools', 'You define and run all', 'Your functions; runner calls them', 'Built-in tools plus yours and MCP', 'Provider-run built-ins and MCP; custom tools run in your app'],
      ['State', 'Your message list', 'Runner during the run; you persist', 'Library sessions where you configure', 'Provider-side sessions and history'],
      ['Sandbox', 'You build any isolation', 'Same as own loop', 'Your host or container', 'Provider cloud sandbox or self-hosted sandbox'],
      ['Permissions', 'You write every check', 'Inside your tool code; manual loop for approvals', 'Permission modes and callbacks', 'Provider policies (Claude: `always_allow`, `always_ask`, `auto`); check defaults'],
      ['Give up', 'Nothing; you write it all', 'Approval and logging control points', 'Some visibility; tied to the library', 'Visibility, data location (Claude Managed Agents not ZDR-eligible except the fully self-hosted service), portability'],
    ],
  },
  {
    id: 'vendor-terms-d1', title: 'Agent request terms by vendor', topic: '1.2',
    columns: ['Idea', 'Claude Messages API', 'OpenAI Responses API', 'Gemini Interactions API'],
    rows: [
      ['System prompt', '`system`', '`instructions` (or a `developer` / `system` message)', '`system_instruction`'],
      ['Tool definition', '`name`, `input_schema` (required), `description` (optional in the API, essential in practice)','`type: "function"`, `name`, `description`, `parameters`, `strict`', '`type: "function"`, `name`, `description`, `parameters`'],
      ['Model asks for a tool', '`tool_use` block (`id`, `name`, `input`); `stop_reason: "tool_use"`', '`function_call` item in `output` (`call_id`, `name`, JSON-string `arguments`)', '`function_call` step (`id`, `name`, `arguments`)'],
      ['You return the result', '`tool_result` in a `user` message (`tool_use_id`, `content`, `is_error`)', '`function_call_output` item (`call_id`, `output`)', '`function_result` input (`call_id`, `name`, `result`)'],
      ['Finished / cut short', '`end_turn` / `max_tokens`, `model_context_window_exceeded`', '`status: "completed"` / `status: "incomplete"` + `incomplete_details.reason`', '`status: "completed"` / `status: "incomplete"`'],
      ['History', 'Send full `messages` each request (stateless)', 'Send items, or `previous_response_id`, or Conversations API', '`previous_interaction_id`, or full step history with `store=false`'],
    ],
  },
];

// Domain 2 — Tools and the Model Context Protocol. Checked against vendor documentation on 2026-11-23 (see REVIEW-TODO.md).
// 2.1 to 2.3
const d2Tables = [
  {
    id: 'tool-definition-checklist', title: 'Tool definition checklist (Claude)', topic: '2.1',
    columns: ['Part', 'Rule', 'Example Corp example'],
    rows: [
      ['`name`', 'Matches `^[a-zA-Z0-9_-]{1,128}$`; verb plus object; prefix with the service when tools come from several systems', '`get_interface_status`, `itsm_search_tickets`'],
      ['`description`', 'Optional in the API, essential in practice (only `name` and `input_schema` are required). What it does, when to use it, when not to, what it returns, parameter meanings; at least 3 to 4 sentences; say "read-only" if it is', '"Read-only. Returns the live state of ONE interface... Use it when a user reports a slow port... It does not return configuration."'],
      ['`input_schema`', '`type: "object"`, a `description` on every property, `required`, `enum` for closed sets, nested objects where values belong together, `additionalProperties: false`', '`status` enum `open`/`closed`/`any`; `runbook_id` enum instead of a file path'],
      ['`strict: true`', 'Guarantees schema-valid input and a valid name; supported JSON Schema subset only (no `minimum`/`maximum`, no length limits, no `oneOf`); per-request limits on strict tools and optional parameters', 'Range "1 to 20" in the description; the tool clamps `limit`'],
      ['`input_examples`', 'Optional; each must validate against the schema (invalid ones usually give a 400); costs input tokens', 'One flat and one nested example for a complex search'],
      ['Result', 'Only needed fields, reusable identifiers, units in names, bounded size with a note on how to get more', '`{"ticket_id": "INC-4471", ...}`, "Showing 5 of 37"'],
      ['Error', '`is_error: true` plus what went wrong and what to try next; no stack traces or secrets', '"No device sw-acces-12.example.com; closest match sw-access-12.example.com"'],
      ['Risk', 'Keep read-only and state-changing tools separate; gate changes with dry run and human approval (Domain 5)', '`bounce_interface` never in the diagnostics agent'],
    ],
  },
  {
    id: 'tool-use-messages-choice', title: 'Tool-use message shapes and tool_choice (Claude Messages API)', topic: '2.2',
    columns: ['Item', 'Shape or value', 'Rule'],
    rows: [
      ['Model calls a client tool', '`tool_use` block in `assistant` content: `id`, `name`, `input`; `stop_reason: "tool_use"`', 'Append the content unchanged as an `assistant` message'],
      ['You return the result', '`tool_result` block in the next `user` message: `tool_use_id`, optional `content`, optional `is_error`', 'Immediately after the calls; results before any text; one per call; same `tools` array'],
      ['Parallel calls', 'Several `tool_use` blocks in one response', 'Run in any order (read-only: concurrently); all results in ONE user message (one message per result teaches Claude to stop calling in parallel); skipped calls get `is_error`'],
      ['No parallel calls', '`tool_choice: {"type": "auto", "disable_parallel_tool_use": true}`', 'Inside `tool_choice`, not top level. `auto`: at most one call; `any`/`tool`: exactly one'],
      ['`tool_choice` `auto`', 'Default when tools are given', 'Model decides; can write text and think first'],
      ['`tool_choice` `any` / `tool`', 'Must call a tool / the named tool', 'Response starts with the call: no preamble, no thinking. Unsupported with manual extended thinking and on some newer models'],
      ['`tool_choice` `none`', 'No tool calls (default without tools)', 'Useful for a final summary turn'],
      ['Ending the loop', '`end_turn` answer; iteration cap; `max_tokens` (incomplete `tool_use`: retry with more tokens, never run); `refusal` (read `stop_details`; retry on a fallback model, or change the prompt for `reasoning_extraction`); `pause_turn` (resend content as `assistant`)', 'Make every ending distinguishable to the caller'],
      ['SDK tool runner (beta)', '`client.beta.messages.tool_runner(...)`, `@beta_tool`, `max_iterations`, `until_done()`', 'Runs tools and appends messages; use a manual loop for approvals and custom logging'],
    ],
  },
  {
    id: 'client-vs-server-tools', title: 'Client tools vs server tools', topic: '2.3',
    columns: ['', 'User-defined client tool', 'Anthropic-schema client tool', 'Server tool'],
    rows: [
      ['Examples (2026-11-23)', 'Your `get_interface_status`', '`bash`, text editor (`str_replace_based_edit_tool`), `memory`, computer use and browser use toolsets', '`web_search`, `web_fetch`, `code_execution`, tool search'],
      ['Schema written by', 'You', 'Anthropic (dated `type`, trained-in)', 'Anthropic (dated `type`)'],
      ['Runs in', 'Your code', 'Your environment (shell, files, desktop, browser)', "Anthropic's infrastructure"],
      ['In the response', '`tool_use`; you send `tool_result`', '`tool_use` (toolsets add `toolset_name`); you send `tool_result`', '`server_tool_use` + result block; no `tool_result` from you; `pause_turn` possible'],
      ['Can reach', 'What your function does', 'Whatever the host can: often too much', 'Public web (fetch blocks private addresses); code sandbox has no network'],
      ['Main risks', 'Badly scoped function', 'Model-chosen commands and clicks with your privileges', 'Untrusted web content; queries and URLs leave your environment'],
      ['Controls', 'Narrow, read-only; validate input', 'Isolation, least privilege, allowlists, logging, redaction, confirmation', '`allowed_domains` or `blocked_domains`, `max_uses`, `url_sources`, Console settings'],
      ['Cost', 'Tokens', 'Tokens', 'Tokens plus per-use charges for some tools: see the pricing page'],
      ['OpenAI / Gemini equivalent', 'Function calling / function calling', 'Computer use, local shell / computer use (client-side)', 'Web search (can also open pages), code interpreter, file search / Google Search, URL context, code execution'],
    ],
  },
  // 2.4 and 2.5 (part 2). MCP rows follow specification revision 2026-07-28 unless marked legacy; checked 2026-11-23.
  {
    id: 'mcp-protocol-cheatsheet', title: 'MCP at a glance: roles, primitives, lifecycle and transports', topic: '2.4',
    columns: ['Item', 'What the specification says', 'Methods, fields or names'],
    rows: [
      ['Host / client / server', 'Host: the LLM application; creates clients, enforces consent. Client: talks to exactly one server. Server: offers primitives, local or remote', 'One client per server connection'],
      ['Messages', 'JSON-RPC 2.0 requests (id never null), responses (`result` or `error`), notifications (no id)', '`resultType`: `complete` or `input_required` (2026-07-28)'],
      ['Lifecycle (legacy, 2025-11-25 and earlier)', '`initialize` request, response, then `notifications/initialized`; operation; shutdown by closing the transport', '`protocolVersion`, `capabilities`, `clientInfo` / `serverInfo`'],
      ['Lifecycle (2026-07-28)', 'No handshake; stateless; every request carries version and capabilities; servers must implement discovery', '`_meta`: `io.modelcontextprotocol/protocolVersion`, `.../clientCapabilities`; `server/discover`'],
      ['Eras in today\'s tools (checked 2026-11-23)', 'Dual-era: Python SDK v2 (`MCPServer` serves both; `Client` probes `server/discover`, then falls back) and Claude Code\'s v2 runtime. MCP Inspector: Protocol Era defaults to `legacy`', 'Inspector setting `legacy`, `auto` or `modern`; on stdio a dual-era client probes with `server/discover` first'],
      ['Tools (model-controlled)', 'Functions the model invokes; annotations are untrusted hints', '`tools/list`, `tools/call`; `inputSchema`, `outputSchema`, `annotations`; result `content`, `structuredContent`, `isError`'],
      ['Resources (application-controlled)', 'Data the host chooses to load, addressed by URI', '`resources/list`, `resources/templates/list`, `resources/read`'],
      ['Prompts (user-controlled)', 'Templates the user selects, such as slash commands', '`prompts/list`, `prompts/get`'],
      ['Client features', 'Elicitation current (form or URL mode); sampling and roots deprecated in 2026-07-28', 'Server returns `InputRequiredResult`; client retries with `inputResponses`'],
      ['stdio transport', 'Client launches the server as a subprocess; newline-delimited messages; nothing but MCP on stdout; logs on stderr; credentials from the environment', 'Shutdown: close stdin, wait, terminate'],
      ['Streamable HTTP transport', 'One endpoint; every client message a POST; JSON or per-request SSE response; validate `Origin`; bind local servers to 127.0.0.1; no sessions in 2026-07-28', '`MCP-Protocol-Version`, `Mcp-Method`, `Mcp-Name` headers. HTTP+SSE: deprecated'],
      ['Authorization (HTTP only, optional)', 'Server = OAuth resource server; client = OAuth client; PKCE and the `resource` parameter; audience check; no token passthrough', 'Protected Resource Metadata, `WWW-Authenticate`, `Authorization: Bearer <access-token>`'],
      ['Claude MCP connector (beta)', 'Messages API calls remote servers itself (you never send a `tool_result` for them); tools only; public HTTPS only (private networks: MCP tunnels, research preview)', '`mcp_servers`, `mcp_toolset`, `default_config`, `configs`; blocks `mcp_tool_use`, `mcp_tool_result`'],
    ],
  },
  {
    id: 'structured-output-vs-tool-use', title: 'Structured output vs tool use, with vendor names', topic: '2.5',
    columns: ['', 'Structured output (JSON outputs)', 'Tool use (strict)', 'Tool used only as an output schema'],
    rows: [
      ['Use it when', 'You want data back for your code', 'You want an action or outside information', 'Legacy pattern; prefer structured output where available'],
      ['Claude switch', '`output_config.format` with `type: "json_schema"`; SDK `messages.parse(output_format=...)`', '`strict: true` on the tool', 'Forced `tool_choice` (rejected by some newer models)'],
      ['Where the JSON appears', 'Text block of the response', '`tool_use` block `input`; your code runs the tool', '`tool_use` input that is never executed'],
      ['Schema limits', 'Shared subset: no min/max, no length limits, no `oneOf`/`not`, `additionalProperties: false`; complexity limits per request', 'Same subset and limits', 'Same, if strict'],
      ['Still check', '`stop_reason` (`refusal`, `max_tokens`), enum case, business rules', 'Input values, permissions, confirmation for changes', 'Same as structured output, plus history clean-up'],
      ['OpenAI', '`text.format` (`json_schema`) in Responses; `response_format` in Chat Completions', '`strict: true` on function tools', ''],
      ['Gemini', '`response_format` with `type: "text"`, `mime_type: "application/json"`, `schema` (Interactions) or `response_mime_type` + `response_json_schema`', '`validated` function-calling mode', ''],
    ],
  },
];

// Domain 3 — Context, Memory and Orchestration. Checked against vendor documentation on 2026-11-23 (see REVIEW-TODO.md).
// Beta features and multipliers change: re-check before relying on them.
const d3Tables = [
  {
    id: 'context-window-contents', title: 'What fills an agent\'s context window', topic: '3.1',
    columns: ['Source', 'When it is sent', 'Grows?', 'How to keep it small'],
    rows: [
      ['System prompt (plus API-added tool-use and feature instructions)', 'Every request', 'No', 'Minimal policy at the right altitude; per-run data in the user message; cache it'],
      ['Tool definitions', 'Every request', 'Only if you add tools', 'Fewer, task-shaped tools; tool search (`defer_loading`) for many tools; cache them'],
      ['User and assistant turns', 'Every request after they occur', 'Every turn', 'Compaction or your own structured summary'],
      ['Tool calls and results', 'Every request after they occur', 'Every iteration, often by thousands of tokens', 'Filter, paginate, summarize, return references; tool result clearing; subagents for bulky lookups'],
      ['Thinking', 'Output when generated; earlier thinking kept as input on current models by default', 'Every turn (when kept)', 'Thinking block clearing (`clear_thinking_20251015`); effort settings'],
      ['Cached tokens', 'As part of the above', 'Same as above', 'Caching lowers price and latency, not occupancy'],
      ['Reading it', '`usage`: `input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`; `output_tokens`', '', '`count_tokens` before sending; log `usage` every iteration'],
    ],
  },
  {
    id: 'context-reduction-options', title: 'Compaction, context editing and doing it yourself (Claude API, 2026-11-23)', topic: '3.1',
    columns: ['', 'Compaction on demand', 'Threshold compaction', 'Tool result clearing', 'Your own summarizer'],
    rows: [
      ['Status / switch', 'Beta; top-level `compaction: {"type": "summarize"}`', 'Beta; `compact_20260112` edit in `context_management`', 'Beta; `clear_tool_uses_20250919` edit in `context_management`', 'Your code'],
      ['Who decides when', 'You, with a separate request', 'The API, at the input-token trigger', 'The API, at the trigger', 'You'],
      ['What remains', 'A `compaction` block (summary) replacing the summarized messages; send it first', 'A `compaction` block; the API drops content before it', 'Everything except old tool results (placeholders); `keep` recent ones', 'Your structured summary plus the turns you keep'],
      ['What is lost', 'Detail, attachments, fetched URLs, mid-run system messages in the range', 'Same', 'Old results (copy what matters to memory first)', 'Whatever your summary omits'],
      ['Caching', '`cache_control` on the block caches the summary', 'Breakpoint at end of system keeps it cached', 'Invalidates from the cleared point; set `clear_at_least`', 'Keep the system prompt unchanged'],
    ],
  },
  {
    id: 'cache-breakers', title: 'What invalidates the Claude prompt cache', topic: '3.1',
    columns: ['Change', 'Tools cache', 'System cache', 'Messages cache'],
    rows: [
      ['Tool definitions edited, added, removed, reordered, or schema keys serialized in a different order', 'Invalidated', 'Invalidated', 'Invalidated'],
      ['Different model', 'Invalidated', 'Invalidated', 'Invalidated'],
      ['Web search or citations toggled; speed setting switched', 'Kept', 'Invalidated', 'Invalidated'],
      ['Timestamp or request id inside the system prompt', 'Kept', 'Invalidated every request', 'Invalidated every request'],
      ['`tool_choice` or `disable_parallel_tool_use` changed; images added or removed', 'Kept', 'Kept', 'Invalidated'],
      ['Thinking parameters or effort changed', 'Model-specific', 'Model-specific', 'Invalidated'],
      ['Earlier messages edited, truncated or re-serialized; old tool results cleared', 'Kept', 'Kept', 'Invalidated from that point'],
      ['No change, but past the lifetime (5 min default, or 1 h)', 'Expired', 'Expired', 'Expired'],
      ['Breakpoint on a block that changes every request', 'Writes every time, never reads', '', ''],
      ['Prefix below the model\'s minimum cacheable length', 'Never cached; no error; both cache fields 0', '', ''],
    ],
  },
  {
    id: 'memory-options', title: 'Conversation state and memory options compared', topic: '3.2',
    columns: ['Option', 'Survives the session?', 'Where data lives', 'Watch out for'],
    rows: [
      ['Message list you resend (Messages API)', 'No (unless you save it)', 'Your process', 'Grows every turn; compaction loses detail'],
      ['Progress or notes file the agent reads first and updates last', 'Yes', 'Your filesystem or repository', 'Label hypotheses; record sources and times'],
      ['Memory tool (`memory_20250818`, name `memory`)', 'Yes', 'Storage your handler maps from `/memories`', 'Path traversal; sizes; expiry; scrub sensitive data'],
      ['Agent SDK session (`resume`, `continue_conversation`, `fork_session`)', 'Yes, on the same machine (or a session store)', 'Transcript files on the host', 'Restores the conversation, not files; local unless mirrored'],
      ['Managed Agents memory store (beta)', 'Yes, versioned', 'Anthropic workspace, mounted into the sandbox', '`read_write` by default: use `read_only` for reference data'],
      ['OpenAI Agents SDK sessions; Google ADK `MemoryService`', 'Yes (with a persistent backend)', 'Storage you configure', 'In-memory implementations are for testing'],
      ['Never store', '', '', 'Secrets, unneeded personal data, unverified claims as facts, instructions from untrusted content'],
    ],
  },
  {
    id: 'retrieval-approaches', title: 'Retrieval approaches: when to use each', topic: '3.3',
    columns: ['Approach', 'Use it when', 'Network operations example', 'Main cost or risk'],
    rows: [
      ['Whole corpus in the prompt (cached)', 'Small, stable, used constantly', '40-page escalation guide', 'Context size; stale if not refreshed'],
      ['RAG with embeddings (hybrid + rerank)', 'Large prose corpus asked about in paraphrase', 'Runbook library', 'Indexing pipeline, staleness, misses exact IDs without keyword search'],
      ['Agentic search with tools', 'Exact, fresh or permissioned data', 'Config backups, ticket search with filters', 'More round trips and tokens per question'],
    ],
  },
  {
    id: 'orchestration-patterns', title: 'Orchestration patterns ("Building effective agents"): when to use each', topic: '3.4',
    columns: ['Pattern', 'Use it when', 'Network operations example', 'Main cost or risk'],
    rows: [
      ['Prompt chaining', 'Task splits into fixed steps; gates check progress', 'Change plan, gate, rollback plan, CAB summary', 'Latency of sequential calls'],
      ['Routing', 'Distinct input categories, reliable classification', 'Alert intake to BGP, wireless or service-desk paths', 'Misrouting'],
      ['Parallelization (sectioning / voting)', 'Independent subtasks, or several attempts for confidence', 'Three parallel pre-change checks; 2-of-3 vote on a rule set', 'More calls; code must combine results'],
      ['Orchestrator-workers (subagents)', 'Subtasks cannot be predicted in advance', 'Pre-replacement audit of unknown dependent devices', 'Multi-agent systems typically use 3–10× the tokens; hand-off context loss'],
      ['Evaluator-optimizer', 'Clear criteria; feedback measurably improves output', 'Outage notice checked against a rubric', 'Needs a round limit in code'],
    ],
  },
];

// Domain 4 — Reliability, Evaluation and Cost. Checked against vendor documentation on 2026-11-23 (see REVIEW-TODO.md).
// Multipliers, defaults and beta features change: re-check before relying on them.
const d4Tables = [
  {
    id: 'grading-methods', title: 'Grading agent runs: code, model and human graders', topic: '4.1',
    columns: ['', 'Code-based', 'Model-based (LLM judge)', 'Human'],
    rows: [
      ['Checks', 'Exact or normalized match, regex, JSON Schema, tool calls and arguments, forbidden calls, sandbox state, turns, tokens, time', 'Rubric scoring, natural-language assertions, groundedness against tool results, pairwise comparison', 'Expert review, spot checks, A/B tests, agreement between annotators'],
      ['Strengths', 'Fast, cheap, objective, reproducible, easy to debug', 'Flexible, scalable, handles open-ended text', 'Highest quality; the reference for calibration'],
      ['Weaknesses', 'Brittle to valid rewordings; no nuance', 'Non-deterministic, costs tokens, must be calibrated', 'Slow, expensive, hard to run often'],
      ['Design rules', 'Check outcome (state) and essential evidence, not an exact call order', 'Clear rubric, closed verdict, reasoning first, UNKNOWN way out, one dimension per judge; parse strictly', 'Label a sample; measure the model grader\'s agreement; read failing transcripts'],
      ['Diagnostics-agent example', '"Exactly one P1 escalation exists"; "never called escalate_to_oncall on a routine case"', '"Every counter in the answer appears in the tool results"', 'Calibrating the groundedness judge on 50 labelled trials'],
      ['Summaries over trials', 'pass@k = 1 − (1 − p)^k (at least one succeeds)', 'pass^k = p^k (all succeed)', 'Read per case; averages hide regressions'],
    ],
  },
  {
    id: 'failure-shapes', title: 'Agent failure shapes: what you see, likely cause, fix first', topic: '4.2',
    columns: ['Shape', 'In the transcript', 'Likely cause', 'Fix first'],
    rows: [
      ['Loop', 'Same tool, same arguments, three or more times', 'Uninformative result; error not marked `is_error`', 'Actionable `is_error` result; repeated-call detector; iteration cap'],
      ['Stall', 'Many reads, no conclusion until the cap', 'No achievable stopping rule; open-ended task', 'Stopping criteria in the system prompt; tools that return what decides the question'],
      ['Premature stop', '`end_turn` after too little evidence, or asking permission to read', 'Prompt silent on what needs no permission; low effort', 'Say reads need no permission and what a finished answer contains; raise effort on hard cases'],
      ['Wrong tool or arguments', 'Plausible wrong tool; short names; invented parameters', 'Overlapping descriptions; ambiguous schema', 'Descriptions say when to use each tool; `enum`, `strict: true`, `input_examples`'],
      ['Ignored error', '`is_error` result, then the run proceeds as if it worked', 'Error text says nothing actionable', 'Say what failed and what to try next'],
      ['Hallucinated result', 'Counter, ticket id or action in the answer that no result contains', 'Missing data treated as known', 'Groundedness grader; explicit ids in results; no wording that implies the agent acted'],
      ['Truncation', '`stop_reason: "max_tokens"`; thinking used most of the output', '`max_tokens` too small for thinking plus text', 'Raise `max_tokens` (stream it) or lower effort'],
      ['Truncated tool call', '`max_tokens` with an incomplete `tool_use` last', 'Large tool input hit the cap', 'Never execute it; retry with a higher `max_tokens`'],
      ['Context overflow', 'HTTP 400 "prompt is too long", or `model_context_window_exceeded`', 'Large tool results in the history', 'Filter, paginate, clear or compact (Domain 3)'],
    ],
  },
  {
    id: 'what-to-log', title: 'What to log for every model call and tool call', topic: '4.2',
    columns: ['Event', 'Fields', 'Where the value comes from (Claude, Python SDK)'],
    rows: [
      ['Model call (success)', 'Run id, step, time, duration, model, effort and thinking settings, request id, `stop_reason`, `input_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`, `output_tokens`', '`response._request_id` (from the `request-id` header), `response.stop_reason`, `response.usage`'],
      ['Model call (failure)', 'Run id, step, status, error type, request id, retries made, duration', '`anthropic.APIStatusError`: `status_code`, `request_id` (SDK source); error body `error.type`, `request_id`; `APIConnectionError` has no request id'],
      ['Tool call', 'Tool name, `tool_use_id`, redacted arguments, result size, `is_error`, duration', 'The `tool_use` block (`name`, `id`, `input`) and your tool wrapper'],
      ['Tracing (beta)', 'Spans per request and per tool; metadata only by default', 'Anthropic SDK with a registered OpenTelemetry tracer provider (`anthropic.messages.create` spans); Agent SDK via `CLAUDE_CODE_ENABLE_TELEMETRY=1`; OpenAI Agents SDK traces by default'],
      ['Never log', 'API keys, tokens, community strings, passwords, unneeded personal data, full raw results by default', 'Allow-list fields; redact what you keep; keep secrets out of tool results'],
    ],
  },
  {
    id: 'cost-latency-levers', title: 'Cost and latency levers for agents (Claude, 2026-11-23)', topic: '4.3',
    columns: ['Lever', 'How', 'Documented effect', 'Trade-off'],
    rows: [
      ['Prompt caching', 'Top-level or block `cache_control` (Domain 3)', 'Writes 1.25× (5 min) or 2× (1 h); reads 0.1× on most models; reads do not count toward input-token rate limits', 'Breaks on prefix changes, model switches, effort changes'],
      ['Model tier per job', 'Small tier for routing, extraction, summaries; large for planning and final answers', 'Choosing-a-model guidance; compare on cost per completed task', 'Cache is per model: switch at the edges of a run'],
      ['Effort', '`output_config.effort`: `low` to `max`', 'Shapes text, tool calls and thinking; defaults differ by model', 'Lower effort can skip checks; sweep on evals'],
      ['Thinking', 'Adaptive thinking (default on current models); `budget_tokens` deprecated', 'Thinking billed as output; counts toward `max_tokens`', '`display: "omitted"` cuts latency, not cost'],
      ['Batch API', '`client.messages.batches.create(requests=[...])`', '50% off all tokens; stacks with caching; up to 24 h', 'Only for work nobody waits on; one request per batch item'],
      ['Streaming', '`client.messages.stream(...)`, `get_final_message()`', 'Text from the first token; required for very long requests', 'Same cost; handle mid-stream `error` events'],
      ['Shorter answers, trimmed results', 'Ask for what you will read; filter, paginate, defer unused tools', 'Output costs 5× input on current models and is re-sent every later turn', 'Measure: some context levers cost more on short runs'],
      ['Fast mode', '`speed: "fast"` on supported models', 'Up to 2.5× output tokens per second at premium (2×) prices', 'Not in batches; speed switch misses the cache'],
    ],
  },
  {
    id: 'claude-api-errors', title: 'Claude API errors: retry or fix?', topic: '4.4',
    columns: ['Status', '`error.type`', 'Meaning', 'Action'],
    rows: [
      ['400', '`invalid_request_error`', 'Bad request; also a spend limit you set', 'Fix the request (or raise the limit); never retry unchanged'],
      ['401 / 402 / 403', '`authentication_error` / `billing_error` / `permission_error`', 'Key, billing or permission problem', 'Fix configuration; do not retry'],
      ['404 / 413', '`not_found_error` / `request_too_large`', 'Missing resource; request over the size limit', 'Fix or shrink; do not retry'],
      ['409', '`conflict_error`', 'Conflicts with a resource\'s current state', 'Resolve the conflict, then retry (SDKs retry it)'],
      ['429', '`rate_limit_error`', 'Rate limit, ramp limit (`ramp_limit_exceeded`), tier spend cap (`enforced_spend_limit_reached`)', 'Wait `retry-after`; for the spend cap (no `retry-after`) stop and alert'],
      ['500', '`api_error`', 'Unexpected internal error', 'Retry with exponential backoff'],
      ['504 (or other)', '`timeout_error`', 'Timed out while processing', 'Retry; stream long requests'],
      ['529', '`overloaded_error`', 'Temporarily overloaded across users', 'Retry with backoff and jitter'],
      ['SDK defaults', 'Retries 2 times (connection errors, 408, 409, 429, 5xx), honours `retry-after`; timeout 10 minutes', 'Configure `max_retries` and `timeout` on the client or `with_options`', 'Retry in one layer only'],
    ],
  },
];

// Domain 5 — Safety and Deployment. Checked against vendor and OWASP documentation on 2026-11-23 (see REVIEW-TODO.md).
// Permission and policy names change: re-check them before configuring anything.
const d5Tables = [
  {
    id: 'injection-defence-layers', title: 'Prompt injection: untrusted sources and defences in layers', topic: '5.1',
    columns: ['Layer', 'What to do', 'Kind of control', 'Network operations example'],
    rows: [
      ['Know the untrusted sources', 'Tickets, email, web, files, RAG documents, tool and MCP results, MCP tool descriptions, memory, other agents\' output', 'Threat model', 'Interface descriptions and LLDP names are written by others'],
      ['Separate and label', 'Untrusted text only in `tool_result`, labelled with source and author, JSON-encoded; policy in the system prompt', 'Reduces likelihood', 'get_ticket returns `{"source": "ticket", "author": "external reporter", "text": ...}`'],
      ['Least-privilege tools', 'Minimal tools, minimal functions, minimal credential rights; authorization in code (OWASP LLM03:2026)', 'Bounds damage', 'Ticket search token cannot close tickets'],
      ['Break the dangerous combination', 'No unattended run with untrusted input + sensitive data + a way to act or send out; split, narrow or approve', 'Bounds damage', 'Triage agent has no email tool'],
      ['Allowlists', 'Allow destinations and commands; do not rely on blocklists; allowlists are per host, not per operation', 'Bounds damage', '`allowed_domains` for vendor sites; enum of show checks'],
      ['Human confirmation', 'A person approves irreversible or outward-facing actions, seeing the exact action', 'Bounds damage', 'close_ticket and create_change_request ask every time'],
      ['Check output before acting', 'Schema and policy validation in deterministic code', 'Bounds damage', 'validate_change rejects edits to AAA or uplinks'],
      ['Screen, monitor, red-team', 'Small-model screen on tool output; log and alert; test with benign planted instructions', 'Reduces likelihood; detects', 'Alert on a burst of closures'],
      ['Distrust summaries', 'A summary of untrusted content is untrusted; pass fixed fields across boundaries', 'Bounds damage', 'Pass a ticket number, not the researcher\'s prose'],
    ],
  },
  {
    id: 'secrets-where', title: 'Where secrets may and may not live', topic: '5.2',
    columns: ['Place', 'Secrets allowed?', 'Notes'],
    rows: [
      ['Environment of the process that runs your tools', 'Yes, if the agent cannot run commands or code there', 'Per tool or per MCP server, not exported globally; an agent with a shell in that environment can read them, so use an injecting proxy instead'],
      ['Secrets manager or OS secret store', 'Yes (preferred)', 'Rotate centrally; short-lived where possible'],
      ['Platform vault (Claude Managed Agents vaults, beta; Gemini managed agents credentials)', 'Yes', 'Write-only values; Claude `environment_variable` credentials are placeholders substituted at egress for `allowed_hosts` and `injection_location`'],
      ['Proxy outside the agent boundary that injects credentials', 'Yes (strongest)', 'The agent never sees the credential; the proxy can allowlist and log'],
      ['System prompt, messages, tool descriptions', 'Never', 'Sent to the provider every request; can be repeated by the model'],
      ['Tool results', 'Never', 'Redact device configs inside the tool; return sections or references'],
      ['Logs and traces', 'Never', 'Mask arguments; test with a canary value'],
      ['Memory, transcripts, sessions', 'Never', 'Read back into later sessions; retained by the platform'],
      ['Repository and config files (`.mcp.json`, settings)', 'Never', 'Use variable references such as `${NETBOX_TOKEN}`'],
      ['A Claude API key inside the agent\'s sandbox', 'Never, even in a vault', 'Code could call the API outside the agent\'s approvals and budget'],
    ],
  },
  {
    id: 'permission-controls-compared', title: 'Permission and approval controls compared (2026-11-23)', topic: '5.3',
    columns: ['Product', 'Settings', 'Asks a person', 'Removes human approval', 'Watch out'],
    rows: [
      ['Claude Agent SDK', 'Modes `default`, `dontAsk`, `acceptEdits`, `bypassPermissions`, `plan`, `auto`; `allowed_tools`, `disallowed_tools`; `PreToolUse` hooks; `can_use_tool`', '`default` with `can_use_tool`; `plan` for edits; ask rules', '`bypassPermissions`, `acceptEdits` (edits), `auto` (classifier), anything in `allowed_tools`; `dontAsk` removes the human but denies', '`allowed_tools` does not restrict and does not constrain `bypassPermissions`; allowed calls skip `can_use_tool`; order: hooks, deny, ask, mode, allow, callback'],
      ['Claude Managed Agents (beta)', 'Policies `always_allow`, `always_ask`, `auto` per toolset or tool; `user.tool_confirmation`', '`always_ask`; `auto` when undetermined', '`always_allow` (agent toolset default), `auto` when judged safe', 'MCP toolsets default to `always_ask`; custom tools are outside policies; relayed end-user text counts as intent under `auto`'],
      ['OpenAI Agents SDK / Agents API', '`function_tool(needs_approval=True)`, interruptions and resumable state; input, output and tool guardrails; session `review`', '`needs_approval` tools', '`review: "none"` (default; actions execute directly), `"auto_review"` (a reviewer model decides)', 'Input guardrails run only for the first agent, output guardrails only for the final one'],
      ['Google ADK', '`FunctionTool(..., require_confirmation=True)`; `before_tool_callback`; plugins', 'Confirmation-enabled tools', 'Tools without confirmation', 'Tool Confirmation is marked experimental in ADK TypeScript, Go and Kotlin'],
      ['Any product', 'Your approval client', 'One that shows the exact call to a person', 'One that auto-answers allow', 'An auto-allowing client equals `always_allow`; settings that remove approval belong only in isolated, disposable environments'],
    ],
  },
  {
    id: 'deployment-rollout-stages', title: 'Rolling out and running an agent', topic: '5.3',
    columns: ['Stage or concern', 'What happens', 'Exit criterion or signal'],
    rows: [
      ['1. Read-only', 'Read tools on real systems; answers to the requester', 'Evaluation suite passes; no secrets in log samples; injection cases handled'],
      ['2. Shadow mode', 'Real inputs; write tools record the exact action instead of executing it', 'Proposals match what people did in the agreed share of cases; none dangerous'],
      ['3. Pilot', 'Real actions for one site, queue or shift; writes behind approval', 'Success and escalation stable; no incidents; approvers not rubber-stamping'],
      ['4. Widen', 'Same controls, more scope, step by step', 'Metrics hold at each step; rollback rehearsed'],
      ['Monitor', 'Task success, tool error rate, cost per task, escalation rate, approvals and denials, turns per run', 'Alert on paused sessions, failed runs, budgets reached, denial spikes'],
      ['Change', 'Model, prompt or tool change = production change', 'Re-run evaluations; compare versions; back a stage if needed'],
      ['Off switch', 'Stop triggers, stop running work, revoke credentials', 'Rehearsed; an interrupt does not undo completed actions'],
    ],
  },
  {
    id: 'netops-agents-compared', title: 'Two network operations agents side by side', topic: '5.4',
    columns: ['', 'Read-only diagnostics agent', 'Change agent with approval gate'],
    rows: [
      ['Output', 'A report: summary, evidence, ruled out, next step, confidence', 'A change request: exact diff, rollback, pre- and post-checks, risk'],
      ['Tools', '`get_device`, `run_show_command` (enum of checks), `search_tickets`, `get_runbook`', 'The read tools plus `validate_change` and `create_change_request` (asks every time)'],
      ['Device credential', 'Read-only, with AAA command authorization', 'Read-only; the agent never holds production write credentials'],
      ['Who changes the network', 'Nobody; a person acts on the report', 'The existing pipeline, after a different engineer approves the exact diff, in the window, with a hash check'],
      ['Safety net', 'Server-side validation plus device-side authorization', 'Policy validation, approval bound to the diff, verification, automatic rollback criteria'],
      ['Keep out of reach', 'Shells, arbitrary URLs, write tools', 'Bulk-destructive commands, security controls, self-approval, anything without an audit trail'],
      ['Evaluate', 'Outcome, path, planted instructions, canary secrets, escalation', 'Policy rejections, diff accuracy, rollback correctness, approval flow'],
    ],
  },
];

export default [
  ...d1Tables,
  ...d2Tables,
  ...d3Tables,
  ...d4Tables,
  ...d5Tables,
];
