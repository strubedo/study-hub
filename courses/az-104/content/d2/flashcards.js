// Domain 2 — Implement and manage storage. Original flashcards; facts checked against Microsoft Learn on
// 2026-11-23 (see REVIEW-TODO.md for sources and items still to confirm in a subscription).
let n = 0;
const c = (topic, front, back) => ({ id: `d2-f${String(++n).padStart(3, '0')}`, topic, front, back });

export default [
  // 2.1
  c('2.1', 'When do storage firewall rules take effect?', 'Only when the default action is `Deny` (portal: Enabled from selected networks). With `Allow`, every network reaches the public endpoint and the rules do nothing.'),
  c('2.1', 'Storage IP network rule limits?', 'Public IPv4 only; no RFC 1918 ranges; /31 and /32 not supported (use single addresses); no effect on clients in the same Azure region; up to 400 rules.'),
  c('2.1', '`Microsoft.Storage` vs `Microsoft.Storage.Global` service endpoint?', '`Microsoft.Storage` reaches accounts in the same region as the VNet; `Microsoft.Storage.Global` reaches accounts in any region. A subnet can have only one of them.'),
  c('2.1', 'What is a resource instance rule?', 'A firewall rule that admits a specific Azure resource (same tenant) that has no fixed IP or subnet. Its managed identity still needs a data role.'),
  c('2.1', 'Three SAS types and their signing keys?', 'User delegation SAS: user delegation key from Microsoft Entra ID (recommended). Service SAS and account SAS: the storage account key.'),
  c('2.1', 'Which SAS can use a stored access policy?', 'Only a service SAS (field `si`). Not account SAS, not user delegation SAS.'),
  c('2.1', 'Stored access policy limits and revocation?', 'Max five per container, share, queue or table. Revoke linked SAS by deleting the policy, setting expiry in the past or renaming it.'),
  c('2.1', 'How do you revoke an ad hoc service or account SAS early?', 'Regenerate the account key that signed it. That is the only way without a stored access policy.'),
  c('2.1', 'How do you revoke user delegation SAS?', '`az storage account revoke-delegation-keys` (all user delegation keys on the account). The key itself lasts at most seven days.'),
  c('2.1', 'Key rotation order without downtime?', 'Move apps to key2, regenerate key1, move apps to new key1, regenerate key2.'),
  c('2.1', 'Effect of `AllowSharedKeyAccess = false`?', 'Rejects keys, connection strings, service SAS and account SAS. Entra tokens and user delegation SAS still work. Required for Conditional Access on the account.'),
  c('2.1', 'Azure Files identity sources?', 'On-premises AD DS, Microsoft Entra Domain Services, Microsoft Entra Kerberos. One per storage account, SMB only, all use Kerberos.'),
  c('2.1', 'Share-level RBAC roles for SMB?', 'Storage File Data SMB Share Reader, Contributor, Elevated Contributor (adds modify ACLs), plus SMB Admin (key-equivalent) and SMB Take Ownership.'),
  c('2.1', 'When use a default share-level permission?', 'Identities not synced to Microsoft Entra ID (or synced to another tenant), computer accounts, gMSAs; applies to all authenticated identities on all shares.'),
  // 2.2
  c('2.2', 'Storage account naming rules?', '3 to 24 characters, lowercase letters and digits only, globally unique.'),
  c('2.2', 'Defaults of `az storage account create` without `--sku` and `--kind`?', '`Standard_RAGRS` and `StorageV2`.'),
  c('2.2', 'Durability per year, as Microsoft Learn states it?', 'LRS at least 11 nines; ZRS at least 12 nines; GRS and GZRS at least 16 nines.'),
  c('2.2', 'Secondary read endpoint for RA-GRS / RA-GZRS?', 'Account name plus `-secondary`, e.g. `stcontosodata01-secondary.blob.core.windows.net`. Same keys; read-only.'),
  c('2.2', 'State of the account after an unplanned failover?', 'Former secondary is the primary and the account is LRS. Writes after the Last Sync Time may be lost.'),
  c('2.2', 'Object replication prerequisites?', 'Versioning on source and destination, change feed on the source, GPv2 or premium block blob, no hierarchical namespace. Block blobs only.'),
  c('2.2', 'Key vault requirements for customer-managed keys?', 'Soft delete and purge protection enabled; managed identity with Key Vault Crypto Service Encryption User (user-assigned if set at account creation).'),
  c('2.2', 'When can infrastructure encryption be enabled?', 'Only when the storage account (or an encryption scope) is created. It adds a second AES-256 layer with a Microsoft-managed key.'),
  c('2.2', '`azcopy copy` vs `azcopy sync` defaults?', '`copy` needs `--recursive` for folders; `sync` is recursive by default, one-way, compares last-modified times, deletes extras only with `--delete-destination true`.'),
  // 2.3
  c('2.3', 'Blob access tier minimum retention (GPv2)?', 'Hot none, cool 30 days, cold 90 days, archive 180 days. Earlier delete, overwrite or tier change is charged for the remaining days.'),
  c('2.3', 'Where is the archive tier unavailable?', 'ZRS, GZRS and RA-GZRS accounts; premium block blob accounts; blobs using an encryption scope. It can never be the account default tier.'),
  c('2.3', 'Rehydration priorities?', 'Standard: up to 15 hours for objects under 10 GB (default). High: under one hour for objects under 10 GB, costs more.'),
  c('2.3', 'Lifecycle rule conditions?', '`daysAfterModificationGreaterThan`, `daysAfterCreationGreaterThan`, `daysAfterLastAccessTimeGreaterThan` (needs access tracking), `daysAfterLastTierChangeGreaterThan`. All strictly greater than.'),
  c('2.3', 'Azure Files soft delete scope and range?', 'Protects whole file shares (not files). Account-level, on by default, 7 days default, 1 to 365 days.'),
  c('2.3', 'Share snapshot limits?', 'Share-level, read-only, incremental; up to 200 per share, kept up to 10 years; deleted with the share.'),
  c('2.3', 'Container anonymous access levels?', 'Private (default), Blob (read blobs by URL), Container (read and list). Works only if the account allows anonymous access.'),
];
