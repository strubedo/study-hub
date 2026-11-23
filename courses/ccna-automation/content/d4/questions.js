// Domain 4 — Application Deployment and Security. Original questions. Cloud models follow NIST SP 800-145; Dockerfile and docker CLI behaviour follows docs.docker.com (Dockerfile reference, best practices, build cache and build secrets pages, CLI reference); unittest and unittest.mock follow docs.python.org; Bash follows the GNU Bash manual; OWASP placement follows the OWASP Top 10:2025 and the OWASP cheat sheets; SameSite follows MDN; GitLab CI keywords follow docs.gitlab.com; DORA metrics follow dora.dev. Python, unittest, sqlite3 and Bash exhibits are real output (Python 3.14, Bash 5.3, GNU coreutils 9.10) with the user, host and paths replaced by alice, devbox and /home/alice. Docker exhibits are written in the documented output format, not captured.
const L41 = '4.1-edge-computing';
const L42 = '4.2-deployment-models';
const L43 = '4.3-deployment-types';
const L44 = '4.4-cicd-pipeline';
const L45 = '4.5-python-unit-tests';
const L46 = '4.6-dockerfile';
const L47 = '4.7-docker-images';
const L48 = '4.8-app-security';
const L49 = '4.9-network-app-components';
const L410 = '4.10-owasp-threats';
const L411 = '4.11-bash-commands';
const L412 = '4.12-devops-principles';

const DOCKERFILE_NETINV = `# syntax=docker/dockerfile:1
FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd --create-home appuser
USER appuser
EXPOSE 8000
ENTRYPOINT ["python", "app.py"]
CMD ["--port", "8000"]`;

