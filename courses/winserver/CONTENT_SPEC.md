# Content Spec — AZ-802 Administering Windows Server

All study content targets the **official Microsoft AZ-802 skills outline** in
`content/blueprint.js` (source: learn.microsoft.com study guide for AZ-802,
checked 2026-10-29). AZ-802 replaced AZ-800 + AZ-801 (retired 2026-09-30) and
earns **Microsoft Certified: Windows Server Administrator Associate**. Every
lesson, question and flashcard is tagged with a blueprint topic id (e.g. `"1.2"`).
Each topic's `sub` list is Microsoft's verbatim bullet list — together the
lessons must cover **every** sub bullet.

## Ground rules (non-negotiable)

1. **Original content only.** Write exam-*style* questions from your own
   knowledge. Never copy or paraphrase brain-dump / leaked exam questions (they
   violate the Microsoft exam agreement). Do not copy prose from Microsoft Learn,
   books, CBT Nuggets or other courses.
2. **Technically airtight.** The owner is a working network engineer who checks
   details. Target **Windows Server 2025** (current LTSC) unless a question says
   otherwise, and call out version differences when they matter (e.g. SMB over
   QUIC needed Azure Edition on 2022 but is in Standard/Datacenter on 2025;
   Windows LAPS is built in since April 2023 updates and replaces legacy LAPS;
   Hotpatching; dMSA on 2025). PowerShell must be real cmdlets with real
   parameters (ActiveDirectory, DnsServer, DhcpServer, Hyper-V, Storage,
   SmbShare, FailoverClusters, Az.* modules, `az` CLI). Command output in exhibits
   must look like the real tool's output and be self-consistent (names, IPs,
   GUIDs, event IDs, timestamps, states agree with each other and the stem). Use
   correct Event IDs and error codes only when you are certain of them;
   otherwise describe the event without inventing an ID.
3. **Use current product names:** Microsoft Entra ID (not Azure AD), Entra
   Connect / Cloud Sync, Microsoft Defender for Cloud / Defender for Servers,
   Azure Update Manager (not Update Management), Azure Monitor Agent with data
   collection rules (the Log Analytics/MMA agent is retired), Azure Arc-enabled
   servers, App Control for Business (formerly WDAC; the outline says
   "Application Control for Windows").
4. **Stay inside AZ-802.** AZ-800/801 topics that AZ-802 dropped (Entra Connect
   deep-dive, containers/AKS, RRAS/VPN, NPS, IPAM, BranchCache, Azure Site
   Recovery, Azure Backup, the migration domain, failover-cluster deep-dive) may
   appear only as brief context or distractors, never as the subject of a
   question.
5. **Unambiguous answers.** Exactly the stated number of correct options. No
   "all of the above". Distractors plausible but clearly wrong to someone who
   knows the material (real cmdlets used wrongly beat made-up cmdlets).
6. **Explanations teach.** Say why the correct answer is right *and* why each
   distractor is wrong (briefly).
