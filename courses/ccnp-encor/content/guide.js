// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// Sources (checked 2026-11-22): Cisco exam page for 350-401 ENCOR and the v1.2 exam topics PDF.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Exam', `**${EXAM.code} ENCOR**, Implementing Cisco Enterprise Network Core Technologies **v1.2**.`],
  ['What changed in v1.2', 'There is **no wireless section**, the SD-WAN product is named **Catalyst SD-WAN**, DNA Center is **Catalyst Center** and the last domain is **Automation and Artificial Intelligence**. Study material written for v1.0 or v1.1 covers wireless topics that are no longer listed.'],
  ['Format', `${EXAM.minutes} minutes. Cisco does not publish the number of questions or the passing score.`],
  ['Cost', 'US$400 (or Cisco Learning Credits), as listed on Cisco\'s exam page when this was written.'],
  ['Languages', 'English and Japanese.'],
  ['What it earns', 'ENCOR plus one concentration exam (such as ENARSI) earns **CCNP Enterprise**. ENCOR alone earns the Cisco Certified Specialist – Enterprise Core and qualifies you for the CCIE Enterprise Infrastructure lab.'],
];

const STRATEGY = [
  ['Infrastructure is 30%', 'Layer 2, Layer 3 and IP services are nearly a third of the exam, and they are "configure", "verify" and "troubleshoot" topics. Spend your lab time here.'],
  ['Read the verb', 'Cisco\'s verbs set the depth: *describe* and *explain* are concepts, *interpret* means reading a configuration or output, *configure and verify* means you can type it and prove it works.'],
  ['Expect lab simulations', 'Hands-on items need the exact commands and the show commands that verify them. Practise typing them, not just recognising them.'],
  ['No going back', 'Cisco exams do not let you return to a question after you move on. Budget your time and commit to each answer.'],
];

// This site has no built-in simulator for this course, so you need a lab. All of these run on any host.
const LAB = [
  ['Cisco Modeling Labs', 'Cisco\'s own virtual lab with real IOS XE, IOSv and switching images. **CML-Free** runs a small topology at no cost; CML-Personal is paid. It runs as a VM on Windows, macOS (Intel and Apple silicon) and Linux hosts.'],
  ['Other emulators', '**GNS3** and **EVE-NG** run on any host too, but you must supply your own licensed Cisco images.'],
  ['Cisco DevNet Sandbox', 'Free reservable labs with IOS XE, Catalyst Center and Catalyst SD-WAN: the practical way to touch SD-WAN, SD-Access and the controller APIs without owning them.'],
  ['Real hardware', 'A couple of Catalyst switches and ISR routers cover Layer 2, Layer 3 and IP services well, but check that the IOS XE release supports what a lab needs.'],
  ['Automation tools', 'Python 3, a terminal with SSH, and an API client or curl for the NETCONF, RESTCONF and Catalyst Center topics, from any operating system.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'CCNP ENCOR 350-401 at a glance',
    intro: 'What the exam covers, how it is delivered and how to prepare.',
    action: { label: 'Cisco exam page', href: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/encor.html' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      ['6', 'Domains'],
      ['Unpublished', 'Passing score'],
      ['v1.2', 'Exam version'],
    ],
    rows: [
      [{
        title: 'About the certification',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** tests core enterprise networking: dual-stack architecture, virtualization, infrastructure, network assurance, security and automation.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details on [Cisco\'s exam page](https://www.cisco.com/site/us/en/learn/training-certifications/exams/encor.html) and read the official [exam topics](https://learningnetwork.cisco.com/s/encor-exam-topics) before you book.',
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['350-401 domain', 'Weight'] }],
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
