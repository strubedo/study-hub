// Domain 1 — Deploy and manage AD DS. Generated data; original content.
export default [
  {
    "id": "d1-f001",
    "topic": "1.1",
    "front": "Lowest domain/forest functional level that can host a Windows Server 2025 DC?",
    "back": "Windows Server **2016**. New forests on 2025 must be at least 2016, and an existing domain must be at the 2016 level before a 2025 DC can join."
  },
  {
    "id": "d1-f002",
    "topic": "1.1",
    "front": "Requirement to raise the domain functional level to Windows Server 2025?",
    "back": "Every DC in the domain runs Windows Server 2025. Raising the forest level to 2025 (all DCs on 2025) raises all domains too."
  },
  {
    "id": "d1-f003",
    "topic": "1.1",
    "front": "What does the Windows Server 2025 functional level unlock?",
    "back": "The **Database 32k pages** optional feature (enabled separately, irreversible). Unattended value: DomainLevel/ForestLevel `10`; PowerShell `Windows2025Forest`."
  },
  {
    "id": "d1-f004",
    "topic": "1.1",
    "front": "ntdsutil command to create IFM media for a writable DC including SYSVOL?",
    "back": "`ntdsutil \"activate instance ntds\" ifm \"create sysvol full C:\\IFM\" quit quit` — then promote with `-InstallationMediaPath`."
  },
  {
    "id": "d1-f005",
    "topic": "1.1",
    "front": "IFM option for RODC media?",
    "back": "`create rodc` or `create sysvol rodc` — media with passwords and secrets removed."
  },
  {
    "id": "d1-f006",
    "topic": "1.1",
    "front": "Three prerequisites for virtual DC cloning?",
    "back": "Hypervisor exposes **VM-Generation ID**; source DC in **Cloneable Domain Controllers**; **PDC emulator** online. Then `New-ADDCCloneConfigFile`."
  },
  {
    "id": "d1-f007",
    "topic": "1.1",
    "front": "Recommended DNS client settings on a DC that runs DNS?",
    "back": "Preferred: another DC. Alternate: loopback `127.0.0.1`. Never loopback only or first."
  },
  {
    "id": "d1-f008",
    "topic": "1.1",
    "front": "Azure DC: host caching on the NTDS.dit/SYSVOL data disk?",
    "back": "**None** — ESE needs durable writes."
  },
  {
    "id": "d1-f009",
    "topic": "1.1",
    "front": "Azure DC: where do you set its static IP?",
    "back": "On the **Azure NIC** (private IP assignment Static). Leave Windows on DHCP. No public IP."
  },
  {
    "id": "d1-f010",
    "topic": "1.1",
    "front": "Azure VMs can't find DCs (they query 168.63.129.16). Fix?",
    "back": "Set the **VNet custom DNS servers** to the DC IP addresses; VMs get them via Azure DHCP."
  },
  {
    "id": "d1-f011",
    "topic": "1.1",
    "front": "What happens when a DC VM is deallocated and restarted in Azure?",
    "back": "VM-Generation ID changes: invocation ID reset, **RID pool discarded**, SYSVOL marked non-authoritative. Shut DCs down from inside the guest."
  },
  {
    "id": "d1-f012",
    "topic": "1.1",
    "front": "Two-stage (staged) RODC deployment cmdlets?",
    "back": "`Add-ADDSReadOnlyDomainControllerAccount` (Domain Admin, sets delegated admin) → `Install-ADDSDomainController -UseExistingAccount` (delegated user, workgroup server)."
  },
  {
    "id": "d1-f013",
    "topic": "1.1",
    "front": "Parameter mandatory with `Install-ADDSDomainController -ReadOnlyReplica`?",
    "back": "`-SiteName` (an existing site)."
  },
  {
    "id": "d1-f014",
    "topic": "1.1",
    "front": "Default password replication policy of a new RODC?",
    "back": "Allow: Allowed RODC Password Replication Group (empty). Deny: Denied RODC PRP Group, Administrators, Server/Backup/Account Operators. Deny wins; nothing cached by default."
  },
  {
    "id": "d1-f015",
    "topic": "1.1",
    "front": "Command to prepopulate RODC password cache?",
    "back": "`repadmin /rodcpwdrepl RODC1 DC1 \"CN=User1,OU=Branch1,DC=contoso,DC=com\"` (accounts as DNs), `Sync-ADObject -PasswordOnly`, or ADUC › Advanced PRP › **Prepopulate Passwords**. Only PRP-allowed accounts succeed."
  },
  {
    "id": "d1-f016",
    "topic": "1.1",
    "front": "Stolen RODC — response?",
    "back": "Export revealed list, **delete the RODC computer account** and choose to reset cached user and computer passwords. Domain krbtgt reset not needed (RODC has its own krbtgt_NNNNN)."
  },
  {
    "id": "d1-f017",
    "topic": "1.1",
    "front": "Seize a FSMO role with PowerShell?",
    "back": "`Move-ADDirectoryServerOperationMasterRole -Identity <new holder> -OperationMasterRole <role> -Force`. Old holder must never return with its database."
  },
  {
    "id": "d1-f018",
    "topic": "1.1",
    "front": "When may the infrastructure master sit on a GC?",
    "back": "Single-domain forest, every DC in the domain is a GC, or the **AD Recycle Bin** is enabled."
  },
  {
    "id": "d1-f019",
    "topic": "1.2",
    "front": "Which domain \"trusts\" in a resource-access trust?",
    "back": "The **resource** (trusting) domain trusts the **account** (trusted) domain; access flows opposite to the trust direction."
  },
  {
    "id": "d1-f020",
    "topic": "1.2",
    "front": "Is a forest trust transitive to a third forest?",
    "back": "No. It is transitive across all domains of the **two** forests only. Create a direct trust to the third forest."
  },
  {
    "id": "d1-f021",
    "topic": "1.2",
    "front": "External trust: transitive?",
    "back": "No — non-transitive, single domain, SID filtering (quarantine) on by default."
  },
  {
    "id": "d1-f022",
    "topic": "1.2",
    "front": "Purpose of a shortcut trust?",
    "back": "Shorten Kerberos referral paths between two domains in the **same forest**. Transitive."
  },
  {
    "id": "d1-f023",
    "topic": "1.2",
    "front": "Selective authentication — what must you grant?",
    "back": "**Allowed to Authenticate** on the computer objects that trusted-forest users may reach."
  },
  {
    "id": "d1-f024",
    "topic": "1.2",
    "front": "Allow SID history across a forest trust during migration?",
    "back": "`netdom trust <trusting> /domain:<trusted> /enablesidhistory:yes` — temporarily."
  },
  {
    "id": "d1-f025",
    "topic": "1.2",
    "front": "Default site link cost and interval?",
    "back": "DEFAULTIPSITELINK: cost **100**, every **180 minutes**. Interval minimum 15, multiples of 15, max 10,080."
  },
  {
    "id": "d1-f026",
    "topic": "1.2",
    "front": "Enable change notification on a site link?",
    "back": "Set bit 1 of `options`: `Set-ADReplicationSiteLink CHI-DAL -Replace @{options=1}`."
  },
  {
    "id": "d1-f027",
    "topic": "1.2",
    "front": "When should you clear \"Bridge all site links\"?",
    "back": "When the IP network is **not fully routed** (e.g. branches can only reach the hub); then create explicit site link bridges."
  },
  {
    "id": "d1-f028",
    "topic": "1.2",
    "front": "Risk of preferred bridgehead servers?",
    "back": "The ISTG uses only preferred ones; if they fail or don't host a partition, that partition stops replicating to/from the site."
  },
  {
    "id": "d1-f029",
    "topic": "1.2",
    "front": "Universal group membership caching — where and what?",
    "back": "Per site (NTDS Site Settings). Branch DC caches users' universal group memberships after first logon; refresh every 8 hours. Avoids a branch GC."
  },
  {
    "id": "d1-f030",
    "topic": "1.2",
    "front": "Intrasite change notification timing?",
    "back": "First partner notified after **15 s**, each subsequent partner **3 s** later. Ring topology, ≤3 hops, uncompressed."
  },
  {
    "id": "d1-f031",
    "topic": "1.2",
    "front": "How often does the KCC run by default?",
    "back": "Every **15 minutes** on every DC. One ISTG per site builds intersite connections."
  },
  {
    "id": "d1-f032",
    "topic": "1.2",
    "front": "repadmin error 8524 vs 1722?",
    "back": "**8524** = DNS lookup failure (can't resolve source DC's _msdcs CNAME). **1722** = RPC server unavailable (DC down, firewall, network)."
  },
  {
    "id": "d1-f033",
    "topic": "1.3",
    "front": "Global group membership rules?",
    "back": "Members: accounts and global groups from the **same domain**. Usable for permissions in any domain of the forest or trusting domains."
  },
  {
    "id": "d1-f034",
    "topic": "1.3",
    "front": "Domain local group membership rules?",
    "back": "Members from any trusted domain/forest (accounts, global, universal) plus domain local groups of the **same** domain. Permissions in its own domain only."
  },
  {
    "id": "d1-f035",
    "topic": "1.3",
    "front": "Universal group membership rules?",
    "back": "Accounts, global and universal groups from any domain in the **same forest**. Membership replicates to every GC."
  },
  {
    "id": "d1-f036",
    "topic": "1.3",
    "front": "AGDLP?",
    "back": "Accounts → Global groups → Domain Local groups → Permissions. AGUDLP adds Universal groups for multi-domain forests."
  },
  {
    "id": "d1-f037",
    "topic": "1.3",
    "front": "Convert global → domain local?",
    "back": "Not directly: global → universal → domain local. Global → universal requires it not be in another global group; universal → domain local requires it not be in another universal group."
  },
  {
    "id": "d1-f038",
    "topic": "1.3",
    "front": "What is a foreign security principal?",
    "back": "Object in `CN=ForeignSecurityPrincipals`, named by SID, representing a member from a trusted external domain/forest in a local group."
  },
  {
    "id": "d1-f039",
    "topic": "1.3",
    "front": "Add a UPN suffix forest-wide?",
    "back": "`Set-ADForest -UPNSuffixes @{Add=\"contoso.us\"}` or AD Domains and Trusts › Properties."
  },
  {
    "id": "d1-f040",
    "topic": "1.3",
    "front": "Move a user between domains in one forest?",
    "back": "`Move-ADObject -TargetServer` using the **RID masters** of both domains; new SID, old SID kept in sIDHistory, same GUID."
  },
  {
    "id": "d1-f041",
    "topic": "1.3",
    "front": "gMSA deployment steps?",
    "back": "KDS root key → `New-ADServiceAccount -PrincipalsAllowedToRetrieveManagedPassword` → reboot hosts → `Install-ADServiceAccount` → `Test-ADServiceAccount` → service logs on as `DOMAIN\\name$`, blank password."
  },
  {
    "id": "d1-f042",
    "topic": "1.3",
    "front": "How long before a new KDS root key is usable?",
    "back": "Up to **10 hours** (replication safety). Lab only: `Add-KdsRootKey -EffectiveTime ((Get-Date).AddHours(-10))`."
  },
  {
    "id": "d1-f043",
    "topic": "1.3",
    "front": "dMSA requirements and migration cmdlets?",
    "back": "A **Windows Server 2025 DC**, KDS root key, client policy enabling dMSA logons. `Start-ADServiceAccountMigration` → `Complete-ADServiceAccountMigration`. Can't migrate a gMSA or sMSA."
  },
  {
    "id": "d1-f044",
    "topic": "1.4",
    "front": "GPO processing order?",
    "back": "**LSDOU**: Local, Site, Domain, OUs top-down. Last applied wins; link order 1 wins within a container."
  },
  {
    "id": "d1-f045",
    "topic": "1.4",
    "front": "Enforced vs Block Inheritance?",
    "back": "Block Inheritance (on OU/domain) stops parent GPOs; **Enforced** (on a link) applies anyway and wins conflicts."
  },
  {
    "id": "d1-f046",
    "topic": "1.4",
    "front": "MS16-072 and security filtering?",
    "back": "Computers read user GPOs in their own context — keep **Read** for Authenticated Users or Domain Computers when filtering to a user group."
  },
  {
    "id": "d1-f047",
    "topic": "1.4",
    "front": "WMI ProductType values?",
    "back": "1 = workstation, 2 = domain controller, 3 = member server. One WMI filter per GPO."
  },
  {
    "id": "d1-f048",
    "topic": "1.4",
    "front": "Loopback Replace vs Merge?",
    "back": "Replace: only user settings from GPOs applying to the **computer**. Merge: user's GPOs plus computer's user settings; computer side wins conflicts."
  },
  {
    "id": "d1-f049",
    "topic": "1.4",
    "front": "Central Store path?",
    "back": "`\\\\contoso.com\\SYSVOL\\contoso.com\\Policies\\PolicyDefinitions` (ADMX + language folders with ADML)."
  },
  {
    "id": "d1-f050",
    "topic": "1.4",
    "front": "What does Restore-GPO not restore?",
    "back": "GPO **links** — re-link with `New-GPLink`. It does restore settings, security filtering and WMI filter link."
  },
  {
    "id": "d1-f051",
    "topic": "1.4",
    "front": "Copy a GPO to another forest with different names/paths?",
    "back": "`Import-GPO` (or `Copy-GPO`) with a **migration table** (`.migtable`, mtedit.exe)."
  },
  {
    "id": "d1-f052",
    "topic": "1.4",
    "front": "GPP actions Create / Replace / Update / Delete?",
    "back": "Create: only if missing. Replace: delete and recreate. Update: change configured properties (default). Delete: remove."
  },
  {
    "id": "d1-f053",
    "topic": "1.4",
    "front": "GPP option to clean up when out of scope?",
    "back": "**Remove this item when it is no longer applied** (forces Replace). Preferences otherwise tattoo."
  },
  {
    "id": "d1-f054",
    "topic": "1.4",
    "front": "Why never store passwords in GPP?",
    "back": "cpassword key is public; MS14-025 removed password fields. Use Windows LAPS and gMSAs."
  },
  {
    "id": "d1-f055",
    "topic": "1.4",
    "front": "Background Group Policy refresh interval?",
    "back": "Members: every **90 minutes** plus a random offset of 0–30 minutes. DCs: every **5 minutes**."
  }
];
