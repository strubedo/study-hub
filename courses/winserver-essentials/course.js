// Windows Server 2025 Essentials course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'wsess:': every saved answer, lesson and test lives under it.
// There is no certification exam; the "exam" is this site's own 0–100 self-test with an 80% mastery mark.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'winserver-essentials',
  name: 'Windows Server 2025 Essentials',
  shortName: 'Server 2025 Essentials',
  title: 'Core Windows Server 2025 administration',
  subtitle: 'Microsoft · Server 2025',
  vendor: 'Microsoft',
  description: 'Lessons, question bank, timed self-test and flashcards for day-to-day Windows Server 2025 administration: editions and licensing, Server Core and remote management, Active Directory and Group Policy, DNS, DHCP and file services, Storage Spaces and Hyper-V, security, monitoring and backup.',
  storePrefix: 'wsess:',
  backupName: 'winserver-essentials-backup',

  domains: DOMAINS,
  exams: [{
    id: 'self-test',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: EXAM.questions,
    minutes: EXAM.minutes,
    labs: 0,
    scoreMin: 0,
    scoreMax: 100,
    passScore: 80,
    partialCredit: false,
    passLabel: '80% mastery mark',
    trendLabel: '80% mastery',
    passNote: 'There is no certification exam for this course. The self-test reports percent correct; 80% is this site\'s mastery mark.',
    scoreNote: 'A question counts only when fully correct; multiple-select and fill-in-the-blank items get no partial credit.',
    dateHint: 'optional: set a target date to pace the study plan',
    about: {
      title: 'About the self-test',
      items: [
        `${EXAM.questions} questions in ${EXAM.minutes} minutes, drawn across all five domains by weight.`,
        'Mixes multiple choice, multiple select, ordering, matching and fill-in-the-blank (PowerShell cmdlets, console names, settings).',
        'This course is the hands-on foundation for AZ-802 (the Windows Server Hybrid Administrator site on this hub).',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two timed self-tests; aim for 85%+.', '#/exam'],
      ['Build a lab: one DC, one member server (Server Core), one Windows client, all in Hyper-V.', '#/learn'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Do every task in the AD DS and Group Policy lessons with both the GUI and PowerShell.', '#/learn'],
      ['Skim the Reference tables (PowerShell cmdlets, group scopes, GPO order, ports).', '#/reference'],
    ],
  },
};
