// Fortinet NSE 6 FortiManager 7.6 Administrator course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'nse6fmg:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'fortinet-nse6-fmg',
  name: 'NSE 6 FortiManager Prep',
  shortName: 'NSE 6 FMG',
  title: 'Fortinet NSE 6 - FortiManager 7.6 Administrator',
  subtitle: 'NSE 6 · FortiManager 7.6',
  vendor: 'Fortinet',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for NSE 6 FortiManager 7.6, a qualifying exam for NSE 6 Secure Networking and the NSE 7 path.',
  storePrefix: 'nse6fmg:',
  backupName: 'nse6-fortimanager-backup',

  domains: DOMAINS,
  exams: [{
    id: 'nse6-fortimanager-7.6',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 35,
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
    dateHint: 'requires an active NSE 4 to earn NSE 6 Secure Networking',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questionsApprox} questions, English and Japanese.`,
        'Operational scenarios, system configuration, device registration and troubleshooting. Multiple choice and drag-and-drop; no labs.',
        'Pass or fail. Answers must be 100% correct to earn credit.',
        'Earns NSE 6 Secure Networking together with an active NSE 4, which in turn qualifies you for NSE 7 Secure Networking.',
        'Retake a failed exam after 15 days. Pearson VUE test center or OnVUE.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (70 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Register a FortiGate-VM to your FortiManager-VM trial, import its policy, change it and install it again.', '#/learn'],
      ['Skim the Reference cheat sheets.', '#/reference'],
      ['Do the sample questions in Fortinet\'s free FortiManager 7.6 Administrator self-paced course.', '#/guide'],
    ],
  },
};
