// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// Sources (checked 2026-11-23): Microsoft Learn exam page and study guide for AZ-104.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Exam', `**${EXAM.code}**, Microsoft Azure Administrator. It earns **${EXAM.certification}**.`],
  ['Skills outline', 'This course follows the skills measured as of **October 26, 2023**, which Microsoft\'s study guide listed as current when this was written. Check the study guide for a newer outline before you book.'],
  ['Format', `${EXAM.minutes} minutes, proctored, typically ${EXAM.questionsApprox} items. Microsoft says the exam may include interactive components.`],
  ['Passing score', `${EXAM.passingScore} on a scale of 1 to 1000.`],
  ['Renewal', 'Associate certifications expire after one year. You renew by passing a free online assessment on Microsoft Learn.'],
  ['Expected background', 'Microsoft expects experience with the Azure portal, Azure PowerShell, the Azure CLI, Azure Resource Manager templates and Microsoft Entra ID, and familiarity with operating systems, networking, servers and virtualization.'],
];

const STRATEGY = [
  ['Three ways to do everything', 'Questions show the portal, Azure PowerShell and the Azure CLI. Learn each task in all three, and learn to read ARM template JSON and Bicep.'],
  ['Read the requirement twice', 'Most items are "meets the goal" scenarios with a constraint such as least privilege, lowest cost or least administrative effort. The constraint picks the answer.'],
  ['Some sections lock', 'Case studies and yes/no statement series cannot be revisited after you leave them. Answer them fully before moving on.'],
  ['Practise in a real subscription', 'Reading is not enough for an administrator exam. Build each lab, break it, and delete the resource group afterwards.'],
];

// Everything in this course can be practised from any computer with a browser.
const LAB = [
  ['Any computer', 'The **Azure portal** and **Azure Cloud Shell** (Bash or PowerShell, with the Azure CLI, Azure PowerShell and Bicep already installed) run in a browser on Windows, macOS (Apple silicon and Intel) and Linux.'],
  ['Azure free account', 'A free account includes a starting credit and a set of always-free services. Most labs here fit inside it if you delete resources when you finish.'],
  ['Microsoft Learn sandboxes', 'Many Microsoft Learn modules open a temporary sandbox subscription at no cost. Use them for labs you would rather not run in your own subscription.'],
  ['Local tools (optional)', 'The **Azure CLI** and **Azure PowerShell** (on PowerShell 7) install on Windows, macOS and Linux. **Azure Storage Explorer** and **AzCopy** also run on all three.'],
  ['Keep costs down', 'Put every lab in its own resource group, choose the smallest sizes, set a budget with an alert on the subscription, and delete the resource group as the last step of each lab.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'AZ-104 at a glance',
    intro: 'What the exam covers, how it is delivered and how to prepare.',
    action: { label: 'Microsoft exam page', href: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      ['5', 'Skill areas'],
      [`${EXAM.passingScore}`, 'Passing score'],
      ['1 year', 'Valid for'],
    ],
    rows: [
      [{
        title: 'About the certification',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** tests whether you can implement, manage and monitor an organization's Azure environment: identity and governance, storage, compute, virtual networking, and monitoring and backup.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details on [Microsoft\'s exam page](https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/), read the official [study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104), take the free practice assessment linked from the exam page, and try the [exam sandbox](https://aka.ms/examdemo) before you book.',
      }, {
        title: 'Skill area weights',
        blocks: [{ type: 'domains', columns: ['AZ-104 skill area', 'Weight'] }],
      }],
      [{
        title: 'Build a lab on any computer',
        blocks: [{ type: 'list', items: LAB }],
      }],
      [{
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
