// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the Linux+ objectives it supports. Most are general Linux administration videos rather than XK0-006 courses, so check coverage against the lessons.',
  playlist: null,
  legacy: { label: 'Older', title: 'Recorded for an earlier Linux+ version or an older distribution release; concepts still apply' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'No focused free video was found for 1.2 (device management and initrd), 1.5 (shell operations), 1.6 (backup and restore), 3.4 (account hardening) or 3.6 (compliance and audit), and the troubleshooting videos only partly cover 5.3 (MTU, bonding, dual stack) and 5.4 (certificates, cipher negotiation, repositories), so use the lessons for those.',
  },
  resources: [
    { name: 'CompTIA Linux+ page', url: 'https://www.comptia.org/en-us/certifications/linux/', note: 'Exam facts and the official objectives download.' },
    { name: 'Linux man pages online', url: 'https://man7.org/linux/man-pages/', note: 'The reference for every command and file format.' },
    { name: 'Red Hat Enterprise Linux documentation', url: 'https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/', note: 'RPM-family administration guides.' },
    { name: 'Ubuntu Server documentation', url: 'https://documentation.ubuntu.com/server/', note: 'Debian-family administration guides.' },
  ],
};
