// CCNA 200-301 v2.0 course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'ccna:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'ccna',
  name: 'CCNA Prep',
  shortName: 'CCNA',
  title: 'CCNA 200-301 v2.0',
  subtitle: '200-301 · blueprint v2.0',
  vendor: 'Cisco',
  description: 'Curriculum, question bank, timed exam simulator with IOS CLI labs, subnetting trainer and flashcards for the v2.0 blueprint.',
  storePrefix: 'ccna:',
  legacyBackupApps: ['ccna-prep'], // backups exported before the hub existed
  backupName: 'ccna-prep-backup',

  domains: DOMAINS,
  exams: [{
    id: '200-301',
    code: '200-301',
    name: EXAM.name,
    questionCount: 100,
    minutes: 120,
    labs: 3,
    // Scaled score = scoreMin + (scoreMax - scoreMin) × credit, i.e. 300 + 700 × score.
    scoreMin: 300,
    scoreMax: 1000,
    passScore: 825, // Cisco publishes no cut score; ~825 is the community estimate
    passLabel: '~825 community pass estimate',
    trendLabel: '~825 estimate',
    passNote: EXAM.passingScoreNote,
    scoreNote: "The scaled score is a linear estimate (partial credit counted for labs and matching). Cisco's real scoring method is unpublished.",
    dateHint: `v2.0 starts ${EXAM.liveFrom}`,
    dateWarning: { before: EXAM.liveFrom, message: `This date is before ${EXAM.liveFrom}. You would sit v1.1, not v2.0, and this site targets v2.0.` },
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code} ${EXAM.version}, ${EXAM.minutes} minutes, roughly ${EXAM.questionsApprox} items.`,
        'Multiple choice, multiple answer, drag-and-drop, and CLI simulations / simlets.',
        'No going back once you submit an answer.',
        'Scored on a 300–1000 scale; Cisco does not publish the cut score.',
        `v2.0 becomes live ${EXAM.liveFrom}; v1.1 ends ${EXAM.previousVersionLastDay}.`,
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  // Labs provider: exports `labs` and `loadMountLab()`. The exam simulator mixes exam-eligible labs in.
  labs: { module: 'plugins/labs.js', route: 'labs', label: 'CLI labs', examLabel: 'CLI simulation labs', itemBadge: 'CLI simulation' },

  nav: [
    { path: 'labs', label: 'CLI Labs', icon: 'terminal', group: 'Practice', after: 'exam', module: 'plugins/views/labs.js' },
    { path: 'subnetting', label: 'Subnetting', icon: 'calc', group: 'Practice', after: 'labs', module: 'plugins/views/subnetting.js' },
  ],

  dashboard: {
    quickLinks: [
      { label: 'Subnetting sprint', icon: 'bolt', href: '#/subnetting' },
      { label: 'CLI labs', icon: 'terminal', href: '#/labs' },
    ],
  },

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (120 min each) in strict mode.', '#/exam'],
      ['Redo every CLI lab you have not completed — typing speed matters on sims.', '#/labs'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Run a 5-minute subnetting sprint daily; target 15+ correct.', '#/subnetting'],
      ['Skim the Reference cheat sheets (AD values, ports, syslog levels, STP).', '#/reference'],
    ],
  },
};
