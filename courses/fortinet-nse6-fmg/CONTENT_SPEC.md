# Content Spec — Fortinet NSE 6 FortiManager 7.6 Administrator

Targets the **official Fortinet NSE 6 - FortiManager 7.6 Administrator exam topics** in
`content/blueprint.js` (training.fortinet.com exam page, checked 2026-10-29; product
FortiManager 7.6.1 with FortiOS 7.6). Every lesson, question and flashcard is tagged
with a blueprint topic id; together the lessons must cover **every** sub bullet
(Fortinet repeats some bullets across topics — cover them once in depth, then
cross-reference).

**File formats, question types, mix guide, lesson structure, callouts, exam style
and the ground rules are identical to
`courses/fortinet-nse4/CONTENT_SPEC.md` — read it
first and follow it.** Only these points differ:

1. **Product and version.** FortiManager **7.6** (docs.fortinet.com: FortiManager
   7.6.x Administration Guide, 7.6 New Features, 7.6 CLI Reference, FortiManager
   JSON API docs on the Fortinet Developer Network where public) managing FortiGates
   on FortiOS 7.6. Call out behaviour that changed in 7.4 → 7.6.
2. **FortiManager CLI and diagnostics must be real.** Examples of the kind of
   commands to verify and use: `diagnose dvm device list`, `diagnose fgfm
   session-list`, `diagnose debug application fgfmsd 255`, `diagnose debug
   application depmanager 255`, `diagnose dvm check-integrity`, `diagnose cdb
   check policy-packages`, `diagnose pm2 check-integrity all`, `diagnose system
   print df`, `diagnose sys top`, `get system performance`, `diagnose ha status`,
   `execute fmpolicy …`, `execute backup all-settings …`; and on the FortiGate side
   `config system central-management`, `diagnose debug application fgfmd -1`,
   `execute central-mgmt register-device …`, `diagnose fdsm contract-controller-
   update`. Verify each against the 7.6 CLI reference before using it; don't
   invent subcommands or output fields.
3. **Concepts that must be exact:** ADOM modes (normal vs advanced; workspace /
   workflow), ADOM versions and upgrade, device database vs ADOM database
   (device-level vs ADOM-level objects, "Modified"/"Synchronized" states),
   policy package status, FGFM (TCP 541, tunnel, keepalives, NAT scenarios),
   install wizard vs re-install, import (policy) wizard and its object conflicts,
   metadata variables, dynamic objects / per-device mapping, system templates and
   provisioning templates, scripts (CLI vs TCL, run on device / remote FortiGate
   directly / device database / policy package), revision history and retrieve,
   auto-update, global database ADOM and header/footer policies, FortiManager HA
   (manual failover; what syncs), FortiGuard local FDS / cache and override server.
4. **JSON API.** FortiManager uses JSON-RPC over HTTPS (`/jsonrpc`). Verify method
   names (`get`, `set`, `add`, `update`, `delete`, `exec`, `clone`, `move`, …),
   login/logout (`exec` on `/sys/login/user` and `/sys/logout`, session token) and
   any API-key option before writing questions on them. Distinguish JSON-RPC status
   codes in the response body from HTTP response codes.
5. **Exhibit names.** FortiManager `FMG-HQ` (HA peer `FMG-B`), managed FortiGates
   `FGT-Branch1`, `FGT-Branch2`, ADOMs `Retail`, `MSSP-CustomerA`, policy packages
   `Branch-PP`, `default`.
6. **Lab limits.** The owner's lab is the **FortiManager-VM trial** (7.6): **3
   devices/VDOMs, 2 ADOMs, no FortiGuard subscriptions, no built-in FortiGuard
   Distribution Server, no FortiAnalyzer features**, plus FortiGate-VM permanent
   trials (one per FortiCloud account). Lab steps must fit these limits or say
   clearly that a step needs a full licence (all of topic 4.2 FortiGuard/FDS does).

Validate with `node scripts/validate-content.mjs <domain>` until it prints OK.
