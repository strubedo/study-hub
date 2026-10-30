// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the course topics it supports. Older Windows Server versions look much the same; check 2025 changes against the lessons.',
  playlist: null,
  legacy: { label: 'Older version', title: 'Recorded on Windows Server 2019 or 2022; the steps mostly match 2025' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'Free videos cover Windows Server 2025 gaps thinly in OSConfig security baselines, Protected Users, Windows LAPS automatic account management and passphrases, SMB signing and NTLM changes, Storage Spaces and Data Deduplication, iSCSI, Volume Shadow Copies, Azure Backup and Site Recovery, and Performance Monitor data collector sets.',
  },
  resources: [
    { name: 'Windows Server documentation', url: 'https://learn.microsoft.com/en-us/windows-server/', note: 'Official docs for every role and feature.' },
    { name: 'What\'s new in Windows Server 2025', url: 'https://learn.microsoft.com/en-us/windows-server/get-started/whats-new-windows-server-2025', note: 'Features added in this release.' },
    { name: 'Windows Server 2025 evaluation', url: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2025', note: 'Free 180-day evaluation for your lab.' },
    { name: 'Windows Admin Center', url: 'https://learn.microsoft.com/en-us/windows-server/manage/windows-admin-center/overview', note: 'Browser-based server management.' },
  ],
};
