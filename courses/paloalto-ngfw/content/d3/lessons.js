// Domain 3 — Integration and Automation. Original content for PAN-OS 11.2 / 12.1.
export default [
  { id: '3.1-pa-vm-series', topic: '3.1', title: 'PA-Series and VM-Series: Platforms, Installation and Licensing', minutes: 20, file: '3.1-pa-vm-series.md',
    objectives: ['Place PA-Series, VM-Series, CN-Series, Cloud NGFW and AI Runtime Security on one map', 'Perform first-boot setup of a PA-Series firewall', 'Map VM-Series NICs to ethernet interfaces and name the hypervisors and clouds', 'Choose between BYOL, PAYG and Flex credits and apply an auth code'] },
  { id: '3.1-vm-series-bootstrap', topic: '3.1', title: 'Bootstrapping a VM-Series Firewall', minutes: 20, file: '3.1-vm-series-bootstrap.md',
    objectives: ['Build the bootstrap package folder structure', 'Write init-cfg.txt for Panorama registration with a VM auth key', 'Name the bootstrap source for ESXi/KVM, AWS, Azure and GCP', 'Verify and troubleshoot a bootstrap'] },
  { id: '3.1-cn-cloudngfw-airs', topic: '3.1', title: 'CN-Series, Cloud NGFW and AI Runtime Security (Prisma AIRS)', minutes: 20, file: '3.1-cn-cloudngfw-airs.md',
    objectives: ['Name the CN-Series components and what Panorama does for them', 'Describe Cloud NGFW for AWS and Azure and who operates them', 'Explain rulestacks and the management options', 'Place AI Runtime Security (Prisma AIRS) Network Intercept versus API Intercept'] },
  { id: '3.2-xml-rest-api', topic: '3.2', title: 'The PAN-OS XML API and REST API', minutes: 25, file: '3.2-xml-rest-api.md',
    objectives: ['Generate and protect an API key', 'Build type=config, op, commit and log requests', 'Use the REST API for objects and policy and know that commit is separate', 'Use the API browser and debug cli on to find calls', 'Commit and poll a job through the API'] },
  { id: '3.3-third-party-deploy', topic: '3.3', title: 'Deploying with Kubernetes, Hypervisors, CSPs, Terraform and Ansible', minutes: 25, file: '3.3-third-party-deploy.md',
    objectives: ['Match each deployment target to its package and integration', 'Write a Terraform configuration with the panos provider (2.x) including location and commit', 'Use the paloaltonetworks.panos Ansible collection with a provider or API key', 'Choose between Terraform and Ansible for a task'] },
  { id: '3.4-panorama-templates', topic: '3.4', title: 'Panorama Templates, Template Stacks and Variables', minutes: 20, file: '3.4-panorama-templates.md',
    objectives: ['Separate templates (Network and Device) from device groups (policy and objects)', 'Order templates in a stack and predict the winning value', 'Use template variables for per-firewall values', 'Explain local override, Force Template Values and the Panorama modes'] },
  { id: '3.4-device-groups-rules-push', topic: '3.4', title: 'Device Groups, Pre/Post Rules, Commit and Push', minutes: 20, file: '3.4-device-groups-rules-push.md',
    objectives: ['Build a device group hierarchy and predict object inheritance', 'Order shared, parent and child pre rules, local rules, post rules and default rules', 'Differentiate Commit to Panorama, Push to Devices and Commit and Push', 'Use the push scope options and troubleshoot a failed push'] },
  { id: '3.5-acc-custom-reports', topic: '3.5', title: 'ACC Widgets, Filters and Custom Reports', minutes: 20, file: '3.5-acc-custom-reports.md',
    objectives: ['Navigate ACC tabs, widgets, time ranges and data sources', 'Apply global, local and locked filters', 'Build a custom tab', 'Build, schedule and group custom reports, choosing summary versus detailed databases'] },
];
