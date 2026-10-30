// Domain 1 - Deploy and Manage Windows Server 2025. Original content, checked against Microsoft Learn (Windows Server 2025 documentation) on 2026-10-30.
export default [
  { id: '1.1-editions-and-licensing', topic: '1.1', title: 'Editions, Core-Based Licensing, CALs and Virtualization Rights', minutes: 9, file: '1.1-editions-and-licensing.md',
    objectives: ['Compare Standard, Datacenter, Datacenter: Azure Edition and Essentials', 'Apply core-based licensing minimums and virtual machine rights', 'Explain what CALs cover and when they are not needed', 'Pick the edition for a given feature requirement'] },
  { id: '1.1-payg-hardware-whats-new', topic: '1.1', title: 'Pay-as-You-Go Through Azure Arc, Hardware Requirements and What Is New in 2025', minutes: 9, file: '1.1-payg-hardware-whats-new.md',
    objectives: ['Describe Azure Arc pay-as-you-go licensing, its prerequisites and billing rules', 'State the minimum CPU, RAM, disk and network requirements for 2025', 'List the 2025 headline changes that Microsoft documents', 'Size a lab virtual machine so setup does not fail'] },
  { id: '1.2-install-options-and-upgrades', topic: '1.2', title: 'Server Core vs Desktop Experience, In-Place Upgrades and Edition Conversion', minutes: 9, file: '1.2-install-options-and-upgrades.md',
    objectives: ['Choose between Server Core and Server with Desktop Experience', 'Read the supported in-place upgrade paths to Windows Server 2025', 'List the upgrade restrictions, including domain controllers', 'Convert evaluation and Standard installations with DISM'] },
  { id: '1.2-sconfig-initial-config-roles', topic: '1.2', title: 'SConfig, Initial Configuration and Installing Roles and Features', minutes: 9, file: '1.2-sconfig-initial-config-roles.md',
    objectives: ['Navigate the SConfig menu and know what each option does', 'Set name, IP, domain membership and activation from SConfig or PowerShell', 'Install and remove roles with Server Manager and Install-WindowsFeature', 'Distinguish roles, role services and features'] },
  { id: '1.3-remote-management-powershell-ssh', topic: '1.3', title: 'Server Manager, Windows Admin Center, PowerShell Remoting and OpenSSH', minutes: 10, file: '1.3-remote-management-powershell-ssh.md',
    objectives: ['Manage several servers from one Server Manager console', 'Place Windows Admin Center and know its port and install limits', 'Use Enter-PSSession and Invoke-Command over WinRM, and fix workgroup trust errors', 'Enable and use OpenSSH server on Windows Server 2025'] },
  { id: '1.3-updates-wsus-hotpatching', topic: '1.3', title: 'Windows Update, WSUS Concepts and Hotpatching', minutes: 8, file: '1.3-updates-wsus-hotpatching.md',
    objectives: ['Configure update behavior with SConfig and Group Policy', 'Explain the WSUS model and its deprecation status', 'Describe the hotpatch baseline cycle and its prerequisites', 'Know how Arc-enabled 2025 servers receive hotpatches'] },
];
