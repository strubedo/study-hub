// Official AZ-104 "Microsoft Azure Administrator" skills measured as of October 26, 2023.
// Source: learn.microsoft.com/credentials/certifications/resources/study-guides/az-104 (checked 2026-11-23;
// the page, last updated 2026-11-05, lists this as the current skills outline) and the AZ-104 exam page.
// Microsoft publishes weight ranges; `weight` is a point inside each range, chosen so the five add up to 100.
// Topics are the study guide's functional groups; `sub` entries are its objectives, word for word.

export const EXAM = {
  code: 'AZ-104',
  name: 'Exam AZ-104: Microsoft Azure Administrator',
  certification: 'Microsoft Certified: Azure Administrator Associate',
  product: 'Microsoft Azure',
  minutes: 100,
  questions: 50,
  questionsApprox: '40–60',
  passingScore: 700,
  scoring: 'Scaled 1–1000; 700 or higher passes.',
};

export const DOMAINS = [
  {
    id: 1, weight: 24, weightRange: '20–25%', title: 'Manage Azure identities and governance', short: 'Identities & governance',
    topics: [
      { id: '1.1', verb: 'Manage', title: 'Microsoft Entra users and groups', keepCase: true, sub: ['Create users and groups', 'Manage user and group properties', 'Manage licenses in Microsoft Entra ID', 'Manage external users', 'Configure self-service password reset (SSPR)'] },
      { id: '1.2', verb: 'Manage', title: 'access to Azure resources', keepCase: true, sub: ['Manage built-in Azure roles', 'Assign roles at different scopes', 'Interpret access assignments'] },
      { id: '1.3', verb: 'Manage', title: 'Azure subscriptions and governance', keepCase: true, sub: ['Implement and manage Azure Policy', 'Configure resource locks', 'Apply and manage tags on resources', 'Manage resource groups', 'Manage subscriptions', 'Manage costs by using alerts, budgets, and Azure Advisor recommendations', 'Configure management groups'] },
    ],
  },
  {
    id: 2, weight: 19, weightRange: '15–20%', title: 'Implement and manage storage', short: 'Storage',
    topics: [
      { id: '2.1', verb: 'Configure', title: 'access to storage', sub: ['Configure Azure Storage firewalls and virtual networks', 'Create and use shared access signature (SAS) tokens', 'Configure stored access policies', 'Manage access keys', 'Configure identity-based access for Azure Files'] },
      { id: '2.2', verb: 'Configure', title: 'and manage storage accounts', sub: ['Create and configure storage accounts', 'Configure Azure Storage redundancy', 'Configure object replication', 'Configure storage account encryption', 'Manage data by using Azure Storage Explorer and AzCopy'] },
      { id: '2.3', verb: 'Configure', title: 'Azure Files and Azure Blob Storage', keepCase: true, sub: ['Create and configure a file share in Azure Storage', 'Create and configure a container in Blob Storage', 'Configure storage tiers', 'Configure snapshots and soft delete for Azure Files', 'Configure blob lifecycle management', 'Configure blob versioning'] },
    ],
  },
  {
    id: 3, weight: 24, weightRange: '20–25%', title: 'Deploy and manage Azure compute resources', short: 'Compute',
    topics: [
      { id: '3.1', verb: 'Automate', title: 'deployment of resources by using Azure Resource Manager (ARM) templates or Bicep files', keepCase: true, sub: ['Interpret an Azure Resource Manager template or a Bicep file', 'Modify an existing Azure Resource Manager template', 'Modify an existing Bicep file', 'Deploy resources by using an Azure Resource Manager template or a Bicep file', 'Export a deployment as an Azure Resource Manager template or convert an Azure Resource Manager template to a Bicep file'] },
      { id: '3.2', verb: 'Create', title: 'and configure virtual machines', sub: ['Create a virtual machine', 'Configure Azure Disk Encryption', 'Move a virtual machine to another resource group, subscription, or region', 'Manage virtual machine sizes', 'Manage virtual machine disks', 'Deploy virtual machines to availability zones and availability sets', 'Deploy and configure an Azure Virtual Machine Scale Sets'] },
      { id: '3.3', verb: 'Provision', title: 'and manage containers in the Azure portal', keepCase: true, sub: ['Create and manage an Azure container registry', 'Provision a container by using Azure Container Instances', 'Provision a container by using Azure Container Apps', 'Manage sizing and scaling for containers, including Azure Container Instances and Azure Container Apps'] },
      { id: '3.4', verb: 'Create', title: 'and configure Azure App Service', keepCase: true, sub: ['Provision an App Service plan', 'Configure scaling for an App Service plan', 'Create an App Service', 'Configure certificates and Transport Layer Security (TLS) for an App Service', 'Map an existing custom DNS name to an App Service', 'Configure backup for an App Service', 'Configure networking settings for an App Service', 'Configure deployment slots for an App Service'] },
    ],
  },
  {
    id: 4, weight: 19, weightRange: '15–20%', title: 'Implement and manage virtual networking', short: 'Networking',
    topics: [
      { id: '4.1', verb: 'Configure', title: 'and manage virtual networks in Azure', keepCase: true, sub: ['Create and configure virtual networks and subnets', 'Create and configure virtual network peering', 'Configure public IP addresses', 'Configure user-defined network routes', 'Troubleshoot network connectivity'] },
      { id: '4.2', verb: 'Configure', title: 'secure access to virtual networks', sub: ['Create and configure network security groups (NSGs) and application security groups', 'Evaluate effective security rules in NSGs', 'Implement Azure Bastion', 'Configure service endpoints for Azure platform as a service (PaaS)', 'Configure private endpoints for Azure PaaS'] },
      { id: '4.3', verb: 'Configure', title: 'name resolution and load balancing', sub: ['Configure Azure DNS', 'Configure an internal or public load balancer', 'Troubleshoot load balancing'] },
    ],
  },
  {
    id: 5, weight: 14, weightRange: '10–15%', title: 'Monitor and maintain Azure resources', short: 'Monitor & maintain',
    topics: [
      { id: '5.1', verb: 'Monitor', title: 'resources in Azure', keepCase: true, sub: ['Interpret metrics in Azure Monitor', 'Configure log settings in Azure Monitor', 'Query and analyze logs in Azure Monitor', 'Set up alert rules, action groups, and alert processing rules in Azure Monitor', 'Configure and interpret monitoring of virtual machines, storage accounts, and networks by using Azure Monitor Insights', 'Use Azure Network Watcher and Connection Monitor'] },
      { id: '5.2', verb: 'Implement', title: 'backup and recovery', sub: ['Create a Recovery Services vault', 'Create an Azure Backup vault', 'Create and configure a backup policy', 'Perform backup and restore operations by using Azure Backup', 'Configure Azure Site Recovery for Azure resources', 'Perform a failover to a secondary region by using Site Recovery', 'Configure and interpret reports and alerts for backups'] },
    ],
  },
];
