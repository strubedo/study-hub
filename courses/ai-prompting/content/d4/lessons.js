// Domain 4 — Reliability, Safety and Real-World Use. Original content; claims checked against Anthropic, OpenAI, Google and OWASP pages in October 2026.
export default [
  { id: '4.1-grounding-uncertainty', topic: '4.1', title: 'Why Models Hallucinate: Grounding, Quotes, Citations and "I Don\'t Know"', minutes: 9, file: '4.1-grounding-uncertainty.md',
    objectives: ['Explain why fluent output can still be wrong', 'Ground an answer in supplied sources and restrict outside knowledge', 'Ask for quotes first and for claim-level citations', 'Give the model a legitimate way to say it does not know'] },
  { id: '4.1-verify-technical-output', topic: '4.1', title: 'Fact-Checking Commands, Configs and Code', minutes: 10, file: '4.1-verify-technical-output.md',
    objectives: ['Recognise the common ways technical answers go wrong', 'Check syntax, semantics and blast radius separately', 'Verify against vendor documentation, built-in help and a lab', 'Use self-checks and repeated runs without trusting them as proof'] },
  { id: '4.2-data-and-secrets', topic: '4.2', title: 'What Happens to Your Data: Plans, Training Opt-Outs and Secrets', minutes: 10, file: '4.2-data-and-secrets.md',
    objectives: ['Compare consumer, team/business, enterprise and API data handling as concepts', 'Find and check training and history settings before pasting work data', 'List what must never be pasted and how to redact configs and logs', 'Apply a simple paste-or-not decision'] },
  { id: '4.2-injection-jailbreaks', topic: '4.2', title: 'Prompt Injection, Indirect Injection, Jailbreaks and Guardrails', minutes: 10, file: '4.2-injection-jailbreaks.md',
    objectives: ['Define direct and indirect prompt injection and tell them from jailbreaks', 'Recognise an injected instruction in pasted email, web or log content', 'Apply layered defences: data/instruction separation, least privilege, human approval', 'Explain why guardrails exist and why none is perfect'] },
  { id: '4.3-scripts-configs-logs', topic: '4.3', title: 'Scripts, Config Review and Troubleshooting with Show Output and Logs', minutes: 11, file: '4.3-scripts-configs-logs.md',
    objectives: ['Write and review PowerShell and Python (Netmiko) with safe prompts', 'Review Cisco, Fortinet and Palo Alto configs with a structured prompt', 'Explain show output and logs without feeding the model secrets', 'Keep the model read-only and the human in charge of changes'] },
  { id: '4.3-docs-changes-evals', topic: '4.3', title: 'Change Plans, Runbooks and Evaluating Your Prompts', minutes: 11, file: '4.3-docs-changes-evals.md',
    objectives: ['Draft change plans and runbooks with verification and rollback steps', 'Build a small test set for a prompt', 'Score outputs with a rubric and compare prompt versions', 'Re-run the evaluation when the model or prompt changes'] },
];
