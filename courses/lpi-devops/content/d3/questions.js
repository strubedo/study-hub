// Domain 3 — Kubernetes (LPI 703.1-703.3). Original questions for LPI DevOps Tools Engineer 701-200 v2.0.
const bank = [
  // ---------- 703.1 -> topic 3.1 ----------
  { topic: '3.1', type: 'single', difficulty: 1, lesson: '3.1-architecture-kubeconfig',
    stem: 'Which Kubernetes component is the only one that reads from and writes to etcd directly?',
    options: ['kube-scheduler', 'kube-apiserver', 'kubelet', 'kube-proxy'],
    answer: [1],
    explanation: 'The API server persists all cluster state in etcd and is the single gateway to it. The scheduler, controllers, kubelets and kube-proxy all go through the API server. etcd is never contacted by them directly.' },
  { topic: '3.1', type: 'single', difficulty: 1, lesson: '3.1-architecture-kubeconfig',
    stem: 'A new Pod has been created and has no node assigned yet. Which component chooses the node for it?',
    options: ['kubelet', 'kube-controller-manager', 'kube-scheduler', 'kube-proxy'],
    answer: [2],
    explanation: 'The scheduler watches for unscheduled Pods and binds each to a node based on resources, affinity, taints and similar rules. The kubelet then starts the containers on that node; the controller manager runs reconcile loops such as the ReplicaSet controller; kube-proxy implements Service rules.' },
  { topic: '3.1', type: 'fill', difficulty: 1, lesson: '3.1-architecture-kubeconfig',
    stem: 'Type the default location of the kubectl configuration (kubeconfig) file for a user, using the tilde for the home directory.',
    answer: ['~/.kube/config', '$HOME/.kube/config', '.kube/config'],
    explanation: 'kubectl reads `~/.kube/config` unless the `KUBECONFIG` environment variable or `--kubeconfig` points elsewhere.' },
  { topic: '3.1', type: 'multi', difficulty: 1, lesson: '3.1-architecture-kubeconfig',
    stem: 'Which two components run on every worker node? (Choose two.)',
    options: ['kubelet', 'kube-proxy', 'etcd', 'kube-scheduler', 'kube-controller-manager'],
    answer: [0, 1],
    explanation: 'The kubelet runs the Pod containers through the container runtime and kube-proxy programs the Service rules. etcd, the scheduler and the controller manager are control plane components.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: '3.1-architecture-kubeconfig',
    stem: 'Refer to the exhibit. An administrator runs `kubectl get pods` without any extra options. Which namespace is queried?',
    exhibit: `$ kubectl config view --minify
apiVersion: v1
kind: Config
clusters:
- name: prod-cluster
  cluster:
    server: https://192.0.2.10:6443
contexts:
- name: dev-alice
  context:
    cluster: prod-cluster
    user: alice
    namespace: dev
current-context: dev-alice
users:
- name: alice
  user: {}`,
    options: ['default', 'dev', 'prod', 'kube-system'],
    answer: [1],
    explanation: 'The current context `dev-alice` sets `namespace: dev`, so unqualified commands use `dev`. `default` would apply only if the context had no namespace. The cluster name `prod-cluster` is unrelated to the namespace.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: '3.1-architecture-kubeconfig',
    stem: 'Type the complete command that makes the context named `prod-admin` the active context.',
    answer: ['kubectl config use-context prod-admin'],
    explanation: '`kubectl config use-context NAME` rewrites `current-context` in the kubeconfig. `set-context` would only create or edit a context, and `current-context` just prints the active one.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: '3.1-architecture-kubeconfig',
    stem: 'Which statement about container runtimes in current Kubernetes releases is correct?',
    options: ['The kubelet requires the Docker Engine daemon through the built-in dockershim', 'The kubelet uses any runtime implementing the Container Runtime Interface, such as containerd or CRI-O', 'The kube-apiserver starts the containers directly', 'etcd stores the container images'],
    answer: [1],
    explanation: 'dockershim was removed in Kubernetes 1.24; the kubelet talks CRI to containerd or CRI-O. Images built with Docker still run because they are OCI images. The API server only stores and serves objects and etcd stores object state, not images.' },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: '3.1-architecture-kubeconfig',
    stem: 'Match each Kubernetes component with its role.',
    pairs: [['kube-apiserver', 'REST front end that validates and persists every request'], ['etcd', 'Consistent key-value store holding cluster state'], ['kube-scheduler', 'Assigns unscheduled Pods to nodes'], ['kube-controller-manager', 'Runs reconcile loops such as the ReplicaSet and Node controllers'], ['kubelet', 'Starts the containers of Pods assigned to its node']],
    explanation: 'The API server is the gateway, etcd the datastore, the scheduler picks nodes, the controller manager drives actual state toward desired state, and the kubelet is the per-node agent.' },
  { topic: '3.1', type: 'single', difficulty: 1, lesson: '3.1-kubectl-operators',
    stem: 'What does `kubectl run web --image=nginx:1.27` create?',
    options: ['A Deployment with one replica', 'A single Pod', 'A Pod and a ClusterIP Service', 'A Job'],
    answer: [1],
    explanation: 'Since Kubernetes 1.18 `kubectl run` creates only a Pod. Use `kubectl create deployment` for a Deployment and `kubectl expose` for a Service.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: '3.1-kubectl-operators',
    stem: 'Refer to the exhibit. Which command displays the output of the container instance that crashed before the current one started?',
    exhibit: `$ kubectl get pods -n prod
NAME                  READY   STATUS             RESTARTS      AGE
web-6d8f9c7b5-8hq7z   1/1     Running            0             14m
web-6d8f9c7b5-x2k4p   0/1     CrashLoopBackOff   6 (45s ago)   14m`,
    options: ['kubectl logs web-6d8f9c7b5-x2k4p -n prod --previous', 'kubectl describe node web-6d8f9c7b5-x2k4p', 'kubectl explain pod.status', 'kubectl get pods -n prod -o wide'],
    answer: [0],
    explanation: '`kubectl logs --previous` prints the logs of the last terminated container instance, which holds the crash output. `describe node` takes a node name, `explain` documents API fields rather than runtime state, and `-o wide` only adds columns.' },
  { topic: '3.1', type: 'fill', difficulty: 1, lesson: '3.1-kubectl-operators',
    stem: 'Type the short kubectl flag (a single dash and one capital letter) that lists resources from all namespaces, as in `kubectl get pods <flag>`.',
    answer: ['-A'],
    explanation: '`-A` is the short form of `--all-namespaces`. Without it kubectl only queries the namespace of the current context.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: '3.1-kubectl-operators',
    stem: 'The Deployment `web` already exists in the cluster. What happens when an administrator runs `kubectl create -f web.yaml` with a manifest for that same Deployment?',
    options: ['The Deployment is updated to match the file', 'The command fails with an AlreadyExists error', 'The Deployment is deleted and recreated', 'A second Deployment named web-1 is created'],
    answer: [1],
    explanation: '`create` is imperative and refuses to create an object that exists. `kubectl apply -f` is the declarative command that creates or updates. Kubernetes never renames objects automatically and does not delete on create.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: '3.1-kubectl-operators',
    stem: 'Type the kubectl subcommand that prints built-in documentation for API fields, for example `kubectl ___ pod.spec.containers`.',
    answer: ['explain', 'kubectl explain'],
    explanation: '`kubectl explain TYPE.field.path` shows the schema description for that field; `--recursive` expands the whole tree.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: '3.1-kubectl-operators',
    stem: 'Refer to the exhibit. What is the cause of the problem?',
    exhibit: `$ kubectl describe pod web-7c5b8d94f-m2xzq
...
Status:       Pending
Containers:
  webshop:
    Image:    registry.example.com/example/webshop:1.4.9
    State:    Waiting
      Reason: ImagePullBackOff
Events:
  Type     Reason     Age   From               Message
  ----     ------     ----  ----               -------
  Normal   Scheduled  2m    default-scheduler  Successfully assigned prod/web-7c5b8d94f-m2xzq to node-b
  Normal   Pulling    75s   kubelet            Pulling image "registry.example.com/example/webshop:1.4.9"
  Warning  Failed     74s   kubelet            Failed to pull image "registry.example.com/example/webshop:1.4.9": manifest unknown
  Warning  Failed     74s   kubelet            Error: ErrImagePull`,
    options: ['No node has enough CPU to run the Pod', 'The image tag does not exist in the registry', 'The container exits immediately after starting', 'The readiness probe is failing'],
    answer: [1],
    explanation: 'The Pod was scheduled successfully, so resources are not the issue, and the container never started, so it cannot be crashing or failing probes. "manifest unknown" during the pull means the tag 1.4.9 is not in the registry (or the name is wrong).' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: '3.1-kubectl-operators',
    stem: 'In `kubectl exec -it web-6d8f9c7b5-x2k4p -- sh`, what is the purpose of `--`?',
    options: ['It selects the first container of the Pod', 'It separates kubectl options from the command to run in the container', 'It runs the command in all Pods of the Deployment', 'It disables the TTY'],
    answer: [1],
    explanation: 'Everything after `--` is the command and its arguments, so flags meant for the command are not parsed by kubectl. Container selection uses `-c`, and `-it` is what requests an interactive TTY.' },
  { topic: '3.1', type: 'single', difficulty: 1, lesson: '3.1-kubectl-operators',
    stem: 'Which description of a Kubernetes Operator is correct?',
    options: ['A person with cluster-admin rights', 'A CustomResourceDefinition plus a custom controller that automates running an application', 'A kubelet plugin that replaces kube-proxy', 'A Helm feature that stores release history'],
    answer: [1],
    explanation: 'An Operator extends the API with CRDs and runs a controller that reconciles real resources (Pods, Services, backups, upgrades) to match each custom resource. It is not a role, a kubelet plugin or a Helm feature.' },

  // ---------- 703.2 -> topic 3.2 ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Refer to the exhibit. What happens when this manifest is applied?',
    exhibit: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webshop
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: webshop
        image: registry.example.com/example/webshop:1.4.2`,
    options: ['The Deployment is created and three Pods labelled app=web run', 'The API server rejects it because the selector does not match the template labels', 'The Deployment is created but runs zero Pods', 'The selector is rewritten to app=web automatically'],
    answer: [1],
    explanation: 'In `apps/v1`, `spec.selector` must match `spec.template.metadata.labels`; validation fails otherwise. Kubernetes does not repair the mismatch or create a Deployment that cannot own its Pods.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: '3.2-manifests-pods-deployments',
    stem: 'Refer to the exhibit. During a rolling update, what is the maximum number of Pods that can exist at once?',
    exhibit: `spec:
  replicas: 8
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%`,
    options: ['8', '9', '10', '12'],
    answer: [2],
    explanation: '25% of 8 is 2 for maxSurge, so up to 8 + 2 = 10 Pods may exist. maxUnavailable (also 2) only lowers the minimum available count to 6; it does not reduce the maximum.' },
  { topic: '3.2', type: 'fill', difficulty: 1, lesson: '3.2-manifests-pods-deployments',
    stem: 'Type the apiVersion used for a Deployment manifest.',
    answer: ['apps/v1'],
    explanation: 'Deployments, ReplicaSets, StatefulSets and DaemonSets are in the `apps/v1` group. Pods and Services use `v1`, Jobs and CronJobs `batch/v1`, Ingress `networking.k8s.io/v1`.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Complete the command with the subcommand word that waits until a rollout has finished: `kubectl rollout ___ deployment/web`.',
    answer: ['status'],
    explanation: '`kubectl rollout status` blocks and reports progress until the rollout completes or fails. `history` lists revisions and `undo` reverts.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Which change to a Deployment causes a new ReplicaSet and a rolling update?',
    options: ['Changing `spec.replicas` from 3 to 5', 'Changing the container image in `spec.template.spec.containers`', 'Adding a label to the Deployment\'s own `metadata.labels`', 'Running `kubectl get deployment web -o yaml`'],
    answer: [1],
    explanation: 'Only a change to the Pod template triggers a new revision. Scaling changes the replica count of the current ReplicaSet, labels on the Deployment object do not affect Pods, and `get` is read-only.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Which command updates the container `webshop` of Deployment `web` to a new image so that a rolling update starts?',
    options: ['kubectl set image deployment/web webshop=registry.example.com/example/webshop:1.4.3', 'kubectl set image web registry.example.com/example/webshop:1.4.3', 'kubectl scale deployment/web --image=registry.example.com/example/webshop:1.4.3', 'kubectl expose deployment/web --image=registry.example.com/example/webshop:1.4.3'],
    answer: [0],
    explanation: '`kubectl set image TYPE/NAME CONTAINER=IMAGE`. The second form omits the resource type and container name; `scale` only changes replicas and `expose` creates a Service, and neither takes `--image` for this purpose.' },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Put the stages of a Deployment rolling update in the order in which they happen.',
    items: ['The Pod template changes, for example through kubectl set image', 'The Deployment controller creates a new ReplicaSet', 'New Pods are started within the maxSurge limit and become ready', 'Old Pods are removed within the maxUnavailable limit', 'The old ReplicaSet is kept at zero replicas for rollback'],
    explanation: 'A template change creates a new ReplicaSet, which is scaled up while the old one is scaled down in steps bounded by maxSurge and maxUnavailable. The emptied old ReplicaSet stays, up to revisionHistoryLimit, so `kubectl rollout undo` is possible.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Refer to the exhibit. Why is the Pod `web-6d8f9c7b5-x2k4p` receiving no Service traffic although its status is Running?',
    exhibit: `$ kubectl get pods -l app=webshop
