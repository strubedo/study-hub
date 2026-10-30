// Official Fortinet "NSE 6 - FortiManager 7.6 Administrator" exam topics.
// Source: training.fortinet.com/local/staticpage/view.php?page=fortimanager_administrator_exam
// (status Available, checked 2026-10-29). Product version FortiManager 7.6.1, FortiOS 7.6.
// Sub-bullets are Fortinet's list (light capitalisation fixes only; Fortinet repeats some
// bullets across tasks). Fortinet publishes weight ranges; `weight` is the midpoint.

export const EXAM = {
  code: 'NSE 6',
  name: 'Fortinet NSE 6 - FortiManager 7.6 Administrator',
  certification: 'Counts toward Fortinet Certified NSE 6 Secure Networking',
  product: 'FortiManager 7.6.1, FortiOS 7.6',
  minutes: 70,
  questionsApprox: '30-40',
  scoring: 'Pass or fail. Fortinet does not publish a cut score; answers need to be 100% correct (no partial credit).',
  price: 'US$210 from 2026-11-02 (US$200 before)',
  validityYears: 2,
};

export const DOMAINS = [
  {
    id: 1,
    weight: 20,
    weightRange: '15-25%',
    title: 'Administration',
    short: 'Administration',
    topics: [
      { id: '1.1', verb: 'Describe', title: 'FortiManager features', keepCase: true, sub: ['Key features', 'Administrative domains (ADOM)', 'FortiManager managing FortiAnalyzer', 'FortiManager with FortiAnalyzer features', 'Inside FortiManager', 'Network topology', 'FortiManager API', 'Supported API methods', 'API HTTP response codes', 'Use cases—login and logout requests, get firewall package installation target'] },
      { id: '1.2', verb: 'Perform', title: 'initial configuration', sub: ['Factory default settings', 'FortiManager setup wizard', 'Initial configuration', 'Organization requirements', 'Use cases—initial configuration, FortiAnalyzer integration with FortiManager'] },
      { id: '1.3', verb: 'Configure', title: 'ADOMs', sub: ['Understanding ADOMs', 'ADOM operation modes', 'ADOM device modes', 'Administrator profile types', 'Multiple administrators and security', 'External validation of nonlocal administrator logins', 'Administrator session monitoring', 'Concurrent ADOM access—workspace default', 'Workspace mode', 'Locking ADOMs (workspace mode)', 'Supported ADOM versions', 'Organizing devices by ADOM', 'ADOM upgrade', 'One-click ADOM upgrade', 'Upgraded device to a different ADOM migration', 'Registered device movement between ADOMs', 'FortiManager backups', 'FortiManager configuration restoration', 'FortiManager configuration migration', 'Offline mode', 'Use cases—ADOM configuration (retail, MSSP)'] },
    ],
  },
  {
    id: 2,
    weight: 25,
    weightRange: '20-30%',
    title: 'Device manager',
    short: 'Device manager',
    topics: [
      { id: '2.1', verb: 'Register', title: 'devices in ADOMs', sub: ['Template provisioning', 'System templates', 'Copying system templates between ADOMs', 'Wizards', 'Methods of device registration—add device wizard, request from supported device', 'Chassis management', 'Device count on FortiManager', 'Considerations when managing FortiGate HA clusters', 'FortiGate-FortiManager communication protocol (FGFM)', 'Import report example—policy view, model device, device blueprints', 'Device discovery and add process', 'Basic discovery failure checklist', 'Useful CLI commands', 'Device groups'] },
      { id: '2.2', verb: 'Install', title: 'configuration changes using scripts', sub: ['Scripts', 'Best practices for CLI scripts', 'Script configuration', 'Script scheduling', 'Advanced use of CLI scripts', 'Common script execution errors', 'Troubleshooting scripts', 'Useful CLI commands'] },
      { id: '2.3', verb: 'Diagnose', title: 'issues using configuration and the revision history', sub: ['Revision history', 'Configuration issues', 'Retrieval', 'Automatic updates', 'Configuration revisions—reverting'] },
    ],
  },
  {
    id: 3,
    weight: 30,
    weightRange: '25-35%',
    title: 'Policy and objects',
    short: 'Policy & objects',
    topics: [
      { id: '3.1', verb: 'Perform', title: 'policy and object management', sub: ['Policy workflow', 'Policy packages', 'Object configurations', 'Feature visibility', 'Installation targets—per policy', 'Dynamic objects', 'Interface mapping', 'Used objects', 'Unused and duplicate objects', 'Policy check', 'Meta fields', 'ADOM-level metadata variables', 'Policy package status', 'Import configuration wizard', 'Install wizard', 'Policy lock', 'Device lock', 'Per-policy lock', 'Workflow mode—permissions, sessions', 'Closing sessions with locked ADOMs'] },
      { id: '3.2', verb: 'Manage', title: 'ADOM revisions', sub: ['Device organization by ADOM', 'ADOM upgrade', 'One-click ADOM upgrade', 'Upgraded device to a different ADOM migration', 'Registered device movement between ADOMs', 'ADOM revisions', 'ADOM database versions', 'Moving FortiGate from one ADOM to another'] },
      { id: '3.3', verb: 'Configure', title: 'workspace mode', sub: ['Concurrent ADOM access—workspace default', 'Workspace mode', 'Workspace mode effects', 'ADOM locking', 'Supported ADOM versions', 'Device organization by ADOM'] },
      { id: '3.4', verb: 'Perform', title: 'policy imports and installations', sub: ['Policy check', 'Meta fields', 'ADOM-level metadata variables', 'Policy package status', 'Import configuration wizard—interface mapping and policy, summary', 'Install wizard—installation and validation', 'Reinstallation'] },
    ],
  },
  {
    id: 4,
    weight: 15,
    weightRange: '10-20%',
    title: 'Advanced configuration',
    short: 'Advanced config',
    topics: [
      { id: '4.1', verb: 'Describe', title: 'FortiManager high availability (HA)', keepCase: true, sub: ['HA', 'FortiGate HA cluster management', 'HA synchronization', 'Failover modes'] },
      { id: '4.2', verb: 'Configure', title: 'FortiGuard services', keepCase: true, sub: ['Managed FortiGate configuration', 'FortiManager as a local FortiGuard server', 'FortiManager as a local FortiGuard cache', 'FortiGuard terminology', 'Antivirus and intrusion prevention system (IPS) service', 'Push updates', 'Package management', 'Web filter and email filter configuration', 'Query server management', 'Server override mode', 'Override server address', 'FortiGate/FortiMail server override—antivirus and IPS', 'FortiGuard license status', 'Firmware cache', 'FortiGate firmware update from FortiManager', 'Unmanaged FortiGate to use FortiManager as a FortiGuard Distribution Server (FDS)', 'Managed FortiGate to use FortiManager as an FDS', 'FortiGuard troubleshooting', 'FortiGuard connection status', 'FortiGate contract information verification on FortiManager', 'FortiGate troubleshooting commands'] },
      { id: '4.3', verb: 'Configure', title: 'the global database ADOM', sub: ['Shared global policies and objects', 'Global database ADOM', 'Global database ADOM—policy types', 'Global policy package assignment to an ADOM', 'FortiManager panes', 'Security Fabric rating and Security Fabric topology', 'Fabric view features', 'Use cases—global policy configuration, header policies in the global ADOM'] },
    ],
  },
  {
    id: 5,
    weight: 25,
    weightRange: '20-30%',
    title: 'Troubleshooting',
    short: 'Troubleshooting',
    topics: [
      { id: '5.1', verb: 'Describe', title: 'FortiManager deployment scenarios', keepCase: true, sub: ['Common FortiManager deployment scenarios', 'FortiManager behind a NAT device', 'FortiGate behind a NAT device', 'Both devices behind a NAT device'] },
      { id: '5.2', verb: 'Troubleshoot', title: 'import and installation issues', sub: ['Connectivity issues and processes', 'Diagnosing registration, import, and installation issues', 'Failed reload', 'Import issues—understanding failed import', 'Failed import—impact and resolution', 'Copy failed issues', 'Failed installation log', 'Failed installation resolution', 'Best practices for database integrity', 'Check file system integrity after power failure', 'Database integrity and best practices'] },
      { id: '5.3', verb: 'Troubleshoot', title: 'device-level and ADOM-level issues', sub: ['Device database', 'ADOM databases', 'Comparing the device database with the ADOM database'] },
      { id: '5.4', verb: 'Troubleshoot', title: 'system issues', sub: ['Purpose of keepalive messages', 'FGFM keepalive messages', 'Recovery logic', 'Replacing a managed FortiGate', 'Troubleshooting commands', 'System resource usage', 'High CPU and memory troubleshooting', 'High disk usage troubleshooting', 'FortiManager file system', 'Processes status', 'Debug commands'] },
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
