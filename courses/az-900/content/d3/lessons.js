// Domain 3 — Describe Azure management and governance. Original content, checked against Microsoft Learn (cost management and pricing calculator, tags and tag policies, Azure Policy effects, resource locks, Cloud Shell, Advisor, Service Health and Resource Health FAQs, AZ-900 study guide of July 20, 2026).
export default [
  { id: '3.1-cost-management', topic: '3.1', title: 'Cost Management: Cost Factors, Pricing Calculator, Cost Management and Tags', minutes: 8, file: '3.1-cost-management.md',
    objectives: ['List the factors that affect Azure cost', 'Use the pricing calculator and know the status of the TCO calculator', 'Describe cost analysis, budgets, alerts and exports in Microsoft Cost Management', 'Explain tags and why they are not inherited by default'] },
  { id: '3.2-governance-compliance', topic: '3.2', title: 'Governance and Compliance: Microsoft Purview, Azure Policy and Resource Locks', minutes: 9, file: '3.2-governance-compliance.md',
    objectives: ['Distinguish RBAC, Azure Policy, resource locks and Microsoft Purview', 'Describe policy effects, initiatives and remediation', 'Explain CanNotDelete and ReadOnly locks and who they apply to', 'State the purpose of Microsoft Purview'] },
  { id: '3.3-management-tools', topic: '3.3', title: 'Managing and Deploying Resources: Portal, Cloud Shell, CLI, PowerShell, Arc and IaC', minutes: 9, file: '3.3-management-tools.md',
    objectives: ['Explain the role of Azure Resource Manager', 'Choose between the portal, Cloud Shell, Azure CLI and Azure PowerShell', 'Describe Azure Arc and what it manages', 'Describe infrastructure as code, ARM templates and Bicep'] },
  { id: '3.4-monitoring-tools', topic: '3.4', title: 'Monitoring: Advisor, Service Health, Azure Monitor, Log Analytics and Application Insights', minutes: 9, file: '3.4-monitoring-tools.md',
    objectives: ['List the five Advisor categories', 'Contrast Azure status, Service Health and Resource Health', 'Describe Azure Monitor metrics, logs, alerts and Log Analytics', 'Choose between Advisor, Service Health, Monitor and Application Insights'] },
];
