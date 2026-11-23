// Domain 1 — Manage Azure identities and governance. Original questions in Microsoft exam styles (study guide wording,
// exam sandbox item types); no recalled exam content. Facts checked on Microsoft Learn on 2026-11-23. Every RBAC and Policy
// item was worked from its exhibit (assignments, scopes, effects); see the explanation of each. Portal text and command
// output in exhibits are documentation-based and listed in REVIEW-TODO.md.
const L_UG = '1.1-users-groups';
const L_LIC = '1.1-licenses';
const L_EXT = '1.1-external-users';
const L_SSPR = '1.1-sspr';
const L_ROLES = '1.2-rbac-roles';
const L_ASSIGN = '1.2-assign-roles';
const L_ACCESS = '1.2-interpret-access';
const L_POL = '1.3-azure-policy';
const L_LT = '1.3-locks-tags';
const L_RGS = '1.3-resource-groups-subscriptions';
const L_MG = '1.3-management-groups';
const L_COST = '1.3-cost-management';

const bank = [
  // ---------- 1.1 Microsoft Entra users and groups ----------
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_LIC,
    stem: 'Refer to the exhibit. You try to assign a Microsoft 365 E3 license directly to User3 in the Microsoft 365 admin center and the assignment fails. User1 and User2 were licensed the same way without problems. What should you do first?',
    exhibit: `User    UserType  Source                 Usage location  Account enabled
------  --------  ---------------------  --------------  ---------------
User1   Member    Microsoft Entra ID     US              Yes
User2   Member    Windows Server AD      GB              Yes
User3   Member    Microsoft Entra ID     (not set)       Yes

Microsoft 365 E3: 25 purchased, 11 assigned`,
    options: ['Set the Usage location property of User3', 'Purchase additional Microsoft 365 E3 licenses', 'Change User3 to a synchronized account so that it matches User2', 'Add User3 to a group that has Microsoft 365 E3 assigned, because direct assignment is not supported for cloud-only users'],
    answer: [0],
    explanation: "A license can't be assigned directly to a user who has no usage location, because some services aren't available in every country. Set it (for example `US`) and assign again. There are 14 licenses free, so buying more is unnecessary. Synchronized and cloud-only users can both be licensed directly; User1 proves cloud-only direct assignment works. Group-based licensing would fall back to the tenant location, but it is not required and the question asks what to fix first.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_UG,
    stem: 'Refer to the exhibit. An administrator is creating a group in the Microsoft Entra admin center. The tenant has Microsoft Entra ID P1 licenses for all users. The Membership type list shows only Assigned. Why?',
    exhibit: `New group
  Group type:                                         Security
  Group name:                                         sg-helpdesk-admins
  Microsoft Entra roles can be assigned to the group: Yes
  Membership type:                                    Assigned   (no other values listed)
  Owners:                                             Admin1
  Members:                                            No members selected`,
    options: ['Groups that can be assigned Microsoft Entra roles always use Assigned membership', 'Dynamic membership is available only for Microsoft 365 groups', 'Dynamic membership requires Microsoft Entra ID P2', 'A group with an owner cannot use dynamic membership'],
    answer: [0],
    explanation: "Turning on **Microsoft Entra roles can be assigned to the group** automatically selects **Assigned** membership; role-assignable groups cannot be dynamic. Security groups support dynamic user and device membership, which needs P1 (not P2), and the tenant has P1. Dynamic groups can still have owners; owners just can't add members by hand.",
  },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L_UG,
    stem: 'Refer to the exhibit. The tenant has Microsoft Entra ID P1 for all users. After membership processing completes, how many users are members of dyn-sales-us? Enter a number.',
    exhibit: `Group: dyn-sales-us   Type: Security   Membership type: Dynamic User
Rule:  (user.department -eq "Sales") -and (user.usageLocation -eq "US")

User    department   usageLocation  accountEnabled
------  -----------  -------------  --------------
User1   Sales        US             true
User2   sales        US             true
User3   Sales        CA             true
User4   Sales        US             false
User5   Marketing    US             true`,
    answer: ['3', 'three'],
    explanation: "User1 matches both conditions. User2 also matches: string comparisons in dynamic membership rules are not case sensitive, so `sales` equals `Sales`. User4 matches because the rule does not test `accountEnabled`; a disabled account is still a member. User3 fails the usage location test and User5 the department test. Members: User1, User2, User4 = **3**.",
  },
  { topic: '1.1', type: 'multi', difficulty: 1, lesson: L_UG,
    stem: 'Which two statements about Microsoft Entra groups are true? (Choose two.)',
    options: ['A security group can contain devices and service principals as members', 'A Microsoft 365 group can contain another Microsoft 365 group as a member', 'A dynamic membership rule can combine user attributes and device attributes in one group', 'You can switch an existing group from Assigned to Dynamic User membership without changing its object ID', 'A deleted user can be restored from Deleted users for 90 days'],
    answer: [0, 3],
    explanation: "Security groups accept users, devices, service principals and other security groups. A group's membership type can be changed in its Properties; it keeps its name and ID (existing members who don't match the new rule are removed). Microsoft 365 groups contain users only, so no nesting. A dynamic rule targets users or devices, never both. Deleted users (and deleted Microsoft 365 groups) can be restored for **30** days, not 90.",
  },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L_UG,
    stem: 'Refer to the exhibit. HR gives you a spreadsheet of 400 new employees who need cloud-only accounts in contoso.com next week. You need to create the accounts with the least administrative effort and without writing code. What should you use?',
    exhibit: `new-hires.csv (first rows)
Name,User name,Initial password,Department,Usage location
Ana Ruiz,ana.ruiz@contoso.com,<password>,Sales,US
Raj Patel,raj.patel@contoso.com,<password>,Finance,GB
... 398 more rows`,
    options: ['Bulk create in the Users area of the Microsoft Entra admin center, using the downloaded CSV template', 'Bulk invite in the Users area of the Microsoft Entra admin center', 'A dynamic membership group with a rule on the department attribute', 'Microsoft Entra Connect to synchronize the spreadsheet to Microsoft Entra ID'],
    answer: [0],
    explanation: "**Bulk create** takes a CSV template whose only required columns are Name, User name and Initial password, and creates internal member accounts. **Bulk invite** creates B2B guest users and sends invitations, which is wrong for employees. A dynamic group only groups existing users. Microsoft Entra Connect synchronizes from Windows Server Active Directory, not from a spreadsheet.",
  },
  { topic: '1.1', type: 'match', difficulty: 2, lesson: L_EXT,
    stem: 'Match each requirement to the setting or role that meets it with the least privilege.',
    pairs: [
      ['Help desk staff must invite guest users while guest invitations are limited to users with specific admin roles', 'Guest Inviter role'],
      ['Invitations may only ever be sent to addresses in fabrikam.com', 'Collaboration restrictions: allow invitations only to the specified domains'],
      ['Guests must be able to see only their own profile in the directory', 'Guest user access restricted to properties and memberships of their own directory objects'],
      ['Users from the Fabrikam tenant who already did MFA at Fabrikam must not be prompted for MFA again by Contoso Conditional Access', 'Cross-tenant access inbound trust settings for the Fabrikam organization'],
      ['Support staff in Paris must reset passwords only for users who work in France', 'Helpdesk Administrator role scoped to an administrative unit containing the French users'],
    ],
    explanation: "Guest Inviter lets non-admins invite even when invitations are limited to admin roles. Collaboration restrictions in external collaboration settings hold an allow list or a deny list of domains. The most restrictive Guest user access option limits guests to their own objects. Trusting another tenant's MFA claims is an inbound **trust setting** in cross-tenant access settings, per organization. Administrative units scope Microsoft Entra roles to a subset of users.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_EXT,
    stem: 'Refer to the exhibit. An administrator ran the script in Azure Cloud Shell. The command succeeded and the guest appears in the directory, but John says he never received an email. What is the most likely reason?',
    exhibit: `Connect-MgGraph -Scopes "User.Invite.All"
New-MgInvitation -InvitedUserEmailAddress 'john@fabrikam.com' -InvitedUserDisplayName 'John (Fabrikam)' -InviteRedirectUrl 'https://myapps.microsoft.com'`,
    options: ['SendInvitationMessage was not set to true, so no invitation email was sent', 'InvitedUserType must be set to Guest for an email to be sent', 'The redirect URL must point to the Azure portal', 'User.Invite.All does not allow creating guest users'],
    answer: [0],
    explanation: "`New-MgInvitation` sends the invitation email only with `-SendInvitationMessage:$true`. Without it, the guest object is created and the output includes a redeem URL that you must give the user yourself. Guest is already the default user type. Any redirect URL (My Apps is typical) is valid. `User.Invite.All` is the permission for creating invitations, and the guest was created.",
  },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L_EXT,
    stem: 'Refer to the exhibit. Enter the user principal name that the invited user will have in the Contoso tenant.',
    exhibit: `Tenant:            Contoso   (initial domain contoso.onmicrosoft.com)
Action:            Users > New user > Invite external user
Email:             john@fabrikam.com
Display name:      John Fabrikam
User type result:  Guest`,
    answer: ['john_fabrikam.com#EXT#@contoso.onmicrosoft.com'],
    explanation: "A B2B collaboration user's UPN is the email address with `@` replaced by `_`, followed by `#EXT#` and `@` the inviting tenant's initial domain: `john_fabrikam.com#EXT#@contoso.onmicrosoft.com`. The `#EXT#` marker is how you recognise external users.",
  },
  { topic: '1.1', type: 'multi', difficulty: 3, lesson: L_SSPR,
    stem: 'Refer to the exhibit. All users have Microsoft Entra ID P1 licenses and are cloud-only. Which two users can reset their own password by using SSPR? (Choose two.)',
    exhibit: `Password reset > Properties
  Self service password reset enabled:  Selected
  Selected group:                       sg-sspr-pilot
Password reset > Authentication methods
  Number of methods required to reset:  2
  Methods available to users:           Mobile app notification, Email OTP, SMS

User    Member of sg-sspr-pilot   Microsoft Entra role    Registered methods
------  -----------------------   ---------------------   ------------------------------
User1   Yes                       None                    Email OTP, SMS
User2   No                        None                    Email OTP, SMS
User3   Yes                       None                    SMS
Admin1  No                        Helpdesk Administrator  Mobile app notification, SMS`,
    options: ['User1', 'User2', 'User3', 'Admin1'],
    answer: [0, 3],
    explanation: "**User1** is in the selected group and registered two enabled methods, meeting the requirement of 2. **User2** is not in sg-sspr-pilot, so SSPR is not enabled for them. **User3** is enabled but registered only one method when two are required, so they are told to contact an administrator. **Admin1** holds an administrator role (Helpdesk Administrator is on the two-gate list); administrators are enabled for SSPR by default under the fixed two-gate policy regardless of the Selected scope (nothing in the exhibit says admin SSPR was turned off with `AllowedToUseSspr`), and Admin1 has two distinct methods registered that the policy allows.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_SSPR,
    stem: 'Contoso synchronizes users from Windows Server Active Directory by using Microsoft Entra Connect Sync with password hash synchronization. Users must be able to reset forgotten passwords from aka.ms/sspr and then sign in to domain-joined computers with the new password. Users are licensed for Microsoft 365 Business Standard. What must you do?',
    options: ['Acquire Microsoft Entra ID P1 (or Microsoft 365 Business Premium) licenses and enable password writeback in Microsoft Entra Connect and in the Password reset On-premises integration page', 'Enable SSPR for All users; Business Standard includes writeback for synchronized users', 'Switch Microsoft Entra Connect from password hash synchronization to pass-through authentication; writeback is not supported with hash sync', 'Set the number of methods required to reset to 2, which enables on-premises writeback automatically'],
    answer: [0],
    explanation: "Hybrid users need **password writeback** so a cloud reset reaches on-premises AD, and writeback requires Microsoft Entra ID P1 or P2 or Microsoft 365 Business Premium; Business Standard covers only cloud-user reset. Writeback is turned on in the sync engine (Connect Sync optional feature or cloud sync) and in **Password reset > On-premises integration**. It works with hash sync, pass-through authentication and federation. The number of methods has nothing to do with writeback.",
  },
  { topic: '1.1', type: 'order', difficulty: 2, lesson: L_SSPR,
    stem: 'Contoso already has P1 licenses, Microsoft Entra Connect Sync and SSPR enabled for all users. You must let synchronized users reset their passwords in the cloud and have the change written to Active Directory. Put the steps in order.',
    items: ['On the Microsoft Entra Connect server, open the wizard and choose Customize synchronization options', 'On the Optional features page, select Password writeback and finish the wizard', 'In the Microsoft Entra admin center, open Password reset > On-premises integration', 'Turn on Write back passwords to your on-premises directory and save', 'Test with a synchronized user at aka.ms/sspr and sign in on-premises with the new password'],
    explanation: "Writeback is enabled in two places: first in the sync engine (Connect Sync wizard > Customize synchronization options > Optional features > Password writeback), then in the SSPR **On-premises integration** settings, which only show writeback as available once the sync engine has it. Testing comes last.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_LIC,
    stem: 'Refer to the exhibit. The script must assign Office 365 E3 directly to ben@contoso.com, who was created yesterday with no usage location. The last command fails. What should you add before the last command?',
    exhibit: `Connect-MgGraph -Scopes "User.ReadWrite.All","Organization.Read.All"
$sku = Get-MgSubscribedSku | Where-Object SkuPartNumber -eq 'ENTERPRISEPACK'
Set-MgUserLicense -UserId 'ben@contoso.com' -AddLicenses @{SkuId = $sku.SkuId} -RemoveLicenses @()`,
    options: ["Update-MgUser -UserId 'ben@contoso.com' -UsageLocation 'US'", "Set-MgGroupLicense -GroupId <group-id> -AddLicenses @{SkuId = $sku.SkuId} -RemoveLicenses @()", "New-MgInvitation -InvitedUserEmailAddress 'ben@contoso.com'", "Connect-MgGraph -Scopes 'Directory.AccessAsUser.All'"],
    answer: [0],
    explanation: "A direct license assignment needs the user's **usage location**; set it with `Update-MgUser -UsageLocation`, then `Set-MgUserLicense` succeeds. Assigning to a group is a different method and would need Ben to be a member. `New-MgInvitation` creates B2B guests. The scopes already allow writing users; the failure is the missing property, not permissions.",
  },
  { topic: '1.1', type: 'single', difficulty: 2, lesson: L_LIC,
    stem: 'Refer to the exhibit. Microsoft 365 E3 is assigned to the group lic-m365-e3 by using group-based licensing, and enough licenses are available. Which users receive the license through this group?',
    exhibit: `Group lic-m365-e3 (Security, Assigned)
  Members:
    User1           (user)
    sg-sales        (group)
       Members: User2, User3
    User4           (user)`,
    options: ['User1 and User4 only', 'User1, User2, User3 and User4', 'User2 and User3 only', 'No users, because a licensed group cannot contain another group'],
    answer: [0],
    explanation: "Group-based licensing does not support nested groups: only direct members of the licensed group get the license, so User1 and User4. A group can still contain another group; the nested group's members simply receive nothing from this assignment. To license User2 and User3, assign the product to sg-sales as well or add them directly.",
  },
  { topic: '1.1', type: 'multi', difficulty: 2, lesson: L_LIC,
    stem: 'Refer to the exhibit. Which two actions resolve the error for User30 and similar users? (Choose two.)',
    exhibit: `Billing > Licenses > Microsoft 365 E3 > Errors & issues
Group          User     Error
-------------  -------  ------------------------
lic-m365-e3    User30   Not enough licenses
lic-m365-e3    User31   Not enough licenses

Microsoft 365 E3: 120 purchased, 120 assigned`,
    options: ['Purchase additional Microsoft 365 E3 licenses', 'Remove users who no longer need Microsoft 365 E3 from lic-m365-e3 or from direct assignments, then reprocess', 'Set the usage location of User30 and User31', 'Assign Microsoft 365 E3 to the group again with all service plans enabled', 'Convert lic-m365-e3 to a dynamic membership group'],
    answer: [0, 1],
    explanation: "All 120 licenses are consumed, so new members fail with **Not enough licenses**. Either buy more or free licenses held by users who no longer need them, then reprocess. Usage location produces a different error. Re-assigning the product or changing the membership type doesn't create licenses.",
  },
  { topic: '1.1', type: 'single', difficulty: 3, lesson: L_UG,
    stem: 'Refer to the exhibit. HelpdeskFR must reset the password of User12, a member of sg-paris-staff, and receives an access error. What should you do?',
    exhibit: `Administrative unit: AU-France
  Members:              sg-paris-staff (group)
  Role assignments:     HelpdeskFR - Helpdesk Administrator (scope: AU-France)

Group sg-paris-staff members: User11, User12, User13
HelpdeskFR has no other Microsoft Entra role assignments.`,
    options: ['Add User11, User12 and User13 directly to AU-France as members', 'Assign HelpdeskFR the Helpdesk Administrator role at the organization scope', 'Make HelpdeskFR an owner of sg-paris-staff', 'Assign HelpdeskFR the User Access Administrator role on the subscription'],
    answer: [0],
    explanation: "Adding a group to an administrative unit brings only the **group object** into scope, not its members. To manage the users, add them to the AU as members (the AU can also use a dynamic rule, which needs P1 per member). Tenant-wide Helpdesk Administrator would work but breaks the least-privilege intent of the AU. Group ownership manages membership, not passwords. User Access Administrator is an Azure role and has no effect on Microsoft Entra users.",
  },
  { topic: '1.1', type: 'single', difficulty: 1, lesson: L_EXT,
    stem: 'A consultant who works for Fabrikam and has a fabrikam.com Microsoft Entra account must create and manage virtual machines in the rg-app-dev resource group of the Contoso-Dev subscription for three months. You need the least administrative effort and least privilege. What should you do?',
    options: ['Invite the consultant as a B2B guest and assign Virtual Machine Contributor at the rg-app-dev scope', 'Create a contoso.com user account for the consultant and assign Contributor at the Contoso-Dev subscription scope', 'Invite the consultant as a B2B guest and assign the User Administrator Microsoft Entra role', 'Add the Fabrikam tenant to cross-tenant access settings and assign Owner on rg-app-dev to the Fabrikam tenant'],
    answer: [0],
    explanation: "A B2B guest keeps their own Fabrikam credentials and can be given Azure roles like any user. Virtual Machine Contributor at the resource group is the narrowest fit. A new contoso.com account means another password to manage, and Contributor on the whole subscription is too broad. User Administrator is a directory role that grants no Azure resource access. Roles are assigned to principals, not to tenants.",
  },
  { topic: '1.1', type: 'fill', difficulty: 2, lesson: L_EXT,
    stem: 'Refer to the exhibit. User5 is a member user with no Microsoft Entra roles. User5 must be able to invite guest users. Enter the name of the Microsoft Entra built-in role that grants this with the least privilege.',
    exhibit: `External Identities > External collaboration settings
  Guest user access:
    ( ) Guest users have the same access as members (most inclusive)
    (o) Guest users have limited access to properties and memberships of directory objects
    ( ) Guest user access is restricted to properties and memberships of their own directory objects (most restrictive)
  Guest invite settings:
    ( ) Anyone in the organization can invite guest users including guests and non-admins (most inclusive)
    ( ) Member users and users assigned to specific admin roles can invite guest users including guests with member permissions
    (o) Only users assigned to specific admin roles can invite guest users
    ( ) No one in the organization can invite guest users including admins (most restrictive)`,
    answer: ['Guest Inviter'],
    explanation: "With **Only users assigned to specific admin roles can invite guest users**, a member like User5 can't invite. The **Guest Inviter** role grants exactly that ability, and Microsoft Learn notes it works even with this setting selected. User Administrator would also work but grants far more.",
  },
  { topic: '1.1', type: 'single', difficulty: 3, lesson: L_EXT,
    stem: 'Contoso and Fabrikam both use Microsoft Entra ID. Neither has changed its cross-tenant access settings. Contoso users can invite Fabrikam users as guests without problems, but Teams shared channels between the two organizations fail. What should you do?',
    options: ['In both tenants, add the other organization under Organizational settings and allow B2B direct connect inbound and outbound', 'In the Contoso tenant, change Guest invite settings to Anyone in the organization can invite guest users', 'In the Contoso tenant, add fabrikam.com to the collaboration restrictions allow list', 'In the Fabrikam tenant, enable guest self-service sign-up via user flows'],
    answer: [0],
    explanation: "By default B2B collaboration is allowed and **B2B direct connect**, which Teams shared channels use, is blocked for all external tenants. It needs a mutual trust: each tenant configures the other in **Organizational settings** with direct connect allowed in the needed directions. Guest invite settings, domain allow lists and self-service sign-up concern B2B collaboration (guest objects), which already works.",
  },

  // ---------- 1.2 Manage access to Azure resources ----------
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ACCESS,
    stem: 'Refer to the exhibit. User1 must change the firewall settings of the storage account stcontosoweb01 in rg-web-prod. What access does User1 currently have to stcontosoweb01?',
    exhibit: `Group membership
  User1 is a member of sg-web-ops
  sg-web-ops is a member of sg-it-all

Role assignments in subscription Contoso-Prod
Principal    Role                          Scope
-----------  ----------------------------  ------------------------------------------
sg-it-all    Reader                        Subscription Contoso-Prod
sg-web-ops   Virtual Machine Contributor   Resource group rg-web-prod
User1        Storage Blob Data Reader      Storage account stcontosodata01 (rg-data-prod)`,
    options: ['User1 can view the storage account but cannot change its firewall settings', 'User1 can change the firewall settings because Virtual Machine Contributor applies to every resource in rg-web-prod', 'User1 has no access because Reader assigned to sg-it-all does not apply to members of nested groups', 'User1 can change the firewall settings because Storage Blob Data Reader applies to all storage accounts in the subscription'],
    answer: [0],
    explanation: "Work it out by scope. Reader at the subscription reaches User1 through nesting (User1 > sg-web-ops > sg-it-all) and inherits down to stcontosoweb01: view only. Virtual Machine Contributor at rg-web-prod also reaches the account's scope, but it manages VMs; for storage accounts it includes only read and list keys, not write, so no firewall change. Storage Blob Data Reader is scoped to a different account (stcontosodata01) and is data plane only. Group nesting is transitive in Azure RBAC.",
  },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L_ACCESS,
    stem: 'Refer to the exhibit. User2 successfully deletes the subnet snet-test from vnet-hub. Enter the name of the role, as assigned in the exhibit, that allows this.',
    exhibit: `User2 is a member of sg-net-admins and sg-helpdesk.
vnet-hub is in resource group rg-net-prod.

Principal       Role                          Scope
--------------  ----------------------------  ----------------------------
sg-helpdesk     Reader                        Subscription Contoso-Prod
sg-net-admins   Network Contributor           Resource group rg-net-prod
User2           Virtual Machine Contributor   Resource group rg-app-prod`,
    answer: ['Network Contributor'],
    explanation: "Deleting a subnet is a write to Microsoft.Network in rg-net-prod. **Network Contributor** at rg-net-prod (through sg-net-admins) covers it. Reader can't delete anything. Virtual Machine Contributor is scoped to rg-app-prod, which doesn't contain vnet-hub, and it doesn't manage virtual networks anyway.",
  },
  { topic: '1.2', type: 'multi', difficulty: 3, lesson: L_ACCESS,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `Group membership
  GroupA members: User3, GroupB
  GroupB members: User4

Principal   Role                        Scope
---------   --------------------------  ------------------------------
GroupA      Contributor                 Resource group rg-dev
GroupB      Reader                      Subscription Contoso-Dev
User4       User Access Administrator   Resource group rg-test
(rg-dev and rg-test are both in Contoso-Dev)`,
    options: ['User4 can create a virtual machine in rg-dev', 'User3 can view the resources in rg-test', 'User4 can assign the Reader role to another user on rg-test', 'User3 can assign the Reader role to another user on rg-dev', 'User4 can create a storage account in rg-test'],
    answer: [0, 2],
    explanation: "Membership flows down the nesting: User4 is in GroupB, which is in GroupA, so User4 gets GroupA's **Contributor on rg-dev** (can create a VM) plus GroupB's Reader and their own **User Access Administrator on rg-test** (can assign roles there). User3 is only in GroupA: Contributor on rg-dev and nothing on rg-test, because GroupB's Reader applies to GroupB's members, not to GroupA's. Contributor cannot assign roles. User4 has only Reader and User Access Administrator on rg-test, neither of which creates resources.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_ROLES,
    stem: 'Refer to the exhibit. User5 tries to delete vm-app-01 in rg-app-prod and then vm-web-01 in rg-web-prod. What happens?',
    exhibit: `Custom role definition
{
  "Name": "Contoso VM Operator",
  "IsCustom": true,
  "Actions": [
    "Microsoft.Compute/virtualMachines/*",
    "Microsoft.Resources/subscriptions/resourceGroups/read"
  ],
  "NotActions": [ "Microsoft.Compute/virtualMachines/delete" ],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": [ "/subscriptions/00000000-0000-0000-0000-000000000000" ]
}

Role assignments for User5
Role                          Scope
----------------------------  ------------------------------------
Contoso VM Operator           Subscription (00000000-...)
Virtual Machine Contributor   Resource group rg-app-prod`,
    options: ['vm-app-01 is deleted; deleting vm-web-01 fails', 'Both deletions fail because NotActions in Contoso VM Operator denies virtualMachines/delete everywhere in the subscription', 'Both VMs are deleted because Contoso VM Operator grants Microsoft.Compute/virtualMachines/*', 'Deleting vm-app-01 fails and vm-web-01 is deleted'],
    answer: [0],
    explanation: "Contoso VM Operator grants `virtualMachines/*` minus `delete`, so on its own it can't delete. In rg-app-prod User5 also has Virtual Machine Contributor, which includes `Microsoft.Compute/virtualMachines/*` with no exclusion. Permissions are the union of roles and **NotActions is not a deny**, so vm-app-01 is deleted. In rg-web-prod only the custom role applies, so deleting vm-web-01 fails. Only a deny assignment would block across roles.",
  },
  { topic: '1.2', type: 'fill', difficulty: 2, lesson: L_ASSIGN,
    stem: 'Refer to the exhibit. The script runs immediately after the managed identity is enabled, and you want to avoid failures caused by the identity not yet being visible to Microsoft Graph. Enter the missing parameter, including its leading dashes.',
    exhibit: `mi=$(az vm show -g rg-app-prod -n vm-app-01 --query identity.principalId -o tsv)
st=$(az storage account show -g rg-data-prod -n stcontosodata01 --query id -o tsv)

az role assignment create \\
  --assignee-object-id $mi \\
  ____________________ ServicePrincipal \\
  --role "Storage Blob Data Reader" \\
  --scope $st`,
    answer: ['--assignee-principal-type', 'assignee-principal-type'],
    explanation: "`--assignee-object-id` with `--assignee-principal-type ServicePrincipal` creates the assignment without looking up the principal in Microsoft Graph, which avoids errors from replication delay for a just-created managed identity. `--assignee` would look up the object. The role and scope are already given.",
  },
  { topic: '1.2', type: 'fill', difficulty: 1, lesson: L_ASSIGN,
    stem: 'Refer to the exhibit. The command must give user1@contoso.com the Reader role on the resource group rg-web-prod. Enter the missing parameter name, including the leading dash.',
    exhibit: `New-AzRoleAssignment -SignInName 'user1@contoso.com' -RoleDefinitionName 'Reader' ____________ 'rg-web-prod'`,
    answer: ['-ResourceGroupName', 'ResourceGroupName'],
    explanation: "`-ResourceGroupName` takes the group's name and sets the scope to that resource group. `-Scope` would need the full ID (`/subscriptions/<id>/resourceGroups/rg-web-prod`), not just the name. `-SignInName` and `-RoleDefinitionName` identify the user and role.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ASSIGN,
    stem: 'Admin1 holds User Access Administrator on the Contoso-Prod subscription. Admin1 wants Dara, a backup operator, to be able to assign only the Backup Contributor and Backup Reader roles, and only to the sg-backup-ops group. What should Admin1 assign to Dara?',
    options: ['Role Based Access Control Administrator with a condition that constrains the roles and principals Dara can assign', 'User Access Administrator at the subscription scope', 'Owner on the Recovery Services vault', 'Backup Contributor with a condition that allows role assignment'],
    answer: [0],
    explanation: "**Role Based Access Control Administrator** is designed for delegating role assignment, and a condition can restrict which roles and which principals the delegate may assign. User Access Administrator and Owner would let Dara assign any role, including Owner. Backup Contributor has no role assignment permission for a condition to narrow.",
  },
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L_ROLES,
    stem: 'User2 has the Contributor role on the rg-app-prod resource group. User2 tries to give a colleague the Reader role on rg-app-prod and the Add role assignment option is unavailable. Why?',
    options: ['Contributor excludes Microsoft.Authorization write and delete operations, which role assignment requires', 'Role assignments can only be created at subscription scope', 'Reader can only be assigned by a Global Administrator', 'The colleague must first be assigned a Microsoft Entra role'],
    answer: [0],
    explanation: "Contributor's NotActions include `Microsoft.Authorization/*/Write` and `/Delete`, so it can't create role assignments. Owner, User Access Administrator or Role Based Access Control Administrator can. Roles can be assigned at management group, subscription, resource group or resource scope, and no Microsoft Entra role is needed to receive an Azure role.",
  },
  { topic: '1.2', type: 'match', difficulty: 2, lesson: L_ROLES,
    stem: 'Match each requirement to the built-in role that meets it with the least privilege.',
    pairs: [
      ['Auditors must view every resource in all subscriptions under the mg-contoso-prod management group', 'Reader'],
      ['An app must read blobs in one storage account by using Microsoft Entra authentication', 'Storage Blob Data Reader'],
      ['A finance analyst must create and edit budgets for a subscription without changing any resources', 'Cost Management Contributor'],
      ['Operators must create and manage virtual machines and their disks but not virtual networks', 'Virtual Machine Contributor'],
      ['A governance team must add and change tags on resources without having access to the resources themselves', 'Tag Contributor'],
    ],
    explanation: "Reader at the management group inherits read access to every subscription below. Storage Blob Data Reader is the data plane role for reading blobs. Cost Management Contributor manages budgets and exports without resource rights. Virtual Machine Contributor manages VMs, disks and NICs but not the VNet. Tag Contributor writes `Microsoft.Resources/tags` without access to the entities.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ACCESS,
    stem: 'The only Owner of the Contoso-Legacy subscription left the company and their account was deleted. Admin1 is a Global Administrator in the Microsoft Entra tenant but cannot see Contoso-Legacy in the Azure portal. Admin1 must give User9 the Owner role on the subscription. What should Admin1 do first?',
    options: ['Set Access management for Azure resources to Yes on the Microsoft Entra ID Properties page', 'Assign themselves the Privileged Role Administrator Microsoft Entra role', 'Open a support request to transfer billing ownership of the subscription', 'Restore the deleted Owner account and sign in as that user'],
    answer: [0],
    explanation: "Microsoft Entra roles do not grant Azure access. Turning on **Access management for Azure resources** gives the signed-in Global Administrator User Access Administrator at root scope, from which Admin1 can assign Owner on the subscription to User9, then turn the setting off. Privileged Role Administrator is still a directory role. Billing transfer changes who pays, not access. Signing in as another person's account is not an acceptable practice and may be impossible.",
  },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L_ACCESS,
    stem: 'Which two statements about elevating access for a Global Administrator are true? (Choose two.)',
    options: ['It assigns the User Access Administrator role at the root scope (/)', 'It applies only to the Global Administrator who changes the setting', 'It assigns the Owner role on every subscription in the tenant', 'It can be turned on by any user with the User Administrator role', 'It permanently converts the Global Administrator role into an Azure role'],
    answer: [0, 1],
    explanation: "Elevation gives **User Access Administrator at `/`**, which can assign roles anywhere but does not itself manage resources. The toggle is per user (you can't elevate every Global Administrator at once) and only Global Administrators have it; it is removed by the same user or by another elevated Global Administrator. It does not assign Owner, and nothing is converted permanently.",
  },
  { topic: '1.2', type: 'single', difficulty: 1, lesson: L_ACCESS,
    stem: 'An old runbook documents that "Ben is a Co-Administrator of Contoso-Legacy". You must give Ben equivalent access by using supported methods. What should you do?',
    options: ['Assign Ben the Owner role at the subscription scope by using Azure RBAC', 'Add Ben as a Co-Administrator on the Classic administrators tab', 'Make Ben the Account Administrator of the billing account', 'Assign Ben the Global Administrator Microsoft Entra role'],
    answer: [0],
    explanation: "Co-Administrator and Service Administrator were retired on August 31, 2024; from December 2025 remaining holders were converted to Owner at subscription scope, and as of May 2026 the Classic administrators tab is gone. The Azure RBAC equivalent is **Owner at subscription scope** (Microsoft suggests a narrower role if possible). Account Administrator is a billing role. Global Administrator grants no Azure resource access.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_ACCESS,
    stem: 'Refer to the exhibit. User6 cannot delete the storage account stappdata01 in rg-app. What is the cause?',
    exhibit: `rg-app > Access control (IAM) > Check access > User6

Role assignments
  Role    Scope
  Owner   Subscription Contoso-Prod (Inherited)

Deny assignments
  Name:               Deny assignment '00000000-0000-0000-0000-000000000000' created by Deployment Stack
                      '/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-app/providers/Microsoft.Resources/deploymentStacks/stack-app'
  Denied actions:     */delete
  Scope:              /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-app
  Excluded principals: (the deployment stack's managing identity)`,
    options: ['The deny assignment created by the deployment stack blocks delete actions, and deny assignments take precedence over role assignments', 'Owner inherited from the subscription does not apply at resource group scope', 'Owner excludes delete actions in its NotActions', 'User6 must also be assigned Storage Account Contributor on stappdata01'],
    answer: [0],
    explanation: "Resource Manager checks deny assignments before role assignments; a matching deny blocks the action even for an Owner. This deny was created by the **deployment stack** (deny settings), so the fix is to manage the resource through the stack or change its deny settings. Inherited Owner applies at every child scope, Owner has no NotActions, and adding another role cannot override a deny.",
  },
  { topic: '1.2', type: 'order', difficulty: 2, lesson: L_ACCESS,
    stem: 'Admin1 is a Global Administrator with no Azure role assignments. Admin1 must give User9 the Owner role on an orphaned subscription and leave no unnecessary elevated access. Put the steps in order.',
    items: ['Sign in to the Azure portal as Admin1', 'Open Microsoft Entra ID > Properties and set Access management for Azure resources to Yes, then save', 'Sign out and sign back in to refresh the access token', 'On the subscription, open Access control (IAM) and assign Owner to User9', 'Return to Microsoft Entra ID > Properties and set Access management for Azure resources to No'],
    explanation: "Elevation is a per-user toggle on the Microsoft Entra ID **Properties** page. After saving it, sign out and in so the new User Access Administrator assignment at root scope is in the token. Assign the role, then remove the elevation with the same account.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ROLES,
    stem: 'User8 has the Owner role on the Contoso-Prod subscription. The storage account stcontosodata01 has Allow storage account key access disabled. In the portal, User8 opens a blob container and the authentication method switches to Microsoft Entra user account, but listing blobs fails with an authorization error. What should you do so that User8 can read blobs, following least privilege?',
    options: ['Assign User8 the Storage Blob Data Reader role on stcontosodata01', 'Assign User8 the Storage Account Contributor role on stcontosodata01', 'Assign User8 the Owner role on stcontosodata01', 'Assign User8 the Reader role on the container'],
    answer: [0],
    explanation: "Owner's `*` covers control plane actions only; reading blob data with Microsoft Entra authentication needs a role with **DataActions**, such as **Storage Blob Data Reader**. Storage Account Contributor and Owner are control plane roles (they could list keys, but key access is disabled here). Reader has no data actions.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_ROLES,
    stem: 'Refer to the exhibit. The custom role is created successfully. When you try to assign it to sg-data-team at the mg-contoso-data management group scope, the assignment fails. What should you do?',
    exhibit: `{
  "Name": "Contoso Blob Auditor",
  "IsCustom": true,
  "Actions": [ "Microsoft.Storage/storageAccounts/blobServices/containers/read" ],
  "NotActions": [],
  "DataActions": [ "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read" ],
  "NotDataActions": [],
  "AssignableScopes": [ "/providers/Microsoft.Management/managementGroups/mg-contoso-data" ]
}`,
    options: ['Assign the role at the scope of each subscription under mg-contoso-data', 'Add the root scope "/" to AssignableScopes', 'Move DataActions into Actions', 'Add a second management group to AssignableScopes'],
    answer: [0],
    explanation: "A custom role that contains **DataActions cannot be assigned at management group scope**, even though it can list one management group in AssignableScopes. Assign it on the subscriptions (or lower scopes) under that management group. `/` is reserved for built-in roles, data actions can't be placed in Actions, and a custom role can list only one management group.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ROLES,
    stem: 'You need to create a custom Azure role from a JSON file named vm-operator.json by using the Azure CLI. Which command should you run?',
    options: ['az role definition create --role-definition @vm-operator.json', 'az role assignment create --role-definition @vm-operator.json', 'az ad role create --file vm-operator.json', 'az policy definition create --rules vm-operator.json'],
    answer: [0],
    explanation: "Custom roles are role **definitions**: `az role definition create --role-definition @file.json` (PowerShell: `New-AzRoleDefinition -InputFile`). `az role assignment create` assigns an existing role. There is no `az ad role create` for Azure roles. `az policy definition create` creates policy definitions.",
  },
  { topic: '1.2', type: 'single', difficulty: 2, lesson: L_ACCESS,
    stem: 'User3 has Contributor on rg-app-dev. An administrator opens the Contoso-Dev subscription (which contains rg-app-dev), selects Access control (IAM) > Check access, and checks User3. No role assignments are listed. Why?',
    options: ['Check access lists assignments at the selected scope and inherited from above, not assignments at child scopes', 'Contributor assignments are hidden unless the administrator is an Owner', 'Check access lists only assignments made directly at the selected scope, never inherited ones', 'The role assignment has not replicated to the subscription'],
    answer: [0],
    explanation: "Check access shows assignments **at this scope and inherited to this scope**; assignments at child scopes such as rg-app-dev are not listed. Checking at rg-app-dev would show the Contributor assignment. Inherited assignments from parent scopes *are* listed, so the third option is false. Visibility does not depend on the viewer holding Owner, and replication is not the reason a child-scope assignment is missing.",
  },
  { topic: '1.2', type: 'multi', difficulty: 2, lesson: L_ROLES,
    stem: 'Which two statements about Azure roles and Microsoft Entra roles are true? (Choose two.)',
    options: ['Azure roles can be scoped to a management group, subscription, resource group or resource', 'Microsoft Entra roles can be scoped to the tenant, an administrative unit or an individual object such as an application', 'A Global Administrator automatically has Owner on every subscription in the tenant', 'A subscription Owner can create users in the Microsoft Entra tenant', 'Azure roles are assigned on the Roles and administrators page of the Microsoft Entra admin center'],
    answer: [0, 1],
    explanation: "Azure roles use the Resource Manager scopes; Microsoft Entra roles use tenant, administrative unit or object scope. The two systems don't overlap by default: a Global Administrator has no Azure access until they elevate, and a subscription Owner can't create users without a directory role. Azure roles are assigned on **Access control (IAM)** pages; Roles and administrators is for Microsoft Entra roles.",
  },
  { topic: '1.2', type: 'single', difficulty: 3, lesson: L_ROLES,
    stem: 'Refer to the exhibit. User7 creates a virtual machine in rg-app-prod and connects it to snet-app. The deployment fails. Why?',
    exhibit: `Role assignments for User7
Role                          Scope
----------------------------  ------------------------------
Virtual Machine Contributor   Resource group rg-app-prod
Reader                        Subscription Contoso-Prod

vnet-hub (with subnet snet-app) is in resource group rg-net-prod.

Deployment error:
The client 'user7@contoso.com' does not have authorization to perform action
'Microsoft.Network/virtualNetworks/subnets/join/action' over scope
'/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-net-prod/providers/Microsoft.Network/virtualNetworks/vnet-hub/subnets/snet-app'`,
    options: ['Virtual Machine Contributor includes the subnet join action, but User7 holds it only at rg-app-prod, which does not contain vnet-hub', 'Virtual Machine Contributor never includes network permissions, so it cannot create network interfaces', 'Reader at the subscription overrides Virtual Machine Contributor at rg-app-prod', 'A VM and its virtual network must be in the same resource group'],
    answer: [0],
    explanation: "Virtual Machine Contributor's actions include `Microsoft.Network/virtualNetworks/subnets/join/action` and network interface management, but permissions apply only at the assignment's scope. The subnet is in rg-net-prod, where User7 has only Reader. Granting a join permission at vnet-hub or rg-net-prod fixes it. Roles are additive, so Reader overrides nothing, and VMs can use VNets in other resource groups.",
  },

  // ---------- 1.3 Manage Azure subscriptions and governance ----------
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_POL,
    stem: 'Refer to the exhibit. The policy assignment is created on day 1. On day 2, what is the state of vm-app-02?',
    exhibit: `Policy assignment: allowed-locations-prod
  Definition:       Allowed locations (built-in, effect Deny)
  Scope:            Subscription Contoso-Prod
  Parameters:       listOfAllowedLocations = [ "eastus", "eastus2" ]
  Enforcement mode: Default

Resources in Contoso-Prod before the assignment
Name        Type              Resource group  Region
----------  ----------------  --------------  -------
vm-app-01   Virtual machine   rg-app-prod     eastus
vm-app-02   Virtual machine   rg-app-prod     westus`,
    options: ['It keeps running and is reported as non-compliant', 'It is deleted by Azure Policy at the next evaluation cycle', 'It is moved to eastus by a remediation task', 'It is stopped and cannot be started until it is moved'],
    answer: [0],
    explanation: "A deny effect blocks only new or updated requests. Existing resources that match are marked **non-compliant** during evaluation; nothing is deleted, moved or stopped. Note that an update to vm-app-02 (for example a resize) would now be denied because the update request still says westus. Remediation tasks exist only for modify and deployIfNotExists.",
  },
  { topic: '1.3', type: 'multi', difficulty: 3, lesson: L_POL,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `Assignment   Definition          Effect  Scope                 Parameter
-----------  ------------------  ------  --------------------  ----------------------
Policy1      Allowed locations   Deny    Subscription Sub1     [ "eastus" ]
Policy2      Allowed locations   Audit   Resource group rg-b   [ "westus" ]

rg-a and rg-b are resource groups in Sub1.`,
    options: ['A new virtual network in rg-b in eastus is created and reported as non-compliant with Policy2', 'A new virtual network in rg-a in westus is denied', 'A new virtual network in rg-b in westus is created because Policy2 at the narrower scope overrides Policy1', 'An existing virtual network in rg-b in westus is deleted at the next evaluation cycle', 'A new virtual network in rg-a in eastus is reported as non-compliant with Policy2'],
    answer: [0, 1],
    explanation: "Each assignment is evaluated independently and the most restrictive result wins. rg-b eastus: allowed by Policy1, outside Policy2's list so audited as non-compliant: **true**. rg-a westus: Policy1 denies: **true**. rg-b westus: Policy1 still denies; a narrower scope does not override. Deny and audit never delete existing resources. Policy2 is scoped to rg-b, so it does not evaluate rg-a.",
  },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L_POL,
    stem: 'Refer to the exhibit. A user creates nsg-test in rg-web-prod in the westus region. After the next compliance evaluation, enter the compliance state reported for nsg-test against this assignment.',
    exhibit: `{
  "properties": {
    "displayName": "Allowed locations for rg-web-prod",
    "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c",
    "scope": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-web-prod",
    "enforcementMode": "DoNotEnforce",
    "notScopes": [],
    "parameters": { "listOfAllowedLocations": { "value": [ "eastus" ] } }
  }
}`,
    answer: ['Non-compliant', 'Noncompliant', 'Non compliant'],
    explanation: "With `enforcementMode` **DoNotEnforce**, the deny effect is not applied, so nsg-test is created. Resources are still evaluated, and a westus resource outside the allowed list is reported **Non-compliant**. This is how you measure an assignment's impact before enforcing it.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_POL,
    stem: 'You assign the built-in policy Inherit a tag from the resource group if missing to the Contoso-Prod subscription by using the Azure portal, with a system-assigned managed identity. New resources receive the CostCenter tag, but resources created before the assignment still have no tag. What should you do?',
    options: ['Create a remediation task for the assignment', 'Change the assignment enforcement mode to DoNotEnforce', 'Trigger an on-demand compliance scan with az policy state trigger-scan', 'Assign the Require a tag on resources policy with the deny effect'],
    answer: [0],
    explanation: "Modify policies change resources only when they are created or updated. Existing resources are marked non-compliant and are fixed by a **remediation task**, which uses the assignment's managed identity. A scan only refreshes compliance data. DoNotEnforce stops the effect altogether. A deny policy would block new untagged resources but not tag existing ones.",
  },
  { topic: '1.3', type: 'fill', difficulty: 3, lesson: L_POL,
    stem: 'Refer to the exhibit. The command must create the assignment so that existing resources can later be remediated. Enter the missing parameter, including its leading dashes.',
    exhibit: `az policy assignment create \\
  --name inherit-costcenter \\
  --policy ea3f2387-9b95-492a-a190-fcdc54f7b070 \\
  --scope /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/rg-web-prod \\
  --params '{ "tagName": { "value": "CostCenter" } }' \\
  ______________________ \\
  --location eastus`,
    answer: ['--mi-system-assigned', 'mi-system-assigned', '--assign-identity', 'assign-identity'],
    explanation: "The definition (Inherit a tag from the resource group if missing) uses **modify**, which needs a managed identity on the assignment for remediation. `--mi-system-assigned` (alias `--assign-identity`) creates a system-assigned identity; `--location` sets where it lives. Grant it the roles in the definition's roleDefinitionIds (with `--role` and `--identity-scope`, or separately), because the CLI does not do it unless asked.",
  },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L_POL,
    stem: 'The built-in policy Allowed locations is assigned to the Contoso-Prod subscription with the deny effect and the allowed list [ "eastus" ]. A user runs az group create --name rg-test --location westus in Contoso-Prod. What happens?',
    options: ['The resource group is created, because Allowed locations does not apply to resource groups', 'The request is denied, because the resource group location is not in the allowed list', 'The resource group is created in eastus instead', 'The resource group is created and the policy deletes it at the next evaluation'],
    answer: [0],
    explanation: "The built-in **Allowed locations** definition excludes resource groups (and global resources). Resource groups are covered by the separate **Allowed locations for resource groups** definition. However, any resource the user later creates in rg-test outside eastus is denied. Policy never changes a requested location or deletes resources.",
  },
  { topic: '1.3', type: 'order', difficulty: 3, lesson: L_POL,
    stem: 'Existing resources in the Contoso-Prod subscription are missing the CostCenter tag that their resource groups have. You must copy the tag from each resource group to its resources, now and in future, by using Azure Policy in the portal. Put the steps in order.',
    items: ['Open Policy > Assignments > Assign policy and set the scope to Contoso-Prod', 'Select the definition Inherit a tag from the resource group if missing and set the tagName parameter to CostCenter', 'On the Remediation tab, keep a system-assigned managed identity and select its location', 'Create the assignment and wait for the compliance evaluation to list the non-compliant resources', 'Create a remediation task for the assignment', 'Verify the CostCenter tag on the previously untagged resources'],
    explanation: "Choose scope and definition, supply the parameter, and give the assignment a managed identity (the portal grants it the roles the definition lists). After creation, compliance evaluation identifies the existing non-compliant resources, and a remediation task applies the modify operation to them. New resources are tagged at creation by the modify effect itself.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_LT,
    stem: 'Refer to the exhibit. Operators report that they can no longer start the virtual machines in rg-app-prod, although they hold the Virtual Machine Contributor role. What is the cause?',
    exhibit: `rg-app-prod > Settings > Locks
Lock name     Lock type   Scope           Notes
------------  ----------  --------------  ------------------------------
lock-change   Read-only   rg-app-prod     Change freeze until 2026-12-31`,
    options: ['A read-only lock blocks POST operations such as starting a VM for all users', 'Read-only locks remove the Virtual Machine Contributor role assignment', 'Virtual Machine Contributor does not include the start action', 'Locks block only delete operations, so another policy must be the cause'],
    answer: [0],
    explanation: "Starting or restarting a VM is a POST to Resource Manager, which a **ReadOnly** lock blocks for everyone, whatever their role. A **Delete** (CanNotDelete) lock would allow it. Locks do not change role assignments. Virtual Machine Contributor includes `Microsoft.Compute/virtualMachines/*`.",
  },
  { topic: '1.3', type: 'multi', difficulty: 3, lesson: L_LT,
    stem: 'Refer to the exhibit. Which two statements are true? (Choose two.)',
    exhibit: `Lock name  Lock type   Scope
---------  ----------  -------------------------------------------
lock-rg    Delete      Resource group rg-data-prod
lock-st    Read-only   Storage account stcontosodata01 (in rg-data-prod)

vnet-data is in rg-data-prod and has no lock of its own.`,
    options: ['A user with the Contributor role can add a subnet to vnet-data', 'A user with the Storage Blob Data Contributor role can upload a blob to stcontosodata01 by using Microsoft Entra authorization', 'A user with the Owner role can delete vnet-data without removing any lock', 'A user with the Storage Account Contributor role can list the access keys of stcontosodata01', 'A user with the Contributor role can remove lock-rg'],
    answer: [0, 1],
    explanation: "vnet-data inherits lock-rg (Delete): modifications such as adding a subnet are allowed, deletion is not, even for Owners. Locks apply only to the control plane, so a blob upload (data plane) with a data role still works on the ReadOnly account. ReadOnly blocks the List Keys POST. Contributor can't remove locks; that needs `Microsoft.Authorization/locks/*` (Owner or User Access Administrator).",
  },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L_LT,
    stem: 'Refer to the exhibit. Enter the lock level, as the Azure CLI names it, that is effectively applied to vm-app-01.',
    exhibit: `Scope                                  Lock name    Lock type (portal)
-------------------------------------  -----------  ------------------
Subscription Contoso-Prod              lock-sub     Delete
Resource group rg-app-prod             (none)
Virtual machine vm-app-01              lock-vm      Read-only`,
    answer: ['ReadOnly', 'Read-only', 'Read only'],
    explanation: "Locks inherit downward and the **most restrictive** lock in the chain wins. vm-app-01 has CanNotDelete from the subscription and ReadOnly of its own, so **ReadOnly** applies: no updates and no deletion. Other resources in rg-app-prod get only CanNotDelete.",
  },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L_LT,
    stem: 'A user with the Contributor role on rg-net-prod needs to delete an obsolete virtual network, but a delete lock on rg-net-prod prevents it. The user cannot remove the lock. Which role assignment allows the user to remove the lock?',
    options: ['Owner or User Access Administrator on rg-net-prod', 'Network Contributor on rg-net-prod', 'Reader on the subscription', 'Tag Contributor on rg-net-prod'],
    answer: [0],
    explanation: "Removing a lock needs `Microsoft.Authorization/locks/*` or `Microsoft.Authorization/*`. Owner and User Access Administrator include it; Contributor and Network Contributor do not. Reader and Tag Contributor have no lock rights.",
  },
  { topic: '1.3', type: 'fill', difficulty: 2, lesson: L_LT,
    stem: 'Refer to the exhibit. How many tags does vm-web-01 have after both commands run? Enter a number.',
    exhibit: `$ az tag list --resource-id $vm --query properties.tags
{
  "CostCenter": "1234",
  "Environment": "Dev",
  "Owner": "ops"
}
$ az tag update --resource-id $vm --operation Merge --tags Environment=Prod Project=Web
$ az tag update --resource-id $vm --operation Delete --tags Owner=ops`,
    answer: ['3', 'three'],
    explanation: "Merge keeps existing tags, changes Environment to Prod and adds Project: CostCenter, Environment, Owner, Project (4). Delete removes Owner. Result: CostCenter=1234, Environment=Prod, Project=Web = **3** tags. Had the first command used Replace, only Environment and Project would have remained.",
  },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L_POL,
    stem: 'Match each requirement to the Azure Policy effect that meets it.',
    pairs: [
      ['Block creation of any public IP address that uses the Basic SKU', 'deny'],
      ['Add a CostCenter tag during creation and fix existing resources with a remediation task', 'modify'],
      ['Deploy a diagnostic setting to every new key vault that does not already have one', 'deployIfNotExists'],
      ['Report virtual machines that do not have a specific extension installed, without changing them', 'auditIfNotExists'],
      ['Prevent deletion of resources tagged Critical=Yes, while still allowing them to be updated', 'denyAction'],
    ],
    explanation: "**deny** rejects non-compliant requests. **modify** changes properties or tags at create or update and supports remediation. **deployIfNotExists** deploys a related resource when it is missing. **auditIfNotExists** only reports when a related resource is missing. **denyAction** blocks the delete action.",
  },
  { topic: '1.3', type: 'multi', difficulty: 2, lesson: L_RGS,
    stem: 'You plan to move resources from rg-app-old in Contoso-Dev to rg-app-new in Contoso-Prod. Which two conditions must be met? (Choose two.)',
    options: ['Both subscriptions are associated with the same Microsoft Entra tenant', 'Contoso-Prod is registered for the resource providers of the resources being moved', 'The resources are in the same region as rg-app-new', 'Role assignments on the resources are exported so they move with the resources', 'rg-app-old has a read-only lock to freeze the resources during the move'],
    answer: [0, 1],
    explanation: "Cross-subscription moves require both subscriptions in **the same tenant** and the destination **registered** for the resource providers (plus a supported type and quota). A resource group's region is only its metadata location; moved resources keep their own region. Role assignments on moved resources do not move and must be re-created. A read-only lock on a resource group **blocks** moving resources into or out of it, so locking rg-app-old would break the move.",
  },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L_RGS,
    stem: 'Refer to the exhibit. You must move vm-app-01 and the resources it depends on to the Contoso-Prod subscription. What should you do first?',
    exhibit: `Name               Type                     Resource group   Subscription
-----------------  -----------------------  ---------------  ------------
vm-app-01          Virtual machine          rg-app-compute   Contoso-Dev
vm-app-01-osdisk   Managed disk             rg-app-disks     Contoso-Dev
nic-app-01         Network interface        rg-app-compute   Contoso-Dev
pip-app-01         Public IP address        rg-app-compute   Contoso-Dev`,
    options: ['Move vm-app-01-osdisk into rg-app-compute so that the VM and all its dependencies are in one resource group', 'Move vm-app-01 to Contoso-Prod and then move the disk in a second operation', 'Change the directory of Contoso-Dev to the tenant of Contoso-Prod', 'Export a template of vm-app-01 and delete the original'],
    answer: [0],
    explanation: "For a move across subscriptions, the resource and its dependent resources must be in **the same resource group** and move together. Consolidate the disk into rg-app-compute first, move all four resources in one operation, then redistribute in the target if needed. Moving the VM alone fails validation. Changing directory changes the trusted tenant of a whole subscription and is unrelated.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_RGS,
    stem: 'Contoso was acquired by Fabrikam. The Contoso-Prod subscription must trust the fabrikam.com Microsoft Entra tenant instead of contoso.com, and Contoso keeps paying for it. After you change the subscription directory, what must you plan to do?',
    options: ['Re-create Azure role assignments and custom roles, and re-enable or re-create managed identities', 'Nothing; role assignments are mapped to matching users in the new tenant automatically', 'Transfer billing ownership, because a directory change also requires a new billing owner', 'Move every resource into a new resource group in the target tenant'],
    answer: [0],
    explanation: "Changing a subscription's directory **permanently deletes all role assignments and custom roles**; managed identities must be disabled and re-enabled (system-assigned) or re-created (user-assigned), and Key Vault tenant IDs updated. Billing ownership can stay as it is. Resources stay in their resource groups.",
  },
  { topic: '1.3', type: 'match', difficulty: 2, lesson: L_RGS,
    stem: 'Match each requirement to the action that meets it.',
    pairs: [
      ['Fabrikam acquired Contoso and the Contoso-Prod subscription must trust the fabrikam.com tenant', 'Change the subscription directory'],
      ['A different billing account in the same tenant must pay for Contoso-Dev from next month', 'Transfer billing ownership of the subscription'],
      ['az container create fails with an error that the subscription is not registered to use namespace Microsoft.ContainerInstance', 'Register the resource provider'],
      ['Contoso-Dev must inherit the policies assigned to mg-contoso-nonprod', 'Move the subscription to the management group'],
      ['Web app resources spread across three resource groups in one subscription must be managed and deleted together', 'Move the resources to one resource group'],
    ],
    explanation: "Changing the trusted tenant is **Change directory**. Changing who pays is **Transfer billing ownership** (leave Move subscription tenant cleared to keep access). A not-registered namespace error is fixed by **registering the resource provider**. Policy inheritance comes from the **management group** the subscription sits under. Lifecycle grouping is what resource groups are for, so **move the resources** into one group.",
  },
  { topic: '1.3', type: 'single', difficulty: 3, lesson: L_MG,
    stem: 'Refer to the exhibit. User1 tries to move the Contoso-Dev subscription from mg-prod to mg-nonprod and the operation fails. What is the most likely cause?',
    exhibit: `Tenant Root Group
├── mg-prod
│   └── Contoso-Dev (subscription)
└── mg-nonprod

Role assignments for User1
Role                           Scope
-----------------------------  ------------------------
Owner                          Subscription Contoso-Dev
Management Group Contributor   mg-nonprod`,
    options: ['User1 lacks write permission on mg-prod, the current parent management group', 'User1 needs Owner on the Tenant Root Group to move any subscription', 'A subscription cannot be moved between management groups after it is created', 'Management Group Contributor cannot be used for moves; User1 needs User Access Administrator on mg-nonprod'],
    answer: [0],
    explanation: "Moving a subscription needs Owner (or equivalent) on the subscription, and `Microsoft.Management/managementGroups/write` on **both** the target and the **current** parent management group. User1 has the target but not mg-prod. Root-level assignments are not required. Management Group Contributor is one of the roles that supplies the write permission.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_MG,
    stem: 'Refer to the exhibit. You plan to add child management groups below mg-l4. What is the maximum number of additional management group levels you can create below mg-l4?',
    exhibit: `Tenant Root Group
└── mg-l1
    └── mg-l2
        └── mg-l3
            └── mg-l4
                └── Contoso-App (subscription)`,
    options: ['2', '4', '6', '0, because a management group that contains a subscription cannot have child management groups'],
    answer: [0],
    explanation: "A management group tree supports **six levels**, not counting the root level or the subscription level. mg-l1 to mg-l4 use four levels, so two more levels (mg-l5 and mg-l6) can be added. A management group can contain both subscriptions and management groups.",
  },
  { topic: '1.3', type: 'single', difficulty: 2, lesson: L_COST,
    stem: 'Developers often leave virtual machines running in the rg-dev resource group. When the month-to-date cost of rg-dev reaches 500 USD, the VMs must be deallocated automatically. What should you configure?',
    options: ['A budget on rg-dev with an alert condition at 100% of 500 USD that triggers an action group running an Azure Automation runbook', 'A budget on rg-dev with an email alert at 100% of 500 USD; budgets deallocate resources when the amount is reached', 'An Azure Advisor cost recommendation set to automatic remediation', 'A cost anomaly alert on the subscription'],
    answer: [0],
    explanation: "Budgets only notify; they never stop resources. A budget at **resource group or subscription** scope can call an **action group**, which can run a runbook (or Logic App or Function) that deallocates the VMs. Advisor recommendations are not automatic, and anomaly alerts detect unusual spend rather than a fixed amount.",
  },
  { topic: '1.3', type: 'order', difficulty: 2, lesson: L_COST,
    stem: 'You need a monthly 2,000 USD budget on the Contoso-Dev subscription that emails the team at 80% of actual cost and warns when forecasted cost will exceed 100%. Put the portal steps in order.',
    items: ['Open Contoso-Dev > Cost Management > Budgets and select Add', 'Confirm the scope and add any filters', 'Enter the budget name, choose a Monthly reset period, set the creation and expiration dates and the amount 2,000', 'Add alert conditions: Actual at 80% and Forecasted at 100%', 'Enter the alert recipient email addresses and optional action groups', 'Select Create'],
    explanation: "Budgets are created from a scope's **Budgets** page: scope and filters, then name, reset period, dates and amount, then alert conditions (type Actual or Forecasted with a % of budget) and recipients or action groups, then create.",
  },
  { topic: '1.3', type: 'single', difficulty: 1, lesson: L_COST,
    stem: 'Refer to the exhibit. The VMs will keep running 24 hours a day in eastus for the next three years with no change in size. You need the largest discount on these VMs. What should you buy?',
    exhibit: `Cost analysis: rg-erp-prod, last 6 months, grouped by resource
Resource      Size              Region   Hours/month  Change in size or region
------------  ----------------  -------  -----------  ------------------------
vm-erp-01     Standard_D4s_v5   eastus   730          none
vm-erp-02     Standard_D4s_v5   eastus   730          none
vm-erp-03     Standard_D4s_v5   eastus   730          none`,
    options: ['An Azure Reservation for that VM size in eastus with a three-year term', 'An Azure savings plan for compute with a one-year term', 'Azure Advisor premium recommendations', 'A budget with a forecasted alert'],
    answer: [0],
    explanation: "Reservations commit to a specific resource type, size and region and suit stable, predictable usage; they generally give the deeper discount. Savings plans commit to an hourly spend and suit changing workloads. Advisor recommends purchases but has no premium tier that discounts usage, and budgets only track spending.",
  },
];

export default bank.map((item, i) => ({ id: `d1-${String(i + 1).padStart(3, '0')}`, ...item }));
