// Official AZ-900 "Microsoft Azure Fundamentals" skills measured as of July 20, 2026.
// Source: learn.microsoft.com/credentials/certifications/resources/study-guides/az-900 (checked 2026-10-30).
// Microsoft publishes weight ranges; `weight` is roughly the midpoint, rounded so the three add up to 100.
// Topics are the study guide's functional groups; sub-bullets are its objectives (shortened).

export const EXAM = {
  code: 'AZ-900',
  name: 'Exam AZ-900: Microsoft Azure Fundamentals',
  certification: 'Microsoft Certified: Azure Fundamentals',
  product: 'Microsoft Azure',
  minutes: 45,
  questions: 50,
  questionsApprox: '40–60',
  passingScore: 700,
  scoring: 'Scaled 1–1000; 700 or higher passes.',
};

export const DOMAINS = [
  {
    id: 1, weight: 28, weightRange: '25–30%', title: 'Describe cloud concepts', short: 'Cloud concepts',
    topics: [
      { id: '1.1', verb: 'Describe', title: 'cloud computing', sub: ['Define cloud computing', 'Shared responsibility model', 'Public, private and hybrid cloud models and their use cases', 'Consumption-based model and cloud pricing models', 'Serverless'] },
      { id: '1.2', verb: 'Describe', title: 'the benefits of using cloud services', sub: ['High availability and scalability', 'Reliability and predictability', 'Security and governance', 'Manageability'] },
      { id: '1.3', verb: 'Describe', title: 'cloud service types', sub: ['Infrastructure as a service (IaaS)', 'Platform as a service (PaaS)', 'Software as a service (SaaS)', 'Use cases for each service type'] },
    ],
  },
  {
    id: 2, weight: 38, weightRange: '35–40%', title: 'Describe Azure architecture and services', short: 'Architecture & services',
    topics: [
      { id: '2.1', verb: 'Describe', title: 'the core architectural components of Azure', sub: ['Regions, region pairs and sovereign regions', 'Availability zones and datacenters', 'Resources and resource groups', 'Subscriptions and management groups', 'The management group > subscription > resource group > resource hierarchy'] },
      { id: '2.2', verb: 'Describe', title: 'Azure compute and networking services', keepCase: true, sub: ['Compute types: containers, virtual machines, functions', 'VMs, Virtual Machine Scale Sets, availability sets, Azure Virtual Desktop', 'Resources required for VMs', 'Application hosting: web apps, containers, VMs', 'Virtual networks, subnets, peering, Azure DNS, VPN Gateway, ExpressRoute', 'Public and private endpoints'] },
      { id: '2.3', verb: 'Describe', title: 'Azure storage services', keepCase: true, sub: ['Azure Storage services compared', 'Storage (access) tiers', 'Redundancy options', 'Storage account options and storage types', 'Moving files: AzCopy, Azure Storage Explorer, Azure File Sync', 'Migration: Azure Migrate and Azure Data Box'] },
      { id: '2.4', verb: 'Describe', title: 'Azure identity, access and security', keepCase: true, sub: ['Microsoft Entra ID and Microsoft Entra Domain Services', 'SSO, MFA and passwordless authentication', 'External identities', 'Conditional Access', 'Azure role-based access control (RBAC)', 'Zero Trust and defense in depth', 'Microsoft Defender for Cloud'] },
    ],
  },
  {
    id: 3, weight: 34, weightRange: '30–35%', title: 'Describe Azure management and governance', short: 'Management & governance',
    topics: [
      { id: '3.1', verb: 'Describe', title: 'cost management in Azure', sub: ['Factors that affect cost', 'The pricing calculator', 'Cost Management capabilities', 'Tags'] },
      { id: '3.2', verb: 'Describe', title: 'governance and compliance features and tools', sub: ['Microsoft Purview', 'Azure Policy', 'Resource locks'] },
      { id: '3.3', verb: 'Describe', title: 'tools for managing and deploying Azure resources', sub: ['Azure portal', 'Azure Cloud Shell, Azure CLI and Azure PowerShell', 'Azure Arc', 'Infrastructure as code', 'Azure Resource Manager and ARM templates'] },
      { id: '3.4', verb: 'Describe', title: 'monitoring tools in Azure', sub: ['Azure Advisor', 'Azure Service Health', 'Azure Monitor: Log Analytics, alerts, Application Insights'] },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

export function topicLabel(t) {
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}