7. **Microsoft exam style.** Scenario stems: "You have a server named Server1
   that runs Windows Server 2025…", "Your network contains an Active Directory
   Domain Services (AD DS) forest named contoso.com…", ending with "What should
   you do?", "Which cmdlet should you run?", "What should you configure first?".
   Use the fictional names Microsoft uses (contoso.com, fabrikam.com, adatum.com,
   Server1, DC1, VM1, User1, Group1, RG1, VNet1, storage1). Use 2-4 sentence
   scenarios with the constraint that decides the answer ("You need to minimise
   administrative effort", "The solution must support…").

## File layout per domain (`content/dN/`)

```
content/dN/lessons.js      // lesson index
content/dN/lessons/*.md    // one markdown file per lesson
content/dN/questions.js    // question bank
content/dN/flashcards.js   // flashcards
```

All `.js` files are ES modules with a single `export default [ ... ]`.
Use template literals (backticks) for multi-line strings such as exhibits.
Inside template literals, escape backticks (PowerShell's escape char!) and `${`.
PowerShell uses `$variables` — `$x` is fine inside a template literal, but
`${...}` is not; write `$($x)` subexpressions carefully and escape the `$`
before `{` as `\${` if you need braces after a dollar sign.

## lessons.js

```js
export default [
  {
    id: '1.2-ad-sites-replication',   // unique, prefix with topic id
    topic: '1.2',                     // blueprint topic id (must belong to this domain)
    title: 'AD DS Sites, Site Links and Replication',
    minutes: 25,                      // estimated reading time
    file: '1.2-ad-sites-replication.md',
    objectives: ['Explain intrasite vs intersite replication...', '...'],  // 3-6 bullets
  },
];
```

At least **one lesson per blueprint topic**; big topics (many sub bullets, e.g.
3.1 Hyper-V, 5.3 storage, 6.1, 6.2, 7.1-7.3) should be split into 2-4 lessons so
each lesson stays focused. Every sub bullet must be covered by some lesson in
the domain. Order the array in recommended study order.

## Lesson markdown

* Start with `## ` level headings (the page supplies the H1 from `title`).
* 900–2000 words. Dense, exam-focused, practical. Use tables for comparisons
  (e.g. RODC vs writable DC, gMSA vs dMSA vs sMSA, checkpoint types, DFS-N vs
  DFS-R vs Azure File Sync).
* PowerShell in fenced blocks with the language `powershell`; cmd tools
  (`repadmin`, `dcdiag`, `nltest`, `w32tm`, `netsh`, `ntdsutil`) in fenced blocks
  with the language `text` showing the prompt, e.g.
  ```powershell
  PS C:\> Install-ADDSDomainController -DomainName contoso.com -ReadOnlyReplica -SiteName Branch1
  ```
* Callouts are blockquotes that begin with one of these bold labels:
  `> **Exam tip:** ...`, `> **Watch out:** ...`, `> **Real world:** ...`
* Include a short "**Lab it yourself**" section where practical: steps the owner
  can run in a home lab (Hyper-V on an evaluation copy of Windows Server 2025,
  free Azure account), with the exact commands. Keep it to what really works.
* End every lesson with `## Key takeaways` (5–8 bullets).
* No HTML, no images, no external links inside lessons.

## questions.js

```js
export default [
  {
    id: 'd1-001',              // dN-NNN, unique, zero-padded
    topic: '1.2',
    type: 'single',            // single | multi | order | match | fill
    difficulty: 2,             // 1 easy, 2 exam-level, 3 hard
    stem: 'You have an AD DS forest... Refer to the exhibit. What should you do?',
    exhibit: `PS C:\\> repadmin /showrepl DC2 ...`,  // optional, monospace
    options: ['...', '...', '...', '...'],         // single / multi
    answer: [2],               // single: one index; multi: 2+ indices
    explanation: 'Markdown. Why the right option is right; why the others are wrong.',
    lesson: '1.2-ad-sites-replication',   // optional lesson id for "review this"
  },
];
```

Type rules:

| type   | required fields | notes |
|--------|-----------------|-------|
| single | `options` (4, max 5), `answer: [i]` | |
| multi  | `options` (5–6), `answer: [i, j, ...]` | stem MUST end with "(Choose two.)" / "(Choose three.)" matching answer length |
| order  | `items` (4–7) in the **correct** order | app shuffles. stem says what to order ("You need to … In which order should you perform the actions?") |
| match  | `pairs: [[left, right], ...]` (3–6) | lefts unique, rights unique. App shuffles rights. Good for feature→requirement, cmdlet→task |
| fill   | `answer: ['accepted', 'alt spelling']` | short exact answers only (a cmdlet name, a parameter, a port number, a value). Matching is case-insensitive and whitespace-collapsed. List every reasonable accepted form. |

Options are shuffled by the app, so **never** write "Both A and B" or refer to
option letters. Explanations refer to options by their content.

Mix guide per bank: ~60% single, ~15% multi, ~10% order/match, ~10% fill, and
at least 25% of all questions with an `exhibit` (PowerShell output, `repadmin`,
`dcdiag`, `nltest`, `w32tm /query`, event log entries, `Get-*` tables, Azure CLI
JSON, KQL queries, GPO settings, ACL listings, Storage Spaces state, etc.).
AZ-802 is heavily **troubleshoot / choose-the-right-tool / minimise-effort** —
reflect that.

## flashcards.js

```js
export default [
  { id: 'd1-f001', topic: '1.1', front: 'Default tombstone lifetime in a new forest?', back: '180 days' },
];
```

Backs are short (≤ 40 words). Markdown allowed (inline `code`).

## Validate before you finish

```
node scripts/validate-content.mjs 1      # your domain number(s)
```

must print `OK` for your domain(s) with zero errors.
