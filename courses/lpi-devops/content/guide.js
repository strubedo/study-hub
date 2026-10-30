// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-30): lpi.org exam 701 objectives (v2.0.0), DevOps Tools Engineer overview
// (90 minutes, 60 questions, 5-year validity), lpi.org exam pricing (US$200). Strings are inline markdown.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Prerequisites', 'None. LPI recommends holding an active LPIC-1-level (or developer) certification.'],
  ['Format', `${EXAM.questions} multiple-choice and fill-in-the-blank questions in ${EXAM.minutes} minutes.`],
  ['Scoring', 'Scaled score 200–800; **500** passes.'],
  ['Validity', `**${EXAM.validityYears} years**.`],
  ['Delivery', 'Pearson VUE test centers or LPI online testing.'],
  ['Fees', `${EXAM.price}.`],
];

const CHANGES = [
  ['Removed in v2.0', 'Ansible and other configuration management, Vagrant and Packer-style machine deployment are gone. Don\'t study them for this exam.'],
  ['Added or expanded', 'Podman alongside Docker, Kubernetes operations and Helm, GitOps with Flux and Argo CD, cloud native security, PromQL, OpenTelemetry tracing.'],
];

const STRATEGY = [
  ['Weights are question counts', 'Objective weights sum to 60, the number of questions. Kubernetes operations (7), Git (6), modern development (6) and Prometheus (6) carry the most.'],
  ['Fill-in-the-blank is exact', 'Expect to type a command, sub-command, option or file name. Practise the exact spelling: `docker compose up -d`, `kubectl rollout undo`, `helm upgrade --install`, `git rebase`.'],
  ['Know the term lists', 'Every objective ends with a list of files, terms and utilities. Each one is fair game.'],
  ['Lab it', 'A Linux VM with Docker or Podman, kind or minikube, Helm and a Prometheus container covers most of the hands-on objectives.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the 701-200 exam',
    intro: 'Format, what changed in version 2.0, LPI policies, and how to approach the exam.',
    action: { label: 'LPI exam objectives', href: 'https://www.lpi.org/our-certifications/exam-701-objectives/' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [String(EXAM.questions), 'Questions'],
      ['500 / 800', 'Passing scaled score'],
      [`${EXAM.validityYears} years`, 'Certification validity'],
    ],
    rows: [
      [{
        title: 'About this exam',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** is the single exam for the LPI DevOps Tools Engineer certification. It tests vendor-neutral, open source DevOps tooling from both the developer and the operator side.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details on [lpi.org](https://www.lpi.org/our-certifications/devops-overview/) before booking.',
      }, {
        title: 'Version 2.0 changes',
        blocks: [{ type: 'list', items: CHANGES }],
      }],
      [{
        title: 'Topic weights',
        blocks: [{ type: 'domains', columns: ['701-200 topic', 'Weight'] }],
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
