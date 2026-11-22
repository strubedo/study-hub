// CompTIA Linux+ XK0-006 course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'linuxplus:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'linux-plus',
  name: 'CompTIA Linux+',
  shortName: 'Linux+',
  title: 'XK0-006',
  subtitle: 'CompTIA · XK0-006',
  vendor: 'CompTIA',
  description: 'Lessons, question bank, timed practice exam and flashcards for CompTIA Linux+ (XK0-006, V8): system management, storage and networking, services and users, systemd, containers, security and SELinux, automation with shell, Python, Git and Ansible, and troubleshooting.',
  storePrefix: 'linuxplus:',
  backupName: 'linux-plus-backup',

  domains: DOMAINS,
  exams: [{
    id: 'xk0-006',
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
    passLabel: '720 to pass',
    trendLabel: '720 pass mark',
    passNote: 'CompTIA requires 720 on a 100–900 scaled score. This site maps percent correct linearly onto that scale, so treat it as an estimate.',
    scoreNote: 'A question counts only when fully correct; multiple-select and fill-in-the-blank items get no partial credit here.',
    dateHint: 'set your exam date to pace the study plan',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.code} (V8), ${EXAM.minutes} minutes, a maximum of ${EXAM.questions} questions.`,
        'Multiple choice and performance-based questions (hands-on command-line simulations).',
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
      ['Redo the "Lab it yourself" sections for LVM, systemd, firewalld and SELinux in a VM without notes.', '#/learn'],
      ['Skim the Reference tables (LVM commands, systemctl verbs, permissions, troubleshooting tools).', '#/reference'],
    ],
  },
};
