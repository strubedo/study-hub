// Domain 1 — Deploy and manage AD DS. Generated data; original content.
export default [
  {
    "id": "d1-001",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network contains an Active Directory Domain Services (AD DS) forest named contoso.com that contains a single domain. You plan to promote a new server named Server3 that runs Windows Server 2025 to a domain controller in contoso.com. Refer to the exhibit. You need to ensure that you can promote Server3. What should you do?",
    "exhibit": "PS C:\\> (Get-ADForest).ForestMode\nWindows2012R2Forest\nPS C:\\> (Get-ADDomain).DomainMode\nWindows2012R2Domain\nPS C:\\> Get-ADDomainController -Filter * | Format-Table Name, OperatingSystem, IsGlobalCatalog\n\nName OperatingSystem                   IsGlobalCatalog\n---- ---------------                   ---------------\nDC1  Windows Server 2016 Datacenter               True\nDC2  Windows Server 2012 R2 Datacenter            True",
    "options": [
      "Run adprep /forestprep and adprep /domainprep from the Windows Server 2025 media on DC1.",
      "Demote DC2, and then raise the domain and forest functional levels to Windows Server 2016.",
      "Raise the forest functional level to Windows Server 2025.",
      "Promote Server3 by running Install-ADDSDomainController with the -DomainMode WinThreshold parameter."
    ],
    "answer": [
      1
    ],
    "explanation": "A Windows Server 2025 DC can only join a domain that is already at the **Windows Server 2016** domain functional level or higher. The domain is at 2012 R2, and it can't be raised to 2016 while **DC2** still runs Windows Server 2012 R2 — so demote (or upgrade) DC2 first, then raise the domain and forest levels to 2016.\n\n* **Raise to Windows Server 2025** — impossible: that level requires *every* DC to run Windows Server 2025, and DC1 runs 2016.\n* **adprep** — schema and domain preparation run automatically during promotion and never change the functional level.\n* **-DomainMode on Install-ADDSDomainController** — that parameter exists only on `Install-ADDSForest` and `Install-ADDSDomain`; an additional DC can't set the domain level.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-002",
    "topic": "1.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "You are creating a new AD DS forest by promoting a server that runs Windows Server 2025. What is the lowest forest functional level that you can select for the new forest? (Answer in the form \"Windows Server YYYY\".)",
    "answer": [
      "Windows Server 2016",
      "2016",
      "WinThreshold",
      "Windows2016Forest",
      "Windows Server 2016 functional level",
      "Server 2016"
    ],
    "explanation": "New forests created on Windows Server 2025 must use at least the **Windows Server 2016** domain and forest functional level (in the ADDSDeployment cmdlets the value is `WinThreshold`, or `7`). Windows Server 2019 and 2022 never introduced their own levels, and 2012 R2 or lower isn't offered.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-003",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network contains an AD DS domain named contoso.com. The main office contains a domain controller named DC1. A branch office named Branch1 connects to the main office by using a 2-Mbps WAN link. The AD DS database is 38 GB. You plan to deploy a writable domain controller named DC5 in Branch1. You need to minimise WAN traffic during the promotion of DC5. What should you run on DC1 first?",
    "options": [
      "ntdsutil \"activate instance ntds\" ifm \"create sysvol rodc C:\\IFM\" quit quit",
      "New-ADDCCloneConfigFile -CloneComputerName DC5 -Static -SiteName Branch1",
      "ntdsutil \"activate instance ntds\" ifm \"create sysvol full C:\\IFM\" quit quit",
      "wbadmin start systemstatebackup -backupTarget:E:"
    ],
    "answer": [
      2
    ],
    "explanation": "**Install from Media (IFM)** lets DC5 seed its database from local media and replicate only the changes since the media was created. `create sysvol full` includes the database and SYSVOL for a **writable** DC; you then promote with `Install-ADDSDomainController -InstallationMediaPath`.\n\n* `create sysvol rodc` builds RODC media with secrets removed — it can only be used to promote an RODC.\n* `New-ADDCCloneConfigFile` is for **virtual DC cloning**, which requires copying the source DC's virtual disks (no WAN saving here) and a hypervisor with VM-Generation ID.\n* A `wbadmin` system state backup isn't accepted as installation media by `Install-ADDSDomainController`.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-004",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "You have a Hyper-V host that runs Windows Server 2025. A virtual domain controller named DC2 runs on the host and is a member of the contoso.com domain. You plan to deploy additional domain controllers by cloning DC2. Which three requirements must be met? (Choose three.)",
    "options": [
      "The hypervisor exposes the VM-Generation ID to the guest operating system.",
      "DC2 is a member of the Cloneable Domain Controllers group.",
      "DC2 is generalised by using Sysprep before its virtual disks are copied.",
      "The domain controller that holds the PDC emulator role is online and reachable during cloning.",
      "DC2 is configured as a global catalog server.",
      "DC2 holds the RID master role."
    ],
    "answer": [
      0,
      1,
      3
    ],
    "explanation": "Virtual DC cloning needs the source DC to be authorised (**Cloneable Domain Controllers** group), a hypervisor that provides **VM-Generation ID** (so the clone detects that it's a copy and resets its invocation ID and RID pool), and an online **PDC emulator**, which creates the clone's computer account and identity.\n\n* The source doesn't need to hold the RID master role — the clone requests its own RID pool.\n* **Sysprep** must never be run on a DC; cloning uses `DCCloneConfig.xml` instead.\n* GC status is irrelevant; the clone simply inherits whatever the source has unless configured otherwise.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-005",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network contains an AD DS domain named contoso.com that has four domain controllers. A domain controller named DC4 suffered a permanent hardware failure and will not be repaired. DC4 did not hold any operations master roles. You need to remove DC4 from AD DS. The solution must minimise administrative effort. What should you do?",
    "options": [
      "Run repadmin /removelingeringobjects on DC1 and specify the objectGUID of DC4.",
      "In Active Directory Users and Computers, delete the DC4 computer object from the Domain Controllers OU and confirm that the domain controller is permanently offline.",
      "On DC1, run Uninstall-ADDSDomainController -ForceRemoval.",
      "Disable the DC4 computer account and wait for the tombstone lifetime to expire."
    ],
    "answer": [
      1
    ],
    "explanation": "Deleting a failed DC's computer object in **Active Directory Users and Computers** (or its server object in Sites and Services) performs **metadata cleanup** automatically on current Windows Server versions: it removes the NTDS Settings object, connection objects and DNS/FRS references after you confirm the DC is permanently offline.\n\n* `Uninstall-ADDSDomainController` acts on the **local** server — running it on DC1 would demote DC1.\n* Disabling the computer account leaves DC4's metadata (and its replication partners' connections) in place indefinitely.\n* `repadmin /removelingeringobjects` removes lingering objects; it doesn't remove a DC's metadata.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-006",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "You have two domain controllers named DC1 (10.0.0.10) and DC2 (10.0.0.11) that run the DNS Server role and host Active Directory-integrated zones for contoso.com. After a power outage, both domain controllers restarted at the same time and AD DS took a long time to become available on each of them. You need to configure the DNS client settings of DC1 to follow Microsoft recommendations. What should you configure on DC1?",
    "options": [
      "Preferred DNS server: 8.8.8.8; Alternate DNS server: 127.0.0.1",
      "Preferred DNS server: 10.0.0.10; Alternate DNS server: 10.0.0.11",
      "Preferred DNS server: 127.0.0.1; Alternate DNS server: none",
      "Preferred DNS server: 10.0.0.11; Alternate DNS server: 127.0.0.1"
    ],
    "answer": [
      3
    ],
    "explanation": "A DC that runs DNS should use **another DC** as its preferred DNS server and its own **loopback address** only as an alternate. If it points only (or first) at itself, it can wait on its own DNS service — which depends on AD DS — at start-up, creating a slow \"island\" start.\n\n* Loopback as the only server, or the DC's own IP first, causes exactly the delayed start described.\n* A public resolver such as 8.8.8.8 can't resolve the AD zone or the `_msdcs` SRV records, so DC locator and replication break.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-007",
    "topic": "1.1",
    "type": "match",
    "difficulty": 1,
    "stem": "You need to perform the following AD DS deployment tasks by using PowerShell. Match each task to the cmdlet that performs it.",
    "pairs": [
      [
        "Create the first domain controller of a new forest",
        "Install-ADDSForest"
      ],
      [
        "Create a child domain in an existing forest",
        "Install-ADDSDomain"
      ],
      [
        "Add a domain controller to an existing domain",
        "Install-ADDSDomainController"
      ],
      [
        "Pre-create the computer account for an RODC",
        "Add-ADDSReadOnlyDomainControllerAccount"
      ],
      [
        "Demote a domain controller",
        "Uninstall-ADDSDomainController"
      ]
    ],
    "explanation": "The ADDSDeployment module splits promotion by scope: `Install-ADDSForest` (new forest root), `Install-ADDSDomain` (new child or tree domain, `-DomainType ChildDomain`/`TreeDomain`), and `Install-ADDSDomainController` (replica DC, writable or `-ReadOnlyReplica`). `Add-ADDSReadOnlyDomainControllerAccount` is the first stage of a staged RODC deployment, and `Uninstall-ADDSDomainController` demotes the local DC.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-008",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "You are planning to raise the domain and forest functional levels of contoso.com to Windows Server 2025. Which two statements are true? (Choose two.)",
    "options": [
      "Raising the functional level to Windows Server 2025 immediately converts every domain controller database to 32k pages.",
      "Every domain controller in the domain must run Windows Server 2025 before you can raise the domain functional level to Windows Server 2025.",
      "The Windows Server 2025 functional level is a prerequisite for enabling the Database 32k pages optional feature.",
      "Domain controllers that run Windows Server 2016 can remain in a domain at the Windows Server 2025 domain functional level.",
      "All member servers in the domain must run Windows Server 2025 before you can raise the domain functional level."
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "The Windows Server 2025 level (DomainLevel/ForestLevel **10**) can be used only when **every DC** runs Windows Server 2025, and it's required before you can enable the **Database 32k pages** optional feature.\n\n* Raising the level doesn't change database page size — the 32k feature is enabled separately and is irreversible.\n* Functional levels depend only on **domain controllers**, never on member servers or clients.\n* A Windows Server 2016 DC can't exist in a domain at the 2025 level; the highest level it supports is Windows Server 2016.",
    "lesson": "1.1-deploy-dcs-onprem"
  },
  {
    "id": "d1-009",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "You deploy an Azure virtual machine named DC3 that will be promoted to a domain controller for contoso.com. You attach a managed data disk to DC3 to store NTDS.dit, the AD DS log files and SYSVOL. You need to configure the data disk to protect the integrity of the AD DS database. Which host caching setting should you configure on the data disk?",
    "options": [
      "ReadWrite with Write Accelerator enabled",
      "None",
      "ReadOnly",
      "ReadWrite"
    ],
    "answer": [
      1
    ],
    "explanation": "The AD DS database engine (ESE) manages its own write ordering and must know that committed writes are durable. Microsoft recommends a separate data disk with **host caching set to None** for NTDS.dit, logs and SYSVOL.\n\n* **ReadWrite** caching can acknowledge writes that aren't yet on durable storage, risking database corruption after a host failure.\n* **ReadOnly** caching still adds a caching layer that isn't recommended for the AD DS disk.\n* **Write Accelerator** is a feature of specific VM series for database log disks and isn't a DC recommendation.",
    "lesson": "1.1-dcs-in-azure"
  },
  {
    "id": "d1-010",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "You have an Azure virtual network named VNet1 that contains two domain controllers for contoso.com named DC3 (10.10.1.4) and DC4 (10.10.1.5). VNet1 uses the default DNS settings. New Azure VMs deployed to VNet1 fail to join contoso.com. You run the command shown in the exhibit on a new VM. You need to ensure that all existing and future VMs in VNet1 can locate the domain controllers. The solution must minimise administrative effort. What should you do?",
    "exhibit": "C:\\> nslookup -type=SRV _ldap._tcp.dc._msdcs.contoso.com\nServer:  UnKnown\nAddress:  168.63.129.16\n\n*** UnKnown can't find _ldap._tcp.dc._msdcs.contoso.com: Non-existent domain",
    "options": [
      "On DC3, create a conditional forwarder for contoso.com that points to 168.63.129.16.",
      "Create an Azure private DNS zone named contoso.com and link it to VNet1.",
      "Configure the DNS servers of VNet1 as custom DNS servers set to 10.10.1.4 and 10.10.1.5.",
      "Sign in to each VM and configure the network adapter in Windows to use 10.10.1.4 and 10.10.1.5 as DNS servers."
    ],
    "answer": [
      2
    ],
    "explanation": "The VM is using **Azure-provided DNS** (168.63.129.16), which has no knowledge of the AD-integrated `contoso.com` zone or its SRV records. Setting **custom DNS servers on VNet1** to the DCs makes Azure DHCP hand those servers to every NIC in the VNet, now and in future (existing VMs pick it up after renewal or restart).\n\n* A **private DNS zone** wouldn't contain the dynamically registered DC SRV records, so DC location would still fail.\n* A conditional forwarder on DC3 pointing back at Azure DNS doesn't change what the clients query.\n* Editing each guest NIC works for one VM but doesn't scale, isn't applied to future VMs, and fights Azure DHCP.",
    "lesson": "1.1-dcs-in-azure"
  },
  {
    "id": "d1-011",
    "topic": "1.1",
    "type": "single",
    "difficulty": 1,
    "stem": "You plan to deploy an Azure VM named DC3 that will be a domain controller for contoso.com. You need to ensure that DC3 always uses the IP address 10.10.1.4. What should you do?",
    "options": [
      "Set the private IP address assignment of DC3's Azure network interface to Static with the address 10.10.1.4.",
      "Create a DHCP reservation for DC3 on an on-premises DHCP server.",
      "Configure a static IPv4 address of 10.10.1.4 in the network adapter settings in Windows on DC3.",
      "Associate a Standard SKU static public IP address with DC3."
    ],
    "answer": [
      0
    ],
    "explanation": "In Azure the IP address is assigned by the platform. Set the **Azure NIC's private IP assignment to Static** and leave Windows on DHCP — Azure DHCP will always hand the guest that address.\n\n* Hard-coding the IP inside the guest isn't supported practice and can disconnect the VM if it doesn't match the NIC configuration.\n* An on-premises DHCP server doesn't serve Azure VNets.\n* A public IP doesn't fix the private address and should never be attached to a DC.",
    "lesson": "1.1-dcs-in-azure"
  },
  {
    "id": "d1-012",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "You are designing the deployment of domain controllers for contoso.com on Azure VMs in a region that supports availability zones. You need to follow Microsoft recommendations for availability and security. Which two actions should you perform? (Choose two.)",
    "options": [
      "Use ephemeral OS disks for the domain controller VMs to reduce latency.",
      "Stop the domain controller VMs from the Azure portal outside business hours to reduce costs.",
      "Configure at least two of the Azure domain controllers as global catalog servers.",
      "Assign a public IP address to each domain controller so that it can replicate with on-premises domain controllers.",
      "Set host caching to ReadWrite on the disk that stores NTDS.dit.",
      "Deploy at least two domain controller VMs in different availability zones."
    ],
    "answer": [
      2,
      5
    ],
    "explanation": "Microsoft recommends at least two Azure DCs spread across **availability zones** (or an availability set where zones aren't available), and making at least two of them **global catalogs** so Azure workloads don't depend on the WAN for logons.\n\n* **Ephemeral OS disks** aren't supported practice for DCs — a persistent OS disk lets the DC survive host maintenance.\n* DCs must never have **public IPs**; replication runs over VPN/ExpressRoute.\n* NTDS.dit belongs on a data disk with caching **None**, not ReadWrite.\n* Stopping (deallocating) DCs from the portal resets their VM-Generation ID, discarding RID pools and forcing non-authoritative SYSVOL syncs.",
    "lesson": "1.1-dcs-in-azure"
  },
  {
    "id": "d1-013",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Your company has an on-premises AD DS forest named contoso.com and an Azure subscription. You plan to migrate a line-of-business application to Azure VMs in a virtual network named VNet1. The application requires LDAP and Kerberos. The solution must meet the following requirements: the identity servers in Azure must replicate with the on-premises domain controllers, and administrators must be able to extend the schema for the application. What should you deploy?",
    "options": [
      "Azure Arc agents on the on-premises domain controllers",
      "Microsoft Entra Domain Services in VNet1",
      "Two Azure VMs in VNet1 promoted as additional domain controllers for contoso.com",
      "Microsoft Entra Cloud Sync agents on the on-premises domain controllers"
    ],
    "answer": [
      2
    ],
    "explanation": "Only **self-managed DCs on Azure VMs** are part of your forest: they replicate with on-premises DCs and you keep Domain/Enterprise/Schema Admins rights to extend the schema.\n\n* **Microsoft Entra Domain Services** is a separate managed domain synchronised one way from Entra ID; it doesn't replicate with your DCs and doesn't allow schema extensions.\n* **Entra Cloud Sync** synchronises identities to Entra ID; it provides no LDAP/Kerberos in VNet1.\n* **Azure Arc** manages servers; it doesn't provide directory services.",
    "lesson": "1.1-dcs-in-azure"
  },
  {
    "id": "d1-014",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "The contoso.com domain has two domain controllers named DC3 and DC4 that run as Azure VMs. An Azure Automation runbook stops (deallocates) both VMs every night and starts them every morning. Which three effects does this have on each domain controller when it starts? (Choose three.)",
    "options": [
      "The invocation ID of the domain controller's directory database is reset.",
      "Any operations master roles held by the domain controller are transferred to another domain controller.",
      "The domain controller is demoted and must be promoted again.",
      "SYSVOL on the domain controller is marked as non-authoritative.",
      "The domain controller discards its current RID pool.",
      "The domain controller's static private IP address is released and a new address is assigned."
    ],
    "answer": [
      0,
      3,
      4
    ],
    "explanation": "Deallocating and restarting an Azure VM changes its **VM-Generation ID**. The DC's virtualisation safeguards then **reset the invocation ID**, **discard the RID pool** and mark **SYSVOL non-authoritative**. If every DC in the domain is deallocated at once, none has an authoritative SYSVOL and manual recovery is needed — shut DCs down from inside the guest instead, or don't schedule them.\n\n* Static private IP assignments on the Azure NIC persist across deallocation.\n* FSMO roles never move automatically.\n* The DC isn't demoted; it just applies the safeguards.",
    "lesson": "1.1-dcs-in-azure"
  },
  {
    "id": "d1-015",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "You plan to deploy a read-only domain controller (RODC) named RODC1 in a branch office. A branch technician named Tech1 must perform the installation on site. Tech1 must not be added to any domain-wide administrative group. What should you do?",
    "options": [
      "Add Tech1 to the Server Operators group and have Tech1 run Install-ADDSDomainController -ReadOnlyReplica.",
      "Add Tech1 to the Domain Admins group temporarily and have Tech1 promote RODC1.",
      "Add Tech1 to the Allowed RODC Password Replication Group and have Tech1 run Install-ADDSDomainController -ReadOnlyReplica.",
      "Pre-create the RODC account for RODC1, specify Tech1 as the delegated administrator, and then have Tech1 attach the server to the account."
    ],
    "answer": [
      3
    ],
    "explanation": "A **staged RODC deployment** splits the job: a Domain Admin pre-creates the RODC account (`Add-ADDSReadOnlyDomainControllerAccount` or ADUC) and names a **delegated administrator**; that user then attaches the workgroup server with `Install-ADDSDomainController -UseExistingAccount` and becomes a local administrator of that RODC only.\n\n* Temporary Domain Admins membership violates the requirement.\n* The Allowed RODC Password Replication Group controls password caching, not installation rights.\n* Server Operators is a domain-wide privileged group and can't promote a DC anyway.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-016",
    "topic": "1.1",
    "type": "order",
    "difficulty": 2,
    "stem": "You need to deploy an RODC named RODC1 to a new branch office named Branch1 by using a staged deployment. Branch technicians must perform the promotion, and branch users must be able to sign in during the first WAN outage after deployment. In which order should you perform the actions?",
    "items": [
      "Create the Branch1 site and associate the branch subnet with it",
      "Run Add-ADDSReadOnlyDomainControllerAccount for RODC1, specifying Branch1, the delegated administrator group and the branch user and computer groups as allowed accounts",
      "On RODC1, as a delegated administrator, run Install-ADDSDomainController -UseExistingAccount",
      "Prepopulate the passwords of the branch users and computers by running repadmin /rodcpwdrepl"
    ],
    "explanation": "The site must exist first because both the account pre-creation and promotion reference it (`-SiteName` must name an existing site; the deployment cmdlets don't create sites). The account is pre-created (with the branch groups on its allowed list, because prepopulation fails for any account the password replication policy doesn't allow) before the delegated technician attaches the server. Passwords can be prepopulated only once RODC1 exists and is replicating — and prepopulating is what makes the *first* outage survivable, because otherwise credentials are only cached after each user's first successful sign-in through the RODC.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-017",
    "topic": "1.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "You run the following command on Server2: Install-ADDSDomainController -DomainName contoso.com -ReadOnlyReplica -InstallDns. Which additional parameter is mandatory for this command to run? (Enter the parameter name.)",
    "answer": [
      "SiteName",
      "-SiteName"
    ],
    "explanation": "In the read-only parameter set of `Install-ADDSDomainController`, **`-SiteName`** is mandatory: an RODC must be placed in a specific (existing) site, because its replication and password replication policy are designed around that branch.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-018",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "Which two statements about read-only domain controllers (RODCs) in a Windows Server 2025 domain are true? (Choose two.)",
    "options": [
      "Each RODC has its own krbtgt account.",
      "An RODC can hold the infrastructure master role if it is not a global catalog server.",
      "Writable domain controllers never replicate directory changes from an RODC.",
      "By default, an RODC caches the passwords of all members of the Domain Users group.",
      "An RODC can be the only domain controller in a domain.",
      "An RODC accepts dynamic DNS updates directly into its copy of Active Directory-integrated zones."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "RODC replication is **one-way inbound**, so a compromised RODC can't push changes into the domain, and each RODC gets a unique **krbtgt_NNNNN** account so its tickets don't expose the domain krbtgt key.\n\n* RODCs can't hold **any** FSMO role.\n* The default password replication policy caches **no** user passwords (the Allowed group starts empty).\n* An RODC's DNS zones are read-only; it refers dynamic updates to a writable DNS server.\n* An RODC needs a writable DC in its domain to replicate from.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-019",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An RODC named RODC1 is deployed in a branch office. A group named CONTOSO\\Branch1-Admins was configured as the delegated administrator when RODC1 was installed. You need to grant a second group, CONTOSO\\Branch1-Ops, local administrative rights on RODC1. Members of Branch1-Ops must not receive administrative rights on any other domain controller. What should you do?",
    "options": [
      "On RODC1, run dsmgmt and use local roles to add CONTOSO\\Branch1-Ops to the administrators role.",
      "Add CONTOSO\\Branch1-Ops to the Allowed RODC Password Replication Group.",
      "Add CONTOSO\\Branch1-Ops to the Administrators group in the Builtin container of contoso.com.",
      "Add CONTOSO\\Branch1-Ops to the Server Operators group."
    ],
    "answer": [
      0
    ],
    "explanation": "**Administrator role separation** on an RODC is managed with `dsmgmt` › `local roles` (`add CONTOSO\\Branch1-Ops administrators`) or by changing the delegated administrator (managedBy) of the RODC account. It grants local admin rights on that RODC only.\n\n* The **Builtin\\Administrators** group of the domain is administrator on *every* DC.\n* **Server Operators** also has rights on all DCs.\n* The **Allowed RODC Password Replication Group** only allows password caching.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-020",
    "topic": "1.1",
    "type": "single",
    "difficulty": 3,
    "stem": "An RODC named RODC1 is deployed in a branch office. The allowed list of RODC1 contains a group named Branch1-Users. User1 and User2 are members of Branch1-Users and use computers named PC1 and PC2 in the branch. Cached domain logons are disabled on all branch computers by Group Policy. During a WAN outage, User1 and User2 cannot sign in to PC1 and PC2. The exhibit shows output captured before the outage. You need to ensure that the users can sign in during future WAN outages. What should you do?",
    "exhibit": "PS C:\\> Get-ADDomainControllerPasswordReplicationPolicyUsage -Identity RODC1 -RevealedAccounts |\n          Format-Table Name, ObjectClass\n\nName          ObjectClass\n----          -----------\nkrbtgt_29184  user\nRODC1         computer\nUser1         user\nUser2         user",
    "options": [
      "Add the branch computer accounts to the allowed list of RODC1 and prepopulate their passwords.",
      "Remove the Denied RODC Password Replication Group from the denied list of RODC1.",
      "Enable universal group membership caching for the branch site.",
      "Add User1 and User2 to the Allowed RODC Password Replication Group."
    ],
    "answer": [
      0
    ],
    "explanation": "The revealed list shows that the **user** passwords are cached, but the **computer** accounts PC1 and PC2 are not. A domain sign-in requires the workstation's secure channel too, so the RODC needs the computers' secrets as well. Allow a group containing the branch computers and prepopulate them (`repadmin /rodcpwdrepl` or *Prepopulate Passwords*).\n\n* User1 and User2 are already cached; adding them elsewhere changes nothing.\n* UGMC addresses universal group lookups against a GC, not missing computer secrets.\n* Removing the Denied group from the denied list would expose privileged accounts and doesn't affect PC1/PC2.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-021",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "A user named Admin1 is a member of the Domain Admins group and the Branch1-Users group. Branch1-Users is in the allowed list of an RODC named RODC1. The password replication policy of RODC1 otherwise uses the default settings. Admin1 has authenticated through RODC1 many times. During a WAN outage, Admin1 attempts to sign in to a branch computer named PC5 on which Admin1 has never signed in before. The password of PC5 is cached on RODC1. What happens?",
    "options": [
      "The sign-in fails because the password of Admin1 is never cached on RODC1; membership in the denied list takes precedence.",
      "The sign-in succeeds because Admin1 is in the allowed list through Branch1-Users.",
      "The sign-in succeeds because the passwords of Domain Admins members are always cached on RODCs.",
      "The sign-in succeeds only if an administrator previously prepopulated the password of Admin1."
    ],
    "answer": [
      0
    ],
    "explanation": "**Domain Admins** is a member of the **Denied RODC Password Replication Group**, which is on every RODC's denied list by default — and **deny wins** over allow. RODC1 never caches Admin1's password, so it can't authenticate Admin1 without a writable DC (and PC5 holds no cached logon for Admin1 to fall back on).\n\n* Allowed-list membership is overridden by the denied list.\n* Privileged accounts are specifically *never* cached.\n* Prepopulation fails for accounts the policy denies.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-022",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "An RODC named RODC1 was stolen from a branch office. You need to ensure that any credentials cached on RODC1 cannot be used to access resources. The solution must minimise the impact on users who never authenticated through RODC1. What should you do?",
    "options": [
      "Reset the passwords of all user accounts in the domain.",
      "Remove the RODC1 server object from the branch site in Active Directory Sites and Services.",
      "Reset the password of the domain-wide krbtgt account twice.",
      "Delete the RODC1 computer account and select the options to reset the passwords of the user accounts and computer accounts that were cached on RODC1."
    ],
    "answer": [
      3
    ],
    "explanation": "When you delete an RODC's account in the *Domain Controllers* OU, the wizard offers to **reset passwords of the cached user and computer accounts** (and export the list). That limits the response to exactly the revealed accounts, and deleting the account also removes the RODC's own `krbtgt_NNNNN`, invalidating tickets it issued.\n\n* The domain **krbtgt** key was never on the RODC — each RODC has its own krbtgt account.\n* Resetting every password affects users who were never exposed.\n* Removing the server object from a site doesn't invalidate the stolen secrets.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-023",
    "topic": "1.1",
    "type": "fill",
    "difficulty": 2,
    "stem": "You need to list the accounts whose passwords are currently stored on an RODC named RODC1 by using PowerShell. Which cmdlet should you run? (Enter the cmdlet name only.)",
    "answer": [
      "Get-ADDomainControllerPasswordReplicationPolicyUsage",
      "Get-ADDomainControllerPasswordReplicationPolicyUsage -RevealedAccounts",
      "Get-ADDomainControllerPasswordReplicationPolicyUsage -Identity RODC1 -RevealedAccounts",
      "Get-ADDomainControllerPasswordReplicationPolicyUsage RODC1 -RevealedAccounts"
    ],
    "explanation": "`Get-ADDomainControllerPasswordReplicationPolicyUsage -Identity RODC1 -RevealedAccounts` returns the **revealed list** (accounts with cached passwords); `-AuthenticatedAccounts` returns accounts that have authenticated through the RODC. `Get-ADDomainControllerPasswordReplicationPolicy` (without *Usage*) shows the allowed and denied **policy** lists instead.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-024",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 2,
    "stem": "You deploy an RODC named RODC1 without modifying the default password replication policy. Which two groups are on the denied list of RODC1 by default? (Choose two.)",
    "options": [
      "Domain Users",
      "Domain Computers",
      "Allowed RODC Password Replication Group",
      "Backup Operators",
      "Remote Desktop Users",
      "Account Operators"
    ],
    "answer": [
      3,
      5
    ],
    "explanation": "A new RODC denies **Administrators, Server Operators, Backup Operators, Account Operators** and the **Denied RODC Password Replication Group**, and allows only the (initially empty) **Allowed RODC Password Replication Group**.\n\n* Domain Users, Domain Computers and Remote Desktop Users are on neither list — they're implicitly not cached.\n* The Allowed RODC Password Replication Group is on the **allowed** list.",
    "lesson": "1.1-rodc"
  },
  {
    "id": "d1-025",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network contains an AD DS forest named contoso.com that has a single domain. The exhibit shows the operations master role holders. DC1 failed and cannot be recovered. You need to install an application that extends the schema as soon as possible. Which command should you run?",
    "exhibit": "C:\\> netdom query fsmo\nSchema master               DC1.contoso.com\nDomain naming master        DC1.contoso.com\nPDC                         DC2.contoso.com\nRID pool manager            DC2.contoso.com\nInfrastructure master       DC2.contoso.com\nThe command completed successfully.",
    "options": [
      "Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole SchemaMaster -Force",
      "ntdsutil roles connections \"connect to server DC2\" quit \"transfer schema master\" quit quit",
      "Move-ADDirectoryServerOperationMasterRole -Identity DC1 -OperationMasterRole SchemaMaster -Force",
      "Move-ADDirectoryServerOperationMasterRole -Identity DC2 -OperationMasterRole SchemaMaster"
    ],
    "answer": [
      0
    ],
    "explanation": "DC1 is gone, so the schema master role must be **seized**. `Move-ADDirectoryServerOperationMasterRole` with `-Force` first tries a graceful transfer and then seizes; `-Identity` is the DC that will **receive** the role (DC2). Afterwards, DC1 must never return to the network with its old database — clean up its metadata (and seize the domain naming master too).\n\n* Without `-Force`, the cmdlet attempts a transfer, which fails because the current holder is offline.\n* `-Identity DC1` names the dead server as the target.\n* ntdsutil's `transfer` also needs the current holder online; you'd need `seize schema master`.",
    "lesson": "1.1-fsmo"
  },
  {
    "id": "d1-026",
    "topic": "1.1",
    "type": "multi",
    "difficulty": 3,
    "stem": "The contoso.com domain has three domain controllers, each in a different AD DS site. DC2 holds only the PDC emulator role and has been offline for two hours. All other domain controllers are healthy. Which two issues are most likely to be reported during this time? (Choose two.)",
    "options": [
      "Administrators cannot add a new child domain to the forest.",
      "The Group Policy Management Console reports that it cannot contact the PDC emulator when an administrator opens a GPO for editing.",
      "An application installation that extends the schema fails.",
      "Users who just changed their passwords receive incorrect-password errors when a different domain controller authenticates them.",
      "Administrators cannot create new user accounts."
    ],
    "answer": [
      1,
      3
    ],
    "explanation": "The PDC emulator receives password changes urgently and is consulted when another DC sees a bad password; without it, a new password works only on DCs it has already replicated to, which across sites can take until the next scheduled intersite replication. GPMC also targets the PDC emulator by default when editing GPOs, so it warns and asks for another DC.\n\n* User creation needs RIDs from the DC's existing pool; the RID master isn't affected, and pools last far longer than two hours.\n* Schema changes need the **schema master**.\n* Adding domains needs the **domain naming master**.",
    "lesson": "1.1-fsmo"
  },
  {
    "id": "d1-027",
    "topic": "1.1",
    "type": "single",
    "difficulty": 3,
    "stem": "Your network contains an AD DS forest named contoso.com that has two domains: contoso.com and emea.contoso.com. The AD Recycle Bin is not enabled. Users from contoso.com who were renamed months ago still appear with their old names in the membership of groups in emea.contoso.com. The exhibit shows the domain controllers of emea.contoso.com. You need to resolve the issue. The solution must not change which servers are global catalogs. What should you do?",
    "exhibit": "PS C:\\> Get-ADDomainController -Filter * -Server emea.contoso.com |\n          Format-Table Name, IsGlobalCatalog, OperationMasterRoles -AutoSize\n\nName IsGlobalCatalog OperationMasterRoles\n---- --------------- --------------------\nDC10            True {PDCEmulator, RIDMaster, InfrastructureMaster}\nDC11           False {}\nDC12            True {}",
    "options": [
      "Transfer the PDC emulator role to DC12.",
      "Run repadmin /syncall DC10 /AdeP.",
      "Transfer the RID master role to DC11.",
      "Transfer the infrastructure master role to DC11."
    ],
    "answer": [
      3
    ],
    "explanation": "The **infrastructure master** updates references to objects in other domains. On a **global catalog** it never sees stale data (it already holds every object), so it stops updating — unless every DC in the domain is a GC or the Recycle Bin is enabled, and neither is true here. Moving the role to **DC11**, the only non-GC, fixes it without changing GC placement.\n\n* The RID master and PDC emulator have nothing to do with cross-domain references.\n* Forcing replication doesn't help — the updates are never generated.",
    "lesson": "1.1-fsmo"
  },
  {
    "id": "d1-028",
    "topic": "1.1",
    "type": "match",
    "difficulty": 1,
    "stem": "Match each operations master role to the function that it performs.",
    "pairs": [
      [
        "Schema master",
        "Writes changes to the schema partition"
      ],
      [
        "Domain naming master",
        "Adds and removes domains and application partitions"
      ],
      [
        "RID master",
        "Allocates pools of relative identifiers to domain controllers"
      ],
      [
        "PDC emulator",
        "Acts as the root of the domain time hierarchy and receives urgent password changes"
      ],
      [
        "Infrastructure master",
        "Updates references to objects in other domains"
      ]
    ],
    "explanation": "Schema master and domain naming master are **forest-wide** (one per forest); RID master, PDC emulator and infrastructure master are **domain-wide** (one per domain). The forest-root domain's PDC emulator is also the top of the forest time hierarchy and should sync from a reliable external source.",
    "lesson": "1.1-fsmo"
  },
  {
    "id": "d1-029",
    "topic": "1.1",
    "type": "fill",
    "difficulty": 1,
    "stem": "You need to display the holders of all five operations master roles by running a single command from a built-in command-line tool (not PowerShell). What should you run?",
    "answer": [
      "netdom query fsmo",
      "netdom query fsmo /domain:contoso.com",
      "netdom.exe query fsmo"
    ],
    "explanation": "`netdom query fsmo` lists the schema master, domain naming master, PDC, RID pool manager and infrastructure master. In PowerShell, combine `Get-ADForest` (forest roles) and `Get-ADDomain` (domain roles).",
    "lesson": "1.1-fsmo"
  },
  {
    "id": "d1-030",
    "topic": "1.1",
    "type": "single",
    "difficulty": 2,
    "stem": "You transfer the PDC emulator role of the forest root domain contoso.com from DC1 to DC2. Several days later, users report Kerberos authentication failures, and domain member clocks are seven minutes behind the correct time. You run the command shown in the exhibit on DC2. You need DC2 to synchronise its time from time.windows.com. Which command should you run on DC2?",
    "exhibit": "C:\\> w32tm /query /source\nLocal CMOS Clock",
    "options": [
      "w32tm /config /manualpeerlist:\"time.windows.com,0x8\" /syncfromflags:manual /reliable:yes /update",
      "w32tm /config /syncfromflags:domhier /update",
      "w32tm /resync /rediscover",
      "net time \\\\DC1 /set /y"
    ],
    "answer": [
      0
    ],
    "explanation": "The PDC emulator of the **forest root domain** is the top of the AD time hierarchy and must be configured with an external source. `w32tm /config /manualpeerlist:... /syncfromflags:manual /reliable:yes /update` sets the peer, marks DC2 as a reliable time source and applies the change; then run `w32tm /resync`. (Set DC1 back to `/syncfromflags:domhier`.)\n\n* `/syncfromflags:domhier` makes a DC sync from the domain hierarchy — the forest-root PDC has nothing above it, which is why it fell back to the local clock.\n* `/resync /rediscover` only re-detects sources using the current (wrong) configuration.\n* `net time /set` copies the time once and doesn't configure a source.",
    "lesson": "1.1-fsmo"
  },
  {
    "id": "d1-031",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "You have two AD DS forests named contoso.com and fabrikam.com. Users in fabrikam.com must be able to access file servers in contoso.com. Users in contoso.com must not be able to access resources in fabrikam.com. You plan to create a one-way forest trust. How should you create the trust?",
    "options": [
      "Create a two-way trust and enable selective authentication in fabrikam.com.",
      "Create an incoming trust in contoso.com and an outgoing trust in fabrikam.com.",
      "Create an outgoing trust in contoso.com and an incoming trust in fabrikam.com.",
      "Create an outgoing trust in fabrikam.com only."
    ],
    "answer": [
      2
    ],
    "explanation": "The **resource** domain trusts the **account** domain. contoso.com holds the resources, so contoso.com trusts fabrikam.com: an **outgoing** trust on the contoso.com side and the matching **incoming** trust on the fabrikam.com side. Access flows opposite to the trust direction — fabrikam users into contoso.\n\n* The reversed directions would let contoso users into fabrikam.\n* A two-way trust gives contoso users a path into fabrikam (selective authentication only narrows which computers they can reach).\n* A trust needs both halves to work, and an outgoing trust from fabrikam points the wrong way anyway.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-032",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Your company has three AD DS forests named contoso.com, fabrikam.com and adatum.com. A two-way forest trust exists between contoso.com and fabrikam.com, and another two-way forest trust exists between fabrikam.com and adatum.com. Users in contoso.com report that they cannot access resources in adatum.com. You need to ensure that contoso.com users can access resources in adatum.com. What should you do?",
    "options": [
      "Create a shortcut trust between contoso.com and adatum.com.",
      "Enable selective authentication on both existing trusts.",
      "Enable SID history on the trust between fabrikam.com and adatum.com.",
      "Create a forest trust between contoso.com and adatum.com."
    ],
    "answer": [
      3
    ],
    "explanation": "A forest trust is transitive **between the two forests it joins** (every domain in one trusts every domain in the other), but it is **not** transitive to a third forest. contoso.com needs its own trust with adatum.com.\n\n* **Shortcut** trusts exist only between domains in the **same** forest.\n* Selective authentication restricts access; it can't create a path.\n* SID history affects which SIDs are accepted, not whether a trust path exists.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-033",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "A two-way forest trust exists between contoso.com and fabrikam.com. Members of FABRIKAM\\G-Proj must be able to access a share on a server named FS1 in contoso.com and must not be able to authenticate to any other server in contoso.com. NTFS and share permissions on FS1 already grant access to FABRIKAM\\G-Proj. Users in G-Proj receive the error: \"The computer you are signing into is protected by an authentication firewall.\" The exhibit shows the trust configuration in contoso.com. What should you do?",
    "exhibit": "PS C:\\> Get-ADTrust -Identity fabrikam.com |\n          Format-List Name, Direction, ForestTransitive, SelectiveAuthentication, SIDFilteringQuarantined\n\nName                    : fabrikam.com\nDirection               : BiDirectional\nForestTransitive        : True\nSelectiveAuthentication : True\nSIDFilteringQuarantined : False",
    "options": [
      "Grant FABRIKAM\\G-Proj the Allowed to Authenticate permission on the FS1 computer object in contoso.com.",
      "Disable SID filtering on the trust.",
      "Grant FABRIKAM\\G-Proj the Allowed to Authenticate permission on the contoso.com domain object.",
      "Change the authentication scope of the trust to forest-wide authentication."
    ],
    "answer": [
      0
    ],
    "explanation": "With **selective authentication**, users from the trusted forest can authenticate only to computers on which they hold the **Allowed to Authenticate** permission. Granting it on **FS1's computer object** opens FS1 alone; the \"authentication firewall\" error is exactly what selective authentication returns.\n\n* Granting it on the domain object (with inheritance) would let G-Proj authenticate to every computer in the domain.\n* SID filtering strips foreign SIDs from tokens; it isn't what blocks sign-in here, and disabling it weakens security.\n* Forest-wide authentication would let G-Proj authenticate to every server.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-034",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network contains an AD DS forest named contoso.com that contains the domains na.contoso.com, sales.na.contoso.com, eu.contoso.com and eng.eu.contoso.com. Users in sales.na.contoso.com frequently access servers in eng.eu.contoso.com, and authentication is slow. You need to minimise authentication latency for these users. What should you create?",
    "options": [
      "A shortcut trust between sales.na.contoso.com and eng.eu.contoso.com",
      "An external trust between sales.na.contoso.com and eng.eu.contoso.com",
      "A realm trust between sales.na.contoso.com and eng.eu.contoso.com",
      "A forest trust between sales.na.contoso.com and eng.eu.contoso.com"
    ],
    "answer": [
      0
    ],
    "explanation": "Within a forest every domain already trusts every other one through the parent-child chain, but Kerberos referrals must walk up to the root and back down. A **shortcut trust** between the two domains shortens that referral path.\n\n* External trusts are for domains in **other** forests.\n* Forest trusts can be created only between **forest root domains** of different forests.\n* Realm trusts connect to non-Windows Kerberos realms.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-035",
    "topic": "1.2",
    "type": "multi",
    "difficulty": 2,
    "stem": "You plan to create a two-way forest trust between the contoso.com and fabrikam.com forests. Each forest has its own DNS infrastructure. Which two requirements must be met? (Choose two.)",
    "options": [
      "The trust must be created between the forest root domains of the two forests.",
      "Selective authentication must be enabled on both sides before the trust can be created.",
      "DNS must be configured so that each forest can resolve the other forest's domain names, for example by using conditional forwarders.",
      "Both forests must be raised to the Windows Server 2025 forest functional level.",
      "Microsoft Entra Connect Sync must be deployed in both forests."
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "Forest trusts are created **between forest root domains**, and each side must be able to **resolve the other's names and SRV records** (conditional forwarders, stub zones or secondary zones).\n\n* Any functional level that Windows Server 2016 or later DCs support is high enough for a forest trust; 2025 isn't required.\n* Entra Connect Sync synchronises identities to Entra ID and has nothing to do with AD trusts.\n* Selective authentication is an optional authentication scope chosen during or after creation.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-036",
    "topic": "1.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each requirement to the trust type that you should create.",
    "pairs": [
      [
        "Linux servers in an MIT Kerberos realm must accept AD DS user accounts",
        "Realm trust"
      ],
      [
        "Users need access to one domain of a partner forest only, and the trust must not extend to other domains",
        "External trust"
      ],
      [
        "After a merger, users in every domain of two forests need access to resources in either forest",
        "Forest trust"
      ],
      [
        "Kerberos referrals between two child domains deep in the same forest must be faster",
        "Shortcut trust"
      ]
    ],
    "explanation": "**Realm** trusts connect to non-Windows Kerberos V5 realms. **External** trusts are non-transitive and link single domains across forests. **Forest** trusts link two forest roots and are transitive across all domains of both forests. **Shortcut** trusts shorten referral paths inside one forest.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-037",
    "topic": "1.2",
    "type": "single",
    "difficulty": 3,
    "stem": "You are migrating user accounts from fabrikam.com to contoso.com by using a migration tool that copies each original fabrikam.com SID into the sIDHistory attribute of the new contoso.com account. A two-way forest trust exists between the forests. Migrated users cannot access resources that remain in fabrikam.com and are secured by their old SIDs. You need to allow access during the migration. Which command should you run?",
    "options": [
      "netdom trust fabrikam.com /domain:contoso.com /selectiveauth:yes",
      "netdom trust fabrikam.com /domain:contoso.com /enablesidhistory:yes",
      "netdom trust fabrikam.com /domain:contoso.com /quarantine:yes",
      "netdom trust contoso.com /domain:fabrikam.com /enablesidhistory:yes"
    ],
    "answer": [
      1
    ],
    "explanation": "Forest trusts filter SIDs that don't belong to the trusted forest, which removes the old fabrikam SIDs from the migrated users' tokens. The **trusting** side — fabrikam.com, which holds the resources — must allow SID history from the **trusted** domain contoso.com: `netdom trust <trusting> /domain:<trusted> /enablesidhistory:yes`. Turn it off again when the migration ends.\n\n* Reversing the domains relaxes filtering in the wrong direction (for fabrikam users accessing contoso).\n* `/quarantine:yes` *enables* strict SID filtering (used on external trusts).\n* `/selectiveauth` controls which computers users can authenticate to.",
    "lesson": "1.2-trusts"
  },
  {
    "id": "d1-038",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "You create an AD DS site named Branch3 and deploy a domain controller named DC7 with the IP address 10.40.0.10 to the site. Client computers in Branch3 use addresses in 10.40.0.0/16. Users in Branch3 report that they are authenticated by domain controllers in the HQ site. The exhibit shows the subnet configuration. What should you do?",
    "exhibit": "PS C:\\> Get-ADReplicationSubnet -Filter * | Format-Table Name, Site -AutoSize\n\nName         Site\n----         ----\n10.10.0.0/16 CN=HQ,CN=Sites,CN=Configuration,DC=contoso,DC=com\n10.20.0.0/16 CN=Branch1,CN=Sites,CN=Configuration,DC=contoso,DC=com\n10.30.0.0/16 CN=Branch2,CN=Sites,CN=Configuration,DC=contoso,DC=com",
    "options": [
      "Create a subnet object for 10.40.0.0/16 and associate it with the Branch3 site.",
      "Enable universal group membership caching for the Branch3 site.",
      "Create a site link between Branch3 and HQ that has a cost of 1.",
      "Designate DC7 as a preferred bridgehead server."
    ],
    "answer": [
      0
    ],
    "explanation": "DC Locator maps a client's IP address to a **subnet object** and then to a site. No subnet covers 10.40.0.0/16, so Branch3 clients have no site and receive any DC (and appear as `NO_CLIENT_SITE` in netlogon.log). Creating the subnet and associating it with Branch3 makes DC7 the preferred DC.\n\n* Site link cost affects replication topology, not client DC location for a known site.\n* UGMC reduces GC dependency during logon; it doesn't steer clients to DC7.\n* Bridgehead settings affect intersite replication only.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-039",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network has two AD DS sites named HQ and Branch1. New user accounts created at HQ can take up to three hours to appear on the domain controller in Branch1. The exhibit shows the site link configuration. You need to ensure that changes replicate from HQ to Branch1 within 15 minutes while keeping scheduled intersite replication. What should you do?",
    "exhibit": "PS C:\\> Get-ADReplicationSiteLink -Filter * |\n          Format-Table Name, Cost, ReplicationFrequencyInMinutes, SitesIncluded -AutoSize\n\nName              Cost ReplicationFrequencyInMinutes SitesIncluded\n----              ---- ----------------------------- -------------\nDEFAULTIPSITELINK  100                           180 {CN=HQ,CN=Sites,CN=Configuration,DC=contoso,DC=com, CN=Branch1,CN=Sites,CN=Configuration,DC=contoso,DC=com}",
    "options": [
      "Set-ADReplicationSiteLink -Identity DEFAULTIPSITELINK -ReplicationFrequencyInMinutes 15",
      "Set-ADReplicationSite -Identity Branch1 -UniversalGroupCachingEnabled $true",
      "Set-ADReplicationSiteLink -Identity DEFAULTIPSITELINK -Cost 15",
      "New-ADReplicationSiteLinkBridge -Name Bridge1 -SiteLinksIncluded DEFAULTIPSITELINK"
    ],
    "answer": [
      0
    ],
    "explanation": "Intersite replication follows the site link **interval** — 180 minutes by default, which explains the three-hour delay. Setting it to **15 minutes** (the minimum) keeps scheduled replication but runs it every quarter hour.\n\n* **Cost** only influences which path the KCC chooses.\n* UGMC changes logon behaviour, not replication frequency.\n* A site link bridge needs at least two site links and affects transitivity, not timing.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-040",
    "topic": "1.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the minimum replication interval, in minutes, that you can configure on an AD DS site link?",
    "answer": [
      "15",
      "15 minutes",
      "fifteen"
    ],
    "explanation": "Site link intervals are set in **15-minute** increments, with a minimum of 15 and a maximum of 10,080 minutes (one week). The default is 180 minutes. For faster-than-15-minute replication between sites, enable change notification on the link instead.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-041",
    "topic": "1.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Your WAN uses a hub-and-spoke design with sites named HQ, Branch1, Branch2 and Branch3. Firewalls allow domain controller traffic only between each branch and HQ, never directly between branches. Site links HQ-Branch1, HQ-Branch2 and HQ-Branch3 exist with default settings. Replication errors show domain controllers in Branch1 attempting to replicate directly with domain controllers in Branch2. You need to prevent the KCC from creating connections between branch sites. What should you do?",
    "options": [
      "Clear the Bridge all site links option on the IP inter-site transport.",
      "Create a site link bridge that contains all three site links.",
      "Enable change notification on all three site links.",
      "Set the cost of each site link to 1."
    ],
    "answer": [
      0
    ],
    "explanation": "**Bridge all site links** is enabled by default, which makes site links transitive: the KCC may build Branch1↔Branch2 connections (for example, when a hub bridgehead is unavailable). On a network that isn't fully routed, clear the option so that only explicitly defined links and bridges are used.\n\n* A bridge containing all three links recreates exactly the transitivity you need to remove.\n* Changing costs doesn't stop transitive paths from being considered.\n* Change notification changes timing, not topology.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-042",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "The HQ site contains two domain controllers named DC1 and DC2. Both are global catalog servers for contoso.com, the only domain. An administrator designated DC1 as the only preferred bridgehead server for the IP transport in HQ. DC1 is offline for maintenance for two days, and branch sites stop receiving updates even though DC2 is online. You need to ensure that intersite replication continues automatically if a bridgehead server fails. The solution must minimise administrative effort. What should you do?",
    "options": [
      "Remove DC1 as a preferred bridgehead server so that bridgeheads are selected automatically.",
      "Create manual connection objects from DC2 to each branch domain controller.",
      "Transfer the PDC emulator role to DC2.",
      "Run repadmin /kcc on DC2."
    ],
    "answer": [
      0
    ],
    "explanation": "Once any preferred bridgehead is defined in a site, the ISTG uses **only** preferred bridgeheads. With DC1 offline, nothing replicates. Removing the designation lets the ISTG choose among all eligible DCs and fail over automatically.\n\n* FSMO placement has no effect on bridgehead selection.\n* Running the KCC on DC2 still honours the preferred-bridgehead restriction.\n* Manual connection objects work but are static, high-effort and never cleaned up by the KCC.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-043",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Your forest contains three domains. A branch office site named Branch5 contains one domain controller, shown in the exhibit. The WAN link to the branch is heavily used. Users in Branch5 must be able to sign in when the WAN link is unavailable. You need to minimise replication traffic over the WAN link. What should you do?",
    "exhibit": "PS C:\\> Get-ADDomainController -Filter \"Site -eq 'Branch5'\" |\n          Format-Table Name, Domain, IsGlobalCatalog, IsReadOnly -AutoSize\n\nName Domain      IsGlobalCatalog IsReadOnly\n---- ------      --------------- ----------\nDC9  contoso.com           False      False",
    "options": [
      "Configure DC9 as a global catalog server.",
      "Enable change notification on the site link to Branch5.",
      "Replace DC9 with a read-only domain controller.",
      "Enable universal group membership caching for the Branch5 site."
    ],
    "answer": [
      3
    ],
    "explanation": "In a multi-domain forest a DC needs a **global catalog** to resolve universal group memberships at logon. **Universal group membership caching** on the Branch5 site lets DC9 cache memberships after each user's first logon (refreshed every 8 hours), so logons succeed when the WAN is down — without replicating a partial copy of every domain.\n\n* Making DC9 a GC also works but adds forest-wide GC replication over the busy link.\n* Change notification increases WAN traffic.\n* An RODC doesn't remove the GC dependency.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-044",
    "topic": "1.2",
    "type": "single",
    "difficulty": 3,
    "stem": "Your forest has three sites named HQ, Dallas and Branch6. Branch6 is a small office that has no domain controller, and its subnet is associated with the Branch6 site. The exhibit shows the site links; each link is named after the two sites it connects. Bridge all site links is enabled. Which site will normally provide the domain controllers that authenticate users in Branch6?",
    "exhibit": "PS C:\\> Get-ADReplicationSiteLink -Filter * | Format-Table Name, Cost, ReplicationFrequencyInMinutes -AutoSize\n\nName        Cost ReplicationFrequencyInMinutes\n----        ---- -----------------------------\nHQ-Branch6   200                            60\nDAL-Branch6  100                            60\nHQ-DAL       100                            15",
    "options": [
      "Dallas",
      "HQ",
      "Any site, chosen at random for each client",
      "None — users cannot sign in until a domain controller is placed in Branch6"
    ],
    "answer": [
      0
    ],
    "explanation": "With **automatic site coverage**, DCs in the site with the **lowest-cost** site link to a DC-less site register their SRV records for that site too. DAL-Branch6 (cost 100) is cheaper than HQ-Branch6 (cost 200), so Dallas DCs cover Branch6.\n\n* HQ would be used only if it had the lowest-cost connection.\n* Clients aren't randomly distributed when a covering site exists.\n* A site without a DC still gets service from a covering site.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-045",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Two AD DS sites named Chicago and Dallas are connected by a site link named CHI-DAL over a high-bandwidth link. You need changes made in Chicago to replicate to Dallas within seconds, similar to replication within a site. What should you do?",
    "options": [
      "Run Set-ADReplicationSiteLink -Identity CHI-DAL -ReplicationFrequencyInMinutes 0.",
      "Delete CHI-DAL and rely on Bridge all site links.",
      "Run Set-ADReplicationSiteLink -Identity CHI-DAL -Replace @{options=1}.",
      "Run Set-ADReplicationSite -Identity Dallas -UniversalGroupCachingEnabled $true."
    ],
    "answer": [
      2
    ],
    "explanation": "Setting bit 1 (**USE_NOTIFY**) in the site link's `options` attribute enables **change notification** between the sites, so bridgeheads notify partners shortly after a change instead of waiting for the schedule. Data is still compressed.\n\n* The interval can't be lower than 15 minutes; 0 is invalid.\n* UGMC is unrelated to replication speed.\n* Without a site link the sites have no replication path at all — bridging only chains existing links.",
    "lesson": "1.2-sites"
  },
  {
    "id": "d1-046",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "A domain controller named DC3 in the Dallas site stopped receiving updates from DC1 in HQ. You run the commands shown in the exhibit on DC3. The IP address 192.168.1.1 is the branch router, which forwards DNS queries to the internet service provider. What should you do to resolve the replication failure?",
    "exhibit": "C:\\> repadmin /showrepl DC3\nRepadmin: running command /showrepl against full DC DC3.contoso.com\nDallas\\DC3\nDSA Options: IS_GC\nSite Options: (none)\nDSA object GUID: 6f1c2a77-9d4e-4f39-8a2b-1d3c5e7f9a01\nDSA invocationID: b83e5d20-41c7-4e6a-9f12-3a7c6e0d8b45\n\n==== INBOUND NEIGHBORS ======================================\n\nDC=contoso,DC=com\n    HQ\\DC1 via RPC\n        DSA object GUID: 0a4e8b1c-2f3d-4c5b-9e6a-7d8c9b0a1f2e\n        Last attempt @ 2026-10-28 10:02:44 failed, result 8524 (0x214c):\n            The DSA operation is unable to proceed because of a DNS lookup failure.\n        37 consecutive failure(s).\n        Last success @ 2026-10-27 22:15:09.\n\nC:\\> ipconfig /all | findstr /c:\"DNS Servers\"\n   DNS Servers . . . . . . . . . . . : 192.168.1.1",
    "options": [
      "Open TCP port 135 and the dynamic RPC port range on DC1.",
      "Increase the tombstone lifetime of the forest.",
      "Configure DC3 to use a domain controller that hosts the contoso.com DNS zones as its preferred DNS server.",
      "Run repadmin /removelingeringobjects on DC3."
    ],
    "answer": [
      2
    ],
    "explanation": "Error **8524** means the destination couldn't resolve the source DC — specifically its `<DSA GUID>._msdcs.contoso.com` CNAME. DC3 sends queries to the branch router, which forwards to the ISP and knows nothing about the AD zones. Point DC3 at a DNS server that hosts the zones (another DC, with loopback as an alternate if DC3 runs DNS).\n\n* Blocked RPC ports produce **1722** (RPC server unavailable), not a DNS failure.\n* Lingering objects produce errors such as 8606 or event 1988.\n* The last success was yesterday — nowhere near the 180-day tombstone lifetime.",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-047",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "A host-based firewall policy was recently applied to some servers in contoso.com. DC5 is a branch domain controller whose only replication partner is DC1. You run the command shown in the exhibit. What should you check first?",
    "exhibit": "C:\\> repadmin /replsummary\nReplication Summary Start Time: 2026-10-28 11:20:03\n\nBeginning data collection for replication summary, this may take awhile:\n  ......\n\n\nSource DSA          largest delta    fails/total %%   error\n DC1                       07m:12s    0 /  10    0\n DC2                       05m:03s    0 /   5    0\n DC5                   04h:41m:09s    5 /   5  100  (1722) The RPC server is unavailable.\n\n\nDestination DSA     largest delta    fails/total %%   error\n DC1                   04h:41m:09s    5 /  10   50  (1722) The RPC server is unavailable.\n DC2                       07m:12s    0 /   5    0\n DC5                       06m:55s    0 /   5    0",
    "options": [
      "Verify that DC5 allows inbound RPC traffic (TCP 135 and the dynamic RPC port range) from DC1.",
      "Check whether DC5 has been disconnected for longer than the tombstone lifetime.",
      "Verify that DC5 can resolve DC1's CNAME record in the _msdcs.contoso.com zone.",
      "Reset the computer account password of DC1."
    ],
    "answer": [
      0
    ],
    "explanation": "Every replication attempt **from** DC5 (as a source) fails with **1722**, while DC5 itself still pulls from its partner successfully. DC1, the destination, can't reach the RPC endpoint mapper or the dynamic RPC ports on DC5 — consistent with a new inbound firewall rule on DC5.\n\n* DNS resolution problems show **8524**, and DC5's inbound replication is healthy anyway.\n* The largest delta is under five hours, far below the tombstone lifetime.\n* A secure channel problem on DC1 would also break DC1's other partnerships, which are healthy.",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-048",
    "topic": "1.2",
    "type": "fill",
    "difficulty": 1,
    "stem": "What is the default tombstone lifetime, in days, of an AD DS forest created on Windows Server 2025?",
    "answer": [
      "180",
      "180 days"
    ],
    "explanation": "Forests created on any currently supported Windows Server version have a tombstone lifetime of **180 days** (stored in the `tombstoneLifetime` attribute of `CN=Directory Service,CN=Windows NT,CN=Services` in the Configuration partition). DCs that don't replicate for longer than that risk lingering objects and stop replicating with error 8614.",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-049",
    "topic": "1.2",
    "type": "order",
    "difficulty": 2,
    "stem": "An administrator modifies a user account on DC1. DC1 has two replication partners in the same site. In which order do the following replication events occur for the first partner?",
    "items": [
      "DC1 writes the originating change and assigns it a new USN",
      "After 15 seconds, DC1 notifies its first replication partner",
      "The partner requests changes from DC1 above its high-watermark for DC1",
      "The partner applies the change and updates its up-to-dateness vector"
    ],
    "explanation": "Intrasite replication is **notify-then-pull**. The originating DC commits the change with a new USN, waits **15 seconds** (then 3 seconds between each further partner) and notifies. The partner **pulls** everything above its high-watermark for DC1, applies it, and records DC1's originating USN in its **up-to-dateness vector** so the same change isn't accepted again from another path.",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-050",
    "topic": "1.2",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each replication management task to the command that performs it.",
    "pairs": [
      [
        "Push all partitions from DC1 to its partners in every site",
        "repadmin /syncall DC1 /AdeP"
      ],
      [
        "Display a forest-wide summary of replication failures and largest deltas",
        "repadmin /replsummary"
      ],
      [
        "Show which DC originated the last change to each attribute of an object",
        "repadmin /showobjmeta"
      ],
      [
        "Force the KCC on a DC to recalculate the replication topology now",
        "repadmin /kcc"
      ],
      [
        "List replication failures for a DC by using PowerShell",
        "Get-ADReplicationFailure"
      ]
    ],
    "explanation": "`/syncall` with **A** (all partitions), **d** (DNs), **e** (enterprise — across sites) and **P** (push) forces outbound replication. `/replsummary` is the health overview. `/showobjmeta` shows per-attribute version, originating DC and time. `/kcc` triggers topology generation. `Get-ADReplicationFailure` is the PowerShell view of failures (with `-Target` and `-Scope`).",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-051",
    "topic": "1.2",
    "type": "single",
    "difficulty": 2,
    "stem": "Users authenticated by a domain controller named DC3 do not receive recent changes to a GPO named Cfg - Sales. You run the command shown in the exhibit against DC3. You need to check how many SYSVOL updates are pending from DC1 to DC3. Which cmdlet should you use?",
    "exhibit": "PS C:\\> Get-GPO -Name \"Cfg - Sales\" -Server DC3\n\nDisplayName      : Cfg - Sales\nDomainName       : contoso.com\nOwner            : CONTOSO\\Domain Admins\nId               : 5d3f1b2a-7c84-4e19-a0d6-2b9e8f4c1a37\nGpoStatus        : AllSettingsEnabled\nDescription      :\nCreationTime     : 10/2/2026 9:14:05 AM\nModificationTime : 10/28/2026 8:02:31 AM\nUserVersion      : AD Version: 7, SysVol Version: 4\nComputerVersion  : AD Version: 1, SysVol Version: 1\nWmiFilter        :",
    "options": [
      "dfsrmig /getglobalstate",
      "Get-ADReplicationQueueOperation -Server DC3",
      "Get-GPOReport -Name \"Cfg - Sales\" -ReportType Html -Server DC3",
      "Get-DfsrBacklog -GroupName \"Domain System Volume\" -FolderName \"SYSVOL Share\" -SourceComputerName DC1 -DestinationComputerName DC3"
    ],
    "answer": [
      3
    ],
    "explanation": "The GPO's **AD** version on DC3 is 7 but its **SYSVOL** version is 4: the Group Policy Container replicated, the template files didn't. SYSVOL replicates with **DFSR** in the built-in \"Domain System Volume\" group and \"SYSVOL Share\" folder, so `Get-DfsrBacklog` shows the pending file updates from DC1 to DC3.\n\n* `Get-ADReplicationQueueOperation` shows the **AD** replication queue, which is evidently fine.\n* `dfsrmig /getglobalstate` reports the FRS-to-DFSR migration state, not backlog.\n* `Get-GPOReport` shows the settings, not replication status.",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-052",
    "topic": "1.2",
    "type": "single",
    "difficulty": 3,
    "stem": "A domain controller named DC6 in a closed branch office was powered off for eight months and then powered on. The forest uses the default tombstone lifetime. DC6 logs the event shown in the exhibit. You need to return the branch to service with the least risk to the directory. What should you do?",
    "exhibit": "Log Name:      Directory Service\nSource:        Microsoft-Windows-ActiveDirectory_DomainService\nEvent ID:      2042\nTask Category: Replication\nLevel:         Error\nKeywords:      Classic\nUser:          ANONYMOUS LOGON\nComputer:      DC6.contoso.com\nDescription:\nIt has been too long since this machine last replicated with the named source\nmachine. The time between replications with this source has exceeded the\ntombstone lifetime. Replication has been stopped with this source.\nThe reason that replication is not allowed to continue is that the two\nmachine's views of deleted objects may now be different. The source machine\nmay still have copies of objects that have been deleted (and garbage collected)\non this machine. If they were allowed to replicate, the source machine might\nreturn objects which have already been deleted.\n\nTime of last successful replication:\n2026-02-21 14:03:11\nInvocation ID of source:\n5e2b7a90-c4d1-4b3e-8f6a-2d9c0e7b1a44\nName of source:\n0a4e8b1c-2f3d-4c5b-9e6a-7d8c9b0a1f2e._msdcs.contoso.com\nTombstone lifetime (days):\n180\n\nThe replication operation has failed.",
    "options": [
      "Set the Allow Replication With Divergent and Corrupt Partner registry value to 1 on DC6 permanently.",
      "Increase the tombstoneLifetime attribute to 365 days, and then restart replication.",
      "Force-remove AD DS from DC6, clean up its metadata, and then promote the server again.",
      "Perform an authoritative restore of the domain partition on DC6."
    ],
    "answer": [
      2
    ],
    "explanation": "Eight months exceeds the 180-day tombstone lifetime, so DC6 may hold **lingering objects** — objects deleted elsewhere whose tombstones have since been purged. Replication is blocked to protect the forest. The lowest-risk path is to **force-demote** DC6, clean up its metadata and re-promote it so it gets a fresh copy — the first option in the event's own *User Action* text (\"Demote or reinstall the machine(s) that were disconnected\").\n\nThe trade-off — losing any changes that originated on DC6 and never replicated — is negligible for a DC in a closed branch.\n\n* Permanently allowing divergent partners would let lingering objects replicate back into the domain.\n* Raising the TSL now can't recover tombstones that were already garbage-collected.\n* An authoritative restore would push DC6's stale data over newer changes.\n\n(Microsoft also documents a longer alternative — remove lingering objects with Lingering Object Liquidator or `repadmin /removelingeringobjects`, then re-enable replication — but it isn't among the options.)",
    "lesson": "1.2-replication"
  },
  {
    "id": "d1-053",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Your network contains an AD DS forest named contoso.com that has two domains: contoso.com and emea.contoso.com. A file server named FS1 is a member of contoso.com. Sales users in both domains need Modify permission on \\\\FS1\\Sales. You need to configure access by following Microsoft best practices. The solution must minimise administrative effort when sales staff change. What should you do?",
    "options": [
      "Create a global group in contoso.com, add the sales users from both domains to it, and grant the group Modify permission.",
      "Create a global group for sales users in each domain, add both global groups to a domain local group in contoso.com, and grant the domain local group Modify permission.",
      "Create a domain local group in emea.contoso.com, add the EMEA sales users to it, and grant the group Modify permission on FS1.",
      "Grant Modify permission directly to each sales user account."
    ],
    "answer": [
      1
    ],
    "explanation": "This is **AGDLP**: accounts → **global** groups in their own domain → a **domain local** group in the resource's domain → permission. Membership changes happen in the global groups; the ACL never changes.\n\n* A domain local group from emea.contoso.com can only be used for permissions in **emea.contoso.com**.\n* A global group can only contain accounts from **its own** domain.\n* Per-user ACL entries are the opposite of minimal effort.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-054",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "A global security group named G-Sales is used in ACLs on several file servers. You need to change G-Sales to a domain local group without losing any of its permissions. G-Sales is not a member of any other group. What should you do?",
    "options": [
      "Run Set-ADGroup -Identity G-Sales -GroupScope DomainLocal.",
      "Convert G-Sales to a distribution group, and then convert it to a domain local group.",
      "Delete G-Sales and create a domain local group named G-Sales with the same members.",
      "Convert G-Sales to a universal group, and then convert it to a domain local group."
    ],
    "answer": [
      3
    ],
    "explanation": "A group can't be converted directly between **global** and **domain local**. Convert global → **universal** (allowed because G-Sales isn't nested in another global group), then universal → domain local (allowed because it isn't a member of another universal group). The SID doesn't change, so ACLs keep working.\n\n* `Set-ADGroup -GroupScope DomainLocal` on a global group fails — the direct conversion isn't permitted.\n* Changing the group **type** (security/distribution) doesn't change scope, and distribution groups lose their use in ACLs.\n* A new group gets a **new SID**, so every existing permission would be lost.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-055",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "You need to convert a global group named G-Sales to a universal group. The conversion fails. You run the command shown in the exhibit. What should you do first?",
    "exhibit": "PS C:\\> Get-ADPrincipalGroupMembership -Identity G-Sales | Format-Table Name, GroupScope -AutoSize\n\nName       GroupScope\n----       ----------\nG-AllStaff Global\nU-Corp     Universal",
    "options": [
      "Remove all user accounts from G-Sales.",
      "Convert G-AllStaff to a domain local group.",
      "Remove G-Sales from G-AllStaff.",
      "Remove G-Sales from U-Corp."
    ],
    "answer": [
      2
    ],
    "explanation": "A global group can become universal only if it is **not a member of another global group** — a universal group can't be nested in a global group. G-Sales belongs to the global group G-AllStaff, so remove it from there first.\n\n* Membership in the universal group U-Corp is fine for a universal group.\n* User members don't block global → universal conversion.\n* A global group can't be converted directly to domain local.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-056",
    "topic": "1.3",
    "type": "fill",
    "difficulty": 1,
    "stem": "You need to find all user accounts in contoso.com that have not signed in for 90 days by using a single ActiveDirectory module cmdlet with the -AccountInactive parameter. Which cmdlet should you use? (Enter the cmdlet name only.)",
    "answer": [
      "Search-ADAccount",
      "Search-ADAccount -AccountInactive",
      "Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly",
      "Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00"
    ],
    "explanation": "`Search-ADAccount -AccountInactive -TimeSpan 90.00:00:00 -UsersOnly` finds accounts whose replicated `lastLogonTimestamp` is older than 90 days (accurate to within about 9–14 days, which is fine for this report). Write the TimeSpan as `90.00:00:00` (or `(New-TimeSpan -Days 90)`): a bare `90` is converted to 90 *ticks*, not 90 days. The same cmdlet also supports `-LockedOut`, `-AccountDisabled`, `-AccountExpired`, `-AccountExpiring` and `-PasswordNeverExpires`.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-057",
    "topic": "1.3",
    "type": "single",
    "difficulty": 1,
    "stem": "You add a user named User1 to a group named G-Finance that has Modify permission on \\\\FS2\\Finance. Ten minutes later, User1 still receives an Access denied error when opening the share. AD DS replication is healthy. What should you instruct User1 to do?",
    "options": [
      "Sign out of Windows and sign in again.",
      "Run gpupdate /force.",
      "Run ipconfig /flushdns.",
      "Restart the Server service on FS2."
    ],
    "answer": [
      0
    ],
    "explanation": "Group memberships are captured in the user's **access token** (and Kerberos tickets) at sign-in. User1's existing token doesn't include G-Finance; signing out and in (or purging tickets with `klist purge` and reconnecting) issues a new token with the group SID.\n\n* Group Policy refresh doesn't rebuild the user's logon token.\n* Restarting a service on FS2 disrupts everyone and doesn't change User1's token.\n* DNS caching is unrelated to authorisation.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-058",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Several users are locked out. You run the command shown in the exhibit. You need to unlock only the locked accounts in the Sales OU by running a single command. Which command should you run?",
    "exhibit": "PS C:\\> Search-ADAccount -LockedOut -UsersOnly | Format-Table Name, SamAccountName, DistinguishedName -AutoSize\n\nName     SamAccountName DistinguishedName\n----     -------------- -----------------\nAna Ruiz aruiz          CN=Ana Ruiz,OU=Sales,DC=contoso,DC=com\nBen Chen bchen          CN=Ben Chen,OU=Sales,DC=contoso,DC=com\nKai Ito  kito           CN=Kai Ito,OU=IT,DC=contoso,DC=com",
    "options": [
      "Search-ADAccount -LockedOut -UsersOnly | Unlock-ADAccount",
      "Search-ADAccount -LockedOut -UsersOnly -SearchBase \"OU=Sales,DC=contoso,DC=com\" | Unlock-ADAccount",
      "Search-ADAccount -AccountDisabled -SearchBase \"OU=Sales,DC=contoso,DC=com\" | Unlock-ADAccount",
      "Get-ADUser -Filter * -SearchBase \"OU=Sales,DC=contoso,DC=com\" | Enable-ADAccount"
    ],
    "answer": [
      1
    ],
    "explanation": "`Search-ADAccount -LockedOut` scoped with `-SearchBase` to the Sales OU returns Ana Ruiz and Ben Chen, and piping to `Unlock-ADAccount` unlocks them.\n\n* `Enable-ADAccount` clears the **disabled** flag; it doesn't unlock.\n* Without `-SearchBase`, Kai Ito in the IT OU is also unlocked.\n* `-AccountDisabled` finds disabled accounts, not locked ones.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-059",
    "topic": "1.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "Your forest contains the domains contoso.com and emea.contoso.com, and has a forest trust with fabrikam.com. Which two objects can be members of a global group in contoso.com? (Choose two.)",
    "options": [
      "A global group from contoso.com",
      "A domain local group from contoso.com",
      "A user account from contoso.com",
      "A universal group from contoso.com",
      "A user account from emea.contoso.com",
      "A global group from fabrikam.com"
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "A **global** group can contain only accounts and other **global groups from its own domain**.\n\n* Accounts from other domains — even in the same forest — need a universal or domain local group.\n* Universal and domain local groups can't be nested inside a global group.\n* Principals from another forest can only be added to **domain local** groups.",
    "lesson": "1.3-users-groups"
  },
  {
    "id": "d1-060",
    "topic": "1.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "A two-way forest trust exists between contoso.com and fabrikam.com. You create a domain local group named DL-Eng-Read in contoso.com and grant it Read permission on \\\\FS1\\Eng. Which two objects can you add directly as members of DL-Eng-Read? (Choose two.)",
    "options": [
      "The global group FABRIKAM\\G-Engineers",
      "A domain local group from emea.contoso.com, a child domain of contoso.com",
      "The user account FABRIKAM\\User5",
      "A domain local group from fabrikam.com",
      "A universal group in contoso.com that contains FABRIKAM\\User5"
    ],
    "answer": [
      0,
      2
    ],
    "explanation": "A **domain local** group can contain users, computers, global groups and universal groups from any trusted domain or forest — fabrikam.com principals are added as **foreign security principals**.\n\n* Domain local groups can contain other domain local groups only from the **same** domain, so neither a fabrikam.com nor an emea.contoso.com domain local group qualifies.\n* A contoso.com universal group can't contain FABRIKAM\\User5 in the first place: universal groups accept members only from their own forest.",
    "lesson": "1.3-multi-domain-forest"
  },
  {
    "id": "d1-061",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "A forest trust exists between contoso.com and fabrikam.com. The SID of the fabrikam.com domain is S-1-5-21-3827126516-2390851224-1180713093. In Active Directory Users and Computers, the membership of DL-Eng-Read shows FABRIKAM\\G-Engineers by name, but another entry is displayed only as a SID ending in -1311. You run the command shown in the exhibit. What is the most likely cause of the SID-only entry?",
    "exhibit": "PS C:\\> (Get-ADGroup DL-Eng-Read -Properties Member).Member\nCN=G-Eng-Local,OU=Groups,DC=contoso,DC=com\nCN=S-1-5-21-3827126516-2390851224-1180713093-1107,CN=ForeignSecurityPrincipals,DC=contoso,DC=com\nCN=S-1-5-21-3827126516-2390851224-1180713093-1311,CN=ForeignSecurityPrincipals,DC=contoso,DC=com",
    "options": [
      "SID filtering on the forest trust is blocking the account with RID 1311.",
      "The infrastructure master of contoso.com is hosted on a global catalog server.",
      "The fabrikam.com account with RID 1311 was deleted, leaving an orphaned foreign security principal.",
      "The account with RID 1311 has a value in its sIDHistory attribute."
    ],
    "answer": [
      2
    ],
    "explanation": "Members from another forest are stored as **foreign security principals** named by SID in `CN=ForeignSecurityPrincipals`. ADUC resolves each SID across the trust to show a name; -1107 resolves (G-Engineers) but -1311 doesn't, which typically means the fabrikam.com account was **deleted** and its FSP is now orphaned.\n\n* SID filtering removes SIDs from tokens during authentication; it doesn't affect name lookup of an FSP.\n* sIDHistory on the account wouldn't stop its primary SID from resolving.\n* The infrastructure master maintains references to objects in other domains of the **same** forest, not FSPs.",
    "lesson": "1.3-multi-domain-forest"
  },
  {
    "id": "d1-062",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "Users in contoso.com sign in with UPNs such as user@contoso.com. You need to allow administrators to assign the UPN suffix contoso.us to users in any domain of the forest. Which command should you run?",
    "options": [
      "Set-ADForest -Identity contoso.com -UPNSuffixes @{Add='contoso.us'}",
      "Set-ADDomain -Identity contoso.com -AllowedDNSSuffixes @{Add='contoso.us'}",
      "Set-ADForest -Identity contoso.com -SPNSuffixes @{Add='contoso.us'}",
      "Set-ADUser -Filter * -UserPrincipalName '*@contoso.us'"
    ],
    "answer": [
      0
    ],
    "explanation": "Alternative **UPN suffixes** are a forest-wide attribute (`uPNSuffixes` on the Partitions container), set with `Set-ADForest -UPNSuffixes` or in **AD Domains and Trusts** › Properties. After adding the suffix you can change users' UPNs.\n\n* `-AllowedDNSSuffixes` on `Set-ADDomain` controls allowed DNS suffixes for computer names.\n* `-SPNSuffixes` adds suffixes for service principal names.\n* `Set-ADUser` has no `-Filter` parameter, and the suffix must exist before it's assigned.",
    "lesson": "1.3-multi-domain-forest"
  },
  {
    "id": "d1-063",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "The contoso.com forest contains the domains contoso.com and emea.contoso.com. DC1 is the RID master of contoso.com, and DC20 is the RID master of emea.contoso.com. You need to move a user named Ana Ruiz to emea.contoso.com while preserving her access to resources secured with her current SID. You have already removed her from all global groups in contoso.com. You run the command shown in the exhibit. What should you do?",
    "exhibit": "PS C:\\> Move-ADObject -Identity \"CN=Ana Ruiz,OU=Sales,DC=contoso,DC=com\" `\n          -TargetPath \"OU=Sales,DC=emea,DC=contoso,DC=com\" `\n          -Server DC2.contoso.com -TargetServer DC21.emea.contoso.com\nMove-ADObject : The requested operation could not be performed because the directory service is not the master for that type of operation",
    "options": [
      "Transfer the PDC emulator role of emea.contoso.com to DC21, and then run the command again.",
      "Add -Partition \"DC=emea,DC=contoso,DC=com\" to the command.",
      "Run the command again and specify -Server DC1.contoso.com and -TargetServer DC20.emea.contoso.com.",
      "Export the user with ldifde and import the file into emea.contoso.com."
    ],
    "answer": [
      2
    ],
    "explanation": "A cross-domain move with `Move-ADObject -TargetServer` must be performed against the **RID master** in both the source and target domains; the error says the DCs used aren't the operation masters. Re-run it against DC1 and DC20. The moved account gets a new SID and keeps its old SID in **sIDHistory**, preserving access. (A principal that is still an explicit member of global groups in the source domain can't be moved across domains, which is why those memberships were removed first.)\n\n* The PDC emulator isn't involved in cross-domain moves.\n* An ldifde export/import creates a brand-new account with a new SID and no SID history.\n* `-Partition` doesn't change which DCs perform the move.",
    "lesson": "1.3-multi-domain-forest"
  },
  {
    "id": "d1-064",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "The contoso.com forest contains the domains contoso.com, emea.contoso.com and apac.contoso.com. DC1 is a global catalog server in contoso.com. You need to find every user whose surname is Ruiz in any domain of the forest by running a single query against DC1. Which command should you run?",
    "options": [
      "Get-ADUser -Filter 'Surname -eq \"Ruiz\"' -Server DC1.contoso.com:636",
      "Get-ADUser -Filter 'Surname -eq \"Ruiz\"' -Server DC1.contoso.com -SearchScope OneLevel",
      "Get-ADUser -Filter 'Surname -eq \"Ruiz\"' -Server DC1.contoso.com:389",
      "Get-ADUser -Filter 'Surname -eq \"Ruiz\"' -Server DC1.contoso.com:3268"
    ],
    "answer": [
      3
    ],
    "explanation": "Port **3268** is the **global catalog** LDAP port. A GC holds a partial replica of every object in the forest (surname is in the partial attribute set), so a subtree search from `DC=contoso,DC=com` on 3268 returns users from the child domains beneath it.\n\n* 636 is LDAPS for the **domain** partition only.\n* 389 (the default) also searches only DC1's own domain.\n* `-SearchScope OneLevel` narrows the search to direct children of the base.",
    "lesson": "1.3-multi-domain-forest"
  },
  {
    "id": "d1-065",
    "topic": "1.3",
    "type": "single",
    "difficulty": 2,
    "stem": "A group managed service account (gMSA) named gmsaWeb runs an application on WEB1 and WEB2. Thirty minutes ago you added WEB3 to the G-WebFarm group. You run the commands shown in the exhibit. You need gmsaWeb to work on WEB3. What should you do?",
    "exhibit": "PS C:\\> Get-ADServiceAccount gmsaWeb -Properties PrincipalsAllowedToRetrieveManagedPassword |\n          Select-Object -ExpandProperty PrincipalsAllowedToRetrieveManagedPassword\nCN=G-WebFarm,OU=Groups,DC=contoso,DC=com\n\nPS C:\\> Get-ADGroupMember G-WebFarm | Select-Object Name\n\nName\n----\nWEB1\nWEB2\nWEB3\n\n# Run on WEB3\nPS C:\\> Test-ADServiceAccount gmsaWeb\nFalse",
    "options": [
      "Run Reset-ADServiceAccountPassword gmsaWeb on WEB1.",
      "Restart WEB3.",
      "Run Set-ADServiceAccount gmsaWeb -PrincipalsAllowedToRetrieveManagedPassword WEB3$.",
      "Run Add-KdsRootKey -EffectiveImmediately."
    ],
    "answer": [
      1
    ],
    "explanation": "WEB3 is a member of G-WebFarm, but a computer's group memberships are in its Kerberos ticket from boot time. Until WEB3 **restarts** (or its system tickets are purged with `klist -li 0x3e7 purge`), it can't prove membership, so `Test-ADServiceAccount` returns False.\n\n* `Set-ADServiceAccount -PrincipalsAllowedToRetrieveManagedPassword WEB3$` **replaces** the list, breaking WEB1 and WEB2.\n* The KDS root key clearly exists — the account already works on WEB1 and WEB2.\n* `Reset-ADServiceAccountPassword` applies to standalone MSAs and doesn't grant retrieval rights.",
    "lesson": "1.3-service-accounts"
  },
  {
    "id": "d1-066",
    "topic": "1.3",
    "type": "order",
    "difficulty": 2,
    "stem": "The contoso.com domain has never used managed service accounts. Web servers WEB1 and WEB2 are already members of a group named G-AppServers and have been restarted since being added. You need to configure an IIS application pool on both servers to run as a gMSA named gmsaApp. In which order should you perform the actions?",
    "items": [
      "Create a KDS root key by running Add-KdsRootKey",
      "Run New-ADServiceAccount gmsaApp with -DNSHostName gmsaApp.contoso.com and -PrincipalsAllowedToRetrieveManagedPassword G-AppServers",
      "Run Install-ADServiceAccount gmsaApp on each web server",
      "Set the application pool identity to CONTOSO\\gmsaApp$ with a blank password"
    ],
    "explanation": "gMSA passwords derive from the **KDS root key**, so it must exist (and become effective — DCs wait up to 10 hours after creation) before the account is created. The account must exist before servers can install it, and `Install-ADServiceAccount` (verified with `Test-ADServiceAccount`) should succeed before you point the application pool at `CONTOSO\\gmsaApp$`.",
    "lesson": "1.3-service-accounts"
  },
  {
    "id": "d1-067",
    "topic": "1.3",
    "type": "single",
    "difficulty": 1,
    "stem": "All domain controllers in contoso.com run Windows Server 2022. You need to run a service on four load-balanced servers named WEB1 to WEB4 by using the same domain identity. The password must change automatically, and no administrator must know it. Which type of account should you use?",
    "options": [
      "A standalone managed service account (sMSA)",
      "A group managed service account (gMSA)",
      "A domain user account with the Password never expires option",
      "A virtual account"
    ],
    "answer": [
      1
    ],
    "explanation": "A **gMSA** can be used by multiple hosts listed in `PrincipalsAllowedToRetrieveManagedPassword`, and its password is generated and rotated by the domain (every 30 days by default).\n\n* An **sMSA** is restricted to a single computer.\n* A **virtual account** is local to each server and uses the computer account on the network, so four servers wouldn't share an identity.\n* A user account with a static password is exactly what managed accounts replace.",
    "lesson": "1.3-service-accounts"
  },
  {
    "id": "d1-068",
    "topic": "1.3",
    "type": "single",
    "difficulty": 3,
    "stem": "A server named SQL1 runs Windows Server 2025. Its SQL Server service runs as a domain user account named svc-sql that has an SPN and permissions on many resources. The exhibit shows the domain controllers in contoso.com, and a KDS root key exists. You need to replace svc-sql with a managed account so that existing permissions granted to svc-sql keep working without being reassigned, and the svc-sql password can no longer be used to authenticate. What should you do?",
    "exhibit": "PS C:\\> Get-ADDomainController -Filter * | Format-Table Name, OperatingSystem -AutoSize\n\nName OperatingSystem\n---- ---------------\nDC1  Windows Server 2022 Datacenter\nDC2  Windows Server 2022 Datacenter\nDC3  Windows Server 2025 Datacenter",
    "options": [
      "Create a standalone MSA by using -RestrictToSingleComputer, and then add the SID of svc-sql to its sIDHistory attribute.",
      "Raise the domain functional level to Windows Server 2025, and then convert svc-sql to a gMSA.",
      "Create a delegated managed service account (dMSA), run Start-ADServiceAccountMigration with -SupersededAccount svc-sql, restart the service, and then run Complete-ADServiceAccountMigration.",
      "Create a gMSA, grant it the same permissions as svc-sql, configure the service to use the gMSA, and disable svc-sql."
    ],
    "answer": [
      2
    ],
    "explanation": "A **dMSA** can **supersede** an existing service account: during migration it inherits the old account's access, and after `Complete-ADServiceAccountMigration` the old account's password no longer works. Completing the migration disables svc-sql and moves its SPNs and delegation settings to the dMSA (Microsoft recommends leaving the migration in the started state for at least two ticket lifetimes, about 14 days, before completing it). It needs at least one **Windows Server 2025 DC** (DC3), a KDS root key and a dMSA-capable host (SQL1 runs 2025) — not a 2025 functional level. Don't delete svc-sql afterwards.\n\n* The gMSA option requires reassigning every permission, which the requirements forbid.\n* You can't write sIDHistory onto an sMSA to impersonate another account.\n* The domain level can't be raised to 2025 while DC1 and DC2 run 2022, and user accounts can't be \"converted\" to gMSAs.",
    "lesson": "1.3-service-accounts"
  },
  {
    "id": "d1-069",
    "topic": "1.3",
    "type": "multi",
    "difficulty": 2,
    "stem": "You plan to create delegated managed service accounts (dMSAs) in contoso.com. Which two prerequisites must be met? (Choose two.)",
    "options": [
      "A Key Distribution Service (KDS) root key",
      "The AD Recycle Bin enabled in the forest",
      "The legacy service account first converted to a gMSA",
      "Domain and forest functional levels of Windows Server 2025",
      "At least one domain controller that runs Windows Server 2025 and can be discovered by the servers that use the dMSA"
    ],
    "answer": [
      0,
      4
    ],
    "explanation": "dMSAs need a **Windows Server 2025 DC** that clients can find (extending the schema alone isn't enough) and a **KDS root key**, which derives their managed keys. Clients also need dMSA logons enabled by policy.\n\n* No specific functional level is required.\n* The Recycle Bin is unrelated.\n* gMSAs (and sMSAs) **can't** be migrated to dMSAs; a dMSA supersedes a traditional (user) service account.",
    "lesson": "1.3-service-accounts"
  },
  {
    "id": "d1-070",
    "topic": "1.3",
    "type": "fill",
    "difficulty": 1,
    "stem": "After installing a gMSA on a server, you need to verify that the server can retrieve the gMSA password. Which cmdlet should you run on the server? (Enter the cmdlet name only.)",
    "answer": [
      "Test-ADServiceAccount",
      "Test-ADServiceAccount gmsaWeb",
      "Test-ADServiceAccount -Identity gmsaWeb"
    ],
    "explanation": "`Test-ADServiceAccount <name>` returns **True** when the local computer can retrieve the managed password (and False otherwise — usually because the computer isn't allowed to retrieve it or hasn't refreshed its group membership). `Install-ADServiceAccount` installs it; `Get-ADServiceAccount` reads its properties.",
    "lesson": "1.3-service-accounts"
  },
  {
    "id": "d1-071",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "The exhibit shows the GPO links that affect user accounts in the Sales OU of contoso.com. Both GPOs configure the same screen saver timeout setting. Which screen saver timeout applies to users in the Sales OU?",
    "exhibit": "GPO links affecting users in OU=Sales,DC=contoso,DC=com\n\nLinked at     GPO            Link order  Enforced  Screen saver timeout\n------------  -------------  ----------  --------  --------------------\ncontoso.com   Domain Std     1           Yes       900 seconds\nOU=Sales      Sales Desktop  1           No        300 seconds\n\nOU=Sales: Block Inheritance = Yes",
    "options": [
      "300 seconds at first sign-in, then 900 seconds after the next background refresh",
      "900 seconds",
      "No timeout, because Block Inheritance and the conflict cancel each other out",
      "300 seconds"
    ],
    "answer": [
      1
    ],
    "explanation": "**Block Inheritance** on the Sales OU would normally stop Domain Std from applying, but an **Enforced** link ignores Block Inheritance **and** wins conflicts with GPOs linked lower in the hierarchy. The enforced domain value of 900 seconds applies.\n\n* 300 seconds would win only if the domain link weren't enforced.\n* Conflicting settings never cancel out — one GPO always wins.\n* Precedence doesn't change between foreground and background processing.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-072",
    "topic": "1.4",
    "type": "single",
    "difficulty": 1,
    "stem": "Administrators of an OU named Lab enabled Block Inheritance on the OU. You need a GPO named Sec - Audit, which is linked to the contoso.com domain, to apply to computers in the Lab OU. You must not modify the settings of the Lab OU. What should you do?",
    "options": [
      "Remove Block Inheritance from the Lab OU.",
      "Change the link order of Sec - Audit at the domain to 1.",
      "Add the Lab computer accounts to the security filtering of Sec - Audit.",
      "Set the domain link of Sec - Audit to Enforced."
    ],
    "answer": [
      3
    ],
    "explanation": "**Enforced** is a property of the GPO **link**, so you change it at the domain, not on the Lab OU, and enforced links apply through Block Inheritance.\n\n* Removing Block Inheritance modifies the Lab OU, which isn't allowed.\n* Link order only ranks GPOs linked to the same container; it can't bypass Block Inheritance.\n* Security filtering selects who applies a GPO that is already in scope; the blocked GPO still isn't in scope.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-073",
    "topic": "1.4",
    "type": "single",
    "difficulty": 3,
    "stem": "A GPO named Cfg - Sales Drives contains only user settings and is linked to the Sales OU. To limit it to members of G-Sales, an administrator removed Authenticated Users from Security Filtering and added G-Sales. Since then, no Sales users receive the settings. You run the command shown in the exhibit. What should you do?",
    "exhibit": "PS C:\\> Get-GPPermission -Name \"Cfg - Sales Drives\" -All\n\nTrustee     : G-Sales\nTrusteeType : Group\nPermission  : GpoApply\nInherited   : False\n\nTrustee     : Domain Admins\nTrusteeType : Group\nPermission  : GpoEditDeleteModifySecurity\nInherited   : False\n\nTrustee     : Enterprise Admins\nTrusteeType : Group\nPermission  : GpoEditDeleteModifySecurity\nInherited   : False\n\nTrustee     : ENTERPRISE DOMAIN CONTROLLERS\nTrusteeType : WellKnownGroup\nPermission  : GpoRead\nInherited   : False\n\nTrustee     : SYSTEM\nTrusteeType : WellKnownGroup\nPermission  : GpoEditDeleteModifySecurity\nInherited   : False",
    "options": [
      "Set the link of the GPO to Enforced.",
      "Grant Authenticated Users the GpoRead permission on the GPO.",
      "Enable loopback processing in Merge mode for the Sales computers.",
      "Grant G-Sales the GpoEdit permission on the GPO."
    ],
    "answer": [
      1
    ],
    "explanation": "Since **MS16-072**, user policy is retrieved in the **computer's** security context, so the computer accounts must be able to **read** the GPO. Removing Authenticated Users removed that Read. Granting **Authenticated Users** (or **Domain Computers**) *Read* only — not Apply — restores retrieval while G-Sales stays the only group that applies it.\n\n* Edit permissions don't affect application.\n* Enforced changes precedence, not permissions.\n* Loopback changes which user settings apply; the computers still couldn't read the GPO.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-074",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "You have a GPO linked to the contoso.com domain. Servers are spread across many OUs. The GPO must apply only to member servers, not to domain controllers or client computers. Which WMI filter query should you link to the GPO?",
    "options": [
      "SELECT * FROM Win32_OperatingSystem WHERE ProductType = \"1\"",
      "SELECT * FROM Win32_ComputerSystem WHERE DomainRole = \"Server\"",
      "SELECT * FROM Win32_OperatingSystem WHERE ProductType = \"2\"",
      "SELECT * FROM Win32_OperatingSystem WHERE ProductType = \"3\""
    ],
    "answer": [
      3
    ],
    "explanation": "`Win32_OperatingSystem.ProductType` is **1** for workstations, **2** for domain controllers and **3** for member (and standalone) servers, so `ProductType = \"3\"` matches member servers only.\n\n* 1 targets client computers; 2 targets DCs.\n* `Win32_ComputerSystem.DomainRole` is numeric (3 = member server); the string \"Server\" never matches, so the GPO would apply nowhere.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-075",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Your Remote Desktop Session Host servers are in an OU named RDS. Users from many OUs sign in to them. When users sign in to an RDS server, they must receive only the user settings defined for RDS, and none of the user settings that normally apply to them. What should you do?",
    "options": [
      "Link a GPO that contains the RDS user settings to the RDS OU, and enable loopback processing in Replace mode in a GPO that applies to the RDS servers.",
      "Link a GPO that contains the RDS user settings to the domain and filter it to the RDS server computer accounts.",
      "Link a GPO that contains the RDS user settings to the RDS OU without loopback processing.",
      "Link a GPO that contains the RDS user settings to the RDS OU, and enable loopback processing in Merge mode in a GPO that applies to the RDS servers."
    ],
    "answer": [
      0
    ],
    "explanation": "**Loopback processing** makes user settings depend on the computer's location. **Replace** mode applies only the user settings from GPOs that apply to the **computer**, ignoring the user's own GPOs.\n\n* **Merge** applies the user's normal GPOs as well (the computer-side settings win only on conflicts).\n* Without loopback, user settings come from GPOs on the **user's** OU, so a GPO on the RDS OU has no user effect.\n* Filtering a user-settings GPO to computer accounts doesn't make the user half apply to users without loopback.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-076",
    "topic": "1.4",
    "type": "match",
    "difficulty": 2,
    "stem": "Match each Group Policy feature to its behaviour.",
    "pairs": [
      [
        "Enforced",
        "Applies a GPO link through Block Inheritance and wins conflicts with lower-level GPOs"
      ],
      [
        "Block Inheritance",
        "Stops GPOs linked to parent containers from applying to an OU"
      ],
      [
        "Loopback processing in Replace mode",
        "Applies only the user settings from GPOs that apply to the computer"
      ],
      [
        "Loopback processing in Merge mode",
        "Applies the user's normal GPOs and then the computer's user settings, which win on conflict"
      ],
      [
        "WMI filter",
        "Skips a GPO when a query evaluated on the client returns false"
      ]
    ],
    "explanation": "Enforced and Block Inheritance change **scope** (Enforced is set on a link, Block Inheritance on a domain or OU). Loopback changes **which user settings** apply on specific computers. A WMI filter is evaluated by each client, and each GPO can have only one.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-077",
    "topic": "1.4",
    "type": "single",
    "difficulty": 1,
    "stem": "Administrators in contoso.com use management workstations with different versions of Windows and see different Administrative Template settings in the Group Policy Management Editor. You need all administrators to use the same set of ADMX files. Where should you store the files?",
    "options": [
      "\\\\contoso.com\\SYSVOL\\contoso.com\\PolicyDefinitions",
      "\\\\contoso.com\\SYSVOL\\contoso.com\\Policies\\PolicyDefinitions",
      "C:\\Windows\\PolicyDefinitions on the domain controller that holds the PDC emulator role",
      "\\\\contoso.com\\NETLOGON\\PolicyDefinitions"
    ],
    "answer": [
      1
    ],
    "explanation": "The **Central Store** is a `PolicyDefinitions` folder under **`SYSVOL\\<domain>\\Policies`**. When it exists, every Group Policy Management Editor in the domain reads ADMX/ADML files from it, and DFSR replicates it to all DCs. Keep language subfolders such as `en-US` for the ADML files.\n\n* NETLOGON and the SYSVOL root are the wrong paths; GPMC doesn't look there.\n* A local folder on the PDC emulator is used only by that machine's own editor.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-078",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "An administrator accidentally deleted a GPO named Sec - Servers Baseline that was linked to the Servers OU. You restore it from a backup, and the restore succeeds. Servers still do not apply the settings. You run the command shown in the exhibit. What should you do?",
    "exhibit": "PS C:\\> Restore-GPO -Name \"Sec - Servers Baseline\" -Path \\\\FS1\\GPOBackups\nPS C:\\> Get-GPInheritance -Target \"OU=Servers,DC=contoso,DC=com\"\n\nName                  : servers\nContainerType         : OU\nPath                  : ou=servers,dc=contoso,dc=com\nGpoInheritanceBlocked : No\nGpoLinks              : {}\nInheritedGpoLinks     : {Default Domain Policy}",
    "options": [
      "Run Restore-GPO again with the -Domain parameter.",
      "Run New-GPLink -Name \"Sec - Servers Baseline\" -Target \"OU=Servers,DC=contoso,DC=com\".",
      "Run gpupdate /force on the domain controller that holds the PDC emulator role.",
      "Run Import-GPO with a migration table."
    ],
    "answer": [
      1
    ],
    "explanation": "`Restore-GPO` restores the GPO's settings, security filtering and WMI filter link, but **not its links** — links are stored on the site, domain or OU, and they were removed when the GPO was deleted. Re-create the link with `New-GPLink`.\n\n* `Import-GPO` copies settings into a GPO; it doesn't create links either.\n* Running the restore again changes nothing.\n* Refreshing policy on a DC doesn't link the GPO to the Servers OU.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-079",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "A GPO named Sec - Baseline in contoso.com grants user rights to CONTOSO\\G-ServerAdmins and runs a script from \\\\FS1.contoso.com\\Scripts. You need to create a GPO with the same settings in fabrikam.com, a separate forest, so that it references FABRIKAM\\G-ServerAdmins and \\\\FS1.fabrikam.com\\Scripts instead. You have backed up Sec - Baseline. What should you do?",
    "options": [
      "Copy the GPO's folder from the SYSVOL share of contoso.com to the SYSVOL share of fabrikam.com.",
      "Create a migration table that maps the security principal and the UNC path, and then run Import-GPO in fabrikam.com with -MigrationTable.",
      "Run Restore-GPO in fabrikam.com and specify the backup path.",
      "Create a Starter GPO from Sec - Baseline and use it to create the GPO in fabrikam.com."
    ],
    "answer": [
      1
    ],
    "explanation": "`Import-GPO` imports a backup's settings into a GPO in another domain or forest, and a **migration table** (`.migtable`, built with the Migration Table Editor) translates principals and UNC paths that differ between environments.\n\n* `Restore-GPO` restores a GPO to the domain it was backed up from.\n* Copying SYSVOL files creates no Group Policy Container in AD and keeps the old references.\n* Starter GPOs hold only Administrative Template settings and can't be created from an existing GPO.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-080",
    "topic": "1.4",
    "type": "fill",
    "difficulty": 1,
    "stem": "You need to force an immediate Group Policy refresh on a remote computer named PC1 from your management workstation by using PowerShell. Which cmdlet should you run? (Enter the cmdlet name only.)",
    "answer": [
      "Invoke-GPUpdate",
      "Invoke-GPUpdate -Computer PC1",
      "Invoke-GPUpdate -Computer PC1 -Force",
      "Invoke-GPUpdate -Computer PC1 -Force -RandomDelayInMinutes 0",
      "Invoke-GPUpdate -Computer PC1 -RandomDelayInMinutes 0 -Force"
    ],
    "explanation": "`Invoke-GPUpdate -Computer PC1 -Force -RandomDelayInMinutes 0` schedules a `gpupdate` on the remote computer; `-RandomDelayInMinutes 0` runs it as soon as the task is scheduled instead of after a random delay. It works by creating a scheduled task, so the target's firewall must allow Remote Scheduled Tasks Management and WMI. GPMC's **Group Policy Update** on an OU does the same for every computer in it.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-081",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "Computers in the Kiosk OU do not apply a GPO named Cfg - Kiosk. You run gpresult /r on one of the computers from an elevated command prompt. The exhibit shows part of the output. What should you modify to resolve the issue?",
    "exhibit": "COMPUTER SETTINGS\n------------------\n    CN=KIOSK07,OU=Kiosk,DC=contoso,DC=com\n    Last time Group Policy was applied: 10/28/2026 at 9:41:12 AM\n    Group Policy was applied from:      DC1.contoso.com\n    Group Policy slow link threshold:   500 kbps\n    Domain Name:                        CONTOSO\n    Domain Type:                        Windows 2008 or later\n\n    Applied Group Policy Objects\n    -----------------------------\n        Default Domain Policy\n\n    The following GPOs were not applied because they were filtered out\n    -------------------------------------------------------------------\n        Cfg - Kiosk\n            Filtering:  Denied (WMI Filter)\n            WMI Filter: Kiosk Hardware\n\n        Local Group Policy\n            Filtering:  Not Applied (Empty)",
    "options": [
      "The WMI filter linked to Cfg - Kiosk",
      "The Block Inheritance setting of the Kiosk OU",
      "The security filtering of Cfg - Kiosk",
      "The link order of Cfg - Kiosk"
    ],
    "answer": [
      0
    ],
    "explanation": "`Denied (WMI Filter)` means the GPO is in scope and readable, but the **Kiosk Hardware** WMI query returned false on KIOSK07. Fix the query (or unlink the filter).\n\n* A security filtering problem shows `Denied (Security)`.\n* Link order affects precedence between applied GPOs, not whether one is filtered out.\n* Block Inheritance would prevent a parent-linked GPO from being listed at all, not produce a WMI denial.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-082",
    "topic": "1.4",
    "type": "single",
    "difficulty": 3,
    "stem": "You need to provide a reusable template so that new GPOs created by administrators start with a standard set of User Rights Assignment and Administrative Template settings. What should you do?",
    "options": [
      "Configure the settings as preference items in a Starter GPO.",
      "Store the settings as a custom ADMX file in the Central Store.",
      "Create a reference GPO that contains the settings, and create new GPOs from it by using Copy-GPO.",
      "Create a Starter GPO that contains both sets of settings."
    ],
    "answer": [
      2
    ],
    "explanation": "**Starter GPOs** can contain only **Administrative Template** settings, so they can't carry User Rights Assignment (a security setting). A fully configured reference GPO copied with `Copy-GPO` (or backed up and imported with `Import-GPO`) carries every type of setting.\n\n* A Starter GPO can't hold the user rights.\n* ADMX files define registry-based policy settings; user rights aren't registry policies.\n* Starter GPOs don't include preferences either.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-083",
    "topic": "1.4",
    "type": "order",
    "difficulty": 1,
    "stem": "A computer account is in the OU OU=Sales,OU=Corp,DC=contoso,DC=com. GPOs are linked at every level. In which order are the GPOs processed for the computer?",
    "items": [
      "Local Group Policy on the computer",
      "GPOs linked to the AD DS site",
      "GPOs linked to the contoso.com domain",
      "GPOs linked to OU=Corp",
      "GPOs linked to OU=Sales"
    ],
    "explanation": "Group Policy processes **L**ocal, **S**ite, **D**omain, then **O**Us from the top down (**LSDOU**). Because later GPOs overwrite earlier ones on conflict, the GPO closest to the object (OU=Sales) wins — unless an earlier link is Enforced.",
    "lesson": "1.4-group-policy"
  },
  {
    "id": "d1-084",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "You need to set the registry value HKCU\\Software\\Contoso\\App\\Theme to Dark for all users when they first sign in. Users must be able to change the value afterwards, and their choice must be kept. What should you configure?",
    "options": [
      "A custom ADMX template that configures the value as a policy setting",
      "A registry preference item with the Update action and the Remove this item when it is no longer applied option selected",
      "A registry preference item with the Update action and the Apply once and do not reapply option selected",
      "A registry preference item with the Replace action"
    ],
    "answer": [
      2
    ],
    "explanation": "A **preference** writes the value to its normal location where users can change it, and **Apply once and do not reapply** stops Group Policy from overwriting the user's choice at the next refresh.\n\n* **Replace** deletes and recreates the value at every refresh, undoing the user's change.\n* A setting from a custom ADMX template is reapplied at every refresh (and is greyed out in apps that honour policy keys), so the user's choice wouldn't be kept.\n* *Remove this item when it is no longer applied* forces the Replace action and keeps re-applying the value.",
    "lesson": "1.4-gp-preferences"
  },
  {
    "id": "d1-085",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "A Drive Maps preference item maps S: to \\\\FS1\\Sales. You are moving the share to \\\\FS2\\Sales. Some users have changed the label and reconnect settings of their S: drive. You need every S: drive to be recreated so that it points to \\\\FS2\\Sales and has only the settings you define. Which action should you configure on the drive map item?",
    "options": [
      "Replace",
      "Update",
      "Create",
      "Delete"
    ],
    "answer": [
      0
    ],
    "explanation": "**Replace** deletes the existing mapping and creates it again with exactly the configured properties, discarding anything users changed.\n\n* **Update** modifies only the properties you configured, leaving other user changes in place.\n* **Create** does nothing when S: already exists.\n* **Delete** only removes the mapping.",
    "lesson": "1.4-gp-preferences"
  },
  {
    "id": "d1-086",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "A GPO maps a Finance drive for members of G-Finance. When users are removed from G-Finance, they keep the mapped drive. The exhibit shows the drive map item from the GPO settings report. You need the drive to be removed automatically when a user is no longer a member of G-Finance. What should you do?",
    "exhibit": "Drive Map (Drive: F)\n  General\n    Action:      Update\n    Location:    \\\\FS1.contoso.com\\Finance\n    Reconnect:   Enabled\n    Label as:    Finance\n  Common\n    Options\n      Stop processing items on this extension if an error occurs on this item: No\n      Run in logged-on user's security context (user policy option):           No\n      Remove this item when it is no longer applied:                            No\n      Apply once and do not reapply:                                            No\n    Item-level targeting\n      the user is a member of the security group CONTOSO\\G-Finance",
    "options": [
      "Change the item-level targeting to the user is NOT a member of the security group CONTOSO\\G-Finance.",
      "Select Apply once and do not reapply.",
      "Set the action to Create.",
      "Select Remove this item when it is no longer applied."
    ],
    "answer": [
      3
    ],
    "explanation": "Item-level targeting stops the item from **applying** to users who leave G-Finance, but preferences tattoo: the existing mapping stays. **Remove this item when it is no longer applied** removes it when the item goes out of scope (and switches the action to Replace).\n\n* *Apply once* makes the item apply only the first time — the opposite of cleanup.\n* Negating the targeting would map the drive for everyone *outside* Finance.\n* Create still never removes anything.",
    "lesson": "1.4-gp-preferences"
  },
  {
    "id": "d1-087",
    "topic": "1.4",
    "type": "single",
    "difficulty": 1,
    "stem": "Twelve departments each need a different mapped drive based on group membership. You need to implement the drive mappings by using the fewest GPOs and links. What should you do?",
    "options": [
      "Create one GPO that contains 12 Drive Maps items, each with item-level targeting for the department's security group.",
      "Create one GPO and link a separate WMI filter for each department to it.",
      "Create 12 GPOs, one per department, each with security filtering set to the department's group.",
      "Create one GPO and enable loopback processing in Merge mode."
    ],
    "answer": [
      0
    ],
    "explanation": "**Item-level targeting** filters individual preference items, so a single GPO can hold all 12 mappings, each targeted to its department group.\n\n* Twelve security-filtered GPOs works but uses twelve GPOs and links.\n* A GPO can have only **one** WMI filter, and WMI can't easily test group membership.\n* Loopback changes where user settings come from; it doesn't target departments.",
    "lesson": "1.4-gp-preferences"
  },
  {
    "id": "d1-088",
    "topic": "1.4",
    "type": "single",
    "difficulty": 2,
    "stem": "You need to add the domain group CONTOSO\\G-Server-Admins to the local Administrators group on all member servers. Existing members of each local Administrators group must remain. The solution must follow the principle of least privilege. What should you configure in a GPO linked to the servers?",
    "options": [
      "A Restricted Groups policy for the Administrators group that lists CONTOSO\\G-Server-Admins as its only member",
      "A Local Users and Groups preference item for the built-in Administrators group with the Update action that adds CONTOSO\\G-Server-Admins",
      "A Local Users and Groups preference item with the Update action and Delete all member groups selected",
      "A Restricted Groups policy that adds CONTOSO\\G-Server-Admins to the Domain Admins group"
    ],
    "answer": [
      1
    ],
    "explanation": "A **Local Users and Groups** preference with **Update** adds the specified member and leaves existing members untouched.\n\n* A Restricted Groups *Members* list **replaces** the group's membership, removing existing members. (Restricted Groups' *This group is a member of* direction would add without removing, but that isn't what this option configures.)\n* *Delete all member groups* also strips the existing members before adding.\n* Domain Admins would grant rights on every computer in the domain, violating least privilege.",
    "lesson": "1.4-gp-preferences"
  },
  {
    "id": "d1-089",
    "topic": "1.4",
    "type": "multi",
    "difficulty": 2,
    "stem": "Laptops move between offices. You need printer preference items to be deployed based on the office network a laptop is currently connected to. Which two item-level targeting items can you use? (Choose two.)",
    "options": [
      "Security Group",
      "IP Address Range",
      "Site",
      "Operating System",
      "RAM",
      "Portable Computer"
    ],
    "answer": [
      1,
      2
    ],
    "explanation": "**Site** (the AD DS site the computer is in, derived from its subnet) and **IP Address Range** both reflect where the device is currently connected.\n\n* *Portable Computer* only detects that it's a laptop or docked.\n* *Operating System*, *Security Group* and *RAM* don't change when the laptop moves between offices.",
    "lesson": "1.4-gp-preferences"
  },
  {
    "id": "d1-090",
    "topic": "1.4",
    "type": "fill",
    "difficulty": 2,
    "stem": "You need to create a registry preference item in an existing GPO by using a GroupPolicy module cmdlet. Which cmdlet should you use? (Enter the cmdlet name only.)",
    "answer": [
      "Set-GPPrefRegistryValue"
    ],
    "explanation": "`Set-GPPrefRegistryValue -Name <GPO> -Context User|Computer -Key ... -ValueName ... -Value ... -Type ... -Action Create|Replace|Update|Delete` creates a registry **preference** item. `Set-GPRegistryValue` sets a registry-based **policy** setting instead. Other preference types have no dedicated cmdlets.",
    "lesson": "1.4-gp-preferences"
  }
];
