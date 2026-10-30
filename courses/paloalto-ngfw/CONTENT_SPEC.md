# Content Spec — Palo Alto Networks Certified Next-Generation Firewall Engineer

Targets the **official NGFW Engineer blueprint** in `content/blueprint.js` (datasheet dated
November 2025, checked 2026-10-30). Every lesson, question and flashcard is tagged with a blueprint
topic id; together the lessons must cover **every** sub bullet.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** Write exam-style questions yourself. Never copy or paraphrase brain
   dumps or leaked items (Palo Alto bans candidates for it), and don't copy prose from Palo Alto docs,
   Beacon courses or other courses.
2. **Product and version.** PAN-OS **11.2** and **12.1**, the current releases when the datasheet was
   published, and Panorama 11.2/12.1. Note where behaviour differs between them or from 10.x, e.g.
   the **Advanced Routing Engine** (logical routers) vs the legacy engine (virtual routers), and
   **Strata Logging Service** (formerly Cortex Data Lake). Verify against docs.paloaltonetworks.com
   (`curl -sL` works; WebSearch may be limited). Don't invent CLI, defaults or limits; if you can't
   verify a detail, teach it at the level the docs do.
3. **CLI and GUI must be real.** Use real GUI paths (e.g. Network > Interfaces > Ethernet, Device >
   High Availability, Device > Certificate Management > Certificates, Objects > Log Forwarding,
   Panorama > Templates / Device Groups) and real CLI: operational (`show interface all`,
   `show high-availability state`, `show routing route`, `show advanced-routing route`,
   `show vpn ike-sa`, `show vpn ipsec-sa`, `test vpn ike-sa gateway <name>`, `show user ip-user-mapping all`,
   `show user group list`, `show session all filter …`, `show counter global filter delta yes`,
   `test security-policy-match …`, `request system software download/install version …`,
   `request content upgrade …`, `show system info`) and configure mode (`set network interface
   ethernet ethernet1/1 layer3 ip 10.0.1.1/24`, `set zone …`, `commit`). Exhibit output must look like
   real PAN-OS output and be internally consistent.
4. **Exam style.** Scenario items ("An engineer must…", "Which configuration…?"), "Refer to the
   exhibit." with CLI output or a GUI table, and multiple-select items with "(Choose two.)". The real
   exam's exhibit share is lower than Fortinet's: aim for at least **25%** of questions with an
   `exhibit`. Exactly one defensible answer set; no "all of the above"; explanations say why the right
   answer is right and each distractor wrong.
5. **Names in exhibits.** Firewalls `PA-HQ`, `PA-Branch1`, HA peers `PA-A`/`PA-B`, Panorama
   `Panorama-HQ`; interfaces `ethernet1/1`…`ethernet1/8`, `ae1`, `tunnel.1`, `loopback.1`; zones
   `trust`, `untrust`, `dmz`, `vpn`; RFC 1918 inside, RFC 5737 (`203.0.113.0/24`, `198.51.100.0/24`,
   `192.0.2.0/24`) outside; domain `example.com`.
6. **Size (slim build — one writer per domain, no separate reviewer).** Domain 1: about **90**
   questions, 55 flashcards, at least one lesson per topic (split HA, routing, GlobalProtect).
   Domain 2: about **90** questions, 55 flashcards. Domain 3: about **50** questions, 30 flashcards.
   Spread questions roughly in proportion to each topic's breadth. Self-review every question for
   exactly one defensible answer before finishing.
7. **Reference tables.** Append 2–4 cheat-sheet tables for your domain to `content/reference.js`
   (same row format as `courses/fortinet-nse5-sdwan/content/reference.js`;
   `topic` must be a blueprint id). Don't touch other domains' tables.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
