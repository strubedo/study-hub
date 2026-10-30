// Cheat-sheet tables for the Reference page. Cells are inline markdown.
// Each domain writer appends a dNTables constant for its own topics and spreads it into the default export.


const d1Tables = [
  {
    id: 'shared-responsibility', title: 'Shared responsibility by deployment type', topic: '1.1',
    columns: ['Responsibility', 'On-premises', 'IaaS', 'PaaS', 'SaaS'],
    rows: [
      ['Information and data', 'Customer', 'Customer', 'Customer', 'Customer'],
      ['Accounts and identities', 'Customer', 'Customer', 'Customer', 'Customer'],
      ['Client devices', 'Customer', 'Customer', 'Customer', 'Shared'],
      ['Applications', 'Customer', 'Customer', 'Shared', 'Shared'],
      ['Network controls', 'Customer', 'Customer', 'Shared', 'Microsoft'],
      ['Operating system', 'Customer', 'Customer', 'Microsoft', 'Microsoft'],
      ['Physical hosts, network, datacenter', 'Customer', 'Microsoft', 'Microsoft', 'Microsoft'],
      ['Azure examples', 'Own datacenter', 'Virtual Machines, virtual networks', 'App Service, Azure SQL Database, Functions', 'Microsoft 365, Dynamics 365'],
    ],
  },
  {
    id: 'cloud-models-pricing', title: 'Cloud models, pricing models and CapEx vs OpEx', topic: '1.1',
    columns: ['Concept', 'Definition', 'Use when'],
    rows: [
      ['Public cloud', 'Provider-owned, shared by many tenants', 'Variable workloads, no hardware outlay, fast scale'],
      ['Private cloud', 'Single organization, on-premises or hosted for it alone', 'Strict control or existing hardware'],
      ['Hybrid cloud', 'Private/on-premises plus public, connected', 'Sensitive data local, burst or new services in cloud'],
      ['Multi-cloud', 'More than one public cloud provider', 'Spreading workloads across providers'],
      ['CapEx', 'Upfront spend on physical assets', 'Typical on-premises'],
      ['OpEx', 'Ongoing pay-for-use spend', 'Typical cloud (consumption-based)'],
      ['Pay-as-you-go', 'Standard rate, no commitment', 'Unpredictable or short-lived workloads'],
      ['Reservation', '1 or 3 year commitment to a specific configuration', 'Steady, unchanging workloads'],
      ['Savings plan', '1 or 3 year commitment to a fixed hourly spend, flexible across eligible services and regions', 'Dynamic workloads with a steady baseline'],
      ['Spot', 'Discounted spare capacity, evictable, no SLA', 'Interruptible batch, dev/test'],
      ['Serverless', 'No server management, event-driven, automatic scale, billed by use', 'Azure Functions, Logic Apps'],
    ],
  },
];

const d2Tables = [
  {
    id: 'storage-redundancy', title: 'Storage redundancy options', topic: '2.3',
    columns: ['Option', 'Copies', 'Primary region', 'Secondary region', 'Secondary readable', 'Archive tier'],
    rows: [
      ['LRS', '3', 'One datacenter', 'None', 'No secondary', 'Yes'],
      ['ZRS', '3', 'Three availability zones', 'None', 'No secondary', 'No'],
      ['GRS', '6', 'LRS (3 copies)', 'LRS (3 copies), paired region', 'Only after failover', 'Yes'],
      ['RA-GRS', '6', 'LRS (3 copies)', 'LRS (3 copies), paired region', 'Yes, at any time', 'Yes'],
      ['GZRS', '6', 'ZRS (3 copies across zones)', 'LRS (3 copies), paired region', 'Only after failover', 'No'],
      ['RA-GZRS', '6', 'ZRS (3 copies across zones)', 'LRS (3 copies), paired region', 'Yes, at any time', 'No'],
    ],
  },
  {
    id: 'storage-services-tiers', title: 'Storage services, account types and blob access tiers', topic: '2.3',
    columns: ['Item', 'What it is', 'Key fact'],
    rows: [
      ['Blob Storage', 'Unstructured objects in containers', 'Block, append and page blobs'],
      ['Azure Files', 'Managed SMB (and NFS) file shares', 'Pairs with Azure File Sync for on-premises caching'],
      ['Queue Storage', 'Messages for asynchronous processing', 'Decouples application components'],
      ['Table Storage', 'Schemaless NoSQL key-attribute store', 'Simple structured data'],
      ['Standard general-purpose v2', 'Blobs, files, queues, tables', 'Recommended default; LRS through RA-GZRS; type cannot be changed later'],
      ['Premium block blobs / file shares / page blobs', 'SSD-backed accounts for one service each', 'LRS or ZRS (page blobs: LRS)'],
      ['Hot tier', 'Frequently accessed data', 'No minimum retention'],
      ['Cool tier', 'Infrequently accessed data', 'Minimum 30 days'],
      ['Cold tier', 'Rarely accessed, still online', 'Minimum 90 days'],
      ['Archive tier', 'Rarely accessed, offline', 'Minimum 180 days; rehydrate (hours) before reading; LRS, GRS, RA-GRS only'],
      ['AzCopy', 'Command-line copy tool', 'Scriptable transfers to, from and between accounts'],
      ['Azure Storage Explorer', 'Free GUI app', 'Browse and manage storage data'],
      ['Azure File Sync', 'Sync Windows file servers with Azure Files', 'Local cache via cloud tiering'],
      ['Azure Migrate', 'Discover, assess and migrate workloads', 'Central migration hub'],
      ['Azure Data Box', 'Ship a physical device for offline bulk transfer', 'Use when bandwidth is limited'],
    ],
  },
  {
    id: 'compute-networking-map', title: 'Compute and networking: which service?', topic: '2.2',
    columns: ['Requirement', 'Service', 'Note'],
    rows: [
      ['Full OS control, lift-and-shift', 'Azure Virtual Machines', 'IaaS; you patch the OS'],
      ['Autoscaling group of identical VMs', 'Virtual Machine Scale Sets', 'Load balanced, autoscale'],
      ['Spread VMs across racks within a datacenter', 'Availability set', 'Fault and update domains'],
      ['Survive a datacenter outage in a region', 'Availability zones', 'At least three zones per zone-enabled region'],
      ['Windows desktops and apps from Azure', 'Azure Virtual Desktop', 'Multi-session Windows supported'],
      ['Run one container with no orchestration', 'Azure Container Instances', ''],
      ['Orchestrate many containers', 'Azure Kubernetes Service', 'Managed Kubernetes'],
      ['Event-driven code, no servers', 'Azure Functions', 'Billed per execution'],
      ['Managed web app hosting', 'Azure App Service', 'PaaS, no OS patching'],
      ['Connect two VNets privately', 'VNet peering', 'Not transitive; no overlapping address space'],
      ['Host DNS zones', 'Azure DNS', 'Does not register domains'],
      ['Encrypted tunnel over the internet', 'VPN Gateway', 'Site-to-site or point-to-site; needs GatewaySubnet'],
      ['Private dedicated connection', 'ExpressRoute', 'Does not use the public internet'],
      ['Private IP for a PaaS service in your subnet', 'Private endpoint (Private Link)', 'Public endpoint is internet-reachable'],
    ],
  },
];

