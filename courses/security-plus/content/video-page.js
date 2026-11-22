// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the Security+ objectives it supports. SY0-801 is new, so most free videos were recorded for SY0-701; the concepts carry over, but check coverage against the lessons.',
  playlist: null,
  legacy: { label: 'SY0-701', title: 'Recorded for the previous exam version (SY0-701); concepts still apply but the objective numbers differ' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'As of November 22, 2026, free SY0-801 lectures exist only for objective 1.1, so the rest of this list was recorded for SY0-701 or is general, and it is thinnest on the new AI objectives (2.6 beyond prompt injection and LLM risks, and the AI capabilities in 4.6) and on SY0-801 additions such as expression of interest, personnel behavior risk scoring and the Diamond Model, which no video here covers.',
  },
  resources: [
    { name: 'CompTIA Security+ V8 page', url: 'https://www.comptia.org/en-us/certifications/security/v8/', note: 'Exam facts and the official objectives download.' },
    { name: 'NIST Computer Security Resource Center', url: 'https://csrc.nist.gov/', note: 'Glossary and the SP 800 series behind much of the terminology.' },
    { name: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', note: 'The adversary tactics and techniques knowledge base named in objective 5.5.' },
    { name: 'CISA Known Exploited Vulnerabilities catalog', url: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', note: 'Real-world prioritization of CVEs.' },
  ],
};
