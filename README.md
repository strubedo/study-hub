# Study Hub — local certification study sites

A self-hosted, offline-first study workspace. One hub page links to one site per
course; every course runs on the same shared engine (dashboard, study plan,
curriculum, lessons, question bank, timed exam simulator, flashcards, reference,
settings) plus any course-only plugins (CCNA: IOS CLI labs and a subnetting trainer).

| Course | Folder |
|---|---|
| CCNA 200-301 v2.0 | `courses/ccna/` |
| AZ-802 Windows Server Hybrid Administrator | `courses/winserver/` |
| Fortinet NSE 4 FortiOS 7.6 | `courses/fortinet-nse4/` |
| Fortinet NSE 6 FortiManager 7.6 | `courses/fortinet-nse6-fmg/` |
| Fortinet NSE 5 SD-WAN 7.6 | `courses/fortinet-nse5-sdwan/` |
| Fortinet NSE 7 Secure Networking 7.6 | `courses/fortinet-nse7/` |
| Fortinet NSE 5 FortiSwitch 7.6 | `courses/fortinet-nse5-fsw/` |
| Fortinet NSE 5 Wireless LAN | `courses/fortinet-nse5-wlan/` |
| Fortinet NSE 6 FortiNAC-F | `courses/fortinet-nse6-nac/` |
| Palo Alto Networks NGFW Engineer | `courses/paloalto-ngfw/` |
| LPI DevOps Tools Engineer 701-200 | `courses/lpi-devops/` |
| TCP/IP IPv4 Fundamentals | `courses/tcpip-ipv4/` |
| Windows Server 2025 Essentials | `courses/winserver-essentials/` |
| AI Prompt Engineering (ChatGPT, Gemini, Claude) | `courses/ai-prompting/` |
| AZ-900 Azure Fundamentals (review) | `courses/az-900/` |

## Run it

```bash
cd ~/projects/study-hub
./serve.sh            # → http://127.0.0.1:8231/   (or ./serve.sh 8232)
```

