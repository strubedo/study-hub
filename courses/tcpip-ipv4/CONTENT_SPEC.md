# Content Spec — TCP/IP IPv4 Fundamentals

A vendor-neutral skills course (no certification exam) built on `content/blueprint.js`. Every lesson,
question and flashcard is tagged with a blueprint topic id; together the lessons must cover **every**
sub-bullet of every topic in your domain.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** Don't copy prose from CBT Nuggets, textbooks, Cisco Press or any course.
2. **Technically airtight.** The learner is a working network engineer with a Cisco lab. Every number,
   field size, protocol number, ICMP type/code, port, timer, RFC number and command must be correct.
   Verify against the RFCs (rfc-editor.org, `curl -sL https://www.rfc-editor.org/rfc/rfcNNNN.txt`),
   the IANA registries, and man pages / vendor docs for commands (Linux iproute2, Windows, Cisco IOS).
   Prefer current RFCs: TCP is RFC 9293 (obsoletes 793); special addresses RFC 6890; DSCP RFC 2474;
   ECN RFC 3168. Don't present obsolete behaviour as current (e.g. classful routing, ICMP source
   quench — deprecated by RFC 6633). Where OS behaviour differs (Linux vs Windows defaults, e.g.
   initial TTL 64 vs 128, traceroute vs tracert), say so.
3. **Question style.** Mix single, multi ("Choose two"), order, match and **fill** (~25% fill:
   subnet math answers like `192.168.10.63`, prefix lengths like `/27`, port and protocol numbers,
   commands). List every accepted form in `answer: [...]` (e.g. `['/27', '27', '255.255.255.224']`
   only when all are truly equivalent answers to the stem). Use `exhibit` for packet captures,
   header dumps, routing tables, `ip`/`ipconfig` output or topology text on at least 25% of
   questions. Exactly one defensible answer set; explanations cover every option and show the math
   for subnetting.
4. **Names.** Use RFC 5737 documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) for
   public addresses, RFC 1918 for private, `example.com` for domains, MACs like `00:1a:2b:3c:4d:5e`.
5. **Size (slim build — one writer per domain, no separate reviewer).** Domain 1 ~40 questions,
   Domain 2 ~60 (subnetting heavy, many fill), Domain 3 ~60, Domain 4 ~45; flashcards about 60% of
   the question count. Lessons ~1,000–1,500 words, at least one per topic (split topics that need
   it, e.g. subnetting and TCP), each with a "Lab it yourself" section (Wireshark, Linux, Windows or
   Cisco IOS). Self-review every question for exactly one defensible answer.
6. **Reference tables.** Append 2–4 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `courses/lpi-devops/content/reference.js`;
   `topic` must be a blueprint id). Use a `dNTables` constant spread into the default export; don't
   touch other domains' tables.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
