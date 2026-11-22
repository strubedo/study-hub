// Curated free YouTube videos mapped to Linux+ XK0-006 topics. Chosen from yt-dlp searches (ytsearch, flat playlist) on 2026-11-22,
// then every id, duration, title, channel and upload date was confirmed with a full yt-dlp metadata lookup of its watch URL the same day.
// Full-length courses are "extra" with no topic mapping (their chapter coverage was not checked); legacy = recorded for XK0-005.
// Tuple order: id, seconds, title, kind, topic ids, legacy, channel.
const RAW = [
  // Full courses
  ['nGPK6YBbKpg', 42909, 'CompTIA Linux+ Complete Guide - XK0-006 Exam Prep | Hands-On Labs Included', 'extra', [], false, 'howtonetwork'],
  ['qNxuTRCRjoQ', 11305, 'Master Linux Fast: Complete Linux+ Certification Course (100% FREE) XK0-005', 'extra', [], true, 'KeepItTechie'],
  // Domain 1: System management
  ['XpFsMB6FoOs', 284, 'How Does Linux Boot Process Work?', 'lecture', ['1.1'], false, 'ByteByteGo'],
  ['MeltFN-bXrQ', 3192, 'Linux Logical Volume Manager (LVM) Deep Dive Tutorial', 'lecture', ['1.3'], false, 'Learn Linux TV'],
  ['2Z6ouBYfZr8', 1948, 'Linux Crash Course - Everything You Need to Know for Formatting and Mounting Disks', 'lecture', ['1.3'], false, 'Learn Linux TV'],
  ['wHfIFZlDxtU', 1003, 'How to Use the ip Command in Linux: A Beginner’s Guide', 'lecture', ['1.4', '5.3'], false, 'Learn Linux TV'],
  ['BgZHbCDFODk', 1070, 'QEMU/KVM for absolute beginners', 'lecture', ['1.7'], false, 'Veronica Explains'],
  // Domain 2: Services and user management
  ['4e669hSjaX8', 2148, 'Linux Crash Course - Understanding File & Directory Permissions', 'lecture', ['2.1', '3.3'], false, 'Learn Linux TV'],
  ['19WOD84JFxA', 1978, 'Linux Crash Course -  Managing Users', 'lecture', ['2.2'], false, 'Learn Linux TV'],
  ['mL1hMBYP1bQ', 1680, 'Linux Crash Course - The dnf Command', 'lecture', ['2.4'], false, 'Learn Linux TV'],
  ['Kzpm-rGAXos', 2860, 'Systemd Explained: How to Manage Linux Services Easily', 'lecture', ['2.5'], false, 'Learn Linux TV'],
  ['iJe0qzO8EHs', 3287, 'The absolute beginners guide to Podman | Into the Terminal 158', 'lecture', ['2.6'], false, 'Red Hat Enterprise Linux'],
  ['pg19Z8LL06w', 4059, 'Docker Crash Course for Absolute Beginners [NEW]', 'lecture', ['2.6'], false, 'TechWorld with Nana'],
  // Domain 3: Security
  ['l095ciYQMYg', 3528, 'Understanding Linux logs and audits | Into the Terminal 140', 'lecture', ['3.1'], false, 'Red Hat Enterprise Linux'],
  ['YJZV79C-rNU', 3321, 'Implementing a Linux firewall with firewalld and nftables  | Into the Terminal 165', 'lecture', ['3.2'], false, 'Red Hat Enterprise Linux'],
  ['oSTsn-QhM-0', 3095, 'Don’t Disable SELinux | Into the Terminal 102', 'lecture', ['3.3', '5.4'], false, 'Red Hat Enterprise Linux'],
  ['sBrAVQumqjs', 1307, '5 Must Have Tweaks to Secure OpenSSH', 'lecture', ['3.3'], false, 'Learn Linux TV'],
  ['VcV4T8cL3xw', 2762, 'Certificates of Authority: Do you really understand how SSL / TLS works?', 'lecture', ['3.5', '5.4'], false, 'David Bombal'],
  // Domain 4: Automation, orchestration and scripting
  ['CMB5GCexb84', 1582, 'Ansible for Complete Beginners: Creating Your First Playbook', 'lecture', ['4.1'], false, 'Learn Linux TV'],
  ['s_o8dwzRlu4', 4323, 'Kubernetes Crash Course for Absolute Beginners [NEW]', 'lecture', ['4.1'], false, 'TechWorld with Nana'],
  ['tK9Oc6AEnR4', 2877, 'Bash Scripting Tutorial for Beginners', 'lecture', ['4.2'], false, 'freeCodeCamp.org'],
  ['Kg1Yvry_Ydk', 857, 'Python Tutorial: VENV (Mac & Linux) - How to Use Virtual Environments with the Built-In venv Module', 'lecture', ['4.3'], false, 'Corey Schafer'],
  ['RGOj5yH7evk', 4110, 'Git and GitHub for Beginners - Crash Course', 'lecture', ['4.4'], false, 'freeCodeCamp.org'],
  ['VeM6ENfZANo', 1707, 'Claude Code + Ansible: Is AI Actually Useful for Sysadmins?', 'lecture', ['4.5'], false, 'Learn Linux TV'],
  // Domain 5: Troubleshooting
  ['h4Sl21AKiDg', 1290, 'How Prometheus Monitoring works | Prometheus Architecture explained', 'lecture', ['5.1'], false, 'TechWorld with Nana'],
  ['We5MkaEJOs0', 538, 'SNMP - CompTIA Network+ N10-009 - 3.2', 'lecture', ['5.1'], false, 'Professor Messer'],
  ['hRYxmYdRN60', 4083, 'Troubleshooting Linux Boot | Into the Terminal 115', 'lecture', ['5.2'], false, 'Red Hat Enterprise Linux'],
  ['zjIbFvKKYOw', 3402, 'Linux Service Troubleshooting | Into the Terminal 117', 'lecture', ['5.2'], false, 'Red Hat Enterprise Linux'],
  ['FQGB_QVJ7is', 2784, 'Troubleshooting Disk Errors | Into the Terminal 48', 'lecture', ['5.2'], false, 'Red Hat Enterprise Linux'],
  ['dHa2Bja85U0', 3425, 'Troubleshooting Linux Networking | Into the Terminal 114', 'lecture', ['5.3'], false, 'Red Hat Enterprise Linux'],
  ['0sZlaQr3e2w', 3641, 'Linux Performance: Is it CPU, Memory, or I/O?  | Into the Terminal 166', 'lecture', ['5.5'], false, 'Red Hat Enterprise Linux'],
];

export default RAW.map(([id, seconds, title, kind, topics, legacy, channel], i) => ({
  id, title, seconds, kind, topics, legacy, order: i + 1, channel, playlist: null,
}));
