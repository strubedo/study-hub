// Fortinet NSE 7 Secure Networking 7.6 Architect course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'nse7:': every saved answer, lesson and exam lives under it.
// Exam facts: training.fortinet.com secure_networking_architect_exam page and the helpdesk OnVUE and
// exam-fee notices (checked 2026-10-29).
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'fortinet-nse7',
  name: 'NSE 7 Secure Networking Prep',
  shortName: 'NSE 7 SN',
  title: 'Fortinet NSE 7 - Secure Networking 7.6 Architect',
  subtitle: 'NSE 7 · Secure Networking 7.6',
  vendor: 'Fortinet',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for NSE 7 Secure Networking 7.6 Architect: SD-WAN, ADVPN, BGP, HA and FortiManager orchestration at architect level.',
  storePrefix: 'nse7:',
  backupName: 'nse7-secure-networking-backup',

  domains: DOMAINS,
  exams: [{
    id: 'nse7-secure-networking-7.6',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 45,
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
    dateHint: 'requires an active NSE 4 plus an active NSE 5 SN or NSE 6 SN',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questionsApprox} questions, English and Japanese.`,
        'Designing, administering and supporting secure SD-WAN and multi-FortiGate enterprise networks: operational scenarios, incident analysis, FortiManager/FortiAnalyzer integration and troubleshooting. Multiple choice and drag-and-drop; no labs.',
        'Pass or fail. Answers must be 100% correct to earn credit.',
        'Prerequisites: an active NSE 4 FortiOS plus an active NSE 5 or NSE 6 Secure Networking certification; pass this exam within 2 years of the last prerequisite.',
        'Pearson VUE test center only: OnVUE online delivery ended for NSE 7 on 2026-09-21. Retake a failed exam after 15 days.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (75 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Draw a dual-hub ADVPN design with BGP on loopback from memory: loopbacks, overlays, neighbor ranges and SD-WAN zones.', '#/reference'],
      ['Build one hub and one spoke on FortiGate-VM trials (one overlay fits the 3-interface/3-policy/3-route limit) and watch a BGP session come up over the tunnel.', '#/learn'],
      ['Do Fortinet\'s official NSE 7 sample questions (the exam page points to the Training Institute course that holds them).', '#/guide'],
    ],
  },
};
