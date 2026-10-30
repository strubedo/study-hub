# Content Spec — Windows Server 2025 Essentials

A skills course (no certification exam) built on `content/blueprint.js`. Every lesson, question and
flashcard is tagged with a blueprint topic id; together the lessons must cover **every** sub-bullet of
every topic in your domain.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** Don't copy prose from CBT Nuggets, Microsoft Learn modules, books or
   courses. Paraphrase and teach.
2. **Windows Server 2025, technically airtight.** Every cmdlet, parameter, console name, default,
   limit and port must be real and current for Windows Server 2025. Verify on Microsoft Learn
   (learn.microsoft.com — use the Microsoft Learn MCP tools `microsoft_docs_search` /
   `microsoft_docs_fetch` if available to you, otherwise `curl -sL`). Call out what changed in 2025
   (e.g. SMB signing required by default, NTLM changes, AD functional level 10 / 32k database pages,
   hotpatching via Azure Arc, Windows LAPS, OpenSSH installed by default) only where Microsoft
   documents it. Don't present removed or deprecated features (e.g. WINS, NTLMv1, SMB1) as current
   recommendations.
3. **Question style.** Mix single, multi ("Choose two"), order, match and **fill** (~20% fill: exact
   cmdlet names like `Install-WindowsFeature`, console names, short values). List every accepted
   form in `answer: [...]`. Use `exhibit` for PowerShell output, GPO/permission scenarios, event log
   entries or configuration text on at least 25% of questions. Exactly one defensible answer set;
   explanations cover every option.
4. **Names.** Domain `corp.example.com` (NetBIOS `CORP`), servers `DC01`, `DC02`, `FS01`, `HV01`,
   users like `jsmith`, private addressing in `10.0.0.0/8` or `192.168.x.x`.
5. **Size (slim build — one writer per domain, no separate reviewer).** About 4 questions per
   weight point (Domain 1 ~40, 2 ~50, 3 ~40, 4 ~40, 5 ~30); flashcards about 60% of the question
   count. Lessons ~1,000–1,500 words, at least one per topic (split big topics), each with a "Lab it
   yourself" section (Hyper-V lab with the free evaluation). Self-review every question for exactly
   one defensible answer.
6. **Reference tables.** Append 2–3 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `courses/tcpip-ipv4/content/reference.js`;
   `topic` must be a blueprint id). Use a `dNTables` constant spread into the default export; don't
   touch other domains' tables.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