NAME                  READY   STATUS    RESTARTS   AGE
web-6d8f9c7b5-8hq7z   1/1     Running   0          6m
web-6d8f9c7b5-x2k4p   0/1     Running   0          6m`,
    options: ['The Pod has not been scheduled to a node', 'Its readiness probe is failing, so it is removed from the Service endpoints', 'Its liveness probe failed and the Pod was deleted', 'The Service type must be changed to NodePort'],
    answer: [1],
    explanation: 'READY 0/1 with STATUS Running means the container is running but not passing its readiness check, so the endpoint controller leaves it out of the Service. A failing liveness probe would restart the container and raise RESTARTS. A Pod with a node and an age is scheduled, and the Service type is irrelevant to endpoint membership.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: '3.2-manifests-pods-deployments',
    stem: 'Which two things do the containers of one Pod share? (Choose two.)',
    options: ['The network namespace, so they reach each other on localhost', 'Volumes declared in the Pod spec', 'The root filesystem', 'Their CPU limits', 'The container image'],
    answer: [0, 1],
    explanation: 'Containers in a Pod share one IP/network namespace and may mount the same volumes. Each container has its own image and root filesystem, and requests and limits are set per container.' },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: '3.2-services-ingress',
    stem: 'Which Service type is used when `type` is omitted from the Service spec?',
    options: ['NodePort', 'LoadBalancer', 'ClusterIP', 'ExternalName'],
    answer: [2],
    explanation: 'ClusterIP is the default: a virtual IP reachable only inside the cluster.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: '3.2-services-ingress',
    stem: 'The default NodePort range is 30000 to which port number?',
    answer: ['32767'],
    explanation: 'NodePorts are allocated from 30000-32767 by default (changeable with the API server option `--service-node-port-range`).' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: '3.2-services-ingress',
    stem: 'Refer to the exhibit. Why does the Service `web` have no endpoints?',
    exhibit: `apiVersion: v1
