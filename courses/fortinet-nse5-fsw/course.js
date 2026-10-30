// Fortinet NSE 5 FortiSwitch 7.6 Administrator course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'nse5fsw:': every saved answer, lesson and exam lives under it.
// Fortinet gives 35-40 questions and 70 minutes (exam page, checked 2026-10-29); the simulator uses
// 38 questions (midpoint 37.5, rounded up because the engine needs a whole number) and 70 minutes.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'fortinet-nse5-fsw',
  name: 'NSE 5 FortiSwitch Prep',
  shortName: 'NSE 5 FortiSwitch',
  title: 'Fortinet NSE 5 - FortiSwitch 7.6 Administrator',
  subtitle: 'NSE 5 · FortiSwitch 7.6',
  vendor: 'Fortinet',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for NSE 5 FortiSwitch 7.6, a qualifying exam for NSE 5 Secure Networking and the NSE 7 path.',
  storePrefix: 'nse5fsw:',
  backupName: 'nse5-fsw-backup',

  domains: DOMAINS,
  exams: [{
    id: 'nse5-fortiswitch-7.6',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 38,
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
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questionsApprox} questions, ${EXAM.languages}. The simulator uses ${EXAM.minutes} minutes and 38 questions.`,
        'FortiSwitch management modes, provisioning over FortiLink, configuration, operation and day-to-day administration, with deployment topologies, operational scenarios, configuration extracts and troubleshooting captures. Standalone FortiSwitch is also tested. No labs.',
        'Pass or fail. Answers must be 100% correct to earn credit. Fortinet publishes no domain weights for this exam.',
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
      ['Take two full timed practice exams (70 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['On your FortiGate-VM, enable the switch controller, build a FortiLink interface and VLAN interface templates, then read execute switch-controller get-conn-status (no switch needed to see the config tree).', '#/learn'],
      ['Skim the Reference cheat sheets (FortiLink setup, STP and loop protection, DHCP snooping/DAI/IP source guard, troubleshooting commands).', '#/reference'],
      ['Do the sample questions in Fortinet\'s free FortiSwitch 7.6 Administrator self-paced course.', '#/guide'],
    ],
  },
};
