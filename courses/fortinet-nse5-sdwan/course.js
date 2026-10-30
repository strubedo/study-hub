// Fortinet NSE 5 SD-WAN Core 7.6 Administrator course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'nse5sdwan:': every saved answer, lesson and exam lives under it.
// Fortinet gives ranges (30–35 questions, 60–70 minutes); the simulator uses the midpoints (33, 65).
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'fortinet-nse5-sdwan',
  name: 'NSE 5 SD-WAN Core Prep',
  shortName: 'NSE 5 SD-WAN',
  title: 'Fortinet NSE 5 - SD-WAN Core 7.6 Administrator',
  subtitle: 'NSE 5 · SD-WAN Core 7.6',
  vendor: 'Fortinet',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for NSE 5 SD-WAN Core 7.6, a qualifying exam for NSE 5 Secure Networking and the NSE 7 path.',
  storePrefix: 'nse5sdwan:',
  backupName: 'nse5-sdwan-backup',

  domains: DOMAINS,
  exams: [{
    id: 'nse5-sdwan-core-7.6',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 33,
    minutes: EXAM.minutes,
    labs: 0,
    scoreMin: 0,
    scoreMax: 100,
    passScore: 75,
    partialCredit: false,
    passLabel: '75% site target',
    trendLabel: '75% target',
    passNote: 'Fortinet reports pass or fail only and publishes no cut score. This site uses 75% as a target, not an official figure.',
    scoreNote: 'Scored like the real exam: an item counts only when it is 100% correct (no partial credit), and there is no penalty for wrong answers.',
    dateHint: 'requires an active NSE 4 to earn NSE 5 Secure Networking',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutesRange} minutes, ${EXAM.questionsApprox} questions, English only. The simulator uses ${EXAM.minutes} minutes and 33 questions.`,
        'Operational scenarios, monitoring and performance analysis, FortiGate and FortiManager integration, and troubleshooting of WAN connectivity, routing and application steering. Multiple choice and drag-and-drop; no labs.',
        'Pass or fail. Answers must be 100% correct to earn credit.',
        'Earns NSE 5 Secure Networking together with an active NSE 4, which in turn qualifies you for NSE 7 Secure Networking.',
        'Retake a failed exam after 15 days. Pearson VUE test center or OnVUE.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (65 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['On your FortiGate-VM, build a two-member SD-WAN zone with a performance SLA, then read diagnose sys sdwan health-check, member and service4 while you fail one link.', '#/learn'],
      ['Skim the Reference cheat sheets (rule strategies, SLA defaults, routing, diagnose commands).', '#/reference'],
      ['Do the sample questions in Fortinet\'s free SD-WAN 7.6 Core Administrator self-paced course.', '#/guide'],
    ],
  },
};
