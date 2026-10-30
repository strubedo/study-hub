// Domain 2 — Application Container (LPI 702.1-702.3). Original content for LPI DevOps Tools Engineer 701-200 v2.0.
export default [
  { id: '2.1-docker-podman-operate', topic: '2.1', title: 'Docker and Podman Architecture, Images and Operating Containers', minutes: 14, file: '2.1-docker-podman-operate.md',
    objectives: ['Contrast the dockerd/containerd/runc client-server design with daemonless Podman', 'Pull and inspect images from an OCI registry', 'Run containers with the key docker container run flags', 'List, exec into, log, stop and remove containers'] },
  { id: '2.1-networking-storage-rootless', topic: '2.1', title: 'Container Networks, DNS Discovery, Volumes and Rootless Containers', minutes: 15, file: '2.1-networking-storage-rootless.md',
    objectives: ['Choose between bridge, host, none and overlay networks', 'Explain DNS service discovery on user-defined networks', 'Pick a named volume, bind mount or tmpfs mount', 'Describe rootless containers and their limits'] },
  { id: '2.2-compose', topic: '2.2', title: 'Docker Compose: Application Model, Compose Files and Updates', minutes: 14, file: '2.2-compose.md',
    objectives: ['Write a Compose Specification file with services, networks and volumes', 'Use depends_on, healthchecks and restart policies correctly', 'Operate a project with docker compose up, down, ps, logs and pull', 'Update running services to newer images', 'Recognise podman-compose'] },
  { id: '2.3-dockerfiles', topic: '2.3', title: 'Writing Dockerfiles and Containerfiles, Multi-Stage Builds and .dockerignore', minutes: 16, file: '2.3-dockerfiles.md',
    objectives: ['Use every core Dockerfile instruction correctly', 'Contrast shell and exec forms and CMD with ENTRYPOINT', 'Order instructions for layer caching', 'Build lean images with multi-stage builds and a .dockerignore file'] },
  { id: '2.3-names-registries-security', topic: '2.3', title: 'OCI Image Names, Registries, Image Scanners, Container Security and Build Tools', minutes: 14, file: '2.3-names-registries-security.md',
    objectives: ['Decompose an OCI image reference and apply Docker Hub defaults', 'Log in, tag and push an image to a registry', 'Explain how image scanners work and name common ones', 'Apply container security mitigations', 'Place buildx, BuildKit, Podman build and Buildah'] },
];
