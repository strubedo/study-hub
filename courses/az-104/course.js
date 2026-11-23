// AZ-104 Azure Administrator course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'az104:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'az-104',
  name: 'AZ-104: Azure Administrator',
  shortName: 'AZ-104',
  title: 'Azure Administrator',
  subtitle: 'Microsoft · AZ-104',
  vendor: 'Microsoft',
  description: 'Lessons, question bank, timed practice exam and flashcards for Microsoft Azure Administrator (AZ-104): Microsoft Entra users and groups, role-based access control, Azure Policy and governance, storage accounts, Azure Files and Blob Storage, ARM templates and Bicep, virtual machines, containers, App Service, virtual networking, load balancing, Azure Monitor, and backup and Site Recovery.',
  storePrefix: 'az104:',
  backupName: 'az-104-backup',

  domains: DOMAINS,
  exams: [{
    id: 'az-104',
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
    dateHint: 'set your exam date to pace the study plan',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code}, ${EXAM.minutes} minutes, typically ${EXAM.questionsApprox} items (Microsoft doesn't publish the count).`,
        'Multiple choice, multiple select, yes/no statement series, drag and drop, hot area and case studies; the exam may include interactive components.',
        `Scaled 1–1000; ${EXAM.passingScore} or higher passes.`,
        'The certification is valid for one year and is renewed with a free online assessment on Microsoft Learn.',
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
      ['Take Microsoft\'s free AZ-104 practice assessment on Microsoft Learn.', '#/guide'],
      ['Skim the Reference tables (RBAC scopes and built-in roles, storage redundancy and tiers, NSG rule evaluation, backup vault types).', '#/reference'],
    ],
  },
};
