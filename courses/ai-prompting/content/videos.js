// Curated free YouTube videos mapped to course topics. Ids, durations, titles and channels come from yt-dlp flat search (2026-10-30). No title names an old model, so legacy is false throughout.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
const RAW = [
  ["LPZh9BOjkQs", 478, "Large Language Models explained briefly", "lecture", ['1.1'], false, "3Blue1Brown"],
  ["-QVoIxEpFkM", 691, "What is a Context Window? Unlocking LLM Secrets", "lecture", ['1.1'], false, "IBM Technology"],
  ["zjkBMFhNj_g", 3588, "[1hr Talk] Intro to Large Language Models", "lecture", ['1.1'], false, "Andrej Karpathy"],
  ["TeQDr4DkLYo", 918, "Why LLMs get dumb (Context Windows Explained)", "extra", ['1.1'], false, "NetworkChuck"],
  ["7xTGNNLPyMI", 12684, "Deep Dive into LLMs like ChatGPT", "extra", ['1.1', '1.2'], false, "Andrej Karpathy"],
  ["0vZ_UVLhSQQ", 319, "Getting started with Claude.ai", "extra", ['1.2'], false, "Anthropic"],
  ["EWvNQjAaOHw", 7872, "How I use LLMs", "extra", ['1.2', '3.2'], false, "Andrej Karpathy"],
  ["QAKtNOWsaHI", 187, "How to write an AI prompt", "lecture", ['2.1'], false, "Google"],
  ["OfUn6HjwXhI", 216, "Behind the prompt: Prompting tips for Claude.ai", "lecture", ['2.1'], false, "Anthropic"],
  ["ysPbXH0LpIE", 1493, "Prompting 101 | Code w/ Claude", "lecture", ['2.1', '2.2'], false, "Anthropic"],
  ["pwWBcsxEoLk", 1440, "You SUCK at Prompting AI (Here's the secret)", "lecture", ['2.1', '2.2'], false, "NetworkChuck"],
  ["1c9iyoVIwDs", 762, "4 Methods of Prompt Engineering", "lecture", ['2.2', '2.4'], false, "IBM Technology"],
  ["AFE6x81AP4k", 514, "Chain-of-thought prompting - Explained!", "extra", ['2.4'], false, "CodeEmporium"],
  ["T-D1OfcDW1M", 396, "What is Retrieval-Augmented Generation (RAG)?", "lecture", ['3.1'], false, "IBM Technology"],
  ["vD0E3EUb8-8", 472, "Context Engineering vs. Prompt Engineering: Smarter AI with RAG & Agents", "extra", ['3.1', '3.2'], false, "IBM Technology"],
  ["eur8dUO9mvE", 226, "What is MCP? Integrate AI Agents with Databases & APIs", "lecture", ['3.2'], false, "IBM Technology"],
  ["cfqtFvWOfg0", 578, "Why Large Language Models Hallucinate", "lecture", ['4.1'], false, "IBM Technology"],
  ["005JLRt3gXI", 314, "Why do AI models hallucinate?", "lecture", ['4.1'], false, "Claude and Anthropic"],
  ["jrHRe9lSqqA", 657, "What Is a Prompt Injection Attack?", "lecture", ['4.2'], false, "IBM Technology"],
  ["rAEqP9VEhe8", 743, "Generative AI's Greatest Flaw - Computerphile", "lecture", ['4.2'], false, "Computerphile"],
  ["zn2ukSnDqSg", 701, "ChatGPT Jailbreak - Computerphile", "extra", ['4.2'], false, "Computerphile"],
  ["5ZA1lTxTH3c", 608, "Securing AI Agents: How to Prevent Hidden Prompt Injection Attacks", "extra", ['4.2'], false, "IBM Technology"],
  ["gUNXZMcd2jU", 1512, "OWASP's Top 10 Ways to Attack LLMs: AI Vulnerabilities Exposed", "extra", ['4.2'], false, "IBM Technology"],
  ["wYfZ-DCCfYc", 1250, "Network Engineers: This AI Trick Will Save You HOURS", "lecture", ['4.3'], false, "David Bombal Tech"],
  ["ft6YMt8nPrA", 924, "Network Engineers: You Need This New AI Skill Set", "extra", ['4.3'], false, "David Bombal Tech"],
  ["OVdXQMto36Q", 1281, "AI Agents: An Artificially Intelligent Network Engineer", "extra", ['3.2', '4.3'], false, "John Capobianco"],
  ["z89tfs7HV0I", 1056, "I Automated My Network Documentation with AI and Python", "extra", ['4.3'], false, "G Talks Tech"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
