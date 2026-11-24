# Content Spec — Building AI Agents

A skills course with **no certification exam**. The outline in `content/blueprint.js` is this
site's own. Every lesson, question and flashcard is tagged with a blueprint topic id; together the
lessons must cover **every** `sub` item in your domain.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** Don't copy prose or long code from vendor documentation, blog posts,
   courses or books. Short API calls necessarily resemble the documentation; explanations must be
   your own.
2. **Technically airtight and current. Do not write API or SDK code from memory.** This field
   changes monthly and remembered details are often stale. For every API shape, parameter, SDK
   class or function, model id, stop reason, header, tool type string, limit and default, open
   the vendor's documentation as it reads today and copy the exact name from it:
   - Anthropic Claude: https://platform.claude.com/docs (Messages API, tool use, tool runner,
     structured outputs, prompt caching, extended / adaptive thinking, context management,
     batch, Agent SDK, hosted or managed agents, MCP connector) and the official SDK
     repositories under https://github.com/anthropics.
   - Model Context Protocol: https://modelcontextprotocol.io (specification, concepts, the
     Python and TypeScript SDKs under https://github.com/modelcontextprotocol).
   - OpenAI: https://platform.openai.com/docs (function calling, structured outputs, Agents SDK).
   - Google: https://ai.google.dev/gemini-api/docs (function calling) and the Agent Development
     Kit documentation.
   Lead with Claude and MCP examples in Python (TypeScript where it reads better), then say in a
   sentence or a small table how OpenAI and Gemini name the same idea. Use the model ids the
   vendor's documentation lists as current on the day you write, say that ids change, and never
   invent one. Record every documentation URL you relied on in REVIEW-TODO.md. If a detail cannot
   be confirmed from documentation, describe the idea without the specific name and list it.
   Design guidance (when to use an agent, tool design, orchestration patterns, evaluation,
   injection defence) should rest on the vendors' published engineering guidance and on OWASP's
   guidance for LLM applications, cited by name; say when something is this course's own advice.
3. **Question style.** Single, multi ("Choose two"), order, match and **fill** (~15%). No exam
   exists, so write questions that test judgment and reading: a tool definition with a flaw to
   spot, a transcript of an agent run to diagnose, a message history where the next message must
   be chosen, a snippet with one wrong line, a design scenario with a constraint (cost, safety,
   latency) that picks the answer. Use `exhibit` on at least 50% of questions: JSON tool
   definitions, message histories, tool results, short Python or TypeScript snippets, token usage
   reports, an MCP server definition, an agent transcript, an eval result table. Exactly one
   defensible answer set; explanations cover every option. Avoid questions whose answer is a
   version number, a price or a model name: those go stale.
4. **Names and secrets.** Company `Example Corp`; hosts `sw-core-01.example.com`; RFC 1918 and
   RFC 5737 addresses; users `alice`, `bob`. **API keys and tokens are always placeholders read
   from the environment** (`os.environ["ANTHROPIC_API_KEY"]`, `<api-key>`); never a string that
   looks like a real key, never a sample key copied from documentation. No real customer data,
   device configurations or ticket contents.
5. **Size (one writer per domain, then an independent reviewer).** About 2.5 questions per weight
   point: Domain 1 ~38, Domain 2 ~62, Domain 3 ~50, Domain 4 ~50, Domain 5 ~50; flashcards about
   60% of the question count. Write one to three lessons per topic so that every `sub` item is
   taught, about 900–1,500 words each. Each lesson has a "Try it yourself" section (a small build
   or a paper exercise; code labs say which SDK package to install and link its documentation,
   keep API spend tiny by naming a small model tier and an iteration cap, and work on Windows,
   macOS and Linux) and "Key takeaways". Lessons in Domain 5 and anywhere tools can change
   something must show the safe design: read-only first, least privilege, confirmation before
   irreversible actions, and treating tool results and retrieved content as untrusted.
6. **Reference tables.** Append 2–5 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `../az-104/content/reference.js`; `topic` must be a blueprint id). Use a
   `dNTables` constant spread into the default export; edit that shared file with the Edit tool
   only, never a script, and don't touch other domains' tables.
7. **Performance-style questions.** At least 25% of each domain's questions must be
   performance-based by the strict definition reviewers apply: an `order` question sequencing the
   steps or messages of a real task (the tool-use loop, an MCP session starting, building an
   eval); a `match` question pairing concrete scenarios or symptoms (not terms) with the design,
   pattern, cause or fix that fits; or a `fill` question whose answer is read or derived from an
   exhibit (the stop reason in a response, the missing field in a tool result, the token count
   that will be cached, the line with the bug). Term-to-definition matches do not count.
8. **Do not call any model API or run any agent on this PC.** No API keys, no requests to any
   model provider or hosted service, no `pip install` or `npm install`, no Docker or other
   containers, no VMs, no sudo. Verify from documentation fetched with curl (documentation pages
   and public GitHub repositories only). Offline checks are allowed and expected inside a
   `mktemp -d` directory: `python3 -m py_compile` on every Python sample (imports of SDK packages
   that are not installed are fine for compiling; say in REVIEW-TODO.md that samples were
   compiled but not run), `python3 -m json.tool` on every JSON sample, and running pure-Python
   logic that needs no SDK or network. Mark all API responses and transcripts as written from the
   documented shapes, not captured.
9. **Any host computer.** Learners run this site on Windows, macOS (Apple silicon and Intel) and
   Linux. Labs name tools that run on all three and give the environment-variable syntax for
   both a POSIX shell and PowerShell.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
