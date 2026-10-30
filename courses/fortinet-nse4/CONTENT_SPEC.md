# Content Spec — Fortinet NSE 4 FortiOS 8.0 Administrator

All study content targets the **official Fortinet NSE 4 - FortiOS 8.0 Administrator
exam topics** in `content/blueprint.js` (source: training.fortinet.com exam page,
checked 2026-10-29; exam status "Coming Soon", product version FortiOS 8.0.0).
Every lesson, question and flashcard is tagged with a blueprint topic id (e.g.
`"2.2"`). Each topic's `sub` list is Fortinet's bullet list — together the
lessons must cover **every** sub bullet.

## Ground rules (non-negotiable)

1. **Original content only.** Write exam-*style* questions from your own
   knowledge. Never copy or paraphrase brain-dump / leaked exam questions (they
   violate the Fortinet certification agreement and get candidates banned). Do
   not copy prose from Fortinet docs, the Fortinet Training Institute course,
   CBT Nuggets or any other course.
2. **Technically airtight for FortiOS 8.0.** The owner is a working network
   engineer (Cisco background, homelab) who checks details. Target **FortiOS
   8.0** (current docs: FortiOS 8.0.2 Administration Guide on docs.fortinet.com).
   When behaviour changed from 7.4/7.6, say so. FortiOS CLI must be valid:
   `config … / edit … / set … / next / end` hierarchy, real object and
   attribute names (`config firewall policy`, `set srcintf`, `set nat enable`,
   `config firewall vip`, `config router static`, `config system sdwan`,
   `config vpn ipsec phase1-interface`, `config system ha`, `config log
   fortianalyzer setting`, …). Diagnose commands must be real (`diagnose debug
   flow filter …`, `diagnose debug flow trace start 10`, `diagnose debug
   enable`, `diagnose sniffer packet any 'host 10.0.1.10' 4`, `get router info
   routing-table all`, `get system performance status`, `diagnose sys session
   list`, `diagnose sys ha checksum cluster`, `get system ha status`, `diagnose
   vpn ike gateway list`, `diagnose vpn tunnel list`, `diagnose hardware sysinfo
   conserve`, …). Command output in exhibits must look like real FortiOS output
   and be self-consistent (interface names, IPs, policy IDs, session fields,
   timestamps agree with each other and the stem).
