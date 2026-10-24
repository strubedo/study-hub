# CCNA Prep — local study site for Cisco 200-301 v2.0

A self-hosted, offline-first study workspace for the **CCNA 200-301 v2.0** exam
(blueprint published 2026-05-20, live from **2027-02-03**; the old v1.1 exam's
last day is 2027-02-02).

## Run it

```bash
cd ~/projects/ccna-prep
./serve.sh            # → http://127.0.0.1:8231/
```

No build step and no dependencies: vanilla ES modules served by Python's static
server, bound to localhost only. Progress is stored in your browser's
localStorage. Use **Settings → Export progress** to back it up.

## What's inside

| Section | What it does |
|---|---|
| Dashboard | Readiness score (blueprint-weighted), next lesson, domain mastery, weakest topics, activity heatmap, exam trend |
| Study Plan | Week-by-week schedule built from your exam date and lesson lengths; final week reserved for review |
| Curriculum | Every official v2.0 topic → lessons, videos, labs and questions mapped to it |
| Video Course | Jeremy's IT Lab free CCNA course (126 videos) embedded and tagged to v2.0 topics, plus a coverage-gap list |
| Question Bank | Original exam-style questions (single, multi, drag-and-drop order/match, fill-in) with full explanations |
| Exam Simulator | Timed, blueprint-weighted exams with CLI labs mixed in, strict no-going-back mode, scored report and review |
| CLI Labs | Browser IOS/IOS-XE simulator with auto-graded tasks, including troubleshooting scenarios |
| Subnetting | Endless generated drills with worked answers, 5-minute sprint, IPv4 calculator with binary view, EUI-64 builder |
| Flashcards | Spaced repetition (SM-2) by domain or topic |
| Reference | Cheat sheets: AD values, ports, OSPF, STP, FHRP, syslog, IPv6, ACLs, cabling, wireless, SNMP, NAT, DNS |

`Ctrl+K` searches everything.

## About the questions

All questions are **original**, written against the official exam topics.
They are *not* real exam questions. Cisco exam content is under NDA, and
"dump" sites that claim to have it break the certification agreement and can
get you decertified. Treat this bank as practice for the skills, not a
preview of the exam.

The scaled exam score is a linear estimate. Cisco doesn't publish its scoring
method or the cut score (~825/1000 is a community estimate).

## Development

```bash
npm test                 # unit tests: subnet math, grading, SRS, plan, content integrity, simulator
npm run validate         # content bank schema check (see CONTENT_SPEC.md)
node scripts/build-videos.mjs   # regenerate content/videos.js from scripts/jeremy-playlist.tsv
```

Layout: `src/` app (router `main.js`, views in `src/views/`, pure logic in
`src/lib/`, IOS simulator in `src/sim/`), `content/` study material per domain
(`dN/lessons.js`, `dN/lessons/*.md`, `dN/questions.js`, `dN/flashcards.js`).
See `CONTENT_SPEC.md` for the content format.

## App-menu launcher

A **CCNA Prep** entry is installed at `~/.local/share/applications/ccna-prep.desktop`. It runs
`scripts/launch.sh`, which starts the server if needed and opens the browser. Delete that
`.desktop` file to remove it.
