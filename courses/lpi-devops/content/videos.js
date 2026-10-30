// Curated free YouTube videos mapped to 701-200 topics (ids, durations and titles from yt-dlp flat search, 2026-10-30).
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel. Upload dates were not returned (upload_date NA in flat mode), so none are listed.
const RAW = [
  ["rv4LlmLmVWk", 1110, "Microservices explained - the What, Why and How?", "lecture", ['1.1'], false, "TechWorld with Nana"],
  ["CdBtNQZH8a4", 398, "What are Microservices?", "extra", ['1.1'], false, "IBM Technology"],
  ["lsMQRaeKNDk", 552, "What is a REST API?", "extra", ['1.1'], false, "IBM Technology"],
  ["8JJ101D3knE", 4153, "Git Tutorial for Beginners: Learn Git in 1 Hour", "lecture", ['1.3'], false, "Programming with Mosh"],
  ["mAFoROnOfHs", 4880, "Git & GitHub Crash Course for Beginners [2026]", "lecture", ['1.3'], false, "freeCodeCamp.org and logicBase Labs"],
  ["ddDJxFnv-qs", 293, "CI/CD Explained in 5 Minutes", "extra", ['1.4'], false, "TechWorld with Nana"],
  ["qP8kir2GUgo", 4140, "GitLab CI CD Tutorial for Beginners [Crash Course]", "lecture", ['1.4'], false, "TechWorld with Nana"],
  ["7KCS70sCoK0", 2106, "Complete Jenkins Pipeline Tutorial | Jenkinsfile explained", "lecture", ['1.4'], true, "TechWorld with Nana"],
  ["SX1VtT2rKs8", 666, "Every Open Source License Explained in 11 Minutes (MIT, GPL, Apache, AGPL)", "extra", ['1.5'], false, "Dots and Arrows"],
  ["pg19Z8LL06w", 4059, "Docker Crash Course for Absolute Beginners [NEW]", "lecture", ['2.1', '2.3'], false, "TechWorld with Nana"],
  ["5WML8gX2F1c", 446, "What is Podman? How is it Different Than Docker?", "extra", ['2.1'], false, "IBM Technology"],
  ["SXwC9fSwct8", 3794, "Ultimate Docker Compose Tutorial", "lecture", ['2.2'], false, "TechWorld with Nana"],
  ["8vXoMqWgbQQ", 1107, "Top 8 Docker Best Practices for using Docker in Production", "extra", ['2.3'], false, "TechWorld with Nana"],
  ["-IH5inFyEqU", 363, "Container Image Scanning with Trivy -- Ep. 1 Trivy Overview", "extra", ['2.3', '4.1'], false, "Aqua Security Open Source"],
  ["s_o8dwzRlu4", 4324, "Kubernetes Crash Course for Absolute Beginners [NEW]", "lecture", ['3.1', '3.2'], false, "TechWorld with Nana"],
  ["-ykwb1d0DXU", 856, "What is Helm in Kubernetes? Helm and Helm Charts explained | Kubernetes Tutorial 23", "lecture", ['3.3'], false, "TechWorld with Nana"],
  ["spCdNeNCuFU", 1486, "Kustomize: The Best Way to Manage Your Kubernetes Configs", "lecture", ['3.3'], false, "DevOps Journey"],
  ["MeU5_k9ssrs", 2873, "ArgoCD Tutorial for Beginners | GitOps CD for Kubernetes", "lecture", ['1.4', '3.3'], false, "TechWorld with Nana"],
  ["t18YB3xDfXI", 996, "An Illustrated Guide to OAuth and OpenID Connect", "lecture", ['4.1'], false, "OktaDev"],
  ["oSyEGkX6sX0", 225, "CVE and CVSS explained | Security Detail", "extra", ['4.1'], false, "Red Hat"],
  ["h4Sl21AKiDg", 1291, "How Prometheus Monitoring works | Prometheus Architecture explained", "lecture", ['4.2'], false, "TechWorld with Nana"],
  ["RC1ivt-ZN_U", 2591, "PromQL Tutorial: A COMPLETE Guide to Prometheus Queries", "lecture", ['4.2'], false, "Rayan Slim"],
  ["7uy_yovtyqw", 653, "Understanding Counter Rates and Increases in PromQL | Reset Handling, Extrapolation, Edge Cases", "extra", ['4.2'], false, "Prometheus Monitoring with Julius | PromLabs"],
  ["u3UNQUuCsxk", 1312, "Thanos Explained", "extra", ['4.2'], false, "That DevOps Guy"],
  ["TLnH7efQNd0", 494, "Intro to Logging | Zero to Hero: Loki | Grafana", "lecture", ['4.3'], false, "Grafana"],
  ["jT-y6oS10jk", 249, "What is the ELK Stack | ELK | Elasticsearch | Logstash | Kibana", "extra", ['4.3'], false, "CodeOps Trek"],
  ["LQOeaxfiAt8", 1198, "How Tracing works with OpenTelemetry", "lecture", ['4.4'], false, "That DevOps Guy"],
  ["KPGjqus5qFo", 232, "Spans vs. Traces in OpenTelemetry: Which is Which?", "extra", ['4.4'], false, "Adam Gardner"],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
