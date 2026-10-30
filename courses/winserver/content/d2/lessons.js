// Domain 2 — Manage Windows Server instances and workloads in a hybrid environment (10-15%).
// Ordered in recommended study order.
export default [
  {
    id: '2.1-windows-admin-center',
    topic: '2.1',
    title: 'Windows Admin Center On-Premises and in the Azure Portal',
    minutes: 25,
    file: '2.1-windows-admin-center.md',
    objectives: [
      'Describe the WAC gateway architecture and the modernized (2410+) gateway changes, ports and lifecycle',
      'Choose an installation mode and install WAC unattended, including high availability',
      'Separate gateway access roles from managed-node RBAC and configure single sign-on with resource-based constrained delegation',
      'Deploy and connect to Windows Admin Center in the Azure portal for Arc-enabled servers and Azure VMs, including roles and network requirements',
    ],
  },
  {
    id: '2.1-powershell-remoting-jea',
    topic: '2.1',
    title: 'PowerShell Remoting, the Second Hop and Just Enough Administration',
    minutes: 30,
    file: '2.1-powershell-remoting-jea.md',
    objectives: [
      'Configure WinRM remoting for domain, workgroup and cross-domain targets (TrustedHosts, HTTPS)',
      'Explain the second-hop problem and choose between CredSSP, resource-based Kerberos constrained delegation, JEA and RunAs',
      'Author JEA role capability (.psrc) and session configuration (.pssc) files and register the endpoint',
      'Validate a JEA endpoint with Get-PSSessionCapability and connect with -ConfigurationName',
    ],
  },
  {
    id: '2.1-ssh-remote-desktop',
    topic: '2.1',
    title: 'Remote Access with OpenSSH and Remote Desktop',
    minutes: 25,
    file: '2.1-ssh-remote-desktop.md',
    objectives: [
      'Enable and configure OpenSSH Server on Windows Server 2025 and install it on 2019/2022',
      'Configure key-based authentication for administrators, user filtering and the default shell',
      'Enable Remote Desktop, control who may sign in, and keep Network Level Authentication on',
      'Protect administrator credentials with Restricted Admin mode and Remote Credential Guard, and choose secure RDP paths into Azure',
    ],
  },
  {
    id: '2.2-azure-arc-servers',
    topic: '2.2',
    title: 'Implementing Azure Arc-Enabled Windows Servers',
    minutes: 25,
    file: '2.2-azure-arc-servers.md',
    objectives: [
      'Explain what Azure Arc-enabled servers provides and how it is billed',
      'Identify the Connected Machine agent services, azcmagent commands and connection states',
      'Plan outbound network access, proxy, Arc gateway and Private Link scope',
      'Onboard servers interactively and at scale with a least-privilege service principal',
    ],
  },
  {
    id: '2.2-arc-machine-configuration-extensions',
    topic: '2.2',
    title: 'Machine Configuration and VM Extensions on Arc-Enabled Servers',
    minutes: 25,
    file: '2.2-arc-machine-configuration-extensions.md',
    objectives: [
      'Audit and enforce OS settings with Azure Machine Configuration and choose an assignment type',
      'Build custom Machine Configuration packages with the GuestConfiguration module',
      'Deploy VM extensions such as Azure Monitor Agent and Custom Script to Arc-enabled servers, individually and with Azure Policy',
      'Lock down sensitive servers with local extension allow lists, block lists and monitor mode',
    ],
  },
  {
    id: '2.2-update-manager-automation',
    topic: '2.2',
    title: 'Azure Update Manager and Azure Automation Runbooks',
    minutes: 30,
    file: '2.2-update-manager-automation.md',
    objectives: [
      'Assess and install updates with Azure Update Manager, including periodic assessment',
      'Schedule patching with maintenance configurations and dynamic scopes, and know the Azure VM orchestration prerequisite',
      'Explain Update Manager pricing for Arc-enabled servers and the exemptions',
      'Create, publish and run Azure Automation runbooks in the cloud and on extension-based Hybrid Runbook Workers',
    ],
  },
];
