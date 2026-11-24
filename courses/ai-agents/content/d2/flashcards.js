// Domain 2 — Tools and the Model Context Protocol. Original flashcards; facts checked against vendor documentation on
// 2026-11-23 (URLs and anything not verified are listed in REVIEW-TODO.md). Type strings, limits and beta status change: re-check them.
// Topics 2.4 and 2.5 are appended after the 2.3 block by a later writer; ids are generated from array order.
let n = 0;
const c = (topic, front, back) => ({ id: `d2-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 2.1 Defining tools
  c('2.1', 'Fields of a user-defined Claude tool?', 'Required: `name`, `input_schema`. `description` is optional in the API but essential in practice; optional `input_examples`. Optional properties include `strict`, `cache_control`, `defer_loading`, `allowed_callers`, `eager_input_streaming`.'),
  c('2.1', 'Allowed tool name pattern?', '`^[a-zA-Z0-9_-]{1,128}$`: letters, digits, underscore, hyphen; 1 to 128 characters. No spaces or dots.'),
  c('2.1', 'Five things a tool description should answer?', 'What it does, when to use it, when not to, what it returns, and what each parameter means. Aim for at least 3 to 4 sentences.'),
  c('2.1', 'Fewer tools or many?', 'Fewer, task-shaped tools with distinct purposes; namespace by service (`itsm_search`). Never merge read-only and state-changing actions into one tool.'),
  c('2.1', 'What does `strict: true` guarantee?', 'Tool `input` follows the schema and the tool `name` is valid (grammar-constrained sampling). Not that values are correct, safe or enum-cased exactly.'),
  c('2.1', 'JSON Schema keywords strict mode rejects?', '`minimum`, `maximum`, `multipleOf`, `minLength`, `maxLength`, `oneOf`, `not`, recursive schemas, `additionalProperties` other than `false`.'),
  c('2.1', 'Where does a numeric range go in a strict schema?', 'In the property description ("1 to 20"), enforced by clamping or validating in the tool code.'),
  c('2.1', 'Good tool result in one line?', 'Only the fields the next step needs, with reusable identifiers and units, bounded in size, with a note on how to get more.'),
  c('2.1', 'Good error result?', '`is_error: true` plus what went wrong and what to try next ("No device X; closest match Y; use the full hostname"). No stack traces.'),
  // 2.2 The tool-use loop
  c('2.2', 'Rules for the message that returns tool results?', 'Immediately after the calls; `tool_result` blocks first; one result per `tool_use` (matched by `tool_use_id`); same `tools`; assistant content sent back unchanged.'),
  c('2.2', 'Error text for a missing or misplaced result?', '"`tool_use` ids were found without `tool_result` blocks immediately after".'),
  c('2.2', 'Parallel tool calls: how to return results?', 'All results in ONE user message. One message per result is documented as wrong: it teaches Claude to stop calling tools in parallel. Calls you skipped still get an `is_error` result.'),
  c('2.2', 'How to turn off parallel tool use (Claude)?', '`disable_parallel_tool_use: true` inside `tool_choice`. With `auto`: at most one call. With `any`/`tool`: exactly one. OpenAI: `parallel_tool_calls: false`.'),
  c('2.2', 'The four `tool_choice` types?', '`auto` (default with tools), `any`, `tool` (with `name`), `none` (default without tools).'),
  c('2.2', 'Side effects of forcing a tool (`any`/`tool`)?', 'Response starts with the tool call: no preamble text and no thinking. Unsupported with manual extended thinking and on some newer models.'),
  c('2.2', '`max_tokens` with a `tool_use` block last?', 'The call is incomplete: never run it. Retry with a higher `max_tokens`.'),
  c('2.2', 'What the SDK tool runner does, and what it leaves you?', 'Runs tools, appends messages, wraps errors as `is_error`. You own validation, `max_iterations`, checking the final `stop_reason`, approvals (use a manual loop) and persistence.'),
  // 2.3 Client and server tools
  c('2.3', 'Three buckets of tools?', 'User-defined client tools; Anthropic-schema client tools (bash, text editor, memory, computer, browser: your app runs them); server tools (web search, web fetch, code execution: Anthropic runs them).'),
  c('2.3', 'How do server-tool calls appear in a response?', '`server_tool_use` block (id `srvtoolu_...`) followed by a result block such as `web_search_tool_result`, paired by `tool_use_id`. You send no `tool_result`.'),
  c('2.3', 'Server tool and client tool called in the same turn?', '`stop_reason: "tool_use"`, server call has no result yet. Send ONLY the client `tool_result` blocks with the same `tools`; the API then runs the server tool.'),
  c('2.3', 'Web fetch reach limits?', 'Only URLs already in the conversation (user messages, client tool results, earlier search/fetch results); blocks private addresses; set `max_uses` (no default).'),
  c('2.3', 'Domain filter rules for web tools?', '`allowed_domains` OR `blocked_domains`, not both; no scheme; subdomains included; wildcards only in the path (`*.example.com` is invalid).'),
  c('2.3', 'Securing a bash or computer use tool?', 'Isolated VM or container, least-privileged user, command allowlist, resource limits, log everything, redact secrets, human confirmation for consequential actions.'),
  // 2.4 Model Context Protocol (part 2, checked 2026-11-23 against MCP specification revision 2026-07-28)
  c('2.4', 'MCP host, client and server?', 'Host: the LLM application; creates clients, enforces consent. Client: connector inside the host, talks to exactly ONE server. Server: exposes tools, resources and prompts.'),
  c('2.4', 'Who controls each MCP primitive?', 'Tools: model-controlled. Resources: application-controlled. Prompts: user-controlled.'),
  c('2.4', 'Legacy MCP lifecycle (2025-11-25 and earlier)?', '`initialize` request (version, capabilities, `clientInfo`) → response (version, capabilities, `serverInfo`) → `notifications/initialized` → operation → shutdown by closing the transport.'),
  c('2.4', 'What replaced the handshake in revision 2026-07-28?', 'Nothing up front: every request carries `_meta` with `io.modelcontextprotocol/protocolVersion` and `io.modelcontextprotocol/clientCapabilities`. Servers must implement `server/discover`; dual-era clients probe with it on stdio and fall back to `initialize`. (The Inspector defaults to the legacy handshake.)'),
  c('2.4', 'Client features in revision 2026-07-28?', 'Elicitation (form or URL mode) is current. Sampling and roots are deprecated (as is server-side Logging). Servers ask for input by returning `InputRequiredResult`; the client retries with `inputResponses`.'),
  c('2.4', 'MCP `CallToolResult` fields?', '`content` (text, image, audio, `resource_link`, `resource`), optional `structuredContent` (matches `outputSchema` if declared), `isError` (absent means success).'),
  c('2.4', 'Protocol error vs tool execution error?', 'Protocol: JSON-RPC `error` (unknown tool, malformed request). Execution: normal result with `isError: true` and a message; pass it to the model so it can self-correct.'),
  c('2.4', 'Tool annotations and their trust level?', '`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`, `title`. Hints only: untrusted unless the server is trusted; never a security control.'),
  c('2.4', 'The stdio golden rule?', 'stdout carries only newline-delimited MCP messages. Never `print()`; log to stderr (Python `logging` does by default).'),
  c('2.4', 'Streamable HTTP in one line?', 'One MCP endpoint; every client message is a POST; reply is JSON or a per-request SSE stream; validate `Origin`; bind local servers to 127.0.0.1. No sessions in 2026-07-28.'),
  c('2.4', 'MCP authorization roles?', 'MCP server = OAuth resource server (publishes Protected Resource Metadata). MCP client = OAuth client (PKCE, `resource` parameter, Bearer on every request). stdio: credentials from the environment.'),
  c('2.4', 'Claude MCP connector essentials?', 'Beta. `mcp_servers` (`type: "url"`, https `url`, `name`, optional `authorization_token`) plus one `mcp_toolset` per server. Tools only; public HTTPS servers only; no stdio. API runs the calls: never send a `tool_result` for `mcp_tool_use`.'),
  // 2.5 Structured output
  c('2.5', 'Claude structured output request field?', '`output_config.format` with `type: "json_schema"` and `schema`. Python: `client.messages.parse(output_format=Model)` → `parsed_output`.'),
  c('2.5', 'When can structured output still miss the schema?', '`stop_reason` `refusal` or `max_tokens` (retry with more tokens); enum values may differ in capitalization. Check `stop_reason` first.'),
  c('2.5', 'Structured output vs tool use?', 'Want data back: structured output. Want an action or outside information: a tool (strict if inputs matter). Both: strict tools in the loop, `output_config.format` for the final report.'),
  c('2.5', 'Order of checks before acting on model output?', 'Stop reason → parse → schema (in code) → normalize → business rules → decide (accept for approval, retry once, or hand off). Never feed output straight into a command.'),
  c('2.5', 'OpenAI and Gemini structured output fields?', 'OpenAI Responses: `text.format` (`json_schema`); Chat Completions: `response_format`. Gemini: `response_format` (Interactions) or `response_mime_type` + `response_json_schema`.'),
];
