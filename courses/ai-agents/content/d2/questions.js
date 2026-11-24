// Domain 2 — Tools and the Model Context Protocol. Original questions; no vendor or third-party question content.
// Part 1 (topics 2.1 to 2.3) written 2026-11-23; facts checked against vendor documentation that day (URLs in REVIEW-TODO.md).
// Every exhibit question was worked from its exhibit. JSON exhibits were validated with python3 -m json.tool and Python
// exhibits compiled with py_compile (line numbers stripped). API requests, responses, histories and tool results in exhibits
// are written from documented shapes, not captured from live calls. Type strings and model ids are kept out of answers.
// Topics 2.4 and 2.5 are appended after the 2.3 block by a later writer; ids are generated from array order.
const L_DEF = '2.1-define-tools';
const L_SCH = '2.1-schemas-strict';
const L_RES = '2.1-tool-results';
const L_HIS = '2.2-history-shapes';
const L_LOOP = '2.2-robust-loop';
const L_TC = '2.2-tool-choice-runner';
const L_SRV = '2.3-server-tools';
const L_SEC = '2.3-client-tools-security';
// 2.4 and 2.5 (part 2)
const L_MCPA = '2.4-mcp-architecture';
const L_MCPT = '2.4-mcp-tools-protocol';
const L_MCPX = '2.4-transports-auth';
const L_MCPB = '2.4-build-server';
const L_SO = '2.5-structured-output';
const L_VAL = '2.5-validate-before-acting';