const bank = [
  // ---------- 4.1 Edge computing ----------
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41,
    stem: 'A manufacturer has 40 high-resolution inspection cameras on each production line. A defective part must be rejected within 20 ms, and each plant has a single 50 Mbps WAN link. The team proposes running the image-analysis container on an industrial router at each plant instead of in a public cloud region. Which two benefits justify that design? (Choose two.)',
    options: [
      'Decisions are made on site without a round trip to a distant region, meeting the 20 ms requirement',
      'The plant can scale to thousands of CPUs on demand during peak production',
      'Only results and summaries cross the WAN instead of raw video, so the 50 Mbps link is not saturated',
      'The router no longer needs software updates because the application is containerised',
      'Edge deployment removes the need to secure the devices physically',
    ],
    answer: [0, 2],
    explanation: 'The two drivers in the scenario are **latency** (a 20 ms decision cannot wait for a WAN round trip to a cloud region) and **bandwidth** (40 raw video streams cannot fit through 50 Mbps, but defect counts and alerts can). Near-unlimited on-demand scaling is a public cloud attribute; an edge router has small, fixed resources. Containers still need patching and image updates, and edge sites make management harder, not unnecessary. Edge hardware sits in accessible places, so physical security matters more, not less.' },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L41,
    stem: 'Which statement describes Cisco IOx?',
    options: [
      'A cloud service that replaces IOS on Cisco routers with a Linux distribution',
      'A CI/CD server that builds container images for Cisco DevNet sandboxes',
      'A public cloud region operated by Cisco for running customer virtual machines',
      'An application hosting environment that runs IoT applications, including Docker-based ones, on supported Cisco network devices at the edge',
    ],
    answer: [3],
    explanation: 'Cisco\'s IOx documentation describes it as an application environment for executing IoT applications "in the fog" with secure connectivity to Cisco IOS, hosting Docker-based applications on Cisco gateways and routers, with lifecycle management and application signing. It runs alongside IOS rather than replacing it, it is not a build server, and it is not a public cloud: the point is running code on the network device at the site.' },

  // ---------- 4.2 Deployment models ----------
  { topic: '4.2', type: 'match', difficulty: 2, lesson: L42,
    stem: 'Match each scenario to the application deployment model it describes.',
    pairs: [
      ['A bank runs an OpenStack environment in its own data centres, used only by its own business units', 'Private cloud'],
      ['A startup rents VMs by the hour from a provider whose infrastructure is shared with many other customers', 'Public cloud'],
      ['A retailer keeps its payment database on premises and bursts its web tier into a provider\'s cloud during holiday peaks, with a VPN linking the two', 'Hybrid cloud'],
      ['Wind turbines analyse vibration data on a gateway inside each turbine and send only alerts to headquarters', 'Edge'],
    ],
    explanation: 'Exclusive use by one organisation is **private** cloud (NIST SP 800-145; it may be on or off premises). Open use on the provider\'s shared, metered infrastructure is **public** cloud. Two distinct infrastructures bound together so the application can move or burst between them is **hybrid** cloud, NIST\'s own example being "cloud bursting". Processing data where it is produced and sending only results upstream is **edge**.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42,
    stem: 'An organisation contracts a hosting company to run a cloud environment in the hosting company\'s data centre. The hardware and the self-service portal are dedicated to that organisation and no other customer uses them. According to NIST SP 800-145, which model is this?',
    options: [
      'Public cloud, because it is located on a third party\'s premises',
      'Hybrid cloud, because two organisations are involved',
      'Community cloud, because it is shared by the organisation and the hosting company',
      'Private cloud, because the infrastructure is provisioned for the exclusive use of one organisation',
    ],
    answer: [3],
    explanation: 'NIST defines a private cloud as infrastructure "provisioned for exclusive use by a single organization" that "may be owned, managed, and operated by the organization, a third party, or some combination of them, and it may exist on or off premises". Location and operator do not make it public; public cloud is for open use by the general public. Hybrid means two or more distinct cloud infrastructures bound together, not two companies. A community cloud serves several organisations with shared concerns; the hosting company is the operator, not a consumer.' },

  // ---------- 4.3 Deployment types ----------
  { topic: '4.3', type: 'match', difficulty: 2, lesson: L43,
    stem: 'Match each requirement to the deployment type that best fits it.',
    pairs: [
      ['A licensed database must use every core, all memory and the local NVMe drives of one server with no hypervisor overhead', 'Bare metal'],
      ['A Windows Server application and a Linux application must run on the same physical host, isolated from each other by their own kernels', 'Virtual machines'],
      ['A stateless API must start in under a second, run 40 replicas on one host and use the same image on laptops and in production', 'Containers'],
    ],
    explanation: 'Direct access to all hardware with no virtualisation layer is **bare metal**. Different operating systems on one host need separate kernels, which only **virtual machines** provide (containers share the host kernel, so a Linux host cannot run a Windows container). Fast start, high density and one portable image are the defining traits of **containers**.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43,
    stem: 'Refer to the exhibit. Which statement about this host is true?',
    exhibit: `+-------------+ +-------------+ +-------------+
| netinv      | | syslog-fwd  | | nginx       |
| python libs | | python libs | | nginx libs  |
+-------------+ +-------------+ +-------------+
|         Container engine (Docker)           |
+---------------------------------------------+
|     Host OS: Ubuntu Server (Linux kernel)   |
+---------------------------------------------+
|           Physical server hardware          |
+---------------------------------------------+`,
    options: [
      'Each of the three workloads boots its own Linux kernel, so a kernel bug in one cannot affect the others',
      'A Windows Server workload could be added to this host as a fourth container without a VM',
      'All three workloads share the host\'s Linux kernel, so the host kernel must be patched to protect all of them',
      'The container engine is a type 1 hypervisor that emulates hardware for each workload',
    ],
    answer: [2],
    explanation: 'Containers package an application and its libraries but **share the host kernel**; isolation comes from kernel namespaces and cgroups, so a kernel vulnerability affects every container and the host kernel is the thing to patch. Only VMs bring their own kernels. A Windows workload needs a Windows kernel, so it cannot run as a container on this Linux host. A container engine is not a hypervisor and emulates no hardware.' },

  // ---------- 4.4 CI/CD ----------
  { topic: '4.4', type: 'order', difficulty: 2, lesson: L44,
    stem: 'A team uses continuous delivery for its inventory API. Put the stages of one pipeline run in order, from the trigger to production.',
    items: [
      'A developer pushes a commit to the Git repository, which triggers the pipeline',
      'The CI runner runs linting and unit tests against the source code',
      'Only after the tests pass, the runner builds a container image tagged with the commit id',
      'The image is pushed to the artifact repository (container registry)',
      'The same image is deployed automatically to staging',
      'A release manager approves the production deployment, which deploys that same image',
    ],
    explanation: 'The push to source control triggers the run. Cheap checks (lint and unit tests) run first so a broken change fails fast, then the image is built and stored in the registry once, so that **the same artifact** is promoted to staging and then production. A manual approval before production is what makes this continuous **delivery**; without it, it would be continuous deployment.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. A commit passes every test. Which statement describes what happens and which practice the pipeline implements?',
    exhibit: `# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

unit-tests:
  stage: test
  image: python:3.14-slim
  script:
    - python -m unittest -v

build-image:
  stage: build
  script:
    - docker build -t registry.example.com/netops/netinv:$CI_COMMIT_SHORT_SHA .
    - docker push registry.example.com/netops/netinv:$CI_COMMIT_SHORT_SHA

deploy-staging:
  stage: deploy
  script:
    - ./deploy.sh staging $CI_COMMIT_SHORT_SHA

deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production $CI_COMMIT_SHORT_SHA
  when: manual`,
    options: [
      'The image is built, pushed and deployed to staging automatically; production waits for someone to start the manual job, so this is continuous delivery',
      'Every stage including production runs automatically, so this is continuous deployment',
      'Only the unit tests run, because jobs in later stages need a manual trigger, so this is continuous integration only',
      'Production is deployed first because both deploy jobs share a stage, so this is continuous deployment with staging as a fallback',
    ],
    answer: [0],
    explanation: 'GitLab runs stages in order, and jobs in the next stage start after the previous stage succeeds. With passing tests, `build-image` builds and pushes the image and `deploy-staging` runs automatically. `when: manual` adds `deploy-production` as a manual job that waits for a person: a manual production gate is **continuous delivery**. It would be continuous deployment only without that line. Only the job marked manual waits, not every later stage. Jobs in the same stage run in parallel, but the manual job still does not start on its own.' },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L44,
    stem: 'In a CI/CD pipeline, the unit-test stage fails for a commit. Which two outcomes are expected? (Choose two.)',
    options: [
      'The image is still pushed to the registry so that testers can inspect it',
      'Later stages such as building, publishing and deploying the artifact do not run for that commit',
      'The pipeline deletes the failing test so the next run passes',
      'The commit author is notified quickly so the change can be fixed while it is fresh',
      'The pipeline deploys the commit to production with the failing feature disabled',
    ],
    answer: [1, 3],
    explanation: 'A pipeline **fails fast**: a failed stage stops the stages after it, so nothing untested is published or deployed, and the fast feedback (pipeline status, notification) reaches the author while the change is fresh. Pushing an untested artifact defeats the purpose of the test gate. A pipeline never edits tests to make itself pass, and it does not deploy a failing commit.' },

  // ---------- 4.5 Python unit tests ----------
  { topic: '4.5', type: 'fill', difficulty: 2, lesson: L45,
    stem: 'Refer to the exhibit. `parse_vlan()` raises `ValueError` for IDs outside 1-4094, and the test passes. Enter the `TestCase` method name that belongs in the blank.',
    exhibit: `import unittest

from netutil import parse_vlan


class TestParseVlan(unittest.TestCase):
    def test_string_is_converted(self):
        self.assertEqual(parse_vlan("20"), 20)

    def test_out_of_range_raises(self):
        with self.______(ValueError):
            parse_vlan(4095)


alice@devbox:~/netlab$ python3 -m unittest test_parse
..
----------------------------------------------------------------------
Ran 2 tests in 0.000s

OK`,
    answer: ['assertRaises', 'self.assertRaises'],
    explanation: '`assertRaises(exception)` called with only the exception returns a **context manager**: the test passes if the code inside the `with` block raises that exception, fails if it raises nothing, and is an error if it raises something else. `assertRaisesRegex` would also need a regular expression argument, and `assertEqual` or `assertTrue` cannot be used as a context manager.' },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45,
    stem: 'Refer to the exhibit. Why does test_still_two pass even though test_append ran before it and added a device?',
    exhibit: `import unittest


class TestInventory(unittest.TestCase):
    def setUp(self):
        print("setUp")
        self.devices = ["sw01", "rtr01"]

    def tearDown(self):
        print("tearDown")

    def test_count(self):
        self.assertEqual(len(self.devices), 2)

    def test_append(self):
        self.devices.append("fw01")
        self.assertIn("fw01", self.devices)

    def test_still_two(self):
        self.assertEqual(len(self.devices), 2)


alice@devbox:~/netlab$ python3 -m unittest -v test_setup_count
test_append (test_setup_count.TestInventory.test_append) ... setUp
tearDown
ok
test_count (test_setup_count.TestInventory.test_count) ... setUp
tearDown
ok
test_still_two (test_setup_count.TestInventory.test_still_two) ... setUp
tearDown
ok

----------------------------------------------------------------------
Ran 3 tests in 0.000s

OK`,
    options: [
      'setUp runs once for the whole class, and tearDown removes the appended device',
      'setUp runs before every test method, so each test gets a new two-item list',
      'unittest runs test methods in the order they are written, so test_still_two ran first',
      'assertEqual compares the list as it was when the class was defined',
    ],
    answer: [1],
    explanation: 'The output shows `setUp` and `tearDown` printed once **per test**: the docs say `setUp()` is called immediately before calling each test method, so every test starts with a fresh `["sw01", "rtr01"]`. Once-per-class set-up is `setUpClass()`, and this `tearDown` only prints. Tests run sorted by method name (`test_append`, `test_count`, `test_still_two`), not in source order, so test_append did run first. `assertEqual` compares the current values.' },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45,
    stem: 'Refer to the exhibit. How many tests does the runner report?',
    exhibit: `import unittest


class TestVlan(unittest.TestCase):
    def test_vlan_valid(self):
        self.assertTrue(1 <= 20 <= 4094)

    def testVlanReserved(self):
        self.assertNotIn(20, range(1002, 1006))

    def check_vlan_name(self):
        self.assertEqual("USERS".lower(), "users")

    def vlan_test_range(self):
        self.assertEqual(len(range(1, 4095)), 4094)


alice@devbox:~/netlab$ python3 -m unittest test_names`,
    options: ['1', '2', '3', '4'],
    answer: [1],
    explanation: 'The loader runs methods whose names **start with** `test` (`testMethodPrefix`). `test_vlan_valid` and `testVlanReserved` both start with `test`, so the real run reports `Ran 2 tests` and `OK`. `check_vlan_name` does not start with `test`, and `vlan_test_range` only contains it, so neither runs. One would be the count if camelCase names were excluded, which they are not; three or four would count methods that are not tests.' },
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45,
    stem: 'Refer to the exhibit. Which statement correctly interprets the result?',
    exhibit: `alice@devbox:~/netlab$ python3 -m unittest test_mix
.FE.
======================================================================
ERROR: test_c_missing_file (test_mix.TestMix.test_c_missing_file)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/alice/netlab/test_mix.py", line 14, in test_c_missing_file
    load_inventory("missing.json")
    ~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^
  File "/home/alice/netlab/netutil.py", line 23, in load_inventory
    with open(path) as f:
         ~~~~^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: 'missing.json'

======================================================================
FAIL: test_b_slash_29 (test_mix.TestMix.test_b_slash_29)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/home/alice/netlab/test_mix.py", line 11, in test_b_slash_29
    self.assertEqual(usable_hosts("192.0.2.0/29"), 8)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: 6 != 8

----------------------------------------------------------------------
Ran 4 tests in 0.001s

FAILED (failures=1, errors=1)`,
    options: [
      'Two tests passed; test_b_slash_29 failed an assertion because usable_hosts returned 6, and test_c_missing_file raised an exception that no assertion expected',
      'Three tests failed and one passed, because both F and E count as failures and the final dot is a separator',
      'test_c_missing_file failed an assertion, and test_b_slash_29 hit an error in netutil.py',
      'The run stopped at the first failure, so the fourth test did not run',
    ],
    answer: [0],
    explanation: 'Each character is one test: `.` pass, `F` failure, `E` error. So two passed. A **failure** is an `assert*` check that did not hold (`AssertionError: 6 != 8`: the function returned 6, which is correct for a /29, so the test\'s expectation is wrong). An **error** is any other exception, here `FileNotFoundError` from opening a missing file. So test_c is the error and test_b the failure, not the other way round; the final dot is a passing test, not a separator; and unittest does not stop at the first failure: `Ran 4 tests`.' },
  { topic: '4.5', type: 'fill', difficulty: 1, lesson: L45,
    stem: 'Refer to the exhibit. Enter the module name that belongs in the blank so Python discovers and runs the tests in the current directory.',
    exhibit: `alice@devbox:~/netlab$ ls
netutil.py  test_netutil.py
alice@devbox:~/netlab$ python3 -m ______ -v
test_contains_both_devices (test_netutil.TestLoadInventory.test_contains_both_devices) ... ok
test_maps_hostname_to_ip (test_netutil.TestLoadInventory.test_maps_hostname_to_ip) ... ok
test_not_a_number_raises (test_netutil.TestParseVlan.test_not_a_number_raises) ... ok
test_out_of_range_raises (test_netutil.TestParseVlan.test_out_of_range_raises) ... ok
test_string_is_converted (test_netutil.TestParseVlan.test_string_is_converted) ... ok
test_point_to_point (test_netutil.TestUsableHosts.test_point_to_point) ... ok
test_slash_24 (test_netutil.TestUsableHosts.test_slash_24) ... ok

----------------------------------------------------------------------
Ran 7 tests in 0.001s

OK`,
    answer: ['unittest', 'unittest discover'],
    explanation: '`python -m unittest` with no test names is a shortcut for `python -m unittest discover`, which finds files matching `test*.py` in the current directory and runs every test in them; `-v` prints one line per test. The output format (`... ok`, `Ran 7 tests`, `OK`) is unittest\'s text runner. `unittest discover -v` would work too.' },
  { topic: '4.5', type: 'single', difficulty: 3, lesson: L45,
    stem: 'Refer to the exhibit. The test must not send a real HTTP request. Which value belongs in the blank of the @patch decorator?',
    exhibit: `# devices2.py
from requests import get


def get_hostnames(token):
    resp = get("https://api.example.com/api/v1/devices",
               headers={"Authorization": f"Bearer {token}"}, timeout=10)
    resp.raise_for_status()
    return [d["hostname"] for d in resp.json()]


# test_devices2.py
import unittest
from unittest.mock import patch

from devices2 import get_hostnames


class TestGetHostnames(unittest.TestCase):
    @patch(______)
    def test_returns_hostnames(self, mock_get):
        mock_get.return_value.json.return_value = [{"hostname": "sw01"}]
        self.assertEqual(get_hostnames("example-token-not-real"), ["sw01"])`,
    options: [
      '"requests.get"',
      '"devices2.requests.get"',
      '"devices2.get"',
      '"unittest.mock.get"',
    ],
    answer: [2],
    explanation: 'Patch **where the name is looked up**. `from requests import get` gives `devices2` its own name `get`, and `get_hostnames` looks up `devices2.get`, so that is the target (the real run passes). Patching `"requests.get"` replaces the attribute on the `requests` module, but `devices2.get` still points to the original function, so a real request would be sent. `"devices2.requests.get"` raises `AttributeError: module \'devices2\' has no attribute \'requests\'` because this module never imported `requests` itself. `unittest.mock` has no `get` to patch.' },

  // ---------- 4.6 Dockerfile ----------
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46,
    stem: 'Refer to the exhibit. The image is built as netinv:1.0 and started with `docker run netinv:1.0 --port 9000`. Which command does the container run?',
    exhibit: DOCKERFILE_NETINV,
    options: [
      '--port 9000, which fails because it is not an executable',
      'python app.py --port 8000 --port 9000',
      'python app.py --port 9000',
      '/bin/sh -c "python app.py" --port 9000',
    ],
    answer: [2],
    explanation: 'Arguments after the image name **replace `CMD`** and are **appended to an exec-form `ENTRYPOINT`**, so `["python", "app.py"]` plus `--port 9000` runs `python app.py --port 9000`. They would replace the whole command only if there were no `ENTRYPOINT`. `CMD` is not kept alongside the new arguments. No shell is involved, because both instructions use the exec (JSON array) form.' },
  { topic: '4.6', type: 'fill', difficulty: 2, lesson: L46,
    stem: 'Refer to the exhibit. Security policy says the application process must not run as root. Enter the Dockerfile instruction (keyword only) that belongs in the blank.',
    exhibit: `FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd --create-home appuser
______ appuser
EXPOSE 8000
CMD ["python", "app.py"]`,
    answer: ['USER'],
    explanation: '`USER appuser` sets the default user for the rest of the stage: later `RUN` instructions and the container\'s `CMD`/`ENTRYPOINT` run as `appuser` instead of root. It comes after the `RUN useradd` that creates the account. `WORKDIR` sets a directory, `ENV` sets a variable, and `RUN appuser` would try to execute a command called appuser at build time.' },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46,
    stem: 'Refer to the exhibit. A developer edits only app.py and rebuilds. Every build reinstalls all Python packages, which takes three minutes. What is the cause and the fix?',
    exhibit: `FROM python:3.14-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "app.py"]`,
    options: [
      'pip ignores the build cache; add --no-cache to docker build',
      'WORKDIR creates a new directory on every build; remove it and use absolute paths',
      'RUN instructions are never cached; replace RUN with CMD so the install happens when the container starts',
      'COPY . . includes app.py, so its layer and every later layer are rebuilt; copy requirements.txt and run pip install before copying the rest of the code',
    ],
    answer: [3],
    explanation: 'For `COPY`, the builder checks the copied files; changing `app.py` changes them, so that layer misses the cache, and once a layer is invalidated **all later layers are rebuilt**, including `pip install`. Copying `requirements.txt`, installing, and only then `COPY . .` keeps the install cached until the requirements change. `docker build --no-cache` disables the cache entirely, making it worse, and `pip --no-cache-dir` only controls pip\'s own download cache inside the layer. `WORKDIR` is cached like any instruction. `RUN` steps are cached; moving the install to `CMD` would reinstall on every container start.' },
  { topic: '4.6', type: 'multi', difficulty: 2, lesson: L46,
    stem: 'Refer to the exhibit. The image is named netinv:1.0, and the app listens on TCP 8000 inside the container. Which two statements are true? (Choose two.)',
    exhibit: DOCKERFILE_NETINV,
    options: [
      'EXPOSE 8000 documents the port the application listens on but does not make it reachable from the host',
      'Because of EXPOSE 8000, docker run netinv:1.0 makes the app reachable on host port 8000',
      'docker run -p 8080:8000 netinv:1.0 makes the app reachable on host port 8080',
      'docker run -p 8000:8080 netinv:1.0 makes the app reachable on host port 8000',
      'EXPOSE must be changed to EXPOSE 8080:8000 before the port can be published',
    ],
    answer: [0, 2],
    explanation: 'The Dockerfile reference says `EXPOSE` "doesn\'t actually publish the port"; it is documentation between the image builder and the person running it. Publishing is done with `-p HOST:CONTAINER`, so `-p 8080:8000` forwards host port 8080 to the app on 8000. `-p 8000:8080` would forward host 8000 to container port 8080, where nothing listens. A plain `docker run` publishes nothing, and `EXPOSE` takes only a container port (and protocol), never a host mapping.' },
  { topic: '4.6', type: 'single', difficulty: 3, lesson: L46,
    stem: 'Refer to the exhibit. The image is built with `docker build --build-arg API_TOKEN=example-token-not-real -t netinv:1.1 .` and pushed to a shared registry. Which statement is true?',
    exhibit: `FROM python:3.14-slim
ARG API_TOKEN
ENV API_TOKEN=$API_TOKEN
WORKDIR /app
COPY . .
CMD ["python", "app.py"]`,
    options: [
      'The token is safe because ARG values are discarded when the build finishes',
      'The token is stored in the image configuration, so anyone who can pull the image can read it, for example with docker image inspect',
      'The token is encrypted automatically when the image is pushed to a registry',
      'The token is only visible to the root user inside running containers',
    ],
    answer: [1],
    explanation: 'An `ARG` alone is not in the final container environment, but here its value is copied into an `ENV`, and `ENV` values persist in the image and every container (visible with `docker image inspect` or `docker inspect`, and as `env` inside the container). The Dockerfile reference also warns that build arguments appear in `docker history`. Registries do not encrypt image contents for you, and environment variables are readable by any process in the container, not just root. Use a build secret mount for build-time secrets and inject run-time secrets when the container starts.' },
  { topic: '4.6', type: 'single', difficulty: 2, lesson: L46,
    stem: 'Refer to the exhibit. netbox-plugins.tar.gz is a gzip-compressed tar archive in the build context. What does /opt/plugins contain in the built image?',
    exhibit: `FROM python:3.14-slim
WORKDIR /app
ADD netbox-plugins.tar.gz /opt/plugins/
COPY . .`,
    options: [
      'The extracted contents of the archive, because ADD unpacks local tar archives',
      'The file netbox-plugins.tar.gz, unchanged',
      'Nothing: ADD only accepts URLs, so the build fails',
      'An uncompressed netbox-plugins.tar file that still needs extracting',
    ],
    answer: [0],
    explanation: 'When the source of `ADD` is a **local** tar archive in a recognised format (identity, gzip, bzip2, xz), it is decompressed and **extracted** into the destination by default (`ADD --unpack=false` turns that off). To copy the archive as a file, use `COPY`; Docker\'s best-practices guide uses `COPY` for build-context files and `ADD` for its extra features, such as downloading a remote artifact. `ADD` accepts local files as well as URLs, and it does not stop half way at an uncompressed `.tar`.' },
  { topic: '4.6', type: 'single', difficulty: 3, lesson: L46,
    stem: 'A Dockerfile ends with `ENTRYPOINT python app.py`. Operators report that `docker stop` always takes about 10 seconds and the application never logs its graceful-shutdown message. Which change addresses this?',
    options: [
      'Add EXPOSE 8000 so Docker can reach the process',
      'Replace it with ENTRYPOINT ["python", "app.py"] so python runs as PID 1 and receives SIGTERM directly',
      'Add CMD ["--graceful"] so the shell-form ENTRYPOINT passes the flag to python',
      'Increase the timeout with docker stop -t 60',
    ],
    answer: [1],
    explanation: 'The shell form runs the command as a subcommand of `/bin/sh -c`, which the Dockerfile reference says "does not pass signals", so python never receives the `SIGTERM` from `docker stop` and is killed with `SIGKILL` after the default 10-second grace period. The exec form makes python PID 1, so the signal reaches it and its shutdown handler can run. `EXPOSE` is unrelated to signals. A shell-form `ENTRYPOINT` ignores `CMD` entirely. A longer timeout only makes the wait longer, because the signal still never arrives.' },

  // ---------- 4.7 Docker images ----------
  { topic: '4.7', type: 'order', difficulty: 2, lesson: L47,
    stem: 'An engineer builds the netinv image from the Dockerfile in the current directory, tests it locally on host port 8080, and only after the test passes gives the image its registry name and publishes it to the team registry. Put the commands in order.',
    items: [
      'docker build -t netinv:1.0 .',
      'docker run -d --name inv -p 8080:8000 netinv:1.0',
      'curl http://localhost:8080/',
      'docker tag netinv:1.0 registry.example.com/netops/netinv:1.0',
      'docker push registry.example.com/netops/netinv:1.0',
    ],
    explanation: 'The image must exist before a container can run from it, the container must be running before `curl` can test it, and the stem publishes only after the test. Pushing to a registry needs an image name that starts with the registry host, so `docker tag` adds that name before `docker push` uploads it (after `docker login` if the registry requires authentication).' },
  { topic: '4.7', type: 'fill', difficulty: 2, lesson: L47,
    stem: 'Refer to the exhibit. Enter the option and value that belong in the blank of the docker run command so the container is published as docker ps shows.',
    exhibit: `alice@devbox:~/netinv$ docker run -d --name inv ______ netinv:1.0
5c1d9e0a7b3f2e4d6c8a0b1f3e5d7c9a2b4f6e8d0c1a3b5d7f9e2c4a6b8d0f1e
alice@devbox:~/netinv$ docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED         STATUS         PORTS                    NAMES
5c1d9e0a7b3f   netinv:1.0   "python app.py --por…"   5 seconds ago   Up 4 seconds   0.0.0.0:8080->8000/tcp   inv`,
    answer: ['-p 8080:8000', '--publish 8080:8000', '--publish=8080:8000', '-p 8080:8000/tcp', '--publish 8080:8000/tcp', '-p 0.0.0.0:8080:8000', '--publish 0.0.0.0:8080:8000', '-p0.0.0.0:8080:8000', '-p8080:8000'],
    explanation: '`PORTS 0.0.0.0:8080->8000/tcp` reads host side first: host port 8080 on all interfaces forwards to container port 8000. `-p` (`--publish`) takes `HOST:CONTAINER`, so the value is `8080:8000`; with no address Docker binds all interfaces, shown as `0.0.0.0`. `-p 8000:8080` would be the reverse mapping, and `-P` would pick a random high host port.' },
  { topic: '4.7', type: 'single', difficulty: 2, lesson: L47,
    stem: 'Refer to the exhibit. The engineer runs `docker rmi netinv:latest`. What is the result?',
    exhibit: `alice@devbox:~/netinv$ docker images netinv
REPOSITORY   TAG      IMAGE ID       CREATED       SIZE
netinv       1.0      3f2a9c1d7b44   2 hours ago   152MB
netinv       latest   3f2a9c1d7b44   2 hours ago   152MB`,
    options: [
      'Both rows disappear, because they are the same image',
      'The command fails because latest is a reserved tag',
      'Only the latest tag is removed; the image remains available as netinv:1.0',
      'The image is deleted from the local host and from every registry it was pushed to',
    ],
    answer: [2],
    explanation: 'Both rows show the same IMAGE ID, so they are **one image with two tags** (`docker tag` adds names; it does not copy). The `docker image rm` reference: if an image has multiple tags, removing it by one tag removes only that tag; the image is deleted only when its last tag goes. `latest` is just the default tag name, not reserved. `docker rmi` works on the local host only and never deletes from a registry.' },
  { topic: '4.7', type: 'single', difficulty: 2, lesson: L47,
    stem: 'Refer to the exhibit. Which statement about the two containers is true?',
    exhibit: `docker run -d --name inv1 -v invdata:/app/data netinv:1.0
docker run -d --name inv2 -v "$(pwd)/configs:/app/configs:ro" netinv:1.0`,
    options: [
      'inv1 uses a named volume that Docker creates and manages, and inv2 bind-mounts the host\'s configs directory read-only',
      'Both containers use bind mounts; invdata is a directory under the current directory',
      'inv1 uses a bind mount and inv2 uses a named volume called configs',
      'Data written to /app/data in inv1 is lost when inv1 is removed, because volumes are deleted with the container',
    ],
    answer: [0],
    explanation: 'With `-v source:target`, a **name** as the source (`invdata`) means a **named volume**, created and managed by Docker (`docker volume ls`) and kept when the container is removed. A **path** as the source (`$(pwd)/configs`) means a **bind mount** of that host directory, and `:ro` makes it read-only inside the container. So inv1 is not a bind mount and inv2 is not a volume, and a named volume survives `docker rm` (only anonymous volumes are removed with `--rm` or `docker rm -v`).' },
  { topic: '4.7', type: 'single', difficulty: 2, lesson: L47,
    stem: 'Refer to the exhibit. The engineer cannot reach the application. What should they run next to find out why the container stopped?',
    exhibit: `alice@devbox:~/netinv$ docker run -d --name inv -p 8080:8000 netinv:1.0
9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d
alice@devbox:~/netinv$ docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
alice@devbox:~/netinv$ docker ps -a
CONTAINER ID   IMAGE        COMMAND                  CREATED          STATUS                      PORTS     NAMES
9e8d7c6b5a4f   netinv:1.0   "python app.py --por…"   20 seconds ago   Exited (1) 18 seconds ago             inv`,
    options: [
      'docker exec -it inv sh, to open a shell in the container',
      'docker logs inv, to read what the application printed before it exited',
      'docker rmi netinv:1.0, to force the image to be rebuilt',
      'docker run -d --name inv -p 8080:8000 netinv:1.0 again with a different name',
    ],
    answer: [1],
    explanation: 'The container started and exited with status 1 (an error), so it no longer appears in `docker ps` but does in `docker ps -a`. `docker logs` works on stopped containers and shows the stdout and stderr of the main process, typically the traceback that explains the exit. `docker exec` only works on a **running** container. Removing the image destroys evidence and needs the container removed first. Rerunning the same image would most likely fail the same way.' },
  { topic: '4.7', type: 'fill', difficulty: 2, lesson: L47,
    stem: 'Refer to the exhibit. Enter the docker subcommand that belongs in the blank to open an interactive shell inside the running container named inv.',
    exhibit: `alice@devbox:~/netinv$ docker ps --format "{{.Names}}: {{.Status}}"
inv: Up 3 minutes
alice@devbox:~/netinv$ docker ______ -it inv sh
$ whoami
appuser
$ echo $SITE
hq1
$ exit`,
    answer: ['exec', 'container exec'],
    explanation: '`docker exec` (also `docker container exec`) runs an **additional** command in a **running** container; `-it` keeps STDIN open and allocates a terminal for the interactive shell. `docker run` would create a new container from an image rather than enter `inv`, `docker attach` connects to the main process rather than starting a shell, and `docker start` only restarts a stopped container.' },
  { topic: '4.7', type: 'multi', difficulty: 2, lesson: L47,
    stem: 'Which two statements about Docker images and containers are true? (Choose two.)',
    options: [
      'Removing a container with docker rm also deletes the image it was created from',
      'Several containers can run from the same image at the same time',
      'The latest tag always refers to the most recently pushed version of a repository',
      'A tag such as 1.0 is immutable once pushed and can never point to different content',
      'Files a container writes outside any volume or bind mount are lost when the container is removed',
    ],
    answer: [1, 4],
    explanation: 'An image is a read-only template; each container adds its own thin **writable layer**, so many containers can run from one image, and that writable layer is deleted with the container (use a volume or bind mount for data that must survive). `docker rm` never removes the image. `latest` is only the default tag name and points to whatever was last tagged `latest`. Tags are mutable: pushing a new image under `1.0` moves the tag, which is why deployments pin a digest or never reuse tags.' },

  // ---------- 4.8 Application security ----------
  { topic: '4.8', type: 'single', difficulty: 2, lesson: L48,
    stem: 'Refer to the exhibit. An hour after this push, the engineer notices the repository is public. What must be done first?',
    exhibit: `alice@devbox:~/netauto$ git show --stat --abbrev-commit --decorate HEAD
commit dc6d646 (HEAD -> main, origin/main)
Author: alice <alice@example.com>
Date:   Sun Nov 22 13:20:00 2026 +0000

    Add Meraki inventory script

 inventory.py | 13 +++++++++++++
 1 file changed, 13 insertions(+)
alice@devbox:~/netauto$ grep -n API_KEY inventory.py
5:API_KEY = "example-token-not-real"   # real key was here
10:                     headers={"Authorization": f"Bearer {API_KEY}"},`,
    options: [
      'Make the repository private',
      'Delete the line, commit and push again',
      'Revoke or regenerate the API key in the Meraki dashboard, then update the script to read the new key from an environment variable or secret manager',
      'Run git rm --cached inventory.py and add it to .gitignore',
    ],
    answer: [2],
    explanation: 'Once a secret has been pushed to a public repository, assume it has been copied: the only step that stops misuse is to **revoke or rotate** it at the issuer, and the replacement must come from the environment or a secret manager, not the code. Making the repository private or deleting the line does not remove the key from clones, forks or Git history. `git rm --cached` stops tracking the file going forward but leaves the committed key in history and breaks the project.' },
  { topic: '4.8', type: 'match', difficulty: 2, lesson: L48,
    stem: 'Match each finding from a security review to the control that addresses it.',
    pairs: [
      ['A script calls the inventory API over http:// across the WAN', 'Encryption in transit with TLS (HTTPS) and certificate validation'],
      ['A laptop holding exported device configs and credentials could be stolen', 'Encryption at rest (full-disk encryption)'],
      ['The web portal stores user passwords with reversible AES encryption', 'Salted slow hashing such as Argon2id or bcrypt'],
      ['The CI pipeline file contains the registry password in plain text', 'Protected CI secret variables or a secret manager injected at run time'],
      ['Debug logs record full request headers, including Authorization', 'Redact secrets and sensitive data before logging'],
    ],
    explanation: 'Plain HTTP exposes tokens and data on the wire, so the fix is **TLS** with certificate checks. A stolen device is a data-at-rest problem: **disk encryption** with managed keys. Passwords must be **hashed** with a salted slow algorithm (OWASP recommends Argon2id), because encryption is reversible. Credentials in a committed pipeline file belong in **CI secret variables or a secret manager**. Logging headers leaks the `Authorization` value, so logs must **redact** secrets and minimise sensitive data.' },
  { topic: '4.8', type: 'single', difficulty: 2, lesson: L48,
    stem: 'A developer adds .env to .gitignore after .env has already been committed and pushed. What is the effect?',
    options: [
      'Git removes .env from the repository history automatically',
      'The remote repository deletes .env on the next push',
      'Git encrypts .env in future commits',
      'Git keeps tracking .env and the committed contents stay in history; the file must be untracked with git rm --cached and the secrets in it rotated',
    ],
    answer: [3],
    explanation: '`.gitignore` only prevents **untracked** files from being added. A file that is already tracked stays tracked, and its committed contents remain in every earlier commit. Untrack it with `git rm --cached .env`, commit, and treat the secrets as leaked (rotate them). Git never rewrites history, deletes files on the remote or encrypts files because of `.gitignore`.' },

  // ---------- 4.9 Firewalls, DNS, load balancers, reverse proxy ----------
  { topic: '4.9', type: 'single', difficulty: 2, lesson: L49,
    stem: 'Refer to the exhibit. web2 stops answering GET /health with 200. What happens to new client requests?',
    exhibit: `Client --DNS: inv.example.com A 198.51.100.10 (TTL 300)
   |
[Firewall] permit tcp any -> 198.51.100.10 eq 443
   |
[Load balancer] VIP 198.51.100.10:443, TLS terminated
   method: round robin
   health check: GET /health every 5 s, 3 failures = down
   |
   +-- web1 10.0.20.11:8000   UP
   +-- web2 10.0.20.12:8000   (checks failing)
   +-- web3 10.0.20.13:8000   UP`,
    options: [
      'After three failed checks the load balancer marks web2 down and sends new requests only to web1 and web3',
      'Clients receive web2\'s address from DNS and fail until the TTL expires',
      'The firewall detects the failure and blocks traffic to the VIP',
      'Round robin keeps sending one third of requests to web2 until an administrator removes it',
    ],
    answer: [0],
    explanation: 'Health checks are how a load balancer removes failed pool members: after the configured number of failures (here three checks, about 15 seconds) web2 is marked down and receives no new requests, and it is returned to the pool when checks pass again. Here DNS points at the **VIP**, not at the individual servers, so DNS is unaffected. The firewall only permits or denies flows to the VIP. Round robin chooses among **healthy** members.' },
  { topic: '4.9', type: 'single', difficulty: 2, lesson: L49,
    stem: 'An application behind an nginx reverse proxy logs every request as coming from 10.0.10.5, the proxy\'s inside address. The team needs the real client address for auditing. What is the standard approach?',
    options: [
      'Have the proxy add the client address in an X-Forwarded-For header and have the application read the address added by the trusted proxy',
      'Move the application\'s TLS certificate from the proxy to the client',
      'Configure DNS to return the application server\'s address instead of the proxy\'s',
      'Ask clients to send their own IP address in X-Forwarded-For and trust whatever they send',
    ],
    answer: [0],
    explanation: 'A reverse proxy opens its own connection to the backend, so the backend sees the proxy as the source. The proxy passes the original address in `X-Forwarded-For` (in nginx, `$proxy_add_x_forwarded_for` appends the client address), and the leftmost entry is the original client. MDN warns to trust only addresses added by proxies you control, so blindly trusting client-supplied values is wrong. Moving certificates has nothing to do with source addresses, and bypassing the proxy with DNS would remove its protection and TLS termination.' },
  { topic: '4.9', type: 'match', difficulty: 2, lesson: L49,
    stem: 'Match each deployment requirement to the component that provides it.',
    pairs: [
      ['Users must keep using inv.example.com while the service moves to a new data centre with new addresses', 'DNS'],
      ['From the internet, only TCP 443 to the DMZ address may be allowed; everything else must be dropped', 'Firewall'],
      ['Requests must be spread across three identical app servers, skipping any server that fails a health check', 'Load balancer'],
      ['Clients must connect to one public server that terminates TLS and fetches responses from hidden internal web servers', 'Reverse proxy'],
      ['Employees\' browsers must reach external websites only through a filtering server that logs their access', 'Forward proxy'],
    ],
    explanation: 'A stable name for changing addresses is **DNS**. Permitting only specific ports and zones is a **firewall** policy. Distributing across a pool with health checks is a **load balancer**. A server that acts on behalf of **servers**, terminating TLS and hiding the backends, is a **reverse proxy**. A server that acts on behalf of **clients** for outbound access is a **forward proxy**.' },

  // ---------- 4.10 OWASP ----------
  { topic: '4.10', type: 'single', difficulty: 2, lesson: L410,
    stem: 'Refer to the exhibit. A user enters the hostname shown. Which vulnerability does this demonstrate and what is the recommended fix?',
    exhibit: `>>> name = "nosuch' OR '1'='1"
>>> query = f"SELECT hostname, mgmt_ip FROM devices WHERE hostname = '{name}'"
>>> print(query)
SELECT hostname, mgmt_ip FROM devices WHERE hostname = 'nosuch' OR '1'='1'
>>> cur.execute(query).fetchall()
[('sw01', '10.10.20.11'), ('rtr01', '10.10.20.1'), ('fw01', '10.10.20.254')]`,
    options: [
      'Cross-site scripting; HTML-encode the hostname before running the query',
      'SQL injection; pass the value as a bound parameter, for example cur.execute("... WHERE hostname = ?", (name,))',
      'SQL injection; remove single quotes from the input with name.replace("\'", "")',
      'CSRF; add an anti-CSRF token to the search form',
    ],
    answer: [1],
    explanation: 'The input closed the string literal and added `OR \'1\'=\'1\'`, changing the **structure** of the SQL so every row matched: **SQL injection** (OWASP A05:2025 Injection). The OWASP cheat sheet\'s primary defence is **parameterised queries**: the SQL text is fixed and the driver sends the value separately (`sqlite3` uses `?`); with the same input the real query returns `[]`. Stripping quotes is manual escaping, which OWASP calls error-prone and strongly discouraged. HTML encoding protects browsers, not databases, and CSRF tokens address forged requests, not injected input.' },
  { topic: '4.10', type: 'fill', difficulty: 2, lesson: L410,
    stem: 'Refer to the exhibit. The query uses the standard library sqlite3 module and must be safe against SQL injection. Enter the placeholder that belongs in the blank.',
    exhibit: `>>> import sqlite3
>>> sqlite3.paramstyle
'qmark'
>>> cur.execute("SELECT hostname, mgmt_ip FROM devices WHERE hostname = ______", (name,)).fetchall()
[('sw01', '10.10.20.11')]`,
    answer: ['?'],
    explanation: '`sqlite3` uses the **qmark** parameter style: a `?` in the SQL text for each value, with the values passed as a sequence in the second argument. The driver binds the value as data, so input such as `nosuch\' OR \'1\'=\'1` is just a hostname that does not match. `%s` is the style of drivers such as psycopg, not sqlite3, and putting quotes around `?` would make it a literal string.' },
  { topic: '4.10', type: 'match', difficulty: 2, lesson: L410,
    stem: 'Match each attack scenario to the threat it describes.',
    pairs: [
      ['An attacker saves <script> in a device\'s location field, and it runs in the browser of every admin who opens the inventory page', 'Stored XSS'],
      ['A phishing link carries <script> in the q= parameter, and the search page echoes it back unencoded to whoever clicks', 'Reflected XSS'],
      ['The page\'s own JavaScript reads location.hash and inserts it with innerHTML, without the server ever seeing the payload', 'DOM-based XSS'],
      ['A page on another site silently submits a POST to /devices/sw01/delete while the victim is logged in to the inventory app', 'CSRF'],
      ['Entering admin\'-- in a login form comments out the password check in the query', 'SQL injection'],
    ],
    explanation: 'XSS types differ in where the payload lives: **stored** on the server and served to every viewer, **reflected** from the request back in the response, or handled entirely by client-side code (**DOM-based**). A forged state-changing request riding on the victim\'s logged-in session cookies is **CSRF**. Input that rewrites a database query is **SQL injection**.' },
  { topic: '4.10', type: 'multi', difficulty: 2, lesson: L410,
    stem: 'A cookie-authenticated web application lets logged-in users delete devices with a POST request. Which two controls defend against CSRF? (Choose two.)',
    options: [
      'Use parameterised queries for every database call',
      'Include an unpredictable anti-CSRF token in each form and reject state-changing requests without the correct token',
      'HTML-encode all user input before displaying it',
      'Change the delete action from POST to GET',
      'Set the session cookie with SameSite=Strict or SameSite=Lax',
    ],
    answer: [1, 4],
    explanation: 'CSRF works because the browser attaches the session cookie to a request started by another site. An **anti-CSRF token** the attacker\'s page cannot read lets the server reject forged requests, and **SameSite** cookies stop the browser from sending the session cookie on cross-site POSTs (OWASP treats SameSite as defence in depth alongside tokens). Parameterised queries prevent SQL injection and output encoding prevents XSS; neither stops a forged request (although XSS must also be fixed, because it can defeat CSRF tokens). Moving a state change to GET makes CSRF easier: OWASP says never use GET for state-changing operations.' },
  { topic: '4.10', type: 'single', difficulty: 1, lesson: L410,
    stem: 'In the OWASP Top 10:2025, where is cross-site scripting (XSS) listed?',
    options: [
      'As its own category, A03:2025 Cross-Site Scripting',
      'Under A07:2025 Authentication Failures',
      'Under A05:2025 Injection',
      'It is no longer covered by the OWASP Top 10',
    ],
    answer: [2],
    explanation: 'The OWASP Top 10:2025 lists **A05:2025 Injection**, whose page names cross-site scripting (CWE-79, very common) and SQL injection (CWE-89) among its CWEs. XSS last had its own category in the 2017 edition; A03:2025 is Software Supply Chain Failures, and A07:2025 Authentication Failures covers identity and session weaknesses. XSS is still very much covered, as part of Injection.' },

  // ---------- 4.11 Bash ----------
  { topic: '4.11', type: 'fill', difficulty: 2, lesson: L411,
    stem: 'Refer to the exhibit. Enter the relative path that belongs in the blank.',
    exhibit: `alice@devbox:~/netlab/configs$ pwd
/home/alice/netlab/configs
alice@devbox:~/netlab/configs$ cd ______
alice@devbox:~$ pwd
/home/alice`,
    answer: ['../..', '../../', './../..', './../../'],
    explanation: '`..` is the parent directory, so `../..` goes up two levels: from `/home/alice/netlab/configs` to `/home/alice/netlab` to `/home/alice`. The prompt changes to `~` because that is the home directory. `~`, `$HOME`, a bare `cd` or `/home/alice` would reach the same place, but they are not relative paths; `..` alone would stop at `~/netlab`.' },
  { topic: '4.11', type: 'single', difficulty: 2, lesson: L411,
    stem: 'Refer to the exhibit. Why does the Python child process not see SITE the first time?',
    exhibit: `alice@devbox:~$ SITE=hq1
alice@devbox:~$ echo $SITE
hq1
alice@devbox:~$ python3 -c 'import os; print(os.environ.get("SITE"))'
None
alice@devbox:~$ export SITE
alice@devbox:~$ python3 -c 'import os; print(os.environ.get("SITE"))'
hq1`,
    options: [
      'SITE was a shell variable that had not been exported, so it was not passed in the environment of child processes until export marked it',
      'SITE=hq1 needs spaces around the equals sign',
      'Python caches the environment and needed to be restarted',
      'echo $SITE cleared the variable after printing it',
    ],
    answer: [0],
    explanation: '`SITE=hq1` creates a **shell variable**. The Bash manual says `export` marks each name "to be passed to subsequently executed commands in the environment", which is why `python3` (a child process) only sees it after `export SITE`. Spaces around `=` would make Bash run a command called `SITE`. Each `python3 -c` is a new process that receives the environment at start-up, and `echo` does not change variables.' },
  { topic: '4.11', type: 'fill', difficulty: 2, lesson: L411,
    stem: 'Refer to the exhibit. Enter the mode argument for chmod that belongs in the blank to produce the permissions shown in the second listing.',
    exhibit: `alice@devbox:~/netlab$ ls -l creds.env
-rw-rw-r-- 1 alice alice 38 Nov 22 13:09 creds.env
alice@devbox:~/netlab$ chmod ______ creds.env
alice@devbox:~/netlab$ ls -l creds.env
-rw------- 1 alice alice 38 Nov 22 13:09 creds.env`,
    answer: ['600', '0600', 'go-rw', 'og-rw', 'go-rwx', 'og-rwx', 'go=', 'og=', 'u=rw,go=', 'u=rw,g=,o=', 'g-rw,o-rw', 'g-rw,o-r', 'u=rw,og='],
    explanation: 'The target `rw-------` is read and write for the owner and nothing for group and others: numerically 6 (4+2) for the owner and 0 for the others, so `600`. Symbolic forms that give the same result here include `go-rw` (remove read and write from group and others) and `u=rw,go=`. `644` would leave others able to read the credentials, and `700` would add execute for the owner.' },
  { topic: '4.11', type: 'single', difficulty: 2, lesson: L411,
    stem: 'An engineer needs the names of every file under ~/netlab, at any depth, that contains the text "ntp server" in any mix of upper and lower case. Which command does this?',
    options: [
      'find ~/netlab -name "ntp server"',
      'ls -R ~/netlab | grep -i "ntp server"',
      'grep -ril "ntp server" ~/netlab',
      'cat ~/netlab/* | grep -i "ntp server"',
    ],
    answer: [2],
    explanation: '`grep` searches file **contents**: `-r` recurses into the directory tree, `-i` ignores case and `-l` prints only the names of matching files. `find -name` matches file **names**, not contents. `ls -R | grep` searches the list of names. `cat ~/netlab/*` reads only the top level (and errors on directories), and its output loses which file each line came from.' },
  { topic: '4.11', type: 'match', difficulty: 2, lesson: L411,
    stem: 'Match each task to the Bash command that accomplishes it.',
    pairs: [
      ['Return to the directory you were in before your last cd', 'cd -'],
      ['Make API_BASE visible to the Python scripts you start from this shell', 'export API_BASE=https://api.example.com/api/v1'],
      ['Set DEBUG=1 for a single run of a script without changing the current shell', 'DEBUG=1 ./collect.sh'],
      ['Make SITE=hq1 available in every new interactive Bash session', "echo 'export SITE=hq1' >> ~/.bashrc"],
      ['Rename sw02.cfg to sw02.cfg.bak in the same directory', 'mv sw02.cfg sw02.cfg.bak'],
    ],
    explanation: '`cd -` changes to `$OLDPWD`, the previous directory. `export` puts a variable in the environment of child processes. A `NAME=value` prefix sets the variable only in that command\'s environment, as the Bash manual describes. Lines in `~/.bashrc` run at the start of every interactive non-login Bash, so the variable persists (appending with `>>`, not overwriting). `mv` both moves and renames.' },

  // ---------- 4.12 DevOps ----------
  { topic: '4.12', type: 'multi', difficulty: 2, lesson: L412,
    stem: 'Which two are software delivery performance metrics defined by DORA? (Choose two.)',
    options: [
      'Lines of code written per developer',
      'Number of servers managed per engineer',
      'Change lead time',
      'Change fail rate',
      'Percentage of code covered by unit tests',
    ],
    answer: [2, 3],
    explanation: 'DORA\'s current guidance uses five metrics: **change lead time**, deployment frequency and failed deployment recovery time (throughput), and **change fail rate** and deployment rework rate (instability). Lines of code, servers per engineer and test coverage are output or activity measures, not DORA delivery outcomes; coverage is useful but is not one of the DORA metrics.' },
  { topic: '4.12', type: 'single', difficulty: 2, lesson: L412,
    stem: 'A team ships a release every quarter containing about 400 changes. Each release causes outages that take days to diagnose, and developers say operations "broke it" while operations say the code was bad. Which DevOps-aligned change addresses this best?',
    options: [
      'Release twice a year instead, so there is more time to test each release',
      'Create a separate DevOps team that receives finished code from developers and deploys it',
      'Make one team share ownership of the service and deliver small changes frequently through an automated, tested pipeline with production monitoring',
      'Require a manager to approve every line of code before the quarterly release',
    ],
    answer: [2],
    explanation: 'DevOps addresses both symptoms: **shared ownership** removes the blame between silos, and **small, frequent, automated** releases make each change easy to test, diagnose and roll back, with monitoring feeding results back to the team. DORA\'s research shows speed and stability improve together, so releasing less often makes batches bigger and riskier. A separate team that receives finished code recreates the wall between development and operations. Line-by-line managerial approval adds a queue without adding automated feedback.' },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
