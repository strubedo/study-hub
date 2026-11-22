// Domain 2 — Services and User Management. Original questions; commands, options and output formats checked against local man pages and tool runs (coreutils, findutils, lsof, shadow-utils, procps, systemd 261, apt, dpkg, rpm, docker 29) and the dnf, Podman and chrony documentation.
const L21 = '2.1-files-directories-links';
const L22 = '2.2-local-accounts';
const L23 = '2.3-processes-jobs';
const L24A = '2.4-package-managers-repositories';
const L24B = '2.4-common-service-configuration';
const L25 = '2.5-systemd';
const L26A = '2.6-container-images-containers';
const L26B = '2.6-volumes-networks-privilege';

const bank = [
  // ---------- 2.1 ----------
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L21,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `srv01$ ls -li /srv/app/config.yml /srv/backup/config.yml /srv/app/current
1311722 -rw-r----- 2 svc_app svc_app 2204 Nov 20 14:02 /srv/app/config.yml
1311722 -rw-r----- 2 svc_app svc_app 2204 Nov 20 14:02 /srv/backup/config.yml
1311740 lrwxrwxrwx 1 root    root      21 Nov 20 14:05 /srv/app/current -> /srv/app/releases/1.4`,
    options: ['The two config.yml names are hard links to one inode, so deleting /srv/app/config.yml leaves the data reachable through the other name', '/srv/backup/config.yml is an independent copy, so editing one file does not change the other', '/srv/app/current would keep working if /srv/app/releases/1.4 were deleted', 'The two config.yml files must be on different filesystems because they have separate paths'],
    answer: [0],
    explanation: 'Both names show the same inode number (1311722) and a link count of 2, which is a hard link: one file with two names, so the data survives until the last name is removed. It is not a copy, because a copy would have its own inode, and a change through either name is visible through both. /srv/app/current is a symlink (type `l`, `->`); it stores only a path and would dangle if the target were deleted. Hard links cannot cross filesystems, so the two names are necessarily on the same one.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L21,
    stem: 'On a Debian web server, enter the command that creates a symbolic link /etc/nginx/sites-enabled/shop pointing to /etc/nginx/sites-available/shop (use absolute paths).',
    answer: ['ln -s /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/shop', 'ln -s /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/', 'ln -s /etc/nginx/sites-available/shop /etc/nginx/sites-enabled', 'ln --symbolic /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/shop'],
    explanation: 'The syntax is `ln -s TARGET LINK_NAME`: the existing file comes first and the new link second. When the last argument is an existing directory, ln creates the link inside it with the target\'s base name, so naming the directory is equivalent here. Without `-s`, ln would create a hard link.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L21,
    stem: 'Refer to the exhibit. /var is full, but du accounts for only about 6 GB. What is the best way to free the space without a reboot?',
    exhibit: `srv01$ df -h /var
Filesystem                 Size  Used Avail Use% Mounted on
/dev/mapper/vg_sys-lv_var   20G   20G     0 100% /var
srv01$ sudo du -sh /var
6.1G	/var
srv01$ sudo lsof +L1 /var
COMMAND  PID    USER FD   TYPE DEVICE    SIZE/OFF NLINK   NODE NAME
reportd 2290 svc_app  3w   REG  253,2 14495514624     0 393231 /var/log/reportd/debug.log (deleted)`,
    options: ['Restart reportd (or make it reopen its log) so it closes the deleted file and the kernel frees its blocks', 'Run rm -f /var/log/reportd/debug.log again to finish the deletion', 'Unmount /var and run fsck to recover the lost blocks', 'Run updatedb so that du sees the file again'],
    answer: [0],
    explanation: '`lsof +L1` lists open files with a link count of 0: debug.log was deleted, but PID 2290 still holds it open, so its 13.5 GiB stay allocated and du (which walks directory entries) cannot see it. Closing the descriptor by restarting or signalling the process releases the space. The name is already gone, so rm has nothing to delete. The filesystem is not damaged, so fsck is pointless (and /var could not be unmounted while in use). updatedb rebuilds the locate database and has nothing to do with disk usage.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L21,
    stem: 'Complete the command to list setuid files on the root filesystem: `find / -xdev -type f ____` (enter the missing test and its argument).',
    answer: ['-perm -4000', '-perm /4000', '-perm -u+s', '-perm /u+s', '-perm -u=s', '-perm /u=s'],
    explanation: '`-perm -4000` matches files that have at least the setuid bit set, whatever their other permission bits. Because only one bit is being tested, `-perm /4000` (any of these bits) is equivalent, as are the symbolic forms `-u+s` and `/u+s`. `-perm 4000` without a prefix would match only files whose mode is exactly 4000.' },
  { topic: '2.1', type: 'match', difficulty: 1, lesson: L21,
    stem: 'Match each device file to its description.',
    pairs: [['/dev/nvme0n1', 'Block device for a whole disk'], ['/dev/ttyS0', 'Character device for a serial port'], ['/dev/null', 'Special character device that discards everything written to it'], ['/dev/zero', 'Special character device that returns endless zero bytes'], ['/dev/urandom', 'Special character device that returns random bytes']],
    explanation: 'Disks and partitions are block devices (`b` in `ls -l`) because they are addressed in blocks and can hold filesystems. Serial ports and terminals are character devices (`c`), streams of bytes. /dev/null, /dev/zero and /dev/urandom are also character devices, but with no hardware behind them: the kernel implements them directly, which is what the objectives call special character devices.' },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L21,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `srv01$ sdiff app-old.conf app-new.conf
listen 8080                                                     listen 8080
upstream 10.0.10.21                                           | upstream 10.0.10.22
debug on                                                      <
                                                              > timeout 30`,
    options: ['The line timeout 30 exists only in app-new.conf', 'The line debug on exists in both files', 'The listen lines differ between the two files', 'The upstream lines are identical in both files'],
    answer: [0],
    explanation: 'sdiff prints the left file (app-old.conf) and the right file (app-new.conf) side by side. `>` marks a line found only on the right, so `timeout 30` is only in app-new.conf. `<` marks a line only on the left, so `debug on` is only in app-old.conf. `|` marks lines that differ, which is the upstream pair, and lines with no marker, such as listen 8080, are identical.' },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L21,
    stem: 'alice runs `chmod 640 report.txt` without changing the file\'s contents. Which timestamp shown by `stat report.txt` is updated?',
    options: ['Change (ctime)', 'Modify (mtime)', 'Access (atime)', 'Birth'],
    answer: [0],
    explanation: 'ctime records the last change to the inode, which includes permission, ownership and link-count changes as well as content changes. mtime changes only when the content is written. atime is the last read, and chmod does not read the file. Birth is the creation time, which never changes after the file is created.' },

  // ---------- 2.2 ----------
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22,
    stem: 'Refer to the exhibit. What is the state of bob\'s account?',
    exhibit: `srv01# grep '^bob:' /etc/shadow
bob:!$6$Qm4x9TzL$Jk2Vb7cQ0aR1sE8nW3yU5iO9pL4kH6gF2dS7aZ1xC0vB8nM3qW5eR7tY9uI1oP3aS5dF7gH9jK1lZ3xC5vB7nM:20779:0:90:7:::`,
    options: ['The password is locked; passwd -u bob would restore the same password', 'bob has no password and can log in without one', 'The account itself expires 90 days after the last password change', 'bob must change his password at his next login'],
    answer: [0],
    explanation: 'A `!` in front of an otherwise valid hash is how `passwd -l` and `usermod -L` lock a password; unlocking removes the `!` and the old password works again. An empty second field would mean no password. The 90 is the maximum password age; the account expiry field (the eighth) is empty, so the account never expires. A forced change at next login is shown by a last-change value of 0, not 20779.' },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L22,
    stem: 'Enter the usermod command that adds user alice to the supplementary group webdev while keeping all her existing supplementary groups.',
    answer: ['usermod -aG webdev alice', 'usermod -a -G webdev alice', 'usermod -G webdev -a alice', 'usermod --append --groups webdev alice', 'usermod -a --groups webdev alice', 'usermod --append -G webdev alice'],
    explanation: '`-a` (append) must be combined with `-G`; without it usermod replaces the whole supplementary group list with the groups you name. The change appears in alice\'s new sessions after she logs in again.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22,
    stem: 'Refer to the exhibit. After the change, bob can no longer use sudo and cannot write to the webdev share. What happened, and what fixes it?',
    exhibit: `srv01# id bob
uid=1002(bob) gid=1002(bob) groups=1002(bob),10(wheel),1005(webdev)
srv01# usermod -G docker bob
srv01# id bob
uid=1002(bob) gid=1002(bob) groups=1002(bob),985(docker)`,
    options: ['-G without -a replaced his supplementary groups; run usermod -aG wheel,webdev bob', 'usermod changed his primary group to docker; run usermod -g bob bob', 'The docker group conflicts with wheel; remove bob from docker with gpasswd -d bob docker', 'The changes need a reboot; reboot and the old groups return'],
    answer: [0],
    explanation: '`usermod -G list` sets the supplementary groups to exactly that list, so wheel and webdev were dropped. Appending them again with `-aG` restores access. His primary group is still 1002(bob), as id shows, so `-g` is irrelevant. There is no conflict between docker and wheel, and nothing about a reboot brings removed memberships back.' },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L22,
    stem: 'On a Debian 12 server with default settings, an administrator runs `useradd carol` with no options. Which two statements are true? (Choose two.)',
    options: ['No home directory is created for carol', 'carol\'s login shell is /bin/sh', 'The command prompts for carol\'s password and full name', 'The files in /etc/skel are copied to /home/carol', 'carol is added to the sudo group'],
    answer: [0, 1],
    explanation: 'Debian does not set CREATE_HOME in /etc/login.defs, so useradd creates no home directory unless you pass `-m`, and Debian\'s /etc/default/useradd sets SHELL=/bin/sh. Prompting for a password and name is what Debian\'s separate `adduser` script does, not useradd. /etc/skel is copied only when a home directory is created. No tool adds new users to the sudo group automatically.' },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L22,
    stem: 'Refer to the exhibit. Today is December 5, 2026, and bob has not changed his password since October 1. What happens when bob logs in today with his current password?',
    exhibit: `srv01# chage -l bob
Last password change                                    : Oct 01, 2026
Password expires                                        : Nov 30, 2026
Password inactive                                       : Dec 10, 2026
Account expires                                         : never
Minimum number of days between password change          : 0
Maximum number of days between password change          : 60
Number of days of warning before password expires       : 7`,
    options: ['He is forced to choose a new password before the login completes', 'He logs in normally and sees a warning that his password will expire soon', 'The login is refused because the account has expired', 'The login is refused because the password is locked'],
    answer: [0],
    explanation: 'The password expired on November 30 (60 days after October 1), but the 10-day inactive period runs until December 10, so a login on December 5 is allowed only after he sets a new password. A warning without a forced change happens only in the 7 days before expiry. The account expiry is "never", so the account has not expired, and nothing in the output indicates a lock. After December 10 he would be unable to log in until an administrator intervened.' },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L22,
    stem: 'Enter the chage command that forces user bob to change his password at his next login.',
    answer: ['chage -d 0 bob', 'chage --lastday 0 bob'],
    explanation: 'Setting the last-change date to 0 (1 January 1970) makes the password look immediately expired, so bob must change it at the next login. `passwd -e bob` does the same thing, but the question asks for chage.' },
  { topic: '2.2', type: 'match', difficulty: 1, lesson: L22,
    stem: 'Match each file or directory to what it holds.',
    pairs: [['/etc/passwd', 'Account names, UIDs, primary GIDs, home directories and login shells'], ['/etc/shadow', 'Password hashes and password-aging fields'], ['/etc/group', 'Group names, GIDs and supplementary members'], ['/etc/login.defs', 'UID and GID ranges and aging defaults for new accounts'], ['/etc/skel', 'Files copied into each new home directory']],
    explanation: '/etc/passwd is world-readable and holds the seven account fields; the hashes moved to root-only /etc/shadow along with the aging fields. /etc/group lists each group and its supplementary members. /etc/login.defs supplies UID_MIN, SYS_UID_MAX, PASS_MAX_DAYS and similar defaults used by useradd. /etc/skel is the template directory for new homes.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L22,
    stem: 'User alice (UID 1001) runs /usr/bin/passwd, which has the mode -rwsr-xr-x and is owned by root. While it runs, what are the process\'s real and effective UIDs?',
    options: ['Real UID 1001, effective UID 0', 'Real UID 0, effective UID 1001', 'Real UID 0, effective UID 0', 'Real UID 1001, effective UID 1001'],
    answer: [0],
    explanation: 'The `s` in the owner execute position is the setuid bit: the program runs with the file owner (root) as its effective UID, which lets it update /etc/shadow, while the real UID stays that of the user who started it, so passwd knows whose password to change. Swapping them, or making both 0 or both 1001, does not describe setuid.' },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L22,
    stem: 'A contractor\'s engagement has ended. Which two commands expire his account so that no login method, including SSH keys, is accepted? (Choose two.)',
    options: ['chage -E 0 contractor', 'usermod -e 1 contractor', 'passwd -l contractor', 'usermod -L contractor', 'passwd -e contractor'],
    answer: [0, 1],
    explanation: 'Both `chage -E 0` and `usermod -e 1` set the account expiry field to a date in 1970, so the account is expired and PAM (and sshd) refuse every login. (pam_unix treats 0 as expired; shadow(5) recommends a nonzero value such as 1 because some tools read 0 as "never".) `passwd -l` and `usermod -L` only lock the password hash, which SSH key authentication never checks. `passwd -e` expires the password, which merely forces a password change at the next password login.' },

  // ---------- 2.3 ----------
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. The process table keeps filling with these entries. What should the administrator do?',
    exhibit: `srv01$ ps -o pid,ppid,stat,cmd -p 3120 --ppid 3120
    PID    PPID STAT CMD
   3120       1 Ss   /usr/local/bin/reportd
   3388    3120 Z    [report-worker] <defunct>
   3391    3120 Z    [report-worker] <defunct>`,
    options: ['Restart reportd (PID 3120), because it is not reaping its exited children', 'Run kill -9 3388 3391 to remove the zombies', 'Run renice -n 19 -p 3388 3391 so the zombies stop using CPU', 'Reboot, because zombies can only be cleared at boot'],
    answer: [0],
    explanation: 'State Z means the workers have already exited and are waiting for their parent, PID 3120, to collect their exit status with wait(). Fixing or restarting the parent clears them; if the parent exits, PID 1 adopts and reaps them. Signals, even KILL, do nothing to a process that is already dead. Zombies use no CPU, so renice is meaningless. A reboot is not required.' },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: L23,
    stem: 'Enter the number of the signal that `kill PID` sends when no signal is specified.',
    answer: ['15'],
    explanation: 'The default is SIGTERM (15), which a program can catch to shut down cleanly. SIGKILL (9) cannot be caught and is the last resort; SIGHUP (1) often makes a daemon reload its configuration.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. Which command resumes the tar job in the background?',
    exhibit: `srv01$ jobs -l
[1]+  4410 Stopped                 tar -czf /backup/etc.tgz /etc
[2]-  4425 Running                 rsync -a /srv/ backup01:/srv/ &`,
    options: ['bg %1', 'bg %2', 'fg %1', 'nohup %1'],
    answer: [0],
    explanation: '`bg %1` sends SIGCONT to job 1 and lets it continue in the background (a bare `bg` would do the same here, because bash keeps a stopped job as the current job, marked `+`). `bg %2` targets rsync, which is already running in the background. `fg %1` resumes tar but in the foreground, tying up the terminal. nohup starts a new command immune to hangups; it does not take a job specification.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'alice, an ordinary user, started a long job with `nice -n 10`. Which command can she run successfully against that process?',
    options: ['renice -n 15 -p 5120', 'renice -n 5 -p 5120', 'renice -n 0 -p 5120', 'renice -n -5 -p 5120'],
    answer: [0],
    explanation: 'Unprivileged users may only raise a process\'s nice value (lower its priority), so moving from 10 to 15 is allowed. Lowering it to 5 or 0, even though 0 was the original default, and any negative value require root (CAP_SYS_NICE).' },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L23,
    stem: 'Enter the five time fields of a crontab entry that runs a job at 02:30 every Sunday.',
    answer: ['30 2 * * 0', '30 2 * * 7', '30 2 * * sun', '30 02 * * 0', '30 02 * * 7', '30 02 * * sun'],
    explanation: 'The fields are minute, hour, day of month, month and day of week. Sunday is 0 or 7 (or the name sun), and the asterisks mean every day of the month and every month.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. What does the value 15 mean in this /etc/anacrontab entry?',
    exhibit: `# period  delay  job-identifier  command
7         15     weekly.report   /usr/local/bin/weekly-report.sh`,
    options: ['anacron waits 15 minutes after it starts before running the job', 'The job runs at 15:00 on the seventh day', 'The job is retried up to 15 times if it fails', 'anacron keeps 15 days of job history in /var/spool/anacron'],
    answer: [0],
    explanation: 'anacrontab fields are period in days (7, so weekly), delay in minutes before running a due job (15), a job identifier used for the timestamp file in /var/spool/anacron, and the command. anacron has no clock-time field, no retry counter, and its spool holds only the date each job last ran.' },
  { topic: '2.3', type: 'order', difficulty: 2, lesson: L23,
    stem: 'A long command is running in the foreground of an SSH session. Put the steps in order so that it keeps running after you log out.',
    items: ['Press Ctrl+z to stop the job', 'Run bg to resume it in the background', 'Run disown to remove it from the shell\'s job table', 'Log out of the session'],
    explanation: 'Ctrl+z sends SIGTSTP and returns the prompt; bg resumes the job in the background with SIGCONT; disown removes it from the job table so the shell does not send it SIGHUP on exit; then it is safe to log out. Starting the command with nohup (or in tmux) in the first place avoids the problem.' },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: L23,
    stem: 'Refer to the exhibit. The application runs as app.service under systemd and still fails with "Too many open files". What is the correct fix?',
    exhibit: `srv01$ cat /etc/security/limits.d/90-app.conf
svc_app  soft  nofile  65536
svc_app  hard  nofile  65536
srv01$ grep 'open files' /proc/$(pidof app)/limits
Max open files            1024                 524288               files`,
    options: ['Add LimitNOFILE=65536 to the [Service] section with systemctl edit app, then restart the service', 'Run ulimit -n 65536 in a root shell and restart the service', 'Change soft to hard in 90-app.conf so the limit is enforced', 'Run sysctl -w fs.file-max=65536'],
    answer: [0],
    explanation: '/etc/security/limits.conf and limits.d are applied by pam_limits to login sessions; systemd services do not go through PAM, so the service still has the default soft limit of 1024. The per-unit setting LimitNOFILE= is what applies. A ulimit in a shell affects only that shell and its children, not services started by systemd. The limits file is already correct for logins. fs.file-max is the system-wide total, not the per-process limit, and lowering it to 65536 would make things worse.' },

  // ---------- 2.4 ----------
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24A,
    stem: 'Refer to the exhibit. What is the best way to finish installing the package on this Ubuntu server?',
    exhibit: `srv01# dpkg -i monitor-agent_3.2_amd64.deb
Selecting previously unselected package monitor-agent.
(Reading database ... 48211 files and directories currently installed.)
Preparing to unpack monitor-agent_3.2_amd64.deb ...
Unpacking monitor-agent (3.2) ...
dpkg: dependency problems prevent configuration of monitor-agent:
 monitor-agent depends on libcurl4t64; however:
  Package libcurl4t64 is not installed.

dpkg: error processing package monitor-agent (--install):
 dependency problems - leaving unconfigured
Errors were encountered while processing:
 monitor-agent`,
    options: ['Run apt -f install so apt fetches the missing dependency and configures the package', 'Run dpkg -i --force-depends monitor-agent_3.2_amd64.deb', 'Run rpm -ivh --nodeps monitor-agent_3.2_amd64.deb', 'Run apt-mark hold monitor-agent'],
    answer: [0],
    explanation: 'dpkg installs a single file and never downloads dependencies, so it left the package unconfigured. `apt -f install` (fix broken) resolves and installs libcurl4t64 from the repositories and then configures monitor-agent; `apt install ./monitor-agent_3.2_amd64.deb` in the first place would have avoided the error. Forcing dependencies leaves a package that cannot run. rpm does not manage .deb packages. A hold only stops future upgrades.' },
  { topic: '2.4', type: 'fill', difficulty: 1, lesson: L24A,
    stem: 'On a RHEL 9 host, enter the rpm command that shows which installed package owns /etc/ssh/sshd_config.',
    answer: ['rpm -qf /etc/ssh/sshd_config', 'rpm -q -f /etc/ssh/sshd_config', 'rpm --query --file /etc/ssh/sshd_config', 'rpm -q --file /etc/ssh/sshd_config'],
    explanation: '`rpm -qf FILE` queries the package database for the package that installed the file (openssh-server). The Debian equivalent is `dpkg -S`. `dnf provides` also answers the question but searches repository metadata as well.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24A,
    stem: 'Refer to the exhibit. The vendor\'s repository has just been added on a RHEL 9 server. What should the administrator do?',
    exhibit: `srv01# dnf install monitor-agent
...
Public key for monitor-agent-3.2-1.el9.x86_64.rpm is not installed
The downloaded packages were saved in cache until the next successful transaction.
You can remove cached packages by executing 'dnf clean packages'.
Error: GPG check FAILED`,
    options: ['Obtain the vendor\'s signing key from a trusted source, check its fingerprint, import it with rpm --import (or set gpgkey= in the .repo file), and retry', 'Set gpgcheck=0 in the repository file so the install succeeds', 'Run dnf install --nogpgcheck monitor-agent', 'Run dnf clean packages and retry, because the download was corrupted'],
    answer: [0],
    explanation: 'dnf refuses the package because the key that signed it is not in the RPM keyring. Importing the genuine vendor key keeps signature checking on and lets the install proceed. Turning off gpgcheck or using --nogpgcheck makes the error go away by removing the protection against tampered packages, which is the wrong fix. The message is about a missing public key, not corruption, so cleaning the cache changes nothing.' },
  { topic: '2.4', type: 'multi', difficulty: 2, lesson: L24A,
    stem: 'A RHEL 9 server must be updated today with `dnf upgrade`, but no newer kernel packages may be installed. Which two approaches achieve this? (Choose two.)',
    options: ['Run dnf upgrade --exclude=\'kernel*\'', 'Add excludepkgs=kernel* to the [main] section of /etc/dnf/dnf.conf before running dnf upgrade', 'Run dnf upgrade --disableexcludes=all', 'Run apt-mark hold linux-image-generic', 'Run dnf upgrade --skip-broken'],
    answer: [0, 1],
    explanation: '`--exclude` leaves matching packages out of this one transaction, and `excludepkgs=` in dnf.conf (also accepted as `exclude=`) leaves them out of every transaction until removed. `--disableexcludes=all` does the opposite, ignoring any configured exclusions. apt-mark is the Debian tool. `--skip-broken` only skips packages with dependency problems; it does not target the kernel.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24A,
    stem: 'Refer to the exhibit. alice needs a newer version of the requests library than Ubuntu 24.04 packages, for her own script only. What should she do?',
    exhibit: `alice@web01:~$ pip install requests
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try apt install
    python3-xyz, where xyz is the package you are trying to
    install.`,
    options: ['Create a virtual environment with python3 -m venv and install requests with that environment\'s pip', 'Run sudo pip install requests', 'Run pip install --break-system-packages requests', 'Run apt install python3-requests'],
    answer: [0],
    explanation: 'The system Python is marked externally managed (PEP 668) so that pip does not overwrite files apt owns. A virtual environment is isolated, can hold any version from PyPI and affects only alice\'s script. sudo pip is blocked by the same check and would damage packaged Python if forced. --break-system-packages overrides the protection, risking exactly that conflict. The apt package gives only the distribution\'s version, not the newer one she needs.' },
  { topic: '2.4', type: 'single', difficulty: 1, lesson: L24A,
    stem: 'Two Java runtimes are installed on a Debian server. Which command lets the administrator choose interactively which one the java command runs?',
    options: ['update-alternatives --config java', 'apt-mark hold java', 'dpkg-reconfigure java', 'update-alternatives --display java'],
    answer: [0],
    explanation: '`update-alternatives --config java` lists the registered alternatives for the java link group and switches it to the one you pick (manual mode). apt-mark hold only stops upgrades. dpkg-reconfigure reruns a package\'s configuration questions and takes a package name, not a link group. `--display` shows the current choice without changing it.' },
  { topic: '2.4', type: 'match', difficulty: 2, lesson: L24A,
    stem: 'Match each command to what it does.',
    pairs: [['flatpak remote-add --if-not-exists flathub <url>', 'Add a repository of sandboxed desktop apps'], ['snap install code --classic', 'Install a snap without strict confinement'], ['flatpak override --user --nofilesystem=home <app>', 'Remove an app\'s access to the home directory'], ['snap revert <snap>', 'Return a snap to its previous revision'], ['chmod +x tool.AppImage', 'Make a single-file app runnable without installing it']],
    explanation: 'Flatpak remotes such as Flathub are added with remote-add, and permissions are tightened or loosened with override. Snaps are strictly confined unless installed with --classic, and snap revert rolls back to the previous revision. An AppImage is one self-contained file that you mark executable and run.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24B,
    stem: 'Refer to the exhibit. On an Ubuntu web server, requests for the shop site still return the default page. Which commands fix it?',
    exhibit: `web01$ ls /etc/apache2/sites-available/ /etc/apache2/sites-enabled/
/etc/apache2/sites-available/:
000-default.conf  default-ssl.conf  shop.conf

/etc/apache2/sites-enabled/:
000-default.conf`,
    options: ['a2ensite shop, then systemctl reload apache2', 'cp shop.conf /etc/httpd/conf.d/, then systemctl restart httpd', 'a2enmod shop, then systemctl reload apache2', 'apache2ctl configtest, then systemctl reload apache2'],
    answer: [0],
    explanation: 'On Debian and Ubuntu, Apache loads only the virtual hosts linked into sites-enabled. `a2ensite shop` creates that link and a reload applies it. /etc/httpd/conf.d and the httpd unit are the RHEL layout. a2enmod enables modules, not sites. configtest checks syntax but does not enable anything, so the reload would still serve the same sites.' },
  { topic: '2.4', type: 'single', difficulty: 2, lesson: L24B,
    stem: 'Refer to the exhibit. Which statement is true?',
    exhibit: `srv01$ chronyc sources
MS Name/IP address         Stratum Poll Reach LastRx Last sample
===============================================================================
^* ntp1.example.com              2   6   377    34   +215us[ +301us] +/-   18ms
^+ ntp2.example.com              2   6   377    35  -1203us[-1117us] +/-   25ms
^? 192.0.2.123                   0   8     0     -     +0ns[   +0ns] +/-    0ns`,
    options: ['chronyd is synchronised to ntp1.example.com, and 192.0.2.123 is not responding', 'chronyd is synchronised to ntp2.example.com because it has the larger offset', '192.0.2.123 is a stratum 0 reference clock and the most accurate source', 'The clock is not synchronised because one source is unreachable'],
    answer: [0],
    explanation: '`*` marks the selected source and `+` a source that is combined with it; `?` means connectivity has been lost, and a Reach of 0 confirms no replies. The stratum of 0 for 192.0.2.123 only reflects that no reply was received; it is not a reference clock. ntp2 is a combined candidate, not the selected one. Losing one of three sources does not stop synchronisation.' },
  { topic: '2.4', type: 'fill', difficulty: 1, lesson: L24B,
    stem: 'Enter the command that tests the Nginx configuration for syntax errors without reloading the server.',
    answer: ['nginx -t', 'sudo nginx -t'],
    explanation: '`nginx -t` parses nginx.conf and every included file and reports "syntax is ok" and "test is successful", or the file and line of the error. Run it before `systemctl reload nginx`. `nginx -T` also dumps the full configuration.' },
  { topic: '2.4', type: 'match', difficulty: 1, lesson: L24B,
    stem: 'Match each service to its standard port.',
    pairs: [['DNS', '53 (UDP and TCP)'], ['NTP', '123/UDP'], ['DHCP server', '67/UDP'], ['IMAP4 over TLS', '993/TCP'], ['SMTP message submission', '587/TCP']],
    explanation: 'DNS uses 53 over UDP, and TCP for large answers and zone transfers. NTP uses UDP 123. DHCP servers listen on UDP 67 and clients on 68. IMAP4 is 143, or 993 for IMAPS with implicit TLS. SMTP relay between servers is 25, and clients submit mail on 587 (or 465 with implicit TLS).' },

  // ---------- 2.5 ----------
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. What will happen to app.service at the next reboot, and what should the administrator do?',
    exhibit: `srv01$ systemctl status app
● app.service - Example application
     Loaded: loaded (/etc/systemd/system/app.service; disabled; preset: disabled)
     Active: active (running) since Sun 2026-11-22 09:14:02 UTC; 2h 5min ago
   Main PID: 2211 (app)`,
    options: ['It will not start at boot; run systemctl enable app', 'It will start at boot because it is running now', 'It will not start at boot; run systemctl unmask app', 'It will start at boot only after systemctl daemon-reload records its running state'],
    answer: [0],
    explanation: 'The Loaded line says disabled, so no [Install] symlinks exist and nothing will start it at boot, even though it is active now; enabled and active are independent. `systemctl enable app` creates the symlink (add `--now` to also start). The unit is not masked, so unmask does nothing. daemon-reload re-reads unit files; it does not turn running state into boot behaviour.' },
  { topic: '2.5', type: 'fill', difficulty: 1, lesson: L25,
    stem: 'An administrator edited /etc/systemd/system/app.service in vi. Enter the command that makes systemd re-read the changed unit file.',
    answer: ['systemctl daemon-reload', 'sudo systemctl daemon-reload'],
    explanation: '`systemctl daemon-reload` reloads all unit files and regenerates units from fstab. It does not restart the service; follow it with `systemctl restart app` for the new settings to take effect. `systemctl edit` runs the reload automatically, a hand edit does not.' },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'A server uses firewalld. The administrator must ensure that iptables.service cannot be started at all, whether by hand, at boot, or as a dependency of another unit. Which command does this?',
    options: ['systemctl mask iptables', 'systemctl disable iptables', 'systemctl stop iptables', 'systemctl disable --now iptables'],
    answer: [0],
    explanation: 'mask links the unit name to /dev/null in /etc/systemd/system, so every kind of activation fails until it is unmasked. disable only removes the boot-time symlinks; the unit can still be started manually or pulled in by another unit. stop affects only the running instance, and disable --now combines the two without blocking future starts.' },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. backup.timer is enabled. The server was powered off from 01:00 to 07:00 for maintenance. What happens when it boots at 07:00?',
    exhibit: `# /etc/systemd/system/backup.timer
[Unit]
Description=Nightly backup

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target`,
    options: ['backup.service runs shortly after boot because the 02:30 run was missed', 'Nothing runs until 02:30 the next night', 'backup.service runs once for every hour the server was off', 'The timer disables itself because its last trigger was missed'],
    answer: [0],
    explanation: 'Persistent=true stores the last trigger time on disk; at boot, if a scheduled time passed while the system was off, the service is started immediately, like anacron. Without Persistent=true it would wait until 02:30 the next night. Missed runs are caught up once, not once per hour, and timers never disable themselves.' },
  { topic: '2.5', type: 'multi', difficulty: 1, lesson: L25,
    stem: 'Boot has become slow on a server. Which two commands help identify which units delayed it? (Choose two.)',
    options: ['systemd-analyze blame', 'systemd-analyze critical-chain', 'systemctl list-timers', 'timedatectl timesync-status', 'hostnamectl status'],
    answer: [0, 1],
    explanation: '`systemd-analyze blame` lists units by how long they took to start, and `critical-chain` shows the chain of units that actually held up the default target (useful because units start in parallel). list-timers shows scheduled timer runs, timedatectl shows time synchronisation, and hostnamectl shows host identity; none of them report boot timing.' },
  { topic: '2.5', type: 'order', difficulty: 2, lesson: L25,
    stem: 'Without using systemctl edit, put these steps in order to override one setting of the vendor-supplied nginx.service.',
    items: ['Create the directory /etc/systemd/system/nginx.service.d/', 'Write override.conf in it with a [Service] section containing only the changed setting', 'Run systemctl daemon-reload', 'Run systemctl restart nginx', 'Confirm the result with systemctl cat nginx and systemctl status nginx'],
    explanation: 'A drop-in lives in /etc/systemd/system/<unit>.d/ and overrides only the settings it lists, so the vendor file in /usr/lib/systemd/system stays untouched for package upgrades. systemd must re-read units (daemon-reload) before a restart can use the new value, and systemctl cat shows the unit together with its drop-ins.' },
  { topic: '2.5', type: 'single', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. On this Ubuntu host, which command shows the DNS servers actually being used for each network interface?',
    exhibit: `web01$ grep -v '^#' /etc/resolv.conf
nameserver 127.0.0.53
options edns0 trust-ad
search example.com`,
    options: ['resolvectl status', 'systemctl status systemd-resolved', 'hostnamectl', 'timedatectl show'],
    answer: [0],
    explanation: '127.0.0.53 is the systemd-resolved stub listener, so /etc/resolv.conf does not show the real upstream servers. `resolvectl status` lists the global settings and each link\'s current DNS servers and search domains. systemctl status shows whether the resolver service is running, not its servers. hostnamectl reports host identity and timedatectl reports time settings.' },
  { topic: '2.5', type: 'fill', difficulty: 2, lesson: L25,
    stem: 'An administrator added net.ipv4.ip_forward = 1 to /etc/sysctl.d/90-router.conf. Enter the command that applies the settings from all sysctl configuration directories now, without a reboot.',
    answer: ['sysctl --system', 'sudo sysctl --system'],
    explanation: '`sysctl --system` reads every configuration file in the standard locations (/etc/sysctl.d, /run/sysctl.d, /usr/lib/sysctl.d and others, plus /etc/sysctl.conf), the same set that systemd-sysctl applies at boot. `sysctl -p` reads only /etc/sysctl.conf unless you name a file, and `sysctl -w` changes a single value at runtime without reading any file.' },
  { topic: '2.5', type: 'single', difficulty: 3, lesson: L25,
    stem: 'Refer to the exhibit. Why does the mount fail?',
    exhibit: `srv01# cat /etc/systemd/system/data.mount
[Mount]
What=/dev/vg_data/lv_data
Where=/srv/data
Type=xfs

[Install]
WantedBy=multi-user.target
srv01# systemctl daemon-reload
srv01# systemctl start data.mount
Failed to start data.mount: Unit data.mount has a bad unit file setting.
See system logs and 'systemctl status data.mount' for details.
srv01# journalctl -u data.mount -n 1 -o cat
data.mount: Where= setting doesn't match unit name. Refusing.`,
    options: ['A mount unit must be named after its mount point, so this one must be srv-data.mount', 'Mount units require an Options= line', 'The [Install] section is not allowed in mount units', 'xfs filesystems can only be mounted from /etc/fstab'],
    answer: [0],
    explanation: 'systemd requires a mount unit\'s name to be the escaped path of Where=; /srv/data becomes srv-data.mount (systemd-escape -p --suffix=mount /srv/data prints it). Options= is optional and defaults to the filesystem defaults. Mount units may have an [Install] section so they can be enabled. Any filesystem type can be mounted by a mount unit; fstab entries are themselves converted into mount units.' },

  // ---------- 2.6 ----------
  { topic: '2.6', type: 'single', difficulty: 2, lesson: L26A,
    stem: 'Refer to the exhibit. An image is built from this Dockerfile and tagged backup:1.0. What runs when an administrator executes `docker run --rm backup:1.0 --target /mnt --verbose`?',
    exhibit: `FROM docker.io/library/alpine:3.20
COPY backup.sh /usr/local/bin/backup.sh
ENTRYPOINT ["/usr/local/bin/backup.sh"]
CMD ["--target", "/data"]`,
    options: ['/usr/local/bin/backup.sh --target /mnt --verbose', '/usr/local/bin/backup.sh --target /data --target /mnt --verbose', '--target /mnt --verbose, with no script, so the container fails', '/usr/local/bin/backup.sh --target /data'],
    answer: [0],
    explanation: 'Arguments given after the image name replace CMD entirely and are appended to ENTRYPOINT, which stays fixed. The CMD values (--target /data) are used only when no arguments are given, so they are not merged with the new ones. Only without an ENTRYPOINT would the arguments replace the command itself, and ignoring the arguments altogether is not how either instruction works.' },
  { topic: '2.6', type: 'single', difficulty: 2, lesson: L26B,
    stem: 'Refer to the exhibit. SELinux is enforcing on this RHEL 9 host, and only this one container should use /srv/reports. What is the most appropriate fix?',
    exhibit: `[alice@srv01 ~]$ podman run --rm -v /srv/reports:/reports docker.io/library/alpine:3.20 ls /reports
ls: can't open '/reports': Permission denied
[alice@srv01 ~]$ ls -ldZ /srv/reports
drwxr-xr-x. 2 alice alice unconfined_u:object_r:var_t:s0 4096 Nov 22 09:10 /srv/reports`,
    options: ['Add :Z to the volume (-v /srv/reports:/reports:Z) so Podman relabels it privately for this container', 'Run chmod 777 /srv/reports', 'Add --privileged to the podman run command', 'Run setenforce 0 and add the mount again'],
    answer: [0],
    explanation: 'The Unix permissions already allow alice, so the denial comes from SELinux: container processes (container_t) cannot read var_t files. `:Z` relabels the content with a private container_file_t label for this container only (`:z` would share it with other containers). chmod changes Unix modes, not labels. --privileged disables SELinux separation for the container, and setenforce 0 disables enforcement for the whole host; both remove protection rather than fixing the label.' },
  { topic: '2.6', type: 'fill', difficulty: 1, lesson: L26A,
    stem: 'Enter the podman run option and argument that publish host port 8080 to port 80 inside the container.',
    answer: ['-p 8080:80', '--publish 8080:80', '--publish=8080:80', '-p8080:80'],
    explanation: 'The publish format is host:container, so 8080:80 makes the host listen on 8080 and forward to the container\'s port 80. The same option works with docker run. EXPOSE in a Dockerfile only documents a port, and -P publishes every exposed port to random host ports.' },
  { topic: '2.6', type: 'match', difficulty: 2, lesson: L26B,
    stem: 'Match each container network driver to its behaviour.',
    pairs: [['bridge', 'Private virtual switch with NAT to the outside; the default'], ['host', 'Uses the host\'s network stack directly, with no separate namespace'], ['none', 'Loopback interface only'], ['macvlan', 'Gives each container its own MAC address on the parent NIC\'s LAN'], ['ipvlan', 'Containers share the parent NIC\'s MAC address but get their own IP addresses'], ['overlay', 'Spans several Docker hosts using VXLAN, for Swarm services']],
    explanation: 'bridge is the default single-host network with NAT (user-defined bridges add name resolution). host removes network isolation, so port mapping is ignored. none leaves only lo. macvlan makes containers look like separate physical hosts with their own MACs; ipvlan does the same with one shared MAC where switches or clouds allow only one per port. overlay is the multi-host network used by Docker Swarm.' },
  { topic: '2.6', type: 'single', difficulty: 3, lesson: L26B,
    stem: 'Refer to the exhibit. No container uses the oldapp_data volume, yet it is still there after the prune. Why? (The host runs Docker Engine 29.)',
    exhibit: `srv01# docker volume ls
DRIVER    VOLUME NAME
local     oldapp_data
srv01# docker volume prune -f
Total reclaimed space: 0B
srv01# docker volume ls
DRIVER    VOLUME NAME
local     oldapp_data`,
    options: ['docker volume prune removes only unused anonymous volumes; named volumes need docker volume prune -a', 'The -f option makes prune run in dry-run mode', 'A stopped container must still be using it, because prune removes every unused volume', 'Volumes can only be removed with docker system prune'],
    answer: [0],
    explanation: 'Since Docker 23, volume prune deletes only anonymous volumes unless --all (-a) is given, to protect named data volumes; oldapp_data is named, so it survives. -f only skips the confirmation prompt. The question states no container uses it, so the explanation is not a stopped container. docker system prune touches volumes only with --volumes, and then also only anonymous ones; `docker volume rm oldapp_data` would remove it directly.' },
  { topic: '2.6', type: 'multi', difficulty: 2, lesson: L26B,
    stem: 'A web application container is being hardened. Which two docker run options reduce what an attacker who compromises the application can do? (Choose two.)',
    options: ['--cap-drop ALL', '--user 1001:1001', '--privileged', '--network host', '-v /:/host'],
    answer: [0, 1],
    explanation: 'Dropping all capabilities removes the powers that root inside a container keeps by default, and running as a non-root UID means the process is not root inside the container at all. --privileged does the opposite, granting every capability and device and disabling confinement. --network host removes network isolation. Bind-mounting / exposes the entire host filesystem.' },
  { topic: '2.6', type: 'single', difficulty: 3, lesson: L26B,
    stem: 'Refer to the exhibit. A process inside alice\'s rootless Podman container runs as UID 33 (www-data). Which UID owns that process on the host?',
    exhibit: `[alice@srv01 ~]$ id -u
1001
[alice@srv01 ~]$ grep alice /etc/subuid
alice:100000:65536
[alice@srv01 ~]$ podman unshare cat /proc/self/uid_map
         0       1001          1
         1     100000      65536`,
    options: ['100032', '33', '1001', '100033'],
    answer: [0],
    explanation: 'Each uid_map line is "container start, host start, count". Container UID 0 maps to alice (1001), and container UIDs from 1 upwards map to host UIDs from 100000, so container UID 33 is 100000 + (33 - 1) = 100032. It is not host UID 33, because rootless containers never use real host system UIDs, and only container root maps to 1001. 100033 forgets that the second range starts at container UID 1.' },
  { topic: '2.6', type: 'fill', difficulty: 1, lesson: L26A,
    stem: 'Enter the Dockerfile instruction that sets the user (name or UID) that later RUN steps and the running container use, so the application does not run as root.',
    answer: ['USER'],
    explanation: 'USER changes the identity for subsequent RUN, CMD and ENTRYPOINT instructions and for the container at run time. Without it (in this or the base image) the process runs as root inside the container; docker run --user overrides it at run time.' },
  { topic: '2.6', type: 'single', difficulty: 2, lesson: L26A,
    stem: 'Which component is the low-level OCI runtime that containerd calls to create a container\'s namespaces and cgroups and start its first process?',
    options: ['runC', 'containerd-shim', 'dockerd', 'Podman'],
    answer: [0],
    explanation: 'runC (or the alternative crun) is the OCI runtime: it reads the bundle\'s config.json, sets up namespaces and cgroups, starts the process and exits. The containerd shim sits between containerd and the container and keeps the container\'s stdio and exit status after runC has exited, but does not create namespaces. dockerd is Docker\'s API daemon, which hands work to containerd. Podman is a separate, daemonless engine that also calls an OCI runtime.' },

  // ---------- Performance-based additions (rule 7, review 2026-11-22) ----------
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L22,
    stem: 'Refer to the exhibit. On srv01 (RHEL 9), svc_backup must exist only to run the backup service: it gets a system UID and no home directory is created, and any interactive login must be refused with a short message. Enter the login shell that belongs in the blank (full path).',
    exhibit: `srv01# grep -E '^SYS_UID_(MIN|MAX)' /etc/login.defs
SYS_UID_MIN               201
SYS_UID_MAX               999
srv01# useradd -r -s ________ -d /var/lib/backup -M svc_backup`,
    answer: ['/usr/sbin/nologin', '/sbin/nologin'],
    explanation: '`nologin` prints a message that the account is not available (or the contents of /etc/nologin.txt) and exits with status 1, so it is the standard shell for service accounts. RHEL 9 has a merged /usr, so /sbin/nologin and /usr/sbin/nologin are the same file. `-r` takes the UID from the 201-999 system range and sets no password aging; `-M` creates no home even though RHEL sets CREATE_HOME yes. /bin/false also blocks logins but silently, and /bin/bash would allow them.' },
  { topic: '2.2', type: 'order', difficulty: 2, lesson: L22,
    stem: 'The contractor account on srv01 must be removed today. He may still be logged in, and he has an authorised SSH key. Put the steps in order.',
    items: ['usermod -L -e 1 contractor, to lock the password and expire the account', 'pkill -KILL -u contractor, to end his sessions and processes', 'userdel -r contractor, to delete the account, its home directory and mail spool', 'find / -xdev -nouser, to find files he owned outside his home'],
    explanation: 'Block new logins first: the lock alone would not stop his SSH key, but the expired account (expiry day 1 = 2 January 1970) makes PAM refuse every login method, so he cannot reconnect after his sessions are killed. userdel refuses to remove an account that still has running processes, so pkill must come before it. Once the account is gone, files elsewhere still carry his old UID with no name attached, which is exactly what `-nouser` finds. Copy anything from the home directory you need before `userdel -r`.' },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. On srv01 (Debian 13), svc_backup\'s database dump must run at 23:45 every Monday to Friday. Enter the five time fields that belong in the blank.',
    exhibit: `svc_backup@srv01:~$ crontab -l
# m  h  dom mon dow   command
________   /usr/local/bin/db-dump.sh`,
    answer: ['45 23 * * 1-5', '45 23 * * 1,2,3,4,5'],
    explanation: 'The fields are minute (45), hour (23), day of month, month and day of week; 1-5 is Monday to Friday (0 and 7 are Sunday), and the list 1,2,3,4,5 is the same set. Debian\'s cron accepts single day names but, as its crontab(5) says, not ranges or lists of names, so mon-fri is not portable (cronie on RHEL allows it). `23 45` would swap hour and minute and is invalid, because 45 is not an hour.' },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L23,
    stem: 'Refer to the exhibit. On srv01 (RHEL 9), /etc/ssh/sshd_config was changed and passed the syntax check. Enter the kill command that sends the hangup signal to the sshd listener so that it re-reads its configuration without ending existing sessions.',
    exhibit: `srv01# sshd -t
srv01# systemctl show -p MainPID sshd
MainPID=801`,
    answer: ['kill -HUP 801', 'kill -1 801', 'kill -SIGHUP 801', 'kill -s HUP 801', 'kill -s SIGHUP 801', 'kill -s 1 801', 'kill --signal HUP 801'],
    explanation: 'sshd rereads its configuration when it receives SIGHUP (signal 1) by re-executing itself; each logged-in session is a separate process, so it keeps running. kill accepts the signal by number, by name, or by name with the SIG prefix. A bare `kill 801` sends SIGTERM and stops the listener, and `kill -9` kills it without cleanup. `systemctl reload sshd` does the same as the HUP here, because the unit\'s ExecReload sends it. `sshd -t` printing nothing means the file is valid.' },
  { topic: '2.3', type: 'match', difficulty: 2, lesson: L23,
    stem: 'Match each symptom on srv01 to the command that confirms its cause.',
    pairs: [['PID 2290 has used no CPU for minutes and you want to see which system call it is blocked in', 'strace -p 2290'], ['You need every file and socket that PID 2290 holds open', 'lsof -p 2290'], ['top shows 25% total CPU on a 4-core host and you suspect one core is saturated', 'mpstat -P ALL 1'], ['You want PID 2290\'s CPU usage sampled once a second', 'pidstat -p 2290 1'], ['Worker processes keep appearing and you need to see which parent spawns them', 'pstree -p'], ['A service reports "Too many open files" and you need the limit actually in force', 'cat /proc/2290/limits']],
    explanation: '`strace -p` attaches to a running process and prints the system call it is in. `lsof -p` lists its open files and sockets. `mpstat -P ALL` reports each CPU separately, so one core at 100% shows even when the average is 25%. `pidstat -p PID 1` samples one process every second. `pstree -p` draws the process tree with PIDs. /proc/<PID>/limits shows the soft and hard limits of that process, which for a systemd service come from the unit, not limits.conf.' },
  { topic: '2.3', type: 'order', difficulty: 1, lesson: L23,
    stem: 'A developer started reportd by hand on srv01, and it ignores its own shutdown command. Put the steps in order so that it gets a chance to exit cleanly before it is forced to stop.',
    items: ['pgrep -a reportd, to find its PID (2290)', 'kill 2290, which sends SIGTERM', 'After a few seconds, ps -p 2290, which shows that it is still running', 'kill -9 2290, which sends SIGKILL'],
    explanation: 'Find the PID first; `pgrep -a` shows the full command line so you know it is the right process. SIGTERM (15, the default) can be caught, so the program can flush data and remove lock files. Only if it is still there after a short wait do you send SIGKILL (9), which cannot be caught or ignored and gives it no chance to clean up. Sending KILL first skips the clean shutdown altogether.' },
  { topic: '2.4', type: 'order', difficulty: 2, lesson: L24A,
    stem: 'On web02 (Ubuntu 24.04), /etc/apt/sources.list.d/example.sources already points at the vendor\'s repository with Signed-By: /etc/apt/keyrings/example.gpg, but that key file does not exist yet. Put the steps in order to install monitor-agent with signature checking intact.',
    items: ['curl -fsSL https://apt.example.com/key.asc -o /tmp/example.asc', 'gpg --show-keys /tmp/example.asc, and compare the fingerprint with the one the vendor publishes', 'gpg -o /etc/apt/keyrings/example.gpg --dearmor /tmp/example.asc', 'apt update', 'apt install monitor-agent'],
    explanation: 'Download the key to a scratch file, then check its fingerprint before trusting it: `gpg --show-keys` prints the key\'s details without importing it into any keyring. `--dearmor` converts the ASCII-armoured key to the binary keyring that Signed-By names; the file must be readable by the _apt user. Only then can `apt update` verify the repository\'s signed Release file, and the package can be installed from the refreshed lists. Because Signed-By ties the key to this one source, the key cannot sign packages for other repositories, unlike the deprecated apt-key.' },
  { topic: '2.4', type: 'fill', difficulty: 1, lesson: L24A,
    stem: 'Refer to the exhibit. The application on db01 (Ubuntu 24.04) is certified only for the installed PostgreSQL build, so apt upgrade must leave postgresql-16 alone until further notice. Enter the apt-mark command.',
    exhibit: `db01$ apt list --upgradable 2>/dev/null | grep postgresql
postgresql-16/noble-updates 16.6-0ubuntu0.24.04.1 amd64 [upgradable from: 16.4-0ubuntu0.24.04.2]
db01$ apt-mark showhold
db01$`,
    answer: ['apt-mark hold postgresql-16', 'sudo apt-mark hold postgresql-16'],
    explanation: '`apt-mark hold` marks the package as held back, so it is not automatically installed, upgraded or removed; `apt-mark showhold` then lists it, and `apt-mark unhold postgresql-16` releases it. A pin with a negative priority in /etc/apt/preferences.d/ is the heavier alternative. The RPM-family equivalents are `dnf versionlock add` or an excludepkgs= entry.' },
  { topic: '2.4', type: 'fill', difficulty: 2, lesson: L24A,
    stem: 'Refer to the exhibit. A third-party storage driver on srv01 (RHEL 9) supports only the installed kernel. Every future dnf transaction must ignore kernel packages from all repositories until the vendor certifies a newer one, without anyone passing an option. Enter the line to add to the [main] section.',
    exhibit: `srv01# cat /etc/dnf/dnf.conf
[main]
gpgcheck=1
installonly_limit=3
clean_requirements_on_remove=True
best=True
skip_if_unavailable=False
________`,
    answer: ['excludepkgs=kernel*', 'excludepkgs = kernel*', 'exclude=kernel*', 'exclude = kernel*'],
    explanation: '`excludepkgs=` (older spelling `exclude=`) in [main] removes matching packages from every operation for every repository; in a repository section it would apply to that repository only. `dnf upgrade --exclude=kernel*` would cover one command only, and `--disableexcludes=all` ignores the setting when you do want a new kernel. `dnf versionlock add` (plugin) is the alternative that pins exact versions.' },
  { topic: '2.5', type: 'order', difficulty: 2, lesson: L25,
    stem: 'On srv01, /usr/local/bin/backup.sh must move from cron to systemd: it should run every night at 02:30 and catch up after downtime. Put the steps in order.',
    items: ['Write /etc/systemd/system/backup.service (Type=oneshot, ExecStart=/usr/local/bin/backup.sh) and backup.timer (OnCalendar=*-*-* 02:30:00, Persistent=true)', 'systemctl daemon-reload', 'systemctl enable --now backup.timer', 'systemctl list-timers backup.timer, to check the next run time', 'After the first run, journalctl -u backup.service, to read the script\'s output'],
    explanation: 'systemd only knows about new unit files after `daemon-reload`. You enable and start the timer, not the service: the timer\'s [Install] section (WantedBy=timers.target) makes it start at boot, and it activates backup.service, the service with the same name, when it elapses. `list-timers` confirms the next trigger, and because the service\'s output goes to the journal, journalctl shows each run. Persistent=true runs a missed 02:30 job at the next boot.' },
  { topic: '2.5', type: 'fill', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. The drop-in on srv01 must replace the vendor\'s command so the application listens on port 9090. As written, the service has two ExecStart= commands and refuses to start, because it is not Type=oneshot. Enter the line that belongs in the blank.',
    exhibit: `srv01# systemctl cat app.service
# /usr/lib/systemd/system/app.service
[Unit]
Description=Example application

[Service]
ExecStart=/opt/app/bin/app --port 8080

[Install]
WantedBy=multi-user.target

# /etc/systemd/system/app.service.d/override.conf
[Service]
________
ExecStart=/opt/app/bin/app --port 9090`,
    answer: ['ExecStart='],
    explanation: 'ExecStart= is a list setting: a drop-in adds to it, and every service type except oneshot needs exactly one command. Assigning the empty string resets the list, so `ExecStart=` followed by the new line leaves only the 9090 command. After editing by hand run `systemctl daemon-reload` and restart the service (`systemctl edit app` reloads for you). Editing /usr/lib/systemd/system/app.service instead would be overwritten by the next package update.' },
  { topic: '2.5', type: 'fill', difficulty: 2, lesson: L25,
    stem: 'Refer to the exhibit. report.service on srv01 must run at 06:00 on Monday to Friday only. Enter the OnCalendar= value that belongs in the blank.',
    exhibit: `srv01# cat /etc/systemd/system/report.timer
[Unit]
Description=Weekday morning report

[Timer]
OnCalendar=________
Persistent=true

[Install]
WantedBy=timers.target`,
    answer: ['Mon..Fri 06:00', 'Mon..Fri 6:00', 'Mon..Fri 06:00:00', 'Mon..Fri *-*-* 06:00', 'Mon..Fri *-*-* 06:00:00', 'Mon,Tue,Wed,Thu,Fri 06:00', 'Mon,Tue,Wed,Thu,Fri *-*-* 06:00:00', 'Monday..Friday 06:00', 'Monday..Friday *-*-* 06:00:00'],
    explanation: 'A calendar expression is an optional weekday part, a date and a time; an omitted date means every day, and omitted seconds are 0. In the weekday part two days joined by ".." form a range and commas separate days, so Mon..Fri and the five-day list are the same; day names may be abbreviated or full. All these forms normalise to `Mon..Fri *-*-* 06:00:00`, which `systemd-analyze calendar \'Mon..Fri 06:00\'` prints together with the next elapse time. A cron-style "Mon-Fri" is not the systemd range syntax.' },
  { topic: '2.6', type: 'order', difficulty: 2, lesson: L26A,
    stem: 'On build01, a new version of the app image must be built, tested locally with its data volume and published port, and pushed to registry.example.com only after the test passes. Put the commands in order.',
    items: ['podman build -t localhost/app:1.4 .', 'podman run -d --name app-test -p 8080:8080 -v appdata:/var/lib/app localhost/app:1.4', 'curl -s http://localhost:8080/health', 'podman tag localhost/app:1.4 registry.example.com/web/app:1.4', 'podman push registry.example.com/web/app:1.4'],
    explanation: 'The image must exist before a container can run from it. `-p 8080:8080` publishes host port 8080 to the container\'s 8080 (host first), and `-v appdata:/var/lib/app` mounts the named volume, which Podman creates if it does not exist. The health check needs the running container. Tagging adds the registry name to the same image without rebuilding it, and push uploads it under that name, so both follow a passing test.' },
  { topic: '2.6', type: 'fill', difficulty: 2, lesson: L26A,
    stem: 'Refer to the exhibit. The current image on build01 runs its process as root. Enter the Dockerfile instruction that belongs in the blank so that the application runs as the app account created earlier in the file.',
    exhibit: `build01$ cat Dockerfile
FROM docker.io/library/python:3.12-slim
RUN useradd --uid 1001 --no-create-home app
WORKDIR /app
COPY app.py .
________
ENTRYPOINT ["python3", "app.py"]
build01$ podman run --rm --entrypoint id localhost/app:1.5
uid=0(root) gid=0(root) groups=0(root)`,
    answer: ['USER app', 'USER 1001', 'USER app:app'],
    explanation: 'USER sets the user (name or UID, optionally with a group) for the later instructions of the stage and for the ENTRYPOINT and CMD at run time. It goes after the RUN that creates the account and after the steps that need root, and before ENTRYPOINT. On Debian, useradd also creates a group named app, so app:app gives the same identity; a bare UID that has no primary group would run with the root group. `docker run --user` or `podman run --user` can override it at run time.' },
  { topic: '2.6', type: 'fill', difficulty: 2, lesson: L26B,
    stem: 'Refer to the exhibit. On web04 (RHEL 9, SELinux enforcing), only this one container uses /srv/web/html, and it must not be able to change the content. Enter the volume options that belong in the blank.',
    exhibit: `[alice@web04 ~]$ ls -ldZ /srv/web/html
drwxr-xr-x. 2 alice alice unconfined_u:object_r:var_t:s0 4096 Nov 22 09:10 /srv/web/html
[alice@web04 ~]$ podman run -d --name site -p 8080:80 -v /srv/web/html:/usr/share/nginx/html:________ docker.io/library/nginx:1.27`,
    answer: ['ro,Z', 'Z,ro'],
    explanation: 'The volume options are a comma-separated list in any order. `ro` mounts the content read-only inside the container. `Z` relabels it with a private label that only this container can use, which fixes the denial caused by var_t; lowercase `z` would apply a shared label for several containers. Without a relabel option Podman leaves the label alone, so the container gets permission denied even with mode 755. `:O` would give a throwaway writable overlay instead.' },
  { topic: '2.6', type: 'match', difficulty: 2, lesson: L26A,
    stem: 'Match each container problem or task on build01 to the command that confirms or achieves it.',
    pairs: [['The web container exited seconds after starting and you need its error output', 'podman logs web'], ['You need the environment variables and mounts the container was started with', 'podman inspect web'], ['You want a shell inside the running container to read a config file', 'podman exec -it web /bin/sh'], ['Clients get connection refused and you need to see which host port maps to container port 80', 'podman port web'], ['You want to see which build instructions produced each layer of an image', 'podman history localhost/app:1.4'], ['podman run --name web fails because the name is in use, and nothing named web is running', 'podman ps -a']],
    explanation: '`logs` prints what the container wrote to stdout and stderr, even after it exited. `inspect` returns the full JSON, including Config.Env and Mounts. `exec -it` starts an extra interactive process in a running container. `port` lists the published mappings. `history` shows the layers and the instruction that created each. Plain `ps` shows only running containers; `ps -a` reveals the stopped one that still holds the name (remove it with `podman rm web`).' },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
