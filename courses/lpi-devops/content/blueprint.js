// Official LPI "DevOps Tools Engineer" exam 701-200 objectives, version 2.0.0.
// Source: lpi.org/our-certifications/exam-701-objectives/ and the DevOps overview page (checked 2026-10-30).
// LPI weights add up to 60, the number of exam questions, so a topic's weight is roughly its question count.
// Domain `weight` is the share of those 60 in percent; `weightRange` shows the raw LPI weight sum.
// Sub-bullets are LPI's Key Knowledge Areas (shortened); the full term lists are in CONTENT_SPEC.md.

export const EXAM = {
  code: '701-200',
  name: 'LPI DevOps Tools Engineer (exam 701-200, version 2.0)',
  certification: 'Linux Professional Institute DevOps Tools Engineer',
  product: 'Vendor-neutral open source DevOps tooling',
  minutes: 90,
  questions: 60,
  scoring: 'Scaled score 200–800; 500 to pass.',
  price: 'US$200 (prices vary by country)',
  validityYears: 5,
};

export const DOMAINS = [
  {
    id: 1, weight: 33, weightRange: '33% (20 of 60)', title: 'Software Engineering', short: 'Software engineering',
    topics: [
      { id: '1.1', code: '701.1', verb: 'Explain', title: 'modern software development', sub: ['Service-based applications', 'API concepts and standards (REST, JSON)', 'Data storage, service status and session handling', 'Cloud native applications and design for containers and cloud', 'Migrating monolithic legacy software', 'Database schema updates and migrations', 'Agile and DevOps', 'SOA, microservices, immutable servers, loose coupling, test-driven development'] },
      { id: '1.2', code: '701.2', verb: 'Explain', title: 'standard components and platforms for software', sub: ['Object storage', 'Relational and NoSQL databases', 'Message brokers and queues', 'Big data services', 'IaaS, PaaS, SaaS and FaaS', 'Content delivery networks', 'Identity and access management in cloud services'] },
      { id: '1.3', code: '701.3', verb: 'Use', title: 'Git for source code management', keepCase: true, sub: ['Git concepts and repository structure', 'Manage files within a Git repository', 'Branches and tags', 'Remote repositories, remote branches and submodules', 'Merging and conflict resolution', 'SVN and CVS; centralized vs distributed SCM'] },
      { id: '1.4', code: '701.4', verb: 'Explain', title: 'continuous integration and continuous delivery', sub: ['CI and CD concepts', 'Pipeline components: builds, tests, artifact management, delivery and deployment', 'GitOps', 'Build artifacts and caches', 'Deployment best practices', 'Semantic versioning', 'Jenkins and GitLab CI', 'Artifactory and Nexus'] },
      { id: '1.5', code: '701.5', verb: 'Explain', title: 'software composition, licensing and open source', sub: ['Applications built from multiple components', 'Dependency managers (npm, Gradle, Composer)', 'Proprietary vs open source software', 'Open source licence concepts', 'GPL, LGPL, AGPL, BSD, MIT and Apache License', 'Licence compatibility and multi-licensing', 'Software bill of materials'] },
    ],
  },
  {
    id: 2, weight: 22, weightRange: '22% (13 of 60)', title: 'Application Container', short: 'Containers',
    topics: [
      { id: '2.1', code: '702.1', verb: 'Manage', title: 'application containers with Docker and Podman', keepCase: true, sub: ['Docker and Podman architecture', 'Images from an OCI registry', 'Operate and access containers', 'Docker networking, including overlay networks', 'DNS service discovery between containers', 'Docker storage and volumes', 'Rootless containers'] },
      { id: '2.2', code: '702.2', verb: 'Orchestrate', title: 'containers with Docker Compose', keepCase: true, sub: ['Docker Compose and Podman Compose application model', 'Compose files (version 3 or later)', 'Services, networks and volumes', 'Updating running containers to newer images'] },
      { id: '2.3', code: '702.3', verb: 'Build', title: 'container images', sub: ['Dockerfiles and Containerfiles', 'OCI image names', 'Pushing to a registry', 'Image scanners', 'Container security risks and mitigations', 'Buildx, BuildKit, Podman build and Buildah'] },
    ],
  },
  {
    id: 3, weight: 22, weightRange: '22% (13 of 60)', title: 'Kubernetes', short: 'Kubernetes',
    topics: [
      { id: '3.1', code: '703.1', verb: 'Use', title: 'Kubernetes architecture and kubectl', keepCase: true, sub: ['Cluster components (API server, etcd, controller manager, scheduler)', 'kubeconfig and contexts', 'Getting information with kubectl', 'Creating, modifying and deleting resources', 'Operators'] },
      { id: '3.2', code: '703.2', verb: 'Run', title: 'applications on Kubernetes', sub: ['YAML resource manifests', 'Pods', 'Deployments, ReplicaSets, scaling and rolling updates', 'Services and Ingress', 'PersistentVolumeClaims', 'ConfigMaps and Secrets', 'DaemonSets, StatefulSets, Jobs and CronJobs'] },
      { id: '3.3', code: '703.3', verb: 'Use', title: 'Helm for Kubernetes package management', keepCase: true, sub: ['Charts, releases and values', 'Install, upgrade and uninstall', 'Custom values', 'Kustomize', 'Flux CD and Argo CD'] },
    ],
  },
  {
    id: 4, weight: 23, weightRange: '23% (14 of 60)', title: 'Security and Observability', short: 'Security & observability',
    topics: [
      { id: '4.1', code: '704.1', verb: 'Explain', title: 'cloud native security', sub: ['Infrastructure risks and mitigations', 'Supply chain security', 'Application security risks (XSS, SQL injection, CSRF, CORS, buffer overflows)', 'CVE IDs and scores', 'Asymmetric cryptography, X.509 and TLS', 'SSO, OAuth2, OpenID Connect and SAML', 'MFA, OTP/TOTP, password hashing and salting'] },
      { id: '4.2', code: '704.2', verb: 'Monitor', title: 'services with Prometheus', keepCase: true, sub: ['Operations goals and service metrics', 'Prometheus architecture, exporters, Pushgateway, Alertmanager and Grafana', 'Set up Prometheus with file-based service discovery', 'Monitoring containers and microservices', 'PromQL: label selectors, instant and range vectors, aggregation', 'Node Exporter and Blackbox Exporter', 'Application instrumentation', 'Thanos'] },
      { id: '4.3', code: '704.3', verb: 'Manage', title: 'and analyze logs', sub: ['Application and system logging', 'syslogd and systemd-journald', 'Open source logging stacks: Elasticsearch/OpenSearch, Logstash, Filebeat, Fluentd, Fluent Bit, Kibana, Loki, Promtail, Grafana, Graylog'] },
      { id: '4.4', code: '704.4', verb: 'Explain', title: 'tracing with OpenTelemetry', keepCase: true, sub: ['Tracing concepts', 'OpenTelemetry architecture', 'Spans, traces, context, span and trace IDs', 'Span attributes, events, links, status and kind', 'Jaeger and Grafana Tempo', 'Application instrumentation'] },
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
