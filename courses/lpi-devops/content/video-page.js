// Copy and links for the Video Course page (course.js `videos.page`).
export default {
  intro: 'A curated set of free videos, each tagged with the 701-200 topics it supports. Tools move fast, so check commands against the lessons.',
  playlist: null,
  legacy: { label: 'Not on v2.0', title: 'Covers a topic removed in 701-200 v2.0 (e.g. Ansible, Vagrant) or an outdated tool version' },
  gaps: {
    title: 'Coverage gaps',
    intro: 'Free videos are thin on several objectives, so lean on the lessons and questions here:',
    note: 'Thin or missing: 1.2 (storage, databases, brokers, cloud service models, CDN, IAM), 1.5 (SBOM and licence compatibility), 2.1 (overlay networks, DNS discovery, rootless containers), 3.1 (Operators), 4.1 (X.509/TLS, MFA/TOTP, password hashing), 4.3 (syslog and journald) and 4.4 beyond the basics (Collector configuration, Jaeger and Tempo). Free videos on database schema migrations, immutable servers and Docker Compose updates are also scarce. Use the lessons and questions for these.',
  },
  resources: [
    { name: 'LPI 701 exam objectives (v2.0)', url: 'https://www.lpi.org/our-certifications/exam-701-objectives/', note: 'The official objectives this site is built on.' },
    { name: 'DevOps Tools Engineer overview', url: 'https://www.lpi.org/our-certifications/devops-overview/', note: 'Exam format, validity and booking.' },
    { name: 'Kubernetes documentation', url: 'https://kubernetes.io/docs/', note: 'Concepts and kubectl reference.' },
    { name: 'Docker documentation', url: 'https://docs.docker.com/', note: 'Engine, Compose and Dockerfile reference.' },
    { name: 'Prometheus documentation', url: 'https://prometheus.io/docs/', note: 'Configuration and PromQL.' },
    { name: 'OpenTelemetry documentation', url: 'https://opentelemetry.io/docs/', note: 'Tracing concepts and signals.' },
  ],
};