const bank = [
  // 2.1 Defining tools
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L_DEF,
    stem: 'Refer to the exhibit. In testing, the agent sometimes calls this tool when users ask for a port\'s VLAN or configuration, and sometimes skips it when users report a slow port. According to Anthropic\'s tool-definition guidance, which change is most likely to fix both problems?',
    exhibit: `{
  "name": "get_interface_status",
  "description": "Gets interface status.",
  "input_schema": {
    "type": "object",
    "properties": {
      "device_hostname": {"type": "string", "description": "Inventory hostname, for example sw-access-12.example.com"},
      "interface_name": {"type": "string", "description": "Full interface name, for example GigabitEthernet1/0/48"}
    },
    "required": ["device_hostname", "interface_name"]
  }
}`,
    options: ['Rewrite the description to say what the tool returns, when to use it (slow, flapping or dead ports) and that it returns no configuration or VLAN data', 'Add "strict": true so the inputs always match the schema', 'Set tool_choice to {"type": "any"} on every request', 'Rename the tool to getInterfaceStatusV2 so the model treats it as new'],
    answer: [0],
    explanation: "Anthropic's \"Define tools\" page calls detailed descriptions by far the most important factor in tool performance: what the tool does, when to use it and when not, and what it returns. Both symptoms are **selection** problems, and a one-line description gives the model nothing to select on. `strict: true` fixes input conformance, not when the tool is chosen. Forcing `any` makes the model call some tool on every turn, including turns that need none (and forced tool use is unsupported on some models). A new name adds no information about when to use the tool.",
  },
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: L_DEF,
    stem: 'Refer to the exhibit. Which two changes does this tool definition need? (Choose two.)',
    exhibit: `{
  "name": "show interface.status",
  "description": "Read-only. Returns operational status and error counters for one switch interface. Use it when a user reports a slow or flapping port. It does not return configuration.",
  "input_schema": {
    "type": "object",
    "properties": {
      "dev": {"type": "string"},
      "port": {"type": "string", "description": "Full interface name, for example GigabitEthernet1/0/48"}
    },
    "required": ["dev", "port"]
  }
}`,
    options: ['Change the name to one that matches ^[a-zA-Z0-9_-]{1,128}$, such as get_interface_status', 'Rename dev to an unambiguous name such as device_hostname and describe its expected format', 'Delete the sentence "It does not return configuration", because descriptions should only say what a tool does', 'Replace the required array with "required": true inside each property', 'Add "type": "tool" at the top level, which user-defined tools require'],
    answer: [0, 1],
    explanation: "The documented name pattern allows only letters, digits, underscore and hyphen; the space and the dot make this name invalid. `dev` with no description leaves the model guessing (IP address, short name, FQDN?); Anthropic's engineering article recommends unambiguous parameter names such as `user_id` over `user`, and every property deserves a description. Saying what a tool does **not** do is recommended guidance, so the sentence should stay. JSON Schema uses a `required` array on the object, not a boolean per property. User-defined tools need no `type` field: the Messages API reference allows only an optional `type: \"custom\"`, `\"tool\"` is not a valid value, and dated `type` strings are for Anthropic-provided tools.",
  },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L_SCH,
    stem: 'Refer to the exhibit. The request is rejected with a 400 error because this strict schema uses one JSON Schema keyword that strict tool use does not support. Which keyword? (Enter the keyword only.)',
    exhibit: `{
  "name": "search_tickets",
  "strict": true,
  "description": "Read-only. Searches Example Corp incident and change tickets by keyword and returns at most 'limit' matches, newest first.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "description": "Keywords, for example sw-access-12"},
      "status": {"type": "string", "enum": ["open", "closed", "any"]},
      "limit": {"type": "integer", "maximum": 20, "description": "Matches to return"}
    },
    "required": ["query", "status", "limit"],
    "additionalProperties": false
  }
}`,
    answer: ['maximum', '"maximum"'],
    explanation: "Strict tool use shares the JSON Schema limits of structured outputs: numerical constraints such as `minimum`, `maximum` and `multipleOf` are not supported. Everything else here is supported: `enum` of strings, `required`, and `additionalProperties: false`. Put the range in the description (\"1 to 20\") and clamp the value in the tool's code.",
  },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L_SCH,
    stem: 'Refer to the exhibit. The tool is defined with "strict": true. The handler checks `if fault not in FAULTS: raise ValueError` and the run crashes. What is the best explanation and fix?',
    exhibit: `Schema property (tool record_fault, strict: true):
  "fault": {"type": "string", "enum": ["link down", "crc errors", "duplex mismatch"]}

tool_use block received:
  {"type": "tool_use", "id": "toolu_01EXAMPLE", "name": "record_fault",
   "input": {"fault": "duplex Mismatch"}}`,
    options: ['Strict mode does not guarantee the capitalization of enum values; compare case-insensitively and avoid enum values that differ only in case', 'Strict mode was silently disabled because the property has no description; add one', 'The model ignored the schema; force the tool with tool_choice so the enum is enforced', 'The API corrupted the input in transit; resend the same request until the value matches'],
    answer: [0],
    explanation: "Anthropic's structured outputs page documents this exact caveat, and says it applies to strict tool use too: a string `enum` or `const` value can come back differing only in capitalization, typically the first letter after a space, with no error and no special stop reason. Normalize case before comparing, and do not define values that differ only in case. A missing property description does not disable strict mode. Forcing a tool does not change how enums are sampled (and is unsupported on some models). Nothing was corrupted; blindly resending wastes calls.",
  },
  { topic: '2.1', type: 'match', difficulty: 2, lesson: L_RES,
    stem: 'Match each symptom seen while testing the Example Corp NOC agent to the fix that addresses it.',
    pairs: [
      ['The agent calls search_tickets when users ask for the approved procedure, which get_runbook provides', 'Rewrite both descriptions to say when each tool should be used'],
      ['The model sometimes sends limit as the string "5" instead of the integer 5', 'Set strict: true on the tool definition'],
      ['A lookup returns 400 lines of CLI output and later turns lose track of the goal', 'Return only the needed fields, and paginate or truncate with a note'],
      ['After the result "Error 404", the model retries the same misspelled hostname three times', 'Return an is_error result that names the closest valid hostname'],
      ['The CMDB and the ticket system each expose a tool named search, and the model mixes them up', 'Prefix tool names with the service, such as cmdb_search and itsm_search'],
    ],
    explanation: "Anthropic's troubleshooting page maps wrong-tool selection to sharper descriptions that differentiate tools by **when** to use them, and wrong parameter types to `strict: true`. \"Writing effective tools for agents\" recommends returning only high-signal information with pagination or truncation and helpful instructions, writing error responses that give specific, actionable improvements rather than opaque codes, and namespacing tools by service when several systems expose similar tools.",
  },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L_RES,
    stem: 'Refer to the exhibit. This is the result get_interface_status returns today. Which change would most help the model act on it?',
    exhibit: `{
  "request_uuid": "9c1e5f0a-2b7d-4c1e-8f3a-6d2b1c0e9a77",
  "poll_id": 88123,
  "mime_type": "text/plain",
  "raw": "GigabitEthernet1/0/48 is up, line protocol is up ... (312 more lines of CLI output)"
}`,
    options: ['Return named fields such as oper_status, speed_mbps, duplex and crc_errors, echo the device and interface names, and drop the internal ids', 'Add the full running configuration to the result so the model never lacks context', 'Base64-encode the raw output so it uses fewer tokens', 'Move request_uuid and poll_id to the top so the model can cite them to the user'],
    answer: [0],
    explanation: "Anthropic's guidance is to return only high-signal information, with semantic identifiers instead of opaque internal references; its engineering article names fields such as UUIDs and MIME types as low-level identifiers that rarely help an agent. Named fields with units let the model reason directly, and echoed names are identifiers it can reuse. Adding the configuration makes the result even larger. Base64 does not reduce tokens for the model and makes the text unreadable. Internal ids are exactly what the model should not be quoting to users.",
  },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L_DEF,
    stem: 'Refer to the exhibit. The agent often picks the wrong one of the read-only tools. Which redesign follows Anthropic\'s published tool guidance and keeps the agent safe?',
    exhibit: `Current tools of the Example Corp NOC agent
show_interface         Runs "show interface X" and returns the output
show_interface_brief   Runs "show ip interface brief" and returns the output
get_port_counters      Returns error counters for a port from the NMS
get_port               Returns NMS data about a port
interface_errors       Returns CRC errors for an interface
bounce_port            Shuts down and re-enables a port`,
    options: ['Consolidate the five read-only tools into one or two well-described, task-shaped tools, and keep bounce_port separate behind a human approval step or remove it', 'Merge all six into a single interface tool with an action parameter, as the documentation suggests for related operations', 'Add more tools so that each one has an even narrower purpose', 'Keep the tools as they are and set disable_parallel_tool_use so the model considers one at a time'],
    answer: [0],
    explanation: "\"Define tools\" recommends fewer, more capable tools to reduce selection ambiguity, and \"Writing effective tools for agents\" warns that overlapping tools distract agents. Five overlapping read-only lookups should become one or two clear tools such as `get_interface_status`. Consolidating with an `action` parameter is documented guidance for related operations, but merging a state-changing action into a read-only tool is a safety mistake (this course's own rule): the read-only tool could no longer be offered freely. More tools increase ambiguity. `disable_parallel_tool_use` limits calls per response; it does not help the model choose.",
  },
  { topic: '2.1', type: 'fill', difficulty: 1, lesson: L_RES,
    stem: 'Refer to the exhibit. The tool call failed, but this result reports it the way a success would be reported. Which field should be added to the tool_result block, set to true? (Enter the field name.)',
    exhibit: `{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01EXAMPLE",
      "content": "sw-dist-02.example.com did not answer within 10 s. It may be down. Retry at most once."
    }
  ]
}`,
    answer: ['is_error', '"is_error"', 'is_error: true'],
    explanation: "\"Handle tool calls\" documents the optional `is_error` field: set it to `true` when a tool failed or the call was invalid, with the error message in `content`. The message here is already instructive (what happened, what to try, a retry limit); only the flag is missing.",
  },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L_DEF,
    stem: 'Refer to the exhibit. The NOC asks to add this tool to the read-only diagnostics agent so it can fix ports by itself. Which design is safest while still useful?',
    exhibit: `{
  "name": "bounce_interface",
  "description": "Shuts down and re-enables an interface to clear errors. Use it whenever an interface shows errors.",
  "input_schema": {
    "type": "object",
    "properties": {
      "device_hostname": {"type": "string"},
      "interface_name": {"type": "string"}
    },
    "required": ["device_hostname", "interface_name"]
  }
}`,
    options: ['Keep the diagnostics agent read-only; if the action is added, have it return a dry-run plan by default and execute only after a person approves it in your code, using credentials limited to that action', 'Add it as written but change the description to "Only use this when truly necessary"', 'Add it with "strict": true so every call is valid and therefore safe', 'Add it and set disable_parallel_tool_use so that only one interface can be bounced per response'],
    answer: [0],
    explanation: "Changing device state is irreversible enough to need a control the model cannot talk its way past: a dry run first and a human approval enforced in code, with least-privilege credentials (Domain 5 covers the pattern). A description is a request, not a control. Strict mode guarantees well-formed input, not a good decision. Limiting calls per response still lets the agent bounce ports one at a time, and the original description (\"whenever an interface shows errors\") would encourage it.",
  },
  { topic: '2.1', type: 'multi', difficulty: 1, lesson: L_DEF,
    stem: 'According to Anthropic\'s "Define tools" guidance, which two belong in a tool\'s description? (Choose two.)',
    options: ['When the tool should be used, and when it should not', 'What the tool returns and its important limitations', 'The API key the tool uses, so the model can authenticate', 'The full source code of the implementation', 'A request that the model write out its complete step-by-step reasoning before calling the tool', 'The name of the database table the tool queries'],
    answer: [0, 1],
    explanation: "The documented checklist: what the tool does, when it should be used and when not, what each parameter means, and caveats or limitations such as what it does not return. Secrets never go into prompts or tool definitions. The model never sees or needs your implementation. Asking for step-by-step reasoning in a tool definition can lead to a `reasoning_extraction` refusal; ask for a short explanation instead. Internal table names are implementation detail with no value for choosing the tool.",
  },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L_DEF,
    stem: 'Refer to the exhibit. What will most likely happen when this tool definition is sent?',
    exhibit: `{
  "name": "search_tickets",
  "description": "Read-only. Searches Example Corp tickets by keyword. Returns ticket_id, title, status and opened_at for each match.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {"type": "string"},
      "status": {"type": "string", "enum": ["open", "closed", "any"]}
    },
    "required": ["query", "status"]
  },
  "input_examples": [
    {"query": "sw-access-12", "status": "open"},
    {"query": "DHCP building B", "status": "resolved"}
  ]
}`,
    options: ['The API usually rejects the request with a 400 error, because every input example must be valid against input_schema and "resolved" is not in the enum', 'The invalid example is silently dropped and the valid one is used', 'The model learns from the example that "resolved" is an allowed status', 'The request fails because input_examples is accepted only on server tools'],
    answer: [0],
    explanation: "\"Define tools\" says each example must be valid against the tool's `input_schema` and that the API usually returns a 400 error for an invalid example (it skips the check in some cases, such as schemas with a `pattern`, and then the model sees the invalid example). Nothing documents silent dropping. `input_examples` is for user-defined and some Anthropic-schema client tools; the tool reference says it is **not** available on server tools.",
  },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L_DEF,
    stem: 'Refer to the exhibit. A developer adds this property to every tool so the logs show why each call was made. What risk does Anthropic\'s documentation name, and what should the property ask for instead?',
    exhibit: `"why": {
  "type": "string",
  "description": "Before calling this tool, write out your complete step-by-step reasoning and thought process."
}`,
    options: ['It can lead to a reasoning_extraction refusal; ask for a short explanation or the supporting evidence instead', 'It makes the tool name invalid; move the text into the name', 'It disables parallel tool calls; set disable_parallel_tool_use to false', 'It is rejected by strict mode because strings cannot be required; make it optional'],
    answer: [0],
    explanation: "\"Define tools\" says a parameter that asks for the model's thinking or step-by-step reasoning might lead to a `reasoning_extraction` refusal, and advises asking for a short explanation or the supporting evidence. A property does not affect the tool name or parallel calls, and strict mode supports required string properties.",
  },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L_SCH,
    stem: 'Refer to the exhibit. What does Anthropic\'s documentation recommend trying first?',
    exhibit: `Request plan for the Example Corp NOC agent
- 25 tool definitions, every one with "strict": true
- 40 parameters across those schemas are not in their "required" lists
- Result of the first test request: HTTP 400`,
    options: ['Mark only the tools where schema violations cause real problems as strict, and make parameters required where a sensible default exists', 'Remove additionalProperties: false from every schema so the grammar is smaller', 'Set tool_choice to {"type": "any"} so the grammar is compiled only once', 'Move each schema into input_examples instead of input_schema'],
    answer: [0],
    explanation: "Strict schemas have documented per-request limits (20 strict tools, 24 optional parameters and 16 union-type parameters as of 2026-11-23); this plan exceeds the first two. The documentation's tips, in order: mark only critical tools as strict, reduce optional parameters by making them required where a default exists, simplify nesting, and split tools across requests. Strict mode requires `additionalProperties: false`, so removing it causes errors instead of fixing them. `tool_choice` does not change schema compilation. Examples are not a schema.",
  },

  // 2.2 The tool-use loop
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L_HIS,
    stem: 'An Example Corp user asks about two switch uplinks. In its first response Claude calls get_interface_status twice; in its second it calls search_tickets once; its third response is the final answer. Put the entries of the messages array in the order they appear in the request that produces the final answer.',
    items: ['user: "Are the uplinks on sw-access-12 and sw-access-14 healthy?"', 'assistant: a text block and two tool_use blocks for get_interface_status', 'user: two tool_result blocks, one for each get_interface_status call', 'assistant: one tool_use block for search_tickets', 'user: one tool_result block for the search_tickets call'],
    explanation: "Each request carries the full history. After each `tool_use` response, the assistant content is appended unchanged and immediately followed by one user message holding a `tool_result` for every call, both parallel results together. The third request therefore ends with the second result message, and the response to it is the final answer.",
  },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L_HIS,
    stem: 'Refer to the exhibit. The API rejects the request containing this history with a 400 error. Enter the number of the message that breaks the tool-result rules.',
    exhibit: `[1] {"role": "user", "content": "Is GigabitEthernet1/0/48 on sw-access-12.example.com healthy?"}
[2] {"role": "assistant", "content": [{"type": "text", "text": "Checking the port."}, {"type": "tool_use", "id": "toolu_01A", "name": "get_interface_status", "input": {"device_hostname": "sw-access-12.example.com", "interface_name": "GigabitEthernet1/0/48"}}]}
[3] {"role": "user", "content": [{"type": "tool_result", "tool_use_id": "toolu_01A", "content": "{\\"oper_status\\": \\"up\\", \\"duplex\\": \\"half\\"}"}]}
[4] {"role": "assistant", "content": [{"type": "tool_use", "id": "toolu_01B", "name": "search_tickets", "input": {"query": "sw-access-12", "ticket_type": "change", "status": "any", "limit": 5}}]}
[5] {"role": "user", "content": [{"type": "text", "text": "Here is the ticket search:"}, {"type": "tool_result", "tool_use_id": "toolu_01B", "content": "{\\"total_matches\\": 0, \\"tickets\\": []}"}]}`,
    answer: ['5', '[5]', 'message 5'],
    explanation: "In the user message that carries tool results, every `tool_result` block must come first; any text must follow them. Message 5 puts a text block before the result, which the documentation lists as a 400 error. Messages 2 to 4 are correct: each call is answered immediately, by id, in the next message.",
  },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L_HIS,
    stem: 'Refer to the exhibit. The loop ran the two calls in sequence, skipped the second because the first failed, and sent only one result. What is the correct fix?',
    exhibit: `Assistant content: tool_use toolu_01A (get_interface_status, sw-dist-02.example.com)
                   tool_use toolu_01B (get_interface_status, sw-dist-03.example.com)
Next user message: [ tool_result for toolu_01A, is_error: true,
                     "sw-dist-02.example.com did not answer within 10 s." ]

API response: 400 invalid_request_error
"tool_use ids were found without tool_result blocks immediately after: toolu_01B ..."`,
    options: ['Add a tool_result for toolu_01B to the same user message, with is_error: true and a short note such as "Not executed: the preceding call failed."', 'Add a text block before the existing tool_result saying that toolu_01B was skipped', 'Remove the toolu_01B block from the assistant content before resending', 'Set disable_parallel_tool_use on the next request and resend the same history'],
    answer: [0],
    explanation: "Every `tool_use` needs a `tool_result` in the very next user message, even calls you chose not to run; \"Parallel tool use\" shows exactly this: `is_error: true` with a brief explanation. A text note still leaves `toolu_01B` without a result, and text placed before a `tool_result` is itself a 400 error. Editing the assistant content breaks the rule to send it back unchanged. `disable_parallel_tool_use` affects future responses, not calls already in the history.",
  },
  { topic: '2.2', type: 'multi', difficulty: 1, lesson: L_HIS,
    stem: 'Which three statements about the user message that returns client tool results to Claude are true? (Choose three.)',
    options: ['It must come immediately after the assistant message that contains the tool_use blocks', 'Its tool_result blocks must come before any text blocks', 'It must contain a tool_result for every tool_use block in the preceding assistant message', 'It must use the role "tool"', 'Each tool_result must repeat the input that the tool was called with', 'Its results must be in the same order as the calls, because results are matched by position'],
    answer: [0, 1, 2],
    explanation: "These are the documented formatting rules: results immediately after the calls, results before any text, and one result per call. Claude has no `tool` role; results go in a `user` message. A `tool_result` carries `tool_use_id`, optional `content` and optional `is_error`, not the input. Matching is by `tool_use_id`, so order does not matter.",
  },
  { topic: '2.2', type: 'single', difficulty: 1, lesson: L_LOOP,
    stem: 'Your get_runbook function raises FileNotFoundError when the model asks for a runbook that does not exist. What should the loop do?',
    options: ['Catch the exception and return a tool_result with is_error: true and a message that lists the runbooks that do exist', 'Let the exception propagate so the run ends and an engineer can investigate', 'Return a tool_result without is_error that says "success" so the model is not confused', 'Remove the tool_use block from the history and resend the request'],
    answer: [0],
    explanation: "\"Handle tool calls\" says to report a failed or invalid call with `is_error: true` and an instructive message, so the model can retry correctly or explain to the user. Crashing throws away the run for a recoverable mistake. A fake success misleads the model. Editing the assistant content breaks the history rules. Log the exception for yourself as well (lesson 2.2-robust-loop).",
  },
  { topic: '2.2', type: 'fill', difficulty: 3, lesson: L_LOOP,
    stem: 'Refer to the exhibit. This loop runs without errors, but in testing Claude soon stops calling tools in parallel: after an early turn with two calls, it makes one call per response even where parallel calls would be faster. One statement formats the history in a way the parallel tool use documentation calls wrong. Enter the line number where that statement starts.',
    exhibit: ` 1  for _ in range(MAX_ITERATIONS):
 2      response = client.messages.create(model=MODEL, max_tokens=1024,
 3                                        tools=TOOLS, messages=messages)
 4      if response.stop_reason != "tool_use":
 5          return response
 6      messages.append({"role": "assistant", "content": response.content})
 7      for block in response.content:
 8          if block.type == "tool_use":
 9              content, failed = run_tool(block.name, block.input)
10              messages.append({"role": "user", "content": [
11                  {"type": "tool_result", "tool_use_id": block.id,
12                   "content": content, "is_error": failed}]})
13  raise RuntimeError("iteration limit reached")`,
    answer: ['10', 'line 10'],
    explanation: "Line 10 appends a separate user message for each result. The Messages API combines consecutive user messages into one turn, so the request is accepted, but the parallel tool use and troubleshooting pages list one message per result as wrong: it \"teaches\" Claude to avoid parallel calls on later turns. Collect the results in a list inside the `for` loop and append **one** user message after it. The other lines are correct: line 6 appends the assistant content unchanged, and each result carries its `tool_use_id` and error flag.",
  },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L_HIS,
    stem: 'Refer to the exhibit. The team wants Claude to make at most one tool call per response. What should change in this Messages API request?',
    exhibit: `{
  "model": "claude-haiku-5-5",
  "max_tokens": 1024,
  "parallel_tool_calls": false,
  "tool_choice": {"type": "auto"},
  "tools": [{"name": "get_interface_status", "description": "Read-only. Returns status and counters for one interface.", "input_schema": {"type": "object", "properties": {"device_hostname": {"type": "string"}, "interface_name": {"type": "string"}}, "required": ["device_hostname", "interface_name"]}}],
  "messages": [{"role": "user", "content": "Check the uplinks on sw-access-12 and sw-access-14."}]
}`,
    options: ['Remove parallel_tool_calls and set "tool_choice": {"type": "auto", "disable_parallel_tool_use": true}', 'Set "tool_choice": {"type": "none"}', 'Lower max_tokens so only one tool_use block fits', 'Set "tool_choice": {"type": "any", "disable_parallel_tool_use": true}'],
    answer: [0],
    explanation: "Claude's switch is `disable_parallel_tool_use: true` **inside** `tool_choice`; the docs stress it is not a top-level parameter. `parallel_tool_calls` is OpenAI's name for a similar setting. With `auto`, the flag means at most one call and plain-text answers remain possible, which is what was asked. `none` forbids tools entirely. A lower `max_tokens` risks truncating a call mid-block. `any` with the flag means **exactly** one call on every response, so the model could never answer in text, and forced tool use is unsupported on some models.",
  },
  { topic: '2.2', type: 'match', difficulty: 2, lesson: L_LOOP,
    stem: 'Match each situation in a Claude tool-use loop to the action the loop should take.',
    pairs: [
      ['stop_reason is tool_use and the response holds three tool_use blocks for read-only tools', 'Run all three, then send every tool_result in one user message'],
      ['stop_reason is max_tokens and the last content block is a tool_use block', 'Do not run it; resend the same request with a higher max_tokens'],
      ['stop_reason is pause_turn after several web searches', 'Append the content unchanged as an assistant message and send again with no new user message'],
      ['stop_reason is refusal', 'Stop and read stop_details; follow your fallback policy instead of resending unchanged'],
      ['The eighth of eight allowed model calls returns tool_use again', 'End the run and report that no answer was reached within the limit'],
    ],
    explanation: "Parallel calls are answered together in one message. A `tool_use` block cut off by `max_tokens` is incomplete; the stop-reason guide says to retry with a higher limit. `pause_turn` comes from the server-side loop and is continued by resending the paused content as-is. A refusal is a successful 200 response with `stop_details`; the documented handling is a retry on a fallback Claude model (or, for a `reasoning_extraction` refusal, a changed prompt), not the same request again. Hitting your own iteration cap is a deliberate stop: report it rather than returning partial output.",
  },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L_TC,
    stem: 'The team wants Claude to say in one sentence why it is calling search_tickets, then call it. With tool_choice {"type": "tool", "name": "search_tickets"} the sentence never appears. Why, and what should they do?',
    options: ['Forcing a tool makes the response start with the tool call, so no text comes first; use auto and ask for the tool in the user message', 'The model needs disable_parallel_tool_use to write text; add it to tool_choice', 'Text before a tool call requires strict mode; set strict: true on search_tickets', 'The sentence is moved into the tool_result; read it from there'],
    answer: [0],
    explanation: "\"Define tools\" says that with `any` or `tool` the API makes the response start with a tool call, so Claude does not write natural-language text before the `tool_use` blocks, even if asked; to get both, use `auto` and say in a user message which tool to use. Parallel-call settings and strict mode have nothing to do with preamble text, and a `tool_result` is written by your code, not by the model.",
  },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L_TC,
    stem: 'Refer to the exhibit. The model has thinking on by default and accepts forced tool use, yet the response contains no thinking block. What explains this, and how can the team let the model think before calling the tool?',
    exhibit: `Request (excerpt)
  "tool_choice": {"type": "tool", "name": "record_category"}

Response content
  [ {"type": "tool_use", "id": "toolu_01EXAMPLE", "name": "record_category",
     "input": {"ticket_id": "INC-4471", "category": "network"}} ]
stop_reason: "tool_use"`,
    options: ['A forced tool call skips thinking; use tool_choice auto with an instruction to call record_category', 'Thinking blocks are removed from responses that contain tool_use; read them from usage instead', 'The tool lacks strict: true, and only strict tools allow thinking', 'Thinking is skipped because max_tokens was too low; double it'],
    answer: [0],
    explanation: "The documentation states that forcing a tool skips thinking on every model that accepts forced tool use: the response starts with the `tool_use` block and has no `thinking` block. To let the model think first, use `auto` with a prompt instruction. Thinking blocks are not stripped from tool-use responses in general, strict mode is unrelated, and the response here was not truncated (`stop_reason` is `tool_use`).",
  },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L_TC,
    stem: 'Which tool_choice type prevents Claude from calling any tool on a request while the tool definitions stay in the request? (Enter the type value.)',
    answer: ['none', '"none"'],
    explanation: "`{\"type\": \"none\"}` prevents tool use; it is also the default when no tools are provided. Keeping the definitions in the request while forbidding calls is useful for a final \"summarize what you found\" turn in a history that already contains tool calls.",
  },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L_TC,
    stem: 'Refer to the exhibit. Example Corp needs a person to approve every reset_interface_counters call before it runs. What does Anthropic\'s documentation recommend?',
    exhibit: `runner = client.beta.messages.tool_runner(
    model=MODEL,
    max_tokens=1024,
    max_iterations=6,
    tools=[get_interface_status, reset_interface_counters],
    messages=[{"role": "user", "content": goal}],
)
final_message = runner.until_done()`,
    options: ['Use a manual tool-use loop, where your code can stop for approval before running that call (or keep the tool out of the runner)', 'Set max_iterations to 1 so the tool can run only once', 'Add "Ask a human before calling this" to the tool\'s docstring', 'Rely on the runner\'s error wrapping, which turns risky calls into is_error results'],
    answer: [0],
    explanation: "The tool runner page says that when you need human-in-the-loop approval, custom logging or conditional execution, you should use the manual loop. The runner calls whatever tool the model requests. One iteration still allows one unapproved reset. A docstring sentence is a request to the model, not an enforced control. Error wrapping only reports exceptions your tool raises; it does not gate execution.",
  },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L_TC,
    stem: 'Refer to the exhibit. How long does this tool runner keep calling the API?',
    exhibit: `runner = client.beta.messages.tool_runner(
    model=MODEL,
    max_tokens=1024,
    tools=[get_interface_status, search_tickets, get_runbook],
    messages=[{"role": "user", "content": "Find out why building B users are slow."}],
)
for message in runner:
    print(message.stop_reason)`,
    options: ['Until Claude returns a message without a tool call; nothing else bounds it, so max_iterations should be added', 'For at most 10 iterations, the runner\'s default limit', 'Until the first tool call, after which you must send results yourself', 'Until any tool raises an exception, which ends the run'],
    answer: [0],
    explanation: "The runner loops until Claude returns a message without a tool use, or until it reaches `max_iterations` **if you set it**; this code does not. A default of 10 iterations is documented for the **server-side** loop (`pause_turn`), not for the runner. The runner sends tool results itself. An exception in a tool is wrapped into an `is_error` result and the loop continues.",
  },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L_TC,
    stem: 'Put the steps of one iteration of the SDK tool runner in the order Anthropic\'s documentation gives them.',
    items: ['The runner sends a request to the Messages API with its current state', 'The runner yields the response message to your loop body', 'Your loop body runs and may read the message or change the runner\'s state', 'The runner checks whether you changed the message history', 'If you did not and the message has tool calls, the runner appends the assistant message and the tool results and continues'],
    explanation: "This is the iteration lifecycle on the tool runner page: request, yield, your code, check for modified history, then either the automatic append (unchanged history with tool calls), exit (no tool calls), or using your state as-is (history modified).",
  },

  // 2.3 Client and server tools
  { topic: '2.3', type: 'order', difficulty: 3, lesson: L_SRV,
    stem: 'Refer to the exhibit. Put the steps for completing this turn in order.',
    exhibit: `{
  "stop_reason": "tool_use",
  "content": [
    {"type": "text", "text": "I'll read the advisory and check the port at the same time."},
    {"type": "server_tool_use", "id": "srvtoolu_01EXAMPLE", "name": "web_fetch",
     "input": {"url": "https://advisories.example.com/2026-17"}},
    {"type": "tool_use", "id": "toolu_01EXAMPLE", "name": "get_interface_status",
     "input": {"device_hostname": "sw-access-12.example.com", "interface_name": "GigabitEthernet1/0/48"}}
  ]
}`,
    items: ['Notice the server_tool_use block has no result block while a client tool_use is waiting', 'Run get_interface_status and build its tool_result block', 'Send the next request with the same tools: the response content as an assistant message, then a user message holding only that tool_result', 'The API runs the deferred web fetch at the start of that request', 'Read the response, which begins with the web_fetch_tool_result block followed by new content and a fresh stop_reason'],
    explanation: "\"Server tools\" documents this mixed turn: when a server tool and a client tool are called together, the API returns `stop_reason: \"tool_use\"` without running the server tool, and the only marker is the missing result block. You run the client tool, return only `tool_result` blocks (text after them would end the turn and fail), keep the same `tools` array, and the API then runs the fetch; the next response starts with its result block.",
  },
  { topic: '2.3', type: 'multi', difficulty: 2, lesson: L_SRV,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `{
  "role": "assistant",
  "stop_reason": "end_turn",
  "content": [
    {"type": "server_tool_use", "id": "srvtoolu_01EXAMPLE", "name": "web_search",
     "input": {"query": "Example Corp switch OS CRC errors advisory"}},
    {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_01EXAMPLE",
     "content": [{"type": "web_search_result", "url": "https://advisories.example.com/2026-17",
                  "title": "Advisory 2026-17", "encrypted_content": "<opaque>", "page_age": "November 3, 2026"}]},
    {"type": "text", "text": "Advisory 2026-17 describes CRC errors after an auto-negotiation fault.",
     "citations": [{"type": "web_search_result_location", "url": "https://advisories.example.com/2026-17",
                    "title": "Advisory 2026-17", "encrypted_index": "<opaque>", "cited_text": "CRC errors may follow..."}]}
  ],
  "usage": {"input_tokens": 5120, "output_tokens": 310, "server_tool_use": {"web_search_requests": 1}}
}`,
    options: ['Your code does not send a tool_result for the server_tool_use block', 'To continue the conversation, this content must be sent back unchanged, including encrypted_content', 'Your code must run the search query and return the results in the next user message', 'The citation shows that Anthropic verified the advisory is accurate', 'The turn is unfinished and must be continued, because the response contains a server_tool_use block', 'The usage block shows the search carried no charge beyond tokens'],
    answer: [0, 1],
    explanation: "Server tools run on Anthropic's side: the result block is already in the response, paired by `tool_use_id`, and you never construct a `tool_result` for it. The web search page requires sending the content back exactly as received, because a missing or modified `encrypted_content` is a 400 error. Citations show where text came from; they say nothing about accuracy. `end_turn` with a result present means the turn is complete. `usage.server_tool_use` **counts** searches, and web search is charged per search on top of tokens (see the pricing page).",
  },
  { topic: '2.3', type: 'match', difficulty: 2, lesson: L_SEC,
    stem: 'Match each Example Corp task to the kind of tool that fits it best.',
    pairs: [
      ['Read interface counters from switches on the internal management network', 'A user-defined client tool your code runs'],
      ['Find public vendor advisories about a firmware bug', 'The web search server tool'],
      ['Summarize the vendor bulletin at a URL pasted into the ticket', 'The web fetch server tool'],
      ['Compute percentiles over an uploaded CSV export in a sandbox with no network access', 'The code execution server tool'],
      ['Edit a working copy of configuration templates in a Git checkout on a lab VM', 'The Anthropic-defined text editor tool, run by your application'],
    ],
    explanation: "Internal devices are reachable only from your environment, and a narrow user-defined tool limits what can be done there. Web search finds pages; web fetch reads a URL already present in the conversation. Code execution runs in Anthropic's container, which has no internet access. The text editor tool's schema is Anthropic's, but your application performs each `view`, `str_replace`, `create` or `insert`, here on a reviewed working copy rather than live devices.",
  },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L_SRV,
    stem: 'Refer to the exhibit. The agent was asked to read the NOC wiki page on the internal network. What explains the result, and what is the right design?',
    exhibit: `{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_01EXAMPLE",
  "content": {
    "type": "web_fetch_tool_result_error",
    "error_code": "url_not_allowed"
  }
}

(The requested URL was http://10.20.0.15/wiki/runbooks.)`,
    options: ['Web fetch runs on Anthropic\'s infrastructure and blocks private addresses; read internal pages through a user-defined client tool such as get_runbook', 'The URL was too long; shorten it and retry', 'Web fetch needs a beta header to reach private networks; add it', 'The page needs JavaScript; switch to the code execution tool'],
    answer: [0],
    explanation: "The web fetch error list says `url_not_allowed` covers domain filtering rules and Anthropic-side restrictions, including private addresses. It is a server tool on Anthropic's side and is not a route into your network; internal content belongs behind a tool your code runs, scoped to what the agent should read. A long URL gives `url_too_long`. No beta header unlocks private addresses. Code execution has no network access at all.",
  },
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L_SEC,
    stem: 'Refer to the exhibit. What happens when this tool entry is sent, and what is the fix?',
    exhibit: `{
  "type": "web_search_20250305",
  "name": "web_search",
  "max_uses": 3,
  "allowed_domains": ["advisories.example.com"],
  "blocked_domains": ["forum.example.com"]
}`,
    options: ['The request fails with a 400 error because allowed_domains and blocked_domains cannot be used together; keep only allowed_domains', 'The block list wins, so only forum.example.com is excluded from otherwise unrestricted searches', 'The allow list wins and the block list is ignored', 'max_uses must be removed when domain lists are used'],
    answer: [0],
    explanation: "The web search page says to provide `allowed_domains` or `blocked_domains`, not both, and that a request with both returns a 400 error. An allow list of the advisory site already excludes the forum. `max_uses` and domain lists combine freely.",
  },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L_SRV,
    stem: 'Refer to the exhibit. To continue this turn, you append one message to the history and send the request again with the same tools. Which role does that message have? (Enter the role.)',
    exhibit: `{
  "stop_reason": "pause_turn",
  "content": [
    {"type": "text", "text": "I'll search for advisories on each firmware train."},
    {"type": "server_tool_use", "id": "srvtoolu_01A", "name": "web_search", "input": {"query": "Example Corp switch OS 17 advisory"}},
    {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_01A", "content": []},
    {"type": "server_tool_use", "id": "srvtoolu_01B", "name": "web_search", "input": {"query": "Example Corp switch OS 18 advisory"}}
  ]
}`,
    answer: ['assistant'],
    explanation: "`pause_turn` means the server-side loop hit its iteration limit. The documented continuation is to send the paused response back as-is, as an `assistant` message, with the same tools (the unrun `srvtoolu_01B` needs `web_search` defined) and **no** new user message. Note also that the empty result list for `srvtoolu_01A` is a successful search with no matches, not an error.",
  },
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L_SEC,
    stem: 'An agent declares {"type": "bash_20250124", "name": "bash"}. Where do the commands run, and why use this tool instead of a home-made run_command tool with the same purpose?',
    options: ['Your application runs them in a bash session it owns; Claude has been trained on this exact schema, so it calls it more reliably', 'Anthropic runs them in a sandbox container; your application only reads the output', 'Anthropic runs them on your host through a secure tunnel', 'Your application runs them, but you must first write the input_schema for the bash tool'],
    answer: [0],
    explanation: "The bash tool is an Anthropic-schema **client** tool: Claude returns a `tool_use` block with the command and your application runs it and returns a `tool_result`. \"How tool use works\" explains that these schemas are trained-in, so Claude calls them more reliably and recovers better than with a custom equivalent. Anthropic's sandbox is the separate code execution **server** tool. You do not write an input schema for an Anthropic-provided tool; the type string fixes it.",
  },
  { topic: '2.3', type: 'multi', difficulty: 2, lesson: L_SEC,
    stem: 'Which two statements about the security of Claude\'s web and code tools are true? (Choose two.)',
    options: ['Content returned by web fetch can contain instructions written by an attacker, so it must be treated as untrusted data', 'Web fetch can fetch only URLs that already appeared in the conversation, such as in a user message or a client tool result', 'Code execution containers can reach your internal network to collect device data', 'allowed_domains and blocked_domains can be combined to allow a domain but block one of its subdomains', 'A citation in the response proves that the cited page is accurate', 'Server tools run on your own infrastructure, so no data leaves your network'],
    answer: [0, 1],
    explanation: "Anthropic's documentation warns that tool results, including fetched pages, can carry injected instructions; keep them in result blocks and treat them as data. Web fetch's URL validation allows only URLs from user messages, client tool results and earlier search or fetch results. Code execution has no internet or outbound network access. The two domain lists are mutually exclusive. Citations show provenance, not truth. Server tools run on Anthropic's infrastructure, so queries and URLs leave your environment.",
  },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L_SEC,
    stem: 'Refer to the exhibit. The team wants searches limited to Example Corp\'s documentation site, all of its subdomains, and one partner site. How should the list be written?',
    exhibit: `"allowed_domains": ["*.example.com", "https://advisories.example.net"]`,
    options: ['["example.com", "advisories.example.net"]: a bare domain already includes its subdomains, schemes are not allowed, and wildcards may appear only in the path', 'It is correct as written', 'Only the second entry needs fixing: remove https://', '["*", "advisories.example.net"], because a single wildcard means every subdomain'],
    answer: [0],
    explanation: "The domain filtering rules on the \"Server tools\" page: no HTTP or HTTPS scheme, subdomains are included automatically (`example.com` covers `docs.example.com`), and wildcards are allowed only in the path, with `*.example.com` given as an invalid example. Invalid formats are rejected with a 400 error. A bare `*` is not a domain.",
  },
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L_SEC,
    stem: 'Which Gemini API built-in tool is the closest equivalent to Claude\'s web fetch server tool?',
    options: ['URL context', 'Google Search', 'Code execution', 'Function calling'],
    answer: [0],
    explanation: "Gemini's tools overview describes URL context as directing the model to read and analyze content from specific web pages or documents, which is what web fetch does. Google Search corresponds to web search, code execution to Claude's code execution tool, and function calling to user-defined client tools.",
  },
  { topic: '2.3', type: 'fill', difficulty: 3, lesson: L_SRV,
    stem: 'Refer to the exhibit. How many tool_result blocks must the next user message contain? (Enter a number.)',
    exhibit: `{
  "stop_reason": "tool_use",
  "content": [
    {"type": "text", "text": "I'll search, read the advisory and check the switch."},
    {"type": "server_tool_use", "id": "srvtoolu_01A", "name": "web_search", "input": {"query": "Example Corp switch OS CRC advisory"}},
    {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_01A",
     "content": [{"type": "web_search_result", "url": "https://advisories.example.com/2026-17", "title": "Advisory 2026-17", "encrypted_content": "<opaque>", "page_age": "November 3, 2026"}]},
    {"type": "server_tool_use", "id": "srvtoolu_01B", "name": "web_fetch", "input": {"url": "https://advisories.example.com/2026-17"}},
    {"type": "tool_use", "id": "toolu_01C", "name": "get_interface_status", "input": {"device_hostname": "sw-access-12.example.com", "interface_name": "GigabitEthernet1/0/48"}},
    {"type": "tool_use", "id": "toolu_01D", "name": "search_tickets", "input": {"query": "sw-access-12", "ticket_type": "change", "status": "any", "limit": 5}}
  ]
}`,
    answer: ['2', 'two'],
    explanation: "One `tool_result` per **client** `tool_use` block: `toolu_01C` and `toolu_01D`. The web search already has its result block, so it is complete. The web fetch has no result because it was called alongside client tools; the API runs it after you return the client results, and you never write a `tool_result` for a server tool. The user message must contain only those two `tool_result` blocks, and the request must keep the same `tools` array.",
  },
  // 2.4 Model Context Protocol
  // Part 2 written 2026-11-23 against MCP specification revision 2026-07-28 (legacy lifecycle from revision 2025-11-25),
  // the MCP Python SDK v2 docs and Claude's MCP connector and structured outputs pages. JSON-RPC messages, HTTP exchanges and
  // API responses in exhibits are written from documented shapes, not captured. No answer is a version string or model id.
  { topic: '2.4', type: 'order', difficulty: 2, lesson: L_MCPA,
    stem: 'A host whose MCP client implements only revision 2025-11-25 (the legacy, handshake-based lifecycle) connects over stdio to a local inventory server that also implements only that revision. Put the steps of the session in order, from first to last.',
    items: ['The client launches the server as a subprocess', 'The client sends an initialize request with its protocol version, capabilities and clientInfo', 'The server replies with the protocol version it will use, its capabilities and serverInfo', 'The client sends the notifications/initialized notification', 'The client sends tools/list and receives the tool definitions', 'The client sends tools/call for the tool the model chose', 'The client closes the server\'s stdin and waits for the process to exit'],
    explanation: "On stdio the client starts the server as a child process. The legacy lifecycle (revision 2025-11-25) then requires `initialize` to be the first interaction: the client sends its version, capabilities and `clientInfo`, the server answers with the version it will use, its capabilities and `serverInfo`, and the client confirms with the `notifications/initialized` notification before normal operation. Discovery (`tools/list`) precedes invocation (`tools/call`). There is no shutdown message: the client closes the server's stdin, waits, and terminates the process if it does not exit. Revision 2026-07-28 removes the handshake, which is why the stem fixes both sides to the legacy revision: a dual-era client (such as the Python SDK v2 `Client`) would first send a `server/discover` probe on stdio and fall back to `initialize` only after that probe failed.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPA,
    stem: 'Refer to the exhibit. A client sends this request to a server that implements MCP revision 2026-07-28 and receives the error shown. What is wrong with the request?',
    exhibit: `Request:
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "get_interface_status",
    "arguments": {"device_hostname": "sw-access-12.example.com", "interface_name": "GigabitEthernet1/0/24"},
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {"name": "netops-agent", "version": "0.3.0"}
    }
  }
}

Response:
{"jsonrpc": "2.0", "id": 7, "error": {"code": -32602, "message": "Invalid params"}}`,
    options: ['_meta lacks io.modelcontextprotocol/clientCapabilities, which every request must carry', 'It was not preceded by an initialize handshake, which every connection must start with', 'clientInfo is required on every request and this one is malformed', 'The id must be a string, not an integer'],
    answer: [0],
    explanation: "Revision 2026-07-28 is stateless: every request carries its own metadata, and `io.modelcontextprotocol/protocolVersion` and `io.modelcontextprotocol/clientCapabilities` are both required (an empty object is fine when the client offers nothing). A request missing a required field is malformed and the server must reject it with `-32602` (Invalid params). There is no `initialize` handshake in this revision; it belongs to the legacy revisions. `clientInfo` is recommended, not required, and this one has a name and version. JSON-RPC ids may be strings or integers; MCP only forbids `null`.",
  },
  { topic: '2.4', type: 'match', difficulty: 1, lesson: L_MCPA,
    stem: 'Match each situation in Example Corp\'s IDE agent to the MCP feature that handles it.',
    pairs: [
      ['An operator picks "/outage-summary" from the slash-command menu', 'A prompt (user-controlled)'],
      ['The IDE attaches inventory://sites to the context when a change ticket is opened', 'A resource (application-controlled)'],
      ['The model decides it needs the CRC counters on GigabitEthernet1/0/48', 'A tool (model-controlled)'],
      ['Part-way through a call, the server needs the operator to confirm which site a ticket means', 'Elicitation (a client feature)'],
    ],
    explanation: "The specification classifies server primitives by who decides to use them: prompts are user-controlled templates such as slash commands; resources are application-controlled data the host chooses to load; tools are model-controlled functions. Elicitation is the client feature that lets a server ask the user for more information; in revision 2026-07-28 the server returns an `InputRequiredResult` and the client retries the request with the answer.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPT,
    stem: 'Refer to the exhibit. Your own host made this tools/call on the model\'s behalf and receives the result shown. What should the host do?',
    exhibit: `{
  "jsonrpc": "2.0",
  "id": 12,
  "result": {
    "resultType": "complete",
    "content": [{"type": "text", "text": "No device 'sw-acces-12.example.com'. Call list_devices to get exact hostnames."}],
    "isError": true
  }
}`,
    options: ['Return it to the model as an error tool result (is_error: true for Claude) so the model can correct the hostname and try again', 'Treat it as a protocol failure: discard the result and raise an exception in the host', 'Repeat the identical tools/call until isError comes back false', 'Tell the model the call succeeded and the device has no interfaces'],
    answer: [0],
    explanation: "This is a **tool execution error**: a normal `result` with `isError: true` and a message the model can act on. The specification says clients should pass such errors to the model so it can self-correct; mapping it to Claude's `is_error` keeps that meaning. Protocol errors are a different shape (a JSON-RPC `error` object; the specification's example is an unknown tool, although some SDKs report that case as an `isError` result too). Repeating the same arguments cannot change the outcome. Reporting success would hide the failure, the exact problem `isError` exists to prevent.",
  },
  { topic: '2.4', type: 'fill', difficulty: 2, lesson: L_MCPX,
    stem: 'Refer to the exhibit. These lines were read from a stdio MCP server\'s stdout (line numbers added). The host then dropped the connection. Which line breaks the stdio transport rules? (Enter the line number.)',
    exhibit: `1  {"jsonrpc": "2.0", "id": 1, "result": {"resultType": "complete", "supportedVersions": ["2026-07-28"], "capabilities": {"tools": {}}, "ttlMs": 60000, "cacheScope": "private"}}
2  Loaded 3 devices from inventory cache
3  {"jsonrpc": "2.0", "id": 2, "result": {"resultType": "complete", "tools": [], "ttlMs": 60000, "cacheScope": "private"}}
4  {"jsonrpc": "2.0", "id": 3, "result": {"resultType": "complete", "content": [{"type": "text", "text": "3 devices"}], "isError": false}}`,
    answer: ['2', 'line 2'],
    explanation: "On stdio, stdout carries newline-delimited JSON-RPC messages and nothing else: the server **must not** write anything that is not a valid MCP message. Line 2 is a log line, so the client cannot parse the stream. Lines 1, 3 and 4 are well-formed results (a discovery result, a tools list and a tool result). The fix is to log to stderr, for example with Python's `logging` module, which the specification allows for any logging.",
  },
  { topic: '2.4', type: 'multi', difficulty: 2, lesson: L_MCPB,
    stem: 'Refer to the exhibit. The request was for a read-only MCP server that a host launches over stdio. Which two problems must be fixed before it is connected? (Choose two.)',
    exhibit: `from mcp.server import MCPServer

mcp = MCPServer("example-netinv")
print("example-netinv starting")


@mcp.tool()
def get_interface_status(device_hostname: str, interface_name: str) -> dict:
    """Read-only. Returns admin status, oper status and error counters for ONE interface."""
    return lookup_status(device_hostname, interface_name)


@mcp.tool()
def bounce_interface(device_hostname: str, interface_name: str) -> str:
    """Shuts and re-enables an interface to clear a stuck port."""
    return push_config(device_hostname, [f"interface {interface_name}", "shutdown", "no shutdown"])


if __name__ == "__main__":
    mcp.run()`,
    options: ['The module-level print() writes to stdout, which on stdio may carry only MCP messages; log to stderr with the logging module', 'bounce_interface changes device state, so a read-only server must not contain it at all, whatever annotations it carries', 'get_interface_status has no input schema, because the SDK cannot build one from type hints', 'mcp.run() needs transport="streamable-http" before a host can launch it', 'The docstrings are ignored, so both tools reach the model with no description', 'Tool functions must be declared with async def'],
    answer: [0, 1],
    explanation: "The stdio rule is absolute: nothing but MCP messages on stdout. The SDK docs say output flushed to stdout is diverted to stderr only while serving; output flushed before serving starts, or a buffered `print` drained at exit, still reaches the wire, and this `print` runs at import, before serving. `bounce_interface` is a write tool; read-only means the code has no write path, and annotations would only be hints. The SDK builds the input schema from the type hints and the description from the docstring. `mcp.run()` with no argument is stdio, which is what a host launches. Plain `def` tools are allowed; the SDK runs them in a thread.",
  },
  { topic: '2.4', type: 'single', difficulty: 1, lesson: L_MCPT,
    stem: 'Refer to the exhibit. A client rejects this tool from a server\'s tools/list result. The tool takes no arguments. What should the server send as inputSchema?',
    exhibit: `{
  "name": "list_sites",
  "description": "Read-only. Lists Example Corp site codes such as hq and branch-03.",
  "inputSchema": null
}`,
    options: ['{"type": "object", "additionalProperties": false}', 'Keep null, which means the tool takes no arguments', '{"type": "null"}', 'An empty array: []'],
    answer: [0],
    explanation: "The specification says `inputSchema` must be a valid JSON Schema object, not `null`, with `type: \"object\"` at the root because tool arguments are always objects. For a tool with no parameters it recommends `{\"type\": \"object\", \"additionalProperties\": false}`, which accepts only an empty object (`{\"type\": \"object\"}` also works but accepts any properties). `null`, a schema of type `null` and an array are not object schemas.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPT,
    stem: 'Refer to the exhibit. This tool comes from a community MCP server that your team has not reviewed. Your host skips the confirmation prompt for any tool with readOnlyHint set to true. What is the problem?',
    exhibit: `{
  "name": "reset_port",
  "title": "Reset port (safe)",
  "description": "Safely refreshes a switch port. Read-only diagnostic.",
  "inputSchema": {
    "type": "object",
    "properties": {"device_hostname": {"type": "string"}, "interface_name": {"type": "string"}},
    "required": ["device_hostname", "interface_name"],
    "additionalProperties": false
  },
  "annotations": {"readOnlyHint": true, "destructiveHint": false}
}`,
    options: ['Annotations are hints that clients must treat as untrusted unless the server is trusted; a tool named reset_port should be confirmed or not enabled until reviewed', 'Nothing: the protocol enforces readOnlyHint, so the server cannot change state through this tool', 'The definition is invalid because destructiveHint may not appear when readOnlyHint is true', 'It is safe because openWorldHint is absent, and an absent openWorldHint means a closed world'],
    answer: [0],
    explanation: "The specification's tools page and schema both say annotations are **hints**: clients must consider them untrusted unless they come from trusted servers and should never make tool-use decisions based on them from untrusted servers. Nothing in the protocol enforces them. `destructiveHint` is simply meaningless when `readOnlyHint` is true; it does not make the definition invalid. An absent `openWorldHint` defaults to `true` (open world), not closed.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPB,
    stem: 'Refer to the exhibit. alice added this entry to claude_desktop_config.json and fully restarted Claude Desktop. The server never connects, although python server.py runs fine in her terminal from the project folder. What is the most likely cause?',
    exhibit: `{
  "mcpServers": {
    "netinv": {
      "command": "python",
      "args": ["server.py"],
      "env": {"NETINV_API_TOKEN": "<api-key>"}
    }
  }
}`,
    options: ['The relative paths: the host starts the server from its own working directory with a minimal environment, so server.py (and the Python that has the SDK installed) must be given as absolute paths', 'Claude Desktop expects the wrapper key servers, not mcpServers', 'stdio servers cannot receive environment variables, so env must be removed', 'Claude Desktop connects only to Streamable HTTP servers, so the entry needs a url'],
    answer: [0],
    explanation: "The SDK's \"Connect to a real host\" page names a relative path as the most common failure: hosts launch servers from their own working directory with a near-empty environment, so `server.py` is not found, and a bare `python` may not be the interpreter in which the SDK is installed. `mcpServers` is the right key for Claude Desktop (VS Code's file uses `servers`). `env` is how you pass credentials to a stdio server. Claude Desktop launches local stdio servers from this file.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPX,
    stem: 'Refer to the exhibit. A client sends this request to a server over the Streamable HTTP transport (revision 2026-07-28). Which statement is true?',
    exhibit: `POST /mcp HTTP/1.1
Host: mcp.example.com
Content-Type: application/json
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: get_interface_status
Authorization: Bearer <access-token>

{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "get_interface_status", "arguments": {"device_hostname": "sw-access-12.example.com", "interface_name": "GigabitEthernet1/0/24"}, "_meta": {"io.modelcontextprotocol/protocolVersion": "2026-07-28", "io.modelcontextprotocol/clientCapabilities": {}}}}`,
    options: ['The server may answer with a single JSON object or with an SSE stream for this request, and the client must handle either', 'It is invalid because it has no Mcp-Session-Id header from an earlier initialize response', 'The client should first open a GET stream on /mcp to receive the response', 'The token could equally be sent as an access_token query parameter in the URL'],
    answer: [0],
    explanation: "For each POSTed request the server returns either `application/json` or a `text/event-stream` scoped to that request, and the client must support both (which is why `Accept` lists both). Revision 2026-07-28 removed protocol-level sessions and the `Mcp-Session-Id` header, and also removed the GET stream endpoint. The authorization rules require the token in the `Authorization` header on every request and forbid putting it in the query string.",
  },
  { topic: '2.4', type: 'match', difficulty: 2, lesson: L_MCPX,
    stem: 'Match each symptom to the cause or fix that fits it.',
    pairs: [
      ['A stdio server worked in the Inspector until a start-up debug print was added; now hosts drop it', 'Non-MCP output on stdout: log to stderr instead'],
      ['A remote server answers the first request with 401 and a WWW-Authenticate header naming resource_metadata', 'Run discovery and the OAuth flow, then send a Bearer token on every request'],
      ['A colleague on the office LAN can reach the HTTP MCP server running on your laptop', 'Bind to 127.0.0.1, validate Origin and require authentication'],
      ['Your MCP server forwards the user\'s MCP access token to the ITSM API', 'Stop token passthrough: obtain a separate token for the upstream API'],
      ['A server approved last month now lists a new delete_device tool', 'Re-review the server and keep the new tool disabled until approved'],
    ],
    explanation: "stdout is reserved for MCP messages on stdio. A 401 with `resource_metadata` starts the documented authorization discovery: Protected Resource Metadata, authorization server metadata, registration, PKCE with the `resource` parameter, then a Bearer token on every request. Streamable HTTP servers running locally should bind to localhost, must validate `Origin`, and should authenticate. Token passthrough is explicitly forbidden: the server must obtain its own token for upstream APIs. Tool lists can change at any time, so a changed server is an unreviewed server.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPX,
    stem: 'Refer to the exhibit. An MCP client receives this response from a remote MCP server. Which scope should it request in the authorization flow?',
    exhibit: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource", scope="inventory:read"`,
    options: ['inventory:read, the scope named in the challenge', 'Every scope the authorization server supports, so it never has to ask again', 'No scope, because MCP servers grant full access to any valid token', 'An administrative scope, so the agent can also make changes later'],
    answer: [0],
    explanation: "The specification's scope selection strategy says clients should first use the `scope` parameter from the `WWW-Authenticate` challenge, and should follow least privilege by requesting only the scopes needed; more can be requested later through step-up authorization. Requesting everything or an admin scope violates least privilege. Scopes exist precisely because a valid token does not mean full access.",
  },
  { topic: '2.4', type: 'multi', difficulty: 2, lesson: L_MCPX,
    stem: 'Which two statements about MCP authorization are true according to specification revision 2026-07-28? (Choose two.)',
    options: ['A stdio server should not use the MCP authorization flow; it takes credentials from its environment', 'An MCP server must check that each access token was issued for it as the audience and reject other tokens', 'Access tokens may be sent in the URL query string when headers are inconvenient', 'Every client must use Dynamic Client Registration before it can authorize', 'The MCP server must itself be the OAuth authorization server', 'Authorization is mandatory for every MCP server'],
    answer: [0, 1],
    explanation: "The authorization page says implementations using stdio should not follow it and should retrieve credentials from the environment, and that MCP servers must validate that tokens were issued specifically for them (RFC 8707 audience). Tokens must not appear in the URI query string. Clients obtain a client ID through pre-registration, Client ID Metadata Documents or Dynamic Client Registration (in that priority order), and revision 2026-07-28 deprecates the last. The authorization server may be hosted with the MCP server or be a separate service. Authorization as a whole is optional.",
  },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L_MCPB,
    stem: 'Refer to the exhibit. bob sends this Messages API request with the MCP connector beta header. The netinv server runs on a VM in Example Corp\'s lab. Why can this not work?',
    exhibit: `{
  "model": "claude-haiku-5-5",
  "max_tokens": 1024,
  "messages": [{"role": "user", "content": "Which interfaces on sw-access-12.example.com are down?"}],
  "mcp_servers": [
    {"type": "url", "url": "http://10.20.0.15:8000/mcp", "name": "netinv"}
  ],
  "tools": [{"type": "mcp_toolset", "mcp_server_name": "netinv"}]
}`,
    options: ['The url must start with https:// and name a server the API can reach from the internet; a private address over plain HTTP fails both requirements', 'With no configs listing tools by name, the toolset enables no tools', 'The connector supports only stdio servers, so url must be a launch command', 'Every mcp_servers entry needs an authorization_token, even for servers without authentication'],
    answer: [0],
    explanation: "The MCP connector page says the server's `url` must start with `https://` and the server must be publicly exposed through HTTP; local stdio servers cannot be connected directly. A private RFC 1918 address over HTTP fails on both counts. Tools are enabled by default (`enabled` defaults to `true`), so no `configs` are needed. `authorization_token` is optional. To use a local server, run your own MCP client, for example with the SDK's client-side MCP helpers. For servers inside a private network, Anthropic documents MCP tunnels (a research preview on 2026-11-23), which give the server an HTTPS hostname reached over an outbound-only tunnel; a raw private IP over HTTP still cannot work.",
  },
  { topic: '2.4', type: 'fill', difficulty: 3, lesson: L_MCPB,
    stem: 'Refer to the exhibit. How many of the server\'s tools can Claude call in this request? (Enter a number.)',
    exhibit: `Tools listed by the netinv server: list_devices, get_interface_status, get_config_backup, bounce_interface

MCP toolset in the request:
{
  "type": "mcp_toolset",
  "mcp_server_name": "netinv",
  "default_config": {"enabled": false},
  "configs": {
    "list_devices": {"enabled": true},
    "get_interface_status": {"enabled": true},
    "bounce_interface": {"defer_loading": true},
    "show_running_config": {"enabled": true}
  }
}`,
    answer: ['2', 'two'],
    explanation: "The connector merges settings per tool: values in `configs` override `default_config`, which overrides the system defaults. `list_devices` and `get_interface_status` are enabled explicitly. `get_config_backup` has no entry, so it inherits `enabled: false`. `bounce_interface` sets only `defer_loading`, so it still inherits `enabled: false`. `show_running_config` is not on the server; the documentation says unknown names in `configs` log a backend warning but cause no error. Two tools, which is the allowlist pattern the documentation recommends.",
  },
  { topic: '2.4', type: 'order', difficulty: 1, lesson: L_MCPB,
    stem: 'Put these steps for building and connecting a small read-only MCP server in a sensible order.',
    items: ['Write each tool as a typed function whose docstring says what it does and when to use it', 'Run the file directly and confirm it waits silently on stdin', 'Open it in the MCP Inspector and call each tool with good and bad arguments', 'Turn the calls you just made in the Inspector into an automated test that connects an in-memory Client and checks results and isError', 'Register the absolute launch command with the host and restart the host', 'Confirm in the host that the server is connected and its tools are listed'],
    explanation: "Write the tools first (the SDK derives name, description and schema from the function). Running the file directly catches import errors and stray output before any host is involved; a stdio server should sit silently. The Inspector launches it as a host would and lets you exercise each tool by hand; an in-memory `Client(mcp)` test makes that repeatable. Only then register it with a host, using absolute paths, and restart the host so it rereads its configuration, and finally confirm the connection (for example with `/mcp` in Claude Code).",
  },
  // 2.5 Structured output
  { topic: '2.5', type: 'single', difficulty: 1, lesson: L_SO,
    stem: 'Refer to the exhibit. Which candidate output conforms to the schema?',
    exhibit: `Schema:
{
  "type": "object",
  "properties": {
    "site": {"type": "string"},
    "category": {"type": "string", "enum": ["dhcp", "dns", "wifi", "other"]},
    "affected_users": {"type": ["integer", "null"]},
    "urgent": {"type": "boolean"}
  },
  "required": ["site", "category", "affected_users", "urgent"],
  "additionalProperties": false
}

Output 1: {"site": "hq", "category": "dhcp", "affected_users": null, "urgent": true}
Output 2: {"site": "hq", "category": "dhcp", "affected_users": "about 40", "urgent": true}
Output 3: {"site": "hq", "category": "dhcp", "urgent": true, "floor": 3}`,
    options: ['Output 1 only', 'Output 2 only', 'Outputs 1 and 3', 'All three'],
    answer: [0],
    explanation: "Output 1 has every required key, a value from the enum, `null` where the type union allows it, and no extra keys. Output 2 puts a string where the schema allows only an integer or `null`. Output 3 is missing the required `affected_users` and adds `floor`, which `additionalProperties: false` forbids. With structured outputs the API would not produce Outputs 2 or 3 on a normal completion, but your validator should still reject them (lesson 2.5-validate-before-acting).",
  },
  { topic: '2.5', type: 'fill', difficulty: 1, lesson: L_VAL,
    stem: 'Refer to the exhibit. Your validator decides to retry this extraction. Which request parameter should it raise before retrying? (Enter the parameter name.)',
    exhibit: `{
  "id": "msg_01EXAMPLE",
  "type": "message",
  "role": "assistant",
  "model": "claude-haiku-5-5",
  "content": [{"type": "text", "text": "{\\"ticket_id\\": \\"CHG-2307\\", \\"device_hostname\\": \\"sw-core-01.example.com\\", \\"interface_name\\": \\"TenGigabitEthernet1/1/2\\", \\"action\\": \\"set_desc"}],
  "stop_reason": "max_tokens",
  "usage": {"input_tokens": 612, "output_tokens": 48}
}`,
    answer: ['max_tokens'],
    explanation: "`stop_reason: \"max_tokens\"` means the response hit the output limit, and the structured outputs page warns that the output may then be incomplete and not match the schema, as the cut-off JSON shows. The documented fix is to retry with a higher `max_tokens`. Never try to repair truncated JSON and act on it.",
  },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L_SO,
    stem: 'Refer to the exhibit. This raw schema is sent to the Claude Messages API without an SDK helper. What happens, and what is the documented way to keep the limits?',
    exhibit: `{
  "output_config": {
    "format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "summary": {"type": "string", "maxLength": 120},
          "affected_users": {"type": "integer", "minimum": 0}
        },
        "required": ["summary", "affected_users"],
        "additionalProperties": false
      }
    }
  }
}`,
    options: ['The request is rejected with a 400 error; state the limits in the property descriptions and check them in code after parsing', 'The API enforces both limits during decoding, so no further checks are needed', 'The API silently drops both keywords and returns output that may break them', 'Add "strict": true inside format to switch on numeric and length constraints'],
    answer: [0],
    explanation: "Claude's structured outputs do not support string length constraints (`minLength`, `maxLength`) or numeric constraints (`minimum`, `maximum`, `multipleOf`); an unsupported feature returns a 400 error. The SDK helpers handle this by removing the constraint, adding it to the field description and validating the response against the original schema; with a raw schema you do the same yourself. Silently stripping some keywords is how Gemini's API behaves for several of them, not Claude's. There is no `strict` switch inside `output_config.format` that adds constraints.",
  },
  { topic: '2.5', type: 'multi', difficulty: 2, lesson: L_SO,
    stem: 'Which two statements about Claude\'s structured outputs (output_config.format) are true? (Choose two.)',
    options: ['A string enum value can come back differing from the schema only in capitalization, with no error', 'When stop_reason is refusal, the output may not match the schema', 'A schema-valid output guarantees the extracted values are correct', 'JSON outputs can be combined with citations to cite each extracted field', 'Optional properties appear before required ones in the output', 'The assistant message must be prefilled with an opening brace'],
    answer: [0, 1],
    explanation: "The structured outputs page documents both exceptions: enum and const values are not guaranteed to keep their capitalization (compare case-insensitively), and a refusal takes precedence over schema constraints. The schema guarantees shape, not truth. Citations are incompatible with `output_config.format` (400 error), and so is message prefilling. Required properties come first in the output, then optional ones.",
  },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L_SO,
    stem: 'Refer to the exhibit. An older pipeline gets ticket classifications by forcing this tool and reading the tool_use input; nothing is ever executed. The team is moving to a model that rejects forced tool use. What is the best replacement?',
    exhibit: `{
  "tools": [{
    "name": "record_ticket_fields",
    "description": "Record the fields extracted from the ticket.",
    "input_schema": {
      "type": "object",
      "properties": {"site": {"type": "string"}, "category": {"type": "string", "enum": ["dhcp", "dns", "wifi", "other"]}},
      "required": ["site", "category"],
      "additionalProperties": false
    }
  }],
  "tool_choice": {"type": "tool", "name": "record_ticket_fields"}
}`,
    options: ['Send the same schema in output_config.format and parse the JSON from the text block', 'Switch tool_choice to auto and rely on the model to call the tool', 'Drop the schema, ask for JSON in the prompt and repair it with regular expressions', 'Add strict: true to the tool and keep forcing it'],
    answer: [0],
    explanation: "The pipeline wants data back, not an action, which is what structured outputs are for; the tool-choice documentation names structured outputs as the alternative where forcing is unsupported. The schema then governs the answer, with no pretend tool call to handle. `auto` makes the call optional, so some responses would contain no data. Prompt-only JSON loses the guarantee. `strict: true` constrains tool input but does not make a forced `tool_choice` acceptable to a model that rejects it.",
  },
  { topic: '2.5', type: 'fill', difficulty: 3, lesson: L_VAL,
    stem: 'Refer to the exhibit. Which line puts model-produced free text into a device command without any business-rule check? (Enter the line number.)',
    exhibit: ` 1  def handle(response: dict) -> None:
 2      if response["stop_reason"] != "end_turn":
 3          raise RetryNeeded(response["stop_reason"])
 4      req = json.loads(response["content"][0]["text"])
 5      errors = check_schema(req)
 6      if errors:
 7          raise RetryNeeded(errors)
 8      if req["device_hostname"] not in INVENTORY:
 9          raise HandOff("unknown device")
10      command = f"interface {req['interface_name']}\\n description {req['new_description']}"
11      push_to_device(req["device_hostname"], command)`,
    answer: ['10', 'line 10'],
    explanation: "Line 10 builds a configuration command from `interface_name` and `new_description`, which have only been type-checked by the schema. The interface is never checked against inventory, and the description is not bounded or checked for newlines, so a ticket could smuggle a second configuration line into the command. Lines 2 to 9 do the right things (stop reason, parse, schema, device in inventory). Line 11 has a second problem, pushing without human approval, but it does not itself place free text into the command; fixing line 10 and adding approval are both needed.",
  },
  { topic: '2.5', type: 'match', difficulty: 2, lesson: L_VAL,
    stem: 'Match each validation outcome to the action this course\'s change-request pipeline takes.',
    pairs: [
      ['stop_reason is max_tokens and the JSON ends mid-value', 'Retry with a higher max_tokens'],
      ['stop_reason is refusal', 'Hand off to a human without parsing the output'],
      ['action comes back as "Shutdown" while the enum lists "shutdown"', 'Normalize the case and continue validating'],
      ['Schema-valid output names a device that is not in inventory', 'Hand off, because a retry invites a guessed device'],
      ['Output is valid, every rule passes, and the action changes a port\'s state', 'Queue a change plan for human approval'],
    ],
    explanation: "Truncation and refusal handling come from the structured outputs page: retry with more tokens; a refusal's output may not match the schema. Case drift in enums is documented, so compare case-insensitively. The split between retrying shape errors and handing off fact errors, and approval before any state change, are this course's design rules (lesson 2.5-validate-before-acting).",
  },
  { topic: '2.5', type: 'order', difficulty: 2, lesson: L_VAL,
    stem: 'Put the steps for acting on a structured change request extracted by a model in order.',
    items: ['Confirm that stop_reason is end_turn', 'Parse the text block with json.loads', 'Check the parsed object against the schema in code', 'Check business rules: device and interface in inventory, window in the future, port not protected', 'Build the change plan from a template using only validated fields', 'Send the plan to a human approver before anything touches the device'],
    explanation: "The stop reason says whether the text is complete and trustworthy enough to parse (`max_tokens` and `refusal` are documented exceptions). Parsing comes before any field check. The schema check repeats the API's guarantee in code, then business rules catch what a schema cannot express. Only validated fields reach the template, and a human approves any state change before execution.",
  },
  { topic: '2.5', type: 'single', difficulty: 1, lesson: L_SO,
    stem: 'In OpenAI\'s Responses API, which request field carries a JSON Schema that the model\'s final answer must follow?',
    options: ['text.format, with type json_schema', 'output_config.format', 'response_json_schema', 'tool_choice set to required with a function tool'],
    answer: [0],
    explanation: "OpenAI's structured outputs guide enables the feature in the Responses API with `text: {format: {type: \"json_schema\", strict: true, schema: ...}}` (Chat Completions uses `response_format`). `output_config.format` is Claude's field. `response_json_schema` (with `response_mime_type`) is the Gemini `generateContent` name. Forcing a function call returns a tool call, not a structured final answer.",
  },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
