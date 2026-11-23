// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// Sources (checked 2026-11-22): Cisco exam page for 200-901 CCNAAUTO and the v1.1 exam topics PDF.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Exam', `**${EXAM.code} CCNAAUTO**, Automating Networks Using Cisco Platforms **v1.1**.`],
  ['Formerly', 'This was the **DevNet Associate (DEVASC)** exam. Cisco renamed the certification **CCNA Automation** on February 3, 2026; older study material uses the DevNet name and still applies where the topics match.'],
  ['Format', `${EXAM.minutes} minutes. Cisco does not publish the number of questions or the passing score.`],
  ['Cost', 'US$300 (or Cisco Learning Credits), as listed on Cisco\'s exam page when this was written.'],
  ['Languages', 'English and Japanese.'],
  ['Validity', 'Three years.'],
];

const STRATEGY = [
  ['Read the exhibit first', 'Most questions hang on a snippet: a JSON body, a Python script, a Dockerfile, a YANG tree, a unified diff. Work out what it does before reading the options.'],
  ['Know the status codes cold', '200, 201, 204, 400, 401, 403, 404, 405, 409, 429, 500 and 503 come up constantly, along with which ones are the client\'s fault.'],
  ['Platforms are breadth, not depth', 'For each Cisco platform know what it manages, what its API style and authentication look like, and one typical call. You do not need to memorise endpoints.'],
  ['No going back', 'Cisco exams do not let you return to a question after you move on. Decide, answer and keep to about a minute a question.'],
];

// Everything in this course can be practised from any computer with Python and a browser.
const LAB = [
  ['Any computer', 'You need **Python 3**, **Git**, a text editor and a terminal: built in on Linux and macOS (install Python with `xcode-select --install` or from python.org), and on Windows use **WSL 2** or install Python and Git for Windows.'],
  ['Cisco DevNet Sandbox', 'Free, with a Cisco account: reservable labs for IOS XE, Catalyst Center, Meraki, ACI, SD-WAN and more, so you can call real APIs without owning the gear. Check the catalog for what is offered now; a reservation gives you the credentials.'],
  ['Ansible and pyATS on Windows', 'Neither runs natively on Windows: the Ansible control node and pyATS both need Linux or macOS. On Windows, install **WSL 2** and run them inside it. Everything else in this course works from any of the three.'],
  ['API client', 'A graphical client such as **Postman**, or just `curl`, for building requests before you script them.'],
  ['Containers', '**Docker Desktop** on Windows and macOS (Apple silicon and Intel) or Docker Engine or Podman on Linux, for the Dockerfile and image labs.'],
  ['Device simulation', '**Cisco Modeling Labs** (there is a free tier) if you want your own IOS XE nodes for NETCONF and RESTCONF; the DevNet sandboxes cover the same ground.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'CCNA Automation 200-901 at a glance',
    intro: 'What the exam covers, how it is delivered and how to prepare.',
    action: { label: 'Cisco exam page', href: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccnaauto.html' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      ['6', 'Domains'],
      ['Unpublished', 'Passing score'],
      ['3 years', 'Validity'],
    ],
    rows: [
      [{
        title: 'About the certification',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** certifies that you can use APIs and code to automate networks on Cisco platforms: software development basics, REST APIs, Cisco platform APIs, application deployment and security, infrastructure automation, and network fundamentals.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details on [Cisco\'s exam page](https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccnaauto.html) and read the official [exam topics](https://learningnetwork.cisco.com/s/ccnaauto-exam-topics) before you book.',
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['200-901 domain', 'Weight'] }],
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
