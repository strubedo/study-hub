// Domain 2 — PAN-OS Device Setting Configuration. Original questions for PAN-OS 11.2 / 12.1.
let n = 0;
const q = (topic, lesson, type, difficulty, stem, rest) => ({ id: `d2-${String(++n).padStart(3, '0')}`, topic, type, difficulty, stem, ...rest, lesson });

export default [
  // ---------------- 2.1 admin roles, auth profiles, sequences ----------------
  q('2.1', '2.1-admin-roles', 'single', 1, 'A security team wants an administrator role that automatically gains access to new features added in future PAN-OS releases, without anyone maintaining the role. Which role type fits?', {
    options: ['A dynamic role such as deviceadmin', 'A custom Admin Role profile with every tab set to Enable', 'A Panorama access domain', 'A role-based RADIUS attribute with no local role'], answer: [0],
    explanation: 'Dynamic roles are built in and updated by PAN-OS, so they pick up new features automatically.\n\n* A custom Admin Role profile is feature-by-feature: new features may stay disabled until the profile is edited.\n* An access domain limits scope (device groups, templates); it is not a permission set.\n* A RADIUS attribute only selects which role applies; it does not define one.' }),
  q('2.1', '2.1-admin-roles', 'single', 2, 'Refer to the exhibit. A script using the account soc1 fails with an authorization error when it calls the XML API, although soc1 can browse Monitor in the web UI. What is the cause?', {
    exhibit: `Device > Admin Roles > SOC-RO
Web UI        Dashboard: Read Only   ACC: Read Only   Monitor: Read Only
              Policies: Disable      Objects: Disable Network: Disable  Device: Disable
XML API       Report: Disable  Log: Disable  Config: Disable  Operational Requests: Disable
REST API      Disabled
Command Line  None
Privacy       Show Full IP addresses: No`,
    options: ['The role has the XML API (and REST API) permissions disabled; web UI and API access are separate switches', 'The Command Line level is None, which also blocks the API', 'Privacy is hiding IP addresses, which blocks API keys', 'Read Only in the web UI disables XML API access for the whole account'], answer: [0],
    explanation: 'Admin Role profiles control web UI, XML API, REST API and CLI independently. Here every API section is Disable, so keygen or requests fail even though web UI Monitor access works.\n\n* CLI level does not govern API access.\n* Privacy settings mask fields; they do not block key generation.\n* Web UI read-only settings do not imply API settings.' }),
  q('2.1', '2.1-admin-roles', 'single', 2, 'Administrators must log in with Active Directory credentials through an LDAP authentication profile, and receive different permissions depending on their AD group. What is the supported approach with LDAP?', {
    options: ['Create local administrator accounts with the required role and attach the LDAP authentication profile to each', 'Have the LDAP server return the role in a Palo Alto vendor-specific attribute', 'Map AD groups to roles in the LDAP server profile', 'Use group mapping to assign Admin Role profiles automatically'], answer: [0],
    explanation: 'LDAP only verifies credentials. The role comes from the local account, so you pre-create accounts and attach the profile.\n\n* VSAs are a RADIUS/TACACS+ feature.\n* The LDAP server profile has no role mapping.\n* User-ID group mapping feeds policy, not administrator roles.' }),
  q('2.1', '2.1-admin-roles', 'single', 2, 'A Panorama administrator must manage policy only for the device groups of the EMEA firewalls and nothing else. Which Panorama construct limits that scope?', {
    options: ['An access domain assigned to a Device Group and Template administrator', 'A dynamic role of superuser (read-only)', 'A template stack containing only EMEA firewalls', 'The Privacy tab of the Admin Role profile'], answer: [0],
    explanation: 'Access domains define which device groups, templates and firewalls an administrator can see; the Device Group and Template role type uses them.\n\n* Superuser (read-only) sees everything.\n* A template stack is a configuration object for devices, not an access boundary.\n* Privacy hides log fields.' }),
  q('2.1', '2.1-admin-roles', 'multi', 2, 'Which two statements about dynamic admin roles are correct? (Choose two.)', {
    options: ['They cannot be edited', 'They automatically include new features after an upgrade', 'They can hide source IP addresses in logs', 'They allow per-tab Enable/Read Only/Disable settings', 'They can be created on Panorama only'], answer: [0, 1],
    explanation: 'Dynamic roles are predefined and updated by PAN-OS.\n\n* Hiding fields (Privacy) and per-tab permissions belong to custom Admin Role profiles.\n* Dynamic roles exist on firewalls as well as Panorama.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'single', 2, 'Refer to the exhibit. The user jsmith enters the correct password but the test fails. What is the cause?', {
    exhibit: `PA-HQ> test authentication authentication-profile AD-Users username jsmith password
Enter password :
Target vsys is not specified, user "jsmith" is assumed to be configured with a shared auth profile.
Do allow list check before sending out authentication request...
User jsmith is not in allow list.
Authentication failed for user "jsmith"

PA-HQ# show shared authentication-profile AD-Users allow-list
allow-list [ Network-Admins ];`,
    options: ['jsmith is not a member of the group in the profile Allow List', 'The LDAP server is unreachable', 'The Username Modifier is wrong', 'The profile lockout time has expired'], answer: [0],
    explanation: 'The message "not in allow list" comes from the firewall before any request is sent to the server: only members of Network-Admins are accepted.\n\n* An unreachable server would show a connection error from the server query.\n* A modifier error would produce a bind or user-not-found failure at the server.\n* Lockout produces a locked-out message.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'single', 2, 'Users type only jsmith at a portal, but the directory requires EXAMPLE\\jsmith for the bind. Which authentication profile setting solves it without changing what users type?', {
    options: ['User Domain with Username Modifier %USERDOMAIN%\\%USERINPUT%', 'Login Attribute set to userPrincipalName', 'An Allow List entry of EXAMPLE\\*', 'A second factor on the Factors tab'], answer: [0],
    explanation: 'The Username Modifier builds the string sent upstream from the typed name and the configured User Domain.\n\n* Login Attribute is the LDAP attribute searched, not a domain prefix.\n* The Allow List filters users after the check, it does not rewrite names.\n* Factors add MFA.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'single', 2, 'Employees come from two separate AD forests, each with its own LDAP profile and authentication profile. How can GlobalProtect offer one login for both?', {
    options: ['Create an authentication sequence containing both profiles and reference it', 'Merge the two LDAP server profiles into one', 'Set the Allow List to all on both profiles and attach only one', 'Use two portals with the same name'], answer: [0],
    explanation: 'An authentication sequence tries ordered profiles until one succeeds. With Use domain to determine authentication profile, a typed domain selects the matching profile first.\n\n* An LDAP server profile can list several servers but they belong to one directory.\n* Allow List does not search other directories.\n* Two portals would not give a single login.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'multi', 2, 'Which two authentication methods can return an administrator role from the external server so no local role assignment is needed? (Choose two.)', {
    options: ['RADIUS with Palo Alto VSAs', 'TACACS+ with Palo Alto VSAs', 'LDAP', 'Kerberos', 'Local database'], answer: [0, 1],
    explanation: 'RADIUS and TACACS+ can send role attributes. LDAP and Kerberos only authenticate; the role must come from a local account. The local database has no external role source.' }),
  q('2.1', '2.1-admin-roles', 'single', 1, 'The management authentication profile points to a RADIUS server. Which practice avoids being locked out of the firewall if the RADIUS server is down?', {
    options: ['Keep a local superuser break-glass account that does not depend on the external server', 'Disable lockout on the profile', 'Set the Allow List to all', 'Use the same RADIUS shared secret on every firewall'], answer: [0],
    explanation: 'A local account authenticates without the external server. The other options do not provide an independent login path.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'fill', 1, 'Which operational command, followed by authentication-profile, tests a username and password against a profile and its allow list?', {
    answer: ['test authentication'], explanation: '`test authentication authentication-profile <name> username <user> password` checks the profile, including the allow list, and prompts for the password.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'order', 2, 'Order the steps to let administrators log in through LDAP.', {
    items: ['Create an LDAP server profile', 'Create an authentication profile that uses it (with an Allow List)', 'Create the administrator account with its role and attach the profile', 'Commit', 'Test with test authentication'],
    explanation: 'The server profile must exist before the authentication profile references it, and the account references the profile. Commit applies it; test verifies.' }),
  q('2.1', '2.1-admin-roles', 'single', 2, 'Which setting applies to password strength of locally defined administrators only?', {
    options: ['Minimum Password Complexity under Device > Setup > Management', 'Failed Attempts on an authentication profile', 'The Privacy tab of an Admin Role profile', 'The Certificate Profile username field'], answer: [0],
    explanation: 'Minimum Password Complexity governs local accounts. External servers enforce their own password policy; the other settings do not control strength.' }),
  q('2.1', '2.1-auth-profiles-sequences', 'single', 3, 'Refer to the exhibit. User jdoe, who is in group Engineering, types jdoe@example.com. The sequence has both profiles below. What happens?', {
    exhibit: `Authentication Sequence: Corp-Seq
  [x] Use domain to determine authentication profile
  1. AD-Example   (User Domain: example.com   Allow List: Engineering)
  2. AD-Partner   (User Domain: partner.net   Allow List: all)`,
    options: ['The firewall selects AD-Example by the typed domain and authenticates there', 'The firewall always tries AD-Partner first because of its Allow List', 'Authentication fails because user principal names are not accepted', 'The sequence is skipped because Use domain is enabled'], answer: [0],
    explanation: 'With Use domain to determine authentication profile, the typed domain picks the profile with the matching User Domain; if there were no match, the list order would apply. The example shows a domain that matches AD-Example.\n\n* Allow List does not affect profile order.' }),

  // ---------------- 2.2 VSYS ----------------
  q('2.2', '2.2-vsys-basics', 'single', 1, 'Which resource is shared by all virtual systems on a firewall?', {
    options: ['The PAN-OS software version and dataplane', 'Security policy rulebase', 'Zones', 'Interface assignments'], answer: [0],
    explanation: 'Virtual systems share the device software and hardware. Each vsys has its own rulebase, zones and interface assignments.' }),
  q('2.2', '2.2-vsys-basics', 'single', 2, 'Two tenants on one firewall both use 10.0.0.0/24 internally. What is the design requirement?', {
    options: ['A separate virtual router for each tenant vsys', 'One shared virtual router so routes are visible to both', 'A shared gateway for both tenants', 'An external zone between the two tenants'], answer: [0],
    explanation: 'Overlapping subnets need isolated routing tables, so each tenant gets its own virtual router.\n\n* A shared router would contain conflicting routes.\n* A shared gateway provides common internet access, not isolation.\n* External zones connect vsys; they do not solve overlap.' }),
  q('2.2', '2.2-vsys-interconnect', 'single', 2, 'Refer to the exhibit. Hosts in vsys2 cannot reach hosts in vsys1, though vsys1 can reach vsys2. What must be done?', {
    exhibit: `Device > Virtual Systems
Name   Interfaces     Virtual Routers  Visible Virtual Systems
vsys1  ethernet1/2    vr-shared        vsys2
vsys2  ethernet1/5    vr-shared        (none)

Network > Zones (vsys2)
Name     Type     Interfaces / Virtual Systems
trust2   layer3   ethernet1/5`,
    options: ['Make vsys1 visible to vsys2 and create an external zone in vsys2 that points at vsys1', 'Add a security rule between the two external zones', 'Create a second virtual router for vsys2', 'Move ethernet1/5 into vsys1'], answer: [0],
    explanation: 'An external zone toward vsys1 can only be created once vsys1 is visible in vsys2, and vsys2 has no external zone at all. Policy is then internal-to-external in each vsys.\n\n* No policy is needed between external zones.\n* The vsys already share a router, so routing is fine.\n* Moving the interface removes the separation.' }),
  q('2.2', '2.2-vsys-interconnect', 'single', 2, 'Which security rules are required for inter-vsys traffic between vsys1 (zone trust1) and vsys2 (zone trust2) on one firewall?', {
    options: ['In each vsys, a rule between its internal zone and its external zone; none between external zones', 'A single rule in vsys1 only', 'A rule between the two external zones only', 'A rule in the Shared location'], answer: [0],
    explanation: 'Each vsys evaluates its own policy, so both need internal-to-external (and return direction handled by the session). External zones get automatic access to one another.' }),
  q('2.2', '2.2-vsys-interconnect', 'multi', 3, 'Which two statements about inter-vsys traffic on the same firewall are correct? (Choose two.)', {
    options: ['A conversation creates a session in each vsys involved', 'A packet cannot traverse more than two virtual systems or shared gateways', 'A security rule between the external zones is mandatory', 'Each vsys needs its own physical uplink', 'Overlapping subnets work if both vsys share one virtual router'], answer: [0, 1],
    explanation: 'Two sessions are created, and the hop limit is two. External zones need no rule between them, no extra uplink is needed, and overlapping subnets cannot share one router.' }),
  q('2.2', '2.2-vsys-interconnect', 'single', 1, 'Several tenants (vsys) must share one internet-facing interface and public IP. Which feature is designed for this?', {
    options: ['Shared gateway', 'Virtual wire', 'Aggregate Ethernet', 'Tunnel interface'], answer: [0],
    explanation: 'A shared gateway owns the common external interface; each vsys reaches it through an external zone.' }),
  q('2.2', '2.2-vsys-interconnect', 'single', 3, 'Refer to the exhibit. Tenants A and B use separate virtual routers. A can ping B but replies never return. What is missing?', {
    exhibit: `vr-tenantA  Static Routes
 toB   10.20.0.0/24   next-hop type: Next VR   vr-tenantB

vr-tenantB  Static Routes
 (none)`,
    options: ['A static route in vr-tenantB toward 10.10.0.0/24 with Next VR vr-tenantA', 'A default route in vr-tenantA', 'A security rule between the external zones', 'A tunnel interface between the routers'], answer: [0],
    explanation: 'Separate virtual routers need Next VR routes in both directions. The return path from B lacks one.\n\n* A default route in A does not fix B\'s return.\n* No rule between external zones is needed.\n* Tunnels are unnecessary inside one device.' }),
  q('2.2', '2.2-vsys-basics', 'single', 2, 'A firewall is managed by Panorama. How is multi-vsys capability enabled consistently across the firewalls that need it?', {
    options: ['In the template (Device > Setup > Management > Multi Virtual System Capability)', 'In a device group', 'On the Panorama Dashboard', 'By adding a shared gateway in a device group'], answer: [0],
    explanation: 'Multi-vsys is a device setting, so it belongs in a template. Device groups carry policy and objects.' }),
  q('2.2', '2.2-vsys-basics', 'single', 2, 'Where is a per-vsys limit on the number of sessions configured?', {
    options: ['Device > Virtual Systems > Resource tab', 'Network > Zones', 'Objects > Security Profiles', 'Device > Setup > Session'], answer: [0],
    explanation: 'The Resource tab of the vsys sets limits such as sessions and rules. Device > Setup > Session holds global session settings.' }),
  q('2.2', '2.2-vsys-basics', 'fill', 2, 'Which keyword follows `set system setting` to run operational commands in the context of a particular virtual system?', {
    answer: ['target-vsys'], explanation: '`set system setting target-vsys vsys2` sets the CLI context; `none` returns to the default.' }),
  q('2.2', '2.2-vsys-interconnect', 'match', 2, 'Match each virtual system element to its role.', {
    pairs: [['External zone', 'Points at another vsys instead of interfaces'], ['Visible Virtual Systems', 'Controls which vsys a given vsys can see'], ['Shared gateway', 'Common internet-facing interface for several vsys'], ['Next VR route', 'Static route whose next hop is another virtual router'], ['Resource tab', 'Per-vsys limits on sessions and rules']],
    explanation: 'These are the building blocks of vsys connectivity and control.' }),
  q('2.2', '2.2-vsys-basics', 'single', 2, 'One physical port must serve two tenants using different 802.1Q VLANs. How?', {
    options: ['Create subinterfaces and assign each subinterface to its tenant vsys', 'Assign the physical interface to both vsys', 'Use a shared gateway', 'Create an aggregate group'], answer: [0],
    explanation: 'An interface belongs to one vsys, but subinterfaces can be assigned individually.' }),
  q('2.2', '2.2-vsys-interconnect', 'single', 3, 'Which of these is evaluated for traffic leaving a vsys toward a shared gateway?', {
    options: ['NAT and PBF, plus the vsys-side security policy to the external zone', 'Security policy of the shared gateway', 'Decryption policy of the shared gateway', 'QoS policy of the shared gateway'], answer: [0],
    explanation: 'The shared gateway supports NAT and PBF only; security policy is evaluated on the vsys side. Verify per release in the documentation.' }),

  // ---------------- 2.3 logging ----------------
  q('2.3', '2.3-logging-sls-forwarding', 'single', 1, 'Traffic logs appear on the firewall but not on Panorama. A security rule lacks any Log Forwarding setting. What is the fix?', {
    options: ['Attach a log forwarding profile with Forward Method Panorama to the rule', 'Enable Log at Session Start', 'Add a zone protection profile', 'Reboot Panorama'], answer: [0],
    explanation: 'Rule logs are forwarded only by the profile attached to the rule. Session start logging increases volume but does not forward anything.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'single', 2, 'Refer to the exhibit. Threat logs reach Panorama but traffic logs do not. Why?', {
    exhibit: `Objects > Log Forwarding > LFP-Standard
Name        Log Type  Filter                 Forward Method
ML-Threat   threat    (severity geq high)    Panorama
ML-Wildfire wildfire  All Logs               Panorama`,
    options: ['No match list entry exists for the traffic log type', 'The filter severity is too high', 'The profile lacks a syslog server profile', 'Panorama does not accept traffic logs'], answer: [0],
    explanation: 'Only log types with a match list entry are forwarded. Add a traffic entry. The severity filter affects only threat logs.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'single', 2, 'Where are system, configuration and User-ID logs configured for forwarding?', {
    options: ['Device > Log Settings', 'Objects > Log Forwarding', 'Policies > Security', 'Network > Zones'], answer: [0],
    explanation: 'Rule-triggered logs use log forwarding profiles; system-level logs use Device > Log Settings.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'multi', 2, 'Which three forward methods can a log forwarding profile match list use? (Choose three.)', {
    options: ['Syslog', 'Email', 'HTTP', 'FTP', 'NetFlow', 'RADIUS'], answer: [0, 1, 2],
    explanation: 'Match lists support Panorama/Logging Service, SNMP, email, syslog and HTTP. FTP, NetFlow and RADIUS are not log forwarding methods.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'single', 2, 'A log forwarding profile match list adds a built-in Tagging action to the source address. What does this enable?', {
    options: ['Dynamic address groups that adapt as hosts are tagged', 'Syslog severity mapping', 'Packet capture on the host', 'User-ID group mapping'], answer: [0],
    explanation: 'Tags applied by log matches populate dynamic address groups (or dynamic user groups), so policy updates automatically.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'single', 2, 'What must be present on a firewall before it can use Strata Logging Service, in addition to the activated instance?', {
    options: ['A device certificate obtained through the Customer Support Portal', 'A Panorama HA pair', 'A Dedicated Log Collector', 'A GlobalProtect portal'], answer: [0],
    explanation: 'The device certificate authenticates the firewall to cloud ingestion and query endpoints. The other items are unrelated.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'fill', 1, 'What was Strata Logging Service formerly called? (three words)', {
    answer: ['Cortex Data Lake', 'CDL'], explanation: 'Strata Logging Service was previously Cortex Data Lake.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'single', 2, 'Refer to the exhibit. What does the selected Duplicate Logging option do?', {
    exhibit: `Device > Setup > Management > Strata Logging Service
[x] Enable Strata Logging Service        Region: americas
[x] Enable Duplicate Logging (Cloud and On-Premises)
[ ] Enable Enhanced Application Logging`,
    options: ['Sends logs both to Strata Logging Service and to Panorama', 'Writes each log twice on the local disk', 'Copies logs to two syslog servers', 'Replicates logs between HA peers'], answer: [0],
    explanation: 'It keeps Panorama as a local log destination while using the cloud service.' }),
  q('2.3', '2.3-panorama-log-collectors', 'single', 2, 'Refer to the exhibit. PA-Branch1 shows Connected in Panorama and has a log forwarding profile on its rules, but no logs appear under Panorama Monitor. What is missing?', {
    exhibit: `Panorama > Collector Groups > CG-HQ > Device Log Forwarding
Devices        Collector Group Members (preference list)
PA-HQ          LC1, LC2
(PA-Branch1 not listed)`,
    options: ['PA-Branch1 is not assigned to the collector group preference list', 'The collector group has no retention period', 'LC2 is not a Dedicated Log Collector', 'PA-Branch1 needs a certificate profile'], answer: [0],
    explanation: 'Management connectivity and log forwarding are separate paths. Without a preference list entry the firewall has no collector to send logs to.' }),
  q('2.3', '2.3-panorama-log-collectors', 'single', 2, 'What is the effect of enabling log redundancy across collectors in a collector group?', {
    options: ['Each log is stored on two collectors, roughly halving usable capacity', 'Logs are duplicated to Panorama and SLS', 'Logs are compressed to save space', 'Logging fails over only at the firewall'], answer: [0],
    explanation: 'Redundancy writes two copies on different collectors, which reduces effective storage and maximum ingest rate.' }),
  q('2.3', '2.3-panorama-log-collectors', 'multi', 2, 'Which two requirements apply to collectors in a collector group using redundancy? (Choose two.)', {
    options: ['All collectors are the same Panorama model', 'Every collector has the same number of log disks', 'Each collector has a different PAN-OS version', 'Each collector is in its own management subnet', 'Collectors must be in HA pairs'], answer: [0, 1],
    explanation: 'Same model and same disk count are required for redundancy to work. Version, subnets and HA pairs are not requirements of this feature.' }),
  q('2.3', '2.3-panorama-log-collectors', 'single', 2, 'In a deployment with Dedicated Log Collectors, where do the logs shown in Panorama Monitor reside?', {
    options: ['On the collectors; Panorama queries them on demand', 'Copied to the Panorama management server disk', 'In Strata Logging Service', 'On the firewalls only'], answer: [0],
    explanation: 'Collectors store the logs; the management server queries them.' }),
  q('2.3', '2.3-panorama-log-collectors', 'single', 2, 'Which collector group tab forwards logs from the group to a syslog server?', {
    options: ['Collector Log Forwarding', 'Device Log Forwarding', 'Monitoring', 'Log Ingestion'], answer: [0],
    explanation: 'Device Log Forwarding is the preference list that firewalls use to reach the collectors; Collector Log Forwarding sends logs onward to external targets.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'order', 2, 'Order the steps to start sending logs to Strata Logging Service.', {
    items: ['Activate the Strata Logging Service instance and associate the firewall', 'Install the device certificate on the firewall', 'Enable Strata Logging Service and choose the region in Device > Setup > Management', 'Add a log forwarding profile to the rule that forwards to the logging service', 'Commit and verify'],
    explanation: 'The instance and certificate must exist before the firewall can enable the service, and the rule must reference a forwarding profile.' }),
  q('2.3', '2.3-logging-sls-forwarding', 'single', 3, 'Refer to the exhibit. Syslog has no traffic logs for rule Web-Out, yet the local traffic log shows entries. What is the issue?', {
    exhibit: `Policies > Security > Web-Out
 Action: allow   Log at Session Start: no   Log at Session End: yes
 Log Forwarding: none

Objects > Log Forwarding > default
 ML-All   traffic   All Logs   Syslog: Syslog-SIEM`,
    options: ['The rule does not reference the log forwarding profile; the default profile only auto-applies to new rules', 'Syslog does not accept traffic logs', 'Log at Session Start must be enabled', 'The profile needs a Tagging action'], answer: [0],
    explanation: 'A profile named default is preselected for new rules only. This rule has Log Forwarding set to none, so nothing is forwarded.' }),
  q('2.3', '2.3-panorama-log-collectors', 'single', 3, 'A collector group with log redundancy also forwards to a syslog server. What is a known side effect?', {
    options: ['Syslog may receive duplicate messages because both copies are forwarded', 'Syslog receives no messages', 'Redundancy is disabled automatically', 'Only the first copy is forwarded'], answer: [0],
    explanation: 'Both stored copies can be forwarded. Deduplicate at the SIEM or disable redundancy if syslog fidelity matters.' }),

  // ---------------- 2.4 updates ----------------
  q('2.4', '2.4-software-content-updates', 'single', 2, 'Before upgrading to a new PAN-OS release, what should be installed first?', {
    options: ['The minimum content release version stated in the release notes', 'The newest GlobalProtect agent', 'A new Panorama plugin', 'The previous PAN-OS release again'], answer: [0],
    explanation: 'Each PAN-OS release has a minimum content version. Install it first so signatures and App-IDs remain compatible.' }),
  q('2.4', '2.4-software-content-updates', 'single', 3, 'Refer to the exhibit. PA-B is suspended. What explains this, and what is the fix?', {
    exhibit: `PA-A> show high-availability state
Group 1:
  Mode: Active-Passive
  Local Information:  State: active   Software: 11.2.4  App Version: 9100-9100
  Peer Information:   State: suspended
                      State reason: Peer version too old
                      Software: 10.2.9`,
    options: ['The peers are two or more feature releases apart; upgrade PA-B along the path to the same feature release', 'Preemption is enabled; disable it on PA-A', 'HA2 is down; replace the cable', 'The content versions differ; install content on PA-B'], answer: [0],
    explanation: '"Peer version too old" appears when HA peers are two or more feature releases apart. Upgrade PA-B step by step to the matching feature release.\n\n* Preemption controls failback, not this state.\n* A failed HA2 would show a different reason.\n* Content mismatches do not cause this suspension.' }),
  q('2.4', '2.4-software-content-updates', 'single', 2, 'Before starting an HA pair upgrade, what should be done with preemption?', {
    options: ['Disable it on one peer and commit', 'Enable it on both peers', 'Leave it unchanged', 'Disable it on both peers and reboot'], answer: [0],
    explanation: 'Disabling preemption on one peer prevents failback during the upgrade; the commit must succeed first.' }),
  q('2.4', '2.4-software-content-updates', 'single', 2, 'Refer to the exhibit. An engineer plans to move the estate to 11.2. In what order should the components be upgraded?', {
    exhibit: `Panorama-HQ    11.1.6
LC1, LC2       11.1.6 (Dedicated Log Collectors)
PA-HQ, PA-Branch1   11.1.6`,
    options: ['Panorama-HQ, then LC1 and LC2, then the firewalls', 'The firewalls, then LC1 and LC2, then Panorama-HQ', 'LC1 and LC2, then the firewalls, then Panorama-HQ', 'Any order; the components are independent'], answer: [0],
    explanation: 'Panorama must run the same or a later release than the devices it manages, so it goes first. Consult the version compatibility table for each release.' }),
  q('2.4', '2.4-software-content-updates', 'single', 2, 'Refer to the exhibit. What does the Threshold (hours) value accomplish?', {
    exhibit: `Device > Dynamic Updates > Schedule: Applications and Threats
Recurrence: Daily   At: 01:02
Action: Download and Install
Threshold (hours): 24`,
    options: ['The firewall waits until a content release is at least 24 hours old before installing it', 'The firewall installs the release at most 24 hours after download', 'The schedule runs every 24 hours at random times', 'Content is rolled back after 24 hours'], answer: [0],
    explanation: 'The threshold delays new content so problem releases can be withdrawn before they reach production.' }),
  q('2.4', '2.4-software-content-updates', 'single', 2, 'What is the purpose of disabling new App-IDs in a content update?', {
    options: ['Review new applications and adjust policy before they start matching traffic', 'Prevent the content package from installing', 'Reduce memory usage', 'Stop signature updates for threats'], answer: [0],
    explanation: 'New App-IDs can change which rule matches traffic. Disabling them until reviewed avoids surprises.' }),
  q('2.4', '2.4-software-content-updates', 'single', 2, 'Refer to the exhibit. An engineer reports the new release is not running although the job finished OK. What is missing?', {
    exhibit: `PA-HQ> show jobs all
ID  Type    Status  Result  Description
12  Downld  FIN     OK      PanOS download 11.2.4

PA-HQ> show system info | match sw-version
sw-version: 11.1.6`,
    options: ['The image was only downloaded; it must be installed and the firewall restarted', 'The commit job failed', 'The content version is too old', 'The device certificate has expired'], answer: [0],
    explanation: 'Download only stages the image. `request system software install` and a restart are required.' }),
  q('2.4', '2.4-software-content-updates', 'fill', 2, 'Which operational command installs a downloaded PAN-OS image (give the command without the version)?', {
    answer: ['request system software install'], explanation: '`request system software install version <x.y.z>` installs the image; then `request restart system`.' }),
  q('2.4', '2.4-software-content-updates', 'single', 1, 'Which update type does not require a firewall reboot?', {
    options: ['Dynamic content updates', 'PAN-OS software upgrade', 'Downgrade to a previous maintenance release', 'Panorama upgrade'], answer: [0],
    explanation: 'Content installs and then applies on commit. PAN-OS installs require a restart.' }),
  q('2.4', '2.4-software-content-updates', 'order', 2, 'Order the steps for upgrading a standalone firewall.', {
    items: ['Export the configuration and generate a tech support file', 'Install the minimum required content release', 'Download the target PAN-OS image', 'Install the image', 'Restart and verify the version'],
    explanation: 'Back up, satisfy the content dependency, then download, install and restart.' }),
  q('2.4', '2.4-software-content-updates', 'multi', 3, 'Which two statements about upgrading an HA pair are correct? (Choose two.)', {
    options: ['Preemption needs to be disabled on only one peer', 'Peers two or more feature releases apart cause the older peer to be suspended', 'Both peers must be upgraded simultaneously', 'Content updates cannot be installed while HA is enabled', 'The upgrade requires removing the HA configuration'], answer: [0, 1],
    explanation: 'One peer at a time is the norm; preemption is disabled on one peer, and a gap of two feature releases suspends the older peer.' }),
  q('2.4', '2.4-software-content-updates', 'match', 2, 'Match each command to its purpose.', {
    pairs: [['request content upgrade check', 'List available content releases'], ['request system software download version 11.2.4', 'Stage a PAN-OS image'], ['request restart system', 'Reboot to run the installed image'], ['show jobs all', 'See download and install job status']],
    explanation: 'These are the core update commands.' }),

  // ---------------- 2.5 certificates ----------------
  q('2.5', '2.5-decryption-certificates', 'single', 1, 'In SSL Forward Proxy, which certificate signs the impersonation certificate when the server\'s certificate is valid and trusted by the firewall?', {
    options: ['Forward Trust', 'Forward Untrust', 'The server\'s own certificate', 'The SSL/TLS service profile certificate'], answer: [0],
    explanation: 'Forward Trust signs for valid sites, and clients should trust that CA. Forward Untrust is used when the server certificate is not trusted.' }),
  q('2.5', '2.5-decryption-certificates', 'single', 2, 'Why must the Forward Untrust CA not be installed as a trusted root on clients?', {
    options: ['So clients see a warning for sites with untrusted certificates', 'Because it has no private key', 'Because it expires faster', 'Because it is used only for SSH'], answer: [0],
    explanation: 'Forward Untrust deliberately signs bad-site certificates so users get a warning. Trusting it hides the warnings.' }),
  q('2.5', '2.5-decryption-certificates', 'single', 2, 'Refer to the exhibit. After enabling SSL Forward Proxy, users see certificate errors on every HTTPS site. What is the most likely cause?', {
    exhibit: `Device > Certificate Management > Certificates
Name            Subject          Issuer           CA   Usage
FwdTrust-CA     PA-HQ Decrypt CA PA-HQ Decrypt CA yes  Forward Trust Certificate
FwdUntrust-CA   PA-HQ Untrust CA PA-HQ Untrust CA yes  Forward Untrust Certificate`,
    options: ['Clients do not trust the self-signed FwdTrust-CA root', 'The untrust CA lacks the CA flag', 'The Forward Trust certificate has an expired SSL/TLS profile', 'Clients must trust FwdUntrust-CA'], answer: [0],
    explanation: 'The forward trust CA is self-signed, so clients must be given its root. A subordinate CA from the enterprise PKI would be trusted automatically.\n\n* Both certificates show the CA flag.\n* An SSL/TLS profile is not part of decryption.\n* Trusting the untrust CA defeats its purpose.' }),
  q('2.5', '2.5-decryption-certificates', 'multi', 2, 'Which two are required for a certificate to serve as the Forward Trust certificate? (Choose two.)', {
    options: ['Certificate Authority flag enabled', 'Private key present on the firewall', 'Self-signed by the firewall', 'An HSM', 'Export of the private key to clients'], answer: [0, 1],
    explanation: 'The firewall signs certificates dynamically, so it needs a CA certificate and its key. It may be self-signed or a subordinate CA; an HSM is optional; the private key must never go to clients.' }),
  q('2.5', '2.5-decryption-certificates', 'single', 2, 'What is the main advantage of a subordinate CA signed by the enterprise PKI as the Forward Trust certificate?', {
    options: ['Clients that already trust the enterprise root trust the decryption certificates without a new root deployment', 'Decryption no longer needs a policy', 'Certificate-pinned apps work', 'The firewall does not need the private key'], answer: [0],
    explanation: 'The chain validates to the enterprise root. Pinned apps still fail, and the key stays on the firewall.' }),
  q('2.5', '2.5-decryption-certificates', 'single', 2, 'SSL Inbound Inspection protects an internal web server. Which certificate does the firewall use?', {
    options: ['The server\'s real certificate and private key, imported to the firewall', 'The Forward Trust certificate', 'The Forward Untrust certificate', 'A SCEP-issued client certificate'], answer: [0],
    explanation: 'Inbound inspection decrypts using the actual server key, so the client sees the genuine server certificate.' }),
  q('2.5', '2.5-decryption-certificates', 'single', 2, 'One application fails after decryption is enabled while browsers work. The application pins the server certificate. What is the correct action?', {
    options: ['Add a No Decrypt rule for it', 'Install the Forward Untrust CA on the clients', 'Raise the minimum TLS version in the service profile', 'Disable certificate revocation checking'], answer: [0],
    explanation: 'Pinned applications reject substitute certificates, so exclude them from decryption.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'single', 2, 'What does an SSL/TLS service profile contain?', {
    options: ['A server certificate and minimum and maximum TLS versions', 'A list of CAs and revocation settings', 'Decryption exclusions', 'Cipher suites for decrypted traffic'], answer: [0],
    explanation: 'The profile binds a certificate to TLS versions for a service the firewall terminates. CAs and revocation belong to a certificate profile; decrypted traffic settings are in a decryption profile.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'single', 2, 'Which object sets the minimum TLS version for traffic being decrypted?', {
    options: ['Decryption profile', 'SSL/TLS service profile', 'Certificate profile', 'Interface management profile'], answer: [0],
    explanation: 'The decryption profile holds SSL protocol settings. The service profile applies to the firewall\'s own services.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'single', 2, 'Refer to the exhibit. Administrators get a browser warning on the management interface. What resolves it without changing how users connect?', {
    exhibit: `Device > Setup > Management > General Settings
SSL/TLS Service Profile: (none)
Device > Certificate Management > Certificates
(no certificate issued by the enterprise CA for pa-hq.example.com)`,
    options: ['Import a certificate trusted by the enterprise, create an SSL/TLS service profile with it, and select it in Management settings', 'Switch the management interface to HTTP', 'Install the Forward Trust CA on the firewall', 'Set an authentication sequence'], answer: [0],
    explanation: 'The default management certificate is self-signed; replace it through a service profile.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'multi', 2, 'Which two methods can a certificate profile use to check revocation? (Choose two.)', {
    options: ['CRL', 'OCSP', 'LDAP lookup', 'RADIUS access request', 'ICMP probe'], answer: [0, 1],
    explanation: 'Certificate profiles support CRL and OCSP. The others are not revocation mechanisms.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'single', 3, 'Refer to the exhibit. Smart-card administrators cannot log in during an outage of the OCSP server. What explains it?', {
    exhibit: `Device > Certificate Management > Certificate Profile > CAC-Admins
Username Field: Subject  (Common Name)
CA Certificates: Corp-Issuing-CA
[x] Use OCSP   Default OCSP URL: http://ocsp.example.com
OCSP Receive Timeout: 5   Certificate Status Timeout: 5
[x] Block session if certificate status is unknown
[x] Block session if certificate status cannot be retrieved within timeout`,
    options: ['The profile fails closed when certificate status cannot be retrieved', 'The username field must be Subject Alt', 'The CA certificate is not trusted', 'OCSP only works with CRL disabled'], answer: [0],
    explanation: 'With the block options enabled, an unreachable OCSP responder denies the session. Adding a CRL fallback or relaxing the option changes that behaviour, at a security cost.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'single', 2, 'Refer to the exhibit. GlobalProtect users authenticate with client certificates but appear as unknown users in logs. What should change?', {
    exhibit: `Certificate Profile: GP-Clients
 Username Field: None
 CA Certificates: Corp-Issuing-CA`,
    options: ['Set the Username Field to Subject or Subject Alt so the username is extracted from the certificate', 'Add a CRL', 'Increase the OCSP timeout', 'Mark the CA as Forward Trust'], answer: [0],
    explanation: 'With Username Field None, the certificate proves validity but no user name is derived.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'single', 2, 'Which feature lets a firewall request and renew certificates automatically from an enterprise CA over a standard protocol?', {
    options: ['SCEP profile', 'OCSP responder', 'Certificate profile', 'SSH service profile'], answer: [0],
    explanation: 'SCEP automates enrolment. OCSP checks revocation, and a certificate profile validates certificates presented to the firewall.' }),
  q('2.5', '2.5-decryption-certificates', 'fill', 2, 'Which certificate usage setting identifies the CA used to sign certificates for sites whose server certificate is not trusted? (three words)', {
    answer: ['Forward Untrust Certificate', 'Forward Untrust'], explanation: 'Forward Untrust Certificate is the usage flag on that CA.' }),
  q('2.5', '2.5-certificates-pki-profiles', 'match', 2, 'Match each certificate-related object to its job.', {
    pairs: [['SSL/TLS service profile', 'Certificate and TLS versions for a service the firewall terminates'], ['Certificate profile', 'CAs and revocation checks for certificates presented to the firewall'], ['Forward Trust certificate', 'Signs impersonation certificates for valid sites'], ['SCEP profile', 'Automated certificate enrolment'], ['Decryption profile', 'Protocol and verification settings for decrypted sessions']],
    explanation: 'Keep the three jobs apart: present identity, verify identity, decrypt traffic.' }),
  q('2.5', '2.5-decryption-certificates', 'single', 3, 'Refer to the exhibit. Decrypted sessions to a server signed by a private internal CA all trigger browser warnings, while public sites are fine. What is the best fix?', {
    exhibit: `Decryption log: server cert verify result: issuer not trusted
  server: erp.example.com   Forward Untrust certificate used`,
    options: ['Import the internal CA and mark it Trusted Root CA on the firewall', 'Disable Forward Trust', 'Install FwdUntrust-CA on clients', 'Switch the rule to SSL Inbound Inspection'], answer: [0],
    explanation: 'The firewall does not trust the issuer, so it signs with Forward Untrust. Trusting the internal CA lets it use Forward Trust.' }),

  // ---------------- 2.6 User-ID ----------------
  q('2.6', '2.6-userid-groups-cie', 'single', 1, 'What does LDAP group mapping provide to the firewall?', {
    options: ['Group membership of users', 'IP-to-user mappings', 'Client certificates', 'GlobalProtect tunnel IPs'], answer: [0],
    explanation: 'Group mapping gives membership. A separate mapping source supplies IP-to-user data.' }),
  q('2.6', '2.6-userid-groups-cie', 'single', 2, 'Refer to the exhibit. A rule uses the group Engineering as Source User but never matches. What is the cause?', {
    exhibit: `PA-HQ> show user group-mapping state all
Group Mapping(vsys1, type: active-directory): AD-Groups
        Number of Groups: 2
        cn=domain users,cn=users,dc=example,dc=com
        cn=helpdesk,ou=groups,dc=example,dc=com`,
    options: ['Engineering is not in the Group Include List', 'The update interval is too high', 'The bind account lacks a password', 'The user domain is NetBIOS'], answer: [0],
    explanation: 'Only included groups are learned. Add Engineering to the Group Include List.' }),
  q('2.6', '2.6-userid-groups-cie', 'fill', 1, 'What is the default group mapping update interval in seconds?', {
    answer: ['3600'], explanation: 'The default is 3600 seconds (one hour). Force a refresh with `debug user-id refresh group-mapping all`.' }),
  q('2.6', '2.6-userid-groups-cie', 'single', 2, 'What is a primary benefit of the Cloud Identity Engine over per-firewall LDAP group mapping?', {
    options: ['Firewalls get directory data from the cloud service instead of querying the directory directly, including cloud directories', 'It replaces security policy', 'It removes the need for IP-to-user mapping', 'It works without a device certificate'], answer: [0],
    explanation: 'CIE syncs on-prem and cloud directories centrally. Mapping sources are still needed, and the firewall needs a device certificate.' }),
  q('2.6', '2.6-userid-groups-cie', 'single', 3, 'Refer to the exhibit. A rule on group example\\Engineering does not match jsmith, although group mapping lists him as a member. What is the likely problem?', {
    exhibit: `PA-HQ> show user ip-user-mapping all
IP            Vsys   From    User     IdleTimeout(s)  MaxTimeout(s)
10.0.1.25     vsys1  UIA     jsmith   2410            2410

PA-HQ> show user group name "cn=engineering,ou=groups,dc=example,dc=com"
   source type: ldap  source: AD-Groups
   [1  ] example\\jsmith`,
    options: ['The mapping source reports the user without the example domain, so names differ between mapping and group data', 'The group mapping update interval has expired', 'The mapping timeout is too long', 'Group membership requires a certificate profile'], answer: [0],
    explanation: 'Mappings and groups must use the same user name form. Set the User Domain consistently on the mapping source and group mapping.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'single', 2, 'Which setting makes a zone use IP-to-user mappings for traffic entering it?', {
    options: ['Enable User Identification on the zone', 'Enable Packet Buffer Protection', 'Attach a zone protection profile', 'Set the zone type to Tunnel'], answer: [0],
    explanation: 'User-ID is applied per zone.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'multi', 2, 'Which three are sources of IP-to-user mappings? (Choose three.)', {
    options: ['Server monitoring of domain controller logs', 'GlobalProtect logins', 'Authentication Portal', 'LDAP group mapping', 'Zone protection profile', 'DNS proxy'], answer: [0, 1, 2],
    explanation: 'Group mapping only provides group membership. The zone protection profile and DNS proxy provide no user data.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'single', 2, 'Users sign in through a wireless controller or NAC that logs the user and IP via syslog. Which firewall feature learns the mappings?', {
    options: ['Syslog listener with a parse profile or filter', 'Server monitoring of the domain controllers', 'Group Include List', 'Client probing'], answer: [0],
    explanation: 'The firewall parses the syslog messages to extract user and IP.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'fill', 2, 'What TCP port does the Windows-based User-ID agent listen on by default?', {
    answer: ['5007', 'tcp 5007', 'tcp/5007'], explanation: 'Firewalls connect to the Windows User-ID agent on TCP 5007 by default.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'single', 2, 'Refer to the exhibit. The firewall shows no mappings from DC1. What is the cause?', {
    exhibit: `PA-HQ> show user server-monitor state all
Directory Servers:
Name    TYPE   Host              Vsys   Status
DC1     AD     dc1.example.com   vsys1  Access denied`,
    options: ['The service account lacks permission to read DC1 logs or use the chosen transport', 'The group mapping update interval is too long', 'User-ID is not enabled on the zone', 'The syslog listener is disabled'], answer: [0],
    explanation: 'Access denied points at credentials or permissions for the monitored DC. The other options do not appear in this output.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'single', 2, 'Refer to the exhibit. What does this configuration on PA-Branch1 achieve?', {
    exhibit: `PA-Branch1: Device > Data Redistribution > Agents
Name    Host/IP     Port  Collector Name  Data types
HQ-Hub  10.0.0.2    5007  PA-HQ           IP-User Mappings`,
    options: ['PA-Branch1 receives IP-to-user mappings from PA-HQ instead of reading domain controllers itself', 'PA-Branch1 sends its mappings to PA-HQ only', 'PA-Branch1 copies group membership from PA-HQ', 'PA-Branch1 redistributes routes to PA-HQ'], answer: [0],
    explanation: 'The firewall is configured as a Data Redistribution client (agent connection) to PA-HQ for IP-user mappings. The connection pulls data from PA-HQ; group membership and routes are unrelated.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'single', 2, 'Which feature limits the subnets whose mappings are forwarded or accepted in a segmented redistribution design?', {
    options: ['Include/Exclude Networks', 'Zone protection profile', 'Group Include List', 'Interface management profile'], answer: [0],
    explanation: 'Include/Exclude Networks scope which user subnets are learned or shared.' }),
  q('2.6', '2.6-userid-groups-cie', 'single', 2, 'Refer to the exhibit. Creating the Cloud Identity Engine profile on PA-HQ fails. What must be installed on the firewall first?', {
    exhibit: `Device > User Identification > Cloud Identity Engine > Add
Error: unable to connect to Cloud Identity Engine service
Device > Setup > Management > Device Certificate
Status: Not installed`,
    options: ['The device certificate', 'A Panorama HA license', 'A GlobalProtect gateway', 'A decryption policy'], answer: [0],
    explanation: 'The device certificate authenticates the firewall to the cloud service.' }),
  q('2.6', '2.6-userid-groups-cie', 'single', 2, 'A dynamic user group is used in a security rule. How do users join it?', {
    options: ['By being tagged, for example by a log forwarding Tagging action or the User-ID API', 'By being listed in the Allow List', 'By matching an LDAP filter on the zone', 'By connecting to a specific interface'], answer: [0],
    explanation: 'Dynamic user groups match on user tags.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'single', 2, 'Many users share one Remote Desktop server with a single IP. Which mapping source distinguishes them?', {
    options: ['Terminal Services agent', 'Syslog listener with a single filter', 'Group mapping', 'Client probing'], answer: [0],
    explanation: 'The TS agent assigns a port range per user so sessions from one IP can be attributed.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'order', 2, 'Order the steps for user-based security policy with Active Directory.', {
    items: ['Create the LDAP server profile', 'Configure group mapping with the Group Include List', 'Configure an IP-to-user mapping source', 'Enable User Identification on the internal zone', 'Write a security rule using the group as Source User'],
    explanation: 'Directory access, group mapping, mapping source and zone enablement must exist before policy can match users.' }),
  q('2.6', '2.6-userid-mapping-redistribution', 'match', 2, 'Match each source to the situation where it fits best.', {
    pairs: [['Server monitoring', 'Domain-joined Windows users logging on to AD'], ['GlobalProtect', 'Remote VPN users'], ['Authentication Portal', 'Unknown or unmanaged users in a browser'], ['XML/REST API', 'A custom or NAC system posting logins'], ['Terminal Services agent', 'Multiple users sharing one server IP']],
    explanation: 'Choose by how users log in.' }),
  q('2.6', '2.6-userid-groups-cie', 'single', 3, 'Which statement about the Cloud Identity Engine profile on a firewall is correct?', {
    options: ['The firewall collects attributes only for users and groups referenced in policy', 'It copies the whole directory to every firewall', 'It requires an LDAP bind account on each firewall', 'It replaces the need for the device certificate'], answer: [0],
    explanation: 'Limiting collection to what policy references keeps memory use down.' }),

  // ---------------- 2.7 web proxy ----------------
  q('2.7', '2.7-web-proxy', 'single', 2, 'Refer to the exhibit. The Proxy Type drop-down in Network > Proxy only offers None. What is the likely cause?', {
    exhibit: `Network > Proxy > Proxy Enablement
Proxy Type: [None v]   (Explicit Proxy and Transparent Proxy not selectable)
Device > Licenses: Threat Prevention, PAN-DB URL, WildFire, DNS Security`,
    options: ['The Web Proxy license is not active', 'The firewall is not in a zone', 'HA is not configured', 'The DNS proxy has a single server'], answer: [0],
    explanation: 'Only None appears until the web proxy license is active.' }),
  q('2.7', '2.7-web-proxy', 'single', 1, 'Which proxy mode requires clients (browser, PAC or WPAD) to be configured with the proxy address?', {
    options: ['Explicit proxy', 'Transparent proxy', 'Both', 'Neither'], answer: [0],
    explanation: 'In transparent mode a DNAT rule redirects traffic and clients are unaware.' }),
  q('2.7', '2.7-web-proxy', 'single', 2, 'Refer to the exhibit. Transparent proxy is enabled but clients browse without using the proxy. What is wrong?', {
    exhibit: `Policies > NAT
#  Name      Source Zone  Dest Zone   Dest Translation
1  snat-out  proxy-zone   untrust     none
2  snat-all  trust        untrust     none
3  dnat-prx  trust        proxy-zone  10.255.255.1:8080`,
    options: ['The DNAT rule is below the source NAT rules; it must come first', 'The translated port must be 443', 'The DNAT must use a static IP translation', 'Source NAT must be removed completely'], answer: [0],
    explanation: 'The docs require the DNAT rule to precede the SNAT rule. Port 8080 is the documented translated port, and SNAT is still needed after the DNAT.' }),
  q('2.7', '2.7-web-proxy', 'multi', 2, 'Which two items are required for both explicit and transparent proxy? (Choose two.)', {
    options: ['A loopback interface for the proxy', 'A DNS proxy object with primary and secondary DNS servers', 'A Kerberos keytab', 'WCCP redirection from a router', 'A SAML IdP profile'], answer: [0, 1],
    explanation: 'Both modes use a loopback and a DNS proxy with two servers. Kerberos and SAML apply only to explicit authentication, and WCCP is not supported.' }),
  q('2.7', '2.7-web-proxy', 'single', 2, 'Refer to the exhibit. Explicit proxy traffic is decrypted twice. Which change fixes the decryption rule?', {
    exhibit: `Interfaces: ethernet1/2 (zone trust, client), ethernet1/1 (zone untrust), loopback.1 (zone proxy, upstream)
Policies > Decryption: Decrypt-All   Source Zone: trust   Destination: untrust   Action: decrypt`,
    options: ['Change the source zone to proxy, the zone of the upstream interface', 'Change the destination zone to trust', 'Change the action to no-decrypt', 'Add the DNS proxy zone as destination'], answer: [0],
    explanation: 'Using the upstream interface zone as source decrypts once, on the proxy-to-internet leg. Matching the client zone decrypts on arrival and again on the way out.' }),
  q('2.7', '2.7-web-proxy', 'single', 2, 'Which is a supported authentication method for explicit proxy?', {
    options: ['Kerberos single sign-on', 'TACACS+', 'Local database', 'RADIUS access-challenge'], answer: [0],
    explanation: 'Explicit proxy supports Kerberos, SAML and Cloud Identity Engine (or no authentication).' }),
  q('2.7', '2.7-web-proxy', 'fill', 2, 'What translated destination port does the documented transparent proxy DNAT rule use?', {
    answer: ['8080', 'tcp 8080'], explanation: 'The DNAT rule translates to the proxy IP on port 8080.' }),
  q('2.7', '2.7-web-proxy', 'single', 2, 'What does Check domain in CONNECT & SNI are the same prevent?', {
    options: ['Domain fronting', 'DNS tunnelling', 'Kerberos replay', 'Certificate pinning'], answer: [0],
    explanation: 'It blocks requests where the CONNECT host and the TLS SNI differ.' }),
  q('2.7', '2.7-web-proxy', 'single', 2, 'Which statement about transparent proxy is correct?', {
    options: ['It needs no client configuration but does not support WCCP', 'It authenticates each user with Kerberos', 'It requires a PAC file', 'It works only for IPv6'], answer: [0],
    explanation: 'A DNAT rule steers traffic; there is no client setting. Web proxy supports IPv4.' }),
  q('2.7', '2.7-web-proxy', 'single', 3, 'A web proxy deployment uses a Layer 3 client interface, an internet interface and a loopback for the proxy. What is the recommended zone design?', {
    options: ['Each interface in its own zone, all in the same virtual router and vsys', 'All three in one zone', 'The loopback in a Tap zone', 'Each interface in a different vsys'], answer: [0],
    explanation: 'The documentation recommends separate zones in the same router and vsys.' }),
];
