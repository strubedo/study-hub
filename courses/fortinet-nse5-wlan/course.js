// Fortinet NSE 5 Secure Wireless LAN 7.6 Administrator course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'nse5wlan:': every saved answer, lesson and exam lives under it.
// Fortinet gives 30-40 questions in 70 minutes; the simulator uses the midpoint (35) and the full 70 minutes.
// Source: training.fortinet.com/local/staticpage/view.php?page=secure_wireless_lan_administrator_exam (checked 2026-10-29).
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'fortinet-nse5-wlan',
  name: 'NSE 5 Secure Wireless LAN Prep',
  shortName: 'NSE 5 WLAN',
  title: 'Fortinet NSE 5 - Secure Wireless LAN 7.6 Administrator',
  subtitle: 'NSE 5 · Secure Wireless LAN 7.6',
  vendor: 'Fortinet',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for NSE 5 Secure Wireless LAN 7.6 (FortiGate wireless controller and FortiAP), a qualifying exam for NSE 5 Secure Networking and the NSE 7 path.',
  storePrefix: 'nse5wlan:',
  backupName: 'nse5-wlan-backup',

  domains: DOMAINS,
  exams: [{
    id: 'nse5-wlan-7.6',
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
    dateHint: 'requires an active NSE 4 to earn NSE 5 Secure Networking',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questionsApprox} questions, English only. The simulator uses ${EXAM.minutes} minutes and 35 questions.`,
        'FortiGate integrated wireless controller configuration, FortiEdge Cloud management, the FortiAIOps solution, operation and day-to-day administration, with operational scenarios, configuration extracts and troubleshooting captures.',
        'Fortinet publishes no domain weights for this exam; the simulator weights the four areas equally.',
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
      ['Take two full timed practice exams (70 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Walk a FortiAP from discovery to CAPWAP RUN state: read a wtp_filter / cw_acd debug and a sta_filter client debug until every phase is familiar.', '#/learn'],
      ['Skim the Reference cheat sheets (discovery methods, SSID security modes, radio modes, WIDS, diagnose commands).', '#/reference'],
      ['Do the sample questions in Fortinet\'s free Secure Wireless LAN 7.6 Administrator self-paced course.', '#/guide'],
    ],
  },
};
