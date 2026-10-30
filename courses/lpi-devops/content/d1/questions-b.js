// Domain 1 questions for topics 1.3, 1.4 and 1.5 (ids assigned in questions.js).
const q = (topic, lesson, type, difficulty, stem, rest) => ({ topic, type, difficulty, stem, ...rest, lesson });
const GF = '1.3-git-fundamentals';
const GB = '1.3-git-branches-remotes';
const CI = '1.4-cicd-pipelines';
const DP = '1.4-deployment-gitops-semver';
const LC = '1.5-composition-licensing';

export default [
  // ---------------- 1.3 ----------------
  q('1.3', GF, 'single', 1, 'Refer to the exhibit. What is the state of app.py and README.md?', {
    exhibit: `$ git status -s
 M app.py
M  README.md
?? notes.txt`,
    options: ['app.py has unstaged changes; README.md has changes staged for the next commit', 'app.py is staged; README.md has unstaged changes', 'Both files are staged, and notes.txt is ignored', 'Both files are deleted'], answer: [0],
    explanation: 'In short format the first column is the index and the second the working tree. " M" is modified but not staged; "M " is staged.\n\n* notes.txt shows "??", meaning untracked, not ignored.\n* No file is shown as deleted ("D").' }),
  q('1.3', GF, 'fill', 2, 'Type the full command that unstages notes.txt but keeps your edits, using the modern restore command.', {
    answer: ['git restore --staged notes.txt', 'git restore -S notes.txt', 'git restore --staged -- notes.txt'],
    explanation: '`git restore --staged <file>` copies the file from HEAD to the index and leaves the working tree alone. `git restore <file>` without --staged would discard the working tree changes instead.' }),
  q('1.3', GF, 'single', 2, 'Refer to the exhibit. Commit 7be4d10 contains a bug and has already been pushed to the shared main branch. Which command undoes its effect without rewriting history?', {
    exhibit: `$ git log --oneline -3 origin/main
2c91f0e (HEAD -> main, origin/main) Update docs
7be4d10 Add retry logic
1a2b3c4 Add health endpoint`,
    options: ['git revert <commit>', 'git reset --hard <commit>~1 followed by a force push', 'git commit --amend', 'git rebase -i <commit>~1 and drop it, then force push'], answer: [0],
    explanation: '`git revert` adds a new commit that inverts the change, so history others have pulled stays valid.\n\n* The other options rewrite shared history and require a force push, which disrupts collaborators.' }),
  q('1.3', GF, 'single', 2, 'Refer to the exhibit. Which path is NOT ignored?', {
    exhibit: `# .gitignore
*.log
!audit.log
/build
tmp/`,
    options: ['audit.log', 'logs/app.log', 'build/out.o', 'src/tmp/cache.db', 'debug.log'], answer: [0],
    explanation: '`*.log` ignores every .log file, but the later `!audit.log` re-includes that file.\n\n* logs/app.log and debug.log match `*.log`.\n* build/out.o is under `/build`, anchored at the repository root.\n* `tmp/` matches a directory named tmp at any depth, so src/tmp/cache.db is ignored.' }),
  q('1.3', GF, 'single', 2, 'A file config.local is already tracked and committed. After you add it to .gitignore, git status still shows modifications to it. Why, and what fixes it?', {
    options: ['.gitignore only affects untracked files; run git rm --cached config.local and commit', 'The pattern is wrong; .gitignore needs a leading slash to work on committed files', 'Git caches the ignore file; run git gc', 'You must delete .git/index manually'], answer: [0],
    explanation: 'Tracked files stay tracked regardless of .gitignore; `git rm --cached` removes them from the index while keeping the working copy.\n\n* A leading slash only anchors the pattern.\n* git gc is garbage collection, unrelated.\n* Deleting the index is destructive and unnecessary.' }),
  q('1.3', GF, 'single', 2, 'Which Git object type stores the contents of a file, without its name?', {
    options: ['blob', 'tree', 'commit', 'tag'], answer: [0],
    explanation: 'A blob holds file content; a tree maps names to blobs and subtrees; a commit points to a tree and parents; a tag object annotates a commit.' }),
  q('1.3', GF, 'single', 2, 'Refer to the exhibit. You must urgently switch branches and want to shelve both the modified and the new file. Which command does it?', {
    exhibit: `$ git status -s
 M app.py
?? retry.py`,
    options: ['git stash push -u', 'git stash push', 'git commit --amend', 'git restore .'], answer: [0],
    explanation: '`-u` (--include-untracked) also stashes untracked files.\n\n* Plain `git stash push` leaves untracked files in place.\n* `--amend` rewrites the last commit.\n* `git restore .` discards tracked changes and would lose your work.' }),
  q('1.3', GF, 'match', 2, 'Match each command with its effect.', {
    exhibit: `$ git status -s
 M app.py
?? retry.py`,
    pairs: [['git restore app.py', 'Discard uncommitted changes to app.py in the working tree'], ['git revert 3f2a1c9', 'Create a new commit that inverts commit 3f2a1c9'], ['git rm --cached app.py', 'Stop tracking app.py but keep it on disk'], ['git reset --soft HEAD~1', 'Undo the last commit but keep its changes staged']],
    explanation: 'restore changes working-tree files; revert adds an inverse commit; rm --cached untracks; reset --soft moves the branch back and keeps the index and working tree.' }),
  q('1.3', GF, 'multi', 2, 'Which two statements correctly compare CVS/Subversion with Git? (Choose two.)', {
    options: ['Subversion uses a central server, and most operations need access to it', 'Git allows committing locally without any network connection', 'CVS commits are atomic across all files, while Subversion commits are per file', 'In Git a clone contains only the latest snapshot, not the history', 'Subversion is a distributed system where every working copy holds the full history'], answer: [0, 1],
    explanation: 'SVN is centralized; Git commits are local.\n\n* It is the reverse for atomicity: CVS is per file, Subversion has atomic commits.\n* A Git clone has the full history (unless made shallow on purpose).\n* Subversion is not distributed.' }),
  q('1.3', GB, 'fill', 1, 'Complete the command to create and switch to a new branch: git ___ -c feature/login (type the missing word).', {
    answer: ['switch'],
    explanation: '`git switch -c <name>` creates and switches (older equivalent: `git checkout -b <name>`).' }),
  q('1.3', GB, 'single', 2, 'What is the effect of git merge --no-ff feature when main can be fast-forwarded to feature?', {
    options: ['A merge commit is created anyway, recording that a feature branch existed', 'Git refuses because a fast-forward is possible', 'The feature commits are squashed into one commit without a merge commit', 'The feature branch is deleted after merging'], answer: [0],
    explanation: '`--no-ff` forces a merge commit even when a fast-forward would be possible.\n\n* Git does not refuse.\n* Squashing is `--squash`.\n* Deleting the branch is a separate `git branch -d`.' }),
  q('1.3', GB, 'single', 2, 'Refer to the exhibit. Which lines contain the version from the branch being merged in (feature/login)?', {
    exhibit: `<<<<<<< HEAD
timeout = 30
=======
timeout = 60
>>>>>>> feature/login`,
    options: ['timeout = 60', 'timeout = 30', 'Both lines are from feature/login', 'The markers do not identify the sides'], answer: [0],
    explanation: 'Between `<<<<<<< HEAD` and `=======` is the current branch (HEAD); between `=======` and `>>>>>>> feature/login` is the incoming branch.' }),
  q('1.3', GB, 'order', 2, 'Put the steps for finishing a merge that stopped with a conflict in order.', {
    items: ['Run git merge feature/login and see the conflict reported', 'Edit the conflicted file and remove the conflict markers', 'Run git add on the resolved file', 'Run git commit to conclude the merge'],
    explanation: 'Merge, edit to the final content (no markers left), stage the file to mark it resolved, then commit (or `git merge --continue`). `git merge --abort` would instead cancel the merge.' }),
  q('1.3', GB, 'single', 2, 'Which command creates an annotated tag v1.4.2 with a message?', {
    options: ['git tag -a v1.4.2 -m "Release 1.4.2"', 'git tag v1.4.2', 'git branch v1.4.2', 'git tag -d v1.4.2'], answer: [0],
    explanation: '`-a` creates an annotated tag object with tagger, date and message.\n\n* `git tag v1.4.2` creates a lightweight tag.\n* `git branch` creates a branch.\n* `-d` deletes a tag.' }),
  q('1.3', GB, 'single', 2, 'After git tag -a v1.4.2 -m "Release", a colleague cannot see the tag after pulling. What is needed?', {
    options: ['git push origin v1.4.2 (or git push origin --tags), because tags are not pushed by default', 'git push --force', 'git commit --amend', 'Nothing; tags are always pushed with the branch'], answer: [0],
    explanation: 'A normal push transfers branches only; tags must be pushed explicitly.\n\n* A force push is not needed and does not push tags by itself.\n* Amending changes a commit and is unrelated.' }),
  q('1.3', GB, 'fill', 2, 'The remote branch old-feature was deleted on the server, but your clone still lists it. Which option of git fetch removes such stale remote-tracking references? (Type the option.)', {
    exhibit: `$ git branch -r
  origin/main
  origin/old-feature`,
    answer: ['--prune', '-p'],
    explanation: '`git fetch --prune` (or `-p`) deletes stale remote-tracking refs such as origin/old-feature.' }),
  q('1.3', GB, 'single', 2, 'What is the difference between git fetch and git pull?', {
    options: ['fetch only downloads and updates remote-tracking branches; pull is fetch followed by a merge (or rebase) into the current branch', 'fetch uploads local commits; pull downloads them', 'pull never changes the working tree; fetch does', 'They are identical'], answer: [0],
    explanation: '`git pull` = `git fetch` + `git merge` (or `--rebase`). Fetch does not touch your local branches or working tree.\n\n* Uploading is `git push`.\n* The statement about the working tree is reversed.' }),
  q('1.3', GB, 'single', 2, 'Refer to the exhibit. What should you do?', {
    exhibit: `$ git push origin main
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://git.example.com/example/webshop.git'
hint: Updates were rejected because the remote contains work that you do not have locally.`,
    options: ['Fetch and integrate the remote commits (git pull or fetch plus merge/rebase), then push again', 'Retry with git push --force', 'Delete the remote and recreate it', 'Run git gc and push again'], answer: [0],
    explanation: 'The remote has commits you lack, so the push is not a fast-forward. Integrate them first.\n\n* A blind force push would overwrite your colleagues\' work.\n* Recreating the remote loses history.\n* git gc does not change reachability.' }),
  q('1.3', GB, 'single', 2, 'Your feature branch was rebased onto main after it had been pushed. Which is the safer way to update the remote branch?', {
    options: ['git push --force-with-lease', 'git push --force', 'git push --tags', 'git pull --rebase'], answer: [0],
    explanation: '`--force-with-lease` overwrites only if the remote branch still has the commit you last saw, so you do not clobber someone else\'s newer push.\n\n* `--force` has no such check.\n* `--tags` pushes tags.\n* `pull --rebase` fetches and rebases; it does not push.' }),
  q('1.3', GB, 'single', 2, 'Refer to the exhibit. Commit 5d7e2a1 fixes a bug on main and must also go onto release/1.4 without merging the other main commits. Which command, run on release/1.4, does this?', {
    exhibit: `$ git log --oneline main -3
5d7e2a1 Fix null pointer in checkout
8c0b1f3 Add recommendations page
1a2b3c4 Add health endpoint`,
    options: ['git cherry-pick 5d7e2a1', 'git rebase main', 'git fetch origin main', 'git reset --hard 5d7e2a1'], answer: [0],
    explanation: '`git cherry-pick` applies the change of selected commits as new commits on the current branch.\n\n* `git rebase main` would replay the whole release branch on top of main.\n* `git fetch` downloads without merging.\n* `git reset --hard` moves the branch pointer and discards work.' }),
  q('1.3', GB, 'single', 2, 'Refer to the exhibit. After a plain git clone, libs/shared-ui is an empty directory. Which command populates it with the commit pinned by the parent repository?', {
    exhibit: `$ cat .gitmodules
[submodule "libs/shared-ui"]
	path = libs/shared-ui
	url = https://git.example.com/example/shared-ui.git
$ ls libs/shared-ui
$`,
    options: ['git submodule update --init', 'git submodule add libs/shared-ui', 'git fetch --prune', 'git switch --detach libs/shared-ui'], answer: [0],
    explanation: '`git submodule update --init` initialises the submodule and checks out the pinned commit (add `--recursive` for nested ones; `git clone --recurse-submodules` does it at clone time).\n\n* `submodule add` registers a new submodule and would fail or duplicate here.\n* The other commands do not populate submodules.' }),
  q('1.3', GB, 'fill', 1, 'Which tracked file in the top-level directory records each submodule\'s path and URL? (Type the file name.)', {
    answer: ['.gitmodules', 'gitmodules'],
    explanation: '`.gitmodules` stores path and URL for each submodule; the parent repository separately records the pinned commit as a gitlink entry.' }),
  q('1.3', GB, 'single', 2, 'Refer to the exhibit. Which command produced this history on main?', {
    exhibit: `$ git log --oneline --graph --decorate
*   9d1e7a2 (HEAD -> main) Merge branch 'feature/login'
|\\
| * 4c8b3f0 (feature/login) Add login form
|/
* 1a2b3c4 Add health endpoint`,
    options: ['git merge --no-ff feature/login', 'git merge feature/login when main had not moved since 1a2b3c4 (default behaviour)', 'git merge --squash feature/login', 'git rebase feature/login'], answer: [0],
    explanation: 'main has a merge commit whose parents are 1a2b3c4 and 4c8b3f0, although main never diverged, so a fast-forward was possible but suppressed by `--no-ff`.\n\n* A plain merge would have fast-forwarded with no merge commit.\n* `--squash` creates an ordinary commit with one parent.\n* Rebase produces a linear history.' }),
  q('1.3', GB, 'fill', 1, 'Type the git subcommand that adds a named remote, as in: git ___ add origin https://git.example.com/example/webshop.git', {
    answer: ['remote'],
    explanation: '`git remote add <name> <url>` registers a remote; `git remote -v` lists them.' }),

  // ---------------- 1.4 ----------------
  q('1.4', CI, 'single', 1, 'What is the difference between continuous delivery and continuous deployment?', {
    options: ['Delivery keeps every change releasable with a manual release decision; deployment releases every passing change to production automatically', 'Delivery includes automated tests; deployment does not', 'Delivery is for containers; deployment is for virtual machines', 'There is no difference'], answer: [0],
    explanation: 'The manual gate before production is the distinguishing feature.\n\n* Both include automated tests.\n* Neither is tied to a packaging technology.' }),
  q('1.4', CI, 'single', 2, 'Refer to the exhibit. Which statement about dist/ and node_modules/ is correct?', {
    exhibit: `build-job:
  script: npm ci && npm run build
  artifacts:
    paths: [dist/]
  cache:
    key:
      files: [package-lock.json]
    paths: [node_modules/]`,
    options: ['dist/ is the build result passed on to later jobs; node_modules/ is an optional speed-up keyed on the lock file', 'node_modules/ is the deliverable that gets deployed, and dist/ is only a speed-up', 'dist/ may be missing at any time, because artifacts are only optimisations', 'The cache key changes on every build, because it uses the build timestamp'], answer: [0],
    explanation: 'Artifacts must be reliable and traceable; caches are disposable.\n\n* Deployed results are artifacts.\n* Caches, not artifacts, may be missing.\n* Cache keys are best derived from the lock file so they invalidate when dependencies change.' }),
  q('1.4', CI, 'order', 2, 'Put these typical pipeline stages in order.', {
    items: ['Build', 'Unit tests', 'Integration tests', 'Publish artifact', 'Deploy to staging'],
    explanation: 'Fast, cheap checks come first; the artifact is published once, then promoted. Acceptance and production steps follow staging.' }),
  q('1.4', CI, 'single', 2, 'Refer to the exhibit. When does the Deploy stage run?', {
    exhibit: `pipeline {
    agent any
    stages {
        stage('Build')  { steps { sh 'make build' } }
        stage('Test')   { steps { sh 'make test' } }
        stage('Deploy') {
            when { branch 'main' }
            steps { sh './deploy.sh staging' }
        }
    }
}`,
    options: ['Only for builds of the main branch, after Build and Test succeed', 'For every branch, in parallel with Build', 'Only when Test fails', 'Never, because when is not valid in a declarative pipeline'], answer: [0],
    explanation: 'Stages run sequentially in order; the `when` directive restricts Deploy to the main branch.\n\n* Stages are sequential here.\n* `when` is a valid declarative directive.' }),
  q('1.4', CI, 'single', 2, 'Refer to the exhibit. Which statement is correct?', {
    exhibit: `stages: [build, test, deploy]

unit:
  stage: test
  script: make unit
lint:
  stage: test
  script: make lint
publish:
  stage: deploy
  script: make publish`,
    options: ['unit and lint run in parallel in the test stage; publish starts only after both succeed', 'lint runs after unit because it is listed second', 'publish runs first because deploy is the last word in the file', 'The pipeline is invalid because two jobs share a stage'], answer: [0],
    explanation: 'In GitLab CI, jobs in the same stage run in parallel (given enough runners), and stages run in the order of the stages list.' }),
  q('1.4', CI, 'fill', 1, 'What is the conventional name of the file that holds a Jenkins pipeline definition in a repository?', {
    answer: ['Jenkinsfile', 'jenkinsfile'],
    explanation: 'Jenkins reads the pipeline from a file named Jenkinsfile in the repository (pipeline as code). GitLab CI uses .gitlab-ci.yml.' }),
  q('1.4', CI, 'single', 1, 'What is the role of Artifactory or Nexus in a delivery pipeline?', {
    options: ['A repository manager that stores build artifacts and proxies/caches public registries', 'A source control system that replaces Git', 'A tool that executes unit tests', 'A load balancer for production traffic'], answer: [0],
    explanation: 'They store and serve artifacts (Maven, npm, container images and others) and can proxy public repositories.\n\n* They are not SCM, test runners or load balancers.' }),
  q('1.4', DP, 'single', 1, 'The current release is 1.4.2. A change removes an API endpoint that clients use. What is the next semantic version?', {
    options: ['2.0.0', '1.5.0', '1.4.3', '1.4.2-breaking'], answer: [0],
    explanation: 'A backward-incompatible change increments MAJOR and resets MINOR and PATCH.\n\n* 1.5.0 is for compatible features, 1.4.3 for compatible fixes.' }),
  q('1.4', DP, 'fill', 1, 'The current release is 2.3.1. You publish a backward-compatible bug fix. Type the next version.', {
    answer: ['2.3.2'],
    explanation: 'A compatible bug fix increments PATCH only.' }),
  q('1.4', DP, 'single', 2, 'Refer to the exhibit. According to semantic versioning 2.0.0, which tag is the lowest version?', {
    exhibit: `$ git tag --list 'v1.0.0*'
v1.0.0
v1.0.0-beta.11
v1.0.0-beta.2
v1.0.0-rc.1`,
    options: ['v1.0.0-beta.2', 'v1.0.0-beta.11', 'v1.0.0-rc.1', 'v1.0.0'], answer: [0],
    explanation: 'Pre-release identifiers: numeric parts compare as numbers, so beta.2 < beta.11; alphabetic `beta` < `rc`; any pre-release is lower than 1.0.0.' }),
  q('1.4', DP, 'single', 2, 'In which deployment strategy are two identical production environments kept, with all traffic switched from the old one to the new one after testing?', {
    options: ['Blue-green', 'Canary', 'Rolling update', 'Recreate'], answer: [0],
    explanation: 'Blue-green switches traffic between two full environments, giving instant rollback.\n\n* Canary shifts a small share gradually.\n* Rolling replaces instances in batches.\n* Recreate stops the old version first.' }),
  q('1.4', DP, 'single', 2, 'A team sends 5 percent of users to the new version, watches error rates and then raises the share. Which strategy is this?', {
    options: ['Canary deployment', 'Blue-green deployment', 'Recreate deployment', 'Immutable server patching'], answer: [0],
    explanation: 'Canary exposes a small slice of traffic first to limit blast radius.\n\n* A/B testing also splits traffic but compares user-facing variants for a business metric rather than checking release health.' }),
  q('1.4', DP, 'single', 2, 'In a GitOps setup with Argo CD, an engineer manually edits a Deployment in the cluster, and a minute later the change disappears. What happened?', {
    options: ['The reconciliation loop detected drift from the state in Git and restored it', 'The cluster rebooted', 'The CI pipeline rebuilt the image', 'Git pushed the change to the cluster from outside'], answer: [0],
    explanation: 'GitOps agents continuously compare actual to desired state and correct drift. The right way to change the system is a commit to Git.\n\n* The agent pulls from inside the cluster; Git does not push.' }),
  q('1.4', DP, 'single', 2, 'What is the main purpose of a feature toggle?', {
    options: ['To enable or disable functionality at runtime without redeploying, separating deployment from release', 'To encrypt configuration files', 'To select the Git branch used for a build', 'To limit the number of pipeline runs'], answer: [0],
    explanation: 'Toggles let unfinished or risky features be deployed dark and switched on per user or percentage later, or off quickly if they misbehave.' }),

  // ---------------- 1.5 ----------------
  q('1.5', LC, 'single', 2, 'What additional obligation does the GNU AGPLv3 impose compared with the GPLv3?', {
    options: ['Users who interact with a modified version over a network must be offered its source code', 'The software may not be used commercially', 'All source code must be published even if it is only used internally', 'Patent grants are removed'], answer: [0],
    explanation: 'Section 13 of the AGPLv3 closes the SaaS loophole: network users of a modified version get the right to the source.\n\n* Commercial use is allowed.\n* Internal, unpublished use does not oblige disclosure.\n* The AGPL keeps the GPLv3 patent provisions.' }),
  q('1.5', LC, 'single', 2, 'Which licence feature is characteristic of the Apache License 2.0 among the permissive licences?', {
    options: ['An explicit patent licence from contributors, which terminates for those who sue claiming patent infringement by the work', 'A requirement to publish all derivative works under the same licence', 'A requirement to offer source to network users', 'A ban on any commercial use'], answer: [0],
    explanation: 'Apache 2.0 grants patent rights explicitly and ends them for patent litigants.\n\n* Same-licence redistribution is copyleft.\n* Network source offer is AGPL.\n* Commercial use is allowed.' }),
  q('1.5', LC, 'single', 3, 'Refer to the exhibit. A developer wants to ship the project below with the library. What is the result?', {
    exhibit: `# project LICENSE header
SPDX-License-Identifier: GPL-2.0-only

# vendored library libfast/LICENSE
SPDX-License-Identifier: Apache-2.0`,
    options: ['The licences are not compatible, so the combination cannot be distributed', 'They are compatible because Apache 2.0 is permissive', 'Compatible only if the Apache library is dynamically linked', 'Compatible, but the whole work must then be relicensed as Apache 2.0'], answer: [0],
    explanation: 'The Apache 2.0 patent and indemnity terms count as further restrictions under GPLv2-only. Apache 2.0 code is compatible with GPLv3 (and with "GPLv2 or later" used under v3).\n\n* Permissive does not automatically mean GPLv2-compatible.\n* Linking style does not change the licence compatibility.' }),
  q('1.5', LC, 'single', 2, 'Which statement about Apache License 2.0 and GPLv3 is correct?', {
    options: ['Apache 2.0 code may be included in a GPLv3 work, which is then governed by GPLv3', 'GPLv3 code may be relicensed as Apache 2.0 by anyone who receives it', 'They are incompatible in both directions', 'Apache 2.0 is only compatible with the AGPL'], answer: [0],
    explanation: 'Apache 2.0 was designed to be compatible with GPLv3; the combination is distributed under GPLv3.\n\n* Recipients cannot relicense GPL code.\n* The licences are compatible in the Apache-into-GPLv3 direction.' }),
  q('1.5', LC, 'single', 2, 'How does the BSD 3-clause licence differ from the BSD 2-clause licence?', {
    options: ['It adds a clause forbidding use of the authors\' names to endorse or promote derived products without permission', 'It requires publishing source for derived works', 'It adds an explicit patent grant', 'It forbids binary redistribution'], answer: [0],
    explanation: 'The third clause is the non-endorsement clause.\n\n* Source disclosure is copyleft.\n* A patent grant is a feature of Apache 2.0.\n* Binary redistribution is allowed if notices are kept.' }),
  q('1.5', LC, 'multi', 2, 'Which two of these licences are permissive? (Choose two.)', {
    options: ['MIT', 'BSD 3-clause', 'GPLv3', 'AGPLv3', 'LGPL 2.1'], answer: [0, 1],
    explanation: 'MIT and BSD are permissive.\n\n* GPLv3 and AGPLv3 are strong copyleft, and the LGPL is weak copyleft.' }),
  q('1.5', LC, 'single', 2, 'A company links an unmodified LGPL library dynamically into its proprietary application and distributes the product. Which obligation applies?', {
    options: ['Provide the library\'s licence and source (or an offer) and let users replace the library; the proprietary code can stay closed', 'The proprietary application must be released under the LGPL', 'Nothing at all; LGPL is permissive', 'The company must pay royalties to the authors'], answer: [0],
    explanation: 'LGPL is weak copyleft: modifications of the library must stay open and users must be able to relink or replace it, but separate code that uses it may be proprietary.\n\n* The whole application is not covered.\n* It is not permissive.\n* There is no royalty requirement.' }),
  q('1.5', LC, 'match', 2, 'Match each licence with its distinguishing feature.', {
    pairs: [['MIT', 'Short permissive licence, keep the copyright notice'], ['Apache 2.0', 'Permissive with an explicit patent grant'], ['GPLv3', 'Strong copyleft with explicit patent grant'], ['AGPLv3', 'Copyleft that also covers network use'], ['LGPL', 'Weak copyleft aimed at libraries']],
    explanation: 'Each licence has one memorable feature: MIT is short and permissive, Apache 2.0 has the patent grant, GPLv3 is strong copyleft, AGPLv3 adds the network clause, LGPL targets libraries.' }),
  q('1.5', LC, 'fill', 2, 'Refer to the exhibit. Which value completes the SPDX identifier line? (Type it exactly.)', {
    exhibit: `# SPDX-License-Identifier: ____
# Licensed under the Apache License, Version 2.0`,
    answer: ['Apache-2.0'],
    explanation: 'SPDX uses `Apache-2.0`. Others: `MIT`, `BSD-2-Clause`, `BSD-3-Clause`, `GPL-3.0-or-later`, `AGPL-3.0-only`.' }),
  q('1.5', LC, 'single', 2, 'What is a Software Bill of Materials (SBOM) used for?', {
    options: ['Listing the components, versions and licences in software, so vulnerabilities and licence obligations can be tracked', 'Billing customers for their software usage', 'Encrypting build artifacts', 'Scheduling pipeline runs'], answer: [0],
    explanation: 'An SBOM is a machine-readable inventory (SPDX or CycloneDX) used for vulnerability response, licence compliance and supply-chain security.' }),
  q('1.5', LC, 'single', 2, 'Refer to the exhibit. Which version can npm install for this dependency?', {
    exhibit: `{
  "dependencies": {
    "left-pad": "^1.3.0"
  }
}`,
    options: ['1.9.2', '2.0.0', '1.2.9', '0.9.0'], answer: [0],
    explanation: 'The caret range `^1.3.0` means >=1.3.0 and <2.0.0.\n\n* 2.0.0 is a new major version.\n* 1.2.9 and 0.9.0 are below the minimum.' }),
  q('1.5', LC, 'single', 2, 'A vendor offers the same database under the GPL and, separately, under a paid commercial licence. What is this called?', {
    options: ['Multi-licensing (dual licensing)', 'Licence compatibility', 'Relicensing by the recipient', 'Public domain dedication'], answer: [0],
    explanation: 'The copyright holder can offer the same code under several licences. Only the copyright holder (or someone authorised) can do so.' }),
  q('1.5', LC, 'fill', 2, 'Which lock file does the PHP dependency manager Composer create to pin exact dependency versions? (Type the file name.)', {
    answer: ['composer.lock'],
    explanation: '`composer.json` declares dependencies; `composer.lock` records the exact resolved versions. npm uses package-lock.json.' }),
];
