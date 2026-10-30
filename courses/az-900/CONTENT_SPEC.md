# Content Spec — AZ-900 Azure Fundamentals (review)

Targets the **official AZ-900 skills measured as of July 20, 2026** in `content/blueprint.js`. Every
lesson, question and flashcard is tagged with a blueprint topic id; together the lessons must cover
**every** sub-bullet. The learner already passed AZ-900; lessons are concise refreshers, not
beginner tutorials.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy Microsoft Learn module prose or any course.
2. **Current Azure.** Use current names (Microsoft Entra ID, not Azure AD; Microsoft Purview;
   Microsoft Defender for Cloud; Microsoft Cost Management). Verify every service capability,
   redundancy option, tier, limit and default on Microsoft Learn (Microsoft Learn MCP tools if you
   have them — load via ToolSearch "microsoft docs" — otherwise `curl -sL` learn.microsoft.com and
   grep). Don't test prices or numbers that change often.
3. **Exam style.** Single, multi ("Choose two"), order, match and **fill** (~10%, exact service
   names). Include Microsoft-style yes/no statement sets as `multi` questions ("Which statements are
   true? Choose two.") and "which service meets the requirement" scenarios. Use `exhibit` for
   scenarios, tables or portal-style text on at least 20% of questions. Exactly one defensible
   answer set; explanations cover every option.
4. **Names.** Company `Contoso`, resource groups like `rg-web-prod`, regions by real name (East US,
   West Europe), subscriptions `Contoso-Prod`.
5. **Size (slim review build — one writer per domain, no separate reviewer).** About 2 questions
   per weight point: Domain 1 ~55, Domain 2 ~75, Domain 3 ~65; flashcards about 60% of the
   question count. Lessons ~800–1,200 words, one per topic (split 2.2 and 2.4 into two), each with a
   short "Try it in the portal" section (free account or Learn sandbox). Self-review every question
   for exactly one defensible answer.
6. **Reference tables.** Append 2–3 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `courses/tcpip-ipv4/content/reference.js`;
   `topic` must be a blueprint id). Use a `dNTables` constant spread into the default export; don't
   touch other domains' tables.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
