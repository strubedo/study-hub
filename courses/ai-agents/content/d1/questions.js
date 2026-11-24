// Domain 1 — Agent Foundations. Original questions; no vendor or third-party question content.
// Facts checked against vendor documentation on 2026-11-23 (URLs in REVIEW-TODO.md). Every exhibit question was worked from
// its exhibit, and every probability and token sum was recomputed offline with plain Python. API requests, responses, agent
// transcripts and SDK result output in exhibits are written from documented shapes, not captured from live calls.
const L_LOOP = '1.1-agent-loop';
const L_WHEN = '1.1-when-not-to-build';
const L_ANAT = '1.2-request-anatomy';
const L_STOP = '1.2-stop-reasons-context';
const L_OPTS = '1.3-build-options';
const L_OWN = '1.3-what-you-own';

const bank = [
  // ---------- 1.1 What an agent is and when to build one ----------
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L_LOOP,
    stem: 'Refer to the exhibit. How is this design best classified?',
    exhibit: `Nightly backup report, Example Corp
1. A script queries the backup server API for last night's failed jobs.
2. For each failed job, the script reads the job log (last 200 lines).
3. One model call per job labels the failure: "media", "network",
   "credentials" or "other".
4. The script groups jobs by label and makes one more model call that
   writes a summary email for the operations team.
5. The script sends the email. The same steps run every night.`,
    options: ['A workflow: code decides every step and the model fills fixed slots', 'An agent: the model decides which jobs to investigate', 'A single model call with all data pasted into the prompt', 'Not an agentic system, because it makes more than one model call'],
    answer: [0],
    explanation: "The script fixes the order of steps and when each model call happens; the model only labels and writes. Anthropic's \"Building effective agents\" calls this a **workflow**: models and tools orchestrated through predefined code paths. It is not an agent, because the model never chooses the next action or a tool. It is not a single call: there are many calls, made by code. A workflow with several model calls is still an agentic system in Anthropic's terms; the number of calls does not disqualify it.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_LOOP,
    stem: 'Refer to the exhibit. Which design fits this task best?',
    exhibit: `Ticket INC-4471 (Example Corp service desk)
"Since 09:00 some users in building B cannot reach the HR portal.
Others in the same building can. No changes were scheduled."

Available read-only tools: get_interface_status, search_syslog,
get_arp_entry, get_dhcp_lease, traceroute_from, get_fw_policy_hits

The cause could be DHCP, ARP, routing, a firewall rule or the portal
itself; which checks are needed depends on what each check shows.`,
    options: ['An agent that chooses which read-only tool to call next, with an iteration limit', 'A single model call with the ticket text', 'A fixed workflow that runs all six tools in a set order every time', 'A script with no model, because the tools already exist'],
    answer: [0],
    explanation: "The path depends on intermediate findings and the number of steps cannot be predicted: Anthropic's guidance says agents suit open-ended problems where you cannot hardcode a fixed path. The tools are read-only, so a wrong step costs tokens, not an outage, and the iteration limit bounds the run. A single call has no evidence to work from. A fixed workflow that always runs all six tools wastes work and still needs someone to interpret results in an order that depends on them. A script alone cannot decide which result matters.",
  },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L_WHEN,
    stem: 'Refer to the exhibit. Which design should Example Corp use?',
    exhibit: `Request from the change advisory board:
"For each change ticket we already export the description, the
implementation plan and the rollback plan as one text file. We want a
three-line plain-language summary at the top of each ticket."

- Volume: about 40 tickets a week
- No other systems need to be queried
- A person reviews each summary before the meeting`,
    options: ['A single model call per ticket with the exported text in the prompt', 'An agent with tools to read the ticket system and the CMDB', 'A two-stage workflow that first classifies the ticket and then summarizes it', 'A hosted managed agent with a sandbox'],
    answer: [0],
    explanation: "All the information is already in hand and the output is a summary: the simplest design, one call per ticket, does the job. Anthropic's tool-use guidance says tool use does not fit when the model can answer from what it already has, such as summarization. An agent or a hosted sandbox adds cost, latency and risk with nothing to fetch. A classification stage adds a call without a stated need.",
  },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L_WHEN,
    stem: 'Match each Example Corp task to the design that fits it best.',
    pairs: [
      ['Convert a CSV export of 3,000 DHCP leases into the IPAM import format, column for column', 'A script with no model'],
      ['Rewrite one pasted outage timeline as a customer-facing status update', 'A single model call'],
      ['Every night, pull new tickets, label each by category, then route each label to a fixed queue', 'A workflow (code decides the steps)'],
      ['Find out why a remote site\'s VPN tunnel keeps flapping, checking whatever the evidence points to next', 'An agent with read-only tools and an iteration limit'],
    ],
    explanation: "A column-for-column format conversion is deterministic: a script is exact and cheaper than any model. Rewriting text you already have is one call. Labelling then routing on fixed rules is a workflow: code owns the sequence and the model fills one slot. An open-ended investigation whose next check depends on the last result is the case Anthropic's guidance reserves for agents.",
  },
  { topic: '1.1', type: 'order', difficulty: 1, lesson: L_LOOP,
    stem: 'An agent built on the Claude Messages API answers a question with one call to a client tool you wrote. Put the events in order.',
    items: ['Your code sends the goal, system prompt and tool definitions', 'The model responds with stop_reason "tool_use" and a tool_use block', 'Your code validates the input and runs the tool', 'Your code appends the response as an assistant message and a tool_result as a user message, then sends the request again', 'The model responds with stop_reason "end_turn" and a text answer'],
    explanation: "This is the canonical loop from Anthropic's \"How tool use works\": request with tools, `tool_use` response, your code runs the tool, the results go back in a new request containing the full history, and the loop ends on a stop reason other than `tool_use`, here `end_turn`. The model never runs the tool itself.",
  },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L_LOOP,
    stem: "In Anthropic's \"Building effective agents\", what separates an agent from a workflow?",
    options: ['In an agent the model dynamically directs its own process and tool use; in a workflow, predefined code paths orchestrate the model and tools', 'An agent uses tools; a workflow never uses tools', 'An agent uses more than one model; a workflow uses one model', 'An agent runs on the provider\'s infrastructure; a workflow runs on yours'],
    answer: [0],
    explanation: "The article defines workflows as systems where LLMs and tools are orchestrated through predefined code paths, and agents as systems where LLMs dynamically direct their own processes and tool usage. Workflows can call tools too (the augmented LLM is the building block of both). The number of models and where the code runs are not the distinction; you can run either kind on your own servers.",
  },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L_LOOP,
    stem: 'Which two statements about the agent loop are true? (Choose two.)',
    options: ['For tools you define, your application runs the tool and returns the result; the model only emits a structured request', 'The loop needs a stopping condition you control, such as a maximum number of iterations, in addition to the model deciding it is done', 'The model executes client tools inside its own context once their definitions are sent', 'Once the model has answered, it keeps the conversation, so later requests need only the newest message', 'An agent loop always ends after exactly one tool call'],
    answer: [0, 1],
    explanation: "Anthropic's docs state that the model never runs anything on its own: it emits a request and your code (or Anthropic's servers, for server tools) runs it. \"Building effective agents\" recommends stopping conditions such as a maximum number of iterations. The model does not execute client tools. The Messages API is stateless by default, so each request carries the full history. A loop runs until a final answer or a limit, often through many tool calls.",
  },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L_WHEN,
    stem: 'Refer to the exhibit. Assume the steps succeed or fail independently and every step must succeed for the run to succeed. What is the expected end-to-end success rate, as a whole-number percentage?',
    exhibit: `Change-preparation agent, measured per-step success over 500 runs
Step  Action                                   Success rate
1     Read the change ticket                    99%
2     Fetch current config section              95%
3     Draft the proposed config                 98%
4     Validate the draft against the template   90%`,
    answer: ['83', '83%', '83 %', '83 percent'],
    explanation: "Multiply the per-step rates: 0.99 × 0.95 × 0.98 × 0.90 = 0.8295, about **83%**. Even with every step at 90% or better, the chain fails about one run in six. The independence assumption is a simplification: a validation step that catches a bad draft and retries can raise the real figure, and one early error can also derail later steps.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_WHEN,
    stem: 'Refer to the exhibit. Which design meets every constraint?',
    exhibit: `Requirement: a chat command "/vlan <id>" returns the VLAN name, the
switches that carry it and the gateway IP, as a short sentence.

Constraints
- Answer within 3 seconds
- Same data sources every time: the IPAM API and the switch inventory API
- Cost must be predictable per request

Design options
A  Agent with both APIs as tools, up to 8 iterations
B  Code queries both APIs, then one model call writes the sentence
C  Hosted managed agent with a cloud sandbox and both APIs as MCP tools
D  Two agents: one per API, plus a coordinating agent`,
    options: ['B', 'A', 'C', 'D'],
    answer: [0],
    explanation: "The steps are fixed (query both APIs, then phrase the answer), so code should decide them: design B is a workflow with exactly one model call, giving predictable cost and the lowest latency. Design A makes several sequential round trips, so variable cost and likely more than 3 seconds. A hosted agent with a sandbox (C) adds setup and latency for no benefit. Multiple agents (D) multiply calls and cost for a lookup.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_WHEN,
    stem: 'Refer to the exhibit. The tool results are about the same size on every iteration. Why does input_tokens keep growing?',
    exhibit: `Agent run log (Claude Messages API, no prompt caching)
request  stop_reason  input_tokens  output_tokens
1        tool_use     1300          95
2        tool_use     2900          102
3        tool_use     4500          98
4        tool_use     6100          101
5        end_turn     7700          240`,
    options: ['Each request resends the system prompt, tool definitions and the whole conversation, including every earlier tool call and result', 'The model\'s thinking from earlier turns is billed again as output', 'The API adds a fixed surcharge of 1,600 tokens per tool call', 'max_tokens is raised automatically after each tool_use response'],
    answer: [0],
    explanation: "The Messages API is stateless by default, so the loop sends the full history every time. Each iteration adds one tool call and one result (about 1,600 tokens here), so input grows linearly per request and the total across the run (22,500 tokens) grows faster than the number of steps. Output tokens stay roughly flat, so this is not output being re-billed. There is no per-call surcharge and `max_tokens` is whatever your code sends.",
  },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L_WHEN,
    stem: 'An Example Corp agent that prepares firewall rule changes succeeds in about 60% of test runs. Each run takes 10 to 12 steps. Which two changes most directly reduce compounding errors? (Choose two.)',
    options: ['Combine related lookups into fewer, richer read-only tools so a run needs fewer steps', 'Add a validation tool after the draft step whose error message tells the model what to fix', 'Raise the iteration limit from 12 to 40', 'Give the agent write access so it can test rules on the production firewall', 'Lower max_tokens so that each response is shorter'],
    answer: [0, 1],
    explanation: "End-to-end success falls roughly as per-step success to the power of the number of steps, so fewer steps help directly, and a verification step with an instructive error lets the model catch and correct a mistake instead of carrying it forward. A higher iteration limit only lets a failing run go on longer. Production write access adds risk, not reliability. Shorter responses risk `max_tokens` truncation and do nothing for step accuracy.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_LOOP,
    stem: "In Google's Agent Development Kit, SequentialAgent, ParallelAgent and LoopAgent are described as workflow agents. In the terms of Anthropic's workflow-versus-agent distinction, what are they?",
    options: ['Deterministic controllers: code, not the model, decides which sub-agent runs next', 'Agents in which the model plans its own steps', 'Hosted agents that Google runs in a sandbox', 'Tool runners that convert Python functions into tool schemas'],
    answer: [0],
    explanation: "ADK's overview says agents can use a model (`LlmAgent`) for reasoning or act as deterministic controllers of execution, called workflow agents: `SequentialAgent`, `ParallelAgent` and `LoopAgent`. Fixed control flow decided by code is exactly Anthropic's definition of a workflow. They are not model-directed, not a hosted service, and not a schema helper. (ADK now marks these three template classes as deprecated in favour of graph-based workflows; the classification is the same either way.)",
  },
  { topic: '1.1', type: 'single', difficulty: 3, lesson: L_WHEN,
    stem: 'Refer to the exhibit. The team merges tools so that the same task needs 6 steps instead of 12, with per-step success unchanged. Assuming independent steps, what is the new estimated end-to-end success rate?',
    exhibit: `Agent evaluation, 200 tasks
Average steps per run:      12
Measured per-step success:  97%
Estimated end-to-end:       0.97^12 = 69%`,
    options: ['About 83%', 'About 69%', 'About 94%', 'About 97%'],
    answer: [0],
    explanation: "0.97 to the power 6 = 0.833, about **83%**, up from 0.97^12 = 0.694. Halving the steps does not double reliability, but it removes half the chances to fail. 69% is the old figure; 94% would be 0.97^2; 97% is a single step.",
  },

  // ---------- 1.2 Anatomy of an agent request ----------
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L_STOP,
    stem: 'Refer to the exhibit. The stop_reason value has been replaced with ????. What value does the API return in this response? Enter the exact string.',
    exhibit: `{
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "I'll look up the ARP entry on the core switch."},
    {"type": "tool_use", "id": "toolu_01EXAMPLE", "name": "get_arp_entry",
     "input": {"device": "sw-core-01.example.com", "ip": "10.20.30.41"}}
  ],
  "stop_reason": "????",
  "stop_sequence": null,
  "usage": {"input_tokens": 811, "output_tokens": 63}
}`,
    answer: ['tool_use'],
    explanation: "The response ends with a complete `tool_use` block and the model is waiting for the result, so the stop reason is `tool_use`. Your loop runs `get_arp_entry`, appends this content as an assistant message and sends a `tool_result` with `tool_use_id` set to the block's id.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_STOP,
    stem: 'Refer to the exhibit. What should the loop do next?',
    exhibit: `{
  "type": "message",
  "role": "assistant",
  "content": [
    {"type": "text", "text": "I'll collect the running config for all twelve access switches so I can compare the uplink settings. Starting with sw-access-01, sw-access-02, sw-access-03, sw-access-04, sw-access-05, sw-acc"}
  ],
  "stop_reason": "max_tokens",
  "stop_sequence": null,
  "usage": {"input_tokens": 2140, "output_tokens": 40}
}

Request settings: max_tokens = 40`,
    options: ['Treat the response as incomplete and resend the request with a higher max_tokens', 'Return the text to the user as the final answer, because there is no tool_use block', 'Run get_config for the switches named so far, since the model clearly intended to', 'Resend the content unchanged as an assistant message with no new user message, as for pause_turn'],
    answer: [0],
    explanation: "`max_tokens` means the response hit your output limit and is cut off mid-sentence; the model never got to emit its tool call. Anthropic's guide says to raise `max_tokens` or continue the response, and specifically to retry with a higher limit when a tool call is incomplete. It is not a final answer. Running tools the model has not requested is guessing. The resend-without-a-user-message pattern belongs to `pause_turn`, which comes from server-tool loops; ending the history on a partial assistant message is a prefill, which Anthropic's docs say returns a 400 error on Claude 4.6 and later models. (The guide's other documented way to continue is to append the partial text as an assistant message followed by a user message asking the model to continue.)",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ANAT,
    stem: 'Refer to the exhibit. The agent ran the requested tool, which returned the text "admin up, oper down, last change 00:02:11". What must the next entry in messages be?',
    exhibit: `messages = [
  {"role": "user",
   "content": "Why is the printer on sw-access-07 Gi1/0/12 offline?"},
  {"role": "assistant", "content": [
     {"type": "text", "text": "Checking the port."},
     {"type": "tool_use", "id": "toolu_01EXAMPLE",
      "name": "get_interface_status",
      "input": {"device": "sw-access-07.example.com",
                "interface": "GigabitEthernet1/0/12"}}]}
]`,
    options: ['{"role": "user", "content": [{"type": "tool_result", "tool_use_id": "toolu_01EXAMPLE", "content": "admin up, oper down, last change 00:02:11"}]}', '{"role": "tool", "tool_use_id": "toolu_01EXAMPLE", "content": "admin up, oper down, last change 00:02:11"}', '{"role": "assistant", "content": [{"type": "tool_result", "tool_use_id": "toolu_01EXAMPLE", "content": "admin up, oper down, last change 00:02:11"}]}', '{"role": "user", "content": [{"type": "text", "text": "Here is the result:"}, {"type": "tool_result", "tool_use_id": "toolu_01EXAMPLE", "content": "admin up, oper down, last change 00:02:11"}]}'],
    answer: [0],
    explanation: "Claude expects tool results as `tool_result` blocks inside a **user** message, immediately after the assistant message with the call, matched by `tool_use_id`. The Claude API has no `tool` role (that pattern belongs to other APIs). Results never go in an assistant message. Putting text **before** the `tool_result` block breaks the rule that results come first in the content array; the docs show it causing a 400 error.",
  },
  { topic: '1.2', type: 'order', difficulty: 2, lesson: L_ANAT,
    stem: 'An agent on the Claude Messages API answers after calling search_syslog and then get_config_section, one at a time. Put the entries of the final messages list in order, oldest first.',
    items: ['user: the goal ("Why did BGP to 192.0.2.1 reset at 03:10?")', 'assistant: text plus a tool_use block for search_syslog', 'user: a tool_result block for the search_syslog call', 'assistant: a tool_use block for get_config_section', 'user: a tool_result block for the get_config_section call', 'assistant: the final text answer (stop_reason "end_turn")'],
    explanation: "Roles alternate. Each assistant turn that calls a tool is followed immediately by a user turn carrying the matching `tool_result`. The final assistant turn has no tool call; its response's stop reason is `end_turn`. The system prompt is not in this list: it is the separate top-level `system` parameter.",
  },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L_STOP,
    stem: 'Refer to the exhibit. The loop never finishes correctly: the second request fails with an error. Which line number contains the bug? Enter the number only.',
    exhibit: `1   def run_agent(goal):
2       messages = [{"role": "user", "content": goal}]
3       for _ in range(MAX_ITERATIONS):
4           response = client.messages.create(model=MODEL, max_tokens=1024,
5                                             tools=TOOLS, messages=messages)
6           if response.stop_reason != "tool_use":
7               return response
8           messages.append({"role": "assistant", "content": response.content})
9           results = []
10          for block in response.content:
11              if block.type == "tool_use":
12                  content, failed = run_tool(block.name, block.input)
13                  results.append({"type": "tool_result", "tool_use_id": block.id,
14                                  "content": content, "is_error": failed})
15          messages.append({"role": "assistant", "content": results})
16      raise RuntimeError("iteration limit reached")`,
    answer: ['15', 'line 15'],
    explanation: "Line 15 sends the tool results with role `assistant`. Tool results must go back in a **user** message that immediately follows the assistant message containing the calls; as written, the history has two assistant turns in a row and no results answering the `tool_use` ids, which the API rejects. The fix is `{\"role\": \"user\", \"content\": results}`. Every other line matches the documented loop.",
  },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L_ANAT,
    stem: 'Refer to the exhibit. The request is rejected because the tool result cannot be matched to the call it answers. Which field is missing from the tool_result block? Enter the field name.',
    exhibit: `{"role": "assistant", "content": [
  {"type": "tool_use", "id": "toolu_01EXAMPLE", "name": "get_dhcp_lease",
   "input": {"mac": "00:00:5e:00:53:2a"}}]},
{"role": "user", "content": [
  {"type": "tool_result",
   "content": "{\\"ip\\": \\"10.20.31.77\\", \\"expires\\": \\"2026-11-24T09:12:00Z\\"}"}]}`,
    answer: ['tool_use_id'],
    explanation: "A `tool_result` block needs `tool_use_id`, set to the `id` of the `tool_use` block it answers (here `toolu_01EXAMPLE`). `content` is optional and `is_error` is only for failures. When a response has several tool calls, this id is what pairs each result with its call.",
  },
  { topic: '1.2', type: 'match', difficulty: 2, lesson: L_STOP,
    stem: 'Match each Claude Messages API response to what the agent loop should do next.',
    pairs: [
      ['stop_reason "tool_use"; the last block is a complete tool_use for a tool your code implements', 'Run the tool and send its tool_result in the next request'],
      ['stop_reason "pause_turn" while the model was running web searches', 'Resend with the response content as an assistant message, the same tools and no new user message'],
      ['stop_reason "max_tokens" and the last block is an incomplete tool_use', 'Retry the request with a higher max_tokens'],
      ['stop_reason "refusal" with stop_details naming a category', 'End this attempt and apply your refusal policy (for example a fallback model); do not resend it unchanged to the same model'],
      ['stop_reason "end_turn" with a text block', 'Return the answer and leave the loop'],
    ],
    explanation: "These follow Anthropic's stop-reason guide: `tool_use` means run client tools and continue; `pause_turn` means a server-tool loop hit its iteration limit, so send the content back unchanged with no user message; an incomplete tool call after `max_tokens` needs a retry with a higher limit; `refusal` comes with `stop_details` to read, and the guide's recommended handling is a retry on a fallback Claude model (for the `reasoning_extraction` category, change the prompt instead); `end_turn` is a natural finish.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_STOP,
    stem: 'Refer to the exhibit. The agent uses Anthropic\'s server-side web search tool and no client tools. How should the next request be built?',
    exhibit: `Request 1: tools = [web_search server tool]
           messages = [user: "Summarize this week's security advisories
                       for our edge router platform."]

Response 1:
  stop_reason: "pause_turn"
  content: [text, server_tool_use, web_search_tool_result, ...,
            server_tool_use (no result block yet)]`,
    options: ['Append response 1\'s content unchanged as an assistant message and send the same tools with no new user message', 'Append the content as an assistant message, then a user message saying "Please continue"', 'Send a tool_result block for the server_tool_use that has no result', 'Treat the response as final, because pause_turn means the model has finished searching'],
    answer: [0],
    explanation: "`pause_turn` means the server-side loop reached its iteration limit (the guide gives a default of 10 per request) before finishing. To continue, add the response's content unchanged as an assistant message, including any `server_tool_use` block without a result, and send the same tools with **no** user message after it. You never build `tool_result` blocks for server tools; the provider runs them. The turn is not complete, so the content is not a final answer.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_STOP,
    stem: 'Refer to the exhibit. Which statement about this response is correct?',
    exhibit: `HTTP/1.1 200 OK
{
  "type": "message",
  "role": "assistant",
  "content": [],
  "stop_reason": "refusal",
  "stop_details": {
    "type": "refusal",
    "category": "cyber",
    "explanation": "<explanation text>"
  },
  "usage": {"input_tokens": 1903, "output_tokens": 0}
}`,
    options: ['It is a successful response in which the model declined; the loop should stop and handle the refusal using stop_details rather than retry unchanged', 'It is an HTTP error, so the loop should retry with exponential backoff', 'The model is waiting for a tool result, so the loop should continue', 'The response was truncated by max_tokens, so the loop should raise the limit'],
    answer: [0],
    explanation: "A refusal is a stop reason in a normal HTTP 200 response, not an error. `stop_details` gives a category and an explanation (the reference notes the explanation text is not guaranteed to be stable). Retrying the same request with backoff is the pattern for errors such as rate limits. There is no `tool_use` block, and nothing indicates truncation. Anthropic's quick reference says to read `stop_details` and retry on a fallback model (except the `reasoning_extraction` category, where you change the prompt). That is a deliberate policy step in your code, not an automatic resend of the same request to the same model. The exhibit's shape (empty `content`, zero output tokens) matches the refusal example in Anthropic's \"Refusals and fallback\" page.",
  },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L_ANAT,
    stem: 'A response contained three tool_use blocks. Which two statements about the follow-up request are true? (Choose two.)',
    options: ['The user message must contain a tool_result for each of the three tool_use blocks, even if one tool failed', 'The tool_result blocks must come before any text in that user message', 'Each result goes in its own separate user message, one message per tool', 'A failed tool should be left out so the model is not confused', 'The tools array can be omitted on the follow-up request because the model already knows them'],
    answer: [0, 1],
    explanation: "Anthropic's \"Handle tool calls\" page says to add one `tool_result` per `tool_use`, even if the tool failed (use `is_error`), and that in the user message the `tool_result` blocks must come first, with any text after them. All results go in the one user message that immediately follows. Leaving a call unanswered causes an error. The follow-up should send the same `tools`: the API is stateless.",
  },
  { topic: '1.2', type: 'fill', difficulty: 3, lesson: L_WHEN,
    stem: 'Refer to the exhibit. No prompt caching is used. Assume the next tool call is again 50 output tokens and its result again 3,000 tokens. What will input_tokens be for request 4? Enter a number.',
    exhibit: `request  input_tokens  output_tokens  tool result returned after it
1        2000          50             3000 tokens
2        5050          50             3000 tokens
3        8100          50             3000 tokens
4        ?`,
    answer: ['11150', '11,150', '11 150'],
    explanation: "Each request resends everything before it: request *n+1* = request *n* input + that response's tool call (50) + its tool result (3,000). 8,100 + 50 + 3,000 = **11,150**. The pattern is 2,000 + 3,050 × (n − 1). Total input across the four requests would be 26,300 tokens.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ANAT,
    stem: 'You port the minimal loop from the Claude Messages API to the OpenAI Responses API. In the Responses API, how does your code detect that the model wants a function run?',
    exhibit: `Claude loop:   if response.stop_reason == "tool_use": run tools
OpenAI loop:   if ???: run tools`,
    options: ['The response output array contains items with type "function_call", each with call_id, name and JSON-encoded arguments', 'response.stop_reason equals "tool_use"', 'response.status equals "requires_tool"', 'A message with role "tool" appears in the output'],
    answer: [0],
    explanation: "OpenAI's function-calling guide says the response `output` array contains entries of type `function_call` with a `call_id`, `name` and JSON-encoded `arguments`, and that you should assume there may be several. You return each result as a `function_call_output` item with the same `call_id`. The Responses API has no `stop_reason` field; its `status` values are `completed`, `failed`, `in_progress`, `cancelled`, `queued` and `incomplete`. There is no `tool` role message in this flow.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_STOP,
    stem: 'Refer to the exhibit. Both runs use the same model and a 1M-token context window. Which statement explains the two outcomes?',
    exhibit: `Run A, request 61:
  HTTP 400  invalid_request_error  "prompt is too long"

Run B, request 44:
  HTTP 200  stop_reason: "model_context_window_exceeded"
  content: [text (ends mid-sentence)]`,
    options: ['In run A the input alone exceeded the context window, so the request was rejected; in run B the input fit but generation reached the window limit', 'Run A hit a rate limit and run B hit max_tokens', 'Both runs exceeded max_tokens; the API reports it differently on streaming requests', 'Run A sent too many tools and run B sent too many images'],
    answer: [0],
    explanation: "Anthropic's \"Context windows\" page: if the input already exceeds the window, the API returns a 400 `invalid_request_error` (\"prompt is too long\"); on current models, if the input fits but generation reaches the window limit, the response stops with `model_context_window_exceeded`. A rate limit is a 429, and a `max_tokens` cut-off reports `max_tokens`. Tool and image counts are not what the messages say.",
  },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L_STOP,
    stem: 'Refer to the exhibit. By request 30 the agent is slower and its answers forget details from early in the run. Which two changes address the cause? (Choose two.)',
    exhibit: `request  input_tokens  biggest item added since previous request
5        41,200        search_syslog result: 9,800 tokens (full day of logs)
15       163,900       show_running_config result: 14,100 tokens
30       402,700       search_syslog result: 10,300 tokens`,
    options: ['Make the tools return filtered, compact results (for example matching log lines only) instead of full dumps', 'Keep less of the old history in context, for example by summarizing or clearing old tool results', 'Raise max_tokens so the model can write longer answers', 'Add more tools so the model has more options', 'Move the tool results into the system prompt so they are not counted'],
    answer: [0, 1],
    explanation: "Everything in the request counts toward the context window and is resent every iteration; large tool results dominate here. Anthropic's docs note that accuracy and recall degrade as token count grows (context rot). Compact tool results (Domain 2) and trimming or summarizing old history (compaction and context editing, Domain 3) attack the cause. `max_tokens` limits output, not input. More tool definitions add tokens. The system prompt counts toward the window too, and Anthropic advises keeping untrusted tool output in `tool_result` blocks, not the system prompt.",
  },

  // ---------- 1.3 Ways to build an agent ----------
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_OWN,
    stem: 'Refer to the exhibit. Which way to build meets the requirements with the least extra machinery?',
    exhibit: `Agent: "port-shutdown helper" for the Example Corp NOC
- Tools: get_interface_status (read-only), shutdown_interface (changes state)
- Every call to shutdown_interface must be shown to the on-call engineer
  in a chat channel and run only after they approve that exact call
- Every tool call must be written to the SIEM with its arguments
- Short runs: under 10 tool calls; runs on an existing internal server`,
    options: ['Your own loop on the Messages API, with the approval step and logging in your code before each tool runs', 'The SDK tool runner with default settings, iterating until done', 'A hosted managed agent with its agent toolset at the default permission policy', 'A fixed workflow with no model, since the engineer approves anyway'],
    answer: [0],
    explanation: "Anthropic's tool runner page says to use the manual loop when you need human-in-the-loop approval, custom logging or conditional execution; this agent needs all three, and runs are short on a server you already have. A tool runner left at defaults runs tools as soon as Claude calls them. A hosted agent's agent toolset defaults to `always_allow` and would need its own approval configuration plus a way to reach your device APIs. Which port to shut and why is a judgment the model helps with, so dropping the model removes the point of the tool.",
  },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L_OWN,
    stem: 'Match each Example Corp requirement to the way to build that fits it best.',
    pairs: [
      ['Three plain read-only Python functions, no approvals, and the team wants the least loop code to maintain', 'SDK tool runner'],
      ['Every tool call must pause for a custom approval screen and be logged in a specific format before it runs', 'Model API with your own loop'],
      ['An existing Python service on an isolated build host must embed, as a library in its own process, an agent with file read, edit and shell tools, resumable sessions and a permission system', 'Agent SDK (for example the Claude Agent SDK)'],
      ['A multi-hour research task should run asynchronously in a provider sandbox while nobody keeps a process open', 'Hosted (managed) agent'],
    ],
    explanation: "The tool runner removes loop plumbing for plain functions. A manual loop gives you a control point before every call, which the tool runner page recommends for approvals and custom logging. The Claude Agent SDK brings Claude Code's built-in file and command tools, sessions and permission modes as a library. Hosted agents such as Claude Managed Agents are documented as best for long-running tasks and asynchronous work, with the provider running the loop and the sandbox.",
  },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L_OPTS,
    stem: 'You are starting your first Claude Managed Agents task. Put the steps in the order the overview gives them.',
    items: ['Create an agent: model, system prompt, tools, MCP servers and skills', 'Create an environment: a cloud sandbox or a self-hosted sandbox', 'Start a session that references the agent and the environment', 'Send a user event and stream the agent\'s events back', 'Send further user events to steer the agent, or interrupt it'],
    explanation: "The Managed Agents overview lists these steps: create an agent (reusable by ID), create an environment (where sessions run), start a session that references both, send events and stream responses over server-sent events, then steer or interrupt. The agent and environment are configuration; the session is the running instance.",
  },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L_OPTS,
    stem: 'Refer to the exhibit. The Claude Agent SDK run stopped before giving an answer. Which ClaudeAgentOptions field should be raised so this task can finish? Enter the Python field name.',
    exhibit: `options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep"],
    permission_mode="dontAsk",
    max_turns=3,
)

Result message received:
  type: ResultMessage   subtype: error_max_turns   num_turns: 3
  (no result text)

Transcript: turn 1 Glob, turn 2 Read, turn 3 Grep; the model had
gathered what it needed but had no turn left for the final answer.`,
    answer: ['max_turns', 'maxTurns'],
    explanation: "The Agent SDK documentation says a run that hits the turn cap ends with a `ResultMessage` of subtype `error_max_turns` and no final response, and that you must count each tool-calling turn plus one for the final text-only response. Three tool turns need `max_turns=4` or more. `max_budget_usd` caps spend, which is not what stopped this run; the TypeScript name is `maxTurns`.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_OPTS,
    stem: 'Refer to the exhibit (Anthropic Python SDK tool runner). When does the for loop stop if nothing goes wrong?',
    exhibit: `from anthropic import Anthropic, beta_tool

client = Anthropic()


@beta_tool
def get_vlan(vlan_id: int) -> str:
    """Return the name and gateway of one VLAN from IPAM (read-only).

    Args:
        vlan_id: VLAN number, 1 to 4094
    """
    return '{"name": "users-b2", "gateway": "10.20.0.1"}'


runner = client.beta.messages.tool_runner(
    model="claude-haiku-5-5",
    max_tokens=1024,
    max_iterations=5,
    tools=[get_vlan],
    messages=[{"role": "user", "content": "What is VLAN 220's gateway?"}],
)
for message in runner:
    print(message)`,
    options: ['When Claude returns a message without a tool use, or after 5 iterations, whichever comes first', 'After exactly one message, because the runner only makes one request', 'Only when the code calls break, because the runner never ends on its own', 'When get_vlan has been called 1,024 times'],
    answer: [0],
    explanation: "Per Anthropic's tool runner page, iterating the runner yields each message; when Claude requests a tool, the runner runs it and sends the result automatically, and it loops until Claude returns a message without a tool use or until `max_iterations` is reached. You can also `break` early, but you do not have to. `max_tokens` limits each response's output, not tool calls. The `@beta_tool` decorator derives the tool's schema from the type hints and docstring.",
  },
  { topic: '1.3', type: 'multi', difficulty: 3, lesson: L_OPTS,
    stem: 'Which two statements about Claude Managed Agents match its documentation? (Choose two.)',
    options: ['Custom tools run in your application, and permission policies do not apply to them', 'The prebuilt agent toolset defaults to the always_allow permission policy', 'MCP toolsets default to always_allow, so MCP tools run without confirmation', 'Sessions are stateless; the service keeps no conversation history', 'Managed Agents in Anthropic\'s cloud is eligible for Zero Data Retention'],
    answer: [0, 1],
    explanation: "The permission policies page says policies apply to server-executed tools (the prebuilt agent toolset and MCP toolsets); custom tools run in your application under your control. The agent toolset defaults to `always_allow` and MCP toolsets to `always_ask`. The overview describes sessions as stateful, with history stored server-side, and says Managed Agents is not currently eligible for Zero Data Retention; the only exception is self-hosted Claude Managed Agents, where the whole service runs on your infrastructure.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_OWN,
    stem: 'Refer to the exhibit. Which option conflicts with the policy?',
    exhibit: `Example Corp data policy (excerpt)
"Agent conversation transcripts containing device configurations must
not be stored by an external provider as persistent session records.
Processing a request and returning a response is permitted."

Options under review
1  Own loop on the Claude Messages API; history kept in our database
2  Claude Agent SDK on an internal host; sessions stored on that host
3  Claude Managed Agents with an Anthropic cloud environment
4  Own loop on the OpenAI Responses API, sending history manually`,
    options: ['Option 3', 'Option 1', 'Option 2', 'Option 4'],
    answer: [0],
    explanation: "Claude Managed Agents is stateful by design: sessions store conversation history, sandbox state and outputs server-side, and transcripts persist until you delete them (the overview also states it is not ZDR-eligible, except when the whole service is self-hosted). That is a persistent session record held by the provider. Options 1, 2 and 4 keep the history in your own systems and send it per request. Whether the providers' standard request-processing retention is acceptable is a separate check this policy excerpt does not raise.",
  },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L_OPTS,
    stem: 'Refer to the exhibit, taken from the comparison in OpenAI\'s Agents guide with one cell hidden. What belongs in the hidden cell?',
    exhibit: `                       Agents API             Agents SDK   Responses API
Where the agent runs   OpenAI runs a managed  ???          Your application, with
                       Codex harness                       optional hosted orchestration`,
    options: ['The SDK runs inside your application', 'OpenAI runs the SDK in a hosted sandbox', 'In the browser, through ChatKit', 'On a self-hosted copy of the Codex harness only'],
    answer: [0],
    explanation: "OpenAI's comparison says the Agents SDK runs inside your application: your server owns deployment, tool implementations, state storage and approvals, while the SDK's runner handles the agent loop and handoffs. The managed Codex harness is the Agents API. ChatKit is listed separately for embedded chat experiences.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_OWN,
    stem: 'Refer to the exhibit. Before giving this agent Example Corp\'s read-only monitoring credentials, what should be configured first, according to Google\'s documentation of the default?',
    exhibit: `Plan: Gemini managed agent (Antigravity agent) investigates alerts.
- Runs in the Google-hosted Linux sandbox
- Needs to reach only monitor.example.com (HTTPS)
- Credentials: a read-only API token for the monitoring system`,
    options: ['A network allowlist that restricts outbound traffic to monitor.example.com, because the sandbox has unrestricted outbound access by default', 'Nothing: managed agent sandboxes block all outbound traffic by default', 'A larger context window, because managed agents cannot use the token otherwise', 'The generateContent API, because managed agents require it'],
    answer: [0],
    explanation: "Google's managed agents overview states that environments have unrestricted outbound network access by default and that a `network` allowlist restricts traffic to specific domains. It also advises least-privilege, short-lived credentials stored as managed credentials. The default is open, not closed. Context window size is unrelated, and Google now calls `generateContent` a legacy API, recommending the Interactions API.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_OWN,
    stem: 'A manager asks for "an agent built on the Claude Agent SDK" to compare the running configuration of 200 switches with golden templates every night and email a drift report. The steps never change. What is the best response?',
    options: ['Build a workflow: code fetches and diffs the configurations, with a model call only to summarize the report, if one is needed at all', 'Use the Claude Agent SDK with bypassPermissions so the nightly job is never blocked', 'Use a hosted managed agent so the job runs in a sandbox', 'Use the tool runner with max_iterations set to 200, one iteration per switch'],
    answer: [0],
    explanation: "The build option comes after the workflow-or-agent decision. Fixed, repeatable steps are a workflow: Anthropic advises the simplest solution and adding agentic complexity only when it demonstrably helps. Diffing configurations is deterministic code; a model can at most summarize. `bypassPermissions` approves tool calls without prompting, and the docs reserve it for controlled environments where you trust every possible operation. A sandboxed agent or a 200-iteration tool loop adds cost and failure modes to a job a script does exactly.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_OWN,
    stem: 'An Example Corp team moves from its own loop to the Anthropic SDK tool runner. Which job is still the team\'s responsibility?',
    options: ['Writing the tool functions, including checks on which devices and actions each call may touch, and persisting conversation state beyond the run if it is needed','Sending each tool result back to the model in a tool_result block', 'Detecting tool_use responses and deciding to call the tool', 'Appending each assistant response to the message history during the run'],
    answer: [0],
    explanation: "Anthropic's tool runner page says the runner runs tools when Claude calls them, handles the request and response cycle and manages conversation state, so detecting `tool_use`, formatting `tool_result` blocks and appending messages are done for you. The tool code itself, including checks on what each call is allowed to touch, stays yours, as does storing anything you need after the run. (The runner's schema-based type handling does not replace value checks; the page notes, for example, that the TypeScript runner does not validate Claude's input at runtime.)",
  },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
