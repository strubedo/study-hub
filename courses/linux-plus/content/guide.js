// Exam guide page content (course.js `guide`), rendered by engine/views/guide.js. Strings are inline markdown.
// Sources (checked 2026-11-22): CompTIA Linux+ V8 page and the XK0-006 exam objectives PDF, document version 5.0.
import { EXAM } from './blueprint.js';

const FACTS = [
  ['Exam', `**${EXAM.code}** (V8), launched July 15, 2025. CompTIA estimates retirement in 2028.`],
  ['Format', `${EXAM.minutes} minutes, a maximum of ${EXAM.questions} questions: multiple choice and performance-based.`],
  ['Scoring', 'Scaled 100–900; **720** passes.'],
  ['Recommended experience', '12 months of hands-on work with Linux servers; A+, Network+ or Server+ level knowledge.'],
  ['Validity', 'Three years; renew through CompTIA continuing education.'],
];

const STRATEGY = [
  ['Practise at a shell', 'Performance-based questions put you at a command line. Build a VM (one RPM-based, one Debian-based if you can) and do every lab.'],
  ['Know both families', 'The exam covers RPM-based and dpkg-based distributions: dnf and apt, firewalld and ufw, NetworkManager and Netplan.'],
  ['Flag and move on', 'Performance-based questions usually come first and take longest. Flag them, bank the multiple-choice marks, then come back.'],
  ['Troubleshooting is 22%', 'For each symptom, know the tool that confirms it: df -i for inode exhaustion, journalctl -xe for unit failures, ausearch for SELinux denials.'],
];

// Every lab in this course needs only a Linux VM, so it can be done from any host computer.
const LAB = [
  ['Windows', '**WSL 2** (`wsl --install`) gives a real Ubuntu with systemd for most labs. For labs that need their own kernel or disks (LVM, RAID, SELinux, firewalld, boot), use a full VM in **Hyper-V** or **VirtualBox**.'],
  ['macOS (Apple silicon or Intel)', '**UTM** (free) or **VirtualBox** runs a full Linux VM; on Apple silicon pick the **ARM64 / aarch64** installer image. **Multipass** starts an Ubuntu VM with one command (`multipass launch`).'],
  ['Linux', '**KVM** with virt-manager or GNOME Boxes, or VirtualBox. Avoid doing storage, firewall or SELinux labs on the machine you work on.'],
  ['Which distributions', 'One RPM-family VM (**Rocky Linux** or **AlmaLinux** 9 or 10; both publish x86_64 and aarch64 images) and one Debian-family VM (**Ubuntu Server 24.04** or **Debian 13**). The exam covers both families.'],
  ['Sizing', '2 CPUs, 2 GB of RAM and a 20 GB disk per VM is enough. Add two or three small extra virtual disks for the LVM and RAID labs, and take a snapshot before each lab so you can roll back.'],
];

export default function guide() {
  return {
    eyebrow: 'Exam guide',
    title: 'Linux+ XK0-006 at a glance',
    intro: 'What the exam covers, how it is scored and how to prepare.',
    action: { label: 'CompTIA Linux+ page', href: 'https://www.comptia.org/en-us/certifications/linux/' },
    stats: [
      [`${EXAM.minutes} min`, 'Exam time'],
      [EXAM.questionsApprox, 'Questions'],
      ['720 / 900', 'Passing score'],
      ['3 years', 'Validity'],
    ],
    rows: [
      [{
        title: 'About the certification',
        accent: true,
        blocks: [{ type: 'text', md: `**${EXAM.name}** certifies that you can configure, manage, operate and troubleshoot Linux servers, using security best practices, scripting, containers, virtualization and automation.` }],
      }],
      [{
        title: 'Exam facts',
        blocks: [{ type: 'list', items: FACTS }],
        note: 'Confirm details on [CompTIA\'s Linux+ page](https://www.comptia.org/en-us/certifications/linux/) before you book.',
      }, {
        title: 'Domain weights',
        blocks: [{ type: 'domains', columns: ['XK0-006 domain', 'Weight'] }],
      }],
      [{
        title: 'Build a lab on any computer',
        blocks: [{ type: 'list', items: LAB }],
        note: 'The labs behave the same on Intel/AMD and ARM virtual machines; only the installer image you download differs.',
      }],
      [{
        title: 'Test-taking strategy',
        blocks: [{ type: 'grid', items: STRATEGY }],
      }],
    ],
  };
}
