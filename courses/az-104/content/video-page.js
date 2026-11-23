// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the AZ-104 topics it supports. Azure changes often: where a video shows an older portal layout or says Azure Active Directory (now Microsoft Entra ID), trust the lesson.',
  playlist: null,
  legacy: { label: 'Older', title: 'Recorded with older names (Azure AD) or an older portal layout; concepts still apply' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on some topics, so lean on the lessons and questions here:',
    note: 'Every topic has at least one video, but several objectives have no good, current free video: configuring Azure Container Registry and container scaling (3.3), App Service certificates and TLS, custom domains and backup (3.4), exporting a deployment or converting ARM to Bicep (3.1, and the only Bicep video predates the Entra rename), moving VMs between resource groups, subscriptions and regions (3.2), Azure Storage Explorer and AzCopy, object replication and storage encryption options (2.2), external users (1.1, covered only inside the long Identity master class), Connection monitor and virtual network flow logs (5.1; NSG flow logs, which older material shows, retire on September 30, 2027), Log Analytics table plans and retention (5.1), and Backup reports and the built-in Azure Monitor alerts for Backup (5.2). Older videos may show Azure Disk Encryption, the Log Analytics agent, Backup center or the VM insights Map feature; all are retired, retiring or renamed, so trust the lessons. The Microsoft Learn "AZ-104 | Episode" series and John Savill\'s Azure Master Class v3 (2025) are the most current; videos marked Older still teach the concepts.',
  },
  resources: [
    { name: 'Microsoft exam page: AZ-104', url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/', note: 'Exam facts, registration and the free practice assessment.' },
    { name: 'Official study guide', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104', note: 'The skills outline this course follows.' },
    { name: 'Exam sandbox', url: 'https://aka.ms/examdemo', note: 'Try the exam interface and question types before test day.' },
    { name: 'Azure documentation', url: 'https://learn.microsoft.com/en-us/azure/', note: 'The primary source for every service in the course.' },
  ],
};
