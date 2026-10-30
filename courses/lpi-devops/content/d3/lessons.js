// Domain 3 — Kubernetes (LPI 703.1-703.3). Original content for LPI DevOps Tools Engineer 701-200 v2.0.
export default [
  { id: '3.1-architecture-kubeconfig', topic: '3.1', title: 'Kubernetes Architecture, API Objects, kubeconfig and Contexts', minutes: 12, file: '3.1-architecture-kubeconfig.md',
    objectives: ['Name the control plane and node components and what each does', 'Explain why only the API server talks to etcd', 'Pick the right apiVersion for the common kinds', 'Read ~/.kube/config and switch contexts with kubectl config'] },
  { id: '3.1-kubectl-operators', topic: '3.1', title: 'Working with kubectl and Awareness of Operators', minutes: 14, file: '3.1-kubectl-operators.md',
    objectives: ['Use get, describe, logs, exec and explain to inspect a cluster', 'Create and change resources with create, apply, run, expose, scale, set and edit', 'Distinguish declarative apply from imperative create', 'Follow a basic troubleshooting order', 'Describe an Operator as a CRD plus a custom controller'] },
  { id: '3.2-manifests-pods-deployments', topic: '3.2', title: 'YAML Manifests, Pods, ReplicaSets, Deployments, Scaling and Rolling Updates', minutes: 15, file: '3.2-manifests-pods-deployments.md',
    objectives: ['Write the four top-level fields of a manifest', 'Describe what a Pod is and how probes and resources work', 'Match a Deployment selector to its template labels', 'Configure RollingUpdate with maxSurge and maxUnavailable', 'Roll out, watch, inspect and undo a Deployment'] },
  { id: '3.2-services-ingress', topic: '3.2', title: 'Services and Ingress', minutes: 12, file: '3.2-services-ingress.md',
    objectives: ['Explain how a Service selects Pods and why it has a stable address', 'Choose between ClusterIP, NodePort, LoadBalancer, ExternalName and headless Services', 'Distinguish port, targetPort and nodePort', 'Write an Ingress and explain why a controller is required'] },
  { id: '3.2-storage-config-workloads', topic: '3.2', title: 'PersistentVolumeClaims, ConfigMaps, Secrets, DaemonSets, StatefulSets, Jobs and CronJobs', minutes: 15, file: '3.2-storage-config-workloads.md',
    objectives: ['Request storage with a PVC and mount it in a Pod', 'Compare the PVC access modes', 'Inject ConfigMaps and Secrets as environment variables and files', 'Explain why base64 in a Secret is not encryption', 'Pick DaemonSet, StatefulSet, Job or CronJob for a workload'] },
  { id: '3.3-helm', topic: '3.3', title: 'Helm: Charts, Releases, Values, Install, Upgrade and Uninstall', minutes: 14, file: '3.3-helm.md',
    objectives: ['Define chart, release, values and repository', 'Install, list, upgrade, roll back and uninstall releases', 'Use helm upgrade --install', 'Override values with -f files and --set and know their precedence'] },
  { id: '3.3-kustomize-gitops', topic: '3.3', title: 'Kustomize, Flux CD and Argo CD', minutes: 11, file: '3.3-kustomize-gitops.md',
    objectives: ['Build a Kustomize base and overlay and apply it with kubectl apply -k', 'Contrast Kustomize with Helm', 'Explain pull-based GitOps and drift correction', 'Recognise Flux CD and Argo CD resources and roles'] },
];
