// CompTIA Security+ SY0-801 course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'secplus:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'security-plus',
  name: 'CompTIA Security+',
  shortName: 'Security+',
  title: 'SY0-801',
  subtitle: 'CompTIA · SY0-801',
  vendor: 'CompTIA',
  description: 'Lessons, question bank, timed practice exam and flashcards for CompTIA Security+ (SY0-801, V8): security controls and cryptography, threats, vulnerabilities and attacks including AI risks, security architecture and data protection, security operations, identity, incident response, and governance, risk and compliance.',
  storePrefix: 'secplus:',
  backupName: 'security-plus-backup',

  domains: DOMAINS,
  exams: [{
    id: 'sy0-801',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: EXAM.questions,
    minutes: EXAM.minutes,
    labs: 0,
    // Simulated score = 100 + 800 × credit. CompTIA's real scale is non-linear and item weights are unpublished.
    scoreMin: 100,
    scoreMax: 900,
    passScore: EXAM.passingScore,
    partialCredit: false,
    passLabel: '750 to pass',
    trendLabel: '750 pass mark',
    passNote: 'CompTIA requires 750 on a 100–900 scaled score. This site maps percent correct linearly onto that scale, so treat it as an estimate.',
    scoreNote: 'A question counts only when fully correct; multiple-select and fill-in-the-blank items get no partial credit here.',
    dateHint: 'set your exam date to pace the study plan',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code} (V8), ${EXAM.minutes} minutes, a maximum of ${EXAM.questions} questions.`,
        'Multiple choice and performance-based questions (drag and drop, log analysis, configuration simulations).',
        `Scaled 100–900; ${EXAM.passingScore} or higher passes.`,
        'The certification is valid for three years and can be renewed with continuing education.',
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
      ['Re-read the acronym-heavy Reference tables (control types, agreement types, recovery metrics, attack indicators).', '#/reference'],
      ['Work through CompTIA\'s own sample questions for SY0-801 and compare your score with this site.', '#/guide'],
    ],
  },
};
