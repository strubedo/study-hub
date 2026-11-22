# Content Spec — CompTIA Linux+ XK0-006

Targets the **official CompTIA Linux+ XK0-006 (V8) exam objectives, document version 5.0**, in
`content/blueprint.js`. Every lesson, question and flashcard is tagged with a blueprint topic id;
together the lessons must cover **every** sub-bullet of every topic in your domain, including each
named command and file.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy prose from CompTIA, CBT Nuggets, books or
   any course.
2. **Technically airtight.** The learner is a working network engineer who uses Linux daily. Every
   command, option, file path, default, signal number and output sample must be correct. Verify
   against the man pages (run the command or `man` locally where it is installed; otherwise
   man7.org, `curl -sL https://man7.org/linux/man-pages/man8/<name>.8.html`), and the Red Hat and
   Ubuntu documentation. Where behaviour differs between RPM-based (RHEL 9/10, Fedora) and
   dpkg-based (Debian 12/13, Ubuntu 24.04) systems, say so and show both (dnf vs apt, firewalld vs
   ufw, NetworkManager vs Netplan, wheel vs sudo group). Don't present obsolete tools as current:
   note where the objectives name something deprecated (for example `pam_tally2`, replaced by
   `pam_faillock`; `mkinitrd`, replaced by `dracut`; `ifconfig`-era tools) and teach the current
   tool too. The objectives PDF has two typos: "vit-manager" is `virt-manager` and "systemd-blame"
   is `systemd-analyze blame`.
3. **Exam style.** Single, multi ("Choose two"), order, match and **fill** (~20% fill: exact
   commands, options, file paths, octal modes). List every accepted form in `answer: [...]` only
   when all are truly equivalent answers to the stem. Scenario stems ("Given a scenario...") where
   the objective verb is manage, perform, configure, apply or troubleshoot. Use `exhibit` for
   terminal output, config files, unit files, scripts or logs on at least 30% of questions. Exactly
   one defensible answer set; explanations cover every option.
4. **Names.** Hosts like `srv01`, `web01`; users `alice`, `bob`, `svc_backup`; domain
   `example.com`; RFC 5737 ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24) for public
   addresses and RFC 1918 for private; volume groups like `vg_data`. Never use real names, real
   hostnames or real credentials.
5. **Size (slim build — one writer per domain, no separate reviewer).** About 2.5 questions per
   weight point: Domain 1 ~58, Domain 2 ~50, Domain 3 ~45, Domain 4 ~43, Domain 5 ~55; flashcards
   about 60% of the question count. Lessons ~1,000–1,500 words, at least one per topic (split big
   topics such as 1.3 storage, 1.5 shell, 3.3 hardening and 4.1 automation into two), each with a
   "Lab it yourself" section that works in a throwaway VM or container. Self-review every question
   for exactly one defensible answer.
6. **Reference tables.** Append 2–4 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `courses/tcpip-ipv4/content/reference.js`;
   `topic` must be a blueprint id). Use a `dNTables` constant spread into the default export; don't
   touch other domains' tables.

7. **Real exam style, from official sources only.** Model question formats on the vendor's own
   published sample questions and objectives wording. Never use, look up or paraphrase recalled
   exam questions ("brain dumps": ExamTopics and similar sites); the vendor revokes certifications
   for it and the repository is public. At least 25% of each domain's questions must be
   performance-based in style: an `order` question that sequences the commands for a task, a
   `match` question pairing symptoms with the tool that confirms them, or a `fill` question where
   the exhibit shows a terminal session or config with one command or value to supply. These are
   multi-step scenarios on a named host, not one-line recall.

8. **Do not use this PC to verify.** No Docker or other containers, no VMs, no reproducing
   failures, and no running system commands to harvest output. Verify from documentation only:
   local man pages and `--help` text, and official docs fetched with curl. Mark output that was
   not run as documentation-based in REVIEW-TODO.md. (The owner will set up a lab later.)

9. **Any host computer.** Learners run this site on Windows, macOS (Apple silicon and Intel) and
   Linux. Never assume the learner's own computer runs Linux or is x86: every "Lab it yourself"
   happens inside the lab VM described on the Exam guide page, and where a step depends on the
   host or CPU architecture (downloading an image, a hypervisor, x86-only packages) say what to
   do on each.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
