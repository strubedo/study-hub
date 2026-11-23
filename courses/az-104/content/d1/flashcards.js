// Domain 1 — Manage Azure identities and governance. Original flashcards; facts checked on Microsoft Learn on 2026-11-23
// (details that change, such as licensing and limits, are listed in REVIEW-TODO.md).
let n = 0;
const c = (topic, front, back) => ({ id: `d1-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 1.1
  c('1.1', 'Old name of Microsoft Entra ID?', 'Azure Active Directory (Azure AD). Manage it in the Microsoft Entra admin center, with `az ad`, or with Microsoft Graph PowerShell; the AzureAD and MSOnline modules are retired.'),
  c('1.1', 'Security group vs Microsoft 365 group members?', 'Security: users, devices, service principals and other groups. Microsoft 365: users only, no nesting.'),
  c('1.1', 'License needed for dynamic membership groups?', 'Microsoft Entra ID P1 (or Intune for Education) for each unique user member. Device members need no license.'),
  c('1.1', 'Can a dynamic group rule mix users and devices?', 'No. A dynamic group is either Dynamic User or Dynamic Device, and device rules cannot use the owner\'s user attributes.'),
  c('1.1', 'Why does Membership type show only Assigned?', 'The group is role-assignable (Microsoft Entra roles can be assigned = Yes), or the tenant has no P1.'),
  c('1.1', 'Restore window for deleted users?', '30 days in Deleted users. Microsoft 365 groups also 30 days; restoring cloud security groups is in preview (public cloud only), distribution groups cannot be restored.'),
  c('1.1', 'Required columns in the Bulk create CSV?', 'Name, User name and Initial password. Bulk create sends no email; Bulk invite creates guests and sends invitations.'),
  c('1.1', 'Administrative unit adds a group: who is in scope?', 'Only the group object, not its members. Add users directly to manage them. Scoped admins need P1; AUs cannot be nested.'),
  c('1.1', 'Prerequisite for direct license assignment?', 'The user\'s Usage location. Group-based licensing falls back to the tenant location if it is missing.'),
  c('1.1', 'Group-based licensing and nested groups?', 'Not supported: only direct members of the licensed group get the license.'),
  c('1.1', 'Graph PowerShell cmdlets for licenses?', '`Get-MgSubscribedSku` (find SkuId), `Set-MgUserLicense` and `Set-MgGroupLicense` with `-AddLicenses` and `-RemoveLicenses`.'),
  c('1.1', 'B2B guest UPN format?', '`john_fabrikam.com#EXT#@contoso.onmicrosoft.com`; invited users get UserType Guest by default.'),
  c('1.1', 'New-MgInvitation without -SendInvitationMessage?', 'The guest is created but no email is sent; hand out the redeem URL yourself.'),
  c('1.1', 'Default Guest user access setting?', 'Guests have limited access to properties and memberships of directory objects (cannot enumerate users and groups).'),
  c('1.1', 'Let non-admins invite guests when invitations are limited to admin roles?', 'Assign the Guest Inviter Microsoft Entra role.'),
  c('1.1', 'Cross-tenant access defaults?', 'B2B collaboration allowed inbound and outbound; B2B direct connect blocked. Organizational settings override defaults per tenant.'),
  c('1.1', 'SSPR scope options?', 'None, Selected (one group; nested members included) or All. Admin roles are enabled by default with a fixed two-gate policy (switch off only with AllowedToUseSspr).'),
  c('1.1', 'SSPR number of methods required?', '1 or 2. Users must register at least that many of the enabled methods; Authenticator and OATH tokens together count as one method.'),
  c('1.1', 'SSPR reconfirmation range?', '0 to 730 days; 0 means never ask users to reconfirm.'),
  c('1.1', 'License for SSPR password writeback?', 'Microsoft Entra ID P1 or P2, or Microsoft 365 Business Premium. Enable it in Microsoft Entra Connect (or cloud sync) and in Password reset > On-premises integration.'),
  // 1.2
  c('1.2', 'Three parts of an Azure role assignment?', 'Security principal (who), role definition (what), scope (where).'),
  c('1.2', 'Effective permissions of one role?', '`Actions - NotActions` (control plane) and `DataActions - NotDataActions` (data plane). Across roles, permissions add up.'),
  c('1.2', 'Is NotActions a deny?', 'No. Another role that grants the action restores it. Only deny assignments block across roles.'),
  c('1.2', 'Contributor vs Owner?', 'Both manage all resources; Contributor cannot assign roles (excludes `Microsoft.Authorization/*/Write` and `/Delete`), so it also cannot manage locks. Its NotActions also exclude Blueprint assignments, gallery sharing, deployment stack deny settings and cancelling or enabling the subscription.'),
  c('1.2', 'Role Based Access Control Administrator vs User Access Administrator?', 'RBAC Admin: create and delete role assignments plus `*/read`, can be constrained by conditions. UAA: all `Microsoft.Authorization/*` plus `*/read`.'),
  c('1.2', 'Owner and blob data?', 'Owner is control plane only. Reading blobs with Microsoft Entra auth needs a data role such as Storage Blob Data Reader.'),
  c('1.2', 'Custom role limits to remember?', 'Only one management group in AssignableScopes; roles with DataActions cannot be assigned at management group scope; 5,000 custom roles per tenant.'),
  c('1.2', 'Role assignment limits?', '5,000 per subscription (all scopes in it, not management groups) and 500 per management group; both fixed.'),
  c('1.2', 'CLI to assign a role to a new managed identity?', '`az role assignment create --assignee-object-id <id> --assignee-principal-type ServicePrincipal --role <role> --scope <id>`.'),
  c('1.2', 'Check access shows what?', 'Role and deny assignments at the selected scope and inherited from above. Child-scope assignments are not listed.'),
  c('1.2', 'Elevate access gives what?', 'User Access Administrator at root scope `/` for the signed-in Global Administrator. Toggle: Microsoft Entra ID > Properties > Access management for Azure resources.'),
  c('1.2', 'Classic administrators status?', 'Co-Administrator and Service Administrator retired August 31, 2024; converted to Owner from December 2025; fully retired May 2026. Account Administrator remains (billing).'),
  // 1.3
  c('1.3', 'Does a deny policy fix existing resources?', 'No. Existing matches are marked non-compliant; only new or updated requests are blocked (403).'),
  c('1.3', 'Which policy effects need a managed identity and support remediation tasks?', 'modify and deployIfNotExists.'),
  c('1.3', 'enforcementMode DoNotEnforce?', 'Resources are evaluated and compliance reported, but the effect is not applied and no deny entries are written to the Activity log. Remediation tasks can still be started for deployIfNotExists.'),
  c('1.3', 'Policy compliance timing?', 'Changed resource: about 15 minutes. Full cycle: every 24 hours. On demand: `az policy state trigger-scan` or `Start-AzPolicyComplianceScan`.'),
  c('1.3', 'CanNotDelete vs ReadOnly?', 'CanNotDelete (portal Delete): read and modify, no delete. ReadOnly: read only. Most restrictive inherited lock wins.'),
  c('1.3', 'Tag limits and inheritance?', '50 tags per resource, group or subscription; none on management groups; not inherited unless a modify policy copies them.'),
  c('1.3', 'az tag update operations?', '`Merge` adds or changes listed tags, `Replace` keeps only listed tags, `Delete` removes listed tags. `az tag create` replaces all.'),
  c('1.3', 'Management group limits?', '10,000 per tenant; six levels deep excluding root and subscription levels; one parent each.'),
  c('1.3', 'Budget actions?', 'Budgets notify by email and can trigger action groups (subscription and resource group scope); they never stop resources by themselves.'),
];
