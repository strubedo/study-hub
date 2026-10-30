# Content Spec — AI Prompt Engineering (ChatGPT, Gemini, Claude)

A skills course (no certification exam) built on `content/blueprint.js`. Every lesson, question and
flashcard is tagged with a blueprint topic id; together the lessons must cover **every** sub-bullet of
every topic in your domain.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** Don't copy prose from CBT Nuggets, vendor guides or courses.
   Paraphrase and teach.
2. **Accurate and dated.** Technique advice must match the vendors' own guides:
   Anthropic (https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview and its
   sub-pages), OpenAI (https://platform.openai.com/docs/guides/prompt-engineering and
   help.openai.com), Google (https://ai.google.dev/gemini-api/docs/prompting-strategies and
   support.google.com/gemini). Fetch with `curl -sL` (or WebFetch). Product facts (model names,
   plan features, context sizes, data-retention and training policies, feature names like Projects,
   Gems, Custom GPTs, Memory) change often: verify each against the vendor's current page, write
   "as of October 2026" where it matters, and prefer stable concepts over volatile numbers.
   Questions must not hinge on a number that will change within months (e.g. exact context window
   sizes or prices). Never invent a model name or feature.
3. **Question style.** Mix single, multi ("Choose two"), order, match and **fill** (~15% fill with
   short exact answers, e.g. a technique name like `few-shot`). Many questions should show a prompt
   or an output in `exhibit` and ask what's wrong, which rewrite is best, or which technique
   applies (at least 35% with exhibits). Exactly one defensible answer set; explanations cover every
   option. Avoid opinion questions ("which assistant is best").
4. **Audience.** The learner is a network engineer (Cisco homelab, Fortinet, Palo Alto). Use IT
   examples: show-command output, switch/firewall configs, PowerShell and Python scripts, change
   plans, incident summaries. Use placeholder data only (RFC 5737 addresses, `example.com`, fake
   hostnames) — never real secrets.
5. **Size (slim build — one writer per domain, no separate reviewer).** Domain 1 ~32 questions,
   2 ~48, 3 ~40, 4 ~40; flashcards about 60% of the question count. Lessons ~1,000–1,500 words, at
   least one per topic (split big topics), each with a "Try it yourself" section giving concrete
   prompts to run in two assistants. Self-review every question for exactly one defensible answer.
6. **Reference tables.** Append 2–3 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `courses/tcpip-ipv4/content/reference.js`;
   `topic` must be a blueprint id). Use a `dNTables` constant spread into the default export; don't
   touch other domains' tables.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
