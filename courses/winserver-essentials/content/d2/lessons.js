// Domain 2 - Active Directory Domain Services. Original content, checked against Microsoft Learn (Windows Server 2025 documentation) on 2026-10-30.
export default [
  { id: '2.1-ad-concepts-deploy-dc', topic: '2.1', title: 'AD DS Structure, DNS, Global Catalog and Promoting Domain Controllers', minutes: 10, file: '2.1-ad-concepts-deploy-dc.md',
    objectives: ['Describe forests, domains, trees, OUs and sites and which boundary each one is', 'Explain how DNS and the global catalog support AD DS', 'Promote a DC with Install-ADDSForest and Install-ADDSDomainController', 'List the Windows Server 2025 AD DS changes Microsoft documents'] },
  { id: '2.1-fsmo-functional-levels', topic: '2.1', title: 'FSMO Roles and Functional Levels, Including Level 10', minutes: 10, file: '2.1-fsmo-functional-levels.md',
    objectives: ['Name the five FSMO roles, their scope and the impact of losing each', 'Transfer and seize roles with PowerShell and know when each is right', 'Match functional levels to domain controller versions, including the 2025 level', 'Enable the Recycle Bin and the 32k database page feature with their prerequisites'] },
  { id: '2.1-rodc-replication', topic: '2.1', title: 'Read-Only Domain Controllers and Replication Basics', minutes: 9, file: '2.1-rodc-replication.md',
    objectives: ['Explain what an RODC caches and how the Password Replication Policy decides', 'Deploy an RODC directly or with a staged account', 'Compare intrasite and intersite replication and the roles of KCC and ISTG', 'Check replication health with repadmin and PowerShell'] },
  { id: '2.2-accounts-tools-powershell', topic: '2.2', title: 'User and Computer Accounts, ADUC, ADAC and the AD PowerShell Module', minutes: 9, file: '2.2-accounts-tools-powershell.md',
    objectives: ['Distinguish sAMAccountName, UPN, DN and SID', 'Choose between ADUC and ADAC for a task', 'Create, find and change accounts with the ActiveDirectory module', 'Repair a broken computer account secure channel'] },
  { id: '2.2-groups-scopes-agdlp', topic: '2.2', title: 'Group Types, Scopes, Nesting Rules and AGDLP', minutes: 9, file: '2.2-groups-scopes-agdlp.md',
    objectives: ['State what each group scope can contain and where it can be used', 'Apply the AGDLP and AGUDLP patterns', 'Know the scope conversion restrictions', 'Identify protected and special groups'] },
  { id: '2.2-service-accounts-delegation', topic: '2.2', title: 'gMSA, dMSA and Delegation of Control', minutes: 10, file: '2.2-service-accounts-delegation.md',
    objectives: ['Create and install a gMSA and explain the KDS root key', 'Describe the Windows Server 2025 dMSA and its migration rules', 'Delegate password reset on an OU with the wizard', 'Tell Kerberos delegation apart from delegation of control'] },
  { id: '2.3-gpo-processing-precedence', topic: '2.3', title: 'GPO Processing Order, Inheritance, Filtering and Loopback', minutes: 10, file: '2.3-gpo-processing-precedence.md',
    objectives: ['Predict the winning setting using LSDOU, link order, Enforced and Block Inheritance', 'Configure security and WMI filtering and avoid the MS16-072 pitfall', 'Choose between loopback Merge and Replace', 'State when Group Policy refreshes'] },
  { id: '2.3-gpo-settings-fgpp-troubleshooting', topic: '2.3', title: 'GPO Settings, gpupdate, gpresult and Fine-Grained Password Policies', minutes: 11, file: '2.3-gpo-settings-fgpp-troubleshooting.md',
    objectives: ['Place password policy, drive maps and application control in the right GPO area', 'Use gpupdate, gpresult and the GroupPolicy module to apply and diagnose policy', 'Create and apply a PSO and read the resultant policy', 'Explain why Software Restriction Policies are no longer recommended'] },
];
