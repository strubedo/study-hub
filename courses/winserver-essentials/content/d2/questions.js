// Domain 2 - Active Directory Domain Services. Original questions; facts checked against Microsoft Learn (Windows Server 2025) on 2026-10-30.
// Replication timers (15 s / 3 s notification, 180 min site link default), the 500-RID pool size and the Protected Users details come from Microsoft technical documentation outside the Windows Server 2025 pages.
const L1 = '2.1-ad-concepts-deploy-dc';
const L2 = '2.1-fsmo-functional-levels';
const L3 = '2.1-rodc-replication';
const L4 = '2.2-accounts-tools-powershell';
const L5 = '2.2-groups-scopes-agdlp';
const L6 = '2.2-service-accounts-delegation';
const L7 = '2.3-gpo-processing-precedence';
const L8 = '2.3-gpo-settings-fgpp-troubleshooting';

const bank = [
  // ---------- 2.1 ----------
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L1,
    stem: 'Which Active Directory structure is the security boundary?',
    options: ['The domain', 'The organizational unit', 'The forest', 'The site'],
    answer: [2],
    explanation: 'The forest is the security boundary: it shares one schema, configuration and global catalog, and Enterprise Admins govern it. A domain is an administrative and replication unit, an OU is for delegation and GPO links, and a site describes network topology for client location and replication.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Users report that their clocks drift and password changes take a long time to be honored on other domain controllers. Which FSMO role holder is most likely offline?',
    options: ['Schema master', 'PDC emulator', 'Domain naming master', 'Infrastructure master'],
    answer: [1],
    explanation: 'The PDC emulator is the domain time source, takes urgent replication of password changes and receives forwarded bad-password attempts. The schema master only handles schema changes, the domain naming master only adds or removes domains and partitions, and the infrastructure master only fixes cross-domain group member references.' },
  { topic: '2.1', type: 'multi', difficulty: 1, lesson: L2,
    stem: 'Which two FSMO roles exist once per forest rather than once per domain? (Choose two.)',
    options: ['Schema master', 'PDC emulator', 'Domain naming master', 'RID master', 'Infrastructure master'],
    answer: [0, 2],
    explanation: 'The schema master and domain naming master are forest-wide. The PDC emulator, RID master and infrastructure master exist once in every domain.' },
  { topic: '2.1', type: 'fill', difficulty: 1, lesson: L2,
    stem: 'Which Active Directory PowerShell cmdlet transfers FSMO roles (and seizes them when the -Force switch is added)?',
    answer: ['Move-ADDirectoryServerOperationMasterRole'],
    explanation: '`Move-ADDirectoryServerOperationMasterRole` transfers a role, and adding `-Force` indicates seizure. `ntdsutil` offers the same operations interactively.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L2,
    stem: 'What numeric value represents the Windows Server 2025 forest and domain functional level? Enter the number.',
    answer: ['10'],
    explanation: 'Microsoft documents the Windows Server 2025 functional level as `DomainLevel 10` and `ForestLevel 10`. Level 7 is Windows Server 2016, the highest level for 2019 and 2022 domain controllers.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. DC01 was destroyed in a fire and will never return. DC02 is healthy. What should you do?',
    exhibit: `PS C:\\> netdom query fsmo
Schema master               DC01.corp.example.com
Domain naming master        DC01.corp.example.com
PDC                         DC01.corp.example.com
RID pool manager            DC01.corp.example.com
Infrastructure master       DC01.corp.example.com
The command completed successfully.`,
    options: ['Run Move-ADDirectoryServerOperationMasterRole for DC02 without -Force and wait for the transfer', 'Seize all five roles to DC02 with -Force, then clean up the DC01 metadata', 'Raise the forest functional level so the roles move automatically', 'Run Uninstall-ADDSDomainController on DC01 to demote it gracefully'],
    answer: [1],
    explanation: 'With the holder permanently lost, seizure with `-Force` (or ntdsutil) is correct, followed by metadata cleanup. A normal transfer needs the old holder online. Functional levels do not move roles. A graceful demotion needs DC01 to be running.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L1,
    stem: 'What is the name of the Install-ADDSForest parameter that sets the Directory Services Restore Mode (DSRM) password? Enter the parameter name without the dash.',
    answer: ['SafeModeAdministratorPassword'],
    explanation: '`-SafeModeAdministratorPassword` takes a SecureString and sets the DSRM password used for offline recovery of the DC. It is separate from the domain Administrator password.' },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L2,
    stem: 'A forest has four domains and every domain controller is also a global catalog server. Where must the infrastructure master be placed?',
    options: ['On a DC that is not a global catalog, in each domain', 'Only in the forest root domain', 'On any DC; placement is irrelevant', 'On the same DC as the schema master'],
    answer: [2],
    explanation: 'When every DC is a global catalog, the infrastructure master role is insignificant because GCs already hold up-to-date data for every domain, so placement does not matter. The "not on a GC" rule applies only when some DCs are not GCs in a multi-domain forest. The role is per domain, not forest root only, and has no tie to the schema master.' },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L2,
    stem: 'Refer to the exhibit. You want to run Enable-ADOptionalFeature for the Database 32k pages feature. All DCs run Windows Server 2025, and the domain and forest are at the 2025 level. What must you do first?',
    exhibit: `PS C:\\> Get-ADObject -LDAPFilter "(ObjectClass=nTDSDSA)" -SearchBase "CN=Configuration,DC=corp,DC=example,DC=com" -Properties msDS-JetDBPageSize | ft DistinguishedName,msDS-JetDBPageSize

DistinguishedName                                       msDS-JetDBPageSize
-----------------                                       ------------------
CN=NTDS Settings,CN=DC01,CN=Servers,CN=Default-Fir...              32768
CN=NTDS Settings,CN=DC02,CN=Servers,CN=Default-Fir...               8192`,
    options: ['Nothing; the cmdlet converts DC02 to 32k pages during the operation', 'Replace DC02 with a newly promoted Windows Server 2025 DC so every DC is 32k capable', 'Lower the forest functional level to Windows Server 2016', 'Stop the NTDS service on DC02 and rerun the cmdlet'],
    answer: [1],
    explanation: 'Every DC in the forest must have a 32k-page-capable database. 8192 shows DC02 still uses an 8k database, which is what an in-place upgraded DC keeps. A newly promoted 2025 DC is 32k capable. The cmdlet does not convert databases, level 10 is a prerequisite not an obstacle, and stopping NTDS changes nothing.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L2,
    stem: 'Refer to the exhibit. You try to add a new Windows Server 2025 domain controller to this domain and promotion is refused. What is the reason?',
    exhibit: `PS C:\\> Get-ADDomain | Select-Object DNSRoot, DomainMode
DNSRoot           DomainMode
-------           ----------
corp.example.com  Windows2012R2Domain`,
    options: ['A Windows Server 2025 DC requires the domain to run at Windows Server 2016 functional level or later', 'A Windows Server 2025 DC requires the domain to be at the 2025 functional level', 'Windows Server 2025 DCs cannot join a domain that has a schema older than version 91', 'Only a read-only DC can be added to a 2012 R2 domain'],
    answer: [0],
    explanation: 'Microsoft documents that promoting a replica requires the existing domain to be at the 2016 level or higher, and that new forests need 2016 or later. A 2025 DC works at both the 2016 and 2025 levels, so it does not need level 10. The schema is extended automatically by promotion, and RODCs are not a special case here.' },
  { topic: '2.1', type: 'order', difficulty: 1, lesson: L1,
    stem: 'Put the steps for building the first domain controller of a new forest in order (first at the top).',
    items: ['Set a static IP address and the computer name', 'Install the AD-Domain-Services role', 'Run Install-ADDSForest with a DSRM password', 'After the restart, verify with dcdiag and Get-ADDomain'],
    explanation: 'Prepare the network identity, install the role, promote, then verify after the automatic restart.' },
  { topic: '2.1', type: 'match', difficulty: 1, lesson: L2,
    stem: 'Match each FSMO role to its function.',
    pairs: [['Schema master', 'Only DC that accepts schema changes'], ['RID master', 'Allocates RID pools to domain controllers'], ['PDC emulator', 'Domain time source and password change forwarding'], ['Domain naming master', 'Adds and removes domains from the forest']],
    explanation: 'Each role covers one single-master operation: schema changes, SID uniqueness through RID pools, time and password handling, and domain creation or removal.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L3,
    stem: 'A newly deployed RODC has not been configured beyond promotion. Which user passwords does it cache?',
    options: ['All users in its site', 'All users in the domain, replicated on a schedule', 'None, until the Password Replication Policy allows them', 'Only members of Domain Users'],
    answer: [2],
    explanation: 'The Allowed RODC Password Replication Group has no members by default, so a new RODC caches no user credentials until you allow accounts. It never pulls everyone, and Domain Users is not allowed by default.' },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L3,
    stem: 'Refer to the exhibit. User mlee works at the branch with RODC01, but her password is never cached on it. Why?',
    exhibit: `PS C:\\> Get-ADDomainControllerPasswordReplicationPolicy -Identity RODC01 -Allowed | Select Name
Name
----
Allowed RODC Password Replication Group
Branch Users

PS C:\\> Get-ADPrincipalGroupMembership mlee | Select Name
Name
----
Domain Users
Branch Users
Domain Admins

Denied RODC Password Replication Group members: Domain Admins, Enterprise Admins, Schema Admins, krbtgt, ...`,
    options: ['Branch Users is not nested inside the Allowed RODC Password Replication Group', 'Her Domain Admins membership places her in the denied list, and deny supersedes allow', 'An RODC can cache passwords only for computer accounts', 'The RODC must be a global catalog server before it can cache users'],
    answer: [1],
    explanation: 'Domain Admins is in the Denied RODC Password Replication Group and denied takes precedence over allowed, so mlee is not cached despite her Branch Users membership. Branch Users is explicitly on the allowed list. RODCs can cache user and computer secrets, and being a GC is not a requirement.' },
  { topic: '2.1', type: 'multi', difficulty: 2, lesson: L3,
    stem: 'Which two statements about a read-only domain controller are correct? (Choose two.)',
    options: ['It replicates inbound only, from a writable DC', 'It has its own krbtgt account', 'It can hold the PDC emulator role', 'It accepts password changes and replicates them outward', 'It cannot be a DNS server'],
    answer: [0, 1],
    explanation: 'An RODC receives changes one way and has a separate krbtgt_<number> account so a compromise does not expose the domain krbtgt. It cannot hold FSMO roles, it forwards writes to a writable DC instead of replicating them out, and it can host a read-only copy of DNS zones.' },
  { topic: '2.1', type: 'single', difficulty: 1, lesson: L3,
    stem: 'What is the default replication interval of a site link between sites?',
    options: ['15 minutes', '60 minutes', '180 minutes', '24 hours'],
    answer: [2],
    explanation: 'The default intersite replication interval is 180 minutes; the minimum you can set is 15 minutes. Within a site, replication is notification-driven after 15 seconds instead.' },
  { topic: '2.1', type: 'fill', difficulty: 2, lesson: L3,
    stem: 'Refer to the exhibit. Which command shows the detailed inbound replication status and error for DC03?',
    exhibit: `C:\\> repadmin /replsummary
Source DSA    largest delta        fails/total  %%   error
DC01              02m:11s            0 /   5    0
DC02              02m:40s            0 /   5    0
DC03          45d:03h:12m:11s        5 /   5  100   (1722) The RPC server is unavailable.`,
    answer: ['repadmin /showrepl', 'repadmin showrepl', 'repadmin /showrepl dc03', 'repadmin /showrepl DC03'],
    explanation: '`repadmin /showrepl` lists each inbound replication partner and partition with the last attempt and error. `repadmin /replsummary` is the high-level summary already shown.' },
  { topic: '2.1', type: 'single', difficulty: 2, lesson: L1,
    stem: 'Which statement about a new Active Directory forest created on Windows Server 2025 is true?',
    options: ['It always uses a 32k page database and cannot run in 8k mode', 'It is 32k-page capable but runs in 8k page simulation mode until the optional feature is enabled', 'It uses an 8k database; 32k pages exist only for upgraded DCs', 'It requires the Windows Server 2025 functional level at creation'],
    answer: [1],
    explanation: 'New 2025 forests and domains are installed with a 32k-capable database that uses 8k page simulation mode for compatibility until the forest-wide feature is enabled. Upgraded DCs keep 8k, and new forests need only level 2016 or later.' },
  { topic: '2.1', type: 'single', difficulty: 3, lesson: L1,
    stem: 'Refer to the exhibit. These policies were set in the Default Domain Controllers Policy before the DCs were upgraded to Windows Server 2025. What is the LDAP signing behavior afterward?',
    exhibit: `Domain controller: LDAP server signing requirements enforcement   = Disabled
Domain controller: LDAP server signing requirements               = None`,
    options: ['Signing is required, because Windows Server 2025 ignores older policies', 'Unsigned binds are still accepted, because the configured policy is preserved', 'Only simple binds over TLS are accepted', 'LDAP on port 389 stops working entirely'],
    answer: [1],
    explanation: 'Upgrades preserve existing signing policy. With enforcement Disabled, the "LDAP server signing requirements" policy decides, and None does not require signing. The 2025 default of required signing applies to new deployments, or to upgraded servers with no policy configured. The other options misstate the behavior.' },

  // ---------- 2.2 ----------
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L4,
    stem: 'Which cmdlet, with the -Repair switch, fixes a broken machine account password relationship without rejoining the domain?',
    answer: ['Test-ComputerSecureChannel'],
    explanation: '`Test-ComputerSecureChannel -Repair -Credential CORP\\Administrator` resets the secure channel. `Reset-ComputerMachinePassword` also works, but the -Repair switch belongs to `Test-ComputerSecureChannel`.' },
  { topic: '2.2', type: 'single', difficulty: 1, lesson: L4,
    stem: 'Why can you not link a GPO to the default Computers container in a domain?',
    options: ['Computers is a container, not an organizational unit', 'GPOs only link to sites', 'The Computers container is hidden', 'Only Default Domain Policy can apply to computers'],
    answer: [0],
    explanation: 'GPOs link only to sites, domains and OUs. The default Users and Computers are containers, so move objects into your own OUs.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L4,
    stem: 'Refer to the exhibit. Anna cannot sign in with the password you gave her. What is the most likely cause, and the fix?',
    exhibit: `PS C:\\> New-ADUser -Name 'Anna Smith' -SamAccountName asmith -AccountPassword $pw -Path 'OU=Sales,DC=corp,DC=example,DC=com'
PS C:\\> Get-ADUser asmith | Select Name, Enabled
Name        Enabled
----        -------
Anna Smith  False`,
    options: ['The account was created disabled; run Enable-ADAccount asmith', 'The password policy blocks the account; run Unlock-ADAccount', 'The UPN is missing, which blocks all sign-ins', 'The Sales OU is protected from accidental deletion'],
    answer: [0],
    explanation: '`New-ADUser` creates a disabled account unless `-Enabled $true` is given. Enabled shows False. Unlock-ADAccount addresses lockout, a missing UPN does not block pre-Windows 2000 logon, and OU deletion protection is unrelated to sign-in.' },
  { topic: '2.2', type: 'single', difficulty: 1, lesson: L4,
    stem: 'Which feature of Active Directory Administrative Center helps you learn AD cmdlets by showing what each action ran?',
    options: ['Attribute Editor', 'Windows PowerShell History pane', 'Advanced Features view', 'Server Manager dashboard'],
    answer: [1],
    explanation: 'The Windows PowerShell History pane in ADAC lists the exact cmdlets behind GUI actions. The Attribute Editor and Advanced Features belong to ADUC and show raw attributes and hidden containers.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L5,
    stem: 'Which group scope can contain accounts from any domain in the forest and be used to assign permissions in any domain of the forest?',
    options: ['Domain local', 'Global', 'Universal', 'Distribution'],
    answer: [2],
    explanation: 'Universal groups accept members from any domain in the forest and are usable forest-wide. Global groups hold only same-domain accounts, domain local groups are usable only in their own domain, and distribution is a group type, not a scope.' },
  { topic: '2.2', type: 'multi', difficulty: 2, lesson: L5,
    stem: 'Which two objects can be members of a global group in CORP? (Choose two.)',
    options: ['A user account from CORP', 'A user account from the EMEA child domain', 'Another global group from CORP', 'A universal group from CORP', 'A domain local group from CORP'],
    answer: [0, 2],
    explanation: 'A global group takes accounts and other global groups from its own domain only. Accounts from another domain, and universal or domain local groups, cannot be members.' },
  { topic: '2.2', type: 'order', difficulty: 1, lesson: L5,
    stem: 'Order the AGDLP chain from the user to the resource (first at the top).',
    items: ['User account', 'Global group', 'Domain local group', 'Permission on the resource'],
    explanation: 'Accounts go into global groups, global groups go into domain local groups, and the domain local group receives the permissions.' },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L5,
    stem: 'Refer to the exhibit. An admin tries to convert Sales-Users to Universal scope. What happens?',
    exhibit: `Sales-Users   GroupScope: Global     GroupCategory: Security
   Members:   jsmith, mlee
   MemberOf:  AllStaff (GroupScope: Global)`,
    options: ['The conversion succeeds', 'The conversion fails because the group is a member of another global group', 'The conversion fails because it contains user accounts', 'The conversion fails unless the forest is at level 10'],
    answer: [1],
    explanation: 'A global group can become universal only if it is not a member of another global group, because universal groups cannot be members of global groups. Members that are accounts are fine, and no functional level of 2025 is involved.' },
  { topic: '2.2', type: 'fill', difficulty: 1, lesson: L5,
    stem: 'In AGDLP, which group scope receives the resource permissions? Enter the scope name.',
    answer: ['domain local', 'domainlocal', 'domain-local'],
    explanation: 'The D and L in AGDLP stand for domain local, the access group that is placed on the resource ACL.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L6,
    stem: 'What must exist in the forest before you can create a group managed service account?',
    options: ['A Windows Server 2025 functional level', 'A KDS root key', 'An RODC in each site', 'A certificate authority'],
    answer: [1],
    explanation: 'The Key Distribution Service root key (`Add-KdsRootKey`) lets DCs compute gMSA passwords. A gMSA does not need level 10, an RODC or a CA.' },
  { topic: '2.2', type: 'fill', difficulty: 2, lesson: L6,
    stem: 'Which cmdlet, run on an application server, checks that the server can retrieve a gMSA password?',
    answer: ['Test-ADServiceAccount'],
    explanation: '`Test-ADServiceAccount gmsa-web` returns True when the local computer can use the account. `Install-ADServiceAccount` installs it first.' },
  { topic: '2.2', type: 'single', difficulty: 3, lesson: L6,
    stem: 'Refer to the exhibit. FS01 was added to the Web-Servers group ten minutes ago. What is the most likely fix?',
    exhibit: `PS C:\\> Get-ADServiceAccount gmsa-web -Properties PrincipalsAllowedToRetrieveManagedPassword | Select -Expand PrincipalsAllowedToRetrieveManagedPassword
CN=Web-Servers,OU=Groups,DC=corp,DC=example,DC=com

PS C:\\> hostname
FS01
PS C:\\> Test-ADServiceAccount gmsa-web
False`,
    options: ['Restart FS01 so it gets a new Kerberos ticket that includes the group membership', 'Run Add-KdsRootKey again on FS01', 'Set a password on the gMSA with Set-ADAccountPassword', 'Make FS01 a member of Domain Admins'],
    answer: [0],
    explanation: 'Computer group membership is read from the machine\'s Kerberos ticket, so a newly added member needs a restart (or ticket purge) before it can retrieve the password. The root key lives in the forest, not on FS01. A gMSA password is not set by administrators, and Domain Admins would not fix it.' },
  { topic: '2.2', type: 'multi', difficulty: 3, lesson: L6,
    stem: 'Which two statements about delegated managed service accounts (dMSA) in Windows Server 2025 are correct? (Choose two.)',
    options: ['A gMSA cannot be migrated to a dMSA', 'Each migrated service account needs its own dMSA', 'A Windows Server 2022 DC is sufficient for dMSA', 'The administrator can force a password reset on a dMSA', 'Migration deletes the original service account'],
    answer: [0, 1],
    explanation: 'Microsoft documents that gMSAs and sMSAs cannot migrate to a dMSA and that several service accounts cannot share one dMSA. A dMSA needs at least one Windows Server 2025 DC, you cannot force a dMSA password reset, and migration disables (not deletes) the old account; deleting it is discouraged.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L6,
    stem: 'The help desk group must reset passwords for users in the Sales OU only, without becoming administrators. What should you do?',
    options: ['Add the group to Domain Admins', 'Run Delegate Control on the Sales OU and select Reset user passwords', 'Link a GPO to the Sales OU with the reset right', 'Add the group to Account Operators'],
    answer: [1],
    explanation: 'The Delegation of Control Wizard grants a limited right on one OU. Domain Admins and Account Operators grant far more across the domain, and a GPO cannot delegate AD object permissions.' },
  { topic: '2.2', type: 'single', difficulty: 2, lesson: L6,
    stem: 'Which statement about a gMSA password is correct?',
    options: ['It rotates every 30 days by default, and the interval can be set only when the account is created', 'It never rotates', 'Administrators must update it with each rotation', 'The interval can be changed at any time with Set-ADServiceAccount'],
    answer: [0],
    explanation: 'The default rotation is 30 days, and `ManagedPasswordIntervalInDays` can be set only at creation. The password is managed by AD, not by administrators.' },
  { topic: '2.2', type: 'match', difficulty: 2, lesson: L6,
    stem: 'Match each managed service account type to its description.',
    pairs: [['sMSA', 'Managed account usable on a single computer'], ['gMSA', 'Managed account usable by multiple authorized hosts'], ['dMSA', 'Windows Server 2025 account tied to machine identity that can supersede a service account']],
    explanation: 'sMSA is single-host, gMSA is multi-host, and dMSA is the Windows Server 2025 type that binds authentication to the device and can supersede an existing account.' },

  // ---------- 2.3 ----------
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L7,
    stem: 'The domain-linked GPO sets the wallpaper to Blue. A GPO linked to the Sales OU sets it to Green. No GPO is Enforced and nothing blocks inheritance. A Sales user sees which wallpaper?',
    options: ['Blue', 'Green', 'The default Windows wallpaper', 'Whichever GPO was created first'],
    answer: [1],
    explanation: 'In LSDOU the OU policy is applied after the domain policy and overrides the conflicting setting, so Green wins. Creation date has no effect.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. Both GPOs set the screen saver timeout. GPO-Lockdown sets 5 minutes and GPO-Standard sets 15 minutes. What applies to computers in Workstations?',
    exhibit: `Linked Group Policy Objects on OU=Workstations
Link Order   GPO              Enforced   Link Enabled
1            GPO-Lockdown     No         Yes
2            GPO-Standard     No         Yes`,
    options: ['5 minutes', '15 minutes', 'The two values are averaged', 'Neither; a conflict disables both'],
    answer: [0],
    explanation: 'The lowest link order number has the highest precedence, so GPO-Lockdown (order 1) wins. Conflicting settings are not averaged, and conflicts do not cancel both.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L7,
    stem: 'An OU has Block Inheritance set. A domain-level GPO link is marked Enforced. What happens to the domain GPO on that OU?',
    options: ['It is blocked', 'It still applies', 'It applies only to computers', 'It applies only to users'],
    answer: [1],
    explanation: 'Enforced links override Block Inheritance. Block Inheritance stops only non-enforced GPOs from above.' },
  { topic: '2.3', type: 'multi', difficulty: 3, lesson: L7,
    stem: 'You removed Authenticated Users from the security filtering of a GPO and added a group of users instead. The GPO no longer applies. Which two changes restore processing while keeping the filtering? (Choose two.)',
    options: ['Grant Authenticated Users only the Read permission on the GPO', 'Grant Domain Computers the Read permission on the GPO', 'Grant Authenticated Users the Apply group policy permission', 'Add the users to Domain Admins', 'Link the GPO to the Computers container'],
    answer: [0, 1],
    explanation: 'Since MS16-072 the computer account must have Read on the GPO to retrieve it, even for user policy. Giving Authenticated Users or Domain Computers just Read keeps the filter group as the only one with Apply. Granting Apply to Authenticated Users defeats the filtering, Domain Admins is excessive, and the Computers container accepts no link.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L8,
    stem: 'Refer to the exhibit. Why was the WKS - Drive Maps GPO not applied to the signed-in user?',
    exhibit: `The following GPOs were not applied because they were filtered out
-------------------------------------------------------------------
    WKS - Drive Maps
        Filtering:  Denied (Security)`,
    options: ['The user lacks the Apply group policy and Read permission through security filtering', 'The GPO is empty', 'A WMI filter returned False', 'The GPO link is disabled'],
    answer: [0],
    explanation: '"Denied (Security)" means the security filtering and permissions did not allow the object to apply the GPO. An empty GPO shows "Not Applied (Empty)", a WMI result shows "False (WMI)", and a disabled link would not list the GPO.' },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: L8,
    stem: 'Which gpresult switch writes an HTML report? Enter the switch.',
    answer: ['/h', 'gpresult /h'],
    explanation: '`gpresult /h report.html` writes an HTML report. `/x` writes XML, `/r` prints a summary, and `/v` and `/z` are verbose modes.' },
  { topic: '2.3', type: 'fill', difficulty: 1, lesson: L8,
    stem: 'Which command re-applies all Group Policy settings, including unchanged ones, on the local computer?',
    answer: ['gpupdate /force', 'gpupdate -force'],
    explanation: '`gpupdate /force` reapplies all policy. Without it only changed settings are processed.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L7,
    stem: 'Kiosk computers in an OU must apply user settings that depend on the computer, no matter who signs in, and ignore the user\'s own GPOs. What should you configure?',
    options: ['Loopback processing in Replace mode on the computers\' GPO', 'Loopback processing in Merge mode', 'Block Inheritance on the user OU', 'A WMI filter on the user GPO'],
    answer: [0],
    explanation: 'Replace mode discards the user-targeted GPO settings and uses the user settings from GPOs applying to the computer. Merge keeps the user\'s own GPOs and layers computer settings on top. Block Inheritance and WMI filters do not change where user policy comes from.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L7,
    stem: 'Refer to the exhibit. A GPO is linked to the domain with this WMI filter. Which computers receive it?',
    exhibit: `SELECT * FROM Win32_OperatingSystem WHERE ProductType = "3"`,
    options: ['Windows 11 clients', 'Domain controllers', 'Servers that are not domain controllers', 'All Windows computers'],
    answer: [2],
    explanation: 'ProductType is 1 for workstations, 2 for domain controllers and 3 for other servers. The filter therefore matches member and standalone servers only.' },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: L8,
    stem: 'Refer to the exhibit. jsmith is in OU=Sales. A GPO linked to OU=Sales requires 14-character passwords. What minimum password length applies when jsmith changes her domain password?',
    exhibit: `Default Domain Policy (linked to corp.example.com)
   Minimum password length   = 8
GPO "Sales Passwords" (linked to OU=Sales)
   Minimum password length   = 14
Fine-grained password policies: none`,
    options: ['14', '8', '22', 'It is the higher of the two settings only if Enforced'],
    answer: [1],
    explanation: 'Domain account password policy comes only from a GPO linked at the domain root (or a PSO). A password policy in an OU-linked GPO affects only local accounts on computers in that OU, so 8 applies.' },
  { topic: '2.3', type: 'single', difficulty: 3, lesson: L8,
    stem: 'Refer to the exhibit. kpatel is a member of both IT-Admins and Domain Users. Which minimum password length applies to kpatel?',
    exhibit: `PS C:\\> Get-ADFineGrainedPasswordPolicy -Filter * | Select Name, Precedence, MinPasswordLength
Name        Precedence MinPasswordLength
----        ---------- -----------------
PSO-Staff   20         10
PSO-Admins  5          16

PSO-Staff  applies to: Domain Users
PSO-Admins applies to: IT-Admins`,
    options: ['10', '16', '26', 'The Default Domain Policy value'],
    answer: [1],
    explanation: 'When several PSOs apply, the lowest precedence value wins, so PSO-Admins (5) applies, not PSO-Staff (20). Settings are not added together, and the domain policy is used only when no PSO applies.' },
  { topic: '2.3', type: 'fill', difficulty: 2, lesson: L8,
    stem: 'Which cmdlet returns the fine-grained password policy that applies to a specific user?',
    answer: ['Get-ADUserResultantPasswordPolicy'],
    explanation: '`Get-ADUserResultantPasswordPolicy -Identity jsmith` shows the winning PSO, or nothing when the domain policy applies.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L8,
    stem: 'What does Microsoft recommend instead of Software Restriction Policies for controlling which software runs on Windows Server 2025?',
    options: ['Local security policy account lockout', 'AppLocker or App Control for Business', 'Windows Defender Firewall rules', 'Drive map preferences'],
    answer: [1],
    explanation: 'SRP has been deprecated since Windows 10 build 1803 (and applies to Windows Server 2019 and later), and Microsoft points to AppLocker or WDAC/App Control. Firewall rules and preferences do not control which programs run.' },
  { topic: '2.3', type: 'order', difficulty: 1, lesson: L7,
    stem: 'Put the Group Policy processing order in sequence (first applied at the top).',
    items: ['Local policy', 'Site-linked GPOs', 'Domain-linked GPOs', 'OU-linked GPOs'],
    explanation: 'LSDOU: local, site, domain, then OUs from parent to child. Later applications override earlier conflicting settings.' },
  { topic: '2.3', type: 'single', difficulty: 2, lesson: L8,
    stem: 'You want a fine-grained password policy to cover all users in the Finance OU. What should you do?',
    options: ['Link the PSO to the Finance OU', 'Create a global security group containing the Finance users and link the PSO to it', 'Link the PSO to a universal distribution group', 'Link the PSO to the Finance OU\'s GPO'],
    answer: [1],
    explanation: 'A PSO applies only to users and global security groups, never to an OU, so a shadow group mirroring the OU is the standard pattern. Distribution groups are ignored, and a GPO does not carry a PSO.' },
  { topic: '2.3', type: 'single', difficulty: 1, lesson: L8,
    stem: 'Where do you configure a mapped drive that users can change and that supports item-level targeting?',
    options: ['Security Options', 'Group Policy Preferences under User Configuration', 'Administrative Templates under Computer Configuration', 'Software Restriction Policies'],
    answer: [1],
    explanation: 'Drive maps are Group Policy Preferences (User Configuration, Preferences, Windows Settings, Drive Maps), which support item-level targeting and are not locked for the user. The other areas do not contain drive maps.' },
];

export default bank.map((item, i) => ({ id: `d2-${String(i + 1).padStart(3, '0')}`, ...item }));