kind: Service
metadata:
  name: web
  namespace: prod
spec:
  selector:
    app: webshop
  ports:
  - port: 80
    targetPort: 8080

$ kubectl get endpoints web -n prod
NAME   ENDPOINTS   AGE
web    <none>      4m

$ kubectl get pods -n prod --show-labels
NAME                  READY   STATUS    RESTARTS   AGE   LABELS
web-6d8f9c7b5-8hq7z   1/1     Running   0          9m    app=web-shop,pod-template-hash=6d8f9c7b5`,
    options: ['The Service type must be NodePort to have endpoints', 'The selector app=webshop matches no Pod because the Pods are labelled app=web-shop', 'targetPort must equal port', 'The Pods are in the wrong cluster'],
    answer: [1],
    explanation: 'Endpoints are built from Pods whose labels match the selector exactly; `webshop` and `web-shop` differ. The type has no effect on endpoints, `targetPort` may differ from `port`, and the Pod is in the same namespace of the same cluster.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-services-ingress',
    stem: 'What must exist in a cluster before an Ingress resource has any effect?',
    options: ['A LoadBalancer Service for every backend', 'An Ingress controller', 'A PersistentVolume', 'A DaemonSet named ingress'],
    answer: [1],
    explanation: 'An Ingress object is only a set of routing rules. An Ingress controller (NGINX-based, Traefik, HAProxy and others) watches those objects and configures a real proxy. Backends can be plain ClusterIP Services, and storage is irrelevant.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: '3.2-services-ingress',
    stem: 'Refer to the exhibit. A client sends a request for http://shop.example.com/api/v1/items. Which Service receives it?',
    exhibit: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webshop
spec:
  ingressClassName: nginx
  rules:
  - host: shop.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service: {name: web, port: {number: 80}}
      - path: /api
        pathType: Prefix
        backend:
          service: {name: api, port: {number: 80}}`,
    options: ['web, because it is listed first', 'api, because the longest matching prefix wins', 'Neither, because Prefix paths must end with a slash', 'Both, because the request is mirrored'],
    answer: [1],
    explanation: 'With several matching Prefix paths the longest match is used, so `/api` beats `/`. Order in the list does not decide, `/api` is a valid prefix, and Ingress does not mirror traffic.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-services-ingress',
    stem: 'What does a Service of type ExternalName with `externalName: db.example.com` do?',
    options: ['It opens a NodePort on every node that forwards to db.example.com', 'It makes cluster DNS answer with a CNAME to db.example.com, without proxying', 'It creates a cloud load balancer in front of db.example.com', 'It selects Pods whose label matches db.example.com'],
    answer: [1],
    explanation: 'ExternalName has no selector and no virtual IP; it only maps the Service name to a DNS CNAME. NodePorts, cloud load balancers and label selection belong to other types.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: '3.2-services-ingress',
    stem: 'Which two statements about a Service of type LoadBalancer are correct? (Choose two.)',
    options: ['It needs a cloud provider integration or an add-on such as MetalLB to obtain an external address', 'It also allocates a NodePort and a ClusterIP', 'It routes HTTP requests by host name and URL path', 'It works without a selector by returning a CNAME', 'Its external IP is always taken from the 30000-32767 range'],
    answer: [0, 1],
    explanation: 'LoadBalancer builds on NodePort and ClusterIP and relies on something to provision the external balancer. Host and path routing is Ingress behaviour, the CNAME is ExternalName, and 30000-32767 is the NodePort range, not an IP range.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-services-ingress',
    stem: 'Refer to the exhibit. A host outside the cluster must reach this Service. Which address does it use?',
    exhibit: `$ kubectl get svc web -n prod
NAME   TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
web    NodePort   10.96.44.120   <none>        80:31080/TCP   3m

$ kubectl get nodes -o wide
NAME     STATUS   ROLES           INTERNAL-IP
node-a   Ready    control-plane   192.0.2.11
node-b   Ready    <none>          192.0.2.12`,
    options: ['10.96.44.120:80', '192.0.2.12:31080', '192.0.2.12:80', '192.0.2.11:30000'],
    answer: [1],
    explanation: 'A NodePort Service listens on the nodePort (31080) on every node, so any node IP with that port works. The ClusterIP is internal, port 80 is not opened on the node, and 30000 is only the start of the range.' },
  { topic: '3.2', type: 'fill', difficulty: 1, lesson: '3.2-services-ingress',
    stem: 'Which Kubernetes resource kind does `kubectl expose deployment web --port=80` create? (Type the kind.)',
    answer: ['Service', 'svc'],
    explanation: '`kubectl expose` creates a Service whose selector is taken from the exposed Deployment.' },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: '3.2-storage-config-workloads',
    stem: 'Which PersistentVolumeClaim access mode allows read-write mounting by a single node?',
    options: ['ReadWriteOnce', 'ReadOnlyMany', 'ReadWriteMany', 'ReadAnyNode'],
    answer: [0],
    explanation: 'ReadWriteOnce (RWO) is read-write on one node. ReadOnlyMany is read-only on many nodes, ReadWriteMany is read-write on many nodes, and ReadAnyNode does not exist.' },
  { topic: '3.2', type: 'single', difficulty: 1, lesson: '3.2-storage-config-workloads',
    stem: 'A Secret contains `password: UzNjcmV0IQ==`. What does the base64 encoding provide?',
    options: ['Encryption that only the Pod can decrypt', 'A text-safe encoding of binary or arbitrary data, with no confidentiality', 'Automatic rotation of the value', 'Protection from kubectl get secret'],
    answer: [1],
    explanation: 'Base64 is an encoding that anyone can reverse with `base64 -d`. Confidentiality needs RBAC, encryption at rest for etcd, or an external secret store.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: '3.2-storage-config-workloads',
    stem: 'Which two measures actually improve the protection of Kubernetes Secrets? (Choose two.)',
    options: ['Restrict get/list access to Secrets with RBAC', 'Enable encryption at rest for Secrets in etcd', 'Store the value as base64 instead of plain text', 'Move the data into a ConfigMap', 'Commit the Secret manifest to a public repository'],
    answer: [0, 1],
    explanation: 'RBAC controls who can read the objects and encryption at rest protects etcd data and backups. Base64 is reversible, ConfigMaps are no more protected, and publishing the manifest exposes the value.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: '3.2-storage-config-workloads',
    stem: 'Refer to the exhibit. An administrator edits the ConfigMap and changes LOG_LEVEL from info to debug. What happens to the running Pod?',
    exhibit: `apiVersion: v1
kind: ConfigMap
metadata:
  name: webshop-config
data:
  LOG_LEVEL: info
---
# Pod template excerpt
    containers:
    - name: webshop
      image: registry.example.com/example/webshop:1.4.2
      envFrom:
      - configMapRef:
          name: webshop-config`,
    options: ['The environment variable changes immediately in the running container', 'The environment variable keeps the old value until the container is restarted', 'The Pod is deleted and recreated automatically', 'The API server rejects edits to a ConfigMap in use'],
    answer: [1],
    explanation: 'Environment variables are resolved when the container starts, so a restart (for example `kubectl rollout restart deployment/web`) is needed. Only ConfigMaps mounted as volumes are refreshed eventually. Kubernetes does not restart Pods on ConfigMap edits, and in-use ConfigMaps can be edited.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-storage-config-workloads',
    stem: 'Which workload resource ensures that one Pod runs on every node, for example a log collector?',
    options: ['Deployment with replicas equal to the node count', 'DaemonSet', 'StatefulSet', 'CronJob'],
    answer: [1],
    explanation: 'A DaemonSet places one Pod on each (matching) node and adds Pods to new nodes automatically. A Deployment does not guarantee one Pod per node, a StatefulSet provides stable identity, and a CronJob runs Jobs on a schedule.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-storage-config-workloads',
    stem: 'Refer to the exhibit. Which statement describes these Pods?',
    exhibit: `$ kubectl get pods -l app=db
NAME   READY   STATUS    RESTARTS   AGE
db-0   1/1     Running   0          10m
db-1   1/1     Running   0          9m
db-2   1/1     Running   0          8m

$ kubectl get pvc
NAME        STATUS   VOLUME      CAPACITY   ACCESS MODES
data-db-0   Bound    pvc-0a1b    10Gi       RWO
data-db-1   Bound    pvc-0a1c    10Gi       RWO
data-db-2   Bound    pvc-0a1d    10Gi       RWO`,
    options: ['They belong to a Deployment, because the Pods have a suffix', 'They belong to a StatefulSet, with ordinal names and one PVC per Pod from volumeClaimTemplates', 'They belong to a DaemonSet, because there is one per node', 'They belong to a CronJob'],
    answer: [1],
    explanation: 'Ordinal names `db-0`, `db-1`, ... and a separate claim per Pod are the signature of a StatefulSet with `volumeClaimTemplates`. Deployment Pods have random suffixes and share a template, DaemonSet Pods have random suffixes too, and CronJobs create Job Pods that complete.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: '3.2-storage-config-workloads',
    stem: 'Refer to the exhibit. When does this CronJob start a Job?',
    exhibit: `apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-report
spec:
  schedule: "30 1 * * 0"
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: report
            image: registry.example.com/example/webshop-report:1.4.2`,
    options: ['Every day at 01:30', 'Every Sunday at 01:30', 'Every 30 minutes during hour 1 on Sundays only if no Job runs', 'On the first day of every month at 01:30'],
    answer: [1],
    explanation: 'The cron fields are minute, hour, day of month, month, day of week: minute 30, hour 1, any day, any month, weekday 0 which is Sunday. `Forbid` skips a run while the previous Job is still running but does not change the time.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: '3.2-storage-config-workloads',
    stem: 'The Pod template of a Job must not use `restartPolicy: Always`. Type one of the two allowed values.',
    answer: ['OnFailure', 'Never'],
    explanation: 'A Job runs to completion, so its Pods must use `OnFailure` or `Never`. `Always` is the default for Pods in Deployments and is rejected for Jobs.' },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: '3.2-storage-config-workloads',
    stem: 'Match each workload resource with its typical use.',
    pairs: [['Deployment', 'Stateless application with scaling and rolling updates'], ['StatefulSet', 'Database nodes needing stable names and their own volumes'], ['DaemonSet', 'Node-level agent on every node'], ['Job', 'Batch task that runs to completion'], ['CronJob', 'Batch task started on a cron schedule']],
    explanation: 'Each controller encodes a different lifecycle: replicated stateless Pods, stable identity, per-node Pods, run-once tasks and scheduled tasks.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: '3.2-storage-config-workloads',
    stem: 'A Pod mounts a PersistentVolumeClaim and is then deleted by an administrator. What happens to the data on the volume?',
    options: ['It is deleted together with the Pod', 'It remains because the PVC (and its bound volume) continue to exist', 'It is moved to a ConfigMap', 'It is deleted if the access mode is ReadWriteOnce'],
    answer: [1],
    explanation: 'The claim is independent of the Pod, so data persists until the PVC is deleted (and then the PV reclaim policy decides). The access mode does not change that.' },

  // ---------- 703.3 -> topic 3.3 ----------
  { topic: '3.3', type: 'fill', difficulty: 1, lesson: '3.3-helm',
    stem: 'Complete the command that removes the release named `shop` and its resources: `helm ___ shop`.',
    answer: ['uninstall', 'un'],
    explanation: '`helm uninstall RELEASE` removes a release (`delete` survives as an alias in Helm 3). `install` and `upgrade` create or change it, and `rollback` returns to an older revision.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: '3.3-helm',
    stem: 'Which command installs the release if it does not exist and upgrades it if it does?',
    options: ['helm install --force shop example/webshop', 'helm upgrade --install shop example/webshop', 'helm rollback --install shop example/webshop', 'helm apply shop example/webshop'],
    answer: [1],
    explanation: '`helm upgrade --install` (`-i`) is the idempotent form used in pipelines. `install` fails if the name exists, `rollback` has no such flag and `helm apply` does not exist.' },
  { topic: '3.3', type: 'single', difficulty: 3, lesson: '3.3-helm',
    stem: 'Refer to the exhibit. How many replicas does the release run after this command?',
    exhibit: `# chart values.yaml        replicaCount: 2
# prod-values.yaml         replicaCount: 4

$ helm upgrade --install shop example/webshop \\
    -f prod-values.yaml --set replicaCount=3`,
    options: ['2', '3', '4', '7'],
    answer: [1],
    explanation: 'Precedence from lowest to highest: chart `values.yaml`, then `-f` files (left to right), then `--set`. The `--set` value 3 wins over 4 and the chart default 2.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: '3.3-helm',
    stem: 'Refer to the exhibit. After `helm rollback shop 1 -n prod` succeeds, what does `helm history` show?',
    exhibit: `$ helm history shop -n prod
REVISION  UPDATED                  STATUS      CHART          APP VERSION  DESCRIPTION
1         2026-10-30 09:01:40 UTC  superseded  webshop-0.3.0  1.4.1        Install complete
2         2026-10-30 09:14:02 UTC  deployed    webshop-0.3.1  1.4.2        Upgrade complete`,
    options: ['Revision 2 is deleted and revision 1 becomes deployed again', 'A new revision 3, deployed, with the chart and values of revision 1', 'The release is uninstalled', 'The command fails because revision 2 is the deployed one'],
    answer: [1],
    explanation: 'A rollback is recorded as a new revision whose content is copied from the target revision; history is not rewritten. Rolling back from the currently deployed revision is the normal use of the command.' },
  { topic: '3.3', type: 'fill', difficulty: 1, lesson: '3.3-helm',
    stem: 'Type the name of the file in a Helm chart that holds the default configuration values.',
    answer: ['values.yaml', 'values.yml'],
    explanation: '`values.yaml` supplies defaults for the templates; `-f` files and `--set` override them. `Chart.yaml` holds chart metadata.' },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: '3.3-helm',
    stem: 'Match each Helm command with its effect.',
    pairs: [['helm install shop example/webshop', 'Creates a new release named shop'], ['helm upgrade shop example/webshop', 'Moves an existing release to a new chart version or new values'], ['helm rollback shop 1', 'Returns the release to the content of revision 1 as a new revision'], ['helm list -n prod', 'Shows the releases in the prod namespace'], ['helm uninstall shop', 'Removes the release']],
    explanation: 'The commands cover the release lifecycle: install, upgrade, rollback, inspect with list and uninstall.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: '3.3-kustomize-gitops',
    stem: 'Type the single-letter kubectl option that applies a directory containing a kustomization.yaml: `kubectl apply -___ overlays/prod`.',
    answer: ['k', '-k'],
    explanation: '`kubectl apply -k DIR` renders the Kustomize overlay and applies the result. `-f` would treat the path as plain manifests.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: '3.3-kustomize-gitops',
    stem: 'Refer to the exhibit. The base defines a Deployment named `web`. What is created by `kubectl apply -k overlays/prod`?',
    exhibit: `# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: prod
namePrefix: prod-
resources:
- ../../base
images:
- name: registry.example.com/example/webshop
  newTag: 1.4.3`,
    options: ['A Deployment named web in the default namespace using the base image tag', 'A Deployment named prod-web in the prod namespace using image tag 1.4.3', 'A Deployment named prod-web, and the base files on disk are rewritten', 'Nothing, because Kustomize requires a template language'],
    answer: [1],
    explanation: 'The overlay layers a namespace, a name prefix and an image tag override over the unchanged base; the rendered output is what gets applied. Kustomize never edits the base files and has no templating at all.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: '3.3-kustomize-gitops',
    stem: 'Which description fits Flux CD and Argo CD?',
    options: ['Push-based CI tools that run kubectl from outside the cluster', 'GitOps controllers that run in the cluster, pull desired state from Git and reconcile it', 'Package formats that replace Helm charts', 'Container runtimes that replace containerd'],
    answer: [1],
    explanation: 'Both are in-cluster, pull-based GitOps tools that keep the cluster in sync with a Git repository and correct drift. They can deploy plain YAML, Kustomize and Helm; they are not CI pushers, package formats or runtimes.' },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));
