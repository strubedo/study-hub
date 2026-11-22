// Domain 1 — System Management. Original questions; commands and output formats checked against man pages (util-linux, LVM2, iproute2, NetworkManager, netplan, rsync, tar, qemu-img, libvirt).
const L11A = '1.1-boot-process';
const L11B = '1.1-fhs-architectures-distros-gui-licensing';
const L12 = '1.2-kernel-modules-devices-initrd';
const L13A = '1.3-partitions-filesystems-lvm';
const L13B = '1.3-mounting-raid-network-utilities';
const L14 = '1.4-network-configuration-tools';
const L15A = '1.5-shell-environment-redirection';
const L15B = '1.5-text-utilities-editors';
const L16 = '1.6-backup-restore';
const L17 = '1.7-virtualization';

const bank = [
  // ---------- 1.1 ----------
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11A,
    stem: 'On an Ubuntu 24.04 server, which file is the generated GRUB configuration that you should not edit by hand?',
    options: ['/boot/grub/grub.cfg', '/etc/default/grub', '/boot/grub2/grub.cfg', '/etc/grub.d/10_linux'],
    answer: [0],
    explanation: 'Debian-family systems write the generated menu to /boot/grub/grub.cfg; it is overwritten by update-grub and kernel updates. /etc/default/grub and the scripts in /etc/grub.d/ (such as 10_linux) are the inputs you are meant to edit. /boot/grub2/grub.cfg is the RPM-family (RHEL, Fedora) location.' },
  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11A,
    stem: 'Enter the one-word command that regenerates /boot/grub/grub.cfg on Debian and Ubuntu (it wraps grub-mkconfig).',
    answer: ['update-grub', 'sudo update-grub'],
    explanation: 'update-grub is the Debian-family wrapper for grub-mkconfig -o /boot/grub/grub.cfg. The RPM-family equivalent is grub2-mkconfig -o /boot/grub2/grub.cfg.' },
  { topic: '1.1', type: 'order', difficulty: 1, lesson: L11A,
    stem: 'Put these stages of a normal Linux boot in the order in which they happen (first stage at the top).',
    items: ['Firmware (UEFI or BIOS) runs its self-test and finds the boot target', 'The bootloader (GRUB) loads and shows its menu', 'The kernel and initramfs are loaded with the kernel parameters', 'The initramfs loads storage drivers and mounts the real root filesystem', 'systemd starts as PID 1 and reaches the default target'],
    explanation: 'Firmware finds the bootloader, the bootloader loads the kernel plus initramfs, the initramfs locates and mounts the real root, and the kernel then starts systemd as PID 1.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11A,
    stem: 'Refer to the exhibit. An administrator on Ubuntu 24.04 added console=ttyS0 to /etc/default/grub and rebooted, but the parameter is missing from the running kernel. What is the most likely reason?',
    exhibit: `srv01$ grep ^GRUB_CMDLINE_LINUX /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX="console=ttyS0"

srv01$ cat /proc/cmdline
BOOT_IMAGE=/boot/vmlinuz-6.8.0-45-generic root=UUID=3f1e9b52-0a4c-4f3e-9d2b-6c1d1e5b7a10 ro quiet splash`,
    options: ['update-grub was not run, so /boot/grub/grub.cfg still has the old command line', 'The initramfs must be rebuilt with update-initramfs before kernel parameters change', 'GRUB_CMDLINE_LINUX only applies to recovery-mode menu entries', '/proc/cmdline is cached and refreshed only by a reload of systemd'],
    answer: [0],
    explanation: 'GRUB reads the generated /boot/grub/grub.cfg, not /etc/default/grub, so the edit has no effect until update-grub regenerates it. Kernel parameters are not stored in the initramfs, so rebuilding it is irrelevant. GRUB_CMDLINE_LINUX applies to every entry (it is GRUB_CMDLINE_LINUX_DEFAULT that skips recovery entries). /proc/cmdline is not cached; it shows what the kernel was actually given.' },
  { topic: '1.1', type: 'multi', difficulty: 1, lesson: L11A,
    stem: 'A BIOS client with no local disk boots over the network with PXE. Which two protocols does it use to obtain its IP configuration and then download the bootloader? (Choose two.)',
    options: ['DHCP', 'TFTP', 'NFS', 'LDAP', 'SNMP'],
    answer: [0, 1],
    explanation: 'DHCP supplies the address, the next-server TFTP address (siaddr field, or a server name in option 66) and the boot file name (file field or option 67); TFTP (UDP 69) then delivers the bootloader. NFS may be used later for a network root but is not how the bootloader is fetched, LDAP is a directory protocol, and SNMP is for monitoring.' },
  { topic: '1.1', type: 'match', difficulty: 1, lesson: L11B,
    stem: 'Match each directory to what it normally holds.',
    pairs: [['/etc', 'Host-specific configuration files'], ['/var/log', 'Log files that grow over time'], ['/dev', 'Device files such as /dev/null'], ['/proc', 'Virtual view of processes and kernel state'], ['/boot', 'Kernel, initramfs and bootloader files']],
    explanation: '/etc holds configuration, /var holds variable data such as logs, /dev holds device nodes, /proc is a virtual (not on-disk) filesystem exposing process and kernel information, and /boot holds the kernel images, initramfs and GRUB files.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'Refer to the exhibit. Why does the binary fail to run on this server?',
    exhibit: `srv01$ ./backup-agent
bash: ./backup-agent: cannot execute binary file: Exec format error
srv01$ file backup-agent
backup-agent: ELF 64-bit LSB executable, ARM aarch64, version 1 (SYSV), statically linked
srv01$ uname -m
x86_64`,
    options: ['The binary was built for AArch64 but the server is x86_64', 'The file does not have the execute permission bit', 'The server is missing the 32-bit compatibility libraries', 'The binary is a script with a bad interpreter line'],
    answer: [0],
    explanation: '"Exec format error" together with file reporting ARM aarch64 on an x86_64 host means a CPU architecture mismatch. A missing execute bit gives "Permission denied", missing libraries are reported by the dynamic loader (and this binary is statically linked), and a bad interpreter produces "bad interpreter: No such file or directory", not a format error.' },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L11B,
    stem: 'A company modifies a GPL-licensed library and ships the compiled product to customers. What does the licence require?',
    options: ['The modified source must be made available to the customers under the GPL', 'Nothing, because open-source software may be used freely in closed products', 'A royalty must be paid to the original authors', 'Only the original unmodified source must be offered'],
    answer: [0],
    explanation: 'The GPL is a copyleft licence: when you distribute a work based on GPL code, you must offer the corresponding source of that work under the same licence. Permissive licences (MIT, BSD) would allow closed products, but the GPL does not. It charges no royalty, and the obligation covers the modified work, not just the original.' },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L11B,
    stem: 'In an X11 desktop, which component draws window borders and lets the user move and resize windows, as a program separate from the X server?',
    options: ['The window manager', 'The display manager', 'The kernel framebuffer', 'systemd-logind'],
    answer: [0],
    explanation: 'The window manager decorates, moves and stacks windows. The display manager (GDM, SDDM, LightDM) is the graphical login screen that starts the session. The kernel framebuffer is a low-level video interface, and systemd-logind tracks login sessions and seats.' },

  { topic: '1.1', type: 'fill', difficulty: 1, lesson: L11A,
    stem: 'Enter the full path of the file that shows the kernel parameters the running kernel was booted with.',
    answer: ['/proc/cmdline'],
    explanation: '/proc/cmdline holds the command line the running kernel received from the bootloader. It reflects the current boot, not what is configured for the next one.' },

  // ---------- 1.2 ----------
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L12,
    stem: 'Which command loads a kernel module together with all the modules it depends on?',
    options: ['modprobe', 'insmod', 'depmod', 'modinfo'],
    answer: [0],
    explanation: 'modprobe consults the dependency database and loads dependencies first. insmod loads exactly one .ko file and does no dependency resolution. depmod builds the dependency database but loads nothing. modinfo only prints information about a module.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. What should the administrator do to load the foo module?',
    exhibit: `srv01# insmod /lib/modules/6.8.0-45-generic/kernel/drivers/net/foo/foo.ko
insmod: ERROR: could not insert module /lib/modules/6.8.0-45-generic/kernel/drivers/net/foo/foo.ko: Unknown symbol in module
srv01# modinfo foo | grep -E '^(filename|depends)'
filename:       /lib/modules/6.8.0-45-generic/kernel/drivers/net/foo/foo.ko
depends:        bar`,
    options: ['Run modprobe foo, which loads bar first', 'Run depmod -a and repeat the same insmod command', 'Run rmmod bar and repeat the insmod command', 'Rebuild the initramfs with dracut --force'],
    answer: [0],
    explanation: 'foo depends on bar and insmod does not resolve dependencies, hence the unknown symbol error. modprobe foo loads bar first. depmod -a only rebuilds the dependency database; insmod would still ignore it. rmmod bar removes the module that foo needs, and the initramfs has no bearing on loading a module by hand.' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12,
    stem: 'Enter the directory that holds the .conf files in which module options and blacklist entries are placed (for example blacklist.conf).',
    answer: ['/etc/modprobe.d', '/etc/modprobe.d/'],
    explanation: 'modprobe reads /etc/modprobe.d/*.conf for options, blacklist, install and alias lines. Modules to load at boot are listed separately in /etc/modules-load.d/.' },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L12,
    stem: 'A RHEL server has just had its root disk moved to a VirtIO controller and cannot find root at boot. Which command rebuilds the initramfs for the running kernel with the VirtIO block driver included?',
    options: ['dracut --force --add-drivers virtio_blk', 'update-initramfs -u', 'mkinitrd /boot/initrd.img virtio_blk', 'depmod -a virtio_blk'],
    answer: [0],
    explanation: 'dracut is the RPM-family initramfs builder; --force overwrites the existing image and --add-drivers includes the extra module. update-initramfs is the Debian-family tool. mkinitrd is the deprecated predecessor of dracut. depmod only updates the module dependency map and does not touch the initramfs.' },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L12,
    stem: 'Which two commands show which kernel driver a PCI network adapter is using? (Choose two.)',
    options: ['lspci -k', 'lshw -class network', 'lsusb', 'dmidecode -t memory', 'lsmem'],
    answer: [0, 1],
    explanation: 'lspci -k prints "Kernel driver in use" for each PCI device and lshw -class network shows the driver in its configuration line. lsusb lists only USB devices, dmidecode -t memory shows SMBIOS memory slot data, and lsmem reports memory blocks.' },
  { topic: '1.2', type: 'match', difficulty: 1, lesson: L12,
    stem: 'Match each tool to what it reports.',
    pairs: [['dmidecode', 'SMBIOS data such as model and serial number'], ['ipmitool', 'BMC sensors, power state and event log'], ['sensors', 'Temperatures and fan speeds from lm_sensors'], ['dmesg', 'The kernel ring buffer'], ['lsmem', 'Memory ranges and block online state']],
    explanation: 'dmidecode decodes the SMBIOS/DMI tables, ipmitool talks to the baseboard management controller, sensors reads hardware monitoring chips, dmesg prints kernel messages, and lsmem lists memory blocks.' },

  // ---------- 1.3 ----------
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. Which single command grows the logical volume by 5 GiB and also grows the mounted xfs filesystem?',
    exhibit: `srv01# vgs vg_data
  VG      #PV #LV #SN Attr   VSize   VFree
  vg_data   1   2   0 wz--n- <50.00g 10.00g
srv01# lvs vg_data
  LV     VG      Attr       LSize  Pool Origin Data%  Meta%  Move Log Cpy%Sync Convert
  lv_db  vg_data -wi-ao---- 25.00g
  lv_web vg_data -wi-ao---- 15.00g
srv01# df -hT /var/www
Filesystem                 Type Size Used Avail Use% Mounted on
/dev/mapper/vg_data-lv_web xfs   15G  14G  1.0G  94% /var/www`,
    options: ['lvextend -r -L +5G /dev/vg_data/lv_web', 'lvextend -L 5G /dev/vg_data/lv_web', 'lvresize -r -L -5G /dev/vg_data/lv_web', 'xfs_growfs /var/www'],
    answer: [0],
    explanation: 'The volume group has 10 GiB free, and -L +5G adds 5 GiB while -r (--resizefs) grows the xfs filesystem in the same step. -L 5G sets the absolute size to 5 GiB, which is smaller than the current 15 GiB, and does not grow the filesystem. lvresize with -5G tries to shrink, which xfs cannot do. xfs_growfs alone does nothing useful because the logical volume itself is still 15 GiB.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13A,
    stem: 'Put these steps in the order you would perform them to create a new mounted LVM volume from an unused partition /dev/vdb1.',
    items: ['pvcreate /dev/vdb1', 'vgcreate vg_data /dev/vdb1', 'lvcreate -n lv_web -L 15G vg_data', 'mkfs.xfs /dev/vg_data/lv_web', 'mount /dev/vg_data/lv_web /var/www'],
    explanation: 'The layers are built from the bottom up: initialise the physical volume, create the volume group from it, carve out a logical volume, put a filesystem on the logical volume, and finally mount it.' },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13A,
    stem: 'An xfs filesystem is mounted at /data on a logical volume that was just extended. Enter the command that grows the filesystem to fill the volume.',
    answer: ['xfs_growfs /data', 'xfs_growfs -d /data'],
    explanation: 'xfs_growfs takes the mount point of a mounted xfs filesystem (recent xfsprogs also accept its device) and grows it to the size of the underlying device. resize2fs is the ext2/3/4 tool and takes a device.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit. Users get "No space left on device" when creating files in /var. What is the cause?',
    exhibit: `srv01$ touch /var/spool/app/job1
touch: cannot touch '/var/spool/app/job1': No space left on device
srv01$ df -h /var
Filesystem                  Size  Used Avail Use% Mounted on
/dev/mapper/vg_data-lv_var  9.8G  1.2G  8.1G  13% /var
srv01$ df -i /var
Filesystem                  Inodes  IUsed IFree IUse% Mounted on
/dev/mapper/vg_data-lv_var  655360 655360     0  100% /var`,
    options: ['The filesystem has run out of inodes', 'The logical volume is full and must be extended', 'The filesystem has been remounted read-only', 'A disk quota is blocking the user'],
    answer: [0],
    explanation: 'df -h shows plenty of free blocks, but df -i shows 100% of inodes used with none free, so no new file can be created. The volume is not full of data, so extending it is the wrong fix: growing ext4 adds inodes only in proportion to the added space, and the real fix is deleting the small files (or recreating the filesystem with more inodes). A read-only remount would give "Read-only file system", and a quota would give "Disk quota exceeded".' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit. Which statement about the array is correct?',
    exhibit: `srv01$ cat /proc/mdstat
Personalities : [raid1]
md0 : active raid1 vdb1[0] vdc1[1](F)
      10476544 blocks super 1.2 [2/1] [U_]

unused devices: <none>`,
    options: ['The array is degraded because vdc1 has failed', 'The array is degraded because vdb1 has failed', 'The array is healthy and mirroring both disks', 'The array is rebuilding onto a spare'],
    answer: [0],
    explanation: 'The (F) flag marks vdc1 as failed, and [2/1] [U_] means two members are expected but only one is working. vdb1 has no failure flag and is the surviving member. A healthy RAID 1 would show [2/2] [UU], and a rebuild would show a recovery progress line.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13B,
    stem: 'Enter the full path of the file that shows the live status of Linux software RAID arrays.',
    answer: ['/proc/mdstat'],
    explanation: '/proc/mdstat is the kernel view of md arrays, their members and any resync or recovery progress. mdadm --detail /dev/md0 gives a fuller report for one array.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Which /etc/fstab option lets the system continue booting normally if the device is absent, while still mounting it when it is present?',
    options: ['nofail', 'noauto', 'noatime', 'remount'],
    answer: [0],
    explanation: 'nofail suppresses the error and does not block boot if the device is missing. noauto means the filesystem is never mounted automatically at boot or by mount -a. noatime only stops access-time updates, and remount changes options of an already mounted filesystem.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit. When nfs01 is down, srv01 hangs at boot waiting for /mnt/data. Which change to the options field makes the mount wait for the network and stop blocking boot?',
    exhibit: `# /etc/fstab on srv01
UUID=5b0a1c2e-7d4f-4a6b-9e10-2f3a4b5c6d7e  /var/www   xfs  defaults                 0 0
nfs01.example.com:/export/data             /mnt/data  nfs  defaults                 0 0`,
    options: ['Change defaults to defaults,_netdev,nofail', 'Change defaults to defaults,noexec,nosuid', 'Change defaults to defaults,noauto,ro', 'Change defaults to defaults,sync,dirsync'],
    answer: [0],
    explanation: '_netdev marks the entry as needing the network, so it is mounted after networking is up, and nofail lets boot continue if the server is unreachable. noexec,nosuid are hardening options that do nothing for a hang. noauto,ro would stop the share ever being mounted automatically and would make it read-only. sync,dirsync force synchronous writes, which does not address boot ordering.' },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L13B,
    stem: 'Which three mount options are commonly applied to /tmp to harden it? (Choose three.)',
    options: ['noexec', 'nosuid', 'nodev', 'noatime', 'nofail', 'relatime'],
    answer: [0, 1, 2],
    explanation: 'noexec blocks running binaries from the filesystem, nosuid ignores setuid and setgid bits, and nodev ignores device files; together they limit what an attacker can do from a world-writable directory. noatime and relatime are access-time performance options, and nofail only affects boot behaviour when a device is missing.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13B,
    stem: 'An xfs filesystem on /dev/vdb1 will not mount after a power failure. The filesystem is unmounted. Which command is the correct tool to check and repair it?',
    options: ['xfs_repair /dev/vdb1', 'fsck.xfs /dev/vdb1', 'resize2fs /dev/vdb1', 'xfs_growfs /dev/vdb1'],
    answer: [0],
    explanation: 'xfs_repair is the xfs repair tool and must be run on an unmounted filesystem. fsck.xfs exists only to satisfy boot scripts and does nothing. resize2fs works on ext2/3/4, and xfs_growfs enlarges a mounted xfs filesystem but does not repair it.' },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L13A,
    stem: 'Match each command to its purpose.',
    pairs: [['pvmove', 'Move allocated extents off a physical volume'], ['vgexport', 'Prepare a volume group to be moved to another host'], ['pvresize', 'Tell LVM that a physical volume has grown'], ['growpart', 'Extend a partition into free disk space'], ['lvchange -an', 'Deactivate a logical volume']],
    explanation: 'pvmove migrates extents so a disk can be retired, vgexport marks an inactive volume group for transfer (vgimport follows on the new host), pvresize makes LVM see a larger PV after the partition grew, growpart extends a partition table entry, and lvchange -an deactivates a logical volume.' },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. The virtual disk was enlarged from 20 GiB to 40 GiB. There is no LVM. Which sequence gives the root filesystem the extra space?',
    exhibit: `srv01# lsblk -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS /dev/vda
NAME   SIZE TYPE FSTYPE MOUNTPOINTS
vda     40G disk
├─vda1   1G part vfat   /boot/efi
└─vda2  19G part xfs    /`,
    options: ['growpart /dev/vda 2, then xfs_growfs /', 'growpart /dev/vda 2, then resize2fs /dev/vda2', 'xfs_growfs / only', 'pvresize /dev/vda2, then lvextend -r -l +100%FREE /dev/vda2'],
    answer: [0],
    explanation: 'The partition must be grown first with growpart (disk and partition number as separate arguments), then the xfs filesystem is grown with xfs_growfs using the mount point. resize2fs is for ext filesystems. xfs_growfs alone cannot help while the partition is still 19 GiB. The pvresize/lvextend option does not apply because the exhibit shows no LVM2_member or logical volumes.' },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L13A,
    stem: 'Which of these filesystems cannot be shrunk at all, online or offline?',
    options: ['xfs', 'ext4', 'btrfs', 'tmpfs'],
    answer: [0],
    explanation: 'xfs can only be grown. ext4 can be shrunk while unmounted, btrfs can be shrunk online, and a tmpfs size limit can be lowered with a remount.' },

  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13B,
    stem: 'Enter the mount option that stops access-time updates on files and, as a side effect, also implies nodiratime.',
    answer: ['noatime'],
    explanation: 'noatime disables atime updates for all inode types, including directories, so nodiratime is implied. relatime is the default, which updates atime only when it is older than mtime or ctime (or a day old).' },

  // ---------- 1.4 ----------
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. Why does ping resolve web01 while dig returns nothing?',
    exhibit: `srv01$ ping -c 1 web01
PING web01 (192.0.2.30) 56(84) bytes of data.
64 bytes from web01.example.com (192.0.2.30): icmp_seq=1 ttl=64 time=0.412 ms
srv01$ dig +short web01
srv01$ grep ^hosts /etc/nsswitch.conf
hosts:      files dns
srv01$ grep web01 /etc/hosts
192.0.2.30   web01.example.com web01`,
    options: ['The name exists only in /etc/hosts, which ping uses via nsswitch.conf but dig ignores', 'nsswitch.conf lists dns before files, so the DNS answer is used by ping', 'dig caches negative answers for ping', 'The DNS server is refusing queries from ping'],
    answer: [0],
    explanation: 'ping goes through the resolver library, which follows nsswitch.conf (files first, so /etc/hosts answers). dig queries DNS servers directly and never reads /etc/hosts, so it returns nothing. The hosts line shows files before dns, not the reverse. dig has no cache shared with ping, and a refusing DNS server would not stop ping from using /etc/hosts.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'An administrator must change the gateway in a Netplan file on a remote Ubuntu server over SSH. Which command applies the change but reverts it automatically if the administrator cannot confirm?',
    options: ['netplan try', 'netplan apply', 'netplan generate', 'netplan status'],
    answer: [0],
    explanation: 'netplan try applies the configuration and rolls back after a timeout (120 seconds by default) unless Enter is pressed. netplan apply makes the change permanent immediately, so a wrong gateway can lock you out. netplan generate only writes backend files, and netplan status only displays state.' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14,
    stem: 'What is the default confirmation timeout, in seconds, of netplan try? Enter the number.',
    answer: ['120'],
    explanation: 'netplan try waits 120 seconds for confirmation by default and then reverts; the value can be changed with --timeout.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. Why does ens192 still show the old address?',
    exhibit: `srv01# nmcli connection modify lan0 ipv4.method manual ipv4.addresses 192.168.10.50/24
srv01# ip -br addr show ens192
ens192           UP             192.168.10.20/24`,
    options: ['The modified profile was never re-activated with nmcli connection up lan0', 'nmcli cannot set static addresses; Netplan must be used', 'The address is cached in /etc/hosts', 'A reboot is the only way to apply a changed profile'],
    answer: [0],
    explanation: 'nmcli connection modify edits the saved profile only; the running interface changes when the profile is re-activated with nmcli connection up lan0 (or nmcli device reapply ens192). nmcli does support static addresses. /etc/hosts does not hold interface addresses, and a reboot works but is not required.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. Which of these services cannot be reached from other hosts?',
    exhibit: `srv01# ss -tlnp
State  Recv-Q Send-Q Local Address:Port Peer Address:Port Process
LISTEN 0      128          0.0.0.0:22        0.0.0.0:*    users:(("sshd",pid=801,fd=3))
LISTEN 0      511          0.0.0.0:80        0.0.0.0:*    users:(("nginx",pid=1210,fd=6))
LISTEN 0      244        127.0.0.1:5432      0.0.0.0:*    users:(("postgres",pid=1315,fd=5))
LISTEN 0      128             [::]:22           [::]:*    users:(("sshd",pid=801,fd=4))`,
    options: ['postgres on port 5432', 'nginx on port 80', 'sshd on IPv4 port 22', 'sshd on IPv6 port 22'],
    answer: [0],
    explanation: 'PostgreSQL is bound to 127.0.0.1, so it accepts connections only from the local host. nginx and sshd on 0.0.0.0 listen on every IPv4 address, and [::] is the IPv6 wildcard, so sshd is reachable over IPv6 too (subject to any firewall).' },
  { topic: '1.4', type: 'multi', difficulty: 3, lesson: L14,
    stem: 'Which two commands help determine the path MTU towards 198.51.100.7? (Choose two.)',
    options: ['tracepath 198.51.100.7', 'ping -M do -s 1472 198.51.100.7', 'dig +trace 198.51.100.7', 'ss -tulnp', 'iperf3 -c 198.51.100.7'],
    answer: [0, 1],
    explanation: 'tracepath reports the path MTU hop by hop without root, and ping with -M do (do not fragment) and a 1472-byte payload tests whether a 1500-byte packet gets through (1472 + 28 bytes of headers). dig +trace follows DNS delegation, ss lists sockets, and iperf3 measures throughput.' },
  { topic: '1.4', type: 'match', difficulty: 1, lesson: L14,
    stem: 'Match each tool to its main use.',
    pairs: [['ethtool', 'Link speed, duplex and link-detected state of a NIC'], ['mtr', 'Continuous per-hop loss and latency report'], ['nmap', 'Port and host scanning'], ['tcpdump', 'Packet capture'], ['dig', 'DNS queries']],
    explanation: 'ethtool queries NIC settings, mtr combines traceroute and ping, nmap scans ports and hosts, tcpdump captures packets, and dig sends DNS queries directly to servers.' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14,
    stem: 'Enter the full iproute2 command that shows which route the kernel would use to reach 203.0.113.9.',
    answer: ['ip route get 203.0.113.9', 'ip r get 203.0.113.9', 'ip route get to 203.0.113.9'],
    explanation: 'ip route get asks the kernel to perform a routing lookup and prints the chosen gateway, device and source address, which is more precise than reading the whole table.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. After a reboot, the DNS server the administrator typed into /etc/resolv.conf is gone. What is the supported way to make the DNS change permanent?',
    exhibit: `srv01$ ls -l /etc/resolv.conf
-rw-r--r--. 1 root root 82 Nov 22 09:00 /etc/resolv.conf
srv01$ head -3 /etc/resolv.conf
# Generated by NetworkManager
search example.com
nameserver 192.168.10.2`,
    options: ['Set ipv4.dns on the connection with nmcli connection modify and re-activate it', 'Add the server to /etc/hosts', 'Add the server to the hosts line of /etc/nsswitch.conf', 'Reboot again so the file is regenerated from the edit'],
    answer: [0],
    explanation: 'The file is generated by NetworkManager from the connection profile, so the DNS servers belong in the profile (nmcli connection modify <name> ipv4.dns ... then connection up). /etc/hosts maps names, not DNS servers; nsswitch.conf sets lookup order, not server addresses; and a reboot simply regenerates the file from the unchanged profile.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'You want to test the HTTPS site web01.example.com on 192.0.2.10 before DNS is updated, while keeping the correct Host header and certificate name. Which command does this?',
    options: ['curl --resolve web01.example.com:443:192.0.2.10 https://web01.example.com/', 'curl -k https://web01.example.com/', 'curl -I https://192.0.2.10/', 'curl -L https://web01.example.com/'],
    answer: [0],
    explanation: '--resolve pins the name to the address for this one request, so the TLS server name and Host header are the real ones. -k only disables certificate checking and still uses DNS. Requesting the bare IP sends the wrong server name and Host header, and -L follows redirects without changing how the name resolves.' },
  { topic: '1.4', type: 'single', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. What is the most likely cause of the connectivity loss?',
    exhibit: `srv01$ ethtool ens192
Settings for ens192:
	Supported ports: [ TP ]
	Supported link modes:   1000baseT/Full
	Speed: Unknown!
	Duplex: Unknown! (255)
	Auto-negotiation: on
	Port: Twisted Pair
	Link detected: no`,
    options: ['No physical link: cable, switch port or peer is down', 'A wrong default gateway in the routing table', 'A DNS server that does not respond', 'An MTU mismatch with the switch'],
    answer: [0],
    explanation: '"Link detected: no" with unknown speed and duplex means the NIC sees no carrier, so the problem is physical or on the far end (cable, port, peer). A wrong gateway, a DNS failure or an MTU mismatch all require a working link and would not give this output.' },

  // ---------- 1.5 ----------
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15A,
    stem: 'Refer to the exhibit. Why does the error message appear on the screen while out.log is empty?',
    exhibit: `srv01$ ls /nonexistent 2>&1 > out.log
ls: cannot access '/nonexistent': No such file or directory
srv01$ cat out.log
srv01$`,
    options: ['stderr was pointed at the terminal before stdout was redirected to the file', 'The > operator never captures error messages', '2>&1 sends output to /dev/null', 'out.log must be created with touch first'],
    answer: [0],
    explanation: 'Redirections are processed left to right: 2>&1 duplicates stderr onto where stdout points at that moment (the terminal), and only then > out.log moves stdout to the file. Writing > out.log 2>&1 gives both streams in the file. > does capture stdout, 2>&1 does not discard anything, and the shell creates the file itself.' },
  { topic: '1.5', type: 'fill', difficulty: 1, lesson: L15A,
    stem: 'Enter the shell operator that appends standard output to a file instead of overwriting it.',
    answer: ['>>'],
    explanation: '>> opens the file in append mode, while > truncates it first.' },
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15A,
    stem: 'Refer to the exhibit. Which command appends the line to /etc/motd as intended?',
    exhibit: `alice@srv01:~$ sudo echo "Maintenance Sunday" >> /etc/motd
bash: /etc/motd: Permission denied`,
    options: ['echo "Maintenance Sunday" | sudo tee -a /etc/motd', 'sudo echo "Maintenance Sunday" > /etc/motd', 'echo "Maintenance Sunday" | sudo >> /etc/motd', 'sudo -E echo "Maintenance Sunday" >> /etc/motd'],
    answer: [0],
    explanation: 'The redirection is performed by alice\'s own shell before sudo runs, so only the process that opens the file needs privileges: tee -a, run through sudo, appends to the file. The other options still open /etc/motd in the unprivileged shell (and > would also truncate it); sudo does not preserve anything that fixes this, and -E only keeps the environment.' },
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15A,
    stem: 'Refer to the exhibit. alice defined an alias in ~/.bashrc, but it is missing after she logs in over SSH. What is the cause?',
    exhibit: `alice@srv01:~$ cat ~/.bash_profile
# ~/.bash_profile
export EDITOR=vim
alice@srv01:~$ grep alias ~/.bashrc
alias ll='ls -alF'
alice@srv01:~$ alias ll
bash: alias: ll: not found`,
    options: ['The login shell reads ~/.bash_profile, which does not source ~/.bashrc', 'Aliases cannot be defined in ~/.bashrc', 'SSH sessions never read any shell startup file', 'The export line in ~/.bash_profile cancels aliases'],
    answer: [0],
    explanation: 'An SSH login starts a login shell, which reads ~/.bash_profile (not ~/.bashrc by itself). Adding a line such as [ -f ~/.bashrc ] && . ~/.bashrc fixes it. Aliases do belong in ~/.bashrc, login shells do read startup files, and exporting a variable has no effect on aliases.' },
  { topic: '1.5', type: 'multi', difficulty: 1, lesson: L15A,
    stem: 'Which two commands print the current value of the PATH variable? (Choose two.)',
    options: ['echo $PATH', 'printenv PATH', 'echo PATH', 'show PATH', 'cat $PATH'],
    answer: [0, 1],
    explanation: 'echo $PATH expands the variable and printenv PATH prints its value from the environment. echo PATH prints the literal word PATH, show is not a shell command, and cat $PATH would try to read the directories as files.' },
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15B,
    stem: 'Refer to the exhibit. Why is every address listed with a count of 1, and how is it fixed?',
    exhibit: `srv01$ cut -d' ' -f1 access.log | uniq -c
      1 192.0.2.10
      1 198.51.100.7
      1 192.0.2.10
      1 203.0.113.5
      1 192.0.2.10
      1 198.51.100.7`,
    options: ['uniq only collapses adjacent duplicates; insert sort before uniq -c', 'cut removes the duplicates; use awk instead', 'uniq -c counts only the first field; add -f1', 'The log file needs to be compressed with gzip first'],
    answer: [0],
    explanation: 'uniq compares only neighbouring lines, so the repeated addresses are not adjacent and each counts once. Piping through sort first groups them, giving 3, 2 and 1. cut does not deduplicate, -f1 is not how uniq counts, and compression is unrelated.' },
  { topic: '1.5', type: 'single', difficulty: 2, lesson: L15B,
    stem: 'Which command prints the login names of all accounts in /etc/passwd whose UID is 1000 or higher?',
    options: ['awk -F: \'$3 >= 1000 {print $1}\' /etc/passwd', 'awk \'$3 >= 1000 {print $1}\' /etc/passwd', 'cut -d: -f3 /etc/passwd | sort -n', 'grep 1000 /etc/passwd'],
    answer: [0],
    explanation: '/etc/passwd fields are separated by colons, so -F: is needed; field 3 is the UID and field 1 the name. Without -F: awk splits on whitespace and field 3 is not the UID. cut prints UIDs only, and grep 1000 matches any line containing those digits anywhere.' },
  { topic: '1.5', type: 'fill', difficulty: 1, lesson: L15B,
    stem: 'Enter the sed option (short form) that edits a file in place.',
    answer: ['-i'],
    explanation: 'sed -i rewrites the file in place; -i.bak keeps a backup copy with that suffix. Without -i, sed writes the result to standard output and leaves the file unchanged.' },
  { topic: '1.5', type: 'order', difficulty: 1, lesson: L15B,
    stem: 'Put these steps in the order you would use to add a line of text to a file in vi and save it.',
    items: ['Open the file with vi (you start in normal mode)', 'Press i to enter insert mode', 'Type the new text', 'Press Esc to return to normal mode', 'Type :wq and press Enter'],
    explanation: 'vi starts in normal mode; i switches to insert mode for typing, Esc returns to normal mode, and :wq (command-line mode) writes the file and quits.' },
  { topic: '1.5', type: 'match', difficulty: 1, lesson: L15A,
    stem: 'Match each shell syntax element to its meaning.',
    pairs: [['2>&1', 'Send stderr to the same place as stdout'], ['<<<', 'Feed a single string to stdin (here string)'], ['<<', 'Feed following lines up to a delimiter to stdin (here document)'], ['>>', 'Append stdout to a file'], ['|', 'Connect stdout of one command to stdin of another']],
    explanation: '2>&1 duplicates file descriptor 2 onto descriptor 1, <<< is a here string, << introduces a here document ended by a delimiter word, >> appends, and | is a pipe.' },
  { topic: '1.5', type: 'single', difficulty: 3, lesson: L15B,
    stem: 'Which command removes every *.tmp file under /var/tmp even when file names contain spaces?',
    options: ['find /var/tmp -name \'*.tmp\' -print0 | xargs -0 rm', 'find /var/tmp -name \'*.tmp\' | xargs rm', 'find /var/tmp -name \'*.tmp\' -print | xargs -n 1 rm', 'rm $(find /var/tmp -name \'*.tmp\')'],
    answer: [0],
    explanation: 'Using NUL as the separator (-print0 with xargs -0) keeps each file name intact whatever characters it contains. The other three split names on whitespace, so "old report.tmp" would be passed to rm as two separate arguments.' },

  // ---------- 1.6 ----------
  { topic: '1.6', type: 'single', difficulty: 1, lesson: L16,
    stem: 'Which command creates an xz-compressed tar archive of /etc?',
    options: ['tar -cJf etc.tar.xz /etc', 'tar -czf etc.tar.xz /etc', 'tar -cjf etc.tar.xz /etc', 'tar -xJf etc.tar.xz /etc'],
    answer: [0],
    explanation: 'In GNU tar, -J selects xz, -z gzip and -j bzip2, so -cJf creates an xz archive. -czf and -cjf would create gzip and bzip2 data despite the .xz name, and -x extracts rather than creates.' },
  { topic: '1.6', type: 'single', difficulty: 2, lesson: L16,
    stem: 'Refer to the exhibit. The administrator wanted a.txt and sub to land directly in /backup, not inside /backup/data. What change fixes the command?',
    exhibit: `srv01# rsync -a /srv/data /backup/
srv01# ls /backup
data
srv01# ls /backup/data
a.txt  sub`,
    options: ['Add a trailing slash to the source: /srv/data/', 'Add a trailing slash to the destination only', 'Add the --delete option', 'Replace -a with -z'],
    answer: [0],
    explanation: 'A source path without a trailing slash copies the directory itself, creating /backup/data. With /srv/data/ rsync copies the directory contents straight into /backup/. The destination slash does not change this, --delete removes extraneous files, and -z only compresses in transit.' },
  { topic: '1.6', type: 'single', difficulty: 2, lesson: L16,
    stem: 'A failing disk has read errors, and you need to copy as much data as possible to a new disk, with the ability to resume and retry bad areas later. Which tool is designed for this?',
    options: ['ddrescue', 'dd if=/dev/sdb of=/dev/sdc bs=4M', 'rsync -a', 'tar -czf'],
    answer: [0],
    explanation: 'ddrescue copies the readable areas first, records bad areas in a mapfile and retries them later, and it can be stopped and resumed. Plain dd aborts or pads on read errors, and rsync and tar work at the file level through a filesystem that may itself be unreliable.' },
  { topic: '1.6', type: 'fill', difficulty: 1, lesson: L16,
    stem: 'Enter the one-word command that prints a gzip-compressed file without extracting it to disk.',
    answer: ['zcat'],
    explanation: 'zcat (equivalent to gzip -dc) decompresses to standard output. zgrep and zless search and page gzip files in the same way.' },
  { topic: '1.6', type: 'multi', difficulty: 2, lesson: L16,
    stem: 'Which two tools are archivers that preserve Unix ownership and permissions, making them suitable for system backups? (Choose two.)',
    options: ['tar', 'cpio', 'gzip', 'bzip2', 'unzip'],
    answer: [0, 1],
    explanation: 'tar and cpio store file metadata (owner, mode, timestamps, links) in the archive. gzip and bzip2 only compress a single data stream and do not bundle files, and unzip extracts zip archives, a format that does not reliably store Unix ownership.' },
  { topic: '1.6', type: 'single', difficulty: 2, lesson: L16,
    stem: 'Refer to the exhibit. The administrator meant to clone the system disk vda onto the new empty disk vdb, but ran dd if=/dev/vdb of=/dev/vda bs=4M. What is the result?',
    exhibit: `srv01# lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS
NAME   SIZE TYPE MOUNTPOINTS
vda     40G disk
└─vda1  40G part /
vdb     40G disk`,
    options: ['The running system disk is overwritten with the empty contents of vdb', 'vdb receives an exact copy of vda', 'dd refuses because vda is mounted', 'Only the partition table of vda is copied to vdb'],
    answer: [0],
    explanation: 'if= is the source and of= is the destination, so the empty disk was copied over the live system disk and the data is destroyed. dd does not check whether the target is mounted, and it copies whole devices byte for byte, not only the partition table.' },

  // ---------- 1.7 ----------
  { topic: '1.7', type: 'single', difficulty: 2, lesson: L17,
    stem: 'Refer to the exhibit. After qemu-img resize, the guest still has a 20 GiB root partition. What must be done next?',
    exhibit: `host$ qemu-img info web01.qcow2 | grep -E 'virtual size|disk size'
virtual size: 30 GiB (32212254720 bytes)
disk size: 3.4 GiB
guest$ lsblk /dev/vda
NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINTS
vda    252:0    0  30G  0 disk
└─vda1 252:1    0  20G  0 part /`,
    options: ['Grow the partition and the filesystem inside the guest', 'Run qemu-img convert to refresh the virtual size', 'Run virsh undefine and redefine the VM', 'Run virsh destroy to commit the new size'],
    answer: [0],
    explanation: 'qemu-img resize changed only the virtual disk; the guest sees a 30 GiB disk but its partition and filesystem are still 20 GiB, so they need growing (for example growpart then resize2fs or xfs_growfs). convert changes format, undefine removes the VM definition, and destroy is a forced power-off that does not commit anything.' },
  { topic: '1.7', type: 'single', difficulty: 2, lesson: L17,
    stem: 'A VM is hung and does not respond to virsh shutdown. You want to force it off but keep its definition and disks. Which command do you use?',
    options: ['virsh destroy web01', 'virsh undefine web01', 'virsh suspend web01', 'virsh autostart web01'],
    answer: [0],
    explanation: 'virsh destroy is a hard power-off, like pulling the plug; despite the name it does not delete the VM. undefine removes the definition, suspend pauses the guest in memory without stopping it, and autostart only controls whether the VM starts when the host boots.' },
  { topic: '1.7', type: 'single', difficulty: 2, lesson: L17,
    stem: 'Guests must be reachable from other machines on the physical LAN using their own IP addresses and MAC addresses. Which libvirt network type provides this?',
    options: ['Bridged', 'NAT (the default virbr0 network)', 'Isolated', 'Host-only'],
    answer: [0],
    explanation: 'A bridge joins the VM NIC directly to the physical LAN, so the guest is a normal peer there. NAT hides guests behind the host address and only supports outbound connections without forwarding. Isolated and host-only networks have no path to the outside LAN.' },
  { topic: '1.7', type: 'multi', difficulty: 2, lesson: L17,
    stem: 'Which two are required before a KVM guest can use hardware acceleration? (Choose two.)',
    options: ['A CPU with VT-x or AMD-V enabled in firmware', 'The kvm kernel module with kvm_intel or kvm_amd loaded', 'A dedicated swap partition for each guest', 'The virt-manager GUI installed', 'A Type 2 hypervisor such as VirtualBox'],
    answer: [0, 1],
    explanation: 'KVM needs the CPU virtualization extensions (vmx or svm) enabled, and the kvm and kvm_intel or kvm_amd modules loaded, which expose /dev/kvm. Swap is not required, virt-manager is just one management front end, and VirtualBox is a separate hypervisor, not a prerequisite.' },
  { topic: '1.7', type: 'fill', difficulty: 1, lesson: L17,
    stem: 'Enter the qemu-img subcommand (with the tool name) that shows an image\'s format, virtual size and actual disk size.',
    answer: ['qemu-img info'],
    explanation: 'qemu-img info prints the file format, virtual size, on-disk size and any backing file; qemu-img check verifies integrity, and qemu-img convert changes the format.' },

  // ---------- Performance-based additions (rule 7, review 2026-11-22) ----------
  { topic: '1.1', type: 'order', difficulty: 1, lesson: L11A,
    stem: 'srv01 (Ubuntu 24.04) must pass console=ttyS0,115200 to the kernel on every boot so that its serial console works. Put the steps in order.',
    items: ['Add console=ttyS0,115200 to GRUB_CMDLINE_LINUX in /etc/default/grub', 'Run update-grub to regenerate /boot/grub/grub.cfg', 'Reboot srv01', 'Run cat /proc/cmdline and confirm the parameter is there'],
    explanation: '/etc/default/grub is only an input: GRUB reads the generated /boot/grub/grub.cfg, so `update-grub` (a stub for `grub-mkconfig -o /boot/grub/grub.cfg`) must run after the edit and before the reboot, or the old command line boots again. The new parameter takes effect only at the next boot, and /proc/cmdline shows what the running kernel actually received, so the check comes last. GRUB_CMDLINE_LINUX applies to every menu entry, including recovery entries.' },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L12,
    stem: 'Refer to the exhibit. Policy on kiosk01 says the USB mass-storage driver must never load, even when someone runs modprobe for it by name. Enter the line to add to /etc/modprobe.d/usb-storage.conf so that every modprobe attempt for the module runs a command that fails instead of loading it.',
    exhibit: `kiosk01# cat /etc/modprobe.d/usb-storage.conf
blacklist usb-storage
kiosk01# modprobe usb-storage
kiosk01# lsmod | grep usb_storage
usb_storage            86016  0`,
    answer: ['install usb-storage /bin/false', 'install usb_storage /bin/false', 'install usb-storage /usr/bin/false', 'install usb_storage /usr/bin/false'],
    explanation: '`blacklist` only makes modprobe ignore the module\'s aliases (the automatic, hardware-triggered loads), so loading it by name still works, as the exhibit shows. `install <module> <command>` tells modprobe to run the command instead of inserting the module; with /bin/false every modprobe of it, by name, alias or as a dependency, fails. modprobe treats - and _ in module names as the same, so both spellings work, and on merged-/usr systems /bin/false and /usr/bin/false are the same file. `install ... /bin/true` would also stop the load but report success. Then unload the running copy with `modprobe -r usb-storage` and rebuild the initramfs if the module is in it. A manual `insmod` of the .ko file still bypasses modprobe.d.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13A,
    stem: 'On db01, /var/lib/db is an ext4 filesystem on /dev/vg_data/lv_db and is almost full. vg_data has no free extents, and a new 20 GiB virtual disk has just been attached. Put the steps in order to give all of the new space to lv_db while it stays mounted.',
    items: ['lsblk, to confirm that /dev/vdc is the new, empty 20 GiB disk', 'pvcreate /dev/vdc', 'vgextend vg_data /dev/vdc', 'lvextend -l +100%FREE /dev/vg_data/lv_db', 'resize2fs /dev/vg_data/lv_db', 'df -h /var/lib/db'],
    explanation: 'Confirm the device first, because pvcreate on the wrong disk destroys it. The PV must exist before it can join the VG (current vgextend would also initialise an unlabelled device itself), and the VG must have free extents before the LV can grow. `-l +100%FREE` hands over every free extent; `-L +20G` would fail, because LVM metadata leaves slightly less than 20 GiB usable. Growing the LV does not grow the filesystem: `resize2fs` on the device grows mounted ext4 online (or `lvextend -r` does both steps at once). df confirms the new size.' },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13A,
    stem: 'Refer to the exhibit. On app01 the logical volume was extended, but the filesystem still shows its old size. Enter the command that grows the mounted filesystem into the new space.',
    exhibit: `app01# lvextend -L +10G /dev/vg_data/lv_data
  Size of logical volume vg_data/lv_data changed from 20.00 GiB (5120 extents) to 30.00 GiB (7680 extents).
  Logical volume vg_data/lv_data successfully resized.
app01# df -hT /srv/data
Filesystem                  Type  Size  Used Avail Use% Mounted on
/dev/mapper/vg_data-lv_data xfs    20G   19G  1.3G  94% /srv/data`,
    answer: ['xfs_growfs /srv/data', 'xfs_growfs -d /srv/data', 'xfs_growfs /dev/mapper/vg_data-lv_data', 'xfs_growfs -d /dev/mapper/vg_data-lv_data', 'xfs_growfs /dev/vg_data/lv_data', 'xfs_growfs -d /dev/vg_data/lv_data'],
    explanation: 'lvextend without `-r` resizes only the block device. The filesystem is xfs, so `xfs_growfs` grows it, while mounted, to fill the device; it takes the mount point or, in current xfsprogs, the device of the mounted filesystem, and `-d` (grow the data section to the maximum) is the default behaviour. `resize2fs` is the ext2/3/4 tool and refuses xfs. Next time `lvextend -r -L +10G` does both steps in one command.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13B,
    stem: 'On web02, the new, empty logical volume /dev/vg_data/lv_logs must carry an xfs filesystem that is mounted at the existing directory /srv/logs at every boot, referenced by UUID. Put the steps in order.',
    items: ['mkfs.xfs /dev/vg_data/lv_logs', 'blkid /dev/vg_data/lv_logs, to read the filesystem UUID', 'Add a UUID=<uuid>  /srv/logs  xfs  defaults  0 0 line to /etc/fstab', 'mount -a, to mount every fstab entry that is not yet mounted', 'findmnt /srv/logs, to confirm the source, type and options'],
    explanation: 'The UUID belongs to the filesystem, so it exists only after mkfs, and blkid reads it from the new signature. The fstab line is what makes the mount persistent; `mount -a` then tests that line now, which catches a typo before a reboot can drop the system into emergency mode. findmnt shows the live result. On systemd hosts also run `systemctl daemon-reload` after editing fstab, so the mount units generated from it match the file. The pass field is 0 because fsck.xfs does nothing; xfs checks itself at mount time.' },
  { topic: '1.3', type: 'fill', difficulty: 1, lesson: L13B,
    stem: 'Refer to the exhibit. The last field of the /srv/data line on srv01 is missing. The ext4 filesystem must be checked by fsck at boot, after the root filesystem. Enter the value.',
    exhibit: `srv01# cat /etc/fstab
# device                                    mountpoint  type  options          dump pass
UUID=3f1e9b52-0a4c-4f3e-9d2b-6c1d1e5b7a10   /           ext4  defaults         0    1
UUID=9a7c2d41-5e6f-4b80-a1c2-3d4e5f607182   /boot/efi   vfat  umask=0077       0    2
UUID=c41d8e2a-7b3f-4e19-8a65-0f9e1d2c3b4a   /srv/data   ext4  defaults,nodev   0    ?`,
    answer: ['2'],
    explanation: 'The sixth field (fs_passno) orders boot-time checks: 1 is for the root filesystem only, 2 for every other filesystem that should be checked after it (filesystems on different disks are checked in parallel), and 0, the default when the field is missing, means never check. The fifth field (dump) is the old backup flag and is almost always 0.' },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L13B,
    stem: 'Refer to the exhibit. On fs01 (RHEL 9) a new RAID 1 array was just created with mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/vdb1 /dev/vdc1 and then formatted. Enter the mdadm command whose output, appended to /etc/mdadm.conf, records the array so that it is assembled under the same name at boot.',
    exhibit: `fs01# cat /proc/mdstat
Personalities : [raid1]
md0 : active raid1 vdc1[1] vdb1[0]
      10476544 blocks super 1.2 [2/2] [UU]
      [==>..................]  resync = 12.6% (1320448/10476544) finish=0.7min speed=201216K/sec

unused devices: <none>
fs01# mkfs.xfs -q /dev/md0
fs01# ________ >> /etc/mdadm.conf
fs01# dracut --force`,
    answer: ['mdadm --detail --scan', 'mdadm -D --scan', 'mdadm --detail -s', 'mdadm -D -s', 'mdadm -Ds', 'mdadm --scan --detail', 'mdadm --examine --scan', 'mdadm -E --scan', 'mdadm -E -s', 'mdadm -Es'],
    explanation: '`mdadm --detail --scan` prints one ARRAY line (name, metadata version, UUID) for each running array, which is the format mdadm.conf expects; `--examine --scan` builds the same kind of line from the member superblocks. The file is /etc/mdadm.conf on RHEL and /etc/mdadm/mdadm.conf on Debian. Rebuilding the initramfs afterwards (dracut, or update-initramfs -u on Debian) puts the new configuration where early boot reads it. The array can be formatted and used while the initial resync runs; [2/2] [UU] shows both members active.' },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L13A,
    stem: 'The virtual disk of cloud01 (RHEL 9) was enlarged from 40 GiB to 80 GiB. The root filesystem is xfs on /dev/vg_sys/lv_root, whose only physical volume is partition 3 of /dev/vda. Put the steps in order.',
    items: ['lsblk /dev/vda, to confirm the disk is now 80G while vda3 has its old size', 'growpart /dev/vda 3', 'pvresize /dev/vda3', 'lvextend -r -l +100%FREE /dev/vg_sys/lv_root', 'df -h /'],
    explanation: 'Each layer can only grow into space the layer below already has. growpart (disk and partition number as separate arguments) extends partition 3 into the new space; pvresize makes LVM see the larger PV, which creates free extents in vg_sys; lvextend `-l +100%FREE` takes them, and `-r` grows the xfs filesystem in the same step. Without LVM you would run xfs_growfs / straight after growpart.' },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L13B,
    stem: 'Match each storage symptom or task on srv01 to the command that confirms or achieves it.',
    pairs: [['touch fails with "No space left on device" although df -h shows the filesystem 40% used', 'df -i'], ['umount /srv/data fails with "target is busy"', 'fuser -vm /srv/data'], ['df shows /var full, but du -sh /var totals far less', 'lsof +L1'], ['You need the UUID of a new filesystem for /etc/fstab', 'blkid'], ['You want to catch an /etc/fstab mistake before rebooting', 'findmnt --verify'], ['You suspect a software mirror is running on only one disk', 'cat /proc/mdstat']],
    explanation: '`df -i` shows inode use; 100% IUse% with free blocks is inode exhaustion. `fuser -vm` lists the processes using files on that mounted filesystem (`lsof +f -- /srv/data` also works). `lsof +L1` lists open files with a link count of 0, deleted files whose space du cannot see. `blkid` prints UUID and TYPE from the on-disk signature. `findmnt --verify` checks that /etc/fstab parses and its entries are usable. /proc/mdstat shows [2/1] [U_] for a degraded mirror.' },
  { topic: '1.4', type: 'order', difficulty: 2, lesson: L14,
    stem: 'From the console of srv02 (RHEL 9), ens192 must stop using DHCP and keep 192.168.10.50/24 with gateway 192.168.10.1 permanently. Put the steps in order.',
    items: ['nmcli device status, to find the connection profile bound to ens192 (lan0)', 'nmcli connection modify lan0 ipv4.method manual ipv4.addresses 192.168.10.50/24 ipv4.gateway 192.168.10.1', 'nmcli connection up lan0', 'ip -br addr show ens192, to confirm that 192.168.10.50/24 is assigned'],
    explanation: 'nmcli changes profiles (connections), not devices, so you first need the profile name that device status shows for ens192. `connection modify` writes the saved profile only; the running interface keeps its old address until the profile is re-activated with `connection up` (or `nmcli device reapply ens192`). `ip -br addr` then shows the live result. The change is persistent because it is in the profile (a keyfile in /etc/NetworkManager/system-connections/). Doing this from the console matters: re-activating drops an SSH session that uses the old address.' },
  { topic: '1.4', type: 'order', difficulty: 2, lesson: L14,
    stem: 'You are connected to web03 (Ubuntu 24.04) over SSH and must change the default gateway in /etc/netplan/01-lan.yaml without risking a permanent lock-out. Put the steps in order.',
    items: ['Copy /etc/netplan/01-lan.yaml to /root/01-lan.yaml.bak', 'Edit the routes entry in /etc/netplan/01-lan.yaml', 'Run netplan generate to catch YAML and validation errors', 'Run netplan try', 'From a second SSH session, confirm that web03 is still reachable', 'Press Enter in the first session to accept the new configuration'],
    explanation: 'Keep a copy before editing (outside /etc/netplan, since every .yaml file there is read). `netplan generate` parses and validates the files and writes backend configuration without applying it, so syntax errors surface before anything changes. `netplan try` applies the change and rolls it back automatically after 120 seconds (`--timeout` changes this) unless it is confirmed. Test from a new session before confirming; if the gateway is wrong you cannot press Enter, and the old configuration returns by itself. `netplan apply` would make a bad change stick.' },
  { topic: '1.4', type: 'fill', difficulty: 2, lesson: L14,
    stem: 'Refer to the exhibit. The deprecated gateway4: key was removed from web03\'s Netplan file and replaced with a routes entry. Enter the value of to: that makes 192.168.10.1 the IPv4 default gateway.',
    exhibit: `web03# cat /etc/netplan/01-lan.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens192:
      dhcp4: false
      addresses:
        - 192.168.10.30/24
      routes:
        - to: ________
          via: 192.168.10.1
      nameservers:
        search: [example.com]
        addresses: [192.168.10.2]`,
    answer: ['default', '0.0.0.0/0'],
    explanation: 'A routes entry needs at least `to:`; netplan accepts the keyword `default` or the explicit prefix 0.0.0.0/0 for the IPv4 default route (::/0 for IPv6), and `via:` names the gateway. A host address such as 192.168.10.1/32 would create a route to the gateway itself, not a default route. Apply it with `netplan try` over SSH.' },
  { topic: '1.4', type: 'match', difficulty: 2, lesson: L14,
    stem: 'Match each network symptom or question on srv01 to the command that answers it.',
    pairs: [['A new service cannot bind TCP 8443 because something already holds it', 'ss -tlnp'], ['After a cabling change the NIC may have no carrier', 'ethtool ens192'], ['You need the gateway and source address the kernel will use for 203.0.113.9', 'ip route get 203.0.113.9'], ['ssh web01 works but dig web01 returns nothing; you want the answer applications get', 'getent hosts web01'], ['Users report intermittent loss somewhere on the path to 198.51.100.7', 'mtr -rwn -c 20 198.51.100.7'], ['You must check whether 192.0.2.10 accepts TCP connections on 443 from this host', 'nc -zv 192.0.2.10 443']],
    explanation: '`ss -tlnp` (as root) lists listening TCP sockets with the owning process. `ethtool` reports speed, duplex and "Link detected". `ip route get` performs the kernel\'s routing lookup for one destination. `getent hosts` resolves through nsswitch.conf, so it sees /etc/hosts as ssh does, while dig asks DNS only. `mtr` repeats a traceroute and reports loss and latency per hop. `nc -zv` attempts the TCP handshake and reports success or refusal without sending data.' },
  { topic: '1.5', type: 'fill', difficulty: 1, lesson: L15B,
    stem: 'Refer to the exhibit. Enter the command that belongs in the blank of the pipeline on web01 to produce the request count per client address shown.',
    exhibit: `web01$ cat access.log
192.0.2.10 GET /index.html 200
198.51.100.7 GET /login 401
192.0.2.10 GET /about 200
203.0.113.5 POST /login 401
192.0.2.10 GET /index.html 304
198.51.100.7 GET /login 401
web01$ awk '{print $1}' access.log | sort | ________ | sort -rn
      3 192.0.2.10
      2 198.51.100.7
      1 203.0.113.5`,
    answer: ['uniq -c', 'uniq --count'],
    explanation: '`uniq -c` collapses adjacent identical lines and prefixes each with its count. The first `sort` groups equal addresses so they are adjacent (uniq alone would count each run separately), and the final `sort -rn` orders numerically by that count, largest first. `wc -l` would print one total, and `sort -u` would drop the duplicates without counting them.' },
  { topic: '1.5', type: 'fill', difficulty: 2, lesson: L15A,
    stem: 'Refer to the exhibit. When svc_backup runs the backup script on srv01 by hand, error messages appear on the terminal but never reach the log. The cron entry must send both normal output and errors to the same log file. Enter what goes in the blank.',
    exhibit: `svc_backup@srv01:~$ crontab -l
30 2 * * * /usr/local/bin/backup.sh > /var/log/backup/backup.log ________
svc_backup@srv01:~$ /usr/local/bin/backup.sh > /var/log/backup/backup.log
tar: /srv/missing: Cannot stat: No such file or directory
svc_backup@srv01:~$ cat /var/log/backup/backup.log
backup started
backup finished`,
    answer: ['2>&1'],
    explanation: '`> file` redirects only stdout (descriptor 1); the tar error is written to stderr (descriptor 2). `2>&1` placed after `> file` points stderr at wherever stdout already points, the log. Order matters: `2>&1 > file` would leave stderr on the original stdout. `&>file` is a bash shortcut, but cron runs commands with /bin/sh, which on Debian and Ubuntu is dash and does not support it. `2>/dev/null` would throw the errors away.' },
  { topic: '1.6', type: 'order', difficulty: 2, lesson: L16,
    stem: 'On srv01 (RHEL 9), /etc/ssh/sshd_config was damaged. /backup/etc-2026-11-22.tar.gz was made with tar -czf from /etc, and the empty directory /tmp/restore exists. Put the steps in order to restore only that file and bring sshd back safely.',
    items: ['tar -tzf /backup/etc-2026-11-22.tar.gz | grep sshd_config, to find the member name', 'tar -xzf /backup/etc-2026-11-22.tar.gz -C /tmp/restore etc/ssh/sshd_config', 'diff -u /etc/ssh/sshd_config /tmp/restore/etc/ssh/sshd_config, to review what will change', 'cp -p /tmp/restore/etc/ssh/sshd_config /etc/ssh/sshd_config', 'sshd -t, to check the restored configuration', 'systemctl reload sshd'],
    explanation: 'GNU tar stored the names without the leading slash, so listing first gives the exact member name (etc/ssh/sshd_config) to extract. `-C /tmp/restore` extracts into a scratch directory instead of over the live /etc, which lets you diff before replacing anything. After copying the file back, `sshd -t` checks the configuration; only then reload, because a reload with a broken file would leave the server without a working SSH listener.' },
  { topic: '1.6', type: 'fill', difficulty: 2, lesson: L16,
    stem: 'Refer to the exhibit. The dry run on web01 shows the files landing in /var/www/www/. Enter the corrected source argument so that the contents of the backup\'s www directory go directly into /var/www/.',
    exhibit: `web01# rsync -avhn backup01:/backups/web01/www /var/www/
receiving incremental file list
www/
www/index.html
www/css/
www/css/site.css

sent 28 bytes  received 187 bytes  430.00 bytes/sec
total size is 18.42K  speedup is 85.67 (DRY RUN)`,
    answer: ['backup01:/backups/web01/www/'],
    explanation: 'Without a trailing slash rsync copies the directory itself, creating www/ inside the destination. With `backup01:/backups/web01/www/` it copies the directory\'s contents, so index.html lands in /var/www/. A slash on the destination makes no difference. `-n` makes this a dry run; repeat it after the fix, then run the command without `-n`.' },
  { topic: '1.6', type: 'fill', difficulty: 1, lesson: L16,
    stem: 'Refer to the exhibit. On web01 (Ubuntu 24.04), enter the single command, without a pipe, that counts the lines containing "Failed password" inside the compressed rotated log without extracting it.',
    exhibit: `web01$ ls /var/log/auth.log*
/var/log/auth.log  /var/log/auth.log.1  /var/log/auth.log.2.gz  /var/log/auth.log.3.gz
web01$ grep -c 'Failed password' /var/log/auth.log.2.gz
0`,
    answer: ['zgrep -c \'Failed password\' /var/log/auth.log.2.gz', 'zgrep -c "Failed password" /var/log/auth.log.2.gz', 'zgrep --count \'Failed password\' /var/log/auth.log.2.gz', 'zgrep --count "Failed password" /var/log/auth.log.2.gz'],
    explanation: 'grep searched the compressed bytes, so it found nothing. `zgrep` decompresses the file on the fly and passes grep options such as `-c` through. `zcat file | grep -c ...` gives the same count but is a pipe, and `zless` would only page through the file. The quotes keep "Failed password" as one argument.' },
  { topic: '1.7', type: 'fill', difficulty: 2, lesson: L17,
    stem: 'Refer to the exhibit. The VM web01 is moving to the KVM host kvm01. Enter the qemu-img command that writes a qcow2 copy of the disk named web01.qcow2 in the same directory.',
    exhibit: `kvm01$ qemu-img info web01.vmdk | head -4
image: web01.vmdk
file format: vmdk
virtual size: 20 GiB (21474836480 bytes)
disk size: 6.12 GiB`,
    answer: ['qemu-img convert -f vmdk -O qcow2 web01.vmdk web01.qcow2', 'qemu-img convert -O qcow2 -f vmdk web01.vmdk web01.qcow2', 'qemu-img convert -O qcow2 web01.vmdk web01.qcow2', 'qemu-img convert -p -f vmdk -O qcow2 web01.vmdk web01.qcow2', 'qemu-img convert -p -O qcow2 web01.vmdk web01.qcow2'],
    explanation: '`qemu-img convert` reads the source and writes a new image: `-O qcow2` sets the output format and `-f vmdk` names the input format (qemu-img probes it if omitted, but stating it avoids guessing); `-p` only shows progress. The source comes before the output file name. `qemu-img resize` changes size, not format, and `qemu-img info web01.qcow2` afterwards confirms the result.' },
  { topic: '1.7', type: 'match', difficulty: 2, lesson: L17,
    stem: 'Match each task on the KVM host kvm01 to the command that confirms or achieves it.',
    pairs: [['A guest that is shut off does not appear in plain virsh list', 'virsh list --all'], ['You must confirm that the default NAT network is defined and active', 'virsh net-list --all'], ['Before attaching an image you need its format, virtual size and backing file', 'qemu-img info'], ['You need to know whether the CPU offers VT-x or AMD-V', 'lscpu | grep -i virtualization'], ['You need web01\'s state, vCPU count and memory', 'virsh dominfo web01'], ['A patch broke web01 and it must return to the snapshot taken before it', 'virsh snapshot-revert web01 pre-patch']],
    explanation: '`virsh list` shows only running domains; `--all` adds inactive ones, and `net-list --all` does the same for virtual networks. `qemu-img info` reads an image\'s header. `lscpu` prints a Virtualization line (VT-x or AMD-V) when the CPU supports it; /dev/kvm shows whether KVM is usable. `virsh dominfo` summarises a domain. `virsh snapshot-revert` returns the guest to a named snapshot.' },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
