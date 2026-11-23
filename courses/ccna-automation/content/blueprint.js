// Official Cisco exam topics: Automating Networks Using Cisco Platforms v1.1 (200-901 CCNAAUTO).
// Source: Cisco exam topics PDF (200-901-CCNAAUTO_v.1.1.pdf) and the Cisco exam page (checked 2026-11-22).
// The exam was "DevNet Associate (DEVASC)" until February 3, 2026, when Cisco renamed the certification
// CCNA Automation. Topics are Cisco's numbered exam topics; `sub` breaks each into its named parts.

export const EXAM = {
  code: '200-901',
  name: 'Automating Networks Using Cisco Platforms v1.1 (200-901 CCNAAUTO)',
  certification: 'CCNA Automation',
  product: 'Cisco platforms',
  minutes: 120,
  questions: 100,
  questionsApprox: 'about 100',
  passingScore: 825,
  passingScoreNote: 'Cisco does not publish a passing score or question count; ~825/1000 is a commonly cited community estimate.',
  scoring: 'Scaled 300–1000; Cisco does not publish the passing score.',
};

export const DOMAINS = [
  {
    id: 1, weight: 15, title: 'Software Development and Design', short: 'Software development',
    topics: [
      { id: '1.1', verb: 'Compare', title: 'data formats (XML, JSON and YAML)', sub: ['XML', 'JSON', 'YAML'] },
      { id: '1.2', verb: 'Describe', title: 'parsing of common data formats to Python data structures', sub: ['XML to Python', 'JSON to Python', 'YAML to Python'] },
      { id: '1.3', verb: 'Describe', title: 'the concepts of test-driven development', sub: ['Test-driven development'] },
      { id: '1.4', verb: 'Compare', title: 'software development methods', sub: ['Agile', 'Lean', 'Waterfall'] },
      { id: '1.5', verb: 'Explain', title: 'the benefits of organizing code into methods/functions, classes and modules', sub: ['Methods / functions', 'Classes', 'Modules'] },
      { id: '1.6', verb: 'Explain', title: 'the advantages of common design patterns', sub: ['MVC', 'Observer'] },
      { id: '1.7', verb: 'Explain', title: 'the advantages of version control', sub: ['Version control'] },
      { id: '1.8', verb: 'Utilize', title: 'common version control operations with Git', sub: ['Clone', 'Add / remove', 'Commit', 'Push / pull', 'Branch', 'Merge and handling conflicts', 'diff'] },
    ],
  },
  {
    id: 2, weight: 20, title: 'Understanding and Using APIs', short: 'Using APIs',
    topics: [
      { id: '2.1', verb: 'Construct', title: 'a REST API request to accomplish a task given API documentation', keepCase: true, sub: ['REST API request from documentation'] },
      { id: '2.2', verb: 'Describe', title: 'common usage patterns related to webhooks', sub: ['Webhooks'] },
      { id: '2.3', verb: 'Describe', title: 'the constraints when consuming APIs', sub: ['Constraints when consuming APIs'] },
      { id: '2.4', verb: 'Explain', title: 'common HTTP response codes associated with REST APIs', keepCase: true, sub: ['HTTP response codes'] },
      { id: '2.5', verb: 'Troubleshoot', title: 'a problem given the HTTP response code, request and API documentation', sub: ['Troubleshooting from response code, request and documentation'] },
      { id: '2.6', verb: 'Interpret', title: 'the parts of an HTTP response', sub: ['Response code', 'Headers', 'Body'] },
      { id: '2.7', verb: 'Utilize', title: 'common API authentication mechanisms', keepCase: true, sub: ['Basic', 'Custom token', 'API keys'] },
      { id: '2.8', verb: 'Compare', title: 'common API styles', keepCase: true, sub: ['REST', 'RPC', 'Synchronous', 'Asynchronous'] },
      { id: '2.9', verb: 'Construct', title: 'a Python script that calls a REST API using the requests library', keepCase: true, sub: ['Python requests library'] },
    ],
  },
  {
    id: 3, weight: 15, title: 'Cisco Platforms and Development', short: 'Cisco platforms',
    topics: [
      { id: '3.1', verb: 'Construct', title: 'a Python script that uses a Cisco SDK given SDK documentation', keepCase: true, sub: ['Cisco SDKs'] },
      { id: '3.2', verb: 'Describe', title: 'the capabilities of Cisco network management platforms and APIs', keepCase: true, sub: ['Meraki', 'Cisco Catalyst Center', 'ACI', 'Cisco Catalyst SD-WAN', 'NSO'] },
      { id: '3.3', verb: 'Describe', title: 'the capabilities of Cisco compute management platforms and APIs', keepCase: true, sub: ['UCS Manager', 'Intersight'] },
      { id: '3.4', verb: 'Describe', title: 'the capabilities of Cisco collaboration platforms and APIs', keepCase: true, sub: ['Webex', 'Webex devices', 'Cisco Unified Communications Manager: AXL and UDS interfaces'] },
      { id: '3.5', verb: 'Describe', title: 'the capabilities of Cisco security platforms and APIs', keepCase: true, sub: ['XDR', 'Firepower', 'Secure Connect', 'Secure Endpoint', 'ISE', 'Secure Malware Analytics'] },
      { id: '3.6', verb: 'Describe', title: 'the device level APIs and dynamic interfaces for IOS XE and NX-OS', keepCase: true, sub: ['IOS XE', 'NX-OS'] },
      { id: '3.7', verb: 'Describe', title: 'the appropriate DevNet resource for a given scenario', keepCase: true, sub: ['Sandbox', 'Code Exchange', 'Support', 'Forums', 'Learning Labs', 'API documentation'] },
      { id: '3.8', verb: 'Apply', title: 'concepts of model driven programmability in a Cisco environment', keepCase: true, sub: ['YANG', 'RESTCONF', 'NETCONF'] },
      { id: '3.9', verb: 'Construct', title: 'code to perform a specific operation given requirements and API reference documentation', keepCase: true, sub: ['Obtain a list of network devices by using Meraki, Cisco Catalyst Center, ACI, Cisco Catalyst SD-WAN or NSO', 'Manage spaces, participants and messages in Webex', 'Obtain a list of clients / hosts seen on a network using Meraki or Cisco Catalyst Center'] },
    ],
  },
  {
    id: 4, weight: 15, title: 'Application Deployment and Security', short: 'Deployment & security',
    topics: [
      { id: '4.1', verb: 'Describe', title: 'the benefits of edge computing', sub: ['Edge computing'] },
      { id: '4.2', verb: 'Describe', title: 'the attributes of different application deployment models', sub: ['Private cloud', 'Public cloud', 'Hybrid cloud', 'Edge'] },
      { id: '4.3', verb: 'Describe', title: 'the attributes of application deployment types', sub: ['Virtual machines', 'Bare metal', 'Containers'] },
      { id: '4.4', verb: 'Describe', title: 'components for a CI/CD pipeline in application deployments', keepCase: true, sub: ['CI/CD pipeline components'] },
      { id: '4.5', verb: 'Construct', title: 'a Python unit test', keepCase: true, sub: ['Python unit test'] },
      { id: '4.6', verb: 'Interpret', title: 'contents of a Dockerfile', keepCase: true, sub: ['Dockerfile'] },
      { id: '4.7', verb: 'Utilize', title: 'Docker images in a local developer environment', keepCase: true, sub: ['Docker images'] },
      { id: '4.8', verb: 'Describe', title: 'application security issues', sub: ['Secret protection', 'Encryption: storage and transport', 'Data handling'] },
      { id: '4.9', verb: 'Explain', title: 'the role of firewalls, DNS, load balancers and reverse proxy in application deployment', sub: ['Firewalls', 'DNS', 'Load balancers', 'Reverse proxy'] },
      { id: '4.10', verb: 'Describe', title: 'top OWASP threats', keepCase: true, sub: ['XSS', 'SQL injection', 'CSRF'] },
      { id: '4.11', verb: 'Utilize', title: 'Bash commands', keepCase: true, sub: ['File management', 'Directory navigation', 'Environmental variables'] },
      { id: '4.12', verb: 'Describe', title: 'the principles of DevOps practices', keepCase: true, sub: ['DevOps practices'] },
    ],
  },
  {
    id: 5, weight: 20, title: 'Infrastructure and Automation', short: 'Infrastructure & automation',
    topics: [
      { id: '5.1', verb: 'Describe', title: 'the value of model driven programmability for infrastructure automation', sub: ['Model driven programmability'] },
      { id: '5.2', verb: 'Compare', title: 'controller-level to device-level management', sub: ['Controller-level management', 'Device-level management'] },
      { id: '5.3', verb: 'Describe', title: 'the use and roles of network simulation and test tools', sub: ['Cisco Modeling Labs', 'pyATS'] },
      { id: '5.4', verb: 'Describe', title: 'the components and benefits of a CI/CD pipeline in infrastructure automation', keepCase: true, sub: ['CI/CD pipeline in infrastructure automation'] },
      { id: '5.5', verb: 'Describe', title: 'the principles of infrastructure as code', sub: ['Infrastructure as code'] },
      { id: '5.6', verb: 'Describe', title: 'the capabilities of automation tools', sub: ['Ansible', 'Terraform', 'Cisco NSO'] },
      { id: '5.7', verb: 'Identify', title: 'the workflow being automated by a Python script that uses Cisco APIs', keepCase: true, sub: ['ACI', 'Meraki', 'Cisco Catalyst Center', 'RESTCONF'] },
      { id: '5.8', verb: 'Interpret', title: 'the workflow being automated by an Ansible playbook', keepCase: true, sub: ['Management packages', 'User management related to services', 'Basic service configuration', 'Start / stop'] },
      { id: '5.9', verb: 'Interpret', title: 'the workflow being automated by a Bash script', keepCase: true, sub: ['File management', 'App install', 'User management', 'Directory navigation'] },
      { id: '5.10', verb: 'Interpret', title: 'the results of a RESTCONF or NETCONF query', keepCase: true, sub: ['RESTCONF query results', 'NETCONF query results'] },
      { id: '5.11', verb: 'Interpret', title: 'basic YANG models', keepCase: true, sub: ['YANG models'] },
      { id: '5.12', verb: 'Interpret', title: 'a unified diff', sub: ['Unified diff'] },
      { id: '5.13', verb: 'Describe', title: 'the principles and benefits of a code review process', sub: ['Code review'] },
      { id: '5.14', verb: 'Interpret', title: 'a sequence diagram that includes API calls', keepCase: true, sub: ['Sequence diagram with API calls'] },
    ],
  },
  {
    id: 6, weight: 15, title: 'Network Fundamentals', short: 'Network fundamentals',
    topics: [
      { id: '6.1', verb: 'Describe', title: 'the purpose and usage of MAC addresses and VLANs', keepCase: true, sub: ['MAC addresses', 'VLANs'] },
      { id: '6.2', verb: 'Describe', title: 'the purpose and usage of IP addresses, routes, subnet mask / prefix and gateways', keepCase: true, sub: ['IP addresses', 'Routes', 'Subnet mask / prefix', 'Gateways'] },
      { id: '6.3', verb: 'Describe', title: 'the function of common networking components', sub: ['Switches', 'Routers', 'Firewalls', 'Load balancers'] },
      { id: '6.4', verb: 'Interpret', title: 'a basic network topology diagram', sub: ['Switches, routers, firewalls, load balancers and port values in a diagram'] },
      { id: '6.5', verb: 'Describe', title: 'the function of management, data and control planes in a network device', sub: ['Management plane', 'Data plane', 'Control plane'] },
      { id: '6.6', verb: 'Describe', title: 'the functionality of IP services', keepCase: true, sub: ['DHCP', 'DNS', 'NAT', 'SNMP', 'NTP'] },
      { id: '6.7', verb: 'Recognize', title: 'common protocol port values', sub: ['SSH', 'Telnet', 'HTTP', 'HTTPS', 'NETCONF'] },
      { id: '6.8', verb: 'Diagnose', title: 'application connectivity issues', sub: ['NAT problem', 'Transport port blocked', 'Proxy', 'VPN'] },
      { id: '6.9', verb: 'Explain', title: 'the impacts of network constraints on applications', sub: ['Network constraints on applications'] },
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
