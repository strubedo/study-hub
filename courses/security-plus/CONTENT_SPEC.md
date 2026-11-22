# Content Spec — CompTIA Security+ SY0-801

Targets the **official CompTIA Security+ SY0-801 (V8) exam objectives, document version 2.0**, in
`content/blueprint.js`. Every lesson,
question and flashcard is tagged with a blueprint topic id; together the lessons must cover
**every** sub-bullet of every topic in your domain, including each named term and acronym.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy prose from CompTIA, Professor Messer,
   CBT Nuggets, books or any course.
2. **Technically airtight and current.** The learner is a working network and firewall engineer.
   SY0-801 is new (launched November 17, 2026) and differs from SY0-701: write to the SY0-801
   objectives as given, never to remembered SY0-701 objective numbers or topics. Verify
   definitions and facts against primary sources fetched with curl: NIST (csrc.nist.gov glossary,
   SP 800-53, 800-61, 800-63, 800-207 Zero Trust, 800-88 media sanitization, FIPS), RFCs
   (rfc-editor.org), FIRST (CVSS), MITRE (CVE, ATT&CK), CISA, OWASP, ISO summaries, the GDPR
   text, M3AAWG / RFCs for SPF (7208), DKIM (6376), DMARC (7489) and BIMI, and vendor docs where
   a product feature is named (gMSA on Microsoft Learn, SELinux in Red Hat docs). Give algorithm
   facts precisely (key sizes, what is deprecated and by which standard). Where a term has more
   than one accepted definition, give the one CompTIA's wording implies and say so.
3. **Exam style.** Single, multi ("Choose two"), order, match and **fill** (~10% fill: exact
   acronyms, port numbers, calculated values such as ALE). Scenario stems for the objectives
   whose verb is demonstrate, analyze, manage, apply, perform or use. Use `exhibit` for logs,
   alerts, email headers, firewall or access rules, scan output, risk tables or policies on at
   least 30% of questions. Exactly one defensible answer set; explanations cover every option.
   Beware "best answer" ambiguity: if two controls would both work, rewrite the stem until only
   one fits the stated constraint.
4. **Names.** Company `Contoso` or `Example Corp`; users `alice`, `bob`; hosts `ws01`, `srv01`,
   `fw01`; domain `example.com`; RFC 5737 ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24)
   for public addresses and RFC 1918 for private. Real CVE ids and real breach names only when
   the facts stated about them are verified; never use real people's names.
5. **Size (one writer per domain, then an independent reviewer).** About 2.5 questions per weight
   point: Domain 1 ~40, Domain 2 ~60, Domain 3 ~48, Domain 4 ~68, Domain 5 ~35; flashcards about
   70% of the question count (this exam is vocabulary-heavy). Lessons ~1,000–1,500 words, at
   least one per topic; split 1.3, 2.3, 2.5, 4.1 and 4.5 into two. Each lesson ends with a short
   "Try it yourself" (an optional exercise that works on any computer, or a paper exercise such
   as classifying controls or computing ALE) and "Key takeaways". Self-review every question for
   exactly one defensible answer.
6. **Reference tables.** Append 2–4 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `../linux-plus/content/reference.js`; `topic` must be a blueprint id). Use a
   `dNTables` constant spread into the default export; don't touch other domains' tables.
7. **Real exam style, from official sources only.** Model question formats on the vendor's own
   published sample questions and objectives wording. Never use, look up or paraphrase recalled
   exam questions ("brain dumps": ExamTopics and similar sites); the vendor revokes certifications
   for it and the repository is public. At least 25% of each domain's questions must be
   performance-based in style: an `order` question that sequences the steps of a process
   (incident response, change management, certificate issuance), a `match` question pairing
   scenarios with the control, attack, agreement or role they describe, or a `fill` question
   whose exhibit is a log, header, rule set or risk table with one value to supply.
8. **Do not use this PC to verify.** No Docker or other containers, no VMs, no scanning, no
   running system commands to harvest output. Verify from documentation only (curl to the
   sources above, local man pages). Mark hand-written sample output as documentation-based in
   REVIEW-TODO.md.
9. **Any host computer.** Learners run this site on Windows, macOS and Linux. Optional exercises
   must work on any of them, or say what to use on each.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
