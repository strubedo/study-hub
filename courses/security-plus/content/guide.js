// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// Sources (checked 2026-11-22): CompTIA Security+ V8 page and the SY0-801 exam objectives PDF, document version 2.0.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Exam', `**${EXAM.code}** (V8), launched November 17, 2026. CompTIA estimates retirement about three years after launch.`],
  ['Older version', 'SY0-701 (V7) stays available until **June 11, 2027** (English). This course targets SY0-801 only; the two have different objectives and domain weights.'],
  ['Format', `${EXAM.minutes} minutes, a maximum of ${EXAM.questions} questions: multiple choice and performance-based.`],
  ['Scoring', 'Scaled 100–900; **750** passes.'],
  ['Recommended experience', 'A security administrator with two years of hands-on experience.'],
  ['Validity', 'Three years; renew through CompTIA continuing education.'],
];

const STRATEGY = [
  ['Learn the vocabulary exactly', 'Many items turn on one word: detective vs. corrective control, RTO vs. RPO, SLA vs. SLO, data owner vs. custodian. The flashcards and Reference tables exist for this.'],
  ['Read the scenario for the constraint', 'Stems often hide the deciding detail ("least administrative effort", "without downtime", "first"). Find it before you read the options.'],
  ['Flag performance-based questions', 'They usually come first and take longest. Flag them, bank the multiple-choice marks, then come back.'],
  ['Operations is the biggest domain', 'Security Operations is 27% and Threats is 24%: over half the exam between them. Weight your study time the same way.'],
];

// Security+ is mostly concepts, but seeing the tools once makes the scenarios far easier.
const LAB = [
  ['Any computer', 'Nothing here needs a particular operating system. A free virtual machine (VirtualBox, UTM on a Mac, Hyper-V on Windows, KVM on Linux) is enough for every optional exercise.'],
  ['Worth doing once', 'Read a packet capture in **Wireshark**, generate a key pair and a certificate signing request with **OpenSSL**, hash a file and change one byte, and look at SPF, DKIM and DMARC records with `dig` or `nslookup`.'],
  ['Stay legal', 'Only scan, attack or capture traffic on systems and networks you own or have written permission to test.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Security+ SY0-801 at a glance',
    intro: 'What the exam covers, how it is scored and how to prepare.',
    action: { label: 'CompTIA Security+ V8 page', href: 'https://www.comptia.org/en-us/certifications/security/v8/' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['750 / 900', 'Passing score'],
      ['3 years', 'Validity'],
    ],
    rows: [
      [{
        title: 'About the certification',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** is the baseline security certification: controls and cryptography, threats and attacks, architecture, day-to-day security operations, and governance, risk and compliance.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details, and download the official objectives and sample questions, on [CompTIA\'s Security+ V8 page](https://www.comptia.org/en-us/certifications/security/v8/) before you book.',
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['SY0-801 domain', 'Weight'] }],
      }],
      [{
        title: 'Optional hands-on practice, on any computer',
        blocks: [{ type: 'list', items: LAB }],
      }],
      [{
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
