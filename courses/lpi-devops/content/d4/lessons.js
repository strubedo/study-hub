// Domain 4 — Security and Observability (LPI 704.1-704.4). Original content for LPI DevOps Tools Engineer 701-200 v2.0.
export default [
  { id: '4.1-risks-appsec-cve', topic: '4.1', title: 'Infrastructure and Supply Chain Risks, Application Security and CVEs', minutes: 12, file: '4.1-risks-appsec-cve.md',
    objectives: ['Match infrastructure threats (DoS, brute force, service exploits) to mitigations', 'Describe supply chain risks and controls', 'Explain XSS, SQL injection, CSRF, CORS, buffer overflows and verbose errors', 'Read CVE IDs and CVSS severity bands'] },
  { id: '4.1-crypto-authentication', topic: '4.1', title: 'Cryptography, TLS, SSO (OAuth2, OIDC, SAML), MFA and Password Hashing', minutes: 14, file: '4.1-crypto-authentication.md',
    objectives: ['Explain public/private keys, X.509 certificates, CAs and TLS', 'Distinguish OAuth 2.0, OpenID Connect and SAML', 'Describe the authorization code flow with PKCE', 'Explain TOTP and authenticator apps', 'Choose salted slow password hashes'] },
  { id: '4.2-prometheus-architecture', topic: '4.2', title: 'Prometheus Architecture, Configuration, Service Discovery, Alerting and Thanos', minutes: 16, file: '4.2-prometheus-architecture.md',
    objectives: ['State operations goals and the difference between technical and logical metrics', 'Name Prometheus components, roles and default ports', 'Write scrape_configs with static and file-based service discovery', 'Explain Alertmanager grouping, inhibition and silences', 'Know exporters, instrumentation and Thanos'] },
  { id: '4.2-promql', topic: '4.2', title: 'PromQL: Selectors, Vectors, Rates and Aggregation', minutes: 13, file: '4.2-promql.md',
    objectives: ['Distinguish instant and range vectors', 'Use the =, !=, =~ and !~ label matchers', 'Apply rate, irate and increase to counters', 'Aggregate with sum by / without and over time with avg_over_time'] },
  { id: '4.3-logging', topic: '4.3', title: 'Logging: syslog, journald and Open Source Logging Stacks', minutes: 13, file: '4.3-logging.md',
    objectives: ['Explain application and system logging practices', 'Read syslog facilities, severities and journalctl output', 'Describe ELK/EFK, Loki, Promtail/Alloy and Graylog roles', 'Query logs with LogQL basics'] },
  { id: '4.4-tracing-opentelemetry', topic: '4.4', title: 'Distributed Tracing with OpenTelemetry, Jaeger and Tempo', minutes: 13, file: '4.4-tracing-opentelemetry.md',
    objectives: ['Define trace, span, context, trace ID and span ID', 'Read a W3C traceparent header', 'Name span kinds and status codes', 'Describe the Collector pipeline and OTLP ports', 'Place Jaeger and Tempo in the tracing flow'] },
];
