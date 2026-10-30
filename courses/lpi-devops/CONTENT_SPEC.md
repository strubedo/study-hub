# Content Spec — LPI DevOps Tools Engineer (701-200, version 2.0)

Targets the **official LPI 701-200 v2.0.0 objectives** in `content/blueprint.js` (lpi.org, checked
2026-10-30). Blueprint topic `1.1` = LPI objective `701.1`, `2.1` = `702.1`, `3.1` = `703.1`,
`4.1` = `704.1`, and so on. Every lesson, question and flashcard is tagged with a blueprint topic
id; together the lessons must cover **every** Key Knowledge Area and **every** item in the
objective's term list (full lists: https://www.lpi.org/our-certifications/exam-701-objectives/ —
fetch it once with `curl -sL`).

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy prose from LPI learning materials, docs or
   courses.
2. **Current tools.** Docker Engine with the `docker compose` plugin (v2; mention legacy
   `docker-compose` only as history), Compose Specification (the top-level `version:` key is obsolete
   — say so), Podman 5.x, Kubernetes 1.3x (`kubectl`), Helm 3, Git 2.4x, Prometheus 3.x, OpenTelemetry.
   Every command, flag, YAML key and PromQL function must be real — verify against official docs
   (docs.docker.com, docs.podman.io, kubernetes.io, helm.sh, git-scm.com, prometheus.io,
   opentelemetry.io, spdx.org/choosealicense.com for licences) with `curl -sL`. Don't invent flags.
3. **Topics removed in v2.0** (Ansible, Puppet, Chef, Vagrant, Packer, Docker Machine, Docker Swarm
   as a main topic, Jenkins pipeline authoring in depth) must not be tested; mention only for context.
   Overlay networks are in 702.1 — teach them at the concept level.
4. **Exam style.** LPI items are multiple choice (single and "Choose two/three") and **fill-in-the-blank**
   (type a command, option, file name or keyword). Aim for ~20% `fill` questions with exact,
   unambiguous answers (list every accepted form in `answer: [...]`, per the base spec's fill
   format). Use `exhibit` for code snippets (Dockerfile, compose file, Kubernetes YAML, PromQL,
   git output) on at least 25% of questions. Exactly one defensible answer set; explanations cover
   every option.
5. **Names.** Registry `registry.example.com`, app `webshop`, images `example/webshop:1.4.2`, namespaces
   `dev`/`prod`, hosts in `10.0.0.0/8` or `192.0.2.0/24`, domain `example.com`.
6. **Size (slim build — one writer per domain, no separate reviewer).** Roughly 4 questions per
   weight point: Domain 1 ~80 questions, Domain 2 ~52, Domain 3 ~52, Domain 4 ~56; flashcards about
   60% of the question count. Lessons ~1,000–1,500 words, at least one per topic (split topics with
   weight ≥ 5), each with a "Lab it yourself" section where hands-on makes sense. Self-review every
   question for exactly one defensible answer.
7. **Reference tables.** Append 2–4 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `courses/paloalto-ngfw/content/reference.js`;
   `topic` must be a blueprint id). Use a `dNTables` constant spread into the default export; don't
   touch other domains' tables.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
