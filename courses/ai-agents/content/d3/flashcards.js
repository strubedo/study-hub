// Domain 3 — Context, Memory and Orchestration. Original flashcards; facts checked against vendor documentation on
// 2026-11-23 (URLs and anything not verified are listed in REVIEW-TODO.md). Beta names and headers change: re-check them.
let n = 0;
const c = (topic, front, back) => ({ id: `d3-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 3.1 System prompts
  c('3.1', 'Five parts of an agent system prompt (this course\'s checklist)?', 'Role and goal, operating rules, tool-use guidance, stopping criteria, output format.'),
  c('3.1', 'System prompt vs tool description vs first user message?', 'System: lasting policy for every run. Tool description: what one tool does and when to use it. First user message: per-run data (ticket, site, date).'),
  c('3.1', '"Right altitude" (Effective context engineering)?', 'Between brittle hard-coded logic and vague guidance: the minimal set of information that fully describes expected behaviour.'),
  c('3.1', 'Why keep timestamps out of the system prompt?', 'The cached prefix must match exactly; a per-run value makes the system prompt and everything after it miss the cache.'),
  // 3.1 Budgets
  c('3.1', 'What counts toward the context window?', 'System prompt, tool definitions, every message and tool result, and the generated output including thinking. Cached tokens still count.'),
  c('3.1', 'Total input tokens from a Claude `usage` object?', '`input_tokens` + `cache_creation_input_tokens` + `cache_read_input_tokens`.'),
  c('3.1', 'What does `input_tokens` mean when caching is on?', 'Only the tokens after the last cache breakpoint: neither read from nor written to the cache.'),
  c('3.1', 'Why do big tool results dominate budgets?', 'Every later request resends them. Filter, paginate, summarize, return references, cap and say how to get more.'),
  c('3.1', 'Measure a request before sending it?', '`client.messages.count_tokens(...)` (`POST /v1/messages/count_tokens`) returns `input_tokens`.'),
  // 3.1 Compaction and context editing
  c('3.1', 'Compaction vs context editing?', 'Compaction summarizes older turns. Context editing clears chosen content by rule (old tool results, old thinking) and keeps the rest verbatim.'),
  c('3.1', 'On-demand compaction in one line (beta, 2026-11-23)?', 'Send `compaction: {"type": "summarize"}`; replace the summarized messages with the returned `compaction` block, sent first and unchanged on every later request.'),
  c('3.1', 'Threshold compaction in one line (beta, 2026-11-23)?', 'A `compact_20260112` edit in `context_management`; the API summarizes inside the request at the trigger and drops content before the block.'),
  c('3.1', 'Tool result clearing and caching?', 'Clearing invalidates the cached prefix from the cleared point; `clear_at_least` makes each clearing worth the new cache write.'),
  c('3.1', 'What does compaction lose?', 'Detail, plus images, documents and fetched URLs in the summarized range; mid-conversation system messages there stop applying.'),
  c('3.1', 'Rule for summarizing history yourself?', 'Never separate a `tool_use` from its `tool_result`; use a structured summary; keep the system prompt unchanged.'),
  // 3.1 Caching
  c('3.1', 'Cached prefix order (Claude)?', '`tools`, then `system`, then `messages`, up to and including the block marked `cache_control`.'),
  c('3.1', 'Two ways to enable caching?', 'Top-level `cache_control` (automatic, moves with the conversation) or `cache_control` on blocks (explicit, up to four breakpoints).'),
  c('3.1', 'Where to put a breakpoint?', 'On the last block that is identical across requests; writes happen only at breakpoints and lookback finds only earlier writes (20 blocks).'),
  c('3.1', 'Cache lifetimes?', '5 minutes by default, refreshed free on each read; 1 hour with `"ttl": "1h"` at a higher write multiplier.'),
  c('3.1', 'Prompt below the minimum cacheable length?', 'Processed without caching, no error; both cache fields in `usage` are 0. The minimum varies by model.'),
  c('3.1', 'Change that invalidates the whole cache?', 'Any tool definition change, including reordering tools or unstable JSON key order.'),
  // 3.2 Memory and state
  c('3.2', 'Conversation state vs durable memory?', 'State: the history you resend this session. Durable memory: stored outside the window and read back by later sessions.'),
  c('3.2', 'Memory tool: who runs it, where is data?', 'Client-side: your handler runs each command against storage you choose, mapped from the `/memories` prefix.'),
  c('3.2', 'Memory tool commands?', '`view`, `create`, `str_replace`, `insert`, `delete`, `rename`.'),
  c('3.2', 'Agent SDK session options (Python)?', '`continue_conversation=True` (most recent), `resume=session_id` (specific), `fork_session=True` (branch). `ClaudeSDKClient` for one process.'),
  c('3.2', 'What does resuming a session not restore?', 'The filesystem or devices: sessions persist the conversation. Use file checkpointing for files.'),
  c('3.2', 'Never store in memory?', 'Secrets, unneeded personal data, unverified claims as facts, instructions from untrusted content, raw dumps.'),
  c('3.2', 'Why is writable memory an injection risk?', 'An injected instruction can be saved and read by later sessions as trusted memory. Use read-only stores for reference data.'),
  // 3.3 Retrieval
  c('3.3', 'Anthropic embeddings model?', 'None of its own. The embeddings page describes Voyage AI as one provider and says to assess several vendors.'),
  c('3.3', 'Fix for RAG missing exact identifiers?', 'Hybrid search: add BM25 keyword matching to embeddings, merge, then rerank.'),
  c('3.3', 'Contextual Retrieval in one line?', 'Prepend chunk-specific context (source, section) to each chunk before embedding and keyword indexing.'),
  c('3.3', 'Claude citations: what do they prove?', 'That the cited text is in a source you provided, not that the source is correct or safe.'),
  c('3.3', 'Agentic search vs RAG in one line?', 'Agentic search: fresh and exact, more round trips. RAG: fast on meaning, needs indexing and goes stale.'),
  // 3.4 Orchestration
  c('3.4', 'Five patterns in "Building effective agents"?', 'Prompt chaining, routing, parallelization (sectioning, voting), orchestrator-workers, evaluator-optimizer.'),
  c('3.4', 'Orchestrator-workers vs parallelization?', 'Orchestrator-workers decides the subtasks at run time from the input; parallelization runs subtasks defined in advance.'),
  c('3.4', 'What does a non-fork SDK subagent receive?', 'Its own prompt, the Agent tool\'s prompt string, project CLAUDE.md and its tools. Not the parent\'s history or system prompt.'),
  c('3.4', '`AgentDefinition` without `tools`?', 'Inherits every tool available to subagents. Listing tools restricts them but does not pre-approve them.'),
  c('3.4', 'Multi-agent token cost (Anthropic, 2026)?', 'Typically 3 to 10 times a single agent for equivalent tasks; use only for context isolation, parallel work or specialization.'),
];
