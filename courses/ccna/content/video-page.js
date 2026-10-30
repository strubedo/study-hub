// Copy and links for the Video Course page (course.js `videos.page`).
// The video list itself is generated into videos.js by scripts/build-videos.mjs.
import { PLAYLIST_URL } from './videos.js';

export default {
  intro: 'Every video is tagged with the v2.0 topics it supports.',
  playlist: { url: PLAYLIST_URL, label: 'Open playlist on YouTube' },
  legacy: { label: 'Not on v2.0', title: 'Covered in v1.1, not listed in the v2.0 blueprint' },
  gaps: {
    title: 'Coverage gaps vs v2.0',
    intro: 'This course was recorded for v1.1. These v2.0 topics have little or no video coverage, so lean on the lessons and questions here:',
    note: 'Also new or expanded in v2.0: storm control and RA guard (4.7), VRRP (3.4), SFTP/SCP (4.2), AAA with TACACS+/RADIUS (4.1). Partial coverage only.',
  },
  resources: [
    { name: 'Cisco CCNA v2.0 exam topics (official PDF)', url: 'https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301_CCNA_v2.0_Exam_Topics_PDF.pdf', note: 'The authoritative blueprint this site is built on.' },
    { name: "Jeremy's IT Lab — full course playlist", url: PLAYLIST_URL, note: 'Free lectures + Packet Tracer labs. Built for v1.1; mapped here to v2.0 topics.' },
    { name: 'Cisco Packet Tracer (via Cisco Networking Academy)', url: 'https://www.netacad.com/resources/lab-downloads', note: 'Free simulator. Rebuild the CLI labs here on a fuller IOS feature set.' },
    { name: 'Cisco Learning Network — CCNA community', url: 'https://learningnetwork.cisco.com/s/ccna', note: 'Official study groups, exam-change announcements.' },
    { name: 'Pearson VUE — schedule the exam', url: 'https://home.pearsonvue.com/cisco', note: 'Test center or online-proctored delivery.' },
  ],
};
