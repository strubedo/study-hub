// Domain 4 — Reliability, Safety and Real-World Use. Original flashcards.
let n = 0;
const c = (topic, front, back) => ({ id: `d4-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  c('4.1', 'What is a hallucination?', 'Fluent, confident output that is factually wrong or unsupported by the supplied context. Techniques reduce it but do not eliminate it.'),
  c('4.1', 'Which content is highest risk for hallucination?', 'Exact strings: commands and flags, IDs, version numbers, URLs, citations and quotes.'),
  c('4.1', 'What does grounding mean?', 'Supplying the source material, telling the model to answer from it, and saying what to do when it is silent.'),
  c('4.1', 'Why extract quotes first?', 'For long documents, word-for-word quotes anchor the analysis in real text and let you check the evidence before the answer.'),
  c('4.1', 'Claim-level citation with retraction?', 'Ask the model to find a supporting quote for each claim after drafting and remove any claim it cannot support.'),
  c('4.1', 'How do you permit uncertainty?', 'Tell the model it may answer "I don\'t know" or "not in the document", and give a format such as Confirmed / Inferred / Unknown.'),
  c('4.1', 'Are citations proof?', 'No. A citation is a claim about a source. Open the source and check that it exists and supports the statement.'),
  c('4.1', 'Three checks for AI-written commands?', 'Syntax (valid on this OS and release), semantics (does exactly the intended change) and blast radius (what breaks, and the rollback).'),
  c('4.1', 'Best primary checks for a suggested command?', 'CLI help (`?`), vendor documentation for your release, and a lab or dry-run mode. The model is a drafter, not a reference.'),
  c('4.1', 'Does asking the model to self-review prove correctness?', 'No. It shares its own blind spots. Use the result as a worklist of items to verify elsewhere.'),
  c('4.2', 'Why does account type matter for data?', 'Consumer, team/business, enterprise and API products have different terms, settings and admin controls. Check the plan before pasting.'),
  c('4.2', 'What does a training opt-out cover?', 'Whether content is used to train models. It does not by itself settle retention, safety or abuse review, or account compromise.'),
  c('4.2', 'Name five things never to paste.', 'Passwords and enable secrets, SNMP communities, API keys and tokens, VPN pre-shared keys or private keys, and personal data.'),
  c('4.2', 'Why is Cisco type 7 not safe to paste?', 'Type 7 is reversible obfuscation, not hashing. Hashes can also be cracked. Remove any such line.'),
  c('4.2', 'How do you redact a config well?', 'Replace values with consistent labelled placeholders (and RFC 5737 addresses), review line by line, then map the answer back.'),
  c('4.2', 'Direct vs indirect prompt injection?', 'Direct: the user\'s own input alters model behaviour. Indirect: instructions arrive in external content such as a page, file, email or tool result.'),
  c('4.2', 'Why is injection possible?', 'Instructions and data share one text channel, and the model may follow instruction-like text inside untrusted content.'),
  c('4.2', 'Jailbreak vs injection?', 'A jailbreak tries to make the model ignore its safety rules. Injection tries to hijack the task. They overlap; jailbreaking is a form of injection.'),
  c('4.2', 'The dangerous combination for agents?', 'Private data, untrusted content, and a way to send data out or act. Remove at least one.'),
  c('4.2', 'Name four layered injection defences.', 'Mark untrusted data, least privilege, human approval for risky actions, input and tool-output screening, adversarial testing, monitoring.'),
  c('4.3', 'What should a script prompt state?', 'Language and version, library, platform, inputs and outputs, read-only behaviour, credential source and failure handling.'),
  c('4.3', 'Cisco IOS ACL mask rule?', 'ACLs use wildcard masks: 192.0.2.0 0.0.0.255 matches a /24. A subnet mask there is a common AI error.'),
  c('4.3', 'How do you make a config review report gaps?', 'Provide a checklist of expected controls and ask for absent ones under "Not present".'),
  c('4.3', 'Prompt evaluation in one line?', 'Define success, run a test set of typical, edge, negative and adversarial cases, score it, change one thing at a time, and re-run when the model changes.'),
];
