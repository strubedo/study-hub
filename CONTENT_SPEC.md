# Content Spec — Study Hub courses

The format every course's study content follows. Each course also has its own
`courses/<id>/CONTENT_SPEC.md` with the subject-specific rules (CCNA: IOS syntax,
exhibit conventions, question mix). Read both before writing content.

All content targets the course's official blueprint in
`courses/<id>/content/blueprint.js`. Every lesson, question and flashcard is
tagged with a blueprint topic id (e.g. `"3.3"`).

## Ground rules (every course)

1. **Original content only.** Write exam-*style* questions from your own
   knowledge. Never copy or paraphrase "brain dump" / leaked exam questions
   (they violate vendor certification agreements). Do not copy prose from
   books, vendor docs or websites.
2. **Technically airtight.** The owner is a working engineer who checks
   details. Commands, output and exhibits must be valid and self-consistent.
   If a fact has a caveat (version or platform differences, changed defaults),
   say so in the explanation.
3. **Unambiguous answers.** Exactly the stated number of correct options. No
   "all of the above". Distractors must be plausible but clearly wrong to
   someone who knows the material.
4. **Explanations teach.** Every explanation says why the correct answer is
   right *and* why each distractor is wrong (briefly).

## Blueprint (`content/blueprint.js`)

Exports `DOMAINS`: `[{ id, weight, title, short, topics: [{ id, verb, title, sub? }] }]`.

* Domain `id`s are positive integers; content lives in `content/d<id>/`.
* `weight` is relative: the exam builder and readiness score normalise it, so
  midpoints of published ranges (22.5, 12.5, …) are fine. Add
  `weightRange: '20-25%'` to show the published range in the UI.
* Multi-exam courses tag each domain with `exam: '<exam id>'` (see README).

## File layout per domain (`courses/<id>/content/dN/`)

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
* Code and output go in fenced blocks with a language: `ios` gets prompt and
  interface-state highlighting; any other language (`powershell`, `text`, …)
  renders as plain monospace.
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

## flashcards.js

```js
export default [
  { id: 'd3-f001', topic: '3.1', front: 'Default AD of OSPF?', back: '110' },
];
```

Backs are short (≤ 40 words). Markdown allowed (inline `code`).

## Validate before you finish

```
node scripts/validate-content.mjs <course> <domain>    # e.g. ccna 3
```

must print `OK` for your domain with zero errors. With only a course id it
checks every domain of that course; with no arguments, every ready course.
