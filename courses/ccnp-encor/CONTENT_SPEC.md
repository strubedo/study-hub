# Content Spec — Cisco CCNP ENCOR (350-401 v1.2)

Targets the **official Cisco exam topics for Implementing Cisco Enterprise Network Core
Technologies v1.2 (350-401 ENCOR)** in `content/blueprint.js`. Every lesson, question and flashcard is tagged with a
blueprint topic id; together the lessons must cover **every** topic and lettered sub-topic in your
domain. v1.2 has **no wireless section**: do not write wireless content.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy prose from Cisco Press, Cisco docs, CBT
   Nuggets, books or any course.
2. **Technically airtight.** The learner is a working network engineer who configures Cisco IOS
   daily, alongside FortiGate and Palo Alto, and will catch any wrong command, default or timer.
   Platform baseline: **IOS XE 17.x** on Catalyst 9000 switches and ISR / Catalyst 8000 routers.
   Every command, keyword, default value, timer, administrative distance, metric formula, LSA
   type, state machine, multicast address and protocol number must be correct for that baseline;
   where IOS and IOS XE or switch and router syntax differ, say so. Every `show` output must be in
   the real format of the command. Use current names: **Catalyst Center** (formerly DNA Center),
   **Catalyst SD-WAN**, **SD-WAN Manager / Controller / Validator** (formerly vManage / vSmart /
   vBond), **WAN Edge**; give the old name once. Verify against primary sources fetched with
   curl: RFCs (OSPFv2 2328, OSPFv3 5340, BGP-4 4271 and 4456/5065 only if needed, EIGRP 7868,
   VRRPv3 9568 (and 5798), HSRP 2281, PIM-SM 7761, IGMPv2 2236, IGMPv3 3376, SSM 4607, BIDIR-PIM
   5015, MSDP 3618, NTP 5905, GRE 2784/2890, IPsec 4301–4303, IKEv2 7296, LISP 9300/9301, VXLAN
   7348, NETCONF 6241, RESTCONF 8040, YANG 7950, SNMP 3411–3418, syslog 5424, IPFIX 7011, RADIUS
   2865, TACACS+ 8907, MACsec via IEEE 802.1AE summaries), IEEE 802.1Q / 802.1D / 802.1w / 802.1s
   / 802.3ad (802.1AX) and IEEE 1588 facts from reputable sources, and Cisco IOS XE
   configuration guides and command references (cisco.com often blocks curl: try the document's
   other formats, Cisco's GitHub repositories, DevNet, or YANG models at github.com/YangModels;
   if a Cisco-specific detail cannot be confirmed from any primary source, do not state it as
   fact — word it generally and list it in REVIEW-TODO.md for the owner to check on a device).
3. **Exam style.** Single, multi ("Choose two"), order, match and **fill** (~20% fill: the exact
   command, keyword or value). Scenario stems for topics whose verb is configure, verify,
   troubleshoot, interpret, diagnose or construct. Use `exhibit` on at least 55% of questions: a
   running-config excerpt, `show` output, a text topology, a debug excerpt, a routing or BGP
   table, a NETCONF/RESTCONF exchange, a Python script, a JSON file. Exactly one defensible
   answer set; explanations cover every option. Troubleshooting questions must contain the
   specific line that reveals the fault.
4. **Names.** Devices `R1`, `R2`, `SW1`, `DSW1`, `ASW1`; hostnames only like that; RFC 1918
   addresses for internal networks and RFC 5737 (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24)
   and RFC 3849 (2001:db8::/32) for anything public; private AS numbers (64512–65534) or the
   documentation ASNs 64496–64511 (RFC 5398); domain `example.com`. **Every password, key,
   community string and secret must be an obvious placeholder** (`<SECRET>`, `ExamplePass123`
   clearly marked as an example, `Lab-Only-Key`); never a type 5/8/9 hash copied from anywhere,
   and never anything from a real device.
5. **Size (one writer per domain, then an independent reviewer).** About 2.5–3 questions per
   weight point: Domain 1 ~42, Domain 2 ~30, Domain 3 ~85, Domain 4 ~30, Domain 5 ~55, Domain 6
   ~42; flashcards about 60% of the question count. The validator requires at least one lesson
   whose `topic` equals each topic id; write **one lesson per lettered sub-topic** where the
   topic has them (so 3.1, 3.2 and 3.3 each get several lessons), sized to the sub-topic: about
   700–1,000 words for a "describe" one, 1,200–1,800 for a "configure and verify" or
   "troubleshoot" one. Each has a "Lab it yourself" section (a small topology in Cisco Modeling
   Labs, GNS3, EVE-NG or a DevNet Sandbox, with the configuration to build and the `show`
   commands that prove it works) and "Key takeaways".
6. **Reference tables.** Append 2–5 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `../linux-plus/content/reference.js`; `topic` must be a blueprint id). Use a
   `dNTables` constant spread into the default export; edit that shared file with the Edit tool
   only, never a script, and don't touch other domains' tables.
7. **Real exam style, from official sources only.** Model question formats on Cisco's own
   published sample questions and exam-topic wording. Never use, look up or paraphrase recalled
   exam questions ("brain dumps": ExamTopics and similar sites); Cisco revokes certifications for
   it and the repository is public. At least 25% of each domain's questions must be
   performance-based in style, by the strict definition reviewers apply: an `order` question
   sequencing the steps or commands of a real task (an OSPF adjacency forming, an STP election,
   configuring an EtherChannel, a BGP best-path walk); a `match` question pairing concrete
   symptoms or scenarios (not terms) with the cause, feature, command or tool that fits; or a
   `fill` question whose answer is read or derived from an exhibit (the missing command in a
   config, the root bridge from `show spanning-tree`, the next hop from a table).
   Term-to-definition matches do not count.
8. **Do not use this PC to verify by running infrastructure.** No Docker or other containers, no
   VMs or emulators, no sudo, no installs, no network scans, pings or connections to any device,
   sandbox or API, no system commands to harvest output. Verify from documentation fetched with
   curl. Pure Python with no network (for example the `ipaddress` module for subnet maths, or
   compiling a script shown in the content) inside a `mktemp -d` directory is allowed. Mark all
   device output as documentation-based in REVIEW-TODO.md: the owner has Cisco lab gear and will
   check it there.
9. **Any host computer.** Learners run this site on Windows, macOS (Apple silicon and Intel) and
   Linux. Labs name tools that run on all three, or say what to use on each.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
