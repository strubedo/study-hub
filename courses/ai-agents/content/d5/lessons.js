// Domain 5 — Safety and Deployment (20%). Original content; defensive only (no working injection payloads,
// jailbreaks or safeguard-bypass techniques). Written 2026-11-23. Facts checked that day against Anthropic's
// "Mitigate jailbreaks and prompt injections" guide, the Claude Managed Agents pages (permission policies, vaults,
// cloud environment setup, cloud sandbox reference, secure your deployment, risks and boundaries, review and monitor
// sessions, scheduled deployments), "API and data retention", the Claude Agent SDK pages (permissions, hooks,
// securely deploying AI agents, hosting, Python reference), OWASP's Top 10 for LLM Applications 2026 (LLM01:2026
// Prompt Injection, LLM03:2026 Excessive Agency), the MCP specification 2026-07-28 (tools, schema) and its security
// best-practices and local server security guides, OpenAI's guardrails and human review, automatic review, agent
// safety and data controls pages, and Google's ADK safety and tool confirmation pages and Gemini managed agents
// environment and credentials pages. Every URL is listed in REVIEW-TODO.md. Device output, tickets and transcripts
// are made up; code samples were compiled, and the pure-Python ones run, offline.
export default [
  // 5.1 Prompt injection
  { id: '5.1-untrusted-input-injection', topic: '5.1', title: 'Prompt Injection from the Defender\'s Side: Untrusted Input, Direct and Indirect', minutes: 13, file: '5.1-untrusted-input-injection.md',
    objectives: ['Explain why everything an agent reads, including tool results, MCP tool descriptions and memory, is untrusted input', 'List the sources of untrusted text in IT and network operations, including device fields others can write', 'Define direct and indirect prompt injection using OWASP LLM01:2026 and Anthropic\'s two threat models', 'Recognise an injected instruction in a ticket or page without relying on spotting it', 'Explain why no prompt wording prevents injection and why the design must limit what a manipulated agent can do'] },
  { id: '5.1-defences-in-layers', topic: '5.1', title: 'Injection Defences in Layers: Separation, Least Privilege, Allowlists and Confirmation', minutes: 15, file: '5.1-defences-in-layers.md',
    objectives: ['Distinguish controls that reduce the chance of injection from controls that bound its damage', 'Separate and label untrusted content as Anthropic\'s guide describes', 'Apply OWASP\'s Excessive Agency mitigations to tools', 'Check a design for the dangerous combination of untrusted input, sensitive data and a way to act or send out', 'Place allowlists, human confirmation, output checks and monitoring, and treat summaries of untrusted content as untrusted'] },
  // 5.2 Least privilege
  { id: '5.2-read-only-secrets', topic: '5.2', title: 'Read-Only Tools, Scoped Credentials and Where Secrets Live', minutes: 14, file: '5.2-read-only-secrets.md',
    objectives: ['Design read-only tools first and split read tools from write tools', 'Scope credentials per agent and per environment, short-lived where possible', 'State where secrets may live and where they must never appear', 'Describe Claude Managed Agents vaults and the equivalent Gemini credentials as documented', 'Keep secrets out of tool results such as device configurations'] },
  { id: '5.2-sandboxing-data-handling', topic: '5.2', title: 'Sandboxing, Egress Control and Data Handling', minutes: 15, file: '5.2-sandboxing-data-handling.md',
    objectives: ['List the properties of a sandbox for code and command execution', 'Describe the documented sandbox options and defaults in the Claude Agent SDK and Managed Agents, with OpenAI and Google equivalents', 'Control network egress with allowlists and keep agent sandboxes off the management network', 'Explain what leaves your environment on a model API call and where to find retention options', 'Redact data before sending and log without secrets or personal data'] },
  // 5.3 Deployment
  { id: '5.3-deployment-shapes', topic: '5.3', title: 'Interactive, Scheduled and Event-Driven Agents; Self-Hosted and Hosted Operations', minutes: 13, file: '5.3-deployment-shapes.md',
    objectives: ['Compare interactive, scheduled and event-driven agents and what changes when nobody is watching', 'Describe Managed Agents scheduled deployments and their operational details', 'Compare self-hosted and hosted agents on scaling, state, upgrades, cost visibility and security responsibility', 'Choose a session pattern for a self-hosted Agent SDK deployment'] },
  { id: '5.3-permissions-approval-modes', topic: '5.3', title: 'Permission Modes, Policies, Hooks and Approvals', minutes: 15, file: '5.3-permissions-approval-modes.md',
    objectives: ['Trace the Claude Agent SDK permission evaluation order', 'Explain each Agent SDK permission mode and the semantics of allowed and disallowed tools', 'Use a PreToolUse hook and the can_use_tool callback correctly', 'Configure Managed Agents permission policies and know their defaults', 'Name the OpenAI and Google approval mechanisms and identify every setting that removes human approval'] },
  { id: '5.3-rollout-monitoring', topic: '5.3', title: 'Rollout, Monitoring and the Off Switch', minutes: 13, file: '5.3-rollout-monitoring.md',
    objectives: ['Plan a staged rollout: read-only, shadow mode, pilot, widen', 'Choose and compute monitoring metrics for a deployed agent', 'Detect drift after a model or prompt change', 'Design and rehearse an off switch', 'Review a deployment plan for missing safeguards'] },
  // 5.4 IT and network operations
  { id: '5.4-diagnostics-agent', topic: '5.4', title: 'A Read-Only Network Diagnostics Agent', minutes: 15, file: '5.4-diagnostics-agent.md',
    objectives: ['Design the tools of a read-only diagnostics agent, with the device tool restricted to allowlisted checks', 'Validate tool input on the server and back it with read-only device authorization', 'Write the agent\'s system prompt and its may and may-not list', 'Evaluate the agent on outcome, path, safety cases and escalation'] },
  { id: '5.4-change-agent-boundaries', topic: '5.4', title: 'A Change Agent with a Human Approval Gate, and What to Keep Out of Reach', minutes: 14, file: '5.4-change-agent-boundaries.md',
    objectives: ['Design a change agent that drafts, validates and files a change request but never applies it', 'Bind approval to the exact diff, a maintenance window and automatic rollback criteria', 'Decide which device, ticket and documentation tools belong behind MCP servers and which need approval', 'List what must stay out of an agent\'s reach and review a change-agent design'] },
];
