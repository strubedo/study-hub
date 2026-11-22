// Domain 3 — Security. Original questions; commands, options and output formats checked against local man pages and read-only runs (sshd_config, sudoers, pam_faillock, pam_nologin, nft, ufw, chattr/lsattr, getfacl, cryptsetup 2.8, journalctl, dpkg --verify) and the firewalld, SELinux policycoreutils, Fedora selinux-policy port definitions, auditd and fail2ban documentation.
const L31A = '3.1-identity-pam-directory-services';
const L31B = '3.1-logging-auditd';
const L32A = '3.2-firewalld-ufw';
const L32B = '3.2-netfilter-nftables-nat';
const L33A = '3.3-privilege-permissions-acls';
const L33B = '3.3-selinux';
const L33C = '3.3-ssh-services-boot';
const L34 = '3.4-account-hardening';
const L35 = '3.5-cryptography';
const L36 = '3.6-compliance-audit';

const bank = [
  // ---------- 3.1 ----------
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. A custom login service on srv01 uses the PAM stack shown, and the file /etc/nologin exists during maintenance. User bob (not root) connects and types his correct password. What happens?',
    exhibit: `srv01# grep '^auth' /etc/pam.d/maintlogin
auth    requisite     pam_nologin.so
auth    sufficient    pam_unix.so
auth    required      pam_deny.so
srv01# ls -l /etc/nologin
-rw-r--r--. 1 root root 38 Nov 22 06:00 /etc/nologin`,
    options: ['Authentication fails at once: pam_nologin fails for non-root users while /etc/nologin exists, and requisite returns immediately without running pam_unix', 'Authentication succeeds, because the sufficient pam_unix module accepts the correct password and ends the stack', 'Authentication fails only after pam_deny runs, because requisite failures are deferred to the end of the stack like required ones', 'Authentication succeeds, because pam_nologin affects only local console logins'],
    answer: [0],
    explanation: 'pam_nologin refuses every user except root while /etc/nologin exists (and shows its text). With the `requisite` control, a failure ends the stack immediately, so pam_unix never checks the password. It does not succeed through pam_unix, because the stack never reaches it. Deferring the failure to the end of the stack is how `required` behaves, not `requisite`; either way the result would be failure. pam_nologin applies to whichever service stack includes it, SSH included, not just consoles.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Refer to the exhibit. Alice\'s password is correct and the KDC is reachable. What should the administrator fix first?',
    exhibit: `alice@srv01:~$ kinit alice@EXAMPLE.COM
Password for alice@EXAMPLE.COM:
kinit: Clock skew too great while getting initial credentials
alice@srv01:~$ timedatectl | grep -E 'Local time|synchronized'
               Local time: Sun 2026-11-22 09:41:07 UTC
System clock synchronized: no`,
    options: ['Time synchronization: start and enable chronyd (or systemd-timesyncd) so the clock is within the KDC\'s allowed skew, 5 minutes by default', 'The realm name: Kerberos realms must be written in lower case, so use alice@example.com', 'The host keytab: run klist -k and add the missing host principal to /etc/krb5.keytab', 'The password: reset alice\'s password in the directory, because an expired password produces a clock-skew error'],
    answer: [0],
    explanation: 'Kerberos rejects requests whose timestamps differ from the KDC\'s clock by more than the allowed skew (300 seconds by default), and the exhibit shows the clock is not synchronized. Fixing NTP fixes the error. Realms are conventionally upper case, so changing to lower case would break the lookup instead. The host keytab is used by services accepting tickets, not by a user\'s kinit. An expired password produces a password-expired prompt or error, not "Clock skew too great".' },
  { topic: '3.1', type: 'multi', difficulty: 2, lesson: L31A,
    stem: 'Which two statements about SSSD are true? (Choose two.)',
    options: ['It serves both identity lookups through NSS (`sss` in /etc/nsswitch.conf) and authentication through PAM (`pam_sss`)', 'SSSD refuses to start if /etc/sssd/sssd.conf is not owned by root with mode 0600', 'It replaces Kerberos, so a host that uses SSSD with Active Directory no longer needs /etc/krb5.conf or a keytab', 'It can authenticate only local accounts listed in /etc/shadow', 'Its cache is cleared at every login, so users can never log in while the directory server is offline'],
    answer: [0, 1],
    explanation: 'SSSD is one daemon that answers both "who is this user?" (NSS) and "is this password right?" (PAM) for LDAP, AD and IdM domains, and it insists that sssd.conf and its snippets are root-owned with mode 0600. It does not replace Kerberos; with id_provider = ad it uses Kerberos and the host keytab that `realm join` creates. Local /etc/shadow accounts are handled by pam_unix, not SSSD. SSSD caches identities and credentials precisely so that users can still log in when the directory is unreachable.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31A,
    stem: 'Members of the local group webops must be able to run `systemctl restart nginx` as themselves, without sudo and without a password prompt. Where should the administrator put the policy?',
    options: ['A JavaScript rule in /etc/polkit-1/rules.d/ that returns polkit.Result.YES for action org.freedesktop.systemd1.manage-units when subject.isInGroup("webops")', 'An XML file in /usr/share/polkit-1/actions/ that changes the implicit defaults for the systemd actions', 'A file in /etc/sudoers.d/ granting %webops NOPASSWD: /usr/bin/systemctl restart nginx', 'A line in /etc/pam.d/systemd-user that adds pam_permit.so for the webops group'],
    answer: [0],
    explanation: '`systemctl` run by an unprivileged user asks systemd over D-Bus, and systemd asks Polkit to authorize the manage-units action; local administrator policy belongs in /etc/polkit-1/rules.d/. The .policy files under /usr/share/polkit-1/actions belong to packages and are overwritten on update. A sudoers rule would work only through `sudo`, which the requirement excludes. The systemd-user PAM stack sets up user sessions and has nothing to do with authorizing unit management.' },
  { topic: '3.1', type: 'match', difficulty: 2, lesson: L31A,
    stem: 'Match each component to its job.',
    pairs: [['smbd', 'Serves SMB file and print shares on TCP 445'], ['nmbd', 'Provides NetBIOS name service on UDP 137'], ['winbindd', 'Maps Active Directory users and groups for a Samba member server'], ['sssd', 'Caching NSS and PAM client for LDAP, AD and IdM domains'], ['realm', 'Discovers and joins a domain and writes the client configuration']],
    explanation: 'smbd is Samba\'s file and print server (TCP 445, plus 139 for legacy NetBIOS sessions). nmbd answers NetBIOS name queries and browsing on UDP 137 and 138. winbindd resolves domain users and groups and handles ID mapping when Samba is a member of an AD domain. sssd is the general-purpose client for remote identities with offline caching. realm (realmd) is a command-line tool, not a daemon you configure: it discovers the domain, joins it and writes sssd.conf, krb5.conf and the PAM/NSS settings.' },
  { topic: '3.1', type: 'fill', difficulty: 1, lesson: L31B,
    stem: 'Enter the journalctl command that shows journal entries from the previous boot only.',
    answer: ['journalctl -b -1', 'journalctl --boot=-1', 'journalctl --boot -1', 'journalctl -b-1'],
    explanation: '`-b` selects a boot; `0` (or no value) is the current boot, `-1` the one before, `-2` the one before that. `journalctl --list-boots` shows the offsets. Previous boots exist only if the journal is persistent (`Storage=persistent`, or `auto` with /var/log/journal present).' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31B,
    stem: 'Refer to the exhibit. After each nightly rotation the new app.log stays empty while app.log.1 keeps growing. The application has no way to reopen its log file on a signal. Which change fixes this?',
    exhibit: `srv01# cat /etc/logrotate.d/app
/var/log/app/app.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    create 0640 svc_app adm
}
srv01# ls -l /var/log/app/
-rw-r-----. 1 svc_app adm         0 Nov 22 00:00 app.log
-rw-r-----. 1 svc_app adm  48211940 Nov 22 09:12 app.log.1
-rw-r-----. 1 svc_app adm   3801225 Nov 21 00:00 app.log.2.gz`,
    options: ['Replace the create directive with copytruncate, so logrotate copies the log and truncates the original file in place', 'Add delaycompress a second time inside a postrotate block', 'Change daily to size 100M so the file is rotated less often', 'Remove missingok so logrotate reports an error when the log is still open'],
    answer: [0],
    explanation: 'logrotate renamed app.log to app.log.1, but the application still holds the old file descriptor, so it keeps writing to the renamed file. When the program cannot be told to reopen (no postrotate signal works), `copytruncate` keeps the same inode in place: logrotate copies the content and truncates the original, at the cost of possibly losing a few lines written during the copy (`create` is not used together with it). delaycompress only postpones compression and is not a postrotate command. Rotating less often by size does not change which file the program writes to. missingok only controls errors for missing files.' },
  { topic: '3.1', type: 'single', difficulty: 2, lesson: L31B,
    stem: 'Refer to the exhibit. The watch on /etc/sudoers disappeared after a reboot. How should the administrator make it persistent?',
    exhibit: `srv01# auditctl -w /etc/sudoers -p wa -k priv_esc
srv01# auditctl -l
-w /etc/sudoers -p wa -k priv_esc
srv01# reboot
...
srv01# auditctl -l
No rules`,
    options: ['Put the line -w /etc/sudoers -p wa -k priv_esc in a file under /etc/audit/rules.d/ ending in .rules and run augenrules --load', 'Add -k persistent to the auditctl command so the kernel keeps the rule', 'Add the watch to /etc/audit/auditd.conf and restart auditd with systemctl restart auditd', 'Add -e 2 to the auditctl command, which saves the rule set to disk'],
    answer: [0],
    explanation: 'auditctl changes only the rules loaded in the running kernel. At boot the rules come from /etc/audit/audit.rules, which augenrules builds from /etc/audit/rules.d/*.rules (files must end in .rules); `augenrules --load` rebuilds and loads them now. `-k` merely tags records with a search key. auditd.conf holds daemon settings such as log size and disk-full actions, not rules, and on RHEL the auditd unit refuses `systemctl restart`. `-e 2` locks the configuration until reboot; it saves nothing.' },

  // ---------- 3.2 ----------
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. HTTPS clients still cannot connect. Which single command makes the saved configuration active without losing the new rule?',
    exhibit: `srv01# firewall-cmd --permanent --add-service=https
success
srv01# firewall-cmd --list-services
cockpit dhcpv6-client ssh
srv01# firewall-cmd --permanent --list-services
cockpit dhcpv6-client https ssh`,
    options: ['firewall-cmd --reload', 'firewall-cmd --runtime-to-permanent', 'systemctl restart NetworkManager', 'firewall-cmd --permanent --add-port=443/tcp'],
    answer: [0],
    explanation: 'With --permanent, firewalld changed only the saved configuration; the running firewall (shown by --list-services without --permanent) does not have https. `--reload` replaces the runtime configuration with the permanent one while keeping connection state. `--runtime-to-permanent` works in the opposite direction: it would overwrite the permanent configuration with the runtime one and remove https from it. Restarting NetworkManager does not reload firewalld rules. Adding 443/tcp with --permanent again changes only the saved configuration.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32A,
    stem: 'An administrator tested several firewall-cmd changes without --permanent and they all work. Enter the complete firewall-cmd command that saves the current runtime configuration as the permanent configuration.',
    answer: ['firewall-cmd --runtime-to-permanent'],
    explanation: '`firewall-cmd --runtime-to-permanent` writes the active runtime configuration to /etc/firewalld/, overwriting the permanent configuration. Without it, the tested changes are lost at the next `--reload`, firewalld restart or reboot.' },
  { topic: '3.2', type: 'single', difficulty: 3, lesson: L32A,
    stem: 'Refer to the exhibit. eth0 is in the public zone. What happens when 203.0.113.50 opens a new SSH connection to srv01?',
    exhibit: `srv01# firewall-cmd --zone=public --list-all
public (active)
  target: default
  icmp-block-inversion: no
  interfaces: eth0
  sources:
  services: dhcpv6-client ssh
  ports:
  protocols:
  forward: yes
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
	rule family="ipv4" source address="203.0.113.50" reject`,
    options: ['It is rejected, because within a zone the reject and drop rich rules are evaluated before allow rules such as the ssh service', 'It is accepted, because services are always evaluated before rich rules', 'It is accepted, because rich rules without a service or port element apply only to forwarded traffic', 'It is accepted until firewall-cmd --reload is run, because rich rules exist only in the permanent configuration'],
    answer: [0],
    explanation: 'firewalld places default-priority rich rules into a zone\'s log, deny and allow chains and walks them in that order; the zone\'s services and ports sit in the allow chain. A reject rule for the source therefore wins over `services: ssh`. Services are not evaluated first, which is why the source block works. A rich rule with only a source applies to all traffic from that source into the zone, not just forwarded traffic. The rule appears in the output of --list-all without --permanent, which shows the runtime configuration, so it is already active.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32A,
    stem: 'Refer to the exhibit. The host 203.0.113.50 can still open HTTPS connections to srv01. Which action fixes this?',
    exhibit: `srv01# ufw status numbered
Status: active

     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    198.51.100.0/24
[ 2] 443/tcp                    ALLOW IN    Anywhere
[ 3] Anywhere                   DENY IN     203.0.113.50`,
    options: ['ufw insert 1 deny from 203.0.113.50, then delete the old deny rule, because ufw uses the first matching rule and rule 2 matches first', 'ufw reload, because deny rules are applied only after a reload', 'ufw default deny incoming, because deny rules work only when the default policy is deny', 'ufw deny 443/tcp, because a deny rule must name the same port as the allow rule'],
    answer: [0],
    explanation: 'ufw evaluates rules in order and the first match wins, so an HTTPS packet from 203.0.113.50 matches rule 2 (allow 443/tcp from anywhere) before reaching rule 3. Inserting the deny at position 1 fixes the order; after the insert the old deny becomes rule 4 and can be deleted. ufw applies rules as they are added, so a reload changes nothing. The default policy only covers packets that match no rule. `ufw deny 443/tcp` would block HTTPS for everyone, and placed after rule 2 it would never match anyway.' },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32A,
    stem: 'Match each command to what it adds.',
    pairs: [['ufw allow 443/tcp', 'A ufw rule for one port and protocol'], ['ufw allow http', 'A ufw rule whose port is looked up in /etc/services'], ["ufw allow 'Nginx Full'", 'A ufw rule from an application profile in /etc/ufw/applications.d'], ['firewall-cmd --add-service=https', 'A firewalld rule from an XML service definition that can bundle ports and helpers'], ['firewall-cmd --add-port=8443/tcp', 'A firewalld runtime rule for a single port in the default zone']],
    explanation: 'ufw accepts a port/protocol (443/tcp), a service name resolved through /etc/services (http becomes 80/tcp), or an application profile that can list several ports (Nginx Full is 80 and 443). firewalld services are XML files in /usr/lib/firewalld/services or /etc/firewalld/services and can include several ports, protocols and conntrack helpers. --add-port opens exactly one port or range; without --zone it acts on the default zone and without --permanent it changes only the runtime configuration.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. Inbound SSH to srv01 works, but every outbound connection from srv01 (dnf, curl to an IP address, NTP) times out. What is the fix?',
    exhibit: `srv01# nft list ruleset
table inet filter {
	chain input {
		type filter hook input priority filter; policy drop;
		iif "lo" accept
		tcp dport 22 accept
	}
}`,
    options: ['Add ct state established,related accept near the top of the input chain, so replies to connections that srv01 starts are accepted', 'Add an output chain with policy accept, because without one all outgoing packets are dropped', 'Set net.ipv4.ip_forward=1, because replies to local connections are forwarded packets', 'Change the table family from inet to ip, because inet tables cannot match TCP'],
    answer: [0],
    explanation: 'The input chain has a drop policy and no connection-tracking rule, so the replies to srv01\'s own outgoing connections (which arrive with random destination ports) are dropped; this ruleset behaves statelessly. Accepting `ct state established,related` makes it stateful and lets replies in. Outgoing packets are not blocked: with no output base chain, nothing filters the output hook. Replies to local connections go to the input hook, not forward, so ip_forward is irrelevant. inet tables match TCP for both IPv4 and IPv6.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit from a RHEL 9 host. What does the output mean?',
    exhibit: `srv01$ iptables -V
iptables v1.8.10 (nf_tables)`,
    options: ['iptables is the iptables-nft compatibility tool: it accepts iptables syntax but stores the rules as nftables rules in the kernel', 'The legacy x_tables back end is in use, and nft cannot be used on this host', 'iptables rules are converted to firewalld zones at the next reload', 'Both iptables-legacy and nftables are active, which is the recommended configuration'],
    answer: [0],
    explanation: '"(nf_tables)" identifies iptables-nft, the default on RHEL 8 and later and on current Debian and Ubuntu: same command syntax, but the rules live in nftables tables such as `ip filter`, visible with `nft list ruleset`. The legacy back end would show "(legacy)". iptables does not convert rules into firewalld zones. Running legacy and nft back ends at the same time creates two independent rule sets that hide each other, which is exactly what to avoid.' },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32B,
    stem: 'A packet arrives on a Linux gateway\'s outside interface for a port-forwarded web server inside. Put the stages it passes through in order.',
    items: ['prerouting hook: DNAT changes the destination to the inside server', 'Routing decision selects the inside interface', 'forward hook: filter rules see the translated destination', 'postrouting hook: source NAT rules run', 'Packet leaves the inside interface'],
    explanation: 'Destination NAT happens in prerouting, before routing, so that the routing decision uses the translated address. Forwarded packets then pass the forward hook, where filter rules must allow the inside address and port. postrouting is the last hook before transmission, where SNAT and masquerade happen. For later packets of the same connection, conntrack applies the same translations automatically.' },
  { topic: '3.2', type: 'multi', difficulty: 2, lesson: L32B,
    stem: 'A Linux host with LAN interface eth1 (10.0.0.0/24) and internet interface eth0 must give LAN clients internet access. Which three things are required? (Choose three.)',
    options: ['net.ipv4.ip_forward set to 1', 'A masquerade (or SNAT) rule in the postrouting hook for traffic leaving eth0', 'Forward-chain rules or policy that accept the LAN traffic and its replies', 'A DNAT rule in the prerouting hook for 10.0.0.0/24', 'Input-chain rules that accept TCP 80 and 443 from 10.0.0.0/24', 'An ipset containing every LAN client address'],
    answer: [0, 1, 2],
    explanation: 'Without ip_forward the kernel does not route between interfaces. Source NAT in postrouting (masquerade for a dynamic address) replaces the private source addresses with eth0\'s address. Routed traffic is filtered in the forward hook, so it must be accepted there (typically new from eth1 to eth0 plus established,related). DNAT is for publishing inside services, not for outbound access. Forwarded packets never pass the input hook, which filters traffic to the gateway itself. An ipset is optional convenience; a subnet match does the same.' },
  { topic: '3.2', type: 'fill', difficulty: 1, lesson: L32B,
    stem: 'Enter a command that enables IPv4 forwarding immediately (it does not need to survive a reboot).',
    answer: ['sysctl -w net.ipv4.ip_forward=1', 'sysctl net.ipv4.ip_forward=1', 'sysctl -w net/ipv4/ip_forward=1', 'sysctl net/ipv4/ip_forward=1', 'echo 1 > /proc/sys/net/ipv4/ip_forward'],
    explanation: '`sysctl -w net.ipv4.ip_forward=1` sets the kernel parameter at runtime (procps sysctl also accepts the assignment without -w, and the slash form of the name). Writing 1 to /proc/sys/net/ipv4/ip_forward is the same thing. To persist it, put `net.ipv4.ip_forward = 1` in a file in /etc/sysctl.d/ and run `sysctl --system`.' },
  { topic: '3.2', type: 'single', difficulty: 2, lesson: L32B,
    stem: 'An administrator using iptables must block several thousand networks of different prefix lengths from a threat feed without writing one rule per network. Which approach fits?',
    options: ['ipset create blocklist hash:net, add the networks, and match them with one rule: iptables -I INPUT -m set --match-set blocklist src -j DROP', 'ipset create blocklist bitmap:port and add each network as a port range', 'Put the networks in /etc/hosts.deny so iptables reads them at the next restart', 'Add each network with iptables -A INPUT -s <net> -j DROP, because ipsets cannot hold networks'],
    answer: [0],
    explanation: 'An ipset of type hash:net holds networks of any prefix length in a kernel hash, and one iptables rule with the set match checks a packet against all of them in roughly constant time. bitmap:port stores port numbers, not addresses. /etc/hosts.deny belongs to TCP wrappers and has never been read by iptables. One rule per network is exactly the slow, unmanageable approach the set avoids, and ipsets can hold networks.' },

  // ---------- 3.3 ----------
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'Refer to the exhibit. alice is a member of webops, but sudo does not grant her the rule. Why?',
    exhibit: `srv01# ls -l /etc/sudoers.d/
-r--r-----. 1 root root 52 Nov 22 09:30 webops.conf
srv01# cat /etc/sudoers.d/webops.conf
%webops ALL=(root) /usr/bin/systemctl restart nginx
srv01# id alice
uid=1001(alice) gid=1001(alice) groups=1001(alice),1600(webops)
alice@srv01:~$ sudo -l
Sorry, user alice may not run sudo on srv01.`,
    options: ['sudo skips files in /etc/sudoers.d whose names contain a dot, so webops.conf is never read; rename it to webops', 'Files in /etc/sudoers.d must be mode 0644, so the 0440 file cannot be read', 'The rule needs NOPASSWD: or sudo ignores it', 'alice must run sudo -k first to load the new rule'],
    answer: [0],
    explanation: 'The @includedir (or #includedir) directive skips file names that end in `~` or contain a `.`, to ignore editor backups and package-manager leftovers, so webops.conf is silently ignored. 0440 root:root is the recommended mode for sudoers files; sudo runs as root and reads it fine. NOPASSWD only removes the password prompt; a rule without it is still valid. `sudo -k` discards the cached authentication and has nothing to do with loading rules, which sudo reads on every invocation.' },
  { topic: '3.3', type: 'fill', difficulty: 1, lesson: L33A,
    stem: 'Enter the command that safely edits the sudoers drop-in file /etc/sudoers.d/webops, with locking and a syntax check before it is saved.',
    answer: ['visudo -f /etc/sudoers.d/webops', 'visudo --file=/etc/sudoers.d/webops', 'visudo --file /etc/sudoers.d/webops'],
    explanation: '`visudo -f <file>` edits the named file with the same locking and parse check that plain `visudo` applies to /etc/sudoers, and refuses to install a file with syntax errors. `visudo -c` only checks the existing files.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'A junior administrator must get a root login shell, with root\'s environment and home directory, but must authenticate with their own password because nobody shares the root password. Which command fits?',
    options: ['sudo -i', 'su -', 'sudo -s', 'su'],
    answer: [0],
    explanation: '`sudo -i` runs root\'s shell as a login shell (reading root\'s profile and changing to /root) after checking the invoking user\'s own password against the sudoers policy. `su -` also gives a root login shell, but it asks for root\'s password. `sudo -s` uses your own password but keeps your environment and working directory, so it is not a login shell. Plain `su` needs root\'s password and is not a login shell either.' },
  { topic: '3.3', type: 'multi', difficulty: 2, lesson: L33A,
    stem: 'Which two commands give alice full sudo rights through the default sudoers rules of the named distribution? (Choose two.)',
    options: ['On RHEL 9: usermod -aG wheel alice', 'On Ubuntu 24.04: usermod -aG sudo alice', 'On Ubuntu 24.04: usermod -aG wheel alice', 'On RHEL 9: usermod -aG sudo alice', 'On Ubuntu 24.04: usermod -aG adm alice'],
    answer: [0, 1],
    explanation: 'RHEL\'s /etc/sudoers contains `%wheel ALL=(ALL) ALL`, and Debian and Ubuntu ship `%sudo ALL=(ALL:ALL) ALL`, so the admin group is wheel on the RPM family and sudo on the Debian family. Ubuntu has no default sudoers rule for a wheel group, and RHEL has no sudo group rule. Ubuntu\'s adm group grants read access to logs, not sudo.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33A,
    stem: 'A shared project directory must be rwx for owner and group, r-x for others, and every file created in it must inherit the directory\'s group. Enter the four-digit octal mode.',
    answer: ['2775'],
    explanation: 'The leading 2 is the setgid bit, which on a directory makes new files and subdirectories take the directory\'s group. 775 gives rwx to owner and group and r-x to others. `ls -ld` shows it as drwxrwsr-x.' },
  { topic: '3.3', type: 'single', difficulty: 1, lesson: L33A,
    stem: 'Refer to the exhibit. Which permissions will report.txt and archive have?',
    exhibit: `alice@srv01:~$ umask 0027
alice@srv01:~$ touch report.txt
alice@srv01:~$ mkdir archive
alice@srv01:~$ ls -ld report.txt archive`,
    options: ['-rw-r----- for report.txt and drwxr-x--- for archive', '-rwxr-x--- for report.txt and drwxr-x--- for archive', '-rw-r--r-- for report.txt and drwxr-xr-x for archive', '----w-rwx for report.txt and d---w-rwx for archive'],
    answer: [0],
    explanation: 'Files start from 666 and directories from 777, and the umask removes bits: 666 minus 027 gives 640 (rw-r-----), 777 minus 027 gives 750 (rwxr-x---). New regular files are never created with execute bits, so -rwxr-x--- is wrong. 644/755 is what umask 022 would give. The last option applies the umask value itself as the mode, which is the classic misreading.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'Refer to the exhibit. Root cannot change /etc/hosts. What must root do before editing it?',
    exhibit: `srv01# echo "192.0.2.10 web01.example.com web01" >> /etc/hosts
-bash: /etc/hosts: Operation not permitted
srv01# ls -l /etc/hosts
-rw-r--r--. 1 root root 158 Nov 20 10:01 /etc/hosts
srv01# lsattr /etc/hosts
----i---------e------- /etc/hosts`,
    options: ['Remove the immutable attribute with chattr -i /etc/hosts', 'Run chmod u+w /etc/hosts, because the owner write bit is missing', 'Run setenforce 0, because only SELinux can block root this way', 'Remove the extent attribute with chattr -e /etc/hosts'],
    answer: [0],
    explanation: 'The `i` in the lsattr output is the immutable attribute: nobody, not even root, can write, append to, rename or delete the file until root removes it with `chattr -i` (and should then find out who set it). The mode already shows rw- for the owner. SELinux denials can also return errors to root, but the exhibit shows the immutable flag, which explains this one, and permissive mode would not clear it. `e` is ext4\'s normal extent-mapping flag and has nothing to do with write protection.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33A,
    stem: 'Refer to the exhibit. bob reports that he can read config.yml but not write it, although his ACL entry says rw-. What is the cause?',
    exhibit: `srv01$ getfacl /srv/app/config.yml
getfacl: Removing leading '/' from absolute path names
# file: srv/app/config.yml
# owner: alice
# group: webdev
user::rw-
user:bob:rw-	#effective:r--
group::rw-	#effective:r--
mask::r--
other::---`,
    options: ['The ACL mask is r--, which limits named users and groups to read; restore it with setfacl -m m::rw /srv/app/config.yml (or chmod g+w)', 'Named user entries are ignored unless bob is also in the owning group webdev', 'The other entry is ---, and the other entry overrides named user entries', 'ACLs never grant write access; only the owner can write a file'],
    answer: [0],
    explanation: 'The mask is the upper limit for every named user, every named group and the owning group; getfacl prints #effective:r-- because mask::r-- strips bob\'s write permission. A `chmod g=r` on a file with an ACL changes the mask, which is a common way this happens. Raising the mask (setfacl -m m::rw, or chmod g+w) restores rw. Named user entries apply without group membership. The other entry applies only to users who match no other entry. ACL entries can grant write, as bob\'s entry would if the mask allowed it.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33B,
    stem: 'Refer to the exhibit. alice wrote index.html in her home directory and moved it into place. SELinux is enforcing. Which command fixes the 403 in a way that survives a filesystem relabel?',
    exhibit: `srv01# curl -s -o /dev/null -w '%{http_code}\\n' http://localhost/index.html
403
srv01# ls -lZ /var/www/html/
-rw-r--r--. 1 alice alice unconfined_u:object_r:user_home_t:s0 18 Nov 22 10:01 index.html`,
    options: ['restorecon -v /var/www/html/index.html', 'chmod 644 /var/www/html/index.html', 'setenforce 0', 'semanage port -a -t http_port_t -p tcp 80'],
    answer: [0],
    explanation: '`mv` keeps a file\'s existing label, so the page is still user_home_t, which httpd_t may not read. restorecon resets it to what the file-context rules say for /var/www/html (httpd_sys_content_t); because the label then comes from the policy rules, a relabel produces the same result. The mode is already 644, so chmod changes nothing. setenforce 0 only switches to permissive until the next boot and removes protection instead of fixing the label. Port 80 is already http_port_t (semanage port -a either refuses with "already defined" or, in policycoreutils 3.7 and later, just re-applies the type), and port labels have nothing to do with reading a file anyway.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33B,
    stem: 'httpd must reverse-proxy to an application on another host, and SELinux blocks the outbound connection. Enter the command that turns on the boolean httpd_can_network_connect so that it stays on after reboots.',
    answer: ['setsebool -P httpd_can_network_connect on', 'setsebool -P httpd_can_network_connect 1', 'setsebool -P httpd_can_network_connect true', 'setsebool -P httpd_can_network_connect=on', 'setsebool -P httpd_can_network_connect=1', 'setsebool -P httpd_can_network_connect=true', 'semanage boolean -m --on httpd_can_network_connect', 'semanage boolean -m -1 httpd_can_network_connect', 'semanage boolean --modify --on httpd_can_network_connect'],
    explanation: '`setsebool -P` changes the boolean now and writes it to the policy store so it persists; without `-P` it reverts at boot. setsebool accepts on/off, 1/0 or true/false, and the name=value form. `semanage boolean -m --on` (short `-1`) is the equivalent persistent change through semanage. Check the result with `getsebool httpd_can_network_connect` or `semanage boolean -l`.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33B,
    stem: 'Refer to the exhibit. httpd was reconfigured with Listen 8090 and now fails to start. The firewall already allows 8090/tcp. What is the correct fix?',
    exhibit: `srv01# systemctl restart httpd
Job for httpd.service failed because the control process exited with error code.
See "systemctl status httpd.service" and "journalctl -xeu httpd.service" for details.
srv01# ausearch -m AVC -ts recent | grep name_bind
type=AVC msg=audit(1795341731.412:421): avc:  denied  { name_bind } for  pid=2301 comm="httpd" src=8090 scontext=system_u:system_r:httpd_t:s0 tcontext=system_u:object_r:unreserved_port_t:s0 tclass=tcp_socket permissive=0`,
    options: ['semanage port -a -t http_port_t -p tcp 8090', 'setsebool -P httpd_can_network_connect on', 'restorecon -Rv /etc/httpd', 'firewall-cmd --permanent --add-port=8090/tcp && firewall-cmd --reload'],
    answer: [0],
    explanation: 'The AVC shows httpd_t denied name_bind on a TCP socket whose port type is unreserved_port_t: the policy lets httpd bind only ports labelled http_port_t. Adding 8090 to http_port_t with `semanage port -a` fixes it persistently. httpd_can_network_connect allows outbound connections, not binding a listening port. The denial is about the port\'s label, not file labels under /etc/httpd. The firewall filters packets and cannot stop a process from binding a socket; the stem also says it is already open.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33C,
    stem: 'Refer to the exhibit. The administrator set PermitRootLogin no in /etc/ssh/sshd_config and reloaded sshd, but root can still log in. What is the cause?',
    exhibit: `srv01# grep -nE '^(Include|PermitRootLogin)' /etc/ssh/sshd_config
12:Include /etc/ssh/sshd_config.d/*.conf
42:PermitRootLogin no
srv01# cat /etc/ssh/sshd_config.d/50-cloud-init.conf
PermitRootLogin yes
PasswordAuthentication yes
srv01# sshd -T | grep -i permitrootlogin
permitrootlogin yes`,
    options: ['For most sshd keywords the first value read wins, and the Include on line 12 reads the drop-in before line 42; set PermitRootLogin no in that drop-in or in one that sorts earlier, then reload', 'sshd uses the last value it reads, so line 42 must be moved below the Include line', 'sshd -T shows the values compiled into the binary, so the running daemon must be restarted rather than reloaded', 'no is not a valid value; it must be prohibit-password'],
    answer: [0],
    explanation: 'sshd_config(5): "for each keyword, the first obtained value will be used." The Include on line 12 pulls in 50-cloud-init.conf first, so its PermitRootLogin yes wins; sshd -T, which prints the effective configuration from the files, confirms it. The fix is to change that drop-in or add an earlier one such as 10-hardening.conf. Line 42 is already after the Include, which is precisely the problem, and moving it further down does not help. sshd -T reads the configuration files, not compiled defaults. no is a valid value (yes, prohibit-password, forced-commands-only, no).' },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L33C,
    stem: 'Match each ssh option to what it does.',
    pairs: [['-L 5432:db01:5432', 'Listens on a local port and forwards it through the server to db01:5432'], ['-R 8080:localhost:80', 'Listens on a port on the server and forwards it back to port 80 on the client side'], ['-D 1080', 'Runs a local SOCKS proxy through the SSH connection'], ['-J jump01', 'Connects to the target through a bastion host without forwarding the agent'], ['-A', 'Forwards the local ssh-agent to the remote host']],
    explanation: '-L is a local forward: connections to the client\'s port 5432 are carried to the server, which connects to db01:5432. -R is the reverse: the server listens and the connection is made from the client side. -D creates a dynamic SOCKS proxy. -J (ProxyJump) chains through a bastion with end-to-end SSH to the target. -A forwards the agent, which lets root on the remote host use your keys while you are connected, so prefer -J where possible.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33C,
    stem: 'Enter the PermitRootLogin value that allows root to log in over SSH with a key but never with a password or keyboard-interactive authentication.',
    answer: ['prohibit-password', 'PermitRootLogin prohibit-password', 'without-password', 'PermitRootLogin without-password'],
    explanation: '`prohibit-password` (the upstream default) disables password and keyboard-interactive authentication for root while allowing public-key logins; `without-password` is its deprecated alias. `forced-commands-only` would allow keys only with a forced command, and `no` blocks root entirely.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33C,
    stem: 'Refer to the exhibit. 198.51.100.20 is the administrator\'s workstation in the management subnet 198.51.100.0/24; a mistyped password in a script got it banned. Which action restores access and prevents a repeat?',
    exhibit: `srv01# fail2ban-client status sshd
Status for the jail: sshd
|- Filter
|  |- Currently failed:	0
|  |- Total failed:	57
|  \`- Journal matches:	_SYSTEMD_UNIT=sshd.service + _COMM=sshd
\`- Actions
   |- Currently banned:	2
   |- Total banned:	9
   \`- Banned IP list:	203.0.113.50 198.51.100.20`,
    options: ['Run fail2ban-client set sshd unbanip 198.51.100.20 and add ignoreip = 127.0.0.1/8 ::1 198.51.100.0/24 to /etc/fail2ban/jail.local', 'Raise maxretry to 50 in /etc/fail2ban/jail.conf', 'Restart sshd so that it clears the ban list', 'Set bantime = -1 in /etc/fail2ban/jail.local'],
    answer: [0],
    explanation: 'unbanip removes the existing ban immediately, and ignoreip stops fail2ban from ever banning the management subnet (keep the loopback entries). Local changes belong in jail.local, which survives package updates. Editing jail.conf is overwritten on upgrade, does not lift the current ban, and a high maxretry weakens protection for everyone. The ban is a firewall rule managed by fail2ban, so restarting sshd does not touch it. bantime = -1 makes bans permanent, the opposite of what is needed.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33C,
    stem: 'Refer to the exhibit. A CIS benchmark requires that the cramfs filesystem module cannot be loaded. Why did the configuration fail, and what fixes it?',
    exhibit: `srv01# cat /etc/modprobe.d/cis.conf
blacklist cramfs
srv01# modprobe -v cramfs
insmod /lib/modules/5.14.0-503.11.1.el9_5.x86_64/kernel/fs/cramfs/cramfs.ko.xz
srv01# lsmod | grep cramfs
cramfs                 24576  0`,
    options: ['blacklist only stops loading by alias, not an explicit modprobe; add install cramfs /bin/false and remove the loaded module with modprobe -r cramfs', 'The file must be named /etc/modprobe.d/blacklist.conf to be read', 'The initramfs must be rebuilt before any modprobe.d file takes effect', 'blacklist works only for network drivers; filesystems are disabled with chattr +i on the module file'],
    answer: [0],
    explanation: 'A blacklist line makes modprobe ignore the module\'s aliases (such as the fs-cramfs alias the kernel requests when something mounts a cramfs image), but an explicit `modprobe cramfs` by module name still loads it. `install cramfs /bin/false` makes modprobe run /bin/false instead, so the load fails; then unload the module that is already in memory. Any file ending in .conf in /etc/modprobe.d is read. Rebuilding the initramfs matters only for modules loaded from it during early boot. blacklist applies to any module, and making the module file immutable would not stop a load.' },
  { topic: '3.3', type: 'single', difficulty: 2, lesson: L33C,
    stem: 'Refer to the exhibit. A DKMS-built kernel module fails to load after a kernel update. What is the correct fix that keeps Secure Boot enabled?',
    exhibit: `srv01# modprobe vboxdrv
modprobe: ERROR: could not insert 'vboxdrv': Key was rejected by service
srv01$ mokutil --sb-state
SecureBoot enabled`,
    options: ['Sign the module with a Machine Owner Key and enrol the key with mokutil --import, confirming it in MokManager at the next boot', 'Disable Secure Boot in the firmware setup', 'Add the module to /etc/modules-load.d so it loads before signature checking starts', 'Run setenforce 0, because SELinux blocks unsigned modules'],
    answer: [0],
    explanation: 'With Secure Boot enabled, the kernel accepts only modules signed by a trusted key, and "Key was rejected by service" means the module is unsigned or signed by an unknown key. Signing it with a MOK (DKMS can do this automatically once a key exists) and enrolling that key with mokutil keeps the chain of trust intact. Disabling Secure Boot works but removes the protection the question asks to keep. modules-load.d only changes when a module loads; the signature is still checked. SELinux does not perform module signature checks.' },

  // ---------- 3.4 ----------
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34,
    stem: 'Refer to the exhibit. On an Ubuntu 24.04 server, an administrator added a lockout line copied from an old hardening guide, and now all SSH password logins fail. What should replace it?',
    exhibit: `srv01# grep tally /etc/pam.d/common-auth
auth    required    pam_tally2.so deny=5 unlock_time=900 onerr=fail
srv01# journalctl -u ssh -n 2 --no-pager
Nov 22 09:20:14 srv01 sshd[1822]: PAM unable to dlopen(/usr/lib/x86_64-linux-gnu/security/pam_tally2.so): /usr/lib/x86_64-linux-gnu/security/pam_tally2.so: cannot open shared object file: No such file or directory
Nov 22 09:20:14 srv01 sshd[1822]: PAM adding faulty module: /usr/lib/x86_64-linux-gnu/security/pam_tally2.so`,
    options: ['pam_faillock: preauth and authfail lines in the auth stack, account required pam_faillock.so, with settings in /etc/security/faillock.conf', 'The same pam_tally2 line moved from the auth stack to the session stack', 'pam_pwquality.so deny=5 in the auth stack', 'pam_tally.so, the older module that pam_tally2 replaced'],
    answer: [0],
    explanation: 'pam_tally2 was removed from Linux-PAM in version 1.5.0, so the module file does not exist; a required module that cannot be loaded makes the whole auth stack fail. pam_faillock is the replacement, configured with preauth/authfail calls (and an account line) and /etc/security/faillock.conf. Moving the line to the session stack changes nothing about the missing file and would not count failures. pam_pwquality checks new passwords during changes; it does not lock accounts. pam_tally is even older and was removed as well.' },
  { topic: '3.4', type: 'fill', difficulty: 1, lesson: L34,
    stem: 'User bob is locked out by pam_faillock after too many failed logins. Enter the command that clears his failure records so he can log in again.',
    answer: ['faillock --user bob --reset', 'faillock --reset --user bob'],
    explanation: '`faillock --user bob` lists his failure records and `--reset` clears them. The legacy equivalent was `pam_tally2 --user bob --reset`, which no longer exists on current distributions.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34,
    stem: 'What does the line dcredit = -1 in /etc/security/pwquality.conf do?',
    options: ['Requires at least one digit in new passwords', 'Lowers the minimum length by one for each digit used', 'Forbids digits in new passwords', 'Allows one digit to be reused from the previous password'],
    answer: [0],
    explanation: 'For the dcredit, ucredit, lcredit and ocredit options, a negative value is a minimum count of that character class, so -1 means "at least one digit". A positive value instead gives credit toward minlen for each digit, up to that number; that is the second option\'s idea, but it needs a positive value. Nothing in pwquality forbids a class. Similarity to the old password is controlled by difok.' },
  { topic: '3.4', type: 'multi', difficulty: 1, lesson: L34,
    stem: 'Which two login methods are multifactor authentication? (Choose two.)',
    options: ['A password plus a TOTP code from an authenticator app on the user\'s phone', 'A smart card plus its PIN', 'A password plus the answer to a security question', 'Two different passwords entered one after the other', 'A user name plus a long passphrase'],
    answer: [0, 1],
    explanation: 'MFA combines different factor categories. Password plus TOTP is something you know plus something you have; smart card plus PIN is something you have plus something you know. A password and a security question are both things you know, as are two passwords. A user name is an identifier, not an authentication factor, so the last option is single-factor however long the passphrase is.' },
  { topic: '3.4', type: 'single', difficulty: 2, lesson: L34,
    stem: 'kiosk1 has /bin/rbash as its login shell. Which of these does rbash prevent?',
    options: ['cd /tmp', 'Running ls with the default PATH', 'Reading a file with cat notes.txt', 'Printing variables with echo $PATH'],
    answer: [0],
    explanation: 'Restricted bash forbids changing directories with cd, setting PATH, SHELL, ENV or BASH_ENV, running commands whose names contain a slash, output redirection and exec. Running commands found in PATH, reading files with those commands and printing variables are all still allowed, which is why rbash depends on a carefully limited PATH.' },

  // ---------- 3.5 ----------
  { topic: '3.5', type: 'single', difficulty: 2, lesson: L35,
    stem: 'Refer to the exhibit from a LUKS2 volume. What is the role of argon2id here?',
    exhibit: `srv01# cryptsetup luksDump /dev/vdb1 | sed -n '/^Keyslots/,/Threads/p'
Keyslots:
  0: luks2
	Key:        512 bits
	Priority:   normal
	Cipher:     aes-xts-plain64
	Cipher key: 512 bits
	PBKDF:      argon2id
	Time cost:  4
	Memory:     1048576
	Threads:    4`,
    options: ['It is the memory-hard key derivation function that turns the passphrase into the key protecting keyslot 0, making each guess expensive in memory and time', 'It is the cipher that encrypts the data sectors of the volume', 'It is the hash that checks each data sector for tampering', 'It shows that the volume uses the LUKS1 format, which stores one passphrase only'],
    answer: [0],
    explanation: 'LUKS2 derives a key from each passphrase with a PBKDF and uses it to decrypt that keyslot\'s copy of the master key; argon2id, the LUKS2 default, requires a configurable amount of memory (here about 1 GiB) per guess, defeating cheap GPU and ASIC cracking. The data itself is encrypted with aes-xts-plain64. Plain LUKS2 does not authenticate sectors (that needs dm-integrity). LUKS1 used PBKDF2, and both formats support multiple keyslots.' },
  { topic: '3.5', type: 'multi', difficulty: 1, lesson: L35,
    stem: 'A web server must disable deprecated TLS versions in line with RFC 8996. Which two protocol versions should remain enabled? (Choose two.)',
    options: ['TLS 1.2', 'TLS 1.3', 'TLS 1.1', 'TLS 1.0', 'SSL 3.0'],
    answer: [0, 1],
    explanation: 'RFC 8996 (2021) formally deprecates TLS 1.0 and TLS 1.1. TLS 1.3 is preferred and TLS 1.2 remains acceptable with modern AEAD cipher suites. SSL 3.0 was prohibited years earlier (RFC 7568) after POODLE.' },
  { topic: '3.5', type: 'single', difficulty: 2, lesson: L35,
    stem: 'Two services exchange messages over an untrusted queue and share a secret key. The receiver must detect tampering and be sure that the sender holds the key. What should the sender attach to each message?',
    options: ['An HMAC-SHA256 of the message computed with the shared key', 'A SHA-256 hash of the message', 'An MD5 hash of the message and the key concatenated', 'The message encrypted with AES, which also proves its integrity'],
    answer: [0],
    explanation: 'An HMAC mixes the secret key into the hash, so only key holders can produce a valid value and any change to the message is detected: integrity plus authenticity. A plain SHA-256 hash detects accidental change, but an attacker who alters the message can simply compute a new hash. MD5 is broken, and naive hash(key + message) constructions are vulnerable to length-extension attacks, which is why HMAC exists. Encryption alone (for example AES-CBC without a MAC) provides confidentiality, not integrity.' },
  { topic: '3.5', type: 'fill', difficulty: 2, lesson: L35,
    stem: 'On RHEL 9, an administrator copied the company\'s internal root CA certificate to /etc/pki/ca-trust/source/anchors/. Enter the command that rebuilds the system trust store so applications trust it.',
    answer: ['update-ca-trust', 'update-ca-trust extract'],
    explanation: '`update-ca-trust` (whose default action is `extract`) regenerates the consolidated bundles under /etc/pki/ca-trust/extracted/, which OpenSSL, GnuTLS, NSS and Java use. The Debian and Ubuntu equivalent is copying a .crt file into /usr/local/share/ca-certificates/ and running `update-ca-certificates`.' },
  { topic: '3.5', type: 'single', difficulty: 2, lesson: L35,
    stem: 'An internal web application at intranet.example.com uses a self-signed certificate, and users have learned to click through the browser warning. What is the best fix?',
    options: ['Issue the certificate from an internal CA and deploy that CA\'s root certificate to every client\'s trust store', 'Keep the self-signed certificate and tell users to add a permanent browser exception', 'Disable certificate verification in the clients so the warning disappears', 'Switch the site to plain HTTP because the network is internal'],
    answer: [0],
    explanation: 'An internal CA whose root is in every client\'s trust store lets clients validate the chain, so a warning once again means something is wrong. Per-user exceptions keep the habit of accepting unverified certificates, which is what a man-in-the-middle relies on. Disabling verification removes server authentication entirely. Plain HTTP removes encryption as well. (A public CA is the alternative when the name is publicly resolvable.)' },

  // ---------- 3.6 ----------
  { topic: '3.6', type: 'single', difficulty: 2, lesson: L36,
    stem: 'Refer to the exhibit. Which line most needs investigation as a possible compromise?',
    exhibit: `srv01# rpm -Va
S.5....T.  c /etc/ssh/sshd_config
.......T.  c /etc/chrony.conf
S.5....T.    /usr/bin/ss
.M.......    /var/lib/nfs/statd`,
    options: ['/usr/bin/ss: a non-configuration binary whose size, digest and mtime differ from the package', '/etc/ssh/sshd_config: its size and digest changed', '/etc/chrony.conf: only its modification time changed', '/var/lib/nfs/statd: its mode changed'],
    answer: [0],
    explanation: 'In rpm -V output, S means size, 5 the digest, T the mtime and M the mode, and `c` marks a configuration file. A changed digest on /usr/bin/ss, which is not a config file, means the binary differs from what was installed: exactly what a rootkit does to hide connections. sshd_config is a config file that administrators are expected to edit. A pure timestamp change on chrony.conf is harmless. A mode change on a state directory deserves a look but is far less alarming than a replaced system binary.' },
  { topic: '3.6', type: 'single', difficulty: 2, lesson: L36,
    stem: 'A vulnerability scanner reports CVE-2024-6387 on a RHEL 9 server because the SSH banner shows OpenSSH_8.7, while upstream fixed the bug in 9.8p1. The installed openssh-server package was built after the CVE was published. What should the administrator do next?',
    options: ['Check whether Red Hat backported the fix, for example with rpm -q --changelog openssh-server | grep CVE-2024-6387 or Red Hat\'s errata for the CVE', 'Build OpenSSH 9.8p1 from source and replace the packaged sshd', 'Mark the server as vulnerable until an OpenSSH package with version 9.8 or later is installed', 'Change the SSH banner so the scanner no longer reports the version'],
    answer: [0],
    explanation: 'Enterprise distributions backport security fixes into the version they ship, so the version string stays 8.7p1 while the vulnerability is fixed; the package changelog and the vendor\'s CVE page or errata confirm it, and the finding can then be documented as a false positive. Replacing the packaged sshd with a source build loses vendor updates and support. A version number below 9.8 does not prove the host is vulnerable: Red Hat fixed this CVE in its 8.7p1 builds in July 2024, more than a year before it rebased RHEL 9 to OpenSSH 9.9p1. Hiding the banner only fools the scanner without establishing whether the host is safe.' },
  { topic: '3.6', type: 'match', difficulty: 2, lesson: L36,
    stem: 'Match each data-destruction method to its description.',
    pairs: [['shred -v -n 3 -z -u secrets.txt', 'Overwrites a file three times, adds a zero pass and deletes it'], ['badblocks -w -s /dev/sdb', 'Destructive write-mode test that writes four patterns to every block'], ['dd if=/dev/urandom of=/dev/sdb bs=4M', 'One pass of random data over the whole device'], ['cryptsetup erase /dev/sdb1', 'Destroys every LUKS keyslot so the ciphertext can no longer be decrypted']],
    explanation: 'shred overwrites in place (default three passes, -z a final zero pass, -u remove), which is unreliable on copy-on-write or journaling filesystems and SSDs. badblocks -w is a disk test whose write mode writes 0xaa, 0x55, 0xff and 0x00 over every block, destroying the data. dd from /dev/urandom is a single random overwrite. cryptsetup erase wipes the keyslots, which is cryptographic destruction: fast, and effective on SSDs as long as the data was encrypted from the start.' },
  { topic: '3.6', type: 'single', difficulty: 1, lesson: L36,
    stem: 'Legal requires a warning banner that SSH users see before they authenticate. Which configuration meets the requirement?',
    options: ['Put the text in /etc/issue.net and set Banner /etc/issue.net in the sshd configuration', 'Put the text in /etc/motd', 'Put the text in /etc/issue', 'Put the text in /etc/profile.d/banner.sh'],
    answer: [0],
    explanation: 'sshd sends a pre-authentication banner only from the file named by its Banner keyword (none by default), and /etc/issue.net is the conventional file for network logins. /etc/motd is shown after a successful login. /etc/issue is displayed by agetty on local consoles before login; sshd does not read it unless Banner points to it. A profile.d script runs only after login, in login shells.' },
  { topic: '3.6', type: 'fill', difficulty: 1, lesson: L36,
    stem: 'An AIDE baseline database is installed in /var/lib/aide/. Enter the AIDE command that compares the current system against the baseline and reports differences.',
    answer: ['aide --check', 'aide -C'],
    explanation: '`aide --check` (short `-C`) reads the database and the configuration and reports added, removed and changed files. `aide --init` builds a new baseline (aide.db.new.gz, which you move into place) and `aide --update` checks and writes an updated database after approved changes.' },

  // ---------- Performance-based additions (review 2026-11-22) ----------
  { topic: '3.3', type: 'order', difficulty: 2, lesson: L33B,
    stem: 'On web01 (RHEL 9, SELinux enforcing), httpd\'s DocumentRoot was changed to the new directory /srv/web and every page now returns 403, although the file modes are 644. Put the steps to diagnose and permanently fix the problem in order.',
    items: ['Run ausearch -m AVC -ts recent and see httpd_t denied read on files labelled var_t', 'Run semanage fcontext -a -t httpd_sys_content_t "/srv/web(/.*)?" to add a file-context rule for the new path', 'Run restorecon -Rv /srv/web to apply the rule to the existing files', 'Run curl http://localhost/ and confirm the page is served'],
    explanation: 'First confirm that SELinux is the cause: the AVC record shows the httpd_t process denied read on var_t files (files under /srv get var_t from the default policy). `semanage fcontext -a` only records a rule in the policy store, so it must come before `restorecon`, which relabels the existing files according to the rules; running restorecon first would simply reapply var_t. Testing comes last. Because the label now comes from a policy rule, it also survives a full relabel, which a `chcon` fix would not.' },
  { topic: '3.2', type: 'order', difficulty: 2, lesson: L32A,
    stem: 'web01 runs firewalld, and HTTPS must be opened on the zone that eth0 belongs to, so that it survives reboots and works immediately. Put the commands in order.',
    items: ['firewall-cmd --get-active-zones, to see that eth0 is in the public zone', 'firewall-cmd --permanent --zone=public --add-service=https', 'firewall-cmd --reload', 'firewall-cmd --zone=public --list-services, to confirm https is in the runtime configuration'],
    explanation: 'You need the zone name before you can target it. `--permanent` writes only the saved configuration, so `--reload` is needed to make the saved configuration the running one (it keeps connection state). Listing without `--permanent` shows the runtime configuration, which is the proof that the rule is live. Reloading before the permanent change would change nothing, and checking before the reload would not show https.' },
  { topic: '3.3', type: 'match', difficulty: 2, lesson: L33A,
    stem: 'Match each symptom on srv01 to the command that confirms its cause.',
    pairs: [['root gets "Operation not permitted" writing a file whose mode is rw-r--r--', 'lsattr'], ['A named user\'s ACL entry shows rw-, but that user cannot write the file', 'getfacl'], ['httpd returns 403 for a page with mode 644 while SELinux is enforcing', 'ls -Z'], ['A PermitRootLogin line in sshd_config seems to be ignored', 'sshd -T'], ['A new rule in /etc/sudoers.d seems to have no effect for alice', 'sudo -l -U alice'], ['A daemon moved to a new port fails to bind under SELinux', 'semanage port -l']],
    explanation: '`lsattr` shows the immutable or append-only attribute that blocks even root. `getfacl` prints `#effective:` next to entries limited by the ACL mask. `ls -Z` shows the file\'s SELinux type (for example user_home_t instead of httpd_sys_content_t). `sshd -T` prints the effective configuration, revealing an earlier value (often from a drop-in) that wins because the first value read is used. `sudo -l -U alice`, run as root, lists the rules sudo actually loaded for alice, so a skipped drop-in (a name containing a dot) shows up as a missing rule. `semanage port -l` shows which port type each port has, so you can see whether the new port is labelled for the daemon.' },
  { topic: '3.2', type: 'match', difficulty: 2, lesson: L32B,
    stem: 'Match each situation on the Linux gateway gw01 to the command that answers it.',
    pairs: [['You are not sure whether iptables writes legacy x_tables or nftables rules', 'iptables -V'], ['You need to know which firewalld zone handles traffic arriving on eth1', 'firewall-cmd --get-active-zones'], ['LAN clients get no replies; you want to see whether their flows are tracked and translated', 'conntrack -L'], ['NAT rules exist, but the box does not route packets between interfaces', 'sysctl net.ipv4.ip_forward'], ['A ufw deny rule for one host appears to have no effect', 'ufw status numbered'], ['You need the handle of an nftables rule before deleting it', 'nft -a list ruleset']],
    explanation: '`iptables -V` prints `(nf_tables)` or `(legacy)`. `firewall-cmd --get-active-zones` lists each active zone with its interfaces and sources. `conntrack -L` (conntrack-tools) lists tracked connections, including the original and translated addresses. `sysctl net.ipv4.ip_forward` shows whether forwarding is 1; without it nothing is routed, whatever the NAT rules say. `ufw status numbered` shows rule positions, so you can see an earlier allow that matches first. `nft -a` adds `# handle N` to each rule, which `nft delete rule ... handle N` needs.' },
  { topic: '3.2', type: 'fill', difficulty: 2, lesson: L32B,
    stem: 'Refer to the exhibit. The temporary rule that opens TCP 8443 on srv01 must be removed from the running nftables ruleset without touching any other rule. Enter the nft command.',
    exhibit: `srv01# nft -a list ruleset
table inet filter {
\tchain input {
\t\ttype filter hook input priority filter; policy drop;
\t\tct state established,related accept # handle 4
\t\tiif "lo" accept # handle 5
\t\ttcp dport 22 accept # handle 6
\t\ttcp dport 8443 accept # handle 9
\t}
}`,
    answer: ['nft delete rule inet filter input handle 9'],
    explanation: 'nft deletes a single rule by family, table, chain and handle: `nft delete rule inet filter input handle 9`. The handle numbers come from `nft -a`; they are not positions, so handle 9 is not "the fourth rule". The change is runtime only; if the rule is also in /etc/nftables.conf (or /etc/sysconfig/nftables.conf on RHEL), remove it there too or it returns when the service reloads.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33A,
    stem: 'Refer to the exhibit. alice owns /srv/reports/q3.csv, and the auditors group must be able to write it. Enter the setfacl command that raises the ACL mask to rw without changing any other entry.',
    exhibit: `alice@srv01:~$ getfacl /srv/reports/q3.csv
getfacl: Removing leading '/' from absolute path names
# file: srv/reports/q3.csv
# owner: alice
# group: finance
user::rw-
group::r--
group:auditors:rw-\t#effective:r--
mask::r--
other::---`,
    answer: ['setfacl -m m::rw /srv/reports/q3.csv', 'setfacl -m mask::rw /srv/reports/q3.csv', 'setfacl -m m::rw- /srv/reports/q3.csv', 'setfacl -m mask::rw- /srv/reports/q3.csv', 'setfacl -m m:rw /srv/reports/q3.csv', 'setfacl -m mask:rw /srv/reports/q3.csv', 'setfacl -m m:rw- /srv/reports/q3.csv', 'setfacl -m mask:rw- /srv/reports/q3.csv'],
    explanation: 'The auditors entry already grants rw-, but the mask (r--) caps every named entry and the owning group, so getfacl shows `#effective:r--`. `setfacl -m m::rw` (long form `mask::rw`; setfacl also accepts a single colon) sets the mask explicitly and leaves the other entries alone. `chmod g+w` would also raise the mask on a file with an ACL, but the task asks for setfacl. The owner of a file may change its ACL, so alice does not need root.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33B,
    stem: 'Refer to the exhibit from web01 (RHEL 9). httpd must listen on TCP 8080. Enter the semanage command that assigns port 8080 to http_port_t.',
    exhibit: `web01# semanage port -a -t http_port_t -p tcp 8080
ValueError: Port tcp/8080 already defined
web01# semanage port -l | grep -w 8080
http_cache_port_t              tcp      8080, 8118, 8123, 10001-10010`,
    answer: ['semanage port -m -t http_port_t -p tcp 8080', 'semanage port -m -p tcp -t http_port_t 8080', 'semanage port --modify -t http_port_t -p tcp 8080', 'semanage port --modify --type http_port_t --proto tcp 8080'],
    explanation: '8080 is already defined in the policy as http_cache_port_t, so on RHEL 9 `semanage port -a` (add) refuses. `-m` (`--modify`) changes the type of an existing port definition. Newer policycoreutils (3.7 and later, RHEL 10 and current Fedora) print "already defined, modifying instead" and do this automatically, but `-m` is correct on both. A boolean such as httpd_can_network_connect would not help: it covers outbound connections, not binding a listening port.' },
  { topic: '3.3', type: 'fill', difficulty: 2, lesson: L33C,
    stem: 'Refer to the exhibit from srv01 (Ubuntu 24.04). Policy says X11 forwarding must be off, without editing the vendor sshd_config and without turning off other kinds of forwarding. Enter the single line to add to /etc/ssh/sshd_config.d/10-hardening.conf.',
    exhibit: `srv01# grep -E '^(Include|X11Forwarding)' /etc/ssh/sshd_config
Include /etc/ssh/sshd_config.d/*.conf
X11Forwarding yes
srv01# sshd -T | grep -i x11forwarding
x11forwarding yes`,
    answer: ['X11Forwarding no'],
    explanation: 'Debian and Ubuntu ship `X11Forwarding yes` in their sshd_config (the upstream default is no). The Include line comes first, and for most keywords sshd uses the first value it reads, so `X11Forwarding no` in a drop-in wins over the later line in the main file; check with `sshd -T` and reload ssh. `DisableForwarding yes` would also stop X11 forwarding, but it disables agent and TCP forwarding too, which the stem rules out.' },
  { topic: '3.4', type: 'fill', difficulty: 2, lesson: L34,
    stem: 'Refer to the exhibit. Security policy on srv01 now says that an account locked by pam_faillock must stay locked until an administrator runs faillock --reset. Enter the replacement unlock_time line.',
    exhibit: `srv01# grep -Ev '^(#|$)' /etc/security/faillock.conf
deny = 5
fail_interval = 900
unlock_time = 600`,
    answer: ['unlock_time = 0', 'unlock_time=0', 'unlock_time = never', 'unlock_time=never'],
    explanation: 'faillock.conf(5): unlock_time is the number of seconds after which a locked account is re-enabled (default 600), and "the value 0 has the same meaning as value never": access is not re-enabled until the records are reset with `faillock --user <name> --reset`. deny and fail_interval control how many failures, within what window, cause the lock.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31B,
    stem: 'Refer to the exhibit. The rule file on srv01 is in place, but the kernel has no audit rules loaded. Enter the command that merges the files in /etc/audit/rules.d/ into /etc/audit/audit.rules and loads the result now.',
    exhibit: `srv01# cat /etc/audit/rules.d/50-local.rules
-w /etc/ssh/sshd_config -p wa -k sshd_cfg
srv01# auditctl -l
No rules`,
    answer: ['augenrules --load', '/sbin/augenrules --load', '/usr/sbin/augenrules --load'],
    explanation: '`augenrules` concatenates the *.rules files in /etc/audit/rules.d/ into /etc/audit/audit.rules, and `--load` then loads the rules into the kernel. The same step runs at boot, which is what makes the rules persistent. `auditctl -w ...` would load only this one rule, at runtime, and `auditctl -R /etc/audit/audit.rules` loads the merged file without rebuilding it from rules.d.' },
  { topic: '3.1', type: 'fill', difficulty: 2, lesson: L31B,
    stem: 'Refer to the exhibit. On srv01, journalctl -b -1 never finds the previous boot. Enter the Storage= line that keeps the journal on disk across reboots without anyone creating a directory by hand.',
    exhibit: `srv01# cat /etc/systemd/journald.conf.d/50-local.conf
[Journal]
Storage=volatile
SystemMaxUse=500M`,
    answer: ['Storage=persistent', 'Storage = persistent'],
    explanation: '`volatile` keeps the journal only in /run/log/journal, which is lost at shutdown. `persistent` stores it under /var/log/journal and creates that directory if needed. `auto` would be persistent only if /var/log/journal already existed, which the stem excludes. Restart systemd-journald (or reboot) after the change; `journalctl --list-boots` then starts accumulating boots.' },
  { topic: '3.5', type: 'fill', difficulty: 3, lesson: L35,
    stem: 'Refer to the exhibit. /dev/vdb1 on srv01 was converted from LUKS1 with cryptsetup convert --type luks2, and its keyslot still uses PBKDF2. Enter the cryptsetup command that converts the keyslot to Argon2id.',
    exhibit: `srv01# cryptsetup luksDump /dev/vdb1 | sed -n '/^Keyslots/,/Iterations/p'
Keyslots:
  0: luks2
\tKey:        512 bits
\tPriority:   normal
\tCipher:     aes-xts-plain64
\tCipher key: 512 bits
\tPBKDF:      pbkdf2
\tHash:       sha256
\tIterations: 1771244`,
    answer: ['cryptsetup luksConvertKey --pbkdf argon2id /dev/vdb1', 'cryptsetup luksConvertKey /dev/vdb1 --pbkdf argon2id', 'cryptsetup luksConvertKey --pbkdf=argon2id /dev/vdb1', 'cryptsetup luksConvertKey /dev/vdb1 --pbkdf=argon2id', 'cryptsetup luksConvertKey --key-slot 0 --pbkdf argon2id /dev/vdb1', 'cryptsetup luksConvertKey -S 0 --pbkdf argon2id /dev/vdb1', 'cryptsetup luksConvertKey /dev/vdb1'],
    explanation: '`luksConvertKey` re-protects an existing LUKS2 keyslot with new PBKDF parameters after asking for that keyslot\'s passphrase; `--pbkdf argon2id` selects Argon2id. Without any --pbkdf option it applies the LUKS2 defaults, which are Argon2id in standard cryptsetup builds, so the bare form also works. The data and the volume key are untouched. Back up the header first (`luksHeaderBackup`): if a keyslot is overwritten in place and the write fails, the container can become inaccessible.' },
  { topic: '3.6', type: 'fill', difficulty: 1, lesson: L36,
    stem: 'Refer to the exhibit. On srv01 (RHEL 9), verifying coreutils shows that /usr/bin/ls has been replaced. Enter the rpm command that verifies every installed package, so you can look for other altered files.',
    exhibit: `srv01# rpm -V coreutils
S.5....T.    /usr/bin/ls`,
    answer: ['rpm -Va', 'rpm -aV', 'rpm -V -a', 'rpm -a -V', 'rpm --verify --all', 'rpm --verify -a', 'rpm -V --all'],
    explanation: '`rpm -V` with `-a` (`--all`) checks every file of every installed package against the size, digest, mode, owner, group and mtime recorded in the RPM database. A changed size and digest on a non-configuration binary like /usr/bin/ls is a strong sign of compromise. Because an attacker with root can also alter the RPM database or the rpm binary, repeat the check from trusted boot media before trusting a clean result.' },
  { topic: '3.5', type: 'order', difficulty: 1, lesson: L35,
    stem: 'A new disk partition /dev/vdb1 on srv01 must hold an encrypted XFS filesystem mounted at /srv/data. Put the commands in order.',
    items: ['cryptsetup luksFormat --type luks2 /dev/vdb1', 'cryptsetup open /dev/vdb1 data', 'mkfs.xfs /dev/mapper/data', 'mount /dev/mapper/data /srv/data'],
    explanation: 'luksFormat writes the LUKS2 header and keyslot (destroying existing data). `cryptsetup open` unlocks it and creates the plaintext mapping /dev/mapper/data. The filesystem goes on the mapping, never on /dev/vdb1 itself (that would overwrite the LUKS header), and it can only be mounted after it exists. For unlocking at boot, add the device to /etc/crypttab and the mapping to /etc/fstab.' },
  { topic: '3.6', type: 'order', difficulty: 2, lesson: L36,
    stem: 'An administrator sets up AIDE on a freshly installed RHEL 9 server, srv01, and later handles an approved change. Put the steps in order.',
    items: ['Run aide --init to build /var/lib/aide/aide.db.new.gz', 'Move aide.db.new.gz to aide.db.gz so it becomes the baseline', 'After the change window, run aide --check and review the reported differences', 'Run aide --update to write a new database that includes the approved changes', 'Replace aide.db.gz with the newly written database'],
    explanation: '`aide --init` writes a new database but does not use it; moving it to the configured input database (aide.db.gz on RHEL) makes it the baseline, ideally on a known-clean system with a copy kept off the host. `aide --check` compares the system to that baseline. Once the reported changes are confirmed as approved, `aide --update` checks again and writes a new output database (the input and output databases must differ), which you then move into place as the next baseline.' },
  { topic: '3.3', type: 'order', difficulty: 3, lesson: L33B,
    stem: 'On app01 (SELinux enforcing), a third-party daemon is denied an access that no label, port type or boolean covers. Put the steps for adding a local policy module in order.',
    items: ['Find the denial with ausearch -m AVC -ts recent', 'Run audit2allow -w -a and confirm it reports "Missing type enforcement (TE) allow rule" rather than a boolean', 'Run audit2allow -a -M mylocal to generate mylocal.te and mylocal.pp', 'Read mylocal.te and check that it allows only the access that was denied', 'Load the module with semodule -i mylocal.pp'],
    explanation: 'Start from the AVC record. `audit2allow -w` (audit2why) explains each denial; if it names a boolean, or the fix is a label or port type, use that instead of new policy. Only for a genuine gap does `audit2allow -M` generate a module, and the .te file must be read before loading, because audit2allow allows everything that was denied, which can include accesses an attacker caused. `semodule -i` installs the reviewed .pp module persistently.' },
];

export default bank.map((item, i) => ({ id: `d3-${String(i + 1).padStart(3, '0')}`, ...item }));
