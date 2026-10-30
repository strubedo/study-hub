// AZ-900 Azure Fundamentals review course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'az900:': every saved answer, lesson and exam lives under it.
// The learner has already passed AZ-900; this is a refresher that still simulates the real exam format.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'az-900',
  name: 'AZ-900: Azure Fundamentals',
  shortName: 'AZ-900',
  title: 'Review',
  subtitle: 'Microsoft · AZ-900',
  vendor: 'Microsoft',
  description: 'A refresher on Microsoft Azure Fundamentals (AZ-900, skills measured as of July 20, 2026): cloud concepts, Azure architecture, compute, networking, storage, identity and security, cost management, governance and monitoring, with a timed practice exam and flashcards.',
  storePrefix: 'az900:',
  backupName: 'az-900-backup',

  domains: DOMAINS,
  exams: [{
    id: 'az-900',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: EXAM.questions,
    minutes: EXAM.minutes,
    labs: 0,
    // Simulated score = 1 + 999 × credit. Microsoft's real scale is non-linear and item weights are unpublished.
    scoreMin: 1,
    scoreMax: 1000,
    passScore: EXAM.passingScore,
    partialCredit: false,
    passLabel: '700 to pass',
    trendLabel: '700 pass mark',
    passNote: 'Microsoft requires 700 on a 1–1000 scaled score. This site maps percent correct linearly onto that scale, so treat it as an estimate.',
    scoreNote: 'A question counts only when fully correct; multiple-select items get no partial credit here.',
    dateHint: 'already passed: use this to stay sharp before AZ-104 or AZ-802',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code}, ${EXAM.minutes} minutes, typically ${EXAM.questionsApprox} items (Microsoft doesn't publish the count).`,
        'Multiple choice, multiple select, yes/no statement sets, drag and drop and hot area.',
        `Scaled 1–1000; ${EXAM.passingScore} or higher passes.`,
        'Fundamentals certifications do not expire.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two timed practice exams; aim for 85%+.', '#/exam'],
      ['Drill your weakest topic from the dashboard until it is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Take Microsoft\'s free AZ-900 practice assessment on Microsoft Learn.', '#/guide'],
      ['Skim the Reference tables (service models, storage redundancy and tiers, governance tools).', '#/reference'],
    ],
  },
};
