// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// Sources (checked 2026-10-30): AZ-900 study guide on Microsoft Learn (skills measured as of July 20, 2026),
// exam scoring page (700 to pass). The learner already holds this certification; this is a review.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Status', 'You have already passed AZ-900. This site is a refresher and a base for AZ-104 / AZ-802.'],
  ['Format', `${EXAM.minutes} minutes, typically ${EXAM.questionsApprox} questions. Microsoft doesn't publish the exact count.`],
  ['Scoring', 'Scaled 1–1000; **700** passes.'],
  ['Validity', 'Fundamentals certifications **do not expire**.'],
  ['Skills outline', 'Skills measured as of **July 20, 2026** (minor changes to compute/networking, management tools and monitoring).'],
];

const STRATEGY = [
  ['Know the "which service" questions', 'Most items name a requirement and ask for the service: Policy vs locks vs RBAC, Advisor vs Service Health vs Monitor, AzCopy vs Storage Explorer vs File Sync.'],
  ['Hierarchy and scope', 'Management groups contain subscriptions, which contain resource groups, which contain resources. Policy and RBAC inherit downward.'],
  ['Redundancy letters', 'LRS, ZRS, GRS, GZRS and the RA- variants come up every time. Know how many copies and where.'],
  ['Shared responsibility', 'Know what moves to Microsoft as you go from on-premises to IaaS, PaaS and SaaS. Data, devices, accounts and identities stay with you.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'AZ-900 at a glance',
    intro: 'A quick refresher on the exam you have passed, kept current with the July 2026 skills outline.',
    action: { label: 'AZ-900 study guide', href: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Typical questions'],
      ['700 / 1000', 'Passing score'],
      ['No expiry', 'Fundamentals'],
    ],
    rows: [
      [{
        title: 'About this review',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** proves foundational knowledge of cloud concepts and Microsoft Azure. Use this site to keep the fundamentals sharp before the associate-level exams.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details on [Microsoft Learn](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/).',
      }, {
        title: 'Skill weights',
        blocks: [{ type: 'domains', columns: ['AZ-900 skill area', 'Weight'] }],
      }],
      [{
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
