// Domain 2 — Application Container (LPI 702.1-702.3). Original questions for LPI DevOps Tools Engineer 701-200 v2.0.
const bank = [
  // ---------- 702.1 -> topic 2.1 ----------
  { topic: '2.1', type: 'single', difficulty: 1, lesson: '2.1-docker-podman-operate',
    stem: 'In Docker Engine, which component actually creates the namespaces and cgroups for a container?',
    options: ['The `docker` CLI', '`dockerd`', 'runc, the OCI runtime started via containerd', 'The registry'],
    answer: [2],
    explanation: 'dockerd hands lifecycle work to containerd, which starts a shim that runs **runc** to create the container. The CLI only sends API requests, dockerd manages images, networks and volumes, and a registry just stores images.' },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: '2.1-docker-podman-operate',
    stem: 'What is the main architectural difference between Podman and Docker Engine?',
    options: ['Podman cannot run OCI images', 'Podman has no long-running daemon; the podman command starts containers directly', 'Podman requires Kubernetes', 'Podman can only run as root'],
    answer: [1],
    explanation: 'Podman is daemonless (fork/exec with a conmon monitor per container). It runs OCI images, does not need Kubernetes, and is rootless by default for normal users.' },
  { topic: '2.1', type: 'fill', difficulty: 1, lesson: '2.1-docker-podman-operate',
    stem: 'Which `docker container run` option makes Docker delete the container automatically when it exits? (Type the long option.)',
    answer: ['--rm'],
    explanation: '`--rm` removes the container and its anonymous volumes when the main process exits, leaving no stopped containers behind.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-docker-podman-operate',
    stem: 'Refer to the exhibit. On the Docker host, which URL reaches the nginx server in the container?',
    exhibit: `$ docker container ls
CONTAINER ID   IMAGE        COMMAND                  STATUS         PORTS                  NAMES
3f1c9a7b2d10   nginx:1.27   "/docker-entrypoint.…"   Up 12 seconds  0.0.0.0:9090->80/tcp   web`,
    options: ['http://localhost:80', 'http://localhost:9090', 'http://localhost:8080', 'http://web:80 from the host'],
    answer: [1],
    explanation: 'The mapping is HOST:CONTAINER, so host port 9090 forwards to container port 80. Port 80 on the host is not published, 8080 does not appear, and the container name `web` is not resolvable from the host.' },
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: '2.1-docker-podman-operate',
    stem: 'Which two statements about `docker container stop web` are correct? (Choose two.)',
    options: ['It sends SIGTERM to the main process first', 'It sends SIGKILL immediately without warning', 'It sends SIGKILL if the process has not exited after the grace period (10 seconds by default)', 'It removes the container and its writable layer', 'It deletes all named volumes used by the container'],
    answer: [0, 2],
    explanation: 'stop is graceful: SIGTERM, then SIGKILL after the timeout. `docker container kill` is the immediate one. Neither stop nor kill removes the container (that is `rm`), and named volumes survive.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: '2.1-docker-podman-operate',
    stem: 'Type the full command that shows the layers of the local image `nginx:1.27` together with the instruction that created each layer, using the `docker image` management form.',
    answer: ['docker image history nginx:1.27', 'docker history nginx:1.27'],
    explanation: '`docker image history IMAGE` lists each layer, its creation instruction and size. The older shorthand `docker history` does the same.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'Refer to the exhibit. Both containers were started without `--network`. What is the most appropriate fix so that `app` can reach `db` by name?',
    exhibit: `$ docker container run -d --name db postgres:16
$ docker container run --rm --name app alpine:3.20 ping -c1 db
ping: bad address 'db'`,
    options: ['Publish the database with `-p 5432:5432`', 'Create a user-defined network and start both containers on it', 'Add `EXPOSE 5432` to the Postgres image', 'Use `--network none` for both'],
    answer: [1],
    explanation: 'The default bridge provides no DNS resolution of container names. A user-defined bridge has an embedded DNS server. Publishing a port is for outside access, EXPOSE is documentation only, and `none` removes networking altogether.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'What does Docker require before `docker network create -d overlay mesh` can succeed?',
    options: ['A macvlan parent interface', 'The host must be a swarm node (swarm mode initialised or joined)', 'Compose v2 must be installed', 'The Docker daemon must run rootless'],
    answer: [1],
    explanation: 'Overlay networks (VXLAN across hosts) depend on swarm mode, even on a single node. Macvlan is a different driver, Compose is unrelated, and rootless mode is not a prerequisite.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'Type the command that attaches the already running container `web` to the existing network `appnet`.',
    answer: ['docker network connect appnet web', 'docker network connect appnet web '],
    explanation: '`docker network connect NETWORK CONTAINER` adds a network to a running container; `disconnect` removes it. The network comes first, the container second.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'Inside a container on a user-defined bridge network, /etc/resolv.conf points to which address for Docker\'s embedded DNS server?',
    options: ['172.17.0.1', '127.0.0.11', '8.8.8.8', '224.0.0.251'],
    answer: [1],
    explanation: 'Docker\'s embedded DNS listens on 127.0.0.11 and resolves container names and network aliases, forwarding other queries to the host\'s resolvers. 172.17.0.1 is the usual docker0 gateway, 8.8.8.8 is a public resolver, and 224.0.0.251 is the mDNS multicast group.' },
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'Which two statements about named volumes are correct? (Choose two.)',
    options: ['They survive `docker container rm` of the container using them', 'An empty named volume mounted over a non-empty image directory is first populated with the image\'s files', 'They hide the image\'s content at the mount point just like a bind mount', 'They live only in host RAM', 'They require an absolute host path in the mount definition'],
    answer: [0, 1],
    explanation: 'Named volumes are managed by Docker and persist until removed; initial content is copied from the image. Bind mounts hide image content, tmpfs mounts live in RAM, and bind mounts (not named volumes) need a host path.' },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: '2.1-networking-storage-rootless',
    stem: 'Refer to the exhibit. Why does the second command fail?',
    exhibit: `$ docker container run --rm -v /srv/missing:/data alpine:3.20 ls /data
$ ls -d /srv/missing
/srv/missing
$ rmdir /srv/missing
$ docker container run --rm --mount type=bind,src=/srv/missing,dst=/data alpine:3.20 ls /data
docker: Error response from daemon: invalid mount config for type "bind": bind source path does not exist: /srv/missing`,
    options: ['Bind mounts are not allowed with Alpine images', '`--mount type=bind` never creates a missing host path, whereas `-v` creates it as a directory', 'The `dst` key must be spelled `target` only', 'Bind mounts require the `:ro` flag'],
    answer: [1],
    explanation: 'With `-v` Docker created `/srv/missing` on first use (the earlier `ls -d` shows it); after `rmdir`, `--mount` refuses instead. `dst` and `target` are synonyms, `:ro` is optional, and Alpine is irrelevant.' },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: '2.1-networking-storage-rootless',
    stem: 'What happens to data in a tmpfs mount when the container stops?',
    options: ['It is written to /var/lib/docker/volumes', 'It is lost; tmpfs data lives only in host memory', 'It is moved into the image', 'It is kept as an anonymous volume'],
    answer: [1],
    explanation: 'tmpfs mounts are memory-backed and never persisted, which makes them useful for sensitive scratch data. Volumes, not tmpfs, live under /var/lib/docker/volumes.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'In `docker container run -v dbdata:/data:___ alpine`, which option value mounts the volume read-only?',
    answer: ['ro', ':ro'],
    explanation: 'The third field of a `-v` specification holds options; `ro` makes the mount read-only (`rw` is the default).' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'Refer to the exhibit. What does the second line of the uid_map say about a rootless Podman container?',
    exhibit: `$ grep alice /etc/subuid
alice:100000:65536
$ podman unshare cat /proc/self/uid_map
         0       1000          1
         1     100000      65536`,
    options: ['Root (UID 0) in the container is mapped to the unprivileged host user with UID 1000', 'UID 0 in the container is real root on the host', 'Container UIDs 1 to 65536 map to host UIDs 1000 to 1001', 'The user namespace is disabled'],
    answer: [0],
    explanation: 'The first line maps container UID 0 to host UID 1000 (the invoking user); container UIDs 1-65536 map to host UIDs 100000-165535 from /etc/subuid. That is why container root has no host privileges.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-networking-storage-rootless',
    stem: 'A rootless Podman container fails to bind host port 80 with `-p 80:80`. What is the usual cause?',
    options: ['Podman does not support port publishing', 'Unprivileged users cannot bind ports below `net.ipv4.ip_unprivileged_port_start` (1024 by default)', 'Port 80 is reserved for Kubernetes', 'Rootless mode only works with host networking'],
    answer: [1],
    explanation: 'Linux restricts low ports to privileged users unless the sysctl is lowered. Rootless Podman publishes ports normally (for example 8080:80), and does not require host networking.' },
  { topic: '2.1', type: 'match', difficulty: 2, lesson: '2.1-docker-podman-operate',
    stem: 'Match each command with its effect.',
    pairs: [['docker container exec -it web sh', 'Starts a new shell process in the running container'], ['docker container logs web', 'Shows STDOUT and STDERR of the container\'s main process'], ['docker container kill web', 'Sends SIGKILL by default'], ['docker volume prune', 'Removes unused local volumes'], ['docker container port web', 'Lists published port mappings']],
    explanation: '`exec` creates an additional process, `logs` reads the main process output, `kill` is the abrupt counterpart of `stop`, `volume prune` deletes unused volumes, and `container port` prints the host-to-container mappings.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-docker-podman-operate',
    stem: 'Which statement about a Podman pod is correct?',
    options: ['Containers in a pod share a network namespace and can reach each other on localhost', 'A pod is a Docker Swarm service', 'Every container in a pod must use the same image', 'Pods require a root daemon'],
    answer: [0],
    explanation: 'Like a Kubernetes pod, a Podman pod groups containers that share network and IPC namespaces. Pods are unrelated to Swarm, can hold different images, and Podman has no daemon.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: '2.1-docker-podman-operate',
    stem: 'Refer to the exhibit. Why is the container not running?',
    exhibit: `$ docker container run -d --name app alpine:3.20
$ docker container ls -a
CONTAINER ID   IMAGE         COMMAND     CREATED         STATUS                     NAMES
8d2e41c0f7aa   alpine:3.20   "/bin/sh"   4 seconds ago   Exited (0) 3 seconds ago   app`,
    options: ['The image failed to pull', 'The default command /bin/sh has no terminal or long-running work and exits immediately', 'Docker killed it for lack of memory', 'The name `app` is reserved'],
    answer: [1],
    explanation: 'A container lives as long as its main process. Without `-it`, `/bin/sh` reads EOF and exits with code 0. The exit code 0 rules out a crash or OOM kill, and the image obviously exists.' },
  { topic: '2.1', type: 'order', difficulty: 1, lesson: '2.1-docker-podman-operate',
    stem: 'Put these commands into a sensible lifecycle order for trying an image.',
    items: ['docker image pull nginx:1.27', 'docker container run -d --name web nginx:1.27', 'docker container logs web', 'docker container stop web', 'docker container rm web'],
    explanation: 'Pull the image, run it, inspect its logs, stop it, then remove the stopped container.' },

  // ---------- 702.2 -> topic 2.2 ----------
  { topic: '2.2', type: 'single', difficulty: 1, lesson: '2.2-compose',
    stem: 'Refer to the exhibit. What does the warning mean for the Compose file?',
    exhibit: `$ docker compose up -d
WARN[0000] /home/dev/webshop/compose.yaml: the attribute \`version\` is obsolete, it will be ignored, please remove it to avoid potential confusion`,
    options: ['The file must be rewritten for Swarm', 'The top-level `version` key is no longer used by the Compose Specification and can simply be removed', 'Compose v1 is required', 'The services will not start until version is set to 3.8'],
    answer: [1],
    explanation: 'In the Compose Specification `version` is obsolete and informative only: Compose ignores it and warns. Nothing needs Swarm, v1, or a particular version number.' },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: '2.2-compose',
    stem: 'Type the command that creates and starts all services of the Compose project in the background.',
    answer: ['docker compose up -d', 'docker compose up --detach'],
    explanation: '`docker compose up` builds/creates/starts the services; `-d` (`--detach`) runs them in the background.' },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: '2.2-compose',
    stem: 'Refer to the exhibit. The web container often exits at first start with "connection refused" to the database, although `depends_on` is set. What fixes this properly?',
    exhibit: `services:
  web:
    image: registry.example.com/example/webshop:1.4.2
    depends_on:
      - db
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: example`,
    options: ['Rename the services alphabetically', 'Add a healthcheck to db and use `depends_on: db: condition: service_healthy` for web', 'Set `version: "3"` at the top', 'Replace depends_on with `links`'],
    answer: [1],
    explanation: 'The short `depends_on` only orders container start; Postgres is not yet accepting connections. A healthcheck plus `condition: service_healthy` makes Compose wait for readiness. Naming, the obsolete `version` key and legacy `links` do not add readiness waiting.' },
  { topic: '2.2', type: 'single', difficulty: 1, lesson: '2.2-compose',
    stem: 'In a default Compose project, how does the `web` service reach the service named `db`?',
    options: ['By the IP address 172.17.0.2 only', 'By the hostname `db` (service name) on the project network', 'Through `localhost` on port 5432', 'Only through a published host port'],
    answer: [1],
    explanation: 'Compose attaches services to a project network with embedded DNS, so service names resolve. `localhost` is the container itself, and no published port is needed.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: '2.2-compose',
    stem: 'What does `docker compose down` remove by default?',
    options: ['Containers and networks created by the project, but not named volumes', 'Containers, networks and named volumes', 'Only the containers', 'Images and volumes but not networks'],
    answer: [0],
    explanation: 'Containers and project networks are removed; named volumes are kept unless `-v` is given, and images are kept unless `--rmi` is given.' },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: '2.2-compose',
    stem: 'Which short option do you add to `docker compose down` to also delete the named volumes declared in the file?',
    answer: ['-v', '--volumes'],
    explanation: '`docker compose down -v` (`--volumes`) removes named volumes declared in the volumes section and anonymous volumes attached to containers.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: '2.2-compose',
    stem: 'What is the usual way to update a running Compose project to newer images of its services?',
    options: ['`docker compose pull`, then `docker compose up -d`', '`docker compose down -v`, then edit the volumes', '`docker image prune`, then `docker compose stop`', '`docker compose config`'],
    answer: [0],
    explanation: 'Pull new images, then `up -d` recreates only services whose image or configuration changed, keeping named volumes. The other choices delete data, remove unused images, or merely print the resolved file.' },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: '2.2-compose',
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `services:
  proxy:
    image: nginx:1.27
    networks: [front]
  web:
    image: registry.example.com/example/webshop:1.4.2
    networks: [front, back]
  db:
    image: postgres:16
    networks: [back]
networks:
  front:
  back:`,
    options: ['proxy can resolve and reach db by name', 'proxy can resolve web, but not db', 'db can resolve proxy', 'All three can reach each other because they share a project'],
    answer: [1],
    explanation: 'Name resolution and connectivity are per network. proxy and web share `front`; web and db share `back`; proxy and db share nothing, so they cannot see each other.' },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: '2.2-compose',
    stem: 'Which two are valid top-level elements of the Compose Specification? (Choose two.)',
    options: ['services', 'networks', 'containers', 'pods', 'images'],
    answer: [0, 1],
    explanation: 'The top-level elements are `name`, `services`, `networks`, `volumes`, `configs` and `secrets` (plus the obsolete `version`). `containers`, `pods` and `images` do not exist at top level.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: '2.2-compose',
    stem: 'What is `podman-compose`?',
    options: ['The Docker Compose plugin shipped inside Podman', 'A separate tool that reads Compose files and runs them with Podman', 'A Kubernetes operator', 'The Podman name for Docker Swarm'],
    answer: [1],
    explanation: 'podman-compose is an independent implementation (Python) that consumes the same compose file and drives Podman. It is not part of Docker, Kubernetes or Swarm.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: '2.2-compose',
    stem: 'Refer to the exhibit. After `docker compose down` followed by `docker compose up -d`, what happens to the database files?',
    exhibit: `services:
  db:
    image: postgres:16
    volumes:
      - dbdata:/var/lib/postgresql/data
volumes:
  dbdata:`,
    options: ['They are lost because the container was removed', 'They persist, because `down` keeps named volumes', 'They persist only if `container_name` is set', 'They are copied into the image'],
    answer: [1],
    explanation: '`dbdata` is a named volume; `down` without `-v` leaves it, and the recreated container remounts it. `container_name` is irrelevant and volumes are never written into the image.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: '2.2-compose',
    stem: 'You changed only the image tag of the `web` service in compose.yaml and ran `docker compose up -d`. What happens?',
    options: ['All services are recreated', 'Only `web` is recreated; unchanged services keep running', 'Nothing, because Compose ignores tag changes', 'The project is deleted and rebuilt from scratch'],
    answer: [1],
    explanation: 'Compose compares each service\'s configuration with the running container and recreates only the changed ones.' },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: '2.2-compose',
    stem: 'Type the command that downloads newer images for the services of a Compose project without recreating containers.',
    answer: ['docker compose pull'],
    explanation: '`docker compose pull` fetches the images referenced by the services; `docker compose up -d` afterwards applies them.' },

  // ---------- 702.3 -> topic 2.3 ----------
  { topic: '2.3', type: 'single', difficulty: 1, lesson: '2.3-dockerfiles',
    stem: 'Which statement about ENV and ARG in a Dockerfile is correct?',
    options: ['ARG values exist in the running container; ENV values do not', 'ENV values exist at runtime in the container; ARG values are build-time only', 'Both are only available during the build', 'ARG is the only way to pass secrets safely'],
    answer: [1],
    explanation: 'ENV persists into the image and container environment. ARG is set with `--build-arg` and only exists while building, but it still appears in `docker history`, so it is not safe for secrets.' },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: '2.3-dockerfiles',
    stem: 'Which Dockerfile instruction sets the directory in which later RUN, COPY and CMD instructions operate (and creates it if missing)?',
    answer: ['WORKDIR'],
    explanation: '`WORKDIR` sets and creates the working directory; it is preferable to `RUN cd ...`, which does not persist between instructions.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-dockerfiles',
    stem: 'Refer to the exhibit. The container runs, but `curl http://localhost:8080` on the host fails. Why?',
    exhibit: `FROM example/base:1.0
COPY . /app
EXPOSE 8080
CMD ["/app/server"]

$ docker container run -d --name shop example/webshop:1.4.2
$ curl http://localhost:8080
curl: (7) Failed to connect to localhost port 8080: Connection refused`,
    options: ['EXPOSE only documents the port; it must be published with -p 8080:8080', 'CMD must be in shell form to listen on a port', 'The image needs a VOLUME instruction', 'EXPOSE must come before COPY'],
    answer: [0],
    explanation: 'EXPOSE does not publish anything. Run with `-p 8080:8080` (or `-P`). CMD form, VOLUME and instruction order do not affect port publishing.' },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: '2.3-dockerfiles',
    stem: 'Refer to the exhibit. Which command line is executed in the container?',
    exhibit: `FROM alpine:3.20
ENTRYPOINT ["ping", "-c", "2"]
CMD ["192.0.2.1"]

$ docker container run --rm example/pinger:1.0 192.0.2.50`,
    options: ['ping -c 2 192.0.2.1', 'ping -c 2 192.0.2.50', '192.0.2.50', 'ping 192.0.2.50'],
    answer: [1],
    explanation: 'Arguments to `docker run` replace CMD but are appended to the exec-form ENTRYPOINT, giving `ping -c 2 192.0.2.50`. Without the argument the default CMD would give the first option.' },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: '2.3-dockerfiles',
    stem: 'Refer to the exhibit. `docker container stop app` always takes about 10 seconds. What is the likely cause?',
    exhibit: `FROM node:22-alpine
WORKDIR /app
COPY . .
CMD node server.js

$ docker container exec app ps
PID   USER     COMMAND
    1 root     /bin/sh -c node server.js
    7 root     node server.js`,
    options: ['The shell form makes /bin/sh PID 1, which does not forward SIGTERM to node, so Docker falls back to SIGKILL after the timeout', 'WORKDIR slows shutdown', 'node:22-alpine ignores SIGTERM by design', 'The container needs the `--init` image label'],
    answer: [0],
    explanation: 'The process list shows `sh -c` as PID 1 receiving SIGTERM. Using exec form (`CMD ["node","server.js"]`) makes node PID 1 and lets it handle the signal. WORKDIR and the base image are not the problem, and there is no such image label.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-dockerfiles',
    stem: 'What does ADD do that COPY does not?',
    options: ['It can copy files from the build context', 'It automatically extracts a local tar archive into the destination (and can fetch URLs)', 'It sets file ownership', 'It runs commands during the build'],
    answer: [1],
    explanation: 'Both copy from the context and COPY supports `--chown`; only ADD auto-extracts local tarballs and accepts URLs, which is why COPY is preferred. Running commands is RUN.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-dockerfiles',
    stem: 'What is the main benefit of a multi-stage build?',
    options: ['It builds images on several hosts simultaneously', 'The final image contains only what is copied from earlier stages, so compilers and sources stay out', 'It lets one image run several processes', 'It removes the need for a registry'],
    answer: [1],
    explanation: 'Each FROM starts a stage; `COPY --from=` brings only the artifacts into the final stage, giving smaller images with less attack surface. It has nothing to do with distributing builds, process models or registries.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-dockerfiles',
    stem: 'Refer to the exhibit. Every source change takes minutes because dependencies are reinstalled. What is the best fix?',
    exhibit: `FROM node:22-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]`,
    options: ['Copy only package.json and package-lock.json first, run `npm ci`, then `COPY . .`', 'Replace RUN with CMD', 'Use ADD instead of COPY', 'Add `EXPOSE 3000`'],
    answer: [0],
    explanation: 'Any change in the source invalidates the `COPY . .` layer and everything after it. Copying the manifests first keeps the dependency layer cached until they change. ADD, EXPOSE and CMD do not influence caching that way.' },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: '2.3-dockerfiles',
    stem: 'What is the name of the file in the build context root that lists paths to exclude from the context sent to the builder?',
    answer: ['.dockerignore'],
    explanation: '`.dockerignore` keeps `.git`, `node_modules`, logs and secrets out of the context and therefore out of `COPY . .`. Podman and Buildah also read `.containerignore`.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'Which fully qualified reference does `docker pull redis` use?',
    options: ['docker.io/library/redis:latest', 'docker.io/redis/redis:latest', 'registry.example.com/library/redis:stable', 'index.docker.io/redis:1.0'],
    answer: [0],
    explanation: 'Defaults are registry `docker.io`, namespace `library` for official images, and tag `latest`.' },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: '2.3-names-registries-security',
    stem: 'Type the command (two words) used to authenticate to a registry before pushing.',
    answer: ['docker login'],
    explanation: '`docker login [registry]` stores credentials (by default in ~/.docker/config.json or a credential helper). `docker logout` removes them.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'The local image `example/webshop:1.4.2` must be pushed to registry.example.com. Which sequence is correct?',
    options: ['`docker image tag example/webshop:1.4.2 registry.example.com/example/webshop:1.4.2`, then `docker image push registry.example.com/example/webshop:1.4.2`', '`docker image push example/webshop:1.4.2 registry.example.com`', '`docker login` only; push picks the registry automatically', '`docker image save` to the registry URL'],
    answer: [0],
    explanation: 'The registry host is part of the image name, so the image must carry a name with that prefix. Push has no separate registry argument, login alone does not select a target, and `save` writes a local tar file.' },
  { topic: '2.3', type: 'multi', difficulty: 1, lesson: '2.3-names-registries-security',
    stem: 'Which two tools are container image vulnerability scanners? (Choose two.)',
    options: ['Trivy', 'Grype', 'Buildah', 'runc', 'conmon'],
    answer: [0, 1],
    explanation: 'Trivy and Grype scan images for known CVEs (Docker Scout is another). Buildah builds images, runc is the OCI runtime and conmon monitors containers.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'Refer to the exhibit. Which statement is correct?',
    exhibit: `$ trivy image --severity HIGH,CRITICAL example/webshop:1.4.2
example/webshop:1.4.2 (alpine 3.19.1)
Total: 2 (HIGH: 1, CRITICAL: 1)
┌──────────┬───────────────┬──────────┬───────────────────┬───────────────┐
│ Library  │ Vulnerability │ Severity │ Installed Version │ Fixed Version │
├──────────┼───────────────┼──────────┼───────────────────┼───────────────┤
│ libcrypto3 │ CVE-2024-0001 │ CRITICAL │ 3.1.4-r2          │ 3.1.4-r5      │
│ zlib     │ CVE-2024-0002 │ HIGH     │ 1.3-r0            │ 1.3-r1        │
└──────────┴───────────────┴──────────┴───────────────────┴───────────────┘`,
    options: ['The scanner matched installed package versions against a vulnerability database and found fixed versions in newer packages', 'The scanner executed the application and observed the exploit', 'No vulnerabilities of LOW or MEDIUM severity can exist in the image', 'The image must be deleted from the registry'],
    answer: [0],
    explanation: 'Scanners compare an inventory of installed packages with vulnerability data and report fixed versions; rebuilding on a patched base resolves these findings. The scan does not run the app, LOW/MEDIUM issues were merely filtered out by `--severity`, and deletion is not the remedy. (Output is illustrative.)' },
  { topic: '2.3', type: 'multi', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'Refer to the exhibit. Which two options give an attacker the easiest path from the container to the host? (Choose two.)',
    exhibit: `docker container run -d --name shop \\
  --restart unless-stopped \\
  --privileged \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  registry.example.com/example/webshop:1.4.2`,
    options: ['`-d`', '`--restart unless-stopped`', '`--privileged`', '`-v /var/run/docker.sock:/var/run/docker.sock`'],
    answer: [2, 3],
    explanation: '`--privileged` gives all capabilities and device access; the Docker socket allows starting new containers with host mounts, i.e. root on the host. Detaching and the restart policy are harmless to isolation.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'What is the key capability that Docker Buildx adds on top of the classic `docker build` command?',
    options: ['Running containers rootless', 'Using BuildKit features such as multi-platform builds with `--platform` and cache export', 'Scanning images for CVEs', 'Replacing the registry'],
    answer: [1],
    explanation: 'Buildx is the CLI front end for BuildKit: multiple builders, `--platform linux/amd64,linux/arm64`, `--push`, cache import/export. It does not scan images, run containers or store images.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'Which description of Buildah is correct?',
    options: ['A daemon that Docker uses to run containers', 'A daemonless tool that builds OCI images, from a Containerfile or step by step with commands such as `buildah from`, `run` and `commit`', 'A vulnerability scanner', 'A Kubernetes package manager'],
    answer: [1],
    explanation: 'Buildah builds OCI images without a daemon and can work without a Dockerfile; `podman build` uses its library. It is neither a scanner nor a Kubernetes tool.' },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'Type the Docker Scout subcommand (the words after `docker scout`) that lists the CVEs found in an image.',
    answer: ['cves', 'docker scout cves'],
    explanation: '`docker scout cves IMAGE` lists known vulnerabilities; `docker scout quickview` gives a summary.' },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: '2.3-dockerfiles',
    stem: 'Refer to the exhibit. Why is passing the token this way a security problem?',
    exhibit: `ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > ~/.npmrc && npm ci

$ docker build --build-arg NPM_TOKEN=s3cr3t -t example/webshop:1.4.2 .`,
    options: ['ARG values are encrypted but cannot be decrypted at build time', 'The value remains recoverable from the image history and the written .npmrc remains in a layer', 'npm refuses tokens passed through ARG', 'It is not a problem because ARG is never stored'],
    answer: [1],
    explanation: 'Build args are recorded in the image history and the file written by RUN persists in its layer. Use a BuildKit secret mount (`RUN --mount=type=secret` with `docker build --secret`) instead.' },
  { topic: '2.3', type: 'match', difficulty: 2, lesson: '2.3-dockerfiles',
    stem: 'Match each Dockerfile instruction with its purpose.',
    pairs: [['FROM', 'Selects the base image and starts a build stage'], ['USER', 'Sets the user that later instructions and the container run as'], ['VOLUME', 'Declares a mount point for externally persisted data'], ['EXPOSE', 'Documents the port the application listens on'], ['ENTRYPOINT', 'Defines the executable that run arguments are appended to']],
    explanation: 'FROM begins a stage, USER switches away from root, VOLUME creates a declared mount point, EXPOSE documents a port without publishing it, and ENTRYPOINT fixes the executable.' },
  { topic: '2.3', type: 'order', difficulty: 2, lesson: '2.3-dockerfiles',
    stem: 'Put these Dockerfile lines in the most cache-friendly order for a Node.js app.',
    items: ['FROM node:22-alpine', 'WORKDIR /app', 'COPY package.json package-lock.json ./', 'RUN npm ci', 'COPY . .', 'CMD ["node", "server.js"]'],
    explanation: 'Stable instructions first, dependency manifests before the install, and the frequently changing source last so the install layer stays cached.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: '2.3-names-registries-security',
    stem: 'Which reference pins exactly the same image content on every pull?',
    options: ['example/webshop:latest', 'example/webshop:1.4', 'example/webshop@sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 'example/webshop'],
    answer: [2],
    explanation: 'A digest identifies content immutably. Tags (including `latest`, `1.4`, and the implicit latest) can be moved to a different image.' },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
