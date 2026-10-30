// Palo Alto Networks Certified Next-Generation Firewall Engineer course config, read by the engine
// (engine/course.js) and the hub. storePrefix MUST stay 'pangfw:': every saved answer, lesson and exam lives under it.
// Palo Alto doesn't publish the question count; about 75 questions in 90 minutes is widely reported, so the
// simulator uses 75 / 90. The real scaled cut score is 860 on 300–1000 (Certification Handbook).
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'paloalto-ngfw',
  name: 'NGFW Engineer Prep',
  shortName: 'PAN NGFW Engineer',
  title: 'Palo Alto Networks Certified Next-Generation Firewall Engineer',
  subtitle: 'Palo Alto · NGFW Engineer',
  vendor: 'Palo Alto Networks',
  description: 'Curriculum, question bank, timed exam simulator and flashcards for the Palo Alto Networks NGFW Engineer exam, the successor to the retired PCNSE.',
  storePrefix: 'pangfw:',
  backupName: 'paloalto-ngfw-backup',

  domains: DOMAINS,
  exams: [{
    id: 'ngfw-engineer',
    code: EXAM.code,
    name: EXAM.name,
    questionCount: 75,
    minutes: EXAM.minutes,
    labs: 0,
    scoreMin: 300,
    scoreMax: 1000,
    passScore: 860,
    partialCredit: false,
    passLabel: '860 to pass',
    trendLabel: '860 pass mark',
    passNote: 'Palo Alto uses a scaled score of 300–1000 with 860 to pass. This site maps percent correct linearly onto that scale, so 860 here is about 80% correct; the real conversion varies by exam form.',
    scoreNote: 'A question counts only when it is fully correct. Palo Alto does not publish whether multiple-select items earn partial credit, so the simulator gives none.',
    dateHint: 'Specialist-level exam; no prerequisite certification is required',
    about: {
      title: 'About the real exam',
      items: [
        `${EXAM.name}: ${EXAM.minutes} minutes, ${EXAM.questionsApprox}. English only, with a 30-minute extension in non-English-speaking countries.`,
        'Three domains: PAN-OS networking configuration (40%), PAN-OS device setting configuration (40%), integration and automation (20%).',
        'Scaled score 300–1000; 860 to pass.',
        'Retakes: 15 days after the 1st fail, 30 days after the 2nd, 90 days after the 3rd. After passing, the same exam is locked for 18 months.',
        'Valid 2 years; recertify by retaking the exam. Booked through Pearson VUE.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two full timed practice exams (90 min each).', '#/exam'],
      ['Drill your three weakest topics from the dashboard until each is above 85%.', '#/'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['In a VM-Series or PA-Series lab, build L3 and virtual wire interfaces, an IPSec tunnel and an HA pair, then read the CLI show commands in the lessons.', '#/learn'],
      ['Skim the Reference cheat sheets (interfaces, HA, User-ID, Panorama).', '#/reference'],
      ['Review the datasheet blueprint and the free digital learning path on Palo Alto Networks Beacon.', '#/guide'],
    ],
  },
};
