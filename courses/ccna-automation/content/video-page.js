// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the CCNA Automation topics it supports. Most were recorded under the exam\'s former name, DevNet Associate (DEVASC 200-901); the topics are the same exam, but Cisco product names have changed (DNA Center is now Catalyst Center).',
  playlist: null,
  legacy: { label: 'DevNet era', title: 'Recorded as DevNet Associate content or with older product names; concepts still apply' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'No good free video was found for these topics: 1.5 (functions, classes and modules), 2.3 (API constraints such as rate limits and pagination), 2.8 (API styles), 3.5 (Cisco security platforms), 4.1 to 4.3 (edge computing and deployment models and types), 4.12 (DevOps principles), 5.7 (reading a Python script that uses Cisco APIs), 5.13 (code review), 5.14 (sequence diagrams) and 6.4, 6.7, 6.8 and 6.9 (topology diagrams, port numbers, connectivity troubleshooting and network constraints). Several Cisco platform videos predate the rename to CCNA Automation: where a video says DNA Center or shows an always-on sandbox, trust the lesson.',
  },
  resources: [
    { name: 'Cisco exam page: 200-901 CCNAAUTO', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/ccnaauto.html', note: 'Exam facts and registration.' },
    { name: 'Official exam topics', url: 'https://learningnetwork.cisco.com/s/ccnaauto-exam-topics', note: 'The v1.1 topic list this course follows.' },
    { name: 'Cisco DevNet', url: 'https://developer.cisco.com/', note: 'API documentation, Learning Labs, Code Exchange and the free Sandbox.' },
    { name: 'Python requests documentation', url: 'https://requests.readthedocs.io/', note: 'The library named in exam topic 2.9.' },
  ],
};
