// Cheat-sheet tables for the Reference page. Cells are inline markdown. PAN-OS 11.2 / 12.1.
// Domain 1 tables verified 2026-10-30 against docs.paloaltonetworks.com (Quantum Security admin guide,
// Advanced Routing, static route path monitoring); other values from established PAN-OS behaviour.
// Domain 2 tables: facts checked 2026-10-30 against docs.paloaltonetworks.com (web proxy, shared gateway, HA upgrade, collector groups)
// and established PAN-OS behaviour. Platform-specific limits and defaults are deliberately left out.
// Domain 3 tables: checked 2026-10-30 against docs.paloaltonetworks.com (bootstrap package, CN-Series building blocks,
// Prisma AIRS) and the terraform-provider-panos 2.x docs; API and Panorama behaviour is established PAN-OS practice.
const d3Tables = [
  {
    id: 'deployment-options', title: 'Deployment options and bootstrap', topic: '3.1',
    columns: ['Item', 'Detail'],
    rows: [
      ['PA-Series', 'Hardware; default MGMT 192.168.1.1/24, admin/admin'],
      ['VM-Series', 'ESXi, KVM, Hyper-V, Nutanix, AWS, Azure, GCP, OCI; first NIC = mgmt, second = ethernet1/1; licence bound to UUID + CPU ID'],
      ['VM-Series licensing', 'BYOL (auth code), Flex credits (deployment profile), PAYG (marketplace); `request license fetch auth-code <code>`'],
      ['Bootstrap package', '/config, /content, /software, /license (must exist) and optional /plugins; no other files or folders'],
      ['init-cfg.txt keys', '`type`, `hostname`, `panorama-server`, `tplname`, `dgname`, `vm-auth-key`, `dns-primary`'],
      ['VM auth key', 'Panorama: `request bootstrap vm-auth-key generate lifetime <hours>`; check with `show system bootstrap status`'],
      ['Bootstrap sources', 'ISO (ESXi/KVM), S3 bucket (AWS), Azure Files share, GCP bucket'],
      ['CN-Series', 'CN-MGMT (StatefulSet), CN-NGFW (DaemonSet or service), PAN-CNI; Panorama + Kubernetes plugin required; 30 app pods per CN-NGFW, 30 CN-NGFW per CN-MGMT pair'],
      ['Cloud NGFW', 'Managed service on AWS (GWLB endpoints) and Azure; rulestacks; `cloudngfwaws` / `azurerm` Terraform'],
      ['AI Runtime Security', 'Part of Prisma AIRS: Network Intercept (firewall + AI security profile) and API Intercept (scan API)'],
    ],
  },
  {
    id: 'api-cheatsheet', title: 'XML API and REST API cheat sheet', topic: '3.2',
    columns: ['Item', 'Detail'],
    rows: [
      ['Paths', 'XML `https://host/api/`; REST `https://host/restapi/v11.2/<Category>/<Resource>`'],
      ['API key', '`type=keygen` by POST; send as `X-PAN-KEY` header; invalid after password change; API Key Lifetime in Authentication Settings'],
      ['type=config actions', '`get` candidate, `show` running, `set` merge into parent, `edit` replace entry, `delete`, `rename`, `clone`, `move`, `override`'],
      ['Other types', '`op`, `commit`, `log`, `report`, `export`, `import`, `user-id`, `version`'],
      ['Commit', '`type=commit&cmd=<commit></commit>` returns a job id; poll `<show><jobs><id>N</id></jobs></show>`'],
      ['Panorama push', '`type=commit&action=all` with `<commit-all><shared-policy>...` (device group)'],
      ['REST', 'GET / POST (name param) / PUT / DELETE; categories Objects, Policies, Network, Device; no commit'],
      ['Find the XML', '`debug cli on`; API browser at `/api`; REST docs at `/restapi-doc/`'],
      ['Terraform panos 2.x', 'Needs Terraform 1.8+; `location` block; `panos_security_policy` owns the rulebase; commit action'],
      ['Ansible', '`paloaltonetworks.panos` collection + `pan-os-python`; `panos_commit_firewall`, `panos_op`; secrets in Vault'],
    ],
  },
  {
    id: 'panorama-cheatsheet', title: 'Panorama templates, device groups and reporting', topic: '3.4',
    columns: ['Item', 'Detail'],
    rows: [
      ['Template / stack', 'Network and Device settings; higher template in the stack wins; stack-level beats templates; one stack per firewall'],
      ['Variables', '`$name`, typed (IP Netmask, Interface, AS Number, Group ID, Device Priority...), default plus per-firewall value'],
      ['Device group', 'Policy and objects; tree below Shared; children inherit; same-name object in child overrides'],
      ['Rule order', 'Shared pre, parent pre, child pre, local, child post, shared post, default rules'],
      ['Commit vs push', 'Commit to Panorama (Panorama only); Push to Devices (running config to firewalls); Commit and Push (both)'],
      ['Push options', 'Merge with Candidate Config, Include Device and Network Templates, Force Template Values, Validate Device Group Push'],
      ['Modes', 'Panorama, Management Only, Log Collector, Legacy; firewalls connect on TCP 3978'],
      ['Verify', '`show panorama-status`, `show config pushed-template`, `show config pushed-shared-policy`, `show jobs all`'],
      ['ACC filters', 'Local = one widget; Global = all tabs, not persistent'],
      ['Custom reports', 'Summary databases (aggregated, fast) vs detailed logs (per-session); report group + email scheduler'],
    ],
  },
];
const d2Tables = [
  {
    id: 'vsys-log-collectors', title: 'VSYS and log collection cheat sheet', topic: '2.2',
    columns: ['Item', 'Detail'],
    rows: [
      ['Vsys owns', 'Policy, zones, objects, admins, optional resource limits; shares dataplane and PAN-OS version'],
      ['Enable', 'Device > Setup > Management > Multi Virtual System Capability (template setting on Panorama)'],
      ['Inter-vsys', 'Visible Virtual Systems + external zone in each vsys + internal-to-external rule in each; no rule between external zones; two sessions; max two vsys or shared gateways per path'],
      ['Separate VRs', 'Static routes with Next VR both ways; overlapping subnets need separate VRs and NAT'],
      ['Shared gateway', 'Common internet interface; supports NAT and PBF, no security policy of its own'],
      ['Log forwarding profile', 'Objects > Log Forwarding; match list per log type with filter and method; system logs use Device > Log Settings'],
      ['Strata Logging Service', 'Formerly Cortex Data Lake; needs instance, device certificate, enable in Management; Duplicate Logging also sends to Panorama'],
      ['Collector groups', 'Same model; preference list on Device Log Forwarding; redundancy stores two copies, needs same disk count; three or more collectors recommended'],
    ],
  },
  {
    id: 'cert-roles', title: 'Certificate objects and their jobs', topic: '2.5',
    columns: ['Object', 'Job'],
    rows: [
      ['Forward Trust certificate', 'CA flag + private key; signs impersonation certs for valid sites; clients must trust it'],
      ['Forward Untrust certificate', 'Signs for untrusted servers; clients must not trust it'],
      ['Subordinate CA', 'Enterprise-signed forward trust CA; clients already trust the root'],
      ['SSL Inbound Inspection', 'Imported real server cert and key'],
      ['SSL/TLS service profile', 'Cert + min/max TLS for management, GlobalProtect, Authentication Portal'],
      ['Certificate profile', 'Validates presented certs: CAs, username field, CRL/OCSP, block options'],
      ['Decryption profile', 'TLS versions and verification for decrypted traffic'],
      ['PKI integration', 'CSR, SCEP, OCSP responder, CRL, HSM'],
    ],
  },
  {
    id: 'userid-webproxy', title: 'User-ID sources, update order and web proxy', topic: '2.6',
    columns: ['Item', 'Detail'],
    rows: [
      ['Group mapping', 'LDAP profile + Group Include List; default interval 3600 s; `show user group-mapping state all`'],
      ['IP-user sources', 'Server monitor, syslog, Authentication Portal, GlobalProtect, API, TS agent, CIE, redistribution'],
      ['Windows User-ID agent', 'Default TCP 5007'],
      ['Zone setting', 'Enable User Identification on the user-side zone'],
      ['Redistribution', 'Data Redistribution; Include/Exclude Networks keep segments separate'],
      ['Web proxy', 'Network > Proxy; license required; loopback + DNS proxy (two servers) + decryption cert; IPv4 only'],
      ['Transparent proxy', 'DNAT to proxy IP port 8080 before SNAT; no WCCP'],
      ['Explicit proxy auth', 'Kerberos SSO, SAML or Cloud Identity Engine'],
      ['Update order', 'Panorama, Log Collectors, firewalls; HA: preemption off, one peer at a time'],
    ],
  },
];

