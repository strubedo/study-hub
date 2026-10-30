// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js:
// exam facts, Microsoft policies, AZ-800/801 → AZ-802 changes, and test-taking strategy.
// Sources (checked 2026-10-29): AZ-802 exam page and study guide, final AZ-800/AZ-801 study
// guides, Microsoft retake policy, exam duration & experience page. Strings are inline markdown.
import { EXAM } from './blueprint.js';

const OLD_WEIGHTS = [
  ['AZ-800 · AD DS on-premises and in the cloud', '30–35'], ['AZ-800 · Hybrid management', '10–15'], ['AZ-800 · VMs and containers', '15–20'],
  ['AZ-800 · On-premises and hybrid networking', '15–20'], ['AZ-800 · Storage and file services', '15–20'],
  ['AZ-801 · Security', '25–30'], ['AZ-801 · High availability', '15–20'], ['AZ-801 · Disaster recovery', '10–15'],
  ['AZ-801 · Migration', '20–25'], ['AZ-801 · Monitor and troubleshoot', '15–20'],
];

const ADDED = [
  ['7.3', 'Troubleshoot **Kerberos and authentication**, and **secure channel / computer account trust** issues'],
  ['5.1', '**Migrate from file shares to Azure Files**, alongside migrating DFS to Azure File Sync'],
  ['5.3', 'Select and configure file systems: **NTFS vs ReFS**'],
  ['6.1', '**Defender for Servers** and **Windows Firewall incl. connection security rules** under OS security; **OSConfig** security baselines'],
  ['1.1', 'Manage **account security on an RODC** (Password Replication Policy)'],
  ['1.4', '**Group Policy preferences**'],
  ['3.1', '**GPU partitioning**, device assignment and **SSH Direct** for Linux guests'],
];

const REMOVED = [
  'Hybrid identity: Microsoft Entra Connect Sync, Cloud Sync, Connect Health, Entra Domain Services, staged rollout',
  'Windows containers and AKS on Windows Server; guarded fabric / shielded VMs; CPU groups and hypervisor schedulers',
  'IPAM, Remote Access role, NPS, Web Application Proxy, site-to-site VPN, Azure Network Adapter, Azure extended network, Azure Relay, Entra Private Access',
  'BranchCache',
  'Failover clustering as its own domain (quorum, stretch clusters, Cluster-Aware Updating, Scale-Out File Server, Network ATC)',
  'Disaster recovery: Azure Backup, MABS, Azure Site Recovery (only Hyper-V Replica remains)',
  'Migration: Storage Migration Service, Azure Migrate, IIS migration, ADMT forest migration',
  'Microsoft Sentinel, Defender for Identity, authentication policy silos, domain isolation, NSGs, Azure Disk Encryption key management',
];

const POLICIES = [
  ['Retake after a fail', 'Wait **24 hours** after the first failed attempt, then **14 days** between every later attempt.'],
  ['Attempt limit', 'At most **5 attempts in 12 months** from your first attempt. Every retake is paid.'],
  ['After a pass', 'You can\'t retake a passed exam unless the certification has expired.'],
  ['Renewal', 'Associate certifications expire **every year**. Renew **free** with an online renewal assessment on Microsoft Learn in the 6 months before expiry (unlimited retries; 24 h wait after the second).'],
  ['Account', 'Register with a **personal Microsoft account**. Records tied to a work/school account are lost if you leave that organisation.'],
  ['Delivery', 'Pearson VUE test center or online proctored. English only; if English isn\'t your first language you can request 30 extra minutes.'],
];

const STRATEGY = [
  ['Read the constraint', 'Scenario questions turn on one phrase: *minimise administrative effort*, *minimise cost*, *without downtime*, *must support Linux guests*. Find it before you read the options.'],
  ['Open book, closed clock', 'You can open Microsoft Learn (learn.microsoft.com only) during the exam, but the timer keeps running. Use it to confirm a cmdlet parameter, not to learn a topic.'],
  ['Case studies and labs are one-way', 'Once you leave a case study or a lab section you may not be able to return. Read every task first and finish what you\'re sure of.'],
  ['Think in PowerShell', 'Expect "Which cmdlet should you run?" and hot-area items that complete a command. Know the verbs and key parameters of the ActiveDirectory, DnsServer, DhcpServer, Hyper-V, Storage and SmbShare modules.'],
  ['Never leave a blank', 'There is no penalty for guessing. Mark uncertain items for review and come back if the section allows it.'],
  ['Build a lab', 'Windows Server 2025 180-day evaluation on Hyper-V (2 DCs, a member server, a client) plus a free Azure account for Arc, Update Manager, Azure Files and Azure Monitor. Delete resource groups when you finish.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the AZ-802 exam',
    intro: 'Format, Microsoft policies, what changed from AZ-800/801, and how to approach the exam.',
    action: { label: 'AZ-802 exam page', href: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Items (typical; Microsoft doesn\'t publish a count)'],
      [`${EXAM.passingScore} / 1000`, 'Passing score (scaled, not a percentage)'],
      ['1 year', 'Validity · free online renewal'],
    ],
    rows: [
      [{
        title: 'One exam now',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.code}: ${EXAM.name}** is the only exam for **${EXAM.certification}**. It replaced AZ-800 and AZ-801, which retired on **2026-09-30 at 5:00 PM CST**. Material built for AZ-800/801 (including the videos on this site) still covers most of AZ-802 — the lists below show what to skip and what to add.` }],
      }],
      [{
        title: 'Weights: AZ-800 + AZ-801 → AZ-802',
        blocks: [
          { type: 'table', columns: ['Retired exams', '%'], rows: OLD_WEIGHTS },
          { type: 'domains', columns: ['AZ-802 (7 domains)', '%'] },
        ],
      }, {
        title: 'Microsoft exam policies',
        blocks: [{ type: 'list', items: POLICIES }],
        note: 'Policies change. Confirm on [Microsoft\'s retake policy page](https://learn.microsoft.com/en-us/credentials/support/retake-policy) before booking.',
      }],
      [{
        title: 'New or more emphasised in AZ-802',
        blocks: [{ type: 'badges', kind: 'ok', align: true, items: ADDED }],
      }, {
        title: 'Dropped from AZ-800/801',
        intro: 'Useful background, but no longer on the outline. Expect them only as wrong answers.',
        blocks: [{ type: 'badges', kind: 'warn', items: REMOVED.map((r) => ['Removed', r]) }],
        note: 'Compiled by comparing Microsoft\'s final AZ-800 and AZ-801 study guides with the AZ-802 study guide.',
      }],
      [{
        title: 'Question types and test-taking strategy',
        intro: 'Microsoft role-based exams can include multiple choice, multiple select, drag and drop / build list, hot area, active screen, case studies and interactive labs. Try them all in the [exam sandbox](https://aka.ms/examdemo).',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
