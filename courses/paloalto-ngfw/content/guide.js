// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js.
// Sources (checked 2026-10-30): NGFW Engineer certification page and datasheet (Nov 2025),
// Palo Alto Networks Certification Handbook and Certification FAQ (Sept 2026). Strings are inline markdown.
import { EXAM } from './blueprint.js';

const PATH = [
  ['Network Security Professional', 'Professional level (US$200). Recommended before NGFW Engineer, not required.'],
  ['Network Security Analyst', 'Specialist level. Also recommended, not required.'],
  ['NGFW Engineer', 'Specialist level (this course). Replaced the PCNSE, which retired in 2025.'],
  ['Network Security Architect', 'Architect level (US$300), the next step on the network security track.'],
];

const POLICIES = [
  ['Scoring', 'Scaled score from 300 to 1000; **860** passes on every Palo Alto exam. Some questions are unscored pretest items.'],
  ['Retakes', 'Wait **15 days** after the 1st fail, **30 days** after the 2nd and **90 days** after the 3rd and later.'],
  ['After passing', 'You can\'t take the same exam again for **18 months** (545 days).'],
  ['Validity', 'Valid for **2 years**; recertify by retaking the exam. A higher-level certification on the same track renews lower ones.'],
  ['Delivery', 'Scheduled through Pearson VUE. English only; a 30-minute extension applies in non-English-speaking countries.'],
  ['Fees', `${EXAM.price}.`],
];

const STRATEGY = [
  ['Think like the packet', 'Know the PAN-OS flow: zone and interface lookup, route lookup, NAT policy (pre-NAT zones, post-NAT destination), security policy, then App-ID and content inspection.'],
  ['Know which object lives where', 'Interfaces, zones and routers belong to templates; policies and objects belong to device groups. Many Panorama questions turn on this split and on pre- vs post-rules.'],
  ['HA by the numbers', 'Know HA1, HA2 and HA3 links, election by device priority and preemption, and what link and path monitoring do in active/passive vs active/active.'],
  ['Certificates have roles', 'Forward Trust, Forward Untrust, SSL/TLS service profiles and certificate profiles each do one job. Read which certificate is presented to whom.'],
  ['Read every multi-select carefully', 'The simulator gives no credit for a partly right answer, so choose the exact set.'],
  ['Lab it', 'A VM-Series lab licence or an eval in a cloud marketplace covers most of the blueprint; Panorama questions are easier after you push one template and one device group yourself.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Everything about the NGFW Engineer exam',
    intro: 'Format, where it sits among Palo Alto certifications, the program policies, and how to approach the exam.',
    action: { label: 'Schedule with Pearson VUE', href: 'https://home.pearsonvue.com/paloaltonetworks' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      ['~75', 'Questions (reported)'],
      ['860 / 1000', 'Passing scaled score'],
      [`${EXAM.validityYears} years`, 'Certification validity'],
    ],
    rows: [
      [{
        title: 'About this exam',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** validates configuring PAN-OS networking and device settings, integration and automation, and managing NGFWs with Panorama. The blueprint comes from the [official datasheet](https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/datasheets/education/ngfw-engineer-datasheet.pdf) (November 2025). Palo Alto doesn't publish the question count; about 75 in 90 minutes is widely reported.` }],
      }],
      [{
        title: 'Where it fits',
        blocks: [{ type: 'list', items: PATH }],
      }, {
        title: 'Palo Alto exam policies',
        blocks: [{ type: 'list', items: POLICIES }],
        note: 'Policies change. Confirm in the [Certification Handbook](https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/ebooks/panw-certification-handbook.pdf) before booking.',
      }],
      [{
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['NGFW Engineer', '%'] }],
      }, {
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