`/` is the hub; each course lives at `/courses/<id>/` (CCNA: `/courses/ccna/`).
No build step and no dependencies: vanilla ES modules served by
`scripts/serve.py` (Python's static server plus `Cache-Control: no-cache`),
bound to localhost only. `scripts/launch.sh` starts the server if needed and
opens the hub (port from `STUDY_HUB_PORT`, default 8231).

Progress lives in your browser's localStorage, **per course**: each course
namespaces its keys with its `storePrefix` (CCNA: `ccna:`, the same keys the
original CCNA site used, so existing CCNA progress carries over on the same
origin). Back up from each course's **Settings → Export progress**. Backups made
by the original CCNA site (`"app": "ccna-prep"`) still import into the CCNA
course. The light/dark theme is shared hub-wide (`studyhub:theme`).

## Layout

```
index.html, hub/          hub page: one card per course with quick progress
engine/                   shared app
  main.js                 boot(courseUrl): loads course.js, binds the store, router, nav, search
  course.js               course.js loader + validator (normalizeCourse)
  store.js                localStorage store, prefix set by configure() before any read
  content.js              loads a course's blueprint-tagged content
  nav.js, search.js, theme.js, ui.js, progress.js
  lib/                    quiz, srs, plan, exams (pure; unit tested)
  components/, views/     generic views: dashboard, plan, curriculum, lesson, practice,
                          exam, flashcards, videos, guide, reference, settings
assets/                   app.css (design tokens, light theme), theme-init.js, vendor/marked
courses/
  index.js                registry: ready + coming-soon entries
  ccna/
    index.html            course shell → boot(new URL('./', import.meta.url))
    course.js             course config (below)
    content/              blueprint.js, d1..d5, videos.js, video-page.js, reference.js, guide.js
    plugins/              CCNA-only: sim/ (IOS simulator), labs.js (labs provider),
                          views/labs.js, views/subnetting.js, lib/subnet.js, sim.css
    data/                 jeremy-playlist.tsv (input to scripts/build-videos.mjs)
    CONTENT_SPEC.md       CCNA-specific content rules
scripts/                  serve.py, launch.sh, validate-content.mjs, build-videos.mjs
tests/                    node:test suites
CONTENT_SPEC.md           content format shared by every course
```

## Development

```bash
npm test                          # unit tests: engine libs, store prefix, course config, hub, CCNA content + simulator
npm run validate                  # content check for every ready course (CONTENT_SPEC.md)
node scripts/validate-content.mjs ccna 3     # one course, one domain
node scripts/build-videos.mjs     # regenerate courses/ccna/content/videos.js from courses/ccna/data/jeremy-playlist.tsv
```

## Adding a course

1. Create `courses/<id>/` with `index.html` (copy `courses/ccna/index.html`;
   change the title, description and the `data-settings-key="<prefix>settings"`
   on the theme script; drop the `plugins/sim.css` link if you have no plugins).
2. Write `content/blueprint.js` exporting `DOMAINS`, and content per
   `CONTENT_SPEC.md`. Put subject rules in `courses/<id>/CONTENT_SPEC.md`.
3. Write `course.js` (schema below).
4. In `courses/index.js`, set the entry to `{ id, status: 'ready', path: '<id>/' }`.
5. `npm run validate` and `npm test`.

### course.js schema

Default export; validated by `engine/course.js`, which throws a clear error for
each mistake. Paths are relative to the course directory.

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | lower-case id, matches the directory |
| `name`, `title` | yes | e.g. "CCNA Prep", "CCNA 200-301 v2.0" (page title suffix, headings) |
| `shortName`, `subtitle`, `vendor`, `description` | no | dashboard heading ("Your CCNA study hub"), sidebar sub-line, hub card |
| `storePrefix` | yes | localStorage namespace, e.g. `'winserver:'`. Never change it once people have progress. `studyhub:` is reserved |
| `legacyBackupApps`, `backupName` | no | old backup tags importAll() accepts; export file name |
| `domains` | yes | the blueprint `DOMAINS` array |
| `exams` | yes | one or more exams (below) |
| `videos` | no | `{ list: 'content/videos.js', page: 'content/video-page.js' }`; omit to hide Video Course |
| `reference` | no | module with cheat-sheet tables; omit to hide Reference |
| `guide` | no | exam-guide page data (see `engine/views/guide.js`); omit to hide Exam Guide |
| `labs` | no | `{ module, route, label, examLabel, itemBadge }`. `module` exports `labs` and `loadMountLab()` → `mountLab(container, lab, opts)` |
| `nav` | no | plugin routes `{ path, label, icon, group, module, after? }`. `module` exports `render(root, params, ctx)` |
| `dashboard.quickLinks`, `plan.reviewTasks` | no | extra dashboard buttons; final-week review checklist |

Exam fields: `id`, `code`, `name`, `questionCount`, `minutes`, `labs` (needs a
`labs` provider), `scoreMin`, `scoreMax`, `passScore`, `passLabel`,
`trendLabel`, `passNote`, `scoreNote`, `dateHint`,
`dateWarning: { before, message }`, `about: { title, items }`, optional `modes`
(default: full / half / quarter-length sprint). The simulated score is
`scoreMin + (scoreMax − scoreMin) × credit` (CCNA: 300 + 700 × credit).

CCNA example (abridged; see `courses/ccna/course.js`):

```js
import { EXAM, DOMAINS } from './content/blueprint.js';
export default {
  id: 'ccna', name: 'CCNA Prep', shortName: 'CCNA', title: 'CCNA 200-301 v2.0', vendor: 'Cisco',
  storePrefix: 'ccna:', legacyBackupApps: ['ccna-prep'], backupName: 'ccna-prep-backup',
  domains: DOMAINS,
  exams: [{ id: '200-301', code: '200-301', questionCount: 100, minutes: 120, labs: 3,
            scoreMin: 300, scoreMax: 1000, passScore: 825, passLabel: '~825 community pass estimate' }],
  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js', guide: 'content/guide.js',
  labs: { module: 'plugins/labs.js', route: 'labs', label: 'CLI labs', examLabel: 'CLI simulation labs', itemBadge: 'CLI simulation' },
  nav: [
    { path: 'labs', label: 'CLI Labs', icon: 'terminal', group: 'Practice', after: 'exam', module: 'plugins/views/labs.js' },
    { path: 'subnetting', label: 'Subnetting', icon: 'calc', group: 'Practice', after: 'labs', module: 'plugins/views/subnetting.js' },
  ],
};
```

### Multi-exam courses

List several exams and tag each domain with `exam: '<exam id>'` (or give an exam
an explicit `domains: [ids]`); every domain must belong to exactly one exam. The
simulator then shows an exam picker and builds each exam only from its own
domains, weighted by them. Exam dates are stored per exam
(`settings.examDates`), the dashboard shows readiness, best score and trend per
exam, the study plan can be built per exam or for all of them, and the sidebar
counts down to the next exam. Single-exam courses keep the original shapes
(`settings.examDate`, no exam id on history entries).

## About the questions

All questions are **original**, written against the official exam topics.
They are *not* real exam questions. Exam content is under NDA, and "dump"
sites that claim to have it break the certification agreement and can get you
decertified. Treat the banks as practice for the skills, not a preview of the
exam. Simulated scaled scores are linear estimates; vendors don't publish their
scoring methods (Cisco doesn't publish the CCNA cut score either: ~825/1000 is
a community estimate).

## App-menu launcher

The original CCNA site's menu entry (`~/.local/share/applications/ccna-prep.desktop`)
still runs `~/projects/ccna-prep/scripts/launch.sh`. To launch the hub instead,
point its `Exec=` at `~/projects/study-hub/scripts/launch.sh`.
