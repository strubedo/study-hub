// Domain 3 — Security profiles: lesson index (FortiOS 7.6). Recommended study order.
export default [
  {
    id: '3.1-ssl-inspection-design',
    topic: '3.1',
    title: 'SSL/SSH Inspection at Scale',
    minutes: 25,
    file: '3.1-ssl-inspection-design.md',
    objectives: [
      'Choose between multiple clients to multiple servers (re-sign) and protecting an SSL server (replace)',
      'Compare certificate inspection with full SSL inspection',
      'Configure the server certificate SNI check and the certificate-handling options',
      'Design exemptions and diagnose TLS false positives and certificate errors',
      'Explain how HTTP and HTTPS code injection relate to SSL inspection',
    ],
  },
  {
    id: '3.2-ips-sensor-design',
    topic: '3.2',
    title: 'IPS Sensor Design: Targets, CVE Patterns and False Positives',
    minutes: 20,
    file: '3.2-ips-sensor-design.md',
    objectives: [
      'Build server-target and client-target IPS sensors',
      'Create IPS entries from CVE IDs and CVE wildcards',
      'Detect code injection over HTTP and HTTPS',
      'Resolve IPS false positives with the narrowest exception',
      'Explain the config ips global settings that affect availability and performance',
    ],
  },
  {
    id: '3.2-layered-profiles-performance',
    topic: '3.2',
    title: 'Combining Web Filter, Application Control, IPS and ISDB',
    minutes: 23,
    file: '3.2-layered-profiles-performance.md',
    objectives: [
      'Place ISDB, application control, web filter and IPS at the right layer',
      'Use ISDB policies to reduce inspection load for trusted SaaS',
      'Explain the performance impact of security profiles and inspection modes',
      'Monitor device performance and recognize conserve mode',
    ],
  },
];
