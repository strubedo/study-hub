// Domain 4 — Reliability, Evaluation and Cost. Original questions; no vendor or third-party question content.
// Facts checked against vendor documentation on 2026-11-23 (URLs in REVIEW-TODO.md). Every exhibit question was worked
// from its exhibit, and all arithmetic was recomputed offline with plain Python. Transcripts, usage reports, log lines,
// error bodies and code in exhibits are written for this course from documented shapes, not captured from live calls.
// Answers never depend on a model name, a price or a version string; cost questions state their rates in the exhibit.
const L_SET = '4.1-test-sets';
const L_GRADE = '4.1-grading-methods';
const L_EVAL = '4.1-eval-worked-example';
const L_READ = '4.2-reading-transcripts';
const L_LOG = '4.2-logging-tracing';
const L_COST = '4.3-token-accounting';
const L_TIER = '4.3-model-tier-effort';
const L_BATCH = '4.3-batch-streaming';
const L_RETRY = '4.4-retries-timeouts';
const L_SAFE = '4.4-idempotency-limits-handoff';

const bank = [
  // ---------- 4.1 Test sets ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L_EVAL,
    stem: 'Refer to the exhibit. Version 4 only rewords the description of get_interface_status. Each case ran 10 trials per version with the same model and settings. What is the right conclusion?',
    exhibit: `Case  Kind            Before (v3)    After (v4)
T1    representative  9/10           10/10
T2    representative  8/10           8/10
T3    edge case       10/10          6/10
T4    must decline    10/10          10/10
T5    must escalate   7/10           9/10
All                   44/50 (88%)    43/50 (86%)`,
    options: ['v4 regressed T3 (10/10 to 6/10) even though the overall rate barely moved; read the failing T3 transcripts and fix the description before shipping', 'Ship v4: the overall pass rate is within noise of v3', 'Ship v4: T1 and T5 improved, which outweighs one edge case', 'Run T3 once more; if that single trial passes, the drop was noise'],
    answer: [0],
    explanation: "Read results per case, not just the average. A drop from 10/10 to 6/10 on the same case is far larger than the small moves on the other cases, and T3 is a regression case the agent used to pass reliably. The overall 88% vs 86% hides it. Shipping on the average, or trading an edge case for gains elsewhere, accepts a known regression (the typo case now loops or reports a guessed device). One more trial cannot settle a 6/10 result; read the failing transcripts to find what the new wording invites, fix it, and rerun the suite.",
  },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L_GRADE,
    stem: 'Refer to the exhibit. This parser reads a model grader\'s output, which contains a reasoning section followed by a verdict tag. Which line number makes the grader report PASS for outputs that actually reject the answer?',
    exhibit: `1  def parse_verdict(grader_text):
2      text = grader_text.strip().lower()
3      if "pass" in text:
4          return "PASS"
5      if "fail" in text:
6          return "FAIL"
7      return "UNKNOWN"`,
    answer: ['3', 'line 3'],
    explanation: "Line 3 matches the substring \"pass\" anywhere in the output, so \"this answer does not pass\", or reasoning that mentions passing followed by `<verdict>FAIL</verdict>`, returns PASS (\"passed\" and \"bypass\" match too). Because line 3 runs first, line 5 never sees those outputs. A strict parser looks only inside a closed verdict tag (for example a regex on `<verdict>(PASS|FAIL|UNKNOWN)</verdict>`) and treats anything else as UNKNOWN, never as a pass. Lines 2 and 7 are harmless.",
  },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L_SET,
    stem: 'Refer to the exhibit. This is the whole test set for a read-only network diagnostics agent. Which two additions would most improve it? (Choose two.)',
    exhibit: `T1  Slow transfers on sw-access-12 Gi1/0/48       expect: names duplex mismatch
T2  Slow transfers on sw-access-14 Gi1/0/2        expect: names duplex mismatch
T3  CRC errors on sw-access-03 Gi1/0/7            expect: names cabling or optics
T4  Port err-disabled on sw-access-07 Gi1/0/5     expect: names port security
T5  Port err-disabled on sw-access-09 Gi1/0/11    expect: names port security
T6  High latency on sw-dist-02 Po1                expect: names congestion`,
    options: ['A request to shut down an interface on sw-core-01, where the read-only agent must decline and hand the request to a human', 'A hostname that is not in inventory, where the agent must say so instead of inventing interface status', 'Ten more duplex-mismatch tickets so that case is weighted properly', 'A case that passes only if the agent calls the tools in one exact order', 'A case whose correct answer the senior engineers disagree about'],
    answer: [0, 1],
    explanation: "Every existing case is a representative case where the agent should find a cause. The set has no case it must decline or escalate and no edge case, so it would reward an agent that confidently diagnoses everything. A change request it must decline, and a hostname typo it must report rather than paper over, fill both gaps. More duplex tickets add volume to a kind already covered. Grading an exact tool order is brittle (Anthropic's evals article warns against it: agents find valid paths designers did not expect). A case experts disagree on is ambiguous and adds noise: a good task is one two experts would grade the same way.",
  },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L_EVAL,
    stem: 'Refer to the exhibit. Case T1 uses only this grader, and the trial shown passed. What is wrong with the grading?',
    exhibit: `Grader for T1:  PASS if re.search(r"duplex", final_answer, re.I)

Trial transcript:
  tool_call   search_tickets {"query": "slow transfers"}
  tool_result []                     (no tickets found)
  final       "Probably a duplex mismatch on the uplink."`,
    options: ['It checks only the final text, so a guess with no evidence passes; add a check that get_interface_status was called on the ticket\'s device', 'Nothing: the answer names the right cause, which is what matters', 'The regex should be case-sensitive', 'It should require search_tickets to be called exactly twice'],
    answer: [0],
    explanation: "The agent never looked at the interface; it found no tickets and guessed. A text-only grader cannot tell a lucky guess from a diagnosis, so the eval overstates reliability. Agent evals check essential evidence (the interface tool on the right device) and forbidden behaviour as well as the answer. Case sensitivity is irrelevant to the flaw, and requiring an exact number of `search_tickets` calls scripts the path instead of checking evidence.",
  },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L_GRADE,
    stem: 'An eval case for an escalation path passes only if exactly one escalation with severity P1 exists in the sandbox ticket store when the trial ends. Which kind of grader fits this check best?',
    options: ['A code-based state check that reads the sandbox store', 'A model grader asked whether the final answer says a P1 was opened', 'A human reviewer reading every transcript', 'An exact match on the final answer text'],
    answer: [0],
    explanation: "The criterion is about the outcome (the environment's final state), and code can check it exactly, cheaply and reproducibly: the documentation's advice is to use the fastest, most reliable method that can judge the criterion. A model grader reading the answer checks the words, not the state; an agent can claim a P1 that does not exist. Human review is slow and adds nothing for a checkable fact. Exact match on text is brittle and again grades the claim, not the outcome.",
  },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L_GRADE,
    stem: 'Match each evaluation need for a diagnostics agent to the grading method that fits it best.',
    pairs: [
      ['The final report must validate against the incident report JSON Schema', 'Code-based schema check'],
      ['Every counter and ticket id in the answer must appear in the tool results', 'Model grader with a rubric and the tool results'],
      ['No escalation record may exist after a routine duplex-mismatch case', 'Code-based state check on the sandbox'],
      ['Decide whether a new LLM judge can be trusted at scale', 'Human labels on a sample, compared with the judge\'s verdicts'],
    ],
    explanation: "Schema validity and sandbox state are exact, checkable facts: code graders are fastest and most reliable. Groundedness of free text is a judgment code cannot express robustly, so a rubric-based model grader that sees the tool results fits (a code check on ticket-id strings can complement it). A model grader must itself be calibrated against human labels before you trust it; human grading is too slow for every trial but is the right tool for calibration.",
  },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L_EVAL,
    stem: 'Refer to the exhibit. Estimate the per-trial success rate from these trials and assume trials are independent. What is pass^3, the probability that three trials in a row all pass? Enter a decimal with three places.',
    exhibit: `Case T5, same input and settings, 5 trials
trial 1  PASS
trial 2  FAIL   (no escalation recorded)
trial 3  PASS
trial 4  PASS
trial 5  PASS`,
    answer: ['0.512', '.512', '51.2%', '51.2'],
    explanation: "Four of five trials passed, so p = 0.8. pass^k = p^k, so pass^3 = 0.8 × 0.8 × 0.8 = **0.512**. By contrast pass@3 (at least one of three succeeds) = 1 − 0.2^3 = 0.992. For an escalation an on-call engineer relies on every time, pass^k is the number that predicts how often someone is let down. Five trials is a small sample, so treat 0.8 as a rough estimate.",
  },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L_EVAL,
    stem: 'An on-call assistant must give a correct first answer every time an engineer asks. Which summary of repeated trials best predicts how often it will let someone down?',
    options: ['pass^k: the probability that all k trials of a case succeed', 'pass@k: the probability that at least one of k trials succeeds', 'The best single trial for each case', 'The mean number of tool calls per trial'],
    answer: [0],
    explanation: "Anthropic's evals article defines pass^k as the probability that all k trials succeed and says it matters for customer-facing agents where users expect reliable behaviour every time. pass@k rises with k because it only needs one success; it suits tools where one good answer out of several is enough. The best single trial hides variance entirely, and tool-call counts measure the path, not success.",
  },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L_SET,
    stem: 'Put these steps for building a first eval for an agent in a sensible order.',
    items: ['Collect 20 to 50 tasks from real tickets, manual checks and past failures', 'Write each task unambiguously with an expected outcome and a reference solution', 'Build a harness that starts every trial from a clean environment', 'Write graders: code checks first, model graders where needed', 'Run several trials per task and record transcripts and path metrics', 'Read the transcripts of failures to see whether the agent or the grader is wrong'],
    explanation: "This follows the roadmap in Anthropic's evals article: start with real tasks, make each one unambiguous with a reference solution (which also proves it is solvable), isolate trials so shared state does not cause correlated failures, choose graders (deterministic where possible), run multiple trials because outputs vary, and read transcripts before trusting the scores. Writing graders before the tasks exist, or reading results before running trials, cannot work.",
  },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L_GRADE,
    stem: 'Refer to the exhibit. This model grader gives inconsistent verdicts and passes answers that cite counters no tool returned. Which change addresses the causes?',
    exhibit: `Grader prompt (sent as the only user message):

Here is an answer from our network agent:
{final_answer}

Is this a good answer? Reply yes or no.`,
    options: ['Give it a rubric with pass and fail conditions, include the tool results so it can check facts, ask for reasoning before a closed verdict, and allow UNKNOWN', 'Send the grader prompt inside the agent\'s own conversation so it shares the agent\'s context', 'Ask for a score from 1 to 100 with no explanation, so it is quicker', 'Lower max_tokens so the grader cannot overthink'],
    answer: [0],
    explanation: "The prompt has no rubric (\"good\" is undefined, so verdicts vary) and no tool results (so it cannot know a counter was invented). The documentation's tips for LLM-based grading are a detailed rubric, an empirical output, and reasoning before the score; the evals article adds a way out (Unknown) and calibration against humans. Grading inside the agent's own conversation biases the judge toward the agent's view. A 1-to-100 score without reasons is harder to calibrate, not easier. Limiting tokens does not supply the missing rubric or evidence.",
  },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L_GRADE,
    stem: 'Refer to the exhibit. An expert labelled ten trials and a new model grader labelled the same ten. What does this tell you, and what should you do next?',
    exhibit: `Item   1    2    3    4    5        6    7    8    9    10
Model  PASS FAIL PASS PASS UNKNOWN  FAIL PASS PASS FAIL PASS
Human  PASS FAIL FAIL PASS FAIL     FAIL PASS FAIL FAIL PASS`,
    options: ['Agreement is 70%; the grader passed two answers the expert failed (items 3 and 8) and was unsure on item 5, so tighten the rubric using those items and recheck before relying on it', 'Agreement is 70%, which is good enough to grade every future trial automatically', 'Agreement is 80%; the disagreements are UNKNOWN verdicts and can be ignored', 'The human labels should be corrected to match the model, because the model reasons before it answers'],
    answer: [0],
    explanation: "The labels agree on items 1, 2, 4, 6, 7, 9 and 10: 7 of 10, or 70%. The disagreements are the dangerous kind: two false passes (3 and 8) and one UNKNOWN on a failing answer (5). The evals article says LLM judges must be calibrated against human experts before you trust them, so study those items, tighten the rubric and measure again. 70% with false passes is not good enough to automate; the count is not 80%; and human labels are the reference, not something to bend toward the grader.",
  },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L_EVAL,
    stem: 'Refer to the exhibit. The model id, effort setting and system prompt are unchanged. What must run before this change is merged?',
    exhibit: `- "description": "Returns a runbook by id."
+ "description": "Read-only. Returns the steps of one runbook. Use it after you
+                 have identified the likely cause. Valid ids: interface-errors,
+                 port-security, uplink-down."`,
    options: ['The full regression suite (and the capability suite), several trials per case, compared with the last recorded results', 'Nothing: evals are only needed when the model changes', 'Only the cases that call get_runbook, once each', 'A single manual run on one ticket'],
    answer: [0],
    explanation: "A tool description is part of every request and changes when and how the model calls every tool, not just this one, so any change to a prompt, a tool description, a schema or result format, or the model and its settings should trigger the regression suite. Limiting the run to cases that call `get_runbook` misses side effects elsewhere (lesson 4.1-eval-worked-example shows a description change breaking an unrelated edge case), and single trials cannot separate change from noise.",
  },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L_SET,
    stem: 'Which two statements about designing agent test cases agree with Anthropic\'s evals guidance? (Choose two.)',
    options: ['Grade what the agent produced and the evidence that matters, rather than an exact sequence of tool calls', 'Keep a reference solution for each task to prove it can be passed and that the graders work', 'Require the exact order of tool calls so the agent cannot take shortcuts', 'A 0% pass rate across many trials on a frontier model usually shows the agent lacks the capability', 'Evals are only worth building after the agent is in production'],
    answer: [0, 1],
    explanation: "The article recommends grading outputs rather than the precise path (agents find valid approaches designers did not anticipate) and creating a reference solution for each task. It says a 0% pass@100 on frontier models is most often a sign of a broken task or grader, not an incapable agent, and that evals are especially useful at the start of development. Exact-order checks are the brittle approach it warns against.",
  },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L_SET,
    stem: 'A new case fails on all 40 trials, with two different strong models. What should you check first?',
    options: ['The task and its grader: whether the spec is ambiguous or the grader rejects valid answers, by reading transcripts and trying the reference solution', 'Whether a third, larger model can pass it', 'Whether raising the iteration cap helps', 'Nothing: drop the case, since no model can do it'],
    answer: [0],
    explanation: "Anthropic's evals article says a 0% pass rate across many trials with frontier models is most often a broken task, not an incapable agent, and gives examples of graders that rejected correct answers. Running the reference solution through the graders and reading a few transcripts tells you quickly. Trying more models or a higher cap tests the agent before the eval itself has been verified; dropping the case throws away what may be a real failure mode.",
  },
  // ---------- 4.2 Debugging runs ----------
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L_READ,
    stem: 'Refer to the exhibit. What is the best first fix?',
    exhibit: `step 1  stop=tool_use  get_interface_status {"device": "sw-acces-12", "interface": "Gi1/0/48"}
        tool_result is_error=false  "lookup failed"
step 2  stop=tool_use  get_interface_status {"device": "sw-acces-12", "interface": "Gi1/0/48"}
        tool_result is_error=false  "lookup failed"
step 3  stop=tool_use  get_interface_status {"device": "sw-acces-12", "interface": "Gi1/0/48"}
        tool_result is_error=false  "lookup failed"
step 4  stop=end_turn  "The interface appears healthy. No action is needed."`,
    options: ['Make the tool return is_error: true with what failed and what to do, for example that the device is not in inventory and the full name format to use', 'Add "ALWAYS use full hostnames" to the system prompt', 'Lower the iteration cap to 2', 'Switch to a larger model'],
    answer: [0],
    explanation: "The run loops because the result gives the model nothing to act on and is not even marked as an error, and then the model invents a conclusion. The fix belongs where the decision happens: an `is_error` result that says what went wrong and what to try next lets the model correct the hostname on step 2. A system-prompt rule is far from the decision and does not tell the model which device is meant. A lower cap only stops the loop sooner, and a larger model receives the same uninformative result.",
  },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L_READ,
    stem: 'Refer to the exhibit. At which step number does the run first go wrong? Enter a number.',
    exhibit: `Ticket: "Users behind sw-access-12, port Gi1/0/48, report slow transfers."

step 1  get_interface_status {"device": "sw-access-12", "interface": "Gi1/0/48"}
        -> is_error=true  "No device 'sw-access-12'. Use the inventory name,
           for example sw-access-12.example.com."
step 2  search_tickets {"query": "slow transfers"}
        -> {"tickets": [], "note": "0 of 0"}
step 3  get_runbook {"runbook_id": "interface-errors"}
        -> {"title": "Interface CRC and input errors", "steps": ["..."]}
step 4  final: "The interface looks healthy. As a precaution, follow the
        interface-errors runbook."`,
    answer: ['2', 'step 2'],
    explanation: "Step 1 is a reasonable attempt with the name the ticket gave, and its error result is exactly what a good tool should return: what failed and the correct format. Step **2** is the first divergence: the agent ignores the error instead of retrying with `sw-access-12.example.com`, so it never sees the interface. Steps 3 and 4 follow from that (a runbook chosen without evidence, and a claim that the interface looks healthy that no tool result supports). Fix the earliest divergence: here the system prompt or tool description can say to retry with the suggested name after a not-found error.",
  },
  { topic: '4.2', type: 'match', difficulty: 2, lesson: L_READ,
    stem: 'Match each symptom in an agent transcript to the fix that addresses its cause.',
    pairs: [
      ['The same lookup repeats with identical arguments after each "lookup failed" result', 'Return is_error: true with what failed and what to try next'],
      ['The model calls search_tickets to find out whether a port is up', 'Rewrite the descriptions to say when to use each tool and when not to'],
      ['Tool calls include a vlan_name parameter the schema does not define', 'Set strict: true on the tool definition'],
      ['stop_reason is max_tokens and the last block is an incomplete tool_use', 'Retry with a higher max_tokens and never execute the partial call'],
      ['A request fails with HTTP 400 "prompt is too long" after a full config dump', 'Filter and paginate the tool result, and clear or compact old results'],
    ],
    explanation: "Loops after unhelpful results are fixed by actionable error results. Wrong-tool choices come from overlapping descriptions; Claude's troubleshooting page says to differentiate tools by when to use them. Invented parameters are what strict tool use prevents. A truncated tool call is incomplete input and must not run; the stop-reason guide says to retry with more `max_tokens`. An input-side context overflow is an HTTP 400, fixed by keeping big results out of the history (Domain 3).",
  },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L_READ,
    stem: 'Refer to the exhibit. The request set max_tokens to 2048. What explains the response, and what is the right change?',
    exhibit: `{
  "stop_reason": "max_tokens",
  "content": [
    {"type": "thinking", "thinking": "", "signature": "<opaque>"},
    {"type": "text", "text": "The uplink shows"}
  ],
  "usage": {
    "input_tokens": 9200,
    "output_tokens": 2048,
    "output_tokens_details": {"thinking_tokens": 2030}
  }
}`,
    options: ['Thinking used almost all of max_tokens, which covers thinking and text together; raise max_tokens (streaming large values) or lower the effort level', 'The input was too large for the context window; compact the history', 'Set display to "omitted" so thinking no longer counts toward max_tokens', 'Resend the same request unchanged; the cut-off was random'],
    answer: [0],
    explanation: "Of 2,048 output tokens, 2,030 were thinking, leaving 18 for text, so the answer stopped mid-sentence. Thinking counts toward `max_tokens` and is billed as output; the thinking cost-control section gives two remedies: raise `max_tokens` or lower effort. A context overflow would be a 400 or `model_context_window_exceeded`, not this. `display: \"omitted\"` hides the thinking text but the tokens are still generated, counted and billed. Resending unchanged will most likely truncate again.",
  },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L_READ,
    stem: 'Refer to the exhibit. The agent has only read-only tools and is meant to finish the diagnosis on its own. What is the most direct fix?',
    exhibit: `step 1  get_interface_status {"device": "sw-access-12.example.com", "interface": "Gi1/0/48"}
        -> {"oper_status": "up", "duplex": "half", "crc_errors": 17990}
step 2  stop=end_turn  "Gi1/0/48 runs half duplex. Shall I check the CRC
        history and the runbook for you?"`,
    options: ['State in the system prompt that read-only checks never need permission, and give a stopping rule (finish with the cause, the evidence and the runbook)', 'Raise MAX_ITERATIONS so the agent has more room', 'Force tool use with tool_choice so the model must keep calling tools', 'Add a write tool so the agent can fix the duplex itself'],
    answer: [0],
    explanation: "This is a premature stop: the agent asks permission for work it is allowed to do and stops after one call. Telling it that reads need no permission and what a finished answer contains addresses the cause. The cap was not reached, so raising it changes nothing. Forced tool use is rejected on some current models and would make every turn a tool call, including the final answer. Adding a write tool expands what the agent can break and does not address why it stopped.",
  },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L_LOG,
    stem: 'Refer to the exhibit. Vendor support asks for the identifier of this failed request. Which field name, as it appears in Claude API error bodies, should this log line include?',
    exhibit: `{"event": "model_call", "run_id": "run-88", "step": 4, "model": "claude-haiku-5-5",
 "ok": false, "status": 500, "error_type": "api_error", "seconds": 3.2}`,
    answer: ['request_id'],
    explanation: "Claude error bodies carry a top-level `request_id` beside the `error` object, and every response has a `request-id` header with the same value. In the Python SDK, a failed call raises `anthropic.APIStatusError`, whose `request_id` attribute holds it (that attribute is in the SDK source; the documented property on successful responses is `_request_id`). The errors page says to include this id when contacting support. The header spelling `request-id` is not the body field the stem asks for. The run id and step are your own identifiers; support cannot look them up.",
  },
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L_LOG,
    stem: 'In the Anthropic Python SDK, how do you read the request id of a successful messages.create response for your logs?',
    options: ['From the response object\'s _request_id property', 'From response.usage.request_id', 'Only by turning on ANTHROPIC_LOG=debug and parsing the debug output', 'It is not available for successful responses, only for errors'],
    answer: [0],
    explanation: "The Python SDK page says all object responses provide a `_request_id` property, taken from the `request-id` header, and that unlike other underscore names it is public. The usage object holds token counts, not ids. `ANTHROPIC_LOG` turns on SDK logging but is not how you read the id. Every response, successful or not, has a request id.",
  },
  { topic: '4.2', type: 'multi', difficulty: 2, lesson: L_LOG,
    stem: 'Which two belong in the default log line for every tool call of a production agent? (Choose two.)',
    options: ['The tool name and tool_use_id', 'The result size and whether the result was an error', 'The full raw result, including device configurations', 'The API key the agent used for that run', 'The complete system prompt'],
    answer: [0, 1],
    explanation: "Name and id link the call to the model turn and its result; size and `is_error` explain context growth and loops. Those (plus redacted arguments and duration) answer most debugging questions. Full raw results can contain community strings, keys and personal data, so log them only in an approved pipeline. An API key must never be logged. The system prompt is the same on every call and belongs in version control, not in each tool line.",
  },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L_LOG,
    stem: 'A team enables OpenTelemetry tracing in the Anthropic Python SDK (beta) but must not export prompts or tool results to its observability platform. What should it do?',
    options: ['Keep the client\'s default content mode, metadata_only, which records identifiers, timing, status and token counts but not prompts and responses', 'Set the content mode to content and redact the spans afterwards in the dashboard', 'Disable tracing entirely; the SDK always exports prompts', 'Put the prompts in conversation_id so they are hashed'],
    answer: [0],
    explanation: "The OpenTelemetry pages document two content modes: `metadata_only`, the default, and `content`, which adds prompts and responses. Keeping the default meets the requirement. Exporting content and cleaning it later means the data has already left. The SDK does not always export prompts. `conversation_id` is exported in both modes, and the docs warn not to put personal data or secrets in it.",
  },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L_LOG,
    stem: 'Refer to the exhibit. The agent\'s get_running_config tool returns full device configurations, including SNMP communities. Which line number writes secrets into the log?',
    exhibit: `1  def log_tool(run_id, block, content, is_error):
2      emit("tool_call", run_id=run_id,
3           tool=block.name, tool_use_id=block.id,
4           input=redact(json.dumps(block.input)),
5           result_chars=len(content),
6           result=content,
7           is_error=is_error)`,
    answer: ['6', 'line 6'],
    explanation: "Line 6 logs the raw result, which for this tool is a full configuration with secrets. Line 4 logs the input after redaction, and line 5 logs only the result's length. Log result metadata by default (size, error flag), and if you must keep content, redact it and send it only to an approved pipeline. Better still, have the tool strip secrets before returning the config at all.",
  },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L_READ,
    stem: 'Refer to the exhibit. Which check would catch this failure automatically in an eval?',
    exhibit: `tool_call   search_tickets {"query": "sw-access-12 slow", "status": "any"}
tool_result {"tickets": [{"ticket_id": "INC-4471", "summary": "Duplex mismatch, Gi1/0/48"}]}
final       "This matches INC-4471 and INC-4502, both duplex mismatches on this switch."`,
    options: ['A code check that every ticket id in the final answer appears in some tool result', 'Raising the iteration cap so the agent can verify INC-4502', 'An exact match of the final answer against a stored answer', 'A limit on the number of tool calls'],
    answer: [0],
    explanation: "INC-4502 appears in no tool result: it is a hallucinated result. A groundedness check (here a simple code check on ticket ids, or a model grader that compares facts with tool results) catches it in every trial. The cap was not reached and is unrelated. Exact match is brittle and fails valid rewordings while saying nothing about grounding. A tool-call limit measures the path, not the facts.",
  },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L_READ,
    stem: 'Refer to the exhibit. The previous tool result was a full configuration archive. What should the agent\'s code do?',
    exhibit: `HTTP 400
{"type": "error",
 "error": {"type": "invalid_request_error", "message": "prompt is too long: ..."},
 "request_id": "req_example04"}`,
    options: ['Treat it as an input-side context overflow: shrink what is sent (filter or paginate the result, clear or compact old results), because retrying unchanged will fail again', 'Retry the same request with exponential backoff', 'Handle it like stop_reason model_context_window_exceeded and continue the loop', 'Raise max_tokens and resend'],
    answer: [0],
    explanation: "When the input alone exceeds the context window, the API rejects the request with a 400 `invalid_request_error` (\"prompt is too long\"); no message is returned. It is not transient, so backoff only repeats the failure. `model_context_window_exceeded` is a stop reason on a successful response when generation fills the window, a different case. Raising `max_tokens` adds output room and makes the input problem no better. The fix is to keep large tool results out of the history (Domain 3).",
  },
  { topic: '4.2', type: 'order', difficulty: 2, lesson: L_READ,
    stem: 'Put these steps for debugging a failed agent run in a sensible order.',
    items: ['Read the stop_reason (or HTTP error) of the last response', 'Walk the tool calls and results in order, noting errors', 'Find the first step where a competent engineer would have done something different', 'Look at what the model was shown at that step: the tool descriptions and the exact result text', 'Change the tool result, description, tool shape or prompt at that point', 'Rerun the regression suite to confirm the fix and check for side effects'],
    explanation: "Start from how the run ended, then trace the calls to the earliest divergence: everything after it is usually consequence. The cause lies in what the model saw at that step, so the fix goes there (results and descriptions before the system prompt), and a fix is only done when the evals show it worked without breaking other cases.",
  },
  // ---------- 4.3 Cost and latency ----------
  { topic: '4.3', type: 'fill', difficulty: 3, lesson: L_COST,
    stem: 'Refer to the exhibit. All cache writes in this request used the 5-minute lifetime. What did the request cost, in price units? Enter a decimal with three places.',
    exhibit: `Rates (illustrative, price units per million tokens): input 2, output 10
Multipliers (pricing page, 2026-11-23): 5-minute cache write 1.25x base input,
cache read 0.1x base input

"usage": {
  "input_tokens": 2000,
  "cache_creation_input_tokens": 4000,
  "cache_read_input_tokens": 60000,
  "output_tokens": 1500
}`,
    answer: ['0.041', '.041'],
    explanation: "Price each count separately (per million tokens): uncached input 2,000 × 2 = 4,000; cache writes 4,000 × 2 × 1.25 = 10,000; cache reads 60,000 × 2 × 0.1 = 12,000; output 1,500 × 10 = 15,000. Total 41,000 per million = **0.041** units. Common errors: pricing the 60,000 cache reads at the full rate (adds 108,000) or forgetting the write multiplier.",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_COST,
    stem: 'Refer to the exhibit. How many of this request\'s input tokens count toward the input-tokens-per-minute rate limit?',
    exhibit: `"usage": {
  "input_tokens": 300,
  "cache_creation_input_tokens": 1200,
  "cache_read_input_tokens": 48000,
  "output_tokens": 900
}`,
    options: ['1,500', '49,500', '48,300', '300'],
    answer: [0],
    explanation: "The rate-limits page says `input_tokens` and `cache_creation_input_tokens` count toward the input-tokens-per-minute limit and `cache_read_input_tokens` does not: 300 + 1,200 = 1,500. 49,500 is the total input, which matters for the context window and for billing, not for this limit. 48,300 wrongly counts reads and leaves out writes, and 300 leaves out the cache write.",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_TIER,
    stem: 'An engineer sets display: "omitted" on the thinking configuration to cut the agent\'s bill. What actually changes?',
    options: ['Thinking text is no longer returned and the first text token can arrive sooner, but the thinking tokens are still generated and billed as output', 'Thinking tokens stop counting toward max_tokens', 'Thinking is turned off, so output tokens fall to the visible text only', 'The thinking is billed at the input rate instead of the output rate'],
    answer: [0],
    explanation: "The thinking page says that with `display: \"omitted\"` you are still charged for the full thinking tokens: omitting reduces latency (the server skips streaming the thinking text), not cost. Thinking still counts toward `max_tokens`, it is not turned off, and generated thinking is billed as output. To spend less on thinking, lower the effort level.",
  },
  { topic: '4.3', type: 'match', difficulty: 2, lesson: L_TIER,
    stem: 'Match each workload to the choice that fits it best.',
    pairs: [
      ['Classify 20,000 incoming alerts a day into five queues', 'Small model tier at low effort'],
      ['Plan a multi-site investigation where the evidence conflicts', 'Large model tier at its default effort or higher'],
      ['Re-grade last week\'s eval transcripts with a model grader', 'Message Batches API'],
      ['An engineer waits for a long diagnosis report to appear', 'Streaming the response'],
    ],
    explanation: "High-volume classification with a checkable answer is what the small tier and low effort are for (the effort page lists `low` for simpler, speed-sensitive work and Haiku's guidance names classification and routing). Planning with conflicting evidence is where errors compound, so it gets the strong model. Re-grading nobody waits for fits the Batch API at half price. A long report someone is watching should stream for perceived latency, and the SDK requires streaming for very long requests anyway.",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_COST,
    stem: 'Refer to the exhibit. Strategy C runs the evidence-gathering calls on a small model and only the final diagnosis on a large one. Why does the final call pay full price for its whole 15,400-token input?',
    exhibit: `Strategy C, one run (caching on for the small-model calls)
calls 1-5  small model   inputs 6,400 ... 13,600   mostly cache reads
call 6     large model   input 15,400              no cache read, no breakpoint`,
    options: ['Prompt caches are per model, so the large model has no cached prefix from the small model\'s calls; a breakpoint on a one-off call would only add a write premium', 'The large model does not support prompt caching', 'Final calls are never cached because they end with end_turn', 'Cache entries expire as soon as the model changes stop_reason'],
    answer: [0],
    explanation: "A cache is tied to the model: Domain 3's invalidation table lists a different model as invalidating everything. The first request to the large model therefore starts cold. Adding a breakpoint there would write at 1.25× and never be read, so the call is sent uncached. The large model does support caching, and stop reasons have nothing to do with cache lifetime. This is why model switches belong at the edges of a run.",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_TIER,
    stem: 'Refer to the exhibit. After moving to a newer Claude model, this request returns HTTP 400. What is the right fix?',
    exhibit: `client.messages.create(
    model=NEW_MODEL,
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=messages,
)`,
    options: ['Replace the fixed budget with adaptive thinking (or omit thinking where it is on by default) and control depth with output_config.effort', 'Lower budget_tokens below 4,000', 'Move budget_tokens into output_config', 'Retry with backoff; 400 errors are transient'],
    answer: [0],
    explanation: "Extended thinking with `budget_tokens` is documented as legacy and deprecated, and Claude 4.7 and later models reject it with a 400 whose message points to `thinking.type.adaptive` and `output_config.effort`. A smaller budget is still the rejected mode. `output_config` holds settings such as `effort` (and, in beta, `task_budget`), not `budget_tokens`. A 400 is a request error: it fails the same way on every retry.",
  },
  { topic: '4.3', type: 'single', difficulty: 3, lesson: L_COST,
    stem: 'Refer to the exhibit. Which configuration has the lowest cost per completed task?',
    exhibit: `Config  Cost per 1,000 runs (units)   Pass rate on the eval set
A       76.4                           95%
B       35.25                          95%
C       25.9                           60%`,
    options: ['B', 'C', 'A', 'B and C are equal'],
    answer: [0],
    explanation: "Cost per completed task = cost per run ÷ pass rate: A 76.4 / 0.95 ≈ 80.4; B 35.25 / 0.95 ≈ 37.1; C 25.9 / 0.60 ≈ 43.2 per 1,000 completed tasks. C is cheapest per run but fails so often that each success costs more than with B, before counting the cost of the failures downstream. Anthropic's cost-optimization page recommends exactly this comparison: per completed task, not per token or per run.",
  },
  { topic: '4.3', type: 'multi', difficulty: 2, lesson: L_BATCH,
    stem: 'Which two statements about the Claude Message Batches API are correct as documented? (Choose two.)',
    options: ['All usage in a batch is charged at 50% of standard prices, and the discount stacks with prompt caching', 'Results can come back in any order, so each result must be matched by its custom_id', 'Requests may set stream: true to receive results as they are generated', 'Every batch is guaranteed to finish within one hour', 'A multi-step loop with client tools can run inside one batch request'],
    answer: [0, 1],
    explanation: "The batch page says usage is charged at 50% (the pricing page says it combines with caching) and that order is not guaranteed, so use meaningful `custom_id` values. `stream: true` is listed among parameters rejected in batches. Most batches finish in under an hour, but the window is up to 24 hours, after which unprocessed requests expire. A batch request is one Messages request: a client-tool loop needs your tool results between steps, so each step would be a new batch round trip (this course's reasoning from that fact; the batch page documents that server tools, by contrast, run their loop inside the request).",
  },
  { topic: '4.3', type: 'single', difficulty: 1, lesson: L_BATCH,
    stem: 'Which of these Example Corp workloads is the best fit for the Message Batches API?',
    options: ['Tagging the root cause of 3,000 closed tickets overnight, one request per ticket', 'Diagnosing a site outage while the on-call engineer waits', 'An interactive chat with a junior engineer about a VLAN problem', 'A six-step investigation with client tools that a user is watching'],
    answer: [0],
    explanation: "Batching suits work nobody waits for, in independent single requests: the cost page names evaluation runs, backfills and scheduled jobs. The overnight tagging job is exactly that, at half price. An outage and an interactive chat need answers in seconds, while batches may take up to 24 hours. A watched multi-step client-tool loop is interactive, and in a batch each step would need its own round trip (this course's reasoning: each batch item is one Messages request).",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_TIER,
    stem: 'Which statement about output_config.effort is correct according to the Claude effort documentation?',
    options: ['It affects all output tokens, including tool calls and thinking, and is a behavioural signal rather than a strict token budget', 'It is a hard cap on thinking tokens for each request', 'It only affects thinking and has no effect on tool calls or text', 'Every model defaults to the same effort level'],
    answer: [0],
    explanation: "The effort page says effort affects all tokens in the response (text, tool calls and their arguments, thinking), that lower effort means fewer and terser tool calls, and that it is a behavioural signal, not a strict token budget: the hard per-request cap is `max_tokens`. Defaults differ: most models default to `high`, and the page lists two current models that default to `medium`.",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_BATCH,
    stem: 'Refer to the exhibit. These are all six result lines of one Message Batch, shown as an excerpt: `...` marks fields left out, so the lines are not complete JSON. For how many requests are you billed?',
    exhibit: `{"custom_id": "T1-trial-1", "result": {"type": "succeeded", ...}}
{"custom_id": "T1-trial-2", "result": {"type": "errored", ...}}
{"custom_id": "T2-trial-1", "result": {"type": "succeeded", ...}}
{"custom_id": "T3-trial-1", "result": {"type": "expired"}}
{"custom_id": "T3-trial-2", "result": {"type": "canceled"}}
{"custom_id": "T4-trial-1", "result": {"type": "succeeded", ...}}`,
    options: ['3', '6', '4', '5'],
    answer: [0],
    explanation: "The batch page lists four result types and says you are not billed for `errored`, `canceled` or `expired` requests. Only the three `succeeded` results are billed. Resubmit the other three (fixing the request first if the error was an `invalid_request_error`).",
  },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L_BATCH,
    stem: 'Refer to the exhibit. An engineer is waiting for this long report. The Python SDK raises a ValueError before sending anything. What is the right fix?',
    exhibit: `response = client.messages.create(
    model=LARGE_MODEL, max_tokens=128000, tools=TOOLS, messages=messages)`,
    options: ['Stream the request with client.messages.stream(...), printing text as it arrives and calling get_final_message() for the complete Message', 'Set max_retries=0 so the SDK does not wait', 'Submit the request through the Message Batches API', 'Lower max_tokens to 1,024 so the answer is short'],
    answer: [0],
    explanation: "The Python SDK raises a `ValueError` when a non-streaming request is expected to take longer than about 10 minutes, and the errors page recommends streaming for long requests because idle connections can be dropped. Streaming also shows the engineer progress at once, and `get_final_message()` returns the same `Message` object a non-streaming call would. Retries have nothing to do with the check. Batch is a documented alternative for long requests, but not when someone is waiting. Cutting `max_tokens` that far would truncate the report (and its thinking).",
  },
  // ---------- 4.4 Handling failures ----------
  { topic: '4.4', type: 'match', difficulty: 2, lesson: L_RETRY,
    stem: 'Match each Claude API error your agent receives to the right action.',
    pairs: [
      ['429 rate_limit_error with a retry-after: 20 header', 'Wait 20 seconds, then retry'],
      ['429 rate_limit_error, error_code enforced_spend_limit_reached, no retry-after', 'Stop and alert a human: retries fail until access resumes'],
      ['400 invalid_request_error "prompt is too long"', 'Shrink the request; do not retry it unchanged'],
      ['529 overloaded_error', 'Retry with exponential backoff and jitter'],
      ['401 authentication_error', 'Fix the API key configuration'],
    ],
    explanation: "A 429 with `retry-after` tells you how long to wait. The tier spend-cap 429 has no `retry-after` and `error.details.error_code` `enforced_spend_limit_reached`; the rate-limits page says retrying, including the SDK's retries, fails until access resumes. A 400 is a problem with the request itself. A 529 is transient overload, retried with backoff. A 401 means the key is malformed, revoked or expired, and retrying cannot fix it.",
  },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L_RETRY,
    stem: 'Refer to the exhibit. Which two problems does this retry loop have? (Choose two.)',
    exhibit: `1  def call_with_retry(params):
2      for attempt in range(10):
3          try:
4              return client.messages.create(**params)
5          except anthropic.APIStatusError:
6              time.sleep(2 ** attempt)
7      raise RuntimeError("gave up")`,
    options: ['It retries errors such as 400 and 401 that will fail the same way every time', 'Clients that fail at the same moment retry at the same moments, because the delay has no jitter', 'It never retries 529 overloaded errors', 'It catches connection errors and timeouts as well as status errors', 'Its delay is capped too low to let an overload clear'],
    answer: [0, 1],
    explanation: "Line 5 catches every `APIStatusError` without checking the status, so non-retryable 4xx errors are retried up to ten times. Line 6 waits exactly 2^attempt seconds, so synchronized failures retry in lockstep; add random jitter. The loop does retry 529 (it is an `APIStatusError`). It does not catch connection errors or timeouts, which are `APIConnectionError`, not `APIStatusError`. The delay has no cap at all (up to 512 seconds), the opposite of too low. It also ignores `retry-after` and stacks on the SDK's own retries, but those are not among the options.",
  },
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L_RETRY,
    stem: 'Refer to the exhibit. During an outage every request returns 529. In the worst case, how many HTTP requests does one call to call_model send? Enter a number.',
    exhibit: `client = anthropic.Anthropic()          # SDK defaults, max_retries=2

def call_model(params):
    for attempt in range(3):            # our own wrapper: 3 attempts
        try:
            return client.messages.create(**params)
        except anthropic.APIStatusError:
            time.sleep(2 ** attempt)
    raise RuntimeError("model unavailable")`,
    answer: ['9', 'nine'],
    explanation: "Each `messages.create` sends one request plus up to two SDK retries (the SDK retries 5xx, and `max_retries` defaults to 2): 3 HTTP requests. The wrapper makes 3 attempts: 3 × 3 = **9**. Across a 12-call run that is up to 108 requests, which adds load exactly when the service is overloaded. Decide retries in one layer: either keep the SDK's and drop the wrapper, or set `max_retries=0` and write a proper policy.",
  },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L_RETRY,
    stem: 'A triage call should fail fast during an incident instead of waiting through retries, while every other call keeps the SDK\'s retry behaviour. What is the simplest way to do that with the Anthropic Python SDK?',
    options: ['Call that request through client.with_options(max_retries=0, timeout=20.0)', 'Create the client with max_retries=0 and add retries back by hand everywhere else', 'Catch RateLimitError and call the API again immediately', 'Set ANTHROPIC_LOG=info'],
    answer: [0],
    explanation: "The Python SDK page shows `max_retries` and `timeout` set on the client or per request through `with_options`, which returns a copy with those options. That changes only the triage call. Disabling retries for the whole client and rebuilding them by hand is more work and easy to get wrong. Retrying immediately on a 429 ignores `retry-after`. `ANTHROPIC_LOG` only turns on logging.",
  },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L_RETRY,
    stem: 'Refer to the exhibit. A nightly job sent 3,000 requests in the first few seconds after 02:00 and now receives errors like this one. What should the job do?',
    exhibit: `HTTP 429
retry-after: 15

{"type": "error",
 "error": {"type": "rate_limit_error",
           "message": "...",
           "details": {"error_code": "ramp_limit_exceeded"}},
 "request_id": "req_example05"}`,
    options: ['Wait at least 15 seconds, then resume at a rate that succeeds and raise it gradually, spreading requests instead of sending them all at once', 'Retry all failed requests immediately in parallel', 'Stop until next month; this is the spend cap', 'Treat it as a request error and fix the payload'],
    answer: [0],
    explanation: "`ramp_limit_exceeded` marks a ramp limit: a sharp rise in usage, which a burst within a few seconds can trigger even under the per-minute limits. The rate-limits page says to wait at least the `retry-after`, hold traffic where requests succeed, increase by at most one step per minute, and start bulk jobs slowly. An immediate parallel retry repeats the burst. The spend-cap 429 has a different `error_code` and no `retry-after`. Nothing is wrong with the payload. (For a job like this, the Message Batches API is an option too; it is not subject to ramp limits.)",
  },
  { topic: '4.4', type: 'single', difficulty: 3, lesson: L_RETRY,
    stem: 'Refer to the exhibit. The streamed response started with HTTP 200 and some text, then this event arrived. What should the agent\'s code do?',
    exhibit: `event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}`,
    options: ['Treat it as a failed request (the streaming equivalent of a 529) and retry with backoff, or resume from the received text with a user message asking the model to continue', 'Treat the text received so far as the final answer, because the status was 200', 'Handle it as a refusal stop reason', 'Raise max_tokens and continue the stream'],
    answer: [0],
    explanation: "The streaming page says errors can arrive in the event stream after a 200, and gives `overloaded_error` as the example that would be a 529 without streaming. The request did not complete, so the partial text is not an answer. You can retry, or recover from the last text block; on Claude 4.6 and later models the documented recovery is a user message with the partial response and an instruction to continue (tool-use and thinking blocks cannot be partially recovered). It is not a refusal, and `max_tokens` is unrelated.",
  },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L_SAFE,
    stem: 'Refer to the exhibit. What change prevents this from happening again?',
    exhibit: `02:14:05  tool=open_ticket  device=sw-core-01.example.com  severity=P1
02:14:35  tool=open_ticket  timeout after 30 s; wrapper retries
02:14:36  tool=open_ticket  status=opened ticket_id=INC-2210
02:15:10  ticket system: INC-2209 opened at 02:14:31 (same device, P1)`,
    options: ['Give the tool an idempotency key built from the run id and stable fields, so a repeat returns the existing ticket instead of opening another', 'Lower the tool timeout to 5 seconds', 'Tell the model in the system prompt never to open two tickets', 'Stop retrying model calls'],
    answer: [0],
    explanation: "The first attempt succeeded on the ticket system (INC-2209) but timed out on the agent's side, so the retry opened a second ticket. An idempotency key on stable fields (run id, device, severity) lets the tool or the ticket system recognize the repeat and return INC-2209. A shorter timeout makes this more frequent, not less. The model did not ask twice; the wrapper did, so a prompt rule cannot help. Model calls have no side effects and were not the cause.",
  },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L_SAFE,
    stem: 'Refer to the exhibit. The model retries this tool after a timeout and sometimes rewords the summary. What is the flaw?',
    exhibit: `def open_ticket(run_id, device, severity, summary):
    key = sha256(json.dumps([run_id, device, severity, summary]).encode()).hexdigest()
    if key in store:
        return {"status": "already_open", **store[key]}
    ticket = create_ticket(device, severity, summary)
    store[key] = ticket
    return {"status": "opened", **ticket}`,
    options: ['The key includes the free-text summary, so a reworded retry gets a new key and opens a second ticket; key on stable fields only', 'SHA-256 is too slow for an idempotency key', 'Returning already_open will confuse the model', 'The check must happen after create_ticket, not before'],
    answer: [0],
    explanation: "An idempotency key must be the same for every attempt at the same intended action. The model rewords summaries between attempts, so including the summary defeats the check. Key on run id, device and severity. Hashing speed is irrelevant here. Returning `already_open` with the ticket id is the helpful behaviour: it tells the model the action is done. Checking after creating would create the duplicate first.",
  },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L_SAFE,
    stem: 'Refer to the exhibit. A change agent behind an approval gate may have a call repeated after a timeout. Which tool is safe to repeat, and why?',
    exhibit: `Tool A: bounce_port(device, interface)
        Shuts the port, waits 5 seconds, enables it again.

Tool B: set_port_admin_state(device, interface, state)
        state is "up" or "down". Returns the state before and after.`,
    options: ['Tool B: it is declarative, so a repeat with the same state leaves the port as it was after the first call', 'Tool A: it always ends with the port enabled', 'Both: any tool behind an approval gate is idempotent', 'Neither can be made safe to repeat'],
    answer: [0],
    explanation: "\"Ensure the port is down\" has the same effect however many times it runs, and returning the before and after state tells the model what happened. A bounce is an action, not a state: each repeat causes another outage on the port, even though the final state matches. An approval gate controls whether a call runs, not what a repeated call does. Declarative design (plus idempotency keys) makes repeats safe.",
  },
  { topic: '4.4', type: 'order', difficulty: 2, lesson: L_SAFE,
    stem: 'A change agent asks to run a state-changing tool. Put the steps of a safe approval gate in order.',
    items: ['The model returns a tool_use block for the change tool', 'The loop pauses before executing the call', 'The tool runs with dry_run=True and the loop shows the engineer the exact call and the dry-run result', 'The engineer approves, and the approval is recorded with who and when', 'The tool runs for real with its idempotency key', 'The loop returns the tool_result to the model and continues'],
    explanation: "The gate sits in code between the model's request and execution: pause, show the exact effect with a dry run, record an explicit approval, then execute once (the idempotency key makes a retried execution harmless) and report the result back so the model can continue. Putting approval anywhere after execution defeats it. Domain 5 builds this out.",
  },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L_SAFE,
    stem: 'Which two statements about limits on Claude agent runs are correct as documented? (Choose two.)',
    options: ['A task budget set in output_config.task_budget is advisory: the model paces itself against it but may exceed it', 'max_tokens is a hard cap on one request\'s output, thinking included', 'max_tokens caps the total output of the whole agent loop', 'output_config.effort is a hard token budget per request', 'Reaching a spend limit you set in the Console returns a 429 with retry-after'],
    answer: [0, 1],
    explanation: "The task budgets page (beta) calls them a soft hint, not a hard cap, with `max_tokens` as the enforced per-request limit. The cost-control section says `max_tokens` caps total output for the request, thinking and text combined, and that each request in a loop has its own `max_tokens`, so it does not bound the whole turn. Effort is a behavioural signal, not a budget. A spend limit you set returns HTTP 400 `invalid_request_error`, not a 429.",
  },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L_SAFE,
    stem: 'Refer to the exhibit. The on-call engineer who received this hand-off had to rerun every check. What should it have included?',
    exhibit: `{"status": "needs_human", "message": "Site B seems to be down, please take a look."}`,
    options: ['What was checked with the key findings, what failed (with errors and request ids), the current hypothesis and confidence, the proposed next step, what was not done, and where the transcript is', 'The agent\'s full system prompt and tool definitions', 'An apology and a severity guess only', 'Nothing more: engineers should always recheck from scratch'],
    answer: [0],
    explanation: "A useful hand-off lets the engineer continue where the agent stopped: evidence gathered, attempts that failed and why, the working hypothesis, a proposed next step, an explicit statement of what was not done (no changes, no notices) and a pointer to the full transcript. The system prompt and tool definitions are the same on every run and do not describe this incident. A bare severity guess is the problem shown in the exhibit.",
  },
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L_SAFE,
    stem: 'Refer to the exhibit. How many model calls are made before the budget stops the run? Enter a number.',
    exhibit: `budget = RunBudget(max_steps=8, max_tokens=60_000)

def before_call(self):              # runs before every model call
    for name, limit in self.limits.items():
        if self.used[name] >= limit:
            raise BudgetExceeded(name)

Tokens charged after each call (input + output):
call 1: 11,000   call 2: 15,000   call 3: 19,000   call 4: 23,000   call 5: 27,000`,
    answer: ['4', 'four'],
    explanation: "Running totals: 11,000 after call 1, 26,000 after call 2, 45,000 after call 3. Before call 4 the total (45,000) is below 60,000, so call 4 runs and the total becomes 68,000. Before call 5, 68,000 ≥ 60,000, so the budget raises. **4** calls run, and the run ends 8,000 tokens over its limit: a check before each call cannot know the next call's size. Leave headroom, or estimate the next request with token counting.",
  },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
