// TCP/IP IPv4 Fundamentals course config, read by the engine (engine/course.js) and the hub.
// storePrefix MUST stay 'tcpip:': every saved answer, lesson and test lives under it.
// There is no certification exam; the "exam" is this site's own 0–100 self-test with an 80% mastery mark.
import { EXAM, DOMAINS } from './content/blueprint.js';

export default {
  id: 'tcpip-ipv4',
  name: 'TCP/IP IPv4 Fundamentals',
  shortName: 'TCP/IP IPv4',
  title: 'TCP/IP and IPv4 in depth',
  subtitle: 'Vendor-neutral · IPv4',
  vendor: 'Vendor-neutral',
  description: 'Lessons, question bank, timed self-test and flashcards on how IPv4 networks really work: models and encapsulation, Ethernet and ARP, the IPv4 header, subnetting and VLSM, ICMP, MTU and fragmentation, UDP and TCP, routing, DHCP, DNS, NAT and packet-level troubleshooting.',
  storePrefix: 'tcpip:',
  backupName: 'tcpip-ipv4-backup',

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
        `${EXAM.questions} questions in ${EXAM.minutes} minutes, drawn across all four domains by weight.`,
        'Mixes multiple choice, multiple select, ordering, matching and fill-in-the-blank (subnet math, port numbers, commands).',
        'This course feeds CCNA, Network+ and every vendor firewall track; the subnetting and TCP material is fair game on all of them.',
      ],
    },
  }],

  videos: { list: 'content/videos.js', page: 'content/video-page.js' },
  reference: 'content/reference.js',
  guide: 'content/guide.js',

  plan: {
    reviewTasks: [
      ['Take two timed self-tests; aim for 85%+.', '#/exam'],
      ['Do 20 subnetting questions a day until you get them right in under 30 seconds each.', '#/practice'],
      ['Clear every due flashcard each day this week.', '#/flashcards'],
      ['Capture a ping, a traceroute, a DHCP renew, a DNS lookup and an HTTPS connection in Wireshark and name every field you see.', '#/learn'],
      ['Skim the Reference tables (special addresses, ICMP types, ports, TCP flags and states).', '#/reference'],
    ],
  },
};
