// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the topics it supports. This field moves quickly: where a video shows an older SDK, model name or API shape, trust the lesson and the vendor documentation.',
  playlist: null,
  legacy: { label: 'Older', title: 'Recorded with older SDKs, model names or API shapes; the ideas still apply' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'Checked 2026-11-23. No good, current free video covers structured outputs and validating model output before acting (2.5), so that topic has none. Several others are covered only in part: the mechanics of the tool-use loop (parallel calls, returning errors, tool choice and ending the loop, 2.2), server tools such as web search, web fetch, code execution and computer use (2.3, where the only video is about sandboxing), sessions and memory tools (3.2) and chunking, ranking and citations (3.3, concept explainers only), reading transcripts and truncation (4.2), model tiers, thinking budgets, batch and streaming (4.3, only prompt caching has videos), retries, timeouts, rate limits, idempotent tools and spend limits (4.4, only human hand-off), secrets, vaults, data retention and redaction (5.2), the exact permission modes, policies and hooks of current agent SDKs (5.3; product names change too fast for video), and a change agent with an approval gate (5.4, where the networking videos are overviews). Videos marked Older show earlier SDK or MCP revisions; the ideas still apply, but copy names from the lessons and the vendor documentation.',
  },
  resources: [
    { name: 'Claude developer documentation', url: 'https://platform.claude.com/docs', note: 'Tool use, structured outputs, prompt caching, the Agent SDK and hosted agents.' },
    { name: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/', note: 'The specification, SDKs and guides for building MCP servers and clients.' },
    { name: 'OpenAI platform documentation', url: 'https://platform.openai.com/docs', note: 'Function calling, structured outputs and the Agents SDK.' },
    { name: 'Gemini API documentation', url: 'https://ai.google.dev/gemini-api/docs', note: 'Function calling and agent tooling for Gemini models.' },
  ],
};
