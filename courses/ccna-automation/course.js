// Cisco CCNA Automation (200-901 CCNAAUTO) course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'ccnaauto:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'ccna-automation',
  name: 'CCNA Automation',
  shortName: 'CCNA Automation',
  title: '200-901 CCNAAUTO',
  subtitle: 'Cisco · 200-901',
  vendor: 'Cisco',
  description: 'Lessons, question bank, timed practice exam and flashcards for Cisco CCNA Automation (200-901 CCNAAUTO v1.1, formerly DevNet Associate): data formats and Git, REST APIs with Python requests, Cisco platform APIs and SDKs, NETCONF, RESTCONF and YANG, Docker and CI/CD, Ansible and Terraform, and the network fundamentals behind them.',
  storePrefix: 'ccnaauto:',
  backupName: 'ccna-automation-backup',

  domains: DOMAINS,
  exams: [{
    id: '200-901',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: EXAM.questions,
    minutes: EXAM.minutes,
    labs: 0,
    // Scaled score = 300 + 700 × credit. Cisco's real scoring method is unpublished.
    scoreMin: 300,
    scoreMax: 1000,
    passScore: EXAM.passingScore, // Cisco publishes no cut score; ~825 is the community estimate
    partialCredit: false,
    passLabel: '~825 community pass estimate',
    trendLabel: '~825 estimate',
    passNote: EXAM.passingScoreNote,
    scoreNote: 'The scaled score is a linear estimate. A question counts only when fully correct; Cisco\'s real scoring method is unpublished.',
    dateHint: 'set your exam date to pace the study plan',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code} CCNAAUTO v1.1, ${EXAM.minutes} minutes. Cisco does not publish the number of questions.`,
        'Multiple choice, multiple select, drag and drop and fill-in-the-blank, many built around a code or API exhibit.',
        'Cisco does not publish a passing score.',
        'The certification is valid for three years.',
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
      ['Redo the hands-on labs without notes: a requests script against a sandbox API, a RESTCONF GET, a Dockerfile build and a Git merge conflict.', '#/learn'],
      ['Skim the Reference tables (HTTP status codes, API authentication, NETCONF vs RESTCONF, Cisco platform APIs).', '#/reference'],
    ],
  },
};