const d3Tables = [
  {
    id: 'governance-tools', title: 'Governance tools: which one meets the requirement?', topic: '3.2',
    columns: ['Tool', 'Controls', 'Use it when', 'Applies to Owners?'],
    rows: [
      ['Azure RBAC', 'Which identities can perform which actions at a scope', 'Limit who can restart, edit or delete', 'It is the permission model itself'],
      ['Azure Policy', 'Which resource configurations are allowed or required', 'Restrict regions or SKUs, require tags or encryption, audit compliance', 'Yes, evaluates the resource not the user'],
      ['Resource locks', 'Deletion (CanNotDelete) or any change (ReadOnly) of a resource', 'Protect critical resources from accidents', 'Yes, overrides RBAC for all users'],
      ['Tags', 'Nothing (metadata only)', 'Cost allocation, organization, automation targeting', 'Not applicable; not inherited by default'],
      ['Microsoft Purview', 'Data discovery, classification, lineage, protection, compliance posture', 'Find and govern sensitive data across hybrid and multicloud', 'Not applicable (data-focused)'],
      ['Microsoft Cost Management', 'Cost visibility, budgets and alerts', 'Analyze and alert on spend; does not enforce limits', 'Access via RBAC cost roles'],
    ],
  },
  {
    id: 'management-deployment-tools', title: 'Management and deployment tools', topic: '3.3',
    columns: ['Tool', 'What it is', 'Best for', 'Repeatable?'],
    rows: [
      ['Azure portal', 'Web-based graphical console', 'Exploring, one-off tasks, dashboards', 'No'],
      ['Azure Cloud Shell', 'Browser-based shell with Bash or PowerShell, CLI and PowerShell preinstalled', 'Quick commands from anywhere, nothing to install', 'Scripts you run in it are'],
      ['Azure CLI', 'Cross-platform az command-line tool', 'Scripting, especially Bash-style workflows', 'Yes (scripts)'],
      ['Azure PowerShell', 'Az cmdlets (Verb-Noun) returning objects', 'PowerShell users and Windows administration', 'Yes (scripts)'],
      ['ARM template', 'Declarative JSON deployed through Azure Resource Manager', 'Repeatable, idempotent deployments', 'Yes'],
      ['Bicep', 'Readable language that compiles to ARM templates', 'Authoring IaC for Azure (recommended over raw JSON)', 'Yes'],
      ['Azure Arc', 'Projects non-Azure servers, clusters and data services into ARM', 'Managing hybrid and multicloud resources with Azure Policy, RBAC, tags and monitoring', 'Not a deployment language'],
      ['Azure Resource Manager', 'The management layer all the tools above call', 'Consistent RBAC, Policy, locks and tags across tools', 'Not applicable'],
    ],
  },
  {
    id: 'monitoring-tools', title: 'Monitoring tools: which one answers the question?', topic: '3.4',
    columns: ['Tool', 'Question it answers', 'Scope'],
    rows: [
      ['Azure Advisor', 'How can I improve reliability, security, performance, cost and operational excellence?', 'Recommendations across your subscriptions; does not change anything itself'],
      ['Azure status', 'Is Azure having a widespread outage?', 'Public global page, all services and regions'],
      ['Service Health', 'Are Azure issues, maintenance or advisories affecting the services and regions I use?', 'Personalized to your subscriptions; supports alerts'],
      ['Resource Health', 'Is this specific VM or database healthy from Azure\'s side?', 'Single resource'],
      ['Azure Monitor', 'What do metrics and logs say, and who is alerted?', 'Platform for telemetry, alerts, autoscale, visualizations'],
      ['Log Analytics', 'What do my logs show? (KQL queries)', 'Workspace and query tool inside Azure Monitor'],
      ['Application Insights', 'How is my application performing and failing?', 'Application performance monitoring inside Azure Monitor'],
      ['Activity log', 'Who did what to my resources and when?', 'Subscription-level control-plane operations'],
    ],
  },
];

export default [
  ...d1Tables,
  ...d2Tables,
  ...d3Tables,
];
