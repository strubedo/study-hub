// Fortinet NSE 4 FortiOS 8.0 Administrator course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'nse4:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'fortinet-nse4',
  name: 'NSE 4 FortiOS Prep',
  shortName: 'NSE 4',
  title: 'Fortinet NSE 4 - FortiOS 8.0 Administrator',
  subtitle: 'NSE 4 · FortiOS 8.0',
  vendor: 'Fortinet',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for NSE 4 FortiOS 8.0, the first step on the Fortinet Secure Networking path.',
  storePrefix: 'nse4:',
  backupName: 'nse4-backup',

  domains: DOMAINS,
  exams: [{
    id: 'nse4-fortios-8.0',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 55,
    minutes: EXAM.minutes,
    labs: 0,
    // Fortinet reports pass/fail only and gives no partial credit. The simulator shows percent correct.
    scoreMin: 0,
    scoreMax: 100,
    passScore: 75,
    partialCredit: false,
    passLabel: '75% site target',
    trendLabel: '75% target',
    passNote: 'Fortinet reports pass or fail only and publishes no cut score. This site uses 75% as a target, not an official figure.',
    scoreNote: 'Scored like the real exam: an item counts only when it is 100% correct (no partial credit), and there is no penalty for wrong answers.',
    dateHint: 'NSE 4 8.0 is "Coming Soon"; the 7.6 version is bookable until Fortinet retires it',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questionsApprox} questions, English only at launch.`,
        'Multiple choice and drag-and-drop, built around configuration extracts, operational scenarios and troubleshooting captures. No labs.',
        'Pass or fail. Answers must be 100% correct to earn credit; no partial credit, no deduction for wrong answers.',
        'Retake a failed exam after 15 days. Certifications are valid for 2 years.',
        'Pearson VUE test center or OnVUE online proctoring.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (100 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Re-run a debug flow and a sniffer capture on your FortiGate-VM until the syntax is automatic.', '#/learn'],
      ['Skim the Reference cheat sheets (diagnose commands, HA election, IP pools, inspection modes).', '#/reference'],
      ['Do the sample questions in Fortinet\'s free FortiOS 8.0 Administrator self-paced course.', '#/guide'],
    ],
  },
};
