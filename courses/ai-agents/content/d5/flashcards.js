// Domain 5 — Safety and Deployment. Original flashcards; facts checked against vendor and OWASP documentation on
// 2026-11-23 (URLs and anything not verified are listed in REVIEW-TODO.md). Product setting names change: re-check them.
let n = 0;
const c = (topic, front, back) => ({ id: `d5-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 5.1 Injection
  c('5.1', 'Direct vs indirect prompt injection (OWASP LLM01:2026)?', 'Direct: the user\'s own input changes model behaviour. Indirect: instructions arrive in content the model ingests (web pages, email, tickets, tool or MCP output, RAG passages), usually unseen by the user.'),
  c('5.1', 'Anthropic\'s two injection threat models?', 'Jailbreaks and direct injection: the user is the adversary. Indirect injection: the user is trusted, but third-party content Claude processes carries adversarial instructions.'),
  c('5.1', 'Name six sources of untrusted text for a NOC agent.', 'Tickets and comments, email, web pages, syslog and trap text, device fields such as interface descriptions and LLDP names, MCP tool descriptions, stored memory, other agents\' output.'),
  c('5.1', 'Trusted-surface indirect injection?', 'An attacker writes through a low-privilege channel (public form, ticket) into a system your agent trusts; the agent then acts with your elevated credentials (OWASP 2026).'),
  c('5.1', 'Why can\'t a system-prompt rule stop injection?', 'OWASP 2026: no reliable prevention exists; defence is architectural. Anthropic: model behaviour is not a security control. Prompts lower odds; tools, credentials and approvals limit damage.'),
  c('5.1', 'The three dangerous capabilities to never combine in one unattended run?', 'Untrusted input, access to sensitive data, and a way to change state or send data out ("lethal trifecta" / "Rule of Two", cited by OWASP 2026).'),
  c('5.1', 'Where should third-party content go in a Claude request?', 'Only in `tool_result` blocks, labelled with source and author and JSON-encoded; never in `system` or plain user text. Your own instructions go in a following user turn.'),
  c('5.1', 'OWASP Excessive Agency (LLM03:2026) root causes?', 'Excessive functionality, excessive permissions, excessive autonomy.'),
  c('5.1', 'What should an agent do when content tells it to do something?', 'Not act on it, report that the content contained instructions, and continue the user\'s actual task. The system should make the instruction harmless anyway.'),
  // 5.2 Least privilege
  c('5.2', 'Why split read and write tools?', 'Permissions, allow and deny rules, approvals, logs and rate limits all work per tool. One mixed tool forces all-or-nothing approval and a write-capable credential for reads.'),
  c('5.2', 'Are MCP `readOnlyHint` / `destructiveHint` enforcement?', 'No. They are hints; the MCP spec says clients must treat annotations as untrusted unless the server is trusted.'),
  c('5.2', 'Where may secrets live?', 'Environment of the tool process, a secrets manager, a platform vault, or a proxy that injects them outside the agent\'s boundary.'),
  c('5.2', 'Where must secrets never appear?', 'Prompts, tool descriptions, tool results, logs and traces, memory and transcripts, the repository.'),
  c('5.2', 'Managed Agents `environment_variable` vault credential, in one line?', 'The sandbox sees an opaque placeholder; the real secret is substituted at egress, only for the credential\'s `allowed_hosts` and `injection_location`.'),
  c('5.2', 'Why no Claude API key inside a Managed Agents sandbox?', 'Code could call the Claude API directly, outside the agent\'s tool settings, approvals and budget.'),
  c('5.2', 'Claude Agent SDK sandbox defaults to check (Python)?', '`enabled` false; unsandboxed fallback with a warning unless `failIfUnavailable`; `allowUnsandboxedCommands` true; network settings cover Bash, not WebFetch.'),
  c('5.2', 'Managed Agents environment: `networking` omitted?', 'The docs say an API create request that omits it gets `unrestricted`. Always set `limited` with an explicit `allowed_hosts` list.'),
  c('5.2', 'What leaves your environment on a model API call?', 'The whole request: system prompt, tool definitions, every message and tool result. Server tools also send queries and URLs on to third parties.'),
  // 5.3 Deployment
  c('5.3', 'What replaces the watching human in a scheduled or event-driven agent?', 'Approvals routed to someone or failing closed, caps and budgets in code, alerts, rate-limited triggers, idempotent tools.'),
  c('5.3', 'Agent SDK permission evaluation order?', 'Hooks, deny rules, ask rules, permission mode, allow rules, then `can_use_tool`.'),
  c('5.3', 'Agent SDK permission modes (2026-11-23)?', '`default`, `dontAsk`, `acceptEdits`, `bypassPermissions`, `plan`, `auto`.'),
  c('5.3', 'Does `allowed_tools` restrict the agent?', 'No. It pre-approves listed tools; others still exist. It does not constrain `bypassPermissions`. Block with `disallowed_tools`.'),
  c('5.3', 'Why can a `can_use_tool` check be silently skipped?', 'Calls approved earlier (allow rules, `acceptEdits`, `bypassPermissions`) never reach it. Put must-run checks in a `PreToolUse` hook.'),
  c('5.3', 'Managed Agents permission policies and defaults?', '`always_allow`, `always_ask`, `auto`. Agent toolset defaults to `always_allow`; MCP toolsets to `always_ask`. Custom tools are outside policies.'),
  c('5.3', 'Is Managed Agents `auto` a human checkpoint?', 'No. A call judged safe runs before anyone sees it. Use `always_ask` where a person must review.'),
  c('5.3', 'Rollout stages (this course)?', 'Read-only, shadow mode on real inputs, scoped pilot with approvals, widen; each with a written exit criterion.'),
  c('5.3', 'Five metrics for a deployed agent?', 'Task success rate, tool error rate, cost per task, escalation rate, approval and denial rates (plus turns per run).'),
  c('5.3', 'Three parts of an off switch?', 'Stop new triggers, stop running work, revoke or rotate the credentials it holds. An interrupt does not undo completed actions.'),
  // 5.4 Network operations
  c('5.4', 'Safest shape for a device "show" tool?', 'A check name from an enum plus validated parameters; the server builds the CLI from fixed templates, accepts only inventory hostnames, and uses a read-only device account.'),
  c('5.4', 'What does a change agent do, and not do?', 'Drafts the change and rollback, validates against policy, opens a change request. Never applies: an approved, hash-checked pipeline does, in the window.'),
  c('5.4', 'Four things to keep out of an agent\'s reach?', 'Production write credentials, bulk-destructive commands, security controls (AAA, logging, its own permissions), anything without an audit trail. Also self-approval.'),
  c('5.4', 'Good automatic rollback criteria?', 'Measurable checks with time limits agreed in advance, for example interface up within 5 minutes, device answers polling within 2 minutes.'),
];