export default [
  {
    id: 'ha-links-defaults', title: 'HA links, modes and monitoring defaults', topic: '1.3',
    columns: ['Item', 'Detail'],
    rows: [
      ['HA1', 'Control: hello, heartbeat, config sync. Clear TCP 28260/28769; encrypted TCP 28'],
      ['HA2', 'Session/table sync. Ethernet, IP (protocol 99) or UDP 29281'],
      ['HA3', 'Active/active only: packet forwarding to the session owner'],
      ['Active/passive', 'L2, L3, vwire, tap; same interface addressing on both'],
      ['Active/active', 'L3 and vwire; needs HA3; floating IP / virtual MAC; session owner and setup'],
      ['Election', 'Lower device priority number wins; preemption must be enabled on both peers'],
      ['Passive link state', '`shutdown` (default) or `auto`'],
      ['Path monitoring (HA)', 'Ping interval 200 ms, count 10, conditions any/all'],
      ['Commands', '`show high-availability state`, `show high-availability path-monitoring`, `request high-availability state suspend`'],
    ],
    note: 'HA timer values (Recommended and Aggressive) vary by platform; check Device > High Availability on the model.',
  },
  {
    id: 'routing-defaults', title: 'Routing defaults and engine comparison', topic: '1.4',
    columns: ['Item', 'Detail'],
    rows: [
      ['Administrative distance', 'Static 10, EBGP 20, OSPF internal 30, OSPF external 110, RIP 120, IBGP 200'],
      ['ECMP', 'Up to 4 paths; IP modulo, IP hash, weighted RR, balanced RR; changing it restarts the VR'],
      ['BFD defaults', 'Active, 1000 ms Tx/Rx, multiplier 3, hold time 0'],
      ['Static route path monitoring', '3 s interval, 5 count, Any, 2 min preemptive hold time; ICMP'],
      ['Legacy engine', 'Virtual routers; `show routing ...`; redistribution profiles; BGP import/export rules'],
      ['Advanced Routing Engine', 'Logical routers; `show advanced-routing ...`; route maps, prefix lists, access lists; enable in Device > Setup > Management, commit and reboot'],
      ['ARE protocols (documented)', 'Static, BGP/MP-BGP, OSPFv2, OSPFv3, RIPv2, IPv4 multicast, BFD'],
    ],
  },
  {
    id: 'tunnel-quantum', title: 'IPSec ports and quantum-resistant IKEv2 options', topic: '1.6',
    columns: ['Item', 'Detail'],
    rows: [
      ['IPSec ports', 'IKE UDP 500, NAT-T UDP 4500, ESP IP protocol 50; GlobalProtect IPSec UDP 4501'],
      ['Phase mapping', 'IKE Crypto profile = phase 1; IPSec Crypto profile = phase 2'],
      ['Verify', '`show vpn ike-sa`, `show vpn ipsec-sa`, `test vpn ike-sa gateway <name>`, `less mp-log ikemgr.log`'],
      ['RFC 8784 PPK', 'PAN-OS 11.1+, IKEv2, up to 10 PPKs, KeyID up to 31 chars, Preferred (default, falls back) or Mandatory (aborts)'],
      ['RFC 9242/9370 hybrid keys', 'PAN-OS 11.2+, IKEv2, up to 7 additional rounds (8 total); IPSec profile: one PQC KEM per round; IKEv2 fragmentation recommended'],
      ['Both options', 'Disabled by default; configured on the IKE gateway (PQ PPK / PQ KEM tabs); peers must match'],
      ['GRE', 'IP protocol 47, no encryption, optional keepalive, terminated on a tunnel interface; transit GRE uses tunnel inspection'],
    ],
  },
  ...d2Tables,
  ...d3Tables,
];
