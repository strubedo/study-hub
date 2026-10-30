// Official Palo Alto Networks "Next-Generation Firewall Engineer" exam blueprint.
// Source: ngfw-engineer-datasheet.pdf (datasheet dated NOVEMBER 2025), linked from
// paloaltonetworks.com/services/education/palo-alto-networks-ngfw-engineer (checked 2026-10-30).
// Palo Alto publishes exact domain weights. Sub-bullets are the datasheet's tasks (its "SLS/TLS profiles"
// is kept as "SSL/TLS service profiles"). The certification replaced the retired PCNSE.

export const EXAM = {
  code: 'NGFW Engineer',
  name: 'Palo Alto Networks Certified Next-Generation Firewall Engineer',
  certification: 'Palo Alto Networks Certified Next-Generation Firewall Engineer (Specialist level)',
  product: 'PAN-OS NGFWs, Panorama and Strata Logging Service',
  minutes: 90,
  questionsApprox: 'About 75 (reported; not published by Palo Alto)',
  scoring: 'Scaled score 300–1000; 860 to pass (Palo Alto Certification Handbook).',
  price: 'US$250 (Specialist level)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 40,
    title: 'PAN-OS Networking Configuration',
    short: 'Networking',
    topics: [
      { id: '1.1', verb: 'Configure', title: 'interfaces', sub: ['Layer 2', 'Layer 3', 'Virtual wire', 'Tunnel interfaces', 'Aggregate Ethernet (AE)', 'Management'] },
      { id: '1.2', verb: 'Configure', title: 'zones', sub: ['Zone types and zone protection basics'] },
      { id: '1.3', verb: 'Configure', title: 'high availability (HA)', keepCase: true, sub: ['Active/active', 'Active/passive', 'Link and path monitoring'] },
      { id: '1.4', verb: 'Configure', title: 'routing', sub: ['Dynamic routing protocols', 'Redistribution and policies', 'Route monitoring', 'Advanced Routing Engine'] },
      { id: '1.5', verb: 'Configure', title: 'GlobalProtect', keepCase: true, sub: ['Portals', 'Gateways', 'Authentication', 'Split tunneling'] },
      { id: '1.6', verb: 'Configure', title: 'tunnels', sub: ['IPSec', 'Quantum-resistant cryptography', 'Generic Routing Encapsulation (GRE)'] },
    ],
  },
  {
    id: 2,
    weight: 40,
    title: 'PAN-OS Device Setting Configuration',
    short: 'Device settings',
    topics: [
      { id: '2.1', verb: 'Implement', title: 'authentication roles, profiles, and sequences', sub: ['Admin roles', 'Authentication profiles', 'Authentication sequences'] },
      { id: '2.2', verb: 'Configure', title: 'virtual systems (VSYS)', keepCase: true, sub: ['Interfaces and zones', 'Virtual routers', 'Logical routers', 'Inter-VSYS routing and security'] },
      { id: '2.3', verb: 'Configure', title: 'logging', sub: ['Strata Logging Service', 'Log forwarding', 'Log collectors and log collector groups'] },
      { id: '2.4', verb: 'Implement', title: 'PAN-OS software updates', keepCase: true, sub: ['Software and content updates'] },
      { id: '2.5', verb: 'Configure', title: 'certificates', sub: ['PKI integration', 'Authentication', 'SSL/TLS service profiles', 'Decryption (e.g., subordinate CA, forward trust/untrust)', 'Certificate profiles'] },
      { id: '2.6', verb: 'Configure', title: 'on-premises and Cloud Identity Engine User-ID', sub: ['Group mapping and directory sync', 'User-to-IP mapping and user context', 'Redistribution and segments'] },
      { id: '2.7', verb: 'Configure', title: 'web proxy on PAN-OS', sub: ['Explicit and transparent proxy'] },
    ],
  },
  {
    id: 3,
    weight: 20,
    title: 'Integration and Automation',
    short: 'Integration & automation',
    topics: [
      { id: '3.1', verb: 'Install', title: 'the selected deployment option', sub: ['PA-Series', 'VM-Series', 'CN-Series', 'Cloud NGFW', 'AI Runtime Security'] },
      { id: '3.2', verb: 'Use', title: 'APIs to automate deployment', keepCase: true, sub: ['XML API and REST API'] },
      { id: '3.3', verb: 'Manage', title: 'third-party services to deploy NGFWs', sub: ['Kubernetes', 'Hypervisors', 'CSPs', 'Terraform', 'Ansible'] },
      { id: '3.4', verb: 'Use', title: 'on-premises centralized management', sub: ['Panorama', 'Templates and device groups', 'Pre- and post-ruleset'] },
      { id: '3.5', verb: 'Build', title: 'Application Command Center (ACC) dashboards and custom reports', keepCase: true, sub: ['ACC widgets and filters', 'Custom reports'] },
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
