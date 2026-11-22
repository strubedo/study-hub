// Official CompTIA Linux+ XK0-006 (V8) exam objectives, document version 5.0.
// Source: CompTIA exam objectives PDF and comptia.org/certifications/linux (checked 2026-11-22).
// Topics are the numbered objectives; sub-bullets are the objective's own bullets (shortened, tool lists kept).

export const EXAM = {
  code: 'XK0-006',
  name: 'CompTIA Linux+ (XK0-006, V8)',
  certification: 'CompTIA Linux+',
  product: 'Linux',
  minutes: 90,
  questions: 90,
  questionsApprox: 'up to 90',
  passingScore: 720,
  scoring: 'Scaled 100–900; 720 or higher passes.',
};

export const DOMAINS = [
  {
    id: 1, weight: 23, title: 'System Management', short: 'System management',
    topics: [
      { id: '1.1', verb: 'Explain', title: 'basic Linux concepts', sub: ['Boot process: bootloader and its configuration files, kernel and parameters, initrd, PXE', 'Filesystem Hierarchy Standard: /, /bin, /boot, /dev, /etc, /home, /lib, /proc, /sbin, /tmp, /usr, /var', 'Server architectures: AArch64, RISC-V, x86, x86_64/AMD64', 'Distributions: RPM-based and dpkg-based', 'GUI: display managers, window managers, X Server, Wayland', 'Software licensing: open source, free, proprietary, copyleft'] },
      { id: '1.2', verb: 'Summarize', title: 'Linux device management concepts and tools', keepCase: true, sub: ['Kernel modules: depmod, insmod, lsmod, modinfo, modprobe, rmmod', 'Device management: dmesg, dmidecode, ipmitool, lm_sensors, lscpu, lshw, lsmem, lspci, lsusb', 'initrd management: dracut, mkinitrd', 'Custom hardware: embedded systems, GPU use cases, nvtop'] },
      { id: '1.3', verb: 'Manage', title: 'storage in a Linux system', keepCase: true, sub: ['LVM logical volumes: lvchange, lvcreate, lvdisplay, lvremove, lvresize/lvextend, lvs', 'Volume groups: vgchange, vgcreate, vgdisplay, vgexport, vgextend, vgimport, vgremove, vgs, vgscan', 'Physical volumes: pvcreate, pvdisplay, pvmove, pvremove, pvresize, pvs, pvscan', 'Partitions: blkid, fdisk/gdisk, growpart, lsblk, parted', 'Filesystems: xfs, ext4, btrfs, tmpfs', 'Utilities: df, du, fio, fsck, mkfs, resize2fs, xfs_growfs, xfs_repair', 'RAID: /proc/mdstat, mdadm', 'Mounting: /etc/fstab, /etc/mtab, /proc/mounts, autofs, mount, umount', 'Mount options: noatime, nodev, nodiratime, noexec, nofail, nosuid, remount, ro, rw', 'Network mounts: NFS, SMB/Samba', 'Inodes'] },
      { id: '1.4', verb: 'Manage', title: 'network services and configurations on a Linux server', keepCase: true, sub: ['Configuration files: /etc/hosts, /etc/resolv.conf, /etc/nsswitch.conf', 'NetworkManager: nmcli, nmconnect', 'Netplan: netplan apply, status, try; /etc/netplan', 'Tools: arp, curl, dig, ethtool, hostname, ip address/link/route, iperf3, mtr, nc, nmap, nslookup, ping/ping6, ss, tcpdump, tracepath, traceroute'] },
      { id: '1.5', verb: 'Manage', title: 'a Linux system using common shell operations', keepCase: true, sub: ['Environment variables: DISPLAY, HOME, PATH, PS1, SHELL, USER', 'Paths: absolute and relative (~, /, ., .., -)', 'Shell configuration: .bashrc, .bash_profile, .profile', 'Redirection: <, >, <<, >>, |, stdin, stdout, stderr, here docs, <<<', 'Utilities: !, !!, alias, awk, bc, cat, cut, echo, grep, head, history, less, more, printf, sed, sort, source, tail, tee, tr, uname, uniq, wc, xargs', 'Text editors: vi/vim, nano'] },
      { id: '1.6', verb: 'Perform', title: 'backup and restore operations for a Linux server', keepCase: true, sub: ['Archiving: cpio, tar', 'Compression: 7-Zip, bzip2, gzip, unzip, xz', 'Other tools: dd, ddrescue, rsync, zcat, zgrep, zless'] },
      { id: '1.7', verb: 'Summarize', title: 'virtualization on Linux systems', keepCase: true, sub: ['Hypervisors: QEMU, KVM', 'VMs: paravirtualized drivers, VirtIO, disk image operations (convert, resize, properties), VM states, nested virtualization', 'VM operations: resources (storage, RAM, CPU, network), baseline image templates, cloning, migrations, snapshots', 'Bare metal vs. virtual machines', 'Network types: bridged, NAT, host-only/isolated, routed, open', 'Tools: libvirt, virsh, virt-manager'] },
    ],
  },
  {
    id: 2, weight: 20, title: 'Services and User Management', short: 'Services & users',
    topics: [
      { id: '2.1', verb: 'Manage', title: 'files and directories on a Linux system', keepCase: true, sub: ['Utilities: cd, cp, diff, file, find, ln, locate, ls, lsof, mkdir, mv, pwd, rm, rmdir, sdiff, stat, touch', 'Links: symbolic and hard', 'Device types in /dev: block, character, special character'] },
      { id: '2.2', verb: 'Perform', title: 'local account management in a Linux environment', keepCase: true, sub: ['Add: adduser, groupadd, useradd', 'Delete: deluser, groupdel, userdel', 'Modify: chsh, groupmod, passwd, usermod', 'Lock: chage, passwd, usermod', 'Expiration: configuration files, chage', 'List: getent passwd, groups, id, last, lastlog, w, who, whoami', 'Profile templates: /etc/profile, /etc/skel', 'Account files: /etc/group, /etc/passwd, /etc/shadow', 'Attributes: UID, GID, EUID, EGID', 'User vs. system vs. service accounts; UID ranges'] },
      { id: '2.3', verb: 'Manage', title: 'processes and jobs in a Linux environment', keepCase: true, sub: ['Verification: /proc/<PID>, atop, htop, lsof, mpstat, pidstat, ps, pstree, strace, top', 'PID and PPID', 'Process states: running, blocked, sleeping, stopped, zombie', 'Priority: nice, renice', 'Process limits', 'Job control: &, bg, fg, jobs, Ctrl+c, Ctrl+d, Ctrl+z, exec, kill, killall, nohup, pkill', 'Signals: 1 HUP, 9 KILL, 15 TERM', 'Scheduling: anacron, at, crontab'] },
      { id: '2.4', verb: 'Configure', title: 'and manage software in a Linux environment', keepCase: true, sub: ['Install, update, remove: repositories, source, dependencies and conflicts, package managers', 'Language-specific managers: pip, cargo, npm', 'Repository management: enabling/disabling, third party, GPG signatures', 'Package and repository exclusions', 'Update alternatives', 'Software configuration', 'Sandboxed applications', 'Basic configuration of common services: DNS, NTP/PTP, DHCP, HTTP (Apache httpd, Nginx), SMTP, IMAP4'] },
      { id: '2.5', verb: 'Manage', title: 'Linux using systemd', keepCase: true, sub: ['Units: services, timers, mounts, targets', 'Utilities: hostnamectl, resolvectl, sysctl, systemctl, systemd-analyze, systemd-analyze blame, systemd-resolved, timedatectl', 'Unit states: daemon-reload, disable, edit, enable, mask, reload, restart, start, status, stop, unmask'] },
      { id: '2.6', verb: 'Manage', title: 'applications in a container on a Linux server', keepCase: true, sub: ['Runtimes: runC, Podman, containerd, Docker', 'Images: pull, build (Dockerfile: ENTRYPOINT, CMD, USER, FROM), prune, tags, layers', 'Containers: logs, volume mapping, start/stop, inspect, delete, run, exec, prune, tags, environment variables', 'Volumes: create, map, prune, SELinux context, overlay', 'Networks: create, port mapping, prune; types macvlan, ipvlan, host, bridge, overlay, none', 'Privileged vs. unprivileged'] },
    ],
  },
  {
    id: 3, weight: 18, title: 'Security', short: 'Security',
    topics: [
      { id: '3.1', verb: 'Summarize', title: 'authorization, authentication and accounting methods', sub: ['Polkit', 'PAM', 'SSSD / Winbind, realm', 'LDAP', 'Kerberos', 'Samba', 'Logging: journalctl, rsyslog, logrotate, /var/log', 'System audit: audit.rules, auditd'] },
      { id: '3.2', verb: 'Configure', title: 'and implement firewalls on a Linux system', keepCase: true, sub: ['firewalld: firewall-cmd, runtime vs. permanent, rich rules, zones, ports vs. services', 'ufw: ports vs. services', 'nftables, iptables, ipset', 'Netfilter module', 'Address translation: NAT, PAT, DNAT, SNAT', 'Stateful vs. stateless', 'IP forwarding: net.ipv4.ip_forward'] },
      { id: '3.3', verb: 'Apply', title: 'OS hardening techniques on a Linux system', keepCase: true, sub: ['Privilege escalation: sudo, /etc/sudoers (NOEXEC, NOPASSWD), /etc/sudoers.d, visudo, sudo -i, wheel and sudo groups, su -', 'File attributes: chattr, lsattr, immutable, append only', 'Permissions: chgrp, chmod (octal, symbolic), chown; sticky bit, setuid, setgid; umask', 'ACLs: setfacl, getfacl', 'SELinux: restorecon, semanage, chcon, ls -Z, getenforce, setenforce, getsebool, setsebool, audit2allow, sealert; enforcing, permissive, disabled', 'chroot, fail2ban', 'Secure remote access: sshd, key vs. password, SSH tunneling, PermitRootLogin, disabling X forwarding, AllowUsers, AllowGroups, SSH agent, SFTP', 'Avoid insecure services: Telnet, FTP, TFTP', 'Disable unused filesystems; remove unnecessary SUID', 'Secure boot: UEFI'] },
      { id: '3.4', verb: 'Explain', title: 'account hardening techniques and best practices', sub: ['Passwords: complexity, length, expiration, reuse, history', 'Multifactor authentication', 'Checking existing breach lists', 'Restricted shells: /sbin/nologin, /bin/rbash', 'pam_tally2', 'Avoid running as root'] },
      { id: '3.5', verb: 'Explain', title: 'cryptographic concepts and technologies in a Linux environment', sub: ['Data at rest: GPG file encryption; LUKS2 filesystem encryption, Argon2', 'Data in transit: OpenSSL, WireGuard, LibreSSL, TLS protocol versions', 'Hashing: SHA-256, HMAC', 'Removal of weak algorithms', 'Certificate management: trusted root certificates, no-cost and commercial', 'Avoiding self-signed certificates'] },
      { id: '3.6', verb: 'Explain', title: 'the importance of compliance and audit procedures', sub: ['Detection and response: anti-malware, indicators of compromise', 'Vulnerability scanning: CVEs, CVSS, backporting patches, service misconfigurations, port scanners, protocol analyzers', 'Standards and audit: OpenSCAP, CIS Benchmarks', 'File integrity: AIDE, rkhunter, signed package verification, installed file verification', 'Secure data destruction: shred, badblocks -w, dd if=/dev/urandom, cryptographic destruction', 'Software supply chain', 'Security banners: /etc/issue, /etc/issue.net, /etc/motd'] },
    ],
  },
  {
    id: 4, weight: 17, title: 'Automation, Orchestration, and Scripting', short: 'Automation & scripting',
    topics: [
      { id: '4.1', verb: 'Summarize', title: 'the use cases and techniques of automation and orchestration', sub: ['Ansible: playbooks, inventory, modules, ad hoc, collections, facts, agentless', 'Puppet: classes, certificates, modules, facts, agent/agentless', 'OpenTofu: provider, resource, state, API', 'Unattended deployment: Kickstart, cloud-init', 'CI/CD: version control, shift-left testing, GitOps, pipelines, DevSecOps', 'Kubernetes: ConfigMaps, Secrets, Pods, Deployments, Volumes, Services, variables', 'Docker Swarm: service, nodes, tasks, networks, scale', 'Docker/Podman Compose: compose file, up/down, logs'] },
      { id: '4.2', verb: 'Perform', title: 'automated tasks using shell scripting', sub: ['Expansion: ${var}, $(cmd), `cmd`, subshell (cmd)', 'Functions', 'IFS / OFS', 'Conditionals: if, case', 'Loops: until, for, while', 'Interpreter directive: #!', 'Comparisons: numeric (-eq, -ge, -gt, -le, -lt, -ne) and string (>, <, ==, =, =~, !=, <=, >=)', 'Regular expressions: [[ $foo =~ regex ]]', 'Tests: !, -d, -f, -n, -z', 'Variables: environment, arguments, assignments (alias, export, local, set, unalias, unset), return codes ($?)'] },
      { id: '4.3', verb: 'Summarize', title: 'Python basics used for Linux system administration', keepCase: true, sub: ['Setting up a virtual environment', 'Built-in modules', 'Installing dependencies', 'Fundamentals: indentation, current versions', 'Data types: Boolean, dictionary, floating point, integer, list, string', 'Extensible using modules and packages', 'PEP 8 best practices'] },
      { id: '4.4', verb: 'Implement', title: 'version control using Git', keepCase: true, sub: ['.gitignore, init, clone, config', 'add, commit, diff, log', 'branch, checkout, merge, squash, rebase', 'fetch, pull, push', 'reset, stash, tag'] },
      { id: '4.5', verb: 'Summarize', title: 'best practices and responsible uses of AI', keepCase: true, sub: ['Use cases: generating code, regular expressions and infrastructure as code; documentation; compliance recommendations; security review; code optimization; linting', 'Best practices: no copy/paste without review, verify output', 'Data governance: security of data, LLM training, human review, local models, private vs. public', 'Adhere to corporate policy', 'Prompt engineering'] },
    ],
  },
  {
    id: 5, weight: 22, title: 'Troubleshooting', short: 'Troubleshooting',
    topics: [
      { id: '5.1', verb: 'Summarize', title: 'monitoring concepts and configurations in a Linux system', keepCase: true, sub: ['Service monitoring: SLA, SLI, SLO', 'Data acquisition: SNMP (traps, MIBs), agent/agentless, webhooks, health checks, log aggregation', 'Configurations: thresholds, alerts, events, notifications, logging'] },
      { id: '5.2', verb: 'Troubleshoot', title: 'hardware, storage and Linux OS issues', keepCase: true, sub: ['Kernel panic; data and kernel corruption', 'Package dependency issues', 'Filesystem will not mount; partition not writable', 'Server not turning on; server inaccessible; device failure', 'OS filesystem full; inode exhaustion; quota issues', 'Segmentation fault; killed processes; unresponsive process; memory leaks', 'GRUB misconfiguration', 'PATH misconfiguration', 'Systemd unit failures', 'Missing or disabled drivers'] },
      { id: '5.3', verb: 'Troubleshoot', title: 'networking issues on a Linux system', keepCase: true, sub: ['Misconfigured firewalls', 'DHCP and DNS issues', 'Interface misconfiguration: MTU mismatch, bonding, MAC spoofing, subnet, cannot ping server', 'Routing issues: gateway, server unreachable', 'IP conflicts', 'Dual stack issues (IPv4 and IPv6)', 'Link down; link negotiation issues'] },
      { id: '5.4', verb: 'Troubleshoot', title: 'security issues on a Linux system', keepCase: true, sub: ['SELinux issues: policy, context, Booleans', 'File and directory permission issues: ACLs, attributes', 'Account access', 'Unpatched vulnerable systems', 'Exposed or misconfigured services', 'Remote access issues', 'Certificate issues', 'Misconfigured package repository', 'Obsolete or insecure protocols and ciphers; cipher negotiation issues'] },
      { id: '5.5', verb: 'Troubleshoot', title: 'performance issues', sub: ['Memory: swapping, out of memory', 'CPU: high CPU usage, high load average, high context switching, CPU bottleneck', 'Disk: high I/O wait, high disk latency, slow remote storage response', 'Network: packet drops, jitter, random disconnects and timeouts, high latency, low throughput', 'Application: slow response, system unresponsiveness, blocked processes, slow startup, sluggish terminal', 'High failed log-in attempts; hardware errors; exceeding baselines'] },
    ],
  },
];

export const ALL_TOPICS = DOMAINS.flatMap((d) => d.topics.map((t) => ({ ...t, domain: d.id })));

export function topicLabel(t) {
  const keepCase = t.keepCase ?? /^[A-Z]{2}/.test(t.title);
  return `${t.verb} ${keepCase ? t.title : t.title.charAt(0).toLowerCase() + t.title.slice(1)}`;
}

export function topicById(id) {
  return ALL_TOPICS.find((t) => t.id === id);
}

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id);
}