3. **8.0-only bullets need care.** Several blueprint bullets name new or
   marketing-level features ("FortiAI and Gen AI on CLI integration", "IPsec v2",
   "Quantum safe for IPsec", "TLS 1.3-based VPN negotiation", "DLP blocking
   GenAI chatbots", "FortiData labels", "OCR on DLP", "SD-WAN based on underlay
   bandwidth utilization", "AI/ML for DNS tunneling detection", "FortiGuard
   Extended SaaS DB", tagging). **Verify each against the FortiOS 8.0 docs / New
   Features guide before writing.** Teach only what the docs say; if a detail
   can't be verified, describe the feature at the level the docs do and don't
   invent CLI, defaults or limits. Never present a 7.x behaviour as 8.0 without
   checking.
4. **Use Fortinet terms.** FortiGate, FortiOS, FortiGuard, FortiAnalyzer,
   FortiManager, FortiSASE, FortiClient, FortiAuthenticator, FortiIdentity Cloud
   (check the current name and what it replaced), FSSO collector agent /
   DC agent, VIP, IP pool, central SNAT, NGFW policy-based vs profile-based mode,
   flow-based vs proxy-based inspection, SD-WAN members/zones/rules/performance
   SLAs, FGCP active-passive / active-active, VDOMs.
5. **Unambiguous answers.** Exactly the stated number of correct options. No
   "all of the above". Distractors plausible but clearly wrong to someone who
   knows FortiOS. The real exam gives **no partial credit**, so multi-answer
   questions must have an exact, defensible set.
6. **Explanations teach.** Say why the correct answer is right *and* why each
   distractor is wrong (briefly).
7. **Fortinet exam style.** Many items are "Refer to the exhibit." with a CLI
   extract, debug output, log entry or GUI summary, then "Which two statements
   are true? (Choose two.)", "What must the administrator do…?", "Why is the
   traffic…?". Use consistent fictional names: FortiGate devices `FGT-HQ`,
   `FGT-Branch`, `FGT-A`/`FGT-B` (HA), interfaces `port1`…`port10`, `wan1`,
   `wan2`, `internal`, `dmz`; addressing from RFC 1918 and RFC 5737
   (`203.0.113.0/24`, `198.51.100.0/24`, `192.0.2.0/24`) for "public" IPs;
   domain `example.com` / `training.lab`.

## File layout per domain (`content/dN/`)

```
content/dN/lessons.js      // lesson index
content/dN/lessons/*.md    // one markdown file per lesson
content/dN/questions.js    // question bank
content/dN/flashcards.js   // flashcards
```

All `.js` files are ES modules with a single `export default [ ... ]`.
Use template literals (backticks) for multi-line strings such as exhibits
(or `String.raw` templates); inside template literals escape backticks and `${`.
FortiOS CLI rarely uses backslashes, but quote filter strings carefully.

## lessons.js

```js
export default [
  {
    id: '2.2-snat-ip-pools',       // unique, prefix with topic id
    topic: '2.2',                  // blueprint topic id (must belong to this domain)
    title: 'Source NAT: Policy NAT, IP Pools and Central SNAT',
    minutes: 25,                   // estimated reading time
    file: '2.2-snat-ip-pools.md',
    objectives: ['Choose between overload, one-to-one, fixed port range and port block allocation IP pools', '...'],  // 3-6 bullets
  },
];
```

At least **one lesson per blueprint topic**; big topics should be split into
2-3 lessons so each lesson stays focused. Every sub bullet must be covered by
some lesson in the domain. Order the array in recommended study order.

## Lesson markdown

* Start with `## ` level headings (the page supplies the H1 from `title`).
* 900–2000 words. Dense, exam-focused, practical. Use tables for comparisons
  (flow vs proxy inspection, IP pool types, FGCP modes, SD-WAN strategies,
  certificate vs deep inspection, active vs passive auth, …).
* FortiOS CLI and diagnose output in fenced blocks with the language `text`,
  showing the prompt, e.g.
  ```text
  FGT-HQ # config firewall policy
  FGT-HQ (policy) # edit 10
  FGT-HQ (10) # set srcintf "port2"
  ```
* Callouts are blockquotes that begin with one of these bold labels:
  `> **Exam tip:** ...`, `> **Watch out:** ...`, `> **Real world:** ...`
* Include a short "**Lab it yourself**" section where practical. The owner's lab
  is the **free FortiGate-VM permanent trial** (FortiOS 8.0.x): 1 vCPU / 2 GB,
  **max 3 interfaces, 3 firewall policies, 3 routes**, low encryption only, no
  FortiGuard services, 2 VDOMs, one per FortiCloud account. Labs must fit those
  limits (or say clearly that a step needs a full license / FortiGuard), and the
  owner can put Cisco IOS routers or Linux hosts around it.
* End every lesson with `## Key takeaways` (5–8 bullets).
* No HTML, no images, no external links inside lessons.

## questions.js

```js
export default [
  {
    id: 'd2-001',              // dN-NNN, unique, zero-padded
    topic: '2.2',
    type: 'single',            // single | multi | order | match | fill
    difficulty: 2,             // 1 easy, 2 exam-level, 3 hard
    stem: 'Refer to the exhibit. Why is traffic from 10.0.1.10 not translated to the IP pool address?',
    exhibit: `FGT-HQ # show firewall policy 10 ...`,   // optional, monospace
    options: ['...', '...', '...', '...'],            // single / multi
    answer: [2],               // single: one index; multi: 2+ indices
    explanation: 'Markdown. Why the right option is right; why the others are wrong.',
    lesson: '2.2-snat-ip-pools',  // optional lesson id for "review this"
  },
];
```

Type rules:

| type   | required fields | notes |
|--------|-----------------|-------|
| single | `options` (4, max 5), `answer: [i]` | |
| multi  | `options` (5–6), `answer: [i, j, ...]` | stem MUST end with "(Choose two.)" / "(Choose three.)" matching answer length |
| order  | `items` (4–7) in the **correct** order | app shuffles. stem says what to order (e.g. the FortiOS packet flow stages, HA election criteria, the steps of a debug flow capture) |
| match  | `pairs: [[left, right], ...]` (3–6) | lefts unique, rights unique. App shuffles rights |
| fill   | `answer: ['accepted', 'alt spelling']` | short exact answers only (a CLI keyword, a command, a port, a value). Matching is case-insensitive and whitespace-collapsed. List every reasonable accepted form |

Options are shuffled by the app, so **never** write "Both A and B" or refer to
option letters. Explanations refer to options by their content.

Mix guide per bank: ~60% single, ~15% multi, ~10% order/match, ~10% fill, and
at least **35%** of all questions with an `exhibit` (Fortinet's exam is heavy on
"configuration extracts and troubleshooting captures": `show` config blocks,
`diagnose debug flow` traces, `diagnose sniffer packet` output, session list
entries, routing tables, `get system ha status`, `diagnose vpn ike` output, log
messages in key=value form, GUI summaries described as tables).

## flashcards.js

```js
export default [
  { id: 'd2-f001', topic: '2.2', front: 'Default IP pool type?', back: 'Overload (many-to-one PAT).' },
];
```

Backs are short (≤ 40 words). Markdown allowed (inline `code`).

## Validate before you finish

```
node scripts/validate-content.mjs 1      # your domain number(s)
```

must print `OK` for your domain(s) with zero errors.
