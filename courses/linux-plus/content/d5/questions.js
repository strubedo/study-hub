// Domain 5 — Troubleshooting. Original questions. Exhibits marked as captured in REVIEW-TODO.md come from real runs on 2026-11-22 (throwaway Rocky Linux 9.9 / Debian 13 containers, scratch image files, read-only commands on a Ubuntu 26.10 host) with identities replaced by placeholders; all other exhibits are written to the formats documented in the man pages and vendor documentation.
const L51 = '5.1-monitoring-alerting';
const L52A = '5.2-boot-kernel-hardware';
const L52B = '5.2-storage-packages-processes';
const L53A = '5.3-interfaces-links-addressing';
const L53B = '5.3-routing-dns-dhcp-firewalls';
const L54A = '5.4-selinux-permissions-accounts';
const L54B = '5.4-remote-access-certs-patching';
const L55A = '5.5-cpu-memory-load';
const L55B = '5.5-disk-network-application-baselines';

const bank = [
  // ---------- 5.1 Monitoring ----------
  { topic: '5.1', type: 'single', difficulty: 1, lesson: L51,
    stem: 'A hosting contract for a customer portal states: "Monthly availability of at least 99.5%. If availability falls below this level, the customer receives a 10% service credit." Internally, the operations team aims for 99.9% and measures the share of successful HTTP requests every minute. What is the contract clause?',
    options: ['A service level indicator (SLI)', 'A service level objective (SLO)', 'A service level agreement (SLA)', 'An error budget'],
    answer: [2],
    explanation: 'A commitment to a customer with a consequence (the service credit) is a **service level agreement**. The 99.9% internal target is the **SLO**, set stricter than the SLA so the team reacts before the contract is breached. The share of successful requests is the **SLI**, the measurement itself. The error budget is the allowed shortfall below the SLO (100% − 99.9%), not a contract term.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51,
    stem: 'Refer to the exhibit. The network monitoring server nms01 (192.0.2.50) times out when it polls srv01 with SNMPv3, although the user and passphrases are correct. firewalld on srv01 allows the snmp service. What is the cause?',
    exhibit: `[root@srv01 ~]# grep -v '^#' /etc/snmp/snmpd.conf | grep .
agentaddress  udp:127.0.0.1:161
rouser        nmsuser priv
[root@srv01 ~]# ss -ulnp | grep 161
UNCONN 0      0          127.0.0.1:161        0.0.0.0:*    users:(("snmpd",pid=1311,fd=6))`,
    options: ['The rouser line must say authpriv, so the agent rejects encrypted requests', 'SNMP polling uses UDP 162, so the agent should listen there', 'snmpd is listening only on the loopback address, so requests from nms01 never reach it; set agentaddress to udp:161 (or the server\'s address) and restart snmpd', 'SNMPv3 requires a community string in addition to the user'],
    answer: [2],
    explanation: '`agentaddress udp:127.0.0.1:161` binds the agent to loopback, and `ss` confirms it, so remote polls go unanswered and time out. Listening on `udp:161` (all addresses) or the management address fixes it. In Net-SNMP the `rouser` security levels are `noauth`, `auth` and `priv`; `priv` is authPriv. Polling uses UDP 161; UDP 162 is where managers receive traps and informs. SNMPv3 uses users instead of community strings.' },
  { topic: '5.1', type: 'multi', difficulty: 2, lesson: L51,
    stem: 'Which two statements about SNMP notifications are true? (Choose two.)',
    options: ['A trap is sent by the agent to the manager without waiting for an acknowledgement', 'Traps are sent by the manager to the agent on UDP 161 to request a value', 'An inform is an acknowledged notification, so the agent can resend it if no response arrives', 'A MIB is the encrypted channel that SNMPv3 uses to protect traps', 'Traps can only be sent with SNMPv1'],
    answer: [0, 2],
    explanation: 'Traps are unsolicited, unacknowledged messages from the agent to the manager (normally to UDP 162). Informs (SNMPv2c and v3) are acknowledged by the receiver and retransmitted if not. Managers request values with GET/GETNEXT/GETBULK to UDP 161; that is polling, not a trap. A MIB is the schema that names the OIDs, not an encrypted channel. Traps exist in v1, v2c and v3.' },
  { topic: '5.1', type: 'match', difficulty: 2, lesson: L51,
    stem: 'The team monitoring web01 has five requirements. Match each requirement to the mechanism that meets it.',
    pairs: [
      ['The load balancer stops sending traffic to web01 when GET /healthz fails three times', 'Health check'],
      ['The chat channel receives a JSON POST whenever an alert fires', 'Webhook'],
      ['The core switch notifies the NMS immediately when web01\'s uplink port goes down', 'SNMP trap'],
      ['web01\'s logs can still be searched after the host has crashed', 'Log aggregation'],
      ['Prometheus scrapes node_exporter on web01 every 15 seconds', 'Agent-based pull collection'],
    ],
    explanation: 'A **health check** tests real function and lets the load balancer remove a failing backend. A **webhook** is an HTTP POST to a URL when an event happens. A switch reporting a link change on its own initiative is an **SNMP trap** (UDP 162). Shipping logs to a central store (rsyslog forwarding, Loki, ELK) is **log aggregation**, which survives the loss of the host. node_exporter is software installed on the host (an agent) that Prometheus pulls from.' },
  { topic: '5.1', type: 'fill', difficulty: 2, lesson: L51,
    stem: 'The SLO for an API is 99.9% availability measured over a 30-day window. How many minutes of unavailability does the error budget allow in that window? Enter the number.',
    answer: ['43.2', '43', '43.2 minutes', '43 minutes'],
    explanation: '30 days × 24 h × 60 min = 43,200 minutes; 0.1% of that is **43.2 minutes**. When the budget is used up, teams usually stop risky changes until reliability recovers.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51,
    stem: 'Refer to the exhibit. The root filesystem on web01 reached 95% for four minutes during a log burst and then dropped back to 70%. No notification was sent. Why?',
    exhibit: `- alert: RootFilesystemAlmostFull
  expr: (1 - node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}) * 100 > 90
  for: 10m
  labels:
    severity: critical`,
    options: ['The expression must use node_filesystem_free_bytes, because avail_bytes ignores reserved blocks', 'The condition has to stay true for 10 minutes before the alert fires; a four-minute spike stays pending and is discarded', 'Alerts with severity critical are sent only by e-mail, never by chat', 'Prometheus evaluates rules only once per hour'],
    answer: [1],
    explanation: '`for: 10m` is a duration condition: the alert is pending while the expression is true and fires only if it is still true after 10 minutes. It stops short spikes from paging people. Using `avail_bytes` is correct (it is what non-root users can use). Routing by severity is configured in Alertmanager and is not limited to e-mail. Rule evaluation runs at the configured `evaluation_interval`, typically every 15 seconds to a minute.' },
  { topic: '5.1', type: 'single', difficulty: 1, lesson: L51,
    stem: 'A storage appliance in the data center runs a vendor operating system on which no third-party software may be installed. Which approach can monitor its health and interface counters?',
    options: ['Poll it agentlessly over SNMP (preferably SNMPv3) and receive its traps', 'Install the Zabbix agent through the appliance\'s package manager', 'Deploy Prometheus node_exporter in a container on the appliance', 'Forward its kernel journal with systemd-journal-upload'],
    answer: [0],
    explanation: 'Agentless monitoring uses protocols the device already speaks: SNMP polling and traps, ICMP, HTTP or SSH checks. Installing an agent (Zabbix, node_exporter) is ruled out by the vendor restriction. systemd-journal-upload would also be software on the appliance, and it may not run systemd at all; appliances typically send syslog instead.' },
  { topic: '5.1', type: 'single', difficulty: 2, lesson: L51,
    stem: 'The on-call engineer for the srv01 cluster is paged about 40 times a night by an alert "CPU above 80%". Almost every page clears by itself within a minute, and real incidents have been missed. Which change best fixes the alerting?',
    options: ['Lower the threshold to 70% so problems are caught earlier', 'Send every alert to every member of the team instead of only on-call', 'Remove CPU alerting and rely on users reporting slowness', 'Alert on a user-facing SLI or on sustained saturation (for example a duration of 10 minutes and a run queue above the CPU count), send warnings to a ticket or chat channel and page only critical alerts'],
    answer: [3],
    explanation: 'This is alert fatigue: noisy, non-actionable pages hide real ones. Duration conditions remove brief spikes, saturation or SLI-based alerts describe real impact, and severity routing keeps the pager for critical events. A lower threshold creates more noise. Paging the whole team spreads the fatigue. Relying on users is the opposite of monitoring.' },

  // ---------- 5.2 Hardware, storage and OS ----------
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. /data on srv01 is a dedicated filesystem used only by the application\'s log writer. Why do df and du disagree, and what frees the space?',
    exhibit: `[root@srv01 ~]# df -h /data
Filesystem                 Size  Used Avail Use% Mounted on
/dev/mapper/vg_data-lv_log  200G  150G   50G  75% /data
[root@srv01 ~]# du -sh /data
1.2G	/data
[root@srv01 ~]# lsof +L1
COMMAND   PID   USER FD   TYPE DEVICE     SIZE/OFF NLINK  NODE NAME
appwrite 2214 svcapp 4w   REG  253,3 158913789952     0  1403 /data/app.log (deleted)`,
    options: ['The filesystem has run out of inodes; delete small files to free them', 'du does not count files owned by service accounts; run it as svcapp', 'The journal of the filesystem holds 149 GB; run fsck to replay it', 'A deleted log file is still open by PID 2214, so its blocks are not freed; restart the application (or truncate the file through /proc/2214/fd/4)'],
    answer: [3],
    explanation: '`lsof +L1` lists open files with a link count of 0: the 148 GiB `app.log` was deleted while `appwrite` kept writing to it. df counts its blocks, du (which walks directory entries) cannot see it. Restarting the process closes the descriptor; truncating `/proc/2214/fd/4` frees the space immediately. Inode exhaustion shows in `df -i`, not as a df/du gap. du as root sees every file. A journal is small and fixed-size, and fsck must not be run on a mounted filesystem.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. On srv01 the queue directory /var/spool/app reports "No space left on device", yet df shows plenty of free space. Enter the df command, including its option, that confirms the most likely cause.',
    exhibit: `[root@srv01 ~]# touch /var/spool/app/msg-884120
touch: cannot touch '/var/spool/app/msg-884120': No space left on device
[root@srv01 ~]# df -h /var/spool/app
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/vg_sys-spool  20G  7.9G   12G  40% /var/spool/app
[root@srv01 ~]# ls /var/spool/app | wc -l
1310711`,
    answer: ['df -i', 'df --inodes', 'df -i /var/spool/app', 'df --inodes /var/spool/app'],
    explanation: '`df -i` (`--inodes`) shows inode use; with 1.3 million tiny files the ext4 filesystem has used every inode while 12 GB of blocks are free, and `IUse%` shows 100%. Delete or archive files (find the directory with `du --inodes`); for the long term, recreate the filesystem with more inodes (`mkfs.ext4 -i` or `-N`) or use XFS, which allocates inodes dynamically.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. What is the most likely reason reportd.service fails on srv01?',
    exhibit: `[root@srv01 ~]# systemctl status reportd.service
× reportd.service - Nightly report generator
     Loaded: loaded (/etc/systemd/system/reportd.service; enabled; preset: disabled)
     Active: failed (Result: exit-code) since Sun 2026-11-22 02:00:03 UTC; 7h ago
    Process: 4120 ExecStart=/opt/report/bin/reportd --nightly (code=exited, status=203/EXEC)
   Main PID: 4120 (code=exited, status=203/EXEC)`,
    options: ['The account named in User= does not exist', 'The program ran and returned exit code 203 because the report failed', 'The unit file has a syntax error, so systemd could not load it', 'systemd could not execute /opt/report/bin/reportd: the file is missing, not executable, or has a bad interpreter line'],
    answer: [3],
    explanation: 'Status `203/EXEC` is systemd\'s own code for a failed `execve()` of the `ExecStart=` binary: wrong path, missing execute bit, a script whose `#!` interpreter does not exist, or a `noexec` mount. A missing `User=` account gives `217/USER`. The program never ran, so 203 is not its exit code. `Loaded: loaded` shows the unit file parsed; a syntax problem would show `bad-setting` or an error at load.' },
  { topic: '5.2', type: 'order', difficulty: 2, lesson: L52B,
    stem: 'The kernel on db01 logged XFS corruption warnings for /data (/dev/vg_data/lv_data). The application has been stopped. Put the repair steps in the correct order.',
    items: ['umount /data', 'xfs_repair -n /dev/vg_data/lv_data', 'xfs_repair /dev/vg_data/lv_data', 'mount /data', 'Check the kernel log and the application data, and restore from backup anything lost'],
    explanation: 'Repairs must run on an **unmounted** filesystem, so unmount first. `xfs_repair -n` is the no-modify dry run that shows what would change. The real `xfs_repair` then fixes it (if it complains about a dirty log, mount and unmount once to replay it; `-L` is a last resort). Mount again, check `dmesg` and the data, and restore anything `xfs_repair` moved to `lost+found` or could not recover. `fsck.xfs` does nothing by design, so `fsck` is not the tool for XFS.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. Users on srv01 report "Read-only file system" when saving to /home. What should the administrator do?',
    exhibit: `[root@srv01 ~]# dmesg -T | grep -i ext4 | tail -3
[Sun Nov 22 08:41:17 2026] EXT4-fs error (device dm-3): ext4_lookup:1855: inode #2: comm smbd: deleted inode referenced: 1837410
[Sun Nov 22 08:41:17 2026] Aborting journal on device dm-3-8.
[Sun Nov 22 08:41:17 2026] EXT4-fs (dm-3): Remounting filesystem read-only`,
    options: ['Run mount -o remount,rw /home immediately so users can keep working', 'Check the underlying disk, then unmount /home, run e2fsck -f on its device, and remount it after the repair', 'Run xfs_repair on /dev/dm-3', 'Set the immutable attribute on /home so no further damage can occur'],
    answer: [1],
    explanation: 'ext4 found metadata corruption, aborted the journal and remounted read-only to protect the data. The fix is to find the cause (check `smartctl` and I/O errors for the disk under dm-3), unmount, repair with `e2fsck -f`, and remount. Forcing `remount,rw` on a filesystem with an aborted journal fails or risks more damage. `xfs_repair` is for XFS, not ext4. The immutable attribute applies to files, would block users entirely and repairs nothing.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. srv01 was updated last night and now stops on the console with this message. What is the best recovery?',
    exhibit: `[    2.418302] VFS: Cannot open root device "mapper/rhel-root" or unknown-block(0,0): error -6
[    2.418817] Please append a correct "root=" boot option; here are the available partitions:
[    2.419160] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)`,
    options: ['Boot the previous kernel from the GRUB menu, then rebuild the new kernel\'s initramfs with dracut -f --kver <new-version> (and check that /boot was not full)', 'Run xfs_repair on the root logical volume from the GRUB command line', 'Add systemd.unit=rescue.target to the kernel command line and reboot', 'Reinstall GRUB to the disk with grub2-install'],
    answer: [0],
    explanation: '`unknown-block(0,0)` with no partitions listed means the kernel has no driver for the root device: typically a missing or incomplete initramfs for the new kernel (an interrupted update or a full `/boot`). Boot the older kernel, which still works, and rebuild with `dracut -f --kver` (`update-initramfs -u -k` on Debian/Ubuntu). The root filesystem is not the problem, and GRUB has no `xfs_repair`. `rescue.target` is a systemd target and systemd never starts because the kernel panics first. GRUB itself worked: it loaded the kernel.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. On the Ubuntu server web01, enter the command that regenerates /boot/grub/grub.cfg so the change takes effect at the next boot.',
    exhibit: `alice@web01:~$ sudo grep CMDLINE_LINUX_DEFAULT /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="console=tty0 console=ttyS0,115200n8"
alice@web01:~$ sudo ____________
Sourcing file \`/etc/default/grub'
Generating grub configuration file ...
Found linux image: /boot/vmlinuz-6.8.0-88-generic
Found initrd image: /boot/initrd.img-6.8.0-88-generic
done`,
    answer: ['update-grub', 'sudo update-grub', 'grub-mkconfig -o /boot/grub/grub.cfg', 'sudo grub-mkconfig -o /boot/grub/grub.cfg'],
    explanation: 'On Debian and Ubuntu `update-grub` is a wrapper for `grub-mkconfig -o /boot/grub/grub.cfg`, which reads `/etc/default/grub` and the scripts in `/etc/grub.d/`. On RHEL the generator is `grub2-mkconfig -o /boot/grub2/grub.cfg`, and kernel arguments for existing kernels are normally changed with `grubby --update-kernel=ALL --args=...` because they live in the BLS entries.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. The administrator has corrected the bug in exporter.service on srv01. What must be done before systemctl start will try the unit again?',
    exhibit: `Nov 22 10:12:01 srv01 systemd[1]: exporter.service: Main process exited, code=exited, status=1/FAILURE
Nov 22 10:12:01 srv01 systemd[1]: exporter.service: Failed with result 'exit-code'.
Nov 22 10:12:01 srv01 systemd[1]: exporter.service: Scheduled restart job, restart counter is at 5.
Nov 22 10:12:01 srv01 systemd[1]: exporter.service: Start request repeated too quickly.
Nov 22 10:12:01 srv01 systemd[1]: exporter.service: Failed with result 'start-limit-hit'.
Nov 22 10:12:01 srv01 systemd[1]: Failed to start exporter.service - Metrics exporter.`,
    options: ['Run systemctl mask exporter.service and then systemctl start', 'Reboot, because the start limit can only be cleared at boot', 'Run systemctl reset-failed exporter.service (after daemon-reload if the unit file changed), then start it', 'Increase TimeoutStartSec= in the unit'],
    answer: [2],
    explanation: 'The unit crashed repeatedly, hit `StartLimitBurst=` within `StartLimitIntervalSec=`, and systemd refuses further starts with `start-limit-hit`. `systemctl reset-failed` clears the counter and failed state (wait for the interval to pass also works). Masking prevents the unit from starting at all. A reboot is not required. The unit failed with exit status 1, not a timeout, so `TimeoutStartSec=` is irrelevant.' },
  { topic: '5.2', type: 'multi', difficulty: 2, lesson: L52A,
    stem: 'Refer to the exhibit. The new 10 GbE adapter in srv01 has no network interface. Which two commands help identify why no driver is bound? (Choose two.)',
    exhibit: `[root@srv01 ~]# lspci -k -s 03:00.0
03:00.0 Ethernet controller: Intel Corporation Ethernet Controller X710 for 10GbE SFP+ (rev 02)
	Subsystem: Intel Corporation Ethernet Converged Network Adapter X710-2
	Kernel modules: i40e`,
    options: ['lsmod | grep i40e', 'grep -r i40e /etc/modprobe.d/ /usr/lib/modprobe.d/', 'ethtool -s ens1f0 autoneg on', 'df -i /lib/modules', 'ip route show default'],
    answer: [0, 1],
    explanation: 'A `Kernel modules:` line without `Kernel driver in use:` means a suitable module exists but is not bound. `lsmod` shows whether `i40e` is loaded, and searching the modprobe configuration finds a `blacklist i40e` or `install i40e /bin/false` line that prevents loading. There is no interface yet, so `ethtool` has nothing to configure. Inode usage of `/lib/modules` and the routing table do not affect driver binding.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. What is the correct way to install acme-agent on srv01?',
    exhibit: `[root@srv01 ~]# dnf install ./acme-agent-2.4.1-1.el9.noarch.rpm
Last metadata expiration check: 0:00:09 ago on Sun Nov 22 15:28:38 2026.
Error:
 Problem: conflicting requests
  - nothing provides libacme-client >= 3.0 needed by acme-agent-2.4.1-1.el9.noarch from @commandline
(try to add '--skip-broken' to skip uninstallable packages or '--nobest' to use not only best candidate packages)`,
    options: ['Install it with rpm -ivh --nodeps', 'Run dnf install --skip-broken ./acme-agent-2.4.1-1.el9.noarch.rpm', 'Run dnf clean all and retry, because the metadata is stale', 'Enable the vendor repository that provides libacme-client 3.0 or later (dnf provides can confirm), then install the package again'],
    answer: [3],
    explanation: 'No enabled repository offers a package that provides `libacme-client >= 3.0`, so dnf cannot satisfy the dependency. Enabling the repository that ships it (vendor repo, EPEL or CRB as appropriate) lets dnf resolve it; `dnf provides libacme-client` shows where it comes from once the repo is enabled. `--nodeps` installs a package that will not work and leaves the RPM database inconsistent. `--skip-broken` would simply skip acme-agent. The metadata was refreshed nine seconds earlier, so cleaning it changes nothing.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. A batch job on app01 died. Enter the name of the signal that terminated it.',
    exhibit: `[svc_batch@app01 ~]$ ./run-import.sh
./run-import.sh: line 14:  8812 Killed                  /opt/import/bin/importer --all
[svc_batch@app01 ~]$ echo $?
137`,
    answer: ['SIGKILL', 'KILL', '9', 'SIGKILL (9)', 'signal 9'],
    explanation: 'Shells report death by signal as 128 + the signal number: 137 − 128 = 9, **SIGKILL**, which bash prints as `Killed`. 139 would be SIGSEGV (11) and 143 SIGTERM (15). An unexplained SIGKILL is very often the OOM killer, a cgroup `MemoryMax=` limit or systemd-oomd; check `journalctl -k -g "killed process"` and `journalctl -u systemd-oomd`.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. What happened to the process on srv01?',
    exhibit: `kernel: python3 invoked oom-killer: gfp_mask=0xcc0(GFP_KERNEL), order=0, oom_score_adj=0
kernel: oom-kill:constraint=CONSTRAINT_MEMCG,nodemask=(null),cpuset=report.service,mems_allowed=0,oom_memcg=/system.slice/report.service,task_memcg=/system.slice/report.service,task=python3,pid=1897990,uid=990
kernel: Memory cgroup out of memory: Killed process 1897990 (python3) total-vm:72524kB, anon-rss:64976kB, file-rss:4620kB, shmem-rss:0kB, UID:990 pgtables:180kB oom_score_adj:0`,
    options: ['The process reached the memory limit of its own cgroup (report.service), and the kernel OOM killer sent it SIGKILL even if the host had free memory', 'The whole host ran out of RAM and swap, so the kernel killed the largest process on the system', 'systemd-oomd killed the unit because memory pressure exceeded 60%', 'The process crashed with a segmentation fault and the kernel cleaned up its memory'],
    answer: [0],
    explanation: '`CONSTRAINT_MEMCG` and `Memory cgroup out of memory` show a cgroup limit (for example `MemoryMax=` on report.service) was hit; the kernel OOM killer acts within that cgroup regardless of free host memory. A system-wide OOM logs `Out of memory: Killed process` with `CONSTRAINT_NONE`. systemd-oomd logs through its own unit (`journalctl -u systemd-oomd`), not as kernel OOM lines. A segmentation fault produces a `segfault at ...` line and exit status 139.' },
  { topic: '5.2', type: 'fill', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. The script was moved from /usr/local/bin to /usr/bin by a package update. Enter the bash built-in command, with its option, that makes the current shell forget the old location.',
    exhibit: `alice@srv01:~$ backup.sh
bash: /usr/local/bin/backup.sh: No such file or directory
alice@srv01:~$ ls -l /usr/bin/backup.sh
-rwxr-xr-x. 1 root root 2210 Nov 22 09:02 /usr/bin/backup.sh
alice@srv01:~$ type backup.sh
backup.sh is hashed (/usr/local/bin/backup.sh)`,
    answer: ['hash -r', 'hash -d backup.sh'],
    explanation: 'Bash caches the full path of commands it has run in a hash table. After the file moved, bash keeps trying the cached path and reports `No such file or directory` instead of searching `$PATH` again. `hash -r` empties the table (`hash -d backup.sh` forgets only that name); a new shell also starts with an empty table. A real PATH problem gives `command not found` and exit status 127.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52B,
    stem: 'Refer to the exhibit. Which statement about alice on srv01 is true?',
    exhibit: `alice@srv01:~$ quota -s
Disk quotas for user alice (uid 1001):
     Filesystem   space   quota   limit   grace   files   quota   limit   grace
/dev/mapper/vg_sys-home
                  5120M*  4096M   5120M   6days    1834       0       0`,
    options: ['She can keep writing for six more days because she is inside the grace period', 'She has no file count limit, so the quota does not apply to her', 'She has reached the hard block limit, so writes fail now with "Disk quota exceeded" until she frees space', 'The asterisk means quotas are disabled on /home'],
    answer: [2],
    explanation: 'Usage (5120M) equals the **hard** limit (5120M), which can never be exceeded, so writes fail immediately. The grace period only allows usage between the soft limit (4096M) and the hard limit, and after six days the soft limit would be enforced too. A file limit of 0 means no inode limit, while the block quota still applies. The asterisk marks the limit that is exceeded, not a disabled quota.' },
  { topic: '5.2', type: 'match', difficulty: 3, lesson: L52B,
    stem: 'On app01 the administrator sees five different process problems. Match each symptom to the command that best confirms it.',
    pairs: [
      ['A process in state D ignores kill -9', 'ps -o pid,stat,wchan:20,cmd -p <pid>'],
      ['A service\'s resident memory grows every hour under constant load', 'pidstat -r -p <pid> 3600'],
      ['A daemon crashed with "Segmentation fault (core dumped)"', 'coredumpctl info <pid>'],
      ['A job ended with exit status 137 and no error message', 'journalctl -k -g "killed process"'],
      ['A unit fails with status=217/USER', 'getent passwd <User= value>'],
    ],
    explanation: 'The `wchan` column shows the kernel function a `D` (uninterruptible) process waits in, usually storage or NFS; outside NFS (where only SIGKILL can interrupt it) it cannot be killed until that I/O returns. `pidstat -r` over time shows steady RSS growth, the signature of a leak. `coredumpctl info` shows the stored core, signal and backtrace from systemd-coredump. Exit 137 is SIGKILL, and the kernel log shows whether the OOM killer sent it. `217/USER` means systemd could not resolve the `User=` account, which `getent passwd` checks.' },
  { topic: '5.2', type: 'single', difficulty: 2, lesson: L52A,
    stem: 'A typo in /etc/fstab stops srv01 from booting normally. To fix the file, the administrator wants to boot into the smallest possible environment, with only the root filesystem mounted read-only and no other fstab mounts attempted. Which kernel parameter should be added at the GRUB menu?',
    options: ['rd.break', 'systemd.unit=emergency.target', 'systemd.unit=rescue.target', 'systemd.unit=multi-user.target'],
    answer: [1],
    explanation: '`emergency.target` starts almost nothing and mounts only `/`, read-only; remount it rw, fix `/etc/fstab`, and reboot. `rescue.target` mounts the local filesystems from fstab, which is exactly what fails here. `rd.break` stops in the initramfs before the real root is mounted, which is meant for tasks such as resetting the root password. `multi-user.target` is the normal boot that is failing.' },

  // ---------- 5.3 Networking ----------
  { topic: '5.3', type: 'single', difficulty: 1, lesson: L53A,
    stem: 'Refer to the exhibit. What is wrong with enp1s0 on web01?',
    exhibit: `[root@web01 ~]# ip -br link show enp1s0
enp1s0           DOWN           52:54:00:3a:10:01 <NO-CARRIER,BROADCAST,MULTICAST,UP>`,
    options: ['The interface is enabled, but there is no carrier: check the cable, transceiver and switch port', 'The interface is administratively disabled and needs ip link set enp1s0 up','The interface has no IP address, so its state is reported as DOWN', 'The MTU is too large for the switch'],
    answer: [0],
    explanation: 'The `UP` flag shows the interface is administratively up; `NO-CARRIER` and state `DOWN` mean no link signal, a physical-layer or switch-port problem (unplugged cable, bad optic, port shut or err-disabled). An administratively down interface has no `UP` flag at all. Link state does not depend on IP addressing. An MTU mismatch does not drop carrier; the link stays up and large packets fail.' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53A,
    stem: 'Refer to the exhibit. File transfers from srv02 are very slow, and the switch shows many late collisions on its port, which is set to autonegotiate. What should the administrator do?',
    exhibit: `[root@srv02 ~]# ethtool enp0s31f6 | grep -E 'Speed|Duplex|Auto-neg|Link det'
	Speed: 100Mb/s
	Duplex: Full
	Auto-negotiation: off
	Link detected: yes`,
    options: ['Replace the cable, because a gigabit port negotiating 100 Mb/s always has a broken pair', 'Increase the MTU to 9000 to reduce the number of frames', 'Force the switch port to 100 Mb/s half duplex, because half duplex is the more reliable setting', 'Enable autonegotiation on the NIC so both ends negotiate (for example ethtool -s enp0s31f6 autoneg on, persisted in the NetworkManager profile)'],
    answer: [3],
    explanation: 'The NIC has been forced to 100 Mb/s full duplex with autonegotiation off. The autonegotiating switch port can detect the speed but not the duplex, so it falls back to half duplex: the switch side (half) records late collisions, the NIC side (full) sees CRC errors, and throughput collapses. Re-enabling autonegotiation on the NIC (and keeping it on the switch) restores a matching gigabit full-duplex link; make it persistent with `nmcli connection modify ... 802-3-ethernet.auto-negotiate yes`. A bad pair is the suspect only when autonegotiation is on and still yields 100 Mb/s. Jumbo frames would add an MTU mismatch. Forcing the switch port to half duplex keeps the mismatch, because the NIC is forced to full duplex.' },
  { topic: '5.3', type: 'fill', difficulty: 3, lesson: L53A,
    stem: 'Refer to the exhibit. The storage network between nas01 and srv01 is supposed to carry 9000-byte jumbo frames end to end. Enter the value for -s that tests a full 9000-byte IPv4 packet with the Don\'t Fragment bit set.',
    exhibit: `[root@srv01 ~]# ip -br link show ens2f0
ens2f0           UP             52:54:00:3a:20:01 <BROADCAST,MULTICAST,UP,LOWER_UP>
[root@srv01 ~]# ip link show ens2f0 | grep -o 'mtu [0-9]*'
mtu 9000
[root@srv01 ~]# ping -c2 -M do -s 1472 10.50.0.20
PING 10.50.0.20 (10.50.0.20) 1472(1500) bytes of data.
1480 bytes from 10.50.0.20: icmp_seq=1 ttl=64 time=0.214 ms
1480 bytes from 10.50.0.20: icmp_seq=2 ttl=64 time=0.198 ms
[root@srv01 ~]# ping -c2 -M do -s ____ 10.50.0.20`,
    answer: ['8972'],
    explanation: 'The `-s` value is the ICMP payload; add 8 bytes of ICMP header and 20 bytes of IPv4 header to get the packet size, as the exhibit shows (`1472(1500)`). 9000 − 28 = **8972**. If that test gets no replies while 1472 works, a switch port or the peer is not configured for jumbo frames (an MTU mismatch). For IPv6 the header is 40 bytes, so the payload would be 8952.' },
  { topic: '5.3', type: 'single', difficulty: 3, lesson: L53A,
    stem: 'Refer to the exhibit. bond0 on srv01 should aggregate both 10 Gb/s links with LACP, but throughput never exceeds 10 Gb/s. What is the most likely cause?',
    exhibit: `[root@srv01 ~]# grep -E 'Bonding Mode|Slave Interface|MII Status|Aggregator ID|system mac' /proc/net/bonding/bond0
Bonding Mode: IEEE 802.3ad Dynamic link aggregation
MII Status: up
	Aggregator ID: 1
Slave Interface: ens1f0
MII Status: up
Aggregator ID: 1
    system mac address: 52:54:00:3a:00:01
    system mac address: 02:00:00:c2:7e:40
Slave Interface: ens1f1
MII Status: up
Aggregator ID: 2
    system mac address: 52:54:00:3a:00:01
    system mac address: 00:00:00:00:00:00`,
    options: ['The bond should use balance-rr, because 802.3ad never uses more than one link', 'ens1f1 has no link, so the bond fails over to ens1f0', 'The switch port connected to ens1f1 is not sending LACP (it is not in the port-channel, or the channel is static), so ens1f1 sits in its own aggregator', 'The transmit hash policy must be set to layer2 for LACP to form'],
    answer: [2],
    explanation: 'The indented `Aggregator ID: 1` near the top is the bond\'s active aggregator. Each member shows the actor (local) and partner system MAC. ens1f0 has a real partner (the switch) in aggregator 1; ens1f1 has a zero partner MAC and a separate aggregator, so no LACP partner answered on that port and only aggregator 1 carries traffic. Configure that switch port into the same LACP port-channel (`channel-group N mode active` on Cisco). Both members report `MII Status: up`, so the link is fine. 802.3ad does use all members, per flow. balance-rr across a switch causes out-of-order delivery and is not the fix. The hash policy affects how flows are spread, not whether LACP forms.' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53A,
    stem: 'Refer to the exhibit. Before giving srv02 the address 192.0.2.10, the administrator runs this check. What does the result mean?',
    exhibit: `[root@srv02 ~]# arping -D -I enp1s0 -c 2 192.0.2.10
ARPING 192.0.2.10 from 0.0.0.0 enp1s0
Unicast reply from 192.0.2.10 [52:54:00:7E:21:9C]  0.871ms
Sent 1 probes (1 broadcast(s))
Received 1 response(s)
[root@srv02 ~]# echo $?
1`,
    options: ['The address is free; exit status 1 means one probe was sent', 'Another device with MAC 52:54:00:7E:21:9C already uses 192.0.2.10, so assigning it would create an IP conflict', 'srv02 already has 192.0.2.10 configured on enp1s0', 'The default gateway answered on behalf of the subnet, which is normal proxy ARP behaviour'],
    answer: [1],
    explanation: 'In duplicate address detection mode (`-D`), arping sends probes from 0.0.0.0 and returns 0 only if nobody replies. A reply with a MAC address and exit status 1 means the address is in use; find that MAC in the switch MAC address table. srv02 itself does not answer its own probe. Nothing in the output indicates proxy ARP, and proxy ARP for an address on the local subnet would itself be a misconfiguration to investigate.' },
  { topic: '5.3', type: 'single', difficulty: 3, lesson: L53A,
    stem: 'Refer to the exhibit. On ws01, https://portal.example.com takes several seconds to load or fails, while IPv4-only laptops on the same LAN have no problem. Dual-stack hosts in other buildings reach the portal over IPv6 without delay. What is the most likely cause?',
    exhibit: `alice@ws01:~$ getent ahosts portal.example.com | head -2
2001:db8:20::80 STREAM portal.example.com
2001:db8:20::80 DGRAM
alice@ws01:~$ curl -6 -sS -m 5 -o /dev/null https://portal.example.com/
curl: (28) Failed to connect to portal.example.com port 443 after 5002 ms: Timeout was reached
alice@ws01:~$ curl -4 -sS -m 5 -o /dev/null -w '%{http_code}\\n' https://portal.example.com/
200
alice@ws01:~$ ip -6 route show default
default via fe80::1 dev enp1s0 proto ra metric 100 expires 1794sec pref medium
alice@ws01:~$ traceroute -6 -n -q1 -w1 2001:db8:20::80
traceroute to 2001:db8:20::80 (2001:db8:20::80), 30 hops max, 80 byte packets
 1  2001:db8:10::1  0.412 ms
 2  *
 3  *`,
    options: ['The portal\'s TLS certificate does not include an IPv6 address in its SAN list', 'DNS is returning a wrong AAAA record, which must be deleted', 'ws01 has no IPv6 default route, so it cannot send IPv6 traffic off the LAN', 'IPv6 traffic from ws01\'s LAN is lost beyond the first-hop router (a missing IPv6 route or an IPv6 filter on the path), so each connection first tries the preferred IPv6 address and waits for a timeout before falling back to IPv4'],
    answer: [3],
    explanation: 'The resolver returns the AAAA address first (RFC 6724 prefers IPv6 when both families are usable), ws01 has a default route learned from router advertisements, and the first-hop router answers, but nothing answers beyond it: IPv6 from this LAN is dropped or misrouted after the router. Because other buildings reach the same address over IPv6, the AAAA record and the server are fine. Fix the router\'s IPv6 routing or filtering for this LAN; `/etc/gai.conf` can prefer IPv4 meanwhile. Certificates are matched against host names, not addresses. The default route is present; without one, connect() would fail at once with `Network is unreachable` instead of waiting.' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53A,
    stem: 'Refer to the exhibit. app01 can reach its gateway and the internet, but not the database server db01 (192.0.2.20). Other hosts on the VLAN use the prefix 192.0.2.128/25 with gateway 192.0.2.129, and db01 sits in 192.0.2.0/25 behind the same router. What is the cause?',
    exhibit: `[root@app01 ~]# ip -br addr show enp1s0
enp1s0           UP             192.0.2.130/24
[root@app01 ~]# ip route
default via 192.0.2.129 dev enp1s0 proto static metric 100
192.0.2.0/24 dev enp1s0 proto kernel scope link src 192.0.2.130 metric 100
[root@app01 ~]# ping -c1 192.0.2.20
PING 192.0.2.20 (192.0.2.20) 56(84) bytes of data.
From 192.0.2.130 icmp_seq=1 Destination Host Unreachable`,
    options: ['The prefix length is /24 instead of /25, so app01 treats 192.0.2.20 as on-link and ARPs for it instead of sending the packet to the gateway', 'The default gateway is wrong and should be 192.0.2.1', 'db01 is down, because the router reported it unreachable', 'ICMP is blocked by db01\'s firewall'],
    answer: [0],
    explanation: 'With `/24`, the connected route `192.0.2.0/24` covers 192.0.2.20, so app01 ARPs for it on its own segment; nobody answers and app01 itself reports `Destination Host Unreachable` (the message comes from 192.0.2.130, not from a router). With the correct `/25`, the packet would go to 192.0.2.129. The gateway works, since internet access works. The router never saw the packet, so it did not report anything. A firewall drop would produce a silent timeout, not an ARP failure.' },
  { topic: '5.3', type: 'order', difficulty: 2, lesson: L53A,
    stem: 'Users report that web01 cannot connect to the PostgreSQL service on db01.example.com (port 5432). Put these checks in a bottom-up troubleshooting order.',
    items: ['ip -br link show enp1s0', 'ip -br addr show enp1s0', 'ping -c3 <default gateway>', 'ping -c3 <db01 IP address>', 'dig +short db01.example.com', 'nc -zv db01.example.com 5432'],
    explanation: 'Work up the stack: link and carrier, then the address and prefix, then the local gateway (layer 2/3 on the segment), then the remote host by IP (routing), then name resolution, and finally the service port itself, which also tests firewalls along the path. Skipping ahead to the port test tells you only that something failed, not where. If ICMP is filtered, the ping steps can fail even though TCP works, which the final `nc` test reveals.' },
  { topic: '5.3', type: 'match', difficulty: 2, lesson: L53B,
    stem: 'A client on web01 tries to reach services on other hosts and gets five different errors. Match each error to its most likely cause.',
    pairs: [
      ['connect: Network is unreachable', 'No route matches the destination (for example no default route)'],
      ['Connection refused', 'The target answered with a TCP RST: nothing listens on the port, or a tcp-reset reject rule'],
      ['No route to host (target is up)', 'A firewall rejected the packet with an ICMP host- or admin-prohibited message'],
      ['Connection timed out', 'Packets are silently dropped by a firewall or lost on the path'],
      ['Temporary failure in name resolution', 'No configured DNS server could be reached'],
    ],
    explanation: '`Network is unreachable` is decided locally: the routing table has no match. `Connection refused` means a RST came back, so the host is reachable but the port is closed or a rule rejects with tcp-reset. firewalld\'s default reject sends ICMP prohibited messages, which the client reports as `No route to host`. A DROP rule sends nothing back, so the client waits until it times out. `Temporary failure in name resolution` (EAI_AGAIN) means the resolver got no answer at all, unlike NXDOMAIN, which reports that the name does not exist.' },
  { topic: '5.3', type: 'fill', difficulty: 2, lesson: L53B,
    stem: 'Refer to the exhibit. On web01 the administrator opened HTTP at runtime and tested it successfully, but forgot --permanent. Enter the firewall-cmd command that saves the current runtime configuration as the permanent configuration, so it survives the next reload.',
    exhibit: `[root@web01 ~]# firewall-cmd --zone=public --add-service=http
success
alice@ws01:~$ curl -sI http://web01.example.com | head -1
HTTP/1.1 200 OK
[root@web01 ~]# firewall-cmd --permanent --zone=public --list-services
cockpit dhcpv6-client ssh
[root@web01 ~]# firewall-cmd ____________
success`,
    answer: ['--runtime-to-permanent', 'firewall-cmd --runtime-to-permanent'],
    explanation: '`firewall-cmd --runtime-to-permanent` writes the active runtime configuration to the permanent configuration. Without it, the next `firewall-cmd --reload` or reboot loads the permanent set, which does not contain `http`. Alternatively, repeat the command with `--permanent` and then `--reload`. Running `--reload` now would remove the working rule.' },
  { topic: '5.3', type: 'single', difficulty: 3, lesson: L53B,
    stem: 'Refer to the exhibit. Applications on web01 cannot resolve db01.example.com, but dig can. What should be changed?',
    exhibit: `alice@web01:~$ getent hosts db01.example.com; echo "exit=$?"
exit=2
alice@web01:~$ dig +short db01.example.com
192.0.2.40
alice@web01:~$ grep '^hosts:' /etc/nsswitch.conf
hosts:      files myhostname
alice@web01:~$ cat /etc/resolv.conf
search example.com
nameserver 192.0.2.53`,
    options: ['Add db01 to /etc/hosts, because dig only works for names in local files', 'Add dns (or resolve when systemd-resolved is used) to the hosts: line in /etc/nsswitch.conf', 'Change the nameserver to 127.0.0.53, because applications cannot use a remote resolver', 'Restart the DNS server 192.0.2.53, because it is returning NXDOMAIN'],
    answer: [1],
    explanation: '`dig` sends DNS queries straight to the server in `resolv.conf` and ignores NSS; applications and `getent` use NSS, and the `hosts:` line has no `dns` (or `resolve`) source, so they never query DNS (exit status 2 = not found). Adding `dns` fixes it for every application; editing `/etc/hosts` would hide the fault for one name. dig does not read `/etc/hosts`. A remote nameserver is normal, `127.0.0.53` is only used with systemd-resolved. The server answered dig correctly, so it is not returning NXDOMAIN.' },
  { topic: '5.3', type: 'single', difficulty: 2, lesson: L53B,
    stem: 'Refer to the exhibit. A new server on VLAN 230 never gets a DHCP lease. The DHCP server sits in the data center on another subnet and serves other VLANs without problems. What is the most likely cause?',
    exhibit: `[root@srv03 ~]# tcpdump -ni enp1s0 -e port 67 or port 68
tcpdump: verbose output suppressed, use -v[v]... for full protocol decode
listening on enp1s0, link-type EN10MB (Ethernet), snapshot length 262144 bytes
09:41:02.114503 52:54:00:3a:30:01 > ff:ff:ff:ff:ff:ff, ethertype IPv4 (0x0800), length 342: 0.0.0.0.68 > 255.255.255.255.67: BOOTP/DHCP, Request from 52:54:00:3a:30:01, length 300
09:41:06.402117 52:54:00:3a:30:01 > ff:ff:ff:ff:ff:ff, ethertype IPv4 (0x0800), length 342: 0.0.0.0.68 > 255.255.255.255.67: BOOTP/DHCP, Request from 52:54:00:3a:30:01, length 300
09:41:14.731990 52:54:00:3a:30:01 > ff:ff:ff:ff:ff:ff, ethertype IPv4 (0x0800), length 342: 0.0.0.0.68 > 255.255.255.255.67: BOOTP/DHCP, Request from 52:54:00:3a:30:01, length 300`,
    options: ['The router interface for VLAN 230 has no DHCP relay (ip helper-address) pointing at the DHCP server, so the broadcasts never leave the VLAN', 'The client firewall blocks outgoing UDP 67', 'The client has a duplicate IP address', 'The NetworkManager profile has ipv4.method manual'],
    answer: [0],
    explanation: 'The client is sending DHCPDISCOVER broadcasts (shown as BOOTP/DHCP Request from 0.0.0.0) and nothing comes back. Broadcasts do not cross routers, so a remote DHCP server needs a relay on the VLAN\'s gateway interface; a new VLAN without `ip helper-address` (or the server lacking a scope for it) is the classic cause. The capture shows the requests leaving the interface, so the local firewall is not blocking them. The client has no address yet, so it cannot be a duplicate. A profile with `ipv4.method manual` would not send DHCP requests at all.' },

  // ---------- 5.4 Security ----------
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54A,
    stem: 'Refer to the exhibit. After alice copied a new start page into place with mv, web01 returns 403 Forbidden for it. The file mode is 644. What is the correct fix?',
    exhibit: `[root@web01 ~]# ausearch -m AVC -ts recent
----
time->Sun Nov 22 10:00:12 2026
type=AVC msg=audit(1795341612.412:1187): avc:  denied  { read } for  pid=2311 comm="httpd" name="index.html" dev="dm-0" ino=3412010 scontext=system_u:system_r:httpd_t:s0 tcontext=unconfined_u:object_r:user_home_t:s0 tclass=file permissive=0`,
    options: ['setenforce 0, so Apache can read the file', 'restorecon -v /var/www/html/index.html, so the file gets the httpd_sys_content_t label defined for that path', 'chmod 777 /var/www/html/index.html', 'audit2allow -a -M httpdhome && semodule -i httpdhome.pp'],
    answer: [1],
    explanation: '`mv` keeps the file\'s original label, `user_home_t`, which httpd may not read. `restorecon` resets it to the label the policy defines for `/var/www/html` (`httpd_sys_content_t`). Setting permissive mode disables protection for the whole system. Mode 644 already allows reading, so chmod changes nothing and weakens permissions. A custom module allowing httpd to read user home files would open a hole instead of fixing the label.' },
  { topic: '5.4', type: 'fill', difficulty: 2, lesson: L54A,
    stem: 'Refer to the exhibit. The PHP application on web01 cannot connect to its PostgreSQL server. Enter the full command that applies the fix and keeps it across reboots.',
    exhibit: `[root@web01 ~]# ausearch -m AVC -ts recent | audit2why
type=AVC msg=audit(1795342001.118:1203): avc:  denied  { name_connect } for  pid=2390 comm="php-fpm" dest=5432 scontext=system_u:system_r:httpd_t:s0 tcontext=system_u:object_r:postgresql_port_t:s0 tclass=tcp_socket permissive=0

	Was caused by:
	The boolean httpd_can_network_connect_db was set incorrectly.
	Description:
	Allow httpd to can network connect db

	Allow access by executing:
	# setsebool -P httpd_can_network_connect_db 1`,
    answer: ['setsebool -P httpd_can_network_connect_db 1', 'setsebool -P httpd_can_network_connect_db on', 'setsebool -P httpd_can_network_connect_db=1', 'setsebool -P httpd_can_network_connect_db=on', 'setsebool -P httpd_can_network_connect_db true', 'setsebool -P httpd_can_network_connect_db=true', 'semanage boolean -m --on httpd_can_network_connect_db', 'semanage boolean --modify --on httpd_can_network_connect_db'],
    explanation: '`audit2why` identified a Boolean: the policy already contains the rule, switched off by default. `setsebool -P httpd_can_network_connect_db 1` (or `on`) enables it, and `-P` writes it to the policy store so it survives reboots. Without `-P` the change is lost at reboot. The broader `httpd_can_network_connect` would allow connections to any port and is not needed for a database.' },
  { topic: '5.4', type: 'order', difficulty: 2, lesson: L54A,
    stem: 'On the enforcing RHEL host web02, the web team moved the site to /srv/web, changed the DocumentRoot and reloaded Apache. Every page now returns 403 Forbidden although the file modes are correct. Put the steps to find and fix the cause in order.',
    items: ['ausearch -m AVC -ts recent', 'semanage fcontext -a -t httpd_sys_content_t "/srv/web(/.*)?"', 'restorecon -Rv /srv/web', 'curl -sI http://web02.example.com/'],
    explanation: 'First confirm that SELinux is refusing access: `ausearch` shows `httpd_t` denied reading files labelled `var_t` (the default for new paths under `/srv`). Then record the labelling rule in the policy with `semanage fcontext` (it changes no files by itself), apply it with `restorecon -Rv` (check with `ls -Zd /srv/web`), and test again. `chcon` would also relabel, but the change would be lost at the next relabel or `restorecon`, which is why the persistent `semanage` rule comes before `restorecon`.' },
  { topic: '5.4', type: 'single', difficulty: 3, lesson: L54A,
    stem: 'Refer to the exhibit. bob has an ACL entry with rw- on the report, but cannot save changes to it. What is the cause and fix?',
    exhibit: `[root@srv01 ~]# getfacl /srv/reports/q4/summary.txt
# file: srv/reports/q4/summary.txt
# owner: alice
# group: finance
user::rw-
user:bob:rw-			#effective:r--
group::rw-			#effective:r--
mask::r--
other::r--`,
    options: ['The other entry is r--, which overrides named user entries; run chmod o+w', 'bob is not the owner; ACLs only work for the owning user', 'The ACL mask is r--, which limits bob\'s effective rights to read; restore it with setfacl -m m::rw (a chmod 644 on the file probably reduced it)', 'The file is immutable; run chattr -i'],
    answer: [2],
    explanation: 'The mask is the upper limit for named users, named groups and the owning group, and `#effective:r--` shows it is removing bob\'s write permission. On a file with an ACL, `chmod` changes the mask, so a `chmod 644` set it to `r--`. `setfacl -m m::rw` (or `chmod g+w`) restores it. The other entry applies only to users with no matching entry and does not override bob\'s entry; making it writable would give everyone write access. Named user entries exist exactly to grant non-owners access. Nothing in the output indicates the immutable attribute; check that with `lsattr`.' },
  { topic: '5.4', type: 'fill', difficulty: 2, lesson: L54A,
    stem: 'Refer to the exhibit. Enter the full command that allows root to change /etc/resolv.conf on srv01 again.',
    exhibit: `[root@srv01 ~]# echo "nameserver 192.0.2.53" > /etc/resolv.conf
-bash: /etc/resolv.conf: Operation not permitted
[root@srv01 ~]# ls -l /etc/resolv.conf
-rw-r--r--. 1 root root 72 Oct  2 11:40 /etc/resolv.conf
[root@srv01 ~]# lsattr /etc/resolv.conf
----i----------------- /etc/resolv.conf`,
    answer: ['chattr -i /etc/resolv.conf'],
    explanation: 'The `i` in `lsattr` output is the immutable attribute: the file cannot be modified, renamed, deleted or linked, even by root, which is why the error is `Operation not permitted` rather than `Permission denied`. `chattr -i /etc/resolv.conf` removes it. Then fix whatever the attribute was protecting against, typically NetworkManager or systemd-resolved rewriting the file, in their configuration.' },
  { topic: '5.4', type: 'multi', difficulty: 2, lesson: L54A,
    stem: 'Refer to the exhibit. alice cannot log in to srv01 over SSH or on the console with her correct password. Today is November 22, 2026. Which two changes are required? (Choose two.)',
    exhibit: `[root@srv01 ~]# passwd -S alice
alice PS 2026-10-01 0 99999 7 -1 (Password set, SHA512 crypt.)
[root@srv01 ~]# chage -l alice | grep -E 'Account expires|Password expires'
Password expires					: never
Account expires						: Nov 15, 2026
[root@srv01 ~]# getent passwd alice
alice:x:1001:1001:Alice Admin:/home/alice:/sbin/nologin
[root@srv01 ~]# faillock --user alice
alice:
When                Type  Source                                           Valid`,
    options: ['Unlock the password with passwd -u alice', 'Remove the account expiry, for example chage -E -1 alice', 'Reset the failure counter with faillock --user alice --reset', 'Give alice a login shell, for example usermod -s /bin/bash alice', 'Force a password change with chage -d 0 alice'],
    answer: [1, 3],
    explanation: 'The account expired on November 15, so PAM refuses every login until the expiry is removed or moved (`chage -E -1` or a new date). Her shell is `/sbin/nologin`, which prints "This account is currently not available." and exits, so she also needs a real shell. `PS` means the password is set and not locked, so `passwd -u` does nothing. `faillock` shows no recorded failures. Forcing a password change would not overcome the expiry or the shell.' },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54B,
    stem: 'Refer to the exhibit. alice needs to manage the old switch at 192.0.2.30 until its firmware is upgraded next month. What is the best way to connect without weakening any other SSH connections from ws01?',
    exhibit: `alice@ws01:~$ ssh admin@192.0.2.30
Unable to negotiate with 192.0.2.30 port 22: no matching host key type found. Their offer: ssh-rsa`,
    options: ['Run update-crypto-policies --set LEGACY on ws01', 'Add a Host 192.0.2.30 block to ~/.ssh/config with HostKeyAlgorithms +ssh-rsa (and PubkeyAcceptedAlgorithms +ssh-rsa if she uses an RSA key)', 'Delete ~/.ssh/known_hosts so the client accepts any host key type', 'Use ssh -c aes128-cbc admin@192.0.2.30'],
    answer: [1],
    explanation: 'The switch only offers `ssh-rsa` (RSA signatures with SHA-1), which current OpenSSH disables by default. A per-host exception with `+ssh-rsa` appends it to the defaults for that host only. Setting the system crypto policy to LEGACY weakens every client and service on ws01. known_hosts stores trusted keys; deleting it has nothing to do with algorithm negotiation and removes protection against spoofing. `-c` selects a cipher, but the failure is about the host key type.' },
  { topic: '5.4', type: 'single', difficulty: 3, lesson: L54B,
    stem: 'Refer to the exhibit. Browsers that have cached the intermediate certificate open https://portal.example.com without warnings, but curl and Python clients on Linux fail with "unable to get local issuer certificate". What should be fixed?',
    exhibit: `alice@ws01:~$ openssl s_client -connect portal.example.com:443 -servername portal.example.com </dev/null 2>&1 | grep -E 'depth|verify|s:|i:|Verify return'
depth=0 CN=portal.example.com
verify error:num=20:unable to get local issuer certificate
verify return:1
depth=0 CN=portal.example.com
verify error:num=21:unable to verify the first certificate
verify return:1
 0 s:CN=portal.example.com
   i:C=US, O=Example CA, CN=Example Issuing CA R2
Verify return code: 21 (unable to verify the first certificate)`,
    options: ['The certificate has expired and must be renewed', 'The SAN list is missing portal.example.com', 'Clients must connect with -tls1_3, because the server negotiates an obsolete protocol', 'The server sends only its own certificate; configure it to send the full chain including the Example Issuing CA R2 intermediate (for example fullchain.pem)'],
    answer: [3],
    explanation: 'The chain lists only certificate 0, the server certificate, issued by an intermediate. The client cannot build a path to a trusted root without the intermediate, so verification fails with errors 20 and 21; browsers that have seen the intermediate before hide the problem. Serve the full chain. An expired certificate gives error 10, `certificate has expired`. A name mismatch would show only with `-verify_hostname` (error 62) or in curl as a subject name error. Nothing in the output concerns the protocol version.' },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54B,
    stem: 'Refer to the exhibit. What is the correct fix on the Ubuntu server web01?',
    exhibit: `root@web01:~# apt update
...
W: GPG error: https://repo.example.com/apt stable InRelease: The following signatures were invalid: EXPKEYSIG 5E1A2B3C4D5E6F70 Example Repo Signing Key <repo@example.com>
E: The repository 'https://repo.example.com/apt stable InRelease' is not signed.
root@web01:~# grep -E '^(URIs|Signed-By):' /etc/apt/sources.list.d/example.sources
URIs: https://repo.example.com/apt
Signed-By: /etc/apt/keyrings/example.gpg`,
    options: ['Add [trusted=yes] to the repository so apt skips signature checks', 'Run apt-get install -f to repair the broken packages', 'Download the vendor\'s renewed signing key, verify its fingerprint, and replace /etc/apt/keyrings/example.gpg (dearmored if it is ASCII-armoured), then run apt update', 'Delete /var/lib/apt/lists/ and run apt update again'],
    answer: [2],
    explanation: '`EXPKEYSIG` means the repository is signed with a key whose copy in the keyring has expired; vendors extend or replace the key, so the keyring named by `Signed-By:` needs the current version. `[trusted=yes]` disables the protection against tampered repositories. `apt-get install -f` fixes dependency problems, not signatures. Clearing the lists just downloads the same metadata and fails the same way.' },
  { topic: '5.4', type: 'multi', difficulty: 2, lesson: L54B,
    stem: 'On the RHEL server srv01, the administrator ran dnf upgrade --security, which installed new openssh-server and kernel packages to fix published CVEs. Which two actions are still required before the fixes are actually in effect? (Choose two.)',
    options: ['Restart sshd so the running daemon uses the patched binary', 'Reboot into the new kernel (or apply a live patch), as dnf needs-restarting -r reports', 'Run rpm --rebuilddb so the new packages are registered', 'Run dnf clean all to remove the old packages from memory', 'Set gpgcheck=0 so the next security update installs faster'],
    answer: [0, 1],
    explanation: 'Updating files on disk does not change running processes: sshd keeps running the old binary until restarted, and the old kernel runs until reboot or a kpatch live patch. `dnf needs-restarting -r` (and `-s` for services) shows what is still pending. The RPM database is updated by the transaction itself. `dnf clean all` only removes cached metadata and packages from disk. Disabling signature checks is a security regression, not a step in patching.' },
  { topic: '5.4', type: 'single', difficulty: 2, lesson: L54B,
    stem: 'Refer to the exhibit. srv01 is an application server that uses a local Redis cache and does not export NFS. Which change best reduces its exposure?',
    exhibit: `[root@srv01 ~]# ss -tulpn | grep -v 127.0.0
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
udp   UNCONN 0      0            0.0.0.0:111        0.0.0.0:*     users:(("rpcbind",pid=812,fd=5))
tcp   LISTEN 0      511          0.0.0.0:6379       0.0.0.0:*     users:(("redis-server",pid=1440,fd=6))
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*     users:(("sshd",pid=1020,fd=3))`,
    options: ['Bind Redis to 127.0.0.1 with authentication enabled, and disable and mask rpcbind', 'Move SSH to port 2222 and leave the other services as they are', 'Stop sshd, because port 22 is the most attacked port', 'Change Redis to listen on [::] as well, so it is reachable over IPv6'],
    answer: [0],
    explanation: 'Redis is only used locally, so listening on all addresses needlessly exposes it, and rpcbind is unnecessary on a host without NFS; binding Redis to loopback (with `requirepass`/ACLs) and disabling rpcbind removes both exposures. Moving SSH to another port is obscurity, and the two real exposures remain. Stopping sshd removes the administrators\' access; restrict it instead (keys, `AllowGroups`, firewall sources). Adding IPv6 listening increases exposure.' },

  // ---------- 5.5 Performance ----------
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55A,
    stem: 'Refer to the exhibit. db01 has 4 vCPUs and users report slow queries. What is the most likely bottleneck?',
    exhibit: `top - 14:02:11 up 12 days,  3:41,  2 users,  load average: 9.84, 9.12, 6.40
Tasks: 312 total,   2 running, 310 sleeping,   0 stopped,   0 zombie
%Cpu(s):  4.2 us,  1.9 sy,  0.0 ni, 21.5 id, 72.3 wa,  0.0 hi,  0.1 si,  0.0 st
MiB Mem :  15731.2 total,    402.6 free,   6120.4 used,   9208.2 buff/cache
MiB Swap:   4096.0 total,   4090.3 free,      5.7 used.   9610.8 avail Mem`,
    options: ['Storage: most of the load comes from tasks waiting for I/O, while the CPUs are mostly idle or waiting', 'CPU: a load average of nearly 10 on 4 vCPUs means the CPUs are overloaded and more vCPUs are needed', 'Memory: only 402 MiB is free, so the system is swapping heavily', 'The hypervisor: steal time is too high'],
    answer: [0],
    explanation: 'Only about 6% of CPU time is spent running code (`us` + `sy`), while `wa` is 72%: the CPUs are idle waiting for disk I/O. On Linux the load average includes tasks in uninterruptible sleep, so a load near 10 here comes from I/O waiters, not CPU demand; extra vCPUs would not help. Low `free` is normal because 9 GiB is page cache, `avail Mem` is 9.6 GiB and swap is almost unused. `st` is 0.0, so the hypervisor is not taking CPU time.' },
  { topic: '5.5', type: 'multi', difficulty: 2, lesson: L55A,
    stem: 'Which two kinds of tasks are counted in the Linux load average? (Choose two.)',
    options: ['Tasks that are running or waiting for a CPU (state R)', 'Tasks in interruptible sleep waiting for user input or a timer (state S)', 'Tasks in uninterruptible sleep, usually waiting for disk or NFS I/O (state D)', 'Zombie tasks waiting to be reaped (state Z)', 'Stopped tasks (state T)'],
    answer: [0, 2],
    explanation: 'Linux counts runnable tasks and tasks in uninterruptible sleep, so storage stalls raise the load average even when CPUs are idle (unlike some other Unix systems, which count only runnable tasks). Interruptible sleepers such as idle daemons, zombies (which use no CPU) and stopped jobs are not counted.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55A,
    stem: 'Refer to the exhibit. A nightly report on the 4-vCPU host app01 takes much longer than expected, yet overall CPU utilization stays around 27%. What does the output show?',
    exhibit: `[root@app01 ~]# mpstat -P ALL 1 1
02:15:01 PM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
02:15:02 PM  all   26.30    0.00    0.50    0.00    0.00    0.00    0.00    0.00    0.00   73.20
02:15:02 PM    0    1.01    0.00    1.01    0.00    0.00    0.00    0.00    0.00    0.00   97.98
02:15:02 PM    1  100.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00
02:15:02 PM    2    2.97    0.00    0.99    0.00    0.00    0.00    0.00    0.00    0.00   96.04
02:15:02 PM    3    1.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00    0.00   99.00`,
    options: ['The report is waiting for disk I/O', 'A single-threaded process saturates CPU 1; more vCPUs will not speed it up, but a faster core or parallelising the work will', 'The hypervisor is stealing CPU time from CPUs 0, 2 and 3', 'The system is idle, so the report must be waiting on the network'],
    answer: [1],
    explanation: 'CPU 1 is at 100% user time while the others are almost idle, the signature of one busy thread: the "all" average hides a real CPU bottleneck. Adding cores does not help a single thread; `pidstat -t` identifies the thread. `%iowait` and `%steal` are zero everywhere. CPU 1 is saturated, so the process is busy computing, not waiting on the network.' },
  { topic: '5.5', type: 'fill', difficulty: 3, lesson: L55A,
    stem: 'Refer to the exhibit. The 4-vCPU host app01 shows an unusually high context-switch rate. Enter the pidstat command that reports voluntary and non-voluntary context switches per process every second.',
    exhibit: `[root@app01 ~]# vmstat 1 3
procs -----------memory---------- ---swap-- -----io---- -system-- -------cpu-------
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st gu
14  0      0 812044  98220 9811204    0    0     0    12 41210 298504 38 52 10  0  0  0
16  0      0 811904  98220 9811212    0    0     0     8 40977 301877 36 54 10  0  0  0
15  0      0 811760  98220 9811220    0    0     0    20 41502 297310 37 53 10  0  0  0
[root@app01 ~]# ____________`,
    answer: ['pidstat -w 1'],
    explanation: '`pidstat -w 1` prints `cswch/s` (voluntary switches: the task blocked, for example on a lock or I/O) and `nvcswch/s` (non-voluntary: the scheduler preempted it) for each process every second. The `vmstat` output shows about 300,000 switches per second (`cs`), a run queue of 14-16 on 4 CPUs and more system than user time, so the CPUs spend their time switching; high non-voluntary counts confirm oversubscription (too many threads for the CPUs).' },
  { topic: '5.5', type: 'single', difficulty: 3, lesson: L55A,
    stem: 'Refer to the exhibit. srv01 has become extremely slow and the SSH session barely responds. What is happening?',
    exhibit: `[root@srv01 ~]# cat /proc/pressure/memory
some avg10=71.42 avg60=64.10 avg300=40.88 total=391224917
full avg10=58.03 avg60=51.77 avg300=31.02 total=302118220
[root@srv01 ~]# vmstat 2 2 | tail -1
 3 11 3981120  71204   1120  60448 18240 21410 39210 22830 9811 14420  4 11  7 78  0  0
[root@srv01 ~]# free -h
               total        used        free      shared  buff/cache   available
Mem:           7.5Gi       7.3Gi        69Mi       2.0Mi       160Mi       102Mi
Swap:          4.0Gi       3.8Gi       202Mi`,
    options: ['A CPU bottleneck: the run queue is longer than the CPU count', 'The disk is failing, which is why iowait is 78%', 'Normal behaviour: Linux always uses swap and keeps little free memory', 'Memory thrashing: almost no memory is available, pages are being swapped in and out continuously (si/so), and tasks spend over half their time stalled on memory (PSI full)'],
    answer: [3],
    explanation: '`available` is only 102 MiB, swap is nearly full, `si` and `so` show tens of MB per second moving to and from swap, and PSI memory `full` above 50% means that for more than half the time every non-idle task was stalled on memory. The high `wa` and blocked tasks (`b`) are caused by the paging. Next: find the large or leaking process (`ps -eo pid,rss,comm --sort=-rss`), stop or limit it, and add RAM if the workload legitimately needs it. Only three tasks are runnable, so the CPU is not the bottleneck. Swap activity at this rate is not normal, and a failing disk would show I/O errors rather than this pattern.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55B,
    stem: 'Refer to the exhibit. Applications on db01 that write to /dev/sda are slow. What should the administrator do next?',
    exhibit: `[root@db01 ~]# iostat -x -d sda 5 2 | tail -3
Device            r/s     rkB/s   rrqm/s  %rrqm r_await rareq-sz     w/s     wkB/s   wrqm/s  %wrqm w_await wareq-sz     d/s     dkB/s   drqm/s  %drqm d_await dareq-sz     f/s f_await  aqu-sz  %util
sda             12.40    396.80     0.00   0.00    3.10    32.00  210.60  26956.80    18.20   7.96  148.72   128.00    0.00      0.00     0.00   0.00    0.00     0.00    4.00   38.50   31.48  99.60
`,
    options: ['Nothing: %util below 100% means the disk still has spare capacity', 'Increase the read-ahead, because the read latency is the problem', 'Identify the process generating the writes with iotop -o or pidstat -d, then reschedule, throttle or move that workload', 'Run fsck on /dev/sda, because high w_await indicates filesystem corruption'],
    answer: [2],
    explanation: 'Writes take about 149 ms on average including queueing, about 31 requests are queued and the device is busy 99.6% of the time: sda is saturated by writes. The next step is to find who is writing (`iotop -o`, `pidstat -d 1`) and deal with it (move a backup out of business hours, `ionice`, unit I/O limits, faster storage). 99.6% on a single-queue disk is saturation, not spare capacity. Reads take only 3 ms. Latency says nothing about corruption, and fsck must not be run on a mounted filesystem.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55B,
    stem: 'Refer to the exhibit. On srv01 the load average climbs to 40, several shells hang when users cd to /mnt/data, and Ctrl+C does not interrupt them. What is the cause?',
    exhibit: `[root@srv01 ~]# journalctl -k --since "10 min ago" | tail -2
Nov 22 11:02:44 srv01 kernel: nfs: server nfs01.example.com not responding, still trying
Nov 22 11:02:51 srv01 kernel: nfs: server nfs01.example.com not responding, still trying
[root@srv01 ~]# findmnt -no OPTIONS /mnt/data | tr , '\\n' | grep -E '^(hard|soft|vers)'
vers=4.2
hard`,
    options: ['The NFS server nfs01 (or the network path to it) is not responding; with a hard mount, processes touching /mnt/data wait in uninterruptible sleep until it returns, which raises the load', 'srv01 needs more CPUs, because the load average is 40', 'The mount is soft, so the processes are stuck retrying forever', 'The processes are zombies and their parent must be killed'],
    answer: [0],
    explanation: 'The kernel reports the NFS server not responding. With `hard` (the default), I/O retries until the server returns, so processes sit in state `D`, ignore ordinary signals such as Ctrl+C (since kernel 2.6.25 only SIGKILL can interrupt a pending NFS operation), and each one adds to the load average even though the CPUs are idle. Check the server and the path (`ping`, `mtr`, `nfsiostat`); the kernel logs `nfs: server ... OK` when it recovers. More CPUs would not help I/O waiters. A `soft` mount would give up and return errors, and the options show `hard` anyway. Zombies have already exited and do not block `cd` in a shell.' },
  { topic: '5.5', type: 'match', difficulty: 2, lesson: L55B,
    stem: 'Users of web01 report five network problems. Match each one to the tool and measurement that best confirms it.',
    pairs: [
      ['VoIP calls to the branch break up although average latency is fine', 'ping -c 100 -i 0.2 (mdev) or iperf3 -u (jitter)'],
      ['A file copy to the backup server reaches only 200 Mb/s on a 10 Gb/s path', 'iperf3 -c <server> -t 30'],
      ['The NIC may be discarding packets during bursts', 'ip -s link show enp1s0 and ethtool -S enp1s0'],
      ['Latency to the partner site is high and you need the hop where it starts', 'mtr -rwc 100 <host>'],
      ['A specific TCP connection is suspected of retransmitting', 'ss -ti dst <host>'],
    ],
    explanation: 'Jitter is variation in delay: ping\'s `mdev` or iperf3\'s UDP jitter column measure it. `iperf3` measures achievable throughput independently of the application and disks. Interface drops and errors are in `ip -s link` and the driver counters from `ethtool -S`. `mtr` combines traceroute and ping per hop to show where latency or loss begins. `ss -ti` shows per-socket TCP details such as `rtt` and `retrans`.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55B,
    stem: 'Refer to the exhibit. web01 is internet-facing and password authentication is enabled in sshd. What is the best response?',
    exhibit: `[root@web01 ~]# journalctl -u sshd --since today | grep -c 'Failed password'
18442
[root@web01 ~]# journalctl -u sshd --since today | grep 'Failed password' | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head -3
  17904 203.0.113.77
    412 198.51.100.14
     21 192.0.2.50
[root@web01 ~]# journalctl -u sshd --since today -g 'Accepted' | wc -l
3`,
    options: ['Increase MaxAuthTries in sshd_config so legitimate users are not locked out', 'Reboot web01 to drop the attacking sessions', 'Delete the journal so the failures stop consuming disk space', 'Block or rate-limit the attacking addresses (for example fail2ban), move users to key-based authentication with PasswordAuthentication no, restrict SSH sources, and verify the three accepted logins are legitimate'],
    answer: [3],
    explanation: 'Almost all failures come from one external address: a brute-force attack. Banning it (fail2ban or a firewall rule), disabling password logins, limiting who can reach SSH, and checking that the accepted logins belong to known users addresses both the attack and its possible success. Raising `MaxAuthTries` gives attackers more guesses per connection. A reboot changes nothing; the attack resumes. Deleting logs destroys the evidence.' },
  { topic: '5.5', type: 'fill', difficulty: 2, lesson: L55B,
    stem: 'Refer to the exhibit. On the RHEL host srv01, the administrator wants to compare today\'s CPU utilization with the same morning on the 15th of this month, which sysstat recorded. Enter the sar command that reads CPU utilization from that day\'s data file.',
    exhibit: `[root@srv01 ~]# ls /var/log/sa/ | head -4
sa14
sa15
sa16
sa17
[root@srv01 ~]# sar -u -s 09:00:00 -e 10:00:00 | tail -1
Average:        all     61.20      0.00      7.85      0.94      0.00     30.01
[root@srv01 ~]# ____________ -s 09:00:00 -e 10:00:00 | tail -1`,
    answer: ['sar -u -f /var/log/sa/sa15', 'sar -f /var/log/sa/sa15'],
    explanation: '`sar -f /var/log/sa/sa15` reads the binary data file for the 15th (on Debian and Ubuntu the files are in `/var/log/sysstat/`); CPU utilization (`-u`) is the default report, so both forms are equivalent. `-s` and `-e` limit the time window. Comparing the same period on a normal day is how you tell whether 61% user time exceeds this host\'s baseline.' },
  { topic: '5.5', type: 'single', difficulty: 2, lesson: L55B,
    stem: 'Refer to the exhibit. A compute node becomes slow every afternoon, although the workload is the same as in the morning. What is the most likely cause, and what should be checked?',
    exhibit: `[root@hpc04 ~]# journalctl -k --since today -g 'temperature'
Nov 22 13:41:07 hpc04 kernel: CPU12: Core temperature is above threshold, cpu clock is throttled (total events = 1532)
Nov 22 13:41:07 hpc04 kernel: CPU4: Core temperature is above threshold, cpu clock is throttled (total events = 1532)
Nov 22 13:44:12 hpc04 kernel: CPU12: Core temperature/speed normal (total events = 1532)
Nov 22 13:44:12 hpc04 kernel: CPU4: Core temperature/speed normal (total events = 1532)`,
    options: ['A memory leak; restart the application every afternoon', 'The CPUs are thermally throttling; check fans, airflow, room temperature and the readings in sensors or ipmitool sensor', 'The kernel is too old to use all CPU frequencies; upgrade it', 'Steal time from the hypervisor; move the VM to another host'],
    answer: [1],
    explanation: 'The kernel reports cores exceeding their temperature threshold and clocking down, a hardware/environment problem that appears as slowness. Check the cooling (fan failures in `ipmitool sel list`, `sensors`, data-center temperature in the afternoon). Nothing indicates a leak. The messages are about temperature, not missing frequency support. The host name and the hardware messages describe a physical machine, and steal appears in `top`/`vmstat`, not as thermal events.' },
];

export default bank.map((item, i) => ({ id: `d5-${String(i + 1).padStart(3, '0')}`, ...item }));
