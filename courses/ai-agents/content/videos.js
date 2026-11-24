// Curated free YouTube videos mapped to Building AI Agents topics.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
// Curated 2026-11-23: candidates found with `yt-dlp "ytsearch8:<query>" --flat-playlist`, then every id confirmed
// individually with `yt-dlp --print "%(id)s|%(duration)s|%(title)s|%(channel)s|%(upload_date)s" <url>` (all public);
// titles, durations and channels below are as yt-dlp reported them. Vendor channels (Anthropic, OpenAI, Google, Microsoft),
// AI Engineer and Agentic AI Foundation conference talks and IBM Technology explainers were preferred; hype, "make money"
// and no-code promotion uploads were skipped, as were attack tutorials. Topics are this course's blueprint ids, mapped by
// title, channel and description, not by watching every minute: trust the lessons where a video differs.
// legacy = an older code or product demo (uploaded before about May 2025) that may show earlier SDKs, API shapes,
// MCP revisions or model names. Concept explainers from before then are kept as not legacy when they show no SDK code.
const RAW = [
  // Domain 1: Agent foundations
  ['uhJJgc-0iTQ', 1138, 'Building more effective AI agents', 'lecture', ['1.1'], false, 'Anthropic'],
  ['D7_ipDqhtwk', 909, 'How We Build Effective Agents: Barry Zhang, Anthropic', 'lecture', ['1.1'], false, 'AI Engineer'],
  ['LP5OCa20Zpg', 1099, 'Tips for building AI agents', 'lecture', ['1.1', '2.1'], false, 'Anthropic'],
  ['h8gMhXYAv1k', 296, 'What is Tool Calling? Connecting LLMs to Your Data', 'lecture', ['1.2', '2.1', '2.2'], false, 'IBM Technology'],
  ['TqC1qOfiVcQ', 6745, 'Claude Agent SDK [Full Workshop] — Thariq Shihipar, Anthropic', 'lecture', ['1.3'], false, 'AI Engineer'],
  ['tK32trvj_b4', 2860, 'Build Hour: Agents SDK', 'lecture', ['1.3'], false, 'OpenAI'],
  ['Uv0nAf_7tyU', 1059, 'Decoupling the Brain from the Hands: Claude Managed Agents (Part 1 of 4) — Anthropic', 'lecture', ['1.3', '5.2'], false, 'AI Engineer'],
  // Domain 2: Tools and MCP
  ['iH_wV8BbS24', 862, "Sandboxes Aren't Optional: 4 Ways to Isolate Coding Agents — Robert Brennan, OpenHands", 'lecture', ['2.3', '5.2'], false, 'AI Engineer'],
  ['CQywdSdi5iA', 1175, 'The Model Context Protocol (MCP)', 'lecture', ['2.4'], false, 'Anthropic'],
  ['cGuyrANVi4A', 478, 'How Model Context Protocol (MCP) actually works', 'lecture', ['2.4'], false, 'Google Cloud Tech'],
  ['kQmXtrmQ5Zg', 6251, 'Building Agents with Model Context Protocol - Full Workshop with Mahesh Murag of Anthropic', 'lecture', ['2.4'], true, 'AI Engineer'],
  ['mYKMwZcGynw', 1164, '[Session] Intro to OAuth for MCP Servers with Aaron Parecki, Okta', 'lecture', ['2.4'], true, 'Agentic AI Foundation'],
  ['b0v2zCLOdcM', 1390, 'MCP Security, Two Years In - Den Delimarsky, Anthropic', 'lecture', ['2.4', '5.1', '5.2'], false, 'Agentic AI Foundation'],
  ['88No8pw706o', 337, 'MCP security best practices', 'lecture', ['2.4', '5.2'], false, 'Microsoft Developer'],
  // Domain 3: Context, memory and orchestration
  ['BBPQYtR7oUk', 605, 'Context engineering explained: What every AI developer should know', 'lecture', ['3.1'], false, 'Google Cloud Tech'],
  ['u57EnkQaUTY', 546, 'What is Prompt Caching? Optimize LLM Latency with AI Transformers', 'lecture', ['3.1', '4.3'], false, 'IBM Technology'],
  ['tECAkJAI_Vk', 3363, 'Build Hour: Prompt Caching', 'lecture', ['3.1', '4.3'], false, 'OpenAI'],
  ['BacJ6sEhqMo', 640, 'The Four Types of Memory Every AI Agent Needs', 'lecture', ['3.2'], false, 'IBM Technology'],
  ['0z9_MhcYvcY', 341, 'What is Agentic RAG?', 'lecture', ['3.3'], false, 'IBM Technology'],
  ['IPu3HwtQb18', 1075, 'How Anthropic Builds Multi-Agent Systems: Patterns and Pitfalls', 'lecture', ['3.4'], false, 'Databricks Events'],
  ['pX0_iIfRilU', 317, 'Foundations of multi-agent systems with ADK', 'lecture', ['3.4'], false, 'Google Cloud Tech'],
  // Domain 4: Reliability, evaluation and cost
  ['trfUBIDeI1Y', 368, 'LLM as a Judge: Scaling AI Evaluation Strategies', 'lecture', ['4.1'], false, 'IBM Technology'],
  ['FDVdLrloFOw', 884, 'Observability and Evals for AI Agents: A Simple Breakdown', 'lecture', ['4.1', '4.2'], false, 'LangChain'],
  ['cmEJ-5zYKHA', 447, 'Why AI Agents Need A Human in the Loop Now', 'lecture', ['4.4', '5.1'], false, 'IBM Technology'],
  // Domain 5: Safety and deployment
  ['jrHRe9lSqqA', 657, 'What Is a Prompt Injection Attack?', 'lecture', ['5.1'], false, 'IBM Technology'],
  ['5ZA1lTxTH3c', 607, 'Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks', 'lecture', ['5.1'], false, 'IBM Technology'],
  ['cNE7P5FkqR8', 1141, 'Andrew Bullen - Breaking the Lethal Trifecta (Without Ruining Your Agents) | [un]prompted 2026', 'lecture', ['5.1'], false, 'unprompted'],
  ['soFWS8NBcSU', 538, 'Top 10 Security Risks in AI Agents Explained', 'lecture', ['5.1', '5.2'], false, 'IBM Technology'],
  ['d8d9EZHU7fw', 812, 'Securing AI Agents with Zero Trust', 'lecture', ['5.2'], false, 'IBM Technology'],
  ['qJtcEDc_WJU', 1590, 'Scheduled Agents, Dreaming and Q&A: Claude Managed Agents (Part 3 of 4) — Anthropic', 'lecture', ['5.3', '1.3'], false, 'AI Engineer'],
  ['l4TP6IyJxmQ', 355, 'How to deploy AI agents into production', 'lecture', ['5.3'], true, 'Microsoft Developer'],
  ['RKBi_ouZPP8', 531, 'AI for Networking: Agentic AI Powering Intelligent Automation', 'lecture', ['5.4'], false, 'IBM Technology'],
  ['y8YtQzj5bBM', 607, 'Agentic AI for Network Engineers', 'lecture', ['5.4'], false, 'Kevin Wallace Training, LLC'],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
