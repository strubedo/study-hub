// Course guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// No certification exam: this page explains how to use the course and where it leads.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Certification', 'None. This is a skills course; it underpins CCNA, CompTIA Network+ and every firewall track.'],
  ['Self-test', `${EXAM.questions} questions in ${EXAM.minutes} minutes, scored as percent correct.`],
  ['Mastery mark', '**80%** on the self-test, and every domain above 80% on the dashboard.'],
  ['Sources', 'Built from the protocol RFCs (791, 792, 768, 9293, 826, 2131, 1034/1035, 1918, 6890) rather than any one vendor.'],
];

const STRATEGY = [
  ['Subnetting is a speed skill', 'Practise until you can find network, broadcast and host range for any address and prefix in your head. Use the block-size method.'],
  ['Capture everything', 'Wireshark on your own machine shows every field in these lessons. Read real headers, not just diagrams.'],
  ['Lab it', 'Any Linux VM plus your Cisco lab covers it all: ARP tables, traceroute, MTU tests with DF set, DHCP relay, NAT overload.'],
  ['Know the numbers', 'Protocol numbers, ICMP types, well-known ports, TCP flags and the special address blocks come up everywhere. Drill them with flashcards.'],
];

export default function guide() {
  return {
    eyebrow: 'Course guide',
    title: 'How to use this course',
    intro: 'TCP/IP IPv4 Fundamentals has no exam of its own. Work through the four domains in order, then use the self-test to prove mastery.',
    action: { label: 'RFC 791 (IPv4)', href: 'https://www.rfc-editor.org/rfc/rfc791' },
    stats: [
      [`${EXAM.minutes} min`, 'Self-test time'],
      [String(EXAM.questions), 'Self-test questions'],
      ['80%', 'Mastery mark'],
      ['4', 'Domains'],
    ],
    rows: [
      [{
        title: 'About this course',
        accent: true,
        blocks: [{ type: 'text', md: 'A vendor-neutral, packet-level tour of IPv4 networking. It goes deeper than CCNA on headers, ARP, fragmentation and TCP behaviour, and it is the foundation for every vendor track on this hub.' }],
      }],
      [{
        title: 'Course facts',
        blocks: [{ type: 'list', items: FACTS }],
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['Domain', 'Self-test share'] }],
      }],
      [{
        title: 'Study strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
