// Domain 4 — Automation, Orchestration, and Scripting. Original questions. Every shell, Python and Git exhibit was run (bash 5.3, Python 3.14, Git 2.55) in throwaway directories and the real output pasted with placeholder names; the Ansible recap is from a real ansible-core 2.22 run, the ksvalidator output from pykickstart, Compose behaviour from docker compose 5.x, and Kubernetes, Swarm, cloud-init and Puppet facts from their official documentation.
// Review 2026-11-22: d4-047 to d4-059 added. Their bash snippets were evaluated in a temp directory; the Git, kubectl, ansible-playbook, PXE and OpenTofu exhibits are documentation-based (man pages, git message strings, kubernetes.io, opentofu.org, pykickstart docs), not run.
const L41A = '4.1-iac-unattended-deployment';
const L41B = '4.1-cicd-gitops-devsecops';
const L41C = '4.1-orchestration-kubernetes-swarm-compose';
const L42A = '4.2-expansion-variables-functions';
const L42B = '4.2-tests-conditionals-loops-regex';
const L43 = '4.3-python-basics';
const L44 = '4.4-git-version-control';
const L45 = '4.5-responsible-ai';

const bank = [
  // ---------- 4.1 ----------
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. The playbook was run once against web01, then a second time with nothing changed on the host in between. Why does the second run still report changed=1?',
    exhibit: `alice@srv01:~$ cat app.yml
---
- name: Prepare application directories
  hosts: web01.example.com
  gather_facts: false
  tasks:
    - name: Create data directory
      ansible.builtin.file:
        path: /srv/app/data
        state: directory
        mode: "0750"

    - name: Create log directory
      ansible.builtin.command: mkdir -p /srv/app/logs

alice@srv01:~$ ansible-playbook -i inventory.ini app.yml      # second run

PLAY [Prepare application directories] *****************************************

TASK [Create data directory] ***************************************************
ok: [web01.example.com]

TASK [Create log directory] ****************************************************
changed: [web01.example.com]

PLAY RECAP *********************************************************************
web01.example.com          : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0`,
    options: ['The file module is not idempotent, so "Create data directory" reapplied mode 0750 on the second run', 'Facts were not gathered, so Ansible could not compare the current state with the desired state', 'The "Create log directory" task uses ansible.builtin.command, which runs mkdir every time and reports changed because Ansible cannot tell whether a raw command changed anything', 'The play has no handlers, so Ansible keeps reporting changes until a handler runs'],
    answer: [2],
    explanation: 'Real modules such as `ansible.builtin.file` check the current state first and report `ok` when it already matches, which is exactly what the data-directory task did. `ansible.builtin.command` just runs the command and reports `changed` every time; make it idempotent with `creates: /srv/app/logs` or `changed_when`, or better, use the file module for both directories. The file module is idempotent, as its `ok` result shows. Facts are host information (OS, IPs) and are not needed to compare a directory\'s state. Handlers only run when notified; their absence does not cause repeated changes.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41A,
    stem: 'Which two statements about Ansible and Puppet are true? (Choose two.)',
    options: ['Ansible requires each managed host to present a certificate signed by the control node before it can be managed', 'Ansible connects to managed Linux hosts over SSH and needs no agent installed on them', 'Ansible playbooks are written in the Puppet language and compiled into catalogs by the control node', 'Puppet agents normally pull a catalog from the Puppet server, which must first sign each agent\'s certificate', 'Puppet cannot apply any manifest unless a Puppet server is available'],
    answer: [1, 3],
    explanation: 'Ansible is agentless: it pushes small Python modules over SSH and needs only sshd and Python on Linux hosts. Puppet\'s usual model is an agent that sends facts to the server on TCP 8140 and pulls a compiled catalog, after the server\'s CA has signed the agent\'s certificate request. Ansible uses SSH authentication, not a certificate signed by the control node. Playbooks are YAML; catalogs and the Puppet language belong to Puppet. Puppet can work without a server: `puppet apply` applies a manifest locally and Bolt runs tasks over SSH or WinRM without an agent.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41A,
    stem: 'A playbook uses modules from the community.general collection, which is not installed on the control node. Enter the full command that installs that collection.',
    answer: ['ansible-galaxy collection install community.general'],
    explanation: '`ansible-galaxy collection install community.general` downloads the collection from Ansible Galaxy (or a configured Automation Hub) into the collections path. Collections are named `namespace.collection`; `ansible.builtin` ships with ansible-core. A list of collections can be installed with `ansible-galaxy collection install -r requirements.yml`.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41A,
    stem: 'Enter the OpenTofu command that compares the configuration with the recorded state and the real infrastructure and shows what it would create, change or destroy, without changing anything.',
    answer: ['tofu plan'],
    explanation: '`tofu plan` refreshes the state from the provider APIs, compares it with the HCL configuration and prints the proposed actions (`+` create, `~` update, `-` destroy). `tofu apply` makes the changes, `tofu init` downloads providers and sets up the backend, and `tofu destroy` removes everything the state tracks. With Terraform the same command is `terraform plan`.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. What must be changed before this Kickstart file can be used to install db01?',
    exhibit: `alice@srv01:~$ cat -n db01.ks | sed -n '9,13p'
     9	%packages
    10	@^minimal-environment
    11	postgresql-server
    12
    13	%post
alice@srv01:~$ ksvalidator -v RHEL9 db01.ks
Checking kickstart file db01.ks

The following problem occurred on line 13 of the kickstart file:

Section %packages does not end with %end.
`,
    options: ['Add a line containing %end after postgresql-server to close the %packages section', 'Move the %post section before %packages, because Kickstart sections must appear in that order', 'Replace rootpw --lock with a plain-text root password, because ksvalidator rejects locked root accounts', 'Add inst.ks=db01.ks as the first line of the file'],
    answer: [0],
    explanation: 'Every Kickstart section (`%packages`, `%pre`, `%post` and others) must be closed with `%end`; ksvalidator reports the problem where the next section starts. The pykickstart documentation states that the `%pre`, `%post` and similar sections can appear in any order, so reordering is unnecessary. `rootpw --lock` is valid and common. `inst.ks=` is a boot option given to the installer to locate the file, not a line inside it.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. A VM is booted from a cloud image with this file as its NoCloud user data. cloud-init runs, but alice is not created and nginx is not installed. What is the most likely cause?',
    exhibit: `alice@srv01:~$ cat user-data
users:
  - name: alice
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleKeyOnly alice@example.com
packages:
  - nginx`,
    options: ['packages only works when package_upgrade: true is also set', 'The file does not start with the line #cloud-config, so cloud-init does not process it as cloud-config', 'cloud-init applies user data only after cloud-init clean has been run on the instance', 'Users can be created by Kickstart only; cloud-init can only run commands'],
    answer: [1],
    explanation: 'cloud-init decides how to handle user data from its first line, and cloud-config YAML must begin with `#cloud-config`; without it the data is not treated as cloud-config, and `cloud-init schema -c user-data` or `/var/log/cloud-init.log` shows the problem. `packages` works on its own (`package_update`/`package_upgrade` are optional). User data is processed automatically on the first boot; `cloud-init clean` only makes cloud-init run again. The `users` module creates accounts, keys and sudo rules.' },
  { topic: '4.1', type: 'single', difficulty: 1, lesson: L41B,
    stem: 'A team wants to catch mistakes in its shell scripts and Ansible playbooks before they reach staging. Which practice is an example of shift-left testing?',
    options: ['Adding a manual QA phase after each deployment to production', 'Reviewing production logs for errors the morning after each release', 'Removing tests from the pipeline to deploy faster and relying on rollbacks', 'Running shellcheck and ansible-playbook --syntax-check in a pre-commit hook and in the CI pipeline on every push'],
    answer: [3],
    explanation: 'Shift-left means moving testing earlier (to the left) in the development life cycle, into the editor, pre-commit hooks and CI, where problems are cheapest to fix. QA after deployment and reviewing production logs are checks on the far right, after the damage is possible. Removing tests is the opposite of shift-left.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41B,
    stem: 'Which two statements describe GitOps? (Choose two.)',
    options: ['Administrators change production with kubectl edit and commit the result to Git afterwards', 'The desired state of the system is declared in a Git repository, which is the single source of truth', 'Rolling back requires restoring the cluster from backup, because Git history cannot be redeployed', 'GitOps means every change is deployed automatically without review', 'An agent such as Argo CD or Flux continuously reconciles the live system with the repository and reverts manual drift'],
    answer: [1, 4],
    explanation: 'In GitOps the repository holds the declarative desired state, changes arrive by reviewed merge requests, and a reconciling agent applies them and corrects drift. Editing production directly and committing afterwards is exactly the drift GitOps prevents. Rollback is a `git revert`, which the agent then applies. Changes are reviewed through merge requests; GitOps does not remove review.' },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41C,
    stem: 'Match each Kubernetes object to its purpose.',
    pairs: [
      ['Pod', 'One or more containers that share a network namespace and are scheduled together'],
      ['Deployment', 'Keeps a set number of Pod replicas running and performs rolling updates'],
      ['Service', 'Stable virtual IP and DNS name that load-balances to Pods selected by labels'],
      ['ConfigMap', 'Non-confidential key-value settings injected as variables or files'],
      ['Secret', 'Base64-encoded sensitive values such as passwords and tokens'],
      ['emptyDir volume', 'Scratch storage that exists only as long as its Pod'],
    ],
    explanation: 'Pods are the smallest scheduling unit; Deployments manage ReplicaSets of Pods; Services give Pods a stable address (ClusterIP, NodePort, LoadBalancer); ConfigMaps hold plain configuration and Secrets hold sensitive values, both usable through `env`, `envFrom` or volumes; an `emptyDir` volume is created with the Pod and deleted with it, unlike a PersistentVolumeClaim.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: 'Refer to the exhibit. A developer wants to commit this manifest to the team\'s Git repository, arguing that the password is encrypted. Which statement is correct?',
    exhibit: `alice@srv01:~$ cat db-cred.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-cred
type: Opaque
data:
  password: UzNjcmV0UGFzcw==`,
    options: ['The value is only base64-encoded; anyone who can read the file or the Secret can decode it with base64 -d, so it must not be committed as is', 'The value is encrypted with the cluster CA key and can be decrypted only by the API server', 'type: Opaque means the value is a one-way hash and cannot be recovered', 'Kubernetes always encrypts Secrets in etcd, so anyone reading the manifest in Git sees only ciphertext'],
    answer: [0],
    explanation: '`echo UzNjcmV0UGFzcw== | base64 -d` prints `S3cretPass`: base64 is an encoding, not encryption. Keep real values out of Git (Sealed Secrets, External Secrets, Vault) and restrict Secret access with RBAC. No CA key is involved. `Opaque` only means "arbitrary user data". Kubernetes stores Secrets unencrypted in etcd unless encryption at rest is configured, and that would not protect the manifest file in Git anyway.' },
  { topic: '4.1', type: 'single', difficulty: 2, lesson: L41C,
    stem: 'Refer to the exhibit. The administrator runs `docker compose down` and later `docker compose up -d` in the same directory. What happens to the PostgreSQL data?',
    exhibit: `alice@srv01:~/app$ cat compose.yaml
services:
  web:
    image: docker.io/library/nginx:1.27
    ports:
      - "8080:80"
    depends_on:
      - db
  db:
    image: docker.io/library/postgres:16
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - dbdata:/var/lib/postgresql/data
    secrets:
      - db_password

volumes:
  dbdata:

secrets:
  db_password:
    file: ./db_password.txt`,
    options: ['It is deleted, because down removes every volume declared in the file', 'It survives only if restart: unless-stopped is set on the db service', 'It is deleted unless a top-level version: key is added to the file', 'It survives, because down removes the containers and the project network but keeps named volumes such as dbdata'],
    answer: [3],
    explanation: '`docker compose down` stops and removes the project\'s containers and default network; named volumes are kept unless you add `-v` (`--volumes`), so the new db container mounts the same `dbdata` volume. `restart:` controls restarts of existing containers, not volume lifetime. The `version:` key is obsolete and ignored by current Compose.' },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41C,
    stem: 'A replicated Docker Swarm service named web runs three tasks. Enter the docker command that changes it to six tasks.',
    answer: ['docker service scale web=6', 'docker service update --replicas 6 web', 'docker service update --replicas=6 web', 'docker service update web --replicas 6', 'docker service update web --replicas=6'],
    explanation: '`docker service scale web=6` (or `docker service update --replicas 6 web`) changes the desired replica count; the managers schedule three more tasks across the nodes. `docker service ps web` lists the tasks and the node each runs on. `docker compose up --scale` is the single-host Compose equivalent.' },
  { topic: '4.1', type: 'multi', difficulty: 2, lesson: L41C,
    stem: 'Which two statements about Compose tooling are true? (Choose two.)',
    options: ['docker compose (with a space) is the current Compose CLI plugin, and docker-compose (with a hyphen) is the legacy standalone v1 program', 'docker compose logs -f stops the containers and prints their final log lines', 'The top-level version: key is required, and Compose refuses files without it', 'podman compose runs an external compose provider, such as docker-compose or podman-compose, against the Podman socket', 'docker compose up -d schedules the containers across every node of a swarm'],
    answer: [0, 3],
    explanation: 'Compose v1 (`docker-compose`, Python) is end of life; the Go plugin `docker compose` replaced it with the same file format. `podman compose` is a thin wrapper that runs `docker-compose` if installed, otherwise `podman-compose`. `logs -f` follows the logs and does not stop anything. `version:` is obsolete and produces a warning when present. Compose runs on one host; spreading services over a swarm is `docker stack deploy`.' },

  // ---------- 4.2 ----------
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `alice@srv01:~$ cat count.sh
#!/bin/bash
total=0
for f in a b c; do
    ( total=$((total + 1)) )
done
echo "total=$total"`,
    options: ['total=3', 'total=0', 'total=1', 'An error, because a subshell cannot read variables of its parent shell'],
    answer: [1],
    explanation: 'The parentheses run the assignment in a subshell, a child copy of the shell. Each subshell reads `total` (0), sets its own copy to 1 and exits, so the parent\'s `total` never changes and the script prints `total=0`. Without the parentheses it would print `total=3`. `total=1` would need the change to survive once. A subshell inherits copies of all variables, so there is no error.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42A,
    stem: 'Refer to the exhibit. Why does the script print nothing and exit with status 1?',
    exhibit: `alice@srv01:~$ cat check.sh
#!/bin/bash
set -e
count=0
for host in web01 web02; do
    ((count++))
    echo "checked $host"
done
echo "done: $count hosts"
alice@srv01:~$ ./check.sh; echo "exit=$?"
exit=1`,
    options: ['count was not exported, so arithmetic on it fails', 'A for loop cannot be used while set -e is active', '((count++)) evaluates to the old value 0, so the arithmetic command returns status 1 and set -e ends the script', '((...)) is not bash syntax; the script needs $[count+1]'],
    answer: [2],
    explanation: '`((expr))` returns status 1 when the expression evaluates to 0, and post-increment evaluates to the value before incrementing. On the first pass that is 0, so `set -e` treats it as a failed command and exits before any echo. Use `count=$((count + 1))` or `((++count))`. Shell variables need no export for arithmetic. Loops work fine under `set -e`. `((...))` is valid bash; `$[...]` is an obsolete form.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42B,
    stem: 'Refer to the exhibit. The script prints "smaller". Which change makes it compare the values as numbers?',
    exhibit: `alice@srv01:~$ cat cmp.sh
#!/bin/bash
x=10
y=9
if [[ $x > $y ]]; then
    echo "bigger"
else
    echo "smaller"
fi
alice@srv01:~$ ./cmp.sh
smaller`,
    options: ['Use [[ $x -gt $y ]] or (( x > y ))', 'Quote the variables: [[ "$x" > "$y" ]]', 'Use single brackets with the same operator: [ $x > $y ]', 'Use [[ $x >= $y ]]'],
    answer: [0],
    explanation: 'Inside `[[ ]]`, `>` compares strings by sort order, and "10" sorts before "9" because `1` comes before `9`. `-gt` (or `>` inside the arithmetic `(( ))`) compares integers. Quoting does not change a string comparison. In `[ ]`, an unescaped `>` is an output redirection: `[ $x > $y ]` becomes `[ 10 ]` (true) and creates a file named `9`, so it prints "bigger" by accident. `>=` is not a valid operator in `[[ ]]` and is a syntax error.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42B,
    stem: 'Refer to the exhibit. Why does the script print "no match"?',
    exhibit: `alice@srv01:~$ cat match.sh
#!/bin/bash
pattern="^web[0-9]+$"
host="web01"
if [[ $host =~ "$pattern" ]]; then
    echo "match"
else
    echo "no match"
fi
alice@srv01:~$ ./match.sh
no match`,
    options: ['=~ supports only basic regular expressions, in which + is not special', 'The regular expression must be enclosed in slashes, as in /^web[0-9]+$/', 'BASH_REMATCH must be declared before =~ can be used', 'Quoting the right side of =~ makes bash match it as a literal string, so ^, [0-9]+ and $ lose their regex meaning'],
    answer: [3],
    explanation: 'Any quoted part of the right-hand side of `=~` is matched literally, so bash looks for the literal text `^web[0-9]+$` in `web01`. Write `[[ $host =~ $pattern ]]` (unquoted variable) and it prints "match". `=~` uses POSIX extended regular expressions, where `+` is special. Slashes are Perl/sed syntax, not bash. `BASH_REMATCH` is filled automatically after a match.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. User bob does not exist on srv01, yet the script prints "bob exists". Why?',
    exhibit: `alice@srv01:~$ cat bobcheck.sh
#!/bin/bash
grep -q '^bob:' /etc/passwd
echo "Checking bob..."
if [ $? -eq 0 ]; then
    echo "bob exists"
else
    echo "bob missing"
fi
alice@srv01:~$ ./bobcheck.sh
Checking bob...
bob exists`,
    options: ['grep -q always returns 0, whether or not it finds a match', '$? holds the status of the most recent command, which is now the echo (0), not grep', 'The test must be written [ $? == 0 ] for exit codes', 'The ^ anchor makes grep match any line in the file'],
    answer: [1],
    explanation: '`$?` is overwritten by every command. By the time `if` tests it, it holds echo\'s status, 0. Test the command directly (`if grep -q \'^bob:\' /etc/passwd; then`) or save the status right away (`rc=$?`). `grep -q` returns 1 when nothing matches. `==` would compare strings and fix nothing. `^bob:` anchors to lines beginning with `bob:`.' },
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L42B,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `alice@srv01:~$ cat retry.sh
#!/bin/bash
n=0
until [ "$n" -ge 3 ]; do
    n=$((n + 1))
    echo "try $n"
done
echo "final $n"`,
    options: ['try 1, try 2, final 2', 'Nothing but "final 0", because until runs only while its test is true', 'try 1, try 2, try 3, final 3', '"try 1" repeated forever, because until never re-tests its condition'],
    answer: [2],
    explanation: '`until` runs its body as long as the test **fails** and re-tests before every pass: 0, 1 and 2 are not `-ge 3`, so the body runs three times, and when `n` is 3 the test succeeds and the loop ends. It prints try 1, try 2, try 3 and final 3. Stopping after two tries would need `-ge 2`. The "only while true" behaviour describes `while`. The test is re-evaluated each time, so there is no infinite loop.' },
  { topic: '4.2', type: 'single', difficulty: 1, lesson: L42B,
    stem: 'Refer to the exhibit. What does `./service.sh reload` print?',
    exhibit: `alice@srv01:~$ cat service.sh
#!/bin/bash
case "$1" in
    start|stop) echo "service action: $1" ;;
    re*)        echo "restart-like: $1" ;;
    *)          echo "usage: $0 {start|stop|restart}"; exit 1 ;;
esac`,
    options: ['restart-like: reload', 'usage: ./service.sh {start|stop|restart}', 'service action: reload', 'restart-like: reload, followed by the usage line'],
    answer: [0],
    explanation: '`case` compares the word against glob patterns from top to bottom and runs only the first matching branch; `reload` matches `re*`. `;;` ends the branch, so the `*)` catch-all does not also run (that would need `;&` or `;;&`). It does not match `start|stop`, which accepts only those two exact words.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. Which change fixes the script?',
    exhibit: `alice@srv01:~$ cat site-backup.sh
#!/bin/bash
src="srv/web data"
tar -czf site.tgz $src
echo "tar exit: $?"
alice@srv01:~$ ./site-backup.sh
tar: srv/web: Cannot stat: No such file or directory
tar: data: Cannot stat: No such file or directory
tar: Exiting with failure status due to previous errors
tar exit: 2`,
    options: ['Assign the value without quotes as src=srv/web\\ data', 'Export src before calling tar', 'Write ${src} instead of $src', 'Quote the expansion: tar -czf site.tgz "$src"'],
    answer: [3],
    explanation: 'The unquoted `$src` is split on the space in `IFS`, so tar receives two arguments, `srv/web` and `data`. Double quotes keep the expanded value as one word. Escaping the space in the assignment still stores a value containing a space, which is split again at expansion. Exporting changes visibility to child processes, not splitting. Braces only delimit the variable name; `${src}` unquoted is split the same way.' },
  { topic: '4.2', type: 'single', difficulty: 3, lesson: L42A,
    stem: 'Refer to the exhibit. What does the last echo in the script print?',
    exhibit: `alice@srv01:~$ cat hosts.csv
web01,192.0.2.11,prod
db01,192.0.2.21,staging
alice@srv01:~$ cat parse.sh
#!/bin/bash
while IFS=, read -r name addr env; do
    echo "$env/$name"
done < hosts.csv
line="web01 192.0.2.11 prod"
IFS=, read -r name addr env <<< "$line"
echo "name=[$name] env=[$env]"
alice@srv01:~$ ./parse.sh
prod/web01
staging/db01
...`,
    options: ['name=[web01] env=[prod]', 'name=[web01 192.0.2.11 prod] env=[]', 'name=[web01,192.0.2.11,prod] env=[]', 'name=[] env=[prod]'],
    answer: [1],
    explanation: 'With `IFS=,`, read splits only on commas. The second line contains spaces but no commas, so the whole line lands in the first variable, `name`, and `addr` and `env` are empty. The CSV loop works because those lines are comma-separated. Splitting on spaces would need the default IFS. The value contains spaces, not commas, so no commas appear, and `name` cannot be empty because it receives everything.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. What is the output of the awk command?',
    exhibit: `alice@srv01:~$ cat hosts.csv
web01,192.0.2.11,prod
db01,192.0.2.21,staging
alice@srv01:~$ awk -F, 'BEGIN { OFS=":" } { print $1, $3 }' hosts.csv`,
    options: ['web01 prod / db01 staging', 'web01,prod / db01,staging', 'web01:prod / db01:staging', 'web01:192.0.2.11:prod / db01:192.0.2.21:staging'],
    answer: [2],
    explanation: '`-F,` sets the input field separator to a comma; `OFS` is awk\'s output field separator, inserted wherever `print` has a comma between fields. Fields 1 and 3 are printed joined by `:`. A space would be the default OFS; a comma would need `OFS=","`. Field 2 is not printed. OFS is an awk variable, not a shell variable like IFS.' },
  { topic: '4.2', type: 'single', difficulty: 2, lesson: L42A,
    stem: 'Refer to the exhibit. Which statement explains the output?',
    exhibit: `alice@srv01:~$ cat tidy.sh
#!/bin/bash
cleanup_tmp() {
    local dir="$1"
    [ -d "$dir" ] || return 2
    echo "cleaning $dir"
}
cleanup_tmp /nonexistent
echo "status: $?"
local mode=fast
echo "mode: $mode"
alice@srv01:~$ ./tidy.sh
status: 2
./tidy.sh: line 9: local: can only be used in a function
mode: `,
    options: ['local makes mode visible only to child processes, so echo cannot see it', 'The function\'s return 2 caused bash to unset every variable', 'local outside a function behaves like export, so mode is moved to the environment', 'local is valid only inside a function; at line 9 bash prints an error, does not set mode, and the script continues'],
    answer: [3],
    explanation: 'Inside `cleanup_tmp`, `local dir` is correct and `return 2` sets the function\'s status, which the script prints. At top level `local` fails with "can only be used in a function", the assignment does not happen, and without `set -e` the script carries on, printing an empty `mode`. Use a plain assignment outside functions. `local` restricts scope to the function, not to child processes. `return` only sets a status. `export` is a different builtin.' },
  { topic: '4.2', type: 'multi', difficulty: 3, lesson: L42B,
    stem: 'In a bash script, $a and $b hold host names. Which two tests are true when $a sorts before $b? (Choose two.)',
    options: ['[ "$a" -lt "$b" ]', '[[ $a < $b ]]', '[ "$a" < "$b" ]', '[ "$a" \\< "$b" ]', '[[ $a <= $b ]]'],
    answer: [1, 3],
    explanation: '`[[ $a < $b ]]` compares strings (locale order) and `[ "$a" \\< "$b" ]` does the same in the test command (ASCII order), with the `<` escaped so the shell passes it to test. `-lt` is numeric and fails with "integer expected" for host names. In `[ "$a" < "$b" ]` the shell treats `<` as input redirection from a file named after `$b`. `<=` is not a string operator in bash: in `[[ ]]` it is a syntax error. For "less than or equal" use `[[ ! $a > $b ]]`.' },
  { topic: '4.2', type: 'match', difficulty: 1, lesson: L42B,
    stem: 'Match each bash test operator to its meaning.',
    pairs: [
      ['-ge', 'Integer greater than or equal'],
      ['-ne', 'Integers not equal'],
      ['-z', 'String has zero length'],
      ['-n', 'String is not empty'],
      ['-d', 'Path exists and is a directory'],
      ['=~', 'String matches an extended regular expression (only in [[ ]])'],
    ],
    explanation: 'The numeric operators are `-eq`, `-ne`, `-gt`, `-ge`, `-lt` and `-le`. `-z` and `-n` test string length (quote the variable inside `[ ]`). `-d` tests for a directory and `-f` for a regular file. `=~` exists only in `[[ ]]` and puts captured groups in `BASH_REMATCH`.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42B,
    stem: 'Complete the test so that the script exits when the variable BACKUP_DIR is empty: `[ ___ "$BACKUP_DIR" ] && exit 1`. Enter only what replaces the blank.',
    answer: ['-z', '! -n'],
    explanation: '`-z` is true when the string has zero length; `! -n` is the equivalent negation of "non-empty". Keep the quotes: unquoted, an empty variable disappears and `[ -z ]` tests the literal string `-z`, which happens to be true, while `[ -n ]` would be true too, which hides bugs.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42A,
    stem: 'Enter the interpreter directive (first line) that runs a script with the first bash found in the PATH, using the env program.',
    answer: ['#!/usr/bin/env bash', '#! /usr/bin/env bash'],
    explanation: '`#!/usr/bin/env bash` asks `env` to find `bash` in `PATH`, which helps on systems where bash is not at `/bin/bash`. `#!/bin/bash` hard-codes the path. Avoid `#!/bin/sh` for bash scripts: on Debian and Ubuntu it is dash, which lacks `[[ ]]` and arrays.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42A,
    stem: 'Enter the special parameter that holds the exit status of the most recently executed command.',
    answer: ['$?'],
    explanation: '`$?` is 0 after success and 1-255 after failure (`grep` uses 1 for no match and 2 for errors). It changes after every command, including `echo` and `[`, so save it immediately (`rc=$?`) if you need it later. `$!` is the PID of the last background job, `$$` the shell\'s PID and `$#` the argument count.' },

  // ---------- 4.3 ----------
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43,
    stem: 'Refer to the exhibit. On an Ubuntu 24.04 server, an automation script needs the requests library from PyPI. What is the recommended fix?',
    exhibit: `alice@srv01:~$ python3 -m pip install requests
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try apt install
    python3-xyz, where xyz is the package you are trying to
    install.
...`,
    options: ['Create a virtual environment with python3 -m venv, activate it and run pip install requests inside it', 'Rerun the command with sudo so pip can write to the system site-packages', 'Delete the EXTERNALLY-MANAGED file in the system Python library directory and rerun pip', 'Install pip for Python 2.7, which is not marked as externally managed'],
    answer: [0],
    explanation: 'PEP 668 makes pip refuse to modify the distribution-managed Python, because it could break apt-installed tools. A venv has its own site-packages, so pip installs freely there (installing `python3-requests` with apt is the other supported route). sudo does not bypass the marker and would risk overwriting packaged files. Deleting the marker, or `--break-system-packages`, defeats the protection. Python 2 has been end of life since 2020.' },
  { topic: '4.3', type: 'order', difficulty: 1, lesson: L43,
    stem: 'Put the steps in order to run a script with its own dependencies on a fresh server, from creating the environment to leaving it.',
    items: ['python3 -m venv .venv', 'source .venv/bin/activate', 'pip install -r requirements.txt', 'python backup_report.py', 'deactivate'],
    explanation: 'Create the venv, activate it (which puts `.venv/bin` first in `PATH`), install the pinned dependencies into it, run the script with the venv\'s interpreter, and deactivate to restore the shell. For cron or systemd, skip activation and call `.venv/bin/python backup_report.py` directly.' },
  { topic: '4.3', type: 'single', difficulty: 1, lesson: L43,
    stem: 'Refer to the exhibit. What is wrong with the script?',
    exhibit: `alice@srv01:~$ cat check.py
import shutil

def free_gb(path):
total, used, free = shutil.disk_usage(path)
    return free // 2**30
alice@srv01:~$ python3 check.py
  File "/home/alice/check.py", line 4
    total, used, free = shutil.disk_usage(path)
    ^^^^^
IndentationError: expected an indented block after function definition on line 3`,
    options: ['shutil must be imported with from shutil import * before disk_usage can be used', 'Line 4 is part of the function body and must be indented to the same level (4 spaces) as the return line', 'Python 3 functions must be declared with the function keyword', 'A def line must end with a semicolon instead of a colon'],
    answer: [1],
    explanation: 'Python defines blocks by indentation. Everything in the function body must be indented consistently, 4 spaces per PEP 8. `import shutil` with `shutil.disk_usage()` is correct. The keyword is `def`, and the colon at the end of the `def` line is required.' },
  { topic: '4.3', type: 'single', difficulty: 2, lesson: L43,
    stem: 'Refer to the exhibit. What does the script print?',
    exhibit: `alice@srv01:~$ cat svc.py
services = {"sshd": 22, "nginx": 80}
services["chronyd"] = 323
ports = list(services.values())
print(len(services), ports[-1], services.get("httpd", 0))
print(10 / 4, 10 // 4, "10" * 2)`,
    options: ['3 323 None / 2.5 2.5 20', '2 80 0 / 2 2 1010', '3 323 0 / 2 2 20', '3 323 0 / 2.5 2 1010'],
    answer: [3],
    explanation: 'Adding a key makes the dictionary 3 entries long; dictionaries keep insertion order, so the last value is 323; `get()` returns the supplied default 0 for a missing key (it returns `None` only without a default). `/` is true division (2.5), `//` integer division (2), and multiplying a string repeats it (`"1010"`); arithmetic on a string needs `int()` first.' },
  { topic: '4.3', type: 'fill', difficulty: 2, lesson: L43,
    stem: 'A virtual environment is active. Enter the command that writes the installed packages and their exact versions to requirements.txt.',
    answer: ['pip freeze > requirements.txt', 'pip3 freeze > requirements.txt', 'python -m pip freeze > requirements.txt', 'python3 -m pip freeze > requirements.txt'],
    explanation: '`pip freeze` prints `name==version` for every package in the active environment; redirect it into `requirements.txt` and commit that file (not the `.venv/` directory). `pip install -r requirements.txt` recreates the same set elsewhere.' },

  // ---------- 4.4 ----------
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. What is the state of the repository after these commands?',
    exhibit: `alice@srv01:~/infra$ git switch main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
alice@srv01:~/infra$ git merge --squash feature/logging
Updating da38419..5115dfd
Fast-forward
Squash commit -- not updating HEAD
 backup.sh | 2 ++
 1 file changed, 2 insertions(+)
alice@srv01:~/infra$ git status --short
M  backup.sh`,
    options: ['A merge commit with two parents has been created on main', 'main has been moved to 5115dfd, the last commit of feature/logging', 'The combined changes of feature/logging are staged on main, but nothing has been committed yet; git commit creates one new commit', 'feature/logging has been deleted, because its commits were squashed into main'],
    answer: [2],
    explanation: '`git merge --squash` applies the branch\'s combined changes to the index ("Squash commit -- not updating HEAD", and `M ` in the staged column) and stops; you make a single ordinary commit yourself. No merge commit or second parent is recorded, HEAD did not move despite the "Fast-forward" line, and the branch still exists (Git now considers it unmerged, so deleting it needs `git branch -D`).' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. Bob pushed to main a few minutes earlier. What should Alice do?',
    exhibit: `alice@srv01:~/infra$ git push origin main
To git.example.com:ops/infra.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'git.example.com:ops/infra.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.`,
    options: ['Run git pull (or git fetch and then merge or rebase her own unpublished commits onto origin/main), resolve any conflicts, and push again', 'Run git push --force, because her local branch is newer', 'Run git reset --hard origin/main and push again', 'Delete the local repository, clone it again and copy her files over the new clone'],
    answer: [0],
    explanation: 'The remote has Bob\'s commit, which Alice does not have, so a normal push would discard it and Git refuses. Integrating it first with pull (fetch plus merge, or `--rebase` for her local-only commits) makes her push a fast-forward. `--force` would delete Bob\'s commit from the remote. `reset --hard origin/main` throws away Alice\'s own commit. Re-cloning and copying files loses her history and is error-prone.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Alice committed to her local main branch but has not pushed. A file is missing from the commit. She wants to undo the commit while keeping all of its changes staged, add the missing file and commit again. Which command undoes the commit as required?',
    options: ['git reset --hard HEAD~1', 'git reset --soft HEAD~1', 'git reset --mixed HEAD~1', 'git revert HEAD'],
    answer: [1],
    explanation: '`--soft` moves the branch back one commit and leaves the index and working tree as they were, so the changes remain staged. `--hard` would discard them from the files. `--mixed` (the default) keeps them in the working tree but unstages them, which is not what she asked for. `git revert HEAD` keeps the commit and adds another that undoes it, which is meant for already-shared history. (`git commit --amend` after adding the file is another common way to fix the last commit.)' },
  { topic: '4.4', type: 'match', difficulty: 2, lesson: L44,
    stem: 'Match each command to its effect.',
    pairs: [
      ['git reset --soft HEAD~1', 'Moves the branch back; the undone changes stay staged'],
      ['git reset --mixed HEAD~1', 'Moves the branch back; the undone changes stay in the files but are unstaged'],
      ['git reset --hard HEAD~1', 'Moves the branch back and discards the changes from the index and the working tree'],
      ['git stash', 'Shelves uncommitted changes and leaves a clean working tree'],
      ['git revert HEAD', 'Adds a new commit that reverses the last one, safe on shared branches'],
    ],
    explanation: 'The three reset modes differ only in what they reset besides the branch pointer: nothing (`--soft`), the index (`--mixed`, the default) or the index and working tree (`--hard`). Commits lost by a reset can usually be found again with `git reflog`. `git stash` saves work in progress for `git stash pop`. `git revert` undoes by adding history instead of removing it.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. app.env was added to .gitignore in the previous commit, yet git still reports it as modified. What should the administrator do?',
    exhibit: `alice@srv01:~/app$ cat .gitignore
app.env
alice@srv01:~/app$ git status --short
 M app.env
alice@srv01:~/app$ git check-ignore -v app.env; echo "exit $?"
exit 1
alice@srv01:~/app$ git ls-files
.gitignore
app.env
run.sh`,
    options: ['Change the rule to /app.env*, because a bare file name only matches in subdirectories', 'Set git config core.excludesFile .gitignore, because Git does not read .gitignore by default', 'Wait until .gitignore is pushed, because ignore rules take effect only after a push', 'Run git rm --cached app.env and commit, because .gitignore applies only to untracked files and app.env is already tracked'],
    answer: [3],
    explanation: '`git ls-files` shows app.env is tracked (it was committed before the rule existed), and ignore rules never apply to tracked files, which is why `check-ignore` reports nothing. `git rm --cached` removes it from the index but leaves it on disk; after that commit the rule keeps it out. If the file held a password or other secret, it is still in history and must be rotated. A bare name matches at any depth. `.gitignore` is read automatically, and `core.excludesFile` is for a personal global ignore file. Ignore rules work locally and have nothing to do with pushing.' },
  { topic: '4.4', type: 'multi', difficulty: 2, lesson: L44,
    stem: 'Which two statements about git rebase are true? (Choose two.)',
    options: ['Rebasing rewrites the rebased commits, so they get new commit hashes', 'git rebase main combines main into the current branch by creating a merge commit', 'A rebase is the only way to combine two branches whose histories have diverged', 'Rebasing a shared branch is safe because the remote accepts the rewritten history on a normal push', 'Commits that other people have already pulled should not be rebased; merge or revert on shared branches instead'],
    answer: [0, 4],
    explanation: 'Rebase replays commits on a new base, creating new commits with new hashes, so it should be used only on private, unpublished work; rewriting shared history forces others to reconcile and requires a force push. Rebase produces a linear history without a merge commit. `git merge` also combines diverged branches. A normal push of rewritten history is rejected as a non-fast-forward.' },
  { topic: '4.4', type: 'single', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `alice@srv01:~/infra$ git fetch origin
From git.example.com:ops/infra
   0143220..d02ae78  main       -> origin/main
alice@srv01:~/infra$ git status -sb
## main...origin/main [ahead 1, behind 1]
alice@srv01:~/infra$ git log --oneline main..origin/main
d02ae78 Set retention to 14 days`,
    options: ['origin/main has one commit that local main lacks, local main has one commit that origin/main lacks, and the fetch did not change the working tree', 'git fetch merged d02ae78 into the local main branch', 'Local main is up to date with the remote and can be pushed without integrating anything', 'The fetch discarded Alice\'s local commit because the remote branch was newer'],
    answer: [0],
    explanation: '`git fetch` only updates remote-tracking branches such as `origin/main`; "ahead 1, behind 1" means the histories have diverged by one commit each, and `main..origin/main` lists the commit Alice does not have. Nothing was merged (that is what `git pull` adds), a push would be rejected until she integrates d02ae78, and fetch never discards local commits.' },
  { topic: '4.4', type: 'fill', difficulty: 1, lesson: L44,
    stem: 'Using the newer branch command introduced in Git 2.23 (not checkout), enter the command that creates a branch named hotfix and switches to it.',
    answer: ['git switch -c hotfix', 'git switch --create hotfix'],
    explanation: '`git switch -c hotfix` creates and switches in one step, the replacement for `git checkout -b hotfix`. `git switch hotfix` switches to an existing branch, and `git restore` took over the file-restoring half of `checkout`.' },
  { topic: '4.4', type: 'fill', difficulty: 1, lesson: L44,
    stem: 'Complete the command `git tag ___ v1.0` so that it creates an annotated, unsigned tag (with tagger, date and message) and opens an editor for the message, rather than a lightweight tag. Enter only the option.',
    answer: ['-a', '--annotate'],
    explanation: '`git tag -a v1.0` creates an annotated tag object and opens an editor for its message; `git tag v1.0` alone creates a lightweight tag that is only a name for a commit. Giving a message with `-m` also implies `-a` (git-tag(1)), but `-m` does not open an editor, and `-s` creates a GPG-signed tag. Push tags explicitly with `git push origin v1.0` or `git push --tags`.' },

  // ---------- 4.5 ----------
  { topic: '4.5', type: 'single', difficulty: 2, lesson: L45,
    stem: 'Refer to the exhibit. An AI assistant suggested this command to delete application logs older than 30 days. What is the best response?',
    exhibit: `find /var/log/app -delete -name '*.log' -mtime +30`,
    options: ['Run it as root, because the assistant was trained on the find documentation', 'Schedule it in cron on production and check the directory the next day', 'Change +30 to -30, because find reverses the meaning of + and -', 'Do not run it: find evaluates its expression left to right, so -delete first deletes everything under /var/log/app; preview with -print in a test directory, then use find /var/log/app -name \'*.log\' -mtime +30 -delete'],
    answer: [3],
    explanation: 'The find man page warns that putting `-delete` first deletes everything below the starting point, because the action runs before the tests are evaluated; a scratch-directory test deletes the whole directory. Review the command, preview with `-print`, then put the tests before `-delete`. Training data is no guarantee of correctness. Testing on production is the opposite of safe practice. `-mtime +30` already means "more than 30 days ago"; `-30` would select recent files.' },
  { topic: '4.5', type: 'multi', difficulty: 1, lesson: L45,
    stem: 'Which two practices follow good data governance when using AI assistants for administration work? (Choose two.)',
    options: ['Paste Kubernetes Secret manifests into a public chatbot, because base64 values are protected', 'Replace passwords, tokens, internal host names and customer data with placeholders before sharing logs or configs with a hosted AI service', 'Assume prompts sent to any public AI service are deleted immediately and never used for training', 'Skip human review of AI-generated infrastructure code once it passes a syntax check', 'Use an approved local model on company hardware for confidential data that policy does not allow off-site'],
    answer: [1, 4],
    explanation: 'Sanitizing what you send and keeping sensitive work on approved local or private models protects data. Base64 is an encoding, so a pasted Secret is a leaked secret that must be rotated. Retention and training depend on the service and plan, so check the terms instead of assuming. A syntax check proves only that the file parses; human review is still required before production.' },
  { topic: '4.5', type: 'single', difficulty: 1, lesson: L45,
    stem: 'A company\'s AI acceptable use policy allows internal data only in the company-licensed assistant. An administrator finds that a free public chatbot gives better answers for a firewall migration that involves internal IP address plans. What should the administrator do?',
    options: ['Use the approved assistant (or remove the internal details so the question no longer contains internal data) and request the other tool through the policy\'s approval process', 'Use the public chatbot, because network addressing is not covered by data classification', 'Use the public chatbot from a personal device, so company logging does not apply', 'Ask a colleague to paste the data into the public chatbot instead'],
    answer: [0],
    explanation: 'Corporate AI policy decides which tools may handle which data; the administrator stays within it and uses the official route to request new tools. Internal IP plans are internal data. Using a personal device or a colleague is the same policy violation with less oversight.' },

  // ---------- Performance-based additions (review 2026-11-22) ----------
  { topic: '4.4', type: 'order', difficulty: 2, lesson: L44,
    stem: 'On srv01, alice has a clean clone of the infra repository with her old hotfix branch checked out. She must add NTP servers to chrony.conf on a new branch, starting from the latest main on the server, and publish the branch so a merge request can be opened. Put the commands in order.',
    items: ['git switch main', 'git pull', 'git switch -c feature/ntp', 'git add chrony.conf', 'git commit -m "Add NTP servers"', 'git push -u origin feature/ntp'],
    explanation: 'Update main first (`git switch main`, then `git pull` to fetch and merge the remote commits) so the new branch starts from the latest code. `git switch -c feature/ntp` creates and switches to the branch; editing happens on it. `git add` stages the edited file and `git commit` records it. `git push -u origin feature/ntp` creates the branch on the remote and sets it as the upstream, so later `git push` and `git pull` need no arguments. Pulling after creating the branch would fail, because the new branch has no upstream yet, and committing before adding records nothing.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42B,
    stem: 'Refer to the exhibit. On srv01 the script must try to create the backup directory whenever no directory exists at that path (a regular file of that name does not count as the directory), as the two runs show. Enter what replaces the blank in the test (an operator and its negation, no quotes).',
    exhibit: `alice@srv01:~$ cat mkbackup.sh
#!/bin/bash
backup_dir=/srv/backup
if [ ___ "$backup_dir" ]; then
    mkdir -p "$backup_dir"
    echo "created $backup_dir"
else
    echo "$backup_dir already exists"
fi
alice@srv01:~$ sudo ./mkbackup.sh
created /srv/backup
alice@srv01:~$ sudo ./mkbackup.sh
/srv/backup already exists`,
    answer: ['! -d'],
    explanation: '`-d` is true when the path exists and is a directory, and `!` negates it, so `[ ! -d "$backup_dir" ]` is true only when there is no directory yet. `-d` alone would invert the logic (creating only when it already exists). `! -f` tests for the absence of a regular file, not a directory. `! -e` gives the same two runs, but it is false for any existing file type, so a regular file named /srv/backup would be reported as "already exists" instead of being treated as a missing directory, which the stem rules out. `-z`/`-n` test string length, not paths.' },
  { topic: '4.2', type: 'fill', difficulty: 2, lesson: L42B,
    stem: 'Refer to the exhibit. Enter the index that replaces the blank so that the script prints the output shown.',
    exhibit: `alice@srv01:~$ cat ver.sh
#!/bin/bash
re='^nginx/([0-9]+\\.[0-9]+)\\.[0-9]+$'
banner="nginx/1.26.3"
if [[ $banner =~ $re ]]; then
    echo "minor series: \${BASH_REMATCH[___]}"
fi
alice@srv01:~$ ./ver.sh
minor series: 1.26`,
    answer: ['1'],
    explanation: 'After a successful `=~` match, `BASH_REMATCH[0]` holds the whole match (`nginx/1.26.3`) and `BASH_REMATCH[1]` the first parenthesised group, `([0-9]+\\.[0-9]+)`, which is `1.26`. There is no second group, so index 2 would be empty. The regex is stored in a variable and used unquoted, so its special characters keep their meaning.' },
  { topic: '4.2', type: 'fill', difficulty: 1, lesson: L42A,
    stem: 'Refer to the exhibit. Enter the bash builtin that replaces the blank so that deploy.sh sees the variable on the second run.',
    exhibit: `alice@srv01:~$ cat deploy.sh
#!/bin/bash
echo "deploying to [$TARGET_ENV]"
alice@srv01:~$ TARGET_ENV=staging
alice@srv01:~$ ./deploy.sh
deploying to []
alice@srv01:~$ ___ TARGET_ENV
alice@srv01:~$ ./deploy.sh
deploying to [staging]`,
    answer: ['export', 'declare -x', 'typeset -x'],
    explanation: 'A plain assignment creates a shell variable that child processes do not inherit; the script runs in a child process, so it printed an empty value. `export TARGET_ENV` (equivalently `declare -x` or `typeset -x`) marks it for the environment of every later child. `local` works only inside functions, `set` without arguments lists variables, and `source ./deploy.sh` would run the script in the current shell instead of exporting anything.' },
  { topic: '4.3', type: 'fill', difficulty: 1, lesson: L43,
    stem: 'Refer to the exhibit. Enter the command that replaces the blank so that the shell uses the virtual environment\'s interpreter, as the prompt and which output show.',
    exhibit: `alice@srv01:~/report$ python3 -m venv .venv
alice@srv01:~/report$ ___
(.venv) alice@srv01:~/report$ which python
/home/alice/report/.venv/bin/python`,
    answer: ['source .venv/bin/activate', '. .venv/bin/activate', 'source ./.venv/bin/activate', '. ./.venv/bin/activate', 'source ~/report/.venv/bin/activate', '. ~/report/.venv/bin/activate', 'source /home/alice/report/.venv/bin/activate', '. /home/alice/report/.venv/bin/activate'],
    explanation: 'The activate script must be **sourced** (`source` or its POSIX synonym `.`) so it changes `PATH` and the prompt of the current shell; running `./.venv/bin/activate` as a program would change only a child process. After activation `python` and `pip` resolve to `.venv/bin`. `deactivate` undoes it. Cron jobs and systemd units can skip activation and call `.venv/bin/python` directly.' },
  { topic: '4.1', type: 'match', difficulty: 2, lesson: L41B,
    stem: 'Before changes reach the servers, the team adds checks to its pipeline. Match each goal to the command that achieves it.',
    pairs: [
      ['Check a Kickstart file for syntax errors before a PXE install', 'ksvalidator'],
      ['Check cloud-config user data against the cloud-init schema', 'cloud-init schema -c user-data'],
      ['Show what OpenTofu would create, change or destroy', 'tofu plan'],
      ['Report what an Ansible playbook would change on the hosts without changing them', 'ansible-playbook --check --diff'],
      ['Find unquoted variables and unchecked cd in bash scripts', 'shellcheck'],
      ['Render the merged, interpolated Compose model and catch file errors', 'docker compose config'],
    ],
    explanation: '`ksvalidator` (pykickstart) parses a Kickstart file for a given version. `cloud-init schema -c` validates a cloud-config file against the schema. `tofu plan` compares configuration, state and real infrastructure and prints the proposed actions without applying them. `ansible-playbook --check` predicts changes without making them, and `--diff` shows file differences. ShellCheck is a static analyser for shell scripts (SC2086, SC2164). `docker compose config` parses, resolves and renders the Compose file in canonical form, so syntax and interpolation errors show up before `up`.' },
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. alice staged secrets.env by mistake and wants to unstage it while keeping her edits in the file. Using the command introduced in Git 2.23 for this job (not reset), enter what replaces the blank.',
    exhibit: `alice@srv01:~/infra$ git status --short
M  secrets.env
alice@srv01:~/infra$ ___ secrets.env
alice@srv01:~/infra$ git status --short
 M secrets.env`,
    answer: ['git restore --staged', 'git restore -S'],
    explanation: '`git restore --staged file` (short form `-S`) copies the file from HEAD back into the index, so the change moves from the staged column (`M `) to the unstaged column (` M`) and the working-tree edit is kept. The older equivalent is `git reset HEAD file`. `git restore file` without `--staged` would instead discard the working-tree edit, and `git rm --cached` would stop tracking the file altogether.' },
  { topic: '4.4', type: 'fill', difficulty: 2, lesson: L44,
    stem: 'Refer to the exhibit. alice must switch to the hotfix branch now and continue her unfinished work on main later. Enter the command that replaces the blank.',
    exhibit: `alice@srv01:~/infra$ git status --short
 M backup.sh
alice@srv01:~/infra$ git switch hotfix
error: Your local changes to the following files would be overwritten by checkout:
	backup.sh
Please commit your changes or stash them before you switch branches.
Aborting
alice@srv01:~/infra$ ___
Saved working directory and index state WIP on main: 0143220 Merge branch 'feature/exclude'
alice@srv01:~/infra$ git switch hotfix
Switched to branch 'hotfix'`,
    answer: ['git stash', 'git stash push'],
    explanation: '`git stash` (the same as `git stash push`) saves the uncommitted changes as a stash entry and resets the working tree, so the switch succeeds; the default message is "WIP on <branch>: <commit>". Later, on main, `git stash pop` reapplies the work and drops the entry. `git reset --hard` or `git restore backup.sh` would throw the edits away, and committing half-finished work was not what she wanted.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41C,
    stem: 'Refer to the exhibit. Enter the kubectl subcommand that replaces the blank.',
    exhibit: `alice@srv01:~$ kubectl get deployment web
NAME   READY   UP-TO-DATE   AVAILABLE   AGE
web    3/3     3            3           12d
alice@srv01:~$ kubectl ___ deployment/web --replicas=5
deployment.apps/web scaled
alice@srv01:~$ kubectl get deployment web
NAME   READY   UP-TO-DATE   AVAILABLE   AGE
web    5/5     5            5           12d`,
    answer: ['scale'],
    explanation: '`kubectl scale deployment/web --replicas=5` changes the desired replica count, and the Deployment\'s ReplicaSet starts two more Pods. In a GitOps workflow you would change `replicas:` in the manifest in Git instead, or the reconciling agent would undo the change. `kubectl rollout restart` restarts Pods without changing the count, and `kubectl apply -f` applies a manifest file.' },
  { topic: '4.1', type: 'fill', difficulty: 1, lesson: L41A,
    stem: 'Refer to the exhibit. The change window for web01 has not opened, but alice wants to see which tasks would change. Enter the single option that replaces the blank so that ansible-playbook predicts changes without making any.',
    exhibit: `alice@srv01:~$ ansible-playbook -i inventory.ini site.yml ___

PLAY [Configure web servers] ***************************************************

TASK [Gathering Facts] *********************************************************
ok: [web01.example.com]

TASK [Install nginx] ***********************************************************
changed: [web01.example.com]

PLAY RECAP *********************************************************************
web01.example.com          : ok=2    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0`,
    answer: ['--check', '-C'],
    explanation: '`--check` (`-C`) runs the play in check mode: modules that support it report what they would change ("changed") without changing the host. Adding `--diff` would also print file differences, which the exhibit does not show. `--syntax-check` only parses the playbook and runs no tasks, `--list-tasks` lists task names, and `-b` (become) only escalates privileges.' },
  { topic: '4.1', type: 'fill', difficulty: 2, lesson: L41A,
    stem: 'Refer to the exhibit. This PXE menu entry should install web01 unattended from the Kickstart file on the boot server. Enter the boot option that replaces the blank.',
    exhibit: `alice@srv01:~$ cat /var/lib/tftpboot/pxelinux.cfg/default
default web
label web
  menu label Install web01 (Rocky Linux 9, Kickstart)
  kernel rocky9/vmlinuz
  append initrd=rocky9/initrd.img inst.repo=http://10.0.10.5/rocky9 ___=http://10.0.10.5/ks/web.ks`,
    answer: ['inst.ks'],
    explanation: '`inst.ks=` tells the Anaconda installer where to fetch the Kickstart file (HTTP, NFS, a disk or a labelled volume); `inst.repo=` names the installation source. Before RHEL 7 the option was plain `ks=`. The Kickstart file itself then supplies every answer, and `%packages`/`%post` sections must end with `%end`. cloud-init user data is not used by Anaconda.' },
  { topic: '4.1', type: 'order', difficulty: 2, lesson: L41A,
    stem: 'On srv01, alice is building a new web VM with OpenTofu in an empty directory. She wants the plan she reviews to be exactly what is applied. Put the steps in order.',
    items: ['Write the provider and resource blocks in main.tf', 'tofu init', 'tofu validate', 'tofu plan -out=web.tfplan', 'tofu apply web.tfplan'],
    explanation: 'First write the configuration. `tofu init` downloads the providers and prepares the backend; `tofu validate` needs an initialised directory with its providers installed (OpenTofu docs), so it comes after init. `tofu plan -out=web.tfplan` saves the reviewed plan, and `tofu apply web.tfplan` executes exactly that saved plan without prompting again. Running plan or apply before init fails because the providers are missing.' },
  { topic: '4.2', type: 'match', difficulty: 2, lesson: L42A,
    stem: 'A backup script on srv01 is being hardened and debugged. Match each goal to the bash option that achieves it.',
    pairs: [
      ['Stop the script when a simple command fails', 'set -e'],
      ['Treat a reference to an unset variable as an error', 'set -u'],
      ['Make a pipeline fail when any command in it fails, not only the last', 'set -o pipefail'],
      ['Print each command after expansion as it runs', 'set -x'],
      ['Check the script for syntax errors without running any command', 'bash -n'],
    ],
    explanation: 'From bash(1): `-e` exits when a command fails (with the exceptions for `if`, `while`, `until`, `&&` and `||` tests); `-u` treats unset variables as errors; `pipefail` makes a pipeline return the status of the last command to fail instead of the last command; `-x` prints a trace of each command after expansion; `-n` reads commands without executing them, so `bash -n script.sh` is a syntax check. `set -euo pipefail` combines the first three.' },
];

export default bank.map((item, i) => ({ id: `d4-${String(i + 1).padStart(3, '0')}`, ...item }));
