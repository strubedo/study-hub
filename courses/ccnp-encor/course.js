// Cisco CCNP Enterprise core (350-401 ENCOR v1.2) course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'encor:': every saved answer, lesson and exam lives under it.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'ccnp-encor',
  name: 'CCNP ENCOR',
  shortName: 'ENCOR',
  title: '350-401 ENCOR',
  subtitle: 'Cisco · 350-401',
  vendor: 'Cisco',
  description: 'Lessons, question bank, timed practice exam and flashcards for the CCNP Enterprise core exam (350-401 ENCOR v1.2): enterprise design, Catalyst SD-WAN and SD-Access, QoS, VRF, GRE and IPsec, LISP and VXLAN, trunking, EtherChannel and spanning tree, OSPF, EIGRP and eBGP, NAT, FHRP and multicast, network assurance, AAA, ACLs and CoPP, and automation with Python, YANG, RESTCONF and EEM.',
  storePrefix: 'encor:',
  backupName: 'ccnp-encor-backup',

  domains: DOMAINS,
  exams: [{
    id: '350-401',
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
        `${EXAM.code} ENCOR v1.2, ${EXAM.minutes} minutes. Cisco does not publish the number of questions.`,
        'Multiple choice, multiple select, drag and drop, and hands-on lab simulations where you configure and verify devices.',
        'Cisco does not publish a passing score.',
        'Passing ENCOR plus one concentration exam earns CCNP Enterprise; ENCOR also qualifies you for the CCIE Enterprise lab.',
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
      ['Rebuild the core labs from a blank topology without notes: MST with root guard, multi-area OSPF with summarization, eBGP, HSRP, PAT, a VRF-lite GRE tunnel with IPsec, and an EEM applet.', '#/learn'],
      ['Skim the Reference tables (OSPF LSA and area types, BGP best-path order, STP port states and guards, show commands by symptom).', '#/reference'],
    ],
  },
};
