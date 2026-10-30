// Course guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// No certification exam: this page explains how to use the course and where it leads (AZ-802).
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Certification', 'None. This is a skills course. The certification path for Windows Server is AZ-802 (Windows Server Hybrid Administrator), which has its own site on this hub.'],
  ['Self-test', `${EXAM.questions} questions in ${EXAM.minutes} minutes, scored as percent correct.`],
  ['Mastery mark', '**80%** on the self-test, and every domain above 80% on the dashboard.'],
  ['Version', 'Windows Server 2025 (the current Long-Term Servicing Channel release). Facts are checked against Microsoft Learn.'],
];

const STRATEGY = [
  ['Build a lab', 'A free 180-day Windows Server 2025 evaluation in Hyper-V, VMware or Proxmox covers every lesson. Start with one DC and one member server.'],
  ['GUI and PowerShell', 'Do each task twice: once in the console, once in PowerShell. Server Core has no GUI.'],
  ['Learn the order of things', 'GPO processing (LSDOU), group nesting (AGDLP) and share-vs-NTFS permissions come up constantly.'],
  ['Then go for AZ-802', 'When you hit 85%+ here, the AZ-802 site adds hybrid, Azure Arc, clustering and migration.'],
];

export default function guide() {
  return {
    eyebrow: 'Course guide',
    title: 'How to use this course',
    intro: 'Windows Server 2025 Essentials has no exam of its own. Work through the five domains in order, then use the self-test to prove mastery.',
    action: { label: 'Windows Server 2025 docs', href: 'https://learn.microsoft.com/en-us/windows-server/' },
    stats: [
      [`${EXAM.minutes} min`, 'Self-test time'],
      [String(EXAM.questions), 'Self-test questions'],
      ['80%', 'Mastery mark'],
      ['5', 'Domains'],
    ],
    rows: [
      [{
        title: 'About this course',
        accent: true,
        blocks: [{ type: 'text', md: 'The everyday administration of Windows Server 2025: installing and managing servers, Active Directory and Group Policy, core network and file services, storage, Hyper-V, security and backup.' }],
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
