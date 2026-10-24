# Content Spec — CCNA 200-301 v2.0 Study Site

All study content targets the **official Cisco 200-301 CCNA v2.0 blueprint** in
`content/blueprint.js`. Every lesson, question and flashcard is tagged with a
blueprint topic id (e.g. `"3.3"`).

## Ground rules (non-negotiable)

1. **Original content only.** Write exam-*style* questions from your own
   knowledge of networking. Never copy or paraphrase "brain dump" / leaked exam
   questions (they violate the Cisco certification agreement). Do not copy
   prose from books, Cisco docs or websites.
2. **Technically airtight.** The owner is a working network engineer who checks
   details. IOS syntax must be valid IOS/IOS-XE. Show-command output in exhibits
   must be self-consistent (interface names, IPs, masks, states, timers all agree
   with each other and with the question). If a fact has a caveat (platform
   differences, defaults that changed across IOS versions), say so in the
   explanation.
3. **Unambiguous answers.** Exactly the stated number of correct options. No
   "all of the above". Distractors must be plausible but clearly wrong to
   someone who knows the material.
4. **Explanations teach.** Every explanation says why the correct answer is
   right *and* why each distractor is wrong (briefly).
5. Defaults to remember: IOS-XE on Catalyst 9k / ISR 1k/4k style interface names
   (`GigabitEthernet0/0/0` on routers, `GigabitEthernet1/0/1` on switches), unless
   the question needs classic names. Keep naming consistent within one question.

## File layout per domain (`content/dN/`)

```
content/dN/lessons.js      // lesson index
content/dN/lessons/*.md    // one markdown file per lesson
content/dN/questions.js    // question bank
content/dN/flashcards.js   // flashcards
```

All `.js` files are ES modules with a single `export default [ ... ]`.
Use template literals (backticks) for multi-line strings such as exhibits.
Inside template literals, escape backticks and `${`.

## lessons.js

```js
export default [
  {
    id: '3.3-ospf',            // unique, prefix with topic id
    topic: '3.3',              // blueprint topic id (must belong to this domain)
    title: 'Single-Area OSPFv2 and OSPFv3',
    minutes: 25,               // estimated reading time
    file: '3.3-ospf.md',       // in content/dN/lessons/
    objectives: ['Explain neighbor states...', '...'],  // 3-6 bullets
  },
];
```

At least **one lesson per blueprint topic** in the domain. Big topics may be
split into 2 lessons. Order the array in recommended study order.

## Lesson markdown

* Start with `## ` level headings (the page supplies the H1 from `title`).
* 900–2000 words. Dense, exam-focused, practical. Use tables for comparisons.
* IOS config/show output in fenced blocks with the language `ios`:
  ```ios
  R1(config)# router ospf 1
  R1(config-router)# router-id 1.1.1.1
  ```
* Callouts are blockquotes that begin with one of these bold labels:
  `> **Exam tip:** ...`, `> **Watch out:** ...`, `> **Real world:** ...`
* End every lesson with `## Key takeaways` (5–8 bullets).
* No HTML, no images, no external links inside lessons.

## questions.js

```js
export default [
  {
    id: 'd3-001',              // dN-NNN, unique, zero-padded
    topic: '3.3',
    type: 'single',            // single | multi | order | match | fill
    difficulty: 2,             // 1 easy, 2 exam-level, 3 hard
    stem: 'Refer to the exhibit. Why is R1 not forming an adjacency with R2?',
    exhibit: `R1# show ip ospf interface brief ...`,   // optional, monospace
    options: ['...', '...', '...', '...'],            // single / multi
    answer: [2],               // single: one index; multi: 2+ indices
    explanation: 'Markdown. Why C is right; why A, B, D are wrong.',
    lesson: '3.3-ospf',        // optional lesson id for "review this"
  },
];
```

Type rules:

| type   | required fields | notes |
|--------|-----------------|-------|
| single | `options` (4, max 5), `answer: [i]` | |
| multi  | `options` (5–6), `answer: [i, j, ...]` | stem MUST end with "(Choose two.)" / "(Choose three.)" matching answer length |
| order  | `items` (4–7) in the **correct** order | app shuffles. stem says what to order |
| match  | `pairs: [[left, right], ...]` (3–6) | lefts unique, rights unique. App shuffles rights. |
| fill   | `answer: ['accepted', 'alt spelling']` | short exact answers only (a number, a prefix like `/26`, a command). Matching is case-insensitive and whitespace-collapsed. List every reasonable accepted form the stem allows. |

Options are shuffled by the app, so **never** write "Both A and B" or refer to
option letters. Explanations should refer to options by their content.

Mix guide per bank: ~60% single, ~15% multi, ~10% order/match, ~10% fill,
plus at least 25% of all questions with an `exhibit` (show output, config,
routing tables, syslog lines, JSON, packet captures, etc.).
v2.0 leans hard into **troubleshoot / diagnose / interpret** — reflect that.

## flashcards.js

```js
export default [
  { id: 'd3-f001', topic: '3.1', front: 'Default AD of OSPF?', back: '110' },
];
```

Backs are short (≤ 40 words). Markdown allowed (inline `code`).

## Validate before you finish

```
node scripts/validate-content.mjs 3      # your domain number
```

must print `OK` for your domain with zero errors.
