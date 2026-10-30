// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-29): NSE 6 FortiManager 7.6 Administrator exam page, Fortinet certification
// program and training-policy pages, helpdesk.training.fortinet.com notices. Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['NSE 4 FortiOS', 'Required first. NSE 6 Secure Networking needs an active NSE 4.'],
  ['NSE 6 Secure Networking', 'NSE 4 + one of: **FortiManager 7.6** (this course) or FortiNAC-F 7.6. FortiAnalyzer and FortiVoice exams are listed as "coming soon".'],
  ['NSE 7 Secure Networking', 'Active NSE 4 + active NSE 5 SN or NSE 6 SN, then the Secure Networking 7.6 Architect exam. Central management (FortiManager) is 15–25% of it.'],
];

const POLICIES = [
  ['Scoring', 'Pass or fail. An answer must be **100% correct** to earn credit — no partial credit, no deduction for wrong answers.'],
  ['Retake after a fail', 'Wait **15 days**. You can\'t retake an exam you passed.'],
  ['Validity', 'Certifications are valid for **2 years**; earning NSE 7 also renews NSE 4/5/6.'],
  ['Delivery', 'Pearson VUE test center or OnVUE online proctoring.'],
  ['Fees', `${EXAM.price}.`],
];

const STRATEGY = [
  ['Know the two databases', 'Most troubleshooting items turn on the difference between the device database (device-level settings) and the ADOM database (policy packages and objects), and on what each status means.'],
  ['Follow the workflow', 'Register → import → edit → policy check → install preview → install. Know what each wizard does and what it changes.'],
  ['Locks and sessions', 'Workspace and workflow mode questions are about who can edit what, when changes are saved, and what an admin must do to release a lock.'],
  ['FGFM and NAT', 'Draw the topology: which side starts the connection, which address the FortiGate is pointed at, and what NAT does to it.'],
  ['Choose-two means exactly two', 'No partial credit: one wrong choice scores zero. The simulator here grades the same way.'],
  ['Lab inside the trial', 'FortiManager-VM trial: 3 devices/VDOMs, 2 ADOMs, no FortiGuard or FDS features. Register one or two FortiGate-VM trials and practise import, install, scripts and revisions.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NSE 6 FortiManager exam',
    intro: 'Format, where it sits on the Secure Networking path, Fortinet\'s policies, and how to approach the exam.',
    action: { label: 'Schedule with Pearson VUE', href: 'https://home.pearsonvue.com/fortinet' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['Pass / fail', 'No published cut score · no partial credit'],
      [`${EXAM.validityYears} years`, 'Certification validity'],
    ],
    rows: [
      [{
        title: 'About this exam',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** covers ${EXAM.product}. It tests applied knowledge of FortiManager configuration and operation: operational scenarios, system configuration, device registration and troubleshooting. No FortiManager 8.0 exam has been announced (checked 2026-10-29).` }],
      }],
      [{
        title: 'The Secure Networking path',
        blocks: [{ type: 'list', items: PATH }],
      }, {
        title: 'Fortinet exam policies',
        blocks: [{ type: 'list', items: POLICIES }],
        note: 'Policies change. Confirm on Fortinet\'s [training policies page](https://training.fortinet.com/local/staticpage/view.php?page=training_policies) before booking.',
      }],
      [{
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['NSE 6 FortiManager 7.6', '%'] }],
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
