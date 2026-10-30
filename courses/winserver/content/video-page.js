// Copy and links for the Video Course page (course.js `videos.page`).
import { PLAYLIST_URL, PLAYLIST_URL_801 } from './videos.js';

export default {
  intro: 'Microsoft Learn\'s official AZ-800 and AZ-801 course videos, each tagged with the AZ-802 topics it supports.',
  playlist: { url: PLAYLIST_URL, label: 'Open AZ-800 playlist on YouTube' },
  legacy: { label: 'Not on AZ-802', title: 'Covered in AZ-800/801, not listed in the AZ-802 outline' },
  gaps: {
    title: 'Coverage gaps vs AZ-802',
    intro: 'No AZ-802 video series exists yet, and these videos were recorded for the retired exams. These AZ-802 topics have little or no video coverage, so lean on the lessons and questions here:',
    note: 'Also new or expanded in AZ-802: Kerberos and secure-channel troubleshooting (7.3), NTFS vs ReFS (5.3), OSConfig baselines and Defender for Servers (6.1), GPU partitioning and SSH Direct (3.1). Partial coverage only.',
  },
  resources: [
    { name: 'AZ-802 study guide (official skills outline)', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-802', note: 'The authoritative outline this site is built on.' },
    { name: 'Microsoft Learn — AZ-800 course videos', url: PLAYLIST_URL, note: 'Official, free. Recorded for AZ-800; mapped here to AZ-802 topics.' },
    { name: 'Microsoft Learn — AZ-801 course videos', url: PLAYLIST_URL_801, note: 'Official, free. Security and monitoring episodes still apply; DR and migration episodes are off the outline.' },
    { name: 'AZ-802T00 course and learning paths', url: 'https://learn.microsoft.com/en-us/training/courses/az-802t00', note: 'Free self-paced Microsoft Learn modules, many with sandbox exercises.' },
    { name: 'Windows Server 2025 evaluation', url: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025', note: 'Free 180-day evaluation for your home lab.' },
    { name: 'Exam sandbox', url: 'https://aka.ms/examdemo', note: 'Try every Microsoft question type before test day.' },
  ],
};
