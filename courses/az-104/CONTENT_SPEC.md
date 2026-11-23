# Content Spec — Microsoft Azure Administrator (AZ-104)

Targets the **official AZ-104 skills measured as of October 26, 2023** in `content/blueprint.js`
(Microsoft's study guide listed this as the current outline on 2026-11-23). Every lesson, question and flashcard is tagged with a blueprint
topic id; together the lessons must cover **every** `sub` objective in your domain.

**File formats (lessons.js, lessons/*.md, questions.js, flashcards.js), question types and fields,
mix guide, lesson structure, callouts and validation are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read its format sections
and follow them.** Ignore everything Fortinet-specific in it. The rules below replace it:

1. **Original content only.** No brain dumps; don't copy prose from Microsoft Learn modules,
   Microsoft documentation, CBT Nuggets, books or any course.
2. **Technically airtight and current.** The learner is a working network and systems engineer who
   will try every command. Azure changes constantly, so do not trust memory: verify every service
   capability, limit, default, SKU or tier name, redundancy option, role name, role permission,
   command and parameter on **Microsoft Learn** as it reads today (Microsoft Learn MCP tools if
   you have them, otherwise `curl -sL` learn.microsoft.com pages; for commands use the Azure CLI
   reference under `/cli/azure/`, the Az PowerShell reference under `/powershell/module/`, and the
   ARM template / Bicep reference under `/azure/templates/`). Use current names: **Microsoft Entra
   ID** (formerly Azure Active Directory, name the old one once), Microsoft Entra roles, Microsoft
   Cost Management, Azure Monitor Agent (not the retired Log Analytics agent), Azure Virtual Machine
   Scale Sets with **Flexible** orchestration as the default. Where Microsoft has retired or
   scheduled retirement for something an objective still names (for example **Azure Disk
   Encryption**, Basic SKU public IP addresses and Basic Load Balancer, classic alerts), teach what
   the objective asks, state the retirement status and date exactly as Microsoft Learn gives it,
   and name the replacement. Do not test prices, quotas or numbers that change often; when a limit
   matters to an answer, verify it and say where it comes from in REVIEW-TODO.md.
   Every Azure CLI and Az PowerShell command must use real command, parameter and value names;
   show the portal path, the CLI form and the PowerShell form for the main task of each lesson.
   ARM template JSON must be valid JSON and Bicep must be syntactically valid; use API versions
   that exist in the template reference. KQL queries must use real tables and operators.
3. **Exam style.** Single, multi ("Choose two"), order, match and **fill** (~15%: the exact
   command, parameter, role name, SKU, property or value). Microsoft styles to use: "you need to
   ... what should you do?" scenarios with a constraint (least privilege, lowest cost, least
   administrative effort); yes/no statement series as `multi` questions ("Which statements are
   true? Choose two."); "does this meet the goal?" items; drag-and-drop sequences as `order`;
   hot-area and drop-down items as `match` or `fill` against an exhibit. Use `exhibit` on at least
   50% of questions: a resource table (name, type, region, resource group), a role assignment list,
   an NSG rule table, an effective routes table, an ARM or Bicep excerpt, a CLI or PowerShell
   script, a KQL query with results, a policy definition, a lifecycle rule, portal-style settings
   text. Exactly one defensible answer set; explanations cover every option.
4. **Names.** Company `Contoso`; tenant `contoso.com` / `contoso.onmicrosoft.com`; users
   `User1`, `Admin1` or first names with `@contoso.com`; resource groups like `rg-web-prod`;
   resources with Microsoft's naming abbreviations (`vm-web-01`, `vnet-hub`, `snet-app`,
   `nsg-web`, `stcontosodata01`, `kv-contoso-prod`); subscriptions `Contoso-Prod`,
   `Contoso-Dev`; real region names. **Every identifier and secret is an obvious placeholder:**
   subscription, tenant and object IDs as `00000000-0000-0000-0000-000000000000` or
   `<subscription-id>`; storage keys `<storage-account-key>`; SAS tokens `<sas-token>` (never a
   sample `sv=...&sig=...` string with a real-looking signature: write `sig=<signature>`);
   passwords `<password>`; connection strings with `AccountKey=<storage-account-key>`. Private
   addresses from RFC 1918; public addresses from RFC 5737 (192.0.2.0/24, 198.51.100.0/24,
   203.0.113.0/24); custom domains `contoso.com` or `example.com` only.
5. **Size (one writer per domain, then an independent reviewer).** About 2.5 questions per weight
   point: Domain 1 ~60, Domain 2 ~48, Domain 3 ~60, Domain 4 ~48, Domain 5 ~36; flashcards about
   60% of the question count. The validator requires at least one lesson whose `topic` equals each
   topic id; write **several lessons per topic** so that every `sub` objective is taught properly
   (group two or three closely related objectives into one lesson where that reads naturally),
   about 1,000–1,600 words each. Each lesson has a "Try it yourself" section (a small lab in the
   portal plus the CLI or PowerShell equivalent, ending with deleting the resource group) and
   "Key takeaways".
6. **Reference tables.** Append 2–5 cheat-sheet tables for your domain to `content/reference.js`
   (row format like `../ccnp-encor/content/reference.js`; `topic` must be a blueprint id). Use a
   `dNTables` constant spread into the default export; edit that shared file with the Edit tool
   only, never a script, and don't touch other domains' tables.
7. **Real exam style, from official sources only.** Model question formats on Microsoft's own
   published material: the study guide wording, the exam sandbox (aka.ms/examdemo) item types and
   the free practice assessment format. Never use, look up or paraphrase recalled exam questions
   ("brain dumps": ExamTopics and similar sites); Microsoft revokes certifications for it and the
   repository is public. At least 25% of each domain's questions must be performance-based in
   style, by the strict definition reviewers apply: an `order` question sequencing the steps or
   commands of a real task; a `match` question pairing concrete scenarios or requirements (not
   terms) with the role, service, SKU, setting or command that fits; or a `fill` question whose
   answer is read or derived from an exhibit (the effective access for a user, the rule an NSG
   applies, the missing parameter in a script, the value a template expression produces).
   Term-to-definition and task-to-command matches do not count.
8. **Do not use this PC or any Azure tenant to verify.** No `az login`, no `Connect-AzAccount`, no
   calls to Azure, Microsoft Graph or any API, no deployments, no Docker or other containers, no
   VMs, no sudo, no installs (no `az`, `bicep`, PowerShell or pip installs), no system commands to
   harvest output. Verify from Microsoft Learn documentation only. Pure Python with no network
   inside a `mktemp -d` directory is allowed and expected for checking JSON (`python3 -m
   json.tool`), subnet maths (`ipaddress`) and CIDR overlaps. Mark all command output, portal
   text and error messages as documentation-based in REVIEW-TODO.md: the owner will check them in
   a real subscription later.
9. **Any host computer.** Learners run this site on Windows, macOS (Apple silicon and Intel) and
   Linux. Labs use the Azure portal and Azure Cloud Shell, which work in any browser; when a local
   tool is named (Azure CLI, Azure PowerShell on PowerShell 7, Storage Explorer, AzCopy), say it
   runs on all three or say what to use on each. Every lab says what it may cost and ends by
   deleting the resource group.

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
