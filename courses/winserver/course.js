// AZ-802 Administering Windows Server course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'winserver:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'winserver',
  name: 'Windows Server Prep',
  shortName: 'AZ-802',
  title: 'AZ-802: Administering Windows Server',
  subtitle: 'AZ-802 · Windows Server 2025',
  vendor: 'Microsoft',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for AZ-802, the single exam for Windows Server Administrator Associate.',
  storePrefix: 'winserver:',
  backupName: 'winserver-backup',

  domains: DOMAINS,
  exams: [{
    id: 'az-802',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 50,
    minutes: EXAM.minutes,
    labs: 0,
    // Simulated score = 1 + 999 × credit. Microsoft's real scale is non-linear and item weights are unpublished.
    scoreMin: 1,
    scoreMax: 1000,
    passScore: EXAM.passingScore,
    passLabel: '700 to pass',
    trendLabel: '700 pass mark',
    passNote: EXAM.passingScoreNote,
    scoreNote: 'The simulated score maps your credit linearly onto 1–1000. Microsoft scales scores non-linearly and weights items differently, so treat it as an estimate; aim for 800+ here before booking.',
    dateHint: 'AZ-802 is live now; book through Pearson VUE',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code}, ${EXAM.minutes} minutes, typically ${EXAM.questionsApprox} items (Microsoft doesn't publish the count).`,
        'Multiple choice, multiple select, drag and drop, hot area, case studies and possibly interactive labs.',
        'Open book for Microsoft Learn, but the clock keeps running.',
        `Scaled 1–1000; ${EXAM.passingScore} or higher passes.`,
        `Replaces ${EXAM.replaces}.`,
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (120 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Re-run the "Lab it yourself" steps from the AD DS and storage lessons in your lab.', '#/learn'],
      ['Skim the Reference cheat sheets (ports, FSMO, replication defaults, DHCP failover, Storage Spaces).', '#/reference'],
      ['Take Microsoft\'s free official AZ-802 practice assessment as a final check.', '#/guide'],
    ],
  },
};
