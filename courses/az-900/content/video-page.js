// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the AZ-900 topics it supports. Azure renames services often (Azure AD is now Microsoft Entra ID), so check names against the lessons.',
  playlist: null,
  legacy: { label: 'Older', title: 'Recorded before recent renames or outline changes (e.g. uses "Azure AD"); concepts still apply' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'Free videos cover Microsoft Purview, Azure Arc, the Azure Migrate business case (the TCO calculator replacement), Microsoft Defender for Cloud, sovereign regions and the newest Cloud Shell and Advisor features only thinly or with older screens, so rely on the lessons for those.',
  },
  resources: [
    { name: 'AZ-900 study guide', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900', note: 'The official skills measured.' },
    { name: 'AZ-900 free practice assessment', url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/practice/assessment?assessment-type=practice&assessmentId=23', note: 'Microsoft\'s own practice questions.' },
    { name: 'Azure Fundamentals learning path', url: 'https://learn.microsoft.com/en-us/training/courses/az-900t00', note: 'Free self-paced training on Microsoft Learn.' },
    { name: 'Azure documentation', url: 'https://learn.microsoft.com/en-us/azure/', note: 'Service docs.' },
  ],
};
