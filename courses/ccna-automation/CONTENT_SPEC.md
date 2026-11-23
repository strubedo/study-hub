# Content Spec — Cisco CCNA Automation (200-901 CCNAAUTO v1.1)

Targets the **official Cisco exam topics for Automating Networks Using Cisco Platforms v1.1
(200-901 CCNAAUTO)** in `content/blueprint.js`. Every lesson, question and flashcard is tagged with a
blueprint topic id; together the lessons must cover **every** topic and sub-part in your domain.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy prose from Cisco, CBT Nuggets, books or
   any course.
2. **Technically airtight and current.** The learner is a working network engineer (Cisco IOS,
   FortiGate, Palo Alto) who scripts in Python and Bash. Every line of code, HTTP exchange, JSON,
   XML and YAML document, YANG snippet, Git command and CLI line must be correct. Use current
   Cisco names: **Catalyst Center** (formerly DNA Center), **Catalyst SD-WAN** and **SD-WAN
   Manager** (formerly Viptela / vManage), **Secure Endpoint** (formerly AMP), **Secure Malware
   Analytics** (formerly Threat Grid), **Secure Firewall** / Firepower, **Cisco XDR**, **Webex**;
   mention the old name once where learners will meet it in older material. The certification was
   **DevNet Associate** until February 3, 2026. Verify against primary sources fetched with curl:
   developer.cisco.com API docs (Meraki Dashboard API v1, Catalyst Center Intent API, ACI APIC
   REST, SD-WAN Manager API, NSO RESTCONF, Webex REST API, Intersight, ISE ERS/OpenAPI, IOS XE
   programmability guides, NX-API), RFCs (9110 HTTP semantics and status codes, 7617 Basic auth,
   6750 Bearer, 6241 NETCONF, 6242 NETCONF over SSH, 8040 RESTCONF, 7950 YANG 1.1, 8259 JSON,
   6585 for 429), the YAML 1.2 spec, docs.python.org (json, xml.etree.ElementTree, unittest),
   PyYAML and requests docs, git-scm.com, docs.docker.com (Dockerfile reference), docs.ansible.com
   (cisco.ios and ansible.builtin modules), developer.hashicorp.com for Terraform, OWASP Top 10,
   and the IANA port registry. Where an API has changed (authentication endpoints, base paths,
   pagination, rate limits), state the current behaviour and its source.
3. **Exam style.** Single, multi ("Choose two"), order, match and **fill** (~15% fill: the
   missing method, header, status code, key path, function call or Git command in an exhibit).
   Scenario stems for topics whose verb is construct, utilize, troubleshoot, interpret, apply,
   identify or diagnose. Use `exhibit` on at least 50% of questions: an HTTP request and response,
   a JSON/XML/YAML document, a Python script, a Dockerfile, an Ansible playbook, a Bash script, a
   YANG tree, a NETCONF RPC or RESTCONF reply, a unified diff, a text sequence diagram, a text
   network topology. Exactly one defensible answer set; explanations cover every option.
4. **Names.** Hosts like `sw01`, `rtr01`, `api.example.com`, `sandbox.example.com`; users
   `alice`, `bob`; RFC 5737 ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) for public
   addresses and RFC 1918 for private. **Every token, API key, password and secret in the content
   must be an obvious placeholder** (`<YOUR_API_KEY>`, `REDACTED`, `example-token-not-real`);
   never write anything shaped like a real credential, and never copy a key from documentation
   examples. Organisation and network ids are made up.
5. **Size (one writer per domain, then an independent reviewer).** About 2.5 questions per weight
   point: Domains 1, 3, 4 and 6 ~40 each, Domains 2 and 5 ~52 each; flashcards about 60% of the
   question count. The validator requires a lesson whose `topic` equals each topic id, so write
   one lesson per exam topic (split a big topic in two if needed). Size each to its topic: about
   600–900 words for a narrow "describe" topic, 1,000–1,500 for a hands-on or broad one. Each has
   a "Lab it yourself" section that works from any computer using the lab on the Exam guide
   page (Python, Git, curl or Postman, the free DevNet Sandbox, Docker), and "Key takeaways".
6. **Reference tables.** Append 2–4 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `../linux-plus/content/reference.js`; `topic` must be a blueprint id). Use a
   `dNTables` constant spread into the default export; don't touch other domains' tables.
7. **Real exam style, from official sources only.** Model question formats on Cisco's own
   published sample questions and exam-topic wording. Never use, look up or paraphrase recalled
   exam questions ("brain dumps": ExamTopics and similar sites); Cisco revokes certifications for
   it and the repository is public. At least 25% of each domain's questions must be
   performance-based in style, by the strict definition reviewers apply: an `order` question
   sequencing the steps of a real task (a Git workflow, an OAuth-style token then call, a NETCONF
   session, a CI/CD pipeline); a `match` question pairing concrete scenarios (not terms) with the
   status code, platform, tool or API style that fits; or a `fill` question whose answer is read
   or derived from an exhibit. Term-to-definition matches do not count.
8. **Do not use this PC to verify by running infrastructure.** No Docker or other containers, no
   VMs, no sudo, no package installs, no calls to real APIs or sandboxes, no system commands to
   harvest output. Verify from documentation fetched with curl. The one exception, because it is
   harmless and is the subject being taught: you may run small pure Python and Bash snippets with
   no side effects (standard library only, no network, no installs, files only under a
   `mktemp -d` directory) to confirm what a script in the content prints, and `git` inside such a
   temporary directory. Mark anything else as documentation-based in REVIEW-TODO.md.
9. **Any host computer.** Learners run this site on Windows, macOS (Apple silicon and Intel) and
   Linux. Labs must work from any of them, or say what to use on each.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
